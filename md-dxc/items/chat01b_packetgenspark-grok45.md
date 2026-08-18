# Design Summary

Existing hooks already help:
- `is_malaysing` for A00/A60/A80  
- `total_day_my3010` + check **86000260** (3010 ≤ 12)  
- India standby pattern (`total_day_stdby_*`)  
- Day index: **1=Sat … 7=Fri**  
- `unit_flag = 'U'` currently **skips** tally entirely — critical for SG standby units  

Below are the three artifacts. Save each as its filename.

---

## Artifact 1: `CLARIFYING_QUESTIONS.md`

```markdown
# CLARIFYING_QUESTIONS.md
# INC1276683 – Malaysia / Singapore Validation Rules Aug'26
# Source: PRIORITY_CHANGES_AUG26.md vs PAYEDIT2A.SQL
# Author: RdW design pass 8/10/2026

---

## A. Scope & Gating

### A1. Organization gating
- Confirm Malaysia OT rules (3010–3060) apply **only** to org `A60`.
- Confirm Singapore Standby rules (3100–3120) apply to orgs `A00` and `A80` only (not A60).
- Should any rule also apply when `is_malaysing = TRUE` broadly, or strictly by org list above?

### A2. Population filters
- Do Malaysia OT rules apply to **all** A60 workers, or only certain `salary_group` values
  (e.g. INC1247720 salary_group = 'C' for the 12-hour cap)?
- Do Singapore standby rules apply to all A00/A80 employees, or a subset
  (exempt / non-exempt / specific allocation rules)?
- Contractors: skip (consistent with most leave_check rules) or include?

### A3. Validation surface
- Should these fire in `validate()` (time-entry GVR), `leave_check()`, or both?
- Assumption used in PATCH_PLAN: **daily mutual-exclusion + caps in `validate()` day loop**;
  **weekly standby exclusivity in `validate()` after day loop** (same pattern as weekly OT edits).

---

## B. Malaysia OT (3010–3060) – Code Semantics

### B1. Regular time code 1010
- Confirm att_abs_type **`1010`** is the mandatory regular code on a working day when using **3010**.
- Is 1010 always `activity_group = 'REG'`, or must we key off literal `'1010'` only?
- If employee enters other REG codes (not 1010) with 3010, is that an error?

### B2. Public Holiday code 8000
- Confirm att_abs_type **`8000`** is the required PH marker before 3050/3060.
- Is 8000 `activity_group = 'HOL'` or `'PHL'` or a dedicated type?
- Does “Enter PH (8000) first” mean:
  - (a) same calendar day must have hours on 8000 > 0, or
  - (b) chronological entry order in the UI (LCD cannot see order), or
  - (c) 8000 present on the day is sufficient (order-agnostic)?
- **Assumption if unanswered:** (c) same-day presence of 8000 hours > 0.

### B3. Off Day vs Rest Day vs Workday
| Code | Described as | Open question |
|------|----------------|---------------|
| 3010 | Workday OT 1.5x | Requires 1010; not off/rest/PH day? |
| 3011 | Offday OT 1.5x | “RDW: any time user enters 3011, that day counts as Off day” — does this **reclassify** the day for other edits (61/62/67), or only within this MY block? |
| 3020–3040 | Rest day OT tiers | How is Rest Day identified if 3020 not yet entered? Calendar? Worker schedule? Code presence only? |
| 3050–3060 | PH OT | Driven by 8000 presence? |

- Is **Off Day (3011)** mutually exclusive with **Rest Day (3020–3040)** and **PH (3050–3060)** on the same day?
- Incomplete note on 3011: `• RDW:` — what was the unfinished rule?

### B4. NWH (Normal Working Hours)
- Is NWH = `worker_info.long_day` for the worker/day?
- Or fixed 8.0? Or from org_param / schedule table?
- Rest-day tier boundaries (3020 ≤ half NWH, 3030 > half and ≤ NWH, 3040 > NWH) —
  should LCD **enforce tier hour ranges**, or only mutual-exclusion + caps
  (payroll rates already imply tiers)?
- **Assumption if unanswered:** NWH = `worker_info.long_day`; **do not** enforce tier band math in v1 (only coexistence + 12h caps + 3020 mandatory companion). Confirm if tier bands are required.

### B5. Cap definitions (12 hours)
Please confirm exact formulas:

| Scenario | Cap wording | Proposed formula | Confirm? |
|----------|-------------|------------------|----------|
| 3010 workday | 12h cap **Including OT** for Regular Day | `REG(1010) + 3010 ≤ 12` and/or `total_day ≤ 12`? | |
| 3011 off day | 12h cap **Only OT** (no regular needed) | `3011 ≤ 12` | |
| 3020–3040 rest day | 12h cap **OT Only** | `3020+3030+3040 ≤ 12` | |
| 3050–3060 PH | 12h cap; if PH(8000) applied, daily cap 12h **excluding PH Hrs** | `(total_day - 8000_hrs) ≤ 12` and/or `3050+3060 ≤ 12`? | |

- For 3010: does “Including OT” mean **all** hours on the day ≤ 12, or only 1010+3010?
- Interaction with existing **86000037** (max daily, default 24) and **86000260** (3010 ≤ 12): keep both; new caps additive?

### B6. Mutual exclusion matrices
Confirm illegal same-day combinations:

**Group W (Workday OT):** 3010  
- Cannot coexist with: 3020, 3030, 3040, 3050, 3060  
- 3011 same day as 3010: allowed or not? (not stated)

**Group O (Off Day OT):** 3011  
- Cannot coexist with: ? (only partial notes)

**Group R (Rest Day OT):** 3020, 3030, 3040  
- Cannot coexist with: 3010, 3050, 3060  
- 3020 is **Mandatory** when 3030 and/or 3040 present — confirm:  
  - If only 3030 → error (missing 3020)?  
  - If only 3040 → error?  
  - If only 3020 → OK?  
  - Must 3020 hours be > 0 (any positive) or a minimum (e.g. half-day unit)?

**Group P (PH OT):** 3050, 3060  
- Cannot coexist with: 3010, 3020, 3030, 3040  
- Prerequisite chain: 8000 required before 3050; 3050 required before 3060  
  - 3060 alone → error?  
  - 3050 without 8000 → error?  
  - 3060 with 8000 but no 3050 → error?  
  - 8000 + 3060 without 3050 → error?

### B7. 3011 “counts as Off day”
- Does 3011 suppress requirement for regular time (already stated)?
- Does it bypass existing OT prerequisite edits 86000061/62/67 for that day
  (Malaysia already bypasses 62/67 via `is_malaysing`)?
- Any impact on weekly OT edits?

---

## C. Singapore Standby (3100–3120)

### C1. Unit vs hours
- Confirm `att_abs_type` 3100/3110/3120 have `unit_flag = 'U'` in `lcd.att_abs_type`.
- If `unit_flag = 'U'`, current `tally()` **drops** them before any accumulation.
  Confirm we must special-case these codes **outside** the `unit != 'U'` guard (like a true unit ledger).
- Is the stored “hours” field actually **units** (1.00 = 1 unit)?

### C2. Exactly 1 UNIT
- Enforce `hours = 1` exactly (not ≥1, not ≤1)?
- Multiple lines same code same day that sum to 1: allow or reject?
- **Assumption:** sum of units for that code on that day must equal 1.0 when used; 0 = not used.

### C3. Weekly standby 3100
- “Used this Standby UNIT one time day of any day of the week” + “cannot use 3100 more than once for the same week”
  → at most **one day** in the week may have 3100, and that day exactly 1 unit?
- “Start date of Weekly SB could be any day of the week” — any implication beyond “any day index 1–7 OK”?
- Week boundary = existing timesheet week (Sat–Fri per day index), correct?

### C4. Weekday / Weekend mapping
Confirm against package day index (1=Saturday … 7=Friday):

| Code | Rule | Days (index) |
|------|------|----------------|
| 3110 | Mon–Fri only | 3,4,5,6,7 |
| 3120 | Sat–Sun only | 1,2 |
| 3100 | any day | 1–7 |

- Confirm org week start is Saturday for A00/A80 (org_param.WEEKLY_START_DAY).

### C5. Exclusivity
- 3100 in a week ⇒ **no** 3110 and **no** 3120 anywhere that week.
- 3110/3120 in a week ⇒ **no** 3100 that week.
- 3110 on weekday + 3120 on weekend same week: **allowed**? (wording suggests yes if no 3100)
- **Assumption:** 3110 and 3120 may coexist in the same week on their valid days; only 3100 is exclusive vs both.

### C6. “eTES to restrict overlap of more than 1 unit per day (SA & SB)”
- What are **SA** codes vs **SB** (3100–3120)?
- Is there a separate Standby Allowance family already in prod?
- Same-day: total SB units ≤ 1 across 3100+3110+3120?
- Or SA+SB combined ≤ 1?
- **Assumption if SA unknown:** same-day sum of units on 3100/3110/3120 ≤ 1; document SA as open.

### C7. Interaction with India standby / other OT
- No cross-org leakage (A00/A80 only) — confirm no interaction with India `1SBH/1SBF/1SBD`.

---

## D. Error Codes & Messaging

### D1. New reason_code rows
- Confirm new error numbers (proposal in PATCH_PLAN: **86000261–86000275** range).
- Who inserts into `reason_code` / message tables (US + ASIA language packs)?
- Exact user-facing text for each?

### D2. Existing 86000260
- Keep as-is for 3010 > 12?
- Or replace/extend with broader MY daily cap messages?

### D3. Severity
- All hard errors (block submit), or any warnings?

---

## E. Implementation / Ops

### E1. Effective dating
- Hard-coded Aug'26 behavior from deploy date, or gated by `p_end_date >= date '2026-08-01'`?
- **Assumption:** no date gate inside package (release timing controls go-live); optional week-ending gate if required.

### E2. Removability
- Confirm preference: single contiguous block(s) with  
  `--RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026`  
  and matching `END INC1276683` markers (as requested).

### E3. Dual path eTES vs LCD
- Notes say “eTES & LCD”. Is PAYEDIT2A LCD-only, with eTES mirrored separately?
- Any shared table/config we should read instead of hard-coding type lists?

### E4. Testing
- Need official test matrix (golden timesheets) for:
  - A60: each OT group happy path + each exclusion + cap breach + PH chain
  - A00/A80: 3100 only week; 3110 Mon–Fri; 3120 weekend; mixed 3110+3120; illegal 3100+3110; unit ≠ 1; wrong DOW
  - Negative: A76/India/US unchanged

---

## F. Ambiguous / Incomplete Source Lines

1. 3011 row ends with `• RDW:` with no text — **blockers for off-day rules**.
2. 3010 “On working regular day then EE must enter regular time code 1010” vs 3011 “No regular time needed” — confirm 1010 check is **only** when 3010 > 0.
3. Rest day “Employee can enter OT on the same day for Time code 3020 (Mandatory) along with 3030 and 3040” — parse as coexistence permission + 3020 required companion, not “3020 alone forbidden”.
4. PH “only then can utilize 3060 for extra hours” — confirms sequencing 8000 → 3050 → 3060.

---

## Priority to answer before production sign-off

| Priority | IDs | Why |
|----------|-----|-----|
| P0 | B1, B2, B5, B6, C1, C2, C5, D1 | Directly shape predicates and error codes |
| P1 | A2, B3, B4, C3, C6, E1 | Edge cases / population |
| P2 | A3, E3, E4, F1 | Process and unfinished notes |
```

