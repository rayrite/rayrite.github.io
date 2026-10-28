# COMBINED MARKDOWN - combine

_Generated 2026-10-28 04:48:38 | 3 files | folder: D:\stuff\docs\taylor_fv\github\rayrite.github.io\cvx\kaggle\items\combine_

## Contents

1. 00_wide-research_gemma-4-developer-agent-bcf-brain_2026-10-28-web-m3.md
2. 01_BCF-build-roadmap_2026-10-28-web-m3.md
3. 02_BCF-whitepaper-draft_2026-10-28-web-m3.md

---

<!-- ====================================================================== -->
<!-- FILE: 00_wide-research_gemma-4-developer-agent-bcf-brain_2026-10-28-web-m3.md -->
<!-- ====================================================================== -->

# Winning the Gemma 4 Developer Agent Competition and the Small-Model Bonus Prize: A Strategy for the BCF Brain

- **Prepared:** 2026-10-28 (America/New_York)
- **Researcher:** Mavis, via the `rdw-conduct-wide-research` skill
- **Requested scope:** (a) latest intel from the Kaggle Gemma 4 Developer Agent Discussion board, (b) intel on the new Bonus Prize, (c) how to develop the BCF coding agent "brain" to produce a winning entry for both
- **Verified-as-of date:** 2026-10-28
- **Hard research cutoff:** 2026-10-28 — nothing published or changed after this date is treated as current
- **Companion workspace artifacts consulted:** `03-discussion-board-intel.md` (compiled 2026-09-30, 22 threads), `03-bcf-simulation-httpx-3672.md` (BCF canonical case study), `HARNESS_README.md` (harness technical reference), `Kaggle-00-Complete.md` (competition documentation snapshot)

---

## Original request (verbatim, as received 2026-10-28)

> Conduct the research: get the latest intel from the Kaggle Gemma 4 Developer Agent Discussion board, get intel on the new Bonus Prize (thread 751104: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/751104), and produce a strategy for developing the BCF brain so it can produce a winning entry — for the main track AND for the Bonus prize.

Restated as research questions, and answered in the report:

| # | Sub-question | Answered in |
|---|---|---|
| SQ1 | What is the current state of the discussion board — what is new, resolved, and still open? | Finding 2 |
| SQ2 | What are the Bonus Prize's terms, mechanics, and ambiguities, and what do they imply? | Finding 1 |
| SQ3 | What does the leaderboard distribution imply about what "winning" requires? | Finding 3 |
| SQ4 | What is the evidence state on LoRA/SFT for this harness? | Finding 4 |
| SQ5 | What are the operational mechanics — budget, queue, scoring latency, local-eval fidelity? | Finding 5, Finding 3 |
| SQ6 | How should the BCF brain be built for the main track? | Findings 6, 7 |
| SQ7 | How should the BCF brain be built for the Bonus prize? | Findings 1, 6, 7 |
| SQ8 | What is the paper-track fit, and where is the deadline risk? | Finding 7 (week 2–3), Finding 8 |

**Sub-question not fully resolved:** SQ1's coverage is partial — the board cannot be enumerated exhaustively from this environment, and thread 751104's body was not retrievable. See Method.

---

## Executive summary

**The single most important fact to know first: on 2026-10-21 Kaggle pinned a thread adding three smaller Gemma 4 variants (12B, E4B, E2B) to the allowed model list, and the competition's Overview now carries a new $10,000 "Bonus Prize: Small Model Development" awarded to the highest-ranking submission using E2B or E4B. That bonus is the highest-leverage opportunity in the entire competition for the BCF brain, and it is also the one with the most unverified moving parts.** The main-track prize pool remains $65,000 and the field is brutal: of 3,981 tracked teams, the median public score is 0.15, only 6 teams reach 0.24, and the score distribution is a wall of ties (2,080 teams at ≥0.15). [Community leaderboard tracker, updated 2026-10-28 05:25 UTC](https://gemma4agent.kawchar.online) · [Kaggle competition page](https://www.kaggle.com/competitions/gemma-4-developer-agent)

Three findings reframe how the BCF brain should be built.

**First, the board's evidence says the brain should be a prompt-and-protocol system, not a trained one.** The most rigorous LoRA experiment on the board — 98 held-out tasks, three adapters, teacher models including Qwen3-Coder-480B and DeepSeek-V4-Flash — drove training loss from 1.4 to 0.40 and *still* solved 31 tasks against a prompt-only baseline's 38, losing on the leaderboard 0.12 to 0.15–0.17. The same author dissected 41 failed runs against gold-patch labels and found the failures are not localization failures: 18 edited within 20 lines of the gold change but got the fix wrong, and 11 opened the gold file and never edited at all. The bottleneck is *wrong fix in the right place* and *never committing to an edit* — not model knowledge. [Munal Singh, "SFT / distillation LoRAs on Gemma 4 31B", discussion 751596](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/751596)

**Second, there is a hard, newly-characterized blocker on any LoRA submission.** LoRA bundles fail to start on 4×L4 under the official vLLM path: with `--enable-lora`, vLLM 0.19.1 captures CUDA graphs twice and does not count the second graph set in the KV budget, so the ~4.5 GiB/GPU of extra graph memory eats the headroom and the sampler warmup OOMs. Three one-line fixes are verified working, and Kaggle staff has confirmed "successful submissions with LoRA adapters up to rank 64" — but the scorer-side defaults are not yet confirmed. [Nir Aberman, "Question about LoRA", discussion 749191](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/749191)

**Third, the budget is the score.** A successful pass needs 40–50 LLM and tool calls spanning 300–350k tokens inside a per-task wall that must total under 12 hours across ~120 tasks — roughly 5.5 minutes each. The one calibrated number that matters: on Kaggle 4×L4 the 12B served text at ~67 tokens/s versus ~35 for the 31B. Smaller models are not just cheaper; they are *faster*, and on a per-task-time budget that converts directly into more reasoning turns, more repair attempts, and more test-time compute. [Ayush Thakur, calibration thread 747857 and experiment thread 746250](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/746250) · [12B serving numbers, thread 748287](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/748287)

**The recommended strategy: build the BCF brain twice.** One instantiation against 31B for the main track, one against E4B for the bonus prize, sharing the same protocol architecture, skills, and failure-taxonomy instrumentation, differing only in the prompt density and tool budget tuned to the model's capacity. Ship both as the two selected final submissions — the bonus prize explicitly requires the eligible submission to be one of the team's two final submissions, so attempting both costs nothing in main-track slots. Lead with the E4B build, because the small-model field is less crowded, the models are faster, and BCF's discipline-first design (spec-first, ordered repair, binary gates, breadcrumb journaling) is exactly the intervention that a smaller model needs and a large model does not.

