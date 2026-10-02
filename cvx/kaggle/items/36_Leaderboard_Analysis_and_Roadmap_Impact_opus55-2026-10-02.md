# 01 — Public Leaderboard Analysis (2026-10-02) and Its Impact on the BCF Roadmap

*Prepared 2026-10-02 by Claude Opus 5.5.*

- **Input:** `input/kagglecomp/intel_20261002/gemma-4-developer-agent-publicleaderboard-2026-10-02T21_40_26.csv` (1,410 teams).
- **Reproduce:** `python 2026-10-02_Leaderboard_Analysis/scripts/lb_analysis.py`. The output is saved next to the script; every number below comes from it.
- **Documents reviewed against:**
  - `2026-10-01_Opus55_BCF_Review_and_Static_Analysis/05_Roadmap_and_Checklist_First_Submission.md` ("Report 05")
  - `2026-10-01_BCF_v1_Roadmap/01_Roadmap_Next_Steps.md` ("Roadmap 01")
  - `input/kagglecomp/intel_20260930/03-discussion-board-intel.md` ("forum intel")

---

## 0. Summary

1. **The public split is exactly 58 tasks**, and the displayed score is *truncated*: `score = floor(100·k/58)/100`. One task is worth 1.72 points. This is the only denominator that reproduces the exact set of score values on the board (§1).
2. **The pack has a hard ceiling at 7–9 tasks.** 1,408 of 1,410 teams have solved ≤ 9/58 (0.15). The forum's strongest technical participants (the people who found the platform bugs) sit at 7/58 after 6–10 submissions each (§3).
3. **The 0.15 tier is mostly best-of-k noise.** The leaderboard shows each team's *best* submission. A configuration whose true level is 6–7 tasks reaches 8–9 after 6–9 tries by selection alone (§4).
4. **The leader (14/58 = 0.24, two submissions) is probably a real step change, not luck,** but its true level is probably lower than 14, and one non-skill explanation still has to be ruled out (§5).
5. **The platform improved around Oct 1.** Among teams with a single submission, the zero-score rate fell from 14–20% to 4–6%. Baselines measured before Oct 1, including the "public notebooks 0.05–0.12" figure in Report 05, are stale (§6).
6. **Roadmap impact:** the order of steps in Report 05 holds. What changes is the **ambition, the timing and the measurement rules** (§7). The four biggest changes:
   - submit a canary now instead of waiting for WSL;
   - pull the LoRA / capability go/no-go forward from Oct 22 to about Oct 9;
   - restate every target in tasks out of 58, and put a prize-contention bar at ≈ 14–15/58 true;
   - harden the rules for choosing the final two submissions against best-of-k inflation.

---

## 1. Decoding the score lattice

The board shows only 12 distinct scores. The values 0.02, 0.04, 0.07, 0.09, 0.11, 0.14 and 0.16 never appear, even across 1,410 teams. I searched denominators N = 10…399 under two display rules (rounding and truncation). Exactly one fits: **truncation, N = 58**. This matches the data page, which says there are "about 120 tasks … evenly divided between the public and private splits", so the hidden test set is most likely **116 tasks (58 public + 58 private)**.

| Displayed score | Tasks solved (k/58) | Exact rate | Teams | Cumulative teams (rank reached) |
|---:|---:|---:|---:|---:|
| 0.24 | 14 | 0.2414 | 1 | 1 |
| 0.17 | 10 | 0.1724 | 1 | 2 |
| 0.15 | 9 | 0.1552 | 17 | 19 |
| 0.13 | 8 | 0.1379 | 70 | 89 |
| 0.12 | 7 | 0.1207 | 184 | 273 |
| 0.10 | 6 | 0.1034 | 269 | 542 |
| 0.08 | 5 | 0.0862 | 266 | 808 |
| 0.06 | 4 | 0.0690 | 191 | 999 |
| 0.05 | 3 | 0.0517 | 151 | 1,150 |
| 0.03 | 2 | 0.0345 | 65 | 1,215 |
| 0.01 | 1 | 0.0172 | 63 | 1,278 |
| 0.00 | 0 | 0.0000 | 132 | 1,410 |

**Consequences:**

- There is no score between 0.24 and 0.17, so the leader is 4 tasks clear of #2 and 5 clear of the 0.15 tier.
- Ranks inside a tier are tie-breaks, not skill. Kaggle orders ties by submission time. There are 17 teams at 9, 70 at 8 and 184 at 7.
- Report 05 §3.1 says "LB tasks = round(score × 58)". That gives the right answer at every lattice point, but the table above is the exact inverse. Use it.