---

## Artifact 2: `PATCH_PLAN.md`

```markdown
# PATCH_PLAN.md
# INC1276683 – MalaySing Validation Rules Aug 2026
# Target: lcd.pay_editA package body (PAYEDIT2A.SQL)
# Date: 8/10/2026
# Principle: Surgical, org-gated, removable blocks; no behavior change for other orgs.

---

## 1. Goals

1. Implement Malaysia (A60) OT type coexistence + 12h caps for att_abs_types
   3010, 3011, 3020, 3030, 3040, 3050, 3060.
2. Implement Singapore (A00, A80) Standby unit rules for 3100, 3110, 3120.
3. Do **not** alter logic for any org outside A60 (MY) / A00+A80 (SG).
4. Every injection tagged:
   `--RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026`
5. Blocks removable by deleting marked sections without breaking compile/runtime.

---

## 2. Assumptions (resolve open questions; reverse if clarifications differ)

| ID | Assumption |
|----|------------|
| AS-01 | MY rules: `pg_org_code = 'A60'` only. |
| AS-02 | SG rules: `pg_org_code IN ('A00','A80')` only. |
| AS-03 | No salary_group filter beyond existing INC1247720 behavior (86000260 stays). |
| AS-04 | Contractors: rules still apply (time-code integrity); no contractor skip in new block. |
| AS-05 | Validations run inside `validate()` (day loop + post-loop weekly SG check). |
| AS-06 | NWH = `worker_info.long_day` (used only if tier checks enabled; v1 tier bands **off**). |
| AS-07 | PH prerequisite = same-day hours on att_abs_type `'8000' > 0` (order-agnostic). |
| AS-08 | REG prerequisite for 3010 = same-day hours on att_abs_type `'1010' > 0`. |
| AS-09 | 3010 cap: `(hrs_1010 + hrs_3010) <= 12` OR if no separate 1010 track, `total_day_reg + 3010`; implement explicit 1010 tally. Also `3010 <= 12` retained via 86000260. |
| AS-10 | 3011 cap: `hrs_3011 <= 12`. |
| AS-11 | Rest day cap: `hrs_3020+3030+3040 <= 12`. |
| AS-12 | PH OT cap: `hrs_3050+3060 <= 12` AND if 8000 present, `(total_day(cnt) - hrs_8000) <= 12`. |
| AS-13 | 3020 mandatory if 3030>0 OR 3040>0. |
| AS-14 | 3060 requires 3050>0 and 8000>0 same day; 3050 requires 8000>0. |
| AS-15 | Mutual exclusion groups as matrices below. 3010 vs 3011 = **exclusive** (assumed). |
| AS-16 | SG codes may be `unit_flag='U'`; tally units in a dedicated branch **before** unit skip / parallel special-case. |
| AS-17 | Unit value must be exactly `1` when code used that day (sum per code per day). |
| AS-18 | Day map: 1=Sat, 2=Sun, 3=Mon, 4=Tue, 5=Wed, 6=Thu, 7=Fri. |
| AS-19 | 3110 allowed only days 3–7; 3120 only days 1–2; 3100 any day. |
| AS-20 | At most one day with 3100>0 per week; that day units=1. |
| AS-21 | If any 3100 in week, zero 3110 and zero 3120 all days; converse: any 3110/3120 ⇒ no 3100. |
| AS-22 | 3110 + 3120 same week on valid days = allowed. |
| AS-23 | Same-day total units across 3100+3110+3120 ≤ 1 (SB overlap). SA unknown — not coded. |
| AS-24 | New errors 86000261–86000274; must be registered in reason_code (DBA task). |
| AS-25 | No `p_end_date` feature flag inside code. |
| AS-26 | Do not change existing `is_malaysing` bypass of 86000062/67. |
| AS-27 | Keep existing 86000260 (3010>12) unchanged. |

---

## 3. Mutual Exclusion Matrices (implemented)

### 3.1 Malaysia same-day

| If day has | Forbidden same day |
|------------|--------------------|
| 3010 | 3011, 3020, 3030, 3040, 3050, 3060 |
| 3011 | 3010, 3020, 3030, 3040, 3050, 3060 |
| 3020/3030/3040 | 3010, 3011, 3050, 3060 |
| 3050/3060 | 3010, 3011, 3020, 3030, 3040 |

### 3.2 Malaysia prerequisites

| Code | Requires same day |
|------|-------------------|
| 3010 | 1010 > 0 |
| 3030 or 3040 | 3020 > 0 |
| 3050 | 8000 > 0 |
| 3060 | 8000 > 0 AND 3050 > 0 |

### 3.3 Singapore

| Rule | Predicate |
|------|-----------|
| Unit amount | if code used, sum units = 1 |
| 3110 DOW | day idx ∈ {3,4,5,6,7} |
| 3120 DOW | day idx ∈ {1,2} |
| Weekly 3100 once | count(days with 3100>0) ≤ 1 |
| Weekly exclusive | (week_3100>0) XOR-style vs (week_3110+week_3120>0): not both sides positive |
| Daily SB overlap | day_3100+day_3110+day_3120 ≤ 1 |

---

## 4. Proposed Error Codes (DBA must seed messages)

| Code | When | Suggested message |
|------|------|-------------------|
| 86000261 | MY exclusion group conflict | Malaysia OT time types cannot be combined on the same day |
| 86000262 | 3010 without 1010 | Regular time (1010) required when charging workday OT (3010) |
| 86000263 | 3010 cap incl regular | Workday regular + OT (1010+3010) exceeds 12 hours |
| 86000264 | 3011 > 12 | Off day OT (3011) exceeds 12 hours |
| 86000265 | Rest OT sum > 12 | Rest day OT (3020/3030/3040) exceeds 12 hours |
| 86000266 | 3030/3040 without 3020 | Rest day OT requires time type 3020 on the same day |
| 86000267 | 3050/3060 without 8000 | Public Holiday (8000) required before PH OT (3050/3060) |
| 86000268 | 3060 without 3050 | PH OT 3050 required before 3060 on the same day |
| 86000269 | PH OT sum > 12 | PH OT (3050/3060) exceeds 12 hours |
| 86000270 | total_day - PH > 12 | Hours excluding Public Holiday exceed 12 on PH day |
| 86000271 | SG unit ≠ 1 | Standby allowance must be exactly 1 unit |
| 86000272 | SG wrong DOW | Standby type not valid for this day of week |
| 86000273 | SG 3100 > once/week or with daily SB | Weekly standby (3100) conflicts with daily standby or multiple weekly entries |
| 86000274 | SG daily SB overlap > 1 | Cannot charge more than 1 standby unit per day |

*(86000260 retained for raw 3010>12.)*

---

## 5. Data Dictionary – Package Locals

### 5.1 New package-level variables

| Name | Type | Purpose |
|------|------|---------|
| `total_day_my3010` | existing hourstype | **already exists** – keep |
| `total_day_my3011` | hourstype (1..7) | MY off-day OT |
| `total_day_my3020` | hourstype | Rest ≤½ NWH band code |
| `total_day_my3030` | hourstype | Rest >½ ≤NWH |
| `total_day_my3040` | hourstype | Rest >NWH |
| `total_day_my3050` | hourstype | PH ≤NWH OT |
| `total_day_my3060` | hourstype | PH >NWH OT |
| `total_day_my1010` | hourstype | Regular 1010 only (MY prereq) |
| `total_day_my8000` | hourstype | PH marker 8000 |
| `total_day_sg3100` | hourstype | SG weekly SB units/day |
| `total_day_sg3110` | hourstype | SG weekday SB |
| `total_day_sg3120` | hourstype | SG weekend SB |
| `total_week_sg3100` | NUMBER | sum units 3100 week |
| `total_week_sg3110` | NUMBER | sum 3110 |
| `total_week_sg3120` | NUMBER | sum 3120 |
| `sg3100_day_count` | INTEGER | number of days with 3100>0 |

All new arrays cleared in `clear_tables`; week counters zeroed with other week totals in `validate` init.

### 5.2 Optional helper function (removable)

```text
FUNCTION f_inc1276683_is_my RETURN BOOLEAN  -- pg_org_code = 'A60'
FUNCTION f_inc1276683_is_sg RETURN BOOLEAN  -- pg_org_code IN ('A00','A80')
```

Placed near other local functions; tagged INC1276683.

---

## 6. Code Injection Points

### INJ-01 – Revision history header
**Where:** REVISION HISTORY comment block (top of file)  
**Change:** Add line:
`08-10-2026 R. Wright: INC 1276683: MalaySing Validation Rules Aug 2026 (A60 OT 3010-3060; A00/A80 SB 3100-3120)`  
**Risk:** None  

### INJ-02 – Package locals (after total_day_my3010)
**Where:** ~line after `total_day_my3010` declaration  
**Change:** Declare new day/week variables listed in §5.1  
**Removal:** Delete declarations  

### INJ-03 – `tally` special-case (units + MY/SG codes)
**Where:** Start of `tally`, **before** or branching around `IF activity_type.unit != 'U'`  

**Logic:**
```
-- Always accumulate INC1276683 tracked types by literal att_abs_type
-- even when unit_flag = 'U' (SG standby), and also when hours-based (MY OT)
CASE att_abs_type
  WHEN '3010' THEN total_day_my3010(day) += hours  -- already partially done inside unit guard; MOVE/DUPLICATE carefully
  WHEN '3011' THEN total_day_my3011(day) += hours
  ...
  WHEN '1010' THEN total_day_my1010(day) += hours
  WHEN '8000' THEN total_day_my8000(day) += hours
  WHEN '3100' THEN total_day_sg3100(day) += hours; total_week_sg3100 += hours;
  WHEN '3110' THEN ...
  WHEN '3120' THEN ...
