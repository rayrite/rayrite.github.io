# COMBINED MARKDOWN - combine

_Generated 2026-11-20 04:26:55 | 4 files | folder: D:\stuff\docs\taylor_fv\github\rayrite.github.io\cvx\kaggle2\items\combine_

## Contents

1. 00-intel-brief-2026-11-20.md
2. 01-thread-manifest-2026-11-20.md
3. 02-raw-forum-digest-2026-11-11-to-2026-11-20.md
4. 03-chronological-forum-roundup-2026-10-31-to-2026-11-20.md

---

<!-- ====================================================================== -->
<!-- FILE: 00-intel-brief-2026-11-20.md -->
<!-- ====================================================================== -->

# Kaggle Competition Intelligence Brief — Gemma 4 Developer Agent
**Date:** 2026-11-20 | **Sweep Window:** 2026-11-11 to 2026-11-20  
**Sources:** Kaggle Discussion Board (51 active threads captured via CDP Chrome instance), Public Regular Leaderboard (6,228 teams), Official Small Model Bonus Leaderboard Notebook (100 teams).
---
## 1. Executive Summary & Top Developments

### A. Metric Bug Patch: The 0.29 Breakthrough Was Rescored (Ceiling Resets to 0.24)
- **The Event:** On November 18, Kaggle Staff (Ryan Holbrook) announced in thread #760126 that a **bug in the evaluation metric** was allowing certain agent submissions to achieve improperly high scores.
- **The Action:** The metric was patched and affected submissions were rescored. Team **Yurnero** (who previously held the lone 0.29 score) was rescored/removed from the top rank.
- **Current Status:** The public leaderboard ceiling has dropped back to **0.24**. Exactly 14 teams are now tied at Rank 1 with a score of 0.24. Rank 1 is held by **Yike Xu** (weiyun22021) based on submission timestamp.

### B. Official Tie-Breaking & Evaluation Variance Confirmed
- **Tie-Breaking Rule:** Ryan Holbrook confirmed on Nov 18: *'As in all competitions, ties are resolved by submission date. Earlier submissions win.'* In a tight tier like 0.24, earlier submissions hold the medal positions.
- **Non-Determinism on Private Set:** In response to competitor queries about deterministic inference, staff clarified that continuous batching and agent execution environments exhibit inherent variance across task sets, meaning generalization cannot be equalized simply by setting seeds.

### C. Bonus Prize Track: Small Model Development ($10,000 Standings)
- **Bonus Tracking Notebook:** The daily tracking notebook (`ryanholbrook/gemma-4-developer-agent-small-model-leaderboard`, v33) is live and tracks Gemma E2B / E4B submissions.
- **Current Bonus Leaders:**
  - **Rank 1 (Tied, Score 0.12):** `amunozo` and `Tergel Munkhbat`.
  - **Rank 3–13 (Tied, Score 0.10):** 11 teams including `Amanie El-Hajj`, `Smart Manoj`, `Civitasmass`, `Aji Samudra`, `¯\_(ツ)_/¯ MrSheep`, `DrewStuck`, `Alex Air`, `Raymang0`.
- **Crucial Requirement:** A small-model submission **must be one of the team's two selected final submissions** at competition close to be eligible for the $10,000 prize.

### D. Japan Open Data Lab's 1,800-Trial Study (Thread #760014)
- Competitor *Japan Open Data Lab* withdrew and published comprehensive benchmark measurements across 1,800+ offline trials of Gemma 4 E4B:
  1. **Thinking Budget Sweet Spot:** Long thinking (`think=4096`) scored 10/114 (8.8%), whereas `zero-think` scored 16/114 (14.0%). The optimal custom balance was **768–1024 thinking tokens** (15/114, 13.2%).
  2. **Do Not Shrink Output Window:** Cutting `max_output_tokens` 4096 → 2560 doubled file-edit errors (53 → 121) due to JSON truncation mid-tool-argument.
  3. **Thinking is Needed for Tool Calls:** Fully suppressing thought output (`include_thoughts: false`) exploded tool-argument JSON syntax errors from 3 to 132.
  4. **LoRA Distillation Pitfall:** Distilling trajectories from a 31B teacher onto 4B caused the 4B agent to adopt long, overly cautious exploration habits that blew through time limits and hurt generalization on unseen tasks (dev set dropped from 4/20 to 3/20; DPO collapsed to 1/20).
  5. **Run Variance:** 10 identical runs of the same config yielded scores from 11 to 15 (mean 12.90, SD 1.52) despite `temperature=0.0`.

