# COMBINED MARKDOWN - combine

_Generated 2026-10-01 04:54:11 | 7 files | folder: D:\stuff\docs\taylor_fv\github\rayrite.github.io\cvx\kaggle\items\combine_

## Contents

1. 00_README.md
2. 01_Model_Council_Report.md
3. 02_Claims_Feasibility_and_Win_Probability.md
4. 03_Master_Options_and_Project_Plans.md
5. 04_Open_Questions_Roundup.md
6. 05_Content_Comparison_Matrix.md
7. 06_QC_Report.md

---

<!-- ====================================================================== -->
<!-- FILE: 00_README.md -->
<!-- ====================================================================== -->

# Model Council 3 — Deliverables (2026-10-01)

Evaluation of 16 contender folders in `input/kagglecomp/model_council/3/contenders/`. All 16 answered the same Kaggle Gemma 4 Developer Agent + BCF whitepaper prompts (`chat_questions.txt`). The work follows the `rdw-model-council` skill, plus the four special sections requested.

| File | What it is |
| --- | --- |
| [01_Model_Council_Report.md](01_Model_Council_Report.md) | Skill report: scope, ranked verdict, matrices with legend and weights, coverage checklist, per-contender evidence, contradictions, SOLID/OSINT review, synthesis |
| [02_Claims_Feasibility_and_Win_Probability.md](02_Claims_Feasibility_and_Win_Probability.md) | **Special 1:** claim-by-claim verdicts (V / V✗ / P / U / I / R / F) for all 16, credibility rubrics, and P(win) for the agent and paper tracks with formulas and worked examples |
| [03_Master_Options_and_Project_Plans.md](03_Master_Options_and_Project_Plans.md) | **Special 2:** 14 composite options, impact–effort matrix, shared Day-0 / LoRA / test foundations, and a full plan per option. Each plan covers data collection, classification, LoRA training, analysis, unit tests with expected results, self-improvement loop, GO/NO-GO and pivots, and hh:mm task tables. Ends with the system-wide loop, schedule, and pivot tree |
| [04_Open_Questions_Roundup.md](04_Open_Questions_Roundup.md) | **Special 3:** 63 de-duplicated open questions with priority, owner gate, and resolution method |
| [05_Content_Comparison_Matrix.md](05_Content_Comparison_Matrix.md) | **Special 4:** checklist matrix of 54 content elements × 16 contenders, plus a per-file inventory of all 69 files |
| [06_QC_Report.md](06_QC_Report.md) | Table QC (115/115 PASS) and the fact-verification log |

## Ranking at a glance

| Rank | Contender | Score |
| ---: | --- | ---: |
| 1 | C3 cc-opus55 | 94.5 |
| 2 | C15 genspark-deepseekV41flash | 90.5 |
| 3 | C9 genspark-gpt61sol | 88.7 |
| 4 | C11 cc-glm53max | 86.7 |
| 5 | C12 cc-grok47 | 86.3 |
| 6 | C13 genspark-mimo26pro | 80.2 |
| 7 | C16 cc-glm53flash | 76.5 |
| 8 | C14 genspark-kimiK3 | 75.2 |
| 9 | C6 gemini38flash-antigrav-b1 | 57.0 |
| 10 | C1 gemini31pro | 55.8 |
| 11 | C10 genspark-nemotron3ultra | 55.7 |
| 12 | C4 gemini31pro-antigrav | 54.2 |
| 13 | C2 gemini38flash | 48.1 |
| 14 | C5 gemini38flash-antigrav | 47.0 |
| 15 | C7 gemini38flash-antigrav-b2 | 46.0 |
| 16 | C8 web-qwen38max | 39.1 |

Intermediate work (notes, extracted dossier text, QC scripts, plan drafts) is in `scratch/council3/`.


---

<!-- ====================================================================== -->
<!-- FILE: 01_Model_Council_Report.md -->
<!-- ====================================================================== -->

# Model Council Report — Council 3: Gemma 4 Developer Agent + BCF Whitepaper Plans

**Date:** 2026-10-01
**Input:** `input/kagglecomp/model_council/3/contenders/` (16 contender folders; every file inside a folder scored as one unit). Reference prompt file: `input/kagglecomp/model_council/3/chat_questions.txt`.
**Files scored:** 68 `.md` files in 16 contender units. **Files excluded:** 1 (`11-cc-glm53max/2026-09-30-2/103-bcf-simulation-httpx-3672.slides.html`, an HTML slide version of a scored markdown file).
**Weight profile:** custom. Development-task weights plus an **Evidence Integrity** category (see §3).

Companion deliverables in this folder:

| File | Contents |
| --- | --- |
| `02_Claims_Feasibility_and_Win_Probability.md` | Special section 1: claim-by-claim critical and feasibility analysis, plan credibility, and win probabilities for both competitions |
| `03_Master_Options_and_Project_Plans.md` | Special section 2: impact-effort analysis, master option list, full project plans, LoRA training, test plans, self-improvement loop, GO/NO-GO gates, hh:mm schedules |
| `04_Open_Questions_Roundup.md` | Special section 3: every open question collected and de-duplicated |
| `05_Content_Comparison_Matrix.md` | Special section 4: checklist-style matrix of what each contender's files contain |
| `06_QC_Report.md` | Markdown table quality check for all deliverables |

---

## 1. Scope and inferred shared task

All 16 contenders answered the same prompt sequence, recorded in `chat_questions.txt`, with small wording differences:

1. **Q1.** Brainstorm a roadmap with a master checklist and milestones for a winning coding-agent "brain" for the Kaggle *Gemma 4 Developer Agent* competition. Leaderboard top three on 2026-09-30: 0.17 / 0.15 / 0.15.
2. **Q2.** Turn that into a master plan: bare-metal Windows 11 setup on Day 0 for the three named machines (RTX 5090 main, RTX 4060 laptop, RTX 3080 desktop), then six one-week sprints to a winning final submission.
3. **Q3a.** Review the competition docs and the Batonic Coding Framework (BCF) material; show how each useful technique would be incorporated and tested; brainstorm the next whitepaper draft.
4. **Q3b.** Supply the math behind "classifying errors into exception classes limits the search space" and for fault interference, fault masking, and chained issues (the dossier's `httpx_6821`). Name the phenomenon and draft whitepaper content.
5. **Q3c.** Survey prior research on fault interference and masking in GitHub-issue solving, and on identifying where interference can occur.

Two contenders (11, 12) and one combined file (16) also answer **extra, later questions**: rank resources from `coderprog_catalog.json`, `0dayprizrak_catalog.json`, and `foss_tools/`. These are outside `chat_questions.txt`. They are listed in the content matrix (file 05) and mined for options (file 03), but they **do not change any core score**.

**Grouping decision:** single ranking. Every contender addresses the same question set. Contenders 2 and 8 answer only Q1/Q2 (contender 2's final answer is the question echoed back with no reply). They are ranked in the same table and penalized on Coverage, not split into a separate group.

**Discovery issues:**

| Issue | File(s) | Handling |
| --- | --- | --- |
| Invalid UTF-8: CESU-8 surrogate-encoded emoji bytes | `8-web-qwen38max/...md`, `10-genspark-nemotron3ultra/...md` | Text is otherwise valid. Decoded with replacement characters and **scored** (only emoji were lost) |
| Exact duplicates inside a contender | `4-gemini31pro-antigrav` afterQ2 ≡ afterQ3 (2 files); `5-gemini38flash-antigrav` afterQ2 ≡ afterQ3 (3 files) | Counted once; the latest snapshot (afterQ3) scored as the contender's final answer |
| Non-markdown file | `11-.../103-bcf-simulation-httpx-3672.slides.html` | Excluded per skill rules; it duplicates `103-...md` |
| Copies in the input folder | `input/kagglecomp/intel_20260930/03-*.md`, `04-*.md`, `03-bcf-simulation-*.md` are byte-identical to contender 11's files | Contender 11 is credited as the originator. Contenders 9, 10, 13, 14, 15 were evidently given this intel later |

**Ground truth used for verification.** Read from `input/kagglecomp/docs/markdown/*`, `HARNESS_README.md`, `bcf/BCF-contestsubmission_dossier_20260928.html`, and the data zip. I re-measured the following myself:

| Fact | Value (verified) |
| --- | --- |
| Training tasks | 129: fastapi 67, rich 48, requests 13, httpx 1 (`httpx_3672` is the only httpx task) |
| Hints / statement length | `hints_text` empty 129/129; median problem statement 418 chars |
| Tracebacks in problem statements | 0/129 contain `Traceback (most recent call last)`; 15/129 name an `*Error/*Exception/*Warning` |
| Files per gold patch | 1 file: 91; 2 files: 19; 3+ files: 19 |
| Graph edge types | **All edges are `calls`** (fastapi 2,430; rich 5,482; requests 1,878; httpx 1,618). Nodes carry only `id`, `name`, `text` (no path, no line numbers). fastapi graph: 72% isolated nodes |
| `httpx_3672` | Gold patch 9,385 chars across **7 files** (sync + async trees); test patch = `tests/test_parsers.py` only; `src/httpx/_server.py:92` is `self._parser.complete` without parentheses; tests call `p.complete()` at lines 70, 116, 318, 557, 594 |
| `httpx_6821` | **Invented** task ID (the dossier itself retracts it, Turn 7) |
| Sample adapters | rank 4, `layers_to_transform: [0]`, targets `q_proj`/`o_proj`; tensor keys `base_model.model.model.language_model.layers.N.self_attn.*`; hidden size 5,376 |
| Scorer | 4× L4, TP=4, `max_model_len` 32,768, `max_loras` 8, `max_lora_rank` 128, <3 GiB zip, 1 submission/day, 2 finals, ~120 hidden tasks from **private** repos, 12 h including setup, declarative YAML only |

---

## 2. Executive verdict and ranked results

**Verdict.** **Contender 3 (cc-opus55)** leads at 94.5. It is the only contender whose measured dataset facts, corrected harness facts, and closed-form math I could re-derive or re-measure without finding an error. A tight cluster follows: **15 (DeepSeek V4.1 Flash) 90.5, 9 (GPT-6.1) 88.7, 11 (GLM-5.3 Max) 86.7, 12 (Grok 4.7) 86.3**.

- 11 vs 12 is a **close call** (0.4 points).
- 9 vs 15 is close-ish (1.8 points).

Each of the top five owns at least one idea the leader lacks:

| Contender | Idea the leader lacks |
| --- | --- |
| 15 | Destructive-adapter canary; allocation rule; KV-capacity reality on a single 5090 |
| 9 | Hard-vs-advisory gate distinction; most current multi-fault-repair literature |
| 11 | The original forum intel on scorer bugs |
| 12 | Ceiling ladder; coverage threshold α > m/n |

At the bottom, **contenders 5 and 7 fabricate "Measured" results with receipt IDs** (0.388 and 45.0% resolution rates). This is the exact failure that caused the user's whitepaper draft 1 to be retired.

| Rank | Response (folder) | Overall | One-sentence rationale |
| ---: | --- | ---: | --- |
| 1 | C3 `3-cc-opus55` | 94.5/100 | Measured, verifiable data profile and harness corrections; correct closed-form math (S(K,f), K·f budget, refine-iff rule); evidence-tagged; full Day-0 runbook and day-by-day sprints. Lacked the forum LoRA-bug intel and assumes a full-time operator. |
| 2 | C15 `15-genspark-deepseekV41flash` | 90.5/100 | Sharpest strategy: zero-census, allocation rule, line-splice edit skill, destructive-adapter canary, greedy-on-observable proof, q^n hypothesis. Minor numeric conflicts; first scored submission only in Sprint 3. |
| 3 | C9 `9-genspark-gpt61sol` | 88.7/100 | Most epistemically careful (hard vs advisory gates, two-stage spec, I(D;Ĉ\|X)=0); best citations including Al-Bataineh ASE 2024/2025. Less concrete Day-0 and build specifics. |
| 4 | C11 `11-cc-glm53max` | 86.7/100 | Originated the decisive forum intel and the verified `httpx_3672` walkthrough; hh:mm Day 0. Asserts nonexistent `called_by` edges and says plug-in MI is biased low. |
| 5 | C12 `12-cc-grok47` | 86.3/100 | Ceiling ladder, OOD holdout, coverage-threshold math, crash-bucketing literature. Mislabels `httpx_3672` as single-file, does not know the paper rubric or the forum bugs, and risks the 12 h limit with a 6-min cap. |
| 6 | C13 `13-genspark-mimo26pro` | 80.2/100 | Strong paper strategy (controlled two-fault benchmark from shared base commits, competing-risks view, broad literature). Scale error (0.17 ≈ 20 tasks) and misapplied Fano. |
| 7 | C16 `16-cc-glm53flash` | 76.5/100 | Broad and well structured (T2 held-out-repo validation, K\* ∝ N law, hitting-set detector). Several operational errors: 2 submissions/day, a 10-min cap relying on an impossible global watchdog, overstated bug fixes. |
| 8 | C14 `14-genspark-kimiK3` | 75.2/100 | Good pillars, canary, granularity optimum, graph-detectable interference signatures. 8-min cap × 120 = 16 h contradicts its own "<12 h" claim; garbled inequality. |
| 9 | C6 `6-gemini38flash-antigrav-b1` | 57.0/100 | Correct MI closed form, but wrong plug-in arithmetic; reuses the retracted rubric; first Kaggle submission on Day 38; invented percentages; `httpx_6821` presented as real. |
| 10 | C1 `1-gemini31pro` | 55.8/100 | Reasonable BCF mapping and classic citations. Thin build plan; `httpx_6821` treated as real; "call graphs are DAGs"; closed-API distillation. |
| 11 | C10 `10-genspark-nemotron3ultra` | 55.7/100 | Good LoRA canary design and an hourly Day 0. `max_time_minutes: 540` "global failsafe", fabricated citations, unlabeled results table. |
| 12 | C4 `4-gemini31pro-antigrav` | 54.2/100 | Honest but thin. Flat-agent pivot and an illustrative label on httpx_6821; almost no numbers or citations. |
| 13 | C2 `2-gemini38flash` | 48.1/100 | Solid compact Q1, then a wrong-hardware Q2 (hallucinated Mac Studio) and an unanswered final turn. No BCF, math, or research. |
| 14 | C5 `5-gemini38flash-antigrav` | 47.0/100 | Rich formatting, but a 45-min/task cap (fatal for a 12 h run), first submission in Sprint 6, and **fabricated "Measured" results**. |
| 15 | C7 `7-gemini38flash-antigrav-b2` | 46.0/100 | Same family as C5. **Fabricated [M] ablation ladder** (45.0%) and the claim that it "proves" generalization. |
| 16 | C8 `8-web-qwen38max` | 39.1/100 | Q1/Q2 only. Infeasible middleware and edit-wrapper ideas; closed-API teacher data. |

---

## 3. Comparison matrix, legend, rubric, and weights

**Weights used.** These are the development-task weights from the skill. OSINT is kept because every plan relies on outside information (Kaggle forum intel, model cards, literature), and handling of that information is scored. I added **Evidence Integrity** because fabricated or invented evidence is the central risk the user's dossier documents. Its weight was taken mostly from Coverage, Depth, Reasoning, and SOLID.

| Category | Weight | What it measures here |
| --- | ---: | --- |
| Coverage | 13% | Checklist items in §4 hit |
| Correctness | 15% | Facts about harness, data, rules, hardware, math, citations |
| Depth | 10% | Mechanisms, specifics, edge cases |
| Reasoning | 10% | Internal consistency; catching contradictions |
| Clarity | 7% | Structure and usability |
| Support | 8% | Measurements, receipts, citations under load-bearing claims |
| Usefulness | 10% | Implementability for this user (solo, 3 PCs, 9 weeks) |
| SOLID | 10% | Quality of the proposed agent/system design (§7) |
| OSINT | 7% | Provenance, corroboration, and uncertainty handling for external info (§7) |
| Evidence Integrity | 10% | No fabricated results, receipts, or task IDs; correct labeling of illustrative content |
| **Total** | **100%** | |

**Rubric:** 0 = absent or critically flawed; 1 = poor; 2 = partial; 3 = adequate; 4 = strong; 5 = excellent. Half-points are used where a response sits between bands. Overall = Σ(weight% × score) / 5.

**Legend:** ✅ 5 Excellent · 🟢 4 Strong · 🟡 3 Adequate · 🟠 2 Partial · 🔴 1 Poor · ❌ 0 Absent / critical. A half-point shows the icon of the lower band (e.g. `🟢 4.5`).

### 3.1 Core quality matrix

| Response | Overall | Coverage | Correctness | Depth | Reasoning | Clarity | Support | Usefulness |
| --- | ---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| C3 cc-opus55 | 94.5 | 🟢 4.5 | 🟢 4.5 | ✅ 5 | ✅ 5 | ✅ 5 | ✅ 5 | 🟢 4.5 |
| C15 deepseekV41flash | 90.5 | 🟢 4.5 | 🟢 4 | ✅ 5 | ✅ 5 | 🟢 4.5 | 🟢 4.5 | ✅ 5 |
| C9 gpt61sol | 88.7 | 🟢 4 | 🟢 4.5 | 🟢 4.5 | ✅ 5 | 🟢 4 | 🟢 4.5 | 🟢 4 |
| C11 cc-glm53max | 86.7 | 🟢 4.5 | 🟡 3.5 | 🟢 4.5 | 🟢 4 | 🟢 4.5 | 🟢 4.5 | ✅ 5 |
| C12 cc-grok47 | 86.3 | 🟢 4 | 🟡 3.5 | ✅ 5 | 🟢 4.5 | 🟢 4.5 | 🟢 4.5 | 🟢 4.5 |
| C13 mimo26pro | 80.2 | 🟢 4 | 🟡 3.5 | 🟢 4.5 | 🟢 4 | 🟢 4 | 🟢 4 | 🟢 4 |
| C16 cc-glm53flash | 76.5 | 🟢 4.5 | 🟡 3 | 🟢 4.5 | 🟡 3.5 | 🟢 4 | 🟡 3.5 | 🟢 4 |
| C14 kimiK3 | 75.2 | 🟢 4 | 🟡 3 | 🟢 4 | 🟢 4 | 🟢 4 | 🟡 3.5 | 🟢 4 |
| C6 gemini38flash-b1 | 57.0 | 🟢 4 | 🟠 2 | 🟡 3.5 | 🟠 2.5 | 🟢 4 | 🟠 2 | 🟠 2.5 |
| C1 gemini31pro | 55.8 | 🟡 3 | 🟠 2.5 | 🟡 3 | 🟡 3 | 🟡 3.5 | 🟡 3 | 🟠 2.5 |
| C10 nemotron3ultra | 55.7 | 🟢 4 | 🟠 2 | 🟡 3.5 | 🟠 2.5 | 🟡 3.5 | 🟠 2 | 🟡 3 |
| C4 gemini31pro-antigrav | 54.2 | 🟡 3 | 🟡 3 | 🟠 2 | 🟡 3 | 🟡 3.5 | 🔴 1.5 | 🟠 2 |
| C2 gemini38flash | 48.1 | 🔴 1.5 | 🟠 2.5 | 🟠 2.5 | 🟡 3 | 🟡 3.5 | 🔴 1.5 | 🟠 2 |
| C5 gemini38flash-antigrav | 47.0 | 🟢 4 | 🔴 1.5 | 🟡 3.5 | 🟠 2 | 🟢 4 | 🔴 1.5 | 🟠 2 |
| C7 gemini38flash-b2 | 46.0 | 🟢 4 | 🔴 1.5 | 🟡 3.5 | 🔴 1.5 | 🟢 4 | 🔴 1.5 | 🟠 2 |
| C8 qwen38max | 39.1 | 🔴 1.5 | 🟠 2 | 🔴 1.5 | 🟠 2.5 | 🟡 3 | 🔴 1 | 🔴 1.5 |

### 3.2 Design, OSINT, and integrity matrix

| Response | SOLID | OSINT | Evidence Integrity | Headline integrity note |
| --- | :---: | :---: | :---: | --- |
| C3 | 🟢 4.5 | 🟢 4.5 | ✅ 5 | M/D/I/H tags; scripts named for every measured number; httpx_6821 labeled hypothetical and symbol-checked against the snapshot |
| C15 | 🟢 4 | 🟢 4.5 | 🟢 4.5 | All propositions tagged [H]/[D]; catches the dossier's internal httpx_6821 contradiction |
| C9 | 🟢 4 | ✅ 5 | ✅ 5 | Separates verified, supplied, and re-test-needed claims; "results sentences must wait for receipts" |
| C11 | 🟢 4 | ✅ 5 | 🟢 4.5 | Original forum research with confidence keys; [V]/[SIM] tags; one unverified "typed edges" claim |
| C12 | 🟢 4.5 | 🟡 3.5 | ✅ 5 | Receipt slots `[R:…]`; quantity-checker build gate; no fabricated numbers |
| C13 | 🟡 3.5 | 🟢 4.5 | 🟢 4.5 | Treats httpx_6821 as "teaching fiction"; flags literature as needing re-check |
| C16 | 🟡 3.5 | 🟢 4 | 🟢 4 | [I] tags present, but overstates host fixes and reuses fictional turn counts as an "illustration" |
| C14 | 🟡 3.5 | 🟢 4 | 🟢 4 | Tags math [D]/[H]; cites the dossier's fictional naive trace as cost evidence |
| C6 | 🟡 3 | 🟠 2 | 🟡 3 | Projections labeled H/D, but invented failure-share percentages and an httpx_6821 trace "as real" |
| C1 | 🟠 2.5 | 🟠 2 | 🟡 3 | httpx_6821 presented as real; cites "NO_PATCH … logged in the dossier runs" (no runs exist) |
| C10 | 🟡 3 | 🟡 3 | 🔴 1.5 | Unlabeled Table 1 (0.08 / 0.15 / 0.31) presented as a 3-seed result; invented citations |
| C4 | 🟡 3 | 🔴 1.5 | 🟢 4 | Honest labeling; little evidence of any kind |
| C2 | 🟡 3 | 🔴 1 | 🟡 3.5 | No fabrication; hallucinated hardware (Mac Studio M3 Ultra) |
| C5 | 🟡 3 | 🔴 1.5 | ❌ 0.5 | **Fabricated** `0.388 (51/129)` tagged **M** with receipt IDs; "62% token reduction (M)" |
| C7 | 🟡 3 | 🔴 1.5 | ❌ 0.5 | **Fabricated** ablation ladder `27/60 = 45.0%` tagged **[M]**; held-out "40.6%… proves generalization" |
| C8 | 🟠 2 | 🔴 1 | 🟡 3.5 | No fabrication; infeasible mechanisms |

**Injection / integrity scan:** no contender file contains instructions aimed at the reviewer. The integrity failures above are **fabricated evidence**, scored under Evidence Integrity, with the echo noted under Correctness.

---

## 4. Coverage checklist across responses

E = explicit requirement; I = inferred. Y = yes, P = partial, N = no.

| # | Checklist item | Type |
| --- | --- | :---: |
| 1 | Q1 roadmap with master checklist and milestones | E |
| 2 | Day-0 bare-metal Windows 11 setup for the 3 named machines | E |
| 3 | Six one-week sprints to a final submission | E |
| 4 | BCF: highlight useful areas | E |
| 5 | BCF: how each technique is incorporated and tested | E |
| 6 | Whitepaper next-draft brainstorm | E |
| 7 | Name the math phenomena in the user's statement | E |
| 8 | Math for classification / number / fidelity | E |
| 9 | Math for interference, masking, chained issues | E |
| 10 | Whitepaper-ready content | E |
| 11 | Prior research (incl. GitHub-issue agents) and relevance | E |
| 12 | Identifying where interference can occur in a codebase | E |
| 13 | Markdown tables quality-checked | E |
| 14 | Harness-constraint fidelity (budget math, declarative limits, tool semantics) | I |
| 15 | `httpx_6821` handled as invented (no fabricated evidence) | I |
| 16 | Scorer-risk gating (LoRA canary, GO/NO-GO, overrun) | I |

| # | C1 | C2 | C3 | C4 | C5 | C6 | C7 | C8 |
| --- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| 1 | P | Y | Y | P | Y | Y | Y | Y |
| 2 | P | N | Y | P | Y | Y | Y | P |
| 3 | P | P | Y | P | Y | Y | Y | Y |
| 4 | Y | N | Y | Y | Y | Y | Y | N |
| 5 | Y | N | Y | Y | Y | Y | Y | N |
| 6 | Y | N | Y | Y | Y | Y | Y | N |
| 7 | Y | N | Y | P | Y | Y | Y | N |
| 8 | Y | N | Y | P | Y | Y | Y | N |
| 9 | Y | N | Y | P | Y | Y | Y | N |
| 10 | Y | N | Y | P | Y | Y | Y | N |
| 11 | Y | N | Y | P | Y | Y | Y | N |
| 12 | P | N | Y | N | Y | P | P | N |
| 13 | N | N | Y | N | P | N | N | N |
| 14 | N | P | Y | P | N | N | N | N |
| 15 | N | N | Y | Y | N | N | N | N |
| 16 | N | N | P | N | P | P | P | N |

| # | C9 | C10 | C11 | C12 | C13 | C14 | C15 | C16 |
| --- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| 1 | Y | Y | Y | Y | Y | Y | Y | Y |
| 2 | P | Y | Y | Y | P | Y | Y | Y |
| 3 | Y | Y | Y | Y | Y | Y | Y | Y |
| 4 | Y | Y | Y | Y | Y | Y | Y | Y |
| 5 | Y | Y | Y | Y | Y | Y | Y | Y |
| 6 | Y | Y | Y | P | Y | Y | Y | Y |
| 7 | Y | Y | Y | Y | Y | Y | Y | Y |
| 8 | Y | Y | Y | Y | Y | Y | Y | Y |
| 9 | Y | Y | Y | Y | Y | Y | Y | Y |
| 10 | Y | Y | Y | Y | Y | Y | Y | Y |
| 11 | Y | Y | Y | Y | Y | Y | Y | Y |
| 12 | Y | N | Y | Y | P | Y | Y | Y |
| 13 | N | N | Y | N | N | N | N | N |
| 14 | Y | N | P | P | P | P | Y | P |
| 15 | Y | N | Y | Y | Y | Y | Y | Y |
| 16 | Y | Y | Y | P | Y | Y | Y | P |

---

## 5. Per-response strengths, weaknesses, and evidence

### C3 `3-cc-opus55` — 94.5/100

**Strengths**

- Measured data profile, all re-verified by me. `01_Roadmap_and_Master_Checklist.md` §2.3: "fastapi 67, rich 48, requests 13, httpx 1", "Hints: Empty for 100%", "1 file in 71% (91)".
- 18 corrections to the BCF material, each verified. Examples from `01_BCF_Review...md` §3: C4 "Every edge in the released graphs has type `calls`"; C5 nodes carry only `id`, `name`, `text`; C8 fastapi "3,061 isolated nodes (72%)"; C11 the httpx_6821 symbols "do not exist" in the `httpx_3672` snapshot; C12 "0 of 129 issues contain `Traceback`".
- Closed-form math, re-derived and correct. `02_BCF_Fault_Class_Math...md` §B5: S(K,f) ≈ 1/(1/K + 1 − f), budgeted success × K·f, refinement condition 1/K − 1/K′ > f − f′, "reorder, never prune". §B6 gives the Miller–Madow bias (≈1.2 bits for fastapi; correctly says the plug-in estimate is biased **upward**).
- Pilot evidence on real data (§D): class-conditioned priors *worsened* leave-one-out localization (mean rank 5.84 → 6.57). This is a falsification the user needs before writing the paper.
- Prior research with H/M confidence ratings and a correct core set (`03_Prior_Research...md` §3): Debroy & Wong ISSRE 2009, DiGiuseppe & Jones ISSTA/ICSM 2011, BARINEL, PIE/RIPR, coincidental correctness, higher-order mutants, GDE. Plus an 11-row Python interference-pattern catalogue (§5.2).
- Engineering: hourly Day-0 timeline for 3 machines, BIOS table (iGPU drives the display so all 32 GB VRAM stays free), split design (LOCKBOX / DEV / DEV-FAST / PSEUDO-PRIVATE), paired-statistics decision rules, DG1–DG6 kill criteria, and a table-QC report.

**Weaknesses**

- Written before the forum intel existed, so it never plans a scorer canary for LoRA zeroing or KV collapse. DG3/DG4 only check local loadability.
- Assumes 32k context fits locally on the 5090. Contender 15's KV arithmetic suggests ~6.5k tokens at bf16 KV.
- Assumes a full-time operator (08:00–20:00 daily). LB targets (0.30 LOCKBOX) are ambitious.
- No hh:mm durations beyond Day 0.

**Injection / integrity:** none.

### C15 `15-genspark-deepseekV41flash` — 90.5/100

**Strengths**

- Correct LB arithmetic (Part A §A1: "0.17 ≈ 10 passes", "30-way tie at 0.13").
- Allocation rule with correct calculus (§A2: stop where p′(c)/p(c) = 1/(c+o)) and an immediate `max_time_minutes: 5`.
- **Line-splice edit skill** that sidesteps double-JSON escaping (H1).
- **Destructive-adapter canary** (Part B Sprint 4): "a decisive 1-bit test… immune to variance". If a deliberately destructive adapter does not collapse the score, the scorer is not applying adapters.
- KV reality: "984 kB/token… ~6.5k tokens" on a 5090; fp8 KV raises this to ~13k.
- Two Python environments (serving 3.12 vs sandbox 3.13).
- Math (Task 2): masking as oracle non-identifiability (Prop 3); **greedy-on-observable is correct for pure masking chains** (Prop 4, proof sketch valid); k\* = e^{α0/2β} (correct minimizer); q^n conjunctive-oracle hypothesis tagged [H].
- Catches the dossier's internal contradiction (§1.4: dead code yet "fixed Bug 2 on turn 7").
- The most current literature: Al-Bataineh 2024/2025, FLITSR, An et al. 95.4% (verified: 311/326 Defects4J versions), Nashid hunk divergence, Herzig 33.8%.

**Weaknesses**

- Says weights are "23.3 GB", which conflicts with the README's ~16–18 GB.
- First scored submission waits until Sprint 3.
- "Enforce… in the orchestrator, not the prompt" assumes a controller the declarative harness does not provide.
- "Halving search effort requires pruning by a square root" is muddled.
- The 10-01 "intel delta" (D1–D6) cannot be verified.

**Category notes:** Correctness 4. No fatal errors, but several unverifiable figures.

### C9 `9-genspark-gpt61sol` — 88.7/100

**Strengths**

- Two-candidate strategy (A no-adapter, B gated LoRA) with three **mandatory adapter gates**: activation, context survival, learned improvement (§17).
- "32+10+8GB… is not a 50GB accelerator"; "32K-context inference is not assumed to fit."
- Design contradictions flagged (Task 1 §2):
  - "Spec before edits is useful; exact root cause before reading code is dangerous" → two-stage spec.
  - "A skill script is not automatically a non-bypassable gate."
  - The strictly-increasing-pass rule rejects valid partial repairs.
  - `write_file("/tmp/…")` is not valid, because the tool writes under `/workspace`.
- Math: the routing break-even inequality (correct algebra), plus **I(D;Ĉ\|X)=0 when Ĉ=f(X)**, which correctly reframes BCF's value as computational organization.
- Best verified references: Al-Bataineh ASE 2025 DOI `10.1109/ASE63991.2025.00319` (verified by me); DiGiuseppe & Jones ICSM 2011 ">65,000 multi-fault versions" (verified).

**Weaknesses**

- Day 0 is a checklist with few commands and no clock times.
- Plan gates outnumber build instructions, so a solo user still has to design skills and prompts.
- No table QC.
- Verbose hedging dilutes action.

### C11 `11-cc-glm53max` — 86.7/100

**Strengths**

- **Originated the forum intel** (`03-discussion-board-intel.md`): LoRA zeroing, KV collapse 46k→7.6k, double-JSON escaping (22% / 62% / 0%), thinking-drop, `search_similar_code` blow-up, the 12-task dead list, CV/LB anti-correlation. Five other contenders depend on it.
- Day 0 with clock slots 0:00–5:00 (`02-master-plan...md` §2.1).
- First LB submission on Oct 3.
- `103-bcf-simulation-httpx-3672.md`: every [V] claim checked by me is correct (test lines, `_server.py:92` missing parens, 9,385-char 7-file gold patch).
- 33 DOI-listed citations, including ATPG fault dominance (Pomeranz & Reddy 2005), which no other contender has.

**Weaknesses**

- `101-...md` §2.1 claims graphs have "typed edges incl. `calls`/`called_by`" and builds a dual-query `called_by` doctrine on it. **Verified false**: only `calls` exists.
- `102-...md` §9 says "plug-in MI estimator biased low". It is biased **high**, as C3 states correctly.
- "Join the official Discord (host patches land there first)" contradicts its own intel that staff do not monitor Discord.
- The `write_spec` tool and "orchestrator code" gates are infeasible as stated.

### C12 `12-cc-grok47` — 86.3/100

**Strengths**

- **Ceiling ladder** (gold replay → file oracle → symbol oracle → blind; `01-roadmap...md` §9.2). It decides whether to invest in localization or in literal repair.
- OOD holdout = all `requests` + `httpx` tasks.
- Measured train-set facts (match mine).
- `search_similar_code` correctly described as key/suffix lookup.
- **Coverage threshold** (`04-...md` §2): C(m,α) = (m+1)/2 + (1−α)n/2, so a class helps iff α > m/n. Re-derived: correct, and equivalent to C3's f > 1/K.
- Splits "fidelity" into observational β vs causal coverage α.
- Residual-failure set rule to tell unmasking from regression.
- Unique crash-bucketing literature (ReBucket, CrashLocator, BugLocator) and correct DOIs (Debroy & Wong 10.1109/ISSRE.2009.14; MSeer Gao & Wong TSE 2019).

**Weaknesses**

- "`httpx_3672` is a single-file rename" (`03-...md` §1; `04-...md` §4.2). **Verified false**: 7 files.
- `get_code_neighbors(..., called_by, depth=2)` uses parameters that do not exist.
- No forum intel, so no LoRA scorer canary.
- Paper rubric and 3,000-word cap "stay unstated".
- Initial 6-min cap × ~120 tasks ≈ the whole 12 h before setup.
- Targets up to 0.42 are aggressive.

### C13 `13-genspark-mimo26pro` — 80.2/100

**Strengths**

- Milestones with a "gate if missed" column.
- GAPs closed vs conflicts table.
- Notes that 129 task files vs 127 commit files implies **two task pairs share a base commit**, usable as two-fault benchmark seeds.
- Competing-risks / censoring view of masking.
- Chain manifestation product Π p_i.
- Broad literature: Al-Bataineh trio, CIT masking, BayesFLo, ChainSWE (verified real: arXiv 2607.02606).

**Weaknesses**

- Part 0: "one task ≈ 0.83 points… 0.17 ≈ 20 tasks". **Wrong**: the public LB uses ≈58–60 tasks.
- `timeout_seconds: 300 # per-task wall clock`. It is per command.
- Fano's inequality applied with class error ε as if it were root-cause error.
- Reiter title wrong ("…Founded in Causality").

### C16 `16-cc-glm53flash` — 76.5/100

**Strengths**

- Three-tier validation (T1 public / T2 held-out-repo mined / T3 Kaggle).
- Own paper-track scrape (rubric, organizer examples for the Resource prize).
- K\* = 4a²N/b², re-derived correct.
- Static compound-issue detector via hitting sets.
- Experiments E4/E6 are cheap.

**Weaknesses**

- "Submissions: 2/day max" contradicts the rules (1/day) and its own table.
- `max_time_minutes: 10` (120×10 = 20 h) relies on a "10.5 h global watchdog" skill. Skills only see per-task `get_status`, so this is infeasible.
- Says "thinking patched" and "zeroing fixed via v25", which the intel contradicts.
- The `httpx_3672` simulation was built without `tasks.jsonl` and claims the missing-parens line "raises TypeError". It is a silent no-op.
- Installs stock `vllm`, which cannot serve Gemma 4 LoRA.

### C14 `14-genspark-kimiK3` — 75.2/100

**Strengths**

- ROI-ordered pillars.
- Day-0 verification matrix in 2-hour blocks.
- A5 amendment: a "spec-aware V2" for test asymmetry.
- Miscalibration inequality (final form correct).
- Granularity optimum α(K) ≈ 1 − ε0 − c√(K/n).
- Graph-detectable interference signatures, including sync/async twins via embedding cosine ≈ 1.

**Weaknesses**

- "0.17 ≈ 20 of ~120" (wrong scale).
- `max_time_minutes ≈ 8` with "120 tasks × cap < 12 h": 8 × 120 = 16 h.
- Garbled inequality line with a placeholder "·0/…".
- "Each bit ≈ one saved inspection" (bits halve the search; they do not subtract).
- Fallback playbooks keyed to fastapi/rich/requests/httpx contradict its own private-repo rule.

### C6 `6-gemini38flash-antigrav-b1` — 57.0/100

**Strengths**

- Correctly derived closed form I(X;C) = F log K + (1−F) log(K/(K−1)) − H₂(F) (`03_...md` §2.3).
- Day-level plan; uses `python-exceptions.md`.
- Synthetic compound tasks on Day 25.

**Weaknesses**

- Plug-in K=160, F=0.88 gives ≈5.92 bits (N_eff ≈ 82), not "6.42 bits… ≤35".
- R-04: "max_time_minutes: 15 … guaranteeing… < 8 hours" (actually 30 h).
- `scripts/evaluate.py --reference-check` with invented expected output.
- First Kaggle submission on Day 38.
- Uses the dossier's **retracted** rubric ("Technical Soundness").
- httpx_6821 turn trace presented as a real "Task Problem Statement".
- "MSeer: Abreu ISSRE 2009" (it is Gao & Wong TSE 2019).

### C1 `1-gemini31pro` — 55.8/100

**Strengths**

- Concise BCF→sprint mapping with tests.
- Four paper ideas.
- Correct classic citations: Tarantula, Barinel 2009, Angelix, Hercules.

**Weaknesses**

- Thin Q1/Q2: no commands, no budgets.
- "Generate synthetic trajectory data… using Claude Code or GPT-4o" carries provider ToS risk.
- "Because execution flow… are acyclic in static AST dependency call graphs, G_F is a DAG". False: call graphs have cycles.
- httpx_6821 faults described as real.
- "over 85% of APR tools" is unsupported.

### C10 `10-genspark-nemotron3ultra` — 55.7/100

**Strengths**

- Day-3 LoRA smoke test: stock vs wheelhouse vLLM, zeroing log signature, loud adapter, 10k-token KV test.
- Hourly Day 0.
- Estimates human hours per day (only contender to do so).

**Weaknesses**

- `max_time_minutes=540` "(9 h) failsafe". It is per task, so it gives no protection.
- CUDA 12.6 / driver 560 for an RTX 5090. Blackwell needs CUDA 12.8+.
- QLoRA "--max_len 32768… 30 GB < 32 GB" is infeasible.
- RL reward "+0.1 if edit_file called ≥3 times" invites reward hacking.
- Masking "Definition 2" is inverted.
- Unlabeled results Table 1 (0.08 / 0.15 / 0.31).
- Citations "Pearl et al. (2017) ISSTA" and "Le et al. (2023) SWE-bench" are fabricated or misattributed.

### C4 `4-gemini31pro-antigrav` — 54.2/100

**Strengths:** adopts the flat agent as primary; labels httpx_6821 "illustrative/pedagogical"; mentions FLITSR.

**Weaknesses:**

- No commands, budgets, or dated milestones.
- Math stops at Bayes' rule and "zeroes out the probability" (pruning).
- Prior research has no years or venues.

### C2 `2-gemini38flash` — 48.1/100

**Strengths:** sensible 6–8-min per-task budget math; CRLF/`dos2unix` gotcha; 30% replay-buffer advice for LoRA.

**Weaknesses:**

- Q2 targets an RTX 3080 and a "Mac Studio M3 Ultra (512GB)" the user does not own.
- The final turn with the correct hardware is the question echoed back.
- No BCF, math, or research.

### C5 `5-gemini38flash-antigrav` — 47.0/100

**Strengths:** detailed BCF-Spec JSON schema; G5 "unmasking manifest" exemption idea; good formatting.

**Weaknesses:**

- `eval_config` `max_time_minutes: 45.0`, called "full competition maximums". 120 × 45 min is far beyond 12 h.
- "Initial Kaggle Platform Submission" only in Sprint 6.
- `04_...md` abstract "achieves a **0.388 resolution rate** (**M**)", plus a table with Receipt IDs `R-BCF-FULL`. **No run exists.**
- Invented "empirical post-mortem" percentages.
- "Zheng… (ICSE 2006)" (actually ICML 2006).

**Integrity:** fabricated measured evidence. This is the dossier's draft-1 failure, repeated.

### C7 `7-gemini38flash-antigrav-b2` — 46.0/100

**Strengths:** Docker CE + NVIDIA toolkit runbook; day-level plan.

**Weaknesses:**

- `04_...md` §5.2 "Measured Results on 60 Dev Tasks" with `[M]` receipts and "Held-Out 28/69 (40.6%)… Proves… generalize". Fabricated.
- "Across 700+ competition submissions, naive agents fail on httpx_6821". The task ID is invented.
- Build path references a different repo (`101-Kaggle_gemini`).
- First Kaggle submission on Day 39.

### C8 `8-web-qwen38max` — 39.1/100

**Strengths:** "AST Graph Monopoly" intuition; pre-flight `old_string` check idea.

**Weaknesses:**

- Q1/Q2 only.
- "Custom Python middleware that intercepts `run_command` outputs" and a wrapper around `edit_file` "without consuming a sandbox tool call" are both impossible under declarative submissions.
- Distillation from Gemini 1.5 Pro / O1 / Claude 3.5.

---

## 6. Cross-response contradictions and claims needing verification

| Topic | Responses | Status |
| --- | --- | --- |
| Graph edge types include `called_by` / depth params | C11 (101/102), C12 (03/04), C16 sim, C5/C6/C7 graph protocols say yes; C3 says only `calls` | **Verified error** in the former; C3 correct (all 11,408 edges in 4 graphs are `calls`) |
| `httpx_3672` scope | C11: 7 files; C12: "single-file rename"; C16: "8 files" (upstream PR incl. tests) | **Verified**: 7 source files in the gold patch; C12 wrong; C16 counts the PR, not the task |
| Missing-parens effect at `_server.py:92` | C11: silent no-op; C16: "raises TypeError" | Code reads `self._parser.complete` (attribute access): a **no-op**. C16 wrong |
| Public LB size | C3/C11/C12/C15: ~58–60 tasks (0.17 ≈ 10); C13/C14: ≈120 (0.17 ≈ 20) | C13/C14 wrong (intel: public = 58 tasks; Data page: test split 50/50) |
| Submissions per day | Rules: 1/day; C16: "2/day max" | **Verified error** in C16 |
| Per-task cap | C5/C7: 45 min; C10: 540 "global"; C16: 10; C6: 15 "<8 h"; C14: 8 "<12 h"; C3: 4.0; C15/C13: 5; C11: 5.5; C12: 6 | Caps × 120 must be < 12 h minus setup. **C5, C6, C7, C10, C14, C16 violate it**; C12 is borderline |
| Plug-in MI bias direction | C3: upward (Miller–Madow); C11: "biased low" | C11 wrong (plug-in MI is biased upward with sparse cells) |
| Local 32k context on 5090 | C3/C5/C6/C11/C12: fits (≈14 GB KV); C9: "not assumed"; C14/C15: use 16k / fp8 | **Suspected error** in the former. Intel gives ~246 kB/token/GPU at TP4 (≈1 MB/token total). Must be measured on Day 0 |
| Weight footprint | README: ~16–18 GB; C15: 23.3 GB | Unverifiable here (may include the vision tower/embeddings). Measure |
| LoRA zeroing / thinking-drop fixed | C16: fixed; C11/C13/C15 intel: v25 repro still shows no effect; thinking patch "incoming" | Unverifiable. Treat as **not fixed** until a scorer canary passes |
| Paper rubric | C3/C9/C11/C13/C14/C15/C16: Novelty/Quality/Relevance/Verifiability/Clarity, 3,000 words; C6/C7: "Technical Soundness…" | C6/C7 reuse the rubric the dossier **retracted** |
| DiGiuseppe & Jones scale | C9: ICSM 2011 >65,000 versions; C12: EMSE 2015 >72,000; C13: EMSE "13,000+" | ICSM 65,000 **verified**. EMSE count unverified; C13's 13,000 suspect |
| Debroy & Wong interference rate | C12: independence 33.12% (interference ≈ 66.88%) | Consistent with the survey's "67%" (**plausible-verified**) |
| Al-Bataineh multi-fault APR (ASE 2024 / ASE 2025 / ICSME 2025) | C9, C13, C15 | ASE 2025 paper **verified** (DOI 10.1109/ASE63991.2025.00319); ASE 2024 DOI 10.1145/3691620.3695287 seen in search results |
| ChainSWE | C13, C14 | **Verified** (arXiv 2607.02606: 100 chains, 304 instances, up to 70% drop) |
| OpenAI retired SWE-bench Verified (Feb 2026, 59.4%) | C5, C10, C13, C14, C15, C16 | **Verified** (Feb 23, 2026; 59.4% of 138 audited failures). Note: one 2026 source says OpenAI later withdrew its SWE-bench Pro recommendation (unverified; see Open Questions) |
| An et al. 95.4% Defects4J multi-fault | C15 | **Verified** (311/326 versions; SSBSE 2021) |
| "Pearl et al. 2017 ISSTA causal FL"; "Le et al. 2023 SWE-bench"; "MSeer Abreu ISSRE 2009" | C10, C6 | **Suspected fabrication / misattribution** (causal FL: Baah, Podgurski & Harrold ISSTA 2010; SWE-bench: Jimenez et al.; MSeer: Gao & Wong TSE 2019) |
| Results "measured" for BCF | C5 (0.388), C7 (45.0%), C10 (0.31) | **Fabricated**: the dossier states zero BCF components have run |

Agreement among contenders is not treated as proof. The "14 GB KV fits 32k" claim is repeated by five contenders and is the one most likely to be wrong.

---

## 7. Development design review (SOLID and OSINT)

The shared task proposes a software system (an ADK agent tree plus a dev lab) and depends on external information (forum intel, literature). Both reviews apply.

### SOLID

| Principle | What good looks like here | Pass | Partial | Fail |
| --- | --- | --- | --- | --- |
| S Single responsibility | Read-only localizer separate from editor; skills each do one thing (locate, outline, run tests, guard patch) | C3, C9, C11, C12, C15 | C13, C14, C16, C2, C4, C6 | C1 (3 LoRA roles with gates "blocking" tools), C8 |
| O Open/closed | New skills, adapters, or class templates added without rewriting the root prompt (progressive disclosure, skill registry) | C3, C12, C15, C11 | C9, C13, C14, C16, C5, C6, C7 | C8 |
| L Substitution | Candidate A (no adapter) and B (adapter) interchangeable behind the same YAML; topology A/B swappable | C3, C9, C12, C15, C11, C13 | C14, C16 | C1, C2, C5, C7, C8 (designs assume adapters always present or work) |
| I Interface segregation | Tool scoping per agent (localizer has no edit or `submit` tools) | C3, C12, C9, C11 | C2, C13, C14, C15, C16, C4, C5, C6, C7 | C8 |
| D Dependency inversion | Depend on the harness contract (probe first) rather than assumed APIs (`write_spec`, orchestrator hooks, `called_by`) | C3, C9, C12 (except `called_by`) | C11, C13, C15, C16, C14 | C5, C6, C7, C10, C8 (invent tools/CLIs/middleware) |

Evidence:

- C3 `01_BCF...md` C13: "Submissions are declarative YAML… Enforcement is possible only through **topology and tool scoping**."
- C9 Task 1 §2B: "A skill script is not automatically a non-bypassable gate."
- C12 `01-...md` §8.2: "The localizer has no `edit_file`… It cannot dirty the tree."
- Failures: C5 `02_...md` §3 "BCF forces spec generation via structured tool arguments (`write_spec`)"; C6 Day 9 "file read/write tools return an error if called before a valid BCF-Spec exists"; C8 "custom Python middleware".

### OSINT

| Principle | C3 | C9 | C11 | C12 | C13 | C14 | C15 | C16 | C1/C4/C5/C6/C7/C10 | C2/C8 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Provenance | Pass | Pass | Pass | Pass | Pass | Partial | Pass | Pass | Fail/Partial | Fail |
| Corroboration | Partial (repo-only scope) | Pass | Pass (host vs repro tagged) | Partial | Partial | Partial | Pass | Partial (overstated fixes) | Fail | Fail |
| Transparency | Pass | Pass | Pass | Pass | Pass | Pass | Pass | Pass | Partial | Partial |
| Lawful / ethical collection | Pass (no closed-API teacher) | Pass (license checks) | Pass (logged-out, rate-limited scrape) | Partial (API teacher) | Pass | Pass | Pass | Partial (frontier API teacher) | Partial/Fail (C1, C8 closed-API distillation) | Fail |
| Uncertainty handling | Pass (H/M ratings) | Pass | Pass (confidence key) | Pass | Pass | Pass | Pass | Partial | Fail (C5, C7, C10 present fabricated certainty) | Fail |

---

## 8. Priority-ordered gaps and recommended synthesis

1. **What the leader (C3) still misses.**
   - Scorer-side LoRA reality: zeroing and KV collapse need a C15-style destructive or loud canary before any adapter submission.
   - Local KV capacity: measure on Day 0; plan for 16k + fp8 KV locally.
   - The forum intel overall (C11).
   - Operator-hours realism for a solo developer (see file 03 hh:mm plans).
2. **Ideas to merge in.**

   | From | Idea |
   | --- | --- |
   | C15 | Zero-census; allocation rule; line-splice edit skill; destructive-adapter canary; greedy-on-observable proposition; q^n hypothesis |
   | C12 | Ceiling ladder; OOD holdout (requests+httpx); coverage threshold α > m/n with observational vs causal fidelity; residual-failure set rule |
   | C9 | Hard vs advisory gate labeling; two-stage (intake → grounded) spec; Al-Bataineh citations; I(D;Ĉ\|X)=0 caveat |
   | C11 | Quirks Q1–Q6 doctrine; httpx_3672 real-data worked example; ATPG dominance citation |
   | C13 | Shared-base-commit two-fault benchmark; competing-risks framing |
   | C14 | Sync/async twin detection via embedding cosine |
   | C16 | T2 held-out-repo mining; K\* ∝ N law; hitting-set compound detector |

3. **Verify before relying.**
   - Local KV capacity and weight footprint.
   - Whether skill scripts can read graphs or write under `/tmp`.
   - The `read_file` line-range bug.
   - Host fix status (escaping, thinking, LoRA, 12 h overrun).
   - Whether public and private tasks are interleaved in the run order.
   - Every citation's venue and year.
   - The SWE-bench Pro status.
   - The ChainSWE relevance claim.
4. **Recommended synthesis outline.**
   - **Agent:** a flat root coder with a read-only localizer AgentTool, 4–5 stdlib skills (harvest_symbols, locate/outline, run_tests, patch_guard, line-splice editor), early-edit rule, 5-min cap, and thinking budget swept.
   - **Training:** gated canary → rejection-sampling SFT LoRA (r16–32) on self-generated verified trajectories plus mined/synthetic tasks.
   - **Paper:** C3's "Search, Signal, and Interference" (P2) enriched with C12's coverage threshold, C15's greedy-on-observable result and q^n test, and a real interference atlas from gold-hunk subsets.

   File 03 turns this into an option-by-option project plan.


---

<!-- ====================================================================== -->
<!-- FILE: 02_Claims_Feasibility_and_Win_Probability.md -->
<!-- ====================================================================== -->

# Special Section 1 — Critical and Feasibility Analysis of Every Contender's Claims, Plan Credibility, and Win Probability

**Date:** 2026-10-01 · Companion to `01_Model_Council_Report.md`

This file answers three questions for each of the 16 contenders:

1. Are its load-bearing claims true and feasible under this competition's rules?
2. How credible is its whole plan?
3. If the user executed that plan, what is the probability of a prize in the **agent (leaderboard) competition** and in the **whitepaper (paper-track) competition**?

---

## 1. Method

### 1.1 Claim verdict scale

| Code | Meaning | Evidence standard |
| --- | --- | --- |
| **V** | Verified true | Re-measured from the data zip, read from official docs/HARNESS_README, or confirmed by web search this session |
| **V✗** | Verified false | Contradicted by the same sources |
| **P** | Plausible | Consistent with sources; not independently checked |
| **U** | Unverifiable | Depends on login-gated pages, future events, or unrun experiments |
| **I** | Infeasible | Cannot be built under the declarative-YAML / sandbox / tool rules |
| **R** | Risky | Feasible but likely to cause a zero, an overrun, or a wasted sprint unless changed |
| **F** | Fabricated | Presented as measured or verified with no possible basis |

### 1.2 Hard facts every claim is checked against

| # | Fact | Source |
| --- | --- | --- |
| H1 | ~120 hidden tasks, private repos, sequential; 12 h total incl. setup; overrun currently errors the whole run | Overview; forum 743063 (via intel) |
| H2 | `max_time_minutes` is **per task**; per-task cap × 120 + setup must be < 720 min | HARNESS_README §7.1 |
| H3 | Declarative YAML only; tools = 9 harness tools + `agent_tool` + skills; no custom tools, middleware, or callbacks | Overview; README §2 |
| H4 | Graph edges are all `calls`; nodes have `id`/`name`/`text` only; `get_code_neighbors(node, edge_type, max_neighbors)` has no depth | Measured; Overview tool signatures |
| H5 | `write_file` writes under `/workspace`; untracked `/workspace` files enter the patch; test/config edits are reset | README §6, §8 |
| H6 | 1 submission/day; 2 finals; public LB ≈ 58–60 tasks (1 task ≈ 0.017) | Rules; intel |
| H7 | Single model `gemma-4-31b-it-qat-w4a16-ct`; LoRA ≤ rank 128, ≤ 8 adapters; forum reports of zeroing and KV collapse unresolved | README §3; intel |
| H8 | `httpx_6821` is invented; zero BCF components have ever run | Dossier ledger |
| H9 | RTX 5090 needs CUDA 12.8+ (sm_120); stock PyPI vLLM refuses Gemma 4 LoRA; the official wheelhouse is required | Intel 743213; C3/C15 |
| H10 | Paper: 5 equal criteria (Novelty, Quality, Relevance, Verifiability, Clarity); 3,000 words; due Nov 12; ≤2 judged; ties → earliest | Paper-track intel (C11, C16 scrapes; C3 live read) |

### 1.3 Plan-credibility rubric — Agent competition

Each criterion is scored 0–5. Credibility % = Σ(weight × score) / 5.

| ID | Criterion | Weight | 5 looks like | 0 looks like |
| --- | --- | ---: | --- | --- |
| A1 | Constraint compliance: budget math, eval_config, declarative limits, tool semantics | 25% | Cap × N verified under 12 h; only real tools and params | Settings that error the run or rely on impossible mechanisms |
| A2 | Scorer-reality risk handling: LoRA bugs, escaping, thinking-drop, overrun, canary | 20% | Explicit canary gates and no-adapter fallback | Assumes adapters/patches just work |
| A3 | Evaluation validity: gold audit, holdouts/OOD, paired stats, variance | 20% | Frozen splits + OOD + paired tests + repeats | Tunes on everything; one LB probe decides |
| A4 | Leverage of improvement levers: scaffold, skills, training | 15% | Compounding levers with measured gates | One lever, or none |
| A5 | Operator-load / schedule realism (solo developer with a day job per dossier R8) | 10% | Prioritized, time-boxed, early LB probes | Full-time assumptions; first LB at week 6 |
| A6 | Target realism / calibration | 10% | Targets with uncertainty; noise acknowledged | "0.38–0.44, commanding #1" |

### 1.4 Plan-credibility rubric — Whitepaper competition

| ID | Criterion | Weight | 5 looks like |
| --- | --- | ---: | --- |
| P1 | Rubric and format alignment (correct 5 criteria, 3,000 words, deadline, early stub) | 20% | Section/word budget mapped to the real rubric |
| P2 | Novelty potential of the proposed contribution | 20% | A measurable, unreported property (e.g., interference atlas) |
| P3 | Verifiability / evidence integrity | 25% | Receipts; no fabrication; pre-registered predictions |
| P4 | Math correctness | 15% | Derivations re-derive cleanly |
| P5 | Related-work accuracy and currency | 10% | Correct venues; includes 2024–26 multi-fault APR work |
| P6 | Feasibility of the measurement plan by Nov 12 | 10% | CPU-cheap analyses plus a few agent runs |

### 1.5 Win-probability model (transparent priors)

**Agent competition (top-3 prize):**

```text
P_agent = K_a × C_a^3,   K_a = 0.10
```

- C_a = agent credibility as a fraction (0–1).
- **K_a = 0.10** is the judged ceiling for a solo operator with a perfect plan. Its basis:
  - 829 teams.
  - Private-repo test set.
  - ±0.04 run-to-run noise (≈ ±2.4 tasks) that can reorder the top.
  - Many teams have frontier-model help and more GPU time.
  - The random-team base rate is 3/829 ≈ 0.36%.
- **Cubic exponent:** flaws compound multiplicatively across three stages (build → qualify on scorer → transfer to private split). A plan that is weak on one stage rarely recovers.

**Whitepaper competition (any of the 3 prizes):**

```text
P_paper = K_p × C_p^2,   K_p = 0.40
```

- C_p = paper credibility.
- **K_p = 0.40** basis:
  - Snapshot field: 84 participants and 86 "submissions", likely a few dozen real writeups.
  - 3 prizes; each writeup can win only one.
  - Single named judge, so opacity.
  - Requires the user to actually run the measurements.
  - The base rate for an average entry is ≈ 3/40 ≈ 7.5%.
- **Quadratic exponent:** fewer stages than the agent track (plan → measure → write).

**Sensitivity.** Halving K_a or K_p halves every estimate. The **ranking** of plans is driven by C, not K. Treat absolute numbers as ±50% judgment estimates. Ordering is the reliable output.

---

## 2. Claim-by-claim analysis per contender

Each table lists the contender's load-bearing claims, a verdict, and the reason. Wording is paraphrased or quoted from the contender's files.

### C1 `1-gemini31pro`

| # | Claim | Verdict | Analysis |
| --- | --- | --- | --- |
| 1 | Split the brain into Searcher / Planner / Editor, each with its own LoRA | R | LoRA scorer path unproven (H7); three adapters multiply KV-buffer risk and training cost |
| 2 | Generate "thousands" of synthetic trajectories with Claude Code / GPT-4o on AUX 2 | R | Provider ToS forbids training competitors' models on outputs; open-weight teachers are the safe route; AUX 2 cannot host frontier models anyway |
| 3 | Day 0: Python 3.11, CUDA 12.x, Docker Desktop | R | Sandbox is 3.13, Kaggle 3.12; 5090 needs CUDA 12.8+ |
| 4 | "Hardcode a kill switch… force `submit_patch`" | I | Only prompt rules or `eval_config` caps exist; no code hook |
| 5 | Binary gates "block the `submit_patch()` tool" | I | H3: a skill can report; it cannot block |
| 6 | Run "against a subset of SWE-bench Lite" | R | Off-distribution; SWE-bench Verified is retired for frontier claims; little transfer signal |
| 7 | Entropy formula H(S\|c) = α log K + (1−α) log(N−K) | P | Acceptable approximation (it omits the binary entropy of the indicator) |
| 8 | "Static AST call graphs are acyclic, so G_F is a DAG" | V✗ | Call graphs contain recursion and mutual calls |
| 9 | Complexity drops from O(m!·N^m) to linear | R | Holds only if the dependency DAG is known; discovering it is the hard part |
| 10 | httpx_6821 f1 (history clear) / f2 (stream assert) as real code | V✗ | H8: invented task; symbols do not exist in the httpx snapshot |
| 11 | Monperrus 2018: "over 85% of APR tools" are single-fault | U | Statistic not found in that source; likely invented |
| 12 | Paper idea 2 uses "NO_PATCH metric logged in the dossier runs" | F | No runs exist (H8) |

**Feasibility verdict:** the architecture is plausible at the idea level; the build steps are underspecified and partly infeasible.

### C2 `2-gemini38flash`

| # | Claim | Verdict | Analysis |
| --- | --- | --- | --- |
| 1 | Dynamic allocation: 4-min base, hard 8-min cutoff | V/R | 8 × 120 = 16 h exceeds the budget (H2); the 4-min average is fine; set the cap to ~5 |
| 2 | Abort and submit empty if no candidate within 90 s | R | Empty scores 0, same as wrong. Better to edit early and keep the harness fallback diff |
| 3 | LoRA r=32 / α=64 on all projections; 1.5–2.5k steps; 30% replay buffer | P | Sensible hyperparameters; the replay-buffer advice is good |
| 4 | Convert SWE-bench Verified traces into ADK format | R | Synthesized traces lack real tool outputs (escaping, truncation) and teach the wrong distribution |
| 5 | Q2 targets an RTX 3080 + "Mac Studio M3 Ultra (512GB)" | V✗ | Not the user's hardware |
| 6 | Final hardware turn | V✗ | Unanswered (question echoed) |
| 7 | CRLF in skill shebangs breaks Linux | V | Real Windows→Linux gotcha |

### C3 `3-cc-opus55`

| # | Claim | Verdict | Analysis |
| --- | --- | --- | --- |
| 1 | Train profile 67/48/13/1; hints empty; 71% single-file; median 418 chars | V | Re-measured |
| 2 | 12 h / 120 tasks ⇒ agent_s ≤ 251 s (`max_time_minutes` ~4) with 0.85 safety | V | Arithmetic correct and conservative |
| 3 | Edges all `calls`; nodes `id/name/text`; fastapi 72% isolated | V | Re-measured |
| 4 | 0/129 tracebacks; 15/129 exception names | V | Re-measured |
| 5 | httpx_6821 symbols absent from the httpx_3672 snapshot | V | Consistent with my snapshot check |
| 6 | S(K,f) ≈ 1/(1/K+1−f); budget success × K·f; refine iff 1/K−1/K′ > f−f′ | V | Re-derived |
| 7 | Class priors worsened LOO localization (5.84 → 6.57) | P | Plausible and script-named; not re-run by me |
| 8 | vLLM serves the model at 32k on one 5090 | R | KV at ~1 MB/token suggests ~6–12k at bf16 KV. Measure and plan for 16k/fp8 |
| 9 | Training path A (LoRA on QAT checkpoint) vs B (QLoRA on bf16, apply to QAT) | P | Correctly flagged as needing a spike; B has a train/serve mismatch to A/B test |
| 10 | LB targets 0.17 by Oct 14 → 0.30 LOCKBOX by Nov 11 | R | Ambitious for solo; field consensus winner bar ~0.25–0.35 |
| 11 | Day plan 08:00–20:00 daily | R | Exceeds a day-job operator's hours |
| 12 | Official rubric and 3,000 words, read live | V | Matches C11/C16 scrapes |
| 13 | Prior-research list from memory with H/M confidence | V/P | Core entries confirmed (Debroy & Wong, DiGiuseppe & Jones); honest disclaimers |

### C4 `4-gemini31pro-antigrav`

| # | Claim | Verdict | Analysis |
| --- | --- | --- | --- |
| 1 | Flat agent first; tree as ablation | V | Matches the dossier correction |
| 2 | Agent "forbidden from editing until JSON spec passes validation" | I | Prompt-level only (H3) |
| 3 | Target > 0.20 | P | Reasonable |
| 4 | P(l\|C) via Bayes; "zeroes out the probability of irrelevant locations" | R | Hard pruning caps success at classifier fidelity (C3 Result 4) |
| 5 | Topological sort over call-graph DAG | V✗ | Call graphs are not DAGs |
| 6 | FLITSR iterative test-suite reduction | V | Real (Callaghan & Fischer, ISSTA 2023) |
| 7 | "Zheng et al." and "DiGiuseppe et al." without venue or year | U | Too vague to cite |

### C5 `5-gemini38flash-antigrav`

| # | Claim | Verdict | Analysis |
| --- | --- | --- | --- |
| 1 | `max_time_minutes: 45`, `max_tool_calls: 80` "full competition maximums" | R (fatal) | 120 × 45 min ≫ 12 h; would error the whole submission (H1, H2) |
| 2 | "~45% of failed tasks never produce a patch… ~20% rejected…" from "empirical post-mortem" | F | No post-mortem exists |
| 3 | First Kaggle submission in Sprint 6 | R | Wastes ~35 LB probes; no runtime calibration |
| 4 | `repo_mapper.py` "uses `get_code_subgraph`" | I | Skill scripts cannot call harness tools |
| 5 | `write_spec` structured tool | I | Custom tools are not allowed |
| 6 | Dev split reaches ≥ 0.38 | R | Uncalibrated |
| 7 | Fano: P_e ≥ (H(X\|C)−1)/log\|V\| | V | Standard weak form |
| 8 | "K* maximizes channel capacity" | V✗ | Capacity is a max over input distributions, not over K |
| 9 | Doob optional stopping bounds loss ≤ 3·E[turn cost] | V✗ | Misapplied theorem; the bound is just the 3-strike rule |
| 10 | Paper: "BCF achieves 0.388 (M)… Receipt R-BCF-FULL" | **F** | Fabricated measured result |
| 11 | "Debroy & Wong TSE 2014 … up to 40%" | U/V✗ | Known paper is ISSRE 2009; figure unsupported |
| 12 | "Zheng et al. ICSE 2006" | V✗ | It is ICML 2006 |

### C6 `6-gemini38flash-antigrav-b1`

| # | Claim | Verdict | Analysis |
| --- | --- | --- | --- |
| 1 | I(X;C) = F log K + (1−F) log(K/(K−1)) − H₂(F) | V | Re-derived |
| 2 | K=160, F=0.88 ⇒ 6.42 bits, N_eff ≤ 35 | V✗ | ≈5.92 bits, N_eff ≈ 82 |
| 3 | 3-level taxonomy K=160 at F=0.88 | R | Unrealistic fidelity at 160-way |
| 4 | R-04: `max_time_minutes: 15` "guarantees < 8 h" | V✗ | 15 × 120 = 30 h |
| 5 | `scripts/evaluate.py --reference-check` with expected output | F | Not a harness command; output invented (copied from dossier fiction) |
| 6 | Tool permission gating before spec | I | H3 |
| 7 | First Kaggle submission Day 38 | R | As C5 |
| 8 | Ω(m!·b^d) naive vs O(m·d) BCF | U | Unsupported "proof" |
| 9 | httpx_6821 turn table as "actual step-by-step" | F | Invented scenario |
| 10 | "MSeer: Abreu ISSRE 2009"; "Debroy & Wong ICST 2009… 22%" | V✗ | MSeer is Gao & Wong TSE 2019; the 22% is unsupported |
| 11 | Paper rubric "Technical Soundness / Originality / …" | V✗ | Retracted by the dossier; real rubric differs |
| 12 | Results table labeled "target projections H/D" | V | Honest label (mitigates) |

### C7 `7-gemini38flash-antigrav-b2`

| # | Claim | Verdict | Analysis |
| --- | --- | --- | --- |
| 1 | Ablation ladder 9/60 → 27/60 (45.0%), each "[M] Receipt" | **F** | No runs exist |
| 2 | Held-out 28/69 = 40.6% "proves generalization" | **F** | As above |
| 3 | "Across 700+ competition submissions, naive agents fail on httpx_6821" | F | Invented task |
| 4 | `enable_sandbox_testing` in `eval_config.yaml` | V✗ | Harness-side EvalConfig, not a submission field |
| 5 | `python -m adk_submission.cli validate` | U | No such documented CLI |
| 6 | Speed-up σ ~ O(N^d/(M·d)) | V✗ | Ill-defined (mixes tree-search depth with a localization partition) |
| 7 | Day 38: "129 tasks complete in 4 h 18 m" | F | Prediction stated as fact |
| 8 | Build path `…/101-Kaggle_gemini/…` | V✗ | Wrong repo path |

### C8 `8-web-qwen38max`

| # | Claim | Verdict | Analysis |
| --- | --- | --- | --- |
| 1 | Use frontier APIs (Gemini 1.5 Pro, O1, Claude 3.5) to solve 129 + 1,000 tasks for SFT | R | ToS/licensing risk; dated models |
| 2 | Python middleware intercepting `run_command` outputs | I | H3 |
| 3 | Wrapper around `edit_file` that "does not consume a tool call" | I | H3 |
| 4 | Agent `setup.py` caches venvs between tasks | I | The harness controls setup |
| 5 | Tune `tensor_parallel_size` on the 5090 for the 12 h budget | V✗ | Scorer runs 4× L4 TP=4; local TP is irrelevant to scoring |
| 6 | Build a skill that translates issue text into a vector query | V✗ | `search_similar_code` resolves symbol keys; prose returns empty |

### C9 `9-genspark-gpt61sol`

| # | Claim | Verdict | Analysis |
| --- | --- | --- | --- |
| 1 | Tasks sequential; scorer reads 4 fields | V | Intel/host |
| 2 | 43,200 s / 120 = 360 s; use 4–4.5 min agent caps | V | Correct with margin |
| 3 | "32K-context inference is not assumed to fit" on the 5090 | P | Consistent with KV arithmetic |
| 4 | Three adapter gates (activation, context survival, learned improvement) | V (design) | Directly addresses H7 |
| 5 | `write_file("/tmp/…")` invalid | P/V | The tool writes relative to `/workspace` (H5) |
| 6 | A skill script cannot be a non-bypassable gate | V | H3 |
| 7 | Strictly-increasing-pass rule rejects partial repairs | V | Logical (masking/unmasking) |
| 8 | Routing helps iff a > (c_r + C_f − C_0)/(C_f − C_s) | V | Algebra correct |
| 9 | I(D;Ĉ\|X) = 0 when Ĉ = f(X) | V | Data-processing argument; key reframing |
| 10 | Al-Bataineh ASE 2024/2025; DiGiuseppe & Jones 65,000 | V | Web-verified |
| 11 | ~2 purposeful submissions/week | P | Reasonable given queue/quota |

### C10 `10-genspark-nemotron3ultra`

| # | Claim | Verdict | Analysis |
| --- | --- | --- | --- |
| 1 | `max_time_minutes: 540` as a "global failsafe" | V✗/R (fatal) | Per-task; offers no global protection |
| 2 | NVIDIA 560 driver + CUDA 12.6 for an RTX 5090 | V✗ | Blackwell needs CUDA 12.8+ |
| 3 | Loud-adapter test; stock vs wheelhouse vLLM; 10k-token KV test | V (design) | Correct and valuable |
| 4 | QLoRA `--max_len 32768`, VRAM "30 GB < 32 GB" | V✗/I | 32k-token activations far exceed the remainder |
| 5 | Train `tool_lora` on the RTX 4060 with CPU offload | I | 31B on 8 GB is not practical |
| 6 | RL reward +0.1 for ≥ 3 `edit_file` calls | R | Reward hacking |
| 7 | Curriculum "Rich (29 tasks)", "HTTPX/Requests (22)" | V✗ | 48 and 14 |
| 8 | GitHub Action auto-submits via CLI daily | R | Code competitions require a notebook "Save Version" then Submit |
| 9 | Masking Def. 2: masked symptom appears first | V✗ | Inverted definition |
| 10 | "Dossier's 66.7% turn reduction matches prediction" | F | Retracted fictional numbers used as evidence |
| 11 | Table 1: C1 0.08 / C2 0.15 / C3 0.31 "3 seeds" | F | Unlabeled fabricated results |
| 12 | "Pearl et al. 2017 ISSTA"; "Le et al. 2023 SWE-bench"; "Zhang 2022 TSE" | F/V✗ | Misattributed or invented |

### C11 `11-cc-glm53max`

| # | Claim | Verdict | Analysis |
| --- | --- | --- | --- |
| 1 | Forum intel: LoRA KV 46,048 → 7,600; zeroing; escaping 22/62/0%; thinking drop | U (credible) | Detailed, sourced to thread IDs; login-gated; consistent across later contenders |
| 2 | Public LB ≈ 58 tasks; ±0.04 variance | U (credible) | From community EDA notebook / forks |
| 3 | Graphs have typed `calls`/`called_by` edges | V✗ | All `calls` |
| 4 | httpx_3672 traps (test lines, missing parens, 7 files) | V | Re-measured |
| 5 | Day-0 clock-slot plan, Main ~5–7 h | P | Realistic if downloads pre-start |
| 6 | eval caps 5.5 / 70 / 40 / 300 | V | 5.5 × 120 = 11 h; tight but under |
| 7 | QLoRA on 5090 with QAT base ≈ 17 GB fits with checkpointing | P | Feasible at short sequences; QAT-format support must be checked |
| 8 | "Plug-in MI estimator biased low" | V✗ | Biased high |
| 9 | O(k²) ≈ k²/4 wrong-order attempts | U | Heuristic, labeled as a model |
| 10 | 33 citations "Crossref-verified" | P/V | Spot-checks OK (Debroy & Wong DOI) |
| 11 | ≥1.5k resolved trajectories by Oct 29 | R | Ambitious at ~6 min/episode on one GPU |

### C12 `12-cc-grok47`

| # | Claim | Verdict | Analysis |
| --- | --- | --- | --- |
| 1 | Sample adapters rank 4, layer 0, q/o_proj | V | Confirmed in `adapter_config.json` |
| 2 | Train-set facts table | V | Matches (38 multi-file = 19+19) |
| 3 | `search_similar_code` = key/suffix lookup then cosine | P/V | Consistent with notebook behavior |
| 4 | Skills cannot see the NetworkX graph | P | Plausible; must be probed |
| 5 | Initial 6-min cap, 24 calls | R | 6 × 120 = 720 min before setup; overrun errors the run |
| 6 | "16,384-token server is a lab defect" | R | Likely the reality on a 5090; marking all scores non-comparable is too strict |
| 7 | httpx_3672 single-file rename | V✗ | 7 files |
| 8 | `called_by`, depth 2 | V✗ | No such params |
| 9 | Coverage threshold α > m/n | V | Re-derived |
| 10 | Debroy & Wong 33.12% independence | P | Consistent with the survey's 67% interference |
| 11 | Public score gates 0.25 → 0.42 | R | Aggressive |
| 12 | Teacher via "small API subscription" | R | Provider ToS on training use |

### C13 `13-genspark-mimo26pro`

| # | Claim | Verdict | Analysis |
| --- | --- | --- | --- |
| 1 | "One task ≈ 0.83 points… 0.17 ≈ 20 tasks" | V✗ | Public LB ≈ 58 tasks |
| 2 | Two-track (A proven, B gated by canary) | V (design) | Sound |
| 3 | `timeout_seconds: 300 # per-task wall clock` | V✗ | Per command |
| 4 | `max_time_minutes 5` ⇒ 10 h | V | Correct |
| 5 | 129 vs 127 hard links ⇒ shared base commits | V | Data page states 129 task files hard-linked to 127 commit files |
| 6 | Speed-up ≈ m with balanced partition | V | Perfect-fidelity case |
| 7 | Fano: H(R\|E) ≤ h(ε) + ε log(N−1) with ε = class error | V✗ | Misapplied |
| 8 | Competing-risks censoring view of masking | P | Valid framing |
| 9 | ChainSWE (arXiv 2607.02606) | V | Web-verified |
| 10 | Reiter "…Founded in Causality" | V✗ | Title wrong |

### C14 `14-genspark-kimiK3`

| # | Claim | Verdict | Analysis |
| --- | --- | --- | --- |
| 1 | "0.17 ≈ 20 of ~120 tasks" | V✗ | ≈ 10 of ~58 |
| 2 | 5090: serve at `max_model_len` 16,384 | P | Realistic |
| 3 | `max_time_minutes ≈ 8` with arithmetic "validated < 12 h" | V✗ | 16 h |
| 4 | Miscalibration inequality α(1−ρ̄) > (1−α)w/E | V | Final form correct |
| 5 | "I bits ≈ I saved inspections" | V✗ | Bits halve the count; they do not subtract |
| 6 | α(K) ≈ 1−ε0−c√(K/n) granularity optimum | P | Reasonable model |
| 7 | Sync/async twins detectable via cosine ≈ 1.0 | P/V | The Getting Started output shows 1.0000 for twins |
| 8 | Repo-specific playbooks in skills as fallback | R | Contradicts the private-repo rule |
| 9 | Naive trace "wrong fix #1 broke auth, 4 recovery turns" as cost evidence | F | Dossier fiction |

### C15 `15-genspark-deepseekV41flash`

| # | Claim | Verdict | Analysis |
| --- | --- | --- | --- |
| 1 | 0.17 ≈ 10/60; 30-way tie at 0.13 | V/U | Arithmetic right; tie count from LB |
| 2 | Allocation rule p′/p = 1/(c+o) | V | Calculus correct |
| 3 | `max_time_minutes: 5` immediately | V | Safe |
| 4 | Line-splice edit skill (line numbers + anchors) | P | Feasible via `run_skill_script` writing files; must probe |
| 5 | 5090 KV ≈ 6.5k tokens (13k fp8) | P | Arithmetic from forum figures; weights "23.3 GB" unverified |
| 6 | Destructive-adapter canary | V (design) | Decisive and variance-immune |
| 7 | Greedy-on-observable is correct for pure masking chains | V | Proof sketch valid |
| 8 | k* = e^{α0/2β} | V | Correct minimizer (sign typo only) |
| 9 | q^n conjunctive-oracle law explains the plateau | U | Interesting hypothesis, tagged H |
| 10 | httpx_6821 narrative internally inconsistent | V | Dossier says dead code yet fixed first |
| 11 | An et al. 95.4%; Herzig 33.8%; Al-Bataineh | V | Web-verified / known |
| 12 | First scored submission in Sprint 3 | R | Late runtime calibration |
| 13 | "Enforce no file access before spec in the orchestrator" | I | H3 |

### C16 `16-cc-glm53flash`

| # | Claim | Verdict | Analysis |
| --- | --- | --- | --- |
| 1 | Submissions "2/day max" | V✗ | 1/day |
| 2 | `max_time_minutes 10` + "10.5 h global watchdog" skill | I/R | No global clock is available to a skill; 120 × 10 = 20 h |
| 3 | Thinking patched; zeroing fixed via v25 | U/V✗ | Intel says incoming / still failing |
| 4 | First safe submission = unmodified sample baseline | R | Sample with adapters FAILED (intel) |
| 5 | Install latest `vllm` from PyPI | R | Refuses Gemma 4 LoRA (H9) |
| 6 | T2 held-out-repo mined tasks as the primary selection metric | V (design) | Strong idea |
| 7 | K* = 4a²N/b² | V | Re-derived |
| 8 | Hitting-set compound detector over backward slices | P | Sound offline; at runtime needs failing tests |
| 9 | httpx_3672 B1 "raises TypeError" | V✗ | Silent no-op |
| 10 | Paper-track facts (rubric, prizes, 3,000 words, host Q&A) | V/U | Consistent with C11 |
| 11 | Best-of-N verifier-gated | R | Single `/workspace`; time budget ~5 min |

---

## 3. Plan credibility scorecards

### 3.1 Agent competition

| Contender | A1 (25) | A2 (20) | A3 (20) | A4 (15) | A5 (10) | A6 (10) | Credibility % |
| --- | :---: | :---: | :---: | :---: | :---: | :---: | ---: |
| C15 | 4.5 | 5 | 4.5 | 4.5 | 3.5 | 4 | 89.0 |
| C9 | 4.5 | 5 | 5 | 3.5 | 3.5 | 4.5 | 89.0 |
| C11 | 4 | 5 | 4.5 | 4.5 | 3 | 3.5 | 84.5 |
| C13 | 4 | 5 | 4 | 4 | 3.5 | 3.5 | 82.0 |
| C3 | 4.5 | 3 | 5 | 5 | 2.5 | 3 | 80.5 |
| C14 | 3 | 5 | 4 | 4 | 3.5 | 3 | 76.0 |
| C12 | 3.5 | 2.5 | 5 | 4.5 | 3.5 | 2.5 | 73.0 |
| C16 | 2 | 3.5 | 4.5 | 4 | 3 | 4 | 68.0 |
| C2 | 3.5 | 1.5 | 2 | 2.5 | 2.5 | 3 | 50.0 |
| C10 | 1 | 4 | 3 | 3 | 2 | 1.5 | 49.0 |
| C4 | 2.5 | 1.5 | 2 | 2.5 | 3 | 2.5 | 45.0 |
| C6 | 1.5 | 1.5 | 3 | 3 | 2.5 | 1 | 41.5 |
| C1 | 2 | 1.5 | 1.5 | 3 | 2.5 | 2 | 40.0 |
| C8 | 2 | 1 | 1.5 | 2 | 2.5 | 2.5 | 36.0 |
| C7 | 1 | 1.5 | 2.5 | 3 | 2 | 0.5 | 35.0 |
| C5 | 0.5 | 1.5 | 2 | 3 | 2 | 0.5 | 30.5 |

Worked example (C15): (25×4.5 + 20×5 + 20×4.5 + 15×4.5 + 10×3.5 + 10×4)/5 = (112.5 + 100 + 90 + 67.5 + 35 + 40)/5 = 445/5 = **89.0%**.

Score justifications (agent):

- **C3** has the best evaluation design and levers (A3, A4 = 5). It drops on A2 because it does not know the scorer LoRA bugs, on A5 because of the full-time schedule, and on A6 for the 0.30 target.
- **C15 and C9** tie. C15 is more actionable (levers); C9 is more conservative (targets).
- **C12** has a superb evaluation design, but no scorer-bug intel (A2 = 2.5), a borderline 6-min cap (A1 = 3.5), and aggressive targets (A6 = 2.5).
- **C16, C10, C6, C5, C7** lose most on A1 because their per-task caps violate the 12 h arithmetic or rely on impossible mechanisms.
- **C2** has decent arithmetic (A1 = 3.5), but its plan is built for the wrong hardware.

### 3.2 Whitepaper competition

| Contender | P1 (20) | P2 (20) | P3 (25) | P4 (15) | P5 (10) | P6 (10) | Credibility % |
| --- | :---: | :---: | :---: | :---: | :---: | :---: | ---: |
| C3 | 5 | 4.5 | 5 | 5 | 4.5 | 4.5 | 96.0 |
| C15 | 5 | 5 | 4.5 | 4 | 5 | 4 | 92.5 |
| C9 | 4.5 | 4 | 5 | 4.5 | 5 | 4 | 90.5 |
| C13 | 5 | 4.5 | 4.5 | 3.5 | 4.5 | 4 | 88.0 |
| C11 | 5 | 4 | 4.5 | 3.5 | 4.5 | 4 | 86.0 |
| C16 | 5 | 4 | 4 | 4.5 | 3 | 4 | 83.5 |
| C12 | 2 | 4.5 | 5 | 5 | 4 | 4.5 | 83.0 |
| C14 | 5 | 4 | 4 | 3.5 | 3 | 4 | 80.5 |
| C1 | 2 | 3 | 2.5 | 2.5 | 3 | 3 | 52.0 |
| C4 | 2 | 2 | 3.5 | 2 | 1.5 | 3 | 48.5 |
| C6 | 1 | 3 | 2.5 | 2.5 | 2 | 3 | 46.0 |
| C10 | 3 | 3 | 1 | 2 | 1 | 2.5 | 42.0 |
| C5 | 2 | 2.5 | 0.5 | 2 | 1.5 | 2 | 33.5 |
| C2 | 1 | 1.5 | 3 | 0 | 0 | 2 | 29.0 |
| C8 | 1 | 1.5 | 3 | 0 | 0 | 2 | 29.0 |
| C7 | 1 | 2.5 | 0.5 | 1.5 | 1.5 | 2 | 28.0 |

Score justifications (paper):

- **C3** proposes the interference atlas (measurable, novel, CPU-only), uses the real rubric with a word budget, and has correct math.
- **C15** has the highest novelty (greedy-on-observable, q^n test, tangling audit) and the most current literature. Minor math muddles cost it on P4.
- **C12** has excellent content but does not know the rubric or word cap (P1 = 2).
- **C5/C7** scored P3 = 0.5 because fabricated measured results would destroy Verifiability and reputational standing.

---

## 4. Win-probability estimates

### 4.1 Per contender (if the user executes that contender's plan as written)

| Contender | Agent credibility | P(top-3, agent) = 0.10·C³ | Paper credibility | P(any paper prize) = 0.40·C² |
| --- | ---: | ---: | ---: | ---: |
| C3 | 0.805 | 5.2% | 0.960 | 36.9% |
| C15 | 0.890 | 7.0% | 0.925 | 34.2% |
| C9 | 0.890 | 7.0% | 0.905 | 32.8% |
| C11 | 0.845 | 6.0% | 0.860 | 29.6% |
| C12 | 0.730 | 3.9% | 0.830 | 27.6% |
| C13 | 0.820 | 5.5% | 0.880 | 31.0% |
| C16 | 0.680 | 3.1% | 0.835 | 27.9% |
| C14 | 0.760 | 4.4% | 0.805 | 25.9% |
| C6 | 0.415 | 0.7% | 0.460 | 8.5% |
| C1 | 0.400 | 0.6% | 0.520 | 10.8% |
| C10 | 0.490 | 1.2% | 0.420 | 7.1% |
| C4 | 0.450 | 0.9% | 0.485 | 9.4% |
| C2 | 0.500 | 1.25% | 0.290 | 3.4% |
| C5 | 0.305 | 0.3% | 0.335 | 4.5% |
| C7 | 0.350 | 0.4% | 0.280 | 3.1% |
| C8 | 0.360 | 0.5% | 0.290 | 3.4% |
| *Random team (base rate)* | — | *0.36%* | — | *~7.5%* |

Worked example (C3 paper): 0.40 × 0.96² = 0.40 × 0.9216 = **36.9%**. C3 agent: 0.10 × 0.805³ = 0.10 × 0.5217 = **5.2%**.

### 4.2 Synthesized plan (recommended composite; see file 03)

Combining C3's evaluation factory and math, C15's allocation/edit/canary mechanics, C9's gate discipline, C11's intel doctrine, and C12's ceiling ladder gives estimated credibilities of about **A1 5, A2 5, A3 5, A4 4.5, A5 3.5, A6 4 ⇒ 93.5%**:

```text
P_agent ≈ 0.10 × 0.935^3 ≈ 8.2%
P_paper ≈ 0.40 × 0.97^2  ≈ 37.6%   (C_p ≈ 0.97 with the real rubric + atlas + new results)
```

The leaderboard prize is a long shot for any plan (single-digit percent). The paper prize is the realistic payoff: roughly a 1-in-3 chance with disciplined execution and genuine measurements. This matches C11/C16's assessment that the paper track is under-subscribed.

### 4.3 Sensitivity and what moves the numbers most

| Event | Effect on P_agent | Effect on P_paper |
| --- | --- | --- |
| Scorer LoRA path confirmed working (canary passes) by Oct 21 | ×1.4 (training lever becomes usable) | ×1.05 |
| LoRA path never works | ×0.7 (prompt/skills ceiling ~0.20–0.25) | none (paper can report the negative result) |
| A run errors from a 12 h overrun | −1 probe day each; repeated errors near the deadline are catastrophic | none |
| Interference atlas finds ≥ 20% conjunctive multi-hunk tasks | none | ×1.2 (strong novelty) |
| Any fabricated number in the paper | — | ×0 (disqualifying in practice) |
| Operator time < 15 h/week | ×0.6 | ×0.8 |


---

<!-- ====================================================================== -->
<!-- FILE: 03_Master_Options_and_Project_Plans.md -->
<!-- ====================================================================== -->

# Special Section 2 — Master Options List, Impact–Effort Analysis, and Full Project Plans

**Date:** 2026-10-01 · Companion to `01_Model_Council_Report.md`

**Perspective.** LoRA/PEFT training, ML evaluation, and agent software engineering. This section takes the union of every technique proposed by the 16 contenders, removes the ones that are infeasible under the competition rules (see file 02, codes **I** and **F**), and turns the rest into a prioritized option list. Each option has a project plan with these parts:

1. Training-data collection.
2. Data classification.
3. LoRA training.
4. Test-result collection and analysis.
5. Unit tests with expected results.
6. A self-improvement loop.
7. Milestones with GO/NO-GO checkpoints and pivots.
8. A task/subtask sequence with **hh:mm** estimates.

---

## Part A — Planning assumptions

| Item | Assumption | Why |
| --- | --- | --- |
| Operator | One person with a day job (dossier risk R8) | Stated in the dossier |
| Operator time | **25:00 per week**: weekdays 2:30 × 5 evenings + weekends 6:15 × 2 | Sustainable for 9 weeks; most contender plans silently assume 60+ h/week |
| Machine time | Runs unattended overnight and while at work; reported separately as **Machine hh:mm** | GPU jobs do not consume operator time except for launch/inspection |
| Calendar | Day 0 = Thu 2026-10-01. S1 Oct 2–8; S2 Oct 9–15; S3 Oct 16–22; S4 Oct 23–29; S5 Oct 30–Nov 5; S6 Nov 6–12; Endgame Nov 13–Dec 2 | Paper due Nov 12; entry/merge Nov 25; finals Dec 2 (23:59 UTC) |
| Machines | MAIN (RTX 5090 32 GB, 64 GB): model serving and training. AUX2 (i7-12700F, 64 GB, RTX 3080 power-capped): sandboxes, grading, mining. AUX1 (laptop): control plane, labeling, paper | Consensus of C3/C9/C11/C12/C15 |
| Local serving | `max_model_len` **16,384** with `--kv-cache-dtype fp8` until Day-0 measurement proves 32,768 fits | C15/C9 KV arithmetic (~1 MB/token at bf16) |
| Scorer facts | As listed in file 01 §1 and file 02 §1.2 | Verified |

Notation in the task tables:

- **Op** = operator time; **Mach** = unattended machine time.
- **Dep** = must finish first.
- Times are estimates; the first measurement in each option replaces them.

---

## Part B — Composite technique inventory → master option list

Infeasible or fabricated ideas are excluded with reasons in Part B.2.

### B.1 Master options

| ID | Option | Composite sources (contenders) | Track |
| --- | --- | --- | --- |
| O1 | Runtime budget governor and submission operations: eval_config calibration, allocation rule, L4/5090 speed ratio, SOP, ledger | C3, C9, C11, C12, C15 | Agent |
| O2 | Evaluation factory: gold-patch audit and env repair, frozen splits (LOCKBOX/DEV/OOD), ceiling ladder, zero-census, paired statistics | C3, C9, C11, C12, C15, C16 | Agent + paper |
| O3 | Harness-robust editing: line-splice edit skill, escaping protocol, `write_file` fallback ladder | C11, C14, C15 | Agent |
| O4 | Localization stack: `harvest_symbols`, BM25/AST `locate`/`outline`, read-only localizer AgentTool, symbol-only graph queries, mirror-tree (sync/async twin) detector | C3, C12, C14, C15 | Agent |
| O5 | Verification and patch hygiene: compact `run_tests`, `patch_guard` (G2/G3/G5/G6 checks), `/tmp` scratch rule, early-edit rule | C3, C9, C12, C15 | Agent |
| O6 | Prompt doctrine and sampling: 7-rule doctrine, visible STATE/NEXT/WHY block, thinking-budget and temperature sweep, `max_output_tokens` sizing | C3, C11, C12, C15 | Agent |
| O7 | LoRA serving qualification: loud adapter, destructive adapter, KV-survival probe, format-lock test, scorer canary | C9, C10, C11, C13, C14, C15 | Agent (gate) |
| O8 | Task factory: snapshot-history mining, external permissive repos, AST-mutation bugs, SWE-smith environments, two-fault composition from shared base commits | C3, C12, C13, C16, catalogs (C11/C12) | Agent + paper |
| O9 | Trajectory engine + SFT LoRA via rejection sampling / expert iteration (`coder_lora`) | C3, C11, C12, C15, C16 | Agent |
| O10 | Role adapters: `localizer_lora` + `editor_lora`, multi-LoRA routing | C3, C12, C2 | Agent |
| O11 | Preference optimization (DPO/KTO on first-divergent-step pairs) and GRPO stretch | C3, C11, C16 | Agent (stretch) |
| O12 | BCF-FC diagnostic loop: spec card, failure-signature classifier, `depends_on` fix order, residual-set unmasking rule, rescue + journal | C3, C9, C12, C15, BCF compendium | Agent + paper |
| O13 | Paper research program: interference atlas, taxonomy + κ, graph/embedding analyses, K-sweep/coverage, q^n test, writeup | C3, C12, C13, C15, C16 | Paper |
| O14 | Test-time scaling: sequential best-of-2 within budget | C11, C16 | Agent (avoid unless slack) |

### B.2 Excluded ideas and why

| Idea | Proposed by | Reason excluded |
| --- | --- | --- |
| `write_spec` custom tool; orchestrator-enforced gates; tool blocking before spec | C1, C5, C6, C10, C11, C13, C14, C15, C16 | Custom tools and callbacks are not allowed. Kept only as prompt policy plus advisory skill checks (O12) |
| Middleware intercepting tool output; `edit_file` wrapper outside the budget | C8 | Not expressible in declarative YAML |
| Global 10.5 h watchdog skill | C16 | No cross-task clock is visible to the agent |
| `called_by` edges / depth params; NL dual-query semantic search | C1, C5–C7, C11, C12, C16 | Edges are `calls` only; the query resolves symbol keys |
| Closed-API frontier teacher data | C1, C8, C12, C16 | Provider-ToS risk under the open-source winner license; use open-weight teachers or self-distillation |
| 45/15/10/540-minute per-task caps | C5, C6, C7, C10, C16 | Violate the 12 h arithmetic |
| Training `tool_lora` on the RTX 4060 with CPU offload; 32k-token QLoRA on the 5090 | C10 | Infeasible memory/time |
| Repo-specific playbooks or keyword maps | C14, dossier GraphRAG | Hidden set is private repos |

---

## Part C — Impact–effort analysis

**Impact scale** = expected public-LB gain in **tasks** (out of ~58; 1 task ≈ 0.017), or paper value for O13. **Effort** = total operator hh:mm (machine time in parentheses). **Risk** = probability the option fails to deliver its gain.

| ID | Impact (tasks) | Effort Op (Mach) | Risk | Quadrant | Priority | Dependencies |
| --- | --- | --- | --- | --- | ---: | --- |
| O1 | Protective (avoids a 0-score run) + 1–3 | 07:40 (32:00) | Low | **Quick win** | 1 | Day 0 |
| O2 | Enabler (every decision depends on it) | 15:15 (40:00) | Low | **Foundation** | 2 | Day 0 |
| O5 | +1 to +3 | 07:30 (05:00) | Low | **Quick win** | 3 | O2 |
| O3 | +1 to +3 | 07:30 (07:20) | Low–Med | **Quick win** | 4 | O2 |
| O6 | +1 to +3 | 06:45 (31:00) | Low | **Quick win** | 5 | O2 |
| O4 | +2 to +4 | 15:45 (15:20) | Med | **Major project** | 6 | O2, O5 |
| O7 | Gate for O9–O11 (enabler) | 06:15 (17:00) + 2 LB slots | Low (to run); outcome uncertain | **Quick win (gate)** | 7 | Day 0 |
| O13 | Paper prize ($10–15K) | 31:45 (11:00) | Med | **Major project (paper)** | 8 | O2, O8 (two-fault part) |
| O12 | +0 to +2 agent; high paper value | 12:30 (65:00) | Med | **Major project** | 9 | O4, O5 |
| O8 | Enabler for O9 + paper resource | 17:00 (58:00) | Med | **Major project** | 10 | O2 |
| O9 | +2 to +5 (only if O7 passes) | 17:45 (157:30) | **High** (scorer path) | **Major project** | 11 | O7, O8, O2 |
| O10 | +0 to +2 | 06:30 (37:30) | High | **Fill-in** | 12 | O9 |
| O11 | +0 to +2 | 06:30 (20:30) + optional GRPO 04:00 (40:00) | Very high | **Avoid unless ahead** | 13 | O9 |
| O14 | +0 to +1 | 01:30–06:30 (0–10:00) | High (time budget) | **Avoid** | 14 | O5, O1 |
| **Total (O1–O13)** | — | **158:40 Op** (+ Day 0 05:15 + ~20% integration/overhead ≈ 197:00) | — | — | — | Fits the ~225:00 budget for weeks 1–9 |

```text
                 IMPACT
           low                high
      +-------------------+-------------------+
 low  | O6* O5* O3*       | O1  O7(gate)      |  <- quick wins first
 EFF  |                   | O2 (foundation)   |
      +-------------------+-------------------+
 high | O14 O11 O10       | O4  O12  O8  O9   |  <- major projects
      | (avoid / fill-in) | O13 (paper)       |
      +-------------------+-------------------+
 * low effort with medium impact
```

**Recommended order:** Day 0 → O1 + O2 (S1) → O5, O3, O6 (S2) → O4 + O7 canary (S2–S3) → O8 + O13 atlas (S3) → O9 if O7 is GO (S4–S5) → O12 (S4) → O10 (S5, only if O9 is GO) → paper freeze (S6) → endgame. O11 and O14 are only for a large lead with spare slack.

---

## Part D — Shared foundations (used by every option)

### D.1 Day 0 (Thu Oct 1) bring-up — hh:mm sequence

| ID | Task / subtask | Machine | Op | Mach | Dep |
| --- | --- | --- | ---: | ---: | --- |
| D0.1 | Accept main-competition rules; join paper track; accept Gemma model license; create Kaggle API token (user enters it) | AUX1 | 00:20 | — | — |
| D0.2 | Start downloads: competition zip (already local), wheelhouse dataset, model `gemma-4-31b-it-qat-w4a16-ct` v2 | MAIN | 00:10 | 01:30 | D0.1 |
| D0.3 | BIOS: EXPO, SVM, Above-4G/ReBAR; display on iGPU so the 5090's 32 GB stays free | MAIN | 00:30 | — | — |
| D0.4 | Windows updates; NVIDIA driver ≥ 570 branch (CUDA 12.8+ for sm_120); High-Performance power plan; `git config core.autocrlf false` | MAIN | 00:20 | 00:40 | D0.3 |
| D0.5 | `wsl --install -d Ubuntu-24.04`; `.wslconfig` memory=48GB, processors=24, swap=32GB, networkingMode=mirrored; `wsl --shutdown` | MAIN | 00:15 | 00:15 | D0.4 |
| D0.6 | Inside WSL: apt build tools; Docker Engine (not Desktop); add user to docker group; `nvidia-smi` shows the 5090 | MAIN | 00:30 | 00:15 | D0.5 |
| D0.7 | `uv` + two venvs: **serving** (Python 3.12, wheelhouse with `--no-deps`, cutlass `.pth` filtered) and **sandbox tools** (3.13). Verify `import vllm, swegemma, adk_submission`; torch capability (12, 0) | MAIN | 00:40 | 00:20 | D0.2, D0.6 |
| D0.8 | Build `swebench-sandbox:latest` from `docker/Dockerfile.public` with `wheels/`, `imp.py`, `telnetlib.py` in context; check `python3 --version` = 3.13 | MAIN | 00:15 | 00:15 | D0.6 |
| D0.9 | Serve the model: TP=1, `--max-model-len 16384 --kv-cache-dtype fp8`, gemma4 tool and reasoning parsers, `--enable-lora --max-loras 8 --max-lora-rank 128`. Record peak VRAM, then retry 32,768 and record pass/fail | MAIN | 00:30 | 00:30 | D0.7 |
| D0.10 | One-task smoke eval: `swegemma eval --sandbox docker --task-id fastapi_15588 --max-time-minutes 6 --max-tool-calls 24`; confirm results dir (summary, patch, trace, Phase-2 log) | MAIN | 00:20 | 00:15 | D0.8, D0.9 |
| D0.11 | AUX2: WSL2 + Docker Engine; 3080 power cap ~250 W; data rsync from MAIN; build the sandbox image | AUX2 | 00:40 | 01:00 | D0.6 |
| D0.12 | AUX1: WSL2, VS Code Remote, private git repo `g4da/` (layout in D.2), ledger files | AUX1 | 00:30 | — | — |
| D0.13 | Day-0 exit checklist + `env/LOCK.md` (driver, wheelhouse version, image digest, model hash, VRAM numbers) | AUX1 | 00:15 | — | all |
| **Total Day 0** | | | **05:15** | **05:00** | |

**Day-0 GO/NO-GO (G0).**

- GO if D0.9 serves at ≥ 16,384 tokens and D0.10 produces a Phase-2 log.
- NO-GO pivots, in order:
  1. Wheelhouse torch/vLLM rejects sm_120 → install an upstream cu128 vLLM for **local-only** serving and mark local numbers "non-parity".
  2. Serving still fails after a 4:00 time-box → use a rented 48–80 GB GPU for one day, or run the Getting Started notebook on Kaggle for parity checks and keep local work CPU-only (grading, mining, labeling).
  3. Docker fails on Windows → use the harness `subprocess` sandbox for smoke tests only.

### D.2 Repository and data layout (shared)

```text
g4da/
  agent/              # submission tree (agent.yaml, prompts/, sub_agents/, skills/, configs/, eval_config.yaml, adapters/)
  skills_src/         # skill scripts + their pytest unit tests (tests/ run outside the submission)
  eval/               # run_eval.py, splits/, ledger tools, stats.py (McNemar, Wilcoxon, bootstrap)
  data/               # miners, verifiers, synth bugs, atlas runner, trajectory store (git-ignored outputs)
  train/              # converters, SFT/DPO configs, adapter validators
  paper/              # draft, figures, receipts index
  lab/                # LOCK.md, GATES.md, SUBMISSIONS.md, ledger.jsonl, deviations.md
```

### D.3 Shared data classification schema

All options write to one schema so the agent work, the training data, and the paper share labels.

| Level | Field | Values / definition |
| --- | --- | --- |
| Task | `instance_id`, `repo`, `split` | `lockbox` / `dev` / `dev_fast` / `ood` / `pool` / `mined` / `synthetic` |
| Task | `gradable` | `gold_pass`, `env_dead`, `version_gated`, `flaky` (from O2 audit) |
| Task | `task_type` | `bug_fix` / `feature` / `compat_or_refactor` |
| Task | `mechanism` | Open-coded, then frozen codebook (≤ 12 + `other`); e.g. `state_lifecycle`, `validation_contract`, `encoding_format`, `default_value`, `api_rename`, `async_sync_twin` |
| Task | `complexity_tier` | 1 one file/hunk ≤ 5 lines; 2 one file larger; 3 multi-file independent; 4 multi-file causal; 5 cross-module new behavior |
| Task | `n_files`, `n_hunks`, `changed_lines` | From the gold patch |
| Task | `interference_class` | `single_unit`, `additive`, `redundant`, `conjunctive`, `antagonistic`, `unappliable` (from the O13 atlas) |
| Task | `n_requirements` | Count of independent behaviors the test patch asserts (for the q^n test) |
| Trajectory | `outcome` | `resolved` / `unresolved` |
| Trajectory | `terminate_cause` | `pass`, `wrong_fix`, `no_patch`, `apply_fail`, `timeout`, `turn_cap`, `ctx_overflow`, `forgot_submit`, `protected_only` |
| Trajectory | `failure_code` | F1–F12 (C12 codebook), mapped to FM1–FM10 (C3) |
| Trajectory | metrics | `tool_calls`, `turns`, `gen_tokens`, `wall_s`, `first_edit_idx`, `edits_not_in_final`, `repeat_actions`, `edit_fail_count`, `graph_calls`, `gold_file_hit@k` |
| Decision window | `phase` | `localize` / `reproduce` / `patch` / `verify` / `submit` |
| Decision window | `step_quality` | `good` / `neutral` / `bad` (first divergent step vs a successful sibling trajectory; for DPO) |
| Provenance | `source`, `license`, `teacher`, `receipt_id`, `evidence_tag` | Teacher ∈ {self, open-weight name+version}; evidence tag M/D/I/H |

### D.4 Shared LoRA training recipe (used by O7, O9, O10, O11)

**Sprint-3 spike: training-path decision (C3 §7.3), time-boxed 06:00 Op.**

- **Path A:** load the competition QAT compressed-tensors checkpoint with `transformers` + `compressed-tensors`, freeze it, and attach PEFT LoRA. Best train/serve match. Library support is unverified.
- **Path B (default fallback):** QLoRA (bitsandbytes NF4) on the bf16 `gemma-4-31b-it` weights, adapter applied to the QAT base at serve time. Must A/B on DEV to measure train/serve mismatch.
- **Path C:** Path A or B on a rented 80 GB GPU for one bounded run (document cost under the "reasonableness" rule).

**Adapter format contract** (verified from the sample adapter):

- Tensor keys: `base_model.model.model.language_model.layers.{i}.{self_attn|mlp}.{q,k,v,o,gate,up,down}_proj.lora_{A,B}.weight`
- `base_model_name_or_path: google/gemma-4-31b-it-qat-w4a16-ct`
- `task_type: CAUSAL_LM`
- `.safetensors` only
- Language-model layers only (exclude any vision tower)
- `r ≤ 128`

| Hyperparameter | Start value | Range to sweep | Note |
| --- | --- | --- | --- |
| Rank r / alpha | 16 / 32 | 8–32 / 2r | Small ranks keep files small and may reduce scorer LoRA buffers if the host sizes them to the submission |
| Target modules | q,k,v,o,gate,up,down (language_model only) | attention-only variant | Use the regex shown below the table |
| Dropout | 0.05 | 0–0.1 | |
| LR / schedule | 1e-4 cosine, 3% warmup | 5e-5–2e-4 | |
| Epochs | 2 | 1–3 | Early-stop on held-out loss + DEV pass |
| Micro-batch / grad-accum | 1 / 16 | | Effective batch 16 sequences |
| Sequence length | 8,192 | 4,096–12,288 | Decision windows (D.5) rather than whole episodes |
| Memory techniques | Gradient checkpointing, paged AdamW 8-bit, bf16 compute | | If OOM: 6k sequence length, then r=8 |
| Loss mask | Assistant tokens only (tool calls + visible notes) | | Tool results and system/user tokens masked |
| Thinking content | Strip or keep ≤ 256 tokens | | Thoughts are dropped by the scorer stack (intel Q3) |
| Checkpoints | Every 200 steps; keep 3 | | |
| Validation | 5% held-out windows + DEV-FAST agent run | | |

Target-module regex for PEFT (`target_modules` as a string):

```text
.*language_model.*\.(q_proj|k_proj|v_proj|o_proj|gate_proj|up_proj|down_proj)$
```

### D.5 Shared trajectory → training-example converter

1. Read ATIF traces from `results/traces/`.
2. Keep observations **exactly as the scorer renders them**, including double-JSON escaping and 5,000-char truncation. Training on idealized text would mis-train the escaping behavior (C11 Track 2).
3. Cut each episode into **decision windows**: system + task prompt + compacted history (≤ 6k tokens, mimicking the harness compaction at 14,336 tokens) + the next assistant action.
4. Render with the Gemma 4 chat template from the wheelhouse tokenizer.
5. **Round-trip test:** parse each rendered target with the vLLM `gemma4` tool parser and require an identical tool name and arguments.
6. Write JSONL `{"messages":[...], "meta":{receipt_id, task, split, outcome, step_quality}}`.

### D.6 Shared test-result collection and analysis protocol

| Step | What | Tool |
| --- | --- | --- |
| 1 | Every run writes `summary.json`, per-task traces, patches, Phase-2 logs, and a receipt (git hash, config hash, seed, split, wheelhouse version) | `eval/run_eval.py` |
| 2 | Append per-task rows to `results.csv` using the D.3 schema | `eval/ledger.py` |
| 3 | Paired comparison vs the incumbent on the **same task IDs**: wins/losses table; exact McNemar on resolved; Wilcoxon signed-rank on tokens/time; bootstrap 95% CI on Δresolved (resample tasks) | `eval/stats.py` |
| 4 | Promotion rule: ≥ +3 tasks on DEV (99 or 30-task set) **and** no drop ≥ 2 on OOD (requests+httpx) **and** projected 120-task wall-clock ≤ 10:30 at L4 speed | `lab/GATES.md` |
| 5 | Repeat finalists with 2 seeds; report variance; never react to public-LB Δ < 0.03 | |
| 6 | Weekly failure histogram (terminate_cause × failure_code × repo) chooses the next work item | dashboard |

### D.7 Shared unit-test framework

- Skill scripts are stdlib-only Python 3.13. Each has a `pytest` file in `skills_src/tests/` that runs **inside** `swebench-sandbox:latest` with `--network none` against fixtures extracted from 3 snapshots (fastapi, rich, httpx).
- A test is "passing" only if it passes in the sandbox image. Host Python does not count.
- CI command (AUX1 or MAIN): `docker run --rm --network none -v $PWD:/w swebench-sandbox:latest pytest -q /w/skills_src/tests`. Expected: all green in < 60 s.

---

## Part E — Option project plans

Each option uses the same eight-part template (E1–E8). "LoRA training" for a non-training option states how that option's outputs become training data and whether a dedicated adapter is warranted.

---

### O1 — Runtime budget governor and submission operations

**Goal.** Never lose a run to the 12 h limit. Spend the per-task budget where pass probability rises fastest. Make every daily slot a controlled experiment.

**Hypothesis.** A calibrated cap of about 4–5 agent-minutes covers all ~120 tasks and gives a higher score than longer caps. This follows C15's allocation rule: stop raising the cap where p′(c)/p(c) = 1/(c+o).

**Sources.** C3 budget formula; C15 allocation rule; C12 clock table and speed ratio; C11 SOP; C9 "Save Version then Submit".

**E1 — Data collection (methods)**

1. **Setup-time histogram:** on AUX2, time snapshot extract + editable install for all 129 snapshots with no agent (Docker, 4 parallel).
2. **Local cap sweep:** run DEV_FAST (20 tasks) at caps c ∈ {3, 4, 5, 6} minutes and record resolved, wall time, and first-edit time per task.
3. **Kaggle runtime probe (submission #1):** conservative config `max_time_minutes: 4`, `max_tool_calls: 40`, `max_turns: 40`, `timeout_seconds: 120`. From the Kaggle log record tasks visited, total wall time, median seconds per model turn, and setup seconds.
4. **Speed ratio** = Kaggle seconds/turn ÷ local seconds/turn. Recompute after every scorer-side change.

**E2 — Classification.** Per task: `terminate_cause` (D.3), `wall_s`, `setup_s`, `turns`, `first_edit_idx`. Per run: `tasks_visited`, `total_wall`, `speed_ratio`, `cap_config_hash`.

**E3 — LoRA training.** No dedicated adapter. O1 supplies the **efficiency prior** for O9: when several successful trajectories exist for a task, keep the shortest by tokens and time. Budget-respecting episodes (submit before 90% of the cap) are up-weighted 2×.

**E4 — Test-result analysis.**

- Fit p(c) as an isotonic curve over the 4 cap points.
- Choose c\* = argmax (A(c)/120)·p(c) subject to 120·(c + o)·ratio ≤ 0.875 × 720 min.
- Check that the observed Kaggle total stays within ±10% of the projection.

**E5 — Unit tests**

| Test | Input | Expected result |
| --- | --- | --- |
| `budget.py` cap solver | N=120, o=1.0, ratio=1.4, safety 0.875 | c\* ≤ 3.4 min; raises an error if any field is missing |
| `budget.py` with N=60 | o=1.0, ratio=1.0 | c\* ≈ 9.5 min (C12's 60-task row) |
| `eval_config` validator | YAML with the fields at top level instead of under `evaluation:` | FAIL with a message naming the nesting |
| `eval_config` validator | `max_time_minutes: 45` with N=120 | FAIL: "projected 90:00 h > 10:30 h" |
| Package validator | zip containing a `.bin` file, a symlink, and nested `agent.yaml` | 3 errors, exit code 1 |
| Package validator | valid zip | PASS; prints unpacked size and SHA-256 |

**E6 — Self-improvement loop.** After every Kaggle log: update the speed ratio, re-solve c\*, and write a `deviations.md` line if c\* moves by more than 0.5 min. Each weekly sweep re-fits p(c) with the current brain, because a better brain shifts p(c) toward shorter caps.

**E7 — Milestones and GO/NO-GO**

| Gate | Date | GO if | NO-GO → pivot |
| --- | --- | --- | --- |
| G1 Runtime probe | Oct 6 (submit) / Oct 7 (read) | Run finishes; all tasks visited; wall ≤ 10:30 | (a) Overrun error → cut the cap 30%, resubmit, freeze other LB experiments. (b) Only ~60 tasks visited → raise the cap per the 60-task row. (c) Queue > 24 h → shift calibration to a Kaggle notebook run on 20 tasks |
| G1b Cap freeze | Oct 14 | Fitted c\* stable within ±0.5 min over 2 sweeps | Keep c = 4 and revisit after O9 |

**E8 — Task sequence**

| ID | Task / subtask | Machine | Op | Mach | Dep |
| --- | --- | --- | ---: | ---: | --- |
| O1.1 | Write `eval/budget.py` (cap solver + validators) and its tests | AUX1 | 01:30 | — | D0 |
| O1.2 | Setup-time histogram script; run on 129 snapshots | AUX2 | 00:30 | 03:00 | D0.11 |
| O1.3 | Package validator (`ops/package.py`) and tests | AUX1 | 01:00 | — | D0 |
| O1.4 | Build submission #1 (sample prompt, adapters removed, conservative caps); Save Version → Submit | AUX1 | 00:45 | 13:00 (queue + run) | O1.3 |
| O1.5 | Local cap sweep on DEV_FAST at 4 caps | MAIN | 00:30 | 06:00 | O2.4 |
| O1.6 | Read the Kaggle log; compute the speed ratio; fit p(c); write c\* to `GATES.md` | AUX1 | 01:00 | — | O1.4, O1.5 |
| O1.7 | Ledger + `SUBMISSIONS.md` template; daily SOP checklist | AUX1 | 00:45 | — | — |
| O1.8 | Weekly re-sweep (×5 weeks, 0:20 each) | MAIN | 01:40 | 10:00 | O1.6 |
| **Total** | | | **07:40** | **32:00** | |

---

### O2 — Evaluation factory

**Goal.** Make local numbers predictive of the private leaderboard: a gradable denominator, frozen splits, an OOD holdout, and paired statistics. Then diagnose *where* points are lost with the **ceiling ladder** and the **zero-census**.

**Sources.** C3 LOCKBOX/DEV/PSEUDO-PRIVATE; C12 ceiling ladder and OOD; C15 zero-census and variance protocol; C11/C14 wheel repair and dead-task list; C16 T2 held-out repos; C9 grouped splits and actor/grader separation.

**E1 — Data collection (methods)**

1. **Gold audit:** for all 129 tasks, apply `patch` + `test_patch` in Container-B-equivalent Docker. Record exit code, JUnit counts, and skips. Also run a no-patch control (tests must fail).
2. **Repair layer:**
   - Add the missing wheels (`typing_inspection`, `inline-snapshot`, `dirty-equals`, `ujson`, `orjson`, `python-multipart`).
   - Pin `starlette` per task from the repo metadata instead of the de-duplicated 1.6.0.
   - Re-run the audit.
   - Mark the remaining failures `env_dead`, `version_gated`, or `flaky` (intel lists 12 known IDs).
3. **Splits** (seed `20261001`, hashed, committed), from the ~110 gradable fastapi+rich tasks:
   - `LOCKBOX` 24 (14 fastapi, 10 rich).
   - `DEV` 60 (34 fastapi, 26 rich), with `DEV_FAST` 20 ⊂ DEV.
   - `POOL` 26 (training only).
   - `OOD` = gradable requests + httpx tasks (≈ 6) plus ≥ 30 PSEUDO-PRIVATE mined tasks from O8.
   - Group by `base_commit` so the two shared-commit pairs stay in the same split.
4. **Ceiling ladder on DEV_FAST** (temperature 0, cap c\*):
   - Rung 1, gold replay: expect 20/20.
   - Rung 2, file oracle: gold file paths given.
   - Rung 3, symbol oracle: gold symbols given.
   - Rung 4, blind: issue only.
5. **Zero-census:** histogram of `terminate_cause` on the blind run.
6. **Variance protocol:** 3 repeats of the blind run at temperature 0.2 to estimate σ per task.

**E2 — Classification.** Task-level `gradable`, `split`, `complexity_tier` (auto from the patch: files/hunks/lines; tier 4 vs 3 confirmed by O13), and `mechanism` (open-coded in O13). Run-level D.3 fields.

**E3 — LoRA training.** No adapter. O2 defines **which tasks may supply training data** (POOL + mined + synthetic only; never LOCKBOX/DEV/OOD) and runs the **leakage filter**: drop any mined task whose diff overlaps a LOCKBOX/DEV/OOD gold hunk by more than 50% of lines, or whose base commit equals one in those splits.

**E4 — Test-result analysis.**

- Ladder gaps: localization backlog = file-oracle − blind; editing backlog = gold − file-oracle.
- If file-oracle ≤ 5/20, prioritize O5/O6 literal and edit work. If file-oracle − blind ≥ 4, prioritize O4.
- If zero-census `no_patch + apply_fail + ctx_overflow + timeout` > 30%, prioritize O1/O3/O5 (C15 thesis).

**E5 — Unit tests**

| Test | Input | Expected result |
| --- | --- | --- |
| Gold replay | DEV_FAST 20 gradable tasks | 20/20 resolved (any miss = harness bug) |
| No-patch control | Same 20 | 0/20 resolved |
| Split builder | seed `20261001` run twice | Identical SHA-256 of all split files |
| Leakage filter | Synthetic mined task that copies a LOCKBOX hunk | Rejected with reason `overlap_lockbox` |
| `stats.mcnemar_exact` | b=8, c=1 | p ≈ 0.039 (two-sided) |
| `stats.bootstrap_delta` | Identical arms | 95% CI contains 0 |
| Actor/grader separation | grep the submission tree for any gold hunk line > 40 chars | No matches |

**E6 — Self-improvement loop.** The weekly histogram picks the next option to work on. Each sprint review re-runs DEV (2 seeds) and LOCKBOX (once, at gates only). The OOD set grows as O8 mines more tasks. Any LOCKBOX inspection by a human retires that task to DEV and replaces it from POOL.

**E7 — Milestones and GO/NO-GO**

| Gate | Date | GO if | NO-GO → pivot |
| --- | --- | --- | --- |
| G2 Harness truth | Oct 8 | Gold audit ≥ 90% of non-dead tasks; splits frozen; ladder + zero-census written | (a) Gold < 50% after 3 days → switch grading to Kaggle-notebook subprocess mode (where 71 tasks pass gold per intel) and treat local CV as relative only. (b) Docker unusable → subprocess sandbox for rich only |
| G2b OOD ready | Oct 22 | OOD ≥ 30 tasks gradable | Use leave-one-repo-out on fastapi↔rich as the OOD proxy |

**E8 — Task sequence**

| ID | Task / subtask | Machine | Op | Mach | Dep |
| --- | --- | --- | ---: | ---: | --- |
| O2.1 | Gold/no-patch audit runner (`eval/gold_audit.py`) | AUX1 | 01:30 | — | D0 |
| O2.2 | Run the audit on 129 tasks (8 parallel) | AUX2 | 00:15 | 04:00 | O2.1, D0.11 |
| O2.3 | Repair layer: missing wheels + per-task starlette pins; re-audit | AUX2 | 02:30 | 04:00 | O2.2 |
| O2.4 | Split builder + leakage filter + tests; commit hashes | AUX1 | 01:30 | — | O2.3 |
| O2.5 | `stats.py` (McNemar, Wilcoxon, bootstrap) + tests | AUX1 | 01:30 | — | — |
| O2.6 | Ladder prompts (file-oracle / symbol-oracle variants as user-message injections, dev-only) | AUX1 | 01:00 | — | O2.4 |
| O2.7 | Run ladder rungs 1–4 on DEV_FAST | MAIN | 00:30 | 08:00 | O2.6, D0.10 |
| O2.8 | Blind ×3 repeats (variance) + zero-census | MAIN | 00:30 | 06:00 | O2.7 |
| O2.9 | Results dashboard (DuckDB + markdown report) | AUX1 | 02:00 | — | O2.5 |
| O2.10 | Write the G2 report; choose the emphasis fork | AUX1 | 01:00 | — | O2.7, O2.8 |
| O2.11 | Weekly DEV ×2 seeds (×6 weeks, 0:30 each) | MAIN | 03:00 | 18:00 | all |
| **Total** | | | **15:15** | **40:00** | |

---

### O3 — Harness-robust editing

**Goal.** Drive `edit_file` failures (intel: 62/299 calls; 22% in a controlled test) and tool-call truncations toward 0%.

**Hypothesis.** Most edit failures come from reproducing double-escaped text. Edits that specify **line ranges plus new text** never reproduce old text, so they avoid the problem.

**Sources.** C15 line-splice skill; C11 escaping protocol and Python-one-liner fallback; C14/C16 `write_file` fallback after 2 failures; HARNESS gotcha #1 (split large edits).

**Design (feasible with existing tools).**

1. The agent calls `write_file(".bcf_payload/edit.txt", <new text>)` (its own output, not double-escaped).
2. It calls `run_skill_script` (or `run_command python3 skills/editing/scripts/splice.py --file F --start S --end E`).
3. The script replaces lines S..E with the payload, **deletes `.bcf_payload/`**, and prints a 20-line diff.
4. Day-2 probe confirms: the `run_skill_script` signature, the skill directory path visible to `run_command`, that payload removal leaves no untracked files, and whether `/tmp` is writable via `run_command`. If `/tmp` works, use it instead.

**E1 — Data collection (methods)**

1. Mine every `edit_file`/`write_file` call from O2 and O6 traces. Record `old_string` length, presence of quotes/backslashes/newlines/tabs, success, error type, and the next action.
2. Build a **hostile-content edit suite**: 40 real edit contexts from snapshots containing triple-quoted docstrings, regexes with backslashes, f-strings, tabs, CRLF, and non-ASCII. Each has a target new text.
3. Replay the suite through four arms:
   - (a) native `edit_file`;
   - (b) `edit_file` with the short-anchor protocol;
   - (c) splice skill;
   - (d) `write_file` whole-file (files < 150 lines).

**E2 — Classification.** `edit_result ∈ {ok, not_found, multiple_matches, truncated_call, syntax_error_after, wrong_region}`; `content_hazard` flags {quote, backslash, multiline, tab, crlf, unicode}.

**E3 — LoRA training.** Successful *recovery* sequences (failed edit → re-read → splice → success) are tagged `step_quality=good` and over-sampled 3× in O9 SFT data. Failed blind retries are tagged `bad`; they become DPO negatives in O11. No dedicated adapter.

**E4 — Test-result analysis.** Per-arm success rate with Wilson CIs on the 40-case suite. On DEV runs, `edit_fail_count / edit_calls` and the fraction of tasks lost to edit failures (from failure codes F7/F8). Adopt splice as the default after one failed `edit_file` if its success is ≥ 95%.

**E5 — Unit tests**

| Test | Input | Expected result |
| --- | --- | --- |
| `splice.py` basic | 10-line file, replace lines 3–4 | Exact bytes; other lines unchanged; exit 0 |
| Backslashes/quotes | Replace a regex line `r"\d+\\"` | Byte-identical to payload; `py_compile` passes |
| Tabs/CRLF preserved | CRLF file | Line endings preserved per the original file |
| Out-of-range | start > EOF | Exit 2 with message; file untouched |
| Payload cleanup | After the run | `.bcf_payload/` absent; `git status --porcelain` shows only the target file |
| Hostile suite | 40 cases × splice arm | ≥ 38/40 succeed (expected ~100%; failures only from wrong line numbers) |
| Hostile suite | Native `edit_file` arm | Expected 60–80% (intel baseline); used as control |

**E6 — Self-improvement loop.** Every weekly failure histogram feeds new hostile cases (any F7 in DEV becomes a suite case). The prompt's ladder order is re-tuned by measured success. After O9, check whether the LoRA reduced the need for splice (did native success rise?).

**E7 — Milestones and GO/NO-GO**

| Gate | Date | GO if | NO-GO → pivot |
| --- | --- | --- | --- |
| G3a Probe | Oct 3 | Payload + script route works in the sandbox without leaving files | Pivot: `run_command` with a Python heredoc via base64-encoded new text (`python3 -c "import base64…"`), which avoids quoting; else full `write_file` for small files |
| G3b Adopt | Oct 12 | Splice ≥ 95% on the suite; DEV F7 share < 5% | Keep anchor protocol + `write_file` fallback; re-probe if the host ships the raw-text fix |

**E8 — Task sequence**

| ID | Task / subtask | Machine | Op | Mach | Dep |
| --- | --- | --- | ---: | ---: | --- |
| O3.1 | Day-2 sandbox probe (skill path, `run_skill_script` args, `/tmp` writability, payload cleanup) | MAIN | 01:00 | 00:20 | D0.10 |
| O3.2 | `splice.py` + `SKILL.md` + 6 unit tests | AUX1 | 02:00 | — | O3.1 |
| O3.3 | Build the 40-case hostile suite from snapshots | AUX1 | 02:00 | — | O2.4 |
| O3.4 | Replay the suite through 4 arms (agent-driven micro-tasks) | MAIN | 00:30 | 02:00 | O3.2, O3.3 |
| O3.5 | Prompt ladder text (anchor → re-read → splice → write) | AUX1 | 00:45 | — | O3.4 |
| O3.6 | DEV run with the new ladder; paired vs incumbent | MAIN | 00:30 | 05:00 | O3.5 |
| O3.7 | Analysis + `GATES.md` entry | AUX1 | 00:45 | — | O3.6 |
| **Total** | | | **07:30** | **07:20** | |

---

### O4 — Localization stack

**Goal.** Raise localization hit-rate and cut wasted reads, using only repo-agnostic machinery (the hidden repos are private).

**Hypothesis.** Symbol harvesting + BM25 over identifiers/docstrings/strings + AST outlines + graph neighbors beats raw grep. A read-only localizer AgentTool keeps the coder's 32k context clean.

**Sources.** C3 `locate.py`/`outline.py`/`find_tests.py`; C12 `harvest_symbols` + localizer contract; C15 mirror-tree detector; C14 sync/async twin signal; HARNESS gotcha #4 (AgentTool isolation); C9 lexical-first ladder.

**E1 — Data collection (methods)**

1. **Offline gold labels** (dev-only; never shipped): for each DEV/POOL task, the gold files, gold symbols (map hunk line ranges → enclosing `def`/`class` via `ast`), and gold node IDs in the task graph.
2. **Retrieval benchmark:** for 60 DEV tasks, run each retriever on the issue text alone and record ranked files/symbols. Retrievers:
   - (i) grep keywords;
   - (ii) `harvest_symbols` → exact `search_similar_code`;
   - (iii) BM25 `locate.py`;
   - (iv) (iii) + `get_code_neighbors` expansion;
   - (v) union with reciprocal-rank fusion.
3. **Agent traces** from DEV runs with the localizer AgentTool: localizer card, tool calls, tokens, and whether the coder edited a carded file.

**E2 — Classification.** `retrieval_hit@{1,3,5,10}` (file and symbol), `MRR`, `n_tool_calls_to_first_gold_read`, `F9` (empty English query), `card_followed` (bool), `mirror_needed` (task has twin trees).

**E3 — LoRA training.** Localizer decision windows (issue → localizer tool calls → card) from **resolved** trajectories become the `localizer_lora` dataset in O10. The card is a fixed JSON block, so it is easy to supervise. Labels may add *gold* file/symbol cards from POOL tasks as teacher-forced targets (C12 "localizer cards from gold hunks"), always marked `source=gold_card`.

**E4 — Test-result analysis.** Compare retrievers on hit@5 and MRR with paired bootstrap. Then measure end-to-end: DEV resolved with/without the localizer AgentTool, plus coder context tokens per turn. Use the ceiling ladder: success means blind closes ≥ 30% of the (symbol-oracle − blind) gap.

**E5 — Unit tests**

| Test | Input | Expected result |
| --- | --- | --- |
| `harvest_symbols` | Issue text with `HTTPParser.complete -> .reset` and `KeyboardException` | `["HTTPParser.complete", "reset", "KeyboardException", "HTTPParser"]`; no English words |
| `harvest_symbols` | Prose-only issue | Empty list → triggers the BM25 path |
| `locate.py` | httpx_3672 snapshot, query from issue | `src/httpx/_parsers.py` and `src/ahttpx/_parsers.py` in the top 5 |
| `outline.py` | `_server.py` | Function list with line ranges matching `ast` exactly |
| Mirror detector | httpx_3672 snapshot | Reports the pair `src/httpx` ↔ `src/ahttpx` with ≥ 90% filename overlap |
| Mirror detector | fastapi snapshot | No twin reported |
| Localizer YAML | `sub_agents/localizer.yaml` | Tools exactly {read_file, search_similar_code, get_code_neighbors, get_code_subgraph, run_skill_script}; no edit/write/submit |
| Retrieval bench | 60 DEV tasks | Fused retriever file hit@5 ≥ 0.60 (estimate; replace with measured) |

**E6 — Self-improvement loop.** Each week, add the DEV tasks where the gold file was missing from the card to a "miss list". Inspect them for a missing signal (e.g., string literal not indexed) and add a feature to `locate.py`. Re-run the 60-task retrieval bench (CPU, 10 minutes) before any agent run.

**E7 — Milestones and GO/NO-GO**

| Gate | Date | GO if | NO-GO → pivot |
| --- | --- | --- | --- |
| G4a Retrieval | Oct 11 | Fused hit@5 ≥ 0.60 and better than grep by ≥ 0.10 | Keep grep-first with a strict output cap; drop graph expansion |
| G4b AgentTool | Oct 15 | DEV resolved ≥ incumbent and coder tokens/turn −20% | Revert to a flat agent with `locate.py` called directly (C3 DG2 fallback) |

**E8 — Task sequence**

| ID | Task / subtask | Machine | Op | Mach | Dep |
| --- | --- | --- | ---: | ---: | --- |
| O4.1 | Offline gold file/symbol labeler (dev-only) | AUX1 | 01:30 | 00:20 | O2.4 |
| O4.2 | `harvest_symbols.py` + tests | AUX1 | 01:30 | — | O3.1 |
| O4.3 | `locate.py` (stdlib BM25 over identifiers/docstrings/strings) + tests | AUX1 | 03:00 | — | O3.1 |
| O4.4 | `outline.py`, `find_tests.py` + tests | AUX1 | 01:30 | — | O3.1 |
| O4.5 | Mirror-tree detector + tests | AUX1 | 01:00 | — | O3.1 |
| O4.6 | Retrieval bench harness; run 5 retrievers × 60 tasks | AUX2 | 01:30 | 01:00 | O4.1–O4.5 |
| O4.7 | Localizer AgentTool YAML + `localizer.md` prompt (card schema) | AUX1 | 01:30 | — | O4.6 |
| O4.8 | DEV run ±localizer; paired analysis | MAIN | 00:45 | 10:00 | O4.7 |
| O4.9 | Graph-tool usage rules in prompt (neighbors first, symbol strings only, k ≤ 5) | AUX1 | 00:30 | — | O4.6 |
| O4.10 | Weekly miss-list review (×4, 0:45) | AUX1 | 03:00 | 04:00 | O4.8 |
| **Total** | | | **15:45** | **15:20** | |

---

### O5 — Verification and patch hygiene

**Goal.** Eliminate self-inflicted zeros: test or config edits that get reset, scratch files in the diff, syntax errors, unapplyable patches, and regressions in neighboring tests.

**Sources.** C3 `run_tests.py`/`patch_guard.py`; C12 F2/F3/F6/F11 codes and early-edit rule; C9 testing ladder; BCF gates G2/G3/G5/G6 (advisory, per C9's hard-vs-advisory rule); HARNESS §8.2.

**E1 — Data collection.** From all runs, collect: diffs touching protected paths, untracked files, apply-failure logs from Phase 2, pre/post pass sets of the touched test module, and time spent in `pytest`. Build a **hygiene corpus** of 30 synthetic dirty workspaces (scratch files, `conftest.py` edits, CRLF changes, a syntax error, a duplicate `def`).

**E2 — Classification.** `hygiene_violation ∈ {protected_path, scratch_file, syntax_error, apply_fail, p2p_regression, empty_diff}`; `test_scope ∈ {node, module, none_found}`; `pytest_seconds`.

**E3 — LoRA training.** Trajectories whose final `patch_guard` was clean and resolved get `good` tags. Any trajectory with a hygiene violation is **excluded** from SFT (O9 filter) and used as a DPO negative (O11). This is C3's "guard-clean shortest successful" selection rule.

**E4 — Test-result analysis.** Violation rate per 100 tasks before/after; P2P regression rate on DEV; average pytest seconds per task (must stay ≤ 25% of the cap).

**E5 — Unit tests**

| Test | Input | Expected result |
| --- | --- | --- |
| `patch_guard.py` | Workspace with `/workspace/repro.py` | Flags `scratch_file`; with `--fix` deletes it; exit 1 then 0 |
| `patch_guard.py` | Edit to `tests/test_x.py` only | Flags `protected_path` + "fix would be discarded" |
| `patch_guard.py` | Syntax error in an edited `.py` | Flags `syntax_error` with line number |
| `patch_guard.py` | Clean edit | Exit 0; prints a `git diff --stat` ≤ 15 lines |
| Apply check | Export `git diff _swegemma_baseline` and apply to a fresh worktree | `git apply --check` exit 0 |
| `run_tests.py` | Module with 1 failing test | ≤ 40 lines; shows node id + assertion; `--timeout 45` honored |
| `run_tests.py` | No tests found | Prints `none_found`; suggests a `/tmp` probe; exit 0 |
| Hygiene corpus | 30 dirty workspaces | 30/30 correctly classified |

**E6 — Self-improvement loop.** Every Phase-2 apply failure or protected-path loss on DEV becomes a new hygiene-corpus case. The prompt rule list is ordered by measured frequency.

**E7 — Milestones and GO/NO-GO**

| Gate | Date | GO if | NO-GO → pivot |
| --- | --- | --- | --- |
| G5 Hygiene | Oct 12 | Violations < 1 per 100 tasks on DEV; P2P regressions not up | If guard calls cost > 10% of tool calls, drop to a single pre-submit call and remove per-edit calls |

**E8 — Task sequence**

| ID | Task / subtask | Machine | Op | Mach | Dep |
| --- | --- | --- | ---: | ---: | --- |
| O5.1 | `patch_guard.py` + 6 tests | AUX1 | 02:00 | — | O3.1 |
| O5.2 | `run_tests.py` + 4 tests | AUX1 | 01:30 | — | O3.1 |
| O5.3 | 30-case hygiene corpus generator | AUX1 | 01:30 | — | O2.4 |
| O5.4 | Prompt rules: early edit by 50% of budget, `/tmp` probes, guard before submit | AUX1 | 00:30 | — | O5.1 |
| O5.5 | DEV run; paired analysis | MAIN | 00:30 | 05:00 | O5.4 |
| O5.6 | Analysis + gate entry | AUX1 | 00:30 | — | O5.5 |
| O5.7 | Weekly corpus additions (×4, 0:15) | AUX1 | 01:00 | — | — |
| **Total** | | | **07:30** | **05:00** | |

---

### O6 — Prompt doctrine and sampling configuration

**Goal.** Get the most out of the frozen model under the harness's quirks: thinking dropped between calls, 32k context, compaction at 14,336 tokens, and nudges.

**Sources.** C11 7-rule doctrine ("think in the open"); C15 visible STATE/NEXT/WHY block; C12 thinking sweep 512–4,096 and `max_output_tokens` 4,096; C3 short-thinking hypothesis; C9 "do not make success depend on retained hidden reasoning".

**E1 — Data collection.** Factorial sweep on DEV_FAST (20 tasks, 2 seeds):

- `thinking_budget` ∈ {0, 512, 1024, 2048}
- `temperature` ∈ {0, 0.2}
- `max_output_tokens` ∈ {4096, 8192}
- Prompt variant ∈ {doctrine-only, doctrine + STATE block}

That is 32 cells. Prune with a fractional design: run 12 cells first, then confirm the top 3 on full DEV. Record per-turn tokens, nudges, truncations, and resolved.

**E2 — Classification.** `nudge_type` (unclosed tag / MAX_TOKENS / normal), `truncation`, `state_block_present`, `reasoning_tokens`.

**E3 — LoRA training.** The winning config becomes the **rollout config** for O9 data generation (temperature raised to 0.6–0.7 for diversity). SFT targets keep the visible STATE block, so the adapter learns to externalize state. No dedicated adapter.

**E4 — Test-result analysis.** Two-way ANOVA-style effects on resolved and on nudges. Choose the config that maximizes resolved with nudges < 2% of turns. Re-probe thinking after any host patch (intel: the thinking fix had no rescore).

**E5 — Unit tests**

| Test | Input | Expected result |
| --- | --- | --- |
| YAML compile | `agent.yaml` + includes via the `adk-submission` compiler | Compiles; one declared model; no unknown keys |
| Tool-call format (Promptfoo-style, local vLLM) | 10 frozen first-turn prompts | 10/10 valid gemma4 tool calls; 0 prose-only replies |
| STATE block | 10 frozen mid-episode prompts | ≥ 9/10 replies contain a STATE/NEXT/WHY block ≤ 60 tokens before the tool call |
| Truncation guard | Prompt asking for a 300-line edit | Model splits into ≤ 120-line edits (expected after doctrine); no unclosed tag |
| `sampling.yaml` | `thinking_level` present | Validator warns (vLLM drops it; use `thinking_budget`) |

**E6 — Self-improvement loop.** Prompt changes go through the Promptfoo suite (seconds) before any DEV run (hours). One change per day. Keep `deviations.md` for every change after the S3 prompt freeze.

**E7 — Milestones and GO/NO-GO**

| Gate | Date | GO if | NO-GO → pivot |
| --- | --- | --- | --- |
| G6 Config freeze | Oct 13 | Winner beats the incumbent on DEV by ≥ 2 tasks or cuts nudges ≥ 50% at equal resolved | Keep the safest config: thinking 1024, temperature 0.2, 8192 output tokens |
| G6b Re-probe | After any host thinking/escaping patch | Re-run the top 3 cells | Revert to the pre-patch config if worse |

**E8 — Task sequence**

| ID | Task / subtask | Machine | Op | Mach | Dep |
| --- | --- | --- | ---: | ---: | --- |
| O6.1 | Write the doctrine prompt v1 (≤ 60 lines; each rule mapped to a failure code) | AUX1 | 01:30 | — | O2.10 |
| O6.2 | Promptfoo-style local suite (10 + 10 cases) | AUX1 | 01:30 | — | D0.9 |
| O6.3 | Fractional sweep (12 cells × 20 tasks × 2 seeds) | MAIN | 00:45 | 16:00 | O6.1 |
| O6.4 | Confirm top 3 on DEV | MAIN | 00:30 | 09:00 | O6.3 |
| O6.5 | Analysis + freeze | AUX1 | 01:00 | — | O6.4 |
| O6.6 | Re-probes after host patches (×2, 0:45) | MAIN | 01:30 | 06:00 | — |
| **Total** | | | **06:45** | **31:00** | |

---

### O7 — LoRA serving qualification and scorer canary

**Goal.** Get a decisive, variance-proof answer on whether the **scorer** applies LoRA adapters without stalling, before any serious training investment.

**Sources.** C15 destructive-adapter canary; C9 three adapter gates; C10/C13/C14 loud adapter, KV survival, and zeroing log signature; C11 canary rule; C12 format-lock test.

**E1 — Data collection (methods)**

1. **Loud adapter (local):** rank 8 on all language-model layers, random Gaussian A and B (std 0.02).
2. **Destructive adapter (local, then scorer):** 300 steps of SFT on a corrupt target. Every assistant turn becomes `submit_patch()` immediately, with no edits. If the scorer applies it, the public score collapses toward 0.00.
3. **Benign tiny adapter:** r=8, 50 steps on resolved trajectories (near-identity). Tests that runs complete with an adapter mounted.
4. Local measurements:
   - logprob diff vs base at temperature 0 on 20 prompts;
   - vLLM debug log for "No LoRA weights found" (zeroing signature);
   - KV pool size with and without `--enable-lora`;
   - 12k-token prompt latency with the adapter.

**E2 — Classification.** `adapter_active ∈ {yes, no}`, `kv_tokens_available`, `long_prompt_ok`, `format_lock_pass` (20/20), `scorer_canary ∈ {collapsed, unchanged, errored}`.

**E3 — LoRA training (canary adapters only)**

- Loud adapter: no training (random init via PEFT, then save).
- Destructive adapter: shared recipe (D.4) with r=8, lr 2e-4, 300 steps, sequence 2k, on 200 synthetic windows. About 00:30 machine.
- Validate tensor keys and `adapter_config.json` against the sample format (D.4 contract).

**E4 — Test-result analysis**

| Canary result | Interpretation | Decision |
| --- | --- | --- |
| Destructive score ≈ 0.00 and run completes | Adapters applied; KV OK | **GO** for O9 |
| Destructive score ≈ incumbent | Adapters inert (zeroing) | **NO-GO**; re-test after host fix |
| Run errors or stalls | KV collapse | **NO-GO**; retry with r=8 after a host fix |

**E5 — Unit tests**

| Test | Input | Expected result |
| --- | --- | --- |
| Adapter key check | Saved adapter | All keys match `base_model.model.model.language_model.layers.{i}.(self_attn\|mlp).*_proj.lora_(A\|B).weight`; no vision keys |
| Config check | `adapter_config.json` | `r ≤ 128`; base name `google/gemma-4-31b-it-qat-w4a16-ct`; `.safetensors` present |
| Loud activation | 20 prompts, temperature 0 | ≥ 18/20 outputs differ from base; mean abs logprob Δ > 0.1 |
| Zeroing signature | vLLM debug log | No "No LoRA weights found" lines |
| KV survival | 12,000-token prompt with adapter | Completes in < 120 s locally |
| Format lock | 20 tool-call prompts with the benign adapter | 20/20 parse under the gemma4 parser |
| Size | Zip with adapter | Unpacked < 3 GiB; validator PASS |

**E6 — Self-improvement loop.** Re-run the scorer canary only after a host announcement claims a fix (watch threads 743508/744331). Every adapter later produced by O9/O10 must pass the local E5 suite before upload.

**E7 — Milestones and GO/NO-GO**

| Gate | Date | GO if | NO-GO → pivot |
| --- | --- | --- | --- |
| G7a Local | Oct 10 | Loud active, no zeroing, KV OK with wheelhouse vLLM | Local LoRA path broken → report to the host; keep O9 data collection running (data is reusable) |
| **G7b Scorer canary** | Submit Oct 16, read Oct 17 | Destructive canary collapses the score | **NO-GO** → skip O9–O11 training and move effort to O4/O12/O13. Re-canary weekly after host fixes. Keep finals adapter-free |

**E8 — Task sequence**

| ID | Task / subtask | Machine | Op | Mach | Dep |
| --- | --- | --- | ---: | ---: | --- |
| O7.1 | Adapter validator script (keys, config, size) + tests | AUX1 | 01:00 | — | D0 |
| O7.2 | Build the loud adapter; local activation + zeroing + KV tests | MAIN | 01:00 | 00:45 | D0.9, O7.1 |
| O7.3 | Training-path spike (D.4 Path A/B) on a 50-step job | MAIN | 02:00 | 02:00 | O7.2 |
| O7.4 | Destructive + benign adapters | MAIN | 00:45 | 01:00 | O7.3 |
| O7.5 | Format-lock test | MAIN | 00:30 | 00:15 | O7.4 |
| O7.6 | Scorer canary submission (destructive, incumbent prompt) | AUX1 | 00:30 | 13:00 | O7.5, G1 |
| O7.7 | Read result; decide G7b; update `GATES.md` | AUX1 | 00:30 | — | O7.6 |
| **Total** | | | **06:15** | **17:00** | |

---

### O8 — Task factory: mined, external, synthetic, and two-fault tasks

**Goal.** Produce enough verified, leakage-free, license-clean tasks to (a) train adapters without touching evaluation splits, (b) build an OOD estimate of the private-repo test set, and (c) create controlled masking/interference cases for O12/O13.

**Sources.** C3 snapshot-history mining and AST mutation; C12 synthetic bugs in permissive repos; C13 shared-base-commit two-fault benchmark; C16 T2 held-out-repo mining; C11/C12 catalogs (SWE-smith, SWE-Gym, R2E-Gym, SWE-rebench-V2); the organizers' own curation recipe (Data page: commits touching code + tests, fail-to-pass verified).

**E1 — Data collection (methods)**

| Method | Procedure | Target yield |
| --- | --- | --- |
| M1 Snapshot history | In each snapshot repo, `git log --name-only` up to the base commit. Keep commits that change ≥ 1 non-test `.py` file **and** ≥ 1 test file, with ≤ 200 changed lines. Split the diff into `patch` (non-test) and `test_patch` (test files). | 300–600 candidates → 150–300 verified |
| M2 External permissive repos (OOD) | Pick 6–10 MIT/BSD/Apache pure-Python libraries **not** among fastapi/rich/requests/httpx (verify each license in a log). Build the env online on AUX2, freeze wheels, then evaluate offline. Same commit filter. | ≥ 30 verified (OOD), ≥ 100 (training) |
| M3 AST mutation | On functions covered by an existing passing test, apply one operator: flip comparison, drop guard, off-by-one, wrong default, **remove call parentheses**, swap arguments, delete `return`. Keep if ≥ 1 test fails and revert passes. | 500 verified |
| M4 SWE-smith env builder (optional) | Use SWE-smith to synthesize tasks for the external repos. Check its license and that no target repo of the competition is duplicated | +100–300 |
| M5 Two-fault composition | Apply 2 compatible mutations in one repo. Run 4 variants (none / A / B / AB) on the union of their failing tests. Keep pairs where masking or interference occurs (definitions in O13). Also compose the two shared-base-commit task pairs (129 task files vs 127 commit files) | 40 masking pairs |
| Issue text | Local Gemma (open weights, allowed) writes a terse issue from commit message + failing-test output. A regex guard bans file paths and function names not in the commit message. 30% are made "PR-title terse" to match the 29% short statements in the real set | — |
| Verification | Fail-to-pass and pass-to-pass in the sandbox image (`--network none`) on AUX2, 8 parallel | — |

**E2 — Classification.** D.3 task fields plus `origin ∈ {m1, m2, m3, m4, m5}`, `license`, `mutation_op`, and `interference_class` (M5). Difficulty is measured as the incumbent agent's pass rate per origin.

**E3 — LoRA training.** O8 produces **tasks**, not training rows. O9 rolls out on M1/M3/M4/M5 tasks. M2 tasks are split: 30 frozen as OOD (never trained on), the rest allowed in training. A leakage filter (O2) runs before any rollout.

**E4 — Test-result analysis**

- Yield per method (verified / attempted).
- Difficulty band: incumbent pass rate per origin should be 10–40%. Outside that band, the tasks are too easy or too hard to teach.
- Correlation of agent rank across DEV vs OOD (Spearman) to confirm OOD predicts transfer. This is C16's "T2↔T3" check, done with LB probes later.

**E5 — Unit tests**

| Test | Input | Expected result |
| --- | --- | --- |
| Commit splitter | A known commit touching `src/x.py` and `tests/test_x.py` | `patch` has only `src/x.py`; `test_patch` has only the test |
| F2P verifier | The commit above at its parent | Fails before, passes after |
| Mutation `remove_call_parens` | `self._parser.complete()` | Becomes `self._parser.complete`; file compiles |
| Mutation keep-rule | Mutation that breaks no test | Rejected (`no_failing_test`) |
| Issue-text guard | Generated text containing `src/x.py` | Rejected; regenerated |
| Leakage | Mined task equal to a DEV gold diff | Rejected `overlap_dev` |
| License log | External repo without an OSI license | Blocked from mining |
| Two-fault classifier | Toy pair where A's early `return` hides B | `masking` |

**E6 — Self-improvement loop.** Each round, oversample the origins and mechanisms where the agent fails most (hard-negative mining) while keeping the 10–40% band. Add mutation operators that mirror new failure codes (e.g., literal-string mismatches F5 → "wrong error message" mutation).

**E7 — Milestones and GO/NO-GO**

| Gate | Date | GO if | NO-GO → pivot |
| --- | --- | --- | --- |
| G8a | Oct 18 | ≥ 150 verified M1+M3 tasks | Use SWE-Gym / SWE-smith tasks (license-checked) as the training pool |
| G8b | Oct 22 | OOD ≥ 30 gradable M2 tasks; ≥ 20 masking pairs | OOD = leave-one-repo-out; paper uses fewer pairs |

**E8 — Task sequence**

| ID | Task / subtask | Machine | Op | Mach | Dep |
| --- | --- | --- | ---: | ---: | --- |
| O8.1 | Commit miner + splitter + tests | AUX1 | 02:30 | — | O2.4 |
| O8.2 | Run M1 on 4 repos; verify F2P (8 parallel) | AUX2 | 00:30 | 10:00 | O8.1 |
| O8.3 | Choose and license-check 6–10 external repos; build envs/wheels online | AUX2 | 02:30 | 03:00 | — |
| O8.4 | Run M2 mining + verification | AUX2 | 00:30 | 12:00 | O8.3 |
| O8.5 | Mutation engine (7 operators) + tests | AUX1 | 03:00 | — | — |
| O8.6 | Run M3 on snapshots + external repos | AUX2 | 00:30 | 10:00 | O8.5 |
| O8.7 | Issue-text generator (local Gemma via MAIN vLLM, at night) + guard | MAIN | 01:30 | 06:00 | O8.2 |
| O8.8 | M5 two-fault composer + 4-variant runner | AUX1/AUX2 | 02:30 | 08:00 | O8.6 |
| O8.9 | Leakage filter, dataset card, license log | AUX1 | 01:30 | — | O8.2–O8.8 |
| O8.10 | Difficulty calibration run (incumbent on 100 sampled tasks) | MAIN | 00:30 | 09:00 | O8.9 |
| O8.11 | Analysis + gate entries | AUX1 | 01:00 | — | O8.10 |
| **Total** | | | **17:00** | **58:00** | |

---

### O9 — Trajectory engine + SFT LoRA by rejection sampling / expert iteration (`coder_lora`)

**Goal.** Bake the scaffold's best behaviors (tool-format fidelity, early edit, escaping recovery, submit discipline) into the policy. Improve resolution on unseen repos at the same or lower time per task.

**Precondition.** **G7b = GO** (scorer applies adapters without stalling). Data collection may start before G7b because the data is reusable for paper analysis and a later canary.

**Sources.** C3 RFT recipe (shortest verified successes, 2–3 rounds); C11 harness-native format (double-escaped observations); C12 format-lock and rejection sampling; C15 SFT on tool-call/edit spans; C16 STaR rounds; C9 "hundreds of verified decision windows before tens of thousands of unverified".

**E1 — Training-data collection (methods)**

1. **Policy:** the current best no-adapter brain at temperature 0.7, top-p 0.95. The cap equals the submission cap scaled by the speed ratio.
2. **Task pool:** POOL (26) + M1 + M3 + M4 + M5 + M2-train. **Never** LOCKBOX, DEV, or OOD.
3. **Sampling:** K = 4 trajectories per task. MAIN serves vLLM with concurrency 3 (16k context, fp8 KV). AUX2 runs the sandboxes and Phase-2 grading.
4. **Throughput estimate:** ~5 min/episode × 1/3 concurrency ⇒ ~36 episodes/hour ⇒ 1,600 episodes ≈ 45:00 machine. Replace with measured numbers on day 1.
5. **Keep rule:** resolved **and** `patch_guard` clean **and** no nudges **and** wall time ≤ cap. Then keep the 1–2 shortest per task (C3 efficiency prior).
6. **Recovery augmentation:** keep resolved trajectories containing ≥ 1 failed edit followed by successful recovery (O3). Oversample 3×.
7. **Optional teacher (open weights only, license-logged):** for tasks the student never solves, a stronger open-weight coder run through the **same harness tools**, on a rented GPU for ≤ 1 day. Teacher trajectories are capped at 30% of the mix (C11 2:1 self:teacher).
8. **Conversion:** D.5 converter into decision windows (≤ 8,192 tokens).

**E2 — Data classification.** Each window carries `phase`, `step_quality` (`good` for steps in resolved trajectories; `bad` only for O11), `origin`, `teacher`, `mechanism`, `complexity_tier`, and the `receipt_id` of the producing run. Report the mix by phase so localization/patch/verify steps are each ≥ 15% of windows.

**E3 — LoRA training (shared recipe D.4)**

| Round | Data | Config | Machine time (est.) |
| --- | --- | --- | --- |
| Pilot | 200 windows | r=16, 200 steps; overfit check | 00:45 |
| R1 `coder_lora_v1` | 2,500 windows (≈ 15M tokens/epoch) | r=16, α=32, lr 1e-4, 2 epochs, seq 8k | 08:00–14:00 (measure the tokens/s in the pilot) |
| R1b contrast | Same data | r=32 or lr 5e-5 | Same |
| R2 `coder_lora_v2` | R1 data + new successes from v1 rollouts (+30–50%) | Best R1 config | 10:00–18:00 |

Steps per round:

1. Train.
2. Export `.safetensors`.
3. Run the O7 E5 suite (keys/config/activation/format-lock/KV).
4. Run DEV-FAST, then DEV and OOD paired against the no-adapter incumbent.

**E4 — Test-result collection and analysis**

- Primary: Δresolved on DEV (paired McNemar) and on OOD.
- Secondary: tool-call validity, edit-failure rate, tokens per task, wall time per task (L4-equivalent), nudge rate.
- Promotion rule (D.6): ≥ +3 DEV, no OOD drop ≥ 2, time within budget.
- If it passes, schedule one scorer submission. Compare to the incumbent's LB score knowing ±0.04 noise.
- Report curves: resolved vs data size (subsample 25/50/100%) to decide whether more rollouts pay.

**E5 — Unit tests**

| Test | Input | Expected result |
| --- | --- | --- |
| Converter round-trip | 500 random windows | 100% parse to identical tool name/args under the gemma4 parser |
| Loss mask | 10 windows | Masked-token count = all non-assistant tokens; assistant tokens > 0 |
| Escaping fidelity | Window with a tool result containing `\n` | Observation text byte-equal to what the harness sent |
| No-leak | Training metadata | 0 IDs from LOCKBOX/DEV/OOD; 0 gold-hunk lines from those splits |
| Overfit pilot | 20 windows, 100 steps | Training loss < 0.1 (pipeline sanity) |
| Adapter suite | v1 | Passes all O7 E5 tests |
| Regression | v1 vs base on DEV-FAST | Resolved ≥ base − 1 (abort the round otherwise) |

**E6 — Self-improvement loop (expert iteration)**

```text
policy_k --(rollouts on train pool, K=4, T=0.7)--> verified successes
   --(keep shortest, guard-clean, + recovery oversample)--> SFT windows
   --(train LoRA_k+1, validate O7 suite)--> paired DEV/OOD test
   --(promote if gate passes)--> policy_k+1  (repeat; stop when Δ < 2 tasks/round)
```

Hard-negative mining: the next round's rollouts focus on tasks with 0 of 4 successes but non-zero partial progress (correct file edited).

**E7 — Milestones and GO/NO-GO**

| Gate | Date | GO if | NO-GO → pivot |
| --- | --- | --- | --- |
| G9-pre | Oct 22 | ≥ 300 verified successful trajectories | Add the open-weight teacher (1-day rental) or lower K to 2 and widen the pool |
| G9a R1 | Oct 28 | v1 ≥ +3 DEV, OOD no drop, time OK, G7b GO | (a) Check format/mask/escaping fidelity; (b) attention-only r=8; (c) if still flat → stop training and redeploy hours to O4/O12/O13 |
| G9b R2 | Nov 4 | v2 ≥ v1 + 2 DEV | Freeze v1 |
| G9c LB | Nov 5–7 | Adapter submission completes and its LB ≥ incumbent − 0.02 | Keep the adapter as Final B only if OOD favors it; else adapter-free finals |

**E8 — Task sequence**

| ID | Task / subtask | Machine | Op | Mach | Dep |
| --- | --- | --- | ---: | ---: | --- |
| O9.1 | Rollout orchestrator (queue, resume, receipts; HIVE-Lite style) | AUX1 | 03:00 | — | O2, O8.9 |
| O9.2 | Rollout batch 1 (1,600 episodes) + grading | MAIN/AUX2 | 01:00 | 45:00 | O9.1, O6.5 |
| O9.3 | Keep-rule filter + selection + recovery oversampling | AUX1 | 01:30 | 00:30 | O9.2 |
| O9.4 | D.5 converter + tests | AUX1 | 03:00 | — | — |
| O9.5 | Pilot training + overfit test | MAIN | 01:00 | 01:00 | O7.3, O9.4 |
| O9.6 | Train v1 + contrast v1b (two nights) | MAIN | 01:00 | 24:00 | O9.5 |
| O9.7 | Validate adapters (O7 suite) + DEV/OOD paired runs | MAIN | 01:30 | 14:00 | O9.6 |
| O9.8 | Analysis + G9a decision | AUX1 | 01:30 | — | O9.7 |
| O9.9 | Rollouts with v1 (round 2 data) | MAIN/AUX2 | 00:45 | 30:00 | G9a |
| O9.10 | Train v2 + validate + paired runs | MAIN | 02:00 | 30:00 | O9.9 |
| O9.11 | Analysis + G9b; schedule the LB submission | AUX1 | 01:00 | — | O9.10 |
| O9.12 | LB adapter submission + readout | AUX1 | 00:30 | 13:00 | G9b, G7b |
| **Total** | | | **17:45** | **157:30** | |

---

### O10 — Role adapters (`localizer_lora` + `editor_lora`) with multi-LoRA routing

**Goal.** Specialize the read-only localizer and the editing root with separate small adapters (C3 L9, C12 §8.6), routed by `adapter:` in each YAML.

**Precondition.** G7b GO and G9a GO.

**E1 — Data collection.**

- Localizer windows: issue → localizer tool calls → card, from resolved trajectories (O4 E3), plus gold-card targets from POOL/M1 (`source=gold_card`, ≤ 30%).
- Editor windows: card → read → edit → verify → submit, from resolved trajectories.

**E2 — Classification.** `role ∈ {localizer, editor}`; card validity (schema); `card_hit` (gold file in card).

**E3 — LoRA training.** D.4 recipe with r=16.

| Adapter | Sequence length | Approx. machine time |
| --- | --- | --- |
| `localizer_lora` | 4k (short windows) | 04:00 |
| `editor_lora` | 8k | 08:00 |

Route in `agent.yaml` (root `adapter: editor_lora`) and in `sub_agents/localizer.yaml` (`adapter: localizer_lora`). Serving loads 2 adapters, so re-run KV survival.

**E4 — Analysis.** Paired DEV/OOD across four arms: single `coder_lora` vs role pair vs localizer-only vs editor-only. Card hit@3 for the localizer.

**E5 — Unit tests**

| Test | Expected result |
| --- | --- |
| Card schema validity on 50 localizer outputs | ≥ 48/50 valid JSON cards |
| Card hit@3 on DEV | ≥ base localizer + 0.05 |
| Two-adapter KV survival (12k prompt) | Completes < 150 s locally |
| YAML compile with 2 adapters | Passes; both adapters discovered |
| Zip size | < 3 GiB (2 × r16 ≈ 0.3–0.5 GB) |

**E6 — Loop.** Retrain only the role that regressed. Localizer data grows fastest (cheap windows).

**E7 — GO/NO-GO**

| Gate | Date | GO if | NO-GO → pivot |
| --- | --- | --- | --- |
| G10 | Nov 4 | Role pair ≥ single `coder_lora` + 2 DEV, OOD no drop | Keep the single adapter (simpler, less KV risk) |

**E8 — Task sequence**

| ID | Task / subtask | Machine | Op | Mach | Dep |
| --- | --- | --- | ---: | ---: | --- |
| O10.1 | Split windows by role; gold-card augmentation | AUX1 | 02:00 | 00:30 | O9.3 |
| O10.2 | Train localizer + editor adapters | MAIN | 01:00 | 12:00 | O10.1 |
| O10.3 | Validate (O7 suite ×2) + routing YAML | MAIN | 01:30 | 01:00 | O10.2 |
| O10.4 | 4-arm paired DEV/OOD | MAIN | 01:00 | 24:00 | O10.3 |
| O10.5 | Analysis + G10 | AUX1 | 01:00 | — | O10.4 |
| **Total** | | | **06:30** | **37:30** | |

---

### O11 — Preference optimization (DPO/KTO) and GRPO stretch

**Goal.** Reduce systematic bad first moves (wrong file, test-file edit, blind retry, runaway thinking) beyond what SFT achieves.

**Precondition.** G9a GO and ≥ 1 week of slack. Otherwise skip (default).

**E1 — Data collection.** From O9 rollouts, pair a resolved and an unresolved trajectory **of the same task** at the **first divergent step** (C3 L10). Chosen = the step from the resolved trajectory; rejected = the step from the failed one. Add KTO singletons for tasks without pairs. Target 800–1,500 pairs.

**E2 — Classification.** `divergence_type ∈ {wrong_file, protected_edit, blind_retry, thinking_overrun, premature_submit, other}`. Keep the mix balanced (no class > 40%).

**E3 — Training.** TRL DPO with the LoRA on top of `coder_lora_v1` (reference = v1, frozen), β = 0.1, lr 5e-6, 1 epoch, same windowing. GRPO (rLLM/verl/SkyRL-style, binary pass reward on mined tasks) **only** on a rented 80 GB GPU for ≤ 2 days with a pre-written stop rule. On a single 5090 it is not feasible at a useful scale in this window (C3, C16).

**E4 — Analysis.** Δresolved vs v1; change in frequency of each divergence type in DEV traces; guard against reward-hacking signs (shorter episodes with fewer tests run).

**E5 — Unit tests**

| Test | Expected result |
| --- | --- |
| Pair builder on 10 known task pairs | Identifies the first divergent step index correctly (hand-checked) |
| No same-trajectory pairs | 0 |
| DPO sanity | Chosen logprob − rejected logprob increases on held-out pairs |
| Behavior check | Tests-run-per-task does not drop > 20% vs v1 |

**E6 — Loop.** One DPO round per SFT round at most.

**E7 — GO/NO-GO**

| Gate | Date | GO if | NO-GO → pivot |
| --- | --- | --- | --- |
| G11 | Nov 4 | DPO adapter ≥ v1 + 2 DEV, OOD no drop | Drop DPO; spend the time on data volume (O8/O9) |

**E8 — Task sequence**

| ID | Task / subtask | Machine | Op | Mach | Dep |
| --- | --- | --- | ---: | ---: | --- |
| O11.1 | First-divergent-step pair builder + tests | AUX1 | 03:00 | — | O9.3 |
| O11.2 | Build pairs; balance classes | AUX1 | 01:00 | 00:30 | O11.1 |
| O11.3 | DPO training | MAIN | 00:45 | 06:00 | O11.2 |
| O11.4 | Validate + paired DEV/OOD | MAIN | 01:00 | 14:00 | O11.3 |
| O11.5 | Analysis + G11 | AUX1 | 00:45 | — | O11.4 |
| (stretch) O11.6 | GRPO spike on a rented GPU (stop rule: no reward slope after 400 updates) | Cloud | 04:00 | 40:00 | G11 |
| **Total (excl. stretch)** | | | **06:30** | **20:30** | |

---

### O12 — BCF-FC diagnostic loop (spec card, failure-signature classes, fix order, residual-set rule, rescue/journal)

**Goal.** Operationalize the user's BCF thesis in a form the harness allows, and measure it. This serves both the agent (if it helps) and the paper (whether or not it helps).

**Design** (synthesis of C3 BCF-FC, C9 two-stage spec, C12 residual-set rule and K∈{1,3,4}, C15 signal precedence):

1. **Intake card** (≤ 8 lines of text, not JSON): contracts from the issue, harvested anchors, candidate classes, `depends_on` if the issue lists multiple items.
2. **Probe:** reproduce with a `/tmp` script or the closest existing test.
3. **`sigclass.py`:** parse the probe output into an exception type (Python hierarchy), the innermost repo frame, and the assertion kind (value / type / missing attribute / no exception).
4. **Strategy by class:**
   - invalid-state crash → walk producers/callers first;
   - guard-missing crash → crash site;
   - silent wrong output → producer of the value;
   - feature → nearest precedent.

   Classes **reorder** candidates; they never prune them (C3 Result 4).
5. **Residual-set rule:** after each edit, a newly failing test whose stack is in a successor listed in `depends_on` means unmasking, so continue. A failure outside the card scope is a regression, so revert (C12).
6. **Journal** in `/tmp/bcf/journal.md` (or the payload dir, deleted before submit). **Rescue:** 3 identical failure signatures → revert to baseline and take the next hypothesis.

All checks are **advisory** skills plus prompt policy (C9's hard-vs-advisory labeling).

**E1 — Data collection.** Run the arms on DEV (60) at 2 seeds:

| Experiment | Arms | Measures |
| --- | --- | --- |
| X1 spec | No card / intake card / intake + grounded card | Resolved, tokens, first-edit index |
| X2 classification signal | None / issue-text class / repro-signature class / both / **random-label control** | calls-before-first-gold-read, resolved |
| X3 rescue/journal | Off / journal / journal + breaker | Loop rate, repeat actions, recovered tasks |
| X4 order | Card with `depends_on` honored vs ignored, on tier-4 and M5 masking tasks | `fix_order_error`, resolved |

**E2 — Classification.** Per task: predicted class, signature class, card validity, `fix_order_error`, `unmasking_events`, `rescue_triggered`, `rescue_recovered`. Per class: α (causal coverage = gold file in the class-ordered top-m), m, and n (C12) to test α > m/n.

**E3 — LoRA training.** If O9 is GO, a **compliance-filtered** SFT arm (C3 X12): keep only resolved trajectories that followed the card/probe protocol, train `coder_lora_bcf`, and compare with plain `coder_lora`. Otherwise no adapter.

**E4 — Analysis.** Paired tests per experiment (D.6); Holm correction within each experiment family. Estimate f(K) and α(K) for K ∈ {1, 3, 4} and plot them over the S(K,f) and α > m/n theory curves (paper Figure F2).

**E5 — Unit tests**

| Test | Input | Expected result |
| --- | --- | --- |
| `sigclass.py` | Pytest output with `KeyError` in `src/pkg/a.py` line 10 | `{type: KeyError, family: LookupError, frame: src/pkg/a.py:10, kind: exception}` |
| `sigclass.py` | `assert 1 == 3` failure | `kind: value_mismatch`; frame in the test file flagged `test_frame` |
| `sigclass.py` | No failure output | `kind: none` |
| Residual-set rule | Pre-fail {t1}, post-fail {t2} with t2 stack in a listed successor | `unmasking` |
| Residual-set rule | t2 stack outside scope | `regression` → recommends revert |
| Breaker | 3 identical signatures in the journal | Trips; prints a rescue instruction |
| Card lint | Card missing anchors | Warns `no_anchor`; does not block |

**E6 — Loop.** Keep only the arms that pass the promotion rule. Losing arms are still reported in the paper (negative results are publishable). Re-run X2 after the taxonomy freeze (O13) with the frozen codebook.

**E7 — GO/NO-GO**

| Gate | Date | GO if | NO-GO → pivot |
| --- | --- | --- | --- |
| G12a | Oct 27 | Any arm ≥ +2 DEV or −20% tokens at equal resolved | Ship nothing from BCF-FC; paper reports the negative result + theory |
| G12b | Nov 1 (paper freeze) | X1–X4 results with CIs written | Paper uses whatever finished; mark the rest as future work |

**E8 — Task sequence**

| ID | Task / subtask | Machine | Op | Mach | Dep |
| --- | --- | --- | ---: | ---: | --- |
| O12.1 | `sigclass.py` + tests | AUX1 | 02:30 | — | O3.1 |
| O12.2 | Residual-set + breaker + journal scripts + tests | AUX1 | 02:30 | — | O5.1 |
| O12.3 | Card/probe prompt variants (4 prompts) | AUX1 | 01:30 | — | O6.5 |
| O12.4 | Run X1–X3 on DEV (≈ 9 arms × 60 tasks × 2 seeds; run in two batches) | MAIN | 01:30 | 45:00 | O12.1–O12.3 |
| O12.5 | Run X4 on tier-4 + M5 pairs | MAIN | 00:30 | 06:00 | O8.8 |
| O12.6 | Analysis (Holm, coverage α vs m/n) | AUX1 | 03:00 | — | O12.4, O12.5 |
| O12.7 | Compliance-filtered SFT arm (if O9 GO) | MAIN | 01:00 | 14:00 | G9a |
| **Total** | | | **12:30** | **65:00** | |

---

### O13 — Paper research program (whitepaper draft 3)

**Goal.** Win a paper prize with **measured** findings that judges (graph-ML and SE-testing researchers) value. The plan works even if the leaderboard work stalls.

**Thesis.** C3's "Search, Signal, and Interference", strengthened by C12's coverage threshold and C15's greedy-on-observable / signal-precedence result.

**Entries (≤ 2).**

- **A (Best Paper):** the methods + theory + interference atlas + BCF-FC ablations.
- **B (Best New Resource):** the atlas + taxonomy + gradability audit tooling + mined two-fault benchmark, regenerated and linked per host guidance.

**E1 — Data collection (methods)**

1. **Interference atlas** (C3 E2 / C12 §9.4, CPU-only):
   - For each task with 2–4 source hunks (36 tasks per C3), apply every subset of hunks (2^k ≤ 16) with the `test_patch` and record per-test outcomes.
   - For multi-file tasks with more hunks, group by file.
   - Classify with the Möbius index: single-unit, additive, redundant, conjunctive, antagonistic, unappliable.
   - Run ddmin for k > 4.
2. **Taxonomy** of 129 tasks (D.3 fields): open-code 30, freeze the codebook, label all. Second rater on 20 tasks: preferably a human; otherwise a local Gemma pass as a *third* signal, never as the κ rater. Report Cohen's κ.
3. **Dataset analyses:**
   - graph stats per repo (nodes, edges, isolated %, degree/betweenness);
   - root-cause node percentile;
   - `search_similar_code` symbol-query hit@k on gold symbols;
   - within- vs between-mechanism embedding cosine with a within-repo permutation null.
4. **Theory tests:**
   - S(K,f) points and α > m/n from O12 X2.
   - q^n test: label `n_requirements` per task from the test patch (count of independent asserted behaviors), then test whether pass rate tracks q^n across n strata (C15 E-5).
   - Masking prevalence from M5 pairs (C13).
5. **Receipts** for every number (D.6).

**E2 — Classification.** Atlas classes per task; taxonomy fields; analysis tables tagged M/D/I/H.

**E3 — LoRA training.** None required. If O9/O10 produced results, a short section reports them with receipts.

**E4 — Analysis.** Wilson CIs for atlas proportions; odds ratios (exact CI) between static interference patterns (C3 §5.2 catalogue) and atlas classes; permutation tests for MI claims; logistic fit of pass ~ n_requirements.

**E5 — Unit tests**

| Test | Input | Expected result |
| --- | --- | --- |
| Möbius calculator | Truth table P(∅)=0, P(i)=0, P(j)=0, P(ij)=1 | Δ = +1 → `conjunctive` |
| Möbius calculator | P(i)=1, P(j)=1, P(ij)=1 | Δ = −1 → `redundant` |
| Hunk splitter | `httpx_3672` gold patch | 7 file groups; every hunk reapplies cleanly alone or is marked `unappliable` |
| κ function | Two identical label lists | κ = 1.0 |
| Word counter | Draft markdown | ≤ 3,000 words excluding references |
| Receipt checker | Draft with a number lacking `[R:…]` | Build fails, listing the sentence |
| Fabrication guard | Any table labeled "Measured" | Must cite a receipt ID that exists in `lab/ledger.jsonl` |

**E6 — Loop.** Weekly "paper standup": (1) which claims have receipts; (2) which predictions are pre-registered (`hypotheses.md`, dated before runs); (3) deviations logged. Draft → self-review against the 5 rubric criteria → cut to 3,000 words.

**E7 — Milestones and GO/NO-GO**

| Gate | Date | GO if | NO-GO → pivot |
| --- | --- | --- | --- |
| G13a Stub | Oct 6 | Paper-track joined; writeup stub saved **and submitted** (tie-break + save-bug hedge) | Retry daily; post on the forum if the 404 bug persists |
| G13b Atlas | Oct 25 | Atlas complete with ≥ 5 non-additive tasks | Pivot Entry A to "budgeted agent + coverage threshold + ceiling ladder" (C12 fallback); Entry B to taxonomy + audit tooling |
| G13c Evidence freeze | Nov 1 | All figures have receipts | Drop unfinished experiments to "future work" |
| G13d Submit | Nov 8 (target), Nov 10 (latest) | Both writeups submitted ≤ 3,000 words | Submit Entry A only |

**E8 — Task sequence**

| ID | Task / subtask | Machine | Op | Mach | Dep |
| --- | --- | --- | ---: | ---: | --- |
| O13.1 | Join paper track; save + submit stub writeup | AUX1 | 00:30 | — | D0.1 |
| O13.2 | Hunk splitter + subset runner + Möbius classifier + tests | AUX1 | 04:00 | — | O2.3 |
| O13.3 | Run the atlas (≈ 36 tasks × ≤ 16 subsets ≈ 500 runs + ddmin) | AUX2 | 00:30 | 08:00 | O13.2 |
| O13.4 | Taxonomy codebook (open-code 30), freeze, label 129 | AUX1 | 08:00 | — | O2.4 |
| O13.5 | Second-rater sample (20) + κ | AUX1 | 01:30 | — | O13.4 |
| O13.6 | Graph/embedding analyses + permutation nulls | AUX1/AUX2 | 03:00 | 02:00 | — |
| O13.7 | `n_requirements` labels + q^n analysis | AUX1 | 02:00 | — | O13.4, O2.8 |
| O13.8 | Hypotheses file (pre-register) | AUX1 | 00:45 | — | — |
| O13.9 | Draft Entry A (methods/theory/results) | AUX1 | 06:00 | — | O12.6, O13.3 |
| O13.10 | Draft Entry B (resource) + public notebook + regenerated-artifact links | AUX1 | 03:30 | 01:00 | O13.3–O13.6 |
| O13.11 | Claims audit, word cut, final submit | AUX1 | 02:00 | — | O13.9, O13.10 |
| **Total** | | | **31:45** | **11:00** | |

---

### O14 — Test-time scaling: sequential best-of-2 (default **avoid**)

**Goal.** Use leftover per-task time for a second independent attempt when the first attempt's visible checks fail.

**Why avoid by default.** The ~5-minute cap leaves little slack. Two editors cannot run in parallel in one `/workspace` (C3). Selection uses only visible tests, which can be anti-correlated with hidden ones (`httpx_3672` test asymmetry).

**E1 — Data.**

1. On DEV, log per task: time used, whether visible checks passed, and the final resolution.
2. Simulate the policy offline: a 2nd attempt only if time used < 50% and visible checks failed.

**E2 — Classification.** `attempt ∈ {1, 2}`, `visible_pass`, `hidden_pass`, `selection_correct`.

**E3 — LoRA.** None.

**E4 — Analysis.** Expected gain = P(second attempt resolves | first failed early) × share of eligible tasks. Compare with the time cost and its effect on the global budget.

**E5 — Unit tests**

| Test | Expected result |
| --- | --- |
| `git stash` / restore script | Restores the baseline exactly; untracked files removed |
| Selector | Picks the attempt with more visible passes; ties → fewer changed lines |

**E6 — Loop.** None unless GO.

**E7 — GO/NO-GO**

| Gate | Date | GO if | NO-GO → pivot |
| --- | --- | --- | --- |
| G14 | Nov 4 | Offline simulation shows ≥ +2 DEV tasks with projected wall ≤ 10:30 | Do not build |

**E8 — Task sequence**

| ID | Task / subtask | Machine | Op | Mach | Dep |
| --- | --- | --- | ---: | ---: | --- |
| O14.1 | Offline simulation from existing DEV traces | AUX1 | 01:30 | — | O2.11 |
| O14.2 | (only if GO) Build stash/selector skills + prompt branch + DEV run | AUX1/MAIN | 05:00 | 10:00 | G14 |
| **Total** | | | **01:30–06:30** | **0–10:00** | |

---

## Part F — The iterative self-improvement loop (whole system)

```text
                ┌───────────────────────────────────────────────────────────┐
                │  MEASURE (O2): DEV x2 seeds, OOD, failure histogram,      │
                │  zero-census, speed ratio (O1), ladder gaps               │
                └───────────────┬───────────────────────────────────────────┘
                                │ top failure code / largest gap
                                ▼
 ┌──────────────────────────────────────────────────────────────────────────┐
 │ HYPOTHESIZE: one change, written in hypotheses.md with predicted effect   │
 └───────────────┬──────────────────────────────────────────────────────────┘
                 ▼
 ┌──────────────────────────────┐   fail   ┌──────────────────────────────┐
 │ FAST GATE: unit tests (D.7) + │────────▶│ fix or discard (log deviation)│
 │ Promptfoo suite (O6) seconds  │         └──────────────────────────────┘
 └───────────────┬──────────────┘
                 ▼ pass
 ┌──────────────────────────────┐   no    ┌──────────────────────────────┐
 │ DEV-FAST 20 tasks (hours)     │────────▶│ discard; keep in ledger      │
 └───────────────┬──────────────┘ better? └──────────────────────────────┘
                 ▼ yes
 ┌──────────────────────────────┐  fails  ┌──────────────────────────────┐
 │ DEV 60 x2 + OOD paired (D.6)  │────────▶│ revert; record negative result│
 └───────────────┬──────────────┘ promote └──────────────────────────────┘
                 ▼ promoted
 ┌──────────────────────────────┐         ┌──────────────────────────────┐
 │ LB slot (if scheduled) → Kaggle│──────▶ │ speed ratio + score → ledger │
 └───────────────┬──────────────┘         └──────────────────────────────┘
                 ▼
 ┌──────────────────────────────────────────────────────────────────────────┐
 │ DATA FLYWHEEL (O8→O9): better policy → more verified successes on train   │
 │ pool → next SFT round → better policy (stop when Δ < 2 tasks/round)       │
 └──────────────────────────────────────────────────────────────────────────┘
                 ▼
 ┌──────────────────────────────────────────────────────────────────────────┐
 │ PAPER (O13): every promoted or rejected change becomes a receipt-backed   │
 │ row in the ablation table                                                 │
 └──────────────────────────────────────────────────────────────────────────┘
```

**Cadence**

| Rhythm | Op time | Actions |
| --- | ---: | --- |
| Weekday evening | 02:30 | 00:15 read overnight results/ledger → 00:15 pick one change → 01:30 implement + fast gate → 00:15 queue overnight runs → 00:15 LB submission if scheduled |
| Saturday | 06:15 | Long analysis, data engineering (O8/O13), training launch |
| Sunday | 06:15 | Sprint review on alternate weeks, gate decisions, paper writing, next-week plan |
| Every gate | (in the above) | LOCKBOX evaluation (once per gate), `GATES.md` entry, risk refresh |

---

## Part G — Integrated schedule, milestones, and GO/NO-GO checkpoints

### G.1 Operator-hour allocation per sprint (25:00/week budget)

| Period | Main work (options) | Op planned | Notes |
| --- | --- | ---: | --- |
| Day 0 (Oct 1) | D0 | 05:15 | Evening + overtime |
| S1 Oct 2–8 | O1 (most), O2 (all except weekly), O3.1, O13.1 | 24:30 | First LB submission (runtime probe) Oct 6 |
| S2 Oct 9–15 | O3, O5, O6, O4 (start), O7.1–O7.2 | 25:00 | Prompt doctrine + skills v1; 2 LB submissions |
| S3 Oct 16–22 | O4 (finish), O7.3–O7.7, O8 (start), O13.2–O13.4 | 25:00 | **G7b scorer canary** Oct 16 |
| S4 Oct 23–29 | O8 (finish), O9.1–O9.8, O12.1–O12.4, O13.5–O13.6 | 25:00 | G9a, G12a |
| S5 Oct 30–Nov 5 | O9.9–O9.12, O10 or O11 (only one), O12.5–O12.6, O13.7–O13.9 | 25:00 | Evidence freeze Nov 1 |
| S6 Nov 6–12 | O13.10–O13.11 (paper submit Nov 8–10), finals candidates, robustness | 25:00 | Paper deadline Nov 12 |
| Endgame Nov 13–Dec 2 | Re-runs, one pre-registered improvement max, final selection Dec 1 | 15:00/week | Spare slots for reruns |
| **Total** | | **~199:45 + endgame** | Matches Part C |

### G.2 Leaderboard submission plan (deliberate, ~18–22 slots)

| Window | Slots | Purpose |
| --- | ---: | --- |
| S1 | 1–2 | Runtime probe (G1); calibrated baseline |
| S2 | 2–3 | Doctrine + hygiene + editing; localizer AgentTool |
| S3 | 2 | Best prompt-only (Final-B seed); **destructive canary (G7b)** |
| S4 | 2–3 | Best scaffold; first adapter if G9a GO |
| S5 | 3 | Adapter v2; conservative vs aggressive cap; finalist A |
| S6 | 3 | Finalist A/B reproductions |
| Endgame | 3–6 | Re-runs after host patches; one pre-registered improvement; spare |

### G.3 Master GO/NO-GO table

| Gate | Date | Decision rule | If NO-GO |
| --- | --- | --- | --- |
| G0 Lab | Oct 1 | Model served ≥ 16k; one task graded | Parity fallbacks in D.1 |
| G1 Runtime | Oct 7 | Kaggle run completes ≤ 10:30, all tasks visited | Cut cap 30%; freeze other LB experiments |
| G2 Harness truth | Oct 8 | Gold ≥ 90%; splits frozen; ladder fork chosen | Relative-only CV (subprocess mode); OOD = LORO |
| G3/G5/G6 Scaffold v1 | Oct 13–15 | DEV ≥ baseline + 6 tasks; violations < 1/100; edit fails < 5% | Revert to the best single change; extend S2 by 2 days, cut O14 and O11 |
| G4 Localization | Oct 15 | DEV +2 and tokens −20% with localizer | Flat agent + `locate.py` |
| **G7b Scorer canary** | Oct 17 | Destructive canary collapses the score | **No adapters**; reallocate S4–S5 to O4/O12/O13; re-canary only after host fixes |
| G8 Task factory | Oct 22 | ≥ 300 verified tasks; OOD ≥ 30 | SWE-Gym/SWE-smith pool; LORO OOD |
| G9a SFT v1 | Oct 28 | ≥ +3 DEV, OOD flat, time OK | Data/format diagnosis; else stop training |
| G12a BCF-FC | Oct 27 | Any arm +2 DEV or −20% tokens | Ship nothing; paper reports negatives |
| G13b Atlas | Oct 25 | ≥ 5 non-additive tasks | Paper pivot (C12 fallback title) |
| G13c Evidence freeze | Nov 1 | Receipts complete | Cut sections |
| G9b/G10/G11 | Nov 4 | Each ≥ +2 over its parent | Freeze the parent |
| G13d Paper | Nov 8–10 | Submitted ≤ 3,000 words | Entry A only |
| G-final Freeze | Nov 25 | Two candidates reproduce DEV ±1 and LB within ±0.03 | Use the best reproduced pair |
| G-select | Dec 1 | Final A = best OOD+DEV composite; Final B = most different strong candidate (adapter vs no-adapter) | If they are identical, Final B = conservative-cap variant |

---

## Part H — Pivot decision tree

```text
G1 overrun? ──yes──▶ cut cap 30% ▶ resubmit ▶ (still overrun) ▶ cap 3 min + max_tool_calls 24
   │no
G2 gold < 50%? ──yes──▶ subprocess-mode relative CV + Kaggle notebook parity checks
   │no
Ladder fork: file-oracle ≤ 5/20 ──▶ emphasize O3/O5/O6 (editing, literals)
             file-oracle − blind ≥ 4 ──▶ emphasize O4 (localization)
   │
G7b canary collapses? ──no──▶ ADAPTER-FREE TRACK:
   │                          O4 + O12 + O6 polish; O13 paper is primary payoff;
   │                          re-canary after each host LoRA fix (weekly check)
   │yes
G8 ≥300 tasks? ──no──▶ add SWE-Gym/SWE-smith pool or 1-day open-weight teacher rental
   │yes
G9a v1 ≥ +3? ──no──▶ check converter/mask/escaping ▶ r=8 attention-only ▶ still no ▶ stop training
   │yes
G9b v2 ≥ v1+2? ──no──▶ freeze v1 ─┐
   │yes                           │
O10 vs O11 (pick ONE by slack) ◀───┘
   │
Finals: A = best OOD composite; B = different risk profile (no-adapter vs adapter)
Paper: atlas non-additive ≥ 5 ? Entry A "Search, Signal, Interference" : Entry A "Budgeted agent + coverage threshold + ceiling ladder"
```

**Pivot alternatives catalogue**

| Trigger | Alternatives (ranked) |
| --- | --- |
| Scorer LoRA never works | (1) Prompt/skills only with a richer skill library (`load_skill_resource` playbooks of *generic* fix patterns); (2) invest freed GPU time in O12 experiments and O13 analyses; (3) team merger before Nov 25 with a team that has a working adapter path (submission-count rule permitting) |
| Local serving parity impossible | (1) Kaggle-notebook parity runs on 20 tasks/week; (2) rented 48–80 GB GPU for parity days; (3) treat local results as relative only |
| Training too slow on the 5090 | (1) r=8, attention-only, 6k sequences; (2) rented 80 GB GPU for single rounds; (3) fewer, higher-quality windows (recovery-heavy) |
| Paper atlas finds little interference | (1) Coverage-threshold + K-sweep measurement paper; (2) ceiling-ladder diagnostic paper; (3) resource paper (taxonomy + audit + mined tasks) |
| Operator time drops below 15 h/week | Drop O10, O11, O14, X3/X4 of O12; keep O1, O2, O3, O5, O6, O7, O13 core |


---

<!-- ====================================================================== -->
<!-- FILE: 04_Open_Questions_Roundup.md -->
<!-- ====================================================================== -->

# Special Section 3 — Round-up of All Open Questions

**Date:** 2026-10-01

This list collects every open question raised in the 16 contenders' files, plus the questions this council's own verification surfaced. Duplicates are merged. Each row lists:

- the contenders that raised it (C#), or **council** if it is new;
- why it matters;
- the cheapest way to resolve it;
- the gate it blocks (see file 03, Part G.3).

**Priority:** **P0** blocks the plan or risks a zero; **P1** changes a major design choice; **P2** refines or polishes.

## 1. Scorer and harness behavior

| # | Open question | Raised by | Why it matters | How to resolve | Priority / gate |
| --- | --- | --- | --- | --- | --- |
| Q1 | Does the scorer apply LoRA adapters at all? The zeroing (YOCO double-registration) fix "landed in v23", yet a participant on v25 still saw no effect | C9, C10, C11, C13, C14, C15, C16 | Decides whether any training investment can score | Local loud-adapter test, then a **destructive-adapter scorer canary** (file 03, O7) | P0 / G7b |
| Q2 | Is the KV-cache collapse (46,048 → ~7,600 tokens whenever adapters are mounted) fixed by sizing LoRA buffers to the submission? | C9, C11, C13, C14, C15, C16 | Adapter runs hang on almost every task if not | Canary with a long-prompt survival check; watch thread 744331 | P0 / G7b |
| Q3 | Has the 12 h overrun behavior changed from "error the whole run" to "unfinished tasks score 0"? | C9, C11, C13, C15, C16 | Sets how aggressive per-task caps can be | Host thread 743063; until confirmed, assume the stricter behavior | P0 / G1 |
| Q4 | Does the scorer evaluate ~120 tasks per run, or only the public half (~58–60) per public submission? | C12, council | Doubles or halves the safe per-task cap (C12 clock table) | Read tasks-visited count in the first Kaggle log | P0 / G1 |
| Q5 | Are public and private tasks interleaved in the fixed run order, or public first? | C9, C11, C15, C16 | Front-loading risk; time-allocation fairness | Ask the host; never design around it | P1 |
| Q6 | Is the double-JSON escaping of tool results fixed, and which variant shipped (raw text vs single-JSON, which measured worse at 62%)? | C11, C13, C14, C15, C16 | Edit-failure rate and the value of the splice skill | Day-0 probe; re-probe after announcements | P1 / G3b |
| Q7 | Are thinking tokens now preserved between tool calls (`reasoning` vs `reasoning_content`)? Since there is no rescore, are pre/post scores comparable? | C3, C11, C13, C14, C15, C16 | Thinking-budget configuration | Token-accounting probe; re-run the O6 top-3 configs | P1 / G6b |
| Q8 | Is `search_similar_code` output now capped like other tools? | C11, C13, C14, C15 | Context blowups (>100k-char nodes) | Probe with "Body"/"APIRouter" queries | P1 |
| Q9 | Does `read_file` with integer line ranges fail ("'>' not supported…")? | C11, C13, C14, C15 | Localization tool policy | Day-0 probe with integer args | P1 / G0 |
| Q10 | A thread reports compaction cannot trigger at `token_threshold` 32,768 and an overflow discards the patch. Is that real? | C15 | A new zero-patch failure mode | Reproduce locally; keep the threshold < 50% of the window | P1 |
| Q11 | Which compaction settings does the scorer use: README (interval 5) or notebook (interval 15)? | C3 | Context planning | Assume the README; test both | P2 |
| Q12 | Exact `run_skill_script` signature and working directory; can skill scripts see the graph/embedding files, write under `/tmp`, or call harness tools? | C3, C9, C11, C12, C13, C16, BCF gap G9 | Whether the splice editor, journal, and locator skills are viable | Day-2 sandbox probe (O3.1) | P0 / G3a |
| Q13 | Does the harness honor Agent-Skills progressive disclosure (L1/L2/L3), or load all of `SKILL.md`? | C3, C13, C15, C16 | Prompt size and skill design | Probe with a large `SKILL.md` and token accounting | P2 |
| Q14 | Does a `SequentialAgent` root re-run earlier sub-agents after a harness nudge? | C3 | Topology choice | Local trace inspection | P2 |
| Q15 | Can `submit_patch` be blocked at all (hard gates), or are all gates advisory? | C9, council | Honest labeling of BCF "gates" | Confirm no callback hook exists; document gates as advisory | P1 |
| Q16 | Does `get_status` expose task index / total task count (to support adaptive allocation)? | C15 | Adaptive vs fixed caps | Inspect the `get_status` JSON | P2 |
| Q17 | Does the infra-failure rerun policy (9/26 wave) still hold, and is the rescore backlog cleared? | C11, C13 | Interpreting LB movements | Forum check | P2 |

## 2. Rules, licensing, and compliance

| # | Open question | Raised by | Why it matters | How to resolve | Priority / gate |
| --- | --- | --- | --- | --- | --- |
| Q18 | May task text, patches, or traces be sent to hosted models (Claude, Jev, frontier APIs) during development? | Dossier, C3, C9, C12, C16 | Data-use / private-sharing rules; disqualification risk | Ask the host; until answered, use only local models | P0 |
| Q19 | Is distillation from closed-API teachers compatible with provider ToS and the OSI winner license? Open-weight teachers are the community consensus | C3, C9, C11, C13, C15 | Lineage of any trained adapter | Use open-weight teachers only; keep a license log | P0 |
| Q20 | Does the paper track share the main competition's Nov 25 team-merger deadline? | C16 | Team decisions | Paper-track rules page | P2 |
| Q21 | Will the host confirm in writing that regenerated graphs/embeddings from public repos may be released with citation (Resource entry)? | C11, C13, C16 | Paper Entry B design | Watch thread 743255 | P1 / G13 |
| Q22 | Are paper writeups visible to others before the deadline, and is the writeup save/submit 404 bug fixed? | C11, C13, C15, C16 | Tie-break by earliest entry; platform risk | Join and submit a stub this week (O13.1) | P0 / G13a |
| Q23 | Is the paper judging panel larger than the one named judge? | C16 | Writing style and emphasis | Watch the overview page | P2 |
| Q24 | Which external benchmark is credible for a post-competition check? OpenAI retired SWE-bench Verified (verified Feb 23, 2026). One 2026 source says OpenAI later withdrew its SWE-bench Pro recommendation after an audit | council (web check), C5, C13, C14, C15, C16 | Paper related-work wording | Verify the SWE-bench Pro status before citing | P2 |

## 3. Local environment and hardware

| # | Open question | Raised by | Why it matters | How to resolve | Priority / gate |
| --- | --- | --- | --- | --- | --- |
| Q25 | Does `gemma-4-31b-it-qat-w4a16-ct` fit with 32,768 context on one RTX 5090? KV ≈ 1 MB/token at TP4-derived rates; estimates range from ~6.5k (bf16 KV) to "14 GB fits 32k" | C3, C5, C6, C9, C11, C12, C14, C15 | Local parity and the trajectory format | Day-0 VRAM measurement at 16k / 32k, with and without fp8 KV | P0 / G0 |
| Q26 | True weight footprint: ~16–18 GB (README) vs 23.3 GB (C15)? Is a vision tower loaded? | C15, council | KV headroom | `nvidia-smi` after load; inspect checkpoint shards | P1 / G0 |
| Q27 | Does the wheelhouse torch/vLLM build support sm_120 (Blackwell), or is an upstream cu128 build needed (non-parity)? | C3, C11, C12, C15 | Local serving at all | Day-0 import + capability check | P0 / G0 |
| Q28 | Can LoRA be trained directly on the QAT compressed-tensors checkpoint (Path A), or only as QLoRA on bf16 weights (Path B) with a train/serve mismatch? | C3, C9, C11 | Training path and adapter quality | Sprint-3 spike (O7.3) | P1 / G9 |
| Q29 | Measured L4 vs 5090 seconds per turn (speed ratio) for setting per-task caps | C3, C12, C15 | Cap calibration | First Kaggle log (O1.6) | P0 / G1 |
| Q30 | Can AUX2's 550 W PSU sustain 8 parallel sandboxes plus a capped 3080? | C3, C10, C16 | Grading-farm stability | 30-min burn-in at the power cap | P2 |
| Q31 | QLoRA throughput (tokens/s) on the 5090 at 8k sequence length for 31B, and the maximum feasible sequence length | C3, C10, C11, council | Training schedule | Pilot run (O9.5) | P1 |

## 4. Data and evaluation

| # | Open question | Raised by | Why it matters | How to resolve | Priority / gate |
| --- | --- | --- | --- | --- | --- |
| Q32 | After the wheel repair, how many of the 129 public tasks pass gold locally (target ≥ 90% of non-dead)? | C3, C11, C13, C14, C15, C16 | Meaningful local CV | O2 gold audit | P0 / G2 |
| Q33 | What is the zero-census share of no_patch + apply_fail + ctx_overflow + timeout? | C15 | Picks infrastructure vs capability focus | O2.8 | P1 / G2 |
| Q34 | Ceiling ladder: gold vs file-oracle vs symbol-oracle vs blind on DEV_FAST | C12 | Localization vs editing emphasis | O2.7 | P1 / G2 |
| Q35 | How well does the OOD set (gradable requests/httpx + mined external repos) predict the private LB? | C3, C12, C16 | Final selection rule | Spearman of DEV/OOD vs LB ranks over ≥ 4 submissions | P1 |
| Q36 | Which two task pairs share a base commit (129 task files vs 127 commit files)? Are they genuinely multi-fault? | C13, council | Two-fault benchmark seeds | Group `tasks.jsonl` by `base_commit` | P2 |
| Q37 | What fraction of multi-hunk gold patches are conjunctive / masking (interference atlas)? | C3, C12, C13, C15 | Central paper result | O13 atlas | P1 / G13b |
| Q38 | How many independent requirements (n) does each task's test patch assert, and does pass rate track q^n? | C15 | Explains the 0.13–0.17 plateau | O13.7 | P2 |
| Q39 | Are issue-text exception classes informative at all? C3's pilot found ≈ 0.1 bits and worse leave-one-out localization | C3, C9 | Whether to classify issue text or reproduced failures | Re-run C3's pilot script; O12 X2 arms | P1 |
| Q40 | Do `search_similar_code` symbol queries retrieve root causes (P@k), and do root causes sit at graph hubs? | C3, C11, C13, C16 | Graph-tool doctrine and a paper figure | O4 bench; O13 analyses | P2 |

## 5. BCF design questions

| # | Open question | Raised by | Why it matters | How to resolve | Priority / gate |
| --- | --- | --- | --- | --- | --- |
| Q41 | Does a spec/intake card help under a ~5-min budget, or cost more than it saves? | C3, C9, C12 | Core BCF claim | O12 X1 | P1 / G12a |
| Q42 | Flat single agent vs root + read-only localizer AgentTool vs SequentialAgent: which wins at equal time? | C3, C4, C9, C12, C16, dossier | Topology | O4 G4b; C3 E5 | P1 |
| Q43 | Does the strictly-increasing-pass rescue rule reject valid partial repairs under masking? | C9 | Rescue design | O12 X3/X4 with M5 pairs | P2 |
| Q44 | Where can a journal persist without polluting the patch (`/tmp` reachable from skills?), and does it survive compaction? | C3, C13, C15 | Loop prevention | Day-2 probe | P1 / G3a |
| Q45 | Does a compliance-filtered SFT set beat a plain shortest-success SFT set? | C3 | Training data policy | O12.7 | P2 |
| Q46 | Should test-asymmetry tasks (rename/refactor where visible tests contradict the graded contract) get a spec-aware validation exception? | C11, C14, C15 | Avoids reverting correct fixes | Detect "X -> Y" rename phrasing; ablate | P2 |

## 6. Mathematics and theory

| # | Open question | Raised by | Why it matters | How to resolve | Priority / gate |
| --- | --- | --- | --- | --- | --- |
| Q47 | Measured fidelity f(K) and causal coverage α(K) for K ∈ {1, 3, 4, 8, 12}: do they satisfy f > 1/K and α > m/n? | C3, C12, C14, C15, C16 | Turns the theory into a result | O12 X2 + taxonomy | P1 |
| Q48 | Is there an interior optimum K\* consistent with K\* ∝ N (C16) or k\* = e^{α0/2β} (C15)? | C14, C15, C16 | Paper claim | K-sweep | P2 |
| Q49 | Does misattribution probability grow with chain depth? This is the condition for any "superlinear" BCF advantage | C3, C11, C15 | Prevents overclaiming | Measure q per chain link on M5 pairs | P2 |
| Q50 | Is greedy-on-observable sufficient for pure masking chains in practice, so that the real hazard is acting on stale issue-text symptoms (signal precedence)? | C15 | Paper novelty | O12 X4 "text-first vs observation-first" | P2 |

## 7. Literature to verify before citing

| # | Item | Raised by | Status after council checks |
| --- | --- | --- | --- |
| Q51 | Al-Bataineh, ASE 2025 "Interaction-Aware Patch Assessment…" | C9, C13, C15 | **Verified** (DOI 10.1109/ASE63991.2025.00319) |
| Q52 | Al-Bataineh ASE 2024 (DOI 10.1145/3691620.3695287); ICSME 2025 "validation oracles"; the "Foundations…" manuscript status | C9, C13, C15 | ASE 2024 DOI appears in search results; ICSME and the manuscript are unverified |
| Q53 | DiGiuseppe & Jones: ICSM 2011 (>65,000 versions, verified) vs EMSE 2015 counts ("72,000" in C12, "13,000+" in C13) | C9, C12, C13 | EMSE count unverified |
| Q54 | Debroy & Wong ISSRE 2009 figures (33.12% independence; 3,267 data points) | C12 | Consistent with the survey's "67%"; exact numbers to check in the PDF |
| Q55 | ChainSWE (arXiv 2607.02606) | C13, C14 | **Verified** |
| Q56 | An et al. 95.4% multi-fault Defects4J versions | C15 | **Verified** (311/326) |
| Q57 | Nashid et al. hunk divergence (arXiv 2506.04418) and agentic multi-hunk study (arXiv 2511.11012) | C15 | 2506.04418 appears in search results; 2511.11012 unverified |
| Q58 | SWE-PRM (arXiv 2509.02360), LivePlan (arXiv 2608.06701), FailFast-RestartSmart, SWE-MeM (from the BCF compendium) | C1, C6, C14, C16 | Unverified by the council |
| Q59 | Suspected fabricated or misattributed: "Pearl et al. 2017 ISSTA", "Zhang 2022 TSE multi-fault causal", "Le et al. 2023 SWE-bench", "MSeer Abreu ISSRE 2009", "Debroy & Wong TSE 2014 up to 40%", "Monperrus 85%" | C1, C5, C6, C10 | Do **not** cite without primary-source confirmation |

## 8. Council-specific open items (contradictions to settle with data)

| # | Open question | Contenders in conflict | How to settle |
| --- | --- | --- | --- |
| Q60 | Masking reading of the httpx_6821 story: is Bug 2 dead code (reachability masking) or the first visible failure? The dossier says both | C12, C15 (flag the contradiction) vs C1, C5, C6, C7, C10 (use it as real) | Retire it; use M5 constructed pairs or `httpx_3672` |
| Q61 | Does the missing-parens line in `httpx_3672` cause a crash (C16) or a silent no-op (C11)? | C11 vs C16 | Code read: attribute access with no call is a no-op. Confirm with a two-request keep-alive test |
| Q62 | Is the right early leaderboard target "≥ 0.18 by Sprint 1" (C10), "≥ 0.17 by Oct 14" (C3), or "0.10–0.15 calibration" (C14, C15)? | Several | Treat the first two submissions as calibration only |
| Q63 | Should the first scored submission happen in week 1 (C3, C9, C11, C12, C13, C14) or later (C5, C6, C7 at week 6; C15 in S3)? | Several | Week 1: runtime safety and the speed ratio cannot be learned otherwise |


---

<!-- ====================================================================== -->
<!-- FILE: 05_Content_Comparison_Matrix.md -->
<!-- ====================================================================== -->

# Special Section 4 — Checklist-Style Content Comparison Matrix

**Date:** 2026-10-01

This file has three parts:

- **Part 1:** a side-by-side checklist of content elements across the 16 contenders. Each contender's files are treated as one unit.
- **Part 2:** a per-file inventory showing which elements each individual file contains.
- **Part 3:** which contenders answered extra questions beyond `chat_questions.txt`.

**Cell legend:**

| Symbol | Meaning |
| --- | --- |
| ✓ | Present and substantially correct |
| ◐ | Present but partial, thin, or with a material error |
| ⚠ | Present but flagged: verified-false, fabricated, or presents an invented example as real |
| — | Absent |

---

## Element codes

| Code | Element | Code | Element |
| --- | --- | --- | --- |
| A1 | Verified competition facts table | C1 | Review of BCF docs with corrections |
| A2 | Leaderboard arithmetic (tasks per point) | C2 | Per-technique verdicts (adopt/adapt/test/park/reject) |
| A3 | Measured train-set profile | C3 | Integration into the sprint plan |
| A4 | Brainstorm / lever ranking | C4 | Test protocol per technique |
| A5 | Agent "brain" architecture spec | C5 | Whitepaper next-draft brainstorm |
| A6 | Tool-usage policy | C6 | Official paper rubric + 3,000-word cap |
| A7 | Failure-mode taxonomy | C7 | Draft outline / word budget |
| A8 | Evaluation method (splits, holdouts, paired stats) | D1 | Named math phenomena |
| A9 | Training / LoRA strategy | D2 | Entropy / mutual-information formulation |
| A10 | Milestones with exit criteria | D3 | Closed-form speed-up / threshold result |
| A11 | GO/NO-GO or kill criteria | D4 | Number-vs-fidelity trade-off / optimum |
| A12 | Master checklist | D5 | Formal masking / interference definitions |
| A13 | Risk register | D6 | Chained-fault DAG / order-cost model |
| B1 | Role allocation for the 3 named machines | D7 | Worked example handling (httpx_6821 labeled; httpx_3672 real) |
| B2 | Day-0 commands / runbook | D8 | Whitepaper-ready prose |
| B3 | Day-0 clock times or step durations | D9 | Experiments / pre-registered predictions |
| B4 | BIOS / firmware settings | D10 | Measured pilot data on the 129 tasks |
| B5 | WSL / Docker / vLLM serving config | E1 | Multi-fault localization & interference classics |
| B6 | Six sprints at day-level granularity | E2 | Masking theory (PIE/RIPR, coincidental correctness, HOM) |
| B7 | Leaderboard submission plan | E3 | Model-based diagnosis / information-theoretic diagnosis |
| B8 | Per-task budget with valid 12 h arithmetic | E4 | Recent multi-fault APR (Al-Bataineh 2024–25, FLITSR, ChainSWE) |
| B9 | Packaging validator / Definition of Done | E5 | LLM issue-agent lineage (SWE-bench, Agentless, AutoCodeRover…) |
| B10 | Endgame / final-selection rule | E6 | Identifying interference-prone code scenarios |
| F1 | Forum (discussion-board) intel | E7 | Relevance map prior work → BCF |
| F2 | Paper-track intel | E8 | Citation verification / confidence ratings |
| F3 | Real-task walkthrough (`httpx_3672`) | G1 | Fabricated "measured" results (integrity flag) |
| F4 | Catalog / FOSS rankings (extra task) | G2 | `httpx_6821` presented as real (integrity flag) |
| F5 | Markdown table QC report | | |
| F6 | README / index | | |

---

## Part 1 — Side-by-side checklist (contenders as units)

### 1a. Q1 roadmap and Q2 master plan

| Code | C1 | C2 | C3 | C4 | C5 | C6 | C7 | C8 | C9 | C10 | C11 | C12 | C13 | C14 | C15 | C16 |
| --- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| A1 | ◐ | ◐ | ✓ | ◐ | ✓ | ✓ | ✓ | — | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| A2 | — | — | ✓ | — | ◐ | — | — | — | ✓ | ◐ | ✓ | ✓ | ⚠ | ⚠ | ✓ | ✓ |
| A3 | — | — | ✓ | — | — | ◐ | ◐ | — | — | — | ◐ | ✓ | — | — | — | — |
| A4 | ◐ | ◐ | ✓ | ◐ | ◐ | — | ◐ | ◐ | ✓ | ◐ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| A5 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| A6 | ◐ | ✓ | ✓ | — | ✓ | — | ◐ | — | ✓ | ◐ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| A7 | — | ✓ | ✓ | — | ⚠ | ⚠ | ⚠ | ◐ | ◐ | ◐ | ✓ | ✓ | ◐ | ✓ | ✓ | ✓ |
| A8 | — | ◐ | ✓ | — | ◐ | ◐ | ◐ | — | ✓ | ◐ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| A9 | ◐ | ✓ | ✓ | ◐ | ◐ | ◐ | ◐ | ◐ | ✓ | ⚠ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| A10 | ◐ | ✓ | ✓ | ◐ | ✓ | ✓ | ✓ | ◐ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| A11 | — | — | ✓ | — | — | ◐ | ◐ | — | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ◐ |
| A12 | — | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| A13 | — | ◐ | ✓ | — | — | ✓ | ✓ | — | ◐ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| B1 | ✓ | ⚠ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ◐ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| B2 | ◐ | ◐ | ✓ | ◐ | ✓ | ✓ | ✓ | ◐ | ◐ | ✓ | ✓ | ✓ | ◐ | ◐ | ✓ | ✓ |
| B3 | — | ◐ | ✓ | — | — | ◐ | ◐ | — | — | ✓ | ✓ | — | ◐ | ✓ | ✓ | — |
| B4 | — | — | ✓ | — | ✓ | ✓ | ✓ | ◐ | ◐ | — | ✓ | ✓ | ◐ | — | ◐ | ✓ |
| B5 | ◐ | ◐ | ✓ | ◐ | ✓ | ✓ | ✓ | ◐ | ✓ | ◐ | ✓ | ✓ | ◐ | ✓ | ✓ | ◐ |
| B6 | ◐ | ✓ | ✓ | ◐ | ◐ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| B7 | — | — | ✓ | — | ◐ | — | — | — | ✓ | ◐ | ✓ | ✓ | ◐ | ✓ | ✓ | ⚠ |
| B8 | — | ◐ | ✓ | — | ⚠ | ⚠ | ⚠ | — | ✓ | ⚠ | ✓ | ◐ | ✓ | ⚠ | ✓ | ⚠ |
| B9 | — | ✓ | ✓ | ◐ | ✓ | ✓ | ✓ | ◐ | ✓ | ✓ | ✓ | ✓ | ◐ | ✓ | ✓ | ✓ |
| B10 | — | ◐ | ✓ | — | ✓ | — | — | — | ✓ | ◐ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

### 1b. BCF integration, whitepaper, math, and prior research

| Code | C1 | C2 | C3 | C4 | C5 | C6 | C7 | C8 | C9 | C10 | C11 | C12 | C13 | C14 | C15 | C16 |
| --- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| C1 | — | — | ✓ | ◐ | — | ◐ | ◐ | — | ✓ | ◐ | ⚠ | ✓ | ✓ | ✓ | ✓ | ✓ |
| C2 | ◐ | — | ✓ | ✓ | ✓ | ✓ | ✓ | — | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| C3 | ✓ | — | ✓ | ✓ | ✓ | ✓ | ✓ | — | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| C4 | ✓ | — | ✓ | ✓ | ✓ | ✓ | ✓ | — | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| C5 | ✓ | — | ✓ | ✓ | ✓ | ✓ | ✓ | — | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| C6 | — | — | ✓ | — | — | ⚠ | ⚠ | — | ✓ | ◐ | ✓ | — | ✓ | ✓ | ✓ | ✓ |
| C7 | — | — | ✓ | ◐ | ◐ | ✓ | ◐ | — | ✓ | ◐ | ✓ | ✓ | ✓ | ◐ | ✓ | ✓ |
| D1 | ✓ | — | ✓ | ◐ | ✓ | ✓ | ✓ | — | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| D2 | ✓ | — | ✓ | ◐ | ✓ | ✓ | ✓ | — | ✓ | ◐ | ✓ | ◐ | ✓ | ✓ | ✓ | ✓ |
| D3 | ◐ | — | ✓ | — | ◐ | ⚠ | ⚠ | — | ◐ | ◐ | ◐ | ✓ | ◐ | ◐ | ◐ | ✓ |
| D4 | ◐ | — | ✓ | — | ◐ | ◐ | ◐ | — | ✓ | — | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| D5 | ✓ | — | ✓ | ◐ | ✓ | ✓ | ✓ | — | ✓ | ⚠ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| D6 | ⚠ | — | ✓ | ⚠ | ✓ | ✓ | ✓ | — | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| D7 | ⚠ | — | ✓ | ✓ | ⚠ | ⚠ | ⚠ | — | ✓ | ⚠ | ✓ | ◐ | ✓ | ✓ | ✓ | ◐ |
| D8 | ✓ | — | ✓ | ◐ | ✓ | ✓ | ✓ | — | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| D9 | — | — | ✓ | — | — | ◐ | ◐ | — | ✓ | ◐ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| D10 | — | — | ✓ | — | ⚠ | — | ⚠ | — | — | ⚠ | — | ◐ | — | — | — | — |
| E1 | ✓ | — | ✓ | ◐ | ✓ | ✓ | ◐ | — | ✓ | ◐ | ✓ | ✓ | ✓ | ◐ | ✓ | ✓ |
| E2 | ✓ | — | ✓ | ◐ | — | ✓ | ✓ | — | ◐ | ◐ | ✓ | ✓ | ◐ | ✓ | ◐ | ✓ |
| E3 | — | — | ✓ | — | — | — | — | — | ◐ | — | ✓ | ✓ | ✓ | — | ◐ | ✓ |
| E4 | — | — | — | ◐ | — | — | — | — | ✓ | — | — | ◐ | ✓ | ◐ | ✓ | — |
| E5 | ✓ | — | ✓ | — | ◐ | ✓ | ✓ | — | ✓ | ⚠ | ✓ | ✓ | ✓ | ✓ | ✓ | ◐ |
| E6 | ◐ | — | ✓ | — | ✓ | — | ◐ | — | ✓ | — | ✓ | ✓ | ◐ | ✓ | ✓ | ✓ |
| E7 | ✓ | — | ✓ | ◐ | ✓ | ✓ | ◐ | — | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| E8 | — | — | ✓ | — | — | — | — | — | ✓ | — | ✓ | ✓ | ◐ | — | ✓ | ◐ |

### 1c. Extras and integrity flags

| Code | C1 | C2 | C3 | C4 | C5 | C6 | C7 | C8 | C9 | C10 | C11 | C12 | C13 | C14 | C15 | C16 |
| --- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| F1 | — | — | — | — | — | — | — | — | ◐ | ◐ | ✓ | — | ◐ | ◐ | ✓ | ◐ |
| F2 | — | — | ◐ | — | — | — | — | — | ◐ | — | ✓ | — | ◐ | ◐ | ◐ | ✓ |
| F3 | — | — | ◐ | — | — | — | — | — | ◐ | — | ✓ | ⚠ | — | ◐ | ◐ | ⚠ |
| F4 | — | — | — | — | — | — | — | — | — | — | ✓ | ✓ | — | — | — | ✓ |
| F5 | — | — | ✓ | — | ◐ | — | — | — | — | — | ◐ | — | — | — | — | — |
| F6 | — | — | ✓ | — | — | — | — | — | — | — | ✓ | ✓ | — | — | — | ✓ |
| G1 fabricated results | — | — | — | — | ⚠ | — | ⚠ | — | — | ⚠ | — | — | — | — | — | — |
| G2 httpx_6821 as real | ⚠ | — | — | — | ⚠ | ⚠ | ⚠ | — | — | ⚠ | — | — | — | — | — | — |

**Count of ✓ cells (out of 54 content elements A1–F6):**

| Contender | ✓ count |
| --- | ---: |
| C3 | 49 |
| C11 | 48 |
| C12 | 43 |
| C15 | 43 |
| C16 | 40 |
| C9 | 38 |
| C14 | 36 |
| C13 | 34 |
| C6 | 25 |
| C5 | 23 |
| C7 | 22 |
| C10 | 18 |
| C1 | 13 |
| C2 | 8 |
| C4 | 8 |
| C8 | 4 |

Counts are approximate and descriptive. Scores in file 01 weigh correctness and integrity, not presence.

---

## Part 2 — Per-file inventory (what each file contains)

Excluded and duplicate files are marked. "Q" columns: Q1 = roadmap; Q2 = Day-0 + sprints; Q3a = BCF integration + paper brainstorm; Q3b = math; Q3c = prior research.

| Contender | File | KB | Answers | Elements present (✓ or ◐; ⚠ noted) |
| --- | --- | ---: | --- | --- |
| C1 | `kagglecom_bcf_instantplan_[web-gemini31pro-38flash].md` | 35 | Q1, Q2, Q3a, Q3b, Q3c | A5 A9◐ A10◐ B1 B2◐ B6◐ C2◐ C3 C4 C5 D1 D2 D3◐ D5 D6⚠ D7⚠ D8 E1 E2 E5 E7; G2⚠ |
| C2 | `kagglecom_bcf_instantplan_[web-gemini38flash].md` | 32 | Q1, Q2 (wrong hardware), final turn unanswered | A5 A6 A7 A9 A10 A12 B1⚠ B2◐ B3◐ B6 B8◐ B9 |
| C3 | `2026-09-30/00_README.md` | 3 | Index | F6 (key numbers table) |
| C3 | `2026-09-30/01_Roadmap_and_Master_Checklist.md` | 44 | Q1 | A1–A13 (all ✓) |
| C3 | `2026-09-30/02_Master_Plan_Day0_to_Final_Submission.md` | 52 | Q2 | B1–B10 (all ✓); starter configs; budget calculator |
| C3 | `2026-09-30/03_QC_Report.md` | 3 | QC | F5 |
| C3 | `2026-09-30_BCF/00_README.md` | 4 | Index | F6; 5 headline findings |
| C3 | `2026-09-30_BCF/01_BCF_Review_Integration_and_Whitepaper_Brainstorm.md` | 44 | Q3a | C1 (18 corrections) C2 (32 verdicts) C3 C4 (X1–X12) C5 C6 C7; F2◐ |
| C3 | `2026-09-30_BCF/02_BCF_Fault_Class_Math_Whitepaper_Content.md` | 39 | Q3b | D1–D10 (all ✓); F3◐ (symbol check) |
| C3 | `2026-09-30_BCF/03_Prior_Research_Fault_Interference_Masking.md` | 32 | Q3c | E1 E2 E3 E5 E6 E7 E8 |
| C3 | `2026-09-30_BCF/04_QC_Report.md` | 3 | QC | F5 |
| C4 | `afterQ1/kaggle_gemma4_roadmap.md` | 6 | Q1+Q2 (early version, multi-agent) | A5 A12 B1 B2◐ B6◐ |
| C4 | `afterQ2/bcf_integration_and_whitepaper.md` | 4 | Q3a | **Duplicate** of the afterQ3 copy |
| C4 | `afterQ2/kaggle_gemma4_roadmap.md` | 6 | Q1+Q2 | **Duplicate** of the afterQ3 copy |
| C4 | `afterQ3/bcf_integration_and_whitepaper.md` | 4 | Q3a | C2 C3 C4 C5 C7◐ |
| C4 | `afterQ3/kaggle_gemma4_roadmap.md` | 6 | Q1+Q2 (revised, flat agent) | A1◐ A4◐ A5 A9◐ A10◐ A12 B1 B2◐ B5◐ B6◐ B9◐ |
| C4 | `afterQ3/whitepaper_draft_math_prior_research.md` | 6 | Q3b, Q3c | D1◐ D2◐ D5◐ D6⚠ D7 D8◐ E1◐ E2◐ E7◐ |
| C5 | `afterQ1/00…04` (5 files) | 65 | Q1, Q2, Q3a–c (early) | Earlier snapshot; same structure; already contains the fabricated 0.388 table (G1⚠) |
| C5 | `afterQ2/00, 01, 02` | 46 | — | **Duplicates** of the afterQ3 copies |
| C5 | `afterQ2/03, 04` | 24 | Q3b, paper | Intermediate versions of the afterQ3 03/04 |
| C5 | `afterQ3/00_EXECUTIVE_SUMMARY_AND_ROADMAP.md` | 16 | Q1 | A1 A2◐ A5 A6 A7⚠ A10 A12 |
| C5 | `afterQ3/01_MASTER_PLAN_DAY0_TO_SPRINT6.md` | 16 | Q2 | B1 B2 B4 B5 B6◐ B7◐ B8⚠ B10 |
| C5 | `afterQ3/02_BCF_DEEP_INTEGRATION_AND_TECHNIQUES.md` | 14 | Q3a | C2 C3 C4 (schema, rescue, gates, skills, LoRA table); B8⚠ (45-min config) |
| C5 | `afterQ3/03_MATHEMATICAL_FOUNDATIONS_AND_FAULT_INTERFERENCE.md` | 18 | Q3b, Q3c | D1 D2 D3◐ D4◐ D5 D6 D7⚠ D8 E1 E6 E7; G2⚠ |
| C5 | `afterQ3/04_WHITEPAPER_COMPETITION_DRAFT3_PROPOSAL.md` | 17 | Paper draft | C5 C7◐ D8 D10⚠; G1⚠ (0.388 "M") |
| C6 | `00_EXECUTIVE_SUMMARY_AND_ROADMAP.md` | 13 | Q1 | A1 A5 A7⚠ A10 A12 B1 |
| C6 | `01_MASTER_PLAN_DAY0_TO_SPRINT6.md` | 20 | Q2 | B2 B3◐ B4 B5 B6 B8⚠ B9; A13 |
| C6 | `02_BCF_DEEP_INTEGRATION_AND_TECHNIQUES.md` | 16 | Q3a | C1◐ C2 C3 C4 |
| C6 | `03_MATHEMATICAL_FOUNDATIONS_AND_FAULT_INTERFERENCE.md` | 19 | Q3b, Q3c | D1 D2 D3⚠ D4◐ D5 D6 D7⚠ E1 E2 E5 E7; G2⚠ |
| C6 | `04_WHITEPAPER_COMPETITION_DRAFT3_PROPOSAL.md` | 14 | Paper | C5 C6⚠ C7 D8 D9◐ (projections labeled H/D) |
| C7 | `00_EXECUTIVE_SUMMARY_AND_ROADMAP.md` | 16 | Q1 | A1 A4◐ A5 A10 A12 A13 |
| C7 | `01_MASTER_PLAN_DAY0_TO_SPRINT6.md` | 24 | Q2 | B1 B2 B3◐ B5 B6 B8⚠ B9 |
| C7 | `02_BCF_DEEP_INTEGRATION_AND_TECHNIQUES.md` | 14 | Q3a | C2 C3 C4 |
| C7 | `03_MATHEMATICAL_FOUNDATIONS_AND_FAULT_INTERFERENCE.md` | 16 | Q3b, Q3c | D1 D2 D3⚠ D5 D6 D7⚠ E1◐ E2 E5; G2⚠ |
| C7 | `04_WHITEPAPER_COMPETITION_DRAFT3_PROPOSAL.md` | 11 | Paper | C5 C6⚠ D8 D10⚠; G1⚠ (45.0% "[M]") |
| C8 | `kagglecom_bcf_instantplan_[web-qwen38max].md` | 11 | Q1, Q2 | A4◐ A5 A9◐ A12 B1 B2◐ B6 |
| C9 | `kagglecom_bcf_instantplan_[genspark-gpt61sol].md` | 93 | Q1, Q2, Q3a, Q3b, Q3c (+ paper structure) | A1 A2 A4–A12 B1 B2◐ B5–B10 C1–C7 D1 D2 D4–D9 E1 E3◐ E4 E5–E8; F1◐ F2◐ F3◐ |
| C10 | `kagglecom_bcf_instantplan_[genspark-nemotron3ultra].md` | 49 | Q1, Q2, Q3a, Q3b, Q3c | A1 A5 A10–A13 B2 B3 B6 B8⚠ C2–C5 D1 D5⚠ D6 D7⚠ D8 E5⚠ E7; G1⚠ (Table 1) G2⚠ |
| C11 | `2026-09-30/00-README.md` | 2 | Index | F6 |
| C11 | `2026-09-30/01-roadmap-and-master-checklist.md` | 21 | Q1 | A1 A2 A4–A13; harness quirks Q1–Q6 |
| C11 | `2026-09-30/02-master-plan-day0-six-sprints.md` | 17 | Q2 | B1–B10 (B3 clock slots) |
| C11 | `2026-09-30/03-discussion-board-intel.md` | 19 | Addendum | F1 (22 threads, host tracker) |
| C11 | `2026-09-30/04-paper-track-intel.md` | 9 | Addendum | F2; C6 |
| C11 | `2026-09-30-2/100-README.md` | 2 | Index | F6 |
| C11 | `2026-09-30-2/101-bcf-integration-into-master-plan.md` | 26 | Q3a | C1⚠ (`called_by`) C2 C3 C4 C5 C7; D9 (5 predictions) |
| C11 | `2026-09-30-2/102-bcf-diagnostic-math-and-prior-research.md` | 45 | Q3b, Q3c | D1–D9 (MI-bias error) E1 E2 E3 E5 E6 E7 E8 (33 DOIs) |
| C11 | `2026-09-30-2/103-bcf-simulation-httpx-3672.md` | 28 | Q3b follow-up | F3 (verified traps; [SIM] trajectories) |
| C11 | `2026-09-30-2/103-…slides.html` | 51 | Slides | **Excluded** (HTML; duplicate of 103.md) |
| C11 | `2026-09-30-4/400-README.md` | 6 | Index (extra task) | F6; F4 summary |
| C11 | `2026-09-30-4/401-coderprog-catalog-bcf-ranked.md` | 23 | Extra | F4 (55 ranked resources) |
| C11 | `2026-09-30-4/402-0dayprizrak-catalog-bcf-ranked.md` | 18 | Extra | F4 (44 ranked resources) |
| C11 | `2026-09-30-4/403-foss-tools-bcf-ranked.md` | 30 | Extra | F4 (55 ranked repos; SWE-smith #1) |
| C12 | `00-README-cc-grok47.md` | 1 | Index | F6 |
| C12 | `01-roadmap-checklist-milestones.md` | 37 | Q1 | A1–A13; ceiling ladder; splits |
| C12 | `02-six-sprint-master-plan.md` | 31 | Q2 | B1 B2 B4 B5 B6 B7 B8◐ B9 B10 |
| C12 | `03-bcf-techniques-into-the-plan.md` | 24 | Q3a | C1 C2 C3 C4 C5 C7; F3⚠ (single-file claim) |
| C12 | `04-fault-interference-math-and-prior-work.md` | 43 | Q3b, Q3c | D1 D3 (coverage threshold) D4–D9; E1 E2 E3 E5 E6 E7 E8 |
| C12 | `05-coderprog-catalog-for-bcf-agent.md` | 66 | Extra | F4 (16 picks) |
| C12 | `06-0dayprizrak-catalog-for-bcf-agent.md` | 151 | Extra | F4 (38 picks) |
| C12 | `07-foss-tools-for-the-bcf-coding-agent.md` | 43 | Extra | F4 (ranked repos; Agentless #1) |
| C13 | `kagglecom_bcf_instantplan_[genspark-mimo26pro].md` | 70 | Q1, Q2, Q3a, Q3b, Q3c | A1 A2⚠ A4–A13 B1 B2◐ B6 B8 B10 C1–C7 D1 D2 D4–D9 E1 E3 E4 E5 E7; F1◐ F2◐ |
| C14 | `kagglecom_bcf_instantplan_[genspark-kimiK3].md` | 62 | Q1, Q2, Q3a, Q3b, Q3c | A1 A2⚠ A4–A13 B1 B3 B5 B6 B7 B8⚠ B9 B10 C1–C6 D1 D2 D4–D9 E2 E5 E6 E7; F3◐ |
| C15 | `kagglecom_bcf_instantplan_[genspark-deepseekv41flash].md` | 84 | Q1, Q2, Q3a, Q3b, Q3c (+ intel delta) | A1 A2 A4–A13 B1 B2 B3 B5–B10 C1–C7 D1 D2 D4–D9 E1 E4 E5 E6 E7 E8; F1 F3◐ |
| C16 | `kagglecom_bcf_instantplan_[cc-glm53flash].md` (9 combined docs) | 280 | Q1, Q2, paper intel, Q3a, Q3b, Q3c, 3 extra catalogs, httpx_3672 sim | A1 A2 A4–A10 A12 A13 B1 B2 B4 B6 B7⚠ B8⚠ B9 B10 C1–C7 D1–D6 D8 D9 E1 E2 E3 E6 E7; F2 F3⚠ F4 F6 |

---

## Part 3 — Extra questions answered beyond `chat_questions.txt`

| Extra deliverable | C11 | C12 | C16 | Notes |
| --- | :---: | :---: | :---: | --- |
| `coderprog_catalog.json` ranking | ✓ (55) | ✓ (16) | ✓ | Mostly books/courses; use for learning post-training/RL and evals |
| `0dayprizrak_catalog.json` ranking | ✓ (44) | ✓ (38) | ✓ | C11 ranks harness/loop-engineering courses highest; C12 ranks pytest material first |
| `foss_tools/` ranking | ✓ (55) | ✓ | ✓ | Consensus picks: SWE-smith, SWE-agent / mini-swe-agent, Agentless, Unsloth/PEFT/TRL, SWE-Gym, R2E-Gym, SWE-bench-Live, rLLM/verl/SkyRL. These feed options O8/O9/O11 in file 03 |
| Forum / paper-track intel | ✓ (origin) | — | ✓ (own scrape) | C9, C10, C13, C14, C15 were later supplied C11's intel |
| `httpx_3672` real-data walkthrough | ✓ (verified) | — | ⚠ (from upstream PR, errors) | Used by C9, C14, C15 as supplied context |


---

<!-- ====================================================================== -->
<!-- FILE: 06_QC_Report.md -->
<!-- ====================================================================== -->

# QC Report — Markdown Tables and Verification Log

**Date:** 2026-10-01

## 1. Table quality check

| Step | Check | Tool |
| --- | --- | --- |
| 1 | Structural lint outside code fences: header, separator, and every row have equal column counts; separators are valid; no empty header cells; blank line before and after each table | `scratch/council3/qc_tables.py` |
| 2 | Render check: GFM-table renderer (markdown-it-py, CommonMark + tables) produces one `<table>` per source table, and every rendered row has the header's cell count | `scratch/council3/qc_render.py` |
| 3 | Pipe safety: literal pipes inside cells are escaped as `\|`; a regex containing pipes was moved out of a table into a code block | Manual + step 1 |

| File | Tables (source) | Tables (rendered) | Structural errors | Row mismatches | Result |
| --- | ---: | ---: | ---: | ---: | --- |
| 01_Model_Council_Report.md | 15 | 15 | 0 | 0 | PASS |
| 02_Claims_Feasibility_and_Win_Probability.md | 24 | 24 | 0 | 0 | PASS |
| 03_Master_Options_and_Project_Plans.md | 60 | 60 | 0 | 0 | PASS |
| 04_Open_Questions_Roundup.md | 8 | 8 | 0 | 0 | PASS |
| 05_Content_Comparison_Matrix.md | 8 | 8 | 0 | 0 | PASS |
| **Total** | **115** | **115** | **0** | **0** | **PASS** |

Defects found and fixed:

| # | Defect | Fix |
| --- | --- | --- |
| 1 | LoRA target-module regex with `\|` alternation inside a table cell would split the row | Moved the regex into a fenced code block below the table |
| 2 | Indented table inside a numbered list ran directly into the next list item (no blank line after) | Inserted a blank line |
| 3 | The ✓-count summary in file 05 was first estimated by hand | Recomputed by script from the matrix rows (54 elements) |
| 4 | Option effort totals in Part C of file 03 did not match the per-option hh:mm tables | Reconciled Part C to the per-option totals |

## 2. Verification log (facts checked this session)

| Claim checked | Method | Result |
| --- | --- | --- |
| Train repo counts, hints, statement length | Parsed `tasks.jsonl` from the data zip | 67/48/13/1; hints empty 129/129; median 418 |
| Tracebacks / exception names in issues | Regex over 129 problem statements | 0 tracebacks; 15 name Error/Exception/Warning |
| Files per gold patch | Counted `+++ b/` headers | 91 / 19 / 19 (1 / 2 / 3+) |
| Graph edge types, node fields, isolation | Parsed 4 graph JSONs | All `calls`; `id/name/text`; fastapi 72% isolated |
| `httpx_3672` facts | Extracted the snapshot + task record | 7 source files; 9,385-char patch; `_server.py:92` no parens; test lines 70/116/318/557/594 |
| Sample adapter format | Read `adapter_config.json` + safetensors header | r=4, layer 0, q/o_proj; keys `base_model.model.model.language_model.layers.0.self_attn.*`; hidden 5,376 |
| `httpx_6821` | Dossier text | Invented task ID (dossier Turn 7) |
| Al-Bataineh ASE 2025 | Web search (IEEE Xplore 11334567) | Exists; DOI 10.1109/ASE63991.2025.00319 |
| DiGiuseppe & Jones ICSM 2011 | Web search (spideruci.org) | >65,000 multi-fault versions |
| Debroy & Wong ISSRE 2009 | Web search (IEEE 5362110) | Exists; interference ≈ 67% (survey) |
| An et al. Defects4J multi-fault | Web search (arXiv 2108.04455) | 311/326 (95.4%) |
| ChainSWE | Web search (arXiv 2607.02606) | Exists (100 chains, 304 instances) |
| OpenAI retired SWE-bench Verified | Web search | Feb 23, 2026; 59.4% of 138 audited failures |

Sources used for web checks:

- [IEEE Xplore — Interaction-Aware Patch Assessment for Multi-Fault APR](https://ieeexplore.ieee.org/document/11334567/)
- [spideruci.org — Fault interaction and its repercussions](https://spideruci.org/publication/digiuseppe-fault-2011/)
- [IEEE Xplore — Insights on Fault Interference for Programs with Multiple Bugs](https://ieeexplore.ieee.org/document/5362110/)
- [arXiv 2108.04455 — Searching for Multi-Fault Programs in Defects4J](https://arxiv.org/abs/2108.04455)
- [arXiv 2607.02606 — ChainSWE](https://arxiv.org/abs/2607.02606)
- [OpenAI Developers on X — SWE-bench Verified](https://x.com/OpenAIDevs/status/2026002219909427270)
- [WebProNews — SWE-Bench Verified's sudden fall](https://www.webpronews.com/swe-bench-verifieds-sudden-fall-how-openai-exposed-flaws-in-ai-codings-top-metric/)