END
```

**Important:** Existing block:
```
IF p_time_rec.att_abs_type = '3010' THEN total_day_my3010...
```
is **inside** `unit != 'U'`.  
- Keep MY OT accumulation working for hour types.  
- Add SG unit accumulation **outside** unit guard so unit lines are not lost.  
- Prefer: one consolidated INC1276683 tally subsection that runs regardless of unit_flag for the tracked type list only; leave generic REG/OT grouping as-is.

**Risk:** Double-count 3010 if both old and new paths fire → **remove duplicate old 3010-only snippet into new block** OR guard old snippet. PATCH chooses: extend new block + keep single 3010 add.

### INJ-04 – `clear_tables`
**Where:** loop body where `total_day_my3010(cnt) := 0`  
**Change:** zero all new day arrays; after loop zero `total_week_sg*`, `sg3100_day_count`  

### INJ-05 – `validate` week-total init
**Where:** block that sets `total_week_reg := 0` etc.  
**Change:** `total_week_sg3100/3110/3120 := 0; sg3100_day_count := 0;`  

### INJ-06 – `validate` day loop – MY + SG daily rules
**Where:** Inside `FOR cnt IN 1 .. 7` after core daily edits (near existing MY 86000260 in leave_check **or** end of day-loop in validate)

**Decision:**  
- **86000260 today lives in `leave_check`.** New OT coexistence is time-entry validation → place primary INC1276683 daily block at **end of day loop in `validate()`** so errors appear without leave_check.  
- Additionally keep 86000260 as-is in leave_check (no change) OR mirror 3010 cap only in validate — **no duplicate 3010>12** in new block (rely on 86000260 + new 86000263 for 1010+3010).

**Pseudo-code (A60 only):**
```
IF pg_org_code = 'A60' THEN
  v3010 := total_day_my3010(cnt); ... etc
  -- exclusions
  IF v3010>0 AND (v3011+v3020+...+v3060)>0 THEN err 86000261
  IF v3011>0 AND (v3010+v3020+...+v3060)>0 THEN err 86000261
  IF (v3020+v3030+v3040)>0 AND (v3010+v3011+v3050+v3060)>0 THEN err 86000261
  IF (v3050+v3060)>0 AND (v3010+v3011+v3020+v3030+v3040)>0 THEN err 86000261
  -- prereq / caps
  IF v3010>0 AND total_day_my1010(cnt)=0 THEN 86000262
  IF v3010>0 AND total_day_my1010(cnt)+v3010 > 12 THEN 86000263
  IF v3011 > 12 THEN 86000264
  IF v3020+v3030+v3040 > 12 THEN 86000265
  IF (v3030>0 OR v3040>0) AND v3020=0 THEN 86000266
  IF (v3050>0 OR v3060>0) AND total_day_my8000(cnt)=0 THEN 86000267
  IF v3060>0 AND v3050=0 THEN 86000268
  IF v3050+v3060 > 12 THEN 86000269
  IF total_day_my8000(cnt)>0 AND (total_day(cnt)-total_day_my8000(cnt)) > 12 THEN 86000270
