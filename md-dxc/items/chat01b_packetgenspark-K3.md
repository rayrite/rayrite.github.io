**Design Summary:**

The safest design is to add a self-contained August 2026 validation submodule that:

- Collects daily hours/units for only the affected time types: `1010`, `3010`-`3060`, `8000`, `3100`-`3120`.
- Collects data even when a time type is configured with `unit_flag = 'U'`, because the Singapore rules are unit-based and the existing `tally` procedure skips unit entries.
- Applies the Malaysia rules only to organization `A60`.
- Applies the Singapore rules only to organizations `A00` and `A80`.
- Adds all logic as private package routines and isolated calls in `clear_tables`, `tally`, and `validate`.
- Does not modify existing checks, including the existing Malaysia `86000260` check.
- Includes a package-level Boolean kill switch so the submodule can be disabled without deleting the code.

> **API limitation:** I do not have a filesystem or attachment tool in this session, so I cannot create physical downloadable files. The following are complete, copy-ready artifact contents. For `PAYEDIT2A_patched.SQL`, I have provided a complete source-overlay payload containing every new executable block and exact insertion anchors. This avoids introducing transcription errors into the unchanged 4,000-line package body.

---

**CLARIFYING_QUESTIONS.md:**

```markdown
# CLARIFYING_QUESTIONS.md

## Priority Change: MalaySing Validation Rules — August 2026

The following questions should be answered before the design is considered final. Items marked **Blocking** can materially change the validation results.

---

## 1. Scope and Eligibility

1. **Blocking — Malaysia salary-group scope:**  
   Should the new Malaysia overtime rules apply to all workers in organization `A60`, or only to workers whose `worker.salary_group = 'C'`?  
   The patch currently assumes **salary group `C` only**, based on the existing INC1247720 implementation and revision history.

2. **Employee-type scope:**  
   Should these rules apply to exempt, non-exempt, union, and contractor workers when the affected time types are entered, or should they be restricted to specific employee types?

3. **Contractors:**  
   Existing contractor behavior limits many validations. Should contractors be allowed to enter the Malaysia and Singapore time types if they are otherwise authorized, or should these new edits treat contractor usage as an error?

4. **Effective date:**  
   Is the August 2026 date informational only, or must the package enforce a hard effective date? The current design has no date condition and assumes the deployment date controls activation.

5. **Midweek processing:**  
   Should these rules evaluate all seven submitted days, or should days after the LCD midweek cutoff be suppressed in the same way that some existing weekly and quota errors are suppressed?  
   The current design evaluates all submitted days.

6. **Hard error versus warning:**  
   Are all new violations hard errors that prevent submission, or are any intended to be warnings?

---

## 2. Malaysia Overtime Rules — Organization A60

7. **Blocking — Meaning of the first Malaysia table row:**  
   The first row contains both GHR codes `3010` and `3011`, but the “Time Types” column lists only `3010`. Do the stated restrictions apply to both codes, or only to `3010`?  
   The current design treats `3010` and `3011` as the regular-day/off-day pair described by that row.

8. **3011 and regular time:**  
   The documentation says that “no regular time [is] needed” when `3011` is entered and that any day containing `3011` counts as an off day. Does this mean that regular code `1010` is prohibited on a day containing `3011`?  
   The current design assumes that `1010` and `3011` cannot coexist.

9. **Off-day/rest-day calendar verification:**  
   Should LCD determine whether the submitted calendar date is actually the employee’s scheduled workday, off day, rest day, or public holiday, or should the submitted time type itself determine the classification?  
   The current design uses only the submitted time types and does not query a work schedule.

10. **Definition of the 12-hour regular-day cap:**  
    For a day containing `3010`, should the cap be:
    - `1010 + 3010 <= 12`,
    - all hours on the day including absences and other time types, or
    - another specific list of time types?  
    The current design uses `total_day(day) <= 12`.

11. **Definition of the off-day OT-only cap:**  
    For a day containing `3011`, is the cap strictly `3011 <= 12`, or should all OT-type codes on the day be included?  
    The current design uses only `3011`.

12. **Rest-day code hierarchy:**  
    Is `3020` mandatory whenever either `3030` or `3040` is entered?  
    The current design assumes yes.

13. **Rest-day code combinations:**  
    May `3020`, `3030`, and `3040` be combined freely as long as `3020` is present and their combined total does not exceed 12 hours?  
    The current design assumes yes.

14. **Rest-day compatibility with 3011:**  
    The table explicitly prohibits `3010`, `3050`, and `3060` with the `3020`-`3040` group but does not explicitly mention `3011`. May `3011` be combined with any of `3020`, `3030`, or `3040`?  
    The current design treats `3011` as incompatible with the rest-day and public-holiday OT groups because `3011` classifies the day as an off day.

15. **Public-holiday prerequisite sequence:**  
    The requirement says to enter PH `8000` “first,” then `3050`, and only then `3060`. Since LCD receives an aggregated weekly array, should same-day coexistence be accepted as satisfying the sequence?  
    The current design assumes same-day coexistence is sufficient.

16. **Public-holiday 12-hour cap:**  
    Should the cap be:
    - `3050 + 3060 <= 12`, or
    - all daily hours except `8000 <= 12`?  
    The current design uses `total_day(day) - 8000_hours <= 12`, based on the “excluding PH Hrs” language.

17. **8000 unit configuration:**  
    Is time type `8000` hour-based in LCD (`unit_flag <> 'U'`), and does its submitted value represent hours? This is required for subtracting it from the daily total.

18. **Public-holiday regular time:**  
    May `1010` be entered with `8000`, `3050`, and/or `3060`? If yes, should it count toward the 12-hour cap after excluding `8000`?

19. **Incomplete “RDW:” note:**  
    The first Malaysia row ends with a second `RDW:` bullet and no content. What rule was intended there?

20. **Interaction with existing check 86000260:**  
    Should the existing `3010 > 12.0` check `86000260` remain active in addition to the new regular-day combined-hour cap? The current design leaves it untouched, which can produce two related errors for some entries.

---

## 3. Singapore Standby Rules — Organizations A00 and A80

21. **Blocking — Definition of “SA & SB” overlap:**  
    Which exact LCD time-type codes constitute the “SA” family and which constitute the “SB” family? The supplied rows define only `3100`, `3110`, and `3120`.  
    The current design can enforce overlap only among those three known codes.

22. **Are 3110 entries mandatory every weekday?**  
    Does “one time every weekday” mean the employee must enter `3110` on each applicable weekday, or does it mean that `3110` may be entered no more than once on any weekday?  
    The current design assumes the latter.

23. **Are 3120 entries mandatory on both weekend days?**  
    Similarly, is `3120` optional per weekend day, or must it be entered on both Saturday and Sunday when weekend standby applies?  
    The current design assumes it is optional per weekend day.

24. **Entry count versus total quantity:**  
    If a user enters two lines of `0.5` units for the same code and day, should this pass because the total is one unit, or fail because the rule says the code may be used “one time”?  
    The current design fails it: both the aggregate quantity and the source-line count must equal one.

25. **Weekly exclusivity of 3100:**  
    The `3100` row says `3100` cannot be used with `3110` or `3120` in the same week. The `3120` row says only that `3120` cannot be combined with `3100` on a weekend day. Which rule governs?  
    The current design enforces the broader weekly exclusivity rule.

26. **3110 and 3120 in the same week:**  
    May an employee enter `3110` on a weekday and `3120` on a weekend day in the same week?  
    The current design allows this because only combinations with `3100` are explicitly prohibited.

27. **Week boundaries:**  
    Are the seven input days always the contiguous period `week_end_date - 6` through `week_end_date`, with organization `A00` and `A80` using a Saturday-through-Friday week?  
    The current design derives the actual calendar day from the week-ending date instead of relying solely on the array index.

28. **Unit representation:**  
    Is one standby unit submitted as a parsed value of `1.00` in the time string? The current design assumes that it is.

29. **Public-holiday standby:**  
    May `3110` be entered on a weekday public holiday, and may `3120` be entered on a weekend public holiday? No public-holiday exclusion was provided.

30. **Leave and standby overlap:**  
    Can standby units coexist with leave or absence time on the same day as long as the standby-unit total is not greater than one?

---

## 4. Error-Code and Operational Questions

31. **Blocking — Error-code availability:**  
    Are proposed reason codes `86000261` through `86000266` and `86000270` through `86000274` unused and approved for this change?

32. **Message ownership:**  
    Who should approve the exact English reason-code text and any required translations?

33. **Reason-code table deployment:**  
    Should the reason-code inserts be included in the same deployment script as the package body, or delivered in a separate data-migration script?

34. **eTES versus LCD responsibility:**  
    Some requirements explicitly say “eTES to restrict.” Should LCD enforce those rules as a defensive server-side validation even if eTES will also enforce them?

35. **Reporting day for weekly errors:**  
    For weekly standby violations, is it acceptable to report:
    - the repeated day for a repeated `3100`, and
    - the first conflicting `3110`/`3120` day for a weekly `3100` combination?

36. **Feature switch:**  
    Is a package-level Boolean kill switch acceptable, or does the organization require a database-driven feature flag?
```

