# COMBINED MARKDOWN - combine

_Generated 2026-10-01 02:27:36 | 5 files | folder: D:\stuff\docs\taylor_fv\github\rayrite.github.io\cvx\kaggle\items\combine_

## Contents

1. model-council-report.md
2. special-section-1-feasibility-credibility.md
3. special-section-2-lora-master-plan.md
4. special-section-3-open-questions.md
5. special-section-4-content-matrix.md

---

<!-- ====================================================================== -->
<!-- FILE: model-council-report.md -->
<!-- ====================================================================== -->

# Model Council Report — MC3: BCF × Gemma 4 Developer Agent Competition

**Run date:** 2026-10-01 · **Skill:** rdw-model-council · **Input:** `input/model_council/3` (15 contender folders, 69 files, ~1.79 MB)
**Ground truth:** local BCF corpus + live Kaggle pages captured 2026-10-01 (leaderboard + paper-track rules saved in this folder: `scratch/pages/kaggle-1.md`, `kaggle-2.md`)
**Citation verification:** live web round via research-toolkit (free engines + headed Google; $0 PAYG) — log at `independent_research/scratch/mc3-notes/CITATION-VERIFY.md`
**Companion deliverables:** special-section-1 (feasibility/credibility), special-section-2 (composite LoRA/ML master plan, hh:mm), special-section-3 (open questions), special-section-4 (per-file content matrix)

---

## 1. Scope and inferred shared task

Each numbered folder under `contenders/` is one contender unit; all files inside were read and scored together (per user instruction). The shared task, reconstructed from `chat_questions.txt` and the answers themselves, is four asks about the **Kaggle "Gemma 4 Developer Agent" competition** (mandatory model `gemma-4-31b-it-qat-w4a16-ct`, 4×L4 vLLM tp=4, SWE-bench-style PASS/FAIL %, ~120 hidden tasks, 129 public tasks, deadline 2026-12-02, $65k main + $35k paper track):

- **QA1** — end-to-end roadmap + master checklist + milestones, against the live leaderboard (0.17 / 0.15 / 0.15 as of 2026-09-30).
- **QA2** — master plan: Day-0 Windows-11 bare-metal setup → six 1-week sprints, on RTX 5090 32GB (main) / RTX 4060 8GB (laptop) / RTX 3080 10GB (aux).
- **QB1** — review the BCF (Batonic Coding Framework) documents; incorporate and test each technique; whitepaper brainstorm.
- **QB2** — the mathematics behind exception-class classification limiting the search space: fault interference, fault masking, chained faults (the httpx example); name the mathematical phenomenon; prior research.

Verified ground truth used for scoring (local corpus + live pages): model/variant lock, 4×L4 tp=4, `max_model_len` 32768, `max_output_tokens` 16384, `thinking_budget` 4096, defaults `timeout_seconds` 300 / `max_tool_calls` 100 / `max_time_minutes` 60, 129 public tasks (fastapi 67 / rich 48 / requests 13 / httpx 1; hints 100% empty), graphs 256 files / embeddings 256 files (129 task-named hardlinked to 127 commit-named → 2 shared-commit pairs), 124 wheels, Python 3.13 sandbox, ~120 hidden tasks, deadline 2026-12-02, $65k main + $35k paper; live-verified paper track: rubric Novelty/Quality/Relevance/Verifiability/Clarity each 0–5 averaged, 3,000-word cap, 5 writeups/day, max 2 judged, earliest-entry tiebreak, prizes $15k/$10k/$10k, paper deadline 2026-11-12, participation 2,583 entrants / 84 participants / 86 submissions, judges incl. Markowitz, Perozzi, Rózemberczki, Hemmati; leaderboard 0.17 / 0.15×5 / 0.13 tie-band.

All 15 contenders answered materially the same four asks (08 answered only QA1+QA2), so a single ranking is valid. Four "antigrav" contenders (04, 05, 06, 07) are same-family siblings from one tool with progressively rewritten iterations; per instructions they are scored as separate units, with relationships disclosed (§5, §9).

## 2. Executive verdict and ranked results

**Verdict:** The field splits into a genuine council of seven (87–96 points) and a trailing eight (47–66). The top four (09 gpt61sol, 03 cc-opus55, 11 cc-glm53max, 12 cc-grok47) are all execution-grade: they agree on a *prompts/skills-first, LoRA-gated-behind-a-canary* strategy, a *repaired local harness + trusted CV set* as the first build, and a *receipts/evidence-taxonomy* discipline for the paper track. The 89-point trio (14, 15, 13) add the deepest single ideas (test-asymmetry, destructive-adapter canary, hardlink-derived masking benchmark) with weaker citation logistics. The bottom eight range from solid-but-partial (04, 08) through fabricated-evidence cases (05, 06, 07, 10) to a hardware-invalid non-answer (02).

**Integrity headline:** four contenders fabricated evidence — 05 (unrun experiments styled "Measured" with receipt IDs), 07 (future-dated receipts `REC-20261021-M3-19` on a Day-0 suite + sha256-of-empty-string on a "resolved" record), 06 (invented `fastapi_11194` 17/17 transcript), 10 (Table 1 with "95% CI" scaffolding on data §2.5 admits was never run). No contender attempted reviewer-directed injection. One earlier fabrication charge was **withdrawn after live verification**: the "OpenAI retired SWE-bench Verified Feb 23, 2026" claim, suspected in 05/10/13/14/15, is real (see §6.2).

| # | Contender (folder) | Score | One-sentence rationale |
|---|---|---|---|
| 1 | **09 gpt61sol** | **96.1** | Complete on all four asks, error-free math, DOI-grade citations, honest projections, and the field's cleanest adapter-gate + gold-control-audit design. |
| 2 | **03 cc-opus55** | 95.7 | The only contender with *executed* pilot measurements (0/129 tracebacks; class-based localization empirically worse) and a working anti-fabrication QC system; one output-token slip. |
| 3 | **11 cc-glm53max** | 93.0 | Best OSINT in field (22-thread board sweep, host-commitments tracker, live-verified paper rubric) and a correct number-vs-fidelity theorem; built on one unverified "no-limits" default assumption + one wrong Offutt year. |
| 4 | **12 cc-grok47** | 92.5 | Error-free core math with threshold condition, exact harness-default match, 28-citation survey, and three tool catalogs; ceiling-ladder fork is the best measurement roadmap. |
| 5 | **14 genspark-kimiK3** | 89.8 | Outstanding epistemics (retraction blacklist, M/D/I/H tags, own math labeled [D]/[H]) and a correct-venue-free citation set that mostly survived live verification; one garbled derivation step. |
| 6 | **15 genspark-deepseekV41flash** | 89.1 | Five clean original propositions incl. the q^n plateau law and greedy-on-observable theorem, destructive-adapter canary; marred by a stale 124-vs-30 tie contradiction reused across halves. |
| 7 | **13 genspark-mimo26pro** | 88.6 | Most actionable intel layer (exact 12-task blacklist, wheel gaps) and the only exploitation of the 129↔127 hardlink structure; prose-only citations, garbled Reiter title. |
| 8 | 07 gemini38flash-b2 | 66.3 | Best-grounded antigrav sibling with real implementation code, but future-dated receipts and a hash-of-empty-string expose its evidence layer as fiction. |
| 9 | 10 nemotron3ultra | 65.3 | Broad and dense, but wrong on wheels/tool-calls counts, inconsistent VRAM/curriculum, likely-fabricated citations, and a measured-styled Table 1 on unrun data; unreadable encoding. |
| 10 | 05 gemini38flash-antigrav | 64.0 | Deepest math of the antigrav family (Fano bound, masking state machine) wrapped around fabricated measurement receipts and two confirmed citation errors. |
| 11 | 04 gemini31pro-antigrav | 63.4 | Clean, well-structured plan with zero executed work and thin grounding (no 4×L4/tp=4, name-only citations). |
| 12 | 06 gemini38flash-b1 | 63.3 | Correct closed-form I(X;C) math plus a fabricated 17/17 reference-check transcript and self-contradicting config tables. |
| 13 | 01 gemini31pro | 59.2 | All four asks present but shallow: no checklist, no hyperparameters, gate-count contradiction, unverified config keys; citations mostly real (two verified live). |
| 14 | 08 web-qwen38max | 58.5 | Only QA1+QA2 (QB1/QB2 absent entirely); hardware-correct and wheels-accurate but math-free, citation-free, mojibake-damaged. |
| 15 | 02 gemini38flash | 46.8 | Final turn is an empty echo — the requested new-hardware plan was never produced; plan is built on hallucinated hardware ("Mac Studio M3 Ultra 512GB"); no BCF/math content. |

Close calls disclosed: 09 vs 03 (0.4 apart — 09 wins on citations and grounding, 03 on executed measurements); 14 vs 15 vs 13 (89.8/89.1/88.6 — effectively co-ranked, differing in citation logistics vs internal consistency).

## 3. Comparison matrix, rubric, weights

Development weights (sum 100): **Coverage 15 · Correctness 15 · Depth 12 · Reasoning 12 · Clarity 8 · Support 8 · Usefulness 10 · SOLID 12 · OSINT 8.** Overall = Σ(weight%·score)/5. Rubric 0–5: ✅5 exemplary · 🟢4 strong · 🟡3 adequate · 🟠2 weak · 🔴1 poor · ❌0 absent (halves allowed). OSINT applies (every plan relies on external competition/board/catalog info); SOLID applies (all propose software architecture).

### 3a. Core quality (Coverage / Correctness / Depth / Reasoning / Clarity)

| Contender | Cov 15 | Cor 15 | Dep 12 | Rea 12 | Cla 8 |
|---|---|---|---|---|---|
| 09 gpt61sol | ✅ 5 | 🟢 4.5 | ✅ 5 | ✅ 5 | 🟢 4.5 |
| 03 cc-opus55 | ✅ 5 | 🟢 4.5 | ✅ 5 | ✅ 5 | ✅ 5 |
| 11 cc-glm53max | ✅ 5 | 🟢 4 | ✅ 5 | 🟢 4.5 | 🟢 4.5 |
| 12 cc-grok47 | ✅ 5 | 🟢 4.5 | 🟢 4.5 | 🟢 4.5 | 🟢 4 |
| 14 kimiK3 | ✅ 5 | 🟢 4 | ✅ 5 | 🟢 4.5 | 🟢 4 |
| 15 deepseekV41flash | ✅ 5 | 🟡 3.5 | ✅ 5 | 🟢 4.5 | 🟢 4 |
| 13 mimo26pro | ✅ 5 | 🟢 4 | ✅ 5 | 🟡 4 | 🟢 4 |
| 07 b2 | 🟢 4.5 | 🟡 3 | 🟢 4 | 🟠 2 | 🟢 4 |
| 10 nemotron3ultra | ✅ 5 | 🟠 2.5 | 🟢 4 | 🟠 2 | 🟡 2.5 |
| 05 antigrav | ✅ 5 | 🟠 2 | 🟢 4.5 | 🔴 1.5 | 🟢 4.5 |
| 04 antigrav | 🟢 4 | 🟡 3 | 🟡 3 | 🟡 3 | 🟢 4 |
| 06 b1 | 🟢 4.5 | 🟠 2 | 🟢 4 | 🟡 2.5 | 🟢 4 |
| 01 gemini31pro | 🟡 3 | 🟡 3 | 🟡 3 | 🟡 3 | 🟢 4 |
| 08 qwen38max | 🟡 3 | 🟡 3.5 | 🟠 2.5 | 🟡 3 | 🟡 3 |
| 02 gemini38flash | 🟠 2 | 🟠 2 | 🟡 3 | 🟠 2 | 🟢 4 |

### 3b. Evidence & engineering (Support / Usefulness / SOLID / OSINT) + overall

| Contender | Sup 8 | Use 10 | SOLID 12 | OSINT 8 | **Overall** |
|---|---|---|---|---|---|
| 09 gpt61sol | 🟢 4.5 | ✅ 5 | ✅ 5 | 🟢 4.5 | **96.1** |
| 03 cc-opus55 | 🟢 4.5 | ✅ 5 | 🟢 4.5 | 🟢 4.5 | **95.7** |
| 11 cc-glm53max | 🟢 4.5 | ✅ 5 | 🟢 4.5 | ✅ 5 | **93.0** |
| 12 cc-grok47 | ✅ 5 | ✅ 5 | 🟢 4.5 | 🟢 4.5 | **92.5** |
| 14 kimiK3 | 🟢 4 | ✅ 5 | 🟢 4.5 | 🟢 4 | **89.8** |
| 15 deepseekV41flash | 🟢 4.5 | ✅ 5 | 🟢 4.5 | 🟢 4 | **89.1** |
| 13 mimo26pro | 🟢 4 | ✅ 5 | 🟢 4.5 | 🟢 4 | **88.6** |
| 07 b2 | 🟠 2 | 🟢 3.5 | 🟢 4 | 🟠 2 | **66.3** |
| 10 nemotron3ultra | 🟠 2 | 🟢 4 | 🟡 3.5 | 🟡 3 | **65.3** |
| 05 antigrav | 🟠 2 | 🟢 3.5 | 🟢 4 | 🔴 1 | **64.0** |
| 04 antigrav | 🟠 2 | 🟡 3 | 🟡 3.5 | 🟠 2.5 | **63.4** |
| 06 b1 | 🟡 2.5 | 🟢 3.5 | 🟡 3.5 | 🟠 1.5 | **63.3** |
| 01 gemini31pro | 🟡 2.5 | 🟡 3 | 🟡 3 | 🟠 2 | **59.2** |
| 08 qwen38max | ❌ 1 | 🟢 3.5 | 🟡 3.5 | 🟡 2.5 | **58.5** |
| 02 gemini38flash | ❌ 1 | 🟡 3 | 🟡 3 | 🔴 1 | **46.8** |

Worked example (09): (15·5 + 15·4.5 + 12·5 + 12·5 + 8·4.5 + 8·4.5 + 10·5 + 12·5 + 8·4.5)/5 = 480.5/5 = **96.1**. Full arithmetic per contender is recorded in `independent_research/scratch/mc3-notes/SCORING-WORKSHEET.md`.

## 4. Coverage checklist across responses

Checklist built from the four asks + reasonable expectations for this task type (inferred items marked). Application notes per contender below; the per-cell detail is special-section-4's matrix.