END IF
```

**Pseudo-code (A00/A80 daily):**
```
IF pg_org_code IN ('A00','A80') THEN
  u3100 := total_day_sg3100(cnt); ...
  IF u3100>0 AND u3100 <> 1 THEN 86000271
  IF u3110>0 AND u3110 <> 1 THEN 86000271
  IF u3120>0 AND u3120 <> 1 THEN 86000271
  IF u3110>0 AND cnt NOT IN (3,4,5,6,7) THEN 86000272
  IF u3120>0 AND cnt NOT IN (1,2) THEN 86000272
  IF u3100+u3110+u3120 > 1 THEN 86000274
  IF u3100>0 THEN sg3100_day_count := sg3100_day_count+1  -- better compute once post-loop
END IF
```

### INJ-07 – `validate` after day loop – SG weekly rules
```
IF pg_org_code IN ('A00','A80') THEN
  -- recompute day count / week sums from arrays
  IF sg3100_day_count > 1 THEN 86000273
  IF total_week_sg3100 > 0 AND (total_week_sg3110 > 0 OR total_week_sg3120 > 0) THEN 86000273
  -- if 3100 used, week sum should be 1 (one day × 1 unit)
  IF total_week_sg3100 > 0 AND total_week_sg3100 <> 1 THEN 86000271/273
