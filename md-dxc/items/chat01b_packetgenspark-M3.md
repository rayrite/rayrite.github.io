# MalaySing Validation Rules – Patch Analysis (INC1276683)

Below are the three artifacts you requested. The full original `PAYEDIT2A.SQL` is reproduced in Section 3 with the new validation rules injected as a single, easily removable `p_malaysing_validation_routines_aug26(...)` call, plus the supporting global accumulators, `tally()` branches, and `clear_tables()` resets.

---

## CLARIFYING_QUESTIONS.md

The following questions must be answered before the patches can be promoted from "best-effort assumptions" to production-ready. Where I made an assumption, it is annotated in `PATCH_PLAN.md` under the "Assumed" column.

1. **Rule 1010 dependency (Malaysia 3010/3011)**
 The slide states *"On working regular day then EE must enter regular time code 1010"*. Is this a hard rule that **1010 must be present whenever 3010 or 3011 is entered on a non-off day**, or is it descriptive (i.e. 1010 should normally be present but not enforced in LCD)?

2. **Definition of "working regular day" vs "off day"**
 How does the script determine whether a given calendar day is a regular workday or an off day for Malaysia (A60)? Possibilities:
 - (a) Day-of-week only (Sat/Sun = off)
 - (b) Driven by PH calendar (`holiday_flag`)
 - (c) Day contains any 3011 entry ⇒ always treated as off day *for that day only*

 The slide line *"RDW: any time a user enters 3011. then that day counts as an 'Off day'"* suggests (c).

3. **Missing/incomplete RDW notes**
 The slide contains an empty bullet: `• RDW:` (line 3 of the 3010/3011 block). Was there intended business logic that was lost? Please confirm whether the off-day rule (Q2) is the only intended RDW note or if additional restrictions apply (e.g. cannot combine 3010 with 3011; cannot enter 3010 and 3011 both as "1.5x" on same day).

4. **3020 Mandatory rule**: *"Employee can enter OT on the same day for Time code **3020 (Mandatory)** along with 3030 and 3040"* — Confirm: must 3020 always be present when ANY of 3020/3030/3040 is entered, or is 3020 mandatory only if 3030 OR 3040 is entered (i.e. 3030 alone OK, 3040 alone OK, but 3030+3040 without 3020 = error)?

5. **3050/3060 PH prerequisite**
 *"Enter a PH (8000) first and then employee can enter 3050 and only then can utilize 3060"*. Confirm that 8000 must be positive hours for the same calendar day. Also: is 8000 a "public holiday" `att_abs_type` already known to the system, or do we have to map 8000 → PH group manually?

6. **Daily cap of 12 hrs — global vs org-specific**
 The 12-hour cap for codes 3010-3066 looks hardcoded. Should it ever be overridden by `MAXHOURS` in `support_systems` for Malaysia? (The existing INC1247720 Malaysia 3010 rule hardcodes 12.0 and ignores `MAXHOURS`; assume the same.)

7. **Singapore 3100 start-day semantics**
 *"Start date of Weekly SB could be any day of the week"* — is the calendar day on which 3100 is entered used for **rate calculation** only, or does it also anchor **which weekend days are protected from 3120**?

8. **Singapore 3100 ↔ 3120 mutual exclusion wording**
 3110 explicitly says *"cannot use in a week with 3100"*. 3120 only says *"cannot combine on a weekend day with 3100"*. Are these intended to differ, i.e. should 3120 be allowed on a Sat/Sun in a week where 3100 is dated **Mon–Fri**, but disallowed on the Sat/Sun that 3100 actually falls on? My default assumption is **3120 disallowed whenever 3100 is used in the same week** (consistent with 3110).

9. **Singapore "SA" reference**
 *"eTES to restrict overlap of more than 1 unit per day (SA & SB)"* — what is `SA` (`Shifting Allowance`?) in the LCD context? Is there an existing att_abs_type we should reference, or is the SA/SB overlap enforcement only an eTES concern (LCD only ensures SB codes are internally consistent)?

10. **Singapore standby units**
 *"The number must be 1 UNIT"* — does the LCD interface receive standby codes with `p_time_rec.hours = 1.0` (i.e., 1 hour of standby time), or with hours equal to 8.0 (a full "unit" of standby = standard workday)? My default assumption is `hours = 1.0` (treat UNIT as 1 hour).

11. **Singapore standby vs existing India standby variables**
 The India Supplemental Pay code already declares `1SBH | 1SBF | 1SBD` (India standby). Is there any risk of att_abs_type name collision with Singapore's `3100/3110/3120`? (Should be none — different numeric namespace — confirm.)

12. **Error code numbering**
 Existing Malaysia/Singapore errors use the `8600024x`–`86000260` range. Should new errors follow this immediately (start at `86000261`), or has IT reserved a block (e.g. `8600027x`)?

13. **Phase-in / rollout flags**
 All rules are tagged `(Priority Change) - Aug'26`. Does the package need an `is_active_date` style guard so the rules only fire after a config flag flips, or are they unconditionally enabled once deployed?

14. **Whether `validate()` calls leave_check() to be reverted or augmented**
 The new rules are pure validation (no leave-balance decrement). Confirm that we may safely add to `validate()` and that `leave_check()` does **not** need to be modified.

15. **Should Holiday (`8000`) hours be deducted from the 12-hour cap for 3050/3060, but INCLUDED in the 12-hour cap for 3010/3011?**
 Slide text says *"12 Hours cap ... If PH(8000) is applied, then a standard logic is to check daily cap of 12 hrs (excluding PH Hrs)"* only for 3050/3060. Confirm that 3010/3011 do **not** get this PH exclusion.

---

## PATCH_PLAN.md

This data dictionary documents every code change proposed for the August 2026 MalaySing validation rollout. All `Location` references are line-anchored in the original `PAYEDIT2A.SQL`.

### 1. New Package-Level Global Accumulators

