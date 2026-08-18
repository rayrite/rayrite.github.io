# Consolidated Clarifying Questions — INC1276683 MalaySing Validation Rules (Aug '26)
## Version 2 — BRD-annotated edition (original spec statements mapped to questions)

**Compiled:** 2026-08-10
**Sources:** All 8 packets in `tasks/81/chat01b-packets/`
**BRD source:** `tasks/81/PRIORITY_CHANGES_AUG26.md` (Slide 4 — Malaysia Validation, eTES & LCD, Overtime; Slide 8 — Singapore Validation, eTES & LCD, Standby Allowance)

---

## How to read this document

This is the second version of `CLARIFYING_QUESTIONS_CONSOLIDATED_AUG26.md`. It uses the **same CQ numbering** as v1, but every consolidated question is now presented **inside a markdown table next to the verbatim BRD statement(s) from `PRIORITY_CHANGES_AUG26.md` that triggered it**, so each ambiguity can be traced to the exact spec wording.

- **Tally: N / 8** — the question (or a materially similar variant) was raised in N of the 8 packets.
- `"`…`"` quotes are verbatim from the BRD, including original spelling/grammar.
- `〃` in the BRD-statement column means "same statement as the row above".
- Questions with **no direct BRD statement** (implementation/operational concerns) are collected in Part 3.

### Source packets (short names used throughout)

| # | Packet file | Short name | Questions raised |
|---|---|---|---|
| 1 | `chat01b_packet[genspark-gpt56sol].md` | **gpt56sol** | 40 (Q1–Q40) |
| 2 | `chat01b_packet[genspark-opus5].md` | **opus5** | 26 (Q1–Q26) |
| 3 | `chat01b_packet[genspark-deepseekV4pro].md` | **deepseekV4pro** | 11 sections |
| 4 | `chat01b_packet[genspark-GLM52].md` | **GLM52** | 23 (Q1–Q23) |
| 5 | `chat01b_packet[genspark-K3].md` | **K3** | 36 (Q1–Q36) |
| 6 | `chat01b_packet[genspark-grok45-1].md` | **grok45-1** | ~30 (sections A–F) |
| 7 | `chat01b_packet[genspark-M3].md` | **M3** | 15 (Q1–Q15) |
| 8 | `chat01b_packet[genspark-gemini36flash].md` | **gemini36flash** | 7 (Q1–Q7) |

---

# PART 1 — Slide 4: Malaysia Validation — eTES & LCD (Overtime)

## 1A. BRD row: Time Type `3010` (GHR codes `3010` OT-Workday & `3011` OT-Offday)

