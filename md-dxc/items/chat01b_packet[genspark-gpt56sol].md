I can’t directly create filesystem/download attachments in this chat environment. Below are the three file-ready artifacts. The SQL artifact is supplied as a surgical patch payload with exact insertion anchors, because reproducing the entire unchanged package body would be unnecessarily error-prone. Applying the listed insertions to the supplied source produces `PAYEDIT2A_patched.SQL`.

---

## `81/CLARIFYING_QUESTIONS.md`

```markdown
# Clarifying Questions — INC1276683 Malaysia/Singapore Validation Rules

## 1. Effective date

1. What is the exact production effective date?
   - This design assumes **August 1, 2026**.
   - Should validation be based on each individual calendar day, the week-ending date, or deployment date?
   - How should a pay week spanning July and August be handled?

## 2. Error-message reason codes

2. Are reason codes `86000261` through `86000270` available in the applicable reason-code/error-message tables?

3. What exact user-facing text and translated text should be registered for the new errors?

4. Should one consolidated error be returned per day/category, or should each individual violation produce a separate error?

## 3. Malaysia — applicable population

5. Do the Malaysia rules apply to:
   - every worker in organization `A60`, or
   - only particular salary groups, employee groups, personnel areas, or profiles?

   This design assumes all `A60` workers.

6. Should contractors in `A60` be subject to these rules?

   This design assumes yes because the requirements are time-type validations rather than leave-balance validations.

## 4. Malaysia — 3010 and 3011

7. The source table identifies time type `3010`, but its GHR Time Codes column lists both `3010` and `3011`. Should every rule in that row apply to both codes?

8. Is `3011` permitted on the same calendar day as `3010`?

   This design assumes no.

9. For `3010`, does “must enter regular time code 1010” mean:
   - any positive amount of `1010` is sufficient, or
   - `1010` must equal the employee’s normal scheduled hours, or
   - `1010` must reach a particular threshold before `3010` is permitted?

   This design assumes any positive `1010` amount is sufficient.

10. Is `1010` the only valid regular-time prerequisite, or should all time types mapped to activity group `REG` satisfy the prerequisite?

    This design checks exact time type `1010`.

11. Does the 12-hour regular-day cap mean:
    - `1010 + 3010 <= 12`, or
    - all non-absence working time plus `3010 <= 12`, or
    - every time entry on the day including absences plus `3010 <= 12`?

    This design assumes `1010 + 3010 <= 12`.

12. For `3011`, does the 12-hour off-day cap apply only to `3011`, or to all working/OT hours recorded that day?

    This design assumes `3011 <= 12`.

13. Does entering `3011` merely identify that calendar day as an off day, or must the script verify the day against the employee’s work schedule/calendar?

    This design treats positive `3011` as sufficient to classify the day as an off day.

14. The rule text ends with an incomplete bullet, “RDW:”. Is additional `3011` logic missing?

## 5. Malaysia — rest-day codes 3020/3030/3040

15. When either `3030` or `3040` is used, must `3020`:
    - merely be present with a positive amount, or
    - contain a prescribed number of hours?

    This design requires only a positive `3020` amount.

16. Does the 12-hour rest-day cap apply to:
    - `3020 + 3030 + 3040`, or
    - all non-absence hours recorded on that day?

    This design assumes `3020 + 3030 + 3040 <= 12`.

17. Can `3030` and `3040` be used together, provided `3020` is also present and the combined total is at most 12 hours?

    This design assumes yes.

18. The exclusions explicitly mention `3010` but not `3011`. Is `3011` also prohibited with `3020`, `3030`, and `3040`?

    This design assumes yes.

## 6. Malaysia — public-holiday codes 3050/3060

19. Does “Enter a PH (8000) first” mean:
    - time type `8000` must merely exist on the same calendar day, or
    - `8000` must precede `3050` in input/display order, or
    - the public holiday must exist in an authoritative holiday calendar?

    This design validates same-day presence of positive `8000` hours. It does not use input-row sequence.

20. Must `8000` contain a full scheduled day, or is any positive amount sufficient?

    This design assumes any positive amount is sufficient.

21. Before `3060` may be used, must `3050`:
    - merely be present, or
    - equal the employee’s normal working hours/NWH threshold?

    This design requires only a positive `3050` amount.

22. Does the 12-hour cap excluding PH hours mean:
    - `3050 + 3060 <= 12`, or
    - all entered hours except exact time type `8000` must total no more than 12?

    This design uses all hourly entries on the day except exact time type `8000`.

23. If another holiday time type maps to activity group `HOL`, should that also satisfy the PH prerequisite or be excluded from the daily cap?

    This design recognizes only exact time type `8000`.

## 7. Singapore — applicable population

24. Do the Singapore standby rules apply to every worker in organizations `A00` and `A80`, including contractors?

    This design assumes yes.

25. Is the workweek always Saturday through Friday for these validations?

    The supplied package represents day indexes as:
    - 1 = Saturday
    - 2 = Sunday
    - 3 = Monday
    - 4 = Tuesday
    - 5 = Wednesday
    - 6 = Thursday
    - 7 = Friday

    This design uses those indexes.

26. If organization configuration changes the weekly start day, should these rules use the configured calendar instead of the package’s Saturday-through-Friday indexes?

## 8. Singapore — unit interpretation

27. Are `3100`, `3110`, and `3120` configured in `LCD.ATT_ABS_TYPE` with `UNIT_FLAG = 'U'`?

28. Is a submitted value of `1.00` represented in `p_array_time` as `0100`?

    This design relies on the existing `/ 100` conversion.

29. Should fractional, negative, or zero units be rejected explicitly?

    The existing input normalization only tallies positive values. This design rejects positive daily totals other than exactly 1.

## 9. Singapore — weekly and daily behavior

30. Does “3110 one time every weekday” mean:
    - 3110 may only be used Monday through Friday, at most once per used day, or
    - an employee selecting 3110 must enter it on all five weekdays?

    This design assumes it is optional per weekday and does not require all five weekdays.

31. Does “3120 one time on weekend days” mean it is optional on Saturday and/or Sunday, rather than requiring both days?

    This design assumes it is optional per weekend day.

32. May `3110` and `3120` be used in the same week on their respective valid days?

    This design assumes yes.

33. Does weekly `3100` prohibit both `3110` and `3120` anywhere in the same Saturday-through-Friday week?

    This design assumes yes.

34. If weekly `3100` is entered, is its actual entry date relevant to the allowance coverage period, or is it simply one unit anywhere in the current timesheet week?

    This design treats it as one unit anywhere in the current timesheet week.

35. What time types are included by “SA & SB” in the overlap rule?
    - Does SA mean Shift Allowance?
    - Are there additional SA codes beyond `3100`, `3110`, and `3120`?

    This design checks overlap only among `3100`, `3110`, and `3120` because no other codes were supplied.

36. If other SA/SB codes must be included, please provide their exact time-type codes and organization mappings.

## 10. Interaction with existing rules

37. Existing check `86000260` validates that Malaysia `3010` alone does not exceed 12 hours, and it currently runs in `leave_check`. Should it:
    - remain as a fallback,
    - be retired in favor of the new consolidated validation, or
    - have its message broadened to describe the new cap?

38. Is `leave_check` guaranteed to run after every successful `validate` call?

    The proposed design places the new rules in `validate`, so they do not depend on the optional `leave_check` call.

39. Should existing generic validations such as `86000037`, time limits, authorization, and OT eligibility continue to run in addition to these new rules?

    This design leaves all existing validations unchanged.

40. If both an existing generic validation and a new specific validation identify the same entry, should both messages be returned?
```

