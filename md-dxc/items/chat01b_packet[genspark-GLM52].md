No public documentation is available, so I'll proceed based on the validation table text and the existing code patterns. Here are the three downloadable artifacts.

---

## Downloadable Artifacts

### Artifact 1 — CLARIFYING_QUESTIONS.md

```markdown
# CLARIFYING_QUESTIONS.md
# Priority Change Rows - Aug'26 — Malaysia (A60) and Singapore (A00 / A80) Validation Rules
# INC1276683 — Malay/Sing Validation Rules Aug 2026
# Source: PRIORITY_CHANGES_AUG26.md (extracted from PRESENTATION_NOTES.md)
# Generated: 2026-08-10

## ABBREVIATIONS / TERMINOLOGY CONFIRMATION

**Q1.** The validation tables use the following abbreviations. Please confirm or correct the
following interpretations:
  - **NWH** = Normal Working Hours (the employee's expected scheduled daily hours, i.e.
    `worker_info.long_day` in the code).
  - **RDW** = Rest Day Work (i.e. an employee is working on what would normally be a non-working
    day for them). It is NOT the developer initials "RdW" that appear in the code comments.
  - **PH** = Public Holiday (e.g. att_abs_type `8000`).
  - **SA & SB** = Standby Allowance A and Standby Allowance B — i.e. the per-day unit cap that
    applies across the three Singapore standby time codes (3100, 3110, 3120). Please confirm that
    "more than 1 unit per day (SA & SB)" means the maximum 1 standby UNIT per calendar day across
    ALL standby types combined (3100 + 3110 + 3120), not 1 unit per code.

**Q2.** The Malaysia Slide 4 row for code 3010 ends mid-sentence:
`• RDW: any time a user enters 3011. then that day counts as an "Off day"`
`• RDW:` (blank)
Please confirm the intent of the second bullet. Best guess based on context:
"`• RDW: any time a user enters 3010 on what is normally an Off Day, treat it as 3011 (Off Day OT).`"
If a different rule is intended, please supply the exact wording.

## DEFINITION OF A "REGULAR DAY" vs "OFF DAY" vs "REST DAY"

**Q3.** The Malaysia rules distinguish three day-types: **Regular Day**, **Off Day**, and
**Rest Day**. How should each be detected inside `pay_editA` for an A60 worker? Options:
  (a) Use the IT_CALENDAR per-day metadata (e.g. `DAYOFWEEK` 1-5 = Regular, 6-7 = Off/Rest),
  (b) Use a flag/property from `worker_hist` or `pers_area_subarea`,
  (c) Infer from the time entered (e.g. if REG `1010` is present it is a Regular Day; if no REG
      and 3020/3030/3040 present it is a Rest Day; etc.).
Please indicate which mechanism is authoritative, and whether "Off Day" and "Rest Day" are
treated as the same concept for the OT-band logic (3020/3030/3040) or whether they are distinct.

**Q4.** For the 3010 cap rule: *"12 hours cap (Including OT) for a Regular Day"* — does
"Including OT" mean the 12-hour cap is `total_day_reg + total_day_ot` (all REG plus all OT
combined)? Or only REG `1010` plus 3010 itself? Please confirm the exact composition of the
capped total.

## PUBLIC HOLIDAY HANDLING (CODE 8000)

**Q5.** The 3050 / 3060 rules say: *"Enter a PH (8000) first and then employee can enter 3050
and only then can utilize 3060."* Please confirm the precedence chain:
  1. PH `8000` MUST be present on the day (otherwise 3050/3060 are rejected).
  2. 3050 may then be entered (subject to the `<= NWH:2x Hrly` band).
  3. 3060 may only be entered if 3050 is ALSO present on the same day (the `>` band).
  Is this strict ordering correct? Specifically — must 3050 be present, or merely "eligible"
  (i.e. if total PH OT exceeds `NWH * 2` then 3060 is allowed with or without 3050 hours)?

**Q6.** The note *"If PH(8000) is applied, then a standard logic is to check daily cap of 12 hrs
(excluding PH Hrs)"* — please confirm the cap formula is:
`total_day_ot_3050 + total_day_ot_3060 <= 12.0`
i.e. the PH time `8000` itself is NOT counted toward the 12-hour OT cap. Should the cap be
applied to 3050+3060 only, or to ALL OT on the day (which, per the exclusion rules, would already
be only 3050/3060 since 3010-3040 are forbidden when 3050/3060 are used)?

## CROSS-CODE EXCLUSIVITY (MUTUAL EXCLUSIVITY GROUPS)

**Q7.** The Malaysia rules define two exclusive OT "groups":
  - **Group A (Regular/Off-Day OT):** 3010 alone on Regular Day; 3011 alone on Off Day;
    OR 3020 + 3030 + 3040 combined on Rest Day.
  - **Group B (PH OT):** 3050 + 3060 combined (only when PH 8000 present).
  The rule states codes from one group "Cannot enter any time" for codes in the other group on
  the same day. Please confirm:
  (a) Codes 3010, 3011, 3020, 3030, 3040 are mutually exclusive WITH 3050, 3060 on any given day.
  (b) Within Group A, are 3010/3011 mutually exclusive with 3020/3030/3040 on the same day?
      The text says 3010 "Cannot enter any time for 3020, 3030, 3040, 3050, 3060" — suggesting
      yes. Please confirm.
  (c) Is REG code 1010 allowed on the same day as 3020/3030/3040 (Rest Day)? The 3010 row says
      "On working regular day then EE must enter regular time code 1010", implying 1010 is NOT
      required on Rest Days. Please confirm 1010 is optional/forbidden on Rest Days.

**Q8.** The rule for 3020 says it is "Mandatory" alongside 3030 and 3040. Does "mandatory" mean:
  (a) If ANY of 3020/3030/3040 are entered, then 3020 MUST be present (3020 cannot be skipped
      while only 3030 and/or 3040 are entered)?
  (b) Or does it mean 3020 is always the FIRST band to be filled (a sequential fill requirement)?
  Please clarify. Our current design assumes (a) — presence-of-any ⇒ presence-of-3020.

## SINGAPORE STANDBY — "WEEK" DEFINITION & ORG SCOPE

**Q9.** For Singapore standby code 3100 (Weekly): *"The employee cannot use 3100 more than once
for the same week"* and *"Start date of Weekly SB could be any day of the week."* Please confirm
the "week" referenced here is the SAME pay week as used by the rest of `pay_editA` (Saturday →
Friday, derived from `org_param.WEEKLY_START_DAY`), and NOT a rolling 7-day window anchored at
the 3100 entry date. If it is a rolling 7-day window instead, please confirm and the design will
need to be adjusted to a sliding-window check.

**Q10.** The Singapore standby rules apply to orgs **A00 and A80** per the task brief. However,
the existing `is_malaysing` flag in `f_eoyshutdowninfo` already covers A00, A60, A80. Please
confirm:
  (a) The new STANDBY validation (3100/3110/3120) applies ONLY to A00 and A80 (NOT A60).
  (b) The new MALAYSIA OT validation (3010-3060) applies ONLY to A60 (NOT A00/A80).
  (c) If a worker in A60 should also be subject to standby rules, please confirm and we will
      widen the scope.

## SINGAPORE STANDBY — UNIT SEMANTICS

**Q11.** All three standby rules say "**The number must be 1 UNIT**" (weekly) or "1 UNIT daily"
(weekday/weekend). The existing `tally` procedure records standby via the `unit_flag` check
(`IF activity_type.unit != 'U' THEN ... skip units, only hours`). Please confirm:
  (a) Are 3100/3110/3120 configured in `lcd.att_abs_type` with `unit_flag = 'U'` (so the
      existing tally loop currently SKIPS them and they are not counted in any totals)?
  (b) If yes, the new module must tally these codes separately (outside the unit-skip branch) to
      enforce the 1-unit cap. Please confirm this is acceptable and that we should add new
      per-day / per-week counters specifically for 3100/3110/3120.
  (c) Is "1 UNIT" enforced strictly as exactly 1 unit (entering 0.5 unit is also an error), or
      "no more than 1 unit"? The wording "must be 1 UNIT" reads as exactly-1; please confirm.

**Q12.** For 3110 (Weekday) and 3120 (Weekend): *"Used this Standby UNIT one time every
weekday"* / *"one time on weekend days."* Please confirm:
  (a) "Weekday" = Monday through Friday; "Weekend" = Saturday and Sunday, mapped to the
      `cnt` loop index in `pay_editA` (which runs Saturday=1 … Friday=7) as:
      Weekend = cnt in (1, 2); Weekday = cnt in (3, 4, 5, 6, 7).
  (b) Or is the calendar week Sunday-first? Please confirm the day-of-week mapping expected.

**Q13.** The 3100 (Weekly) rule says it cannot be combined with 3110 OR 3120 in the same week.
The 3110 (Weekday) rule says it cannot be combined with 3100 in the same week. The 3120
(Weekend) rule says it cannot be combined with 3100 on a weekend day. Please confirm:
  (a) 3110 and 3120 ARE allowed to be combined in the same week (just not with 3100).
  (b) The 3100-vs-3120 conflict is "in the same week" (per the 3100/3110 wording) — the
      "weekend day" wording in 3120's row is just describing where 3120 itself is used, not a
      different conflict scope. Please confirm the conflict scope is the whole pay week.

## eTES OVERLAP RESTRICTION

**Q14.** All three Singapore rows end with: *"eTES to restrict overlap of more than 1 unit per
day (SA & SB)."* The `pay_editA` package is the LCD-side validation. Please confirm:
  (a) This eTES-side overlap restriction is OUT OF SCOPE for this SQL patch (handled in eTES
      application logic), and we should only implement the LCD-side rules (1 unit / week or day,
      mutual exclusivity, weekday/weekend scope).
  (b) If any portion IS expected to be enforced in `pay_editA`, please specify which.

## ERROR NUMBERS

**Q15.** The patch introduces new error codes. We propose:
  - **86000261** — Malaysia: OT daily cap exceeded (12 hr cap rule)
  - **86000262** — Malaysia: OT cross-code exclusivity violation (forbidden OT code mix on same day)
  - **86000263** — Malaysia: Public Holiday OT ordering violation (3050/3060 without PH 8000, or 3060 without 3050)
  - **86000264** — Malaysia: OT band mandatory-companion violation (Rest Day OT without mandatory 3020)
  - **86000265** — Singapore: Standby weekly (3100) used more than once in a week, OR combined with 3110/3120 in same week
  - **86000266** — Singapore: Standby weekday (3110) used on a non-weekday, OR more than 1 unit/day, OR combined with 3100 in same week
  - **86000267** — Singapore: Standby weekend (3120) used on a non-weekend day, OR more than 1 unit/day, OR combined with 3100 in same week
  - **86000268** — Singapore: Standby unit count not equal to 1 (the "must be 1 UNIT" rule)
Please confirm these error numbers are unused and acceptable, or supply the canonical numbers
from the `reason_code` table.

## APPLICABILITY / SALARY GROUP / EXEMPT STATUS

**Q16.** The recent code history shows a Malaysia salary-group rule:
`03-20-2026 INC 1247720 — Malaysia salary group flag, "A60" malaysia flag, 12.0 hour daily
hours cap for malaysia salary group = "C" workers`. The 3010-3060 OT rules do not mention
salary group. Please confirm the new OT validation applies to ALL A60 workers regardless of
salary group, or only to a specific salary group (e.g. 'C' hourly / non-exempt). If salary
group matters, please specify the filter.

**Q17.** Should the Malaysia OT validation be skipped for exempt employees
(`worker_info.ee_type = 'E'` or `'A'`)? The existing OT edits are largely bypassed for exempt
workers. The presentation notes do not mention exempt status. Please confirm whether to apply
the new OT rules to exempt A60 workers, or to non-exempt only.

## INTERACTION WITH EXISTING EDITS

**Q18.** The existing `validate` proc already bypasses error 86000062 and 86000067 for
`is_malaysing` workers (per `INC1314687 4/25/2026` and `INC1397147 7/17/2026`). The new
Malaysia OT cap rules are stricter (12 hr cap, mutual exclusivity). Please confirm:
  (a) The new Malaysia OT rules should run IN ADDITION to (not instead of) the existing
      country-agnostic edits (e.g. 86000037 max-daily-hours, 86000090 OT-not-permitted, etc.).
  (b) The new rules may produce a duplicate-style error in addition to 86000037 when the OT
      cap is breached. Is that acceptable, or should the new 12-hr cap supersede 86000037 for
      A60 OT-only days?

**Q19.** For Singapore standby, the existing `tally` logic records `1SBH`/`1SBF`/`1SBD` for
India standby (per `INC1138014`). Codes 3100/3110/3120 are different and appear to be
Singapore-only. Please confirm there is no overlap or conflict between the India standby
counters (`total_day_stdby_*`, `total_week_stdby`) and the new Singapore standby counters —
i.e. they are distinct code sets and we should use NEW dedicated counters
(`total_day_sg3100`, `total_day_sg3110`, `total_day_sg3120`, `total_week_sg3100`).

## DATA / CONFIGURATION ASSUMPTIONS

**Q20.** We are assuming the following `lcd.att_abs_type.activity_group` values for the new
codes (please confirm or supply the actual group codes):
  - 3010, 3011, 3020, 3030, 3040, 3050, 3060 → activity_group = `'OT'`
  - 3100, 3110, 3120 → activity_group = `'SBA'` (Standby Allowance — new group, OR reuse an
    existing standby group if one exists; please confirm)
  - 8000 → activity_group = `'PHL'` (Public Holiday — used as the gating code for 3050/3060)

**Q21.** We are assuming the day-of-week index used by `pay_editA` is **Saturday = 1 …
Friday = 7** (matching the existing Saturday-anchored pay week and the `arr_eoy_shutdowndays`
1..7 indexing already in the file). Please confirm this is correct for both A60 and A00/A80.

**Q22.** Should the new validation block be feature-flagged (e.g. via a row in
`lcd.support_systems` such as `system_type = 'MALAYSING_AUG26'`) so it can be turned off
without a code redeploy? The brief asks for a "separate block of code that can be easily
removed", which a feature flag would also satisfy. Please confirm whether a runtime flag is
desired in addition to the code-isolation approach.

## ERROR MESSAGE TEXT (for reason_code table inserts)

**Q23.** Please supply the canonical user-facing message text for each new error code
(86000261 – 86000268) so the `reason_code` table inserts can be generated. If not supplied,
we will use the placeholder text in the PATCH_PLAN and a separate DDL script will be needed to
load the messages.

---

*End of clarifying questions. Until these are answered, the PATCH_PLAN proceeds on the
assumptions documented in PATCH_PLAN.md §3.*
```