| Original BRD statement (verbatim) | CQ | Clarifying question | Tally | Raised by |
|---|---|---|---|---|
| GHR Time Codes column lists **"3010- OT-Workday:1.5xHrly"** and **"3011 - OT-Offday:1.5XHrly"**, but the Time Types column lists only **"3010 (Priority Change)- Aug'26"** | CQ-01 | Does this row's rule set apply to both `3010` and `3011`, or only `3010`? Is `3011` in scope at all? | 3/8 | gpt56sol, deepseekV4pro, K3 |
| 〃 (two-column structure: "GHR Time Codes" vs "Time Types") | CQ-52 | Are the quoted codes literal LCD `att_abs_type` values, or GHR codes that map to different LCD values via `lcd.toe_attabs_map`? | 1/8 | opus5 |
| "12 hours cap (Including OT) for a Regular Day" | CQ-06 | What does the cap include — only `1010 + 3010 ≤ 12`, or all (non-absence) hours on the day ≤ 12? | **6/8** | gpt56sol, opus5, deepseekV4pro, K3, grok45-1, GLM52 |
| "On working regular day then EE must enter regular time code 1010" | CQ-04 | Is this a hard same-day rule? Is any positive `1010` sufficient, or must it reach a threshold (e.g., a full normal working day)? | **5/8** | gpt56sol, opus5, deepseekV4pro, grok45-1, M3 |
| 〃 | CQ-05 | Is `1010` the only code that satisfies the prerequisite, or does any REG-group time type qualify? | 3/8 | gpt56sol, deepseekV4pro, grok45-1 |
| "**Cannot enter any time for 3020, 3030, 3040, 3050, 3060**" | CQ-02 | Are `3010` and `3011` mutually exclusive on the same calendar day? (The clause lists the *other* codes but not 3011, while the row itself groups 3010/3011 together.) | **5/8** | gpt56sol, opus5, deepseekV4pro, grok45-1, M3 |
| 〃 (together with the symmetric "Cannot enter…" clauses on rows 3020–3060) | CQ-22 | Confirm the full same-day mutual-exclusion matrix between the three OT families (work/off-day vs rest-day vs public-holiday). | 2/8 | GLM52, grok45-1 |
| "• RDW: any time a user enters 3011. then that day counts as an 'Off day'" | CQ-08 | How is the day type determined — does the entered code (`3011`) alone classify the day, or must LCD check the employee's work schedule / eTES calendar? | **6/8** | gpt56sol, deepseekV4pro, GLM52, K3, grok45-1, M3 |
| 〃 | CQ-10 | Does this reclassification also affect other edits for that day (86000061/62/67 OT prerequisites, weekly OT edits)? | 1/8 | grok45-1 |
| "• RDW:" (second bullet — **empty / unfinished** in the BRD) | CQ-09 | What rule was intended in the unfinished bullet? | **5/8** | gpt56sol, GLM52, K3, grok45-1, M3 |
| "12 Hrs cap (Only OT) for Off Day (No regular time needed for Off day)" | CQ-07 | Is the off-day cap `3011 ≤ 12` alone, or all OT/working hours on the day? | 4/8 | gpt56sol, deepseekV4pro, K3, grok45-1 |
| 〃 ("No regular time needed" — permissive wording) | CQ-03 | On an Off Day (`3011`), is regular time `1010` prohibited, merely not required, and does it count toward the off-day cap? | 3/8 | opus5, K3, gemini36flash |
| GHR code descriptions "OT-Workday:1.5xHrly" / "OT-Offday:1.5XHrly" (abbreviations used throughout slide) | CQ-54 | Confirm terminology: NWH = Normal Working Hours, RDW = Rest Day Worked, PH = Public Holiday, SA/SB meanings. | 1/8 | GLM52 |

## 1B. BRD rows: Time Types `3020`, `3030`, `3040` (Rest-day OT tiers)

*The three rows carry nearly identical validation text; they are treated as one group. GHR descriptions: "3020- OT-RstDy<=Hlf-NWH0.5xDly", "3030- OT-RstDy>Hlf-NWH<=NWHx1", "3040- OT-RstDy > NWH:2xHrly".*

| Original BRD statement (verbatim) | CQ | Clarifying question | Tally | Raised by |
|---|---|---|---|---|
| "Employee can enter OT on the same day for Time code 3020 (Mandatory) along with 3030 and 3040" | CQ-11 | Is `3020` required (hours > 0) whenever `3030` or `3040` is present? Is 3020 alone valid? Any minimum-hours requirement? | **8/8** ⭐ | **all 8 packets** |
| 〃 | CQ-14 | May 3020/3030/3040 be freely combined on one day, provided 3020 is present and the total ≤ 12? | 2/8 | gpt56sol, K3 |
| GHR code descriptions "OT-RstDy<=Hlf-NWH…" / ">Hlf-NWH<=NWH…" / "> NWH:2xHrly" | CQ-12 | Must LCD enforce the tier banding/sequencing (3020 filled to ≤ ½ NWH before 3030, then to NWH before 3040)? What is NWH (`worker_info.long_day`? fixed 8.0)? | 3/8 | opus5, grok45-1, GLM52 |
| "12 hours cap (OT Only)" / "12 hours cap, (OT Only)" / "12 hours per day cap (OT Only)" | CQ-13 | Is the cap the sum `3020 + 3030 + 3040 ≤ 12`, 12 hours per code, or all non-absence hours on the day? | 4/8 | gpt56sol, opus5, deepseekV4pro, grok45-1 |
| "**Cannot enter any time for 3010, 3050, 3060**" | CQ-15 | The exclusion list names `3010` but **not** `3011` — may `3011` be combined with 3020/3030/3040? | 3/8 | gpt56sol, K3, grok45-1 |
| 〃 (no mention of `1010` in the exclusion list) | CQ-16 | May regular time `1010` be entered on a Rest Day with 3020–3040 (or on a PH day), and does it count toward the 12-hour cap? | 2/8 | GLM52, K3 |

## 1C. BRD rows: Time Types `3050`, `3060` (Public-holiday OT tiers)

