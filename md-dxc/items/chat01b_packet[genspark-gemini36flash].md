Here are the downloadable artifacts requested for integrating the **Priority Change - Aug'26** validation rules for Malaysia (Org `A60`) and Singapore (Orgs `A00`, `A80`) into `PAYEDIT2A.SQL`.

---

# Downloadable Artifact 1: CLARIFYING_QUESTIONS.md

```markdown
# Clarifying Questions - Malaysia & Singapore Validation Rules (Aug'26)

## Malaysia Rules (Org `A60`)

### 1. General Regular Time vs. Off Day / Rest Day Logic
* **Question:** For time code `3011` (OT-Offday), the rule states: "any time a user enters 3011, then that day counts as an 'Off day'". Should `3011` require or prohibit `1010` (Regular Time) on the same day?
  * *Context/Assumption Made in Patch Plan:* Regular time (`1010`) is assumed to be prohibited on Off Days (`3011`) and Rest Days (`3020`/`3030`/`3040`), whereas Regular Time (`1010`) IS required for standard overtime (`3010`).

### 2. Time Code Combination Restrictions for Rest Days
* **Question:** For codes `3020`, `3030`, and `3040`, the notes state: "Employee can enter OT on the same day for Time code 3020 (Mandatory) along with 3030 and 3040". Does this mean:
  * Option A: `3030` or `3040` CANNOT exist on a day unless `3020` is also present on that same day?
  * Option B: They can be entered in sequence across hours on the same day?
  * *Context/Assumption Made in Patch Plan:* Option A is assumed. If hours exist for `3030` or `3040`, hours for `3020` MUST also be greater than 0 on that day.

### 3. Public Holiday Overtime Combination Rules
* **Question:** For `3050` and `3060`, the rules state: "Enter a PH (8000) first and then employee can enter 3050 and only then can utilize 3060 for extra hours for a calendar day."
  * Is Public Holiday time code `8000` passed into `PAYEDIT2A.SQL` as time type `8000` or classified under the `PHL` / `HOL` activity group?
  * Is `3050` strictly mandatory before `3060` can be used on a holiday?
  * *Context/Assumption Made in Patch Plan:* `8000` must be present (`> 0`) on the day whenever `3050` or `3060` is billed. Furthermore, `3060` requires `3050` to be present (`> 0`) on the same day.

### 4. Daily Hour Cap Calculation for Public Holidays
* **Question:** The rule states "If PH(8000) is applied, then a standard logic is to check daily cap of 12 hrs (excluding PH Hrs)". Does this daily 12-hour cap include regular hours or only OT hours (`3050` + `3060`)?
  * *Context/Assumption Made in Patch Plan:* Standard daily OT cap logic is applied: total day hours minus Public Holiday (`8000`/`PHL`) hours must be $\le 12.0$ hours.

---

## Singapore Rules (Orgs `A00` & `A80`)

### 5. Standby Unit vs. Hours Billing Format
* **Question:** Time codes `3100`, `3110`, and `3120` state "**The number must be 1 UNIT.**" In `PAYEDIT2A.SQL`, time entries are processed as numeric values/hours (`p_array_time`). Are standby entries passed as `1.0` (for 1 unit) or as hour quantities?
  * *Context/Assumption Made in Patch Plan:* They are passed as numeric values where 1 unit = `1.0`. Validation checks that any entry for `3100`, `3110`, or `3120` is exactly equal to `1.0`.

### 6. Weekly Standby (`3100`) Day Placement and Overlap
* **Question:** `3100` can have a start date on any day of the week. When `3100` is charged on one day of the week:
  * Does it prohibit `3110` and `3120` across the **entire 7-day pay period/week**?
  * Does the "overlap restriction of more than 1 unit per day (SA & SB)" mean total standby units on any single calendar day cannot exceed `1.0`?
  * *Context/Assumption Made in Patch Plan:* Yes, if `3100` $> 0$ in a week, `3110` and `3120` must be $0$ for the entire week, and total weekly unit count for `3100` cannot exceed `1.0`.

### 7. Weekday (`3110`) vs. Weekend (`3120`) Calendar Mapping
* **Question:** In the 7-day array (`cnt` 1 to 7), which days correspond to Weekdays vs. Weekends?
  * *Context/Assumption Made in Patch Plan:* Standard payroll week starting Saturday (`startDay = 'SATURDAY'`):
    * Day 1 = Saturday (Weekend)
    * Day 2 = Sunday (Weekend)
    * Days 3..7 = Monday–Friday (Weekdays)
    Validation enforces `3110` only on Days 3..7 and `3120` only on Days 1..2.
```

---

# Downloadable Artifact 2: PATCH_PLAN.md

```markdown
# Patch Plan - Malaysia & Singapore Validation Rules (Aug'26)

## Overview & Scope
This patch plan details the data structures, error codes, and surgical logic injections required to implement the August 2026 Priority Changes for Malaysia (`A60`) and Singapore (`A00`, `A80`) inside `lcd.pay_editA` (`PAYEDIT2A.SQL`). 

The modifications are designed to be completely modular and wrapped in explicit organization checks (`pg_org_code = 'A60'` or `pg_org_code IN ('A00', 'A80')`) to ensure zero impact on existing business rules for other global entities.

---

## 1. Data Dictionary & Global Variables

### A. New Day/Week Accumulators
To track time entry codes specific to Malaysia and Singapore, the following package-level variables are added to hold daily and weekly totals during the `tally()` phase:

| Variable Name | Type | Description |
|---|---|---|
| `total_day_my3011` | `lcd.pay_edit.hourstype` | Daily hours charged to `3011` (MY OT-Offday) |
| `total_day_my3020` | `lcd.pay_edit.hourstype` | Daily hours charged to `3020` (MY OT-RestDay <= Half) |
| `total_day_my3030` | `lcd.pay_edit.hourstype` | Daily hours charged to `3030` (MY OT-RestDay > Half <= NWH) |
| `total_day_my3040` | `lcd.pay_edit.hourstype` | Daily hours charged to `3040` (MY OT-RestDay > NWH) |
| `total_day_my3050` | `lcd.pay_edit.hourstype` | Daily hours charged to `3050` (MY OT-PH <= NWH) |
| `total_day_my3060` | `lcd.pay_edit.hourstype` | Daily hours charged to `3060` (MY OT-PH > NWH) |
| `total_day_sg3100` | `lcd.pay_edit.hourstype` | Daily units charged to `3100` (SG SB-Weekly) |
| `total_day_sg3110` | `lcd.pay_edit.hourstype` | Daily units charged to `3110` (SG SB-Weekday) |
| `total_day_sg3120` | `lcd.pay_edit.hourstype` | Daily units charged to `3120` (SG SB-Weekend) |
| `total_week_sg3100`| `NUMBER` | Weekly sum of `3100` units |
| `total_week_sg3110`| `NUMBER` | Weekly sum of `3110` units |
| `total_week_sg3120`| `NUMBER` | Weekly sum of `3120` units |

---

### B. New Error Reason Codes
The following custom error codes are defined for injection into `record_error()` calls:

| Error Code | Applies To | Error Message Description |
|---|---|---|
| `86000270` | Malaysia (`A60`) | Invalid time code combination for Regular Day / Off Day (`3010`/`3011`). |
| `86000271` | Malaysia (`A60`) | Invalid time code combination for Rest Day (`3020`/`3030`/`3040` rules violated). |
| `86000272` | Malaysia (`A60`) | Public Holiday OT (`3050`/`3060`) requires Public Holiday (`8000`) entry. |
| `86000273` | Malaysia (`A60`) | Daily cap of 12 hours exceeded. |
| `86000274` | Singapore (`A00`/`A80`) | Standby entry must be exactly 1 UNIT. |
| `86000275` | Singapore (`A00`/`A80`) | Weekly Standby (`3100`) cannot be combined with Daily Standby (`3110`/`3120`). |
| `86000276` | Singapore (`A00`/`A80`) | Standby entry charged on invalid day type (Weekday vs. Weekend). |
| `86000277` | Singapore (`A00`/`A80`) | Standby unit daily overlap cap exceeded (> 1 unit/day). |

---

## 2. Structural Code Changes in `PAYEDIT2A.SQL`

### Injection Point 1: Package Local Variable Declarations
* **Location:** Declarations block of `lcd.pay_editA`.
* **Action:** Declare new daily arrays (`total_day_my3011` .. `total_day_sg3120`) and weekly accumulators (`total_week_sg3100` .. `total_week_sg3120`).

### Injection Point 2: Procedure `clear_tables`
* **Location:** Inside `clear_tables` loop (1..7) and weekly reset block.
* **Action:** Reset all new daily array elements to `0` and weekly accumulators to `0`.

### Injection Point 3: Procedure `tally`
* **Location:** Inside `tally(p_time_rec)`.
* **Action:** Add conditional checks on `p_time_rec.att_abs_type` to increment `3011`, `3020`, `3030`, `3040`, `3050`, `3060` for Malaysia, and `3100`, `3110`, `3120` for Singapore.

### Injection Point 4: Procedure `validate` - Daily Validation Loop
* **Location:** Inside the `FOR cnt IN 1 .. 7 LOOP` block of `validate()`.
* **Action:** Insert distinct isolation blocks:
  1. **Malaysia (`A60`) Block:**
     * **12-Hour Cap:** Enforce daily max 12 hours total (excluding PH hours for holiday entries).
     * **OT Code `3010`/`3011` Constraints:** Prohibit `3020`, `3030`, `3040`, `3050`, `3060` when `3010` or `3011` is charged. Require `1010` regular time when `3010` is charged.
     * **Rest Day Codes (`3020`, `3030`, `3040`) Constraints:** Require `3020` to be present if `3030` or `3040` is entered. Prohibit `3010`, `3050`, `3060`.
     * **Public Holiday OT (`3050`, `3060`) Constraints:** Require `PHL`/`8000` time to be $>0$. Require `3050` to be present if `3060` is charged. Prohibit `3010`, `3020`, `3030`, `3040`.
  2. **Singapore (`A00`, `A80`) Block:**
     * **Unit Check:** Enforce that any charge to `3100`, `3110`, or `3120` must equal `1.0`.
     * **Weekday/Weekend Rule:** Restrict `3110` to Weekdays (Days 3..7) and `3120` to Weekends (Days 1..2).
     * **Daily Overlap:** Ensure total Standby units on `cnt` do not exceed `1.0`.

### Injection Point 5: Procedure `validate` - Weekly Validation Block
* **Location:** Outside the daily loop, prior to `leave_check`.
* **Action:** Insert Singapore weekly check:
  * If `total_week_sg3100 > 0`, raise error `86000275` if `total_week_sg3100 > 1` or if `total_week_sg3110 > 0` or `total_week_sg3120 > 0`.
```

---

# Downloadable Artifact 3: PAYEDIT2A_patched.SQL

Below is the patched PL/SQL package source code containing all surgical injections, tagged with `--RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026`.