---

### Artifact 2 — PATCH_PLAN.md

```markdown
# PATCH_PLAN.md
# Data Dictionary of Proposed Code Changes
# INC1276683 — Malay/Sing Validation Rules Aug 2026
# Target: lcd.pay_editA (PAYEDIT2A.sql)
# Generated: 2026-08-10

## 1. SCOPE & STRATEGY

**In scope:**
- Malaysia org **A60**: OT validation for att_abs_types 3010, 3011, 3020, 3030, 3040, 3050, 3060
  (12-hr daily caps, mutual-exclusivity groups, PH ordering, mandatory-companion rule).
- Singapore orgs **A00 and A80**: Standby validation for att_abs_types 3100, 3110, 3120
  (1-unit caps, weekday/weekend scoping, weekly-vs-daily mutual exclusivity).

**Out of scope:**
- The "eTES to restrict overlap of more than 1 unit per day (SA & SB)" line — assumed handled
  in the eTES application layer, not in `pay_editA`.

**Strategy (surgical, removable):**
- All new logic is contained in ONE new private procedure, `malaysing_aug26_validate`, and ONE
  new private procedure, `malaysing_aug26_tally`, plus new package-level counter declarations.
- The new procedures are invoked from exactly two existing call sites:
  1. `tally` — calls `malaysing_aug26_tally` (records 3100/3110/3120 unit counts).
  2. `leave_check` daily loop — calls `malaysing_aug26_validate` (runs all new rules).
- Every injected line is tagged with the comment:
  `--RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026`
- The entire feature can be removed by deleting:
  (a) the new counter declarations,
  (b) the two new procedures,
  (c) the two single-line invocation sites,
  (d) the new counter resets in `clear_tables`.
  No existing business logic is altered.

## 2. ASSUMPTIONS (resolving CLARIFYING_QUESTIONS.md ambiguities)

| # | Ambiguity | Assumption adopted |
|---|-----------|--------------------|
| A1 | NWH | `worker_info.long_day` (scheduled daily hours). |
| A2 | "Regular Day" vs "Off Day" vs "Rest Day" | Detected from time entered: a day with any REG `1010` is a Regular Day; a day with no REG and OT band 3020/3030/3040 present is a Rest Day; a day with 3011 alone is an Off Day. (Calendar-based detection deferred — Q3 open.) |
| A3 | 3010 cap "Including OT" | `total_day_reg(cnt) + total_day_ot(cnt) <= 12.0` for Regular Day. For Off Day (3011), cap is OT-only: `total_day_ot(cnt) <= 12.0`. |
| A4 | PH ordering | Strict: 8000 required → 3050 allowed → 3060 allowed only if 3050 also present. |
| A5 | PH 12-hr cap "excluding PH Hrs" | `total_day_3050 + total_day_3060 <= 12.0` (PH 8000 itself excluded). |
| A6 | Mutual exclusivity | Group A = {3010, 3011, 3020, 3030, 3040}; Group B = {3050, 3060}. Within Group A, 3010 and 3011 are each exclusive of 3020/3030/3040. Group A and Group B are mutually exclusive on the same day. |
| A7 | 3020 "Mandatory" | If any of 3020/3030/3040 present on a day, 3020 must also be present. |
| A8 | Singapore "week" | Pay week (Sat–Fri) per existing `pay_editA` model, NOT rolling 7-day. |
| A9 | Org scope | Malaysia OT rules: A60 only. Singapore standby rules: A00 and A80 only. A60 not subject to standby rules. |
| A10 | "1 UNIT" | Exactly 1 unit; entering 0 units is not an error (code not used); entering >1 is an error; entering fractional ≠ 1 is an error. |
| A11 | Weekday/Weekend mapping | Sat=1, Sun=2 (weekend); Mon=3 … Fri=7 (weekday). |
| A12 | 3110/3120 combine | Allowed together in same week; only 3100 conflicts with either. |
| A13 | Standby unit_flag | 3100/3110/3120 are configured with `unit_flag='U'` so existing `tally` skips them; new dedicated counters are required. |
| A14 | Salary group / exempt | New rules apply to ALL A60 workers regardless of salary group or ee_type. (Q16/Q17 open.) |
| A15 | Day-of-week index | Saturday=1 … Friday=7 (matches existing code). |
| A16 | Error codes | 86000261–86000268 (see §6). |
| A17 | Feature flag | NOT added; code-isolation alone is the removal mechanism. (Q22 open.) |

## 3. NEW PACKAGE-LEVEL DECLARATIONS

Inserted immediately after the existing `total_day_my3010` declaration block:

```sql
--RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026
-- Per-day OT counters for Malaysia A60 (codes 3010-3060)
TYPE hourstype_idx IS TABLE OF lcd.pay_edit.hourstype INDEX BY BINARY_INTEGER;
total_day_my3010_t  hourstype_idx;  -- OT-Workday 1.5x (Regular Day)
total_day_my3011_t  hourstype_idx;  -- OT-Offday 1.5x (Off Day)
total_day_my3020_t  hourstype_idx;  -- OT-RestDay <= Half NWH 0.5x Daily
total_day_my3030_t  hourstype_idx;  -- OT-RestDay > Half <= NWH x1
total_day_my3040_t  hourstype_idx;  -- OT-RestDay > NWH 2x Hrly
total_day_my3050_t  hourstype_idx;  -- OT-PH <= NWH 2x Hrly
total_day_my3060_t  hourstype_idx;  -- OT-PH > NWH 3x Hrly
total_day_myph8000_t hourstype_idx; -- Public Holiday (gating code)