---

**PATCH_PLAN.md:**

```markdown
# PATCH_PLAN.md

## Priority Change: MalaySing Validation Rules — August 2026

## 1. Objective

Add the proposed August 2026 Malaysia overtime and Singapore standby validations to `lcd.pay_editA` without changing the behavior of other organizations.

The design is intentionally isolated. It adds:

1. A package-level collection that stores daily hours/units by time type.
2. A package-level collection that stores the number of submitted source lines by time type and day.
3. Private helper functions for retrieving those values.
4. One private validation procedure for the new Malaysia and Singapore rules.
5. One collection call in `tally`.
6. One clear call in `clear_tables`.
7. One validation call from the main `validate` procedure.

No package-specification change is required.

---

## 2. Scope

### Malaysia

- Organization: `A60`
- Assumed worker scope: `worker_info.salary_group = 'C'`
- Time types tracked:
  - `1010`
  - `3010`
  - `3011`
  - `3020`
  - `3030`
  - `3040`
  - `3050`
  - `3060`
  - `8000`

### Singapore

- Organizations: `A00`, `A80`
- Time types tracked:
  - `3100`
  - `3110`
  - `3120`

### Other organizations

No new validations execute for other organizations. The collector returns immediately for out-of-scope organizations and time types.

---

## 3. Reasonable Assumptions

| ID | Assumption |
|---|---|
| A-01 | Malaysia rules apply to `A60` workers whose salary group is `C`. This is controlled by one constant so it can be changed easily. |
| A-02 | The first Malaysia row applies to both `3010` and `3011`. |
| A-03 | `3010` represents OT on a regular workday and requires `1010` on the same day. |
| A-04 | `3011` classifies the submitted day as an off day; therefore, `1010` is not allowed with `3011`. |
| A-05 | For `3010`, the regular-day 12-hour cap uses the existing `total_day(day)` value. |
| A-06 | For `3011`, the OT-only cap is the daily sum of `3011`. |
| A-07 | For `3020`, `3030`, and `3040`, the OT-only cap is the sum of those three codes. |
| A-08 | `3020` is mandatory when `3030` or `3040` is entered. |
| A-09 | `8000` must be present on the same day as `3050` or `3060`. |
| A-10 | `3050` must be present on the same day as `3060`. |
| A-11 | Same-day coexistence satisfies the requirement to enter `8000` “first”; entry sequence is unavailable in the weekly input array. |
| A-12 | For public-holiday OT, the 12-hour cap is `total_day(day) - 8000_hours <= 12`. |
| A-13 | The regular-day/off-day OT group, rest-day OT group, and public-holiday OT group are mutually exclusive on a day. |
| A-14 | Singapore rules apply to all worker types in `A00` and `A80`. |
| A-15 | `3100` may be entered on any one day in the week, but only once in the week. |
| A-16 | `3100` is mutually exclusive with `3110` and `3120` for the entire week. |
| A-17 | `3110` is optional but may be entered no more than once, for exactly one unit, on a Monday-through-Friday date. |
| A-18 | `3120` is optional but may be entered no more than once, for exactly one unit, on a Saturday or Sunday date. |
| A-19 | `3110` and `3120` may coexist in the same week when entered on their respective day types. |
| A-20 | A standby entry must have an aggregate quantity of one and must come from exactly one submitted line for that code and day. |
| A-21 | Daily standby overlap can currently be enforced only across `3100`, `3110`, and `3120` because the separate “SA” code list was not provided. |
| A-22 | The seven input days correspond to `week_end_date - 6` through `week_end_date`; weekday names are derived from actual dates. |
| A-23 | The new rules are hard errors and are not suppressed by midweek cutoff processing. |
| A-24 | Existing check `86000260` remains unchanged. |

---

## 4. New Package-Level Data Dictionary

### 4.1 `c_aug26_enabled`

**Type:** `CONSTANT BOOLEAN`  
**Initial value:** `TRUE`

Global kill switch for the August 2026 submodule. Setting it to `FALSE` disables collection and validation without deleting code.

---

### 4.2 `c_aug26_my_salary_group`

**Type:** `CONSTANT VARCHAR2(2)`  
**Initial value:** `'C'`

Controls the Malaysia salary-group scope. Change this value or remove the predicate if the rules must apply to all `A60` workers.

---

### 4.3 `aug26_number_map_t`

**Type:** PL/SQL associative array

```sql
TYPE aug26_number_map_t IS TABLE OF NUMBER
   INDEX BY VARCHAR2(32);