*Both rows carry identical validation text. GHR descriptions: "3050- OT-PH <= NWH:2x Hrly", "3060- OT-PH > NWH:3xHrly".*

| Original BRD statement (verbatim) | CQ | Clarifying question | Tally | Raised by |
|---|---|---|---|---|
| "Enter a PH (8000) first" | CQ-17 | Does "first" mean input/display sequence (which LCD cannot see), same-day presence of `8000 > 0`, or validation against an authoritative holiday calendar? | **5/8** | gpt56sol, deepseekV4pro, K3, grok45-1, M3 |
| 〃 | CQ-18 | Must `8000` be a full holiday day, or is any positive amount sufficient? | 2/8 | gpt56sol, opus5 |
| 〃 | CQ-19 | Is `8000` the only PH gating code, or does any HOL/PHL activity-group code qualify? Confirm `8000` exists in LCD as hour-based (`unit_flag ≠ 'U'`) and its activity_group. | **7/8** | gpt56sol, deepseekV4pro, grok45-1, M3, gemini36flash, K3, GLM52 |
| "and then employee can enter 3050 and only then can utilize 3060 for extra hours for a calendar day" | CQ-20 | Before `3060`, must `3050` merely be present (> 0) or filled to the NWH threshold (the code labels `≤ NWH` / `> NWH` imply a band)? Is 3050 strictly mandatory before 3060 at all? | **6/8** | gpt56sol, opus5, deepseekV4pro, GLM52, grok45-1, gemini36flash |
| "12 Hours cap" + "If PH(8000) is applied, then a standard logic is to check daily cap of 12 hrs (excluding PH Hrs)" | CQ-21 | Is the formula `3050 + 3060 ≤ 12`, or all daily hours minus 8000 ≤ 12? Does the PH-hours exclusion apply only to these rows (not to 3010/3011)? | **7/8** | gpt56sol, deepseekV4pro, K3, grok45-1, GLM52, gemini36flash, M3 |
| "**Cannot enter any time for 3010, 3020, 3030, 3040**" | CQ-22 | (See row 3010 table) Confirm the full mutual-exclusion matrix. | 2/8 | GLM52, grok45-1 |
| 〃 (no mention of `1010`) | CQ-16 | (See row 3020 table) May `1010` coexist with 8000/3050/3060, counted in the cap? | 2/8 | GLM52, K3 |

## 1D. Slide-4-level scope statements

| Original BRD statement (verbatim) | CQ | Clarifying question | Tally | Raised by |
|---|---|---|---|---|
| Slide title: "Slide 4 - Malaysia Validation - eTES & LCD (Overtime)" — *no worker-population filter stated in the BRD* | CQ-23 | Do the rules apply to **all** A60 workers, or only salary group 'C' (per INC1247720 precedent)? Include contractors? Include exempt employees? | **5/8** | gpt56sol, opus5, GLM52, K3, grok45-1 |
| 〃 | CQ-24 | Org scope: A60 only — what about other Malaysia orgs, and how does this relate to the existing `is_malaysing` flag (A00/A60/A80)? | 3/8 | deepseekV4pro, GLM52, grok45-1 |
| Time Types column tag "(Priority Change)- Aug'26" | CQ-40 | What is the exact go-live date? Hard date gate (e.g., week-ending ≥ 2026-08-01) vs deployment-date activation? How are July/August straddling weeks and retroactive corrections handled? | **5/8** | gpt56sol, opus5, K3, grok45-1, M3 |

---

# PART 2 — Slide 8: Singapore Validation — eTES & LCD (Standby Allowance)

## 2A. BRD row: Time Type `3100` — SB-Weekly (SGD 270)

