Now I have a thorough understanding of the codebase. Let me produce all three artifacts.

---

## CLARIFYING_QUESTIONS.md

```markdown
# CLARIFYING QUESTIONS — Priority Change Validation Rules (Aug '26)

**Source**: Slide 4 (Malaysia Overtime) & Slide 8 (Singapore Standby Allowance)
**Date**: 10 August 2026
**Reference**: INC1276683

---

## 1. Unit vs. Hour Coding for Singapore Standby (3100, 3110, 3120)

**Rule says**: "The number must be 1 UNIT."

**Question**:
Are these time codes configured in `lcd.att_abs_type` with `unit_flag = 'U'` (unit-based entry) 
or `unit_flag = 'H'` (hour-based entry with 1.0 hour = 1 unit)?

**Why it matters**: If they are unit-coded (`unit_flag = 'U'`), the existing `tally` procedure 
will skip them entirely, and a completely different tracking mechanism is needed 
(reading the `units` column from the input rather than `hours`). The patched SQL file 
**assumes hour-coded** (consistent with India standby codes 1SBH/1SBF/1SBD).

---

## 2. PH Prerequisite Time Code for Groups 2 and 3

**Rule says**: "Enter a PH (8000) first" before 3050 or 3060.

**Question**: 
- Is time code `8000` the only "PH" prerequisite, or are there other public holiday codes?
- Does the PH prerequisite apply to the same calendar day (the PH and OT must fall on the same date), 
  or does it mean the employee must be on an active PH assignment for that day?
- Should we validate that the PH hours (`8000`) are > 0 on the same day before allowing 3050/3060?

**Assumption in patch**: Checks that `total_day_phl(cnt) > 0` on the same day as 3050/3060 usage.
The PH hours are excluded from the 12-hour OT cap.

---

## 3. "Working Regular Day" Definition for 3010

**Rule says**: "On working regular day then EE must enter regular time code 1010."

**Question**:
- Is `1010` the only regular time code, or are there multiple REG-group codes?
- Is this a **hard prerequisite** (error if 3010 is entered without 1010 on the same day) or an 
  **informational reminder**?
- What constitutes an "off day" vs. "working regular day"? Is it determined by the eTES calendar 
  or the employee's schedule?

**Assumption in patch**: The rule "Cannot enter any time for 3020, 3030, 3040, 3050, 3060" is enforced 
as a mutual exclusion. The 1010 prerequisite is **not enforced** in this patch (needs clarification).
If 1010 is indeed a hard prerequisite, the check would be: 
`IF total_day_my3010(cnt) > 0 AND total_day_reg(cnt) = 0 THEN error`.

---

## 4. "RDW" (Rest Day Worked) Clarification

**Rule says**: "RDW: any time a user enters 3011, then that day counts as an 'Off day'."

**Question**:
- Time code `3011` is mentioned in the GHR Time Codes column but the validation rules only discuss 
  3010. Is `3011` a separate code that needs validation, or is it informational context only?
- If `3011` makes the day an "off day", does 3010 become invalid on that day? Does the cap change?

**Assumption in patch**: 3011 is not part of the current scope. Only 3010-3060 are validated.

---

## 5. Day-of-Week Mapping

**Question**:
The existing codebase uses `week_start_saturday` logic in `f_is_override_rule_applies` and in 
the IT_CALENDAR queries. This means day index 1 = Saturday, 2 = Sunday, 3 = Monday, …, 7 = Friday.

For Singapore standby:
- 3110 is "weekday only" — does this mean Monday through Friday (day indices 3–7)?
- 3120 is "weekend only" — Saturday and Sunday (day indices 1–2)?

**Assumption in patch**: Yes, following the existing day-of-week convention in the codebase:
- Weekdays: day index 3–7 (Monday–Friday)
- Weekend: day index 1–2 (Saturday–Sunday)

---

## 6. "12 Hours Cap" Specifics

**Rule says various caps**:

| Group | Cap Rule |
|-------|----------|
| 3010 (regular day) | 12 hrs cap (Including OT) |
| 3010 (off day) | 12 hrs cap (Only OT) |
| 3020/3030/3040 | 12 hrs cap (OT Only) |
| 3050/3060 | 12 hrs cap (excluding PH Hrs) |

**Question**:
- For 3010 on a "regular working day", the cap is `total_day_reg + total_day_ot ≤ 12`. Correct?
- For 3010 on an "off day", the cap is `total_day_ot ≤ 12`. How does the code distinguish 
  a regular day from an off day? Via 1010 presence? Via calendar? Via 3011 entry?
- For 3050/3060, "excluding PH Hrs" means `total_day_ot ≤ 12` (PH hours not counted toward the cap)?

**Assumption in patch**: 
- 3010 cap: `total_day_reg(cnt) + total_day_my3010(cnt) > 12.0` triggers error 86000264
- 3020-3040 cap: `total_day_my3020(cnt) + total_day_my3030(cnt) + total_day_my3040(cnt) > 12.0` triggers error 86000264
- 3050-3060 cap: `total_day_my3050(cnt) + total_day_my3060(cnt) > 12.0` triggers error 86000264
  (PH hours not counted)

---

## 7. 3020 "Mandatory" Prerequisite

**Rule says**: "Employee can enter OT on the same day for Time code 3020 (Mandatory) along with 3030 and 3040."

**Question**:
- Does this mean that 3030 and 3040 can **only** be entered if 3020 has also been entered on the same day?
- If 3020 is mandatory, can an employee enter only 3020 without 3030/3040? (Presumably yes)
- Is there a minimum 3020 hours requirement? (e.g., must be at least some threshold)

**Assumption in patch**: 3030 or 3040 present without 3020 → error 86000262. 
3020 alone is valid. No minimum 3020 threshold beyond > 0.

---

## 8. 3050/3060 Ordering

**Rule says**: "Enter a PH (8000) first and then employee can enter 3050 and only then can utilize 3060."

**Question**:
- Does 3060 require 3050 to be present on the same day? (i.e., 3050 is a prerequisite for 3060)
- Or is the rule simply that both 3050 and 3060 require PH(8000) first, and they are independent of each other?

**Assumption in patch**: No ordering between 3050 and 3060 beyond the shared PH prerequisite. 
Both can be entered independently as long as PH(8000) is present on the same day.

---

## 9. Error Code Assignment

**Question**: What error code range should be used for the new validation rules?

The existing Malaysia check uses `86000260`. Proposed new codes: `86000261`–`86000267`. 
Are these available in the `reason_code` table, or do new codes need to be inserted?

**Action needed**: Confirm error code availability and create corresponding entries in 
`lcd.reason_code` table with appropriate error message text.

---

## 10. Scope: Malaysia Org "A60" Only vs. All Malaysia Orgs

**Question**:
- Slide 4 says "Malaysia (Org 'A60')" — does this validation apply **only** to org A60?
- What about other Malaysia orgs (if any exist)?
- The existing `is_malaysing` flag covers A00, A60, A80. Should the OT rules apply to all three?

**Assumption in patch**: Malaysia OT rules apply to A60 only (using `worker_info.is_malaysia_a60`). 
Singapore standby rules apply to A00 and A80 only.

---

## 11. Existing 86000062/86000067 Bypass Interaction

**Question**:
The existing code already has:
```sql
IF NOT (is_malaysing) THEN
    -- 86000062 check