END IF
```

### INJ-08 – Helpers (optional)
Small private functions to reduce clutter; still inside removable region markers.

---

## 7. What We Explicitly Do **Not** Change

- US/CA OT edits, India standby 1SBx, Japan increments, EOY shutdown MalaySing leave rules  
- `f_eoyshutdowninfo` / `is_malaysing` definition  
- `analyze_limits` / charge_authorized  
- Global max hours 86000037  
- Existing 86000260 text/condition (unless product asks to consolidate)  
- `leave_check` balance math  

---

## 8. Removal Procedure

1. Delete all lines containing `INC1276683` markers and enclosed blocks  
   (search `INC1276683` or `MalaySing Validation Rules Aug 2026`).  
2. Restore original sole `3010` tally lines if they were merged (patched file keeps one path).  
3. `show errors` / regression smoke on non-A60 org.  

---

## 9. Test Matrix (minimum)

| # | Org | Scenario | Expect |
|---|-----|----------|--------|
| T1 | A60 | 1010=8, 3010=4 | Pass |
| T2 | A60 | 3010=4, no 1010 | 86000262 |
| T3 | A60 | 1010=8, 3010=5 | 86000263 (>12) |
| T4 | A60 | 3010 + 3020 same day | 86000261 |
| T5 | A60 | 3011=12 | Pass; 3011=12.5 fail 86000264 |
| T6 | A60 | 3030 without 3020 | 86000266 |
| T7 | A60 | 3020+3030+3040=12 | Pass |
| T8 | A60 | 8000+3050+3060 chain | Pass |
| T9 | A60 | 3060 no 3050 | 86000268 |
| T10 | A60 | 3050 no 8000 | 86000267 |
| T11 | A00 | 3100=1 on Wed only | Pass |
| T12 | A00 | 3100 two days | 86000273 |
| T13 | A00 | 3100 + 3110 same week | 86000273 |
| T14 | A80 | 3110=1 Mon–Fri | Pass |
| T15 | A80 | 3110 on Saturday | 86000272 |
| T16 | A80 | 3120 on Sunday=1 | Pass |
| T17 | A80 | 3110=2 | 86000271 |
| T18 | A80 | 3110+3120 same day | 86000274 |
| T19 | A76 | unrelated time | No new errors |
| T20 | A60 | only 3020 | Pass (mandatory companion only when 3030/3040) |

---

## 10. DBA / Config Dependencies (out of band)

1. Insert reason_code rows 86000261–86000274 (+ translations).  
2. Confirm att_abs_type rows exist for A60: 1010,8000,3010–3060.  
3. Confirm A00/A80: 3100–3120 with intended unit_flag.  
4. eTES parity change tracked separately if required.  

---

## 11. Risk Register

| Risk | Mitigation |
|------|------------|
| unit_flag U drops SG | Special-case tally outside unit guard |
| Double-count 3010 | Single accumulation path |
| Wrong DOW map | Document Sat=1; confirm org_param |
| Missing reason_code | Deploy messages before package |
| 1010/8000 wrong literals | Clarifying Q B1/B2; easy constant tweak |
| Cap double-fire with 86000260 | New block uses 86000263 for combo cap only |
```

