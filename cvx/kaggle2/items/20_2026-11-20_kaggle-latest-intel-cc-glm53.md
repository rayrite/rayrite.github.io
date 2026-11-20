# COMBINED MARKDOWN - combine

_Generated 2026-11-20 04:06:23 | 3 files | folder: D:\stuff\docs\taylor_fv\github\rayrite.github.io\cvx\kaggle2\items\combine_

## Contents

1. 00-intel-brief-2026-11-11.md
2. 01-thread-manifest-2026-11-11.md
3. 02-raw-forum-digest-2026-11-05-to-2026-11-11.md

---

<!-- ====================================================================== -->
<!-- FILE: 00-intel-brief-2026-11-11.md -->
<!-- ====================================================================== -->

# BCF Intel Brief — 2026-11-11

Competition: Gemma 4 Developer Agent (Kaggle). Prepared by the BCF intel briefer from four analyst clusters (rules-bonus-staff, harness-fixes, solvability-data, small-model-ops).

## Capture window, census, method

- **Capture window:** content posted after **2026-11-05T18:13:00Z** (previous sweep: intel_20261105), captured **2026-11-11**.
- **Census:** **327 topics** on the board; **38 threads captured**; **34 with new content** (24 new threads + 10 updated threads); 4 pinned-only threads unchanged (742815, 743007, 745998, 748287). Leaderboard captured (5,439 teams).
- **Method:** local-only, no web research. Sources: full thread dumps (`scratch/bcf-2026-11-11/intel_texts/topic_<id>.md`), new-content digest (`02-raw-forum-digest-2026-11-05-to-2026-11-11.md`), capture manifest (`raw-capture-log.md`, `capture-manifest.json`), leaderboard CSV (`leaderboard-public-2026-11-11.csv`), and the reconstructed 129-task dataset (`scratch/bcf-2026-11-11/tasks/*.json`). Analyst notes: `scratch/bcf-2026-11-11/intel/live-*.md`. Key quotes in this brief were spot-checked verbatim against the full dumps; leaderboard statistics were re-verified from the CSV by the briefer.
- **Tier convention:** STAFF = organizer-verified. Elan Markowitz carries tier CONTRIBUTOR in the capture but is the competition **host** ([HOST]); his announcement posts are treated as organizer statements, noted as such. All other tiers (CONTRIBUTOR / EXPERT / MASTER / GRANDMASTER) = competitor-reported, unverified unless corroborated.
- **Capture caveats:** (1) digest counts include empty "? (?)" comments absent from full dumps (747519: 4; 743683: 1; 751104 older: 1) — deleted/placeholder, no recoverable content; (2) the 747519 full dump appears partial for very old comments (48 posts vs "101 older omitted"); all post-cutoff posts are present and cross-checked; (3) captures carry no edit timestamps — "unchanged" verdicts rely on last-comment times plus absence of new posts/edit markers.

**Headline:** ZERO staff posts anywhere in the 38-thread capture since the cutoff. Every November question (bonus deadline, external compute, LLM annotation, hand-built LoRA, merger score carry, timeout semantics, offline issue links, scorer fixes, reasoning-fix parity, sandbox testing, runtime metadata) is unanswered. The queue has visibly regressed (36–52h stuck submissions) with no staff acknowledgment. Plan final submissions for the environment **as-is**.

---

## 1. TOP NEW FACTS since Nov 5

Staff/host items first. Confidence: high / medium / low per analyst assessment; "as-reported" = faithful extraction of a competitor claim, not organizer verification.

### 1a. Staff and host items

| # | Fact | Thread | Author (tier) | Quote (verbatim) | Confidence |
|---|---|---|---|---|---|
| S1 | No STAFF-tier post in any captured thread since the cutoff; every November question is open. Last official harness words: Oct 1 (fixes "in the wheelhouse") and Oct 11 (no ADK v2). | all 38 (digest metadata) | capture staff counts | "new comments 3 (staff 0)" (757993 digest header; staff 0 pattern repeats in every thread) | high (bounded by capture time) |
| S2 | Queue regressed from the Oct 13 staff baseline (~14h) to 36–52h+ stalls; the one-pending-submission gate blocks ALL further submissions, burning daily slots. | 747519 (+757993, 743683) | Dustin (STAFF, baseline Oct 13); FakeEyes2W (CONTRIBUTOR LB 5234, Nov 11) | Staff: "Queue delay has fallen to around ~14h ... most runs should finish within ~24hish of submit now." New: "400 FAILED_PRECONDITION: Your team already has 1 pending submissions; please wait for one to finish scoring." | high (4+ independent submission IDs: 58167555, 58168732, 58169454, 58168380) |
| S3 | No new rerun policy: rescore remains paused per the Sep 28 staff post; new posts are competitor requests to clear stuck states and restore lost slots. Do not budget on automatic reruns. | 743683 | Ryan Holbrook (STAFF, last word 2026-09-28); Tong_Shan (CONTRIBUTOR, Nov 11) | "I'm going to pause the rescore until we can resolve the queueing for the L4x4 machines. I will get it going as soon as I can." | high |
| S4 | Reasoning-drop fix parity broken: staff said Oct 1 the fix was in the wheelhouse, but a Nov 11 repro shows public wheelhouse v31 still drops `reasoning_content` between tool calls. Whether the managed scorer is patched is unknown. | 744354 | Ryan Holbrook (STAFF, Oct 1); Lazaros Avramidis (CONTRIBUTOR LB 438, Nov 11) | Staff: "Yes, this is unambiguously a bug. The fix should be in the current wheelhouse." New: "we reproduced the issue on November 11 using the latest officially available Gemma 4 Developer Agent wheelhouse (v31, last updated October 12)." | high for public wheel (exact code line + public repro notebook); scorer state unknown |
| S5 | Compaction behavior is fixed through the finals: staff ruled out ADK v2 (Oct 11); re-cited Nov 7. Summarizer reads only text parts — tool calls/results are dropped. | 754783 (+748287) | Ryan Holbrook (STAFF, Oct 11); Jack Yu (CONTRIBUTOR LB 3215, Nov 7) | Staff: "I think it's too risky to attempt a migration to ADK v2 at this point, but good to know." New: "So expect the same compaction behavior as is." | high (staff basis); reasoning-survives nuance medium (code-read) |
| S6 | Bonus prize terms unchanged since Oct 20 (host OP, pinned, verbatim below). New: a competitor nudge to honor the promised daily small-model leaderboard — soft signal the notebook may be stale; no staff reply. | 751104 | Elan Markowitz (CONTRIBUTOR [HOST]); amunozo (CONTRIBUTOR LB 228, Nov 6) | Host: "Same submission deadlines apply as the main track prizes." New: "Thanks! Could you update the leaderboard's notebook daily?" | high (terms); medium (staleness signal; notebook not checkable locally) |
| S7 | Bonus deadline contradiction is real and unresolved: Prizes page says Nov 12 23:59 UTC; bonus announcement says main-track deadlines (Dec 2). Only substantive answer is a competitor EXPERT: Dec 2 (Nov 12 line is misplaced Paper-Track text). No staff confirmation. | 757244 | Gagan Deep (CONTRIBUTOR LB 4558, OP); Smart Manoj (EXPERT LB 801); Altcont Altul (CONTRIBUTOR) | Page (quoted): "Submissions must be made by November 12, 2026 at 11:59PM UTC." Answer: "December 2. That section should be inserted above the Paper section." | high (ambiguity exists, 0 staff comments); medium (Dec 2 resolution) |
| S8 | Five rules/semantics questions unanswered: §4.b external compute (DeepInfra/RunPod); Rule 2.4.b third-party LLM annotation + paper-track derived data; hand-constructed LoRA legality; team-merger score carry (irreversible, before Nov 25); timeout semantics (cut vs score-0). | 757783, 757223, 756792, 756693, 756963 | all CONTRIBUTOR OPs (Alvaro Camacho De Pass; Brejesh Balakrishnan; Refresh2k; tianchan11; Heisenberg) | 756693: "I'm a solo participant and would like to know this before making an irreversible merge." | high (unanswered status); underlying legality open |
| S9 | Pinned staff/host threads unchanged (742815, 743007, 745998, 748287). Standing small-model rules remain load-bearing: four sanctioned QAT aliases; NO mixing variants within a submission; small models scored under identical conditions (4xL4, 12h, same budgets). | 748287 (and 742815/743007/745998) | Ryan Holbrook (STAFF); Ashley Oldacre (STAFF); Elan Markowitz [HOST] | "Every agent and subagent in your submission must use the same variant (though they can attach different LoRA adapters.)" Also: "1. Yes, everything is the same." (Oct 11, identical scoring conditions) | high |
| S10 | Offline issue-link/screenshot availability still has NO organizer answer (asked Nov 9, re-pinged @ryanholbrook; predecessors 744370/746944 also unanswered). The Sep 29 staff anchor "hidden tasks validate at 100% with gold" has not been re-confirmed; scoring-container dependency questions re-asked Nov 10 remain open. | 757149 (+744370 anchor, 757661) | song tao shi (CONTRIBUTOR); Ryan Holbrook (STAFF, Sep 29 anchor); larry54321zhao (EXPERT, Nov 10) | Anchor: "I can confirm that the hidden tasks validate at 100% with a 'gold patch' submission." | high (absence of answer; anchor quote); anchor is 6 weeks old |

### 1b. Competitor-reported new facts