```

Used for both the hours/units collection and entry-count collection.

---

### 4.4 `aug26_day_hours`

**Type:** `aug26_number_map_t`

Stores the sum of submitted values for a time type and day.

**Key format:**

```text
<att_abs_type>:<day_number>
```

Example:

```text
3010:3
```

This represents all submitted `3010` hours on day three.

The collection intentionally stores unit quantities for Singapore unit-based time types and hours for Malaysia hour-based time types.

---

### 4.5 `aug26_day_entries`

**Type:** `aug26_number_map_t`

Stores the number of source input lines that contributed a positive value for a time type and day.

This is required for the Singapore “one time” rules. It prevents two entries of `0.5` from passing as one submitted standby entry.

---

## 5. New Private Routine Dictionary

### 5.1 `f_aug26_key`

Creates a deterministic collection key from the time type and day number.

---

### 5.2 `f_aug26_is_tracked_type`

Determines whether a time type belongs to the August 2026 scope for the current organization.

Malaysia tracked types:

```text
1010, 3010, 3011, 3020, 3030, 3040, 3050, 3060, 8000
```

Singapore tracked types:

```text
3100, 3110, 3120
```

---

### 5.3 `p_aug26_collect`

Called from `tally` before the existing `unit_flag != 'U'` guard.

This placement is critical: the existing `tally` procedure skips unit entries, but Singapore standby values are expected to be unit-based.

---

### 5.4 `f_aug26_hours`

Returns the collected daily value for a time type and day. Returns zero when no entry exists.

---

### 5.5 `f_aug26_entries`

Returns the number of source input lines for a time type and day. Returns zero when no entry exists.

---

### 5.6 `f_aug26_week_hours`

Returns the seven-day total for a time type.

---

### 5.7 `p_aug26_clear`

Deletes both associative arrays. It is called once by `clear_tables`.

---

### 5.8 `p_validate_malaysing_aug26`

Executes all new Malaysia and Singapore rules and reports errors through the existing `record_error` procedure.

The procedure is placed after `record_error` in the package body so no forward declaration is required.

---

## 6. Malaysia Validation Matrix

| Rule ID | Condition | Result |
|---|---|---|
| MY-01 | `3010 > 0` and `1010 = 0` | Error `86000262` |
| MY-02 | `3010 > 0` and `total_day > 12` | Error `86000261` |
| MY-03 | `3011 > 0` and `3011 > 12` | Error `86000261` |
| MY-04 | `3011 > 0` and `1010 > 0` | Error `86000263` |
| MY-05 | Regular/off-day OT group combined with rest-day or public-holiday OT group | Error `86000263` |
| MY-06 | `3020 + 3030 + 3040 > 12` | Error `86000261` |
| MY-07 | `3030 > 0` or `3040 > 0`, but `3020 = 0` | Error `86000264` |
| MY-08 | `3050 + 3060 > 0`, but `8000 = 0` | Error `86000265` |
| MY-09 | `3060 > 0`, but `3050 = 0` | Error `86000266` |
| MY-10 | `3050 + 3060 > 0` and `total_day - 8000 > 12` | Error `86000261` |
| MY-11 | Public-holiday OT group combined with the regular/off-day or rest-day OT group | Error `86000263` |

---

## 7. Singapore Validation Matrix

| Rule ID | Condition | Result |
|---|---|---|
| SG-01 | Daily `3100` quantity is not one or source-line count is not one | Error `86000270` |
| SG-02 | `3100` appears on more than one day in the week | Error `86000271` |
| SG-03 | Weekly `3100` is combined with any weekly `3110` or `3120` | Error `86000271` |
| SG-04 | `3110` is entered on a date that is not Monday through Friday | Error `86000272` |
| SG-05 | Daily `3110` quantity is not one or source-line count is not one | Error `86000270` |
| SG-06 | `3120` is entered on a date that is not Saturday or Sunday | Error `86000273` |
| SG-07 | Daily `3120` quantity is not one or source-line count is not one | Error `86000270` |
| SG-08 | Daily total of `3100 + 3110 + 3120` exceeds one unit | Error `86000274` |

---

## 8. Proposed Error-Code Dictionary

These codes are proposed because the supplied package currently uses codes through `86000260`. Availability must be confirmed before deployment.

| Code | Proposed Message |
|---:|---|
| `86000261` | Malaysia daily 12-hour limit exceeded |
| `86000262` | Regular time 1010 is required with 3010 |
| `86000263` | Invalid Malaysia time-type combination for the day |
| `86000264` | Time type 3020 is required before 3030 or 3040 |
| `86000265` | Public Holiday 8000 is required before 3050 or 3060 |
| `86000266` | Time type 3050 is required before 3060 |
| `86000270` | Standby allowance entry must be exactly one unit from one entry |
| `86000271` | Weekly standby 3100 cannot be repeated or combined with 3110/3120 |
| `86000272` | Standby 3110 may only be entered Monday through Friday |
| `86000273` | Standby 3120 may only be entered Saturday or Sunday |
| `86000274` | Only one standby allowance unit may be entered per day |

The reason-code table columns were not included in the supplied source, so executable seed DML should be generated from the organization’s existing `reason_code` deployment pattern.

---

## 9. Injection Points

| Patch | Anchor | Change |
|---|---|---|
| 1 | End of package revision history | Add INC1276683 revision entry |
| 2 | After `total_day_my3010` declaration | Add constants and associative arrays |
| 3 | After `END f_activity_type;` | Add collection helper routines |
| 4 | After `END record_error;` | Add validation procedure |
| 5 | First statement in `clear_tables` | Clear the new associative arrays |
| 6 | In `tally`, after `activity_type` is populated and before the unit guard | Collect the submitted value |
| 7 | In `validate`, after `f_eoyshutdowninfo` | Execute the new validation procedure |

Each inserted block begins with:

```sql
--RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026
```

---

## 10. Why Collection Occurs Before the Unit Guard

The existing `tally` procedure contains:

```sql
IF activity_type.unit != 'U'
THEN
   -- hourly accumulation