---

## `81/PATCH_PLAN.md`

```markdown
# Patch Plan — INC1276683 Malaysia/Singapore Validation Rules

## 1. Objective

Implement the August 2026 priority validation rules for:

- Malaysia: organization `A60`
- Singapore: organizations `A00` and `A80`

The implementation is intentionally organization-scoped and isolated from existing U.S., Canada, India, Japan, and other organization logic.

## 2. Design principles

1. Do not change the classification or totals used by existing validations.
2. Capture only the exact time types required by INC1276683.
3. Keep the validation logic in one package-local procedure.
4. Invoke the procedure only after the existing tally and worker-information processing has completed.
5. Gate all new behavior by organization and by the assumed effective date.
6. Continue running all existing validations.
7. Do not add database DML for reason-code/message tables to this package-body script.
8. Prefix every injected section with:

   `--RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026`

## 3. Effective-date assumption

The patch assumes an effective date of:

`DATE '2026-08-01'`

The check is applied using the calendar date represented by each daily array index:

`p_end_date - (7 - day_index)`

This corresponds to the existing package convention:

| Day index | Calendar day |
|---:|---|
| 1 | Saturday |
| 2 | Sunday |
| 3 | Monday |
| 4 | Tuesday |
| 5 | Wednesday |
| 6 | Thursday |
| 7 | Friday |

## 4. New package data dictionary

### 4.1 `t_aug26_totals`

| Attribute | Definition |
|---|---|
| Type | Associative array of `NUMBER` indexed by `VARCHAR2` |
| Scope | Package-local |
| Purpose | Stores daily totals for only the INC1276683 time types |
| Key format | `<time_type>:<day_index>` |
| Example | `3010:3` is Malaysia 3010 total for Monday |

### 4.2 `g_aug26_totals`

| Attribute | Definition |
|---|---|
| Type | `t_aug26_totals` |
| Scope | Package-local |
| Lifecycle | Cleared by `clear_tables` before each validation |
| Effect on existing totals | None |

### 4.3 Captured time types

| Time type | Organization | Purpose |
|---|---|---|
| 1010 | A60 | Exact regular-time prerequisite and cap component |
| 3010 | A60 | Workday OT |
| 3011 | A60 | Off-day OT |
| 3020 | A60 | Rest-day base OT |
| 3030 | A60 | Rest-day additional tier |
| 3040 | A60 | Rest-day additional tier |
| 3050 | A60 | Public-holiday base OT |
| 3060 | A60 | Public-holiday additional tier |
| 8000 | A60 | Exact public-holiday prerequisite/cap exclusion |
| 3100 | A00/A80 | Weekly standby unit |
| 3110 | A00/A80 | Weekday standby unit |
| 3120 | A00/A80 | Weekend standby unit |

## 5. New helper routines

### 5.1 `f_aug26_total`

Returns the captured total for a time type and day. Returns zero when no matching entry was captured.

### 5.2 `p_aug26_tally`

Adds the normalized input value to `g_aug26_totals`.

It is called before the existing `UNIT_FLAG != 'U'` condition. This is necessary because Singapore standby time types are expected to be unit-based and the current `tally` procedure intentionally excludes units from hour totals.

This helper does not modify:

- `total_day`
- `total_day_ot`
- `total_week_ot`
- standby totals used by India
- leave balances
- time-limit collections

### 5.3 `p_validate_aug26_malaysing`

A package-local validation procedure receiving:

- week-ending date
- existing error count
- existing error-line array
- existing error-number array

It uses `record_error` and the isolated totals to append validation errors without changing existing control flow.

## 6. Malaysia validation design

### 6.1 Daily family definitions

| Family | Codes |
|---|---|
| Work/off-day | 3010, 3011 |
| Rest-day | 3020, 3030, 3040 |
| Public holiday | 3050, 3060 |

### 6.2 Rules

| Rule | Assumed implementation |
|---|---|
| 3010 regular-day cap | `1010 + 3010 <= 12` |
| 3010 regular prerequisite | Positive 3010 requires positive exact time type 1010 |
| 3011 off-day cap | `3011 <= 12` |
| 3010/3011 coexistence | Prohibited |
| Cross-family coexistence | Work/off-day, rest-day, and PH families cannot be mixed on the same day |
| Rest-day cap | `3020 + 3030 + 3040 <= 12` |
| 3020 mandatory | Positive 3030 or 3040 requires positive 3020 |
| PH prerequisite | Positive 3050 or 3060 requires positive 8000 |
| 3050 prerequisite | Positive 3060 requires positive 3050 |
| PH daily cap | Existing hourly total for the day minus exact 8000 hours must be <= 12 |

The PH cap uses `total_day(day) - 8000` because the rule says to exclude PH hours. Unit entries are not included in `total_day`.

## 7. Singapore validation design

### 7.1 3100

- Positive daily total must be exactly one unit.
- Weekly total must be exactly one unit.
- Cannot coexist in the week with 3110 or 3120.
- May be entered on any day.

### 7.2 3110

- Positive daily total must be exactly one unit.
- Only allowed Monday through Friday, corresponding to indexes 3–7.
- May coexist in the same week with 3120.
- Cannot coexist in a week containing 3100.

### 7.3 3120

- Positive daily total must be exactly one unit.
- Only allowed Saturday or Sunday, corresponding to indexes 1–2.
- May coexist in the same week with 3110.
- Cannot coexist in a week containing 3100.

### 7.4 Daily overlap

The total units among 3100, 3110, and 3120 may not exceed one on a calendar day.

No other SA codes are included until exact codes are supplied.

## 8. Proposed error-code dictionary

The reason-code table must be populated separately before deployment.

| Error code | Scope | Proposed meaning |
|---:|---|---|
| 86000261 | A60 | Malaysia overtime daily 12-hour cap exceeded |
| 86000262 | A60 | Malaysia 3010 requires regular time type 1010 |
| 86000263 | A60 | Incompatible Malaysia OT families entered on the same day |
| 86000264 | A60 | Malaysia 3030/3040 requires 3020 |
| 86000265 | A60 | Malaysia 3050/3060 requires public holiday time type 8000 |
| 86000266 | A60 | Malaysia 3060 requires 3050 |
| 86000267 | A00/A80 | Singapore standby entry must equal one unit |
| 86000268 | A00/A80 | Singapore standby code entered on an invalid day |
| 86000269 | A00/A80 | Singapore weekly standby combination or frequency invalid |
| 86000270 | A00/A80 | More than one Singapore standby unit entered for a day |

## 9. Code injection map

### Injection 1 — revision history

Add an INC1276683 revision-history entry near the current August 2026 entries.

### Injection 2 — package-local isolated totals and helpers

Insert immediately before the existing `PROCEDURE tally` documentation block.

Adds:

- `t_aug26_totals`
- `g_aug26_totals`
- `f_aug26_total`
- `p_aug26_tally`

### Injection 3 — tally capture

Insert at the beginning of `tally`, after diagnostic output and before:

`IF activity_type.unit != 'U'`

This allows capture of both hour and unit time types.

### Injection 4 — initialization

Insert in `clear_tables` after the existing `FOR cnt IN 1 .. 7 LOOP ... END LOOP` and before `att_array.DELETE`.

Calls:

`g_aug26_totals.DELETE`

### Injection 5 — isolated validation procedure

Insert immediately after the existing `record_error` procedure and before `charge_authorized`.

### Injection 6 — validation call

Insert after the existing call to `f_eoyshutdowninfo` and before the “Perform edits based on full week's worth of data” section.

The new procedure internally returns immediately for organizations other than A60, A00, and A80.

## 10. Existing check 86000260

The current `leave_check` contains an A60-specific check that reports `86000260` when 3010 alone exceeds 12 hours.

The patch does not remove or alter that check because doing so would make rollback less isolated. Consequently:

- `validate` reports the new specific cap error `86000261`.
- If `leave_check` is subsequently called and 3010 alone exceeds 12 hours, existing error `86000260` may also be returned.

Business confirmation is required on whether this duplicate condition is acceptable. If not, a follow-up change should retire or guard check 86000260 after the new rules are approved.

## 11. Rollback

To remove INC1276683 without affecting unrelated behavior:

1. Remove the revision-history entry.
2. Remove the package-local totals/helper block.
3. Remove the tally capture block.
4. Remove `g_aug26_totals.DELETE` from `clear_tables`.
5. Remove `p_validate_aug26_malaysing`.
6. Remove its call from `validate`.

No existing condition is rewritten by this patch.
```