| Original BRD statement (verbatim) | CQ | Clarifying question | Tally | Raised by |
|---|---|---|---|---|
| "Used this Standby UNIT one time day of any day of the week." | CQ-29 | At most one day per week carrying exactly 1 unit, any day OK — is the actual entry date otherwise relevant (rate calc, anchoring protected weekend days)? | 3/8 | gpt56sol, grok45-1, M3 |
| "**The number must be 1 UNIT.**" | CQ-26 | How is a unit represented (parsed value 1.00 / '0100')? Enforced as *exactly* 1 (rejecting fractions, multiples, zero, negatives)? Do two lines of 0.5 summing to 1 pass or fail? Is 1 unit = 1.0 or a full 8-hour day? | **7/8** | gpt56sol, opus5, GLM52, grok45-1, K3, M3, gemini36flash |
| 〃 | CQ-25 | Are 3100/3110/3120 configured with `unit_flag = 'U'`? (Critical: existing `tally` skips unit records, so a pre-filter accumulator is required.) | **5/8** | gpt56sol, opus5, deepseekV4pro, GLM52, grok45-1 |
| "The employee cannot use any other Standby for week (3110 & 3120)" | CQ-27 | Is the exclusivity **week-level** or **day-level**? (This row says "for week"; the 3120 row says "on a weekend day" — the two conflict.) | **6/8** | opus5, GLM52, K3, grok45-1, M3, gemini36flash |
| "The Employee cannot use 3100 more than once for the same week." | CQ-29 | (See first row) Frequency/placement confirmation. | 3/8 | gpt56sol, grok45-1, M3 |
| "Start date of Weekly SB could be any day of the week" | CQ-28 | What is "the week" — the LCD timesheet week (Sat–Fri), or a rolling 7-day entitlement that can straddle two timesheet weeks (which `pay_editA` structurally cannot see)? | **5/8** | opus5, GLM52, grok45-1, M3, K3 |
| "eTES to restrict overlap of more than 1 unit per day (SA & SB)" | CQ-36 | What does "SA & SB" mean? Which exact codes are in the SA family, and must they be included in the LCD one-unit-per-day total? | **6/8** | gpt56sol, opus5, GLM52, K3, grok45-1, M3 |
| 〃 | CQ-37 | "eTES to restrict" — is this out of scope for the LCD patch, or should LCD enforce it defensively too? Is PAYEDIT2A LCD-only with eTES mirrored separately? | **5/8** | GLM52, K3, grok45-1, M3, opus5 |
| 〃 | CQ-35 | May standby units coexist with leave/absence time on the same day (as long as the standby total ≤ 1 unit)? | 1/8 | K3 |

## 2B. BRD row: Time Type `3110` — SB-Weekday (SGD 33.75)

| Original BRD statement (verbatim) | CQ | Clarifying question | Tally | Raised by |
|---|---|---|---|---|
| "Used this Standby UNIT one time every weekday (Between Monday to Friday)" | CQ-30 | Mandatory on **all five** weekdays, or optional per weekday with at most one unit per used day? | 2/8 | gpt56sol, K3 |
| 〃 | CQ-33 | Day-of-week mapping: confirm Mon–Fri against the package convention (day index 1 = Sat … 7 = Fri). Always Sat–Fri week, or driven by `org_param.WEEKLY_START_DAY` / actual calendar dates? | **6/8** | gpt56sol, opus5, deepseekV4pro, GLM52, grok45-1, gemini36flash |
| "**The number must be 1 UNIT daily.**" | CQ-26 | (See row 3100 table) Unit quantity semantics. | 7/8 | gpt56sol, opus5, GLM52, grok45-1, K3, M3, gemini36flash |
| 〃 | CQ-25 | (See row 3100 table) `unit_flag` configuration. | 5/8 | gpt56sol, opus5, deepseekV4pro, GLM52, grok45-1 |
| "The employee cannot use this Standby in a week with 3100 the weekly Standby." | CQ-27 | (See row 3100 table) Week-level exclusivity confirmation. | 6/8 | opus5, GLM52, K3, grok45-1, M3, gemini36flash |
| 〃 (only 3100 is named as prohibited) | CQ-32 | May `3110` and `3120` be combined in the same week on their respective valid days? | 4/8 | gpt56sol, GLM52, K3, grok45-1 |
| "eTES to restrict overlap of more than 1 unit per day (SA & SB)" | CQ-36 / CQ-37 | (See row 3100 table) SA codes definition; eTES vs LCD ownership. | 6/8 / 5/8 | — |

## 2C. BRD row: Time Type `3120` — SB-Weekend (SGD 50.65)