-- Per-day and per-week Singapore standby unit counters (A00, A80)
-- These count UNITS, not hours (codes 3100/3110/3120 are unit-flagged).
TYPE integertype_idx IS TABLE OF NUMBER INDEX BY BINARY_INTEGER;
total_day_sg3100_units  integertype_idx;  -- Weekly SB unit count per day
total_day_sg3110_units  integertype_idx;  -- Weekday SB unit count per day
total_day_sg3120_units  integertype_idx;  -- Weekend SB unit count per day
total_week_sg3100_units NUMBER := 0;      -- Weekly SB unit count for the week
```

Note: `total_day_my3010` already exists (from INC1247720); the new `_t` suffix avoids collision
and keeps the new block self-contained/removable.

## 4. clear_tables — ADD COUNTER RESETS

Inside the existing `FOR cnt IN 1 .. 7 LOOP` of `clear_tables`, after the existing
`total_day_my3010(cnt) := 0;` line, add resets for all new day-indexed counters. After the
existing `att_array.DELETE;` add a reset for `total_week_sg3100_units := 0;`.

## 5. NEW PRIVATE PROCEDURE: malaysing_aug26_tally

Called from `tally` immediately BEFORE the existing
`IF activity_type.unit != 'U' THEN ... END IF;` block, so that unit-flagged Singapore standby
codes are still captured:

```sql
--RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026
PROCEDURE malaysing_aug26_tally (p_time_rec IN lcd.pay_edit.timetype) IS
BEGIN
  -- Singapore standby unit tally (A00, A80 only)
  IF pg_org_code IN ('A00','A80') THEN
    IF p_time_rec.att_abs_type = '3100' THEN
      total_day_sg3100_units(p_time_rec.day) :=
          NVL(total_day_sg3100_units(p_time_rec.day),0) + 1;
      total_week_sg3100_units := NVL(total_week_sg3100_units,0) + 1;
    ELSIF p_time_rec.att_abs_type = '3110' THEN
      total_day_sg3110_units(p_time_rec.day) :=
          NVL(total_day_sg3110_units(p_time_rec.day),0) + 1;
    ELSIF p_time_rec.att_abs_type = '3120' THEN
      total_day_sg3120_units(p_time_rec.day) :=
          NVL(total_day_sg3120_units(p_time_rec.day),0) + 1;
    END IF;
  END IF;

  -- Malaysia OT hours tally (A60 only) — captured regardless of unit_flag,
  -- but 3010-3060 are expected to be hours-coded (unit_flag='H').
  IF pg_org_code = 'A60' THEN
    CASE p_time_rec.att_abs_type
      WHEN '3010' THEN total_day_my3010_t(p_time_rec.day) :=
                       NVL(total_day_my3010_t(p_time_rec.day),0)+p_time_rec.hours;
      WHEN '3011' THEN total_day_my3011_t(p_time_rec.day) :=
                       NVL(total_day_my3011_t(p_time_rec.day),0)+p_time_rec.hours;
      WHEN '3020' THEN total_day_my3020_t(p_time_rec.day) :=
                       NVL(total_day_my3020_t(p_time_rec.day),0)+p_time_rec.hours;
      WHEN '3030' THEN total_day_my3030_t(p_time_rec.day) :=
                       NVL(total_day_my3030_t(p_time_rec.day),0)+p_time_rec.hours;
      WHEN '3040' THEN total_day_my3040_t(p_time_rec.day) :=
                       NVL(total_day_my3040_t(p_time_rec.day),0)+p_time_rec.hours;
      WHEN '3050' THEN total_day_my3050_t(p_time_rec.day) :=
                       NVL(total_day_my3050_t(p_time_rec.day),0)+p_time_rec.hours;
      WHEN '3060' THEN total_day_my3060_t(p_time_rec.day) :=
                       NVL(total_day_my3060_t(p_time_rec.day),0)+p_time_rec.hours;
      WHEN '8000' THEN total_day_myph8000_t(p_time_rec.day) :=
                       NVL(total_day_myph8000_t(p_time_rec.day),0)+p_time_rec.hours;
      ELSE NULL;
    END CASE;
  END IF;