---

## 2. Shape of the field

| Statistic | Value |
|---|---|
| Teams | 1,410 (65 multi-member, the rest solo) |
| Median / mean tasks solved | 5 / 4.52 of 58 (0.08) |
| Mode | 6/58 (0.10), 269 teams |
| Teams scoring 0.00 | 132 (9.4%) |
| Top-20 cut-off | 9/58 (0.15) |
| Top-100 cut-off | 7/58 (0.12) |
| Top-273 cut-off | 7/58 (0.12) |
| Teams whose last submission was on Oct 2 | 527 (37% of the field, on day 10 of 70) |
| Submissions per team | median 3, maximum 10 (consistent with 1 per day since Sep 23) |

**Reading:**

- The field is large, young and still growing fast. More than half of all teams last submitted on Oct 1–2.
- 9.4% of teams have a zero on their *best* submission, and 15% of single-submission teams score zero. Harness and platform failure is still a first-order effect in this competition. This supports Report 05's view that the first submission is a robustness instrument.

---

## 3. The ceiling: where the known experts sit

These are the participants named in our 9/30 forum intel. Most of them diagnosed the platform bugs: double-JSON escaping, thinking drop, LoRA zeroing and KV collapse, and the `search_similar_code` blow-up.

| Rank | Participant (forum role) | Tasks /58 | Submissions |
|---:|---|---:|---:|
| 8 | Vivek K N (fastapi gold-fail thread) | 9 | 4 |
| 22 | Alperen ÖZ (pipeline, 0.13 on 9/30) | 8 | 9 |
| 43 | Abdul Muiz (LoRA zeroing repro) | 8 | 6 |
| 90 | Roman Rozen (best public notebook) | 7 | 2 |
| 91 | daoviet (CV/LB anti-correlation) | 7 | 9 |
| 100 | Whisper Last (escaping, zeroing, search blow-up) | 7 | 6 |
| 128 | Carson Rodrigues (LoRA startup) | 7 | 8 |
| 134 | Isaka Tsuyoshi (results thread, CV/LB) | 7 | 10 |
| 192 | Oleksii Zhukov (scoring-rules questions) | 7 | 10 |
| 268 | Adithya Giridharan (KV collapse) | 7 | 8 |
| 319 | 508shuto (Rich-only CV study) | 6 | 7 |
| 326 | JohnParkerson (dead-task audit) | 6 | 6 |

**Interpretation:** the people who understand this platform best have used 6–10 daily slots each and still sit at 7–8 tasks. Two weeks of prompt, skill and budget tuning by skilled teams has not moved the pack's ceiling above about 9/58.

> **This is the most decision-relevant fact in the file.** A careful prompts-and-skills agent like our BCF-Hygiene v1 should expect a *true* level of about 6–8/58. That is top ~100–300, not a prize.

---

## 4. Best-of-k inflation: why the 0.15 tier is mostly noise

The public board shows each team's best public score. Mean tasks solved rises steadily with the number of submissions:

| Submissions | Teams | Mean tasks | Best tasks | Zero % |
|---:|---:|---:|---:|---:|
| 1 | 379 | 3.49 | 9 | 15 |
| 2 | 288 | 3.95 | 14 | 13 |
| 3 | 195 | 4.68 | 9 | 9 |
| 4 | 166 | 4.96 | 9 | 5 |
| 5 | 119 | 5.45 | 9 | 3 |
| 6 | 97 | 5.70 | 8 | 1 |
| 7 | 73 | 5.74 | 9 | 5 |
| 8 | 60 | 5.93 | 9 | 7 |
| 9 | 30 | 6.20 | 10 | 0 |
| 10 | 3 | 7.00 | 7 | 0 |

Part of this rise is real learning. But even a team that never improves gains from taking the maximum of noisy draws.

**The simulation** (fixed 58-task set; a share of tasks are 50/50 "coin flips"; the rest are solved or not deterministically):

| True level (tasks) | Coin-flip share | Best of 1 | Best of 3 | Best of 6 | Best of 9 | 90th percentile, best of 9 |
|---:|---:|---:|---:|---:|---:|---:|
| 6 | 10% | 6.0 | 7.0 | 7.5 | 7.7 | 9 |
| 6 | 20% | 6.0 | 7.4 | 8.2 | 8.5 | 10 |
| 7 | 10% | 7.0 | 8.0 | 8.5 | 8.8 | 10 |
| 7 | 20% | 7.1 | 8.4 | 9.2 | 9.5 | 11 |