| Original BRD statement (verbatim) | CQ | Clarifying question | Tally | Raised by |
|---|---|---|---|---|
| "Used this Standby UNIT one time on weekend days(Only Saturday & Sunday)." | CQ-31 | Optional per weekend day, or required on **both** Saturday and Sunday? | 2/8 | gpt56sol, K3 |
| 〃 | CQ-33 | (See row 3110 table) Weekend = Sat/Sun mapping against day-index convention. | 6/8 | gpt56sol, opus5, deepseekV4pro, GLM52, grok45-1, gemini36flash |
| 〃 | CQ-34 | Public holidays: may `3120` be entered on a weekend public holiday (and `3110` on a weekday PH)? | 2/8 | opus5, K3 |
| "**The number must be 1 UNIT daily.**" | CQ-26 / CQ-25 | (See row 3100 table) Unit quantity semantics; `unit_flag` configuration. | 7/8 / 5/8 | — |
| "The employee cannot combine this Standby on a weekend day with 3100 the weekly Standby." | CQ-27 | **This is the statement that creates the conflict** — "on a weekend day" reads day-level while the 3100/3110 rows read week-level. Which governs? | 6/8 | opus5, GLM52, K3, grok45-1, M3, gemini36flash |
| 〃 (only 3100 named as prohibited) | CQ-32 | (See row 3110 table) 3110 + 3120 combinable in the same week? | 4/8 | gpt56sol, GLM52, K3, grok45-1 |
| "eTES to restrict overlap of more than 1 unit per day (SA & SB)" | CQ-36 / CQ-37 | (See row 3100 table) SA codes definition; eTES vs LCD ownership. | 6/8 / 5/8 | — |

## 2D. Slide-8-level scope statements

| Original BRD statement (verbatim) | CQ | Clarifying question | Tally | Raised by |
|---|---|---|---|---|
| Slide title: "Slide 8 - Singapore Validation - eTES & LCD (Standby Allowance)" — *no worker-population filter stated in the BRD* | CQ-38 | Do the rules apply identically to both A00 and A80, and to all worker types (including contractors)? | 3/8 | gpt56sol, opus5, grok45-1 |
| 〃 | CQ-24 | (See Slide 4 scope table) Org scope vs the `is_malaysing` flag covering A00/A60/A80 — SG rules exclude A60? | 3/8 | deepseekV4pro, GLM52, grok45-1 |
| Time Types column tag "(Priority Change)- Aug'26" | CQ-40 | (See Slide 4 scope table) Effective date / date gating. | 5/8 | gpt56sol, opus5, K3, grok45-1, M3 |

---

# PART 3 — Questions with no direct BRD statement (implementation / operational)

These questions arise from the existing `PAYEDIT2A.SQL` code context or deployment practice rather than from any sentence in the BRD. The "closest BRD anchor" column shows the nearest tie-in where one exists.

| Closest BRD anchor | CQ | Clarifying question | Tally | Raised by |
|---|---|---|---|---|
| The "12 hours cap" statements (all Slide-4 rows) | CQ-48 | Interaction with existing generic edits — 86000037 (MAXHOURS), 86000062/86000067 (already bypassed via `is_malaysing`): do new rules run in addition? Are duplicate errors acceptable? Can MAXHOURS override the 12-hour cap? | **6/8** | gpt56sol, opus5, deepseekV4pro, GLM52, grok45-1, M3 |
| 〃 | CQ-47 | Existing check 86000260 (INC1247720, `3010 > 12` in `leave_check`): keep, retire, or accept duplicate messages with the new combined-cap error? | 4/8 | gpt56sol, opus5, K3, grok45-1 |
| — | CQ-41 | Error-code numbering: are reason codes 86000261–8600027x free across all language codes, and is the range approved? | **7/8** | gpt56sol, opus5, deepseekV4pro, GLM52, K3, grok45-1, M3 |
| — | CQ-42 | Error message text: who supplies/approves the exact user-facing wording and translations (per language code)? | **5/8** | gpt56sol, opus5, GLM52, K3, grok45-1 |
| — | CQ-43 | Severity: all hard errors that block submission, or should any be warnings? (Package has no warning severity today.) | 3/8 | opus5, K3, grok45-1 |
| — | CQ-44 | One consolidated error per day/category, or a separate error per violation? Are duplicate messages acceptable? | 1/8 | gpt56sol |
| — | CQ-45 | Mid-week cutoff: should the new "completeness" rules (1010/3020/8000 required) be suppressed mid-week to avoid nuisance errors on partially-entered days? | 2/8 | opus5, K3 |
| — | CQ-46 | Hook location: run from `validate()`, from `leave_check()`, or both? Is `leave_check` guaranteed to run after every `validate` call? | 4/8 | gpt56sol, opus5, grok45-1, M3 |
| — | CQ-49 | Feature flag / kill switch desired (package constant vs DB-driven), in addition to code isolation? | 2/8 | GLM52, K3 |
| — | CQ-50 | Deployment packaging: `reason_code` inserts in the same script as the package body, or a separate data-migration script? | 1/8 | K3 |
| — | CQ-51 | Reporting day for weekly standby violations: repeated-3100 day, first conflicting 3110/3120 day, or day 0? | 1/8 | K3 |
| — | CQ-53 | Configuration: confirm `activity_group` values for the new codes (3010–3060 = 'OT'? 3100–3120 = new 'SBA'? 8000 = 'PHL'?). | 1/8 | GLM52 |
| — | CQ-39 | Any collision/leakage risk between the Singapore counters and the existing India standby counters (`1SBH/1SBF/1SBD`, `total_day_stdby_*`)? | 3/8 | GLM52, M3, grok45-1 |
| — | CQ-55 | Is an official test matrix (golden timesheets) available for A60 and A00/A80 scenarios plus negative regression? | 1/8 | grok45-1 |
| — | CQ-56 | Confirm the tagged-block removability convention (`--RdW 8/10/2026 INC1276683 …` markers). | 1/8 | grok45-1 |

