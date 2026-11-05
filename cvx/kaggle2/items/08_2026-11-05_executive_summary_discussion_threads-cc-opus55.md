# COMBINED MARKDOWN - combine

_Generated 2026-11-05 17:23:02 | 6 files | folder: D:\stuff\docs\taylor_fv\github\rayrite.github.io\cvx\kaggle2\items\combine_

## Contents

1. 00_README-cc-opus55h.md
2. 01_Forum_Intel_2026-10-31_to_2026-11-05.md
3. 02_New_Test_Harnesses_and_Eval_Tools.md
4. 03_BCF_Impact_and_Actions.md
5. 04_Leaderboard_2026-11-05.md
6. 05_Raw_Forum_Digest_posts_since_2026-10-31.md

---

<!-- ====================================================================== -->
<!-- FILE: 00_README-cc-opus55h.md -->
<!-- ====================================================================== -->

# intel_20261105-2 — Gemma 4 Developer Agent: forum sweep since 2026-10-31

*Second, independent sweep, prepared on 2026-11-05. Data was captured from about 22:00 to 22:10 UTC, so it includes posts up to 21:46 UTC on 11-05. It does not reuse anything from `../intel_20261105/`; that folder is cross-checked in §3.*

## 1. Contents

| File | What it holds |
|---|---|
| [01_Forum_Intel_2026-10-31_to_2026-11-05.md](01_Forum_Intel_2026-10-31_to_2026-11-05.md) | Headlines, a register of all 36 threads, cross-cutting insights, and the watch-list |
| [02_New_Test_Harnesses_and_Eval_Tools.md](02_New_Test_Harnesses_and_Eval_Tools.md) | New local-eval harnesses, config checkers, diagnostic notebooks and public bundles |
| [03_BCF_Impact_and_Actions.md](03_BCF_Impact_and_Actions.md) | What each finding means for BCF-31B, BCF-S (E4B) and Track G, with actions A0–A9 |
| [04_Leaderboard_2026-11-05.md](04_Leaderboard_2026-11-05.md) | Public-LB tiers, medal lines and movers vs 10-31, plus the small-model board |
| [05_Raw_Forum_Digest_posts_since_2026-10-31.md](05_Raw_Forum_Digest_posts_since_2026-10-31.md) | Every post in the window, verbatim (images stripped) |
| `raw_json/topics/*.json` | 36 full threads with comment trees (`GetForumTopicById`) |
| `raw_json/topics_list.json`, `raw_json/manifest.tsv` | All 305 forum topics; per-thread counts of new posts |
| `raw_json/leaderboard_public.{json,csv}` | Public LB, 4,835 teams |
| `raw_json/kernels_*.json` | Code-tab listings (240 by creation date, 40 by score) |
| `raw_json/notebooks/` | 15 notebook sources (`.ipynb`) and text extracts |
| `scripts/` | `list_topics.py`, `fetch.py`, `render.py`, `lb.py`, `kernels.py`, `nb_fetch.py`, `md_only.py` |

## 2. Method

1. Called `GetTopicListByForumId` (forum 11630393) and walked all 16 pages, 305 topics. Kept every topic whose first post or last comment is dated on or after 2026-10-31 00:00 UTC: **36 topics, 22 of them new**.
2. Fetched each of those topics with its comments and rendered only the posts dated in the window. The renderer flags staff by author tier: **no staff posts were found in the window**.
3. Fetched the public LB and diffed it by team name against the 10-31 snapshot.
4. Listed the Code tab through `kernels.KernelsService/ListKernels` (body captured from the page). That gave 56 notebooks created since 10-31. We downloaded the sources of 15 that matter for evaluation or BCF, plus the pinned small-model board.
5. Checked the GitHub repos for the two public kits (`emamira02/gemma4-swe-agent`, `damsolanke/gemma4-swe-kit`) through the GitHub API. We read metadata and commit lists only and cloned nothing.

To rerun: `python scripts/list_topics.py && python scripts/fetch.py && python scripts/render.py && python scripts/lb.py`. Change `CUT` in `list_topics.py` and `render.py` for a new window.

## 3. Cross-check of `../intel_20261105/` (earlier sweep the same day)

The earlier brief covers the same threads; it has 35, and we found 36 because 748999 has a new reply at 21:46 UTC. Some of its key numbers do not match the raw data:

| Claim in `intel_20261105` | What the data shows |
|---|---|
| "4,375 teams (90.99 %) at 0.00"; "any score > 0 is top 9 %" | **173 teams (3.6 %) are at 0.00.** The median is 0.15 and 4,662 teams score above zero |
| Medal lines "Bronze ≈ rank 433 at 0.01, Silver 0.05" | LB `medal` field: gold ranks 1–19 (0.22), silver 20–241 (0.20), bronze 242–483 (0.18) |
| "Six teams at 0.22" | **66** teams at 0.22 and 76 at 0.22 or above |
| "Yurnero breaks the 0.24 plateau" (presented as new) | Yurnero was already #1 at 0.29 on 10-31 (last submission 10-29); no change in the window |
| "Yurnero confirmed LoRA is viable and state of the art" | Yurnero wrote only that a score above 0 with an adapter "is possible". There is no evidence that his 0.29 uses LoRA, and nobody has shown a LoRA gain |
| "4,808 teams" | 4,835 at our capture, a few hours later |

Its thread summaries (tool bugs, unsolvable tasks, queue reports) agree with ours in substance. Its recommended countermeasures are its own inferences.

## 4. Key points

1. No staff or host replies since 10-15, so every open question stays open (01 §1.1).
2. The parser hang reproduces on short, ordinary `run_skill_script` arguments, which is BCF's skills path. Move the helpers to `run_command` (03 A1).
3. The scorer runs about 1.6–1.7× slower than a local Blackwell GPU. The common 8 min / 28-call config now sits at the 12 h edge, so use 7 min (03 A2).
4. With one pending slot and an 18–32 h queue, the 31B and E4B tracks share about 15–20 scored results until 12-02 (03 A3–A4).
5. Coolyvision has no scored entry yet (03 §0).
6. The small-model board top is still 0.10 (12 teams). BCF-S's target of 8/58 would lead (04 §5).


---

<!-- ====================================================================== -->
<!-- FILE: 01_Forum_Intel_2026-10-31_to_2026-11-05.md -->
<!-- ====================================================================== -->

# 01 — Forum intel, 2026-10-31 to 2026-11-05

*Captured 2026-11-05 at about 22:05 UTC. The window is every post dated 2026-10-31 00:00 UTC or later. Tags: **[STAFF]** = Kaggle or Google staff, **[COMM]** = a participant's claim (not verified by us), **[ours]** = our inference. "k/58" means tasks solved on the 58-task public split.*

## 1. What changed this week

1. **No staff or host posted anywhere on the forum in the window.** Across all 36 active threads, the newest staff comment is dated 2026-10-15 (Holbrook, 749191). The newest known host ruling is still 10-24 (better of two finals, 752220). Every question below is unanswered. **[STAFF-silence, verified]**
2. **The vLLM tool-parser hang now hits ordinary skill-script arguments.** MarchFederico (LB 123) reproduced endless loops on inputs such as `args:["Optional[int]"]` and `args:["run","x = a[0]"]`. In about 830 local tasks with `run_skill_script` agents they saw two server freezes, one at 26.7 GB before an OOM kill. The upstream fix is vLLM PR #41991 (merged 8 May). Nobody knows whether the scorer will get it (753973). **[COMM]** This matters most for BCF; see 03 §1.
3. **Identical bytes give very different scores, and some runs never score.**
   - fan yunsheng: one ZIP (same sha256) scored 0.18 and then 0.01. Both runs "completed" (750521).
   - Alex Ust: the public "LB 0.24" bundle, resubmitted byte for byte, ran over 12 h and got no score. The same bundle with a 7-minute cap scored 0.15 (notebook *One Bundle, Three Outcomes*).
   - Yurnero (LB 1): Kaggle will not average several runs; "making your solution stable is one of the intended challenges" (754295). **[COMM]**
4. **LoRA loads and scores, but it is slower.** Kapil Chopra: a rank-16 adapter served as `main_lora` "completed, no score" (12 h overrun) at 8 min / thinking 4096. Each step used about 45 % more tokens and each task took about 29 % longer. At 6 min / 2048 it scored 0.17, the same as the team's baseline without an adapter. Luca Massaron (GM) got 0.00 with two adapters and 0.18 without one. Yurnero and Ankith Savio say a non-zero LoRA score is possible (755677). **No one has shown a LoRA gain over the same bundle without an adapter.** **[COMM]**
5. **Queue times are 18–32 h.** A run can sit at "Notebook Running" or "Pending" with no cancel button. Because each team may have only one pending submission, a stuck run blocks the team (756044, 755318, 754845, 754023, 747708, 747519, 743683). One run that ended as "Notebook Timeout" had produced a valid `submission.zip`; the team opened support ticket 271265. **[COMM]**
6. **The public cohort converges on one config family.** Single `LlmAgent`, 6 tools, 28 calls, 8 min, 240–300 s per command, 8192 output tokens, 4096 thinking. Two notebooks show that this 8-minute cap now sits at the 12 h edge (see §3.3). **[COMM]**

## 2. Thread register (36 threads with new content)

New topics are marked ★. Full text is in [05_Raw_Forum_Digest](05_Raw_Forum_Digest_posts_since_2026-10-31.md).

### 2.1 Harness and tool bugs