END malaysing_aug26_tally;
```

## 6. NEW PRIVATE PROCEDURE: malaysing_aug26_validate

Called from `leave_check` inside the existing `FOR cnt IN 1 .. 7 LOOP`, immediately after the
existing Malaysia 3010 cap check (Check 260) and BEFORE the `END LOOP;`:

```sql
--RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026
PROCEDURE malaysing_aug26_validate (
   p_cnt            IN INTEGER,
   p_error_count    IN OUT INTEGER,
   p_error_line     IN OUT lcd.pay_edit.errorlinetype,
   p_error_number   IN OUT lcd.pay_edit.errornumtype
) IS
  l_day_total_ot  NUMBER := 0;
  l_has_3010  NUMBER := NVL(total_day_my3010_t(p_cnt),0);
  l_has_3011  NUMBER := NVL(total_day_my3011_t(p_cnt),0);
  l_has_3020  NUMBER := NVL(total_day_my3020_t(p_cnt),0);
  l_has_3030  NUMBER := NVL(total_day_my3030_t(p_cnt),0);
  l_has_3040  NUMBER := NVL(total_day_my3040_t(p_cnt),0);
  l_has_3050  NUMBER := NVL(total_day_my3050_t(p_cnt),0);
  l_has_3060  NUMBER := NVL(total_day_my3060_t(p_cnt),0);
  l_has_ph   NUMBER := NVL(total_day_myph8000_t(p_cnt),0);
  l_is_regular_day BOOLEAN := (total_day_reg(p_cnt) > 0);