---

# PART 4 — Frequency Summary (ranked)

Questions ranked by how many of the 8 packets raised them. Higher tally = more independent reviewers flagged the same BRD ambiguity.

| Rank | CQ | Question (short) | BRD anchor | Tally |
|---|---|---|---|---|
| 1 | CQ-11 | Meaning of "3020 (Mandatory)" companion rule | Slide 4, rows 3020–3040 | **8 / 8** |
| 2 | CQ-19 | 8000 as PH gate — only code? group? hour-based? | "Enter a PH (8000) first" | **7 / 8** |
| 2 | CQ-21 | PH cap formula: 3050+3060 vs total−8000 | "check daily cap of 12 hrs (excluding PH Hrs)" | **7 / 8** |
| 2 | CQ-26 | "Must be 1 UNIT" — representation & strictness | "The number must be 1 UNIT" (×3 rows) | **7 / 8** |
| 2 | CQ-41 | New error-code range availability/approval | — (implementation) | **7 / 8** |
| 6 | CQ-06 | Regular-day cap: 1010+3010 vs all hours | "12 hours cap (Including OT) for a Regular Day" | **6 / 8** |
| 6 | CQ-08 | Day-type detection: codes vs calendar/schedule | "RDW: any time a user enters 3011… 'Off day'" | **6 / 8** |
| 6 | CQ-20 | 3060 needs 3050 present vs filled to NWH | "only then can utilize 3060 for extra hours" | **6 / 8** |
| 6 | CQ-27 | 3100 exclusivity: week-level vs day-level | "for week" vs "on a weekend day" conflict | **6 / 8** |
| 6 | CQ-33 | Weekday/weekend day-index mapping & week start | "(Between Monday to Friday)" / "(Only Saturday & Sunday)" | **6 / 8** |
| 6 | CQ-36 | "SA & SB" — what are the SA codes? | "overlap of more than 1 unit per day (SA & SB)" | **6 / 8** |
| 6 | CQ-48 | Interaction with 86000037 / 62 / 67 edits | — (implementation) | **6 / 8** |
| 13 | CQ-02 | 3010 vs 3011 same-day mutual exclusivity | "Cannot enter any time for 3020…" (3011 unlisted) | **5 / 8** |
| 13 | CQ-04 | 1010 prerequisite for 3010 — hard? threshold? | "EE must enter regular time code 1010" | **5 / 8** |
| 13 | CQ-09 | Empty "• RDW:" bullet — missing rule? | Unfinished bullet, row 3010 | **5 / 8** |
| 13 | CQ-17 | "Enter PH (8000) first" — order vs presence | "Enter a PH (8000) first" | **5 / 8** |
| 13 | CQ-23 | A60 population: all vs salary group C / contractors / exempt | Slide 4 title (no population stated) | **5 / 8** |
| 13 | CQ-25 | unit_flag='U' configuration of 3100–3120 | "The number must be 1 UNIT" | **5 / 8** |
| 13 | CQ-28 | "Week" for 3100: timesheet week vs rolling 7-day | "Start date of Weekly SB could be any day" | **5 / 8** |
| 13 | CQ-37 | "eTES to restrict" — LCD vs eTES responsibility | "eTES to restrict overlap…" (×3 rows) | **5 / 8** |
| 13 | CQ-40 | Effective date / date gating / retro weeks | "(Priority Change)- Aug'26" tag | **5 / 8** |
| 13 | CQ-42 | Error message text & translations ownership | — (implementation) | **5 / 8** |
| 23 | CQ-07 | Off-day cap: 3011-only vs all OT hours | "12 Hrs cap (Only OT) for Off Day" | **4 / 8** |
| 23 | CQ-13 | Rest-day cap: sum vs per-code | "12 hours cap (OT Only)" (3020–3040 rows) | **4 / 8** |
| 23 | CQ-32 | 3110 + 3120 combinable in same week | "cannot… with 3100" (only 3100 named) | **4 / 8** |
| 23 | CQ-46 | Hook location: validate() vs leave_check() | — (implementation) | **4 / 8** |
| 23 | CQ-47 | Fate of existing check 86000260 | — (implementation) | **4 / 8** |
| 28 | CQ-01 | Row 1 applies to 3010 only or also 3011? | GHR column lists both, Time Types lists 3010 | **3 / 8** |
| 28 | CQ-03 | 1010 on off days: prohibited / allowed / counted? | "No regular time needed for Off day" | **3 / 8** |
| 28 | CQ-05 | 1010 literal vs any REG-group code | "must enter regular time code 1010" | **3 / 8** |
| 28 | CQ-12 | Rest-day tier band-fill enforcement & NWH def. | "OT-RstDy<=Hlf-NWH…" code descriptions | **3 / 8** |
| 28 | CQ-15 | 3011 vs rest-day group (omitted from exclusion list) | "Cannot enter any time for 3010, 3050, 3060" | **3 / 8** |
| 28 | CQ-24 | Org scope: A60 only / is_malaysing overlap | Slide titles | **3 / 8** |
| 28 | CQ-29 | 3100 placement: once/week, any day | "one time day of any day" / "not… more than once" | **3 / 8** |
| 28 | CQ-38 | SG population: A00 & A80 identical, all workers | Slide 8 title (no population stated) | **3 / 8** |
| 28 | CQ-39 | India standby counter collision risk | — (implementation) | **3 / 8** |
| 28 | CQ-43 | Hard error vs warning severity | — (implementation) | **3 / 8** |
| 38 | CQ-14 | Free combination of 3020/3030/3040 | "3020 (Mandatory) along with 3030 and 3040" | **2 / 8** |
| 38 | CQ-16 | 1010 on rest/PH days allowed & counted in cap? | Exclusion lists omit 1010 | **2 / 8** |
| 38 | CQ-18 | 8000 full day vs any positive amount | "Enter a PH (8000) first" | **2 / 8** |
| 38 | CQ-22 | Full mutual-exclusion matrix confirmation | All "Cannot enter any time for…" clauses | **2 / 8** |
| 38 | CQ-30 | 3110 mandatory every weekday vs optional | "one time every weekday" | **2 / 8** |
| 38 | CQ-31 | 3120 required both weekend days vs optional | "one time on weekend days" | **2 / 8** |
| 38 | CQ-34 | Standby on public-holiday weekdays/weekends | "(Only Saturday & Sunday)" / "(Between Monday to Friday)" | **2 / 8** |
| 38 | CQ-45 | Mid-week cutoff suppression of completeness rules | — (implementation) | **2 / 8** |
| 38 | CQ-49 | Feature flag / kill switch | — (implementation) | **2 / 8** |
| 47 | CQ-10 | 3011 off-day reclassification impact on other edits | "that day counts as an 'Off day'" | **1 / 8** |
| 47 | CQ-35 | Standby coexisting with leave on same day | "overlap of more than 1 unit per day" | **1 / 8** |
| 47 | CQ-44 | Consolidated vs per-violation errors | — (implementation) | **1 / 8** |
| 47 | CQ-50 | reason_code inserts: same or separate deploy script | — (implementation) | **1 / 8** |
| 47 | CQ-51 | Reporting day index for weekly errors | — (implementation) | **1 / 8** |
| 47 | CQ-52 | GHR vs LCD code mapping (toe_attabs_map) | "GHR Time Codes" vs "Time Types" columns | **1 / 8** |
| 47 | CQ-53 | activity_group configuration for new codes | — (implementation) | **1 / 8** |
| 47 | CQ-54 | Abbreviation definitions (NWH/RDW/PH/SA/SB) | Code descriptions & "SA & SB" | **1 / 8** |
| 47 | CQ-55 | Official test matrix / golden timesheets | — (implementation) | **1 / 8** |
| 47 | CQ-56 | Removability / comment-marker convention | — (implementation) | **1 / 8** |