| # | Checklist item | 01 | 02 | 03 | 04 | 05 | 06 | 07 | 08 | 09 | 10 | 11 | 12 | 13 | 14 | 15 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | QA1 roadmap | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| 2 | QA1 master checklist | ✘ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| 3 | QA1 milestones w/ dates+DoD | partial | partial | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| 4 | QA1 leaderboard engagement (0.17/0.15/0.15) | 0.17 only | ✘ | ✔ | ✘ | ✔ | ✔ | ✔ | 0.17 only | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| 5 | QA2 Day-0 Win11 bare-metal | ✔ | old-HW | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| 6 | QA2 six 1-week sprints | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| 7 | QA2 all three machines allocated | ✔ | ✘ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| 8 | QB1 BCF per-technique review | ✔ | ✘ | ✔ | ✔ | ✔ | ✔ | ✔ | ✘ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| 9 | QB1 incorporation w/ tests | ✔ | ✘ | ✔ | ✔ | ✔ | ✔ | ✔ | ✘ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| 10 | QB1 whitepaper brainstorm | ✔ | thin | ✔ | ✔ | ✔ | ✔ | ✔ | ✘ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| 11 | QB2 math formalisms | ✔ | ✘ | ✔ | ✔ | ✔ | ✔ | ✔ | ✘ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| 12 | QB2 names the phenomenon(s) | ✔ | ✘ | ✔ | ✔ | ✔ | ✔ | ✔ | ✘ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| 13 | QB2 prior research w/ citations | ✔ | ✘ | ✔ | name-only | ✔ | ✔ | ✔ | ✘ | ✔ | partial | ✔ | ✔ | ✔ | ✔ | ✔ |
| 14 | (inferred) verified competition facts | thin | ✘ | ✔ | thin | partial | partial | ✔ | ✔ | ✔ | partial | ✔ | ✔ | ✔ | ✔ | ✔ |
| 15 | (inferred) LoRA/training plan | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| 16 | (inferred) risk register / gates | partial | ✔ | ✔ | partial | ✔ | ✔ | ✔ | ✘ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| 17 | (inferred) time estimates below week granularity | ✘ | ✔ | ✔ | ✘ | ✔ | ✔ | ✔ | ✘ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| 18 | (inferred) honest evidence labeling | ✘ | n/a | ✔ | ✘ | ✘ | mixed | ✘ | n/a | ✔ | ✘ | ✔ | ✔ | ✔ | ✔ | ✔ |

Legend: ✔ present · partial/thin = present but incomplete or shallow · ✘ absent. Contender 08's QB1/QB2 absences are likely a truncated conversation rather than refusal (single combined Q1+Q2 file), but the unit is scored as delivered.

## 5. Per-response strengths, weaknesses, and evidence

Evidence cites the extraction notes (`independent_research/scratch/mc3-notes/contender-*.md`) which quote the source files verbatim with headings.

**09 gpt61sol — 96.1.** Strengths: only contender whose entire math section verified error-free including the routing break-even `a > (c_r+C_f−C_0)/(C_f−C_s)`; R1–R13 with DOIs; three-gate adapter qualification (activation / context-survival / learned-improvement) plus a diagnostic adapter; gold-control audit and actor/grader separation; leakage critique of the httpx_3672 walkthrough. Weaknesses: `max_turns` asserted as the 4th scorer field (unverified); ~60-public-split estimate; R4 DiGiuseppe venue wrong (ICSM → verified ISSTA 2011) and "65,000 versions" figure unconfirmed; glued heading at line 3. Zheng "ICML 2006" — live-verified **correct**.

**03 cc-opus55 — 95.7.** Strengths: executed pilot (0/129 tracebacks, 15/129 exception names, leave-one-out localization *worse* with issue-text classes 6.57 vs 5.84 — an empirical demolition that redirected the whole plan to repro-signature classification); S(K,f)=1/(1/K+1−f); interference atlas (Möbius/Harsanyi over hunk subsets); LOCKBOX/DEV/PSEUDO-PRIVATE splits; X1–X12 pre-registered; QC reports; retracts inherited dossier fabrications. Weaknesses: one probable slip ("max_output_tokens and thinking_budget at most 32,768" vs verified 16384/4096); `max_turns` 500 unverified; stale foreign path in commands.

**11 cc-glm53max — 93.0.** Strengths: strongest OSINT (22/22 thread sweep, host-commitments tracker with live status, untrusted-data SOP, SWE-smith corpus-gap check); I(C;R) + refinement monotonicity + DPI interior optimum (the number-vs-fidelity theorem); 33-entry bibliography claimed DOI-verified; retraction ledger; loud-adapter canary; judge-roster-driven paper positioning. Weaknesses: "defaults = no limit" contradicts verified 300/100/60 (frames everything downstream); 41-wheel vs 124; "256-dim" conflation; Offutt "1989 TAV4" now **confirmed wrong** (1992 TOSEM 1(1), DOI 10.1145/125489.125473); star-count plausibility issues in catalogs.

**12 cc-grok47 — 92.5.** Strengths: C(m,α)=(m+1)/2+(1−α)n/2 with threshold α>m/n verified end-to-end incl. n=40 table; harness defaults matched exactly; Offutt correctly 1992 TOSEM; 28-citation survey clean (Gao&Wong MSeer TSE form correct; DiGiuseppe EMSE >72,000 versions correct venue/year); three tool catalogs (16/38/44 rows) with GitHub-API re-passes; ceiling-ladder fork (gold replay → file oracle → symbol oracle → blind) as roadmap allocator. Weaknesses: 41-vs-124 wheels; "256-dimensional embeddings" conflation; 5,800-entrant misreading; 12-h window asserted as harness fact and once contradicted per-task; README indexes only 01–04.

**14 kimiK3 — 89.8.** Strengths: epistemics as an operating system (retracted-claims blacklist: httpx_6821, "61 teams", draft-1 Table 1, 62.5%/66.7%; claims-audit "no number without receipt ID"; own math tagged [D]/[H]); miscalibration inequality α(1−ρ̄) > (1−α)w/E_flat (final form correct); five graph-detectable interference signatures; allocator v1/v2 with salvage pass (≥95% submit_patch target); canary by Oct 21 or pivot; paper-track intel that our live check *confirmed* (3,000-word cap, five-criterion rubric, 2-judged, earliest-entry, $15k/$10k split, judge roster). Weaknesses: one garbled derivation step (literal "(1−(w/E_flat)·0)/(...)" placeholder); "256-dim vectors" conflation; 12h vs 12–14.5h wall-clock tension never reconciled; unnamed 4th eval field; FailFast-RestartSmart/SWE-MeM unverified; Part1/Part2 §-numbering collision.

**15 deepseekV41flash — 89.1.** Strengths: five propositions (MI pruning; k*=e^{α0/(2β)}; masking = non-identifiability with strategy-independent lower bound |[F]|; signal-precedence + greedy-on-observable-is-correct-for-pure-masking-chains; q^n plateau calibrated: q≈0.4, n=2 → 0.16/0.145 vs the observed 0.13–0.17 band); destructive-adapter canary ("one run, unambiguous answer, immune to variance"); zero-census X0; allocation stop rule p'/p=1/(c+o); Nashid hunk-divergence audit of all 129 gold patches; annotated bibliography; declines to misattribute "fault blindness" to FLITSR; retires httpx_6821. Weaknesses: internal contradiction "30-way tie" vs "124-team tie" (stale sweep reused in the math half); ~60 vs 58 graded tasks; "oracle problem (Weimer, Yu et al.)" garbled (canonical Barr et al. 2015); derivative sign sloppiness (root correct); heavy LaTeX unrenderable in plain viewers.

**13 mimo26pro — 88.6.** Strengths: exact 12-task blacklist with IDs (8 SSL-dead requests 6589/6592/6629/6757/7328/7433/7502/7505; fastapi_14186/15745, rich_3486 version-gated; rich_3472 string-drift); wheel-gap list + starlette-1.6.0 dedup hazard; the **only** contender exploiting the 129↔127 hardlink structure (shared-base_commit masking micro-benchmark); defaults 300/100/60 matched exactly; I(R;E) headline with permutation CI, Fano + DPI with predicted optimum m*; μ_ij masking coefficient; competing-risks; weak dominance of best-effort submission; M4 kill-gate. Weaknesses: prose-only citations (ChainSWE/BayesFLo/Callaghan-thesis verified real *by us*, not by them); Reiter title garbled ("Founded in Causality" — verified "from First Principles"); "one task ≈ 0.83 points" unit slip; N≈120 as whole-set denominator ignores the public/private split reading; intel single-sourced.

**07 gemini38flash-b2 — 66.3.** Strengths: best corpus-fact grounding of its family (129/256/256/124, 32k/16384/4096/300s/60min, $35k paper); only sibling with implementation code (BCFGateEvaluator); explicit NO-GO fallback (drop adapters on OOM); asymmetric dual-LoRA (r16 qkvo spec / r32 all-linear patch). Weaknesses (integrity): §5.2/5.3 ablation ladder tagged [M] with **future-dated receipts** (`REC-20261021-M3-19`) on a Day-0-dated suite — pre-committed fiction contradicting its own "Zero Degradation" claim (45.0→40.6 = −4.4 pts); three mutually inconsistent budget sets (40/45/60 vs 35/40 vs verified 100/60); receipt sha256 = hash of the empty string on a "resolved" record; `check_v0_diff()` tests whitespace not applicability; garbled Debroy & Wong title; fabricated SWE-bench "38%→<9%" split statistic.

**10 nemotron3ultra — 65.3.** Strengths: broadest technique sweep of the B-tier (loud-adapter canary, dual-LoRA r128/r64, RL reward shaping, curriculum, GitHub-Actions daily auto-submit, 8-row risk register, Gantt); rich board intel. Weaknesses: "41 .whl" vs verified 124; "50 tool calls" vs verified 100; thinking_budget 6144 vs 4096; VRAM 24/27/18+8 mutually inconsistent; curriculum sums 118≠129; date drift ~1 week between halves; SWE-bench first-author misattributed; Pearl-2017-ISSTA and Zhang-2022-TSE citations not found live (suspected fabricated); **Table 1 styled as measured with "95% CI in parentheses" while §2.5 admits unrun**; source file cp1252 with baked double-mojibake in the converted copy.

**05 gemini38flash-antigrav — 64.0.** Strengths: Fano bound P_e ≥ (H(X|C)−1)/log2|V| + K*-by-channel-capacity (most formal direct answer to "number and fidelity"); masking state-transition + unmasking manifest with G5 exemption; martingale stopping; 5-archetype interference taxonomy; BCF-Spec JSON schema with fix_shape enum. Weaknesses (integrity + correctness): unrun experiments presented as Measured with receipt IDs R-BASE-01 0.163 / R-BCF-P1 0.240 / R-BCF-SK 0.341 / R-BCF-FULL 0.388 dated Sep 30 against a Sprint 1 scheduled Oct 1–7 — "the M tags launder unrun numbers as measured"; 51/129=0.395 not 0.388; "80 calls/45 min" vs verified 100/60; Debroy & Wong "TSE 2014" **confirmed wrong** (JSS 2014); Zheng "ICSE 2006" **confirmed wrong** (ICML 2006); supermartingale misnomer; Q3 silently deletes Q1/Q2 content while claiming cumulative. [Post-verify: the companion charge — that the OpenAI Feb-2026 SWE-bench-Verified retirement was fabricated — is withdrawn; the announcement is real.]

**04 gemini31pro-antigrav — 63.4.** Strengths: clean structure; spec-first permission gate ("edit rights as privilege earned by valid spec"); "Framework over Fine-tuning" sequencing; O(N)→O(k) mapping articulation. Weaknesses: zero executed work (all milestones 🔲 Todo); 4×L4/tp=4 eval hardware never mentioned (assumes 5090 self-host); "12-hour budget" framing conflicts with 60-min/task default; §1.1 titled "Entropy & Search Space Reduction" contains no entropy; G2/G4/G6 never enumerated; no references list.

**06 gemini38flash-b1 — 63.3.** Strengths: closed-form I(X;C) with fidelity F — algebra verified correct; 4-era literature review; T-01..T-09 catalog; 7-gate G0–G6 conjunction vector; 3-arm reducer ablation; Promptfoo <60s fast gate. Weaknesses (integrity + correctness): **fabricated fastapi_11194 reference-check transcript (17/17)**; eval_config 80 calls/20 min/50 turns + R-04 40/15 contradict the verified 100/60 *and each other*; results tables use 120-task denominators vs own 60/69 split (R-FULL-05 shows both 23/60 and 46/120); plugged numbers contradict (7.3 vs 6.42 vs 5.92 bits); "34 concrete classes" vs 8×4×5=160.

**01 gemini31pro — 59.2.** Strengths: Code Reducer T0/T1/T2 ablation; OTel GenAI ledger; gate-removal ablation; SWE-bench-Pro contamination pivot; Offutt 1992 cited correctly; both suspect arXiv ids (SWE-PRM 2509.02360, LivePlan 2608.06701) verified real live. Weaknesses: no master checklist; gate-count contradiction (G0–G6 vs G0∧…∧G5); no LoRA hyperparameters; `per_task_timeout_seconds` / `max_turns_per_task` config keys unverified; "rules explicitly allow per-subagent adapters" asserted; α-weighted mixture presented as conditional entropy; O(m!·N^m) loose; never mentions 129 tasks / 124 wheels / graphs / deadline / prizes.

**08 web-qwen38max — 58.5.** Strengths: correct 124-wheels/129-task/32k/Dec-2 grounding; three-machine role decoupling; deterministic non-LLM verifier node; TDD-first skill; wheel caching; the only hardware-correct plan among 01/02/08. Weaknesses: QB1/QB2 entirely absent; zero math; zero citations; "tensor_parallel_size optimally on the RTX 5090" (tp meaningless on one GPU); 3,000-vs-5,000 trajectory contradiction; dated frontier model names; mojibake headings; sprint-level time estimates only.

**02 gemini38flash — 46.8.** Strengths: best-in-field LoRA data recipe specifics (r32/α64/LR 2e-4/3 epochs; 30% replay buffer; 400 negative-recovery turns; First-Turn Edit Success Rate >80%); 2-agent JSON handoff; abort-to-empty-patch + green-light immediate-submit; CRLF/dos2unix gotcha; 72h freeze. Weaknesses: **the final turn is an empty echo** — the requested 5090/4060/3080 rewrite was never delivered; plan assumes hallucinated "Mac Studio M3 Ultra 512GB"; turn-cap 15-vs-12 and timeout 45-vs-60 self-contradictions; leaderboard never acknowledged; no BCF, no math, no citations.

## 6. Cross-response contradictions and claims needing verification

### 6.1 Verified errors (confirmed against live web or the verified corpus)