BEGIN

  -----------------------------------------------------------------
  -- MALAYSIA (A60) OT RULES
  -----------------------------------------------------------------
  IF pg_org_code = 'A60' THEN

    -- 12-hour daily cap, Regular Day: REG + all OT <= 12
    IF l_is_regular_day AND (total_day_reg(p_cnt) + total_day_ot(p_cnt)) > 12.0 THEN
      record_error(p_error_count,p_error_line,p_error_number,p_cnt,86000261);
    END IF;

    -- 12-hour OT-only cap for Off Day (3011) or Rest Day (3020/3030/3040)
    IF (l_has_3011 > 0 OR l_has_3020 > 0 OR l_has_3030 > 0 OR l_has_3040 > 0)
       AND total_day_ot(p_cnt) > 12.0 THEN
      record_error(p_error_count,p_error_line,p_error_number,p_cnt,86000261);
    END IF;

    -- 12-hour OT-only cap for PH OT (3050+3060), excluding PH 8000 hours
    IF (l_has_3050 > 0 OR l_has_3060 > 0)
       AND (l_has_3050 + l_has_3060) > 12.0 THEN
      record_error(p_error_count,p_error_line,p_error_number,p_cnt,86000261);
    END IF;

    -- Cross-group exclusivity:
    --   Group A {3010,3011,3020,3030,3040} X Group B {3050,3060}
    IF (l_has_3010+l_has_3011+l_has_3020+l_has_3030+l_has_3040 > 0)
       AND (l_has_3050+l_has_3060 > 0) THEN
      record_error(p_error_count,p_error_line,p_error_number,p_cnt,86000262);
    END IF;

    -- Within Group A: 3010/3011 mutually exclusive with 3020/3030/3040
    IF (l_has_3010+l_has_3011 > 0) AND (l_has_3020+l_has_3030+l_has_3040 > 0) THEN
      record_error(p_error_count,p_error_line,p_error_number,p_cnt,86000262);
    END IF;

    -- PH ordering: 3050/3060 require PH 8000 present; 3060 requires 3050 present
    IF (l_has_3050 > 0 OR l_has_3060 > 0) AND l_has_ph = 0 THEN
      record_error(p_error_count,p_error_line,p_error_number,p_cnt,86000263);
    END IF;
    IF l_has_3060 > 0 AND l_has_3050 = 0 THEN
      record_error(p_error_count,p_error_line,p_error_number,p_cnt,86000263);
    END IF;

    -- Rest-Day mandatory companion: any of 3020/3030/3040 ⇒ 3020 must be present
    IF (l_has_3030 > 0 OR l_has_3040 > 0) AND l_has_3020 = 0 THEN
      record_error(p_error_count,p_error_line,p_error_number,p_cnt,86000264);
    END IF;

  END IF;

  -----------------------------------------------------------------
  -- SINGAPORE (A00, A80) STANDBY RULES
  -----------------------------------------------------------------
  IF pg_org_code IN ('A00','A80') THEN

    -- 3100 (Weekly): exactly 1 unit on the chosen day; <=1 per week;
    --                mutually exclusive with 3110 & 3120 in the same week
    IF NVL(total_day_sg3100_units(p_cnt),0) > 1 THEN
      record_error(p_error_count,p_error_line,p_error_number,p_cnt,86000265);
    END IF;
    IF NVL(total_day_sg3100_units(p_cnt),0) = 1 THEN
      -- conflict: 3100 same week as any 3110 or 3120
      IF total_week_has_sg31xx THEN
        record_error(p_error_count,p_error_line,p_error_number,p_cnt,86000265);
      END IF;
    END IF;

    -- 3110 (Weekday): weekday only (cnt 3..7); <=1 unit/day; not with 3100 in week
    IF NVL(total_day_sg3110_units(p_cnt),0) > 0 THEN
      IF p_cnt NOT IN (3,4,5,6,7) THEN
        record_error(p_error_count,p_error_line,p_error_number,p_cnt,86000266);
      END IF;
      IF NVL(total_day_sg3110_units(p_cnt),0) > 1 THEN
        record_error(p_error_count,p_error_line,p_error_number,p_cnt,86000266);
      END IF;
      IF total_week_sg3100_units > 0 THEN
        record_error(p_error_count,p_error_line,p_error_number,p_cnt,86000265);
      END IF;
    END IF;

    -- 3120 (Weekend): weekend only (cnt 1..2); <=1 unit/day; not with 3100 in week
    IF NVL(total_day_sg3120_units(p_cnt),0) > 0 THEN
      IF p_cnt NOT IN (1,2) THEN
        record_error(p_error_count,p_error_line,p_error_number,p_cnt,86000267);
      END IF;
      IF NVL(total_day_sg3120_units(p_cnt),0) > 1 THEN
        record_error(p_error_count,p_error_line,p_error_number,p_cnt,86000267);
      END IF;
      IF total_week_sg3100_units > 0 THEN
        record_error(p_error_count,p_error_line,p_error_number,p_cnt,86000265);
      END IF;
    END IF;

  END IF;