| # | Fact | Thread | Author (tier) | Quote (verbatim) | Confidence |
|---|---|---|---|---|---|
| C1 | E2B bottleneck is editing, not localization: ~75% of failed `edit_file` calls verbatim-repeat an earlier failed call; most distinct failures put intended/absent code into `old_string`. None of 11 ADK config interventions (A–K) resolved a task. Public Apache-2.0 artifacts (configs, trajectories, funnel scripts, CPU-cheap edit replay). | 756433 | kamenriderFAKCHION (CONTRIBUTOR LB 5118) | "about three quarters of failed `edit_file` calls repeat an earlier failed call verbatim" / "None of the harness changes we tried resolved a task." | high as-reported (single team, local harness, E2B only; no numeric scores in post) |
| C2 | Array-argument parser infinite loop (vLLM 0.19.1 gemma4 parser) still UNFIXED and UNANSWERED; fresh victims Nov 8–9. One malformed array argument freezes the inference server for the rest of the run (zeroes every remaining task). Original reporter hit it on E4B. | 753973 | haji bolot (CONTRIBUTOR LB 52, root cause); Mikhil Shetty + shtirmann (CONTRIBUTOR, new) | "any update on this ? this is impacting our work" (Nov 8); "facing same issues" (Nov 9) | high (bug: independent repros + 85/60,000 fuzz hangs + parser SHA); E4B linkage medium |
| C3 | Double-JSON fix confirmed live (swegemma 0.2.11 / adk-submission 0.2.13): tool results now one JSON level; edit_file repairs both strings when old_string needed unescaping. NEW residual bug: exact old_string + escaped new_string writes literal escapes into the file; write_file content gets no repair. | 744272 | Mikhil Shetty (CONTRIBUTOR, Nov 8) | "If old_string matches exactly but new_string is escaped, the escapes are written into the file as typed" | high (function-level repro + real trace rich_3518 on 12B) |
| C4 | LoRA zero-score effectively resolved by community as timeout/budget, not adapter incompatibility: rank-32 LoRA on 31B scored 0.06 (disclosed Nov 10); 0.17 parity at 6-min cap + 2048 thinking. Overhead ~+29% task time / ~+45% tokens per step. Luca's specific 0.00 never explained; NO staff reply ever. No demonstrated LoRA gain. | 755677 | Ankith Savio (CONTRIBUTOR LB 250); Kapil Chopra (CONTRIBUTOR); OP Luca Massaron (GRANDMASTER) | "For the configuration mentioned above it was 0.06" | medium-high (community evidence; timeout vs loading signatures distinct) |
| C5 | Kai claims a single measurable mechanism behind the Paper Track's "~28% old_string loss": affected calls fail 93% vs 11%; a one-line prompt fix cut incidence 4.5%→1.2% and removed 60+ call retry loops. Mechanism and fix text NOT disclosed (private until merge / post-competition); the confounded version (fix + one other line) scored LOWER on public LB. | 756607 | Kai (CONTRIBUTOR LB 865) | "our run with the fix scored lower on the public LB" | medium (specific statistics, logs private); not adoptable as-is |
| C6 | Scorer audit (posted Nov 11): 1,143 real fixes from 36 libraries through swegemma 0.2.11 verification — 277 (24%) fail with their own correct patch due to 5 conventions. Two public tasks (rich_3486, fastapi_14186) pass every test with gold but can NEVER be marked resolved (skipped-sibling matcher bug). Public audit artifacts. | 757893 | Hersh Mittelman (CONTRIBUTOR) | "rich_3486 ... and fastapi_14186 pass every test with their gold patch but can never be marked resolved" | medium-high (concrete method, public artifacts; counts not re-run by us) |
| C7 | 27 public fastapi tasks fail pytest collection regardless of patch (tests import inline_snapshot / dirty_equals, absent from wheelhouse) → local measured ceiling ~79%. Local verification: all 27 ids exist; 17/27 direct imports; 10 via unseen repo files; 4 EXTRA unlisted candidates found (fastapi_14266/14609/15030/15745). | 756587 | Jason Wold (CONTRIBUTOR LB 3692); BCF local verification | "it caps your measured resolve rate at about 79% and adds noise to any A/B comparison that includes them" | high (mechanism, 4-way corroborated); medium (exact id list) |
| C8 | Gold+empty audit: only 68/129 public tasks valid for agent discrimination (gold must pass, empty must fail); 73 gold passes, 5 empty passes; 34 gold failures from missing libs (27 inline_snapshot + 7 dirty_equals), 13 reference-fix failures, 7 timeouts, 2 other. Mutation audit: 24/163 (14.7%) planted broken fixes still marked resolved. Graph tools did not help end-to-end (k0 50% vs k4 47%, McNemar p=0.69). | 756400 | Manohar Papasani (CONTRIBUTOR LB 3104) | "So any resolve rate is an upper bound on truly correct fixes." | high (method, internally consistent, corroborated); medium (single-team numbers) |
| C9 | Public→hidden transfer failure: their 50%-public agent timed out on the hidden set at 15 min/task; with a 5-minute cap and thinking off it scored only 0.05 public. Hidden tasks come from private repos and behave very differently. Thinking-on rerun promised, not posted. | 756400 | Manohar Papasani (CONTRIBUTOR) | "With a 5-minute cap and thinking off, it scored only 0.05 on the public leaderboard." | medium (single data point, strategy-critical) |
| C10 | Reference-patch ceiling audit: running each public task's own reference patch through the organizer's verifier in the reference notebook sandbox yields 74/129 (34 import failures: inline_snapshot/dirty_equals, closure also needs asttokens/executing; +12 psf/requests httpbin-fixture failures). Hidden-container provisioning question unanswered. | 757661 | larry54321zhao (EXPERT LB 2030) | "34 of the 129 published tasks fail with import errors because of them, and a further 12 psf/requests tasks fail on an httpbin fixture." | medium-high (independent audit; 74 vs 73 gold-pass = ±1 across environments) |
| C11 | Score noise measured: an unchanged public 0.24 prompt-only bundle reran at 0.17 (14→10 of 58 tasks, 4-task gap). Run-to-run sd ~1.5–3 tasks; published scores likely best-of-several-tries (untested hypothesis). Independently: a 0.20 bundle reran .18/.17/.17/.17/.13. 58-task public split confirmed: every captured LB score equals floor(k/58). | 757588 (+756438) | Harshit Kumar (EXPERT LB 2045); Adam Johnson (CONTRIBUTOR LB ~330) | "One run is not a verdict." / ".20 also scored .18 .17 .17 .17 .13" | high (rerun measurements, n=1 per bundle; LB quantization verified locally); medium (sd/best-of-N model) |
| C12 | Compaction parameters: triggers mid-task at 14,336 tokens, keeps only the last 5 events, replaces the rest with a generic summary; caused every context reset in the team's logs. Not overridable from a submission (no code hooks); a text reply terminates the session. | 756336 | murece rickman (CONTRIBUTOR LB 2452) | "It kicks in at 14,336 tokens, keeps only the last 5 events, and replaces the rest with its own generic summary." | medium-high (trigger corroborated by 754783 + xz in 757626; last-5 retention single-source) |
| C13 | Operational working assumptions: submission must solve ALL ~120 tasks within 12 hours or score zero; ~6 min/task average, significant tasks need >8 min; prompt-only system.md currently holds top public scores; sequential/multi-agent designs and task-skipping infeasible in practice. | 756622 (+756438, 756963) | Murugesan Narayanaswamy (EXPERT LB 691) | "The submission notebook MUST solve ALL of the around 120 tasks in 12 hours. If it takes more than 12 hours, then you score zero." | medium (12h corroborated by overview cite in 757626; all-or-zero single-source; staff question 756963 unanswered) |
| C14 | Two independent teams measure ~10–13% per-task flip rate on identical-config repeat runs; agreed selection protocol: 2 runs on a fixed 30-task set + 106-task held-out, change counts only if it wins on both. Merge arithmetic: team limit 5, combined cumulative cap = 1/day since Sep 23 (17+3=20 fits). 30-task subset (IDs + checksums) promised ~Nov 11. | 750907 | Mehmood Zafar (CONTRIBUTOR LB 1497) + YosQuant (CONTRIBUTOR LB 815) | "A change only counts if it wins on both." | high as-reported (two-team replication); merge math medium (competitor rule-reading) |
| C15 | Split-probing exploit PROPOSED (not demonstrated): modulate behavior per task, watch public-score deltas to identify private tasks, then empty-patch the public half (~12 min/private task). LB rank 1 rebuttal: variance forces 2–3 subs/task → 240+ submissions vs 70 cap — infeasible single-account; multi-account ban risk. No staff ruling. | 757626 | xz (MASTER LB 3019); Yurnero (GRANDMASTER, LB rank 1) | "It's impossible to do with a single account" / "shakeup in that competition will be huge" | high (proposal + rebuttal as stated); do NOT adopt |
| C16 | URL-only/screenshot task inputs locally verified: rich_3064 statement is 76 chars ("fix for markdown table" + issue link; reproducer only in linked issue); rich_3296 embeds Before/After screenshots as image URLs; hints_text empty. Local harness delivers URLs as plain text, no images. Scored-env behavior unconfirmed. | 757149 | song tao shi (CONTRIBUTOR); inputs verified by BCF against tasks/*.json | rich_3064 problem_statement: "fix for markdown table" + link to Rich issue #3053 (76 chars total) | high (input facts, exact strings match); unknown (scored env) |
| C17 | Community resource: pytest-verified context-selection harness (identical character budgets; graph-guided AST, lexical "embedding" retrieval, hybrid, oracle, floors) + gemma4-locbench-v1 probe set scoring ANY context selector without a GPU; exact McNemar + Wilson 95% CIs. Posted Nov 5 23:34Z (after cutoff). | 756315 | Kris_shah123 (CONTRIBUTOR) | "the same semantics as the sandbox's search_similar_code lexical fallback" (author: "embedding retrieval" is bag-of-terms, not true embeddings) | high (as-claimed, self-consistent); not fetched/run locally |
| C18 | Stuck-submission wave as of Nov 11: three users report "Notebook Running"/PENDING for 40–52 hours (kush1235 ~2 days, Qiyu_Ma >40h, FakeEyes2W 52h) — far beyond the 12h eval budget; queue wait and/or hung runs. No staff reply. | 757993 | kush1235, Muhmad KwaZulu gorilla, Qiyu_Ma, FakeEyes2W (all CONTRIBUTOR) | "same. My submission has been running for 52 hrs" | high as-reported (corroborated by submission IDs in 747519/743683) |

Also noted (low confidence): a Nov 7 comment in the bonus thread 751104 (Mikhail, CONTRIBUTOR LB 2168) is an off-topic/misposted promotional AST-research reply (44.6% token reduction / 47.2 µs AST gate / 30.6% traceback saving; repo msingatullin/gemma-4-developer-agent). Probable spam/mispost — contains no rules content; techniques cheap to test but numbers unverified; do not cite as bonus-track evidence.

---

## 2. BONUS TRACK — Small Model Development ($10,000)

### 2a. Exact terms (thread 751104, host OP Elan Markowitz [HOST], 2026-10-20, pinned, unchanged; verbatim)

- **Award:** "$10,000 to the highest-ranking submission utilizing **Gemma E2B** or **Gemma E4B**. Final scores are based on the private test set performance. Same submission rules and tie-breaking apply."
- **Eligibility:** "Submissions must explicitly use either Gemma E2B or Gemma E4B as the base model. For a submission to be eligible it must be one of the team's two selected final submissions. LoRA fine-tuning is allowed just as done for the main track."
- **Daily leaderboard:** "A separate Kaggle notebook will be released and updated daily to display public standings for eligible small model entries." (ryanholbrook notebook; freshness questioned Nov 6 by amunozo, no staff reply.)
- **Cross-track:** "Submissions eligible for the Small Model Prize remain fully eligible for general leaderboard awards and the Paper Track."
- **Deadline:** "Same submission deadlines apply as the main track prizes."

Eligible quantized aliases (748287 staff OP): `gemma-4-e4b-it-qat-w4a16-ct`, `gemma-4-e2b-it-qat-w4a16-ct`. Standing constraints (748287, STAFF, pre-cutoff, unchanged): every agent and subagent must use the SAME variant (per-agent LoRA adapters allowed); small models scored under identical conditions as 31B ("1. Yes, everything is the same." — same 4xL4, 12h total, same per-task budgets); LoRA base weights = unquantized variants on the Gemma 4 transformers page; no ADK v2 migration.

**Slot math:** a bonus-eligible run consumes one of the two final-selection slots, but stays eligible for main prizes and Paper Track — a strong small-model run can double-count. Winner is decided on the PRIVATE set with main-track tie-breaks: optimize private-set robustness, not public LB.

### 2b. Deadline news (thread 757244, NEW Nov 9; staff 0)

- The Prizes page says: "Submissions must be made by November 12, 2026 at 11:59PM UTC." The bonus section says main-track deadlines apply (Dec 2). The contradiction is real and unresolved.
- Only substantive answer: Smart Manoj (EXPERT, LB 801): "December 2. That section should be inserted above the Paper section." — i.e., the Nov 12 sentence is a misplaced Paper-Track line. Altcont Altul asked organizers to confirm Nov 12 = Paper Track only, Dec 2 = final scored deadline incl. Small Model Prize. No staff reply.
- **Working assumption: Dec 2 for E2B/E4B bonus submissions** (host OP + EXPERT consensus + Timeline marks Nov 12 as optional paper deadline). **Safe internal deadline: Nov 12** until staff confirms. The Paper Track deadline (Nov 12) is separate and imminent — tomorrow.

### 2c. E2B/E4B evidence

- **E2B (756433, the ONLY empirical small-model study in the capture):** localization is not the bottleneck — E2B usually reads the right file; ~75% of failed `edit_file` calls are verbatim retries of an earlier failed call; most distinct failures put intended or absent code into `old_string` (wrong mental model of file state, not miscopying). 11 config interventions (recovery instructions, distilled rich-review rules, tool removal, reasoning/temperature changes, editor sub-agent) resolved no task. Public Apache-2.0 repo (sigongjoa/gemma4-e2b-edit-failure): configs A–K, trajectories/patches/logs (problem statements removed), funnel scripts, CPU-cheap edit-call replay on snapshots — directly reusable to measure E4B rates. No numeric scores in the post (writeup not captured locally).
- **E4B: NO empirical trajectory/score evidence exists anywhere in the 38-thread capture.** E4B lessons must be extrapolated from E2B + 12B/31B findings, flagged as such. E2B/E4B appear in only 4 captured threads (756433, 751104, 757244, 748287).
- **E4B-linked hazard (753973):** the gemma4 tool-parser infinite loop on array arguments was first hit by haji bolot "when i started to play with E4B" (Oct 29 cross-post in 748287); still unfixed per Nov 8–9 complaints. Trigger: a bare array element containing `]` without Gemma's `<|"|>` quoting delimiters; the parser never advances, freezing the API server event loop for the rest of the run (SIGTERM ignored; every remaining task scores 0). Submissions cannot patch the harness and no code hooks are allowed — mitigate via tool-schema/prompt design (no array-typed parameters).
- **Edit-reliability context for small models:** the residual escaped-new_string bug (744272, seen on 12B rich_3518) and Kai's undisclosed old_string-loss mechanism (756607) both apply; a post-edit .py parse gate catches the residual case. LoRA on small models inherits the ~+29% time / ~+45% tokens overhead measured on 31B (755677) — budget accordingly.
- **Small-model leaderboard:** the promised daily notebook may be stale (amunozo nudge Nov 6, no staff reply) — track eligible E2B/E4B standings manually for bonus-race decisions.

---

## 3. HARNESS STATUS — bug-fix table (status since Nov 5)

Zero staff replies in the entire harness cluster since the cutoff. Every organizer statement below is pre-cutoff (Sep 29–Oct 11). Plan for the environment AS-IS at Nov 25 / Dec 2.

| Bug | Thread | Status since Nov 5 | Workaround |
|---|---|---|---|
| `reasoning_content` dropped between tool calls (vLLM reads only `reasoning`, chat_utils.py:1512) | 744354 | UNFIXED in public wheelhouse v31 (Nov 11 repro: reasoning=76 tokens vs reasoning_content=61=omitted, identical sequences). Staff claimed fix Oct 1; managed-scorer state UNKNOWN; no staff reply. No rescores promised (Sep 29). | Restate critical state in visible assistant text (works either way); keep a thought-retention-tuned variant; do NOT spend a slot resubmitting an unchanged ZIP until staff confirms a scorer-side change. |
| gemma4 tool-parser infinite loop on array arguments (server freeze, zeroes rest of run) | 753973 | UNFIXED, UNANSWERED; new victims Nov 8–9. Root cause: `_parse_gemma4_array` bare-value branch never advances on `]` inside an element lacking `<\|"\|>` delimiters. Upstream no-progress guard (vllm#41991) exists; no staff commitment to deploy. | Remove array-typed parameters from ALL custom tool/skill schemas before Nov 25; prefer string/scalar args; reproduce locally on the official wheelhouse before any bonus run. Highest-impact single-call failure mode. |
| Double-JSON-encoded tool results | 744272 | FIXED — confirmed live in swegemma 0.2.11 / adk-submission 0.2.13 (one JSON level; edit_file unescapes both strings when old_string needed repair). NEW residual (Nov 8): exact old_string + escaped new_string writes literal escapes verbatim (strategy 'exact'); write_file content gets NO repair. Staff silent on intent. | Match training data to ONE level of JSON escaping; teach old_string unescaping; add a .py syntax/AST gate before submit_patch (real-trace case cost one retry on a 5-min budget). |
| Compaction drops tool calls/results (LlmEventSummarizer reads only part.text) | 754783, 756336 | PERMANENT through finals — staff ruled out ADK v2 (Oct 11, re-cited Nov 7). Trigger 14,336 tokens; last-5-events retention (single-source); generic summary; no submission overrides; text reply ends session. Nuance: tool-call reasoning text usually survives; un-paraphrased tool results are forgotten forever. | Paraphrase every important tool result (paths, test outcomes, plan state) into assistant text before the next action; keep per-task context under the trigger (targeted reads, traceback compression, AST slicing for 600+ line files); single agent + agent_tools; terminate deliberately. |
| LoRA adapters scoring 0.00 | 755677 | Community-resolved as primarily TIMEOUT/budget: adapters DO load and score (0.06 rank-32 at 4-min cap, Nov 10; 0.17 parity at 6-min cap + 2048 thinking). Luca's specific 0.00 (vs 0.18 no-adapter) never definitively explained. NO staff reply ever. No demonstrated LoRA gain. | If used: task cap ~5–6 min, thinking ~2048, verify total <12h at 120 tasks; require a demonstrated local gain. Triage "complete, no score" (timeout) vs 0.00 (loading/packaging: adapters/<name>/ + agent.yaml adapter key, Gemma4ClippableLinear/compressed-tensors PEFT handling). |
| edit_file old_string loss (~28% per Paper Track) | 756607 | Root cause + one-line prompt fix CLAIMED (affected calls fail 93% vs 11%; fix cut incidence 4.5%→1.2%, removed 60+ retry loops) but mechanism/fix text UNDISCLOSED until merge/post-competition; the confounded change LOWERED public LB. Not the same measurement as the known public escaping mechanism (744272). | Not adoptable as-is. Mechanical guards meanwhile (retry dedupe, old_string pre-validation against fresh snapshot). If merging: note 32 paused submissions (mid-October scored = private-LB tie-break value), dead RTX A6000 GPU, partner cap ≤~14 (up to ~25–32 if pausing). |
| Scorer verifier conventions (5 fixes proposed) | 757893 | UNANSWERED (posted Nov 11). 277/1,143 (24%) real fixes blocked: -p no:anyio (79), overwritten pytest.ini (101), non-collectable targets (65), skipped-sibling matcher (24 + rich_3486 + fastapi_14186), 10 MiB JUnit output cap (8). rich_3486 and fastapi_14186 can NEVER be marked resolved. | Exclude both tasks from local A/B denominators; use published FreshSWE-Py validation/scorer_audit.json + public_tasks.jsonl for per-task flags. Author's conditional: if hidden tasks were validated with the same harness, these cases were already excluded. |
| Missing sandbox test deps (inline_snapshot, dirty_equals; httpbin fixture) | 756587, 757661, 756461 | NO fix announced; no staff reply. Staff anchor (744370, Sep 29): hidden tasks validate 100% with gold — not re-confirmed since. Ceilings differ by environment: 52/129 plain notebook, 73–74/129 reference sandbox, ~102/129 with fastapi-only exclusion. | Local-eval exclusions or repair the local sandbox with missing wheels (closure: asttokens, executing); do NOT spend agent budget installing packages via patches (legality asked in 744370, never answered). |
| enable_sandbox_testing during scoring | 757564 | UNANSWERED. Code/README default True (swegemma 0.2.11 applies the test-runner mask only when False); instruction 3 says verify with targeted tests. Scorer-side setting UNKNOWN. | Assume available; keep in-sandbox verification targeted and time-bounded (a few repo test files, never full suites). |
| Queue stalls + one-pending-submission gate | 747519, 743683, 757993 | REGRESSED: Nov 9 submissions stuck 36–52h+ as of Nov 11 vs Oct 13 staff baseline ~14h. "400 FAILED_PRECONDITION" blocks all new submits. No staff acknowledgment since Oct 13; rescore paused since Sep 28. Cause unconfirmed (L4x4 scarcity vs hung jobs). | Submit early in the day; validate ZIPs with the official compiler; keep a minimal fallback bundle; monitor PENDING; escalate same-day with submission IDs in 747519/743683 (staff precedent Oct 8: timeout extension + reprocessing, latency days); budget for lost days, not reruns. |
| Wheelhouse / L4x4 runtime metadata | 757782 | UNANSWERED (0 comments). Starter notebook pins Kaggle dataset-version ID 19987205 of metric/gemma-4-developer-agent-wheelhouse. No official manifest/image digest provided. | Pin local runtime to the corroborated stack: wheelhouse v31 (Oct 12/13 date discrepancy unresolved), vLLM 0.19.1 (parser SHA-256 682b2152b76c031df9c58c3ffbb5b243945be5d8957ebdce00faef1b9de6b889), swegemma 0.2.11, adk-submission 0.2.13, google-adk 1.36.1, Python 3.12.13, 4xL4 TP4 bf16 max_model_len 32768, parser gemma4. Add a reasoning-field-survival check to local validation. |

---

## 4. SOLVABILITY — newly reported task audits

### 4a. Thread 756587 — 27 fastapi tasks can never pass in the sandbox (Jason Wold, CONTRIBUTOR, Nov 6)

Mechanism: tests import `inline_snapshot` or `dirty_equals`, absent from the sandbox wheelhouse → pytest collection fails regardless of patch. Local-eval only ("The host confirmed scoring uses private repos" is a competitor paraphrase; the verifiable staff statement is 744370, Sep 29). Caps measured resolve rate at ~79% ((129−27)/129).

Exact 27 ids as posted: fastapi_11355, fastapi_12942, fastapi_13713, fastapi_13786, fastapi_14099, fastapi_14246, fastapi_14262, fastapi_14297, fastapi_14303, fastapi_14349, fastapi_14356, fastapi_14360, fastapi_14361, fastapi_14371, fastapi_14430, fastapi_14455, fastapi_14459, fastapi_14482, fastapi_14485, fastapi_14512, fastapi_14583, fastapi_14605, fastapi_14791, fastapi_14953, fastapi_14962, fastapi_14964, fastapi_15023.

**BCF local verification** (tasks/*.json, script `scratch/bcf-2026-11-11/_work/verify_solvability_claims.py`): all 27 exist; 17/27 have direct library imports in test_patch; 10/27 have no mention (likely via pre-existing repo test files at collection — snapshots hold only patch-touched files, not verifiable locally). **4 additional candidates NOT in the posted list:** fastapi_14266, fastapi_14609, fastapi_15030, fastapi_15745. Full-dataset scan: inline_snapshot in 18 test_patches, dirty_equals in 5, union 21 (lower bound). Treat the 27-list as reported, not canonical; reconcile by running gold+empty locally before freezing exclusions.

### 4b. Thread 756400 — gold/empty discrimination audit (Manohar Papasani, CONTRIBUTOR, Nov 6; audit data dated Oct 15)

Method: run every public task through the official harness twice — gold patch must PASS, empty patch must FAIL; only tasks satisfying both are valid. Title's "61 can't tell agents apart" = 129 − 68.

| Repo | Tasks | Gold passes | Empty passes | Valid |
|---|---|---|---|---|
| fastapi | 67 | 31 | 2 | 29 |
| rich | 48 | 39 | 0 | 39 |
| requests | 13 | 3 | 3 | 0 |
| httpx | 1 | 0 | 0 | 0 |
| Total | 129 | 73 | 5 | 68 |

- Gold-failure breakdown (56): 34 missing test libs (inline_snapshot 27 / dirty_equals 7 — per-library split single-source), 13 fail even with the reference fix, 7 time out, 2 other. Internally consistent (34+13+7+2=56; 73−5=68).
- 5 tasks pass with an EMPTY patch (2 fastapi + 3 requests) — free local points, A/B noise; check whether they appear in scored splits.
- **Mutation audit:** 163 planted bugs (7 types), hand review removing equivalent mutants → 24/163 (14.7%) broken fixes still marked resolved. Inverted booleans escaped most (53% pre-review), off-by-one next (33%); removed-raise always caught. "Any resolve rate is an upper bound on truly correct fixes."
- **Graph tools:** k0 (workspace tools only) 50% (34/68) vs k4 (+3 graph tools) 47% (32/68), McNemar p=0.69; nudged n4 44% (14/32); graph tool used in <10% of runs unless nudged. No end-to-end benefit; localization-stage benefit untested (testable via 756315 locbench).
- **Transfer failure:** 50%-public agent timed out on hidden at 15 min/task; 5-min cap + thinking off → 0.05 public. Thinking-on rerun promised, not posted.
- Open Apache-2.0 repo (TechNaom/gemma4-agentic-swe): 11 configs (k0–k5, n1–n5), valid_tasks.txt, full audit + planted-bug data, run traces, CPU-only patch re-verification runner (no GPU), exact submitted config. Not fetched (local-only policy).
- Valid ids NOT enumerated in the post (repo experiments/valid_tasks.txt). Hidden environment explicitly unknown: "I don't know whether the hidden environment has the same gaps."

### 4c. Thread 757893 — scorer-convention audit (Hersh Mittelman, CONTRIBUTOR, Nov 11)

1,143 real fixes from 36 Python libraries (FreshSWE-Py, 663 post-release tasks) through swegemma 0.2.11 verification: **277 (24%) fail with their own correct patch** due to 5 conventions:

| # | Convention | Blocked fixes | Fix |
|---|---|---|---|
| 1 | `-p no:anyio` kills anyio fixtures | 79 (54 starlette + 25/43 uvicorn) | Drop the flag (or add only when anyio absent) |
| 2 | Overwritten pytest.ini drops asyncio_mode=auto + plugin registrations | 101 | Keep repo config; pass harness options as `-o` overrides |
| 3 | Every .py in test_patch used as a target (data files/helpers break collection) | 65 | Filter by repo python_files pattern |
| 4 | Skipped sibling matching `{req_base}_` prefix fails a passed required test (`_validate_junit_xml` / `_node_matches_requirement`) | 24 + rich_3486 + fastapi_14186 | Count only failed/errored, or match only parametrized ids `{req_base}[`; drop Linux-skipped required tests at validation |
| 5 | JUnit report read through 10 MiB sandbox output cap arrives truncated | 8 (python-multipart) | Copy the file out or stream it |

**rich_3486 and fastapi_14186 pass every test with their gold patch but can NEVER be marked resolved** (e.g., test_x passes, test_x_windows skipped on Linux → rejected). rich_3486 independently found by Joao Paulo in topic 751707 (not in local capture — secondhand). Public artifacts: validation/scorer_audit.json (1,143 rows), validation/public_tasks.jsonl (outcomes for all 129 public tasks, no task content), validation/scripts/ — dataset moshegolderson/freshswe-py. Author's conditional: if hidden tasks were validated with the same harness, they already exclude these cases. No staff response.

### 4d. Corroboration, contradictions, consolidated picture

- **756461 (Nov 6):** gold patches fail on ~43% of public tasks in the Getting Started sandbox (56/129 = 43.4%, consistent with 756400); requests fixtures produce ~190 collection/setup errors per run. "Does the Kaggle scoring environment have these dependencies" — unanswered. Adam Johnson's "They fail public not Private I believe was stated by the hosts" is a hedged paraphrase anchored to the Sep 29 staff quote.
- **757661 (Nov 10):** independent reference-patch audit, ceiling 74/129 (34 import + 12 httpbin); HARNESS_README two-container lifecycle, 4 GiB / 2 vCPU verification container; hidden-container provisioning unanswered.
- **744370 (staff anchor, Sep 29):** "I can confirm that the hidden tasks validate at 100% with a 'gold patch' submission." Guarantees gold validation, NOT agent-solvability within budget; 6 weeks old, not re-confirmed. Mechanism (Oleksii Zhukov, MASTER): harness unpacks newest wheels into site-packages WITHOUT resolving dependencies — environment-dependent failure sets explain audit disagreements (71 vs 73 vs 74 gold passes).
- **Contradiction:** 756622's "only 114 of 129 are valid" (no task list) conflicts with 68/129 (756400), 74/129 ceiling (757661), ~43% gold-fail (756461). Likely different sandbox dependency assumptions. Do NOT plan on 114/129; run our own gold/empty audit on the exact wheelhouse.
- **Consolidated (public 129, local sandbox):** ~34 missing-lib tasks; ~12–13 requests httpbin tasks; 1 httpx gold-fail; 13 reference-fix failures; 7 timeouts; 2 other; 5 empty-pass; 2 scorer-blocked (rich_3486, fastapi_14186). Strictly valid: **68/129 = 52.7%**. Gold-pass ceiling 73–74/129; naive ceiling with only the 27 excluded ≈ 79%; plain-notebook 52/129. Hidden set: staff-confirmed 100% gold-validation (Sep 29), private repos, ~120 tasks; scored public split = 58 (LB-verified; 58×2=116 ≈ 120, consistent within rounding).

---

## 5. LEADERBOARD (verified against captured CSV)

Growth: **4,808 teams (Nov 5) → 5,439 teams (Nov 11)**, +631 (+13.1%). Nov 10 reported 5,250 (757588) — consistent day-over-day trajectory.

| Score | Nov 5 (CSV) | Nov 10 (757588 reported) | Nov 11 (CSV, verified) |
|---|---|---|---|
| 0.29 | 1 | 1 | 1 — Yurnero (GRANDMASTER, 18 entries), unchanged |
| 0.24 | 9 | 11 | 12 |
| 0.22 | 66 | 74 | 81 |
| 0.20 | 332 | 416 | 445 |
| 0.18 | 760 | — | 949 |
| 0.17 | 863 | 964 | 992 |
| 0.15 | 698 | 764 | 801 |
| median | 0.15 | 0.15 | 0.15 |
| teams | 4,808 | 5,250 | 5,439 |

- **Top score 0.29 = 17/58 public tasks solved.** Yurnero unchanged at the top since Nov 5.
- **0.24 cluster (≥0.24 incl. leader): 10 → 13.** The 0.24 bucket alone went 9 → 12 (Nov 10: 11). The 0.22 bucket now holds **81 teams**.
- **Upward mobility (verified by team-name match across the two CSVs):** 537 teams improved; **0 declined** — structural, the public LB retains each team's best score. Of the 94 teams now at ≥0.22: 75 were already ≥0.22 on Nov 5, **16 jumped from ≤0.18** (6 from exactly 0.18), 2 from 0.20, 1 new team ("Dream team"). Only 2 teams moved ≤0.18 → ≥0.24 specifically — the "many 0.18→0.24 improvers" reading is overstated for the 0.24 band; the real movement is into the 0.22 band. The 0.18 bucket itself grew (760 → 949) as participation rose.
- **Score granularity verified:** every distinct score in the Nov 11 CSV equals floor(k/58) to 2 decimals (0.00, 0.01, 0.03, 0.05, 0.06, 0.08, 0.10, 0.12, 0.13, 0.15, 0.17, 0.18, 0.20, 0.22, 0.24, 0.29) — **58 scored public tasks, 1 task = 0.017**.
- **Score noise evidence (757588):** unchanged 0.24 prompt-only bundle (honghanhhh Budget-Fit v6) reran at **0.17** (14→10 tasks, 4-task gap); budget-v2 reran 0.15; Mega Ensemble 0.22 still queued. Author: sd ~1.5–3 tasks; published scores likely best-of-several-tries (untested); "One run is not a verdict." Corroborated by 756438 (0.20 → .18/.17/.17/.17/.13) and 750907 (~10–13% per-task flip rate, two teams). Local re-verification is itself unstable (Allan Kipruto: reran resolved=True tasks, some flipped to False).
- **Strategic read:** public LB standings are best-of-N samples of a noisy process; LB rank 1 expects a huge final shakeup. Favor robustness and private-set transfer over public-LB overfit before Dec 2.

---

## 6. BCF DESIGN IMPLICATIONS (numbered, tied to thread evidence)

1. **Bonus slot planning:** an E2B/E4B run must occupy one of the two final-selection slots to be eligible for the $10k; it stays eligible for main prizes and Paper Track (double-count). Winner decided on the private set with main-track tie-breaks — optimize private-set robustness, not public LB. (751104 host OP; 748287 same-variant rule.)
2. **Deadline posture:** working assumption Dec 2 for bonus submissions; safe internal deadline Nov 12 until staff resolves the Prizes-page contradiction; press for confirmation in 757244. Paper Track deadline Nov 12 is separate and imminent. (757244; 751104.)
3. **Data-handling freeze:** until §4.b (757783) and Rule 2.4.b (757223) are answered, do not send competition task material to DeepInfra/RunPod/third-party chat LLMs; keep trajectory annotation offline/local or inside Kaggle; paper track publishes aggregates only (derived-data status also unconfirmed).
4. **Hand-constructed LoRA:** no host ruling — do not spend a scored run on an activation-derived adapter; keep standard PEFT format, verify it loads in the sanctioned runtime, obtain written clearance first; Paper Track as the safe outlet. (756792.)
5. **LoRA generally:** adapters load and score but cost ~+29% task time / ~+45% tokens per step; evidence shows at-best parity (0.17 = baseline; rank-32 attempt 0.06). Require a demonstrated local gain; cut task cap to ~5–6 min and thinking to ~2048; verify total runtime <12h at 120 tasks; triage timeout vs loading signatures. (755677.)
6. **Merger caution:** mergers are irreversible with unknown score-carry semantics and a combined submission-count cap (competitor math: team max 5, cumulative 1/day since Sep 23). Before any merge before Nov 25: pause submissions, compute the combined count, get staff answers in 756693. Kai's offer (756607): 32 paused submissions with mid-October private-LB tie-break value, 286-task eval set, dead GPU; partner cap ≤~14 (up to ~25–32 if pausing). (756693; 750907; 756607.)
7. **Queue defense before Nov 25 / Dec 2:** submit early in the day, validate ZIPs with the official compiler, keep a minimal fallback bundle, monitor PENDING state, escalate same-day with submission IDs in 747519/743683, and budget for lost days rather than assuming reruns (rescore paused since Sep 28; 36–52h stalls; one-pending gate). (747519; 743683; 757993.)
8. **Eliminate array-typed tool parameters** from all custom tool/skill schemas before Nov 25: the gemma4 parser hang is unfixed and unacknowledged; one malformed array argument freezes the server and zeroes every remaining task; submissions cannot patch the harness. Reproduce locally on the official wheelhouse before committing a bonus run. (753973; 745138 fuzz.)
9. **Hedge the reasoning-fix uncertainty:** public wheelhouse v31 still drops thoughts between tool calls while the managed scorer may be patched. Build agents that restate critical state in visible assistant text (works either way); keep a thought-retention-tuned variant; do NOT spend a slot resubmitting an unchanged ZIP until staff confirms a scorer-side change (no rescores promised). (744354.)
10. **Encoding + edit contract:** match training-data tool-result encoding to exactly ONE level of JSON escaping; teach correct old_string unescaping; add a .py syntax/AST gate before submit_patch — the edit_file fallback repairs new_string ONLY when old_string needed repair, and write_file content gets no repair at all. (744272.)
11. **Compaction-proof the agent loop:** LlmEventSummarizer keeps only text parts; paraphrase every important tool result into assistant text before the next action; keep per-task context under the 14,336-token trigger (targeted reads, traceback compression, AST slicing for 600+ line files — Mikhail's 44.6%/30.6% numbers unverified but techniques cheap); no code hooks exist; a text reply terminates the session — terminate deliberately. (754783; 756336; 748287 staff no-ADK-v2.)
12. **Architecture:** single agent + agent_tools matches the current public-leading prompt-only archetype; sequential/multi-agent designs and task-skipping failed in practice; staff-suggested ParallelAgent is broken on ADK v1.36. All agents/subagents must share the same model variant (per-agent LoRA allowed). (756622; 756438; 748287.)
13. **Edit-reliability layer is the highest-value E4B lever:** retry-dedupe (force re-read or write_file/patch on an identical failed edit call), pre-validate old_string against a fresh file snapshot, post-edit .py parse gate. Reuse the Apache-2.0 E2B funnel/replay scripts to measure E4B failure rates CPU-cheaply — no E4B empirical results exist in the capture. A/B-test Kai's one-line fix only after disclosure, with replication (their LB dropped). (756433; 756607; 744272.)
14. **Runtime budget:** design for ~6 min/task (12h / ~120 tasks), hard cap ≤8 min with graceful early exit; 12h all-or-zero (competitor-reported; staff question 756963 unanswered) means worst-case total runtime must be bounded. A 15 min/task design timed out on the hidden set. Do not build a solve-60/skip-60 strategy on harness support that isn't there. (756622; 756400; 756438; 756963.)
15. **Freeze a clean local eval set before any A/B tuning:** start from 756400's 68 valid tasks (valid_tasks.txt); exclude the 27 listed fastapi ids, the 12 requests httpbin tasks, and the 2 scorer-blocked tasks (rich_3486, fastapi_14186); reconcile the 4 extra local candidates (fastapi_14266/14609/15030/15745) by running gold+empty locally on the exact wheelhouse. Never A/B on the raw 129 (5 empty-pass tasks inject free-point noise). Do NOT spend agent budget repairing the sandbox via patches (hidden gold validates 100% per staff; patch-installed packages' legality never answered). (756400; 756587; 757893; 757661; 744370.)
16. **Variance-aware selection and submission plan:** ~10–13% per-task flip rate; 1 public task = 0.017; ignore single-run deltas <4 tasks; published bundle scores are likely best-of-N (reruns 1–4 tasks lower). Choose the 2 final submissions via replicated local eval (2 runs on a fixed ~30-task set + ~106-task held-out, win-both rule). Spend the ~70-submission cap / 1-per-day cadence on repeated runs of YOUR best config, not on copying public bundles. Expect a large final shakeup. (750907; 757588; 756438; 757626.)
17. **Public→hidden transfer is weak:** keep a private-repo-style validation proxy (e.g., FreshSWE-Py 663 post-release tasks) rather than public-only tuning; validate thinking-on within a 5–6 min cap (thinking-off 5-min scored 0.05 for one team — not a general verdict). (756400; 757893.)
18. **URL-only tasks (~18–23 public, almost all rich; hints_text empty 129/129; sandbox network_mode=none; screenshots arrive as text URLs):** prompt/train the agent to reconstruct issue specs from repo snapshot + title + repo knowledge; never attempt network fetches; do not budget time expecting issue bodies offline. No staff confirmation either way — monitor 757149/746944 before Nov 25. (757149; 746944.)
19. **Cheap iteration + localization tuning:** adopt gemma4-locbench-v1 + the pytest-verified context-selection harness for GPU-free, budget-matched localization tuning with exact McNemar + Wilson CIs; use CPU-only patch re-verification (TechNaom runner); re-verify borderline tasks multiple times (local reruns flip resolved=True→False). Do not invest in end-to-end graph-tool nudging (p=0.69, <10% natural usage) — pursue graph-guided selection only if locbench shows a localization-stage win. TPU v5e-8 vllm-tpu reportedly matches the GPU scorer (21 vs 21–22 on 51 tasks) — validate on our tasks before trusting for E4B. (756315; 756400; 757588; 750907.)
20. **Treat harness "resolved" as an upper bound on correctness** (14.7% of planted broken fixes escaped; inverted booleans and off-by-one are the weak spots; removed-raise always caught): for paper-track claims add mutation-style sanity checks and keep explicit error-path tests. (756400.)
21. **Do NOT attempt public/private split probing:** needs 240+ submissions vs 70 cap (infeasible single-account), variance defeats single-probe classification, multi-account carries ban risk, no staff ruling — negative expected value. (757626.)
22. **Pin the local runtime for scorer parity:** wheelhouse v31 / dataset-version 19987205, vLLM 0.19.1 (parser SHA 682b2152...), swegemma 0.2.11, adk-submission 0.2.13, google-adk 1.36.1, Python 3.12.13, 4xL4 TP4 bf16 max_model_len 32768; add a reasoning-field-survival check (tokenize repro) to local validation. Assume enable_sandbox_testing=True but keep verification targeted and time-bounded. (757782; 744354; 745138; 757564.)

---

## 7. OPEN QUESTIONS still unanswered by staff (as of the Nov 11 capture)

| Thread | Question | Asked | Why it matters |
|---|---|---|---|
| 757244 | Bonus deadline: Nov 12 or Dec 2 for E2B/E4B submissions? Which submissions does the Prizes-page Nov 12 sentence cover? | Nov 9 (Gagan Deep; Altcont Altul follow-up) | Schedule bet for the $10k track; community says Dec 2, unconfirmed |
| 757783 | §4.b: hosted inference (DeepInfra), private GPU staging/fine-tuning (RunPod), independently sourced public upstream material; disclosure requirements | Nov 10 (Alvaro Camacho De Pass) | Legality of external-compute development; 0 comments |
| 757223 | Rule 2.4.b: pasting training-set excerpts into third-party hosted LLMs for trajectory annotation; paper-track publication of derived counts/labels | Nov 9 (Brejesh Balakrishnan) | Annotation workflow + paper track; 0 comments |
| 756792 | Are hand-constructed (activation-derived) LoRA adapters acceptable? | Nov 7 (Refresh2k); 3 competitor comments | No host ruling; do not spend a scored run |
| 756693 | Team merger: best vs most-recent score carry; daily-allowance reset; leaderboard placement | Nov 7 (tianchan11) | Irreversible merge before Nov 25; 0 replies |
| 756963 | Timeout semantics: total time, task count, cut vs score-0 on timeout | Nov 8 (Heisenberg, tagged @ryanholbrook) | All-or-zero vs partial credit; 0 replies |
| 757149 | Do scored agents get issue-link contents / screenshots offline? Via which path? Are URL-only tasks checked for information sufficiency? | Nov 9 (song tao shi; re-pinged @ryanholbrook same day) | URL-only task strategy (~18–23 public tasks); predecessors 744370/746944 also unanswered |
| 757661 | Does the hidden verification container (4 GiB / 2 vCPU) provision inline_snapshot / dirty_equals / httpbin differently? | Nov 10 (larry54321zhao) | Whether public dependency gaps touch scoring; staff anchor is 6 weeks old |
| 757564 | Is enable_sandbox_testing left at its True default during scoring? Are targeted time-bounded repo-test runs intended use? | Nov 10 (Chris) | In-sandbox verification budget; 0 comments |
| 757782 | Exact wheelhouse version/manifest for dataset-version 19987205; immutable L4x4 image ID/digest + inventory | Nov 10 (Alvaro Camacho De Pass) | Scorer parity; 0 comments |
| 757893 | Will organizers adopt any of the 5 scorer fixes (affects rich_3486 / fastapi_14186 and 24% of correct fixes)? | Nov 11 (Hersh Mittelman) | Local-eval denominators; final-leaderboard consistency |
| 744354 | Does the managed scorer include the reasoning_content fix? Will a patched public wheelhouse be provided? Is resubmitting unchanged ZIP #58029790 meaningful after a scorer update? | Nov 11 (Lazaros Avramidis) | Local/public parity; submission-slot decision |
| 753973 | Deploy the upstream no-progress guard (vllm#41991), or should teams remove array-argument tools? | Oct 29 + Nov 5 (haji bolot; MarchFederico); re-pinged Nov 8–9 | Run-killing server freeze; never answered |
| 757626 | Ruling on public/private split probing; addressing variance | Nov 10 (xz, tagged @ryanholbrook @elanlearns) | Gray-area exploit; ban risk; no ruling |
| 747519 / 743683 / 757993 | Clear stuck PENDING submissions (IDs 58167555, 58168732, 58169454, 58168380 + Nov 11 wave); restore lost submission opportunities; queue fix / rerun commitment | Nov 6–11 (multiple competitors) | Daily slots evaporating before Nov 25 / Dec 2; last staff words Oct 13 / Sep 28 |
| 751104 | Will the promised daily small-model leaderboard notebook actually be updated? | Nov 6 (amunozo) | Bonus-race visibility; no staff reply |

**Watch items (non-staff):** 756400's promised thinking-on hidden-set rerun (not posted); 756315's budget-matched structure-vs-similarity paper (promised, not posted); YosQuant's 30-task eval subset with IDs + checksums (promised ~Nov 11, not yet visible; cross-team trial after Nov 12, merge targeted before Nov 25); 756607 Kai merge offer (GPU need before Dec 2); staff reversal risk on ADK v2 (none in capture).

---

## Sources (all local; no web research; no other input/ files modified)

- `input/kagglecomp/intel_20261111/raw-capture-log.md` + `capture-manifest.json` (census 327 / captured 38 / new content 34)
- `input/kagglecomp/intel_20261111/02-raw-forum-digest-2026-11-05-to-2026-11-11.md` (post-cutoff content + staff counts)
- `input/kagglecomp/intel_20261111/leaderboard-public-2026-11-11.csv` (5,439 teams; buckets and floor(k/58) quantization re-verified by briefer) and `input/kagglecomp/intel_20261105/leaderboard-public-2026-11-05.csv` (4,808 teams; improver analysis)
- `scratch/bcf-2026-11-11/intel/live-rules-bonus-staff.md`, `live-harness-fixes.md`, `live-solvability-data.md`, `live-small-model-ops.md` (analyst notes; quotes)
- `scratch/bcf-2026-11-11/intel_texts/topic_<id>.md` (full dumps; verbatim quote spot-checks: 751104, 757244, 747519, 743683, 744354, 756433, 744370, 757626)
- `scratch/bcf-2026-11-11/tasks/*.json` (129-task reconstruction; solvability verification) + `scratch/bcf-2026-11-11/_work/verify_solvability_claims.py`
- Companion manifest: `input/kagglecomp/intel_20261111/01-thread-manifest-2026-11-11.md`


---

<!-- ====================================================================== -->
<!-- FILE: 01-thread-manifest-2026-11-11.md -->
<!-- ====================================================================== -->

# Thread Manifest — Intel Capture 2026-11-11

Competition: Gemma 4 Developer Agent (Kaggle). Capture window: content after **2026-11-05T18:13:00Z** (previous sweep: intel_20261105); captured 2026-11-11.
Census: **327 topics; 38 captured; 34 with new content** (24 NEW threads + 10 UPDATED) + 4 PINNED-only threads unchanged. Leaderboard captured (5,439 teams).

Basis: `input/kagglecomp/intel_20261111/raw-capture-log.md` (ids, titles, authors, tiers, reasons, dates verbatim) plus briefer analysis of the four analyst clusters (`scratch/bcf-2026-11-11/intel/live-*.md`) and full dumps. Tier convention: STAFF = organizer-verified; Elan Markowitz is tier CONTRIBUTOR in the capture but is the competition host — marked [HOST]; his posts are organizer statements. All other tiers = competitor-reported. "New" = posted after the cutoff. Zero STAFF posts in any captured thread since the cutoff.

Summary: STAFF-authored threads: 742815, 743683, 747519, 748287 (4). Host-authored: 743007, 745998, 751104 (3). Unchanged pinned-only: 742815, 743007, 745998, 748287. Digest caveat: empty "? (?)" comments counted in the digest are absent from full dumps (747519: 4; 743683: 1; 751104 older: 1); 747519's dump is partial for very old comments (all post-cutoff posts present).

| ID | Title | Author | Tier | Reasons | Posted | Last comment | One-line takeaway |
|---|---|---|---|---|---|---|---|
| 742815 | How to get started + Competition's Official Discord | Ashley Oldacre | STAFF | PINNED | 2026-09-23 | 2026-10-04T12:01 | Unchanged since cutoff (no new comments, no detectable edits); onboarding/Discord pointer only. |
| 743007 | Welcome to the Gemma 4 Developer Agent Competition | Elan Markowitz | CONTRIBUTOR [HOST] | PINNED | 2026-09-24 | 2026-10-06T14:58 | Unchanged since cutoff; host welcome post, no post-cutoff content. |
| 743683 | Rerunning Failed Submissions | Ryan Holbrook | STAFF | UPDATED | 2026-09-26 | 2026-11-11T02:53 | No new rerun policy: Sep 28 "pause the rescore" still the last staff word; Nov 6/11 competitor stall requests (#58168380 >36h PENDING); reruns requested, not promised. |
| 744272 | Tool results reach the model double-JSON-encoded: a line of code with quotes turns into a wall of backslashes | Whisper Last | CONTRIBUTOR | UPDATED | 2026-09-29 | 2026-11-08T15:08 | Fix confirmed live (swegemma 0.2.11 / adk-submission 0.2.13, one JSON level); NEW residual Nov 8: exact old_string + escaped new_string writes literal escapes; write_file gets no repair. |
| 744354 | Thinking mode drops the model's thoughts between tool calls (vLLM ignores `reasoning_content`). Will the scoring environment be patched? | KE WU | EXPERT | UPDATED | 2026-09-29 | 2026-11-11T09:23 | Nov 11 repro: public wheelhouse v31 still drops reasoning_content (vLLM 0.19.1 reads only `reasoning`); staff's Oct 1 "fix in wheelhouse" claim broken or scorer-only; managed-scorer parity unknown; no staff reply. |
| 745998 | Note on Code Graphs for Async Functions | Elan Markowitz | CONTRIBUTOR [HOST] | PINNED | 2026-10-05 | 2026-10-05T17:37 | Unchanged since cutoff; host note on async-function code graphs. |
| 747519 | Update on "Kaggle Error" Submissions & Queue Delays | Dustin | STAFF | UPDATED,PINNED | 2026-10-08 | 2026-11-11T14:12 | Queue regressed from Oct 13 staff baseline ~14h to 36–48h+ stalls (IDs 58167555/58168732/58169454); one-pending gate ("400 FAILED_PRECONDITION") blocks all new submits; staff silent since Oct 13. |
| 748287 | New Gemma 4 Models Available: 12B, E4B, and E2B | Ryan Holbrook | STAFF | PINNED | 2026-10-11 | 2026-10-31T05:00 | Unchanged since cutoff; standing rules: 4 QAT aliases, no variant mixing (per-agent LoRA OK), identical scoring conditions, no ADK v2, 12B serving fix in wheelhouse; re-cited Nov 7 in 754783. |
| 748999 | Looking for a team or team mates | Moez Ur Rehman | CONTRIBUTOR | UPDATED | 2026-10-13 | 2026-11-08T10:42 | Team-up churn only (join requests Nov 5/8); rank-64 competitor actively recruiting — merger market is live; no technical content. |
| 750907 | Looking for 1–2 teammates — TPU eval engine that matches the scorer + LoRA pipeline (0.17) | Mehmood Zafar | CONTRIBUTOR | UPDATED | 2026-10-20 | 2026-11-07T00:01 | Two independent teams measure ~10–13% per-task flip rate; win-both replicated selection protocol (30-task + 106-task held-out); merge cap math (team ≤5, cumulative 1/day since Sep 23); 30-task subset promised ~Nov 11; pre-cutoff TPU v5e-8 scorer-parity claim. |
| 751104 | 🌟Bonus Prize: Small Model Development ($10,000) | Elan Markowitz | CONTRIBUTOR [HOST] | UPDATED,PINNED | 2026-10-20 | 2026-11-07T00:18 | Exact bonus terms (host OP unchanged): $10k, private-set winner, must be 1 of 2 final selections, LoRA allowed, same deadlines as main track; NEW: daily-LB freshness nudge (amunozo) + off-topic promotional AST mispost (Mikhail). |
| 753973 | [BUG REPORT] tool parser can loop forever on an array tool argument, freezing the inference server for the rest of the run | haji bolot | CONTRIBUTOR | UPDATED | 2026-10-29 | 2026-11-09T01:17 | Array-arg parser infinite loop still UNFIXED/UNANSWERED (fresh victims Nov 8–9); one malformed call zeroes every remaining task; E4B-linked; upstream guard vllm#41991 not committed by staff. |
| 754783 | in EventsCompactionConfig: LlmEventSummarizer drops all tool calls and tool responses | carlesoctav | CONTRIBUTOR | UPDATED | 2026-11-01 | 2026-11-07T02:27 | Compaction keeps only text parts — tool results forgotten unless paraphrased into assistant text (Jack Yu Nov 7); staff no-ADK-v2 re-cited → behavior fixed through finals. |
| 755677 | Scoring zero when using LoRA adapters | Luca Massaron | GRANDMASTER | UPDATED | 2026-11-04 | 2026-11-10T11:45 | Community-resolved as timeout/budget: rank-32 LoRA scored 0.06 (Nov 10 disclosure), 0.17 parity at 6-min cap + 2048 thinking; ~+29% time / +45% tokens overhead; Luca's 0.00 unexplained; no staff reply ever; no demonstrated LoRA gain. |
| 756315 | Community resource: pytest-verified context-selection harness + gemma4-locbench-v1 (probe set) | Kris_shah123 | CONTRIBUTOR | NEW-ID,NEW-THREAD,UPDATED | 2026-11-05 | 2026-11-05T23:34 | GPU-free budget-matched localization benchmark (graph/lexical/hybrid/oracle/floors) with exact McNemar + Wilson CIs; posted after cutoff; "embedding retrieval" is lexical bag-of-terms; not fetched locally. |
| 756336 | swegemma, which is built on Google’s ADK | murece rickman | CONTRIBUTOR | NEW-ID,NEW-THREAD,UPDATED | 2026-11-06 | 2026-11-06T00:40 | Compaction triggers at 14,336 tokens, keeps last 5 events, generic summary; no submission overrides/code hooks; anti-reasoning nudge after cut-off turns; a text reply terminates the session. |
| 756400 | Audit: 61 of 129 public tasks can't tell agents apart (+ open configs and data) | Manohar Papasani | CONTRIBUTOR | NEW-ID,NEW-THREAD,UPDATED | 2026-11-06 | 2026-11-06T05:49 | Gold+empty audit: 68/129 valid (61 non-discriminating), 5 empty-pass; 34 missing-lib gold failures; 14.7% mutant escape; graph tools no end-to-end help (p=0.69); 50%-public agent timed out hidden / 0.05 at 5-min thinking-off; open Apache-2.0 repo + CPU-only re-verification. |
| 756433 | Public code: configs, trajectories and analysis scripts for a Gemma 4 E2B agent failure study | kamenriderFAKCHION | CONTRIBUTOR | NEW-ID,NEW-THREAD,UPDATED | 2026-11-06 | 2026-11-06T08:38 | Only empirical E2B study in capture: reads right file but ~75% of failed edits are verbatim retries; distinct failures use intended/absent code in old_string; 11 configs (A–K) fixed nothing; reusable funnel/replay scripts; no numeric scores in post. |
| 756438 | How you guys considering time allocations | Prathmesh Adsod | EXPERT | NEW-ID,NEW-THREAD,UPDATED | 2026-11-06 | 2026-11-06T18:33 | 58-task scored split (LB-verified quantization); noise wall: same bundle .20→.18/.17/.17/.17/.13; solve-60/skip-60 time allocation not properly supported by the harness. |
| 756461 | Gold patches fail | Eutychus Mugambi | CONTRIBUTOR | NEW-ID,NEW-THREAD,UPDATED | 2026-11-06 | 2026-11-06T18:34 | ~43% gold-patch failures in Getting Started sandbox (56/129, corroborates 756400); scoring-deps question unanswered; "public not private" reply is a competitor paraphrase of the Sep 29 staff anchor. |
| 756587 | Local evals: 27 public fastapi tasks can never pass in the sandbox | Jason Wold | CONTRIBUTOR | NEW-ID,NEW-THREAD,UPDATED | 2026-11-06 | 2026-11-06T19:47 | 27 fastapi ids fail collection (inline_snapshot/dirty_equals missing) → ~79% local ceiling; BCF verification: 17/27 direct imports, 10 via unseen repo files, +4 unlisted candidates (14266/14609/15030/15745). |
| 756607 | Team up: root cause of the edit_file old_string loss (+1-line fix) and a 286-task eval set — our GPU died, looking to merge before 11/25 | Kai | CONTRIBUTOR | NEW-ID,NEW-THREAD,UPDATED | 2026-11-06 | 2026-11-08T16:02 | Claimed single mechanism (affected calls fail 93% vs 11%) + one-line prompt fix (4.5%→1.2%) UNDISCLOSED until merge/post-competition; confounded version LOWERED public LB; RTX A6000 died Nov 8; 32 paused submissions; seeks partner ≤~14 subs (up to ~25–32 if pausing). |
| 756622 | How to get started with the solution development of this hackathon problem | Soumyadip_007 | CONTRIBUTOR | NEW-ID,NEW-THREAD,UPDATED | 2026-11-06 | 2026-11-07T02:34 | Murugesan (EXPERT) operational claims: 12h all-or-zero over ~120 tasks, ~6 min/task, prompt-only system.md leads public LB, sequential agents and task-skipping infeasible; "114/129 valid" contradicted by other audits — do not use. |
| 756693 | Team merger: which score does the merged Team carry? | tianchan11 | CONTRIBUTOR | NEW-ID,NEW-THREAD,UPDATED | 2026-11-07 | 2026-11-07T06:53 | Best-vs-most-recent score carry, daily-allowance reset, and placement all UNANSWERED (0 replies); merge irreversible before Nov 25; cap corroborated by 750907/756607 math, carry semantics not. |
| 756792 | Are hand-constructed LoRA adapters acceptable (weight edit from activation analysis, not gradient descent)? | Refresh2k | CONTRIBUTOR | NEW-ID,NEW-THREAD,UPDATED | 2026-11-07 | 2026-11-10T03:01 | No host ruling (3 competitor comments, 0 staff); consensus: probably fine if a standard PEFT LoRA loads, but get written clearance before a scored run; Paper Track suggested as safe outlet. |
| 756963 | Question regarding timelimits | Heisenberg | CONTRIBUTOR | NEW-ID,NEW-THREAD,UPDATED | 2026-11-08 | 2026-11-08T09:49 | Total time / task count / cut-vs-score-0 semantics asked of staff, UNANSWERED (0 replies); best competitor answer elsewhere: 12h, ~120 tasks, all-or-zero (756622). |
| 757149 | Will agents get the contents of issue links and screenshots during offline evaluation? | song tao shi | CONTRIBUTOR | NEW-ID,NEW-THREAD,UPDATED | 2026-11-09 | 2026-11-09T12:54 | rich_3064 URL-only (76 chars) and rich_3296 screenshot-URL inputs locally verified; local harness delivers bare text, no images; NO organizer answer (re-pinged @ryanholbrook); assume offline text-only until ruled. |
| 757223 | Are LLM chat tools allowed for annotating our own agent trajectories? | Brejesh Balakrishnan | CONTRIBUTOR | NEW-ID,NEW-THREAD,UPDATED | 2026-11-09 | 2026-11-09T08:42 | Rule 2.4.b: third-party hosted-LLM annotation of training-set excerpts + paper-track derived-data publication UNANSWERED (0 comments); freeze external data flows until clarified. |
| 757244 | Clarification: Small Model Prize deadline | Gagan Deep | CONTRIBUTOR | NEW-ID,NEW-THREAD,UPDATED | 2026-11-09 | 2026-11-09T17:19 | Nov 12 (Prizes page) vs Dec 2 (bonus section) contradiction real and unresolved; Smart Manoj (EXPERT): "December 2" — Nov 12 line is misplaced Paper-Track text; no staff confirmation; plan Nov 12 as safe internal deadline. |
| 757322 | Kernel Stopped working while running Evaluation then failure to submit to competition then failed to authorize session | Allan Kipruto | CONTRIBUTOR | NEW-ID,NEW-THREAD,UPDATED | 2026-11-09 | 2026-11-09T15:08 | Platform fragility only (kernel death, hours-long "failed to authorize session"); single user, no repro, no staff reply; same user reports local resolved=True→False flips in 757588. |
| 757564 | Is in-sandbox testing (enable_sandbox_testing) on during scoring? | Chris | CONTRIBUTOR | NEW-ID,NEW-THREAD,UPDATED | 2026-11-10 | 2026-11-10T01:38 | UNANSWERED (0 comments); swegemma 0.2.11 + README default True (checkable), scorer-side setting unknown; assume available, keep verification targeted and time-bounded per instruction 3. |
| 757588 | I reran a public 0.24 bundle unchanged and got 0.17 (data and short paper) | Harshit Kumar | EXPERT | NEW-ID,NEW-THREAD,UPDATED | 2026-11-10 | 2026-11-10T11:42 | 4-task rerun gap (14→10 of 58); sd ~1.5–3 tasks; best-of-N hypothesis (untested); Nov 10 LB shape matches captured CSV; local reruns flip resolved=True→False (Allan Kipruto); "One run is not a verdict." |
| 757626 | Probing the public/private split to reallocate time | xz | MASTER | NEW-ID,NEW-THREAD,UPDATED | 2026-11-10 | 2026-11-10T16:28 | Split-probing exploit PROPOSED, not demonstrated; Yurnero (LB1) rebuttal: variance → 240+ subs vs 70 cap, infeasible single-account, ban risk for bots; huge shakeup expected; compaction-at-14k underutilizes 30k+ context; no staff ruling. |
| 757661 | Question about the scoring environment for the reference patches | larry54321zhao | EXPERT | NEW-ID,NEW-THREAD,UPDATED | 2026-11-10 | 2026-11-10T10:10 | Reference-patch ceiling 74/129 in un-repaired notebook sandbox (34 import-fail: inline_snapshot/dirty_equals + asttokens/executing closure; 12 requests httpbin); 4 GiB / 2 vCPU verification container; hidden provisioning UNANSWERED. |
| 757782 | Exact wheelhouse and L4×4 runtime metadata for the Gemma 4 Developer Agent competition | Alvaro Camacho De Pass | CONTRIBUTOR | NEW-ID,NEW-THREAD,UPDATED | 2026-11-10 | 2026-11-10T19:00 | UNANSWERED (0 comments); starter pins dataset-version 19987205; corroborated stack from other threads: v31, vLLM 0.19.1, swegemma 0.2.11, adk-submission 0.2.13, google-adk 1.36.1, Python 3.12.13, 4xL4 TP4 bf16 32768; image digest unknown. |
| 757783 | Rules clarification — Using competition training examples on DeepInfra and RunPod (§4.b) | Alvaro Camacho De Pass | CONTRIBUTOR | NEW-ID,NEW-THREAD,UPDATED | 2026-11-10 | 2026-11-10T19:03 | §4.b external-compute questions (hosted inference, private GPU staging/fine-tuning, independently sourced upstream material, disclosure) UNANSWERED (0 comments); keep competition data inside Kaggle/local offline until staff replies. |
| 757893 | To the organizers: 5 concrete scorer fixes, plus an audited task list | Hersh Mittelman | CONTRIBUTOR | NEW-ID,NEW-THREAD,UPDATED | 2026-11-11 | 2026-11-11T05:07 | 277/1,143 (24%) correct fixes blocked by 5 verifier conventions; rich_3486 + fastapi_14186 can NEVER be marked resolved (skipped-sibling matcher); public audit artifacts (FreshSWE-Py); UNANSWERED; hidden-set impact may be nil if pre-filtered. |
| 757993 | Kaggle notebook runtime issue | kush1235 | CONTRIBUTOR | NEW-ID,NEW-THREAD,UPDATED | 2026-11-11 | 2026-11-11T13:30 | Stuck-submission wave Nov 11: 40–52h "Notebook Running" (kush1235 ~2 days, Qiyu_Ma >40h, FakeEyes2W 52h); corroborates 747519/743683 IDs; queue wait vs hung runs indistinguishable; no staff reply. |

Companion brief: `input/kagglecomp/intel_20261111/00-intel-brief-2026-11-11.md`. Full dumps: `scratch/bcf-2026-11-11/intel_texts/topic_<id>.md`. Digest: `input/kagglecomp/intel_20261111/02-raw-forum-digest-2026-11-05-to-2026-11-11.md`.


---

<!-- ====================================================================== -->
<!-- FILE: 02-raw-forum-digest-2026-11-05-to-2026-11-11.md -->
<!-- ====================================================================== -->

# Raw forum digest — content posted after 2026-11-05T18:13:00Z

## 757993 — Kaggle notebook runtime issue

URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/757993  
OP by kush1235 (CONTRIBUTOR), LB rank 4700 on 2026-11-11T10:59Z; new comments 3 (staff 0); older comments omitted 0

**Opening post:**

> My submission.zip from approximately November 9 still shows “Notebook Running” after two days, with no score or error. My previous two submissions succeeded. Could you check whether this submission is progressing or needs a rerun?

**New comments:**

- **FakeEyes2W (CONTRIBUTOR), LB rank 5231** — 2026-11-11T13:30Z
  > same. My submission has been running for 52 hrs
- **Qiyu_Ma (CONTRIBUTOR), LB rank 2232** — 2026-11-11T12:37Z
  > It happens to me too. My submission has been running for more than 40 hours.
- **Muhmad KwaZulu gorilla (CONTRIBUTOR)** — 2026-11-11T11:46Z
  > Imagine waiting 20 hours for a TPU server, just for it to die in 5 minutes violentally

---

## 757893 — To the organizers: 5 concrete scorer fixes, plus an audited task list

URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/757893  
OP by Hersh Mittelman (CONTRIBUTOR) on 2026-11-11T05:07Z; new comments 0 (staff 0); older comments omitted 0

**Opening post:**

> While building FreshSWE-Py (663 post-release tasks in this competition's format), we ran 1,143 real fixes from 36 Python libraries through swegemma 0.2.11's verification rules. 277 of them (24%) fail with their own correct patch only because of one of five conventions. Two of the 129 public tasks hit the same problem: rich_3486 (also found independently by João Paulo in topic 751707) and fastapi_14186 pass every test with their gold patch but can never be marked resolved.
> 
> If the hidden tasks were validated with this same harness, they already exclude these cases and the leaderboard is consistent. The fixes still matter for the two public tasks, for anyone validating on their own copies, and for the final leaderboard. Each has a small fix:
> 
> 1. Drop `-p no:anyio`, or add it only when anyio is not a dependency (79 fixes: all 54 starlette fixes that pass natively, 25 of 43 uvicorn). Their test clients need the anyio plugin's fixtures; with only that flag removed, all 79 pass.
> 2. Keep the repository's pytest configuration (101 fixes). Overwriting pytest.ini drops settings such as `asyncio_mode = auto` and plugin registrations (anyio, litestar, strawberry, parsel). With the repository's own configuration they pass; passing the harness's options as `-o` overrides, instead of rewriting the file, would keep it.
> 3. Pass only collectable test files as targets (65 fixes). Every `.py` file in test_patch becomes a target, so black's tests/data/cases/*.py data files and helper modules in click and loguru are imported as test modules and collection fails. Filtering targets by the repository's python_files pattern (default `test_*.py`, `*_test.py`) would avoid this.
> 4. Don't let a skipped sibling fail a test that passed (24 fixes whose required test, or a sibling with a matching name, is skipped on Linux, plus rich_3486 and fastapi_14186). In `_validate_junit_xml`, any skipped test case that `_node_matches_requirement` matches makes the task fail, and the matcher accepts any name starting with `{req_base}_`. So a required test_x that passes is still rejected when a sibling such as test_x_windows is skipped. Counting only failed or errored cases against a requirement, or prefix-matching only parametrized ids (`{req_base}[`), fixes this. Where the required test itself is skipped on Linux, the task cannot be verified there and is better dropped at validation.
> 5. Read the JUnit report without the 10 MiB output cap (8 fixes, python-multipart). The report is read back through the sandbox's capped output, arrives truncated, and the task is marked unresolved even when every test passed. Copying the file out or streaming it would avoid this.
> 
> The audited list is public: validation/scorer_audit.json records, for each of the 1,143 candidates, which convention blocks it, and validation/public_tasks.jsonl gives the outcome for each of the 129 public tasks (no task content). The validation and audit scripts are in validation/scripts/. We are glad to help run them on the hidden set, or to send the exact list in any format you prefer.
> 
> Dataset: https://www.kaggle.com/datasets/moshegolderson/freshswe-py
> Score your own patches: https://www.kaggle.com/code/moshegolderson/freshswe-py-score-your-patches
> Earlier findings thread: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/751707


---

## 757783 — Rules clarification — Using competition training examples on DeepInfra and RunPod (§4.b)

URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/757783  
OP by Alvaro Camacho De Pass (CONTRIBUTOR), LB rank 2461 on 2026-11-10T19:03Z; new comments 0 (staff 0); older comments omitted 0

**Opening post:**

> Hi Kaggle Staff,
> 
> Could the competition host clarify how §4.b applies to development and evaluation outside Kaggle using examples from the released training set?
> 
> **1. Hosted inference (DeepInfra).** May we send task statements, repository excerpts, tool outputs, and generated edits or patch text to a hosted inference API? Does the answer change if the provider contractually disables retention and training on requests?
> 
> **2. Private cloud GPU (RunPod).**  May we stage the released examples and repository snapshots on an access-restricted instance and run inference or fine-tuning there under our own control? If permitted, what safeguards are required for provider access, storage, logs, and deletion?
> 
> **3. Independently sourced public material.**  Does the answer differ if we retrieve the issue and source directly from the public upstream repository and omit Kaggle-provided task rows, tests, hints, reference patches, and other competition artifacts?
> 
> These questions concern development and evaluation before submission. The scored submission would use the Kaggle harness and permitted model configuration. Please also identify any disclosure requirements.
> 
> Thank you,


---

## 757782 — Exact wheelhouse and L4×4 runtime metadata for the Gemma 4 Developer Agent competition

URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/757782  
OP by Alvaro Camacho De Pass (CONTRIBUTOR), LB rank 2461 on 2026-11-10T19:00Z; new comments 0 (staff 0); older comments omitted 0

**Opening post:**

> Hello Kaggle Support,
> 
> I’m preparing a private, internet-off L4×4 timing probe for the Gemma 4 Developer Agent competition. Before launching anything, could you provide the following two records or exact read-only links to them?
> 
> **1. Competition wheelhouse.** Which immutable version of metric/gemma-4-developer-agent-wheelhouse corresponds to Kaggle dataset-version ID 19987205, referenced by the competition starter notebook? Please provide the version number and a complete manifest with each member’s relative path, exact byte size, and SHA-256 hash.
> 
> **2. L4×4 runtime image.** For my private notebook acamachodepass/notebook1a1aeb7917, which immutable runtime image can I select for a competition-attached, internet-off L4×4 batch? Please provide the supported UI setting or CLI/API field and value, the corresponding image ID or digest, and the package and native-library inventory for that exact image. The key entries are Python, PyTorch and its CUDA build, TorchVision, TorchAudio, CUDA toolkit and runtime, NCCL, CUTLASS, and LiteLLM. Please distinguish versions pinned by the image from host-dependent details such as the NVIDIA driver and GPU allocation.
> 
> If any of these records are unavailable or a field can only be confirmed after allocation, please indicate which ones. This is a metadata request only. Please leave the notebook and its settings as they are.
> 
> Thank you,


---

## 757661 — Question about the scoring environment for the reference patches

URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/757661  
OP by larry54321zhao (EXPERT), LB rank 2030 on 2026-11-10T09:53Z; new comments 1 (staff 0); older comments omitted 0

**Opening post:**

> We audited the published tasks by running each task's own reference patch through the
> organiser's verifier in the reference notebook sandbox. Two test-only dependencies are absent
> from the mounted wheelhouse: inline_snapshot and dirty_equals (their closure also needs
> asttokens and executing). 34 of the 129 published tasks fail with import errors because of
> them, and a further 12 psf/requests tasks fail on an httpbin fixture.
> 
> Could you confirm whether the hidden scoring container provisions these packages (or an
> httpbin service) differently from the notebook environment? We are not asking for a fix -
> we report the ceiling as a property of the reference notebook sandbox - but the answer
> determines whether our measured ceiling of 74/129 applies to scoring, or whether it is lower
> than what the scorer can actually resolve.
> 
> Thanks!

**New comments:**

- **larry54321zhao (EXPERT), LB rank 2030** — 2026-11-10T10:10Z
  > Related: HARNESS_README describes a two-container lifecycle with a 4 GiB / 2 vCPU
  > verification container. Could you confirm whether that container image includes
  > inline_snapshot, dirty_equals and a working httpbin fixture?

---

## 757626 — Probing the public/private split to reallocate time

URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/757626  
OP by xz (MASTER), LB rank 3019 on 2026-11-10T06:23Z; new comments 6 (staff 0); older comments omitted 0

**Opening post:**

> The overview says the roughly 120 test tasks split evenly between public and private. The run has a 12-hour total, about 6 minutes per task.
> 
> A submission can change its behaviour on chosen tasks and watch the public score. Over enough submissions, that reveals which tasks are private. A run could then skip the public half with empty patches and give each private task about 12 minutes instead of 6. That’s a large private-score gain, and with the recent jump in participants, bots or multiple accounts could make the probing cheap.
> 
> Thanks. I’d rather raise this now than find out after the deadline. @ryanholbrook @elanlearns

**New comments:**

- **Yurnero (GRANDMASTER), LB rank 1** — 2026-11-10T06:38Z
  > Well right now 
  > 
  > 1 team solved  17 public tasks correctly
  > 
  > 11 teams solved 14 public tasks correctly
  > 
  > 74 teams solved 13 public tasks correctly
  > 
  > So at worst one could have an advantage for 17\*6 minutes and on average <12\*6 minutes !in theory!.
  > 
  > Practicaly, we also have some kind of a variance in that competition, so getting a 0 on a problem (assuming during the submission we attempted to solve only that problem) doesnt guarantee it was in the private split — we could have just solved a public task incorrectly, meaning that we need 2-3 subs just to test reliably a single task resulting in 240+ submissions and we have 70 submission overall. It's impossible to do with a single account
  > 
  > I dont think thats an issue. Anyway all the bots/multi-acc holders will be banned mostly
  > 
  > btw I also track the LB and havent seen "jumps". Could you clarify? For example, in the Deep Past Challenge competition I tracked [this](https://www.kaggle.com/competitions/deep-past-initiative-machine-translation/discussion/679336) and that was clearly a bot attack for some reason (i think to simply add legitimacy to these accounts and abuse GPUs)
  - **Yurnero (GRANDMASTER), LB rank 1** — 2026-11-10T06:51Z
    > I think the real problem right now is to fix a variance somehow — shakeup in that competition will be huge
    - **Ankith Savio (CONTRIBUTOR), LB rank 250** — 2026-11-10T11:10Z
      > shakeup is unavoidable in LLM comps except for the top few
  - **xz (MASTER), LB rank 3019** — 2026-11-10T15:24Z
    > By jumps I meant the number of participants.
    - **Yurnero (GRANDMASTER), LB rank 1** — 2026-11-10T16:25Z
      > its fine. nowdays competition always have that many participants (due to heavy agents usage I suppose)
      > 
      > name that llm already have more participants comparing to this competition and it was launched a month later
  - **xz (MASTER), LB rank 3019** — 2026-11-10T16:28Z
    > Regarding variance, it is quite possible for bots to be in the prize pool. I have not look into the evaluation in detail but if I understand correctly the context limit is 30k+ and the automatic summarization/compaction is at 14k. This is not even ultilizing the model's native capability properly.

---

## 757588 — I reran a public 0.24 bundle unchanged and got 0.17 (data and short paper)

URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/757588  
OP by Harshit Kumar (EXPERT), LB rank 2045 on 2026-11-10T04:14Z; new comments 1 (staff 0); older comments omitted 0

**Opening post:**

> Sharing a small measurement, in case it helps with planning your daily submission.
> 
> **What we did.** We re-submitted public bundles unchanged, with credit. honghanhhh's Budget-Fit v6 prompt-only (public claim 0.24) scored 0.17 for us. emmanuelmirekumensah's budget-v2 (the author gave no score) scored 0.15. kevlarzanderchi's 0.22 Mega Ensemble is still in the queue.
> 
> **What this does and does not show.** One run is not a verdict. With 58 tasks one task is 0.017, and the run-to-run sd is somewhere between about 1.5 and 3 tasks, so a 4-task gap is possible from noise alone. My guess is that published scores are the best of several tries, so expect a reproduction 1 to 4 tasks lower. That is a hypothesis; I have not tested it with repeated runs.
> 
> **Leaderboard shape on 2026-11-10** (5,250 teams): top 0.29 (1 team), 0.24 (11), 0.22 (74), 0.20 (416), 0.17 (964), 0.15 (764). The median is 0.15.
> 
> **Resources.** Anonymised leaderboard snapshots (rank, score, submission count) for this and three other competitions: https://www.kaggle.com/datasets/harshitsama/kaggle-public-leaderboards-2026-11-02 . Noise-simulation notebook: https://www.kaggle.com/code/harshitsama/gemma-4-agent-is-0-24-vs-0-22-real-noise-check . I also wrote this up as a short paper-track writeup.
> 
> If you reran a public bundle, I would like to know your score versus the claim (even n=1 helps).

**New comments:**

- **Allan Kipruto (CONTRIBUTOR)** — 2026-11-10T11:42Z
  > Same Issue. i re-runned resolved=True tasks, and some were appearing resolved=False

---

## 757564 — Is in-sandbox testing (enable_sandbox_testing) on during scoring?

URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/757564  
OP by Chris (CONTRIBUTOR), LB rank 2410 on 2026-11-10T01:38Z; new comments 0 (staff 0); older comments omitted 0

**Opening post:**

> Hi @ryanholbrook,
> 
> The harness README says that by default `enable_sandbox_testing = True`, so pytest and unittest are available inside Container A and instruction 3 reads "Verify your implementation using targeted tests or inline assertions before submitting". The code agrees: in swegemma 0.2.11 the default is True and the test-runner mask is only applied when it is False.
> 
> Could you confirm what the scoring run uses?
> 
> 1. On the scorer, is `enable_sandbox_testing` left at its default, so the agent can run a targeted test file such as `python -m pytest tests/test_x.py -q` in Container A?
> 2. If so, is running a few of the repository's existing test files in a targeted, time-bounded way (never the full suite) intended use, as instruction 3 suggests?
> 
> Knowing this lets local evaluation match the scorer. Thanks!


---

## 757322 — Kernel Stopped working while running Evaluation then failure to submit to competition then failed to authorize session

URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/757322  
OP by Allan Kipruto (CONTRIBUTOR) on 2026-11-09T15:08Z; new comments 0 (staff 0); older comments omitted 0

**Opening post:**

> Kernel Stopped working while running Evaluation and a kernel pop up appeared on the notebook.  then when i try to submit to competition it fails, then cancelling runs for several hours, i'm still seeing failed to authorize session


---

## 757244 — Clarification: Small Model Prize deadline

URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/757244  
OP by Gagan Deep (CONTRIBUTOR), LB rank 4558 on 2026-11-09T10:09Z; new comments 2 (staff 0); older comments omitted 0

**Opening post:**

> The Small Model Development section says, “Same submission deadlines apply as the main track prizes,” implying December 2. However, the paragraph immediately below says submissions must be made by November 12.  
> Could Kaggle staff please confirm the deadline for E2B/E4B bonus-prize submissions: November 12 or December 2? The Timeline identifies November 12 as the optional paper deadline.
> @ryanholbrook

**New comments:**

- **Altcont Altul (CONTRIBUTOR)** — 2026-11-09T17:19Z
  > Could the competition organizers please confirm whether November 12, 2026 at 23:59 UTC applies only to the Paper Track, with December 2, 2026 at 23:59 UTC remaining the final deadline for scored agent submissions, including the E2B/E4B Small Model Prize? The Timeline and bonus-prize announcement indicate this, but the Prizes section also says "Submissions must be made by November 12, 2026 at 11:59PM UTC." Please clarify which submissions that sentence covers. Thank you.
- **Smart Manoj (EXPERT), LB rank 801** — 2026-11-09T10:27Z
  > December 2. That section should be inserted above the Paper section.

---

## 757223 — Are LLM chat tools allowed for annotating our own agent trajectories?

URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/757223  
OP by Brejesh Balakrishnan (CONTRIBUTOR), LB rank 1451 on 2026-11-09T08:42Z; new comments 0 (staff 0); older comments omitted 0

**Opening post:**

> Rule 2.4.b says we must not "transmit, duplicate, publish, redistribute or otherwise provide or make available the Competition Data to any party not participating in the Competition".
> 
> We want to hand-check how our agent fails on the public training tasks. Two questions for the hosts:
> 
> 1. Does pasting excerpts of training-set material (issue text, patches, test output, or our agent's own tool calls on those tasks) into a third-party hosted LLM service count as providing Competition Data to a non-participant?
> 
> 2. If yes, is there an approved way to use an external model for annotation (for example one running inside a Kaggle notebook on our own quota)?
> 
> Also: do the answers differ for derived data, such as counts or labels computed from our runs, when those are published in a paper-track writeup?
> 
> Thanks.


---

## 757149 — Will agents get the contents of issue links and screenshots during offline evaluation?

URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/757149  
OP by song tao shi (CONTRIBUTOR) on 2026-11-09T04:12Z; new comments 2 (staff 0); older comments omitted 0

**Opening post:**

> Some public development tasks link to information that is missing from the task text:
> 
> - `rich_3064` has a short title and links to [Rich issue #3053](https://github.com/Textualize/rich/issues/3053). The linked issue contains the reproducer and traceback. Neither is in the task's `problem_statement`, and `hints_text` is empty.
> - `rich_3296` includes Before and After screenshots as Markdown URLs. In the local harness we inspected, those URLs reached the agent as text, with no image attachments.
> 
> Could the organizers confirm what the agent receives in the offline scored evaluation? If a linked issue or screenshot contains information needed to solve the task, is that content included in `problem_statement`, `hints_text`, or a local resource? If it is a resource, which path or tool should the agent use to read it?
> 
> If links are passed as text only, are scored tasks checked to ensure the supplied materials contain enough information to reproduce the issue? This affects whether an agent can identify the intended fix from the inputs it receives.
> 
> This follows up on the [earlier discussion about issue links in the offline sandbox](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/744370). Thanks for clarifying.

**New comments:**

- **Navneet (CONTRIBUTOR)** — 2026-11-09T07:06Z
  > Thank you for the offline evaluation info @songtaoshi
- **song tao shi (CONTRIBUTOR)** — 2026-11-09T12:54Z
  > Hi @ryanholbrook, could you clarify what the agent receives when a hidden evaluation task references an issue URL? Is the URL passed through as plain text, or is the linked issue body made available offline? Thanks!

---

## 756963 — Question regarding timelimits 

URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/756963  
OP by Heisenberg (CONTRIBUTOR), LB rank 4697 on 2026-11-08T09:49Z; new comments 0 (staff 0); older comments omitted 0

**Opening post:**

> How much time do we have in total and how many tasks are there in total?
> What happens if the time runs out?
> Is the attempt just cut or do we get a score of 0?
> @ryanholbrook


---

## 756792 — Are hand-constructed LoRA adapters acceptable (weight edit from activation analysis, not gradient descent)?

URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/756792  
OP by Refresh2k (CONTRIBUTOR), LB rank 4944 on 2026-11-07T16:17Z; new comments 3 (staff 0); older comments omitted 0

**Opening post:**

> Are hand-constructed LoRA adapters acceptable — e.g., an adapter that expresses a targeted weight edit derived from activation analysis, rather than one produced by gradient-descent fine-tuning? The adapter would be a standard PEFT LoRA adapter in the sanctioned format.

**New comments:**

- **John K (CONTRIBUTOR), LB rank 2841** — 2026-11-10T03:01Z
  > I would not burn a scored run on it until a host says yes in the thread. If the file is a normal PEFT LoRA in the sanctioned format and it loads in the allowed runtime, it is probably fine on engineering grounds, but a hand-edited adapter from activations is exactly the kind of edge case that is cheaper to clear in writing than to argue about after the fact.
- **Jean-Claude Paquin (CONTRIBUTOR), LB rank 4746** — 2026-11-08T14:20Z
  > As long as it loads, why would it matter? Would likely be a strong contender for the paper track
- **amn (CONTRIBUTOR), LB rank 2346** — 2026-11-09T14:45Z
  > weight-space programming?

---

## 756693 — Team merger: which score does the merged Team carry?

URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/756693  
OP by tianchan11 (CONTRIBUTOR), LB rank 494 on 2026-11-07T06:53Z; new comments 0 (staff 0); older comments omitted 0

**Opening post:**

> Quick rules question before the Team Merger Deadline (2026-11-25).
> 
> Section 5 of the competition rules says team mergers are allowed and that the combined Team must have a total submission count within the allowed maximum. But it does not say what the merged Team's leaderboard entry will be.
> 
> Could someone from Kaggle confirm:
> 
> 1. After two Teams merge, does the merged Team carry the **best** score among the two Teams' submissions, or the most recent one, or something else?
> 2. Does the merged Team's daily submission allowance reset to the standard per-day limit on the day the merge completes?
> 3. If the two Teams are on different score bands on the leaderboard, is the merged entry placed using the better of the two?
> 
> I'm a solo participant and would like to know this before making an irreversible merge. Thanks a lot.


---

## 756622 — How to get started with the solution development of this hackathon problem

URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/756622  
OP by Soumyadip_007 (CONTRIBUTOR) on 2026-11-06T22:20Z; new comments 1 (staff 0); older comments omitted 0

**Opening post:**

> So far I have gone through the basic theory and problem statement of the hackathon and the notebooks present in the Code section of this hackathon . I unable to figure out what to do with the codes and data that has been provided to us in the competition. I want some direction and advice on how to get started and play with the data provided for getting better understanding of what is going on . Please someone give me sone advice and direction on what to do , how to run the dockerfile for this competition.

**New comments:**

- **Murugesan Narayanaswamy (EXPERT), LB rank 691** — 2026-11-07T02:34Z
  > This is the simplest kaggle competition ever if you go by what is required for submission: you just need to submit at the minimum 4 files consisting of agent yaml, prompt md and configuration yamls!! If your solution involves LoRA training, you need to submit your trained LoRA adapter.
  > 
  > Take the best public scoring notebook and look at the output submission.zip and create a notebook that can modify these files and submit after going through the best voted public notebooks
  > 
  > If you believe that gemma 4 has got all intelligence to fix github issues when assisted with agent framework orchestration, skills and instructions (like me!) and that no LoRA training is required, then you have to go beyond a single system.md and use agents. However, the max  public score as of today is from simple sysetm.md - i.e. from just four md files!
  > 
  > As of now, it is not possible to use sequential agents - unless otherwise you find a solution to manage the compaction problem and context window length issues. To my knowledge, there is no public notebook that uses these agents with score that competes with singe prompt. You can however also use agent_tools as given in starter notebook.
  > 
  > The submission notebook MUST solve ALL of the around 120 tasks in 12 hours. If it takes more than 12 hours, then you score zero. This has significantly altered the nature of this competition challenge. Competition hosts intially were willing to score whatever completed intstead of binary scoring either 0 or all tasks. However, due to issues in handling private datasets, this option was ruled out. Hence, the challenge is NOT JUST building complex agent frameworks but MANAGING time. The average tiime per task is around 6 mins max to prevent notebook timeout. However, there are significant tasks that require more than 8 minutes. This is why simple system.md scores over agent orchestration defeating some important objectives of this competition. If you can manage to create a agent framework that can take max time cap of 8 minutes, then you can compete with plain system.md
  > 
  > Another serious challenge is inherent weakness intool usage by gemma (may be LoRA can solve this, am not sure). The edit_file tool malfunctions which you need to resolve.  Similarly, there are several issues that lead to exhausting time cap per task (surprisingly, this does not manifest in single system.md! 😀). These issues have to be isolated and resolved. I think the reason some notebooks score differently when re-submitted ( a 0.22 scored notebook might score 0.13 if resubmitted as per some kagglers) is not because LLM's intrinsic non-detereministic nature but whether these tool issues manifest or not in that run - if you have not solved those issues, then you need to depend on luck!😀 (But I have also seen many non-tool issue cases where the agent simply spends time thinking, re-executing commands etc., all of which are difficult to isolate and solve)
  > 
  > My efforts to use 2-3 agents were not successful. Nor the efforts to skip the tasks.
  > 
  > This competition would have offered more scope for insights and solutions for small models like gemma 4 if the time management is not such a major issue, this is my opinion and conclusion
  > 
  > (Note: The tasks dataset has some isues - not all tasks pass even golden patch - only 114 of  129 are valid - the issue is elaborately analyzed and insights are available in public notebooks)

---

## 756607 — Team up: root cause of the edit_file old_string loss (+1-line fix) and a 286-task eval set — our GPU died, looking to merge before 11/25

URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/756607  
OP by Kai (CONTRIBUTOR), LB rank 865 on 2026-11-06T21:12Z; new comments 2 (staff 0); older comments omitted 0

**Opening post:**

> Our GPU box died mid-competition, so we can't validate further changes, but we have too much done to stop here. Looking to merge (1–2 people) before the 11/25 deadline.
> 
> **What we bring**
> - The root cause of the edit_file failures the Paper Track reports as "~28% old_string loss, cause unknown." It is a single, measurable mechanism: affected calls fail 93%, unaffected calls 11%. A one-line prompt fix cut affected calls from 4.5% to 1.2% and removed the 60+ call retry loops. Note: this is a verified mechanism in our logs, but its effect on the hidden-set score is not confirmed (our run with the fix scored lower on the public LB), so we present it as a measurable finding, not a guaranteed gain.
> - A 286-task local eval set (competition dev + two external sets) with 44 A/B runs, plus the noise and selection math for choosing final submissions.
> - 32 public submissions across versions (public 0.17–0.18) and a clear list of what did not transfer to the hidden set.
> 
> **What we're looking for**
> - A team with about 14 or fewer submissions, or up to about 25 if you stop submitting now. The merge rule caps our combined count: we have 32 and are not submitting while we look. Either GPU access to validate changes before 12/2, or a steady public score.
> 
> **How to contact**
> Reply here with your current number of submissions, your submission scores, model/approach, and GPU setup. Please talk here before sending a merge request. Full details are shared after merging, per Kaggle's rules on private sharing.
> 
> Update: To be precise, the version that dropped on the public LB had this fix plus one other prompt line, so the fix alone is untested on the hidden set. We'll share the full details publicly after the competition ends. Our scored submissions go back to mid-October (useful for tie-breaks on the private LB), and we've paused at 32 submissions, so teams with up to 32 can still merge if they pause until the merge date.

**New comments:**

- **Adam Johnson (CONTRIBUTOR), LB rank 330** — 2026-11-08T04:11Z
  > Colab is fairly cheap 9.99 a month. What GPU were you using?
  - **Kai (CONTRIBUTOR), LB rank 865** — 2026-11-08T16:02Z
    > Sorry for the late reply, and thanks for the advice!
    > We were using an RTX A6000 (48 GB).
    > Given the time remaining, we've stopped our local evaluations and are now looking for a team to merge with.

---

## 756587 — Local evals: 27 public fastapi tasks can never pass in the sandbox

URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/756587  
OP by Jason Wold (CONTRIBUTOR), LB rank 3692 on 2026-11-06T19:47Z; new comments 0 (staff 0); older comments omitted 0

**Opening post:**

> If you are tuning your agent on the 129 public tasks, note that 27 fastapi tasks fail at test collection whatever patch you write: their tests import `inline_snapshot` or `dirty_equals`, which the sandbox does not have. The host confirmed scoring uses private repos, so this only affects local evaluation, but it caps your measured resolve rate at about 79% and adds noise to any A/B comparison that includes them. Excluding them gives a cleaner signal.
> 
> fastapi_11355, fastapi_12942, fastapi_13713, fastapi_13786, fastapi_14099, fastapi_14246, fastapi_14262, fastapi_14297, fastapi_14303, fastapi_14349, fastapi_14356, fastapi_14360, fastapi_14361, fastapi_14371, fastapi_14430, fastapi_14455, fastapi_14459, fastapi_14482, fastapi_14485, fastapi_14512, fastapi_14583, fastapi_14605, fastapi_14791, fastapi_14953, fastapi_14962, fastapi_14964, fastapi_15023
> 
> Details: https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion (my paper track thread)


---

## 756461 — Gold patches fail

URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/756461  
OP by Eutychus Mugambi (CONTRIBUTOR) on 2026-11-06T11:59Z; new comments 1 (staff 0); older comments omitted 0

**Opening post:**

> In the Getting Started notebook’s sandbox, gold patches fail on about 43% of the public tasks, mostly because test dependencies are missing (inline_snapshot for fastapi; fixtures for requests, with ~190 collection/setup errors per run). Does the Kaggle scoring environment have these dependencies, so that those tasks are scoreable?

**New comments:**

- **Adam Johnson (CONTRIBUTOR), LB rank 331** — 2026-11-06T18:34Z
  > They fail public not Private I believe was stated by the hosts.

---

## 756438 — How you guys considering time allocations

URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/756438  
OP by Prathmesh Adsod (EXPERT), LB rank 3973 on 2026-11-06T09:14Z; new comments 1 (staff 0); older comments omitted 0

**Opening post:**

> how you guys are doing time allocations for tasks which needs allocations. Like its better to solve 60 tasks completely and 60 not to attempt instead of 120 tasks partially. How you guys are managing this because in current harness it doesnt seems supported properly.

**New comments:**

- **Adam Johnson (CONTRIBUTOR), LB rank 332** — 2026-11-06T18:33Z
  > 58 tasks public/private so the 129. There is a bit of a high noise wall .20 also scored .18 .17 .17 .17 .13

---

## 756433 — Public code: configs, trajectories and analysis scripts for a Gemma 4 E2B agent failure study

URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/756433  
OP by kamenriderFAKCHION (CONTRIBUTOR), LB rank 5118 on 2026-11-06T08:38Z; new comments 0 (staff 0); older comments omitted 0

**Opening post:**

> Sharing publicly, per the competition's code-sharing rule, the code behind our Paper Track writeup **Finds the File, Cannot Change It: Why a 2B Coding Agent Fails**.
> 
> Repo (Apache-2.0): https://github.com/sigongjoa/gemma4-e2b-edit-failure
> 
> - ADK agent configs A–K for Gemma 4 E2B: recovery instructions, rules distilled from `rich` review comments, tool removal, reasoning/temperature changes, an editor sub-agent
> - Trajectories, patches and logs of every local run (task problem statements removed; no competition data included)
> - Scripts that measure where the agent fails (read the right file / edit it / edit accepted), repeated vs distinct `edit_file` failures, and a replay of edit calls on snapshots
> 
> Main finding: E2B usually reads the right file, but about three quarters of failed `edit_file` calls repeat an earlier failed call verbatim, and most distinct failures put intended or absent code into `old_string` rather than miscopying. None of the harness changes we tried resolved a task.
> 
> Writeup: https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/writeups/finds-the-file-cannot-change-it-why-a-2b-coding


---

## 756400 — Audit: 61 of 129 public tasks can't tell agents apart (+ open configs and data)

URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/756400  
OP by Manohar Papasani (CONTRIBUTOR), LB rank 3104 on 2026-11-06T05:49Z; new comments 0 (staff 0); older comments omitted 0

**Opening post:**

> Before measuring agents, I measured the public benchmark. Here are the results, with all code and data open, in line with the competition's public-sharing rule.
> 
> Repo: https://github.com/TechNaom/gemma4-agentic-swe (Apache-2.0)
> 
> 1. Only 68 of 129 public tasks are valid locally
> 
> I ran every public task through the official harness twice: once with its reference (gold) patch, which should pass, and once with an empty patch, which should fail. A task can separate a good agent from a bad one only if both hold.
> 
> Repo	Tasks	Gold passes	Empty passes	Valid
> fastapi	67	31	2	29
> rich	48	39	0	39
> requests	13	3	3	0
> httpx	1	0	0	0
> Total	129	73	5	68
> 34 gold failures come from two test libraries missing from the provided wheels: inline_snapshot (27 tasks) and dirty_equals (7 tasks).
> 13 tasks fail even with the reference fix, 7 time out and 2 fail for other reasons.
> 5 tasks pass with no patch at all.
> 
> Practical tip: if you tune on the public tasks, use only the 68 valid ones (listed in experiments/valid_tasks.txt). Otherwise part of your local score is noise. I don't know whether the hidden environment has the same gaps.
> 
> 2. The tests accept some broken fixes
> 
> I planted 163 known bugs into the gold patches, using 7 mutation types, and re-scored every one with the official harness. After a hand review that removed equivalent mutants, 24 of 163 broken fixes (14.7%) were still marked resolved.
> 
> Inverted booleans escaped most often (53% before review), then off-by-one errors (33%).
> Removed raise statements were always caught.
> 
> So any resolve rate is an upper bound on truly correct fixes.
> 
> 3. Code-graph tools did not help our agent
> 
> Results on the 68 valid tasks, with gemma-4-31b-it-qat-w4a16-ct on 4x L4:
> 
> Agent	Tools	Resolved
> k0	6 workspace tools only	50% (34/68)
> k4	k0 + all three graph tools	47% (32/68), McNemar p = 0.69
> n4	k4 + a prompt nudging graph-tool use	44% (14/32)
> 
> The agent called a graph tool in fewer than 10% of runs unless told to. Nudging it raised usage but cost more tokens and delayed the first edit, without solving more tasks.
> 
> 4. A warning: public-set results did not transfer
> Our 50% public-set agent timed out on the hidden set at 15 minutes per task (the limit is 12 hours in total).
> With a 5-minute cap and thinking off, it scored only 0.05 on the public leaderboard.
> 
> The hidden tasks come from private repositories and behave very differently from the public ones, so don't rely on public-set tuning alone. We are now testing the same agent with thinking turned on and will post the result here.
> 
> What's in the repo
> agents/: all 11 agent configs (k0 to k5, n1 to n5)
> experiments/audit-2026-10-15/: the full gold/empty audit
> experiments/faults-2026-10-23/: the planted-bug set and its hand review
> experiments/g4swe-*: every run summary, trace and patch
> src/g4swe/: the runner, including a CPU-only patch mode that re-verifies saved patches without a GPU
> submission/main-k0/: our exact submitted config
> 
> The full write-up is on the Paper Track. Questions and corrections are welcome, especially if your audit results differ from ours.


---

## 756336 — swegemma, which is built on Google’s ADK

URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/756336  
OP by murece rickman (CONTRIBUTOR), LB rank 2452 on 2026-11-06T00:40Z; new comments 0 (staff 0); older comments omitted 0

**Opening post:**

> harness summarize the conversation mid-task. It kicks in at 14,336 tokens, keeps only the last 5 events, and replaces the rest with its own generic summary. Every context reset in our cycle 2 logs came from this, never from our design.
> Some of its nudges work against good reasoning. After a cut-off turn it tells the model to “keep reasoning under a few sentences”.
> It can’t be overridden. Our submission can’t add code hooks, change the summarizing, or end a round from a tool.
> Its task message conflicts with multi-round designs. It says a text reply terminates the session.


---

## 756315 — Community resource: pytest-verified context-selection harness + gemma4-locbench-v1 (probe set)

URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/756315  
OP by Kris_shah123 (CONTRIBUTOR) on 2026-11-05T23:34Z; new comments 0 (staff 0); older comments omitted 0

**Opening post:**

> While preparing our paper-track writeup we built a reusable harness for comparing context-selection strategies on the public training tasks under identical character budgets, with the competition's own pytest verification (patches applied with git apply; tests from each task's test_patch; offline wheelhouse deps).
> 
> What's inside (public notebook: https://www.kaggle.com/code/krisshah123/gemma4-context-selection-harness-locbench-v1)
> 
> - Strategies: graph-guided AST call-graph traversal, embedding retrieval (offline bag-of-terms query - the same semantics as the sandbox's search_similar_code lexical fallback), hybrid, oracle upper bound, plus random/empty-context floors.
> - gemma4-locbench-v1: per-task gold files / module paths / hunk symbols derived from the 129 reference patches - score ANY context selector without running a model.
> - Paired statistics built in (exact McNemar + Wilson 95% CIs) so comparisons are defensible.
> 
> Adopt in 3 minutes: attach the competition dataset + wheelhouse, run the cells top-to-bottom, then swap --strategy to benchmark your own selector under identical budgets. Localization-only scoring needs no GPU at all.
> 
> A controlled, budget-matched structure-vs-similarity comparison in the small-model regime is coming as a paper-track writeup. Corrections, requests and critique welcome - if the harness is missing something your agent needs, we would rather fix it now.


---

## 755677 — Scoring zero when using LoRA adapters

URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/755677  
OP by Luca Massaron (GRANDMASTER), LB rank 1180 on 2026-11-04T08:14Z (before cutoff); new comments 3 (staff 0); older comments omitted 7

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
> * **Tools**: `run_command`, `read_file`, `edit_file`, `write_file`, `get_statu …[truncated; pre-cutoff OP]

**New comments:**

  - **Abiram Bharathi S.A (CONTRIBUTOR), LB rank 547** — 2026-11-07T08:34Z
    > can you expain what haeppn and what you did
  - **Jak Ma (MASTER), LB rank 1060** — 2026-11-10T09:27Z
    > Could you share your score of lora-solution?
    - **Ankith Savio (CONTRIBUTOR), LB rank 250** — 2026-11-10T11:45Z
      > For the configuration mentioned above it was 0.06

---

## 754783 — in EventsCompactionConfig: LlmEventSummarizer drops all tool calls and tool responses

URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/754783  
OP by carlesoctav (CONTRIBUTOR) on 2026-11-01T16:35Z (before cutoff); new comments 1 (staff 0); older comments omitted 0

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
>   2. The summarizer outputs: "Tas …[truncated; pre-cutoff OP]

**New comments:**

- **Jack Yu (CONTRIBUTOR), LB rank 3215** — 2026-11-07T02:27Z
  > This is a real concern since most of the context up to the time of compaction are tool calls. Good news is that usually a tool call has its reasoning content, which will be read by compaction, so most tool call is not totally forgotten. What might be forgotten is the tool call result. If the agent didn't paraphrase the previous tool call result before its next action, the result is forgotten forever. 
  > 
  > But it seems like the competition host will not upgrade to ADK v2. So expect the same compaction behavior as is. See organizer's reply: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/748287
  > 
  > But this is another evidence to support upgrading to ADK v2, if @ryanholbrook decides to upgrade (please do 🙏).

---

## 753973 — [BUG REPORT] tool parser can loop forever on an array tool argument, freezing the inference server for the rest of the run

URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/753973  
OP by haji bolot (CONTRIBUTOR), LB rank 52 on 2026-10-29T23:20Z (before cutoff); new comments 2 (staff 0); older comments omitted 3

**Opening post:**

> **Environment**: the competition wheelhouse's vllm 0.19.1 (vllm/tool_parsers/gemma4_tool_parser.py), served with --tool-call-parser gemma4 and the default non-streaming chat path. The client is adk_submission's LiteLlm, with no explicit timeout.
> 
> **Trigger**: the model emits a tool call where an ARRAY argument holds an element that is not wrapped in Gemma's <|"|> string delimiter, and that element contains ]. For example args:["Fix list[str] handling"] (JSON-style quotes instead of <|"|>).
> 
> **Root cause:** in `_parse_gemma4_array` (lines 271–278, the "bare value" branch), the scan stops at the first `]` inside the element. On the next pass, `i` still points at that `]`. The branch consumes nothing, appends an empty item, and the `while i < n` loop never advances. This runs synchronously on …[truncated; pre-cutoff OP]

**New comments:**

- **Mikhil Shetty (CONTRIBUTOR)** — 2026-11-08T13:35Z
  > any update on this ? this is impacting our work
- **shtirmann (CONTRIBUTOR), LB rank 4955** — 2026-11-09T01:17Z
  > facing same issues

---

## 751104 — 🌟Bonus Prize: Small Model Development ($10,000)

URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/751104  
OP by Elan Markowitz [HOST] (CONTRIBUTOR) on 2026-10-20T19:12Z (before cutoff); new comments 2 (staff 0); older comments omitted 6

**Opening post:**

> We are offering an additional **$10,000 bonus prize** dedicated to small-footprint developer agents:
> 
> - **Award:** $10,000 to the highest-ranking submission utilizing **Gemma E2B** or **Gemma E4B**. Final scores are based on the private test set performance. Same submission rules and tie-breaking apply.
> 
> - **Eligibility:** Submissions must explicitly use either Gemma E2B or Gemma E4B as the base model. For a submission to be eligible it must be one of the team’s two selected final submissions. LoRA fine-tuning is allowed just as done for the main track. 
> 
> - **Daily Leaderboard Tracking:** A [separate Kaggle notebook](https://www.kaggle.com/code/ryanholbrook/gemma-4-developer-agent-small-model-leaderboard) will be released and updated daily to display public standings for eligible small mod …[truncated; pre-cutoff OP]

**New comments:**

- **Mikhail (CONTRIBUTOR), LB rank 2168** — 2026-11-07T00:18Z
  > Fascinating study and very clean empirical methodology, especially using exact McNemar tests on paired instances! 👏
  > 
  >     Regarding your core question about retrieval gains disappearing once the relevant file fits in context:
  > 
  >     We observed very similar dynamics while benchmarking local Gemma 4 on real-world multi-file repositories:
  > 
  >     1. Context Saturation Threshold: When a module fits comfortably within the model's high-fidelity attention window (< 4k tokens), giving the full file or
  >     surrounding context often performs on par with AST slicing. The model utilizes contextual clues across helper definitions. However, as module size crosses
  >     ~600+ lines (or multi-file imports), un-sliced files trigger context dilution, and deterministic AST code slicing yields a 44.6% reduction in prompt tokens,
  >     preventing attention decay.
  > 
  >     2. The "Broken Patch" Bottleneck in Test-Driven Self-Correction: Like your findings with test feedback (26% → 42%), running reproduction tests is where real
  >     gains happen. However, on local quantized models, multi-turn retries often introduce invalid indentation or incomplete ASTs. We found that gating patches with
  >     an instantaneous local AST parse gate (47.2 µs latency) before spinning up execution environments prevents wasteful container churn and avoids burning budget
  >     on unparseable diffs.
  > 
  >     3. Traceback Compression: One trap we encountered with test feedback is that raw pytest logs (often 75–100+ lines of setup/teardown boilerplate) quickly
  >     exhaust the remaining context budget across 3 retry attempts. Compressing logs down to the root cause assertion while discarding runner frames gave us a 30.6%
  >     token saving without losing the fault signal.
  > 
  >     Our full verification suite and benchmarks are open under Apache 2.0 on GitHub (search for msingatullin/gemma-4-developer-agent) and in our public Kaggle
  >     notebook ("AST-Guided Loops Verification for Gemma 4").
  >     
  >     Kudos on the great paper and reproducible setup!
- **amunozo (CONTRIBUTOR), LB rank 228** — 2026-11-06T15:15Z
  > Thanks! Could you update the leaderboard's notebook daily?

---

## 750907 — Looking for 1–2 teammates — TPU eval engine that matches the scorer + LoRA pipeline (0.17)

URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/750907  
OP by Mehmood Zafar (CONTRIBUTOR), LB rank 1497 on 2026-10-20T04:39Z (before cutoff); new comments 4 (staff 0); older comments omitted 1

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
> - Someone with …[truncated; pre-cutoff OP]

**New comments:**

  - **Mehmood Zafar (CONTRIBUTOR), LB rank 1497** — 2026-11-06T03:23Z
    > Hi YosQuant, sorry for the slow reply. Your reproduce→patch→test→fix loop is the part we haven’t tried, and our TPU eval engine can test it without using GPU quota.
    > 
    > I’m busy with the paper until Nov 12. After that, trial idea (public info only, no code until we merge): we each test one idea on a fixed task set and share the numbers. If results line up, we agree the equal split in writing and merge before Nov 25.
    > 
    > One other person has also offered to join, so it may be three of us. What’s the best way to talk, Kaggle DM or email?
    - **YosQuant (CONTRIBUTOR), LB rank 815** — 2026-11-06T06:34Z
      > Hi Mehmood, no worries, and good luck with the paper!
      > 
      > Your plan works for us. After Nov 12, each side tests one idea on the same fixed task set and we share numbers only, no code until we merge. For the task set, we're publishing a 30-task subset (IDs + checksums) around Nov 11, so we could both use that to keep results directly comparable.
      > 
      > If the results line up, we agree the equal split in writing and merge before Nov 25. One thing to check first: our side may have 2–3 members by then, so let's confirm the team-size limit leaves room for everyone before we commit.
      > 
      > Kaggle DM is best for us. Talk after the 12th!
    - **Mehmood Zafar (CONTRIBUTOR), LB rank 1497** — 2026-11-06T17:08Z
      > Thanks YosQuant, sounds good. I checked the rules: team limit is 5, so your 2-3 plus me and the other person fits. One more check: a merged team can have at most 1 submission per day since Sep 23 in total. I have 17, how many does your side have?
      > 
      > Happy to use your 30-task set. But in our repeat runs, the same config changes on about 10-13% of tasks, so 30 tasks can hide small gains. Can we run each config twice, or also use our public 106-task set?
      > 
      > Kaggle DM after the 12th works.
    - **YosQuant (CONTRIBUTOR), LB rank 815** — 2026-11-07T00:01Z
      > Thanks Mehmood. Our side has 3 submissions since Sep 23, so 17 + 3 = 20 total. That fits under the merged cap.
      > 
      > Agreed on noise. Our own paper found the same ~10–13% flip rate on repeated runs, which is exactly why we report replication. Let's do both: run each config twice on our 30-task set, and use your public 106-task set as a held-out check. A change only counts if it wins on both.
      > 
      > Kaggle DM after the 12th works for us. Talk then.

---

## 748999 — Looking for a team or team mates

URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/748999  
OP by Moez Ur Rehman (CONTRIBUTOR), LB rank 64 on 2026-10-13T18:39Z (before cutoff); new comments 4 (staff 0); older comments omitted 0

**Opening post:**

> I am a postgraduate MSCS student researching on AI agents and their behaviors involving how LLMs make predictions and decisions (mechanistic interpretability) upon which the agent works. I am a former mechatronics and robotics engineer having 2 research publications in that domain https://scholar.google.com/citations?view_op=list_works&hl=en&hl=en&user=H96fD_kAAAAJ. My FYP RP is currently in process of publishing and a recent paper based on the explainability and robustness of NLP models is also in process of publication. I have successfully won the MediaEval'26 benchmarking competition for the Missing Pieces and Misinformation task for which my write-ups were presented in ICMR'26 Amsterdam this year. My papers of that competition are also in process of being published. You all can verify  …[truncated; pre-cutoff OP]

**New comments:**

- **Arturo Gutiérrez Aguilar (CONTRIBUTOR), LB rank 373** — 2026-11-05T23:04Z
  > Hi, I just sent you a message.
  - **Moez Ur Rehman (CONTRIBUTOR), LB rank 64** — 2026-11-08T10:41Z
    > i'll go through it and let you know soon.
- **Soumyadip_007 (CONTRIBUTOR)** — 2026-11-05T21:46Z
  > Hello , I am willing to join , I sent you a message.
  - **Moez Ur Rehman (CONTRIBUTOR), LB rank 64** — 2026-11-08T10:42Z
    > i'll go through your message and let you know soon.

---

## 747519 — Update on "Kaggle Error" Submissions & Queue Delays

URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/747519  
OP by Dustin [STAFF] (STAFF) on 2026-10-08T22:09Z (before cutoff); new comments 8 (staff 0); older comments omitted 101

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
> 2. **Scoring Submissions that had Queue Timeouts:** We are actively reprocessing all affected submissions from the past few days. If your notebook ran to completion and produced a valid submission file, it is  …[truncated; pre-cutoff OP]

**New comments:**

- **FakeEyes2W (CONTRIBUTOR), LB rank 5234** — 2026-11-11T04:37Z
  > Hello Kaggle Support / competition operations team,
  > 
  > Could you check the current processing state of our submission to Google - The Gemma 4 Developer Agent Competition?
  > FakeEyes2W Submission ID: 58167555 
  > Submitted: 2026-11-09 14:32:43 UTC
  >  Status: PENDING for roughly 38 hours — no public score, no terminal error, totalBytes reported as 0.
  > 
  > Please confirm: is it waiting for L4×4 resources, actively running, or stalled?
  > 
  > What worries me most is what it does to everything else. When I tried to submit a fixed version today, I got:
  > 
  > 400 FAILED_PRECONDITION: Your team already has 1 pending submissions; please wait for one to finish scoring.
  > 
  > So the stuck run is blocking every further submission. With one submission a day and about three weeks left, that's a day of the competition quietly evaporating every time it doesn't clear.
  - **Jak Ma (MASTER), LB rank 1059** — 2026-11-11T04:57Z
    > I also with this.😭
- **nk1009ds (CONTRIBUTOR), LB rank 4731** — 2026-11-11T14:12Z
  > My submission to the Gemma 4 Developer Agent Competition has been pending for over 46 hours. The submissions page shows PENDING, with no score or error message.
  > 
  > * Submission ID: 58169454
  > * Submitted: November 9, 2026 at 16:00 UTC
  > * Description: exp005 | Gemma 4 31B | max output 8192
  > 
  > Could you check whether this submission is still queued, actively scoring, or stuck? If it is stuck, could you let me know whether it can be requeued or whether I should resubmit?
  > 
  > Thank you for your help.
- **Rook86 (CONTRIBUTOR)** — 2026-11-11T13:52Z
  > Submission 58168732 (submitted 2026-11-09 15:22 UTC) has shown "Notebook Running" for over 48 hours. The ZIP (1,035 bytes, agent.yaml / eval_config.yaml / prompts/system.md, no adapter, 5 min / 48 tool calls per task) validates with the official compiler. Because of the one-pending-submission limit I cannot submit anything else. Could you check whether this run is stuck and clear it if so?
- **? (?)** — 2026-11-11T13:46Z
  > 
- **? (?)** — 2026-11-11T06:33Z
  > 
- **? (?)** — 2026-11-09T19:03Z
  > 
- **? (?)** — 2026-11-11T07:14Z
  > 

---

## 744354 — Thinking mode drops the model's thoughts between tool calls (vLLM ignores `reasoning_content`). Will the scoring environment be patched?

URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/744354  
OP by KE WU (EXPERT), LB rank 2420 on 2026-09-29T14:05Z (before cutoff); new comments 1 (staff 0); older comments omitted 7

**Opening post:**

> Hi organizers,
> 
> With thinking on (the scoring server's default), the thought the model writes before a tool call never reaches the prompt of the next step. The model has to re-derive its reasoning at every tool call. Gemma 4's docs say thoughts must be kept inside a tool-calling turn ("thoughts must NOT be removed between the function calls", [prompt formatting guide](https://ai.google.dev/gemma/docs/core/prompt-formatting-gemma4)).
> 
> **Cause.** ADK (`google-adk` 1.36.1, `LiteLlm`) sends the previous thought as `reasoning_content`. vLLM 0.19.1 only reads `reasoning` from incoming messages (`vllm/entrypoints/chat_utils.py`, line 1512: `reasoning = message.get("reasoning")`), so the thought is dropped before the chat template sees it. The Gemma 4 template itself accepts both names. This is a  …[truncated; pre-cutoff OP]

**New comments:**

  - **Lazaros Avramidis (CONTRIBUTOR), LB rank 438** — 2026-11-11T09:23Z
    > Hi Ryan,
    > 
    > Following your earlier update about the `reasoning_content` compatibility fix, we reproduced the issue on November 11 using the latest officially available Gemma 4 Developer Agent wheelhouse (v31, last updated October 12).
    > 
    > We ran a private Kaggle notebook on 4× L4 with the official Gemma 4 31B serving configuration.
    > 
    > Using the same synthetic tool-call history, changing only the incoming assistant reasoning field, we observed:
    > 
    > - `reasoning`: 76 tokens
    > - `reasoning_content`: 61 tokens
    > - Reasoning omitted: 61 tokens
    > 
    > The `reasoning_content` and omitted-reasoning token sequences were identical.
    > 
    > The loaded vLLM 0.19.1 implementation still reads `message.get("reasoning")` in `vllm/entrypoints/chat_utils.py` (line 1512).
    > 
    > Reproduction notebook:
    > https://www.kaggle.com/code/lazarosavramidis/astakos-reasoning-final-d05a1386
    > 
    > Could you clarify whether the managed competition scorer already includes the compatibility fix, and whether an updated public wheelhouse will be provided for parity?
    > 
    > Our existing submission is #58029790 (public score 0.20). We would also appreciate knowing whether resubmitting the unchanged ZIP would be meaningful after the scorer update.
    > 
    > Thank you!

---

## 744272 — Tool results reach the model double-JSON-encoded: a line of code with quotes turns into a wall of backslashes

URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/744272  
OP by Whisper Last (CONTRIBUTOR), LB rank 3366 on 2026-09-29T07:18Z (before cutoff); new comments 1 (staff 0); older comments omitted 7

**Opening post:**

> While reading our local traces (official swegemma 0.2.7 + adk-submission 0.2.11 + the wheelhouse vLLM 0.19.1), we noticed that every tool result reaches the model JSON-encoded **twice**. For code with quotes or backslashes it becomes hard to read. Here is one real `read_file` result, `tabulate.py` lines 140-170.
> 
> **The file:**
> 
> ```python
> LATEX_ESCAPE_RULES = {r"&": r"\&", r"%": r"\%", r"$": r"\$", r"#": r"\#",
>                       r"_": r"\_", r"^": r"\^{}", r"{": r"\{", r"}": r"\}",
>                       r"~": r"\textasciitilde{}", "\\": r"\textbackslash{}",
>                       r"<": r"\ensuremath{<}", r">": r"\ensuremath{>}"}
> ```
> 
> **What Gemma 4 actually sees in the tool message (same four lines):**
> 
> ```
> LATEX_ESCAPE_RULES = {r\\\"&\\\": r\\\"\\\\&\\\", r\\\"%\\\": r\\\"\\\\%\\\", r\\ …[truncated; pre-cutoff OP]

**New comments:**

    - **Mikhil Shetty (CONTRIBUTOR)** — 2026-11-08T15:08Z
      > Thanks for the fix. I can confirm it's in the wheelhouse we run locally (swegemma 0.2.11, adk-submission 0.2.13). When the model escapes both strings, edit_file now repairs both:
      > 
      >   apply_replacement('x = foo("a")\n', 'foo(\\"a\\")', 'foo(\\"b\\")')
      >   -> strategy 'unescaped', new_content 'x = foo("b")\n'
      > 
      > One small case I wanted to flag, in case it's not intended. The repair seems tied to the old_string lookup. If old_string matches exactly but new_string is escaped, the escapes are written into the file as typed:
      > 
      >   apply_replacement('add_cell(column, Text(""))\n', 'Text("")', 'Text(\\"\\")')
      >   -> strategy 'exact', new_content 'add_cell(column, Text(\\"\\"))\n'
      > 
      > I only reproduced this with a constructed call. What I saw in a real trace (rich_3518, Gemma 12B QAT, one level of escaping in the tool results) was the same mistake in text staged through write_file, since our submission replaces edit_file with a skill. The model read Text(\"\") in the read_file output and copied the escapes into the new code. A syntax check caught it, but it cost a retry on a 5-minute budget.
      > 
      > I don't have rates, and I know a blanket unescape of new_string would be risky because \" is legitimate in real code. A cautious option might be to retry only when the result fails to parse (for .py files). A line in the docs saying the fallback covers both strings only when old_string needed it would also help submissions plan around it.
      > 
      > Is the current behavior intended? Happy to share the trace.

---

## 743683 — Rerunning Failed Submissions

URL: https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/743683  
OP by Ryan Holbrook [STAFF] (STAFF) on 2026-09-26T12:01Z (before cutoff); new comments 3 (staff 0); older comments omitted 105

**Opening post:**

> Hi everyone,
> 
> Some submissions since yesterday were failing with `"Your notebook has requested more CPU, GPU or TPU resources than are available."` I believe I've resolved the issue, though please let me know if you're still having issues. I will rerun the affected submissions on Monday so that you won't be losing a submission.

**New comments:**

- **Mr. Mrinmoy Choudhury (CONTRIBUTOR)** — 2026-11-06T11:34Z
  > Hi @ryanholbrook 
  > 
  > My submission to the Gemma 4 Developer Agent Competition has been stuck at "Notebook Running" for over an hour.
  > 
  > Submission: Gemma 4 Developer Agent – Custom Submission – Version 13.
  > 
  > The notebook execution completed successfully in 53.3 seconds. The submission ZIP was generated, validated, and uploaded, but the competition evaluation has not completed.
  > 
  > Could you please check whether my submission is stuck in the L4×4 evaluation queue and advise whether it can be rerun?
  > 
  > Thank you.
- **Tong_Shan (CONTRIBUTOR)** — 2026-11-11T02:53Z
  > Hi @ryanholbrook ,
  > 
  > My Gemma 4 Developer Agent submission #58168380 has been stuck in PENDING / Notebook Running for over 36 hours, with no score or error.
  > 
  > Could you please check whether the submission is stuck and, if so, clear the pending state? If possible, please preserve or rerun the original submission and restore any lost submission opportunity.
  > 
  > Thank you for your help.
- **? (?)** — 2026-11-06T12:09Z
  >