### E. Severe Submission Queue Congestion & Nullable Bug
- Submissions made on November 9 suffered widespread hangs in `PENDING` / `Notebook Running` for up to 5 days across at least 15 teams.
- **Nullable Config Bug (Thread #760140):** In Getting Started notebook v3, having `max_tool_calls: null` or `max_time_minutes: null` in `eval_config.yaml` crashes with `TypeError: int(None)` during budget parsing. Teams must pass explicit integers or omit the keys.

### F. Crucial Upcoming Deadlines
- **November 25, 2026 (23:59 UTC):** Notebook publishing disabled deadline (`kernelsPublishingDisabledDeadline`). Notebooks must exist prior to this date.
- **December 2, 2026 (23:59 UTC):** Final submission deadline (main track and small-model bonus track).

---
## 2. Regular Public Leaderboard Analysis

**Total Registered Teams:** 6,228 (+789 new teams since Nov 11)  
**Score Ceiling:** **0.24** (Held by 14 teams)  

### Top 15 Regular Leaderboard Standings

| Rank | Score | Team Name | Team Leader | Tier | Entries | Last Submission (UTC) | Movement since Nov 11 |
|---|---|---|---|---|---|---|---|
| 1 | **0.24** | Yike Xu | weiyun22021 | CONTRIBUTOR | 9 | `2026-11-17T03:31:22` | Rank: 2 → 1 (Score 0.24) |
| 2 | **0.24** | MUHAMMED IDRIS BIN YACOOB | muhammedidris28 | CONTRIBUTOR | 24 | `2026-11-07T23:49:25` | Rank: 3 → 2 (Score 0.24) |
| 3 | **0.24** | SAVE | chenshengabc | MASTER | 34 | `2026-11-19T00:06:03` | Rank: 4 → 3 (Score 0.24) |
| 4 | **0.24** | chizhu | chizhu2018 | GRANDMASTER | 11 | `2026-11-18T21:24:50` | Rank: 5 → 4 (Score 0.24) |
| 5 | **0.24** | pluris | pluris | CONTRIBUTOR | 2 | `2026-10-28T10:19:33` | Rank: 6 → 5 (Score 0.24) |
| 6 | **0.24** | Alberth Moreira | alberthmoreira | CONTRIBUTOR | 31 | `2026-11-18T20:05:28` | Rank: 7 → 6 (Score 0.24) |
| 7 | **0.24** | tammam alasha | tammamalasha | CONTRIBUTOR | 51 | `2026-11-19T06:57:01` | Rank: 8 → 7 (Score 0.24) |
| 8 | **0.24** | Pınar Aksoy | xpinara | CONTRIBUTOR | 30 | `2026-11-18T21:23:24` | Rank: 9 → 8 (Score 0.24) |
| 9 | **0.24** | Takumu Hata | takumuhata | CONTRIBUTOR | 36 | `2026-11-17T06:14:13` | Rank: 10 → 9 (Score 0.24) |
| 10 | **0.24** | Serhii Mosiiash | serhiimosiiash | CONTRIBUTOR | 40 | `2026-11-18T10:30:24` | Rank: 11 → 10 (Score 0.24) |
| 11 | **0.24** | LuisSpecian | lspecian | CONTRIBUTOR | 34 | `2026-11-19T00:59:58` | Rank: 12 → 11 (Score 0.24) |
| 12 | **0.24** | Radek | rathko | CONTRIBUTOR | 43 | `2026-11-13T06:46:55` | Rank: 13 → 12 (Score 0.24) |
| 13 | **0.24** | Sophia0817 | sophia0817 | CONTRIBUTOR | 5 | `2026-11-16T08:27:21` | Score: 0.03 → **0.24** (Rank 5163 → 13) |
| 14 | **0.24** | bgunshui | bgunshui | CONTRIBUTOR | 18 | `2026-11-19T13:41:21` | Score: 0.2 → **0.24** (Rank 370 → 14) |
| 15 | **0.22** | Francis Joseph | francisjosephdev | CONTRIBUTOR | 15 | `2026-11-14T23:15:04` | Rank: 14 → 15 (Score 0.22) |

### Score Distribution Breakdown (Field of 6,228 Teams)

| Score Range | Team Count | Share of Total Field | Notes |
|---|---|---|---|
| **0.24** (Leader Ceiling) | 14 | 0.22% | 14 teams tied for Gold (Rank 1–14) |
| **0.22** | 121 | 1.94% | 121 teams (Ranks 15–135) |
| **0.20** | 584 | 9.38% | 584 teams (Ranks 136–719) |
| **0.18** | 1197 | 19.22% | 1,197 teams (Ranks 720–1916) |
| **0.17** | 1142 | 18.34% | 1,142 teams (Ranks 1917–3058) |
| **0.15** | 864 | 13.87% | 864 teams |
| **0.10 – 0.14** | 1100 | 17.66% | 1,100 teams |
| **0.01 – 0.09** | 1005 | 16.14% | 1,005 teams |
| **0.00 / Error** | 201 | 3.23% | 201 teams |

---
## 3. Bonus Track: Small Model Prize ($10,000) Standings

Official Public Standings for Gemma E2B / E4B Eligible Entries (Top 15):

| Bonus Rank | Public Score | Team Name | Main Track Rank | Status |
|---|---|---|---|---|
| **1** | **0.12** | amunozo | Rank 268 | Eligible Small-Model |
| **2** | **0.12** | Tergel Munkhbat | Rank 306 | Eligible Small-Model |
| **3** | **0.10** | Amanie El-Hajj | Rank 651 | Eligible Small-Model |
| **4** | **0.10** | Smart Manoj | Rank 972 | Eligible Small-Model |
| **5** | **0.10** | Civitasmass | Rank 3298 | Eligible Small-Model |
| **6** | **0.10** | Aji Samudra | Rank 168 | Eligible Small-Model |
| **7** | **0.10** | ¯\_(ツ)_/¯ MrSheep | Rank 178 | Eligible Small-Model |
| **8** | **0.10** | DrewStuck | Rank 4958 | Eligible Small-Model |
| **9** | **0.10** | Alex Air | Rank 1100 | Eligible Small-Model |
| **10** | **0.10** | Raymang0 | Rank 2204 | Eligible Small-Model |
| **11** | **0.10** | Michael Hoskins | Rank 1681 | Eligible Small-Model |
| **12** | **0.10** | vladee | Rank 730 | Eligible Small-Model |
| **13** | **0.10** | Selahattin Günter | Rank 4026 | Eligible Small-Model |
| **14** | **0.10** | Powers-P1 | Rank 648 | Eligible Small-Model |
| **15** | **0.10** | medoHamza95 | Rank 2759 | Eligible Small-Model |

> [!IMPORTANT]
> **Small Model Track Tactical Considerations:**
> 1. Top score is **0.12** (~7 tasks resolved on public set), held by `amunozo` and `Tergel Munkhbat`.
> 2. The threshold between 0.10 and 0.12 is approximately 1 additional resolved issue.
> 3. Teams must remember to mark their small model entry as one of their **two final selected submissions** before Dec 2, or they will be dropped from the private small model evaluation.

---
## 4. Key Takeaways & Action Items for Our Agent Pipeline

1. **Do Not Over-Think:** For Gemma E4B / small models, configure reasoning tokens between **768 and 1024**. Set thinking budget too high (4096) and task completion drops by ~37%; set it to 0 or disable thoughts and tool JSON parsing collapses.
2. **Never Truncate Output Tokens:** Keep `max_output_tokens` at least **4096** to prevent partial JSON emissions on large file edits.
3. **Fix Budget Nulls:** Ensure `eval_config.yaml` does not pass `null` for `max_tool_calls` or `max_time_minutes` to avoid the Getting Started v3 `TypeError: int(None)` failure.
4. **Beware LoRA Distillation Trap:** Direct trajectory imitation from 31B teaches small models slow, verbose habits that exhaust time budgets. Retain base capabilities with surgical AST/syntax validation guards.
5. **Freeze Submission Code Before Nov 25:** Notebook publishing locks on November 25 at 23:59 UTC.


---

<!-- ====================================================================== -->
<!-- FILE: 01-thread-manifest-2026-11-20.md -->
<!-- ====================================================================== -->

# Discussion-Board Thread Manifest — Gemma 4 Developer Agent — Captured 2026-11-20

Inventory of newly created and updated discussion threads at `https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion` between **2026-11-11** and **2026-11-20**.

## 1. Coverage & Census Summary

| Metric | Count | Description |
|---|---|---|
| **Total Board Threads** | **100** | Complete enumeration across all discussion board pages |
| **Threads Active Since Nov 11** | **51** | Threads with new topics or new comments captured and analyzed |
| ↳ *Brand New Threads Opened (>= 11/11)* | 39 | New problem reports, research findings, and technical questions |
| ↳ *Pre-Existing Threads with New Comments* | 12 | Threads with new discussion since Nov 11 |
| **Threads with Staff/Admin Interventions** | **2** | Official host rulings (metric bug patch, tie-breaking, variance) |

## 2. Active Technical Thematic Clusters (2026-11-11 to 2026-11-20)

1. **Metric Bug Patch & Leaderboard Rescore (High Impact)**:
   - `760126`: Host Ryan Holbrook confirms metric bug fix that allowed improperly high scores. Submissions rescored. Yurnero's 0.29 score removed. Top ceiling resets to 0.24.
   - Staff confirms tie-breaking policy: earlier submission date wins. Non-determinism/variance explicitly acknowledged by staff on private evaluations.
2. **Small Model Prize ($10,000) & Baseline Optimization**:
   - Official daily leaderboard notebook active (`ryanholbrook/gemma-4-developer-agent-small-model-leaderboard` v33). Top score: **0.12** (`amunozo` and `Tergel Munkhbat`).
   - `760014`: Japan Open Data Lab shares 1,800+ trials on Gemma 4 E4B. Key findings: thinking budget sweet spot is 768–1024; cutting max output tokens truncates edit JSON; LoRA distillation from 31B teacher failed against raw base model; temperature=0.0 is non-deterministic in agent workflows.
   - `759848`: Question on whether analytical SVD-derived LoRA adapters are legal for Small Model Prize.
3. **Kaggle Infrastructure Backlog & Stuck Submissions**:
   - `759162`, `759305`, `759630`, `759702`, `758599`: Submissions stuck in "PENDING" or "Notebook Running" for 3–5 days, particularly from the November 9 batch.
4. **Harness & Scorer Edge Cases**:
   - `760140`: Getting Started notebook v3 bug: `max_tool_calls: null` or `max_time_minutes: null` crashes scorer with `TypeError: int(None)`.
   - `758547`: Skill-only bundles score 0.00 on the hidden scorer.
   - `758854`: Async functions unsupported in context.
   - `758969`: Cold-start latency, memory overhead, and packaging zip bugs.
5. **Timeline & Rules Approaching Final Deadlines**:
   - `759388`: Final deadline clarifications (`kernelsPublishingDisabledDeadline = 2026-11-25 23:59 UTC`, final submissions `2026-12-02 23:59 UTC`).


## 3. High-Priority Threads Active Since 2026-11-11

| ID | Status | Post Date (UTC) | Last Comment (UTC) | Total Comms | New Comms | Staff | Author | Tier | Title |
|---|---|---|---|---|---|---|---|---|---|
| [760595](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/760595) | **NEW TOPIC** | `2026-11-20T04:47Z` | `2026-11-20T04:47Z` | 0 | 0 | — | arnelperezposadas | CONTRIBUTOR | Where a small E4B agent loses tasks: a trace-level diagnosis on 91 practice tasks, two mechanical checks, and three prompt traps |
| [760471](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/760471) | **NEW TOPIC** | `2026-11-19T18:29Z` | `2026-11-19T23:53Z` | 2 | 2 | — | ashleyoldacre | STAFF | 11/18/26 Update on Submission Queue |
| [760309](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/760309) | **NEW TOPIC** | `2026-11-19T06:00Z` | `2026-11-19T21:38Z` | 2 | 2 | — | sundow | CONTRIBUTOR | LoRA Inference Overhead Can Reduce Agent Performance Under Fixed Time Budgets |
| [760201](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/760201) | **NEW TOPIC** | `2026-11-18T20:29Z` | `2026-11-18T20:29Z` | 0 | 0 | — | justforgags | CONTRIBUTOR | My agent reads every new public notebook and arXiv paper overnight, then tests the ideas itself. 46 rounds till now, open source |
| [760140](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/760140) | **NEW TOPIC** | `2026-11-18T17:29Z` | `2026-11-18T17:29Z` | 0 | 0 | — | renxiaohan | CONTRIBUTOR | Submission 58480207: E4B LoRA starts on 4xL4; nullable budget parsing may explain scorer exception |
| [760126](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/760126) | **NEW TOPIC** | `2026-11-18T16:47Z` | `2026-11-19T21:38Z` | 16 | 16 | **YES (3)** | snnclsr | GRANDMASTER | What happened to 0.29 score? |
| [760044](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/760044) | **NEW TOPIC** | `2026-11-18T06:21Z` | `2026-11-18T06:21Z` | 0 | 0 | — | mikkel255 | CONTRIBUTOR | About our entry: Training a GAN adapter on Gemma 4's internal states. |
| [760014](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/760014) | **NEW TOPIC** | `2026-11-18T01:06Z` | `2026-11-18T05:14Z` | 2 | 2 | — | japanopendatalab | CONTRIBUTOR | Withdrawing, and sharing everything we measured: 1,800+ trials of a 4B quantized SWE agent (best custom 15/114 vs zero-think baseline 16/114) |
| [759848](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/759848) | **NEW TOPIC** | `2026-11-17T12:21Z` | `2026-11-17T12:21Z` | 0 | 0 | — | marcofpereira | CONTRIBUTOR | Host ruling: is a PEFT LoRA derived by SVD of the model's own tensor acceptable? (not trained) |
| [759781](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/759781) | **NEW TOPIC** | `2026-11-17T03:57Z` | `2026-11-17T03:57Z` | 0 | 0 | — | mauriciolop | CONTRIBUTOR | My Agent Approach - Gemma 4 Developer Agent  |
| [759702](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/759702) | **NEW TOPIC** | `2026-11-16T20:09Z` | `2026-11-16T20:09Z` | 0 | 0 | — | itskshivam | CONTRIBUTOR |  Submission 58171169 stuck in PENDING since 9 Nov  |
| [759630](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/759630) | **NEW TOPIC** | `2026-11-16T16:42Z` | `2026-11-16T16:44Z` | 1 | 1 | — | paul1994a | CONTRIBUTOR | The Nov 9 stuck batch: 15 teams, one 3-hour window, everyone else is scoring normally. Evidence from the public API |
| [759580](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/759580) | **NEW TOPIC** | `2026-11-16T11:42Z` | `2026-11-16T11:42Z` | 0 | 0 | — | bugkeeper | CONTRIBUTOR | Submission #58412868 PENDING for 8h+: scorer-stage check and local parser reproduction |
| [759514](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/759514) | **NEW TOPIC** | `2026-11-16T02:20Z` | `2026-11-19T07:41Z` | 8 | 8 | — | xiaoz259 | MASTER | five LoRA probes with identical scores  |
| [759427](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/759427) | **NEW TOPIC** | `2026-11-15T15:29Z` | `2026-11-15T15:29Z` | 0 | 0 | — | topeseun100 | CONTRIBUTOR | Is generating SFT trajectories with the hosted Gemma-4-31B-IT API compliant? |
| [759388](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/759388) | **NEW TOPIC** | `2026-11-15T09:42Z` | `2026-11-15T09:42Z` | 0 | 0 | — | aibyai | CONTRIBUTOR | Three clarifications: 12-hour limit, scorer environment freeze, submissions after Nov 25 |
| [759329](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/759329) | **NEW TOPIC** | `2026-11-15T02:59Z` | `2026-11-15T12:40Z` | 1 | 1 | — | morikentaro36 | CONTRIBUTOR | Looking for advice: thinking-budget experiments and a 0.15 → 0.13 repeat run |
| [759322](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/759322) | **NEW TOPIC** | `2026-11-15T01:07Z` | `2026-11-17T14:34Z` | 6 | 6 | — | tom99763 | MASTER | We couldn't submit anything due to last submission stuck for 5 days |
| [759305](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/759305) | **NEW TOPIC** | `2026-11-14T20:40Z` | `2026-11-15T00:58Z` | 1 | 1 | — | ajnalkarismailsab | CONTRIBUTOR | Title: Submission stuck in "Pending" since Nov 9, blocking all new submissions |
| [759279](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/759279) | **NEW TOPIC** | `2026-11-14T16:54Z` | `2026-11-14T16:54Z` | 0 | 0 | — | michaelflorida | CONTRIBUTOR | Lora permission on model |
| [759248](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/759248) | **NEW TOPIC** | `2026-11-14T13:40Z` | `2026-11-14T13:40Z` | 0 | 0 | — | patrickamaru | CONTRIBUTOR | Is it acceptable to use Logprobs in training? |
| [759238](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/759238) | **NEW TOPIC** | `2026-11-14T12:50Z` | `2026-11-14T18:12Z` | 3 | 3 | — | mellamoa | CONTRIBUTOR | Public trajectory datasets generated by proprietary models (SWE-smith, SWE-Gym, SWE-Next): allowed for LoRA training? |
| [759162](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/759162) | **NEW TOPIC** | `2026-11-14T03:41Z` | `2026-11-17T12:23Z` | 9 | 9 | — | vijaikm | CONTRIBUTOR | Submission stuck in PENDING for 5 days — please help unblock (Ref: 58167516) |
| [759154](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/759154) | **NEW TOPIC** | `2026-11-14T01:00Z` | `2026-11-14T01:00Z` | 0 | 0 | — | sumyeung | CONTRIBUTOR | Testing configs offline on the 129 training tasks: my harness and results |
| [758972](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/758972) | **NEW TOPIC** | `2026-11-13T05:56Z` | `2026-11-15T09:18Z` | 3 | 3 | — | bharat0 | CONTRIBUTOR | Eval in kernel is 3x slower than API, vLLM Config to optimise speed |
| [758969](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/758969) | **NEW TOPIC** | `2026-11-13T05:54Z` | `2026-11-16T05:28Z` | 1 | 1 | — | muhammadakhtarquddus | CONTRIBUTOR | Three lessons from 22 submissions: a zip bug, LB noise, and E4B quitting early |
| [758968](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/758968) | **NEW TOPIC** | `2026-11-13T05:51Z` | `2026-11-13T14:50Z` | 4 | 4 | — | niraberman | CONTRIBUTOR | LoRA habit adapters changed the agent's behaviour offline but not the live score: three mechanisms |
| [758954](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/758954) | **NEW TOPIC** | `2026-11-13T03:32Z` | `2026-11-13T03:32Z` | 0 | 0 | — | akanksha2804 | CONTRIBUTOR | Scorer minutes: a toolkit to convert time caps between GPUs and measure run to run noise |
| [758953](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/758953) | **NEW TOPIC** | `2026-11-13T03:30Z` | `2026-11-14T02:09Z` | 3 | 3 | — | shyjin | EXPERT | Are only November 9 submissions stuck in the queue |
| [758854](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/758854) | **NEW TOPIC** | `2026-11-12T22:54Z` | `2026-11-14T19:27Z` | 1 | 1 | — | purnimapathak15 | CONTRIBUTOR | Harness pitfalls: no async functions in the code graph; bad skill names score 0.00 |
| [758821](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/758821) | **NEW TOPIC** | `2026-11-12T21:51Z` | `2026-11-12T21:51Z` | 0 | 0 | — | ozgung | CONTRIBUTOR | Open code and data: agent configs, weight-editing library and held-out task sets (Gemma 4 E4B) |
| [758817](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/758817) | **NEW TOPIC** | `2026-11-12T21:44Z` | `2026-11-13T19:02Z` | 3 | 3 | — | rathko | CONTRIBUTOR | Open toolkit for measuring noise in your agent runs |
| [758729](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/758729) | **NEW TOPIC** | `2026-11-12T19:33Z` | `2026-11-12T19:33Z` | 0 | 0 | — | muhandalsaiari | CONTRIBUTOR | Public repo with our agent configs and run data |
| [758599](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/758599) | **NEW TOPIC** | `2026-11-12T16:29Z` | `2026-11-13T10:01Z` | 1 | 1 | — | cryptozenith | CONTRIBUTOR | Submission stuck in "Notebook Running" for 3 days, blocking all new submissions (ID 58169362) |
| [758547](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/758547) | **NEW TOPIC** | `2026-11-12T14:58Z` | `2026-11-12T19:38Z` | 1 | 1 | — | clanevil | CONTRIBUTOR | Skill-only bundle scores 0.00 on the leaderboard but resolves tasks in the harness's Docker mode locally. Do skill scripts run on the scorer? |
| [758289](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/758289) | **NEW TOPIC** | `2026-11-12T04:42Z` | `2026-11-12T04:42Z` | 0 | 0 | — | foysalemonshanto | EXPERT | Does the scorer serve with the vLLM / swegemma / adk-submission versions from the wheelhouse dataset? |
| [758218](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/758218) | **NEW TOPIC** | `2026-11-11T22:56Z` | `2026-11-11T22:56Z` | 0 | 0 | — | murugesann | EXPERT | How many of the 129 tasks are solved by the agentless 0.22 scorer? |
| [757993](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/757993) | **NEW TOPIC** | `2026-11-11T10:59Z` | `2026-11-12T07:45Z` | 4 | 4 | — | kush1235 | CONTRIBUTOR | Kaggle notebook runtime issue |
| [757893](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/757893) | **NEW TOPIC** | `2026-11-11T05:07Z` | `2026-11-11T05:07Z` | 0 | 0 | — | moshegolderson | CONTRIBUTOR | To the organizers: 5 concrete scorer fixes, plus an audited task list |
| [757588](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/757588) | ACTIVE OLD | `2026-11-10T04:14Z` | `2026-11-12T21:11Z` | 4 | 3 | — | harshitsama | EXPERT | I reran a public 0.24 bundle unchanged and got 0.17 (data and short paper) |
| [756792](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/756792) | ACTIVE OLD | `2026-11-07T16:17Z` | `2026-11-17T12:26Z` | 4 | 1 | — | refresh2k | CONTRIBUTOR | Are hand-constructed LoRA adapters acceptable (weight edit from activation analysis, not gradient descent)? |
| [754000](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/754000) | ACTIVE OLD | `2026-10-30T01:06Z` | `2026-11-18T13:29Z` | 4 | 4 | — | mohamedtkhalil1995 | CONTRIBUTOR | Stuck Submission |
| [752693](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/752693) | ACTIVE OLD | `2026-10-25T23:19Z` | `2026-11-20T04:45Z` | 2 | 1 | — | cosmorin | CONTRIBUTOR | Interested in teaming up? Please read our public Gemma smoke-test Code first |
| [751596](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/751596) | ACTIVE OLD | `2026-10-22T05:40Z` | `2026-11-19T15:13Z` | 8 | 6 | — | munalsingh | CONTRIBUTOR | SFT / distillation LoRAs on Gemma 4 31B: loss falls a lot, solve rate doesn’t move. What would you try next? |
| [751311](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/751311) | ACTIVE OLD | `2026-10-21T10:30Z` | `2026-11-16T07:55Z` | 4 | 3 | — | pranshubahadur | EXPERT | Request to hosts: inference kernels |
| [750490](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/750490) | ACTIVE OLD | `2026-10-18T13:57Z` | `2026-11-12T11:57Z` | 1 | 1 | — | murugesann | EXPERT | budget warning from harness - can it be given for all tool responses? |
| [748287](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/748287) | ACTIVE OLD | `2026-10-11T11:48Z` | `2026-11-13T02:51Z` | 39 | 1 | — | ryanholbrook | STAFF | New Gemma 4 Models Available: 12B, E4B, and E2B |
| [747519](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/747519) | ACTIVE OLD | `2026-10-08T22:09Z` | `2026-11-19T06:24Z` | 154 | 52 | **YES (3)** | herbison | STAFF | Update on "Kaggle Error" Submissions & Queue Delays |
| [744354](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/744354) | ACTIVE OLD | `2026-09-29T14:05Z` | `2026-11-12T07:13Z` | 11 | 4 | — | wukeneth | EXPERT | Thinking mode drops the model's thoughts between tool calls (vLLM ignores `reasoning_content`). Will the scoring environment be patched? |
| [743683](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/743683) | ACTIVE OLD | `2026-09-26T12:01Z` | `2026-11-11T02:53Z` | 108 | 1 | — | ryanholbrook | STAFF | Rerunning Failed Submissions |
| [743007](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/743007) | ACTIVE OLD | `2026-09-24T15:59Z` | `2026-11-19T03:34Z` | 10 | 1 | — | elanlearns | CONTRIBUTOR | Welcome to the Gemma 4 Developer Agent Competition |


---

<!-- ====================================================================== -->
<!-- FILE: 02-raw-forum-digest-2026-11-11-to-2026-11-20.md -->
<!-- ====================================================================== -->

# Raw Forum Digest: 2026-11-11 to 2026-11-20

Captured posts and all nested comments from `https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion` created or updated after 2026-11-11T00:00:00Z.

---

## Thread 760595 — Where a small E4B agent loses tasks: a trace-level diagnosis on 91 practice tasks, two mechanical checks, and three prompt traps
URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/760595
Author: **arnelperezposadas** (CONTRIBUTOR) | Posted: `2026-11-20T04:47:19.733868900Z` | Last Activity: `2026-11-20T04:47:19.733868900Z`

### Original Post

Hi all. Following Japan Open Data Lab's excellent write-up (760014), here is what we measured on our side. It's smaller in scale, but it looks at every unsolved task's trace. All numbers are local runs on the public practice tasks with the official harness (Kaggle 4×L4, Getting Started environment, Python 3.12), one run per version unless stated.

1. Only 91 of the 129 practice tasks were gradable in our local subprocess sandbox

- 30 fastapi tasks fail verification locally because `inline_snapshot` / `dirty_equals` are missing.

- 8 requests tasks need the `httpbin` fixture.

- Even a perfect patch fails these locally, so we compare versions on the other 91 only.

2. Where our baseline (v29: short prompt, 80 calls, 8 min, temp 0.2, thinking 4096) loses tasks

8 of 91 solved. Each of the 83 failures gets exactly one category, checked in this order:

<table>
<thead>
<tr>
<th>Failure (first matching rule)</th>
<th>Tasks</th>
</tr>
</thead>
<tbody>
<tr>
<td>The edit broke the code (SyntaxError, IndentationError, NameError, UnboundLocalError in the verification run)</td>
<td>12</td>
</tr>
<tr>
<td>Never opened or named a file the reference patch changes, in any tool call</td>
<td>17</td>
</tr>
<tr>
<td>Opened that file but never edited anything</td>
<td>3</td>
</tr>
<tr>
<td>Opened that file but edited only other files</td>
<td>7</td>
</tr>
<tr>
<td>Edited that file, but more than 20 lines from the reference change</td>
<td>16</td>
</tr>
<tr>
<td>Edited within 20 lines of the reference change, tests still fail</td>
<td>28</td>
</tr>
</tbody>
</table>

- 56 of 83 failures edited the right file. Finding the code is not the main problem.

- Median 91 s of the 8 minutes and 11 of 80 tool calls. It submits early.

- Repetition loops ("x x x x …"): 0 of 129 tasks.

3. Its self-checks rarely gave it a usable signal

133 pytest runs after an edit:

- 45 pointed at a source file or a path that doesn't exist ("no tests ran").

- 34 showed no pass/fail summary (mostly whole-folder runs cut at the 5,000-character output limit).

- 31 showed failures or errors; 6 showed all tests passing (37 readable summaries in total).

- 14 showed a SyntaxError from its own edit. In 6 of the 12 broken-code tasks the agent saw that error and submitted anyway.

4. Two mechanical checks helped locally (v39)

- After every edit: `python -m py_compile FILE && python -c "import MODULE"`.

- One related test file via `git grep -ln "NAME" -- '*test*.py'`, run so the summary stays visible.

Result on the same 91 tasks: 11 solved vs 8. 5 tasks solved only by v39, 2 only by v29 (exact sign test p ≈ 0.45, so not conclusive on its own). The mechanism moved as intended: broken edits 12 → 7, post-edit test runs with a readable summary 37 of 133 → 78 of 119, and total agent time went down (2.77 → 2.41 h). On the public LB the same change scored 0.03 against v29's 0.06, inside the 0.01–0.06 band all our E4B runs fall in (identical reruns of one config gave 0.06 and 0.03), so we judge by paired local runs. Hidden performance remains unknown.

5. Prompt traps we hit (easy to fix)

- `pytest ... | tail -15` reports `tail`'s exit code, so the tool returns `"status": "ok"` even when tests fail. Capture the exit code: `pytest ... > /tmp/t.log 2>&1; echo "PYTEST_EXIT=$?"; tail -15 /tmp/t.log`.

- `write_file("/tmp/x.py")` strips the leading slash and writes to `/workspace/tmp/x.py`, which then ends up in your patch. Create scratch files with `run_command` (heredoc) instead.

- `python /tmp/check.py` does not put the repo on `sys.path`; use `cd /workspace && PYTHONPATH=/workspace python /tmp/check.py`.

- To tell a failure your edit caused from an old one, compare the same test with and without the edit. Be careful with a plain `git stash ...; git stash pop`: if there is nothing to stash, `pop` can restore an older stash entry, and untracked files are not stashed. A separate clean checkout of the baseline is the safer comparison.

6. A copy-fix LoRA did not change our public score

The training-free per_layer_model_proj adapter (thanks michi883, 753277), which targets dropped characters when copying text, scored 0.06 in our single public run, the same as without it. This is one noisy run, not a measured null effect. Separately, Özgün Genç's weight-editing study (758821) targeted a different defect, escaped quotes and newlines, and found fewer escaping errors but no detectable gain in solved tasks. So far, our own gains have come from the workflow around the model rather than the weights.

7. Thinking budget

In our v39 traces the longest thinking block is about 18,000 characters (roughly 4,500 tokens by a rough 4-characters-per-token estimate) and the median about 530 characters. That is consistent with a 4,096 limit but does not prove the harness enforces it. Given 760014's report (think 4096: 10/114 vs zero-think: 16/114), we're now comparing v39 at 4,096 vs 1,024 on the same 91 tasks, everything else fixed. We'll report paired gains and losses, malformed tool calls, broken edits, runtime, and whether the 1,024 setting visibly shortens the thinking blocks.

Limits: one run per version on 91 practice tasks from 4 repositories that aren't in the hidden set; 760014's 10-run spread (11–15 of 114) shows how much one run can move. Treat 2–3 task differences as noise.

Thanks to Japan Open Data Lab (760014), Muhammad Akhtar Quddus (LB noise, 758969), Ilya Gordey and Munal Singh (751596), michi883 (753277) and Özgün Genç (758821). Questions welcome.

Edit (20 Nov): corrected the readable-summary count for v29 (37 of 133, not ~6), defined the failure categories as mutually exclusive, narrowed the copy-fix and thinking-budget statements, and replaced the git-stash recipe with a caution. Thanks to a reviewer for the careful read.

*(No new comments since cutoff)*


---

## Thread 760471 — 11/18/26 Update on Submission Queue
URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/760471
Author: **ashleyoldacre** (STAFF) | Posted: `2026-11-19T18:29:01.843700700Z` | Last Activity: `2026-11-19T23:53:37.563Z`

### Original Post

Hi everyone,

We've seen questions about longer-than-usual submission turnaround times in the competition, so I wanted to share a quick update on what's happening.

What's Happening
Due to very high submission volume combined with long average notebook runtimes (~9–10 hours per submission) and finite L4 GPU capacity, submissions are currently spending ~8–9 hours in the queue before starting execution, followed by ~2–2.5 hours for scoring.

Everything is working as intended—submissions are being processed steadily and are not timing out while waiting in the queue.

Current Turnaround Times
Right now, most notebook submissions (~94%) are completing end-to-end in under 24 hours (typically around 20–24 hours total from submission to leaderboard score).

What This Means for You
No action needed: If your submission shows as pending/queued, it is safely in line and will run and score automatically. You do not need to cancel or resubmit.

- Earlier stuck submissions cleared: We also resolved an issue from last week that left some submissions stuck in pending, and the affected stuck submissions were cleared so teams could submit again.
Plan ahead: Please keep the ~20–24 hour turnaround time in mind when planning your submissions, especially as we get closer to deadlines.

Thanks for your patience!

### New Comments (2 new comments/replies since 2026-11-11)

- **Spirit de bourges** (CONTRIBUTOR) at `2026-11-19T18:36:09.073Z`:

Hi Ashley, 

Is it possible to submit (add to the queue) a new submission while the previous one, made the day before, is still being evaluated?

-> There are only a few days left, so this is quite important :(

- **VELVRIN** (CONTRIBUTOR) at `2026-11-19T23:53:37.563Z`:

Hi [@ashleyoldacre](/ashleyoldacre) / Kaggle team, given the recent queue delays and rescoring updates, could you please confirm whether the December 2, 2026 final submission deadline is remaining as scheduled, or if there are any plans to extend it? Thanks in advance!


---

## Thread 760309 — LoRA Inference Overhead Can Reduce Agent Performance Under Fixed Time Budgets
URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/760309
Author: **sundow** (CONTRIBUTOR) | Posted: `2026-11-19T06:00:34.901258400Z` | Last Activity: `2026-11-19T21:38:36.160Z`

### Original Post

I benchmarked inference speed with and without a LoRA adapter on an A100. In these tests, applying the adapter reduced token throughput by approximately 22–25% and slightly increased time to first token (TTFT).

<table>
<thead>
<tr>
<th>Input tokens</th>
<th>Base TPS</th>
<th>LoRA TPS</th>
<th>TPS reduction</th>
<th>Base TTFT (s)</th>
<th>LoRA TTFT (s)</th>
</tr>
</thead>
<tbody>
<tr>
<td>1,024</td>
<td>60.43</td>
<td>45.22</td>
<td>25.2%</td>
<td>0.382</td>
<td>0.426</td>
</tr>
<tr>
<td>8,192</td>
<td>52.96</td>
<td>40.87</td>
<td>22.8%</td>
<td>3.760</td>
<td>4.025</td>
</tr>
<tr>
<td>16,384</td>
<td>49.40</td>
<td>38.71</td>
<td>21.6%</td>
<td>8.835</td>
<td>9.369</td>
</tr>
</tbody>
</table>
To examine how this overhead might affect task success, I evaluated two agents on the 129-task development set using the same agent configuration and per-task time budget.

Base model: LoRA disabled.

Zero LoRA: LoRA enabled, with the adapter's B matrices set to zero.

The zero adapter contributes no intended weight update, while still exercising the LoRA inference path.

<table>
<thead>
<tr>
<th>Metric</th>
<th>Base model</th>
<th>Zero LoRA</th>
<th>Difference</th>
</tr>
</thead>
<tbody>
<tr>
<td>Tasks resolved</td>
<td>57/129</td>
<td>50/129</td>
<td>-7</td>
</tr>
<tr>
<td>Resolution rate</td>
<td>44.19%</td>
<td>38.76%</td>
<td>-5.43 pp</td>
</tr>
</tbody>
</table>
Here, pp means percentage points.

In this run, the zero-LoRA configuration resolved seven fewer tasks. This suggests that inference overhead can meaningfully affect agent performance under a fixed time budget: slower generation leaves less time for investigation, editing, and testing.

As a rough break-even estimate for this configuration, a trained adapter would need to deliver around 5.4 percentage points of improvement to offset the observed gap.

However, this is a single-run comparison. Numerical differences in the LoRA execution path and run-to-run variation may also contribute, so the entire gap cannot yet be attributed to inference speed.

### New Comments (2 new comments/replies since 2026-11-11)

- **Ankith Savio** (CONTRIBUTOR) at `2026-11-19T11:13:22.627Z`:

In the 4xL4 setup I noticed a 10-15% reduction in TPS. A finetuned Gemma would have to gain a higher score while utilizing 1k-1.5k less output tokens.

- **AddyLifeapp** (CONTRIBUTOR) at `2026-11-19T21:38:36.160Z`:

Really useful numbers — the reminder that speed matters as much as accuracy under a time limit is a great takeaway.


---

## Thread 760201 — My agent reads every new public notebook and arXiv paper overnight, then tests the ideas itself. 46 rounds till now, open source
URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/760201
Author: **justforgags** (CONTRIBUTOR) | Posted: `2026-11-18T20:29:35.129276300Z` | Last Activity: `2026-11-18T20:29:35.129276300Z`

### Original Post

I’ve been running this competition with a small tool I made, ResearchForge, and I’d love a few people to try it and tell me where it breaks. It’s my take on [Karpathy’s autoresearch idea](https://github.com/karpathy/autoresearch), pointed at Kaggle: it runs experiment rounds overnight and keeps a record of every one, failures included. Free and open source. Here is my experiment tree for this competition:

Most of it is red: 26 of my 46 rounds failed, and a lot of those failed on compute (Colab
sessions), not on the idea. I'm sharing it anyway because that's exactly what
the tool is for: keeping the failures on record so you fix the right thing.

It's open source (Apache 2.0) and runs on your own machine. The
numbers on the boxes are local scores. The public leaderboard is a different story: I
resubmitted byte-identical code and got 0.12, then 0.17. So it never accepts or rejects an idea
on one leaderboard number.

What it does

- `/overnight <competition-url>` in Claude Code or Cursor, or headless with your own API key
(Claude, Gemini, OpenAI) or a local Ollama model.

- Autorun keeps running rounds back to back while you sleep: it plans, runs, scores, and picks
the next idea from the best round so far, with what failed already in front of it.

- It asks before anything risky, like submitting, and sends the question to your phone.

- Runs on Kaggle GPU, Colab, SSH or a cloud GPU.

When most rounds fail, you want to tell it what to do differently and see if that helped.
That's what steering is for:

You steer it, and it follows

- Type a direction while it runs, without stopping it: "try X next", "stop doing Y", or "for the
next 3 rounds". From the dashboard's Steer page or `researchforge kaggle steer`.

- Up next is one numbered queue: your directions first (newest on top), then ideas you pinned,
then the engine's own top ideas. Drag to reorder, or pin any idea to move it up.

- The next round has to follow the top item or say why it can't, and that reason is shown.
A direction can ask for the next few rounds, and it stays until they have followed it.

- Rounds that followed your steer get a 🧭 badge and an amber ring on the DAG, so you can see
whether your idea actually moved the score.

Sensors: it keeps watching while it works

In a competition where new public notebooks show up every day, the part I lean on most is the
sensors. They run in the background on a schedule (launchd on macOS, a systemd timer on Linux,
Task Scheduler on Windows), so no chat window needs to stay open:

- Kaggle kernel sensor: every hour it checks for new and re-run public notebooks, pulls out
their ideas (it never copies code) and adds them to the pool, tagged as building on my best
path, repeating something that already failed, or a new direction. It keeps a board of public
notebooks ranked by the score they claim, and pings me when one claims more than my best.
On this competition, 268 of my 332 ideas came from it.

- arXiv sensor: once a day it scans arXiv for papers related to the task and turns the
techniques into ideas. 5 so far here.

- Submission sensor: checks every 15 minutes and notifies me the moment a submission is scored.

- Heartbeat sensor: alerts if a round looks stuck, so a hung Colab session doesn't eat the night.

- Pool sensor and a morning briefing at 07:00: what ran overnight, what's next.

- Custom sensors: any shell command you like (exit 0 = healthy), added with
`researchforge kaggle sensors <slug>`.

Ideas from notebooks and papers are only ever judged on my own local runs, never on someone
else's claimed leaderboard score.

Where I am: public 0.17, rank 2,417 of 6,025. The top-10% line is 0.20.

I need people to break it

- Agent competitions are messy. Try it here and tell me where it falls over.

- The Colab path is where my own run struggled most. If you know Colab automation well, I'd love
your help.

- Issues and PRs welcome.

This is one person's work, and I'm happy to have collaborators.

```
pip install researchforge

```

GitHub: [https://github.com/forger-labs-hq/researchforge](https://github.com/forger-labs-hq/researchforge)

Issues: [https://github.com/forger-labs-hq/researchforge/issues](https://github.com/forger-labs-hq/researchforge/issues)

Write-up: [https://www.researchforgehq.com/blog/gemma-4-developer-agent-kaggle-run?utm_source=kaggle&utm_medium=discussion](https://www.researchforgehq.com/blog/gemma-4-developer-agent-kaggle-run?utm_source=kaggle&utm_medium=discussion)

Webpage with all features: [https://www.researchforgehq.com/](https://www.researchforgehq.com/)

*(No new comments since cutoff)*


---

## Thread 760140 — Submission 58480207: E4B LoRA starts on 4xL4; nullable budget parsing may explain scorer exception
URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/760140
Author: **renxiaohan** (CONTRIBUTOR) | Posted: `2026-11-18T17:29:28.712200500Z` | Last Activity: `2026-11-18T17:29:28.712200500Z`

### Original Post

Hi [@ryanholbrook](/ryanholbrook),

Could you check the failure stage of submission 58480207? It finished with "Notebook Threw Exception" and no score. We do not have the hidden scorer traceback, so we cannot confirm its cause.

We tested the identical submission.zip (SHA-256 verified) in a separate Kaggle Notebook on four NVIDIA L4 GPUs. With the official wheelhouse (swegemma 0.2.11, adk-submission 0.2.13, vLLM 0.19.1, torch 2.10.0+cu128, transformers 5.13.1), the E4B QAT v2 model and one initial zero-B LoRA adapter (rank 128, alpha 256) compiled, loaded, started successfully, and returned HTTP 200 / "42" on a short request. TP=4, context=32768, GPU memory utilization=0.90, VLLM_MEMORY_PROFILER_ESTIMATE_CUDAGRAPHS=1. Startup took about 431 seconds. This was a startup/first-generation test, not a complete SWE evaluation.

We then found a deterministic issue in the current Getting Started notebook (version 3): our eval_config.yaml explicitly contains max_tool_calls: null and max_time_minutes: null. The notebook's budget-reading block applies int() and float() to those values without a None check. Running that exact block against our configuration raises TypeError at int(None); float(None) also fails independently. Omitting those two fields, or supplying finite numeric values, passes the same block. The underlying EvalConfig accepts None, which is why schema validation did not catch it.

Questions:

- Does the hidden scorer use this same budget parsing logic, and did submission 58480207 fail there?

- Is omitting the fields the supported way to use scorer defaults? Are explicit null values intended to be supported for optional budgets?

- Could the public compiler/preflight reject unsupported null values clearly, or could the entry point handle them consistently with EvalConfig?

We are not claiming an OOM or a scorer infrastructure defect; the startup test passed and the hidden failure is unconfirmed. A failure stage or exception class would help us fix the right issue. Thank you.

*(No new comments since cutoff)*


---

## Thread 760126 — What happened to 0.29 score?
URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/760126
Author: **snnclsr** (GRANDMASTER) | Posted: `2026-11-18T16:47:59.446289600Z` | Last Activity: `2026-11-19T21:38:22.190Z`

### Original Post

Yeah just got curious what happened there

### New Comments (16 new comments/replies since 2026-11-11)

- **AddyLifeapp** (CONTRIBUTOR) at `2026-11-19T21:38:22.190Z`:

Thanks for flagging this — good to know the rescore explains the change. Really helpful for anyone watching their score move.

- **[HOST/STAFF]** **Ryan Holbrook** (STAFF) at `2026-11-18T16:52:27.120Z`:

We fixed a bug in the metric that was allowing some agents to achieve improperly high scores. We patched the metric to address this issue and rescored the involved submissions.

- **Vibhanshu Singh** (CONTRIBUTOR) at `2026-11-18T16:58:50.897Z`:

Could you please clarify how ties will be resolved during the final evaluation on the hidden test cases?

- **[HOST/STAFF]** **Ryan Holbrook** (STAFF) at `2026-11-18T17:04:18.110Z`:

As in all competitions, ties are resolved by submission date. Earlier submissions win.

- **Vibhanshu Singh** (CONTRIBUTOR) at `2026-11-18T17:10:05.617Z`:

Will the final evaluation use deterministic inference on hidden test cases? Otherwise, could randomness give an earlier submission an unfair advantage over a later, deterministic one?

- **[HOST/STAFF]** **Ryan Holbrook** (STAFF) at `2026-11-18T17:52:59.230Z`:

Deterministic inference doesn't solve the problem of submission variance. It equalizes scores of byte-identical submissions on the same system, not submissions with the same generalization capability or with the same expected score on a set of tasks. Even if we ran with deterministic inference, you would still have "effectively identical" submissions with varying scores on the private set.

- **Sinan Calisir** (GRANDMASTER) at `2026-11-18T16:59:21.050Z`:

Thanks for the update! Funny that the agents keep finding their ways :D

- **Murugesan Narayanaswamy** (EXPERT) at `2026-11-19T01:34:57.587Z`:

[@ryanholbrook](/ryanholbrook) 

I suspect a similar discrepancy between the local eval harness and the actual LB runtime harness—the local scores do not correlate with the LB scores. On the local 127-task dataset, my agent orchestration performs at least equally well on Kaggle GPU (Gemma 4 31B), yet when submitted to the LB, the agentless system.md baseline scores at least 0.15–0.18 while my agent orchestration scores at most 0.10. If the drop were caused by context compaction or similar runtime limits, it would manifest in local testing as well. What differs between the LB runtime evaluation environment and the local Gemma SWE eval setup?

- **Murugesan Narayanaswamy** (EXPERT) at `2026-11-19T09:14:21.170Z`:

Note: local CV vs LB correlation is fine for agentless system.md but does not occur only when sequential agent / agent_tool is used - if the issue is with regard to sequential agent / agent_tool usage, then local GPU Gemma testing should also fail resolving  equivalent tasks.

- **xz** (MASTER) at `2026-11-18T17:02:15.380Z`:

It is discouraging that no one seems to have beaten the variance. Are we sure LoRA is properly configured for evaluation?

- **Sinan Calisir** (GRANDMASTER) at `2026-11-18T17:06:13.453Z`:

Yeah, I am a bit disappointed with that as well. I tried various data and modeling approaches but couldn't break the barier on my own.

- **xz** (MASTER) at `2026-11-18T19:22:33.730Z`:

The default unoptimized LoRA kernel might just be too much to overcome.

- **Vaibhav Nakrani** (EXPERT) at `2026-11-19T11:18:00.063Z`:

oh i have tried so many things sft, opd , rl nothing seems to work on the lora path.

edit: opd = on policy distillation from 31b - e4b

i am targeting e4b right now.

- **Unknown** (CONTRIBUTOR) at `2026-11-18T17:08:23.883Z`:



- **Tushar** (CONTRIBUTOR) at `2026-11-18T17:17:21.950Z`:

yeah same idk why my lora submission are also throwing timed out error

- **Sahil Das** (CONTRIBUTOR) at `2026-11-19T06:45:38.283Z`:

I was wondering the same thing. I thought that submission was winning for sure and that it had had a breakthrough of some sort. Seems like the person has been wiped from the leaderboard altogether…


---

## Thread 760044 — About our entry: Training a GAN adapter on Gemma 4's internal states.
URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/760044
Author: **mikkel255** (CONTRIBUTOR) | Posted: `2026-11-18T06:21:10.241142800Z` | Last Activity: `2026-11-18T06:21:10.241142800Z`

### Original Post

Can Gemma 4 learn a better repair workflow from its own hidden states? That’s what I’m testing in [Gemma 4 Particle Sliders](https://github.com/HyperGAN/gemma-4-particle-sliders). I tried a similar approach on a smaller scale with [Meta Glimmer](https://github.com/HyperGAN/meta-glimmer-particle-slider). The broader idea is in [Particle Sliders: Aligning a small language model](https://huggingface.co/blog/ntc-ai/particle-sliders-learn-the-behavior-keep-the-quest).

For each selected training issue, I match the question, tools, sampling settings, and seed. The extra repair instruction is the only change. I take the instructed model’s hidden state at the first decision, before any tool calls. I only use it as a target if the full instructed run shows stronger repair behavior and its patch passes tests in a fresh container.

I freeze Gemma’s base weights and train an adapter with [ParticleGAN](https://github.com/HyperGAN/ParticleGAN) (EMPF). The pairing carries into the critic: I draw one noise sample z and compare z with z + (h_student − h_teacher), using the exact same z on both sides. That isolates the hidden-state residual instead of mixing it with differences between independent noise draws. I backpropagate through the student adapter to move its hidden state toward the instructed target without giving the student the extra instruction.

I’ll compare the adapter against base Gemma and prompt-only controls under the same budget. I don’t know yet whether the behavior will transfer to held-out repositories or help the agent fix more bugs.

*(No new comments since cutoff)*


---

## Thread 760014 — Withdrawing, and sharing everything we measured: 1,800+ trials of a 4B quantized SWE agent (best custom 15/114 vs zero-think baseline 16/114)
URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/760014
Author: **japanopendatalab** (CONTRIBUTOR) | Posted: `2026-11-18T01:06:31.230850400Z` | Last Activity: `2026-11-18T05:14:20.673Z`

### Original Post

Hi everyone — we're Japan Open Data Lab. After 1,800+ evaluation trials across 9 system generations, we've decided to withdraw from this competition, and we'd rather publish our measurements than let them sit in a drawer. Everything below is aggregate results and findings only — no task-level data, no patches, no submission code.

Setup. Gemma 4 E4B (W4A16 quantized, instruction-tuned) as a single autonomous SWE agent in a fully offline, time-limited container (vLLM + Google ADK, 300–355s per task). Our internal sound evaluation set: 114 tasks (a 70-task development set from FastAPI/requests/httpx, plus a 44-task unseen holdout from Textualize/rich, kept fully isolated from tuning and training data).

Score progression (solved out of 114)

- Organizer reference, E2B zero-think: 5 (4.4%)

- Organizer baseline, E4B think=4096: 10 (8.8%)

- Organizer baseline, E4B zero-think: 16 (14.0%)

- Sprint 2B, single LoRA, think=1024: 12 (10.5%)

- Sprint 2B, multi-LoRA serial (Solver+Critic): 13 (11.4%)

- Sprint 3, multi-LoRA serial + guards, 10-run mean: 12.90 (11.3%), range 11–15, SD 1.52

- Sprint 4, pure base (no LoRA), serial + AST checks: 14 (12.3%), holdout 6/44 (13.6%, best on holdout)

- Sprint 6, custom engine, zero-think single-stage: 12 (10.5%); zero-think serial: 13 (11.4%)

- Sprint 7, balanced think 768/1024, serial, pure base: 15 (13.2%) — our best custom system

- Sprint 8, calibrated (think 640/1024, output cap 2560): 14 (12.3%), zero timeouts, fewest empty patches (6), fastest (89.0s avg)

- Sprint 9, 3-stage Arbiter: 13 (11.4%)

Six findings
1. Longer thinking actively hurts a 4B agent. The organizer's think=4096 baseline scored 10/114 vs 16/114 for zero-think (−37.5% relative). A mid-range budget (768–1024) was the sweet spot for our custom systems. But fully disabling thought output (`include_thoughts: false`) exploded tool-argument JSON errors from 3 to 132 — a small model needs a minimal planning space to emit structured tool calls. And cutting `max_output_tokens` 4096→2560 doubled file-edit errors (53→121) because edit JSON got truncated mid-argument. Rule we take home: keep thinking budgets small (0–1024), never shrink the output channel.

2. LoRA distillation from a 31B teacher lost to the raw base model. We verified the LoRA/quantization math to near-perfection (logit cosine similarity 0.999986 after dequantization; tensor-parallel sharding exact). It still hurt: standard SFT dropped our 20-task dev subset 4/20 → 3/20 with 16/20 timeouts; adding DPO collapsed it to 1/20. Head-to-head on the same harness, pure base beat multi-LoRA 6.0 vs 4.5 (dev subset) and 14–15 vs 12.9 (full 114). Small trajectory sets (tens of examples) import the teacher's long, cautious exploration style, which a 4B model can't afford within the time budget, and narrow its generalization to unseen codebases.

3. temperature=0.0 is not deterministic for agents. We ran one fixed configuration 10 times over all 114 tasks (1,140 trials, 13.16 hours): solved counts were 14, 14, 15, 11, 13, 14, 11, 12, 11, 14 — mean 12.90, SD 1.52, 95% CI [11.81, 13.99]. Continuous batching changes floating-point summation order, and tiny timing differences flip single tokens, which reroutes the whole multi-turn search tree. Meanwhile Pass@5 reached 26/114 (22.8%), and the union of solved tasks across all our generations reached 24/70 (34.3%) on the dev set: the capability is there, single-shot selection is the bottleneck. Never judge a ±1–2 task delta from a single run.

4. The funnel collapses at verification — and existing tests are a double trap. In ~60% of tasks (67–70/114) the agent reached the correct file, yet only ~13% ended solved. Two structural reasons: (a) 32.9% of dev tasks require simultaneous multi-file edits, which a 4B agent almost never completes; (b) existing tests mislead in both directions. In ~65.7% of dev tasks the pre-existing test suite already passes on the unmodified code, so incomplete patches look "verified" (72–84% of our Critic's READY_TO_SUBMIT: YES verdicts were false positives). In ~34.3%, the task is a spec change: the old tests assert the buggy behavior, so a 100%-correct patch makes the visible suite fail — and any "prefer the patch that passes existing tests" logic actively destroys correct patches. Forcing the agent to write its own failing reproduction first also backfired (6.0 → 3.5 on the dev subset): a 4B model gets stuck writing the repro itself.

5. Textbook multi-agent patterns break on small models in specific ways. (a) Wrapping standard tools in a custom nested tool multiplied argument-schema errors 1 → 29; keeping the model's familiar flat tool surface and putting guards (snapshots, AST syntax checks) invisibly behind the tool layer halved timeouts and cut empty patches ~40%. (b) Prompt-level budget instructions ("finish within 9 tool calls") were ignored in 61.4% of tasks (mean 17.7 calls, max 54); role budgets must be enforced in code at the tool layer. (c) Context compaction plus output discipline got us to zero context-overflow errors and zero timeouts in Sprint 8 — stability is achievable, it just doesn't add solves by itself.

6. The honest summary. On the unseen holdout, our custom systems (5–6/44) consistently beat the organizer zero-think baseline (4/44), and Sprint 8 beat it on speed and stability too. But overall our best (15/114) finished one task behind the simplest organizer baseline (16/114) — within noise, yet never ahead. Every layer of custom machinery (second-stage critics, arbiters, verification gates) sometimes repaired failures and sometimes broke tasks the first stage had already solved, via the test traps in finding 4. For a 4B model, added harness complexity taxes the exact tool-calling distribution the base model is good at.

What a 4B agent can and cannot solve (from the 10-run data)

- Reliably solvable (8–10/10 runs): single-file edits of ~1–12 lines where the issue names the function/exception or includes a repro snippet; typically 5–15 tool calls, 90–160s.

- Borderline (1–4/10): correct file reached, but multiple plausible implementations the visible tests can't distinguish, or exploration that runs into the 250–330s range.

- Effectively unsolvable for this setup (0/10): multi-file coordinated changes; spec-change fixes where old tests assert the buggy behavior (the agent either submits a false-positive early or loops rewriting a correct patch); broad design issues that send the agent wandering through grep results.

Seven principles we take to other projects

- Route by task shape: single-file, small, well-specified maintenance tasks to the small model; multi-file spec changes to bigger models or humans.

- Minimal thinking budget (0 for routine, 512–1024 for state-tracking tasks); never cap output below what tool-call JSON needs.

- Prefer the raw base model + a good harness over small-data LoRA SFT/DPO.

- Keep the tool surface exactly as the model learned it; put protection behind the tools, not in front of them.

- Enforce agent role/call budgets in code, never in prompts.

- Never treat "existing tests pass" as correct or "existing tests fail" as wrong; observe the before/after test delta.

- Evaluate with repeated runs and statistics, not single-run deltas.

Infrastructure notes (outline only)
Three reusable lessons from the plumbing: the E4B's non-uniform attention layout (7 of 42 layers with a larger global head dimension) needed a small compatibility shim for our vLLM/transformers versions; the 262k vocabulary makes naive cross-entropy spike VRAM (~17.5 GiB), which chunked CE loss plus exact W4A16 dequantization avoided; and a dynamic sandbox that resolves per-repo test dependencies from each project's own metadata kept 9 heterogeneous OSS repos reproducible offline.

Thanks to the organizers for a genuinely interesting problem — the zero-think baseline is embarrassingly strong, and that's a finding in itself. Good luck to everyone still in; we'll be watching the leaderboard.

— Japan Open Data Lab ([https://jpopendata.jp](https://jpopendata.jp))

### New Comments (2 new comments/replies since 2026-11-11)

- **Smart Manoj** (EXPERT) at `2026-11-18T02:28:54.563Z`:

- -

- -

- [Defeating Nondeterminism in LLM Inference](https://thinkingmachines.ai/blog/defeating-nondeterminism-in-llm-inference)

- **Japan OpenData Lab** (CONTRIBUTOR) at `2026-11-18T05:14:20.673Z`:

Thanks for the pointer — yes, that post describes exactly the mechanism we ran into. With continuous batching, the reduction order changes run to run, and at temperature 0.0 that was enough to swing our solved count between 11 and 15 across identical configurations (SD 1.52 over 10 full runs). Batch invariance would have made our A/B comparisons much cheaper. Appreciate the reference.


---

## Thread 759848 — Host ruling: is a PEFT LoRA derived by SVD of the model's own tensor acceptable? (not trained)
URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/759848
Author: **marcofpereira** (CONTRIBUTOR) | Posted: `2026-11-17T12:21:30.609444800Z` | Last Activity: `2026-11-17T12:21:30.609444800Z`

### Original Post

Topic 756792 asks whether hand-constructed LoRA adapters are acceptable. I would like a host
ruling on the specific case, because it decides which of our two finalists we select for the
E2B/E4B Small Model Prize.

What the artifact is:

- A standard PEFT LoRA: adapter_config.json (667 bytes) + adapter_model.safetensors (3.4 MB).

- rank 128, alpha 128.

- NOT trained: no training data, no fine-tuning, no gradient step.

- Derived analytically from the released weights: we took the model's own
`per_layer_model_projection` tensor, computed its SVD, and wrote a rank-128 factor whose
product reproduces the correction that tensor needs.

- It loads in the allowed runtime exactly as a trained adapter does: vLLM is started with
--enable-lora, the adapter appears in /v1/models, and the harness reports it as the model
version of every tool call.

- It is reproducible byte for byte from the released tensor.

For context, the adapter is worth about 3 tasks on our small-model submission. If only trained
adapters qualify, we would select a different finalist - and we would much rather know before
the merge deadline than have it decided after the fact.

Question: is this acceptable for a scored submission, and specifically for the E2B/E4B Small
Model Prize?

Thank you.

*(No new comments since cutoff)*


---

## Thread 759781 — My Agent Approach - Gemma 4 Developer Agent 
URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/759781
Author: **mauriciolop** (CONTRIBUTOR) | Posted: `2026-11-17T03:57:45.508625900Z` | Last Activity: `2026-11-17T03:57:45.508625900Z`

### Original Post

Hi everyone! I just published my notebook explaining how my agent works for this competition.

It shows how to load tasks.jsonl, read a real task, and how the agent plans, writes the patch, and runs tests.

Here is my notebook:
[https://www.kaggle.com/code/mauriciolop/notebookc13e50853f](https://www.kaggle.com/code/mauriciolop/notebookc13e50853f)

If it helps you, please upvote! Thanks!

*(No new comments since cutoff)*


---

## Thread 759702 —  Submission 58171169 stuck in PENDING since 9 Nov 
URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/759702
Author: **itskshivam** (CONTRIBUTOR) | Posted: `2026-11-16T20:09:57.055459600Z` | Last Activity: `2026-11-16T20:09:57.055459600Z`

### Original Post

Hi, my submission 58171169 to the Gemma 4 Developer Agent competition (account itskshivam, submitted 2026-11-09 17:33 UTC, code submission via notebook output) has shown SubmissionStatus.PENDING for over 7 days. My earlier submissions scored within 13–46 hours. Because only one pending submission is allowed, I can't submit anything else while it's stuck. Could you check whether the scoring job is hung, and either re-queue it or clear it so I can resubmit? Thank you.

*(No new comments since cutoff)*


---

## Thread 759630 — The Nov 9 stuck batch: 15 teams, one 3-hour window, everyone else is scoring normally. Evidence from the public API
URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/759630
Author: **paul1994a** (CONTRIBUTOR) | Posted: `2026-11-16T16:42:37.843559Z` | Last Activity: `2026-11-16T16:44:10.540Z`

### Original Post

[@herbison](/herbison) [@ryanholbrook](/ryanholbrook)

This is not a general queue delay. It is a small, well-defined batch of orphaned submissions, and it has been locking the affected teams out of the competition for 7 days.

*1. The batch is small and contiguous

I collected every submission ID reported as stuck in threads 747519, 759162 and 759305 (Kaggle API, `list_comments`). Result:  

15 distinct submissions from 15 teams , all submitted on 2026-11-09 between 14:31 and 17:33 UTC, with consecutive reference IDs:

58167516, 58167582, 58167614, 58168200, 58168259, 58168453, 58169275, 58169326, 58169397, 58169640 (ours), 58169760, 58169889, 58169977, 58171169, 58172153

All are still PENDING, with no error and no Cancel option. The real number is probably a little higher (teams that have not posted), but this is a batch of a few dozen at most, not a platform-wide problem.

*2. Everyone else is being scored normally

From the public leaderboard downloaded today (`kaggle competitions leaderboard --download`):

- 5,891 teams on the leaderboard.

- 2,704 teams have a last scored submission dated after 2026-11-09 17:35 UTC.

- The most recent scored submission is from 2026-11-16 09:52 UTC. The scorer is running.

So submissions sent hours and days after ours have been picked up, scored and ranked, while this batch has not moved.

3. The hole is visible in the leaderboard itself

Teams by hour of their last scored submission (UTC):

<table>
<thead>
<tr>
<th>Hour (UTC)</th>
<th>14</th>
<th>15</th>
<th>16</th>
<th>17</th>
<th>18</th>
<th>19</th>
<th>20</th>
<th>21</th>
</tr>
</thead>
<tbody>
<tr>
<td>Nov 8</td>
<td>10</td>
<td>10</td>
<td>10</td>
<td>7</td>
<td>8</td>
<td>3</td>
<td>7</td>
<td>3</td>
</tr>
<tr>
<td>Nov 9</td>
<td>6</td>
<td>1</td>
<td>1</td>
<td>2</td>
<td>3</td>
<td>1</td>
<td>2</td>
<td>4</td>
</tr>
</tbody>
</table>
Normal activity resumes at 00:00 UTC on Nov 10 (28 teams in that hour).

4. Why this is serious

- The one-pending-submission limit means each of these teams has been unable to submit anything since Nov 9. One stuck row blocks the whole team.

- The October announcement in thread 747519 said stuck submissions would be re-scored automatically. That has not happened for this batch.

- There has been no organizer reply in any of these threads since Nov 9, and support requests have gone unanswered.

- The team merger deadline is Nov 25 and the final deadline is Dec 2. Each day lost is a day of leaderboard feedback the other 5,000+ teams are getting and we are not.

5. What we are asking

Please cancel, fail or re-queue the PENDING submissions from 2026-11-09 14:30 to 17:35 UTC, as one batch operation, so that these teams can submit again. A single query on status = PENDING in that window should find all of them, including teams that never posted here.

And please confirm in this thread once it is done, or tell us what is blocking it.

Thank you.

### New Comments (1 new comments/replies since 2026-11-11)

- **Yurnero** (GRANDMASTER) at `2026-11-16T16:44:10.540Z`:

BUMP [@herbison](/herbison) [@ryanholbrook](/ryanholbrook)


---

## Thread 759580 — Submission #58412868 PENDING for 8h+: scorer-stage check and local parser reproduction
URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/759580
Author: **bugkeeper** (CONTRIBUTOR) | Posted: `2026-11-16T11:42:59.132270600Z` | Last Activity: `2026-11-16T11:42:59.132270600Z`

### Original Post

Hi competition hosts,

Could you please check the current evaluation stage of submission #58412868? I am including a local parser reproduction as a possible diagnostic lead, not as a confirmed explanation for this submission.

Submission status

- Account: `bugkeeper`

- Notebook: `bugkeeper/gemma-agent-31b-competition`, version 5

- Model: Gemma 4 31B; no LoRA

- Submitted: 2026-11-16 03:12 UTC

- Latest API check: 2026-11-16 11:39 UTC, approximately 8 hours 27 minutes later

- Status: `PENDING`; `public_score` and `error_description` are empty

- The packaging notebook completed and its `submission.zip` output was downloaded and checked. Hidden evaluation is the stage still pending.

I understand that the 12-hour patch-generation budget excludes final patch validation, and queueing may add more time. The elapsed time alone does not establish a stalled job. The submission API does not expose a worker heartbeat or task progress, and the submission-episodes endpoint returned no records. I have not submitted another copy while investigating this.

Local parser reproduction — connection to this submission is unconfirmed
Following [the existing parser discussion](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/753973), I checked the local competition-environment wheel:

`vllm-0.19.1-cp38-abi3-manylinux_2_31_x86_64.whl`

File: `vllm/tool_parsers/gemma4_tool_parser.py`

File SHA-256: `682b2152b76c031df9c58c3ffbb5b243945be5d8957ebdce00faef1b9de6b889`

Method: extract the unmodified pure parsing helper functions with Python AST, then execute them under an external `sys.settrace` guard that aborts after 20,000 line events. No model, GPU, or inference server was started for this check.

One directly compared pair of inputs to `_parse_gemma4_args`:

```
Control:   args:[<|"|>Fix list[str] handling<|"|>]
Malformed: args:["Fix list[str] handling"]

```

- Control: returned `{'args': ['Fix list[str] handling']}` after 60 traced line events.

- Malformed input: hit the guard at 20,001 events without returning. In `_parse_gemma4_array`, cursor `i=13` did not advance; the same loop location was visited 1,523 times while array items accumulated.

- Across the small check, all three correctly formatted controls returned (60, 82, and 38 events), while all six malformed examples reached the guard.

The local file lacks the zero-progress checks included in [upstream vLLM PR #41991](https://github.com/vllm-project/vllm/pull/41991), which is merged. Our submitted agent uses skill tools with array arguments, so this is relevant to inspect.

This establishes a reproducible problem in that local parser file only. I do not know whether the private scorer currently uses that file or a patched version, and I have no captured hidden-evaluation output showing that #58412868 generated a triggering input. Queueing, ongoing inference, and final validation remain possible explanations.

Could the hosts check these points?

- Is #58412868 queued, preparing its environment, generating patches, or validating patches?

- Has a worker been assigned, and are its heartbeat and completed-task count still advancing?

- If inference has stopped advancing, what was the last successful model request, and do the server logs indicate a parser loop, OOM, or another error?

- Does the deployed Gemma 4 parser include the zero-progress protection from PR #41991 or an equivalent fix?

Please let me know whether this submission should simply remain in the queue or requires intervention from the hosts. I will keep the existing submission in place rather than submitting a duplicate. Thank you.

*(No new comments since cutoff)*


---

## Thread 759514 — five LoRA probes with identical scores 
URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/759514
Author: **xiaoz259** (MASTER) | Posted: `2026-11-16T02:20:29.262579900Z` | Last Activity: `2026-11-19T07:41:27.210Z`

### Original Post

So I did nothing except submitting the public notebook using LoRA adapter with weights zeros to test and see if it is working. I submitted 5 times and every time I get 0.15. This seems a bit odd. What is your variance like with the public notebook?

### New Comments (8 new comments/replies since 2026-11-11)

- **tammamalasha** (CONTRIBUTOR) at `2026-11-17T00:58:30.423Z`:

what temperature ?”

- **xz** (MASTER) at `2026-11-17T20:02:47.100Z`:

0.2, the same as in the public notebook.

- **pardival** (CONTRIBUTOR) at `2026-11-19T07:41:27.210Z`:

try evaluating locally and observing performance with a fixed seed, LB scores fluctuate too much to be reliable.

- **pomcho555** (EXPERT) at `2026-11-19T05:38:46.973Z`:

[@ryanholbrook](/ryanholbrook) 

Could you look into this issue? Given the bug affecting the highest score (0.29), I suspect another bug may be causing scores to get stuck at the same value when LoRA is used under certain conditions.

Reference: [https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/760126#3556508](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/760126#3556508)

We also encountered this issue with our LoRA submissions (N=2).

Based on the launch logic in adk-submission, our two 0.15 runs used two rank-16 adapters (vLLM --enable-lora --max-loras 2 --max-lora-rank 16). Our other LoRA submission used a single rank-16 adapter (--max-loras 1 --max-lora-rank 16) and scored 0.13. On 4x L4, vLLM also logs "Using default LoRA kernel configs". Could you check whether the scorer behaves differently with multiple adapters, or changes anything else when LoRA is enabled?

- **VELVRIN** (CONTRIBUTOR) at `2026-11-17T16:23:54.437Z`:

same here i tried with different different and same score 0.15

- **xz** (MASTER) at `2026-11-17T20:02:17.620Z`:

Maybe I ask how many submissions scored 0.15?

- **Son Pham** (EXPERT) at `2026-11-16T20:53:58.620Z`:

Maybe they learn from ARC-AGI 3 and decided to implement a hash table to return the same results for same notebook submission? 😄

- **Ankith Savio** (CONTRIBUTOR) at `2026-11-16T09:14:22.957Z`:

Same public notebook : 0.13 - 0.20
The variance is quite high.


---

## Thread 759427 — Is generating SFT trajectories with the hosted Gemma-4-31B-IT API compliant?
URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/759427
Author: **topeseun100** (CONTRIBUTOR) | Posted: `2026-11-15T15:29:17.586002800Z` | Last Activity: `2026-11-15T15:29:17.586002800Z`

### Original Post

Hi hosts,

I'm planning my training-data pipeline and would like a ruling on one method before I run it, because the rules page doesn't address it directly.

What I plan to do

- Fine-tune a LoRA adapter on one permitted base checkpoint: `gemma-4-31b-it-qat-w4a16-ct`.

- Generate the SFT trajectories by running my agent powered by `Gemma-4-31B-IT`, served through the AMD TokenLab hosted API (AMD AI Developer Program — free to join, no card, no payment; the key is a free 10-point allowance). Only Gemma 4 would generate the data — no Claude, GPT, or other teacher model.

- Generate only on the 129 public development tasks, and keep only trajectories whose patches pass the task's own tests (rejection sampling).

- The submitted agent stays exactly one permitted QAT checkpoint, with LoRA adapters only. No API call, key, or network access anywhere in `submission.zip` or `agent.yaml` — the submitted agent runs offline on Kaggle as required.

- I will document full provenance (model id, endpoint, dates, prompts, test-pass filtering) in the training notes.

Why I'm asking

The rules page contains only the Kaggle Foundational Rules, with no clause on trajectory generation, teacher models, external APIs, or hosted inference. The closest text, §4b, bans hand-labelling validation/test data — my method touches neither. The one-model rule, as written, governs the submitted agent at run time ("every agent and sub-agent in your submission must use it"), not the model that generates training data. I also note the ReconScribe guide's summary that, as of 17 October 2026, there was no official ruling on fine-tuning Gemma 4 with trajectories generated by other models.

My questions

- Is using a hosted API (TokenLab) for trajectory generation compliant, given the no-internet / one-model restriction applies to the submitted agent at scoring time?

- Does generating training data with the full-precision `Gemma-4-31B-IT` — rather than the QAT INT4 variant itself — violate anything, given the submitted agent is the permitted QAT checkpoint?

- Does this method fail the "publicly available at no cost / Reasonableness Standard" test for external models in any way? (The TokenLab access is free, with a usage cap rather than a price.)

A small pilot (4 tasks, test-pass filtered) already works and I am happy to share its provenance. I will not run the full 129-task generation until I hear from you.

Thanks for clarifying.

— topeseun100

*(No new comments since cutoff)*


---

## Thread 759388 — Three clarifications: 12-hour limit, scorer environment freeze, submissions after Nov 25
URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/759388
Author: **aibyai** (CONTRIBUTOR) | Posted: `2026-11-15T09:42:01.594419900Z` | Last Activity: `2026-11-15T09:42:01.594419900Z`

### Original Post

Hi Kaggle team,

A few clarifications that matter for planning the final submissions. Thank you in advance.

Q1. 12-hour limit and final scoring. Is it still the case that a submission which hits the 12-hour limit errors as a whole, with no partial score? Will the same rule apply when the private leaderboard scores of the two selected final submissions are determined, or could unfinished tasks be scored as 0 instead?

Q2. Frozen scorer environment. Will the scoring environment stay fixed until the final deadline (2026-12-02 23:59 UTC): the wheelhouse dataset version (currently v31), the sandbox image and the vLLM settings (README says gpu_memory_utilization 0.90; some participants quote 0.80)? If anything changes before the deadline, will it be announced on the forum?

Q3. Submissions after the notebook publishing deadline. The competition metadata lists kernelsPublishingDisabledDeadline = 2026-11-25 23:59 UTC. After that date, can we still create new private versions of our submission notebook and submit them (until the final deadline on 2026-12-02), or must every submission notebook version exist before 2026-11-25?

*(No new comments since cutoff)*


---

## Thread 759329 — Looking for advice: thinking-budget experiments and a 0.15 → 0.13 repeat run
URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/759329
Author: **morikentaro36** (CONTRIBUTOR) | Posted: `2026-11-15T02:59:13.121047400Z` | Last Activity: `2026-11-15T12:40:48.323Z`

### Original Post

I'm trying to improve my Gemma 4 coding agent and would appreciate advice on what to test next.

My setup uses Gemma 4 31B with main/tool LoRA adapters, temperature 0.2, top_p 0.95, and max_output_tokens 8192. The per-task limits are 8 minutes, 28 tool calls, and 80 turns.

So far, the public scores are:

- thinking_budget 4096: 0.13

- thinking_budget 512: 0.15

- A repeat submission of the exact same 512 ZIP: 0.13

I checked the original 4096 and 512 bundles: thinking_budget was the only difference. The repeat used the identical ZIP bytes. These few results are not enough to conclude that 512 is better or to identify the cause of the score variation.

My local practice runs have also exposed an execution problem. One 4096 run hit the 8-minute limit after eight read_file calls without producing a patch. A 512 run saved a patch, but still timed out and had an environment issue. Checks on the saved patch were limited, so I don't count that as a successful end-to-end run or reliable validation score.

Next, I plan to keep 512 and the other settings fixed and instrument model-request wait time, tool execution, setup/model-server readiness, and time to first edit on one or a few public practice tasks. I want to measure completed patches and test results before expanding the comparison. This profiling has not run yet.

For others working on this:

- Have you seen different scores from identical ZIPs, and how do you separate model variability from harness or environment effects?

- How do you make small local comparisons reliable enough to guide changes?

- To avoid read-only loops or a very late first edit, would you prioritize thinking budget, prompts/tool-use policy, or explicit time allocation?

I'd appreciate practical suggestions for the next controlled experiment. Thanks!

### New Comments (1 new comments/replies since 2026-11-11)

- **Nir Aberman** (CONTRIBUTOR) at `2026-11-15T12:40:48.323Z`:

A few things from our runs that map onto your three questions.

- Check the adapter first. With our LoRA loaded, reasoning_content was empty in 0 of 109 calls: our training targets contained no thought text, so the adapter learned to skip thinking. Tool calls then leaked as plain text in 5 of 9 runs. If your adapters were trained the same way, thinking_budget may have nothing to act on. A quick check: log reasoning length per call with and without the adapter.

- Identical ZIPs. Yes. Our same bytes scored 0.20, 0.18 and 0.15, and a public 0.24 bundle re-ran at 0.17 for another team. Mobassir pooled repeated draws at about 1.5 tasks (sigma) per draw, so 0.15 vs 0.13 is one task and fully inside the noise. To tell environment faults from model variance, we log hours-to-score: a normal draw scores in roughly 12-20 h for an 8-minute bundle. A very low score with an unusual latency is the sign of an infra fault, not a model draw.

- Reliable local comparisons:
Calibrate the panel first: apply the gold patch and an empty patch to every public task in your environment. Keep only tasks where gold passes and empty fails; for us that was 70 of 129 (many fastapi tasks lack test deps locally).
Compare arms paired, on the same tasks, preferably 2 runs per arm. Even then, read 12-20 task panels as mechanism checks, not score predictions.

- Late first edit. Prompt rules ("edit by call N") moved our median first edit from 149 s to 91 s but left solves unchanged, and the model often ignores them. What did change behaviour was structure, not instructions. Thinking budget mainly buys runtime safety: 2048 cut session timeouts for Mobassir with solves level, and in our traces the 4096 cap is rarely reached.
Details and data: our paper-track writeups Find Early, Commit Late and Commit Anatomy.


---

## Thread 759322 — We couldn't submit anything due to last submission stuck for 5 days
URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/759322
Author: **tom99763** (MASTER) | Posted: `2026-11-15T01:07:46.462008400Z` | Last Activity: `2026-11-17T14:34:42.723Z`

### Original Post

[@herbison](/herbison) Hi, our submission stucked 5 days and is still not finished yet. Could you help us check it thank you.

### New Comments (6 new comments/replies since 2026-11-11)

- **Tom** (MASTER) at `2026-11-17T14:34:42.723Z`:

Finally it solved

- **mhdaw** (MASTER) at `2026-11-15T20:58:40.333Z`:

november 15 update, it is still the same.
[@ashleyoldacre](/ashleyoldacre) , [@ryanholbrook](/ryanholbrook) , [@herbison](/herbison) , [@elanlearns](/elanlearns) 
please take a look.

- **Sahil Das** (CONTRIBUTOR) at `2026-11-15T11:27:30.850Z`:

Wow. This is very unfortunate, and I am very sorry for you. 
I've faced similar problems, but none of my submissions have been stuck for this long, like ever. 
Honestly, I'd recommend sending an email to Kaggle staff. They usually respond within a day. Might be able to do something about this stuck submission. 
I cannot see any reason it takes this long; the execution time is capped at 12 hours. The evaluation should never take longer than 12-24 hours. Must be due to the GPU shortage they are facing currently. Another possibility is a bug of some sort in their infrastructure, pretty rate but could be the case here. 
But 5 days is really annoying, I would be frustrated too.

- **hsiaosuan** (EXPERT) at `2026-11-15T08:36:20.860Z`:

I think the shortage of GPU L4 * 4 machine supply against high demand has not eased just yet. They implemented the submit block to effectively cut down demand. its frustrating to all of us

- **Pavel Orlov** (EXPERT) at `2026-11-15T04:17:43.263Z`:

It seems Google is trying to catch up with Microsoft in the AI implementation race (as you know, Microsoft recently announced layoffs of 60,000 employees and a shift in focus to AI development. As a result, their services were down for almost a whole day recently, or clients could have suffered billions in losses).

The AI-first approach implies that AI does most of the work. So you're unlikely to get a response from live Kaggle/Google employees. And the answer from an AI probably won't please you.

- **mhdaw** (MASTER) at `2026-11-15T01:25:06.980Z`:

we have tried from web UI, notebook and also cli which resulted with:
{
  "error": {
    "code": 400,
    "message": "Submission not allowed: Your team already has 1 pending submissions; please wait for one to finish scoring.",
    "status": "FAILED_PRECONDITION"
  }
}


---

## Thread 759305 — Title: Submission stuck in "Pending" since Nov 9, blocking all new submissions
URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/759305
Author: **ajnalkarismailsab** (CONTRIBUTOR) | Posted: `2026-11-14T20:40:14.763383200Z` | Last Activity: `2026-11-15T00:58:06.667Z`

### Original Post

Hi Kaggle team,

My submission ref 58169977 (submitted 2026-11-09 16:38 UTC) has been in Pending status for over 5 days. Submissions from other teams made after it have scored normally.

Because of the one-pending-submission limit, every new submission is now rejected with: "Submission not allowed: Your team already has 1 pending submissions; please wait for one to finish scoring." There is no cancel option on the My Submissions page.

Could you please cancel or fail submission 58169977 so I can submit again? Thank you!

### New Comments (1 new comments/replies since 2026-11-11)

- **mhdaw** (MASTER) at `2026-11-15T00:58:06.667Z`:

Our team has the same problem;
our submission ref: 58169760 submitted at 2026-11-09 16:23:44 via kaggle cli has been running for over 5 days
and we cannot submit as well.


---

## Thread 759279 — Lora permission on model
URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/759279
Author: **michaelflorida** (CONTRIBUTOR) | Posted: `2026-11-14T16:54:33.526237900Z` | Last Activity: `2026-11-14T16:54:33.526237900Z`

### Original Post

q1: Is LoRA fine-tuning on community-shared agent trajectories (for example lora_native_resolved.jsonl from the Gemma 4 serving and LoRA verification kit) allowed? 

q2: Does it count as distillation? 

q3: Do the winner release rules in Sections 2.5 and 2.8 apply to the adapter weights and the training data?

*(No new comments since cutoff)*


---

## Thread 759248 — Is it acceptable to use Logprobs in training?
URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/759248
Author: **patrickamaru** (CONTRIBUTOR) | Posted: `2026-11-14T13:40:38.436896300Z` | Last Activity: `2026-11-14T13:40:38.436896300Z`

### Original Post

[@ryanholbrook](/ryanholbrook): I noticed that response_logprobs are not accepted in sampling configs.
They would be essential for my training approach (yes, I know I am late).

Is that limitation for submissions only, or is it also a no-go to use logprobs for training, if you can get access to them?
There was no mention of this in the competition rules.

*(No new comments since cutoff)*


---

## Thread 759238 — Public trajectory datasets generated by proprietary models (SWE-smith, SWE-Gym, SWE-Next): allowed for LoRA training?
URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/759238
Author: **mellamoa** (CONTRIBUTOR) | Posted: `2026-11-14T12:50:45.442566Z` | Last Activity: `2026-11-14T18:12:53.933Z`

### Original Post

Hi organizers,

Two earlier answers cover cases close to this one:

- 742807: participants generating data by calling external models themselves may use them in accordance with the models' license terms.

- 746046: existing public SWE-bench-style trajectory datasets on Hugging Face are permitted for LoRA training.

Our case sits between the two. We do not call any proprietary API. We would like to train a LoRA adapter on trajectory datasets that third parties have already published on Hugging Face, where the trajectories were generated by proprietary models (Claude or GPT). Examples: the SWE-smith trajectories, the SWE-Gym OpenHands trajectories, and SWE-Next. They are freely and equally accessible to every participant.

- Is training on these public datasets permitted, given that we never used the generating models or accepted their providers' terms ourselves?

- If such an adapter is part of a winning submission, does it meet the winner licence requirements (Sections 2.5 and 2.8), or should winning adapters avoid data generated by proprietary models?

A yes or no on each would be enough. Thank you!

### New Comments (3 new comments/replies since 2026-11-11)

- **Jason Krijgsman** (CONTRIBUTOR) at `2026-11-14T13:35:10.920Z`:

I don't see why not, it's publicly accessible to use those datasets and tasks for training LoRA adapters. You can also create teacher rows from more intelligent models as long as you're adhering to the model's license terms. So no pure distillation.

- **@s3werst** (CONTRIBUTOR) at `2026-11-14T14:53:21.030Z`:

Ok sounds great, just making sure. It’s just my knowledge of the SWE datasets is that some are created by OpenAI and Anthropic models, so yea.

- **Ankith Savio** (CONTRIBUTOR) at `2026-11-14T18:12:53.933Z`:

Check comments from staff under this post : [https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/742807](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/742807)


---

## Thread 759162 — Submission stuck in PENDING for 5 days — please help unblock (Ref: 58167516)
URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/759162
Author: **vijaikm** (CONTRIBUTOR) | Posted: `2026-11-14T03:41:06.857171400Z` | Last Activity: `2026-11-17T12:23:33.323Z`

### Original Post

Hi [@ryanholbrook](/ryanholbrook) / Kaggle Team,

My submission has been stuck in PENDING / Notebook Running for nearly 5 days (submitted on Nov 9, 2026, 14:31 UTC):

Competition: Google – The Gemma 4 Developer Agent
Submission Ref ID: 58167516
Notebook / Version: g4-agent-submit - Version 8
Account / Team: vijaikm

Because of the 1 pending submission limit, my team is completely blocked from making any new submissions. Could an admin please check, terminate, or unblock this submission slot? Thank you!

### New Comments (9 new comments/replies since 2026-11-11)

- **shivam** (CONTRIBUTOR) at `2026-11-16T15:11:58.610Z`:

Same issue here. Submission 58171169 (account itskshivam), submitted Nov 9, 2026 at 17:33 UTC from notebook itskshivam/gemma4-submit-v5b (version 1, which completed successfully), has been PENDING for about 7 days. There is no Cancel option on our Submissions page, and every new submission is rejected with "FAILED_PRECONDITION: Your team already has 1 pending submissions; please wait for one to finish scoring."

+1 to clearing the whole Nov 9 batch together. [@ryanholbrook](/ryanholbrook) could you please mark 58171169 as failed (or keep its score if it actually finished) so we can submit again before the Dec 2 deadline? Thank you!

- **Yurnero** (GRANDMASTER) at `2026-11-14T04:56:39.043Z`:

I guess something happened on 9th Nov. Its really frustrating

- **zoro-in-action** (CONTRIBUTOR) at `2026-11-17T12:23:33.323Z`:

Finally stopped. I never thought I will be happy for seeing this  sign .

- **Sumitdevai** (CONTRIBUTOR) at `2026-11-15T17:56:58.917Z`:

I don't know why it takes so much time, mine showing 8hrs still not showing

- **Riyaz Ur Rehman** (CONTRIBUTOR) at `2026-11-14T17:58:00.907Z`:

[@ryanholbrook](/ryanholbrook) My submission has also been stuck in pending / notebook running for about five days, blocking further submissions under the one pending submission limit.

- **Muhammad Haseeb Ahmad** (EXPERT) at `2026-11-14T16:53:13.647Z`:

Email them may be. There're other submissions on the leaderboard from after your submission, so it is not fair for yours to be stuck.

- **KyoungIk Jang** (CONTRIBUTOR) at `2026-11-14T14:21:37.117Z`:

Could the Kaggle competition team please identify and mark as failed all submissions that are still stuck in PENDING from the affected November 9, 2026 submission window, so that the affected teams can submit again?

My submission 58169275 was submitted on November 9 at 15:48 UTC and remains pending, blocking new submissions under the one-pending-submission limit. The submission reported in this thread, 58167516 at 14:31 UTC on the same day, shows a similar problem.

Our earlier support request has not resolved the block. Rather than requiring each team to request an individual reset, could you please check the affected November 9 batch and clear the stuck jobs together? This request is only about jobs that are still stuck, not completed submissions or normally progressing jobs.

Please also confirm whether these failed jobs would count toward the daily submission limit. If marking them failed is not possible, please provide an alternative way for affected teams to submit and an ETA.

Thank you,
KyoungIk Jang

- **J.** (EXPERT) at `2026-11-14T06:09:16.583Z`:

I have the same problem :( it's very frustrating

- **Navneet** (CONTRIBUTOR) at `2026-11-14T05:24:39.853Z`:

All the best for Submission [@vijaikm](/vijaikm)


---

## Thread 759154 — Testing configs offline on the 129 training tasks: my harness and results
URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/759154
Author: **sumyeung** (CONTRIBUTOR) | Posted: `2026-11-14T01:00:56.280927200Z` | Last Activity: `2026-11-14T01:00:56.280927200Z`

### Original Post

My harness for testing agent configs offline, before spending a daily submission, is public: [https://github.com/SumYg/telling-is-not-teaching](https://github.com/SumYg/telling-is-not-teaching) (Apache 2.0). It also backs my paper-track entry ([topic there](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/759153)), so I'm sharing it here too, as the rules ask.

What's in it

- `kaggle_swe/gonogo/`: a Kaggle notebook harness that runs configs on the 129 training tasks on 4×L4. It can run one task at a time, as the scorer does, and alternates several configs within one session.

- `kaggle_swe/build_submission.py`: builds my leaderboard zips from the official sample.

- `results/`: every leaderboard score I got, plus each test's pre-registered plan and report.

What I found, in case it saves you a submission

- 5.5 minutes per task instead of 4: +1.6 points on the training tasks (95% CI −1.6 to +4.7), so no clear gain.

- A code-context skill and self-written lessons in the prompt didn't help either.

- Single scores are noisy: the same zip has scored from 0.12 to 0.17. Scores are truncated to two decimals, and one task of 58 is about 0.017.

Not included: the competition data and the notebooks that embed the sample agent; the scripts regenerate them from the data.

*(No new comments since cutoff)*


---

## Thread 758972 — Eval in kernel is 3x slower than API, vLLM Config to optimise speed
URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/758972
Author: **bharat0** (CONTRIBUTOR) | Posted: `2026-11-13T05:56:05.172645800Z` | Last Activity: `2026-11-15T09:18:29.127Z`

### Original Post

I was using ollama's cloud for running the eval. When my credits are over, I tried kaggle kernel to do the eval and found that it is 3x slower. Below are the comparision.
 

It looks like we can optimise the speed with some vLLM config changes.

The above are AI recommended changes, but I'm not sure of the feasibility of it. If the organisers can look into optimising(If possible) then the models can do more iterations and maybe increase the leaderboard score.

PS: At this point in the competition I'm not expecting any changes to be made, just putting forth an idea.

### New Comments (3 new comments/replies since 2026-11-11)

- **Pranshu Bahadur** (EXPERT) at `2026-11-15T09:18:29.127Z`:

[https://www.kaggle.com/code/pranshubahadur/xarmory-lora-gpu-kernel-guide](https://www.kaggle.com/code/pranshubahadur/xarmory-lora-gpu-kernel-guide)

here is a guide on how to make your own kernels, up the lb bar!

- **mikelou1** (EXPERT) at `2026-11-13T12:41:35.233Z`:

the point of the competition is you cant edit vllm or the inference configs when testing the model so tps is fixed.

- **Bharat** (CONTRIBUTOR) at `2026-11-14T00:35:21.287Z`:

Yes, I agree tps is fixed and it may be increased for everyone within the same hardware limits.


---

## Thread 758969 — Three lessons from 22 submissions: a zip bug, LB noise, and E4B quitting early
URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/758969
Author: **muhammadakhtarquddus** (CONTRIBUTOR) | Posted: `2026-11-13T05:54:42.702432400Z` | Last Activity: `2026-11-16T05:28:22.567Z`

### Original Post

I'm a data engineer new to agent competitions. Here is what I learned from 22 submissions, in case it saves someone a few days.

1. "Notebook Threw Exception"? Check your zip for a second agent.
Two of my 31B submissions failed with no error details. The cause was mine: an old folder from an earlier E4B version was still inside the zip, with its own `agent.yaml` using `gemma-4-e4b-it-qat-w4a16-ct`. The rules say every agent and sub-agent must use the same model. After removing the folder, the same config scored 0.17.
Quick check before submitting: list the zip and print every `model:` line in every `.yaml` file. You should see one model only.

2. The public LB swings by about ±3 tasks between identical runs.

- Budget-Fit (31B, 4 min/task): 0.17, then 0.12 for a byte-identical repeat (only a comment changed). A 5-min version scored 0.13.

- Budget-Aware v2 (31B, unchanged): 0.17 and 0.17 (the public notebook shows 0.22).

- Budget-Aware v2 with 40 calls / 5.5 min: 0.15, so no gain from more calls in my runs.
With 58 public tasks, one task is about 0.017. I now treat any single-run difference under ~0.05 as noise, and I choose finals by average over repeats.

3. E4B gives up early, and a test-loop prompt helped a little.
A public comparison showed E4B finishing tasks in ~1.8 of 5 minutes. Starting from the official sample agent on E4B (0.05):

- Adding a "run the related test; if it fails, read the error and fix again; only then submit" section, with 80 calls / 150 turns / 5 min: 0.08, then 0.05 on a repeat (~0.065 average).

- Forcing "no submit in the first 3 minutes": 0.01. Making it work longer without a reason hurt.

- Temperature 0.6, removing graph tools, or long 31B-style prompts: all 0.03.
So for E4B, a feedback loop helped slightly; more instructions or more time did not.

Credits: Budget-Fit (verracodeguacas) and Budget-Aware v2 (Igor Zharov, based on matterhorn3838's SuperAgent), both Apache 2.0. Thanks also to Ayush Thakur for the public ablations.

My paper-track entry tests a related question on Oracle PL/SQL: does the database's own dependency graph help a small local Gemma 4 agent find and fix bugs? [https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/writeups/plsql-fix-does-oracles-dependency-graph-help-a-l](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/writeups/plsql-fix-does-oracles-dependency-graph-help-a-l)

Happy to answer questions.

### New Comments (1 new comments/replies since 2026-11-11)

- **Georgy Mamarin** (MASTER) at `2026-11-16T05:28:22.567Z`:

For slot two, I'd run the candidates and your first pick a few times on the same held-out issues with the same time budget. If two candidates have similar averages, I'd take the one that reliably fixes more of the issues your first pick misses.

In a [second-slot test I ran on past Kaggle boards](https://www.kaggle.com/code/georgymamarin/did-you-leave-a-better-medal-unsubmitted), I kept the best public entry and added the best one from at least a week earlier, when available. That cost more medal spots than it gained compared with taking the top two public scores. I changed one team's picks at a time.


---

## Thread 758968 — LoRA habit adapters changed the agent's behaviour offline but not the live score: three mechanisms
URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/758968
Author: **niraberman** (CONTRIBUTOR) | Posted: `2026-11-13T05:51:18.276330Z` | Last Activity: `2026-11-13T14:50:50.073Z`

### Original Post

Sharing what did not work for us, in case it saves someone GPU days.
Behaviour moved, score did not. A rank-8 LoRA trained on 442 "edit now" decision points from our own solved runs raised the edit rate at held-out edit-ready points from 0-2% to 67% (93% of edits valid). Live: 0.12, below its own base (0.15, 0.13). A zero-weight adapter in the same slot also scored 0.12.
Adapters silence the thinking channel. With the adapter loaded, 0 of 109 calls carried reasoning content. Tool calls then leaked as plain text in 5 of 9 runs (similar to vLLM issue 39043).
Post-edit training learned to check, not to stop. A follow-up trained on post-edit points repeated one test command up to 144 times and solved 1 of 9.
Bonus: the edit_file failures Kai reported (old_string lost when the edit contains a backtick) trace back to the chat template sorting tool arguments alphabetically, so new_string is rendered before old_string. Fixing it removed the broken calls in our archive but did not raise solves.
Details and data in our paper-track writeups: Find Early, Commit Late and Commit Anatomy.
Question: has anyone seen a live gain from any adapter (LoRA, DPO, anything) that held over 2+ draws? Even a "no" helps.

### New Comments (4 new comments/replies since 2026-11-11)

- **Mohammad Shadab Alam** (MASTER) at `2026-11-13T10:14:37.180Z`:

My rank-8 LoRA  trained to enforce edit deadline + forced  get_code_neighbors , scores 0.17 more often than the base.

- **Nir Aberman** (CONTRIBUTOR) at `2026-11-13T12:04:21.403Z`:

Thanks, that is the first live gain report we have seen. Could you share: how many draws for the LoRA and for the base, and the mean of each? Which base bundle? And does your adapter keep the thinking channel (reasoning_content non-empty with the adapter loaded)? Ours went to 0 of 109 calls with reasoning, which is where our text leaks started

- **Mohammad Shadab Alam** (MASTER) at `2026-11-13T14:43:15.947Z`:

The thinking channel is kept: with the adapter loaded, reasoning is non-empty in all runs. 
I would check: 
(1) do your target sequences contain the thought tokens exactly as the server emits them, 
(2) are any rows empty-thought or template-thought, 
(3) was thinking enabled with the same budget at collection time as at serving time.

- **Nir Aberman** (CONTRIBUTOR) at `2026-11-13T14:50:50.073Z`:

Thank you, check (1) was it. Our training targets carried no reasoning at all (0 of 993 rows): our data builder kept only the tool call, so the adapter learned to skip thinking. Rebuilding with the served thought text next.


---

## Thread 758954 — Scorer minutes: a toolkit to convert time caps between GPUs and measure run to run noise
URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/758954
Author: **akanksha2804** (CONTRIBUTOR) | Posted: `2026-11-13T03:32:57.604045600Z` | Last Activity: `2026-11-13T03:32:57.604045600Z`

### Original Post

Hi all,

Sharing a small toolkit I built while working on this competition, in case it helps others who test on hardware that differs from the scoring machine.

The problem: a time cap per task buys a different amount of model work on every setup. In my runs the same 31B model generated between 13 and 52 tokens per second per session, depending on the GPU and on how many sessions ran in parallel. The scoring hardware itself, four L4 GPUs, was 2.1 to 2.6 times slower per session when I ran 10 sessions at once than when I ran one at a time as the scorer does.

What the toolkit does:

calibrate computes a speed factor f for your run from the model server logs, and the cap you should set so that your local budget matches the scorer.

timing checks whether one factor is enough, by measuring how much of each session goes to model calls, prefill and tools.

noise and draws estimate the spread between identical runs, how many runs you need to trust a gain, and the interval around a single leaderboard score.

Two results that may be useful to you:

With converted caps, four different setups landed within one task of the scorer setup on 55 tasks. With the unconverted cap on a slow setup, 37 of 55 sessions timed out.

Identical runs differ by one to two tasks out of 55. With one run per agent, a real two task gain is ranked the wrong way 11 to 20 percent of the time.

It is plain Python with no dependencies and reads OpenAI, LiteLLM or vLLM logs. The repo also has the aggregate data from 106 runs. Task ids are anonymized and no task content is included.

Repo (Apache 2.0): [https://github.com/akanksha28pathak/scorer-minutes-paper](https://github.com/akanksha28pathak/scorer-minutes-paper)

Writeup in the paper track: [https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/writeups/training-gemma-4-with-curated-developer-data](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/writeups/training-gemma-4-with-curated-developer-data)

Feedback and corrections are welcome, especially from anyone who has measured speed on other setups.

*(No new comments since cutoff)*


---

## Thread 758953 — Are only November 9 submissions stuck in the queue
URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/758953
Author: **shyjin** (EXPERT) | Posted: `2026-11-13T03:30:37.297219500Z` | Last Activity: `2026-11-14T02:09:58.013Z`

### Original Post

I've noticed that all the submissions I've seen stuck in the queue were submitted on November 9.

Is this a normal queue delay, or is there an issue specifically affecting November 9 submissions?

Has anyone who submitted on November 10 or later received a score yet?

### New Comments (3 new comments/replies since 2026-11-11)

- **Kim Kumuha** (EXPERT) at `2026-11-14T02:09:58.013Z`:

Yes — and the window is under five hours. Every stuck submission reported across this thread, #747519,

743683 and #757993 was accepted on 2026-11-09 between 11:28 and 16:03 UTC, in the contiguous ID band
58162267-58169485.

<table>
<thead>
<tr>
<th>Submission</th>
<th>Accepted (UTC, 11-09)</th>
<th>Team</th>
<th>Last reported</th>
</tr>
</thead>
<tbody>
<tr>
<td>58162267</td>
<td>11:28</td>
<td>Vincent Beltrani</td>
<td>~77 h</td>
</tr>
<tr>
<td>58162317</td>
<td>11:29</td>
<td>ours</td>
<td>110 h (11-14 01:45)</td>
</tr>
<tr>
<td>58167555</td>
<td>14:32</td>
<td>FakeEyes2W</td>
<td>52 h, `totalBytes` 0</td>
</tr>
<tr>
<td>—</td>
<td>14:47</td>
<td>amunozo</td>
<td>73 h+</td>
</tr>
<tr>
<td>58168259</td>
<td>15:01</td>
<td>Qiyu_Ma</td>
<td>~87 h</td>
</tr>
<tr>
<td>—</td>
<td>15:07</td>
<td>ubiluby</td>
<td>~96 h</td>
</tr>
<tr>
<td>58168380</td>
<td>11-09</td>
<td>Tong_Shan</td>
<td>36 h+</td>
</tr>
<tr>
<td>58168732</td>
<td>15:22</td>
<td>Rook86</td>
<td>~81 h</td>
</tr>
<tr>
<td>58169275</td>
<td>15:48</td>
<td>KyoungIk Jang</td>
<td>pending; same file scored 0.17 on 11-06</td>
</tr>
<tr>
<td>58169326</td>
<td>15:51</td>
<td>shyjin</td>
<td>83 h+</td>
</tr>
<tr>
<td>58169362</td>
<td>15:53</td>
<td>cryptozenith</td>
<td>3 days+</td>
</tr>
<tr>
<td>58169485</td>
<td>16:03</td>
<td>Cam-Mark</td>
<td>~71 h</td>
</tr>
</tbody>
</table>
Outside the band the queue is fine: Ankith Savio reports five straight days scoring in 13-14 h, and
the public leaderboard shows entries from early 11-12 already scored. Inside it, configuration does
not predict anything — 4.5, 5 and 8 minutes per task, one zip of 1,035 bytes with no adapter, one
byte-identical to a file that scored 0.17 three days earlier. The only shared property is the
acceptance timestamp.

[@ryanholbrook](/ryanholbrook) [@herbison](/herbison), could you check whether that ID range is queued, running or stalled, and
either rerun or error it out without costing a submission (as on 2026-09-26 and 2026-10-08)? Under the
one-pending limit each affected team has been unable to submit for five days, and the submissions
page offers no cancel action.

- **zhudong1949** (MASTER) at `2026-11-13T06:48:07.850Z`:

Kaggle must have had an outage around this time.

- **Ankith Savio** (CONTRIBUTOR) at `2026-11-13T09:05:35.673Z`:

I dont want to jinx it (please god 🙏) but I have consecutively been submitting for the past 5 days which end in 13-14 hours


---

## Thread 758854 — Harness pitfalls: no async functions in the code graph; bad skill names score 0.00
URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/758854
Author: **purnimapathak15** (CONTRIBUTOR) | Posted: `2026-11-12T22:54:42.508364300Z` | Last Activity: `2026-11-14T19:27:54.103Z`

### Original Post

1. The code graph behind search_similar_code contains no async functions

I compared the competition code graph (data released 13 October 2026) with the source of one published task snapshot per repository, using the graph for that task's commit.

- fastapi (67 of 129 published tasks): 914 async functions in the snapshot, 0 in the graph. Of 375 function names that exist only as async functions, 0 appear in the graph.

- httpx: 100 async functions, 0 in the graph.

- rich: 1 async function, 0 in the graph. requests has none.

- Sync functions are present at 94 to 100 percent in all four repositories, so the gap is specific to async code.

search_similar_code, get_code_neighbors and get_code_subgraph work over these nodes, so they cannot return an async function for any query. The organizers already confirmed the omission in "Note on Code Graphs 
for Async Functions" (5 October): none of the private-repository tasks used for scoring touch an async function, so leaderboard scores are not affected. It does matter on the published tasks, the ones teams use 
to develop and compare agents locally: half of them are fastapi, where a fix in an async function cannot be found with these tools, while grep or a lexical index over the files can find it. Earlier notebooks 
noted problems with this graph (fabrianivan/gemma-4-swe-agents-three-paradoxes-ca-hgr, zzgtylors/graphloc-end-to-end-gemma-4-agent-skill); this counts the async gap per repository.

Reproduce: the script parses each snapshot with Python's ast module and counts graph nodes whose source starts with "async def". Counts and code are in benchmark/harness_audit/ of [https://github.com/pupa3066/gemma4-agent-track-blind-spots](https://github.com/pupa3066/gemma4-agent-track-blind-spots)

2. A skill name that is not lowercase kebab-case makes the agent fail to compile, and the leaderboard shows 0.00, not an error

Our first two submissions both scored 0.00. Running them with the official harness on published tasks showed why: the skill was named repo_navigation, the harness rejects names that are not lowercase kebab-case (repo-navigation is fine), and the agent never started, so it made no tool calls. The leaderboard still listed both submissions as complete with score 0.00.

This is one cause of a silent 0.00 that can be checked locally; it is not the only one. In the thread "Skill-only bundle scores 0.00 on the leaderboard but resolves tasks in the harness's Docker mode locally", a bundle that works locally still scores 0.00, which points to a difference in the scoring environment that is not answered yet. If your bundle also fails locally, check skill names first.

To check before spending a daily submission: benchmark/gemma_agent/validate_submission.py in the same repository rejects such names, and benchmark/gemma_agent/diag_agent_selftest.ipynb runs an agent with the official harness on published tasks, next to the organizers' sample agent as a control.

Full write-up: [https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/writeups/what-a-code-search-index-cannot-see](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/writeups/what-a-code-search-index-cannot-see)

### New Comments (1 new comments/replies since 2026-11-11)

- **Purnima Pathak** (CONTRIBUTOR) at `2026-11-14T19:27:54.103Z`:

A correction to our writeup, and something we learned.** After submitting, we found that our BM25 skill never searched the repository. Skill scripts seem to run outside the agent's sandbox, so our script indexed its own skill folder instead of the task's code; in 15 of 16 traces its first output ranked its own file. This means the 4-of-16 versus 4-of-16 comparison in Section 5 of our writeup was between two nearly identical agents, not full-coverage search against none. Sections 3.1 to 3.6 are unaffected. Running the search inside the sandbox instead, as a grep through run_command, worked in our self-tests: 30 of 129 published tasks resolved against 28 without it (p = 0.73). We have recorded the details, with dates, in amendments 4, 5 and 7 of research/PREREG_20day_agent_plan.md at [https://github.com/pupa3066/gemma4-agent-track-blind-spots](https://github.com/pupa3066/gemma4-agent-track-blind-spots). In case it helps anyone using skill scripts for search.


---

## Thread 758821 — Open code and data: agent configs, weight-editing library and held-out task sets (Gemma 4 E4B)
URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/758821
Author: **ozgung** (CONTRIBUTOR) | Posted: `2026-11-12T21:51:09.352237800Z` | Last Activity: `2026-11-12T21:51:09.352237800Z`

### Original Post

For the paper track we studied whether frontier models can fix a defect of the E4B agent by editing its weights
directly. We are sharing the code and data behind the two writeups with all participants, under an OSI-approved
licence:

- Study repository (Apache-2.0): [https://github.com/ozgung/gemma4-weight-edit-study](https://github.com/ozgung/gemma4-weight-edit-study). It holds the three agent
configurations used in our live harness runs (E4B with thinking off, with thinking on, and the serving manifest that
mounts the edit adapters for the thinking-on run), the scripts and protocols of the study, and the paper PDFs.

- `weightprog` (Apache-2.0): [https://github.com/ozgung/weightprog](https://github.com/ozgung/weightprog). A library for reading and editing Gemma 4
weights with MLX and PyTorch backends; edits export as LoRA adapters the harness can serve.

- Replay set (Kaggle dataset): [https://www.kaggle.com/datasets/ozgung/g4-weight-edit-replay](https://www.kaggle.com/datasets/ozgung/g4-weight-edit-replay). 320 held-out
`edit_file` calls of the E4B agent with prompts and file states, and the frozen gate reports.

- OOD-C (Kaggle dataset): [https://www.kaggle.com/datasets/ozgung/g4-oodc](https://www.kaggle.com/datasets/ozgung/g4-oodc). 186 offline Python bug-fix tasks from
148 repositories, with snapshots and wheels, built from SWE-rebench sources.

- OOD-B (Kaggle dataset): [https://www.kaggle.com/datasets/ozgung/g4-oodb-pilot](https://www.kaggle.com/datasets/ozgung/g4-oodb-pilot). Our earlier held-out validation set
in the same offline layout, also from SWE-rebench; it supplied part of the replay calls.

- Notebook (Kaggle): [https://www.kaggle.com/code/ozgung/what-a-weight-edit-does-in-gemma-4-e4b](https://www.kaggle.com/code/ozgung/what-a-weight-edit-does-in-gemma-4-e4b). Loads E4B on an L4, applies one
of the study's edits and shows its effect token by token; it also fits a rank-1 edit in closed form and exports it as
a LoRA adapter.

None of these contains Competition Data. No task, snapshot or gold patch of the competition's repositories (fastapi,
rich, requests, httpx) is included, and the replay calls come from held-out task sets only.

Writeups:

- Frontier Models as Weight Editors for Gemma 4 E4B:
[https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/writeups/frontier-models-as-weight-editors-for-gemma-4-e4b](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/writeups/frontier-models-as-weight-editors-for-gemma-4-e4b)

- Tools and Held-Out Tasks for Testing Agent-Written Weight Edits on Gemma 4:
[https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/writeups/tools-held-out-tasks-agent-written-weight-edits](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/writeups/tools-held-out-tasks-agent-written-weight-edits)

Questions and issues are welcome here or on GitHub.

*(No new comments since cutoff)*


---

## Thread 758817 — Open toolkit for measuring noise in your agent runs
URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/758817
Author: **rathko** (CONTRIBUTOR) | Posted: `2026-11-12T21:44:35.182910500Z` | Last Activity: `2026-11-13T19:02:57.737Z`

### Original Post

I think many people here have the same problem. A lot of "wins" are just luck.

I've open-sourced the tools I use to help understand the scores and what is happening in each run, under Apache-2.0. 

Repo: [https://github.com/rathko/kaggle-glassbox](https://github.com/rathko/kaggle-glassbox)
Live demo: [https://rathko.github.io/kaggle-glassbox/](https://rathko.github.io/kaggle-glassbox/)

They work with any agent that talks to an OpenAI-compatible server:

- capture every model call, and replay or fork a task from any step

- a dashboard for steps, timing and version-by-version comparison

- noise tools: how far two runs drift by chance, and how many runs a decision needs

Thanks to [@Metrix187](/Metrix187) for the calibrated grader, [@dp-pcs](/dp-pcs) for the tool-call reliability study, [@fjcarmona78](/fjcarmona78) for the noise study, and [@verracodeguacas](/verracodeguacas) for the Budget-Fit notebook I built on. 

Cheers

### New Comments (3 new comments/replies since 2026-11-11)

- **Ayush Thakur** (MASTER) at `2026-11-13T11:03:40.380Z`:

I didn't properly read this but can you correct me if my inference from this writeup is correct?

You built a trajectory observation tool to compare between the same task's trajectories and compare the divergence + fork from a step and rollout from there. This forking was based on the knowledge you (+an agent) gained from the divergence. The result is a superior system prompt which is helping with reliable pass rate to some %.

- **Radek Maciaszek** (CONTRIBUTOR) at `2026-11-13T19:02:57.737Z`:

Indeed, the writeup doesn't claim a better prompt. What it describes is how I get to one. 

Forks let me test ideas fast. I replay a recorded run up to the chosen step and try a change from there, so I can check hundreds of variants on a small set of tasks. 

Only once something looks promising do I run the proper full test. 

Tools and data are here: [https://github.com/rathko/kaggle-glassbox](https://github.com/rathko/kaggle-glassbox)

- **Radek Maciaszek** (CONTRIBUTOR) at `2026-11-13T07:09:55.490Z`:

Related Kaggle write-up: [https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/writeups/new-writeup-1794498900936](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/writeups/new-writeup-1794498900936)


---

## Thread 758729 — Public repo with our agent configs and run data
URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/758729
Author: **muhandalsaiari** (CONTRIBUTOR) | Posted: `2026-11-12T19:33:29.566340600Z` | Last Activity: `2026-11-12T19:33:29.566340600Z`

### Original Post

Sharing our repo publicly, as rule 3.6b asks:
[https://github.com/muhandalsaiari/araswe-sandbox/tree/araswe](https://github.com/muhandalsaiari/araswe-sandbox/tree/araswe)

It holds the agent configs and experiment data from our paper-track work
(Gemma 4 12B runs on the public dev tasks). Licence: Apache-2.0.

*(No new comments since cutoff)*


---

## Thread 758599 — Submission stuck in "Notebook Running" for 3 days, blocking all new submissions (ID 58169362)
URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/758599
Author: **cryptozenith** (CONTRIBUTOR) | Posted: `2026-11-12T16:29:40.346883100Z` | Last Activity: `2026-11-13T10:01:43.153Z`

### Original Post

Our submission 58169362 to gemma-4-developer-agent was created on 2026-11-09 at 15:53 UTC and still shows "Notebook Running". The run limit is 12 hours. The Submissions page offers no way to cancel it.

While it is pending, every new submission is rejected. CreateSubmission returns HTTP 400 FAILED_PRECONDITION: "Submission not allowed: Your team already has 1 pending submissions; please wait for one to finish scoring." (last seen 2026-11-12, 16:28 UTC).

Could you cancel or fail submission 58169362 so we can submit again? For your diagnosis: that bundle allowed up to 8 minutes per task, so the run may have exceeded the 12-hour limit without being terminated. Our current bundles use 4.5 minutes.

### New Comments (1 new comments/replies since 2026-11-11)

- **wei pei xuan** (CONTRIBUTOR) at `2026-11-13T10:01:43.153Z`:

Same problem, also a November 9 submission.

Team: ubiluby
Submitted: 2026-11-09 15:07:36 UTC
Status: PENDING ("Notebook Running") for ~96 hours. No score, no terminal error.
The Submissions page offers no cancel or withdraw action.

While it is pending, every new submission is rejected:
400 FAILED_PRECONDITION: "Your team already has 1 pending submissions;
please wait for one to finish scoring."

The bundle is config-only (agent.yaml + one prompt + sampling.yaml + one skill
with two Python scripts, no adapters), 5 minutes per task, validated against the
current wheelhouse. Others report the same, and my own earlier submissions on
2026-10-26, 11-01, 11-03 and 11-04 all completed normally, so this looks
specific to the November 9 wave.

Could this submission be cancelled or failed so the daily slot can be reused, or
included in a rerun? It also looks like the 12h run limit was not enforced here.


---

## Thread 758547 — Skill-only bundle scores 0.00 on the leaderboard but resolves tasks in the harness's Docker mode locally. Do skill scripts run on the scorer?
URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/758547
Author: **clanevil** (CONTRIBUTOR) | Posted: `2026-11-12T14:58:15.757500200Z` | Last Activity: `2026-11-12T19:38:00.540Z`

### Original Post

Hi [@ryanholbrook](/ryanholbrook),

Two of our submissions use one skill script as the agent's only tool besides `submit_patch` and `get_status` (a 190 KB standard-library Python script, called through `run_skill_script`). Both finished COMPLETE with a public score of 0.00. Our tool-based bundles score 0.13 to 0.17.

Locally the same bundle resolves about 40% of the public tasks in the subprocess sandbox. It also resolves tasks with `swegemma eval --sandbox docker` on an image built from the competition's `Dockerfile.sandbox` (swegemma 0.2.11), including when we force the harness's fallback file-copy paths.

Could you confirm whether `run_skill_script` executes in the scoring environment as it does in the public harness's Docker mode? Is there any known difference (file copy into the container, size of the script, gVisor) that would make a skill script return nothing there?

Thanks!

### New Comments (1 new comments/replies since 2026-11-11)

- **GabrielOchoa619** (CONTRIBUTOR) at `2026-11-12T19:38:00.540Z`:

we also rely on run_skill_script to install a helper. Could the staff confirm whether skill scripts execute in the scorer’s Docker sandbox?”


---

## Thread 758289 — Does the scorer serve with the vLLM / swegemma / adk-submission versions from the wheelhouse dataset?
URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/758289
Author: **foysalemonshanto** (EXPERT) | Posted: `2026-11-12T04:42:30.643045500Z` | Last Activity: `2026-11-12T04:42:30.643045500Z`

### Original Post

[@elanlearns](/elanlearns) 
Hi, a quick clarification question for the hosts.
HARNESS_README §3.1 lists the scorer's vLLM settings (TP=4, gpu_memory_utilization=0.80, max_model_len=32768, gemma4 tool/reasoning parsers, enable_lora with max_loras=8 / max_lora_rank=128), but not the package versions.

The wheelhouse dataset metric/gemma-4-developer-agent-wheelhouse currently contains vllm 0.19.1, swegemma 0.2.11, adk-submission 0.2.13 and transformers 5.13.1.

Is the scoring environment pinned to exactly these wheels? If the scorer uses different versions, or if they may change before the final evaluation, could you share which ones? This matters for anyone training LoRA adapters, because tokenization and chat-template rendering must match the served stack token for token.

Thanks!

*(No new comments since cutoff)*


---

## Thread 758218 — How many of the 129 tasks are solved by the agentless 0.22 scorer?
URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/758218
Author: **murugesann** (EXPERT) | Posted: `2026-11-11T22:56:20.780035400Z` | Last Activity: `2026-11-11T22:56:20.780035400Z`

### Original Post

Thanks to [@zbigniewkirchner](/zbigniewkirchner) for sharing the evaluation setup and local harness.

To save the weekly 4× L4 GPU quota, I ran the full 129 local task benchmark using the unquantized Gemma model served via OpenRouter rather than the on-platform QAT version. While wall-clock inference speed isn't comparable to Kaggle L4 runs, the agent logic remains bounded by the tool budget, making the performance profile a strong proxy for local baseline testing.

Run Summary:

Dataset: 129 local tasks (zbigniewkirchner harness)

Model: Gemma via OpenRouter (full precision / non-QAT)

Score: 47 / 129 solved (~0.364 pass rate)

Average Tool Calls: 21.0 per task (with a hard cap of 28 calls)

Notebook Reference: 

Versions 7 & 8 available here: [https://www.kaggle.com/code/murugesann/gemma-4-developer-agent-agentless-task-run](https://www.kaggle.com/code/murugesann/gemma-4-developer-agent-agentless-task-run)

Has anyone benchmarked this exact 129-task local set with the Kaggle-native Gemma container? Curious to see if QAT degradation shows up noticeably on SWE-bench style reasoning.

*(No new comments since cutoff)*


---

## Thread 757993 — Kaggle notebook runtime issue
URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/757993
Author: **kush1235** (CONTRIBUTOR) | Posted: `2026-11-11T10:59:53.321383Z` | Last Activity: `2026-11-12T07:45:49.047Z`

### Original Post

My submission.zip from approximately November 9 still shows “Notebook Running” after two days, with no score or error. My previous two submissions succeeded. Could you check whether this submission is progressing or needs a rerun?

### New Comments (4 new comments/replies since 2026-11-11)

- **Kaz** (CONTRIBUTOR) at `2026-11-12T07:45:49.047Z`:

Same, cant submit for 2 days.😭

- **FakeEyes2W** (CONTRIBUTOR) at `2026-11-11T13:30:25.317Z`:

same. My submission has been running for 52 hrs

- **Qiyu_Ma** (CONTRIBUTOR) at `2026-11-11T12:37:31.100Z`:

It happens to me too. My submission has been running for more than 40 hours.

- **Muhmad KwaZulu gorilla** (CONTRIBUTOR) at `2026-11-11T11:46:15.520Z`:

Imagine waiting 20 hours for a TPU server, just for it to die in 5 minutes violentally


---

## Thread 757893 — To the organizers: 5 concrete scorer fixes, plus an audited task list
URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/757893
Author: **moshegolderson** (CONTRIBUTOR) | Posted: `2026-11-11T05:07:02.779726Z` | Last Activity: `2026-11-11T05:07:02.779726Z`

### Original Post

While building FreshSWE-Py (663 post-release tasks in this competition's format), we ran 1,143 real fixes from 36 Python libraries through swegemma 0.2.11's verification rules. 277 of them (24%) fail with their own correct patch only because of one of five conventions. Two of the 129 public tasks hit the same problem: rich_3486 (also found independently by João Paulo in topic 751707) and fastapi_14186 pass every test with their gold patch but can never be marked resolved.

If the hidden tasks were validated with this same harness, they already exclude these cases and the leaderboard is consistent. The fixes still matter for the two public tasks, for anyone validating on their own copies, and for the final leaderboard. Each has a small fix:

- Drop `-p no:anyio`, or add it only when anyio is not a dependency (79 fixes: all 54 starlette fixes that pass natively, 25 of 43 uvicorn). Their test clients need the anyio plugin's fixtures; with only that flag removed, all 79 pass.

- Keep the repository's pytest configuration (101 fixes). Overwriting pytest.ini drops settings such as `asyncio_mode = auto` and plugin registrations (anyio, litestar, strawberry, parsel). With the repository's own configuration they pass; passing the harness's options as `-o` overrides, instead of rewriting the file, would keep it.

- Pass only collectable test files as targets (65 fixes). Every `.py` file in test_patch becomes a target, so black's tests/data/cases/*.py data files and helper modules in click and loguru are imported as test modules and collection fails. Filtering targets by the repository's python_files pattern (default `test_*.py`, `*_test.py`) would avoid this.

- Don't let a skipped sibling fail a test that passed (24 fixes whose required test, or a sibling with a matching name, is skipped on Linux, plus rich_3486 and fastapi_14186). In `_validate_junit_xml`, any skipped test case that `_node_matches_requirement` matches makes the task fail, and the matcher accepts any name starting with `{req_base}_`. So a required test_x that passes is still rejected when a sibling such as test_x_windows is skipped. Counting only failed or errored cases against a requirement, or prefix-matching only parametrized ids (`{req_base}[`), fixes this. Where the required test itself is skipped on Linux, the task cannot be verified there and is better dropped at validation.

- Read the JUnit report without the 10 MiB output cap (8 fixes, python-multipart). The report is read back through the sandbox's capped output, arrives truncated, and the task is marked unresolved even when every test passed. Copying the file out or streaming it would avoid this.

The audited list is public: validation/scorer_audit.json records, for each of the 1,143 candidates, which convention blocks it, and validation/public_tasks.jsonl gives the outcome for each of the 129 public tasks (no task content). The validation and audit scripts are in validation/scripts/. We are glad to help run them on the hidden set, or to send the exact list in any format you prefer.

Dataset: [https://www.kaggle.com/datasets/moshegolderson/freshswe-py](https://www.kaggle.com/datasets/moshegolderson/freshswe-py)
Score your own patches: [https://www.kaggle.com/code/moshegolderson/freshswe-py-score-your-patches](https://www.kaggle.com/code/moshegolderson/freshswe-py-score-your-patches)
Earlier findings thread: [https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/751707](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/751707)

*(No new comments since cutoff)*


---

## Thread 757588 — I reran a public 0.24 bundle unchanged and got 0.17 (data and short paper)
URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/757588
Author: **harshitsama** (EXPERT) | Posted: `2026-11-10T04:14:30.982530700Z` | Last Activity: `2026-11-12T21:11:11.877Z`

### Original Post

Sharing a small measurement, in case it helps with planning your daily submission.

What we did. We re-submitted public bundles unchanged, with credit. honghanhhh's Budget-Fit v6 prompt-only (public claim 0.24) scored 0.17 for us. emmanuelmirekumensah's budget-v2 (the author gave no score) scored 0.15. kevlarzanderchi's 0.22 Mega Ensemble is still in the queue.

What this does and does not show. One run is not a verdict. With 58 tasks one task is 0.017, and the run-to-run sd is somewhere between about 1.5 and 3 tasks, so a 4-task gap is possible from noise alone. My guess is that published scores are the best of several tries, so expect a reproduction 1 to 4 tasks lower. That is a hypothesis; I have not tested it with repeated runs.

Leaderboard shape on 2026-11-10 (5,250 teams): top 0.29 (1 team), 0.24 (11), 0.22 (74), 0.20 (416), 0.17 (964), 0.15 (764). The median is 0.15.

Resources. Anonymised leaderboard snapshots (rank, score, submission count) for this and three other competitions: [https://www.kaggle.com/datasets/harshitsama/kaggle-public-leaderboards-2026-11-02](https://www.kaggle.com/datasets/harshitsama/kaggle-public-leaderboards-2026-11-02) . Noise-simulation notebook: [https://www.kaggle.com/code/harshitsama/gemma-4-agent-is-0-24-vs-0-22-real-noise-check](https://www.kaggle.com/code/harshitsama/gemma-4-agent-is-0-24-vs-0-22-real-noise-check) . I also wrote this up as a short paper-track writeup.

If you reran a public bundle, I would like to know your score versus the claim (even n=1 helps).

### New Comments (3 new comments/replies since 2026-11-11)

- **Unknown** (CONTRIBUTOR) at `2026-11-12T14:18:30.217Z`:

Yes, variance is about 4-5 tasks in max(1 / ( 120 / 2 )) = 0.017 per task in LB) in my experience.

I only modified skills, and my LB is 0.13--0.20.

By the way, my best shot and worst is the same notebook hahaha(does this mean I didnt make any improvement🤡).

- **Darsh Dhawan** (CONTRIBUTOR) at `2026-11-12T20:52:17.833Z`:

I was also thinking to reupload again and again for the sake of achieving a "statistical exception", even if the std-deviation is around 1.5 task, i'd get into top 500, but I dont execute that approach, cuz then the fall in the final leaderboards could be catastrophic 😭💀

- **Unknown** (CONTRIBUTOR) at `2026-11-12T21:11:11.877Z`:

Haha, I just began to learn LLM fine-tunning related, and this is my first competition. Just want to learn something useful.🤖


---

## Thread 756792 — Are hand-constructed LoRA adapters acceptable (weight edit from activation analysis, not gradient descent)?
URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/756792
Author: **refresh2k** (CONTRIBUTOR) | Posted: `2026-11-07T16:17:29.205435900Z` | Last Activity: `2026-11-17T12:26:26.317Z`

### Original Post

Are hand-constructed LoRA adapters acceptable — e.g., an adapter that expresses a targeted weight edit derived from activation analysis, rather than one produced by gradient-descent fine-tuning? The adapter would be a standard PEFT LoRA adapter in the sanctioned format.

### New Comments (1 new comments/replies since 2026-11-11)

- **Marco Pereira** (CONTRIBUTOR) at `2026-11-17T12:26:26.317Z`:

I asked the concrete version of this question in a separate topic: [https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/759848](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/759848)


---

## Thread 754000 — Stuck Submission
URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/754000
Author: **mohamedtkhalil1995** (CONTRIBUTOR) | Posted: `2026-10-30T01:06:05.673296400Z` | Last Activity: `2026-11-18T13:29:12.073Z`

### Original Post

Hi hosts,

My submission has been showing “Notebook Running” for over 16 hours, well past the 12-hour scoring limit:

Notebook: baseline 024 control, Version 2 (scriptVersionId 363436664)
Submitted: Oct 29, ~08:30 UTC
Team: mohamedtkhalil1995

Because it’s still pending, the submit dialog now says “Your team already has 1 pending submissions; please wait for one to finish scoring.” So I can’t use today’s slot.

The bundle is a prompt-only agent (agent.yaml, eval_config.yaml, sampling config, system prompt). It’s the same structure as my two earlier submissions, which scored normally in a few hours.

Could you cancel or fail this submission so the queue is free again? And if possible, could you restore the daily slot it has blocked? Thanks!

### New Comments (4 new comments/replies since 2026-11-11)

- **Sherry** (CONTRIBUTOR) at `2026-11-17T18:06:37.383Z`:

How did you solve it? I ran into the same issue.

- **Unknown** (CONTRIBUTOR) at `2026-11-18T09:12:13.127Z`:



- **Andrey Kulakov** (CONTRIBUTOR) at `2026-11-18T13:20:31.430Z`:

My finished yesterday after ~24h in submission.. So it seems it is normal now, I suppose there is some internal queue

- **Unknown** (CONTRIBUTOR) at `2026-11-18T13:29:12.073Z`:




---

## Thread 752693 — Interested in teaming up? Please read our public Gemma smoke-test Code first
URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/752693
Author: **cosmorin** (CONTRIBUTOR) | Posted: `2026-10-25T23:19:14.807477200Z` | Last Activity: `2026-11-20T04:45:49.407Z`

### Original Post

We are collecting expressions of interest from prospective teammates working on coding-agent integration, tool handling, evaluation or inference reliability.

Please read our public Code article before applying:
[https://www.kaggle.com/code/cosmorin/gemma-31b-a-verified-read-edit-diff-smoke-test](https://www.kaggle.com/code/cosmorin/gemma-31b-a-verified-read-edit-diff-smoke-test)

It documents a narrow synthetic read/edit/diff smoke test. It is not a full SWE evaluation or evidence of a competition score, and its timing should not be read as scoring runtime.

If interested, apply by replying here after reading the article with the component you could contribute to and one concrete test or experiment you would propose.

An existing team invitation is pending, so we cannot issue another immediately. Any later invitation depends on remaining capacity, team fit and competition eligibility. Please treat this as an expression of interest, not a guaranteed place.

### New Comments (1 new comments/replies since 2026-11-11)

- **cosmorin** (CONTRIBUTOR) at `2026-11-20T04:45:49.407Z`:

Team recruitment — solo team pushing for gold, full publication commitment
Team cosmorin is currently just me, and I am looking for members for the final push. I research with Codex and Muse on a Mac, aiming for gold (0.24; my best so far is 0.18).

My rule across competitions: when we rank in, I publish all solutions up to that point as reproduction notebooks — my Quantum portfolio publications are on my profile if you want to check the track record. Follow cosmorin if you want them as they land.

If you are working on Gemma 4 agent harnesses, task coverage, or long-horizon tool use and want to aim at gold together before the December 2 deadline, reply here.


---

## Thread 751596 — SFT / distillation LoRAs on Gemma 4 31B: loss falls a lot, solve rate doesn’t move. What would you try next?
URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/751596
Author: **munalsingh** (CONTRIBUTOR) | Posted: `2026-10-22T05:40:02.089806100Z` | Last Activity: `2026-11-19T15:13:21.557Z`

### Original Post

Hi all. We've trained several LoRAs for this harness and none beats our prompt-only baseline on paired local evals. We'd value advice from anyone who has worked on agent fine-tuning, trajectory distillation or preference optimization for SWE tasks.

Setup and constraints

- `gemma-4-31b-it-qat-w4a16-ct`. Our agent v11 is a contract-first-style prompt plus a line-number edit skill; it's prompt and tools only, no training.

- Per task: 28 tool calls and 8 minutes. Total: 12 hours for all hidden tasks.

- Training: LoRA r16, alpha 32, lr 1e-4, 1 epoch, Keras on TPU v5e-8, exported to PEFT.

- Serving cost: in our measurements, enabling any LoRA adds about 15-20% time per call (decode about 1.3x slower). An adapter therefore has to beat the baseline by enough to pay for a shorter per-task budget.

- Eval: the official evaluator, paired on the same tasks. 73 gradable public tasks plus a 25-task held-out exam (98 total). A3 got 4 runs per task.

- Noise: identical files have scored anywhere from 7 to 13 of 58 on the public leaderboard (public evidence notebook), so we judge by paired local tests, not leaderboard runs.

Results (98 held-out tasks; v11 solves 38)
A1: 314 Qwen3-Coder-480B runs (nebius SWE-rebench OpenHands), converted to our tools, with each step's reasoning rewritten by Gemma itself (845 trained steps).

- Solved 31. Vs v11: won 2, lost 9.

A2: A1 + 2,000 DeepSeek-V4-Flash runs (nvidia/Open-SWE-Traces), converted 1:1 with the teacher's own reasoning (19K trained steps, 5.3M tokens).

- Train loss 1.0 -> 0.42. Solved 37. Vs v11: won 5, lost 6.

A3: DeepSeek only: 1,976 runs that fit 16K tokens whole, so every example ends with its edit and submit (1,538 tasks, 587 repos).

- Train loss 1.4 -> 0.40 (base model 2.13 on the same rows). Solved 31 . Vs v11: won 3, lost 4.

- Evaluated with a 7-minute cap (what it would ship with) vs v11's 8, so part of its gap may be the cap.

Earlier LoRAs on Gemma's own solved runs (rejection sampling, one run per task) also tied or lost. Leaderboard: prompt-only agents 0.15-0.17; A2 0.12.

What the failures actually are
We matched v11's 41 failed runs on the 73 public tasks against gold edit locations (LocBench-129 labels by muhammedidris28, thanks!):

- Edited within 20 lines of the gold change, but the fix was wrong: 18

- Opened the gold file, never edited (ran out of calls or time): 11

- Edited only other files: 7

- Edited the gold file, far from the change: 3

- Never found the gold file: 2

Median call at which the gold file first appears: 2.

So localization is mostly solved. The failures are wrong fixes in the right place and never committing to an edit. Imitating a stronger model's successful runs on other repos lowers loss, but hasn't changed either one.

Questions

- Has anyone gotten a held-out gain from SFT/LoRA on this harness? If so, what data: teacher runs, self-generated, synthetic? And how many examples?

- On-policy RFT/DPO. Our next plan is to sample v11 4-8 times per task on ~300 training tasks, keep the tasks it solves only sometimes, then train on its own wins (RFT) and on win/loss pairs from the same task (DPO). Is a few hundred pairs enough to matter for a 31B model?

- Pairs for a stateful agent. Would you compare whole trajectories, or branch several continuations from a shared prefix (same repo state) and prefer the one that ends in a passing patch? The second keeps pairs comparable, but costs more rollouts.

- Teacher data format. Did you train on the teacher's own reasoning or rewrite it in the student's voice? Did whole runs vs truncated runs matter for you?

- Hyperparameters vs data. Rank, epochs, learning rate, LoRA scale (alpha/r = 2 for us): has changing these ever turned a null result into a gain for you, or is data the bottleneck?

Any pointers to papers or working recipes for preference optimization on tool-using coding agents are very welcome. Thanks!

### New Comments (6 new comments/replies since 2026-11-11)

- **Ilya Gordey** (EXPERT) at `2026-11-17T17:49:58.387Z`:

Hi, Yurnero :) We measured this on 1,254 runs of our base config (502 tasks, local panels).

Finding the file is not the problem. The gold file is read by call 2 in 63% of runs and by call 3 in 76%.

The problem is what happens next:

- solved runs: 37% of calls and 51% of time are spent before the first edit

- failed runs with a patch: 47% of calls, 59% of time

- timed-out runs: 53% of calls, 62% of time

After opening the right file the agent makes 5 more calls before editing in solved runs and 8 or more in failed ones. Solve rate drops from 53% when the first edit comes within 3 calls to 24% when it takes 12 or more.

And in 86% of the tasks we never solved, the agent was in the right file.

Correlation, not proof: harder tasks need more reading. Does this match what you see?

- **KochiyaSanaeNya** (CONTRIBUTOR) at `2026-11-18T15:03:39.660Z`:

I have encountered a similar issue. In multi-round testing, while adding a LoRA adapter did help the model resolve certain previously unsolvable problems, it also caused the overall success rate to decline—dropping significantly below the performance of the agent alone.

- **KochiyaSanaeNya** (CONTRIBUTOR) at `2026-11-18T15:05:58.360Z`:

Furthermore, I observed that the number of tool calls is significantly higher when a LoRA adapter is incorporated compared to using the agent alone; this, in turn, leads to failure due to exceeding the tool-call limit.

- **KochiyaSanaeNya** (CONTRIBUTOR) at `2026-11-18T15:16:12.293Z`:

As an aside, here are my test results: with the LoRA adapter added, the model retrieved the correct samples on the first tool call for 90% of the test cases, yet it also produced 231 "empty patch" submissions. In contrast, when the agent was tested on its own, it required an average of two attempts to retrieve the correct files, but it only generated 7 "empty patch" submissions. I believe we need to teach the model how to properly conclude the process after receiving the submission results.

- **Munal Singh** (CONTRIBUTOR) at `2026-11-19T14:13:17.357Z`:

Yes I have  observed some similar results in my own Gemma 4 experiments Fine-tuning improved some metrics, but that didn't consistently translate into better solve rates. This competition is so compute-intensive that I'm mostly waiting for the top participants to share their solutions so I can learn from their approaches

- **KochiyaSanaeNya** (CONTRIBUTOR) at `2026-11-19T15:13:21.557Z`:

I discovered that by modifying the B-matrices of the LoRA adapters—specifically by halving the weight increments across all 410 modules—I was able to significantly reduce timeouts. It is clear that excessively large LoRA increments lead to slower performance; however, this change did not improve the accuracy of problem-solving.


---

## Thread 751311 — Request to hosts: inference kernels
URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/751311
Author: **pranshubahadur** (EXPERT) | Posted: `2026-10-21T10:30:59.727549900Z` | Last Activity: `2026-11-16T07:55:48.257Z`

### Original Post

Hey hosts,

The stock w4a16 int4 kernels are slow for inference, my request to you is that you allow us the contestants to supply our own inference kernels.

For instance, on training I get ~200 toks/sec (fwd+bwd) and inference using bespoke kernels is ~319 toks/sec.

### New Comments (3 new comments/replies since 2026-11-11)

- **Dante** (CONTRIBUTOR) at `2026-11-16T01:13:32.410Z`:

This will make the competition more interesting

- **SalmanS24** (CONTRIBUTOR) at `2026-11-16T07:55:48.257Z`:

Could the hosts clarify whether deterministic LoRA reduction can be enabled in the actual evaluation scorer?

I investigated repeated greedy-output variation using the competition's patched vLLM0.19.1 wheel (SHA256 `73c69bafca24fbdad44690c44d6c6446514351e6f3cc9a6057cba05e66051310`). Its LoRA shrink defaults use split-K64 for batch<128 and8 otherwise, with relaxed floating-point atomic additions. Setting only shrink `split_k=1` selects a direct store instead.

In an isolated synthetic test on one L4, Python3.12, Torch2.10.0+cu128 and Triton3.6.0, I loaded the wheel's original Python shrink/config/kernel sources without changing them. Namespace shims bypassed the full serving engine and C++ op registration. Inputs were fixed BF16 tensors, rank16, one slice, with a FP32 intermediate buffer. Four shapes were tested: `(batch, hidden)=(1,4096),(1,8192),(16,4096),(128,4096)`,200 measured calls per arm after warmup, in two fresh processes.

The default arm produced66/200/200/200 distinct outputs in the first process and88/200/200/200 in the second. With only `split_k=1`, every case had one bitwise-identical result across all200 calls, and results also matched across the fresh processes. All values were finite. The single-reduction result has different rounding from the original path; this is not a claim of full-model numerical equivalence or task-quality improvement.

The wheel already supports a tuned `NVIDIA_L4_SHRINK.json` through `VLLM_TUNED_CONFIG_FOLDER`. However, the submitted agent is declarative and I have not found a supported way to configure the scorer's parent environment. A locally modified serving setup would therefore not establish competition compatibility.

- Is there a supported submission mechanism for this existing kernel configuration, or is the scorer environment fixed?

- If fixed, could the hosts consider enabling a deterministic LoRA shrink path, or publish guidance for reproducible LoRA evaluation?

This is an isolated operator result, not proof that this kernel is the sole cause of full-serving variation. I have not tested this change through the actual four-L4 scoring service. I can provide a minimal synthetic reproducer if useful.

- **Pranshu Bahadur** (EXPERT) at `2026-11-15T09:17:48.293Z`:

here is how you can make your own kernels for training and inference, please help yourselves!

[https://www.kaggle.com/code/pranshubahadur/xarmory-lora-gpu-kernel-guide](https://www.kaggle.com/code/pranshubahadur/xarmory-lora-gpu-kernel-guide)


---

## Thread 750490 — budget warning from harness - can it be given for all tool responses?
URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/750490
Author: **murugesann** (EXPERT) | Posted: `2026-10-18T13:57:10.191460100Z` | Last Activity: `2026-11-12T11:57:58.263Z`

### Original Post

Currently, there is an automatic budget warning appended to tool responses when 80% of the tool budget is consumed. This is a very thoughtful feature in the harness that helps agents to become time conscious. 

However, the warning is based only on tools consumed and not time. For difficult issues, some times 80% of time is consumed in first 30% of the tool calls but agents does not get a budget warning.

This feature has a tremendous impact that we have to decide on the tool budget so that agents get warning at right time - this is not always easy or feasible or efficient. 

Though get_status is available, even if agents are instructed to invoke get_status periodically, they ignore that instruction most of the time.

[@ryanholbrook](/ryanholbrook), is it possible to make the harness give budget warning for every tool response from the very start OR provide also a time-based budget warning at 80% of time budget (apart from tool basis)?

### New Comments (1 new comments/replies since 2026-11-11)

- **@范抑扬** (CONTRIBUTOR) at `2026-11-12T11:57:58.263Z`:

[@ryanholbrook](/ryanholbrook) Could the organizers check the actual scorer-side records for our completed submission, without rerunning it if the records are still retained?

Request: a redacted budget-feedback receipt from an existing scored run

- Account: piieace

- Submission time: 2026-11-11 17:48:52 Asia/Shanghai (09:48:52 UTC)

- Filename: submission.zip

- ZIP SHA-256: 3d3bb9bd3a3f14a54b59f80ded62b8ece3bfc8f2402cf643367d3fc134a92567

- Public status/score: Succeeded / 0.17

- Description begins: V10 Time + Tool Call Budget: Dev60 32/60 original source loading trial.

The bundle contained `remaining_time.py`, but we have not established that the private scorer executes its `install()` function. We are not treating the score or the file's presence as proof of activation.

Please inspect ordinary tool responses (`read_file`, `run_command`, `edit_file`, etc.), excluding `get_status()`, and report:

- Whether `time_seconds_remaining` and `tool_calls_remaining` are present as non-null numeric values.

- Whether those fields are actually included in the subsequent request sent to the model, rather than appearing only in a diagnostic event.

- If possible, coverage counts for all ordinary tool responses, with successful and error responses distinguished. Keep `get_status()` and the built-in `budget_warning` separate. Please distinguish missing budget fields from responses after which no further model request occurred, for example because the session ended.

- If live context snapshots are retained, whether the call count matches them and the time value agrees within integer rounding and sampling delay. Otherwise mark this unavailable, not zero.

- The scorer's relevant package versions, and whether the submitted callback installer was invoked, if invocation evidence exists.

We do not need task identities, problem descriptions, source code, patches, hidden tests, or model reasoning. A field-presence/type summary and aggregate coverage counts are sufficient. One redacted response plus its corresponding next model request would prove at least one occurrence; only coverage counts can support an every-response claim.

The public packages record function responses into `SessionTrace` (`agent_runner.py` and `adk_eval_core/tracing/trace.py`), and `save_trace_artifact` can save them when `results_dir` is configured. We do not know whether the private scorer enabled or retained those artifacts.

If records are unavailable, is there an official diagnostic mode using an artificial/public task in the same deployed scorer entrypoint and loader, with only the above budget metadata returned? Such a check must not manually install our callback or add budget fields before measurement, since that would change the behavior being tested.

Please identify whether any result refers to the historical scored run, a new public-task diagnostic in the deployed scorer, or only a local reproduction. An unavailable channel or a generic submission error should remain unknown rather than being interpreted as absent budget feedback. Thank you!


---

## Thread 748287 — New Gemma 4 Models Available: 12B, E4B, and E2B
URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/748287
Author: **ryanholbrook** (STAFF) | Posted: `2026-10-11T11:48:20.757631900Z` | Last Activity: `2026-11-13T02:51:59.870Z`

### Original Post

Hi everyone,

We've added support for [several smaller Gemma 4 variants](https://www.kaggle.com/models/google/gemma-4/other/). You can now use any of the following models for your agents:

- `gemma-4-31b-it-qat-w4a16-ct`

- `gemma-4-12b-it-qat-w4a16-ct`

- `gemma-4-e4b-it-qat-w4a16-ct`

- `gemma-4-e2b-it-qat-w4a16-ct`

We don't support mixing variants within a submission, however. Every agent and subagent in your submission must use the same variant (though they can attach different LoRA adapters.)

These smaller models open up some new strategies:

- More test time compute: Inference is faster and memory burden lower so you can execute more and longer reasoning turns and iteration cycles. You could also experiment with using `ParallelAgent` for concurrent LLM calls (though tool calls are still executed sequentially).

- Faster and more accessible LoRA finetuning: Experiment with different setups more quickly and on more accessible GPUs. We provide L4x4s for use in interactive notebooks, but adapters can now be finetuned on a wider variety of consumer hardware.

- More specialized agents: Smaller models use smaller LoRA adapters, so you can include more of them in your submission.

We're excited to see what you build!

### New Comments (1 new comments/replies since 2026-11-11)

- **John Lambert** (CONTRIBUTOR) at `2026-11-13T02:51:59.870Z`:

Can different one model be used for a submission and for a different submission a different model be used?  Or do all submissions have to used the same model all the time?


---

## Thread 747519 — Update on "Kaggle Error" Submissions & Queue Delays
URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/747519
Author: **herbison** (STAFF) | Posted: `2026-10-08T22:09:44.425997400Z` | Last Activity: `2026-11-19T06:24:41.077Z`

### Original Post

Hi everyone,

I wanted to give an update on the long submission wait times and "Kaggle Error" failures many of you have been seeing over the past couple of days.

What Happened
Due to very high submission volume using L4s, submission jobs have been facing long queue times before actually getting a machine to run. Submissions that waited >15h to start were being marked as “Kaggle Error” even if they eventually did run.

What We Fixed

- Extended Queue Timeout: We've drastically extended the queue allowance so submissions will no longer be timed out while waiting to run.  

- Scoring Submissions that had Queue Timeouts: We are actively reprocessing all affected submissions from the past few days. If your notebook ran to completion and produced a valid submission file, it is being scored and published to the leaderboard automatically. You should already see scores showing up on the leaderboard now.  

- Queue Wait Times: to even some of the load on the pool, we are implementing a pending submission limit (separate from the 1/day limit). If your team's previous submission is still scoring, you will need to wait until it finishes to submit again.

What This Means for You

- No action needed: You do not need to resubmit or contact support to recover an affected run; our batch recovery is processing them directly.  

- Monitor this post for updates

Thanks for your patience while we sort this out, and sorry for the frustration it caused over the last few days.

### New Comments (52 new comments/replies since 2026-11-11)

- **shivam** (CONTRIBUTOR) at `2026-11-17T14:30:57.113Z`:

Is the Deadline going to be extended… been trying to submit from 3 days… not able to make one submission… current submission is running for 18h + and the previous one ran for 7 days

- **[HOST/STAFF]** **Ashley Oldacre** (STAFF) at `2026-11-16T18:17:19.217Z`:

Thank you everyone for your patience. We have seen the most recent comments about submissions being stuck. We are looking into this and we will get back to you as soon as possible.

- **Qiyu_Ma** (CONTRIBUTOR) at `2026-11-16T18:18:45.830Z`:

Thank you!

- **paul-1994a** (CONTRIBUTOR) at `2026-11-16T20:31:05.127Z`:

Thank you a lot !

- **Deenadayalan Kuravar** (CONTRIBUTOR) at `2026-11-17T09:45:19.933Z`:

Hi, my submission is still running 17+ hrs it would be better if you solve the delays. Thank you.

- **J.** (EXPERT) at `2026-11-14T10:46:43.807Z`:

5 days and my submission is still scoring and prevents me from more entires. Please, could you cancel it so I can keep participating in the competition? ref. 58172153 [@herbison](/herbison)  [@ryanholbrook](/ryanholbrook)

- **[HOST/STAFF]** **Ashley Oldacre** (STAFF) at `2026-11-16T18:15:34.990Z`:

Hi J, Thank you for flagging. Our team has been notified and we are looking into this. We will share an update soon. Thank you for your patience and we apologize for the inconvenience.

- **Siyuan Chen** (CONTRIBUTOR) at `2026-11-14T05:20:08.067Z`:

Adding ours to the 2026-11-09 cohort: submission 58168453, submitted 2026-11-09 15:09:51 UTC, PENDING for ~5 days with no score and no error, which blocks our next submission under the one-pending limit. A sibling bundle of the same family completed normally on 11-06, so a runtime overrun on our side is unlikely. [@herbison](/herbison) [@ryanholbrook](/ryanholbrook) if it cannot be scored, could you cancel or error it out so the slot is released? We will also file through the support form. Thank you!

- **[HOST/STAFF]** **Ashley Oldacre** (STAFF) at `2026-11-16T18:15:50.853Z`:

Hi Siyuan, Thank you for flagging. Our team has been notified and we are looking into this. We will share an update soon. Thank you for your patience and we apologize for the inconvenience.

- **shyjin** (EXPERT) at `2026-11-13T03:22:29.303Z`:

Submission 58169326(submitted 2026-11-09 15:51:32 UTC) has shown "Notebook Running" for over 83 hours. [@herbison](/herbison) [@ryanholbrook](/ryanholbrook), could you check whether these are still queued or stuck? If ours can't be scored, erroring it out would let us submit again. Thanks!

- **amn** (CONTRIBUTOR) at `2026-11-13T17:59:29.367Z`:

I met the same issue where 58168200 runs or pends for already 4 days and I have no idea how to continue this competition.

- **Qiyu_Ma** (CONTRIBUTOR) at `2026-11-13T05:57:06.693Z`:

Same here. My submission 58168259, accepted around 2026-11-09 15:01 UTC, has also remained pending for approximately 87 hours, with no score or error.
Several participants in this thread have reported submissions from the same day being stuck for a similar length of time. This suggests a possible scoring-side or queue issue. [@herbison](/herbison) [@ryanholbrook](/ryanholbrook), could you please check whether the submission is still queued, actively running, or stuck? It is blocking our next submission under the one-pending-submission limit. If it cannot be scored, could you please cancel it or mark it as failed so we can submit again?
Thank you for your help.

- **KyoungIk Jang** (CONTRIBUTOR) at `2026-11-12T21:13:14.063Z`:

Same here. Our submission 58169275 was created on 2026-11-09 at 15:48 UTC, five minutes before yours, and is
 still PENDING with no score or error (checked 2026-11-12 21:10 UTC).
 An identical bundle completed normally on 2026-11-06, and it stops itself well before the 12-hour limit, so a
 runtime overrun on our side seems unlikely. Two teams' submissions created five minutes apart and both stuck
 since then point to a scoring-side issue around 15:45-16:00 UTC on 2026-11-09.
 Could the Kaggle team also cancel or fail 58169275 so our team can submit again? We reported it through the
 support form as well.

- **KyoungIk Jang** (CONTRIBUTOR) at `2026-11-13T08:07:29.860Z`:

Follow-up on submission 58169275 (submitted 2026-11-09 at 15:48 UTC): it remains PENDING and the one-pending-submission limit is blocking our team from submitting again. We have also contacted support through the official form.

For clarity, the identical file is our earlier submission 58051705, which completed normally with a public score of 0.17. Submissions 57743987 and 57682095 were earlier versions of the agent, not the same file. These observations do not establish the cause of the delay.

Could the Kaggle team please investigate and cancel, fail, or re-queue 58169275 as appropriate? If it is cancelled or failed, please also clarify whether it counts toward the daily submission limit. Thank you.

- **zhudong1949** (MASTER) at `2026-11-13T06:40:52.523Z`:

[@herbison](/herbison) [@ryanholbrook](/ryanholbrook) Is the Kaggle team on holiday at the moment? I haven't received any response so far.

- **vjb** (CONTRIBUTOR) at `2026-11-12T16:54:11.930Z`:

Same here: our submission 58162267 has been PENDING since Nov 9, 11:28 UTC (~77 h), with no error, and it's blocking our next one under the one-pending limit. Our earlier submissions cleared in about a day. It looks like several submissions from Nov 9 are in the same state (58167555, 58169485 above). [@Dustin](/Dustin) [@Ryan](/Ryan) Holbrook, could you check whether these are still queued or stuck? If ours can't be scored, erroring it out would let us submit again. Thanks!

- **amunozo** (CONTRIBUTOR) at `2026-11-12T16:18:34.127Z`:

Same problem here, adding our details in case it helps to find the cause. Team amunozo: submission.zip uploaded 2026-11-09 14:47:25 UTC has been PENDING for more than 73 hours, with no "Kaggle Error". Our four previous entries with the same limits were scored within a day. Judging by the public leaderboard, entries uploaded by other teams as late as early 11-12 UTC are already scored, so this doesn't look like normal queue order. With the pending limit we have not been able to submit since 11-09. Could staff rerun or cancel the stuck submissions so the slots are released, and say whether the lost daily submissions will be restored? Thank you.

- **Rook86** (CONTRIBUTOR) at `2026-11-11T13:52:03.573Z`:

Submission 58168732 (submitted 2026-11-09 15:22 UTC) has shown "Notebook Running" for over 48 hours. The ZIP (1,035 bytes, agent.yaml / eval_config.yaml / prompts/system.md, no adapter, 5 min / 48 tool calls per task) validates with the official compiler. Because of the one-pending-submission limit I cannot submit anything else. Could you check whether this run is stuck and clear it if so?

- **Rook86** (CONTRIBUTOR) at `2026-11-13T02:39:15.983Z`:

Follow-up: submission 58168732 is still "Notebook Running" after about 81 hours (submitted 2026-11-09 15:22 UTC). Either clearing it or letting it finish would help; the one-pending-submission limit is blocking our team's further submissions. Submission file: submission.zip, 1,035 bytes, no adapter, 5 min / 48 tool calls per task.

- **FakeEyes2W** (CONTRIBUTOR) at `2026-11-11T04:37:38.657Z`:

Hello Kaggle Support / competition operations team,

Could you check the current processing state of our submission to Google - The Gemma 4 Developer Agent Competition?
FakeEyes2W Submission ID: 58167555 
Submitted: 2026-11-09 14:32:43 UTC
 Status: PENDING for roughly 38 hours — no public score, no terminal error, totalBytes reported as 0.

Please confirm: is it waiting for L4×4 resources, actively running, or stalled?

What worries me most is what it does to everything else. When I tried to submit a fixed version today, I got:

400 FAILED_PRECONDITION: Your team already has 1 pending submissions; please wait for one to finish scoring.

So the stuck run is blocking every further submission. With one submission a day and about three weeks left, that's a day of the competition quietly evaporating every time it doesn't clear.

- **Jak Ma** (MASTER) at `2026-11-11T04:57:54.160Z`:

I also with this.😭

- **Cam-Mark** (CONTRIBUTOR) at `2026-11-12T15:24:12.963Z`:

Same here: our submission 58169485 has been PENDING since 2026-11-09 16:03 UTC (~71 h), and it's blocking our next one under the one-pending limit. Our submissions in the week before scored within 7–41 h. [@Dustin](/Dustin) [@Ryan](/Ryan) Holbrook, could you check whether the L4 queue is moving, or whether submissions from around 11-09 are stuck? If ours can't be scored, please error it out so we can submit again. Thanks!

- **bytebender** (CONTRIBUTOR) at `2026-11-13T04:59:02.503Z`:

exactly same

- **Unknown** (CONTRIBUTOR) at `2026-11-19T06:24:41.077Z`:



- **Unknown** (CONTRIBUTOR) at `2026-11-19T01:46:35.267Z`:



- **Unknown** (CONTRIBUTOR) at `2026-11-18T17:14:59.243Z`:



- **Unknown** (CONTRIBUTOR) at `2026-11-18T16:25:08.533Z`:



- **Unknown** (CONTRIBUTOR) at `2026-11-16T20:03:10.553Z`:



- **Unknown** (CONTRIBUTOR) at `2026-11-16T15:55:01.543Z`:



- **Unknown** (CONTRIBUTOR) at `2026-11-16T08:08:33.770Z`:



- **Unknown** (CONTRIBUTOR) at `2026-11-16T08:02:42.690Z`:



- **Unknown** (CONTRIBUTOR) at `2026-11-16T04:56:36.647Z`:



- **Unknown** (CONTRIBUTOR) at `2026-11-15T03:10:29.990Z`:



- **Unknown** (CONTRIBUTOR) at `2026-11-14T19:32:51.717Z`:



- **Unknown** (CONTRIBUTOR) at `2026-11-14T19:23:21.323Z`:



- **Unknown** (CONTRIBUTOR) at `2026-11-14T15:11:48.770Z`:



- **Unknown** (CONTRIBUTOR) at `2026-11-14T14:42:09.077Z`:



- **Unknown** (CONTRIBUTOR) at `2026-11-13T15:19:24.437Z`:



- **Unknown** (CONTRIBUTOR) at `2026-11-13T15:20:05.697Z`:



- **Unknown** (CONTRIBUTOR) at `2026-11-13T12:46:55.487Z`:



- **Unknown** (CONTRIBUTOR) at `2026-11-13T09:02:42.057Z`:



- **Unknown** (CONTRIBUTOR) at `2026-11-13T11:04:59.260Z`:



- **Unknown** (CONTRIBUTOR) at `2026-11-12T01:17:20.587Z`:



- **Unknown** (CONTRIBUTOR) at `2026-11-11T14:12:35.367Z`:



- **Unknown** (CONTRIBUTOR) at `2026-11-11T13:46:06.353Z`:



- **Unknown** (CONTRIBUTOR) at `2026-11-11T06:33:51.327Z`:



- **Unknown** (CONTRIBUTOR) at `2026-11-12T01:18:21.827Z`:



- **Unknown** (CONTRIBUTOR) at `2026-11-13T06:45:52.953Z`:



- **Unknown** (CONTRIBUTOR) at `2026-11-17T13:19:34.943Z`:



- **Unknown** (CONTRIBUTOR) at `2026-11-14T14:12:08.400Z`:



- **Unknown** (CONTRIBUTOR) at `2026-11-16T18:15:26.407Z`:



- **Unknown** (CONTRIBUTOR) at `2026-11-11T07:14:42.137Z`:




---

## Thread 744354 — Thinking mode drops the model's thoughts between tool calls (vLLM ignores `reasoning_content`). Will the scoring environment be patched?
URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/744354
Author: **wukeneth** (EXPERT) | Posted: `2026-09-29T14:05:56.996308900Z` | Last Activity: `2026-11-12T07:13:09.273Z`

### Original Post

Hi organizers,

With thinking on (the scoring server's default), the thought the model writes before a tool call never reaches the prompt of the next step. The model has to re-derive its reasoning at every tool call. Gemma 4's docs say thoughts must be kept inside a tool-calling turn ("thoughts must NOT be removed between the function calls", [prompt formatting guide](https://ai.google.dev/gemma/docs/core/prompt-formatting-gemma4)).

Cause. ADK (`google-adk` 1.36.1, `LiteLlm`) sends the previous thought as `reasoning_content`. vLLM 0.19.1 only reads `reasoning` from incoming messages (`vllm/entrypoints/chat_utils.py`, line 1512: `reasoning = message.get("reasoning")`), so the thought is dropped before the chat template sees it. The Gemma 4 template itself accepts both names. This is a known upstream bug: [vllm-project/vllm#38488](https://github.com/vllm-project/vllm/issues/38488), with a fix proposed in [vllm-project/vllm#42664](https://github.com/vllm-project/vllm/pull/42664).

Reproduction (scoring vLLM config, `gemma-4-31b-it-qat-w4a16-ct` v2, 4×L4). Render one history (user → assistant tool call with a thought → tool result) through `/tokenize` + `/detokenize`, with the thought under different keys:

```
import requests
URL = "http://127.0.0.1:8000"
model = requests.get(f"{URL}/v1/models").json()["data"][0]["id"]
tools = [{"type": "function", "function": {"name": "get_time", "description": "Returns the current server time.",
                                           "parameters": {"type": "object", "properties": {}}}}]
thought = "The user wants the time. I will call get_time. My secret word is PAPAYAQUOKKA."

def history(**extra):
    return [{"role": "system", "content": "You are a careful assistant."},
            {"role": "user", "content": "What time is it?"},
            {"role": "assistant", "content": "", **extra,
             "tool_calls": [{"id": "call_1", "type": "function", "function": {"name": "get_time", "arguments": "{}"}}]},
            {"role": "tool", "tool_call_id": "call_1", "content": '{"time": "12:34"}'}]

for label, extra in [("no thought", {}), ("reasoning_content", {"reasoning_content": thought}), ("reasoning", {"reasoning": thought})]:
    body = {"model": model, "messages": history(**extra), "tools": tools,
            "add_generation_prompt": True, "chat_template_kwargs": {"enable_thinking": True}}
    toks = requests.post(f"{URL}/tokenize", json=body).json()["tokens"]
    text = requests.post(f"{URL}/detokenize", json={"model": model, "tokens": toks}).json()["prompt"]
    print(f"{label:18s} {len(toks):4d} tokens | thought in prompt: {'PAPAYAQUOKKA' in text}")

```

```
no thought           86 tokens | thought in prompt: False
reasoning_content    86 tokens | thought in prompt: False   <- what ADK sends
reasoning           114 tokens | thought in prompt: True

```

It happens in real harness runs. In the 636 public thinking-on baseline runs shared by [@zzgtylors](/zzgtylors), we looked at 3,640 consecutive tool-call steps (no user message in between, before compaction, previous step had a thought and ≥300 completion tokens). The next prompt grew by only a median 0.35× of the previous reply; if the reply were kept, it would be at least 1×. With thinking off it is 1.1×.

Fix options (harness side; submissions cannot reach this layer):

- In vLLM `chat_utils.py`: `reasoning = message.get("reasoning") or message.get("reasoning_content")` (the upstream fix), or

- Have the harness / ADK send the thought as `reasoning`.

Questions:

- Can you confirm this is unintended?

- Will the scoring environment be patched, and roughly when? We need to know whether to tune submissions for thinking mode before the Dec 2 deadline.

- If it is patched, will existing submissions be re-scored under the fixed environment?

Thanks!

### New Comments (4 new comments/replies since 2026-11-11)

- **Lazaros Avramidis** (CONTRIBUTOR) at `2026-11-11T09:23:47.483Z`:

Hi Ryan,

Following your earlier update about the `reasoning_content` compatibility fix, we reproduced the issue on November 11 using the latest officially available Gemma 4 Developer Agent wheelhouse (v31, last updated October 12).

We ran a private Kaggle notebook on 4× L4 with the official Gemma 4 31B serving configuration.

Using the same synthetic tool-call history, changing only the incoming assistant reasoning field, we observed:

- `reasoning`: 76 tokens

- `reasoning_content`: 61 tokens

- Reasoning omitted: 61 tokens

The `reasoning_content` and omitted-reasoning token sequences were identical.

The loaded vLLM 0.19.1 implementation still reads `message.get("reasoning")` in `vllm/entrypoints/chat_utils.py` (line 1512).

Reproduction notebook:
[https://www.kaggle.com/code/lazarosavramidis/astakos-reasoning-final-d05a1386](https://www.kaggle.com/code/lazarosavramidis/astakos-reasoning-final-d05a1386)

Could you clarify whether the managed competition scorer already includes the compatibility fix, and whether an updated public wheelhouse will be provided for parity?

Our existing submission is #58029790 (public score 0.20). We would also appreciate knowing whether resubmitting the unchanged ZIP would be meaningful after the scorer update.

Thank you!

- **kimdonggyu1255** (CONTRIBUTOR) at `2026-11-12T03:19:26.917Z`:

Hi Lazaros. I am not the host, but this may save you some time while you wait. As far as I can tell from the public wheels, the patch was made in the harness client, not in vLLM, so vLLM 0.19.1 still reading only `reasoning` is expected.

Where it is. `adk_submission` 0.2.13, `adk_submission/resolvers/generation.py` (I re-downloaded the wheel from the current wheelhouse today):

- `_normalize_reasoning_message()` copies `reasoning_content` into `reasoning` on any message that has the first and lacks the second.

- `install_litellm_reasoning_patch()` wraps ADK's LiteLlm helpers (`_content_to_message_param`, `_ensure_tool_results`, `_get_completion_inputs`) with it. It runs on import and again from `server.py`. Its docstring says it mirrors `reasoning_content` into `reasoning` "so vLLM<=0.21.x preserves prior thoughts across multi-step tool calls (when `include_thoughts` is not `False`)".

In the builds I kept, 0.2.11 has no such code, 0.2.12 (the 30 Sep wheelhouse) has it, and 0.2.13 keeps it and adds the reverse case: with `include_thoughts: false`, both fields are stripped from the outgoing history on purpose.

What it means for your test. A history posted straight to the vLLM endpoint never passes through this patch, so identical token counts for `reasoning_content` and for no reasoning are what the code predicts. Messages built by the harness arrive with `reasoning` already filled, which is your 76-token case. Your notebook is private, so I could not see which path it used. If it went through `adk_submission` and still gave 61, that would be a real finding.

A check that goes through the harness. In my own notebook runs with the public wheels (same configuration and prompt, 129 tasks), I regressed the growth of input tokens from one turn to the next on the previous turn's output tokens, with the tool result's size as a second regressor, leaving out pairs where the input dropped by more than 1,500 tokens (compaction, sub-agent hand-off). The slope was 0.07 in a run made the day before the 30 Sep update and 1.03 on the 30 Sep build: thoughts used to vanish from the next input, and now they are re-read. The same regression on traces from your own harness runs would show what your configuration gets. I have not repeated it on 0.2.13.

None of this shows whether the scorer runs exactly these wheels. Only the host can confirm that.

- **Lazaros Avramidis** (CONTRIBUTOR) at `2026-11-12T07:13:09.273Z`:

Thank you, kimdonggyu1255. We independently checked the official adk_submission 0.2.13 wheel and confirmed your explanation. _normalize_reasoning_message() mirrors reasoning_content into reasoning, and the compiler installs the LiteLlm patch.

We also replayed a synthetic thought/tool-call/tool-result history through our compiled champion's actual ADK/LiteLLM path on CPU. The outgoing HTTP request contained both fields with the same nonempty thought, with include_thoughts=true.

Correction to our earlier comment: our 76/61/61-token experiment called vLLM directly and bypassed this client-side patch. It therefore does not establish reasoning loss in our agent or the managed scorer. We withdraw that inference. Exact managed-scorer parity remains for the host to confirm.

Thanks for pointing us to the relevant implementation.

- **Navneet** (CONTRIBUTOR) at `2026-11-12T03:45:14.473Z`:

Thank you for the info on the scoring environment [@wukeneth](/wukeneth)


---

## Thread 743683 — Rerunning Failed Submissions
URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/743683
Author: **ryanholbrook** (STAFF) | Posted: `2026-09-26T12:01:49.976290200Z` | Last Activity: `2026-11-11T02:53:12.767Z`

### Original Post

Hi everyone,

Some submissions since yesterday were failing with `"Your notebook has requested more CPU, GPU or TPU resources than are available."` I believe I've resolved the issue, though please let me know if you're still having issues. I will rerun the affected submissions on Monday so that you won't be losing a submission.

### New Comments (1 new comments/replies since 2026-11-11)

- **Tong_Shan** (CONTRIBUTOR) at `2026-11-11T02:53:12.767Z`:

Hi [@ryanholbrook](/ryanholbrook) ,

My Gemma 4 Developer Agent submission #58168380 has been stuck in PENDING / Notebook Running for over 36 hours, with no score or error.

Could you please check whether the submission is stuck and, if so, clear the pending state? If possible, please preserve or rerun the original submission and restore any lost submission opportunity.

Thank you for your help.


---

## Thread 743007 — Welcome to the Gemma 4 Developer Agent Competition
URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/743007
Author: **elanlearns** (CONTRIBUTOR) | Posted: `2026-09-24T15:59:36.202976300Z` | Last Activity: `2026-11-19T03:34:01.640Z`

### Original Post

Hello Kagglers,

Today’s most capable software engineering agents rely on massive, closed-source models running in the cloud, leaving advanced autonomous development tools out of reach for many developers.

With Gemma 4, we want to change that.

Our challenge to you is to push the boundaries of open-source models and post-train Gemma 4 into an autonomous coding agent capable of navigating real-world repositories and reliably resolving software engineering tasks on consumer-grade hardware. To help you get started, we’ve provided a [starter submission](https://www.kaggle.com/competitions/gemma-4-developer-agent/data?select=sample_submission), [development tasks](https://www.kaggle.com/competitions/gemma-4-developer-agent/data?select=tasks.jsonl), and a corresponding dataset of structured [code graphs](https://www.kaggle.com/competitions/gemma-4-developer-agent/data?select=graphs) with [pre-computed embeddings](https://www.kaggle.com/competitions/gemma-4-developer-agent/data?select=embeddings) for repository-level retrieval.

Whether you explore parameter-efficient fine-tuning, novel reinforcement learning approaches, or graph-based code reasoning, we want to see how far you can take local, open models. 

We can't wait to see the agents you build and the solutions you invent!

Google Research and The Gemma Team

### New Comments (1 new comments/replies since 2026-11-11)

- **Itachi45** (CONTRIBUTOR) at `2026-11-19T03:34:01.640Z`:

Question for the competition hosts: the rules allow appropriately licensed automated ML tools, but also require submissions to be the entrant’s own original work. Is a registered entrant eligible for judging and cash prizes if they disclose that an AI assistant designed, built, tested, and uploaded the entry on their behalf, with no hands-on development by the entrant? If so, what attribution or documentation is required if the entry adapts portions of a public Apache 2.0 Kaggle notebook? Thanks for clarifying.


---


---

<!-- ====================================================================== -->
<!-- FILE: 03-chronological-forum-roundup-2026-10-31-to-2026-11-20.md -->
<!-- ====================================================================== -->

# Chronological Roundup of Discussion Board Activity
**Competition:** Google – The Gemma 4 Developer Agent Competition  
**Window:** October 31, 2026 to November 20, 2026 (21 Days)  
**Coverage:** 318 total discussion board events (83 new threads, 235 comments & nested replies) across 108 captured topics.  
**Generated:** November 20, 2026  
---
## Executive Timeline & Four Thematic Phases

| Phase | Dates | Key Strategic Narrative & Highlights |
|---|---|---|
| **Phase 1: The 0.24 Ceiling & LoRA Collapse** | Oct 31 – Nov 04 | The community hits a strict **0.24 score ceiling**. Grandmaster Luca Massaron scores **0.00** with LoRA adapters due to `Gemma4ClippableLinear` bugs and 12-hour timeout blowouts. Critical bugs discovered in vLLM array tool-call parsing (`#753973`) and `LlmEventSummarizer` dropping tool calls (`#754783`). Docker sandbox testing reveals structurally unsolvable FastAPI tasks (`#755554`). |
| **Phase 2: The 0.29 Spike & Small Model Inception** | Nov 05 – Nov 10 | Grandmaster **Yurnero** temporarily breaks through to **0.29**. Public task audits reveal 61/129 tasks lack discriminative power (`#756400`). Community harnesses released (`#756315`). Host announces **$10,000 Small Model Prize** for Gemma E2B/E4B (`#751104`). Severe ambiguity arises over the Nov 12 vs Dec 2 deadline (`#757244`). Submissions begin accumulating in the queue. |
| **Phase 3: The Nov 9 Queue Backlog & SVD LoRAs** | Nov 11 – Nov 17 | Massive submission gridlock: submissions from Nov 9 freeze in `PENDING` for 3–5 days (`#759162`, `#759630`). Deep dives into vLLM cold-start latencies and packaging bugs (`#758969`). Teams explore non-trained analytical LoRAs derived via SVD (`#759848`). Competitors warn about hidden scorer discrepancy vs local eval (`#759154`). |
| **Phase 4: Metric Bug Patch, Rescore & 1,800-Trial Study** | Nov 18 – Nov 20 | **Major Staff Announcement (`#760126`):** Host Ryan Holbrook confirms an evaluation metric bug was patched; affected submissions are rescored; Yurnero's 0.29 is revoked; ceiling resets to **0.24** (14 teams tied). Official tie-breaking reaffirmed: earlier submission date wins. Japan Open Data Lab releases landmark 1,800-trial Gemma 4 E4B benchmark (`#760014`). Getting Started notebook v3 nullable budget bug uncovered (`#760140`). |

---
## Daily Chronological Activity Log (2026-10-31 to 2026-11-20)

### Saturday, October 31, 2026 (2026-10-31)
**Activity:** 3 new thread(s) opened, 5 comment(s)/reply(ies).

#### New Threads Opened
- **[[754586]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/754586)** `16:42:10 UTC` — **luxluxshan** (EXPERT)  
  **Title:** *Which public tasks cannot pass in the scorer's sandbox? Four questions about the grading image*  
  > "I ran the public tasks with their own gold patches through the harness (Docker backend, `network_mode none`, `python:3.13-slim`). Once the test dependencies are in place most of them pass, but a fixed set never does, and the failures come in three ki..."  

- **[[754594]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/754594)** `17:18:14 UTC` — **yu11yu** (CONTRIBUTOR)  
  **Title:** *Clarification: Are model adaptation methods other than LoRA allowed?*  
  > "Could the organizers clarify whether submissions support any of the following?  - Full fine-tuned checkpoints of an allowed Gemma 4 model.  - Checkpoints with LoRA weights merged into the base model.  - Other PEFT methods, such as DoRA, IA³, or prefi..."  

- **[[754636]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/754636)** `23:17:43 UTC` — **murugesann** (EXPERT)  
  **Title:** *Request to Hosts: Fix Harness Continuation Nudge, Context Duplication & Compaction Bugs Breaking complex agent orchestrations*  
  > "Hi [@ryanholbrook](/ryanholbrook) and the competition team,  After extensive debugging comparing the official starter agent (`0.08`) against multiple 2-stage `SequentialAgent` pipelines (which consistently drop to `0.06–0.08` despite deterministic lo..."  

#### Significant Comments & Discussion Updates
- **Thread [748287] New Gemma 4 Models Available: 12B, E4B, and E2B** (1 comment(s)):
  - - **SANIDHAYA SHARMA** (CONTRIBUTOR) at `05:00:25 UTC`:
    > "My first submission (10 min and 60 tool calls per task in eval_config.yaml) ended with Notebook Timeout. Locally my agent averages about 6.3 min per task on the public tasks. Could you share how many tasks are in the hidden test set, and whether the scorer runs tasks one at a time or in parallel? Th..."

- **Thread [752848] Why does nobody have a score of over 0.24?** (1 comment(s)):
  - - **Nir Aberman** (CONTRIBUTOR) at `07:11:46 UTC`:
    > "Thanks, that clears it up: the unsolvable cases are a public-env artifact, not a hidden-set property.  Since you asked earlier about locating vs. editing time, here is what we measured on 163 runs: the gold file is opened by call 2-3 in ~84% of runs, but the first edit lands at ~106 s in solved runs..."

- **Thread [747519] Update on "Kaggle Error" Submissions & Queue Delays** (2 comment(s)):
  - - **Unknown** (CONTRIBUTOR) at `14:07:04 UTC`:
  - - **Unknown** (CONTRIBUTOR) at `15:04:45 UTC`:

- **Thread [754636] Request to Hosts: Fix Harness Continuation Nudge, Context Duplication & Compaction Bugs Breaking complex agent orchestrations** (1 comment(s)):
  - - **Murugesan Narayanaswamy** (EXPERT) at `23:39:13 UTC`:
    > "Also Note: Though agent_tools configuration can overcome context window / summary cmpaction problems  but still complex agent orchestrations are not possible, and sequential agents can as well be removed from agent harness, when they can't be used...."

---

### Sunday, November 01, 2026 (2026-11-01)
**Activity:** 2 new thread(s) opened, 6 comment(s)/reply(ies).

#### New Threads Opened
- **[[754783]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/754783)** `16:35:44 UTC` — **carlesoctav** (CONTRIBUTOR)  
  **Title:** *in EventsCompactionConfig: LlmEventSummarizer drops all tool calls and tool responses*  
  > "When context compaction triggers, LlmEventSummarizer._format_events_for_prompt() formats the event history for the summarization LLM by only checking:  ```    for part in content.parts:        if part.text:            text += part.text  ```  Because..."  

- **[[754811]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/754811)** `19:24:13 UTC` — **yashraj2308** (CONTRIBUTOR)  
  **Title:** *anybody crossed 0.2 threshold*  
  > "Anybody crossed >= 0.2 threshold just by prompting without finetuning or training any lora adapters on top of that..."  

#### Significant Comments & Discussion Updates
- **Thread [750521] Different public scores from an identical submission ZIP - reproducibility question** (1 comment(s)):
  - - **fan yunsheng** (CONTRIBUTOR) at `08:18:18 UTC`:
    > "Hi organizers and everyone, I resubmitted a byte-identical submission.zip to measure leaderboard noise, and the two runs differ far more than sampling noise would explain:  - Submitted 2026-10-27 16:45 UTC ("v0.3 budget-fit, first submission", ref 57707644): public score 0.18  - Submitted 2026-10-31..."

- **Thread [754636] Request to Hosts: Fix Harness Continuation Nudge, Context Duplication & Compaction Bugs Breaking complex agent orchestrations** (2 comment(s)):
  - - **MrMadsheep** (CONTRIBUTOR) at `09:50:24 UTC`:
    > "I just wanted to point out that even though above limitations are true (I've run into them few weeks ago too) from my perspective it would not be fair to fix them at this point in the competition, given the time and resources sunk into going around them. In practical sense above problems, plus the i..."
  - - **Murugesan Narayanaswamy** (EXPERT) at `12:17:31 UTC`:
    > "I appreciate your reply. Others who downvote a post should first make their view points clear by commenting -  I thought may be there exist simple solutions to sequential agent problem that allows its usage as a possible reason for the downvotes. As for single agent solutions, I wonder what that wou..."

- **Thread [750907] Looking for 1–2 teammates — TPU eval engine that matches the scorer + LoRA pipeline (0.17)** (1 comment(s)):
  - - **YosQuant** (CONTRIBUTOR) at `10:00:57 UTC`:
    > "Hi Mehmood — interested. Solo at 0.18 public (v2: ADK agent + one-shot patch_reviewer sub-agent). Ran an honest dev-eval on a fixed 30-task subset: v1–v6 prompt/thinking-budget changes all within noise (11–12/30); main failure = wrong patch + tool-call cap. Plan next: structural reproduce→patch→test..."

- **Thread [754023]  stuck in 'Notebook Running' ** (2 comment(s)):
  - - **dxnnnnn** (CONTRIBUTOR) at `17:22:51 UTC`:
    > "Hi hosts — same issue here, and I need the stuck pending job cleared so I can submit again.  - Kaggle username / team: dxnnnnn  - Competition: gemma-4-developer-agent  - Notebook g4da-submit-v1 Version 1 has been stuck in Notebook Running / Pending since 2026-11-01 01:48 UTC+8  - There is no cancel..."
  - - **Renat** (MASTER) at `20:22:53 UTC`:
    > "Same problem..."

---

### Monday, November 02, 2026 (2026-11-02)
**Activity:** 6 new thread(s) opened, 10 comment(s)/reply(ies).

#### New Threads Opened
- **[[754845]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/754845)** `01:13:13 UTC` — **akanksha2804** (CONTRIBUTOR)  
  **Title:** *Submission pending for 29+ hours*  
  > "Hi,  My submission from ref 57849011 has been Pending for about 29 hours, with no score or error. My config should finish in about 10–11 hours. Earlier submissions were scored within 12–14 hours.  Is the scoring queue delayed, or could something be w..."  

- **[[754890]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/754890)** `08:03:06 UTC` — **allankipruto** (CONTRIBUTOR)  
  **Title:** *The copied kaggle notebook is actively running and i haven't started a session*  
  > "The copied kaggle notebook is actively running and i haven't started a session. The issues may have rose from the original author, Ryan Holbrook on Getting Started - Gemma 4 Developer Agent on version 3..."  

- **[[754895]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/754895)** `08:31:49 UTC` — **allankipruto** (CONTRIBUTOR)  
  **Title:** *The copied kaggle notebook is actively running and i haven't started a session. How did you go about when  session hours are used by the system's Glitch and not the intended user*  
  > "The copied kaggle notebook is actively running and i haven't started a session. The issues may have rose from the original author, Ryan Holbrook on Getting Started - Gemma 4 Developer Agent on version 3. i had to delete my previous notebook cause it..."  

- **[[755066]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/755066)** `18:35:12 UTC` — **ssain18** (CONTRIBUTOR)  
  **Title:** *Stage 1 of wrapper engineering: settings, budgets and lessons*  
  > "Before changing prompts or adding sub-agents, I wanted to see how much the settings mattered. I used a basic wrapper and kept the competition model unchanged.  The four main studies covered 376 attempts across 40 public tasks. These are local evaluat..."  

- **[[755172]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/755172)** `22:58:59 UTC` — **emanuelemiranda** (CONTRIBUTOR)  
  **Title:** *Public code of my entry: gemma4-swe-agent (Apache 2.0)*  
  > "Sharing the public repository of my entry here, as General Rule 6.b asks for publicly shared competition code:  [https://github.com/emamira02/gemma4-swe-agent](https://github.com/emamira02/gemma4-swe-agent)  It contains the frozen agent bundles (cand..."  

- **[[755183]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/755183)** `23:33:04 UTC` — **murugesann** (EXPERT)  
  **Title:** *Why not cap submissions to once in two days*  
  > "The current long running submissions are severely restricting experiments. We dont know how much time really the submission notebook takes to run. At present, it is already only one submission per two days.   To solve the gpu resource constraint, why..."  

#### Significant Comments & Discussion Updates
- **Thread [754811] anybody crossed 0.2 threshold** (1 comment(s)):
  - - **DePie** (CONTRIBUTOR) at `04:40:58 UTC`:
    > "The best public notebook is what you want. But it's very unstable..."

- **Thread [754295] Will private leaderboard evaluation use multiple runs to reduce variance?** (3 comment(s)):
  - - **Yurnero** (GRANDMASTER) at `07:08:22 UTC`:
    > "Kaggle has never done that and highly likely never will.  I think making your solution stable is one of the intended challenges..."
  - - **Heisenberg** (CONTRIBUTOR) at `09:32:31 UTC`:
    > "How many tasks are in the final evaluation? 60 right. So the variance should be around the same as for the test set...."
  - - **Ankith Savio** (CONTRIBUTOR) at `09:38:11 UTC`:
    > "You dont have to share if its too revealing but do you get your score reliably or does it fluctuate a lot?..."

- **Thread [747519] Update on "Kaggle Error" Submissions & Queue Delays** (3 comment(s)):
  - - **Unknown** (CONTRIBUTOR) at `09:28:47 UTC`:
  - - **Unknown** (CONTRIBUTOR) at `14:42:25 UTC`:
  - - **Unknown** (CONTRIBUTOR) at `14:44:47 UTC`:

- **Thread [743683] Rerunning Failed Submissions** (2 comment(s)):
  - - **Unknown** (CONTRIBUTOR) at `13:17:28 UTC`:
  - - **dmitry batov** (CONTRIBUTOR) at `16:06:56 UTC`:
    > "Hi Kaggle team,  My Gemma 4 Developer Agent submission has been stuck in "Notebook Running" for over 18 hours. Notebook: Gemma4 SWE Agent T8 Static - v1 Script Version ID: 364682696 The original notebook completed successfully in 21 seconds and generated the required submission.zip. Could you please..."

- **Thread [754845] Submission pending for 29+ hours** (1 comment(s)):
  - - **Akanksha Pathak** (CONTRIBUTOR) at `18:20:03 UTC`:
    > "It got submitted in the end. But, do we have an expected time in which these submissions are supposed to get graded?..."

---

### Tuesday, November 03, 2026 (2026-11-03)
**Activity:** 7 new thread(s) opened, 11 comment(s)/reply(ies).

#### New Threads Opened
- **[[755289]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/755289)** `05:49:33 UTC` — **alexaaaaaaaaaander** (CONTRIBUTOR)  
  **Title:** *Fine tuning with Lora is the only way??!*  
  > "Hi guys, I'm new to kaggle and this is my first compitition.  I only have evaluation and harness exp, so I mainly tried optimize prompt and orchestration.  After about 15 attempts, I wondering whether context managing and prompting is effective in th..."  

- **[[755291]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/755291)** `06:01:19 UTC` — **xingling666** (CONTRIBUTOR)  
  **Title:** *Where 76% of a 300-second agent budget actually goes (4 trace audits)*  
  > "Audited four Gemma-4-12B runs on fastapi. Wall-clock is 76% pure decode at 17.25 tok/s — least-squares fit dt = 0.78 + 0.058·ct, r² = 0.9996 over 39 normal steps.   8 of 43 steps hold 56% of the budget, in two shapes: 4 restatements of a file just re..."  

- **[[755318]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/755318)** `08:01:12 UTC` — **thefusioncube** (CONTRIBUTOR)  
  **Title:** *Why has my notebook been submitting for more than a day. *  
  > "I can literally submit a completely new entry and my old one still won't be finished...."  

- **[[755391]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/755391)** `13:52:03 UTC` — **banwait13** (CONTRIBUTOR)  
  **Title:** *Important dataset inquiry for better model alignment*  
  > "Well, this is the issue. I was experiencing the following condition. Every one of the 129 issues in the public dataset is located in three to four Python libraries, including FastAPI, Rich, HTTPS, and requests. Is there a solution to the issue of pri..."  

- **[[755527]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/755527)** `21:14:58 UTC` — **xiaoz259** (MASTER)  
  **Title:** *The queue time should improve once the ARC-2 backlogs are cleared*  
  > "Just in case you are wondering why the submissions are taking 30+ hours...."  

- **[[755542]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/755542)** `21:46:28 UTC` — **medohamza95** (CONTRIBUTOR)  
  **Title:** *Sending public tasks to a hosted model provider: how should the Competition Data rule be read?*  
  > "Hello [@ryanholbrook](/ryanholbrook) and the Kaggle team,  I would like a clear reading of the rules on one point, because several things seem to point in different directions.  - Section 4 says participants agree "not to transmit, duplicate, publish..."  

- **[[755554]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/755554)** `22:28:16 UTC` — **aridiosilva2** (CONTRIBUTOR)  
  **Title:** *[fastapi_14186] Task unresolvable: required test skipped due to @needs_pydanticv1 and Pydantic v2 setup*  
  > "I can independently confirm this for fastapi_14186, with some additional detail.  Setup: the public tasks.jsonl, the task snapshot, the official sandbox/setup.py with the dataset wheels, and the swegemma verifier. The task's own reference patch was a..."  

#### Significant Comments & Discussion Updates
- **Thread [743683] Rerunning Failed Submissions** (1 comment(s)):
  - - **albmartin** (CONTRIBUTOR) at `00:02:29 UTC`:
    > "Hello,  My submission to the Gemma 4 Developer Agent Competition ended with Notebook timeout.  The submission archive was generated and locally verified successfully:  submission.zip exists and contains exactly four files.  agent.yaml is located at the archive root.  All files passed CRC, byte-by-by..."

- **Thread [749191] Question about LoRA** (1 comment(s)):
  - - **Jane** (CONTRIBUTOR) at `01:18:01 UTC`:
    > "Hi [@ryanholbrook](/ryanholbrook) ,  Could you help verify whether the LoRA adapter was actually active during scoring for submission 57873732?  Submission details:  - Competition: Gemma 4 Developer Agent  - Submitted: November 1, 2026, 13:54 UTC  - Status: Complete; public score: 0.08  - Base model..."

- **Thread [744566] thinking_budget and seed are missing from HTTP requests in my wheelhouse test** (2 comment(s)):
  - - **Unknown** (CONTRIBUTOR) at `06:27:20 UTC`:
  - - **Veronika Yaitskikh** (CONTRIBUTOR) at `07:09:54 UTC`:
    > "I re-tested this with wheelhouse v28 after the organizer’s update. In that environment, both parameters reached the final vLLM HTTP request: `thinking_budget` was mapped to `thinking_token_budget`, and `seed` was present. I also verified on the GPU path that different thinking budgets were applied...."

- **Thread [755318] Why has my notebook been submitting for more than a day. ** (2 comment(s)):
  - - **Prathamesh7x** (CONTRIBUTOR) at `10:56:11 UTC`:
    > "Hey even I'm going through a similar problem. It's been like 25 hours since submission and it's still going on...."
  - - **Nir Aberman** (CONTRIBUTOR) at `12:48:58 UTC`:
    > "every submission of mine for the past 2 weeks have been for 18-28h until a score..."

- **Thread [755291] Where 76% of a 300-second agent budget actually goes (4 trace audits)** (1 comment(s)):
  - - **XingLing** (CONTRIBUTOR) at `14:04:50 UTC`:
    > "I compared the declared configs of three public submissions (0.20 / 0.18 / 0.05). Only the model size separates them — 8192 / 4096 / 8 min / 240 s is identical across all three, including the one at 0.05. There are also three settings that silently do nothing, with a checker you can run on your own..."

- **Thread [747708] Submission stuck in "Running" for 30+ hours, blocking new submissions (pending limit)** (2 comment(s)):
  - - **stm-canco** (CONTRIBUTOR) at `16:29:43 UTC`:
    > "Hi [@ryanholbrook](/ryanholbrook)  Thank you again for hosting, and for all your help.  I do have the same issue of a stuck submission as well for over the past about 30 hours.  I wonder if you or anyone in ur team could help check it. Thank you again!..."
  - - **Harisdak Singh Banwait** (CONTRIBUTOR) at `18:03:53 UTC`:
    > "Indeed I am also getting the same issue..."

- **Thread [747519] Update on "Kaggle Error" Submissions & Queue Delays** (1 comment(s)):
  - - **James Lo** (CONTRIBUTOR) at `16:47:08 UTC`:
    > "Hello, the Notebook Timeout issue persists, and I haven't been able to make a successful attempt in the past few weeks (the last one was 2 days ago). Is there any extension or an estimated repair completion time? Thank you...."

- **Thread [742807] Clarification on distillation from external LLMs** (1 comment(s)):
  - - **Max Ma** (CONTRIBUTOR) at `19:12:11 UTC`:
    > "may we send the public dev tasks (issue text, snapshot code) to a third-party LLM API like DeepSeek to generate training trajectories, or should Competition Data only go through self-hosted models?..."

---

### Wednesday, November 04, 2026 (2026-11-04)
**Activity:** 2 new thread(s) opened, 11 comment(s)/reply(ies).

#### New Threads Opened
- **[[755611]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/755611)** `03:54:25 UTC` — **xiaoz259** (MASTER)  
  **Title:** *Are the reported LoRA issues fixed? I don't see any updates.*  
  > "I am reading through the forum and the reported issues including slower decoding speed and shorter context length. The current eval setup is also severely under-ultilizing the 4xL4 GPU...."  

- **[[755677]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/755677)** `08:14:01 UTC` — **lucamassaron** (GRANDMASTER)  
  **Title:** *Scoring zero when using LoRA adapters*  
  > "Scoring zero when using LoRA adapters Hi everyone,  I am investigating an issue where submissions that include a LoRA adapter consistently score 0.00 on the public leaderboard, while submitting the exact same code, prompt, tools, and configs without..."  

#### Significant Comments & Discussion Updates
- **Thread [755527] The queue time should improve once the ARC-2 backlogs are cleared** (2 comment(s)):
  - - **hsiaosuan** (EXPERT) at `02:56:12 UTC`:
    > "I just started an e4b submission. will update on the queuee situation once it finishes..."
  - - **xz** (MASTER) at `20:05:06 UTC`:
    > "I might be wrong :(..."

- **Thread [742807] Clarification on distillation from external LLMs** (1 comment(s)):
  - - **TheFusionCube** (CONTRIBUTOR) at `06:32:52 UTC`:
    > "You should be free to do whatever you like with the public data...."

- **Thread [755542] Sending public tasks to a hosted model provider: how should the Competition Data rule be read?** (1 comment(s)):
  - - **medoHamza95** (CONTRIBUTOR) at `09:20:34 UTC`:
    > "Two related questions on Rule 4.b, since "Competition Data" includes "any prototype or executable code provided on the Competition Website":  - May participants install the official wheelhouse on a private Google Colab runtime, or store it in their own Google Drive?  - May an AI coding assistant hos..."

- **Thread [755677] Scoring zero when using LoRA adapters** (7 comment(s)):
  - - **Yurnero** (GRANDMASTER) at `10:30:06 UTC`:
    > "I think something is wrong with either your setup or with your submission stucture. It is possible to score > 0 with a LoRA adapter..."
  - - **Heisenberg** (CONTRIBUTOR) at `10:50:13 UTC`:
    > "I think you also get 0 if your submission timed out...."
  - - **Ankith Savio** (CONTRIBUTOR) at `11:41:27 UTC`:
    > "I got a non zero score with rank 32 lora for the same model with 4 minute task timeout..."
  - - **xz** (MASTER) at `12:51:47 UTC`:
    > "I came to test some training recipe ideas but there seems to be a lot of hoops to jump through. I’m reading that using LoRA reduces decoding speed and context limit. Are these claims true? I can’t even test these claims easily with submissions being 30+ hours...."
  - - **Harisdak Singh Banwait** (CONTRIBUTOR) at `18:41:36 UTC`:
    > "I believe something is wrong with submission structure..."
  - - **kingofeverything** (CONTRIBUTOR) at `23:26:33 UTC`:
    > "why your tensor takes 509mb？..."
  - - **Kapil Chopra** (CONTRIBUTOR) at `23:57:17 UTC`:
    > "Data point from our team, same base model (gemma-4-31b-it-qat-w4a16-ct), and an adapter shaped like yours: rank 16, alpha 32, all 7 projections on all 60 language layers, served as main_lora. ┌────────────┬───────────────────────────────────┬───────────────────────────┬──────────────────────────────..."

---

### Thursday, November 05, 2026 (2026-11-05)
**Activity:** 3 new thread(s) opened, 4 comment(s)/reply(ies).

#### New Threads Opened
- **[[756044]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/756044)** `07:01:54 UTC` — **dxnnnnn** (CONTRIBUTOR)  
  **Title:** *Stuck pending / Notebook Timeout on g4da-submit-v2 — no Public Score, cannot resubmit*  
  > "Hi everyone,  Has anyone else hit a long-stuck competition submission that never gets a Public Score?  For team dxnnnnn on gemma-4-developer-agent:  - Multiple g4da-submit-v2 Version 2 attempts end as Notebook Timeout (including a recent ~18h run) wi..."  

- **[[756051]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/756051)** `07:46:05 UTC` — **joeqrq** (CONTRIBUTOR)  
  **Title:** *Tool-call serialization issue: edit_file repeatedly emitted without old_string*  
  > "Summary While running a Gemma 4 agent on the official Kaggle evaluation harness (`swegemma 0.2.11`), we observed a repeated tool-call serialization failure on `edit_file`:  - In one run, 51 consecutive `edit_file` calls were emitted without the manda..."  

- **[[756315]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/756315)** `23:34:24 UTC` — **krisshah123** (CONTRIBUTOR)  
  **Title:** *Community resource: pytest-verified context-selection harness + gemma4-locbench-v1 (probe set)*  
  > "While preparing our paper-track writeup we built a reusable harness for comparing context-selection strategies on the public training tasks under identical character budgets, with the competition's own pytest verification (patches applied with git ap..."  

#### Significant Comments & Discussion Updates
- **Thread [753973] [BUG REPORT] tool parser can loop forever on an array tool argument, freezing the inference server for the rest of the run** (2 comment(s)):
  - - **MarchFederico** (CONTRIBUTOR) at `08:21:01 UTC`:
    > "[@ryanholbrook](/ryanholbrook) Adding evidence from real runs to this report, and a request for a decision.  Same parser: our local `gemma4_tool_parser.py` from vLLM 0.19.1 has the SHA-256 posted in 745138 (`682b2152…`).  Real runs: we had two server freezes during local evaluation with the competit..."
  - - **cc** (EXPERT) at `11:19:57 UTC`:
    > "I've encountered this issue twice...."

- **Thread [748999] Looking for a team or team mates** (2 comment(s)):
  - - **Soumyadip_007** (CONTRIBUTOR) at `21:46:48 UTC`:
    > "Hello , I am willing to join , I sent you a message...."
  - - **Arturo Gutiérrez Aguilar** (CONTRIBUTOR) at `23:04:40 UTC`:
    > "Hi, I just sent you a message...."

---

### Friday, November 06, 2026 (2026-11-06)
**Activity:** 8 new thread(s) opened, 8 comment(s)/reply(ies).

#### New Threads Opened
- **[[756336]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/756336)** `00:40:01 UTC` — **murecerickman** (CONTRIBUTOR)  
  **Title:** *swegemma, which is built on Google’s ADK*  
  > "harness summarize the conversation mid-task. It kicks in at 14,336 tokens, keeps only the last 5 events, and replaces the rest with its own generic summary. Every context reset in our cycle 2 logs came from this, never from our design. Some of its nu..."  

- **[[756400]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/756400)** `05:49:10 UTC` — **manoharpapasani** (CONTRIBUTOR)  
  **Title:** *Audit: 61 of 129 public tasks can't tell agents apart (+ open configs and data)*  
  > "Before measuring agents, I measured the public benchmark. Here are the results, with all code and data open, in line with the competition's public-sharing rule.  Repo: [https://github.com/TechNaom/gemma4-agentic-swe](https://github.com/TechNaom/gemma..."  

- **[[756433]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/756433)** `08:38:44 UTC` — **kamenriderfakchion** (CONTRIBUTOR)  
  **Title:** *Public code: configs, trajectories and analysis scripts for a Gemma 4 E2B agent failure study*  
  > "Sharing publicly, per the competition's code-sharing rule, the code behind our Paper Track writeup Finds the File, Cannot Change It: Why a 2B Coding Agent Fails.  Repo (Apache-2.0): [https://github.com/sigongjoa/gemma4-e2b-edit-failure](https://githu..."  

- **[[756438]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/756438)** `09:14:24 UTC` — **prathmeshadsod** (EXPERT)  
  **Title:** *How you guys considering time allocations*  
  > "how you guys are doing time allocations for tasks which needs allocations. Like its better to solve 60 tasks completely and 60 not to attempt instead of 120 tasks partially. How you guys are managing this because in current harness it doesnt seems su..."  

- **[[756461]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/756461)** `11:59:07 UTC` — **eutychusmugambi** (CONTRIBUTOR)  
  **Title:** *Gold patches fail*  
  > "In the Getting Started notebook’s sandbox, gold patches fail on about 43% of the public tasks, mostly because test dependencies are missing (inline_snapshot for fastapi; fixtures for requests, with ~190 collection/setup errors per run). Does the Kagg..."  

- **[[756587]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/756587)** `19:47:57 UTC` — **jasonwold** (CONTRIBUTOR)  
  **Title:** *Local evals: 27 public fastapi tasks can never pass in the sandbox*  
  > "If you are tuning your agent on the 129 public tasks, note that 27 fastapi tasks fail at test collection whatever patch you write: their tests import `inline_snapshot` or `dirty_equals`, which the sandbox does not have. The host confirmed scoring use..."  

- **[[756607]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/756607)** `21:12:24 UTC` — **hank0123** (CONTRIBUTOR)  
  **Title:** *Team up: root cause of the edit_file old_string loss (+1-line fix) and a 286-task eval set — our GPU died, looking to merge before 11/25*  
  > "Our GPU box died mid-competition, so we can't validate further changes, but we have too much done to stop here. Looking to merge (1–2 people) before the 11/25 deadline.  What we bring  - The root cause of the edit_file failures the Paper Track report..."  

- **[[756622]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/756622)** `22:20:40 UTC` — **soumyadip007** (CONTRIBUTOR)  
  **Title:** *How to get started with the solution development of this hackathon problem*  
  > "So far I have gone through the basic theory and problem statement of the hackathon and the notebooks present in the Code section of this hackathon . I unable to figure out what to do with the codes and data that has been provided to us in the competi..."  

#### Significant Comments & Discussion Updates
- **Thread [750907] Looking for 1–2 teammates — TPU eval engine that matches the scorer + LoRA pipeline (0.17)** (3 comment(s)):
  - - **Mehmood Zafar** (CONTRIBUTOR) at `03:23:40 UTC`:
    > "Hi YosQuant, sorry for the slow reply. Your reproduce→patch→test→fix loop is the part we haven’t tried, and our TPU eval engine can test it without using GPU quota.  I’m busy with the paper until Nov 12. After that, trial idea (public info only, no code until we merge): we each test one idea on a fi..."
  - - **YosQuant** (CONTRIBUTOR) at `06:34:26 UTC`:
    > "Hi Mehmood, no worries, and good luck with the paper!  Your plan works for us. After Nov 12, each side tests one idea on the same fixed task set and we share numbers only, no code until we merge. For the task set, we're publishing a 30-task subset (IDs + checksums) around Nov 11, so we could both us..."
  - - **Mehmood Zafar** (CONTRIBUTOR) at `17:08:29 UTC`:
    > "Thanks YosQuant, sounds good. I checked the rules: team limit is 5, so your 2-3 plus me and the other person fits. One more check: a merged team can have at most 1 submission per day since Sep 23 in total. I have 17, how many does your side have?  Happy to use your 30-task set. But in our repeat run..."

- **Thread [743683] Rerunning Failed Submissions** (2 comment(s)):
  - - **Mr. Mrinmoy Choudhury** (CONTRIBUTOR) at `11:34:48 UTC`:
    > "Hi [@ryanholbrook](/ryanholbrook)   My submission to the Gemma 4 Developer Agent Competition has been stuck at "Notebook Running" for over an hour.  Submission: Gemma 4 Developer Agent – Custom Submission – Version 13.  The notebook execution completed successfully in 53.3 seconds. The submission ZI..."
  - - **Unknown** (CONTRIBUTOR) at `12:09:16 UTC`:

- **Thread [751104] 🌟Bonus Prize: Small Model Development ($10,000)** (1 comment(s)):
  - - **amunozo** (CONTRIBUTOR) at `15:15:57 UTC`:
    > "Thanks! Could you update the leaderboard's notebook daily?..."

- **Thread [756438] How you guys considering time allocations** (1 comment(s)):
  - - **Adam Johnson** (CONTRIBUTOR) at `18:33:50 UTC`:
    > "58 tasks public/private so the 129. There is a bit of a high noise wall .20 also scored .18 .17 .17 .17 .13..."

- **Thread [756461] Gold patches fail** (1 comment(s)):
  - - **Adam Johnson** (CONTRIBUTOR) at `18:34:51 UTC`:
    > "They fail public not Private I believe was stated by the hosts...."

---

### Saturday, November 07, 2026 (2026-11-07)
**Activity:** 2 new thread(s) opened, 5 comment(s)/reply(ies).

#### New Threads Opened
- **[[756693]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/756693)** `06:53:07 UTC` — **tianchan11** (CONTRIBUTOR)  
  **Title:** *Team merger: which score does the merged Team carry?*  
  > "Quick rules question before the Team Merger Deadline (2026-11-25).  Section 5 of the competition rules says team mergers are allowed and that the combined Team must have a total submission count within the allowed maximum. But it does not say what th..."  

- **[[756792]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/756792)** `16:17:29 UTC` — **refresh2k** (CONTRIBUTOR)  
  **Title:** *Are hand-constructed LoRA adapters acceptable (weight edit from activation analysis, not gradient descent)?*  
  > "Are hand-constructed LoRA adapters acceptable — e.g., an adapter that expresses a targeted weight edit derived from activation analysis, rather than one produced by gradient-descent fine-tuning? The adapter would be a standard PEFT LoRA adapter in th..."  

#### Significant Comments & Discussion Updates
- **Thread [750907] Looking for 1–2 teammates — TPU eval engine that matches the scorer + LoRA pipeline (0.17)** (1 comment(s)):
  - - **YosQuant** (CONTRIBUTOR) at `00:01:09 UTC`:
    > "Thanks Mehmood. Our side has 3 submissions since Sep 23, so 17 + 3 = 20 total. That fits under the merged cap.  Agreed on noise. Our own paper found the same ~10–13% flip rate on repeated runs, which is exactly why we report replication. Let's do both: run each config twice on our 30-task set, and u..."

- **Thread [751104] 🌟Bonus Prize: Small Model Development ($10,000)** (1 comment(s)):
  - - **Mikhail** (CONTRIBUTOR) at `00:18:21 UTC`:
    > "Fascinating study and very clean empirical methodology, especially using exact McNemar tests on paired instances! 👏  Regarding your core question about retrieval gains disappearing once the relevant file fits in context:  We observed very similar dynamics while benchmarking local Gemma 4 on real-wor..."

- **Thread [754783] in EventsCompactionConfig: LlmEventSummarizer drops all tool calls and tool responses** (1 comment(s)):
  - - **Jack Yu** (CONTRIBUTOR) at `02:27:25 UTC`:
    > "This is a real concern since most of the context up to the time of compaction are tool calls. Good news is that usually a tool call has its reasoning content, which will be read by compaction, so most tool call is not totally forgotten. What might be forgotten is the tool call result. If the agent d..."

- **Thread [756622] How to get started with the solution development of this hackathon problem** (1 comment(s)):
  - - **Murugesan Narayanaswamy** (EXPERT) at `02:34:48 UTC`:
    > "This is the simplest kaggle competition ever if you go by what is required for submission: you just need to submit at the minimum 4 files consisting of agent yaml, prompt md and configuration yamls!! If your solution involves LoRA training, you need to submit your trained LoRA adapter.  Take the bes..."

- **Thread [755677] Scoring zero when using LoRA adapters** (1 comment(s)):
  - - **Abiram Bharathi S.A** (CONTRIBUTOR) at `08:34:56 UTC`:
    > "can you expain what haeppn and what you did..."

---

### Sunday, November 08, 2026 (2026-11-08)
**Activity:** 1 new thread(s) opened, 7 comment(s)/reply(ies).

#### New Threads Opened
- **[[756963]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/756963)** `09:49:40 UTC` — **moritzpaal** (CONTRIBUTOR)  
  **Title:** *Question regarding timelimits *  
  > "How much time do we have in total and how many tasks are there in total? What happens if the time runs out? Is the attempt just cut or do we get a score of 0? [@ryanholbrook](/ryanholbrook)..."  

#### Significant Comments & Discussion Updates
- **Thread [756607] Team up: root cause of the edit_file old_string loss (+1-line fix) and a 286-task eval set — our GPU died, looking to merge before 11/25** (2 comment(s)):
  - - **Adam Johnson** (CONTRIBUTOR) at `04:11:13 UTC`:
    > "Colab is fairly cheap 9.99 a month. What GPU were you using?..."
  - - **Kai** (CONTRIBUTOR) at `16:02:30 UTC`:
    > "Sorry for the late reply, and thanks for the advice! We were using an RTX A6000 (48 GB). Given the time remaining, we've stopped our local evaluations and are now looking for a team to merge with...."

- **Thread [748999] Looking for a team or team mates** (2 comment(s)):
  - - **Moez Ur Rehman** (CONTRIBUTOR) at `10:41:47 UTC`:
    > "i'll go through it and let you know soon...."
  - - **Moez Ur Rehman** (CONTRIBUTOR) at `10:42:11 UTC`:
    > "i'll go through your message and let you know soon...."

- **Thread [753973] [BUG REPORT] tool parser can loop forever on an array tool argument, freezing the inference server for the rest of the run** (1 comment(s)):
  - - **Mikhil Shetty** (CONTRIBUTOR) at `13:35:51 UTC`:
    > "any update on this ? this is impacting our work..."

- **Thread [756792] Are hand-constructed LoRA adapters acceptable (weight edit from activation analysis, not gradient descent)?** (1 comment(s)):
  - - **Jean-Claude Paquin** (CONTRIBUTOR) at `14:20:21 UTC`:
    > "As long as it loads, why would it matter? Would likely be a strong contender for the paper track..."

- **Thread [744272] Tool results reach the model double-JSON-encoded: a line of code with quotes turns into a wall of backslashes** (1 comment(s)):
  - - **Mikhil Shetty** (CONTRIBUTOR) at `15:08:48 UTC`:
    > "Thanks for the fix. I can confirm it's in the wheelhouse we run locally (swegemma 0.2.11, adk-submission 0.2.13). When the model escapes both strings, edit_file now repairs both:  apply_replacement('x = foo("a")\n', 'foo(\"a\")', 'foo(\"b\")')   -> strategy 'unescaped', new_content 'x = foo("b")\n'..."

---

### Monday, November 09, 2026 (2026-11-09)
**Activity:** 4 new thread(s) opened, 7 comment(s)/reply(ies).

#### New Threads Opened
- **[[757149]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/757149)** `04:12:47 UTC` — **songtaoshi** (CONTRIBUTOR)  
  **Title:** *Will agents get the contents of issue links and screenshots during offline evaluation?*  
  > "Some public development tasks link to information that is missing from the task text:  - `rich_3064` has a short title and links to [Rich issue #3053](https://github.com/Textualize/rich/issues/3053). The linked issue contains the reproducer and trace..."  

- **[[757223]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/757223)** `08:42:20 UTC` — **brejeshbalakrishnan** (CONTRIBUTOR)  
  **Title:** *Are LLM chat tools allowed for annotating our own agent trajectories?*  
  > "Rule 2.4.b says we must not "transmit, duplicate, publish, redistribute or otherwise provide or make available the Competition Data to any party not participating in the Competition".  We want to hand-check how our agent fails on the public training..."  

- **[[757244]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/757244)** `10:09:34 UTC` — **gagandeep1** (CONTRIBUTOR)  
  **Title:** *Clarification: Small Model Prize deadline*  
  > "The Small Model Development section says, “Same submission deadlines apply as the main track prizes,” implying December 2. However, the paragraph immediately below says submissions must be made by November 12. Could Kaggle staff please confirm the de..."  

- **[[757322]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/757322)** `15:08:42 UTC` — **allankipruto** (CONTRIBUTOR)  
  **Title:** *Kernel Stopped working while running Evaluation then failure to submit to competition then failed to authorize session*  
  > "Kernel Stopped working while running Evaluation and a kernel pop up appeared on the notebook.  then when i try to submit to competition it fails, then cancelling runs for several hours, i'm still seeing failed to authorize session..."  

#### Significant Comments & Discussion Updates
- **Thread [753973] [BUG REPORT] tool parser can loop forever on an array tool argument, freezing the inference server for the rest of the run** (1 comment(s)):
  - - **shtirmann** (CONTRIBUTOR) at `01:17:28 UTC`:
    > "facing same issues..."

- **Thread [757149] Will agents get the contents of issue links and screenshots during offline evaluation?** (2 comment(s)):
  - - **Navneet** (CONTRIBUTOR) at `07:06:21 UTC`:
    > "Thank you for the offline evaluation info [@songtaoshi](/songtaoshi)..."
  - - **song tao shi** (CONTRIBUTOR) at `12:54:08 UTC`:
    > "Hi [@ryanholbrook](/ryanholbrook), could you clarify what the agent receives when a hidden evaluation task references an issue URL? Is the URL passed through as plain text, or is the linked issue body made available offline? Thanks!..."

- **Thread [757244] Clarification: Small Model Prize deadline** (2 comment(s)):
  - - **Smart Manoj** (EXPERT) at `10:27:02 UTC`:
    > "December 2. That section should be inserted above the Paper section...."
  - - **Altcont Altul** (CONTRIBUTOR) at `17:19:17 UTC`:
    > "Could the competition organizers please confirm whether November 12, 2026 at 23:59 UTC applies only to the Paper Track, with December 2, 2026 at 23:59 UTC remaining the final deadline for scored agent submissions, including the E2B/E4B Small Model Prize? The Timeline and bonus-prize announcement ind..."

- **Thread [756792] Are hand-constructed LoRA adapters acceptable (weight edit from activation analysis, not gradient descent)?** (1 comment(s)):
  - - **amn** (CONTRIBUTOR) at `14:45:40 UTC`:
    > "weight-space programming?..."

- **Thread [747519] Update on "Kaggle Error" Submissions & Queue Delays** (1 comment(s)):
  - - **Unknown** (CONTRIBUTOR) at `19:03:47 UTC`:

---

### Tuesday, November 10, 2026 (2026-11-10)
**Activity:** 6 new thread(s) opened, 11 comment(s)/reply(ies).

#### New Threads Opened
- **[[757564]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/757564)** `01:38:19 UTC` — **clanevil** (CONTRIBUTOR)  
  **Title:** *Is in-sandbox testing (enable_sandbox_testing) on during scoring?*  
  > "Hi [@ryanholbrook](/ryanholbrook),  The harness README says that by default `enable_sandbox_testing = True`, so pytest and unittest are available inside Container A and instruction 3 reads "Verify your implementation using targeted tests or inline as..."  

- **[[757588]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/757588)** `04:14:30 UTC` — **harshitsama** (EXPERT)  
  **Title:** *I reran a public 0.24 bundle unchanged and got 0.17 (data and short paper)*  
  > "Sharing a small measurement, in case it helps with planning your daily submission.  What we did. We re-submitted public bundles unchanged, with credit. honghanhhh's Budget-Fit v6 prompt-only (public claim 0.24) scored 0.17 for us. emmanuelmirekumensa..."  

- **[[757626]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/757626)** `06:23:04 UTC` — **xiaoz259** (MASTER)  
  **Title:** *Probing the public/private split to reallocate time*  
  > "The overview says the roughly 120 test tasks split evenly between public and private. The run has a 12-hour total, about 6 minutes per task.  A submission can change its behaviour on chosen tasks and watch the public score. Over enough submissions, t..."  

- **[[757661]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/757661)** `09:53:23 UTC` — **larry54321zhao** (EXPERT)  
  **Title:** *Question about the scoring environment for the reference patches*  
  > "We audited the published tasks by running each task's own reference patch through the organiser's verifier in the reference notebook sandbox. Two test-only dependencies are absent from the mounted wheelhouse: inline_snapshot and dirty_equals (their c..."  

- **[[757782]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/757782)** `19:00:39 UTC` — **acamachodepass** (CONTRIBUTOR)  
  **Title:** *Exact wheelhouse and L4×4 runtime metadata for the Gemma 4 Developer Agent competition*  
  > "Hello Kaggle Support,  I’m preparing a private, internet-off L4×4 timing probe for the Gemma 4 Developer Agent competition. Before launching anything, could you provide the following two records or exact read-only links to them?  1. Competition wheel..."  

- **[[757783]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/757783)** `19:03:54 UTC` — **acamachodepass** (CONTRIBUTOR)  
  **Title:** *Rules clarification — Using competition training examples on DeepInfra and RunPod (§4.b)*  
  > "Hi Kaggle Staff,  Could the competition host clarify how §4.b applies to development and evaluation outside Kaggle using examples from the released training set?  1. Hosted inference (DeepInfra). May we send task statements, repository excerpts, tool..."  

#### Significant Comments & Discussion Updates
- **Thread [756792] Are hand-constructed LoRA adapters acceptable (weight edit from activation analysis, not gradient descent)?** (1 comment(s)):
  - - **John K** (CONTRIBUTOR) at `03:01:21 UTC`:
    > "I would not burn a scored run on it until a host says yes in the thread. If the file is a normal PEFT LoRA in the sanctioned format and it loads in the allowed runtime, it is probably fine on engineering grounds, but a hand-edited adapter from activations is exactly the kind of edge case that is che..."

- **Thread [757626] Probing the public/private split to reallocate time** (6 comment(s)):
  - - **Yurnero** (GRANDMASTER) at `06:38:04 UTC`:
    > "Well right now   1 team solved  17 public tasks correctly  11 teams solved 14 public tasks correctly  74 teams solved 13 public tasks correctly  So at worst one could have an advantage for 17*6 minutes and on average <12*6 minutes !in theory!.  Practicaly, we also have some kind of a variance in tha..."
  - - **Yurnero** (GRANDMASTER) at `06:51:20 UTC`:
    > "I think the real problem right now is to fix a variance somehow — shakeup in that competition will be huge..."
  - - **Ankith Savio** (CONTRIBUTOR) at `11:10:03 UTC`:
    > "shakeup is unavoidable in LLM comps except for the top few..."
  - - **xz** (MASTER) at `15:24:32 UTC`:
    > "By jumps I meant the number of participants...."
  - - **Yurnero** (GRANDMASTER) at `16:25:34 UTC`:
    > "its fine. nowdays competition always have that many participants (due to heavy agents usage I suppose)  name that llm already have more participants comparing to this competition and it was launched a month later..."
  - - **xz** (MASTER) at `16:28:15 UTC`:
    > "Regarding variance, it is quite possible for bots to be in the prize pool. I have not look into the evaluation in detail but if I understand correctly the context limit is 30k+ and the automatic summarization/compaction is at 14k. This is not even ultilizing the model's native capability properly...."

- **Thread [755677] Scoring zero when using LoRA adapters** (2 comment(s)):
  - - **Jak Ma** (MASTER) at `09:27:05 UTC`:
    > "Could you share your score of lora-solution?..."
  - - **Ankith Savio** (CONTRIBUTOR) at `11:45:22 UTC`:
    > "For the configuration mentioned above it was 0.06..."

- **Thread [757661] Question about the scoring environment for the reference patches** (1 comment(s)):
  - - **larry54321zhao** (EXPERT) at `10:10:26 UTC`:
    > "Related: HARNESS_README describes a two-container lifecycle with a 4 GiB / 2 vCPU verification container. Could you confirm whether that container image includes inline_snapshot, dirty_equals and a working httpbin fixture?..."

- **Thread [757588] I reran a public 0.24 bundle unchanged and got 0.17 (data and short paper)** (1 comment(s)):
  - - **Allan Kipruto** (CONTRIBUTOR) at `11:42:33 UTC`:
    > "Same Issue. i re-runned resolved=True tasks, and some were appearing resolved=False..."

---

### Wednesday, November 11, 2026 (2026-11-11)
**Activity:** 3 new thread(s) opened, 12 comment(s)/reply(ies).

#### New Threads Opened
- **[[757893]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/757893)** `05:07:02 UTC` — **moshegolderson** (CONTRIBUTOR)  
  **Title:** *To the organizers: 5 concrete scorer fixes, plus an audited task list*  
  > "While building FreshSWE-Py (663 post-release tasks in this competition's format), we ran 1,143 real fixes from 36 Python libraries through swegemma 0.2.11's verification rules. 277 of them (24%) fail with their own correct patch only because of one o..."  

- **[[757993]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/757993)** `10:59:53 UTC` — **kush1235** (CONTRIBUTOR)  
  **Title:** *Kaggle notebook runtime issue*  
  > "My submission.zip from approximately November 9 still shows “Notebook Running” after two days, with no score or error. My previous two submissions succeeded. Could you check whether this submission is progressing or needs a rerun?..."  

- **[[758218]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/758218)** `22:56:20 UTC` — **murugesann** (EXPERT)  
  **Title:** *How many of the 129 tasks are solved by the agentless 0.22 scorer?*  
  > "Thanks to [@zbigniewkirchner](/zbigniewkirchner) for sharing the evaluation setup and local harness.  To save the weekly 4× L4 GPU quota, I ran the full 129 local task benchmark using the unquantized Gemma model served via OpenRouter rather than the..."  

#### Significant Comments & Discussion Updates
- **Thread [743683] Rerunning Failed Submissions** (1 comment(s)):
  - - **Tong_Shan** (CONTRIBUTOR) at `02:53:12 UTC`:
    > "Hi [@ryanholbrook](/ryanholbrook) ,  My Gemma 4 Developer Agent submission #58168380 has been stuck in PENDING / Notebook Running for over 36 hours, with no score or error.  Could you please check whether the submission is stuck and, if so, clear the pending state? If possible, please preserve or re..."

- **Thread [747519] Update on "Kaggle Error" Submissions & Queue Delays** (7 comment(s)):
  - - **FakeEyes2W** (CONTRIBUTOR) at `04:37:38 UTC`:
    > "Hello Kaggle Support / competition operations team,  Could you check the current processing state of our submission to Google - The Gemma 4 Developer Agent Competition? FakeEyes2W Submission ID: 58167555  Submitted: 2026-11-09 14:32:43 UTC  Status: PENDING for roughly 38 hours — no public score, no..."
  - - **Jak Ma** (MASTER) at `04:57:54 UTC`:
    > "I also with this.😭..."
  - - **Unknown** (CONTRIBUTOR) at `06:33:51 UTC`:
  - - **Unknown** (CONTRIBUTOR) at `07:14:42 UTC`:
  - - **Unknown** (CONTRIBUTOR) at `13:46:06 UTC`:
  - - **Rook86** (CONTRIBUTOR) at `13:52:03 UTC`:
    > "Submission 58168732 (submitted 2026-11-09 15:22 UTC) has shown "Notebook Running" for over 48 hours. The ZIP (1,035 bytes, agent.yaml / eval_config.yaml / prompts/system.md, no adapter, 5 min / 48 tool calls per task) validates with the official compiler. Because of the one-pending-submission limit..."
  - - **Unknown** (CONTRIBUTOR) at `14:12:35 UTC`:

- **Thread [744354] Thinking mode drops the model's thoughts between tool calls (vLLM ignores `reasoning_content`). Will the scoring environment be patched?** (1 comment(s)):
  - - **Lazaros Avramidis** (CONTRIBUTOR) at `09:23:47 UTC`:
    > "Hi Ryan,  Following your earlier update about the `reasoning_content` compatibility fix, we reproduced the issue on November 11 using the latest officially available Gemma 4 Developer Agent wheelhouse (v31, last updated October 12).  We ran a private Kaggle notebook on 4× L4 with the official Gemma..."

- **Thread [757993] Kaggle notebook runtime issue** (3 comment(s)):
  - - **Muhmad KwaZulu gorilla** (CONTRIBUTOR) at `11:46:15 UTC`:
    > "Imagine waiting 20 hours for a TPU server, just for it to die in 5 minutes violentally..."
  - - **Qiyu_Ma** (CONTRIBUTOR) at `12:37:31 UTC`:
    > "It happens to me too. My submission has been running for more than 40 hours...."
  - - **FakeEyes2W** (CONTRIBUTOR) at `13:30:25 UTC`:
    > "same. My submission has been running for 52 hrs..."

---

### Thursday, November 12, 2026 (2026-11-12)
**Activity:** 7 new thread(s) opened, 15 comment(s)/reply(ies).

#### New Threads Opened
- **[[758289]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/758289)** `04:42:30 UTC` — **foysalemonshanto** (EXPERT)  
  **Title:** *Does the scorer serve with the vLLM / swegemma / adk-submission versions from the wheelhouse dataset?*  
  > "[@elanlearns](/elanlearns)  Hi, a quick clarification question for the hosts. HARNESS_README §3.1 lists the scorer's vLLM settings (TP=4, gpu_memory_utilization=0.80, max_model_len=32768, gemma4 tool/reasoning parsers, enable_lora with max_loras=8 /..."  

- **[[758547]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/758547)** `14:58:15 UTC` — **clanevil** (CONTRIBUTOR)  
  **Title:** *Skill-only bundle scores 0.00 on the leaderboard but resolves tasks in the harness's Docker mode locally. Do skill scripts run on the scorer?*  
  > "Hi [@ryanholbrook](/ryanholbrook),  Two of our submissions use one skill script as the agent's only tool besides `submit_patch` and `get_status` (a 190 KB standard-library Python script, called through `run_skill_script`). Both finished COMPLETE with..."  

- **[[758599]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/758599)** `16:29:40 UTC` — **cryptozenith** (CONTRIBUTOR)  
  **Title:** *Submission stuck in "Notebook Running" for 3 days, blocking all new submissions (ID 58169362)*  
  > "Our submission 58169362 to gemma-4-developer-agent was created on 2026-11-09 at 15:53 UTC and still shows "Notebook Running". The run limit is 12 hours. The Submissions page offers no way to cancel it.  While it is pending, every new submission is re..."  

- **[[758729]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/758729)** `19:33:29 UTC` — **muhandalsaiari** (CONTRIBUTOR)  
  **Title:** *Public repo with our agent configs and run data*  
  > "Sharing our repo publicly, as rule 3.6b asks: [https://github.com/muhandalsaiari/araswe-sandbox/tree/araswe](https://github.com/muhandalsaiari/araswe-sandbox/tree/araswe)  It holds the agent configs and experiment data from our paper-track work (Gemm..."  

- **[[758817]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/758817)** `21:44:35 UTC` — **rathko** (CONTRIBUTOR)  
  **Title:** *Open toolkit for measuring noise in your agent runs*  
  > "I think many people here have the same problem. A lot of "wins" are just luck.  I've open-sourced the tools I use to help understand the scores and what is happening in each run, under Apache-2.0.   Repo: [https://github.com/rathko/kaggle-glassbox](h..."  

- **[[758821]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/758821)** `21:51:09 UTC` — **ozgung** (CONTRIBUTOR)  
  **Title:** *Open code and data: agent configs, weight-editing library and held-out task sets (Gemma 4 E4B)*  
  > "For the paper track we studied whether frontier models can fix a defect of the E4B agent by editing its weights directly. We are sharing the code and data behind the two writeups with all participants, under an OSI-approved licence:  - Study reposito..."  

- **[[758854]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/758854)** `22:54:42 UTC` — **purnimapathak15** (CONTRIBUTOR)  
  **Title:** *Harness pitfalls: no async functions in the code graph; bad skill names score 0.00*  
  > "1. The code graph behind search_similar_code contains no async functions  I compared the competition code graph (data released 13 October 2026) with the source of one published task snapshot per repository, using the graph for that task's commit.  -..."  

#### Significant Comments & Discussion Updates
- **Thread [747519] Update on "Kaggle Error" Submissions & Queue Delays** (6 comment(s)):
  - - **Unknown** (CONTRIBUTOR) at `01:17:20 UTC`:
  - - **Unknown** (CONTRIBUTOR) at `01:18:21 UTC`:
  - - **Cam-Mark** (CONTRIBUTOR) at `15:24:12 UTC`:
    > "Same here: our submission 58169485 has been PENDING since 2026-11-09 16:03 UTC (~71 h), and it's blocking our next one under the one-pending limit. Our submissions in the week before scored within 7–41 h. [@Dustin](/Dustin) [@Ryan](/Ryan) Holbrook, could you check whether the L4 queue is moving, or..."
  - - **amunozo** (CONTRIBUTOR) at `16:18:34 UTC`:
    > "Same problem here, adding our details in case it helps to find the cause. Team amunozo: submission.zip uploaded 2026-11-09 14:47:25 UTC has been PENDING for more than 73 hours, with no "Kaggle Error". Our four previous entries with the same limits were scored within a day. Judging by the public lead..."
  - - **vjb** (CONTRIBUTOR) at `16:54:11 UTC`:
    > "Same here: our submission 58162267 has been PENDING since Nov 9, 11:28 UTC (~77 h), with no error, and it's blocking our next one under the one-pending limit. Our earlier submissions cleared in about a day. It looks like several submissions from Nov 9 are in the same state (58167555, 58169485 above)..."
  - - **KyoungIk Jang** (CONTRIBUTOR) at `21:13:14 UTC`:
    > "Same here. Our submission 58169275 was created on 2026-11-09 at 15:48 UTC, five minutes before yours, and is  still PENDING with no score or error (checked 2026-11-12 21:10 UTC).  An identical bundle completed normally on 2026-11-06, and it stops itself well before the 12-hour limit, so a  runtime o..."

- **Thread [744354] Thinking mode drops the model's thoughts between tool calls (vLLM ignores `reasoning_content`). Will the scoring environment be patched?** (3 comment(s)):
  - - **kimdonggyu1255** (CONTRIBUTOR) at `03:19:26 UTC`:
    > "Hi Lazaros. I am not the host, but this may save you some time while you wait. As far as I can tell from the public wheels, the patch was made in the harness client, not in vLLM, so vLLM 0.19.1 still reading only `reasoning` is expected.  Where it is. `adk_submission` 0.2.13, `adk_submission/resolve..."
  - - **Navneet** (CONTRIBUTOR) at `03:45:14 UTC`:
    > "Thank you for the info on the scoring environment [@wukeneth](/wukeneth)..."
  - - **Lazaros Avramidis** (CONTRIBUTOR) at `07:13:09 UTC`:
    > "Thank you, kimdonggyu1255. We independently checked the official adk_submission 0.2.13 wheel and confirmed your explanation. _normalize_reasoning_message() mirrors reasoning_content into reasoning, and the compiler installs the LiteLlm patch.  We also replayed a synthetic thought/tool-call/tool-resu..."

- **Thread [757993] Kaggle notebook runtime issue** (1 comment(s)):
  - - **Kaz** (CONTRIBUTOR) at `07:45:49 UTC`:
    > "Same, cant submit for 2 days.😭..."

- **Thread [750490] budget warning from harness - can it be given for all tool responses?** (1 comment(s)):
  - - **@范抑扬** (CONTRIBUTOR) at `11:57:58 UTC`:
    > "[@ryanholbrook](/ryanholbrook) Could the organizers check the actual scorer-side records for our completed submission, without rerunning it if the records are still retained?  Request: a redacted budget-feedback receipt from an existing scored run  - Account: piieace  - Submission time: 2026-11-11 1..."

- **Thread [757588] I reran a public 0.24 bundle unchanged and got 0.17 (data and short paper)** (3 comment(s)):
  - - **Unknown** (CONTRIBUTOR) at `14:18:30 UTC`:
    > "Yes, variance is about 4-5 tasks in max(1 / ( 120 / 2 )) = 0.017 per task in LB) in my experience.  I only modified skills, and my LB is 0.13--0.20.  By the way, my best shot and worst is the same notebook hahaha(does this mean I didnt make any improvement🤡)...."
  - - **Darsh Dhawan** (CONTRIBUTOR) at `20:52:17 UTC`:
    > "I was also thinking to reupload again and again for the sake of achieving a "statistical exception", even if the std-deviation is around 1.5 task, i'd get into top 500, but I dont execute that approach, cuz then the fall in the final leaderboards could be catastrophic 😭💀..."
  - - **Unknown** (CONTRIBUTOR) at `21:11:11 UTC`:
    > "Haha, I just began to learn LLM fine-tunning related, and this is my first competition. Just want to learn something useful.🤖..."

- **Thread [758547] Skill-only bundle scores 0.00 on the leaderboard but resolves tasks in the harness's Docker mode locally. Do skill scripts run on the scorer?** (1 comment(s)):
  - - **GabrielOchoa619** (CONTRIBUTOR) at `19:38:00 UTC`:
    > "we also rely on run_skill_script to install a helper. Could the staff confirm whether skill scripts execute in the scorer’s Docker sandbox?”..."

---

### Friday, November 13, 2026 (2026-11-13)
**Activity:** 5 new thread(s) opened, 25 comment(s)/reply(ies).

#### New Threads Opened
- **[[758953]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/758953)** `03:30:37 UTC` — **shyjin** (EXPERT)  
  **Title:** *Are only November 9 submissions stuck in the queue*  
  > "I've noticed that all the submissions I've seen stuck in the queue were submitted on November 9.  Is this a normal queue delay, or is there an issue specifically affecting November 9 submissions?  Has anyone who submitted on November 10 or later rece..."  

- **[[758954]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/758954)** `03:32:57 UTC` — **akanksha2804** (CONTRIBUTOR)  
  **Title:** *Scorer minutes: a toolkit to convert time caps between GPUs and measure run to run noise*  
  > "Hi all,  Sharing a small toolkit I built while working on this competition, in case it helps others who test on hardware that differs from the scoring machine.  The problem: a time cap per task buys a different amount of model work on every setup. In..."  

- **[[758968]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/758968)** `05:51:18 UTC` — **niraberman** (CONTRIBUTOR)  
  **Title:** *LoRA habit adapters changed the agent's behaviour offline but not the live score: three mechanisms*  
  > "Sharing what did not work for us, in case it saves someone GPU days. Behaviour moved, score did not. A rank-8 LoRA trained on 442 "edit now" decision points from our own solved runs raised the edit rate at held-out edit-ready points from 0-2% to 67%..."  

- **[[758969]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/758969)** `05:54:42 UTC` — **muhammadakhtarquddus** (CONTRIBUTOR)  
  **Title:** *Three lessons from 22 submissions: a zip bug, LB noise, and E4B quitting early*  
  > "I'm a data engineer new to agent competitions. Here is what I learned from 22 submissions, in case it saves someone a few days.  1. "Notebook Threw Exception"? Check your zip for a second agent. Two of my 31B submissions failed with no error details...."  

- **[[758972]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/758972)** `05:56:05 UTC` — **bharat0** (CONTRIBUTOR)  
  **Title:** *Eval in kernel is 3x slower than API, vLLM Config to optimise speed*  
  > "I was using ollama's cloud for running the eval. When my credits are over, I tried kaggle kernel to do the eval and found that it is 3x slower. Below are the comparision.    It looks like we can optimise the speed with some vLLM config changes.  The..."  

#### Significant Comments & Discussion Updates
- **Thread [747519] Update on "Kaggle Error" Submissions & Queue Delays** (13 comment(s)):
  - - **Rook86** (CONTRIBUTOR) at `02:39:15 UTC`:
    > "Follow-up: submission 58168732 is still "Notebook Running" after about 81 hours (submitted 2026-11-09 15:22 UTC). Either clearing it or letting it finish would help; the one-pending-submission limit is blocking our team's further submissions. Submission file: submission.zip, 1,035 bytes, no adapter,..."
  - - **shyjin** (EXPERT) at `03:22:29 UTC`:
    > "Submission 58169326(submitted 2026-11-09 15:51:32 UTC) has shown "Notebook Running" for over 83 hours. [@herbison](/herbison) [@ryanholbrook](/ryanholbrook), could you check whether these are still queued or stuck? If ours can't be scored, erroring it out would let us submit again. Thanks!..."
  - - **bytebender** (CONTRIBUTOR) at `04:59:02 UTC`:
    > "exactly same..."
  - - **Qiyu_Ma** (CONTRIBUTOR) at `05:57:06 UTC`:
    > "Same here. My submission 58168259, accepted around 2026-11-09 15:01 UTC, has also remained pending for approximately 87 hours, with no score or error. Several participants in this thread have reported submissions from the same day being stuck for a similar length of time. This suggests a possible sc..."
  - - **zhudong1949** (MASTER) at `06:40:52 UTC`:
    > "[@herbison](/herbison) [@ryanholbrook](/ryanholbrook) Is the Kaggle team on holiday at the moment? I haven't received any response so far...."
  - - **Unknown** (CONTRIBUTOR) at `06:45:52 UTC`:
  - - **KyoungIk Jang** (CONTRIBUTOR) at `08:07:29 UTC`:
    > "Follow-up on submission 58169275 (submitted 2026-11-09 at 15:48 UTC): it remains PENDING and the one-pending-submission limit is blocking our team from submitting again. We have also contacted support through the official form.  For clarity, the identical file is our earlier submission 58051705, whi..."
  - - **Unknown** (CONTRIBUTOR) at `09:02:42 UTC`:
  - - **Unknown** (CONTRIBUTOR) at `11:04:59 UTC`:
  - - **Unknown** (CONTRIBUTOR) at `12:46:55 UTC`:
  - - **Unknown** (CONTRIBUTOR) at `15:19:24 UTC`:
  - - **Unknown** (CONTRIBUTOR) at `15:20:05 UTC`:
  - - **amn** (CONTRIBUTOR) at `17:59:29 UTC`:
    > "I met the same issue where 58168200 runs or pends for already 4 days and I have no idea how to continue this competition...."

- **Thread [748287] New Gemma 4 Models Available: 12B, E4B, and E2B** (1 comment(s)):
  - - **John Lambert** (CONTRIBUTOR) at `02:51:59 UTC`:
    > "Can different one model be used for a submission and for a different submission a different model be used?  Or do all submissions have to used the same model all the time?..."

- **Thread [758953] Are only November 9 submissions stuck in the queue** (2 comment(s)):
  - - **zhudong1949** (MASTER) at `06:48:07 UTC`:
    > "Kaggle must have had an outage around this time...."
  - - **Ankith Savio** (CONTRIBUTOR) at `09:05:35 UTC`:
    > "I dont want to jinx it (please god 🙏) but I have consecutively been submitting for the past 5 days which end in 13-14 hours..."

- **Thread [758817] Open toolkit for measuring noise in your agent runs** (3 comment(s)):
  - - **Radek Maciaszek** (CONTRIBUTOR) at `07:09:55 UTC`:
    > "Related Kaggle write-up: [https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/writeups/new-writeup-1794498900936](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/writeups/new-writeup-1794498900936)..."
  - - **Ayush Thakur** (MASTER) at `11:03:40 UTC`:
    > "I didn't properly read this but can you correct me if my inference from this writeup is correct?  You built a trajectory observation tool to compare between the same task's trajectories and compare the divergence + fork from a step and rollout from there. This forking was based on the knowledge you..."
  - - **Radek Maciaszek** (CONTRIBUTOR) at `19:02:57 UTC`:
    > "Indeed, the writeup doesn't claim a better prompt. What it describes is how I get to one.   Forks let me test ideas fast. I replay a recorded run up to the chosen step and try a change from there, so I can check hundreds of variants on a small set of tasks.   Only once something looks promising do I..."

- **Thread [758599] Submission stuck in "Notebook Running" for 3 days, blocking all new submissions (ID 58169362)** (1 comment(s)):
  - - **wei pei xuan** (CONTRIBUTOR) at `10:01:43 UTC`:
    > "Same problem, also a November 9 submission.  Team: ubiluby Submitted: 2026-11-09 15:07:36 UTC Status: PENDING ("Notebook Running") for ~96 hours. No score, no terminal error. The Submissions page offers no cancel or withdraw action.  While it is pending, every new submission is rejected: 400 FAILED_..."

- **Thread [758968] LoRA habit adapters changed the agent's behaviour offline but not the live score: three mechanisms** (4 comment(s)):
  - - **Mohammad Shadab Alam** (MASTER) at `10:14:37 UTC`:
    > "My rank-8 LoRA  trained to enforce edit deadline + forced  get_code_neighbors , scores 0.17 more often than the base...."
  - - **Nir Aberman** (CONTRIBUTOR) at `12:04:21 UTC`:
    > "Thanks, that is the first live gain report we have seen. Could you share: how many draws for the LoRA and for the base, and the mean of each? Which base bundle? And does your adapter keep the thinking channel (reasoning_content non-empty with the adapter loaded)? Ours went to 0 of 109 calls with rea..."
  - - **Mohammad Shadab Alam** (MASTER) at `14:43:15 UTC`:
    > "The thinking channel is kept: with the adapter loaded, reasoning is non-empty in all runs.  I would check:  (1) do your target sequences contain the thought tokens exactly as the server emits them,  (2) are any rows empty-thought or template-thought,  (3) was thinking enabled with the same budget at..."
  - - **Nir Aberman** (CONTRIBUTOR) at `14:50:50 UTC`:
    > "Thank you, check (1) was it. Our training targets carried no reasoning at all (0 of 993 rows): our data builder kept only the tool call, so the adapter learned to skip thinking. Rebuilding with the served thought text next...."

- **Thread [758972] Eval in kernel is 3x slower than API, vLLM Config to optimise speed** (1 comment(s)):
  - - **mikelou1** (EXPERT) at `12:41:35 UTC`:
    > "the point of the competition is you cant edit vllm or the inference configs when testing the model so tps is fixed...."

---

### Saturday, November 14, 2026 (2026-11-14)
**Activity:** 6 new thread(s) opened, 19 comment(s)/reply(ies).

#### New Threads Opened
- **[[759154]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/759154)** `01:00:56 UTC` — **sumyeung** (CONTRIBUTOR)  
  **Title:** *Testing configs offline on the 129 training tasks: my harness and results*  
  > "My harness for testing agent configs offline, before spending a daily submission, is public: [https://github.com/SumYg/telling-is-not-teaching](https://github.com/SumYg/telling-is-not-teaching) (Apache 2.0). It also backs my paper-track entry ([topic..."  

- **[[759162]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/759162)** `03:41:06 UTC` — **vijaikm** (CONTRIBUTOR)  
  **Title:** *Submission stuck in PENDING for 5 days — please help unblock (Ref: 58167516)*  
  > "Hi [@ryanholbrook](/ryanholbrook) / Kaggle Team,  My submission has been stuck in PENDING / Notebook Running for nearly 5 days (submitted on Nov 9, 2026, 14:31 UTC):  Competition: Google – The Gemma 4 Developer Agent Submission Ref ID: 58167516 Noteb..."  

- **[[759238]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/759238)** `12:50:45 UTC` — **mellamoa** (CONTRIBUTOR)  
  **Title:** *Public trajectory datasets generated by proprietary models (SWE-smith, SWE-Gym, SWE-Next): allowed for LoRA training?*  
  > "Hi organizers,  Two earlier answers cover cases close to this one:  - 742807: participants generating data by calling external models themselves may use them in accordance with the models' license terms.  - 746046: existing public SWE-bench-style tra..."  

- **[[759248]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/759248)** `13:40:38 UTC` — **patrickamaru** (CONTRIBUTOR)  
  **Title:** *Is it acceptable to use Logprobs in training?*  
  > "[@ryanholbrook](/ryanholbrook): I noticed that response_logprobs are not accepted in sampling configs. They would be essential for my training approach (yes, I know I am late).  Is that limitation for submissions only, or is it also a no-go to use lo..."  

- **[[759279]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/759279)** `16:54:33 UTC` — **michaelflorida** (CONTRIBUTOR)  
  **Title:** *Lora permission on model*  
  > "q1: Is LoRA fine-tuning on community-shared agent trajectories (for example lora_native_resolved.jsonl from the Gemma 4 serving and LoRA verification kit) allowed?   q2: Does it count as distillation?   q3: Do the winner release rules in Sections 2.5..."  

- **[[759305]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/759305)** `20:40:14 UTC` — **ajnalkarismailsab** (CONTRIBUTOR)  
  **Title:** *Title: Submission stuck in "Pending" since Nov 9, blocking all new submissions*  
  > "Hi Kaggle team,  My submission ref 58169977 (submitted 2026-11-09 16:38 UTC) has been in Pending status for over 5 days. Submissions from other teams made after it have scored normally.  Because of the one-pending-submission limit, every new submissi..."  

#### Significant Comments & Discussion Updates
- **Thread [758972] Eval in kernel is 3x slower than API, vLLM Config to optimise speed** (1 comment(s)):
  - - **Bharat** (CONTRIBUTOR) at `00:35:21 UTC`:
    > "Yes, I agree tps is fixed and it may be increased for everyone within the same hardware limits...."

- **Thread [758953] Are only November 9 submissions stuck in the queue** (1 comment(s)):
  - - **Kim Kumuha** (EXPERT) at `02:09:58 UTC`:
    > "Yes — and the window is under five hours. Every stuck submission reported across this thread, #747519,  743683 and #757993 was accepted on 2026-11-09 between 11:28 and 16:03 UTC, in the contiguous ID band 58162267-58169485.  <table> <thead> <tr> <th>Submission</th> <th>Accepted (UTC, 11-09)</th> <th..."

- **Thread [759162] Submission stuck in PENDING for 5 days — please help unblock (Ref: 58167516)** (6 comment(s)):
  - - **Yurnero** (GRANDMASTER) at `04:56:39 UTC`:
    > "I guess something happened on 9th Nov. Its really frustrating..."
  - - **Navneet** (CONTRIBUTOR) at `05:24:39 UTC`:
    > "All the best for Submission [@vijaikm](/vijaikm)..."
  - - **J.** (EXPERT) at `06:09:16 UTC`:
    > "I have the same problem :( it's very frustrating..."
  - - **KyoungIk Jang** (CONTRIBUTOR) at `14:21:37 UTC`:
    > "Could the Kaggle competition team please identify and mark as failed all submissions that are still stuck in PENDING from the affected November 9, 2026 submission window, so that the affected teams can submit again?  My submission 58169275 was submitted on November 9 at 15:48 UTC and remains pending..."
  - - **Muhammad Haseeb Ahmad** (EXPERT) at `16:53:13 UTC`:
    > "Email them may be. There're other submissions on the leaderboard from after your submission, so it is not fair for yours to be stuck...."
  - - **Riyaz Ur Rehman** (CONTRIBUTOR) at `17:58:00 UTC`:
    > "[@ryanholbrook](/ryanholbrook) My submission has also been stuck in pending / notebook running for about five days, blocking further submissions under the one pending submission limit...."

- **Thread [747519] Update on "Kaggle Error" Submissions & Queue Delays** (7 comment(s)):
  - - **Siyuan Chen** (CONTRIBUTOR) at `05:20:08 UTC`:
    > "Adding ours to the 2026-11-09 cohort: submission 58168453, submitted 2026-11-09 15:09:51 UTC, PENDING for ~5 days with no score and no error, which blocks our next submission under the one-pending limit. A sibling bundle of the same family completed normally on 11-06, so a runtime overrun on our sid..."
  - - **J.** (EXPERT) at `10:46:43 UTC`:
    > "5 days and my submission is still scoring and prevents me from more entires. Please, could you cancel it so I can keep participating in the competition? ref. 58172153 [@herbison](/herbison)  [@ryanholbrook](/ryanholbrook)..."
  - - **Unknown** (CONTRIBUTOR) at `14:12:08 UTC`:
  - - **Unknown** (CONTRIBUTOR) at `14:42:09 UTC`:
  - - **Unknown** (CONTRIBUTOR) at `15:11:48 UTC`:
  - - **Unknown** (CONTRIBUTOR) at `19:23:21 UTC`:
  - - **Unknown** (CONTRIBUTOR) at `19:32:51 UTC`:

- **Thread [759238] Public trajectory datasets generated by proprietary models (SWE-smith, SWE-Gym, SWE-Next): allowed for LoRA training?** (3 comment(s)):
  - - **Jason Krijgsman** (CONTRIBUTOR) at `13:35:10 UTC`:
    > "I don't see why not, it's publicly accessible to use those datasets and tasks for training LoRA adapters. You can also create teacher rows from more intelligent models as long as you're adhering to the model's license terms. So no pure distillation...."
  - - **@s3werst** (CONTRIBUTOR) at `14:53:21 UTC`:
    > "Ok sounds great, just making sure. It’s just my knowledge of the SWE datasets is that some are created by OpenAI and Anthropic models, so yea...."
  - - **Ankith Savio** (CONTRIBUTOR) at `18:12:53 UTC`:
    > "Check comments from staff under this post : [https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/742807](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/742807)..."

- **Thread [758854] Harness pitfalls: no async functions in the code graph; bad skill names score 0.00** (1 comment(s)):
  - - **Purnima Pathak** (CONTRIBUTOR) at `19:27:54 UTC`:
    > "A correction to our writeup, and something we learned.** After submitting, we found that our BM25 skill never searched the repository. Skill scripts seem to run outside the agent's sandbox, so our script indexed its own skill folder instead of the task's code; in 15 of 16 traces its first output ran..."

---

### Sunday, November 15, 2026 (2026-11-15)
**Activity:** 4 new thread(s) opened, 11 comment(s)/reply(ies).

#### New Threads Opened
- **[[759322]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/759322)** `01:07:46 UTC` — **tom99763** (MASTER)  
  **Title:** *We couldn't submit anything due to last submission stuck for 5 days*  
  > "[@herbison](/herbison) Hi, our submission stucked 5 days and is still not finished yet. Could you help us check it thank you...."  

- **[[759329]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/759329)** `02:59:13 UTC` — **morikentaro36** (CONTRIBUTOR)  
  **Title:** *Looking for advice: thinking-budget experiments and a 0.15 → 0.13 repeat run*  
  > "I'm trying to improve my Gemma 4 coding agent and would appreciate advice on what to test next.  My setup uses Gemma 4 31B with main/tool LoRA adapters, temperature 0.2, top_p 0.95, and max_output_tokens 8192. The per-task limits are 8 minutes, 28 to..."  

- **[[759388]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/759388)** `09:42:01 UTC` — **aibyai** (CONTRIBUTOR)  
  **Title:** *Three clarifications: 12-hour limit, scorer environment freeze, submissions after Nov 25*  
  > "Hi Kaggle team,  A few clarifications that matter for planning the final submissions. Thank you in advance.  Q1. 12-hour limit and final scoring. Is it still the case that a submission which hits the 12-hour limit errors as a whole, with no partial s..."  

- **[[759427]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/759427)** `15:29:17 UTC` — **topeseun100** (CONTRIBUTOR)  
  **Title:** *Is generating SFT trajectories with the hosted Gemma-4-31B-IT API compliant?*  
  > "Hi hosts,  I'm planning my training-data pipeline and would like a ruling on one method before I run it, because the rules page doesn't address it directly.  What I plan to do  - Fine-tune a LoRA adapter on one permitted base checkpoint: `gemma-4-31b..."  

#### Significant Comments & Discussion Updates
- **Thread [759305] Title: Submission stuck in "Pending" since Nov 9, blocking all new submissions** (1 comment(s)):
  - - **mhdaw** (MASTER) at `00:58:06 UTC`:
    > "Our team has the same problem; our submission ref: 58169760 submitted at 2026-11-09 16:23:44 via kaggle cli has been running for over 5 days and we cannot submit as well...."

- **Thread [759322] We couldn't submit anything due to last submission stuck for 5 days** (5 comment(s)):
  - - **mhdaw** (MASTER) at `01:25:06 UTC`:
    > "we have tried from web UI, notebook and also cli which resulted with: {   "error": {     "code": 400,     "message": "Submission not allowed: Your team already has 1 pending submissions; please wait for one to finish scoring.",     "status": "FAILED_PRECONDITION"   } }..."
  - - **Pavel Orlov** (EXPERT) at `04:17:43 UTC`:
    > "It seems Google is trying to catch up with Microsoft in the AI implementation race (as you know, Microsoft recently announced layoffs of 60,000 employees and a shift in focus to AI development. As a result, their services were down for almost a whole day recently, or clients could have suffered bill..."
  - - **hsiaosuan** (EXPERT) at `08:36:20 UTC`:
    > "I think the shortage of GPU L4 * 4 machine supply against high demand has not eased just yet. They implemented the submit block to effectively cut down demand. its frustrating to all of us..."
  - - **Sahil Das** (CONTRIBUTOR) at `11:27:30 UTC`:
    > "Wow. This is very unfortunate, and I am very sorry for you.  I've faced similar problems, but none of my submissions have been stuck for this long, like ever.  Honestly, I'd recommend sending an email to Kaggle staff. They usually respond within a day. Might be able to do something about this stuck..."
  - - **mhdaw** (MASTER) at `20:58:40 UTC`:
    > "november 15 update, it is still the same. [@ashleyoldacre](/ashleyoldacre) , [@ryanholbrook](/ryanholbrook) , [@herbison](/herbison) , [@elanlearns](/elanlearns)  please take a look...."

- **Thread [747519] Update on "Kaggle Error" Submissions & Queue Delays** (1 comment(s)):
  - - **Unknown** (CONTRIBUTOR) at `03:10:29 UTC`:

- **Thread [751311] Request to hosts: inference kernels** (1 comment(s)):
  - - **Pranshu Bahadur** (EXPERT) at `09:17:48 UTC`:
    > "here is how you can make your own kernels for training and inference, please help yourselves!  [https://www.kaggle.com/code/pranshubahadur/xarmory-lora-gpu-kernel-guide](https://www.kaggle.com/code/pranshubahadur/xarmory-lora-gpu-kernel-guide)..."

- **Thread [758972] Eval in kernel is 3x slower than API, vLLM Config to optimise speed** (1 comment(s)):
  - - **Pranshu Bahadur** (EXPERT) at `09:18:29 UTC`:
    > "[https://www.kaggle.com/code/pranshubahadur/xarmory-lora-gpu-kernel-guide](https://www.kaggle.com/code/pranshubahadur/xarmory-lora-gpu-kernel-guide)  here is a guide on how to make your own kernels, up the lb bar!..."

- **Thread [759329] Looking for advice: thinking-budget experiments and a 0.15 → 0.13 repeat run** (1 comment(s)):
  - - **Nir Aberman** (CONTRIBUTOR) at `12:40:48 UTC`:
    > "A few things from our runs that map onto your three questions.  - Check the adapter first. With our LoRA loaded, reasoning_content was empty in 0 of 109 calls: our training targets contained no thought text, so the adapter learned to skip thinking. Tool calls then leaked as plain text in 5 of 9 runs..."

- **Thread [759162] Submission stuck in PENDING for 5 days — please help unblock (Ref: 58167516)** (1 comment(s)):
  - - **Sumitdevai** (CONTRIBUTOR) at `17:56:58 UTC`:
    > "I don't know why it takes so much time, mine showing 8hrs still not showing..."

---

### Monday, November 16, 2026 (2026-11-16)
**Activity:** 4 new thread(s) opened, 18 comment(s)/reply(ies). ⚠️ **Host/Staff Active (3 action(s))**

#### New Threads Opened
- **[[759514]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/759514)** `02:20:29 UTC` — **xiaoz259** (MASTER)  
  **Title:** *five LoRA probes with identical scores *  
  > "So I did nothing except submitting the public notebook using LoRA adapter with weights zeros to test and see if it is working. I submitted 5 times and every time I get 0.15. This seems a bit odd. What is your variance like with the public notebook?..."  

- **[[759580]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/759580)** `11:42:59 UTC` — **bugkeeper** (CONTRIBUTOR)  
  **Title:** *Submission #58412868 PENDING for 8h+: scorer-stage check and local parser reproduction*  
  > "Hi competition hosts,  Could you please check the current evaluation stage of submission #58412868? I am including a local parser reproduction as a possible diagnostic lead, not as a confirmed explanation for this submission.  Submission status  - Ac..."  

- **[[759630]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/759630)** `16:42:37 UTC` — **paul1994a** (CONTRIBUTOR)  
  **Title:** *The Nov 9 stuck batch: 15 teams, one 3-hour window, everyone else is scoring normally. Evidence from the public API*  
  > "[@herbison](/herbison) [@ryanholbrook](/ryanholbrook)  This is not a general queue delay. It is a small, well-defined batch of orphaned submissions, and it has been locking the affected teams out of the competition for 7 days.  *1. The batch is small..."  

- **[[759702]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/759702)** `20:09:57 UTC` — **itskshivam** (CONTRIBUTOR)  
  **Title:** * Submission 58171169 stuck in PENDING since 9 Nov *  
  > "Hi, my submission 58171169 to the Gemma 4 Developer Agent competition (account itskshivam, submitted 2026-11-09 17:33 UTC, code submission via notebook output) has shown SubmissionStatus.PENDING for over 7 days. My earlier submissions scored within 1..."  

#### Significant Comments & Discussion Updates
- **Thread [751311] Request to hosts: inference kernels** (2 comment(s)):
  - - **Dante** (CONTRIBUTOR) at `01:13:32 UTC`:
    > "This will make the competition more interesting..."
  - - **SalmanS24** (CONTRIBUTOR) at `07:55:48 UTC`:
    > "Could the hosts clarify whether deterministic LoRA reduction can be enabled in the actual evaluation scorer?  I investigated repeated greedy-output variation using the competition's patched vLLM0.19.1 wheel (SHA256 `73c69bafca24fbdad44690c44d6c6446514351e6f3cc9a6057cba05e66051310`). Its LoRA shrink..."

- **Thread [747519] Update on "Kaggle Error" Submissions & Queue Delays** (11 comment(s)):
  - - **Unknown** (CONTRIBUTOR) at `04:56:36 UTC`:
  - - **Unknown** (CONTRIBUTOR) at `08:02:42 UTC`:
  - - **Unknown** (CONTRIBUTOR) at `08:08:33 UTC`:
  - - **Unknown** (CONTRIBUTOR) at `15:55:01 UTC`:
  - - **Unknown** (CONTRIBUTOR) at `18:15:26 UTC`:
  - ⭐ **[STAFF/HOST] Ashley Oldacre (STAFF)** at `18:15:34 UTC`:
    > "Hi J, Thank you for flagging. Our team has been notified and we are looking into this. We will share an update soon. Thank you for your patience and we apologize for the inconvenience...."
  - ⭐ **[STAFF/HOST] Ashley Oldacre (STAFF)** at `18:15:50 UTC`:
    > "Hi Siyuan, Thank you for flagging. Our team has been notified and we are looking into this. We will share an update soon. Thank you for your patience and we apologize for the inconvenience...."
  - ⭐ **[STAFF/HOST] Ashley Oldacre (STAFF)** at `18:17:19 UTC`:
    > "Thank you everyone for your patience. We have seen the most recent comments about submissions being stuck. We are looking into this and we will get back to you as soon as possible...."
  - - **Qiyu_Ma** (CONTRIBUTOR) at `18:18:45 UTC`:
    > "Thank you!..."
  - - **Unknown** (CONTRIBUTOR) at `20:03:10 UTC`:
  - - **paul-1994a** (CONTRIBUTOR) at `20:31:05 UTC`:
    > "Thank you a lot !..."

- **Thread [758969] Three lessons from 22 submissions: a zip bug, LB noise, and E4B quitting early** (1 comment(s)):
  - - **Georgy Mamarin** (MASTER) at `05:28:22 UTC`:
    > "For slot two, I'd run the candidates and your first pick a few times on the same held-out issues with the same time budget. If two candidates have similar averages, I'd take the one that reliably fixes more of the issues your first pick misses.  In a [second-slot test I ran on past Kaggle boards](ht..."

- **Thread [759514] five LoRA probes with identical scores ** (2 comment(s)):
  - - **Ankith Savio** (CONTRIBUTOR) at `09:14:22 UTC`:
    > "Same public notebook : 0.13 - 0.20 The variance is quite high...."
  - - **Son Pham** (EXPERT) at `20:53:58 UTC`:
    > "Maybe they learn from ARC-AGI 3 and decided to implement a hash table to return the same results for same notebook submission? 😄..."

- **Thread [759162] Submission stuck in PENDING for 5 days — please help unblock (Ref: 58167516)** (1 comment(s)):
  - - **shivam** (CONTRIBUTOR) at `15:11:58 UTC`:
    > "Same issue here. Submission 58171169 (account itskshivam), submitted Nov 9, 2026 at 17:33 UTC from notebook itskshivam/gemma4-submit-v5b (version 1, which completed successfully), has been PENDING for about 7 days. There is no Cancel option on our Submissions page, and every new submission is reject..."

- **Thread [759630] The Nov 9 stuck batch: 15 teams, one 3-hour window, everyone else is scoring normally. Evidence from the public API** (1 comment(s)):
  - - **Yurnero** (GRANDMASTER) at `16:44:10 UTC`:
    > "BUMP [@herbison](/herbison) [@ryanholbrook](/ryanholbrook)..."

---

### Tuesday, November 17, 2026 (2026-11-17)
**Activity:** 2 new thread(s) opened, 12 comment(s)/reply(ies).

#### New Threads Opened
- **[[759781]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/759781)** `03:57:45 UTC` — **mauriciolop** (CONTRIBUTOR)  
  **Title:** *My Agent Approach - Gemma 4 Developer Agent *  
  > "Hi everyone! I just published my notebook explaining how my agent works for this competition.  It shows how to load tasks.jsonl, read a real task, and how the agent plans, writes the patch, and runs tests.  Here is my notebook: [https://www.kaggle.co..."  

- **[[759848]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/759848)** `12:21:30 UTC` — **marcofpereira** (CONTRIBUTOR)  
  **Title:** *Host ruling: is a PEFT LoRA derived by SVD of the model's own tensor acceptable? (not trained)*  
  > "Topic 756792 asks whether hand-constructed LoRA adapters are acceptable. I would like a host ruling on the specific case, because it decides which of our two finalists we select for the E2B/E4B Small Model Prize.  What the artifact is:  - A standard..."  

#### Significant Comments & Discussion Updates
- **Thread [759514] five LoRA probes with identical scores ** (4 comment(s)):
  - - **tammamalasha** (CONTRIBUTOR) at `00:58:30 UTC`:
    > "what temperature ?”..."
  - - **VELVRIN** (CONTRIBUTOR) at `16:23:54 UTC`:
    > "same here i tried with different different and same score 0.15..."
  - - **xz** (MASTER) at `20:02:17 UTC`:
    > "Maybe I ask how many submissions scored 0.15?..."
  - - **xz** (MASTER) at `20:02:47 UTC`:
    > "0.2, the same as in the public notebook...."

- **Thread [747519] Update on "Kaggle Error" Submissions & Queue Delays** (3 comment(s)):
  - - **Deenadayalan Kuravar** (CONTRIBUTOR) at `09:45:19 UTC`:
    > "Hi, my submission is still running 17+ hrs it would be better if you solve the delays. Thank you...."
  - - **Unknown** (CONTRIBUTOR) at `13:19:34 UTC`:
  - - **shivam** (CONTRIBUTOR) at `14:30:57 UTC`:
    > "Is the Deadline going to be extended… been trying to submit from 3 days… not able to make one submission… current submission is running for 18h + and the previous one ran for 7 days..."

- **Thread [759162] Submission stuck in PENDING for 5 days — please help unblock (Ref: 58167516)** (1 comment(s)):
  - - **zoro-in-action** (CONTRIBUTOR) at `12:23:33 UTC`:
    > "Finally stopped. I never thought I will be happy for seeing this  sign ...."

- **Thread [756792] Are hand-constructed LoRA adapters acceptable (weight edit from activation analysis, not gradient descent)?** (1 comment(s)):
  - - **Marco Pereira** (CONTRIBUTOR) at `12:26:26 UTC`:
    > "I asked the concrete version of this question in a separate topic: [https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/759848](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/759848)..."

- **Thread [759322] We couldn't submit anything due to last submission stuck for 5 days** (1 comment(s)):
  - - **Tom** (MASTER) at `14:34:42 UTC`:
    > "Finally it solved..."

- **Thread [751596] SFT / distillation LoRAs on Gemma 4 31B: loss falls a lot, solve rate doesn’t move. What would you try next?** (1 comment(s)):
  - - **Ilya Gordey** (EXPERT) at `17:49:58 UTC`:
    > "Hi, Yurnero :) We measured this on 1,254 runs of our base config (502 tasks, local panels).  Finding the file is not the problem. The gold file is read by call 2 in 63% of runs and by call 3 in 76%.  The problem is what happens next:  - solved runs: 37% of calls and 51% of time are spent before the..."

- **Thread [754000] Stuck Submission** (1 comment(s)):
  - - **Sherry** (CONTRIBUTOR) at `18:06:37 UTC`:
    > "How did you solve it? I ran into the same issue...."

---

### Wednesday, November 18, 2026 (2026-11-18)
**Activity:** 5 new thread(s) opened, 21 comment(s)/reply(ies). ⚠️ **Host/Staff Active (3 action(s))**

#### New Threads Opened
- **[[760014]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/760014)** `01:06:31 UTC` — **japanopendatalab** (CONTRIBUTOR)  
  **Title:** *Withdrawing, and sharing everything we measured: 1,800+ trials of a 4B quantized SWE agent (best custom 15/114 vs zero-think baseline 16/114)*  
  > "Hi everyone — we're Japan Open Data Lab. After 1,800+ evaluation trials across 9 system generations, we've decided to withdraw from this competition, and we'd rather publish our measurements than let them sit in a drawer. Everything below is aggregat..."  

- **[[760044]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/760044)** `06:21:10 UTC` — **mikkel255** (CONTRIBUTOR)  
  **Title:** *About our entry: Training a GAN adapter on Gemma 4's internal states.*  
  > "Can Gemma 4 learn a better repair workflow from its own hidden states? That’s what I’m testing in [Gemma 4 Particle Sliders](https://github.com/HyperGAN/gemma-4-particle-sliders). I tried a similar approach on a smaller scale with [Meta Glimmer](http..."  

- **[[760126]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/760126)** `16:47:59 UTC` — **snnclsr** (GRANDMASTER)  
  **Title:** *What happened to 0.29 score?*  
  > "Yeah just got curious what happened there..."  

- **[[760140]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/760140)** `17:29:28 UTC` — **renxiaohan** (CONTRIBUTOR)  
  **Title:** *Submission 58480207: E4B LoRA starts on 4xL4; nullable budget parsing may explain scorer exception*  
  > "Hi [@ryanholbrook](/ryanholbrook),  Could you check the failure stage of submission 58480207? It finished with "Notebook Threw Exception" and no score. We do not have the hidden scorer traceback, so we cannot confirm its cause.  We tested the identic..."  

- **[[760201]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/760201)** `20:29:35 UTC` — **justforgags** (CONTRIBUTOR)  
  **Title:** *My agent reads every new public notebook and arXiv paper overnight, then tests the ideas itself. 46 rounds till now, open source*  
  > "I’ve been running this competition with a small tool I made, ResearchForge, and I’d love a few people to try it and tell me where it breaks. It’s my take on [Karpathy’s autoresearch idea](https://github.com/karpathy/autoresearch), pointed at Kaggle:..."  

#### Significant Comments & Discussion Updates
- **Thread [760014] Withdrawing, and sharing everything we measured: 1,800+ trials of a 4B quantized SWE agent (best custom 15/114 vs zero-think baseline 16/114)** (2 comment(s)):
  - - **Smart Manoj** (EXPERT) at `02:28:54 UTC`:
    > "- -  - -  - [Defeating Nondeterminism in LLM Inference](https://thinkingmachines.ai/blog/defeating-nondeterminism-in-llm-inference)..."
  - - **Japan OpenData Lab** (CONTRIBUTOR) at `05:14:20 UTC`:
    > "Thanks for the pointer — yes, that post describes exactly the mechanism we ran into. With continuous batching, the reduction order changes run to run, and at temperature 0.0 that was enough to swing our solved count between 11 and 15 across identical configurations (SD 1.52 over 10 full runs). Batch..."

- **Thread [754000] Stuck Submission** (3 comment(s)):
  - - **Unknown** (CONTRIBUTOR) at `09:12:13 UTC`:
  - - **Andrey Kulakov** (CONTRIBUTOR) at `13:20:31 UTC`:
    > "My finished yesterday after ~24h in submission.. So it seems it is normal now, I suppose there is some internal queue..."
  - - **Unknown** (CONTRIBUTOR) at `13:29:12 UTC`:

- **Thread [751596] SFT / distillation LoRAs on Gemma 4 31B: loss falls a lot, solve rate doesn’t move. What would you try next?** (3 comment(s)):
  - - **KochiyaSanaeNya** (CONTRIBUTOR) at `15:03:39 UTC`:
    > "I have encountered a similar issue. In multi-round testing, while adding a LoRA adapter did help the model resolve certain previously unsolvable problems, it also caused the overall success rate to decline—dropping significantly below the performance of the agent alone...."
  - - **KochiyaSanaeNya** (CONTRIBUTOR) at `15:05:58 UTC`:
    > "Furthermore, I observed that the number of tool calls is significantly higher when a LoRA adapter is incorporated compared to using the agent alone; this, in turn, leads to failure due to exceeding the tool-call limit...."
  - - **KochiyaSanaeNya** (CONTRIBUTOR) at `15:16:12 UTC`:
    > "As an aside, here are my test results: with the LoRA adapter added, the model retrieved the correct samples on the first tool call for 90% of the test cases, yet it also produced 231 "empty patch" submissions. In contrast, when the agent was tested on its own, it required an average of two attempts..."

- **Thread [747519] Update on "Kaggle Error" Submissions & Queue Delays** (2 comment(s)):
  - - **Unknown** (CONTRIBUTOR) at `16:25:08 UTC`:
  - - **Unknown** (CONTRIBUTOR) at `17:14:59 UTC`:

- **Thread [760126] What happened to 0.29 score?** (11 comment(s)):
  - ⭐ **[STAFF/HOST] Ryan Holbrook (STAFF)** at `16:52:27 UTC`:
    > "We fixed a bug in the metric that was allowing some agents to achieve improperly high scores. We patched the metric to address this issue and rescored the involved submissions...."
  - - **Vibhanshu Singh** (CONTRIBUTOR) at `16:58:50 UTC`:
    > "Could you please clarify how ties will be resolved during the final evaluation on the hidden test cases?..."
  - - **Sinan Calisir** (GRANDMASTER) at `16:59:21 UTC`:
    > "Thanks for the update! Funny that the agents keep finding their ways :D..."
  - - **xz** (MASTER) at `17:02:15 UTC`:
    > "It is discouraging that no one seems to have beaten the variance. Are we sure LoRA is properly configured for evaluation?..."
  - ⭐ **[STAFF/HOST] Ryan Holbrook (STAFF)** at `17:04:18 UTC`:
    > "As in all competitions, ties are resolved by submission date. Earlier submissions win...."
  - - **Sinan Calisir** (GRANDMASTER) at `17:06:13 UTC`:
    > "Yeah, I am a bit disappointed with that as well. I tried various data and modeling approaches but couldn't break the barier on my own...."
  - - **Unknown** (CONTRIBUTOR) at `17:08:23 UTC`:
  - - **Vibhanshu Singh** (CONTRIBUTOR) at `17:10:05 UTC`:
    > "Will the final evaluation use deterministic inference on hidden test cases? Otherwise, could randomness give an earlier submission an unfair advantage over a later, deterministic one?..."
  - - **Tushar** (CONTRIBUTOR) at `17:17:21 UTC`:
    > "yeah same idk why my lora submission are also throwing timed out error..."
  - ⭐ **[STAFF/HOST] Ryan Holbrook (STAFF)** at `17:52:59 UTC`:
    > "Deterministic inference doesn't solve the problem of submission variance. It equalizes scores of byte-identical submissions on the same system, not submissions with the same generalization capability or with the same expected score on a set of tasks. Even if we ran with deterministic inference, you..."
  - - **xz** (MASTER) at `19:22:33 UTC`:
    > "The default unoptimized LoRA kernel might just be too much to overcome...."

---

### Thursday, November 19, 2026 (2026-11-19)
**Activity:** 2 new thread(s) opened, 16 comment(s)/reply(ies). ⚠️ **Host/Staff Active (1 action(s))**

#### New Threads Opened
- **[[760309]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/760309)** `06:00:34 UTC` — **sundow** (CONTRIBUTOR)  
  **Title:** *LoRA Inference Overhead Can Reduce Agent Performance Under Fixed Time Budgets*  
  > "I benchmarked inference speed with and without a LoRA adapter on an A100. In these tests, applying the adapter reduced token throughput by approximately 22–25% and slightly increased time to first token (TTFT).  <table> <thead> <tr> <th>Input tokens<..."  

- **[[760471]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/760471)** `18:29:01 UTC` — **ashleyoldacre** (STAFF)  
  **Title:** *11/18/26 Update on Submission Queue*  
  > "Hi everyone,  We've seen questions about longer-than-usual submission turnaround times in the competition, so I wanted to share a quick update on what's happening.  What's Happening Due to very high submission volume combined with long average notebo..."  

#### Significant Comments & Discussion Updates
- **Thread [760126] What happened to 0.29 score?** (5 comment(s)):
  - - **Murugesan Narayanaswamy** (EXPERT) at `01:34:57 UTC`:
    > "[@ryanholbrook](/ryanholbrook)   I suspect a similar discrepancy between the local eval harness and the actual LB runtime harness—the local scores do not correlate with the LB scores. On the local 127-task dataset, my agent orchestration performs at least equally well on Kaggle GPU (Gemma 4 31B), ye..."
  - - **Sahil Das** (CONTRIBUTOR) at `06:45:38 UTC`:
    > "I was wondering the same thing. I thought that submission was winning for sure and that it had had a breakthrough of some sort. Seems like the person has been wiped from the leaderboard altogether…..."
  - - **Murugesan Narayanaswamy** (EXPERT) at `09:14:21 UTC`:
    > "Note: local CV vs LB correlation is fine for agentless system.md but does not occur only when sequential agent / agent_tool is used - if the issue is with regard to sequential agent / agent_tool usage, then local GPU Gemma testing should also fail resolving  equivalent tasks...."
  - - **Vaibhav Nakrani** (EXPERT) at `11:18:00 UTC`:
    > "oh i have tried so many things sft, opd , rl nothing seems to work on the lora path.  edit: opd = on policy distillation from 31b - e4b  i am targeting e4b right now...."
  - - **AddyLifeapp** (CONTRIBUTOR) at `21:38:22 UTC`:
    > "Thanks for flagging this — good to know the rescore explains the change. Really helpful for anyone watching their score move...."

- **Thread [747519] Update on "Kaggle Error" Submissions & Queue Delays** (2 comment(s)):
  - - **Unknown** (CONTRIBUTOR) at `01:46:35 UTC`:
  - - **Unknown** (CONTRIBUTOR) at `06:24:41 UTC`:

- **Thread [743007] Welcome to the Gemma 4 Developer Agent Competition** (1 comment(s)):
  - - **Itachi45** (CONTRIBUTOR) at `03:34:01 UTC`:
    > "Question for the competition hosts: the rules allow appropriately licensed automated ML tools, but also require submissions to be the entrant’s own original work. Is a registered entrant eligible for judging and cash prizes if they disclose that an AI assistant designed, built, tested, and uploaded..."

- **Thread [759514] five LoRA probes with identical scores ** (2 comment(s)):
  - - **pomcho555** (EXPERT) at `05:38:46 UTC`:
    > "[@ryanholbrook](/ryanholbrook)   Could you look into this issue? Given the bug affecting the highest score (0.29), I suspect another bug may be causing scores to get stuck at the same value when LoRA is used under certain conditions.  Reference: [https://www.kaggle.com/competitions/gemma-4-developer..."
  - - **pardival** (CONTRIBUTOR) at `07:41:27 UTC`:
    > "try evaluating locally and observing performance with a fixed seed, LB scores fluctuate too much to be reliable...."

- **Thread [760309] LoRA Inference Overhead Can Reduce Agent Performance Under Fixed Time Budgets** (2 comment(s)):
  - - **Ankith Savio** (CONTRIBUTOR) at `11:13:22 UTC`:
    > "In the 4xL4 setup I noticed a 10-15% reduction in TPS. A finetuned Gemma would have to gain a higher score while utilizing 1k-1.5k less output tokens...."
  - - **AddyLifeapp** (CONTRIBUTOR) at `21:38:36 UTC`:
    > "Really useful numbers — the reminder that speed matters as much as accuracy under a time limit is a great takeaway...."

- **Thread [751596] SFT / distillation LoRAs on Gemma 4 31B: loss falls a lot, solve rate doesn’t move. What would you try next?** (2 comment(s)):
  - - **Munal Singh** (CONTRIBUTOR) at `14:13:17 UTC`:
    > "Yes I have  observed some similar results in my own Gemma 4 experiments Fine-tuning improved some metrics, but that didn't consistently translate into better solve rates. This competition is so compute-intensive that I'm mostly waiting for the top participants to share their solutions so I can learn..."
  - - **KochiyaSanaeNya** (CONTRIBUTOR) at `15:13:21 UTC`:
    > "I discovered that by modifying the B-matrices of the LoRA adapters—specifically by halving the weight increments across all 410 modules—I was able to significantly reduce timeouts. It is clear that excessively large LoRA increments lead to slower performance; however, this change did not improve the..."

- **Thread [760471] 11/18/26 Update on Submission Queue** (2 comment(s)):
  - - **Spirit de bourges** (CONTRIBUTOR) at `18:36:09 UTC`:
    > "Hi Ashley,   Is it possible to submit (add to the queue) a new submission while the previous one, made the day before, is still being evaluated?  -> There are only a few days left, so this is quite important :(..."
  - - **VELVRIN** (CONTRIBUTOR) at `23:53:37 UTC`:
    > "Hi [@ashleyoldacre](/ashleyoldacre) / Kaggle team, given the recent queue delays and rescoring updates, could you please confirm whether the December 2, 2026 final submission deadline is remaining as scheduled, or if there are any plans to extend it? Thanks in advance!..."

---

### Friday, November 20, 2026 (2026-11-20)
**Activity:** 1 new thread(s) opened, 1 comment(s)/reply(ies).

#### New Threads Opened
- **[[760595]](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/760595)** `04:47:19 UTC` — **arnelperezposadas** (CONTRIBUTOR)  
  **Title:** *Where a small E4B agent loses tasks: a trace-level diagnosis on 91 practice tasks, two mechanical checks, and three prompt traps*  
  > "Hi all. Following Japan Open Data Lab's excellent write-up (760014), here is what we measured on our side. It's smaller in scale, but it looks at every unsolved task's trace. All numbers are local runs on the public practice tasks with the official h..."  

#### Significant Comments & Discussion Updates
- **Thread [752693] Interested in teaming up? Please read our public Gemma smoke-test Code first** (1 comment(s)):
  - - **cosmorin** (CONTRIBUTOR) at `04:45:49 UTC`:
    > "Team recruitment — solo team pushing for gold, full publication commitment Team cosmorin is currently just me, and I am looking for members for the final push. I research with Codex and Muse on a Mac, aiming for gold (0.24; my best so far is 0.18).  My rule across competitions: when we rank in, I pu..."

---

## Master Thread Index (Active Between 2026-10-31 and 2026-11-20)

| Thread ID | Opened (UTC) | Last Activity (UTC) | Author | Tier | Staff Replied | Title |
|---|---|---|---|---|---|---|
| [760595](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/760595) | `2026-11-20` | `2026-11-20` | arnelperezposadas | CONTRIBUTOR | No | Where a small E4B agent loses tasks: a trace-level diagnosis on 91 practice tasks, two mechanical checks, and three prompt traps |
| [760471](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/760471) | `2026-11-19` | `2026-11-19` | ashleyoldacre | STAFF | No | 11/18/26 Update on Submission Queue |
| [760309](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/760309) | `2026-11-19` | `2026-11-19` | sundow | CONTRIBUTOR | No | LoRA Inference Overhead Can Reduce Agent Performance Under Fixed Time Budgets |
| [760201](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/760201) | `2026-11-18` | `2026-11-18` | justforgags | CONTRIBUTOR | No | My agent reads every new public notebook and arXiv paper overnight, then tests the ideas itself. 46 rounds till now, open source |
| [760140](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/760140) | `2026-11-18` | `2026-11-18` | renxiaohan | CONTRIBUTOR | No | Submission 58480207: E4B LoRA starts on 4xL4; nullable budget parsing may explain scorer exception |
| [760126](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/760126) | `2026-11-18` | `2026-11-19` | snnclsr | GRANDMASTER | **YES** | What happened to 0.29 score? |
| [760044](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/760044) | `2026-11-18` | `2026-11-18` | mikkel255 | CONTRIBUTOR | No | About our entry: Training a GAN adapter on Gemma 4's internal states. |
| [760014](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/760014) | `2026-11-18` | `2026-11-18` | japanopendatalab | CONTRIBUTOR | No | Withdrawing, and sharing everything we measured: 1,800+ trials of a 4B quantized SWE agent (best custom 15/114 vs zero-think baseline 16/114) |
| [759848](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/759848) | `2026-11-17` | `2026-11-17` | marcofpereira | CONTRIBUTOR | No | Host ruling: is a PEFT LoRA derived by SVD of the model's own tensor acceptable? (not trained) |
| [759781](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/759781) | `2026-11-17` | `2026-11-17` | mauriciolop | CONTRIBUTOR | No | My Agent Approach - Gemma 4 Developer Agent  |
| [759702](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/759702) | `2026-11-16` | `2026-11-16` | itskshivam | CONTRIBUTOR | No |  Submission 58171169 stuck in PENDING since 9 Nov  |
| [759630](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/759630) | `2026-11-16` | `2026-11-16` | paul1994a | CONTRIBUTOR | No | The Nov 9 stuck batch: 15 teams, one 3-hour window, everyone else is scoring normally. Evidence from the public API |
| [759580](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/759580) | `2026-11-16` | `2026-11-16` | bugkeeper | CONTRIBUTOR | No | Submission #58412868 PENDING for 8h+: scorer-stage check and local parser reproduction |
| [759514](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/759514) | `2026-11-16` | `2026-11-19` | xiaoz259 | MASTER | No | five LoRA probes with identical scores  |
| [759427](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/759427) | `2026-11-15` | `2026-11-15` | topeseun100 | CONTRIBUTOR | No | Is generating SFT trajectories with the hosted Gemma-4-31B-IT API compliant? |
| [759388](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/759388) | `2026-11-15` | `2026-11-15` | aibyai | CONTRIBUTOR | No | Three clarifications: 12-hour limit, scorer environment freeze, submissions after Nov 25 |
| [759329](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/759329) | `2026-11-15` | `2026-11-15` | morikentaro36 | CONTRIBUTOR | No | Looking for advice: thinking-budget experiments and a 0.15 → 0.13 repeat run |
| [759322](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/759322) | `2026-11-15` | `2026-11-17` | tom99763 | MASTER | No | We couldn't submit anything due to last submission stuck for 5 days |
| [759305](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/759305) | `2026-11-14` | `2026-11-15` | ajnalkarismailsab | CONTRIBUTOR | No | Title: Submission stuck in "Pending" since Nov 9, blocking all new submissions |
| [759279](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/759279) | `2026-11-14` | `2026-11-14` | michaelflorida | CONTRIBUTOR | No | Lora permission on model |
| [759248](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/759248) | `2026-11-14` | `2026-11-14` | patrickamaru | CONTRIBUTOR | No | Is it acceptable to use Logprobs in training? |
| [759238](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/759238) | `2026-11-14` | `2026-11-14` | mellamoa | CONTRIBUTOR | No | Public trajectory datasets generated by proprietary models (SWE-smith, SWE-Gym, SWE-Next): allowed for LoRA training? |
| [759162](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/759162) | `2026-11-14` | `2026-11-17` | vijaikm | CONTRIBUTOR | No | Submission stuck in PENDING for 5 days — please help unblock (Ref: 58167516) |
| [759154](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/759154) | `2026-11-14` | `2026-11-14` | sumyeung | CONTRIBUTOR | No | Testing configs offline on the 129 training tasks: my harness and results |
| [758972](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/758972) | `2026-11-13` | `2026-11-15` | bharat0 | CONTRIBUTOR | No | Eval in kernel is 3x slower than API, vLLM Config to optimise speed |
| [758969](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/758969) | `2026-11-13` | `2026-11-16` | muhammadakhtarquddus | CONTRIBUTOR | No | Three lessons from 22 submissions: a zip bug, LB noise, and E4B quitting early |
| [758968](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/758968) | `2026-11-13` | `2026-11-13` | niraberman | CONTRIBUTOR | No | LoRA habit adapters changed the agent's behaviour offline but not the live score: three mechanisms |
| [758954](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/758954) | `2026-11-13` | `2026-11-13` | akanksha2804 | CONTRIBUTOR | No | Scorer minutes: a toolkit to convert time caps between GPUs and measure run to run noise |
| [758953](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/758953) | `2026-11-13` | `2026-11-14` | shyjin | EXPERT | No | Are only November 9 submissions stuck in the queue |
| [758854](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/758854) | `2026-11-12` | `2026-11-14` | purnimapathak15 | CONTRIBUTOR | No | Harness pitfalls: no async functions in the code graph; bad skill names score 0.00 |
| [758821](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/758821) | `2026-11-12` | `2026-11-12` | ozgung | CONTRIBUTOR | No | Open code and data: agent configs, weight-editing library and held-out task sets (Gemma 4 E4B) |
| [758817](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/758817) | `2026-11-12` | `2026-11-13` | rathko | CONTRIBUTOR | No | Open toolkit for measuring noise in your agent runs |
| [758729](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/758729) | `2026-11-12` | `2026-11-12` | muhandalsaiari | CONTRIBUTOR | No | Public repo with our agent configs and run data |
| [758599](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/758599) | `2026-11-12` | `2026-11-13` | cryptozenith | CONTRIBUTOR | No | Submission stuck in "Notebook Running" for 3 days, blocking all new submissions (ID 58169362) |
| [758547](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/758547) | `2026-11-12` | `2026-11-12` | clanevil | CONTRIBUTOR | No | Skill-only bundle scores 0.00 on the leaderboard but resolves tasks in the harness's Docker mode locally. Do skill scripts run on the scorer? |
| [758289](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/758289) | `2026-11-12` | `2026-11-12` | foysalemonshanto | EXPERT | No | Does the scorer serve with the vLLM / swegemma / adk-submission versions from the wheelhouse dataset? |
| [758218](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/758218) | `2026-11-11` | `2026-11-11` | murugesann | EXPERT | No | How many of the 129 tasks are solved by the agentless 0.22 scorer? |
| [757993](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/757993) | `2026-11-11` | `2026-11-12` | kush1235 | CONTRIBUTOR | No | Kaggle notebook runtime issue |
| [757893](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/757893) | `2026-11-11` | `2026-11-11` | moshegolderson | CONTRIBUTOR | No | To the organizers: 5 concrete scorer fixes, plus an audited task list |
| [757783](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/757783) | `2026-11-10` | `2026-11-10` | acamachodepass | CONTRIBUTOR | No | Rules clarification — Using competition training examples on DeepInfra and RunPod (§4.b) |
| [757782](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/757782) | `2026-11-10` | `2026-11-10` | acamachodepass | CONTRIBUTOR | No | Exact wheelhouse and L4×4 runtime metadata for the Gemma 4 Developer Agent competition |
| [757661](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/757661) | `2026-11-10` | `2026-11-10` | larry54321zhao | EXPERT | No | Question about the scoring environment for the reference patches |
| [757626](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/757626) | `2026-11-10` | `2026-11-10` | xiaoz259 | MASTER | No | Probing the public/private split to reallocate time |
| [757588](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/757588) | `2026-11-10` | `2026-11-12` | harshitsama | EXPERT | No | I reran a public 0.24 bundle unchanged and got 0.17 (data and short paper) |
| [757564](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/757564) | `2026-11-10` | `2026-11-10` | clanevil | CONTRIBUTOR | No | Is in-sandbox testing (enable_sandbox_testing) on during scoring? |
| [757322](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/757322) | `2026-11-09` | `2026-11-09` | allankipruto | CONTRIBUTOR | No | Kernel Stopped working while running Evaluation then failure to submit to competition then failed to authorize session |
| [757244](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/757244) | `2026-11-09` | `2026-11-09` | gagandeep1 | CONTRIBUTOR | No | Clarification: Small Model Prize deadline |
| [757223](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/757223) | `2026-11-09` | `2026-11-09` | brejeshbalakrishnan | CONTRIBUTOR | No | Are LLM chat tools allowed for annotating our own agent trajectories? |
| [757149](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/757149) | `2026-11-09` | `2026-11-09` | songtaoshi | CONTRIBUTOR | No | Will agents get the contents of issue links and screenshots during offline evaluation? |
| [756963](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/756963) | `2026-11-08` | `2026-11-08` | moritzpaal | CONTRIBUTOR | No | Question regarding timelimits  |
| [756792](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/756792) | `2026-11-07` | `2026-11-17` | refresh2k | CONTRIBUTOR | No | Are hand-constructed LoRA adapters acceptable (weight edit from activation analysis, not gradient descent)? |
| [756693](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/756693) | `2026-11-07` | `2026-11-07` | tianchan11 | CONTRIBUTOR | No | Team merger: which score does the merged Team carry? |
| [756622](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/756622) | `2026-11-06` | `2026-11-07` | soumyadip007 | CONTRIBUTOR | No | How to get started with the solution development of this hackathon problem |
| [756607](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/756607) | `2026-11-06` | `2026-11-08` | hank0123 | CONTRIBUTOR | No | Team up: root cause of the edit_file old_string loss (+1-line fix) and a 286-task eval set — our GPU died, looking to merge before 11/25 |
| [756587](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/756587) | `2026-11-06` | `2026-11-06` | jasonwold | CONTRIBUTOR | No | Local evals: 27 public fastapi tasks can never pass in the sandbox |
| [756461](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/756461) | `2026-11-06` | `2026-11-06` | eutychusmugambi | CONTRIBUTOR | No | Gold patches fail |
| [756438](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/756438) | `2026-11-06` | `2026-11-06` | prathmeshadsod | EXPERT | No | How you guys considering time allocations |
| [756433](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/756433) | `2026-11-06` | `2026-11-06` | kamenriderfakchion | CONTRIBUTOR | No | Public code: configs, trajectories and analysis scripts for a Gemma 4 E2B agent failure study |
| [756400](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/756400) | `2026-11-06` | `2026-11-06` | manoharpapasani | CONTRIBUTOR | No | Audit: 61 of 129 public tasks can't tell agents apart (+ open configs and data) |
| [756336](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/756336) | `2026-11-06` | `2026-11-06` | murecerickman | CONTRIBUTOR | No | swegemma, which is built on Google’s ADK |
| [756315](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/756315) | `2026-11-05` | `2026-11-05` | krisshah123 | CONTRIBUTOR | No | Community resource: pytest-verified context-selection harness + gemma4-locbench-v1 (probe set) |
| [756051](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/756051) | `2026-11-05` | `2026-11-05` | joeqrq | CONTRIBUTOR | No | Tool-call serialization issue: edit_file repeatedly emitted without old_string |
| [756044](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/756044) | `2026-11-05` | `2026-11-05` | dxnnnnn | CONTRIBUTOR | No | Stuck pending / Notebook Timeout on g4da-submit-v2 — no Public Score, cannot resubmit |
| [755677](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/755677) | `2026-11-04` | `2026-11-10` | lucamassaron | GRANDMASTER | No | Scoring zero when using LoRA adapters |
| [755611](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/755611) | `2026-11-04` | `2026-11-04` | xiaoz259 | MASTER | No | Are the reported LoRA issues fixed? I don't see any updates. |
| [755554](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/755554) | `2026-11-03` | `2026-11-03` | aridiosilva2 | CONTRIBUTOR | No | [fastapi_14186] Task unresolvable: required test skipped due to @needs_pydanticv1 and Pydantic v2 setup |
| [755542](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/755542) | `2026-11-03` | `2026-11-04` | medohamza95 | CONTRIBUTOR | No | Sending public tasks to a hosted model provider: how should the Competition Data rule be read? |
| [755527](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/755527) | `2026-11-03` | `2026-11-04` | xiaoz259 | MASTER | No | The queue time should improve once the ARC-2 backlogs are cleared |
| [755391](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/755391) | `2026-11-03` | `2026-11-03` | banwait13 | CONTRIBUTOR | No | Important dataset inquiry for better model alignment |
| [755318](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/755318) | `2026-11-03` | `2026-11-03` | thefusioncube | CONTRIBUTOR | No | Why has my notebook been submitting for more than a day.  |
| [755291](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/755291) | `2026-11-03` | `2026-11-03` | xingling666 | CONTRIBUTOR | No | Where 76% of a 300-second agent budget actually goes (4 trace audits) |
| [755289](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/755289) | `2026-11-03` | `2026-11-03` | alexaaaaaaaaaander | CONTRIBUTOR | No | Fine tuning with Lora is the only way??! |
| [755183](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/755183) | `2026-11-02` | `2026-11-02` | murugesann | EXPERT | No | Why not cap submissions to once in two days |
| [755172](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/755172) | `2026-11-02` | `2026-11-02` | emanuelemiranda | CONTRIBUTOR | No | Public code of my entry: gemma4-swe-agent (Apache 2.0) |
| [755066](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/755066) | `2026-11-02` | `2026-11-02` | ssain18 | CONTRIBUTOR | No | Stage 1 of wrapper engineering: settings, budgets and lessons |
| [754895](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/754895) | `2026-11-02` | `2026-11-02` | allankipruto | CONTRIBUTOR | No | The copied kaggle notebook is actively running and i haven't started a session. How did you go about when  session hours are used by the system's Glitch and not the intended user |
| [754890](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/754890) | `2026-11-02` | `2026-11-02` | allankipruto | CONTRIBUTOR | No | The copied kaggle notebook is actively running and i haven't started a session |
| [754845](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/754845) | `2026-11-02` | `2026-11-02` | akanksha2804 | CONTRIBUTOR | No | Submission pending for 29+ hours |
| [754811](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/754811) | `2026-11-01` | `2026-11-02` | yashraj2308 | CONTRIBUTOR | No | anybody crossed 0.2 threshold |
| [754783](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/754783) | `2026-11-01` | `2026-11-07` | carlesoctav | CONTRIBUTOR | No | in EventsCompactionConfig: LlmEventSummarizer drops all tool calls and tool responses |
| [754636](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/754636) | `2026-10-31` | `2026-11-01` | murugesann | EXPERT | No | Request to Hosts: Fix Harness Continuation Nudge, Context Duplication & Compaction Bugs Breaking complex agent orchestrations |
| [754594](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/754594) | `2026-10-31` | `2026-10-31` | yu11yu | CONTRIBUTOR | No | Clarification: Are model adaptation methods other than LoRA allowed? |
| [754586](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/754586) | `2026-10-31` | `2026-10-31` | luxluxshan | EXPERT | No | Which public tasks cannot pass in the scorer's sandbox? Four questions about the grading image |
| [754295](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/754295) | `2026-10-30` | `2026-11-02` | harryzhanghr111 | EXPERT | No | Will private leaderboard evaluation use multiple runs to reduce variance? |
| [754023](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/754023) | `2026-10-30` | `2026-11-01` | m471051638 | CONTRIBUTOR | No |  stuck in 'Notebook Running'  |
| [754000](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/754000) | `2026-10-30` | `2026-11-18` | mohamedtkhalil1995 | CONTRIBUTOR | No | Stuck Submission |
| [753973](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/753973) | `2026-10-29` | `2026-11-09` | daiado | CONTRIBUTOR | No | [BUG REPORT] tool parser can loop forever on an array tool argument, freezing the inference server for the rest of the run |
| [752848](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/752848) | `2026-10-26` | `2026-10-31` | normannweuifohpq9 | CONTRIBUTOR | No | Why does nobody have a score of over 0.24? |
| [752693](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/752693) | `2026-10-25` | `2026-11-20` | cosmorin | CONTRIBUTOR | No | Interested in teaming up? Please read our public Gemma smoke-test Code first |
| [751596](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/751596) | `2026-10-22` | `2026-11-19` | munalsingh | CONTRIBUTOR | No | SFT / distillation LoRAs on Gemma 4 31B: loss falls a lot, solve rate doesn’t move. What would you try next? |
| [751311](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/751311) | `2026-10-21` | `2026-11-16` | pranshubahadur | EXPERT | No | Request to hosts: inference kernels |
| [751104](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/751104) | `2026-10-20` | `2026-11-07` | elanlearns | CONTRIBUTOR | No | 🌟Bonus Prize: Small Model Development ($10,000) |
| [750907](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/750907) | `2026-10-20` | `2026-11-07` | mehmoodzafar | CONTRIBUTOR | No | Looking for 1–2 teammates — TPU eval engine that matches the scorer + LoRA pipeline (0.17) |
| [750521](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/750521) | `2026-10-18` | `2026-11-01` | elhamdaouiabdelmajid | EXPERT | No | Different public scores from an identical submission ZIP - reproducibility question |
| [750490](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/750490) | `2026-10-18` | `2026-11-12` | murugesann | EXPERT | No | budget warning from harness - can it be given for all tool responses? |
| [749191](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/749191) | `2026-10-14` | `2026-11-03` | niraberman | CONTRIBUTOR | No | Question about LoRA |
| [748999](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/748999) | `2026-10-13` | `2026-11-08` | khmoezurrehman | CONTRIBUTOR | No | Looking for a team or team mates |
| [748287](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/748287) | `2026-10-11` | `2026-11-13` | ryanholbrook | STAFF | No | New Gemma 4 Models Available: 12B, E4B, and E2B |
| [747708](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/747708) | `2026-10-09` | `2026-11-03` | niraberman | CONTRIBUTOR | No | Submission stuck in "Running" for 30+ hours, blocking new submissions (pending limit) |
| [747519](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/747519) | `2026-10-08` | `2026-11-19` | herbison | STAFF | **YES** | Update on "Kaggle Error" Submissions & Queue Delays |
| [744566](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/744566) | `2026-09-30` | `2026-11-03` | veronikayaitskikh | CONTRIBUTOR | No | thinking_budget and seed are missing from HTTP requests in my wheelhouse test |
| [744354](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/744354) | `2026-09-29` | `2026-11-12` | wukeneth | EXPERT | No | Thinking mode drops the model's thoughts between tool calls (vLLM ignores `reasoning_content`). Will the scoring environment be patched? |
| [744272](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/744272) | `2026-09-29` | `2026-11-08` | whisperlast | CONTRIBUTOR | No | Tool results reach the model double-JSON-encoded: a line of code with quotes turns into a wall of backslashes |
| [743683](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/743683) | `2026-09-26` | `2026-11-11` | ryanholbrook | STAFF | No | Rerunning Failed Submissions |
| [743007](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/743007) | `2026-09-24` | `2026-11-19` | elanlearns | CONTRIBUTOR | No | Welcome to the Gemma 4 Developer Agent Competition |
| [742807](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/742807) | `2026-09-23` | `2026-11-04` | cnumber | GRANDMASTER | No | Clarification on distillation from external LLMs |