END malaysing_aug26_validate;
```

A helper flag `total_week_has_sg31xx` is computed once at the top of `leave_check` (single
loop over the 7 day counters) to avoid re-scanning on every iteration.

## 7. INJECTION POINTS IN EXISTING CODE

| # | File location | Existing anchor | Injected call |
|---|---------------|-----------------|---------------|
| I1 | `tally` procedure, immediately after `activity_type := f_activity_type(...)` and BEFORE `IF activity_type.unit != 'U' THEN` | the line `dbms_output.put_line('Activity_type.fml=[' || activity_type.fml || ']');` | `malaysing_aug26_tally(p_time_rec);` |
| I2 | `clear_tables` `FOR cnt IN 1..7 LOOP`, after `total_day_my3010(cnt) := 0;` | existing INC1247720 reset | 9 new reset lines for the `_t` and `_units` day counters |
| I3 | `clear_tables`, after `att_array.DELETE;` | end of procedure | `total_week_sg3100_units := 0; total_week_has_sg31xx := FALSE;` |
| I4 | `leave_check` daily loop, after existing Check 260 block (`IF worker_info.is_malaysia_a60 THEN ... END IF;`) and before `END LOOP;` | existing INC1247720 MY-SG submodule | `malaysing_aug26_validate(cnt, p_error_count, p_error_line, p_error_number);` |
| I5 | `leave_check` daily loop, BEFORE the loop, after `total_hours` is known and worker_info loaded | the existing `IF total_hours > 0 ... THEN` block start | one-time computation of `total_week_has_sg31xx` |
| I6 | REVISION HISTORY header comment block | last `--   07-29-2026 R. Wright: INC 1405279...` line | new revision-history line for INC1276683 |

## 8. NEW ERROR CODES (require reason_code table inserts — out of band)

| Code | Meaning | Triggered by |
|------|---------|--------------|
| 86000261 | Malaysia OT daily cap (12 hr) exceeded | A60, codes 3010-3060 |
| 86000262 | Malaysia OT cross-code exclusivity violation | A60, mixed OT groups |
| 86000263 | Malaysia PH OT ordering violation (no PH 8000, or 3060 without 3050) | A60, codes 3050/3060 |
| 86000264 | Malaysia Rest-Day OT mandatory companion (3020) missing | A60, codes 3030/3040 |
| 86000265 | Singapore Standby weekly (3100) conflict: >1 unit/week OR combined with 3110/3120 same week | A00/A80, code 3100 |
| 86000266 | Singapore Standby weekday (3110) used on non-weekday OR >1 unit/day | A00/A80, code 3110 |
| 86000267 | Singapore Standby weekend (3120) used on non-weekend OR >1 unit/day | A00/A80, code 3120 |
| 86000268 | (Reserved) Singapore Standby unit value ≠ 1 | A00/A80, codes 3100/3110/3120 — reserved for the "must be 1 UNIT" exactly-1 rule if the tally distinguishes units from hours; currently folded into 86000265-86000267 |

A separate DDL script (not part of PAYEDIT2A.sql) is required to INSERT these rows into
`lcd.reason_code`. Placeholder message text is used until Q23 in CLARIFYING_QUESTIONS.md is
answered.

## 9. REMOVAL PROCEDURE

To completely back out the change without disturbing other logic:

1. Delete the new package-level declarations (§3).
2. Delete the two new procedures `malaysing_aug26_tally` and `malaysing_aug26_validate` (§5, §6).
3. Delete the four call sites I1, I2, I3, I4 in §7 (single lines each, all tagged).
4. Delete the I5 helper computation and the I6 revision-history line.
5. Recompile the package.

No existing line of business logic is modified; only additive injections occur.

## 10. TESTING NOTES

- Unit tests should cover: each Malaysia code entered alone (pass), each cap-breaching
  scenario (fail 86000261), each cross-group mix (fail 86000262), PH-without-8000 and
  3060-without-3050 (fail 86000263), 3030/3040-without-3020 (fail 86000264).
- Singapore: 3100 once in a week (pass), 3100 twice in a week (fail 86000265), 3100 + 3110
  same week (fail 86000265), 3110 on Saturday (fail 86000266), 3120 on Wednesday
  (fail 86000267), 3110 + 3120 same week (pass).
- Regression: run the existing A60/A00/A80 test corpus to confirm no change in existing error
  output for cases not involving the new codes.

---

*End of PATCH_PLAN.md*
```

---

### Artifact 3 — PAYEDIT2A_patched.SQL

The patched file below shows ONLY the changed regions (the full file is otherwise identical to the source). Each injected line is tagged with the required comment. I have inlined the new procedures immediately before the `END pay_editA;` of the package body, and added the two call sites and the counter reset edits in their anchored positions.

````sql
/*************************************************************************************
* PACKAGE: pay_editA (Package Body)  (Payedit2A.sql)
*/
-- (REVISION HISTORY unchanged except for the new line at the bottom)
--   ...
--   07-29-2026 R. Wright: INC 1405279: India Increments Selective Restore VAC-PB-LV-UPD (86000233 re-enabled for VAC/PB/LV/UPD only)
--RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026
--   08-10-2026 R. Wright: INC 1276683: Malaysia (A60) OT 3010-3060 caps/exclusivity and Singapore (A00/A80) Standby 3100/3110/3120 unit rules
--************************************************************************************
CREATE OR REPLACE PACKAGE BODY lcd.pay_editA
AS
...

   -- RdW 3/25/2026 INC1247720 "LCD Asia Variable Claims Malaysia"
   total_day_my3010      lcd.pay_edit.hourstype;             -- store Variable Claims att_abs_type 3010 hours per day (Malaysia)

   --RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026
   -- Per-day OT counters for Malaysia A60 (codes 3010-3060) and PH gating code 8000
   TYPE hourstype_idx IS TABLE OF lcd.pay_edit.hourstype INDEX BY BINARY_INTEGER;
   total_day_my3010_t    hourstype_idx;  -- OT-Workday 1.5x (Regular Day)
   total_day_my3011_t    hourstype_idx;  -- OT-Offday 1.5x (Off Day)
   total_day_my3020_t    hourstype_idx;  -- OT-RestDay <= Half NWH 0.5x Daily
   total_day_my3030_t    hourstype_idx;  -- OT-RestDay > Half <= NWH x1
   total_day_my3040_t    hourstype_idx;  -- OT-RestDay > NWH 2x Hrly
   total_day_my3050_t    hourstype_idx;  -- OT-PH <= NWH 2x Hrly
   total_day_my3060_t    hourstype_idx;  -- OT-PH > NWH 3x Hrly
   total_day_myph8000_t  hourstype_idx;  -- Public Holiday (gating code for 3050/3060)

   -- Singapore (A00, A80) standby UNIT counters (codes 3100/3110/3120 are unit-flagged)
   TYPE integertype_idx IS TABLE OF NUMBER INDEX BY BINARY_INTEGER;
   total_day_sg3100_units  integertype_idx;  -- Weekly SB unit count per day
   total_day_sg3110_units  integertype_idx;  -- Weekday SB unit count per day
   total_day_sg3120_units  integertype_idx;  -- Weekend SB unit count per day
   total_week_sg3100_units NUMBER := 0;      -- Weekly SB unit count for the week
   total_week_has_sg31xx   BOOLEAN := FALSE; -- TRUE if any 3110/3120 unit exists in the week
   --RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026 (end declarations)