END IF;
```

Singapore standby entries are expected to have `unit_flag = 'U'`. If collection were placed inside this block, the new rules would never see those entries.

The new collector therefore runs immediately before the unit guard. It is organization- and time-type-filtered, so this does not alter existing totals or processing for other time types.

---

## 11. Test Plan

### Malaysia Positive Tests

1. `A60`, salary group `C`: `1010 = 8`, `3010 = 4`; expect no new error.
2. `A60`, salary group `C`: `3011 = 12`; expect no new error.
3. `A60`, salary group `C`: `3020 = 2`, `3030 = 4`, `3040 = 6`; expect no new error.
4. `A60`, salary group `C`: `8000 = 8`, `3050 = 3`, `3060 = 1`; expect no new error.

### Malaysia Negative Tests

1. `3010 > 0` without `1010`; expect `86000262`.
2. `1010 + 3010 > 12`; expect `86000261`.
3. `3011 > 12`; expect `86000261`.
4. `3011 + 1010`; expect `86000263`.
5. `3030 > 0` without `3020`; expect `86000264`.
6. `3040 > 0` without `3020`; expect `86000264`.
7. Rest-day OT total over 12; expect `86000261`.
8. `3050 > 0` without `8000`; expect `86000265`.
9. `3060 > 0` without `3050`; expect `86000266`.
10. `3050 + 3060` and other non-PH time exceeding 12; expect `86000261`.
11. `3010` with `3050`; expect `86000263`.

### Singapore Positive Tests

1. `3100 = 1` on one day; expect no new error.
2. `3110 = 1` on Monday; expect no new error.
3. `3120 = 1` on Saturday; expect no new error.
4. `3110 = 1` on Friday and `3120 = 1` on Sunday in the same week; expect no new error under the current assumptions.

### Singapore Negative Tests

1. `3100 = 2`; expect `86000270` and `86000274`.
2. `3100 = 1` on two days; expect `86000271`.
3. `3100 = 1` and `3110 = 1` anywhere in the week; expect `86000271`.
4. `3110 = 1` on Saturday; expect `86000272`.
5. `3120 = 1` on Tuesday; expect `86000273`.
6. Two `3110` lines of one unit each on the same day; expect `86000270` and `86000274`.
7. Two `3110` lines of `0.5` each on the same day; expect `86000270` because the source-line count is two.

### Regression Tests

1. Verify organizations other than `A00`, `A60`, and `A80` produce no new errors.
2. Verify existing Malaysia check `86000260` still executes.
3. Verify existing India supplemental-pay checks still execute.
4. Verify Malaysia and Singapore end-of-year shutdown behavior is unchanged.
5. Verify unit-based time types that are not in the new list are still ignored by hourly totals.
6. Run a normal U.S. weekly timesheet and compare errors before and after the patch.

---

## 12. Backout Plan

### Immediate Disable

Change:

```sql
c_aug26_enabled CONSTANT BOOLEAN := TRUE;
```

to:

```sql
c_aug26_enabled CONSTANT BOOLEAN := FALSE;
```

Then recompile the package body.

### Full Removal

Delete, in reverse order:

1. The call to `p_validate_malaysing_aug26`.
2. The call to `p_aug26_collect`.
3. The call to `p_aug26_clear`.
4. The `p_validate_malaysing_aug26` procedure.
5. The collection helper routines.
6. The new package-level declarations.
7. The revision-history entry.

No existing validation block is modified, so removal of the marked blocks restores the original behavior.
```