**Totals:** 56 consolidated questions distilled from ~190 individual questions across the 8 packets.

---

# Appendix A — Notable assumption conflicts between packets

Points where packets didn't just ask the same question but **coded opposite answers** — highest rework risk:

1. **3050→3060 ordering (CQ-20):** deepseekV4pro enforced *no* ordering between 3050/3060 at all; every other packet enforced 3050-before-3060 (presence-only). opus5 flagged presence-only as likely wrong vs the NWH-band reading.
2. **3100/3110/3120 unit configuration (CQ-25):** deepseekV4pro assumed hour-coded (`unit_flag='H'`) and tallied inside the hour branch; gpt56sol/opus5/GLM52/K3/grok45-1 assumed unit-coded (`'U'`) and built a pre-filter accumulator. If 'U', M3's and deepseekV4pro's tallies would silently miss the entries.
3. **Malaysia salary-group scope (CQ-23):** K3 gated to salary group 'C' (following INC1247720); all others applied to all A60 workers.
4. **Regular-day cap formula (CQ-06):** `1010+3010` (majority) vs `total_day` (K3) vs `REG+OT` (GLM52).
5. **PH cap formula (CQ-21):** `3050+3060 ≤ 12` vs `total_day − 8000 ≤ 12`.
6. **Hook location (CQ-46):** rules placed in `leave_check` (gpt56sol, deepseekV4pro, GLM52) vs `validate` (opus5, K3, grok45-1, M3) — matters because `leave_check` is not always invoked by callers.
7. **Effective-date gate (CQ-40):** hard gate `>= 2026-08-01` (gpt56sol) vs no date gate (opus5, grok45-1).
8. **Error-code scheme (CQ-41):** four different numbering schemes proposed (86000261–267, –268, –274, –275/278), so codes collide between packets and must be re-baselined once availability is confirmed.