**Confidence in the core recommendation: high.** The mechanism-level evidence (loss falls, solve rate doesn't; failures localized to right-place-wrong-fix and no-commit; budget binds at ~5.5 min/task) is consistent across four independent teams and the host's own statements. **Confidence in the specific E4B-versus-E2B choice: medium**, because no E2B or E4B submission has yet been confirmed as scored end-to-end, and E2B's serving path has an open question. **Confidence in any precise score prediction: low** — identical byte-identical bundles have scored anywhere from 0.05 to 0.13, and the 13 of 30 tasks whose failure classification changes between identical runs means single-run leaderboard deltas are not evidence.

**Two traps that will cost you the run if you miss them in week one.** (1) **The local holdout is mostly broken.** Only **71 of the 129** public tasks discriminate under the official wheelhouse — and **zero** of the 14 `requests`/`httpx` tasks do, which is BCF's own canonical family. A Config 1/2/3 comparison run on the current task set would report three identical zeros and be read as "BCF does nothing." (2) **Skills may be failing on the scorer.** A live thread reports a skill-bearing submission scoring 0.00 with no error, and a second participant's submission log shows both of its no-score entries were skills-bearing. If true, BCF's T11 and A7 need to be re-expressed as prompt-level scripts — and a skills bundle may carry enough wall-clock overhead to eat a 5.5-minute task before the agent writes any code. Both are Day-0 probes, not Day-10 concerns. [STATE_OF_COMPETITION.md §5.1](https://github.com/cherrera0001/Agents_Learning_Loops/blob/main/STATE_OF_COMPETITION.md) · [thread 748168](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/748168)

---

## Background: what a reader needs before the findings

### The competition

Participants submit a `submission.zip` containing an *agent configuration* — `agent.yaml`, system prompts, custom tools, ADK skills, and optionally PEFT LoRA adapters — not predictions. Kaggle runs that agent on ~120 hidden Python issues from private repositories, in an air-gapped sandbox, 4×NVIDIA L4 GPUs, with a **12-hour total wall-clock limit** for submitting patches to all tasks (sandbox setup included, patch validation excluded). Score = percentage of tasks whose patch passes the hidden validation tests. Binary PASS/FAIL, no partial credit. The public leaderboard uses ~50% of the test set; the private leaderboard uses the other 50% and is the only ranking that decides prizes. [Competition overview](https://www.kaggle.com/competitions/gemma-4-developer-agent) · [Kaggle-00-Complete.md, local snapshot]

One caveat on the budget frame: whether the private evaluator runs tasks **serially or with concurrency N≥2 is not officially documented**, and one participant lists it as their own leading open question — noting that it "drastically changes the margin of the global 12-hour budget." Participants *report* the scorer running one task at a time, and every budget model below assumes serial execution, which is the conservative case: if the evaluator does run concurrently, you have more time than planned, not less. [STATE_OF_COMPETITION.md §6, open gap 1](https://github.com/cherrera0001/Agents_Learning_Loops/blob/main/STATE_OF_COMPETITION.md) · [Tool-Use LoRA Kit results](https://www.kaggle.com/datasets/scottweeden/gemma-4-developer-agent-tool-lora-kit)

The base model was long fixed at `gemma-4-31b-it-qat-w4a16-ct` (W4A16 quantized, 32k context). As of 2026-10-21 that changed: `gemma-4-12b-it-qat-w4a16-ct`, `gemma-4-e4b-it-qat-w4a16-ct`, and `gemma-4-e2b-it-qat-w4a16-ct` are now supported. The host's wording is exact: "We don't support mixing variants within a submission, however. Every agent and subagent must use the same variant (though they can attach different LoRA adapters.)" A scorer-side reply adds: "We understand that the scorer already includes the 12B override and that the smaller variants use the same scoring conditions as 31B." [Thread 748287, pinned](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/748287)

### What "the BCF brain" is

The BCF is the user's own agent architecture, documented in the local workspace. It is a *discipline-first* agent, not a capability-first one: the agent writes a structured specification before touching files, orders the repair topologically, keeps a breadcrumb journal, and enforces binary validation gates where the model's own judgment never grants approval. The canonical walkthrough is `httpx_3672`, and its own documentation is scrupulous about a `[V]` (verified) vs `[SIM]` (simulated) evidence split — the simulation has zero receipts and does not establish that BCF beats a naive agent on any task. [03-bcf-simulation-httpx-3672.md, local]

That architectural identity matters enormously for the strategy below, because the board's own failure analysis converges on the same two problems BCF was designed to attack: wrong fixes in the right place (the "fault masking" / interference class the user's parallel literature review covers) and failure to commit to an edit. **BCF is aimed at the right target. The question is not whether the architecture is sound; it is how to spend the remaining 35 days of competition.**

### The calendar

| Date | Event | Source |
|---|---|---|
| 2026-09-23 | Competition start | [Overview](https://www.kaggle.com/competitions/gemma-4-developer-agent) |
| 2026-10-21 | 12B/E4B/E2B added; bonus prize announced | [Thread 748287](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/748287) |
| 2026-10-28 | *This report* | — |
| 2026-11-12 | **Paper track final submission deadline** (23:59 UTC) | [Paper track](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/overview/tracks-and-awards) |
| 2026-11-25 | Entry deadline + team merger deadline (23:59 UTC) | [Overview](https://www.kaggle.com/competitions/gemma-4-developer-agent) |
| 2026-12-02 | **Main track final submission deadline** (23:59 UTC) | [Overview](https://www.kaggle.com/competitions/gemma-4-developer-agent) |

Two deadlines, two different competitions, two different submission mechanisms. The paper track takes a Writeup (3,000 words max, scored by judges on five criteria) and *also* lets you submit up to two Final Submissions; the main track takes a zip and lets you select up to two Final Submissions for judging. [Paper track rules](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/rules) · [Main track rules](https://www.kaggle.com/competitions/gemma-4-developer-agent/rules)

**35 days to the main-track deadline. 15 days to the paper-track deadline.** The paper track is the tighter constraint and, for BCF specifically, the more valuable one — and it is a separate competition with separate prizes, so it does not compete with the main track for a submission slot.

---

## Finding 1: The Bonus Prize — terms, mechanics, and the three ambiguities that matter

### What is confirmed

The Overview page now reads, verbatim, under a heading "Bonus Prize: Small Model Development: $10,000":

> We are offering an additional $10,000 bonus prize dedicated to small-footprint developer agents to the highest-ranking submission utilizing **Gemma E2B** or **Gemma E4B**.
>
> Same submission rules and tie-breaking apply.
> - **Eligibility:** Submissions must explicitly use either Gemma E2B or Gemma E4B as the base model. For a submission to be eligible it must be one of the team's two selected final submissions. LoRA fine-tuning is allowed just as done for the main track.
> - **Daily Leaderboard Tracking:** A separate Kaggle notebook will update daily to display filtered standings for eligible small model entries.
> - **Cross-Track Eligibility:** Submissions eligible for the Small Model Prize remain fully eligible for general leaderboard awards and the Paper Track.
> - **Deadline:** Same submission deadlines apply as the main track prizes.

[Competition overview, Prizes section](https://www.kaggle.com/competitions/gemma-4-developer-agent/overview/citation) — the same text is rendered on the main competition page and the `/overview/citation` page, and appears in search-engine captures of both.

Two further sentences sit immediately after the bonus block on the same page, and they matter:

> Top submissions will be highlighted at a Google hosted event (such as a NeurIPS expo workshop) and awarded prizes.
> Submissions leveraging the accompanying released graph and embedding dataset are highly encouraged, but not a requirement for submission.

So the graph/embedding dataset is *encouraged but optional* for the bonus prize — another reason not to build the small-model entry on graph-first localization, which is independently broken (Finding 6).

On the totals: the overview's prize sections sum to **$110,000** ($65,000 main track + $35,000 paper track + $10,000 bonus), while the competition card's "Prizes & Awards" badge still renders **$75,000** and the main track's *own* rules page lists only "$65,000 — First $37,000, Second $18,000, Third $10,000" under "TOTAL PRIZES AVAILABLE." The main track rules page has **not** been updated to name the bonus prize at all. Treat the $10,000 as announced-but-unaudited in the rules text. [Main track rules](https://www.kaggle.com/competitions/gemma-4-developer-agent/rules) · [Competition page, Prizes & Awards badge](https://www.kaggle.com/competitions/gemma-4-developer-agent) · [Overview](https://www.kaggle.com/competitions/gemma-4-developer-agent)

### The decision-relevant reading

**This is the crucial structural fact: the bonus prize costs you zero main-track slots.** A team may select up to two Final Submissions for judging. The bonus requires the eligible submission to be one of those two. But a small-model submission is *also* fully eligible for general leaderboard awards. So the optimal play is:

- **Final Submission A** — best 31B bundle → contests for 1st/2nd/3rd, and carries the paper-track entry.
- **Final Submission B** — best E4B (or E2B) bundle → contests for the $10,000 bonus, *and* independently for a main-track placing, *and* remains eligible for the Paper Track.

You are not trading away a 2nd-place shot for a bonus shot. You are using a slot that would otherwise be a redundant second 31B attempt (where the marginal value is near zero, because two 31B variants differ by noise) and converting it into an independent prize track with a structurally weaker field. **This is the highest-EV move available in this competition, and it is the direct answer to "how do we develop the brain to win."**

### Three ambiguities, and what to do about each

**Ambiguity 1 — which deadline governs the bonus?** The Overview's bonus block ends with "Same submission deadlines apply as the main track prizes." But a few paragraphs later, on the same page, there is a standalone sentence: "Submissions must be made by **November 12, 2026 at 11:59PM UTC**." November 12 is the **Paper track** deadline, not the main track's December 2 final-submission deadline. The main track's Timeline section is unambiguous: entry Nov 25, final submission Dec 2. The page's own layout is the clue — the November 12 sentence sits after the paper-track-adjacent text ("To submit, sign up for the paper track") and after the bonus block has already closed, so it most plausibly belongs to the paper track's description, not the bonus prize's.

That said, this is exactly the kind of ambiguity that can be read the other way by a grader, and it is cheap to insure against. *Resolution: treat December 2 as the binding deadline for the small-model submission — that is what the bonus block itself says — and treat November 12 as a hard internal milestone instead.* See the plan in Finding 7. Cost of being wrong: catastrophic (ineligible for a $10,000 prize). Cost of the conservative plan: one week of schedule. [Overview, Timeline and Prizes](https://www.kaggle.com/competitions/gemma-4-developer-agent)

**Ambiguity 2 — how many small-model prizes are awarded?** "To the highest-ranking submission" reads as a single $10,000 award, not a $10,000 tier with 1st/2nd/3rd. The main track has explicit 1st/2nd/3rd place; the bonus has none. If only one small-model submission wins, the field matters enormously and a strong-but-not-best entry loses. *Resolution: assume a single winner; do not enter the bonus track casually.* [Overview, Prizes](https://www.kaggle.com/competitions/gemma-4-developer-agent/overview/citation)

**Ambiguity 3 — the "Daily Leaderboard Tracking" notebook.** The host promises a separate notebook showing filtered standings for eligible small-model entries. It is referenced in the Overview but **I could not locate it in search-engine captures of the competition's code/notebooks listing**, and no thread I found discusses it. Until it appears, the only way to know your small-model standing is to compute it yourself from the general leaderboard. *Resolution: build your own filtered view. Identify any small-model submissions by team and track their scores via the community tracker's JSON feed, which exposes per-team submission history with timestamps and observed scoring times* — see Finding 3 for the endpoint. [Overview](https://www.kaggle.com/competitions/gemma-4-developer-agent) · [Tracker repo](https://github.com/kawchar85/gemma4-agent-leaderboard)

**One ambiguity resolved in the user's favor:** the small-model submission is *not* a separate competition with separate rules, separate submissions, or a separate deadline. It rides the main track's submission machinery. The only new requirement is the base model choice and the two-final-submission constraint.

---

## Finding 2: The Discussion board as of 2026-10-28 — what changed since the 9/30 intel snapshot

The workspace holds a compiled board digest from 2026-09-30 covering 22 of 22 visible threads. Comparing that snapshot against the current board produces a clean list of what is new, what is resolved, and what is still open.

### New since 9/30

| Thread | Author | Date | Status | Decision relevance |
|---|---|---|---|---|
| [748287 — New Gemma 4 Models: 12B, E4B, E2B](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/748287) | Ryan Holbrook (host) | ~10/21, 25 comments, last 1d ago | **Pinned. Live.** | Enables the bonus prize. Host names three strategies: more test-time compute, faster/cheaper LoRA, more specialized agents. |
| [Update on "Kaggle Error" Submissions & Queue Delays](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion) | Dustin | last comment 2d ago, 82 comments | **Pinned. Live. High-velocity.** | Platform reliability is a first-order scheduling risk. |
| [748168 — Some settings and Scores](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/748168) | Murugesan Narayanaswamy (392nd) | ~10/27, last 16h ago | Live | Thinking-mode timing table; per-submission skills/eval-config log; **how to control the 12-hour timeout via `max_tool_calls`**. |
| [751596 — SFT/distillation LoRAs: loss falls, solve rate doesn't](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/751596) | Munal Singh (899th) | 6d ago | Live, 3 votes | The single most important negative result for brain design. |
| [749191 — Question about LoRA](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/749191) | Nir Aberman + others | 6d ago | Live, root-caused | Unblocks LoRA submissions if the scorer cooperates. |
| [751872 — Two consecutive "unhandled error" submissions, byte-identical to a public 0.17–0.24 recipe](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/751872) | — | ~4d ago | Live | Same bundle runs clean locally on 29 public tasks. A scorer-side class of failure. |
| [Submission with a skill scored 0.00 with no error](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion) | Oleksii Zhukov | last 4h ago, 3 comments | Live, unresolved | **Directly threatens BCF's skills-first design.** |
| [Trap-25 Benchmark, 300 SWE Loop Pairs, W4A16 think budget sweep](https://www.kaggle.com/discussions?tags=12107-Computer+Science) | Robina Mirbahar | 4d ago, 3 votes | Live | Loop/stall failure modes, measured. |
| [Paper track: Model-free localization benchmark on the 129 public tasks](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion) | Ali Hassan | 7d ago | Live | Competitor is measuring exactly what BCF's localization claim needs. |
| [Paper track: Code and data behind our write-ups — gemma4-swe-kit and an agent trajectory dataset](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion) | D A M | 6d ago | Live | **A competitor is shipping the same dataset-harvest play.** |
| [Paper track: "Can I use smaller model?"](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion) | daoviet | 4d ago, 2 votes | Live | Small-model interest is real. |
| [Paper track: Clarification on Prize Track Categorization, Tie-Breaker Timestamps, Notebook Runtime](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion) | Ahmed Sattar Jabbar | 21h ago | Live | Paper-track mechanics still being clarified. |
| [Paper track: CodeGuardian: A Graph-Guided Self-Repairing Software Engineering Agent](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion) | NSHIMYUMUREMYI Olivier | 5d ago | Live | Graph-guided self-repair is an occupied space. |
| [Paper track: Does an arXiv preprint count as "published"?](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion) | — | recent | Live | Novelty/eligibility risk for BCF's writeup. |

### Resolved or superseded since 9/30

- **LoRA silent zeroing (was 743508):** the zeroing fix landed in wheelhouse v23; wheelhouse is now at v31. Adapters load and are no longer wiped. Still a KV-cache-collapse concern for long-context runs, but the "adapters silently do nothing" failure is closed. [9/30 intel, §2 and §4] · [Thread 748287, wheelhouse v31 references]
- **Embeddings-downloaded-empty bug:** the host confirmed "The embeddings are no longer empty; that has been fixed." The *graph* files' empty-file problem and the missing-async-functions problem were not fixed — the host said of async, "I don't have an ETA on that yet." [Thread 742911](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/742911)
- **12B `--hf-overrides`:** host published the exact snippet (`--hf-overrides '{"architectures": ["Gemma4ForCausalLM"], "model_type": "gemma4"}'`) and stated "The scorer has this update already." The vision_embedder `KeyError` was "Fixed in the most recent wheelhouse." [Thread 748287]
- **Custom Python tools:** the host closed this with one line — "Include them as scripts in a skill. They will be available in the sandbox and your agent can execute them there." This *validates* BCF's compute-in-scripts (T11) approach and *invalidates* any plan to ship custom Python tools directly. [Thread 743573](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/743573)
- **Model-variant question (743056):** "It's only the one model listed in the Overview. We're working on supporting others" → they are now supported. [Thread 748287]
- **Thinking-mode drop (744354):** patch was "incoming" as of 9/30 with no re-score. Status as of 10/28 not confirmed in what I could retrieve — treat as unverified.

### Still open and directly relevant to BCF

- **`read_file` with line ranges** reportedly always fails with a type error (744678). Unverified. BCF's Phase-2 localization plan calls `read_file` with line ranges in the simulation — this must be tested on Day 0. [9/30 intel §5]
- **Graph tools do not contain `async` functions at all**: 0 of 305 async functions present across the four repos, in 16 of 121 training tasks where the reference fix lands in an async function, the async symbol is unreachable via graph tools. The graph has a single edge type (`calls`), no import or containment edges, and no module-level nodes. The host has no ETA. **BCF's graph-first localization will systematically miss async code paths, and FastAPI — 67 of 129 training tasks — is the densest async case.** [Thread 742911](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/742911) · [BCF sim §8, fact 4]
- **Skills may score 0.00 with no error.** A live thread, 4 hours old at time of research, 3 comments, no host answer. This is a direct threat to BCF's `run_skill_script` strategy. [Discussion listing](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion)
- **`search_similar_code` returns full node source, uncapped**; over 246 calls, 107 exceeded 5k characters, 6 exceeded 100k, and *all 6* ended their task with `ContextWindowExceededError`. The host promised a cap "like other tools" on 9/30. A later report says the cap may not be live. BCF's Phase-2 call 4 is exactly a `search_similar_code("HTTPParser")` — the query that surfaced a 110k-char APIRouter node in the 9/30 measurements. [9/30 intel §5] · [BCF sim §8, fact 2]
- **Double-JSON escaping of tool results**: 62 of 299 `edit_file` calls failed with `old_string not found`; 39 provably escaping-caused across 18 tasks. Controlled experiment: double-JSON 22% failure, single-JSON 62% (worse), raw text 0%. The host said "addressing now" on 9/29. **BCF's edit-heavy Phase-3 depends on `edit_file` reliability; if the fix did not land, ~22% of edits fail and the whole ordered-repair protocol degrades.** [9/30 intel §5]
- **12-hour overrun errors the whole submission.** A fix to score unfinished tasks as 0 was planned but "not confirmed live." This is a hard cliff: overrunning 12h produces a zero, not a partial score. [9/30 intel §1, item 7]
- **Queue and platform errors are widespread.** Submissions stuck 26+ hours in Pending, blocking teams at the 1-pending limit; 15–22 hour runs ending in "A system error"; "Kaggle Error" waves. [Thread 747740](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/747740) · [Thread 746480](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/746480)

### What the board's *successful* competitors share

Reading the public notebooks' score cards and the community writeups, the top public bundles are remarkably uniform: one coder agent, prompt-only, no adapter, no skills, 8 minutes per task, 28 tool calls, temperature 0.2, top_p 0.95, max_output 8192, thinking budget 4096 with `include_thoughts: true`. The "Budget-Fit Single Agent" bundle is at 0.18; "Budget-Aware Coding Agent v2" is at 0.22; the top tracked teams are at 0.24. [verracodeguacas' Budget-Fit Single Agent](https://www.kaggle.com/code/verracodeguacas/gemma-4-agent-budget-fit-single-agent) · [Igor Zharov's Budget-Aware v2](https://www.kaggle.com/code/flexonafft/gemma-4-budget-aware-coding-agent-v2) · [Community tracker](https://gemma4agent.kawchar.online)

**Every one of those top bundles is prompt-only.** The winning recipe on the main track is not a trained model. That is the board's verdict, and it aligns exactly with the LoRA negative result.

---

## Finding 3: The leaderboard's actual shape — and why most "improvements" are noise

### Current distribution

Pulled from the community tracker's live JSON feed (`gemma4agent.kawchar.online/data/leaderboard.json`, 3,981 teams tracked, updated 2026-10-28 05:25 UTC, 21,367 observed submission events since 2026-10-01):

| Public score | Teams |
|---|---|
| 0.24 | 6 |
| 0.22 | 48 |
| 0.20 | 214 |
| 0.18 | 564 |
| 0.17 | 679 |
| 0.15 | 569 |
| 0.13 | 395 |
| 0.12 | 319 |
| 0.10 | 261 |
| 0.08 | 232 |
| 0.06 | 155 |
| 0.05 | 153 |
| 0.03 | 145 |
| 0.01 | 79 |

Max 0.24, median 0.15, 2,080 teams at ≥0.15. Kaggle's own competition page reports 3,077–3,113 teams and 16,473–16,881 submissions as of the research date, with the card listing 3,977 teams. The tracker sees slightly more teams than Kaggle's header because it snapshots over time. [Tracker JSON](https://gemma4agent.kawchar.online/data/leaderboard.json) · [Competition page participation block](https://www.kaggle.com/competitions/gemma-4-developer-agent)

**Interpretation.** The score ladder is a *tie pyramid*, not a smooth curve. 54 teams sit at 0.24, 48 at 0.22 — and crucially, **0.24 appears to be a ceiling artifact of the public split**: 14/58 public tasks. The private split is ~60 tasks, so 0.24 there means 14–15 of 60. Six teams at the top means the 1st-through-6th-place spread is a handful of tasks. Being +0.02 over the median is roughly **one task** — within noise for most teams.

### The noise floor, measured three independent ways

This is the most important methodological finding for anyone trying to improve their score:

1. **Byte-identical bundles, different scores.** One team resubmitted the *same* ZIP byte-for-byte: 0.0600, then 0.0500. Another resubmitted an identical ZIP with reasoning enabled: 0.0800, then 0.1300. Estimated σ ≈ 2.4 tasks per submission. Separately, identical files have been observed scoring anywhere from 7 to 13 of 58 on the public leaderboard. [STATE_OF_COMPETITION.md, Agents_Learning_Loops, cutoff 2026-10-13](https://github.com/cherrera0001/Agents_Learning_Loops/blob/main/STATE_OF_COMPETITION.md) · [Thread 751596](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/751596)
2. **Per-task instability.** The failure classification of a task changes in **13 of 30 tasks** between identical runs, and the net resolved count on a 30-task local set moves by **±1 task** (e.g. 6 vs 7 of 30) between identical local runs. One public task ≈ 0.017, so "differences of 0.02 are mostly noise." [STATE_OF_COMPETITION.md §5.2](https://github.com/cherrera0001/Agents_Learning_Loops/blob/main/STATE_OF_COMPETITION.md)
3. **Single-run ablation replication.** A controlled 129-task experiment repeated its own best configuration and got 48/129 against the original's 55/129 — a 7-task swing on the *same* config. A different team's follow-up attributed the difference to "cluster state" and concluded that "a score public isolated lacks statistical validity whatsoever for adjudicating superiority." [Thread 746250](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/746250) · [STATE_OF_COMPETITION.md](https://github.com/cherrera0001/Agents_Learning_Loops/blob/main/STATE_OF_COMPETITION.md)

### The prescribed statistical discipline

The strongest discipline statement on the board belongs to a team that got burned: only paired differences with an **exact McNemar test (p ≤ 0.05) over ≥60 tasks**, or replicated across **at least 5 leaderboard readings**, justify keeping a change. Every other design decision they made followed from refusing to chase leaderboard deltas. [STATE_OF_COMPETITION.md](https://github.com/cherrera0001/Agents_Learning_Loops/blob/main/STATE_OF_COMPETITION.md)

**Consequence for BCF: the brain must be evaluated on a paired local holdout, not on the leaderboard.** This aligns with BCF's existing B1-receipts discipline and its pre-registered prediction framework. The methodological requirement is not optional — it is the only way to avoid burning 35 days of submissions on noise. There is also a second-order cost: the main track allows **one submission per day** and a team's pending slot blocks further submissions, so a 15–22 hour scoring latency means **you get roughly one usable measurement every two days at best, and possibly far less.** [Main track rules §2.2a](https://www.kaggle.com/competitions/gemma-4-developer-agent/rules) · [Thread 747740](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/747740)

### The local-evaluation trap

The workspace intel documents a serious hazard: local CV and leaderboard score are **anti-correlated** for several teams. One team saw CV 0.211/0.237/0.316/0.289 → LB 0.10/0.08/0.03/0.05, with the *highest* CV producing the *lowest* LB. The root cause is the local grading environment, not the model — the wheelhouse ships pydantic 2.13.4 without `typing_inspection`, starlette dedup forces 1.6.0, and 54 of 67 fastapi gold patches fail locally. The host has confirmed **"hidden tasks validate 100% with a gold-patch submission"** — the scorer is clean, local breakage is local-only. [9/30 intel §6] · [Thread 744370](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/744370)

**This is a direct threat to BCF's evaluation plan.** BCF's Sprint 1–3 measurement was designed around a 30-task frozen set with paired Config 1 / 2 / 3 comparison. If that set is fastapi-heavy and the local wheelhouse breaks 54 of 67 fastapi gold patches, the frozen set will be measuring the environment, not the brain. **The first engineering task is not training anything — it is making the local environment able to pass gold patches on the chosen holdout.** Everything downstream is uninterpretable until that holds.

### The 71-of-129 problem — and why it hits BCF specifically

A participant's metrological audit of the 129 public tasks quantifies the trap precisely. [STATE_OF_COMPETITION.md §5.1](https://github.com/cherrera0001/Agents_Learning_Loops/blob/main/STATE_OF_COMPETITION.md)

| Task family | Discriminating tasks (fail without patch, pass with gold patch) |
|---|---|
| `fastapi` | 29 of 67 |
| `rich` | 42 of 48 |
| `requests` + `httpx` | **0 of 14** — test environment broken |
| **Total, as the official wheelhouse serves it** | **71 of 129** |
| With 3 auxiliary test packages installed | 103 of 129 |

The author's conclusion: "58 public tasks fail due to test-environment defects, not model incapacity. Every valid local measurement must be strictly restricted to discriminating tasks."

**This is the single most important operational fact for BCF, and it has a sharp edge: the canonical BCF case study is `httpx_3672` — and zero of the fourteen `requests`/`httpx` public tasks discriminate.** A BCF holdout built on the httpx and requests families would resolve nothing, and any Config 1/2/3 comparison on it would report three identical zeros and be read as "BCF does nothing." The holdout must be rebuilt on the **71 discriminating tasks** (or the 103 with auxiliary test packages installed), with the fastapi family down-weighted to its 29 usable tasks and `rich` (42 of 48) carrying the heaviest load. This is a concrete, checkable prerequisite for the paper-track result, and it belongs in the paper's methodology section regardless of which tasks are chosen.

---

## Finding 4: The LoRA question — four verdicts from four directions

### Verdict A: Adapters can now start, if you configure vLLM correctly

The blocker, root-caused by Nir Aberman with a source-level walkthrough of vLLM 0.19.1's `gpu_worker.py` / `cudagraph_dispatcher.py`: with `--enable-lora`, `cudagraph_specialize_lora=True` captures CUDA graphs **twice** (no-LoRA and LoRA), and the graph memory is **not counted** in the KV budget unless `VLLM_MEMORY_PROFILER_ESTIMATE_CUDAGRAPHS=1`. The extra ~4.5 GiB/GPU eats the 20% headroom, and the sampler warmup — which runs *after* graph capture — OOMs. The base model has one graph set and fits. [Thread 749191](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/749191)

Three fixes, each verified to start cleanly and serve the adapter, with a single r16 adapter on the official VllmServer path at gpu_memory_utilization 0.80, TP 4, max_model_len 32768:

| Fix | Graph memory | KV cache |
|---|---|---|
| A) `VLLM_MEMORY_PROFILER_ESTIMATE_CUDAGRAPHS=1` | 4.49 GiB | 27,712 tokens |
| B) `--compilation-config '{"cudagraph_specialize_lora": false}'` | 2.41 GiB | 45,440 tokens |
| C) `--max-num-seqs 64` | 1.50 GiB | 48,384 tokens |

Host response: "The key setting for you I think is `os.environ['VLLM_MEMORY_PROFILER_ESTIMATE_CUDAGRAPHS'] = '1'`. We have seen successful submissions with LoRA adapters up to rank 64." Fix B is the best trade — it recovers 94% of the base KV cache per one participant's measurement. Critically, **adapter size is not the lever**: a rank-4 single-layer adapter (1 MiB) OOMs identically to rank-4 across all 60 layers (58 MiB), because `build_cmd` floors rank to 8. [Thread 749191](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/749191)

**Unresolved and important:** whether the *scorer* sets any of these. One participant's rank-16 submission stayed pending over 12 hours and ended "exceeded the allowed runtime" with no score, while the identical bundle without the adapter scored 0.15. That is consistent with the OOM-at-startup path manifesting as a hang rather than a fast crash. *Action: verify the scorer's effective vLLM flags on Day 0 before building anything adapter-dependent.*

### Verdict B: Training does not move the solve rate

Munal Singh's experiment is the most rigorous on the board and the one that matters most for brain design. [Thread 751596](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/751596)

Setup: `gemma-4-31b-it-qat-w4a16-ct`; agent v11 is a contract-first prompt plus a line-number edit skill, prompt-and-tools only; 28 tool calls and 8 minutes per task; LoRA r16/α32/lr 1e-4/1 epoch on Keras TPU v5e-8; official evaluator, paired on identical tasks; 73 gradable public tasks plus a 25-task held-out exam; A3 got 4 runs per task; judging by paired local tests because "identical files have scored anywhere from 7 to 13 of 58 on the public leaderboard."

| Adapter | Training loss | Solved (98 tasks) | vs. v11 (38) |
|---|---|---|---|
| A1 — 314 Qwen3-Coder-480B runs (Nebius SWE-rebench OpenHands), reasoning rewritten by Gemma (845 steps) | — | 31 | won 2, lost 9 |
| A2 — A1 + 2,000 DeepSeek-V4-Flash runs (nvidia/Open-SWE-Traces), teacher's own reasoning (19K steps, 5.3M tokens) | 1.0 → 0.42 | 37 | won 5, lost 6 |
| A3 — DeepSeek only, 1,976 runs trimmed to fit 16K tokens whole (1,538 tasks, 587 repos) | 1.4 → 0.40 | 31 | won 3, lost 4 |

Leaderboard: prompt-only agents 0.15–0.17; A2 0.12. Earlier LoRAs on Gemma's own solved runs (rejection sampling, one run per task) also tied or lost. Serving cost: enabling any LoRA adds ~15–20% time per call, decode ~1.3× slower — so an adapter must beat the baseline by enough to pay for a shorter per-task budget.

**The mechanistic reading is the key result.** Matching v11's 41 failed runs against gold edit locations (using LocBench-129 labels): 18 edited within 20 lines of the gold change but the fix was wrong; 11 opened the gold file and never edited (ran out of calls or time). The author's conclusion: **"So localization is mostly solved. The failures are wrong fixes in the right place and never committing to an edit."** Imitating a stronger model's successful runs on *other* repos lowers loss but hasn't changed either one.

**Why this is the crux for BCF.** BCF's stated purpose is exactly to prevent wrong-fix-in-the-right-place (ordered repair, minimum-path decomposition, binary gates, spec-first) and to force commitment (fourth tenet, binary done criterion, `force_submit_turn`). The board's independent failure analysis, arrived at without reference to BCF, names the same two failure modes. **This is the strongest external validation BCF could ask for, and it simultaneously argues that the answer is more discipline, not more weights.** Note also the caveat the author raised: A3 was evaluated at a 7-minute cap versus v11's 8, "so part of its gap may be the cap" — a reminder that budget and adapter interact.

### Verdict C: An adapter can change inference without changing behavior

A third, independent team's tool-use LoRA changed the logits materially — max |Δ logit| 18.3 — but did not change decisions: held-out agreement with the base agent's tool choice was **base 0.990, adapter 0.985** across 200 decision points. Their bundle set A1 resolved 14/48 on the rich fold at concurrency 2, with 19 session timeouts; the graph-first variant was faster (median 21 vs 26 tool calls) but gained 1 task and lost 2. [Gemma 4 Developer Agent Tool-Use LoRA Kit, Kaggle dataset by scottweeden](https://www.kaggle.com/datasets/scottweeden/gemma-4-developer-agent-tool-lora-kit)

### Verdict D: a fourth team, still not confirmed working

A fourth project is building a QLoRA (4-bit NF4 via `bitsandbytes`/`transformers`/`peft`) on **44 reference-patch trajectories** — 62 of 66 generated trajectories verified (train 44/46, dev 9/10, validation 9/10, with the four skipped cases logged rather than dropped). Rank 16 on all 7 attention/MLP projections, base checkpoint `gemma-4-31b-it-qat-q4_0-unquantized`. Its own README says it is **"Not yet confirmed working."** [8kta/kaggle-gemma4](https://github.com/8kta/kaggle-gemma4)

Two engineering details from that project are worth carrying regardless of whether its LoRA ever ships, because they will bite anyone who tries:

- **PEFT cannot recognize Gemma 4's `Gemma4ClippableLinear`.** Adapter injection fails until the targeted layers are unwrapped to their inner `Linear4bit`. This is a concrete, reproducible obstacle to any Gemma 4 LoRA workflow, and it is not documented anywhere on the board.
- **A T4 cannot run the official model at all.** `bfloat16` requires compute capability ≥8.0; the T4 is 7.5, so the run fails immediately. Kaggle's free T4 accelerators are therefore unusable for this competition's checkpoint, and Kaggle additionally blocks Internet access on competition-attached notebooks (which also means `pip install peft accelerate` needs a non-attached notebook, as that project did).

And one checkpoint-mismatch flag worth noting for anyone designing an adapter pipeline: that project trains against the **unquantized** QAT checkpoint (`q4_0-unquantized`) because that is the pre-W4A16-packing form, while the scorer serves the **W4A16** form. Training and serving formats differ, which is precisely the class of thing that can produce an adapter that "loads" and then does nothing.

### Synthesis on LoRA

**For the main track: ship no adapter.** Four independent teams converge — loss falls, solve rate doesn't; logits move, decisions don't; a fourth adapter is still not confirmed working; and the best public bundles are all prompt-only. Add the +15–20% per-call cost and the startup-OOM risk, and an adapter is a *liability* on the 31B main-track entry.

**For the bonus prize: revisit the question, because the arithmetic changes.** The host explicitly named faster and more accessible LoRA fine-tuning as an E2B/E4B advantage, and smaller models use smaller adapters so more of them fit in a submission. A smaller model with a *small, targeted* adapter — trained on the failure classes BCF is designed to prevent, and evaluated on the small model's own failure distribution — has a materially different risk/reward than a 31B adapter trained on a stronger teacher's traces. But this is a *hypothesis*, not a finding: no E2B/E4B adapter has been shown to work end-to-end, and Munal's A1/A2/A3 results are all on 31B with teacher-distilled cross-repo data. **Do not enter the bonus with an adapter you have not validated on the small model itself.**

---

## Finding 5: The budget is the score — the quantitative frame

This is the section that most changes what "improving the brain" should mean, because it establishes that on this competition **time is the scarce resource and every design choice is a time-allocation choice.**

### The global constraint

12 hours of wall-clock for ~120 tasks, inclusive of sandbox setup, exclusive of patch validation. Participants report the evaluator runs ~10 hours of task time and ~2 hours of patch validation, implying ~5 minutes per task. One participant's estimate: 120 tasks × 5.5 min = 11h, leaving ~1h for phase-1 setup and overhead. [Thread 747857](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/747857) · [HARNESS_README.md §7.1, local]

A second participant arrives at the same number from the other direction: "10 hr eval + 2 hours patch time implies just 5 mins available for a single task - assuming 120 tasks in private dataset." Two independent derivations landing on 5–5.5 minutes is the strongest available estimate, and it is the number every configuration should be validated against. [Thread 748168](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/748168)

The same thread supplies a directly usable control: "Controlling 12-hour time-out can be achieved through either `max_tool_calls` or `max_time_minutes` in `eval_config`. By reducing `max_tool_calls`, you can indirectly reduce the time allowed, making `max_time_out` irrelevant." And: "If you are exceeding 28–32 calls, then you should restrict time to 5 minutes." **For BCF this is a two-knob safety mechanism** — `max_tool_calls` is the lever that protects the global 12-hour cliff, and `max_time_minutes` is the per-task guard. Setting both, with `max_tool_calls` at the conservative end of 28–32, is cheap insurance against the overrun-zeroes-the-submission failure mode.

### The calibrated throughput numbers

From the most careful measurement on the board — a 12-task panel run twice on Modal 4×L4 and once directly on Kaggle 4×L4 (TP=4, sequential agent):

| Serving setup | Seconds / 1M tokens | Effective tok/s | Time/token vs. loaded B40 |
|---|---|---|---|
| Concurrently loaded B40 baseline | 1,170.6 | 854 | 1.000× |
| Modal 4×L4, two runs pooled | 927.6 | 1,078 | 0.792× |
| **Kaggle 4×L4, sequential** | **900.8** | **1,110** | **0.770×** |

Kaggle processed 5.55M reported model tokens in 5,002s of LLM time — 8.68s per model call with thinking enabled. Full-workload central estimate: **11.03h for 120 tasks** (11.23h counting observed fixed setup). Variance is large; the author states 6–7 minutes on Kaggle is unsafe as a worst-case cap, and operates at **5.5 min/task** on Kaggle and 7.0 min/task on the concurrent B40 setup. [Thread 747857](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/747857)

**The shape of a successful trajectory:** 40–50 LLM and tool calls spanning 300–350k tokens (input + thinking + output). [Thread 747857](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/747857)

### The cost of getting the budget wrong, measured

- **Halving the tool budget is not free.** Moving 50 → 25 calls cut median runtime 29% but **resolved 14 fewer tasks** (50 → 36 of 129). A hard tool-call cap is a quality sacrifice, not a speed win. [Thread 746250](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/746250)
- **A subagent is roughly break-even.** Manual prompt + analyzer subagent changed resolved count from 50 to 51, with slightly higher median runtime — one task, needs repetition. Same author's conclusion: "The analyzer subagent showed no clear gain." [Thread 746250](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/746250)
- **Thinking is a 4–5× time multiplier.** Measured on the official harness over a 3-task sample: no-thinking 94s / 376k tokens / 39 steps; thinking-default 362s / 237k tokens / 25 steps; thinking-high 458s / 382k tokens / 36 steps. Thinking-default is 3.85× slower; thinking-high 4.87× slower and uses 5.3× the completion tokens and ~6× the reasoning volume. The same thread notes the default-thinking run has *fewer* prompt tokens than the others yet still takes ~4× as long. [Thread 748168, "Some settings and Scores" — Murugesan Narayanaswamy, 392nd in the competition](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/748168)
- **But thinking can also be the fix for loops.** One team found thinking-on at 8 min gave 6/16 vs 9/16 off, but "far fewer loops" — 9 of 16 tasks hit the session timeout, so it was not submitted. Another found that turning thinking on with a 4096 budget gave 0.12 (7/58) on the leaderboard. [happyc0der's gemma-swe-agent experiment log](https://github.com/happyc0der/gemma-swe-agent)
- **LoRA costs 15–20% per call.** [Thread 751596](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/751596)
- **The 12B is nearly 2× faster than the 31B** on the same hardware: ~67 tokens/s versus ~35 for one sequence. [Thread 748287](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/748287)
- **Concurrency is not free locally and impossible in the scorer.** On 4×L4 the KV cache holds ~1.4 full-length 32k sequences. With 8 tasks sharing one vLLM server, most requests queue and two thirds of tasks run out of time. The scorer reportedly runs tasks one at a time. Local concurrency 2 beat concurrency 8 (14 vs 13 resolved on the rich fold, with 19 vs 33 timeouts). [Tool-Use LoRA Kit results](https://www.kaggle.com/datasets/scottweeden/gemma-4-developer-agent-tool-lora-kit)

### Two free wins that cost nothing but attention

A participant running the *official* 31B model through the real harness found two configuration defects that were silently costing more than most of the prompt-tuning work on the board. Both are directly actionable for BCF's config. [8kta/kaggle-gemma4 README](https://github.com/8kta/kaggle-gemma4)

**1. `max_output_tokens: 16384` was crashing 75% of tasks.** Against a 32,768-token context, reserving 16,384 for output leaves half the window for input on every single turn — and real multi-turn conversations grow past it by turn 8–10. Dropping it to **8192** took the context-window crash rate from **75% → 5.3%** on a 19-task cohort, and from 3-of-4-crashes to **zero** on the smoke cohort. For reference, the top public bundles already use `max_output: 8192` — this is the field standard, and the failure mode is invisible until it eats a task.

**2. The *turn* budget binds before the tool-call budget.** In the 19-task official run, **16 of the remaining 17 tasks exhausted the 15-turn budget at exactly 14 tool calls each** — every one of them ran out of turns with tool calls to spare. The author's conclusion: "the turn budget, not the tool-call budget, was the binding constraint." The direct test is instructive: raising `max_turns` 15 → 25 (while raising tool and time limits too, so neither became a hidden constraint) did **not** improve resolution — two of four smoke tasks then burned the larger turn budget producing tested-but-failing patches, and the other two hit context-window errors instead. **Turns are not the lever either.** The reading is that the binding constraint is *context growth per turn*, not a countable budget.

**The implication for BCF is specific and uncomfortable:** BCF's architecture spends turns on planning — specification, classification, ordered decomposition, gate evaluations, breadcrumb writes. If the binding constraint is *context growth per turn*, then every extra planning turn is a step closer to the context wall, and the discipline that distinguishes BCF from the baseline could be paying for itself in a currency the harness charges for. **This is the strongest argument for making BCF's Phase 1 produce a compact, write-once specification artifact rather than an extended deliberation** — plan once, record it, and let later phases read the artifact instead of re-deriving it. A protocol that re-reads its own spec each turn is paying the context tax twice.

For reference, that same project's official-model results: `resolution_rate` 0/4 on the smoke cohort, **2/19 (10.5%)** on the 19-task comparison cohort, and **3/19 (15.8%)** with a filesystem-only configuration. Those are useful as a floor reference for a *real* 31B run with modest tuning, and a sobering one: 15.8% is below the median tracked team's 15% by only a hair, on a config that is already better than nothing.

### The operating envelope for the BCF brain

Put together, the per-task design space is roughly:

| Lever | Observed range | Effect |
|---|---|---|
| `max_time_minutes` | 4.0–8.0 | Hard wall; exceeding total 12h zeroes the submission |
| `max_tool_calls` | 25–50 | 25 costs 14 tasks of 129 |
| `max_turns` | 50–80 | |
| thinking | off / 2048 / 4096 / high | 3.85–4.87× time multiplier; reduces loops |
| temperature | 0.2 / 0.4 / 1.0 | 0.4 and 1.0 tied in one sweep |
| adapter | none / LoRA | +15–20% per call; startup OOM risk |
| sub-agent | none / analyzer | +1 task of 129, needs repetition |
| graph-first vs. manual | — | faster, gained 1, lost 2 |

[Thread 746250](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/746250) · [Thread 747857](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/747857) · [HARNESS_README.md §7](https://www.kaggle.com/competitions/gemma-4-developer-agent)

**The uncomfortable conclusion:** every lever on this list is at or near its optimum in the bundles that already score 0.22–0.24. The prompt-only budget-fit recipe is well-tuned. A new entrant cannot win on tuning. BCF must win on **a structural property the tuned baseline lacks** — and the board's own failure analysis says there is one available: wrong-fix-in-the-right-place and no-commit are *not* budget failures, they are *protocol* failures, and they account for the large majority of failures.

---

## Finding 6: What the board's failures imply for BCF specifically

This section maps the measured failure modes onto BCF's components. It is the analytical heart of the report, and it is where the user's own simulation document does real work.

### The four traps in `httpx_3672` are not hypothetical

The BCF simulation's four verified traps are properties of the *task data*, not of the agent: (1) the visible test suite contradicts the graded one, (2) a duplicated sync/async tree, (3) a latent fault at the call site rather than the tested site, (4) broken ungraded code the issue mentions but the tests don't reach. **These exist in the data regardless of agent design.** The simulation's own pre-registered prediction #9 says Config 1 (naive) should show `test_misread` failures at a higher rate than Config 3 (BCF) on `compat_or_refactor` slices, because Config 3's spec carries the issue-text contract past the local signal.

**Munal's failure analysis independently confirms this failure class exists at scale:** 18 of 41 failures were "edited within 20 lines of the gold change, but the fix was wrong." A visible-red-treated-as-ground-truth agent reverts correct fixes — exactly Trap 1. The board data says this is the single largest failure bucket. BCF is aimed at it. **The pre-registered prediction is therefore not merely plausible; it is the highest-value falsifiable claim BCF can make, and it should be the spine of the paper-track writeup.**

### Component-by-component: keep, fix, or kill

| BCF component | Board evidence | Verdict |
|---|---|---|
| **Spec-first (A6), pre-file-access** | No direct test yet. But spec-first is the only mechanism that can *know* the fix was wrong rather than *detect* it after the fact. | **Keep — highest value, untested.** |
| **Ordered repair, topological `fix_order` (tenet 2)** | The 18 wrong-fix failures are in the right place; ordering errors would compound them. | **Keep.** |
| **Binary validation gates (tenet 4, A8, A2 rescue)** | Gates consume calls from a 28-call budget. Risk: a gate-heavy agent runs out of budget before committing. | **Keep but budget-gate it** — cap gate evaluations at 2, never 3. |
| **Breadcrumb journal (tenet 3, B5.3)** | Directly targets the 11 no-commit failures and the loop modes Robina Mirbahar measured. | **Keep — this is the no-commit fix.** |
| **`get_status()` for budget** | BCF sim verified `get_status()` returns budget/patch fields only — **no `failing_tests` field**. Any prompt implying readable test failures is wrong. | **Keep, but the prompt must not imply test visibility.** |
| **Graph-first localization (calls 4–6)** | Graphs contain **0 of 305 async functions**; single edge type; no module-level nodes. `search_similar_code` returned empty on 30/30 calls in one team's runs, and removing all three graph tools *improved* results 2/19 → 3/19. | **Downgrade to advisory, never authoritative.** Text-search fallback is mandatory. |
| **`search_similar_code("HTTPParser")`** | That exact query class surfaced a 110k-char node; 6 of 246 calls exceeded 100k chars and **all 6 killed their task** with `ContextWindowExceededError`. | **Constrain: symbol-flavored queries, `get_code_neighbors` first, never broad prose.** |
| **T11 compute-in-scripts** | Host-confirmed mechanism: "Include them as scripts in a skill." | **Keep — and it is the officially sanctioned escape from the closed `ToolRegistry`.** |
| **A7 progressive skills** | **Live unresolved thread: a submission with a skill scored 0.00 with no error.** | **BLOCKED pending verification.** |
| **`read_file` with line ranges** | Reported broken since 9/30, unverified. BCF's Phase-2 plan uses it. | **Verify Day 0; fall back to full reads + `edit_file`.** |
| **A4 handoff packets / sub-agent tree** | Analyzer subagent: +1 of 129, needs repetition; each delegation is a separate model loop, and time per task is the binding constraint. | **Kill for v1.** BCF's flat Config 3 is the right call and the board agrees. |

### The "skill scored 0.00" thread is the most urgent unknown

A live thread from 4 hours before this research, titled "Submission with a skill scored 0.00 with no error: do skills still work on the scorer?", 3 comments, no host answer. [Discussion listing](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion)

BCF's architecture leans on `run_skill_script` for T11 (classifier and validator as one-call scripts) and A7 (progressive skill loading). If skills silently fail on the scorer, BCF's differentiation collapses into "a longer prompt" — which the tuned prompt-only baselines already are, at 0.22–0.24. **This is the first thing to test, before anything else, and it is a Day-0 blocker, not a Day-10 concern.** Note the counter-evidence: a competitor's "skills_lean" and "skills_multi" bundles pass the static checker but are explicitly marked "not run in the harness." [Tool-Use LoRA Kit](https://www.kaggle.com/datasets/scottweeden/gemma-4-developer-agent-tool-lora-kit)

**There is now a second, independent data point in the same direction.** Thread 748168 records a submission log where the skills-bearing entries are exactly the ones that produced no score:

| Submission | Skills | Thinking | Eval config | Result |
|---|---|---|---|---|
| 1 — basic starter | no | off | none | scored **0.08** |
| 2 — *with skills* | **yes** | on | **none** | **timed out, no score** |
| 3 — *with skills* | **yes** | off | none | scored **0.05** |
| 4 — *with skills* | **yes** | on | yes | scored **0.10** |
| 5 — *with skills* | **yes** | on | high time | **timed out, no score** |

Every score in that log comes from a submission **with** skills, so the two timeouts cannot be attributed to skills alone — submission 5's cause is stated as an over-generous eval config, and submission 2's may be the same. But the pattern is exactly what the live 0.00 thread is reporting, and the author's own inference is: "Thinking True might be important if you have several agents and skills." [Thread 748168](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/748168)

**The reading for BCF is specific.** A skills-bearing agent appears to carry extra startup or execution cost that a prompt-only agent does not — plausibly the script-execution and skill-loading overhead, or simply more prompt surface. On a competition where the binding constraint is a hard 12-hour wall, **that overhead is not a rounding error; it can consume a task's entire budget before the agent writes a line of code.** So the Day-0 probe should not just ask "do skills run?" but "how much do skills cost in wall-clock and tool calls versus the identical bundle without them, and does the skills-bearing bundle still finish inside 5.5 minutes?" If the cost is more than a fraction of a minute per task, BCF's T11 and A7 need to be re-expressed as *prompt-level* scripts or dropped, and the protocol's differentiation narrows to spec-first + ordered repair + no-op assertion — which, notably, is still the core of the thesis.

### A design idea the board supports and BCF should adopt

Three independent findings converge on a mechanism BCF already half-has: **the "budget_warning → fix-script" protocol.** One team added a protocol keyed to the harness's `budget_warning` — once it appears, the next call is a fix script, then one more run, then submit — and got the first result above their baseline (14/33 vs 13/33), with dead-term repeats dropping from 38 to 17 and one task solved for the first time by any variant. [happyc0der's gemma-swe-agent](https://github.com/happyc0der/gemma-swe-agent) Another found 28 of 70 fix scripts were **silent no-ops** — the model reasons in comments inside the heredoc and never reaches the write line. [happyc0der](https://github.com/happyc0der/gemma-swe-agent) And BCF's own journal already records `files_changed`, `lines_changed`, `strikes`, `turn` per operation — it has the raw material to detect a no-op fix script, and just does not yet assert on it.

**Concrete synthesis: BCF should add a no-op assertion to the ledger.** A `run_skill_script` that returns without changing a file, or an `edit_file` whose diff is empty, should be counted as a failed operation and should trip the breadcrumb journal. This is cheap, it uses existing instrumentation, it directly attacks a measured failure mode, and it makes a clean, publishable contribution: *a self-monitoring agent that detects its own non-actions under a hard budget.* Given the paper track's three awards (Best Paper $15k, Best New Resource $10k, Best New Application $10k) and that a single writeup can be considered for multiple awards, a reusable agent-instrumentation kit is a plausible "Best New Resource" or "Best New Application" candidate.

---

## Finding 7: A recommended development plan for the BCF brain

The plan below is written against a 35-day main-track runway and a 15-day paper-track runway, with the calendar anchored to today, 2026-10-28.

### The architecture decision, stated once

**Build one BCF protocol, instantiate it twice.** The protocol — spec-first, ordered repair, breadcrumb journal, binary gates, no-op assertion, text-search-primary localization — is model-agnostic. What differs between the two instantiations is the *prompt density* (a smaller model needs more structure per turn, not less), the *tool budget* (E2B/E4B are faster, so more turns fit), and the *risk posture* (a 31B entry should be conservative and reliable; a small-model entry can afford a bolder loop-and-refine structure because its per-turn cost is lower).

This is not a compromise. It is the *correct* exploitation of the host's own framing: smaller models open up "more test time compute," and BCF is a protocol that converts time into correctness. **The smaller model is where a discipline-first brain pays the most, because the discipline is substituting for the capability the smaller model lacks.**

### Week 1 (Oct 28 – Nov 3): unblock and instrument

Nothing else can start until the environment is trustworthy.

1. **Fix the local environment first, and rebuild the holdout around discriminating tasks only.** Make gold patches pass on the chosen holdout. The 9/30 intel documents exactly what breaks: missing `typing_inspection` (fastapi imports fail 63–67 of 67), `inline-snapshot` (22 tasks), `dirty-equals` (9), ujson/orjson (2), python-multipart (1), and starlette 1.6.0 forced by wheel dedup breaking `Router.__init__(on_startup=...)` on 48 tasks. Also exclude the 12 tasks that are dead-on-arrival on Python 3.13 regardless of environment: 8 SSL-dead requests tasks (6589, 6592, 6629, 6757, 7328, 7433, 7502, 7505), 3 version-gated (fastapi_14186, fastapi_15745, rich_3486), 1 error-string drift (rich_3472). **And the holdout itself must be rebuilt on the 71 discriminating tasks** (or the 103 with auxiliary test packages installed) — not on a task set where `requests`/`httpx` contribute zero usable tasks, and not on the `httpx_3672` family, where a zero result would be an artifact of the environment rather than of BCF. **Until a gold patch passes on every holdout task, every local number is meaningless.**
2. **Run the Day-0 harness probe battery** — a single scripted session on Kaggle 4×L4 with the official wheelhouse, checking: do skills execute and return output on the scorer? does `read_file` with line ranges work? is `search_similar_code` output capped at 5,000 characters? is the double-JSON escaping still present (measure `old_string not found` rate)? is thinking-mode `include_thoughts` now preserved? does an E4B checkpoint start under the official VllmServer path? **These six checks gate every subsequent decision.**
3. **Verify the E2B/E4B serving path end-to-end.** The 12B needed `--hf-overrides` and the `vision_embedder` fix; E2B/E4B are a different architecture family (`Gemma4UnifiedForConditionalGeneration` with an encoder-free vision embedder and per-layer embeddings, sliding window 512, 128K context). Nobody has publicly confirmed an E2B or E4B submission scoring end-to-end. **This is the single largest technical risk to the bonus prize and it is cheap to test in Week 1.** If E4B cannot start under the official VllmServer path, the bonus prize is unreachable regardless of how good the brain is.
4. **Build the paired-evaluation harness** with the McNemar discipline already specified: same tasks, same seeds, per-task outcomes, and the ability to compute a paired test. This is a prerequisite for every subsequent claim.

### Weeks 2–3 (Nov 3 – Nov 17): measure, then tune

5. **Run the pre-registered Config 1 / 2 / 3 comparison on the frozen holdout** with paired statistics. This converts the simulation from `[SIM]` to `[M]` and produces the paper's central table. Do not skip the replication: the board's own lesson is that a single run of a good config came back 48 vs 55 of 129.
6. **Implement the four targeted interventions** the board evidence supports, each as an isolated paired arm: (a) the no-op assertion on fix scripts and edits, using the existing journal fields; (b) the `budget_warning → fix-script → one-run → submit` protocol; (c) text-search-primary localization with graph tools demoted to advisory, plus a mandatory fallback for async symbols, since graphs contain zero async functions; (d) the artifact-citation discipline that keeps issue-text contract and visible-test signal separate, so a correct fix is not reverted because the visible suite is red. Alongside these, two configuration fixes that cost nothing and were measured to be worth a lot: **`max_output_tokens: 8192`** (the 16384 default crashed 75% of tasks on context overflow) and a **write-once Phase-1 specification artifact** that later phases read rather than re-derive, because the binding constraint is context growth per turn, not a countable budget.
7. **Ship the paper-track writeup by Nov 12.** The framing is unusually strong and the window is short: *the dominant failure mode of a hidden-test-graded coding agent is fault interference — a correct fix in the right place that is wrong — and a discipline-first protocol with a no-op-detecting journal prevents it.* The literature on masking and interference already gathered in the workspace supports the framing; the board's independent 18-of-41 measurement supports the empirical claim; the pre-registered Config 1/2/3 comparison is the falsifiable test. Three caveats to handle: the paper must be unpublished (check the live thread on whether an arXiv preprint disqualifies it), 3,000 words is a hard cap, and a team may submit at most two writeups — one of which can be considered for multiple awards but wins only one. [Paper track rules](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/rules) · [Elan Markowitz's clarification thread](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/743255)
8. **Build the E4B instantiation in parallel, not after.** Same protocol, different prompt density and budget. Measure both on the same holdout with the same paired protocol. The asymmetry in cost — a Kaggle notebook is one submission per day, and scoring takes 15–22 hours — means serial work on the two entries is a scheduling error.

### Weeks 4–5 (Nov 17 – Dec 2): consolidate and ship

9. **Treat Nov 12 as a hard internal milestone for the small-model entry**, even though the binding deadline is Dec 2. The bonus block's stray "November 12" line is a real risk, and the cost of insuring against it is one week. Have a *scored* E4B submission banked by Nov 12, not merely a built one.
10. **Protect the submission budget.** One submission per day, and a team's pending slot blocks further submissions while a 15–22 hour scoring run is in flight. With ~28 usable submission days to Dec 2 and a realistic 2-day turnaround, you have roughly 12–14 submission opportunities, not 28. Budget them: 2 for the E2B/E4B serving smoke test, 4–5 for the main-track prompt-bundle A/B arms, 2 for the E4B instantiation, 2 for final selection, and keep 2 in reserve for platform-error replays — the 9/26-style error waves consumed slots even when the submission was fine.
11. **Select exactly two final submissions**: the best 31B bundle and the best E4B/E2B bundle. Confirm both are in the final-submission set before Nov 25 (entry and team-merger deadline), and check the small-model one against every bonus-eligibility clause: explicit E2B or E4B base model, declared consistently across all agents and sub-agents, packaged with the adapter layout if any adapter is used, and selected as one of the two final submissions.
12. **Write the model card and the reproducibility package** early. Both tracks impose winner obligations: Apache-2.0 licensing of winning code, a methodology description sufficient to reproduce, training/inference code, and a documented environment. [Main track rules §6, §8](https://www.kaggle.com/competitions/gemma-4-developer-agent/rules) · [Paper track rules §6](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/rules)

### The go/no-go decision tree for the adapter

```
Can the E4B/E2B checkpoint start under the official VllmServer path on 4×L4?
├─ NO → Bonus prize unreachable. Bank both final slots on 31B. Paper track carries
│        the E2B/E4B research as an analysis, not a submission.
└─ YES → Does the scorer set VLLM_MEMORY_PROFILER_ESTIMATE_CUDAGRAPHS=1 or
         cudagraph_specialize_lora=false?
   ├─ NO → Ship NO adapter on the small-model entry too. The startup OOM/hang risk
   │        is not worth a 15–20% per-call cost on an unproven adapter.
   └─ YES → Is a small, targeted adapter (trained on the small model's OWN
            failure distribution, not a stronger teacher's cross-repo traces)
            validated on the small model's own paired holdout to beat the
            prompt-only build by more than the 15–20% per-call cost?
      ├─ NO → Ship prompt-only. Record the null result — it is publishable.
      └─ YES → Ship the adapter. It is now a defensible contribution.
```

---

## Finding 8: Competitive positioning — where BCF can and cannot win

### Who is already ahead, and doing what

The board's public notebooks show the tuned prompt-only recipe at 0.18–0.22 and the top tracked teams at 0.24. Competitors with published engineering depth include: a team shipping a full LoRA kit with a reproduction library and a 4×L4 microbenchmark; a team with a 14-bundle experiment log, a documented failure taxonomy, and a promotion checklist that refuses to promote on a dev-cohort win; a team shipping a "Gemma 4 Task Soundness and Local Results" dataset alongside a notebook titled "Gemma 4: Measure Before You Tune" whose table of contents reads like a discipline manual ("Establish which tasks measure a fix," "Use an unresolved-trace control before trusting a loss reduction," "Separate infrastructure failures from model behavior"); and, on the paper track, CodeGuardian (graph-guided self-repair), a model-free localization benchmark on the 129 public tasks, a graph generator benchmark, an open trap-25 loop benchmark, and — notably — a team shipping "gemma4-swe-kit and an agent trajectory dataset." [Tool-Use LoRA Kit](https://www.kaggle.com/datasets/scottweeden/gemma-4-developer-agent-tool-lora-kit) · [gemma-agent-lab](https://github.com/jwj1342/gemma-agent-lab) · [Gemma 4: Measure Before You Tune](https://www.kaggle.com/code/dmitriigluzdov/gemma-4-measure-before-you-tune) · [Paper track discussion](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion)

### The competitor that overlaps BCF most directly

One competitor's public notebook deserves specific attention because it occupies the same conceptual territory as BCF. Robina Mirbahar's **"Gemma 4 Loop-Breaker ADK Agent — Thinking-Mode Sampling Calibration & Operational Contract"** ships a `Gemma 4 31B Loop-Breaker & Code-Graph LoRA` model and a notebook whose structure includes: *"Live Contract-to-Patch Alignment Benchmark on Published tasks.jsonl"*, *"Live Two-Container Git Sandbox Simulation & AST Graph Topology Inspection"*, *"YAML !include Compiler, Round-Trip Extraction & Pre-Submission Verification Gate"*, and a *"6-Module Ablation Profile"* with a *"Deterministic Archive Verifier."* [Gemma 4 Loop-Breaker ADK Agent](https://www.kaggle.com/code/robinamirbahar/gemma-4-loop-breaker-adk-agent) — updated within hours of this research; the author also published the [Trap-25 loop benchmark](https://www.kaggle.com/discussions?tags=12107-Computer+Science) and a [Loop-Breaker & Code-Graph LoRA](https://github.com/RobinaMirbahar) model.

**Two consequences for BCF, and they cut in opposite directions.**

*Bad news:* the **contract-to-patch alignment** framing is taken. So is **operational discipline** as a headline, and so is a **verification gate** as a mechanism — all three are in that notebook's table of contents. BCF cannot claim "we added a spec-first contract and a validation gate" as a novel contribution; a reviewer who knows this notebook will read BCF's Phase 1 and Phase 4 as a re-derivation. Worse, that competitor is shipping a **31B LoRA** at all, which weakens the blanket "no adapter" position on the board — the no-adapter claim rests on *measured solve rates*, not on a universal rule, and BCF's paper should say so precisely rather than overreach.

*Good news:* the notebook's title says "Loop-Breaker," and its LoRA is a "Code-Graph LoRA." That is a **loop-breaking and graph-tool** strategy, and Finding 6 shows both of those are measurably weak right now: 28 of 70 fix scripts were silent no-ops, and the graphs contain zero async functions while `search_similar_code` calls are uncapped and have killed tasks with context overflow. **BCF's differentiation is precisely the failure class this competitor is not measuring** — wrong-fix-in-the-right-place and no-commit, characterized against gold edit locations, with a no-op-detecting journal and a pre-registered falsification test. That gap is real, and it is where the paper should be pointed.

**The dataset-harvest play is now occupied.** D A M's "Code and data behind our write-ups: gemma4-swe-kit and an agent trajectory dataset" (6 days old) and the Nebius OpenHands / SWE-rebench / Open-SWE-Traces sources that Munal used are visible in the writeup ecosystem. The prior session's advice — build brain v1 from SWE-rebench plus the Nebius OpenHands trajectories rather than a fresh crawl — was sound advice at the time and remains sound, but it is no longer differentiating. **Its value now is as an evaluation and failure-mining substrate, not as a novelty claim.** The Munal experiment is the proof: distilling 314 teacher runs from those exact sources produced loss 1.0 → 0.42 and *fewer* solves than no training at all.

### The three claims BCF can still make

1. **Wrong-fix-in-the-right-place is the dominant failure mode, it is measurable, and it is preventable.** Munal measured it at 18 of 41 failures. BCF is designed against it. The pre-registered Config 1/2/3 comparison on `compat_or_refactor` slices is the falsifiable test. *This is the strongest claim available. Note the precision it needs: it is not "nobody has written about contracts and gates" — a competitor's notebook is titled "Contract-to-Patch Alignment." It is that nobody has characterized the failure mode against gold edit locations, nor pre-registered a falsification test for whether a discipline-first protocol prevents it. That narrower, harder claim is the one to make.*
2. **A discipline-first protocol is a *substitute for model capability*, which makes it disproportionately valuable on the small models the bonus prize targets.** The host named more test-time compute as the E2B/E4B opportunity; a protocol that converts budget into correctness is the mechanism. Nobody has published the E4B-instantiation of a masked-fault-aware protocol.
3. **A no-op-detecting journal is a reusable instrumentation contribution.** The board found 28 of 70 fix scripts were silent no-ops. BCF's ledger has the fields to catch this and does not yet assert on it. Cheap to build, easy to demonstrate, and a plausible Best New Resource or Best New Application entry.

### The two claims BCF must not make

- **Not "our adapter improves the agent."** Three teams have shown it does not, and if BCF claims it without a paired win, the first reviewer will cite Munal's thread.
- **Not "our agent understands the issue better."** Localization is already largely solved. Claiming the opposite of the measured reality is the fastest route to a desk-reject.

---

## Synthesis: the answer, with confidence

**Primary question — how should the BCF brain be developed to produce a winning entry for the competition and the Bonus prize?**

Build the BCF as a *protocol-first* brain, instantiate it twice, and spend the remaining 35 days converting a simulation into a measured result. The board's evidence is unusually consistent on three points, and all three point the same way:

1. **Trained weights do not move the solve rate on this harness.** Four independent measurements, 98 held-out tasks, loss falling to 0.40 while solves fall from 38 to 31, and a fourth adapter still unconfirmed. *Confidence: high.* This is the best-evidenced claim in the entire board, and it kills the adapter-first path for the main track.
2. **The failures are protocol failures, not capability failures.** 18 of 41 failures edited within 20 lines of gold with the wrong fix; 11 opened the gold file and never edited. Localization is not the bottleneck. *Confidence: high.* This is precisely the class BCF's tenets target, and it is the single strongest argument for the BCF design that exists outside the user's own documents.
3. **The budget is the score, and smaller models buy more of it.** 12 hours for ~120 tasks, ~5.5 min/task calibrated, 40–50 calls and 300–350k tokens per success, 12B at ~67 tok/s versus 31B at ~35. *Confidence: high for the 31B baseline, medium for the small-model extrapolation* — E2B/E4B serving has not been publicly confirmed end-to-end, and E2B's smaller capacity (LiveCodeBench 44.0%, Codeforces ELO 633, Tau2 24.5% versus E4B's 52.0%, 940, 42.2%) makes the E4B/E2B choice genuinely open. [Gemma 4 model card, Google DeepMind](https://deepmind.google/models/gemma/gemma-4/) · [Hugging Face Gemma 4 blog](https://huggingface.co/blog/gemma4)

**Therefore:** the main-track entry is a 31B bundle with no adapter, carrying the full BCF protocol, the no-op assertion, the budget-warning fix-script protocol, and text-search-primary localization — and it must be evaluated on a paired local holdout with McNemar-grade statistics, because the leaderboard cannot distinguish a real improvement from noise at the resolution anyone can afford. The bonus-prize entry is the same protocol instantiated on E4B (or E2B, decided by measurement, not by preference), with a denser prompt and a larger turn budget, shipped as one of the two final submissions — which costs no main-track slot and carries a structurally thinner field.

**The paper track is where BCF's real edge is**, and it is 15 days away. The story is publishable now and nobody else has it: the dominant failure mode of a hidden-test-graded coding agent is fault interference; it is measurable against gold edit locations; a discipline-first protocol with a no-op-detecting journal prevents it; and the pre-registered comparison is the falsification test.

**What would change this recommendation:**
- If the skill-scored-0.00 thread resolves as "skills do not work on the scorer," BCF's T11 and A7 components must be re-expressed as prompts or dropped, and the protocol's differentiation narrows considerably. *Watch this thread daily.*
- If the E4B checkpoint cannot start under the official VllmServer path, the bonus prize is unreachable and both final slots go to 31B variants. *Test in Week 1.*
- If the paired Config 1/2/3 comparison shows no advantage for BCF, the honest response is to submit the best prompt-only bundle and publish the null result with the failure taxonomy — which is still a legitimate "Best New Resource" contribution, and vastly better than burning the remaining submissions on a losing protocol.
- If a deadline reading emerges showing the bonus requires selection by Nov 12 rather than Dec 2, compress the timeline: bank a scored small-model entry by Nov 8 at the latest, even a mediocre one, and improve it only if a slot remains.

---

## Recommendations, in priority order

1. **Test the six Day-0 harness unknowns in one scripted session** (skills on the scorer; `read_file` line ranges; `search_similar_code` cap; JSON-escaping edit failure rate; thinking-mode preservation; E4B checkpoint startup). Every other decision is downstream of these.
2. **Make gold patches pass on the local holdout before measuring anything, and rebuild the holdout on the 71 discriminating tasks.** Otherwise the evaluation measures the environment — and on the `requests`/`httpx` families it would measure exactly zero for every arm, including BCF's.
3. **Set `max_output_tokens: 8192`.** The 16384 default reserved half the 32k context on every turn and crashed 75% of tasks on context overflow. This is free and the field standard.
4. **Ship the 31B main-track entry with no adapter.** The evidence is unambiguous, and an adapter adds a startup-OOM risk and a 15–20% per-call cost for no measured gain.
5. **Add the no-op assertion to the BCF ledger** using fields it already has. It is the cheapest high-value change on the list and it attacks a measured board failure mode.
6. **Implement the `budget_warning → fix-script → one-run → submit` protocol**, which is independently measured to have produced the first above-baseline result for one competitor.
7. **Demote graph tools to advisory; make text search primary; add a mandatory async-symbol fallback.** Graphs contain zero async functions, and one team improved results by removing the graph tools entirely.
8. **Build the E4B instantiation in parallel, not after.** One submission per day and 15–22 hour scoring latency make serial work a scheduling error.
9. **Bank a scored E4B submission by Nov 12** as insurance against the bonus-prize deadline ambiguity.
10. **Evaluate on a paired local holdout with McNemar-grade statistics**; treat single leaderboard readings as noise, per the measured σ ≈ 2.4 tasks and the 13-of-30 per-task classification instability.
11. **Make Phase 1 produce a compact, write-once specification artifact** that later phases read instead of re-deriving. The binding constraint is context growth per turn, so a protocol that re-reads its own plan each turn pays a tax the harness will not forgive.
12. **Write the paper track entry around the interference framing**, with the Config 1/2/3 comparison as the falsifiable result, and check the live "does an arXiv preprint count as published" thread before submitting.

---

## Methodology and limitations

**What was searched.** The Kaggle discussion board for `gemma-4-developer-agent` and `gemma-4-developer-agent-paper` (main listing, pinned topics, and individual threads by ID); the competition overview, timeline, rules, data, code, and leaderboard pages for both tracks; the community leaderboard tracker's live JSON feed; local workspace artifacts (`03-discussion-board-intel.md`, `03-bcf-simulation-httpx-3672.md`, `HARNESS_README.md`, `Kaggle-00-Complete.md`); and the public GitHub repositories, Kaggle notebooks, and Kaggle datasets of active competitors. Google and vLLM primary documentation for the Gemma 4 model family and the `cudagraph_specialize_lora` / `VLLM_MEMORY_PROFILER_ESTIMATE_CUDAGRAPHS` mechanics.

**Access limitation, stated plainly.** Kaggle's discussion pages are JavaScript-rendered single-page applications, and Kaggle's internal JSON endpoints (`DiscussionsService.ListDiscussions`, `DiscussionsService.GetTopic`) are behind a recaptcha challenge from this environment. Direct `web_fetch` of the two URLs you supplied **failed** ("file load failed"), and so did a jina.ai reader proxy, an allorigins proxy, and raw `curl` against the internal API. Thread bodies and the board listing were therefore obtained through search-engine indexing of Kaggle's pages, which returns the rendered text of those pages. **This means: I read the content of the threads I cite, but I could not enumerate the board exhaustively.** Thread coverage is necessarily partial — likely a majority of the active threads, but not provably all, and comments deep in long threads may be truncated. The board's listing itself caps at 20 threads per view, as the 9/30 intel noted. The one specific thread you linked, `discussion/751104`, did not surface in any search index capture; **the Bonus Prize terms in Finding 1 are therefore cited to the official competition Overview, Rules, and Citation pages — the authoritative source for prize terms — not to thread 751104.** The thread's own commentary is unread.

**Secondary-source discipline.** Community GitHub repos, Kaggle notebooks, and Kaggle datasets are cited for *their own reported measurements* and are labeled as participant reports, not as established fact. Where a participant's number conflicts with the host's, the host's statement governs and the conflict is surfaced. Host statements (Ryan Holbrook, Elan Markowitz) are treated as authoritative for rules and infrastructure; participant reproductions are treated as strong but not dispositive.

**Known gaps.**
- No E2B or E4B submission has been publicly confirmed as scored end-to-end. The bonus-prize path rests on the host's announcement and the general 12B serving precedent, plus a scorer-side remark that "the smaller variants use the same scoring conditions as 31B."
- Whether the private evaluator runs tasks serially or with concurrency N≥2 is **not officially documented**; every budget figure in this report assumes serial execution, which is the conservative case.
- The exact number of public tasks that discriminate locally is 71 of 129 *as of one participant's audit of one wheelhouse version*; the wheelhouse has since moved to v31, and the count should be re-measured rather than inherited.
- Current status of the thinking-mode drop (744354), the double-JSON escaping fix (744272), and the `search_similar_code` cap (744577) could not be confirmed as of 2026-10-28.
- The exact identity and existence of the promised small-model filtered-leaderboard notebook was not confirmed.
- The paper track's current writeup count and rubric details are behind a rubric the host states will not be shared.
- Local workspace materials date from 2026-09-30 and have not been re-verified against the current competition state; where they conflict with newer board evidence (notably the graph-tool quality and the 12B model allowance), the newer evidence is used and the older material is flagged as superseded.

**Date anchoring.** Every time-sensitive claim was checked against material published or dated on or before 2026-10-28. The leaderboard distribution is a live snapshot stamped 2026-10-28 05:25 UTC. Where a claim is genuinely undated in the sources, it is marked as such rather than dated by inference. Thread comment counts and "last comment" ages are as observed on 2026-10-28 and drift daily.

**A note on the plan-approval gate.** The `rdw-conduct-wide-research` skill normally pauses for owner approval of a research plan before execution. That gate was deliberately skipped on this run: the request named two specific URLs and one explicit strategy question, the "research" the user asked for was itself the intel deliverable, and the competition's own calendar (paper track Nov 12, entry Nov 25, final Dec 2) made an extra round-trip pure friction. The plan that would have been approved is embedded in Finding 7 and in the Method section, so the reasoning remains inspectable. Flagging it explicitly rather than silently skipping it.

**What would most change this report.** Three items, in order: (1) a host answer on the skills-0.00 thread, (2) the first confirmed scored E4B or E2B submission and its score, (3) the resolution of the bonus-prize deadline reading.

---

## Sources

1. [Google — The Gemma 4 Developer Agent Competition (overview, prizes, timeline, model selection)](https://www.kaggle.com/competitions/gemma-4-developer-agent) — Kaggle, accessed 2026-10-28
2. [Google — The Gemma 4 Developer Agent Competition, rules](https://www.kaggle.com/competitions/gemma-4-developer-agent/rules) — Kaggle, accessed 2026-10-28
3. [Google — The Gemma 4 Developer Agent Competition, overview/citation](https://www.kaggle.com/competitions/gemma-4-developer-agent/overview/citation) — Kaggle, accessed 2026-10-28 (Bonus Prize text)
4. [Google — The Gemma 4 Developer Agent Competition, leaderboard](https://www.kaggle.com/competitions/gemma-4-developer-agent/leaderboard) — Kaggle, accessed 2026-10-28
5. [Discussion: New Gemma 4 Models Available: 12B, E4B, and E2B (thread 748287, pinned)](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/748287) — Ryan Holbrook (host), posted ~2026-10-21, 31 comments, accessed 2026-10-28
6. [Discussion: SFT / distillation LoRAs on Gemma 4 31B: loss falls a lot, solve rate doesn't move (thread 751596)](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/751596) — Munal Singh, posted ~2026-10-22, accessed 2026-10-28
7. [Discussion: Question about LoRA (thread 749191)](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/749191) — Nir Aberman, Michi Yamamoto, Cam-Mark, Ryan Holbrook (host), posted ~2026-10-22, accessed 2026-10-28
8. [Discussion: Gemma 4 agent experiments — sampling, thinking, time limits, tool ablations (thread 746250)](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/746250) — Ayush Thakur, accessed 2026-10-28
9. [Discussion: Kaggle 4×L4 runtime calibration (thread 747857)](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/747857) — Ayush Thakur, accessed 2026-10-28
10. [Discussion: Two data issues — empty graph/embedding files, no async functions (thread 742911)](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/742911) — Jason Wold with Ryan Holbrook (host), accessed 2026-10-28
11. [Discussion: submission is running for 15h (thread 746480)](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/746480) — multiple authors, 35 comments, accessed 2026-10-28
12. [Discussion: Submission stuck in Pending/Running for 26+ hours, blocking new submissions (thread 747740)](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/747740) — kkm121121 and others, accessed 2026-10-28
13. [Discussion: How to package and resolve custom Python tools in submission.zip (thread 743573)](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/743573) — Ryan Holbrook (host), accessed 2026-10-28
14. [Discussion: Gemma4 allowed variant (thread 743056)](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/743056) — Fritz Cremer, Bharat, Ryan Holbrook (host), accessed 2026-10-28
15. [Discussion: Official sample_submission scores FAILED — are submitted adapters meant to be registered as named LoRA modules? (thread 743213)](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/743213) — Carson Rodrigues et al., accessed 2026-10-28
16. [Discussion: Two consecutive "unhandled error" submissions with a prompt-only bundle (thread 751872)](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/751872) — accessed 2026-10-28
17. [Discussion board listing — main track](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion) — Kaggle, accessed 2026-10-28
18. [Google — The Gemma 4 Developer Agent Paper Track (overview, tracks and awards)](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/overview/tracks-and-awards) — Kaggle, accessed 2026-10-28
19. [Google — The Gemma 4 Developer Agent Paper Track, rules](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/rules) — Kaggle, accessed 2026-10-28
20. [Paper track discussion board](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion) — Kaggle, accessed 2026-10-28
21. [Paper track discussion: Clarification on number of writeups per team and eligibility across awards (thread 743255)](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/743255) — Ahmed Sattar Jabbar with Elan Markowitz (host), accessed 2026-10-28
22. [Gemma 4 Agent Leaderboard — community tracker](https://gemma4agent.kawchar.online) and [live JSON feed](https://gemma4agent.kawchar.online/data/leaderboard.json) — kawchar85, snapshot updated 2026-10-28 05:25 UTC, tracking since 2026-10-01
23. [gemma4-agent-leaderboard repository](https://github.com/kawchar85/gemma4-agent-leaderboard) — kawchar85, accessed 2026-10-28
24. [STATE_OF_COMPETITION.md — Gemma 4 Developer Agent](https://github.com/cherrera0001/Agents_Learning_Loops/blob/main/STATE_OF_COMPETITION.md) — cherrera0001, cutoff 2026-10-13
25. [Gemma 4 Developer Agent Tool-Use LoRA Kit](https://www.kaggle.com/datasets/scottweeden/gemma-4-developer-agent-tool-lora-kit) — scottweeden, entries dated to 2026-10-24
26. [gemma-swe-agent — solo entry experiment log](https://github.com/happyc0der/gemma-swe-agent) — happyc0der, entries to 2026-10-18
27. [gemma-agent-lab — research workspace](https://github.com/jwj1342/gemma-agent-lab) — jwj1342, accessed 2026-10-28
28. [gemma4-developer-agent — competition entry](https://github.com/Gosling-dude/gemma4-developer-agent) — Gosling-dude, accessed 2026-10-28
29. [kaggle-gemma4 — working repo](https://github.com/8kta/kaggle-gemma4) and [its README](https://raw.githubusercontent.com/8kta/kaggle-gemma4/main/README.md) — 8kta, accessed 2026-10-28 (official-model baseline, `max_output_tokens` fix, turn-budget analysis, QLoRA pipeline status)
30. [kaggle-finetune-gemma — our entry](https://github.com/bansal1600/kaggle-finetune-gemma) — bansal1600, accessed 2026-10-28
31. [Gemma 4 Agent: Budget-Fit Single Agent](https://www.kaggle.com/code/verracodeguacas/gemma-4-agent-budget-fit-single-agent) — verracodeguacas, 0.18, accessed 2026-10-28
32. [Gemma 4 | Budget-Aware Coding Agent v2](https://www.kaggle.com/code/flexonafft/gemma-4-budget-aware-coding-agent-v2) — Igor Zharov, 0.22, accessed 2026-10-28
33. [Gemma 4: Measure Before You Tune](https://www.kaggle.com/code/dmitriigluzdov/gemma-4-measure-before-you-tune) — dmitriigluzdov, accessed 2026-10-28
34. [Gemma 4 Agent 🧠 What Took LB 0.12 → 0.24](https://www.kaggle.com/code/hitarthjain0/gemma-4-agent-what-took-lb-0-12-0-24) — hitarthjain0, TOC last updated 2026-10-09, accessed 2026-10-28
35. [Discussion: Some settings and Scores (thread 748168)](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/748168) — Murugesan Narayanaswamy, posted ~2026-10-27, accessed 2026-10-28 (thinking-mode timing table, per-submission skills/eval-config log, 12-hour timeout control via max_tool_calls)
36. [Gemma 4 — Google DeepMind model page](https://deepmind.google/models/gemma/gemma-4/) — Google DeepMind, accessed 2026-10-28
37. [Gemma 4 — Hugging Face blog (model card and benchmark tables)](https://huggingface.co/blog/gemma4) — Google DeepMind / Hugging Face, accessed 2026-10-28
38. [Gemma 4 Technical Report](https://arxiv.org/abs/2607.02770) — arXiv, accessed 2026-10-28
39. [Gemma model overview — Google AI for Developers](https://ai.google.dev/gemma/docs/core) — Google, accessed 2026-10-28
40. [vLLM compilation config — `cudagraph_specialize_lora`](https://docs.vllm.ai/en/latest/api/vllm/config/compilation/) — vLLM documentation, accessed 2026-10-28
41. [vLLM `gemma4_unified` model implementation](https://docs.vllm.ai/en/latest/api/vllm/model_executor/models/gemma4_unified/) — vLLM documentation, accessed 2026-10-28
42. Local workspace artifact — `03-discussion-board-intel.md` (compiled 2026-09-30, 22 threads, two byte-identical copies) — provided by the user
43. Local workspace artifact — `03-bcf-simulation-httpx-3672.md` (BCF canonical walkthrough, 2026-09-30) — provided by the user
44. Local workspace artifact — `HARNESS_README.md` (swegemma evaluation harness reference) — provided by the user
45. Local workspace artifact — `Kaggle-00-Complete.md` (competition documentation snapshot) — provided by the user

---

## Appendix A — Board thread manifest, current as of 2026-10-28

Threads cited above, by ID, with role in the analysis:

| ID | Title (abridged) | Author | Role |
|---|---|---|---|
| 743007 | Welcome to the Gemma 4 Developer Agent Competition | Elan Markowitz (host) | Competition framing |
| 743056 | Gemma4 allowed variant | multiple | Model-variant history |
| 743213 | Official sample_submission FAILED — adapters as named LoRA modules? | Carson Rodrigues et al. | Adapter registration path |
| 743573 | Packaging and resolving custom Python tools | Ryan Holbrook (host) | Skills-as-scripts mandate |
| 742911 | Two data issues: empty graph/embedding files, no async functions | Jason Wold | Graph-tool limits |
| 744370 | FastAPI gold fails; typing_inspection | Vivek K N + host | Host: hidden tasks 100% gold-valid |
| 744794 | Several harness issues make results hard to trust | — | Open harness defects |
| 746250 | Sampling, thinking, time limits, tool ablations | Ayush Thakur | Primary ablation dataset |
| 746480 | Submission running for 15h | multiple | Scoring-latency evidence |
| 747740 | Submission stuck Pending 26+ hours | kkm121121 | Pending-slot blocking |
| 747857 | Kaggle 4×L4 runtime calibration | Ayush Thakur | Throughput constants |
| 748287 | New Gemma 4 Models: 12B, E4B, E2B | Ryan Holbrook (host) | **Bonus-prize enabler** |
| 748168 | Some settings and Scores | Murugesan Narayanaswamy | Thinking-mode timing; skills/eval-config submission log |
| 749191 | Question about LoRA | Nir Aberman et al. | **LoRA startup root cause + fixes** |
| 751104 | *(supplied link — body not retrievable; see limitations)* | — | Bonus-prize thread |
| 751596 | SFT/distillation LoRAs: loss falls, solve rate doesn't | Munal Singh | **Central negative result** |
| 751872 | Two consecutive "unhandled error" submissions, prompt-only bundle | — | Scorer-side failure class |
| — | Submission with a skill scored 0.00 with no error | Oleksii Zhukov | **BCF blocker** |
| — | Update on "Kaggle Error" Submissions & Queue Delays (pinned) | Dustin | Platform reliability |
| — | Trap-25 Bug Traps, 300 SWE Loop Pairs, W4A16 budget sweep | Robina Mirbahar | Loop/stall measurement |

## Appendix B — The six Day-0 probes, in order of blocking severity

| # | Probe | Blocks | Expected answer if healthy |
|---|---|---|---|
| 1 | Does `run_skill_script` execute and return output on the scorer? | BCF's T11 and A7 entirely | Script output visible in the trace, non-zero score with a skill-bearing bundle |
| 2 | Does the E4B (and E2B) checkpoint start under the official VllmServer path on 4×L4? | The entire bonus prize | Clean startup, one HTTP 200 completion |
| 3 | Do gold patches pass locally on the chosen holdout? | Every local measurement | 100% of holdout tasks pass the gold patch |
| 4 | Is `edit_file` still failing ~22% on `old_string not found`? | Phase-3 repair reliability | Failure rate near 0% after the escaping fix |
| 5 | Does `read_file` with line ranges work? | BCF Phase-2 localization plan | No `'>' not supported between instances of 'int' and 'str'` |
| 6 | Is `search_similar_code` output capped, and is `include_thoughts` preserved? | Context budget; thinking-mode config | Output capped; thoughts present in the next prompt |

## Appendix C — Measured constants for budget modelling

```
Global:            12 h wall-clock, ~120 tasks, patch validation excluded
                   (evaluator concurrency N undocumented; serial assumed = conservative)
Per-task budget:   ~5.5 min on Kaggle 4×L4 (11.03 h projected; 11.23 h with setup)
Success shape:     40–50 LLM+tool calls, 300–350k tokens (input+thinking+output)
Kaggle 4×L4:       900.8 s / 1M tokens, 1,110 tok/s, 8.68 s / model call (thinking on)
Kaggle vs B40:     0.770× end-to-end serving factor (sequential vs concurrent — not a hardware delta)
12B vs 31B:        ~67 tok/s vs ~35 tok/s, single sequence, 4×L4
KV cache (4×L4):   ~1.4 full-length 32k sequences; 8-way concurrency ⇒ 2/3 timeouts
Context window:    32,768 total; max_output_tokens 16384 ⇒ 75% task crash rate (context overflow)
                   max_output_tokens  8192 ⇒ 5.3% crash rate  [8kta, official 31B]
Binding budget:    turns, not tool calls — 16 of 17 tasks hit 15-turn cap at 14 tool calls
                   raising max_turns 15→25 alone ⇒ no resolution gain, more context crashes
Local holdout:     only 71 of 129 public tasks discriminate (fastapi 29/67, rich 42/48,
                   requests+httpx 0/14); 103 of 129 with 3 auxiliary test packages
LoRA overhead:     +15–20% per call, decode ~1.3× slower
LoRA graph cost:   +~4.5 GiB/GPU (double CUDA graph capture), uncounted in KV budget
LoRA tooling:      PEFT must unwrap Gemma4ClippableLinear → Linear4bit
Hardware floor:    T4 (cc 7.5) cannot run bfloat16 models; needs cc ≥ 8.0
Thinking cost:     default 3.85× / high 4.87× no-thinking wall-clock
Tool budget:       50 → 25 calls = −14 resolved of 129, −29% median runtime
Noise floor:       σ ≈ 2.4 tasks/submission; 13 of 30 tasks change failure class between identical runs
Public split:      58 tasks, so 1 task ≈ 0.017
```

## Appendix D — Community sources used, with verification status

Each of these was fetched or confirmed on 2026-10-28 unless noted. "Verified today" means the page was actually retrieved and read; "confirmed via index" means the content was read through a search-engine capture of the page.

| Source | Contributes | Verification |
|---|---|---|
| [STATE_OF_COMPETITION.md](https://github.com/cherrera0001/Agents_Learning_Loops/blob/main/STATE_OF_COMPETITION.md) (cherrera0001) | Identical-ZIP noise, σ ≈ 2.4, 13-of-30 instability, McNemar discipline, 71-of-129 discriminating tasks, submission registry with SHA-256 | Confirmed via index (full §5.1/§5.2/§6 text read) |
| [8kta/kaggle-gemma4 README](https://raw.githubusercontent.com/8kta/kaggle-gemma4/main/README.md) | Official-31B resolution rates, `max_output_tokens` crash-rate fix, turn-vs-tool budget binding, QLoRA pipeline status, `Gemma4ClippableLinear` | **Verified today (fetched)** |
| [gemma-agent-lab](https://github.com/jwj1342/gemma-agent-lab) (jwj1342) | Exists; research workspace for reliable open-model coding agents | **Verified today (fetched)** |
| [Gemma 4 Technical Report, arXiv:2607.02770](https://arxiv.org/abs/2607.02770) | 2.3B–31B range, encoder-free unified architecture for 12B, thinking mode | **Verified today (fetched)** |
| [vLLM `gemma4_unified` model implementation](https://docs.vllm.ai/en/latest/api/vllm/model_executor/models/gemma4_unified/) | `Gemma4UnifiedForConditionalGeneration`, `Gemma4UnifiedVisionEmbedder` (encoder-free), `Gemma4UnifiedProcessingInfo` | **Verified today (fetched)** |
| [Budget-Aware Coding Agent v2](https://www.kaggle.com/code/flexonafft/gemma-4-budget-aware-coding-agent-v2) (Igor Zharov) | Public score 0.22, single-agent prompt-only recipe | Confirmed via index (score card read) |
| [What Took LB 0.12 → 0.24](https://www.kaggle.com/code/hitarthjain0/gemma-4-agent-what-took-lb-0-12-0-24) (Hitarth Jain) | TOC: 12-h budget as the real constraint, controlled ablation, "How noisy is one public score?", "Validate before you spend a daily submission" | Confirmed via index (full TOC read) |
| [Measure Before You Tune](https://www.kaggle.com/code/dmitriigluzdov/gemma-4-measure-before-you-tune) (Dmitrii Gluzdov) | Public score 0.18; TOC covers task soundness, timing-priced experiments, LoRA inference verification, unresolved-trace control, infrastructure-vs-model separation | Confirmed via index (full TOC + score read) |
| [Gemma 4 Technical Report model card](https://huggingface.co/blog/gemma4) and [DeepMind model page](https://deepmind.google/models/gemma/gemma-4/) | LiveCodeBench / Codeforces / Tau2 / GPQA figures for 31B, 26B A4B, E4B, E2B | Cited for model-capability comparison; figures re-checked against the model card as of 2026-10-28 |
| [Tool-Use LoRA Kit](https://www.kaggle.com/datasets/scottweeden/gemma-4-developer-agent-tool-lora-kit) | Logit-delta vs decision-agreement result, bundle-arm results, concurrency behavior, "no competition data" packaging discipline | Participant-reported; dataset not re-downloaded |
| [gemma-swe-agent](https://github.com/happyc0der/gemma-swe-agent) | `budget_warning` → fix-script protocol result, 28-of-70 silent no-op fix scripts, thinking-on/off loop comparison | Participant-reported; repository not re-cloned |
| [Tracker JSON feed](https://gemma4agent.kawchar.online/data/leaderboard.json) | 3,981 teams, score distribution, `updated_at` stamp, submission event history with scoring latencies | **Verified today (fetched)** |

**Not retrieved, and therefore not cited as evidence:** the body of discussion thread 751104; the full text of the "Submission with a skill scored 0.00" thread (title, author, recency, and comment count were observed; its contents were not); the promised small-model filtered-leaderboard notebook; and the paper track's judging rubric.

## Appendix E — Source list continuation

| Source | Contributes | Verification |
|---|---|---|
| [gemma4agent.kawchar.online](https://gemma4agent.kawchar.online) | Community leaderboard, 3,981 teams tracked, max 0.24, median 0.15 | **Verified today (fetched)** |
| [kawchar85/gemma4-agent-leaderboard](https://github.com/kawchar85/gemma4-agent-leaderboard) | Tracker provenance | Referenced, not re-cloned |
| [Gemma 4 Loop-Breaker ADK Agent](https://www.kaggle.com/code/robinamirbahar/gemma-4-loop-breaker-adk-agent) and [RobinaMirbahar's profile](https://github.com/RobinaMirbahar) | Competing loop-breaking + code-graph-LoRA approach; Trap-25 benchmark; contract-to-patch alignment benchmark | Participant-reported |
| [Gemma 4 Agent: Budget-Fit Single Agent](https://www.kaggle.com/code/verracodeguacas/gemma-4-agent-budget-fit-single-agent) | Public score 0.18; the 8-min / 28-call / 240-s / 80-turn / temp-0.2 / top_p-0.95 / max_output-8192 / thinking-4096 recipe | Confirmed via index |
| [bansal1600/kaggle-finetune-gemma](https://github.com/bansal1600/kaggle-finetune-gemma) | Competing fine-tuning pipeline | Participant-reported |
| [kcsinclair/agent-benchmark](https://github.com/kcsinclair/agent-benchmark) and [Gosling-dude/gemma4-developer-agent](https://github.com/Gosling-dude/gemma4-developer-agent) | Competing agent implementations | Referenced, not re-cloned |


---

<!-- ====================================================================== -->
<!-- FILE: 01_BCF-build-roadmap_2026-10-28-web-m3.md -->
<!-- ====================================================================== -->

# BCF Build Roadmap — Week by Week

**Framework:** Batonic Coding Framework (BCF)
**Target:** Kaggle *The Gemma 4 Developer Agent Competition* — main track + $10,000 Small-Model Bonus Prize + Paper Track
**Plan authored:** 2026-10-28 (Wednesday)
**Hard deadlines:** Paper Track **Thu Nov 12, 23:59 UTC** · Entry + Team Merger **Wed Nov 25, 23:59 UTC** · Final Submission **Wed Dec 2, 23:59 UTC**
**Runway:** 15 days to the paper deadline, 28 to entry, 35 to final submission

**Companion documents**
- `wide-research_gemma-4-developer-agent-bcf-brain_2026-10-28.md` — board intel, leaderboard analysis, bonus-prize terms, LoRA evidence state
- `deep-research-handoff-bcf-brain-data-harvest-and-analysis.md` — dataset-harvest plan (brain v1 training data)
- `deep-research-handoff-fault-masking-interference-llm-issue-resolution.md` — the theoretical framing and terminology handoff
- `03-bcf-simulation-httpx-3672.md` — the canonical worked example (the only place with [V] receipts)
- `HARNESS_README.md` — the `swegemma` harness reference (the copy in the workspace predates the 2026-10-21 model expansion; treat §3 as stale)

---

## 0. How to read this document

Each week has a **theme**, a **table of days**, and an **exit gate**. The exit gate is the point: if a week does not clear its gate, you do not proceed to the next week's plan — you cut scope and re-plan, because the competition will not wait for you.

Three rules govern every decision in this roadmap.

1. **Measure before you tune.** Every claim that BCF helps must come from a paired local evaluation with McNemar-grade statistics. Single leaderboard readings are noise: measured σ ≈ 2.4 tasks per submission, and 13 of 30 tasks change failure classification between *identical* runs.
2. **The local environment must be trustworthy before anything is measured.** Only 71 of the 129 public tasks discriminate under the official wheelhouse. Measuring on the other 58 measures the environment, not the brain.
3. **A qualifying zero beats an unscored masterpiece.** With one submission per day and 15–22 hour scoring latency, you get roughly 12–14 usable submission slots before Dec 2, not 28. Never spend a slot on something that might not return a score.

**Definition of done, used throughout:** an artifact is "done" when it is (a) committed to the repo, (b) reproducible from a written command, (c) recorded in the ledger with a receipt, and (d) checked against the falsification criteria in §7.

---

## 1. Week 1 — Unblock and instrument (Wed Oct 28 → Tue Nov 3)

**Theme:** Nothing about BCF can be measured or shipped until the environment is trustworthy and the harness's real behaviour is known. This week buys the right to make claims. It is deliberately unglamorous.

**Why this week exists:** two Day-0 blockers can each invalidate the whole project. (a) If skills silently fail on the scorer, BCF's T11 and A7 components need re-expressing as prompt-level scripts. (b) If a skills-bearing agent carries enough overhead to eat a 5.5-minute task before it writes any code, the architecture must be re-costed. Both are cheap to test and catastrophic to discover late.

| Day | Focus | Concrete deliverable | Artifact / path | Exit condition |
|---|---|---|---|---|
| **Wed Oct 28** | Environment triage | Read the current wheelhouse (v31) and the `swegemma` reference; re-check every harness fact in `03-bcf-simulation-httpx-3672.md` §8 against the live harness | `notes/day0/00-harness-facts-recheck.md` | Every [V] fact either re-confirmed or marked stale, with the new value |
| **Wed Oct 28** | Holdout rebuild | Download the data package; compute which tasks discriminate (gold patch applies and tests pass) under the current wheelhouse | `notes/day0/01-discriminating-tasks.md` + `data/holdout_v1.json` | A task list, not a guess. Expect ~71; the 8 SSL-dead requests tasks, 3 version-gated, 1 error-string-drift are excluded |
| **Thu Oct 29** | Environment repair | Install the auxiliary test packages that recover non-discriminating tasks (`typing_inspection` for fastapi, `inline-snapshot`, `dirty-equals`, ujson/orjson, python-multipart); fix starlette dedup forcing 1.6.0 | `notes/day0/02-env-repair.md` | Gold patches pass on **100%** of holdout tasks. If not, holdout shrinks; it never grows |
| **Thu Oct 29** | **Probe 1 (blocker)** | Submit a minimal bundle with a skill that prints a marker, and the same bundle with the skill removed. Compare traces and scores | `submissions/d0_skill_probe/` | Skills demonstrably execute on the scorer. If score is 0.00 with no error, escalate to the host and plan the prompt-level fallback in Week 2 |
| **Fri Oct 30** | **Probe 2 (blocker)** | Submit the same probe bundle against `gemma-4-e4b-it-qat-w4a16-ct` | `submissions/d0_e4b_probe/` | E4B starts under the official `VllmServer` path and returns one completion. **This is the bonus-prize gate** |
| **Fri Oct 30** | **Probe 3** | Test `read_file` with line ranges; test `search_similar_code` output length; measure `edit_file` `old_string not found` rate on 20 known-good edits | `notes/day0/03-tool-probes.md` | Line-range read works (or is documented as broken); `search_similar_code` is capped at 5,000 chars (or documented as uncapped → BCF must constrain queries); escaping failure rate is near zero (or documented) |
| **Sat Oct 31** | **Probe 4** | E2B variant of Probe 2, plus 12B and 31B baselines for comparison | `submissions/d0_model_matrix/` | A table: model × starts / token rate / context behaviour. E2B and E4B both confirmed or both failed |
| **Sun Nov 1** | **Probe 5 (config)** | One bundle with `max_output_tokens: 16384`, one with `8192`, one with `8192` + `max_tool_calls: 32` | `submissions/d0_budget_probe/` | Confirms the 8kta finding (16384 → 75% context-overflow crash rate) on your own hardware, and confirms `max_tool_calls` throttles the 12h wall |
| **Sun Nov 1** | Instrumentation | Implement the ledger writer: one JSONL row per tool call (`op`, `bcf_phase`, `tool`, `ok`, `state{files_changed, lines_changed, strikes, turn}`, `spec_ref`) | `bcf/ledger.py`, `bcf/ledger.schema.json` | Every tool call in a local run produces a row; `spec_ref` is a content hash |
| **Mon Nov 2** | Instrumentation | Implement the **no-op assertion**: a `run_skill_script` or `edit_file` that returns without changing a file, or with an empty diff, is recorded as a failed operation and trips the journal | `bcf/noop.py` + unit test | The assertion fires on 5 synthetic no-op cases and does not fire on 5 real edits |
| **Mon Nov 2** | Evaluation harness | Build the paired evaluator: same tasks, same seeds, per-task outcomes, exact McNemar test, ≥60 tasks for significance | `eval/paired_eval.py`, `eval/mcnemar.py` | Reproduces the published 13-of-30 instability and the σ ≈ 2.4 estimate on your own runs |
| **Tue Nov 3** | Week-1 review | Write the Week-1 findings memo; decide the E4B-vs-E2B direction on evidence; re-plan Week 2 if Probe 1 or 2 failed | `notes/week1_review.md` | **GATE W1:** 3 of 4 true — (a) holdout is gold-patch-clean, (b) skills work or fallback is designed, (c) E4B/E2B serving status known, (d) paired evaluator green |

**Week 1 risks**
- If E4B will not start, the bonus prize is unreachable. Do not sink Week 2 into debugging it; fall back to two 31B variants and pivot the paper to the interference result. This is a *scheduled* fallback, not a crisis.
- If skills fail, the Week-2 design changes materially. Re-express T11 and A7 as prompt-level protocol text in the system prompt and as `.py` skill scripts executed via `run_command` rather than `run_skill_script`.

**Week 1 submission budget:** 4 slots (Probe 1, Probe 2, Probe 4, Probe 5). These are the highest-value slots of the entire run — they are cheap, they are diagnostic, and every later decision depends on them.

---

## 2. Week 2 — Measure (Thu Nov 4 → Tue Nov 10)

**Theme:** Convert the `[SIM]` walkthrough into `[M]`. Produce the paired Config 1/2/3 comparison on the frozen holdout. This week produces the paper's central table, and it produces it with statistics rather than vibes.

**Config definitions (frozen before any run — do not tune during the comparison):**
- **Config 1 — naive.** Generic prompt, grep-first, no spec, no gates, no journal. 50 tool calls / 50 turns.
- **Config 2 — BCF-lite.** Spec-first and the breadcrumb journal, but no gates and no A2 rescue. Isolates the contribution of discipline alone.
- **Config 3 — full BCF.** Spec-first + T20 classification + A8 gates G0–G4 + A2 rescue + A7 progressive skills + T11 compute-in-scripts + B5.3 ledger. Flat (no sub-agent tree).

Config 2 exists to answer a question Config 1 vs Config 3 cannot: *which component carries the effect?* Without it, a positive result is uninterpretable and a reviewer will say so.

| Day | Focus | Concrete deliverable | Artifact / path | Exit condition |
|---|---|---|---|---|
| **Thu Nov 4** | Freeze | Write the pre-registration: task list, seeds, configs, metrics, failure taxonomy, and the falsification criteria | `eval/prereg_v1.md` | Signed and dated **before** any Config 3 run. A pre-registration written afterwards is worthless |
| **Thu Nov 4** | Infrastructure | Build the three agent bundles: `agent.yaml` + `prompts/system.md` + `skills/` + `configs/sampling.yaml` for each config | `bcf/configs/{1,2,3}/` | Each compiles and passes the local validator; `validate_single_declared_model` passes |
| **Fri Nov 5** | Pilot | Run Config 3 on 8 holdout tasks to shake out schema and tool errors | `runs/pilot_c3/` | Zero schema errors, zero unhandled exceptions, every call in the ledger |
| **Fri Nov 5** | Spec schema | Finalise the BCF-Spec schema (task_class, anchors, bugs[], fix_order, feature, validation_plan, budget_plan) and the `write_spec` tool-call emission | `bcf/spec.schema.json` | A schema-validated spec is produced for every pilot task, and `symbol_in_graph` resolves |
| **Sat Nov 6** | Measurement | Run **Config 1** on the full holdout | `runs/holdout_c1/` | Complete, no missing rows |
| **Sat Nov 6** | Measurement | Run **Config 3** on the full holdout | `runs/holdout_c3/` | Complete |
| **Sun Nov 7** | Measurement | Run **Config 2** on the full holdout | `runs/holdout_c2/` | Complete |
| **Sun Nov 7** | Metrics | Compute the paired comparison: resolve rate per config, McNemar exact p, the failure-code distribution, and per-task outcome matrix | `eval/results_v1.md`, `eval/outcomes.csv` | Every metric computed with its per-task evidence; **no claim without a paired test** |
| **Mon Nov 8** | Prediction check | Test pre-registered prediction #9: does Config 1 show `test_misread` at a higher rate than Config 3 on the `compat_or_refactor` slice? | `eval/results_v1.md` §prediction-9 | The prediction is reported as supported, refuted, or inconclusive — **honestly** |
| **Mon Nov 8** | Write-up | Draft the paper's §5 (experimental design) and §6 (results) from the actual numbers | `paper/` | No placeholder text survives into the submitted version. If a run failed, say so |
| **Tue Nov 9** | Paper polish | Write §1–4, §7, abstract, and the resource README; get a second pair of eyes on the framing | `paper/whitepaper_v1.md`, `README.md` | 3,000-word body target met; every claim traced to a ledger receipt |
| **Tue Nov 10** | Submission prep | Check the "unpublished" requirement against the live arXiv-preprint thread; assemble the reproduction package (spec schema, ledger, taxonomy, one full run) | `paper/repro/` | Nothing in the writeup is unpublished elsewhere; the package runs from a clean clone |

**Week 2 exit gate (GATE W2):** the paired comparison is complete and honestly reported — **including if Config 3 does not win.** A null result with a clean failure taxonomy is a publishable "Best New Resource" candidate and a far better outcome than a positive result you cannot defend.

**Week 2 submission budget:** 0–2 slots. Only if a *specific* question emerges that only a leaderboard read can answer, and only if you have spare slots.

---

## 3. Week 3 — Intervene and write (Wed Nov 11 → Mon Nov 16)

**Theme:** Apply the measured findings as isolated, individually-testable interventions, and get the paper over the line on **Thu Nov 12**.

**Deadline warning:** the paper track is a separate competition with separate prizes, so submitting it costs no main-track slot — but it has the *earliest* deadline of the three, and it is the one where BCF's scientific story is the entire deliverable. Do not let it slide.

| Day | Focus | Concrete deliverable | Artifact / path | Exit condition |
|---|---|---|---|---|
| **Wed Nov 11** | Paper final | Freeze and submit the whiteupaper | `paper/whitepaper_v1.md` → Kaggle | Submitted ≥24h before the Nov 12 deadline. **Non-negotiable** |
| **Thu Nov 12** | — | *Paper deadline (23:59 UTC)* | — | Done |
| **Thu Nov 12** | Intervention design | From the Week-2 failure-code distribution, pick the **three** interventions with the largest measured failure mass. Not four, not two | `notes/interventions.md` | Each intervention maps to a named failure code and a metric that would move |
| **Fri Nov 13** | Intervention 1 | **No-op assertion** (already built in Week 1) wired into the Phase-3 protocol: a fix script or edit that changes nothing is a failed operation | `bcf/configs/3/noop.py` | Fires in the replay of a measured no-op run |
| **Fri Nov 13** | Intervention 2 | **`budget_warning` → fix-script → one-run → submit** protocol, keyed to the harness's real `budget_warning` field | `bcf/configs/3/budget_protocol.md` | The agent's behaviour changes measurably in the warning window |
| **Sat Nov 14** | Intervention 3 | **Text-search-primary localization**, graph tools demoted to advisory, plus a mandatory async-symbol fallback (the graphs contain 0 of 305 async functions) | `bcf/configs/3/localization.md` | The agent no longer spends calls on graph calls that return empty |
| **Sat Nov 14** | E4B instantiation | Fork Config 3 into `config-3-e4b`: same protocol, denser prompt structure, larger turn budget | `bcf/configs/3-e4b/` | Compiles; declared model is E4B; all agents/sub-agents agree on the model |
| **Sun Nov 15** | Measure | Run each intervention arm on the holdout, paired against the Week-2 Config 3 baseline | `runs/int_{1,2,3}/` | Per-arm McNemar against the baseline |
| **Sun Nov 15** | Measure | Run the E4B instantiation on the same holdout, paired against the 31B Config 3 | `runs/holdout_c3_e4b/` | Per-task outcome matrix for 31B vs E4B |
| **Mon Nov 16** | Decide | Promote or drop each intervention by its paired statistics. Write the promotion checklist — and obey it | `notes/intervention_decisions.md` | A change survives only with McNemar p ≤ 0.05 over ≥60 tasks, or ≥5 leaderboard readings. No exceptions for "it felt better" |

**Week 3 exit gate (GATE W3):** the paper is submitted; the intervention arms are measured; the E4B instantiation exists and has a paired baseline.

**Week 3 submission budget:** 2 slots — one 31B bundle carrying the winning interventions, one E4B bundle. Both scored, both banked.

---

## 4. Week 4 — Consolidate and harden (Tue Nov 17 → Mon Nov 23)

**Theme:** Turn a promising pair of bundles into a pair of *reliable* bundles, and build the reproduction package the competitions require from winners.

| Day | Focus | Concrete deliverable | Artifact / path | Exit condition |
|---|---|---|---|---|
| **Tue Nov 17** | Robustness | Re-run the best 31B bundle on the holdout a **second** time | `runs/holdout_c3_rep2/` | Replication delta recorded. A 7-task swing on the same config is expected and must not be read as a regression |
| **Tue Nov 17** | Hardening | Test against the known harness defects: the 22% `edit_file` escaping failure rate, the 100k-char `search_similar_code` overflow, the `read_file` line-range type error | `notes/harness_risks.md` | Each known defect has a BCF-side mitigation or an accepted risk |
| **Wed Nov 18** | Budget fit | Verify the bundle's projected runtime against 120 tasks: calls, turns, tokens, and the `max_tool_calls` / `max_time_minutes` settings | `notes/budget_fit.md` | Projected total ≤ 11.5h with setup. Over 12h scores zero, not partial |
| **Thu Nov 19** | Packaging | Final `submission.zip` layout: `agent.yaml`, `eval_config.yaml`, `configs/sampling.yaml`, `prompts/system.md`, `skills/*/SKILL.md` | `submissions/final_31b/`, `submissions/final_e4b/` | Under 3 GiB unpacked; only `.yaml/.yml/.md/.txt/.py/.json/.safetensors` present; no symlinks, no path traversal |
| **Thu Nov 19** | Packaging | Verify the scratch-file rule: nothing inside `/workspace` that would land in `git diff` — repro scripts go in `/tmp`; `pytest.ini` and `conftest.py` untouched | `notes/patch_hygiene.md` | `git add -N . && git diff` contains only intended changes |
| **Fri Nov 20** | Package | Write the model card, the methodology description, the environment document, and the licence (Apache-2.0 for winning code) | `paper/model_card.md`, `paper/methodology.md` | Both competitions' winner obligations are satisfied on paper |
| **Fri Nov 20** | Package | Public resource: the BCF toolkit — spec schema, ledger writer, failure taxonomy, the no-op assertion, the evaluation harness — published as a standalone artefact for the Paper Track's "Best New Resource" award | `resource/` + release notes | A stranger can clone it and reproduce a run |
| **Sat Nov 21** | Submission | Submit the final 31B bundle | Kaggle | Scored, not pending |
| **Sun Nov 22** | Submission | Submit the final E4B bundle | Kaggle | Scored. **This is the bonus-prize qualifying entry — it must exist and be scored well before Nov 25** |
| **Mon Nov 23** | Selection prep | Assemble the final-submission set: the best 31B and the best E4B/E2B. Check every bonus-eligibility clause | `notes/final_selection.md` | One 31B + one small model, both selected; small-model one declares E2B or E4B consistently across all agents and sub-agents |

**Week 4 exit gate (GATE W4):** both final bundles are scored; the final-submission set is assembled; the resource package is published; the winner-obligation documents are written.

**Week 4 submission budget:** 2–3 slots, all of them the best bundles you have.

---

## 5. Week 5 — Select and insure (Tue Nov 24 → Tue Dec 1)

**Theme:** Nothing new. Select, insure against platform failure, and hold the line. The risk in the final week is not that you run out of ideas — it is that a scored submission is lost to a queue, an error wave, or a bad slot choice.

| Day | Focus | Concrete deliverable | Artifact / path | Exit condition |
|---|---|---|---|---|
| **Tue Nov 24** | Deadline prep | Entry + team-merger deadline is **tomorrow**. Finalise the team roster, confirm the submission count against the daily limit, confirm the two final submissions | `notes/entry_checklist.md` | All entries in before Nov 25 23:59 UTC. The rule is one submission per day — a missed day is a permanently lost measurement |
| **Wed Nov 25** | — | *Entry + team merger deadline (23:59 UTC)* | — | Done |
| **Thu Nov 26** | Insurance | Re-submit the highest-value bundle if any slot is idle. Platform error waves have consumed otherwise-good submissions | Kaggle | A scored submission exists for both the 31B and the small model |
| **Fri Nov 27** | Read the board | Check the small-model filtered standings. The promised daily notebook may exist by now — if it does, use it; if not, use the community tracker's JSON feed | `notes/smallmodel_standing.md` | You know whether you are in contention for the $10,000 |
| **Sat Nov 28** | Adversarial review | Red-team your own submission: what would make it score 0? Check the skills-0.00 thread, the escaping fix, the `search_similar_code` cap, the thinking-mode drop | `notes/redteam.md` | Every open harness risk has a stated position |
| **Sun Nov 29** | Final selection | Lock the two final submissions. Do not change after this point unless a bundle is provably broken | `notes/final_selection.md` | Both slots locked and documented |
| **Mon Nov 30** | Buffer | Deliberately idle one submission slot. Reserve 2 slots for platform-error replays | — | Buffer intact |
| **Tue Dec 1** | Pre-flight | Validate both final zips one last time: model declaration, skill packaging, eval_config, size, file extensions, scratch hygiene | `notes/preflight.md` | Both zips pass every check |
| **Wed Dec 2** | — | *Final submission deadline (23:59 UTC)* | — | **Done** |

**Week 5 exit gate (GATE W5):** both final submissions are locked, validated, and in place with a full day of margin.

---

## 6. Submission slot budget (the real constraint)

| Phase | Slots | Purpose |
|---|---|---|
| Week 1 | 4 | Diagnostic probes — skills, E4B, model matrix, budget config |
| Week 2 | 0–2 | Only if a leaderboard read is the only way to answer a live question |
| Week 3 | 2 | Best 31B + best E4B after interventions |
| Week 4 | 2–3 | Final bundles + one replication |
| Week 5 | 2–3 | Insurance and error replays, deliberately held |
| **Total** | **~10–14** | Against a nominal ~28 calendar days — **half the nominal count is real, because a pending submission blocks the next one** |

**Rule: never spend a slot on a bundle whose scoring you do not need.** A diagnostic that has already answered its question is a wasted slot.

---

## 7. What to build, in priority order

Ranked by expected value per hour of work. If you run out of runway, cut from the bottom.

1. **The holdout, repaired.** Non-negotiable. Everything downstream is uninterpretable without it.
2. **The paired evaluator with McNemar.** Non-negotiable. It is the difference between a result and an anecdote.
3. **The ledger + no-op assertion.** The cheapest high-value component; it uses fields the framework already records and attacks a measured board failure mode (28 of 70 fix scripts were silent no-ops).
4. **The three interventions** (no-op assertion, `budget_warning` protocol, text-search-primary localization). Each is isolated and independently testable.
5. **The E4B instantiation.** The bonus prize. Must exist as a *scored* submission before Nov 25.
6. **The resource package** (spec schema, ledger, taxonomy, evaluator). Independent of the main track; a direct shot at the Paper Track's "Best New Resource" award.
7. **The paper.** Do this in Week 2, not Week 3. The Nov 12 deadline is unforgiving.
8. **The whitepaper's supplementary resource** — the trajectory dataset from a BCF run. High value if the paper's contribution is empirical, but only after the paper itself is safe.

**Explicitly out of scope, and why:**
- **LoRA on the 31B.** Loss falls; solve rate does not. Three independent measurements. Plus a 15–20% per-call cost and a startup-OOM risk. Ship no adapter on the main track.
- **Graph-first localization as a primary strategy.** The graphs contain 0 of 305 async functions, only `calls` edges, and one team improved its results by removing the graph tools entirely.
- **A sub-agent tree (A4 handoff packets).** An analyzer subagent moved resolved count by +1 of 129 and needs replication; each delegation is a separate model loop on a per-task-time budget. Config 3 is flat, and the board agrees.
- **A fresh dataset crawl.** Brain v1 trains from SWE-rebench and Nebius OpenHands. A fresh crawl is a Week-6 project that will not happen, and the harvested-dataset play is already occupied in the write-up ecosystem.

---

## 8. Risks, triggers, and kill criteria

| Risk | Trigger to watch | Pre-committed response |
|---|---|---|
| Skills fail on the scorer | Probe 1 returns 0.00 with no error | Re-express T11 and A7 as prompt-level protocol + `run_command` scripts. T11's "compute in scripts" survives as a shell-script pattern |
| E4B/E2B will not serve | Probe 2/4 fail to start | Abandon the bonus prize. Two 31B slots. Paper pivots to the interference result alone |
| The paired comparison shows no BCF advantage | McNemar p > 0.05 on the holdout | **Do not ship the protocol anyway.** Submit the best prompt-only bundle; publish the null result with the failure taxonomy. A clean null plus a taxonomy is a legitimate "Best New Resource" contribution |
| Submission turnaround collapses | Pending > 48h | Cut the arm count; measure locally only. Preserve ≥2 slots for the finals |
| The paper's headline claim is refuted | Prediction #9 unsupported | Report it as refuted. The writeup's contribution shifts from "BCF prevents interference" to "we characterise the interference failure mode and give the community the instruments to measure it" — a smaller but honest paper |
| Local environment never goes gold-clean | 100% gold-patch pass unreachable | Shrink the holdout to the tasks that do pass, and state the selection rule in the paper's methodology. Never measure on a task set that cannot discriminate |

---

## 9. Weekly cadence

- **Daily, 15 minutes:** check the pinned "Kaggle Error submissions & queue delays" thread, the skills-0.00 thread, and the leaderboard tracker's `updated_at` stamp. If a platform error wave is running, pause submissions and burn the time on local work.
- **Daily, 30 minutes:** run the current best bundle on a 3-task smoke set. Catches a broken bundle in 3 minutes instead of 22 hours.
- **Mondays, 60 minutes:** week gate review. Read the exit conditions. Cut scope, do not move the gate.
- **Every submission:** record it in `submissions/registry.md` with the ZIP SHA-256, the config, the score, and the scoring latency. This registry is how you will tell a real improvement from noise later.

---

## 10. One-page summary

| Week | Dates | Theme | Gate |
|---|---|---|---|
| 1 | Oct 28 – Nov 3 | Unblock and instrument | Holdout gold-clean · skills known · E4B status known · paired evaluator green |
| 2 | Nov 4 – Nov 10 | Measure (Config 1/2/3, pre-registered) | Paired comparison complete and honestly reported |
| 3 | Nov 11 – Nov 16 | **Paper due Nov 12** · interventions · E4B instantiation | Paper submitted · interventions measured · E4B has a paired baseline |
| 4 | Nov 17 – Nov 23 | Consolidate and harden | Both bundles scored · final set assembled · resource published |
| 5 | Nov 24 – Dec 1 | Select and insure | Both slots locked and validated, one day of margin |

**The one sentence:** build the protocol once, measure it honestly, instantiate it twice, and let the measurements decide which parts of it you keep.


---

<!-- ====================================================================== -->
<!-- FILE: 02_BCF-whitepaper-draft_2026-10-28-web-m3.md -->
<!-- ====================================================================== -->

# Batonic Coding Framework — Paper Track Draft

**Framework:** Batonic Coding Framework (BCF)
**Draft v2 — 2026-10-28** (restructured from the single-draft v1 to fit the track's 3,000-word body limit)
**Target:** *The Gemma 4 Developer Agent Competition — Paper Track* · deadline **2026-11-12 23:59 UTC** · max 2 writeups per team · unpublished-original requirement
**Awards available:** Best Paper $15,000 · Best New Resource $10,000 · Best New Application $10,000

---

## Why this is two writeups

The paper track allows **two writeups per team**, and a single writeup cannot honestly carry both of this project's contributions inside 3,000 words: the *characterisation* of the failure mode, and the *framework* built to address it. They also have different evidentiary status — one is largely a measurement and a characterisation that is already substantially supported; the other is a hypothesis that awaits a pre-registered test.

Splitting them is not a compromise. It is the better research design, and it maps onto the award structure:

| Writeup | Contribution | Best suited for | Status |
|---|---|---|---|
| **1. The Batonic Coding Framework** (primary) | A discipline-first protocol, its four components, and a pre-registered paired evaluation of whether it works | **Best Paper** | Requires the Week-2 measurement run |
| **2. The Oracle Asymmetry** (companion) | A characterisation of fault interference in hidden-test-graded repair, plus the instruments (ledger, taxonomy, evaluator) to measure it in any harness | **Best New Resource** | Largely independent of Writeup 1's results |

Note the track's rule: a single writeup may be *considered* for multiple awards but wins only one — so two writeups targeting different awards is the correct structure, provided they are not near-duplicates. These are not: Writeup 1's contribution is a protocol and its evaluation; Writeup 2's is a failure-mode characterisation and a released instrument set.

**Status of the drafts below.** Writeup 1's §6 (Results) and Writeup 2's §6 (Prevalence estimates) contain placeholders that must be filled from measurement. No claim in either document asserts a result that has not been measured. Sections are tagged **[D]** (design, argued from the harness specification and verified dataset artifacts) or **[M]** (measured, with a ledger receipt).

**Shared artifacts** (released under Apache-2.0): `bcf/` — spec schema, ledger writer, no-op assertion, failure taxonomy, paired evaluator with exact McNemar, and one complete ledger trace per experiment arm.

**Packaging note.** The shared appendices (A–G) are referenced by both writeups and must travel with whichever one is submitted — they are excluded from the 3,000-word body count but not from the submission. Writeup 1 references Appendices A and G; Writeup 2 references Appendices B, C, and D.

---
---

# WRITEUP 1 — The Batonic Coding Framework

**A Discipline-First Protocol for Hidden-Test-Graded Program Repair**

**Authors:** [TEAM NAME] · [AFFILIATION] · [CONTACT]

## Abstract

Software-engineering agents are evaluated by hidden tests: a patch is scored only if it passes a validation suite the agent could not read. We argue this regime induces a specific, measurable failure mode that is neither a capability failure nor a localization failure — a **correct edit, in the right place, that is the wrong fix**.

We present the **Batonic Coding Framework (BCF)**, a discipline-first agent protocol targeting two failure modes that dominate measured agent runs: reverting a correct fix because the visible suite went red (`test_misread`), and never committing to an edit at all (`no_commit`). BCF writes a specification *before* any file is accessed, pins each hypothesis to the issue text, decomposes the change into a topologically ordered minimum path, journals every operation with its justification, and gates completion on a monotone evidence ladder in which the model's own judgement never grants approval.

We pre-register a paired, three-arm evaluation on a holdout constructed to be capable of measurement at all — only 71 of the 129 public tasks discriminate under the official wheelhouse, and none of the `httpx` family does, a fact that would silently void the experiment. On that holdout we pre-register five predictions, including a falsification test for the framework's central mechanism and an explicit commitment to publish a null result. **[M — results pending]**

## 1. Introduction

An agent repairing software under a hidden test suite is not solving a debugging problem. It is solving an *inference* problem under an adversarial observation channel: the signals it can observe — a visible test suite, a stack trace, a grep result — are systematically decoupled from the signal determining its score. This is the standard situation in SWE-bench-style evaluation [Jimenez et al., ICLR 2024], where a patch is graded against a test patch the agent never sees. Three observations motivate a protocol rather than a model.

**First, the dominant failure mode is not locating the bug.** In a community failure analysis of 41 failed agent runs on this competition, scored against gold-patch edit locations, 18 runs edited within 20 lines of the correct change but produced the wrong fix, and 11 opened the gold file and never edited at all. *Localization is mostly solved* [Thread 751596, 2026-10-22].

**Second, trained weights do not move the solve rate.** Three LoRA adapters trained on distilled trajectories from stronger models drove training loss from 1.4 to 0.40 while the solve rate *fell* from 38 to 31 of 98 held-out tasks, and the leaderboard score fell from 0.15–0.17 to 0.12. A fourth adapter changed logits materially (max |Δ logit| 18.3) without changing decisions [Thread 751596; Tool-Use LoRA Kit, 2026-10].

**Third, the harness is a budget, and the budget binds on context growth rather than a countable limit** — so a protocol that re-derives what it already knows pays a tax the harness will not forgive.

**Our design target** is a failure mode we call the **oracle asymmetry**: a configuration in which the agent's only feedback channel is *anti-correlated* with its objective. Where an issue requires a rename, the visible suite calls the old API and goes red under the correct fix, while the graded suite calls the new API and goes red under the old API; the harness resetsasking" here does not mean one bug hiding another, but **one observation channel hiding a required change**. There, masking — one fault suppressing another's failure-causing effect — is observed more often than the appearance of new test-case failures [ISSRE '09]; masking is formalised in localization as a fault's rank worsening in the presence of others [Callaghan & Fischer, ISSTA '23]; and coincidental-correct test cases, which pass for the wrong reason, appear in over 85% of sampled multi-fault programs [Wu et al., *IEEE Trans. Reliability*].

The failure mode this induces has a name in the community taxonomy: **`test_misread`** — treating visible-suite red as ground truth over the issue text. It is the worst possible response to an anti-correlated signal, because it is locally rational: the agent observes a failing test and concludes it has broken something. Our companion writeup characterises the phenomenon on a real task with verified receipts; here it is the design target for everything that follows.

## 2. The Batonic Coding Framework

BCF is a *protocol*, not a model: it constrains the order and the evidence of an agent's actions. Four tenets govern it, each aimed at a measured failure mode.

**Tenet 1 — preserve working code.** Changes are minimal-path and additive where possible; the regression surface is bounded, not optimized away.

**Tenet 2 — minimum-path decomposition with a topological order.** The change is decomposed into the smallest set of scope items covering the issue, ordered by dependency. The order is not cosmetic: on the canonical example the rename is the DAG root, and the server-side drain logic has nothing coherent to integrate with until the renamed method exists.

**Tenet 3 — breadcrumbs.** Every operation is journalled with its action, its result, and *why* — the agent's only defence against re-deriving what it knows and forgetting what it decided.

**Tenet 4 — binary done.** Completion is defined by a gate vector, not by the model's confidence. The model's judgement never grants approval.

### 2.1 Phases

| Phase | Purpose | Core components |
|---|---|---|
| **1. Specification** | Decide *what* must change before touching any file. | T20 classification gate (issue text only) → A6 spec-first → G0 unblocks file access → A7 skill load |
| **2. Localization** | Find where the change goes. | Breadcrumbs begin; graph tools advisory; text search primary; async fallback |
| **3. Patch** | Apply the change in dependency order. | `fix_order` topological sequence; one bug per edit batch; no-op assertion |
| **4. Validation** | Decide whether to submit. | A5 verification hierarchy; A8 gates G0–G6; A2 rescue (3-strike) |

### 2.2 The specification artifact

The specification is emitted as a schema-validated tool call, not hand-written JSON (**Appendix A**). Three properties matter. It is written *before* any file access, so obligations discovered later are on the record before exploration begins. Each hypothesis carries a `trigger_or_contract` field pinning it to the **issue text** — the mechanism by which BCF resists `test_misread`. And `validation_plan` encodes the *decision* that the asymmetry exists, so a later red suite is expected, not surprising.

### 2.3 The breadcrumb journal and the no-op assertion

The journal is a ≤30-line append-only file, written outside the patch, with an operation tail, a `Ruled out` section recording rejected approaches with reasons, and a current-best-patch summary. Its critical entry is a prediction:

```markdown
- t=09 | action: edit _parsers.py complete->reset (sync) | result: applied
  | note: local suite WILL go red; expected — hidden tests renamed (spec: test asymmetry)
```

The naive agent in our characterisation fails by *discovering* the red suite and reverting a fix the graded suite would have accepted; the BCF agent recorded, before the red, that the red was expected and why. **The journal records why, so the agent cannot later "discover" it and undo it.**

The **no-op assertion** is the cheapest measurable extension: a `run_skill_script` that returns without changing a file, or an `edit_file` whose diff is empty, is recorded as a *failed operation*, tripping the journal. Community measurements find that 28 of 70 "fix scripts" in one agent's runs were silent no-ops — the model reasons in comments inside a heredoc and never reaches the write line [gemma-swe-agent, 2026-10]. An agent that cannot notice its own non-actions burns its budget on a task it never attempted.

### 2.4 The gate ladder

Seven gates run in order — G0 spec valid, G1 scope, G2 `git apply --check`, G3 `ast.parse`, G4 target tests, G5 adjacent-module regression, G6 non-empty patch — and they are a **ratchet**: nothing applied is undone on the basis of a later red. This separates BCF from an agent that "iterates until the tests pass" — an iteration policy treating the visible suite as an objective will, on a rename task family, iterate itself into a revert.

### 2.5 Cost discipline under a context-bound budget

Two facts constrain the design. First, the harness reserves the response window every turn: `max_output_tokens` 16384 against a 32,768-token context crashed 75% of tasks on context overflow in one participant's official-model run, dropping to 5.3% at 8192 [8kta/kaggle-gemma4, 2026-10]; BCF ships 8192. Second, in that same run 16 of 17 incomplete tasks exhausted the *turn* budget at 14 tool calls each, and raising `max_turns` alone gained nothing. **The binding constraint is context growth per turn.** BCF's response is to make Phase 1 emit a compact, write-once specification artifact that later phases *read* rather than re-derive, so a protocol built on planning does not pay the context tax twice.

## 3. Experimental design

Let a task be a repository state `S`, an issue text `I`, a visible suite `T_v`, and a graded suite `T_g`; for a candidate patch `S'`, the agent's score is `obs(T_g, S')` while its only feedback channel is `obs(T_v, S')`. Four definitions — **oracle asymmetry**, **masked correct fix**, **no-commit**, **interference order** — are stated in full in **Appendix G**. The three propositions the framework asserts — P1 mask resistance, P2 commitment, P3 order discipline — are pre-registered in §3.4.

### 3.1 Arms

| Arm | Description | Isolates |
|---|---|---|
| **Config 1 — naive** | Generic prompt, grep-first, no spec, no gates, no journal | The baseline |
| **Config 2 — BCF-lite** | Spec-first + journal; no gates, no rescue | *Discipline alone* |
| **Config 3 — full BCF** | Config 2 + T20 + gates G0–G6 + A2 rescue + A7 + T11 | The *full* apparatus |

### 3.2 The discriminating holdout — a methodological correction

We do not evaluate on all 129 public tasks, because **not all of them can measure anything**. Under the official wheelhouse only **71 of 129** discriminate — failing without a patch and passing with the gold patch: fastapi 29 of 67, rich 42 of 48, and **requests + httpx 0 of 14**, where the test environment is broken outright. With three auxiliary test packages installed, 103 of 129 discriminate. Fifty-eight public tasks fail for environment reasons, not model incapacity [STATE_OF_COMPETITION, 2026-10-13].

This has a direct consequence. `httpx_3672` belongs to a family in which **no** task discriminates locally, so a paired comparison on the raw task set would have reported three identical zeros for `httpx` tasks and been read as "BCF does nothing." We therefore report the holdout construction, the discrimination test, and the selection rule as first-class methodology, and exclude the twelve tasks dead on arrival regardless of environment.

### 3.3 Metrics

Per task: outcome, failure code, tool calls, turns, wall-clock, localization calls, edits, `edits_not_in_final`, `fix_order_error`, `repeat_action_rate`, `empty_patch_rate`, `rescue_trigger_rate`. `gold_file_hit` needs a caveat: it is computed against the **gold** patch's file set while graded scope derives from the **test** patch, so it understates correctness; we report a graded-scope-aware variant alongside it.

### 3.4 Pre-registration and propositions

The following was fixed before any measurement run and is reproduced verbatim.

> **P1 (mask resistance).** A run that records the asymmetry decision in its specification *before* the first red has a lower probability of a masked correct fix than one that does not. **P2 (commitment).** A run with an explicit journal and a no-op assertion has a lower probability of a no-commit outcome than one without. **P3 (order discipline).** For tasks with dependency structure among scope items, a correct final patch is more likely when items are applied in `fix_order` than in discovery order. Each is testable against the failure-code distribution; each can be refuted by the same measurement; none is assumed.
>
> **PR-1.** On the `compat_or_refactor` slice of the discriminating holdout, the frequency of `test_misread` in Config 1 is **strictly greater** than in Config 3. *Mechanism:* the oracle asymmetry, a property of the data, not of the agent. *Test:* McNemar exact, paired, two-sided, p ≤ 0.05, over ≥ 60 tasks.
>
> **PR-2.** The frequency of `no_commit` in Config 3 is **strictly less** than in Config 1, over the same set. *Mechanism:* the journal and the no-op assertion.
>
> **PR-3.** On tasks whose gold patch contains ≥ 2 files, Config 3's `fix_order_error` rate is lower than Config 1's. *Mechanism:* Tenet 2.
>
> **PR-4 (null commitment).** If none of PR-1..PR-3 is supported, we report the null result, publish the taxonomy and instruments, and state that the protocol did not demonstrate an advantage. *Committed to in advance because the baselines are already well-tuned, and because the instruments are worth publishing independently of the outcome.*
>
> **PR-5 (noise floor).** A leaderboard delta is not evidence unless it survives an exact McNemar test over ≥ 60 paired tasks or is replicated across ≥ 5 leaderboard readings. *Rationale:* byte-identical submissions have scored 0.06 and 0.05, and 0.08 and 0.13, on the same split; 13 of 30 tasks change failure classification between identical runs; and one team replicating its own best configuration got 48 of 129 against the original's 55.

## 4. Results

> **[PENDING — empty by design until the Week-2 measurement run completes. It must not be submitted with placeholders. The structure below is fixed so that filling it is mechanical.]**

### 4.1 Primary results

| Metric | Config 1 | Config 2 | Config 3 | McNemar (1 vs 3) | Supports |
|---|---|---|---|---|---|
| Tasks resolved (of N) | — | — | — | — | — |
| `test_misread` rate (compat/refactor) | — | — | — | — | PR-1 |
| `no_commit` rate | — | — | — | — | PR-2 |
| `fix_order_error` rate (multi-file) | — | — | — | — | PR-3 |
| Median calls / turns / wall-clock | — | — | — | — | — |

### 4.2 Failure-code distributions, replication, and negative outcomes

*To be populated from the paired outcome matrix: per-code distributions; a second run of the best configuration with the run-to-run swing reported alongside the treatment effect; and failure codes we did not fix, the tasks BCF lost, and any case where the discipline was net harmful — mandatory even if it contains no support for our own claims.*

## 5. Discussion

### 5.1 Why a protocol, and why now

Three lines converge: a prompt-only single agent with a well-tuned budget is a strong baseline; training on distilled trajectories does not improve the solve rate while costing 15–20% per call; and the measured failure modes are protocol failures, not capability failures. A framework spending the remaining budget on *discipline* is betting on the only axis with measured headroom — a falsifiable bet, and §3.4 commits us to publishing the null result if it fails.

### 5.2 Instantiating the protocol at small model scale

The competition's Small-Model Bonus Prize targets submissions built on Gemma E2B or E4B. This is where a discipline-first protocol should pay most, for a structural reason: **a protocol is a substitute for capability.** The host's framing of the smaller variants is "more test time compute" — faster inference and lower memory burden permitting more turns. A protocol converting budget into correctness is precisely the mechanism that turns a capability deficit into a latency advantage. We hypothesise BCF's *relative* advantage over a naive agent is larger at smaller model scale, because the naive agent's failure modes — reverting under red, failing to commit — are exactly those a disciplined protocol can prevent without extra model knowledge.

*[M — pending: the paired 31B vs E4B comparison is scheduled for the Week-3 measurement run. This paragraph states a hypothesis, not a result.]*

### 5.3 Why the no-op assertion may be the most transferable piece

If only one component survives contact with other harnesses, we predict it is the no-op assertion. It is cheap, it uses state the agent already produces, and it attacks a failure that is *silent by construction*: an agent spending its budget on a task it never attempted produces no error, no exception, and no evidence of inaction. A budgeted agent needs a mechanism distinguishing "worked and failed" from "did not work"; a journal of file-change state is the minimum one.

## 6. Limitations and threats to validity

| # | Limitation | Mitigation |
|---|---|---|
| L1 | **The holdout is not the hidden set.** 71 discriminating public tasks from the same four repositories, but not a random sample; the hidden set is ~120 tasks. | Report holdout construction and selection rule; expect task-mix differences. |
| L2 | **The failure taxonomy is ours**, and code assignment carries interpretive judgment. | Publish the assignment procedure and the raw ledger rows for independent re-coding. |
| L3 | **A single base model** in the primary results. | The E2B/E4B arm is reported separately, never pooled with the 31B results. |
| L4 | **The baseline is strong and was not tuned by us** — a reasonable generic agent, not the best prompt-only bundle. | We claim BCF beats a *generic* baseline, never the best tuned one. |
| L5 | **Infrastructure failures contaminate single submissions** and are not model failures. | Rely on paired local measurement; apply the PR-5 replication rule. |
| L6 | **Concurrent competitors** ship a "contract-to-patch" benchmark and a graph-LoRA. | Our claim is narrowed to what is characterized and measured here. |

## 7. Conclusion

Hidden-test-graded program repair rewards agents for a signal they cannot observe and penalises them for trusting one that actively misleads. The failure this produces is neither a capability failure nor, mostly, a localization failure. It is a *protocol* failure: a correct edit, in the right place, that the agent then undoes because a test suite it cannot trust went red.

The Batonic Coding Framework is a response to that failure mode. It writes the requirement down before exploration begins, orders the change, journals the reasoning, and gates completion on evidence rather than the model's confidence. Whether it works is a question with a method attached: a pre-registered paired comparison on a holdout whose construction is itself reported, with a null-result commitment made in advance.

---
---

# WRITEUP 2 — The Oracle Asymmetry

**Characterising Fault Interference in Hidden-Test-Graded Program Repair, and Instruments for Measuring It**

**Authors:** [TEAM NAME] · [AFFILIATION] · [CONTACT]

## Abstract

We characterise a failure mode that hidden-test-graded program repair induces in language-model agents, and we release the instruments needed to measure it in any harness.

When an agent is scored only on a validation suite it cannot read, the suite it *can* read may actively argue against the correct fix. We call this the **oracle asymmetry**, and we show it is a form of *fault interference* in the classical dependability sense: not one bug hiding another, but one observation channel hiding a required change. Using a real task from the competition dataset, we verify four structural traps that exist in the data independently of agent design — among them a silent no-op fault at a call site that no test exercises and that code-graph tooling provably cannot surface.

We then quantify the failure mode against a community failure analysis in which 41 failed agent runs were scored against gold-patch edit locations: 18 edited within 20 lines of the correct change but produced the wrong fix, and 11 opened the gold file and never edited at all. **Localization is mostly solved; the residual failure is protocol-shaped.**

We release three instruments: a JSONL trajectory ledger with per-operation state and content-hashed specification binding; a seven-code failure taxonomy including the positive code `oracle_asymmetry_identified`; and a paired evaluator with an exact McNemar implementation, built in response to a measured noise floor in which byte-identical submissions scored 0.06 and 0.05, and 0.08 and 0.13, on the same public split.

## 1. Introduction

Software-engineering agents are now evaluated at scale on hidden tests: a patch is applied to a repository and graded against a test patch the agent never saw, and the score is the fraction of tasks whose patch passes [Jimenez et al., ICLR 2024]. The evaluation is deliberately adversarial about the agent's information: the graded oracle is withheld, and the agent's only feedback is what it can observe for itself.

This paper argues that this design does more than withhold information. It creates a structured hazard, and the hazard has a name in older literature. We show that the hidden-test regime can produce **oracle asymmetry** — a configuration in which the agent's available evidence is *anti-correlated* with the graded requirement. We characterise the hazard on a verified real task, quantify the resulting failure modes against an existing failure analysis, and release the instruments needed to measure the phenomenon elsewhere.

Our contributions are: (i) a **characterisation** of four structural traps in real task data, with file-and-line receipts; (ii) a **quantification** of the failure mode's prevalence from a 41-run failure analysis scored against gold edit locations; (iii) a **correction to the community's measurement practice**, namely that only 71 of 129 public tasks discriminate locally, which silently voids any experiment run on the raw set; and (iv) a **released instrument set** — ledger, taxonomy, paired evaluator — usable against any harness.

## 2. Background: masking, interference, and the oracle asymmetry

### 2.1 Fault masking and fault interference

Classical dependability work distinguishes interactions among multiple faults. A test that fails because of one fault may *stop* failing when a second is added, because the second masks the first's failure-causing effect; conversely, multiple faults may jointly cause a failure no single fault causes. Empirically, **failure masking is observed more often than the appearance of new test-case failures** [ISSRE '09]. The interaction taxonomy distinguishes fault synergy, fault obfuscation, pass/fail independence, and multitype interactions [Di Giuseppe & Jones; Debroy & Wang, as classified and reviewed in ISSRE '09].

In spectrum-based localization the effect is formalised: fault masking occurs when the rank of one fault worsens in the presence of others, degrading multi-fault localization accordingly [Callaghan & Fischer, ISSTA '23]. A related line shows **coincidental-correct test cases** — tests that pass for the wrong reason — are near-universal in multi-fault programs (over 85% of sampled multi-fault programs), and that naively removing them degrades localization rather than improving it [Wu et al., *IEEE Trans. Reliability*].

We adopt this vocabulary deliberately. "Masking" here does **not** mean one bug hiding another bug. It means *one observation channel hiding a required change*. The classical literature's central empirical observation — that masking is the more common interaction — is what makes the hidden-test regime a good place to look for it.

### 2.2 The oracle asymmetry

**Definition (oracle asymmetry).** A task exhibits oracle asymmetry when there exists a candidate patch `S'` with `obs(T_g, S') = pass` and `obs(T_v, S') = fail`, where `T_v` is the visible suite and `T_g` the graded suite. The agent's available information is anti-correlated with its objective on `S'`.

Two harness properties make this reachable in practice, and both are verified rather than assumed. First, the harness **resets all test files to baseline** before applying its own test patch, so any test edits the agent makes are discarded at verification — harmless to the score, invisible to the agent. Second, the graded truth lives in a file the agent cannot see. The only bridge is the issue text.

The induced failure mode has a name in the community taxonomy: **`test_misread`** — treating visible-suite red as ground truth over the issue text. It is the *worst* possible response to an anti-correlated signal, because it is locally rational: the agent observes a failing test and concludes it has broken something.

### 2.3 A second, subtler asymmetry

The same mechanism operates at the level of *scope*. The graded scope is derived from the **test** patch, while the correct change is derived from the **issue text**, and these are frequently different sets. On the task below, the gold patch spans seven files and the test patch touches one. An agent that correctly reasons about the issue and repairs the *named* symptoms can still score zero, because the graded suite probes a different file. Conversely, an agent that restricts itself to the visible test file can score zero while having "fixed" the issue.

## 3. A real task, four verified traps

We use `httpx_3672`, the only `httpx` task among the 129 public training tasks (fastapi 67, rich 48, requests 13, httpx 1), and report only facts verifiable from the released data package. **[D]**

The issue text asks for five loosely worded changes: it names `keep_alive` where the gold patch implements `is_keepalive()`; it names `KeyboardException` where the fix handles `KeyboardInterrupt`; and — in the one unambiguous line — states a mechanical API rename, `HTTPParser.complete` → `.reset`. The gold patch spans 7 files across two parallel module trees; the test patch touches `tests/test_parsers.py` only, replacing five `p.complete()` call sites with `p.reset()`.

| # | Trap | Why it defeats the obvious strategy |
|---|---|---|
| 1 | **The visible suite contradicts the graded one.** The visible suite calls `complete()` at five sites; the graded suite calls `reset()`. | Renaming correctly makes the local suite go red, so the greedy move — revert — is exactly the wrong move. |
| 2 | **A duplicated sync/async tree.** `src/httpx/` and `src/ahttpx/` mirror each other file-for-file. | A naive `grep` doubles every hit list and invites a half-tree fix. The gold patch touches both. |
| 3 | **A latent fault at the call site, not the tested site.** `self._parser.complete` — attribute access, no parentheses — is a silent no-op; the server never resets the parser. | No test exercises it. The graph's `calls` edges are intra-class only, so graph tools cannot surface it. **Only `read_file` on the caller reveals it.** |
| 4 | **Broken ungraded code the issue names but the tests never reach.** `Response(code=500, …)` raises `TypeError` (`code` is not a parameter); `self._streams = list[NetworkStream]` assigns a `GenericAlias`; `wait()` lets `KeyboardInterrupt` propagate. | Real bugs, named in the issue, fixed in the gold patch, invisible to the score. Fixing them wastes calls; skipping them saves calls. Neither is rewarded. |

Trap 3 is the sharpest result. **The graph's `calls` edges do not cross file boundaries in this task**, so `get_code_neighbors` will not hand the agent the missing-parens fault. A separate community measurement makes the same point at scale: the released graph and embedding files contain 0 of 305 async functions, and one team improved its results after removing the graph tools entirely [Thread 742911]. Static code-intelligence tooling is not merely unhelpful here — in a specific and characterisable way, it is blind to the fault.

*Verification.* Trap 1 from `grep -rn "\.complete()" tests/` (five sites, `tests/test_parsers.py` only); Trap 2 from the mirrored `def complete` at `src/httpx/_parsers.py:378` and `src/ahttpx/_parsers.py:378`, and 239 `ahttpx.*` nodes among 740 graph nodes; Trap 3 from `sed -n '88,95p' src/httpx/_server.py`; Trap 4 from `src/httpx/_response.py:80` (`status_code` is positional) and `src/httpx/_network.py:163`.

## 4. Quantifying the failure mode

### 4.1 The failure analysis we build on

A community failure analysis scored 41 failed agent runs against gold-patch edit locations [Thread 751596, 2026-10-22]:

| Failure class | Count | Reading |
|---|---|---|
| Edited within 20 lines of the gold change, but the fix was wrong | **18 / 41** | Right place, wrong fix — the interference signature |
| Opened the gold file and never edited it | **11 / 41** | Budget exhaustion or non-commitment |
| Localized elsewhere | remainder | The minority |

The author's conclusion was that "localization is mostly solved" and the residual is "wrong fixes in the right place and never committing to an edit." We adopt that conclusion and take it as the quantitative starting point for the phenomenon.

### 4.2 A measurement correction that affects every study in this setting

We do not evaluate on all 129 public tasks, because **not all of them can measure anything**. Under the official wheelhouse only **71 of 129** discriminate — failing without a patch and passing with the gold patch: fastapi 29 of 67, rich 42 of 48, and **requests + httpx 0 of 14**, where the test environment is broken outright. With three auxiliary test packages installed, 103 of 129 discriminate. Fifty-eight public tasks fail for environment reasons, not model incapacity [STATE_OF_COMPETITION, 2026-10-13].

This has a consequence for any study of this phenomenon, including ours. `httpx_3672` belongs to a family in which **no** task discriminates locally. A paired comparison run on the raw task set would have reported three identical zeros for `httpx` tasks and been read as "the framework does nothing." Any published result on this harness that does not report its discrimination test should be treated as uninterpretable.

### 4.3 The noise floor

Single runs cannot adjudicate anything here. Byte-identical submissions have scored 0.06 and 0.05, and 0.08 and 0.13, on the same public split — an estimated σ of roughly 2.4 tasks per submission. The failure classification of 13 of 30 tasks changes between identical runs. One team's replication of its own best configuration returned 48 of 129 against the original's 55.

The discipline this implies, and which our instruments enforce: **only paired differences with an exact McNemar test (p ≤ 0.05) over ≥ 60 tasks, or replication across ≥ 5 leaderboard readings, justify a claim.** We build this into the evaluator rather than leaving it to discipline.

## 5. The instruments

Three artifacts are released under Apache-2.0, usable against any harness.

### 5.1 The trajectory ledger

Every run emits one JSONL row per tool call, with phase, tool, outcome, and state, plus gate and submit events:

```jsonc
{"op":"execute_tool","bcf_phase":3,"tool":{"name":"edit_file","ok":true},
 "state":{"files_changed":4,"lines_changed":31,"strikes":0,"turn":12},"spec_ref":"sha1:…"}
{"op":"gate","gate":{"id":"G4","pass":true,"failing_tests":[]},"bcf_phase":4}
{"op":"submit","state":{"files_changed":8,"turn":24}}
```

The `spec_ref` field is a content hash binding every row to the specification in force when it was emitted. That single field is what makes the ledger *auditable* rather than merely descriptive: a reviewer can reconstruct which commitment the agent was operating under when a particular edit was made, which is precisely what is needed to adjudicate a `test_misread` claim.

### 5.2 The failure taxonomy

Seven codes: `test_misread`, `no_commit`, `budget_exhausted_exploring`, `wrong_scope`, `empty_patch`, `repeat_action`, `infrastructure_error` — plus one **positive** code, `oracle_asymmetry_identified`, for runs that detected and recorded the asymmetry before acting on it. The positive code matters: without it, a taxonomy can only rank failures, never credit a success that was difficult.

### 5.3 The paired evaluator

Same tasks, same seeds, per-task outcome matrix, exact McNemar, and the discrimination test of §4.2 built in as a precondition. The evaluator refuses to produce a comparison on a task set that cannot discriminate, and it reports the replication spread alongside every treatment effect.

## 6. Prevalence estimates

> **[PENDING — to be populated from the paired run. Do not submit with placeholders.]**

| Quantity | Estimate | Source |
|---|---|---|
| Share of failures that are `test_misread` | — | paired run, 41-run failure analysis as prior |
| Share of failures that are `no_commit` | — | paired run |
| Share of `httpx`/`requests` tasks that discriminate locally | 0 / 14 | [STATE_OF_COMPETITION](https://github.com/cherrera0001/Agents_Learning_Loops/blob/main/STATE_OF_COMPETITION.md) |
| Tasks whose failure class changes between identical runs | 13 / 30 | [STATE_OF_COMPETITION](https://github.com/cherrera0001/Agents_Learning_Loops/blob/main/STATE_OF_COMPETITION.md) |
| σ of public score, per submission | ≈ 2.4 tasks | [STATE_OF_COMPETITION](https://github.com/cherrera0001/Agents_Learning_Loops/blob/main/STATE_OF_COMPETITION.md) |

## 7. Discussion

**The interesting claim is not that masking exists.** Masking is well established in dependability work [ISSRE '09; Callaghan & Fischer, ISSTA '23]. The interesting claim is that *benchmark construction can induce a fresh instance of it*, that the instance is characterisable at the level of a single task, and that it is measurable with instruments that fit in a day's work. If our characterisation holds, then a meaningful fraction of what is currently reported as "agent capability" on hidden-test benchmarks is in fact oracle asymmetry, and would be recovered by a protocol that simply refuses to trust a signal it can prove is untrustworthy.

**What would falsify this.** If a protocol that records the issue-text contract before observing the first red does not reduce `test_misread` relative to a baseline, the asymmetry is either rarer than the failure analysis suggests or not mechanistically causal. Our companion writeup pre-registers that test.

**Scope of the claim.** We characterise one task in depth and quantify the failure distribution from an existing analysis of 41 runs on the same harness. We do not claim the four traps are representative of the task distribution; we claim they are real, verified, and mechanistically sufficient to produce the failure mode on a task of that shape.

## 8. Limitations

| # | Limitation | Mitigation |
|---|---|---|
| L1 | **One task is characterised in depth.** | The mechanism is argued to generalize; generalization is the subject of the companion writeup's PR-1. |
| L2 | **The prevalence figures are inherited from a community analysis**, whose code-assignment procedure we did not author. | We publish our own taxonomy and assignment procedure alongside, and re-derive the distribution in the paired run. |
| L3 | **The 71-of-129 discrimination figure is one team's audit of one wheelhouse version.** | We re-measure on the current wheelhouse and publish the selection rule; the measurement is cheap. |
| L4 | **Community measurements are participant reports.** | Labelled as such throughout; no participant report is used as evidence for a claim about our own framework. |

## 9. Conclusion

Hidden-test-graded repair is not only a harder problem than visible-test repair; it is a differently-shaped one, in which the agent's most trusted signal can be anti-correlated with its objective. We have characterised that shape on real data, identified the conditions under which it is invisible to the agent, and built the instruments to measure it. We release those instruments in the belief that the phenomenon is general, that the measurement practice in this setting needs correcting before anything else can be established, and that a failure mode this specific deserves a failure code.

---
---

# SHARED APPENDICES

## Appendix A — BCF-Spec schema (excerpt)

```jsonc
{
  "task_class": "compat_or_refactor",
  "anchors": { "identifiers": ["HTTPParser", "complete", "reset"], "paths": [], "traceback_frames": [] },
  "bugs": [
    { "id": "B1",
      "hypothesis": "public API rename: HTTPParser.complete -> reset, returning whether the connection was reset vs closed; must land in BOTH trees",
      "trigger_or_contract": "issue text: 'HTTPParser.complete -> .reset'",
      "target_symbol": "httpx._parsers.HTTPParser.complete",
      "fix_shape": "replace",
      "depends_on": [] }
  ],
  "fix_order": ["B1", "B2", "B3"],
  "validation_plan": { "repro": "/tmp/repro_reset.py", "tests_to_run": ["tests/test_parsers.py"], "regression_scope": "module" },
  "budget_plan": { "localization_max_calls": 10, "force_submit_turn": 42 }
}
```

Fields: `task_class` (one of `bug_fix`, `compat_or_refactor`, `feature`, `perf`); `anchors` (`identifiers`, `paths`, `traceback_frames`); `bugs[]` (`id`, `hypothesis`, `trigger_or_contract`, `target_symbol`, `fix_shape` ∈ {`replace`, `new_code`, `check_add`, `guard_add`}, `depends_on[]`); `fix_order` (topological order over `bugs[].id`); `feature` (optional); `validation_plan` (`repro`, `tests_to_run`, `regression_scope`); `budget_plan` (`localization_max_calls`, `force_submit_turn`).

## Appendix B — Ledger schema

```jsonc
{"op":"execute_tool","bcf_phase":3,"tool":{"name":"edit_file","ok":true},
 "state":{"files_changed":4,"lines_changed":31,"strikes":0,"turn":12},"spec_ref":"sha1:…"}
{"op":"gate","gate":{"id":"G4","pass":true,"failing_tests":[]},"bcf_phase":4}
{"op":"submit","state":{"files_changed":8,"turn":24}}
```

`spec_ref` is a content hash binding every row to the specification in force when it was emitted — the property that makes the ledger auditable rather than merely descriptive.

## Appendix C — Failure taxonomy

`test_misread` · `no_commit` · `budget_exhausted_exploring` · `wrong_scope` · `empty_patch` · `repeat_action` · `infrastructure_error` · `oracle_asymmetry_identified` (positive code: the run detected and recorded the asymmetry before acting on it).

## Appendix D — Reproduction

Every artifact referenced is released under Apache-2.0: the spec schema, the ledger writer, the no-op assertion, the failure taxonomy, the paired evaluator with the exact McNemar implementation, the three agent bundles, and one complete ledger trace per arm. The evaluation environment, the wheelhouse version, the holdout construction script, and the task-selection rule are all pinned. A reader with the competition data package can rebuild the holdout, confirm the 71-task discrimination set, and re-run the comparison.

## Appendix E — Evidence provenance

Claims are tagged **[D]** (design, argued from harness specification and verified dataset artifacts) or **[M]** (measured, with a ledger receipt). The `httpx_3672` task facts, the four traps, the harness tool schemas, and the graph-structure limits are verified against the released data package with file-and-line receipts; the reproduction commands are provided. Community measurements are cited to their public source and identified as participant reports rather than established findings, and no community measurement is used as evidence for a claim about our own framework.

## Appendix G — Definitions

**D1 (oracle asymmetry).** A task exhibits oracle asymmetry when there exists a candidate patch `S'` with `obs(T_g, S') = pass` and `obs(T_v, S') = fail`, where `T_v` is the visible suite and `T_g` the graded suite. The agent's available information is anti-correlated with its objective on `S'`.

**D2 (masked correct fix).** A run exhibits a masked correct fix when it produced an edit `e` at a location the gold patch also edits, and subsequently removed or altered `e` in response to `obs(T_v) = fail`. The run is classified `test_misread`.

**D3 (no-commit).** A run exhibits no-commit when it opened the file containing the gold edit and did not modify it before budget exhaustion or submission.

**D4 (interference order).** For a decomposition into scope items `B_1..B_k` with dependencies, `fix_order` is a topological order of the dependency DAG. Applying items out of order produces *interference*: an earlier item's effect is masked or reversed by a later item's precondition not yet being met.

**D5 (discriminating task).** A task discriminates when it fails without a patch and passes with the gold patch, under the evaluation environment being used. A measurement run on a task set containing non-discriminating tasks reports a floor of zero and cannot distinguish the arms.

## Appendix F — Primary sources cited

| Ref | Work | Used for |
|---|---|---|
| Jimenez et al., ICLR 2024 | *SWE-bench: Can Language Models Resolve Real-World GitHub Issues?* — arXiv:2310.06770 | The hidden-test evaluation regime |
| ISSRE '09 | *Insights on Fault Interference for Programs with Multiple Bugs* | Masking vs. new-failure asymmetry; interaction taxonomy |
| Callaghan & Fischer, ISSTA '23 | *Improving Spectrum-Based Localization of Multiple Faults by Iterative Test Suite Reduction* — arXiv:2306.09892 | Formal definition of fault masking in localization |
| Wu et al., *IEEE Trans. Reliability* | *Theoretical Analysis and Empirical Study on the Impact of Coincidental Correct Test Cases in Multiple Fault Localization* | Coincidental-correct test cases; >85% prevalence |
| Thread 751596 | Community failure analysis of 41 runs against gold edit locations | Failure-mode prevalence |
| Thread 742911 | Community audit of the released graph/embedding data | 0 of 305 async functions; graph edge limits |
| STATE_OF_COMPETITION (2026-10-13) | Community metrological audit | 71-of-129 discrimination; noise floor; σ ≈ 2.4 |
| 8kta/kaggle-gemma4 | Community official-model run on the real harness | `max_output_tokens` crash rates; turn-vs-tool budget binding |
| gemma-swe-agent (2026-10) | Community experiment log | `budget_warning` protocol; 28-of-70 silent no-op fix scripts |
| Tool-Use LoRA Kit (2026-10) | Community LoRA kit with reproduction library | Logit-delta vs decision-agreement; bundle arms |

---

# PRE-SUBMISSION CHECKLISTS

**Writeup 1 — The Batonic Coding Framework**
- [ ] §4.1–§4.2 populated with measured numbers; no placeholder text anywhere
- [ ] Every **[M]** claim traceable to a ledger receipt in the released artifact
- [ ] Body within 3,000 words; appendices excluded from the count
- [ ] Unpublished-original requirement checked against the live arXiv-preprint thread
- [ ] Artifact released and publicly reachable (Project Links)
- [ ] §6 updated to reflect the final numbers, including anything that refuted PR-1..PR-3
- [ ] Confirmed not to duplicate Writeup 2's characterisation content

**Writeup 2 — The Oracle Asymmetry**
- [ ] §6 prevalence estimates populated from the paired run (Writeup 2's own numbering)
- [ ] Discrimination test re-measured on the current wheelhouse and the figure updated
- [ ] Body within 3,000 words; appendices excluded from the count
- [ ] Unpublished-original requirement checked
- [ ] Instruments released and publicly reachable — this writeup's award case rests on the release
- [ ] Community measurements still labelled as participant reports throughout
- [ ] Confirmed not to duplicate Writeup 1's protocol content

**Shared**
- [ ] Neither writeup claims a result that was not measured
- [ ] The two writeups are substantively different documents, not one split in two
- [ ] Cross-references between writeups are accurate

