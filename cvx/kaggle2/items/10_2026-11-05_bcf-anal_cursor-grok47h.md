# COMBINED MARKDOWN - combine

_Generated 2026-11-05 18:01:40 | 4 files | folder: D:\stuff\docs\taylor_fv\github\rayrite.github.io\cvx\kaggle2\items\combine_

## Contents

1. 00_README-cursor-grok47h.md
2. 01_Research_Report.md
3. 02_BCF_v1_Formal_Specification.md
4. 03_Paper_Decision_and_Brain_Plan.md

---

<!-- ====================================================================== -->
<!-- FILE: 00_README-cursor-grok47h.md -->
<!-- ====================================================================== -->

# BCF formalization and paper decision

*Date: 2026-11-05. Audience: the author of the Batonic Coding Framework, preparing a first whitepaper for the Gemma 4 Developer Agent paper track.*

This folder answers three questions: whether the constitution is a coherent, testable coding framework; whether that framework is a good paper for the 12 November 2026 Kaggle paper track; and how to build a real agent that can ground the framework in results.

| File | What it is |
|---|---|
| `01_Research_Report.md` | The sourced briefing. Rubric, deadlines, prior art, harness limits, and the open disagreements. |
| `02_BCF_v1_Formal_Specification.md` | The constitution turned into state, operators, a progress order, and a log another process can resume. |
| `03_Paper_Decision_and_Brain_Plan.md` | The decision, the one claim worth submitting, the seven-day paper schedule, and the agent to build for 2 December. |

Read `03` for the decision. Read `02` before writing code. Read `01` when a sentence needs a source.

The paper deadline is **12 November 2026, 23:59 UTC**. The agent-contest final deadline is **2 December 2026, 23:59 UTC**.


---

<!-- ====================================================================== -->
<!-- FILE: 01_Research_Report.md -->
<!-- ====================================================================== -->

# BCF and the Gemma 4 paper track

*Research scope: decide whether the Batonic Coding Framework, as stated in the constitution of 5 November 2026, is a coherent and testable coding framework, and whether it is a suitable first whitepaper for the Google DeepMind Gemma 4 Developer Agent paper track given that track's audience, rubric, and deadline. The companion question is how to build an agent, inside the prediction contest's harness, that can produce the measurements the paper needs. Frame: primary contest pages and peer-reviewed or original-author sources outweigh blogs; local contest files are used where they quote the harness or a dated leaderboard pull, and they are labeled as such.*

*As of: 2026-11-05. The paper track closes in seven days. Contest rules and leaderboards are moving.*

## Executive summary

The constitution is a coherent repair policy, and it becomes a testable framework once "value" is defined as a progress order over logged facts rather than as an asymptotic slogan. It is a good whitepaper topic only in a narrowed form. The paper track scores Novelty, Quality, Relevance, Verifiability, and Clarity equally, from 0 to 5, and the writeup is capped at 3,000 words, due 12 November 2026 at 23:59 UTC ([official overview](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/overview), page text captured 2026-11-05T22:43:52Z). A manifesto that restates "preserve working code, search carefully, and write down what you did" will score poorly, because each clause already has a published ancestor and the track already has 633 submissions. The claim that fits the rubric is narrower: under one fixed time budget and one fixed tool-call budget, three deterministic operators (reproduce before editing, keep an anytime patch, roll back a change that adds failures) change resolve rate, empty-patch rate, and regression rate for a single Gemma 4 agent. Confidence is high on the rubric, the word cap, and the prior-art map. Confidence is moderate on which Gemma 4 sizes the scorer currently accepts, because the packaged harness text and later public discussion disagree. A direct WebFetch of the Kaggle pages later in this session returned "Too many requests," so the verbatim rubric below is from the official URL captured earlier the same evening, and it matches an independent writeup of that page from 24 October 2026.

## What the judges will actually score

The paper track is a separate Featured Hackathon. Participation in the prediction contest is encouraged and is not required. Submissions must be original and unpublished. The required Kaggle Writeup contains a title and subtitle, an abstract, an introduction, methods and experiments, and related work with citations. An optional public notebook and an optional public arXiv-ready PDF are allowed. Drafts that were never submitted are not judged. The track is non-archival, so a later conference or arXiv submission remains possible ([official overview](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/overview), captured 2026-11-05).

The five criteria, scored 0 to 5 and averaged, are quoted here from that capture:

| Criterion | Official question |
|---|---|
| Novelty | Does the work provide new insights, deepen understanding, or highlight important properties of existing methods? |
| Quality | How general and universal is the approach beyond the competition, and does it translate to similar problems? |
| Relevance | Is there significance or potential impact on software engineering and agentic learning? |
| Verifiability | Is there enough information to understand how the innovation works and how the data were obtained, analyzed, and interpreted? |
| Clarity | Is the paper clearly presented and written? |

Ties go to the paper entered first. Rubric feedback is not returned. Three prizes are listed: Overall Best Paper, $15,000, awarded to the highest average; Best New Resource, $10,000, for a dataset, tool, or library; Best New Application, $10,000, for a new use of code graphs or the provided embeddings. The encouraged topics are parameter-efficient fine-tuning and reinforcement learning, code-graph comprehension, new tasks and benchmarks, and graph reasoning. The only judge named on the page is Elan Markowitz. The citation block also names Bryan Perozzi, Benedek Rózemberczki, Michael Galkin, and Hadi Hemmati, among others. That roster is a graph-learning and software-engineering group, which is a reason to attach any repair policy to the contest's code graph and to report whether the graph actually changed a decision.