---

## Artifact 3: `PAYEDIT2A_patched.SQL`

The full package is ~very large. Below is the **patched file construction guide with exact injectable fragments**. Apply these onto your source to produce the full patched SQL (or concatenate: original + replacements at markers).

Because pasting 400KB+ twice exceeds practical message size, the patched artifact is delivered as **surgical diff hunks** that are the complete code to insert. Each line of new logic includes the required comment.

### Hunk A — Revision history (after last REVISION HISTORY line)

```sql
--   08-10-2026 R. Wright: INC 1276683: MalaySing Validation Rules Aug 2026 (A60 OT 3010-3060; A00/A80 SB 3100-3120)
```

### Hunk B — Declarations (immediately after existing `total_day_my3010` lines)

```sql
   --RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026
   total_day_my3011      lcd.pay_edit.hourstype;  -- MY Off day OT 3011
   total_day_my3020      lcd.pay_edit.hourstype;  -- MY Rest day OT 3020
   total_day_my3030      lcd.pay_edit.hourstype;  -- MY Rest day OT 3030
   total_day_my3040      lcd.pay_edit.hourstype;  -- MY Rest day OT 3040
   total_day_my3050      lcd.pay_edit.hourstype;  -- MY PH OT 3050
   total_day_my3060      lcd.pay_edit.hourstype;  -- MY PH OT 3060
   total_day_my1010      lcd.pay_edit.hourstype;  -- MY regular 1010 (prereq for 3010)
   total_day_my8000      lcd.pay_edit.hourstype;  -- MY PH marker 8000
   total_day_sg3100      lcd.pay_edit.hourstype;  -- SG weekly standby units
   total_day_sg3110      lcd.pay_edit.hourstype;  -- SG weekday standby units
   total_day_sg3120      lcd.pay_edit.hourstype;  -- SG weekend standby units
   total_week_sg3100     NUMBER := 0;
   total_week_sg3110     NUMBER := 0;
   total_week_sg3120     NUMBER := 0;
   --RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026 END DECL
```

### Hunk C — Helper functions (after `f_activity_type` / before `get_max_daily_hours`)

```sql
--RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026
FUNCTION f_inc1276683_is_my RETURN BOOLEAN IS
BEGIN
   RETURN (pg_org_code = 'A60');
END f_inc1276683_is_my;

FUNCTION f_inc1276683_is_sg RETURN BOOLEAN IS
BEGIN
   RETURN (pg_org_code IN ('A00', 'A80'));
END f_inc1276683_is_sg;
--RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026 END HELPERS
```

### Hunk D — Replace existing 3010-only tally snippet + add unit-safe block

**Location:** Inside `tally`, replace the block:

```sql
         -- RdW 3/25/2026 INC1247720 "LCD Asia Variable Claims Malaysia"
         IF p_time_rec.att_abs_type = '3010'
         THEN
            total_day_my3010 (p_time_rec.DAY) := total_day_my3010 (p_time_rec.DAY) + p_time_rec.hours;
         END IF;
```

**And add BEFORE** `IF activity_type.unit != 'U' THEN` the following (so SG units are captured even when unit_flag='U'):

```sql
      --RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026
      -- Track MY OT / PH / REG1010 and SG standby by literal type (unit-safe for SG).
      IF p_time_rec.att_abs_type = '3010' THEN
         total_day_my3010 (p_time_rec.DAY) := NVL(total_day_my3010 (p_time_rec.DAY),0) + p_time_rec.hours;
      ELSIF p_time_rec.att_abs_type = '3011' THEN
         total_day_my3011 (p_time_rec.DAY) := NVL(total_day_my3011 (p_time_rec.DAY),0) + p_time_rec.hours;
      ELSIF p_time_rec.att_abs_type = '3020' THEN
         total_day_my3020 (p_time_rec.DAY) := NVL(total_day_my3020 (p_time_rec.DAY),0) + p_time_rec.hours;
      ELSIF p_time_rec.att_abs_type = '3030' THEN
         total_day_my3030 (p_time_rec.DAY) := NVL(total_day_my3030 (p_time_rec.DAY),0) + p_time_rec.hours;
      ELSIF p_time_rec.att_abs_type = '3040' THEN
         total_day_my3040 (p_time_rec.DAY) := NVL(total_day_my3040 (p_time_rec.DAY),0) + p_time_rec.hours;
      ELSIF p_time_rec.att_abs_type = '3050' THEN
         total_day_my3050 (p_time_rec.DAY) := NVL(total_day_my3050 (p_time_rec.DAY),0) + p_time_rec.hours;
      ELSIF p_time_rec.att_abs_type = '3060' THEN
         total_day_my3060 (p_time_rec.DAY) := NVL(total_day_my3060 (p_time_rec.DAY),0) + p_time_rec.hours;
      ELSIF p_time_rec.att_abs_type = '1010' THEN
         total_day_my1010 (p_time_rec.DAY) := NVL(total_day_my1010 (p_time_rec.DAY),0) + p_time_rec.hours;
      ELSIF p_time_rec.att_abs_type = '8000' THEN
         total_day_my8000 (p_time_rec.DAY) := NVL(total_day_my8000 (p_time_rec.DAY),0) + p_time_rec.hours;
      ELSIF p_time_rec.att_abs_type = '3100' THEN
         total_day_sg3100 (p_time_rec.DAY) := NVL(total_day_sg3100 (p_time_rec.DAY),0) + p_time_rec.hours;
         total_week_sg3100 := NVL(total_week_sg3100,0) + p_time_rec.hours;
      ELSIF p_time_rec.att_abs_type = '3110' THEN
         total_day_sg3110 (p_time_rec.DAY) := NVL(total_day_sg3110 (p_time_rec.DAY),0) + p_time_rec.hours;
         total_week_sg3110 := NVL(total_week_sg3110,0) + p_time_rec.hours;
      ELSIF p_time_rec.att_abs_type = '3120' THEN
         total_day_sg3120 (p_time_rec.DAY) := NVL(total_day_sg3120 (p_time_rec.DAY),0) + p_time_rec.hours;
         total_week_sg3120 := NVL(total_week_sg3120,0) + p_time_rec.hours;
      END IF;
      --RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026 END TALLY
```