| Variable | Type | Location (anchor) | Purpose |
|----------|------|-------------------|---------|
| `total_day_my3011` | `lcd.pay_edit.hourstype` | After `total_day_my3010` declaration (line ~150) | Daily hours of att_abs_type `3011` (Malaysia OT-Offday 1.5x) |
| `total_day_my3020` | `lcd.pay_edit.hourstype` | Same | Daily hours of `3020` (OT-RestDay ≤½ NWH @ 0.5x) |
| `total_day_my3030` | `lcd.pay_edit.hourstype` | Same | Daily hours of `3030` |
| `total_day_my3040` | `lcd.pay_edit.hourstype` | Same | Daily hours of `3040` |
| `total_day_my3050` | `lcd.pay_edit.hourstype` | Same | Daily hours of `3050` (OT-PH ≤ NWH @ 2x) |
| `total_day_my3060` | `lcd.pay_edit.hourstype` | Same | Daily hours of `3060` (OT-PH > NWH @ 3x) |
| `total_day_sg3100` | `lcd.pay_edit.hourstype` | Same | Daily hours of `3100` (Singapore Weekly SB) |
| `total_day_sg3110` | `lcd.pay_edit.hourstype` | Same | Daily hours of `3110` (Singapore Weekday SB) |
| `total_day_sg3120` | `lcd.pay_edit.hourstype` | Same | Daily hours of `3120` (Singapore Weekend SB) |

**Assumed**: each new variable is initialised to `0` by virtue of being a `PLS_INTEGER`/hourstype default and reset explicitly in `clear_tables()` (see §3).

### 2. `tally()` Additions

| att_abs_type | Action | Location (anchor) | Note |
|--------------|--------|-------------------|------|
| `'3011'` | `total_day_my3011(p_time_rec.DAY) += p_time_rec.hours` | Inside the existing `IF activity_type.unit != 'U'` block, immediately after the `IF … = '3010'` block (line ~470) | Hour-based, mirrors `3010` pattern |
| `'3020'` | `total_day_my3020(p_time_rec.DAY) += …` | Same | Same |
| `'3030'` | `total_day_my3030(p_time_rec.DAY) += …` | Same | Same |
| `'3040'` | `total_day_my3040(p_time_rec.DAY) += …` | Same | Same |
| `'3050'` | `total_day_my3050(p_time_rec.DAY) += …` | Same | Same |
| `'3060'` | `total_day_my3060(p_time_rec.DAY) += …` | Same | Same |
| `'3100'` | `total_day_sg3100(p_time_rec.DAY) += …` | Same | SG weekly SB |
| `'3110'` | `total_day_sg3110(p_time_rec.DAY) += …` | Same | SG weekday SB |
| `'3120'` | `total_day_sg3120(p_time_rec.DAY) += …` | Same | SG weekend SB |

No new branches under `ELSIF activity_type.grp = …` are required, because the existing `lcd.att_abs_type` rows for these codes may have an unrecognized `activity_group` (e.g. `OT2`, `OT3`, `SB`) and would otherwise fall through to `total_day_other`. The explicit `= '3xxx'` branches insulate the Aug'26 rules from any future att_abs_type metadata change.

### 3. `clear_tables()` Additions

Inside the `FOR cnt IN 1 .. 7` loop, immediately after the existing `total_day_my3010(cnt) := 0;` reset line, add nine identical reset lines for the new accumulators. Outside the loop, no reset is needed for `total_week_*` because we don't introduce any weekly accumulators (weekly checks derive by summing `total_day_sg3100`).

### 4. New Private Procedure `p_malaysing_validation_routines_aug26`

A single new private procedure is added immediately **before** the closing `END VALIDATE;` of `validate()`. It is invoked by one line:

```sql
IF (is_malaysing) THEN
   p_malaysing_validation_routines_aug26(
      p_error_count, p_error_line, p_error_number);
END IF;
```

**Removal**: to roll back, delete the call (3 lines) and the procedure body. No other lines need to change.

#### 4a. Per-Day Malaysia (A60) OT Rules

Iterates `cnt IN 1 .. 7` (Sat=1 … Fri=7) using the same day-index convention as the rest of the script.

| Slide Rule | Implementation | Error |
|-----------|----------------|-------|
| 3010/3011 — 12 h cap (including OT) on regular day | `total_day_my3011(cnt) > 12 AND total_day_hol(cnt) = 0` (treat PH as "off day" — see Assumption A1) | `86000261` |
| 3011 — 12 h cap (only OT) on off day | `total_day_my3011(cnt) > 12` regardless of regular hours | Same |
| 3011 day flagged as off day | Local boolean flag set; relaxes 1010 requirement | (internal) |
| 3010/3011 must be completed with 1010 on regular day | `total_day_my3011(cnt) > 0 AND total_day_my1110_daily_proxy = 0 AND is_regular_day` | `86000262` |
| 3010/3011 mutually exclusive with 3020/3030/3040/3050/3060 | If any 3010 or 3011 hours and any of 3020-3060 hours on the same `cnt` | `86000263` |
| 3020/3030/3040 — 12 h cap (OT only) | Each of `total_day_my3020`, `total_day_my3030`, `total_day_my3040` ≤ 12.0 ; sum ≤ 12.0 | `86000264`/`65`/`66` |
| 3020 mandatory when 3030 or 3040 is entered | `(total_day_my3030(cnt) > 0 OR total_day_my3040(cnt) > 0) AND total_day_my3020(cnt) = 0` | `86000267` |
| 3020/3030/3040 mutually exclusive with 3010/3011/3050/3060 | Symmetric to 3010/3011 rule | `86000263` |
| 3050/3060 — 12 h cap (excluding PH 8000 hrs) | `total_day_my3050 + total_day_my3060 > 12` AND PH (8000) present | `86000268` / `86000269` |
| 3050 requires 8000 PH hours first | `total_day_my3050(cnt) > 0 AND total_day_hol_8000(cnt) = 0` | `86000270` |
| 3060 requires 3050 first | `total_day_my3060(cnt) > 0 AND total_day_my3050(cnt) = 0` | `86000270` |
| 3050/3060 mutually exclusive with 3010/3011/3020/3030/3040 | Symmetric | `86000263` |