| ID | Topic | Key content | Status |
|---|---|---|---|
| 753973 | Tool parser loops forever on an array argument | MarchFederico gives 5 reproducing strings, 2 freezes in about 830 tasks, and the upstream fix (#41991). They ask the hosts to say whether the scorer gets the guard. cc (LB 913): "encountered this twice" | Open, no staff reply |
| ★756051 | `edit_file` emitted without `old_string` | 31B on swegemma 0.2.11: 51/51 calls in one run lacked `old_string`. In each, `new_string` ended in a stray backtick followed by `,old_string:`, and a stray key named after a source line. 34 turns had byte-identical text. Seen in 5 runs: three never recovered, two recovered later | Open |
| ★754783 | `LlmEventSummarizer` drops tool calls | Compaction reads only `part.text`. `function_call` and `function_response` parts are skipped, so the summary says "no actions made yet" | Open |
| ★754636 | SequentialAgent restarted by nudges; context duplication | A continuation nudge restarts `sub_agents[0]`. Stage 2 repeats 10–12k tokens of Stage 1, which hits the 14,336-token compaction threshold after 1–2 calls. One budget covers the whole pipeline. MrMadsheep (LB 119) says fixing this now would be unfair | Open |
| 744566 | `thinking_budget` and `seed` missing from HTTP requests | Veronika re-tested on wheelhouse v28: both now reach vLLM (`thinking_token_budget`), and thinking budgets apply on GPU | **Resolved** in v28+ **[COMM]** |

### 2.2 Task validity (public split)

| ID | Topic | Key content |
|---|---|---|
| ★755554 | fastapi_14186 cannot be resolved | Its required tests carry both `@needs_pydanticv1` and `@needs_pydanticv2`. `deduplicate_wheels` installs only pydantic 2.13.4. rich_3486 has the same problem (`skipif` < 3.11 vs ≥ 3.11) |
| ★754586 | Which public tasks fail in the scorer's sandbox? | The gold patch fails on 8 requests tasks (6589, 6592, 6629, 6757, 7328, 7433, 7502, 7505) under Docker `network_mode none` (Errno 101). It also fails on fastapi_14186, rich_3486 and rich_3472 (Python 3.13 changed an AttributeError message). Asks for the pytest pin, the sandbox backend, and whether hidden tasks carry FAIL_TO_PASS lists |
| 752848 | Why nobody beats 0.24 | Nir Aberman: unsolvable cases are an artefact of the public environment, not of the hidden set. In 163 runs the gold file was opened by call 2–3 in about 84 % of runs. The first edit came at about 106 s in solved runs and 183 s in failed ones; prompt rules to edit earlier were mostly ignored |

Consensus from three independent harnesses: gold patches pass on **127/129** public tasks in a scorer-like sandbox. The two failures are fastapi_14186 and rich_3486. The 8 requests failures appear only with Docker and no network (see 02).

### 2.3 LoRA and model adaptation

| ID | Topic | Key content |
|---|---|---|
| ★755677 | LoRA scores 0.00 | See §1.4. Luca Massaron found that PEFT needs a monkey-patch for `Gemma4ClippableLinear`. Kapil's test: if a run comes back "complete, no score", the cause is time; if it is 0.00, the cause is loading |
| ★755611 | Are the LoRA issues fixed? | Unanswered (slower decoding, shorter context) |
| 749191 | Question about LoRA | Jane: scored 0.08 with a rank-16 adapter. Asks whether the adapter was really active (743508: weights reset by duplicate decoder-layer registration). The submission page shows 61 KiB for a 467 MiB ZIP |
| ★754594 | Methods other than LoRA allowed? | Asks about full fine-tunes, merged checkpoints, DoRA and IA³. Unanswered |
| ★755289 | Is LoRA the only way? | Alex Wang lists 19 failure patterns and 5 environment problems (E1–E19, V1–V5). Prompt rules did not fix behaviour problems (E1, E8, E10–E15, E17, E18). Config and tool problems were fixable (E2–E7, E9, E16, E19) |

### 2.4 Rules (all unanswered)

| ID | Question |
|---|---|
| ★755542 | May public tasks go to a hosted model API (Ollama Cloud, OpenRouter)? May the wheelhouse sit on Colab or Google Drive? May a third-party coding assistant read task text or traces? |
| 742807 | Max Ma asks the same about DeepSeek. TheFusionCube (participant, not staff) says "free to do whatever you like" |
| ★755391 | Are the hidden repos outside fastapi, rich, httpx and requests? No answer |

### 2.5 Studies and budgets

| ID | Author (LB) | Key numbers |
|---|---|---|
| ★755066 | Sukhendu Sain (1246) | 376 local attempts on 40 tasks with 31B. Temperature 0 vs 1 tie (7/10 vs 7/10; 11/21 vs 12/21). Thinking 2k vs 4k tie. top-p 0.5 is worse (3/10 vs 6/10). Every success finished within 45 model requests. All 24 commands over 120 s failed. Next config: 10 min, 50 requests, 120 s per command |
| ★755291 | XingLing (2037) | 12B traces: 76 % of time is decode at 17.25 tok/s (dt = 0.78 + 0.058·tokens). `read_file` truncates at 150 lines. Treat any step over 60 s as a prompt bug. Includes a config checker notebook (see 02) |
| ★755172 | Emanuele Miranda (1767) | Public repo `emamira02/gemma4-swe-agent` (Apache-2.0), bundles S1–S18 (see 02) |
| 750907 | Mehmood Zafar (1199) / YosQuant (698) | YosQuant: prompt and thinking variants v1–v6 all scored 11–12/30 (noise). The main failures were wrong patches and the tool-call cap |
| 748287 | SANIDHAYA SHARMA | 10 min and 60 calls per task ran out of time (Notebook Timeout); the run averaged 6.3 min per task locally |

### 2.6 Queue and platform

| ID | Content |
|---|---|
| ★756044, ★755318, ★754845, 754023, 747708, 747519, 743683 | Pending or "Running" for 17–32 h. Some runs never score. No cancel control. The one-pending limit blocks new submissions |
| ★755527 | xz suggested the ARC-2 backlog causes the delay, then wrote "I might be wrong" |
| ★755183 | Proposal: allow one submission per two days but no queue |
| ★754890, ★754895 | Copied Getting Started notebook ran on its own and used up GPU quota (30 h per week) |
| ★754811 | Anyone above 0.20 with prompts only? Answer: "the best public notebook… very unstable" |
| 748999 | Team-up message (no intel) |

## 3. Cross-cutting insights

### 3.1 Finding the file is solved; the fix is the bottleneck
Four independent sources agree. Nir Aberman: gold file opened by call 2–3 in about 84 % of runs. Mehmood Zafar: right file in about 90 %, losses are wrong or incomplete fixes. Alex Wang: E10/E11 (analysis without editing; incomplete fix). prvsiyan: **54 % of control runs ended with an empty patch** (24 tasks, 31B). **[COMM]** Solved runs make their first edit about 75 s earlier than failed ones.

### 3.2 Thinking matters on 31B; sampling knobs mostly do not
- Ayush Thakur's controlled run on 129 tasks (cited by Abhimanu Bhagwati): thinking on 48, off 23.
- prvsiyan: thinking returned 3/24, not returned 1/24.
- Temperature, thinking 2k vs 4k, and output 6k vs 8k all tie within noise (Sukhendu Sain, YosQuant, XingLing).
- One knob is a trap: `max_output_tokens` below about 2048 truncates tool JSON. Thinking shares the output allowance.

**[COMM]**

### 3.3 The 12-hour wall is the main avoidable loss
- **Hidden-run size.** Participants (Alex Ust, Sukhendu Sain, Kapil Chopra) assume about 120 hidden tasks; staff have not confirmed this. If true, the private split is about 62 tasks.
- **Scorer speed.** Alex Ust fitted a scorer slowdown of k ≈ 1.6–1.7 against an RTX PRO 6000 running 3 tasks at once. At that speed an 8-minute cap needs about 12 h; a 7-minute cap leaves about 40 min spare and costs at most one solved task in 30.
- **Hardware inflation.** Abhimanu Bhagwati: an A100 is about 1.4× faster than 4×L4, so local scores "looked better than the leaderboard".
- **Call caps.** Raising `max_tool_calls` above 28 adds wall time: 40 calls at 8 min timed out.

### 3.4 Silent configuration traps
These come from swegemma source, quoted by XingLing and pablodiegoo **[COMM]**:

| Trap | Effect |
|---|---|
| `max_tool_calls < 20` | No `budget_warning` is ever sent. At 28, warnings start at call 18; at 25, at call 15 |
| `timeout_seconds` | Limits a single command, not the task. Keep it below `max_time_minutes × 60` |
| Declaring graph tools | Declaring any graph tool injects a "Code Intelligence Tools… use these for fast navigation" paragraph into the prompt |
| `read_file` cap | Truncates at 150 lines / 10,000 characters. Use `grep -n` plus `start_line`/`end_line` |
| `submit_patch` | Optional: the harness diffs the workspace either way. Several bundles add a "submit once, then reply `Done.`" rule to stop calls after the patch |

### 3.5 Multi-stage ADK pipelines are effectively dead
The harness has three problems for them:
- A continuation nudge restarts the first stage.
- Compaction is lossy and cannot be configured.
- One shared budget covers every stage.

Public evidence (754636; pablodiegoo: about 416 s per task for Coder + Analyzer) favours a single `LlmAgent`. **[COMM]**

## 4. Watch-list (open items to re-check)

| # | Item | Why it matters | Where |
|---|---|---|---|
| W1 | Does the scorer get the parser guard (#41991)? | Decides whether array-argument tools (`run_skill_script`) are safe | 753973 |
| W2 | Any staff reply on runs that complete with no score or near-zero scores | Rescoring; per-task logs | 750521, 756044 |
| W3 | Official hidden-task count and backend (Docker vs subprocess, pytest pin) | Time budget; requests tasks | 754586 |
| W4 | LoRA alternatives and whether adapters are active | Track G | 754594, 749191 |
| W5 | Competition-data use with hosted APIs | Distillation data | 755542, 742807 |
| W6 | Queue latency trend | Slot plan (03 §4) | queue threads |
| W7 | Paper-track deadline 11-12 | Several paper notebooks and repos are appearing | — |


---

<!-- ====================================================================== -->
<!-- FILE: 02_New_Test_Harnesses_and_Eval_Tools.md -->
<!-- ====================================================================== -->

# 02 — New test harnesses, eval kits and diagnostic notebooks (since 2026-10-31)

*Sources: forum threads, the competition Code tab (56 notebooks created on or after 10-31; list in `raw_json/kernels_DATE_CREATED.json`), and the GitHub API. Notebook sources we read are saved in `raw_json/notebooks/` (`.ipynb` plus a text extract). We read them but did not run them. Licences are as the authors state them.*

## 1. Local evaluation harnesses (run an agent, grade like the scorer)

| Name / link | Author | First seen | What it does | Value for BCF |
|---|---|---|---|---|
| **g4-swe-evalkit** — [gold gate notebook](https://www.kaggle.com/code/kirillpshinnik/g4-swe-evalkit-gold-gate) (dataset `kirillpshinnik/g4-swe-evalkit`) | Kirill Pshinnik | 11-03 | A parameterised runner (`runner/eval_runner.py`, `params.json` with `arms`, `subset`, `pool`, `gold`/`empty` controls, `scorer_env`, `sandbox_python: cp313`, `concurrency`, `deadline_hours`). Builds on Zbigniew Kirchner's scorer-like sandbox datasets. The CPU gold gate reproduces 127/129. Deletes hidden outputs before saving. Apache-2.0 | **High.** Shows an A/B design with arms and controls that BCF Lab could copy. The gold/empty controls validate a sandbox before an agent runs |
| **Gemma 4 Agent: Run Your Agent Locally** — [notebook](https://www.kaggle.com/code/abhimanubhagwati/gemma-4-agent-run-your-agent-locally) | Abhimanu Bhagwati | 11-04 | Runs two bundles A/B on the same tasks on Kaggle 4×L4 with the real swegemma harness, then grades in a clean Python 3.13 / pytest 8.4.2 venv per task (a copy of `docker/Dockerfile.sandbox`). Picks tasks stratified and seeded, from those whose gold patch passes. Runs `validate_directory` on both bundles | **High.** It runs on real L4 hardware and so calibrates our 5090 numbers. Findings: no-thinking is 3.3× faster with the same 3/12; an A100 is 1.4× faster than 4×L4 |
| **gemma4-swe-agent** — [GitHub](https://github.com/emamira02/gemma4-swe-agent) (755172) | Emanuele Miranda | 11-02 (repo created 10-09, last push 11-03) | Frozen bundles S1–S18 with zip SHAs, an in-container localisation skill, a **single-argument heredoc editor**, dev-panel and failure-analysis code, and a paper write-up. Apache-2.0. The last commit queues "PUB1 (public Budget-Aware v2 V10, verbatim)" | **Medium.** The heredoc editor removes the multi-key `edit_file` failure (756051). Review it before reuse (third-party code) |
| **Deterministic empty-patch control v2 (CPU)** — [notebook](https://www.kaggle.com/code/bivelio/deterministic-empty-patch-control-v2-cpu) | Joan-Marc Fisa (BiVelio) | 11-05 | A scripted OpenAI-compatible driver stands in for the LLM: one retrieval call, then an empty patch. Official wheels on Python 3.12, CPU only | **Medium.** A fake-LLM harness smoke test, like gemma4-swe-kit's fake-llm. Checks wiring and verification without a GPU |
| TPU eval engine (750907) | Mehmood Zafar | 10-20 OP, new reply 11-01 | Gemma 4 31B on vllm-tpu, Kaggle TPU v5e-8. Matches GPU runs (21 vs 21–22 of 51). Also a LoRA self-distillation pipeline verified to load in the scorer's vLLM | Low (BCF has the 5090 and rented GPUs). Shows a free TPU quota path |
| Two-worker 4×L4 study harness (755066) | Sukhendu Sain | 11-02 | Two isolated workers with full request, tool, patch, grading and timing capture; 376 attempts. Uses Dmitrii Gluzdov's task-soundness audit **v10** dataset to pick tasks | Low (no code). Its method and numbers are useful |

## 2. Diagnostics and config checkers

| Name | Author | Date | Content | Value for BCF |
|---|---|---|---|---|
| [Same 8 minutes, scores from 0.05 to 0.20](https://www.kaggle.com/code/xingling666/same-8-minutes-scores-from-0-05-to-0-20) | XingLing | 11-03 | A **config checker** you can run on your own `agent.yaml` / `eval_config.yaml`. It flags calls below 20 (no budget warning), `timeout_seconds` vs session length, output below 2048, declared graph tools, and the `read_file` 150-line cap. Also shows where the warning starts for each `max_calls` | **High.** Add its checks to the BCF pre-flight (03 §2) |
| [A 300-second budget is 5,000 output tokens](https://www.kaggle.com/code/xingling666/a-300-second-budget-is-5-000-output-tokens) | XingLing | 11-03 | Splits trace time into decode and prefill on L4: dt = 0.78 + 0.058·tokens (r² = 0.9996). CPU, 20 s | Medium. A token-to-seconds conversion for budget planning |
| [One Bundle, Three Outcomes: 0.24, 0.17, No Score](https://www.kaggle.com/code/alexust/one-bundle-three-outcomes-0-24-0-17-no-score) | Alex Ust | 11-03 | 101 local runs on an RTX PRO 6000 (vLLM 0.19.1, concurrency 3), with embedded CSV data. Projects the hidden run by scorer slowdown k (k ≈ 1.6–1.7) and gives a cap table (8 / 7 / 6 min) | **High.** Ready-made method to turn 5090 timings into a 12 h projection |
| [Where Gemma 4 agents lose their patches](https://www.kaggle.com/code/prvsiyan/where-gemma-4-agents-lose-their-patches) | prvsiyan | 11-04 | 24 tasks × 4 sampling arms + a prompt A/B. **54 % empty patches** in control; 0 context overflows in 96 runs. Records the full serving config (compaction interval 15, overlap 2, threshold 14336) | Medium. Empty patches, not context, are the loss |
| [what's in the bundle?](https://www.kaggle.com/code/prvsiyan/what-s-in-the-bundle) | prvsiyan | 11-01 | Inspects public bundles | Low |
| [Gemma 4: Public Agent Ideas and Evidence](https://www.kaggle.com/code/dmitriigluzdov/gemma-4-public-agent-ideas-and-evidence) | Dmitrii Gluzdov | updated 11-03 | A map of public ideas, measured public runs, a paired local screen, and "were the added tools used?" | Medium. Use it as a reading index |
| [Gemma 4 Paper: L4 Decode Law & 12-Call Cliff](https://www.kaggle.com/code/pablodiegoo/gemma-4-paper-l4-decode-law-12-call-cliff) | Pablo Diego Pereira | 11-05 | Claims a pass rate of 52 % within 12 calls vs 4.7 % at 14 or more, and 4 "silent harness traps" | **Low credibility.** Its task table lists django and sympy rows, yet the notebook's own load prints "129 rows across 4 repositories". The 12-call cliff is likely selection (hard tasks run long). Use only the traps that XingLing confirms |

Also referenced, not fetched (created before 10-31): *Same Bytes, Two Scores* (Victor Zhong), *Most-Run Public Config Averages 10/58* (dariushafshar), *Do Gold Patches Pass Locally?* (Zbigniew Kirchner; the sandbox under both new harnesses).

## 3. Benchmarks for finding the right file (new this week, low priority for BCF)
*Where is the bug? File-finding methods compared* (10-31), *Gemma 4 SWE Localization Benchmark* (11-01), *graphloc* (11-01), *LocBench + findfile* (11-03), *Where to Look* (11-04), *Localising Before Patching* (11-05), and *Call-Graph Blast Radius* (11-04). Gemma4 Zero Bloat Repo Agent (11-05) cites "BM25 49 % vs graph tools 33 % file Recall@10" from these. Agents already find the gold file in about 84–90 % of runs (01 §3.1), so these add little.

## 4. Existing kits: status check

| Kit | Status on 11-05 | Note |
|---|---|---|
| gemma4-swe-kit (damsolanke) | Last push **10-19** (`a9270ed0`), no change in the window | Our review was at `42b473e` (10-02). Later commits add a parser-hang fuzz script, `g4kit-canary` (checks that a served adapter changes logits), MLX/TPU LoRA tools and `--mask-error-turns`. **The canary answers 749191's question locally.** Diff-review it before any pull |

## 5. Public bundles at the top of the Code tab (sorted by score)

| Score | Notebook | Note |
|---|---|---|
| 0.22 | Igor Zharov — *Budget-Aware Coding Agent v2* | 510 votes. The most-copied lineage ("V10") |
| 0.20 | prvsiyan — *Shape of Doubt*; AlekseiProvorov — *Score To*; sont — *SuperAgent Reproduction*; Navya — *T8 Static* (3 tools, thinking 256); Victor Zhong — *submission-pack v8/v10*; shimauchu — *Davis v19 Temp04* | shimauchu changes only temperature 0.2 → 0.4 on Davis v19 (author's claim: 0.22) |
| 0.18 | honghanhhh — *Baseline \| LB 0.24* | One draw scored 0.24; a byte-identical resubmit ran out of time (Alex Ust) |

181 of the 610 teams that joined since 10-31 already score at least 0.17, many with 1–4 entries. **[ours]** Public notebooks therefore set a floor of about 0.17–0.22.


---

<!-- ====================================================================== -->
<!-- FILE: 03_BCF_Impact_and_Actions.md -->
<!-- ====================================================================== -->

# 03 — What this week's intel means for BCF

*Baseline: the BCF-v1 (31B) design, the BCF-S roadmap ([03 roadmap](../../../2026-10-27_Forum_Intel_and_Small_Model_Bonus/03_BCF_Small_Model_Bonus_Roadmap.md)), the decisions of 10-27 ([05](../../../2026-10-27_Forum_Intel_and_Small_Model_Bonus/05_Decisions_GPU_Budget_and_LoRA_Tracks.md)), and the S0 bundle in `2026-10-27_Handoff_to_5090/S0_bundle/`. Tags as in 01. The actions are recommendations; none has been applied.*

## 0. Status flag

**Team Coolyvision is not on the public leaderboard** (snapshot 11-05, about 22:05 UTC; no team or leader name matches "cooly"). So neither the S0 anchor (planned for 10-28/29) nor BCF-v1 has scored. Either nothing was submitted yet, or a run is stuck in the 18–32 h queue. Check *My Submissions* on Kaggle first. If a run is stuck, it blocks the team's only pending slot (01 §1.5).

## 1. Critical: the skill-script path can freeze the whole scoring run

BCF-v1 runs its helpers through `run_skill_script`, which takes an **array** argument (`args`). Our 10-27 notes already said "never pass the issue text or the spec through `args`". The new reproductions (753973) show that this rule is **not enough**: short, ordinary arguments also hang the scorer's vLLM 0.19.1 parser whenever an element contains `]` or `[` and is not wrapped in `<|"|>`:

```
args:["Optional[int]"]     args:["run","x = a[0]"]     x:[a<|"|>]
```

The parser runs inside the API server, so one hang stalls every later task. That fits the 0.18 → 0.01 pattern on identical bytes (750521). The hosts have not said whether the upstream guard (#41991) will be applied.

**Action A1 (do before any BCF-31B submission):** do not use array-argument tools at all.
- Put the BCF helpers behind `run_command`. Its `command` is a single string, which this parser bug does not touch. For example: `python .git/bcf/bcf.py check …`, with inputs read from files rather than from argv lists. Keep the helper files in `.git/bcf/` so they never reach the diff.
- Drop `run_skill_script` from the tool list. This also settles open item D18 (skill-call budget cost).
- In the local lab, apply a parser guard like #41991 on a *separate* server config. Keep the unpatched parser for scorer-faithful runs, and count hangs in P0 traces.

## 2. Pre-flight additions (from the XingLing and pablodiegoo source audits)

Add these checks to the roadmap's §7 pre-flight checklist. The S0 values below come from `S0_bundle/submission/`.

| Check | Rule | S0 today | BCF-31B |
|---|---|---|---|
| `max_tool_calls` | ≥ 20, or `budget_warning` never fires | 24 ✓ | ≥ 20 |
| `timeout_seconds` | Below `max_time_minutes × 60`; about 120 s is enough (all 24 commands over 120 s failed, 755066) | 120 of 300 ✓ | ≤ 240 |
| `max_output_tokens` | ≥ 2048. Thinking shares this allowance, so leave room for the edit | 4096 / think 1024 ✓ | 8192 / 4096 is the cohort default |
| Graph tools | Do not declare them; declaring them injects a "use these" prompt paragraph | none ✓ | none |
| Array-argument tools | None (A1) | none ✓ | **remove `run_skill_script`** |
| Prompt states the budget | The numbers must match `eval_config.yaml` (the harness appends its own budget text) | check `system.md` | check |
| Stop rule | "Submit once, then reply `Done.`". `submit_patch` is optional: the harness diffs the workspace anyway | check | add |
| Scratch files | Never in `/workspace`, because the diff picks them up | `.git/bcf/` ✓ | ✓ |

Running XingLing's checker notebook on each bundle gives a quick, no-GPU second opinion.

## 3. Time budget: re-derive with a scorer-slowdown factor

- The community projects about 120 hidden tasks in 12 h, with sandbox setup counted (not confirmed by staff).
- Alex Ust measured the scorer at **k ≈ 1.6–1.7× slower** than an RTX PRO 6000 running 3 tasks at once with vLLM 0.19.1.
- The RTX 5090 uses the same GB202 chip class, so **[ours]** treat k = 1.6–1.8 as the planning range for 5090 timings at concurrency 3. Re-fit it once BCF has one scored run with known local timings.
- An A100 is about 1.4× faster than 4×L4 (Abhimanu Bhagwati), so local pass rates measured at the same `max_time_minutes` overstate scorer results. Compare arms at **equal scorer-equivalent time**, i.e. local cap = scorer cap ÷ k.

**Action A2:** project every bundle as Σ min(k·agent_s, cap) + setup, scaled to 120 tasks, at k = 1.6, 1.7 and 1.8 (the formula in Alex Ust's notebook). Keep the roadmap's ship rule of **≤ 10.5 h at k = 1.8**. For a 31B bundle in the public style this points to **7 min / 28 calls**, not 8 / 28. Never go above 28 calls at 8 min: 40/8 ran out of time. For an E4B bundle, measure first: E4B is faster per token but takes more steps.

**LoRA adds about 29 % time** (Kapil Chopra). Any Track G bundle must pass A2 with that factor included.

## 4. Submission slots: the one-pending limit dominates

- Queue plus run is now 18–32 h, and each team may have **one** pending submission at a time. So the 31B track and the E4B track share **one** pipeline: about 1 scored result per 1–1.5 days, or roughly **15–20 results in total from 11-06 to 12-02**, fewer if a run gets stuck. A stuck run has no cancel button; only Kaggle support can clear it (ticket route, 756044).
- **Action A3:** rebuild the roadmap §6 slot plan as one shared queue. Suggested order:
  1. S0 anchor (E4B, eligibility).
  2. BCF-31B v1 after A1.
  3. Alternate the tracks after that.
- **Action A4:** move the "last submission" date from 11-29 to **11-27/28**. A 32 h queue plus a 12 h run leaves almost no recovery time before the 12-02 23:59 UTC deadline. Both intended finals should have **scored** by about 11-30.
- One draw is ±2–3 tasks, and identical bytes have given 0.24, 0.17 and no score. Plan at least two draws of each final candidate. The variance includes **timeouts**, which score zero, so time margin (A2) is the cheapest way to cut variance.

## 5. Where to spend effort: making the fix right, not finding the file

Four sources agree that the gold file is found in about 84–90 % of runs. The losses are wrong or incomplete fixes and **empty patches (54 % in one 24-task control)**. Solved runs edit about 75 s earlier. Prompt rules to "edit earlier" were mostly ignored (Nir Aberman, Alex Wang). Thinking on is worth about 2× on 31B (48 vs 23 of 129). Temperature and 2k vs 4k thinking make no measurable difference.

**Action A5 [ours]:**
- Give `bcf-locate` lower priority. Shift S1/S2 effort to `bcf-check` (reproduce, then focused test) and to an **anytime patch**: make sure a minimal candidate edit exists before about 60 % of the cap, because the harness diffs whatever is in the workspace.
- Keep thinking on for 31B.
- Stop tuning temperature.

**Action A6 (malformed `edit_file`, 756051):**
- Add a prompt rule: after "mandatory input parameters are not present", never resend the same call. Switch to the BCF single-argument replace helper instead (a heredoc through `run_command`, the pattern in `emamira02/gemma4-swe-agent`).
- Avoid backticks in `new_string`.
- This matters even more for E4B, which already tends to rewrite whole files (750974).

## 6. Context and compaction

The compaction summariser ignores tool calls and tool results (754783). Compaction starts at about 14,336 tokens and cannot be changed. One 24-task study saw no context overflow at all, so the loss happens quietly after compaction, not as an error.

**Action A7:**
- In P0 traces, count how often compaction fires and how often the agent re-reads or restarts after it.
- If it fires often: read narrow ranges (`grep -n` first, then `start_line`/`end_line`; `read_file` stops at 150 lines), never restate a file in a reply, and keep helper output short.
- Stay with a **single `LlmAgent`**. Multi-stage ADK pipelines break under the nudge, compaction and shared-budget behaviour (754636).

## 7. Small-model bonus (BCF-S)

- The small-model board (updated 11-04 23:57 UTC) still tops out at **0.10 (6/58)**, but **12** teams now share it; ranks 13–67 sit at 0.08.
- Main-board contenders are hedging with E4B entries: tammam alasha (main 0.24) shows 0.06 and Panagiotis Anagnostou (main 0.22) shows 0.08.
- E4B with LoRA stayed at 0.01–0.05 over 6 versions; E4B without an adapter was cited at 0.06 (XingLing cohort).
- **[ours]** The roadmap target of ≥ 8/58 (0.13) would still lead. Getting S0 on the board is the urgent step, because only a submission that has scored can be selected.

## 8. LoRA Track G

- The adapter path works on the scorer, but there is **still no public evidence of a gain** over the same bundle without an adapter (0.17 vs 0.17; 0.00 vs 0.18).
- Adapters cost about 29 % in time.
- A run that ends "complete, no score" points to a time overrun; a 0.00 points to a loading problem.

**Action A8:**
- Keep the 11-22 merge rule.
- Before spending any shared slot on Track G, require a local held-out gain of ≥ +3 tasks **at equal scorer-equivalent time**.
- Check that the served adapter changes the logits (gemma4-swe-kit `g4kit-canary`, after a diff review from `42b473e` to `a9270ed0`).

## 9. Rules exposure (no rulings yet)

755542 asks two things:
1. Whether public task text may go to hosted model APIs.
2. Whether a **third-party AI coding assistant may read task text, traces or the provided code**.

Point 2 describes this project's own workflow. Rule 4 bars making Competition Data "available to any party not participating". 742807 allowed external models for synthetic data "in line with their license terms", but did not cover sending them Competition Data.

**[ours]** This is unresolved, and your 10-27 decision not to post questions to the hosts stands. Lower-risk options:
- Keep LoRA data generation on our own tasks (FreshSWE-Py / OOD) and Gemma-to-Gemma runs, which the roadmap L1(a) already does.
- Watch 755542 for a staff answer (watch-list W5).

## 10. Local benchmark denominators

Three harnesses agree that gold patches pass on 127/129 public tasks; the two failures are fastapi_14186 and rich_3486. Our **Dev-127** set matches. If BCF Lab grades with Docker and `network_mode none`, also exclude the 8 requests tasks that need a network (754586), or grade them with the subprocess backend. rich_3472 fails only on Python 3.13.

## Summary of actions

| # | Action | Priority | Owner / when |
|---|---|---|---|
| A0 | Check *My Submissions*: has S0 or BCF-v1 been submitted, and is a run stuck? | **Now** | User |
| A1 | Remove `run_skill_script` and array-argument tools; run helpers through `run_command` | **Before the next 31B submission** | BCF-v1 build |
| A2 | 12 h projection at k = 1.6 / 1.7 / 1.8; 31B cap 7 min / 28 calls | High | P0 on the 5090 |
| A3 | Rebuild the slot plan as one shared queue (31B + E4B) | High | Roadmap §6 |
| A4 | Last submission 11-27/28; both finals scored by about 11-30 | High | Roadmap §4–P5 |
| A5 | Shift effort from locate to check, anytime patch and keeping thinking on | Medium | S1/S2 design |
| A6 | Rule for malformed `edit_file`, plus a single-argument replace helper | Medium | S1 prompt and helper |
| A7 | Measure compaction in P0 traces; narrow-read discipline | Medium | P0 |
| A8 | Track G gate: ≥ +3 at equal time, canary check | Medium | Track G |
| A9 | Add the §2 checks to the pre-flight | Medium | Pre-flight |


---

<!-- ====================================================================== -->
<!-- FILE: 04_Leaderboard_2026-11-05.md -->
<!-- ====================================================================== -->

# 04 — Leaderboards, 2026-11-05 (public LB and small-model board)

*Public LB: `competitions.LeaderboardService/GetLeaderboard`, captured at about 22:05 UTC on 11-05 (`raw_json/leaderboard_public.json` / `.csv`). It is compared with `../intel_20261031/leaderboard-public-2026-10-31.csv`. The displayed score is floor(100·k/58)/100.*

## 1. Size and activity

| Metric | 10-31 | 11-05 | Change |
|---|---:|---:|---:|
| Teams on the LB | 4,248 | 4,835 | +587 net (610 team names not on the 10-31 board) |
| Total entries | 28,869 | 34,548 | +5,679 |
| Teams that submitted on or after 10-31 | — | 2,212 | — |
| Teams at 0.00 | 163 | 173 | 3.6 % of the field |
| Median score | — | 0.15 (8/58) | — |
| Team size 1 / 2 / 3 / 4 / 5 | — | 4,459 / 243 / 79 / 32 / 22 | Mostly solo |

## 2. Score tiers

The "≥ score" columns count every team at that score or higher.

| Score | k/58 | Teams at this score, 10-31 | Teams at this score, 11-05 | Teams ≥ score, 10-31 | Teams ≥ score, 11-05 |
|---|---:|---:|---:|---:|---:|
| 0.29 | 17 | 1 | 1 | 1 | 1 |
| 0.24 | 14 | 6 | 9 | 7 | 10 |
| 0.22 | 13 | 58 | 66 | 65 | 76 |
| 0.20 | 12 | 246 | 335 | 311 | 411 |
| 0.18 | 11 | 628 | 763 | 939 | 1,174 |
| 0.17 | 10 | 747 | 875 | 1,686 | 2,049 |
| 0.15 | 9 | 617 | 700 | — | — |
| 0.13 | 8 | 404 | 448 | — | — |
| 0.12 | 7 | 322 | 332 | — | — |
| 0.10 | 6 | 269 | 270 | — | — |

## 3. Medal lines (from the LB's own `medal` field)

| Medal | Ranks | Lowest score in the band | What it takes [ours] |
|---|---|---|---|
| Gold | 1–19 | 0.22 | 13/58, and an early submission (66 teams tie at 0.22) |
| Silver | 20–241 | 0.20 | 12/58 (335 teams tie at 0.20) |
| Bronze | 242–483 | 0.18 | 11/58, and early (763 teams tie at 0.18) |
| Prize money (`inTheMoney`) | 1–3 | 0.24 | ≥ 14/58 |

Ties are broken by submission time, so within a tier an earlier submission ranks higher. The private LB (about 62 tasks) will reshuffle these bands.

## 4. Top 10 and movers

| Rank | Team | Score | Entries | Last submission | On 10-31 |
|---:|---|---:|---:|---|---|
| 1 | Yurnero (samson8, GM) | 0.29 | 18 | 10-29 | #1, 0.29 (no change in the window) |
| 2 | Yike Xu | 0.24 | 7 | 10-08 | #2 |
| 3 | MUHAMMED IDRIS BIN YACOOB | 0.24 | 22 | 11-05 | #3 |
| 4 | SAVE | 0.24 | 25 | 11-04 | #4 |
| 5 | chizhu (GM) | 0.24 | 8 | 11-04 | #5 |
| 6 | pluris | 0.24 | 2 | 10-28 | #6 |
| 7 | Alberth Moreira | 0.24 | 22 | 10-31 | #7 |
| 8 | tammam alasha | 0.24 | 36 | 11-04 | #804 at 0.18 (+3 tasks) |
| 9 | Pınar Aksoy | 0.24 | 18 | 11-05 | #671 at 0.18 (+3 tasks) |
| 10 | Takumu Hata | 0.24 | 25 | 11-04 | #444 at 0.18 (+3 tasks) |

- 267 teams rose by 0.03 or more since 10-31.
- New entrants include several at 0.22 with 1–2 entries (e.g. Majkel1337, 2 entries; 国产看到前男友, 1 entry). Many more reached 0.20 with 1–4 entries. This fits copies of public notebooks plus a lucky draw. **[ours]**
- No team broke above 0.29, and the leader did not resubmit in the window.
- Coolyvision does not appear (03 §0).

## 5. Small-model board (pinned notebook by Ryan Holbrook)

The data was last updated **2026-11-04 23:57 UTC**. The notebook shows the top 100 teams of every team that has an E2B or E4B submission.

| Score | k/58 | Teams in the top 100 | Note |
|---|---:|---:|---|
| 0.10 | 6 | 12 | Ranks 1–12 (Amanie El-Hajj, Smart Manoj, Civitasmass, …, Selahattin Günter) |
| 0.08 | 5 | 55 | Ranks 13–67 (includes Mehmood Zafar and Panagiotis Anagnostou) |
| 0.06 | 4 | 33 | Ranks 68–100 (includes tammam alasha, main LB #8) |

The ceiling is unchanged since 10-27 (0.10); the field below it got denser. One E4B-plus-LoRA lineage stayed at 0.01–0.05 over 6 versions. To be eligible, the prize submission must be one of the team's two selected finals.

## 6. How to read these numbers

- Identical bytes vary by ±2–3 tasks per draw, and some runs time out (01 §1.3). A 0.24 that shows up once in a team's best-of-k is weak evidence of a true 0.24 level.
- The public-notebook floor is 0.17–0.22. A BCF-31B entry needs a true level of at least **12/58** to be in the silver band. A gold-band level of 13/58 must also be submitted early because of the time tie-break.


---

<!-- ====================================================================== -->
<!-- FILE: 05_Raw_Forum_Digest_posts_since_2026-10-31.md -->
<!-- ====================================================================== -->

# Raw forum digest — content posted after 2026-10-31T00:00:00Z

## 756051 — Tool-call serialization issue: edit_file repeatedly emitted without old_string

URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/756051  
OP by joe_qrq, LB rank 3430 on 2026-11-05T07:46Z; new comments 0 (staff 0); older comments omitted 0

**Opening post:**

> ## Summary
> 
> While running a Gemma 4 agent on the official Kaggle evaluation harness (`swegemma 0.2.11`), we observed a repeated tool-call serialization failure on `edit_file`:
> 
> - In one run, **51 consecutive `edit_file` calls** were emitted without the mandatory `old_string` argument.
> - **38 of the 51 complete argument objects were byte-for-byte identical** (ignoring key order); the remaining 13 were two variants that differed only in the value of an extra pseudo-key.
> - The failure signature was identical in **51/51 calls**: `old_string` absent, and the `new_string` value ended with the literal characters `` `,old_string: `` (backtick, comma, key name).
> - For **34 consecutive turns**, the assistant's message was also byte-identical (`"I'll try to use edit_file with the arguments as a JSON object.\n\nWait, I'll try to use the tool call again."`), and the arguments were identical as well.
> - The model did **not** lack the correct values: in the same run it wrote a correct three-key JSON object in its reasoning text (copied from the prompt example), and in another step spelled out the correct `old_string` / `new_string` values in prose. The very next calls were still malformed. We describe this as "knowing ≠ emitting".
> 
> We are not certain whether this is an organizer/serialization defect or expected model behavior under the function-calling format. We are reporting it as a possible issue and would like to know whether it is known.
> 
> ## Environment
> 
> | Item | Value |
> |---|---|
> | Model | `gemma-4-31b-it-qat-w4a16-ct` (31B QAT) |
> | Harness | `swegemma 0.2.11` (`9ad87658…`) |
> | Runtime stack | `adk_eval_core 0.1.0` · `adk_submission 0.2.13` · `google_adk 1.36.1` |
> | Platform | Official Kaggle BYOD image `gcr.io/kaggle-private-byod/python@sha256:37c64f7d…`, 4× L4, network disabled |
> | Generation config | temperature 0.2, max_output_tokens 8192 |
> | Turn budget | `max_turns = 60` (this run terminated with `exceeded_turns_budget`) |
> 
> ## Minimal evidence (single run, single task)
> 
> The malformed argument object had this shape (values abbreviated; no task code included):
> 
> ```json
> {
>   "filepath": "<target source file>",
>   "new_string": "<a plausible replacement block, 130 chars>\n`,old_string:",
>   "class EndpointContext(TypedDict, total=False)": "`"
> }
> ```
> 
> Notes:
> 
> - `old_string` is absent.
> - `new_string` ends with the literal string `` `,old_string: `` — i.e. the next key name appears to have been swallowed into the previous value, including a stray backtick.
> - A third key exists whose **name is a line of source code** (`class EndpointContext(TypedDict, total=False)`), with value `` "`" `` (in 46 calls) or `""` (in 5 calls). This looks like a parsing/serialization artifact rather than model-intended content.
> - In 38 of the calls the value of `new_string` contained the two characters `\n` as literals (not a newline escape); in the other 13 it was a real newline.
> 
> The harness error text was constant:
> 
> ```
> Invoking edit_file() failed as the following mandatory input parameters are not present: old_string
> … You could retry calling this tool …
> ```
> 
> ## Cross-run observations (described, not causal)
> 
> Across five independent runs on the same task (different prompt variants, one run per arm), `edit_file` failures showed the same "missing `old_string` + backtick tail" signature, with varying repetition lengths:
> 
> | Run | edit_file calls | failures | distinct complete objects | longest identical streak |
> |---|---:|---:|---:|---:|
> | A | 21 | 17 | 1 | 17 |
> | B | 23 | 14 | 2 | 12 |
> | C | 30 | 19 | 4 | 13 |
> | D | 16 | 13 | 4 | 6 |
> | E (reported above) | 51 | 51 | 4 key-order variants (38 identical ignoring order) | 38 |
> 
> In run A the same failure shape occurred after four successful edits, so it is not limited to the first call. In runs B and C the same task recovered by later successful `edit_file` calls; runs D/E did not.
> 
> Two runs (B and C in the table) used the **same instruction byte-for-byte**; in one the first edit succeeded, in the other it failed. We therefore do not attribute the first occurrence to the prompt text. What distinguishes run E is the length of the non-recovering loop and the pseudo-key in 51/51 calls.
> 
> ## Questions
> 
> 1. **Is this a known issue** in the tool-call organizer / function-calling serialization for this model? Specifically: a key name being emitted as a value or vice versa, and the next argument key being appended to the previous string value.
> 2. If useful, **we can provide the full ATIF traces** (per-step messages and parsed arguments) for the runs above. What is the preferred format and transfer method? We can also provide the exact harness version and image digest.
> 3. Is there a **recommended harness-side workaround** (e.g. validating/regenerating tool-call arguments, or a different tool-call representation) that we could test in our evaluation setup?
> 4. If this is expected behavior rather than a bug, any pointer to documentation or known limitations would be helpful so we can stop pursuing it.
> 
> ## Scope and limitations
> 
> - One model configuration, one task, single run per prompt variant; no repeated sampling within an arm.
> - Traces contain the harness-parsed argument objects, not the raw token stream. "Byte-identical" refers to the parsed objects seen by the harness agent loop.
> - Task identifiers and full file contents are withheld from this post; they can be shared privately if needed.
> - We are reporting an observation and asking for status, not asserting a root cause.


---

## 756044 — Stuck pending / Notebook Timeout on g4da-submit-v2 — no Public Score, cannot resubmit

URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/756044  
OP by dxnnnnn, LB rank 3097 on 2026-11-05T07:01Z; new comments 0 (staff 0); older comments omitted 0

**Opening post:**

> Hi everyone,
> 
> Has anyone else hit a long-stuck competition submission that never gets a Public Score?
> 
> For team **dxnnnnn** on **gemma-4-developer-agent**:
> - Multiple **g4da-submit-v2 Version 2** attempts end as **Notebook Timeout** (including a recent ~18h run) with **no Public Score**.
> - While one row was stuck as pending/Running earlier, **Submit Prediction** was blocked with: “Cannot submit. Your team already has 1 pending submissions; please wait for one to finish scoring.”
> - The notebook/kernel itself completed successfully with **submission.zip** in Output, so this looks more like a scoring/queue handoff issue than a local notebook failure.
> - We also opened Support ticket **271265** and shared screenshots.
> 
> Questions:
> 1. Is anyone else seeing Timeout / endless pending with no score on this competition?
> 2. Any workaround that cleared the pending slot without waiting for Support?
> 
> Thanks.


---

## 755677 — Scoring zero when using LoRA adapters

URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/755677  
OP by Luca Massaron, LB rank 1081 on 2026-11-04T08:14Z; new comments 7 (staff 0); older comments omitted 0

**Opening post:**

> # Scoring zero when using LoRA adapters
> 
> Hi everyone,
> 
> I am investigating an issue where submissions that include a LoRA adapter consistently score **0.00** on the public leaderboard, while submitting the **exact same code, prompt, tools, and configs without the adapter scores 0.18**.
> 
> I would love to know if anyone has successfully submitted a scoring LoRA adapter on `gemma-4-31b-it-qat-w4a16-ct`, or if the Kaggle evaluation backend requires a specific adapter configuration.
> 
> ---
> 
> ### 1. My Submissions and Experimental Setup
> 
> Across all tests, my `agent.yaml`, `configs/sampling.yaml`, `eval_config.yaml`, tools, and system prompts were kept **strictly identical**:
> 
> * **Base Model**: `gemma-4-31b-it-qat-w4a16-ct`
> * **Tools**: `run_command`, `read_file`, `edit_file`, `write_file`, `get_status`, `submit_patch`
> * **Eval Config**: `timeout_seconds: 240`, `max_tool_calls: 28`, `max_time_minutes: 8`, `max_turns: 80`
> * **Sampling Config**: `temperature: 0.2`, `top_p: 0.95`, `thinking_budget: 4096`, `include_thoughts: true`
> 
> Here is what happened across three controlled submission tests:
> 
> | Submission | Adapter Config | Target Modules | Safetensors / Zip Size | Local Benchmark (129 SWE-bench) | Kaggle Public LB Score |
> | :--- | :---: | :---: | :---: | :---: | :---: |
> | **`submission_v21_lora`** | $r=16, \alpha=32$ | All 7 projections (`q, k, v, o, gate, up, down`) | 509 MB / 462 MB | **17 / 129 (13.18%)** | **0.00** |
> | **`submission_v24_rank4_svd`** | $r=4, \alpha=8$ | All 7 projections (SVD compressed) | 127 MB / 108 MB | **14 / 129 (10.85%)** | **0.00** |
> | **`submission_v23_zero_shot`** | **None (Zero-shot)** | — | **0 MB / 7.7 KB** | ~12 / 129 (9.3%) | **0.18** |
> 
> ---
> 
> ### 2. Specifications of the Two Adapters That Scored 0.00
> 
> #### Adapter 1: `submission_v21_lora.zip` (Full SFT Rank-16)
> * Trained with trajectory-level SFT on 2,377 gold verified SWE-bench traces.
> * **Weights**: 509.37 MB `adapter_model.safetensors`.
> * **Config (`adapter_config.json`)**:
> ```json
> {
>   "peft_type": "LORA",
>   "task_type": "CAUSAL_LM",
>   "base_model_name_or_path": "google/gemma-4-31b-it-qat-w4a16-ct",
>   "r": 16,
>   "lora_alpha": 32,
>   "lora_dropout": 0.05,
>   "bias": "none",
>   "target_modules": [
>     "down_proj",
>     "gate_proj",
>     "k_proj",
>     "o_proj",
>     "q_proj",
>     "up_proj",
>     "v_proj"
>   ]
> }
> ```
> * **Packaging in ZIP**:
> ```text
> adapters/main_lora/adapter_config.json
> adapters/main_lora/adapter_model.safetensors
> agent.yaml (with `adapter: main_lora`)
> ```
> * **Result**: Scored **0.00**.
> 
> #### Adapter 2: `submission_v24_rank4_svd.zip` (Ultra-Lightweight Rank-4 SVD)
> * Hypothesizing that 509 MB might exceed multi-GPU KV-cache allocations under vLLM, I factorized the weights via truncated SVD down to rank $r=4$, retaining 76.53% singular energy.
> * **Weights**: 127.47 MB `adapter_model.safetensors` (108.4 MB total zip archive).
> * **Config (`adapter_config.json`)**:
> ```json
> {
>   "peft_type": "LORA",
>   "task_type": "CAUSAL_LM",
>   "base_model_name_or_path": "google/gemma-4-31b-it-qat-w4a16-ct",
>   "r": 4,
>   "lora_alpha": 8,
>   "lora_dropout": 0.05,
>   "bias": "none",
>   "target_modules": [
>     "down_proj",
>     "gate_proj",
>     "k_proj",
>     "o_proj",
>     "q_proj",
>     "up_proj",
>     "v_proj"
>   ]
> }
> ```
> * **Result**: Also scored **0.00**.
> 
> ---
> 
> ### 3. Why the Discrepancy? What I Noticed Locally
> 
> When testing locally with HuggingFace PEFT on `gemma-4-31b-it-qat-w4a16-ct`, I noticed that linear projections in this quantized checkpoint are wrapped inside `Gemma4ClippableLinear` container modules. Unpatched PEFT `_create_new_module` throws an exception unless monkey-patched to inspect `target.linear`:
> 
> ```text
> ValueError: Target module Gemma4ClippableLinear(...) is not supported. 
> Currently, only torch.nn.Linear, torch.nn.Embedding... are supported.
> ```
> 
> If Kaggle's backend evaluation harness attempts to load `adapters/main_lora` via standard stock PEFT or vLLM without handling `Gemma4ClippableLinear` / `compressed-tensors`, it might be raising an uncaught exception at agent startup, causing the submission to terminate before Task 1 begins.
> 
> ---
> 
> ### 4. Questions for the Community and Hosts
> 
> 1. **Has anyone obtained a non-zero public score with ANY LoRA adapter on `gemma-4-31b-it-qat-w4a16-ct`?**
> 2. **Backend Engine**: Is the evaluation runner loading the adapter via HuggingFace PEFT (`PeftModel.from_pretrained`), or via vLLM with `--enable-lora`?
> 3. **Module Targeting**: Does `target_modules` in `adapter_config.json` require a specific regex syntax (e.g. scoping strictly to `.*language_model.*`) rather than a list of module names?
> 4. **Directory Structure**: Does `agent.yaml` expect `adapter: main_lora` referencing `adapters/main_lora/`, or should the adapter files reside directly in the root or a different directory?
> 
> Any insights from the hosts or competitors who have worked with adapters would be greatly appreciated!

**New comments:**

- **Yurnero, LB rank 1** — 2026-11-04T10:30Z
  > I think something is wrong with either your setup or with your submission stucture. It is possible to score > 0 with a LoRA adapter
- **Ankith Savio, LB rank 232** — 2026-11-04T11:41Z
  > I got a non zero score with rank 32 lora for the same model with 4 minute task timeout
- **Heisenberg, LB rank 4169** — 2026-11-04T10:50Z
  > I think you also get 0 if your submission timed out.
- **Kapil Chopra, LB rank 1796** — 2026-11-04T23:57Z
  > Data point from our team, same base model (gemma-4-31b-it-qat-w4a16-ct), and an adapter shaped like yours: rank 16, alpha 32, all 7 projections on all 60 language layers, served as main_lora.
  > 
  > ┌────────────┬───────────────────────────────────┬───────────────────────────┬───────────────────────────────────────┐
  > │ Submission │              Adapter              │   Task cap / thinking     │                Result                 │
  > │            │                                   │          budget           │                                       │
  > ├────────────┼───────────────────────────────────┼───────────────────────────┼───────────────────────────────────────┤
  > │ A          │ run1, alpha 16                    │ 8 min / 4096              │ complete, no score                    │
  > ├────────────┼───────────────────────────────────┼───────────────────────────┼───────────────────────────────────────┤
  > │ B          │ run2, alpha 32                    │ 8 min / 4096              │ complete, no score                    │
  > ├────────────┼───────────────────────────────────┼───────────────────────────┼───────────────────────────────────────┤
  > │ C          │ run2, alpha 32 (same adapter as   │ 6 min / 2048              │ 0.17 (same as our no-adapter          │
  > │            │ B)                                │                           │ baseline)                             │
  > └────────────┴───────────────────────────────────┴───────────────────────────┴───────────────────────────────────────┘
  > 
  > So the adapter does load and score on the grader. On a Kaggle 4×L4 test run, vLLM listed and served it, but each task took about 29% longer (about 45% more tokens per step). With 120 tasks at an 8-minute cap, that pushed us over the 12-hour total limit. Cutting the task cap and the thinking budget fixed it.
  > 
  > One difference: ours came back as "complete, no score", not 0.00, so your failure may be a different one. A quick way to tell: rerun your v21 with a 5–6 min cap and thinking 2048. If it scores, it's time; if it's still 0.00, look at loading.
- **kingofeverything, LB rank 2312** — 2026-11-04T23:26Z
  > why your tensor takes 509mb？
- **Harisdak Singh Banwait, LB rank 4811** — 2026-11-04T18:41Z
  > I believe something is wrong with submission structure
- **xz, LB rank 2652** — 2026-11-04T12:51Z
  > I came to test some training recipe ideas but there seems to be a lot of hoops to jump through. I’m reading that using LoRA reduces decoding speed and context limit. Are these claims true? I can’t even test these claims easily with submissions being 30+ hours.

---

## 755611 — Are the reported LoRA issues fixed? I don't see any updates.

URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/755611  
OP by xz, LB rank 2631 on 2026-11-04T03:54Z; new comments 0 (staff 0); older comments omitted 0

**Opening post:**

> I am reading through the forum and the reported issues including slower decoding speed and shorter context length. The current eval setup is also severely under-ultilizing the 4xL4 GPU.


---

## 755554 — [fastapi_14186] Task unresolvable: required test skipped due to @needs_pydanticv1 and Pydantic v2 setup

URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/755554  
OP by Aridio Silva on 2026-11-03T22:28Z; new comments 0 (staff 0); older comments omitted 0

**Opening post:**

> I can independently confirm this for fastapi_14186, with some additional detail.
> 
> Setup: the public tasks.jsonl, the task snapshot, the official sandbox/setup.py with the dataset wheels, and the swegemma verifier. The task's own reference patch was applied, and it applies cleanly. The test command exits with code 0.
> 
> Because the task has no FAIL_TO_PASS/PASS_TO_PASS, the verifier derives 7 required tests from test_patch. Their decorators, after applying test_patch, are:
> 
> Required test	Decorator
> tests/test_compat.py::test_model_field_default_required	@needs_pydanticv2
> tests/test_get_model_definitions_formfeed_escape.py::test_model_description_escaped_with_formfeed (2 params)	@needs_pydanticv1
> tests/test_response_model_as_return_annotation.py::test_invalid_response_model_field_pv1	@needs_pydanticv1
> tests/test_compat.py::test_v1_plain_validator_function	@needs_py_lt_314
> tests/test_compat.py::test_is_pv1_scalar_field	@needs_py_lt_314
> tests/test_compat.py::test_get_model_fields_cached	@needs_py_lt_314
> tests/test_compat.py::test_is_uploadfile_sequence_annotation	(none)
> needs_pydanticv1 and needs_pydanticv2 are defined in tests/utils.py as skipif(PYDANTIC_V2) and skipif(not PYDANTIC_V2). No single environment can run all required tests, so a skipped required test makes the task impossible to resolve with any patch.
> 
> There is one extra detail for the public setup. The dataset ships both pydantic-1.10.15 and pydantic-2.13.4, but deduplicate_wheels in sandbox/setup.py keeps only the highest version. Pydantic 2.13.4 is therefore always installed, and the JUnit report shows the three v1-only nodes as skipped: requires Pydantic v1. The verifier then returns Required test node did not pass: test_model_description_escaped_with_formfeed.
> 
> I can also confirm the rich_3486 case. Applying the same derivation, the verifier requires 2 tests from tests/test_traceback.py. After test_patch, test_traceback_finely_grained_missing has @pytest.mark.skipif(sys.version_info.minor >= 11, ...) and test_traceback_finely_grained has @pytest.mark.skipif(sys.version_info.minor < 11, ...). One of them is always skipped on any Python version.
> 
> To the organizers, adding to the question above: for the hidden evaluation, is there an explicit FAIL_TO_PASS/PASS_TO_PASS list for this task? If not, could required nodes that are skipped by environment markers be excluded, or the task be corrected? As it stands, it scores 0 for every participant regardless of solution quality.
> 
> — Aridio Silva


---

## 755542 — Sending public tasks to a hosted model provider: how should the Competition Data rule be read?

URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/755542  
OP by medoHamza95, LB rank 3134 on 2026-11-03T21:46Z; new comments 1 (staff 0); older comments omitted 0

**Opening post:**

> Hello @ryanholbrook and the Kaggle team,
> 
> I would like a clear reading of the rules on one point, because several things seem to point in different directions.
> 
> - Section 4 says participants agree "not to transmit, duplicate, publish, redistribute or otherwise provide or make available the Competition Data to any party not participating in the Competition".
> - Section 6 and the staff answer in discussion 742807 allow external models used in line with their license terms, but they do not say whether Competition Data may be sent to those models.
> - Some participants have reported running public tasks through hosted APIs, for example in discussion 747168. I have not seen a staff comment on whether that is allowed.
> - The public tasks come from open-source repositories, and some providers state that they process prompts only transiently and do not train on them.
> 
> My questions:
> 
> 1. During development, may a participant run an agent on the public tasks in tasks.jsonl through a hosted model provider such as Ollama Cloud or OpenRouter, when the prompts contain task statements and repository code?
> 2. Does it change the answer if the provider does not retain or train on the data, or if the content also exists in the public upstream repository?
> 3. May participants use such providers with their own tasks, built from a public dataset outside the Competition Data?
> 
> Thank you.

**New comments:**

- **medoHamza95, LB rank 3134** — 2026-11-04T09:20Z
  > Two related questions on Rule 4.b, since "Competition Data" includes "any prototype or executable code provided on the Competition Website":
  > 
  > 1. May participants install the official wheelhouse on a private Google Colab runtime, or store it in their own Google Drive?
  > 2. May an AI coding assistant hosted by a third party read public task text, agent traces or the provided code while helping a participant?

---

## 755527 — The queue time should improve once the ARC-2 backlogs are cleared

URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/755527  
OP by xz, LB rank 2630 on 2026-11-03T21:14Z; new comments 2 (staff 0); older comments omitted 0

**Opening post:**

> Just in case you are wondering why the submissions are taking 30+ hours.

**New comments:**

- **hsiaosuan, LB rank 426** — 2026-11-04T02:56Z
  > I just started an e4b submission. will update on the queuee situation once it finishes
  - **xz, LB rank 2630** — 2026-11-04T20:05Z
    > I might be wrong :(

---

## 755391 — Important dataset inquiry for better model alignment

URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/755391  
OP by Harisdak Singh Banwait, LB rank 4783 on 2026-11-03T13:52Z; new comments 0 (staff 0); older comments omitted 0

**Opening post:**

> Well, this is the issue. I was experiencing the following condition. Every one of the 129 issues in the public dataset is located in three to four Python libraries, including FastAPI, Rich, HTTPS, and requests. Is there a solution to the issue of private data containing related libraries, such as Starlette or another solution? Or does the private data exclusively consist of libraries such as these, which are restricted to these? Or is it similar to the fact that there are any other repositories? I am not inquiring about the contents of the private dataset; rather, I am asking this question to facilitate the proper alignment of models, data training, and data collection, as well as to enhance the model's training.


---

## 755318 — Why has my notebook been submitting for more than a day. 

URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/755318  
OP by TheFusionCube, LB rank 1420 on 2026-11-03T08:01Z; new comments 2 (staff 0); older comments omitted 0

**Opening post:**

> I can literally submit a completely new entry and my old one still won't be finished.

**New comments:**

- **Nir Aberman, LB rank 177** — 2026-11-03T12:48Z
  > every submission of mine for the past 2 weeks have been for 18-28h until a score
- **Prathamesh7x, LB rank 2409** — 2026-11-03T10:56Z
  > Hey even I'm going through a similar problem. It's been like 25 hours since submission and it's still going on.

---

## 755291 — Where 76% of a 300-second agent budget actually goes (4 trace audits)

URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/755291  
OP by XingLing, LB rank 2037 on 2026-11-03T06:01Z; new comments 1 (staff 0); older comments omitted 0

**Opening post:**

> Audited four Gemma-4-12B runs on fastapi. Wall-clock is 76% pure decode at 17.25 tok/s — least-squares fit dt = 0.78 + 0.058·ct, r² = 0.9996 over 39 normal steps. 
> 
> 8 of 43 steps hold 56% of the budget, in two shapes: 4 restatements of a file just read (1,788 tokens / 104 s in one message), and 4 prefill spikes (82 s for 251 tokens). Same cost, opposite cause — you can't tell them apart without decomposing.
> 
>  The one I didn't expect: read_file truncates at 150 lines. fastapi/params.py is 754 lines, was read 6 times, still never fully seen — and 1,152 lines across four runs were fetched twice. 
> 
> Three rules follow: never restate a file after read_file, always pass both start_line and end_line (the cap is 150, so anything over ~400 lines needs grep first), and treat any single step over 60 s as a prompt bug rather than a model limitation.
> 
> Notebook runs in 20 s, no GPU: https://www.kaggle.com/code/xingling666/a-300-second-budget-is-5-000-output-tokens

**New comments:**

- **XingLing, LB rank 2037** — 2026-11-03T14:04Z
  > I compared the declared configs of three public submissions (0.20 / 0.18 / 0.05). Only the model size separates them — 8192 / 4096 / 8 min / 240 s is identical across all three, including the one at 0.05. There are also three settings that silently do nothing, with a checker you can run on your own agent.yaml:https://www.kaggle.com/code/xingling666/same-8-minutes-scores-from-0-05-to-0-20

---

## 755289 — Fine tuning with Lora is the only way??!

URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/755289  
OP by Alex Wang, LB rank 1822 on 2026-11-03T05:49Z; new comments 0 (staff 0); older comments omitted 0

**Opening post:**

> Hi guys, I'm new to kaggle and this is my first compitition.
> 
> I only have evaluation and harness exp, so I mainly tried optimize prompt and orchestration.
> 
> After about 15 attempts, I wondering whether context managing and prompting is effective in this one.
> 
> I’ve compiled some failure patterns. Some constraints on the model’s behavior are largely ineffective.
> 
> The main factor seems to be configs in sampling.yaml and eval_config.yaml.
> 
> `**Ineffective**
> 
> | **ID** | **Pattern**                                                                                                      |
> | :----: | :--------------------------------------------------------------------------------------------------------------- |
> |   E1   | Paging through a file in small windows (≤35 lines) instead of reading the whole function at once                 |
> |   E8   | Reverts its own fix to compare behavior, then submits an empty patch                                             |
> |   E10  | Analyzes without editing: never edits, or edits only once the budget or time runs out                            |
> |   E11  | Fix is incomplete or differs from the gold patch                                                                 |
> |   E12  | Sub-agent makes too many calls: keeps chasing definitions after finding the target, or repeats commands verbatim |
> |   E13  | Sub-agent report is wrong or vague; the root agent follows it without checking                                   |
> |   E14  | Root agent ignores `budget_warning` and keeps reading                                                            |
> |   E15  | Modifies or creates test files                                                                                   |
> |   E17  | Re-reads code already in context, including code given in the sub-agent report                                   |
> |   E18  | Reproduction script misses the bug (passes); the agent switches hypotheses instead of editing                    |
> 
> **Effective**
> 
> | **ID** | **Pattern**                                                                                                                                                                         |
> | :----: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
> |   E2   | One-line `python3 -c` with compound statements or backticks causes a syntax error                                                                                                   |
> |   E3   | `write_file` to `/tmp` fails, or scratch files are left in `/workspace`                                                                                                             |
> |   E4   | `old_string` not found or not unique (long docstrings, escapes, or lines filled in from memory); only adds context upward after a "not unique" error                                |
> |   E5   | `grep -r` without `--include` scans the whole repository                                                                                                                            |
> |   E6   | `include_thoughts: false` loses reasoning across turns; each step takes 45–60 s                                                                                                     |
> |   E7   | `max_output_tokens: 16384` returns a 400 error when the input exceeds 16384 tokens                                                                                                  |
> |   E9   | Tool argument misuse: backticks or `start_line` mixed into the `read_file` path, a path passed to `--include`, or searching a nonexistent directory                                 |
> |   E16  | Emits `call:grep ...` as if `grep` were a tool name; the harness treats it as truncation, the model repeats until the nudges run out and submits an empty patch                     |
> |   E19  | Malformed `edit_file` arguments ("mandatory input parameters are not present"), resent verbatim; the fallbacks (`sed`, rewriting the whole file with `write_file`) corrupt the file |
> |   V1   | No pip: `pip install -e` fails silently; requests imports the system copy, so edits have no effect                                                                                  |
> |   V2   | `inline_snapshot` is missing                                                                                                                                                        |
> |   V3   | pytest-httpbin is missing; all of `tests/test_requests.py` errors                                                                                                                   |
> |   V4   | Pygments version mismatch causes unrelated test failures                                                                                                                            |
> |   V5   | Target test already passes on the original code (local false positive for an empty patch)                                                                                           |`


---

## 755183 — Why not cap submissions to once in two days

URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/755183  
OP by Murugesan Narayanaswamy, LB rank 566 on 2026-11-02T23:33Z; new comments 0 (staff 0); older comments omitted 0

**Opening post:**

> The current long running submissions are severely restricting experiments. We dont know how much time really the submission notebook takes to run. At present, it is already only one submission per two days. 
> 
> To solve the gpu resource constraint, why not cap the submissions to once in two days but ensure there is no queing so that we know how much time it takes to complete the tasks?
> 
> However, if the objective is to prevent knowing the exact time it takes to run a submission and thereby prevent probing the private dataset, this wont help.


---

## 755172 — Public code of my entry: gemma4-swe-agent (Apache 2.0)

URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/755172  
OP by Emanuele Miranda, LB rank 1767 on 2026-11-02T22:58Z; new comments 0 (staff 0); older comments omitted 0

**Opening post:**

> Sharing the public repository of my entry here, as General Rule 6.b asks for publicly shared competition code:
> 
> https://github.com/emamira02/gemma4-swe-agent
> 
> It contains the frozen agent bundles (candidates/S1 to S18, including every submitted one, each with its zip SHA), the in-container localization skill and the single-argument heredoc editor, the dev-panel and failure-analysis code, and the localization study behind my paper-track submission. Licence: Apache 2.0. NOTICE credits the public notebooks whose prompts I adapted (Budget-Aware Coding Agent V10, SuperAgent, Shape of Doubt) and the Budget-Fit baseline. No competition data is included: scripts/fetch_data.sh downloads it from Kaggle.


---

## 755066 — Stage 1 of wrapper engineering: settings, budgets and lessons

URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/755066  
OP by Sukhendu Sain, LB rank 1246 on 2026-11-02T18:35Z; new comments 0 (staff 0); older comments omitted 0

**Opening post:**

> Before changing prompts or adding sub-agents, I wanted to see how much the settings mattered. I used a basic wrapper and kept the competition model unchanged.
> 
> The four main studies covered **376 attempts across 40 public tasks**. These are local evaluation results, not leaderboard scores. Repeating a task tells us about consistency, but does not give us another independent problem.
> 
> ## Setup
> 
> The agent used Gemma 4 31B QAT with six native tools for commands, reading, editing, writing, status and submission. There was no LoRA, delegation or compaction. The prompt asked for a correct repair, targeted checks and preservation of existing behavior.
> 
> Kaggle notebooks ran on four L4 GPUs with a 32,768-token context. Two isolated workers processed tasks independently. I saved requests, tool calls, command output, patches, grading and timings.
> 
> Tasks followed [Dmitrii Gluzdov and Busya PRIME's soundness audit, version 10](https://www.kaggle.com/datasets/dmitriigluzdov/gemma-4-task-soundness-and-local-results/versions/10). Each selected task also needed a passing reference patch and a failing empty patch in my environment. Reference solutions were kept out of agent inputs. Launches that failed before inference have no agent score.
> 
> ## Sampling
> 
> The first sweep had 130 attempts: five tasks, twice each, across 13 profiles. The second had 126: seven different tasks, three times each, across six profiles. Each variation changed one setting from its study's control.
> 
> | Comparison | First study | Second study |
> |---|---|---|
> | Temperature 0 vs 1 | 7/10 vs 7/10 | 11/21 vs 12/21 |
> | Output 4k / 6k / 8k | 7/10 / 6/10 / untested | 10/21 / 12/21 / 10/21 |
> | Thinking 2k vs 4k | 6/10 vs 6/10 | 10/21 vs 10/21 |
> | Top-p 0.5 / 0.8 / 1 | 3/10 / 4/10 / 6/10 | Untested |
> 
> Here, k means 1024 tokens. The studies used different tasks and defaults, so compare settings within each column.
> 
> Temperature 0 was faster than 1 on average in both comparisons, with close scores. I kept 0 as the default. Output 8k showed no dependable advantage over 6k. The second study's 6k profile peaked at 3,689 tokens, so its score does not show that larger output was needed. Doubling thinking tied on score twice; it was slower once and slightly faster once.
> 
> Thinking uses the total output allowance. I saw responses spend the entire 4k ceiling on reasoning without producing an action. More thinking needs enough room for the edit too.
> 
> ## Larger comparisons
> 
> Next came 15 tasks, three repeats each, with 20 minutes per attempt:
> 
> | Profile | Passes | Mean agent time |
> |---|---:|---:|
> | A: temperature 0, output 4k, thinking 4k | 24/45 | 470.10s |
> | B: temperature 1, output 6k, thinking 2k | 23/45 | 437.26s |
> 
> Both solved nine task types. On the 22 matched attempts both passed, B used 23.6% less evaluator time. The small score difference does not establish a quality winner, and three settings changed together.
> 
> I then tried temperature 0, output 6k, thinking 2k and top-p 1 on 30 tasks, with ten minutes and 50 model requests each. It passed **12/30**, averaging 346.49 agent seconds. Eighteen tasks were labelled complex. This was a different cohort; on 14 overlapping first-round tasks, it matched B at 7/14.
> 
> ## Budgets
> 
> Looking back through the histories, every B success and every success in the latest run finished within 45 model requests. Forty would interrupt several successful histories. I chose 50 for some margin. These are completion counts, not regraded earlier patches.
> 
> Of 7,424 completed commands, 24 exceeded 120 seconds and all failed or timed out. A timeout could still discard useful diagnostic output. Three successful checks took about 104 seconds, which argues against a universal 60-second cap.
> 
> The next experiments will use **10 minutes, 50 model requests and 120 seconds per command**. The 12/30 run had no separate command timeout, so the new cap still needs confirmation.
> 
> There is also the full submission budget: 120 tasks in 12 hours leaves six minutes each before overhead. A ten-minute task ceiling alone cannot guarantee completion.
> 
> ## Next
> 
> The recurring failures were wrong assumptions, incomplete APIs, malformed calls, repeated submissions and exhausted context. Stage 2 will test better editing tools, focused exploration, recovery and independent review. Each change needs to improve correct patches without spending away the runtime needed for the remaining tasks.


---

## 754895 — The copied kaggle notebook is actively running and i haven't started a session. How did you go about when  session hours are used by the system's Glitch and not the intended user

URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/754895  
OP by Allan Kipruto on 2026-11-02T08:31Z; new comments 0 (staff 0); older comments omitted 0

**Opening post:**

> The copied kaggle notebook is actively running and i haven't started a session. The issues may have rose from the original author, Ryan Holbrook on Getting Started - Gemma 4 Developer Agent on version 3. i had to delete my previous notebook cause it had wasted several session Quota: hours and we only have a 30 hours weekly limit.
> 
> i did download the notebook codes before deletion cause i'll reuse the codes.  How did you go about when several session hours are used by the system's Glitch and not the intended user?


---

## 754890 — The copied kaggle notebook is actively running and i haven't started a session

URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/754890  
OP by Allan Kipruto on 2026-11-02T08:03Z; new comments 0 (staff 0); older comments omitted 0

**Opening post:**

> The copied kaggle notebook is actively running and i haven't started a session. The issues may have rose from the original author, Ryan Holbrook on Getting Started - Gemma 4 Developer Agent on version 3


---

## 754845 — Submission pending for 29+ hours

URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/754845  
OP by Akanksha Pathak, LB rank 2722 on 2026-11-02T01:13Z; new comments 1 (staff 0); older comments omitted 0

**Opening post:**

> Hi,
> 
> My submission from ref 57849011 has been Pending for about 29 hours, with no score or error. My config should finish in about 10–11 hours. Earlier submissions were scored within 12–14 hours.
> 
> Is the scoring queue delayed, or could something be wrong with this submission? Since only one submission can be pending at a time, it’s blocking my next one.
> 
> Thanks!

**New comments:**

- **Akanksha Pathak, LB rank 2722** — 2026-11-02T18:20Z
  > It got submitted in the end. But, do we have an expected time in which these submissions are supposed to get graded?

---

## 754811 — anybody crossed 0.2 threshold

URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/754811  
OP by yashraj2308, LB rank 1028 on 2026-11-01T19:24Z; new comments 1 (staff 0); older comments omitted 0

**Opening post:**

> Anybody crossed >= 0.2 threshold just by prompting without finetuning or training any lora adapters on top of that

**New comments:**

- **DePie, LB rank 2317** — 2026-11-02T04:40Z
  > The best public notebook is what you want. But it's very unstable

---

## 754783 — in EventsCompactionConfig: LlmEventSummarizer drops all tool calls and tool responses

URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/754783  
OP by carlesoctav on 2026-11-01T16:35Z; new comments 0 (staff 0); older comments omitted 0

**Opening post:**

> When context compaction triggers, LlmEventSummarizer._format_events_for_prompt() formats the event history for the summarization LLM by only checking:
> ```
>     for part in content.parts:
>         if part.text:
>             text += part.text
> ```
> 
> 
>   Because tool-calling turns store actions in part.function_call and tool results in part.function_response (with part.text often being empty or None), the summarizer completely ignores
>   all tool invocations and tool outputs.
> 
> In software engineering benchmarks (like SWE-bench / Harbor), over 90% of turns are tool executions (read_file, run_command, edit_file).
>   When compaction runs:
> 
>   1. The summarizer is fed only the initial user prompt, completely blind to all the commands, tests, and edits the agent performed.
>   2. The summarizer outputs: "Task assigned, but no actions or code changes have been made yet."
>   3. The agent receives this truncated history, loses its execution context, and either loops from scratch or terminates prematurely.


---

## 754636 — Request to Hosts: Fix Harness Continuation Nudge, Context Duplication & Compaction Bugs Breaking complex agent orchestrations

URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/754636  
OP by Murugesan Narayanaswamy, LB rank 563 on 2026-10-31T23:17Z; new comments 3 (staff 0); older comments omitted 0

**Opening post:**

> Hi @ryanholbrook and the competition team,
> 
> 
> After extensive debugging comparing the official starter agent (`0.08`) against multiple 2-stage `SequentialAgent` pipelines (which consistently drop to `0.06–0.08` despite deterministic localization scripts, problem briefs, and strict exit gates), we traced the score collapse to **four structural incompatibilities between `swegemma`’s runner/compaction harness and Google ADK’s `SequentialAgent`**:
> 
> ### 1. Continuation Nudges Restart `SequentialAgent` from Stage 1 (`sub_agents[0]`)
> 
> * In `agent_runner.py` (§5.3 of [`HARNESS_README.md`](https://www.kaggle.com/competitions/gemma-4-developer-agent/data)), when a turn ends without `submit_patch()` (e.g., hitting `max_output_tokens`, a truncated `<|tool_call>` tag, or an intermediate text response), the outer `while True:` loop injects a `nudge_prompt` into a new `runner.run_async(...)` call on the root agent.
> 
> * In [ADK’s `SequentialAgent._run_async_impl`](https://github.com/google/adk-python/blob/main/src/google/adk/agents/sequential_agent.py), a new `run_async` invocation **restarts execution from `sub_agents[0]`** rather than resuming the active downstream solver agent.
> 
> * Worse, if `sub_agents[0]` uses `include_contents: none` ([google/adk-python#7813](https://github.com/google/adk-python/issues/7813), [google/adk-python#931](https://github.com/google/adk-python/issues/931)), `_get_current_turn_contents` strips the initial task prompt and feeds *only* the 1-line continuation nudge to Stage 1—causing Stage 1 to re-run blind, overwrite `session.state[output_key]` with garbage, and burn 60–90 seconds + multiple tool calls before the solver regains control.
> 
> ### 2. Shared-Session Context Duplication Triggers Premature, Lossy Compaction
> 
> * When Stage 1 passes a structured brief via `output_key` into Stage 2’s system prompt, setting `include_contents: default` on Stage 2 causes ADK to **also** replay all of Stage 1’s raw tool calls, 9,000-char script JSON outputs, and final text in `session.events` ([google/adk-python#2207](https://github.com/google/adk-python/issues/2207)).
> 
> * However, setting `include_contents: none` on Stage 2 wipes the initial user message (workspace tree and harness rules) and breaks across continuation nudges.
> 
> * Because Stage 2 starts with **10,000–12,000 duplicated tokens**, it crosses `token_threshold = 14,336` / `compaction_interval = 5` ([Discussion #744692](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/744692), [Discussion #744794](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/744794)) after just 1–2 tool calls. Compaction then summarizes away the exact file lines and tool outputs the solver just read, destroying multi-step editing flow.
> 
> ### 3. Single Shared Clock & Tool Counter Penalizes Multi-Stage Pipelines
> 
> * Because a single `EvaluationBudget` clock and tool counter covers the entire pipeline ([Discussion #747519](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/747519)) inside the strict 12-hour total scoring window (~5.5 min/task safe cap on 4× L4 GPUs, [Discussion #746250](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/746250)), even 45–60 seconds of Stage 1 localization + compaction summarization pushes Stage 2 below the ~4.5-minute threshold where half of solvable tasks time out ([Discussion #750350](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/750350)).
> 
> ### Why Fixing This Matters for the Competition’s Core Objectives
> 
> 1. **Both Agent Architecture and LoRA Are Intended Pillars**: The competition schema (`adk-submission`) was specifically engineered to support rich declarative ADK workflows (`SequentialAgent`, `LoopAgent`, `ParallelAgent`, and `skills/`).
> 
> 2. **A Single `system.md` Should Not Be the Ceiling for Agent Design**: One month into the competition, **zero** sequential or multi-stage agent configurations work competitively on the public scored notebooks. The highest-scoring public non-LoRA notebooks (~`0.22`) rely on a single basic `LlmAgent` and a one-page `system.md`. If prompt-only beats LoRA, awarding a **$65,000** prize for a single-page `system.md`—simply because multi-agent orchestration is blocked by harness plumbing—defeats the purpose of an agent engineering competition.
> 
> 3. **Narrow Coding LoRAs Alone Offer Limited Scientific Novelty**: Frontier models are massive primarily because they serve 50+ diverse industries simultaneously. Specializing a 31B model via SFT/LoRA to narrowly solve Python repository issues is a well-understood domain-distillation exercise rather than a breakthrough in autonomous agent design. True innovation on consumer hardware requires **structured multi-agent orchestration, deterministic tooling, and verification gates** working alongside the model.
> 
> ### Requests to the Host Team
> 
> * **Target Continuation Nudges at the Active Leaf `LlmAgent`**: In `agent_runner.py`, if a `SequentialAgent` turn exits before `submit_patch()`, route continuation nudges to the currently active sub-agent (or preserve `SequentialAgentState` across nudges) rather than restarting `sub_agents[0]`.
> 
> * **Preserve Recent Raw Tool Outputs During Compaction**: Keep the last $N$ tool responses verbatim when `EventsCompactionConfig` triggers, and exclude prior sub-agents’ internal skill/script outputs when `output_key` is already used to pass state.
> 
> * **Decouple Skill Script Setup Overhead or Allow Per-Agent Budgets**: Support per-sub-agent `max_tool_calls` / `max_time_minutes` in `sub_agents/*.yaml` so a Stage 1 agent does not starve the solver agent.
> 
> Note: "We" refers to myself and Gemini Argon!!😀

**New comments:**

- **Murugesan Narayanaswamy, LB rank 563** — 2026-10-31T23:39Z
  > Also Note: Though agent_tools configuration can overcome context window / summary cmpaction problems  but still complex agent orchestrations are not possible, and sequential agents can as well be removed from agent harness, when they can't be used.
- **MrMadsheep, LB rank 119** — 2026-11-01T09:50Z
  > I just wanted to point out that even though above limitations are true (I've run into them few weeks ago too) from my perspective it would not be fair to fix them at this point in the competition, given the time and resources sunk into going around them. In practical sense above problems, plus the inability to change compaction settings and compaction prompt almost forces the design into single agent solution (with small exceptions) and sft / other training methods.
  - **Murugesan Narayanaswamy, LB rank 563** — 2026-11-01T12:17Z
    > I appreciate your reply. Others who downvote a post should first make their view points clear by commenting -  I thought may be there exist simple solutions to sequential agent problem that allows its usage as a possible reason for the downvotes. As for single agent solutions, I wonder what that would serve for the hosts' competition objectives!

---

## 754594 — Clarification: Are model adaptation methods other than LoRA allowed?

URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/754594  
OP by yu11yu, LB rank 2522 on 2026-10-31T17:18Z; new comments 0 (staff 0); older comments omitted 0

**Opening post:**

> Could the organizers clarify whether submissions support any of the following?
> 
> 1. Full fine-tuned checkpoints of an allowed Gemma 4 model.
> 2. Checkpoints with LoRA weights merged into the base model.
> 3. Other PEFT methods, such as DoRA, IA³, or prefix tuning.
> 
> Or must all weight adaptations be submitted exclusively as PEFT LoRA adapters applied to the organizer-provided base model?
> 
> The submission tree mentions “LoRA adapters or model weights,” while the detailed instructions describe only LoRA adapters. Please clarify both competition eligibility and scoring-harness support.


---

## 754586 — Which public tasks cannot pass in the scorer's sandbox? Four questions about the grading image

URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/754586  
OP by Luxshan Thavarasa, LB rank 1433 on 2026-10-31T16:42Z; new comments 0 (staff 0); older comments omitted 0

**Opening post:**

> I ran the public tasks with their own gold patches through the harness (Docker backend, `network_mode none`, `python:3.13-slim`). Once the test dependencies are in place most of them pass, but a fixed set never does, and the failures come in three kinds. I want to know whether the scorer behaves the same way, so everyone can measure against the same set of tasks.
> 
> ## Tasks that fail with the gold patch
> 
> | Tasks | Log line | What I think is going on |
> |---|---|---|
> | requests_6589, 6592, 6629, 6757, 7328, 7433, 7502, 7505 | `OSError: [Errno 101] Network is unreachable` | The tests open a connection to an outside address and expect a timeout. With no network the connect fails at once. |
> | fastapi_14186 | one required test is `@needs_pydanticv1`, the other `@needs_pydanticv2` | Both come from the test patch, and they cannot run in the same environment. A skipped required test counts as a fail. |
> | rich_3486 | one required test has `skipif < 3.11`, the other `skipif >= 3.11` | Same situation. |
> | rich_3472 | `assert 'Foo(\n    ba...' == 'Foo(bar=Attr...'` | Python 3.13 formats the `AttributeError` message differently from 3.12. |
> 
> ## Questions for the organisers
> 
> 1. Which pytest version is in the pre-seeded scoring image? `Dockerfile.sandbox` installs pytest without a pin, so the version depends on the build date. A `pip freeze` of the image, or a pinned digest, would settle this.
> 2. Does scoring use the Docker backend with `network_mode none`, or the subprocess backend? The two differ on exactly the requests cases above.
> 3. Do the hidden tasks carry `FAIL_TO_PASS` and `PASS_TO_PASS` lists, or are the required tests taken from the test patch as in the public code? This decides whether a skipped required test fails a task.
> 4. Can you confirm that the tasks above cannot pass in the scorer's environment, or publish the list of public tasks that your own gold run passes? You have said the hidden set validates at 100%. The same list for the public set would give everyone the same local denominator.
> 
> Thanks. I can share the per-task logs if that helps.


---

## 754295 — Will private leaderboard evaluation use multiple runs to reduce variance?

URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/754295  
OP by Haoran Zhang, LB rank 1779 on 2026-10-30T22:26Z (before cutoff); new comments 3 (staff 0); older comments omitted 0

**Opening post:**

> Hi @ryanholbrook and team,
> 
> Could you clarify how randomness will be handled in the final private leaderboard evaluation?
> 
> Participants have reported different public scores when resubmitting byte-identical ZIP files. Although evaluator updates may explain some differences, stochastic agent behavior could also affect rankings, especially with roughly 60 tasks in the private split.
> 
> Specifically:
> 
> Will each selected submission run once per private task, or will it be evaluated across multiple independent runs/seeds?
> 
> If multiple runs are planned, how many, and will the final score be the average success rate?
> 
> Will private scores use the results already generated during submission scoring, or will selected submissions be rerun after the deadline?
> 
> If the current plan is a single run, would  …[truncated; pre-sweep OP]

**New comments:**

- **Heisenberg, LB rank 4169** — 2026-11-02T09:32Z
  > How many tasks are in the final evaluation? 60 right. So the variance should be around the same as for the test set.
- **Yurnero, LB rank 1** — 2026-11-02T07:08Z
  > Kaggle has never done that and highly likely never will.
  > 
  > I think making your solution stable is one of the intended challenges
  - **Ankith Savio, LB rank 232** — 2026-11-02T09:38Z
    > You dont have to share if its too revealing but do you get your score reliably or does it fluctuate a lot?

---

## 754023 —  stuck in 'Notebook Running' 

URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/754023  
OP by SeanMmmmm, LB rank 4184 on 2026-10-30T03:33Z (before cutoff); new comments 2 (staff 0); older comments omitted 2

**Opening post:**

> "Hi admins, my submission has been stuck in 'Notebook Running' for over 24 hours and blocking my team from submitting (Your team already has 1 pending submissions). Could you please help clear the zombie job? My team name is: [SeanMmmmm]"

**New comments:**

- **Renat, LB rank 2614** — 2026-11-01T20:22Z
  > Same problem
- **dxnnnnn, LB rank 3097** — 2026-11-01T17:22Z
  > Hi hosts — same issue here, and I need the stuck pending job cleared so I can submit again.
  > 
  > - Kaggle username / team: dxnnnnn
  > - Competition: gemma-4-developer-agent
  > - Notebook g4da-submit-v1 Version 1 has been stuck in Notebook Running / Pending since 2026-11-01 01:48 UTC+8
  > - There is no cancel control in the UI, and the pending run blocks new submissions. I need to submit g4da-submit-v2.
  > - I already emailed support@kaggle.com from 971458759@qq.com around 01:07 UTC+8 on 2026-11-02.
  > 
  > Could an admin please cancel or clear that pending submission? Thank you.

---

## 753973 — [BUG REPORT] tool parser can loop forever on an array tool argument, freezing the inference server for the rest of the run

URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/753973  
OP by haji bolot, LB rank 51 on 2026-10-29T23:20Z (before cutoff); new comments 2 (staff 0); older comments omitted 1

**Opening post:**

> **Environment**: the competition wheelhouse's vllm 0.19.1 (vllm/tool_parsers/gemma4_tool_parser.py), served with --tool-call-parser gemma4 and the default non-streaming chat path. The client is adk_submission's LiteLlm, with no explicit timeout.
> 
> **Trigger**: the model emits a tool call where an ARRAY argument holds an element that is not wrapped in Gemma's <|"|> string delimiter, and that element contains ]. For example args:["Fix list[str] handling"] (JSON-style quotes instead of <|"|>).
> 
> **Root cause:** in `_parse_gemma4_array` (lines 271–278, the "bare value" branch), the scan stops at the first `]` inside the element. On the next pass, `i` still points at that `]`. The branch consumes nothing, appends an empty item, and the `while i < n` loop never advances. This runs synchronously on …[truncated; pre-sweep OP]

**New comments:**

- **cc, LB rank 913** — 2026-11-05T11:19Z
  > I've encountered this issue twice.
- **MarchFederico, LB rank 123** — 2026-11-05T08:21Z
  > @ryanholbrook Adding evidence from real runs to this report, and a request for a decision.
  > 
  > **Same parser:** our local `gemma4_tool_parser.py` from vLLM 0.19.1 has the SHA-256 posted in 745138 (`682b2152…`).
  > 
  > **Real runs:** we had two server freezes during local evaluation with the competition's vLLM version, in roughly 830 tasks with agents that use `run_skill_script`. One API process reached 26.7 GB before it was OOM-killed. The in-flight output wasn't captured, so we can't prove these exact inputs caused them, but the symptoms match this report.
  > 
  > **Reproduced in a subprocess with a timeout (never returns):**
  > ```
  > args:["Optional[int]"]
  > args:["run","x = a[0]"]
  > x:[a<|"|>]
  > args:[[<|"|>Optional[<|"|>]]
  > args:[[<|"|>x]<|"|>,<|"|>y<|"|>]]
  > ```
  > 
  > **Why it matters:** the parser runs inside the API server, so as this thread describes, one such call can stall every later task in a scoring run. A valid agent could lose much of its score to a single malformed call, for reasons unrelated to how well it solves tasks.
  > 
  > **The fix is small:** vLLM fixed the loop upstream in [#41991](https://github.com/vllm-project/vllm/pull/41991), merged 8 May, by stopping when the parser makes no progress. We tried a similar guard locally, along with skipping strings in the nested-array scan, and all of the strings above returned normally.
  > 
  > **Our request:** could the hosts say whether the scorer will get this guard, or whether it stays as it is? Either answer helps, because teams need to know if they should remove array-argument tools before the deadline.

---

## 752848 — Why does nobody have a score of over 0.24?

URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/752848  
OP by Sahil Das, LB rank 774 on 2026-10-26T15:09Z (before cutoff); new comments 1 (staff 0); older comments omitted 9

**Opening post:**

> A score of 0.24 would be like 2 patches passing every 10. That just seems like terrible agentic performance. I think its the model we have to use being weak, because how can everything everyone tries just plateau to an objectively bad performance at the repo level tasks this model is supposed to work on?

**New comments:**

    - **Nir Aberman, LB rank 177** — 2026-10-31T07:11Z
      > Thanks, that clears it up: the unsolvable cases are a public-env artifact, not a hidden-set property.
      > 
      > Since you asked earlier about locating vs. editing time, here is what we measured on 163 runs: the gold file is opened by call 2-3 in ~84% of runs, but the first edit lands at ~106 s in solved runs vs ~183 s in failed ones, and post-edit time is ~80 s in both. Prompt rules to edit earlier were mostly ignored.
      > 
      > Curious whether your jump past 0.24 came from shrinking that find-to-commit gap, and if so, whether it was config/tooling rather than prompt wording?

---

## 750907 — Looking for 1–2 teammates — TPU eval engine that matches the scorer + LoRA pipeline (0.17)

URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/750907  
OP by Mehmood Zafar, LB rank 1199 on 2026-10-20T04:39Z (before cutoff); new comments 1 (staff 0); older comments omitted 0

**Opening post:**

> Hi all, I'm looking for 1–2 serious teammates for the main track (and the paper track).
> 
> What I have so far:
> - Public LB 0.17 (ADK agent on Gemma 4 31B, many prompt/skill ablations with run logs)
> - A free evaluation engine: Gemma 4 31B served with vllm-tpu on Kaggle TPU v5e-8, running the same tasks as the scorer. Its results match real GPU runs (21 vs 21–22 on the same 51 tasks), so we can test ideas without burning GPU quota
> - A LoRA self-distillation pipeline (training on the agent's o[img]](YouTube video url to embed)](YouTube video url to embed)wn successful trajectories with thinking, exported to PEFT, verified to load in the scorer's vLLM)
> - Failure analysis: the agent finds the right file in ~90% of tasks; most losses are wrong/incomplete fixes
> 
> What I'm looking for:
> - Someone with …[truncated; pre-sweep OP]

**New comments:**

- **YosQuant, LB rank 698** — 2026-11-01T10:00Z
  > Hi Mehmood — interested. Solo at 0.18 public (v2: ADK agent + one-shot patch_reviewer sub-agent). Ran an honest dev-eval on a fixed 30-task subset: v1–v6 prompt/thinking-budget changes all within noise (11–12/30); main failure = wrong patch + tool-call cap. Plan next: structural reproduce→patch→test→fix loop. Agree on equal split + held-out selection. Happy to start a public-info trial. Also on the paper track.

---

## 750521 — Different public scores from an identical submission ZIP - reproducibility question

URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/750521  
OP by ELhamdaoui AM, LB rank 99 on 2026-10-18T17:28Z (before cutoff); new comments 1 (staff 0); older comments omitted 6

**Opening post:**

> Hi everyone,
> 
> We resubmitted a byte-for-byte identical agent ZIP and obtained different public scores, despite making no changes to the prompts, model settings, tools, or budgets.
> 
> Our configuration uses temperature 0.2, with no explicit generation seed. We understand that fixing temperature does not guarantee identical generations, and that different agent trajectories or wall-clock execution times can affect the final patches.
> 
> This makes it difficult to compare versions. For example, we might conclude that a submission scoring 0.22 is better than one scoring 0.15, while part or potentially all of that difference could come from run-to-run variability rather than a genuinely better agent. These numbers are illustrative; we are not claiming that any particular leaderboard result is due to …[truncated; pre-sweep OP]

**New comments:**

- **fan yunsheng, LB rank 941** — 2026-11-01T08:18Z
  > Hi organizers and everyone,
  > 
  > I resubmitted a byte-identical submission.zip to measure leaderboard noise, and the two runs differ far more than sampling noise would explain:
  > 
  > - Submitted 2026-10-27 16:45 UTC ("v0.3 budget-fit, first submission", ref 57707644): public score 0.18
  > - Submitted 2026-10-31 03:06 UTC ("v0.3 resubmit #2 (same file, noise check)", ref 57824740): public score 0.01
  > 
  > Both files have sha256 556432843f7cb935d2d90662ddf12a127fdb9616ea169036e02b6218e010339e, and both runs completed without error. With ~58 public tasks, 0.18 is about 10 tasks and 0.01 is 0–1 task.
  > 
  > For reference, three local runs of a closely related version on 121 public tasks resolved 50, 50 and 47 tasks (SD ≈ 2), and other community reports put same-ZIP leaderboard variation at a few tasks. A ~10-task drop looks like most tasks never ran normally, rather than unlucky sampling.
  > 
  > One candidate I've seen on the forum is the reported tool-parser loop on array-valued tool arguments that can freeze the inference server for the rest of the run; if that happened early, later tasks would fail quickly while the submission still completes. I can't confirm this from my side, since participants don't see run logs.
  > 
  > Could you check:
  > 1. Whether the inference server stalled or crashed during submission 57824740 (e.g., long gaps with no model requests, or most tasks ending with empty patches)?
  > 2. If it was an infrastructure or parser failure, whether such runs can be re-scored or excluded?
  > 3. Whether there is any way for participants to see per-task status or runtime logs for a scored submission, so we can tell agent regressions from platform failures?
  > 
  > Happy to share more details. Thanks!

---

## 749191 — Question about LoRA

URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/749191  
OP by Nir Aberman, LB rank 177 on 2026-10-14T08:12Z (before cutoff); new comments 1 (staff 0); older comments omitted 7

**Opening post:**

> @Ryan Holbrook - LoRA bundles fail to start on 4xL4 under the official VllmServer path
> 
> Setup: adk_submission VllmServer (unmodified build_cmd), gemma-4-31b-it-qat-w4a16-ct/2, ONE adapter, rank 16,
> TP=4, max-model-len 32768, gpu-memory-utilization 0.8. Command built by VllmServer:
>   ... --enable-lora --max-loras 1 --max-lora-rank 16 --lora-modules main_lora=.../adapters/main_lora
> Weights and KV cache load fine (~25 min), then every attempt fails with:
>   RuntimeError: CUDA out of memory occurred when warming up sampler with 256 dummy requests.
>   Please try lowering `max_num_seqs` or `gpu_memory_utilization`.
> Reproduced 3 times (8 adapters x r128, 2 x r16, 1 x r16). The same base bundle without LoRA starts and scores normally.
> 
> Questions:
> 1. What GPU and gpu_memory_utilization does the scori …[truncated; pre-sweep OP]

**New comments:**

- **Jane, LB rank 4011** — 2026-11-03T01:18Z
  > Hi @ryanholbrook ,
  > 
  > Could you help verify whether the LoRA adapter was actually active during scoring for submission 57873732?
  > 
  > Submission details:
  > - Competition: Gemma 4 Developer Agent
  > - Submitted: November 1, 2026, 13:54 UTC
  > - Status: Complete; public score: 0.08
  > - Base model: gemma-4-31b-it-qat-w4a16-ct
  > - Root agent setting: adapter: weighted_actions
  > - Adapter directory: adapters/weighted_actions/
  > - LoRA rank: 16
  > - Original ZIP size: 489,845,533 bytes, including adapter_model.safetensors
  > 
  > Our AutoDL evaluation logs show the adapter being loaded and requests being routed to weighted_actions. However, this does not confirm that the adapter's nonzero weight updates were applied in the Kaggle scorer.
  > 
  > I saw the report in discussion 743508 about LoRA weights being reset through duplicate Gemma4 decoder-layer registrations, even when the adapter is reported as loaded.
  > 
  > Could you please confirm:
  > 1. Whether weighted_actions was loaded and remained active during inference for this submission.
  > 2. Whether the scorer version used for this run included a fix for the issue reported in discussion 743508.
  > 3. If this run was affected, whether rescoring is possible or a new submission is required.
  > 
  > Separately, the submission page shows about 61 KiB, while the original download is about 467 MiB. Is that only a display-metadata difference?
  > 
  > I can provide the frozen ZIP hash and adapter configuration if needed. Thank you!ryanholbroo

---

## 748999 — Looking for a team or team mates

URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/748999  
OP by Moez Ur Rehman, LB rank 63 on 2026-10-13T18:39Z (before cutoff); new comments 1 (staff 0); older comments omitted 0

**Opening post:**

> I am a postgraduate MSCS student researching on AI agents and their behaviors involving how LLMs make predictions and decisions (mechanistic interpretability) upon which the agent works. I am a former mechatronics and robotics engineer having 2 research publications in that domain https://scholar.google.com/citations?view_op=list_works&hl=en&hl=en&user=H96fD_kAAAAJ. My FYP RP is currently in process of publishing and a recent paper based on the explainability and robustness of NLP models is also in process of publication. I have successfully won the MediaEval'26 benchmarking competition for the Missing Pieces and Misinformation task for which my write-ups were presented in ICMR'26 Amsterdam this year. My papers of that competition are also in process of being published. You all can verify  …[truncated; pre-sweep OP]

**New comments:**

- **Soumyadip_007** — 2026-11-05T21:46Z
  > Hello , I am willing to join , I sent you a message.

---

## 748287 — New Gemma 4 Models Available: 12B, E4B, and E2B

URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/748287  
OP by Ryan Holbrook [STAFF] on 2026-10-11T11:48Z (before cutoff); new comments 1 (staff 0); older comments omitted 37

**Opening post:**

> Hi everyone,
> 
> We've added support for [several smaller Gemma 4 variants](https://www.kaggle.com/models/google/gemma-4/other/). You can now use any of the following models for your agents:
> - `gemma-4-31b-it-qat-w4a16-ct`
> - `gemma-4-12b-it-qat-w4a16-ct`
> - `gemma-4-e4b-it-qat-w4a16-ct`
> - `gemma-4-e2b-it-qat-w4a16-ct`
> 
> We don't support mixing variants within a submission, however. Every agent and subagent in your submission must use the same variant (though they can attach different LoRA adapters.)
> 
> These smaller models open up some new strategies:
> 1. **More test time compute:** Inference is faster and memory burden lower so you can execute more and longer reasoning turns and iteration cycles. You could also experiment with using `ParallelAgent` for concurrent LLM calls (though tool calls are  …[truncated; pre-sweep OP]

**New comments:**

- **SANIDHAYA SHARMA, LB rank 3488** — 2026-10-31T05:00Z
  > My first submission (10 min and 60 tool calls per task in eval_config.yaml) ended with Notebook Timeout. Locally my agent averages about 6.3 min per task on the public tasks. Could you share how many tasks are in the hidden test set, and whether the scorer runs tasks one at a time or in parallel? That would help set per-task budgets that fit the 12 hour limit. Thanks.

---

## 747708 — Submission stuck in "Running" for 30+ hours, blocking new submissions (pending limit)

URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/747708  
OP by Nir Aberman, LB rank 177 on 2026-10-09T11:53Z (before cutoff); new comments 2 (staff 0); older comments omitted 0

**Opening post:**

> Hi @ryanholbrook and Kaggle team,
> I have a submission that has been in "Running/Scoring" for more than 30 hours, and because of the new pending-submission limit I can't submit anything else.
> Details
> Submission ID: [paste the ID from My Submissions]
> Submitted: 2026-10-08, around [time] UTC
> Archive: a byte-identical resubmit (sha256 eff43dd2…) of my 2026-10-07 submission. The 10-07 run first ended in "Kaggle Error", and batch recovery later scored it at 0.10. Since both are the same archive, I resubmitted the same archive after the error, before the recovery fix was announced.
> Runtime: it uses an 8-minute per-task cap. In my own notebook runs on 4×L4, the full 120 tasks finish well within 12 hours.
> Questions
> Is this submission still waiting in the queue, actually running, or stuck?
> If it is  …[truncated; pre-sweep OP]

**New comments:**

- **Harisdak Singh Banwait, LB rank 4817** — 2026-11-03T18:03Z
  > Indeed I am also getting the same issue
- **stm-canco, LB rank 2639** — 2026-11-03T16:29Z
  > Hi @ryanholbrook 
  > Thank you again for hosting, and for all your help. 
  > I do have the same issue of a stuck submission as well for over the past about 30 hours. 
  > I wonder if you or anyone in ur team could help check it.
  > Thank you again!

---

## 747519 — Update on "Kaggle Error" Submissions & Queue Delays

URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/747519  
OP by Dustin [STAFF] on 2026-10-08T22:09Z (before cutoff); new comments 6 (staff 0); older comments omitted 95

**Opening post:**

> Hi everyone,
> 
> I wanted to give an update on the long submission wait times and "Kaggle Error" failures many of you have been seeing over the past couple of days.
> 
> ## What Happened
> 
> Due to very high submission volume using L4s, submission jobs have been facing long queue times before actually getting a machine to run. Submissions that waited \>15h to start were being marked as “Kaggle Error” even if they eventually did run.
> 
> ## What We Fixed
> 
> 1. **Extended Queue Timeout:** We've drastically extended the queue allowance so submissions will no longer be timed out while waiting to run.  
> 2. **Scoring Submissions that had Queue Timeouts:** We are actively reprocessing all affected submissions from the past few days. If your notebook ran to completion and produced a valid submission file, it is  …[truncated; pre-sweep OP]

**New comments:**

- **James Lo** — 2026-11-03T16:47Z
  > Hello, the Notebook Timeout issue persists, and I haven't been able to make a successful attempt in the past few weeks (the last one was 2 days ago). Is there any extension or an estimated repair completion time? Thank you.
- **MA Hasan, LB rank 1659** — 2026-11-02T14:42Z
  > Our submission 57862929 is in PENDING state for 32 hours!
- **Capitaalgain, LB rank 1893** — 2026-11-02T09:28Z
  > @herbison @ryanholbrook
  > 
  > Status inquiry only: submission 57858834 pending for approximately 30 hours
  > 
  > Hello Kaggle Support / competition operations team,
  > 
  > Could you check the current processing state of our submission to Google - The Gemma 4 Developer Agent Competition?
  > 
  > Competition: https://www.kaggle.com/competitions/gemma-4-developer-agent
  > Account: capitaalgain
  > Submission ID: 57858834
  > Accepted: 2026-11-01 03:26:07 UTC
  > Latest official API check: 2026-11-02 09:24:57 UTC
  > Status: PENDING; no public score or terminal error, approximately 30 hours after acceptance.
  > 
  > Please confirm:
  > 1. Is it waiting for resources, actively executing or validating, or stalled?
  > 2. Is it affected by a known platform incident or evaluation-queue delay?
  > 3. Is there an estimated recovery or completion time, or an expected next status update?
  > 
  > We saw the historical queue-delay update (discussion 747519) and a recent separate participant report of 29+ hours pending (discussion 754845). We understand these do not establish the cause of our submission's delay. We are requesting status information only, not code debugging or hidden evaluation/test details.
  > 
  > Please preserve this original submission and our previous scored submissions. Do not cancel, reset, rerun, replace, or resubmit anything. We have not submitted a duplicate and will continue read-only monitoring.
  > 
  > Thank you.
- **Sawan Ruparel, LB rank 3084** — 2026-10-31T14:07Z
  > Wondering if there a recipe I am missing, my submissions are getting timed out. Is it some setting or my understanding of the timeouts work. Has anyone had a opportunity where they faced multiple timeouts and realized its problem with how they have designed it that it works on local but get timeout when post submission, also not instantly but after say 1 d or more than 14 hours ..
  - **MA Hasan, LB rank 1659** — 2026-11-02T14:44Z
    > Maybe the agent is spending too much time on each task and reaching the 12 hour limit. Limiting the time per task to 6-8 minutes could solve it.
- **?** — 2026-10-31T15:04Z
  > 

---

## 744566 — thinking_budget and seed are missing from HTTP requests in my wheelhouse test

URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/744566  
OP by Veronika Yaitskikh, LB rank 779 on 2026-09-30T10:12Z (before cutoff); new comments 2 (staff 0); older comments omitted 3

**Opening post:**

> Hi organizers,
> 
> I found a possible problem with thinking_budget and seed. I tested the packages from the official wheelhouse v25 in a Kaggle CPU notebook.
> 
> I used a short message, the same in every test. The request went through the installed adk_submission thinking-config bridge, Google ADK and LiteLLM. A small local HTTP server recorded the final request and returned a fixed reply. I did not load Gemma or run the full scoring process.
> 
> Packages: adk-submission 0.2.11, google-adk 1.36.1, google-genai 2.11.0, litellm 1.82.4 and openai 2.32.0.
> 
> Results:
> - thinking_budget=4096 and thinking_budget=1024 produced the same HTTP body. Neither request included a numeric thinking budget.
> - seed=1234 and seed=4321 also produced the same HTTP body. The seed field was missing.
> - As a check, changing m …[truncated; pre-sweep OP]

**New comments:**

- **Veronika Yaitskikh, LB rank 779** — 2026-11-03T07:09Z
  > I re-tested this with wheelhouse v28 after the organizer’s update. In that environment, both parameters reached the final vLLM HTTP request: `thinking_budget` was mapped to `thinking_token_budget`, and `seed` was present. I also verified on the GPU path that different thinking budgets were applied.
  > 
  > The patch was in the competition submission/bridge path, so it did not necessarily require a custom Google ADK wheel. I have not re-tested the latest wheelhouse or the current hidden scorer, so I cannot confirm whether every current scoring run uses the same patched code.
  - **?** — 2026-11-03T06:27Z
    > 

---

## 743683 — Rerunning Failed Submissions

URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/743683  
OP by Ryan Holbrook [STAFF] on 2026-09-26T12:01Z (before cutoff); new comments 3 (staff 0); older comments omitted 102

**Opening post:**

> Hi everyone,
> 
> Some submissions since yesterday were failing with `"Your notebook has requested more CPU, GPU or TPU resources than are available."` I believe I've resolved the issue, though please let me know if you're still having issues. I will rerun the affected submissions on Monday so that you won't be losing a submission.

**New comments:**

- **albmartin, LB rank 284** — 2026-11-03T00:02Z
  > Hello,
  > 
  > My submission to the Gemma 4 Developer Agent Competition ended with Notebook timeout.
  > 
  > The submission archive was generated and locally verified successfully:
  > 
  > submission.zip exists and contains exactly four files.
  > 
  > agent.yaml is located at the archive root.
  > 
  > All files passed CRC, byte-by-byte content and SHA256 verification.
  > 
  > The archive follows the same structure as my previous submission.
  > 
  > The configuration uses gemma-4-31b-it-qat-w4a16-ct, with no LoRA adapters.
  > 
  > Could you please check whether this timeout was caused by the scoring infrastructure, inference server, or the agent execution itself? If it was an infrastructure-related failure, would it be possible to rerun the submission?
  > 
  > Submission ID: [INSERT ID]
  > 
  > Notebook version: [INSERT VERSION]
  > 
  > Thank you.
- **dmitry batov, LB rank 1915** — 2026-11-02T16:06Z
  > Hi Kaggle team,
  > 
  > My Gemma 4 Developer Agent submission has been stuck in "Notebook Running" for over 18 hours.
  > Notebook: Gemma4 SWE Agent T8 Static - v1  
  > Script Version ID: 364682696
  > The original notebook completed successfully in 21 seconds and generated the required submission.zip.
  > Could you please check whether the submission is still being evaluated, queued, or stuck due to an infrastructure issue?
  > 
  > Thank you!
- **MatthewEStevenson, LB rank 1071** — 2026-11-02T13:17Z
  > Hi @ryanholbrook,
  > 
  > My first Gemma 4 Developer Agent submission has remained at **"Notebook Running" for approximately 17 hours**, without a public score or error message.
  > 
  > The saved notebook (Version 1) completed successfully in 19 seconds and generated the expected `submission.zip`.
  > 
  > Notebook:
  > https://www.kaggle.com/code/matthewestevenson/gemma-4-v10-final-submission?scriptVersionId=364641369
  > 
  > Could you check whether the competition evaluation is queued, actively running, or encountering a scorer-side problem?
  > 
  > I'd prefer not to cancel or resubmit without understanding what's happening.
  > 
  > Thanks!

---

## 742807 — Clarification on distillation from external LLMs

URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/742807  
OP by c-number on 2026-09-23T15:38Z (before cutoff); new comments 2 (staff 0); older comments omitted 12

**Opening post:**

> Hi organizers,
> 
> My understanding is that using external LLM APIs to generate synthetic training data has generally been allowed in recent Kaggle competitions. Given Section 2.6, I would expect this to be permitted here as well, subject to the competition’s external data and model requirements.
> 
> Could you clarify whether participants may use proprietary models, such as OpenAI Astra or Claude Opus 5.5, to generate code patches and agent trajectories for training Gemma specifically for this competition?
> 
> Regarding provider restrictions on developing competing models, my current understanding is that training a model solely for this competition may be permissible, while deploying or using the resulting model outside the competition could raise separate concerns. I recognize that participants r …[truncated; pre-sweep OP]

**New comments:**

- **Max Ma** — 2026-11-03T19:12Z
  > may we send the public dev tasks (issue text, snapshot code) to a third-party LLM API like DeepSeek to generate training trajectories, or should Competition Data only go through self-hosted models?
  - **TheFusionCube, LB rank 1413** — 2026-11-04T06:32Z
    > You should be free to do whatever you like with the public data.