---

## `81/PAYEDIT2A_patched.SQL`

```sql
/*******************************************************************************
* INC1276683 SURGICAL PATCH PAYLOAD
*
* Apply the following injections to the supplied PAYEDIT2A.SQL source in the
* order shown. Unchanged source remains byte-for-byte unchanged.
*******************************************************************************/


/*******************************************************************************
* INJECTION 1
*
* LOCATION:
* In the package revision history, after the latest August 2026 entry.
*******************************************************************************/

--RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026
--   08-10-2026 R. Wright: INC 1276683: Malaysia OT and Singapore Standby
--                         validation rules effective August 2026


/*******************************************************************************
* INJECTION 2
*
* LOCATION:
* Insert immediately before:
*
* /*************************************************************************************
* * PROCEDURE: tally
*******************************************************************************/

--RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026
   ---------------------------------------------------------------------------
   -- INC1276683 isolated Malaysia/Singapore daily totals.
   --
   -- Key format: <ATT_ABS_TYPE>:<DAY_INDEX>
   -- Example:    3010:3
   --
   -- These totals do not alter any existing hour, OT, leave, or standby
   -- accumulator.
   ---------------------------------------------------------------------------
   TYPE t_aug26_totals IS TABLE OF NUMBER
      INDEX BY VARCHAR2(20);

   g_aug26_totals t_aug26_totals;


   FUNCTION f_aug26_total (
      p_att_abs_type IN VARCHAR2,
      p_day          IN PLS_INTEGER
   )
      RETURN NUMBER
   IS
      l_key VARCHAR2(20);
   BEGIN
      l_key := RTRIM(p_att_abs_type) || ':' || TO_CHAR(p_day);

      IF g_aug26_totals.EXISTS(l_key)
      THEN
         RETURN NVL(g_aug26_totals(l_key), 0);
      END IF;

      RETURN 0;
   END f_aug26_total;


   PROCEDURE p_aug26_tally (
      p_att_abs_type IN VARCHAR2,
      p_day          IN PLS_INTEGER,
      p_value        IN NUMBER
   )
   IS
      l_key VARCHAR2(20);
   BEGIN
      l_key := RTRIM(p_att_abs_type) || ':' || TO_CHAR(p_day);

      IF g_aug26_totals.EXISTS(l_key)
      THEN
         g_aug26_totals(l_key) :=
              NVL(g_aug26_totals(l_key), 0)
            + NVL(p_value, 0);
      ELSE
         g_aug26_totals(l_key) := NVL(p_value, 0);
      END IF;
   END p_aug26_tally;


/*******************************************************************************
* INJECTION 3
*
* LOCATION:
* In PROCEDURE tally, insert after the activity-type diagnostic output and
* immediately before:
*
*       IF activity_type.unit != 'U'
*******************************************************************************/

--RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026
      ------------------------------------------------------------------------
      -- Capture exact INC1276683 time types before the existing unit check.
      -- Singapore standby codes may have UNIT_FLAG = 'U' and would otherwise
      -- be intentionally skipped by the existing hourly tally logic.
      ------------------------------------------------------------------------
      IF RTRIM(p_time_rec.att_abs_type) IN (
            '1010',
            '3010', '3011', '3020', '3030', '3040', '3050', '3060',
            '8000',
            '3100', '3110', '3120'
         )
      THEN
         p_aug26_tally(
            RTRIM(p_time_rec.att_abs_type),
            p_time_rec.DAY,
            p_time_rec.hours
         );
      END IF;


/*******************************************************************************
* INJECTION 4
*
* LOCATION:
* In PROCEDURE clear_tables, insert after the daily initialization loop:
*
*       END LOOP;
*
* and before:
*
*       att_array.DELETE;
*******************************************************************************/

--RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026
      -- Reset only the isolated INC1276683 totals.
      g_aug26_totals.DELETE;


/*******************************************************************************
* INJECTION 5
*
* LOCATION:
* Insert immediately after:
*
*       END record_error;
*
* and before the Charge_Authorized section.
*******************************************************************************/

--RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026
   PROCEDURE p_validate_aug26_malaysing (
      p_end_date       IN       DATE,
      p_error_count    IN OUT   INTEGER,
      p_error_line     IN OUT   lcd.pay_edit.errorlinetype,
      p_error_number   IN OUT   lcd.pay_edit.ERRORNUMTYPE
   )
   IS
      c_effective_date CONSTANT DATE := DATE '2026-08-01';

      l_actual_date    DATE;

      l_1010           NUMBER;
      l_3010           NUMBER;
      l_3011           NUMBER;
      l_3020           NUMBER;
      l_3030           NUMBER;
      l_3040           NUMBER;
      l_3050           NUMBER;
      l_3060           NUMBER;
      l_8000           NUMBER;

      l_3100           NUMBER;
      l_3110           NUMBER;
      l_3120           NUMBER;

      l_workoff_total  NUMBER;
      l_rest_total     NUMBER;
      l_ph_total       NUMBER;
      l_non_ph_total   NUMBER;

      l_week_3100      NUMBER := 0;
      l_week_3110      NUMBER := 0;
      l_week_3120      NUMBER := 0;
   BEGIN
      ------------------------------------------------------------------------
      -- Hard organization boundary. No other organization can enter the new
      -- validation logic.
      ------------------------------------------------------------------------
      IF pg_org_code NOT IN ('A60', 'A00', 'A80')
      THEN
         RETURN;
      END IF;


      ------------------------------------------------------------------------
      -- Malaysia A60 validations.
      ------------------------------------------------------------------------
      IF pg_org_code = 'A60'
      THEN
         FOR cnt IN 1 .. 7
         LOOP
            -- Existing package convention: day 1 is p_end_date - 6.
            l_actual_date := p_end_date - (7 - cnt);

            IF l_actual_date >= c_effective_date
            THEN
               l_1010 := f_aug26_total('1010', cnt);
               l_3010 := f_aug26_total('3010', cnt);
               l_3011 := f_aug26_total('3011', cnt);
               l_3020 := f_aug26_total('3020', cnt);
               l_3030 := f_aug26_total('3030', cnt);
               l_3040 := f_aug26_total('3040', cnt);
               l_3050 := f_aug26_total('3050', cnt);
               l_3060 := f_aug26_total('3060', cnt);
               l_8000 := f_aug26_total('8000', cnt);

               l_workoff_total := l_3010 + l_3011;
               l_rest_total    := l_3020 + l_3030 + l_3040;
               l_ph_total      := l_3050 + l_3060;

               ----------------------------------------------------------------
               -- 3010 regular-day cap includes exact regular type 1010.
               ----------------------------------------------------------------
               IF l_3010 > 0
                  AND (l_1010 + l_3010) > 12
               THEN
                  record_error(
                     p_error_count,
                     p_error_line,
                     p_error_number,
                     cnt,
                     86000261
                  ); -- Malaysia overtime daily 12-hour cap exceeded
               END IF;

               ----------------------------------------------------------------
               -- 3011 is treated as off-day OT and capped independently.
               ----------------------------------------------------------------
               IF l_3011 > 12
               THEN
                  record_error(
                     p_error_count,
                     p_error_line,
                     p_error_number,
                     cnt,
                     86000261
                  ); -- Malaysia overtime daily 12-hour cap exceeded
               END IF;

               ----------------------------------------------------------------
               -- 3010 requires exact regular time type 1010.
               ----------------------------------------------------------------
               IF l_3010 > 0
                  AND l_1010 <= 0
               THEN
                  record_error(
                     p_error_count,
                     p_error_line,
                     p_error_number,
                     cnt,
                     86000262
                  ); -- Malaysia 3010 requires regular time type 1010
               END IF;

               ----------------------------------------------------------------
               -- 3010 and 3011 are mutually exclusive.
               -- The three Malaysia OT families are also mutually exclusive:
               --   work/off day: 3010/3011
               --   rest day:     3020/3030/3040
               --   public hol:   3050/3060
               ----------------------------------------------------------------
               IF (l_3010 > 0 AND l_3011 > 0)
                  OR (l_workoff_total > 0 AND l_rest_total > 0)
                  OR (l_workoff_total > 0 AND l_ph_total > 0)
                  OR (l_rest_total > 0 AND l_ph_total > 0)
               THEN
                  record_error(
                     p_error_count,
                     p_error_line,
                     p_error_number,
                     cnt,
                     86000263
                  ); -- Incompatible Malaysia OT types entered on same day
               END IF;

               ----------------------------------------------------------------
               -- Rest-day OT-only combined cap.
               ----------------------------------------------------------------
               IF l_rest_total > 12
               THEN
                  record_error(
                     p_error_count,
                     p_error_line,
                     p_error_number,
                     cnt,
                     86000261
                  ); -- Malaysia overtime daily 12-hour cap exceeded
               END IF;

               ----------------------------------------------------------------
               -- 3020 is mandatory when 3030 or 3040 is used.
               ----------------------------------------------------------------
               IF (l_3030 > 0 OR l_3040 > 0)
                  AND l_3020 <= 0
               THEN
                  record_error(
                     p_error_count,
                     p_error_line,
                     p_error_number,
                     cnt,
                     86000264
                  ); -- Malaysia 3030/3040 requires 3020
               END IF;

               ----------------------------------------------------------------
               -- Exact PH type 8000 is required for 3050 and 3060.
               ----------------------------------------------------------------
               IF l_ph_total > 0
                  AND l_8000 <= 0
               THEN
                  record_error(
                     p_error_count,
                     p_error_line,
                     p_error_number,
                     cnt,
                     86000265
                  ); -- Malaysia 3050/3060 requires PH 8000
               END IF;

               ----------------------------------------------------------------
               -- 3050 must exist before 3060 can be used. Input-row order is
               -- not interpreted; same-day presence is the assumed rule.
               ----------------------------------------------------------------
               IF l_3060 > 0
                  AND l_3050 <= 0
               THEN
                  record_error(
                     p_error_count,
                     p_error_line,
                     p_error_number,
                     cnt,
                     86000266
                  ); -- Malaysia 3060 requires 3050
               END IF;

               ----------------------------------------------------------------
               -- PH cap excludes exact PH type 8000 from existing hourly
               -- total_day. Protect against an unexpected negative result.
               ----------------------------------------------------------------
               IF l_ph_total > 0
               THEN
                  l_non_ph_total :=
                     GREATEST(NVL(total_day(cnt), 0) - l_8000, 0);

                  IF l_non_ph_total > 12
                  THEN
                     record_error(
                        p_error_count,
                        p_error_line,
                        p_error_number,
                        cnt,
                        86000261
                     ); -- Malaysia overtime daily 12-hour cap exceeded
                  END IF;
               END IF;
            END IF;
         END LOOP;

         RETURN;
      END IF;


      ------------------------------------------------------------------------
      -- Singapore A00/A80 standby validations.
      ------------------------------------------------------------------------
      IF pg_org_code IN ('A00', 'A80')
      THEN
         FOR cnt IN 1 .. 7
         LOOP
            l_actual_date := p_end_date - (7 - cnt);

            IF l_actual_date >= c_effective_date
            THEN
               l_3100 := f_aug26_total('3100', cnt);
               l_3110 := f_aug26_total('3110', cnt);
               l_3120 := f_aug26_total('3120', cnt);

               l_week_3100 := l_week_3100 + l_3100;
               l_week_3110 := l_week_3110 + l_3110;
               l_week_3120 := l_week_3120 + l_3120;

               ----------------------------------------------------------------
               -- Every positive daily standby value must total exactly 1.
               -- Aggregation also catches duplicate rows for the same code/day.
               ----------------------------------------------------------------
               IF (l_3100 > 0 AND l_3100 <> 1)
                  OR (l_3110 > 0 AND l_3110 <> 1)
                  OR (l_3120 > 0 AND l_3120 <> 1)
               THEN
                  record_error(
                     p_error_count,
                     p_error_line,
                     p_error_number,
                     cnt,
                     86000267
                  ); -- Singapore standby entry must equal one unit
               END IF;

               ----------------------------------------------------------------
               -- 3110 is weekday-only: Monday-Friday = day indexes 3-7.
               ----------------------------------------------------------------
               IF l_3110 > 0
                  AND cnt NOT BETWEEN 3 AND 7
               THEN
                  record_error(
                     p_error_count,
                     p_error_line,
                     p_error_number,
                     cnt,
                     86000268
                  ); -- Singapore weekday standby entered on invalid day
               END IF;

               ----------------------------------------------------------------
               -- 3120 is weekend-only: Saturday/Sunday = day indexes 1-2.
               ----------------------------------------------------------------
               IF l_3120 > 0
                  AND cnt NOT BETWEEN 1 AND 2
               THEN
                  record_error(
                     p_error_count,
                     p_error_line,
                     p_error_number,
                     cnt,
                     86000268
                  ); -- Singapore weekend standby entered on invalid day
               END IF;

               ----------------------------------------------------------------
               -- Restrict daily overlap among supplied SA/SB codes.
               ----------------------------------------------------------------
               IF (l_3100 + l_3110 + l_3120) > 1
               THEN
                  record_error(
                     p_error_count,
                     p_error_line,
                     p_error_number,
                     cnt,
                     86000270
                  ); -- More than one Singapore standby unit entered for day
               END IF;
            END IF;
         END LOOP;

         ---------------------------------------------------------------------
         -- Weekly 3100 must occur exactly once when used.
         ---------------------------------------------------------------------
         IF l_week_3100 > 0
            AND l_week_3100 <> 1
         THEN
            record_error(
               p_error_count,
               p_error_line,
               p_error_number,
               0,
               86000269
            ); -- Singapore weekly 3100 frequency invalid
         END IF;

         ---------------------------------------------------------------------
         -- Weekly 3100 excludes both daily standby alternatives for the week.
         ---------------------------------------------------------------------
         IF l_week_3100 > 0
            AND (l_week_3110 > 0 OR l_week_3120 > 0)
         THEN
            record_error(
               p_error_count,
               p_error_line,
               p_error_number,
               0,
               86000269
            ); -- Singapore weekly standby combination invalid
         END IF;
      END IF;
   END p_validate_aug26_malaysing;


/*******************************************************************************
* INJECTION 6
*
* LOCATION:
* In the main validate procedure, insert immediately after:
*
*       f_eoyshutdowninfo(pg_org_code, pg_end_date);
*       dbms_output.put_line('inside validate(): exited call  f_eoyshutdowninfo()');
*
* and before:
*
*       -- Perform edits based on full week's worth of data
*******************************************************************************/

--RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026
         ----------------------------------------------------------------------
         -- Isolated August 2026 Malaysia/Singapore validations.
         -- The called procedure immediately returns for all other orgs.
         ----------------------------------------------------------------------
         p_validate_aug26_malaysing(
            p_end_date,
            p_error_count,
            p_error_line,
            p_error_number
         );


/*******************************************************************************
* END INC1276683 SURGICAL PATCH PAYLOAD
*
* DATABASE PREREQUISITE:
* Register reason codes 86000261 through 86000270 before deployment.
*******************************************************************************/
```

### Important deployment note

The existing `leave_check` rule `86000260` remains unchanged. If `3010 > 12`, both `86000261` from the new `validate` block and `86000260` from the subsequent `leave_check` may be returned. The safest final disposition depends on whether duplicate errors are acceptable and whether `leave_check` is always invoked.
