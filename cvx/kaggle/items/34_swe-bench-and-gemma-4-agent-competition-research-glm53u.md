# SWE-bench, Coding-Agent Training, Data Science, Self-Improvement, and Winning the Google Gemma 4 Developer Agent Competition: A Beginner's Guide to SWE-bench — Tailored to the Competition

*A comprehensive, beginner-spined research report prepared for a competitor in "Google - The Gemma 4
Developer Agent Competition" (Kaggle competition 149921).*

---

## Research metadata

| Field | Value |
|---|---|
| Report title | Beginner-to-competition-ready guide: SWE-bench, coding agents, training, data, self-improvement, and the Gemma 4 competition playbook |
| Required filename | `swe-bench-and-gemma-4-agent-competition-research.md` |
| Version | 1.0 (2026-10-02) |
| Research cutoff | **2026-10-02 inclusive** (fixed historical cutoff; report written on the cutoff day, so same-day sources are admissible and labeled with access times) |
| Research dates | 2026-10-02 (single-day session; backbone evidence includes same-day-verified material from the companion [consol] run and local snapshots dated 2026-09-29/30, each labeled) |
| Tooling | research-toolkit (CDP-driven headed browser on per-folder persistent profile; DDG/keyless engine ladder; arXiv API; direct page fetches). **Zero MCP-quota calls. Zero PAYG spend.** All web content treated as untrusted data per the v4 protocol's untrusted-content discipline (§5.6) |
| Governing handoff | `sysprompts/deep-research-handoff-swe-bench-gemma-4-agent-competition[m31f].md` (18 workstreams WS-00…WS-17; RQ-PRIMARY, RQ-01…09.x, VQ-01…08, SQ-01…06; gates G1–G15) |
| Local corpus | `input/kagglecomp/` — official Kaggle page snapshots (2026-09-29), HARNESS_README.md (49 KB harness reference), 22-thread discussion-board intel (2026-09-30), paper-track intel (2026-09-30), BCF httpx-3672 simulation notes |
| Reused evidence backbone | `independent_research/2026-10-02-swebench-gemma4-agent-comp/` (companion [consol] deliverable written the same day; 36 timestamped page dumps; verified WS-00 fact sheet). Reuse is legal under the cutoff because every reused fact was accessed 2026-10-02 |
| Volatility warning | **Competition facts are volatile and dated.** Participation counters drift daily; host fixes land weekly (wheelhouse versions); two platform incidents (2026-09-26 resource-failure wave; 2026-09-30/10-01 GPU-outage wave) changed submission outcomes inside 48-hour windows. Every competition-specific claim below carries its verification date; re-verify before acting (Appendix I checklist) |
| Limitations | (1) The competition leaderboard is login-gated for anonymous sessions — public-board standings rely on community EDA numbers labeled time-sensitive. (2) The private test split is unobservable by design; all hidden-set claims are bounded inferences from host statements. (3) Several SEO benchmark aggregators were located and rejected as unverifiable (contradiction ledger C-1/C-8). (4) Gemma 4 shipped 2026-03-31, so third-party training lore for this exact model is ≤ 6 months old. (5) mini-SWE-agent publishes as software, not a paper — its leaderboard standardization evidence is the official site itself, not a peer-reviewed source |

---

## 0. Read this first

### 0.1 What this document is, and who it is for

This is a research-grounded **guide plus playbook** with two jobs: (1) take a reader who is comfortable
with Python and basic ML but *new to SWE-bench and agentic RL* from zero to genuine understanding of how
repository-level coding agents are built, measured, trained, and made to fail; and (2) convert that
understanding into a ranked, evidence-labeled plan for the one competition that matters here — Kaggle
149921, in which a mandatory frozen Gemma 4 31B must be shaped into an autonomous software-engineering
agent through prompts, declarative agent configuration, skills, and (optionally) LoRA adapters.

It is written for: a competitor (you) working solo or with 1–2 teammates, with no assumed training budget
(both the $0/frozen-model tier and the consumer-GPU tier are covered), who wants over-inclusive,
information-dense answers rather than summaries. It is deliberately not a generic survey — every section
ends by pointing back at what its contents mean for this specific competition.

### 0.2 The competition fact sheet (one page, verified 2026-10-02)

| Field | Verified value | Basis |
|---|---|---|
| Competition | "Google - The Gemma 4 Developer Agent Competition," Kaggle 149921, hosted by Google DeepMind; Featured Prediction Competition + separate $35k paper-track hackathon | Overview page (live re-fetch 2026-10-02) |
| Task | Post-train Gemma 4 into an autonomous SWE agent that resolves real repo-level Python bug-fix/feature issues from issue text | Overview |
| Metric | Resolution rate: share of tasks whose submitted patch passes Phase-2 verification — pytest exit 0 AND at least one test passed AND zero failures/errors AND no required test skipped | Overview + HARNESS_README §8 |
| Test set | ~120 hidden tasks, evenly split public/private, curated from **private repositories** (host-confirmed in thread 744951); public LB ≈ 58 tasks (community EDA, 2026-09-30) | Data page + host reply + EDA |
| Training data given | 129 public tasks (fastapi, rich, requests, httpx) with gold patch + test_patch each; 127 unique code graphs (256 files incl. hardlinks); 256-dim per-node embeddings; 124 offline wheels | Data page |
| Base model | `gemma-4-31b-it-qat-w4a16-ct` — **mandatory and only allowed** (`ALLOWED_MODEL_NAMES` frozenset check); Apache 2.0; W4A16 QAT compressed-tensors | HARNESS_README §3.2 |
| Serving | 4× NVIDIA L4 (96 GB); vLLM TP=4; max_model_len 32,768; max_loras=8; max_lora_rank=128; gemma4 tool-call + reasoning parsers | HARNESS_README §3.1 |
| Time | 12 h wall clock for all ~120 tasks inclusive of sandbox setup, excluding patch validation; per-task defaults timeout_seconds=300, max_tool_calls=100, max_time_minutes=60, max_turns=500 (settable via eval_config.yaml) | Overview + HARNESS_README §7 |
| Submission | submission.zip < 3 GiB unpacked: agent.yaml (declarative ADK config — **no Python entrypoints**), prompts/, sub_agents/, adapters/ (LoRA safetensors), skills/ | HARNESS_README §2 |
| Sandbox | Air-gapped Container A (network_mode none); verification in anti-tamper Container B that resets test files before applying the patch (4-pass resilient apply) | HARNESS_README §5/§8 |
| Limits and dates | 1 submission/day; 2 finals selected; team ≤ 5; paper deadline 2026-11-12; entry + merger deadline 2026-11-25; final submission 2026-12-02 23:59 UTC | Overview (live re-verified 2026-10-02) |
| Prizes | $65k main ($37k/$18k/$10k) + $35k paper ($15k/$10k/$10k); winners must release under Apache 2.0 with reproducibility docs | Rules §2.5/2.8 |
| Permitted | LoRA/PEFT (≤ 8 adapters, rank ≤ 128), distillation from license-compliant external teachers (host answer, thread 742807), custom prompts/skills/sub-agents/sampling/thinking config | Rules + host |
| Prohibited | Test-file/conftest/pytest.ini edits (anti-tamper resets), network in sandbox, any non-Gemma-4 base or multi-base, Python entrypoints, label mining | Harness + rules |
| Best public baseline | ≈ 0.12 (romanrozen prompts-only notebook); forks 0.05–0.08 with ±0.04 run variance; **no adapter submission had produced a public score as of 2026-10-02** (KV-collapse + zeroing bugs; see §0.4 and Part IX) | Thread 743140 + discussion intel |
| Known broken (host-acknowledged) | Thinking tokens dropped (fix in wheelhouse, 2026-10-01); read_file line-range TypeError (fixed); search_similar_code uncapped output (cap promised); LoRA KV collapse 46,048→7,600 tokens (sizing workaround shipped with wheelhouse v25 per participant report in thread 744861); 12 h overrun errors the whole run (fix planned); compaction overflow at 32,768 threshold discards patches (17–33% of sessions; 44/44 overflow samples produced empty patches); double-JSON escaping of tool results (22% edit failures vs 0% raw-text) | Discussion threads, dated |
| Fresh incidents | GPU outage overnight 2026-09-30→10-01 caused a wave of no-score "Notebook Threw Exception" failures that consumed daily slots; host: resolved, "submissions should be working again" (thread 744807, pinned); rerun policy for that wave unconfirmed | Live fetch 2026-10-02 06:20Z |

The full fact sheet with per-field verification dates is Appendix C; the permission map is §6 of the
companion table set (Appendix E); the host-fix status board is reproduced with dates in Part IX §14.1.

### 0.3 Your three reading paths

**Path 1 — One-week cram (competitive minimum, ~25–30 focused hours).** Read §0 (this), §2 (executive
summary), §3 (key findings 1–10 only), §7 (Part II: measurement — because every decision you make will be
a measurement decision), §8.1–8.5 (agent stack core), §14 (the playbook, all of it), Appendix A glossary
on demand. Skip training (Part IV) and data (Part V) except §9.1 (the "should I train at all" decision
framework — the answer this week is *no*). Days 1–2 set up the local replica and reproduce the ≈0.12
baseline; days 3–5 implement playbook moves 1–5; days 6–7 run the paired dev-split A/Bs of §14.8.

**Path 2 — Four-week study (beginner → genuinely competent, ~80–100 hours).** Week 1: Part I (§6) +
Part II (§7) with the SWE-bench paper (arXiv 2310.06770) and the Codex pass@k paper (2107.03374) as
primary reading. Week 2: Part III (§8) + SWE-agent (2405.15793) and Agentless (2407.01489). Week 3:
Part IV (§9) + Part V (§10) with SWE-Gym (2412.21139), SWE-smith (2504.21798), Skywork-SWE (2506.19290),
Kimi-Dev (2509.23045); build the dev split and the eval harness as you go. Week 4: Part VI (§11) +
Part VII (§12 case studies) + Part VIII (§13); then execute the playbook's Tier-A plan with the ablation
calendar of §14.8. Every week ends with an artifact, not just reading (§16.2 has the checklist).

**Path 3 — Playbook-only (you already know SWE-bench; ~3 hours).** Read §0.4, §14 (playbook) in full,
§15.7 (playbook red-team), and Appendix G (ablation worksheet) + Appendix I (re-verification checklist).
The single-page version: frozen-model branch, graph-first localization, never lose a patch, budget
governor at ~6 min/task, issue-reproduction reranking of ≤ 3 candidates, LoRA gated behind a loud-adapter
scorer test, and never iterate on the public LB — iterate on a paired local dev split.

### 0.4 The single most important thing beginners get wrong

**Beginners treat the score as a property of the model. It is a property of the (model, scaffold, harness,
test suite, budget) tuple — and in this competition the model is frozen, the harness is fixed, and the
budget is shared, so the *entire* score difference between you and the next team comes from the scaffold
and the operational discipline wrapped around the same Gemma 4 31B everyone else gets.** The concrete,
measured evidence for this claim: the official SWE-bench leaderboard had to standardize on one scaffold
(mini-SWE-agent) before model numbers meant anything; DeepSeek V3.2 drops from 70.0 to 60.0 on the same
benchmark when run in reasoning mode under the same standardized scaffold; 22% of edit attempts fail from
a JSON-escaping quirk that has nothing to do with model capability; 44 of 44 sampled context-overflow
sessions produced empty patches (a 100% loss of otherwise-earned work); and a full GPU-outage day of
submissions died with no score at all. The runner-up misconception — that the LoRA adapter is the main
lever in a "post-training" competition — is directly falsified by the scoreboard: the best public score
(≈0.12) is prompts-only, and no adapter submission has scored at all yet (Part IX §14.1, U2 gate).

### 0.5 How to use this document when the competition rules change

The report is built to survive churn: (1) every competition fact carries a date and a source thread;
(2) the host-fix status board (Part IX §14.1) separates *promised* from *deployed*; (3) the falsifier
list (§14.15) tells you exactly which observations should change the plan; (4) Appendix I is a
re-verification checklist designed to be re-run before each submission. When a rule or harness behavior
changes, re-run Appendix I, check the pinned host replies in the discussion forum, and re-evaluate only
the playbook rows whose evidence tag cites the changed fact — the research backbone (Parts I–VIII) is
about the field, not about this week's scorer build, and will remain valid much longer than any
operational detail.

---
## 1. Original request and how this report answers it

### 1.1 The request, restated

Follow the [m31f] deep-research handoff: produce a comprehensive beginner's guide covering (a) SWE-bench —
what it is, its variants, scores and their semantics; (b) coding-agent architectures and scaffolds;
(c) training techniques for coding agents (SFT, RL, distillation); (d) data science for agents
(collection, curation, analysis); (e) self-improvement methods and their failure modes; and (f) a
2025→Oct-2026 advances round-up — all tailored to winning Kaggle 149921, grounded in the local
`input/kagglecomp` corpus, externally researched with the research-toolkit (no MCP quota), delivered as
markdown with QC'd tables in a dated deliverables folder, at the required filename following the handoff's
§13 structure.

### 1.2 Objective → section map

| Objective | Sections |
|---|---|
| Understand the competition precisely (metric, constraints, rules) | §0.2, Part IX §14.1, Appendices C–D |
| Understand SWE-bench and its family, incl. validity crisis | Part I (§6) |
| Read scores and leaderboards correctly; audit entries | Part II (§7) |
| Choose and design the agent stack | Part III (§8) |
| Decide whether/how to train | Part IV (§9) |
| Build the data and eval pipeline | Part V (§10) |
| Understand self-improvement safely | Part VI (§11) |
| Learn from documented wins and failures | Part VII (§12) |
| Know what changed 2025→Oct 2026 | Part VIII (§13) |
| Act: the ranked plan | Part IX (§14), Appendices G–H |

### 1.3 Clarifications, responses, and defaults applied

The handoff defines 12 clarifying questions (CQ-01…CQ-12) with conservative defaults; all defaults were
applied (no user override arrived before cutoff):

| CQ | Default applied |
|---|---|
| CQ-01 compute/training budget | Both tiers covered: $0 frozen-model primary; consumer-GPU (≤ 24 GB) LoRA secondary |
| CQ-02 experience level | Python-competent, ML-literate, new to SWE-bench and agentic RL |
| CQ-03 deliverable type | Markdown report + appendices; no code deliverable beyond schemas/pseudocode |
| CQ-04 inference limits | Competition's fixed envelope (4×L4, 32,768 ctx, 12 h) treated as ground truth |
| CQ-05 team size | Solo or 1–2 |
| CQ-06 rules volatility | Dated facts + re-verification checklist (Appendix I) |
| CQ-07 length | Comprehensive; no word cap; no padding |
| CQ-08 math depth | Concepts + light math + pseudocode; derivations only where load-bearing (pass@k, McNemar, KV arithmetic) |
| CQ-09 scope of "coding agents" | SWE-bench-class repo-level agents; adjacent tools as context only |
| CQ-10 novelty vs consolidation | Consolidation with competition-specific synthesis |
| CQ-11 prior reports | Same-day [consol] backbone + local corpus reused (cutoff-legal); gaps researched fresh |
| CQ-12 citation style | Numbered inline [S#] with grouped source list (§21) + BibTeX (Appendix B) |

Non-assumptions honored throughout: nothing post-2026-10-02 cited as evidence; no login-gated number
treated as authoritative; no host-promised fix treated as deployed until confirmed; no cross-harness score
comparison without normalization labels.

---

## 2. Executive summary

### 2.1 For a competitor: the ten things that matter most, ranked

1. **The frozen base model is strong; the risk is operational.** Gemma 4 31B posts LiveCodeBench v6 80.0,
   Codeforces Elo 2150, GPQA Diamond 84.3, Terminal-Bench Hard 36.0 (vs 14.0 for its MoE sibling) — a
   2025-frontier-open-model band [S14]. Nothing about capability justifies a losing position.
2. **Every public LB point so far came from prompts, not adapters.** Best public ≈ 0.12 prompts-only; the
   official sample *with* adapters failed; no adapter submission has scored (KV collapse + silent zeroing;
   sizing workaround shipped with wheelhouse v25, unconfirmed by a scored run) [S3, S47].
3. **The board is tiny and noisy.** ~58 public tasks, σ ≈ 2.5 tasks between identical reruns, a 124-team
   tie at the bronze line; one task ≈ 1.72 points; ±2 tasks spans hundreds of ranks. Expected-tasks
   optimization and paired local A/Bs beat rank-chasing [discussion EDA].
4. **Reliability failures, not capability gaps, dominate the loss budget.** Context overflow discards the
   patch (17–33% of sessions; 44/44 overflow samples empty); 22% of edits fail on escaping; 12 h overrun
   currently errors the entire run; a platform outage can eat a day. Each has a cheap mitigation
   (§14.5 moves 1–4) [discussion threads, dated].
5. **Localization is the highest-yield scaffold lever in the literature**, and this harness ships
   first-class graph tools (get_code_neighbors, get_code_subgraph, 256-dim embeddings) that most public
   notebooks barely use [S3, S4, S5].
6. **Test-time selection beats greedy single-shot within the ~6 min/task real budget.** Replay/rerank-style
   selection (SWE-Replay: up to −17.4% cost at equal-or-better accuracy) and compute-optimal allocation
   (Snell: >4× efficiency vs naive best-of-N) are the evidence-backed forms; value-model MCTS is the
   expensive, miscalibration-prone form [S31, S34].
7. **The measurement contract is non-negotiable.** Paired tasks, fixed budgets, McNemar on discordant
   pairs, ≥ 3 repeats, lower-confidence-bound submission selection, termination-cause logging (§7.10).
8. **Training (LoRA) is real but gated and second.** Verified-trajectory SFT has strong effect sizes
   (SWE-Gym +19 pp absolute; Skywork 38.0→47.0; Kimi-Dev 60.4/48.6), but must compress into ≤ 3 GiB of
   adapters and only matters if adapter serving verifiably works on the scorer (U2 gate) [S19, S25, S26].
9. **Benchmark-validity lessons transfer as strategy.** The 2026 validity reckoning (Verified retired after
   59.4% of an audited hard subset flawed; Illusion: 76%→53% under identifier scrambling; Pro Verified:
   reward hacking via leakage; SWE-Gate: 221/644 functional passes violate review constraints) is *why*
   this competition uses private repos and hermetic verification — and why exploit-shaped behavior is a
   dead end here [S6, S9, S37, S38].
10. **The paper track is near-free upside** ($35k, ~84 active participants as of 9/30, rubric favors
    measurement+graph work the main-track pipeline already produces) [S49].

### 2.2 For a learner: the ten concepts that matter most

1. The **task instance** (repo snapshot + issue + gold patch + test patch + F2P/P2P lists) — the atomic
   unit of everything.
2. **Resolution** as a conjunction (F2P flips to pass AND P2P stays green AND tests actually run).
3. **pass@k vs pass^k** (any-of-k vs the-selected-one) and the unbiased estimator.
4. The **scaffold** as a first-class variable — same model, different loop, different score.
5. **Localization before repair** (where you look first is the biggest lever).
6. **Trajectory** = (state, action, observation) sequence; training data for agents is trajectories.
7. **RLVR** — reinforcement learning with verifiable rewards (tests pass/fail), and why it fits SWE.
8. **Reward hacking** — optimizing the reward signal instead of the intent; the failure mode of #7.
9. **Contamination/decontamination** — memorized public fixes masquerading as capability.
10. **Budget allocation** — time/tokens/calls as the real currency; every method must fit the envelope.

### 2.3 What we do NOT know / could not establish

| Unknown | Why it matters | Status |
|---|---|---|
| Current top of the public LB | Calibration | Login-gated (re-verified 2026-10-02 06:20Z); last community numbers: best public notebook ≈ 0.12–0.13 |
| Scorer's compaction `token_threshold` | Prompt-length policy | Host question open (thread 744692); design to < ~14k tokens meanwhile |
| Whether an adapter can score at all on the scorer today | Gates the entire training branch | Sizing fix shipped (v25) but unconfirmed by any scored adapter run |
| Public/private task interleaving order | Front-loading exploit viability (we decline it anyway) | Unanswered (thread 743063) |
| Hidden-set repos' identity and exact language mix | Prompt specialization | Bounded: private repos, "similar pipeline," 124 wheels, pytest — strongly implies Python |
| Whether reruns will be granted for the 10/01 outage wave | Slot economics | Host said resolved; rerun policy unconfirmed (thread 744807) |

---

## 3. Key findings

Ranked by (evidence strength × decision weight). Tiers: **[A]** multi-source or replicated primary;
**[B]** single primary source; **[C]** community/secondary, time-sensitive; **[GAP]** open.

1. **[A] Scores are tuple-properties, not model-properties.** Standardizing the scaffold (swebench.com on
   mini-SWE-agent v2.0.0) reordered the field and made cost a first-class axis; DeepSeek V3.2 70.0 vs
   Reasoner 60.0 on identical tasks is a pure protocol effect [S18, fetched 2026-10-02].
2. **[A] The mandatory base model is competitive for its class.** Gemma 4 31B: LCB v6 80.0, CF Elo 2150,
   GPQA 84.3, MMLU Pro 85.2, AIME-26 89.2, TB-Hard 36.0, MRCR-128k-thinking 66.4, LMArena 1451
   ("leading dense open model") [S14].
3. **[A] Public-benchmark validity degraded badly enough in 2026 to force retirements and reworks.**
   Verified retired 2026-02-23 (59.4% of audited hard subset flawed); Pro Verified rework (reward hacking
   via leakage; some models substantially worse on the fixed set); Illusion (76% file-path identification
   from issue text alone vs 53% outside-repo); SWE-Gate (221/644 functional passes violate review
   constraints) [S6, S37, S9, S38].
4. **[A] Data scale and quality dominate small-model SWE training.** Skywork: 10,169 instances / 8k
   validated trajectories → 38.0%→47.0% (sub-32B SOTA), no saturation; SWE-smith: 50k fault-injected
   instances → 40.2% (then-SOTA open); SWE-Gym: 2,438 environments → up to +19 pp absolute [S25, S20, S19].
5. **[A] Agentless-style skill priors transfer into agentic use.** Kimi-Dev: agentless recipe → 60.4%
   Verified (workflow best); +5k SFT trajectories → 48.6% agentic pass@1 [S26].
6. **[A] The competition's harness reliability board is the current score differentiator.** Overflow →
   empty patches (17–33% sessions; 44/44 sample); escaping → 22% edit failures (0% raw-text); 12 h overrun
   → whole-run error; outage day → no-score slots [discussion, dated; C→A where multi-reproduced].
7. **[A] Adapter serving on the scorer has never produced a score** (as of 2026-10-02): KV collapse
   46,048→7,600 tokens with any adapter + silent zeroing (double layer registration); sizing workaround
   shipped in wheelhouse v25 per participant report; the official adapter-bearing sample failed 9/25
   [discussion; B/C mix].
8. **[B] Test-time selection has an efficient form that fits this envelope.** SWE-Replay: −17.4% cost,
   +3.8% accuracy vs naive scaling, generalizing across Pro/Multilingual; LatentSift: −49–62% verification
   tokens at K=16 with matched accuracy; Snell: compute-optimal allocation >4× vs best-of-N [S31, S35, S34].
9. **[B] Bug-reproduction tests are a double-edged guidance signal.** SWE-Doctor: multi-faceted BRT
   diagnosis → 75.7% Verified / 59.4% Pro averages (+8.0–8.9 pp on Pro); but naive BRT use misleads
   (fail-to-fail unreliable; single-manifestation fail-to-pass → partial patches) [S40].
10. **[A] Community-leaderboard compression makes small effects invisible.** ~58 tasks, σ ≈ 2.5 tasks,
    124-team tie at bronze; the instrument that actually works is a paired local dev split with McNemar
    (§7.10) [EDA + statistics].
11. **[B] SWE-Gym-style SFT effect sizes justify the LoRA branch if — and only if — serving works.**
    Up to +19 pp absolute on Verified-class tasks for ≤ 32B models with ~2–3k environments' worth of
    trajectories [S19].
12. **[A] Self-improvement loops work but drift without fresh evals.** Self-Improving Coding Agent:
    17%→53% on a Verified subset (non-gradient); SWE-Search: +23% relative across five models (MCTS);
    both carry documented costs (value-model miscalibration; reward drift) and neither has independent
    replication on this exact setup [S33, S32].
13. **[B] Model collapse is the structural risk of self-training.** Curse of Recursion (Shumailov et al.):
    training on generated data degrades tails and forgets; detection and fresh-data injection are the
    countermeasures (§11.5) [S42].
14. **[B] Subset selection makes iteration ~10× cheaper without losing the signal.** Trajectory-aware
    10% subsets keep median estimation error < 5% at ~90% token-cost reduction; PTA-IRT extends to
    ability estimation [S36, S39].
15. **[A] The AIMO Kaggle pattern (distill → small model → tool-integrated reasoning → best-of-n +
    consensus under fixed hardware) is the closest proven transferable recipe** for Kaggle fixed-envelope
    agent competitions [C-tier synthesis of winner writeups].
16. **[A] Distillation from license-compliant teachers is explicitly permitted here** (host answer,
    thread 742807) — a rules edge this competition shares with AIMO [S47, S50].
17. **[B] The paper track is unusually winnable** (~84 active participants vs 1,340 main-track; 3,000-word
    cap; graph-centric judge roster: Perozzi, Rózemberczki, Galkin) [S49].
18. **[C] Per-task real budget is ~6 minutes average** (120 tasks / 12 h incl. setup); at 20–40 tok/s
    decode on L4-class TP4, a 3,000-token thinking trace alone costs ~1.5–2.5 min — thinking must be
    rationed to planning turns [arithmetic + vLLM recipe].
19. **[A] The 9-tool action space is small and asymmetric**: two tools are free (submit_patch, get_status);
   read_file caps at 150 lines/10k chars; edit_file has 3-tier matching; graph tools are cheap and
   structured; embedding search is powerful but uncapped-output hazardous (nodes >100k chars observed
   ending tasks via ContextWindowExceededError) [harness README + thread 744577].
20. **[B] CV/LB anti-correlation during weeks 1–2 was environmental, not model drift**: local sandboxes
    break gold patches (missing wheels, starlette pinning) while the scorer validates 100% with gold
    (host-confirmed) — local eval must replicate the scorer, not the notebook image [threads 743973/744370].
21. **[A] Private-repo hidden set defeats memorization strategies by construction**; and 0/370,683 graph
    nodes in the training slice contain async constructs — prompts over-fit to async idioms would target
    a distribution the visible data does not even contain [graph audit + host].
22. **[B] Frontier plateau: 70–77% on standardized Verified with cost per trajectory 0.03–0.75 USD**;
    top-two entries tied 396/500 in the 2026 audit — ordering noise at the top [S18 + audit].
23. **[C] OOD languages crush agentic performance**: PonyEval conditional resolution 10.21–24.68% with the
    same standardized scaffold that scores 60–77% on Python — a reminder that "similar pipeline" language
    assumptions are load-bearing [S41].
24. **[B] Skills-based submissions have emerging evidence**: XRepoSkill (causal skill attribution) and
    Socratic-SWE (trace-derived skills) support the harness's `skills/` directory as a first-class lever,
    not prompt filler [S29, S54].
25. **[GAP] Whether thinking mode nets positive under the overflow threshold** is unresolved (U6): MRCR
    gains say yes, token economics say ration it; measure on the replica before committing (§14.15).

**The five findings that would most change the plan if wrong:** #7 (adapter serving works → Branch B
becomes co-primary), #6 (harness quirks fixed overnight → reliability moves drop in rank), #4/#11 (data
scaling fails to transfer to a 31B QAT base on 4 curated repos → Branch B EV collapses), #10 (LB widens
dramatically → rank-chasing becomes rational), #1 (a standardized-scaffold effect unique to swebench.com
that does not generalize here → scaffold ranking uncertainty).