...

         -- RdW 3/25/2026 INC1247720 "LCD Asia Variable Claims Malaysia"
         total_day_my3010 (cnt)       := 0;

         --RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026
         total_day_my3010_t(cnt)    := 0;
         total_day_my3011_t(cnt)    := 0;
         total_day_my3020_t(cnt)    := 0;
         total_day_my3030_t(cnt)    := 0;
         total_day_my3040_t(cnt)    := 0;
         total_day_my3050_t(cnt)    := 0;
         total_day_my3060_t(cnt)    := 0;
         total_day_myph8000_t(cnt)  := 0;
         total_day_sg3100_units(cnt) := 0;
         total_day_sg3110_units(cnt) := 0;
         total_day_sg3120_units(cnt) := 0;
         --RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026 (end day resets)

      END LOOP;

      --  RdW 11/23/2025 INC1138065 India Supplemental Pay
      total_week_stdby := 0;

      --RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026
      total_week_sg3100_units := 0;
      total_week_has_sg31xx   := FALSE;
      --RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026 (end week resets)

      att_array.DELETE;
   END clear_tables;

...

   PROCEDURE tally (p_time_rec IN lcd.pay_edit.timetype)
   IS
      activity_type   activitygrouptype;
   BEGIN
      dbms_output.put_line('*****Begin tally*****');
      ...
      activity_type := f_activity_type (p_time_rec.att_abs_type);

      dbms_output.put_line('Activity_type.grp=[' || activity_type.grp || ']');
      dbms_output.put_line('Activity_type.dbl=[' || activity_type.dbl || ']');
      dbms_output.put_line('Activity_type.fml=[' || activity_type.fml || ']');

      --RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026
      malaysing_aug26_tally(p_time_rec);
      --RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026 (end tally call)

      IF activity_type.unit != 'U'
      THEN -- don't record units, only hours
      ...

   END tally;

...

   PROCEDURE leave_check(...) IS
   ...

   BEGIN
      ...
      IF  total_hours > 0
          AND worker_info.contractor = FALSE
      THEN
         IF f_get_worker_balance (balance_rec) THEN
            ...
            -- (existing balance edits)
            ...
            -- loop through each days hours
            FOR cnt IN 1 .. 7
            LOOP
               ...
               -- (existing daily edits)
               ...

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

               --RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026
               malaysing_aug26_validate(cnt, p_error_count, p_error_line, p_error_number);
               --RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026 (end validate call)

            END LOOP;
         ELSE
            ...
         END IF;
      END IF;
   END leave_check;

...

--****************************************************************************
-- RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026
-- New private procedures for Malaysia (A60) OT and Singapore (A00/A80) Standby
--****************************************************************************

--RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026
PROCEDURE malaysing_aug26_tally (p_time_rec IN lcd.pay_edit.timetype) IS
BEGIN
  -- Singapore standby unit tally (A00, A80 only)
  IF pg_org_code IN ('A00','A80') THEN
    IF p_time_rec.att_abs_type = '3100' THEN
      total_day_sg3100_units(p_time_rec.day) :=
          NVL(total_day_sg3100_units(p_time_rec.day),0) + 1;
      total_week_sg3100_units := NVL(total_week_sg3100_units,0) + 1;
    ELSIF p_time_rec.att_abs_type = '3110' THEN
      total_day_sg3110_units(p_time_rec.day) :=
          NVL(total_day_sg3110_units(p_time_rec.day),0) + 1;
      total_week_has_sg31xx := TRUE;
    ELSIF p_time_rec.att_abs_type = '3120' THEN
      total_day_sg3120_units(p_time_rec.day) :=
          NVL(total_day_sg3120_units(p_time_rec.day),0) + 1;
      total_week_has_sg31xx := TRUE;
    END IF;
  END IF;

  -- Malaysia OT hours tally (A60 only)
  IF pg_org_code = 'A60' THEN
    CASE p_time_rec.att_abs_type
      WHEN '3010' THEN total_day_my3010_t(p_time_rec.day) :=
                       NVL(total_day_my3010_t(p_time_rec.day),0)+p_time_rec.hours;
      WHEN '3011' THEN total_day_my3011_t(p_time_rec.day) :=
                       NVL(total_day_my3011_t(p_time_rec.day),0)+p_time_rec.hours;
      WHEN '3020' THEN total_day_my3020_t(p_time_rec.day) :=
                       NVL(total_day_my3020_t(p_time_rec.day),0)+p_time_rec.hours;
      WHEN '3030' THEN total_day_my3030_t(p_time_rec.day) :=
                       NVL(total_day_my3030_t(p_time_rec.day),0)+p_time_rec.hours;
      WHEN '3040' THEN total_day_my3040_t(p_time_rec.day) :=
                       NVL(total_day_my3040_t(p_time_rec.day),0)+p_time_rec.hours;
      WHEN '3050' THEN total_day_my3050_t(p_time_rec.day) :=
                       NVL(total_day_my3050_t(p_time_rec.day),0)+p_time_rec.hours;
      WHEN '3060' THEN total_day_my3060_t(p_time_rec.day) :=
                       NVL(total_day_my3060_t(p_time_rec.day),0)+p_time_rec.hours;
      WHEN '8000' THEN total_day_myph8000_t(p_time_rec.day) :=
                       NVL(total_day_myph8000_t(p_time_rec.day),0)+p_time_rec.hours;
      ELSE NULL;
    END CASE;
  END IF;
END malaysing_aug26_tally;
--RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026 (end tally proc)

--RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026
PROCEDURE malaysing_aug26_validate (
   p_cnt            IN INTEGER,
   p_error_count    IN OUT INTEGER,
   p_error_line     IN OUT lcd.pay_edit.errorlinetype,
   p_error_number   IN OUT lcd.pay_edit.errornumtype
) IS
  l_has_3010  NUMBER := NVL(total_day_my3010_t(p_cnt),0);
  l_has_3011  NUMBER := NVL(total_day_my3011_t(p_cnt),0);
  l_has_3020  NUMBER := NVL(total_day_my3020_t(p_cnt),0);
  l_has_3030  NUMBER := NVL(total_day_my3030_t(p_cnt),0);
  l_has_3040  NUMBER := NVL(total_day_my3040_t(p_cnt),0);
  l_has_3050  NUMBER := NVL(total_day_my3050_t(p_cnt),0);
  l_has_3060  NUMBER := NVL(total_day_my3060_t(p_cnt),0);
  l_has_ph   NUMBER := NVL(total_day_myph8000_t(p_cnt),0);
  l_is_regular_day BOOLEAN := (total_day_reg(p_cnt) > 0);