---

**PAYEDIT2A_patched.SQL:**

```sql
/************************************************************************************
* PAYEDIT2A_patched.SQL
*
* SOURCE-OVERLAY PAYLOAD
*
* This file contains every new executable PL/SQL block required for INC1276683.
* Apply each block to the supplied PAYEDIT2A.SQL at the stated anchor.
*
* This overlay is intentionally not a retyped copy of the entire package body.
* After inserting these blocks at the anchors, save the resulting file as
* PAYEDIT2A_patched.SQL and compile it normally.
************************************************************************************/


/************************************************************************************
* PATCH 1 OF 7
*
* ANCHOR:
*   Add immediately after:
*
*   --   07-29-2026 R. Wright: INC 1405279: India Increments Selective Restore
*   --   VAC-PB-LV-UPD (86000233 re-enabled for VAC/PB/LV/UPD only)
*
************************************************************************************/

--RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026
--   08-10-2026 R. Wright: INC1276683: Malaysia overtime and Singapore
--                         standby validation rules for August 2026


/************************************************************************************
* PATCH 2 OF 7
*
* ANCHOR:
*   In the Package Local Declarations section, add immediately after:
*
*      total_day_my3010      lcd.pay_edit.hourstype;
*
************************************************************************************/

--RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026
-- >>> BEGIN INC1276683 MalaySing declarations
   c_aug26_enabled             CONSTANT BOOLEAN := TRUE;
   c_aug26_my_salary_group     CONSTANT VARCHAR2(2) := 'C';

   TYPE aug26_number_map_t IS TABLE OF NUMBER
      INDEX BY VARCHAR2 (32);

   aug26_day_hours             aug26_number_map_t;
   aug26_day_entries           aug26_number_map_t;
-- <<< END INC1276683 MalaySing declarations


/************************************************************************************
* PATCH 3 OF 7
*
* ANCHOR:
*   Add immediately after:
*
*   END f_activity_type;
*
************************************************************************************/

--RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026
-- >>> BEGIN INC1276683 MalaySing collection helpers

/************************************************************************************
* FUNCTION: f_aug26_key
*
* PURPOSE:
*   Builds the associative-array key for an August 2026 tracked time type/day.
************************************************************************************/
   FUNCTION f_aug26_key (
      p_att_abs_type   IN   VARCHAR2,
      p_day            IN   INTEGER
   )
      RETURN VARCHAR2
   IS
   BEGIN
      RETURN p_att_abs_type || ':' || TO_CHAR (p_day);
   END f_aug26_key;

/************************************************************************************
* FUNCTION: f_aug26_is_tracked_type
*
* PURPOSE:
*   Returns TRUE only for time types in the August 2026 Malaysia or Singapore
*   validation scope. All other organizations and time types are ignored.
************************************************************************************/
   FUNCTION f_aug26_is_tracked_type (
      p_att_abs_type   IN   VARCHAR2
   )
      RETURN BOOLEAN
   IS
   BEGIN
      IF NOT c_aug26_enabled
      THEN
         RETURN FALSE;
      END IF;

      IF pg_org_code = 'A60'
      THEN
         IF p_att_abs_type IN (
               '1010',
               '3010',
               '3011',
               '3020',
               '3030',
               '3040',
               '3050',
               '3060',
               '8000'
            )
         THEN
            RETURN TRUE;
         ELSE
            RETURN FALSE;
         END IF;
      ELSIF pg_org_code IN ('A00', 'A80')
      THEN
         IF p_att_abs_type IN ('3100', '3110', '3120')
         THEN
            RETURN TRUE;
         ELSE
            RETURN FALSE;
         END IF;
      ELSE
         RETURN FALSE;
      END IF;
   END f_aug26_is_tracked_type;

/************************************************************************************
* PROCEDURE: p_aug26_collect
*
* PURPOSE:
*   Collects daily hours or unit quantities and the number of source entries
*   for the August 2026 tracked time types.
*
*   This routine must be called before the existing unit_flag guard in tally
*   so Singapore unit-based standby entries are not skipped.
************************************************************************************/
   PROCEDURE p_aug26_collect (
      p_att_abs_type   IN   VARCHAR2,
      p_day            IN   INTEGER,
      p_hours          IN   NUMBER
   )
   IS
      v_key   VARCHAR2 (32);
   BEGIN
      IF NOT c_aug26_enabled
      THEN
         RETURN;
      END IF;

      IF NOT f_aug26_is_tracked_type (p_att_abs_type)
      THEN
         RETURN;
      END IF;

      IF NVL (p_hours, 0) <= 0
      THEN
         RETURN;
      END IF;

      v_key := f_aug26_key (p_att_abs_type, p_day);

      IF aug26_day_hours.EXISTS (v_key)
      THEN
         aug26_day_hours (v_key) :=
              aug26_day_hours (v_key)
            + p_hours;
      ELSE
         aug26_day_hours (v_key) := p_hours;
      END IF;

      IF aug26_day_entries.EXISTS (v_key)
      THEN
         aug26_day_entries (v_key) :=
              aug26_day_entries (v_key)
            + 1;
      ELSE
         aug26_day_entries (v_key) := 1;
      END IF;
   END p_aug26_collect;

/************************************************************************************
* FUNCTION: f_aug26_hours
*
* PURPOSE:
*   Returns the daily hours or units collected for the requested time type.
************************************************************************************/
   FUNCTION f_aug26_hours (
      p_att_abs_type   IN   VARCHAR2,
      p_day            IN   INTEGER
   )
      RETURN NUMBER
   IS
      v_key   VARCHAR2 (32);
   BEGIN
      v_key := f_aug26_key (p_att_abs_type, p_day);

      IF aug26_day_hours.EXISTS (v_key)
      THEN
         RETURN NVL (aug26_day_hours (v_key), 0);
      ELSE
         RETURN 0;
      END IF;
   END f_aug26_hours;

/************************************************************************************
* FUNCTION: f_aug26_entries
*
* PURPOSE:
*   Returns the number of submitted source lines for the requested time
*   type and day.
************************************************************************************/
   FUNCTION f_aug26_entries (
      p_att_abs_type   IN   VARCHAR2,
      p_day            IN   INTEGER
   )
      RETURN NUMBER
   IS
      v_key   VARCHAR2 (32);
   BEGIN
      v_key := f_aug26_key (p_att_abs_type, p_day);

      IF aug26_day_entries.EXISTS (v_key)
      THEN
         RETURN NVL (aug26_day_entries (v_key), 0);
      ELSE
         RETURN 0;
      END IF;
   END f_aug26_entries;

/************************************************************************************
* FUNCTION: f_aug26_week_hours
*
* PURPOSE:
*   Returns the seven-day hours or units collected for the requested type.
************************************************************************************/
   FUNCTION f_aug26_week_hours (
      p_att_abs_type   IN   VARCHAR2
   )
      RETURN NUMBER
   IS
      v_total   NUMBER := 0;
   BEGIN
      FOR v_day IN 1 .. 7
      LOOP
         v_total :=
              v_total
            + f_aug26_hours (p_att_abs_type, v_day);
      END LOOP;

      RETURN v_total;
   END f_aug26_week_hours;

/************************************************************************************
* PROCEDURE: p_aug26_clear
*
* PURPOSE:
*   Clears the August 2026 daily hours and entry-count collections.
************************************************************************************/
   PROCEDURE p_aug26_clear
   IS
   BEGIN
      aug26_day_hours.DELETE;
      aug26_day_entries.DELETE;
   END p_aug26_clear;

-- <<< END INC1276683 MalaySing collection helpers


/************************************************************************************
* PATCH 4 OF 7
*
* ANCHOR:
*   Add immediately after:
*
*   END record_error;
*
* IMPORTANT:
*   This placement is required because the new procedure calls record_error.
*   Placing it before record_error would require a forward declaration.
*
************************************************************************************/

--RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026
-- >>> BEGIN INC1276683 MalaySing validation procedure

/************************************************************************************
* PROCEDURE: p_validate_malaysing_aug26
*
* PURPOSE:
*   Performs the August 2026 Malaysia overtime and Singapore standby
*   validation rules.
*
*   Malaysia:
*     Organization A60
*     Assumed salary group C
*
*   Singapore:
*     Organizations A00 and A80
*
*   This procedure does not alter any existing validation rule.
************************************************************************************/
   PROCEDURE p_validate_malaysing_aug26 (
      p_error_count    IN OUT   INTEGER,
      p_error_line     IN OUT   lcd.pay_edit.errorlinetype,
      p_error_number   IN OUT   lcd.pay_edit.ERRORNUMTYPE
   )
   IS
      v_1010                     NUMBER;
      v_3010                     NUMBER;
      v_3011                     NUMBER;
      v_3020                     NUMBER;
      v_3030                     NUMBER;
      v_3040                     NUMBER;
      v_3050                     NUMBER;
      v_3060                     NUMBER;
      v_8000                     NUMBER;

      v_regular_off_ot           NUMBER;
      v_rest_day_ot              NUMBER;
      v_public_holiday_ot        NUMBER;
      v_combo_reported           BOOLEAN;

      v_3100                     NUMBER;
      v_3110                     NUMBER;
      v_3120                     NUMBER;
      v_3100_entries             NUMBER;
      v_3110_entries             NUMBER;
      v_3120_entries             NUMBER;
      v_3100_days                NUMBER := 0;
      v_3100_repeat_reported     BOOLEAN := FALSE;
      v_day_units                NUMBER;
      v_day_name                 VARCHAR2 (3);
      v_mixed_day                INTEGER := 0;
   BEGIN
      IF NOT c_aug26_enabled
      THEN
         RETURN;
      END IF;

      /********************************************************************
      * Malaysia organization A60
      ********************************************************************/
      IF pg_org_code = 'A60'
      THEN
         -- Assumption A-01: restrict Malaysia rules to salary group C.
         IF NVL (worker_info.salary_group, ' ') <>
               c_aug26_my_salary_group
         THEN
            RETURN;
         END IF;

         FOR cnt IN 1 .. 7
         LOOP
            v_1010 := f_aug26_hours ('1010', cnt);
            v_3010 := f_aug26_hours ('3010', cnt);
            v_3011 := f_aug26_hours ('3011', cnt);
            v_3020 := f_aug26_hours ('3020', cnt);
            v_3030 := f_aug26_hours ('3030', cnt);
            v_3040 := f_aug26_hours ('3040', cnt);
            v_3050 := f_aug26_hours ('3050', cnt);
            v_3060 := f_aug26_hours ('3060', cnt);
            v_8000 := f_aug26_hours ('8000', cnt);

            v_regular_off_ot := v_3010 + v_3011;
            v_rest_day_ot :=
                 v_3020
               + v_3030
               + v_3040;
            v_public_holiday_ot :=
                 v_3050
               + v_3060;

            v_combo_reported := FALSE;

            -- 3010 is regular-workday OT and requires 1010.
            IF v_3010 > 0
            THEN
               IF v_1010 = 0
               THEN
                  record_error (
                     p_error_count,
                     p_error_line,
                     p_error_number,
                     cnt,
                     86000262
                  ); -- "Regular time 1010 is required with 3010"
               END IF;

               -- Regular-day cap: all existing non-unit daily hours,
               -- including 1010 and 3010, may not exceed 12.
               IF total_day (cnt) > 12
               THEN
                  record_error (
                     p_error_count,
                     p_error_line,
                     p_error_number,
                     cnt,
                     86000261
                  ); -- "Malaysia daily 12-hour limit exceeded"
               END IF;
            END IF;

            -- 3011 is off-day OT. Its OT-only total may not exceed 12.
            IF v_3011 > 12
            THEN
               record_error (
                  p_error_count,
                  p_error_line,
                  p_error_number,
                  cnt,
                  86000261
               ); -- "Malaysia daily 12-hour limit exceeded"
            END IF;

            -- A 3011 entry classifies the day as an off day. Under the
            -- current assumption, regular time 1010 is incompatible.
            IF v_3011 > 0 AND v_1010 > 0
            THEN
               record_error (
                  p_error_count,
                  p_error_line,
                  p_error_number,
                  cnt,
                  86000263
               ); -- "Invalid Malaysia time-type combination for the day"
               v_combo_reported := TRUE;
            END IF;

            -- The regular/off-day OT group may not be combined with the
            -- rest-day or public-holiday OT groups.
            IF     v_regular_off_ot > 0
               AND (   v_rest_day_ot > 0
                    OR v_public_holiday_ot > 0
                   )
               AND NOT v_combo_reported
            THEN
               record_error (
                  p_error_count,
                  p_error_line,
                  p_error_number,
                  cnt,
                  86000263
               ); -- "Invalid Malaysia time-type combination for the day"
               v_combo_reported := TRUE;
            END IF;

            -- Rest-day OT cap: only 3020, 3030, and 3040 count.
            IF v_rest_day_ot > 12
            THEN
               record_error (
                  p_error_count,
                  p_error_line,
                  p_error_number,
                  cnt,
                  86000261
               ); -- "Malaysia daily 12-hour limit exceeded"
            END IF;

            -- 3020 is mandatory before 3030 or 3040 can be used.
            IF     v_rest_day_ot > 0
               AND v_3020 = 0
               AND (v_3030 > 0 OR v_3040 > 0)
            THEN
               record_error (
                  p_error_count,
                  p_error_line,
                  p_error_number,
                  cnt,
                  86000264
               ); -- "Time type 3020 is required before 3030 or 3040"
            END IF;

            -- Public-holiday OT requires PH 8000 on the same day.
            IF     v_public_holiday_ot > 0
               AND v_8000 = 0
            THEN
               record_error (
                  p_error_count,
                  p_error_line,
                  p_error_number,
                  cnt,
                  86000265
               ); -- "Public Holiday 8000 is required before 3050 or 3060"
            END IF;

            -- 3060 may be used only after 3050 exists on the same day.
            IF     v_3060 > 0
               AND v_3050 = 0
            THEN
               record_error (
                  p_error_count,
                  p_error_line,
                  p_error_number,
                  cnt,
                  86000266
               ); -- "Time type 3050 is required before 3060"
            END IF;

            -- Public-holiday cap: all daily hours except PH 8000 may not
            -- exceed 12 hours.
            IF     v_public_holiday_ot > 0
               AND (total_day (cnt) - v_8000) > 12
            THEN
               record_error (
                  p_error_count,
                  p_error_line,
                  p_error_number,
                  cnt,
                  86000261
               ); -- "Malaysia daily 12-hour limit exceeded"
            END IF;

            -- Public-holiday OT may not be combined with the
            -- regular/off-day or rest-day OT groups.
            IF     v_public_holiday_ot > 0
               AND (   v_regular_off_ot > 0
                    OR v_rest_day_ot > 0
                   )
               AND NOT v_combo_reported
            THEN
               record_error (
                  p_error_count,
                  p_error_line,
                  p_error_number,
                  cnt,
                  86000263
               ); -- "Invalid Malaysia time-type combination for the day"
               v_combo_reported := TRUE;
            END IF;
         END LOOP;

      /********************************************************************
      * Singapore organizations A00 and A80
      ********************************************************************/
      ELSIF pg_org_code IN ('A00', 'A80')
      THEN
         FOR cnt IN 1 .. 7
         LOOP
            v_3100 := f_aug26_hours ('3100', cnt);
            v_3110 := f_aug26_hours ('3110', cnt);
            v_3120 := f_aug26_hours ('3120', cnt);

            v_3100_entries := f_aug26_entries ('3100', cnt);
            v_3110_entries := f_aug26_entries ('3110', cnt);
            v_3120_entries := f_aug26_entries ('3120', cnt);

            -- Day 1 corresponds to pg_end_date - 6 and day 7 corresponds
            -- to pg_end_date. Derive the actual weekday from the date.
            v_day_name :=
               UPPER (
                  TO_CHAR (
                       pg_end_date
                     - 7
                     + cnt,
                     'DY',
                     'NLS_DATE_LANGUAGE=ENGLISH'
                  )
               );

            -- Weekly standby 3100: one entry, exactly one unit, once/week.
            IF v_3100 > 0
            THEN
               v_3100_days := v_3100_days + 1;

               IF v_3100 <> 1 OR v_3100_entries <> 1
               THEN
                  record_error (
                     p_error_count,
                     p_error_line,
                     p_error_number,
                     cnt,
                     86000270
                  ); -- "Standby entry must be exactly one unit"
               END IF;

               IF     v_3100_days > 1
                  AND NOT v_3100_repeat_reported
               THEN
                  record_error (
                     p_error_count,
                     p_error_line,
                     p_error_number,
                     cnt,
                     86000271
                  ); -- "Weekly standby 3100 cannot be repeated"
                  v_3100_repeat_reported := TRUE;
               END IF;
            END IF;

            -- Weekday standby 3110.
            IF v_3110 > 0
            THEN
               IF v_day_name NOT IN (
                     'MON',
                     'TUE',
                     'WED',
                     'THU',
                     'FRI'
                  )
               THEN
                  record_error (
                     p_error_count,
                     p_error_line,
                     p_error_number,
                     cnt,
                     86000272
                  ); -- "3110 may only be entered Monday-Friday"
               END IF;

               IF v_3110 <> 1 OR v_3110_entries <> 1
               THEN
                  record_error (
                     p_error_count,
                     p_error_line,
                     p_error_number,
                     cnt,
                     86000270
                  ); -- "Standby entry must be exactly one unit"
               END IF;
            END IF;

            -- Weekend standby 3120.
            IF v_3120 > 0
            THEN
               IF v_day_name NOT IN ('SAT', 'SUN')
               THEN
                  record_error (
                     p_error_count,
                     p_error_line,
                     p_error_number,
                     cnt,
                     86000273
                  ); -- "3120 may only be entered Saturday or Sunday"
               END IF;

               IF v_3120 <> 1 OR v_3120_entries <> 1
               THEN
                  record_error (
                     p_error_count,
                     p_error_line,
                     p_error_number,
                     cnt,
                     86000270
                  ); -- "Standby entry must be exactly one unit"
               END IF;
            END IF;

            -- Only one known standby unit is permitted per day.
            -- The separate SA code list must be added here if supplied.
            v_day_units :=
                 v_3100
               + v_3110
               + v_3120;

            IF v_day_units > 1
            THEN
               record_error (
                  p_error_count,
                  p_error_line,
                  p_error_number,
                  cnt,
                  86000274
               ); -- "Only one standby unit may be entered per day"
            END IF;
         END LOOP;

         -- Weekly 3100 cannot be combined with daily standby 3110 or 3120
         -- anywhere in the submitted week.
         IF     f_aug26_week_hours ('3100') > 0
            AND (   f_aug26_week_hours ('3110') > 0
                 OR f_aug26_week_hours ('3120') > 0
                )
         THEN
            FOR cnt IN 1 .. 7
            LOOP
               IF    f_aug26_hours ('3110', cnt)
                   + f_aug26_hours ('3120', cnt) > 0
               THEN
                  v_mixed_day := cnt;
                  EXIT;
               END IF;
            END LOOP;

            record_error (
               p_error_count,
               p_error_line,
               p_error_number,
               v_mixed_day,
               86000271
            ); -- "3100 cannot be combined with 3110/3120 in the week"
         END IF;
      END IF;
   END p_validate_malaysing_aug26;

-- <<< END INC1276683 MalaySing validation procedure


/************************************************************************************
* PATCH 5 OF 7
*
* ANCHOR:
*   In PROCEDURE clear_tables, add immediately after BEGIN and before the
*   existing FOR cnt IN 1 .. 7 LOOP.
*
************************************************************************************/

BEGIN
--RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026
   p_aug26_clear;

   -- Existing clear_tables logic follows unchanged.


/************************************************************************************
* PATCH 6 OF 7
*
* ANCHOR:
*   In PROCEDURE tally, add immediately after:
*
*      activity_type := f_activity_type (p_time_rec.att_abs_type);
*
*   and before:
*
*      IF activity_type.unit != 'U'
*
************************************************************************************/

--RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026
      p_aug26_collect (
         p_time_rec.att_abs_type,
         p_time_rec.DAY,
         p_time_rec.hours
      );


/************************************************************************************
* PATCH 7 OF 7
*
* ANCHOR:
*   In the main overloaded PROCEDURE validate, add immediately after:
*
*      f_eoyshutdowninfo(pg_org_code, pg_end_date);
*      dbms_output.put_line(
*         'inside validate(): exited call  f_eoyshutdowninfo()'
*      );
*
*   and before the comment:
*
*      -- Perform edits based on full week's worth of data
*
************************************************************************************/

--RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026
         p_validate_malaysing_aug26 (
            p_error_count,
            p_error_line,
            p_error_number
         );


/************************************************************************************
* END OF INC1276683 SOURCE-OVERLAY PAYLOAD
************************************************************************************/
```

**Implementation Note:**

The most important placement detail is that `p_validate_malaysing_aug26` must be inserted **after** `record_error`. In PL/SQL package bodies, a private procedure must be declared before it is referenced unless a forward declaration is added. The proposed placement avoids changing declarations or adding a forward declaration.

The second important placement detail is that `p_aug26_collect` must run **before** the existing `unit_flag != 'U'` check in `tally`; otherwise Singapore unit-based standby entries may never be captured.