So a configuration whose true level is 6–7 tasks lands in the 8–9 tier after 6–9 submissions, and sometimes at 10, by selection alone.

**Consequences:**

1. The 0.13–0.15 tier (87 teams) will **regress on the private split**. Private uses a different 58 tasks and is not maximised over submissions in the same way: each team's two final picks are scored once.
2. **Our own best public score will flatter us by 1–3 tasks** if we pick finals by public maximum.
3. A single run is a weak test. The sampling SD of a rate on 58 tasks is 0.043 at p = 0.12 and 0.053 at p = 0.20. A config that scores 7/58 on public could plausibly score anywhere from 3 to 12 on private.

---

## 5. The leader: 14/58 with two submissions

| Hypothesis | Evidence for | Evidence against | Verdict |
|---|---|---|---|
| **Luck** (pack-level config, lucky draw) | Thousands of team-submissions have been drawn. Binomial P(X ≥ 14) is 0.76% per draw at p = 0.12 | On a *fixed* task set the run-to-run SD is only ≈ 1.7–2.4 tasks (§4), so 7 → 14 is a +3–4 SD event. Nobody else exceeds 10 | **Unlikely** as the whole story |
| **Real step change** (adapter, harness design, test-time search) | Second submission, i.e. little LB hill-climbing. A 4-task gap over a 1,400-team field | Unknown method | **Most likely**. Winner's curse says the true level is probably below 14 (≈ 10–13) |
| **Public-first time front-loading** (spend most of the 12 h on early tasks, which may be the public split) | Task order is fixed and sequential. Whether public tasks come first was an open forum question on 9/30. If the host's planned "overrun → unfinished tasks score 0" fix is now live, front-loading would lift public at private's expense | Not confirmed. Requires both conditions to hold | **Must be ruled out** before we treat 0.24 as the bar |

**Takeaways:**

- A materially better agent seems to be possible on this platform.
- Our planning bar for **prize contention should be ≈ 14–15/58 true (≈ 25%)**. Expect the top 3 on the private board to need roughly 13–17/58.
- That is about **double** the ceiling of the pack (§3).

---

## 6. Platform drift: the scorer changed around Oct 1

Teams with exactly one submission give a clean by-date reading, because their score comes from that day's run.

| Date (single-submission teams) | Teams | Mean tasks | Zero-score % |
|---|---:|---:|---:|
| Sep 25 | 37 | 2.86 | 30 |
| Sep 26 | 18 | 3.33 | 17 |
| Sep 27 | 33 | 3.36 | 15 |
| Sep 28 | 40 | 2.75 | 20 |
| Sep 29 | 42 | 3.69 | 14 |
| Sep 30 | 52 | 3.00 | 15 |
| **Oct 1** | 56 | **4.64** | **4** |
| **Oct 2** | 86 | 3.88 | **6** |

The zero rate dropped by about two-thirds from Oct 1. This is consistent with the host fixes that were "incoming" on 9/30 going live: the thinking-drop patch, the double-JSON escaping fix and the `search_similar_code` output cap. Part of it may also be newcomers forking stronger public notebooks.

The host said existing submissions **will not be re-scored**, so:

- **Pre-Oct-1 LB numbers** (forum baselines, the 0.05–0.12 notebook band, Isaka's CV/LB pairs) describe a different scorer. Do not calibrate against them.
- **Thinking mode** is probably fixed now. That moves the thinking-budget arm (Report 05 §3.4 #3) up in value. It was gated on this bug.

---

## 7. What changes in the roadmap and strategy

Each item names the document and section it amends.

### 7.1 Submit a canary now, not on Oct 6 — **change (Report 05 §4, Roadmap 01 M1)**

- **Why:** submissions are one per day and use-it-or-lose-it. Every team in the top 300 has used 2–10 slots; we have used none. Report 05 puts submission #1 on Oct 6, after WSL, vLLM, the oracle and a paired CV run. Roadmap 01 had already planned a zero-agent canary for M1 (Oct 2).
- **What:** the official sample submission with **no adapters**, `max_time_minutes ≈ 5` and the four `eval_config` fields set. Build and submit it from the Kaggle notebook. It needs **no local environment**.
- **What it buys:**
  - a post-Oct-1 platform baseline (A0) measured on the actual scorer;
  - proof that our packaging and Save-Version → Submit flow works;
  - row 0 of the CV↔LB log.
- **Then:** keep using the daily slot with *informative* submissions while the local lab comes up. See §7.4 for what is worth a slot.

### 7.2 Recalibrate every target in tasks out of 58 — **change (Report 05 §0, §1.5; Roadmap 01 M6/M7)**

| Milestone | Old target | New target (public tasks /58) | Field position it implies |
|---|---|---|---|
| Submission #1 (BCF-Hygiene v1) | 0.07–0.12 | **5–7** (pre-registered band); success = ≥ 5 and no zero | Median to top ~300 |
| M6 v1.1 (Oct 14) | "+3 points on coin-flip tasks" | **≥ 8 true**, from local paired CV, not LB max | Top ~100 equivalent |
| M7 v1.2 (Oct 21) | "H2 passes + paired gain" | **≥ 10 true** | Above the pack ceiling |
| Final (Dec 2) | Not stated | **≥ 14–15 true**, i.e. prize contention | Top 3 |

The gap between M7 and the final is the problem. **Prompts and skills alone are unlikely to close it** (§3). This drives §7.3.

### 7.3 Pull the capability go/no-go forward and start a "step-change" track — **major change (Roadmap 01 §5, Report 05 §4)**

**Current plan:**

- Adapter work is gated on an E1 canary in the week of **Oct 22–28**.
- Mined data (D1) starts Oct 8.
- If the adapter path stays broken, "all effort goes into prompts, skills and prompt evolution".

**Problem:** the leaderboard says that fallback leads to the 7–9 plateau. Waiting until Oct 22 to learn whether the higher-ceiling path even works on the scorer leaves only about 5 weeks for RFT/DPO. RFT/DPO also needs the trajectories and mined tasks, which take weeks to build.

**Changes:**

| # | Change | New date | Why |
|---:|---|---|---|
| a | **LoRA canary (E1) moves to the 2nd or 3rd submission slot.** Use a "loud" adapter (random A and B) plus a long-prompt survival check. It answers whether adapters load, change outputs and avoid the KV collapse | **≈ Oct 8–9** | One slot; the result decides how the next 7 weeks are spent |
| b | **Trajectory logging in training-ready format from the first local run (v0).** Every local run feeds D3 | From M3 (Oct 4+) | Successful trajectories are the scarce input for RFT. Start collecting before the decision |
| c | **Mined task factory (D1) starts in parallel with v1**, on the laptop and AUX 2, which are not on the agent critical path | Oct 5 (was Oct 8) | Data, not prompt tweaks, is what separates teams at the top |
| d | **A test-time-compute arm** inside the 12-h budget: one cheap patch attempt, verify against the whole target module, retry with a different candidate file or strategy on failure | Experiment queue slot #2 | The only higher-ceiling lever that does not depend on the host's LoRA fixes |
| e | **Written go/no-go after the canary:**<br>• adapters work → shift ≥ 50% of MAIN GPU time to RFT on own trajectories;<br>• adapters still broken → test-time search and skills become the main bet, and the paper carries more weight | Oct 10 | Prevents drift |

The gating discipline stays: **no adapter goes into a scored submission until the canary passes.** What changes is *when* we learn that, not *whether* we gate.

### 7.4 Harden the measurement and selection rules — **change (Report 05 §3.3, Roadmap 01 §1 principle 3)**

| Rule | Old | New |
|---|---|---|
| Noise threshold | "LB deltas under ±0.04 (≈ 2 tasks) are noise" | Run-to-run SD on the fixed 58 tasks is ≈ 2 tasks, so a **difference between two single runs needs ≥ 5 tasks (≈ 0.09) before it means anything**. Decide on paired local CV (129 tasks, multiple seeds) |
| Scorer noise | Not measured | Spend **one** slot re-submitting an identical bundle (same hash) early on. It gives a direct scorer run-to-run estimate, and a paper figure |
| Choosing the final two | "Safe hygiene build + best measured improvement" | Keep it, but rank candidates by **local CV mean** plus the **mean** of their public scores, **never the public maximum**. Expect 1–3 tasks of best-of-k inflation in any public maximum (§4) |
| Interpreting rank | Implicit | Rank inside a tier is a tie-break by time; ignore it. Track tasks /58 only |

### 7.5 Fix the 12-hour budget arithmetic — **small change (Report 05 §1.3)**

- **Old:** the budget assumes ≈ 120 tasks.
- **New:** the lattice implies **116 tasks**, so 43,200 s / 116 ≈ 372 s per task including setup.
- **Effect:** about 3.5% more headroom. Keep `max_time_minutes: 5` for submission #1. Revisit 5.3–5.5 only once a scored run reports the real total.
- **Do not front-load time on early tasks.** If public tasks happen to come first, it inflates public and starves private (§5). Use a **uniform per-task cap**; never trade private for public.

### 7.6 Re-baseline against the post-Oct-1 scorer — **change (Report 05 §0, §3.4)**

- Drop the "public notebooks 0.05–0.12, leader 0.17" calibration. Replace it with our own A0 canary (§7.1) and today's field distribution (§2).
- Move the **thinking-budget arm** (0 / 2048 / 4096) from #3 to **#1** in Report 05 §3.4. The thinking patch has probably landed, and nothing measured before Oct 1 says anything about it.

### 7.7 Forum re-sweep before the next decision — **new task**

Our forum intel is from 9/30, before the platform shift in §6. A focused sweep should answer five questions:

1. Has the leader (team *"ТониСтарк собрал реактор в яме"*, user samson8) or anyone at 9–10 posted their approach?
2. Which host fixes are confirmed live: thinking patch, escaping, search cap, LoRA KV sizing, and "overrun → score unfinished as 0"?
3. Has the host answered whether public tasks run first? This tests the front-loading hypothesis in §5.
4. Has any submission with an adapter scored yet?
5. Any new rule clarifications or platform incidents since 9/30?

### 7.8 Paper track: a free, rigorous section — **addition (Roadmap 01 §6)**

The analysis in §1–§6 is itself paper material. It fits *Tasks & Benchmarks* and the user's goal of "real math":

- the decoded lattice (N = 58, truncation);
- the best-of-k inflation model and the public→private regression it predicts;
- the platform-drift natural experiment from single-submission teams;
- the scorer run-to-run estimate from §7.4.

Suggested title: *"How much can a 58-task leaderboard tell you?"* It also motivates why BCF's results are reported with paired CV and confidence intervals rather than LB deltas.

### 7.9 What does **not** change

| Item | Why it still holds |
|---|---|
| Submission #1 is a robustness instrument (Report 05 §0) | 9.4% of the field is at zero; 15% of single-submission teams score zero |
| BCF-Hygiene v1 design: lexical-first localization, whole-module verify, `/tmp`-only scratch, never edit tests | Nothing on the board argues against it; it is the floor everything else builds on |
| One change per experiment, paired, pre-registered | Strengthened by §4 |
| Leave-one-repo-out generalization focus | The hidden set comes from private repos; the private split is the 58 tasks we will never see |
| Adapters gated until the canary passes | The gate stays; only its date moves (§7.3) |
| Paper deadline Nov 12, final Dec 2, team-merge deadline Nov 25 | Unchanged. Merging with a strong solo team before Nov 25 is now a legitimate option to keep open, since 65 teams have already merged |

---

## 8. Revised near-term calendar

| Date | Item | Change vs. Report 05 / Roadmap 01 |
|---|---|---|
| **Oct 2–3** | Canary A0: sample submission, no adapter, failsafe budgets | **New / earlier** (was M1, not done) |
| Oct 3 | Forum re-sweep (§7.7) | **New** |
| Oct 3–4 | WSL2 + vLLM + swegemma; gold oracle; splits frozen | Unchanged |
| Oct 4 | Submission: thinking-budget arm on the A0 bundle (2048 vs A0's setting) | **New** (uses an otherwise idle slot) |
| Oct 5 | Mined-task factory D1 starts on laptop / AUX 2; v0 trajectory logging on | **Earlier** (was Oct 8 / Oct 15) |
| Oct 5–6 | BCF-Hygiene v1 paired vs. A0 on dev-30 → **submission #1 of BCF** | Unchanged; band restated as 5–7/58 |
| Oct 7 | Identical-bundle resubmission (scorer noise) | **New** |
| **Oct 8–9** | **LoRA loud-adapter canary** | **Moved from Oct 22–28** |
| **Oct 10** | Written capability go/no-go (§7.3e) | **New** |
| Oct 10–21 | v1.1 / v1.2 with the test-time-compute arm; RFT if go | Re-scoped |
| Nov 12 | Paper (adds the leaderboard-measurement section) | Content added |
| Dec 2 | Finals chosen by local CV + mean public, never public max | Rule hardened |

---

## 9. Caveats

- The CSV is a single snapshot. Kaggle shows each team's best public score and *last* submission date, not the date of the best score. The per-date analysis in §6 uses single-submission teams for that reason.
- The best-of-k simulation assumes independent 50/50 coin-flip tasks. Real per-task success probabilities vary, so treat the inflation figures as order-of-magnitude.
- The participant mapping in §3 matches display names from the 9/30 forum intel. Display names are not unique identifiers.
- I could not find our own team on the board, since I don't know the Kaggle handle. If you have already submitted, give me the handle and §7.1 and §8 shift accordingly.