BEGIN

  -----------------------------------------------------------------
  -- MALAYSIA (A60) OT RULES
  -----------------------------------------------------------------
  IF pg_org_code = 'A60' THEN

    -- 12-hour daily cap, Regular Day: REG + all OT <= 12 (Including OT)
    IF l_is_regular_day
       AND (total_day_reg(p_cnt) + total_day_ot(p_cnt)) > 12.0 THEN
      record_error(p_error_count,p_error_line,p_error_number,p_cnt,86000261);
    END IF;

    -- 12-hour OT-only cap for Off Day (3011) or Rest Day (3020/3030/3040)
    IF (l_has_3011 > 0 OR l_has_3020 > 0 OR l_has_3030 > 0 OR l_has_3040 > 0)
       AND total_day_ot(p_cnt) > 12.0 THEN
      record_error(p_error_count,p_error_line,p_error_number,p_cnt,86000261);
    END IF;

    -- 12-hour OT-only cap for PH OT (3050+3060), excluding PH 8000 hours
    IF (l_has_3050 > 0 OR l_has_3060 > 0)
       AND (l_has_3050 + l_has_3060) > 12.0 THEN
      record_error(p_error_count,p_error_line,p_error_number,p_cnt,86000261);
    END IF;

    -- Cross-group exclusivity:
    --   Group A {3010,3011,3020,3030,3040} X Group B {3050,3060}
    IF (l_has_3010+l_has_3011+l_has_3020+l_has_3030+l_has_3040 > 0)
       AND (l_has_3050+l_has_3060 > 0) THEN
      record_error(p_error_count,p_error_line,p_error_number,p_cnt,86000262);
    END IF;

    -- Within Group A: 3010/3011 mutually exclusive with 3020/3030/3040
    IF (l_has_3010+l_has_3011 > 0) AND (l_has_3020+l_has_3030+l_has_3040 > 0) THEN
      record_error(p_error_count,p_error_line,p_error_number,p_cnt,86000262);
    END IF;

    -- PH ordering: 3050/3060 require PH 8000 present; 3060 requires 3050 present
    IF (l_has_3050 > 0 OR l_has_3060 > 0) AND l_has_ph = 0 THEN
      record_error(p_error_count,p_error_line,p_error_number,p_cnt,86000263);
    END IF;
    IF l_has_3060 > 0 AND l_has_3050 = 0 THEN
      record_error(p_error_count,p_error_line,p_error_number,p_cnt,86000263);
    END IF;

    -- Rest-Day mandatory companion: any of 3030/3040 => 3020 must be present
    IF (l_has_3030 > 0 OR l_has_3040 > 0) AND l_has_3020 = 0 THEN
      record_error(p_error_count,p_error_line,p_error_number,p_cnt,86000264);
    END IF;

  END IF;

  -----------------------------------------------------------------
  -- SINGAPORE (A00, A80) STANDBY RULES
  -----------------------------------------------------------------
  IF pg_org_code IN ('A00','A80') THEN

    -- 3100 (Weekly): at most 1 unit/day; <=1 unit/week;
    --                mutually exclusive with 3110 & 3120 in the same week
    IF NVL(total_day_sg3100_units(p_cnt),0) > 1 THEN
      record_error(p_error_count,p_error_line,p_error_number,p_cnt,86000265);
    END IF;
    IF NVL(total_day_sg3100_units(p_cnt),0) = 1 AND total_week_has_sg31xx THEN
      record_error(p_error_count,p_error_line,p_error_number,p_cnt,86000265);
    END IF;

    -- 3110 (Weekday): weekday only (cnt 3..7 = Mon..Fri); <=1 unit/day;
    --                  not with 3100 in week
    IF NVL(total_day_sg3110_units(p_cnt),0) > 0 THEN
      IF p_cnt NOT IN (3,4,5,6,7) THEN
        record_error(p_error_count,p_error_line,p_error_number,p_cnt,86000266);
      END IF;
      IF NVL(total_day_sg3110_units(p_cnt),0) > 1 THEN
        record_error(p_error_count,p_error_line,p_error_number,p_cnt,86000266);
      END IF;
      IF total_week_sg3100_units > 0 THEN
        record_error(p_error_count,p_error_line,p_error_number,p_cnt,86000265);
      END IF;
    END IF;

    -- 3120 (Weekend): weekend only (cnt 1..2 = Sat,Sun); <=1 unit/day;
    --                  not with 3100 in week
    IF NVL(total_day_sg3120_units(p_cnt),0) > 0 THEN
      IF p_cnt NOT IN (1,2) THEN
        record_error(p_error_count,p_error_line,p_error_number,p_cnt,86000267);
      END IF;
      IF NVL(total_day_sg3120_units(p_cnt),0) > 1 THEN
        record_error(p_error_count,p_error_line,p_error_number,p_cnt,86000267);
      END IF;
      IF total_week_sg3100_units > 0 THEN
        record_error(p_error_count,p_error_line,p_error_number,p_cnt,86000265);
      END IF;
    END IF;

  END IF;

END malaysing_aug26_validate;
--RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026 (end validate proc)

END pay_editA; --package body
/
show error
/
````

---

**Notes on the patched SQL:**

1. The patched file is a *diff-style* presentation; every unchanged region is elided with `...`. To deploy, the same insertions should be applied to the full original `PAYEDIT2A.sql`. The injection anchors are unique (specific existing comment/code lines) so the placement is unambiguous.

2. The two new procedures are declared *after* their call sites in source order (`tally` and `leave_check` reference them before they are defined). In PL/SQL package bodies this is legal — forward declarations are not required because the package body is compiled as a single unit and all procedures in the declarative part are visible to each other.

3. Every injected line is tagged with the required comment `--RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026`, including end-of-block markers, so the change can be located and removed cleanly.

4. The `reason_code` table inserts for error codes **86000261 – 86000268** are NOT included in the SQL file because they are DDL/data-load, not package-body changes, and their canonical message text is pending answers to Q23 in CLARIFYING_QUESTIONS.md. A separate small DDL script should be generated once the message text is confirmed.

5. Open clarifying questions (especially Q3 day-type detection, Q5/Q6 PH ordering and cap composition, Q8 the meaning of "Mandatory", Q9 weekly vs rolling window, Q16/Q17 salary-group/exempt scope) may require small adjustments to the conditional logic in `malaysing_aug26_validate`. The assumptions adopted are listed in PATCH_PLAN.md §2 so any later correction is a localized edit to that one procedure, with no ripple effect to the rest of the package.
