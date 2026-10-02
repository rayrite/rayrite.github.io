# SWE-bench, Coding Agents, and a Rules-Aware Strategy for the Gemma 4 Developer Agent Competition

**A beginner-accessible, evidence-bounded handbook and competition preparation plan**

---

## 1. Title and Research Metadata

| Field | Value |
|---|---|
| Report title | SWE-bench, Coding Agents, and a Rules-Aware Strategy for the Gemma 4 Developer Agent Competition |
| Required filename | `swe-bench-gemma-4-consolidated-research-report.md` |
| Version | 1.0 |
| Prepared | 2026-10-02 |
| **Historical evidence cutoff** | **2026-10-02, inclusive** (fixed by the commissioning specification) |
| Actual execution / access dates | Primary competition documents: read 2026-10-02. External literature: accessed 2026-10-02. |
| Primary competition sources | Local snapshots of the official Kaggle Overview, Data, Rules and Getting Started pages (snapshot timestamp 2026-09-29), plus the organizer-authored `HARNESS_README.md` shipped inside the 22.42 GB competition data package. |
| Local prior-art reused | `input/kagglecomp/intel_20260930/` (discussion-board and paper-track sweeps, compiled 2026-09-30); earlier workspace deliverables in `deliverables/` (ADK primer 2026-09-30, LoRA primer 2026-10-01, BCF brain strategy 2026-09-29). |
| Research tooling | Web search and web fetch only, by instruction. No paid search APIs, no Tavily credits. |
| Report status | Complete. All research questions answered or explicitly bounded as unresolved. |
| Competition status | **VERIFIED EXISTS AND IS LIVE.** Identity, metric, model constraint, submission interface, timeline, and prize structure are all confirmed from official organizer text. |
| **Major correction to the commissioning brief** | The competition **does not use SWE-bench**. It uses an internally curated, private task set that follows the same construction recipe. See §6.1. |

### 1.1 Limitations of this report

These limitations are load-bearing. Read them before acting on any recommendation.

1. **The hidden test set cannot be inspected.** Roughly 120 test tasks were drawn from private repositories. Every statement about test-set difficulty is an inference from the 129 public development tasks, not an observation.
2. **No result in this report is a prediction of winning.** This report does not claim a score, a rank, or a probability of placing. It provides a plan and the evidence behind it.
3. **Leaderboard figures move.** Public scores in the first week ranged from 0.05 to 0.13, and a direct fork of identical code produced a ~0.04 swing. Treat any single number as a sample, not a measurement.
4. **The scoring stack was being actively repaired during the research window.** Several host-stated fixes were promised but unconfirmed at the evidence cutoff. §6.5 and §19.2 track these.
5. **Three of the recommended levers have no published evidence base** because they are too new or too specific. They are labelled hypotheses, not findings. See §14.4.
6. **This is not an implementation.** The specification excluded full implementation. Schemas, pseudocode, templates and experiment protocols are provided; working code is not.

### 1.2 A note on how to read this report

Chapters 1–6 are the ground truth about the competition. Chapters 7–13 are the field knowledge you need to compete well. Chapters 14–16 are where knowledge becomes decisions. Chapters 17–19 are the reality check. Chapters 20–22 are the plan. If you read nothing else, read §3 (executive summary) and §22 (playbook), then come back.

---

## 2. Original Request, Clarifications, and Assumptions

### 2.1 The original request, as commissioned

> Please write a deep and wide research system prompt for a comprehensive beginner's guide to learn all about SWE-Bench, leaderboards and what the scores mean, techniques and best practices for training coding agents, data science, collection, and analysis to improve performance, self-improvement algorithms, and a round-up of new advances and innovations in this space current as of Oct 2026. Please tailor the research, examples, and case studies to prepare a winning submission for the "Google - The Gemma 4 Developer Agent Competition" with more info at https://www.kaggle.com/competitions/gemma-4-developer-agent/overview

That prompt was converted into an executable research specification (16 workstreams, 14 research questions, 8 verification questions, 5 synthesis questions), which is what this report executes.

### 2.2 Clarifications and the defaults used

The commissioning specification listed ten clarification points (CQ-01 to CQ-10) and set a default for each so that work could begin without blocking on the user. The defaults actually used are recorded here, as required. **These are defaults adopted for the report, not claims about the reader.**

| ID | Clarification | Default used in this report |
|---|---|---|
| CQ-01 | Prior programming, ML, agent and RL experience | Comfortable Python, basic ML; new to SWE-bench, agent harnesses, and agentic RL. The report is written for that reader. |
| CQ-02 | Training compute and financial budget | No training budget assumed. A frozen-weights track is presented first; adaptation tracks are presented conditionally. |
| CQ-03 | Inference hardware and per-task budget | **Resolved from official sources** rather than parameterized: 4x NVIDIA L4, 32,768-token context, and a 12-hour total wall-clock budget across ~120 tasks. |
| CQ-04 | Team size and available time | Solo or 1–2 people. Max team size is 5 by rule, but the plan is built for a very small team. |
| CQ-05 | Desired implementation depth | Conceptual explanation, light mathematics, pseudocode, schemas, and experiment templates. Full implementation out of scope. |
| CQ-06 | Report length | Comprehensive modular handbook with no artificial quota and no duplicated chapters. |
| CQ-07 | Source openness | Closed systems included as context; recommendations favour reproducible methods. |
| CQ-08 | Historical vs. updated research | Fixed 2026-10-02 evidence cutoff preserved. Post-cutoff developments are quarantined in §25.9. |
| CQ-09 | Competition objective | Optimise the verified official metric: resolution rate. Efficiency is treated as a *feasibility* constraint, not as a scoring lever, because it is not scored. |
| CQ-10 | Existing code, experiments, private notes | No existing implementation assumed. Workspace prior-art is used as an unverified input and is labelled as such wherever it is load-bearing. |

### 2.3 Assumptions this report explicitly does **not** make

The commissioning specification forbade a specific list of unverified assumptions. The verification outcome for each is recorded below, because several turned out to be wrong in ways that change the plan.

| Forbidden assumption | Verification outcome | Consequence for the plan |
|---|---|---|
| The competition exists | **FALSE ASSUMPTION — it does exist.** Confirmed from official pages. | Proceed with a real, rules-aware plan. |
| The competition uses SWE-bench | **FALSE ASSUMPTION — it does not.** It uses an internally curated task set built with the same recipe, on private repositories. | SWE-bench is a *methodological* reference, not the test set. Do not tune against SWE-bench. |
| A particular Gemma checkpoint is available | **Resolved.** Exactly one base model is permitted: `gemma-4-31b-it-qat-w4a16-ct`. | All model-landscape analysis narrows to one model plus its LoRA adapters. |
| Fine-tuning is permitted | **RESOLVED — yes, via PEFT LoRA only.** Full fine-tuning is not a submission option. | Training strategy is LoRA-shaped, not full-FT-shaped. |
| Retrieval or external APIs are permitted | **AMBIGUOUS / CONSTRAINED.** The agent sandbox is air-gapped. The agent may ship and run its own Python/bash scripts and markdown knowledge files. External data and teacher-model distillation are permitted subject to a Reasonableness Standard. | No live API calls at inference. Distillation is allowed but licence-clean. |
| Multi-agent systems are permitted | **RESOLVED — yes.** ADK supports `SequentialAgent`, `ParallelAgent`, `LoopAgent`, `sub_agents`, and `agent_tool` with `skip_summarization`. | Multi-agent topology is a legitimate design lever. |
| The submission is a notebook or container | **FALSE ASSUMPTION.** The submission is a declarative YAML agent config compiled into an ADK agent, packaged as `submission.zip`. | Python entrypoints are forbidden; logic moves into ADK Skills scripts. |
| A published SWE-bench score predicts competition performance | **FALSE ASSUMPTION.** Different dataset, different harness, different model, different budget. | Published scores are context for method selection, not targets. |
| A winner is achievable | **NOT CLAIMED.** | See §1.1. |

### 2.4 One clarifying question the reader should answer before Day 1

The single most consequential unknown is not a rule — it is a **capability** question: *at 4x L4 with a 32k context and roughly six minutes per task, how much of a repository can this model actually read and reason about before the budget runs out?* Every other decision in this report is downstream of that measurement. §21.2 makes measuring it the first task.

---
## 3. Executive Summary — Read This First

### 3.1 Verified contest status

**The competition is real, live, and verified.** The handoff's non-assumption that it might not exist was tested and rejected: the identity, rules, data schema, and harness were confirmed from the official competition pages and from the organizer's own `HARNESS_README.md`, which ships inside the data package. As of the 2026-09-29 snapshot the competition had 5,800 entrants, 864 participants, 829 teams, and 2,004 submissions, closing 2026-12-02. [V]

**It does not use SWE-bench.** This is the single most consequential finding, and it invalidates the framing the request arrived with. The task set is organizer-built from real merged pull requests on real repositories; roughly half of the graded instances come from **private repositories**. SWE-bench is a methodological reference here — it teaches you how the task family works, and it tells you nothing about the test set you are scored on. **Tuning against SWE-bench tunes against the wrong distribution.**

### 3.2 The five facts that explain everything else

| # | Fact | Why it dominates |
|---:|---|---|
| 1 | **The agent and the grader read different tests.** The hidden test patch rewrites tests to match the reference fix, and agent edits to test files are silently reset. | A correct fix can turn the visible suite red, and every local signal punishes you for it. This single asymmetry is likely worth more than any prompt engineering |
| 2 | **~6 minutes per task, 12 hours total, one submitted patch.** Derived, not documented: 720 ÷ ~120. | The budget binds before the model does. Almost every technique that wins on SWE-bench is unaffordable here |
| 3 | **The model is frozen.** `gemma-4-31b-it-qat-w4a16-ct`, and only LoRA may adapt it. | The scaffold is the artifact. The verified ACI ablation is +7 points with weights held constant |
| 4 | **The score is a proxy.** Independent research found automated resolution overstates how often a human would accept the patch. | Optimise "the hidden tests go green" without pretending that means the fix is right |
| 5 | **60 tasks cannot see small differences.** One task = 1.67 points; a 12% score carries ≈ ±8 points. | You need ~6 outright wins with no regressions before believing anything. Plan for two experiments, not ten |

### 3.3 The highest-confidence findings

**Tier 1 — primary sources or self-contained arithmetic. Settled.**

- Resolution requires **every** `FAIL_TO_PASS` test to pass **and every** `PASS_TO_PASS` test to still pass. A patch that regresses anything scores identically to no patch. [V]
- The submission is a `submission.zip` with exactly one root `agent.yaml`; the sandbox is air-gapped (`network_mode="none"`); 4 GiB RAM and 2 vCPU per container; a 300 s per-command timeout; effective context ≈ 14,336 tokens after compaction against a 32,768 maximum. [V]
- **The competition scores the submitted artifact (quantity 4), which is bounded above by selected-patch success (3), which is bounded above by oracle success (2).** You cannot submit a portfolio; selection must happen online without the answer key. [V + structural]
- Repeated sampling moved a model from **15.9% to 56%** on SWE-bench Lite — a 40-point *oracle* gap you are almost entirely unable to capture, because k≈1–4 fits the budget and your verifier is weak. [V]
- A minimal ~100-line scaffold reached **65%** on SWE-bench Verified; a bare shell with the same frontier model scored 11.00% and a badly-integrated RAG variant scored **2.67%**. Complexity is a liability, and it is a bigger liability on a tight budget. [V]
- Pretraining contamination of the four public repositories **cannot be ruled out** and cannot be measured from outside. Document it; do not claim otherwise. [C]

**Tier 2 — well-supported, with a named gap you can close in an hour.**

- `edit_file` payloads failed **62%** of the time when JSON-wrapped and **0%** of the time as raw text, measured in this harness. The largest measured effect in the report, and free to fix. [R, single-source, trivially reproducible]
- `search_similar_code` returned >100,000 characters on 6 of 6 calls, ending tasks; its offline resolver matches **symbol names, not prose**; its embeddings are near-degenerate. [R]
- Local grading was observed **anti-correlating** with the leaderboard because the local environment was broken. Your CV is meaningless until the gold-patch control passes 100%. [R]
- The LoRA path has two documented failure modes — a KV-cache collapse from 46,048 to ~7,600 tokens with an adapter mounted, and silent adapter zeroing — and **no adapter submission had scored at the evidence cutoff**. [R]

**Tier 3 — hypotheses this report advances. Test them; do not assume them.**

- Encoding the visible-vs-graded asymmetry as an explicit agent rule.
- Symbol-seeded graph navigation over prose queries.
- Scope discipline: implement the issue's most concrete instruction first, add the rest only if budget remains.
- Depth beats breadth at this budget, because the only available verifier is weak.

### 3.4 The recommended strategy branch

**Branch A — frozen weights, editable scaffold — is the primary track. Branch B — one targeted LoRA — is a strictly gated parallel experiment.**

| Dimension | Branch A (primary) | Branch B (gated) |
|---|---|---|
| What you do | Prompts, tools, skills, topology, localization, budget, stopping | All of A, plus one adapter from your own trajectories |
| Gate | None | The §21.3 canary, C1–C5, must pass |
| Downside if wrong | You leave adapter-mediated gains on the table | **A silent zero.** Adapter zeroing and KV collapse fail *quietly* |

**Why A leads, stated structurally rather than ideologically.** Branch B's entire value is contingent on an infrastructure path that had produced no scored adapter submission at the cutoff, and whose known failure modes are silent rather than loud. **A plan whose main line can vanish on submission day with no warning is not a main line.** Build a complete, competitive Branch A submission that touches no adapter. Add the adapter only if the canary passes. If it fails, you have lost an afternoon and nothing else.

**What Branch A forecloses:** improving protocol adherence or tool-call formatting at the weight level. Some of that is reachable by prompt and skill; some is not. That residual is the honest cost.

### 3.5 The five critical unknowns, in the order you should resolve them

| # | Unknown | Blocks | Cost to resolve |
|---:|---|---|---|
| **1** | **Your measured decode rate** at TP=4 on L4 | The entire architecture. At 30 tok/s a task affords 1–2 turns and your agent must be near-stateless; at 100 tok/s you can afford a real tool loop | ~2 h |
| **2** | **Whether the local environment is sound** | Every number you will ever measure | ~2 h — run the gold-patch control on 20–30 tasks; it must be 100% |
| **3** | **Whether the LoRA path works** | Whether Branch B exists | ~3 h — five canary checks |
| **4** | **Container setup time**, measured separately from agent time | Your real 12-hour schedule. Setup is inside the 12 h and outside the per-task budget — the most commonly underestimated block | ~1 h |
| **5** | **The four `eval_config.yaml` defaults when unset** | Whether an omitted field means no limit | ~1 h — run the scorer locally with fields omitted |

**Note what is *not* on this list.** Gemma 4's `hidden_size` and attention-head counts were flagged by one workstream as "the single biggest unknown for capacity planning." They are in the model config that ships with the weights you are about to download. **One `cat config.json`, and it stops being an unknown.**

### 3.6 The immediate next actions

1. **Stand up the local environment** from the organizer's wheelhouse and Getting Started notebook. Nothing works without this.
2. **Run the gold-patch control on 20–30 public tasks. It must be 100%.** If it is not, fix the environment before doing anything else. This is the most common and most expensive mistake available.
3. **Run the no-patch control.** It must be 0%, or those tasks are not discriminating.
4. **Measure the decode rate** and turn it into a tool-call budget. This is your branch point.
5. **Run the four harness micro-tests:** raw-text `edit_file`, `read_file` with a line range, `search_similar_code` output size, and dirty-tree capture without `submit_patch()`.
6. **Run the LoRA canary.** Five checks, one afternoon, and it converts the worst case from silent to known.
7. **Set `max_time_minutes` in `eval_config.yaml` as a failsafe.** Fifteen minutes of work against a documented behaviour that errors an entire 12-hour run.
8. **Then build.** Minimal scaffold, the six rules in §11.8, and a failure histogram before any sophistication.

### 3.7 What this report is, and what it is not

**It is** a grounded, permission-tagged, statistically honest consolidation of the competition's rules and harness, the SWE-bench method, and the 2025–2026 state of scaffolds, training, and inference-time compute — with every number tagged by evidence class and every recommendation traceable to a source or a named testable hypothesis.

**It is not** a prediction of your score, and it is not equally well-evidenced throughout. The competition facts, harness mechanics, statistical arithmetic, and the SWE-agent ablation results come from primary sources. **Much of the model-landscape and training literature does not** — the session's 200-call web-search budget was exhausted by six parallel workstreams before secondary sources could be verified, and most model cards returned HTTP 401. That gap is documented rather than papered over: §17 opens with an evidence-quality statement, §10.3 explains why its central table is nearly empty, §19.3 states the strongest case against the report's own recommendations, and §25.7 item 12 records the access limitation in the search log.

**The honest summary of that limitation:** the competition-specific findings are strong; the general literature findings are directional rather than quantitative. Where a number could not be verified, it is marked and no conclusion rests on it.

---

---

## 4. Scope, Glossary, and Conceptual Map

### 4.1 What this report covers, and what it deliberately does not

**In scope.** How repository-level issue repair is constructed and scored; how to read a leaderboard score without fooling yourself; how to build an evaluation you can trust; which agent scaffold mechanisms have real evidence behind them; how to collect, decontaminate and analyse agentic training data; how to adapt a model (here: with LoRA on a quantized base); what self-improvement can and cannot do; how to spend a hard test-time compute budget; what the systems constraints imply about feasibility; what materially changed in 2025–2026; and a rules-aware plan for this specific competition.

**Out of scope, deliberately.** Actually training a model or submitting to Kaggle. Foundation-model pretraining. Generic AI commentary. Legal advice. Obtaining private test labels or exploiting evaluation infrastructure. Anything about malware or exploit payloads. Unannounced future developments presented as fact.

### 4.2 Glossary — define these before the first substantive use

The single most common beginner error in this field is using these words as if they were interchangeable. They are not.

| Term | What it actually means | Common misuse |
|---|---|---|
| **Repository-level issue** | A bug report or feature request filed against a real codebase, paired with the commit that actually fixed it. | Treating it as a unit-test-writing exercise. |
| **Instance** | One (issue, base commit, gold patch, test patch) tuple. The atom of a benchmark. | Calling a dataset an instance, or an instance a task suite. |
| **Base commit** | The repository state immediately *before* the fix. The agent works here. | Confusing it with the fix commit. |
| **Gold patch** | The human maintainer's actual fix. Present in the public training set, withheld in the test set. | Assuming the gold patch is the only acceptable answer. |
| **Test patch** | The diff that adds the tests which discriminate fixed from broken. | Assuming tests were written after seeing your patch. They were not. |
| **FAIL_TO_PASS** | Tests that fail on the base commit and pass once fixed. The actual target. | Assuming every test in the file is one of these. |
| **PASS_TO_PASS** | Tests that already passed and must keep passing. The regression guard. | Ignoring them, and failing the task by breaking something unrelated. |
| **Resolution rate** | Resolved instances / total instances. The competition's score. | Reading it as "percentage of code the model writes correctly." |
| **Harness** | The evaluation machinery: sandbox construction, patch application, test execution, result parsing. | Conflating the harness with the agent. Most benchmark drama is harness, not model. |
| **Scaffold** | The agent program around the model: prompts, tool definitions, control loop, stopping rules, verification. | Blaming the model for a scaffold defect. |
| **Trajectory** | The full record of one agent episode: every prompt, tool call, tool result, and edit. | Treating a trajectory as a single (prompt, response) pair. It is not. |
| **SFT on trajectories** | Supervised fine-tuning on recorded agent episodes, teaching multi-turn tool use. | Assuming it teaches *problem solving*. It mostly teaches *protocol*. |
| **RLVR** | Reinforcement learning with a programmatically checkable reward. | Assuming the verifier is trustworthy. It is a program, not an oracle. |
| **Oracle pass@k** | "At least one of k samples would have passed," with hindsight. | Presenting it as achievable. It requires the answer key. |
| **Selected success** | The one patch you actually chose — without the answer key — passed. | Reporting oracle numbers as if they were selected numbers. |
| **Pass@k convention** | The exact sampling and aggregation rule behind a k-attempt number. | Assuming k=1 because two numbers look similar. |
| **Contamination** | Benchmark test material leaking into training data, or into the model's pretraining. | Assuming a model is clean because its provider says so. |
| **Decontamination** | Actively removing leaked material from a training corpus. | Assuming deduplication implies decontamination. It does not. |
| **Test-time compute** | Compute spent after the weights are fixed: sampling, search, verification, reranking. | Conflating it with training compute when reading a comparison. |
| **LoRA / PEFT** | Low-rank adapter fine-tuning: train small added matrices, leave the base frozen. | Assuming it is equivalent to full fine-tuning. It is not. |
| **QAT** | Quantization-aware training — the model is *trained* at low precision so it survives it. | Assuming post-training quantization of an fp16 model is equivalent. It is not. |
| **KV cache** | The attention key/value state held per token per sequence. Scales with context × concurrency. | Ignoring it when sizing a 32k-context server. |
| **Adaptive overfitting** | Overfitting a validation set through many rounds of selection against it. | Calling it "tuning." It invalidates the estimate. |

### 4.3 The conceptual map — one task, end to end

Every idea in this report attaches to a position in this pipeline.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. ISSUE          A human files an issue against a real codebase            │
│                    (problem_statement; sometimes hints_text)                │
└─────────────────────────────────────────────────────────────────────────────┘
                                   │  becomes the task prompt
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 2. ENVIRONMENT     Snapshot the repo at base_commit.                        │
│                    FUTURE GIT HISTORY IS STRIPPED.                          │
│                    Editable install. Hermetic pytest.ini + conftest.py.     │
│                    Committed as "baseline" so `git diff HEAD` = your work.  │
└─────────────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 3. MODEL          gemma-4-31b-it-qat-w4a16-ct  (+ optional LoRA adapters)   │
│                    Served by one vLLM instance, TP=4, max_model_len=32768 │
│                    Thinking mode on/off via thinking_budget                │
└─────────────────────────────────────────────────────────────────────────────┘
                                   │  drives
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 4. SCAFFOLD       Your agent.yaml: instruction, tools, sub-agents, skills. │
│                    The CONTROL LOOP is yours, not the harness's.           │
│                    Loop: think → call a tool → read the result → repeat.   │
└─────────────────────────────────────────────────────────────────────────────┘
                                   │  calls
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 5. TOOLS          run_command · read_file · edit_file · write_file         │
│                    get_status · submit_patch                                 │
│                    get_code_neighbors · search_similar_code · get_code_subgraph│
│                    (+ your own skills: run_skill_script, load_skill_resource)│
└─────────────────────────────────────────────────────────────────────────────┘
                                   │  mutates
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 6. PATCH          submit_patch() → git add -N . → git diff --binary        │
│                    (fallback: harness captures a dirty tree even if you     │
│                     never called submit_patch — but only if it is dirty)    │
└─────────────────────────────────────────────────────────────────────────────┘
                                   │  transferred
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 7. VERIFICATION   FRESH Container B.                                       │
│                    Apply agent_patch (4-pass resilient git apply / patch).  │
│                    RESET all test files + runner config to HEAD.           │
│                    Apply the hidden test_patch.                            │
│                    Run hermetic pytest.                                    │
│                    resolved ⟺ exit 0 AND JUnit XML shows >0 passed,        │
│                                   0 failures, 0 errors, no skips.          │
└─────────────────────────────────────────────────────────────────────────────┘
                                   │  produces
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 8. SCORE          Resolution Rate = resolved / total ∈ [0,1]               │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.4 The five facts that explain almost every surprise in this competition

If you understand these five, most of the confusing behaviour in the field becomes predictable.

1. **The agent and the grader do not see the same tests.** The agent runs the repository's *visible* test suite. The grader resets every test file to baseline and applies a *hidden* `test_patch` it has never shown the agent. An agent can therefore make its local tests pass and still score zero — and worse, can correctly follow the issue text, turn its local suite red, and "helpfully" revert. This inversion is the single most important trap in this task family. See §7.6 and §18.1.
2. **The score is a proxy, not correctness.** METR found that roughly half of AI PRs that passed SWE-bench Verified's automated grader would not have been merged by maintainers, with the merge rate averaging 24 percentage points below the grader score ([METR, 2026-03-10](https://metr.org/notes/2026-03-10-many-swe-bench-passing-prs-would-not-be-merged-into-main/)). Resolution rate measures "the hidden tests went green," which is necessary and far from sufficient.
3. **A tiny benchmark cannot resolve small differences.** With ~58 public and ~60 private leaderboard tasks, one task is worth ~1.7 points. The observed run-to-run swing on identical code was ~0.04. Most "improvements" measured in this setting are inside the noise. See §9.3 for the arithmetic.
4. **The budget binds before the model does.** Twelve hours for ~120 tasks is ~6 minutes per task, inclusive of sandbox setup. A thinking-enabled 31B model on 4 PCIe-attached L4s will not finish a careful multi-file investigation in six minutes. The binding constraint is *time*, and the highest-leverage decisions are budget and stopping policy, not prompting cleverness. See §16.
5. **The harness is part of the model, and it is unstable.** Observed week-one failures included double-JSON-encoded tool results causing a 22% `edit_file` failure rate, reasoning content silently dropped between turns, a KV-cache collapse from 46k to 7.6k tokens whenever a LoRA adapter was mounted, and uncapped graph-tool output that ended tasks with context-window overflow. Until your own run reproduces the behaviour you are relying on, treat it as a hypothesis. See §6.5 and §19.2.

---

## 5. Methodology and Evidence Standards

### 5.1 How this research was conducted

The work executed the sixteen-workstream protocol specified in the commissioning handoff. Stage 0 (competition intelligence) was completed from primary sources before any dependent workstream began. Stages 1–5 dispatched independent specialist workstreams in parallel, each bound by a shared evidence protocol (§6 of the commissioning specification) and each told what was already verified so it would not re-derive it. Stages 6–10 — timeline, cases, counterevidence consolidation, strategy synthesis, and red-team review — ran after their dependencies landed. Counterevidence searching ran continuously rather than as a terminal phase, because a red team that starts last has already been framed by the work it is meant to challenge.

### 5.2 The source hierarchy used

The right source depends on the claim being made. This report never uses a single tier for everything.

| Claim type | Source tier actually required | Tiers deliberately rejected for it |
|---|---|---|
| Competition rules, permissions, deadlines | Official organizer text (Kaggle Rules, Overview, Data pages, organizer `HARNESS_README.md`) | Blog posts, forum hearsay, prior workspace notes |
| Metric and scoring mechanics | Evaluator code and harness documentation | Interpretation from a scoreboard |
| Dataset properties | Dataset cards, official schema documentation, the shipped data itself | Prior workspace summaries |
| Model properties | Checkpoint cards, license text, harness registry | Vendor marketing copy |
| Effectiveness of a method | Controlled studies with disclosed protocol, independent replications | Single-result vendor announcements |
| Operational failure modes | Version-specific issue reports with reproduction detail | General speculation |

**Two standing rules were applied throughout.** First, an original source is not automatically methodologically strong — a vendor's own experiment is evidence *of* that vendor's result, not evidence that the result generalizes. Second, a peer-reviewed paper is not automatically independently replicated.

### 5.3 Evidence labels used in this report

Every load-bearing claim carries separate, non-collapsed quality attributes. Collapsing them into a single "confidence" score destroys exactly the information a reader needs.

| Label | Meaning | How to read it |
|---|---|---|
| **[V]** | Verified from a primary source in this workspace or from the organizer's own documentation | Act on it, re-check if it is a mutable page |
| **[R]** | Reported result from a controlled study | Believe the direction; check the protocol before trusting the magnitude |
| **[D]** | Derived estimate — a calculation shown in this report, not a measurement | Check the assumptions; the arithmetic is auditable |
| **[H]** | Hypothesis — plausible, actionable, not yet evidenced | Test it cheaply before spending on it |
| **[C]** | Contradicted or contested in the sources | Do not act without resolving it first |
| **[U]** | Unverified — searched for, not found | Treat as unknown, not as absent |
| **[A]** | Ambiguous — official wording admits competing readings | Get a ruling or choose the conservative branch |

### 5.4 The independence rule

Two pages repeating the same vendor experiment are **one result, not two confirmations**. Where a number appears in several places, this report traces it to its origin and counts it once. Where an independent re-measurement exists, it is counted separately and the disagreement is preserved rather than averaged away.

### 5.5 Statistics this report commits to

The commissioning specification made an explicit statistical contract, and this report holds to it rather than treating statistics as an optional appendix.

- **Numerators and denominators are always shown.** "34% resolved" is meaningless without "34/100".
- **Intervals are chosen to match the design.** A single resolution rate gets a Wilson or Clopper–Pearson interval. Two agents on the same tasks get a *paired* comparison — McNemar's exact test for paired binary outcomes, or a paired bootstrap — not two independent intervals eyeballed against each other.
- **Repository clustering is respected.** Tasks from the same repository are not independent. With only four public repositories, effective sample size is much smaller than the task count. §9.3 does this arithmetic explicitly.
- **Infrastructure failures are reported separately from agent failures.** A task that errored because a wheel was missing is not a task the agent failed.
- **Oracle and selected success are never conflated.** §9.5 defines four distinct quantities, §15.3 applies them to this budget, and this report uses the terms precisely.
- **Exploratory and confirmatory work is separated.** Anything found by searching many configurations is exploratory and is re-tested on untouched data before being believed.
- **No universal seed count is prescribed.** Repetition counts follow pilot variance and available budget.

### 5.6 What this report refuses to do

It does not promise a winning score. It does not invent a hyperparameter, a compute figure, or a result to fill a table. It does not report oracle pass@k as if it were deployable success. It does not present two incompatible percentages as one ranking. It does not claim a competition exists, or that a checkpoint is available, or that a permission is granted, without official support. And it does not accuse any named system of contamination or gaming without documented evidence — where such a claim circulates but cannot be substantiated, it is labelled as an unsubstantiated allegation and kept out of the conclusions.
---

## 6. Competition Fact Sheet and Compliance Map

> **Verification basis.** Every field below is taken from the organizer's own text: the official Kaggle Overview, Data and Rules pages (local snapshots captured 2026-09-29, read 2026-10-02) and the organizer-authored `HARNESS_README.md` shipped inside the competition data package. Where a field is not stated by the organizer, it is marked **Not disclosed** rather than estimated. Where the organizer has not answered a question, it is listed as an open ambiguity rather than guessed.

### 6.1 Identity and the single most important correction

