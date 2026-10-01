# COMBINED MARKDOWN - combine

_Generated 2026-10-01 05:46:30 | 10 files | folder: D:\stuff\docs\taylor_fv\github\rayrite.github.io\cvx\kaggle\items\combine_

## Contents

1. 00_README_cd-fable51h-31min-51usd.md
2. 01_Council_Report.md
3. 02_Special_1_Feasibility_and_Win_Probability.md
4. 03_Special_2_Composite_Options_and_Project_Plans.md
5. 03a_Project_Plans_Options_00_to_07.md
6. 03b_Project_Plans_Options_08_to_15.md
7. 04_Special_3_Open_Questions_Roundup.md
8. 05_Special_4_Content_Checklist_Matrix.md
9. 06_Research_Verification_Log.md
10. 07_QC_Report.md

---

<!-- ====================================================================== -->
<!-- FILE: 00_README_cd-fable51h-31min-51usd.md -->
<!-- ====================================================================== -->

# Model Council 3 — Deliverables Index (2026-10-01)

Council review of the 16 contender units in `input/kagglecomp/model_council/3/contenders/` (68 markdown files, 2.0 MB) against the four shared prompts in `chat_questions.txt`, performed with the `rdw-model-council` skill. External verification used only the built-in WebSearch tool, the arXiv API and direct `curl` fetches; no Tavily credits were used. Intermediate work is in `scratch/` (`discovery.json`, `council_notes.md`, `council_notes_part2.md`, `scores.json`, `scores_ranked.json`, `feasibility.json`, `arxiv_check.xml`, `qc_tables.py`, decoded copies of two non-UTF-8 files, and the re-measured `tasks.jsonl`).

| File | Contents |
| --- | --- |
| `01_Council_Report.md` | Standard council report: scope, ranked verdict, comparison matrices with legend and weights, coverage checklist, per-unit strengths/weaknesses with evidence, cross-unit contradictions and verification status, SOLID/OSINT design review, priority gaps and synthesis |
| `02_Special_1_Feasibility_and_Win_Probability.md` | Special section 1: claim-by-claim feasibility verdicts for every unit, credibility rubrics (agent track and paper track), win-probability model with worked calculations |
| `03_Special_2_Composite_Options_and_Project_Plans.md` | Special section 2 (index): composite technique inventory (39 techniques), impact–effort analysis, master option list, global six-week calendar with GO/NO-GO gates, global self-improvement loop, shared conventions |
| `03a_Project_Plans_Options_00_to_07.md` | Full project plans with hh:mm task sequences, unit tests, loops and GO/NO-GO pivots for the environment, prompt/skill options and the evaluation ladder |
| `03b_Project_Plans_Options_08_to_15.md` | Full project plans for the LoRA options (shared pipeline, tool-format, localisation, repair, classifier, dual-role), the paper-track package, and the parked options |
| `04_Special_3_Open_Questions_Roundup.md` | Special section 3: 48 open questions by area (41 decision questions plus 7 verification gaps) with owner, resolution path, blocked option and priority |
| `05_Special_4_Content_Checklist_Matrix.md` | Special section 4: checklist-style content matrix per unit (two side-by-side tables), per-file inventory with content tags, best-source quick reference |
| `06_Research_Verification_Log.md` | Verification status of 28 literature citations, 15 harness/paper-track facts and 7 dataset facts, with sources |
| `07_QC_Report.md` | Markdown table QC results and known limitations of this review |

## Headline

| Rank | Unit | Overall |
| ---: | --- | ---: |
| 1 | `3-cc-opus55` | 95.4 |
| 2 | `12-cc-grok47` | 92.6 |
| 3 | `11-cc-glm53max` | 90.8 |
| 4 | `9-genspark-gpt61sol` | 88.1 |
| 5 | `15-genspark-deepseekV41flash` | 81.5 |
| 6 | `13-genspark-mimo26pro` | 79.6 |
| 7 | `16-cc-glm53flash` | 73.9 |
| 8 | `14-genspark-kimiK3` | 69.2 |
| 9 | `1-gemini31pro` | 59.3 |
| 10 | `10-genspark-nemotron3ultra` | 59.2 |
| 11 | `4-gemini31pro-antigrav` | 58.5 |
| 12 | `6-gemini38flash-antigrav-b1` | 57.8 |
| 13 | `8-web-qwen38max` | 54.2 |
| 14 | `7-gemini38flash-antigrav-b2` | 48.5 |
| 15 | `5-gemini38flash-antigrav` | 48.1 |
| 16 | `2-gemini38flash` | 45.2 |

Weight profile: development profile with OSINT retained (Coverage 15, Correctness 15, Depth 12, Reasoning 12, Clarity 8, Support 8, Usefulness 10, SOLID 12, OSINT 8). Half-point scores were used, so overall scores are shown to one decimal.


---

<!-- ====================================================================== -->
<!-- FILE: 01_Council_Report.md -->
<!-- ====================================================================== -->

# Model Council Report — `input/kagglecomp/model_council/3`

**Date:** 2026-10-01
**Input:** `input/kagglecomp/model_council/3/contenders/` (16 numbered contender folders, each treated as one unit) plus `chat_questions.txt` as task context
**Files scored:** 68 `.md` files in 16 units · **Files excluded:** 1 (`103-bcf-simulation-httpx-3672.slides.html`, not `.md`/`.txt`); 2 files were not valid UTF-8 and were scored from decoded copies (see Discovery issues)
**Weight profile:** development profile with OSINT retained (Coverage 15, Correctness 15, Depth 12, Reasoning 12, Clarity 8, Support 8, Usefulness 10, SOLID 12, OSINT 8)

Companion files in this folder: `02_Special_1_Feasibility_and_Win_Probability.md`, `03_Special_2_Composite_Options_and_Project_Plans.md`, `04_Special_3_Open_Questions_Roundup.md`, `05_Special_4_Content_Checklist_Matrix.md`, `06_Research_Verification_Log.md`, `07_QC_Report.md`.

---

## 1. Scope and inferred shared task

All sixteen contenders answered one or more of four related prompts recorded in `chat_questions.txt` for the Kaggle "Gemma 4 Developer Agent" competition:

- **Q1 — Roadmap.** Brainstorm an end-to-end roadmap, master checklist and milestones for a winning coding-agent "brain" (leaderboard top three at 0.17 / 0.15 / 0.15 on 2026-09-30).
- **Q2 — Master plan.** Turn Q1 into a Day-0 bare-metal Windows 11 setup plus six one-week sprints on the stated hardware (RTX 5090 main rig, RTX 4060 laptop, RTX 3080 desktop).
- **Q3 — BCF integration.** Read the competition docs and the Batonic Coding Framework (BCF) material, show how each useful technique would be incorporated and tested, and brainstorm the next whitepaper draft.
- **Q4 — Math and prior research.** Identify the mathematical phenomenon behind "classifying errors into exception classes limits the search space", flesh out the math for fault interference, fault masking and chained issues (the dossier's `httpx_6821` example), and survey prior research.

Four contenders (3, 11, 12, 16) also answered optional follow-ups (catalog ranking, FOSS tools, a real-task simulation of BCF versus a naive agent). Those extras were read and credited under Coverage/Usefulness but were not required for a full score. Two contenders answered only Q1/Q2 (8) or Q1 plus a wrong-hardware Q2 and an empty corrected Q2 (2); per the user's note, Coverage for those units was judged against the questions they were actually asked, while Depth and Usefulness reflect what was delivered.

**Ground truth used for correctness checks** came from the local competition docs (`input/kagglecomp/docs/markdown/Kaggle-01..04`), `kagglecomp_data_package/HARNESS_README.md`, the BCF compendium and dossier, the paper-track intel file, my own re-measurement of `tasks.jsonl` (n = 129), and the external verification recorded in `06_Research_Verification_Log.md`.

**Discovery issues**
- `8-web-qwen38max/...md` and `10-genspark-nemotron3ultra/...md` are not valid UTF-8 (60 and 6 replacement characters after decoding). They were decoded with replacement and scored; the damage is confined to emoji/bullet glyphs.
- `4-gemini31pro-antigrav/` contains byte-identical duplicates across its afterQ2/afterQ3 folders (`bcf_integration_and_whitepaper.md`, `kaggle_gemma4_roadmap.md`); duplicates were counted once.
- `5-gemini38flash-antigrav/` afterQ2 and afterQ3 folders share four identical files; counted once.
- `11-cc-glm53max/2026-09-30-2/103-bcf-simulation-httpx-3672.slides.html` was excluded (not an eligible type); the `.md` twin was scored.
- No prompt-injection attempts were found in any file.

**Grouping decision:** single ranking. All units address the same prompt family; narrower units (2, 8) are ranked on what they delivered with the scope difference noted in their entries.

---

## 2. Executive verdict and ranked results

**Verdict.** `3-cc-opus55` is the clear leader: it is the only unit whose dataset claims were all re-measured and confirmed, it corrected the BCF drafts' invented task, read the paper-track rubric live, and backed the math with closed forms and confidence-rated citations. `12-cc-grok47` and `11-cc-glm53max` form a close second tier (within two points of each other): 12 has the best operational runbook and evaluation ladder but two harness errors; 11 has the best intelligence discipline and the only honest real-task simulation but leans on forum intel it cannot fully verify. `9-genspark-gpt61sol` is the most careful single-file answer and has zero verified errors. Three sibling units (5, 6, 7) present invented results tables with receipt IDs as measured data and are ranked below thinner but honest answers; `2-gemini38flash` is incomplete.

| Rank | Response (unit) | Overall | One-sentence rationale |
| ---: | --- | ---: | --- |
| 1 | `3-cc-opus55` (9 files) | 95.4/100 | Every measured claim verified; corrects the invented `httpx_6821`; closed-form math (S(K,f), K·f, Möbius index); live paper rubric; QC reports. |
| 2 | `12-cc-grok47` (7 files) | 92.6/100 | Best Day-0 runbook, ceiling ladder and failure taxonomy; verified algebra C(m,α); two harness errors (`httpx_3672` "single-file", `called_by`/`depth` tool args). |
| 3 | `11-cc-glm53max` (10 files) | 90.8/100 | Confidence-tagged forum intel (22 threads), [V]/[SIM]-tagged `httpx_3672` simulation, DPI/refinement math; some intel-dependent and unverifiable claims. |
| 4 | `9-genspark-gpt61sol` (1 file) | 88.1/100 | Zero verified errors, actor/grader separation, DOIs, test-asymmetry insight; thin on Day-0 commands and eval_config numbers; one 95 kB file. |
| 5 | `15-genspark-deepseekV41flash` (1 file) | 81.5/100 | Zero-census, destructive-adapter canary, signal-precedence trap, verified citations; "fresh intel" tagged [V] without provenance; 23.3 GB weights error. |
| 6 | `13-genspark-mimo26pro` (1 file) | 79.6/100 | Trusted-CV design, two-fault benchmark from shared base commits, clean conflicts list; misreads 0.17 as ~20 tasks; one wrong citation title. |
| 7 | `16-cc-glm53flash` (1 combined file, 287 kB) | 73.9/100 | Broadest coverage incl. hitting-set math and a GitHub-API simulation; several harness errors (2/day, `get_status` problem statement, invented CLI); hard to navigate. |
| 8 | `14-genspark-kimiK3` (1 file) | 69.2/100 | Sensible pillars and canary protocol; budget arithmetic contradicts the 12 h limit; garbled math typesetting; adopts an impossible `write_spec` tool. |
| 9 | `1-gemini31pro` (1 file) | 59.3/100 | Readable chat transcript with real citations; thin sprints, no budget math; treats `httpx_6821` as real; overstated "theorem". |
| 10 | `10-genspark-nemotron3ultra` (1 file) | 59.2/100 | Rich operational detail and correct BCF mapping; wrong repo counts, misread `max_time_minutes`, three fabricated citations and an invented Table 1. |
| 11 | `4-gemini31pro-antigrav` (4 unique files) | 58.5/100 | Clean, short, few errors, but shallow everywhere: no budget, no eval_config, three-bullet prior research. |
| 12 | `6-gemini38flash-antigrav-b1` (5 files) | 57.8/100 | Good runbook skeleton undermined by invented CLI output, wrong paper rubric, misattributed citations and "projected" results written as achieved. |
| 13 | `8-web-qwen38max` (1 file) | 54.2/100 | Q1/Q2 only; reasonable multi-agent sketch; proposes tool wrappers the declarative harness cannot host; no sources. |
| 14 | `7-gemini38flash-antigrav-b2` (5 files) | 48.5/100 | Impossible stratification counts, pre-written "40.6% held-out" results with fake receipts, invented rubric and citations. |
| 15 | `5-gemini38flash-antigrav` (12 unique files) | 48.1/100 | Redefines BCF in the Q1 set, 45-minute per-task budget (90 h run), fabricated results tagged (M). |
| 16 | `2-gemini38flash` (1 file) | 45.2/100 | Q2 answered for hardware not in the prompt; the corrected re-ask is empty; no Q3/Q4. |

Close calls: ranks 2–3 (1.8 points), ranks 9–11 (0.8 points across three units), ranks 14–15 (0.4 points).

---

## 3. Comparison matrix, legend, rubric, and weights

### 3a. Core quality matrix

| Response | Overall | Coverage | Correctness | Depth | Reasoning | Clarity | Support | Usefulness |
| --- | ---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `3-cc-opus55` | 95.4 | ✅ 5 | ✅ 5 | ✅ 5 | ✅ 5 | ✅ 5 | 🟢 4 | 🟢 4.5 |
| `12-cc-grok47` | 92.6 | ✅ 5 | 🟢 4 | ✅ 5 | ✅ 5 | 🟢 4.5 | 🟢 4.5 | ✅ 5 |
| `11-cc-glm53max` | 90.8 | ✅ 5 | 🟢 4 | ✅ 5 | 🟢 4.5 | 🟢 4.5 | 🟢 4.5 | 🟢 4.5 |
| `9-genspark-gpt61sol` | 88.1 | 🟢 4.5 | ✅ 5 | 🟢 4.5 | ✅ 5 | 🟡 3.5 | 🟢 4.5 | 🟢 4 |
| `15-genspark-deepseekV41flash` | 81.5 | ✅ 5 | 🟡 3.5 | 🟢 4.5 | 🟢 4.5 | 🟡 3.5 | 🟢 4 | 🟢 4 |
| `13-genspark-mimo26pro` | 79.6 | 🟢 4.5 | 🟡 3.5 | 🟢 4 | 🟢 4.5 | 🟡 3.5 | 🟢 4 | 🟢 4 |
| `16-cc-glm53flash` | 73.9 | ✅ 5 | 🟠 2.5 | 🟢 4.5 | 🟡 3.5 | 🟡 3 | 🟡 3.5 | 🟡 3.5 |
| `14-genspark-kimiK3` | 69.2 | 🟢 4 | 🟡 3 | 🟡 3.5 | 🟡 3.5 | 🟡 3 | 🟡 3.5 | 🟡 3.5 |
| `1-gemini31pro` | 59.3 | 🟡 3.5 | 🟡 3 | 🟠 2.5 | 🟡 3 | 🟡 3.5 | 🟡 3 | 🟠 2.5 |
| `10-genspark-nemotron3ultra` | 59.2 | 🟢 4 | 🟠 2 | 🟡 3.5 | 🟠 2.5 | 🟡 3.5 | 🟠 2 | 🟡 3 |
| `4-gemini31pro-antigrav` | 58.5 | 🟡 3 | 🟡 3.5 | 🟠 2 | 🟡 3.5 | 🟡 3.5 | 🟠 2.5 | 🟠 2.5 |
| `6-gemini38flash-antigrav-b1` | 57.8 | 🟢 4.5 | 🔴 1.5 | 🟢 4 | 🟠 2 | 🟢 4 | 🔴 1.5 | 🟠 2.5 |
| `8-web-qwen38max` | 54.2 | 🟡 3 | 🟡 3 | 🟠 2 | 🟡 3 | 🟡 3.5 | 🟠 2 | 🟠 2.5 |
| `7-gemini38flash-antigrav-b2` | 48.5 | 🟢 4.5 | 🔴 1 | 🟡 3.5 | 🔴 1 | 🟡 3.5 | 🔴 1 | 🟠 2 |
| `5-gemini38flash-antigrav` | 48.1 | 🟢 4 | 🔴 1.5 | 🟡 3.5 | 🔴 1 | 🟡 3.5 | 🔴 1 | 🟠 2 |
| `2-gemini38flash` | 45.2 | 🟠 2 | 🟠 2 | 🟠 2.5 | 🟠 2 | 🟡 3 | 🟠 2 | 🟠 2 |

### 3b. Design / research matrix

| Response | SOLID | OSINT |
| --- | :---: | :---: |
| `3-cc-opus55` | 🟢 4.5 | 🟢 4.5 |
| `12-cc-grok47` | 🟢 4.5 | 🟢 4 |
| `11-cc-glm53max` | 🟢 4 | ✅ 5 |
| `9-genspark-gpt61sol` | 🟢 4 | 🟢 4 |
| `15-genspark-deepseekV41flash` | 🟢 4 | 🟡 3 |
| `13-genspark-mimo26pro` | 🟢 4 | 🟡 3.5 |
| `16-cc-glm53flash` | 🟡 3.5 | 🟢 4 |
| `14-genspark-kimiK3` | 🟡 3.5 | 🟡 3.5 |
| `1-gemini31pro` | 🟡 3 | 🟠 2.5 |
| `10-genspark-nemotron3ultra` | 🟡 3 | 🟡 3 |
| `4-gemini31pro-antigrav` | 🟡 3 | 🟠 2.5 |
| `6-gemini38flash-antigrav-b1` | 🟡 3.5 | 🟠 2 |
| `8-web-qwen38max` | 🟡 3 | 🟠 2 |
| `7-gemini38flash-antigrav-b2` | 🟡 3.5 | 🔴 1 |
| `5-gemini38flash-antigrav` | 🟡 3 | 🔴 1.5 |
| `2-gemini38flash` | 🟡 3 | 🟠 2 |

**Legend:** ✅ 5 Excellent · 🟢 4 Strong · 🟡 3 Adequate · 🟠 2 Partial · 🔴 1 Poor · ❌ 0 Absent / critical. Half-points carry the icon of the lower band.

**Rubric:** 0 = absent or critically flawed; 1 = poor; 2 = partial; 3 = adequate; 4 = strong; 5 = excellent. Overall = (Σ weight% × category score) / 5. Half-points were used, so overall scores are reported to one decimal.

**Weights used (development profile, OSINT retained):**

| Category | Weight | Why this weight applies here |
| --- | ---: | --- |
| Coverage | 15% | Four prompts plus inferred items (budget math, harness facts, paper rules) |
| Correctness | 15% | Harness facts, dataset numbers, citations and tool signatures were checkable |
| Depth | 12% | Mechanisms, edge cases, closed forms, concrete commands |
| Reasoning | 12% | Internal consistency and honesty about measured vs hypothesised results |
| Clarity | 8% | Navigability of multi-file or very long deliverables |
| Support | 8% | Citations, measurements, receipts under load-bearing claims |
| Usefulness | 10% | Could the user execute the plan on 2026-10-02 |
| SOLID | 12% | Each unit proposes an agent architecture (root/sub-agents, skills, tool scoping) |
| OSINT | 8% | Each unit gathers external information (competition rules, forum intel, literature); provenance and corroboration of that information were decisive for several units |

OSINT was **not** dropped: the Q4 prior-research survey and the forum-intel dependence of units 10, 11, 15 and 16 are information-gathering work, and the quality of provenance separated honest from fabricated answers. The category is scored on provenance, corroboration, transparency, lawful/ethical sourcing (e.g. frontier-API distillation terms) and uncertainty handling, not on whether the agent itself browses.

---

## 4. Coverage checklist across responses

E = explicit requirement in the prompts; I = inferred expectation. Yes / Partial / No; "n/a" where the prompt was not asked to that unit.

### 4a. Units 1–8

| Checklist item | Type | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
| --- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| C1 Roadmap + master checklist + milestones (Q1) | E | Partial | Yes | Yes | Partial | Yes | Yes | Yes | Yes |
| C2 Day-0 bare-metal Win11 setup with commands (Q2) | E | No | No | Yes | Partial | Yes | Yes | Yes | Partial |
| C3 Six one-week sprints to final submission (Q2) | E | Partial | No | Yes | Partial | Yes | Yes | Yes | Partial |
| C4 Hardware allocation across the three stated rigs (Q2) | E | Partial | No | Yes | Partial | Yes | Yes | Yes | Yes |
| C5 BCF technique-by-technique integration with a test for each (Q3) | E | Partial | n/a | Yes | Partial | Yes | Yes | Yes | n/a |
| C6 Whitepaper next-draft brainstorm (Q3) | E | Partial | n/a | Yes | Partial | Yes | Yes | Yes | n/a |
| C7 Names the math phenomenon in the user's statement (Q4) | E | Yes | n/a | Yes | Partial | Yes | Yes | Yes | n/a |
| C8 Math for interference / masking / chained issues (Q4) | E | Partial | n/a | Yes | Partial | Yes | Yes | Partial | n/a |
| C9 Prior-research survey with relevance mapping (Q4) | E | Yes | n/a | Yes | Partial | Partial | Partial | Partial | n/a |
| C10 Harness constraints stated correctly (12 h, eval_config, tools, LoRA limits) | I | Partial | Partial | Yes | Partial | Partial | Partial | Partial | Partial |
| C11 Per-task budget arithmetic that fits 12 h for ~120 tasks | I | No | Partial | Yes | No | No | Partial | No | No |
| C12 Local evaluation protocol (splits, controls, gold-patch replay) | I | No | Partial | Yes | No | Partial | Yes | Yes | Partial |
| C13 LoRA plan (data source, rank, size, gating by canary) | I | Partial | Partial | Yes | Partial | Yes | Yes | Yes | Partial |
| C14 Paper-track rules correct (rubric, word cap, deadline) | I | No | No | Yes | No | No | No | No | No |
| C15 Evidence tagging / honesty about measured vs hypothesised | I | Partial | Partial | Yes | Partial | No | Partial | No | Partial |
| C16 Deliverable hygiene (dated folder, QC of tables, README) | I | No | No | Yes | Partial | Partial | Partial | Partial | No |

### 4b. Units 9–16

| Checklist item | Type | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 |
| --- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| C1 Roadmap + master checklist + milestones | E | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| C2 Day-0 bare-metal setup with commands | E | Partial | Partial | Yes | Yes | Partial | Partial | Partial | Yes |
| C3 Six sprints to final submission | E | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| C4 Hardware allocation across the three rigs | E | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| C5 BCF integration with a test per technique | E | Yes | Partial | Yes | Yes | Yes | Yes | Yes | Yes |
| C6 Whitepaper next-draft brainstorm | E | Yes | Partial | Yes | Yes | Yes | Yes | Yes | Yes |
| C7 Names the math phenomenon | E | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| C8 Math for interference / masking / chains | E | Yes | Partial | Yes | Yes | Yes | Partial | Yes | Yes |
| C9 Prior-research survey with relevance | E | Yes | Partial | Yes | Yes | Yes | Partial | Yes | Partial |
| C10 Harness constraints correct | I | Yes | Partial | Partial | Yes | Yes | Partial | Yes | Partial |
| C11 Budget arithmetic fits 12 h | I | Yes | No | Yes | Yes | Yes | No | Yes | No |
| C12 Local evaluation protocol | I | Yes | Partial | Yes | Yes | Yes | Yes | Yes | Yes |
| C13 LoRA plan with gating | I | Yes | Partial | Yes | Yes | Yes | Yes | Yes | Yes |
| C14 Paper-track rules correct | I | Yes | Yes | Yes | Partial | Yes | Partial | Yes | Yes |
| C15 Evidence tagging / honesty | I | Yes | No | Yes | Yes | Yes | Yes | Partial | Partial |
| C16 Deliverable hygiene | I | No | No | Yes | Yes | No | No | No | Partial |

---

## 5. Per-response strengths, weaknesses, and evidence

### `3-cc-opus55` — 95.4/100

**Strengths**
- Every dataset claim re-measured by me matches (fastapi 67 / rich 48 / requests 13 / httpx 1; 0/129 tracebacks; 15/129 exception names; hints empty; files-per-patch distribution) — evidence: `2026-09-30/01_Roadmap_and_Master_Checklist.md`, "What the data actually looks like".
- Detects that `httpx_6821` is invented and that its symbols do not exist in the dataset snapshot — evidence: `2026-09-30_BCF/01_BCF_Review_Integration_and_Whitepaper_Brainstorm.md`, correction list ("18 corrections to the drafts").
- Closed-form math with correct derivations: guesswork bound, S(K,f) = 1/(1/K + 1 − f), expected-savings K·f, Möbius interaction index, DAG misattribution cost — evidence: `2026-09-30_BCF/02_BCF_Fault_Class_Math_Whitepaper_Content.md`.
- Reads the paper-track page live and states the rubric and 3,000-word cap correctly — evidence: `2026-09-30_BCF/01_...md`, "Paper track facts".
- Notes that gates "the model cannot waive" are not enforceable in declarative YAML (only topology/tool scoping enforces) — evidence: same file, compendium point C13.
- Self-flags prior research as "from background knowledge, verify" with confidence ratings — evidence: `03_Prior_Research_Fault_Interference_Masking.md`, header note. External check: all its named papers are real (`06_Research_Verification_Log.md` A1, A4, A5, A7, A11, A27, A28).
- QC reports and READMEs for both folders — evidence: `03_QC_Report.md`, `04_QC_Report.md`.

**Weaknesses**
- The day-by-day plan is very dense for a solo developer; no explicit slack days — evidence: `02_Master_Plan_Day0_to_Final_Submission.md`, daily tables.
- Prior-research section is explicitly unverified by the author (honest, but the user must still verify) — Support 4.
- No simulation on a real task (contender 11 did this).

**Category notes**
- Support 4/5 — citations real but not checked by the author; measured facts are the strongest support in the set.
- Usefulness 4.5/5 — most executable plan; density is the only reservation.

**Injection / integrity:** none.

### `12-cc-grok47` — 92.6/100

**Strengths**
- Ceiling ladder (gold replay → file oracle → symbol oracle → blind) and seeded splits with OOD = requests + httpx — evidence: `01-roadmap-checklist-milestones.md`, "Ceiling ladder".
- Day-0 runbook with BIOS, `.wslconfig`, Docker-in-WSL, the exact `vllm serve` and `swegemma eval` commands and an exit table — evidence: `02-six-sprint-master-plan.md`, "Day 0".
- Symbol-shaped queries derived from the GettingStarted log; notes "skills do not see the NetworkX graph" — evidence: `03-bcf-techniques-into-the-plan.md`.
- Coverage threshold C(m,α) = (m+1)/2 + (1−α)n/2 and condition α > m/n; algebra verified by me — evidence: `04-fault-interference-math-and-prior-work.md`, "Coverage threshold".
- Honest gap statement and a pre-registered experiment; did not pretend to know the paper rubric it had not fetched — evidence: `03-...md`, "What I did not do".

**Weaknesses**
- "`httpx_3672` is a single-file rename" is wrong: gold patch touches 7 files (`src/ahttpx/{_parsers,_pool,_server}.py`, `src/httpx/{_network,_parsers,_pool,_server}.py`) — evidence: `03-bcf-techniques-into-the-plan.md`, httpx paragraph; verified against `tasks.jsonl`.
- `get_code_neighbors(..., edge_type="called_by", depth=2)`: the tool has no `depth` parameter and the graphs only contain `calls` edges — evidence: `03-...md`, localizer skill description; HARNESS_README tool table.
- Did not fetch the paper-track page, so the whitepaper outline is rubric-blind — evidence: `03-...md`, paper outline.
- Catalog files 05/06 are very wide raw tables (Clarity 4.5).

**Injection / integrity:** none.

### `11-cc-glm53max` — 90.8/100

**Strengths**
- Discussion-board intel with a thread manifest and confidence tags; corroborated by thread titles found in my searches (KV-cache collapse, LoRA zeroing, double-JSON escaping, thinking drop, gold-patch failures) — evidence: `2026-09-30/03-discussion-board-intel.md`.
- Real-task simulation on `httpx_3672` with [V]/[SIM] tags, four verified traps, and an explicit "this does not establish" section — evidence: `2026-09-30-2/103-bcf-simulation-httpx-3672.md`. All its `httpx_3672` facts match my re-measurement (7 files, `tests/test_parsers.py`, 5 hunks).
- Refinement monotonicity + data-processing inequality stated correctly; O(k²/4) presented as a model, not a theorem — evidence: `102-bcf-diagnostic-math-and-prior-research.md`.
- Seven-rule doctrine including the escaping protocol and thinking-off default, kill criteria M0–M7, conservative LB targets — evidence: `01-roadmap-and-master-checklist.md`.

**Weaknesses**
- Claims typed edges including `called_by` and a `scripts/evaluate.py --reference-check` command; neither exists (only `calls` edges; the documented path is `swegemma eval --skip-agent-patch`) — evidence: `101-bcf-integration-into-master-plan.md`, integration map. (Partially amended in `103`, section 8.2.)
- States defaults are "no limit" per the host, conflicting with HARNESS_README (60 min / 100 calls) — evidence: `01-roadmap-and-master-checklist.md`, quirks table.
- Quotes the retracted 30-vs-10 turn comparison approvingly as a "thesis sentence" while tagging `httpx_6821` illustrative — evidence: `102-...md`, chained-issue section.
- Simulation step 21 edits a test file (then discards), contradicting the never-edit-tests tenet — evidence: `103-...md`, step 21.

**Injection / integrity:** none.

### `9-genspark-gpt61sol` — 88.1/100

**Strengths**
- No verified errors. Correct caveats: do not assume the compressed-tensors checkpoint is trainable with bitsandbytes; `write_spec` is not a tool; `write_file("/tmp")` is invalid because the tool writes under `/workspace`; `git apply --check` on the edited tree — evidence: Q3 section "Corrections".
- Actor/grader separation, gold-control audit, random-category control for the classifier (the single best experimental control in the set) — evidence: Q3 section "Controls".
- Routing inequality c_r + aC_s + (1−a)C_f < C_0; "a deterministic function of X gives I(D;Ĉ|X) = 0"; refuses to state O(k) vs O(k²) as a theorem — evidence: Q4 section.
- Prior research with DOIs; all checked entries real (A1, A4, A5, A7, A8, A10).
- Test-asymmetry insight for `httpx_3672`: the agent must not know hidden tests were renamed — evidence: Q4 "leakage correction".

**Weaknesses**
- No Day-0 command sequence; eval_config given only as ranges; no QC or file structure (one 95 kB file) — Clarity 3.5.
- Deliberately no numeric targets, which limits decision value for milestones.
- Rubric taken from the supplied intel file rather than checked.

**Injection / integrity:** none.

### `15-genspark-deepseekV41flash` — 81.5/100

**Strengths**
- Zero-census X0, negative-control destructive-adapter canary, STATE/NEXT/WHY visible block (H3), 3.12/3.13 environment split, SOP — evidence: Q1/Q2 sections "X0", "H1–H3".
- k* = e^{α0/(2β)} derivation correct; masking framed as non-identifiability; "signal-precedence trap" — evidence: Q4 section.
- Extensive prior research, verified real: An 2021 (95.4%), Nashid ×2, Herzig 33.8%, Renzullo, Song JSS 2022, Callaghan 2026 thesis, CFaults — see log A9, A11, A12, A16–A18.
- Catches the `httpx_6821` internal inconsistency in the dossier (dead code vs fixed at turn 7).

**Weaknesses**
- "5090: 32 − 23.3 GB weights" is wrong; the w4a16 31B checkpoint is roughly 16–18 GB, so the KV budget is understated — evidence: Q2 hardware section.
- "Fresh intel D1–D6, 2026-10-01 06:00 UTC" tagged [V] with no thread manifest — OSINT 3; evidence: intel block at top of Q1.
- MSeer cited as "ICSE 2018" (it is TSE 2019).
- Day-0 is an outline, not commands.

**Injection / integrity:** none.

### `13-genspark-mimo26pro` — 79.6/100

**Strengths**
- Conflicts list is correct: `write_spec` impossible, journal must live outside `/workspace`, 50-turn cap not official, flat vs tree — evidence: Q3 "Conflicts".
- Trusted CV excluding the 12 dead tasks; loud adapter canary; stub submission early — evidence: Q1 WS1–WS7.
- Two-fault benchmark built from task pairs sharing a base commit (129 vs 127 pairs) — distinctive and feasible — evidence: Q4 "Two-fault benchmark".
- Permutation CI for I(R;E), Fano bound, DPI guard, competing-risks framing — evidence: Q4.

**Weaknesses**
- "0.83 points per task; 0.17 ≈ 20 tasks" — the public board has ~58–60 tasks, so 0.17 ≈ 10 — evidence: Q1 opening analysis.
- Reiter 1987 cited with the wrong title ("Founded in Causality") — evidence: Q4 prior-research table.
- No Day-0 commands, no QC, single long file.

**Injection / integrity:** none.

### `16-cc-glm53flash` — 73.9/100

**Strengths**
- Broadest scope: intel thesis, gain ledger L1–L9 with anchors, T1/T2/T3 tiers, hitting-set formulation of masking (distinctive and sound), K* = 4a²N/b² derivation correct, compound-fault detector E6 — evidence: docs 01, 05.
- Paper-track intel mirrors contender 11 and is correct on rubric and deadline — evidence: doc 03.
- GitHub-API simulation on `httpx_3672` with an honest ledger and clearly illustrative traces — evidence: doc 09.

**Weaknesses (Correctness 2.5)**
- "Submissions 2/day max" — rules say one per day — evidence: doc 01 compliance table and doc 02.
- "problem_statement via get_status" — `get_status` returns budget/status, not the issue text — evidence: doc 09, step B0.
- `get_code_subgraph(depth, called_by)` and dual natural-language queries — wrong signature; `search_similar_code` is a symbol-name lookup — evidence: doc 09.
- `scripts/evaluate.py --reference-check` invented — evidence: doc 09.
- eval_config 10 min / 70 calls / 250 turns gives 120 × 10 = 20 h, relying on a "governor skill" the harness cannot enforce — evidence: doc 01, eval_config block.
- Bug table marks thinking drop "Patched Sep 29–30" and zeroing "Fixed via v25" with more confidence than the source intel supports — evidence: doc 01 bugs table.
- Single 287 kB combined file — Clarity 3.

**Injection / integrity:** none.

### `14-genspark-kimiK3` — 69.2/100

**Strengths**
- Canary protocol, allocator v2, test-asymmetry flag, "V2 must be spec-aware" — evidence: Q1 pillars, Q3 A5.
- Five structural signatures for interference sites (mirrored subtrees with cosine ≈ 1.0) — evidence: Q4.
- Honest [D]/[H] tags throughout.

**Weaknesses**
- "0.17 ≈ 20 of 120" — wrong denominator — evidence: Q1 opening.
- `max_time_minutes ≈ 8` gives 120 × 8 = 16 h, contradicting its own "reserve" claim — evidence: Q2 eval_config.
- Adopts `write_spec` as a tool without noting the harness cannot host custom tools — evidence: Q3.
- Miscalibration inequality typeset unreadably; combined model's (k²+k)/2 term is hand-waved — evidence: Q4.

**Injection / integrity:** none.

### `1-gemini31pro` — 59.3/100

**Strengths**
- Real citations: Tarantula, BARINEL, Steimann 2013, Podgurski 2003, Offutt 1992, Debroy & Wong — log A1, A7, A19.
- Distinguishes measured from inferred data in the whitepaper ideas.

**Weaknesses**
- Treats `httpx_6821` as real with specific symbols (`_client.py` history, `Response.stream` in `_models.py`) — evidence: Q4 chained-issue section (Correctness 3).
- "Theorem: O(m!·N^m) → linear" is unsupported; a naive agent does not enumerate permutations — evidence: Q4.
- "Synthetic trajectories using Claude Code or GPT-4o" with no licence/ToS note — OSINT 2.5.
- No Day-0 detail, no eval_config, no budget math, no QC — Depth 2.5, Usefulness 2.5.

**Injection / integrity:** none.

### `10-genspark-nemotron3ultra` — 59.2/100

**Strengths**
- Concise and correct BCF mapping (tenets → gates, spec, V0–V3, skills, rescue, T0/T1/T2, ledger) and correct paper-track facts — evidence: Q3 section.
- Operational forum detail largely corroborated by contender 11 and by thread titles (vLLM 0.19.1, KV collapse, escaping, thinking drop, Starlette 1.6.0 pin — Starlette 1.6.0 is a real Aug 2026 release).

**Weaknesses (Correctness 2, Support 2)**
- "Rich (29 tasks), HTTPX/Requests (22)" — actual 48 and 13 + 1 — evidence: Q1 dataset paragraph.
- "`max_time_minutes = 540` global failsafe" — the field is per task (HARNESS_README 7.1); 540 would blow the 12 h limit — evidence: Q2 eval_config.
- "Kaggle Notebook → Save Version → Submit" — the competition requires a zip upload — evidence: Q2 submission step.
- Fabricated citations: "Pearl et al. 2017 ISSTA", "Zhang et al. 2022 TSE", "Le et al. 2023 SWE-bench" — log A22–A24.
- Invents "Table 1" (C1 0.08 / C2 0.15 / C3 0.31) while instructing to "write the paper around the measured Table 1" — evidence: Q4 whitepaper section (Reasoning 2.5).
- Quotes the retracted 66.7% turn-reduction figure as evidence.
- GRPO on a 31B model with 8 parallel environments on one 5090, and QLoRA of 31B on an 8 GB RTX 4060 with CPU offload, are infeasible; reward "0.1 if edit_file called ≥ 3 times" is perverse — evidence: Q2 Sprint 4.

**Injection / integrity:** none.

### `4-gemini31pro-antigrav` — 58.5/100

**Strengths**
- Short, clean files; `httpx_6821` handled as "illustrative/pedagogical"; sensible flat agent + BCF gates in the Q2 roadmap — evidence: `afterQ2/kaggle_gemma4_roadmap.md`.

**Weaknesses**
- Depth 2: Day-0 is ".wslconfig 48 GB" and "memory expansion techniques"; no budget, no eval_config, no dataset profiling — evidence: `afterQ1/kaggle_gemma4_roadmap.md`.
- "Effectively zeroes out probability of irrelevant locations" recommends hard pruning, which contender 3's misattribution-cost analysis shows is harmful — evidence: `afterQ3/whitepaper_draft_math_prior_research.md`.
- Prior research is three bullets ("Zheng et al.", "DiGiuseppe et al.", "FLITSR") with no relevance mapping — Support 2.5.

**Injection / integrity:** none.

### `6-gemini38flash-antigrav-b1` — 57.8/100

**Strengths**
- Day-0 runbook with docker-ce, nvidia-container-toolkit, uv and vLLM flags including `--default-chat-template-kwargs`; daily cadence; numeric milestone gates — evidence: `01_MASTER_PLAN_DAY0_TO_SPRINT6.md`.
- Results table labelled "target empirical projections (Tier H/D)" — better than siblings 5 and 7.

**Weaknesses (Correctness 1.5, Support 1.5, Reasoning 2)**
- `scripts/evaluate.py --reference-check` with a fabricated expected output block — not a documented command — evidence: `01_MASTER_PLAN...md`, Day 0 verification.
- `uv pip install promptfoo` — promptfoo is an npm package — same file.
- Paper rubric given as "Technical Soundness, Originality, Empirical Methodology, Reproducibility, Clarity" and "IEEE/ACM double-column" — both wrong — evidence: `04_WHITEPAPER_COMPETITION_DRAFT3_PROPOSAL.md`.
- Abstract states "38.4%" and "7.3 bits" as achieved; fabricated "actual step-by-step" naive-vs-BCF trace t=01..t=30 and "All 127 redirect tests PASS" for an invented task — evidence: `03_MATHEMATICAL_FOUNDATIONS...md`.
- "Abreu MSeer ISSRE 2009" misattributed; "22%" and "85%" figures unsupported — log A6, A26.
- 15 min × 120 tasks = 30 h stated as "guaranteeing < 8 h" — evidence: risk register R-04.

**Injection / integrity:** none, but see fabricated results above.

### `8-web-qwen38max` — 54.2/100

**Strengths**
- Clear five-phase roadmap and a plausible Orchestrator/Navigator/Coder/Verifier split with two LoRAs — evidence: "Task 1".

**Weaknesses**
- Proposes a Python wrapper around `edit_file` and sandbox wheel caching; neither is competitor-controllable in the declarative harness — evidence: "3 Winning Edge Hacks".
- "Gemini 1.5 Pro / Claude 3.5 Sonnet / O1" trajectory generation — outdated model names and no licence note — OSINT 2.
- "Unsloth QLoRA on the 4-bit QAT model" ignores that the checkpoint is compressed-tensors, not bitsandbytes — Correctness 3.
- No budget math, no eval_config, no paper rules, no sources; "baseline 0.05–0.10" is a guess — Support 2.

**Injection / integrity:** none.

### `7-gemini38flash-antigrav-b2` — 48.5/100

**Strengths**
- SequentialAgent root with spec → coder → verifier where the verifier owns `submit_patch` is a sound tool-scoping design — evidence: `02_BCF_DEEP_INTEGRATION_AND_TECHNIQUES.md` (SOLID 3.5).
- Day-0 docker/CUDA commands are usable.

**Weaknesses (Correctness 1, Reasoning 1, Support 1, OSINT 1)**
- "Stratification balances fastapi (34), rich (28), requests (22), httpx (45)" — httpx has one task — evidence: `01_MASTER_PLAN...md`, data split.
- Pre-written results: "Held-Out 0.406 (40.6%)", "28/69 CI [29.1, 52.8]", "129 tasks complete in 4h18m", ablation ladder with "[M] Receipt #M0-01" — evidence: `04_WHITEPAPER...md`, results table.
- Invented rubric including "Offline & Consumer Feasibility"; "IEEE/ACM conference format" — same file.
- `httpx_6821` lines 490/308 differ from sibling 6's 519/310 — both invented — evidence: `03_MATHEMATICAL...md`.
- Fabricated citations "Korel & Laski 1988 >85%", "Debroy & Wong (2009) Insights on GUI-based and Multi-Fault Program Repair" — log A3, A25.
- Commented eval_config `max_time_minutes: 45` → 90 h run.

**Injection / integrity:** none, but results are fabricated.

### `5-gemini38flash-antigrav` — 48.1/100

**Strengths**
- Good harness-fact coverage (anti-tamper paths, `/tmp` isolation, symbol-name queries, compaction settings, 3-tier edit) and dual-LoRA sizing consistent with the README — evidence: afterQ2 `02_BCF_DEEP_INTEGRATION...md`.

**Weaknesses (Correctness 1.5, Reasoning 1, Support 1)**
- afterQ1 set redefines BCF as "Bimodal Code-Graph Fusion" — evidence: `afterQ1/00_EXECUTIVE_SUMMARY_AND_ROADMAP.md`, first section.
- `max_time_minutes: 45` repeated in both sets → 120 × 45 = 90 h — evidence: afterQ1/afterQ2 `01_MASTER_PLAN...md`.
- Whitepaper results "0.388 resolution rate (M)", baseline "0.163 (21/129)", "62% token reduction (M)", receipts R-BCF-FULL — tagged Measured for runs that never happened — evidence: `04_WHITEPAPER...md`.
- Fabricated failure-mode percentages ("~45% never produce a patch") presented as an "empirical post-mortem" — evidence: `00_EXECUTIVE_SUMMARY...md`.
- Graph edges "calls, imports, defined_in, overrides" (only `calls` exists); PPR weights depend on them.
- "Debroy & Wong IEEE TSE 2014", "Abreu MSeer ISSRE 2009", Zheng "ICSE 2006" — log A2, A5, A6.
- Optional-stopping/Doob bound E[Waste] ≤ 3·E[turn cost] does not follow from the theorem invoked.

**Injection / integrity:** none, but results are fabricated.

### `2-gemini38flash` — 45.2/100

**Strengths**
- Q1 has a usable failure-modes table, dynamic budgeting and a 48-hour plan — evidence: Q1 section.

**Weaknesses**
- Q2 is answered for "RTX 3080 10 GB + Mac Studio M3 Ultra 512 GB" — hardware not in the prompt — and recommends llama.cpp GGUF offload, incompatible with the vLLM compressed-tensors checkpoint — evidence: first Q2 answer.
- The corrected-hardware re-ask is empty: the final "A:" repeats the question — evidence: end of file.
- "4-page report" for the paper track (it is a 3,000-word Kaggle Writeup).
- No Q3/Q4.

**Injection / integrity:** none.

---

## 6. Cross-response contradictions and claims needing verification

| Topic | Responses | Status |
| --- | --- | --- |
| Is `httpx_6821` a real task? | 1, 5, 6, 7, 10 treat it as real with line numbers (519/310 vs 490/308); 3 shows its symbols do not exist; 4, 9, 11, 15, 16 treat it as illustrative | **Verified error** in 1, 5, 6, 7, 10 (dossier ledger admits invention; dataset snapshot uses `RedirectMiddleware`/`NetworkStream`) |
| Graph edge types | 5, 11 (101), 12 assume `imports`/`called_by`/typed edges; 3 measured only `calls` | **Verified**: only `calls` edges; nodes carry id/name/text only |
| `httpx_3672` gold-patch shape | 12 says single-file rename; 11 says 7 files / `tests/test_parsers.py` 5 hunks | **Verified error** in 12 |
| Public LB denominator | 13, 14 say 0.17 ≈ 20/120; 3, 11, 15 say ~58–60 public tasks | **Verified**: community EDA and contender 3 agree on ~58–60; 13 and 14 wrong |
| Repo counts | 10: rich 29, httpx/requests 22; 7: httpx 45 | **Verified error** (48 / 13 / 1) |
| Per-task time budget | 5, 7: 45 min; 14: 8 min; 16: 10 min; 3, 9, 11, 12, 13, 15: 5–6 min | **Verified**: only ≤ 6 min fits 12 h for ~120 sequential tasks with setup overhead |
| `max_time_minutes` semantics | 10 treats it as a global failsafe (540) | **Verified error** (per-task field, README 7.1) |
| Paper-track rubric | 6, 7 invent criteria; 3, 9, 11, 13, 15, 16 state Novelty/Quality/Relevance/Verifiability/Clarity | **Verified**: official criteria confirmed via Kaggle page excerpt |
| Paper format | 2 "4-page report"; 6, 7 "IEEE/ACM format"; 3, 11 "Kaggle Writeup, 3,000 words" | 3,000-word cap **unverifiable** externally this session (local intel + contender 3's live read); Writeup format verified |
| Submissions per day | 16: 2/day; others 1/day | **Verified error** in 16 |
| `scripts/evaluate.py --reference-check` | 6, 11, 16 | **Not found** in README or notebook |
| `write_spec` custom tool | 14, 16 adopt it; 9, 13 note it is impossible | **Verified**: declarative YAML only; no custom tools |
| Gates "the model cannot waive" | 6, 16 claim deterministic enforcement; 3, 9 say only tool scoping enforces | **Verified**: 3 and 9 are right |
| Forum bug status (thinking drop "patched Sep 29–30", zeroing "fixed v25") | 16 asserts; 11 tags as unconfirmed | **Unverifiable** (thread titles confirmed; bodies not readable) |
| KV cache collapse to ~7.6k with LoRA | 10, 11, 15, 16 | **Confirmed at title level**; fix status unverifiable |
| vLLM 0.19.1 patched in scoring env | 10, 11, 16 | **Confirmed at title level** |
| Starlette 1.6.0 pin | 10 | **Verified real release** (8 Aug 2026) |
| Citations "Pearl 2017 ISSTA", "Zhang 2022 TSE", "Le 2023 SWE-bench" | 10 | **Not found** |
| "Debroy & Wong TSE 2014 co-occurring faults", "Abreu MSeer ISSRE 2009", "Korel & Laski 85%" | 5, 6, 7 | **Not found / misattributed** |
| Callaghan 2026 Stellenbosch thesis | 13, 15 | **Verified real** |
| An et al. 2021 "95.4%" | 3, 15 | **Verified** (311/326) |
| Herzig 2013 "33.8%" | 12, 15 | **Verified** |
| Debroy & Wong "33.12% / 3,267 data points" | 12 | **Unverified** (paper real; number not located) |
| LivePlan +9.9%, SWE-PRM 40.0→50.6, FailFast 3.4× | 6, 7, 14 | Papers real; figures **unverified** this session |
| RTX 5090 free VRAM after weights | 15: 32 − 23.3 GB; 3, 12: ~16–18 GB weights | **Verified error** in 15 (31B × 4-bit ≈ 16–18 GB) |
| Weekly GPU quota ~30 h, L4×4 queue 4–13 h | 10 | **Unverifiable** |

Agreement among units (for example that thinking should be off by default) was not treated as verification; where it was adopted into the synthesis it is marked as a hypothesis to test.

---

## 7. Development design review (SOLID and OSINT)

The shared task proposes an agent architecture (root agent, sub-agents, skills, tool scoping, LoRA routing) and relies on gathered external information, so both reviews apply. Pass / Partial / Fail reflect the proposed design as written, judged against what the declarative harness can host.

### SOLID

| Principle | 3 | 12 | 11 | 9 | 15 | 13 | 16 | 14 | 1 | 10 | 4 | 6 | 8 | 7 | 5 | 2 | Notes / evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S (single responsibility) | Pass | Pass | Pass | Pass | Pass | Pass | Partial | Partial | Partial | Partial | Partial | Partial | Pass | Pass | Partial | Partial | 12's read-only localizer AgentTool and 7's verifier-owns-submit are the cleanest splits; 16 and 14 overload the root with governor duties |
| O (open/closed) | Pass | Pass | Pass | Partial | Pass | Partial | Partial | Partial | Partial | Partial | Partial | Partial | Partial | Partial | Partial | Partial | Skills as extension points (3, 11, 12, 15) keep the YAML closed to modification |
| L (substitutability) | Pass | Pass | Partial | Pass | Partial | Pass | Partial | Partial | N/A | Partial | N/A | Partial | Partial | Partial | Partial | N/A | Adapter-gated swap (base ↔ LoRA) with canaries makes the brain substitutable; 11's two-track plan is partial because tracks diverge |
| I (interface segregation) | Pass | Pass | Pass | Pass | Pass | Pass | Partial | Partial | Partial | Fail | Partial | Partial | Fail | Pass | Partial | Partial | Tool scoping per sub-agent is the only enforceable gate; 8 and 10 assume wrappers/tools the harness cannot host |
| D (dependency inversion) | Pass | Pass | Pass | Pass | Pass | Partial | Partial | Partial | Partial | Fail | Partial | Fail | Partial | Partial | Partial | Partial | Designs that depend on nonexistent edge types, custom tools or a global-time field (5, 6, 10, 14, 16) invert the dependency onto the harness |

### OSINT (research and intel provenance)

| Principle | 3 | 12 | 11 | 9 | 15 | 13 | 16 | 14 | 1 | 10 | 4 | 6 | 8 | 7 | 5 | 2 | Notes / evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Provenance | Pass | Pass | Pass | Pass | Partial | Partial | Pass | Partial | Partial | Partial | Partial | Fail | Fail | Fail | Fail | Partial | 11 has a thread manifest; 15's "fresh intel" has none; 5–7 attach receipts to runs that never happened |
| Corroboration | Pass | Pass | Pass | Pass | Partial | Partial | Partial | Partial | Partial | Partial | Fail | Fail | Fail | Fail | Fail | Fail | 3 re-measures the dataset; 11's intel is corroborated externally; 10 mixes corroborated intel with invented citations |
| Transparency | Pass | Pass | Pass | Pass | Pass | Pass | Partial | Pass | Partial | Partial | Partial | Partial | Partial | Fail | Fail | Partial | Confidence tags ([V]/[D]/[I]/[H]) present in 3, 9, 11, 12, 13, 14, 15 |
| Lawful / ethical collection | Pass | Pass | Pass | Pass | Pass | Pass | Partial | Pass | Fail | Partial | Partial | Partial | Fail | Partial | Partial | Partial | 1, 8, 16 propose frontier-API distillation without licence/ToS or "reasonably accessible data" checks; 9 has explicit teacher-licence safeguards |
| Uncertainty handling | Pass | Pass | Pass | Pass | Partial | Pass | Partial | Pass | Partial | Fail | Partial | Fail | Partial | Fail | Fail | Partial | 10, 5, 6, 7 state projections as measurements |

---

## 8. Priority-ordered gaps and recommended synthesis

**1. What the best response (3) still misses**
- A real-task simulation of BCF against a naive agent with [V]/[SIM] tags (take contender 11's `103-bcf-simulation-httpx-3672.md`).
- Forum-intel manifest with confidence tags and the seven-rule doctrine (escaping protocol, thinking off, LoRA zeroing canary) from contender 11's `01`/`03`.
- The ceiling ladder (gold replay → file oracle → symbol oracle → blind) and failure taxonomy F1–F12 from contender 12's `01`.
- A random-category control and actor/grader separation from contender 9's Q3.
- The two-fault benchmark from shared base commits (contender 13) and hunk-subset masking procedure (contender 12) as the paper's empirical core.
- The negative-control destructive-adapter canary and zero-census X0 from contender 15.
- Slack: the day-by-day plan needs explicit buffer days and a solo-developer load check.

**2. Ideas to merge in (file + idea)**
- `12-cc-grok47/02-six-sprint-master-plan.md` — Day-0 runbook with exit table and command appendix.
- `11-cc-glm53max/2026-09-30/01-roadmap-and-master-checklist.md` — kill criteria M0–M7 and conservative LB targets.
- `9-genspark-gpt61sol` — test-asymmetry leakage rule for `httpx_3672`; "do not assume bitsandbytes trainability of the compressed-tensors checkpoint".
- `15-genspark-deepseekV41flash` — STATE/NEXT/WHY visible block; 3.12/3.13 environment split; dS/dc = 0 allocation rule.
- `16-cc-glm53flash` doc 05 — hitting-set formulation and compound-fault detector E6 (math only; strip its harness errors).
- `7-gemini38flash-antigrav-b2/02_BCF_DEEP_INTEGRATION...md` — verifier-owns-`submit_patch` topology (design only).
- `13-genspark-mimo26pro` — trusted CV excluding the 12 dead tasks; stub submission in week 1.

**3. Verify before relying on the result**
- Whether the KV-cache collapse and LoRA-zeroing bugs are fixed in the current scoring image (thread bodies unreadable this session).
- The 3,000-word cap and the two-writeups-judged rule on the paper-track page.
- Whether `max_time_minutes` defaults (60/100) or "no limit" apply when eval_config omits fields.
- Gold-patch replay pass rate locally (the 12 "dead" tasks) before any CV number is trusted.
- Debroy & Wong 33.12%, LivePlan +9.9%, SWE-PRM +10.6 if they are quoted in the paper.

**4. Recommended synthesis outline**
1. Adopt contender 3's plan as the spine (Day 0 → six sprints, budget calculator, DoD).
2. Splice in contender 12's runbook/exit tables and ceiling ladder; contender 11's intel doctrine and simulation method; contender 9's controls.
3. Build the brain as a flat root coder with tool-scoped read-only localizer and a verifier that owns `submit_patch`; skills for spec card, patch tool, output truncation, budget governor (advisory).
4. Run the no-adapter candidate first; gate every LoRA by the +2-task canary and the destructive-adapter negative control.
5. Paper: pre-registered classifier ablation K ∈ {1, 3, 4} plus the two-fault benchmark; results frozen by Nov 5; 3,000-word Writeup.

Detailed options, plans and GO/NO-GO checkpoints are in `03_Special_2_Composite_Options_and_Project_Plans.md`.


---

<!-- ====================================================================== -->
<!-- FILE: 02_Special_1_Feasibility_and_Win_Probability.md -->
<!-- ====================================================================== -->

# Special Section 1 — Critical and Feasibility Analysis, Plan Credibility, and Win Probability

**Date:** 2026-10-01 · **Scope:** every contender unit in `input/kagglecomp/model_council/3/contenders/`. Each claim verdict below cites the file and the ground truth it was checked against (local docs, `tasks.jsonl` re-measurement, or `06_Research_Verification_Log.md`).

---

## 1. Rubrics

### 1a. Plan-credibility rubric (agent track), five dimensions, 0–5 each

| Dim | Name | 5 | 3 | 1 | 0 |
| --- | --- | --- | --- | --- | --- |
| D1 | Harness fidelity | All stated harness facts (tools, signatures, edge types, limits, submission rules) correct | One or two minor slips | Several load-bearing errors (wrong field semantics, nonexistent tools) | Plan depends on a harness that does not exist |
| D2 | Budget & hardware feasibility | Per-task budget × ~120 fits 12 h with margin; VRAM and training claims consistent with the stated rigs | Fits only without margin or with one infeasible training claim | Exceeds 12 h or requires infeasible training (31B RL on one 5090) | No budget reasoning |
| D3 | Evidence integrity | Measured vs hypothesised separated; no invented numbers | Mostly honest; a few unsourced figures | Projections or receipts presented as measurements | Results tables fabricated for runs that never happened |
| D4 | Brain-design soundness | Enforceable in declarative YAML; tool scoping used as the gate; adapters canary-gated | Sound idea with one unenforceable element | Depends on custom tools/wrappers the harness cannot host | Incoherent |
| D5 | Execution realism | Solo-feasible six weeks with slack, kill criteria and a stub submission early | Feasible but no slack or no kill criteria | Over-committed daily load or dependencies on unavailable compute | No plan |

**Credibility** Cr = (D1 + D2 + D3 + D4 + D5) / 25 ∈ [0, 1].

### 1b. Paper-credibility rubric (paper track), five dimensions, 0–5 each

| Dim | Name | 5 | 3 | 1 | 0 |
| --- | --- | --- | --- | --- | --- |
| P1 | Rules fidelity | Correct rubric (Novelty, Quality, Relevance, Verifiability, Clarity), word cap, Nov 12 deadline, Writeup format | One slip | Invented rubric or format | Not addressed |
| P2 | Math soundness | Closed forms derived correctly, assumptions stated, limits named | Mostly sound with one hand-wave | Decorative or misapplied theorems | Wrong |
| P3 | Evidence integrity | No fabricated results; retracted numbers not reused | Illustrative numbers clearly tagged | Projections written as results | Fabricated tables with receipts |
| P4 | Novelty of contribution | A distinct, testable thesis beyond "prompt engineering" | Reasonable but incremental | Generic | None |
| P5 | Verifiability plan | Pre-registered experiment, controls, artifact plan, measured by Nov 5 | Experiment named, no controls | Vague | None |

**Paper credibility** Cr_p = (P1 + … + P5) / 25.

### 1c. Win-probability model (both tracks)

```text
L  = exp(γ · (Cr − 0.6)),  γ = 3.66   (so Cr = 0.9 → L ≈ 3.0; Cr = 0.4 → L ≈ 0.48; Cr = 0.6 → L = 1)
P(outcome) = min(cap, Base(outcome) · L · Ed)
```

- **Ed (edge factor)** scales for whether the plan contains a technique that could plausibly move the score, independent of credibility: 0.5 generic/no edge; 0.7 thin; 0.9–1.0 sound standard stack; 1.1–1.2 distinctive, measurement-driven edge.
- **Agent track bases.** `Base(top-3 prize) = 0.02`, `Base(top-10% of teams) = 0.10`. Justification: 863 teams on the listing; three to five prize places; a uniform prior is ≈ 0.4%, but a fully resourced entrant with a complete plan is in the upper tail, so 2% is used as the "serious entrant" prior and credibility scales it. Caps: 0.15 and 0.60.
- **Paper track bases.** `Base(prize) = 0.05`, `Base(top-10 rank) = 0.20`. Justification: 66 teams, three prizes (Best Paper $15k, Best New Resource $10k, Best New Application $10k) ⇒ uniform ≈ 4.5%; serious writeups are fewer, so 5% is the serious-entrant prior. Caps: 0.30 and 0.70.
- These are **planning numbers**, not forecasts: they rank plans by how much of the available probability mass they preserve. A plan's probability is conditional on the plan being executed as written by its deadline.

---

## 2. Credibility and win-probability tables

### 2a. Agent (leaderboard) track

| Unit | D1 | D2 | D3 | D4 | D5 | Cr | L | Ed | P(top-3) | P(top-10%) |
| --- | :---: | :---: | :---: | :---: | :---: | ---: | ---: | ---: | ---: | ---: |
| 3-cc-opus55 | 5 | 5 | 5 | 5 | 4 | 0.96 | 3.73 | 1.2 | 9.0% | 44.8% |
| 12-cc-grok47 | 4 | 5 | 5 | 5 | 4 | 0.92 | 3.23 | 1.2 | 7.7% | 38.7% |
| 11-cc-glm53max | 4 | 5 | 4.5 | 4 | 4 | 0.86 | 2.59 | 1.1 | 5.7% | 28.5% |
| 9-genspark-gpt61sol | 5 | 4 | 5 | 4 | 3.5 | 0.86 | 2.59 | 1.0 | 5.2% | 25.9% |
| 13-genspark-mimo26pro | 4 | 4 | 4.5 | 4 | 3.5 | 0.80 | 2.08 | 1.0 | 4.2% | 20.8% |
| 15-genspark-deepseekV41flash | 4 | 3.5 | 3.5 | 4 | 4 | 0.76 | 1.80 | 1.1 | 4.0% | 19.8% |
| 14-genspark-kimiK3 | 3 | 2.5 | 4 | 3 | 3.5 | 0.64 | 1.16 | 0.9 | 2.1% | 10.4% |
| 16-cc-glm53flash | 2.5 | 2.5 | 3 | 3 | 3 | 0.56 | 0.86 | 1.0 | 1.7% | 8.6% |
| 1-gemini31pro | 3 | 2.5 | 3.5 | 3 | 2.5 | 0.58 | 0.93 | 0.7 | 1.3% | 6.5% |
| 4-gemini31pro-antigrav | 3.5 | 2.5 | 3.5 | 3 | 2.5 | 0.60 | 1.00 | 0.6 | 1.2% | 6.0% |
| 8-web-qwen38max | 3 | 2.5 | 3 | 2.5 | 2.5 | 0.54 | 0.80 | 0.7 | 1.1% | 5.6% |
| 6-gemini38flash-antigrav-b1 | 2 | 2.5 | 1.5 | 2.5 | 3 | 0.46 | 0.60 | 0.9 | 1.1% | 5.4% |
| 10-genspark-nemotron3ultra | 2 | 2 | 1.5 | 2.5 | 3 | 0.44 | 0.56 | 0.9 | 1.0% | 5.0% |
| 7-gemini38flash-antigrav-b2 | 1.5 | 2 | 1 | 3 | 2.5 | 0.40 | 0.48 | 0.9 | 0.9% | 4.3% |
| 5-gemini38flash-antigrav | 1.5 | 1.5 | 1 | 2.5 | 2.5 | 0.36 | 0.42 | 0.9 | 0.7% | 3.7% |
| 2-gemini38flash | 2 | 1 | 3 | 2.5 | 1.5 | 0.40 | 0.48 | 0.5 | 0.5% | 2.4% |

Worked example (unit 3): Cr = (5+5+5+5+4)/25 = 0.96; L = exp(3.66 × 0.36) = 3.73; P(top-3) = 0.02 × 3.73 × 1.2 = 0.090; P(top-10%) = 0.10 × 3.73 × 1.2 = 0.448.

### 2b. Paper (whitepaper) track

| Unit | P1 | P2 | P3 | P4 | P5 | Cr_p | L | Ed | P(prize) | P(top-10) |
| --- | :---: | :---: | :---: | :---: | :---: | ---: | ---: | ---: | ---: | ---: |
| 3-cc-opus55 | 5 | 5 | 5 | 4 | 5 | 0.96 | 3.73 | 1.0 | 18.7% | 70.0% (cap) |
| 11-cc-glm53max | 5 | 4.5 | 4 | 4 | 4.5 | 0.88 | 2.79 | 1.0 | 13.9% | 55.7% |
| 12-cc-grok47 | 3 | 5 | 5 | 4 | 5 | 0.88 | 2.79 | 1.0 | 13.9% | 55.7% |
| 9-genspark-gpt61sol | 4 | 4.5 | 5 | 3.5 | 4.5 | 0.86 | 2.59 | 1.0 | 12.9% | 51.8% |
| 13-genspark-mimo26pro | 5 | 4 | 4 | 4 | 4 | 0.84 | 2.41 | 1.0 | 12.0% | 48.1% |
| 15-genspark-deepseekV41flash | 5 | 4.5 | 3.5 | 4 | 4 | 0.84 | 2.41 | 1.0 | 12.0% | 48.1% |
| 16-cc-glm53flash | 5 | 4 | 3 | 4 | 3.5 | 0.78 | 1.93 | 1.0 | 9.7% | 38.6% |
| 14-genspark-kimiK3 | 3.5 | 3 | 4 | 3 | 3 | 0.66 | 1.25 | 1.0 | 6.2% | 24.9% |
| 1-gemini31pro | 2 | 3 | 3.5 | 3 | 2 | 0.54 | 0.80 | 1.0 | 4.0% | 16.1% |
| 10-genspark-nemotron3ultra | 4 | 2.5 | 1 | 2.5 | 2 | 0.48 | 0.64 | 0.8 | 2.6% | 10.3% |
| 4-gemini31pro-antigrav | 2 | 2.5 | 3.5 | 2 | 2 | 0.48 | 0.64 | 0.8 | 2.6% | 10.3% |
| 6-gemini38flash-antigrav-b1 | 1 | 3 | 1 | 3 | 2 | 0.40 | 0.48 | 0.7 | 1.7% | 6.7% |
| 5-gemini38flash-antigrav | 1.5 | 2.5 | 0.5 | 3 | 1.5 | 0.36 | 0.42 | 0.7 | 1.5% | 5.8% |
| 7-gemini38flash-antigrav-b2 | 1 | 2.5 | 0.5 | 3 | 1.5 | 0.34 | 0.39 | 0.7 | 1.4% | 5.4% |
| 2-gemini38flash | 1 | 1 | 2 | 1 | 1 | 0.24 | 0.27 | 0.5 | 0.7% | 2.7% |
| 8-web-qwen38max | 1 | 1 | 1 | 1 | 1 | 0.20 | 0.23 | 0.5 | 0.6% | 2.3% |

Units 2 and 8 were not asked Q3/Q4; their paper rows score only the single sentence each devotes to the paper track and are shown for completeness, not as a judgement of their answers.

**Reading the two tables together.** The best agent-track plan (3) is also the best paper-track plan because the same property drives both: it is built on measured facts and corrects the dossier's invented example. Units 5, 6, 7 would be actively harmful as paper inputs: a judge who checks the "0.388 (M)" or "40.6% held-out" numbers against a non-existent run would score Verifiability at 0 and the whole submission would fail.

---

## 3. Claim-by-claim critical and feasibility analysis

Verdict codes: **OK** = correct/feasible; **OK-H** = feasible but a hypothesis that must be tested; **WRONG** = contradicted by ground truth; **INFEASIBLE** = cannot be done as stated on the stated hardware/harness; **UNVERIFIABLE** = cannot be checked from available sources; **FABRICATED** = presented as measured/cited but no such measurement/source exists.

### 3.1 `3-cc-opus55`

| Claim | File / location | Verdict | Reason |
| --- | --- | --- | --- |
| 0/129 problem statements contain tracebacks; 15/129 name an exception | `2026-09-30/01_Roadmap...md`, data profile | OK | Re-measured: 0 and 15 |
| Graphs contain only `calls` edges; 72% of fastapi nodes isolated | same | OK (edge type) / UNVERIFIABLE (72%) | Edge-type claim consistent with README and notebook; the isolation percentage was not re-measured |
| `httpx_6821` symbols do not exist in the httpx snapshot | `2026-09-30_BCF/01_...md`, corrections | OK | `httpx_3672` snapshot uses `RedirectMiddleware`/`NetworkStream`; dossier ledger admits invention |
| Paper rubric Novelty/Quality/Relevance/Verifiability/Clarity; 3,000 words | same, paper-track facts | OK | Rubric confirmed by Kaggle page excerpt; word cap matches local intel |
| S(K,f) = 1/(1/K + 1 − f) expected speed-up; savings ∝ K·f | `02_BCF_Fault_Class_Math...md` | OK | Derivation checked: with a classifier of fidelity f over K classes the expected guess count scales as stated under uniform priors |
| Gates "the model cannot waive" are unenforceable | `01_BCF_Review...md`, C13 | OK | Declarative YAML; only tool scoping enforces |
| Day-by-day six-sprint plan for a solo developer | `02_Master_Plan...md` | OK-H | Feasible but dense; D5 = 4 |
| Prior research (Debroy & Wong 2009, DiGiuseppe & Jones, Zheng 2006, Massey/Arikan) | `03_Prior_Research...md` | OK | All located (log A1, A4, A5, A27); author flagged as unverified |

### 3.2 `12-cc-grok47`

| Claim | File / location | Verdict | Reason |
| --- | --- | --- | --- |
| Dataset table (67/48/13/1, files-per-patch, hunks) | `01-roadmap...md` | OK | Re-measured; one trivial count difference (121 vs 120) |
| eval_config 90 s command / 24 calls / 6 min / 40 turns fits 12 h | `01-roadmap...md`, clock table | OK | 120 × 6 = 12.0 h is the ceiling; the plan's own clock table budgets setup, so margin is thin but explicit |
| Ceiling ladder gold replay → file oracle → symbol oracle → blind | `01-roadmap...md` | OK | Implementable with the harness (`--skip-agent-patch` and prompt variants) |
| "Skills do not see the NetworkX graph" | `03-bcf-techniques...md` | OK | Graph tools are harness tools; skill scripts run in the sandbox |
| `httpx_3672` is a single-file rename | `03-bcf-techniques...md` | WRONG | 7 gold files, 5 test hunks |
| `get_code_neighbors(edge_type="called_by", depth=2)` | `03-bcf-techniques...md` | WRONG | No `depth`; only `calls` edges |
| C(m,α) = (m+1)/2 + (1−α)n/2; α > m/n | `04-fault-interference...md` | OK | Algebra verified |
| Debroy & Wong 33.12% / 3,267 data points | `04-...md` | UNVERIFIABLE | Paper real; figures not located |
| Adapters r = 32 gated by a +2-task canary | `01-roadmap...md` | OK-H | Sound gating; effect size unknown |
| Paper outline without the rubric | `03-...md` | OK (honest) | States it did not fetch the page |

### 3.3 `11-cc-glm53max`

| Claim | File / location | Verdict | Reason |
| --- | --- | --- | --- |
| 22 forum threads with quirks Q1–Q6 and counts (62/299, 22%/62%/0%, 46k→7.6k) | `03-discussion-board-intel.md` | OK (existence) / UNVERIFIABLE (counts) | Thread titles confirmed by search; bodies not readable |
| Host says defaults are "no limit" | `01-roadmap...md` | WRONG or UNVERIFIABLE | README documents 60 min / 100 calls defaults; conflict unresolved |
| Typed edges incl. `called_by`; `--reference-check` command | `101-bcf-integration...md` | WRONG | Only `calls`; command not documented (amended in `103` §8.2) |
| `httpx_3672`: 7 files, `tests/test_parsers.py` 5 hunks, anti-tamper reset | `103-bcf-simulation...md` | OK | Re-measured exactly |
| Refinement monotonicity and DPI bound on classifier value | `102-...md` | OK | Correct statement: refining a partition cannot reduce mutual information; a classifier derived from X cannot add information beyond X |
| O(k²/4) masking cost "as a model" | `102-...md` | OK-H | Explicitly not a theorem |
| 33 citations "Crossref/arXiv verified" | `102-...md` | OK (sample) | Sampled citations real (log A1, A4, A8, A13, A28) |
| Two-track plan with M0–M7 kill criteria; eval_config 5–6 min | `01`, `02` | OK | Fits 12 h; kill criteria explicit |
| Simulation step 21 edits a test file then discards | `103` | WRONG (tenet) | Contradicts never-edit-tests; harmless to score because tests are reset, but a doctrine slip |

### 3.4 `9-genspark-gpt61sol`

| Claim | File / location | Verdict | Reason |
| --- | --- | --- | --- |
| Discussion 743063: sequential tasks, 4 eval_config fields, 12 h overrun errors run | Q1 | OK (title level) | Thread exists |
| 120 × 270 s = 9 h; 120 × 360 s = 12 h "no margin" | Q1/Q3 | OK | Arithmetic correct and used to bound eval_config |
| Compressed-tensors checkpoint may not be trainable with bitsandbytes | Q2 | OK | Correct caveat; training must use the bf16 base and target the language-model projections |
| `write_spec` is not a tool; `write_file("/tmp")` invalid | Q3 | OK | Declarative YAML; `write_file` writes under `/workspace` |
| Skill script is advisory, not a non-bypassable gate | Q3 | OK | Matches C13 |
| Random-category control for the classifier | Q3 | OK | Proper control: if random classes help as much as real ones, the benefit is structure, not class information |
| I(D;Ĉ \| X) = 0 for a deterministic classifier of X | Q4 | OK | Standard identity |
| Prior research with DOIs (Al-Bataineh ASE 2024/2025, FLITSR, BARINEL) | Q4 | OK | Located (log A7, A8, A10) |
| No numeric LB targets by design | Q1 | OK-H | Honest but weakens milestone decisions (D5 = 3.5) |

### 3.5 `15-genspark-deepseekV41flash`

| Claim | File / location | Verdict | Reason |
| --- | --- | --- | --- |
| "Fresh intel D1–D6, 2026-10-01 06:00 UTC" tagged [V] | top of Q1 | UNVERIFIABLE | No thread manifest; some items match known thread titles |
| 5090: 32 GB − 23.3 GB weights | Q2 | WRONG | 31B at 4-bit ≈ 16–18 GB; KV budget understated |
| A4B sibling model for fast iteration, parity flagged | Q2 | OK-H | Useful for harness debugging; results do not transfer to 31B |
| Negative-control destructive adapter canary | Q1 | OK | Cheap, decisive test that adapters are loaded at all |
| k* = e^{α0/(2β)} optimum class count | Q4 | OK | Derivation checked (log-linear benefit vs quadratic cost) |
| Greedy-on-observable fix order is correct for pure chains | Q4 | OK | Holds when masking is a total order; fails on DAGs with shared ancestors (the file says so) |
| q^n conjunctive-oracle law | Q3 | OK-H | Labelled as a law; it is an independence assumption |
| Prior research (An 2021 95.4%, Nashid ×2, Herzig, Renzullo, Callaghan 2026, Song 2022) | Q4 | OK | All located (log A9, A11, A12, A16–A18) |
| MSeer "ICSE 2018" | Q4 | WRONG (venue) | TSE 2019 |

### 3.6 `13-genspark-mimo26pro`

| Claim | File / location | Verdict | Reason |
| --- | --- | --- | --- |
| 0.17 ≈ 20 of 120 tasks | Q1 | WRONG | Public board ≈ 58–60 tasks → ≈ 10 |
| Trusted CV excludes 12 dead tasks | Q1 | OK-H | Ids exist; dead status forum-reported |
| `write_spec` impossible; journal outside `/workspace`; 50-turn cap not official | Q3 | OK | All correct |
| Two-fault benchmark from task pairs sharing a base commit | Q4 | OK | Feasible: pairs exist in `tasks.jsonl`; both gold patches can be withheld |
| I(R;E) with permutation CI; Fano bound; m* | Q4 | OK | Standard and correctly applied |
| Reiter 1987 "Founded in Causality" | Q4 | WRONG (title) | "A theory of diagnosis from first principles" |
| Callaghan 2026 Stellenbosch; ChainSWE; BayesFLo | Q4 | OK | Located (log A9, A13, A15) |

### 3.7 `16-cc-glm53flash`

| Claim | File / location | Verdict | Reason |
| --- | --- | --- | --- |
| Submissions 2/day | doc 01, 02 | WRONG | 1/day |
| Thinking drop "Patched Sep 29–30"; zeroing "Fixed via v25" | doc 01 | UNVERIFIABLE | Overstates the source intel's confidence |
| eval_config 10 min / 70 calls / 250 turns | doc 01 | INFEASIBLE | 120 × 10 = 20 h; the "governor skill" cannot enforce a global budget |
| "Setup ≈ 6 min/task measured; runs ≈ 8 h" | doc 01 | UNVERIFIABLE | No receipt |
| Hitting-set formulation of masking; Prop 3 ≥ 1 − 1/k! | doc 05 | OK | Sound (Reiter-style) |
| K* = 4a²N/b² | doc 05 | OK (derivation) / UNVERIFIABLE (K* 8–12) | The N ≈ 129 instantiation assumes unstated a, b |
| `problem_statement` via `get_status` | doc 09 | WRONG | `get_status` returns budget/status |
| `get_code_subgraph(depth, called_by)`; dual NL queries | doc 09 | WRONG | Wrong signature; symbol-name lookup |
| `scripts/evaluate.py --reference-check` | doc 09 | WRONG | Not documented |
| Frontier-API teacher distillation | doc 01 | OK-H (unflagged risk) | Licence/ToS and "reasonably accessible data" rule not addressed |

### 3.8 `14-genspark-kimiK3`

| Claim | File / location | Verdict | Reason |
| --- | --- | --- | --- |
| 0.17 ≈ 20 of 120 | Q1 | WRONG | ≈ 10 of ~58–60 |
| `max_time_minutes ≈ 8` leaves reserve | Q2 | WRONG | 120 × 8 = 16 h |
| 16k local context length | Q2 | OK-H | Defensible for local iteration; must re-test at 32k |
| `write_spec` adopted as a tool | Q3 | WRONG | Custom tools impossible |
| RTX 3080 as draft model host | Q2 | INFEASIBLE (as speculative decoding) | vLLM speculative decoding across machines is not supported; as a separate small-model service it is fine |
| Mirrored-subtree cosine ≈ 1.0 as an interference signature | Q4 | OK-H | Plausible heuristic; needs measurement |
| Bandyopadhyay & Ghosh 2012; Steimann 2013; ChainSWE | Q4 | OK | Located |

### 3.9 `1-gemini31pro`

| Claim | File / location | Verdict | Reason |
| --- | --- | --- | --- |
| Three-role LoRA (Searcher/Planner/Editor) | Q1 | OK-H | Within max_loras 8; untested |
| Synthetic trajectories via Claude Code / GPT-4o | Q1 | OK-H (unflagged risk) | Licence/ToS not addressed |
| H(S \| c) = α log2 Kc + (1−α) log2(N − Kc) | Q4 | WRONG (form) | Not a conditional entropy; mixes a misclassification mass with class sizes without normalising |
| "Theorem": naive O(m!·N^m) → linear | Q4 | WRONG | A naive agent does not enumerate permutations |
| `httpx_6821` real with `_client.py` history | Q4 | WRONG | Invented task |
| Tarantula, BARINEL, Steimann 2013, Podgurski 2003, Offutt 1992 | Q4 | OK | Real |
| Monperrus "85% of APR tools" | Q4 | UNVERIFIABLE | Number not located |

### 3.10 `10-genspark-nemotron3ultra`

| Claim | File / location | Verdict | Reason |
| --- | --- | --- | --- |
| Rich 29 tasks; HTTPX/Requests 22 | Q1 | WRONG | 48 / 13 + 1 |
| `max_time_minutes = 540` global failsafe | Q2 | WRONG | Per-task field |
| vLLM 0.19.1 patched; wheelhouse; KV collapse; escaping; thinking drop | Q1/Q2 | OK (title level) | Corroborated by thread titles and by unit 11 |
| Starlette 1.6.0 pin breaks 48 FastAPI tasks | Q2 | OK (release exists) / UNVERIFIABLE (48) | Starlette 1.6.0 released 2026-08-08 |
| Submit via Kaggle Notebook "Save Version" | Q2 | WRONG | Zip upload |
| QLoRA of 31B on RTX 4060 8 GB with CPU offload | Q2 | INFEASIBLE | Hours per step; not usable in six weeks |
| GRPO on 31B, 8 parallel envs, one 5090 | Q2 | INFEASIBLE | Rollout + optimizer memory exceeds 32 GB; see unit 3's parking rationale |
| Reward +0.1 if edit_file called ≥ 3 times | Q2 | WRONG (design) | Rewards churn |
| r=128 + r=64 adapters ≈ 2.7 GB | Q2 | OK-H | Near the 3 GiB cap; risky |
| "Pearl 2017 ISSTA", "Zhang 2022 TSE", "Le 2023 SWE-bench" | Q4 | FABRICATED | Not found |
| Table 1 (C1 0.08 / C2 0.15 / C3 0.31) | Q4 | FABRICATED | No run |
| 66.7% turn reduction from the dossier | Q4 | WRONG | Retracted illustrative number |

### 3.11 `4-gemini31pro-antigrav`

| Claim | File / location | Verdict | Reason |
| --- | --- | --- | --- |
| Planner/Coder/Reviewer then flat + BCF gates | afterQ1/afterQ2 roadmaps | OK-H | Reasonable; no budget |
| `.wslconfig` 48 GB | afterQ1 | OK | Fine on a 64 GB rig |
| P(l \| C) "zeroes out" irrelevant locations | afterQ3 math | WRONG (advice) | Hard pruning is the misattribution failure mode unit 3 quantifies |
| `httpx_6821` as pedagogical | afterQ3 | OK | Hedged |
| Prior research three bullets | afterQ3 | OK (thin) | Names real work without relevance mapping |

### 3.12 `6-gemini38flash-antigrav-b1`

| Claim | File / location | Verdict | Reason |
| --- | --- | --- | --- |
| `scripts/evaluate.py --reference-check` with expected output | `01_MASTER_PLAN...md` | FABRICATED | Command and output invented |
| `uv pip install promptfoo` | same | WRONG | npm package |
| Python 3.11 | same | WRONG (minor) | Notebook shows 3.12 |
| eval_config 20 min / 80 calls / 50 turns; "15 min guarantees < 8 h" | same | WRONG | 120 × 15 = 30 h |
| Gates evaluated deterministically, model cannot override | `02_BCF...md` | WRONG | Unenforceable |
| 68 built-in exception classes → 8 clusters; N=500 → ≤ 12 | `03_MATH...md` | UNVERIFIABLE | No measurement |
| `httpx_6821` lines 519/310; "All 127 redirect tests PASS" | `03_MATH...md` | FABRICATED | Invented task |
| Rubric "Technical Soundness…"; IEEE/ACM format | `04_WHITEPAPER...md` | WRONG | Official rubric differs; Writeup format |
| Results 38.4% / 7.3 bits in abstract | `04_WHITEPAPER...md` | FABRICATED | Labelled projections in the table, stated as achieved in the abstract |
| "Abreu MSeer ISSRE 2009"; 22%; 85% | `03_MATH...md` | FABRICATED / UNVERIFIABLE | Log A6, A26 |

### 3.13 `8-web-qwen38max`

| Claim | File / location | Verdict | Reason |
| --- | --- | --- | --- |
| Orchestrator/Navigator/Coder/Verifier with 2 LoRAs | Task 1 | OK-H | Expressible as sub-agents with tool scoping |
| Python wrapper around `edit_file` pre-flight check | Winning hacks | INFEASIBLE | No custom tools; only a skill script the model must choose to run |
| Sandbox wheel caching via `--find-links=/wheels` | Winning hacks | WRONG (control) | Harness-controlled setup |
| Unsloth QLoRA on the 4-bit QAT model | Phase 3 | WRONG (as stated) | Checkpoint is compressed-tensors; train on bf16 base |
| Gemini 1.5 Pro / Claude 3.5 Sonnet / O1 trajectories | Phase 2 | OK-H (stale, unflagged) | Outdated names; licence not addressed |
| Local baseline 0.05–0.10 | Sprint 1 | UNVERIFIABLE | Guess |

### 3.14 `7-gemini38flash-antigrav-b2`

| Claim | File / location | Verdict | Reason |
| --- | --- | --- | --- |
| Stratification fastapi 34 / rich 28 / requests 22 / httpx 45 | `01_MASTER_PLAN...md` | FABRICATED | httpx has 1 task |
| Resolution 0.150 → held-out 0.406; 129 tasks in 4h18m | `01`, `04` | FABRICATED | No run |
| Rubric incl. "Offline & Consumer Feasibility"; IEEE/ACM | `04` | WRONG | Official rubric differs |
| SequentialAgent spec → coder → verifier; verifier owns submit_patch | `02` | OK | Sound tool-scoping topology |
| `--chat-template-kwargs`; `--max-loras 4 --max-lora-rank 64` | `01` | WRONG (minor) | Flag is `--default-chat-template-kwargs`; scoring uses 8/128 |
| eval_config `max_time_minutes: 45` | `01` | INFEASIBLE | 90 h |
| "F2 vanishes without touching downstream code" | `03` | WRONG | Contradicts the dossier scenario it cites |
| Korel & Laski 1988 ">85% excluded"; Debroy & Wong GUI title | `03` | FABRICATED | Log A3, A25 |
| "Docker Runner Daemon :5000/health" | `01` | FABRICATED | No such component |

### 3.15 `5-gemini38flash-antigrav`

| Claim | File / location | Verdict | Reason |
| --- | --- | --- | --- |
| BCF = "Bimodal Code-Graph Fusion" | afterQ1 `00_EXEC...md` | WRONG | Batonic Coding Framework |
| `max_time_minutes: 45`, 80 calls | afterQ1/afterQ2 `01_MASTER...md` | INFEASIBLE | 90 h |
| "~45% of failed tasks never produce a patch; 32% search miss" | `00_EXEC...md` | FABRICATED | No post-mortem exists |
| Edge types calls/imports/defined_in/overrides; PPR weights | `02_BCF...md` | WRONG | Only `calls` |
| 0.388 (M), baseline 0.163 (21/129), 62% token reduction (M), receipts | `04_WHITEPAPER...md` | FABRICATED | No run |
| E[Waste] ≤ 3·E[turn cost] from optional stopping | `03_MATH...md` | WRONG | Does not follow |
| I(X;C) = F log2 K + (1−F) log2(K/(K−1)) − H2(F) | `03_MATH...md` | OK | Correct for the uniform-in-class model |
| K_eff = 160, N_eff ≈ 31, ≤ 2 turns | `03_MATH...md` | UNVERIFIABLE (overclaim) | No measurement |
| "Debroy & Wong TSE 2014"; "Abreu MSeer ISSRE 2009"; Zheng "ICSE 2006" | `03_MATH...md` | FABRICATED / WRONG | Log A2, A5, A6 |
| Harness facts (anti-tamper paths, `/tmp`, 3-tier edit, compaction) | `02_BCF...md` | OK | Match README |

### 3.16 `2-gemini38flash`

| Claim | File / location | Verdict | Reason |
| --- | --- | --- | --- |
| Two-agent analyzer/patcher; LoRA r=32; dynamic budgeting | Q1 | OK-H | Reasonable |
| Hardware "RTX 3080 + Mac Studio M3 Ultra 512 GB" | first Q2 | WRONG | Not the stated hardware |
| llama.cpp GGUF offload | first Q2 | INFEASIBLE | Scoring uses vLLM compressed-tensors; local GGUF would not reproduce behaviour |
| "4-page report" | Q1 | WRONG | 3,000-word Writeup |
| Corrected-hardware Q2 | end of file | ABSENT | Answer echoes the question |

---

## 4. Why the credibility ordering differs slightly from the council ranking

The council ranking weights clarity and coverage; the credibility score weights only what would break if executed. Two notable moves:

- `13-genspark-mimo26pro` edges above `15-genspark-deepseekV41flash` on the agent track (Cr 0.80 vs 0.76) because 15's VRAM error and unprovenanced "fresh intel" are execution risks, whereas 13's errors (LB denominator, a citation title) do not change what gets built.
- `14-genspark-kimiK3` sits above `16-cc-glm53flash` on credibility because 16's 20-hour eval_config and three wrong tool usages would fail a scoring run, while 14's budget error is a single number to fix.

## 5. Bottom line

- **Agent track.** Execute unit 3's plan with unit 12's runbook and unit 11's intel doctrine. Expected planning probability of a top-3 finish is in the high single digits and of a top-10% finish roughly four in ten, conditional on the no-adapter candidate reaching the public board by week 2 and at least one adapter passing its canary by week 4.
- **Paper track.** The same material gives the best paper-track odds, provided the measured ablation (classifier K ∈ {1, 3, 4}, random-category control, two-fault benchmark) is frozen by Nov 5. Do not reuse any number from units 5, 6, 7 or 10; they would score Verifiability 0 if checked.


---

<!-- ====================================================================== -->
<!-- FILE: 03_Special_2_Composite_Options_and_Project_Plans.md -->
<!-- ====================================================================== -->

# Special Section 2 — Composite Technique Inventory, Impact–Effort Analysis, Master Option List, and Project Plans (Index)

**Date:** 2026-10-01 · **Role taken:** LoRA / ML / software-engineering lead for a solo entrant with the stated hardware (RTX 5090 32 GB main rig, RTX 4060 8 GB laptop, RTX 3080 10 GB desktop) and the official harness (Gemma 4 31B QAT w4a16 on 4×L4, vLLM, 12 h for ~120 sequential tasks, declarative ADK YAML, nine tools, PEFT LoRA adapters ≤ 3 GiB, max rank 128, max 8 adapters).

This file is the index: the composite technique inventory (§1), the impact–effort analysis (§2), the master option list (§3), the global calendar with GO/NO-GO gates (§4), the global self-improvement loop (§5) and the shared conventions used by every per-option plan (§6). The per-option project plans with hh:mm task sequences are in:

- `03a_Project_Plans_Options_00_to_07.md` — environment, prompt/skill options and the evaluation ladder.
- `03b_Project_Plans_Options_08_to_15.md` — LoRA options, the paper-track package, and parked options.

Time estimates are for one experienced engineer; `(hh:mm)` is active working time, `wall` is unattended run time.

---

## 1. Composite technique inventory (every distinct technique found across the 16 units)

| # | Technique | Found in units | Harness-compatible? | Notes |
| --- | --- | --- | --- | --- |
| T01 | Gold-patch replay / "reference check" before trusting local scores | 3, 6, 9, 11, 12, 13, 16 | Yes (`swegemma eval --skip-agent-patch`) | 12 "dead" public tasks reported on the forum |
| T02 | Zero-census: run the sample agent on all 129 tasks to measure harness overhead and base behaviour | 15, 12, 3 | Yes | Produces the setup-time distribution needed for budget math |
| T03 | Budget calculator: per-task minutes × 120 + setup ≤ 12 h with margin | 3, 9, 11, 12, 13, 15 | Yes | 5–6 min/task is the only range that fits |
| T04 | eval_config sweep (time / calls / turns / command timeout) | 3, 11, 12, 15 | Yes | Scorer reads four fields |
| T05 | Thinking on/off sweep; default off | 11, 12, 16 | Yes (chat-template kwargs) | Forum: thoughts dropped between tool calls |
| T06 | Escaping protocol for double-JSON-encoded tool results | 10, 11, 16 | Yes (prompt) | 22%/62%/0% split unverified |
| T07 | Symbol-shaped `search_similar_code` queries; `get_code_neighbors` with `calls`; no natural-language queries | 3, 11 (amended), 12 | Yes | Key lookup, not semantic |
| T08 | grep-first navigation via `run_command`; graph tools second | 3, 12 | Yes | Contender 8's "ban grep" is the opposite and is rejected |
| T09 | `read_file` paging discipline (150 lines / 10 k chars) | 3, 5, 12 | Yes | |
| T10 | Edit reliability: pre-flight `old_string` existence check; line-splice patch skill | 8 (as wrapper, infeasible), 15 (H1 skill), 12 | Yes as a skill script only | The model must choose to call it |
| T11 | Output truncation skill (`pytest -q -x --tb=short`, `head`) and 5,000-char stdout awareness | 3, 8, 12, 15 | Yes | |
| T12 | Compaction settings (interval/threshold) and short tool outputs | 3, 8, 11 | Yes | README 5 / 14336 vs notebook 15 |
| T13 | STATE / NEXT / WHY visible block each turn | 15 | Yes (prompt) | Survives compaction |
| T14 | BCF spec-first card (G0) written to `/tmp`, not `/workspace` | 3, 9, 12, 13 | Yes (skill + prompt) | Untracked files enter the patch |
| T15 | Gates G0–G6 enforced by topology/tool scoping, not by code | 3, 9, 12, 7 (verifier owns submit) | Yes | "Model cannot waive" claims (6, 16) rejected |
| T16 | Read-only localizer sub-agent (AgentTool) | 12 | Yes | |
| T17 | Verifier sub-agent owns `submit_patch` | 7, 9 (actor/grader) | Yes | |
| T18 | Handoff packet T0/T1/T2 and breadcrumbs | compendium, 3, 10, 12 | Yes (prompt/skill) | Handoff ablation proposed by 12 |
| T19 | Rescue 3-strike; advisory budget governor; early fallback submit | compendium, 3, 11, 12, 16 | Yes (advisory) | Harness diffs the tree on timeout anyway |
| T20 | Exception-class classifier (issue-text-only) and fix-order DAG | all Q4 answers | Yes (prompt first) | Paper core; 0/129 tracebacks, 15/129 exception names |
| T21 | Seeded dev/held-out splits with OOD = requests + httpx; trusted CV excluding dead tasks | 12, 13 | Yes | |
| T22 | Ceiling ladder: gold replay → file oracle → symbol oracle → blind | 12 | Yes | Tells you where the score is lost |
| T23 | Failure taxonomy F1–F12 + ledger + receipts | 12, 11, 3, 13 | Yes | |
| T24 | Promptfoo regression / Langfuse tracing | compendium, 5, 6 | Yes (local) | |
| T25 | +2-task canary gate for any adapter; loud adapter; destructive-adapter negative control | 12, 13, 15 | Yes | Detects silent zeroing |
| T26 | Tool-format LoRA (JSON validity, edit fidelity) | 8, 10, 11, 12 | Yes | |
| T27 | Localization LoRA (issue → file/symbol) | 1, 8, 12 | Yes | |
| T28 | Repair/trajectory SFT LoRA with rejection sampling | 1, 2, 8, 10, 12, 16 | Yes | Data licence must be checked |
| T29 | Dual role LoRAs (navigator + coder) routed per sub-agent | 5, 8 | Yes (max_loras 8) | |
| T30 | Teacher distillation from frontier/open APIs | 1, 8, 10, 16 | Conditional | Must satisfy "reasonably accessible data" and ToS |
| T31 | Git-history task mining (SWE-smith style) from the four repos | 3, 11, 12 | Yes | Hidden tasks are from private repos: generalisation, not memorisation |
| T32 | RL (GRPO/PPO) on 31B | 10 | Infeasible on stated hardware | Parked |
| T33 | Hand-built GraphRAG / PPR over NetworkX graphs | 5, 8 | Low value | Only `calls` edges; graph tools are harness-side |
| T34 | Two-fault benchmark from task pairs sharing a base commit | 13 | Yes | Paper evidence |
| T35 | Hunk-subset masking procedure (apply a subset of gold hunks, observe test outcomes) | 12 | Yes | Paper evidence |
| T36 | Random-category control for the classifier | 9 | Yes | Paper evidence |
| T37 | 3.12/3.13 environment split; wheels offline | 15, 6 | Yes | |
| T38 | A4B sibling model for harness debugging | 15 | Yes (local only) | Parity caveat |
| T39 | Pre-registered experiment and frozen results date | 3, 11, 12 | Yes | Nov 5 freeze |

---

## 2. Impact–effort analysis

Impact is the expected change in resolved hidden tasks (out of ~120; one public-board task ≈ 0.017). Effort is active engineer hours. Confidence is how sure the estimate is. Quadrant: **QW** quick win (high impact, low effort), **BB** big bet (high impact, high effort), **FI** fill-in (low impact, low effort), **AV** avoid/park.

| Option | Composed of | Impact (tasks, expected [range]) | Effort (hh:mm) | Wall time | Confidence | Main risk | Quadrant |
| --- | --- | ---: | ---: | ---: | :---: | --- | :---: |
| OPT-00 Environment + replay + zero-census + stub | T01, T02, T03, T37 | 0 (enabler) | 22:00 | 20 h | High | WSL/Docker GPU pass-through issues | Prereq |
| OPT-01 Budget-tuned no-adapter candidate | T03, T04, T05 | +3 [+1, +6] | 14:00 | 36 h | High | Scoring-run overhead differs from local | QW |
| OPT-02 Retrieval doctrine | T07, T08, T09 | +2 [0, +4] | 10:00 | 12 h | Med | Model ignores doctrine under compaction | QW |
| OPT-03 Edit reliability (patch skill + pre-flight + escaping) | T06, T10 | +2 [+1, +4] | 16:00 | 12 h | Med-High | Skill not invoked by the model | QW |
| OPT-04 Context hygiene | T11, T12, T13 | +1.5 [0, +3] | 10:00 | 12 h | Med | Over-truncation hides the failing assert | QW |
| OPT-05 BCF topology (spec card, localizer, verifier owns submit, handoff) | T14–T18 | +2 [−1, +4] | 24:00 | 24 h | Med | Extra turns cost budget; sub-agent overhead | BB |
| OPT-06 Rescue + governor + early submit | T19 | +1 [0, +2] | 8:00 | 12 h | Med | Premature submit of a broken tree | FI |
| OPT-07 Evaluation ladder + taxonomy + regression | T21–T24 | 0 direct (multiplier on all others) | 20:00 | 30 h | High | Time sink if over-engineered | Prereq |
| OPT-08 Tool-format LoRA | T25, T26 | +1.5 [0, +3] | 30:00 | 40 h | Med | Silent zeroing; QAT-transfer mismatch | BB |
| OPT-09 Localization LoRA | T25, T27, T31 | +1.5 [0, +3] | 34:00 | 48 h | Med-Low | Private-repo shift | BB |
| OPT-10 Repair trajectory LoRA | T25, T28, T30, T31 | +2 [−2, +5] | 48:00 | 90 h | Low | Data quality; regressions | BB |
| OPT-11 Exception-class classifier (prompt → tiny LoRA) | T20, T36 | +0.5 [−1, +2] | 18:00 | 24 h | Low-Med | Only 15/129 statements name an exception | FI (paper-critical) |
| OPT-12 Dual role LoRAs | T29 | +0.5 [−1, +2] | 20:00 | 30 h | Low | Routing complexity | AV unless 08/09 pass |
| OPT-13 Paper package (two-fault benchmark, masking, ablation, Writeup) | T34, T35, T36, T39 | 0 on LB (paper prize) | 40:00 | 30 h | Med | Results not frozen by Nov 5 | BB (paper) |
| OPT-14 RL | T32 | unknown | 80:00+ | 200 h+ | Very low | Infeasible on 32 GB | AV |
| OPT-15 Hand-built GraphRAG | T33 | +0.5 [−1, +1] | 24:00 | 10 h | Low | Duplicates harness tools | AV |

Total active effort for everything not avoided: 00+01+02+03+04+05+06+07 = 124:00; 08+09+10+11 = 130:00; 13 = 40:00 → 294:00 against roughly 300 h available in six weeks. The GO/NO-GO gates in §4 exist to cut OPT-10 or OPT-11 when their predecessors fail, which is the expected case for at least one of them.

Impact ranges are planning priors derived from (a) the failure-mode shares reported in the forum intel captured by unit 11 (JSON/escaping and edit failures dominate), (b) the dataset profile (47% of gold patches ≤ 10 lines, 71% single-file), and (c) the public-board ceiling of 0.17. They are to be replaced by measured deltas from OPT-07 as soon as the ladder exists.

---

## 3. Master option list (build order)

| Order | Option | Week | Depends on | Promote when |
| ---: | --- | :---: | --- | --- |
| 1 | OPT-00 Environment, gold replay, zero-census, stub submission | 1 | — | Gold replay ≥ 110/129 locally; stub scored on Kaggle |
| 2 | OPT-07 Evaluation ladder, splits, taxonomy, regression | 1–2 | OPT-00 | Dev/held-out seeds frozen; ladder numbers recorded |
| 3 | OPT-01 Budget-tuned no-adapter candidate | 2 | OPT-00 | 120-task dry run ≤ 10:30 wall; public score ≥ baseline |
| 4 | OPT-02 Retrieval doctrine | 2 | OPT-07 | File-hit@1 up on dev; no held-out regression |
| 5 | OPT-03 Edit reliability | 2–3 | OPT-07 | Edit-failure share halves on dev |
| 6 | OPT-04 Context hygiene | 3 | OPT-07 | Compaction events down; resolved up or flat |
| 7 | OPT-06 Rescue + governor + early submit | 3 | OPT-01 | Zero empty patches on dev |
| 8 | OPT-05 BCF topology | 3–4 | OPT-02..04 | Held-out delta ≥ +1 task over flat; budget still fits |
| 9 | OPT-08 Tool-format LoRA | 3–4 | OPT-07, data from OPT-01..04 runs | Canary +2 on held-out; no regression on dev |
| 10 | OPT-09 Localization LoRA | 4 | OPT-08 pipeline | Symbol-hit@1 up ≥ 10 pts; canary +2 |
| 11 | OPT-11 Classifier (prompt, then LoRA) | 4 | OPT-07 | Random-category control shows real-class advantage |
| 12 | OPT-10 Repair trajectory LoRA | 4–5 | OPT-08, OPT-09 | Canary +2; no OOD regression |
| 13 | OPT-13 Paper package | 4–6 (freeze Nov 5, submit Nov 10) | OPT-07, OPT-11 | Measured tables exist |
| 14 | OPT-12 Dual role LoRAs | 5 (only if 8 and 9 pass) | OPT-08, OPT-09 | Canary +2 over single adapter |
| — | OPT-14, OPT-15 | parked | — | See pivot conditions |

---

## 4. Global calendar with GO/NO-GO gates

Dates assume Day 0 = Thu 2026-10-02. Final submission deadline Wed 2026-12-02 23:59 UTC; paper deadline Thu 2026-11-12; entry/merger Wed 2026-11-25.

| Week | Dates | Build | Gate (end of week) | GO | NO-GO → pivot |
| --- | --- | --- | --- | --- | --- |
| 0 | Oct 2 | Day-0 setup (OPT-00 §1) | G-00 vLLM serves 31B w4a16 locally; one task runs end-to-end | Continue | If GPU pass-through fails: run harness on AUX 2 with CPU sandboxes, inference on Main (OPT-00 pivot A) |
| 1 | Oct 3–9 | OPT-00 rest, OPT-07 core, stub submission | G-01 Gold replay ≥ 110/129; zero-census done; stub scored | Continue | If replay < 100: freeze a "trusted" subset and never report numbers outside it |
| 2 | Oct 10–16 | OPT-01, OPT-02, OPT-03 | G-02 Candidate A public score ≥ 0.12 and dry run ≤ 10:30 | Continue | If < 0.08: stop feature work; debug harness parity (escaping, thinking, context) for one week |
| 3 | Oct 17–23 | OPT-04, OPT-06, OPT-05 start, OPT-08 data | G-03 Dev resolved ≥ baseline + 3; edit-failure share ≤ half of census | Continue to LoRA | If flat: skip OPT-05 topology, go straight to OPT-08 with the flat agent |
| 4 | Oct 24–30 | OPT-05 finish, OPT-08 train, OPT-09, OPT-11 prompt | G-04 At least one adapter passes +2 canary and loads on 4×L4 config | Continue to OPT-10 | If no adapter passes: submit best no-adapter candidate; move LoRA effort to OPT-13 paper evidence |
| 5 | Oct 31–Nov 6 | OPT-10, OPT-13 experiments, Nov 5 freeze | G-05 Paper tables frozen; best candidate on public board | Write paper | If OPT-10 regresses: drop it; paper reports negative result honestly |
| 6 | Nov 7–13 | Paper Writeup (submit Nov 10), OPT-12 if earned, hardening | G-06 Paper submitted; two final candidates chosen | Continue daily submissions | — |
| 7–8 | Nov 14–Dec 2 | Daily 1-submission probing, regression guard, final two selections | G-07 Final two selected by Nov 30 | — | — |

Weekly active-hour budget: 50:00. Any week whose plan exceeds 50:00 in `03a`/`03b` lists the deferrable items explicitly.

---

## 5. Global self-improvement loop (applies to every option)

```text
LOOP (one iteration ≈ 1 working day, 06:30 active + overnight wall)
 1. RUN      dev split (seeded, n≈60) with the current candidate            wall 05:00
 2. LEDGER   append one row per task: outcome, taxonomy code F1–F12,
             turns, tool calls, JSON-invalid count, edit failures,
             compaction events, time, exception-class label            00:30
 3. TRIAGE   rank failure classes by count × fixability                  00:45
 4. FIX      one change only (prompt rule, skill script, data slice,
             adapter hyper-parameter)                                    02:00
 5. UNIT     run the option's unit tests (see each plan)                 00:30
 6. RE-RUN   dev split                                                   wall 05:00
 7. DECIDE   Δ resolved ≥ +2 on dev AND held-out canary ≥ 0 → PROMOTE;
             Δ in [−1, +1] → keep only if unit tests improved; Δ ≤ −2 → REVERT  00:30
 8. RECORD   receipt id, config hash, adapter hash, ledger diff          00:15
```

Rules: one change per iteration; held-out split is touched at most twice per week; public leaderboard once per day with the best promoted candidate; never tune on the OOD split (requests + httpx).

---

## 6. Shared conventions used in the per-option plans

- **Splits.** `dev` = 60 tasks (stratified fastapi/rich/requests, seed 20261002), `held` = 57 tasks, `ood` = 13 requests + 1 httpx when not in dev (used only for final checks), minus the 12 forum-reported dead tasks if gold replay confirms them.
- **Receipts.** Every number reported in a plan or the paper has a receipt: `R-<option>-<yyyymmdd>-<n>` pointing to a ledger file and a config hash.
- **Taxonomy F1–F12** (from unit 12, merged with unit 11's quirks): F1 no patch; F2 wrong file; F3 right file wrong symbol; F4 edit_file no match; F5 syntax error after edit; F6 tests not run; F7 tests run, misread; F8 timeout; F9 budget exhausted; F10 JSON/escaping invalid tool call; F11 compaction amnesia; F12 harness/infra error.
- **Adapter gate.** An adapter is promotable only if: (a) loads under `--max-loras 8 --max-lora-rank 128` with TP=4-equivalent settings locally (TP=1 on the 5090 but same dtype/quant), (b) destructive-adapter negative control changes outputs (proves adapters are applied), (c) +2 resolved on held-out versus the same prompt without the adapter, (d) no decrease on dev, (e) size < 3 GiB unpacked.
- **Training base.** LoRA is trained on the bf16 `google/gemma-4-31B-it` weights loaded 4-bit with bitsandbytes (QLoRA) on the 5090, target modules restricted by regex to the language-model projections, and then applied at inference to the w4a16 compressed-tensors checkpoint in vLLM. The bf16→QAT transfer is itself a hypothesis and is covered by the adapter gate; the pivot is renting an 80 GB GPU to train on the exact QAT weights if the gate fails for transfer reasons.
- **Data licence rule.** Only data that is public, redistributable, and "reasonably accessible" (competition rule) is used: own trajectories, git histories of the four public repos, and permissively licensed public trajectory sets. Any API-teacher data must have its licence recorded in the ledger before training.


---

<!-- ====================================================================== -->
<!-- FILE: 03a_Project_Plans_Options_00_to_07.md -->
<!-- ====================================================================== -->

# Project Plans — Options 00 to 07 (environment, prompt/skill options, evaluation ladder)

Conventions, splits, taxonomy codes and the adapter gate are defined in `03_Special_2_Composite_Options_and_Project_Plans.md` §6. Every task row gives active time `(hh:mm)`; unattended runs are marked `wall`.

---

## OPT-00 — Environment, gold replay, zero-census, stub submission

**Objective.** A Day-0 Windows 11 / WSL2 environment on which the official harness replays gold patches, the 31B QAT model serves locally under vLLM with LoRA enabled, and a first (stub) submission is scored on Kaggle so that the end-to-end path is proven before any feature work.

**Hypothesis.** None; this is an enabler. Its outputs (setup-time distribution, gold-replay pass set, base-agent census) are the denominators for every later measurement.

**Dependencies.** Hardware as stated; the 22 GB data package; the harness notebook and README.

### Task sequence

| ID | Task | Subtasks | Est (hh:mm) | Output |
| --- | --- | --- | ---: | --- |
| 00.1 | BIOS / OS prep (Main) | Enable EXPO, Resizable BAR, Above-4G, IOMMU; Windows 11 Pro updates; NVIDIA Studio driver | 01:00 | Driver version in ledger |
| 00.2 | WSL2 Ubuntu 24.04 | `wsl --install -d Ubuntu-24.04`; `.wslconfig` with `memory=48GB`, `processors=24`, `networkingMode=mirrored`; `nvidia-smi` inside WSL | 00:45 | `wsl --status` receipt |
| 00.3 | Docker Engine inside WSL (not Docker Desktop) | docker-ce, nvidia-container-toolkit, `docker run --gpus all nvidia/cuda:12.8-base nvidia-smi` | 01:00 | GPU visible in a container |
| 00.4 | Python toolchain | `uv`, Python 3.12 and 3.13 venvs (unit 15's split), `vllm` pinned to the version named by the scoring image (0.19.1 patched; fall back to latest 0.19.x), `peft`, `transformers`, `bitsandbytes`, `datasets`, `promptfoo` via npm | 01:00 | `uv pip freeze` saved |
| 00.5 | Data package | Unzip to NVMe; verify `tasks.jsonl` n=129; `wheels/` present; graphs/embeddings present | 00:30 | SHA of tasks.jsonl |
| 00.6 | vLLM serve test | `vllm serve google/gemma-4-31b-it-qat-w4a16-ct --max-model-len 32768 --gpu-memory-utilization 0.90 --enable-lora --max-loras 8 --max-lora-rank 128 --reasoning-parser gemma4 --tool-call-parser gemma4 --enable-auto-tool-choice`; one chat completion; one tool call | 01:00 | KV-cache capacity line from the log |
| 00.7 | Harness install | Install `swegemma`; run the sample submission on one task (`fastapi_*` with a 1-line gold patch) | 01:30 | First trajectory |
| 00.8 | Gold replay | `swegemma eval --skip-agent-patch` over all 129 tasks; record pass/fail per task | 01:00 + wall 04:00 | `gold_replay.csv` |
| 00.9 | Dead-task reconciliation | Compare failures with the 12 forum-reported ids; attempt the starlette/wheel fixes locally only to understand them (never in the submission) | 02:00 | Trusted-task list |
| 00.10 | Zero-census | Run the sample agent (1 min / 10 calls / 50 turns) on all 129 tasks; log setup time, agent time, outcome, taxonomy | 01:30 + wall 06:00 | `census_0.csv` |
| 00.11 | Setup-time model | Fit setup-time distribution (median, p90) per repo; compute `budget_per_task = (12 h − Σ setup − 30 min) / 120` | 01:00 | Budget table |
| 00.12 | Stub submission | Package sample agent with eval_config 3 min / 30 calls / 100 turns; validate zip; upload; record public score | 01:30 + wall 12:00 (Kaggle queue) | First public score |
| 00.13 | AUX rigs | AUX 2 (3080): second harness runner for sandbox-heavy replays; AUX 1 (4060): ledger, dashboards, paper drafting | 02:00 | Runner roles documented |
| 00.14 | Ledger schema | SQLite + CSV export; columns per §6 of the index | 01:30 | `ledger.sqlite` |
| 00.15 | Backup/restore | Snapshot WSL distro (`wsl --export`) and venvs | 00:45 | Restore tested |
| | **Total** | | **22:00** + wall ≈ 22 h | |

### Unit test plan

| Test | Procedure | Expected result |
| --- | --- | --- |
| U00-1 GPU in container | `docker run --gpus all ... nvidia-smi` | RTX 5090 listed; CUDA 12.8+ |
| U00-2 vLLM LoRA path | Serve with `--enable-lora`; request with a dummy adapter dir containing zeros | 200 response; log shows adapter loaded; output identical to base (zero adapter) |
| U00-3 Harness one task | Sample agent on one trivial task | Trajectory JSON written; `submit_patch` or fallback diff recorded |
| U00-4 Gold replay | 129 tasks `--skip-agent-patch` | ≥ 110 pass; failures reconcile with the forum's 12 ids ± 3 |
| U00-5 Census budget | Σ(setup + agent) for 129 tasks at sample config | Measured; p90 setup time recorded; projected 120-task wall ≤ 6 h at the sample config |
| U00-6 Stub scored | Kaggle submission | Non-error score; value recorded (any value ≥ 0.00) |

### Self-improvement loop (for this option)

Re-run gold replay after any environment change (vLLM upgrade, wheel change). If the trusted-task set changes, re-seed splits and invalidate all ledgers dated before the change.

### Milestones and GO/NO-GO

| Milestone | Criterion | GO | NO-GO pivot |
| --- | --- | --- | --- |
| M00-A (Day 0 evening) | U00-1..3 pass | Proceed to replay | Pivot A: run the harness on AUX 2 with CPU-only sandboxes; keep inference on Main over LAN. Pivot B: use the A4B sibling model to debug the harness while the 31B serve issue is fixed. |
| M00-B (Day 3) | U00-4 ≥ 110 | Freeze trusted set | If 90–109: proceed with the trusted subset; if < 90: stop and fix the environment (wheel index, Python version) for one more day; if still < 90, pivot C: rent a Linux box with 4×L4-class GPUs for replay only. |
| M00-C (Day 5) | U00-5, U00-6 done | OPT-07 and OPT-01 may start | If the Kaggle queue exceeds 24 h, keep building; do not block on the score. |

---

## OPT-01 — Budget-tuned no-adapter candidate ("Candidate A")

**Objective.** The strongest agent achievable with the base model, a single flat root agent, tuned eval_config and prompt only. This is the fallback final submission and the control for every later experiment.

**Hypothesis H01.** Most of the gap between the sample agent and the 0.17 leaders is budget allocation and tool-use hygiene, not model capability. Expected +1 to +6 tasks over the sample agent.

### Task sequence

| ID | Task | Subtasks | Est (hh:mm) | Output |
| --- | --- | --- | ---: | --- |
| 01.1 | eval_config grid | Candidates: (4 min/40 calls/120 turns), (5/50/150), (6/60/200); command timeout 120 s; compute projected wall from census setup times | 01:00 | Grid table |
| 01.2 | System prompt v1 | Roles: read issue → locate → reproduce (optional) → edit → run focused tests → submit. Hard rules: never edit tests/config; scratch in `/tmp`; one `submit_patch` at the end; `get_status` every 5 turns | 02:00 | `prompt_v1.md` |
| 01.3 | Thinking sweep | Run dev split with thinking off and on (chat-template kwargs); record resolved, turns, tokens | 01:00 + wall 10:00 | Sweep table |
| 01.4 | Grid run | Three configs × dev split with the better thinking setting | 01:00 + wall 15:00 | Grid results |
| 01.5 | Analysis | Resolved vs budget curve; choose the config with the best resolved at ≤ 10:30 projected wall | 01:30 | Decision receipt |
| 01.6 | Held-out check | Chosen config on held-out once | 00:30 + wall 05:00 | Held-out number |
| 01.7 | 120-task dry run | Full trusted set sequentially at the chosen config to measure wall time | 00:30 + wall 11:00 | Wall time receipt |
| 01.8 | Package and submit | Validate zip; submit; record score | 01:00 | Public score A |
| 01.9 | Regression baseline | Promptfoo suite: 30 prompts covering tool-call JSON validity, escaping, read_file paging | 03:00 | `promptfoo_v1` |
| 01.10 | Document | Candidate A card: config, prompt hash, scores, receipts | 01:30 | `candidate_A.md` |
| | **Total** | | **14:00** + wall ≈ 41 h | |

### Data collection

Every dev/held-out run writes trajectories to the ledger. These trajectories are the raw material for OPT-08/09/10; nothing extra is collected here.

### Test-result collection and analysis

Per task: outcome, turns, tool calls, invalid tool calls, time, taxonomy code. Per run: resolved count with a Wilson 95% interval (n=60 → ±~12 points, so only deltas ≥ 2 tasks on dev plus a held-out confirmation are acted on).

### Unit test plan

| Test | Procedure | Expected |
| --- | --- | --- |
| U01-1 Config legality | Parse `eval_config.yaml`; assert four fields present and ≤ README maxima | Pass |
| U01-2 Budget fit | `projected_wall = Σ setup_p90 + 120 × max_time_minutes` | ≤ 10:30 |
| U01-3 Prompt rules | Promptfoo: 10 prompts that tempt editing `tests/` | 0/10 propose test edits |
| U01-4 JSON validity | 200 sampled tool calls from the dev run | ≥ 97% parse |
| U01-5 Single submit | Count `submit_patch` per trajectory | Exactly 1 in ≥ 95% of resolved runs |
| U01-6 Public parity | Public score vs local trusted-set rate | Within ±0.05 |

### Self-improvement loop

Weekly: re-run the grid only if setup times change; otherwise tune prompt rules one at a time via the global loop.

### Milestones and GO/NO-GO

| Milestone | Criterion | GO | NO-GO pivot |
| --- | --- | --- | --- |
| M01-A | Thinking sweep decided | Fix thinking setting for the rest of the project | If thinking-on wins by ≥ 3 but doubles time: keep off and revisit under OPT-04 context hygiene |
| M01-B | Public score A ≥ 0.12 | Candidate A is the fallback final | If 0.08–0.12: continue; if < 0.08: freeze features, spend one week on parity debugging (escaping, thinking drop, context length) using the census trajectories |
| M01-C | Dry run ≤ 10:30 | Config frozen | If > 10:30: step down one grid row; if still over, reduce `max_turns` first, then `max_time_minutes` |

---

## OPT-02 — Retrieval doctrine (symbol-shaped queries, grep-first, paging)

**Objective.** Raise file-hit@1 and symbol-hit@1 in the first five turns by teaching the model how the nine tools actually behave (key lookup, `calls` edges only, 150-line pages).

**Hypothesis H02.** Wrong-file and wrong-symbol failures (F2, F3) are the largest fixable class after budget; a doctrine that starts with `run_command("grep -rn ...")` over the issue's identifiers and uses graph tools only with symbol names cuts F2+F3 by a third.

### Task sequence

| ID | Task | Subtasks | Est (hh:mm) | Output |
| --- | --- | --- | ---: | --- |
| 02.1 | Identifier extraction study | From 129 problem statements, extract backticked tokens, CamelCase, dotted paths; measure how often a gold-patch file contains one of them (expected high: 92/129 statements contain quotes/backticks) | 02:00 | `identifier_hit.csv` |
| 02.2 | Tool behaviour probes | 20 probes each for `search_similar_code` (symbol vs sentence), `get_code_neighbors` (calls only), `get_code_subgraph`; record returned-node quality | 02:00 | Probe table |
| 02.3 | Doctrine text | Prompt section: "Step 1 grep identifiers; Step 2 `search_similar_code(<symbol>)` only with names; Step 3 `get_code_neighbors(<node>, 'calls')`; Step 4 `read_file` by 150-line windows around hits" | 01:30 | `doctrine_v1.md` |
| 02.4 | Localizer skill script | `locate.py` (run via `run_skill_script`): greps identifiers, ranks files by hit density and recency of test references, prints ≤ 20 lines | 02:00 | Skill |
| 02.5 | Dev run and ledger | Dev split with doctrine; compute file-hit@1 and symbol-hit@1 against gold files/symbols | 01:00 + wall 05:00 | Hit metrics |
| 02.6 | Analysis and fix | One iteration of the global loop | 01:30 | Receipt |
| | **Total** | | **10:00** + wall ≈ 12 h | |

### Data classification

Each trajectory's first five tool calls are labelled: `grep`, `symbol-query`, `nl-query` (bad), `graph`, `read`, `other`. The share of `nl-query` is a doctrine-compliance metric.

### Unit test plan

| Test | Procedure | Expected |
| --- | --- | --- |
| U02-1 Identifier hit | 02.1 | ≥ 60% of tasks: a gold file contains an extracted identifier |
| U02-2 No NL queries | Count `search_similar_code` calls whose query has a space | ≤ 5% |
| U02-3 File-hit@1 | Gold file among first `read_file` targets | ≥ baseline + 10 points |
| U02-4 Paging | No `read_file` request > 150 lines | 100% |
| U02-5 Skill output size | `locate.py` stdout | ≤ 2,000 chars |

### Milestones and GO/NO-GO

| Milestone | Criterion | GO | NO-GO pivot |
| --- | --- | --- | --- |
| M02-A | U02-1 ≥ 60% | Grep-first is justified | If < 40%: switch to test-name-first (grep the failing test names from the issue) and symbol embeddings via `search_similar_code` on extracted names |
| M02-B | File-hit@1 up ≥ 10 points on dev | Promote doctrine | If flat: keep the skill, drop the prompt text (saves tokens) |

---

## OPT-03 — Edit reliability (patch skill, pre-flight check, escaping protocol)

**Objective.** Eliminate F4 (edit_file no match), F5 (syntax error after edit) and F10 (invalid tool-call JSON) as leading failure classes.

**Hypothesis H03.** A line-splice patch skill (unit 15's H1) plus a pre-flight `old_string` check and an explicit escaping protocol halves F4+F5+F10 on dev.

### Task sequence

| ID | Task | Subtasks | Est (hh:mm) | Output |
| --- | --- | --- | ---: | --- |
| 03.1 | Failure census | From census and Candidate A ledgers, count F4/F5/F10 and inspect 20 examples each | 02:00 | Examples file |
| 03.2 | Escaping probe | Reproduce the double-JSON case locally with a line containing quotes and backslashes; confirm what the model sees | 01:30 | Probe receipt |
| 03.3 | Escaping protocol text | Prompt rule: "Tool results may be JSON-escaped; when a line shows `\\\"`, read it as `\"`; copy `old_string` from `read_file` output verbatim after un-escaping once" | 01:00 | Prompt section |
| 03.4 | `patch_tool.py` skill | Inputs: path, start line, end line, replacement text file in `/tmp`; validates line range, applies splice, runs `python -m py_compile`, prints a 10-line diff | 03:00 | Skill |
| 03.5 | `preflight.py` skill | Inputs: path, `/tmp/old.txt`; reports exact / whitespace / fuzzy match count and the matching line numbers | 02:00 | Skill |
| 03.6 | Prompt wiring | Decision rule: use `edit_file` for ≤ 3-line changes with a unique anchor; otherwise `patch_tool.py` | 01:00 | Prompt section |
| 03.7 | Dev run | Dev split; ledger F4/F5/F10 | 01:00 + wall 05:00 | Metrics |
| 03.8 | Promptfoo cases | 20 edit scenarios (quotes, tabs, unicode, duplicate anchors) | 02:30 | Suite |
| 03.9 | Loop iteration | One global-loop pass | 02:00 | Receipt |
| | **Total** | | **16:00** + wall ≈ 12 h | |

### Unit test plan

| Test | Procedure | Expected |
| --- | --- | --- |
| U03-1 Splice correctness | 10 synthetic files; splice lines 5–7 | Byte-exact expected output |
| U03-2 Compile guard | Splice that breaks syntax | Skill refuses and prints the error; file unchanged |
| U03-3 Pre-flight tiers | Anchor with trailing whitespace | Reports "whitespace match, 1 hit, line N" |
| U03-4 Duplicate anchor | Anchor appears twice | Reports 2 hits; model instructed to extend anchor |
| U03-5 F4+F5+F10 share | Dev ledger | ≤ 50% of the census share |
| U03-6 No test edits | Skill rejects paths under `tests/` and config names | Refusal message |

### Milestones and GO/NO-GO

| Milestone | Criterion | GO | NO-GO pivot |
| --- | --- | --- | --- |
| M03-A | Escaping reproduced locally | Protocol text justified | If not reproducible locally: keep the protocol (harmless) but tag the forum claim unverified |
| M03-B | U03-5 met | Promote | If the model never calls the skills: move the decision rule into the first user message and add a one-line example; if still unused after one loop, drop the skills and keep only the protocol |

---

## OPT-04 — Context hygiene (truncation, compaction, STATE/NEXT/WHY)

**Objective.** Keep the useful context inside the window: short tool outputs, predictable compaction, and a visible state block that survives summarisation.

**Hypothesis H04.** F11 (compaction amnesia) and F7 (misread test output) fall when tool output is bounded and the agent restates STATE/NEXT/WHY every turn.

### Task sequence

| ID | Task | Subtasks | Est (hh:mm) | Output |
| --- | --- | --- | ---: | --- |
| 04.1 | Context census | From ledgers: tokens per turn, compaction events per task, turn index of first compaction | 01:30 | Context stats |
| 04.2 | `runtests.py` skill | Wraps `pytest -q -x --tb=short -p no:cacheprovider <targets>`; prints the first failing assertion ±15 lines, total pass/fail counts; caps output at 3,000 chars | 02:00 | Skill |
| 04.3 | Compaction settings sweep | Interval 5 vs 15; threshold 14336 vs 20000; dev split | 00:45 + wall 10:00 | Sweep table |
| 04.4 | STATE/NEXT/WHY block | Prompt rule: every assistant turn begins with three lines (≤ 40 words) | 00:45 | Prompt section |
| 04.5 | Dev run | With 04.2–04.4 | 00:30 + wall 05:00 | Metrics |
| 04.6 | Analysis | Compaction events, F7/F11 counts, resolved | 01:30 | Receipt |
| 04.7 | Promptfoo cases | 10 long-output scenarios | 01:30 | Suite |
| 04.8 | Loop iteration | | 01:30 | Receipt |
| | **Total** | | **10:00** + wall ≈ 15 h | |

### Unit test plan

| Test | Procedure | Expected |
| --- | --- | --- |
| U04-1 Output cap | Run `runtests.py` on a 500-failure suite | Output ≤ 3,000 chars and contains the first assertion |
| U04-2 State block | Sample 50 turns | ≥ 90% begin with STATE/NEXT/WHY |
| U04-3 Compaction count | Dev ledger | Mean compaction events per task down ≥ 30% |
| U04-4 No lost goal | After compaction, does the next turn reference the issue's identifiers? | ≥ 90% |

### Milestones and GO/NO-GO

| Milestone | Criterion | GO | NO-GO pivot |
| --- | --- | --- | --- |
| M04-A | U04-1, U04-2 pass | Promote | If resolved drops: the cap hides the real assertion; raise cap to 5,000 and print the last failing test name explicitly |

---

## OPT-05 — BCF topology (spec card, read-only localizer, verifier owns submit, handoff packets)

**Objective.** Implement the enforceable part of BCF: gates as topology and tool scoping; the spec card and handoff packet as prompts/skills; measure whether the structure beats the flat agent.

**Hypothesis H05.** Separating "where" (localizer with read-only tools), "what" (coder with edit tools) and "ship" (verifier with `run_command` + `submit_patch`) raises resolved by ≥ 1 on held-out at the same budget. This is also the paper's "handoff ablation".

### Task sequence

| ID | Task | Subtasks | Est (hh:mm) | Output |
| --- | --- | --- | ---: | --- |
| 05.1 | YAML topology | Root `LlmAgent` coder; `AgentTool` localizer with tools `[read_file, run_command(grep/ls only via prompt), get_code_neighbors, search_similar_code, get_code_subgraph]`; `AgentTool` verifier with `[run_command, get_status, submit_patch]` | 03:00 | `agent.yaml` v2 |
| 05.2 | Spec card skill | `spec_card.py` writes `/tmp/spec.md` (G0): symptom, suspected files, exception class, acceptance test names; printed back to context | 02:00 | Skill |
| 05.3 | Handoff packets | T0 (localizer → coder: files, symbols, evidence lines), T1 (coder → verifier: diff summary, tests to run), T2 (verifier → coder on failure: failing assertion, suspected cause) as prompt templates | 02:30 | Templates |
| 05.4 | Breadcrumbs | `/tmp/breadcrumbs.log` appended by each skill; read by the coder after compaction | 01:00 | Skill hook |
| 05.5 | Budget accounting | Sub-agent turns count against the same `max_turns`/calls; set per-agent prompt limits (localizer ≤ 12 calls, verifier ≤ 10) | 01:30 | Limits in prompts |
| 05.6 | Dev run flat vs topology | Same prompt content, two YAMLs | 01:00 + wall 10:00 | Paired results |
| 05.7 | Handoff ablation | Topology without T0/T1 packets (free-text handoff) | 00:30 + wall 05:00 | Ablation row |
| 05.8 | Held-out check | Best variant once | 00:30 + wall 05:00 | Held-out delta |
| 05.9 | Failure analysis | Where turns are spent per agent; F9 budget exhaustion rate | 02:00 | Receipt |
| 05.10 | Dry run | 120-task wall time with topology | 00:30 + wall 11:00 | Wall receipt |
| 05.11 | Loop iterations ×2 | | 04:00 | Receipts |
| 05.12 | Documentation | Topology card for the paper | 01:30 | `topology_v2.md` |
| | **Total** | | **24:00** + wall ≈ 31 h | |

### Data classification

Turns are labelled by agent (localizer/coder/verifier) and by gate reached (G0 spec written, G1 located, G2 edited, G3 tests run, G4 tests pass, G5 submitted). Gate-reach rates per task are the primary diagnostic.

### Unit test plan

| Test | Procedure | Expected |
| --- | --- | --- |
| U05-1 Tool scoping | Localizer attempts `edit_file` | Tool not available (harness refuses) |
| U05-2 Submit ownership | `submit_patch` calls by agent | 100% from verifier |
| U05-3 Spec card exists | `/tmp/spec.md` present before first edit | ≥ 90% of tasks |
| U05-4 Patch cleanliness | `git status` at end | No untracked files under `/workspace` |
| U05-5 Budget | Projected wall | ≤ 10:30 |
| U05-6 Gate funnel | G0→G5 reach rates | Recorded; G3 (tests run) ≥ 80% |

### Milestones and GO/NO-GO

| Milestone | Criterion | GO | NO-GO pivot |
| --- | --- | --- | --- |
| M05-A | Dev delta ≥ +1 and F9 not up | Held-out check | If F9 (budget exhaustion) rises ≥ 20%: cut the localizer to ≤ 8 calls and remove T2 retries |
| M05-B | Held-out delta ≥ +1 | Promote topology as Candidate B | If ≤ 0: keep the flat agent with spec card + verifier-only split (two agents), which is the cheaper half of the design |
| M05-C | Dry run ≤ 10:30 | Freeze | If over: reduce `max_turns` for sub-agents before touching the root |

---

## OPT-06 — Rescue 3-strike, advisory governor, early fallback submit

**Objective.** Never end a task with an empty or broken patch: after three failed test cycles, revert to the best-known tree and submit; keep ≥ 20% of the per-task budget for verification.

**Hypothesis H06.** F1 (no patch) and F8/F9 (timeout/budget) convert into at least one resolved task per 60 and reduce wall time.

### Task sequence

| ID | Task | Subtasks | Est (hh:mm) | Output |
| --- | --- | --- | ---: | --- |
| 06.1 | Strike counter | `strike.py` skill: increments `/tmp/strikes`, prints advice at 2 and 3 | 01:00 | Skill |
| 06.2 | Best-tree snapshot | `snapshot.py`: `git stash`-free copy of the working tree diff to `/tmp/best.diff` when tests improve | 01:30 | Skill |
| 06.3 | Governor | Prompt rule using `get_status` (free): at 80% time or calls, stop exploring, restore best diff, run focused tests once, submit | 01:00 | Prompt section |
| 06.4 | Dev run | | 00:30 + wall 05:00 | Metrics |
| 06.5 | Analysis | Empty-patch count, mean time per task, resolved | 01:30 | Receipt |
| 06.6 | Promptfoo | 8 scenarios of budget pressure | 01:30 | Suite |
| 06.7 | Loop iteration | | 01:00 | Receipt |
| | **Total** | | **8:00** + wall ≈ 5 h | |

### Unit test plan

| Test | Procedure | Expected |
| --- | --- | --- |
| U06-1 Strike advice | Three failing cycles | Advice printed at strike 3 |
| U06-2 Best diff restore | Snapshot then break the tree | Restore reproduces the snapshot byte-exact |
| U06-3 Empty patches | Dev ledger | 0 empty patches among tasks that made ≥ 1 edit |
| U06-4 Verification reserve | Time of last test run / budget | ≤ 85% in ≥ 90% of tasks |

### Milestones and GO/NO-GO

| Milestone | Criterion | GO | NO-GO pivot |
| --- | --- | --- | --- |
| M06-A | U06-3 and U06-4 pass | Promote | If resolved drops (premature submits): raise governor threshold to 90% and require one focused test pass before early submit |

---

## OPT-07 — Evaluation ladder, splits, taxonomy ledger, regression suite

**Objective.** A measurement system that tells you where each lost task is lost (ceiling ladder), that cannot be gamed by tuning (seeded splits, OOD split, held-out discipline), and that catches regressions before a submission (Promptfoo + ledger diff).

**Hypothesis.** None; multiplier for every other option.

### Task sequence

| ID | Task | Subtasks | Est (hh:mm) | Output |
| --- | --- | --- | ---: | --- |
| 07.1 | Trusted set | Gold-replay passes minus flaky tasks (run replay twice) | 01:00 + wall 04:00 | `trusted.txt` |
| 07.2 | Splits | Seeded stratified dev (60) / held (rest); OOD = requests + httpx flagged; store seeds | 01:00 | `splits.json` |
| 07.3 | Ceiling ladder scripts | L0 gold replay; L1 file oracle (prompt names the gold files); L2 symbol oracle (names gold symbols); L3 blind | 03:00 | Scripts |
| 07.4 | Ladder run | L1–L3 on dev with Candidate A | 01:00 + wall 15:00 | Ladder table |
| 07.5 | Taxonomy labeller | Rule-based first pass (regex on trajectories) + manual review of 30 | 03:00 | `taxonomy.py` |
| 07.6 | Ledger reports | Per-run report: resolved, Wilson CI, taxonomy histogram, turn/time distributions, delta vs previous run | 03:00 | `report.py` |
| 07.7 | Promptfoo harness | Local vLLM provider; suites from OPT-01..06; CI-style run before every submission | 03:00 | `promptfoo.yaml` |
| 07.8 | Langfuse (optional) | Local tracing of turns for inspection | 02:00 | Dashboard |
| 07.9 | Regression guard | Script: refuse to package a submission if dev resolved < previous promoted − 2 or Promptfoo fails | 01:30 | `guard.py` |
| 07.10 | Documentation | Measurement SOP | 01:30 | `sop.md` |
| | **Total** | | **20:00** + wall ≈ 19 h | |

### Test-result analysis conventions

- Primary metric: resolved count on the split, with Wilson 95% CI.
- Secondary: file-hit@1, symbol-hit@1, gate-reach rates, F-class histogram, median turns, median time, invalid-JSON rate.
- Paired comparison: McNemar's test on per-task outcomes between two candidates (n = 60 dev); report the discordant counts, not just the p-value.

### Unit test plan

| Test | Procedure | Expected |
| --- | --- | --- |
| U07-1 Split reproducibility | Re-run split script with the seed | Identical membership |
| U07-2 Ladder monotone | L0 ≥ L1 ≥ L2 ≥ L3 resolved | Holds (if not, the oracle prompts are broken) |
| U07-3 Taxonomy coverage | Share of failed tasks with a code | ≥ 95% |
| U07-4 Guard | Simulate a regression | Packaging refused |
| U07-5 Report diff | Two runs | Delta table with discordant tasks listed |

### Milestones and GO/NO-GO

| Milestone | Criterion | GO | NO-GO pivot |
| --- | --- | --- | --- |
| M07-A | Ladder table exists | Use L1−L3 gap to prioritise OPT-02 vs OPT-03 (if file oracle adds many tasks, localisation is the bottleneck; if symbol oracle adds little over file oracle, editing/verification is) | — |
| M07-B | Guard in place before week-3 submission | Required | If not ready, submissions are manual-reviewed against the last ledger |


---

<!-- ====================================================================== -->
<!-- FILE: 03b_Project_Plans_Options_08_to_15.md -->
<!-- ====================================================================== -->

# Project Plans — Options 08 to 15 (LoRA options, paper-track package, parked options)

Conventions, splits, taxonomy codes and the adapter gate are defined in `03_Special_2_Composite_Options_and_Project_Plans.md` §6. Every task row gives active time `(hh:mm)`; unattended runs are marked `wall`.

---

## Shared LoRA pipeline (used by OPT-08, 09, 10, 11, 12)

Built once under OPT-08 and reused. Listed here so each option's table only shows its own increments.

| ID | Task | Subtasks | Est (hh:mm) | Output |
| --- | --- | --- | ---: | --- |
| P.1 | Base weights | Download `google/gemma-4-31B-it` (bf16) and the QAT w4a16 checkpoint; verify configs match (layers, hidden size, vocab) | 01:00 + wall 02:00 | Config diff receipt |
| P.2 | Target-module regex | Enumerate modules; restrict to a regex anchored on `model.language_model.layers.N.` that matches only `self_attn.{q,k,v,o}_proj` and `mlp.{gate,up,down}_proj` (full pattern in the code block below this table); assert no vision/audio module matched | 01:30 | `targets.txt` |
| P.3 | QLoRA loader | bitsandbytes nf4 + double quant on the bf16 base; gradient checkpointing; `use_reentrant=False`; bf16 compute; confirm memory < 28 GB at seq 8192, batch 1 | 02:30 | Memory receipt |
| P.4 | Chat-format serialiser | Convert ledger trajectories (system, user, assistant tool calls, tool results) into Gemma 4 chat-template token streams with loss mask on assistant tokens only; keep tool-call special tokens intact | 04:00 | `serialize.py` + 10 golden samples |
| P.5 | Window policy | Training samples = (compacted prefix ≤ 6,144 tokens, assistant turn ≤ 2,048); prefix compaction mirrors the inference compactor (keep system, issue, last k tool results) | 02:00 | `windows.py` |
| P.6 | Trainer | PEFT `LoraConfig(r, alpha=2r, dropout=0.05, target_modules=regex)`; TRL SFT or plain HF Trainer; cosine LR; warmup 3%; eval every 100 steps on a 5% holdout by loss | 02:30 | `train.py` |
| P.7 | Export | Save PEFT `adapter_model.safetensors` + `adapter_config.json`; assert size; strip optimizer states | 00:45 | Adapter dir |
| P.8 | vLLM load test | Serve the w4a16 checkpoint with `--enable-lora`; request with `model=<adapter>`; compare logits/outputs against base on 20 prompts | 01:30 | Transfer receipt |
| P.9 | Destructive canary adapter | Train a 50-step adapter to emit "CANARY" on any input; load in vLLM; confirm outputs change | 01:00 | Negative-control receipt |
| P.10 | Loud-adapter smoke | Tiny adapter that prefixes every answer with "[L]" — used in every later run to prove the adapter is applied in the scoring config | 00:45 | Receipt |
| | **Total** | | **17:30** + wall ≈ 2 h | |

Target-module regex referenced in P.2:

```text
^model\.language_model\.layers\.\d+\.(self_attn\.(q|k|v|o)_proj|mlp\.(gate|up|down)_proj)$
```

**Memory budget on the 5090 (32 GB).** nf4 base ≈ 17.5 GB; LoRA r=32 params + optimizer ≈ 1.5 GB; activations at 8,192 tokens with checkpointing ≈ 6–8 GB; headroom ≈ 4 GB. If seq 8,192 OOMs, drop to 6,144 and raise gradient accumulation.

**Transfer risk.** The adapter is trained against nf4-quantised bf16 weights and applied to QAT w4a16 weights in vLLM. The expected mismatch is small for r ≤ 32 but is not zero; P.8 measures it (mean KL between adapter-on-training-base and adapter-on-QAT-base over 20 prompts). Pivot if KL is large: rent one 80 GB GPU (~$2–3/h, ≈ 20 h ≈ $60) and train with the QAT weights dequantised to bf16 as the frozen base.

**Unit tests for the shared pipeline**

| Test | Procedure | Expected |
| --- | --- | --- |
| UP-1 Target regex | Count matched modules | 7 × n_layers, zero vision/audio |
| UP-2 Loss mask | Golden sample | Loss only on assistant tokens; tool-result tokens masked |
| UP-3 Round trip | Serialise → detokenise | Equals the original chat rendering |
| UP-4 Memory | One training step at seq 8,192 | Peak < 30 GB |
| UP-5 Size | Exported adapter | < 3 GiB (r=32 ≈ 0.45 GB; r=128 ≈ 1.8 GB) |
| UP-6 vLLM load | Serve with adapter | HTTP 200; log line confirms LoRA load |
| UP-7 Destructive canary | P.9 | Outputs change on 20/20 prompts |
| UP-8 Transfer KL | P.8 | Mean KL < 0.05 nats/token on 20 prompts |

---

## OPT-08 — Tool-format LoRA

**Objective.** Make tool calls syntactically perfect and `edit_file` anchors verbatim, so that F10 and F4 disappear and budget is not spent on retries.

**Hypothesis H08.** A small adapter (r=16) trained on ~3,000 valid tool-call turns from the model's own resolved trajectories plus synthetic format drills reduces invalid-JSON rate to < 1% and F4 by half, adding +1 to +3 tasks.

### Data collection and methods

| Source | Method | Target count | Licence |
| --- | --- | --- | --- |
| Own resolved trajectories (dev + held-out runs of OPT-01..06) | Rejection sampling: keep every assistant turn from resolved tasks; from failed tasks keep turns whose tool call succeeded (valid JSON, anchor matched) | 2,000 turns | Own |
| Own repaired turns | For F4/F10 turns, construct the corrected call (anchor from the actual file; valid JSON) and keep the pair (context → corrected call) | 500 turns | Own |
| Synthetic format drills | Generate files with quotes, backslashes, tabs, unicode, duplicate anchors; script the correct `edit_file`/`read_file`/`run_command` calls | 1,000 turns | Own |
| Escaping drills | Tool results rendered double-escaped; correct un-escaped anchor as target | 300 turns | Own |

Collection is a script (`collect_format.py`) over the ledger; no manual labelling except a 100-sample audit.

### Data classification

| Label | Values | Use |
| --- | --- | --- |
| `tool` | read_file / edit_file / write_file / run_command / graph tools / submit_patch | Stratify so edit_file ≥ 35% |
| `validity` | valid / invalid-json / anchor-miss / anchor-ambiguous | Only valid as targets; invalid kept as context |
| `repo` | fastapi / rich / requests / httpx / synthetic | Hold out httpx; cap any repo at 50% |
| `outcome` | resolved / failed | Weight resolved 2× |
| `escaped` | yes / no | Ensure ≥ 15% escaped |

### Task sequence

| ID | Task | Subtasks | Est (hh:mm) | Output |
| --- | --- | --- | ---: | --- |
| 08.1 | Shared pipeline P.1–P.10 | | 17:30 | Pipeline |
| 08.2 | Collect | `collect_format.py`; audit 100 samples | 03:00 | `format_v1.jsonl` |
| 08.3 | Train | r=16, alpha=32, lr 1e-4, 2 epochs, seq 6,144, 3,800 samples ≈ 1,900 steps | 01:00 + wall 06:00 | Adapter F-v1 |
| 08.4 | Format eval | Promptfoo suites from OPT-01/03 with adapter vs base | 00:45 + wall 01:00 | Validity table |
| 08.5 | Dev run | Candidate A/B prompt + adapter | 00:30 + wall 05:00 | Dev metrics |
| 08.6 | Held-out canary | Same, once | 00:30 + wall 05:00 | Canary receipt |
| 08.7 | Analysis | F4/F10 counts; paired outcomes; transfer KL | 02:00 | Receipt |
| 08.8 | Loop iteration | Add repaired turns from the new failures; retrain | 02:30 + wall 06:00 | Adapter F-v2 |
| 08.9 | Scoring-config load test | Serve with `--max-loras 8 --max-lora-rank 128 --gpu-memory-utilization 0.80 --max-model-len 32768`; check KV capacity in the log against the forum's 7.6k collapse | 01:00 | KV receipt |
| 08.10 | Package | Adapter in submission zip; agent.yaml model reference | 01:15 | Candidate C |
| | **Total** | | **30:00** + wall ≈ 23 h | |

### Test-result collection and analysis

Invalid-JSON rate and anchor-miss rate per 1,000 tool calls (base vs adapter); resolved on dev and held-out with McNemar discordant counts; turns-to-first-successful-edit distribution.

### Unit test plan

| Test | Procedure | Expected |
| --- | --- | --- |
| U08-1 Validity | 1,000 sampled calls with adapter | ≥ 99% parse |
| U08-2 Anchor fidelity | 200 edit_file calls on known files | ≥ 95% exact or whitespace match |
| U08-3 No behaviour collapse | Base vs adapter on 30 non-tool prompts (explain code) | Semantic answers unchanged on manual review of 10 |
| U08-4 Canary | Held-out resolved | ≥ +2 over the same prompt without adapter |
| U08-5 KV capacity | 08.9 | Log shows ≥ 20k tokens of KV at 0.80 utilisation locally; if lower, note that 4×L4 will be tighter |
| U08-6 Size | Adapter | < 0.5 GB |

### Self-improvement loop

Each iteration adds the previous run's repaired F4/F10 turns (≤ 300) and retrains from scratch (cheap at r=16). Stop when validity ≥ 99% and anchor fidelity ≥ 95%; further gains come from OPT-09/10.

### Milestones and GO/NO-GO

| Milestone | Criterion | GO | NO-GO pivot |
| --- | --- | --- | --- |
| M08-A | UP-1..8 pass | Train | If UP-8 KL ≥ 0.05: rent an 80 GB GPU and retrain on dequantised QAT weights (adds ≈ 06:00 and ≈ $60) |
| M08-B | U08-1, U08-2 pass | Dev run | If validity < 97%: double the format drills and raise r to 32 |
| M08-C | U08-4 canary ≥ +2 | Promote Candidate C; proceed to OPT-09 | If 0 to +1: keep adapter only if dev did not regress and Promptfoo improved; proceed to OPT-09 anyway. If ≤ −1: drop the adapter, keep the data pipeline, and treat the format problem as prompt-only (OPT-03) |
| M08-D | KV capacity acceptable | Freeze | If KV collapse reproduces locally: cut `max_model_len` to 16,384 in the local config only and verify the scoring config in the next daily submission with the loud adapter |

---

## OPT-09 — Localization LoRA

**Objective.** Improve file-hit@1 and symbol-hit@1 from the issue text alone, generalising beyond the four public repos (hidden tasks come from private repos).

**Hypothesis H09.** Training the first-five-turn behaviour (grep targets, symbol queries, first `read_file`) on gold-derived supervision from thousands of mined commits raises file-hit@1 by ≥ 10 points and converts +1 to +3 tasks.

### Data collection and methods

| Source | Method | Target count | Licence |
| --- | --- | --- | --- |
| 129 public tasks | Gold files/symbols from `patch`; synthesise the ideal first five turns (grep identifiers → symbol query → read gold file window) | 129 trajectories × 3 phrasings | Own |
| Git-history mining of fastapi, rich, requests, httpx (SWE-smith style, T31) | For each commit touching ≥ 1 test and ≤ 3 source files: issue text = PR/commit message; gold = source diff; verify the test fails before and passes after in a sandbox | 1,500 verified instances | MIT/Apache/BSD repos |
| Public trajectory sets (SWE-smith, SWE-Gym, R2E-Gym) | Keep only (issue, gold files) pairs; re-render the localisation turns into the nine-tool schema | 3,000 pairs | Check each set's licence; record in ledger |
| Negative samples | Issues where grep-first fails; supervise the symbol-query fallback | 300 | Own |

Collection scripts: `mine_history.py` (git log filters, sandbox verification using the competition wheels), `render_localize.py`.

### Data classification

| Label | Values | Use |
| --- | --- | --- |
| `repo_family` | public-4 / external | Hold out 20% of external repos as an OOD check |
| `n_files` | 1 / 2 / 3+ | Match the dataset profile (71% single-file) |
| `identifier_present` | yes / no | Stratify 70/30 |
| `exception_named` | yes / no | Feeds OPT-11 |
| `size_bucket` | ≤ 10 / 11–44 / 45+ changed lines | Match profile |

### Task sequence

| ID | Task | Subtasks | Est (hh:mm) | Output |
| --- | --- | --- | ---: | --- |
| 09.1 | Mining script | Filters, sandbox verification, dedupe against the 129 tasks (base_commit overlap) | 05:00 + wall 10:00 | `mined_v1.jsonl` |
| 09.2 | Public sets | Download, licence check, schema mapping | 03:00 + wall 02:00 | `external_v1.jsonl` |
| 09.3 | Render | Ideal localisation turns with loss on assistant tokens | 03:00 | `localize_v1.jsonl` |
| 09.4 | Train | r=32, alpha=64, lr 8e-5, 2 epochs, seq 6,144, ≈ 5,000 samples | 01:00 + wall 10:00 | Adapter L-v1 |
| 09.5 | Offline eval | file-hit@1 / symbol-hit@1 on dev and on held-out external repos | 01:30 + wall 02:00 | Hit table |
| 09.6 | Dev run | Prompt + L-v1 (and + F-v2 stacked if OPT-08 passed; vLLM serves one adapter per request, so merge L and F by training L on top of F's data mix or use the role split in OPT-12) | 00:30 + wall 05:00 | Dev metrics |
| 09.7 | Held-out canary | | 00:30 + wall 05:00 | Canary receipt |
| 09.8 | OOD check | requests + httpx | 00:15 + wall 01:30 | OOD receipt |
| 09.9 | Analysis | Hit metrics vs resolved; F2/F3 counts | 02:00 | Receipt |
| 09.10 | Loop iteration | Re-mine for the failure patterns (e.g. docs_src tasks, 34/129) | 03:00 + wall 10:00 | Adapter L-v2 |
| 09.11 | Package | | 01:15 | Candidate D |
| | **Total** | | **34:00** (excl. shared pipeline) + wall ≈ 46 h | |

### Unit test plan

| Test | Procedure | Expected |
| --- | --- | --- |
| U09-1 Mining validity | 50 sampled mined instances | ≥ 90% fail-before/pass-after in sandbox |
| U09-2 Leakage | No mined instance shares base_commit or gold hunk with the 129 tasks | 0 overlaps |
| U09-3 Hit@1 | Dev | file-hit@1 ≥ baseline + 10 points |
| U09-4 External OOD | Held-out external repos | file-hit@1 ≥ baseline + 5 points |
| U09-5 Canary | Held-out resolved | ≥ +2 |
| U09-6 No doctrine regression | Share of NL queries | ≤ 5% |

### Milestones and GO/NO-GO

| Milestone | Criterion | GO | NO-GO pivot |
| --- | --- | --- | --- |
| M09-A | U09-1, U09-2 pass with ≥ 1,000 instances | Train | If < 500 verified instances after 10 h of mining: use public sets only and reduce r to 16 |
| M09-B | U09-3 ≥ +10 points | Dev run | If +3 to +9: still run dev; if ≤ +2: stop OPT-09, keep mined data for OPT-10 |
| M09-C | U09-5 ≥ +2 and U09-4 holds | Promote Candidate D | If dev up but external OOD flat: the adapter memorised public repos; re-weight external data to ≥ 60% and retrain once; if still flat, drop |

---

## OPT-10 — Repair trajectory LoRA (full-trajectory SFT with rejection sampling)

**Objective.** Teach the complete loop (locate → edit → test → fix → submit) from verified trajectories so that more tasks reach G4/G5 within budget.

**Hypothesis H10.** Several thousand resolved trajectories in the exact nine-tool schema, produced by best-of-N self-distillation on mined tasks, move resolved by +2 (range −2 to +5). High variance: this is where regressions happen.

### Data collection and methods

| Source | Method | Target | Licence |
| --- | --- | --- | --- |
| Self-distillation | Run the best candidate (prompt + F/L adapters) on mined tasks with N=4 samples (temperature 0.7); keep trajectories that pass the mined test; keep the shortest | 1,500 resolved trajectories | Own |
| Teacher (optional) | A larger open-weights model served locally on the 5090 is not possible beside the 31B; a hosted open model API (DeepSeek/GLM/Qwen class) may be used only if its ToS permits training on outputs and the data is recorded as "reasonably accessible"; rendered into the nine-tool schema via the same harness | 1,000 | Record per provider |
| Public trajectories | SWE-smith / SWE-Gym trajectories remapped: `bash` → `run_command`, `str_replace_editor view` → `read_file`, `str_replace` → `edit_file`; drop trajectories using tools without a mapping | 2,000 | Per-set licence |
| Repair pairs | From failed own runs: context up to the wrong edit + the correct edit (from gold) as target | 500 | Own |

### Data classification

| Label | Values | Use |
| --- | --- | --- |
| `source` | self / teacher / public / repair | Cap teacher+public at 60% |
| `length_bucket` | ≤ 15 / 16–30 / 31+ turns | Prefer ≤ 30 |
| `taxonomy_at_fail` (repair pairs) | F2–F7 | Balance |
| `gate_max` | G3 / G4 / G5 | Only G5 (submitted and passed) as full trajectories |
| `repo_family` | public-4 / external | ≥ 50% external |

### Task sequence

| ID | Task | Subtasks | Est (hh:mm) | Output |
| --- | --- | --- | ---: | --- |
| 10.1 | Self-distillation runner | Batch runner over mined tasks on AUX 2 sandboxes + Main inference; N=4 | 04:00 + wall 40:00 | `self_v1.jsonl` |
| 10.2 | Public remap | Schema mapper + validator | 06:00 + wall 02:00 | `public_v1.jsonl` |
| 10.3 | Teacher decision | Licence review; if cleared, 1,000 tasks | 02:00 + wall 10:00 | `teacher_v1.jsonl` or "skipped" receipt |
| 10.4 | Mix and window | Apply P.5 windows; per-turn samples ≈ 40,000 | 03:00 | `repair_v1.jsonl` |
| 10.5 | Train | r=32, alpha=64, lr 5e-5, 1 epoch over 40k windows (seq 8,192) ≈ 20 h on the 5090 | 02:00 + wall 20:00 | Adapter R-v1 |
| 10.6 | Loss-holdout check | 5% by-task holdout loss curve | 00:30 | Curve |
| 10.7 | Dev run | | 00:30 + wall 05:00 | Dev metrics |
| 10.8 | Held-out canary + OOD | | 00:45 + wall 06:30 | Receipts |
| 10.9 | Analysis | Gate funnel vs base; turn count; regressions by taxonomy | 03:00 | Receipt |
| 10.10 | Loop iteration | Add repair pairs for new failures; lower LR; retrain | 04:00 + wall 20:00 | Adapter R-v2 |
| 10.11 | Stacking decision | R alone vs R trained on F+L data mix | 02:00 + wall 10:00 | Decision receipt |
| 10.12 | 120-task dry run | | 00:30 + wall 11:00 | Wall receipt |
| 10.13 | Package | | 01:15 | Candidate E |
| 10.14 | Documentation | Data card (sources, licences, counts) | 02:30 | `data_card.md` |
| | **Total** | | **32:00** + 16:00 contingency = **48:00**; wall ≈ 125 h | |

The wall time exceeds one week; 10.1 runs on AUX 2 sandboxes while Main trains OPT-08/09, which is why the global calendar starts OPT-10 data collection in week 3.

### Test-result collection and analysis

Gate funnel (G0–G5 reach rates) base vs adapter; resolved with CI; per-taxonomy deltas; turns and tokens per resolved task (an adapter that resolves the same tasks in fewer turns is still a win for budget).

### Unit test plan

| Test | Procedure | Expected |
| --- | --- | --- |
| U10-1 Trajectory validity | 100 sampled training trajectories replayed in the sandbox | ≥ 95% reproduce the pass |
| U10-2 Schema | Every tool call in training data parses against the nine-tool schema | 100% |
| U10-3 Holdout loss | Curve | Decreasing; no divergence |
| U10-4 Canary | Held-out | ≥ +2 |
| U10-5 OOD | requests + httpx | No decrease |
| U10-6 Turn efficiency | Median turns to G5 on resolved tasks | ≤ base |
| U10-7 Size | Adapter | < 1 GB |

### Milestones and GO/NO-GO

| Milestone | Criterion | GO | NO-GO pivot |
| --- | --- | --- | --- |
| M10-A (end week 4) | ≥ 1,000 verified trajectories collected | Train | If < 500: train a "repair pairs only" adapter (cheap) and stop collection |
| M10-B | U10-3 healthy | Dev run | If diverging: lr 2e-5, r=16 |
| M10-C | U10-4 ≥ +2 and U10-5 holds | Promote Candidate E | If dev up, OOD down: reduce public-4 share to ≤ 30%, retrain once; if still down, drop R and ship F/L |
| M10-D (Nov 5) | Results frozen | Paper tables | Negative results are reported as such |

---

## OPT-11 — Exception-class classifier (prompt first, then a tiny LoRA)

**Objective.** Test the BCF thesis directly: does assigning the issue to one of K exception classes before localisation reduce turns-to-locate and raise resolved? Prompt-only first; a tiny adapter only if the prompt version shows signal.

**Hypothesis H11.** With K=3 classes (type/contract, state/ordering, I/O-format) derived from issue text, turns-to-first-correct-file fall by ≥ 1 and resolved rises by ≥ 1 on held-out; a random-class control shows no such gain. Prior from the data: only 15/129 statements name an exception and 0/129 contain tracebacks, so the classifier must work from prose, which is why this is low-confidence for the leaderboard but central to the paper.

### Data collection and classification

| Step | Method | Est (hh:mm) |
| --- | --- | ---: |
| Label 129 public tasks | Two passes: rule-based keywords, then manual review of all 129 (≈ 2 min each); record a confidence per label; compute inter-pass agreement | 05:00 |
| Class schemes | K=1 (none), K=3, K=4 (adds "dependency/environment"); fix definitions in a card | 01:00 |
| Random control | For each task, a random class drawn with the same marginal as the true labels; fixed seed | 00:30 |
| Mined tasks (from OPT-09) | Weak labels from commit messages for ≥ 1,000 instances; used only for the tiny LoRA | 02:00 |

### Task sequence

| ID | Task | Subtasks | Est (hh:mm) | Output |
| --- | --- | --- | ---: | --- |
| 11.1 | Labelling | As above | 06:30 | `classes.csv` |
| 11.2 | Prompt variants | K=1, K=3, K=4, K=3-random: the spec card includes the class and a class-specific "look first at" list | 02:00 | Prompts |
| 11.3 | Dev runs ×4 | | 01:00 + wall 20:00 | Four ledgers |
| 11.4 | Analysis | Turns-to-first-correct-file; resolved; per-class breakdown; I(class; gold-file-bucket) with permutation CI (unit 13's test) | 03:00 | Receipt |
| 11.5 | Held-out run (best K) | | 00:30 + wall 05:00 | Receipt |
| 11.6 | Tiny LoRA (only if 11.4 shows signal) | r=8 classifier head via SFT on "issue → class" with 1,000 weak + 129 strong labels; 1 epoch ≈ 1 h | 02:00 + wall 02:00 | Adapter C-v1 |
| 11.7 | Classifier accuracy | On the 129 strong labels (5-fold) | 01:00 | Accuracy table |
| 11.8 | Documentation | Class card; results | 02:00 | `classifier.md` |
| | **Total** | | **18:00** + wall ≈ 27 h | |

### Unit test plan

| Test | Procedure | Expected |
| --- | --- | --- |
| U11-1 Label agreement | Rule-based vs manual | κ reported; manual labels are canonical |
| U11-2 Information | I(class; gold-file-bucket) permutation test | p < 0.05 for K=3 if the thesis holds; the null case is a legitimate paper result |
| U11-3 Random control | K=3-random vs K=1 | No significant gain (if random helps, the gain is structure, not class) |
| U11-4 Turns-to-locate | K=3 vs K=1 on dev | ≥ 1 turn fewer on median |
| U11-5 Classifier accuracy | 5-fold | ≥ 70% on K=3 to justify the LoRA |

### Milestones and GO/NO-GO

| Milestone | Criterion | GO | NO-GO pivot |
| --- | --- | --- | --- |
| M11-A | U11-2 and U11-4 positive | Held-out; tiny LoRA | If null: stop building; the paper reports the measured null with the random control, which is still a Verifiability-strong contribution |
| M11-B | U11-5 ≥ 70% | Ship C-v1 as part of the spec card | If < 70%: keep the prompt-only classifier (model self-classifies) |

---

## OPT-12 — Dual role LoRAs (localizer + coder adapters routed per sub-agent)

**Objective.** If OPT-08 and OPT-09 both pass, route the localizer sub-agent to adapter L and the coder to adapter F/R, using vLLM's per-request adapter selection (max_loras 8).

**Hypothesis H12.** Role-specific adapters beat one merged adapter by ≥ 2 on held-out because the two behaviours conflict in a single low-rank update.

### Task sequence

| ID | Task | Subtasks | Est (hh:mm) | Output |
| --- | --- | --- | ---: | --- |
| 12.1 | YAML routing | Per-agent `model` references to adapter names; confirm the harness passes the adapter name per request | 02:00 | `agent.yaml` v3 |
| 12.2 | Load test | Both adapters resident; KV capacity check | 01:00 | Receipt |
| 12.3 | Dev run | | 00:30 + wall 05:00 | Metrics |
| 12.4 | Held-out canary | vs best single-adapter candidate | 00:30 + wall 05:00 | Receipt |
| 12.5 | Analysis | | 02:00 | Receipt |
| 12.6 | Merge alternative | Train one adapter on the union data mix as the comparison arm | 02:00 + wall 12:00 | Adapter M-v1 |
| 12.7 | Dry run | | 00:30 + wall 11:00 | Wall receipt |
| 12.8 | Package | | 01:30 | Candidate G |
| 12.9 | Documentation | | 01:00 | Card |
| | **Total** | | **11:00** + 09:00 contingency = **20:00**; wall ≈ 33 h | |

### Unit test plan

| Test | Procedure | Expected |
| --- | --- | --- |
| U12-1 Routing | Log shows adapter name per request matches the agent | 100% |
| U12-2 KV capacity | Two adapters resident | Not lower than one adapter by > 10% |
| U12-3 Canary | Held-out vs single adapter | ≥ +2 |

### Milestones and GO/NO-GO

| Milestone | Criterion | GO | NO-GO pivot |
| --- | --- | --- | --- |
| M12-A (only if M08-C and M09-C passed) | U12-1, U12-2 pass | Dev run | If routing is not honoured by the harness: use the merged adapter M-v1 only |
| M12-B | U12-3 ≥ +2 | Candidate G is a final-two contender | If not: ship the merged adapter if it beats single; otherwise single |

---

## OPT-13 — Paper-track package (two-fault benchmark, hunk-subset masking, classifier ablation, Writeup)

**Objective.** A 3,000-word Kaggle Writeup by Nov 10 with measured, receipted results that score well on Novelty, Quality, Relevance, Verifiability and Clarity; plus a public artifact (code, ledgers, benchmark) that doubles as a "Best New Resource" candidate.

**Hypothesis (paper thesis, testable).** Exception-class conditioning and gate-as-topology change where a 31B agent spends its turns; their effect is bounded by classifier fidelity (S(K,f)) and by masking structure (hitting-set depth). The paper reports the measured S(K,f) curve for K ∈ {1,3,4}, the random-category control, the handoff ablation, and masking behaviour on a constructed two-fault benchmark.

### Experiment package

| Experiment | Source idea | Design | Est (hh:mm) |
| --- | --- | --- | ---: |
| E1 Classifier ablation | OPT-11 | K ∈ {1,3,4} + random control on dev and held-out; report resolved, turns-to-locate, I(class; file bucket) | reuses OPT-11 (+02:00 analysis) |
| E2 Handoff ablation | OPT-05 | Flat vs topology vs topology-without-packets; gate funnel | reuses OPT-05 (+02:00) |
| E3 Two-fault benchmark | Unit 13 | Find task pairs sharing a base_commit (both gold patches applicable); create 2-fault instances by withholding both patches; measure (a) does the agent fix one, both, none; (b) order of fixing vs the masking relation observed by applying each gold patch alone | 06:00 + wall 10:00 |
| E4 Hunk-subset masking | Unit 12 | For multi-hunk gold patches (71/129), apply each hunk subset and record which tests pass; derive the empirical masking DAG; report how often a partial fix is "silent" (no test change) | 05:00 + wall 06:00 |
| E5 Ceiling ladder | OPT-07 | L0–L3 numbers as the "where the score is lost" figure | reuses (+01:00) |
| E6 Adapter transfer study | OPT-08 | bf16-trained adapter on QAT weights: KL and task deltas (a reusable resource finding) | reuses (+02:00) |

### Task sequence

| ID | Task | Subtasks | Est (hh:mm) | Output |
| --- | --- | --- | ---: | --- |
| 13.1 | Pre-registration | Write hypotheses, metrics, stopping rules, and the Nov 5 freeze date; commit hash | 02:00 | `prereg.md` |
| 13.2 | E3 build | Pair finder over `tasks.jsonl`; instance builder; replay check | 06:00 + wall 10:00 | Benchmark v1 |
| 13.3 | E4 build | Hunk splitter; subset runner; DAG extractor | 05:00 + wall 06:00 | Masking tables |
| 13.4 | Run E3/E4 with the best candidate | | 01:00 + wall 12:00 | Ledgers |
| 13.5 | Analyses E1–E6 | Tables, CIs, figures (one per experiment) | 07:00 | Figures |
| 13.6 | Math section | Tighten unit 3's S(K,f) and Möbius index with unit 16's hitting-set formulation and unit 11's DPI bound; every symbol defined; no theorem claimed beyond what is derived | 04:00 | Draft section |
| 13.7 | Related work | 12–15 verified citations from `06_Research_Verification_Log.md` only (Debroy & Wong 2009; DiGiuseppe & Jones 2011/2015; Zheng 2006; BARINEL; FLITSR 2023/2025; Callaghan 2026; Al-Bataineh 2024/2025; An 2021; Nashid 2025; ChainSWE 2026; Herzig 2013; OpenAI 2026) | 03:00 | Draft section |
| 13.8 | Draft (≤ 3,000 words) | Abstract, problem, method, experiments, limitations, artifact | 06:00 | Draft 3 |
| 13.9 | Verifiability pass | Every number has a receipt id; artifact repo with ledgers, configs, benchmark, scripts; licence Apache-2.0 | 03:00 | Artifact |
| 13.10 | Two Writeups | Writeup A (method + results), Writeup B (resource: the two-fault benchmark + masking tables); submit both by Nov 10 | 02:00 | Submissions |
| 13.11 | Buffer | | 01:00 | — |
| | **Total** | | **40:00** + wall ≈ 28 h | |

### Unit test plan (for the paper's artifact)

| Test | Procedure | Expected |
| --- | --- | --- |
| U13-1 Receipts | Script scans the draft for numbers and checks each has a receipt id in the ledger | 100% |
| U13-2 Word count | Writeup body | ≤ 3,000 |
| U13-3 Benchmark replay | Each two-fault instance: both gold patches applied → tests pass | 100% |
| U13-4 Reproduce one table | Fresh clone, one script | Table E1 regenerated within CI noise |
| U13-5 No retracted numbers | grep for 30-vs-10, 66.7%, 0.388, 40.6% | 0 hits |

### Milestones and GO/NO-GO

| Milestone | Criterion | GO | NO-GO pivot |
| --- | --- | --- | --- |
| M13-A (Oct 24) | Pre-registration committed; E3 has ≥ 20 valid pairs | Build | If < 10 pairs: replace E3 with a synthetic two-fault set built by injecting two independent mined bugs into one snapshot |
| M13-B (Nov 5) | E1, E2, E5 measured; E3/E4 at least partially | Freeze and write | If E1 is null: the paper's thesis becomes "bounds and a negative result with controls"; still submit |
| M13-C (Nov 10) | U13-1..5 pass | Submit both Writeups | If only one is ready, submit it; tie-break favours earlier entries |

---

## OPT-14 — Reinforcement learning (GRPO/PPO) — PARKED

**Why parked.** On-policy RL for a 31B model needs rollouts from the policy under training plus optimizer state; even with LoRA and nf4 base, a single 5090 cannot hold policy + reference + rollouts at useful context lengths, and the sandboxed environment steps (minutes each) make sample throughput far too low for six weeks. Unit 10's "8 parallel envs on one 5090" is not achievable.

**Revisit conditions (all required).** (1) A rented 8×80 GB node for ≥ 5 days is affordable; (2) OPT-10 produced ≥ 3,000 verified trajectories and a stable reward (test pass) pipeline; (3) at least two weeks remain before the entry deadline. If revisited: start from the R adapter, use rejection-sampling fine-tuning (RFT) rather than PPO as the first step, and keep the same canary gate.

## OPT-15 — Hand-built GraphRAG / PPR over the NetworkX graphs — PARKED

**Why parked.** The graphs contain only `calls` edges and nodes carry id/name/text; the harness already exposes them through three tools; a competitor-side index cannot be shipped as a tool (declarative YAML only) and would have to be a skill script that duplicates `get_code_neighbors`. The localisation gains are better pursued through OPT-02 (doctrine) and OPT-09 (adapter).

**Revisit condition.** If the ceiling ladder shows the file-oracle gain (L1 − L3) is still ≥ 6 tasks after OPT-02 and OPT-09, build a `locate_graph.py` skill that pre-ranks nodes by identifier overlap and prints the top 10 with their `calls` neighbours (≈ 08:00).

---

## Consolidated LoRA milestone board

| Date | Gate | Pass condition | If failed |
| --- | --- | --- | --- |
| Oct 23 | Pipeline ready | UP-1..8 pass | Rent 80 GB GPU for transfer-safe training |
| Oct 30 | Format adapter | U08-4 ≥ +2 | Ship prompt-only; continue to localisation |
| Nov 3 | Localisation adapter | U09-5 ≥ +2 and OOD holds | Drop; keep mined data |
| Nov 5 | Paper freeze | All measured tables receipted | Report nulls |
| Nov 13 | Repair adapter | U10-4 ≥ +2 and U10-5 holds | Ship F/L only |
| Nov 20 | Dual adapters | U12-3 ≥ +2 | Ship best single/merged |
| Nov 30 | Final two | Highest public score with guard pass; second = most different architecture (flat vs topology) | — |


---

<!-- ====================================================================== -->
<!-- FILE: 04_Special_3_Open_Questions_Roundup.md -->
<!-- ====================================================================== -->

# Special Section 3 — Round-up of Open Questions

**Date:** 2026-10-01. Questions are collected from the contender files (attributed by unit number), from the council's own verification gaps (`06_Research_Verification_Log.md`), and from the project plans in `03a`/`03b`. Each row names who can answer it, how, and which option it blocks. Priority: **P1** blocks a submission or a paper claim; **P2** changes a plan decision; **P3** nice to know.

## A. Scoring harness and environment

| # | Question | Raised by | Why it matters | How to resolve | Blocks | Pri |
| --- | --- | --- | --- | --- | --- | --- |
| A1 | Are the KV-cache collapse (≈ 7.6k tokens with LoRA) and the LoRA silent-zeroing bugs fixed in the current scoring image? | 10, 11, 15, 16; council | Decides whether any adapter can be shipped and what `max_model_len` the agent can rely on | Read the two forum threads (bodies were unreadable to the council); submit the loud adapter and inspect the returned trajectory lengths | OPT-08..12 | P1 |
| A2 | Which eval_config defaults apply when fields are omitted: README's 60 min / 100 calls, or the host's "no limit" (unit 11)? | 11, 12 | A 60-minute default × 120 tasks would be a 120-hour run | Always set all four fields explicitly; ask on the forum | OPT-01 | P1 |
| A3 | Is the 12-hour limit enforced as a hard error for the whole run, or are completed tasks scored? | 9, 11, 13 | Determines the safety margin needed | Forum thread "Scoring-run questions"; the 120-task dry run with margin | OPT-01 | P1 |
| A4 | Is the thinking-drop bug (reasoning_content ignored between tool calls) patched, and does `include_thoughts` in config change behaviour? | 10, 11, 16 | Decides the thinking on/off default | Thread by KE WU with staff reply; the thinking sweep in OPT-01 | OPT-01 | P2 |
| A5 | Do tool results arrive double-JSON-encoded in the scoring environment for all tools or only some (unit 11's 22% / 62% / 0% split)? | 10, 11, 16 | Decides whether the escaping protocol is needed and for which tools | Local reproduction (OPT-03 task 03.2); inspect returned trajectories | OPT-03, OPT-08 | P2 |
| A6 | Exact sandbox setup time per task on the scoring hardware (unit 16 claims ≈ 6 min measured; the council could not verify) | 16, 15 | Setup dominates the 12 h budget | Zero-census (OPT-00) locally; compare with the stub submission's wall time | OPT-01 | P1 |
| A7 | Are the 12 forum-reported "dead" public tasks dead on the scoring side too, and are hidden tasks similarly affected? | 11, 13 | Affects the public/private denominator and CV trust | Gold replay locally; forum thread on gold-patch failures | OPT-07 | P2 |
| A8 | Does the harness honour a per-agent `model`/adapter name so that sub-agents can use different LoRAs? | council (OPT-12) | Decides the dual-adapter design | Inspect the harness's request construction; test locally with two adapters | OPT-12 | P2 |
| A9 | Does the compaction interval default to 5 (README) or 15 (notebook), and is the threshold 14,336 tokens? | 3, 11 | Context hygiene settings | Read the harness source; sweep in OPT-04 | OPT-04 | P3 |
| A10 | What exactly is in the untracked-file rule: are files under `/tmp` ever included in the patch, and are new files under `/workspace` always included? | 3, 9, 13 | Spec cards and breadcrumbs must not leak into patches | Local test with the fallback diff | OPT-05 | P2 |
| A11 | Is `search_similar_code` strictly a symbol-name key lookup or does it fall back to embedding similarity for unknown strings? | 3, 12 | Retrieval doctrine | 20 probes in OPT-02 | OPT-02 | P2 |
| A12 | Does the scoring image's patched vLLM 0.19.1 support LoRA on `Gemma4ForConditionalGeneration` identically to upstream (upstream support landed after 0.19.0)? | council | Adapter loading | Loud-adapter submission; forum | OPT-08 | P1 |
| A13 | Is the "max 3 consecutive no-tool-call turns" nudge counted against `max_turns`? | 3 | Budget arithmetic | Harness source | OPT-01 | P3 |

## B. Dataset and task distribution

| # | Question | Raised by | Why it matters | How to resolve | Blocks | Pri |
| --- | --- | --- | --- | --- | --- | --- |
| B1 | How many tasks are on the public board (≈ 58–60 per community EDA) and how many hidden tasks come from private repos? | 3, 13, 14 | Score granularity and generalisation strategy | Forum EDA threads; the organiser statement | Interpretation of every LB number | P2 |
| B2 | Do hidden private-repo tasks resemble the public profile (71% single-file, median 12 lines, 34/129 docs_src)? | 3, 12 | Decides how much repo-specific tuning is worth | Cannot be resolved directly; use the OOD split and external mined repos as proxies | OPT-09, OPT-10 | P2 |
| B3 | How many task pairs share a base_commit with mutually applicable gold patches (unit 13's two-fault benchmark)? | 13 | Feasibility of E3 | Script over `tasks.jsonl` (OPT-13 task 13.2) | OPT-13 | P2 |
| B4 | Is the 72% isolated-node figure for fastapi graphs correct, and does it hold for rich/requests? | 3 | Value of graph tools | Re-measure from the graph files | OPT-02 | P3 |
| B5 | What share of problem statements contains a test name or a reproducible snippet? | 2, 12 | Test-first vs grep-first doctrine | Regex census (OPT-02 task 02.1) | OPT-02 | P3 |

## C. LoRA training and transfer

| # | Question | Raised by | Why it matters | How to resolve | Blocks | Pri |
| --- | --- | --- | --- | --- | --- | --- |
| C1 | Does an adapter trained on nf4-quantised bf16 weights transfer to the QAT w4a16 checkpoint without measurable degradation? | 9, 12, council | Whether the 5090 pipeline is valid | P.8 transfer KL test; pivot to 80 GB rental | OPT-08..12 | P1 |
| C2 | Can PEFT train directly against the compressed-tensors checkpoint (frozen W4A16 + LoRA), avoiding the transfer question? | 9 | Simpler pipeline if yes | Try loading with `compressed-tensors` in transformers and attaching PEFT; expect no gradient path for quantised linears | OPT-08 | P2 |
| C3 | What LoRA rank is needed for behaviour change on a 31B model at 2–5k samples: 16, 32 or 64? | 1, 2, 10, 12 | Size vs effect | Rank sweep inside OPT-08 (cheap) | OPT-08 | P3 |
| C4 | Does Gemma 4's tool-call format require preserving special tokens in training data, and does the chat template render tool results identically to vLLM's runtime? | council | Train/serve mismatch | Golden-sample round trip (UP-3) | OPT-08 | P1 |
| C5 | Are public trajectory sets (SWE-smith, SWE-Gym, R2E-Gym) licensed for fine-tuning and "reasonably accessible" under the rules? | 9, 16, council | Rule compliance | Read each licence; record in ledger | OPT-09, OPT-10 | P1 |
| C6 | Do any hosted open-model APIs permit training on outputs (for teacher data), and does using them conflict with the Apache-2.0 winner licence obligation? | 1, 8, 9, 16 | OPT-10 teacher arm | Read provider ToS; default to self-distillation | OPT-10 | P2 |
| C7 | How much do the 129 public tasks leak into mined history (same commits)? | council | Leakage control | Dedupe by base_commit and hunk hash (U09-2) | OPT-09 | P2 |

## D. Agent design (BCF)

| # | Question | Raised by | Why it matters | How to resolve | Blocks | Pri |
| --- | --- | --- | --- | --- | --- | --- |
| D1 | Does a tool-scoped sub-agent topology cost more turns than it saves at a 5–6 minute budget? | 3, 12, 11 | Flat vs topology decision | OPT-05 paired dev run and handoff ablation | OPT-05 | P2 |
| D2 | Will the model call skill scripts (patch tool, pre-flight, runtests) reliably, given that gates cannot be enforced? | 9, 15 | Whole skill strategy | Skill-call rates in OPT-03/04 ledgers | OPT-03, OPT-04 | P2 |
| D3 | Does the exception-class prior carry information when 0/129 statements contain tracebacks? | 3, 9, 13 | Core thesis | OPT-11 information test with permutation CI and random control | OPT-11, OPT-13 | P1 |
| D4 | What is the right K: 3, 4, or data-driven (unit 15's k*, unit 16's K*)? | 15, 16 | Classifier design | K sweep in OPT-11 | OPT-11 | P3 |
| D5 | Is early `submit_patch` with the best-known diff better than letting the fallback diff fire on timeout? | 3, 11 | Rescue policy | OPT-06 dev run | OPT-06 | P3 |
| D6 | Should `run_command` be restricted (by prompt) for the localizer to grep/ls only, or allowed to run tests? | 12, 7 | Budget and safety | Gate-funnel analysis | OPT-05 | P3 |

## E. Paper track

| # | Question | Raised by | Why it matters | How to resolve | Blocks | Pri |
| --- | --- | --- | --- | --- | --- | --- |
| E1 | Is the 3,000-word cap official, and does it include tables and references? | 3, 11, council (not surfaced by search) | Draft length | Read the Kaggle paper-track Overview/Rules tabs | OPT-13 | P1 |
| E2 | Are two Writeups per team judged (unit 11's intel) and does the earlier entry win ties? | 11, 16 | Submission strategy | Paper-track rules page | OPT-13 | P2 |
| E3 | Must the paper's results come from the official scoring environment, or are local runs acceptable if receipted? | council | Verifiability score | Rules page; default to local runs with full receipts plus public-board numbers | OPT-13 | P2 |
| E4 | Is a negative result (classifier adds nothing beyond structure) competitive under the rubric? | 9, 13 | Risk management | Judge roster is graph-ML heavy; Verifiability and Quality reward clean controls; proceed either way | OPT-13 | P3 |
| E5 | Will the "Best New Resource" category accept a benchmark built from the competition's own public tasks? | council | Second Writeup | Rules page | OPT-13 | P3 |

## F. Hardware and operations

| # | Question | Raised by | Why it matters | How to resolve | Blocks | Pri |
| --- | --- | --- | --- | --- | --- | --- |
| F1 | Does Docker-in-WSL2 with GPU pass-through run the harness sandboxes at the needed throughput on the Main rig while vLLM is serving? | 3, 6, 12 | Day-0 viability | Day-0 tests U00-1..3 | OPT-00 | P1 |
| F2 | Can AUX 2 (3080, 10 GB) run harness sandboxes against Main's vLLM over LAN without I/O contention? | 8, 12 | Parallel data collection | Zero-census on AUX 2 | OPT-10 | P2 |
| F3 | What is the realistic local inference throughput (tokens/s) for the 31B w4a16 on a 5090 at 32k context, and does it make the 120-task dry run ≤ 12 h locally? | 15 | Dry-run validity | Measure in OPT-00 | OPT-01 | P2 |
| F4 | Is a short 80 GB GPU rental needed (adapter transfer, or bf16 training), and what is the budget? | council | Contingency | Decide at M08-A | OPT-08 | P3 |
| F5 | Kaggle queue times for scoring (unit 10 claims 4–13 h) and the practical daily submission cadence | 10 | Planning | Observe the stub submission | Calendar | P3 |

## G. Verification gaps the council could not close this session

| # | Item | Status |
| --- | --- | --- |
| G1 | Bodies of the Kaggle discussion threads (743063, KE WU's thinking thread, the LoRA-wiped thread) | Titles confirmed; bodies not readable (403) |
| G2 | Paper-track word cap and two-Writeup rule | Rubric and prizes confirmed; cap not surfaced |
| G3 | Debroy & Wong 33.12% / 3,267 data points (unit 12) | Paper real; figure not located |
| G4 | LivePlan +9.9%, SWE-PRM +10.6, FailFast 3.4× | Papers real; figures not re-checked |
| G5 | "Steimann 2013 failure shadowing" term | Paper real; term not confirmed |
| G6 | Unit 15's "fresh intel D1–D6" | No manifest; partly overlaps known thread titles |
| G7 | Unit 16's "setup ≈ 6 min/task measured" | No receipt |


---

<!-- ====================================================================== -->
<!-- FILE: 05_Special_4_Content_Checklist_Matrix.md -->
<!-- ====================================================================== -->

# Special Section 4 — Checklist-Style Content Comparison Matrix

**Date:** 2026-10-01. Legend: ✓ present and substantive · ◐ present but partial/thin · ✗ absent · n/a the question was not asked to that unit. Judgements are about **presence of content**, not quality (quality is scored in `01_Council_Report.md`).

## A. Content present per contender unit (side by side)

### A1. Units 1–8

| Content item | 1 gemini31pro | 2 gemini38flash | 3 cc-opus55 | 4 gemini31pro-antigrav | 5 gemini38flash-antigrav | 6 antigrav-b1 | 7 antigrav-b2 | 8 web-qwen38max |
| --- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Roadmap / phases | ◐ | ✓ | ✓ | ◐ | ✓ | ✓ | ✓ | ✓ |
| Master checklist | ◐ | ✓ | ✓ | ◐ | ✓ | ✓ | ✓ | ✓ |
| Milestones with numeric gates | ✗ | ◐ | ✓ | ◐ | ◐ | ✓ | ✓ | ◐ |
| Kill criteria / NO-GO rules | ✗ | ✗ | ✓ | ✗ | ◐ | ◐ | ◐ | ✗ |
| Day-0 BIOS/OS/WSL/Docker commands | ✗ | ✗ | ✓ | ◐ | ✓ | ✓ | ✓ | ◐ |
| vLLM serve command with Gemma 4 flags | ✗ | ✗ | ✓ | ✗ | ◐ | ✓ | ◐ | ✗ |
| Harness install and run commands | ✗ | ✗ | ✓ | ✗ | ◐ | ✓ | ✓ | ✗ |
| Hardware allocation (Main/AUX1/AUX2) | ◐ | ✗ (wrong HW) | ✓ | ◐ | ✓ | ✓ | ✓ | ✓ |
| Six sprint plan with daily/weekly tables | ◐ | ✗ | ✓ | ◐ | ✓ | ✓ | ✓ | ◐ |
| eval_config numbers | ✗ | ◐ | ✓ | ✗ | ✓ (wrong) | ✓ (wrong) | ✓ (wrong) | ✗ |
| 12-hour budget arithmetic | ✗ | ◐ | ✓ | ✗ | ✗ | ◐ | ✗ | ✗ |
| Dataset profiling (counts, lines, files) | ✗ | ✗ | ✓ | ✗ | ◐ | ◐ | ◐ | ✗ |
| Tool semantics (9 tools, limits) | ◐ | ◐ | ✓ | ◐ | ✓ | ✓ | ✓ | ◐ |
| Anti-tamper / untracked-file rules | ✗ | ✗ | ✓ | ✗ | ✓ | ✓ | ✓ | ✗ |
| Forum / discussion-board intel | ✗ | ✗ | ◐ | ✗ | ✗ | ✗ | ✗ | ✗ |
| Agent architecture (YAML topology) | ◐ | ◐ | ✓ | ◐ | ✓ | ✓ | ✓ | ◐ |
| Skills / scripts specified | ✗ | ✗ | ✓ | ◐ | ✓ | ✓ | ✓ | ◐ |
| Prompt doctrine (retrieval/edit/escaping) | ✗ | ◐ | ✓ | ✗ | ✓ | ✓ | ◐ | ◐ |
| LoRA plan (data, rank, size) | ◐ | ◐ | ✓ | ◐ | ✓ | ✓ | ✓ | ◐ |
| Adapter canary / gating | ✗ | ✗ | ✓ | ✗ | ◐ | ◐ | ◐ | ✗ |
| Training-data sourcing and licence note | ◐ | ◐ | ✓ | ✗ | ◐ | ◐ | ◐ | ◐ |
| Local evaluation protocol (splits, controls) | ✗ | ◐ | ✓ | ✗ | ◐ | ✓ | ✓ | ◐ |
| Failure taxonomy / ledger | ✗ | ◐ | ✓ | ✗ | ◐ | ✓ | ✓ | ◐ |
| Gold-patch replay / reference check | ✗ | ✗ | ✓ | ✗ | ◐ | ✓ (invented cmd) | ◐ | ✗ |
| BCF technique-by-technique integration | ◐ | n/a | ✓ | ◐ | ✓ | ✓ | ✓ | n/a |
| Test per BCF technique | ◐ | n/a | ✓ | ◐ | ◐ | ✓ | ✓ | n/a |
| BCF corrections / conflicts list | ✗ | n/a | ✓ | ✗ | ◐ | ◐ | ◐ | n/a |
| Whitepaper brainstorm | ◐ | n/a | ✓ | ◐ | ✓ | ✓ | ✓ | n/a |
| Whitepaper draft text | ✗ | n/a | ✓ | ◐ | ✓ | ✓ | ✓ | n/a |
| Paper-track rules (rubric/word cap/deadline) | ✗ | ◐ (wrong) | ✓ | ✗ | ◐ (wrong) | ◐ (wrong) | ◐ (wrong) | ✗ |
| Math: names the phenomenon | ✓ | n/a | ✓ | ◐ | ✓ | ✓ | ✓ | n/a |
| Math: closed forms / derivations | ◐ | n/a | ✓ | ✗ | ✓ | ✓ | ◐ | n/a |
| Math: fault interference | ◐ | n/a | ✓ | ◐ | ✓ | ✓ | ◐ | n/a |
| Math: fault masking | ◐ | n/a | ✓ | ◐ | ✓ | ✓ | ◐ | n/a |
| Math: chained / multi-step issues | ◐ | n/a | ✓ | ◐ | ✓ | ✓ | ✓ | n/a |
| httpx_6821 handled as invented/illustrative | ✗ | n/a | ✓ | ✓ | ✗ | ✗ | ✗ | n/a |
| Real-task simulation (httpx_3672) | ✗ | n/a | ✗ | ✗ | ✗ | ✗ | ✗ | n/a |
| Prior-research survey | ✓ | n/a | ✓ | ◐ | ✓ | ✓ | ◐ | n/a |
| Citations with DOIs/arXiv ids | ✗ | n/a | ◐ | ✗ | ✗ | ✗ | ✗ | n/a |
| Relevance mapping of prior work to BCF | ✓ | n/a | ✓ | ◐ | ◐ | ◐ | ◐ | n/a |
| Evidence tags (M/D/I/H or V/SIM) | ◐ | ✗ | ✓ | ✗ | ◐ (misused) | ◐ | ◐ (misused) | ✗ |
| Results tables | ✗ | ✗ | ✗ (none claimed) | ✗ | ✓ (fabricated) | ✓ (projected) | ✓ (fabricated) | ✗ |
| QC report / README | ✗ | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| Catalog / FOSS ranking extras | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| Open-questions list | ◐ | ✗ | ✓ | ✗ | ◐ | ◐ | ◐ | ✗ |

### A2. Units 9–16

| Content item | 9 gpt61sol | 10 nemotron3ultra | 11 cc-glm53max | 12 cc-grok47 | 13 mimo26pro | 14 kimiK3 | 15 deepseekV41flash | 16 cc-glm53flash |
| --- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Roadmap / phases | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Master checklist | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Milestones with numeric gates | ◐ (no targets by design) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Kill criteria / NO-GO rules | ✓ | ◐ | ✓ | ✓ | ✓ | ◐ | ✓ | ✓ |
| Day-0 BIOS/OS/WSL/Docker commands | ◐ | ◐ | ✓ | ✓ | ◐ | ◐ | ◐ | ✓ |
| vLLM serve command with Gemma 4 flags | ◐ | ◐ | ✓ | ✓ | ◐ | ◐ | ◐ | ✓ |
| Harness install and run commands | ◐ | ◐ | ✓ | ✓ | ◐ | ◐ | ◐ | ✓ |
| Hardware allocation (Main/AUX1/AUX2) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Six sprint plan with daily/weekly tables | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| eval_config numbers | ◐ (ranges) | ✓ (wrong) | ✓ | ✓ | ✓ | ✓ (wrong) | ✓ | ✓ (wrong) |
| 12-hour budget arithmetic | ✓ | ◐ | ✓ | ✓ | ✓ | ◐ | ✓ | ◐ |
| Dataset profiling | ◐ | ◐ (wrong) | ✓ | ✓ | ◐ | ◐ | ◐ | ◐ |
| Tool semantics | ✓ | ◐ | ✓ | ✓ | ✓ | ◐ | ✓ | ◐ (errors) |
| Anti-tamper / untracked-file rules | ✓ | ◐ | ✓ | ✓ | ✓ | ◐ | ✓ | ✓ |
| Forum / discussion-board intel | ◐ | ✓ | ✓ (manifest) | ◐ | ◐ | ◐ | ✓ (no manifest) | ✓ |
| Agent architecture (YAML topology) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Skills / scripts specified | ✓ | ◐ | ✓ | ✓ | ✓ | ◐ | ✓ | ✓ |
| Prompt doctrine (retrieval/edit/escaping) | ✓ | ✓ | ✓ | ✓ | ✓ | ◐ | ✓ | ✓ |
| LoRA plan (data, rank, size) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Adapter canary / gating | ✓ | ◐ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Training-data sourcing and licence note | ✓ | ◐ | ✓ | ✓ | ◐ | ◐ | ◐ | ◐ |
| Local evaluation protocol | ✓ | ◐ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Failure taxonomy / ledger | ✓ | ◐ | ✓ | ✓ | ✓ | ◐ | ✓ | ✓ |
| Gold-patch replay / reference check | ✓ | ◐ | ✓ | ✓ | ✓ | ◐ | ✓ | ✓ (invented cmd) |
| BCF technique-by-technique integration | ✓ | ◐ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Test per BCF technique | ✓ | ◐ | ✓ | ✓ | ✓ | ◐ | ✓ | ✓ |
| BCF corrections / conflicts list | ✓ | ◐ | ✓ | ✓ | ✓ | ◐ | ✓ | ✓ |
| Whitepaper brainstorm | ✓ | ◐ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Whitepaper draft text | ◐ | ◐ | ◐ | ◐ | ◐ | ◐ | ◐ | ◐ |
| Paper-track rules (rubric/word cap/deadline) | ✓ | ✓ | ✓ | ◐ (not fetched) | ✓ | ◐ | ✓ | ✓ |
| Math: names the phenomenon | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Math: closed forms / derivations | ✓ | ◐ | ✓ | ✓ | ✓ | ◐ | ✓ | ✓ |
| Math: fault interference | ✓ | ◐ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Math: fault masking | ✓ | ◐ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Math: chained / multi-step issues | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| httpx_6821 handled as invented/illustrative | ✓ | ✗ | ✓ (borderline) | ✓ | ✓ | ✓ | ✓ | ✓ (borderline) |
| Real-task simulation (httpx_3672) | ◐ (analysis) | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ | ✓ |
| Prior-research survey | ✓ | ◐ | ✓ | ✓ | ✓ | ◐ | ✓ | ◐ |
| Citations with DOIs/arXiv ids | ✓ | ✗ | ✓ | ✓ | ✓ | ◐ | ✓ | ◐ |
| Relevance mapping of prior work to BCF | ✓ | ◐ | ✓ | ✓ | ✓ | ◐ | ✓ | ◐ |
| Evidence tags (M/D/I/H or V/SIM) | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | ◐ |
| Results tables | ✗ | ✓ (fabricated) | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| QC report / README | ✗ | ✗ | ✓ | ✓ | ✗ | ✗ | ✗ | ◐ |
| Catalog / FOSS ranking extras | ✗ | ✗ | ✓ | ✓ | ✗ | ✗ | ✗ | ✓ |
| Open-questions list | ✓ | ◐ | ✓ | ✓ | ✓ | ◐ | ✓ | ◐ |

## B. Per-file content inventory

Content tags: RM roadmap/checklist · MP master plan/Day-0/sprints · HW hardware allocation · EV evaluation protocol · LR LoRA plan · BCF BCF integration · WP whitepaper · MATH math/phenomena · PR prior research · INTEL forum/paper-track intel · SIM real-task simulation · CAT catalog ranking · QC QC/README · RES results tables (F = fabricated, P = projected).

| Unit | File | Size | Tags |
| --- | --- | ---: | --- |
| 1 | `kagglecom_bcf_instantplan_[web-gemini31pro-38flash].md` | 36 kB | RM, MP(thin), HW, LR, BCF, WP, MATH, PR |
| 2 | `kagglecom_bcf_instantplan_[web-gemini38flash].md` | 33 kB | RM, MP(wrong HW; corrected answer empty), EV(partial), LR |
| 3 | `2026-09-30/00_README.md` | 4 kB | QC |
| 3 | `2026-09-30/01_Roadmap_and_Master_Checklist.md` | 45 kB | RM, EV, LR, INTEL(dataset facts) |
| 3 | `2026-09-30/02_Master_Plan_Day0_to_Final_Submission.md` | 53 kB | MP, HW, EV, LR |
| 3 | `2026-09-30/03_QC_Report.md` | 4 kB | QC |
| 3 | `2026-09-30_BCF/00_README.md` | 4 kB | QC |
| 3 | `2026-09-30_BCF/01_BCF_Review_Integration_and_Whitepaper_Brainstorm.md` | 45 kB | BCF, WP, INTEL(paper rubric) |
| 3 | `2026-09-30_BCF/02_BCF_Fault_Class_Math_Whitepaper_Content.md` | 41 kB | MATH, WP |
| 3 | `2026-09-30_BCF/03_Prior_Research_Fault_Interference_Masking.md` | 33 kB | PR |
| 3 | `2026-09-30_BCF/04_QC_Report.md` | 4 kB | QC |
| 4 | `afterQ1/kaggle_gemma4_roadmap.md` | 7 kB | RM, MP(thin), HW |
| 4 | `afterQ2/kaggle_gemma4_roadmap.md` (= afterQ3 copy) | 7 kB | RM, MP(thin), BCF |
| 4 | `afterQ2/bcf_integration_and_whitepaper.md` (= afterQ3 copy) | 5 kB | BCF, WP |
| 4 | `afterQ3/whitepaper_draft_math_prior_research.md` | 7 kB | MATH, PR(thin) |
| 5 | `afterQ1/00_EXECUTIVE_SUMMARY_AND_ROADMAP.md` | 14 kB | RM (BCF misdefined), RES(F) |
| 5 | `afterQ1/01_MASTER_PLAN_DAY0_TO_SPRINT6.md` | 17 kB | MP, HW, EV |
| 5 | `afterQ1/02_BCF_DEEP_INTEGRATION_AND_TECHNIQUES.md` | 13 kB | BCF |
| 5 | `afterQ1/03_MATHEMATICAL_FOUNDATIONS_AND_FAULT_INTERFERENCE.md` | 12 kB | MATH, PR |
| 5 | `afterQ1/04_WHITEPAPER_COMPETITION_DRAFT3_PROPOSAL.md` | 14 kB | WP, RES(F) |
| 5 | `afterQ2/00..04` (afterQ3 = same four files + revised 03/04) | 17/17/15/13–19/13–18 kB | RM, MP, BCF, MATH, WP, RES(F) |
| 6 | `00_EXECUTIVE_SUMMARY_AND_ROADMAP.md` | 14 kB | RM, HW |
| 6 | `01_MASTER_PLAN_DAY0_TO_SPRINT6.md` | 21 kB | MP, EV, LR (invented CLI) |
| 6 | `02_BCF_DEEP_INTEGRATION_AND_TECHNIQUES.md` | 17 kB | BCF |
| 6 | `03_MATHEMATICAL_FOUNDATIONS_AND_FAULT_INTERFERENCE.md` | 20 kB | MATH, PR, SIM(invented task) |
| 6 | `04_WHITEPAPER_COMPETITION_DRAFT3_PROPOSAL.md` | 14 kB | WP, RES(P), rules(wrong) |
| 7 | `00_EXECUTIVE_SUMMARY_AND_ROADMAP.md` | 17 kB | RM, HW, RES(F) |
| 7 | `01_MASTER_PLAN_DAY0_TO_SPRINT6.md` | 26 kB | MP, EV(impossible strata), RES(F) |
| 7 | `02_BCF_DEEP_INTEGRATION_AND_TECHNIQUES.md` | 15 kB | BCF (verifier-owns-submit) |
| 7 | `03_MATHEMATICAL_FOUNDATIONS_AND_FAULT_INTERFERENCE.md` | 17 kB | MATH, PR(fabricated entries) |
| 7 | `04_WHITEPAPER_COMPETITION_DRAFT3_PROPOSAL.md` | 12 kB | WP, RES(F), rules(wrong) |
| 8 | `kagglecom_bcf_instantplan_[web-qwen38max].md` | 12 kB | RM, MP(thin), HW, LR |
| 9 | `kagglecom_bcf_instantplan_[genspark-gpt61sol].md` | 96 kB | RM, MP, HW, EV, LR, BCF, WP, MATH, PR, INTEL(743063) |
| 10 | `kagglecom_bcf_instantplan_[genspark-nemotron3ultra].md` | 51 kB | RM, MP, HW, LR, BCF, MATH, PR(fabricated entries), INTEL, RES(F) |
| 11 | `2026-09-30/00-README.md` | 3 kB | QC |
| 11 | `2026-09-30/01-roadmap-and-master-checklist.md` | 22 kB | RM, EV, LR, INTEL |
| 11 | `2026-09-30/02-master-plan-day0-six-sprints.md` | 18 kB | MP, HW |
| 11 | `2026-09-30/03-discussion-board-intel.md` | 20 kB | INTEL(manifest) |
| 11 | `2026-09-30/04-paper-track-intel.md` | 10 kB | INTEL(paper) |
| 11 | `2026-09-30-2/100-README.md` | 3 kB | QC |
| 11 | `2026-09-30-2/101-bcf-integration-into-master-plan.md` | 27 kB | BCF, WP |
| 11 | `2026-09-30-2/102-bcf-diagnostic-math-and-prior-research.md` | 47 kB | MATH, PR |
| 11 | `2026-09-30-2/103-bcf-simulation-httpx-3672.md` | 29 kB | SIM(real task) |
| 11 | `2026-09-30-4/400-README.md`, `401`, `402`, `403` | 7/24/19/31 kB | CAT |
| 12 | `00-README-cc-grok47.md` | 1 kB | QC |
| 12 | `01-roadmap-checklist-milestones.md` | 38 kB | RM, EV, LR, INTEL(dataset facts) |
| 12 | `02-six-sprint-master-plan.md` | 32 kB | MP, HW |
| 12 | `03-bcf-techniques-into-the-plan.md` | 25 kB | BCF, WP |
| 12 | `04-fault-interference-math-and-prior-work.md` | 45 kB | MATH, PR |
| 12 | `05-coderprog-catalog-for-bcf-agent.md`, `06-0dayprizrak-catalog-for-bcf-agent.md`, `07-foss-tools-for-the-bcf-coding-agent.md` | 68/155/44 kB | CAT |
| 13 | `kagglecom_bcf_instantplan_[genspark-mimo26pro].md` | 72 kB | RM, MP, HW, EV, LR, BCF, WP, MATH, PR |
| 14 | `kagglecom_bcf_instantplan_[genspark-kimiK3].md` | 64 kB | RM, MP, HW, EV, LR, BCF, WP, MATH, PR |
| 15 | `kagglecom_bcf_instantplan_[genspark-deepseekv41flash].md` | 86 kB | RM, MP, HW, EV, LR, BCF, WP, MATH, PR, INTEL(no manifest) |
| 16 | `kagglecom_bcf_instantplan_[cc-glm53flash].md` (9 documents concatenated) | 287 kB | RM, MP, HW, EV, LR, INTEL, BCF, WP, MATH, PR, CAT, SIM(real task via GitHub API) |

## C. Quick-reference: where to find the best instance of each content type

| Content type | Best single source | Runner-up |
| --- | --- | --- |
| Measured dataset profile | 3 (`01_Roadmap...md`) | 12 (`01-roadmap...md`) |
| Day-0 runbook with commands | 12 (`02-six-sprint...md`) | 3 (`02_Master_Plan...md`) |
| Budget arithmetic | 3, 12 | 9, 11 |
| Forum intel with provenance | 11 (`03-discussion-board-intel.md`) | 16 doc 01 |
| Paper-track rules | 3 (`2026-09-30_BCF/01`) | 11 (`04-paper-track-intel.md`) |
| BCF corrections | 3 (18 corrections) | 9 (Q3 corrections) |
| Experimental controls | 9 (random-category control) | 12 (ceiling ladder) |
| Math with closed forms | 3 (`02_BCF_Fault_Class_Math...md`) | 12 (`04-fault-interference...md`), 16 (hitting set) |
| Real-task simulation | 11 (`103-bcf-simulation-httpx-3672.md`) | 16 doc 09 |
| Prior research with identifiers | 9, 15 | 12, 13 |
| Adapter gating protocol | 12, 15 | 13 |
| Two-fault benchmark idea | 13 | 12 (hunk-subset masking) |


---

<!-- ====================================================================== -->
<!-- FILE: 06_Research_Verification_Log.md -->
<!-- ====================================================================== -->

# Research Verification Log (external claims made by contenders)

**Date:** 2026-10-01 · **Method:** `/rdw-deep-wide-research` workflow executed with the built-in WebSearch tool, the arXiv export API (`export.arxiv.org/api/query`) via `curl`, and direct page fetches via `curl`. No Tavily skills or credits were used. The built-in WebFetch tool returned a model error on every call in this session and was abandoned; Kaggle pages returned HTTP 403 / JS shells to `curl`, so Kaggle facts are verified only through search snippets and thread titles.

**Scope statement:** verify the load-bearing external claims that affect the ranking: (a) the fault-interference / fault-masking literature cited in the Q4 answers, (b) competition-harness and paper-track facts, (c) forum ("intel") claims that several plans depend on.

Status legend: **REAL** = primary record found (arXiv/DOI/publisher page); **CONFIRMED** = fact corroborated by at least one independent source; **PARTIAL** = paper exists but the specific number/attribution could not be confirmed; **NOT FOUND** = no record under the stated title/venue (treated as a suspected fabrication); **UNVERIFIABLE** = could not be checked with the tools available.

## A. Literature citations

| # | Claim as cited by contenders | Cited by | Status | What was found |
| --- | --- | --- | --- | --- |
| A1 | Debroy & Wong, "Insights on fault interference for programs with multiple bugs", ISSRE 2009 | 3, 9, 12, 13, 15 | REAL | DOI 10.1109/ISSRE.2009.14, pp. 165–174; Siemens suite; masking more frequent than new failures; a secondary survey reports interference in 67% of programs. The "33.12% / 3,267 data points" figures quoted by contender 12 were not located in snippets (PARTIAL). |
| A2 | "Debroy & Wong, IEEE TSE 2014, Insights into co-occurring faults … up to 40%" | 5 | NOT FOUND | TSE 2014 by Wong et al. is the DStar paper; no such title exists. |
| A3 | "Debroy & Wong (2009) Insights on GUI-based and Multi-Fault Program Repair" | 7 | NOT FOUND | Title does not exist. |
| A4 | DiGiuseppe & Jones, "Fault interaction and its repercussions", ICSM 2011; "Fault density, fault types, and spectra-based fault localization", EMSE 2015 | 3, 9, 12, 13 | REAL | Both located. The "72,000 versions" count in contender 12 is PARTIAL (not seen in snippets). |
| A5 | Zheng, Jordan, Liblit, Naik, Aiken, "Statistical debugging: simultaneous identification of multiple bugs", ICML 2006 | 3, 9, 12 | REAL | ICML 2006. Contender 5 cites it as "ICSE 2006" (wrong venue). |
| A6 | "Abreu, MSeer, ISSRE 2009" | 5, 6 | NOT FOUND (misattribution) | MSeer is Gao & Wong, IEEE TSE 2019 (early access 2017). Abreu's 2009 work is BARINEL (ASE 2009). Contender 15 cites MSeer as "ICSE 2018" (wrong venue). |
| A7 | Abreu, Zoeteweij, van Gemund, BARINEL, ASE 2009 | 1, 9, 12 | REAL | ASE 2009 "Spectrum-based multiple fault localization". |
| A8 | Callaghan & Fischer, FLITSR, ISSTA 2023 (arXiv 2306.09892) and TOSEM 2025 (10.1145/3745027) | 9, 12, 13, 15 | REAL | arXiv record retrieved (2023-06-16); TOSEM article accepted 25 May 2025; RCR report DOI 10.1145/3768631. |
| A9 | "Callaghan 2026, Stellenbosch PhD" | 13, 15 | REAL | "Spectrum-based fault localization for multiple faults", Stellenbosch University, 2026-03, supervisor Bernd Fischer (SUNScholar). |
| A10 | Al-Bataineh et al., "Automated Repair of Multi-fault Programs: Obstacles, Approaches, and Prospects", ASE 2024 (10.1145/3691620.3695287); ASE 2025 "Debugging the Undebuggable" companion | 9, 13, 15 | REAL | ASE 2024 record found in ACM DL; ASE 2025 DOI pattern matches. |
| A11 | An, Yoon, Yoo, "Searching for Multi-Fault Programs in Defects4J", SSBSE 2021 (arXiv 2108.04455), "95.4%" | 3, 15 | REAL + CONFIRMED | 311/326 versions (95.4%) contain 2–24 faults. |
| A12 | Nashid et al., "Characterizing Multi-Hunk Patches", arXiv 2506.04418; "Beyond Accuracy: Behavioral Dynamics of Agentic Multi-Hunk Repair", arXiv 2511.11012 (TOSEM) | 15 | REAL | Both arXiv records retrieved. |
| A13 | ChainSWE, arXiv 2607.02606 | 13, 14 | REAL | Jin et al., 2026-07-01; 100 chains / 304 instances / 54 repos; up to 70% drop vs single-issue. |
| A14 | LivePlan "Online Monitoring and Corrective Steering of Programming Agents", arXiv 2608.06701; Fail-Fast Restart-Smart, arXiv 2608.03222; SWE-PRM, arXiv 2509.02360 | 1, 6, 7, 14, compendium | REAL | All three arXiv records retrieved. The "+9.9%" (LivePlan) and "40.0→50.6" (SWE-PRM) figures come from the BCF compendium and were not independently re-checked (PARTIAL). Contender 7's "FailFast-RestartSmart 3.4×" is PARTIAL. |
| A15 | BayesFLo, arXiv 2403.08079; graph-retrieval+Reflexion FL, arXiv 2409.13642; test overfitting on SWE-bench, arXiv 2511.16858; CFaults (2407.09337); attention probing FL (2502.13966); LLM test-free FL (2310.01726); SWE-smith (2504.21798); R2E-Gym (2504.07164); SWE-Bench Pro (2509.16941) | 13, 15, 3, 12 | REAL | All retrieved from the arXiv API. |
| A16 | Herzig, Just, Zeller, "It's not a bug, it's a feature", ICSE 2013, 33.8% misclassified | 12, 15 | REAL + CONFIRMED | 33.8% of >7,000 reports misclassified. |
| A17 | Song, Xie, Liu et al., failure clustering, JSS 2022 | 13, 14 | REAL | "A comprehensive empirical investigation on failure clustering in parallel debugging", JSS 193 (2022) 111452. The phrase "failure dependency" attributed to it by contender 14 is PARTIAL. |
| A18 | Renzullo, Reiter, Weimer, Forrest, "Automated Program Repair: Emerging trends pose and expose problems for benchmarks" | 15 | REAL | arXiv 2405.05455 (2024); ACM Computing Surveys 57(8), 2025. |
| A19 | Steimann, Frenkel, Abreu, "Threats to the validity and value of empirical assessments of the accuracy of coverage-based fault locators", ISSTA 2013 | 1, 5, 6, 14 | REAL (PARTIAL on term) | Paper exists; the term "failure shadowing" attributed to it by contenders 5/6 was not confirmed. |
| A20 | Bandyopadhyay & Ghosh, ICST 2012 (proximity-based fault localization) | 14 | REAL | Located in an earlier search. |
| A21 | Kuhn & de Kleer PHM 2010; Reiter 1987 "A theory of diagnosis from first principles"; de Kleer & Williams GDE 1987 | 12, 13, 16 | REAL | Contender 13's Reiter title "Founded in Causality" is wrong; contender 16's "GDE 1988" should be 1987. |
| A22 | "Pearl et al. (2017) Causal Inference for Fault Localization, ISSTA" | 10 | NOT FOUND | No such paper. |
| A23 | "Zhang et al. (2022) Multi-Fault Localization via Causal Analysis, TSE" | 10 | NOT FOUND | Search rate-limited once, then no record under that title. |
| A24 | "Le et al. (2023) SWE-bench … 18% multi-bug" | 10 | NOT FOUND | SWE-bench is Jimenez et al., ICLR 2024; the 18% statistic is unsupported. |
| A25 | "Korel & Laski 1988 … >85% of multi-fault fixes excluded" | 7 | NOT FOUND | Korel & Laski 1988 is dynamic slicing; the 85% claim is invented. |
| A26 | "Monperrus 2018: 85% of APR tools assume single fault"; "GenProg TSE 2012: >85% multi-edit invalid" | 1, 5, 6 | PARTIAL | Monperrus's living review exists; the specific percentages were not located. |
| A27 | Chatterjee et al., IJCAI 2023 (diagnosis); Massey 1994 guessing entropy; Arikan 1996 guessing inequality; Voas & Miller 1995 testability | 3, 10, 13 | REAL | Standard references; Voas & Miller is IEEE Software 1995 as contender 10 states. |
| A28 | OpenAI, "Why we no longer evaluate SWE-bench Verified" (Feb 2026) | 3, 9, 11 | REAL + CONFIRMED | Published 24 Feb 2026; 59.4% of audited o3 failures due to test flaws; contamination; SWE-bench Pro recommended. |

## B. Competition-harness and paper-track facts

| # | Claim | Cited by | Status | What was found |
| --- | --- | --- | --- | --- |
| B1 | Paper-track rubric = Novelty, Quality, Relevance, Verifiability, Clarity, each 0–5, averaged | 3, 9 (from intel), 11, 16 | CONFIRMED | Kaggle page excerpt surfaced in search with the five criteria and their definitions. Contender 6's "Technical Soundness / Originality / Empirical Methodology / Reproducibility / Clarity" and contender 7's rubric including "Offline & Consumer Feasibility" are WRONG. |
| B2 | Paper prizes $15k / $10k / $10k, deadline Nov 12 2026, 3,000-word writeup | 3, 11, 16, intel file | PARTIAL | Prize split and Nov 12 date confirmed only via a third-party GitHub summary; $35,000 total and "66 teams" confirmed on the Kaggle listing; the 3,000-word cap was not surfaced by search (it is stated in the local intel file and contender 3's live read). |
| B3 | Scoring environment runs a patched vLLM 0.19.1; LoRA adapters silently wiped in some version | 10, 11, 16 | CONFIRMED (title level) | Thread "LoRA adapters are silently wiped in the patched vLLM 0.19.1 (Gemma4 decoder layers registered twice)" exists with a staff reply. Fix version ("v23/v25 wheelhouse") UNVERIFIABLE. |
| B4 | KV cache collapses to ~7.6k tokens with LoRA enabled on 4×L4 | 10, 11, 15, 16 | CONFIRMED (title level) | Thread title "With LoRA enabled, the 4xL4 KV cache shrinks to ~7.6k tokens; requests longer than that hang" exists. Whether a host patch fixed it: UNVERIFIABLE. |
| B5 | Thinking mode drops thoughts between tool calls (vLLM ignores reasoning_content) | 10, 11, 16 | CONFIRMED (title level) | Thread by KE WU with a reply by Ryan Holbrook exists. "Patched Sep 29–30" (contender 16) UNVERIFIABLE. |
| B6 | Tool results double-JSON-encoded | 10, 11, 16 | CONFIRMED (title level) | Thread title exists. The 22%/62%/0% split is from contender 11's capture only (UNVERIFIABLE). |
| B7 | Gold patches fail offline for most FastAPI/requests tasks (missing deps / starlette pin) | 10, 11 | CONFIRMED (title level) | Thread exists. Starlette 1.6.0 is a REAL release (8 Aug 2026; 1.7.0 on 23 Sep 2026), so contender 10's "Starlette 1.6.0 pin" is plausible, not a fabrication as first suspected. |
| B8 | Tasks run sequentially; scorer reads 4 eval_config fields; 12 h overrun errors the whole run | 9, 11, 13 | CONFIRMED (title level) | Thread "Scoring-run questions: task concurrency, eval_config keys, and the 12 h limit" exists; body unreadable (403). |
| B9 | vLLM recipe flags for Gemma 4 (`--reasoning-parser gemma4 --tool-call-parser gemma4 --enable-auto-tool-choice`, `--default-chat-template-kwargs`) | 6, 7, 12 | CONFIRMED | Recipe page fetched (270 kB). Contender 7's `--chat-template-kwargs` is a wrong flag name. |
| B10 | vLLM LoRA support for `Gemma4ForConditionalGeneration` | 9, 12 (caveats) | CONFIRMED | Feature request #39246 and PR #39291; current `gemma4_unified` docs list LoRA support; older builds raise "does not support LoRA yet". Training-side caveat: the text tower lives under `model.language_model.*`, so LoRA target modules must be path-restricted regexes or the vision/audio wrappers abort adapter injection. |
| B11 | 12 public tasks are "dead" (gold patch cannot pass locally) | 11, 13 | PARTIAL | All 12 ids exist in tasks.jsonl (my check); the dead status itself is forum-reported and not reproduced here. |
| B12 | Hardware: 4×L4, TP=4, max_model_len 32768, gpu_mem_util 0.80; max_loras 8; max_lora_rank 128; adapters < 3 GiB | all | CONFIRMED | Local HARNESS_README and notebook. |
| B13 | Submissions "2 per day" | 16 | WRONG | Rules say 1 submission per day (local docs). |
| B14 | `scripts/evaluate.py --reference-check` command | 6, 11 (file 101), 16 | NOT FOUND | Not in HARNESS_README or the notebook; the documented path is `swegemma eval --skip-agent-patch`. |
| B15 | httpx_6821 task (symbols `_send_handling_redirects`, `Response.stream`, lines 519/310 or 490/308) | 1, 5, 6, 7, 10, (11, 16 as illustrative) | WRONG (invented) | The dossier ledger admits the task is invented; the dataset httpx snapshot (httpx_3672) uses `RedirectMiddleware` / `NetworkStream`. |

## C. Dataset facts re-measured from `tasks.jsonl` (n = 129)

| Fact | Value | Contender claims |
| --- | --- | --- |
| Repo split | fastapi 67 / rich 48 / requests 13 / httpx 1 | 3, 11, 12 correct; 10 ("rich 29, httpx/requests 22") wrong; 7 ("httpx 45") impossible |
| Gold-patch changed lines | median 12, p75 44, p90 128; ≤10 lines: 60 (47%) | 3 correct; 5/6/7 "median 18" is a chars-per-line derivation |
| Files per gold patch | 1 file: 91 (71%); 2: 19; 3+: 19; max 26 | 3, 12 correct |
| httpx_3672 | 7 gold files; test_patch = tests/test_parsers.py, 5 hunks | 11 correct; 12 "single-file rename" wrong |
| hints_text | empty 129/129 | 3, 12 correct |
| Tracebacks in problem statements | 0/129; exception names 15/129 | 3 correct; this drives the whole exception-class thesis |
| Public leaderboard denominator | ~58–60 tasks → 1 task ≈ 0.017 | 13, 14 ("0.17 ≈ 20/120") wrong |

## D. Sources consulted (primary)

- arXiv API records for 23 identifiers (saved in `scratch/arxiv_check.xml`).
- https://docs.vllm.ai/projects/recipes/en/stable/Google/Gemma4.html (fetched).
- https://github.com/vllm-project/vllm/issues/39246 (search snippet), https://github.com/vllm-project/vllm/issues/53431 (search snippet).
- https://www.kaggle.com/competitions/gemma-4-developer-agent-paper (search snippet with rubric text).
- https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion (search snippets listing thread titles).
- https://openai.com/index/why-we-no-longer-evaluate-swe-bench-verified/ (fetched as JS shell; content via secondary reports).
- https://doi.org/10.1109/ISSRE.2009.14, https://doi.org/10.1145/3745027, https://doi.org/10.1145/3704997, https://doi.org/10.1016/j.jss.2022.111452, https://doi.org/10.1007/978-3-030-88106-1_11, https://dl.acm.org/doi/10.5555/2486788.2486840.
- https://scholar.sun.ac.za/collections/6162c8d4-f5ce-45f1-ba42-225b8d7f9fb4 (Callaghan 2026 thesis listing).
- https://pypi.org/project/starlette/ and https://starlette.dev/release-notes/ (Starlette 1.6.0 / 1.7.0).


---

<!-- ====================================================================== -->
<!-- FILE: 07_QC_Report.md -->
<!-- ====================================================================== -->

# QC Report — Model Council 3 deliverables (2026-10-01)

## 1. Markdown table check

Script: `scratch/qc_tables.py` (counts unescaped pipe cells per row against the header, checks separator rows, and checks for blank lines before and after each table).

| File | Lines | Tables | Issues after fix |
| --- | ---: | ---: | ---: |
| `00_README.md` | 39 | 2 | 0 |
| `01_Council_Report.md` | 529 | 9 | 0 |
| `02_Special_1_Feasibility_and_Win_Probability.md` | 329 | 20 | 0 |
| `03_Special_2_Composite_Options_and_Project_Plans.md` | 160 | 4 | 0 |
| `03a_Project_Plans_Options_00_to_07.md` | 364 | 24 | 0 |
| `03b_Project_Plans_Options_08_to_15.md` | 427 | 29 | 0 |
| `04_Special_3_Open_Questions_Roundup.md` | 87 | 7 | 0 |
| `05_Special_4_Content_Checklist_Matrix.md` | 184 | 4 | 0 |
| `06_Research_Verification_Log.md` | 85 | 3 | 0 |

Defects found and fixed on the first pass: four rows whose cells contained an unescaped `|` inside math or a regex (three in `02_Special_1`, one in `03b`). The math rows now use an escaped pipe; the regex was moved into a fenced code block under the table.

## 2. Score arithmetic check

Category scores live in `scratch/scores.json`; the ranking in `01_Council_Report.md` §2 and `00_README.md` was generated from `scratch/scores_ranked.json` by script (overall = Σ weight × score / 5, weights sum to 100). Credibility and probability figures in `02_Special_1` were generated from `scratch/feasibility.json` by script and copied verbatim; the worked example in `02_Special_1` §2a reproduces one row by hand.

## 3. Consistency checks

- Every unit appears in: the ranked table, both comparison matrices, both coverage-checklist tables, the per-unit evidence section, both credibility tables, both content-matrix tables. Verified by inspection (16 rows each).
- Every "Verified error" in `01_Council_Report.md` §6 has a corresponding row in `06_Research_Verification_Log.md` or in the dataset re-measurement table.
- No retracted or fabricated numbers from the contender files (30-vs-10 turns, 66.7%, 0.388, 40.6%, 38.4%) are used anywhere as facts; they appear only as examples of what not to reuse.

## 4. Known limitations of this review

- WebFetch was non-functional in this session; Kaggle pages returned 403 to `curl`. Forum-thread claims are therefore verified at the level of thread titles and staff-reply existence, not thread bodies. Affected items are marked "CONFIRMED (title level)" or "UNVERIFIABLE" in the log.
- The 3,000-word paper cap and the two-Writeups rule rest on the local intel file and contender 3's live read; search did not surface them.
- Two contender files were decoded with replacement characters (units 8 and 10); content judgements were unaffected but a few glyphs in quotes may differ from the originals.
- Unit 11's HTML slide deck and unit 12's two very wide catalog tables were read only partially (heads) because they are extra-scope; their inclusion affects Coverage/Usefulness credit only.
- Impact estimates in the impact–effort table are planning priors, not measurements; the plans are designed to replace them with measured deltas in week 2.
- Time estimates (hh:mm) assume one experienced engineer and the stated hardware; they do not include Kaggle queue time beyond the stub submission.