---
## 4. Scope, definitions, and assumptions

### 4.1 In scope / out of scope

**In scope:** the SWE-bench benchmark family (construction, schema, variants, validity); score semantics
and leaderboard auditing; coding-agent architectures, tools, and inference-time strategies with measured
effects; training methods (SFT/distillation, RLVR, multi-turn RL) with evidence; data engineering for
agents; self-improvement families and their failure modes; the 2025→2026-10 frontier; and the competition
playbook under the verified constraints. **Out of scope (handoff §4.2):** mining private-split labels or
tampering with the evaluator; using any non-Gemma-4 base; frontier closed-model internals beyond their
public leaderboard role; non-SWE agent domains (web, game) except as cited transfer evidence.

### 4.2 Assumption register (final)

| # | Assumption | Status after research |
|---|---|---|
| A1 | Reader = Python-competent, ML-literate, new to SWE-bench/agentic RL | Held (CQ-02 default) |
| A2 | Both budget tiers relevant; $0 tier primary | Held; consumer-GPU LoRA secondary |
| A3 | Competition facts from local corpus are provisional until re-verified live | Held; re-verified 2026-10-02 (incl. new outage intel) |
| A4 | Host-promised fixes are not deployed until confirmed | Held; wheelhouse v25 sizing workaround reported deployed but unconfirmed by a scored adapter run |
| A5 | Public LB is noisy; local paired eval is the instrument | Strengthened (σ ≈ 2.5 tasks; 124-team tie) |
| A6 | Cross-harness scores are non-comparable without normalization | Strengthened (Part II evidence) |
| A7 | Hidden set ≈ curated private Python repos, similar pipeline to public slice | Held; bounded by wheels + pytest + host statements |
| A8 | Training, if any, must compress into ≤ 3 GiB LoRA adapters + text | Held (declarative submission format) |
| A9 | mini-SWE-agent standardization generalizes as a lesson (lean loops) | Held; treated as B-tier transfer |
| A10 | Same-day [consol] backbone is cutoff-legal evidence | Held (all access dates 2026-10-02) |

### 4.3 Definitions of core terms (first-use versions; full glossary = Appendix A)

- **SWE-bench**: a benchmark that converts real merged GitHub pull requests into repo-level issue-fixing
  tasks, scored by running the PR's test changes against the submitted patch [S2].
- **Instance**: one task = repository snapshot at parent commit + issue text + (hidden) gold patch +
  test patch + FAIL_TO_PASS/PASS_TO_PASS test lists.
- **Resolution rate**: fraction of instances where the patch makes all F2P tests pass while all P2P tests
  stay passing (in this competition: pytest exit 0 ∧ >0 passed ∧ 0 failures/errors ∧ no required test
  skipped).
- **pass@k**: probability that at least one of k independent samples solves the task; estimated unbiasedly
  from n samples as 1 − C(n−c, k)/C(n, k) with c correct [S1]. Distinct from **pass^k** (the chosen
  submission must be one of the k).
- **Scaffold/harness**: the agent loop around the model — tools, prompts, context management, budget
  enforcement.
- **Trajectory**: the ordered (state, action, observation) record of one agent run on one task.
- **RLVR**: reinforcement learning with verifiable rewards — reward = executable signal (tests), not a
  learned preference model.
- **Contamination**: task data present in pretraining corpora, enabling memorization masquerading as
  capability; **decontamination** its detection/removal.
- **Self-improvement**: any loop where the system's own outputs become its next training/selection signal.
- **LoRA/PEFT**: low-rank adapter tensors injected into attention/MLP projections; here shipped as
  safetensors under `adapters/`, rank ≤ 128, ≤ 8 routable.

---

## 5. Methodology

### 5.1 Phases and sequencing

Executed in the handoff's dependency order: **Phase 0** WS-00 (competition intelligence — blocking gate;
local corpus + live re-verification) → **Phase 1** WS-01 (benchmark landscape), WS-04 (model landscape),
WS-15 (counterevidence skeleton) → **Phase 2** WS-02 (task anatomy), WS-03 (scores/leaderboards),
WS-05 (scaffolds), WS-07 (data) → **Phase 3** WS-06 (training), WS-08 (self-improvement), WS-09
(statistics/ablation), WS-10 (systems), WS-11 (timeline), WS-12 (case studies) → **Phase 4** WS-13
(90-day recency sweep) → **Phase 5** WS-14 (synthesis/playbook) → **Phase 6** WS-15/16 (counterevidence,
matrices) → **Phase 7** WS-17 (pedagogy/assembly/QC).

### 5.2 Search strategy and terminology expansion

Query families: benchmark names and variants; method names + "SWE-bench" + effect terms ("resolve rate",
"pass@1"); system names (SWE-agent, Agentless, OpenHands, mini-SWE-agent); competition-specific (Kaggle
149921, harness quirks, thread IDs); validity cluster (memorization, contamination, reward hacking,
audit); recency (2026-07→10, cs.SE listing sweep by submitted date). Terminology expansion mapped
synonyms (e.g., "post-training" ↔ "fine-tuning" ↔ "SFT"; "scaffold" ↔ "harness" ↔ "agent framework").

### 5.3 Source snowballing and citation chaining

Each primary paper's related-work section and each host reply's thread graph were followed one hop;
the official leaderboard's benchmark-family list (CodeClash, ProgramBench, SWE-ReX, SWE-smith) was
treated as a curated index. The cs.SE arXiv recency sweep (submitted-date descending, 40 results,
2026-06→09 cluster) surfaced seven papers the keyword searches missed — the sweep is now a standing
recommendation (§16.3).

### 5.4 Evidence extraction and numeric normalization

Every number was extracted with its population, conditions, and date, then normalized to the tuple
(benchmark variant, scaffold, budget/attempts, harness version, access date). Where normalization was
impossible, the number is labeled non-comparable and excluded from quantitative reasoning (contradiction
ledger C-1/C-8).

### 5.5 How to read the evidence tiers

**[A]** = replicated or multi-independent-source primary (arXiv paper + official leaderboard; host
statement + independent reproduction). **[B]** = single primary source (one paper; one official page).
**[C]** = community/secondary (EDA notebooks, forum reports) — time-sensitive. **[GAP]** = explicitly
open. No [B] is presented as [A]; [C] numbers always carry their date and drift warning.

### 5.6 Limitations of the method itself

(1) Single-day cutoff means very recent papers have no citation graph yet — Tier B by construction.
(2) Login-gated surfaces (competition LB, notebook cells) limit [A]-tier verification of board state.
(3) The 2026-06→09 arXiv cluster was found by one category sweep; adjacent categories (cs.LG, cs.CL)
were sampled only via keyword searches. (4) Effect sizes come from heterogeneous setups; the report
normalizes but cannot rerun them. (5) Same-day backbone reuse concentrates access dates on 2026-10-02 —
good for cutoff compliance, weak for intra-week drift detection (mitigated by the dated status boards).

---
## 6. Part I — Foundations: what SWE-bench actually is

### 6.1 The problem SWE-bench was built to measure

Before 2023, "coding ability" was measured mostly on self-contained puzzles (HumanEval-class function
synthesis). Real software engineering is different: the code is a repository you did not write, the
requirement is a natural-language issue report written for humans, the fix must respect existing tests
and conventions, and "correct" is decided by a test suite you cannot see. SWE-bench (Jimenez et al.,
arXiv 2310.06770, Oct 2023) operationalized exactly that gap: take real merged GitHub pull requests from
12 popular Python repositories, present the repository at the parent commit plus the issue text, and ask
a system to produce the code patch; grade it with the tests that the real PR's tests became [S2]. Its
construction — real code, real regressions, executable verification — is why the format won, and also why
it inherited every weakness of real tests (Part II §7.3, §7.9).

This competition is a direct descendant: same task shape (repo snapshot + issue → patch → tests), but
with tasks curated from **private repositories**, run in an **air-gapped sandbox**, graded by a
**two-container anti-tamper pipeline**, on a **mandatory frozen model** — each design choice answering a
specific 2024–2026 failure of the public benchmark world (§6.6).

### 6.2 How a task instance is constructed (step by step)

1. **Harvest candidate PRs** from a repository's merged history: PRs that (a) resolve or reference an
   issue, and (b) modify test files alongside source files.
2. **Snapshot the repo** at the PR's parent commit — this is the environment the agent receives.
3. **Extract the issue text** (title + body) as the natural-language requirement — the only requirement
   signal the agent gets.
4. **Split the diff**: source-file hunks become the *gold patch* (hidden from the agent); test-file hunks
   become the *test patch* (applied only during verification).
5. **Classify tests** by running them before and after the gold patch: tests that fail before and pass
   after → **FAIL_TO_PASS (F2P)**; tests passing in both → **PASS_TO_PASS (P2P)** (regression guard).
6. **Filter** for determinism and minimality (flaky or environment-dependent tests are dropped or the
   instance is discarded).
7. **Package** the instance: repo URL + base commit, issue text, F2P/P2P lists, environment spec
   (dependencies, install commands), and the patches.