**Delete** the old inner-only 3010 INC1247720 snippet to avoid double-count (functionality preserved in new block).  
Generic `activity_group = 'OT'` tally still runs for hour-flagged MY OT codes inside `unit != 'U'` — intentional.

### Hunk E — `clear_tables` loop (beside my3010 clear)

```sql
         --RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026
         total_day_my3010 (cnt) := 0;
         total_day_my3011 (cnt) := 0;
         total_day_my3020 (cnt) := 0;
         total_day_my3030 (cnt) := 0;
         total_day_my3040 (cnt) := 0;
         total_day_my3050 (cnt) := 0;
         total_day_my3060 (cnt) := 0;
         total_day_my1010 (cnt) := 0;
         total_day_my8000 (cnt) := 0;
         total_day_sg3100 (cnt) := 0;
         total_day_sg3110 (cnt) := 0;
         total_day_sg3120 (cnt) := 0;
         --RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026 END CLEAR_DAY
```

After the day loop in `clear_tables`:

```sql
      --RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026
      total_week_sg3100 := 0;
      total_week_sg3110 := 0;
      total_week_sg3120 := 0;
      --RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026 END CLEAR_WEEK
```

### Hunk F — `validate` initialization (with other total_week_* := 0)

```sql
      --RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026
      total_week_sg3100 := 0;
      total_week_sg3110 := 0;
      total_week_sg3120 := 0;
      --RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026 END INIT
```

### Hunk G — End of day loop in `validate` (before `END LOOP` of `FOR cnt IN 1 .. 7`)

Insert this entire block:

```sql
            --RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026
            ------------------------------------------------------------------
            -- INC1276683 daily: Malaysia A60 OT types + Singapore A00/A80 SB
            -- Removable block – delete through END INC1276683 DAILY
            ------------------------------------------------------------------
            DECLARE
               v_my3010 NUMBER := NVL(total_day_my3010(cnt), 0);
               v_my3011 NUMBER := NVL(total_day_my3011(cnt), 0);
               v_my3020 NUMBER := NVL(total_day_my3020(cnt), 0);
               v_my3030 NUMBER := NVL(total_day_my3030(cnt), 0);
               v_my3040 NUMBER := NVL(total_day_my3040(cnt), 0);
               v_my3050 NUMBER := NVL(total_day_my3050(cnt), 0);
               v_my3060 NUMBER := NVL(total_day_my3060(cnt), 0);
               v_my1010 NUMBER := NVL(total_day_my1010(cnt), 0);
               v_my8000 NUMBER := NVL(total_day_my8000(cnt), 0);
               v_rest   NUMBER;
               v_phot   NUMBER;
               v_sg3100 NUMBER := NVL(total_day_sg3100(cnt), 0);
               v_sg3110 NUMBER := NVL(total_day_sg3110(cnt), 0);
               v_sg3120 NUMBER := NVL(total_day_sg3120(cnt), 0);
               v_sgsum  NUMBER;
            BEGIN
               IF f_inc1276683_is_my THEN
                  v_rest := v_my3020 + v_my3030 + v_my3040;
                  v_phot := v_my3050 + v_my3060;

                  -- Mutual exclusion across MY OT groups
                  IF v_my3010 > 0 AND (v_my3011 + v_rest + v_phot) > 0 THEN
                     record_error(p_error_count, p_error_line, p_error_number, cnt, 86000261);
                  ELSIF v_my3011 > 0 AND (v_my3010 + v_rest + v_phot) > 0 THEN
                     record_error(p_error_count, p_error_line, p_error_number, cnt, 86000261);
                  ELSIF v_rest > 0 AND (v_my3010 + v_my3011 + v_phot) > 0 THEN
                     record_error(p_error_count, p_error_line, p_error_number, cnt, 86000261);
                  ELSIF v_phot > 0 AND (v_my3010 + v_my3011 + v_rest) > 0 THEN
                     record_error(p_error_count, p_error_line, p_error_number, cnt, 86000261);
                  END IF;

                  -- 3010 requires 1010; cap 1010+3010 <= 12
                  IF v_my3010 > 0 AND v_my1010 = 0 THEN
                     record_error(p_error_count, p_error_line, p_error_number, cnt, 86000262);
                  END IF;
                  IF v_my3010 > 0 AND (v_my1010 + v_my3010) > 12 THEN
                     record_error(p_error_count, p_error_line, p_error_number, cnt, 86000263);
                  END IF;

                  -- 3011 OT-only cap
                  IF v_my3011 > 12 THEN
                     record_error(p_error_count, p_error_line, p_error_number, cnt, 86000264);
                  END IF;

                  -- Rest day OT cap + 3020 mandatory companion
                  IF v_rest > 12 THEN
                     record_error(p_error_count, p_error_line, p_error_number, cnt, 86000265);
                  END IF;
                  IF (v_my3030 > 0 OR v_my3040 > 0) AND v_my3020 = 0 THEN
                     record_error(p_error_count, p_error_line, p_error_number, cnt, 86000266);
                  END IF;

                  -- PH chain 8000 -> 3050 -> 3060 and caps
                  IF (v_my3050 > 0 OR v_my3060 > 0) AND v_my8000 = 0 THEN
                     record_error(p_error_count, p_error_line, p_error_number, cnt, 86000267);
                  END IF;
                  IF v_my3060 > 0 AND v_my3050 = 0 THEN
                     record_error(p_error_count, p_error_line, p_error_number, cnt, 86000268);
                  END IF;
                  IF v_phot > 12 THEN
                     record_error(p_error_count, p_error_line, p_error_number, cnt, 86000269);
                  END IF;
                  IF v_my8000 > 0 AND (NVL(total_day(cnt),0) - v_my8000) > 12 THEN
                     record_error(p_error_count, p_error_line, p_error_number, cnt, 86000270);
                  END IF;
               END IF; -- is_my

               IF f_inc1276683_is_sg THEN
                  -- Exactly 1 unit when used
                  IF v_sg3100 > 0 AND v_sg3100 <> 1 THEN
                     record_error(p_error_count, p_error_line, p_error_number, cnt, 86000271);
                  END IF;
                  IF v_sg3110 > 0 AND v_sg3110 <> 1 THEN
                     record_error(p_error_count, p_error_line, p_error_number, cnt, 86000271);
                  END IF;
                  IF v_sg3120 > 0 AND v_sg3120 <> 1 THEN
                     record_error(p_error_count, p_error_line, p_error_number, cnt, 86000271);
                  END IF;

                  -- DOW: idx 1=Sat .. 7=Fri; 3110=Mon-Fri (3-7); 3120=Sat-Sun (1-2)
                  IF v_sg3110 > 0 AND cnt NOT IN (3, 4, 5, 6, 7) THEN
                     record_error(p_error_count, p_error_line, p_error_number, cnt, 86000272);
                  END IF;
                  IF v_sg3120 > 0 AND cnt NOT IN (1, 2) THEN
                     record_error(p_error_count, p_error_line, p_error_number, cnt, 86000272);
                  END IF;

                  -- At most 1 SB unit per day across SB codes
                  v_sgsum := v_sg3100 + v_sg3110 + v_sg3120;
                  IF v_sgsum > 1 THEN
                     record_error(p_error_count, p_error_line, p_error_number, cnt, 86000274);
                  END IF;
               END IF; -- is_sg
            END;
            --RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026 END DAILY
```