END IF;
```
and
```sql
IF NOT (is_malaysing) THEN
    -- 86000067 check
END IF;
```

Will the new Malaysia OT validation rules (3010-3060 daily caps and mutual exclusions) 
fully replace the need for 86000062/86000067 for A60 workers, or should both coexist?

**Assumption in patch**: The existing bypasses remain. The new rules **supplement** them 
without removing the existing bypass logic.
```

---

## PATCH_PLAN.md

```markdown
# PATCH PLAN — Priority Change Validation Rules Aug '26

**Reference**: INC1276683
**Date**: 10 August 2026
**Author**: RdW
**Source File**: PAYEDIT2A.SQL (Package Body: `lcd.pay_editA`)

---

## Executive Summary

This patch adds validation rules for:
- **Malaysia (Org A60)**: Overtime time codes 3010–3060 with daily 12-hour caps, 
  cross-group mutual exclusion, and PH prerequisite checks.
- **Singapore (Orgs A00, A80)**: Standby allowance time codes 3100–3120 with weekly 
  unit limits and mutual exclusion.

All new code is wrapped in clearly marked sections (tagged `--RdW 8/10/2026 INC1276683`) 
and can be removed without affecting other business logic.

---

## Data Dictionary: Proposed Changes

### A. New Package-Level Variables

| Variable | Type | Purpose | Org Scope |
|----------|------|---------|-----------|
| `total_day_my3020` | `lcd.pay_edit.hourstype` | Daily tracking for OT time code 3020 | A60 |
| `total_day_my3030` | `lcd.pay_edit.hourstype` | Daily tracking for OT time code 3030 | A60 |
| `total_day_my3040` | `lcd.pay_edit.hourstype` | Daily tracking for OT time code 3040 | A60 |
| `total_day_my3050` | `lcd.pay_edit.hourstype` | Daily tracking for OT time code 3050 | A60 |
| `total_day_my3060` | `lcd.pay_edit.hourstype` | Daily tracking for OT time code 3060 | A60 |
| `total_day_sg3100` | `lcd.pay_edit.hourstype` | Daily tracking for standby 3100 | A00, A80 |
| `total_day_sg3110` | `lcd.pay_edit.hourstype` | Daily tracking for standby 3110 | A00, A80 |
| `total_day_sg3120` | `lcd.pay_edit.hourstype` | Daily tracking for standby 3120 | A00, A80 |
| `total_week_sg3100` | `NUMBER` | Weekly total for standby 3100 | A00, A80 |
| `total_week_sg3110` | `NUMBER` | Weekly total for standby 3110 | A00, A80 |
| `total_week_sg3120` | `NUMBER` | Weekly total for standby 3120 | A00, A80 |
| `is_singapore` | `BOOLEAN` | Flag indicating Singapore org (A00 or A80) | A00, A80 |

### B. Changes to Procedure: `tally`

**Location**: After the existing `3010` tracking block (near `-- RdW 3/25/2026 INC1247720`).

**Additions**:
1. Track 3020/3030/3040/3050/3060 hours in their respective daily arrays.
2. Track 3100/3110/3120 hours in their respective daily arrays.
3. Accumulate weekly totals for 3100/3110/3120.

### C. Changes to Procedure: `clear_tables`

**Location**: Inside the `FOR cnt IN 1 .. 7` loop, after existing initializations.

**Additions**:
Initialize all new daily tracking arrays to 0.

### D. Changes to Procedure: `validate`

**Location 1**: Near other weekly total initializations (after `total_week_my3010`).

**Additions**:
Initialize `total_week_sg3100`, `total_week_sg3110`, `total_week_sg3120` to 0.

**Location 2**: After or within `f_eoyshutdowninfo` call, or in the main body.

**Additions**:
Set `is_singapore := (pg_org_code IN ('A00', 'A80'))`.

### E. Changes to Procedure: `leave_check`

**Location 1**: Inside the daily loop (`FOR cnt IN 1 .. 7`), after the existing 
86000260 check (`-- End MY-SG Leave Check Submodule`).

**Additions — Malaysia OT Validation (A60 only, guarded by `worker_info.is_malaysia_a60`)**:

| Check | Error Code | Rule |
|-------|-----------|------|
| Cross-group exclusion: Group 1 (3010) vs Groups 2+3 | 86000261 | If 3010 > 0 AND any of {3020,3030,3040,3050,3060} > 0 → error |
| Cross-group exclusion: Group 2 (3020-3040) vs Groups 1+3 | 86000262 | If any of {3020,3030,3040} > 0 AND any of {3010,3050,3060} > 0 → error |
| Cross-group exclusion: Group 3 (3050-3060) vs Groups 1+2 | 86000263 | If any of {3050,3060} > 0 AND any of {3010,3020,3030,3040} > 0 → error |
| 3020 prerequisite for Group 2 | 86000264 | If (3030 > 0 OR 3040 > 0) AND 3020 = 0 → error |
| PH prerequisite for Group 3 | 86000265 | If any of {3050,3060} > 0 AND total_day_phl(cnt) = 0 → error |
| Group 1 daily cap (incl. reg time) | 86000266 | If 3010 > 0 AND (total_day_reg(cnt) + 3010) > 12.0 → error |
| Groups 2+3 daily cap (OT only) | 86000267 | If (3020+3030+3040) > 12.0 OR (3050+3060) > 12.0 → error |

**Location 2**: After the daily loop (after `END LOOP`), before the `END IF` for 
`total_hours > 0`.

**Additions — Singapore Standby Validation (A00/A80 only, guarded by `is_singapore`)**:
- Compute `total_week_sg3100`, `total_week_sg3110`, `total_week_sg3120` by summing daily arrays.
- Error 86000268: 3100 used more than once per week (`total_week_sg3100 > 1.0`).
- Error 86000269: 3100 combined with 3110 or 3120 in the same week.
- Error 86000270: 3110 > 1.0 on a weekday or 3110 > 0 on a weekend.
- Error 86000271: 3120 > 1.0 on a weekend day or 3120 > 0 on a weekday.

### F. Assumptions Made (to Resolve Ambiguities)

| # | Assumption |
|---|-----------|
| 1 | Singapore standby codes (3100/3110/3120) are **hour-coded** (`unit_flag = 'H'`), consistent with India standby codes. Each "1 UNIT" equals 1.0 hour. |
| 2 | PH prerequisite code is `8000`, which maps to activity group `PHL`. Check: `total_day_phl(cnt) > 0`. |
| 3 | Day index mapping follows existing convention: 1=Sat, 2=Sun, 3=Mon, 4=Tue, 5=Wed, 6=Thu, 7=Fri. |
| 4 | 1010 regular-time prerequisite for 3010 is NOT enforced in this patch (needs clarification). |
| 5 | No ordering enforced between 3050 and 3060 (both independently require PH). |
| 6 | 3020 must have > 0 hours (not just the code present) to satisfy the prerequisite for 3030/3040. |
| 7 | Error codes 86000261–86000271 are available. Corresponding `reason_code` entries will be created separately. |
| 8 | Existing 86000062/86000067 bypass for `is_malaysing` orgs remains intact. New rules supplement. |
| 9 | Malaysia OT rules apply to A60 only. Singapore standby rules apply to A00 and A80 only. |
```