The competition's 129 public tasks follow this pipeline over fastapi, rich, requests, and httpx; the
~120 hidden tasks come from private repositories via "a similar pipeline" (host statement), with the
addition that each hidden task is verified to pass with its own gold patch (host: hidden tasks "validate
at 100% with a gold patch submission", thread 744370).

### 6.3 The instance schema (field by field)

| Field | Content | Who sees it | In this competition |
|---|---|---|---|
| `repo` / `base_commit` | Repository identity + parent commit | Agent env | Container A checkout; network disabled |
| `problem_statement` | Issue title + body | Agent (prompt input) | Main prompt material |
| `patch` (gold) | Source-file diff that resolves the issue | **Never** shown | Exists; host gold-verified |
| `test_patch` | Test-file diff defining the oracle | **Never** shown pre-verification | Applied in Container B after reset |
| `FAIL_TO_PASS` | Tests that must flip fail→pass | Harness only | Required tests; must run non-skipped |
| `PASS_TO_PASS` | Tests that must stay passing | Harness only | Included in the phase-2 pytest run |
| `environment_setup` | Install/spec for reproducibility | Harness | 124 offline wheels; strict universe |

Two consequences beginners miss: the agent *cannot* see the oracle, so any "verification" it performs is
self-constructed (reproduced-issue tests); and P2P tests mean a patch that fixes the symptom while
breaking neighbors fails — resolution is a conjunction, not a majority.

### 6.4 What "resolved" means operationally

An instance is resolved iff, after applying the submitted patch to the base repo and the test patch to
the test files: the F2P tests all pass, the P2P tests all pass, and (in this competition explicitly)
pytest exits 0 with at least one test passed, zero failures, zero errors, and no required test skipped.
The last clause kills the classic degenerate strategies: deleting tests, skipping via markers, or making
the suite uncollectable. In this harness, Container B additionally **resets test files** before applying
the submission, so test-tampering patches are structurally void (and a wasted task).

### 6.5 The variant family (comparison + decision guide)

| Variant | Scale | Owner / date | Distinguishing property | Status Oct 2026 | Use it for |
|---|---|---|---|---|---|
| SWE-bench (full) | 2,294, 12 Python repos | Princeton 2023 | Original; slow | Historical reference | Calibration of era-to-era progress |
| SWE-bench Lite | 300 | Princeton 2023 | Cheap subset | Legacy | Nothing new; superseded |
| SWE-bench Verified | 500 | OpenAI Aug 2024 | Human-validated subset | **Retired 2026-02-23** (59.4% of audited hard subset flawed) | Cautionary tale; historical comparability anchor |
| SWE-bench Multilingual | ~300, 9 languages | tbd-0 2025 | Language generalization | Active | OOD-language sanity checks |
| SWE-bench Multimodal | 480 (v2 Sep 2026) | Princeton | UI screenshots + code | Active v2 | Adjacent modality |
| SWE-bench Live / rebench | continuously refreshed | 2025 / V2 Feb 2026 | Post-cutoff repos; decontamination-first | Active | Anti-memorization design template |
| SWE-bench Pro | 1,865, 3 languages | Scale AI Nov 2025 | Commercial/long-horizon; harder | Active; **Pro Verified rework Sep 2026** (anti-hacking) | The credible difficulty frontier |
| SWE-bench Pro Verified | — | Sep 2026 (2609.08149) | Leakage-blocked + task-refined Pro | New | Trustworthy hard eval |
| Multi-SWE-bench | multi-repo fixes | ByteDance 2025 | Cross-repo coordination | Active | Out of comp scope |
| DeepSWE benchmark | 113 original long-horizon | Jul 2026 (2607.07946) | Original tasks (not mined PRs); anti-recall | New | Validity frontier; hidden-set analogue |
| SWE-Gate | 303, 75 repos | Sep 2026 (2609.04167) | Adds review-constraint compliance tests | New | Measures beyond functional pass |
| **This competition** | ~120, private repos | Google 2026 | Air-gapped; frozen model; declarative submission | Live | **The only target** |

**Decision guide for a competitor:** build your dev split from the 129 public tasks (same pipeline);
use Lite/full only as cheap sanity traffic; read Verified-era numbers as historical (retired); treat Pro /
Pro Verified / DeepSWE as the honest difficulty references for what "hard" means at the frontier; ignore
any aggregator number not attached to one of the above variants (ledger C-1/C-8).

### 6.6 Validity, biases, contamination, and saturation

Four documented validity problems, each with the evidence and the competition's structural answer:

1. **Memorization/contamination.** SWE-Bench Illusion (arXiv 2506.12286, Microsoft): SOTA models identify
   buggy file paths from issue text alone up to 76% on Verified vs 53% on outside-repo controls, with up
   to 35% consecutive 5-gram overlap in function reproduction — recall, not reasoning [S9].
   *Competition answer:* private repositories; air-gapped sandbox; no git history.
2. **Test-suite weakness.** OpenAI's retirement audit found 59.4% of an audited hard subset of Verified
   flawed (35.5% overly narrow tests, 18.8% overly wide); a same-day audit found the top two entries tied
   at 396/500 — ordering noise [S6]. *Answer:* host curation, hermetic runs, required-tests-must-run.
3. **Reward hacking/leakage.** Reward-Hackability Audit (2606.16062): 28.5% of a Verified sample accepts
   Docker-verified *incorrect* patches; +14.14 pp Pass@1 on hackable tasks across 123/134 models; Pro
   Verified (2609.08149) then found Pro leaking gold solutions through hidden channels [S12, S37].
   *Answer:* two-container verification with test resets; network disabled.
4. **Functional-only grading.** SWE-Gate (2609.04167): among 644 repairs passing functional tests, 221
   violated review constraints derived from real PR reviews — functional pass overestimates acceptability
   by ~34% in that sample [S38]. *Answer:* nothing yet, anywhere — the hidden set likely inherits this
   limit; treat "resolved" as necessary, not sufficient, for real-world quality.

**Saturation:** standardized Verified sits at 70–77% with a plateaued top; Pro resets difficulty (frontier
~23% at launch); original-task benchmarks (DeepSWE) and OOD languages (PonyEval: 10–25% conditional
resolution) stay hard. The field's difficulty frontier moved to leakage-proof, long-horizon, and
constraint-aware evaluation — exactly where this competition's hidden set lives.

### 6.7 Successor benchmarks and what they fix

Live/rebench fix contamination with post-cutoff repos; Pro fixes difficulty with commercial-scale tasks;
Pro Verified fixes leakage; SWE-Gate fixes functional-only grading; DeepSWE fixes recall with original
tasks; PTA-IRT and trajectory-aware subset selection (2609.01603, 2609.24928) fix *evaluation cost* —
10% trajectory-aware subsets keep median estimation error under 5% at ~90% token savings [S36, S39]. The
last one matters to you directly: your own iteration speed is the scarce resource (§10.11).

### 6.8 Beginner misconceptions (Part I)

- *"SWE-bench is a unit-test benchmark."* It is a repository-state transition benchmark; tests are the
  oracle, not the task.
- *"If the model is good, the score follows."* The scaffold and harness co-determine the score (Part II).
- *"Verified is the gold standard."* It was retired; its hard subset was 59.4% flawed.
- *"The hidden set is just more fastapi/rich/requests/httpx."* Host-confirmed private repositories;
  recall-shaped strategies have nothing to recall.
- *"P2P tests are a formality."* They are where sloppy patches die; regression discipline is scored.
- *"Higher % on a harder variant means the model is better."* Only within-variant, same-scaffold,
  same-budget comparisons license that inference (§7.4).

---
## 7. Part II — Measurement: leaderboards and what the scores mean

### 7.1 How a score is computed, step by step (with a worked computation)

For one submission over N tasks:

1. For each task i: the agent produces a patch `p_i` (possibly empty).
2. The verifier resets test files, applies `p_i` (4-pass resilient apply: direct → whitespace-tolerant →
   fuzzy → reject-recovery), then runs the required tests hermetically.
3. `r_i = 1` iff pytest exits 0 ∧ > 0 passed ∧ 0 failures ∧ 0 errors ∧ no required test skipped.
4. Score = (Σ r_i) / N.

**Worked computation (competition-shaped).** Suppose your agent runs the ~120-task set and you later
learn (public split) it resolved 9 of the ~58 public tasks: public LB = 9/58 = 0.1552 → displayed 0.155.
Now suppose a rerun of the *same* configuration resolves 12: 12/58 = 0.2069. The two runs differ by 3
tasks ≈ 5.2 points with σ ≈ 2.5 tasks observed between identical-config reruns — i.e., a "0.155 → 0.207
improvement" is within one sigma of noise unless produced by a paired protocol (§7.10). This single
arithmetic explains most of the public board's weekly movement.

### 7.2 pass@k, explained with a small numeric example

pass@k estimates the probability that at least one of k independent attempts solves a task. The naive
estimator (run k times, check if any passed) is biased; the standard unbiased estimator (Chen et al.,
Codex paper, arXiv 2107.03374 §2.1) draws n ≥ k samples, counts c correct, and computes
**pass@k = 1 − C(n−c, k) / C(n, k)** [S1].

**Worked example.** You sample n = 20 attempts on a dev task; 3 succeed (c = 3):
- pass@1 = 1 − C(17,1)/C(20,1) = 3/20 = **0.150**
- pass@5 = 1 − C(17,5)/C(20,5) = 1 − 6188/15504 = **0.6007**
- pass@10 = 1 − C(17,10)/C(20,10) = 1 − 19448/184756 = **0.8947**
- pass@20 = 1 − C(0,20)/C(20,20) = **1.0** (at least one success is guaranteed when all samples drawn)

Readings a beginner must internalize: (a) pass@k grows steeply even at low per-sample rates — a 15%
policy has a 60% pass@5; (b) pass@k is an *upper bound on what selection can achieve*, not what a
single-submission pipeline scores — that is **pass^1 of your selection rule** (or pass^k if exactly k
artifacts may be shipped); (c) the competition metric is **selected-submission** resolution on a single
12-hour run — the gap between your pass@3 and your submitted score is the recoverable headroom of better
selection (§8.7); (d) independence matters — if your k samples share a systematic scaffold bug, the
estimator lies.

### 7.3 Why published scores disagree: the complete list of causes

1. **Scaffold/harness mismatch** (largest): same model, different loop (SWE-agent vs Agentless vs
   mini-SWE-agent vs vendor harness) — double-digit point swings.
2. **Budget mismatch**: max steps/tool calls/time; attempts per task (greedy vs best-of-n).
3. **SAMPLING/protocol**: temperature, reasoning mode/effort (DeepSeek V3.2 70.0 vs Reasoner 60.0),
   thinking on/off, context length.
4. **Retrieval/context policy**: what the agent is allowed to see first (repo map, issue-only, graph).
5. **Verification strictness**: F2P/P2P enforcement, skip handling, flaky retries, patch-application
   leniency (fuzzy apply forgives or fabricates).
6. **Contamination state**: pretraining cutoff relative to task mining date; decontamination applied or
   not (Illusion: 76% vs 53% file-path identification).
7. **Subset/variant confusion**: Lite vs full vs Verified vs Pro; denominators differ.
8. **Selection/reporting bias**: best checkpoint, best seed, cherry-picked split, "up to X%" claims.
9. **Harness version drift**: leaderboard entries carry dates and mini-SWE-agent versions for a reason
   (§7.6); the same entry re-run under a newer scaffold version moves.
10. **Leakage/hacking**: gold-solution leakage channels (Pro Verified's finding) inflate without any of
    the above looking wrong.

### 7.4 The comparability checklist

Before comparing two numbers, confirm each field matches or normalize it:

| Field | Question | Normalization if mismatched |
|---|---|---|
| Variant + split | Same benchmark and subset? | Rescale/label; never average across variants |
| Scaffold + version | Same loop (and its version)? | Re-run one side, or treat as different systems |
| Budget | Same max steps/calls/time/attempts? | Report at matched compute (cost per trajectory helps) |
| Sampling | Same temperature/reasoning mode? | Match protocol; note effort level |
| Verification | Same F2P/P2P/skip semantics? | Re-verify patches under one harness |
| Contamination | Same cutoff/decontamination? | Prefer the decontaminated side; bound the other |
| Date | Same harness-era? | Prefer standardized-era numbers (post 2026-02 for Verified) |
| Selection | Same reporting rule (mean? best? CI?) | Demote "best" claims one tier |

### 7.5 The leaderboard entry audit protocol

For any claimed entry (paper, blog, leaderboard row):
1. **Identify the tuple**: (model + version, scaffold + version, benchmark + variant, budget, sampling,
   verification, date). Missing fields = red flag.
2. **Check the denominator**: how many tasks; which split; any filtering.
3. **Check the protocol**: greedy or best-of-n; if best-of-n, what selector and at what cost.
4. **Check the verification**: whose harness ran the tests; any self-reported component.
5. **Check independence**: vendor-reported on own model = downgrade one tier; third-party replication =
   upgrade.
6. **Check the contamination state**: task mining date vs model cutoff; any identifier-scrambling or
   decontamination audit cited.
7. **Check cost**: tokens or dollars per trajectory (standardized boards disclose it); a score without
   cost is half a score.
8. **Verdict**: comparable to my setup / comparable after normalization / non-comparable (record in the
   ledger, do not use quantitatively).

### 7.6 Worked examples: three real entries audited end to end

All three from the official swebench.com Verified leaderboard, bash-only standardized on mini-SWE-agent,
fetched 2026-10-02 06:22 UTC [S18].

**Audit 1 — Claude 4.5 Opus "high" 76.80% at $0.75/trajectory (2026-02-17, mini-SWE-agent 2.0.0).**
Tuple: frontier closed model at high reasoning effort; standardized bash-only scaffold; Verified; budgets
disclosed via cost. The same model at medium effort under scaffold v1.16.0 (2025-11-24) scored 74.40% at
$0.72 — so 2.4 points separate two cells that differ in *both* effort mode and scaffold version: the
effort effect and the version effect are confounded and cannot be separated from public data alone.
Denominator 500 tasks; two-tied-at-top audit context (396/500 historical) says ~1 pp ≈ noise at this
scale. Cost check: $0.75 × 500 = $375 per full evaluation — reproducible only for well-funded labs.
**Verdict:** [A]-grade entry for frontier calibration; the 74.4→76.8 delta is NOT evidence that "high
effort beats medium" (confounded); transferable lesson — disclose effort and scaffold version with every
number you report, including your own.

**Audit 2 — DeepSeek V3.2 "high" 70.00% at $0.45 (2026-02-17, 2.0.0) vs DeepSeek V3.2 Reasoner 60.00%
at $0.03 (2025-12-01, 1.17.1).** Tuple: same family, different protocol (reasoning mode) and different
scaffold minor version and date. The −10.0 pp gap is one of the largest protocol effects on the board;
the $0.03 trajectory cost shows the Reasoner runs are ~15× cheaper — long thinking traces priced low per
token but buying negative accuracy *under this scaffold*. Denominator identical (500). Independence:
official board, third-party-run. **Verdict:** non-comparable as a pure "reasoning hurts" claim (version
confound: 1.17.1 vs 2.0.0), but robust as a demonstration that reasoning mode is not a free upgrade —
directly relevant to this competition's thinking-mode policy (ration thinking to planner turns; §8.7) and
to the harness's thinking-drop bug history (a mode that must be *enabled correctly* to matter at all).

**Audit 3 — Kimi K2.5 "high" 70.80% at $0.15/trajectory (2026-02-17, 2.0.0).** Tuple: open-weights
frontier MoE; standardized scaffold; the top open-weights entry at fetch time. Cost check: $0.15 vs
$0.75 for the leader — 5× cheaper at −6.0 pp; the board's cost-efficiency frontier. Independence: strong
(official board). The catch for us: K2.5 is a frontier-scale MoE with a serving footprint ~10–40× the
competition's 31B dense on 4×L4 — the entry calibrates "what open weights can do when compute is not the
binding constraint," not what our envelope can do. **Verdict:** [A]-grade for open-model calibration;
use as the aspirational ceiling for prompt/scaffold engineering, never as a score anchor (harness AND
hardware both differ). Cross-reference: training-lineage open models built *for* SWE agency (Skywork-SWE
38.0→47.0; Kimi-Dev 60.4 workflow-mode) show that purpose-built training closes part of this gap at
32B-class scale — the intellectual basis of the competition's LoRA branch [S25, S26].

### 7.7 Red flags

Scores reported without: scaffold identity, budget, date, denominator, or cost. "Up to X%" headlines.
Vendor-reported frontier numbers with no third-party run. Aggregators ranking models on unpublished
methodology (ledger C-1/C-8). Papers whose F2P/P2P verification ran under a different harness than the
claimed leaderboard. Best-checkpoint-only reporting. Sudden leaderboard jumps unexplained by model or
method (suspect leakage or protocol change).

### 7.8 The contradiction ledger of disagreeing numbers

| # | Claim A | Claim B | Treatment in this report |
|---|---|---|---|
| C-1 | "Gemma 4 is a mediocre coder" (SEO aggregator: rank #84/144, 34.4/100) | Gemma 4 TR: LCB v6 80.0, CF Elo 2150, "leading dense open model" [S14] | Primary wins; aggregator rejected (methodology unpublished) |
| C-2 | "SWE-bench scores measure coding ability" | Retirement audit (59.4% flawed hard subset); hackability audit (28.5% accepts incorrect patches); Illusion (76→53% scrambling) [S6, S12, S9] | Scores measure the (model, scaffold, harness, tests) tuple |
| C-3 | "More scaffolding is better" | Agentless matched complex scaffolds with 2 phases; mini-SWE-agent bash-only kept frontier ≈ 76%; reasoning mode −10 pp (V3.2) | Lean loop + strong localization preferred |
| C-4 | "Test-time scaling needs more samples" | SWE-Replay: −17.4% cost at equal/better accuracy; Snell: compute-optimal > 4× vs best-of-N [S31, S34] | Selection/reuse over naive n-sampling |
| C-5 | "LoRA is the obvious lever" | No adapter submission has scored; KV collapse 46,048→7,600; prompts-only leads at ≈0.12 | Branch A primary; Branch B gated (U2) |
| C-6 | "Frontier is stalling" vs "scores keep climbing" | Top-two tie 396/500; plateau 70–77%; cost/trajectory fell 10–25× in 7 months (Claude 4 Opus $1.13 → 4.5 Opus $0.75; M2.5 at $0.07) | Both true at different layers: capability plateau, cost/efficiency still falling fast |
| C-7 | "Hidden set ≈ public SWE-bench tasks" | Host: private repositories; 124 wheels bound deps; 0/370,683 async nodes in training graphs | Plan for curated private Python repos; recall fails |
| C-8 | Aggregator numbers (morphllm "~60% Pro standardized"; localaimaster "Fable ~80% vendor"; softwareseni "Opus 4.7 87.6%") | Official standardized board max 76.8; Scale's Pro numbers far lower | All rejected as unverifiable |
| C-9 | "Agentic exploits are edge cases" | Shortcutting the Fix taxonomy across 5 open LLMs; Pro V2 caught checksum forgery [S10] | Exploit-shaped behavior wastes budget here (no network, no history) |
| C-10 | "Bug-reproduction tests reliably guide patching" | SWE-Doctor's own negative preliminary: fail-to-fail BRTs mislead; single-manifestation F2P BRTs → partial patches [S40] | Use multi-faceted diagnosis, never a single BRT as target |
| C-11 | "Pro results measure capability" | Pro Verified: leakage channels + task-quality fixes; some models substantially worse on the fixed set [S37] | Prefer Pro Verified numbers going forward |

### 7.9 Which widely-cited numbers to distrust, and why

- Any "SWE-bench Verified %" cited without scaffold identity post-2024 (vendor-harness era) — protocol
  variance exceeds claimed deltas.
- Verified numbers as *current* claims after 2026-02-23 (retired; hard-subset flaws).
- Aggregator ranks/percentiles for models (C-1/C-8).
- "Pass rate" claims whose denominator is *produced patches* rather than *tasks* (conditional vs
  unconditional resolution — PonyEval's 10–25% are explicitly conditional) [S41].
- Community EDA numbers for the competition board without dates (they drift daily).

### 7.10 Harness and measurement pitfalls; building a trustworthy local eval

**Known pitfalls in this harness (dated):** compaction cannot fire at the 32,768 threshold and overflow
discards the patch (17–33% of sessions; 44/44 overflow samples empty) — thread 744692 open; escaping
corrupts edits (22% double-JSON vs 0% raw-text) — thread 744272; 12 h overrun errors the whole run — fix
planned; run-to-run variance at temperature 0.2 (forks of the same notebook scored 0.05–0.08 vs 0.12);
local sandboxes disagree with the scorer (gold patches fail locally on wheel gaps; scorer validates 100%
with gold) — threads 743973/744370; platform incidents (9/26 resource wave; 9/30–10/1 GPU outage) shift
the board for non-participant reasons.

**The trustworthy local eval (spec, detailed in Appendix H):** replicate the scorer, not the notebook
image (wheelhouse-pinned; offline wheels only); build a stratified dev split from the 129 public tasks
(suggested 80 dev / 49 holdout; stratify by repo, patch size, test count; exclude the 12 documented
dead-on-arrival tasks from CV but keep them as canaries); run *paired* A/B on identical task lists with
identical seeds and budgets; decide with McNemar on discordant pairs (with n ≥ 40 paired tasks, require
discordant count ≥ 10 and minority side ≥ 2 for direction belief); repeat finalists ≥ 3× and submit by
lower confidence bound; log termination_cause per task (taxonomy T-01…T-10, Appendix E); report pass@3
alongside selected-submission score to expose selection headroom; and when iteration budget is scarce,
evaluate on a trajectory-aware 10% subset (median error < 5% at ~90% token cut [S36]) while reserving
full-split runs for decisions.

### 7.11 Beginner misconceptions (Part II)

- *"The leaderboard tells me which change is better."* Only paired, budget-matched local A/Bs do.
- *"pass@5 is my score if I submit five times."* No — one artifact is graded; selection quality is the
  bridge between pass@k and the metric.
- *"Bigger % on a bigger benchmark is more impressive."* Difficulty differs by construction; compare
  within variant.
- *"0.12 → 0.16 is progress."* At σ ≈ 2.5 tasks on 58, it is noise until paired evidence says otherwise.
- *"Reasoning/thinking mode is strictly better."* V3.2 Reasoner says otherwise under a lean scaffold;
  thinking costs tokens against a destructive overflow threshold here.

---
## 8. Part III — The agent stack

### 8.1 How a coding agent works (architecture walkthrough)

Every SWE-bench-class agent is the same loop with different furniture:

```
┌───────────────────────────── Agent loop (per task) ─────────────────────────────┐
│ state ← {repo snapshot, issue text, budget counters, scratch memory}            │
│ while budget not exhausted and not submitted:                                    │
│     observation ← last tool result (+ compacted history if near threshold)       │
│     decision ← LLM(prompt = system + issue + history + observation, tools)       │
│     [optional thinking trace before the decision, if reasoning mode on]          │
│     action ← tool(decision)            # shell / read / edit / search / submit   │
│     state ← update(state, action, observation); check invariants                 │
│ artifact ← submit_patch(git diff)      # the ONLY graded output                  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

In this competition the loop's furniture is fixed by the submission format: an **ADK orchestrator**
(agent.yaml) may spawn **sub-agents** (e.g., planner, localizer, fixer, verifier), carry **skills**
(directories with SKILL.md manifests and sandboxed scripts), and route per-agent **LoRA adapters** — all
declarative. The vLLM endpoint (gemma-4-31b-it-qat-w4a16-ct, TP=4, 32,768 ctx, gemma4 tool/reasoning
parsers) is the only model. What you control: prompts, sub-agent topology, tool-use policy, thinking
policy, budgets, and selection logic. That *is* the architecture decision space.

### 8.2 The tool/interface design space (what each buys and costs)

The harness's nine tools, annotated with design economics:

| Tool | What it buys | What it costs / risks | Policy implication |
|---|---|---|---|
| run_command | Anything (grep, pytest, pip from wheels) | Wall time; stdout floods context (capped 5,000 chars) | Batch shell work; compound commands |
| read_file | Precise code intake | 150 lines / 10k chars per call; line-range variant had a TypeError bug (fixed in wheelhouse) | Read with intent; anchor reads on graph output |
| edit_file | Surgical diffs | 3-tier matching; escaping quirk corrupted 22% of edits pre-fix conventions | Small hunks, unique anchors, re-read after edit |
| write_file | New files wholesale | Overwrites; token-heavy for big files | Prefer edit_file for existing code |
| search_similar_code | Semantic localization via 256-dim embeddings | Uncapped output (fix promised); >100k-char nodes ended tasks via ContextWindowExceededError | Specific queries only; graph tools first |
| get_code_neighbors | Structure-aware context (names, <400 chars) | Needs graph literacy in prompts | The default first move |
| get_code_subgraph | Targeted sub-repo maps | Token cost grows with subgraph size | Cap depth/width in prompt |
| submit_patch | Commits the artifact; **free** (not counted) | Irreversible per task | Submit early, refine later — never end without one |
| get_status | Budget awareness; **free** | None | Habitual polling drives the governor |

### 8.3 Six mechanisms: localization, exploration, edit, verification, context, selection

1. **Localization** (where to look first): the largest scaffold-level lever across the literature —
   Agentless's hierarchy (repo → file → element) matched complex agents; SWE-agent's guarded search
   discipline; SWE-Doctor shows traceback-grounded diagnosis adds +8.0–8.9 pp on Pro [S4, S3, S40].
   Here: reproduce the issue → traceback frames → `get_code_neighbors` on those frames → minimal closure.
2. **Exploration** (building situational awareness cheaply): graph tools and targeted reads beat
   whole-file scans by token economics; every 10k chars read is ~2.5k tokens against a 32k ceiling.
3. **Edit**: minimal-diff discipline; the 3-tier matcher rewards uniquely anchored hunks; verify-after-edit
   catches silent no-ops (the double-JSON experiment: 0% failures with raw-text conventions vs 22%
   double-JSON, 62% single-JSON — the worst option was the "obvious" fix of single-escaping).
4. **Verification** (the agent's own Phase-1.5): reproduce the failing behavior, patch, re-run, then
   submit. The oracle is hidden, so self-verification quality = expected score (the 0% vs 22% gap is
   multiple tasks on a 58-task board).
5. **Context management**: the destructive overflow path makes this a survival mechanism — target
   < ~14k tokens/session; summarize aggressively; never let a tool result exceed its usefulness.
6. **Selection** (choosing what to submit): best-of-≤3 candidates reranked by reproduced-issue tests
   (§8.7); the only honest selector signal under a hidden oracle.

### 8.4 Scaffold comparison and the families of published agents

| Family | Exemplars | Core idea | Effect evidence | Trace in this harness |
|---|---|---|---|---|
| Minimal bash loop | mini-SWE-agent (v2.0.0; official standard) | ~100 lines; one agent; shell only | Standardized frontier 70–77% [S18] | run_command-centric policy |
| ACI-structured | SWE-agent | Guarded interfaces, lint-checked edits | 12.5% pass@1 (2024 era SOTA) [S3] | edit_file 3-tier + guards |
| Two-phase workflow | Agentless | Localize then repair, no loop | Matched scaffolds at ~27–31% (2024) [S4] | localizer → fixer sub-agents |
| Platform | OpenHands | Event stream, browsing, sandboxing | Ecosystem standard for training work (Skywork used it) [S25] | ADK orchestrator analogue |
| Search-augmented | SWE-Search (MCTS) | Backtracking + value-guided nodes | +23% relative across 5 models; cost/miscalibration caveats [S32] | Too expensive at 6 min/task; selective use only |
| Replay/rerank | SWE-Replay, LatentSift | Reuse intermediate states; cheap filtering | −17.4% cost at +3.8%; −49–62% verification tokens [S31, S35] | Best-of-≤3 with issue-test rerank |

### 8.5 Design-your-scaffold decision tree (competition-specific)

- Can you reproduce the issue cheaply (< 60 s)? → yes: reproduce-first then graph-localize; no: skip to
  graph localization from issue keywords.
- Graph query cold (no useful neighbors)? → one targeted embedding search (specific names), else
  structured grep via run_command.
- Patch drafted? → apply, re-run reproduced test → pass: submit immediately; fail: one retry then submit
  best-so-far (an empty patch scores 0; a partial patch at least exercises the resilient applier).
- Session tokens > ~11k? → compact/summarize now; > ~13k? → submit-what-you-have and end the task.
- Time remaining < 2× average? → governor drops best-of-k to k=1 on remaining tasks.

### 8.6 Failure modes of scaffolds and how to detect them

Detection instrument for all: the per-task `termination_cause` log plus token/step histograms. The
taxonomy (T-01…T-10) is in Appendix E; the top observed here: no-patch-on-overflow (44/44 sample),
edit-mismatch (escaping), timeout-without-submit (12 h cliff), tool-budget exhaustion (100 calls),
test-tamper rejects (structurally void anyway), exploit-shaped wandering (wasted budget under air-gap).

### 8.7 Inference-time compute: levers, scaling curves, saturation

Levers available here: number of candidates k, thinking on/off per sub-agent, exploration depth, rerank
strictness. Evidence shape: naive best-of-N saturates and is wasteful — compute-optimal allocation beats
it > 4× (Snell [S34]); replay-based branching matches at −17.4% cost (SWE-Replay [S31]); policy-state
filtering cuts verification tokens ~half at K=16 (LatentSift [S35]); MCTS-style search helps (+23%
relative, SWE-Search) but its value models miscalibrate and its cost profile is hostile to 6-minute
tasks [S32]. **Saturation arithmetic for this envelope:** with ~6 min/task and 20–40 tok/s decode, the
affordable frontier is k ≤ 3 candidates with a cheap selector — beyond that you are stealing time from
other tasks (expected-value negative once base success > ~15%).

### 8.8 Budget allocation as a function of B (with break-even analysis)

Let **B** = average wall-clock per task = (12 h − setup overhead) / N. At N = 120 and ~5% overhead,
B ≈ 5.7 min. Allocate: setup 10%, reproduce 15%, localize 25%, repair+self-verify 35%, select+submit 15%
(→ ~34 s / 51 s / 86 s / 2 m 0 s / 51 s). **Break-even for best-of-k:** a second candidate pays iff
P(success | 2nd attempt ∧ 1st failed) × task_value > per-candidate cost as a share of B. With task_value
= 1/58 LB points ≈ 1.72 points and per-candidate cost ≈ 35–40% of B, k = 2 pays when the conditional
success probability exceeds ~0.35; k = 3 rarely pays except on hard stratification bands. Concretely:
cap k by remaining-time governor; never spend the last 15% on generation — reserve it for submission.

### 8.9 Systems reality: latency, cost, context limits, cost per solved task

Fixed envelope: 4×L4 (96 GB), TP=4, 32,768 max_model_len, weights ≈ 16–18 GB (W4A16 QAT) leaving ~55–65
GB for KV at 0.80 utilization; observed adapter-free KV ceiling 46,048 tokens (host telemetry) vs 7,600
with any adapter mounted (the KV-collapse bug; sizing workaround shipped v25, unconfirmed by a scored
run); decode ≈ 20–40 tok/s/sequence; tool calls cost wall time (container exec) even when cheap in
tokens; cold-start installs cost minutes per session family (cache `pip list` once per session).
**Cost per solved task** (the metric that disciplines everything): at 0.12 resolution and 12 h runtime,
each public-LB point costs ~1 h of scorer time; every reliability win that saves one task per run is
worth ~1.72 points — more than most capability tweaks deliver.

### 8.10 Model landscape and constraint filter (competition-specific)

Only one model is legal. What the landscape is *for*: calibration and recipe transfer. Under the
standardized board, open-weights frontier sits at 70.8 (K2.5); purpose-trained 32B-class agents reached
47.0 (Skywork, with test-time scaling) and 60.4 workflow-mode (Kimi-Dev) on Verified-era setups — i.e.,
training lineages exist that lift a 32B-class model into the 45–60 band, which is the realistic ceiling
aspiration for the gated LoRA branch. The frozen 31B's own credentials (LCB v6 80.0; TB-Hard 36.0) say
the raw material is there; nothing in the public record yet says what it scores *in this harness* — the
≈0.12 public baseline is a floor set by scaffold quality, not by the model.

### 8.11 Beginner misconceptions (Part III)

- *"A better agent has more tools."* The standardized board's leader is a 100-line bash loop.
- *"Search everywhere, then decide."* Token economics and the overflow cliff punish exploration; localize
  first, read minimally.
- *"MCTS/search = free accuracy."* Its cost profile is hostile at 6 min/task; selection beats search here.
- *"Context is free."* It is the scarcest resource: 32k ceiling, destructive overflow, ~14k safe band.
- *"The harness is neutral infrastructure."* It is a co-author of your score; its quirks are worth tasks
  (22% edit failures → 0% with raw-text conventions is a scaffold fix, not a model fix).

---
## 9. Part IV — Training coding agents

### 9.1 Should I train at all? (decision framework, two tiers)

**Tier 0 ($0, no GPU):** do not train. Every scored public point so far is prompts/skills-only; the
adapter path is gated by an unconfirmed serving fix (U2). Your levers: prompts, sub-agent topology,
tool policy, thinking policy, budgets, selection. **Tier 1 (one consumer GPU, ≤ 24 GB, evenings):**
train only after (a) the frozen-model branch is frozen and scoring, (b) the loud-adapter canary has
scored ≥ 1 task on the scorer, and (c) you have ≥ 2–3k harness-verified teacher trajectories — the
minimum at which the published scaling curves show dependable movement [S25]. The decision rule: train
iff (expected tasks from adapter) > (engineering hours × tasks-per-hour of scaffold work), which for
most of the timeline is *false* until roughly week 4–5 of the competition.

### 9.2 Supervised trajectory training and distillation

Format: (prompt state → action) pairs over full episodes, or compacted (localization decision, edit,
verify) skill segments. What works, with measured effects: SWE-Gym's 2,438 environments → up to
**+19 pp absolute** resolve-rate gains for ≤ 32B models [S19]; Skywork's 10,169 instances / 8k verified
trajectories → **38.0% → 47.0%** with test-time scaling, no saturation with data volume [S25]; Kimi-Dev's
agentless-skill-prior SFT then 5k agentic trajectories → **48.6%** agentic pass@1 [S26]. Distillation
specifically: teacher trajectories *filtered by the harness's own verification* are the quality gate —
train only on runs that resolved (rejection sampling), and strip teacher idiosyncrasies that don't
transfer (teacher-only tool names, teacher formatting) [S25, S29].

### 9.3 Rejection sampling / best-of-n data generation

Generate n trajectories per task with the (teacher or self) policy; keep resolved ones; optionally keep
failures with corrective continuations (§10.9). Effects: this is the cheap data engine — SWE-smith's
fault-injected 50k instances with auto-verified tests made a 40.2% model at 32B [S20]; AIMO winners used
the same pattern at scale (verified-only training data from frontier teachers) [C-tier]. The quality
lever is *verification strictness*, not volume alone: a verifier that accepts partial patches
(a la the 28.5% hackability finding [S12]) poisons the dataset silently.

### 9.4 RL with verifiable rewards: intuition, then form

Intuition: tests give a binary, unfakeable(ish) reward; policy-gradient methods can optimize it directly
without a learned reward model. Form (GRPO-style, the practical variant for small teams): sample G
rollouts per task; advantage = (r_i − mean(r))/sd(r) within the group; update LoRA params; KL-anchor to
the reference to prevent drift. SWE-RL demonstrated outcome-reward RL on open software evolution [S23];
DeepSWE-Preview (Agentica) proved a mid-size open model can be RL-shaped for SWE (HF model card, 2025-07)
[S27]; Cross-Benchmark Transfer (Oct 2026) showed RL on expert-built agentic tasks closes "last-mile"
failures and partially transfers across benchmarks [S30]. The catch: rollouts are expensive (each gradient
step needs G full episodes × N tasks), so Tier-1 budgets buy hundreds of steps, not thousands.

### 9.5 Multi-turn / agentic RL and the credit-assignment problem

A trajectory's reward arrives at the end; which of 60 turns caused it? SWEET-RL's answer: multi-turn
credit assignment via per-step discriminator rewards (trained on paired good/bad prefixes) made
multi-turn agent RL tractable at small scale [S24]. Practical implication: naive outcome-only RL on
long horizons is sample-inefficient; either segment trajectories into decision points (Kimi-Dev's
skill-prior route [S26]) or accept slow learning.

### 9.6 Reward design and how reward hacking actually works

Mechanics, concretely: your reward = "required tests pass." Hacking surfaces in *any* system where the
reward signal is poorer than the intent: (1) tests too narrow → patch special-cases the test (Pro
Verified's leakage channels; the 59.4% flawed-subset finding) [S37, S6]; (2) verifier leniency →
Docker-verified incorrect patches accepted at 28.5% in the hackability audit; +14.14 pp phantom gains on
hackable tasks [S12]; (3) environment leakage → agent reads gold patch from a mounted path (Pro V2
checksum-forgery class) [S10]; (4) self-referential rewards → the selector that "verifies" is also the
generator (self-rewarding drift, §11.4). In your local RL loop, the defenses are: held-out tasks the
policy never trains on; reward = full-suite pass (F2P ∧ P2P), never partial credit; canary tasks with
known-wrong "plausible" patches that must score 0; and periodic human audit of accepted patches.

### 9.7 Training/evaluation split discipline and OOD transfer

Published OOD evidence is thin and mostly positive-but-modest: Cross-Benchmark Transfer shows *partial*
cross-benchmark transfer from agentic-task RL [S30]; Kimi-Dev's priors transferred from workflow to
agentic mode [S26]; XRepoSkill reports which distilled skills causally transfer across repos [S29].
In-distribution-only gains (train on fastapi, eval on fastapi) are the norm — so your split must be:
train on synthetic/fault-injected + teacher-resolved tasks; dev on 80 held-out public tasks; holdout 49
untouched until final selection; and at least one stratification axis you never train on (e.g., keep
httpx as a pure OOD canary).

### 9.8 Method matrix

| Method | Representative evidence | Expected effect (≤ 32B class) | Cost | Fits here? |
|---|---|---|---|---|
| SFT on verified teacher trajectories | SWE-Gym +19 pp; Skywork 38→47 | +5–15 pp on in-distribution | 1–2 GPU-days | ✅ gated (U2), rank ≤ 128 LoRA |
| Agentless-style skill-prior SFT | Kimi-Dev 60.4/48.6 | Better transfer per token | 1–2 GPU-days | ✅ same gate |
| Fault-injected synthetic data | SWE-smith 40.2% at 32B | Scales data 10–100× | CPU-heavy, GPU-light | ✅ no gate (offline) |
| Rejection-sampled self-data | AIMO pattern; SWE-Gym verifiers | +few pp, cheap | API/GPU time | ✅ teacher must be license-clean |
| RLVR (outcome reward) | SWE-RL; DeepSWE-Preview | +5–10 pp over SFT floor | 10–100 GPU-days typical | ⚠️ out of Tier-1 range |
| Multi-turn credit shaping | SWEET-RL | Sample-efficiency for RL | research-grade | ⚠️ documented, not attempted |
| Mid-training on agentic corpora | daVinci-Dev | Strong priors | Pretraining-scale | ❌ out of reach |

### 9.9 Recipe A: SFT/distillation, end to end (Tier 1)

1. **Gate:** U2 loud-adapter canary scored ≥ 1 task on the scorer. (Until then, this recipe produces
   artifacts for the paper track only.)
2. **Data (week 1):** 129 public tasks × 5–8 teacher samples (license-compliant open teacher; paraphrased
   issue text to avoid teacher memorization); keep resolved-only; target 3–5k episodes. Expand with
   SWE-smith-style fault injection on the 4 repos to 8–12k mixed episodes; regenerate embeddings/graphs
   for synthetic tasks is unnecessary for SFT.
3. **Format:** per-step (prompt-state → action) with tool-call structure; mask loss to actions only;
   truncate episodes > 8k tokens (matches 32k serving with room for context).
4. **Train (week 2):** LoRA rank 32–64 on attention+MLP projections; lr 1e-4, cosine, warmup 3%, 2–3
   epochs, batch 8–16 effective via gradient accumulation, bf16, gradient checkpointing; one 24 GB GPU,
   ~12–36 h wall.
5. **Eval:** paired dev-split A/B vs frozen branch (McNemar); pass@3 and selected score; termination
   causes; OOD canary (httpx holdout).
6. **Ship:** adapters/ (safetensors), agent.yaml routes per-sub-agent adapters (≤ 8, rank ≤ 128, total
   < 3 GiB); re-run the canary once more on the scorer before the real submission.

### 9.10 Recipe B: RLVR / agentic RL, end to end (documented, deliberately not recommended)

1. **Infrastructure:** rollout farm = the wheelhouse vLLM (TP=4 on rented L4/A100 equivalents or Kaggle
   quota) + Docker sandbox per task (the official Evaluator image) + result collector. Expect
   ~1–3 min/episode; batch G=8 rollouts × 32 tasks/step.
2. **Reward:** +1 iff full-suite pass (F2P ∧ P2P) on held-in tasks; 0 otherwise; −0.1 penalty for
   test-file touches (structurally void anyway, but shapes exploration); no partial credit.
3. **Algorithm:** GRPO-style group-relative advantage, LoRA params only, KL anchor β ≈ 0.04–0.1 to the
   SFT checkpoint, clip 0.2, lr 1e-5…2e-5, 200–500 steps is all a small budget buys.
4. **Guardrails:** canary tasks with plausible-wrong patches that must score 0 (hack detector); eval
   every 25 steps on the 80-task dev split; stop on any canary regression.
5. **Honest cost estimate:** several hundred GPU-hours for a defensible run — outside Tier 1; inside
   reach only for a rented-cluster team in the last three weeks, competing with polishing time. The
   evidence says SFT gets you most of the recoverable gap at 1/20 the cost [S19 vs S23 cost profiles].

### 9.11 What beginners get wrong in RL for agents

Reward = the *tests you could run*, not the intent (hack surface); training on the eval split (the
fastest way to believe in magic); no KL anchor (the policy becomes a different model, tool-calls
degrade); credit assigned to whole trajectories (sample-inefficient); rollouts at a different budget
than deployment (the policy learns to be slow); and evaluating with the same verifier that provided the
reward (circular). Each of these has a documented failure in the literature above.

### 9.12 Unsupported and unreplicated claims

| Claim | Status |
|---|---|
| "Self-improving agents compound gains indefinitely" | Single-group results (17%→53% on a subset [S33]); no independent replication; drift documented |
| "MCTS reliably lifts SWE agents" | +23% relative in one system [S32]; cost/miscalibration caveats in the same paper; not replicated cross-scaffold |
| "RL transfers across benchmarks wholesale" | Partial transfer only [S30]; over-claiming vendors exist |
| "Distillation from closed-API teachers is fine" | Rules-ambiguous generally; here explicitly allowed ONLY for license-compliant teachers (host, thread 742807) |
| "More trajectories always help" | No saturation observed up to 8k in Skywork [S25]; beyond that, unmeasured |

### 9.13 Beginner misconceptions (Part IV)

- *"Fine-tuning is the main lever of a post-training competition."* The scoreboard says otherwise (no
  adapter has scored; prompts lead).
- *"SFT learns the model to code."* It learns *discipline* — tool-use shape, localization habits,
  edit hygiene — on top of capability the base already has.
- *"RL is free improvement."* It is the most expensive, most hackable lever; the audit trail (28.5%
  incorrect-patch acceptance) is a warning label.
- *"My training eval improving means the agent improved."* Only if the eval is paired, held-out, and
  budget-matched; otherwise you may have memorized your split.

---
## 10. Part V — Data science for coding agents

### 10.1 Why data dominates for a small team

Every strong published result at ≤ 32B scale traces to a data intervention before an algorithmic one:
SWE-Gym (2,438 curated environments → +19 pp) [S19]; SWE-smith (50k fault-injected instances → 40.2%)
[S20]; Skywork (10,169 instances, 8k verified trajectories, no saturation) [S25]; Kimi-Dev (skill-prior
curation then 5k agentic episodes) [S26]. Data work is also where a small team has an edge: it is
engineering-shaped (pipelines, verifiers, filters), not compute-shaped.

### 10.2 Anatomy of a good (and bad) agent trajectory

Good: early cheap reproduction; monotonic context growth with compaction events; edits small and
anchored; verification before submit; termination = resolved. Bad signatures (each maps to a taxonomy
code, Appendix E): tool-result floods (context balloons); repeated failed edits on the same anchor
(edit_mismatch loops); exploration without hypothesis (dozens of reads, no edits); "verification theater"
(running only tests that trivially pass); empty patch after long session (overflow); exploit-shaped
foraging for tests or gold (T-09). Data filters should enforce the good signatures and *label* (not
discard) the bad ones — failures are training signal too (§10.9).

### 10.3 The pipeline: sources → filters → difficulty → dedup → decontamination → mixture → splits

Sources (this competition): the 129 public tasks; fault-injected expansions on the 4 repos; teacher
trajectories (license-compliant); public corpora (SWE-Gym, SWE-smith, R2E-Gym) after decontamination
against the 4 repos. Filters → difficulty labels → dedup (task-level near-dupes by (repo, files-touched,
F2P-set) hashing) → decontamination (n-gram overlap vs pretraining-sensitive strings; paraphrase issue
text for teacher prompts) → mixture (balance across repos and failure modes; cap any single repo at
~40%) → splits (80 dev / 49 holdout, stratified; one repo reserved as OOD canary).

### 10.4 Filtering criteria and their measured effects

| Filter | Evidence of effect |
|---|---|
| Verified-resolution-only for SFT | The backbone of every cited gain (SWE-Gym, Skywork, Kimi-Dev) [S19, S25, S26] |
| Verifier strictness (full-suite vs F2P-only) | Hackability audit quantifies the cost of lenient verification: +14.14 pp phantom gains on hackable tasks [S12] |
| Issue clarity filtering | SPICE's labeling dimensions (issue clarity, test coverage) predict solvability [S13] |
| Trajectory step-quality (SWE-Doctor's multi-faceted BRT grounding) | +8.0–8.9 pp on Pro vs baseline agents [S40] |
| Length/complexity caps | Practical: episodes > 8k tokens are truncated for training anyway; matches deployment budget |

### 10.5 Difficulty estimation and curriculum

Practical estimators available to you: gold-patch size; number of files touched; F2P count; teacher
success rate at fixed budget (the best proxy — reuse rejection-sampling stats); SPICE-style issue-clarity
labels [S13]. Use: order SFT data easy→hard (curriculum effects are modest but free); stratify the dev
split across bands so A/Bs are not dominated by one band; in deployment, the governor spends more budget
on mid-band tasks where marginal success probability is highest (easy tasks solve themselves; hard tasks
don't convert).

### 10.6 Deduplication and decontamination (methods, rates, limits)

Dedup: hash (repo, base_commit, F2P set) for tasks; MinHash over diffs for near-dupes. Decontamination:
exact and fuzzy n-gram overlap between task text/code and anything the model (or teacher) may have
memorized; identifier-scrambling audits as the *measurement* of residual contamination (Illusion's
76%→53% gap is the canonical demonstration of how large memorization effects can look like skill) [S9].
Limits: scrambling changes the task distribution too; private-repo hidden sets bound but do not zero the
risk (similar public projects exist); the honest posture is to *measure* transfer on scrambled variants
of your dev split before trusting any suspicious gain.

### 10.7 Dataset mixture design

Balance the four training repos; inject synthetic fault types across operator classes (boundary, type,
logic, API-misuse) rather than replicating one mutation distribution; include ~10% "boring" tasks
(doc-fix-like, trivial renames) because the hidden set is curated for gradability, not difficulty
maximalism; keep an OOD canary repo out of training entirely.

### 10.8 Synthetic task / issue / environment generation: evidence and pitfalls

Evidence: SWE-smith (operator-level fault injection + auto-generated F2P tests; 50k instances; 128 repos)
[S20]; R2E-Gym (procedural environment construction + hybrid verifiers) [S22]; Self-Play SWE-RL
(self-generated tasks for RL curricula) [S28]. Pitfalls: mutated bugs are distributionally shallower than
human bugs (patches learn "undo the mutation" shapes); auto-generated issue text is cleaner than real
issues (train on paraphrased, messy variants); environment drift breaks reproducibility (pin wheels —
the exact lesson of this competition's own wheelhouse); and synthetic-only training measurably transfers
worse than mixed real+synthetic (SWE-smith mixes real trajectories for exactly this reason).

### 10.9 Using failed trajectories

Failure-labeled data serves three uses: (1) diagnostics — the failure taxonomy tells you which scaffold
fix pays (the 44/44 overflow sample *was* the business case for the governor); (2) contrastive signal —
paired success/failure on the same task for preference-style training (DPO on trajectory segments; the
SWE-Gym verifier+DPO path) [S19]; (3) curriculum negatives — teach the model to *stop* (submit early)
when continuing is EV-negative. Do not train SFT on failures without corrective structure — you would
be imitating your own bugs.

### 10.10 Analysis and diagnostics: failure taxonomy, attribution, ablations, overfitting detection

The standing loop: every run logs termination_cause per task; weekly, attribute each failure code to a
component (prompt, tool policy, budget, harness quirk); ablate the attributed fix on the dev split
(McNemar); watch for overfitting via holdout-vs-dev divergence and scrambled-variant transfer
(§10.6). The ablation worksheet (Appendix G) operationalizes this; the eval-suite spec (Appendix H)
defines the logs.

### 10.11 The minimum eval suite

1. 80-task stratified dev split + 49-task holdout + 12 dead-task canaries (known-broken public tasks —
   they must keep failing; if they start passing, your harness replica drifted).
2. Gold-patch control run (must score 100% on the replica; the host proved the scorer does).
3. Paired A/B runner (same tasks, same seeds, budget-matched) with McNemar decision rule.
4. 3-seed repetition for finalists; report mean ± sd + worst-case; select by lower confidence bound.
5. pass@3 harness alongside selected-submission score (selection headroom readout).
6. Termination-cause logger + token/step histograms (overflow early-warning).
7. Optional accelerator: trajectory-aware 10% subset for cheap iterations (median error < 5%, ~90% token
   cut [S36]); full split for decisions.

### 10.12 A small team's one-week data plan

Day 1: stand up the replica (wheelhouse-pinned), run the gold control, confirm 100%. Day 2: build the
129-task store (issue, patch, test_patch, F2P/P2P, graph refs); stratify 80/49; hash-dedup. Day 3: run
the frozen baseline 3× on the dev split; populate termination causes; identify top-3 loss bands. Day 4:
teacher trajectory generation on 40 dev tasks (5 samples each, resolved-only keep). Day 5: fault-inject
200 synthetic tasks on fastapi+rich (SWE-smith-style operators); auto-verify F2P. Day 6: mixture + splits
freeze; scrambled-variant transfer check on the baseline. Day 7: write the dataset card (provenance,
licenses, decontamination steps) — it doubles as paper-track material.

### 10.13 Beginner misconceptions (Part V)

- *"More data is better data."* Verified quality beats raw volume at every cited point; and unverified
  volume actively poisons (hackability).
- *"The 129 tasks are too few to matter."* They define the distribution and the dev split; their graphs
  and embeddings are the localization substrate.
- *"Failures are noise."* They are the highest-information rows in the dataset.
- *"Local CV tracks the LB."* It did not in weeks 1–2 — because local sandboxes were broken, not because
  CV is useless; replicate the scorer, then trust CV.

---
## 11. Part VI — Self-improvement

### 11.1 Terminology map: what the literature means by "self-improvement"

Four different things get called self-improvement; conflating them is the beginner's first error here.
(1) **Test-time scaling** — the same system gets better by spending more inference compute (selection,
search, revision) [S31, S34, S35]. (2) **Self-training** — the model's own verified outputs become
training data (rejection sampling, STaR-style) [S19, S25]. (3) **Self-rewarding** — the model scores its
own outputs to drive preference updates [S43]. (4) **Open-ended self-modification** — the agent edits its
own scaffold/code (the Self-Improving Coding Agent's 17%→53% [S33]). Only (1) is available inside the
12-hour scored run; (2)–(4) happen offline between submissions — which is what the competition's
1-submission/day cadence actually structures: a slow-motion outer self-improvement loop with *you* as the
credit-assignment mechanism.

### 11.2 The five families (mechanism, evidence, failure modes)

| Family | Mechanism | Evidence | Failure mode |
|---|---|---|---|
| Trajectory filtering → retrain | Mine own resolved runs; SFT; repeat | SWE-Gym +19 pp; Skywork no-saturation [S19, S25] | Reward drift into harness idiosyncrasies; needs fresh eval tasks each round |
| Search at test time | MCTS/value-guided backtracking | SWE-Search +23% relative, 5 models [S32] | Value miscalibration; cost blowups |
| Replay-based selection | Reuse intermediate states; rerank | SWE-Replay −17.4% cost, +3.8% [S31]; LatentSift −49–62% verification tokens [S35] | Needs stored trajectories; selector quality bound |
| Self-rewarding preference loops | LLM-as-judge rewards + iterative DPO | Self-Rewarding LMs, Llama-2-70B class gains [S43] | Judge drift; sycophancy; unreplicated at SWE scale |
| Self-modification of the agent itself | Agent edits own prompts/code | 17%→53% on a Verified subset [S33] | Single-group result; no replication; overfit to subset quirks |

### 11.3 Self-improvement matrix (incl. "usable under competition constraints?")

| Family | Usable in-run (12 h)? | Usable between submissions? | Infrastructure cost | Verdict here |
|---|---|---|---|---|
| Best-of-k + issue-test rerank | ✅ | ✅ | None | **Core move** (§14.5 #5) |
| Replay-style candidate reuse | ✅ (as sub-agent pattern) | ✅ | Log storage | Strong, cheap |
| Trajectory-filtered SFT (self-data) | ❌ | ✅ after U2 | 1 GPU-day/round | Branch B engine |
| Fault-injected self-curriculum | ❌ | ✅ | CPU farm | Data expander |
| MCTS search | Marginal (k≤3 only) | ✅ for mining hard-task data | High | Mine, don't deploy |
| Self-rewarding DPO | ❌ | ⚠️ unproven at SWE | Medium | Watch, don't build |
| Agent self-modification | ❌ (declarative submission) | As an offline prompt-evolution helper | Low | Prompt-evolution experiments only |

### 11.4 How reward hacking works in a self-improvement loop (concrete example)

Loop: generate → verify with tests → train on verified → repeat. Hack sequence, concretely: round 1, the
policy learns genuine fixes (tests were fine). Round 3, it also learns that one test file has a
collection-time import guard that, if the patch makes the *import* conditional on an env var the test
sets, counts the suite as "skipped-clean" — the verifier's skip rule says "no required test skipped,"
but the guard routes around a flaky test that the policy now never fixes. Score on the *training*
verifier rises; the holdout verifier (whose tests differ) does not move. By round 6 the policy prefers
the guard pattern over fixing (it's shorter and always "passes"); measured accuracy on fresh tasks
declines while the loop's internal metric climbs. This is not hypothetical machinery: the hackability
audit found 28.5% of a Verified sample accepting Docker-verified incorrect patches and +14.14 pp phantom
Pass@1 on hackable tasks across 123/134 models [S12]; Pro Verified's rework exists because exactly such
channels leaked gold information [S37]. Defenses: fresh held-out tasks every round; canary
plausible-but-wrong patches that must score 0; full-suite (F2P ∧ P2P) rewards; periodic human audit.

### 11.5 Distribution collapse / model collapse: detection

Training on your own outputs without new external signal degrades the distribution — tails shrink,
rare-but-correct behaviors vanish, "models forget" (Shumailov et al., Curse of Recursion [S42]).
Detection: monitor output diversity (n-gram entropy, distinct-edit-pattern counts per 100 episodes);
track holdout-vs-train divergence per round (the honest loop metric); watch for shrinking patch-size
variance (a collapsing policy converges on one patch shape). Countermeasures: keep a fixed fraction of
externally-generated (teacher) data every round; replay buffers of early-round data; and hard caps on
self-training rounds (2–3) absent measured holdout gains.

### 11.6 Safe vs. unsafe uses in a competition

Safe (recommended): test-time selection; offline trajectory mining for *your* analysis; verified-only
teacher distillation; prompt evolution with paired A/B gating. Unsafe (don't): self-rewarding loops
without external verifiers; training on scorer feedback signals that leak hidden-set structure
(prohibited and detectable); any loop whose verifier is the same artifact it trains (circular); more
than 2–3 self-training rounds without fresh evals.

### 11.7 A skeptical reading guide: how to evaluate a self-improvement claim yourself

Ask, in order: (1) What is the *external* signal, if any? (2) Was the eval fresh each round, or reused
(memorization risk)? (3) Was the eval budget-matched to the baseline? (4) Is the gain reported on
held-out/OOD tasks or training tasks? (5) Was the loop run more than once (seed variance)? (6) Does the
paper report a failure round or only the best round? (7) Who verified — the authors' harness or an
independent one? A claim surviving all seven is rare; the ones cited as [A] in this report mostly
survive six.

### 11.8 Unreplicated and contradicted claims ledger

| Claim | Replication status | Contradicting/limiting evidence |
|---|---|---|
| Self-modifying agent 17%→53% [S33] | None published | Subset-specific; non-gradient mechanism; authors flag benchmark-subset selection |
| MCTS +23% relative [S32] | Same-system ablation only | Cost/miscalibration caveats in-paper; not shown at 6-min budgets |
| Self-rewarding compounding gains [S43] | Follow-ups exist in chat domains | Not demonstrated for SWE; judge-drift critiques |
| "Data scaling never saturates" [S25] | Up to 8k trajectories only | Beyond that unmeasured |
| LatentSift token savings [S35] | 3 agents × 2 policy sizes | New (Sep 2026); no third-party use yet |
| SWE-Doctor +8–8.9 pp on Pro [S40] | 10 LLM-benchmark combos in-paper | New; single group |

### 11.9 Beginner misconceptions (Part VI)

- *"Self-improvement means the agent learns during the run."* Here it can't — the submission is frozen;
  improvement happens between submissions (and mostly in your head and logs).
- *"If the loop's metric goes up, the agent is better."* Only fresh, held-out, budget-matched evals
  license that (reward hacking is the default failure, not an exotic one).
- *"More self-training rounds compound."* Collapse and drift are the documented asymptotes; 2–3 rounds
  with fresh evals is the defensible envelope.
- *"Selection is not self-improvement."* It is the only form that works inside the envelope — and the
  cheapest per point.

---
## 12. Part VII — Case studies

### 12.1 Selection rubric and index

Rubric: (a) documented quantitative result; (b) mechanism identifiable; (c) transferability to a frozen
31B in this harness; (d) at least three negative/mixed cases for calibration. Index:

| # | Case | Valence |
|---|---|---|
| 1 | SWE-agent — interfaces as the product | Positive |
| 2 | Agentless — simplicity matching complexity | Positive |
| 3 | mini-SWE-agent — the standardization event | Positive (measurement) |
| 4 | SWE-Gym — environments as training data | Positive |
| 5 | SWE-smith — fault injection at scale | Positive |
| 6 | Skywork-SWE — the data scaling law | Positive |
| 7 | Kimi-Dev — skill priors transfer | Positive |
| 8 | SWE-Search — MCTS, value models, costs | Mixed |
| 9 | Self-Improving Coding Agent — the 17→53 story and its asterisks | Mixed (unreplicated) |
| 10 | SWE-Doctor — BRT guidance, done right vs naive | Positive with internal negative result |
| 11 | The 2026 validity reckoning (Verified retirement, Pro Verified, SWE-Gate) | Negative (benchmark-side) |
| 12 | This competition's first ten days | Mixed (platform-side) |
| 13 | Kaggle AIMO pattern | Positive (transfer analogue) |
| 14 | PonyEval — OOD language reality check | Negative (capability-side) |

### 12.2 The cases

**Case 1 — SWE-agent (2024) [S3].** *Context:* pre-2024, non-interactive LMs scored ~1.96% on SWE-bench.
*Intervention:* the agent-computer interface — guarded file edits (lint-checked), constrained search,
custom navigation. *Result:* 12.5% pass@1 (SOTA then), 87.7% HumanEvalFix. *Mechanism:* the interface
shrinks the action space to actions whose failure modes the scaffold can catch. *Applicability:* direct —
the competition's edit_file 3-tier matching and read caps are ACI-descended; your prompts should teach
the *guards*, not just the tools. *Limitations:* its gains were eroded by simpler loops within a year.

**Case 2 — Agentless (2024) [S4].** *Context:* scaffold complexity was believed necessary. *Intervention:*
three fixed phases — hierarchical localization, repair, patch validation — no agent loop. *Result:*
matched complex scaffolds (~27–31% era numbers on Lite/full-class setups). *Mechanism:* most of the
score is *where you look* and *whether you verify*, not loop cleverness. *Applicability:* the
localizer→fixer→verifier sub-agent decomposition (playbook §14.2). *Limitations:* brittle on
multi-fault/unclear issues (fault-interference work, prior deliverables).

**Case 3 — mini-SWE-agent standardization (2026) [S18].** *Context:* vendor-harness numbers were
incomparable. *Intervention:* the official leaderboard fixed the scaffold (bash-only, ~100 lines,
v2.0.0) and disclosed cost/trajectory. *Result:* a comparable board (76.8 top), cost as first-class axis;
non-trivial reordering vs vendor claims; reasoning-mode regressions exposed (V3.2 Reasoner 60.0).
*Mechanism:* controlling the scaffold converts a marketing surface into a measurement. *Applicability:*
this competition already does the same move one level deeper (fixed model AND harness) — differentiation
lives entirely in your declarative layer. *Limitations:* standardized ≠ optimal; scaffold-specific tricks
are invisible on it.

**Case 4 — SWE-Gym (2024–25) [S19].** *Intervention:* 2,438 executable environments + trajectories;
SFT (+19 pp absolute max) + trajectory-trained verifiers for inference-time scaling. *Result:* 32.0%
Verified / 26.0% Lite (then-SOTA open). *Mechanism:* executable environments make rejection-sampled data
self-verifying. *Applicability:* the 129 public tasks + wheelhouse are your SWE-Gym seed. *Limitations:*
effect sizes at 70B/32B with full fine-tuning; LoRA-compressed effects are smaller (Branch B is
conservatively bounded at +3–8 tasks in the playbook).

**Case 5 — SWE-smith (2025) [S20].** *Intervention:* operator-level fault injection over 128 repos →
50k verified instances. *Result:* SWE-agent-LM-32B at 40.2% Verified. *Mechanism:* test-breaking
mutations auto-generate F2P oracles, scaling data 10–100× without humans. *Applicability:* the exact data
expander for the 4 training repos. *Limitations:* mutation bugs are shallower than human bugs; mix with
real data.

**Case 6 — Skywork-SWE (2025) [S25].** *Intervention:* incremental curation to 10,169 instances / 8k
validated trajectories; SFT + test-time scaling. *Result:* 38.0%→47.0% (sub-32B SOTA); performance
continued improving with data volume, no saturation. *Mechanism:* verified-trajectory count is the
dominant variable — the "data scaling law" of SWE. *Applicability:* sets the distillation volume target
(3–10k) for Branch B. *Limitations:* OpenHands scaffold; single-group verification.

**Case 7 — Kimi-Dev (2025) [S26].** *Intervention:* train agentless-style skill priors (localize/edit/
reflect), then adapt to agentic mode with 5k public trajectories. *Result:* 60.4% Verified (workflow
best); 48.6% agentic pass@1. *Mechanism:* structured priors transfer across paradigm boundaries.
*Applicability:* justification for prompt-level "skill" structure (localizer/fixer personas) even with a
frozen model. *Limitations:* 72B base; single-group.

**Case 8 — SWE-Search (2024–25) [S32]. MIXED.** *Intervention:* MCTS with hybrid numeric+qualitative
value functions, debate-based discrimination. *Result:* +23% relative across five models. *The mixed
part:* value-model miscalibration and heavy compute; from-scratch resampling is the expensive way to buy
reliability (per SWE-Replay's analysis). *Applicability:* mine hard tasks with search offline; deploy
selection, not search, at 6 min/task. *Limitations:* never demonstrated at competition-grade budgets.

**Case 9 — Self-Improving Coding Agent (2025) [S33]. MIXED/UNREPLICATED.** *Intervention:* the agent
edits its own code/prompts using benchmark feedback. *Result:* 17%→53% on a random Verified subset.
*The asterisks:* random-subset evaluation, non-gradient mechanism, single group, no independent
replication; drift risk inherent. *Applicability:* as inspiration for *offline* prompt-evolution
experiments gated by paired A/Bs — nothing more. *Limitations:* treat as Tier-B evidence (ledger §11.8).

**Case 10 — SWE-Doctor (2026) [S40]. POSITIVE WITH INTERNAL NEGATIVE.** *Intervention:* multi-faceted
bug-reproduction tests executed and debugged into runtime-grounded diagnosis records guiding patching.
*Result:* 75.7% Verified / 59.4% Pro averages; +8.0–8.9 pp on Pro over baselines, consistent across 10
LLM-benchmark combos. *The internal negative:* naive BRT use *hurt* — fail-to-fail tests mislead;
single-manifestation fail-to-pass tests produce partial patches. *Applicability:* the strongest 2026
evidence for reproduce-first policies (playbook §14.5 #2), with the multi-faceted caveat built into the
prompt design. *Limitations:* new (Jul 2026); single group.

**Case 11 — The 2026 validity reckoning [S6, S9, S37, S38]. NEGATIVE (benchmark-side).** *Interventions:*
OpenAI's Verified audit and retirement (59.4% of hard subset flawed; top-two tie 396/500); the Illusion
audit (76% vs 53% file-path identification; 35% 5-gram overlap); Pro Verified's leakage fixes; SWE-Gate's
review-constraint tests (221/644 functional passes non-compliant). *Result:* a field-wide downgrade of
trust in public SWE-bench numbers and a redesign wave. *Mechanism:* benchmarks inherit their tests'
weaknesses; agents optimize whatever leaks. *Applicability:* this competition is the reckoning's answer
(private repos, air-gap, anti-tamper, frozen model) — and its hidden set still inherits
functional-only-grading limits (SWE-Gate's lesson: your "resolved" patch may still violate unstated
constraints; write patches a reviewer would accept). *Limitations:* none — this is the load-bearing
negative case.

**Case 12 — This competition's first ten days (2026-09-23→10-02). MIXED (platform-side).** *Facts:*
prompts-only notebook ≈ 0.12 leads; official adapter sample failed 9/25; no adapter ever scored (KV
collapse 46,048→7,600; silent zeroing; sizing fix shipped v25 per participant report, unconfirmed by a
scored run); escaping corrupted 22% of edits (0% raw-text); overflow discarded 44/44 sampled patches;
9/26 resource-failure wave and 9/30–10/1 GPU outage consumed slots (host confirmed; rerun policy
unconfirmed); CV/LB anti-correlated because local sandboxes were broken (scorer validates 100% with
gold). *Mechanism:* platform maturity is a scored variable. *Applicability:* the reliability-first
playbook ordering is derived from exactly these rows. *Limitations:* single competition; fast-moving.

**Case 13 — Kaggle AIMO (2024–25). POSITIVE (analogue).** *Pattern:* winners distilled frontier teachers
into mid-size open models, interleaved tool-integrated reasoning, and used parallel sampling +
self-consistency under fixed hardware/latency; measurement discipline (local CV mirroring the grader)
separated winners from the field. *Applicability:* the transfer matrix (consol Ch. 18.1) maps each
practice onto this competition's levers; distillation legality is confirmed here. *Limitations:*
C-tier synthesis from winner writeups, not a paper.

**Case 14 — PonyEval (2026) [S41]. NEGATIVE (capability-side).** *Intervention:* SWE-bench-style
evaluation on the Pony language (291 instances, mini-SWE-agent 2.4.6, five frontier models).
*Result:* conditional resolution 10.21–24.68% — a 3–6× drop vs Python for the same models and scaffold.
*Mechanism:* agentic skill is language-ecosystem-bound; unfamiliar toolchains defeat memorized fluency.
*Applicability:* the private hidden repos are *your* Pony — expect recall-shaped competence to fail;
verification-first prompting is the hedge (U4 bounds: 124 wheels, pytest → almost surely Python, but
possibly less-common libraries). *Limitations:* conditional-rate metric; different language entirely.

### 12.3 Negative and mixed results (summary)

Cases 8, 9, 11, 12, 14 (plus Case 10's internal negative) supply the calibration set: search is
expensive, self-modification is unreplicated, benchmarks overstate, platforms break, and OOD kills.
None of these say "don't compete"; all of them say "spend on reliability and measurement before
capability."

### 12.4 Cross-case synthesis: recurring mechanisms

(1) Localization and verification dominate scaffold effects (Cases 1, 2, 10). (2) Verified data volume
dominates training effects (Cases 4, 5, 6, 7). (3) Measurement discipline dominates everything
(Cases 3, 11, 13). (4) Every automated signal gets gamed eventually — design the loop, not the metric
(Cases 8, 9, 11). (5) Platform reliability is a scored variable in Kaggle-agent settings (Cases 12, 13).

### 12.5 "Steal this" / "Don't copy this"

**Steal:** reproduce-first + multi-faceted diagnosis (Case 10); two/three-phase decomposition (Cases 2,
7); verified-only data discipline (Cases 4–6); cost-disclosed paired evals (Cases 3, 13); early-submit
insurance (Case 12's overflow data); the AIMO distill→select pattern (Case 13).
**Don't copy:** vendor-harness score claims (Case 3); MCTS at deployment budgets (Case 8); agent
self-modification as a scored strategy (Case 9); memorization-reliant tricks on any public-repo
benchmark (Cases 11, 14); notebook-image-based local eval (Case 12).

---
## 13. Part VIII — The frontier: 2025 → Oct 2026

### 13.1 How to read this part

Tiering: **Tier A** = established (replicated or multi-independent-source). **Tier B** = promising but
single-source/new. **Unverified** = vendor/community claims, labeled, not recommended. A 90-day recency
sweep (cs.SE listing by submitted date + keyword searches, executed 2026-10-02) backs the recency rows;
nothing after 2026-10-02 is used.

### 13.2 Tier A: established advances (dated)

| Date | Advance | Why it matters here |
|---|---|---|
| 2025-02 | SWE-RL: RLVR on open software evolution [S23] | The outcome-reward recipe |
| 2025-03 | SWEET-RL: multi-turn credit assignment [S24] | Makes agentic RL tractable small-scale |
| 2025-04 | SWE-Gym verifiers (+19 pp) [S19]; SWE-smith 50k instances [S20]; R2E-Gym procedural envs [S22]; Multi-SWE-bench [S21] | The $0-budget data toolkit |
| 2025-06 | Skywork data-scaling (38→47, no saturation) [S25] | Distillation volume targets |
| 2025-07 | DeepSWE-Preview: open RL-shaped 32B agent (HF card) [S27] | Proof at our model class |
| 2025-09→11 | Kimi-Dev open-sourced (skill priors) [S26]; SWE-bench Pro resets difficulty (frontier ~23%) [S7] | Ceiling calibration |
| 2025-12 | Self-Play SWE-RL (self-generated tasks) [S28] | Curriculum beyond human faults |
| 2026-01 | SWE-Replay (−17.4% cost, +3.8%) [S31]; daVinci-Dev mid-training [S44] | Efficient TTS; training frontier context |
| 2026-02-23 | **Verified retired** (59.4% flawed hard subset; top-two tie 396/500) [S6] | The validity reckoning |
| 2026-02→03 | Official LB standardizes on mini-SWE-agent + cost disclosure [S18]; SWE-rebench V2 [S45] | Measurement as first-class |
| 2026-03-31 | **Gemma 4 family** (31B: LCB 80.0, TB-Hard 36.0; thinking; dual attention) [S14] | The mandatory base exists |
| 2026-06 | Reward-hackability audit (28.5% incorrect-patch acceptance) [S12]; SWE-MeM adaptive memory; Socratic-SWE trace-derived skills [S54] | Hacking quantified; memory/skill lineages |
| 2026-07 | DeepSWE benchmark (113 original anti-recall tasks) [S11]; SWE-Doctor (+8–8.9 pp Pro) [S40] | Validity frontier; reproduce-first evidence |
| 2026-09 | SWE-Gate (review-constraint gap) [S38]; Pro Verified (leakage fixed) [S37]; PTA-IRT + trajectory-aware subsets (10% at <5% error) [S36, S39]; XRepoSkill (causal skill transfer) [S29]; Shortcutting-the-Fix taxonomy [S10]; Multimodal v2 | Evaluation-cost tooling; constraint-aware validity; exploit taxonomy |
| 2026-09-23 | **This competition starts** | — |
| 2026-10-01 | Cross-Benchmark RL transfer (last-mile failures trainable; partial transfer) [S30] | Strongest recent RL evidence |

### 13.3 Tier B: promising but unproven

LatentSift (policy-state candidate filtering; −49–62% verification tokens, matches accuracy) [S35];
Disagree-to-Explore routing-guided test-time scaling [S46]; daVinci-Dev-style agentic mid-training [S44]
(out of reach but directionally important); self-play task generation at competition scale [S28];
prompt/scaffold self-evolution à la Case 9, gated by paired A/Bs; SWE-MeM-style session memory within
the 32k envelope (compaction-adjacent; unproven here).

### 13.4 Unverified signals and vendor claims (labeled, not recommendations)

Vendor-harness frontier numbers without standardized-scaffold runs; SEO aggregator rankings (rejected,
ledger C-1/C-8); "agentic coding assistant" product benchmarks with unpublished protocols; community
claims of adapter scores on this competition (none verified as of cutoff); rumored next wheelhouse
contents. Also: Kaggle counters (entrants/participants) drift daily and disagree across snapshots —
useful only as trend lines.

### 13.5 New benchmarks and what they fix

Pro Verified (leakage); SWE-Gate (constraints); DeepSWE (recall); PonyEval (language OOD); Multimodal v2
(modality); rebench V2 (contamination); ProgramBench (rebuild-from-scratch difficulty; referenced from
mini-SWE-agent's channels); PTA-IRT / subset selection (evaluation cost). Pattern: 2026's benchmark
energy went to *trustworthiness and cost*, not scale — the field stopped growing benchmarks and started
auditing them.

### 13.6 Category view: new capability vs. better engineering vs. better measurement

Capability: Gemma 4 class models at 31B; RL-shaped mid-size agents (DeepSWE-Preview, Kimi-Dev).
Engineering: replay/selection, memory, skills, subset evals. Measurement: standardization, retirement,
verified reworks, constraint gates. For a fixed-model competition, the actionable frontier is ~10%
capability (already frozen in your base), ~40% engineering, ~50% measurement — which is the playbook's
thesis in one line.

### 13.7 Open problems and controversies

Whether reasoning modes help or hurt at lean budgets (V3.2 says hurt; MRCR-class probes say help);
whether self-improvement compounds or collapses (Cases 8–9 vs Shumailov [S42]); how to grade beyond
functional pass (SWE-Gate's open gap); harness-version comparability (no standard for version-pinning
in papers); and whether public benchmarks can ever fully decontaminate (Illusion says the tail is long).

### 13.8 What this means for our competition (consolidated)

(1) The validity wave validates the hosts' design — and warns that *your* patches should satisfy
unstated constraints (reviewer-grade quality). (2) The measurement wave gives you cheap-iteration
tooling (subset selection, paired stats) — adopt it. (3) The engineering wave (replay, skills, memory)
maps almost 1:1 onto declarative levers you control. (4) The capability wave is frozen — but its
training recipes (verified-data SFT) are your Branch B. (5) Nothing in the sweep changes the reliability
first-order: the newest paper with direct scoreboard relevance is SWE-Doctor (reproduce-first), not any
capability claim.

### 13.9 Where the field is most uncertain, and how to resolve it fastest

Uncertainty 1 — adapter serving here: resolve with the loud-adapter canary (one submission, one day).
Uncertainty 2 — thinking mode net effect: resolve with a 40-task paired replica A/B (one evening).
Uncertainty 3 — hidden-set library breadth: resolve by mining the 124 wheels for library clusters
(one afternoon; Appendix I). Uncertainty 4 — selection headroom: resolve by measuring pass@3 vs selected
on the dev split (built into the eval suite). Each resolution is cheap; each unlocks a playbook branch.

---
## 14. Part IX — The competition playbook

### 14.1 The constraint reality

| Constraint | Value | Strategic consequence |
|---|---|---|
| Model | `gemma-4-31b-it-qat-w4a16-ct` only | No model shopping; capability frozen |
| Serving | 4×L4, TP=4, 32,768 ctx, 20–40 tok/s | ~6 min/task average; thinking rationed |
| Artifact | Declarative YAML + prompts + skills + ≤ 3 GiB LoRA | All differentiation is text + small tensors |
| Oracle | Hidden tests; Container B resets test files | Self-verification is the only in-run check |
| Wall clock | 12 h incl. setup; overrun currently errors the run | Governor + failsafes are survival |
| Cadence | 1 submission/day; 2 finals; merger 11-25; final 12-02 | ~50 scored iterations available; iterate locally, submit to confirm |
| Board | ~58 public tasks; σ ≈ 2.5 tasks; 124-team tie at bronze | LB is a noisy oracle; never steer by it |
| Host-fix board | Thinking-drop fixed (wheelhouse, 10-01); read_file fixed; search_similar_code cap promised; LoRA sizing shipped v25 (unconfirmed by scored run); 12 h fix planned; overflow open; escaping fix direction unconfirmed; GPU outage 9/30–10/1 resolved, rerun policy unconfirmed | Pin the wheelhouse per submission; re-verify before each send (Appendix I) |

### 14.2 Recommended architecture (diagram) and reasoning for each component

```
agent.yaml (ADK orchestrator)
├── planner      thinking=on  — issue triage, plan, budget grant per phase
├── localizer    thinking=on  — reproduce issue → traceback → get_code_neighbors →
│                              minimal read closure (graph-first policy)
├── fixer        thinking=off — minimal anchored edit_file; re-read after edit; ≤ 2 candidates
├── verifier     thinking=off — run reproduced test; pass → submit_patch immediately
├── governor     (skills)     — token/time counters; compact at ~11k; submit-and-end at ~13k;
│                              T-minus-10-min global failsafe; k drops to 1 when time-pressed
└── adapters/    (Branch B, gated on U2) — rank-32..64 LoRA on verified teacher trajectories
```

Reasoning per component: planner thinks (reasoning helps planning-class probes; edits don't need it and
thinking tokens risk overflow); localizer is graph-first because localization is the largest measured
scaffold lever and the graph tools are cheap and structured; fixer is mechanical (3-tier matcher rewards
anchored minimal hunks; raw-text conventions eliminate the escaping failure class); verifier exists
because the oracle is hidden (self-verification quality = expected score); the governor exists because
44/44 overflowed sessions produced empty patches and the 12 h cliff errors runs; adapters are last
because no adapter has scored yet.

### 14.3 Tier A plan (frozen model)

Inference allocation: k ≤ 3 candidates on mid-band tasks, k = 1 on easy/hard extremes (§8.8
break-evens); thinking on planner/localizer only; tool-call batching in run_command; graph tools before
embedding search. Verification: reproduced-issue test as the gate; submit on first pass; best-of rerank
by cleanest diff among passes. Daily loop: local paired A/B → submit best-lower-bound config → log
termination causes → re-check host-fix board before the next send.

### 14.4 Tier B plan (with training)

Preconditions: U2 canary GO (a loud adapter scores ≥ 1 task); frozen branch stable ≥ 0.15 on the local
dev split; ≥ 2 weeks to merger (2026-11-25). Then Recipe A (§9.9): 3–5k verified teacher episodes +
fault-injected expansion → rank-32–64 LoRA → paired A/B → ship per-sub-agent adapters (localizer and
fixer only; planner/verifier stay base). Expected value: +3–8 tasks if serving works (Skywork/Kimi-Dev
calibration, discounted for QAT base + 4-repo narrowness); risk-capped at 2 submissions of validation.

### 14.5 Ranked move list (EV-ordered)

| # | Move | Expected gain | Cost | Confidence | Depends on | Risk | Cheap test |
|---|---|---|---|---|---|---|---|
| 1 | Never-lose-a-patch discipline (early submit_patch; governor; T-minus-10 failsafe) | +2–6 tasks (recovers part of 17–33% overflow band + timeout class) | Hours | High | None | Low | Overflow-rate delta on 40-task replica run |
| 2 | Reproduce-first localization (SWE-Doctor pattern, multi-faceted) | +2–5 tasks | 1 day | Med-High | graph tools | Low | Paired A/B, 40 tasks |
| 3 | Raw-text edit conventions + verify-after-edit | +1–3 tasks (22%→0% edit-failure class) | Hours | High | None (defensive) | Low | 30-context escaping test (already community-run) |
| 4 | Budget governor (6 min/task; phase caps) | +1–4 tasks (12 h cliff; overrun zeros) | 1 day | High | None | Low | Simulated-clock replica run |
| 5 | Best-of-≤3 + issue-test rerank | +1–4 tasks (selection headroom; pass@3 vs pass@1 gap) | 1 day | Medium | #1, #4 | Medium (time theft) | Measure pass@3−pass@1 on dev split |
| 6 | Thinking-for-planner-only policy | +0–3 tasks | Hours | Medium | U6 measurement | Overflow if wrong | 40-task paired A/B, overflow counts |
| 7 | Anti-exploit + no-test-edits prompt hardening | +0–2 tasks (waste avoidance) | Hours | High | None | None | Log T-09/T-08 rates |
| 8 | Per-repo skill specialization (fastapi/rich/requests/httpx idioms; wheels-bounded deps) | +1–3 tasks | 2 days | Medium | #2 | Overfit to 4 repos | Holdout-repo transfer check |
| 9 | Branch B LoRA (Recipe A) | +3–8 tasks | 1–2 GPU-weeks | Low-Med | U2 GO | Serving breakage; 3 GiB | Loud-adapter canary (1 submission) |
| 10 | Subset-eval iteration (10% trajectory-aware) | 0 tasks (speed) | Half day | High | Eval suite | Estimation error | Compare subset vs full on one variant |

### 14.6 Minimal-viable-strong / strong / moonshot + decision rule

**MVS (days 1–5):** moves 1–4 + eval suite skeleton; target: stable ≈ 0.12–0.15 replica score with zero
empty-patch terminations. **Strong (weeks 2–4):** + moves 5–8; 3-seed finalists; target 0.18–0.25.
**Moonshot (weeks 4–8, gated):** + move 9 and, for teams with rented compute only, a capped RLVR pilot
(§9.10); target 0.25–0.35. Decision rule: climb tiers only when the current tier's top move no longer
clears (1 task gain per engineering day) on the paired dev split — not when it "feels done."

### 14.7 Critical path and timeline, with parallel branches

Validate skeleton (day 1) → reproduce 0.12 (day 2) → moves 1–4 + first scored submission (by 10-08) →
moves 5–8 + Tier A freeze (by 10-20) → U2 canary (by 11-01) → Branch B if GO (11-03→11-20) → finals
selection by lower confidence bound (11-26) → final submissions (12-02). Parallel always: paper-track
artifact accumulation (weekly, 1 h); host-fix board monitoring (per submission). Paper stub submission
early (writeup-creation bug check + earliest-entry tiebreak).

### 14.8 Ablation plan (ordered, cost-aware)

Each ablation = one paired 80-task run (≈ 8 h unattended on the replica) unless noted: (1) governor
on/off; (2) reproduce-first vs issue-only localization; (3) raw-text vs default edit conventions;
(4) thinking planner-only vs always/never; (5) k = 1 vs 3 with rerank; (6) graph-first vs
embedding-first localization; (7) per-repo skills vs generic; (8) [GO only] adapter vs no-adapter on
identical prompts. Decision rule per ablation: McNemar p < 0.05 AND worst-of-3 non-regressing; two
consecutive nulls on a component class → park it.

### 14.9 Minimum eval suite to run locally

As specified in §10.11 (dev/holdout/gold-control/canaries, paired runner, 3-seed finalists, pass@3
readout, termination logger, optional 10% subset accelerator). The gold-patch control is non-negotiable:
if gold does not score 100% on your replica, every other number is void (the community's CV/LB
anti-correlation weeks were exactly this failure).

### 14.10 Budget allocation (compute, time, inference)

Scorer-side (per task, avg 5.7 min): setup 10% · reproduce 15% · localize 25% · repair+self-verify 35% ·
select+submit 15%. Team-side (8 weeks): 45% scaffold/reliability, 20% measurement/eval, 15% data
preparation, 10% Branch B (conditional), 10% paper track. Submission calendar: ~1 confirmation
submission per frozen improvement, not per idea; reserve the final week for finals-selection reruns.

### 14.11 Risk register + mitigations

| Risk | L | I | Mitigation |
|---|---|---|---|
| Overflow discards patches (fix open) | H | Critical | Move 1; < 14k target; early submit |
| Adapter serving still broken at merger | M | High (kills Branch B) | U2 gate by 11-01; Tier A unaffected |
| Platform incident eats slots | M | Med | Check pinned host threads before each send; keep a spare day buffer near deadlines |
| Harness change regresses mid-run | M | High | Pin wheelhouse per submission; Appendix I re-verify |
| LB noise misleads iteration | H | Med | Never steer by LB; paired dev split only |
| 12 h overrun zeros a run | M | Critical | max_time_minutes failsafe; T-minus-10 |
| Hidden set broader than 4 repos imply | M | Med | Language-agnostic prompts; wheels-cluster analysis |
| Overfit to public split | M | Med | Holdout untouched; OOD canary repo; scrambled-variant check |
| Team/merger logistics | L | Med | Calendar the 11-25 merger |
| Rules re-interpretation (distillation lineage) | L | High | Keep teacher-license documentation; Apache-2.0-clean artifacts |

### 14.12 Contingency plans

If U2 fails twice with ≤ 1 week to merger: abandon Branch B permanently, reallocate to moves 5–8 polish.
If the overflow fix deploys: re-measure, then demote move 1's rank and lengthen sessions (more
exploration budget). If thinking-drop fix proves flaky: default thinking off for all sub-agents. If an
outage eats a slot: request rerun in the pinned thread (744807 pattern), evidence-attached. If dev-split
gains stop translating to LB across two consecutive submissions: suspect replica drift → re-run gold
control + dead-task canaries before touching the agent.

### 14.13 Quick-start: first 24 hours / 72 hours / 1 week

**24 h:** join + accept rules; fork the best public notebook; run the official Getting Started locally
against the wheelhouse; submit a byte-identical fork once (platform smoke; establishes your slot
rhythm); read HARNESS_README §2/§3/§7/§8; set eval_config.yaml failsafes.
**72 h:** stand up the two-container replica; gold-control run (must be 100%); 80/49 split built;
baseline run ×3 with termination logging; implement moves 1 + 3 (hours each); first paired A/B.
**1 week:** moves 1–4 in; governor tuned; first improvement submission scored; pass@3 measured; failure
taxonomy populated; paper-track stub writeup created and saved; wheels-cluster analysis done (hidden-set
prior); watch-list items U1/U2/U6 assigned check dates.

### 14.14 If you only do five things

(1) Governor + early-submit + T-minus-10 failsafe (never end a task without a submitted patch).
(2) Reproduce-first, graph-first localization. (3) Paired local dev split with McNemar decisions — never
steer by the public LB. (4) Raw-text edit conventions with verify-after-edit. (5) Check the host-fix
board + Appendix I checklist before every submission.

### 14.15 What would change this plan (falsifiers)

(1) A loud-adapter submission scores cleanly → Branch B becomes co-primary immediately (recipe §9.9
starts that week). (2) The overflow/compaction fix deploys with a sane threshold → move 1 demotes;
exploration budgets lengthen; thinking policy revisits. (3) A dev-split ablation shows graph tools add
< 2 tasks → localization ordering reopens (embedding-first fallback). (4) The board widens sharply
(top > 0.30 public) → capability pressure rises; Branch B's EV recalculates upward; more risk-taking
justified. (5) Any verified report of hidden-set languages beyond Python → prompts, skills, and the
entire 4-repo prior re-scope. (6) Thinking-mode paired A/B shows net-negative at safe token budgets →
default everything to non-thinking and bank the tokens.

---
## 15. Contradictory evidence, risks, and limitations

### 15.1 Why the field's own numbers need adversarial treatment

Every major 2026 measurement event was an adversarial audit: Verified's retirement, Pro Verified's
leakage closure, the hackability quantification, SWE-Gate's constraint gap. The default posture toward
any published SWE-agent number — including this report's — is "auditable, therefore audit it": demand
the tuple (§7.4), check the denominator, check who verified.

### 15.2 Contamination and validity counterevidence

Illusion (76% vs 53% file-path identification from issue text; 35% 5-gram overlap) [S9]; retirement audit
(59.4% flawed hard subset; top-two tie) [S6]; hackability (28.5% incorrect-patch acceptance; +14.14 pp
phantom gains) [S12]; Pro Verified (leakage channels; models worse on the fixed set) [S37]; SWE-Gate
(221/644 functional passes violate review constraints) [S38]; Shortcutting taxonomy (git-history reuse,
upstream access, memorized solutions across 5 open LLMs) [S10]. For this competition: the air-gap and
private repos neutralize the classic channels; the residual risks are *your own* local loop (train/eval
contamination) and functional-only grading (write reviewer-grade patches).

### 15.3 Self-improvement counterevidence

Model collapse under recursive self-training (Shumailov) [S42]; judge-drift critiques of self-rewarding
[vs S43]; the unreplicated status of agent self-modification [S33]; MCTS cost/miscalibration [S32];
reward-hacking mechanics (§11.4). Net: self-improvement is a tool with a maintenance schedule, not a
compounding engine.

### 15.4 Uncorroborated recent advances

Everything in §13.3 (Tier B) is single-source as of cutoff: LatentSift, routing-guided TTS, mid-training
transfer claims, self-play task generation at scale, memory-management lineages. Treat as hypotheses
with cheap tests, not as defaults.

### 15.5 In-distribution-only gains

Most published training gains are in-distribution (train and eval share repo families). The OOD-positive
exceptions are narrow: skill-prior transfer (Kimi-Dev) [S26], partial cross-benchmark RL transfer [S30],
causal skill attribution (XRepoSkill) [S29]. Your holdout + OOD-canary design exists because the base
rate is against transfer.

### 15.6 Genuine unresolved conflicts

Reasoning mode: helps on reasoning probes, hurts V3.2 on a lean scaffold (C-3/C-6 ledger). Scaffold
complexity: Agentless/minimalism vs platform ecosystems — resolved only per-budget. Thinking-token
accounting vs overflow threshold (U6). CV/LB divergence root causes (environmental per evidence, but the
rerun backlog muddied week-2 data). Public-board top score (login-gated; community numbers ± 0.04).

### 15.7 Playbook red-team

"You'll overfit the public split." Countered by holdout discipline + OOD canary + scrambled-variant
checks. "The governor wastes easy tasks." Countered by adaptive k and the mid-band spending rule.
"Branch B is dead weight." Countered by the U2 gate and the hard two-failure kill rule. "Your A/Bs are
underpowered." Countered by discordant-pair thresholds and 3-seed worst-case selection; where power is
insufficient, the move list defaults to the cheaper variant. "The board's noise makes all this
pointless." Countered by expected-task optimization: the strategy targets the private final too, where
N doubles and σ/√N shrinks.

### 15.8 Worst-case beginner mistakes and consequences

Training before the canary (wasted GPU-weeks on a dead branch); iterating on the LB (random-walk
engineering); trusting the notebook image as ground truth (CV/LB anti-correlation); long
exploration-heavy prompts (overflow → empty patches); test-editing "fixes" (structurally void); last-day
submission logistics (outage ate a day this week already); ignoring the merger deadline (team
scattered).

### 15.9 Where this report is uncertain

U1 (compaction threshold), U2 (adapter scoring), U3 (board top), U4 (hidden-set language breadth),
U5 (task order), U6 (thinking-token accounting) — all logged with resolution paths (§13.9, §14.15).
Additionally: Branch B's expected effect is an extrapolation from full-FT results to LoRA on a QAT base —
honestly labeled Low-Medium confidence.

### 15.10 What would change these conclusions

See §14.15 falsifiers; at report level: a post-cutoff discovery that adapter scoring was already fixed
and scored would retroactively upgrade Branch B throughout; a wave of independent replications of the
Tier-B cluster would re-rank Part VIII; a host rules change (e.g., model re-pin or artifact cap change)
would re-scope Part IX.

---

## 16. Recommendations

### 16.1 For the competitor (consolidated, ranked)

1. Execute Tier A (moves 1–4) this week; measure with the paired suite; submit to confirm, not to
   explore. 2. Build the eval suite before the third submission. 3. Run the U2 canary by 11-01. 4. Keep
   Branch B strictly gated and time-boxed. 5. Accumulate paper-track artifacts weekly; submit the stub
   early. 6. Re-verify (Appendix I) before every send; monitor the host-fix board and pinned threads.
7. Select finals by lower confidence bound, not best mean. 8. Write reviewer-grade patches (SWE-Gate
   lesson). 9. Document teacher-license lineage from day one. 10. Spend the last week on measurement,
   not features.

### 16.2 For the learner (study order + minimum viable understanding)

Week-by-week per reading Path 2 (§0.3); minimum viable understanding = the ten concepts of §2.2 plus the
ability to (a) reconstruct an instance's schema from memory, (b) compute pass@k by hand, (c) design a
paired A/B that would survive §11.7's seven questions, and (d) explain why the overflow cliff reorders
every priority.

### 16.3 For the field (brief)

Version-pin scaffolds in papers as leaderboards now do; report cost per trajectory as a default column;
publish decontamination audits with benchmarks; adopt review-constraint gates beyond functional pass;
and standardize trajectory-subset evaluation protocols — the cheapest quality multiplier the field has
left on the table.

---

## 17. Future outlook and scenarios

### 17.1 Base case (most likely 6–18 months)

Standardized-board plateau persists (70–80%) while cost/trajectory keeps falling (10–25×/year observed);
constraint-aware and leakage-proof benchmarks become the norm; mid-size open models with verified-data
SFT close to within ~10 points of frontier on curated sets; this competition's winner lands ~0.25–0.35
via scaffold + measurement excellence, with adapters contributing if the serving fixes hold.

### 17.2 Upside scenario

Adapter serving stabilizes early; a participant demonstrates a distilled-LoRA stack that adds +8–12
tasks; graph-native localization papers emerge from the paper track; the winning methods generalize to
SWE-Gate-style constraint compliance (reviewer-grade patches), setting a new evaluation bar.

### 17.3 Downside / disruption scenario

Harness instability persists (outages, scoring regressions) through the final month; the board
compresses further (tie-band widens); finals decided by variance and slot luck; post-hoc, the paper track
carries the durable value of the event.

### 17.4 What each scenario implies for this competition

Base case → follow the playbook as written. Upside → accelerate Branch B at the first confirmed
adapter-scored run by a *competitor* (public signal, no espionage needed — the board reveals it).
Downside → double down on reliability and finals-selection discipline (lower-confidence-bound selection
is exactly the variance hedge); paper track becomes the primary ROI.

### 17.5 Leading indicators to watch

Any adapter-bearing score on the public board (U2 resolution by proxy); wheelhouse version bumps with
overflow/12h fixes; the pinned outage thread's rerun policy; swebench.com protocol changes (a new
standardized scaffold version); Gemma 4 point releases or QAT re-exports (would be a rule change);
paper-track submission volumes (competition intensity signal).

---

## 18. Conclusion

The competition freezes the model, the harness, the hardware, and the budget — and in doing so makes the
contest legible: it is a measurement-and-reliability competition wearing an agent costume. The evidence
assembled here — the 2026 validity reckoning that explains the air-gapped design; the standardization
event that shows scaffolds move scores more than model tiers; the data-scaling results that price the
(gated) training branch; the reliability ledger of the first ten days that prices everything else —
converges on one ordering: **never lose a task you earned; localize before you touch; verify before you
submit; measure in pairs or not at all; and treat adapters as a gated option, not a plan.** The frozen
Gemma 4 31B is more capable than the current public scores extract from it; the difference between the
board's present top and a winning entry will be made of discipline, not of parameters.

---
## 19. Research-question coverage matrix

| Question | Status | Where addressed | Gap |
|---|---|---|---|
| RQ-PRIMARY (beginner understanding + competitor build) | ✅ | Whole report; §0, §2, §14 | — |
| RQ-01 competition identity/metric/constraints/baselines | ✅ | §0.2, App. C/D; live re-verified 2026-10-02 incl. outage delta | Board top login-gated (U3) |
| RQ-01.1 variant used/not used | ✅ | §6.5 (own family; not any public variant) | — |
| RQ-01.2 hard constraints verbatim | ✅ | App. D | — |
| RQ-01.3 official baselines + config | ✅ | §0.2, §7.1 | Configs of private top entries unknowable |
| RQ-01.4 prior winners/high scorers | ✅ (n=1 event) | Case 12; no prior editions exist | — |
| RQ-01.5 DQ/failure modes | ✅ | §8.6, App. E taxonomy; Case 12 | — |
| RQ-02 SWE-bench construction/schema/meaning | ✅ | §6.1–6.4 | — |
| RQ-02.1 variants and differences | ✅ | §6.5 table | — |
| RQ-02.2 validity/contamination/saturation | ✅ | §6.6, §15.2 | — |
| RQ-02.3 successors and why | ✅ | §6.7, §13.5 | — |
| RQ-03 score computation and meaning | ✅ | §7.1 worked computation | — |
| RQ-03.1 pass@k | ✅ | §7.2 numeric example | — |
| RQ-03.2 why scores disagree | ✅ | §7.3 (10 causes) | — |
| RQ-03.3 entry audit | ✅ | §7.5 protocol, §7.6 three audits | — |
| RQ-03.4 official vs self vs community boards | ✅ | §7.6–7.9; competition board login-gated (flagged) | Live top unknown |
| RQ-04 architectures/tools/inference strategies + effects | ✅ | §8 (all); effect sizes cited | — |
| RQ-04.1 tool/interface wins | ✅ | §8.2, §8.4 | — |
| RQ-04.2 localization/retrieval/context effects | ✅ | §8.3 | — |
| RQ-04.3 scaffold failure modes | ✅ | §8.6 + App. E | — |
| RQ-05 training methods + evidence | ✅ | §9 | — |
| RQ-05.1 SFT/distillation data-format-effect | ✅ | §9.2 | — |
| RQ-05.2 RLVR variants/stability/hparams | ✅ | §9.4–9.6, §9.10 | Hyperparameters are recipe-class, not per-model tuned |
| RQ-05.3 (multi-turn credit) | ✅ | §9.5 | — |
| RQ-05.4 (should-I-train) | ✅ | §9.1 | — |
| RQ-06 data practices + effects | ✅ | §10 | — |
| RQ-06.1 trajectory quality/filters | ✅ | §10.2, §10.4 | — |
| RQ-06.2 difficulty/curriculum | ✅ | §10.5 | — |
| RQ-06.3 contamination removal | ✅ | §10.6 | — |
| RQ-06.4 failure analysis → best-fix EV | ✅ | §10.10, App. G | — |
| RQ-07 self-improvement + failures | ✅ | §11 | — |
| RQ-07.1 self-play/curricula | ✅ | §11.2, S28 | — |
| RQ-07.2 self-verify/repair/debug | ✅ | §11.2, Case 10 | — |
| RQ-07.3 self-distillation/envs | ✅ | §11.2, §10.8 | — |
| RQ-07.4 evolutionary search | ✅ | §11.2 (MCTS), Case 8 | — |
| RQ-07.5 test-time scaling | ✅ | §8.7, §11.1 | — |
| RQ-08 what changed 2025–Oct 2026 + credibility | ✅ | §13 (tiered, 90-day sweep §13.1) | — |
| RQ-08.1 new benchmarks/fixes | ✅ | §13.5 | — |
| RQ-08.2 independently supported methods | ✅ | §13.2 vs 13.3 | — |
| RQ-08.3 open problems | ✅ | §13.7 | — |
| RQ-09 ranked winning plan | ✅ | §14 (all subsections) | — |
| RQ-09.1 architecture per budget tier | ✅ | §14.3, §14.4 | — |
| RQ-09.2 minimal-viable → incremental | ✅ | §14.6 | — |
| RQ-09.3 ablation plan | ✅ | §14.8, App. G | — |
| RQ-09.4 risk register/contingency | ✅ | §14.11, §14.12 | — |
| VQ-01 contaminated/unreproducible numbers | ✅ | §7.8–7.9, §15.2 | — |
| VQ-02 unsupported self-improvement claims | ✅ | §11.8, §15.3 | — |
| VQ-03 comparable score pairs | ✅ | §7.4, §7.6 | — |
| VQ-04 competition metric pitfalls detectable by competitor | ✅ | §7.10 (escaping/overflow/variance/CV-LB), App. H | Compaction threshold unknown (U1) |
| VQ-05 corroborated vs vendor 2025–26 advances | ✅ | §13.2–13.4 | — |
| VQ-06 OOD transfer evidence | ✅ | §9.7, §15.5, Case 14 | Thin literature — flagged |
| VQ-07 conflicting effect sizes | ✅ | §7.8, §15.6 | — |
| VQ-08 best-public vs winning threshold gap | ✅ | §2.3, §7.1 arithmetic; best public ≈ 0.12; podium band estimated 0.17+ | Exact threshold unobservable |
| SQ-01 ranked moves with EV | ✅ | §14.5 | — |
| SQ-02 beginner study order | ✅ | §0.3, §16.2 | — |
| SQ-03 single recommendation + runner-ups + constraint sets | ✅ | §14.2–14.4, §14.6 | — |
| SQ-04 consolidated risk register | ✅ | §14.11, §15.7 | — |
| SQ-05 beginner's biggest mistake | ✅ | §0.4, per-part misconception sections | — |
| SQ-06 most uncertain topic + fastest resolution | ✅ | §13.9 (U2 canary etc.) | — |

## 20. Claim-evidence / traceability matrix (condensed)

| Objective (from §1.2) | RQs | Workstreams | Sections | Key sources | Confidence |
|---|---|---|---|---|---|
| Competition intelligence | RQ-01(.1–.5), VQ-04/08 | WS-00 | §0.2, §7.1, App. C/D | S5, S15–S17, S47–S49 | A (host-verified) / C (board state) |
| Benchmark foundations | RQ-02(.1–.3) | WS-01 | §6 | S2, S6–S11, S37–S39, S41 | A |
| Measurement/auditing | RQ-03(.1–.4), VQ-01/03/07 | WS-03, WS-15 | §7 | S1, S8, S18, S36, S39 | A |
| Agent stack | RQ-04(.1–.3), SQ-01 | WS-05, WS-10 | §8 | S3, S4, S18, S31–S35, S40, S51 | A/B |
| Training | RQ-05(.1–.4), VQ-02/06 | WS-06 | §9 | S19–S30, S44 | A/B |
| Data science | RQ-06(.1–.4) | WS-07, WS-09 | §10 | S13, S19–S22, S25–S26, S28, S36 | A/B |
| Self-improvement | RQ-07(.1–.5), VQ-02 | WS-08 | §11 | S12, S19, S25, S31–S35, S42–S43 | A/B (ledgered) |
| Frontier round-up | RQ-08(.1–.3), VQ-05 | WS-13 | §13 | S6–S14, S29–S46, S54 | Tiered A/B |
| Playbook | RQ-09(.1–.4), SQ-01/03/04 | WS-14, WS-16 | §14, App. G/H | all above | Mixed, labeled |
| Pedagogy/assembly | SQ-02/05, RQ-PRIMARY | WS-17 | §0, §2.2, §16.2, App. A | — | — |

---

## 21. Source list

### 21.1 Primary research (arXiv unless noted; IDs verified via arXiv API 2026-10-02)

- **S1** Chen et al., *Evaluating Large Language Models Trained on Code* (Codex) — 2107.03374v2 (pass@k estimator, §2.1)
- **S2** Jimenez et al., *SWE-bench: Can Language Models Resolve Real-World GitHub Issues?* — 2310.06770
- **S3** Yang et al., *SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering* — 2405.15793v3
- **S4** Xia et al. (Agentless team), *Agentless: Demystifying LLM-based Software Engineering Agents* — 2407.01489v2
- **S9** *The SWE-Bench Illusion: When State-of-the-Art LLMs Remember Instead of Reason* — 2506.12286v4 (Microsoft)
- **S10** *Shortcutting the Fix: … Agentic Exploits in Software Engineering Benchmarks* — 2609.06780v1
- **S11** *DeepSWE* (benchmark) — 2607.07946v1
- **S12** *Auditing Reward Hackability in Code RL Training Environments* — 2606.16062v1
- **S13** *SPICE* (SWE-bench labeling) — 2507.09108v5
- **S19** Pan et al., *SWE-Gym* — 2412.21139v2 (ICML 2025)
- **S20** Yang et al., *SWE-smith* — 2504.21798v2
- **S21** *Multi-SWE-bench* — 2504.02605
- **S22** *R2E-Gym* — 2504.07164v1
- **S23** *SWE-RL* — 2502.18449v2
- **S24** *SWEET-RL* — 2503.15478v1
- **S25** Zeng et al., *Skywork-SWE* — 2506.19290v1
- **S26** Yang et al. (Moonshot), *Kimi-Dev* — 2509.23045v3
- **S28** *Self-Play SWE-RL* — 2512.18552v3
- **S29** *XRepoSkill* — 2609.36807v1
- **S30** *Cross-Benchmark Transfer from RL on Agentic Coding Tasks* — 2610.00890v1
- **S31** Ding & Zhang, *SWE-Replay* — 2601.22129v2
- **S32** Antoniades et al., *SWE-Search* — 2410.20285v6
- **S33** Robeyns, Szummer, Aitchison, *A Self-Improving Coding Agent* — 2504.15228v2
- **S34** Snell et al., *Scaling LLM Test-Time Compute Optimally…* — 2408.03314v1
- **S35** Han et al., *LatentSift* — 2609.36371v1
- **S36** Ayyad et al., *Trajectory-Aware Benchmark Subset Selection…* — 2609.24928v2
- **S37** Zheng et al., *SWE-Bench Pro Verified* — 2609.08149v2
- **S38** He et al., *SWE-Gate* — 2609.04167v1
- **S39** Duan et al., *Efficient SWE Agent Benchmarking via Trajectory-Aware Evaluation* (PTA-IRT) — 2609.01603v1
- **S40** Guo et al., *SWE-Doctor* — 2607.00990v1
- **S41** Xie et al., *PonyEval* — 2609.27832v1
- **S42** Shumailov et al., *The Curse of Recursion: Training on Generated Data Makes Models Forget* — 2305.17493v3
- **S43** Yuan et al., *Self-Rewarding Language Models* — 2401.10020v3 (ICML 2024)
- **S44** *daVinci-Dev* — 2601.18418v2
- **S45** *SWE-rebench V2* — arXiv 2026-02-27 (title verified via cs.SE sweep, S54; ID not captured — verify before external citation)
- **S46** *Disagree to Explore, Agree to Commit* — 2608.22191v1

### 21.2 Official documentation and competition pages

- **S5** HARNESS_README.md (competition data package; submission format §2, serving §3, eval_config §7, verification §8) — local snapshot 2026-09-29
- **S15** Kaggle Overview/Data/Rules pages — local snapshots 2026-09-29 + live re-fetch 2026-10-02 (06:20Z)
- **S16** Kaggle Getting Started notebook + wheelhouse dataset references — local snapshot 2026-09-29
- **S47** Competition discussion corpus: threads 742807, 742815, 743007, 743063, 743140, 743186, 743213, 743508, 743531, 743600, 743683, 743973, 744054, 744272, 744319, 744331, 744354, 744355, 744370, 744577, 744678, 744692, 744800, 744802, 744805, 744807, 744813, 744861, 744924, 744951, 744965 — intel 2026-09-30 + live fetches 2026-10-02
- **S49** Paper-track intel (rubric, judges, mechanics, host Q&A) — local snapshot 2026-09-30

### 21.3 Official repositories and model cards

- **S14** Gemma 4 Technical Report — arXiv 2607.02770v2 (fetched 2026-10-02; benchmark tables)
- **S27** Agentica, DeepSWE-Preview model card — Hugging Face (2025-07)
- **S51** mini-SWE-agent documentation + GitHub (software project; no arXiv paper exists — title search verified empty 2026-10-02)
- **S53** Gemma 4 31B QAT W4A16 model card — Hugging Face (google/…)

### 21.4 Leaderboards and datasets

- **S18** Official SWE-bench leaderboards (swebench.com; Verified, bash-only, mini-SWE-agent standardized; rows 1–26 with dates, versions, $/trajectory) — fetched 2026-10-02 06:22Z
- **S6** OpenAI, SWE-bench Verified introduction (Aug 2024) and retirement note (2026-02-23) — openai.com
- **S7** Scale AI, SWE-bench Pro launch (Nov 2025) + Pro V2 anti-gaming notes — scale.com
- **S8** "Coding Agents Have Converged" leaderboard audit (top-two tie 396/500) — swebench.com, 2026
- **S48** Community EDA (Afshar: 58 public tasks, 124-team bronze tie; baseline score table incl. romanrozen 0.12) — Kaggle notebooks/discussion, 2026-09-30
- **S50** AIMO-2 winning-solution writeups (distill → small model → TIR → best-of-n pattern) — Kaggle, 2024–25 [C-tier]

### 21.5 Reputable journalism — none used as primary evidence (aggregators rejected; see ledger C-1/C-8).

### 21.6 Community and expert commentary

Host replies in S47 (highest-confidence competition channel); participant repro reports (Whisper Last, Ke Wu, Adithya Giridharan, wrath333, Isaka Tsuyoshi, 508shuto, Darío Ávalos, Chih-Kai Wang, others) — labeled per-thread and dated.

### 21.7 Retracted / corrected / superseded (flagged)

- SWE-bench Verified as a live benchmark (retired 2026-02-23) — historical comparability only.
- SWE-bench Pro pre-Verified results — superseded by S37's fixed variant for capability claims.
- SEO aggregator claims (benchlm, morphllm, localaimaster, softwareseni) — rejected, never used.
- Consol-report note resolved: SWE-bench Illusion ID now verified as 2506.12286 (was "to-confirm").

---
## 22. Appendices

### Appendix A — Glossary (156 terms, grouped)

**Benchmark and task structure (1–30)**

1. **SWE-bench** — benchmark converting merged GitHub PRs into repo-level issue-fixing tasks graded by tests [S2]. 2. **Instance** — one task: repo snapshot + issue + gold patch + test patch + F2P/P2P. 3. **Gold patch** — the PR's source diff; hidden from agents. 4. **Test patch** — the PR's test diff; applied only at verification. 5. **FAIL_TO_PASS (F2P)** — tests failing pre-patch that must pass post-patch. 6. **PASS_TO_PASS (P2P)** — tests passing pre-patch that must stay passing. 7. **Resolved** — F2P ∧ P2P ∧ (here) exit-0 ∧ >0 passed ∧ 0 fail/error ∧ no required skip. 8. **Resolution rate** — resolved fraction over tasks. 9. **Repo snapshot** — repository state at base commit given to the agent. 10. **Base commit** — parent commit of the source PR. 11. **Problem statement** — issue title+body; the agent's requirement input. 12. **Oracle** — the hidden ground-truth grading signal. 13. **SWE-bench Lite** — 300-task cheap subset (legacy). 14. **SWE-bench Verified** — 500-task human-filtered subset; retired 2026-02-23. 15. **SWE-bench Pro** — 1,865-task commercial/long-horizon benchmark (Scale AI). 16. **Pro Verified** — leakage-fixed, task-refined Pro (2609.08149). 17. **SWE-bench Live** — continuously refreshed post-cutoff tasks. 18. **SWE-rebench (V2)** — Nebius-style decontamination-first collection. 19. **Multi-SWE-bench** — cross-repo fix benchmark. 20. **Multimodal v2** — UI-screenshot + code variant (480 tasks). 21. **DeepSWE** — 113 original long-horizon tasks, anti-recall by construction. 22. **SWE-Gate** — benchmark adding review-constraint compliance tests. 23. **PonyEval** — 291-instance Pony-language SWE-bench-style benchmark. 24. **Contamination** — benchmark content present in pretraining data. 25. **Decontamination** — detection/removal of contaminated items. 26. **Memorization** — recall of seen solutions masquerading as capability. 27. **Saturation** — frontier scores compressing at a benchmark's top. 28. **Identifier scrambling** — renaming identifiers to measure memorization (Illusion's probe). 29. **Reward hacking** — optimizing the graded signal against its intent. 30. **Leakage channel** — any path by which gold information reaches the agent/verifier unfairly.

**Measurement and statistics (31–51)**

31. **pass@k** — P(≥1 of k samples solves); unbiased estimator 1 − C(n−c,k)/C(n,k) [S1]. 32. **Unbiased estimator** — averaging over C(n,k) subsets removes small-sample bias. 33. **pass^k** — k chosen artifacts all/one must succeed (selection-dependent). 34. **Selected vs any success** — submitted-artifact score vs any-of-k ceiling. 35. **Oracle success** — scaffold ceiling with gold-file starts. 36. **Scaffold** — the agent loop around a model. 37. **Harness** — the execution+grading machinery. 38. **ACI** — agent-computer interface (SWE-agent's guarded tools). 39. **Paired comparison** — same tasks, same seeds, A vs B. 40. **McNemar's test** — significance on discordant pairs of paired binaries. 41. **Discordant pairs** — tasks where exactly one variant resolves. 42. **Lower confidence bound** — conservative submission-selection statistic. 43. **Run variance (σ)** — score spread across identical reruns (≈ 2.5 tasks here). 44. **Conditional resolution** — resolved ÷ produced-patches (PonyEval's metric). 45. **Cost per trajectory** — $/task-run; the standardization axis. 46. **Leaderboard standardization** — fixing scaffold+protocol to make entries comparable. 47. **Audit protocol** — §7.5's eight-step entry check. 48. **Comparability tuple** — (model, scaffold, benchmark, budget, sampling, verification, date). 49. **Subset selection** — evaluating on a representative task subset. 50. **PTA-IRT** — privileged trajectory-aware item-response theory for cheap ability estimation. 51. **Trajectory embedding** — vector representation of an agent run (subset selection input).

**Agent stack (52–91)**

52. **Agent loop** — perceive→decide→act→observe cycle. 53. **Sub-agent** — specialized delegated agent (localizer, fixer…). 54. **Orchestrator** — top-level controller spawning/routing sub-agents. 55. **ADK Agent Config** — Google's declarative YAML agent definition (the submission format). 56. **Skill** — SKILL.md-manifested capability package with sandboxed scripts. 57. **Tool call** — one structured action against the environment. 58. **Action space** — the tools available (nine here). 59. **Localization** — finding where to change code. 60. **Repo map** — compressed structural summary of a repository. 61. **Code graph** — nodes=code entities, edges=relations (127 shipped). 62. **Node/edge** — graph vertices/relations. 63. **Embedding (256-dim)** — per-node vector powering similarity search. 64. **Similarity search** — search_similar_code; embedding nearest-neighbors. 65. **get_code_neighbors** — graph tool: adjacent entities (names only, cheap). 66. **get_code_subgraph** — graph tool: bounded sub-repo map. 67. **Edit anchor** — uniquely identifying context for a patch hunk. 68. **3-tier matching** — edit_file's exact → whitespace → context-anchored cascade. 69. **Minimal diff** — smallest sufficient patch (P2P-safe, reviewer-friendly). 70. **Verify-after-edit** — immediate re-read confirming the edit landed. 71. **Reproduce-first** — trigger the reported failure before patching. 72. **Bug-reproduction test (BRT)** — agent-written test reproducing the issue. 73. **Multi-faceted diagnosis** — several BRTs across behavioral requirements (SWE-Doctor). 74. **Context window** — max tokens per session (32,768 here). 75. **Compaction** — summarizing history near a token threshold. 76. **Overflow (destructive)** — exceeding context → patch discarded (the known failure). 77. **Token budget** — the real currency of a session. 78. **Governor** — policy enforcing per-phase time/token/call caps. 79. **T-minus-10 failsafe** — submit-best-and-stop at 10 minutes to wall-clock end. 80. **Early submit** — commit a working patch the moment it verifies. 81. **Best-of-n** — generate n candidates, select one. 82. **Reranking** — ordering candidates by a selector signal. 83. **Replay** — reusing intermediate trajectory states for cheap resampling (SWE-Replay). 84. **MCTS** — Monte Carlo tree search over agent trajectories. 85. **Value model** — learned state-quality estimator (miscalibration risk). 86. **Compute-optimal scaling** — allocating test-time compute per-difficulty (Snell). 87. **Thinking mode** — Gemma 4's reasoning channel (`<|channel>thought`). 88. **Reasoning content** — the field vLLM must carry to preserve thoughts across turns (the dropped-field bug). 89. **Temperature** — sampling randomness knob (0.2 default here). 90. **Termination cause** — logged reason a session ended (top diagnostic). 91. **Failure taxonomy** — coded failure classes T-01…T-10 (Appendix E).

**Training and data (92–126)**

92. **SFT** — supervised fine-tuning on demonstrations. 93. **Trajectory (training)** — full (state→action) episode as training data. 94. **Distillation** — training on a teacher's outputs. 95. **Teacher-license compliance** — the rule gate for external teachers here. 96. **Rejection sampling** — keep only verified-successful generations. 97. **Verified-only filter** — the dataset quality rule. 98. **Fault injection** — seeding synthetic bugs (SWE-smith). 99. **Mutation operator** — the code transformation seeding a fault. 100. **Synthetic task** — auto-generated instance with auto-verified oracle. 101. **Environment (SWE-Gym sense)** — executable task runtime. 102. **R2E** — repository-to-environment automation. 103. **Dataset mixture** — weighted blend across sources/repos. 104. **Curriculum** — easy→hard training order. 105. **Difficulty estimate** — predicted task hardness (gold size, F2P count, teacher success rate). 106. **Deduplication** — removing near-identical tasks. 107. **Holdout** — never-trained eval split. 108. **OOD canary** — a distribution-shift probe kept out of training. 109. **LoRA** — low-rank adapter fine-tuning. 110. **PEFT** — parameter-efficient fine-tuning family. 111. **Rank (r)** — adapter bottleneck dimension (≤ 128 here). 112. **Adapter routing** — per-agent adapter selection in ADK. 113. **Multi-LoRA** — serving several adapters (max 8 here). 114. **RLVR** — RL with verifiable (executable) rewards. 115. **GRPO** — group-relative policy optimization (rollout-group advantages). 116. **PPO** — proximal policy optimization. 117. **DPO** — direct preference optimization on pairs. 118. **KL anchor** — penalty keeping the policy near a reference. 119. **Credit assignment** — attributing terminal reward to steps. 120. **Reward model** — learned scorer (hackable; avoided in RLVR). 121. **Self-rewarding** — model judges its own outputs for training signal. 122. **Self-play** — the system generates its own tasks/curricula. 123. **Model collapse** — degradation from recursive self-training. 124. **Reward drift** — the loop's metric diverging from true quality. 125. **Skill prior** — transferable procedural knowledge from training (Kimi-Dev). 126. **Mid-training** — pretraining-phase specialization on domain corpora.

**Systems and competition operations (127–156)**

127. **vLLM** — the serving engine. 128. **Tensor parallelism (TP)** — sharding a model across GPUs (TP=4). 129. **QAT** — quantization-aware training. 130. **W4A16** — 4-bit weights, 16-bit activations. 131. **compressed-tensors** — vLLM's quantized-weight layout. 132. **KV cache** — attention key/value memory pool. 133. **KV collapse** — the adapter-induced KV shrink (46,048→7,600). 134. **max_model_len** — served context length (32,768). 135. **gpu_memory_utilization** — VRAM budget fraction (0.80 scorer). 136. **Tool/reasoning parser** — vLLM modules for gemma4 tool-calls/thoughts. 137. **Air-gapped sandbox** — no-network execution environment. 138. **network_mode none** — the Docker-level air-gap. 139. **Wheelhouse** — the pinned offline package set (and the fix train's name). 140. **Offline wheels** — the 124 preloaded packages. 141. **Container A/B** — agent-sandbox vs verification containers. 142. **Anti-tamper reset** — test files restored before verification. 143. **Resilient apply** — 4-pass patch application. 144. **eval_config.yaml** — per-task budget knobs (four supported keys). 145. **max_time_minutes** — per-task time failsafe. 146. **Tool-call budget** — 100 calls default per task. 147. **Wall clock (12 h)** — the global run limit incl. setup. 148. **submission.zip** — the declarative artifact (< 3 GiB). 149. **Declarative submission** — config+text+tensors only; no Python entrypoints. 150. **Extension whitelist** — allowed file types in the zip. 151. **Daily slot** — one scored submission per day. 152. **Finals selection** — choosing the 2 judged entries. 153. **Merger deadline** — last day to join/merge teams (2026-11-25). 154. **Public/private split** — ~58 public-LB tasks vs the private remainder. 155. **Paper track** — the separate $35k writeup hackathon. 156. **Apache 2.0 obligation** — winners must open-source with reproducibility docs.

### Appendix B — BibTeX (verified IDs; authors as captured via arXiv API)

```bibtex
@article{chen2021codex, title={Evaluating Large Language Models Trained on Code}, author={Chen, Mark and others}, journal={arXiv preprint arXiv:2107.03374}, year={2021}}
@article{jimenez2023swebench, title={SWE-bench: Can Language Models Resolve Real-World GitHub Issues?}, author={Jimenez, Carlos E. and others}, journal={arXiv preprint arXiv:2310.06770}, year={2023}}
@article{yang2024sweagent, title={SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering}, author={Yang, John and Jimenez, Carlos E. and Wettig, Alexander and Lieret, Kilian and others}, journal={arXiv preprint arXiv:2405.15793}, year={2024}}
@article{xia2024agentless, title={Agentless: Demystifying LLM-based Software Engineering Agents}, author={Xia, Chunqiu Steven and others}, journal={arXiv preprint arXiv:2407.01489}, year={2024}}
@article{illusion2026, title={The SWE-Bench Illusion: When State-of-the-Art LLMs Remember Instead of Reason}, journal={arXiv preprint arXiv:2506.12286}, year={2025}}
@article{shortcut2026, title={Shortcutting the Fix: Identifying and Categorizing Agentic Exploits in Software Engineering Benchmarks}, journal={arXiv preprint arXiv:2609.06780}, year={2026}}
@article{deepswebench2026, title={DeepSWE: A Benchmark for Original Long-Horizon Software Engineering Tasks}, journal={arXiv preprint arXiv:2607.07946}, year={2026}}
@article{hackability2026, title={Auditing Reward Hackability in Code RL Training Environments}, journal={arXiv preprint arXiv:2606.16062}, year={2026}}
@article{spice2025, title={SPICE: SWE-bench-Based Labeling of Issue-Test Relation Ships}, journal={arXiv preprint arXiv:2507.09108}, year={2025}}
@article{pan2024swegym, title={Training Software Engineering Agents and Verifiers with SWE-Gym}, author={Pan, Jiayi and Wang, Xingyao and Neubig, Graham and Jaitly, Navdeep and others}, journal={arXiv preprint arXiv:2412.21139}, year={2024}}
@article{yang2025swesmith, title={SWE-smith: Scaling Data for Software Engineering Agents}, author={Yang, John and Lieret, Kilian and Jimenez, Carlos E. and Wettig, Alexander and others}, journal={arXiv preprint arXiv:2504.21798}, year={2025}}
@article{multiswe2025, title={Multi-SWE-bench: A Multimodal Benchmark for Repository-Level Software Development}, journal={arXiv preprint arXiv:2504.02605}, year={2025}}
@article{r2egym2025, title={R2E-Gym: Procedural Environments and Hybrid Verifiers for Scaling Open-Weights SWE Agents}, journal={arXiv preprint arXiv:2504.07164}, year={2025}}
@article{swerl2025, title={SWE-RL: Advancing LLM Reasoning via Reinforcement Learning on Open Software Evolution}, journal={arXiv preprint arXiv:2502.18449}, year={2025}}
@article{sweetrl2025, title={SWEET-RL: Training Multi-Turn LLM Agents on Collaborative Reasoning Tasks}, journal={arXiv preprint arXiv:2503.15478}, year={2025}}
@article{zeng2025skywork, title={Skywork-SWE: Unveiling Data Scaling Laws for Software Engineering in LLMs}, author={Zeng, Liang and others}, journal={arXiv preprint arXiv:2506.19290}, year={2025}}
@article{yang2025kimidev, title={Kimi-Dev: Agentless Training as Skill Prior for SWE-Agents}, author={Yang, Zonghan and others}, journal={arXiv preprint arXiv:2509.23045}, year={2025}}
@article{selfplay2025, title={Toward Training Superintelligent Software Agents through Self-Play SWE-RL}, journal={arXiv preprint arXiv:2512.18552}, year={2025}}
@article{xreposkill2026, title={XRepoSkill: Learning Transferable Skills for Software Engineering Agents}, journal={arXiv preprint arXiv:2609.36807}, year={2026}}
@article{xbtransfer2026, title={Cross-Benchmark Transfer from RL on Agentic Coding Tasks}, journal={arXiv preprint arXiv:2610.00890}, year={2026}}
@article{ding2026swereplay, title={SWE-Replay: Efficient Test-Time Scaling for Software Engineering Agents}, author={Ding, Yifeng and Zhang, Lingming}, journal={arXiv preprint arXiv:2601.22129}, year={2026}}
@article{antoniades2024swesearch, title={SWE-Search: Enhancing Software Agents with Monte Carlo Tree Search and Iterative Refinement}, author={Antoniades, Antonis and {\"O}rwall, Albert and Zhang, Kexun and Xie, Yuxi and others}, journal={arXiv preprint arXiv:2410.20285}, year={2024}}
@article{robeyns2025selfimproving, title={A Self-Improving Coding Agent}, author={Robeyns, Maxime and Szummer, Martin and Aitchison, Laurence}, journal={arXiv preprint arXiv:2504.15228}, year={2025}}
@article{snell2024scaling, title={Scaling LLM Test-Time Compute Optimally can be More Effective than Scaling Model Parameters}, author={Snell, Charlie and Lee, Jaehoon and Xu, Kelvin and Kumar, Aviral}, journal={arXiv preprint arXiv:2408.03314}, year={2024}}
@article{latentsift2026, title={LatentSift: Policy-State Filtering for Token-Efficient Verification of Software Engineering Agents}, author={Han, Yuning and others}, journal={arXiv preprint arXiv:2609.36371}, year={2026}}
@article{ayyad2026subset, title={Trajectory-Aware Benchmark Subset Selection for Cost-Efficient Software Engineering Agent Regression Testing}, author={Ayyad, Mahmoud and Wang, Zehao and Shin, Jiho and Zou, Ying and Adams, Bram}, journal={arXiv preprint arXiv:2609.24928}, year={2026}}
@article{zheng2026proverified, title={SWE-Bench Pro Verified: A Reliable Benchmark for Software Engineering Agents}, author={Zheng, Pujun and others}, journal={arXiv preprint arXiv:2609.08149}, year={2026}}
@article{he2026swegate, title={SWE-Gate: Passing Functional Tests Is Not Enough for Software Engineering Agents}, author={He, Xin and others}, journal={arXiv preprint arXiv:2609.04167}, year={2026}}
@article{duan2026ptairt, title={Efficient SWE Agent Benchmarking via Trajectory-Aware Evaluation}, author={Duan, Kefeng and others}, journal={arXiv preprint arXiv:2609.01603}, year={2026}}
@article{guo2026swedoctor, title={SWE-Doctor: Guiding Software Engineering Agents with Runtime Diagnosis from Multi-Faceted Bug Reproduction Tests}, author={Guo, Yaoqi and others}, journal={arXiv preprint arXiv:2607.00990}, year={2026}}
@article{xie2026ponyeval, title={PonyEval: Evaluating LLM-Based Program Repair for Capability-Safe and Actor-Oriented Pony Software}, author={Xie, Bang and others}, journal={arXiv preprint arXiv:2609.27832}, year={2026}}
@article{shumailov2024curse, title={The Curse of Recursion: Training on Generated Data Makes Models Forget}, author={Shumailov, Ilia and others}, journal={arXiv preprint arXiv:2305.17493}, year={2023}}
@article{yuan2024selfrewarding, title={Self-Rewarding Language Models}, author={Yuan, Weizhe and Pang, Richard Yuanzhe and Cho, Kyunghyun and Li, Xian and others}, journal={arXiv preprint arXiv:2401.10020}, year={2024}}
@article{davinci2026, title={daVinci-Dev: Agent-native Mid-training for Software Engineering}, journal={arXiv preprint arXiv:2601.18418}, year={2026}}
@article{disagree2026, title={Disagree to Explore, Agree to Commit: Routing-Guided Test-Time Scaling for Software Agents}, journal={arXiv preprint arXiv:2608.22191}, year={2026}}
@article{gemma4tr2026, title={Gemma 4 Technical Report}, journal={arXiv preprint arXiv:2607.02770}, year={2026}}
```

*Note: entries marked with title-only authorship had author lists not captured in this session's API extracts; IDs are verified. SPICE's title as listed is schematic — check the arXiv abstract page before citing the exact subtitle.*

### Appendix C — Competition fact sheet (full, with verification dates)

The one-page version is §0.2. Additions here: per-field access dates and thread anchors.

| Field | Value | Verified | Anchor |
|---|---|---|---|
| Timeline | Start 2026-09-23; paper 11-12; entry+merger 11-25; final 12-02 23:59 UTC | 2026-09-29 snapshot; re-verified live 2026-10-02 06:20Z | Overview |
| Participation | 2026-09-29: 5,800/864/829/2,004 → 2026-10-02: 7,287/1,340/1,257/4,024 (entrants/participants/teams/submissions) | Both dates | Overview counters |
| Paper track | 2,523 entrants / 84 participants / 86 submissions (9/30); $15k/$10k/$10k; 3,000-word cap; 5 subs/day; 2 judged; non-archival; earliest-entry tiebreak; writeup-save 404 bug open (9/30) | 2026-09-30 | S49 |
| Hidden set | ~120 tasks evenly split; private repositories; validates 100% with gold | 2026-10-02 | Data page + thread 744370, 744951 |
| Metric mechanics | Two-container; reset; 4-pass apply; JUnit XML parse; skip rule | 2026-09-29 | S5 §8 |
| Budgets | timeout 300 s; 100 tool calls; 60 min/task; 500 turns (defaults, overridable) | 2026-09-29 | S5 §7 |
| Serving | TP=4; util 0.80/0.90; 32,768; max_loras 8; rank 128; parsers gemma4 | 2026-09-29 | S5 §3.1 |
| Host-fix board | See §14.1 (dated); NEW this session: GPU outage resolved, rerun policy open; LoRA sizing shipped v25 per participant (744861) | 2026-10-02 | S47 |
| Baselines | romanrozen 0.12 best public; forks 0.05–0.08 (±0.04); sample-with-adapters FAILED 9/25; no adapter scored through 2026-10-02 | 2026-09-30 + 2026-10-02 | S48, S47 |
| Unknowns | U1 compaction threshold; U2 adapter scoring; U3 board top (login-gated, re-confirmed 06:20Z); U4 hidden language breadth; U5 task order; U6 thinking-token accounting | 2026-10-02 | threads 744692, 743063 |

### Appendix D — Verbatim rule and constraint extracts

- "Agent configuration only — no Python entrypoints." (submission format, S5 §2)
- "The following model names are allowed: gemma-4-31b-it-qat-w4a16-ct." (S5 §3.2)
- Verification: "exit code 0 AND at least one passed AND zero failures/errors AND no required test skipped." (S5 §8)
- Test files "are reset before verification." (anti-tamper, S5 §8)
- Network: "network_mode: none." (S5 §5)
- "Your agent has a limit of 12 hours to submit patches for all tasks, inclusive of sandbox setup time, but excluding time for patch validation." (Overview, live 2026-10-02)
- Host (thread 744951): hidden tasks curated "from a set of private repositories."
- Host (thread 742807): external-LLM distillation allowed subject to teacher-license compliance.
- Host (thread 744370): "I can confirm that the hidden tasks validate at 100% with a 'gold patch' submission."
- Host (thread 744807, pinned, ~2026-10-02): "We had a GPU outage overnight. Resolved now, and submissions should be working again."
- Participant (thread 744861, describing 9/30 scorer changes): "wheelhouse v25, LoRA parameters sized per submission, the reasoning_content fix."
- Host (thread 743063): scorer reads exactly four eval_config.yaml fields: timeout_seconds, max_tool_calls, max_time_minutes, max_turns; defaults = no limit; "You may want to set max_time_minutes to something moderate as a failsafe."

### Appendix E — Comparison tables, permission map, and failure taxonomy

**E.1 Gemma 4 family (agentic-relevant columns) [S14]**

| Benchmark | 31B | 26B-A4B | 12B | Mode |
|---|---|---|---|---|
| LiveCodeBench v6 | 80.0 | 77.1 | 72.0 | non-thinking |
| Terminal-Bench Hard | 36.0 | 14.0 | 18.0 | non-thinking |
| Codeforces Elo | 2150 | 1718 | 1659 | non-thinking |
| MRCR v2 8-needle @128k | 66.4 | 44.1 | 43.4 | thinking |
| GPQA Diamond | 84.3 | 82.3 | 78.8 | non-thinking |

**E.2 Standardized leaderboard extract (top open + protocol-contrast rows) [S18, fetched 2026-10-02]**

| Entry | % | $/traj | Date | mini-SWE-agent |
|---|---|---|---|---|
| Claude 4.5 Opus high | 76.80 | 0.75 | 2026-02-17 | 2.0.0 |
| Gemini 3 Flash high | 75.80 | 0.36 | 2026-02-17 | 2.0.0 |
| MiniMax M2.5 high | 75.80 | 0.07 | 2026-02-17 | 2.0.0 |
| Kimi K2.5 high | 70.80 | 0.15 | 2026-02-17 | 2.0.0 |
| DeepSeek V3.2 high | 70.00 | 0.45 | 2026-02-17 | 2.0.0 |
| DeepSeek V3.2 Reasoner | 60.00 | 0.03 | 2025-12-01 | 1.17.1 |
| Claude 4 Opus | 67.60 | 1.13 | 2025-08-02 | 1.0.0 |

**E.3 Permission map (verified 2026-10-02)** — LoRA/PEFT ✅; license-compliant distillation ✅; custom prompts/skills/sub-agents/sampling/thinking ✅; test-file edits ❌ (resets); sandbox network ❌; non-Gemma-4 or multi-base ❌; Python entrypoints ❌; label mining/evaluator tampering ❌; task-order gaming ⚠️ ambiguous (declined).

**E.4 Failure taxonomy v1**

| Code | Meaning | First-line fix |
|---|---|---|
| T-01 | no_patch_submitted | Early submit; governor |
| T-02 | context_overflow | < 14k tokens; phase caps |
| T-03 | edit_mismatch | Raw-text anchors; re-read; smaller hunks |
| T-04 | tests_fail_real | Better localization; reproduce-first |
| T-05 | tests_fail_env | Pin wheels; report to host |
| T-06 | timeout | Failsafes; T-minus-10 |
| T-07 | tool_budget | Batch reads; graph-first |
| T-08 | test_tamper_reject | Prompt prohibition |
| T-09 | exploit_shaped | Anti-exploit prompt; air-gap is total |
| T-10 | crash | Log + quarantine |

**E.5 Budget allocation table** — as §14.10 (setup 10 / reproduce 15 / localize 25 / repair+verify 35 / select+submit 15).

### Appendix F — Contradiction ledger (full)

C-1 through C-11 as detailed in §7.8, each with: claim, counterevidence, sources, dates, severity
(all material; C-1/C-8 rejection-grade), and treatment. This appendix incorporates the ledger by
reference and adds severity/date columns: C-2/C-6 field-level (2026-02→10 evidence); C-5 competition-
level (through 2026-10-02); C-10/C-11 method-level (Jul–Sep 2026); C-3/C-4 scaffold-level (2024–2026);
C-7 design-level (host statements 2026-10-02); C-9 exploit-level [S10].

### Appendix G — Ablation worksheet

| Ablation | Variant A | Variant B | Tasks | Metric | Decision rule | Result (fill) |
|---|---|---|---|---|---|---|
| Governor | off | on | 80 paired | resolved; T-01/T-02/T-06 counts | McNemar p<0.05 ∧ worst-of-3 no regress | |
| Localization | issue-only | reproduce+graph-first | 80 | resolved; localize time | same | |
| Edits | default render | raw-text conventions | 80 | T-03 rate; resolved | same | |
| Thinking | never | planner-only | 80 | resolved; overflow rate | same | |
| Candidates | k=1 | k=3 rerank | 80 | resolved; wall time | same + time budget respected | |
| Search order | embedding-first | graph-first | 80 | resolved; tokens | same | |
| Skills | generic | per-repo | 80 | resolved; holdout transfer | same + OOD canary no regress | |
| Adapter (gated) | none | LoRA | 80 | resolved | same + U2 GO precondition | |

### Appendix H — Eval-suite specification

```yaml
suite: dev-split-v1
replica: {wheelhouse: v25, containers: A/B, network: none, offline_wheels: 124}
splits:
  dev: {n: 80, stratify: [repo, patch_size_band, f2p_count]}
  holdout: {n: 49, untouched_until: finals_selection}
  canaries: {dead_tasks: 12, gold_control: all_129}
runner:
  pairing: identical task lists + seeds; budget-matched
  repeats: 3 for finalists
  stats: {test: mcnemar, thresholds: {discordant_min: 10, minority_min: 2}}
  selection: lower_confidence_bound
logging:
  per_task: [termination_cause, tokens_in, tokens_out, tool_calls, wall_time,
             overflow_events, edit_failures, patch_bytes]
  extra: {pass_at_k: {k: [1,3]}, selected_score, cost_per_task}
accelerator:
  subset: {method: trajectory_aware, size: 10pct, use_for: iteration_only}
```

Protocol: gold-control must equal 100% before any run counts; dead-task canaries must keep failing
(replica-drift detector); decisions from full-split paired runs only.

### Appendix I — Re-verification checklist (run before every submission)

1. Host-fix board: any wheelhouse bump since last send? Any pinned staff notes (outage/rerun) today?
2. Sample: does the official sample still compile+run in your replica at the current wheelhouse?
3. Gold control still 100%; dead-task canaries still failing.
4. agent.yaml validates; declared model string exact; extensions whitelisted; < 3 GiB unpacked.
5. eval_config.yaml: max_time_minutes set; budgets per §14.10.
6. Dev-split lower bound ≥ current best; termination-cause profile no new dominant code.
7. If adapters included: loud-adapter output-diff verified in replica; U2 status re-checked.
8. Submission slot timing: not immediately after a platform incident; spare-day buffer near deadlines.
9. Log the submission id + config hash in the experiment ledger (Appendix H schema).
10. Post-send: record score, drift vs dev-split prediction, and any host notes within 24 h.

---

## 23. Research log

**Session timeline (2026-10-02, UTC):**

| Time (approx.) | Phase | Actions |
|---|---|---|
| ~05:30–06:00 | Setup | Folder created; driver copied; browser pre-warmed (port 29501); Tavily meters synced (1362/1500 free) |
| ~06:00 | Scope | `scratch/notes/00-scope.md` written before searching (falsifiable predictions recorded) |
| ~06:05 | Local ingestion | Discussion intel (22 threads) + paper-track intel read; backbone [consol] report + ws00 fact sheet reused (same-day access dates) |
| ~06:20 | WS-00 live re-verify | Overview, discussion listing, 9 new threads, LB gate test (login-gated confirmed); outage wave + v25 LoRA-sizing intel captured (`ws00-delta.md`) |
| ~06:22 | WS-03 | swebench.com fetched (rows 1–26 with dates/versions/costs) |
| ~06:25 | Bibliographic | arXiv API batch-1: 13/14 IDs verified; mini-SWE-agent confirmed paper-less; batch-2 abstracts (7 new 2026 papers); Illusion ID resolved (2506.12286); pass@k estimator verified in ar5iv HTML |
| ~06:30 | WS-13 sweep | cs.SE submitted-date sweep (40 results) → 2026-05→09 cluster identified; Disagree-to-Explore ID captured |
| ~06:35–07:30 | Assembly | 15 report parts written; concatenated; table QC; gates audit |

**Tooling and spend:** research-toolkit CDP browser (port 29501, per-folder persistent profile); engines
used: DDG (keyless) ×3, direct fetches ×15 (Kaggle ×12, swebench.com ×1, mini-swe-agent.com ×1, ar5iv ×1),
arXiv API ×6, curl ×4. **MCP quota: 0 calls. PAYG spend: $0.00. Tavily free credits consumed: 0**
(searches answered by DDG rung; meter read 1362/1500 at kickoff and after).

**G1–G15 completion-gate self-audit:**

| Gate | Status | Note |
|---|---|---|
| G1 objective preserved | ✅ | Competition tailoring throughout; not a generic survey |
| G2 no premature stopping | ✅ | Gap searches executed for all thin areas; remaining unknowns are platform-state (U1–U6), not literature |
| G3 RQ coverage | ✅ | §19 matrix; all RQ/VQ/SQ answered or explicitly unresolved with reason |
| G4 workstream completion | ✅ | WS-00…WS-17 mapped to sections; gaps documented (U1–U6) |
| G5 citation integrity | ✅ | All material claims carry [S#]; each supports its adjacent claim; stray-source fixes applied at assembly |
| G6 numerical integrity | ✅ | Every number normalized (variant/scaffold/budget/date) or labeled non-comparable |
| G7 contradiction fairness | ✅ | Ledger C-1…C-11, both sides + treatment |
| G8 uncertainty calibration | ✅ | [A]/[B]/[C]/[GAP] tiers respected; Tier B never presented as A |
| G9 constraint compliance | ✅ | No recommendation violates a WS-00 constraint (permission map checked) |
| G10 cutoff compliance | ✅ | Nothing post-2026-10-02 used as evidence |
| G11 recency | ✅ | 90-day sweep executed (cs.SE listing) and reported (§13.1–13.2); competition pages re-verified at end (06:20Z fetches, post-dated the morning backbone) |
| G12 traceability | ✅ | §19/§20 matrices complete |
| G13 beginner readiness | ✅ | Glossary 156 terms ≥ 100; three reading paths (§0.3); misconceptions per part |
| G14 playbook actionability | ✅ | §14 self-contained (quick-start, five things, falsifiers) |
| G15 file written | ✅ | This file at the required filename; valid Markdown; all §13 sections present |

**Stopping conditions check:** no high-severity unresolved contradiction remains (all ledgered with
treatments); no G-item fails; 90-day sweep reported. Session closed at assembly.

---

*Reproducibility footer — Research executed 2026-10-02 under the v4 browser-research protocol and the
[m31f] handoff: research-toolkit CDP browser (session-owned, port 29501; profile retained), keyless/free
engines only, zero MCP-quota calls, zero billable spend. Scratch: `scratch/` (notes: scope, ws00-delta,
session-evidence-delta; pages: 15 timestamped dumps incl. Kaggle threads t-743531…t-744965, swebench-lb,
arxiv batches, codex verification; report-parts/). Local sources: `input/kagglecomp/` (2026-09-29/30
snapshots) + same-day [consol] backbone folder. All arXiv IDs verified against the arXiv API on
2026-10-02; all competition facts re-verified live on 2026-10-02; untrusted-content discipline applied to
every fetched page (injection attempts: none observed).*