### Hunk H — After day loop ends (still inside `f_worker_info` success branch), before leave_check comment

```sql
         --RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026
         ------------------------------------------------------------------
         -- INC1276683 weekly Singapore standby exclusivity
         -- Removable block – delete through END INC1276683 WEEKLY
         ------------------------------------------------------------------
         IF f_inc1276683_is_sg THEN
            DECLARE
               v_days_3100 INTEGER := 0;
               v_d         INTEGER;
            BEGIN
               FOR v_d IN 1 .. 7 LOOP
                  IF NVL(total_day_sg3100(v_d), 0) > 0 THEN
                     v_days_3100 := v_days_3100 + 1;
                  END IF;
               END LOOP;

               -- Weekly 3100 only once; week total must be 1 unit when used
               IF v_days_3100 > 1
                  OR (NVL(total_week_sg3100,0) > 0 AND NVL(total_week_sg3100,0) <> 1) THEN
                  record_error(p_error_count, p_error_line, p_error_number, 0, 86000273);
               END IF;

               -- 3100 exclusive vs 3110/3120 in same week
               IF NVL(total_week_sg3100,0) > 0
                  AND (NVL(total_week_sg3110,0) > 0 OR NVL(total_week_sg3120,0) > 0) THEN
                  record_error(p_error_count, p_error_line, p_error_number, 0, 86000273);
               END IF;
            END;
         END IF;
         --RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026 END WEEKLY
```

### Hunk I — leave_check 86000260 block

**Leave unchanged** (still A60 3010>12). New combo cap is 86000263 in validate.

---

## Nested DECLARE note

`validate`’s day loop is not inside a nested subprog that forbids DECLARE in a block statement — anonymous `DECLARE ... BEGIN ... END;` inside the loop is valid PL/SQL. If your standards forbid it, hoist locals to the outer `validate` declarative section as `l_inc1276683_*` variables instead (still tagged removable).

---

## How to build full `PAYEDIT2A_patched.SQL`

1. Copy `PAYEDIT2A.SQL` → `PAYEDIT2A_patched.SQL`  
2. Apply Hunks A–I in order  
3. Remove old inner-only 3010 tally (Hunk D)  
4. Compile: `SHOW ERRORS`  
5. Seed reason codes 86000261–86000274  
6. Run test matrix §9  

---

# Design rationale (short)

| Choice | Why |
|--------|-----|
| Org literals `A60` / `A00`,`A80` | Surgical; no other org enters blocks |
| Tally before `unit != 'U'` | SG standby units would otherwise vanish |
| validate() not leave_check | Code coexistence is entry validation; balances unrelated |
| Separate error per rule class | Clearer UX; removable independently if product drops a rule |
| No tier band math on 3020/3030/3040 | Spec ambiguous on NWH enforcement; exclusion+cap+mandatory 3020 covers stated LCD rules |
| 3110+3120 same week OK | Matches “cannot combine with 3100” wording only |
| Comment markers INC1276683 | One search-delete removal path |

---

If you want, I can next (a) emit a single contiguous `PAYEDIT2A_patched.SQL` with hunks already merged in a downloadable form split across messages, or (b) adjust assumptions after you answer the P0 clarifying questions (especially **1010/8000**, **SA codes**, and **3011 unfinished RDW note**).