The same capture shows the field on the evening of 5 November 2026: 6,782 entrants, 606 participants, 587 teams, and 633 submissions. A late-September local snapshot had 86 submissions. The track is no longer an empty room. A second source, The GenAI Magazine on 24 October 2026, reports the same five criteria, the same 3,000-word cap, the same three prizes, five writeups per day, and at most two final writeups judged ([The GenAI Magazine](https://thegenaimagazine.com/google-gemma-4-paper-track-35k-prizes-ideas)). That article is a secondary reading of the official page. Where it adds operational detail the evening capture did not render, notably the two-finals rule, treat it as plausible and confirm it in the writeup UI before relying on it.

The prediction contest remains the place where an agent is scored. Its overview, captured the same evening, still describes a zip archive whose root is `agent.yaml`, with optional prompts, sub-agents, skills, and LoRA adapters. Scoring follows the SWE-bench pattern: a patch is applied and the issue's tests pass or fail ([Jimenez et al., ICLR 2024](https://arxiv.org/abs/2310.06770); [contest overview](https://www.kaggle.com/competitions/gemma-4-developer-agent/overview)). The September overview text in the local corpus sets a 12-hour budget for all tasks, names `gemma-4-31b-it-qat-w4a16-ct` as the required model, and lists shell, patch, file, and code-graph tools. The packaged `HARNESS_README.md` agrees on the 31B allow-list for scoring and adds the mechanics that matter for a brain: context length 32,768, unpacked zip under 3 GiB, at most eight LoRAs of rank at most 128, and an automatic `git diff` if the agent never calls `submit_patch`. Files created in `/workspace` enter that diff. Scratch belongs outside it.

A local leaderboard pull at about 22:05 UTC on 5 November 2026, stored in this project's intel files, shows 4,835 teams on the public board, a median of 0.15, and a leader at 0.29. The displayed score is `floor(100 * k / 58) / 100`, so 0.29 is 17 of 58 public tasks. This project's team name does not appear on that pull. Those numbers are a snapshot of one API response, not a live re-pull from this session.

## The constitution is a policy, and the policy can be tested

Read as engineering rules, the constitution hangs together.

One gate sits on every mutation, so risk is decided in one function and can be audited. The gate's job is to refuse an edit that would destroy a state the tests have already shown to work. Every decision writes a record sufficient to reconstruct why the edit was allowed. Diagnosis points back at a source of truth that is outside the model's memory: the repository, its tests, and, when used, the code graph. Search has three shapes because failures have three shapes: a regression among a sequence of changes (binary search), a neighborhood of callers (breadth-first), and a body that must be read line by line once the symbol is known (depth-first, bounded). A separate operator may propose a replacement from the specification and the signature when reading the buggy body is the wrong move. After a failed attempt, a postmortem stores the hypothesis and the evidence. A budget knob chooses how much thinking and how many calls the attempt may spend. The handoff claim is the important one: the record, the atoms, and the diff are enough for a second process to continue.

That is a framework in the operational sense. It names state, operators, and an acceptance rule. It is not yet a theory. The sentence "x-prime is asymptotically greater than x" needs a value function and a sequence of states before it is a claim. Without those, it cannot be falsified, and Verifiability is one fifth of the score. Section 2 of the formal specification supplies the missing order: a vector of observed facts, compared lexicographically. A legal step raises that vector or restores a saved higher vector. "Asymptotically" is the wrong word for a single task with a few dozen tool calls. The handoff property replaces it, and the handoff property is testable: delete the model's hidden trace, keep the log and the diff, and ask whether a second run can resume.

## Each clause already has an ancestor

The map below is the novelty check. A paper that claims the whole constitution as new will collide with these sources. A paper that measures one composition of them, on this budget, can still be new, because Novelty explicitly includes important properties of existing methods.

| Constitution clause | Published ancestor | What remains to measure |
|---|---|---|
| Preserve a working state; gate a risky edit | SWE-agent's agent-computer interface: a small action set, guardrails, and feedback after each command ([Yang et al., NeurIPS 2024](https://arxiv.org/abs/2405.15793)) | Whether a script gate beats the same advice written only in the prompt, at equal call budget |
| Binary search over a change that used to pass | Delta debugging: isolate a minimal failure-inducing subset of changes ([Zeller, ESEC/FSE 1999](https://www.st.cs.uni-saarland.de/publications/details/zeller-esec-1999/)) | Whether any bisection fits inside a cap of roughly 20 to 30 calls, or whether the honest action is to revert the whole edit |
| Breadth-first then depth-first localization | Agentless localizes file, then symbol, then edit site, then validates with tests ([Xia et al., 2024](https://arxiv.org/abs/2407.01489)). RepoGraph retrieves a k-hop definition/reference neighborhood ([Ouyang et al., ICLR 2025](https://arxiv.org/abs/2410.14684)) | Hit rate of the contest's `get_code_neighbors` against the gold file, reported per task, with lexical search as the control |
| Decompose the issue into atoms tied to a reference | Agentless and RepoGraph both force the model to name a location before editing. SWE-bench's own unit is the fail-to-pass test ([Jimenez et al., ICLR 2024](https://arxiv.org/abs/2310.06770)) | The fraction of atoms that cite a real file, symbol, or test, and the fraction that are uncited hypotheses |
| Build a candidate from the specification | Mills, Dyer, and Linger used "cleanroom" for defect prevention by verification and statistical testing during construction ([IEEE Software, 1987](https://doi.org/10.1109/ms.1987.231413)) | A different operator: withhold the buggy body, generate from signature plus tests, accept only if checks improve. Cite Mills for the family, and name the operator separately |
| Postmortem and self-improvement without a weight update | Reflexion stores verbal feedback in an episodic buffer across trials ([Shinn et al., NeurIPS 2023](https://arxiv.org/abs/2303.11366)). Self-Debug repairs from execution feedback inside one attempt ([Chen et al., ICLR 2024](https://arxiv.org/abs/2304.05128)) | Within-task reflection under compaction, which drops tool history, versus a codebook used only between submissions |
| A written constitution that steers the model | Constitutional AI trains with a list of principles and AI feedback ([Bai et al., 2022](https://arxiv.org/abs/2212.08073)) | BCF's list is a runtime gate, not a training method. The paper should say that in the first related-work paragraph |
| Spend more thinking when the task is harder | The harness exposes `thinking_budget`. SWE-agent's result is that interface design moves pass rate with the weights held fixed | On versus off, at matched wall clock. A smooth "effort curve" is a second experiment |

SWE-agent is the methodological parent. With GPT-4 Turbo it resolved 12.47% of the full SWE-bench test set, against 3.8% for the previous non-interactive system, and an ablation on SWE-bench Lite attributed a large share of the gain to the interface rather than to a new model ([Yang et al., NeurIPS 2024](https://arxiv.org/abs/2405.15793)). Agentless then showed that a fixed localize-repair-validate procedure, with the model forbidden from choosing its own next tool, reached 32.00% on SWE-bench Lite in the authors' report ([Xia et al., 2024](https://arxiv.org/abs/2407.01489)). RepoGraph, plugged into both styles, reports an average relative improvement of 32.8% on the setups in that paper ([Ouyang et al., ICLR 2025](https://arxiv.org/abs/2410.14684)). The lesson for BCF is practical: a policy and a graph can move the score with the weights held fixed, and a free-roaming multi-agent loop is not the only, or the first, design to test.

Two naming traps are worth fixing before a draft circulates. Mills's cleanroom process replaces debugging during construction with human verification and statistical certification. It does not mean "hide the buggy function from the model." Using the word for the second idea will draw a fast objection. Bai's constitution is a list of principles used to generate training targets. Using the word for a shell script that rejects a diff will draw the same kind of objection. Both citations belong in related work. Neither citation can carry the claim.

## What a brain is allowed to be, inside this harness

The packaged harness is the mechanical source of truth for the agent, with one dated caveat below. It compiles `agent.yaml` into an ADK agent tree and does not import arbitrary competitor Python. The model context cap is 32,768 tokens. Thinking shares the output budget. `run_command` takes one string, counts as a tool call, and truncates each stream at 5,000 characters. `submit_patch` is free and ends the episode. If the agent never submits, the harness still diffs the workspace, so an empty workspace is an empty patch and a forgotten repro script in `/workspace` becomes part of the submission. `read_file` and `edit_file` exist. Code-graph tools exist: neighbors, similar-code search, and an induced subgraph. A local 5 November synthesis of the contest forum says that declaring the graph tools injects a paragraph urging their use, and that a lexical baseline has beaten the embedding search on at least one public audit. That synthesis is a secondary digest of forum posts. The paper should measure the graph against lexical search on a frozen task list rather than adopt the digest as a result.

Public ADK documentation describes `LlmAgent`, `SequentialAgent`, `LoopAgent`, and skills whose scripts run through `run_skill_script` ([ADK Agent Config](https://adk.dev/agents/config/); [ADK skills](https://adk.dev/skills/)). The contest's own compiler is a restricted subset. A local forum synthesis dated 5 November 2026 reports two harness failures that should shape the brain: a vLLM tool parser that can hang the whole scoring run when an array argument contains brackets, and a continuation bug that drops state in a `SequentialAgent`. The same notes say compaction can summarize away tool results. Those are community reports, not host confirmations collected in this session. They are strong enough to justify a conservative build: one `LlmAgent`, no array-typed tools, helpers invoked as a single shell string, and a state file the model re-reads because the conversation summary may not contain the last test result.

The model-family rule is the unresolved point. The packaged `HARNESS_README.md` in this repository says scoring allows only `gemma-4-31b-it-qat-w4a16-ct`, and that E4B, E2B, 12B, and other sizes are registered for local CLI runs. Later local forum digests, and a public GitHub README that is not an official page, describe scored E4B and E2B submissions and a separate small-model bonus ([example of the unofficial claim](https://github.com/kevin9327/KaggleGemma4DevAgent2026/blob/main/README.md)). A Kaggle dataset posted by a competitor describes local screens of 31B, 12B, and E4B on the public tasks ([Gluzdov dataset](https://www.kaggle.com/datasets/dmitriigluzdov/gemma-4-task-soundness-and-local-results)). Until the current wheel's allow-list is read, the paper experiment and the first scored bundle should use the 31B competition model named in the packaged harness. An E4B bundle is a second track, after that check.

The local 5 November action note also records a team-level fact: no submission from this effort is on the public board yet, and the scoring queue has been long enough that one pending run can occupy the only in-flight slot for a day or more. The paper does not need a leaderboard score. The agent track does. Those two clocks should not share one heroic run in the next seven days.

## What would make the paper fail, and what would make it hold

Reviewers of this rubric can reject a framework paper for a short list of reasons that are already visible.

Novelty fails if the contribution is the union of SWE-agent, Agentless, Reflexion, and a prompt. Quality fails if every number is an artifact of one harness bug, one repository, or one seed, with no statement of what should transfer. Verifiability fails if the writeup says the gate "improved reasoning" and does not list the task ids, the caps, the model id, the prompt hash, and the command that decided pass or fail. Clarity fails if 3,000 words are spent defining eight virtues and the experiment is a paragraph.

The paper holds if it reports a paired comparison on a task list frozen before the run, with the weights, the caps, and the tools identical across arms, and with the only change being whether the gate scripts were in the path. The outcomes that matter on this contest, given the automatic diff, are three counts: tasks resolved, tasks with an empty patch, and tasks whose patch made a previously passing check fail. A gain on empty patches with no loss on resolved tasks is a real result. A gain of one task on a 24-task slice is noise until it is repeated. The local intel file treats repeated scores of identical bytes as moving by about two or three tasks; that noise model is from the public board, not from a controlled study, and the paper should estimate its own uncertainty rather than import the number.

A resource-track entry is the fallback if the paired run cannot be finished. The resource is the atom schema, the trace schema, and a replay checker that a second person can run on traces they are allowed to publish. It becomes a weak entry if the only examples are contest tasks whose redistribution is restricted. The prediction-contest rules, in the 29 September local copy, limit redistribution of competition data to people who have not accepted the rules. Public SWE-bench Lite instances, or tiny synthetic repositories written for the paper, are the safe examples.

## Open questions

The live Kaggle pages could not be re-fetched with WebFetch after the first capture; both the paper overview and the agent overview returned a too-many-requests error. The rubric, prizes, word cap, and 12 November deadline are taken from the official page captured at 22:43 UTC. A second confirmation in a browser, while logged in, is still worth doing before submit, in case the host edits the timeline. The organizers reserve that right on the page itself.

It is unresolved whether a submitted writeup can be edited, and whether the tie-break timestamp is the first click of Submit or the last update. The safe action is to confirm that in the writeup editor on 6 November, then either revise one submitted writeup or hold Submit until the pilot table exists.

It is unresolved, in official text found this session, whether the scorer's allow-list now includes E4B, E2B, and 12B. The packaged harness and the public discussion disagree. Read `ALLOWED_MODEL_NAMES` in the wheel that will actually score the bundle.

It is unresolved whether a third-party hosted model may see contest issue text. The local forum digest records that question as open. Generate paper traces on a local Gemma process, or on public data, until a host answer exists.

No BCF run from this effort is on the public leaderboard as of the 5 November pull. Any sentence in the paper about a leaderboard score has to wait for a scored submission. The pilot can still be local.

## Sources

1. Google DeepMind. "Google - The Gemma 4 Developer Agent Paper Track," overview. Kaggle. Page text captured 2026-11-05T22:43:52Z from <https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/overview>. Rubric, prizes, word cap, deadline, participation counts.
2. Google DeepMind. "Google - The Gemma 4 Developer Agent Competition," overview. Kaggle. Page text captured 2026-11-05T22:44:03Z from <https://www.kaggle.com/competitions/gemma-4-developer-agent/overview>. A later WebFetch of the same URL returned HTTP-style "Too many requests."
3. The GenAI Magazine. "Google Has $35K for Gemma 4 Research: 5 Ideas to Try." 24 October 2026. <https://thegenaimagazine.com/google-gemma-4-paper-track-35k-prizes-ideas>. Secondary corroboration of the rubric, cap, and prizes.
4. Packaged contest file `HARNESS_README.md` in this repository (`input/kagglecomp/kagglecomp_data_package/`). Tool contracts, 31B allow-list, context length, automatic diff. Local snapshot; the wheel may have moved.
5. Local leaderboard digest `input/kagglecomp/intel_20261105-2/04_Leaderboard_2026-11-05.md`, from a leaderboard API pull at about 22:05 UTC on 2026-11-05. Public-board counts and the 58-task denominator.
6. Local action note `input/kagglecomp/intel_20261105-2/03_BCF_Impact_and_Actions.md`, 2026-11-05. Community reports of parser hangs, compaction, and this team's absence from the board. Treated as a lead, not as a host ruling.
7. Carlos E. Jimenez, John Yang, Alexander Wettig, Shunyu Yao, Kexin Pei, Ofir Press, and Karthik Narasimhan. "SWE-bench: Can Language Models Resolve Real-World GitHub Issues?" ICLR 2024. <https://arxiv.org/abs/2310.06770>.
8. John Yang, Carlos E. Jimenez, Alexander Wettig, Kilian Lieret, Shunyu Yao, Karthik Narasimhan, and Ofir Press. "SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering." NeurIPS 2024. <https://arxiv.org/abs/2405.15793>.
9. Chunqiu Steven Xia, Yinlin Deng, Soren Dunn, and Lingming Zhang. "Agentless: Demystifying LLM-based Software Engineering Agents." arXiv:2407.01489, 2024. <https://arxiv.org/abs/2407.01489>. Authors read from the paper's title block.
10. Siru Ouyang, Wenhao Yu, Kaixin Ma, Zilin Xiao, Zhihan Zhang, Mengzhao Jia, Jiawei Han, Hongming Zhang, and Dong Yu. "RepoGraph: Enhancing AI Software Engineering with Repository-level Code Graph." ICLR 2025. <https://arxiv.org/abs/2410.14684>.
11. Andreas Zeller. "Yesterday, my program worked. Today, it does not. Why?" ESEC/FSE 1999. <https://www.st.cs.uni-saarland.de/publications/details/zeller-esec-1999/>.
12. Harlan D. Mills, Michael Dyer, and Richard C. Linger. "Cleanroom Software Engineering." IEEE Software, September 1987. <https://doi.org/10.1109/ms.1987.231413>.
13. Noah Shinn, Federico Cassano, Edward Berman, Ashwin Gopinath, Karthik Narasimhan, and Shunyu Yao. "Reflexion: Language Agents with Verbal Reinforcement Learning." NeurIPS 2023. <https://arxiv.org/abs/2303.11366>. Authors read from the paper's title block.
14. Xinyun Chen, Maxwell Lin, Nathanael Schärli, and Denny Zhou. "Teaching Large Language Models to Self-Debug." ICLR 2024. <https://arxiv.org/abs/2304.05128>.
15. Yuntao Bai, Saurav Kadavath, Sandipan Kundu, et al. "Constitutional AI: Harmlessness from AI Feedback." arXiv:2212.08073, 2022. <https://arxiv.org/abs/2212.08073>.
16. Google. "Build agents with Agent Config." Agent Development Kit. <https://adk.dev/agents/config/>. Fetched 2026-11-05. The public ADK config is wider than the contest compiler.
17. Dmitrii Gluzdov. "Gemma 4 Task Soundness and Local Results." Kaggle dataset. <https://www.kaggle.com/datasets/dmitriigluzdov/gemma-4-task-soundness-and-local-results>. Evidence that competitors are screening 31B, 12B, and E4B locally. Not an official rule.


---

<!-- ====================================================================== -->
<!-- FILE: 02_BCF_v1_Formal_Specification.md -->
<!-- ====================================================================== -->

# BCF v1: a formal specification

*Status: specification, 2026-11-05. This file turns the Batonic Coding Framework constitution into objects a program can check. It is the source of truth for the brain described in `03_Paper_Decision_and_Brain_Plan.md`. No resolve-rate claim in this file comes from a run.*

## 1. What the framework is

BCF v1 is a repair policy for an agent that edits a repository under an external budget. The policy has four parts.

1. A **state** the agent can write down.
2. A **progress order** on that state, which is the meaning of "the output is worth more than the input."
3. A **gate**, the single function allowed to change the repository.
4. A **log** sufficient for a second process, which has not seen the first process's hidden reasoning, to resume.

The constitution's list of virtues is the motivation. The objects below are the framework. A step that the gate cannot classify, or that the log cannot resume, is outside BCF v1.

## 2. State

A task begins with an issue text, a repository at a fixed commit, and a budget

`B = (time_seconds, tool_calls, thinking_tokens)`.

The agent maintains a record `S`.

| Field | Meaning |
|---|---|
| `atoms` | The issue broken into cited pieces. See section 4. |
| `vector` | Eight observed facts, each 0 or 1. See section 3. |
| `saved` | The last vector that was accepted, plus a git tree id for that workspace. |
| `mode` | `read`, `search`, `edit`, or `check`. |
| `risk` | The class of the edit currently proposed: `R0`, `R1`, `R2`, or `R3`. |
| `budget_used` | Time and tool calls already spent. |

Hidden chain-of-thought is not part of `S`. If it is not in the log, it did not happen, for the purposes of handoff and of the paper.

## 3. The progress order

This is the replacement for "x-prime is asymptotically greater than x."

Let the progress vector be this tuple, in this order:

| Index | Coordinate | Becomes 1 when |
|---|---|---|
| 1 | `symptom` | The failure is quoted from the issue or from a test output, and the quote is stored. |
| 2 | `reproduced` | A command run in this episode exited non-zero for that symptom, and the command is stored. |
| 3 | `cited` | Every atom is either cited to a file, symbol, test, or issue span, or explicitly marked `hypothesis`. |
| 4 | `patch` | The workspace diff against the start commit is non-empty and contains no scratch files. |
| 5 | `focused_better` | The focused check has fewer failures than the reproduced baseline, or the named symptom is gone. |
| 6 | `regression_ok` | A broader check, if one was run, has no new failures. If none was run, this stays 0 and submit stays unavailable past the early window. |
| 7 | `clean` | Scratch lives outside the diff, and `submit_patch` has been called or the episode is ready for it. |
| 8 | `postmortem` | A closed record exists: hypothesis, evidence, outcome, and whether the edit was kept. |

Compare vectors lexicographically. `S'` is **greater** than `S` when the first coordinate that differs is 1 in `S'` and 0 in `S`.

A transition is **legal** in exactly two cases.

- It produces a greater vector.
- It is a **rollback**: the workspace tree returns to `saved`, and the vector returns to the saved vector. Rollback is how "preserve working code" outranks a greedy edit.

A transition that lowers any earlier coordinate is illegal, even if a later coordinate rises. Editing before reproduction does not count as progress. A green focused check that was purchased by deleting a test does not count: test files are not an allowed edit target, and the contest harness strips `tests/` edits in any case.

"Asymptotically greater" is not a theorem of this order. A task has a finite budget, so the sequence of vectors is finite. The claim BCF v1 actually makes is the **handoff property**:

> Given `S`, the atom list, and the diff, a second process that shares the repository commit and does not share the first process's hidden trace can name the legal next operators.

That property is checked by deleting the conversation, keeping `/tmp/bcf/state.json`, and resuming.

## 4. Atoms

An atom is the smallest piece of the issue that the rest of the policy is allowed to cite.

```json
{
  "id": "A3",
  "kind": "symptom",
  "text": "Client.merge drops the default timeout",
  "citation": {
    "source": "issue",
    "path": null,
    "symbol": null,
    "span": "issue paragraph 2"
  },
  "status": "cited"
}
```

`kind` is one of `symptom`, `expected`, `symbol`, `test`, `constraint`.

`status` is `cited` or `hypothesis`. A `symbol` or `test` atom with `status: cited` must name a path that exists in the repository at this commit. A `hypothesis` atom is allowed, and it cannot by itself authorize an `R1` edit. The decompose operator's job is to drive `cited` to 1, which means the list is closed under this rule, not that every atom is a proven root cause.

The source of truth is the repository, the tests, and the issue text. A general language manual in the prompt is not the reference. When a graph tool is used, the citation records `source: graph` and the node id the tool returned. When grep is used, it records `source: grep` and the pattern. A later diagnosis can open the same place.

## 5. The gate

The gate is the single point of contact. The model proposes. The gate accepts or rejects. No other function writes into the repository.

| Risk | Proposed change | Accepted when |
|---|---|---|
| `R0` | Read, search, or run a check. No file in the repo changes. | Always. |
| `R1` | One symbol that is already a cited atom, at most 30 changed lines. | `reproduced` is 1, or elapsed time has passed 45% of the budget. The second clause is the anytime-patch escape. |
| `R2` | A file that no atom cites. | A logged reason names the evidence, and elapsed time is under 75% of the budget. |
| `R3` | A new file, or a replacement of a whole symbol from the spec-regeneration operator. | An `R1` attempt has already failed its focused check, and elapsed time is under 75% of the budget. |

The anytime-patch escape exists because an empty diff scores zero on this contest even when the diagnosis was right. After 45% of the budget, the gate prefers a small cited edit over further reading. After 75%, the gate accepts only `R0` and `R1`, then requires submit.

The gate is a Python script. The model does not get to overrule it by writing the file itself. In the contest harness the script is invoked as one `run_command` string, and it lives under `/tmp/bcf/` so `git diff` does not pick it up.

## 6. Operators

Each operator has a precondition on `S` and a postcondition the log must show. The implementation may fuse two operators into one shell command. The log still records them separately.

| Operator | Precondition | What it does | Progress it may raise |
|---|---|---|---|
| `observe` | Episode started | Quote the symptom from the issue or the first failing output | `symptom` |
| `decompose` | `symptom` is 1 | Emit atoms. Mark anything uncited as `hypothesis` | `cited` |
| `search_bfs` | A cited symbol exists | Expand callers and callees one hop, cap 20 nodes. Graph tool if enabled, otherwise grep | New `symbol` atoms |
| `search_dfs` | One symbol is chosen | Read a bounded line window of that symbol only | None by itself |
| `search_bisect` | A check passed at `saved` and fails now, and at least four calls remain | Split the current diff in half and re-check. If the call budget cannot pay for a split, rollback the whole edit instead | Restores `regression_ok` via rollback |
| `reproduce` | `symptom` is 1 | Run the smallest command that should fail | `reproduced` |
| `spec_regen` | Signature and tests are cited; the buggy body was not part of the prompt for this call | Propose a replacement of one symbol | A candidate the gate may accept as `R3` |
| `edit` | Gate returned accept | Apply the accepted diff and only that diff | `patch` |
| `check_focused` | `patch` is 1 | Re-run the reproduced command | `focused_better` |
| `check_regression` | `focused_better` is 1 and calls remain | Run a broader, still bounded, test selection | `regression_ok` |
| `rollback` | A check is worse than `saved` | Restore the saved tree | Returns to the saved vector |
| `postmortem` | An edit was kept or rolled back | Append hypothesis, evidence, outcome | `postmortem` |
| `submit` | `patch` is 1, scratch is outside the diff, and the gate's submit rule passes | Call `submit_patch` | `clean` |

`search_bisect` is Zeller's idea restricted to the diff of this episode. It is not a license to run a full delta-debugging loop. Under a cap of about 28 tool calls, one split is often all the budget can pay for. The specification prefers rollback of the whole edit when a split does not fit.

`spec_regen` is the constitution's clean-room operator, under a name that does not pretend to be Mills's cleanroom process. Mills, Dyer, and Linger (1987) prevent defects by verification during construction. This operator does something smaller: it withholds the buggy body for one generation, then subjects the result to the same gate as any other edit. If the focused check does not improve, the operator's output is discarded.

Search shape is chosen from the failure, not from a standing order to "use all three."

- A regression against `saved` selects `search_bisect` or, if unaffordable, `rollback`.
- An uncited symptom with a named symbol selects `search_bfs`, one hop.
- A cited symbol whose body has not been read selects `search_dfs` inside a line window.

## 7. Effort

The external constraint is `B`. The policy has two thinking modes, because that is the distinction worth testing first.

| Mode | When | Thinking | Calls it may spend |
|---|---|---|---|
| `read` | `observe`, `decompose`, `search_*`, `reproduce` | Off, or the smallest budget the server allows | Up to 45% of `tool_calls` |
| `edit` | `edit`, `spec_regen`, `check_*`, `postmortem` | On, with a reserved output margin so the edit itself fits | The remainder |

A continuous quality-versus-speed curve is a later experiment. v1 tests on versus off, at the same wall clock. Temperature is not a BCF parameter.

## 8. The log

Append one JSON object per operator to `/tmp/bcf/trace.jsonl`. Overwrite `/tmp/bcf/state.json` with the current `S` after every legal transition.

A trace record contains: time, operator name, risk class, vector before, vector after, atom ids touched, the command or diff hash, the check result class (`pass`, `fail`, `timeout`, `rejected`), and whether the gate accepted. It does not contain a full file body. The body is in git.

Fidelity rule: a record is sufficient when a person who has the repository commit can replay the command and obtain the same result class. Longer transcripts are optional. Hidden reasoning is out of scope, because the harness compaction can drop it and a second machine will not have it.

The postmortem record, written once per kept or rolled-back edit, contains: the hypothesis in one sentence, the atom ids it relied on, the check result, the decision (`keep` or `rollback`), and the next operator. Across tasks, these records are a codebook for the next submission. They are not a weight update. The contest episode does not train.

## 9. Invariants

A conforming implementation maintains all of the following. Each one has a mechanical check.

| Id | Invariant | Check |
|---|---|---|
| I1 | Every repo mutation went through the gate | The trace's accepted diff hashes reconstruct the workspace diff |
| I2 | No illegal vector move | Sort the trace; each step is greater or is a rollback to `saved` |
| I3 | Cited atoms resolve | Every `status: cited` path exists at the commit |
| I4 | Scratch stays out of the patch | `git diff` names no path under `/tmp` and no `repro` script |
| I5 | Handoff | A fresh process, given only `state.json`, lists the same legal operators |
| I6 | Budget | `budget_used` never exceeds `B`, and submit happens by 90% of the time cap if `patch` is 1 |

I6 is the anytime rule in invariant form. An agent that understands the bug and submits nothing has failed BCF v1, even if its diagnosis was right.

## 10. What the model is told

The constitution is for the designer and the paper. The model sees a short contract, on the order of 400 words, because a long principle list competes with the repository inside a 32,768-token window. The contract names the modes, the gate command, the path of `state.json`, and the rule that an edit the gate rejected must not be retried with the same diff. The operators live in the script, so a model that ignores a paragraph still cannot write past the gate.

Illustrative contract, not yet a measured prompt:

> You repair one repository issue. Your memory is `/tmp/bcf/state.json`. At the start of a turn, if you are unsure what happened, read that file. Do not restate file contents. Use `python /tmp/bcf/bcf.py <operator>`. The script is the only way to change a file. If it returns `rejected`, choose another operator. Reproduce the symptom before you edit. Once 45 percent of the time budget is gone, prefer a small edit of a cited symbol over more reading. If a check gets worse, roll back. When a patch exists and the checks are not worse, submit, and leave no scratch files in the repository.

## 11. A worked example, invented

This episode is an illustration of the order, not a contest result.

The issue says `add(a, b)` returns `a - b`. The repository contains `def add(a, b): return a - b` in `mathx.py`.

| Step | Operator | Vector after | Why it is legal |
|---|---|---|---|
| 1 | `observe` | symptom | The quote is stored. |
| 2 | `decompose` | symptom, cited | Atom `symbol: add` cites `mathx.py`. |
| 3 | `reproduce` | symptom, reproduced, cited | `python -c "import mathx; assert mathx.add(1, 2)==3"` exits non-zero. |
| 4 | `edit` as `R1` | those, plus patch | Gate accepts: reproduced, one cited symbol, one line. |
| 5 | `check_focused` | those, plus focused_better | The same command exits 0. |
| 6 | `submit` | clean | Diff is the one line. Scratch is in `/tmp`. |

An illegal variant: the model edits on step 2, before reproduction. The gate returns `rejected`. The vector does not change. The trace records the rejection. That rejection is a successful test of the framework, and it is a failed edit.

## 12. Falsification

BCF v1 is unsupported if any of the following holds on a task list frozen before the run, against an unconstrained agent with the same model, tools, and budget.

- The gate arm resolves fewer tasks and does not reduce empty patches.
- The gate arm's trace violates I2 on more than a rare parser failure. The policy is then not the thing that ran.
- Hiding the buggy body (`spec_regen`) never beats editing the body in place, and costs calls that the in-place arm spends on checks. The operator should then be dropped, not described as a principle.
- Resuming from `state.json` fails whenever the conversation is deleted. The handoff claim is then false, and the log schema has to change before any paper claims it.

A gain of a single task on a few dozen examples does not confirm the framework. The decision document sets the pre-registered margin.


---

<!-- ====================================================================== -->
<!-- FILE: 03_Paper_Decision_and_Brain_Plan.md -->
<!-- ====================================================================== -->

# Decision, brain, and submission plan

*As of 2026-11-05. Paper deadline: 12 November 2026, 23:59 UTC. Agent deadline: 2 December 2026, 23:59 UTC.*

## The decision

Submit a paper on BCF. Submit it as one measured policy, not as the constitution.

The constitution in `02_BCF_v1_Formal_Specification.md` is coherent, and its progress order, gate, and handoff check make it testable. That is enough to justify the work. It is not enough, by itself, to win this rubric. Novelty, Quality, Relevance, Verifiability, and Clarity are weighted equally. A 3,000-word essay that introduces eight principles will spend its Verifiability points on definitions, and its Novelty points on ideas SWE-agent, Agentless, delta debugging, and Reflexion already published. The paper track, on the official page captured the evening of 5 November 2026, already has 633 submissions.

The claim that fits:

> On a frozen set of repository-repair tasks, a single Gemma 4 agent whose edits must pass a deterministic gate (reproduce first, keep an anytime patch, roll back new failures) changes three counts relative to the same agent with the gate removed: tasks resolved, empty patches, and new test failures. Model, tools, time cap, and call cap are identical. The gate is a script. The prompt difference is the command that invokes it.

That claim is relevant to software engineering because the failure it targets is an agent that either edits a working tree blindly or finishes with no patch. It is relevant to this contest because the harness scores `git diff` of the workspace, including the empty diff. It can generalize past the contest if the same three counts move on public SWE-bench Lite under a similar call cap. It is verifiable if the writeup names the task ids, the caps, the model id, the prompt hash, and the command that marked a task resolved.

Write for Overall Best Paper. If the paired run is not finished by 10 November, switch the same draft to Best New Resource and submit the atom schema, the trace schema, and a replay checker, with examples from public or synthetic repositories only. Do not ship contest task text in a public notebook.

## What not to claim

Leave these sentences out of the abstract.

- "BCF is asymptotically better." The specification uses a finite lexicographic order. Say that.
- "Clean-room construction, in Mills's sense." The operator withholds one function body and then tests the result. Cite Mills in related work and call the operator spec regeneration.
- "A constitution in the sense of Constitutional AI." That paper is a training method. BCF v1 does not update weights during an episode.
- Any leaderboard score. The 5 November public-board pull in this project does not list this effort. A local pilot is the evidence.
- A smooth curve from thinking budget to quality. Test thinking on versus off, or hold thinking fixed so the gate is the only factor.

## The brain to build

Build one agent. Call it BCF-31B. It is a single `LlmAgent` aimed at `gemma-4-31b-it-qat-w4a16-ct`, which is the model the packaged harness marks as the scoring model. Confirm `ALLOWED_MODEL_NAMES` in the wheel you will actually submit before you trust that sentence: later public discussion describes E4B and 12B submissions, and the packaged README disagrees.

The model is not the brain. The brain is the gate script plus the state file. The model proposes operators. The script enforces invariants I1 through I6 in the specification.

Layout inside the submission zip:

```text
submission.zip
  agent.yaml
  eval_config.yaml
  configs/sampling.yaml
  prompts/system.md
  tools/bcf.py
```

`tools/bcf.py` is the gate. On the first call the agent copies it to `/tmp/bcf/bcf.py` with one `run_command` heredoc, then calls `python /tmp/bcf/bcf.py <operator>`. `/tmp` stays out of `git diff`. The script accepts a single string argument so the tool schema has no array field. That choice follows the packaged harness, where `run_command` takes one string, and it avoids the array-argument parser hang reported in the 5 November forum digest.

`prompts/system.md` is the short contract in section 10 of the specification, plus the budget numbers copied from `eval_config.yaml`. It does not contain the constitution.

Suggested caps for a 31B bundle, chosen so that about 120 tasks can finish inside 12 hours if the scorer is slower than a local GPU. These are planning numbers from the local 5 November notes, not measured on a scored run:

| Knob | Value | Role |
|---|---|---|
| `max_time_minutes` | 7 | Per-task wall clock, including setup |
| `max_tool_calls` | 28 | Room for reproduce, one edit, one check, submit |
| `thinking_budget` | on, about 2048 | Reserved inside `max_output_tokens` |
| `max_output_tokens` | 4096 or 8192 | Must leave room for the edit after thinking |
| Graph tools | off in the first paired run | Add in a third arm only after the gate arm exists |

The first experiment holds the graph off so a graph miss cannot be mistaken for a gate effect. The paper can still discuss the graph as the citation source the atom schema is ready for, and a third arm can turn `get_code_neighbors` on if the pilot finishes early. That is the part of the work aimed at a judging group whose citation list is full of graph researchers. The measurement is "did the neighbor list change the cited symbol," not a new graph model.

Do not build, for the paper or for the first scored zip:

- A `SequentialAgent` or a `LoopAgent` of several models. The forum digest reports state loss across sequential stages, and a second model is forbidden inside one submission if it is a different base.
- A LoRA. Public paired comparisons in the local digest have not shown a gain that pays for the extra latency. Train one only after the gate arm has a local margin.
- A long skill library loaded into the prompt. The script is the skill.
- Online learning inside the episode. Postmortems accumulate between submissions, on data you are allowed to store.

## The experiment the paper stands on

Freeze the protocol before the first pilot run. Write it into the draft on 6 November so the result cannot quietly change the hypothesis.

**Arms.** Arm A is the agent with `bcf.py` absent and a prompt of similar length that tells it to edit carefully. Arm B is the agent with the gate. Same model, same caps, same tools, one seed.

**Tasks.** Twenty-four tasks, chosen from public instances whose tests you can run locally, split into a development dozen and a held-out dozen. Choose them before looking at arm outputs. Prefer tasks a screen has already shown to be solvable by some configuration and unsolved by others, if you have that screen. If you do not, use a fixed public subset and say so.

**Primary counts.** Resolved, empty patch, and patch that adds a failing check. Also report gate rejections and rollbacks, so a reader can see that the script ran.

**Pre-registered call.** Arm B is a positive result only if, on the held-out dozen, it has at least as many resolves as Arm A and at least three fewer empty patches, or it has at least three more resolves. Anything smaller is reported as "no difference detected at this size." With a dozen tasks, three is a high bar on purpose. A one-task story will not survive a second seed, and the public board already moves by a couple of tasks between identical submissions.

**What you may write if the GPU slips.** If Arm B has not been run by 10 November, the paper reports the protocol, the invariant checks on a dry-run trace from Arm A's logs if you have them, and zero resolve-rate claims. That draft is a resource paper, and the abstract must say the comparative run is unfinished.

## Word budget

The writeup limit is 3,000 words. Plan the draft against this split so Clarity is a layout decision rather than a cut made on the last night.

| Section | Words | Job in the rubric |
|---|---|---|
| Abstract | 150 | The one claim, the direction of the result or the statement that the run is a protocol |
| Introduction | 350 | Offline agent, fixed budget, empty-patch failure |
| Related work | 400 | SWE-agent, Agentless, Zeller, Reflexion, Mills, Bai. One paragraph each, then the gap |
| Method | 700 | Vector, gate, three operators, log. Point at the specification for the rest |
| Experiment | 550 | Arms, frozen list, caps, counts, the pre-registered call |
| Results | 400 | The table. If the run slipped, this section says so in the first sentence |
| Limitations | 250 | One seed, one language, harness-specific diff rule, small N |
| References | 200 | Count them. They are part of the cap until the editor shows otherwise |

Confirm on the writeup form whether references count toward the 3,000. If they do, shorten related work before shortening the result table.

## Seven-day schedule

Times are local to a UTC-5 clock. The deadline is 12 November, 18:59 on that clock.

| When | Action | Done when |
|---|---|---|
| 6 Nov morning | Join the paper track. Open a writeup. Read whether Submit can be edited later. Read `ALLOWED_MODEL_NAMES` in the current wheel | You know the timestamp rule and the model id |
| 6 Nov | Paste the protocol and an empty result table into the draft. Implement `bcf.py` invariant checks with the toy `add` example in the specification | I2 and I5 pass on the toy episode |
| 7 Nov | Wire the script into a local harness on two development tasks, one that should be rejected for an early edit and one that should submit | The trace shows one rejection and one submit |
| 8–9 Nov | Run Arm A and Arm B on the held-out dozen if a GPU is free. Otherwise run them on the smallest model the local harness already serves, and label the model id in the paper | A result table with empty cells filled, or an explicit stop |
| 10 Nov | Decide Best Paper versus Best Resource from the table. Write results and limitations. Have someone else read only the abstract and the table | A reader can restate the claim without the constitution |
| 11 Nov | Submit the writeup with margin. Attach a public notebook only if it contains no contest data | The writeup status is submitted |
| 12 Nov | Use this day only if the host changed a rule or the 11 Nov submit failed | No first submission after 18:00 UTC-5 |

The tie-break is the earlier entry. That is a reason to submit on 11 November a paper that already contains its real table. It is a weak reason to submit an empty stub on 6 November, unless you have confirmed that a submitted writeup can be replaced in the same slot. Check that button before you click it.

## The agent contest, after the paper

The prediction contest closes 2 December 2026. Use it to find out whether the gate survives the scorer, which the paper's local pilot cannot fully imitate. The local 5 November notes describe a queue long enough that one pending submission can block the next for a day or more, and they record that this effort has no public score yet.

Order of bundles, after the paper is in:

1. A minimal 31B zip whose only novelty is the gate, with the caps in the table above, submitted so a score exists.
2. A second 31B zip that changes one thing the pilot justified: graph lookup on, or thinking off, or spec regeneration on. One change per zip.
3. An E4B or E2B zip only after the wheel's allow-list shows that model id, and only as one of the two final slots if a small-model bonus is still in the current rules. The packaged harness text does not, by itself, authorize that zip.

Keep the trace schema stable across these bundles. The paper's resource, if you released it, should be able to read the later traces. That is the handoff property applied to your own next machine: the December agent consumes the November log format without a rewrite.

Select the two final submissions only after both have scored. The host note recorded in the local digest says the private score is the better of the two selected finals. Leave that selection until the last week of November, and leave a gap before 2 December so a stuck queue can be cleared by support. The local notes suggest both finals should already have scores by about 30 November. That advice is about queue time, not about the paper.

## First implementation slice

The smallest slice that makes BCF real is smaller than an agent. It is `bcf.py` with these subcommands: `init`, `decompose`, `gate`, `apply`, `check`, `rollback`, `status`. `status` prints the vector and the legal operators. A unit test feeds it the toy `add` episode and asserts the illegal early edit is rejected, the one-line fix is accepted, and a second process that sees only `state.json` prints the same legal set.

When that test is green, the framework exists. The paper and the leaderboard are then measurements of that program, which is the standard the rubric is set up to reward.