```sql
/*************************************************************************************
* PACKAGE: pay_editA (Package Body)  (Payedit2A.sql)
*/


-- PURPOSE:
--   Functions/procedures that perform LCD pay validation edits
--
-- AUTHOR: Chris Mayol
--
-- REVISION HISTORY:   
--   10-27-97 Created
--   11-24-97 Modified to accomodate PB array parameter passing restrictions
--   12-01-97 Incorporated new error numbers
--   12-03-97 Add FML edit
--   12-08-97 Correct error handling when activity_group does not exist and correct edit 21
--   12-11-97 Reset FML error counter and modify error 22 to only occur if UPD exists
--   12-15-97 Changed to accomodate non-exempt OT on holidays
--    Added error 85 to check for total leave balances exceeding day limit
--    Added check for units_flag and ignore entries for line if "Y"
--    Added check for partial FML day entries (edit 82 as defined by Pam)
--   12-16-97 Edit 85 modified to now check for exceeding "LV" types, formerly not
--               required for tracking
--   12-19-97 Separated edit 2 into two different errors to reduce confusion (new error 86)
--    Modified sick leave balance checks based on redefinition of permissible negative balances
--       resulting in the addition of new error 87.
--   12-19-97 Corrected edit 15
--   12-19-97 Added check of UPD time on edits 85 and 15.  Separated edit 22 into 2 errors (adding error 88)
--    to reduce user confusion.  Added new edit (89) to verify that user has not entered REG with HOL time
--   12-19-97 Edit 11 redefined to check for holiday hours that are greater than or less than the daily expected hours
--   12-22-97 Edit 67 redefined to use total of holiday time plus reg time in determining enough hours for OT
--   12-29-97 Edit 17 changed to take into account any holiday time in addition to regular time in determining need for OT
--       Edit 22 simplified to just ensure that exempt ee does not exceed work week hours in unpaid time per
--       discussions with Pam, Lloyd, and Sandy in relation to re-wording of SR 970498
--   01-05-98 Edit 13 and 15 are redefined to only be considered when there is no FML.
--   01-30-98 New rule  - even though worker may be eligible for FML, non FML edits apply if non-FML Toe codes are used
--   02-03-98 Edit 15 (leave hrs less than standard daily hrs) returns to being an error that is unrelated to FML
--   05-27-98 TPR416 Edit 17 changed to only check if OT Weekly Hours has a value
--   05-29-98 TPR417 Edit 85 changed to use ee's long day value rather than average weekly hours
--   06-19-98 TPR416 Edit 17 moved to handle exempt AND non-exempt
--   06-24-98 TPR546 New edit 90 added to flag when overtime is not permitted
--   06-29-98        Related to edit 90, made sure that any NULL fields actually were interpreted as "0"
--   07-27-98 Edits modified to take into account contractor versus employee validation. Only edit 37 is checked for contractors
--   09-11-98 Edit 37 (exceeding 32 hours of time per day) was not being checked for non-contractors. Corrected.
--   04-02-99 Leave time max hours now based on longest day, versus average daily work hours.
--    Maximum holiday hours is now either 8 or the average weekly day hours
--   06-28-99 Added procedure to determine (for ITES) whether non-absence time is being charged to future dates.
--   07-29-99 Changed edit 15 to only check insufficient holiday hours if worker is not a standard work week person
--   07-30-99 Modified OT edits to match latest round of discussions concerning time errors
--   08-02-99 Moved edit 13 to validate routine from leave_check
--   08-04-99 Military Leave is added.  New error code 86000092 ('Military Leave balance exceeded') added to reason_code table.
--   08-10-99 Modify error 11 to not duplicate what is covered in 86
--    Modified and re-established error 61 to restrict reg hours without OT, per Pam B.
--   09-02-99 Re-wrote the OT edits based on the latest concensus on how they should function
--               Changed PB processing to handle FML PB
--   09-07-99 New rule for non-standard holiday charge (affects edit 86)
--   09-09-99 Overtime rules changed
--   09-15-99 Overtime minimum edits changed to not be enforced if worker has entered holiday time (Edit 61)
--   09-29-99 Worker sub group 50 is now to be considered non-exempt
--               PB now added to error 15 criteria.  Separated OT errors for clarity in error reporting.
--   10-11-99 The unit_flag has values of "H" and "U" instead of "Y" and "N" requiring a code change
--     New code of "UPR" added - treated as REG time
--   10-18-99 Added processing for "union" employees (sub-group 34)
--   10-19-99 Non-exempt employees should be permitted to charge OT for hours worked on a holiday (Change 67A)
--   10-21-99 Edit 61 moved to be processed for union as well as non-union.  Edit 62 split for union/non-union
--   10-27-99 Sub-group 24 now also considered "union". Revers3ed edits 62A & 62B
--    Added day-of-error return information for weekly edits that have migrated into daily edits
--    Edit 67 once again applies to all employees (was set up to not be included in Union edits).
--   10-28-99 Edit 17 now applies to all workers again.
--   10-28-99 Edit 67 switched back to a union-excepted edit
--   12-20-99 Added Edit 93 to check for OT on 7th consecutive day for California workers
--   12-21-99 Corrections to edit 93 (include holiday as work time, exclude additional OT edits)
--   12-27-99 Edit 93 now applies only to non-exempt "standard" workers
--   12-29-99 Edit 93 no longer applies to "standard" workers
--   01-03-00 Holiday is acceptable on California 7th day edit 93
--   01-04-00 Edit 93 restricted to only workers that have one of the OT breaks
--   03-08-00 Incorporate change to determine "US Only" edits
--   03-15-00 Do not include unpaid leave in non-US edit checks.  Add Edit 69 to U.S. only edit list
--   06-07-00 Added 25 and 35 to exempt codes
--   07-24-00 Changed processing to perform any OT edits, irrespective of whether worker is ee or contractor
--   01-11-01 Added sub groups 26 and 36 to the groups that are considered to be Union
--   01-22-01 Added check for time limit errors using time_limits table
--   03-13-01 Corrected time limits checking to look for blank state code (versus null)
--   03-14-01 Corrected time limits to use edits if state or currency is "blank" in table
--   04-09-01 New rule for time_limits to allow blank as a valid character and now "*" will be "anything else"
--   04-26-01 Take into account the potential for null currency or work states in time_limits
--   06-14-01 Add processing to handle "authorized" charges
--   07-20-01 Limited errors 21,86, and 89 to just U.S.
--   10-05-01 Select statement in analyze_limits function was potentially selecting larger data than variables allowed.
--   10-29-01 Time limits select was not handling non-null state and currency codes correctly
--   07-27-04 L.Ioffe Employee Type (Exempt,Union, Non-Exempt) based on flag values of Group_Subgroup 
--   12-19-04 L.Ioffe Employee Type (value 'E' for Exempt)
--   02-10-05 L.Ioffe regarding 86000067 "OT limits for Canada"
--   03-01-05 L.Ioffe Totals by OT_Flag  (Fort Campbell)
--   05-18-05 L.Ioffe Added Canada in 86000086 validation (Holiday hours)
--   09/15/2005 T.N  - Corrected Holiday edits for Canada and OT daily for worker_type 'A'
--   12/12/2005 L.I. - Change in edits regarding FML 
--   01/04/2006 L.I. - Remove edit 86000097
--   01/04/06   L.I. - Removed call of leave_check
--   03/15/2006 T.N  - added increments checks (for Asia request) - error 86000101 
--   05-31-06 EFadul used ABSENCE_INCREMENT in lieu of hol_used_hours_1 (for Asia increments)
--   04-19-07 Efadul Ticket 176398-00001.  changed the maximum number of hours that may
--             be entered from 32 to 24
--   12-04-07 L.Ioffe Inplement Pers_Area Override Flag for 'U'
--   12-12-07 L.Ioffe Inplement Pers_Area Override Flag for 'H' holiday rules
--   01-16-08 L.Ioffe Check against Override Holidays limit (error 86000106)
--   01-28-08 L.Ioffe Check Future Time against Org_Param Weely_Start_Day 
--   01-07-09 L.Ioffe Check non family absence against Long_Day hours
--   01-17-10 L.Ioffe Paid and Unpaid Absences 86000016 check
--   09-07-11 EFadul  Translated absence balance names as follows:
--        US            ASIA            INDIA
--        Vacation          Vacation         Casual
--        Sick Leave        Sick Leave        Earned    
--        Personal Business    Time Off in Lieu    Restricted
--        Military        Childcare        Family and Medical
--        Family Medical        Other Leave        LWP / Sabbatical
--
--          using error message numbers below:
--        US        ASIA      INDIA
--        86000001  ---       86000111 Vacation balance exceeded
--        86000002  ---       86000112 Daily maximum vacation hours exceeded
--        86000008  ---       86000113 Sick Leave cannot go negative when vacation hours exist
--        86000009  ---       86000114 Daily maximum sick hours exceeded
--        86000034  86000125  86000115 Personal business balance exceeded
--          86000079  86000126  86000116 Worker ineligible for FML
--         86000081  86000127  86000117 Worker exceeded FML allocation
--        86000087  ---       86000118 Sick Leave balance exceeded
--        86000092  86000129  86000119 Military Leave balance exceeded
--
--   11-16-11 EFadul  Modified functions Total_Day_without_OT and Total_Week_without_OT
--                    to include ALL absences as the base for overtime when the
--                    overtime flag = 'A'
--
--   09-17-11 EFadul  Translated absence balance names as follows:
--        US            AUSTRALIA (profile = 'D')
--        
--        Vacation          Annual Leave
--        Sick Leave        Personal Leave
--        Personal Business    Long Service Leave
--        Military        Study Leave
--        Family Medical        CSC Paid Parental Leave
--                                                   
--   11.28.2011 L.Ioffe Turned Err codes according to Language Code
--   06.06.2012 L.Ioffe Initialized total_week_PB and MIL in Validation (FY13-0266)
--   11-13-2013 D.Lamm  RDD FY14-2078 - modified check 37 to allow either 24 hours per day
--                         or the number of hours identified on support_systems table
--                         if there is a MAXHOURS record for the org.  Org is in system_code 
--   11-22-2013 D.Lamm  RDD FY14-1798 - Modified delimiter between override params to be | instead of comma
--   01-23-2014 RDD FY14-2193 - CA double time
--   02-12-2014 New Accruals
--   03-24-2014 Time Limits Start\End dates
--   03-25-2014 CATS accruals
--   05-12-2014 Time Types start\end date validation
--   06-05-2014 fy15-0196 Partial Leave 
--   07-15-2014 fy14-2193 California fix 
--   07-22-2014 fy14-2193 California rules
--   08-12-2014 FY15-0357 Absence validation fix 
--   09-09-2014 4000015441 Correct GVR for CA OT DB
--   11-20-2014 4000017767 comment out message 86000061 (86000062) for OT required logic
--   12-04-2014 4000018143 Implement FML validation for CATS
--   01-26-2015 new 86000030, 86000031 validation for UPD
--   02-03-2015 change in Pers_Area_subarea OT_flag and Reg + Abs for E not exceed long day - 86000012
--   03-03-2015 4000022792 Pers Area Union flag mod against user type
--   03-23-2015 4000023447 Unpaid Leave for Non Standard
--   10-16-2015 4000033108 Partial Leave for Canada. Removed 86000011, 86000015 for all orgs, all employees types
--   02-15-2016 Family modified Plus AND NO HOLIDAY HOURS WERE RECORDED for 86000012
--   04-01-2016 R. Wright: Eliminate 86000012 check for non-U.S. workers
--   10-21-2018 R. Wright: Eliminate quota error messages during mid-week process
--   05-15-2024 R. Wright: IN India workers must take holiday and restricted leave in full day increments (86000230, 86000231)
--   11-25-2024 R. Wright: IN India workers must take public holiday leave in full day increments (86000232)
--   06-05-2025 R. Wright: INC 0952194: Singapore and Malaysia workers end of year shutdown rules (annual leave, flex vacation)
--   07-07-2025 R. Wright: INC 0995207: Singapore and Malaysia workers end of year shutdown rules : Annual Leave use adjusted balance
--   09-24-2025 R. Wright: INC 1059594: Singapore and Malaysia workers Shared Parental Leave Quota
--   10-07-2025 R. Wright: INC 1110706: Japan Harmonization II 
--   10-29-2025 R. Wright: INC 1138065: India Supplemental Pay  
--   11-25-2025 R. Wright: INC 1167795: Singapore and Malaysia workers Flexi vacation Fix
--   03-20-2026 R. Wright: INC 1247720  Singapore and Malaysia salary group flag, is "A60" malaysia flag, 12.0 hour daily hours cap for malaysia salary group = "C" workers
--   03-31-2026 R. Wright: INC 1254920: LCD Remove India LWOP Leave Restrictions (86000226 disabled)
-- [REVERTED 5/30/2026] --   03-31-2026 R. Wright: INC 1290667: LCD India Compensatory Off/Paid Leave Restriction (86000233)
-- [REVERTED 5/30/2026] --   05-06-2026 R. Wright: INC 1290667: LCD India DIS/UPD Leave Increment Restriction Fix (86000233 UPD added)
--   05-30-2026 R. Wright: INC 1348107: India Increments Backout (86000233 reverted per client request)
--   07-29-2026 R. Wright: INC 1405279: India Increments Selective Restore VAC-PB-LV-UPD (86000233 re-enabled for VAC/PB/LV/UPD only)
--RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026


--************************************************************************************
CREATE OR REPLACE PACKAGE BODY lcd.pay_editA
AS


--****************************************************************************
-- Package Local Declarations
--****************************************************************************


   TYPE balancerecordtype IS RECORD (
      sick                          lcd.worker.sick_bal_hrs%TYPE,
      vac                           lcd.worker.vac_bal_hrs%TYPE,
      hol_used_hrs                  lcd.worker.hol_used_hrs%TYPE,            -- RdW INC33219685 12/4/2024
      per_lv                        lcd.worker.per_lv_bal_hrs%TYPE,
      mil_lv                        lcd.worker.mil_lv_bal_hrs%TYPE,
      fml_lv                        lcd.worker.fml_lv_bal_hrs%TYPE,
      ccl_lv                        lcd.worker.ccl_bal_hrs%TYPE,
      mlv_lv                        lcd.worker.mlv_bal_hrs%TYPE,
      plv_lv                        lcd.worker.plv_bal_hrs%TYPE,
      sl_lv                         lcd.worker.sl_bal_hrs%TYPE,
      lsl_lv                        lcd.worker.lsl_bal_hrs%TYPE,
      fl_lv                         lcd.worker.fl_bal_hrs%TYPE,
      fcl_lv                        lcd.worker.fcl_bal_hrs%TYPE,
      sab_lv                        lcd.worker.sab_bal_hrs%TYPE,
      csl_lv                        lcd.worker.csl_bal_hrs%TYPE,
      rlv_lv                        lcd.worker.rlv_bal_hrs%TYPE,
      xsl_lv                        lcd.worker.xsl_bal_hrs%TYPE,
      til_lv                        lcd.worker.til_bal_hrs%TYPE,
      par_lv                        lcd.worker.par_bal_hrs%TYPE,
      xhl_lv                        lcd.worker.xhl_bal_hrs%TYPE,
      jub_lv                        lcd.worker.jub_bal_hrs%TYPE,
      flx_lv                        lcd.worker.flx_bal_hrs%TYPE,
      ofx_lv                        lcd.worker.ofx_bal_hrs%TYPE,
      mlx_lv                        lcd.worker.mlx_bal_hrs%TYPE,
      mle_lv                        lcd.worker.mle_bal_hrs%TYPE,
      mls_lv                        lcd.worker.mls_bal_hrs%TYPE,
      spn_lv                        lcd.worker.spn_bal_hrs%TYPE,
      dis_lv                        lcd.worker.dis_bal_hrs%TYPE,
      bvl_lv                        lcd.worker.bvl_bal_hrs%TYPE,
      tlv_lv                        lcd.worker.tlv_bal_hrs%TYPE,
      phl_lv                        lcd.worker.phl_bal_hrs%TYPE);

   TYPE activitygrouptype IS RECORD (
      grp                           lcd.att_abs_type.activity_group%TYPE,
      fml                           lcd.att_abs_type.fml_flag%TYPE,
      unit                          lcd.att_abs_type.unit_flag%TYPE,
      dbl                           lcd.att_abs_type.double_time_flag%TYPE);

   total_day            lcd.pay_edit.hourstype; --store total charges against particular day
   total_day_reg        lcd.pay_edit.hourstype; --store total regular hours for particular day
   total_day_ot         lcd.pay_edit.hourstype; --store total ot type hours for particular day
   total_day_dbl        lcd.pay_edit.hourstype; --store total Double time type hours for particular day
   total_day_sick       lcd.pay_edit.hourstype; --store total sick type hours for particular day
   total_day_sick_fml   lcd.pay_edit.hourstype; --store total sick family type hours for particular day
   total_day_vac        lcd.pay_edit.hourstype; --store total vacation type hours for particular day 
   total_day_hol        lcd.pay_edit.hourstype; --store total holiday type hours for particular day 
   total_day_lv         lcd.pay_edit.hourstype; --store total leave type hours for particular day 
   total_day_upd        lcd.pay_edit.hourstype; --store total unpaid type hours for particular day 
   total_day_pb         lcd.pay_edit.hourstype; --store total personal business hours for particular day
   total_day_pb_fml     lcd.pay_edit.hourstype; --store total fml personal business hours for particular day
   total_day_fml        lcd.pay_edit.hourstype; --store total fml hours for particular day
   total_day_mil        lcd.pay_edit.hourstype; --store total military hours for particular day
   total_day_other      lcd.pay_edit.hourstype; --store total remaining hours for particular day
   total_day_upd_fml    lcd.pay_edit.hourstype; --store total unpaid FML type hours for particular day 

   total_day_ccl        lcd.pay_edit.hourstype; --store total Childcare Leave 
   total_day_mlv        lcd.pay_edit.hourstype; --store total Maternity Leave 
   total_day_plv        lcd.pay_edit.hourstype; --store total Paternity Leave 
   total_day_sl         lcd.pay_edit.hourstype; --store total Study Leave 
   total_day_lsl        lcd.pay_edit.hourstype; --store total Long Service Leave 
   total_day_fl         lcd.pay_edit.hourstype; --store total Furlough Leave 
   total_day_fcl        lcd.pay_edit.hourstype; --store total Family Carers Leave 
   total_day_sab        lcd.pay_edit.hourstype; --store total Sabbatical Leave 
   total_day_csl        lcd.pay_edit.hourstype; --store total Casual Leave 
   total_day_rlv        lcd.pay_edit.hourstype; --store total Restricted Leave 
   total_day_xsl        lcd.pay_edit.hourstype; --store total Extended Sick Leave 
   total_day_til        lcd.pay_edit.hourstype; --store total Time in Lieu 
   total_day_par        lcd.pay_edit.hourstype; --store total Parental Leave 
   total_day_xhl        lcd.pay_edit.hourstype; --store total Extra Holidays 
   total_day_jub        lcd.pay_edit.hourstype; --store total Jubilee 
   total_day_flx        lcd.pay_edit.hourstype; --store total Flex Hours
   total_day_ofx        lcd.pay_edit.hourstype; --store total OT Flex Hours 
   total_day_mlx        lcd.pay_edit.hourstype; --store total Maternity Leave Extension  
   total_day_mle        lcd.pay_edit.hourstype; --store total Emergency Maternity Leave 
   total_day_mls        lcd.pay_edit.hourstype; --store total Special Maternity Leave 
   total_day_spn        lcd.pay_edit.hourstype; --store total Sabbatical Leave - Post Natal Care  
   total_day_dis        lcd.pay_edit.hourstype; --store total Disciplinary Loss of Pay(DLoP) 
   total_day_bvl        lcd.pay_edit.hourstype; --store total Bereavement Support Leave 
   total_day_tlv        lcd.pay_edit.hourstype; --store total Transfer Leave 
   total_day_phl        lcd.pay_edit.hourstype; --store total Public Holiday 




   total_day_sick_nonfml  lcd.pay_edit.hourstype; --store total sick non family type hours for particular day
   total_day_vac_nonfml   lcd.pay_edit.hourstype; --store total vacation non family type hours for particular day 
   total_day_lv_nonfml    lcd.pay_edit.hourstype; --store total leave non family type hours for particular day 
   total_day_pb_nonfml    lcd.pay_edit.hourstype; --store total personal business non family hours for particular day
   total_day_mil_nonfml   lcd.pay_edit.hourstype; --store total military non family hours for particular day
   total_day_hol_nonfml   lcd.pay_edit.hourstype; --store total holiday non family type hours for particular day


   total_day_ccl_nonfml        lcd.pay_edit.hourstype; --store total Childcare non family Leave 
   total_day_mlv_nonfml        lcd.pay_edit.hourstype; --store total Maternity non family Leave 
   total_day_plv_nonfml        lcd.pay_edit.hourstype; --store total Paternity non family Leave 
   total_day_sl_nonfml         lcd.pay_edit.hourstype; --store total Study non family Leave 
   total_day_lsl_nonfml        lcd.pay_edit.hourstype; --store total Long Service non family Leave 
   total_day_fl_nonfml         lcd.pay_edit.hourstype; --store total Furlough non family Leave 
   total_day_fcl_nonfml        lcd.pay_edit.hourstype; --store total Family Carers non family Leave 
   total_day_sab_nonfml        lcd.pay_edit.hourstype; --store total Sabbatical non family Leave 
   total_day_csl_nonfml        lcd.pay_edit.hourstype; --store total Casual non family Leave 
   total_day_rlv_nonfml        lcd.pay_edit.hourstype; --store total Restricted non family Leave 
   total_day_xsl_nonfml        lcd.pay_edit.hourstype; --store total Extended Sick non family Leave 
   total_day_til_nonfml        lcd.pay_edit.hourstype; --store total Time in Lieu non family Leave 
   total_day_par_nonfml        lcd.pay_edit.hourstype; --store total Parental non familyLeave 
   total_day_xhl_nonfml        lcd.pay_edit.hourstype; --store total Extra Holidays non family Leave
   total_day_jub_nonfml        lcd.pay_edit.hourstype; --store total Jubilee non family Leave 
   total_day_flx_nonfml        lcd.pay_edit.hourstype; --store total Flex Hours non family Leave
   total_day_ofx_nonfml        lcd.pay_edit.hourstype; --store total OT Flex Hours non family Leave 
   total_day_mlx_nonfml        lcd.pay_edit.hourstype; --store total Maternity Leave Extension non family 
   total_day_mle_nonfml        lcd.pay_edit.hourstype; --store total Emergency Maternity non family Leave 
   total_day_mls_nonfml        lcd.pay_edit.hourstype; --store total Special Maternity non family Leave 
   total_day_spn_nonfml        lcd.pay_edit.hourstype; --store total Sabbatical non family Leave - Post Natal Care  
   total_day_dis_nonfml        lcd.pay_edit.hourstype; --store total Disciplinary Loss of Pay(DLoP) non family Leave 
   total_day_bvl_nonfml        lcd.pay_edit.hourstype; --store total Bereavement Support non family Leave 
   total_day_tlv_nonfml        lcd.pay_edit.hourstype; --store total Transfer non family Leave 
   total_day_phl_nonfml        lcd.pay_edit.hourstype; --store total Public Holiday non family Leave


   total_hours          NUMBER                             := 0;
   total_week_reg       NUMBER                             := 0;
   total_week_upd       NUMBER                             := 0;
   total_week_updNQ     NUMBER                             := 0;    -- Unpaid Non-quota
   total_week_ot        NUMBER                             := 0;
   total_week_dbl       NUMBER                             := 0;
   total_week_fml       NUMBER                             := 0;
   total_week_hol       NUMBER                             := 0;
   total_week_vac       NUMBER                             := 0;
   total_week_sick      NUMBER                             := 0;
   total_week_mil       NUMBER                             := 0;
   total_week_pb        NUMBER                             := 0;
   total_week_lv        NUMBER                             := 0;

   total_week_ccl       NUMBER                             := 0;
   total_week_mlv       NUMBER                             := 0;
   total_week_plv       NUMBER                             := 0;
   total_week_sl        NUMBER                             := 0;
   total_week_lsl       NUMBER                             := 0;
   total_week_fl        NUMBER                             := 0;
   total_week_fcl       NUMBER                             := 0; 
   total_week_sab       NUMBER                             := 0; 
   total_week_csl       NUMBER                             := 0; 
   total_week_rlv       NUMBER                             := 0; 
   total_week_xsl       NUMBER                             := 0;
   total_week_til       NUMBER                             := 0; 
   total_week_par       NUMBER                             := 0;
   total_week_xhl       NUMBER                             := 0; 
   total_week_jub       NUMBER                             := 0;
   total_week_flx       NUMBER                             := 0;
   total_week_ofx       NUMBER                             := 0;
   total_week_mlx       NUMBER                             := 0;  
   total_week_mle       NUMBER                             := 0;
   total_week_mls       NUMBER                             := 0;
   total_week_spn       NUMBER                             := 0;  
   total_week_dis       NUMBER                             := 0; 
   total_week_bvl       NUMBER                             := 0; 
   total_week_tlv       NUMBER                             := 0; 
   total_week_phl       NUMBER                             := 0;



   -- RdW 10/31/2025 INC1138014 India Supplemental Pay
   total_week_stdby       NUMBER                             := 0; 
   total_day_stdby_half  lcd.pay_edit.hourstype;             -- store half standby hours for each day of the week
   total_day_stdby_full  lcd.pay_edit.hourstype;             -- store full standby hours for each day of the week
   total_day_stdby_dbl   lcd.pay_edit.hourstype;             -- store double standby hours for each day of the week
   total_day_stdby       lcd.pay_edit.hourstype;             -- store all standby hours for each day of the week
   -- RdW 3/25/2026 INC1247720 "LCD Asia Variable Claims Malaysia"
   total_day_my3010      lcd.pay_edit.hourstype;             -- store Variable Claims att_abs_type 3010 hours per day (Malaysia)

--RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026
   total_day_my3011      lcd.pay_edit.hourstype;
   total_day_my3020      lcd.pay_edit.hourstype;
   total_day_my3030      lcd.pay_edit.hourstype;
   total_day_my3040      lcd.pay_edit.hourstype;
   total_day_my3050      lcd.pay_edit.hourstype;
   total_day_my3060      lcd.pay_edit.hourstype;

   total_day_sg3100      lcd.pay_edit.hourstype;
   total_day_sg3110      lcd.pay_edit.hourstype;
   total_day_sg3120      lcd.pay_edit.hourstype;

   total_week_sg3100     NUMBER                             := 0;
   total_week_sg3110     NUMBER                             := 0;
   total_week_sg3120     NUMBER                             := 0;
--RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026


   -- RdW 9/8/2022 INC 24264029 India LWOP Balance Issue
   total_absence_inc    NUMBER                             := 0;
   total_adj_vac_hrs    NUMBER                             := 0;
   total_adj_sick_hrs   NUMBER                             := 0;
   total_adj_rlv_hrs    NUMBER                             := 0;


   -- RdW 11/25/2025 INC 1167795 Keep track of Malaysia Singapore shutdown hours
   total_eoy_shutdown_hours    NUMBER                       := 0;
   -- RdW 6/5/2025 INC 0952194 Keep track of Malaysia Singapore shutdown days
   total_eoy_shutdown_days    NUMBER                       := 0;
   is_inside_eoyshutdown      BOOLEAN                   := FALSE;
   is_malaysing              BOOLEAN               := FALSE;
   TYPE t_shutdown_arr IS TABLE OF PLS_INTEGER INDEX BY BINARY_INTEGER;
   arr_eoy_shutdowndays    t_shutdown_arr;
   -- RdW 12/10/2025 INC 1167795 flexi vacation negative hours fix, hold string var for future hours string
   future_abs_str             VARCHAR2 (4000);
   future_abs_lookup          lcd.shared.t_hours_lookup;

   --The following two variables are set upon call of the main "validate"
   --routine.  They are used as "globals" throughout the code and in
   --between the external calls of the two external procs in the package.
   pg_org_code          lcd.toe_attabs_map.org_code%TYPE   := '111';
   pg_worker_id         lcd.worker.worker_id%TYPE          := 'AAAAAAAAAA';
   pg_end_date          DATE;   -- RdW 8/4/2018

   -- RdW 8/4/2018 SR119163 new variables to check for mid-week
   todayidx integer := 7;
   cutoffidx integer := 7;

   --used for limit information

   TYPE limittype IS RECORD (
      atype                         VARCHAR2 (4),
      dept                          VARCHAR2 (30),
      DAY                           INTEGER,
      hours                         NUMBER);

   TYPE limitarraytype IS TABLE OF limittype
      INDEX BY BINARY_INTEGER;

   att_array            limitarraytype;
   collect_limit_indx   INTEGER                           := 0;   --used as a counter of records in the limit array

   override_holiday     CHAR(1)                           := 'N'; -- to handle TLS holiday validation 
   override_holiday_limits NUMBER;

   bFmlSickFlag         Boolean := False;


   -- RdW 2/25/2025 INC 35522049 Japan Harmonization LCD GVR Override

   TYPE hourstype_array IS TABLE OF NUMBER(4,2)
      INDEX BY BINARY_INTEGER;

   wi_ovrr_long_day          hourstype_array;
   wi_ovrr_abs_inc           hourstype_array;
   wi_ovrr_ot_daily_hours     hourstype_array;

   wi_ovrr_ot_weekly_hours    NUMBER(4,2);
   wi_ovrr_weekly_hours     NUMBER(4,2);



   is_override            Boolean := False;
   week_start_saturday        DATE;
   week_end_friday        DATE;
   overrideIDcurr         NUMBER;





--****************************************************************************
-- Locally Defined Procedures and Functions
--****************************************************************************
/*************************************************************************************

* FUNCTION: f_eoyshutdowninfo
*
* PURPOSE:
*   This is to support Malaysia and Singapore GVR rules for annual leave and flex vacation
*   Check ITES.IT_CALENDAR @ LCD_ITES for EOYSHUTDOWNFLAG = 'Y' for macthing org and weekending date
*   Sets global variables is_malaysing, total_eoy_shutdown_days, and array arr_eoy_shutdowndays
*
*   written by RdW 6/6/2025 INC 0952194
*   last upd   RdW 11/25/2025 INC 1167795
*
*************************************************************************************/
PROCEDURE f_eoyshutdowninfo(
    in_org_code lcd.toe_attabs_map.org_code%TYPE,
    in_end_date DATE
) IS
    v_current_year NUMBER;
    v_weekending_date DATE;

    -- Variables for cursor processing
    v_dayofweek NUMBER;
    v_eoyshutdownflag VARCHAR2(1);

    -- Cursor for efficient processing of IT_CALENDAR records
    CURSOR c_eoy_shutdown IS
        SELECT DAYOFWEEK, EOYSHUTDOWNFLAG
        FROM ITES.IT_CALENDAR@LCD_ITES
        WHERE ORGANIZATIONID = in_org_code
        AND WEEKENDINGDATE = TO_CHAR(v_weekending_date, 'YYYYMMDD');

BEGIN
    -- Step 1: Check org_code and set is_malaysing flag
    IF in_org_code IN ('A00', 'A60', 'A80') THEN
        is_malaysing := TRUE;
        DBMS_OUTPUT.PUT_LINE('f_eoyshutdowninfo(): is_malaysing=TRUE');
    ELSE
        is_malaysing := FALSE;
        DBMS_OUTPUT.PUT_LINE('f_eoyshutdowninfo(): is_malaysing=FALSE');
        -- Exit procedure if condition is false
        RETURN;
    END IF;



    -- RdW 11/25/2025 INC 1167795 Comment out code no longer needed
    /*

    -- Step 2a: Get current year from input date and count EOY shutdown days
    v_current_year := EXTRACT(YEAR FROM in_end_date);
    v_weekending_date := in_end_date;

    -- Count total EOY shutdown days for the current year
    -- Assuming WEEKENDINGDATE is stored as VARCHAR2 or NUMBER in YYYYMMDD format
    -- 6/12/2025 fixe the value of total_eoy_shutdown_days = 4
    -- SELECT COUNT(*)
    -- INTO total_eoy_shutdown_days
    -- FROM ITES.IT_CALENDAR@LCD_ITES
    -- WHERE ORGANIZATIONID = in_org_code
    -- AND SUBSTR(TO_CHAR(WEEKENDINGDATE), 1, 4) = TO_CHAR(v_current_year)
    -- AND EOYSHUTDOWNFLAG = 'Y';
    total_eoy_shutdown_days := 4;

    -- Step 2b: Initialize the array and process records efficiently
    -- Clear the array first
    arr_eoy_shutdowndays.DELETE;

    -- Initialize all days of week to 0
    FOR i IN 1..7 LOOP
        arr_eoy_shutdowndays(i) := 0;
    END LOOP;

    -- Process records for matching ORGANIZATIONID and WEEKENDINGDATE
    OPEN c_eoy_shutdown;
    LOOP
        FETCH c_eoy_shutdown INTO v_dayofweek, v_eoyshutdownflag;
        EXIT WHEN c_eoy_shutdown%NOTFOUND;

        IF v_eoyshutdownflag = 'Y' THEN
            arr_eoy_shutdowndays(v_dayofweek) := 1;
        END IF;
    END LOOP;
    CLOSE c_eoy_shutdown;
    */

EXCEPTION
    WHEN OTHERS THEN
        -- Handle any exceptions appropriately
        RAISE;

END f_eoyshutdowninfo;


/*************************************************************************************

* FUNCTION: f_is_override_rule_applies
*
* PURPOSE:
*   To determine if the normal functionality GVR should be overridden with rules for a particular week
*   Basically this provides daily granularity to the GVR validation and leave checks
*   Returns TRUE is override is active for this weekending date, FALSE if not
*
*   written by RdW 2/26/2025 INC 35522049
*
*************************************************************************************/
  FUNCTION f_is_override_rule_applies (
    in_org_code  IN VARCHAR2,
    in_end_date  IN DATE
  ) RETURN BOOLEAN IS

    -- Cursor returning only the needed columns (using only primitive types)
    CURSOR c_override_date_ranges IS
      SELECT overrideID, recvalue_str
      FROM LCD.GVR_OVERRIDES
      WHERE rectypeID = 3
      ORDER BY recvalue_str DESC;

    -- Local variables for the cursor columns
    v_overrideID      NUMBER;
    v_recvalue_str    VARCHAR2(4000);

    -- Local variables for date range processing
    date_range_arr      VARCHAR2(4000);
    start_date_str      VARCHAR2(8);
    end_date_str        VARCHAR2(8);
    date_separator_pos  NUMBER;
    range_start_date    DATE;
    range_end_date      DATE;


    -- Local variables to hold override values from LCD.GVR_OVERRIDES
    v_org_recvalue_str    VARCHAR2(4000);
    v_type10_recvalue_str VARCHAR2(4000);
    v_type11_recvalue_str VARCHAR2(4000);

    -- Local variables for worker_hist query results  note these are declared as lcd.pay_edit.hourstype
    out_total_hrs       NUMBER(4,2);
    out_long_day        NUMBER(4,2);
    out_ot_weekly_hrs   NUMBER(4,2);
    out_ot_daily_hrs    NUMBER(4,2);

    current_date_loop   DATE;
    day_of_week_index   INTEGER;
    pg_pay_week         NUMBER;

    -- Local variables for processing the override date range
    overrideIDcurr      NUMBER;
    week_start_saturday DATE;
    week_end_friday     DATE;

  BEGIN

    DBMS_OUTPUT.PUT_LINE('DEBUG 2A: Entering function f_is_override_rule_applies.');
    DBMS_OUTPUT.PUT_LINE('DEBUG: in_org_code=' || in_org_code || ', in_end_date=' || TO_CHAR(in_end_date, 'YYYYMMDD'));
    -- -- INSERT INTO RDW_DEBUG (content) VALUES ('DEBUG2A: in_org_code=' || in_org_code || ', in_end_date=' || to_char(in_end_date, 'yyyymmdd'));  -- Rdw 2/20/25

    -- Assume is_override is a global or package variable; initialize it here.
    is_override := FALSE;

    OPEN c_override_date_ranges;
  <<outer_loop>>
    LOOP
      FETCH c_override_date_ranges INTO v_overrideID, v_recvalue_str;
      EXIT WHEN c_override_date_ranges%NOTFOUND;
      DBMS_OUTPUT.PUT_LINE('DEBUG: Fetched override record: overrideID=' || v_overrideID || ', recvalue_str=' || v_recvalue_str);

      date_range_arr := v_recvalue_str;
      date_separator_pos := INSTR(date_range_arr, '|');

      IF date_separator_pos > 0 THEN
        -- Two dates provided in the range
        start_date_str := SUBSTR(date_range_arr, 1, date_separator_pos - 1);
        end_date_str   := SUBSTR(date_range_arr, date_separator_pos + 1);
      ELSE
        -- Single date provided  use it as both start and end date
        start_date_str := date_range_arr;
        end_date_str   := date_range_arr;
      END IF;
      DBMS_OUTPUT.PUT_LINE('DEBUG: Parsed date_range_arr=' || date_range_arr ||
                           ' -> start_date_str=' || start_date_str ||
                           ', end_date_str=' || end_date_str);

      BEGIN
        -- Calculate the effective date range (Saturday before start date to Friday of end date)
        range_start_date := TO_DATE(start_date_str, 'YYYYMMDD') - 6;
        range_end_date   := TO_DATE(end_date_str, 'YYYYMMDD');
        DBMS_OUTPUT.PUT_LINE('DEBUG: Converted dates: range_start_date=' || TO_CHAR(range_start_date, 'YYYYMMDD') ||
                             ', range_end_date=' || TO_CHAR(range_end_date, 'YYYYMMDD'));

      EXCEPTION
        WHEN OTHERS THEN
           DBMS_OUTPUT.PUT_LINE('DEBUG: Date conversion failed for date_range_arr=' || date_range_arr);
           GOTO outer_loop;
      END;

      DBMS_OUTPUT.PUT_LINE('DEBUG: Checking if in_end_date (' || TO_CHAR(in_end_date, 'YYYYMMDD') ||
                           ') is between range_start_date (' || TO_CHAR(range_start_date, 'YYYYMMDD') ||
                           ') and range_end_date (' || TO_CHAR(range_end_date, 'YYYYMMDD') || ').');
              -- INSERT INTO RDW_DEBUG (content) VALUES ('DEBUG: Checking if in_end_date (' || TO_CHAR(in_end_date, 'YYYYMMDD') ||
              --             ') is between range_start_date (' || TO_CHAR(range_start_date, 'YYYYMMDD') ||
              --             ') and range_end_date (' || TO_CHAR(range_end_date, 'YYYYMMDD') || ').'); 
      IF NOT (in_end_date BETWEEN range_start_date AND range_end_date) THEN
        DBMS_OUTPUT.PUT_LINE('DEBUG: in_end_date not in the effective range. Skipping record.');
        GOTO outer_loop;
      END IF;

      week_start_saturday := range_start_date;
      week_end_friday     := range_end_date;
      overrideIDcurr      := v_overrideID;
      DBMS_OUTPUT.PUT_LINE('DEBUG: OverrideID set to: ' || overrideIDcurr);

      -- Fetch the type 1 (org code) override record
      BEGIN
        SELECT recvalue_str
        INTO   v_org_recvalue_str
        FROM   LCD.GVR_OVERRIDES
        WHERE  overrideID = overrideIDcurr
          AND  rectypeID = 1
          AND  isactive > 0; -- RdW 3/11/2025 need to only fetch active records.
        DBMS_OUTPUT.PUT_LINE('DEBUG: Fetched type 1 override: v_org_recvalue_str=' || v_org_recvalue_str);
      EXCEPTION
        WHEN NO_DATA_FOUND THEN
           DBMS_OUTPUT.PUT_LINE('DEBUG: No type 1 override record found for overrideID=' || overrideIDcurr);
           overrideIDcurr := NULL;
           RETURN FALSE;
      END;

      IF v_org_recvalue_str IS NULL OR INSTR(v_org_recvalue_str, in_org_code) = 0 THEN
        DBMS_OUTPUT.PUT_LINE('DEBUG: Org code mismatch. in_org_code=' || in_org_code ||
                             ' not found in v_org_recvalue_str=' || v_org_recvalue_str);
        overrideIDcurr := NULL;
        RETURN FALSE;
      END IF;

      DBMS_OUTPUT.PUT_LINE('DEBUG: Org code match confirmed.');
      -- Org code matches; set the override flag and initialize weekly accumulators.
      is_override := TRUE;
      wi_ovrr_ot_weekly_hours := 0;
      wi_ovrr_weekly_hours    := 0;

      current_date_loop := week_start_saturday; -- Start from Saturday
      DBMS_OUTPUT.PUT_LINE('DEBUG: Starting weekly processing from ' || TO_CHAR(current_date_loop, 'YYYYMMDD'));

      pg_pay_week := pay_week_1_or_2 (pg_end_date);
      DBMS_OUTPUT.PUT_LINE('DEBUG: pg_pay_week ' || to_char(pg_pay_week) || ' with date ' || pg_end_date);

      FOR u IN 1..7 LOOP  -- Loop over each day (Saturday to Friday)
        day_of_week_index := u;  -- 1 for Saturday, 2 for Sunday, etc.
        DBMS_OUTPUT.PUT_LINE('DEBUG: Processing day ' || day_of_week_index || ' with date ' || TO_CHAR(current_date_loop, 'YYYYMMDD'));




        -- Query worker_hist for the current day; note that the returned columns are of type lcd.pay_edit.hourstype
        SELECT
          CASE WHEN pg_pay_week = 1 THEN wk1_total_hrs ELSE wk2_total_hrs END,
          CASE WHEN pg_pay_week = 1 THEN wk1_long_day  ELSE wk2_long_day END,
          CASE WHEN pg_pay_week = 1 THEN wk1_ot_weekly_hrs ELSE wk2_ot_weekly_hrs END,
          CASE WHEN pg_pay_week = 1 THEN wk1_ot_daily_hrs ELSE wk2_ot_daily_hrs END
        INTO
          out_total_hrs,
          out_long_day,
          out_ot_weekly_hrs,
          out_ot_daily_hrs
        FROM (
          SELECT
            org_code,
            worker_id,
            actual_date,
            wk1_total_hrs,
            wk1_long_day,
            wk1_ot_weekly_hrs,
            wk1_ot_daily_hrs,
            wk2_total_hrs,
            wk2_long_day,
            wk2_ot_weekly_hrs,
            wk2_ot_daily_hrs
          FROM LCD.worker_hist 
          WHERE worker_id = pg_worker_id
            AND org_code = pg_org_code
            AND actual_date = (
              SELECT MAX(actual_date)
              FROM LCD.worker_hist
              WHERE actual_date <= current_date_loop
                AND org_code = pg_org_code
                AND worker_id = pg_worker_id
            )
        );


        DBMS_OUTPUT.PUT_LINE('DEBUG: Worker hist query: out_total_hrs=' || out_total_hrs ||
                             ', out_long_day=' || out_long_day ||
                             ', out_ot_weekly_hrs=' || out_ot_weekly_hrs ||
                             ', out_ot_daily_hrs=' || out_ot_daily_hrs);

        -- Populate your global override arrays with the fetched values
        wi_ovrr_long_day(u)       := out_long_day;
        wi_ovrr_abs_inc(u)        := out_long_day / 2.0;
        wi_ovrr_ot_daily_hours(u) := out_ot_daily_hrs;

        -- Check for a type 10 override for the current day
        BEGIN
          SELECT recvalue_str
          INTO   v_type10_recvalue_str
          FROM   LCD.GVR_OVERRIDES
          WHERE  overrideID = overrideIDcurr
            AND  rectypeID = 10
            AND  recvalue_date = current_date_loop;
          DBMS_OUTPUT.PUT_LINE('DEBUG: Fetched type 10 override for date ' || TO_CHAR(current_date_loop, 'YYYYMMDD') ||
                               ': v_type10_recvalue_str=' || v_type10_recvalue_str);
          IF TO_NUMBER(v_type10_recvalue_str) > out_long_day THEN
            DBMS_OUTPUT.PUT_LINE('DEBUG: Type 10 override value (' || v_type10_recvalue_str || 
                                 ') is greater than out_long_day (' || out_long_day || '). Adjusting values.');
            wi_ovrr_long_day(u) := TO_NUMBER(v_type10_recvalue_str);
            wi_ovrr_abs_inc(u)  := TO_NUMBER(v_type10_recvalue_str) / 2.0;
            wi_ovrr_ot_daily_hours(u) := TO_NUMBER(v_type10_recvalue_str);
          END IF;
        EXCEPTION
          WHEN NO_DATA_FOUND THEN
            DBMS_OUTPUT.PUT_LINE('DEBUG: No type 10 override found for date ' || TO_CHAR(current_date_loop, 'YYYYMMDD'));
            NULL; -- No type 10 override for this date; continue processing
        END;

        -- Accumulate weekly totals using your global lcd.pay_edit.hourstype variables
        -- wi_ovrr_weekly_hours    := wi_ovrr_weekly_hours + wi_ovrr_long_day(u);
        -- wi_ovrr_ot_weekly_hours := wi_ovrr_ot_weekly_hours + wi_ovrr_ot_daily_hours(u);

        -- DBMS_OUTPUT.PUT_LINE('DEBUG: After day ' || day_of_week_index || ', weekly totals: wi_ovrr_weekly_hours=' ||
        --                     wi_ovrr_weekly_hours || ', wi_ovrr_ot_weekly_hours=' || wi_ovrr_ot_weekly_hours);

        current_date_loop := current_date_loop + 1; -- Move to the next day
      END LOOP;

      -- RdW 2/26/25 we need a way to load weekly hour information for an override week.
      -- repurposing record type 11 for weekly hours
      -- BEGIN
      --    SELECT recvalue_str
      --    INTO   v_type11_recvalue_str
      --    FROM   LCD.GVR_OVERRIDES
      --    WHERE  overrideID = overrideIDcurr
      --      AND  rectypeID = 11
      --      AND  recvalue_date = week_end_friday;

      --   wi_ovrr_weekly_hours    := TO_NUMBER(v_type11_recvalue_str);
      --   wi_ovrr_ot_weekly_hours    := TO_NUMBER(v_type11_recvalue_str);

      --   DBMS_OUTPUT.PUT_LINE('DEBUG: rectype 11:   weekly : wi_ovrr_weekly_hours=' ||
      --                       wi_ovrr_weekly_hours || ', wi_ovrr_ot_weekly_hours=' || wi_ovrr_ot_weekly_hours);
      -- END;

      DBMS_OUTPUT.PUT_LINE('DEBUG: Override rule applies. Exiting with TRUE.');
      CLOSE c_override_date_ranges;
      RETURN TRUE;  -- An applicable override rule was found and processed
    END LOOP;

    CLOSE c_override_date_ranges;
    DBMS_OUTPUT.PUT_LINE('DEBUG: No applicable override rule was found. Exiting with FALSE.');
    RETURN FALSE; -- No applicable override rule was found

  EXCEPTION
    WHEN NO_DATA_FOUND THEN
      DBMS_OUTPUT.PUT_LINE('DEBUG: Exception NO_DATA_FOUND encountered.');
      CLOSE c_override_date_ranges;
      RETURN FALSE;
    WHEN OTHERS THEN
      DBMS_OUTPUT.PUT_LINE('DEBUG: An unexpected error occurred: ' || SQLERRM);
      CLOSE c_override_date_ranges;
      RAISE;
  END f_is_override_rule_applies;

/*************************************************************************************
*
* FUNCTION: get_remote_balance
*
* PURPOSE:
*   Wraps the remote function ites.f_GET_REMAINING_Balance_1 over the lcd_ites database link.
*   Retrieves the remaining balance for a given worker ID and week-ending date.
*   Returns the numeric balance fetched from the remote system.
*
*   written by RdW 7/17/2025 INC 0995207
*
*************************************************************************************/

  FUNCTION get_remote_balance(
    p_worker_id      IN VARCHAR2,
    p_weekendingdate IN VARCHAR2
  ) RETURN NUMBER IS
    l_balance NUMBER;
    l_formatted_date VARCHAR2(8);
  BEGIN
    -- Ensure date is in YYYYMMDD format
    -- Handle different input formats
    BEGIN
      -- If already in YYYYMMDD format (8 digits), use as-is
      IF REGEXP_LIKE(p_weekendingdate, '^\d{8}$') THEN
        l_formatted_date := p_weekendingdate;
      -- If it's a date with slashes or dashes (MM/DD/YYYY, MM-DD-YYYY, etc.)
      ELSE
        -- Convert to DATE then back to YYYYMMDD format
        l_formatted_date := TO_CHAR(TO_DATE(p_weekendingdate), 'YYYYMMDD');
      END IF;
    EXCEPTION
      WHEN OTHERS THEN
        -- If conversion fails, try common formats
        BEGIN
          l_formatted_date := TO_CHAR(TO_DATE(p_weekendingdate, 'MM/DD/YYYY'), 'YYYYMMDD');
        EXCEPTION
          WHEN OTHERS THEN
            BEGIN
              l_formatted_date := TO_CHAR(TO_DATE(p_weekendingdate, 'DD-MON-YYYY'), 'YYYYMMDD');
            EXCEPTION
              WHEN OTHERS THEN
                RAISE_APPLICATION_ERROR(-20001, 'Invalid date format: ' || p_weekendingdate);
            END;
        END;
    END;

    DBMS_OUTPUT.PUT_LINE('get_remote_balance() called with:');
    DBMS_OUTPUT.PUT_LINE('  worker_id: ' || p_worker_id);
    DBMS_OUTPUT.PUT_LINE('  original date: ' || p_weekendingdate);
    DBMS_OUTPUT.PUT_LINE('  formatted date: ' || l_formatted_date);

    -- Call with formatted date
    EXECUTE IMMEDIATE q'[
      SELECT ites.f_GET_REMAINING_Balance_1@lcd_ites(:1, :2) 
      FROM dual
    ]'
    INTO l_balance
    USING p_worker_id, l_formatted_date;

    DBMS_OUTPUT.PUT_LINE('inside get_remote_balance(): l_balance: ' || 
                         NVL(TO_CHAR(l_balance), '<NULL>'));

    RETURN l_balance;

  EXCEPTION
    WHEN OTHERS THEN
      DBMS_OUTPUT.PUT_LINE('ERROR in get_remote_balance: ' || SQLERRM);
      RAISE;
  END get_remote_balance;

/*************************************************************************************

* FUNCTION: f_activity_type
*
* PURPOSE:
*   Returns activity type (HOL, REG, OT, etc.) based on org_code and att_abs_type.
*   Returns NULL if no data is found.
*
*  pg_org_code is package global input
*
*************************************************************************************/
   FUNCTION f_activity_type (
      param_att_abs_type   IN   lcd.att_abs_type.att_abs_type%TYPE
   )
      RETURN activitygrouptype
   IS
      return_activity_group   activitygrouptype;
   BEGIN
      --dbms_output.put_line('*****Begin f_activity_type*****');

      SELECT activity_group, NVL (fml_flag, 'N'), NVL (unit_flag, 'H'), NVL(double_time_flag,'N')
        INTO return_activity_group
        FROM lcd.att_abs_type
       WHERE org_code = pg_org_code AND att_abs_type = param_att_abs_type;

      --dbms_output.put_line('*****End f_activity_type*****');

      RETURN return_activity_group;
   EXCEPTION
      WHEN NO_DATA_FOUND
      THEN
         --dbms_output.put_line('*****End f_activity_type*****');
         return_activity_group.grp := 'UND';
         RETURN return_activity_group;
      WHEN OTHERS
      THEN
         RAISE;
   END f_activity_type;

/*************************************************************************************
* PROCEDURE: get_max_daily_hours
*
* PURPOSE:
*   Returns the maximum number of daily hours that can be charged
*   by an organization based on MAXHOURS entry on the support systems table
*   If no record is found, the default value of 24 is returned.
*
**************************************************************************************/

PROCEDURE get_max_daily_hours (max_hours IN OUT NUMBER)
   IS
   BEGIN
      SELECT to_number(system_desc)
        INTO max_hours
        FROM lcd.support_systems
       WHERE system_type = 'MAXHOURS'
        AND SYSTEM_CODE = pg_org_code;

   EXCEPTION
      WHEN NO_DATA_FOUND
      THEN
         max_hours := 24;
      WHEN OTHERS
      THEN
         RAISE;
END get_max_daily_hours; 


--*************************************************************************************
--* PROCEDURE: collect_limits
--*
--* PURPOSE:
--*   Collect att_abs_type information into a PL/SQL table to ultimately use to check against
--*   the limits tables.
--*
--*************************************************************************************
   PROCEDURE collect_limits (
      p_type    IN   VARCHAR2,
      p_dept    IN   VARCHAR2,
      p_hours   IN   NUMBER,
      p_day     IN   INTEGER
   )
   IS
   BEGIN
      collect_limit_indx :=   collect_limit_indx
                            + 1; --global count 
      --Add the value passed to the appropriate position in the array
      att_array (collect_limit_indx).atype := p_type;
      att_array (collect_limit_indx).dept := p_dept;
      att_array (collect_limit_indx).hours := p_hours;
      att_array (collect_limit_indx).DAY := p_day;
   END collect_limits;


/*************************************************************************************
* PROCEDURE: tally
*
* PURPOSE:
*   Tallies data for the week, storing results in global variables
*
*
*************************************************************************************/
   PROCEDURE tally (p_time_rec IN lcd.pay_edit.timetype)
   IS
      activity_type   activitygrouptype;
   BEGIN
      dbms_output.put_line('*****Begin tally*****');
      dbms_output.put_line('  p_time_rec.att_abs_type=[' || p_time_rec.att_abs_type || ']');
      dbms_output.put_line('  p_time_rec.wo_num=[' || p_time_rec.wo_num || ']');
      dbms_output.put_line('  p_time_rec.day=[' || p_time_rec.day || ']');
      dbms_output.put_line('  p_time_rec.hours=[' || p_time_rec.hours || ']');

      activity_type := f_activity_type (p_time_rec.att_abs_type);

    dbms_output.put_line('Activity_type.grp=[' || activity_type.grp || ']');
    dbms_output.put_line('Activity_type.dbl=[' || activity_type.dbl || ']');

    dbms_output.put_line('Activity_type.fml=[' || activity_type.fml || ']');


      IF activity_type.unit != 'U'
      THEN -- don't record units, only hours
         --add hours to weekly total
         total_hours :=   total_hours
                        + p_time_rec.hours;
         --add hours to total daily tally
         total_day (p_time_rec.DAY) :=
                                 total_day (p_time_rec.DAY)
                               + p_time_rec.hours;

         -- RdW 10/31/2025 INC1138014 India Supplemental Pay
         IF p_time_rec.att_abs_type = '1SBH'
         THEN
            total_day_stdby_half (p_time_rec.DAY) := total_day_stdby_half (p_time_rec.DAY) + p_time_rec.hours;
            total_day_stdby (p_time_rec.DAY) := total_day_stdby (p_time_rec.DAY) + p_time_rec.hours;
            total_week_stdby := total_week_stdby + p_time_rec.hours;
            dbms_output.put_line('total_day_stdby_half=[' || p_time_rec.DAY || '] = ' || total_day_stdby_half (p_time_rec.DAY) );    
         END IF;

         IF p_time_rec.att_abs_type = '1SBF'
         THEN
            total_day_stdby_full (p_time_rec.DAY) := total_day_stdby_full (p_time_rec.DAY) + p_time_rec.hours;
            total_day_stdby (p_time_rec.DAY) := total_day_stdby (p_time_rec.DAY) + p_time_rec.hours;
            total_week_stdby := total_week_stdby + p_time_rec.hours;
            dbms_output.put_line('total_day_stdby_full=[' || p_time_rec.DAY || '] = ' || total_day_stdby_full (p_time_rec.DAY) );    
         END IF;

         IF p_time_rec.att_abs_type = '1SBD'
         THEN
            total_day_stdby_dbl (p_time_rec.DAY) := total_day_stdby_dbl (p_time_rec.DAY) + p_time_rec.hours;
            total_day_stdby (p_time_rec.DAY) := total_day_stdby (p_time_rec.DAY) + p_time_rec.hours;
            total_week_stdby := total_week_stdby + p_time_rec.hours;    
            dbms_output.put_line('total_day_stdby_dbl=[' || p_time_rec.DAY || '] = ' || total_day_stdby_dbl (p_time_rec.DAY) );
         END IF;
         -- ____________________________________________________________________________

         -- RdW 3/25/2026 INC1247720 "LCD Asia Variable Claims Malaysia"
         IF p_time_rec.att_abs_type = '3010'
         THEN
            total_day_my3010 (p_time_rec.DAY) := total_day_my3010 (p_time_rec.DAY) + p_time_rec.hours;
         END IF;
         -- ____________________________________________________________________________

--RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026
         IF pg_org_code = 'A60' THEN
            IF p_time_rec.att_abs_type = '3011' THEN
               total_day_my3011 (p_time_rec.DAY) := total_day_my3011 (p_time_rec.DAY) + p_time_rec.hours;
            ELSIF p_time_rec.att_abs_type = '3020' THEN
               total_day_my3020 (p_time_rec.DAY) := total_day_my3020 (p_time_rec.DAY) + p_time_rec.hours;
            ELSIF p_time_rec.att_abs_type = '3030' THEN
               total_day_my3030 (p_time_rec.DAY) := total_day_my3030 (p_time_rec.DAY) + p_time_rec.hours;
            ELSIF p_time_rec.att_abs_type = '3040' THEN
               total_day_my3040 (p_time_rec.DAY) := total_day_my3040 (p_time_rec.DAY) + p_time_rec.hours;
            ELSIF p_time_rec.att_abs_type = '3050' THEN
               total_day_my3050 (p_time_rec.DAY) := total_day_my3050 (p_time_rec.DAY) + p_time_rec.hours;
            ELSIF p_time_rec.att_abs_type = '3060' THEN
               total_day_my3060 (p_time_rec.DAY) := total_day_my3060 (p_time_rec.DAY) + p_time_rec.hours;
            END IF;
         END IF;

         IF pg_org_code IN ('A00', 'A80') THEN
            IF p_time_rec.att_abs_type = '3100' THEN
               total_day_sg3100 (p_time_rec.DAY) := total_day_sg3100 (p_time_rec.DAY) + p_time_rec.hours;
               total_week_sg3100 := total_week_sg3100 + p_time_rec.hours;
            ELSIF p_time_rec.att_abs_type = '3110' THEN
               total_day_sg3110 (p_time_rec.DAY) := total_day_sg3110 (p_time_rec.DAY) + p_time_rec.hours;
               total_week_sg3110 := total_week_sg3110 + p_time_rec.hours;
            ELSIF p_time_rec.att_abs_type = '3120' THEN
               total_day_sg3120 (p_time_rec.DAY) := total_day_sg3120 (p_time_rec.DAY) + p_time_rec.hours;
               total_week_sg3120 := total_week_sg3120 + p_time_rec.hours;
            END IF;
         END IF;
--RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026

         IF activity_type.fml = 'Y'
         THEN --FML hours
            total_week_fml :=   total_week_fml
                              + p_time_rec.hours;
            total_day_fml (p_time_rec.DAY) :=
                             total_day_fml (p_time_rec.DAY)
                           + p_time_rec.hours;
         END IF;

         IF activity_type.grp = 'REG'
         THEN --Regular hours
            total_day_reg (p_time_rec.DAY) :=
                             total_day_reg (p_time_rec.DAY)
                           + p_time_rec.hours;
            total_week_reg :=   total_week_reg
                              + p_time_rec.hours;

         ELSIF activity_type.grp = 'UPR'
         THEN --Regular hours (new group 10/11/99)
            total_day_reg (p_time_rec.DAY) :=
                             total_day_reg (p_time_rec.DAY)
                           + p_time_rec.hours;
            total_week_reg :=   total_week_reg
                              + p_time_rec.hours;

         ELSIF activity_type.grp = 'OT'
         THEN --OT hours
            total_day_ot (p_time_rec.DAY) :=
                              total_day_ot (p_time_rec.DAY)
                            + p_time_rec.hours;
            total_week_ot :=   total_week_ot
                             + p_time_rec.hours;
            -- FY14-2193
            IF activity_type.dbl = 'Y'
            THEN 

               total_day_dbl (p_time_rec.DAY) :=
                              total_day_dbl (p_time_rec.DAY)
                            + p_time_rec.hours;

               total_week_dbl :=   total_week_dbl
                             + p_time_rec.hours;       
            END IF;

         ELSIF activity_type.grp = 'HOL'
         THEN --Holiday hours
            total_day_hol (p_time_rec.DAY) :=
                             total_day_hol (p_time_rec.DAY)
                           + p_time_rec.hours;
            total_week_hol :=   total_week_hol
                              + p_time_rec.hours;

            IF activity_type.fml = 'N'
            THEN -- non FML hours
               total_day_hol_nonfml (p_time_rec.DAY) :=
                             total_day_hol_nonfml (p_time_rec.DAY)
                               + p_time_rec.hours;
            END IF;


         ELSIF activity_type.grp = 'VAC'
         THEN --vacation
            total_day_vac (p_time_rec.DAY) :=
                             total_day_vac (p_time_rec.DAY)
                           + p_time_rec.hours;
            total_week_vac := total_week_vac 
                              + p_time_rec.hours;

            -- dbms_output.put_line('total_day_vac['||p_time_rec.DAY||'] '||total_day_vac (p_time_rec.DAY));

            IF activity_type.fml = 'N'
            THEN -- non FML hours

               total_day_vac_nonfml (p_time_rec.DAY) :=
                             total_day_vac_nonfml (p_time_rec.DAY)
                               + p_time_rec.hours;
            END IF;


         ELSIF activity_type.grp = 'SCK'
         THEN --Sick hours
            total_day_sick (p_time_rec.DAY) :=
                            total_day_sick (p_time_rec.DAY)
                          + p_time_rec.hours;

            total_week_sick := total_week_sick + p_time_rec.hours;


            IF activity_type.fml = 'N'
            THEN -- non FML hours

               total_day_sick_nonfml (p_time_rec.DAY) :=
                             total_day_sick_nonfml (p_time_rec.DAY)
                               + p_time_rec.hours;
            ELSE

               total_day_sick_fml (p_time_rec.DAY) :=
                             total_day_sick_fml (p_time_rec.DAY)
                               + p_time_rec.hours;

               bFmlSickFlag := True;

            END IF;


         ELSIF activity_type.grp = 'LV'
         THEN --Leave hours
            total_day_lv (p_time_rec.DAY) :=
                              total_day_lv (p_time_rec.DAY)
                            + p_time_rec.hours;

            total_week_lv := total_week_lv + p_time_rec.hours;

            IF activity_type.fml = 'N'
            THEN -- non FML hours

               total_day_lv_nonfml (p_time_rec.DAY) :=
                             total_day_lv_nonfml (p_time_rec.DAY)
                               + p_time_rec.hours;
            END IF;


         ELSIF activity_type.grp = 'UPD'
         THEN --Unpaid hours
            total_day_upd (p_time_rec.DAY) :=
                             total_day_upd (p_time_rec.DAY)
                           + p_time_rec.hours;
            total_week_upd :=   total_week_upd
                              + p_time_rec.hours;

            -- Used to check Unpaid Family  L.I.
            IF activity_type.fml = 'Y'
            THEN --FML hours 

               total_day_upd_fml (p_time_rec.DAY) :=
                             total_day_upd_fml (p_time_rec.DAY)
                           + p_time_rec.hours;
            ELSE
                total_week_updNQ :=   total_week_updNQ 
                                    + p_time_rec.hours;

            END IF;


         ELSIF activity_type.grp = 'PB'
         THEN --Personal Business
            total_day_pb (p_time_rec.DAY) :=
                              total_day_pb (p_time_rec.DAY)
                            + p_time_rec.hours;
           total_week_pb := total_week_pb + p_time_rec.hours;


            IF activity_type.fml = 'N'
            THEN -- non FML hours

               total_day_pb_nonfml (p_time_rec.DAY) :=
                             total_day_pb_nonfml (p_time_rec.DAY)
                               + p_time_rec.hours;
            ELSE

               total_day_pb_fml (p_time_rec.DAY) :=
                             total_day_pb_fml (p_time_rec.DAY)
                               + p_time_rec.hours;

            END IF;

         ELSIF activity_type.grp = 'MIL'
         THEN --Military Leave
            total_day_mil (p_time_rec.DAY) :=
                             total_day_mil (p_time_rec.DAY)
                           + p_time_rec.hours;
           total_week_mil := total_week_mil + p_time_rec.hours;

            IF activity_type.fml = 'N'
            THEN -- non FML hours

               total_day_mil_nonfml (p_time_rec.DAY) :=
                             total_day_mil_nonfml (p_time_rec.DAY)
                               + p_time_rec.hours;
            END IF;



         ELSIF activity_type.grp = 'CCL'
         THEN --Childcare Leave
            total_day_ccl (p_time_rec.DAY) :=
                             total_day_ccl (p_time_rec.DAY)
                           + p_time_rec.hours;
           total_week_ccl := total_week_ccl + p_time_rec.hours;

            IF activity_type.fml = 'N'
            THEN -- non FML hours

               total_day_ccl_nonfml (p_time_rec.DAY) :=
                             total_day_ccl_nonfml (p_time_rec.DAY)
                               + p_time_rec.hours;
            END IF;


         ELSIF activity_type.grp = 'MLV'
         THEN --Matrenity Leave
            total_day_mlv (p_time_rec.DAY) :=
                             total_day_mlv (p_time_rec.DAY)
                           + p_time_rec.hours;
           total_week_mlv := total_week_mlv + p_time_rec.hours;

            IF activity_type.fml = 'N'
            THEN -- non FML hours

               total_day_mlv_nonfml (p_time_rec.DAY) :=
                             total_day_mlv_nonfml (p_time_rec.DAY)
                               + p_time_rec.hours;
            END IF;

         ELSIF activity_type.grp = 'PLV'
         THEN --Paternity Leave
            total_day_plv (p_time_rec.DAY) :=
                             total_day_plv (p_time_rec.DAY)
                           + p_time_rec.hours;
           total_week_plv := total_week_plv + p_time_rec.hours;

            IF activity_type.fml = 'N'
            THEN -- non FML hours

               total_day_plv_nonfml (p_time_rec.DAY) :=
                             total_day_plv_nonfml (p_time_rec.DAY)
                               + p_time_rec.hours;
            END IF;


         ELSIF activity_type.grp = 'SL'
         THEN --Study Leave
            total_day_sl (p_time_rec.DAY) :=
                             total_day_sl (p_time_rec.DAY)
                           + p_time_rec.hours;
           total_week_sl := total_week_sl + p_time_rec.hours;

            IF activity_type.fml = 'N'
            THEN -- non FML hours

               total_day_sl_nonfml (p_time_rec.DAY) :=
                             total_day_sl_nonfml (p_time_rec.DAY)
                               + p_time_rec.hours;
            END IF;

         -- RdW INC1110706 10/31/2025 changed from 'LSL' to 'ASL'
         ELSIF activity_type.grp = 'ASL'
         THEN --Annual Special Leave [Previously Long Service Leave]
            total_day_lsl (p_time_rec.DAY) :=
                             total_day_lsl (p_time_rec.DAY)
                           + p_time_rec.hours;
           total_week_lsl := total_week_lsl + p_time_rec.hours;

            IF activity_type.fml = 'N'
            THEN -- non FML hours

               total_day_lsl_nonfml (p_time_rec.DAY) :=
                             total_day_lsl_nonfml (p_time_rec.DAY)
                               + p_time_rec.hours;
            END IF;

         ELSIF activity_type.grp = 'FL'
         THEN --Furlough Leave
            total_day_fl (p_time_rec.DAY) :=
                             total_day_fl (p_time_rec.DAY)
                           + p_time_rec.hours;
           total_week_fl := total_week_fl + p_time_rec.hours;

            IF activity_type.fml = 'N'
            THEN -- non FML hours

               total_day_fl_nonfml (p_time_rec.DAY) :=
                             total_day_fl_nonfml (p_time_rec.DAY)
                               + p_time_rec.hours;
            END IF;


         ELSIF activity_type.grp = 'FCL'
         THEN --Family carer Leave
            total_day_fcl (p_time_rec.DAY) :=
                             total_day_fcl (p_time_rec.DAY)
                           + p_time_rec.hours;
           total_week_fcl := total_week_fcl + p_time_rec.hours;

            IF activity_type.fml = 'N'
            THEN -- non FML hours

               total_day_fcl_nonfml (p_time_rec.DAY) :=
                             total_day_fcl_nonfml (p_time_rec.DAY)
                               + p_time_rec.hours;
            END IF;

         ELSIF activity_type.grp = 'SAB'
         THEN --Sabbatical Leave
            total_day_sab (p_time_rec.DAY) :=
                             total_day_sab (p_time_rec.DAY)
                           + p_time_rec.hours;
           total_week_sab := total_week_sab + p_time_rec.hours;

            IF activity_type.fml = 'N'
            THEN -- non FML hours

               total_day_sab_nonfml (p_time_rec.DAY) :=
                             total_day_sab_nonfml (p_time_rec.DAY)
                               + p_time_rec.hours;
            END IF;

         ELSIF activity_type.grp = 'CSL'
         THEN --Casual Leave
            total_day_csl (p_time_rec.DAY) :=
                             total_day_csl (p_time_rec.DAY)
                           + p_time_rec.hours;
           total_week_csl := total_week_csl + p_time_rec.hours;

            IF activity_type.fml = 'N'
            THEN -- non FML hours

               total_day_csl_nonfml (p_time_rec.DAY) :=
                             total_day_csl_nonfml (p_time_rec.DAY)
                               + p_time_rec.hours;
            END IF;

         ELSIF activity_type.grp = 'RLV'
         THEN --Restricted Leave
            total_day_rlv (p_time_rec.DAY) :=
                             total_day_rlv (p_time_rec.DAY)
                           + p_time_rec.hours;
           total_week_rlv := total_week_rlv + p_time_rec.hours;

            IF activity_type.fml = 'N'
            THEN -- non FML hours

               total_day_rlv_nonfml (p_time_rec.DAY) :=
                             total_day_rlv_nonfml (p_time_rec.DAY)
                               + p_time_rec.hours;
            END IF;

         ELSIF activity_type.grp = 'XSL'
         THEN --Extended Sick Leave
            total_day_xsl (p_time_rec.DAY) :=
                             total_day_xsl (p_time_rec.DAY)
                           + p_time_rec.hours;
           total_week_xsl := total_week_xsl + p_time_rec.hours;

            IF activity_type.fml = 'N'
            THEN -- non FML hours

               total_day_xsl_nonfml (p_time_rec.DAY) :=
                             total_day_xsl_nonfml (p_time_rec.DAY)
                               + p_time_rec.hours;
            END IF;

         ELSIF activity_type.grp = 'TIL'
         THEN --Time in Leave
            total_day_til (p_time_rec.DAY) :=
                             total_day_til (p_time_rec.DAY)
                           + p_time_rec.hours;
           total_week_til := total_week_til + p_time_rec.hours;

            IF activity_type.fml = 'N'
            THEN -- non FML hours

               total_day_til_nonfml (p_time_rec.DAY) :=
                             total_day_til_nonfml (p_time_rec.DAY)
                               + p_time_rec.hours;
            END IF;


         ELSIF activity_type.grp = 'PAR'
         THEN --Parental Leave
            total_day_par (p_time_rec.DAY) :=
                             total_day_par (p_time_rec.DAY)
                           + p_time_rec.hours;
           total_week_par := total_week_par + p_time_rec.hours;

            IF activity_type.fml = 'N'
            THEN -- non FML hours

               total_day_par_nonfml (p_time_rec.DAY) :=
                             total_day_par_nonfml (p_time_rec.DAY)
                               + p_time_rec.hours;
            END IF;

         ELSIF activity_type.grp = 'XHL'
         THEN --Extra holidays Leave
            total_day_xhl (p_time_rec.DAY) :=
                             total_day_xhl (p_time_rec.DAY)
                           + p_time_rec.hours;
           total_week_xhl := total_week_xhl + p_time_rec.hours;

            IF activity_type.fml = 'N'
            THEN -- non FML hours

               total_day_xhl_nonfml (p_time_rec.DAY) :=
                             total_day_xhl_nonfml (p_time_rec.DAY)
                               + p_time_rec.hours;
            END IF;


         ELSIF activity_type.grp = 'JUB'
         THEN --Jubilee Leave
            total_day_jub (p_time_rec.DAY) :=
                             total_day_jub (p_time_rec.DAY)
                           + p_time_rec.hours;
           total_week_jub := total_week_jub + p_time_rec.hours;

            IF activity_type.fml = 'N'
            THEN -- non FML hours

               total_day_jub_nonfml (p_time_rec.DAY) :=
                             total_day_jub_nonfml (p_time_rec.DAY)
                               + p_time_rec.hours;
            END IF;


         ELSIF activity_type.grp = 'FLX'
         THEN --Flex hours Leave
            total_day_flx (p_time_rec.DAY) :=
                             total_day_flx (p_time_rec.DAY)
                           + p_time_rec.hours;
           total_week_flx := total_week_flx + p_time_rec.hours;

            IF activity_type.fml = 'N'
            THEN -- non FML hours

               total_day_flx_nonfml (p_time_rec.DAY) :=
                             total_day_flx_nonfml (p_time_rec.DAY)
                               + p_time_rec.hours;
            END IF;


         ELSIF activity_type.grp = 'OFX'
         THEN --OT Flex Hours Leave
            total_day_ofx (p_time_rec.DAY) :=
                             total_day_ofx (p_time_rec.DAY)
                           + p_time_rec.hours;
           total_week_ofx := total_week_ofx + p_time_rec.hours;

            IF activity_type.fml = 'N'
            THEN -- non FML hours

               total_day_ofx_nonfml (p_time_rec.DAY) :=
                             total_day_ofx_nonfml (p_time_rec.DAY)
                               + p_time_rec.hours;
            END IF;



         ELSIF activity_type.grp = 'MLX'
         THEN --Maternity Leave Extention
            total_day_mlx (p_time_rec.DAY) :=
                             total_day_mlx (p_time_rec.DAY)
                           + p_time_rec.hours;
           total_week_mlx := total_week_mlx + p_time_rec.hours;

            IF activity_type.fml = 'N'
            THEN -- non FML hours

               total_day_mlx_nonfml (p_time_rec.DAY) :=
                             total_day_mlx_nonfml (p_time_rec.DAY)
                               + p_time_rec.hours;
            END IF;


         ELSIF activity_type.grp = 'MLE'
         THEN --emergency Maternity Leave
            total_day_mle (p_time_rec.DAY) :=
                             total_day_mle (p_time_rec.DAY)
                           + p_time_rec.hours;
           total_week_mle := total_week_mle + p_time_rec.hours;

            IF activity_type.fml = 'N'
            THEN -- non FML hours

               total_day_mle_nonfml (p_time_rec.DAY) :=
                             total_day_mle_nonfml (p_time_rec.DAY)
                               + p_time_rec.hours;
            END IF;

         ELSIF activity_type.grp = 'MLS'
         THEN --Special Maternity Leave
            total_day_mls (p_time_rec.DAY) :=
                             total_day_mls (p_time_rec.DAY)
                           + p_time_rec.hours;
           total_week_mls := total_week_mls + p_time_rec.hours;

            IF activity_type.fml = 'N'
            THEN -- non FML hours

               total_day_mls_nonfml (p_time_rec.DAY) :=
                             total_day_mls_nonfml (p_time_rec.DAY)
                               + p_time_rec.hours;
            END IF;


         ELSIF activity_type.grp = 'SPN'
         THEN --Sabbatical (Post Natal) Leave
            total_day_spn (p_time_rec.DAY) :=
                             total_day_spn (p_time_rec.DAY)
                           + p_time_rec.hours;
           total_week_spn := total_week_spn + p_time_rec.hours;

            IF activity_type.fml = 'N'
            THEN -- non FML hours

               total_day_spn_nonfml (p_time_rec.DAY) :=
                             total_day_spn_nonfml (p_time_rec.DAY)
                               + p_time_rec.hours;
            END IF;


         ELSIF activity_type.grp = 'DIS'
         THEN --Disciplinary Loss of Pay Leave
            total_day_dis (p_time_rec.DAY) :=
                             total_day_dis (p_time_rec.DAY)
                           + p_time_rec.hours;
           total_week_dis := total_week_dis + p_time_rec.hours;

            IF activity_type.fml = 'N'
            THEN -- non FML hours

               total_day_dis_nonfml (p_time_rec.DAY) :=
                             total_day_dis_nonfml (p_time_rec.DAY)
                               + p_time_rec.hours;
            END IF;

         ELSIF activity_type.grp = 'BVL'
         THEN --Bereavement Leave
            total_day_bvl (p_time_rec.DAY) :=
                             total_day_bvl (p_time_rec.DAY)
                           + p_time_rec.hours;
           total_week_bvl := total_week_bvl + p_time_rec.hours;

            IF activity_type.fml = 'N'
            THEN -- non FML hours

               total_day_bvl_nonfml (p_time_rec.DAY) :=
                             total_day_bvl_nonfml (p_time_rec.DAY)
                               + p_time_rec.hours;
            END IF;


         ELSIF activity_type.grp = 'TLV'
         THEN --Transfer Leave
            total_day_tlv (p_time_rec.DAY) :=
                             total_day_tlv (p_time_rec.DAY)
                           + p_time_rec.hours;
           total_week_tlv := total_week_tlv + p_time_rec.hours;

            IF activity_type.fml = 'N'
            THEN -- non FML hours

               total_day_tlv_nonfml (p_time_rec.DAY) :=
                             total_day_tlv_nonfml (p_time_rec.DAY)
                               + p_time_rec.hours;
            END IF;

         ELSIF activity_type.grp = 'PHL'
         THEN --Public holiday Leave
            total_day_phl (p_time_rec.DAY) :=
                             total_day_phl (p_time_rec.DAY)
                           + p_time_rec.hours;
           total_week_phl := total_week_phl + p_time_rec.hours;

            IF activity_type.fml = 'N'
            THEN -- non FML hours

               total_day_phl_nonfml (p_time_rec.DAY) :=
                             total_day_phl_nonfml (p_time_rec.DAY)
                               + p_time_rec.hours;
            END IF;



-- FY14-2193 END 

         ELSE --Any other hours
            total_day_other (p_time_rec.DAY) :=
                           total_day_other (p_time_rec.DAY)
                         + p_time_rec.hours;
         END IF;
      END IF; --not units

   --dbms_output.put_line('*****End tally*****');

   END tally;


/*************************************************************************************
* PROCEDURE: clear_tables
*
* PURPOSE:
*  Clears tables used to accumulate day total information
*
*
*************************************************************************************/
   PROCEDURE clear_tables
   IS
   BEGIN
      FOR cnt IN 1 .. 7
      LOOP
         total_day (cnt) := 0;
         total_day_sick (cnt) := 0;
         total_day_vac (cnt) := 0;
         total_day_hol (cnt) := 0;
         total_day_reg (cnt) := 0;
         total_day_ot (cnt) := 0;
         total_day_lv (cnt) := 0;
         total_day_upd (cnt) := 0;
         total_day_upd_fml (cnt) := 0;
         total_day_pb (cnt) := 0;
         total_day_pb_fml(cnt) := 0;
         total_day_fml (cnt) := 0;
         total_day_other (cnt) := 0;
         total_day_mil (cnt) := 0;


         total_day_ccl (cnt) := 0; 
         total_day_mlv (cnt) := 0; 
         total_day_plv (cnt) := 0; 
         total_day_sl  (cnt) := 0; 
         total_day_lsl (cnt) := 0; 
         total_day_fl  (cnt) := 0; 
         total_day_fcl (cnt) := 0; 
         total_day_sab (cnt) := 0; 
         total_day_csl (cnt) := 0; 
         total_day_rlv (cnt) := 0; 
         total_day_xsl (cnt) := 0; 
         total_day_til (cnt) := 0; 
         total_day_par (cnt) := 0; 
         total_day_xhl (cnt) := 0; 
         total_day_jub (cnt) := 0; 
         total_day_flx (cnt) := 0;
         total_day_ofx (cnt) := 0;
         total_day_mlx (cnt) := 0; 
         total_day_mle (cnt) := 0; 
         total_day_mls (cnt) := 0; 
         total_day_spn (cnt) := 0;
         total_day_dis (cnt) := 0;
         total_day_bvl (cnt) := 0; 
         total_day_tlv (cnt) := 0;
         total_day_phl (cnt) := 0;



         total_day_sick_fml(cnt) := 0;

         total_day_sick_nonfml(cnt) := 0;
         total_day_vac_nonfml(cnt) := 0; 
         total_day_lv_nonfml(cnt) := 0; 
         total_day_pb_nonfml(cnt) := 0;
         total_day_mil_nonfml(cnt) := 0;
         total_day_hol_nonfml(cnt) := 0;
         total_day_dbl(cnt) := 0;


         total_day_ccl_nonfml (cnt) := 0; 
         total_day_mlv_nonfml (cnt) := 0; 
         total_day_plv_nonfml (cnt) := 0; 
         total_day_sl_nonfml  (cnt) := 0; 
         total_day_lsl_nonfml (cnt) := 0; 
         total_day_fl_nonfml  (cnt) := 0; 
         total_day_fcl_nonfml (cnt) := 0; 
         total_day_sab_nonfml (cnt) := 0; 
         total_day_csl_nonfml (cnt) := 0; 
         total_day_rlv_nonfml (cnt) := 0; 
         total_day_xsl_nonfml (cnt) := 0; 
         total_day_til_nonfml (cnt) := 0; 
         total_day_par_nonfml (cnt) := 0; 
         total_day_xhl_nonfml (cnt) := 0; 
         total_day_jub_nonfml (cnt) := 0; 
         total_day_flx_nonfml (cnt) := 0;
         total_day_ofx_nonfml (cnt) := 0;
         total_day_mlx_nonfml (cnt) := 0; 
         total_day_mle_nonfml (cnt) := 0; 
         total_day_mls_nonfml (cnt) := 0; 
         total_day_spn_nonfml (cnt) := 0;
         total_day_dis_nonfml (cnt) := 0;
         total_day_bvl_nonfml (cnt) := 0; 
         total_day_tlv_nonfml (cnt) := 0;
         total_day_phl_nonfml (cnt) := 0;

         -- RdW 10/31/2025 INC1138014 India Supplemental Pay
         total_day_stdby (cnt)        := 0;
         total_day_stdby_half (cnt)   := 0;
         total_day_stdby_full (cnt)   := 0;
         total_day_stdby_dbl (cnt)    := 0;
         -- RdW 3/25/2026 INC1247720 "LCD Asia Variable Claims Malaysia"
         total_day_my3010 (cnt)       := 0;

--RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026
         total_day_my3011 (cnt)       := 0;
         total_day_my3020 (cnt)       := 0;
         total_day_my3030 (cnt)       := 0;
         total_day_my3040 (cnt)       := 0;
         total_day_my3050 (cnt)       := 0;
         total_day_my3060 (cnt)       := 0;

         total_day_sg3100 (cnt)       := 0;
         total_day_sg3110 (cnt)       := 0;
         total_day_sg3120 (cnt)       := 0;
--RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026

      END LOOP;

         --  RdW 11/23/2025 INC1138065 India Supplemental Pay
         total_week_stdby := 0;

--RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026
         total_week_sg3100 := 0;
         total_week_sg3110 := 0;
         total_week_sg3120 := 0;
--RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026

      att_array.DELETE;
   END clear_tables;


/*************************************************************************************
* FUNCTION: Total_Day_without_OT
*
* PURPOSE:
*  Collects totals by day excluding Overtime
*
*
*************************************************************************************/
  FUNCTION Total_Day_without_OT(OT_Flag In VARCHAR, cnt  in INTEGER)
  RETURN NUMBER 
   IS
      tot_rtn     NUMBER; 
      NO_OT_FLAG  EXCEPTION;
   BEGIN

        IF OT_Flag = 'A'  then
            tot_rtn :=  total_day_reg (cnt) + total_day_lv (cnt) +
                        total_day_sick(cnt) +
                        total_day_vac (cnt) +
                        total_day_hol (cnt) +
                        total_day_pb  (cnt) +
                        total_day_mil (cnt) +
                        total_day_ccl (cnt) + 
                        total_day_mlv (cnt) + 
                        total_day_plv (cnt) + 
                        total_day_sl  (cnt) + 
                        total_day_lsl (cnt) + 
                        total_day_fl  (cnt) + 
                        total_day_fcl (cnt) +
                        total_day_sab (cnt) + 
                        total_day_csl (cnt) +
                        total_day_rlv (cnt) + 
                        total_day_xsl (cnt) + 
                        total_day_til (cnt) + 
                        total_day_par (cnt) + 
                        total_day_xhl (cnt) + 
                        total_day_jub (cnt) + 
                        total_day_flx (cnt) +
                        total_day_ofx (cnt) +
                        total_day_mlx (cnt) + 
                        total_day_mle (cnt) + 
                        total_day_mls (cnt) + 
                        total_day_spn (cnt) +
                        total_day_dis (cnt) +
                        total_day_bvl (cnt) + 
                        total_day_tlv (cnt) +
                        total_day_phl (cnt) ;

       ELSIF OT_Flag = 'R' Then
            tot_rtn :=    total_day_reg (cnt) +  total_day_hol (cnt);
       ELSIF OT_Flag = 'V' Then
            tot_rtn :=    total_day_reg (cnt) +  total_day_hol (cnt) +   total_day_vac (cnt) ;
       ELSIF OT_Flag = 'S' Then
            tot_rtn :=    total_day_reg (cnt) +  total_day_hol (cnt) +  total_day_sick (cnt);
       ELSIF OT_Flag = 'M' Then
            tot_rtn :=    total_day_reg (cnt) +  total_day_hol (cnt) +   total_day_mil (cnt);
       ELSIF OT_Flag = 'P' Then
            tot_rtn :=    total_day_reg (cnt) +  total_day_hol (cnt) +    total_day_pb (cnt) ;
       ELSIF OT_Flag = 'Y' Then
            tot_rtn :=    total_day_reg (cnt) +  total_day_hol (cnt) +    total_day_vac (cnt)  + total_day_mil (cnt);
       ELSIF OT_Flag = 'L' Then
            tot_rtn :=   total_day_reg (cnt) +   total_day_vac (cnt)  +   total_day_hol (cnt) + total_day_sick (cnt) + total_day_mil (cnt);
       ELSIF OT_Flag = 'K' Then
            tot_rtn :=  total_day_reg (cnt)  +   total_day_vac (cnt)  +   total_day_hol (cnt) +  total_day_sick (cnt);
      ELSE
           tot_rtn := 0;   --If OT exists then it should not happen. 
       END IF;

      RETURN tot_rtn;

   EXCEPTION
--         WHEN NO_OT_FLAG THEN
--              RAISE_APPLICATION_ERROR(-20001,'OT_Flag is not set');
         WHEN OTHERS
        THEN
              RAISE;
   END Total_Day_without_OT;

/*************************************************************************************
* FUNCTION: Total_Week_without_OT
*
* PURPOSE:
*  Collects totals by Week excluding Overtime
*
*
*************************************************************************************/
  FUNCTION Total_Week_without_OT(OT_Flag In VARCHAR)
  RETURN NUMBER 
   IS
      tot_rtn     NUMBER; 
      NO_OT_FLAG  EXCEPTION;
   BEGIN






       IF OT_Flag = 'A'  then
            tot_rtn :=  total_week_reg   + 
                        total_week_sick  +   total_week_lv  +    
                        total_week_vac   +   
                        total_week_hol   +   
                        total_week_pb    +    
                        total_week_mil   +
                        total_week_ccl    + 
                        total_week_mlv    + 
                        total_week_plv    + 
                        total_week_sl     + 
                        total_week_lsl    + 
                        total_week_fl     + 
                        total_week_fcl    +
                        total_week_sab    + 
                        total_week_csl    +
                        total_week_rlv    + 
                        total_week_xsl    + 
                        total_week_til    + 
                        total_week_par    + 
                        total_week_xhl    + 
                        total_week_jub    + 
                        total_week_flx    +
                        total_week_ofx    +
                        total_week_mlx    + 
                        total_week_mle    + 
                        total_week_mls    + 
                        total_week_spn    +
                        total_week_dis    +
                        total_week_bvl    + 
                        total_week_tlv    +
                        total_week_phl;


       ELSIF OT_Flag = 'R' Then
            tot_rtn :=    total_week_reg +  total_week_hol;
       ELSIF OT_Flag = 'V' Then
            tot_rtn :=    total_week_reg +  total_week_hol  +   total_week_vac  ;
       ELSIF OT_Flag = 'S' Then
            tot_rtn :=    total_week_reg  +  total_week_hol  +  total_week_sick ;
       ELSIF OT_Flag = 'M' Then
            tot_rtn :=    total_week_reg  +  total_week_hol +   total_week_mil ;
       ELSIF OT_Flag = 'P' Then
            tot_rtn :=    total_week_reg  +  total_week_hol +    total_week_pb;
       ELSIF OT_Flag = 'Y' Then
            tot_rtn :=    total_week_reg +  total_week_hol +    total_week_vac + total_week_mil;
       ELSIF OT_Flag = 'L' Then
            tot_rtn :=    total_week_reg +   total_week_vac +   total_week_hol + total_week_sick + total_week_mil;
       ELSIF OT_Flag = 'K' Then
            tot_rtn :=    total_week_reg  +   total_week_vac  +   total_week_hol +  total_week_sick;
      ELSE
           tot_rtn := 0;  --If OT exists then it should not happen. 
       END IF;

      RETURN tot_rtn;

   EXCEPTION
 --        WHEN NO_OT_FLAG THEN
 --             RAISE_APPLICATION_ERROR(-20001,'OT_Flag is not set');
         WHEN OTHERS
        THEN
              RAISE;
   END Total_Week_without_OT;


/*************************************************************************************
* FUNCTION: f_worker_info
*
* PURPOSE:
*  Retrieves information related to the worker that is necessary for
*  performing the validations.  Returns FALSE if no information is found,
*  Returns TRUE otherwise.
*
*  pg_org_code  is package global input
*  pg_worker_id is package global input
*
*************************************************************************************/
   FUNCTION f_worker_info (p_date IN DATE, p_worker OUT lcd.pay_edit.workerinfotype)
      RETURN BOOLEAN
   IS
      wk1_total_hours       lcd.worker_hist.wk1_total_hrs%TYPE        := 0;
      wk2_total_hours       lcd.worker_hist.wk2_total_hrs%TYPE        := 0;
      wk1_ot_weekly_hours   lcd.worker_hist.wk1_ot_weekly_hrs%TYPE    := 0;
      wk2_ot_weekly_hours   lcd.worker_hist.wk2_ot_weekly_hrs%TYPE    := 0;
      wk1_ot_daily_hours    lcd.worker_hist.wk1_ot_daily_hrs%TYPE     := 0;
      wk2_ot_daily_hours    lcd.worker_hist.wk2_ot_daily_hrs%TYPE     := 0;
      wk1_long_day          lcd.worker_hist.wk1_long_day%TYPE         := 0;
      wk2_long_day          lcd.worker_hist.wk2_long_day%TYPE         := 0;
      employee_sub_group    lcd.worker_hist.employee_sub_group%TYPE;
      vendor_id             lcd.worker_hist.vendor_id%TYPE;
      l_sal_curncy_ind      lcd.worker.sal_curncy_ind%TYPE;
      personnel_area        lcd.worker_hist.personnel_area%TYPE;      
      personnel_sub_area    lcd.worker_hist.personnel_sub_area%TYPE;      
      worker_type           lcd.group_subgroup.worker_type%TYPE;
      group_type            lcd.group_subgroup.group_type%TYPE;
      l_ABSENCE_INCREMENT   lcd.worker.ABSENCE_INCREMENT%TYPE;
      l_PROFILE             CHAR(1);
      l_salary_group        VARCHAR2(2);  -- RdW 3/19/2026 INC1247720 "LCD Asia Variable Claims Malaysia"

      NO_OT_FLAG  EXCEPTION;

      CURSOR ctype
      IS
         SELECT NVL (sal_curncy_ind, 'USD'),decode(NVL(ABSENCE_INCREMENT,0),0,1,ABSENCE_INCREMENT),
                NVL(PROFILE,' ') PROFILE,
                NVL(SALARY_GROUP,' ') SALARY_GROUP  -- RdW 3/19/2026 INC1247720 "LCD Asia Variable Claims Malaysia"
           FROM lcd.worker, ITES.IT_ORGANIZATION@LCD_ITES
          WHERE org_code = pg_org_code AND worker_id = pg_worker_id AND
                ORGANIZATIONID = ORG_CODE;


      CURSOR cp_area(p_area varchar2, p_sub_area varchar2)
      IS
         SELECT NVL(RTRIM(override_flag),'N') o_flag, NVL(override_limit,0) o_limit
           FROM lcd.pers_area_subarea   
          WHERE org_code = pg_org_code AND personnel_area = p_area AND
                           personnel_subarea = p_sub_area and
                           p_date >= start_date and p_date <= end_date;


   BEGIN
      pg_end_date := p_date; 

      OPEN ctype;
      FETCH ctype INTO l_sal_curncy_ind,l_ABSENCE_INCREMENT, l_PROFILE, l_salary_group; 

      IF ctype%NOTFOUND
      THEN 
         p_worker.ctry := 'U'; 
         p_worker.currency := 'USD';
      ELSIF RPAD (l_sal_curncy_ind, 3) = 'USD'
      THEN
         p_worker.ctry := 'U'; 
         p_worker.currency := 'USD';
      ELSE
         p_worker.currency := l_sal_curncy_ind;
         p_worker.ctry := 'N'; 
      END IF;

      p_worker.ABSENCE_INCREMENT := l_ABSENCE_INCREMENT;
      p_worker.PROFILE := l_PROFILE;
      p_worker.salary_group := l_salary_group;
      p_worker.is_malaysia_a60 := (pg_org_code = 'A60');

      CLOSE ctype;

      SELECT allocation_rule, wk1_total_hrs, wk2_total_hrs,
             NVL (wk1_ot_weekly_hrs, 0), NVL (wk2_ot_weekly_hrs, 0),
             NVL (wk1_ot_daily_hrs, 0), NVL (wk2_ot_daily_hrs, 0),
             wk1_long_day, wk2_long_day, employee_sub_group,
             NVL (RTRIM (vendor_id), 'NONE'), NVL (standard_week, 'S'),
             NVL (work_state, ' '),
                RTRIM (gems_business_area)
             || gems_cost_center,
             NVL(personnel_area,' '), 
             NVL(personnel_sub_area,' '), 
             NVL(g.worker_type,' '), NVL(g.group_type,' ')
        INTO p_worker.allocation_rule, wk1_total_hours, wk2_total_hours,
             wk1_ot_weekly_hours, wk2_ot_weekly_hours,
             wk1_ot_daily_hours, wk2_ot_daily_hours,
             wk1_long_day, wk2_long_day, employee_sub_group,
             vendor_id, p_worker.standard_week,
             p_worker.work_state,
             p_worker.dept,
             personnel_area,
             personnel_sub_area,
             worker_type, group_type
        FROM lcd.worker_hist H, lcd.group_subgroup G
       WHERE H.org_code = pg_org_code
         AND G.org_code = pg_org_code
         AND G.worker_group = H.employee_group
         AND G.worker_sub_group = H.employee_sub_group
         AND worker_id = pg_worker_id
         AND actual_date = (SELECT MAX (actual_date)
                              FROM lcd.worker_hist
                             WHERE actual_date <= p_date
                               AND org_code = pg_org_code
                               AND worker_id = pg_worker_id);

     IF (wk1_ot_weekly_hours + wk1_ot_daily_hours) > 0  or
        (wk2_ot_weekly_hours + wk2_ot_daily_hours)  > 0
     THEN
         SELECT nvl(ot_flag,'N')   
             INTO p_worker.ot_flag
           FROM lcd.allocation_rule
          WHERE org_code = pg_org_code AND
                       allocation_rule = p_worker.allocation_rule;

         IF p_worker.ot_flag = 'N' then
              RAISE NO_OT_FLAG;
         END IF;
     END IF;

      p_worker.ave_weekly_hours := (wk1_total_hours + wk2_total_hours) / 10;

      IF worker_type = 'E' THEN 
         p_worker.ee_type := 'E'; 
      ELSIF worker_type = 'A' THEN
         p_worker.ee_type := 'A'; 
      ELSIF group_type = 'U' OR SUBSTR(personnel_sub_area,1,1) = 'U' THEN
         p_worker.ee_type := 'U'; 
      ELSE
         p_worker.ee_type := 'N'; 
      END IF;

      IF pay_week_1_or_2 (p_date) = 1 THEN
         p_worker.total_hours := wk1_total_hours;
         p_worker.ot_daily_hours := wk1_ot_daily_hours;
         p_worker.ot_weekly_hours := wk1_ot_weekly_hours;
         p_worker.long_day := wk1_long_day;
      ELSE
         p_worker.total_hours := wk2_total_hours;
         p_worker.ot_daily_hours := wk2_ot_daily_hours;
         p_worker.ot_weekly_hours := wk2_ot_weekly_hours;
         p_worker.long_day := wk2_long_day;
      END IF;

      FOR rp_area IN cp_area(personnel_area,personnel_sub_area) LOOP
         IF rp_area.o_flag IN ('U','B') THEN
            IF (p_worker.ctry = 'U' AND (p_worker.ee_type = 'H' or p_worker.ee_type = 'N' )) OR p_worker.ctry != 'U' THEN
               p_worker.ee_type := 'U'; 
            END IF; 
         END IF;
         IF rp_area.o_flag IN ('H','B') THEN
            override_holiday := 'Y'; 
            override_holiday_limits := rp_area.o_limit;
         END IF;
      END LOOP;

      IF vendor_id = 'NONE' THEN 
         p_worker.contractor := FALSE;
      ELSE
         p_worker.contractor := TRUE;
      END IF;

      RETURN TRUE;
   EXCEPTION
      WHEN NO_OT_FLAG THEN RETURN FALSE;
      WHEN NO_DATA_FOUND THEN RETURN FALSE;
      WHEN OTHERS THEN RAISE;
   END f_worker_info;

   FUNCTION f_get_worker_balance (p_balance OUT balancerecordtype) RETURN BOOLEAN IS
   BEGIN
      SELECT NVL (sick_bal_hrs, 0), NVL (vac_bal_hrs, 0), NVL (hol_used_hrs, 0),
             NVL (per_lv_bal_hrs, 0), NVL (mil_lv_bal_hrs, 0),
             NVL (fml_lv_bal_hrs, 0), NVL (ccl_bal_hrs, 0),
             NVL (mlv_bal_hrs, 0), NVL (plv_bal_hrs, 0),
             NVL (sl_bal_hrs, 0), NVL (lsl_bal_hrs, 0),
             NVL (fl_bal_hrs, 0), NVL (fcl_bal_hrs, 0),
             NVL (sab_bal_hrs, 0), NVL (csl_bal_hrs, 0),
             NVL (rlv_bal_hrs, 0), NVL (xsl_bal_hrs, 0),
             NVL (til_bal_hrs, 0), NVL (par_bal_hrs, 0),
             NVL (xhl_bal_hrs, 0), NVL (jub_bal_hrs, 0),
             NVL (flx_bal_hrs, 0), NVL (ofx_bal_hrs, 0),
             NVL (mlx_bal_hrs, 0), NVL (mle_bal_hrs, 0),
             NVL (mls_bal_hrs, 0), NVL (spn_bal_hrs, 0),
             NVL (dis_bal_hrs, 0), NVL (bvl_bal_hrs, 0),
             NVL (tlv_bal_hrs, 0), NVL (phl_bal_hrs, 0)
        INTO p_balance
        FROM lcd.worker
       WHERE org_code = pg_org_code AND worker_id = pg_worker_id;
      RETURN TRUE;
   EXCEPTION
      WHEN NO_DATA_FOUND THEN RETURN FALSE;
      WHEN OTHERS THEN RAISE;
   END f_get_worker_balance;

   PROCEDURE record_error (
      p_error_count    IN OUT   INTEGER,
      p_error_line     IN OUT   lcd.pay_edit.errorlinetype,
      p_error_number   IN OUT   lcd.pay_edit.ERRORNUMTYPE,
      p_error_day      IN       INTEGER,
      p_error_data     IN       VARCHAR2
   ) IS
   BEGIN
      p_error_count := NVL(p_error_count,0) + 1;
      p_error_line (p_error_count) := NVL (p_error_day, 0);
      p_error_number (p_error_count) := p_error_data;
   END record_error;

   FUNCTION charge_authorized (pc_timetype IN VARCHAR2, pc_dept IN VARCHAR2, pc_date IN DATE) RETURN BOOLEAN IS
      param_string   VARCHAR2 (400);
      l_auth_ret     VARCHAR2 (50)  := 'YES';
      l_ret_cd       INTEGER;
   BEGIN
      IF RTRIM (pg_worker_id) IS NOT NULL THEN param_string := param_string || 'WID=' || pg_worker_id || ','; END IF;
      IF RTRIM (pc_dept) IS NOT NULL THEN param_string := param_string || 'DEPT=' || pc_dept || ','; END IF;
      IF RTRIM (pc_timetype) IS NOT NULL THEN param_string := param_string || 'TIME_TYPE=' || pc_timetype || ','; END IF;

      l_ret_cd := pkg_default.f_get_override (pg_org_code, RTRIM (pg_worker_id), 'TIMEAUTH', param_string, pc_date, NULL, pc_timetype, l_auth_ret);
      IF l_auth_ret = 'NO' THEN RETURN FALSE; ELSE RETURN TRUE; END IF;
   END charge_authorized;

   PROCEDURE analyze_limits (
      pa_currency       IN       VARCHAR2,
      pa_work_state     IN       VARCHAR2,
      pa_dept           IN       VARCHAR2,
      pa_date           IN       DATE,
      pa_error_count    IN OUT   INTEGER,
      pa_error_line     IN OUT   lcd.pay_edit.errorlinetype,
      pa_error_number   IN OUT   lcd.pay_edit.ERRORNUMTYPE
   ) IS
      icnt BINARY_INTEGER; iloop BINARY_INTEGER; idcnt BINARY_INTEGER;
      TYPE totaltype IS RECORD (hours NUMBER);
      TYPE totalarraytype IS TABLE OF totaltype INDEX BY BINARY_INTEGER;
      total_array totalarraytype; ltype VARCHAR2 (4); l_dlimit NUMBER; l_wlimit NUMBER;
      l_unused_read1 VARCHAR2 (5); l_unused_read2 VARCHAR2 (5); ltotalhrs NUMBER;

      CURSOR climit (p_type IN VARCHAR2) IS
         SELECT DECODE (RPAD (work_state, 5), '     ', 'aaaaa', work_state),
                DECODE (RPAD (currency_ind, 5), '     ', 'aaaaa', currency_ind),
                NVL (daily_limit, 0), NVL (weekly_limit, 0)
           FROM lcd.time_limits
          WHERE org_code = pg_org_code AND att_abs_type = p_type
            AND (currency_ind = pa_currency OR currency_ind = '*' OR RPAD (currency_ind, 1) = ' ')
            AND (work_state = pa_work_state OR work_state = '*' OR work_state = ' ')
            AND pa_date <= end_date AND pa_date >= start_date
       ORDER BY 2 DESC, 1 DESC;
   BEGIN
      icnt := att_array.FIRST;
      WHILE icnt IS NOT NULL LOOP
         ltype := att_array (icnt).atype; iloop := icnt; total_array.DELETE; ltotalhrs := 0;
         WHILE iloop IS NOT NULL LOOP
            IF att_array (iloop).atype = ltype THEN
               ltotalhrs := ltotalhrs + att_array (iloop).hours;
               IF total_array.EXISTS (att_array (iloop).DAY) THEN
                  total_array (att_array (iloop).DAY).hours := total_array (att_array (iloop).DAY).hours + att_array (iloop).hours;
               ELSE
                  total_array (att_array (iloop).DAY).hours := att_array (iloop).hours;
               END IF;
               att_array.DELETE (iloop);
            END IF;
            iloop := att_array.NEXT (iloop);
         END LOOP;

         OPEN climit (ltype);
         FETCH climit INTO l_unused_read1, l_unused_read2, l_dlimit, l_wlimit;
         IF climit%FOUND THEN
            IF l_wlimit > 0 AND ltotalhrs > l_wlimit THEN
               record_error (pa_error_count, pa_error_line, pa_error_number, 0, 86000094);
            END IF;
            IF l_dlimit > 0 THEN
               FOR idcnt IN 1 .. 7 LOOP
                  IF total_array.EXISTS (idcnt) THEN
                     IF total_array (idcnt).hours > l_dlimit THEN
                        record_error (pa_error_count, pa_error_line, pa_error_number, idcnt, 86000095);
                     END IF;
                  END IF;
               END LOOP;
            END IF;
         END IF;
         CLOSE climit;

         IF ltotalhrs > 0 THEN
            FOR idcnt IN 1 .. 7 LOOP
               IF total_array.EXISTS (idcnt) THEN
                  IF total_array (idcnt).hours > 0 THEN
                     IF NOT charge_authorized (ltype, pa_dept, pa_date) THEN
                        record_error (pa_error_count, pa_error_line, pa_error_number, idcnt, 86000096);
                     END IF;
                  END IF;
               END IF;
            END LOOP;
         END IF;
         icnt := att_array.NEXT (icnt);
      END LOOP;
   END analyze_limits;

  PROCEDURE validate(p_org_code IN LCD.WORKER_HIST.ORG_CODE%TYPE := '111',
            p_worker_id  IN LCD.WORKER.WORKER_ID%TYPE := 'AAAAAAAAAA',
            p_end_date   IN DATE := '11-NOV-97',
            p_size      IN INTEGER,
            p_array_abs_type IN lcd.pay_edit.AbsType,
            p_array_wo_num IN lcd.pay_edit.WoType,
            p_array_dept IN lcd.pay_edit.DeptStrType,
            p_array_time IN lcd.pay_edit.TimeStrType,
            p_error_count IN OUT INTEGER,
            p_error_line IN OUT lcd.pay_edit.ErrorLineType,
            p_error_number IN OUT lcd.pay_edit.ErrorNumType) IS
      time_array lcd.pay_edit.TIMEARRAYTYPE; time_val NUMBER; t_cnt INTEGER := 0;
      no_error_flag BOOLEAN := TRUE; accum_reg INTEGER; l_errNBR NUMBER; l_max_daily_hours number := 24;
      a_start_date DATE; a_end_date DATE; b_break BOOLEAN;
      sysdate_ymd varchar2(15); we_ymd varchar2(15); i INTEGER; lv_CutOffDate varchar2(15); strCutOff VARCHAR2(20);

      CURSOR c_CutOff(org_id varchar2, wdate varchar2, caldate varchar2) IS
      SELECT DAYOFWEEK, CALENDARDATE, CUTOFFDATE FROM ITES.IT_CALENDAR @LCD_ITES
      WHERE ORGANIZATIONID = org_id and WEEKENDINGDATE = wdate and CALENDARDATE = caldate;
      r_CutOff c_CutOff%ROWTYPE;

     CURSOR ct_cur(pi_organizationid varchar2, pi_weekendingdate varchar2) IS 
     SELECT calendardate, NVL(CutOffDate, pi_weekendingdate) CutOffDate FROM ites.it_Calendar @LCD_ITES
      WHERE weekendingdate = pi_weekendingdate and organizationid = pi_organizationid; 

      TYPE Pcalendar_ty IS TABLE OF ites.it_calendar.calendardate@LCD_ITES%type INDEX BY BINARY_INTEGER;
      cTable Pcalendar_ty; 

   BEGIN
         todayidx := 7; cutoffidx := 7; we_ymd := to_char(p_end_date,'yyyymmdd'); sysdate_ymd := TO_CHAR(SYSDATE,'YYYYMMDD');
          OPEN c_CutOff (p_org_code, we_ymd, sysdate_ymd);
          fetch c_CutOff into r_CutOff;
            if c_CutOff%FOUND then todayidx := r_CutOff.dayofweek; lv_CutOffDate := r_CutOff.cutoffdate; end if;
          close c_CutOff;

      if ( NVL(lv_CutOffDate, ' ') = ' ' ) then cutoffidx := 7; else
              i := 0;
              FOR ct_rec IN ct_cur(p_org_code, we_ymd) LOOP  
                 i := i + 1; IF i = 1 THEN strCutOff := ct_rec.CutOffDate; END IF; 
                 cTable(i) := ct_rec.calendardate;
              END LOOP;
              For i IN 1..7 loop IF cTable(i) = strCutOff THEN cutoffidx := i; EXIT; END IF; END LOOP;
      end if;

      total_hours := 0; total_week_reg := 0; total_week_upd := 0; total_week_updNQ := 0; total_week_ot := 0;
      total_week_dbl := 0; total_week_fml := 0; total_week_vac := 0; total_week_sick := 0; total_week_lv := 0;
      total_week_hol := 0; total_week_mil := 0; total_week_pb := 0; total_week_ccl := 0; total_week_mlv := 0; 
      total_week_plv := 0; total_week_sl := 0; total_week_lsl := 0; total_week_fl := 0; total_week_fcl := 0;
      total_week_sab := 0; total_week_csl := 0; total_week_rlv := 0; total_week_xsl := 0; total_week_til := 0; 
      total_week_par := 0; total_week_xhl := 0; total_week_jub := 0; total_week_flx := 0; total_week_ofx := 0;
      total_week_mlx := 0; total_week_mle := 0; total_week_mls := 0; total_week_spn := 0; total_week_dis := 0;
      total_week_bvl := 0; total_week_tlv := 0; total_week_phl := 0;

      accum_reg := 0; clear_tables; pg_org_code := p_org_code; pg_worker_id := p_worker_id;
      get_max_daily_hours (l_max_daily_hours);

      FOR cnt IN 1 .. p_size LOOP
         FOR s_cnt IN 0 .. 6 LOOP
            time_val := (TO_NUMBER (SUBSTR (p_array_time (cnt), ((s_cnt * 4) + 1), 4))) / 100;
            IF time_val > 0 THEN
               t_cnt := t_cnt + 1;
               time_array (t_cnt).att_abs_type := p_array_abs_type (cnt);
               time_array (t_cnt).wo_num := p_array_wo_num (cnt);
               time_array (t_cnt).DAY := s_cnt + 1;
               time_array (t_cnt).dept := p_array_dept (cnt);
               time_array (t_cnt).hours := time_val;
               tally (time_array (t_cnt));
               collect_limits (time_array (t_cnt).att_abs_type, time_array (t_cnt).dept, time_array (t_cnt).hours, time_array (t_cnt).DAY);
            END IF;
         END LOOP;
      END LOOP;

      FOR cnt IN 1 .. p_size LOOP
         Select start_date, end_date Into a_start_date, a_end_date From lcd.Att_Abs_Type
          Where org_code = pg_org_code and att_abs_type = p_array_abs_type (cnt);
         b_break := False;
         FOR s_cnt IN 0 .. 6 LOOP
            time_val := (TO_NUMBER (SUBSTR (p_array_time (cnt), ((s_cnt * 4) + 1), 4))) / 100;
            IF time_val > 0 THEN 
               IF p_end_date - 6 + s_cnt < a_start_date Then
                  record_error (p_error_count, p_error_line, p_error_number, 0, 37000847 ); 
                  b_break := TRUE;          
               End IF;  
               Exit WHEN b_break;
            END IF;
         END LOOP;

         b_break := False;
         FOR s_cnt IN 0 .. 6 LOOP
            time_val := (TO_NUMBER (SUBSTR (p_array_time (cnt), ((s_cnt * 4) + 1), 4))) / 100;
            IF time_val > 0 THEN 
               IF p_end_date - 6 + s_cnt > a_end_date Then
                  record_error (p_error_count, p_error_line, p_error_number, 0, 37000846 );           
                  b_break := TRUE;          
               End IF;  
               Exit WHEN b_break;
            END IF;
         END LOOP;
      END LOOP;

      IF f_worker_info (p_end_date, worker_info) THEN
         analyze_limits (worker_info.currency, worker_info.work_state, worker_info.dept, p_end_date, p_error_count, p_error_line, p_error_number); 

         is_override := f_is_override_rule_applies(pg_org_code, pg_end_date);
         IF NOT (is_override) THEN
            IF (pg_org_code = 'A76') AND (worker_info.ABSENCE_INCREMENT > 0) THEN
               worker_info.ABSENCE_INCREMENT := worker_info.long_day / 2.0;
            END IF;
         END IF;

         f_eoyshutdowninfo(pg_org_code, pg_end_date);

          IF worker_info.ctry = 'U' AND worker_info.ee_type = 'N' AND worker_info.work_state != 'CA' AND total_week_dbl > 0 Then
               record_error (p_error_count, p_error_line, p_error_number, 0, 86000104);
             RETURN; 
          End If;

         IF (worker_info.ctry = 'U' AND worker_info.ot_weekly_hours > 0 AND Total_Week_without_OT(worker_info.OT_Flag) > worker_info.ot_weekly_hours)
            OR (worker_info.ctry != 'U' AND worker_info.ee_type != 'A' AND worker_info.ot_weekly_hours > 0 AND Total_Week_without_OT(worker_info.OT_Flag) > worker_info.ot_weekly_hours) THEN
            record_error (p_error_count, p_error_line, p_error_number, 0, 86000017);
         END IF;

         IF worker_info.ot_weekly_hours + worker_info.ot_daily_hours = 0 AND total_week_ot > 0 THEN
            record_error (p_error_count, p_error_line, p_error_number, 0, 86000090);
         END IF;

--RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026
         IF pg_org_code IN ('A00', 'A80') THEN
            IF total_week_sg3100 > 0 THEN
               IF total_week_sg3100 > 1.0 OR total_week_sg3110 > 0 OR total_week_sg3120 > 0 THEN
                  record_error (p_error_count, p_error_line, p_error_number, 0, 86000275);
               END IF;
            END IF;
         END IF;
--RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026

         IF worker_info.ee_type = 'E' OR worker_info.ee_type = 'A' THEN
            IF (total_week_upd > worker_info.total_hours) AND worker_info.contractor = FALSE THEN
               record_error (p_error_count, p_error_line, p_error_number, 0, 86000022);
            END IF;
         ELSE 
            IF worker_info.ee_type != 'U' AND worker_info.work_state = 'CA' AND worker_info.ot_daily_hours + worker_info.ot_weekly_hours > 0
                AND Total_Day_without_OT(worker_info.OT_Flag, 1) > 0 AND Total_Day_without_OT(worker_info.OT_Flag, 2) > 0
                AND Total_Day_without_OT(worker_info.OT_Flag, 3) > 0 AND Total_Day_without_OT(worker_info.OT_Flag, 4) > 0
                AND Total_Day_without_OT(worker_info.OT_Flag, 5) > 0 AND Total_Day_without_OT(worker_info.OT_Flag, 6) > 0
                AND total_day_reg (7) > 0 THEN
               record_error (p_error_count, p_error_line, p_error_number, 7, 86000093);
            END IF;

            IF worker_info.ee_type != 'U' AND worker_info.work_state = 'CA' AND worker_info.ot_daily_hours + worker_info.ot_weekly_hours > 0
                AND Total_Day_without_OT(worker_info.OT_Flag, 1) > 0 AND Total_Day_without_OT(worker_info.OT_Flag, 2) > 0
                AND Total_Day_without_OT(worker_info.OT_Flag, 3) > 0 AND Total_Day_without_OT(worker_info.OT_Flag, 4) > 0
                AND Total_Day_without_OT(worker_info.OT_Flag, 5) > 0 AND Total_Day_without_OT(worker_info.OT_Flag, 6) > 0
                AND Total_day_reg (7) = 0 AND (total_day_ot (7) - Total_day_dbl(7) > 8 OR ((total_day_ot (7) - Total_day_dbl(7) < 8) AND Total_day_dbl(7) > 0)) THEN
               record_error (p_error_count, p_error_line, p_error_number, 7, 86000193);
            END IF;
         END IF;

         FOR cnt IN 1 .. 7 LOOP 
            IF (is_override) THEN
             worker_info.ABSENCE_INCREMENT := wi_ovrr_abs_inc(cnt);
             worker_info.long_day := wi_ovrr_long_day(cnt);
            END IF;

            accum_reg := accum_reg + total_day_reg(cnt) + total_day_hol(cnt);
            no_error_flag := TRUE;

            IF total_day (cnt) > l_max_daily_hours THEN
               record_error (p_error_count, p_error_line, p_error_number, cnt, 86000037);
            END IF;

--RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026
            IF pg_org_code = 'A60' THEN
               -- Daily Cap Check (12 hrs cap; excluding PH hours if PH 8000 applied)
               IF total_day_my3050(cnt) > 0 OR total_day_my3060(cnt) > 0 THEN
                  IF (total_day(cnt) - total_day_phl(cnt)) > 12.0 THEN
                     record_error (p_error_count, p_error_line, p_error_number, cnt, 86000273);
                  END IF;
               ELSE
                  IF total_day(cnt) > 12.0 THEN
                     record_error (p_error_count, p_error_line, p_error_number, cnt, 86000273);
                  END IF;
               END IF;

               -- Overtime 3010 / 3011 Rules
               IF total_day_my3010(cnt) > 0 THEN
                  IF total_day_reg(cnt) = 0 THEN
                     record_error (p_error_count, p_error_line, p_error_number, cnt, 86000270);
                  END IF;
                  IF total_day_my3020(cnt) > 0 OR total_day_my3030(cnt) > 0 OR total_day_my3040(cnt) > 0 OR total_day_my3050(cnt) > 0 OR total_day_my3060(cnt) > 0 THEN
                     record_error (p_error_count, p_error_line, p_error_number, cnt, 86000270);
                  END IF;
               END IF;

               IF total_day_my3011(cnt) > 0 THEN
                  IF total_day_my3020(cnt) > 0 OR total_day_my3030(cnt) > 0 OR total_day_my3040(cnt) > 0 OR total_day_my3050(cnt) > 0 OR total_day_my3060(cnt) > 0 THEN
                     record_error (p_error_count, p_error_line, p_error_number, cnt, 86000270);
                  END IF;
               END IF;

               -- Rest Day Overtime 3020 / 3030 / 3040 Rules
               IF total_day_my3020(cnt) > 0 OR total_day_my3030(cnt) > 0 OR total_day_my3040(cnt) > 0 THEN
                  IF total_day_my3020(cnt) = 0 THEN
                     record_error (p_error_count, p_error_line, p_error_number, cnt, 86000271);
                  END IF;
                  IF total_day_my3010(cnt) > 0 OR total_day_my3050(cnt) > 0 OR total_day_my3060(cnt) > 0 THEN
                     record_error (p_error_count, p_error_line, p_error_number, cnt, 86000271);
                  END IF;
               END IF;

               -- Public Holiday Overtime 3050 / 3060 Rules
               IF total_day_my3050(cnt) > 0 OR total_day_my3060(cnt) > 0 THEN
                  IF total_day_phl(cnt) = 0 THEN
                     record_error (p_error_count, p_error_line, p_error_number, cnt, 86000272);
                  END IF;
                  IF total_day_my3060(cnt) > 0 AND total_day_my3050(cnt) = 0 THEN
                     record_error (p_error_count, p_error_line, p_error_number, cnt, 86000272);
                  END IF;
                  IF total_day_my3010(cnt) > 0 OR total_day_my3020(cnt) > 0 OR total_day_my3030(cnt) > 0 OR total_day_my3040(cnt) > 0 THEN
                     record_error (p_error_count, p_error_line, p_error_number, cnt, 86000272);
                  END IF;
               END IF;
            END IF;

            IF pg_org_code IN ('A00', 'A80') THEN
               -- Unit exactness validation (must be 1.0 unit)
               IF (total_day_sg3100(cnt) > 0 AND total_day_sg3100(cnt) != 1.0) OR
                  (total_day_sg3110(cnt) > 0 AND total_day_sg3110(cnt) != 1.0) OR
                  (total_day_sg3120(cnt) > 0 AND total_day_sg3120(cnt) != 1.0) THEN
                  record_error (p_error_count, p_error_line, p_error_number, cnt, 86000274);
               END IF;

               -- Weekday (3110) vs Weekend (3120) Day checks
               IF cnt IN (1, 2) AND total_day_sg3110(cnt) > 0 THEN
                  record_error (p_error_count, p_error_line, p_error_number, cnt, 86000276);
               END IF;
               IF cnt IN (3, 4, 5, 6, 7) AND total_day_sg3120(cnt) > 0 THEN
                  record_error (p_error_count, p_error_line, p_error_number, cnt, 86000276);
               END IF;

               -- Daily Overlap restriction (Max 1 unit/day total SA & SB)
               IF (total_day_sg3100(cnt) + total_day_sg3110(cnt) + total_day_sg3120(cnt)) > 1.0 THEN
                  record_error (p_error_count, p_error_line, p_error_number, cnt, 86000277);
               END IF;
            END IF;
--RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026

          IF (worker_info.ctry = 'U') THEN
            If total_day(cnt) - total_day_ot(cnt) - total_day_reg(cnt) > 0 AND total_day_hol(cnt) = 0 AND total_day(cnt) > worker_info.long_day THEN
               record_error (p_error_count, p_error_line, p_error_number, cnt, 86000012);
            END IF;
          END IF;

            IF worker_info.ABSENCE_INCREMENT <> 1 THEN
                IF MOD(total_day_hol (cnt),worker_info.ABSENCE_INCREMENT) <> 0 THEN
                     no_error_flag := FALSE; record_error (p_error_count, p_error_line, p_error_number, cnt, 86000101);
                END IF; 
                IF MOD(total_day_vac (cnt),worker_info.ABSENCE_INCREMENT) <> 0 THEN
                     no_error_flag := FALSE; record_error (p_error_count, p_error_line, p_error_number, cnt, 86000101);
                END IF; 
                IF MOD(total_day_sick (cnt),worker_info.ABSENCE_INCREMENT) <> 0 THEN
                     no_error_flag := FALSE; record_error (p_error_count, p_error_line, p_error_number, cnt, 86000101);
                END IF;
                IF MOD(total_day_fml(cnt),worker_info.ABSENCE_INCREMENT) <> 0 THEN
                     no_error_flag := FALSE; record_error (p_error_count, p_error_line, p_error_number, cnt, 86000101);
                END IF;
                IF MOD(total_day_PB (cnt),worker_info.ABSENCE_INCREMENT) <> 0 THEN
                     no_error_flag := FALSE; record_error (p_error_count, p_error_line, p_error_number, cnt, 86000101);
                END IF;
                IF MOD(total_day_ccl (cnt),worker_info.ABSENCE_INCREMENT) <> 0 THEN
                     no_error_flag := FALSE; record_error (p_error_count, p_error_line, p_error_number, cnt, 86000101);
                END IF;
                IF MOD(total_day_mlv (cnt),worker_info.ABSENCE_INCREMENT) <> 0 THEN
                     no_error_flag := FALSE; record_error (p_error_count, p_error_line, p_error_number, cnt, 86000101);
                END IF; 
                IF MOD(total_day_plv (cnt),worker_info.ABSENCE_INCREMENT) <> 0 THEN
                     no_error_flag := FALSE; record_error (p_error_count, p_error_line, p_error_number, cnt, 86000101);
                END IF;
                IF MOD(total_day_sl (cnt),worker_info.ABSENCE_INCREMENT) <> 0 THEN
                     no_error_flag := FALSE; record_error (p_error_count, p_error_line, p_error_number, cnt, 86000101);
                END IF;
                IF MOD(total_day_lsl (cnt),worker_info.ABSENCE_INCREMENT) <> 0 THEN
                     no_error_flag := FALSE; record_error (p_error_count, p_error_line, p_error_number, cnt, 86000101);
                END IF;
                IF MOD(total_day_fl (cnt),worker_info.ABSENCE_INCREMENT) <> 0 THEN
                     no_error_flag := FALSE; record_error (p_error_count, p_error_line, p_error_number, cnt, 86000101);
                END IF;
                IF MOD(total_day_fcl (cnt),worker_info.ABSENCE_INCREMENT) <> 0 THEN
                     no_error_flag := FALSE; record_error (p_error_count, p_error_line, p_error_number, cnt, 86000101);
                END IF;
                IF MOD(total_day_sab (cnt),worker_info.ABSENCE_INCREMENT) <> 0 THEN
                     no_error_flag := FALSE; record_error (p_error_count, p_error_line, p_error_number, cnt, 86000101);
                END IF;
                IF MOD(total_day_csl (cnt),worker_info.ABSENCE_INCREMENT) <> 0 THEN
                     no_error_flag := FALSE; record_error (p_error_count, p_error_line, p_error_number, cnt, 86000101);
                END IF;
                IF MOD(total_day_rlv (cnt),worker_info.ABSENCE_INCREMENT) <> 0 THEN
                     no_error_flag := FALSE; record_error (p_error_count, p_error_line, p_error_number, cnt, 86000101);
                END IF;
                IF MOD(total_day_xsl (cnt),worker_info.ABSENCE_INCREMENT) <> 0 THEN
                     no_error_flag := FALSE; record_error (p_error_count, p_error_line, p_error_number, cnt, 86000101);
                END IF;
                IF MOD(total_day_til (cnt),worker_info.ABSENCE_INCREMENT) <> 0 THEN
                     no_error_flag := FALSE; record_error (p_error_count, p_error_line, p_error_number, cnt, 86000101);
                END IF;
                IF MOD(total_day_par (cnt),worker_info.ABSENCE_INCREMENT) <> 0 THEN
                     no_error_flag := FALSE; record_error (p_error_count, p_error_line, p_error_number, cnt, 86000101);
                END IF;
                IF MOD(total_day_xhl (cnt),worker_info.ABSENCE_INCREMENT) <> 0 THEN
                     no_error_flag := FALSE; record_error (p_error_count, p_error_line, p_error_number, cnt, 86000101);
                END IF;
                IF MOD(total_day_jub (cnt),worker_info.ABSENCE_INCREMENT) <> 0 THEN
                     no_error_flag := FALSE; record_error (p_error_count, p_error_line, p_error_number, cnt, 86000101);
                END IF;
                IF MOD(total_day_flx (cnt),worker_info.ABSENCE_INCREMENT) <> 0 THEN
                     no_error_flag := FALSE; record_error (p_error_count, p_error_line, p_error_number, cnt, 86000101);
                END IF;
                IF MOD(total_day_ofx (cnt),worker_info.ABSENCE_INCREMENT) <> 0 THEN
                     no_error_flag := FALSE; record_error (p_error_count, p_error_line, p_error_number, cnt, 86000101);
                END IF;
                IF MOD(total_day_mlx (cnt),worker_info.ABSENCE_INCREMENT) <> 0 THEN
                     no_error_flag := FALSE; record_error (p_error_count, p_error_line, p_error_number, cnt, 86000101);
                END IF;
                IF MOD(total_day_mle (cnt),worker_info.ABSENCE_INCREMENT) <> 0 THEN
                     no_error_flag := FALSE; record_error (p_error_count, p_error_line, p_error_number, cnt, 86000101);
                END IF;
                IF MOD(total_day_mls (cnt),worker_info.ABSENCE_INCREMENT) <> 0 THEN
                     no_error_flag := FALSE; record_error (p_error_count, p_error_line, p_error_number, cnt, 86000101);
                END IF;
                IF MOD(total_day_spn (cnt),worker_info.ABSENCE_INCREMENT) <> 0 THEN
                     no_error_flag := FALSE; record_error (p_error_count, p_error_line, p_error_number, cnt, 86000101);
                END IF;
                IF MOD(total_day_dis (cnt),worker_info.ABSENCE_INCREMENT) <> 0 THEN
                     no_error_flag := FALSE; record_error (p_error_count, p_error_line, p_error_number, cnt, 86000101);
                END IF;
                IF MOD(total_day_bvl (cnt),worker_info.ABSENCE_INCREMENT) <> 0 THEN
                     no_error_flag := FALSE; record_error (p_error_count, p_error_line, p_error_number, cnt, 86000101);
                END IF;
                IF MOD(total_day_tlv (cnt),worker_info.ABSENCE_INCREMENT) <> 0 THEN
                     no_error_flag := FALSE; record_error (p_error_count, p_error_line, p_error_number, cnt, 86000101);
                END IF;
                IF MOD(total_day_phl (cnt),worker_info.ABSENCE_INCREMENT) <> 0 THEN
                     no_error_flag := FALSE; record_error (p_error_count, p_error_line, p_error_number, cnt, 86000101);
                END IF;
               IF ((pg_org_code = 'A76') AND (MOD(total_day_mil (cnt),worker_info.ABSENCE_INCREMENT) <> 0)) THEN
                     no_error_flag := FALSE; record_error (p_error_count, p_error_line, p_error_number, cnt, 86000101);
               END IF;           
               IF ((pg_org_code = 'A76') AND (MOD(total_day_lv (cnt),worker_info.ABSENCE_INCREMENT) <> 0)) THEN
                     no_error_flag := FALSE; record_error (p_error_count, p_error_line, p_error_number, cnt, 86000101);
               END IF;   
                IF MOD(total_day_other (cnt),worker_info.ABSENCE_INCREMENT) <> 0 THEN
                     no_error_flag := FALSE; record_error (p_error_count, p_error_line, p_error_number, cnt, 86000101);
                END IF;  
            End IF; 

            If (worker_info.ee_type = 'E' or worker_info.ee_type = 'A') AND worker_info.standard_week = 'S' AND
                total_day_upd(cnt) > 0 AND total_day_upd_fml(cnt) = 0 AND total_day_upd(cnt) <> worker_info.long_day THEN
               record_error (p_error_count, p_error_line, p_error_number, cnt, 86000031); 
            END IF;

            IF (cnt != 7 OR (cnt = 7 AND (Total_Day_without_OT(worker_info.OT_Flag, 1) = 0 OR Total_Day_without_OT(worker_info.OT_Flag, 2) = 0
                                OR Total_Day_without_OT(worker_info.OT_Flag, 3) = 0 OR Total_Day_without_OT(worker_info.OT_Flag, 4) = 0
                                OR Total_Day_without_OT(worker_info.OT_Flag, 5) = 0 OR Total_Day_without_OT(worker_info.OT_Flag, 6) = 0)))
                AND worker_info.ee_type != 'U' and worker_info.ee_type != 'E' AND worker_info.work_state = 'CA'
                AND worker_info.ot_daily_hours + worker_info.ot_weekly_hours > 0
                AND (Total_Day_without_OT(worker_info.OT_Flag, cnt) - total_day_hol(cnt) + (total_day_ot (cnt) - total_day_dbl(cnt))) > 12 THEN
               record_error (p_error_count, p_error_line, p_error_number, cnt, 86000099);
            END IF;

            IF (cnt != 7 OR (cnt = 7 AND (Total_Day_without_OT(worker_info.OT_Flag, 1) = 0 OR Total_Day_without_OT(worker_info.OT_Flag, 2) = 0
                                OR Total_Day_without_OT(worker_info.OT_Flag, 3) = 0 OR Total_Day_without_OT(worker_info.OT_Flag, 4) = 0
                                OR Total_Day_without_OT(worker_info.OT_Flag, 5) = 0 OR Total_Day_without_OT(worker_info.OT_Flag, 6) = 0)))
                AND worker_info.ee_type != 'U' and worker_info.ee_type != 'E' AND worker_info.work_state = 'CA'
                AND worker_info.ot_daily_hours + worker_info.ot_weekly_hours > 0 AND total_day_hol (cnt) > 0
                AND total_day_without_ot(worker_info.OT_Flag,cnt) - total_day_hol(cnt) = 0 AND total_day_dbl (cnt) > 0 
                AND (total_day_ot (cnt) - total_day_dbl(cnt)) < 12 THEN
               record_error (p_error_count, p_error_line, p_error_number, cnt, 86000102);
            END IF;

            IF (cnt != 7 OR (cnt = 7 AND (Total_Day_without_OT(worker_info.OT_Flag, 1) = 0 OR Total_Day_without_OT(worker_info.OT_Flag, 2) = 0
                                OR Total_Day_without_OT(worker_info.OT_Flag, 3) = 0 OR Total_Day_without_OT(worker_info.OT_Flag, 4) = 0
                                OR Total_Day_without_OT(worker_info.OT_Flag, 5) = 0 OR Total_Day_without_OT(worker_info.OT_Flag, 6) = 0)))
                AND worker_info.ee_type != 'U' and worker_info.ee_type != 'E' AND worker_info.work_state = 'CA'
                AND worker_info.ot_daily_hours + worker_info.ot_weekly_hours > 0 AND total_day_reg (cnt) > 0 AND total_day_dbl (cnt) > 0 
                AND total_day_without_ot(worker_info.OT_Flag,cnt) - total_day_hol(cnt) + (total_day_ot (cnt) - total_day_dbl(cnt)) < 12 THEN
               record_error (p_error_count, p_error_line, p_error_number, cnt, 86000103);
            END IF;

            IF worker_info.ee_type != 'U' THEN
               IF total_day_ot (cnt) > 0 THEN
                  IF NOT (cnt = 7 AND worker_info.work_state = 'CA' AND Total_Day_without_OT(worker_info.OT_Flag, 1) > 0
                          AND Total_Day_without_OT(worker_info.OT_Flag, 2) > 0 AND Total_Day_without_OT(worker_info.OT_Flag, 4) > 0
                          AND Total_Day_without_OT(worker_info.OT_Flag, 5) > 0 AND Total_Day_without_OT(worker_info.OT_Flag, 6) > 0) THEN
                     IF NOT (is_malaysing) THEN
                     IF (cutoffidx = 7) or (todayidx = 7) THEN
                     IF worker_info.ot_daily_hours > 0 AND total_day_hol (cnt) = 0 AND total_day_ot (cnt) > 0
                         AND Total_Day_without_OT(worker_info.OT_Flag, cnt) < worker_info.ot_daily_hours
                         AND (Total_Week_without_OT(worker_info.OT_Flag) < worker_info.ot_weekly_hours OR worker_info.ot_weekly_hours = 0) THEN
                        record_error (p_error_count, p_error_line, p_error_number, cnt, 86000062);
                     END IF;
                     END IF;
                     END IF;

                     IF NOT (is_malaysing) THEN
                     IF (cutoffidx = 7) or (todayidx = 7) THEN
                     IF total_day_hol (cnt) = 0 AND worker_info.ot_weekly_hours > 0 AND worker_info.ot_daily_hours = 0
                         AND ((worker_info.ctry = 'U' AND Total_Week_without_OT(worker_info.OT_Flag) < worker_info.ot_weekly_hours)
                               OR (worker_info.ctry != 'U' AND Total_Week_without_OT(worker_info.OT_Flag) < worker_info.ot_weekly_hours)) THEN
                        record_error (p_error_count, p_error_line, p_error_number, cnt, 86000067);
                     ELSIF Total_Day_without_OT(worker_info.OT_Flag,cnt) = 0 THEN
                        IF ((worker_info.ctry = 'U' AND Total_Week_without_OT(worker_info.OT_Flag) < worker_info.ot_weekly_hours)
                            OR (worker_info.ctry != 'U' AND Total_Week_without_OT(worker_info.OT_Flag) < worker_info.ot_weekly_hours)) THEN
                           record_error (p_error_count, p_error_line, p_error_number, cnt, 86000067);
                        END IF;
                     END IF; 
                     END IF; 
                     END IF; 
                  END IF; 
               END IF; 
            END IF; 

            IF (worker_info.ctry = 'U' AND Total_Day_without_OT(worker_info.OT_Flag,cnt) > worker_info.ot_daily_hours AND worker_info.ot_daily_hours > 0 AND total_day_hol (cnt) = 0)
              OR (worker_info.ctry != 'U' AND worker_info.ee_type <> 'A' AND Total_Day_without_OT(worker_info.OT_Flag,cnt) > worker_info.ot_daily_hours AND worker_info.ot_daily_hours > 0 AND total_day_hol (cnt) = 0) THEN
               record_error (p_error_count, p_error_line, p_error_number, cnt, 86000061);
            END IF;

            IF worker_info.contractor = FALSE THEN
               IF total_day_vac (cnt) > worker_info.long_day THEN
                  no_error_flag := FALSE; record_error (p_error_count, p_error_line, p_error_number, cnt, 86000002);
               END IF;

               IF override_holiday = 'N' THEN
                 IF worker_info.ctry = 'U' THEN
                   IF worker_info.standard_week = 'S' THEN
                     IF total_day_hol (cnt) > LEAST (8, worker_info.ave_weekly_hours) THEN
                        no_error_flag := FALSE; record_error (p_error_count, p_error_line, p_error_number, cnt, 86000086);
                     END IF;
                   ELSE
                     IF total_day_hol (cnt) > LEAST (8, worker_info.long_day) THEN
                        no_error_flag := FALSE; record_error (p_error_count, p_error_line, p_error_number, cnt, 86000086);
                     END IF;
                   END IF; 
                 END IF; 
                 IF worker_info.currency in ('CDN','CAD') THEN
                   IF worker_info.standard_week = 'S' THEN
                     IF total_day_hol (cnt) > worker_info.ave_weekly_hours THEN
                        no_error_flag := FALSE; record_error (p_error_count, p_error_line, p_error_number, cnt, 86000085);
                     END IF;
                   ELSE
                     IF total_day_hol (cnt) > worker_info.long_day THEN
                        no_error_flag := FALSE; record_error (p_error_count, p_error_line, p_error_number, cnt, 86000085);
                     END IF;
                   END IF;
                END IF; 
               ELSE            
                  IF total_day_hol (cnt) > override_holiday_limits THEN
                        no_error_flag := FALSE; record_error (p_error_count, p_error_line, p_error_number, cnt, 86000106);
                  END IF;
               END IF;  

               IF total_day_sick (cnt) > worker_info.long_day THEN
                  no_error_flag := FALSE; record_error (p_error_count, p_error_line, p_error_number, cnt, 86000009);
               END IF;

               IF no_error_flag AND (total_day_sick (cnt) + total_day_vac (cnt) + total_day_upd (cnt) + total_day_lv (cnt) + total_day_mil (cnt) +
                        total_day_ccl (cnt) + total_day_mlv (cnt) + total_day_plv (cnt) + total_day_sl (cnt) + total_day_lsl (cnt) + 
                        total_day_fl (cnt) + total_day_fcl (cnt) + total_day_sab (cnt) + total_day_csl (cnt) + total_day_rlv (cnt) + 
                        total_day_xsl (cnt) + total_day_til (cnt) + total_day_par (cnt) + total_day_xhl (cnt) + total_day_jub (cnt) + 
                        total_day_flx (cnt) + total_day_ofx (cnt) + total_day_mlx (cnt) + total_day_mle (cnt) + total_day_mls (cnt) + 
                        total_day_spn (cnt) + total_day_dis (cnt) + total_day_bvl (cnt) + total_day_tlv (cnt) + total_day_phl (cnt) 
                       ) > worker_info.long_day THEN
                  record_error (p_error_count, p_error_line, p_error_number, cnt, 86000085);
               END IF;

               IF total_day_pb (cnt) > worker_info.long_day THEN
                  record_error (p_error_count, p_error_line, p_error_number, cnt, 86000035);
               END IF;
            END IF; 

            IF worker_info.contractor = FALSE THEN
               IF worker_info.ee_type = 'E' THEN
                  IF worker_info.ctry = 'U' THEN
                     IF total_day_upd (cnt) - total_day_upd_fml(cnt) > 0 AND total_day(cnt) - (total_day_upd (cnt) - total_day_upd_fml(cnt)) > 0 THEN
                        record_error (p_error_count, p_error_line, p_error_number, cnt, 86000069);
                     END IF;

                     IF (NVL(total_day_sick_nonfml(cnt),0) + NVL(total_day_hol_nonfml(cnt),0) + NVL(total_day_vac_nonfml(cnt),0)
                           + NVL(total_day_mil_nonfml(cnt),0) + NVL(total_day_lv_nonfml(cnt),0) + NVL(total_day_pb_nonfml(cnt),0)   
                           + NVL(total_day_ccl_nonfml (cnt),0) + NVL(total_day_mlv_nonfml (cnt),0) + NVL(total_day_plv_nonfml (cnt),0) 
                           + NVL(total_day_sl_nonfml (cnt),0) + NVL(total_day_lsl_nonfml (cnt),0) + NVL(total_day_fl_nonfml (cnt),0) 
                           + NVL(total_day_fcl_nonfml (cnt),0) + NVL(total_day_sab_nonfml (cnt),0) + NVL(total_day_csl_nonfml (cnt),0) 
                           + NVL(total_day_rlv_nonfml (cnt),0) + NVL(total_day_xsl_nonfml (cnt),0) + NVL(total_day_til_nonfml (cnt),0) 
                           + NVL(total_day_par_nonfml (cnt),0) + NVL(total_day_xhl_nonfml (cnt),0) + NVL(total_day_jub_nonfml (cnt),0) 
                           + NVL(total_day_flx_nonfml (cnt),0) + NVL(total_day_ofx_nonfml (cnt),0) + NVL(total_day_mlx_nonfml (cnt),0) 
                           + NVL(total_day_mle_nonfml (cnt),0) + NVL(total_day_mls_nonfml (cnt),0) + NVL(total_day_spn_nonfml (cnt),0)
                           + NVL(total_day_dis_nonfml (cnt),0) + NVL(total_day_bvl_nonfml (cnt),0) + NVL(total_day_tlv_nonfml (cnt),0)
                           + NVL(total_day_phl_nonfml (cnt),0)) > 0
                     AND NVL(total_day_upd(cnt),0) > 0 AND NVL(total_day_fml(cnt),0) = 0 THEN
                        record_error (p_error_count, p_error_line, p_error_number, cnt, 86000016);
                     END IF;

                     IF NVL(total_day_upd(cnt),0) > 0 AND worker_info.standard_week = 'S' ANd total_day (cnt) = NVL(total_day_upd(cnt),0)
                     AND NVL(total_day_fml(cnt),0) = 0 AND NVL(total_day_upd(cnt),0) < worker_info.long_day THEN
                        record_error (p_error_count, p_error_line, p_error_number, cnt, 86000014);
                     END IF; 
                  END IF; 
               ELSE 
                  IF worker_info.ctry = 'U' AND (total_day_hol (cnt) > 0) AND (total_day_reg (cnt) > 0) THEN
                     record_error (p_error_count, p_error_line, p_error_number, cnt, 86000089);
                  END IF;
               END IF;
            END IF; 
         END LOOP;
      ELSE 
         record_error (p_error_count, p_error_line, p_error_number, 0, 86000000);
      END IF;
   END VALIDATE; 

  PROCEDURE validate(p_org_code IN LCD.WORKER_HIST.ORG_CODE%TYPE := '111',
              p_worker_id  IN LCD.WORKER.WORKER_ID%TYPE := 'AAAAAAAAAA',
              p_end_date   IN DATE := '11-NOV-97',
              p_size      IN INTEGER,
              p_array_abs_type IN lcd.pay_edit.AbsType,
                  p_array_wo_num IN lcd.pay_edit.WoType,
              p_array_time IN lcd.pay_edit.TimeStrType,
              p_error_count IN OUT INTEGER,
              p_error_line IN OUT lcd.pay_edit.ErrorLineType,
              p_error_number IN OUT lcd.pay_edit.ErrorNumType) IS
      l_array_dept lcd.pay_edit.DEPTSTRTYPE;
   BEGIN
      pg_end_date := p_end_date;
      FOR cnt IN 1 .. p_size LOOP l_array_dept (cnt) := ' '; END LOOP;
      VALIDATE (p_org_code, p_worker_id, p_end_date, p_size, p_array_abs_type, p_array_wo_num, l_array_dept, p_array_time, p_error_count, p_error_line, p_error_number);
   END VALIDATE; 

    PROCEDURE leave_check(p_error_count IN OUT INTEGER,
                p_error_line IN OUT lcd.pay_edit.ErrorLineType,
                p_error_number IN OUT lcd.pay_edit.ErrorNumType) IS
      balance_rec balancerecordtype; balance_rec1 balancerecordtype;
      bWasSickError boolean := False; bWasPBError boolean := False;
      bSickCanGoNegative boolean := False; bPBCanGoNegative boolean := False;
      eTESprofile CHAR(1); total_week_hrs NUMBER := 0;

      vaclim lcd.org_param.vacation_hrs_borrow_limit%TYPE := 0; scklim lcd.org_param.sick_hrs_borrow_limit%TYPE := 0;
      pblim lcd.org_param.persbus_hrs_borrow_limit%TYPE := 0; millim lcd.org_param.military_hrs_borrow_limit%TYPE := 0;
      ccllim lcd.org_param.military_hrs_borrow_limit%TYPE := 0; mlvlim lcd.org_param.military_hrs_borrow_limit%TYPE := 0;
      plvlim lcd.org_param.military_hrs_borrow_limit%TYPE := 0; sllim lcd.org_param.military_hrs_borrow_limit%TYPE := 0;
      lsllim lcd.org_param.military_hrs_borrow_limit%TYPE := 0; fllim lcd.org_param.military_hrs_borrow_limit%TYPE := 0;
      fcllim lcd.org_param.military_hrs_borrow_limit%TYPE := 0; sablim lcd.org_param.military_hrs_borrow_limit%TYPE := 0;
      csllim lcd.org_param.military_hrs_borrow_limit%TYPE := 0; rlvlim lcd.org_param.military_hrs_borrow_limit%TYPE := 0;
      xsllim lcd.org_param.military_hrs_borrow_limit%TYPE := 0; tillim lcd.org_param.military_hrs_borrow_limit%TYPE := 0;
      parlim lcd.org_param.military_hrs_borrow_limit%TYPE := 0; xhllim lcd.org_param.military_hrs_borrow_limit%TYPE := 0;
      jublim lcd.org_param.military_hrs_borrow_limit%TYPE := 0; flxlim lcd.org_param.military_hrs_borrow_limit%TYPE := 0;
      ofxlim lcd.org_param.military_hrs_borrow_limit%TYPE := 0; mlxlim lcd.org_param.military_hrs_borrow_limit%TYPE := 0;
      mlelim lcd.org_param.military_hrs_borrow_limit%TYPE := 0; mlslim lcd.org_param.military_hrs_borrow_limit%TYPE := 0;
      spnlim lcd.org_param.military_hrs_borrow_limit%TYPE := 0; dislim lcd.org_param.military_hrs_borrow_limit%TYPE := 0;
      bvllim lcd.org_param.military_hrs_borrow_limit%TYPE := 0; tlvlim lcd.org_param.military_hrs_borrow_limit%TYPE := 0;
      phllim lcd.org_param.military_hrs_borrow_limit%TYPE := 0;
      l_errNBR INTEGER;

   BEGIN
      SELECT NVL (lcd.org_param.vacation_hrs_borrow_limit, 0), NVL (lcd.org_param.sick_hrs_borrow_limit, 0),
             NVL (lcd.org_param.persbus_hrs_borrow_limit, 0), NVL (lcd.org_param.military_hrs_borrow_limit, 0),
             NVL (ccl_hrs_borrow_limit, 0), NVL (mlv_hrs_borrow_limit, 0), NVL (plv_hrs_borrow_limit, 0),
             NVL (sl_hrs_borrow_limit, 0), NVL (lsl_hrs_borrow_limit, 0), NVL (fl_hrs_borrow_limit, 0), NVL (fcl_hrs_borrow_limit, 0),
             NVL (sab_hrs_borrow_limit, 0), NVL (csl_hrs_borrow_limit, 0), NVL (rlv_hrs_borrow_limit, 0), NVL (xsl_hrs_borrow_limit, 0),
             NVL (til_hrs_borrow_limit, 0), NVL (par_hrs_borrow_limit, 0), NVL (xhl_hrs_borrow_limit, 0), NVL (jub_hrs_borrow_limit, 0),
             NVL (flx_hrs_borrow_limit, 0), NVL (ofx_hrs_borrow_limit, 0), NVL (mlx_hrs_borrow_limit, 0), NVL (mle_hrs_borrow_limit, 0),
             NVL (mls_hrs_borrow_limit, 0), NVL (spn_hrs_borrow_limit, 0), NVL (dis_hrs_borrow_limit, 0), NVL (bvl_hrs_borrow_limit, 0),
             NVL (tlv_hrs_borrow_limit, 0), NVL (phl_hrs_borrow_limit, 0)
        INTO vaclim, scklim, pblim, millim, ccllim, mlvlim, plvlim, sllim, lsllim, fllim, fcllim, sablim, csllim, rlvlim, xsllim,
             tillim, parlim, xhllim, jublim, flxlim, ofxlim, mlxlim, mlelim, mlslim, spnlim, dislim, bvllim, tlvlim, phllim
      FROM lcd.org_param WHERE (lcd.org_param.org_code = pg_org_code);

      total_eoy_shutdown_hours := ites.f_get_shutdown_hours@lcd_ites(pg_worker_id, pg_end_date);
      future_abs_str := ITES.f_GET_FutureAbsenceHours@lcd_ites(pg_worker_id, to_char(pg_end_date,'yyyymmdd'));
      future_abs_lookup := lcd.shared.parse_to_lookup(future_abs_str);

      IF total_hours > 0 AND worker_info.contractor = FALSE THEN
         IF f_get_worker_balance (balance_rec) THEN
              balance_rec.vac := balance_rec.vac - lcd.shared.get_future_absence_hours(future_abs_lookup, 'VAC');
              balance_rec.per_lv := balance_rec.per_lv - lcd.shared.get_future_absence_hours(future_abs_lookup, 'PB');
          balance_rec.sick := balance_rec.sick - lcd.shared.get_future_absence_hours(future_abs_lookup, 'SCK');
              balance_rec.mil_lv := balance_rec.mil_lv - lcd.shared.get_future_absence_hours(future_abs_lookup, 'MIL');
              balance_rec.ccl_lv := balance_rec.ccl_lv - lcd.shared.get_future_absence_hours(future_abs_lookup, 'CCL');
              balance_rec.mlv_lv := balance_rec.mlv_lv - lcd.shared.get_future_absence_hours(future_abs_lookup, 'MLV');
              balance_rec.plv_lv := balance_rec.plv_lv - lcd.shared.get_future_absence_hours(future_abs_lookup, 'PLV');
              balance_rec.sl_lv := balance_rec.sl_lv - lcd.shared.get_future_absence_hours(future_abs_lookup, 'SL');
              balance_rec.lsl_lv := balance_rec.lsl_lv - lcd.shared.get_future_absence_hours(future_abs_lookup, 'ASL');
              balance_rec.fl_lv := balance_rec.fl_lv - lcd.shared.get_future_absence_hours(future_abs_lookup, 'FL');
              balance_rec.fcl_lv := balance_rec.fcl_lv - lcd.shared.get_future_absence_hours(future_abs_lookup, 'FCL');
              balance_rec.sab_lv := balance_rec.sab_lv - lcd.shared.get_future_absence_hours(future_abs_lookup, 'SAB');
              balance_rec.csl_lv := balance_rec.csl_lv - lcd.shared.get_future_absence_hours(future_abs_lookup, 'CSL');
              balance_rec.rlv_lv := balance_rec.rlv_lv - lcd.shared.get_future_absence_hours(future_abs_lookup, 'RLV');
              balance_rec.xsl_lv := balance_rec.xsl_lv - lcd.shared.get_future_absence_hours(future_abs_lookup, 'XSL');
              balance_rec.til_lv := balance_rec.til_lv - lcd.shared.get_future_absence_hours(future_abs_lookup, 'TIL');
              balance_rec.par_lv := balance_rec.par_lv - lcd.shared.get_future_absence_hours(future_abs_lookup, 'PAR');
              balance_rec.xhl_lv := balance_rec.xhl_lv - lcd.shared.get_future_absence_hours(future_abs_lookup, 'XHL');
              balance_rec.jub_lv := balance_rec.jub_lv - lcd.shared.get_future_absence_hours(future_abs_lookup, 'JUB');
              balance_rec.flx_lv := balance_rec.flx_lv - lcd.shared.get_future_absence_hours(future_abs_lookup, 'FLX');
              balance_rec.ofx_lv := balance_rec.ofx_lv - lcd.shared.get_future_absence_hours(future_abs_lookup, 'OFX');
              balance_rec.mlx_lv := balance_rec.mlx_lv - lcd.shared.get_future_absence_hours(future_abs_lookup, 'MLX');
              balance_rec.mle_lv := balance_rec.mle_lv - lcd.shared.get_future_absence_hours(future_abs_lookup, 'MLE');
              balance_rec.mls_lv := balance_rec.mls_lv - lcd.shared.get_future_absence_hours(future_abs_lookup, 'MLS');
              balance_rec.spn_lv := balance_rec.spn_lv - lcd.shared.get_future_absence_hours(future_abs_lookup, 'SPN');
              balance_rec.dis_lv := balance_rec.dis_lv - lcd.shared.get_future_absence_hours(future_abs_lookup, 'DIS');
              balance_rec.bvl_lv := balance_rec.bvl_lv - lcd.shared.get_future_absence_hours(future_abs_lookup, 'BVL');
              balance_rec.tlv_lv := balance_rec.tlv_lv - lcd.shared.get_future_absence_hours(future_abs_lookup, 'TLV');
              balance_rec.phl_lv := balance_rec.phl_lv - lcd.shared.get_future_absence_hours(future_abs_lookup, 'PHL');

            IF (is_malaysing) THEN
                balance_rec.vac := balance_rec.vac + 0.0;
            ELSE
         balance_rec.vac := balance_rec.vac + vaclim;
            END IF;
                balance_rec.sick := balance_rec.sick + scklim; 
                balance_rec.per_lv := balance_rec.per_lv + pblim;

            IF total_week_fml > 0 THEN
               IF balance_rec.fml_lv = 0 THEN
                  record_error (p_error_count, p_error_line, p_error_number, 0, 86000079);
               ELSIF balance_rec.fml_lv < total_week_fml THEN
                  record_error (p_error_count, p_error_line, p_error_number, 0, 86000081);
               END IF;
            END IF;

              IF worker_info.currency in ('INR') THEN
                FOR cnt IN 1 .. 7 LOOP total_week_hrs := total_week_hrs + total_day(cnt); END LOOP;
              END IF;

            FOR cnt IN 1 .. 7 LOOP
                IF (is_override) THEN
                 worker_info.ABSENCE_INCREMENT := wi_ovrr_abs_inc(cnt);
                 worker_info.long_day := wi_ovrr_long_day(cnt);
                END IF;

             if (cutoffidx <> 7) and (todayidx <= cutoffidx) and (cnt > cutoffidx) then
                    total_day_vac (cnt) := 0; total_day_pb (cnt) := 0; total_day_sick (cnt) := 0; total_day_mil (cnt) := 0; total_day_ccl (cnt) := 0;
                    total_day_mlv (cnt) := 0; total_day_plv (cnt) := 0; total_day_sl (cnt) := 0; total_day_lsl (cnt) := 0; total_day_fl (cnt) := 0;
                    total_day_fcl (cnt) := 0; total_day_sab (cnt) := 0; total_day_csl (cnt) := 0; total_day_rlv (cnt) := 0; total_day_xsl (cnt) := 0;
                    total_day_til (cnt) := 0; total_day_par (cnt) := 0; total_day_xhl (cnt) := 0; total_day_jub (cnt) := 0; total_day_flx (cnt) := 0;
                    total_day_ofx (cnt) := 0; total_day_mlx (cnt) := 0; total_day_phl (cnt) := 0;
             end if;
             if (cutoffidx <> 7) and (todayidx > cutoffidx) and (cnt <= cutoffidx) then
                    total_day_vac (cnt) := 0; total_day_pb (cnt) := 0; total_day_sick (cnt) := 0; total_day_mil (cnt) := 0; total_day_ccl (cnt) := 0;
                    total_day_mlv (cnt) := 0; total_day_plv (cnt) := 0; total_day_sl (cnt) := 0; total_day_lsl (cnt) := 0; total_day_fl (cnt) := 0;
                    total_day_fcl (cnt) := 0; total_day_sab (cnt) := 0; total_day_csl (cnt) := 0; total_day_rlv (cnt) := 0; total_day_xsl (cnt) := 0;
                    total_day_til (cnt) := 0; total_day_par (cnt) := 0; total_day_xhl (cnt) := 0; total_day_jub (cnt) := 0; total_day_flx (cnt) := 0;
                    total_day_ofx (cnt) := 0; total_day_mlx (cnt) := 0; total_day_phl (cnt) := 0;
             end if;

               IF total_day_vac (cnt) > 0 THEN
                  balance_rec.vac := balance_rec.vac - total_day_vac (cnt);
                  IF balance_rec.vac < 0 THEN
                      IF ((is_malaysing)) THEN
                                record_error (p_error_count, p_error_line, p_error_number, cnt, 86000242);
            ELSE
                        record_error (p_error_count, p_error_line, p_error_number, cnt, 86000001);
            END IF;
                  END IF;
              END IF;

              balance_rec.per_lv := balance_rec.per_lv - total_day_pb (cnt);
              balance_rec.sick := balance_rec.sick - total_day_sick (cnt);

              IF total_day_sick_fml(cnt) > 0 THEN
                 IF balance_rec.sick < 0 THEN
                    IF balance_rec.vac > 0 THEN
                        bWasSickError := True; record_error (p_error_count, p_error_line, p_error_number, cnt, 86000008);
                    ELSE
                       bSickCanGoNegative := TRUE;
                    END IF;
                 END IF;
                 IF balance_rec.sick <= 0 THEN
                    IF total_day_sick_fml(cnt) = worker_info.long_day THEN
                        bWasSickError := True; record_error (p_error_count, p_error_line, p_error_number, cnt, 86000006);
                    END IF;
                 END IF;
              END IF;

              IF total_day_pb_fml(cnt) > 0 THEN
                 IF balance_rec.per_lv < 0 THEN
                    IF balance_rec.vac > 0 THEN
                        bWasPBError := True; record_error (p_error_count, p_error_line, p_error_number, cnt, 86000007);
                    ELSE
                       bPBCanGoNegative := TRUE;
                    END IF;
                 END IF;
                 IF balance_rec.per_lv <= 0 THEN
                    IF total_day_pb_fml(cnt) = worker_info.long_day THEN
                        bWasPBError := True; record_error (p_error_count, p_error_line, p_error_number, cnt, 86000005);
                    END IF;
                 END IF;
              END IF;

              IF total_day_pb (cnt) > 0 THEN
                  IF balance_rec.per_lv < 0 AND NOT bWasPBError AND NOT bPBCanGoNegative THEN
                    record_error (p_error_count, p_error_line, p_error_number, cnt, 86000034);
                  END IF;
               END IF;

               IF total_day_sick (cnt) > 0 THEN
                     IF balance_rec.sick < 0 AND NOT bWasSickError and NOT bSickCanGoNegative THEN
                        record_error (p_error_count, p_error_line, p_error_number, cnt, 86000087);
                     END IF;
               END IF;  

               IF total_day_mil (cnt) > 0 THEN
                  balance_rec.mil_lv := balance_rec.mil_lv - total_day_mil (cnt);
                  IF (balance_rec.mil_lv + millim) < 0 THEN
                     record_error (p_error_count, p_error_line, p_error_number, cnt, 86000092);
                  END IF;
               END IF;

               IF total_day_ccl (cnt) > 0 THEN
                  balance_rec.ccl_lv := balance_rec.ccl_lv - total_day_ccl (cnt);
                  IF (balance_rec.ccl_lv + ccllim) < 0 THEN
                     record_error (p_error_count, p_error_line, p_error_number, cnt, 86000201);
                  END IF;
               END IF;

               IF total_day_mlv (cnt) > 0 THEN
                  balance_rec.mlv_lv := balance_rec.mlv_lv - total_day_mlv (cnt);
                  IF (balance_rec.mlv_lv + mlvlim) < 0 THEN
                     record_error (p_error_count, p_error_line, p_error_number, cnt, 86000202);
                  END IF;
               END IF;

               IF total_day_plv (cnt) > 0 THEN
                  balance_rec.plv_lv := balance_rec.plv_lv - total_day_plv (cnt);
                  IF (balance_rec.plv_lv + plvlim) < 0 THEN
                     record_error (p_error_count, p_error_line, p_error_number, cnt, 86000203);
                  END IF;
               END IF;

               IF total_day_sl (cnt) > 0 THEN
                  balance_rec.sl_lv := balance_rec.sl_lv - total_day_sl (cnt);
                  IF (balance_rec.sl_lv + sllim) < 0 THEN
                     record_error (p_error_count, p_error_line, p_error_number, cnt, 86000204);
                  END IF;
               END IF;

               IF total_day_lsl (cnt) > 0 THEN
                  balance_rec.lsl_lv := balance_rec.lsl_lv - total_day_lsl (cnt);
                  IF (balance_rec.lsl_lv + lsllim) < 0 THEN
                   IF (pg_org_code = 'A76') THEN                    
                     record_error (p_error_count, p_error_line, p_error_number, cnt, 86000243);
                   ELSE
                     record_error (p_error_count, p_error_line, p_error_number, cnt, 86000205);
                   END IF;
                  END IF;
               END IF;

               IF total_day_fl (cnt) > 0 THEN
                  balance_rec.fl_lv := balance_rec.fl_lv - total_day_fl (cnt);
                  IF (balance_rec.fl_lv + fllim) < 0 THEN
                     record_error (p_error_count, p_error_line, p_error_number, cnt, 86000206);
                  END IF;
               END IF;

               IF total_day_fcl (cnt) > 0 THEN
                  balance_rec.fl_lv := balance_rec.fcl_lv - total_day_fcl (cnt);
                  IF (balance_rec.fcl_lv + fcllim) < 0 THEN
                     record_error (p_error_count, p_error_line, p_error_number, cnt, 86000207);
                  END IF;
               END IF;

               IF total_day_sab (cnt) > 0 THEN
                  balance_rec.sab_lv := balance_rec.sab_lv - total_day_sab (cnt);
                  IF (balance_rec.sab_lv + sablim) < 0 THEN
                     record_error (p_error_count, p_error_line, p_error_number, cnt, 86000208);
                  END IF;
               END IF;

               IF total_day_csl (cnt) > 0 THEN
                 balance_rec.csl_lv := balance_rec.csl_lv - total_day_csl (cnt);
                 IF (balance_rec.csl_lv + csllim) < 0 THEN
                    record_error (p_error_count, p_error_line, p_error_number, cnt, 86000209);
                 END IF;
               END IF;

               IF total_day_rlv (cnt) > 0 THEN
                  balance_rec.rlv_lv := balance_rec.rlv_lv - total_day_rlv (cnt);
                  IF (balance_rec.rlv_lv + rlvlim) < 0 THEN
                     record_error (p_error_count, p_error_line, p_error_number, cnt, 86000210);
                  END IF;
               END IF;

               IF total_day_xsl (cnt) > 0 THEN
                  balance_rec.xsl_lv := balance_rec.xsl_lv - total_day_xsl (cnt);
                  IF (balance_rec.xsl_lv + xsllim) < 0 THEN
                     record_error (p_error_count, p_error_line, p_error_number, cnt, 86000211);
                  END IF;
               END IF;

               IF total_day_til (cnt) > 0 THEN
                  balance_rec.til_lv := balance_rec.til_lv - total_day_til (cnt);
                  IF (balance_rec.til_lv + tillim) < 0 THEN
                     record_error (p_error_count, p_error_line, p_error_number, cnt, 86000212);
                  END IF;
               END IF;

               IF total_day_par (cnt) > 0 THEN
                  balance_rec.par_lv := balance_rec.par_lv - total_day_par (cnt);
                  IF (balance_rec.par_lv + parlim) < 0 THEN
                     record_error (p_error_count, p_error_line, p_error_number, cnt, 86000213);
                  END IF;
               END IF;

               IF total_day_xhl (cnt) > 0 THEN
                  balance_rec.xhl_lv := balance_rec.xhl_lv - total_day_xhl (cnt);
                  IF (balance_rec.xhl_lv + xhllim) < 0 THEN
                     record_error (p_error_count, p_error_line, p_error_number, cnt, 86000214);
                  END IF;
               END IF;

               IF total_day_jub (cnt) > 0 THEN
                  balance_rec.jub_lv := balance_rec.jub_lv - total_day_jub (cnt);
                  IF (balance_rec.jub_lv + jublim) < 0 THEN
                     record_error (p_error_count, p_error_line, p_error_number, cnt, 86000215);
                  END IF;
               END IF;

               IF total_day_flx (cnt) > 0 THEN
                  balance_rec.flx_lv := balance_rec.flx_lv - total_day_flx (cnt);
                  IF (balance_rec.flx_lv + flxlim) < 0 THEN
                     record_error (p_error_count, p_error_line, p_error_number, cnt, 86000216);
                  END IF;
               END IF;

               IF total_day_ofx (cnt) > 0 THEN
                  balance_rec.ofx_lv := balance_rec.ofx_lv - total_day_ofx (cnt);
                  IF (balance_rec.ofx_lv + ofxlim) < 0 THEN
                     record_error (p_error_count, p_error_line, p_error_number, cnt, 86000217);
                  END IF;
               END IF;

               IF total_day_mlx (cnt) > 0 THEN
                  balance_rec.mlx_lv := balance_rec.mlx_lv - total_day_mlx (cnt);
                  IF (balance_rec.mlx_lv + mlxlim) < 0 THEN
                     record_error (p_error_count, p_error_line, p_error_number, cnt, 86000218);
                  END IF;
               END IF;

               IF total_day_mle (cnt) > 0 THEN
                  balance_rec.mle_lv := balance_rec.mle_lv - total_day_mle (cnt);
                  IF (balance_rec.mle_lv + mlelim) < 0 THEN
                     record_error (p_error_count, p_error_line, p_error_number, cnt, 86000219);
                  END IF;
               END IF;

               IF total_day_mls (cnt) > 0 THEN
                  balance_rec.mls_lv := balance_rec.mls_lv - total_day_mls (cnt);
                  IF (balance_rec.mls_lv + mlslim) < 0 THEN
                     record_error (p_error_count, p_error_line, p_error_number, cnt, 86000220);
                  END IF;
               END IF;

               IF total_day_spn (cnt) > 0 THEN
                  balance_rec.spn_lv := balance_rec.spn_lv - total_day_spn (cnt);
                  IF (balance_rec.spn_lv + spnlim) < 0 THEN
                     record_error (p_error_count, p_error_line, p_error_number, cnt, 86000221);
                  END IF;
               END IF;

               IF total_day_dis (cnt) > 0 THEN
                  balance_rec.dis_lv := balance_rec.dis_lv - total_day_dis (cnt);
                  IF (balance_rec.dis_lv + dislim) < 0 THEN
                     record_error (p_error_count, p_error_line, p_error_number, cnt, 86000222);
                  END IF;
               END IF;

               IF total_day_bvl (cnt) > 0 THEN
                  balance_rec.bvl_lv := balance_rec.bvl_lv - total_day_bvl (cnt);
                  IF (balance_rec.bvl_lv + bvllim) < 0 THEN
                     record_error (p_error_count, p_error_line, p_error_number, cnt, 86000223);
                  END IF;
               END IF;

               IF total_day_tlv (cnt) > 0 THEN
                  balance_rec.tlv_lv := balance_rec.tlv_lv - total_day_tlv (cnt);
                  IF (balance_rec.tlv_lv + tlvlim) < 0 THEN
                     record_error (p_error_count, p_error_line, p_error_number, cnt, 86000224);
                  END IF;
               END IF;

               IF total_day_phl (cnt) > 0 THEN
                  balance_rec.phl_lv := balance_rec.phl_lv - total_day_phl (cnt);
                  IF ((balance_rec.phl_lv >= 0) AND (worker_info.currency in ('INR'))) THEN
                      balance_rec.hol_used_hrs := balance_rec.phl_lv;
                  END IF;
                  IF (balance_rec.phl_lv + phllim) < 0 THEN
                     record_error (p_error_count, p_error_line, p_error_number, cnt, 86000225);
                  END IF;
               END IF;

              IF worker_info.currency in ('INR') THEN
                IF total_day_hol(cnt) > 0 AND total_day_hol(cnt) <> worker_info.long_day THEN
                   record_error (p_error_count, p_error_line, p_error_number, cnt, 86000230);
                END IF;
              END IF;

              IF worker_info.currency in ('INR') THEN
                IF ((total_day_mil(cnt) > 0 AND total_day_mil(cnt) <> worker_info.long_day) OR
                    (total_day_mil_nonfml(cnt) > 0 AND total_day_mil_nonfml(cnt) <> worker_info.long_day)) THEN
                   record_error (p_error_count, p_error_line, p_error_number, cnt, 86000231);
                END IF;
              END IF;

              IF worker_info.currency in ('INR') THEN
                IF ((total_day_phl(cnt) > 0 AND total_day_phl(cnt) <> worker_info.long_day) OR
                    (total_day_phl_nonfml(cnt) > 0 AND total_day_phl_nonfml(cnt) <> worker_info.long_day)) THEN
                   record_error (p_error_count, p_error_line, p_error_number, cnt, 86000232);
                END IF;
              END IF;

              IF worker_info.currency in ('INR') THEN
                IF total_day_vac(cnt) > 0 AND total_day_vac(cnt) <> worker_info.long_day AND total_day_vac(cnt) <> (worker_info.long_day / 2) THEN
                   record_error (p_error_count, p_error_line, p_error_number, cnt, 86000233);
                END IF;

                IF total_day_pb(cnt) > 0 AND total_day_pb(cnt) <> worker_info.long_day AND total_day_pb(cnt) <> (worker_info.long_day / 2) THEN
                   record_error (p_error_count, p_error_line, p_error_number, cnt, 86000233);
                END IF;

                IF total_day_upd(cnt) > 0 AND total_day_upd(cnt) <> worker_info.long_day AND total_day_upd(cnt) <> (worker_info.long_day / 2) THEN
                   record_error (p_error_count, p_error_line, p_error_number, cnt, 86000233);
                END IF;
              END IF;

              IF ((is_malaysing) AND (balance_rec.vac > 0.0) AND (total_day_flx(cnt) > 0)) THEN
                      record_error (p_error_count, p_error_line, p_error_number, cnt, 86000240);
              END IF;

              IF worker_info.currency in ('INR') THEN
                IF ((cnt > 2) AND (total_day_stdby(cnt) > 0.0) AND ((total_day(cnt) - total_day_stdby(cnt)) < worker_info.long_day)) THEN
                   record_error (p_error_count, p_error_line, p_error_number, cnt, 86000244);
                END IF;
              END IF;

              IF worker_info.currency in ('INR') THEN                
                IF ((total_day_stdby_half(cnt) > 0.0) AND ((total_day_stdby_half(cnt) < 2.0) OR (total_day_stdby_half(cnt) > 3.9))) THEN
                   record_error (p_error_count, p_error_line, p_error_number, cnt, 86000246);
                END IF;
              END IF;

              IF worker_info.currency in ('INR') THEN
                IF ((total_day_stdby_full(cnt) > 0.0) AND ((total_day_stdby_full(cnt) < 4.0))) THEN
                   record_error (p_error_count, p_error_line, p_error_number, cnt, 86000247);
                END IF;
              END IF;

            IF worker_info.is_malaysia_a60 THEN
               IF total_day_my3010(cnt) > 12.0 THEN
                  record_error(p_error_count, p_error_line, p_error_number, cnt, 86000260);
               END IF;
            END IF;

            END LOOP;

         ELSE
            record_error (p_error_count, p_error_line, p_error_number, 0, 86000100);
         END IF;
      END IF; 
   END leave_check;

 PROCEDURE future_check(p_end_date IN DATE,
            p_error_count IN OUT INTEGER,
            p_error_line IN OUT lcd.pay_edit.ErrorLineType,
            p_error_number IN OUT lcd.pay_edit.ErrorNumType) IS
      startDay VARCHAR2(10); week_end_date DATE;
   BEGIN
      SELECT NVL (WEEKLY_START_DAY, 'SATURDAY') INTO startDay FROM lcd.org_param WHERE (lcd.org_param.org_code = pg_org_code);
      week_end_date := TRUNC (NEXT_DAY (p_end_date, startDay) - 1);

      FOR i IN GREATEST (1, TO_NUMBER (8 - (week_end_date - TRUNC (SYSDATE)))) .. 7 LOOP
         IF total_day_reg (i) + total_day_ot (i) > 0 THEN
            record_error (p_error_count, p_error_line, p_error_number, i, 86000091);
         END IF;
      END LOOP;
   END future_check;
END pay_editA;
/
show error
/
```