---

## PAYEDIT2A_patched.SQL

Now I'll write the comprehensive patched SQL file. This is a large file, so I'll focus on the specific injection points with clear markers.

```sql
/*************************************************************************************
* PACKAGE: pay_editA (Package Body)  (Payedit2A.sql)
* PATCHED: RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026
*
* SUMMARY OF PATCH INJECTIONS:
*   [INJECTION 1]  New global variables (after total_day_my3010 declaration)
*   [INJECTION 2]  New tracking in tally() procedure (after 3010 tracking)
*   [INJECTION 3]  New initializations in clear_tables() procedure
*   [INJECTION 4]  New weekly total initializations in validate() procedure
*   [INJECTION 5]  Singapore flag set in validate() procedure
*   [INJECTION 6]  Malaysia OT validation in leave_check() daily loop
*   [INJECTION 7]  Singapore SB validation in leave_check() after daily loop
*/

--************************************************************************************
CREATE OR REPLACE PACKAGE BODY lcd.pay_editA
AS
   

--****************************************************************************
-- Package Local Declarations
--****************************************************************************

   -- [All existing type declarations remain unchanged...]
   -- (balancerecordtype, activitygrouptype, etc.)

   -- [All existing total_day_* and total_week_* declarations remain unchanged...]

   -- RdW 3/25/2026 INC1247720 "LCD Asia Variable Claims Malaysia"
   total_day_my3010      lcd.pay_edit.hourstype;             -- store Variable Claims att_abs_type 3010 hours per day (Malaysia)

-- ###########################################################################
-- RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026 [INJECTION 1]
-- New global variables for Malaysia OT (A60) and Singapore Standby (A00/A80)
-- ###########################################################################
   -- Malaysia OT tracking (A60 only)
   total_day_my3020      lcd.pay_edit.hourstype;             -- Malaysia 3020 OT-RstDy<=Hlf-NWH hours per day
   total_day_my3030      lcd.pay_edit.hourstype;             -- Malaysia 3030 OT-RstDy>Hlf-NWH<=NWH hours per day
   total_day_my3040      lcd.pay_edit.hourstype;             -- Malaysia 3040 OT-RstDy>NWH hours per day
   total_day_my3050      lcd.pay_edit.hourstype;             -- Malaysia 3050 OT-PH<=NWH hours per day
   total_day_my3060      lcd.pay_edit.hourstype;             -- Malaysia 3060 OT-PH>NWH hours per day

   -- Singapore Standby tracking (A00, A80 only)
   total_day_sg3100      lcd.pay_edit.hourstype;             -- Singapore 3100 SB-Weekly hours per day
   total_day_sg3110      lcd.pay_edit.hourstype;             -- Singapore 3110 SB-Weekday hours per day
   total_day_sg3120      lcd.pay_edit.hourstype;             -- Singapore 3120 SB-Weekend hours per day
   total_week_sg3100     NUMBER := 0;                        -- Singapore 3100 weekly total
   total_week_sg3110     NUMBER := 0;                        -- Singapore 3110 weekly total
   total_week_sg3120     NUMBER := 0;                        -- Singapore 3120 weekly total

   -- Singapore org flag
   is_singapore          BOOLEAN := FALSE;                   -- TRUE for orgs A00, A80
-- ###########################################################################
-- END INJECTION 1
-- ###########################################################################

   -- [Rest of existing declarations remain unchanged...]
   -- (total_absence_inc, total_adj_vac_hrs, etc.)



--****************************************************************************
-- Locally Defined Procedures and Functions
--****************************************************************************

-- [f_eoyshutdowninfo, f_is_override_rule_applies, get_remote_balance,
--  f_activity_type, get_max_daily_hours, collect_limits all remain unchanged]

   
/*************************************************************************************
* PROCEDURE: tally
*
* PURPOSE:
*   Tallies data for the week, storing results in global variables
*
*************************************************************************************/
   PROCEDURE tally (p_time_rec IN lcd.pay_edit.timetype)
   IS
      activity_type   activitygrouptype;
   BEGIN
      -- [existing code unchanged through the standby tracking section...]

         -- RdW 3/25/2026 INC1247720 "LCD Asia Variable Claims Malaysia"
         IF p_time_rec.att_abs_type = '3010'
         THEN
            total_day_my3010 (p_time_rec.DAY) := total_day_my3010 (p_time_rec.DAY) + p_time_rec.hours;
         END IF;
         -- ____________________________________________________________________________

-- ###########################################################################
-- RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026 [INJECTION 2]
-- Tally Malaysia OT codes 3020-3060 and Singapore Standby codes 3100-3120
-- ###########################################################################
         -- Malaysia OT tracking (3020-3060)
         IF p_time_rec.att_abs_type = '3020'
         THEN
            total_day_my3020 (p_time_rec.DAY) := total_day_my3020 (p_time_rec.DAY) + p_time_rec.hours;
         END IF;

         IF p_time_rec.att_abs_type = '3030'
         THEN
            total_day_my3030 (p_time_rec.DAY) := total_day_my3030 (p_time_rec.DAY) + p_time_rec.hours;
         END IF;

         IF p_time_rec.att_abs_type = '3040'
         THEN
            total_day_my3040 (p_time_rec.DAY) := total_day_my3040 (p_time_rec.DAY) + p_time_rec.hours;
         END IF;

         IF p_time_rec.att_abs_type = '3050'
         THEN
            total_day_my3050 (p_time_rec.DAY) := total_day_my3050 (p_time_rec.DAY) + p_time_rec.hours;
         END IF;

         IF p_time_rec.att_abs_type = '3060'
         THEN
            total_day_my3060 (p_time_rec.DAY) := total_day_my3060 (p_time_rec.DAY) + p_time_rec.hours;
         END IF;

         -- Singapore Standby tracking (3100-3120)
         IF p_time_rec.att_abs_type = '3100'
         THEN
            total_day_sg3100 (p_time_rec.DAY) := total_day_sg3100 (p_time_rec.DAY) + p_time_rec.hours;
            total_week_sg3100 := total_week_sg3100 + p_time_rec.hours;
         END IF;

         IF p_time_rec.att_abs_type = '3110'
         THEN
            total_day_sg3110 (p_time_rec.DAY) := total_day_sg3110 (p_time_rec.DAY) + p_time_rec.hours;
            total_week_sg3110 := total_week_sg3110 + p_time_rec.hours;
         END IF;

         IF p_time_rec.att_abs_type = '3120'
         THEN
            total_day_sg3120 (p_time_rec.DAY) := total_day_sg3120 (p_time_rec.DAY) + p_time_rec.hours;
            total_week_sg3120 := total_week_sg3120 + p_time_rec.hours;
         END IF;
-- ###########################################################################
-- END INJECTION 2
-- ###########################################################################

         -- [rest of tally procedure remains unchanged...]
         IF activity_type.fml = 'Y'
         THEN --FML hours
         -- ...


   
/*************************************************************************************
* PROCEDURE: clear_tables
*
* PURPOSE:
*  Clears tables used to accumulate day total information
*
*************************************************************************************/
   PROCEDURE clear_tables
   IS
   BEGIN
      FOR cnt IN 1 .. 7
      LOOP
         -- [all existing initializations remain unchanged...]

         -- RdW 3/25/2026 INC1247720 "LCD Asia Variable Claims Malaysia"
         total_day_my3010 (cnt)       := 0;

-- ###########################################################################
-- RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026 [INJECTION 3]
-- Initialize new Malaysia OT and Singapore Standby daily arrays
-- ###########################################################################
         -- Malaysia OT daily arrays
         total_day_my3020 (cnt)       := 0;
         total_day_my3030 (cnt)       := 0;
         total_day_my3040 (cnt)       := 0;
         total_day_my3050 (cnt)       := 0;
         total_day_my3060 (cnt)       := 0;

         -- Singapore Standby daily arrays
         total_day_sg3100 (cnt)       := 0;
         total_day_sg3110 (cnt)       := 0;
         total_day_sg3120 (cnt)       := 0;
-- ###########################################################################
-- END INJECTION 3
-- ###########################################################################

      END LOOP;

         --  RdW 11/23/2025 INC1138065 India Supplemental Pay
         total_week_stdby := 0;

-- ###########################################################################
-- RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026 [INJECTION 4]
-- Initialize Singapore Standby weekly totals
-- ###########################################################################
         total_week_sg3100 := 0;
         total_week_sg3110 := 0;
         total_week_sg3120 := 0;
-- ###########################################################################
-- END INJECTION 4
-- ###########################################################################

      att_array.DELETE;
   END clear_tables;


-- [Total_Day_without_OT, Total_Week_without_OT, f_worker_info,
--  f_get_worker_balance, record_error, charge_authorized,
--  analyze_limits all remain unchanged]


/*************************************************************************************
* PROCEDURE: validate
*
* PURPOSE:
*  Performs pay validation edits for a week's worth of time entries
*
*************************************************************************************/

  PROCEDURE  validate( ... )
   IS
      -- [all existing declarations remain unchanged...]

   BEGIN

        -- [existing initialization code unchanged...]

      --Initialize week total variables
      total_hours := 0;
      total_week_reg := 0;
      -- [all existing weekly total initializations remain unchanged...]
      total_week_phl := 0;

-- ###########################################################################
-- RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026 [INJECTION 5]
-- Set Singapore org flag for downstream validation
-- ###########################################################################
      -- Singapore org flag (A00, A80)
      is_singapore := (p_org_code IN ('A00', 'A80'));
-- ###########################################################################
-- END INJECTION 5
-- ###########################################################################

      accum_reg := 0;
      -- [rest of validate procedure remains unchanged...]


-- [leave_check procedure - most of it remains unchanged]

    PROCEDURE leave_check( ... )
   IS
      -- [all existing declarations remain unchanged...]

   BEGIN

      -- [all existing code remains unchanged through the daily loop...]

            -- ============================================================
            -- RdW 3/25/2026 INC1247720 "LCD Asia Variable Claims Malaysia"
            -- MY-SG Leave Check Submodule
            -- Check 260: Malaysia org (any salary group)
            --   att_abs_type '3010' daily total may not exceed 12.0 hours
            -- ============================================================
            IF worker_info.is_malaysia_a60 THEN
               IF total_day_my3010(cnt) > 12.0 THEN
                  record_error(
                     p_error_count,
                     p_error_line,
                     p_error_number,
                     cnt,
                     86000260
                  ); -- "Variable Claims (3010) hours exceeded 12.0 for the day"
               END IF;
            END IF;
            -- End MY-SG Leave Check Submodule

-- ###########################################################################
-- RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026 [INJECTION 6]
-- Malaysia OT Validation (A60 only) — daily cross-group & cap checks
-- ###########################################################################
            IF worker_info.is_malaysia_a60 THEN

               -- Compute group totals for the day
               DECLARE
                  v_grp1_3010       NUMBER := NVL(total_day_my3010(cnt), 0);
                  v_grp2_3020       NUMBER := NVL(total_day_my3020(cnt), 0);
                  v_grp2_3030       NUMBER := NVL(total_day_my3030(cnt), 0);
                  v_grp2_3040       NUMBER := NVL(total_day_my3040(cnt), 0);
                  v_grp3_3050       NUMBER := NVL(total_day_my3050(cnt), 0);
                  v_grp3_3060       NUMBER := NVL(total_day_my3060(cnt), 0);
                  v_grp2_total      NUMBER := v_grp2_3020 + v_grp2_3030 + v_grp2_3040;
                  v_grp3_total      NUMBER := v_grp3_3050 + v_grp3_3060;
                  v_day_reg         NUMBER := NVL(total_day_reg(cnt), 0);
                  v_day_phl         NUMBER := NVL(total_day_phl(cnt), 0);
               BEGIN

                  -- Check 261: Group 1 (3010) mutual exclusion with Groups 2 & 3
                  IF v_grp1_3010 > 0 AND (v_grp2_total > 0 OR v_grp3_total > 0) THEN
                     record_error(p_error_count, p_error_line, p_error_number, cnt, 86000261);
                     -- "OT Workday (3010) cannot be combined with Rest Day or Public Holiday OT"
                  END IF;

                  -- Check 262: Group 2 (3020-3040) mutual exclusion with Groups 1 & 3
                  IF v_grp2_total > 0 AND (v_grp1_3010 > 0 OR v_grp3_total > 0) THEN
                     record_error(p_error_count, p_error_line, p_error_number, cnt, 86000262);
                     -- "OT Rest Day (3020/3030/3040) cannot be combined with Workday or PH OT"
                  END IF;

                  -- Check 263: Group 3 (3050-3060) mutual exclusion with Groups 1 & 2
                  IF v_grp3_total > 0 AND (v_grp1_3010 > 0 OR v_grp2_total > 0) THEN
                     record_error(p_error_count, p_error_line, p_error_number, cnt, 86000263);
                     -- "OT Public Holiday (3050/3060) cannot be combined with Workday or Rest Day OT"
                  END IF;

                  -- Check 264: Group 2 prerequisite — 3020 mandatory when 3030 or 3040 present
                  IF (v_grp2_3030 > 0 OR v_grp2_3040 > 0) AND v_grp2_3020 = 0 THEN
                     record_error(p_error_count, p_error_line, p_error_number, cnt, 86000264);
                     -- "OT code 3020 (Rest Day <= Half NWH) is required when entering 3030 or 3040"
                  END IF;

                  -- Check 265: Group 3 prerequisite — PH (8000/PHL) must be present
                  IF v_grp3_total > 0 AND v_day_phl = 0 THEN
                     record_error(p_error_count, p_error_line, p_error_number, cnt, 86000265);
                     -- "Public Holiday (PH/8000) hours must be entered before OT 3050/3060"
                  END IF;

                  -- Check 266: Group 1 daily cap — 12 hrs including regular time
                  IF v_grp1_3010 > 0 AND (v_day_reg + v_grp1_3010) > 12.0 THEN
                     record_error(p_error_count, p_error_line, p_error_number, cnt, 86000266);
                     -- "OT Workday (3010) + Regular hours exceed 12-hour daily cap"
                  END IF;

                  -- Check 267: Groups 2 & 3 daily cap — 12 hrs OT only (PH hrs excluded for Group 3)
                  IF v_grp2_total > 12.0 THEN
                     record_error(p_error_count, p_error_line, p_error_number, cnt, 86000267);
                     -- "OT Rest Day hours exceed 12-hour daily cap"
                  END IF;

                  IF v_grp3_total > 12.0 THEN
                     record_error(p_error_count, p_error_line, p_error_number, cnt, 86000267);
                     -- "OT Public Holiday hours exceed 12-hour daily cap"
                  END IF;

               END;
            END IF;
-- ###########################################################################
-- END INJECTION 6
-- ###########################################################################

            END LOOP;  -- End of daily loop (FOR cnt IN 1 .. 7)

-- ###########################################################################
-- RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026 [INJECTION 7]
-- Singapore Standby Validation (A00, A80 only) — weekly checks
-- ###########################################################################
         IF is_singapore THEN

            -- Recompute weekly totals from daily arrays (safety in case mid-week
            -- zeroing logic above affected some days)
            DECLARE
               v_wk_3100   NUMBER := 0;
               v_wk_3110   NUMBER := 0;
               v_wk_3120   NUMBER := 0;
            BEGIN
               FOR d IN 1 .. 7 LOOP
                  v_wk_3100 := v_wk_3100 + NVL(total_day_sg3100(d), 0);
                  v_wk_3110 := v_wk_3110 + NVL(total_day_sg3110(d), 0);
                  v_wk_3120 := v_wk_3120 + NVL(total_day_sg3120(d), 0);
               END LOOP;

               -- Check 268: 3100 may only be used once per week (1 UNIT = 1.0 hours)
               IF v_wk_3100 > 1.0 THEN
                  record_error(p_error_count, p_error_line, p_error_number, 1, 86000268);
                  -- "Standby Weekly (3100) may only be used once (1 UNIT) per week"
               END IF;

               -- Check 269: 3100 mutual exclusion — cannot combine with 3110 or 3120
               IF v_wk_3100 > 0 AND (v_wk_3110 > 0 OR v_wk_3120 > 0) THEN
                  record_error(p_error_count, p_error_line, p_error_number, 1, 86000269);
                  -- "Standby Weekly (3100) cannot be combined with Weekday (3110) or Weekend (3120) Standby"
               END IF;

               -- Check 270: 3110 daily limit — must be 1 UNIT on weekdays (Mon-Fri = days 3-7),
               --              and not used on weekends (days 1-2)
               FOR d IN 1 .. 7 LOOP
                  IF total_day_sg3110(d) > 0 THEN
                     -- Day index: 1=Sat, 2=Sun, 3=Mon, 4=Tue, 5=Wed, 6=Thu, 7=Fri
                     IF d IN (1, 2) THEN
                        -- Weekend — 3110 not allowed
                        record_error(p_error_count, p_error_line, p_error_number, d, 86000270);
                        -- "Standby Weekday (3110) may only be used Monday-Friday"
                     ELSIF total_day_sg3110(d) > 1.0 THEN
                        -- More than 1 UNIT on a weekday
                        record_error(p_error_count, p_error_line, p_error_number, d, 86000270);
                        -- "Standby Weekday (3110) must be exactly 1 UNIT per day"
                     END IF;
                  END IF;
               END LOOP;

               -- Check 271: 3120 daily limit — must be 1 UNIT on weekends (Sat-Sun = days 1-2),
               --              and not used on weekdays (days 3-7)
               FOR d IN 1 .. 7 LOOP
                  IF total_day_sg3120(d) > 0 THEN
                     -- Day index: 1=Sat, 2=Sun, 3=Mon, 4=Tue, 5=Wed, 6=Thu, 7=Fri
                     IF d IN (3, 4, 5, 6, 7) THEN
                        -- Weekday — 3120 not allowed
                        record_error(p_error_count, p_error_line, p_error_number, d, 86000271);
                        -- "Standby Weekend (3120) may only be used Saturday-Sunday"
                     ELSIF total_day_sg3120(d) > 1.0 THEN
                        -- More than 1 UNIT on a weekend
                        record_error(p_error_count, p_error_line, p_error_number, d, 86000271);
                        -- "Standby Weekend (3120) must be exactly 1 UNIT per day"
                     END IF;
                  END IF;
               END LOOP;

            END;
         END IF;
-- ###########################################################################
-- END INJECTION 7
-- ###########################################################################


         ELSE --unable to retrieve worker information
            record_error (
               p_error_count,
               p_error_line,
               p_error_number,
               0,
               86000100
            ); --'No worker leave balance information available'
         END IF;

      END IF; --total hours > 0 and worker is not contractor

   END leave_check;

-- [future_check procedure remains unchanged]

END pay_editA; --package body
/
show error
/
```

---

## Summary of Injections

| # | Location | Lines Added | Purpose |
|---|----------|-------------|---------|
| 1 | Global declarations (after `total_day_my3010`) | ~20 | New tracking arrays and flags |
| 2 | `tally()` procedure (after 3010 block) | ~45 | Accumulate 3020–3060, 3100–3120 hours |
| 3 | `clear_tables()` procedure (after 3010 init) | ~12 | Zero out new daily arrays |
| 4 | `clear_tables()` procedure (after `total_week_stdby`) | ~4 | Zero out Singapore weekly totals |
| 5 | `validate()` procedure (after weekly init) | ~3 | Set `is_singapore` flag |
| 6 | `leave_check()` daily loop (after 86000260) | ~75 | Malaysia OT cross-group & cap validation |
| 7 | `leave_check()` after daily loop | ~70 | Singapore standby weekly validation |

**Total new lines**: ~230 (all clearly marked and removable)

**Error codes used**: 86000261–86000271 (requires corresponding `reason_code` table entries)

All injections are guarded by org checks (`worker_info.is_malaysia_a60` or `is_singapore`) and can be cleanly removed by deleting all blocks between the `-- ###########################################################################` markers without affecting any other business logic.