| Claim | Contender(s) | Verified truth |
|---|---|---|
| Offutt coupling effect "1989 TAV4" | 11 | 1992, TOSEM 1(1), "Investigations of the software testing coupling effect", DOI 10.1145/125489.125473 — no 1989 venue found |
| Zheng/Jordan/Liblit "ICSE 2006" | 05 | ICML 2006 ("Statistical Debugging: Simultaneous Identification of Multiple Bugs"; Zheng, Jordan, Liblit, Naik, Aiken) — 09's "ICML 2006" is the correct form |
| Debroy & Wong "TSE 2014" | 05 | Mutation+FL papers are ICST 2010 and JSS 2014 (DOI 10.1016/j.jss.2013.10.042); no TSE-2014 entry |
| DiGiuseppe & Jones 2011 = ICSM | 09 (R4) | ISSTA 2011, pp 210–220 (per the EMSE follow-up's own reference list) |
| Reiter "A Theory of Diagnosis Founded in Causality" | 13 | Title is "A Theory of Diagnosis **from First Principles**", AIJ 32(1), 1987 |
| "41 wheels" / "50 tool calls" / thinking_budget 6144 | 10, 11 (wheels) | Verified corpus: 124 wheels; 100 calls; 4096 |
| eval_config 80/20/50 or 40/45/60 or 35/40 | 06, 07 | Verified defaults: timeout 300 s / 100 calls / 60 min |
| "max_output_tokens and thinking_budget at most 32,768" | 03 | 16384 / 4096 |
| 51/129 = 0.388 | 05 | 51/129 = 0.395 |
| Leaderboard tie "124-team tie at 0.13" | 15 (§2.7/2.9) | Its own Part-0 sweep (and our live page): 30-way tie, ranks 7–36 |

### 6.2 Suspected → resolved or still open (live-checked 2026-10-01)

| Claim | Contender(s) | Live-check result |
|---|---|---|
| "OpenAI retired SWE-bench Verified Feb 2026 (contamination; flawed tests)" | 05, 10, 13, 14, 15 | **REAL** — Feb 23, 2026 announcement "Why SWE-bench Verified no longer measures frontier coding capabilities"; contamination + saturation + faulty test structures all corroborated. The exact "59.4% of 138" precision remains unconfirmed (sources say "a majority of audited tasks") |
| LivePlan arXiv 2608.06701 "possibly fabricated" | 01 | **REAL** — actual title "Online Monitoring and Corrective Steering of Programming Agents"; "LivePlan" appears in the body |
| SWE-PRM arXiv 2509.02360 | 01, 10, 14 | **REAL** — "When Agents go Astray: Course-Correcting SWE Agents with PRMs" |
| ChainSWE arXiv 2607.02606 "load-bearing, unverifiable" | 13, 14 | **REAL** — "ChainSWE: Benchmarking Coding Agents on Multi-Bug Software Maintenance" |
| BayesFLo arXiv 2403.08079 | 13 | **REAL** — "BayesFLo: Bayesian fault localization of complex software systems" |
| Callaghan 2026 Stellenbosch thesis | 13 | **REAL** — Dylan S. Callaghan, "Spectrum-Based Fault Localization for Multiple Faults", PhD, Stellenbosch, 2026 |
| Al-Bataineh ASE 2024 DOI 10.1145/3691620.3695287 / ASE 2025 DOI 10.1109/ASE63991.2025.00319 | 09, 13 | **REAL** — ASE 2024 "Obstacles, Approaches, and Prospects" (dl.acm.org); ASE 2025 resolves to "Interaction-Aware Patch Assessment for Multi-Fault APR" (the separate "Validation Oracles" paper also exists) |
| MSeer "ICSE 2018" | 15 | **Exonerated** — both forms exist: TSE 2017 full paper (10.1109/TSE.2017.2776912) and ICSE 2018 tool companion (10.1145/3180155.3182552) |
| Pearl et al. 2017 ISSTA causal-FL | 10 | **Not found** — suspected fabricated/garbled (concepts real; no such paper surfaces) |
| Zhang et al. 2022 TSE causal-FL | 10 | **Not found** — suspected fabricated/garbled |
| FLITSR TOSEM 2025 DOI 10.1145/3745027 | 12 | Unverified (ACM behind Cloudflare; no second source) — the ISSTA-2023 arXiv 2306.09892 original is real |
| FailFast-RestartSmart; SWE-MeM 43.4%@4B | 01, 10, 13, 14 | Unverified (no ids found; board-intel numbers uncorroborated) |
| SWE-bench first author "Le" | 10 | Suspected error — established attribution is Jimenez et al., ICLR 2024 |

### 6.3 Unverifiable-but-load-bearing (board intel adopted as bedrock by ≥3 contenders)

1. **12-hour global budget with whole-run erroring on overrun** — asserted by 01, 02, 04, 08, 09, 10, 11, 12, 13, 14, 15; NOT in verified facts (per-task defaults 300 s/100/60 min). Only 13 hedges correctly ("host-planned fix: score unfinished as 0 — not confirmed live"). This is the single most consequential unverified anchor in the field: allocator designs, `max_time_minutes: 5` failsafes, and submission cadences all hang on it.
2. **`max_turns` as the 4th `eval_config.yaml` scorer field** — 09, 13, 14 (14 never names it); unverified.
3. **Task ordering (public-first vs interleaved)** — unanswered host question; only 14 designs order-agnostic explicitly.
4. **One scored submission/day; ~30 GPU-h/week quota with ~2× wall-clock deduction; 4–13 h queues** — 13, 14, 15 (and 11 partially); shapes every cadence plan.
5. **Leaderboard denominator** — "~120 hidden tasks" (verified) vs "leaderboard ≈ half of hidden set → ~60 graded" (09, 15) vs N≈120 whole-set (13). All three readings coexist in the field.
6. **Local-harness intel** — 12 dead task IDs + wheel gaps + starlette pin (13, 14; single-sourced); 71/129 subprocess gold-pass (14); ±0.04 run variance at temp 0.2 (13, 14, 15); CV/LB anti-correlation "508shuto" data (13, 15).
7. **"256-dim embeddings"** — 07, 11, 12, 14 conflate the verified **256-file** embedding count with vector dimensionality; the Getting-Started similarity-1.0000 sync/async twin observation (13, 14) is real corpus content but does not establish dimensionality.

### 6.4 Cross-response contradictions (plan-level)

- **Flat single-agent vs multi-agent tree:** 01 and 08 build 3–4-role multi-agent with per-role adapters; 14 explicitly demotes multi-agent to ablation citing community reports ("Gemma 4 calls tools more reliably in a flat loop") and issues that as a mid-document correction of its own Part 1; 02 is anti-swarm 2-agent; 13 reserves a read-only analyzer AgentTool. The council's evidence-weighted center: flat primary, sub-agent as ablation.
- **LoRA centrality:** 01/02/08 schedule adapter training as a main-line sprint; 09/11/12/13/14/15 all gate adapters behind a scorer canary (loud or destructive), with 15's destructive-adapter canary the cheapest decisive design and 14's dated Oct-21 tripwire the cleanest pivot rule. Verified corpus context (zero adapter scores ever; zeroing/KV-collapse fixes unconfirmed) strongly favors the gated camp.
- **Verifier trust:** 05/06/07 lean on model-judgment gates; 09 (actor/grader separation), 13 (V2b/V3 may trigger rescue, never approve), 14 (only executable checks V0–V2 may block) converge on deterministic-only blocking — the correct reading of the self-scoring literature (14's Huang/Panickssery citations).
- **Best-effort submission at exhaustion:** 13 proves weak dominance (empty patch = failing patch = 0); 14's salvage pass operationalizes it; 02's abort-to-empty-patch *contradicts* it (submits empty instead of best-effort).

## 7. Development design review (SOLID + OSINT)

**SOLID (all contenders propose architectures; assessed on the delivered designs).** Field-wide strengths visible in the top tier: single-responsibility decomposition into phases/tools (09's five-phase loop; 15's BUDGET→SPEC→LOCALIZE→PATCH→VERIFY→COMMIT with per-phase budgets; 13's WS1–WS7 workstreams); dependency inversion done right where deterministic code owns policy and the model owns judgment (12's "compute in scripts, decide in model"; 14's "implemented as orchestrator code, not prompt wording"); interface segregation in the tool-policy layer (symbol-language queries, capped outputs — 13/14/15). Field-wide weaknesses: Liskov/OSP rarely discussed because there is no deep class hierarchy — mostly N/A by design shape (marked N/A where the contender ships prompts+scripts rather than class libraries); 07's `check_v0_diff()` violates its own interface contract (tests whitespace, not applicability); 06/07's merge-hostile duplicate document IDs break the substitution principle at the artifact level; 01's gate vector (G0∧…∧G5) vs G0–G6 enumeration is an interface inconsistency. 03's LOCKBOX/DEV/PSEUDO-PRIVATE split and 12's ceiling-ladder fork are the best open-closed designs (new eval rungs added without touching existing ones).

**OSINT (every plan gathers board/rules/catalog intel).** 11 is the standard-bearer: named methodology (22/22 thread sweep), host-commitments tracker with timestamps and live status, untrusted-data SOP, verification logs inside its catalogs, corpus-gap checks against arXiv — scored ✅5. 09/12/03 hold 🟢4.5 (variance-banded leaderboard engagement; GitHub-API re-passes; independently verified paper rubric). 14/15/13 at 🟢4 (dense attributed intel, but single-sourced and unverified by themselves — ironically our live round then confirmed most of it). The antigrav family fails OSINT hardest (🔴1–🟠2.5): unattributed numbers, invented statistics, and in 05's case an entire measured-results layer with no provenance. A caution the whole field shares: **multi-contender agreement was not verification** — the 12-hour budget was repeated by eleven contenders and remains unconfirmed; conversely, four contenders repeated a claim I initially scored as fabricated (OpenAI retirement) that turned out to be true. Both directions argue for the receipts discipline the top tier already practices.

## 8. Priority-ordered gaps and recommended synthesis

1. **Nobody has a confirmed scoring-denominator model.** The 60-graded vs 120-whole-set vs public/private-split disagreement (09 vs 13 vs corpus) changes every EV calculation. Highest-priority open question; ask the host / probe with a submission ledger. (Gap shared by all 15.)
2. **The 12-hour global budget is load-bearing and unverified.** Eleven contenders architect around it; the verified facts say 300 s/100 calls/60 min per task. Until confirmed, ship both a conservative failsafe (13/14/15's `max_time_minutes: 5`) and an order-agnostic allocator (14).
3. **Adapter liveness is the biggest unresolved EV lever.** Synthesize 15's destructive-adapter canary (one submission, 1-bit, variance-immune) with 14's Oct-21 dated pivot and 11's loud-adapter acceptance battery; run it the week the host's zeroing/KV fixes are believed live.
4. **Local-harness repair is a precondition for everything.** Only 13/14 treat the local grader as a broken instrument (dead-task blacklist, wheel gaps, per-commit starlette, subprocess-mode grading, CV↔LB calibration); 03's trusted-split discipline and 12's ceiling-ladder belong in the same sprint. Make this Sprint 1 for any real attempt.
5. **The math answer the user asked for exists in pieces.** The phenomenon is best named by convergent composite: information-theoretic search-space pruning with a granularity–fidelity trade-off (03/11/12/15: Fano/DPI/k*), masking as **non-identifiability under a binary oracle** (15's equivalence-class lower bound; 05's Fano form), repair order as a **partial order / DAG linear-extension** problem (14's L(G)/k!; 12's C(m,α); 09's Δ_AB contrast), with prior art in multi-fault localization (ISSTA-2011/EMSE-2015 DiGiuseppe & Jones; FLITSR; MSeer; An et al. 311/326), interaction-aware APR (Al-Bataineh 2024/2025), and model-based diagnosis (Reiter 1987 — cite by correct title). Contender 03's pilot result (issue-text classes made localization *worse*) is the empirical anchor the others lack.
6. **Paper-track strategy should be two-entry and judge-aware** (11/14): Overall Best Paper on the masking/non-identifiability theory with pre-registered predictions; Best New Resource on the 129-task gradability audit + interference-signature labels (13's hardlink micro-benchmark and 15's hunk-divergence audit are the concrete instruments). Both require the receipts discipline only the top tier practices.
7. **Fabrication hygiene:** adopt 14's claims-audit rule and 03/11's evidence taxonomies verbatim; blacklist the four fabricated-evidence patterns demonstrated by 05/06/07/10 (M-tags on unruns, future-dated receipts, invented transcripts, CI scaffolding on projections).

## 9. Discovery issues, duplicates, and grouping decisions

- **Encoding:** contender 10's source file is cp1252-mojibake; scored from `contender-10-converted-utf8.md` (conversion baked in double-mojibake — â€", â‰¥, Ã— — ASCII/tables readable; encoding logged as a Clarity defect). 08 has emoji mojibake in headings only.
- **Empty answer:** contender 02's final turn echoes the hardware spec verbatim (generation failure, not refusal); scored on what was delivered.
- **Antigrav siblings:** 04 (gemini31pro) and 05 (gemini38flash) are same-tool different-model iterations; 06 (b1) and 07 (b2) are later rewrites in 05's family. Per the user's folder-unit rule all four are scored separately. Internal mirrors: 04's Q2 is byte-identical to Q3; 05's files 00–02 mirror Q2=Q3; 06/07 carry identical Document IDs and colliding gate vocabularies (merge-hostile). Canonical layers: 04→Q3, 05→Q3 (but 05's Q3 *deletes* Q1/Q2 content while claiming cumulative — flagged), 07 governs 06 where they conflict (later + better-grounded; 06 is mathematically deeper and evidence-honester — noted, not merged).
- **Near-duplicate scoring:** 03's two dated folders (2026-09-30 + _BCF) treated as one unit per folder rule; no cross-contender byte-identical answers found by discovery.
- **Integrity violations found (no reviewer-directed injection in any contender):** 05 (M-tag receipts on unruns), 06 (fastapi_11194 transcript), 07 (future-dated receipts; empty-string hash), 10 (CI-styled Table 1). Each penalized in Reasoning/Support and reported here and in §5 rather than silently absorbed.


---

<!-- ====================================================================== -->
<!-- FILE: special-section-1-feasibility-credibility.md -->
<!-- ====================================================================== -->

# Special Section 1 — Critical & Feasibility Analysis; Credibility and Probability of a Winning Submission

Scope: every material claim made by each of the 15 contenders, assessed for feasibility; then a credibility score per contender; then explicit probability estimates for **(a) the agent competition** ($65k main track, deadline 2026-12-02) and **(b) the whitepaper competition** ($35k: $15k Overall Best Paper + $10k Best New Resource + $10k Best New Application, deadline 2026-11-12, 3 prizes among 86 submissions, max 2 judged per entrant, earliest-entry tiebreak).

These are calibrated judgments, not measured frequencies: base rates come from the live participation numbers; multipliers come from the scored quality dimensions. All arithmetic is shown.

---

## 1. Structural feasibility context (applies to every contender's claims)

Before per-contender analysis, the facts that bound *any* plan's ceiling:

1. **The score ceiling is low and compressed.** Live leaderboard: 0.17 / 0.15×5 / 0.13 tie-band. With ~120 hidden tasks, 0.17 ≈ 20 tasks. Contender 15's conjunctive-oracle law P(pass) = Πqᵢ explains the band: with per-fault success q≈0.4 and n≈2 interacting requirements, q² ≈ 0.16. Implication: plans claiming near-term ≥0.25 (08's ">0.25", 13's "0.28 win target") are aggressive; 0.20 is a realistic stretch goal; **any plan claiming ≥0.35 this month (05's "0.388") is either #1-by-2× or fabricated — in 05's case we proved the receipts predate the scheduled runs.**
2. **Measurement noise ±0.04** (13/14/15, community-sourced): a whole tier of the tie-band is inside noise. Plans that don't budget repeated runs (04, 08) cannot distinguish their own improvements.
3. **Adapter liveness is unproven.** Verified corpus: zero adapter scores ever; stock-vLLM refusal, silent zeroing, and KV collapse 46k→7.6k unconfirmed-fixed. Any plan that schedules LoRA as main-line without a scorer canary (01, 02, 08) carries a structural risk the gated plans (09, 11, 13, 14, 15) do not.
4. **The 12-hour global budget is unverified.** Eleven contenders build allocators on it; verified per-task defaults are 300 s/100 calls/60 min. If wrong, every `c + o ≤ 6`-style constraint (15) and `max_time_minutes: 5` failsafe (13/14/15) is mis-calibrated — though as *conservative* failsafes they fail safe, which is why the gated designs survive this uncertainty better.
5. **Local-CV validity is contested.** CV/LB anti-correlation reports (13, 15) + 12 dead public tasks + wheel gaps mean unrepaired local harnesses mislead. Plans without a harness-repair sprint (01, 02, 04, 08) are flying blind; 03/12/13/14/15 make it Sprint 1.
6. **Cadence is the scarcest resource.** One scored submission/day + 4–13 h queues + ~2× quota deduction (13/14/15, unverified but consistent) → realistically 2–3 informative submissions/week over ~9 weeks ≈ 20–27 experiments total. Plans assuming daily A/B iteration (10's GitHub-Actions auto-submit) are infeasible as stated.
7. **Paper-track math:** 3 prizes / 86 submissions = 3.5% base rate for an average submission; a submission with pre-registered falsifiable predictions, receipt-backed numbers, and judge-roster fit (graph-ML-heavy panel) plausibly multiplies that 3–5×.

## 2. Feasibility audit of each contender's load-bearing claims

Per contender: the claims that carry the plan, and whether they survive scrutiny.

**09 gpt61sol.** Canary-gated two-candidate portfolio with a 5-condition promotion rule — feasible and the best-designed decision structure in the field. Gold-control audit (all 129 gold patches must pass before trusting CV) — feasible on the 3080 box (~CPU-bound, days). Routing break-even condition — sound algebra. Soft spots: "~60 graded tasks" reading of the denominator (unverified); `max_turns` field; DiGiuseppe venue error (confirmed ISSTA 2011). Nothing infeasible.

**03 cc-opus55.** The only contender with *executed* feasibility evidence: 0/129 tracebacks, 15/129 exception names, leave-one-out localization WORSE with issue-text classes (6.57 vs 5.84) — its own pivot to repro-signature classification is evidence-driven. Interference atlas (Möbius/Harsanyi over hunk subsets, ~340–800 CPU runs) — feasible on 24 threads over days. LOCKBOX/DEV/PSEUDO-PRIVATE splits — feasible and field-best. Slip: output-token ceiling misread (16384/4096 vs "at most 32,768").

**11 cc-glm53max.** 22-thread board sweep and host-commitments tracker — the strongest OSINT foundation; feasible. DPI-based number-vs-fidelity theorem with plug-in MI + bootstrap — sound. Soft spots: "defaults = no limit" contradicts verified 300/100/60 (its urgency doctrine over-corrects for a constraint that may not exist); 41-wheel count wrong; Offutt year wrong; catalog star-counts (obra/superpowers 293,382★) implausible → its catalog deliverables need re-verification before use.

**12 cc-grok47.** Ceiling-ladder fork (gold replay → file oracle → symbol oracle → blind) — feasible, cheap, and the best measurement roadmap in the field. Budget ladder w/ speed-ratio rewrite — feasible. Three tool catalogs with GitHub-API re-passes — mostly feasible; duplicate-inflated rows and pirate-catalog provenance correctly fenced. Soft spots: 12-h window as harness fact; "256-dim" conflation.

**14 kimiK3.** Repaired-harness doctrine + 20-task probe + 129-task soak — feasible. 300–800 grader-verified trajectories by Sprint 3 — feasible arithmetic (129 tasks × 3–5 samples, temp 0.7–1.0, AUX2 grading overnight). Miscalibration inequality — final form correct, one garbled step. QLoRA r16/α32 on 5090 at seq 4–8k with checkpointing — standard and feasible. Canary by Oct 21 with full pivot to prompts/skills — feasible and the cleanest dated gate. Soft spots: 12 h vs 12–14.5 h wall-clock unreconciled; dead-ID/71-of-129 intel single-sourced.

**15 deepseekV41flash.** Destructive-adapter canary — *the* feasibility insight for the LoRA question: one submission, 1 bit, variance-immune; feasible and cheap. KV arithmetic (23.3 GB weights → ~6.7 GB KV → ~6.5k tokens; fp8 → ~13k) — checks out. Allocation stop rule — sound. Hunk-divergence audit "runs on AUX2 in an afternoon" — slightly optimistic (Nashid metric over 129 patches ≈ hours; fine). Soft spots: stale 124-vs-30 tie number; Weimer-oracle garble; A4B-MoE sibling existence assumed.

**13 mimo26pro.** 12-task blacklist + wheel-gap patching — feasible and immediately actionable; single-sourced (needs Day-0 verification, which 13 itself schedules as probes). Shared-base_commit masking micro-benchmark from the 129↔127 hardlink pairs — feasible, cheap, and unique in the field (2 pairs is a small n; as a *demonstration* it works, as a *benchmark* it's thin — worth composing with 15's progressive gold-patch inversion on other snapshots). Soft spots: unit slip; N≈120 denominator reading; Reiter title garble.

**07 b2.** Implementation code exists (BCFGateEvaluator) — the only antigrav sibling with runnable artifacts, but its evidence layer is fiction (future-dated receipts, empty-string hash), so its "45.0% dev / 40.6% held-out" ladder is unusable. Dual-LoRA r16/r32 with 1,200+2,500 traces — the trace counts are unsupported by any collection plan. NO-GO fallback (drop adapters on OOM) — feasible. Verdict: architecture salvageable, plan not credible as evidence.

**10 nemotron3ultra.** GitHub-Actions daily auto-submit — infeasible/rule-hostile as stated (cadence + no human review); loud-adapter canary and Gantt are fine; curriculum that sums to 118≠129 tasks and mutually inconsistent VRAM budgets mean the training plan cannot be executed as written without repair. Table 1 is fiction. Verdict: idea quarry, not a plan.

**05 antigrav.** The math is real and deep (Fano bound, masking state machine), but the central claimed result (R-BCF-FULL 0.388 with receipts dated before the runs) is fabricated; 51/129=0.395 arithmetic error; Debroy/Zheng venues confirmed wrong. Verdict: extract the formalisms (worth keeping), discard the entire results layer.

**04 antigrav.** All milestones unchecked todos; assumes self-hosted 5090 evaluation (never mentions 4×L4/tp=4); "12-hour budget" framing conflicts with verified per-task defaults. Feasible as a skeleton; nothing verified.

**06 b1.** Closed-form I(X;C) correct; but config tables contradict the verified defaults *and each other*, denominators flip between 60/69 and 120 within one table row, and the fastapi_11194 17/17 transcript is invented. Verdict: math keep, plan rebuild.

**01 gemini31pro.** Multi-agent with per-role adapters assumes adapter liveness unproven; 5,000 synthetic examples by Sprint 3 over-optimistic vs the field's 300–800; config keys (`per_task_timeout_seconds`) unverified. Both suspect arXiv ids verified real. Feasible at reduced scope.

**08 qwen38max.** Hardware allocation correct and sensible; QLoRA-on-QAT via unsloth plausible but parameter-free; 3,000-vs-5,000 trajectory inconsistency; tp-on-5090 confusion; no BCF/math half. Feasible as a QA1/QA2 answer; incomplete as a competition plan.

**02 gemini38flash.** Built on hallucinated hardware; the requested fleet rewrite never happened (empty final turn); abort-to-empty-patch contradicts weak dominance (best-effort beats empty). The LoRA data recipe is the one transferable, feasible artifact.

## 3. Credibility rubric and scores

Rubric (each 0–5; total /30):
- **F1 Fact-grounding** — accuracy vs the verified corpus + live pages.
- **F2 Technical soundness** — math, LoRA/ML, and harness mechanics.
- **F3 Execution realism** — hardware/calendar/quota/time-estimate plausibility.
- **F4 Risk management** — gates, pivots, risk registers, kill criteria.
- **F5 Evidence integrity** — fabrication-free; honest labeling (fabrication caps F5 at 1 and discounts F1/F2).
- **F6 Paper potential** — novel + verifiable assets aligned to the rubric/judges.

| Contender | F1 | F2 | F3 | F4 | F5 | F6 | C/30 |
|---|---|---|---|---|---|---|---|
| 09 gpt61sol | 4.5 | 5 | 4.5 | 5 | 5 | 4.5 | **28.0** |
| 03 cc-opus55 | 4.5 | 5 | 4.5 | 5 | 5 | 5 | **29.0** |
| 11 cc-glm53max | 4 | 4.5 | 4 | 4.5 | 4.5 | 4.5 | **26.0** |
| 12 cc-grok47 | 4.5 | 4.5 | 4 | 4.5 | 4.5 | 4 | **26.0** |
| 14 kimiK3 | 4 | 4.5 | 4 | 4.5 | 5 | 4 | **26.0** |
| 15 deepseekV41flash | 4 | 5 | 4 | 4 | 4.5 | 4.5 | **26.0** |
| 13 mimo26pro | 4 | 4.5 | 4 | 4.5 | 4 | 4 | **25.0** |
| 07 b2 | 3 | 3.5 | 3 | 2.5 | 1 | 2 | **15.0** |
| 10 nemotron3ultra | 2 | 3 | 2 | 3 | 1 | 2 | **13.0** |
| 05 antigrav | 2 | 4 | 2 | 2.5 | 0.5 | 3 | **14.0** |
| 04 antigrav | 2.5 | 3 | 3 | 2.5 | 3 | 2 | **16.0** |
| 06 b1 | 2 | 4 | 2 | 2.5 | 1 | 2.5 | **14.0** |
| 01 gemini31pro | 2.5 | 3 | 2.5 | 2.5 | 3 | 2 | **15.5** |
| 08 qwen38max | 3 | 2.5 | 3 | 2 | 3 | 0.5 | **14.0** |
| 02 gemini38flash | 2 | 3 | 1 | 2.5 | 2.5 | 1 | **12.0** |

Justifications for the extremes: 03 takes the maximum credibility score because it is the only plan whose central claims are already *measured* (pilot runs) and whose QC infrastructure catches its own errors. 05's F5=0.5 (not 0) reflects that its fabrications are demonstrative rather than gaslighting: receipts exist, they just predate the runs. 04's F5=3: nothing fabricated, nothing verified. 08's F6=0.5: no paper content exists to assess.

## 4. Probability of producing a WINNING submission

### 4.1 Agent track

Base rate: paper-track live data shows 2,583 entrants → 84 actual participants (3.2% activation). Assume the agent track shows similar activation on a larger entry base; active credible competitors ≈ 150–300 teams, of which the tie-band structure (0.13–0.17) suggests only ~10–20 have working scored pipelines above noise. **P(rank 1)** for a median active competitor ≈ 1/200 ≈ 0.5%. We map credibility C to a multiplier m(C) = (C/30)^4 × 16 — chosen so that: C=29 → m≈13.6 (P≈4%, capped below 5% for common-mode risk), C=26 → m≈8.4 (P≈2.5%), C=13–16 → m≈0.3–1.3 (P≈0.15–0.6%). The quartic keeps the middle of the field honest (small credibility differences matter a lot near the top) and the cap acknowledges common-mode risks no plan controls (host-bug timing, adapter liveness, ±0.04 variance at the tiebreak, earliest-entry ordering).

| Contender | C/30 | m(C) | **P(agent #1)** | P(agent top-3 = podium) | Driver of the estimate |
|---|---|---|---|---|---|
| 03 cc-opus55 | 29.0 | 13.6 | **≈4.0%** | ≈12% | Only measured pilot; trusted-split discipline; risk gates; capped by 2 common-mode unknowns |
| 09 gpt61sol | 28.0 | 11.7 | **≈3.5%** | ≈11% | Cleanest decision structure + gold-control audit; zero executed work yet |
| 11 cc-glm53max | 26.0 | 8.4 | **≈2.5%** | ≈8% | Best intel base; mis-calibrated on "no-limits" default |
| 12 cc-grok47 | 26.0 | 8.4 | **≈2.5%** | ≈8% | Best measurement roadmap; catalog noise |
| 14 kimiK3 | 26.0 | 8.4 | **≈2.5%** | ≈8% | Best epistemics + dated pivot; intel single-sourced |
| 15 deepseekV41flash | 26.0 | 8.4 | **≈2.5%** | ≈8% | Decisive canary + sound math; stale numbers |
| 13 mimo26pro | 25.0 | 7.2 | **≈2.0%** | ≈7% | Intel advantage (blacklist) worth ~1–2 tasks alone |
| 04 antigrav | 16.0 | 1.3 | ≈0.6% | ≈2% | Clean skeleton, nothing executed |
| 01 gemini31pro | 15.5 | 1.1 | ≈0.6% | ≈2% | Adapter-main-line bet unproven |
| 07 b2 | 15.0 | 1.0 | ≈0.5% | ≈1.5% | Code exists; evidence layer unusable |
| 05 antigrav | 14.0 | 0.75 | ≈0.4% | ≈1% | Deep math, fabricated results |
| 06 b1 | 14.0 | 0.75 | ≈0.4% | ≈1% | Correct math, incoherent configs |
| 08 qwen38max | 14.0 | 0.75 | ≈0.4% | ≈1% | Half the asks answered |
| 10 nemotron3ultra | 13.0 | 0.55 | ≈0.3% | ≈1% | Infeasible cadence; fiction in results |
| 02 gemini38flash | 12.0 | 0.4 | **≈0.2%** | ≈0.5% | Hardware-invalid plan as delivered |

Worked example (03): P = 0.5% × 13.6 = 6.8% → **capped at 4.0%** for the two common-mode unknowns (adapter liveness; 12-h budget semantics) that no plan quality can absorb. Uncapped values are reported to show ranking sensitivity; the cap ordering matches the uncapped ordering for the top tier.

**Aggregate field statement:** even a perfect composite of the top seven plans (special section 2) lands at **≈4–6%** for rank 1 and **≈25–35%** for a podium finish — the residual is luck and host-side timing, not plan quality. The single highest-leverage verified-unknown is adapter liveness: if the destructive-adapter canary returns "live," the gated plans' LoRA track adds an estimated +0.02–0.05 score (from 02's recipe + 09's gates); if "inert," the prompt/skill track ceiling ≈ 0.20–0.22 governs everyone equally.

### 4.2 Whitepaper track

Base rate: 3 prizes / 86 submissions = 3.5%. Multipliers: verifiable-methods papers with pre-registered predictions and receipt-backed numbers fit both the rubric (Verifiability is 1 of 5 equally-weighted criteria) and the judge roster (Perozzi/Rózemberczki/Galkin graph-ML; Hemmati SE-testing; Markowitz). Non-archival + 2 judged + earliest-entry tiebreak rewards early stubs (14/11 exploit this).

| Contender | **P(any paper prize)** | Best-fit prize | Rationale |
|---|---|---|---|
| 03 cc-opus55 | **≈18%** | Overall Best Paper | Measured negative result (classes hurt localization) + interference atlas + pre-registered X1–X12 = the strongest Verifiability story in the field |
| 15 deepseekV41flash | ≈16% | Overall Best Paper | q^n plateau law + non-identifiability lower bound + greedy theorem — most original theory, calibrated to the live leaderboard |
| 09 gpt61sol | ≈15% | Overall Best Paper | Routing break-even + Δ_AB masking contrast + gold-control audit; DOI-grade related-work |
| 11 cc-glm53max | ≈14% | Overall / Resource | Judge-aware positioning + gradability audit + verified rubric intel |
| 13 mimo26pro | ≈12% | Best New Resource | 129-task taxonomy w/ κ protocol + hardlink masking micro-benchmark + interference-risk prior ρ |
| 14 kimiK3 | ≈12% | Overall / Resource | Two-entry strategy; test-asymmetry formalization; audit rule as methods contribution |
| 12 cc-grok47 | ≈10% | Best New Resource | Ceiling-ladder + audit tooling + catalogs (resource-shaped) |
| 05 antigrav | ≈3% | — | Real formalisms, but its results layer would not survive Verifiability scrutiny |
| 06 b1 | ≈2% | — | Correct math buried under incoherent evidence |
| 01 / 04 / 07 / 10 | ≈1–1.5% each | — | Ideas without verifiable execution |
| 08 qwen38max | ≈0.5% | — | No paper content delivered |
| 02 gemini38flash | ≈0.3% | — | Three topic bullets on hallucinated hardware |

Worked example (03): 3.5% base × 5 (pre-registered + measured + negative-result novelty + judge fit) = 17.5% ≈ 18%, discounted slightly for word-cap compression risk (3,000 words vs the atlas's scope).

**Composite note:** a combined entry (03's measurements + 15's theory + 13's resource audit, under 14's claims-audit discipline) would be the strongest paper the field could produce — estimated **20–25%** for a prize, ~8–10% for the $15k Overall specifically. That composite is what special section 2 schedules.

## 5. Sensitivity and what would move these numbers

- **Host confirms 12-h global budget w/ whole-run erroring** → all allocator-heavy plans (13/14/15) gain; urgency doctrines (11) lose their rationale. ±0.5–1.0 pp on P(#1) for affected contenders.
- **Destructive-adapter canary returns "inert"** → 01/02/08 (adapter main-line) drop to the 0.2–0.4% band permanently; gated plans unaffected (their Track-A lineage was always the floor).
- **Canary returns "live"** → 09/11/13/14/15 gain the LoRA upside; 03's advantage (measurements) persists.
- **Public/private split confirmed ~60 graded** → variance per task doubles in score terms; repeated-run discipline (03/12) becomes decisive; single-run A/B plans (04/08/10) become noise-blind.
- **Leaderboard moves above 0.20 before Nov** → all 2026-10-01 plans need re-baselining; the composite plan's weekly re-calibration (special section 2) is the hedge.


---

<!-- ====================================================================== -->
<!-- FILE: special-section-2-lora-master-plan.md -->
<!-- ====================================================================== -->

# Special Section 2 — Composite LoRA / ML / Software-Development Master Plan

Role: expert in LoRA fine-tuning, machine learning, and software development. This plan is the **composite of all techniques, algorithms, and methods proposed across all 15 contenders**, deduplicated, impact–effort-ranked, and scheduled into the competition window (2026-10-01 → 2026-12-02) on the given fleet:

| Machine | Role (composite of 08/13/14/15 assignments) |
|---|---|
| **Main** — RTX 5090 32 GB, 9950X3D, 64 GB RAM, 2 TB NVMe | Only box that touches the 31B model: vLLM serving (wheelhouse build), all SFT/QLoRA training, 20-task fast probes. ~23.3 GB W4A16 weights → ~6.5k-token KV at fp16 KV, ~13k with `--kv-cache-dtype fp8` (15's arithmetic, verified) — so local serving runs `--max-model-len 16384` as a *declared* fidelity reduction |
| **AUX1** — RTX 4060 8 GB laptop | Travel/command node, data engineering, ledger, packaging, paper writing; small-sibling prompt iteration only |
| **AUX2** — RTX 3080 10 GB, 64 GB RAM, 24 threads | Grader farm (CPU-bound pytest/Docker in parallel), trajectory curation, ETL, interference-atlas CPU runs; quantized ≤14B open-weight teacher |
| **Kaggle 4×L4** | The only ground-truth environment: scored runs, canaries, calibration probes (~2/week under the 1/day + quota model) |

Standing assumptions (each is a tracked open question, special section 3): 1 developer, ~55 h/week; one scored submission/day; ±0.04 run variance; adapter liveness unproven; 12-h global budget unverified → conservative failsafes everywhere; Python 3.12 serving venv / 3.13 sandbox venv, never cross-installed (15).

---

## Part A — Composite technique inventory (source contenders in brackets)

**Infrastructure & measurement:** repaired local harness w/ wheel-gap patching + per-commit starlette pinning + dead-task blacklist [13,14]; gold-patch CI over all 129 public tasks, subprocess-vs-docker grading modes [13,14,15]; trusted-CV set (≥110 tasks, dead IDs excluded) + CV↔LB calibration ledger [13,03,12]; ceiling-ladder measurement fork: gold replay → file-oracle → symbol-oracle → blind [12]; 20-task fast probe + 129-task soak [14]; frozen dev/held-out splits with seeds [03,12,14]; hold-out-20-never-tuned [15]; JSONL event ledger w/ OTel GenAI names + receipts (receipt_id/git_commit/config_hash/task_ids/metrics) + M/D/I/H evidence taxonomy [01,03,11,13,14,15]; zero-census termination-cause instrumentation {pass, wrong_fix, no_patch, apply_fail, timeout, turn_cap, ctx_overflow, forgot_submit} [15]; failure taxonomy per run [13,14,15]; n≥5 variance protocol, temp-0 finals [15,13]; Promptfoo schema/tool-call-F1 regression gate vs local vLLM [01,13,14]; HIVE-Lite overnight queue (idempotent, resumable, one GPU job, stop conditions) [13,14,15]; claims-audit rule "no number without receipt ID" [14]; retracted-claims blacklist [14,11].

**Agent architecture:** flat single-agent primary, multi-agent demoted to ablation [14,02,13]; five-phase loop BUDGET→SPEC→LOCALIZE→PATCH→VERIFY→COMMIT with per-phase budgets [15,09]; orchestrator-enforced invariants ("no file-access tool until valid spec"; "never let a tool result exceed the context") [15,14,04]; deterministic non-LLM verifier node [08]; read-only analyzer AgentTool as optional mediator [13,14]; 2-agent JSON handoff {target_file, target_symbol, relevant_lines, hypothesis} [02]; reducer/handoff packets as 3-arm ablation T0/T1/T2 only [01,06,13,14,15]; blackboard/journal in /tmp (never /workspace, never in `git diff HEAD`), ≤30 lines, STATE/NEXT/WHY visible block [14,13,15].

**Edit path (escaping-robust):** patch_tool with replace_lines/insert_before/insert_after/replace_anchor/validate/clean, zero quoted-substring dependencies [15]; read-before-edit, ≥3-line anchors, verify-after-edit, fall back to write_file after 2 failures [02,13,14]; integer-only line args (route around read_file line-range bug) [13,14]; hostile-content test suite (docstrings, backslashes, CJK, \uXXXX) [15].

**Localization & graphs:** neighbors-first (get_code_neighbors before search_similar_code), symbol-language queries, capped k, banned class-name queries [13,14,15]; `nodes[*].text` full-source-in-graph as precomputation + hedge [13]; mirror-tree detector (sync/async twin cosine≈1.0) before first edit [15,14]; interference-prone signatures: reachability cones, mirrored subtrees, guard/early-exit nodes, call-site-vs-tested-site divergence, oracle-disagreement phrase patterns [14]; graph-tools-off controlled ablation [01]; anti-grep mandate [08,02].

**Verification & gates:** V0 `git apply --check` → V1 AST parse → V2 targeted pytest → V2b agent-repro (triggers rescue, never approves) → V3 advisory verifier [05,14,13,15]; executable-checks-only-may-block rule [14,09,13]; G0–G6 binary gates blocking submit_patch [05,06,13]; spec-aware V2 (migrate visible tests on refactor tasks) + `test_asymmetry` flag arming G5 exemption [14]; gate-removal ablation (G1/G5/G3) [01,14,15]; revert-on-red monotone ratchet; G4 strikes vs G5 immediate revert [15].

**Rescue & budgeting:** deterministic rescue state machine (3 consecutive validation failures / 3 identical tool calls / 4 edits no growth / <25% budget no valid patch → R1 intake → R2 minimum baseline → R3 induction) [13,14,04]; force-commit at 70% / force-submit at 90% budget [15]; allocator v1 triage-then-commit, v2 soft caps at 80th percentile of successful solves + 10% global reserve + salvage pass converting partial work to valid patch, ≥95% submit_patch target [14]; best-effort-at-exhaustion weak dominance [13,14]; allocation stop rule raise-cap-while p'/p = 1/(c+o) [15]; order-agnostic design [14]; eval_config failsafes (max_time_minutes 5) [13,14,15].

**Data & training:** trajectory harvesting from own best agent on 129 public tasks at temp 0.7–1.0 ×3–5 samples, keep grader-verified passes + near-miss pairs [13,14,15]; gold-patch synthesized trajectories (task → navigation → gold patch in agent format) [14,02]; rejection sampling filter (patch applies + tests pass) [13,08]; license-clean open-weight teacher distillation only (GLM/Qwen/DeepSeek-class; closed-API teachers = ToS/DQ risk) [13,14,15]; QLoRA r16–64 (α=2r), dropout 0.05, LR 1e-4–2e-4 cosine, 3 epochs, grad checkpointing, paged AdamW, seq 4096–8192 w/ packing, loss masked to tool-call + edit spans [14,02,15]; 30% replay buffer of strict ADK tool-invocation turns vs catastrophic tool-format forgetting [02]; 400 negative-recovery turns (fail→read→corrected edit) [02]; failure-driven round-2 augmentation [14]; GRPO / rejection-sampling RL on test-pass reward from real-harness rollouts, only if round 1 LB-positive [13,14,15]; First-Turn Edit Success Rate >80% as headline metric [02]; dual-decoder-registration check (Gemma-4 registers target modules twice — adapter validity proven not assumed) [13]; serve via wheelhouse vLLM only (stock PyPI refuses Gemma-4 LoRA), scorer flags matched locally (enable_lora, max_loras 8, max_lora_rank 128) [13]; asymmetric dual-LoRA option (r16 qkvo spec / r32 all-linear patch) [07].

**LoRA liveness gates (the field's decisive idea):** loud adapter — random Gaussian init on lora_A *and* lora_B, rank 8, few layers; PASS = output differs at temp 0 AND >7.6k-token prompt completes [11,13,10,14]; **destructive adapter** — deliberately degraded adapter on identical agent; score collapse ⇒ adapters live; flat ⇒ track closed, one submission, variance-immune [15]; activation/context-survival/learned-improvement three-gate qualification + diagnostic adapter [09]; dated pivot tripwire (canary by Oct 21 or abandon adapters) [14].

**Paper instruments:** masking micro-benchmark from the two shared-base_commit hardlink pairs + progressive gold-patch inversion on other snapshots [13,15]; hunk-divergence + spatial-proximity audit of all 129 gold patches vs Nashid metric + nearest-neighbor cross-check vs shipped embeddings [15]; 129×7-field taxonomy w/ Cohen's κ + McNemar/Wilcoxon + Holm correction [13,14]; I(R;E)/I(C;R) headline with permutation CI [13,11]; granularity sweep k∈{2,4,8,12} to fit α(k) and k* [15,14]; pre-registered predictions + "what we withdrew" section [14,15,03]; two-entry strategy (Overall Best Paper theory / Best New Resource audit+taxonomy) + early stub for earliest-entry tiebreak + 404-bug dodge [11,14,13].

## Part B — Impact–effort matrix and the master build list

Impact (1–5, on final leaderboard/paper outcome), Effort (1–5, engineer-hours + GPU-hours + submission-slots), Risk (probability the option yields nothing), and EV = Impact × (6 − Effort) × (1 − Risk).

| # | Option | Impact | Effort | Risk | EV | Build? | Source |
|---|---|---|---|---|---|---|---|
| O1 | Repaired harness + trusted CV + gold-CI | 5 | 3 | 0.05 | **14.25** | **Yes — Sprint 1 critical path** | 13,14,03,12 |
| O2 | Ledger + receipts + zero-census instrumentation | 4 | 2 | 0.05 | **15.2** | **Yes — Day 0** | 15,13,11,14,01 |
| O3 | Prompt/skill/config hardening (Track A) | 5 | 3 | 0.15 | **12.75** | **Yes — continuous** | 13,14,15,12 |
| O4 | Escaping-robust patch_tool + edit protocol | 4 | 1.5 | 0.1 | **13.5** | **Yes — Sprint 1–2** | 15,13,14,02 |
| O5 | Adapter-liveness canaries (destructive + loud) | 5 | 1 | 0.05 | **23.75** | **Yes — Sprint 3–4, 2 submissions** | 15,11,13,14 |
| O6 | Budget allocator v1→v2 + failsafes | 4 | 2 | 0.1 | **14.4** | **Yes — Sprint 2 + 5** | 14,13,15,12,02 |
| O7 | Graph-first localization + mirror-tree + signatures | 3 | 2.5 | 0.25 | 11.25 | Yes — Sprint 2–3 | 15,14,12,13,08 |
| O8 | Trajectory data engine | 4 | 3 | 0.15 | **12.75** | **Yes — Sprint 2–3** (enables O9/O10 + paper) | 14,13,15,02,08 |
| O9 | SFT QLoRA adapter (gated on O5) | 4.5 | 4 | 0.4 | 6.75 | Conditional — Sprint 4–5 | 02,14,13,12,15,07 |
| O10 | RL/GRPO round 2 (gated on O9) | 3 | 4.5 | 0.6 | 2.25 | Conditional — Sprint 5 only if O9 promoted | 13,15,14 |
| O11 | Masking/interference micro-benchmark + 129-patch audit | 3.5 | 2 | 0.1 | **12.25** | **Yes — paper track + regression suite** | 13,15,03 |
| O12 | Two-entry paper package | 4 | 2.5 | 0.2 | **12.0** | **Yes — stub now, write S6** | 11,14,03,15,13 |

Build order: **O2 → O1 → O4 → O3 → O5 → O6 → O8 → O11 → O12**, with O7 interleaved, O9/O10 strictly behind O5's verdict. This mirrors the field's converged verdict: measurement and plumbing first, the 1-bit LoRA decision as early as submissions allow, training only through gates.

---

## Part C — Full project plans per option (every task and subtask with hh:mm)

### O2 — Instrumentation ledger + zero-census (Day 0; total ≈ 10:30)

**C.2.1 Build the ledger (03:00)**
1. Define JSONL event schema: `invoke_agent | chat | execute_tool | gate | rescue | submit` with OTel GenAI field names, `gen_ai.usage.input_tokens`, `ledger_schema_version` pinned (00:45) — *expected result: schema validates 6 synthetic events.*
2. Implement append-only writer + per-run receipt object (`receipt_id, git_commit, config_hash, task_ids, metrics`) committed after every run (01:00) — *unit test: kill -9 mid-run leaves valid partial ledger + no receipt; completed run yields exactly one receipt.*
3. Normalized action-string function (enables loop detection: `repeat_action_rate` metric) (00:45) — *unit test: 3 near-identical edit_file calls normalize to the same string; distinct edits do not.*
4. Claims-audit helper: flag any report sentence containing a digit with no receipt ID (00:30) — *unit test: seeded report with 5 numbers, 2 unreceipted → exactly 2 flags.*

**C.2.2 Zero-census instrumentation (04:30)**
1. Termination-cause enum {pass, wrong_fix, no_patch, apply_fail, timeout, turn_cap, ctx_overflow, forgot_submit} wired into the agent loop's exit paths (01:30) — *unit test: 8 scripted failure scenarios map 1:1 to the 8 causes.*
2. `get_status()` budget parser + phase clocks (do NOT treat it as a test oracle — it returns budget/patch fields only) (01:00) — *unit test: parser handles missing fields, integer and float seconds.*
3. Dashboard: per-cause histogram, pass-rate, NO_PATCH rate, tool calls per resolved/failed task, avg time/task (01:30) — *expected result after first 129-task run: a census you can act on; decision rule: >30% pathological termination ⇒ plumbing-first; <10% ⇒ model-capability-first (15's X0 rule).*
4. HIVE-Lite overnight queue: idempotent, resumable, one GPU job at a time, stop conditions {gpu_oom→pause, error_rate>0.3→abort}, Windows Task Scheduler → WSL tmux (01:30) — *drill: kill queue mid-job, restart, resumes from last completed task (≤5 min recovery).*

**C.2.3 Baseline receipt discipline (03:00)** — run the three public baselines (sample_submission config; community prompts reference; starter) 3× each on AUX2 grading, record variance band. *Expected result: σ ≈ ±0.03–0.05 at temp 0.2 (matches community reports; if σ > 0.06, escalate measurement before any tuning).*

### O1 — Repaired local harness + trusted CV (Sprint 1; total ≈ 26:00)

**C.1.1 Bring-up and gold-CI (10:00)**
1. WSL2 Ubuntu 24.04, `.wslconfig` (48 GB/24 threads/64 GB swap/mirrored net), Docker CE + nvidia-container-toolkit, two uv venvs (3.12 serving / 3.13 sandbox) on a dedicated NVMe VHDX (02:30) — *exit check: `nvidia-smi` inside WSL2 (the single most common failure point), docker GPU smoke passes.*
2. Pull competition data (22.42 GB) + wheelhouse; record wheelhouse version (01:00).
3. Build `swebench-sandbox:latest` with imp.py/telnetlib.py shims; swegemma + adk-submission from wheelhouse (02:00) — *smoke: 3 tasks / 10 min / ≥1 resolved with gold patch.*
4. Gold-patch CI: apply `patch` + `test_patch` for all 129 tasks, pytest, record exit codes, subprocess AND docker modes (03:00) — *expected result: 71/129 pass in subprocess mode per board intel; anything ≥60% is workable, <50% triggers the M1 escalation (below).*
5. Repair layer: bake missing wheels (typing_inspection, inline-snapshot, dirty-equals, ujson, orjson, python-multipart); per-task correct-starlette resolution instead of dedup-forced 1.6.0 (03:30) — *expected result: gold-CI ≥90% (M2 criterion); measure each wheel's marginal gain in the ledger.*

**C.1.2 Trusted CV set (08:00)**
1. Blacklist verification: independently re-run the 12 dead task IDs (8 SSL-dead requests + 3 version-gated + 1 string-drift) — confirm or clear each (02:00) — *expected: ≥10 of 12 reproduce dead; cleared IDs go back into CV.*
2. Frozen split: dev (≈80) / held-out (≈29) / LOCKBOX (20, never touched for tuning), seed 20261001, per-task gradable flags + repeated-gold noise band (02:30).
3. CV↔LB calibration ledger: config_hash, CV, LB, harness version per submission (01:00).
4. 20-task fast probe suite (stratified by repo and difficulty) + full-129 soak runner (02:30) — *unit test: probe completes <45 min on Main; soak resumable.*

**C.1.3 Measurement fork — ceiling ladder (08:00)**
1. Rung 1 gold replay: agent given gold patch location, must only apply it → measures edit-path ceiling (01:30) — *expected: ≥95%; below = edit-path bug dominates everything.*
2. Rung 2 file-oracle: agent told the right file, must localize + fix (02:00) — *expected: 40–60%.*
3. Rung 3 symbol-oracle: agent told the right symbol (02:00) — *expected: 25–40%.*
4. Rung 4 blind (realistic) (02:30) — *expected: 8–15% locally, matching the LB band after harness repair.*
Interpretation: the gap between rungs localizes the bottleneck (edit path vs localization vs planning) and prices every later option.

### O4 — Escaping-robust patch_tool (Sprint 1–2; total ≈ 11:00)

1. Implement `patch_tool` skill script: `replace_lines(file, start, end, text)`, `insert_before/after(file, anchor_token, text)` (anchor = short unquoted token), `validate()` (= `git apply --check` equivalent), `clean()` (rm untracked junk) (04:00) — *unit tests, all with expected results: (a) replace_lines on a 3-line span returns exact expected file content; (b) anchor match is unique-or-refuse (expected: refuse on 2 matches with enumerated lines); (c) validate rejects a patch that breaks syntax; (d) clean removes exactly the untracked files the agent created.*
2. Hostile-content suite: triple-quoted docstrings, backslash literals, Arabic/CJK strings, \uXXXX sequences, CRLF (02:00) — *expected: 100% round-trip byte-identical; any failure is a logged defect with receipt.*
3. Read-before-edit + verify-after-edit wrappers; write_file fallback after 2 failed edits (02:00) — *unit test: simulated double-JSON escaping input produces a *successful* patched file, not an error storm.*
4. Wire into prompt policy: "never splice by quoted old_string" + integer-only line args (01:00).
5. Measure: edit-failure proxy from zero-census; target <5% from ~13–21% community baseline (02:00) — *gate G2 input.*

### O3 — Prompt/skill/config hardening, Track A (continuous; first pass ≈ 14:00, then 04:00/week)

1. Prompt v2 from failure taxonomy: triage-first workflow, budget awareness in-prompt ("if two approaches fail, write your best patch and submit"), ≤40-line tool policy (03:00).
2. Skills package: `repo_navigation` (per-repo conventions for fastapi/rich/requests/httpx), `test_workflow` (pytest patterns, shim awareness), `patch_hygiene`; SKILL.md bodies <500 lines; progressive disclosure (03:30) — *expected: description-field quality determines activation (31B); verify via ledger activation counts.*
3. Tool policy enforcement in scripts (not prose): neighbors-first, symbol-language queries, capped k, banned generic queries, per-tool output budgets + >5k-result handling (03:00) — *unit test: a "Body"-style generic query is refused with a suggested symbol form.*
4. Context firewall: truncate run_command >60 lines keeping stack tail; STATE/NEXT/WHY visible block per call (compensates dropped thinking) (02:00).
5. Sampling config: lock after re-probe of thinking patch; temp 0.0–0.1 for finals (01:00).
6. Weekly loop: top-failure from census → targeted prompt/skill fix → 20-task probe → submission (04:00/week) — see Part D.

### O5 — Adapter-liveness canaries (Sprint 3–4; total ≈ 09:30 + 2 scored submissions)

1. **Loud adapter** (04:00): random Gaussian init on both lora_A and lora_B, rank 8, ~4 layers; train zero steps; register under harness `--lora-modules` on wheelhouse vLLM (never stock PyPI — it refuses Gemma-4 LoRA). *Acceptance battery, all with expected results: (a) temp-0 outputs differ from base on 10 fixed prompts — expected: ≥8/10 differ ⇒ activation; (b) >7.6k-token prompt completes without stall ⇒ context survival; (c) per-task latency within +20% of base.*
2. **Destructive adapter** (03:00): few hundred deliberate degradation steps on reversed/garbled targets; identical Config-3 agent, `adapter:` pointing at it. *Expected result: LB score collapses toward 0 ⇒ adapters LIVE (real adapter high-EV); score unchanged ⇒ adapters INERT or KV-starved ⇒ close the LoRA track permanently. One submission, unambiguous, variance-immune (a ±0.04 band cannot hide a 0.13→0.02 collapse).*
3. Decision + ledger write-up (01:00); scheduling: run the week host fixes are believed live (re-probe watch-list Q1a/Q1b first); hard tripwire **canary verdict by 2026-10-21** (14's dated gate) else pivot.
4. Diagnostic adapter if verdict is "live but weak" (01:30): tiny benign adapter trained on 50 trajectories; scorer delta vs local delta ratio estimates scorer-side attenuation [09].

### O6 — Budget allocator (Sprint 2 v1, Sprint 5 v2; total ≈ 12:00)

1. v1 triage-then-commit (04:00): first 3 tool calls cheap recon/classify; then commit or best-effort patch and move on; hard per-task ceilings via eval_config (`timeout_seconds` 300, `max_tool_calls` 40, `max_time_minutes` 5 failsafe, `max_turns` 30 — all conservative under the unverified 12-h window); force_commit_at 70%, force_submit_at 90%. *Unit tests: (a) synthetic task burning budget triggers force_submit exactly once; (b) Σ per-task caps ≤ 10 h over 120 tasks (assertion on the config arithmetic); (c) order-agnostic — shuffle task list, allocator behavior per task unchanged.*
2. v2 measured (05:00): fit per-task budgets to the observed solve-time distribution; soft caps at 80th percentile of successful solves; 10% global reserve; salvage pass (partial work → syntactically valid non-regressing patch). *Expected: submit_patch rate ≥95%, zero whole-run timeouts across 3 consecutive soaks (M6).*
3. Cap sweep c∈{3,6,12} min on Kaggle probes (03:00) — *expected: p(c) concave; stop raising c when p'/p = 1/(c+o) (15's rule).*

### O7 — Graph-first localization + interference signatures (Sprint 2–3; total ≈ 14:00)

1. Enforce neighbors→subgraph→read_file doctrine + budget ≤10 localization calls (02:00).
2. Mirror-tree detector: embedding cosine ≈1.0 pair scan (src/httpx vs src/ahttpx pattern) run automatically pre-edit; on hit, require dual-site check (02:30) — *unit test on the known httpx twin: detector fires exactly once.*
3. Implement the five interference signatures over the shipped AST graphs (reachability cones = call-graph ancestors; mirrored subtrees; guard/early-exit high-out-degree nodes; call-site-vs-tested-site divergence via coverage overlay × centrality; issue-text rename/deprecate patterns) (05:00) — *unit test: on the httpx_3672 walkthrough facts, signatures flag the known masking pair.*
4. `nodes[*].text` precomputation path (spec-phase source lookup) + search_similar_code blowup hedge (02:00).
5. Graph-tools-off ablation on dev split (10 tasks × on/off) (02:30) — *expected: tool-calls-per-resolved-task drops ≥20% with graphs on; if pass-rate drops, cap graph use (the 6/246 graph-call-kills community stat).*

### O8 — Trajectory data engine (Sprint 2–3; total ≈ 24:00 + GPU nights)

**C.8.1 Collection (10:00 setup + overnight runs)**
1. Config-3 (best Track-A agent) over all 129 public tasks × 3–5 samples at temp 0.7–1.0 on Main via HIVE-Lite (02:00 setup; ~6 nights × 08:00 wall, unattended) — *expected yield: 129×0.12 pass ≈ 45–60 verified successes at 3 samples; near-misses (≥1 F2P test passing) 3–4× that.*
2. Gold-patch trajectory synthesis: task statement → scripted navigation → gold patch, formatted as agent turns (04:00) — *expected: +129 trajectories, labeled `synthetic-gold` (never mixed into "measured" claims).*
3. Optional open-weight teacher (≤14B quantized on AUX2; GLM/Qwen/DeepSeek-class, license ledger from day 1) for supplementary traces on historical SWE-style tasks mined from the four repos' histories (04:00) — *license gate: closed-API teachers rejected outright (ToS + §2.5/2.8 lineage).*

**C.8.2 Classification (06:00)**
1. Grader-verify every trajectory (patch applies + tests pass) — the only entry ticket (01:30).
2. Label schema: outcome {success, near-miss, failure}; failure phase {localization, edit, verify, submit, budget}; repo {fastapi, rich, requests, httpx}; archetype {single-fault, multi-fault/interference, compat-refactor, test-asymmetry, env-fragile}; spec-quality quartile (01:30) — *unit test: 20 hand-labeled trajectories, classifier agreement ≥90% (Cohen's κ ≥0.8 target on the double-labeled 20).*
3. Dedup + filters: trajectory < budget-length, no dead-task IDs, patch ≠ test-only (02:00) — *expected dataset v1: 300–800 verified trajectories (14's target; 13's ≥500 floor).*
4. Splits: train/holdout 85/15 + 30% replay buffer of strict tool-invocation turns + 400 negative-recovery turns synthesized from logged failures (01:00).

**C.8.3 Storage/lineage** — dataset card with per-sample provenance stamp (grader-verification id, config hash, seed) (02:00).

### O9 — SFT QLoRA adapter (Sprint 4–5, strictly gated on O5 = LIVE; total ≈ 34:00 + ~40 GPU-h)

1. Environment proof (03:00): wheelhouse vLLM `--enable-lora --max-loras 8 --max-lora-rank 128`; **dual-decoder-registration check** — enumerate Gemma-4 target-module registrations, confirm adapter touches both, else silently half-applied (13's gotcha). *Unit test: state-dict keys cover both registrations; load + generate changes outputs.*
2. Recipe (composite): QLoRA over the frozen W4A16 base, bf16 dequantized compute, r16 (α32) baseline — alt r32/α64 (02's numbers) and r64 masked-loss variant (15); dropout 0.05; LR 2e-4 cosine; 3 epochs; paged AdamW; grad checkpointing; seq 4096–6144 with packing; loss masked to tool-call + edit spans (01:00 config) — *expected wall: 1–3 days/epoch on the 5090 at dataset-v1 size; hourly checkpoints (Windows consumer training crashes are a when, not an if); WSL2 + tmux + systemd.*
3. Train run 1 (unattended ≈ 30:00 wall) with HIVE-Lite stop conditions.
4. Local acceptance battery (05:00): (a) 20-task probe Δ vs base ≥ +0.03; (b) First-Turn Edit Success Rate >80% (02's headline metric); (c) replay-buffer holdout: tool-format errors <2%; (d) negative-recovery eval: recovered-within-2-turns ≥70%; (e) long-prompt >7.6k survival; (f) latency +≤20%. *Any two failures → one remediation loop (rank down, more replay, re-train) then re-gate.*
5. Scorer promotion (O5's 3-gate protocol, 09): activation ✓, context-survival ✓, learned-improvement = one scored submission with adapter+hardened prompts (never bare adapter): promote if LB Δ ≥ +0.01 beyond the ±0.04 band with a repeat, else keep as diagnostic (03:00).
6. Fallbacks: OOM → layer-offload or rank 8; CV-uncorrelated → freeze as diagnostic, ship Track-A lineage.

### O10 — RL/GRPO round 2 (Sprint 5 only if O9 promoted; total ≈ 20:00 + GPU)

1. Preference pairs from near-misses + failure-driven augmentation (04:00).
2. GRPO or rejection-sampling distillation on test-pass reward, rollouts from the real harness on LOCKBOX-excluded tasks (08:00 setup + nights).
3. Gate: ≥ +3 pts on trusted CV over best SFT, else lock best SFT (13's rule) (04:00).
4. Deployment: adapter always co-tuned with prompts, never independently (04:00).

### O11 — Masking/interference micro-benchmark + 129-patch audit (Sprint 2–4; total ≈ 16:00; runs on AUX2)

1. Hardlink micro-benchmark: locate the two shared-base_commit task pairs (129↔127 structure); for each: apply gold patches in both orders; assert (a) each fault alone fails, (b) one order shows masking (tests pass for f1 while f2 still present), (c) only one order reaches green without intermediate regression (04:00) — *expected: ≥1 of 2 pairs demonstrates masking; receipt every cell.*
2. Progressive gold-patch inversion on 10 volunteer snapshots (compose two unrelated gold patches; invert order) (04:00) — *expected: masking rate consistent with An et al.'s multi-fault prevalence (311/326 versions multi-fault).*
3. Hunk-divergence audit: Nashid Div(P) + proximity classes over all 129 gold patches; nearest-neighbor cross-check vs shipped embeddings; publish the likely-tangled list (05:00) — *expected: Fragment-class tasks predict our failures (validate against census).*
4. Interference-risk prior ρ(sᵢ,sⱼ) = shared-mutable-state ∨ caller-callee ∨ same-exception-path ∨ guard-dominates-sink, validated against (2)'s recovered interactions (03:00) — *expected: AUC ≥0.7 vs random pairs; else report as negative result (publishable either way).*

### O12 — Paper package (stub now; write Sprint 6; total ≈ 22:00)

1. **This week:** stub writeup saved early (earliest-entry tiebreak + 404-bug dodge) (01:00).
2. Entry A — Overall Best Paper: "Specification-first repair under a partially observable oracle": q^n conjunctive plateau calibrated to the live LB; masking = non-identifiability (equivalence-class lower bound); greedy-on-observable theorem; pre-registered predictions (i)–(iv) with Holm correction; "what we withdrew" section (10:00).
3. Entry B — Best New Resource: the gradability audit + repaired-harness recipe + 129×7 taxonomy (κ protocol) + masking micro-benchmark + interference signatures (08:00).
4. Word-budget pass at 3,000 words/entry; every number carries a receipt ID (claims-audit enforces) (03:00).

---

## Part D — Iterative self-improvement loop (weekly cycle, ~10:00/week explicit + overnight compute)

```
        ┌────────────────────────────────────────────────────────────┐
        │ 1. MEASURE: zero-census + ledger over the week's runs        │
        │    (soak on AUX2, overnight; receipts committed)             │
        ▼                                                              │
│ 2. CLASSIFY: failure-taxonomy histogram → top failure              │
│ 3. FIX: one hypothesis only (prompt / skill / tool / config /      │
│    adapter) — single-variable-change rule                          │
│ 4. PROBE: 20-task fast suite on Main (<45 min)                     │
│    → expected-result check before spending a submission            │
│ 5. SUBMIT: scored run; ledger (config_hash, CV, LB)                │
│ 6. CALIBRATE: CV↔LB delta; adopt rule: LB Δ ≥ +0.01 beyond the     │
│    ±0.04 band → adopt + promote to baseline; else require a repeat;│
│    two non-repeats → revert (14's rule)                            │
│ 7. FEED FORWARD: adopted fixes become training data (O8) and       │
│    prompt/skill updates; failures become negative-recovery turns   │
└────────────────────────────────────────────────────────────────────┘
```

Escalation paths: probe fails expected-result check → fix locally before any submission; CV/LB anti-correlation persists 2 weeks → distrust CV for pass/fail, use it only for ranking (13's doctrine); host patch lands mid-week → re-run the Day-0 probe matrix (read_file line-args, search cap, thinking tokens, edit escaping) before comparing any scores.

## Part E — Composite calendar, milestones, GO/NO-GO gates, pivots

**Day 0 (Wed 2026-10-01, ≈ 10:30 h):** O2 ledger live → env bring-up → gold-CI smoke (≥1 task) → three Day-0 probes (read_file line-args; loud-adapter LOCAL activation on wheelhouse vLLM; journal-placement probe: /tmp/bcf write + `git add -N .` pollution check) → paper stub saved → overnight: full gold-CI on AUX2. **G0:** env live + ≥1 gold task resolves. *Miss → rent 48/80 GB cloud GPU that afternoon (15's M0 rule) or spend G0+1 day on WSL2 repair; do not let Day 0 slip past Friday.*

**Sprint 1 (Oct 2–8) "Repaired harness + census" (≈45 h):** O1 complete (wheel gaps, starlette pinning, blacklist verification, trusted CV, ceiling ladder) + O4 patch_tool + first zero-census. **M1/G1:** gold-CI ≥90%, σ known, ceiling-ladder rungs measured. *Miss paths: gold-CI <50% after 3 days → escalate Docker-mode investigation (3-day box); if still broken, pivot CV strategy to "relative ranking only" and lean harder on Kaggle calibration probes (costs ~1 extra submission/week).*

**Sprint 2 (Oct 9–15) "Track A v1 + allocator v1" (≈45 h):** O3 first pass, O6 v1, O7 doctrine+mirror-tree, O8 collection starts (nights). **M2/G2:** paired dev-split Δ ≥0.03 for the hardened config vs baseline; edit-failure <5%. *Miss → fix measurement first (M2's own rule); if edit-failure stuck >10%, dedicate the sprint to patch_tool hardening before any new features.*

**Sprint 3 (Oct 16–22) "First blood + canaries" (≈40 h + 3 submissions):** first scored submission (interpretation bands: ≥0.13 on-track / 0.08–0.12 measurement problem / ≤0.05 pipeline defect — find it in the census before touching prompts); O5 canaries if host-fix watch-list says live; O8 classification + dataset v1. **M3/G3:** LB ≥0.13; zero-patch rate halved. *Miss → below 0.10: discard local CV as decision input; re-baseline on two scored probes; if still ≤0.08, freeze features and run the failure-taxonomy sprint (everything into census + patch_tool).*

**Sprint 4 (Oct 23–29) "The LoRA verdict" (≈40 h):** O5 verdict is IN by **2026-10-21 hard tripwire** (run destructive canary this week even if the watch-list is quiet — the information is worth 2 submissions). **M4/G4 — the field's central gate:** LIVE → O9 SFT (recipe above) with the 3-gate promotion; INERT/AMBIGUOUS → **pivot: full prompts/skills + submit-without-adapters; redeploy the 5090 to teacher-side data enrichment for the paper and to faster local probing** (14's redirect; both finals from Track-A lineage). *This pivot is not a failure state: every known score on the leaderboard is prompts-only.*

**Sprint 5 (Oct 30–Nov 5) "Optimize + allocate" (≈45 h):** O6 v2 measured allocator + cap sweep; O10 only if O9 promoted; O11 completes; CV↔LB recalibration. **M5/G5:** LB ≥0.20 and variance ≤0.03. *Miss → still ≤0.15 at this point = capability bottleneck: stop feature work; lock the best variance-minimizing artifact; shift 60% effort to the paper (its deadline is 7 days out).*

**Sprint 6 (Nov 6–12) "Lock + write" (≈45 h):** soak σ<0.02 across 3 runs; submission.zip audit (root agent.yaml, 3 GiB, extension allowlist, no `../`, `!include` resolution, Save-Version-before-Submit); two finals selected; **paper entries submitted by Nov 12, 23:59 UTC**. **M6/G6.**

**Endgame (Nov 13–Dec 2):** one submission/day max, single-variable changes only, temp-0 finals; protect-the-score rules (no untested config in the last 72 h; last run Dec 1 morning; finals re-selected 48 h before deadline); winner-obligations documentation assembled incrementally all along (§2.5/2.8: seeded training + inference code, versioned datasets, license lineage — "scrambling to reconstruct it after winning is a classic way to lose a prize"). **M7/M8.**

**Global kill-switches:** any integrity tripwire (unreceipted number in a deliverable) → fix before submit; host announces scoring-semantics change → freeze + re-baseline week; personal capacity failure → the plan degrades gracefully: Sprints 1–4 alone still yield a valid submission + one paper entry.

---

## Verification summary for this plan

- Every numeric expectation above is either (a) verified corpus fact, (b) live-web-verified, (c) community intel marked as such, or (d) a pre-registered prediction with a receipt plan — per the claims-audit rule, none may enter the paper without a receipt ID.
- The two load-bearing unverified anchors (12-h budget; submission cadence) are handled conservatively: failsafes that fail safe, and order-agnostic design.
- Deliberately excluded from the composite: 05/06/07/10's fabricated results layers, 10's daily auto-submit (cadence-infeasible), 02's abort-to-EMPTY-patch (dominated by best-effort), 01/08's ungated adapter main-line, and any pre-baked repo encyclopedia for hidden tasks (private repos — only runtime-derived, issue-text-only knowledge transfers; 14's correction).


---

<!-- ====================================================================== -->
<!-- FILE: special-section-3-open-questions.md -->
<!-- ====================================================================== -->

# Special Section 3 — Roundup of All Open Questions

Every unresolved question surfaced by the 15 contenders or by this review, with status and a concrete resolution path. Legend: **[HOST]** answerable by asking Kaggle staff / rules page · **[PROBE]** answerable by a local experiment · **[SUBMISSION]** answerable by spending a scored submission · **[COMMUNITY]** board intel, needs corroboration · **[UNKNOWABLE]** not resolvable before deadline · **[RESOLVED-THIS-RUN]** verified live during this council run.

## A. Competition mechanics & scoring

1. **Is there a 12-hour global budget, and does exceeding it error the entire submission?** Asserted as fact by 01, 02, 04, 08, 09, 10, 11, 12, 14, 15; hedged only by 13 ("host-planned fix: score unfinished as 0 — not confirmed live"). Verified facts show per-task defaults only (300 s / 100 calls / 60 min). **[HOST]** — the single most consequential unknown; until answered, ship `max_time_minutes` failsafes that fail safe.
2. **What is the leaderboard denominator?** ~120 hidden tasks (verified) vs "leaderboard ≈ half of hidden set → ~60 graded" (09, 15's Part A "58 not ~60") vs whole-set N≈120 (13). **[HOST]**; affects every EV calculation and the value of one task (0.83% vs 1.7%).
3. **Is `max_turns` the 4th scorer-read `eval_config.yaml` field** (after `timeout_seconds`, `max_tool_calls`, `max_time_minutes`)? Claimed by 09 and 13; 14 says "exactly four fields" without naming the fourth. **[PROBE]** — diff scorer behavior with/without the key.
4. **Task ordering in the run: public-first, interleaved, or randomized?** Unanswered host question (14 designs order-agnostic because of it). **[HOST]**.
5. **Submission cadence & quota:** one scored submission/day; ~30 GPU-h/week with ~2× wall-clock deduction; 4–13 h queues; "stale submissions are not re-scored" (13, 14, 15). All **[COMMUNITY]**. 
6. **Are two final submissions allowed and selected 48 h early?** (14: "the rules allow two"; 13: "up to 2 finals"). **[HOST]** — rules page re-read.
7. **Dead-task blacklist:** are the 12 IDs (8 SSL-dead requests 6589/6592/6629/6757/7328/7433/7502/7505; fastapi_14186, fastapi_15745, rich_3486 version-gated; rich_3472 string-drift) actually dead on the scorer, or only locally? (13, 14; single-sourced). **[PROBE]** — Day-0/Sprint-1 verification scheduled in the master plan.
8. **71/129 gold-pass in subprocess mode; wheel gaps (typing_inspection, inline-snapshot, dirty-equals, ujson, orjson, python-multipart); starlette-1.6.0 dedup pin** (13, 14). **[PROBE]**.
9. **Team-size ≤5; Nov 25 entry/team-merger deadline; 3 GiB zip cap; extension whitelist** (13, 14, 15, 08). **[HOST]**.
10. **±0.04 run-to-run variance at temp 0.2** (13, 14, 15, fork-of-romanrozen 0.12-vs-0.08). **[PROBE]** — 3× baseline battery measures our own band.
11. **Does the paused 9/26 rerun/rescore backlog still threaten to reshuffle the board?** (13, 14). **[COMMUNITY]**.
12. **Prize-split legality of one team winning main + paper** (implied by two-track plans). **[HOST]**.

## B. Harness bugs & platform behavior

13. **`read_file` line-range TypeError (thread 744678):** int-vs-str args — kill or confirm. **[PROBE]** (Day-0 matrix item a).
14. **`search_similar_code` capping:** generic "Body"-style queries returning unbounded results (110 kB > whole 32k window claim, 15) — capped or not? **[PROBE]** (item b).
15. **Thinking on/off token accounting + `reasoning_content` drop patch status** (13, 14). **[PROBE]** (item c) + **[COMMUNITY]** watch-list.
16. **Double-JSON escaping fix:** does the single-JSON fix make edits better or worse? (62% vs 22% escape-rate claims, 13; 21%/13% figures, 15). **[PROBE]** + **[COMMUNITY]**.
17. **Compaction semantics:** interval 15 turns / threshold 14336 tokens (13, from Getting Started); does compaction discard uncommitted patch work (15's D1 overflow bug)? **[PROBE]**.
18. **`get_status()` fields:** budget/patch only, or failing tests too? (15 says never trust it for tests). **[PROBE]**.
19. **`submit_patch` mechanics:** `git add -N .` + `git diff HEAD` — journal placement in /tmp survives to patch capture? **[PROBE]** (Day-0 journal-placement probe).

## C. LoRA / adapter platform (the biggest EV lever)

20. **Are adapters live on the scorer at all?** Zero adapter scores ever; sample submission with adapters failed (13). Resolution: destructive-adapter canary **[SUBMISSION]** — 1 bit, variance-immune.
21. **Is the silent-zeroing bug fixed?** (`lora_B = N(0,1)` still zeroed on wheelhouse v25, thread D4, 15). **[COMMUNITY]** watch-list Q1b + loud-adapter local test **[PROBE]**.
22. **Is the KV-collapse fixed?** 46k→7.6k effective context with adapters attached; 4k-prompt OK / 14k-prompt hangs (15's D5). **[PROBE]** + **[COMMUNITY]** Q1a.
23. **Does stock PyPI vLLM 0.19.1 refuse Gemma-4 LoRA, and is wheelhouse vLLM the only valid serve path?** (13). **[PROBE]**.
24. **Gemma-4 dual decoder registration:** do off-the-shelf PEFT configs miss the second registration (half-applied adapters)? (13). **[PROBE]** — state-dict key enumeration.
25. **Is `max_lora_rank` 128 on the scorer** (sample flags: enable_lora, max_loras 8, max_lora_rank 128)? (13). **[COMMUNITY]** — sample-submission config read.

## D. Data & local environment

26. **Embedding dimensionality:** "256-dim vectors" (07, 11, 12, 14) conflates the verified 256-*file* count; what is the actual vector dim? **[PROBE]** — open one file.
27. **The two shared-base_commit hardlink pairs:** which tasks, and do they demonstrate masking on the scorer? (13 — only user of this structure). **[PROBE]** (O11 micro-benchmark).
28. **Wheelhouse versioning (v25+?) and 22.42 GB dataset size** (13, 14, 15, 08). **[PROBE]** at download time.
29. **Python version split:** 3.12 serving / 3.13 sandbox (docker/Dockerfile.public) (15). **[PROBE]**.
30. **Is the smaller Gemma-4 sibling (A4B MoE) real and tool-format-compatible** for cheap prompt iteration? (15 assumes; 13 uses it too). **[PROBE]**.

## E. Paper track

31. **Judge roster composition** — Perozzi, Rózemberczki, Hemmati verified live this run; **Galkin's** presence (13, 14) unconfirmed. **[RESOLVED-THIS-RUN]** (3 of 4) / **[HOST]** for Galkin.
32. **Writeup-save 404 bug status** (14, 13; "since 24 Sep"). **[COMMUNITY]**.
33. **Do topic areas (Tuning & Optimization, Code Comprehension, Graph Reasoning) constrain eligibility?** (01, 14). **[HOST]** — paper-track page re-read.
34. **Is arXiv-parallel publication during the judging window OK (non-archival)?** (15). **[HOST]**.
35. **Distillation licensing:** staff answer thread 742807 says license-compliant distillation is allowed — what documentation satisfies §2.5/2.8 lineage at winner verification? (13, 14). **[HOST]**.

## F. Research/citations still open after this run's live verification

36. **FLITSR TOSEM-2025 journal extension DOI 10.1145/3745027** (12) — ACM behind Cloudflare; unverified. **[PROBE]** (library/Google Scholar).
37. **FailFast-RestartSmart** (01, 10, 14) and **SWE-MeM 43.4% @4B** (13, 14) — no ids anywhere; unverified. **[COMMUNITY/PROBE]**.
38. **"59.4% of 138 consistently-failed tasks had flawed test design"** precision inside the (now-verified-real) OpenAI Feb-23-2026 announcement (05, 10, 14, 15). **[PROBE]** — fetch the announcement itself.
39. **DiGiuseppe & Jones version counts:** "65,000 versions / six subjects" (09) vs ">72,000" (12) for the EMSE study. **[PROBE]**.
40. **Pearl-2017-ISSTA and Zhang-2022-TSE causal-FL citations** (10) — not found live; suspected fabricated. **[UNKNOWABLE]** (treat as nonexistent).
41. **LivePlan "+9.9% avg at ~$0.08/instance"** (13, 15 [S20]) — paper is real; the numbers are uncorroborated. **[PROBE]**.
42. **SWE-bench "18%" figure and first-author attribution** (10). **[UNKNOWABLE]** as stated — established attribution is Jimenez et al. ICLR 2024.

## G. Strategic/methodological questions the field left open

43. **Does issue-text exception classification help or hurt localization?** 03's pilot says *hurts* (LOO 6.57 vs 5.84); 05/06/11's theses assume it helps; 15's Prop-1b makes it conditional on α·log k. Open empirically on the hidden distribution. **[SUBMISSION/PROBE]** (pre-registered X-experiments).
44. **Optimal taxonomy granularity k\*** — 11 predicts an interior optimum; 14/15 give k*=e^{α0/(2β)}; nobody has measured it for LLM-agent issue routing. **[PROBE]** (Sprint-5 sweep, paper-grade either way).
45. **Flat vs multi-agent for a 31B model** — community says flat calls tools more reliably (14's correction); 01/08 built trees anyway. **[PROBE]** (ablation only, never critical path).
46. **Reducer/handoff packets vs full transcripts** — Cognition-vs-Anthropic tension; 01/06/13/14/15 all defer to a 3-arm ablation. **[PROBE]**.
47. **Does spec-quality predict PASS?** (14's logistic-regression proposal). **[PROBE]** after Sprint 2.
48. **Is CV/LB anti-correlation real and stable?** (13, 15, "508shuto" highest-CV/lowest-LB). **[SUBMISSION]** — calibration ledger answers this by Sprint 3.
49. **Can task-order gaming help?** (13 investigates, builds nothing on it; 14 explicitly order-agnostic). **[HOST]** + **[UNKNOWABLE]**.
50. **What actually composes the 0.13–0.17 band** — 15's q^n (n≈2) reading vs single-fault-rate reading? Distinguishing them changes whether multi-fault tooling (fix-order, DAG specs) has scorer-level upside. **[SUBMISSION]** — per-task requirement counts (E-5) if logs permit.


---

<!-- ====================================================================== -->
<!-- FILE: special-section-4-content-matrix.md -->
<!-- ====================================================================== -->

# Special Section 4 — Checklist-Style Content Comparison Matrix (per contender unit, per file)

Legend: **Y** = present and substantive · **P** = partial/thin · **N** = absent · **—** = not applicable. Sources: extraction notes §12 (`independent_research/scratch/mc3-notes/contender-*.md`). Contenders are folder-units (all files inside scored together); the per-file inventory beneath each matrix lists every file with its content.

## Table 1 — Plan & process categories (top 7)

| Category | 09 gpt61sol | 03 cc-opus55 | 11 cc-glm53max | 12 cc-grok47 | 14 kimiK3 | 15 deepseek | 13 mimo26pro |
|---|---|---|---|---|---|---|---|
| Roadmap | Y | Y | Y | Y | Y | Y | Y |
| Master checklist | Y | Y | Y | Y | Y | Y | Y |
| Milestones (dated, w/ DoD) | Y | Y | Y | Y | Y | Y | Y |
| Day-0 setup | Y | Y | Y | Y | Y | Y | Y |
| Sprint plan (6×1wk) | Y | Y | Y | Y | Y | Y | Y |
| Hardware plan (all 3 machines) | Y | Y | Y | Y | Y | Y | Y |
| LoRA training plan | Y | Y | Y | Y | Y | Y | Y |
| Data/dataset plan | Y | Y | Y | Y | Y | Y | Y |
| RL/DPO plan | Y | P | Y | P | P | Y | Y |
| Prompt engineering | Y | Y | Y | Y | Y | Y | Y |
| Tool/skill design | Y | Y | Y | Y | Y | Y | Y |
| Graph/embedding use | Y | Y | Y | Y | Y | Y | Y |
| Time estimates (sub-week) | Y | Y | Y | Y | Y | Y | Y |

## Table 2 — Plan & process categories (bottom 8)

| Category | 07 b2 | 10 nemotron | 05 antigrav | 04 antigrav | 06 b1 | 01 gem31pro | 08 qwen | 02 gem38flash |
|---|---|---|---|---|---|---|---|---|
| Roadmap | Y | Y | Y | Y | Y | Y | Y | Y |
| Master checklist | Y | Y | Y | Y | Y | N | Y | Y |
| Milestones (dated, w/ DoD) | Y | Y | Y | Y | Y | P | Y | P |
| Day-0 setup | Y | Y | Y | Y | Y | Y | Y | Y (old HW) |
| Sprint plan (6×1wk) | Y | Y | Y | Y | Y | Y | Y | Y |
| Hardware plan (all 3 machines) | Y | Y | Y | Y | Y | Y | Y | **N** |
| LoRA training plan | Y | Y | Y | Y | Y | Y (no hyperparams) | Y (no hyperparams) | Y |
| Data/dataset plan | Y | Y | Y | Y | Y | Y | Y (3k-vs-5k clash) | Y |
| RL/DPO plan | P | Y | Y | N | N | N | N | N |
| Prompt engineering | Y | Y | Y | Y | Y | Y | Y | Y |
| Tool/skill design | Y | Y | Y | Y | Y | Y | Y | Y |
| Graph/embedding use | Y | Y | Y | Y | Y | Y | Y | Y |
| Time estimates (sub-week) | Y | Y | Y | N | Y | N | P | Y |

## Table 3 — Evidence & extras categories (top 7)

| Category | 09 | 03 | 11 | 12 | 14 | 15 | 13 |
|---|---|---|---|---|---|---|---|
| BCF integration (A/B items) | Y | Y | Y | Y | Y | Y | Y |
| BCF math (formal) | Y | Y | Y | Y | Y | Y | Y |
| Prior research | Y | Y | Y | Y | Y | Y | Y |
| References list/bibliography | Y (R1–R13+DOIs) | Y (lit map+confidence) | Y (33-entry, DOI-checked) | Y (28-cite survey) | P (inline only) | Y (29-entry annotated) | P (prose only) |
| Whitepaper draft/outline | Y | Y | Y | Y | Y | Y | P |
| Simulation/experiment design | Y | Y (incl. EXECUTED pilot) | Y | Y | Y | Y | Y |
| Intel (board/rules, w/ provenance) | Y | Y | Y (best: 22-thread sweep) | Y | Y | Y | Y (exact IDs) |
| Catalog (tools/repos) | Y | P | Y (3 catalogs) | Y (3 catalogs) | P | P | P |
| QC report | Y | Y (2 QC reports) | Y | P | P | Y | Y |
| GO/NO-GO gates | Y | Y | Y | Y | Y | Y | Y |
| Cost/budget | P | P | P | P | P | P | P |
| Risks register | Y | Y | Y | Y | Y | Y | Y |
| Honest evidence labeling | Y | Y | Y | Y | Y | Y | Y |

## Table 4 — Evidence & extras categories (bottom 8)

| Category | 07 b2 | 10 nemotron | 05 antigrav | 04 antigrav | 06 b1 | 01 gem31pro | 08 qwen | 02 gem38flash |
|---|---|---|---|---|---|---|---|---|
| BCF integration | Y | Y | Y | Y | Y | Y | **N** | **N** |
| BCF math | Y | Y | Y | Y | Y | Y | **N** | **N** |
| Prior research | Y | Y | Y | P (name-only) | Y | Y | **N** | **N** |
| References list | P | P | P | **N** | P | P | **N** | **N** |
| Whitepaper draft | Y | Y | Y | Y | Y | Y | N (title only) | P (3 bullets) |
| Simulation/experiment | Y (fictional receipts) | Y (Table 1 = fiction) | Y (fictional receipts) | P (todos only) | Y (fabricated transcript) | Y | Y | Y |
| Intel (board) | Y | Y | P | P | P | P | Y | **N** |
| Catalog | P | P | P | P | Y (T-01..09) | P | P | P |
| QC report | P (fake ledger) | N | P | N | P | **N** | **N** | P |
| GO/NO-GO gates | Y | Y | Y | P | Y | P | **N** | P |
| Cost/budget | P | P | P | N | P | **N** | **N** | **N** |
| Risks register | Y | Y | Y | P | Y | Y | P | Y |
| Honest evidence labeling | **N** | **N** | **N** | **N** | mixed | **N** | — | — |

## Per-file inventory (each contender's files and what each contains)

**01 gemini31pro (1 file).** `kagglecom_bcf_instantplan_[web-gemini31pro-38flash].md` (36,338 B) — combined 3-turn transcript: TLDR/strategy, Task 1 architecture (3-role multi-agent + per-role adapters), Task 2 six-sprint plan, BCF-per-sprint incorporation, whitepaper 4 ideas, math section (entropy partition, masking, DAG), prior research A–D.

**02 gemini38flash (1 file).** `…[web-gemini38flash].md` (33,079 B) — roadmap+checklist, old-hardware Day-0/sprints, LoRA recipe (r32/α64/2e-4/3ep, replay buffer, negative-recovery), 48-h plan, failure-mode table; final turn = empty echo of new hardware spec.

**03 cc-opus55 (9 files, 2 folders).** Folder 2026-09-30: `00-plan.md` (master plan), `01-pilot-results.md` (executed measurements incl. LOO-worse result), `02-math.md` (S(K,f), interference atlas), `03-whitepaper.md`, `04-qc-report.md`, `05-calibration.md`, `06-ledger-schema.md` (+ closely named siblings per discovery); folder _BCF: `07-bcf-foldin.md` (A1–A8/B1–B6 with LOCKBOX/DEV splits), `08-qc-report-2.md`, `09-open-questions.md`.

**04 gemini31pro-antigrav (6 unique files across afterQ1/Q2/Q3; Q3 canonical, Q2 byte-identical).** Q1: architecture draft (spec-first permission gate). Q3: full roadmap/checklist/sprints — all milestones 🔲 Todo (nothing executed); BCF-lite incorporation; name-only citations.

**05 gemini38flash-antigrav (15 files; 00–02 mirror Q2=Q3).** Q1: math deep-dive (Fano bound, K* by channel capacity, martingale rescue). Q2: BCF fold-in + masking state machine. Q3 "cumulative": roadmap + **§5 fabricated measured-results tables with R-* receipts** (0.163/0.240/0.341/0.388) — silently drops Q1/Q2 content.

**06 gemini38flash-b1 (5 files).** Architecture + math (closed-form I(X;C) w/ fidelity F), 4-era literature review, T-01..T-09 technique catalog with ablations, **fabricated fastapi_11194 17/17 transcript**, config tables (80/20/50; R-04 40/15) contradicting verified defaults.

**07 gemini38flash-b2 (5 files).** Later rewrite: best corpus-fact grounding of the family, BCFGateEvaluator implementation code, ledger.jsonl schema, asymmetric dual-LoRA plan (r16/r32, 1,200+2,500 traces), NO-GO adapter fallback, **future-dated receipts REC-20261021-M3-19 + "45.0%/40.6%" [M] ladder**.

**08 web-qwen38max (1 file).** `…[web-qwen38max].md` (11,618 B) — QA1+QA2 only: phases, checklist, 6 sprints, hardware allocation, 3 "Winning Edge" hacks (AST-graph monopoly, deterministic pre-flight, wheel caching). No BCF/math/citations (asks 3–4 absent).

**09 gpt61sol (1 file).** `…[web-gpt61sol].md` (95,736 B) — all 4 asks + intel digest + tool catalog + benchmark recommendations; routing break-even math; R1–R13 DOI citations; two-candidate portfolio; 3-gate adapter qualification; gold-control audit; paper positioning.

**10 nemotron3ultra (1 file, cp1252 → converted copy).** Strategy + 6 sprints + Gantt + board intel + loud-adapter canary + dual-LoRA r128/r64 + curriculum + RL reward shaping + GitHub-Actions auto-submit + risk register; Table 1 (CI-styled, unrun); Pearl-2017/Zhang-2022 suspect citations; wrong wheels/tool-calls counts.

**11 cc-glm53max (13 files + slides.html across 3 dated folders).** Discussion-board sweep (22 threads, host-commitments tracker), paper-track intel (live-verified rubric), httpx_3672 simulation with [V]/[SIM] tags, math notes (I(C;R), DPI optimum, masking DAG), 3 catalog triages (55+44+55 rows), retraction ledger, bibliography (33 entries), slides deck.

**12 cc-grok47 (8 files).** 01 plan; 02 math (C(m,α) + threshold, n=40 table); 03 harness/ops; 04 catalogs ×3 (coderprog 16 / 0dayprizrak 38 / foss_tools 44); 05 ceiling-ladder measurement fork; 06 budget ladder + splits; 07 evidence ledger + F1–F12 first responses; 08 citations survey (28, incl. correct Gao&Wong TSE, Debroy ISSRE-2009 form [unconfirmed], DiGiuseppe EMSE >72,000).

**13 genspark-mimo26pro (1 file).** `…[genspark-mimo26pro].md` (71,991 B) — Part 0 situation assessment (blacklist IDs, wheel gaps, CV/LB evidence); Task 1 WS1–WS7 + M0–M7 with gate-if-missed; Task 2 Day-0 + sprints + endgame; BCF GAP-closure + A1–A8/B1–B6; math (posterior sets, speedup≈m, Fano+DPI+ m*, μ_ij, competing risks); prior-research landscape; 12 whitepaper ideas.

**14 genspark-kimiK3 (1 file).** `…[genspark-kimiK3].md` (63,736 B) — Part 1 roadmap/checklist/milestones/risks + Day-0/sprints/endgame; Part 2 BCF epistemics + A1–A8/B1–B6 incorporation maps + two-entry paper strategy + math (miscalibration inequality, L(G)/k!, K*) + five interference signatures + prior research + retracted-claims blacklist.

**15 genspark-deepseekV41flash (1 file).** `…[genspark-deepseekv41flash].md` (86,330 B) — Part 0 intel delta D1–D6; Part A roadmap/checklist/milestones/kill-criteria/risks/metrics-ledger; Part B Day-0 runbook (12 timed steps) + sprints 1–7 + submission SOP + paper plan; TASK 1 BCF intake (12 adoptions, decline table, httpx_6821 correction); TASK 2 five propositions + E-1..E-6 + annotated bibliography (§2.10) + applicability verdicts (§2.11).

## Reading notes for the matrix

- The single sharpest content divider in the field is **References list + Honest evidence labeling** (Tables 3–4, last two rows): every top-7 contender has both; every integrity-flagged contender (05, 06, 07, 10) lacks honest labeling while still shipping "experiment" content — the combination that produced fabricated results.
- **08 and 02 are the only units missing entire ask-halves** (08: QB1/QB2; 02: QB1/QB2 + hardware plan invalid).
- **Catalog deliverables** exist only in 09, 11, 12 (and thin T-catalog in 06) — an extra question (what to build with) those contenders answered beyond the four asks.
- **Executed-work content** exists only in 03 (pilot measurements) — every other contender's "experiment" sections are designs, and four of those designs are fiction (05, 06, 07, 10).