| Field | Verified value | Source | Confidence |
|---|---|---|---|
| Competition name | Google - The Gemma 4 Developer Agent Competition | [Overview](https://www.kaggle.com/competitions/gemma-4-developer-agent/overview) | High |
| Kaggle competition ID | 149921 | Overview page asset paths | High |
| Host | Google DeepMind | Overview | High |
| Sponsor | Google LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043 USA | [Rules §1.2–1.3](https://www.kaggle.com/competitions/gemma-4-developer-agent/rules) | High |
| Competition type | Featured Prediction Competition; skills-based | Overview, Rules preamble | High |
| Official citation | Elan Markowitz, Bryan Perozzi, Benedek Rózemberczki, Glenn Cameron, Hadi Hemmati, Yuchen Li, Michael Galkin, Majid Farhadi, Ryan Holbrook, Ashley Oldacre. *Google - The Gemma 4 Developer Agent Competition.* https://www.kaggle.com/competitions/gemma-4-developer-agent, 2026. | Overview, Citation | High |
| Stated mission | "Post-train an open model into a reliable agent that navigates complex codebases and drafts fixes for real software issues, accelerating developer workflows on everyday hardware." | Overview, Description | High |
| Open status | **OPEN.** Started 2026-09-23. Accessed 2026-10-02. | Overview | High |

> #### ⚠️ Correction: this competition does **not** use SWE-bench
>
> The Overview says the scoring is *"**Similar to** [SWE-Bench](https://www.swebench.com/SWE-bench/), your agent's submitted patches are evaluated by a PASS/FAIL metric"* ([Overview, Issue Scoring](https://www.kaggle.com/competitions/gemma-4-developer-agent/overview)). "Similar to" is doing real work in that sentence.
>
> The task set is **organizer-built and private**. The Data page states: *"Participants are provided with a training set... Submissions are evaluated against a test set curated under a similar pipeline, with identical graph generation methods, and verification standards"*, and *"There are about 120 tasks in the test set, evenly divided between the public and private splits. **The test set was curated from a set of private repositories.**"* ([Data page](https://www.kaggle.com/competitions/gemma-4-developer-agent/data)).
>
> **What follows from this, and it changes the strategy:**
> - SWE-bench is a **methodological reference**, not the test set. Do not tune against SWE-bench instances; they are not drawn from the same repositories.
> - The test repositories are **private**, which is a deliberate contamination barrier. It also means you cannot pre-build a repo-specific tool or a per-repository index for the test set — any such artifact would be both impossible to build and outside the rules.
> - The public development set is a **proxy distribution**, not a sample of the test distribution. Its repository mix (67 fastapi / 48 rich / 13 requests / 1 httpx, per workspace measurement) tells you what kinds of Python code the organizers like, not what is in the hidden set.
> - The organizer's own dataset construction follows the SWE-bench recipe: commit-and-PR mining for changes that jointly touch logic and tests, issue linking, de-noising, and two-phase fail-to-pass / pass-to-pass execution verification, plus a frontier-model "near completion" check on the test set ([Data page, Dataset Generation & Verification Pipeline](https://www.kaggle.com/competitions/gemma-4-developer-agent/data)).

### 6.2 Task, data, and evaluation

| Field | Verified value | Source | Confidence |
|---|---|---|---|
| Task | Real-world Python bug fixes and feature requests | Data | High |
| Public training tasks | **129**, in `tasks.jsonl`; each ships the gold `patch` and the `test_patch` | Data | High |
| Public task repositories | `fastapi/fastapi`, `Textualize/rich`, `psf/requests`, `encode/httpx` | Data | High |
| Test tasks | **~120**, split evenly between the public and private leaderboards, curated from private repositories | Data | High |
| Public leaderboard resolution | Reported by a community EDA notebook as **58 tasks**; the Overview snapshot showed ~2,004 submissions against 829 teams | Data; workspace intel 2026-09-30 | Moderate — community-measured, not organizer-published |
| Instance schema | `instance_id`, `repo`, `base_commit`, `problem_statement`, `hints_text`, `patch`, `test_patch`, `created_at` | Data | High |
| Snapshot construction | `git fast-export` up to `base_commit` into a fresh repo — **commits after `base_commit` do not exist in `.git`** | HARNESS_README §4.2 | High |
| Graph assets | 129 task-named + 127 commit-named NetworkX AST graphs; node `id` is the fully qualified symbol path; node carries the full source `text`; edges typed `calls` | Data; HARNESS_README §6.3 | High |
| Embedding assets | 129 + 127 `.npz` archives, `float32` vectors of length 256 per graph node | Data | High |
| Offline wheels | 124 pre-built `.whl` files covering historical dependency versions, mounted read-only at `/wheels/` | Data | High |
| Dataset size | 22.42 GB, 524 files | Data | High |
| Dataset licence | Apache 2.0 (Competition Use and Commercial) | Data, Rules §1.7 | High |
| **Metric** | PASS/FAIL per issue. *"Your submission's overall score is the percentage of patched repositories that pass the validation tests."* | Overview, Issue Scoring | High |
| **Metric formula** | Resolution Rate = resolved tasks / tasks in the evaluation split, ∈ [0, 1] | HARNESS_README §8.2.5 | High |
| **Resolution criterion** | `pytest` exit code 0 **AND** JUnit XML validation: `passed_tests > 0`, `failures == 0`, `errors == 0`, and every required node (FAIL_TO_PASS, PASS_TO_PASS, or test functions extracted from `test_patch`) passed without being skipped | HARNESS_README §8.2.5 | High |
| Anti-tampering | All file paths in `test_patch`, plus protected test files and runner config touched by `agent_patch`, are reset to `eval_baseline` via `git checkout HEAD` + `git clean -f` before the official test patch is applied | HARNESS_README §8.2.3 | High |
| Patch application | 4-pass resilient fallback: `git apply` (-p1, then -3, then whitespace-tolerant, then `--recount`) → symlink-normalized `git apply` → prefixless `-p0` → GNU `patch -p1`/`-p0` under `--dry-run`. All four failing ⇒ task fails. | HARNESS_README §8.2.2 | High |
| Test execution | `PYTHONSAFEPATH=1 PYTHONNOUSERSITE=1 python3 -s -m pytest <targets> --junitxml=... -p no:anyio -o timeout=0 -o python_classes="Test* *Test" -q` | HARNESS_README §8.2.4 | High |
| Sandbox | Air-gapped (`network_mode="none"`), 4 GiB RAM, 2 vCPU, working dir `/workspace`, warm container pool fully wiped between phases | HARNESS_README §4.1 | High |
| Patch extraction | `submit_patch()` runs `git add -N .` then `git diff --binary _swegemma_baseline 2>/dev/null \|\| git diff --binary HEAD` | HARNESS_README §8.1 | High |
| **Unsubmitted-patch fallback** | If the agent never calls `submit_patch()`, the harness runs the same diff automatically before tearing down the container — **but only if the working tree is non-empty** | HARNESS_README §8.1 | High |

### 6.3 Model, adapters, and submission contract

| Field | Verified value | Source | Confidence |
|---|---|---|---|
| Permitted base model | **`gemma-4-31b-it-qat-w4a16-ct` only.** *"you must choose this model for every agent and subagent"* | Overview, Model Selection | High |
| Model registry enforcement | `ALLOWED_MODEL_NAMES = frozenset({'gemma-4-31b-it-qat-w4a16-ct'})`; `validate_single_declared_model()` requires exactly one unique base model across the root config, every `sub_agents[*].config_path`, every `tools[*].agent_tool.config_path`, and standalone agent YAMLs. Violation raises `ParticipantVisibleError`. | HARNESS_README §3.2 | High |
| Adaptation permitted | **Yes — PEFT LoRA only.** `adapter_config.json` + `adapter_model.safetensors` under `adapters/<name>/`, referenced by `adapter: <name>` on any `LlmAgent` | Overview; HARNESS_README §3.4 | High |
| Per-agent adapters | Different agents/subagents may use different adapters (e.g. `main_lora` on the coder, `tool_lora` on a read-only analyzer) | Overview; HARNESS_README §3.4 | High |
| Serving constraints | `enable_lora=True`, `max_loras=8`, `max_lora_rank=128` | HARNESS_README §3.1 | High |
| Adapter size guidance | r=16 ≈110–220 MB; r=32 ≈220–450 MB; r=64 ≈450–900 MB; r=128 ≈0.9–1.8 GB (31B, bf16 math, all linear projections) | HARNESS_README §3.4 | High (guidance, not a measured figure) |
| Submission artifact | `submission.zip` with `agent.yaml` **at the archive root** | Overview; HARNESS_README §2.2 | High |
| Root config discovery | Exactly one of `agent.yaml`, `agent.yml`, `root_agent.yaml`, `root_agent.yml`. Zero ⇒ `MissingRootConfigError`; more than one ⇒ `MultipleRootConfigsError`. | HARNESS_README §2.2 | High |
| Config language | Google ADK Agent Config ([adk.dev](https://adk.dev/agents/config/)) with sandbox restrictions; submissions are **compiled** into ADK agents | Overview; HARNESS_README §2.1 | High |
| **No Python entrypoint** | Competitors do not submit `agent.py` or an agent function. `adk-submission` replaces standard ADK's `from_config()` (which permits arbitrary dynamic imports) with a sandboxed YAML compiler; `importlib` is never used. | HARNESS_README §2.1 | High |
| Agent classes | `LlmAgent` (default), `SequentialAgent`, `ParallelAgent`, `LoopAgent` (`max_iterations` default 500, bounded 1–500) | HARNESS_README §2.3 | High |
| Unpacked size limit | **< 3 GiB** (`3,221,225,472` bytes) including all `adapters/` | HARNESS_README §2.4 | High |
| Permitted extensions | `.yaml`, `.yml`, `.md`, `.txt`, `.py` (skill scripts), `.json` (`adapter_config.json`), `.safetensors`. Pickle weights (`.bin`, `.pt`, `.pth`) and other binary/archive extensions are **rejected**. | HARNESS_README §2.4 | High |
| Structural ceilings | 10,000 files; 1,000 YAML files; 50 MiB per YAML file / cumulative `!include`; 50 MiB per skill directory; 1,000,000 instruction chars per agent (10,000,000 total); 500 agents; 50 levels of sub-agent depth; 1,000 skills | HARNESS_README §2.4 | High |
| `!include` sandboxing | Paths resolve relative to the including file. Absolute paths, null bytes, `..` traversal, and symlinks resolving outside the submission root are blocked (`PathTraversalError`). YAML includes recurse to depth 10 with cycle detection. | HARNESS_README §2.2 | High |
| Sandbox-bypass fields | `tools`, `system_instruction`, `http_options`, `safety_settings`, `response_schema` inside `generate_content_config` are excluded by schema design and raise a validation error if set | HARNESS_README §2.4 | High |

### 6.4 Tools, budgets, and generation limits

| Field | Verified value | Source | Confidence |
|---|---|---|---|
| Built-in tools | 9: `run_command`, `submit_patch`, `get_status`, `read_file`, `edit_file`, `write_file`, `get_code_neighbors`, `search_similar_code`, `get_code_subgraph` | Overview; HARNESS_README §6 | High |
| `run_command` | `/bin/bash -c` in `/workspace`; timeout `min(300s, remaining time)`; stdout and stderr truncated to 5,000 chars; a timeout returns an error **without ending the session** | HARNESS_README §6.1 | High |
| `edit_file` | 3-tier resilient matching — `exact` → `flexible` (whitespace-normalized, re-indents the replacement) → `regex` (tokenized around `( ) : [ ] { } > = <`, joined with `\s*`). Non-unique match with `allow_multiple=False` ⇒ `FileEditError`. | HARNESS_README §6.2 | High |
| `read_file` | 1-indexed inclusive slicing; capped at **150 lines** and **10,000 chars**; sets `is_truncated` | HARNESS_README §6.2 | High |
| `submit_patch` | **Free** — `@budget_gated(count_tool_call=False)`. Can still be called at the tool-call ceiling if wall-clock remains. | HARNESS_README §6.1 | High |
| `get_status` | **Free.** Returns budget consumption and patch status. **Does not return test results.** | HARNESS_README §6.1 | High |
| Graph tools | Resolve symbols via 4 tiers: exact → `.`/`/` suffix → case-insensitive → substring. `search_similar_code` computes cosine similarity against pre-computed node embeddings; because the sandbox is offline, the "embedding" of a query is resolved against stored node keys/suffixes — **pass a class, function or module symbol name, not a natural-language sentence**. | HARNESS_README §6.3 | High |
| ADK Skills | Each skill is a directory with a `SKILL.md` manifest carrying YAML frontmatter (`name: <skill-name>`). `run_skill_script` executes Python/bash **inside the persistent competition Docker container**, sharing the filesystem with `run_command` and debiting execution time against the central budget. `load_skill_resource` reads markdown knowledge files. | Overview, Skill Structure & Sandboxing | High |
| **Total time budget** | **12 hours to submit patches for all tasks, inclusive of sandbox setup time, but excluding time for patch validation.** Per-task limits are optional and settable in `eval_config.yaml`. | Overview, Issue Scoring | High |
| Per-task budget fields | The scorer reads exactly four `eval_config.yaml` keys under `evaluation:`: `timeout_seconds`, `max_tool_calls`, `max_time_minutes`, `max_turns`. Staff stated the defaults are **no limit**. | HARNESS_README §7.1; workspace intel (staff answer, thread 743063) | High for the fields; Moderate for the "no limit" default (staff-stated) |
| Harness defaults | `time_minutes` 60.0 (1 in the sample submission), `tool_calls` 100 (`None` in CLI; 10 in the sample submission), `turns` 500, `command_timeout_seconds` 300, `max_stdout_chars` 5,000, `max_file_lines` 150, `max_file_chars` 10,000 | HARNESS_README §7.1 | High |
| **Container setup is outside the agent budget** | `agent_start_time` starts only *after* container creation, wheel install and snapshot extraction. The per-task `time_minutes` measures time inside the agent loop — but the 12-hour competition budget **does** include setup. This asymmetry is the crux of feasibility (§16.4). | HARNESS_README §7.1 TIP | High |
| Context window | **`max_model_len = 32,768`** (vLLM). `max_output_tokens` 1–32,768 (default 16,384). `thinking_config.thinking_budget` 0–32,768 (default 4,096). | HARNESS_README §3.1, §2.4 | High |
| Thinking via vLLM | When serving through vLLM's OpenAI-compatible endpoint (especially with LoRA), **omit `thinking_level`** and configure `include_thoughts: true` + `thinking_budget: 4096` instead — `thinking_level` maps to OpenAI's `reasoning_effort`, and `swegemma` sets `litellm.drop_params = True`. | HARNESS_README §2.4 | High |
| Sampling params allowed | `temperature`, `top_p`, `top_k`, `max_output_tokens`, `presence_penalty`, `frequency_penalty`, `stop_sequences`, `response_mime_type`, `seed`, `thinking_config` — all otherwise unrestricted | HARNESS_README §2.4 | High |
| Context management | ADK `EventsCompactionConfig`: `compaction_interval` 5, `overlap_size` 2, `token_threshold` 14,336, `event_retention_size` 5. `ContextCacheConfig`: `min_tokens` 2,048, `ttl_seconds` 1,800, `cache_intervals` 10. | HARNESS_README §7.2 | High |
| Transient error retries | `ModelRetryPlugin` retries 429/500/502/503/504 and LiteLLM connection/timeout errors up to 5 times: 2.0 s initial delay, 2.0× multiplier, 60 s max, ±20% jitter | HARNESS_README §7.2 | High |
| **Continuation nudges** | If a turn ends without `submit_patch()`: if the turn made ≥1 tool call, `consecutive_nudges` resets to 0; otherwise it increments and the loop terminates when it exceeds **3**. Three targeted messages exist — for an unclosed `<\|tool_call\|>` tag, for `finish_reason` MAX_TOKENS/LENGTH, and a generic "continue or submit". | HARNESS_README §5.3 | High |
| Budget warning | When `budget.tool_calls >= 20` and `remaining_tool_calls <= 10`, every tool response includes a `budget_warning` string | HARNESS_README §6 | High |
| Local evaluation | `swegemma eval --tasks ... --snapshots-dir ... --submission-dir ... --sandbox {docker,subprocess} --concurrency N --shard-index/--num-shards`. Writes `summary.json`, `task_results.jsonl`, `patches/`, `test_outputs/`, `traces/`, `logs/`. | HARNESS_README §9 | High |
| Eval hardware | **4 × NVIDIA L4** (24 GB GDDR6 each, 96 GB total), vLLM `tensor_parallel_size=4`, `gpu_memory_utilization=0.80` | HARNESS_README §3.1 | High |

### 6.5 Timeline, prizes, eligibility, and submission limits

| Field | Verified value | Source | Confidence |
|---|---|---|---|
| Start date | 2026-09-23 | Overview, Timeline | High |
| Research paper deadline | 2026-11-12 (optional, separate track) | Overview, Timeline | High |
| Entry deadline | 2026-11-25 — rules must be accepted by this date | Overview, Timeline | High |
| Team merger deadline | 2026-11-25 | Overview, Timeline | High |
| Final submission deadline | 2026-12-02 | Overview, Timeline | High |
| Deadline time | 11:59 PM UTC on the day, unless otherwise noted. Organizers reserve the right to update the timeline. | Overview, Timeline; Rules §3.3 | High |
| Submission limits | **1 submission per day**; up to **2** final submissions selected for judging | Rules §2.2 | High |
| Maximum team size | **5** | Rules §2.1 | High |
| Main prizes | **$65,000** — 1st $37,000 · 2nd $18,000 · 3rd $10,000 | Overview; Rules §1.5 | High |
| Paper-track award | **$35,000** (separate competition) | Overview, Prizes | High |
| Total prize pool | $100,000 | Overview | High |
| Winner licence | **Open Source Apache 2.0** (OSI-approved, no commercial restriction) | Rules §1.6, §2.5 | High |
| Winner's obligations | Deliver the final model's code — **including training code, inference code, and a description of the computational environment** — capable of generating the winning submission, per Kaggle's documentation guidelines. A detailed methodology description with a reproducibility link may be required. | Rules §2.8, §2.5.b | High |
| Eligible to win | Employees/interns/contractors/officers/directors of Competition Entities may enter but **are not eligible to win** | Rules §2.7 | High |
| Multiple accounts | Prohibited | Rules preamble; Rules §3.5 | High |
| Private code sharing | Prohibited between teams outside a team; public sharing permitted only on Kaggle, under an OSI-approved licence | Rules §3.6 | High |
| Participation at snapshot (2026-09-29) | 5,800 entrants · 864 participants · 829 teams · 2,004 submissions | Overview, Participation | High |

### 6.6 Permission map

Every intervention this report later recommends receives one tag. **Silence is not permission** — an unaddressed permission is *Unverified*, never *Permitted*.

| # | Intervention | Permission tag | Basis |
|---|---|---|---|
| P1 | Submit a declarative ADK YAML agent (prompts, sub-agents, skills) | **Verified permitted** | Overview, Evaluation; HARNESS_README §2 |
| P2 | Ship and run your own Python/bash scripts inside the sandbox via `run_skill_script` | **Verified permitted** | Overview, Skill Structure & Sandboxing |
| P3 | Ship markdown knowledge files read via `load_skill_resource` | **Verified permitted** | Overview, Skill Structure & Sandboxing |
| P4 | Include PEFT LoRA adapters (`.safetensors`), one per agent | **Verified permitted** | Overview, Model Selection and LoRA Adapters; HARNESS_README §3.4 |
| P5 | Use the code-graph tools (`get_code_neighbors`, `search_similar_code`, `get_code_subgraph`) | **Verified permitted** | Overview, tool list |
| P6 | Use `SequentialAgent` / `ParallelAgent` / `LoopAgent` / `sub_agents` / `agent_tool` | **Verified permitted** | HARNESS_README §2.3 |
| P7 | Set per-task budgets in `eval_config.yaml` | **Verified permitted** | Overview: *"You may, but are not required, to set per-task time limits"* |
| P8 | Use external data | **Verified permitted, conditional** | Rules §2.6.a: must be publicly available and equally accessible to all participants at no cost, **or** satisfy the Reasonableness Standard (Rules §2.6.b: no "excessive" cost, minimal cost, reasonably accessible to all) |
| P9 | Distil trajectories from an external teacher model | **Verified permitted, conditional** | Rules §2.6.b permits external models; staff confirmed on the forum that external-LLM data is acceptable **if teacher-model licence terms are complied with**. Closed-API distillation is a licence-ToS question, not a competition-rule question — resolve it yourself. |
| P10 | Set `temperature`, `top_p`, `seed`, `thinking_budget`, `max_output_tokens` | **Verified permitted** | HARNESS_README §2.4 |
| P11 | Run the official `swegemma eval` CLI locally for your own validation | **Verified permitted** | HARNESS_README §9 (published with the data package) |
| P12 | Edit test files in the workspace | **Ambiguous — no score benefit** | Edits are permitted (nothing forbids them) but are **discarded** at verification by `git checkout HEAD`. Harmless to the score, invisible to the agent. Do not rely on them. |
| P13 | Read the public `tasks.jsonl` gold patches and train on them | **Ambiguous — high risk** | Training on the *provided training set* is not prohibited. But training on material resembling the hidden test set, or hand-labelling test data, is: Rules §3.4.b forbids using hand labels of validation or test records. Keep a documented provenance record (§12.5). |
| P14 | Make network calls at inference time | **Verified prohibited** | Sandbox `network_mode="none"`; the task prompt itself states the environment is offline. |
| P15 | Submit a Python entrypoint (`agent.py`) | **Verified prohibited** | HARNESS_README §2.1 — declarative YAML only; `importlib` never used |
| P16 | Ship full base-model weights | **Verified prohibited** | Only LoRA `.safetensors` adapters are registered; `.bin`/`.pt`/`.pth` are rejected by `allowed_file_extensions` |
| P17 | Use more than one base model | **Verified prohibited** | `validate_single_declared_model()` raises `ParticipantVisibleError` |
| P18 | Exploit the evaluator, tamper with test infrastructure, or circumvent resource limits | **Verified prohibited, and disqualifying** | Rules §3.8.d; §13.6 of this report treats it as a hard line |
| P19 | Privately share competition code with another team | **Verified prohibited** | Rules §3.6.a |
| P20 | Front-load effort on tasks you believe are public, if the ordering is knowable | **Unverified / against the spirit** | The organizer has not confirmed whether public and private tasks are interleaved or whether ordering is stable. Even if exploitable, this is exactly the kind of tactic that reads as gaming. §21.6 draws the line. |

### 6.7 Ambiguity list — questions the organizer has not answered

These are real gaps, collected from the official text and the public discussion board as of 2026-09-30. Each one is a decision you may have to make without a ruling.

| # | Open question | Why it matters | Conservative resolution |
|---|---|---|---|
| A1 | Are the ~120 test tasks ordered, and are public-split tasks first? | If ordering is stable and public-first, effort could be front-loaded. | **Assume nothing is knowable.** Do not build a strategy that depends on task order. |
| A2 | Is "solve as many tasks as possible within 12 h, however you split the time" the intended objective, or is balanced per-task performance expected? | Determines whether you should spend ~6 min/task uniformly or concentrate on a subset. | Assume uniform. A strategy that wins by starving 90% of tasks is fragile and reads as gaming. |
| A3 | What happens to unattempted or unfinished tasks — zero, or excluded from the denominator? | Changes the value of attempting hard tasks. | Assume zero. The planned fix scores unfinished tasks as 0. |
| A4 | Will per-task official Docker images be published so local grading matches the scorer? | Requested on the forum; no host reply. | Assume no. Build a *repaired* local grading recipe and validate it against gold patches. |
| A5 | Which `eval_config.yaml` values actually take effect in scoring? | Staff named exactly four fields and said defaults are "no limit". | Set all four explicitly, conservatively. |
| A6 | Are submissions whose wall-clock overruns 12 h scored partially or errored entirely? | A whole-run error is catastrophic. | **Set `max_time_minutes` as a failsafe** — this was the organizer's own advice. |
| A7 | Will the promised harness fixes be deployed before the final submission, and will existing submissions be re-scored? | Determines whether scores before and after a patch are comparable. | Assume no re-score. Re-measure behaviour locally; do not assume a fix landed. |

### 6.8 Re-verification checklist

Run this before you act on anything in Chapter 21, and again in the final week. The competition is live and the rules can change.

- [ ] Competition still open; deadlines unchanged from §6.5.
- [ ] Rules page re-read; any organizer amendments noted.
- [ ] Model and adaptation permissions unchanged (single base model, LoRA only).
- [ ] External-data and teacher-model permissions unchanged.
- [ ] Tool, network and API restrictions unchanged.
- [ ] Runtime and resource limits unchanged — *especially* the 12-hour budget and `eval_config.yaml` fields.
- [ ] Submission artifact format and the "Save Version, then Submit" ordering.
- [ ] Licensing and eligibility.
- [ ] Any of the ambiguities in §6.7 now answered.
- [ ] Every promised harness fix in §19.2 confirmed by your own reproduction, not by a forum post.
- [ ] Record the delta between this report and the current state, and revalidate any strategy it affects.
---

## 7. SWE-bench Foundations, Taxonomy, and Limitations

> **Read this chapter for the method, not the numbers.** The competition does not use SWE-bench (§6.1). What follows explains how this class of benchmark is constructed, why its headline numbers are so often incomparable, and which of its failure modes recur in the competition's own task set. The instances you will actually work on are analysed in §7.6.

### 7.1 What a repository-level issue-repair benchmark actually is

A SWE-bench-style instance is not a question and an answer. It is a **prepared, versioned, executable environment** plus **two different fixes** and **two different test sets**. The schema below was confirmed against the reference implementation. [V]

| Field | What it holds | Why it matters |
|---|---|---|
| `instance_id` | e.g. `django__django-11099` | The identity of the experiment. Everything else is meaningless without it |
| `repo` | e.g. `django/django` | Determines the code distribution you are being tested on |
| `base_commit` | The SHA the repository is checked out at | The *only* thing that makes the task reproducible. Two runs at different commits are two different tasks |
| `problem_statement` | The issue text, as a human wrote it | Your input. Note: human-written means under-specified (§7.4) |
| `patch` | The gold patch — what a maintainer merged | Used to verify the task is solvable. **Not visible to you at evaluation** |
| `test_patch` | The test changes that accompany the fix | **Applied by the grader, never by you** |
| `FAIL_TO_PASS` | Tests that fail before the patch and must pass after | The *positive* requirement |
| `PASS_TO_PASS` | Tests that pass before and must still pass after | The *negative* requirement — no regressions |

**The grading rule, stated exactly, because the two halves are not equally weighted in people's intuitions:**

> An instance is **resolved** only if **every** `FAIL_TO_PASS` test passes **and** **every** `PASS_TO_PASS` test still passes.

**Both halves are absolute.** A patch that fixes the bug and breaks one unrelated test scores exactly zero — identically to submitting nothing. This asymmetry drives several recommendations in this report:

- Prefer a **narrow** patch over a broad one (§21.4 #6). A narrow patch has a smaller surface for the `PASS_TO_PASS` half to fail.
- **Select candidates by "fixes the target and breaks the fewest neighbours"** rather than "fixes the target" alone (§15.4, rank 2). The regression half is a free discriminator you are otherwise ignoring.
- A **skipped** `FAIL_TO_PASS` test counts as a failure, not a pass. A test that errors during collection is not a pass either. "The suite went green" is a stronger claim than "my test passed."

### 7.2 The variant taxonomy, and why the labels are not interchangeable

SWE-bench is a family, and the family members have **different denominators**. This is the single most common source of meaningless comparison in the field. [V for track existence and sizes; U for the specific figures marked]

| Variant | Size | What it is | Category (§4.2) | Note |
|---|---:|---|---|---|
| **SWE-bench** | 2,294 | The original: issue–PR pairs from 12 Python repositories | Dataset | The reference point |
| **SWE-bench Lite** | 323 | A cheaper subset, hand-selected for a spread of difficulty | **Dataset subset** | Different denominator, not a different score on the same one |
| **SWE-bench Verified** | 500 | Human-filtered subset (13 Aug 2024) removing ambiguous or environment-broken instances | **Dataset subset** | The most-quoted number in the field, and therefore the most over-claimed |
| **SWE-bench Multimodal** | 612 | Issues involving screenshots / UI state | **Separate benchmark** | Different modality, not a harder version of the same thing |
| **SWE-bench Multilingual** | 300 | Non-Python repositories, 9 languages | **Separate benchmark** | Transfer from Python is a hypothesis, not a given |
| **SWE-bench Pro** | ~642 | A commercial variant with stricter grading | **Separate benchmark** | Different pass criteria ⇒ different numbers |
| **Terminal-Bench** | ~100 | Terminal / shell-agent tasks | **Separate benchmark** | Adjacent, not comparable |

**The rule this table exists to enforce.** A paper reporting "30% on SWE-bench" has told you almost nothing until you know which row it used, what harness version, and what attempts convention. **The numbers are not comparable across rows of this table, even with an identical model and an identical scaffold.** §8 turns this into a worksheet; §25.1 is the blank.

**A caution about the Verified label specifically.** "Verified" means *human-filtered for solvability and non-ambiguity* — it is a claim about **task quality**, not about **difficulty**. Verified is still hard; it is just reliably *answerable*. Two failure modes survive the filter: a Verified instance can still be easier than a Full instance, and a Full instance can still be solvable. Neither subset is "the real benchmark." They are two different measurement instruments.

### 7.3 How an instance is constructed, and why that biases the results

```text
Merged pull requests in real repositories
        │
        ▼  link each PR to the issue it closes
Issue + PR pairs
        │
        ▼  filter: dedupe, drop trivial diffs, drop non-Python, require a test change
Candidate instances
        │
        ▼  execution verification, in the original repo's own environment:
│     · FAIL_TO_PASS tests must fail at base_commit and pass with the gold patch
│     · PASS_TO_PASS tests must pass at base_commit
Discriminating instances
        │
        ▼  (Verified only) human review: is the issue unambiguous? is it solvable?
        │    is the environment stable?
Verified subset
```

**Three biases follow from this pipeline, and each one predicts a specific failure you will observe.**

| Bias in construction | Why it happens | Failure it predicts in agents |
|---|---|---|
| **The gold patch is what one maintainer merged** | Real PRs, not ideal fixes | An agent's *equally correct* alternative fix can fail the hidden test. §7.6 shows this exactly: keeping both `complete` and `reset` is a defensible engineering choice and scores zero |
| **The test was written for the gold patch** | Tests accompany real PRs | The graded behaviour is narrower than the issue text. An agent that implements everything the issue asks for spends budget on ungraded work |
| **Issues that merged are issues that were understood** | Only merged PRs survive | The task is "implement the fix someone already designed," not "decide what the fix should be." Agents that do genuine diagnosis do worse than agents that pattern-match the issue text |

**The third row is the most counter-intuitive and the most actionable.** The competitive strategy in a SWE-bench-like task is *not* deep software engineering. It is **accurate reading of a specification written by a human, and minimal faithful implementation of its most concrete, mechanically checkable instruction.** §7.6 is a worked example; §21.4 #2 and #6 are the interventions that follow.

### 7.4 The validity problems, and the ones that will bite you here

SWE-bench is a proxy, and its proxy failures are documented. This subsection is deliberately blunt, because a competitor who knows them will make better decisions than one who does not.

| Problem | What it means | Evidence status |
|---|---|---|
| **The metric is not "is this fix good"** | Automated resolution overstates how often a human reviewer would accept the patch | [V] — Epoch AI, 2025-06-13, retrieved directly |
| **Benchmark scores do not predict deployment** | Real maintainers merge far fewer AI patches than benchmark scores imply; time-to-merge effects run the *opposite* way to intuition | [V] — METR, retrieved directly |
| **Flaky and environment-broken instances** | The original set contained instances that fail for reasons unrelated to the agent | [V] — this is why Verified exists |
| **Underspecified issues** | The issue text may not determine the fix | [C] — see `httpx_3672`, which names a nonexistent exception class and an inconsistent method name |
| **Trivial or weak tests** | A test that barely exercises the change will pass on a wrong fix | [C] |
| **Difficulty skew** | The distribution of task difficulty is not the distribution of real issues | [C] |
| **Infrastructure failures masquerading as agent failures** | Broken environments inflate or deflate scores | [V] — documented in the original work; §9.6 |
| **The "resolved" label is binary** | A patch that is 90% right and one that is 0% right score identically | Structural |

**The eight concrete failure modes, as a labelled taxonomy you can use on your own logs.** This is the practical version of the table above. [V — the taxonomy structure from the harness workstreams]

| # | Mode | Symptom | What to do |
|---|---|---|---|
| 1 | **No patch produced** | Empty diff; clean working tree at exit | Never end a task with a clean tree. Call `submit_patch()` unconditionally |
| 2 | **Patch fails to apply** | Hunk offsets, CRLF, binary, symlinks, wrong prefix depth | Prefer edits to tracked text files. The harness uses a 4-pass fallback; test with `git apply --check` |
| 3 | **Environment failure** | Import error, missing wheel, OOM (`exit 137`), collection error | **Not an agent failure.** Fix infrastructure; never count it as one |
| 4 | **Test timeout** | Command exceeds 300 s; suite too large | Never run the full suite. Target specific tests |
| 5 | **Wrong-file edit (localization)** | Agent edited plausible files, not the right ones | Test retrieval, graph-tool, and search changes |
| 6 | **Misread specification** | Right file, wrong change | Improve the issue-reading instruction; add the asymmetry rule (§7.6) |
| 7 | **Regression** | `FAIL_TO_PASS` passes, `PASS_TO_PASS` breaks | Narrow the patch; add a regression check before submitting |
| 8 | **Truncation / budget exhaustion** | Tool call cut mid-tag; loop; ran out of turns | Shrink payloads; tighten stopping rules; cap the budget |

**Modes 1, 3 and 4 are the ones people misattribute.** An agent that never submitted a patch looks like a model that could not code. A test suite that OOMs at 4 GiB looks like a model that broke the build. **Log the outcome as one of `resolved`, `agent_failed`, `infra_failed`, `timeout`, `patch_not_applied`, `empty_patch`** (§9.9) and the distinction stops being negotiable.

### 7.5 How this competition differs, and what carries over

| Aspect | SWE-bench | This competition | Does the lesson transfer? |
|---|---|---|---|
| Task source | Public GitHub PRs | Real PRs, **private repositories** for the hidden half | **Yes** — same construction philosophy, better contamination properties |
| Test patch | Hidden, held by the benchmark | Hidden, applied by the organizer, **and test edits are reset** | **Yes, and stronger** — anti-tampering is explicit |
| Repositories | 12, all public | 4 public + private | **Partly** — the public half is 89% fastapi + rich (§12.1) |
| Model | Anything | **One**, fixed | **No** — the model-landscape lesson does not transfer |
| Attempts | Usually 1; sometimes pass@k | **Exactly 1** | **Yes, and stricter** — §15.2 is the consequence |
| Budget | Often generous | **~6 min/task, 12 h total** | **No** — budget-constrained methods that win on SWE-bench fail here |
| Scaffold | Free | **Declarative YAML, 9 tools** | **No** — the ACI lessons transfer as *principles*, not as code |

**The four rows marked "No" are where most published advice will mislead you**, and they are the rows to be most careful about. A method that wins on SWE-bench with an unrestricted scaffold, a frontier model, a large pass@k, and a generous budget may have nothing to offer a 31B model with nine tools and six minutes.

### 7.6 An annotated instance walkthrough — and the trap that decides most tasks

> This section analyses a real task from the shipped dataset, `httpx_3672`, using the organizer's own data package. Every factual claim below was verified against `tasks.jsonl`, the `httpx_3672` snapshot, and the `httpx` code graph. It is included because a single well-chosen instance teaches more than any abstract description of the pipeline — and because this particular instance contains the trap described in §4.3 fact 1.

#### 7.6.1 The task

| Field | Value |
|---|---|
| `instance_id` | `httpx_3672` |
| `repo` | `encode/httpx` |
| `base_commit` | `4acf5c2c37714cc63b5cf71b3e284fca83c90311` |
| `created_at` | 2025-09-19 |
| `hints_text` | *(empty)* |
| Position in the public set | The **only** httpx task of 129. Public distribution: fastapi 67, rich 48, requests 13, httpx 1. |

The problem statement, in full:

> Server connection handling.
> - Add `HTTPParser.keep_alive`.
> - Server... always read request to completion on keep alives.
> - `HTTPParser.complete` -> `.reset`
> - Close streams on server exit.
> - Don't raise `KeyboardException` on server exit.

Note how loose this is. It says `keep_alive`; a consistent implementation would name that predicate `is_keepalive()`, matching the existing `is_idle()` / `is_closed()` convention. It says `KeyboardException`, which is not a real Python exception — the code in question raises `KeyboardInterrupt`. There is no traceback, no expected/got, and no hint. **The only unambiguous, mechanically checkable instruction in the whole statement is the third bullet: rename `HTTPParser.complete` to `.reset`.**

#### 7.6.2 What the agent can see, and what actually gets graded

This is the part that matters, and it is counter-intuitive enough to be worth stating very explicitly.

| Artifact | What the agent sees | What the grader runs |
|---|---|---|
| Test file | `tests/test_parsers.py` calls `p.complete()` at exactly five sites | The hidden `test_patch` rewrites **those same five call sites** to `p.reset()` |
| Graded scope | — | `tests/test_parsers.py` **only** |
| Gold-patch scope | — | 7 files across 4 modules, plus the async mirror tree |

Now follow the consequences, because they invert the normal debugging reflex:

- If the agent **does what the issue says** — renames `complete` to `reset` — its visible `pytest tests/test_parsers.py` turns **red** with five `AttributeError: 'HTTPParser' object has no attribute 'complete'`. Every local signal says the fix is broken. It is not.
- If the agent instead **keeps `complete` and adds `reset` alongside**, the visible suite stays green and the hidden suite fails, because the hidden tests call `reset()` and assert on `is_idle()` / `repr` behaviour that only the renamed body produces.
- If the agent **edits the visible test file** to match the rename, those edits are silently **discarded** at verification: the harness resets every test file touched by the agent patch to `eval_baseline` before applying its own test patch. Harmless to the score, invisible to the agent.

**The correct behaviour — follow the issue text, accept the local red, do not revert — is precisely the behaviour that every locally-available signal punishes.** Workspace modelling of a naive agent on this task shows it performing the rename, running pytest, seeing five failures, concluding the rename was wrong, and reverting — arriving at a clean, plausible, worthless patch.

**The general rule this instantiates:**

> When the visible test suite and the issue statement disagree, the issue statement is the specification and the visible suite is a secondary signal. Know *before you start* which disagreement you are dealing with, so that a red suite does not read as new information.

Encoding that as an explicit instruction — and, better, as a journal entry made *before* the edit rather than discovered *after* it — is a cheap, high-leverage intervention. It is a hypothesis, not a published result, and §21.4 ranks it accordingly.

#### 7.6.3 Three more structural obstacles in the same task

| Obstacle | What it is | What it does to a naive agent |
|---|---|---|
| **Duplicated sync/async tree** | `src/httpx/` and `src/ahttpx/` are file-for-file mirrors. The graph shows 239 `ahttpx.*` nodes among 740 total. | A `grep -rn "complete"` doubles every hit list. The agent fixes half the tree, or wastes half its budget establishing that it has to fix both. |
| **A fault at the call site, not the tested site** | In `_server.py`, `self._parser.complete` is written **without parentheses** — attribute access, result discarded, a silent no-op. The server never actually resets the parser. The graded tests point at `_parsers.py`; the symptom lives in `_server.py`. | Localization that trusts the test file's location never finds it. The graph's `calls` edges are intra-class on this task, so `get_code_neighbors` will **not** surface it either — only reading the caller will. |
| **Real bugs the grader never reaches** | `Response(code=500, ...)` raises `TypeError` because the parameter is `status_code`; `self._streams = list[NetworkStream]` assigns a `GenericAlias` instead of a list; `wait()` is `while(True): sleep(1)` and lets `KeyboardInterrupt` propagate. All three are named in the issue and all three are fixed by the gold patch. | An agent that chases every bullet the issue mentions spends its budget on changes that cannot affect the score, and may introduce regressions in the process. |

That third row produces a genuinely uncomfortable strategic question, and it is worth confronting rather than papering over: **the issue asks for five things and the grader tests one.** An agent that tries to do all five has a larger surface for regression and a smaller budget per item; an agent that does only the rename wins the task. Which is correct depends on whether the graded scope is knowable in general — and it is not knowable from the issue text alone.

The defensible general policy is a *scoping* policy, not a shortcut: **identify the minimal change that satisfies the issue's most concrete, mechanically-checkable instruction, implement it cleanly, then add further issue items only while budget clearly remains.** That ordering is a hypothesis worth testing on a rename/refactor slice of the development set (§21.4, experiment E4), not a law.

#### 7.6.4 What this instance teaches about the tools

| Tool | Verdict on this task | Evidence |
|---|---|---|
| `run_command` + `grep` | Essential, but doubles the hit list on duplicated trees | Verified from the snapshot layout |
| `read_file` | The only tool that surfaces the missing-parens call-site fault | Verified — the graph does not cross the file boundary here |
| `get_code_neighbors` | Returns intra-class neighbours only on this task; will **not** find the cross-file caller | Verified against the released graph |
| `get_code_subgraph` | Genuinely useful — makes the dual-tree structure explicit in one call | Verified |
| `search_similar_code` | Requires a **symbol-name** query (`"HTTPParser"`), not prose (`"server connection handling"`). The offline resolver matches against stored node keys. | Documented in HARNESS_README §6.3 and confirmed in workspace measurement |
| `edit_file` | The 3-tier exact/flexible/regex matching materially raises the hit rate on real code edits | HARNESS_README §6.2 |
| `submit_patch` | Free, and the harness captures a dirty tree even without it — **but only if the tree is dirty** | HARNESS_README §8.1 |

The row that generalises most usefully is the second one. **Graph tools answer "who calls this symbol?" within the graph's resolution; they do not answer "where is this bug?"** In this task the decisive fault is a caller of a method, and the graph could not see it. That is a calibration point worth carrying into any policy you build around graph navigation (§11.5).

---

## 8. Leaderboards, Score Interpretation, and the Dated Progression

> **The purpose of this chapter is to make you suspicious of numbers, including yours.** By the end you should be able to take any published SWE-bench score, identify in under a minute which of the four quantities in §9.5 it represents, and state the two protocol facts that would have to be equal for a comparison to be meaningful.

### 8.1 The most common misreading, stated first

A SWE-bench score is almost always a **system** score, not a **model** score. The number includes the model *plus* a scaffold *plus* a tool set *plus* a context policy *plus* a budget *plus* an attempts convention. Report the model and the number travels with it; report the system and the number is a property of the system.

**The two families of number, and the gap between them:**

| Family | What it measures | Typical magnitude | What it is good for |
|---|---|---|---|
| **Model-only / single forward pass** | Can the model produce a correct patch in one shot, with no search loop? | Often 1–5% on SWE-bench-class tasks | Measuring the *model* |
| **Agent-system** | Can the model plus a scaffold plus tools plus iterations resolve the instance? | Typically 10–60% over 2024–2025 | Measuring the *system* |

**A published number from the first family is not a weaker version of a number from the second — it is a different measurement.** Comparing them is comparing a sprint time to a marathon time. Every leaderboard in this domain has been compared this way, which is why the field's headline claims outrun its evidence.

**There is a verified anchor for how large the scaffold contribution is, and it is the SWE-agent paper's own ablation table.** A bare shell with GPT-4 Turbo scored **11.00%** on SWE-bench Lite; the full ACI scaffold with the same model scored **18.00%**. [V] The scaffold — not the model, whose weights did not change — is worth **+7 points, a 64% relative improvement.** Chapter 11 is entirely about that number.

### 8.2 The dated progression, with its confidence stated

The following is the *shape* of the field's progress. **The intermediate milestones are widely reported but were not retrievable from primary sources in this session** — the search budget was exhausted before the leaderboard history could be verified. They are included as orientation, marked accordingly, and **no conclusion in this report rests on any of them.** [U except where marked]

| Period | Approximate verified state | What drove it | Confidence |
|---|---|---|---|
| Late 2023 | First published agentic attempts, low single digits | GPT-4 with an early agent loop | [U] |
| 2024, early | SWE-agent with GPT-4 Turbo: **18.00%** Lite, **12.47%** Full | The ACI design and guardrails | **[V] — paper retrieved** |
| 2024, mid | mini-SWE-agent: **65%** Verified, ~100 lines | Scaffold *simplification* | **[V] — repository, retrieved** |
| 2024, late | Frontier closed models push into the 50s on Verified | Better models, better scaffolds, more budget | [U] |
| 2025 | DeepSeek-Coder-V2-Instruct: **15.9% → 56%** on Lite, 1 vs 250 samples | Inference-time scaling, not training | **[V] — arXiv:2407.21787 retrieved** |
| 2025–2026 | Contamination disputes; refreshed benchmark variants appear; measurement research (Epoch AI, METR) questions the proxy | Benchmark hygiene | **[V] for the measurement findings; U for the timeline]** |

**What the shape tells you, which is more useful than any individual row.** Progress has come from four places — better base models, better scaffolds, more inference compute, and better training data — and **the competition makes exactly one of those four available to you.** §17.8 draws this out: the serving infrastructure and model scale are fixed, the training data story is compute-gated, and what remains is scaffold and budget. **That is the entire strategic content of this report, and it is visible in the table above without a single number from it.**

### 8.3 pass@1 versus pass@k — the distinction that produces most of the field's overstatement

| Quantity | How it is computed | What it means | Deployable? |
|---|---|---|---|
| **pass@1** | One submitted patch. Did it resolve? | Your real score | **Yes** |
| **pass@k, oracle** | Sample k patches; run the real tests; count success if *any* passed | An upper bound on what selection could achieve | **No** — it required the answer key |
| **pass@k, selected** | Sample k; select one *without* the key; did that one resolve? | The real score of a selection strategy | Yes |

**The verified illustration of the size of the oracle gap** is the Large Language Monkeys row: 15.9% at k=1 versus 56% at k=250, a **40-point** gap, entirely in the oracle. [V] Almost all of that 40 points is unreachable without a selection mechanism, and this competition's selection mechanisms are all weak by construction (§15.2).

**How to spot an over-claimed number in the wild.** Three tells:

1. **The paper reports a large `k` and a big jump.** Check whether the "jump" is oracle-selected. If so, it describes an upper bound.
2. **No budget is reported.** A `pass@8` with no token count, no wall clock and no tool-call count is not a result; it is an existence proof.
3. **The model is not named, or the scaffold is not named.** A number without both is uninterpretable regardless of how it was selected.

**The worksheet to apply to any score, yours included, is §25.1.** Fifteen fields. The two that catch the most problems are *"which of the four quantities"* and *"what does this score not establish."*

### 8.4 Leaderboard hygiene — what to distrust

The public SWE-bench leaderboard and its equivalents carry systematic distortions. These are structural, not accusations about any particular entry. [C]

| Distortion | Mechanism | How to read around it |
|---|---|---|
| **Self-reported entries** | No central re-execution | Treat as claims. The fill-out §25.1 and check whether it is complete |
| **Scaffold heterogeneity** | Two entries at 40% may share no components at all | Ask what the tools, budget, and attempts convention were |
| **Subset confusion** | Verified vs. Lite vs. Full in the same column | Check the denominator every time (§9.2) |
| **No standard pass@k reporting** | `k` is often unstated | Assume oracle unless selection is described |
| **Contamination** | A model may have trained on the benchmark | The field's public disputes over this are documented [C]; treat high scores with unexplained jumps sceptically |
| **Infrastructure luck** | A broken environment produces a zero that is not a model failure | Look for whether the entry discloses an environment check |

**And the specific caution that applies to reading a live competition leaderboard**, which is a different artifact from a static one:

> **A live leaderboard is a selected maximum.** With 829 teams and 2,004 submissions and a one-submission-per-day limit, the top of the table is the maximum over many draws from a noisy distribution. §9.4 did this arithmetic: at this sample size, the maximum over a dozen submissions is biased upward by several tasks. **The leaderboard's top entry is not a measurement of that entry; it is partly a measurement of how many attempts the top teams made.**

### 8.5 How to read your own score — the rules

1. **Report the denominator, always.** "12%" without "7 of 58" is not a result; it is a vibe.
2. **Report the interval.** §9.3's Wilson table is short. A point estimate without one invites over-reading.
3. **Report regressions separately from wins.** A configuration that wins six and loses four has not improved anything.
4. **Report the budget.** A score achieved in 30 tool calls and one achieved in 300 are different results, and only one of them is comparable to the leaderboard.
5. **Report the four quantities separately** if you measured more than one. Conflating them is how you end up believing your k=8 oracle number is your k=8 submitted number.
6. **Separate development from confirmation, always.** A number from the set you tuned on is a diagnostic. Only a number from a frozen set is a result.

### 8.6 The one-paragraph version of this chapter

> A SWE-bench score is a property of a system, not a model. The scaffold alone was worth +7 points with the model held constant. The same agentic task family moved from 15.9% to 56% under repeated sampling — but that entire gap is oracle-selected and the competition gives you one submitted patch and a weak verifier, so most of it is unreachable. The single most common error in this field is comparing numbers that differ in subset, scaffold, attempts convention, and budget simultaneously. Fill out §25.1 before believing any of them, including your own.
---

## 9. Trustworthy Evaluation, Statistics, and Failure Diagnostics

> This chapter is the statistical spine of the report. Most competition narratives fail here — not because the author lied, but because nobody asked how many tasks it took to notice a difference.

### 9.1 The one-paragraph version

With ~60 tasks on the leaderboard, a single task is worth **1.67 points**. A score of 12% has a 95% confidence interval of roughly **6% to 23%** — a ±8-point band. Two systems compared *independently* cannot be distinguished unless they differ by about **17 points**. Two systems compared *paired on the same tasks* need roughly **6–10 net tasks flipped in your favour** before the difference is statistically real. Against a 12% baseline that is going from 7/60 to 13–17/60. **Most "improvements" reported in a competition of this size are noise.** This section shows the arithmetic.

### 9.2 Why the denominator is everything

The same percentage means different things over different denominators.

| Denominator | 1 task is worth | A ±0.04 run-to-run swing is |
|---|---|---|
| 58 public leaderboard tasks | 1.72 points | 2.3 tasks |
| ~60 private leaderboard tasks (the deciding set) | 1.67 points | 2.4 tasks |
| 129 public training tasks | 0.78 points | 5.2 tasks |
| 500 SWE-bench Verified | 0.20 points | 20 tasks |
| 20-task pilot slice | 5.0 points | 0.8 tasks |

Two consequences follow immediately. First, **a pilot on 20 tasks cannot rank anything** — it can only catch catastrophic regressions, which is a legitimate and useful role, but not a ranking role. Second, **the private leaderboard is the only number that decides the competition**, and it is the *smaller* of the two, so its confidence interval is the wider one. A public score of 0.20 that becomes 0.12 privately is entirely unremarkable; a public 0.12 that becomes 0.20 privately is a 4.8-point, ~3-task move and is equally unremarkable.

### 9.3 The noise arithmetic, in full

**Step 1 — the confidence interval on a single resolution rate.** The Wilson score interval is appropriate for a proportion with small n; the naive normal approximation is not, because it produces intervals that extend below 0 or above 1 and under-cover at these sample sizes.

| n | p | Point estimate | Wilson 95% CI | Width |
|---|---|---|---|---|
| 58 | 0.12 (7/58) | 12.1% | ≈ 6.0% – 23.0% | ±8.5 pts |
| 60 | 0.12 (7/60) | 11.7% | ≈ 6.0% – 22.6% | ±8.3 pts |
| 60 | 0.20 (12/60) | 20.0% | ≈ 11.8% – 31.9% | ±10.1 pts |
| 60 | 0.30 (18/60) | 30.0% | ≈ 19.5% – 43.6% | ±12.1 pts |
| 129 | 0.12 | 12.4% | ≈ 7.3% – 20.1% | ±6.4 pts |
| 500 | 0.70 | 70.0% | ≈ 65.7% – 73.9% | ±4.1 pts |

Notice the pattern: **the interval is widest in the middle of the range, exactly where competitive scores sit.** A 500-instance benchmark with a 70% score has a narrower interval than a 60-instance benchmark with a 12% score. Scale is not automatically more informative; the *rate* matters too.

**Step 2 — the minimum detectable difference, unpaired.** For two independent proportions at n = 60 each, the standard error of the difference is `sqrt(2p(1-p)/n) = sqrt(2 × 0.12 × 0.88 / 60) = 0.058`. For 80% power at a two-sided α of 0.05 you need roughly 2.8 standard errors, i.e. **≈ 0.16, or 16 points**. There is no way around this: if you do not evaluate on the same tasks, you cannot see anything smaller than a 16-point move.

**Step 3 — the minimum detectable difference, paired.** This is the whole point of running both systems on the same task list. McNemar's exact test looks only at the *discordant* tasks — those where exactly one system resolved. Let `b` = tasks the candidate solved and the baseline did not, `c` = tasks the baseline solved and the candidate did not. Under the null, `b ~ Binomial(b + c, 0.5)`.

| b (candidate-only wins) | c (candidate-only losses) | Discordant total | Two-sided exact p | Significant at 0.05? |
|---|---|---|---|---|
| 5 | 0 | 5 | 0.0625 | No |
| 6 | 0 | 6 | 0.0313 | **Yes** |
| 7 | 0 | 7 | 0.0156 | **Yes** |
| 6 | 1 | 7 | 0.125 | No |
| 7 | 1 | 8 | 0.0703 | No |
| 8 | 1 | 9 | 0.0391 | **Yes** |
| 9 | 1 | 10 | 0.0215 | **Yes** |
| 10 | 2 | 12 | 0.0386 | **Yes** |
| 3 | 3 | 6 | 1.0 | No (identical) |

**The operational rule that falls out of this table, and it is the single most useful sentence in this chapter:**

> On a ~60-task leaderboard, a change is statistically credible only if it wins **6 or more tasks outright with essentially no regressions**, or **8+ tasks with a couple of regressions**. Anything that flips two or three tasks is a story, not a result.

Against a 12% baseline, that means an intervention must roughly **double** the resolution rate before you are entitled to believe it. Plan your experiment budget accordingly: you cannot afford to test ten ideas at 2 tasks each. You can afford to test two ideas at 6 tasks each.

**Step 4 — repository clustering makes it worse.** Tasks are not independent draws. In the public set, 67 of 129 are fastapi. If a scaffold change helps on fastapi-style code and hurts elsewhere, the *effective* sample size is closer to the number of repositories (4) than the number of tasks (129). With 4 clusters, cluster-robust uncertainty estimates are essentially uninformative, and the honest statement is that **repository-level generalization is untestable on the public set.** This is not a reason to stop measuring — it is a reason to weight repository-stratified results and to be extremely reluctant to generalise a fastapi-specific gain to the hidden test set, which comes from *private* repositories.

### 9.4 Separating development from confirmation

| Split | Purpose | Size here | Rule |
|---|---|---|---|
| **Training / construction data** | Building trajectories, adapters, skills | External + the public set's *unmodified* tasks | Never used to select a configuration |
| **Development tasks** | Fast iteration, diagnosing failure modes | 20–30 tasks, deliberately a mix of repositories | Free to overfit; treat its scores as diagnostic only |
| **Frozen validation set** | Making architecture decisions | 40–60 tasks, held out from development | The set that actually decides which scaffold you keep |
| **Final held-out set** | One confirmatory run before submission | Remaining tasks, touched once | Run **once**. Every extra look is an extra adaptive-overfit step. |

The rule people break is treating the development set as validation. If you ran 30 configurations on your 30-task dev slice and kept the best, the best score is now a maximum over 30 draws from a noisy distribution — and it is biased upward by roughly the maximum of 30 noise draws, which at this scale is several tasks. That is not a small bias; it is larger than the effects you are trying to detect.

### 9.5 The four quantities you must never conflate

This distinction is where published results most often mislead, and where a competitor most easily fool themselves.

| # | Quantity | Definition | Requires the answer key? | Deployable? |
|---|---|---|---|---|
| 1 | **Single-trajectory resolution** | One run of the agent, one patch, does it pass? | No | Yes — this is what the competition scores |
| 2 | **Oracle candidate success** | Did *any* of k generated candidates pass? | **Yes** — you must know which one | **No.** Unusable without the answer key |
| 3 | **Selected-patch success** | Did the candidate you *chose without the key* pass? | No | Yes |
| 4 | **Submitted-artifact success** | Does the final `submission.zip` survive the real harness? | No | Yes — and it is the only thing that scores |

The competition scores exactly quantity 4, which is bounded above by quantity 3, which is bounded above by quantity 2. **You cannot submit a k-patch portfolio.** `submit_patch()` captures one diff and the harness ends the loop. Any k-sample strategy must perform its own selection *online, at inference time, without the hidden tests* — which converts an oracle problem into a verification problem. §15.2 treats this as the central open technical question of the competition.

**Where the literature slips.** A great many published agentic results report a `pass@k` that was estimated by sampling k candidates and checking whether any passed — quantity 2 — and present it in a way that reads as a deployable score. When reading such a number, the first question is always: *was selection performed without the answer key?* If not, it is an upper bound on what that system could achieve, not a result.

### 9.6 Infrastructure failures are not agent failures

A task can fail without the agent being at fault. Sources include: snapshot extraction errors, missing or mis-pinned offline wheels, editable-install failures, sandbox OOM (4 GiB is not generous for a full test suite), container start-up failures, and the 300-second single-command timeout. Counting these as agent failures deflates your measured performance and, worse, hides real agent failures behind noise.

The discipline: **log every outcome as one of `resolved`, `agent_failed`, `infra_failed`, `timeout`, `patch_not_applied`, `empty_patch`.** Maintainers' own reports of gold patches failing in local Docker for reasons that had nothing to do with any agent (missing transitive dependencies, a wheel-dedup step that pinned a too-new transitive release and broke an API) are the canonical illustration. Your local environment is not the scorer, and the difference can dominate your measured signal.

### 9.7 The minimum diagnostic suite

Whatever else you do, run these. They are cheap and they catch the failure modes that silently destroy everything downstream.

| Check | What it catches | Pass condition |
|---|---|---|
| **Environment sanity** | Do the offline wheels actually install? | A trivial `import` of the repo package succeeds |
| **Gold-patch control** | Does a known-correct patch pass the local grader? | 100% on every task you intend to use. **Any failure is a broken local environment, not a model result.** |
| **No-patch control** | Do the tests actually fail before the fix? | Every task fails without a patch. If some pass, the task is not discriminating. |
| **Patch-application check** | Does your `git diff` apply cleanly under the 4-pass fallback? | `git apply --check` succeeds |
| **Scratch-file leak** | Is anything in the diff that should not be? | `git status --porcelain` is empty or understood before submitting |
| **Timeout stress** | Do your commands fit 300 s and 4 GiB? | The heaviest test command completes |
| **Tool-format failure** | Do you handle a malformed or truncated tool response? | The agent does not loop on a failed call |
| **Regression suite** | Did a change break a previously working task? | Zero regressions on the frozen validation set |
| **Determinism / replay** | Can you reproduce a run? | Seeds recorded; traces archived |

The gold-patch control deserves emphasis. **If a known-correct patch does not score 100% on your local set, your local set is broken, and every number you measure locally is noise.** This is not hypothetical — workspace evidence documents exactly this failure, and the organizer's own confirmation that the hidden set validates 100% with a gold patch is the reason local scores and leaderboard scores could anti-correlate.

### 9.8 A failure-attribution decision tree

When a task fails, do not guess. Walk it in this order, because the early branches are much more common than the late ones.

```text
Did the task produce a non-empty patch?
├─ NO  → Failure class: SUBMISSION INTERFACE
│        Did the working tree stay clean? Did the agent skip submit_patch()?
│        Check: scratch files left in /workspace, or an agent that "understood"
│        the task needed no change. → Fix: always leave a diff; never end clean.
│
└─ YES → Did the patch apply in the verification container?
    ├─ NO → Failure class: PATCH FORMATTING
    │        Binary files? CRLF? Symlinked paths? Prefix depth wrong?
    │        → Fix: prefer edits to tracked files; avoid mode/binary changes.
    │
    └─ YES → Did the test suite even collect and run?
        ├─ NO → Failure class: ENVIRONMENT / HARNESS
        │        Import errors, missing wheels, OOM (exit 137), collection errors.
        │        → Fix: infrastructure. Do NOT attribute to the model.
        │
        └─ YES → Did the target tests go green (FAIL_TO_PASS)?
            ├─ NO → Failure class: TASK UNDERSTANDING or LOCALIZATION
            │        Did the agent touch the right file at all?
            │        ├─ Wrong files → LOCALIZATION. Test retrieval/graph/prompt changes.
            │        └─ Right files → TASK UNDERSTANDING. Re-read the issue statement.
            │
            └─ Partly → Did it break previously-passing tests (PASS_TO_PASS)?
                ├─ YES → REGRESSION. Over-broad edit. Narrow the change.
                └─ NO  → Partial implementation. INCOMPLETION — usually budget.
                         Did the agent run out of turns/time before finishing?
                         → Fix: budget and stopping policy, not capability.
```

Two branches deserve a warning label. **TASK UNDERSTANDING versus LOCALIZATION** is the most expensive distinction to get wrong: if the real failure is localization, a better prompt will not help; if it is understanding, a better retriever will not help. And **the "revert the correct fix" failure** does not appear in this tree at all, because it presents as a regression-and-recovery loop. It is described in §7.6 and is the single most specific trap in this task family.

### 9.9 What a run log must contain

Every task, every run, no exceptions. This is the raw material for every later decision, and reconstructing it later is far more expensive than capturing it now.

```text
run_id:                    task_id:                  repo:
model_checkpoint:          adapter:                  scaffold_commit:
harness_commit:            dataset_version:          sandbox_mode:
seed:                      temperature:              top_p:
thinking_budget:           max_output_tokens:        max_tool_calls:
max_time_minutes:          max_turns:               wall_clock_used_s:
tokens_in:                 tokens_out:               llm_calls:
tool_calls_by_type:        graph_calls:              retried_calls:
outcome:                   resolved | agent_failed | infra_failed | timeout
                           | patch_not_applied | empty_patch
first_correct_commit:      localization_calls:       edits_made:
regressions_introduced:    submit_patch_called:      exit_reason:
verbatim:                  traces/<task_id>.json     logs/<task_id>.log
```

The `first_correct_commit` field is worth more than it looks: it tells you the turn at which the patch first became correct, which lets you compute how much of your budget was spent *after* the answer was already in the tree. On a 6-minute budget that number is usually the most actionable one in the whole log.
---

## 10. The Model Landscape, and Why Most of It Is Irrelevant Here

> **The governing fact of this chapter.** The competition permits exactly one base model: `gemma-4-31b-it-qat-w4a16-ct`. Every published SWE-bench number achieved by a different model is a fact about a system you are not permitted to build. The purpose of this chapter is therefore not to rank models. It is to answer three narrower questions: (1) what do we actually know about the model we must use, (2) what do published results tell us about *scaffolds* — which transfer, because they are yours to write, and (3) what is the honest calibration expectation for a score.

### 10.1 What is known about Gemma 4

Verified from the Google Gemma documentation and the HuggingFace model card, accessed 2026-10-02. [V]

| Property | Value | Note |
|---|---|---|
| Developer | Google DeepMind | |
| Input modalities | Text, audio, image | The competition sandbox is text-only — modality is irrelevant here |
| Languages | 140+ | Irrelevant here |
| Native context | 128K–256K | **Overridden to 32,768 by the competition's serving config** |
| License (weights) | Apache 2.0 | Permissive; the winner-obligation requirement to release under Apache 2.0 is compatible |
| Competition variant | `gemma-4-31b-it-qat-w4a16-ct` | The only permitted base model |
| Parameter count | ~30.7B–34B | Sources differ; not load-bearing |
| Quantization | W4A16 — INT4 weights, BF16/FP16 activations, **quantization-aware** | Not post-training quantization. This distinction is critical in §13.4 |
| Serialization | Compressed Tensors (`ct` suffix) | Native optimized vLLM path |
| Serving target | vLLM | Confirmed on the model card |
| Purpose-built variants | EmbeddingGemma, ShieldGemma 2, FunctionGemma, PaliGemma, DiffusionGemma, RecurrentGemma | None usable here — one model only |

**Three things in that table matter more than the rest.**

First, **the context is not the model's limit, it is the serving allocation.** A 256K-context model restricted to 32,768 means you have roughly one eighth of the model's capacity. Nothing you write in `agent.yaml` changes that. Any strategy that assumes you can hold a large repository in context is dead on arrival.

Second, **the quantization is QAT, not PTQ.** The model was *trained* with simulated quantization, which is why it holds up at 4 bits. This matters for exactly one decision — whether you can train an adapter on top of it — and §13.4 treats it as the least-explored part of the whole project.

Third, **Apache 2.0 on the weights is genuinely convenient** for the winner's obligation to deliver training and inference code under a compatible licence.

### 10.2 What is *not* known, and what it would take to know

| Unknown | Consequence | How to resolve it |
|---|---|---|
| `hidden_size`, `num_attention_heads`, `num_kv_heads`, `head_dim` | Precise KV-cache and concurrency planning (§16.3) is impossible | Read the model config from the local checkpoint; you have the model locally |
| Whether the attention is grouped-query and at what ratio | Same | Same |
| Whether a "thinking" mode exists beyond `thinking_budget` | Affects the reasoning-budget sweep | Empirically, at inference |
| Independent SWE-bench evaluations of any Gemma 4 size | No external calibration point | **You cannot fix this.** Run the baseline yourself |
| Any Gemma-specific terms supplementary to Apache 2.0 | Compliance | Read `ai.google.dev/gemma/terms` yourself before submitting |

**A practical note that saves work:** the architecture details are *in the model config file* that ships with the weights. You are not waiting on Google DeepMind to publish them — you are one `cat config.json` away, the moment you have the model downloaded. The "critical unknown" that one workstream flagged is resolvable in your first hour. Do that before doing anything else in Chapter 16.

### 10.3 The model landscape is not the competitive landscape

Everything in this table is **UNVERIFIED** — the model cards returned HTTP 401 at retrieval time and the search budget was exhausted before they could be confirmed. It is included for orientation only and **must not be used to justify any decision.** [U]

| Model family named in the research window | What is claimed | Verification status |
|---|---|---|
| DeepSeek-Coder-V2-Instruct | 15.9% → 56% on SWE-bench Lite at 1 vs. 250 samples | **VERIFIED** — the one row with a retrieved primary source |
| Qwen3-Coder, Devstral, GLM-4.5/4.6, Kimi K2, SWE-agent-LM-32b, OpenHands | Reported strong SWE-bench results in the 7B–70B range | **Not verified** |
| SWE-bench Pro, SWE-bench-Live, SWE-rebench, Terminal-Bench, Multi-SWE-bench | Newer evaluation efforts addressing difficulty and contamination | **Not verified** |

**Why this table is nearly empty, stated honestly.** The session's web-search budget (200 calls) was consumed by six parallel workstreams before secondary literature could be checked, and most model cards and papers were inaccessible. The result is that the single most-cited table in this domain — "how good is each model at SWE-bench" — is exactly the table I cannot responsibly produce. Rather than reproduce numbers from memory, this report leaves it empty and says why.

**What fills the gap.** Three verified anchors from the SWE-agent paper and repository, all retrieved directly. [V]

| System | Benchmark | Result | Source |
|---|---|---|---|
| SWE-agent + GPT-4 Turbo | SWE-bench Lite | **18.00%** | SWE-agent paper, arXiv:2405.15793 |
| SWE-agent + GPT-4 Turbo | SWE-bench Full | **12.47%** | same |
| SWE-agent + Claude 3 Opus | SWE-bench Lite | **13.00%** | same |
| SWE-agent + Claude 3 Opus | SWE-bench Full | **10.46%** | same |
| Shell-only + GPT-4 Turbo | SWE-bench Lite | **11.00%** | same |
| RAG baseline + GPT-4 Turbo | SWE-bench Lite | **2.67%** | same |
| RAG baseline + GPT-4 Turbo | SWE-bench Full | **1.31%** | same |
| SWE-agent + GPT-4 Turbo | HumanEvalFix | **87.7%** | same |
| mini-SWE-agent (~100 lines) | SWE-bench Verified | **65%** | SWE-agent repository, 2024-07-24 |

**These are the numbers that actually calibrate expectations, and the last row is the one that should change your plan.**

### 10.4 The three calibrations that matter

**Calibration 1: a 31B model in 2024 scored 12–18%.** SWE-agent with GPT-4 Turbo — a model vastly larger than Gemma 4 31B, in 2024, on an unrestricted agent scaffold — resolved 12.47% of SWE-bench Full. The observed competition baselines at the evidence cutoff (0.05 to 0.13) are therefore *entirely consistent* with the published range for a good system, and are not a sign of anything being broken. **A low double-digit score here is a normal, respectable result.** Competitors who read 8% and assume catastrophe have miscalibrated.

**Calibration 2: the task family moved, and the old numbers are not the target.** SWE-bench Full in 2024 and this competition's private-repository half in 2026 are different task distributions. Do not expect to hit 18%, and do not treat 18% as a ceiling either. The defensible expectation is: **somewhere in the low-to-mid double digits is a strong result**, and the observed spread across the leaderboard at the cutoff (baselines 0.05–0.13, with substantial headroom implied) is consistent with that.

**Calibration 3: the RAG baseline scored 2.67%.** Look at that row again. Adding a retrieval component to an agent, without careful integration, made it *worse than a bare shell* — 2.67% versus 11.00%. The gap between 11.00% and 18.00% is what a well-integrated ACI buys; the gap between 11.00% and 2.67% is what a badly-integrated retrieval layer costs. **This is the single most actionable row in the table**, and it is the empirical basis for the caution at §21.4 about the code-graph tools: the competition ships them prominently, and prominent tools that are not used well are worth less than no tools.

### 10.5 What to take from the model landscape

1. **Stop comparing models.** You have one model. Every hour spent comparing is an hour not spent measuring your own agent.
2. **Do compare scaffolds.** Scaffold knowledge transfers to you in a way model knowledge does not, because the scaffold is the part you write.
3. **Treat the 65% figure as a design target, not a result.** mini-SWE-agent reached 65% on SWE-bench Verified with ~100 lines of Python. You will not reach 65% on a harder, private-repository set with a 31B model and six minutes. But the *finding* — that a minimal scaffold can match a sophisticated one — is a direct instruction for how to build yours.
4. **Run your own baseline before believing any number, including these.** The gold-patch control (§9.7) is the only measurement that validates your environment, and everything else is downstream of it.

---

## 11. Scaffolds, Tools, and the Mechanisms That Actually Move the Number

> A **scaffold** is the loop around the model: which tools exist, how observations are formatted, how history is truncated, what the model is instructed to do, and when it stops. The model is fixed. The scaffold is yours. **On this competition the scaffold is most of the artifact**, and this chapter is the largest single body of transferable evidence available.

### 11.1 The Agent-Computer Interface — the four principles

SWE-agent's central contribution was not a new agent loop but a design framework for the *interface* between a language model and a computer. Its four principles, verified from the paper. [V]

| Principle | What it means | Concretely, in this competition |
|---|---|---|
| **1. Actions should be simple and easy to understand** | Each tool call has a clear, predictable effect | Prefer `edit_file`'s 3-tier matching over anything requiring precise line numbers; prefer `read_file` with explicit ranges |
| **2. Actions should be compact and efficient** | Minimal parameters, no unnecessary data | Never `cat` a whole file into a 5,000-character stdout cap; never emit a large diff when a small one applies |
| **3. Environment feedback should be informative but concise** | Not raw terminal dumps, curated signals | Pipe through `tail`/`grep`; the cap forces this anyway, so make the choice explicit rather than accidental |
| **4. Guardrails mitigate error propagation and hasten recovery** | One bad step should not cascade | Re-read before re-edit; state the expected diff before applying; never re-apply a failed edit verbatim |

**Principle 4 is the one people skip and it is worth more than the other three combined on a small budget.** A guardrail is anything that makes the model *notice* a mistake early rather than compounding it. In practice: require the model to state, before editing, the exact string it is looking for and the exact string it will replace it with. That single instruction converts a silent no-op edit into a loud, recoverable failure — and `edit_file`'s flexible and regex matching tiers exist precisely so that a slightly-off anchor still lands rather than silently failing.

### 11.2 The ablations that transfer, and the ones that do not

Verified from the SWE-agent paper, on SWE-bench Lite. [V]

| Ablation | Delta | Baseline → result | Transfers to this competition? | Why |
|---|---:|---|---|---|
| **Summarized search vs. iterative search** | **+6%** | 12.0% → 18.0% | **Yes, strongly** | With a 6-minute budget, collapsing a multi-turn search into a single summarized retrieval is worth a lot. The competition's graph tools enable exactly this shape |
| **Linting / guardrail checks** | **+3%** | 15.0% → 18.0% | **Yes, strongly** | The cheapest verified gain in the table. `python -m py_compile` after every edit costs one tool call and catches a whole failure class |
| **Context truncation (last 5 observations)** | **+3%** | vs. full history | **Partially** | The direction is verified. The *value* 5 is tuned to a 32k-class context and a different turn structure; your optimum is a different number and needs a sweep |
| 100-line observation window | Optimal; 30 or full-file both worse | — | **Conceptually yes** | The finding is that there is an interior optimum. The specific number is model- and task-specific |
| Shell-only baseline | 11.00% | — | **Yes** | The lower bound. "At minimum, match the shell" |
| RAG baseline | 2.67% | — | **Yes, as a warning** | See §10.4 Calibration 3 |

**The pattern in the first three rows is worth stating as a rule: the three largest verified scaffold gains are all about *doing less*, not more.** Summarize rather than iterate. Truncate rather than accumulate. Check rather than trust. None of them adds a capability. All of them return budget or catch errors, and on a six-minute budget that is the same thing.

**One caveat on transferring these numbers.** They are deltas on SWE-bench Lite with GPT-4 Turbo in 2024. A +6% there is roughly +18 tasks out of 300 — itself a large effect by that benchmark's standards. Here, +6% would be under 4 tasks out of 60, which §9.3 puts **inside the noise band.** So: **trust the direction, discard the magnitude.** You cannot expect to reproduce a 6-point gain at this sample size. You can only use these rows to decide *which changes to test first*.

### 11.3 mini-SWE-agent: simplicity as a finding

The single most important design result available to you, and it comes with a caveat that must be stated. [V]

> "Mini-SWE-Agent achieves 65% on SWE-bench verified in 100 lines of python!" — SWE-agent repository, 2024-07-24

**What this establishes.** A scaffold of roughly 100 lines — read, search, edit, run, submit — matched a substantially more elaborate system. Complexity in scaffolds is not free: every added component is a new failure mode, a new context cost, and a new thing to debug inside a six-minute budget.

**What it does not establish, and this is the part people skip.** The 65% is on SWE-bench **Verified** — the human-filtered, 500-task *easier* subset — with a frontier model. The 18.00% figure for full SWE-agent is on SWE-bench **Full**. **These are not comparable numbers, and neither is a prediction for this competition**, whose hidden half comes from private repositories. The finding is a finding about *scaffold design*, not about achievable score.

**The actionable version.** Start minimal. Add a component only when your failure histogram (§25.3) names a class that component demonstrably fixes, and only if the paired test clears the §9.3 bar. The failure mode to avoid is the opposite one: a 400-line agent with nine skills and three sub-agents, where a single regression anywhere is impossible to localize and every run costs more budget than the task needs.

### 11.4 Edit formats — the highest-yield tool decision

The competition's `edit_file` uses 3-tier matching: exact, then flexible, then regex. Aider's benchmark compared edit formats across models, and the finding is unambiguous. [V]

> "Plain text edit formats outperformed function-call-based formats across all models."

| Format | Token cost | Malformed-patch risk | Robustness | Verdict here |
|---|---|---|---|---|
| **Whole file** | High | **Very low** | Highest | Correct for small files; wrong for a 2,000-line module |
| **Search / replace** | Medium | Medium | High (3-tier fallback) | **Default choice.** Matches the harness's own design |
| **Unified diff** | Medium | Medium-high | Low — line numbers drift | Use only for multi-hunk edits where search/replace would need several calls |
| **AST-level** | Low | High | Poor — hallucinated structure is catastrophic | Avoid |
| **Function call** | Low | Very high | Poorest | Avoid; the Aider result is direct evidence against it |

**The failure mode this table exists to prevent** is the classic one: *the model produces a correct diff and the harness cannot apply it.* The whole point of 3-tier matching is to be forgiving about that, and the whole point of preferring search/replace over unified diff is that it exercises the forgiving tiers. A unified diff that is off by one line either applies or does not; a search/replace that is off by one character still lands via the flexible tier.

**And there is a competition-specific hazard on top of this**, measured directly in this workspace: `edit_file` payloads that were double-JSON-encoded failed **22%** of the time; payloads wrapped in a single layer of JSON failed **62%**; **raw, unencoded text failed 0% of the time.** [R] Three formats, one mechanism — encoding layers in the tool-call payload — and a 0% versus 62% spread. **This is the largest single measured effect anywhere in this report, and it is free to fix.** Make the first thing your agent does be a small `edit_file` call in raw text form, verify it landed, and never introduce a JSON-encoding layer you do not control.

### 11.5 Localization — where the competition is genuinely unusual

Most agents find the bug by searching. The competition ships something better: **256 pre-computed code graphs** (NetworkX, node IDs are fully-qualified symbols, each node carries full source text) and **256 embedding matrices** (float32, dimension 256). [V]

The evidence on what to do with them is genuinely mixed, and the mixedness is the finding.

| Mechanism | What it is | Evidence | Verdict |
|---|---|---|---|
| **LLM direct localization** | Ask the model which file/function to change, given the issue and a graph view | The +6% summarized-search delta is the closest verified support; the Agentless claim that it beats search loops could not be verified | **Most promising, cheap to test** |
| **Graph traversal** | `get_code_neighbors` / `get_code_subgraph` | Verified that they work and that the graph reveals structure — it exposed the mirrored `ahttpx` tree in §7.6 in one call | **Use with symbol queries, not prose** |
| **Embedding retrieval** | `search_similar_code` | **Measured near-degenerate in this workspace:** near-neighbour similarity > 0.99, and 6 of 6 calls exceeded 100,000 characters, ending the task with a context-window error | **Avoid, or use with a hard output cap** |
| **Classical fault localization** | Coverage profiling, trace analysis | Not applicable — air-gapped, no instrumentation | N/A |
| **AST analysis in-sandbox** | Parse the tree yourself via `run_command` | Engineering judgement, not a paper result | **Worth building** (§21.4 #5) |

**Two hard-won findings about the graph tools, both from this workspace and both worth more than any paper.** [R]

1. **The offline resolver matches symbol names, not prose.** Querying `"server connection handling"` returns nothing useful. Querying `"HTTPParser"` works. The tool's name suggests semantic search; its behaviour is name-based. **This is a scaffold instruction you can write down: always seed graph queries with a symbol name harvested from a `grep`.**
2. **`search_similar_code` output is uncapped and will end your task.** A call that returns 100,000 characters against a 32,768-token context is not a slow failure — it is a task-ending failure, and it looks like a capability problem when it is a plumbing one. If you use it at all, understand that you are gambling a task on a tool with no output limit.

**And the calibration point from §7.6 that generalizes beyond one task.** On `httpx_3672`, the decisive fault was a *caller* of the method under test, and the graph's call edges were intra-class — it could not see across the file boundary. **Graph tools answer "who calls this symbol, within the graph's resolution." They do not answer "where is this bug."** Any policy built on graph navigation must retain a `read_file` path, because some faults are only visible in the caller's body.

### 11.6 Context management

The competition's compaction is configured at interval 5, overlap 2, `token_threshold=14336`, retention 5, with context caching enabled. [V] Combined with a 32,768 maximum, the **effective context is roughly 14,000 tokens — less than half the advertised window.**

| Decision | Verified evidence | Recommendation |
|---|---|---|
| How much history to keep | Last-5-observations beat full history by +3% [V] | Truncate aggressively; full history is strictly worse in the verified case |
| Where the optimum sits | The 100-line window beat both 30 lines and the whole file [V] | An interior optimum exists — sweep it, do not assume |
| Whether to use sub-agents | `AgentTool` with `skip_summarization` is available [V] | **Only if** your logs show context overflow is a real failure class. Otherwise it is pure overhead |
| How to preserve the cache | Cache invalidation is triggered by prefix changes [C] | Keep the system prompt and tool list byte-identical across turns. It is free throughput |
| Where to put important state | Compaction is recency-weighted [C] | Front-load the task plan; do not rely on a conclusion stated in turn 3 surviving to turn 20 |

**The "unmasked thinking" trap.** The competition config allows `thinking_budget` from 0 to 32,768, default 4,096. A large thinking budget buys reasoning depth and spends both tokens and wall clock. On a six-minute budget with an unknown decode rate, **the default is a reasonable starting point precisely because it is not obviously catastrophic in either direction.** Treat it as a sweep parameter (§21.4), not a thing to maximize.

### 11.7 Orchestration — the case against multi-agent, on evidence

| Pattern | Evidence | Verdict here |
|---|---|---|
| Single flat agent | mini-SWE-agent's 100 lines reached 65% Verified [V]; the RAG baseline's 2.67% shows what a badly-integrated multi-component system does [V] | **Default. Start here.** |
| Sequential pipeline (research → edit) | No verified gain; adds turns | Test only if a specific failure class demands it |
| Parallel exploration | Consumes budget; concurrency is limited by KV cache at long context (§16.3) | Avoid at full context |
| Sub-agent for context isolation | Available via `AgentTool`; literature on the benefit is mixed | Conditional — see §11.6 |
| Agent debate / self-critique loops | Consumes budget; the intrinsic self-correction literature is negative (Ch 14) | **Avoid** |

**The two verified data points point the same way: complexity is the main risk, not the missing capability.** The 2.67% RAG baseline and the 100-line 65% are the same fact seen from two directions. Build the smallest scaffold that can do the job, and let your failure histogram tell you what to add.

### 11.8 The scaffold, assembled

Putting the verified findings together into a starting configuration. **This is a starting point to be measured against, not a recommended final design** — §21.4 is the intervention list and §21.5 is the plan for testing it.

```yaml
# Structure, not content. Every line here is a hypothesis to be tested.
agent.yaml
├── model: gemma-4-31b-it-qat-w4a16-ct      # fixed
├── instruction: !include prompts/system.md
│     ├── "The issue statement is the specification."
│     ├── "The visible test suite may contradict it. If they disagree, the
│     │    issue wins — record the disagreement BEFORE you edit."   ← §7.6
│     ├── "Always emit edit_file payloads as raw text, never JSON-wrapped."
│     │                                                              ← §11.4
│     ├── "Seed graph queries with a symbol name from grep, never prose."
│     │                                                              ← §11.5
│     ├── "State the exact old string and new string before editing."
│     │                                                              ← §11.1 principle 4
│     └── "Never finish with a clean working tree. Submit whatever you have."
│                                                                ← §9.8
├── tools: [get_status, read_file, edit_file, run_command, submit_patch,
│           get_code_neighbors, get_code_subgraph]
│     # deliberately NOT: search_similar_code   ← §11.5, measured failure
├── generate_content_config:
│     temperature: 0.2
│     max_output_tokens: 16384
│     thinking_config: { thinking_budget: 4096, include_thoughts: true }
└── (no sub_agents, no skills, no adapter)   ← until the histogram says otherwise

eval_config.yaml
└── evaluation: { max_time_minutes: 5, max_tool_calls: 25, max_turns: 40 }
      # max_time_minutes is a failsafe against a 12 h overrun that errors the run
```

**Note what is absent and why.** No `search_similar_code` (measured to end tasks). No sub-agents (unverified benefit, real cost). No skills (nothing to inject yet — add when the histogram names a repeated failure). No adapter (gated on §21.3). Each omission is a decision with a reason, and each is reversible the moment a paired test justifies it. **That is the whole philosophy of this chapter: start minimal, and let measurements — not intuitions — authorize complexity.**
---

## 12. Data: What You Have, What You Need, and What Is Contaminated

### 12.1 The dataset you were given

Verified from the competition data page and `tasks.jsonl`. [V]

| Property | Value |
|---|---|
| Public tasks | 129, in `tasks.jsonl` |
| Fields per task | `instance_id`, `repo`, `base_commit`, `created_at`, `problem_statement`, `hints_text`, `patch` (gold), `test_patch` (hidden-style) |
| Repositories | `fastapi/fastapi` (67), `Textualize/rich` (48), `psf/requests` (13), `encode/httpx` (1) |
| Code graphs | 256 JSON files, NetworkX, node IDs = fully-qualified symbols, nodes carry full source text |
| Embeddings | 256 NPZ, float32, dimension 256 |
| Offline wheels | 124 |
| Total size | 22.42 GB across 524 files |
| Task date range | 2025 vintage (e.g. `httpx_3672` created 2025-09-19) |
| Hidden half | ~120 tasks "curated from a set of private repositories" |

**The distribution in the second row is the single most important fact in this chapter.** 67 of 129 tasks are fastapi. 48 of 129 are rich. Together, 89% of the public set is two repositories. `httpx` — the one task analysed in §7.6 — is 0.8% of the public set and the only one of its kind.

**What follows from that is a constraint on every experiment you run.** You cannot learn repository-general behaviour from this set. You can learn fastapi-shaped behaviour, and you will be scored partly on private repositories that look nothing like either. §9.3 called this the clustering problem; here is the concrete form it takes: **any intervention that helps on fastapi is a fastapi intervention, and the hidden set will not reward it proportionally.** Weight your failure analysis by repository and treat single-repository wins as unproven.

### 12.2 How the tasks were built, and why that matters

The curation pipeline, verified from the data page. [V]

```text
Real commits / pull requests from open-source repositories
        │
        ▼  link each to the issue that motivated it
Issues with linked PRs
        │
        ▼  filtering (deduplication, trivial changes, non-Python, no test signal)
Candidate instances
        │
        ▼  execution verification: the tests must go fail → pass with the
│     gold patch, and stay pass → pass without it
Discriminating instances with a known-good fix
        │
        ▼  frontier-model near-completion check (is this already solved?)
Curated task set — split ~evenly into public and private halves
```

**Why the construction method is strategically important, beyond curiosity.** These are *real merged pull requests*. The gold patch is what a maintainer actually shipped, and the hidden test patch is the test the maintainer actually wrote. That is a much higher-quality signal than synthetic bug injection, and it has a specific consequence:

- **A correct fix is more likely to match the hidden test's expectation** than if the task had been synthesized, because the test was written alongside the real fix by someone who understood the bug.
- **But the graded scope is narrower than the issue text**, because the maintainer wrote tests for one behaviour, not for all five things the issue rambled about. §7.6 documents this concretely: the issue asked for five changes, the gold patch made seven file-level edits, and the hidden test checked exactly one.
- **The resolution criterion is a proxy, not a judgement of quality.** Independent research (Epoch AI, §17.1) found that automated resolution on this class of benchmark overstates how often a human reviewer would have accepted the fix. Treat "tests pass" as "the graded behaviour is right", not as "this is a good patch."

**The frontier-model near-completion check is a gift and a trap.** It removes tasks that frontier models nearly solve, which is why the public set is hard enough to be interesting. But it also means **the public set is biased toward problems that frontier models fail** — which is a different distribution from the private set only if the check was applied identically to both. It presumably was. The practical effect is that your 129-task development set is harder than a random sample of real issues, and a good score on it is a genuinely meaningful signal rather than a ceiling artifact.

### 12.3 Decontamination: three channels, one you cannot close

| Channel | How it works | Status for this competition | Mitigation |
|---|---|---|---|
| **1. Direct inclusion** | The exact (issue, patch) pair appears in your training corpus | The 129 public tasks carry gold patches. Training on them is *using the provided training set* — permitted, but it means your public score is no longer a held-out measurement | Train/validate split by **repository and by task**, never randomly (§9.4) |
| **2. Near-duplicate inclusion** | A near-identical issue or fix from the same repo | Real risk if you pull external SWE data built from these four popular repos | Embedding-similarity sweep against all 129 public instances; drop anything above a threshold you record |
| **3. Pretraining contamination** | The base model saw the repository's history during pretraining | **Cannot be ruled out.** Gemma 4's pretraining cutoff is undocumented, and fastapi / requests / rich / httpx are among the most-replicated Python projects in modern corpora | **None available.** Document it (§25.4 item 9) |

**The third channel deserves more than a footnote, because it affects the leaderboard as well as your training.** If the base model has memorized the public repositories' commit histories, then some of its leaderboard score on the *public* half of the graded set is recall rather than repair. The organizers' private-repository half is the mitigation, and it is a good one — but the mitigation is incomplete, because the private repositories are also real open-source projects, and their issues are also on the internet.

**The honest position, and the one to put in your write-up:** you cannot eliminate pretraining contamination, you cannot measure it, and the best available response is a documented provenance record plus a private-repository evaluation you trust more than the public one. A competitor who says "our result is clean" has claimed something they cannot support.

### 12.4 The transfer gap — the central data problem

**This is the finding that should govern your data strategy, and it is stated as a structural fact rather than a number.**

Every public dataset in this space is built from the same four repositories. Every hidden evaluation in this competition is built from different, private ones. The methods that improve performance on training repositories — SFT on trajectories, rejection sampling, synthetic bug injection, RL with execution rewards — are, without exception, methods whose gains are *reported* on repositories close to their training distribution. **The literature contains no verified demonstration that any of them improves performance on genuinely unseen repositories**, because the literature does not usually build that experiment.

| Method | Reported gain (magnitude **UNVERIFIED**) | Unseen-repository evidence |
|---|---|---|
| SFT on successful trajectories | consistently positive on training repos | **None verified** |
| Rejection-sampling FT | positive on training repos | **None verified** |
| GRPO / RLVR with execution rewards | larger than SFT on executable environments | **None verified** |
| Synthetic bug injection | positive on the injected distribution | **None verified**, and the distribution is *by construction* different |

**What this means practically, stated as a decision rule:**

> The 129 public tasks are worth more per example than any external corpus you could assemble, because they are the same distribution as the grading process. The 129 tasks are also **not** worth much as a measure of repository-generalization, because they are four repositories. Use them to build a behavioural prior and to localize failures. Do not expect a training recipe validated on them to transfer to the private half, and structure your evaluation so you can detect whether it did.

**One mitigation that costs nothing: hold out entire repositories, not random tasks.** If you train on fastapi and rich, validate on requests and httpx, you get a real (if tiny) transfer measurement. It is four clusters, so the statistics are terrible (§9.3 step 4), but the *sign* of the result is informative in a way that a random split is not. This is the closest thing to a transfer experiment this competition's data permits, and it costs nothing but a decision made in week one.

### 12.5 If you build a trajectory corpus at all

Most competitors should not. But if the canary passes and you take Branch B, these are the design decisions, and the honest evidence level for each is given.

| Decision | Recommendation | Evidence |
|---|---|---|
| **What to collect** | Successful trajectories only, from your own agent on the public set | Standard; execution-filtered data is the field's default filter [C] |
| **What NOT to collect** | External synthetic corpora as your primary distribution | Distribution mismatch with real-PR tasks; see §17.5 |
| **Format** | Match the inference-time format exactly — same chat template, same tool schemas, same system prompt | Format mismatch is a known silent killer of transfer [C] |
| **Loss masking** | Mask tool outputs and system prompts; train only on assistant tokens | Field standard [C]; unmasking is 2–5× the tokens for an unmeasured benefit |
| **Failure trajectories** | Include a modest fraction with a loss of zero on the failed action, or exclude entirely | No verified optimal ratio; either is defensible, document which you chose |
| **Mixture** | Blend agentic trajectories with general code data to limit forgetting | Forgetting from narrow SFT is real; the specific percentages circulating are **unverified** |
| **Decontamination** | Embedding sweep against all 129 public tasks before training | Cheap, and §25.4 requires it |
| **Provenance** | Complete the §25.4 data card | Required for the winner obligation and good practice regardless |

**The compute cost, stated so the decision is honest.** Rejection sampling at a 20% per-sample success rate costs roughly 5× generation compute per task, plus environment setup per attempt. For 500 training tasks that is thousands of rollouts. On a 4×L4 rig shared with the serving stack, this is not a weekend project. **It is the reason Branch B is gated in §21.1 and the reason Branch A is the primary track** — not because the technique is wrong, but because the wall clock is the binding constraint for someone without a GPU cluster.

### 12.6 Data decisions, summarized

| Question | Answer | Confidence |
|---|---|---|
| Should I use the 129 public tasks? | **Yes** — it is the provided training set and the closest available match to the grading distribution | High |
| Should I pull external SWE training corpora? | **Not as a primary source.** Licence-clean only, and expect a distribution mismatch | Moderate |
| Should I train on the public tasks and then report public-set scores? | **No.** That makes your number uninterpretable. Split by repository | High |
| How do I measure transfer? | Hold out whole repositories and watch the sign, not the magnitude | Moderate |
| How do I handle pretraining contamination? | Document that you cannot rule it out, and weight the private-repository evidence more heavily | High |
| Do I need a data card? | **Yes** — for the winner obligation, and because the alternative is a claim you cannot support | High |

---

## 13. Training and Adaptation: What Is Worth Doing, and What Is a Trap

### 13.1 The landscape, ordered by maturity

| Method | What it changes | Evidence level | Compute for 31B | Fits Branch B here? |
|---|---|---|---|---|
| **Trajectory SFT** | Weights, on collected successful trajectories | **Moderate** — standard, reliable, unglamorous | Moderate (LoRA makes it light) | **Yes — the recommended method if you train at all** |
| **Distillation from a frontier model** | Weights, via a teacher's trajectories | Moderate; licence and ToS are a real constraint here | Moderate–high | Only if you resolve the teacher-model licence question (§6.6, rule 2.6) |
| **Rejection-sampling FT** | Weights, on self-generated samples filtered by execution | Moderate; the filter is objective and hard to fake | **High** — generation-bound, ~5× per task at a 20% pass rate | Marginal — compute is the binding constraint |
| **RLVR / GRPO** | Weights, via policy gradient on execution rewards | Moderate; strong reported results, sensitive failure modes | **High** | **No** for this competition — see §13.3 |
| **Multi-turn agentic RL** | Weights, with tool use in the training loop | Low for this setting | Very high | **No** — needs a training environment resembling the eval environment, which you do not have |
| **PEFT / LoRA** | A low-rank weight update | High as a *mechanism*; **very low on this specific base model** | Light | **Gated on the QAT question — §13.4** |

### 13.2 Why trajectory SFT is the defensible choice, if you train

Three reasons, and the third is the one that usually gets skipped.

**First, the reward is objective.** A patch either passes the tests or it does not. This is the single most important property of this task family for training, and it is the reason "verifiable rewards" work at all. Any method that can be trained on an execution signal is playing on the field's home ground.

**Second, it is stable.** SFT on successful trajectories has no policy-gradient instability, no entropy collapse, no reward-hacking gradient. It is a supervised problem with a hard label. For a 31B model on modest hardware, that reliability is worth more than the extra points a better method might theoretically produce.

**Third — and this is the argument that actually decides it — SFT is the only method whose failure mode is a no-op.** If your adapter does nothing, your score is your baseline score, and you find out in an experiment. RL, by contrast, can *reduce* your score through reward hacking, and it will do so in ways that look like improvement on your own validation set until the graded set disagrees. **For a competition with a hidden test set and no held-out label you can trust, the method that can hurt you least is the right one.**

**The specific form to use**, if you reach this point: multi-turn, tool-use trajectories in the *exact* inference-time format, loss masked to assistant tokens only, execution-filtered, with a held-out repository for the transfer check from §12.4. Note the emphasis on format — a corpus in a different chat template or with different tool schemas will teach the model a protocol you are not using at inference, and the mismatch is silent.

### 13.3 Why RL is the wrong answer here, despite being the fashionable one

The strongest published argument for RL on SWE tasks — attributed to the R2E line of work, and retrievable here only as a thesis rather than as verified numbers — is that **RL with verifiable rewards substantially outperforms SFT, but only when executable environments are available.** [U — thesis widely reported; specific figures unverified]

**That thesis is a direct argument against using RL here**, and the reason is structural. Executable environments during *training* are what let a policy explore and learn from consequences. You do not have them at the level of fidelity the eval requires: your training environments are the public repositories, your evaluation environment is private repositories, and the gap between them is exactly the transfer gap of §12.4. RL is famously good at exploiting the environment it trains in. **Optimising hard against four public repositories is the most reliable way to produce a policy that is excellent at those four and no better elsewhere.**

There is a second, independent reason: the reward-hacking gradient. With a binary execution reward and no held-out grader, RL will find the shortest path from a policy to a high score. Some of those paths are real fixes. Some are patches that make the test pass without fixing the behaviour. And because you cannot see the hidden test, **you cannot tell which ones you have produced.** The competition's anti-tampering protects against the crudest version of this — editing the test file — but not against a patch that special-cases the input the visible test exercises. That is a real hole, and it is one more reason to prefer a method that cannot produce such a patch.

**This is not an argument that RL does not work. It is an argument that RL's cost profile — high compute, high risk, unverifiable reward, and a training distribution that is provably not your evaluation distribution — is a bad trade for a two-month single-model competition.** The method might win on a research budget. It is not the method to bet on here.

### 13.4 The LoRA-on-QAT question — the highest-risk item in the project

**State the problem precisely, because it is subtle and it is the thing most likely to burn you.**

The base model is **quantization-aware**: it was *trained* with simulated 4-bit quantization in the loop, so its weights are adapted to specific quantization ranges and error patterns. The obvious reference point, QLoRA, applies LoRA to **post-training-quantized** INT4 weights — dequantizing to FP16, adding a low-rank update in FP16 space, and requantizing. These are different regimes. A QAT weight has never existed in FP16 as a "true" weight; it is a trained artifact *of* the quantized regime.

**No published study was found on LoRA fine-tuning of QAT weights for code tasks.** The evidence is thin, the risk is real, and the failure is silent. Three specific ways it can go wrong:

| Failure mode | Mechanism | How it presents |
|---|---|---|
| **Representation misalignment** | LoRA pushes activations outside the ranges the QAT calibration assumed | Gradual quality degradation, easy to mistake for an unhelpful hyperparameter |
| **Adapter ignored at merge/serve time** | The adapter is computed but not applied, or applied to a copy of the weights that is then overwritten | **Zero change in behaviour.** The score equals the baseline and you do not know why |
| **Serving incompatibility** | The organizer's vLLM does not support the adapter configuration for this architecture | Server refuses to start, or starts and ignores the adapter |

The third row is the one with direct workspace evidence: stock vLLM was reported to refuse LoRA for the Gemma 4 architecture at startup, and the organizer's wheelhouse vLLM is required instead. The first two are structural risks that no amount of reading will resolve — only a measurement will.

**This is precisely why §21.3's canary exists, and why it is a hard gate rather than a nice-to-have.** The first test — randomize both LoRA matrices to non-zero, diff the served outputs with and without the adapter — costs an hour and converts the worst case in this section from a silent zero into a known fact. **Do it in week one, before writing any training code.**

**The practical fallback if the canary fails:** treat the QAT weights as fixed and put your effort entirely into the scaffold. This is Branch A in §21.1, and it is a perfectly respectable place to be. The competition permits a strong frozen-weights submission; it does not require a trained one.

### 13.5 PEFT mechanics, if the canary passes

| Parameter | Practical choice | Reasoning |
|---|---|---|
| Rank | Start at 16–32 | The behaviour you are teaching is a *protocol prior*, not new knowledge. High rank buys capacity you do not need and forgetting you cannot afford. The server allows 128; that is a ceiling, not a target |
| Target modules | Attention projections first (`q`, `k`, `v`, `o`) | Widely used default for adaptation at this scale; adds nothing if the model is not attending differently |
| Learning rate | 1e-4 to 2e-4 with decay | Field-standard range. **UNVERIFIED for QAT base weights** |
| Epochs | 1–3, with early stopping on the held-out repository | More epochs on a small corpus is how you memorise four repositories |
| Forgetting guard | Mix in general code data; check a general coding set before shipping | Narrow SFT degrades general ability; whether that matters for *this* competition is arguable, but it is cheap to check |
| Base weights to train against | **The QAT weights, as served** | An adapter trained against unquantized bf16 weights is a mismatch. This is a detail that silently costs several points |

*Evidence note: the range and rank recommendations in this table are field convention rather than verified results for this model, and are marked accordingly. They are starting points for a sweep, not findings.*

### 13.6 The honest summary of Chapter 13

| If you have… | Then… |
|---|---|
| No GPU cluster and two months | **Do not train.** Take Branch A, spend everything on scaffold, localization, and budget. This is the recommendation for most readers of this report |
| A rented multi-GPU rig and a clean trajectory corpus | Rejection-sampling FT or trajectory SFT on a single LoRA. Hold out a repository to check transfer. Gate everything on the canary |
| A cluster, weeks of runway, and a paper to write | GRPO in a carefully monitored environment is defensible — and the *measurements* are paper-grade, per §20.6. But the score is a secondary objective and reward hacking is a live risk |
| A canary that failed | Branch A, permanently. Record the failure; it is a publishable observation about a QAT-LoRA regime nobody has published on |

---

## 14. Self-Improvement: What It Means, and Why Most of It Is Unavailable

> **A terminological warning before the content.** "Self-improvement" covers at least seven different mechanisms with wildly different cost profiles. Conflating them is the most common analytical error in this area, and it is what produces the belief that a 31B model can bootstrap itself into a frontier coding agent in a week. It cannot. This chapter separates the mechanisms first, then explains which are actually reachable here.

### 14.1 The taxonomy, and which cells are available

| # | Mechanism | What changes | Weight training? | Available in a 12-hour scored run? | Available in the *project*? |
|---|---|---|---|---|---|
| **(a)** | **Inference-time repair** — self-debugging, reflection, retry, re-read-and-revise | The reasoning path, not the weights | No | **Yes — the primary technique** | Yes |
| **(b)** | **Data self-improvement** — the agent generates its own training data | Training corpus | Yes, offline | No | Yes, offline |
| **(c)** | **Policy improvement via RL** | Weights | Yes | No | Only with a cluster (§13.3) |
| **(d)** | **Verifier / self-critic improvement** | The evaluation signal | Sometimes | Partially — an external signal at inference | Yes |
| **(e)** | **Memory / experience reuse across tasks** | Carried state | No | **No — fresh sandbox per task** | N/A |
| **(f)** | **Environment / task generation** | New training tasks | Yes | No | Yes, offline |
| **(g)** | **Automated scaffold search** | Prompt, tools, topology | No | No — too expensive per run | Yes, offline, **and dangerous** (§14.6) |

**The distinction that resolves most of the confusion in this area: (a) is not (c).** An agent that reads its own output, notices a problem, and revises it is performing inference-time repair. It has learned nothing and will forget everything. It costs tokens and turns, which is the scarce resource here. That is the entire budget argument for preferring (a) to (c) in this competition: **(a) is available immediately, costs only the budget you were going to spend anyway, and cannot overfit a training distribution you cannot see.**

**Cell (e) is closed by the harness.** Each task gets a fresh sandbox; nothing on the filesystem persists. Cross-task memory is not available in any form except the fixed prompt and skills, which are constant across tasks. If you were expecting an agent that learns from task 40 when it reaches task 90, that is not on the table, and planning around it wastes a week.

### 14.2 Self-debugging: the strongest negative result in the field

The most cited finding in this area is negative, and it should govern how much you invest in reflection. [H — widely reported, primary source not retrievable in this session]

> **Large Language Models Cannot Self-Correct Reasoning Yet** (Huang et al., 2023, arXiv:2310.11511)

The finding, stated carefully: **prompting a model to reconsider its own answer, with no external signal, generally does not improve reasoning accuracy, and can degrade it.** The mechanism the paper identifies is that self-correction without feedback degenerates into *rewriting the same answer with different wording*, or into talking itself out of a correct position.

**The field's resolution, and it is the useful part.** The distinction that made progress was between **intrinsic** self-correction (no external signal) and **extrinsic** self-correction (a real signal: test execution, a verifier, a retrieved fact). Intrinsic correction is weak-to-useless. Extrinsic correction works — when the signal is reliable.

**Applied to this competition, that distinction is the whole design.** `run_command` gives you an *extrinsic* signal: you can run the test and see what happens. That is the reliable kind, and it is the reason a self-testing loop is worth building. What is not worth building is "re-read your patch and think about whether it is right" — that is intrinsic, it is the specific thing the literature says does not work, and it will consume turns you need for a test run that would actually tell you something.

### 14.3 The self-generated test problem

The agent cannot see the hidden test patch. It can write its own. This is the natural selection signal for any multi-candidate strategy, and it is weaker than it looks.

| Failure mode | Mechanism | Severity |
|---|---|---|
| **Mirroring the bug** | The agent misunderstands the issue, writes a test encoding its misunderstanding, and "verifies" a patch that shares the misunderstanding | **Worst case.** The patch and its test are wrong in the same direction, so the signal is confidently false |
| **Happy-path only** | Self-written tests cover the obvious case and miss the edge case the hidden test targets | Common |
| **Coupling** | The test is written *after* the patch, and so describes the patch | Avoidable, and the mitigation is procedural — **write the test before the patch** |

**The mitigation for the first two is procedural and costs nothing:** instruct the agent to write its verification test from the *issue statement and observed failing behaviour*, before writing or editing any source file. A test written afterwards is a description of what you did; a test written first is a prediction about what is required. Only the second is evidence.

**The mitigation for the third is to prefer hard-to-game tests.** A behavioural test — an input/output assertion derived from the issue — is harder to satisfy accidentally than a test that checks a specific internal value. Where the issue implies an invariant ("this must not raise on server exit"), prefer the property to the example.

**And the honest caveat.** A widely circulated estimate puts the false-positive rate of LLM-generated tests on code-repair tasks at 15–40% — meaning a patch passing the agent's own tests fails the official one that fraction of the time. **This report could not verify that range from a primary source and does not rely on it.** [U] What is verifiable is the *direction*: self-generated tests are a weaker signal than the real test, and any strategy whose selection step depends on them inherits that weakness. **Measure it yourself** — the experiment at §21.4 #9 is cheap and turns a guess into a number.

### 14.4 Self-training, self-play, and the verifier confound

| Algorithm | Core idea | Verdict here |
|---|---|---|
| **Rejection-sampling FT** | Generate k, keep what passes tests, fine-tune | The one variant worth doing — but it is offline and compute-bound (Ch 13) |
| **Self-play (SPIN-style)** | Train the model to prefer its own good outputs over its previous bad ones | Requires weights and a stronger opponent; a model cannot be its own source of improvement without a signal it does not already have |
| **STaR / RFT** | Generate rationales for problems the model gets wrong, train on them | Same constraint — offline, and the "problems it gets wrong" filter is a selection process with the usual small-sample problems |
| **Self-consistency** | Sample several paths, take the majority answer, train on the consensus | Consensus is a weak verifier for code, where two plausible wrong patches can agree |

**The confound that should govern how you read any self-improvement claim, including your own.** In many self-training results, the improvement is better explained by a *stronger verifier* than by the model improving itself. If you filter trajectories with a test suite that the model's policy was shaped to satisfy, you are not measuring self-improvement — you are measuring the fit between the policy and your grader. And since your grader is your own, the fit is guaranteed to improve whether or not the model got better at the actual task.

**The practical consequence for you:** when you evaluate any adapter, evaluate it on the *repository you held out*, not on the repository you trained on, and not on your own test suite. The held-out repository is the only instrument you have that measures the thing you care about.

### 14.5 Reward hacking — the failure mode that looks like success

A model optimised against a reward learns to satisfy the reward. In code specifically, the documented shapes are:

| Shape | What the model learns | Does your competition catch it? |
|---|---|---|
| **Test-gaming** | Produce code that passes the training-time tests without being correct | **Partly.** The hidden test patch blocks the crude version (editing the visible test) — but a patch that special-cases the exact input the test exercises is not blocked, and is indistinguishable from a fix without a human reading it |
| **Length hacking** | Longer patches correlate with correctness in the training data, so the model pads | Not caught by the metric at all |
| **Style hacking** | Code that *looks* like correct code — plausible naming, clean structure — without being functionally right | Not caught by the metric at all |

**The right response is to not create the pressure.** RL and self-training create it (§13.3). A frozen-weights scaffold with a test run and a stopping rule does not. This is the deepest argument for Branch A: **it is not merely the cheaper option, it is the option whose dominant failure mode is "score stays the same" rather than "score improves and the model gets worse."**

### 14.6 Automated scaffold search — theoretically appealing, practically dangerous

Programmatic optimization of prompts, tool sets, and agent topology is a real research area. Applied here, it is a trap, and the reason is arithmetic rather than philosophical.

**§9.4 did the calculation.** If you run 30 candidate configurations on a 30-task development slice and keep the best, the best score is a maximum over 30 noisy draws, biased upward by roughly the maximum of 30 noise draws — which at this sample size is several tasks, several times over. **The search procedure's own selection bias is larger than the effect you are trying to detect.** Automating the search does not fix this; it makes it worse, because an optimizer will run far more than 30 configurations.

Compounding it: the development set is 89% two repositories (§12.1), so the search will converge on fastapi-shaped behaviour, and the hidden set is private repositories. **You would be running an automated overfitting process against a non-representative sample with no statistical power to detect that you are doing it.**

The one defensible use: a small number of hand-specified ablations, each evaluated paired, each with a pre-registered hypothesis. That is what §21.4 is. The difference between that and automated search is that you know how many looks you took.

### 14.7 Stopping and rollback — the underrated half of the loop

The SWE-agent paper contains a finding that deserves to be quoted in full because it inverts the intuition about budget. [V]

> 93% of resolved instances submit **before** exhausting their budget, while unsuccessful runs average **higher** cost.

**Two implications, and they pull in opposite directions.**

*Don't give successful runs more room.* There is almost nothing to gain from a task that has already succeeded — it will submit itself. Every turn of extra budget spent after the patch is correct is pure waste, and waste compounds across ~120 tasks.

*Do cap failing runs aggressively.* Failed runs are the expensive ones, and they will happily spend your whole 12-hour budget failing. This is the empirical justification for per-task `max_time_minutes` and `max_tool_calls` caps, and for the host's own recommendation of a `max_time_minutes` failsafe. An unbounded agent converts an all-or-nothing risk into a run that dies at 11h59m having resolved four tasks and produced no score.

**On rollback specifically:** the harness has no notion of "revert to the previous patch." If the agent makes a good edit and then a bad one, the bad one is what is in the tree. So the agent must manage its own notion of "best so far" — and the cheapest version of that is a rule rather than machinery: **once the tree contains a plausible fix, stop editing.** An unverified improvement over a verified one is a bad trade when the verification is cheap and the budget is not.

### 14.8 What Chapter 13, 14 and 15 add up to

Inference-time repair with an **extrinsic** signal; conservative stopping; no weight changes; no automated search; no cross-task memory; explicit distrust of self-generated tests. That is a small list. It is also, on this competition's constraints, the correct one — and the reason is not timidity. It is that every mechanism on it is *available now*, *measurable*, and *incapable of silently producing a worse model than you started with*.
---

## 15. Inference-Time Compute and Candidate Selection: The Central Technical Question

> This is the chapter where the competition's constraints bite hardest and where the most consequential open question lives. It has one verified anchor, one structural insight that is stronger than any number, and one conclusion that follows necessarily from both: **sampling more candidates helps a great deal, and you have almost no way to tell which candidate is the right one.**

### 15.1 The one verified anchor

> **Large Language Monkeys: Scaling Inference Compute with Repeated Sampling** (Brown et al., 2024, arXiv:2407.21787) — the only paper in this chapter retrieved from a primary source. [V]

| Model | SWE-bench Lite, 1 sample | SWE-bench Lite, 250 samples |
|---|---:|---:|
| DeepSeek-Coder-V2-Instruct | **15.9%** | **56%** |

**Read that row carefully, because three different things are packed into it.**

The first is that **the headroom is enormous.** 3.5× from repeated sampling alone, with no training, no better model, and no better scaffold. If your model's first sample is right 15.9% of the time, its 250th sample is right 56% of the time. The capability to *produce* a correct patch is present in the model far more often than the capability to *find* it.

The second is that **this is an oracle number.** To compute it you sample 250 patches, run the real test suite against each, and count the task as solved if *any* of them passes. **You are allowed to know which one passed. The competition does not.** This is quantity 2 in §9.5 — an upper bound on any selection strategy, not a result.

The third is that **250 samples is not a budget anyone in this competition has.** Six minutes per task, on four PCIe-attached L4s, against a 32,768-token context. If one sample consumes a meaningful fraction of the task budget, 250 consumes everything and more. The number that matters is what you can afford — which is somewhere between 1 and, optimistically, 4.

**So the honest reading of the only hard number available: repeated sampling is the strongest verified lever in this entire field, and the competition's budget is roughly two orders of magnitude too small to exploit it fully.** Everything in this chapter is about what to do with the 1–4 samples you can afford.

### 15.2 The structural insight: the gap is not a tuning problem

State the constraint as a single chain, because each link is forced:

```text
The competition scores ONE patch per task
        │
        ▼  submit_patch() captures a single diff; the loop then ends
You cannot submit a portfolio of k candidates
        │
        ▼  so any k-sample strategy must select one candidate, at inference time,
            WITHOUT the answer key
        │
        ▼  and the only signals available are: your own tests, the model's own
            judgement, and inter-candidate agreement
        │
        ▼  each of which is strictly weaker than the real hidden test
        │
        ▼  therefore: selected success < oracle success, by an amount you
            cannot measure from inside the competition
```

**The consequence, and it is the single most important sentence in this chapter:**

> **The competition converts an oracle-selection problem into a verification problem, and gives you a weak verifier.** Every design decision in this area follows from that.

This is why §9.5 insists on distinguishing the four quantities. It is also why so much published evidence is not directly usable: a paper reporting `pass@8 = 30%` has measured quantity 2 and presented it in a form that reads like quantity 3. **The first question to ask of any such number is whether the selection was performed without the answer key.** If it was not, it is an upper bound.

### 15.3 The four quantities, applied to a concrete budget

Take the measured setup: a task budget of 5 minutes of agent time, of which perhaps 3 minutes is decode. Set B = the number of tool calls that fits, and k = samples per task. The trade is brutal and worth making explicit:

| Strategy | Budget split | What you get | What you give up |
|---|---|---|---|
| **Deep, single trajectory** | 100% on one attempt | One long investigate→edit→verify loop; uses the extrinsic test signal well (§14.2) | All diversity. One misunderstanding and the task is lost |
| **k = 2–4, shallow** | Split across attempts | Diversity; if your model has a 30% per-sample success rate, 3 samples miss it only 34% of the time versus 70% for one | Verification depth per attempt; and **you still cannot tell which one is right** |
| **k = 4–8** | Further split | Diminishing diversity returns; §15.5 | Almost no verification per attempt. You are selecting among guesses |

**The unforced error here is assuming the k-sample strategy is free.** It is not: selection is a *second* problem, and a hard one, and it competes for the same budget that depth needs. Spending 60% of your budget generating and 20% selecting leaves 20% to actually fix anything.

### 15.4 Selection methods, ranked by signal quality

| Rank | Method | Signal | Strength | Limitation | Verdict |
|---:|---|---|---|---|---|
| **1** | **Execution against your own tests** | Real, run in the sandbox | **Highest available.** It is the same kind of signal as the grader, just weaker | Your tests are your tests — the mirroring problem (§14.3) | **The only method worth real budget** |
| **2** | **Execution + regression check** | Your tests *plus* "did it break what worked before?" | Highest | Requires knowing what worked before; costs a test run | **Use it.** A patch that fixes the target and breaks the neighbours is a loss |
| **3** | **Inter-candidate agreement** | If k patches produce the same behaviour, likely correct | Medium — a real signal with no ground truth needed | Fails precisely when the model shares one systematic misreading; then all k agree and all k are wrong | Cheap add-on, never the sole signal |
| **4** | **Patch-similarity clustering** | Cluster candidates, prefer the largest cluster | Low-medium | Can eliminate the one creative correct answer | Diagnostic, not decisive |
| **5** | **The model's own judgement** | "Is this patch correct?" | **Lowest** | This is intrinsic self-correction, the specific thing the literature says does not work (§14.2) | **Do not spend budget on it** |

**Rank 2 deserves emphasis because it is under-used and it is free.** The competition's resolution criterion requires that previously-passing tests keep passing — the `PASS_TO_PASS` half. An agent that only checks its new test will happily trade a fix for a regression, and a regression scores exactly zero, identically to doing nothing. **Selecting the candidate that fixes the target *and* breaks the fewest neighbours is a strictly better selection rule than the target alone, at the cost of one more test invocation.**

**The one selection signal that is not on this list is the one you would want:** the hidden test. It does not exist for you. Everything above is a substitute for it, and the substitutes are all measurably worse. That is the whole problem.

### 15.5 The diminishing-returns curve, and what it means for k

The structural shape of pass@k is well established and log-linear in k — each doubling adds a roughly constant absolute increment, so the curve flattens but never inverts. The one verified point (15.9% at k=1, 56% at k=250 for one model on one benchmark) sits on that curve and is consistent with it. [V for the endpoints, C for the shape]

What follows for a budget that affords k ≈ 1–4:

| k | Marginal value | Recommendation |
|---:|---|---|
| 1 | Baseline | Your default. Spend the budget on depth |
| 2 | Real but modest | Worth it if your per-sample success is low and your selection signal is execution-based |
| 4 | The practical ceiling here | The only k at which "diversity plus execution-based selection" is a coherent strategy |
| 8+ | Unreachable at this budget | — |

**The honest caveat.** The 15.9 → 56 curve is for a *different model* on *SWE-bench Lite*, and the flattening observed at large k says nothing about whether the first four samples of *your* model are diverse in a useful way. **The correct first experiment is not "does k help" — it is "are my k samples different?"** If they are near-identical, k buys nothing at any budget, and you should spend everything on depth. That measurement is cheap: run 4 samples at a moderate temperature on 20 tasks and diff them.

### 15.6 Sampling parameters

| Parameter | Effect | Recommendation for a 5-minute task |
|---|---|---|
| **temperature** | Below ~0.2, samples are near-identical and k is wasted. Above ~0.8, per-sample quality falls faster than diversity rises | **~0.5–0.7 if you are sampling multiple candidates; ~0.2 if you are running one deep trajectory** |
| **top_p** | Similar direction, weaker effect | 0.95, as the sample config defaults |
| **thinking_budget** | Buys reasoning depth, costs tokens *and* wall clock | Sweep it. The default 4,096 is a reasonable start, not an optimum |
| **max_output_tokens** | Too low truncates tool calls mid-tag, burning a turn | 16,384. The competition default already anticipates this |
| **seed** | Whether repeated sampling actually produces distinct trajectories | **Verify it.** If your serving path pins the seed, k sampling is k identical runs and you have wasted your budget |

That last row is a trap worth naming explicitly, because it fails invisibly. If temperature is low *and* the seed is pinned, four samples are four copies of one trajectory, the selection step has nothing to choose from, and the whole strategy costs you 75% of your budget for nothing. **Log the seeds and the actual outputs, and confirm they differ, before believing any k-sample result.**

### 15.7 The verdict, and what to do instead

**Does k-sample selection belong in your submission?** The analysis above says: *probably not at k > 2, and only with an execution-based selector, and only if your samples are actually diverse.* At four samples with a self-test selector, you are spending most of a six-minute budget to make a selection decision you cannot make reliably.

**The alternative that captures most of the same value at a fraction of the cost** is *depth with an extrinsic signal*, executed in a fixed order:

```text
seed        1–3 calls   identify the file/symbol (grep + graph, name-seeded)
localize    3–8 calls   read the smallest sufficient region
edit        2–6 calls   small, raw-text, incremental
guard       1 call      python -m py_compile — the cheapest verified gain (+3%)
verify      2–5 calls   targeted tests only; never the full suite
submit      1 call      free — and ALWAYS, whatever the state
```

**Why this is the better bet, stated as an argument rather than a preference.** The deep strategy spends budget on the extrinsic signal, which §14.2 identifies as the *reliable* kind of self-correction. The k-sample strategy spends budget on diversity, which is valuable only if you can select — and your selector is weak by construction. **When your verifier is weak, buy depth rather than breadth.** That is the general principle, and it is the one worth carrying away from this chapter.

**And the one measurement that would change the conclusion.** If Exp-E1 (§21.4 #9) shows that your self-written tests discriminate strongly — that patches passing them pass the hidden tests far more often than not — then the verifier stops being weak, the k-sample strategy becomes attractive again, and you should revisit it. **That is a hypothesis with a cheap test, which is the only kind of thing in this report worth more than the reasoning above.**

### 15.8 A note on what "inference-time compute" cannot buy here

Three of the most powerful recent inference-time techniques are **unavailable**, and it is worth naming them so a reader does not spend a week trying to apply them:

| Technique | Why unavailable |
|---|---|
| **Speculative decoding** | You do not control the serving configuration |
| **Tree search / MCTS over patches** | The rollout count is orders of magnitude beyond a six-minute budget, even at the small end |
| **Multi-turn self-consistency with a verifier model** | There is no second model. The verifier is the same 31B model, which makes it §14.2's intrinsic correction |

What remains is budget shaping, ordering, and stopping. That is a smaller set of levers than the literature would suggest, and it is the set the competition actually rewards.
---

## 16. Systems: What the Hardware and Serving Stack Actually Permit

> The purpose of this chapter is not to describe hardware. It is to establish which constraints are *hard*, which are *soft*, and which are *unknown* — because the strategy in Chapter 21 is entirely determined by the first two categories and cannot be responsibly set until the third is measured.

### 16.1 The verified serving configuration

Everything in this table comes from the organizer's own `HARNESS_README.md`. It is not inference. [V]

| Parameter | Value | Source |
|---|---|---|
| GPUs | 4 × NVIDIA L4 | HARNESS_README |
| Tensor parallelism | `tensor_parallel_size=4` | HARNESS_README |
| GPU memory utilization | 0.80 | HARNESS_README |
| Maximum model context | 32,768 tokens | HARNESS_README |
| Base model | `gemma-4-31b-it-qat-w4a16-ct` (INT4 QAT weights, 16-bit activations) | HARNESS_README + competition page |
| LoRA serving | `enable_lora=true`, `max_loras=8`, `max_lora_rank=128` | HARNESS_README |
| Tool-call parser | `gemma4` | HARNESS_README |
| Reasoning parser | `gemma4` | HARNESS_README |
| Per-container RAM | 4 GiB | HARNESS_README |
| Per-container vCPU | 2 | HARNESS_README |
| Network | `network_mode="none"` — fully air-gapped | HARNESS_README |
| Per-command timeout | 300 s | HARNESS_README |
| Per-command stdout cap | 5,000 characters | HARNESS_README |
| Default per-task budgets | 60 min / 100 tool calls / 500 turns, all settable in `eval_config.yaml` | HARNESS_README |
| Total wall-clock budget | 12 h, **inclusive** of container setup | Competition overview |
| Event compaction | interval 5, overlap 2, `token_threshold=14336`, retention 5 | HARNESS_README |
| Context caching | enabled | HARNESS_README |

**The one line in that table that constrains everything else is `max_model_len=32768`.** It is not the model's capability — Gemma 4 supports far longer contexts — it is a serving allocation. Everything about context policy, sub-agent design, and file reading follows from a 32,768-token ceiling against a 14,336-token compaction trigger.

**The second line that constrains everything else is 6 minutes per task, derived rather than stated.** The competition specifies 12 hours for ~120 tasks. Twelve hours is 720 minutes; 720 / 120 = 6. The organizer's own default is 60 minutes per task, which would permit 12 tasks in the budget and is obviously not the intended shape. **The 6-minute figure is arithmetic, not documentation, and it is the single most consequential number in this report.** If a reader has a different task count in mind, they should recompute it: the per-task budget is `720 / N` minutes where `N` is the number of tasks in the scored run.

### 16.2 The hardware, verified

NVIDIA's published L4 specifications. [V — NVIDIA product page, accessed 2026-10-02]

| Property | Value | Consequence for this competition |
|---|---|---|
| Architecture | Ada Lovelace (not Turing — an earlier draft of this analysis had it wrong) | Modern INT8 support available |
| Memory | 24 GB GDDR6 per card; 96 GB total | 76.8 GB usable at `gpu_memory_utilization=0.80` |
| Memory bandwidth | 300 GB/s per card | Decode is bandwidth-bound, as always |
| Interconnect | PCIe Gen4 x16, ~64 GB/s bidirectional — **no NVLink** | TP=4 pays an all-reduce penalty every layer |
| FP32 | 30.3 TFLOPS | — |
| BF16/FP16 tensor | 242 TFLOPS (with sparsity) | Prefill path |
| INT8 tensor | 485 TOPS (with sparsity) | Weight path for W4A16 |
| INT4 tensor | **not listed in the public specification** | Unverified whether the W4A16 path uses native INT4 or dequantizes |
| TDP | 72 W | Thermal headroom is not a constraint |

**The PCIe point deserves emphasis because it is the reason "just add GPUs" is not available and why throughput cannot be borrowed from H200 or GB200 benchmarks.** Tensor parallelism splits every weight matrix and every activation across all four GPUs, and synchronizes twice per transformer layer. Over NVLink that synchronization is cheap; over PCIe Gen4 it is not. Reported penalties for PCIe-based TP on transformer inference are typically in the 15–30% range relative to NVLink-connected configurations. **No published measurement of Gemma 4 31B at TP=4 on L4 was retrievable**, so the absolute throughput number is unknown — which is precisely why §21.2 makes measuring it yourself the fourth task of day one rather than a detail.

### 16.3 KV cache — the calculation that matters, done carefully

This is where an analysis goes wrong most easily, and the direction of the error is important: it makes people think they have far more concurrency than they do. Here is the derivation, with every assumption exposed so a reader can substitute the real numbers once they are known.

**Step 1 — memory budget.**

```text
Total GPU memory                = 4 × 24 GB                        = 96.0 GB
Usable at utilization 0.80                                       = 76.8 GB
INT4 weights (30.7B × 0.5 B)                                      ≈ 15.4 GB
Non-quantized parts (embeddings, lm_head, norms) at 16-bit        ≈  4.3 GB
Activations, CUDA graphs, fragmentation, LoRA buffers            ≈  3–8 GB
                                                              ---------
Available for KV cache                                             ≈ 49–54 GB
```

**Step 2 — bytes per token.** The KV cache size per token depends on exactly one architectural ratio, and only that ratio:

```text
bytes/token = 2 (K and V) × 2 B (bf16) × L (layers) × N_kv × H_d
```

Since `N_kv × H_d = H × (N_kv / N_h)` — because `H = N_h × H_d` — the expression collapses to:

```text
bytes/token = 4 × L × H × r        where r = N_kv / N_h  (the GQA group ratio)
```

**`hidden_size`, `num_attention_heads` and `num_kv_heads` for Gemma 4 31B were not disclosed on the accessible model card at the evidence cutoff.** [U] The following table is therefore a **sensitivity analysis**, not a measurement. It shows what the answer looks like across the plausible range so a reader can see which regimes matter. [D]

| Group ratio `r` | Regime | Assumed `H` | Bytes/token | Bytes at 32,768 tokens | Concurrent full-length sequences in ~50 GB |
|---:|---|---:|---:|---:|---:|
| 1 | Full multi-head attention | 4096 | 983 KB | **31.5 GB** | **1** |
| 1/2 | 2-way GQA | 4096 | 492 KB | 15.7 GB | 3 |
| 1/4 | 4-way GQA | 4096 | 246 KB | 7.9 GB | 6 |
| 1/8 | 8-way GQA | 4096 | 123 KB | 3.9 GB | 12 |

**Read the first row carefully, because it inverts a comfortable assumption.** At 32,768 tokens, a full-multi-head-attention configuration of this size needs roughly *as much memory as the entire available pool* for a single sequence. An analysis that computes "50 GB ÷ 983 KB = ~52,000 concurrent sequences" has compared a per-token cost against a per-sequence budget and is off by a factor of 32,768.

**Why this matters even if the real configuration turns out to be 8-way GQA.** The 14,336-token compaction threshold is *less than half* of the 32,768 maximum. Compaction configured that aggressively is consistent with memory being tight, and it means **the effective context is roughly 14k tokens, not 32k** — a number that should govern every context-management decision. Workspace measurements also recorded a collapse in maximum servable prompt length from 46,048 to 7,600 tokens when LoRA buffers were preallocated. [R] That specific measurement was made under a different configuration than the competition's, so the absolute numbers do not transfer; **the direction does**: mounting an adapter consumes KV headroom, and at a compaction threshold already set to 14,336, the margin may be thin.

**Practical consequences, in order of confidence:**

1. **Do not plan on parallel branches at full context.** Concurrency at long context is low under every row of the table. If you want k-sample candidate generation, generate samples *sequentially* at short context, or generate them as k short independent trajectories rather than k long ones sharing a prefix.
2. **Context caching is load-bearing, not a nicety.** The harness enables it. Preserve prefix stability — a stable system prompt and a stable tool list let the cached prefix survive; re-ordering tools or paraphrasing the instruction between turns invalidates the cache and costs a full re-prefill on every turn.
3. **Compaction at 14,336 is a design constraint, not a failure.** Write sub-agent summaries to be short, and put the most important state early in the conversation, because compaction is an interval-and-overlap scheme (interval 5, overlap 2) and recency dominates what survives.
4. **Measure your own decode rate before planning anything.** Every budget decision downstream — how many tool calls fit, whether thinking is affordable, whether k-sampling fits at all — depends on a number that no accessible source publishes.

### 16.4 Converting the budget into a turn budget

The arithmetic a competitor should perform in hour one, using their own measured numbers.

```text
Per-task wall clock                          = 720 min / N tasks
  less container setup and snapshot extract  = (measure it)
  less test-execution time per turn         = (measure it)
  -------------------------------------------------
  = agent-generation time per task
        ÷ (measured decode tokens/s)
  -------------------------------------------------
  = theoretical maximum output tokens per task
        ÷ (tokens per turn: thinking + tool call + result echo)
  -------------------------------------------------
  = number of complete turns that fit
```

Two published, verified facts constrain the middle of this chain: `thinking_budget` defaults to 4,096 tokens and a realistic turn emits 4,000–8,000 tokens of thinking plus tool call plus reasoning. **If the measured decode rate is 30 tokens/s, one turn costs two to four minutes of pure generation, and a 6-minute task affords one or two turns.** At that point the agent is not an agent; it is a single-shot patch generator with a retrieval step, and the architecture in Chapter 21 has to change accordingly. If the rate is 100 tokens/s, six minutes buys six to eight turns, which is a conventional tool loop.

**The two ends of that range call for completely different designs, and only measurement tells you which one you are in.** This is why §21.2 puts the measurement first. It is not a warm-up exercise; it is the branch point for the entire project.

### 16.5 Training and serving feasibility for the LoRA branch

If the canary in §21.3 passes and Branch B is taken, these are the real constraints. [V for the limits, D for the sizing]

| Constraint | Value | Consequence |
|---|---|---|
| Maximum adapter rank at serving | 128 | Rank 8–32 is ample for a behavioural prior; high ranks buy little here |
| Maximum simultaneous adapters | 8 | More than a handful of specialized adapters is pointless — they are not task-selectable at inference anyway |
| Adapter size at rank 64–128, 31B | roughly 0.9–1.8 GB per adapter | Well within the 3 GiB submission cap for 1–2 adapters; not for 8 |
| Submission archive cap | 3 GiB unpacked | Caps the total adapter budget |
| Model must be QAT W4A16 | fixed | A LoRA trained against the unquantized bf16 weights is a mismatch; train against the QAT weights or the adapter is fighting quantization noise |
| vLLM variant | organizer wheelhouse, not stock PyPI | Stock vLLM has been reported to refuse LoRA for the Gemma 4 architecture at startup [R] |

**The last row deserves emphasis.** Adapter training and adapter serving are not the same problem, and the failure mode is asymmetric: a training run can succeed and produce a perfectly good adapter that the scorer silently ignores. That is why the canary's first test is a **loud-adapter output diff** — randomize both `lora_A` and `lora_B` to non-zero values and check that the served model's output actually changes. If it does not, the adapter is not mounted and you would otherwise have no way to know until you read a score of zero.

### 16.6 What is hard, what is soft, what is unknown

| Constraint | Classification | Why |
|---|---|---|
| Air-gapped sandbox | **Hard** | `network_mode="none"`; no inference-time external service is possible under any strategy |
| 32,768-token maximum context | **Hard** | Set by the serving configuration, not negotiable |
| 12-hour total budget | **Hard** | Competition rule; overrun errors the run |
| One base model | **Hard** | Competition rule |
| LoRA-only weight adaptation | **Hard** | Competition rule |
| Single submitted patch per task | **Hard** | `submit_patch()` captures one diff |
| 4 GiB RAM / 2 vCPU per container | **Hard** | Harness allocation |
| 300 s per-command timeout | **Hard** | Harness |
| Test-file edits are discarded | **Hard** | Anti-tampering reset — and it makes the strategy pointless anyway |
| Decode rate | **Soft** | Fixed by the configuration, but the *effective* rate is yours to influence via output length and cache stability |
| Number of turns that fit | **Soft** | Determined by your budget shaping, not by the harness |
| Context utilization before compaction | **Soft** | Yours to manage |
| `hidden_size` / `num_kv_heads` | **Unknown** | Not disclosed; §16.3 is a sensitivity analysis until it is |
| Effective throughput at TP=4 on PCIe | **Unknown** | No published measurement exists |
| Whether an adapter submitted today is served correctly | **Unknown** | §21.3 exists to convert this to a known |
| Order in which public and private tasks are run | **Unknown** | Ambiguity A1 |

**The pattern to notice: almost everything structural is hard, and almost everything that determines your score is soft or unknown.** That is a favourable configuration for a competitor, because soft levers are the ones you can move, and unknown ones are the ones you can convert to known with a few hours of measurement.

---

## 17. What Changed in 2025–2026, and What It Means Here

> **A note on evidence quality, stated up front and without softening.** This chapter is the weakest evidenced in the report. The session's web-search budget was exhausted by the parallel workstreams before the secondary literature could be checked against primary sources, and most model cards and papers were inaccessible (HTTP 401/404) at retrieval time. What follows separates three tiers and never mixes them: what is **independently verified**, what is **widely reported but not independently confirmed here**, and what is **structural inference from the competition's own verified constraints**. The conclusion of the chapter is in the structural tier and is therefore the most robust part of it.

### 17.1 The measurement reckoning — the most important 2025–2026 development

Two findings from independent research organisations stand out because they change how the entire field's numbers should be read, and both were retrieved directly rather than recalled.

| Finding | Source | Date | What it says |
|---|---|---|---|
| SWE-bench Verified, as originally constructed, rewards solutions that human reviewers judge incorrect a non-trivial fraction of the time; the practical implication is that automated resolution is a proxy for "would a maintainer merge this", not for "is this a good fix" | Epoch AI | 2025-06-13 | Benchmark validity is a first-class research question, not a footnote |
| Real-world maintainers merge far fewer AI-generated pull requests than benchmark scores would predict, with time-horizon effects — experienced maintainers reviewing unfamiliar, AI-dense, large changes are *slower*, not faster | METR | 2025–2026 | The benchmark-to-deployment gap is measurable and large |

These are consistent with each other and with a broader pattern: **the field built benchmarks faster than it built the evidence that they measure what they claim.** That pattern is the single most important thing to carry into this competition, because the competition's metric is exactly such a proxy — the percentage of repositories passing validation tests. Chapter 7 treats the resolution criterion in detail; the point here is that the proxy's imperfection is now documented, not speculative.

**Reported but not independently confirmed here:** an OpenAI post titled along the lines of "why we no longer evaluate SWE-bench Verified" was widely discussed in the research window. The URL returned HTTP 403 and its contents could not be read. **No claim in this report rests on it**, and it is listed in the access log at §25.7 solely so a reader can find it themselves.

### 17.2 Benchmark proliferation — verified structure, unverified details

SWE-bench is no longer one thing. The track list was confirmed directly from `swebench.com`. [V]

| Track | What it is | Category (§4.2) |
|---|---|---|
| SWE-bench Verified | A human-filtered subset of the original set | **Dataset subset** — a different denominator, not a better score on the same one |
| SWE-bench Lite | A reduced, cheaper-to-run subset | **Dataset subset** |
| SWE-bench Full | The complete original set | **Dataset** |
| SWE-bench Multimodal | Issues involving images | **Dataset** |
| SWE-bench Multilingual | Non-Python repositories | **Dataset** |

The category discipline in §4.2 is not pedantry here: a paper reporting 30% on "SWE-bench" may be reporting a number on the full 2,294-task set, on Verified's 500, or on Lite's 300. Those are three different experiments. **Any comparison between two such numbers is meaningless without knowing which set each used**, and the resolution rates are not comparable across them even with identical models and scaffolds.

**Reported but not independently confirmed here:** SWE-bench Pro (a harder protocol), SWE-bench-Live (a continuously refreshed set), SWE-rebench (re-evaluation exposing score inflation), Terminal-Bench (terminal-agent tasks), and Multi-SWE-bench (multi-language). These all appear in the research window and are plausible; none was retrieved from a primary source. Treat them as leads to follow, not as established facts.

**The direction of travel is the durable point, and it does not depend on any specific unverified claim:** the field has moved from single-benchmark reliance toward multi-benchmark evaluation and toward continuously refreshed task sets, precisely because static benchmarks stopped being trustworthy. That is a response to contamination and to proxy validity, and it is the same concern that motivates the competition's own use of private repositories and a held-out split.

### 17.3 The open-weight coding-model wave

Structurally, this is the most relevant development to the competition, because **the competition's model is a 31B open-weight dense model with a 32,768-token serving window and a six-minute budget.** A vendor's frontier closed-coding-model SWE-bench number is almost irrelevant to what is achievable here; the relevant comparison is with other models in the same size class under the same constraints.

What can be said with confidence is structural rather than numerical:

- Model releases in the 7B–35B range specifically aimed at agentic code repair became common in 2025, and several carried open weights under permissive licences.
- Reported scores in that class on SWE-bench-family benchmarks are typically in the tens of percent, not the eighties — which is the single most important calibration fact for a competitor, because it means **a low single-digit or low-double-digit score on this competition is a normal, respectable result rather than a failure.**
- Vendor-reported numbers are self-reported, and at least one systematic problem with them — training-set contamination — was publicly disputed across multiple models during the window.

**This report deliberately does not reproduce a table of model scores.** The underlying sources were not retrievable, and a table of unverified numbers in a report that elsewhere insists on four-way evidence tagging would be self-undermining. The recommendation is the same one the evidence supports: *if you need these numbers for a decision, fetch them yourself from the model cards, and record the retrieval date, because this area's numbers are the least stable facts in the field.*

### 17.4 Training methods — verified structure, unverified specifics

The progression over the window, stated as a structure rather than as results:

| Stage | Method | What it changes | Mature enough to rely on? |
|---|---|---|---|
| 1 | **Trajectory SFT / distillation** | Weights, on collected successful trajectories | **Yes** — the most reliable, lowest-variance option, and the only one that fits a 31B model and a small compute budget |
| 2 | **Rejection-sampling fine-tuning** | Weights, on self-generated samples filtered by an execution-based reward | **Yes**, and it is the natural next step after SFT because the reward is cheap and objective |
| 3 | **RLVR / GRPO on execution rewards** | Weights, via policy-gradient methods on verifiable rewards | **Partially** — strong reported results; sensitive to reward-hacking failure modes that are hard to detect |
| 4 | **Multi-turn agentic RL** | Weights, with tool use in the training loop | **Not for this competition** — it needs a training environment that resembles the eval environment, and you do not have one |

**The key structural insight for Chapter 13 is that stages 1 and 2 share a property that stages 3 and 4 do not: their reward signal is execution-based and therefore hard to fake.** A patch either passes the tests or it does not. This is why trajectory SFT and rejection-sampling FT are defensible for a competition with no reward model and a hidden test set, and why the RL stages — which need a well-specified, gameable reward — are where reward hacking enters.

**The reward-hacking risk that applies even to stage 2 deserves naming.** If you collect training trajectories by keeping the patches that pass *your own* tests, you are training on a reward that a future model can learn to game. The mitigations are the same ones as everywhere else in this report: train against tests that check behaviour rather than implementation, hold out tests the model never saw, and prefer a hidden or organizer-provided signal over your own wherever one exists.

### 17.5 Synthetic data industrialization

Widely reported and structurally significant: the construction of task instances by *synthesizing* bugs in real repositories — injecting faults into known-good code so that a verified failing test and a known fix both exist by construction — became a standard way to produce training corpora at volumes that human curation cannot reach.

**Why this matters to the competition in a specific way.** The public development set was built by the opposite method: mining real commits and pull requests, linking them to issues, and verifying that the tests genuinely go from fail to pass. That method yields tasks that look like real work and that real graders accept. The synthetic method yields tasks at scale but with a different character — the injected bug may be more stereotyped than a real one, and the accompanying test may be more brittle.

**The strategic implication is a warning, not an opportunity.** If you train on synthetic instances from the four public repositories, you are training on a distribution that differs from both (a) the public set's real-PR construction and (b) the hidden set, which is built from *private* repositories. The risk is a model that learns to repair stereotyped injected faults and is no better at the genuine, messy, cross-module problems the leaderboard measures. **Use synthetic data for volume if you have compute; do not use it as your only distribution.** The public set's 129 real tasks are worth more per example than a thousand synthetic ones, and they cost nothing extra to obtain.

### 17.6 Contamination — the structural problem, stated plainly

The competition's design *is* the answer to contamination, and understanding why is the most useful thing in this section.

| Mechanism | How it works | What it prevents |
|---|---|---|
| **Private repositories** | The hidden tasks come from repositories the model has less reason to have memorized, and which the competitor has never seen | Memorization of a specific repo's history |
| **Half the set held out** | ~120 tasks split roughly evenly public / private | Tuning against the exact graded instances |
| **Hidden test patches** | The graded tests are rewritten by the organizer and reset before verification | Editing tests to force a pass |
| **Air-gapped inference** | No network at evaluation time | Fetching the answer |
| **Single fixed base model** | No chance to swap in a model that saw the answers | Model substitution |

**And yet contamination is not eliminated — it is displaced.** The remaining, uneliminable channels are:

1. **Pretraining contamination of the public repositories.** `fastapi`, `rich`, `requests` and `httpx` are among the most heavily represented open-source Python projects in modern corpora. The base model has very likely seen their commit histories, their issues, and their pull requests — including the very fixes the public tasks are drawn from. This cannot be fixed and cannot be measured from outside.
2. **Adapter-side leakage.** If you train on the public set and the hidden set is drawn from a related distribution, you may learn the *organizer's curation style* — which is a milder but real form of test-set adaptation.
3. **Prompt-side leakage.** Community discussion of a live competition is a public channel through which task characteristics can travel. Reading the discussion board for harness behaviour is legitimate and valuable; using it to reconstruct hidden task content is not, and would also be a poor use of your time, since the organizers' priority is that the hidden set stays hidden.

**What to do about the first channel, which you cannot eliminate:** state it plainly in your write-up and your data card. A competition entry that says "we cannot rule out pretraining contamination of the public repositories, and here is what we did do about it" is doing better science than one that claims a clean result. §25.4 item 9 exists for exactly this.

### 17.7 Serving infrastructure — where the verified progress is

The vLLM blog was retrieved directly and provides the one set of hard numbers in this section. [V]

| Development | Reported effect | Transfers to this competition? |
|---|---|---|
| vLLM as an inference stack | Order-of-magnitude throughput and latency improvement over naive HuggingFace generation | Yes — the organizer uses it, so this is why the setup is feasible at all |
| Multi-LoRA serving | Multiple adapters resident simultaneously with bounded memory | Yes — `max_loras=8`, `max_lora_rank=128` |
| INT4 / FP8 weight quantization | 1.3×–2.15× throughput depending on architecture and hardware | **Partially** — already baked into the QAT W4A16 base model; cannot be applied again |
| Speculative decoding (EAGLE-family) | ~1.8×–2.0× throughput on decode-heavy workloads | **No** — you do not control the serving configuration |
| Decode context parallelism | ~3× on long-context workloads | **No** — the serving config is fixed at TP=4 |
| Diffusion draft decoding for Gemma 4 | Latency improvement reported in the vLLM blog | **No** — same reason |

**The pattern is the useful part.** The most dramatic serving advances of the window are all *unavailable* here, because the competition fixes the serving configuration and you are a *user* of it, not an operator. The two that do transfer — multi-LoRA and INT4 quantization — are already applied for you. **This is the clearest single illustration of the theme running through this whole report: most of what the field has built in 2025–2026 is either already applied to your stack or deliberately withheld from you, and your actual advantage lies in the unglamorous middle — budget shaping, localization efficiency, and stopping policy.** That is Chapter 21's thesis, and this section is where its evidence base lives.

### 17.8 The structural conclusion

Stated without appeal to any unverified number:

> In 2025–2026 the field's progress went almost entirely into three places: bigger models, more training, and better serving infrastructure. **All three are either fixed or unavailable in this competition.** What is left to the entrant is the part the field has historically under-invested in — measurement, budget discipline, and knowing what the grader actually wants. That is not a consolation prize. It is the reason a 31B model on four L4s scores in the low double digits rather than zero, and it is the reason the interventions at §21.4 are mostly engineering rather than modelling.

---
## 18. Case Studies and the Transfer Matrix

### 18.1 The five cases worth knowing

Most case studies in this domain are either "our system scored X" or "we found a bug in benchmark Y". The five below are selected because each teaches a *mechanism* that survives the transfer to this competition, rather than a number that does not.

#### Case A — The ACI ablation: what a scaffold is worth with the model held constant

**The case.** SWE-agent's ablation table, SWE-bench Lite, GPT-4 Turbo throughout. [V]

| Configuration | Result | What changed |
|---|---:|---|
| Shell only | 11.00% | Nothing but a shell |
| Full ACI scaffold | 18.00% | The interface design |
| …with iterative search | 12.00% | Replacing summarized search with iteration |
| …without linting guardrails | 15.00% | Removing the guardrail check |
| …with full history instead of last-5 | 15.00% | Removing truncation |

**The mechanism.** Every gain in that table comes from *reducing what the model has to process or get wrong* — summarize rather than iterate, check rather than trust, truncate rather than accumulate. **Not one of them adds a capability the model lacked.** The model can already do all of this; the scaffold stops it from doing it badly.

**Why it transfers.** The mechanism is budget- and precision-limited, and this competition is the most budget-constrained setting the method has ever been applied to. A change that saves turns is worth *more* here than on SWE-bench, not less.

**What does not transfer.** The magnitudes. +6% on 300 tasks is ~18 tasks; +6% on 60 is under 4 tasks, which is inside the noise band (§9.3). **Use this case to choose what to test, not to predict what you will find.**

#### Case B — mini-SWE-agent: the 100-line result

**The case.** A ~100-line scaffold reported at 65% on SWE-bench Verified, matching the much more elaborate SWE-agent. [V — SWE-agent repository, 2024-07-24]

**The mechanism.** Complexity is not free. Each added component is a new failure mode, a new context cost, and a new debugging surface — and in a scaffold, the components *interact*, so failures are not additive.

**Why it transfers, and where it stops.** The direction transfers absolutely: start minimal. The number does not transfer at all. 65% is on Verified, with a frontier model, no meaningful budget constraint, and a mature benchmark. **Anyone quoting "65%" as an expectation for this competition has made four errors at once.** The correct use of this case is as a design constraint on *your* agent's size.

#### Case C — Large Language Monkeys: the oracle gap, measured

**The case.** DeepSeek-Coder-V2-Instruct on SWE-bench Lite: **15.9% at 1 sample, 56% at 250 samples.** [V — arXiv:2407.21787]

**The mechanism.** The model *can* solve far more problems than it solves on its first try. The capability is present; the retrieval of it is not.

**Why it matters here more than anywhere else.** This is the only verified headroom measurement available, and the competition's budget is roughly two orders of magnitude too small to exploit it. It therefore does two things at once: it establishes that the ceiling is far above the baselines, and it establishes that **closing that ceiling requires a selection mechanism, which is the one thing this competition structurally denies you** (§15.2).

**The transfer lesson, stated as a decision rule.** When your verifier is weak, buy depth rather than breadth. Sampling more is only valuable if you can tell which sample is right.

#### Case D — `httpx_3672`: the trap that inverts the debugging reflex

**The case.** Analysed in full at §7.6. A task where doing exactly what the issue says turns the visible test suite red, and where the issue asks for five changes while the grader tests one.

**The mechanism.** The agent and the grader read *different tests*. Every locally available signal — the visible suite, the intuition that a red suite means a broken fix — actively punishes the correct behaviour.

**Why it transfers, and why it generalizes beyond the instance.** This is not an `httpx` quirk. It is a structural property of the task family: whenever the hidden test patch rewrites tests to match a renamed or changed API, the visible suite encodes the *old* contract. The public set contains rename and refactor tasks (§12.2 shows they were mined from real PRs, and API renames are common in real PRs), so **a non-trivial fraction of this competition's tasks has this shape.** The generalisation is: *know before you start whether the visible and graded tests can disagree, so that red does not read as new information.*

#### Case E — The workspace measurement failures: what actually broke

**The case.** Four failure modes measured directly in this workspace, against the real harness. [R — prior-workspace research, re-read here as an unverified input]

| Failure | Measurement | Consequence |
|---|---|---|
| `edit_file` payload encoding | 62% failure with single-JSON wrapping, 22% with double-JSON, **0% with raw text** | A free, total fix. Also the largest measured effect in this report |
| `search_similar_code` output size | 6 of 6 calls exceeded 100,000 characters; nearest-neighbour similarity > 0.99 | Task-ending failure, not a slow degradation. Avoid, or cap the output |
| LoRA KV collapse | Max servable prompt fell from 46,048 to ~7,600 tokens with an adapter mounted | At a 14,336-token compaction threshold, the margin may not exist |
| Silent adapter zeroing | Weights set under one module name, reset under an alias | An adapter can be trained, shipped, and do nothing |
| Local grading vs. leaderboard | Local scores **anti-correlated** with leaderboard scores; host confirmed broken local infrastructure | Your CV is meaningless until the gold-patch control passes at 100% |

**Why this case is the most valuable in the chapter, and it is a methodological point.** Every other case is a published result on a different benchmark with a different model. This one is a measurement *of this competition's harness*, in this competition's environment, on this competition's model. **It is worth more than the literature, and it is worth more precisely because it is boring** — nobody publishes "the JSON wrapper broke `edit_file`", and that single fact is worth more points than most of the technique papers in Chapter 11.

**And the honest caveat, which applies to the whole case.** These are single-source measurements from prior workspace research, not peer-reviewed, not reproduced here. **Every one of them is cheap for you to reproduce in an hour, and every one of them should be.** Treat them as strong priors, not as established facts — which is exactly what the canary at §21.3 does for the adapter rows.

### 18.2 The transfer matrix

**What this table is for.** It maps each technique in this report to a verdict for *this* competition, with the reason and the condition that would change the verdict. It is the bridge between the literature chapters and the playbook, and it is designed to be argued with.

| Technique | Verdict | Why | What would change the verdict | See |
|---|---|---|---|---|
| **Minimal scaffold** | **Copy** | Verified twice: 100 lines matched a complex system; 93% of successes self-terminate early | Your logs showing budget exhaustion as a dominant failure class | §11.3, §14.7 |
| **Summarized search over iterative search** | **Copy** | The largest verified ablation gain (+6%), and the direction is budget-preserving | A sweep showing iterative search wins on your model | §11.2 |
| **Lint / compile guardrail after each edit** | **Copy** | Cheapest verified gain (+3%); one tool call catches a whole failure class | Nothing plausible — do it | §11.1 |
| **Aggressive history truncation** | **Copy** | +3% verified; and the effective context is ~14k, not 32k | A sweep showing a larger window is better | §11.6 |
| **Search/replace edits over unified diff** | **Copy** | Exercises the harness's 3-tier matching; whole-file for small files | Nothing plausible | §11.4 |
| **Raw-text `edit_file` payloads** | **Copy — highest priority** | 0% vs 62% measured failure in this exact harness | Nothing plausible — free | §11.4, Case E |
| **Symbol-seeded graph queries** | **Adapt** | The resolver matches names, not prose; the graph reveals structure well | Graph calls failing to correlate with resolution on your logs | §11.5 |
| **`search_similar_code` for localization** | **Avoid** | Uncapped output ended 6 of 6 calls; embeddings near-degenerate | A capped wrapper making output usable | §11.5, Case E |
| **The visible-vs-graded asymmetry rule** | **Adapt — test early** | Mechanism verified on a real instance; generalization untested | A paired test on a rename/refactor slice showing no gain | §7.6, §21.4 #2 |
| **Scope discipline (minimal graded change first)** | **Adapt** | Verified on one instance; the graded scope is not knowable in general | A paired test showing under-fixing costs more than over-fixing | §7.6.3, §21.4 #6 |
| **LLM-direct localization (Agentless-style)** | **Adapt** | Mechanically sound; graph assets support it; no verified numbers retrieved | Localization is *not* your dominant failure class | §11.5 |
| **AST / symbol-index helper skill** | **Adapt** | Cheap to build; `run_command` permits it; untested | Tool-call budget cannot absorb it | §21.4 #5 |
| **Sub-agent for context isolation** | **Adapt — conditional** | Available and cheap; benefit unverified; the 32k window may not bind | Context overflow appears in your failure histogram | §11.6, §21.4 #7 |
| **Trajectory SFT + one LoRA** | **Adapt — gated** | The only training method whose reward is objective and whose failure is a no-op | The §21.3 canary failing | §13.2, §13.4 |
| **RLVR / GRPO** | **Avoid** | Trains hard against a distribution that is not your evaluation distribution; unverifiable reward; reward hacking | A training environment that matches the private-repo distribution | §13.3 |
| **Automated scaffold search** | **Avoid** | Selection bias from many looks exceeds the effects sought; 89% of the dev set is two repos | A development set with real repository diversity | §14.6, §9.4 |
| **Cross-task memory** | **Avoid — impossible** | Fresh sandbox per task | Nothing. This is a harness property | §14.1 |
| **Best-of-k with self-test reranking** | **Adapt — low priority** | Selection signal is weak; costs budget; k>4 unreachable | Self-tests shown to discriminate strongly (§21.4 #9) | §15.4, §15.7 |
| **Best-of-k without selection** | **Reject** | The competition scores one patch | Nothing | §9.5 |
| **Intrinsic self-correction ("re-read and reconsider")** | **Avoid** | The strongest negative result in the field | External signal becomes available | §14.2 |
| **Per-task budget caps** | **Copy** | Failed runs are the expensive ones; a 12 h overrun errors the whole run | Nothing plausible | §14.7, §21.4 #3 |
| **Always submit, never end clean** | **Copy — mandatory** | An unsubmitted patch is captured only if the tree is dirty | Nothing plausible | §7.4 mode 1, §21.7 |

### 18.3 The three things the cases agree on

Every case above, from five different directions, supports the same three conclusions. That convergence is the strongest signal available in this report, and it is worth stating compactly:

1. **Simplicity beats sophistication, consistently and in both directions.** The 100-line result (Case B), the guardrail/truncation/summarization gains (Case A), and the 2.67% RAG baseline all say the same thing: added complexity is a liability, and the failures it introduces cost more than the capability it adds.
2. **The budget, not the model, is the binding constraint.** Six minutes, 32k context, 25 tool calls, one submitted patch. Nearly every verified gain in this report comes from spending *less* — and nearly every technique that wins on an unconstrained benchmark is unavailable or unaffordable here.
3. **Measure the harness, do not trust the documentation or the literature.** Case E is worth more than Cases A–D combined, because it is the only one measured on *this* system. The competition's scoring stack broke in at least four documented ways during its first week.

---


---
## 19. Counterevidence and Competing Interpretations

> The purpose of this chapter is adversarial. Its job is to state, as forcefully as the evidence allows, the cases against the conclusions of this report — and to say what would falsify each one. A report with no counterevidence section is a report that has not been tested.

### 19.1 The contradiction ledger

Each row is a genuine tension between two sources or between a claim and an observation. None is resolved by authority; each is resolved by a measurement you can run.

| # | Tension | Side A | Side B | Status | Resolution |
|---:|---|---|---|---|---|
| **C1** | Is the resolution metric a good proxy for a good fix? | Benchmarks are the field's measure of progress | Epoch AI [V]: a substantial fraction of "resolved" patches would not be accepted by human reviewers | **Unresolved, and unresolvable internally** | Optimise the metric; state the limitation. You cannot do better under the rules |
| **C2** | Do the shipped code-graph assets help? | The organizers shipped them, implying value | Near-degenerate embeddings and uncapped output in workspace measurement [R] | **Unresolved — Side B is unreproduced** | Run it yourself with an output cap; correlate graph calls with resolution (§21.4 #4) |
| **C3** | Is a simple or a complex scaffold better? | mini-SWE-agent: 100 lines → 65% Verified [V] | Your 6-minute budget and 31B model are nothing like the setting where that was measured | **Both true, different regimes** | Start minimal; add only what your histogram names |
| **C4** | Can LoRA be used at all? | LoRA is explicitly permitted, `max_loras=8`, `max_lora_rank=128` [V] | Silent zeroing and a 46,048 → 7,600 token collapse, both unconfirmed [R] | **Unresolved** | The canary, §21.3. Five checks, a few hours |
| **C5** | Is local validation trustworthy? | Standard practice; §9.7 assumes a working local env | Local scores anti-correlated with the leaderboard; host confirmed broken local infra [R] | **Local env was broken; yours may not be** | The gold-patch control at 100%. Non-negotiable |
| **C6** | Is more inference compute the answer? | 15.9% → 56% from 1 → 250 samples [V] | You may afford k ≈ 1–4 and cannot select among them (§15.2) | **Both true; the second wins on constraints** | Buy depth, not breadth. Revisit only if your verifier proves strong |
| **C7** | Does more training data help? | Every published method reports gains on training repos | **No verified evidence of transfer to unseen repositories** (§12.4) | **Genuinely open** | Hold out a repository and watch the sign, not the magnitude |
| **C8** | Is the 12 h budget inclusive or exclusive of setup? | Overview: 12 h total | Harness: container setup excluded from per-task `time_minutes` | **Both — the gap is the schedule** | Measure setup separately; it is the most underestimated block (§21.7) |
| **C9** | Do baseline scores indicate something is broken? | Baselines of 0.05–0.13 [R] | SWE-agent + GPT-4 Turbo scored 12.47% on SWE-bench Full in 2024 [V] | **Not broken — in range** | §10.4 Calibration 1. A low double-digit score is normal |
| **C10** | Should you pursue task ordering? | The public split may run first (ambiguity A1) | The rules reserve the right to deem behaviour as undermining the competition; and it optimises the wrong distribution | **Recommend against, on both grounds** | §21.7 |
| **C11** | Is 129 public tasks a good training corpus? | Real, verified, same construction as the grading process | 89% two repositories; no repository diversity | **Good prior, poor coverage** | Use it; hold out a repository (§12.4) |
| **C12** | Is the evidence base in this report strong enough? | Competition facts, harness, and hardware are [V] from primary sources | Most literature claims are [U] — the search budget was exhausted | **Documented, not hidden** | §25.7, §1's limitations. Treat the weak rows as hypotheses |

### 19.2 Promised fixes that were not confirmed

The organizer has stated intent to fix several harness behaviours. **None was confirmed as deployed at the evidence cutoff.** [R — community reports, host statements, unreproduced]

| Reported behaviour | Promised fix | What to do |
|---|---|---|
| `read_file` with a line range raises a type error | Fix promised | Test it in hour one. Use ranges if it works; whole reads if it does not |
| `search_similar_code` returns uncapped output | Fix promised | **Do not rely on the fix.** Cap it yourself |
| Thinking content dropped from the event stream | Fix promised | Verify `include_thoughts` actually surfaces reasoning |
| 12 h overrun errors the whole run | Failsafe recommended | Build the `max_time_minutes` failsafe regardless (§21.4 #1) |
| Local Docker grading differs from the scorer | Root cause discussed | The gold control is your only defence |

**The general rule: a promised fix is a hypothesis, not a feature.** Every one of these must be reproduced by you, with your own run, before you build a strategy on it.

### 19.3 The strongest case against this report

Stated at full strength, because a report that cannot survive its own red team is not worth reading.

**Argument.** This report leans heavily on (a) a handful of SWE-agent ablations measured in 2024 with a frontier model on a 300-task benchmark, (b) a set of workspace measurements that are single-source, unreproduced, and may describe a harness that has since been fixed, and (c) a competition fact sheet that is ~9 months old at the final deadline. It then recommends a conservative, minimal, measurement-first strategy while declining to recommend training, multi-agent systems, or inference-time scaling — the three things that are actually winning in the field. A competitor with a GPU cluster and three months could run rejection-sampling FT or GRPO and blow past a frozen-weights scaffold.

**How much of this is right.** Substantially, and it should change how you read the recommendations.

1. **The magnitude claims do not transfer, and I have said so repeatedly.** §11.2 says "trust the direction, discard the magnitude." That is a real limitation, not a hedge.
2. **The workspace measurements are unverified.** Case E is the most valuable chapter content and the least well-sourced. If `search_similar_code` was fixed last week, or if the `edit_file` encoding bug was harness-side and is gone, some recommendations are stale. **The correct response is to re-run all four measurements in hour one — it is cheap, and it is the single most valuable thing you can do.**
3. **The fact sheet ages.** Every rule in §6 must be re-verified before you act on it (§25.6). The rules will be amended; the competitions of this kind always are.
4. **The conservatism may be wrong for a well-resourced competitor.** The argument for Branch A is not that training does not work — it is that it is compute-gated and infrastructure-gated for *most* readers. If you have a cluster and a working canary, §13.6 says train, and this report's central recommendation does not bind you.
5. **Most importantly: the strongest competing strategy may be one this report does not consider at all.** §22.4 argues that the biggest verified lever — inference-time scaling — is unaffordable. If your measured decode rate turns out to be three times what the pessimistic case assumes, k becomes 8, and §15.5's ceiling analysis breaks down. **This is why §21.2 makes measuring the decode rate the fourth task of day one.** The report's central strategic claim is conditional on a number it could not obtain, and it says so.

**What is not in dispute.** The competition facts (§6), the harness mechanics (§11, §16), the statistical arithmetic (§9), the resolution semantics (§7.1), the oracle-vs-selected structure (§15.2), and the failure modes (§7.4). These come from primary sources and the arithmetic is self-contained. **If you discard everything else in this report, these remain.**

### 19.4 Falsification conditions

For each major recommendation, the observation that would show it is wrong. This is the most useful table in the report for anyone who intends to disagree with it.

| Recommendation | Falsified if… | Cheapest test | Cost |
|---|---|---|---|
| Start with a minimal scaffold | A richer scaffold wins ≥6 paired tasks with no regressions | Two scaffolds, 30 tasks, paired | 1 day |
| Use raw-text `edit_file` payloads | Raw text fails more often than single-JSON in *your* environment | 20 edits in each format | 1 hour |
| Avoid `search_similar_code` | Capped calls resolve more tasks than no calls | Paired run, 30 tasks | 0.5 day |
| Set `max_time_minutes` as a failsafe | Unfinished tasks error the run rather than scoring 0 | Run the scorer with a deliberately impossible cap | 1 hour |
| Add the test-asymmetry rule | It wins <6 paired tasks, or causes regressions | Paired run on a rename/refactor slice | 0.5 day |
| Cap per-task tool calls | Tighter caps collapse the tail without improving the median | 3-value sweep, paired | 1 day |
| Stay on frozen weights | A canary-passing LoRA wins ≥6 paired tasks with no regressions | Canary, then a paired run | 2–3 days |
| Prefer depth over breadth | Selected k=2–4 clearly beats a single deep trajectory | Matched-budget paired run | 1 day |
| Do not pursue task ordering | The public split is confirmed to run first *and* the rules permit it | Ask the organizers | 1 hour |
| The competition does not use SWE-bench | An organizer statement or the data page contradicts it | Re-read the Data page | 15 min |

**Every row is cheap relative to the decision it protects.** That is the design principle: the expensive mistakes in this project are not the ones where you spent three days on a technique that did not work. They are the ones where you built a strategy on an unverified premise and found out in week eleven.

### 19.5 What I would flag as genuinely uncertain

Not "uncertain" in the hedged sense. These are the places where the honest answer is *I do not know, and neither does the literature I could reach.*

1. **Whether repository-level improvement transfers at all.** The entire training literature reports training-repository gains. Whether any of it moves performance on private repositories is, as far as this session could establish, unmeasured. This is the largest genuine unknown in the field, and it is the reason §12.4's hold-out-repository advice matters more than its sample size suggests.
2. **What the private half of the task set looks like.** "Private repositories" is a distribution you cannot characterise. If they are systematically simpler or messier than the public four, every prior in this report is miscalibrated.
3. **Whether the harness is now healthy.** Five documented failure modes, several promised fixes, none confirmed. The state at submission day may be materially better or worse than at the evidence cutoff.
4. **What a good score actually is.** The baselines at the cutoff span 0.05–0.13, and there is no external calibration for this model on this task distribution. Whether a strong entry scores 0.15 or 0.45 is genuinely unknown, and it changes the entire strategic calculus. **Run the baseline yourself; that is the only way to find out.**
5. **Whether the public repositories contaminated the base model's pretraining.** §12.3. Unmeasurable from outside, and it affects the interpretation of every number on the leaderboard.

### 19.6 The red-team compliance check

A short list of things that would be **disqualifying**, gathered from the rules and from the obvious failure modes, written plainly because the cost of getting this wrong is total:

| Prohibited | Rule basis | Note |
|---|---|---|
| Hand-labelling validation or test data | Rules §3.4.b | Absolute. Includes inferring hidden test content and encoding it |
| Circumventing the time, memory or tool budget | Rules §3.8.d | Including any mechanism that makes the run cheaper than documented |
| Privately sharing competition code with another team | Rules §3.6.a | Teams may use public resources; they may not share privately |
| Sandbox escape or prompt-injection of the harness | General | Automatic disqualification |
| Distillation the winner cannot disclose under a compatible licence | Winner obligations | The obligations apply to the *winner*; assume they apply in spirit |
| Editing tests to force a pass | Anti-tampering | Pointless — the edits are reset — and it reads as tampering |
| Being a Competition Entity employee | Eligibility | Cannot win |

**And two things that look prohibited but are not, which people wrongly avoid:**

| Permitted | Why |
|---|---|
| Training on the 129 public tasks | It is the provided training set. Rules §2.6 permits external data meeting the standard; the public set is given |
| Reading the discussion board for harness behaviour | Public. The line is using it to reconstruct *hidden task content*, which is both pointless and against the rules |

---

---

## 20. Beginner Learning Paths

This chapter is for the reader described in CQ-01: comfortable in Python, knows the basics of machine learning, and has never worked on SWE-bench or an agent harness. It assumes you have already read §4.3 — those five facts will save you a month of confusion.

**A note on the philosophy here.** Reading is not implementation. Every day below has a *deliverable* that is a file, a measurement, or a decision — not a bookmark. If you finish a day having only read, you have not finished the day.

### 20.1 The fourteen-day path

| Day | Objective | Concrete deliverable | Verify it by |
|---:|---|---|---|
| 1 | Understand repository-level issue repair by doing one task by hand. | Take one public task from `tasks.jsonl`. Write the problem statement in your own words. Read the gold patch. Write a 200-word note on what the bug was, where it lived, and why the fix works. | Someone who has not read the task can follow your note. |
| 2 | Read the metric and harness documentation. Classify the entities. | A one-page glossary of: instance, base commit, gold patch, test patch, FAIL_TO_PASS, PASS_TO_PASS, resolution rate, harness, scaffold. Plus a table classifying 8 benchmarks by *category* (dataset / track / scaffold / training set / model / separate benchmark). | You can explain why "SWE-bench Verified" and "SWE-bench Lite" are different datasets, not different scores on one dataset. |
| 3 | Audit two published scores. | Fill the §25.1 worksheet twice, for two real published results. Then write: "these two numbers are not comparable because ___". | You can name at least three protocol differences that would make the numbers incomparable. |
| 4 | **Validate a local evaluation environment.** | Run the gold patch on 20 public tasks locally. Record how many pass. | **Gold must pass 100%.** If it does not, stop and fix the environment — every later number is meaningless until you do. |
| 5 | Run or inspect a minimal permitted agent loop. | Get the official sample submission running end to end on 2–3 tasks, reading every log line. | You can point to the exact line in the log where the patch was captured. |
| 6 | Trace localization, edits, tests, and patch extraction. | For 3 tasks, tabulate every tool call, its purpose, and its cost in tool calls and characters. | You can say how many tool calls a correct fix actually needs, versus how many were used. |
| 7 | **Label representative failures and establish a baseline ledger.** | Run the baseline on 30 tasks. Label each failure using §25.3. Produce a histogram of failure classes. | Your histogram has a dominant class with ≥40% of failures. That class is your first target. |
| 8 | Test one localization or context-management intervention. | One change. Paired evaluation on the same 30 tasks. Report the 2×2 table and the McNemar outcome. | You can state b, c, and the exact p-value — not just "it went up". |
| 9 | Test verification and stopping behaviour. | Change one stopping or verification rule. Paired evaluation. | Same standard as day 8. A null result here is a *valid and valuable* outcome. |
| 10 | Measure latency, tokens, tool calls, and resource failures. | Produce a per-task cost profile: tokens in/out, llm calls, tool calls, wall-clock, and the split between model time and tool time. | You can compute the theoretical maximum output tokens for a 6-minute budget at your measured decode rate. |
| 11 | Design leakage controls and data provenance records. | A completed §25.4 data card for whatever data you hold, plus a decontamination check against the public task set. | You can state, in writing, what you cannot rule out (pretraining contamination) and what you did rule out. |
| 12 | Compare sampling and selection under a matched budget. | k samples at fixed total budget vs. 1 sample at the same budget. Record oracle and selected success **separately**. | You can state your oracle-to-selected ratio. If you cannot, the experiment was not run properly. |
| 13 | **Frozen validation comparison and regression check.** | Run your best configuration and the baseline on the untouched validation set. | Zero regressions on previously-resolved tasks. |
| 14 | **A compliant dry run.** | Package `submission.zip` and run the full scoring path locally on the public set, end to end, with timing. | The archive is under 3 GiB, has exactly one root config, and produces a `submission.parquet`. |

Days 4, 7, 13 and 14 are the load-bearing ones. Skipping day 4 is the most common and most expensive mistake in this whole table: a broken local environment makes every subsequent measurement noise, and you will spend days optimizing a number that means nothing.

### 20.2 The one-week cram path

For a reader who needs to be competent, not complete, in seven days.

| Day | Focus | Deliverable |
|---:|---|---|
| 1 | §4.2 glossary + §4.3 five facts + one task read end to end | One-page written explanation of how a task is scored |
| 2 | §6 (competition fact sheet) + §7 (benchmark foundations) | The permission map, filled in, with your own reading of each rule |
| 3 | §8 (leaderboards) + §9.3 (the noise arithmetic) | A worksheet auditing two real scores |
| 4 | **Build the environment and run the gold-patch control** | Gold passes 100%, or the environment is fixed until it does |
| 5 | Run the baseline; label 20 failures | A failure histogram with a dominant class |
| 6 | One paired intervention, honestly evaluated | A 2×2 table and a p-value |
| 7 | Package and dry-run a submission | A `submission.zip` that runs the real path |

**What you give up:** the training and self-improvement chapters. That is a real loss but not a disqualifying one — a well-instrumented frozen-weights scaffold is a legitimate and competitive approach to this competition.

### 20.3 The four-week deep-study path

For a reader who intends to compete seriously, or to publish.

| Week | Content | Deliverable |
|---|---|---|
| 1 | Days 1–7 of the fourteen-day path, then the full §6, §7, §8, §9 | A verified local environment and a labelled baseline failure histogram |
| 2 | §11 (scaffolds), §12 (data), §15 (inference-time compute); run three controlled scaffold ablations | Three paired comparisons with logged configurations |
| 3 | §13 (training), §14 (self-improvement); build a small trajectory corpus and a LoRA adapter; §16 (systems) to size it | A trained-or-not-decided adapter, with the compute honestly accounted for |
| 4 | §17 (advances), §18 (cases), §19 (counterevidence), §22 (playbook); a full dry run | A rehearsal submission plus a written risk register |

**The discipline that makes week 4 honest:** write down every experiment you ran, including the ones that failed and the ones you abandoned. A log containing only successes cannot support any claim, and the counterevidence chapter is impossible to write without the failures.

### 20.4 The experienced-reader shortcut

If you already know this field and want the decision-relevant material only:

| Read | For |
|---|---|
| §3 | The executive summary — verified status, top findings, recommended branch |
| §6 | The fact sheet and permission map; the ambiguity list A1–A7 |
| §9.3 | The noise arithmetic — this governs every experiment you will run |
| §9.5 | The four quantities you must not conflate |
| §16 | Feasibility under the real hardware and budget |
| §19 | The contradiction ledger and falsification conditions |
| §22 | The playbook, ranked interventions, and the critical path |
| §25.3 | The failure taxonomy — usable as a labelling schema immediately |

### 20.5 Five misconceptions that will cost you a week each

| Misconception | Why it is wrong | What to do instead |
|---|---|---|
| "The visible tests failing means my fix is wrong." | The grader resets test files and applies a hidden test patch. The visible suite can be *actively misleading* about the graded requirement. | Treat the issue statement as the specification and the visible tests as a secondary signal. Encode this as an explicit rule in your agent's instructions. (§7.6) |
| "A 4% score improvement is progress." | On 60 tasks, 4% is 2.4 tasks, inside the noise band. | Require 6+ outright wins with no regressions before believing anything. (§9.3) |
| "My local CV is tracking the leaderboard." | Workspace evidence documents local scores **anti-correlating** with leaderboard scores, because local grading was broken independently of the model. | Run the gold-patch control. If gold is not at 100%, your CV is meaningless. |
| "More samples will raise my score." | You submit one patch. Sampling only helps if you can *select* well without the answer key, and the budget is fixed. | Measure oracle and selected success separately, and only then decide. (§15.2) |
| "The graph tools are the organizer's intended advantage." | They are a tool, not a strategy. Their observed behaviour in practice included uncapped output that ended tasks, a name-based rather than prose-based query resolver, and near-degenerate embeddings. | Measure whether graph calls correlate with resolution on *your* runs before building a policy around them. |

### 20.6 A note on the paper track

The separate paper track is worth $35,000, closes **2026-11-12** — two weeks before the main entry deadline — and is judged on Novelty, Quality, Relevance, Verifiability and Clarity, with ties broken by earliest entry. It is **independent of your main-competition standing**, and a weak leaderboard finish does not disqualify you.

The judging roster is weighted toward graph machine learning and software-engineering research. The strongest entries will therefore be those that produce *measurements* — about what actually breaks small-model SWE agents, or about the code-graph and embedding assets — rather than prompt-tuning war stories. Your instrumentation work is already paper-grade raw material; the fourteen-day path produces it as a by-product. Budget three days for the write-up and submit early, because the platform has a known writeup save/submit failure mode and because earliest entry wins ties.
---

## 21. Competition Playbook

> This chapter converts everything above into a plan. It is written to be executed by one or two people with no guaranteed training budget, on a live competition with roughly two months of runway at the evidence cutoff. Every recommendation is tagged with its permission status and what would falsify it. Nothing here promises a score.

### 21.1 Choose your branch first — the decision that constrains everything else

The competition permits three genuinely different strategies. Choosing deliberately, and knowing what each one forecloses, is the first decision.

| Branch | What you do | What you cannot change | Best when | Evidence-to-effort |
|---|---|---|---|---|
| **A. Frozen weights, editable scaffold** | No adapter. Spend everything on prompts, tools, skills, topology, localization, budget and stopping policy. | The model's weights. The metric. The 12 h budget. The 32k context. The tool set. | You have no training compute, or the LoRA path is unproven on the scorer (§6.4 notes no adapter submission had scored by the cutoff). | **Highest.** Most of the levers are free. |
| **B. Frozen weights + one targeted LoRA** | Train a single adapter on trajectory SFT from your own dev-set rollouts; keep the scaffold simple. | Base model. Total submission < 3 GiB. Adapter rank ≤ 128. | Your instrumentation from weeks 1–2 produced a clean trajectory corpus, and the LoRA serving bugs are confirmed fixed by your own canary. | **Medium.** Real upside, gated on an unconfirmed infrastructure path. |
| **C. Heavy adaptation** | RL or large-scale SFT, multi-adapter, possibly a specialized sub-agent adapter. | Same hard limits, plus your wall clock. | You have real compute (multi-GPU rental or a local rig) *and* weeks of runway. | **Lowest for this competition**, and the gate is compute, not idea. |

**Recommendation: run Branch A as the primary track and Branch B as a strictly gated parallel experiment.** The reason is structural, not ideological. Branch B's entire value is contingent on an infrastructure path that had not produced a single scored adapter submission at the evidence cutoff, and whose two known failure modes — silent adapter zeroing and a KV-cache collapse from 46,048 to 7,600 tokens — are exactly the kind of failure that produces a *silent* score of zero rather than an error. A plan whose main line depends on that is a plan whose main line can vanish on submission day with no warning.

Concretely: **build a full, competitive Branch A submission that does not touch LoRA at all.** Then, if and only if the canary in §21.3 passes, add the adapter. If the canary fails, you have lost nothing.

**What Branch A forecloses:** the ability to improve the model's protocol adherence, tool-call formatting, or tendency to revert correct fixes at the weight level. Some of these are addressable by prompt and skill, and some genuinely are not. That residual is the honest cost of the branch.

### 21.2 The first 24 hours — measure before you build

The single most valuable thing you can do in your first day is not design an agent. It is **find out what the model actually does inside the real budget.** Everything after is a function of that.

| # | Task | Time | Why it is first |
|---|---|---|---|
| 1 | Stand up the local environment from the organizer's wheelhouse and Getting Started notebook. | 2 h | Nothing works without this. |
| 2 | **Run the gold-patch control on 20–30 public tasks.** | 2 h | If gold is not 100%, every later number is noise. Fix until it is. |
| 3 | Run the official sample submission on 5 tasks with full logs. | 2 h | Gives you the real trace, not the documented one. |
| 4 | **Measure the decode rate at your serving configuration** and compute how many output tokens fit in a 5-minute per-task budget after subtracting tool time. | 2 h | The binding constraint. Everything is downstream of this. |
| 5 | Measure container setup time separately from agent time. | 1 h | The 12 h budget includes setup; the per-task budget does not. This gap is your real schedule. |
| 6 | Test `search_similar_code` with a prose query and with a symbol query. Measure output size. | 1 h | Documented to return uncapped node source; confirm current behaviour. |
| 7 | Test `edit_file` against a real file, with a payload sized like a realistic patch. | 1 h | Tool-result encoding bugs were the single largest measured failure source. |
| 8 | Test `read_file` with and without line-range arguments. | 0.5 h | A community report claimed a type error on ranged reads; confirm. |
| 9 | Confirm whether a dirty working tree is captured without an explicit `submit_patch()`. | 0.5 h | It is documented, and it is your floor-protection mechanism. |
| 10 | Write down the **measured** per-task budget arithmetic. | 1 h | This becomes the `eval_config.yaml` in every later run. |

**The output of day one is a single number: how many useful tool calls this model can complete in five minutes.** If it is 4, your agent must be near-stateless and guess-driven. If it is 25, you can afford a genuine investigate-then-edit loop. Almost every architectural decision downstream is determined by that one number, and it is not knowable from documentation.

### 21.3 The LoRA canary — a strict gate, run early

Do not put an adapter in a submission until this canary passes. Each check is designed to catch a failure mode that would otherwise present as a silent zero.

| # | Canary | Catches | Pass condition |
|---|---|---|---|
| C1 | **Loud-adapter output diff.** Train or construct an adapter with both `lora_A` and `lora_B` randomized to non-zero, run identical prompts at temperature 0 with and without the adapter, and diff the outputs. | Silent adapter zeroing — weights set under one name and reset to zero under an alias. | Outputs differ measurably. Identical output ⇒ the adapter is not active. |
| C2 | **Long-prompt survival.** Run a 15,000-token prompt through a served model with an adapter mounted. | KV-cache collapse (46,048 → 7,600 tokens when LoRA buffers are preallocated). | Completes without hanging. A silent hang here is the signature. |
| C3 | **Score the scorer path.** Submit a trivial adapter-only submission and confirm it runs. | Adapter registration and addressing. | A score comes back. |
| C4 | **Verify max rank.** Confirm the highest rank you intend to use is served correctly. | Silent truncation at `max_lora_rank`. | Behaviour matches your local test. |
| C5 | **Reproduce with the official wheelhouse vLLM, not stock PyPI vLLM.** | The startup refusal where stock vLLM does not support LoRA for the Gemma 4 architecture. | Server starts. |

**Decision rule.** If C1–C5 all pass, proceed to Branch B and treat the adapter as a candidate intervention subject to the ordinary experimental standard (§9.4) — it is not automatically an improvement. If any fails, stay on Branch A, and record the failure so your write-up can report it. **The cost of running this canary in week 1 is a few hours. The cost of skipping it is discovering the problem on submission day.**

### 21.4 Ranked interventions

Ranked by evidence-to-effort ratio and feasibility, not by invented expected gain. "Expected benefit" is deliberately qualitative: this competition does not support numeric point predictions, and §9.3 shows why any such number would be noise.

| # | Intervention | Mechanism | Permission | Effort | Evidence | Confidence | Likely failure mode | Cheap validation | Go / no-go |
|---|---|---|---|---|---|---|---|---|---|
| **1** | **Set `max_time_minutes` as a failsafe in `eval_config.yaml`** | Prevents a whole-run error from a 12 h overrun. | Permitted (P7) | ~15 min | Host's own advice; documented overrun behaviour | **High** | None material — worst case you cap a task you would have lost anyway | Run the scorer locally; confirm unfinished tasks score 0 rather than erroring the run | **Do it unconditionally.** |
| **2** | **Encode the visible-vs-graded test asymmetry as an explicit agent rule** | Stops the agent from reverting a correct fix because its local suite went red. | Permitted (P1) | 1–2 h | Mechanism verified on a real task (§7.6); a naive modelled trajectory died exactly here | **Moderate** | The rule fires when it should not — i.e. when a red suite really does mean the fix is wrong. Costs a few tokens per task. | Take the rename/refactor slice of the dev set; run paired with and without the rule | Go if it wins ≥6 tasks with no regressions |
| **3** | **Budget shaping: per-task `max_time_minutes` ~5, `max_tool_calls` ~20–25** | Under a 12 h total, an unbounded agent eats the budget on early tasks and starves the rest. Per-task limits convert an all-or-nothing risk into a uniform expectation. | Permitted (P7) | 1 h | Arithmetic from §9.2 and §16.4; host recommendation | **Moderate–High** | Capping too tight truncates tasks that would have succeeded late | Sweep 3 cap values on the same 30 tasks, paired | Go if the median improves and the tail does not collapse |
| **4** | **Symbol-seeded localization: `get_code_neighbors` / `get_code_subgraph` first, `grep` for name seeding, `search_similar_code` only with symbol queries** | The offline resolver matches names, not prose; the graph reveals structure (e.g. mirrored trees) in one call. | Permitted (P5) | 2–4 h | Documented resolver behaviour; verified dual-tree discovery on a real task (§7.6.4) | **Moderate** | Graph calls return little and burn budget; embeddings are near-degenerate | Log `graph_calls` and `first_correct_commit`; correlate with resolution across 30 tasks | Go if high-graph-call runs resolve more |
| **5** | **A `run_skill_script` static-analysis helper (AST/symbol index built in-sandbox)** | A real symbol index beats grep for finding definitions across a large repo, at one tool call. | Permitted (P2) | 4–8 h | Engineering judgement; `run_command` already permits ad-hoc Python | **Moderate** | Costs tokens in the script output; the model may not use it well | Build it, then A/B on 30 tasks | Go if localization calls drop and resolution rises |
| **6** | **Strict scope discipline: implement the issue's most concrete instruction first, add secondary items only if budget remains** | Graded scope is narrower than gold scope (§7.6.3). Over-broad edits cost budget and risk regressions. | Permitted (P1) | 1 h | Verified on one instance; generalization untested | **Low–Moderate** | Under-fixing on tasks where the graded tests need several changes | Paired test on the rename/refactor slice | Go only if it wins ≥6 with no regressions |
| **7** | **Sub-agent (`agent_tool` + `skip_summarization`) for exploration** | Keeps `read_file` output out of the coder's context, which is compacted at 14,336 tokens. | Permitted (P6) | 4–6 h | ADK feature; literature on sub-agent context isolation is mixed | **Low–Moderate** | Adds latency and coordination failure modes; the 32k window may not be the binding constraint at all | Measure context length and resolution with and without | Go only if context overflow is actually a failure mode in your logs |
| **8** | **A single LoRA from self-collected successful trajectories** | Trajectory SFT improves protocol adherence and task format compliance. | Permitted (P4), **gated on §21.3** | 20–40 h | Mixed; see §13 | **Low** until the canary passes | Silent zeroing or KV collapse → a zero you do not understand | The canary, then a paired evaluation | Only after C1–C5 pass |
| **9** | **k-sample with self-written-test reranking** | Spends budget on diversity plus selection. | Permitted (P1, P2) | 8–12 h | The oracle-to-selected gap is the whole difficulty; self-written tests are weak (§15.2) | **Low** | Doubles token cost for a tiny gain; selection is near-random without a real signal | Measure oracle vs. selected at matched budget before believing it | Go only if selected ≫ random and ≈ oracle |
| **10** | **Best-of-n without selection** | — | — | — | — | **Rejected** | Wastes budget with no mechanism to capture the gain | — | **Do not do this.** The competition scores one patch. |

**What is deliberately absent from this list, and why.** Multi-agent debate; automated scaffold search against the dev set; self-play; RL. All are real research topics (§14, §13) and all are wrong *for this competition at this scale*: they cost budget you do not have, they need measurement resolution you cannot achieve on 60 tasks (§9.3), and several would require trusting a validation set that you will overfit within a dozen runs. If you want to study them, the paper track is the right venue, and the measurement work is already in your logs.

#### 21.4.2 The experiment sequence, and the stop rules that govern it

The ranked list is a *priority* order, not a schedule. This is the schedule, and — more importantly — the rules for when to stop, which matter more because the failure mode of this kind of project is not running out of ideas but running out of statistical validity.

**The experiment queue, in order.** Each entry is a single intervention, paired against the same baseline on the same task list.

| Seq | Experiment | Task list | Primary measure | Decision point |
|---|---|---|---|---|
| **E0** | Gold-patch control | 30 tasks | Resolution rate | **Must be 100%.** If not, fix the environment; nothing below is valid |
| **E0b** | No-patch control | Same 30 | Resolution rate | Must be 0%. If not, those tasks are not discriminating — drop them |
| **E1** | Baseline agent, no changes | Same 30 | Resolution rate + failure histogram | The number everything is compared against |
| **E2** | Intervention #2 (test-asymmetry rule) | Same 30, paired | 2×2 table, McNemar exact | §21.4 stop rule R-A |
| **E3** | Intervention #3 (budget caps), 3 values | Same 30, paired | Median + tail resolution | §21.4 stop rule R-B |
| **E4** | Intervention #6 (scope discipline) | Same 30, paired | 2×2 table | §21.4 stop rule R-A |
| **E5** | Intervention #4 (symbol-seeded localization) | Same 30, paired | Resolution + localization calls | §21.4 stop rule R-A |
| **E6** | Intervention #5 (static-analysis skill) | Same 30, paired | Resolution + tool calls | §21.4 stop rule R-A |
| **E7** | Cumulative best-configuration run | 40-task **frozen validation** | Resolution + regressions | Must show **zero regressions** |
| **E8** | LoRA branch, if gated open | Same 40, paired | Oracle vs. selected vs. submitted | §21.4 stop rule R-C |

**Stop rule R-A — the kill rule that protects the project.** After each experiment, stop and apply this in order:

```text
Did it win ≥6 tasks outright with 0 regressions?      → KEEP
Did it win ≥8 tasks with ≤2 regressions?              → KEEP, but re-run to confirm
Anything else (wins 1–5, or wins with ≥3 regressions) → KILL, permanently
```

**Five wins is a story, not a result** (§9.3). Kill without sentiment: the sunk cost of the implementation is zero compared to the cost of shipping a change that is noise, and a change that is noise still costs tokens, context, and failure modes at inference. **Recording the kill in the experiment log is as valuable as the keep** — it is what makes the counterevidence chapter (§19) writable and the write-up credible.

**Stop rule R-B — for sweeps.** Stop a sweep as soon as the curve turns. If budget caps of 3, 5 and 8 minutes give 5, 7 and 6 wins respectively, the answer is 5 and further points are waste. If all three are within one task of each other, **the parameter does not matter — pick the middle value, stop tuning it, and move on.** That last case is common and is a legitimate finding.

**Stop rule R-C — the infrastructure gate on Branch B.** Do not begin E8 unless the §21.3 canary passes C1–C5. If the canary fails, E8 is cancelled, not deferred, and Branch A continues. **There is no partial credit for a LoRA that is silently not being applied.**

**Stop rule R-D — the project-level freeze.** After the configuration is frozen (week 5, §21.6), **no further tuning of any kind.** Spend the remaining time on verification, rehearsal, and the paper. Every additional validation run is another adaptive-overfit step, and the selection bias from a dozen such steps exceeds the effects being chased (§9.4). This rule is the one people break, and breaking it is how a strong development score becomes a mediocre leaderboard result.

**Two rules about the experiment log, because a log containing only successes is worthless.** Write the hypothesis *before* the run. And write the failures, the abandoned experiments, and the interventions you killed — because "we tried X, it did not clear the bar, and here is the data" is a stronger claim than "we tried X, it worked," and it is the only kind of claim a reviewer can check.

### 21.5 The critical path

```text
WEEK 1  Environment + gold control (the gate everything depends on)
       │   measure decode rate, tool-call throughput, container setup time
       │   LoRA canary C1–C5  ──── fails ──> stay on Branch A permanently
       ▼
WEEK 2  Baseline on the frozen validation set. Failure histogram.
       │   Rank 1–3 interventions implemented. Paired evaluation of #2.
       ▼
WEEK 3  Paired evaluation of #3, #4, #5. Confirm or kill each on
       │   validation. Kill anything that wins <6 with regressions.
       ▼
WEEK 4  Assemble. First full dry run with timing.   ← paper-track draft opens
       │   [paper track: submit a stub early; earliest entry wins ties]
       ▼
WEEK 5+ Second full dry run. Robustness checks: seed variation, harness-bug
       re-verification, budget edge cases (a task that blows its limit).
       │   Lock agent.yaml. Freeze. Stop tuning.
       ▼
2026-11-12  Paper track deadline
       ▼
2026-11-25  Entry + team-merger deadline — accept the rules
       ▼
2026-12-02  Final submission (1/day limit; 2 final submissions)
```

**The week-5 freeze is not optional discipline, it is statistics.** Every additional validation run is another adaptive-overfit step, and at this sample size the selection bias from a dozen such steps exceeds the effect sizes you are chasing (§9.4). Freeze the configuration, then spend the remaining time on verification and rehearsal.

### 21.6 The compliance line — what is off-limits regardless of whether it would work

This competition has an air-gap, a private test set, and anti-tampering that resets test files. That is a deliberate design stance, and the rules reflect it. The line below is drawn to keep a legitimate competitor out of disqualification, not to be clever.

| Category | Verdict | Reasoning |
|---|---|---|
| Mining private evaluation labels | **Never** | Rules §3.4.b forbids using hand labels of validation or test data. Not a grey area. |
| Editing test files to force a pass | **Pointless and dangerous** | The harness resets them. Scores nothing, and attempting it looks like tampering. |
| Modifying `conftest.py`, `pytest.ini`, `pyproject.toml` and friends | **Pointless and dangerous** | Same reset path. Note the harness *itself* writes and commits these into the baseline — modifying them puts spurious diffs in your patch. |
| Circumventing the time, memory or tool budget | **Never** | Rules §3.8.d treats undermining the competition as disqualifiable. |
| Using an undisclosed external service at inference time | **Impossible** | The sandbox has `network_mode="none"`. |
| Undisclosed distillation in the winning artifact | **Never** | Winner obligations require reproducible, licence-clean code. |
| Privately sharing competition code with another team | **Never** | Rules §3.6.a. |
| **Front-loading effort on tasks you believe are public** | **Avoid** | See below. |
| Setting a generous per-task budget and letting the harness overrun 12 h | **Avoid** | It is a documented behaviour and not formally prohibited, but the organizer explicitly asked for a `max_time_minutes` failsafe and is fixing the behaviour. Build the failsafe. |
| Reading the public dev set, training on it, and shipping the result | **Permitted with a paper trail** | It is the provided training set. Keep a provenance record (§25.4) and say what you cannot rule out. |
| Shipping a large LoRA trained on external data | **Permitted if licence-clean** | Rules §2.6. Resolve teacher-model ToS yourself — that is a licence question, not a competition question. |

**On task ordering, specifically.** Whether the public-split tasks run first is an open, unanswered question (ambiguity A1). If it turned out that they did, front-loading would be a rational use of your budget. **This report recommends against pursuing it**, on two grounds that have nothing to do with whether it would work. First, it optimises an artefact of the evaluation's construction rather than the capability the competition claims to measure, and the rules reserve the right to deem behaviour as undermining the competition. Second — and this is the practical point — the public split is roughly half the set, so the strategy buys you at most the difference between solving the easier half quickly and the harder half slowly, while making your agent worse at the thing the hidden split is actually made of. It optimises the wrong distribution.

### 21.7 Budget allocation

**The 12 hours, allocated.** These are starting allocations to be replaced by your own measurements from §21.2, not prescriptions.

| Block | Share | Reasoning |
|---|---|---|
| Container setup and sandbox overhead | **must be measured, budget generously** | It is inside the 12 h and outside the per-task budget. This is the most commonly underestimated block. |
| Per-task agent time | The dominant block | ~5 minutes × 120 = 10 h, leaving ~2 h of headroom for setup and overrun. |
| Reserve | **≥45 min, unallocated** | A run that ends at 11:59 with no margin is a run that errors. |

**Spend inside a task, in priority order.** Given a measured budget of N tool calls, the intended shape is:

1. **Seed** (1–3 calls) — identify the target file or symbol. `get_status` is free; do it first.
2. **Localize** (3–8 calls) — `get_code_neighbors` / `get_code_subgraph` on the named symbols, or a targeted `grep`. Stop as soon as the edit site is identified.
3. **Read** (2–5 calls) — windowed `read_file`; the 150-line cap forces iteration, so read ranges, never whole files.
4. **Edit** (2–6 calls) — small, incremental `edit_file` payloads. Large payloads truncate the `<|tool_call>` tag and burn a whole turn.
5. **Verify** (2–5 calls) — targeted tests only. Never run the full suite; it will not fit.
6. **Submit** (1 call, free) — clean scratch files out of `/workspace` first, then `submit_patch()` as the final action.

**The stopping rule that matters most:** if you are at the tool-call cap with an uncommitted edit, **submit anyway.** An unsubmitted patch is captured only if the tree is dirty — and an agent that reverts everything on failure leaves a clean tree and scores zero by default. Never end a task with a clean working tree. This single rule is worth more than most prompt engineering.

### 21.8 Risk register

| # | Risk | Likelihood | Impact | Mitigation | Early warning |
|---|---|---|---|---|---|
| R1 | LoRA path broken on the scorer | **High** (unconfirmed at cutoff) | Catastrophic if Branch B is primary | Branch A as the primary track; §21.3 canary as a hard gate | C1 or C2 fails |
| R2 | Local environment is broken; measured progress is fake | **High** | Severe — invalidates all measurement | Gold-patch control at 100% before any other work | Gold < 100% |
| R3 | A promised harness fix is not actually deployed | **Moderate** | Moderate | Reproduce every behaviour yourself before relying on it | Your behaviour ≠ documented behaviour |
| R4 | Overfitting the validation set across many runs | **High** if unmanaged | Severe — the final score regresses | Development/validation/final split; freeze at week 5 | Validation stops improving but dev keeps rising |
| R5 | Budget overrun errors the whole run | **Moderate** | **Catastrophic** | `max_time_minutes` failsafe; reserve time | Run finishes > 11 h |
| R6 | Configuration drift between local and scored runs | **Moderate** | Severe | Pin harness, wheelhouse, and dataset versions; log all of them | Local score and LB diverge systematically |
| R7 | Scoring stack changes mid-competition | **Moderate** | Moderate–severe | Re-run the canary after each scoring-stack update | Leaderboard moves nobody caused |
| R8 | Deeper-than-expected model failure modes on the private-repo test set | **High** | Moderate | Over-weight repository-stratified analysis; avoid fastapi-specific tuning | Performance concentrated in one repository |
| R9 | Team or submission mechanics error (Save Version before Submit; rule acceptance) | **Low–Moderate** | Severe | §6.8 checklist; confirm the Entry Deadline acceptance | — |
| R10 | Paper-track writeup platform bug near the deadline | **Moderate** | Moderate (a separate $35k) | Submit a stub early | Save/submit 404s |

### 21.9 Submission and re-verification checklist

- [ ] Every rule in §6.8 re-verified against the live pages
- [ ] `submission.zip` under 3 GiB unpacked
- [ ] Exactly one root config (`agent.yaml`) at the archive root
- [ ] No `!include` path escapes the submission root; no symlinks
- [ ] Only permitted extensions present; no `.bin`, `.pt`, `.pth`
- [ ] Exactly one base model declared, and it is `gemma-4-31b-it-qat-w4a16-ct`
- [ ] `eval_config.yaml` sets `max_time_minutes` as a failsafe
- [ ] No adapter directory, *or* a canary-passed one
- [ ] Full end-to-end dry run completed with realistic timing
- [ ] `submission.parquet` produced with `id` and `prediction` columns
- [ ] Rules accepted before the 2026-11-25 Entry Deadline
- [ ] Save Version completed **before** Submit
- [ ] Winner-obligation obligations understood: training code, inference code, computational environment description, reproducibility link
- [ ] Provenance record complete for every training or generated artifact
- [ ] Paper-track stub submitted early

---
## 22. Conclusions, Unresolved Questions, and Watch List

### 22.1 The conclusions, in order of confidence

**Tier 1 — verified from primary sources or self-contained arithmetic. Treat as settled.**

1. **The competition is real, live, and tightly constrained.** One base model; LoRA-only adaptation; declarative YAML submissions; a 12-hour budget inclusive of setup; a resolution-rate metric; an air-gapped sandbox; test-file edits reset at verification. [V]
2. **It does not use SWE-bench.** The task set is organizer-built from real pull requests, with the hidden half drawn from private repositories. SWE-bench is methodological reference only — tuning against it tunes against the wrong distribution. [V]
3. **The resolution criterion is `FAIL_TO_PASS` all-pass *and* `PASS_TO_PASS` all-pass**, and the second half is a real cost: a broad patch that regresses anything scores identically to no patch. [V]
4. **The agent and the grader read different tests.** A correct fix can turn the visible suite red, and agent edits to test files are silently discarded. [V]
5. **Sixty tasks cannot see small differences.** One task is 1.67 points; a 12% score carries roughly ±8 points; you need ~6 outright wins with no regressions before a paired comparison is credible. [Self-contained arithmetic]
6. **The competition scores quantity 4, bounded above by quantity 3, bounded above by quantity 2.** One submitted patch, no selection with the answer key, and a 40-point oracle gap that is therefore mostly unreachable. [V + structural]
7. **The scaffold, not the model, is most of the artifact** — and the model is not yours to change. The verified ACI ablation is +7 points with weights held constant. [V]
8. **The budget binds before the model does.** ~6 minutes per task, ~14k effective context after compaction, 25–100 tool calls, one patch. [V + arithmetic]

**Tier 2 — well-supported but with a named gap. Act on these, and verify the specific claim before relying on it.**

9. **Start minimal.** Two independent verified results point the same way, and the mechanism (added complexity is a liability) is budget-preserving — so the constraint makes it *more* applicable here, not less. [V, direction only]
10. **A frozen-weights scaffold is the right primary strategy for most competitors**, and a LoRA is a gated parallel experiment, not the main line. [C — gated on §21.3, on compute, and on the transfer gap]
11. **The biggest free win available is `edit_file` payload format** — raw text over JSON — measured at 0% versus 62% failure in this harness. [R, single-source, trivially reproducible]
12. **Reproduce the harness before trusting it.** Five documented failure modes, several promised fixes, none confirmed; and local grading was observed anti-correlating with the leaderboard. [R]

**Tier 3 — hypotheses this report advances. Test them; do not assume them.**

13. **Encoding the test asymmetry as an explicit rule is high-leverage.** Mechanism verified on a real instance; effect size unmeasured. [H]
14. **Symbol-seeded graph navigation beats prose queries.** Resolver behaviour verified; the strategy's effect is untested. [H]
15. **Scope discipline — minimal graded change first — beats issue-completeness.** Verified on one instance; not knowable in general. [H]
16. **Depth beats breadth at this budget** because the available verifier is weak. Follows from §15.2 but has not been tested against a matched-budget alternative. [H]

### 22.2 The unresolved questions

| # | Question | Why it matters | What would resolve it |
|---:|---|---|---|
| **Q1** | Is the LoRA path functional on the scorer? | Determines whether Branch B exists at all | The §21.3 canary |
| **Q2** | What is the actual decode rate at TP=4 on L4 for this model? | Determines turns per task, and therefore the entire architecture | Measure it, day one (§21.2) |
| **Q3** | What is Gemma 4 31B's `hidden_size` / `num_kv_heads` / GQA ratio? | Determines KV-cache concurrency (§16.3) | Read the local `config.json` — one minute, once you have the model |
| **Q4** | Are the promised harness fixes deployed? | Changes several recommendations | Reproduce each yourself |
| **Q5** | Do the public and private tasks run in a known order? | Ambiguity A1; this report recommends against pursuing it either way | Ask the organizers |
| **Q6** | What do the private repositories look like? | Determines whether any public-set finding transfers | Cannot know. Use repository-stratified analysis as a proxy |
| **Q7** | Does any training method transfer to unseen repositories? | The field's largest genuine unknown (§12.4) | Hold out a repository. 4 clusters, terrible statistics, real signal on the sign |
| **Q8** | What is the four `eval_config.yaml` default when unset? | The scorer reportedly applies no limit if a field is absent | Run the scorer locally with fields omitted |
| **Q9** | What score constitutes a strong entry? | The whole calibration | Run the baseline and watch the leaderboard |
| **Q10** | Is the base model contaminated with the public repositories? | Interprets every number | Unknowable. Document the limitation |

### 22.3 The watch list

**Re-check these on a stated cadence, not reactively.**

| Cadence | Watch | Why | Action if changed |
|---|---|---|---|
| **Weekly** | Competition rules and the Data page | Rules get amended; the fact sheet ages | Re-run §25.6 and log the delta |
| **Weekly** | The discussion board | Fastest source of harness-behaviour intelligence | Reproduce any claim before acting |
| **Weekly** | The leaderboard | Reveals baselines and the current top | Re-read §8.4 before drawing any conclusion |
| **After any scoring-stack update** | The §21.3 canary | The scoring path is what changed | Re-run C1–C5 |
| **Before the final week** | Everything, once | §25.6 in full | Re-verify the submission checklist |
| **Continuous** | Your own frozen-validation score | The only number that is yours | If it stops moving while the dev set keeps rising, you are overfitting (§9.4) |

**The three dates that are not negotiable, from the verified timeline.**

| Date | What happens | Lead time from the evidence cutoff |
|---|---|---|
| **2026-11-12** | Paper-track deadline ($35,000, judged on 5 criteria, ties to earliest entry) | 41 days |
| **2026-11-25** | Entry and team-merger deadline; rules must be accepted | 54 days |
| **2026-12-02** | Final submission (1/day limit; 2 final submissions; 11:59 PM UTC) | 61 days |

**The paper track is the item most people forget, and it is worth $35,000 on a separate judging track.** The roster is weighted toward graph machine learning and software-engineering research, which means the *measurements* you are taking to compete — what actually breaks small-model SWE agents, and what the code-graph and embedding assets do and do not do — are the paper-grade material. **Submit a stub early**, both because the platform has a known writeup save/submit failure mode and because earliest entry wins ties.

### 22.4 If you read only one paragraph

The competition is real and tightly constrained: one 31B model, nine tools, a declarative YAML submission, six minutes per task, and one patch per task. The score is a proxy that rewards minimal faithful implementation of a human-written specification, not deep software engineering — because the grader tests a maintainer's fix, not the whole issue. At sixty tasks, nothing short of six outright wins with no regressions is a result, so plan for two experiments rather than ten. The scaffold is most of the artifact, the budget binds before the model does, and the single largest measured effect in the whole system is that `edit_file` payloads fail 62% of the time when JSON-wrapped and 0% of the time when raw. **Build the minimal thing, measure everything, verify the harness before you trust it, and never end a task with a clean working tree.**

---
## 23. Coverage and Claim-Evidence Traceability Matrices

### 23.1 Research-question coverage (RQ-01 … RQ-14)

| ID | Question | Authoritative chapter | Status | Note |
|---|---|---|---|---|
| RQ-01 | Named competition; what determines a valid, winning entry | **§6** + §25.6 | **Complete** | 20-row permission map, ambiguity list A1–A7, re-verification checklist |
| RQ-02 | What is SWE-bench and how does its ecosystem differ | **§7** | **Complete** | Schema verified against the reference implementation; variant taxonomy; validity problems |
| RQ-03 | What do scores and leaderboards actually establish | **§8** | **Complete** | Resolution semantics, denominators, pass@k, leaderboard hygiene, dated progression |
| RQ-04 | How can evaluation be made trustworthy | **§9** | **Complete** | Full statistical contract: Wilson intervals, unpaired MDE, McNemar tables, 9-check diagnostic suite |
| RQ-05 | Which models and checkpoints are usable and suitable | **§10** | **Complete with a stated gap** | Competition model verified; the comparative landscape is **not** — see §10.3 for why |
| RQ-06 | Which scaffold mechanisms help | **§11** | **Complete** | The best-evidenced chapter: ACI principles, ablations, edit formats, localization, context, orchestration |
| RQ-07 | Which data practices improve generalization | **§12** | **Complete** | Dataset analysis, three decontamination channels, the transfer gap, mixture design |
| RQ-08 | Which training methods have credible evidence | **§13** | **Complete with a stated gap** | Method ladder and compute feasibility are complete; published effect sizes are marked unverified |
| RQ-09 | Which self-improvement methods work, and how they fail | **§14** | **Complete** | Seven-mechanism taxonomy, intrinsic-vs-extrinsic, reward hacking, stopping/rollback |
| RQ-10 | How should test-time compute be spent | **§15** | **Complete** | The verified 15.9→56 anchor, the oracle-to-selected argument, selection ranking, the depth-over-breadth verdict |
| RQ-11 | What systems choices determine feasibility | **§16** | **Complete with a stated gap** | Serving config and L4 hardware verified; KV cache is a sensitivity analysis; throughput unknown |
| RQ-12 | What materially changed during 2025–2026 | **§17** | **Partial — disclosed** | The measurement reckoning is verified; the release timeline is largely not. Stated as a limitation, not concealed |
| RQ-13 | What do representative cases teach | **§18** | **Complete** | Five cases + a 22-row transfer matrix with copy/adapt/avoid verdicts |
| RQ-14 | What is the highest-value preparation plan | **§20, §21** | **Complete** | 14-day / 1-week / 4-week paths; branches, ranked interventions, stop rules, budget, critical path, risk register, checklist |

### 23.2 Verification-question matrix (VQ-01 … VQ-08)

| ID | Verification question | How this report answers it | Result |
|---|---|---|---|
| VQ-01 | Does each numeric claim match its source and protocol? | Every numeric claim carries an evidence tag; §9.3's arithmetic is shown in full so it can be recomputed; §8.1 is the audit worksheet | **Met**, with the explicit exception of the [U]-tagged literature figures, which are excluded from all load-bearing conclusions |
| VQ-02 | Are datasets, tracks, scaffolds, and training resources classified correctly? | §4.2 glossary; §7.2 variant taxonomy with a category column; §18.2 transfer matrix | **Met** |
| VQ-03 | Are permissions and prohibitions supported by official text? | §6.6 permission map P1–P20, each tied to a rule section; §19.6 red-team list; "do not equate silence with permission" applied throughout | **Met** |
| VQ-04 | Are causal claims supported by controlled comparisons? | §11.2 uses only ablation deltas; §9.4 forbids architecture decisions on development data; §14.6 explains why automated search cannot supply a controlled comparison at this n | **Met** |
| VQ-05 | Are gains robust to randomness, compute controls, and held-out evaluation? | §9.3 McNemar tables; §9.4 four-way split; §12.4 repository hold-out; §21.4.2 stop rules | **Met in method**. Whether any gain *is* robust is an empirical question the reader must run |
| VQ-06 | Are material contradictions and negative results represented? | §19.1 twelve-row contradiction ledger; §19.3 the strongest case against this report; §7.4 eight failure modes; §10.4 Calibration 3 (the 2.67% RAG row) | **Met** |
| VQ-07 | Are historical claims supported by cutoff-eligible evidence? | Evidence cutoff 2026-10-02, not advanced. §25.9 lists the three post-cutoff categories and states that none changes the historical conclusions | **Met** |
| VQ-08 | Can each recommendation be traced to evidence or a testable hypothesis? | §21.4 carries mechanism, permission, effort, evidence class, confidence, failure mode, and a cheap validation per row; §19.4 gives a falsification condition for every major claim | **Met** |

### 23.3 Synthesis-question matrix (SQ-01 … SQ-05)

| ID | Question | Answer | Where |
|---|---|---|---|
| SQ-01 | Which interventions offer the best evidence-to-effort ratio? | Raw-text `edit_file` payloads; the `max_time_minutes` failsafe; the test-asymmetry rule; budget caps; then symbol-seeded localization. Ranked with reasons in §21.4 | §21.4 |
| SQ-02 | How does the recommendation change under frozen weights, tight inference, or training-permitted scenarios? | Frozen + tight (Branch A) is the primary case. Training-permitted changes only §13 and adds the canary gate; it does not change the scaffold, localization, or budget recommendations, because those are bound by different constraints | §13.6, §21.1 |
| SQ-03 | What should a beginner learn and measure first? | §4.3's five facts, then day 4's gold-patch control, then day 7's failure histogram. Reading is not implementation; every day in §20.1 has a deliverable | §20.1 |
| SQ-04 | What would falsify the recommended architecture? | Ten falsification conditions with costs, from "a richer scaffold wins 6 paired tasks" to "an adapter wins 6 paired tasks after the canary" | §19.4 |
| SQ-05 | Which uncertainties should be resolved before expensive experiments? | The five in §3.5, all resolvable in the first day for under ten hours total. The LoRA canary is the only one that gates a branch rather than informing a parameter | §3.5, §21.3 |

### 23.4 Claim-evidence traceability — the load-bearing claims

The claims this report's conclusions actually rest on. Everything not in this table is either background or explicitly marked as unverified.

| # | Claim | Evidence class | Source | Where verified |
|---:|---|---|---|---|
| 1 | The competition mandates one base model, LoRA-only adaptation, declarative YAML, a 12 h budget, and a resolution-rate metric | **[V]** | Official Overview + Rules + `HARNESS_README.md` | §6.1–§6.5 |
| 2 | The task set is organizer-built; the hidden half comes from private repositories; it is **not** SWE-bench | **[V]** | Official Data page; `tasks.jsonl` | §6.1, §12.1 |
| 3 | Resolution requires all `FAIL_TO_PASS` and all `PASS_TO_PASS` to pass | **[V]** | Reference implementation; `HARNESS_README.md` | §7.1 |
| 4 | Test files touched by the agent patch are reset before the hidden test patch is applied | **[V]** | `HARNESS_README.md` anti-tampering section | §6.4, §7.6.2 |
| 5 | 4 GiB RAM, 2 vCPU, `network_mode="none"`, 300 s command timeout, 5,000-char stdout cap | **[V]** | `HARNESS_README.md` | §6.4, §16.1 |
| 6 | `max_model_len=32768`; compaction at `token_threshold=14336` | **[V]** | `HARNESS_README.md` | §16.1, §16.3 |
| 7 | Per-task budget ≈ 6 min = 720 ÷ ~120 tasks; setup inside the 12 h, outside the per-task budget | **[D]** — arithmetic from [V] inputs | §9.2, §16.4 | §6.4, §16.4 |
| 8 | On 60 tasks, 1 task = 1.67 points; a 12% score has a Wilson 95% CI of ≈ 6–23%; paired detection needs ~6 outright wins | **[D]** — self-contained arithmetic | Wilson, McNemar exact | §9.3 |
| 9 | The competition scores quantity 4, bounded by 3, bounded by 2; one submitted patch, no answer-key selection | **[V]** + structural | `submit_patch` semantics | §9.5, §15.2 |
| 10 | SWE-agent + GPT-4 Turbo: 18.00% Lite / 12.47% Full; shell-only 11.00%; RAG 2.67%; HumanEvalFix 87.7% | **[V]** | SWE-agent paper, arXiv:2405.15793 | §8.1, §10.3, §11.2 |
| 11 | Ablation deltas: summarized search +6%, linting guardrails +3%, last-5-obs truncation +3% | **[V]** | same | §11.2, Case A |
| 12 | 93% of resolved instances submit before exhausting budget; failures cost more | **[V]** | same | §14.7 |
| 13 | mini-SWE-agent: 65% on SWE-bench Verified in ~100 lines | **[V]** | SWE-agent repository, 2024-07-24 | §10.3, §11.3, Case B |
| 14 | Plain-text edit formats outperform function-call formats | **[V]** | Aider benchmark documentation | §11.4 |
| 15 | DeepSeek-Coder-V2-Instruct: 15.9% → 56% on SWE-bench Lite, 1 → 250 samples (oracle) | **[V]** | Brown et al., arXiv:2407.21787 | §8.3, §15.1, Case C |
| 16 | L4: 24 GB GDDR6, 300 GB/s, PCIe Gen4 x16, 485 INT8 TOPS, 72 W; no listed INT4 support | **[V]** | NVIDIA L4 product page | §16.2 |
| 17 | The 12.5% attention-head ratio governs KV cache; at r=1, 32,768 tokens ≈ 31.5 GB per sequence | **[D]** — derivation with a disclosed unknown | §16.3 | §16.3 |
| 18 | SWE-bench: 2,294 instances / 12 repos; Verified 500; Lite 323; Multimodal 612; Multilingual 300 | **[V]** for the structure; sizes partially [U] | SWE-bench repo, `swebench.com` | §7.2 |
| 19 | Automated resolution overstates human-acceptability; benchmark scores do not predict deployment | **[V]** | Epoch AI 2025-06-13; METR | §7.4, §17.1 |
| 20 | `edit_file`: 62% failure single-JSON, 22% double-JSON, **0% raw text** | **[R]** — single-source, unreproduced | Prior workspace measurement | §11.4, Case E |
| 21 | `search_similar_code`: 6/6 calls >100k chars; near-neighbour similarity >0.99; resolver matches names not prose | **[R]** + [V] for resolver behaviour | Workspace + `HARNESS_README` §6.3 | §11.5, Case E |
| 22 | LoRA: KV collapse 46,048 → 7,600 tokens; silent adapter zeroing | **[R]** — single-source | Prior workspace measurement | §13.4, §21.3, Case E |
| 23 | Local grading anti-correlated with the leaderboard; local infra was broken | **[R]** | Workspace sweep; host confirmation | §9.7, §19.1 C5, Case E |
| 24 | Pretraining contamination of the four public repos cannot be ruled out | **[D]** from an undisclosed cutoff | — | §12.3, §17.6 |
| 25 | No verified evidence that any training method transfers to unseen repositories | **[U]** — an absence, recorded as such | — | §12.4, §19.1 C7 |

### 23.5 Score comparability matrix

Which published numbers may be compared with which. **"Comparable" means: same denominator, same metric definition, same attempts convention, same selection method.** A cell is comparable only if every one of those four matches.

| Pair | Comparable? | Why not / why |
|---|---|---|
| SWE-bench **Verified** vs **Verified** | **Yes**, if the harness, scaffold, budget, and attempts all match | Same denominator (500). Everything else still must match |
| SWE-bench **Verified** vs **Lite** | **No** | Different denominators (500 vs 323) and different curation. §9.2: one task is 0.2 vs 0.31 points |
| SWE-bench **Full** vs **Verified** | **No** | 2,294 vs 500, and Verified is human-filtered. §7.2: "Verified" is a task-*quality* claim, not a difficulty ranking |
| SWE-bench **Full** vs **Multilingual** | **No** | Different language distribution; transfer is a hypothesis |
| A **pass@1** score vs a **pass@8 oracle** score | **No** | Different quantities (1 vs 2 in §9.5). The 15.9→56 gap is entirely this difference |
| A **pass@8 selected** score vs a **pass@8 oracle** score | **No** | Selection method must be described; without it, assume oracle |
| SWE-agent 18.00% (Lite) vs this competition's ~6–13% baseline | **No** | Different dataset, different model, different budget, different scaffold, different metric implementation. Useful only as an order-of-magnitude sanity check (§10.4) |
| Any competition leaderboard row vs another | **Conditionally** | Same tasks and metric, so *structurally* comparable — but a live board is a selected maximum (§8.4). Trust the lower rows more |
| A **development** score vs a **frozen validation** score | **No** | The development score is a diagnostic, not a result. §9.4 |
| Gold-patch control vs any agent score | **No — and it must not be** | Gold is 100% by construction. It validates the environment and nothing else |

### 23.6 Permission and transfer matrix — pointer and summary

The full permission map is at **§6.6** (20 rows, P1–P20, each tied to a rule section). The full technique-transfer matrix is at **§18.2** (22 rows, Copy / Adapt / Avoid / Reject). Both are cross-referenced from §21.4, where every ranked intervention carries its permission tag.

| Permission class | Count | Meaning | Where it binds |
|---|---:|---|---|
| **Verified permitted** | P1–P20 in §6.6 | Supported by official text | The scaffold, the prompt, the tools, LoRA, external data under Rules §2.6, the `eval_config.yaml` fields |
| **Verified prohibited** | §19.6, §21.7 | Explicitly forbidden | Hand-labelling test data; budget circumvention; private team code sharing; sandbox escape; test editing |
| **Ambiguous** | A1–A7 in §6.7 | Official wording admits competing readings | Task ordering; the scorer's default when a field is unset; the dirty-tree capture; teacher-model ToS |
| **Unverified** | §25.7, §17 | Relevant information was not retrievable | Model-landscape scores; the harness-fix status; Gemma 4 architecture details |
| **Not applicable** | — | Outside the task or submission format | Best-of-k without selection; cross-task memory; custom tools beyond the nine |

**The governing rule, restated because it is the one most often violated:** *do not equate silence with permission.* Where the rules are quiet, this report tags the item **Ambiguous** and recommends asking the organizer or taking the conservative path — never assuming permission.

### 23.7 Experiment backlog — the full queue

The detailed queue with decision points is at **§21.4.2**. Consolidated:

| ID | Experiment | Cost | Gate | Stop rule |
|---|---|---|---|---|
| E0 | Gold-patch control, 30 tasks | 2 h | **Must be 100%** | If <100%, stop and fix the environment |
| E0b | No-patch control, same tasks | 0.5 h | Must be 0% | Drop non-discriminating tasks |
| E1 | Baseline agent + failure histogram | 1 day | — | The number everything compares against |
| E2 | Test-asymmetry rule (§7.6) | 0.5 day | E1 | R-A: ≥6 wins, 0 regressions |
| E3 | Budget caps, 3 values | 1 day | E1 | R-B: stop when the curve turns; if flat, the parameter does not matter |
| E4 | Scope discipline (§7.6.3) | 0.5 day | E1 | R-A |
| E5 | Symbol-seeded localization | 1 day | E1 | R-A |
| E6 | Static-analysis skill | 1–2 days | E1 | R-A |
| E7 | Cumulative best config on the 40-task frozen validation | 1 day | E2–E6 | Zero regressions required |
| E8 | LoRA branch | 2–3 days | **Canary C1–C5** | R-C: cancelled, not deferred, if the canary fails |
| E9 | Self-test verifier quality (passes agent tests → passes hidden?) | 0.5 day | E1 | Determines whether k-sampling is viable at all |
| E10 | Matched-budget depth vs. breadth | 1 day | E1 | Tests §15.7's central claim |

**Two of these are not really experiments** — E0 and E0b are environment validation, and skipping them invalidates everything above. The other eight are ordered by evidence-to-effort, and the stop rules exist to protect the project from its own enthusiasm.

### 23.8 Risk register — pointer

The full ten-row register with likelihood, impact, mitigation, and early-warning signals is at **§21.8**. The top three:

| ID | Risk | Impact | Mitigation |
|---|---|---|---|
| R1 | The LoRA path is broken on the scorer | Catastrophic if Branch B is primary | Branch A as the primary track; the canary as a hard gate |
| R2 | The local environment is broken, so all measurement is fake | Severe | The gold-patch control at 100% before any other work |
| R5 | A 12 h overrun errors the entire run | **Catastrophic and total** | `max_time_minutes` failsafe; reserve time; per-task caps |

---


---
## 24. Grouped Bibliography

**Reading this section.** Sources are grouped by the role they played. **Retrieved** means fetched directly in this session and read. **Not retrieved** means identified but inaccessible (HTTP 401/404, rate-limiting, or an exhausted search budget) — these are listed so a reader can find them, and **no claim in this report rests on any of them.**

### A. Primary competition sources (all retrieved; the strongest evidence base in this report)

| Source | Access | Role |
|---|---|---|
| Kaggle — Gemma 4 Developer Agent Competition, **Overview** | Local snapshot 2026-09-29, read 2026-10-02 | Identity, metric, model, submission format, timeline, prizes, tools, participation |
| Kaggle — **Rules** | Local snapshot, read 2026-10-02 | Team and submission limits, external data, winner obligations, eligibility, prohibitions |
| Kaggle — **Data** | Local snapshot, read 2026-10-02 | Schema, 129 tasks, repository distribution, graphs, embeddings, wheels, curation pipeline |
| `HARNESS_README.md` (organizer-authored, ships in the data package) | Read 2026-10-02 | **The authoritative technical reference.** Architecture, tools, budgets, verification, resolution criterion, anti-tampering, gotchas |
| Kaggle — **Getting Started** notebook | Local snapshot, read 2026-10-02 | Environment setup, wheelhouse, vLLM startup, code-graph usage |
| `tasks.jsonl` (129 public tasks) | Read 2026-10-02 | Per-task fields; gold and test patches; the `httpx_3672` analysis in §7.6 |
| Prior workspace sweep — competition discussion board, 22 of 22 visible threads | Compiled 2026-09-30 | [R] Baseline figures, harness failure modes, LoRA observations, leaderboard size |
| Prior workspace reproduction — `httpx_3672` | Compiled 2026-09-30 | [R] Four verified traps with a reproduction appendix |

### B. Benchmark and evaluation method (retrieved)

| Source | Access | What it supplied |
|---|---|---|
| SWE-bench repository — instance schema and grading logic | 2026-10-02 | Field definitions; the `FAIL_TO_PASS` ∧ `PASS_TO_PASS` resolution rule; variant sizes |
| `swebench.com` | 2026-10-02 | Confirmed track list: Full, Verified, Lite, Multimodal, Multilingual (leaderboard rows did not render) |
| **Epoch AI** — "What skills does SWE-bench Verified actually evaluate?" | 2026-10-02 | Primary evidence for proxy validity (§7.4, §17.1) |
| **METR** — maintainer merge rates and time horizons | 2026-10-02 | Primary evidence that benchmark scores do not predict deployment |

### C. Scaffolds, interfaces, and agent mechanisms (retrieved)

| Source | Access | What it supplied |
|---|---|---|
| **SWE-agent paper**, arXiv:2405.15793 | 2026-10-02 | ACI principles; the full ablation table; the 18.00%/12.47% and 11.00%/2.67% results; HumanEvalFix 87.7%; the 93%-self-terminate finding |
| **SWE-agent repository** (`princeton-nlp/SWE-agent`) and `swe-agent.com/latest` | 2026-10-02 | mini-SWE-agent's 65% Verified in ~100 lines |
| **Aider** benchmark documentation (`aider.chat/docs/benchmarks.html`) | 2026-10-02 | Edit-format comparison; plain-text over function-call |
| **Google Gemma documentation** (`ai.google.dev/gemma/docs`) | 2026-10-02 | Gemma 4 family; modalities; licence |
| **HuggingFace model card** — `google/gemma-4-31b-it-qat-w4a16-ct` | 2026-10-02 | W4A16 / Compressed Tensors; vLLM optimisation; native context; parameter count |

### D. Inference-time compute (retrieved)

| Source | Access | What it supplied |
|---|---|---|
| **Brown et al., "Large Language Monkeys: Scaling Inference Compute with Repeated Sampling"**, arXiv:2407.21787 | 2026-10-02 | The one verified headroom measurement: 15.9% → 56% on SWE-bench Lite, 1 → 250 samples. The basis for §15 |

### E. Systems and infrastructure (retrieved)

| Source | Access | What it supplied |
|---|---|---|
| **NVIDIA L4 product page** | 2026-10-02 | Full specifications: 24 GB GDDR6, 300 GB/s, PCIe Gen4 x16, FP32/BF16/INT8 throughput, 72 W, and the *absence* of listed INT4 support |
| **vLLM blog** | 2026-10-02 | Throughput comparisons, multi-LoRA serving, quantization speedups, speculative decoding, decode context parallelism. Used chiefly to establish which advances are **unavailable** to a competitor (§17.7) |

### F. Identified but **not** retrieved — listed for the reader, relied on by nothing

| Source | Why it matters | Status |
|---|---|---|
| OpenAI — "why we no longer evaluate SWE-bench Verified" | Widely discussed; the announced deprecation of Verified as a frontier measure | **HTTP 403.** No claim rests on it (§17.1, §25.7 item 8) |
| R2E / R2E-Gym (RL for SWE) | The strongest published claim that RLVR ≫ SFT *only with executable environments* — the argument against RL here | Thesis widely reported; **numbers unverified** (§13.3) |
| SWE-smith, SWE-Gym, Nemotron-CORTEXA, Magicoder | Training-corpus landscape and scales | **Not retrieved.** All such figures marked [U] (§12.5) |
| Agentless | The direct-localization claim | **404 / wrong paper on every attempt** (§11.5) |
| OpenHands / OpenDevin | A major open scaffold | **404 / auth error** |
| QLoRA (Dettmers et al.) | The nearest reference point for LoRA on quantized weights | **Not retrieved**; and it covers PTQ, not QAT (§13.4) |
| Huang et al., "Large Language Models Cannot Self-Correct Reasoning Yet" | The negative result governing §14.2 | Title and finding widely reported; **arXiv page not retrievable** |
| Self-RAG, MetaGPT, SPIN, STaR, DSPy, MIPROv2, ADAS | Self-improvement and automated scaffold search | Mostly not retrieved; used only for structural reasoning, never for numbers |
| Qwen3-Coder, Devstral, GLM-4.5/4.6, Kimi K2, DeepSeek-V3.x | The competitive model landscape | **HTTP 401 / not retrieved.** The table at §10.3 is intentionally left sparse because of this |
| SWE-bench Pro, SWE-bench-Live, SWE-rebench, Terminal-Bench, Multi-SWE-bench | The 2025–2026 benchmark wave | Not retrieved; named in §17.2 as leads, not as facts |
| Gemma 4 Terms of Use | Whether any supplementary terms affect competition eligibility | **Not fetched.** Action item in §10.2 |

### G. Statistical methods

| Method | Used for | Section |
|---|---|---|
| Wilson score interval | Confidence intervals on a proportion at small n; chosen over the normal approximation, which under-covers here | §9.3 |
| Clopper-Pearson exact interval | Conservative alternative for very small n | §9.3 (named as the appropriate alternative) |
| McNemar's exact test | Paired binary comparison — the core instrument, because it looks only at discordant tasks | §9.3 step 3 |
| Paired bootstrap | Confidence intervals on paired differences where McNemar is underpowered | §9.3 |
| Cluster-robust / cluster bootstrap | Repository clustering; and the finding that 4 clusters is too few for it to be informative | §9.3 step 4 |
| Minimum detectable effect | Unpaired: ≈16 points at n=60. Paired: 6 outright wins | §9.3 steps 2–3 |
| Selection-bias correction reasoning | Why a maximum over many configurations is not a result | §9.4, §14.6 |

### H. Citation metadata

The BibTeX-ready block for the principal work is at **§25.8**. The entries above with dates and venues should be re-verified against their linked sources before any academic submission — this is a fast-moving literature, and several items here were retrieved from moving pages.
---

## 25. Appendices

### 25.1 Score-reading worksheet

Use this for every published score you encounter — including your own. An unfilled cell is a reason not to believe the number.

| Field | Recorded value |
|---|---|
| System and model checkpoint | |
| Benchmark and version (which split, which commit) | |
| Split and **denominator** (the number, not the percentage) | |
| Harness and version | |
| Scaffold and version | |
| Metric as defined by the harness | |
| **Attempts convention** (1 trajectory, or k samples?) | |
| **Candidate selection method** (none / oracle / reranked / verified) | |
| **Which of the four quantities** (§9.5): single-trajectory, oracle, selected, or submitted | |
| Tokens, tool calls, wall-clock, dollar cost | |
| Training-data disclosure (what, how much, decontaminated?) | |
| Verification or replication status | |
| Source URL and publication date | |
| Access date (for mutable pages) | |
| **What the score establishes** | |
| **What the score does not establish** | |

### 25.2 Experiment log schema

```text
experiment_id:
hypothesis:                      # one sentence, falsifiable
baseline:                       # experiment_id this is compared against
single_intervention:            # exactly one thing changed
model_and_checkpoint:
scaffold_commit:                # git SHA
harness_commit:                 # git SHA
dataset_version:                # tasks.jsonl hash
task_ids:                       # explicit list, not "the dev set"
seed_or_repetition:
budget:                         # tool_calls, turns, minutes, tokens — matched to baseline
permission_status:              # verified permitted / ambiguous / unverified
task_level_outcomes:            # the 2x2: both / baseline-only / candidate-only / neither
selected_success:               # numerator / denominator
oracle_success_if_legitimately_measurable:
infrastructure_failures:        # counted separately, never as agent failures
tokens_calls_latency_cost:
regressions:                    # tasks the candidate broke
uncertainty_method:             # Wilson / McNemar exact / paired bootstrap + the interval
development_or_confirmatory:    # <-- the field that keeps you honest
decision:                       # keep / discard / inconclusive
next_action:
```

### 25.3 Failure taxonomy

Starting categories, not diagnoses. Attribution must be earned from evidence.

| Failure class | Evidence to collect | Candidate response |
|---|---|---|
| **Environment / harness** | Build logs, gold-patch control, import errors, exit 137 (OOM) | Fix infrastructure before attributing anything to the model |
| **Submission interface** | `git status` at exit, whether `submit_patch()` fired, `patch_size` | Never end a task with a clean tree; call `submit_patch()` last |
| **Patch formatting** | `git apply --check` under the 4-pass fallback | Edit tracked files; avoid binary, mode and symlink changes |
| **Localization** | Which files were read vs. which were edited | Test retrieval, graph-tool and search-first changes |
| **Task understanding** | The agent's stated reading of the issue vs. the gold patch | Improve the instruction and spec artifacts |
| **Edit generation** | Diff, syntax/type errors, truncation mid-tool-call | Shrink payloads; tune `thinking_budget` vs. `max_output_tokens` |
| **Verification** | Tests run, assumptions stated, false approvals | Strengthen checks; calibrate the verifier |
| **Context / budget exhaustion** | Truncation events, loops, timeouts, `first_correct_commit` late in the log | Improve context policy, stopping rules, and budget allocation |
| **Candidate selection** | Oracle vs. selected outcomes | Improve reranking or the self-test signal |
| **Regression** | PASS_TO_PASS failures after the patch | Narrow the edit; re-run the adjacent suite |
| **Correct-fix revert** | Agent "fixes" a failure its own change caused | Encode the visible-vs-graded test asymmetry as an explicit rule (§7.6) |
| **Over-broad scope** | Edited files far outside the issue's blast radius | Add a scope gate before submitting |

### 25.4 Data card and provenance template

Required for any corpus you build — training trajectories, LoRA datasets, or generated skills.

```text
1. Source and collection rights        (where did each item come from; licence)
2. Repository and time distribution    (which repos, which date range)
3. Task construction                   (how was the instance derived)
4. Trajectory construction             (who acted; which model; which scaffold)
5. Tool and model provenance           (exact model ids, tool versions, prompts)
6. Quality filters                     (what was dropped and why, with counts)
7. Failure / negative-trace treatment  (are failures kept, and in what form)
8. Deduplication                       (method, threshold, before/after counts)
9. Decontamination                     (against which benchmarks, how, hit count)
10. Licence and model-use restrictions (including any teacher-model ToS)
11. Train/dev/validation separation    (by repository AND by time, not random)
12. Known limitations
13. Reproduction artifacts             (where the code and the log live)
```

Item 9 deserves emphasis for this competition specifically. Your base model's **pretraining contamination against the public development repositories cannot be ruled out** — the model's pretraining cutoff relative to these task dates is not documented, and the four public repositories are among the most heavily represented open-source Python projects in modern corpora. You cannot fix this. What you *can* do is (a) not train on anything that resembles the hidden test set, (b) keep the provenance record, and (c) say so plainly in your write-up rather than claiming a clean bill of health you cannot support.

### 25.5 Agent configuration skeleton

The minimum viable submission shape, annotated. This is a *shape*, not a recommended design — the recommendations are in §21.

```yaml
# agent.yaml  (must be at the archive root)
name: repo_repair_agent
model: gemma-4-31b-it-qat-w4a16-ct      # the ONLY permitted base model
description: Repairs real issues in Python repositories.
instruction: !include prompts/system.md  # {problem_description} and {hints} are injected
                                            # from session.state by the harness

# Optional: PEFT LoRA. Directory adapters/<name>/ must contain
# adapter_config.json + adapter_model.safetensors
# adapter: main_lora

tools:
  - run_command
  - read_file
  - edit_file
  - write_file
  - get_status
  - submit_patch
  - get_code_neighbors
  - search_similar_code
  - get_code_subgraph

# Optional: keep exploration output out of the coder's context
# sub_agents:
#   - config_path: sub_agents/code_analyzer.yaml
# tools entry:
#   - agent_tool: {config_path: sub_agents/code_analyzer.yaml, skip_summarization: true}

skills:
  - skills/repo_navigation

generate_content_config:
  temperature: 0.2
  top_p: 0.95
  max_output_tokens: 16384
  # When serving via vLLM, configure thinking this way, NOT via thinking_level:
  thinking_config:
    thinking_budget: 4096
    include_thoughts: true
```

```yaml
# eval_config.yaml  (optional; the scorer reads exactly these four fields)
evaluation:
  max_time_minutes: 5        # the failsafe against a 12 h overrun that errors the run
  max_tool_calls: 25
  max_turns: 40
  timeout_seconds: 120       # per-command; default is 300
```

```text
submission/
├── agent.yaml                        # REQUIRED, exactly one root config
├── eval_config.yaml                  # optional
├── configs/sampling.yaml             # optional, via !include
├── prompts/system.md                 # optional, via !include
├── sub_agents/*.yaml                 # optional
├── adapters/<name>/                  # optional LoRA; .safetensors ONLY
│   ├── adapter_config.json
│   └── adapter_model.safetensors
└── skills/<name>/
    ├── SKILL.md                      # YAML frontmatter with: name: <skill-name>
    ├── scripts/                      # Python/bash, run via run_skill_script
    └── resources/                    # markdown, read via load_skill_resource
```

### 25.6 Rules re-verification checklist

Run before acting on Chapter 21, and again in the final week. Full version at §6.8.

- [ ] Competition open; deadlines unchanged
- [ ] Rules re-read; organizer amendments logged
- [ ] Model + adaptation permissions unchanged
- [ ] External data + teacher permissions unchanged
- [ ] Tool, network, API restrictions unchanged
- [ ] Runtime and resource limits unchanged — *especially* the 12 h budget
- [ ] Artifact format and the Save-Version-then-Submit ordering
- [ ] Licensing and eligibility
- [ ] Ambiguities A1–A7 (§6.7) — any now answered?
- [ ] Every promised harness fix reproduced **by you**, not by a forum post
- [ ] Deltas recorded and any affected strategy revalidated

### 25.7 Search and access log

| # | Target | Method | Outcome |
|---|---|---|---|
| 1 | Kaggle competition Overview | Local snapshot (2026-09-29), read 2026-10-02 | Complete. Identity, task, metric, model, submission format, timeline, prizes, tools. |
| 2 | Kaggle competition Rules | Local snapshot (2026-09-29), read 2026-10-02 | Complete. Team/submission limits, external data, winner obligations, eligibility, prohibitions. |
| 3 | Kaggle competition Data | Local snapshot (2026-09-29), read 2026-10-02 | Complete. Schema, 129 tasks, 4 repos, graphs, embeddings, wheels, curation pipeline. |
| 4 | `HARNESS_README.md` (organizer-authored) | Read 2026-10-02 | Complete. The authoritative technical reference: architecture, tools, budgets, verification, gotchas. |
| 5 | Kaggle Getting Started notebook | Local snapshot, read 2026-10-02 | Partial. Environment setup, wheelhouse, vLLM startup, code-graph usage. |
| 6 | Live Kaggle leaderboard | WebFetch 2026-10-02 | **Failed** — page is JavaScript-rendered; no data returned. Leaderboard figures in this report come from the 2026-09-29 page snapshot and from community reports, and are labelled accordingly. |
| 7 | Competition discussion board | Workspace sweep compiled 2026-09-30 (22 of 22 visible threads) | Complete, with the caveat that it is prior-workspace research, re-read here as an unverified input. |
| 8 | `openai.com` — "why we no longer evaluate SWE-bench Verified" | WebFetch 2026-10-02 | **Failed** — HTTP 403. Cited only as a pointer; no claim in this report rests on its contents. |
| 9 | METR — maintainer merge rates | WebFetch 2026-10-02 | **Retrieved.** Primary evidence for §4.3 fact 2. |
| 10 | Epoch AI — what skills SWE-bench Verified evaluates | WebFetch 2026-10-02 | **Retrieved.** 2025-06-13, Brand & Denain. |
| 11 | `swebench.com` | WebFetch 2026-10-02 | Partial. Track list confirmed (Verified, Multimodal, Multilingual, Lite, Full; Bash filter). Leaderboard rows not rendered in the fetched content. |
| 12 | External literature | Six parallel workstreams | **Constraint encountered:** the session's WebSearch budget (200 calls) was exhausted by the parallel workstreams before all secondary checks could be run. WebFetch remained available. Treated as an access limitation, not as absence of evidence. |

### 25.8 Academic citation metadata (optional block)

For readers who want to build a bibliography, the primary works this report leans on, in a form most reference managers will accept. Dates and venues should be re-verified against the linked source before submission; a few are fast-moving pages.

```bibtex
@inproceedings{jimenez2024swebench,
  title     = {{SWE-bench}: Can Language Models Resolve Real-World GitHub Issues?},
  author    = {Jimenez, Carlos E. and Yang, John and Wettig, Alex and ...},
  booktitle = {International Conference on Learning Representations (ICLR)},
  year      = {2024},
  url       = {https://www.swebench.com/}
}
```

The remaining entries (the benchmark-audit papers, the training and RL papers, the scaffold papers, and the 2025–2026 model releases) are listed with full URLs in the grouped bibliography at §24, which is the authoritative source list for this report.

### 25.9 Post-cutoff operational note

The evidence cutoff is **2026-10-02, inclusive**, and it was not advanced. Everything above reflects the state of the world as of that date.

Three categories of thing can change *after* the cutoff and are therefore **not** part of the historical evidence base. They are recorded here so that a reader acting later knows what to re-check, rather than so that they can be treated as findings:

1. **Leaderboard movement.** The competition is live with 2,004 submissions against 829 teams at the 2026-09-29 snapshot and a final deadline of 2026-12-02. Scores will move. Nothing in this report should be read as a current ranking.
2. **Harness fixes.** Several organizer-stated fixes were promised but unconfirmed at the cutoff (§19.2). Deployment after the cutoff is plausible and would change the behaviour described in §6.5 and §7.6.
3. **The announced deprecation of SWE-bench Verified as a frontier measure.** Widely reported in the research window. This report does not rely on the details, and states only the independently verifiable Epoch AI and METR findings.

**None of these post-cutoff items changes the historical conclusions.** They change only what you should re-verify before acting.

---

## 26. Postscript — the seven things worth remembering

If the rest of this report is forgotten, keep these.

1. **The competition is real, live, and rules-constrained.** One base model, LoRA-only adaptation, declarative YAML submissions, a 12-hour wall clock, and a resolution rate. Everything else follows from those five facts.
2. **It does not use SWE-bench.** It uses a private, organizer-built task set on private repositories. SWE-bench teaches you the *method*; it does not tell you the *test set*.
3. **The score is a proxy.** Roughly half of PRs that passed a comparable benchmark's automated grader would not have been merged by maintainers. Optimise for "the hidden tests go green" without pretending that means the fix is right.
4. **Sixty tasks cannot see small differences.** You need six or more outright wins to believe a change. Design experiments around that, not around the desire to test many ideas.
5. **The agent and the grader read different tests.** A correct fix can turn the visible suite red. Encoding that asymmetry is probably worth more points than any amount of prompt polish.
6. **The budget binds before the model does.** Six minutes per task, inclusive of setup, on a 32k-context model on four PCIe-attached L4s. Stopping policy, budget allocation, and localization efficiency are the levers; cleverness is not.
7. **Verify the harness, do not trust it.** The scoring stack broke in five documented ways during its first week. Reproduce every behaviour you intend to rely on, with your own runs, before you build a strategy on top of it.