# Appendix B — Per-packet question inventory (original numbering)

| Packet | Original question refs |
|---|---|
| gpt56sol | Q1–Q40 in 10 sections (Effective date; Error codes; MY population; 3010/3011; 3020–3040; 3050/3060; SG population; SG units; SG weekly/daily; Existing-rule interaction) |
| opus5 | Q1–Q13 (Malaysia), Q14–Q21 (Singapore), Q22–Q26 (Cross-cutting) |
| deepseekV4pro | §1 Unit vs hour coding; §2 PH prerequisite; §3 "Working regular day"; §4 RDW/3011; §5 Day-of-week mapping; §6 12-hour cap specifics; §7 3020 mandatory; §8 3050/3060 ordering; §9 Error codes; §10 Org scope; §11 86000062/67 interaction |
| GLM52 | Q1–Q23 (Terminology; day-type definitions; PH handling; exclusivity; SG week/scope/units; eTES; error numbers; salary group/exempt; existing edits; config; feature flag; message text) |
| K3 | Q1–Q6 Scope/eligibility; Q7–Q20 Malaysia OT; Q21–Q30 Singapore standby; Q31–Q36 Error codes & operations |
| grok45-1 | A1–A3 Scope/gating; B1–B7 MY code semantics; C1–C7 SG standby; D1–D3 Error codes; E1–E4 Implementation/ops; F1–F4 Ambiguous source lines |
| M3 | Q1–Q15 (1010 dependency; off-day definition; RDW notes; 3020 mandatory; PH prerequisite; MAXHOURS; 3100 start-day; 3100↔3120 wording; SA; unit value; India standby; error numbering; rollout flags; validate vs leave_check; PH exclusion scope) |
| gemini36flash | Q1 3011 vs 1010; Q2 3020 mandatory; Q3 PH combination; Q4 PH cap composition; Q5 unit vs hours; Q6 3100 placement/overlap; Q7 weekday/weekend mapping |

*End of report (v2 — BRD-annotated edition).*