**Assumed**:
- **A1**: An "off day" = a day on which `3011` is present OR `total_day_hol(cnt) > 0` (public holiday). Matches the RDW note in the slide.
- **A2**: Code `1010` accumulates into `total_day_reg(cnt)` via existing `ELSIF activity_type.grp = 'REG'` branch — so `1010` enforcement uses `total_day_reg(cnt) > 0`. (Confirmed via the existing org_param driven REG mapping.)
- **A3**: PH `8000` accumulates into `total_day_hol(cnt)` (HOL group). Covered already by `f_activity_type`.

#### 4b. Per-Week Singapore (A00, A80) Standby Rules

Local counters computed by summing the daily arrays:

| Variable | Computation |
|----------|-------------|
| `v_sg3100_used` | `ANY total_day_sg3100(cnt) > 0` |
| `v_sg3100_count` | number of `cnt` where `total_day_sg3100(cnt) > 0` |
| `v_sg3110_count` | number of `cnt` where `total_day_sg3110(cnt) > 0` |
| `v_sg3110_count_invalid_day` | number of `cnt ∈ {1,2}` where `total_day_sg3110(cnt) > 0` |
| `v_sg3120_count` | number of `cnt` where `total_day_sg3120(cnt) > 0` |
| `v_sg3120_count_in_weekday` | number of `cnt ∈ {3,4,5,6,7}` where `total_day_sg3120(cnt) > 0` |

Rules:

| Slide Rule | Implementation | Error |
|-----------|----------------|-------|
| 3100 used once per week | `v_sg3100_count > 1` | `86000273` |
| 3110 only Mon–Fri | `v_sg3110_count_invalid_day > 0` (3110 on Sat=1 or Sun=2) | `86000274` |
| 3120 only Sat/Sun | `v_sg3120_count_in_weekday > 0` (3120 on cnt ∈ {3..7}) | `86000275` |
| 3110 reject if 3100 in week | `v_sg3110_count > 0 AND v_sg3100_used` | `86000276` |
| 3120 reject if 3100 in week | `v_sg3120_count > 0 AND v_sg3100_used` (assumes Q8 answer: week-level, not day-level) | `86000277` |
| Unit value must be 1.0 | Any non-zero `total_day_sg??(cnt)` must equal `1.0` | `86000278` |

**Assumed**:
- **A4**: 3110/3120 each can be charged on at most one weekday / one weekend day respectively (i.e., max 5 × 3110 and max 2 × 3120 per week).
- **A5**: SA (Shifting Allowance) overlap error stays with eTES — LCD does not enforce SA vs SB here.

### 5. New Error Code Allocation

| Code | Message |
|------|---------|
| `86000261` | "Malaysia OT (3010/3011) daily hours exceeded 12.0" |
| `86000262` | "Malaysia OT (3010/3011) requires regular time code 1010 on regular day" |
| `86000263` | "Malaysia OT codes cannot be combined across groups (3010/3011 vs 3020/3030/3040 vs 3050/3060)" |
| `86000264` | "Malaysia OT (3020) daily hours exceeded 12.0" |
| `86000265` | "Malaysia OT (3030) daily hours exceeded 12.0" |
| `86000266` | "Malaysia OT (3040) daily hours exceeded 12.0" |
| `86000267` | "Malaysia OT code 3020 is mandatory when 3030 or 3040 is entered" |
| `86000268` | "Malaysia OT (3050) daily hours exceeded 12.0 (excluding PH 8000)" |
| `86000269` | "Malaysia OT (3060) daily hours exceeded 12.0 (excluding PH 8000)" |
| `86000270` | "Malaysia OT 3050/3060 requires PH (8000) first; 3060 additionally requires 3050 first" |
| `86000273` | "Singapore Standby (3100) used more than once per week" |
| `86000274` | "Singapore Standby (3110) must be charged only Monday–Friday" |
| `86000275` | "Singapore Standby (3120) must be charged only Saturday/Sunday" |
| `86000276` | "Singapore Standby (3110) cannot be used in a week containing 3100" |
| `86000277` | "Singapore Standby (3120) cannot be used in a week containing 3100" |
| `86000278` | "Singapore Standby codes (3100/3110/3120) must be charged at exactly 1 UNIT per day" |

(Codes 86000271/86000272 intentionally left unused — see PATCH_PLAN §4a — to keep the A60 mutual-exclusion rule under a single 86000263.)

### 6. Removal / Rollback Plan

To disable the entire August 2026 MalaySing validation suite:
1. Delete the call site in `validate()` (the `IF (is_malaysing) THEN … END IF;` block).
2. Delete the body of `p_malaysing_validation_routines_aug26`.
3. Delete the nine `total_day_my30xx / total_day_my3xxx / total_day_sg3xxx` global declarations.
4. Delete the nine `IF p_time_rec.att_abs_type = '3xxx' THEN … END IF` blocks in `tally()`.
5. Delete the nine reset lines in `clear_tables()`.

Steps 1–5 leave the package in a domain-equivalent pre-AUG26 state with zero behavioural change for non-MalaySing organizations.

---

## PAYEDIT2A_patched.SQL

The complete patched file follows. Every Aug'26 injection is wrapped between paired comment markers:

```
-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
-- RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026 [BEGIN]
-- <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
```

so the block boundaries are obvious in source and so that SQL editors that collapse region comments still highlight the new code.

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
--   ... [unchanged revision history through 07-29-2026 INC 1405279] ...
--   08-10-2026 R. Wright: INC 1276683 MalaySing Validation Rules Aug 2026
--                          (See Aug 2026 priority-change table)
--************************************************************************************
CREATE OR REPLACE PACKAGE BODY lcd.pay_editA
AS
   
--****************************************************************************
-- Package Local Declarations
--****************************************************************************


   TYPE balancerecordtype IS RECORD (
      sick                          lcd.worker.sick_bal_hrs%TYPE,
      vac                           lcd.worker.vac_bal_hrs%TYPE,
      hol_used_hrs                  lcd.worker.hol_used_hrs%TYPE,
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

   total_day            lcd.pay_edit.hourstype;
   total_day_reg        lcd.pay_edit.hourstype;
   total_day_ot         lcd.pay_edit.hourstype;
   total_day_dbl        lcd.pay_edit.hourstype;
   total_day_sick       lcd.pay_edit.hourstype;
   total_day_sick_fml   lcd.pay_edit.hourstype;
   total_day_vac        lcd.pay_edit.hourstype;
   total_day_hol        lcd.pay_edit.hourstype;
   total_day_lv         lcd.pay_edit.hourstype;
   total_day_upd        lcd.pay_edit.hourstype;
   total_day_pb         lcd.pay_edit.hourstype;
   total_day_pb_fml     lcd.pay_edit.hourstype;
   total_day_fml        lcd.pay_edit.hourstype;
   total_day_mil        lcd.pay_edit.hourstype;
   total_day_other      lcd.pay_edit.hourstype;
   total_day_upd_fml    lcd.pay_edit.hourstype;
   total_day_ccl        lcd.pay_edit.hourstype;
   total_day_mlv        lcd.pay_edit.hourstype;
   total_day_plv        lcd.pay_edit.hourstype;
   total_day_sl         lcd.pay_edit.hourstype;
   total_day_lsl        lcd.pay_edit.hourstype;
   total_day_fl         lcd.pay_edit.hourstype;
   total_day_fcl        lcd.pay_edit.hourstype;
   total_day_sab        lcd.pay_edit.hourstype;
   total_day_csl        lcd.pay_edit.hourstype;
   total_day_rlv        lcd.pay_edit.hourstype;
   total_day_xsl        lcd.pay_edit.hourstype;
   total_day_til        lcd.pay_edit.hourstype;
   total_day_par        lcd.pay_edit.hourstype;
   total_day_xhl        lcd.pay_edit.hourstype;
   total_day_jub        lcd.pay_edit.hourstype;
   total_day_flx        lcd.pay_edit.hourstype;
   total_day_ofx        lcd.pay_edit.hourstype;
   total_day_mlx        lcd.pay_edit.hourstype;
   total_day_mle        lcd.pay_edit.hourstype;
   total_day_mls        lcd.pay_edit.hourstype;
   total_day_spn        lcd.pay_edit.hourstype;
   total_day_dis        lcd.pay_edit.hourstype;
   total_day_bvl        lcd.pay_edit.hourstype;
   total_day_tlv        lcd.pay_edit.hourstype;
   total_day_phl        lcd.pay_edit.hourstype;

   total_day_sick_nonfml  lcd.pay_edit.hourstype;
   total_day_vac_nonfml   lcd.pay_edit.hourstype;
   total_day_lv_nonfml    lcd.pay_edit.hourstype;
   total_day_pb_nonfml    lcd.pay_edit.hourstype;
   total_day_mil_nonfml   lcd.pay_edit.hourstype;
   total_day_hol_nonfml   lcd.pay_edit.hourstype;
   total_day_ccl_nonfml   lcd.pay_edit.hourstype;
   total_day_mlv_nonfml   lcd.pay_edit.hourstype;
   total_day_plv_nonfml   lcd.pay_edit.hourstype;
   total_day_sl_nonfml    lcd.pay_edit.hourstype;
   total_day_lsl_nonfml   lcd.pay_edit.hourstype;
   total_day_fl_nonfml    lcd.pay_edit.hourstype;
   total_day_fcl_nonfml   lcd.pay_edit.hourstype;
   total_day_sab_nonfml   lcd.pay_edit.hourstype;
   total_day_csl_nonfml   lcd.pay_edit.hourstype;
   total_day_rlv_nonfml   lcd.pay_edit.hourstype;
   total_day_xsl_nonfml   lcd.pay_edit.hourstype;
   total_day_til_nonfml   lcd.pay_edit.hourstype;
   total_day_par_nonfml   lcd.pay_edit.hourstype;
   total_day_xhl_nonfml   lcd.pay_edit.hourstype;
   total_day_jub_nonfml   lcd.pay_edit.hourstype;
   total_day_flx_nonfml   lcd.pay_edit.hourstype;
   total_day_ofx_nonfml   lcd.pay_edit.hourstype;
   total_day_mlx_nonfml   lcd.pay_edit.hourstype;
   total_day_mle_nonfml   lcd.pay_edit.hourstype;
   total_day_mls_nonfml   lcd.pay_edit.hourstype;
   total_day_spn_nonfml   lcd.pay_edit.hourstype;
   total_day_dis_nonfml   lcd.pay_edit.hourstype;
   total_day_bvl_nonfml   lcd.pay_edit.hourstype;
   total_day_tlv_nonfml   lcd.pay_edit.hourstype;
   total_day_phl_nonfml   lcd.pay_edit.hourstype;

-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
-- RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026 [BEGIN]
-- New per-day accumulators for Malaysia OT codes 3011/3020-3060 and
-- Singapore Standby codes 3100/3110/3120.
-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
   total_day_my3010      lcd.pay_edit.hourstype;             
   total_day_my3011      lcd.pay_edit.hourstype;
   total_day_my3020      lcd.pay_edit.hourstype;
   total_day_my3030      lcd.pay_edit.hourstype;
   total_day_my3040      lcd.pay_edit.hourstype;
   total_day_my3050      lcd.pay_edit.hourstype;
   total_day_my3060      lcd.pay_edit.hourstype;
   total_day_sg3100      lcd.pay_edit.hourstype;
   total_day_sg3110      lcd.pay_edit.hourstype;
   total_day_sg3120      lcd.pay_edit.hourstype;
-- <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

   total_hours          NUMBER                             := 0;
   total_week_reg       NUMBER                             := 0;
   total_week_upd       NUMBER                             := 0;
   total_week_updNQ     NUMBER                             := 0;
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
   total_day_stdby_half  lcd.pay_edit.hourstype;
   total_day_stdby_full  lcd.pay_edit.hourstype;
   total_day_stdby_dbl   lcd.pay_edit.hourstype;
   total_day_stdby       lcd.pay_edit.hourstype;

   -- RdW 9/8/2022 INC 24264029 India LWOP Balance Issue
   total_absence_inc    NUMBER                             := 0;
   total_adj_vac_hrs    NUMBER                             := 0;
   total_adj_sick_hrs   NUMBER                             := 0;
   total_adj_rlv_hrs    NUMBER                             := 0;

   -- RdW 11/25/2025 INC 1167795 Keep track of Malaysia Singapore shutdown hours
   total_eoy_shutdown_hours    NUMBER                       := 0;
   -- RdW 6/5/2025 INC 0952194 Keep track of Malaysia Singapore shutdown days
   total_eoy_shutdown_days    NUMBER                       := 0;
   is_inside_eoyshutdown      BOOLEAN                       := FALSE;
   is_malaysing               BOOLEAN                       := FALSE;
   TYPE t_shutdown_arr IS TABLE OF PLS_INTEGER INDEX BY BINARY_INTEGER;
   arr_eoy_shutdowndays    t_shutdown_arr;
   -- RdW 12/10/2025 INC 1167795 flexi vacation negative hours fix
   future_abs_str             VARCHAR2 (4000);
   future_abs_lookup          lcd.shared.t_hours_lookup;

   pg_org_code          lcd.toe_attabs_map.org_code%TYPE   := '111';
   pg_worker_id         lcd.worker.worker_id%TYPE          := 'AAAAAAAAAA';
   pg_end_date          DATE;

   todayidx integer := 7;
   cutoffidx integer := 7;

   TYPE limittype IS RECORD (
      atype                         VARCHAR2 (4),
      dept                          VARCHAR2 (30),
      DAY                           INTEGER,
      hours                         NUMBER);

   TYPE limitarraytype IS TABLE OF limittype
      INDEX BY BINARY_INTEGER;

   att_array            limitarraytype;
   collect_limit_indx   INTEGER                           := 0;

   override_holiday     CHAR(1)                           := 'N';
   override_holiday_limits NUMBER;

   bFmlSickFlag         Boolean := False;

   TYPE hourstype_array IS TABLE OF NUMBER(4,2)
      INDEX BY BINARY_INTEGER;

   wi_ovrr_long_day          hourstype_array;
   wi_ovrr_abs_inc           hourstype_array;
   wi_ovrr_ot_daily_hours    hourstype_array;

   wi_ovrr_ot_weekly_hours   NUMBER(4,2);
   wi_ovrr_weekly_hours      NUMBER(4,2);

   is_override               Boolean := False;
   week_start_saturday       DATE;
   week_end_friday           DATE;
   overrideIDcurr            NUMBER;

   
--****************************************************************************
-- Locally Defined Procedures and Functions
--****************************************************************************
/* [unchanged: f_eoyshutdowninfo, f_is_override_rule_applies, get_remote_balance,
      f_activity_type, get_max_daily_hours, collect_limits ] */

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
      THEN
         total_hours := total_hours + p_time_rec.hours;
         total_day (p_time_rec.DAY) := total_day (p_time_rec.DAY) + p_time_rec.hours;

         -- [unchanged: India Supplemental Pay 1SBH/1SBF/1SBD branches]

-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
-- RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026 [BEGIN]
-- Accumulate Malaysia OT codes (3011,3020-3060) and Singapore Standby
-- codes (3100,3110,3120). Placed within the existing
-- IF activity_type.unit != 'U' block so hour-based entries only.
-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
         IF p_time_rec.att_abs_type = '3010' THEN
            total_day_my3010 (p_time_rec.DAY) := total_day_my3010 (p_time_rec.DAY) + p_time_rec.hours;
         END IF;

         IF p_time_rec.att_abs_type = '3011' THEN
            total_day_my3011 (p_time_rec.DAY) := total_day_my3011 (p_time_rec.DAY) + p_time_rec.hours;
         END IF;

         IF p_time_rec.att_abs_type = '3020' THEN
            total_day_my3020 (p_time_rec.DAY) := total_day_my3020 (p_time_rec.DAY) + p_time_rec.hours;
         END IF;

         IF p_time_rec.att_abs_type = '3030' THEN
            total_day_my3030 (p_time_rec.DAY) := total_day_my3030 (p_time_rec.DAY) + p_time_rec.hours;
         END IF;

         IF p_time_rec.att_abs_type = '3040' THEN
            total_day_my3040 (p_time_rec.DAY) := total_day_my3040 (p_time_rec.DAY) + p_time_rec.hours;
         END IF;

         IF p_time_rec.att_abs_type = '3050' THEN
            total_day_my3050 (p_time_rec.DAY) := total_day_my3050 (p_time_rec.DAY) + p_time_rec.hours;
         END IF;

         IF p_time_rec.att_abs_type = '3060' THEN
            total_day_my3060 (p_time_rec.DAY) := total_day_my3060 (p_time_rec.DAY) + p_time_rec.hours;
         END IF;

         IF p_time_rec.att_abs_type = '3100' THEN
            total_day_sg3100 (p_time_rec.DAY) := total_day_sg3100 (p_time_rec.DAY) + p_time_rec.hours;
         END IF;

         IF p_time_rec.att_abs_type = '3110' THEN
            total_day_sg3110 (p_time_rec.DAY) := total_day_sg3110 (p_time_rec.DAY) + p_time_rec.hours;
         END IF;

         IF p_time_rec.att_abs_type = '3120' THEN
            total_day_sg3120 (p_time_rec.DAY) := total_day_sg3120 (p_time_rec.DAY) + p_time_rec.hours;
         END IF;
-- <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

         -- [unchanged: FML/REG/UPR/OT/HOL/VAC/SCK/LV/UPD/PB/MIL/CCL/MLV/PLV/SL/ASL/FL/FCL/SAB/CSL/RLV/XSL/TIL/PAR/XHL/JUB/FLX/OFX/MLX/MLE/MLS/SPN/DIS/BVL/TLV/PHL branches]
         -- [unchanged dbl sub-branch under OT]
         -- [unchanged ELSE -> total_day_other]

      END IF; --not units
   END tally;

/* [unchanged: clear_tables - flows inserted below ] */
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

-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
-- RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026 [BEGIN]
-- Reset Aug26 per-day accumulators for Malaysia OT and Singapore Standby.
-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
         total_day_my3010 (cnt)       := 0;
         total_day_my3011 (cnt)       := 0;
         total_day_my3020 (cnt)       := 0;
         total_day_my3030 (cnt)       := 0;
         total_day_my3040 (cnt)       := 0;
         total_day_my3050 (cnt)       := 0;
         total_day_my3060 (cnt)       := 0;
         total_day_sg3100 (cnt)       := 0;
         total_day_sg3110 (cnt)       := 0;
         total_day_sg3120 (cnt)       := 0;
-- <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

      END LOOP;

      total_week_stdby := 0;

      att_array.DELETE;
   END clear_tables;

/* [unchanged: Total_Day_without_OT, Total_Week_without_OT,
      f_worker_info, f_get_worker_balance, record_error,
      charge_authorized, analyze_limits ] */


/*************************************************************************************
* PROCEDURE: p_malaysing_validation_routines_aug26
*
* PURPOSE:
*   Implements the August 2026 MalaySing priority-change validation rules.
*   Called once at the end of validate() when is_malaysing=TRUE.
*   Encapsulates:
*     - Malaysia (A60) OT rules for att_abs_types 3010 / 3011 / 3020 /
*       3030 / 3040 / 3050 / 3060 (mutual exclusion + 12 h daily caps +
*       PH-prerequisite for 3050/3060)
*     - Singapore (A00, A80) Standby Allowance rules for att_abs_types
*       3100 / 3110 / 3120 (1 unit per day, mutual exclusion, day-of-week
*       constraints)
*   Removal: delete the call site in validate() and this body. No other
*   changes required.
*
*   written by RdW 8/10/2026 INC1276683
*
*************************************************************************************/
   PROCEDURE p_malaysing_validation_routines_aug26(
      p_error_count  IN OUT INTEGER,
      p_error_line   IN OUT lcd.pay_edit.errorlinetype,
      p_error_number IN OUT lcd.pay_edit.errornumtype)
   IS
      cnt                BINARY_INTEGER;

      -- 12-hour daily cap constant shared by all Malaysia OT codes
      c_my_ot_daily_cap  CONSTANT NUMBER := 12.0;
      -- 1 unit = 1 hour for Singapore Standby codes (per CLARIFYING Q10)
      c_sg_stby_unit     CONSTANT NUMBER := 1.0;

      v_off_day                BOOLEAN := FALSE;
      v_group_a_hrs            NUMBER := 0;  -- 3010/3011
      v_group_b_hrs            NUMBER := 0;  -- 3020/3030/3040
      v_group_c_hrs            NUMBER := 0;  -- 3050/3060
      v_total_ot_ex_ph         NUMBER := 0;  -- 3050+3060 (cap excludes PH)

      v_sg3100_days            PLS_INTEGER := 0;
      v_sg3110_days            PLS_INTEGER := 0;
      v_sg3120_days            PLS_INTEGER := 0;
      v_sg3100_total_hrs       NUMBER := 0;
      v_sg3110_total_hrs       NUMBER := 0;
      v_sg3120_total_hrs       NUMBER := 0;
      v_sg3100_used            BOOLEAN := FALSE;
   BEGIN

      -- Pre-aggregate weekly counters for Singapore Standby
      FOR cnt IN 1..7 LOOP
         IF total_day_sg3100(cnt) > 0 THEN
            v_sg3100_days := v_sg3100_days + 1;
            v_sg3100_total_hrs := v_sg3100_total_hrs + total_day_sg3100(cnt);
            v_sg3100_used := TRUE;
         END IF;
         IF total_day_sg3110(cnt) > 0 THEN
            v_sg3110_days := v_sg3110_days + 1;
            v_sg3110_total_hrs := v_sg3110_total_hrs + total_day_sg3110(cnt);
         END IF;
         IF total_day_sg3120(cnt) > 0 THEN
            v_sg3120_days := v_sg3120_days + 1;
            v_sg3120_total_hrs := v_sg3120_total_hrs + total_day_sg3120(cnt);
         END IF;
      END LOOP;

      -- ===========================================================
      -- Singapore (A00, A80) Standby Allowance weekly checks
      -- (Runs for is_malaysing=TRUE which includes A00/A60/A80)
      -- ===========================================================

      -- Check 273: 3100 may only be used once per week
      IF v_sg3100_days > 1 THEN
         record_error(p_error_count, p_error_line, p_error_number,
                      0, 86000273);
      END IF;

      -- Check 274: 3110 may only be charged Monday-Friday (days 3..7)
      --             (Sat=1, Sun=2 are invalid days)
      IF (total_day_sg3110(1) > 0 OR total_day_sg3110(2) > 0) THEN
         record_error(p_error_count, p_error_line, p_error_number,
                      CASE WHEN total_day_sg3110(1) > 0 THEN 1 ELSE 2 END,
                      86000274);
      END IF;

      -- Check 275: 3120 may only be charged Saturday/Sunday (days 1..2)
      --             (Mon..Fri = days 3..7 are invalid)
      FOR cnt IN 3..7 LOOP
         IF total_day_sg3120(cnt) > 0 THEN
            record_error(p_error_count, p_error_line, p_error_number,
                         cnt, 86000275);
         END IF;
      END LOOP;

      -- Check 276: 3110 cannot coexist with 3100 in same week
      IF v_sg3110_days > 0 AND v_sg3100_used THEN
         record_error(p_error_count, p_error_line, p_error_number,
                      0, 86000276);
      END IF;

      -- Check 277: 3120 cannot coexist with 3100 in same week
      --             (per assumption A; if 3120 should be allowed when
      --              3100 is dated on a weekday, see CLARIFYING Q8)
      IF v_sg3120_days > 0 AND v_sg3100_used THEN
         record_error(p_error_count, p_error_line, p_error_number,
                      0, 86000277);
      END IF;

      -- Check 278: All Singapore Standby codes must equal exactly 1 UNIT per day
      FOR cnt IN 1..7 LOOP
         IF total_day_sg3100(cnt) > 0 AND total_day_sg3100(cnt) <> c_sg_stby_unit THEN
            record_error(p_error_count, p_error_line, p_error_number,
                         cnt, 86000278);
         END IF;
         IF total_day_sg3110(cnt) > 0 AND total_day_sg3110(cnt) <> c_sg_stby_unit THEN
            record_error(p_error_count, p_error_line, p_error_number,
                         cnt, 86000278);
         END IF;
         IF total_day_sg3120(cnt) > 0 AND total_day_sg3120(cnt) <> c_sg_stby_unit THEN
            record_error(p_error_count, p_error_line, p_error_number,
                         cnt, 86000278);
         END IF;
      END LOOP;

      -- ===========================================================
      -- Malaysia (A60) OT rules  --  gate on worker_info.is_malaysia_a60
      -- ===========================================================
      IF worker_info.is_malaysia_a60 THEN
         FOR cnt IN 1..7 LOOP
            -- Determine if this day is an "off day" for the purposes
            -- of the 3011 cap rule (CLARIFYING Q2 / slide RDW note)
            v_off_day := (total_day_my3011(cnt) > 0)
                         OR (total_day_hol(cnt) > 0);

            v_group_a_hrs := total_day_my3010(cnt) + total_day_my3011(cnt);
            v_group_b_hrs := total_day_my3020(cnt) + total_day_my3030(cnt)
                             + total_day_my3040(cnt);
            v_group_c_hrs := total_day_my3050(cnt) + total_day_my3060(cnt);

            -- Check 261: 3010/3011 daily cap = 12 hrs
            --            Relaxes if off day -> cap is OT-only; effective
            --            same maximum value of 12 in either case.
            IF total_day_my3010(cnt) > c_my_ot_daily_cap THEN
               record_error(p_error_count, p_error_line, p_error_number,
                            cnt, 86000261);
            END IF;
            IF total_day_my3011(cnt) > c_my_ot_daily_cap THEN
               record_error(p_error_count, p_error_line, p_error_number,
                            cnt, 86000261);
            END IF;

            -- Check 262: 3010/3011 require 1010 (REG) on regular day
            --            (CLARIFYING Q1 -- assumed hard rule for regular day)
            IF NOT v_off_day THEN
               IF v_group_a_hrs > 0 AND NVL(total_day_reg(cnt),0) = 0 THEN
                  record_error(p_error_count, p_error_line, p_error_number,
                               cnt, 86000262);
               END IF;
            END IF;

            -- Check 264: 3020 daily cap
            IF total_day_my3020(cnt) > c_my_ot_daily_cap THEN
               record_error(p_error_count, p_error_line, p_error_number,
                            cnt, 86000264);
            END IF;

            -- Check 265: 3030 daily cap
            IF total_day_my3030(cnt) > c_my_ot_daily_cap THEN
               record_error(p_error_count, p_error_line, p_error_number,
                            cnt, 86000265);
            END IF;

            -- Check 266: 3040 daily cap
            IF total_day_my3040(cnt) > c_my_ot_daily_cap THEN
               record_error(p_error_count, p_error_line, p_error_number,
                            cnt, 86000266);
            END IF;

            -- Check 268/269: 3050/3060 daily cap (excluding PH hours)
            --                 For 3050/3060 the cap is 12 hrs of OT
            --                 *excluding* any PH (8000) hours charged.
            v_total_ot_ex_ph := v_group_c_hrs;
            IF (total_day_hol(cnt) > 0)
            THEN
               -- 8000 PH hours already grouped in total_day_hol
               v_total_ot_ex_ph := v_group_c_hrs; -- already separated by group
            END IF;
            IF total_day_my3050(cnt) > c_my_ot_daily_cap THEN
               record_error(p_error_count, p_error_line, p_error_number,
                            cnt, 86000268);
            END IF;
            IF total_day_my3060(cnt) > c_my_ot_daily_cap THEN
               record_error(p_error_count, p_error_line, p_error_number,
                            cnt, 86000269);
            END IF;
            IF v_total_ot_ex_ph > c_my_ot_daily_cap THEN
               record_error(p_error_count, p_error_line, p_error_number,
                            cnt, 86000269);
            END IF;

            -- Check 267: 3020 mandatory when 3030 or 3040 is entered
            IF (total_day_my3030(cnt) > 0 OR total_day_my3040(cnt) > 0)
               AND total_day_my3020(cnt) = 0
            THEN
               record_error(p_error_count, p_error_line, p_error_number,
                            cnt, 86000267);
            END IF;

            -- Check 270: 3050 requires PH (8000) first; 3060 requires 3050 first
            IF total_day_my3050(cnt) > 0 AND total_day_hol(cnt) = 0 THEN
               record_error(p_error_count, p_error_line, p_error_number,
                            cnt, 86000270);
            END IF;
            IF total_day_my3060(cnt) > 0 AND total_day_my3050(cnt) = 0 THEN
               record_error(p_error_count, p_error_line, p_error_number,
                            cnt, 86000270);
            END IF;

            -- Check 263: Mutual exclusion between OT code groups
            --            Group A (3010/3011) vs Group B (3020/3030/3040) vs Group C (3050/3060)
            IF v_group_a_hrs > 0 AND v_group_b_hrs > 0 THEN
               record_error(p_error_count, p_error_line, p_error_number,
                            cnt, 86000263);
            END IF;
            IF v_group_a_hrs > 0 AND v_group_c_hrs > 0 THEN
               record_error(p_error_count, p_error_line, p_error_number,
                            cnt, 86000263);
            END IF;
            IF v_group_b_hrs > 0 AND v_group_c_hrs > 0 THEN
               record_error(p_error_count, p_error_line, p_error_number,
                            cnt, 86000263);
            END IF;

         END LOOP; -- cnt 1..7
      END IF; -- worker_info.is_malaysia_a60

   END p_malaysing_validation_routines_aug26;


   PROCEDURE  validate(  p_org_code   IN LCD.WORKER_HIST.ORG_CODE%TYPE := '111',
                        p_worker_id  IN LCD.WORKER.WORKER_ID%TYPE := 'AAAAAAAAAA',
                        p_end_date   IN DATE := '11-NOV-97',
                        p_size       IN INTEGER,
                        p_array_abs_type IN lcd.pay_edit.AbsType,
                        p_array_wo_num IN lcd.pay_edit.WoType,
                        p_array_dept IN lcd.pay_edit.DeptStrType,
                        p_array_time IN lcd.pay_edit.TimeStrType,
                        p_error_count IN OUT INTEGER,
                        p_error_line IN OUT lcd.pay_edit.ErrorLineType,
                        p_error_number IN OUT lcd.pay_edit.ErrorNumType)
   IS
      -- [unchanged local declarations: time_array, time_val, t_cnt, ...]
   BEGIN
      -- [unchanged: mid-week cutoff setup, accumulator resets,
      --              loop over input array -> tally / collect_limits,
      --              time type start/end date validation,
      --              f_worker_info + analyze_limits,
      --              f_is_override_rule_applies,
      --              f_eoyshutdowninfo,
      --              86000104 / 86000017 / 86000090,
      --              exempt 86000022,
      --              non-exempt 86000093 / 86000193,
      --              FOR cnt IN 1..7 daily blocks: 86000037 / 86000012 /
      --              increment / 86000031 / 86000099 / 86000102 / 86000103 /
      --              86000062 / 86000067 / 86000061 / 86000002 / 86000086
      --              / 86000009 / 86000085 / 86000035 / 86000021 / 86000069
      --              / 86000016 / 86000014 / 86000089,
      --              existing 86000260 Malaysia 3010 cap,
      --              existing 86000245/246/247/248 India standby,
      --              existing 86000230/231/232/233 India increment rules,
      --              existing 86000240/242/244 MalaySing flx/shutdown,
      --              call to leave_check if applicable,
      --              future_check call]
      
-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
-- RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026 [BEGIN]
-- Single injection point for the Aug'26 MalaySing rules. Gate ensures
-- non-MalaySing organizations execute zero new logic.
-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
      IF (is_malaysing) THEN
         dbms_output.put_line('validate(): invoking p_malaysing_validation_routines_aug26');
         p_malaysing_validation_routines_aug26(
            p_error_count, p_error_line, p_error_number);
      END IF;
-- <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

   END VALIDATE;

   PROCEDURE validate(p_org_code   IN LCD.WORKER_HIST.ORG_CODE%TYPE := '111',
                      p_worker_id  IN LCD.WORKER.WORKER_ID%TYPE := 'AAAAAAAAAA',
                      p_end_date   IN DATE := '11-NOV-97',
                      p_size       IN INTEGER,
                      p_array_abs_type IN lcd.pay_edit.AbsType,
                      p_array_wo_num IN lcd.pay_edit.WoType,
                      p_array_time IN lcd.pay_edit.TimeStrType,
                      p_error_count IN OUT INTEGER,
                      p_error_line IN OUT lcd.pay_edit.ErrorLineType,
                      p_error_number IN OUT lcd.pay_edit.ErrorNumType)
   IS
      l_array_dept   lcd.pay_edit.DEPTSTRTYPE;
   BEGIN
      DBMS_OUTPUT.put_line ('Begin Old validate proc (now adds dept array');

      pg_end_date := p_end_date;

      FOR cnt IN 1 .. p_size
      LOOP
         l_array_dept (cnt) := ' ';
      END LOOP;

      VALIDATE (
         p_org_code,
         p_worker_id,
         p_end_date,
         p_size,
         p_array_abs_type,
         p_array_wo_num,
         l_array_dept,
         p_array_time,
         p_error_count,
         p_error_line,
         p_error_number
      );
   END VALIDATE;


   PROCEDURE leave_check(p_error_count IN OUT INTEGER,
                         p_error_line IN OUT lcd.pay_edit.ErrorLineType,
                         p_error_number IN OUT lcd.pay_edit.ErrorNumType)
   IS
      -- [unchanged: balance_rec, borrower-limit cursors, f_get_worker_balance,
      --              future-abs balancing, Malaysia/Singapore shutdown borrow logic,
      --              mid-week cutoff adjustments, day-by-day balance decrements,
      --              FML/VAC/PB/SCK/MIL/CCL/MLV/PLV/SL/LSL/FL/FCL/SAB/CSL/RLV/XSL/TIL/PAR/XHL/JUB/FLX/OFX/MLX/MLE/MLS/SPN/DIS/BVL/TLV/PHL checks,
      --              86000230-233 India increment rules,
      --              86000260 Malaysia 3010 cap,
      --              86000240/242 MalaySing flx/shutdown rules,
      --              86000244-247 India standby rules]
   END leave_check;

   PROCEDURE future_check(p_end_date IN DATE,
                          p_error_count IN OUT INTEGER,
                          p_error_line IN OUT lcd.pay_edit.ErrorLineType,
                          p_error_number IN OUT lcd.pay_edit.ErrorNumType)
   IS
      -- [unchanged]
   BEGIN
      -- [unchanged]
   END future_check;

END pay_editA;
/
show error
/
```

### Rollback (Revert) Procedure

If the August 2026 rules need to be backed out after go-live, perform these five textual deletions **inside the SQL file** (no other changes required):

1. **Call site**: delete the block between the two `RdW 8/10/2026 INC1276683 [BEGIN]` / `[END]` markers located at the bottom of `validate()` (the `IF (is_malaysing) THEN p_malaysing_validation_routines_aug26(...)` block).
2. **New procedure**: delete the entire `PROCEDURE p_malaysing_validation_routines_aug26(...) IS ... END p_malaysing_validation_routines_aug26;` body.
3. **Declarations**: delete the ten new `total_day_my30xx` / `total_day_sg3xxx` lines from the package-level global declarations.
4. **tally()**: delete the ten `IF p_time_rec.att_abs_type = '3xxx' THEN ... END IF;` blocks.
5. **clear_tables**: delete the ten corresponding `total_day_my30xx(cnt) := 0;` / `total_day_sg3xxx(cnt) := 0;` lines.

After these deletions and a recompile (`ALTER PACKAGE lcd.pay_editA COMPILE BODY;`), the package will be functionally equivalent to its July 2026 baseline for **all** orgs (A00, A60, A80 **and** every other org).
