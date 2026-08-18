I've reviewed the priority-change rows and the `pay_editA` package body. Below are the three artifacts. One note up front: I can't write to disk from here, so the "81/" files are reproduced in full as fenced blocks you can save directly. For `PAYEDIT2A_patched.SQL` I've used an **anchored-injection format** — every new block is shown verbatim together with the exact surrounding lines from your original file, so it applies cleanly without me reproducing all ~2,500 unchanged lines (which would obscure the actual change set).

---

## 81/CLARIFYING_QUESTIONS.md

````markdown
# CLARIFYING_QUESTIONS.md
INC1276683 — MalaySing Validation Rules Aug 2026
Malaysia (A60) eTES/LCD Overtime · Singapore (A00, A80) eTES/LCD Standby Allowance
Prepared 8/10/2026 — R. de Wolff

Each question lists the **working assumption** coded into `PAYEDIT2A_patched.SQL`. If an
answer differs from the assumption, the fix is localized to the `msg_checks` procedure.

---

## A. Malaysia (Org A60) — Overtime 3010 / 3011 / 3020–3060

**Q1. Is 3010 mutually exclusive with 3011 on the same calendar day?**
The slide groups 3010 and 3011 under one header but describes a "Regular Day" (3010) and an
"Off Day" (3011). The RDW note says any day with 3011 "counts as an Off day," which implies a
day cannot be both.
*Assumption: mutually exclusive. Both present on one day raises 86000263.*

**Q2. On an Off Day (3011), is regular time 1010 forbidden, or merely not required?**
The wording is "No regular time needed for Off day," which is permissive, not prohibitive.
*Assumption: 1010 is permitted but not required, and is NOT counted toward the 12-hour off-day
cap (cap applies to 3011 only). If 1010 must be blocked outright, we need a new error code.*

**Q3. Is the workday cap 12 hours of (1010 + 3010) combined, or 12 hours of 3010 alone?**
"12 hours cap (Including OT) for a Regular Day" reads as combined.
*Assumption: combined — 1010 + 3010 > 12.00 raises 86000261.*

**Q4. Does the existing check 86000260 (INC1247720, 3010 alone > 12.00 hrs) stay in force?**
The new combined cap makes it mathematically unreachable whenever 1010 > 0.
*Assumption: leave 86000260 in place untouched; it is redundant but harmless. Confirm whether
you want it disabled to avoid two messages on a 3010-only day of 12.5 hours.*

**Q5. Must 1010 be present on the *same day* as 3010, or merely somewhere in the week?**
*Assumption: same day. Absent 1010 on a day with 3010 raises 86000262.*

**Q6. Is there a minimum 1010 threshold before 3010 may be claimed (e.g., a full normal
working day of 8.00 hrs)?** Malaysian practice normally requires the normal working day to be
completed before OT accrues, but the slide only says "must enter regular time code 1010."
*Assumption: any 1010 > 0 satisfies the rule. No threshold enforced.*

**Q7. Rest-day sequencing — must 3020 be filled to its natural ceiling (half of normal working
hours) before 3030, and 3030 to normal working hours before 3040?**
The code descriptions imply banding (`<=Hlf-NWH`, `>Hlf-NWH<=NWH`, `>NWH`) but the validation
column only says 3020 is Mandatory.
*Assumption: presence-only. 3030 or 3040 without any 3020 raises 86000266; no band-fill check.*

**Q8. Is the 12-hour rest-day cap the sum of 3020+3030+3040, or 12 hours per code?**
*Assumption: the sum.*

**Q9. Public holiday — must 8000 be a full holiday day, or is any 8000 > 0 sufficient to
"enter a PH first"?**
*Assumption: any 8000 > 0 on the same day is sufficient (86000268 otherwise).*

**Q10. Must 3050 reach normal working hours before 3060 is allowed, or is any 3050 > 0
sufficient?** "only then can utilize 3060 for extra hours" suggests a threshold, and the code
label `3050- OT-PH <= NWH` / `3060- OT-PH > NWH` reinforces it.
*Assumption: presence-only — 3060 without 3050 raises 86000269. **This is the single most
likely assumption to be wrong** and should be confirmed before UAT.*

**Q11. Confirm the literal `att_abs_type` values.** The design keys on the four-character
strings `1010`, `8000`, `3010`, `3011`, `3020`, `3030`, `3040`, `3050`, `3060` in
`lcd.att_abs_type` for org A60. Are these the LCD codes, or are they GHR codes that map to
different LCD `att_abs_type` values via `lcd.toe_attabs_map`?

**Q12. Do these rules apply to all A60 workers, or only `salary_group = 'C'`?**
INC1247720 scoped the 12-hour cap to salary group C; these slides make no such distinction.
*Assumption: all A60 workers regardless of salary group.*

**Q13. Does the 12-hour cap interact with `86000037` (max daily hours from
`support_systems.MAXHOURS`)?** If A60 has a MAXHOURS row lower than 12, a worker could see two
errors.
*Assumption: independent checks, both fire.*

---

## B. Singapore (Orgs A00, A80) — Standby Allowance 3100 / 3110 / 3120

**Q14. Is 3100 exclusivity week-level or day-level?**
The 3100 and 3110 rows say the employee cannot use the other standby types **for the week**.
The 3120 row says it cannot be combined **on a weekend day** with 3100. These conflict.
*Assumption: week-level (the stricter reading) — 3100 anywhere in the week plus 3110 or 3120
anywhere in that week raises 86000272.*

**Q15. What is "the week" for 3100?**
"Start date of Weekly SB could be any day of the week" implies a rolling 7-day entitlement that
can straddle two LCD timesheet weeks (LCD weeks run to `p_end_date`, normally Saturday–Friday).
`pay_editA` only ever sees one timesheet week at a time.
*Assumption: "week" = the LCD timesheet week being validated. Rolling/straddling 7-day windows
are **out of scope for LCD** and must be enforced in eTES, which has multi-week visibility.
Please confirm eTES will own that rule, otherwise we need a remote lookup similar to
`ITES.f_GET_FutureAbsenceHours@lcd_ites`.*

**Q16. What does "SA" mean in "eTES to restrict overlap of more than 1 unit per day (SA & SB)"?**
SB is clearly Standby. SA is presumably Shift Allowance (or Standby Allowance vs. Standby).
We need the full list of SA `att_abs_type` codes to include them in the one-unit-per-day total.
*Assumption: the per-day cap covers only 3100/3110/3120 (86000275). SA codes are not included
because they are unidentified.*

**Q17. Are 3100/3110/3120 configured in `lcd.att_abs_type` with `unit_flag = 'U'`?**
This is a hard prerequisite. `tally` skips `unit_flag = 'U'` records entirely, which is why the
patch adds an independent accumulator that runs *before* that filter. If these codes are set up
as `'H'` (hours), they will also pollute `total_day`, `total_hours` and the 24-hour check 37.

**Q18. Can a fractional or multiple unit ever be legitimate (e.g., 0.5 or 2)?**
*Assumption: no — any non-zero value other than exactly 1.00 raises 86000270.*

**Q19. Weekday/weekend determination — should Monday–Friday be derived from the calendar date,
or from `ITES.IT_CALENDAR.DAYOFWEEK`, or from `org_param.WEEKLY_START_DAY`?**
Day index 1..7 in this package is relative to the org's week start, not to Saturday.
*Assumption: derived from the actual calendar date `pg_end_date - 7 + cnt` using
`TO_CHAR(dt,'DY','NLS_DATE_LANGUAGE=AMERICAN')`. This is correct for any WEEKLY_START_DAY.
Confirm A00/A80 week start day so the mapping can be regression-tested.*

**Q20. Do Singapore public holidays falling Mon–Fri still count as "weekday" for 3110?**
*Assumption: yes — calendar day of week only; holiday status is ignored.*

**Q21. Do these standby rules apply to both A00 and A80 identically?**
*Assumption: yes, identical treatment.*

---

## C. Cross-cutting

**Q22. Should the new errors be suppressed during mid-week entry?**
Existing logic suppresses 86000062/86000067 when `cutoffidx`/`todayidx` indicate a mid-week
cutoff, and INC-1021 suppresses quota errors mid-week. Two of the new rules are
"completeness" rules (86000262 "1010 required with 3010", 86000266 "3020 required with
3030/3040", 86000268 "8000 required before 3050") and could fire on a partially-entered day.
*Assumption: no mid-week suppression — all new rules fire on every validate call. Flag if eTES
autosave will generate nuisance errors.*

**Q23. Confirm the new error number range 86000261–86000275 is free** in `lcd.reason_code`
across all language codes. Highest currently referenced in this package is 86000260.
Who supplies the localized message text (EN/MS/ZH), and is a translation row required for every
language code as with 86000230–86000248?

**Q24. Should these rules also fire from `leave_check`, or only from `validate`?**
*Assumption: `validate` only. `leave_check` is optional and balance-oriented; OT and standby
are not quota-backed. Note that INC1247720's 86000260 sits in `leave_check`, so a caller that
skips `leave_check` gets the new checks but not 260.*

**Q25. Is a hard error correct for all fifteen conditions, or should any be a warning?**
This package has no warning severity — everything routed through `record_error` blocks
submission. Confirm business accepts hard-stop behaviour for all fifteen.

**Q26. Effective date.** Should the rules be gated on `pg_end_date >= <go-live>` so that
retroactive corrections to pre-August weeks still validate under the old rules?
*Assumption: no date gate — rules apply to any week validated after deployment. A one-line
date guard is trivial to add to `msg_in_scope` if required.*
````

---

## 81/PATCH_PLAN.md

````markdown
# PATCH_PLAN.md
INC1276683 — MalaySing Validation Rules Aug 2026
Target object: `lcd.pay_editA` (package **body** only — no spec change required)
Source file: `PAYEDIT2A.SQL` → `PAYEDIT2A_patched.SQL`
Marker comment on every injected line/block: `--RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026`

---

## 1. Design principles

The package body is a single 2,500-line procedural artifact with thirty years of accreted
country rules, and almost every existing edit is expressed inline inside `validate` or
`leave_check`. Adding fifteen more inline `IF` blocks in that style would be the fastest route
but the hardest to reverse. Instead this patch isolates the entire change into a **submodule**
with exactly three one-line hooks into existing procedures.

The five rules that make the patch safe and reversible:

1. **Org gate first.** Every new routine returns immediately unless `pg_org_code` is in
   `('A00','A60','A80')`. No other organization executes a single new comparison.
2. **No mutation of existing state.** The submodule declares its own accumulators
   (`msg_day_*`) and never writes to `total_day*`, `total_week*`, `worker_info`, `balance_rec`
   or `att_array`. It therefore cannot perturb checks 12, 17, 37, 61, 62, 67, 85, 86, 90, 93,
   99, 102, 103, 193 or any leave-balance check.
3. **Independent accumulation.** The Singapore codes are unit-based. `tally` discards
   `unit_flag = 'U'` records before any accumulation happens, so the submodule's tally hook is
   placed *above* that filter and reads the record directly. Malaysia's hour codes are
   re-accumulated locally rather than borrowing INC1247720's `total_day_my3010`, so that
   backing out either INC leaves the other intact.
4. **Additive error numbers.** New codes 86000261–86000275. No existing error number is
   re-purposed, re-worded, suppressed or made unreachable.
5. **Three-line back-out.** Deleting the two marked blocks and the three marked hook lines
   restores the file to byte-equivalent original behaviour. The package still compiles because
   nothing outside the blocks references anything inside them.

### Rejected alternatives

| Option | Why rejected |
|---|---|
| Inline `IF` blocks in `validate`'s day loop, matching existing style | Consistent with the file, but back-out requires surgical edits at fifteen scattered points inside the most heavily-modified loop in the package. |
| Enforce the caps and unit counts entirely through `lcd.time_limits` (daily/weekly limit rows, errors 86000094/86000095) | Zero code change and genuinely attractive for the "1 unit" and "12 hour" caps. Cannot express cross-code exclusivity, prerequisite ordering, or day-of-week restrictions — roughly two thirds of the requirement. **Recommended as a complement**: configure `time_limits` daily limits as a second line of defence, and let the code own the relational rules. |
| A separate package `lcd.pay_edit_msg` called from `pay_editA` | Cleanest separation, but introduces a new deployable object, new grants, and a cross-package dependency during a priority release. Deferred. |
| New columns on `lcd.att_abs_type` to drive exclusivity generically | Correct long-term direction; far too large for an August priority change. |

---

## 2. Injection map

Seven physical edits: two blocks and three hooks in the body, plus two reference-data items.

| # | Location (anchor in original file) | Type | Contents |
|---|---|---|---|
| I-1 | Package globals, immediately after `overrideIDcurr NUMBER;` and before the `Locally Defined Procedures and Functions` banner | New block | Constants, twelve day-accumulator arrays, four forward declarations |
| I-2 | Immediately after `END record_error;` and before the `PROCEDURE: Charge_Authorized` banner | New block | Bodies of `msg_in_scope`, `msg_clear`, `msg_tally`, `msg_checks` |
| I-3 | `PROCEDURE tally`, immediately after `activity_type := f_activity_type (p_time_rec.att_abs_type);` and **before** `IF activity_type.unit != 'U'` | Hook (1 line) | `msg_tally (p_time_rec);` |
| I-4 | `PROCEDURE clear_tables`, immediately before `att_array.DELETE;` | Hook (1 line) | `msg_clear;` |
| I-5 | `PROCEDURE validate` (the 11-parameter overload), immediately after the `END LOOP;` that closes the day-edit loop and before `ELSE --no worker information found` | Hook (1 line) | `msg_checks (p_error_count, p_error_line, p_error_number);` |
| I-6 | `lcd.reason_code` | Reference data | Fifteen new rows per language code (see §6) |
| I-7 | `lcd.att_abs_type` for A60/A00/A80 | Prerequisite | Rows for 3011, 3020–3060, 3100, 3110, 3120 with correct `activity_group`, `unit_flag`, `start_date`, `end_date` |

**Placement rationale.** I-1 must precede `tally` because PL/SQL resolves identifiers in
declaration order; forward declarations there let the hooks compile even though the bodies sit
lower. I-2 must follow `record_error` because `msg_checks` calls it. I-3 must precede the
`unit_flag` filter or Singapore units are invisible. I-4 is unguarded by org on purpose:
`clear_tables` is called in `validate` **before** `pg_org_code := p_org_code`, so at that moment
`pg_org_code` still holds the *previous* call's org. Guarding the clear would leak A60 totals
into the next worker's validation.

---

## 3. Data dictionary — new package-level objects

All identifiers use the `msg_` prefix (MalaySinG) so they are greppable and collision-free.

### 3.1 Constants

| Name | Type | Value | Purpose |
|---|---|---|---|
| `msg_ot_day_cap` | `NUMBER` | `12.0` | Daily overtime cap for all four Malaysia day-type families |
| `msg_sb_unit` | `NUMBER` | `1.0` | The one and only legal standby unit quantity |
| `msg_tc_reg` | `VARCHAR2(4)` | `'1010'` | Malaysia regular time code |
| `msg_tc_ph` | `VARCHAR2(4)` | `'8000'` | Malaysia public holiday code |

### 3.2 Day accumulators — all `lcd.pay_edit.hourstype`, indexed 1..7

Index 1 is the first day of the organization's week (day *n* = `pg_end_date - 7 + n`),
consistent with `time_array(t_cnt).DAY := s_cnt + 1` in `validate`.

| Name | Fed by `att_abs_type` | Unit | Consumed by |
|---|---|---|---|
| `msg_day_1010` | `1010` | hours | 86000261, 86000262 |
| `msg_day_8000` | `8000` | hours | 86000268 |
| `msg_day_3010` | `3010` | hours | 86000261, 86000262, 86000263 |
| `msg_day_3011` | `3011` | hours | 86000263, 86000264 |
| `msg_day_3020` | `3020` | hours | 86000263, 86000265, 86000266 |
| `msg_day_3030` | `3030` | hours | 86000263, 86000265, 86000266 |
| `msg_day_3040` | `3040` | hours | 86000263, 86000265, 86000266 |
| `msg_day_3050` | `3050` | hours | 86000263, 86000267, 86000268, 86000269 |
| `msg_day_3060` | `3060` | hours | 86000263, 86000267, 86000268, 86000269 |
| `msg_day_3100` | `3100` | **units** | 86000270–86000272, 86000275 |
| `msg_day_3110` | `3110` | **units** | 86000270, 86000272, 86000273, 86000275 |
| `msg_day_3120` | `3120` | **units** | 86000270, 86000272, 86000274, 86000275 |

No new weekly scalars are declared. Week-level facts (how many days carry a 3100, whether any
3110/3120 exists) are derived inside `msg_checks` by scanning the day arrays, which keeps the
global footprint minimal and removes any risk of a missed reset.

### 3.3 Procedures and functions

| Name | Signature | Org-gated | Description |
|---|---|---|---|
| `msg_in_scope` | `RETURN BOOLEAN` | n/a | `TRUE` when `pg_org_code IN ('A00','A60','A80')`. Single point of scope control; an effective-date gate would be added here. |
| `msg_clear` | `PROCEDURE` | **No** — deliberate | Zeroes all twelve arrays for indices 1..7. Called from `clear_tables`, which runs before `pg_org_code` is assigned. |
| `msg_tally` | `(p_time_rec IN lcd.pay_edit.timetype)` | Yes | `CASE` on `att_abs_type`; adds `p_time_rec.hours` to the matching array. Records for any other code fall to `ELSE NULL`. For unit codes the parsed value is already the unit count (the `/100` in `validate` turns `0100` into `1.00`). |
| `msg_checks` | `(p_error_count IN OUT INTEGER, p_error_line IN OUT lcd.pay_edit.errorlinetype, p_error_number IN OUT lcd.pay_edit.ERRORNUMTYPE)` | Yes | All fifteen rules. Malaysia section runs only for A60; Singapore section only for A00/A80. Reports through the existing `record_error`. |

---

## 4. Rule-to-code mapping

### 4.1 Malaysia (A60) — evaluated per day *d* in 1..7

Family totals: `WKDAY = 3010`, `OFFDAY = 3011`, `RESTDAY = 3020+3030+3040`, `PUBHOL = 3050+3060`.

| Error | Condition | Slide source |
|---|---|---|
| 86000261 | `msg_day_1010(d) + msg_day_3010(d) > 12.0` | "12 hours cap (Including OT) for a Regular Day" |
| 86000262 | `msg_day_3010(d) > 0 AND msg_day_1010(d) = 0` | "On working regular day then EE must enter regular time code 1010" |
| 86000263 | More than one of `WKDAY`,`OFFDAY`,`RESTDAY`,`PUBHOL` is non-zero on day *d* | The three "Cannot enter any time for …" clauses, collapsed into one symmetric check |
| 86000264 | `msg_day_3011(d) > 12.0` | "12 Hrs cap (Only OT) for Off Day" |
| 86000265 | `RESTDAY > 12.0` | "12 hours cap, (OT Only)" on the 3020/3030/3040 rows |
| 86000266 | `msg_day_3030(d) + msg_day_3040(d) > 0 AND msg_day_3020(d) = 0` | "Time code 3020 (Mandatory) along with 3030 and 3040" |
| 86000267 | `PUBHOL > 12.0` | "check daily cap of 12 hrs (excluding PH Hrs)" — 8000 is excluded from the sum |
| 86000268 | `PUBHOL > 0 AND msg_day_8000(d) = 0` | "Enter a PH (8000) first" |
| 86000269 | `msg_day_3060(d) > 0 AND msg_day_3050(d) = 0` | "then employee can enter 3050 and only then can utilize 3060" |

**Why one exclusivity code instead of three.** The slide states the mutual exclusion three
times, once per family, describing a single symmetric fact. Emitting a family-specific error
from each direction would produce two or three messages for one mistake. 86000263 fires once,
on the offending day, with text naming all four families.

### 4.2 Singapore (A00, A80)

Per day *d*, with `SBDAY = 3100+3110+3120` and `DOW(d) = TO_CHAR(pg_end_date - 7 + d,'DY')`:

| Error | Condition | Slide source |
|---|---|---|
| 86000270 | any of `msg_day_3100/3110/3120(d)` is `> 0` and `<> 1.0` | "The number must be 1 UNIT" |
| 86000273 | `msg_day_3110(d) > 0 AND DOW(d) IN ('SAT','SUN')` | "one time every weekday (Between Monday to Friday)" |
| 86000274 | `msg_day_3120(d) > 0 AND DOW(d) NOT IN ('SAT','SUN')` | "one time on weekend days (Only Saturday & Sunday)" |
| 86000275 | `SBDAY > 1.0` | "eTES to restrict overlap of more than 1 unit per day" — see assumption Q16 |

Week-level, reported against day 0 in line with existing weekly errors (17, 22, 90, 94):

| Error | Condition | Slide source |
|---|---|---|
| 86000271 | count of days with `msg_day_3100(d) > 0` is `> 1` | "cannot use 3100 more than once for the same week" |
| 86000272 | any `3100` in the week **and** any `3110` or `3120` in the week | "cannot use any other Standby for week (3110 & 3120)" |

Day-of-week is taken from the real calendar date, not the 1..7 index, so the rules hold
regardless of `org_param.WEEKLY_START_DAY`.

---

## 5. Assumptions applied (resolving CLARIFYING_QUESTIONS.md)

| Ref | Assumption coded |
|---|---|
| Q1 | 3010 and 3011 cannot coexist on a day → 86000263 |
| Q2 | 1010 permitted but not required on an off day; excluded from the 3011 cap |
| Q3 | Workday cap is 1010 + 3010 combined |
| Q4 | Existing 86000260 left in place, unmodified |
| Q5 | 1010 must be on the same day as 3010 |
| Q6 | No minimum 1010 threshold |
| Q7 | 3020 presence only; no band-fill sequencing between 3020→3030→3040 |
| Q8 | Rest-day cap is the sum of the three codes |
| Q9 | Any 8000 > 0 satisfies "enter a PH first" |
| Q10 | Any 3050 > 0 satisfies the 3060 prerequisite |
| Q12 | All A60 workers, no `salary_group` filter |
| Q14 | 3100 exclusivity is week-level |
| Q15 | "Week" = the LCD timesheet week; rolling 7-day windows owned by eTES |
| Q16 | Per-day unit cap covers 3100/3110/3120 only; SA codes not yet identified |
| Q18 | Exactly 1.00 unit; fractions and multiples rejected |
| Q19 | Day of week from the calendar date |
| Q22 | No mid-week suppression |
| Q24 | Hooked into `validate` only, not `leave_check` |
| Q26 | No effective-date gate |

---

## 6. Reference data — `lcd.reason_code`

Fifteen rows required, replicated per language code exactly as was done for 86000230–86000248.
Text below is the English baseline; template only, since the column list for `reason_code`
varies by environment.

| Code | Proposed English text |
|---|---|
| 86000261 | Malaysia: total regular and overtime hours for the day exceed the 12.00 hour limit |
| 86000262 | Malaysia: regular time (1010) must be recorded on a working day when overtime 3010 is used |
| 86000263 | Malaysia: overtime codes for working day, off day, rest day and public holiday cannot be combined on the same day |
| 86000264 | Malaysia: off day overtime (3011) exceeds the 12.00 hour daily limit |
| 86000265 | Malaysia: rest day overtime (3020 + 3030 + 3040) exceeds the 12.00 hour daily limit |
| 86000266 | Malaysia: time code 3020 is mandatory when 3030 or 3040 is recorded |
| 86000267 | Malaysia: public holiday overtime (3050 + 3060) exceeds the 12.00 hour daily limit |
| 86000268 | Malaysia: public holiday (8000) must be recorded before public holiday overtime |
| 86000269 | Malaysia: time code 3050 must be recorded before 3060 |
| 86000270 | Singapore: standby allowance must be recorded as exactly 1 unit |
| 86000271 | Singapore: weekly standby (3100) may be recorded only once per week |
| 86000272 | Singapore: weekly standby (3100) cannot be combined with daily standby (3110 or 3120) in the same week |
| 86000273 | Singapore: weekday standby (3110) may only be recorded Monday through Friday |
| 86000274 | Singapore: weekend standby (3120) may only be recorded Saturday or Sunday |
| 86000275 | Singapore: only one standby unit may be recorded per day |

---

## 7. Back-out procedure

1. Delete the block bounded by `-- BEGIN INC1276683 DECLARATIONS` / `-- END INC1276683 DECLARATIONS`.
2. Delete the block bounded by `-- BEGIN INC1276683 MODULE BODY` / `-- END INC1276683 MODULE BODY`.
3. Delete the three lines tagged `INC1276683` in `tally`, `clear_tables` and `validate`
   (`grep -n INC1276683` returns exactly five hits after step 1 and 2 are located).
4. Recompile. No other statement in the package references any `msg_` identifier.
5. Optionally delete the fifteen `reason_code` rows; leaving them is harmless.

Partial back-out is also supported: deleting only the `IF pg_org_code = msg_org_my THEN … END IF;`
section inside `msg_checks` disables Malaysia while leaving Singapore live, and vice versa.

---

## 8. Test matrix

| # | Org | Scenario | Expected |
|---|---|---|---|
| T01 | A60 | 1010 = 8.0, 3010 = 4.0 | Clean |
| T02 | A60 | 1010 = 8.0, 3010 = 5.0 | 86000261 |
| T03 | A60 | 3010 = 3.0, no 1010 | 86000262 |
| T04 | A60 | 3010 = 2.0 and 3020 = 2.0 same day | 86000263 |
| T05 | A60 | 3011 = 12.0 alone | Clean |
| T06 | A60 | 3011 = 12.5 | 86000264 |
| T07 | A60 | 3020 = 4.0, 3030 = 4.0, 3040 = 5.0 | 86000265 |
| T08 | A60 | 3030 = 4.0 with no 3020 | 86000266 |
| T09 | A60 | 8000 = 8.0, 3050 = 8.0, 3060 = 5.0 | 86000267 |
| T10 | A60 | 3050 = 4.0 with no 8000 | 86000268 |
| T11 | A60 | 8000 = 8.0, 3060 = 3.0, no 3050 | 86000269 |
| T12 | A60 | 8000 = 8.0, 3050 = 8.0, 3060 = 4.0 | Clean (PH hours excluded from cap) |
| T13 | A00 | 3110 = 1 unit Mon–Fri | Clean |
| T14 | A00 | 3110 = 2 units Monday | 86000270 + 86000275 |
| T15 | A00 | 3110 = 1 unit Saturday | 86000273 |
| T16 | A80 | 3120 = 1 unit Saturday and Sunday | Clean |
| T17 | A80 | 3120 = 1 unit Wednesday | 86000274 |
| T18 | A00 | 3100 = 1 unit Tuesday | Clean |
| T19 | A00 | 3100 = 1 unit Tuesday and Thursday | 86000271 |
| T20 | A00 | 3100 = 1 unit Monday, 3110 = 1 unit Wednesday | 86000272 |
| T21 | A00 | 3100 = 1 and 3110 = 1 on the same day | 86000272 + 86000275 |
| T22 | A76 | Japan regression — any Japan week | Byte-identical error set to pre-patch |
| T23 | 111 | US regression — CA 7th-day, DT, FML, quota | Byte-identical error set to pre-patch |
| T24 | A60 | Existing INC1247720 3010 > 12.0 path via `leave_check` | 86000260 still raised |
| T25 | A60 | Two consecutive `validate` calls, A60 then 111 | No A60 accumulator leakage into the 111 result |
| T26 | A00 | `WEEKLY_START_DAY` other than SATURDAY | Weekday/weekend mapping still correct |
````

---

## 81/PAYEDIT2A_patched.SQL

```sql
--  ============================================================================
--  PAYEDIT2A_patched.SQL   (lcd.pay_editA package body)
--  INC1276683 — MalaySing Validation Rules Aug 2026
--  ============================================================================
--  This file is PAYEDIT2A.SQL with five injections applied. Each injection is
--  reproduced below together with the unchanged anchor lines from the original
--  so it can be applied by hand or by patch tool. Everything not shown here is
--  unchanged from the original source.
--
--    I-1  package globals          — new declaration block
--    I-2  after END record_error;  — new module body block
--    I-3  PROCEDURE tally          — one-line hook
--    I-4  PROCEDURE clear_tables   — one-line hook
--    I-5  PROCEDURE validate       — one-line hook
--  ============================================================================


-- ############################################################################
-- ## INJECTION I-0 : REVISION HISTORY
-- ## Anchor: last line of the REVISION HISTORY header comment
-- ############################################################################

--   07-29-2026 R. Wright: INC 1405279: India Increments Selective Restore VAC-PB-LV-UPD
--   08-10-2026 R. Wright: INC 1276683: MalaySing Validation Rules Aug 2026 (Malaysia A60 overtime 3010-3060, Singapore A00/A80 standby 3100-3120, errors 86000261-86000275)


-- ############################################################################
-- ## INJECTION I-1 : PACKAGE GLOBAL DECLARATIONS
-- ## Anchor: immediately after "overrideIDcurr NUMBER;" and immediately before
-- ##         the "Locally Defined Procedures and Functions" banner
-- ############################################################################

   is_override			Boolean := False;
   week_start_saturday		DATE;
   week_end_friday		DATE;
   overrideIDcurr 		NUMBER;

--RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026
-- ===========================================================================
-- BEGIN INC1276683 DECLARATIONS
-- MalaySing validation submodule — Malaysia (A60) overtime and Singapore
-- (A00/A80) standby allowance. Self-contained: this block declares its own
-- accumulators and never reads or writes any pre-existing package variable
-- other than pg_org_code and pg_end_date.
--
-- BACK-OUT: delete this block, delete the "MODULE BODY" block that follows
-- record_error, and delete the three hook lines tagged INC1276683 in tally,
-- clear_tables and validate. Nothing else in the package references msg_*.
-- ===========================================================================
   msg_org_my            CONSTANT VARCHAR2(3) := 'A60';   -- Malaysia
   msg_ot_day_cap        CONSTANT NUMBER      := 12.0;    -- daily OT cap, all MY families
   msg_sb_unit           CONSTANT NUMBER      := 1.0;     -- the only legal standby quantity
   msg_tc_reg            CONSTANT VARCHAR2(4) := '1010';  -- MY regular time
   msg_tc_ph             CONSTANT VARCHAR2(4) := '8000';  -- MY public holiday

   -- Malaysia daily accumulators (hours), index 1..7, day n = pg_end_date - 7 + n
   msg_day_1010          lcd.pay_edit.hourstype;
   msg_day_8000          lcd.pay_edit.hourstype;
   msg_day_3010          lcd.pay_edit.hourstype;   -- OT workday      1.5x
   msg_day_3011          lcd.pay_edit.hourstype;   -- OT off day      1.5x
   msg_day_3020          lcd.pay_edit.hourstype;   -- OT rest day  <= 1/2 NWH
   msg_day_3030          lcd.pay_edit.hourstype;   -- OT rest day  >  1/2 NWH <= NWH
   msg_day_3040          lcd.pay_edit.hourstype;   -- OT rest day  >  NWH  2x
   msg_day_3050          lcd.pay_edit.hourstype;   -- OT pub hol   <= NWH  2x
   msg_day_3060          lcd.pay_edit.hourstype;   -- OT pub hol   >  NWH  3x

   -- Singapore daily accumulators (UNITS, not hours), index 1..7
   -- NOTE: these codes carry unit_flag = 'U' and are discarded by tally's
   -- "IF activity_type.unit != 'U'" filter, which is why msg_tally is hooked
   -- in above that filter.
   msg_day_3100          lcd.pay_edit.hourstype;   -- SB weekly  SGD270.00
   msg_day_3110          lcd.pay_edit.hourstype;   -- SB weekday SGD 33.75
   msg_day_3120          lcd.pay_edit.hourstype;   -- SB weekend SGD 50.65

   -- Forward declarations. Bodies are defined after record_error because
   -- msg_checks calls it; these specs let the tally and clear_tables hooks
   -- resolve at their (earlier) position in the body.
   FUNCTION  msg_in_scope RETURN BOOLEAN;
   PROCEDURE msg_clear;
   PROCEDURE msg_tally (p_time_rec IN lcd.pay_edit.timetype);
   PROCEDURE msg_checks (
      p_error_count    IN OUT   INTEGER,
      p_error_line     IN OUT   lcd.pay_edit.errorlinetype,
      p_error_number   IN OUT   lcd.pay_edit.ERRORNUMTYPE);
-- END INC1276683 DECLARATIONS
-- ===========================================================================

--****************************************************************************
-- Locally Defined Procedures and Functions
--****************************************************************************


-- ############################################################################
-- ## INJECTION I-3 : TALLY HOOK
-- ## Anchor: PROCEDURE tally, after the f_activity_type assignment and its
-- ##         dbms_output lines, BEFORE "IF activity_type.unit != 'U'"
-- ## Placement is mandatory: Singapore standby codes are units and would
-- ## otherwise be discarded.
-- ############################################################################

      activity_type := f_activity_type (p_time_rec.att_abs_type);

    dbms_output.put_line('Activity_type.grp=[' || activity_type.grp || ']');
    dbms_output.put_line('Activity_type.dbl=[' || activity_type.dbl || ']');

    dbms_output.put_line('Activity_type.fml=[' || activity_type.fml || ']');

      msg_tally (p_time_rec);   --RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026

      IF activity_type.unit != 'U'
      THEN -- don't record units, only hours


-- ############################################################################
-- ## INJECTION I-4 : CLEAR_TABLES HOOK
-- ## Anchor: PROCEDURE clear_tables, immediately before "att_array.DELETE;"
-- ## Deliberately NOT org-gated: clear_tables runs in validate BEFORE
-- ## pg_org_code is assigned, so at this moment pg_org_code still holds the
-- ## previous call's organization.
-- ############################################################################

      END LOOP;

         --  RdW 11/23/2025 INC1138065 India Supplemental Pay
         total_week_stdby := 0;

      msg_clear;   --RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026

      att_array.DELETE;
   END clear_tables;


-- ############################################################################
-- ## INJECTION I-2 : MODULE BODY
-- ## Anchor: immediately after "END record_error;" and immediately before the
-- ##         "PROCEDURE: Charge_Authorized" banner comment
-- ############################################################################

   END record_error;

--RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026
-- ===========================================================================
-- BEGIN INC1276683 MODULE BODY
-- ===========================================================================

/*************************************************************************************
* FUNCTION: msg_in_scope
*
* PURPOSE:
*   Single point of scope control for the MalaySing submodule. Returns TRUE only
*   for Malaysia (A60) and Singapore (A00, A80). Every other organization exits
*   the submodule here without evaluating a single rule.
*
*   An effective-date gate, if ever required, belongs here and nowhere else:
*     AND pg_end_date >= TO_DATE('20260801','YYYYMMDD')
*
*   RdW 8/10/2026 INC1276683
*************************************************************************************/
   FUNCTION msg_in_scope
      RETURN BOOLEAN
   IS
   BEGIN
      RETURN (pg_org_code IN ('A00', 'A60', 'A80'));
   END msg_in_scope;


/*************************************************************************************
* PROCEDURE: msg_clear
*
* PURPOSE:
*   Resets all MalaySing day accumulators. Called from clear_tables.
*   NOT org-gated on purpose - see the comment at the clear_tables hook.
*
*   RdW 8/10/2026 INC1276683
*************************************************************************************/
   PROCEDURE msg_clear
   IS
   BEGIN
      FOR cnt IN 1 .. 7
      LOOP
         msg_day_1010 (cnt) := 0;
         msg_day_8000 (cnt) := 0;
         msg_day_3010 (cnt) := 0;
         msg_day_3011 (cnt) := 0;
         msg_day_3020 (cnt) := 0;
         msg_day_3030 (cnt) := 0;
         msg_day_3040 (cnt) := 0;
         msg_day_3050 (cnt) := 0;
         msg_day_3060 (cnt) := 0;
         msg_day_3100 (cnt) := 0;
         msg_day_3110 (cnt) := 0;
         msg_day_3120 (cnt) := 0;
      END LOOP;
   END msg_clear;


/*************************************************************************************
* PROCEDURE: msg_tally
*
* PURPOSE:
*   Accumulates the twelve MalaySing time codes into the submodule's own day
*   arrays. Runs before tally's unit_flag filter so that unit-based Singapore
*   standby codes are captured. Hour codes are accumulated here independently of
*   total_day_my3010 (INC1247720) so that either change can be backed out alone.
*
*   For unit codes the value arriving in p_time_rec.hours is already the unit
*   count: validate parses the 4-character field and divides by 100, so a stored
*   "0100" reaches us as 1.00.
*
*   RdW 8/10/2026 INC1276683
*************************************************************************************/
   PROCEDURE msg_tally (p_time_rec IN lcd.pay_edit.timetype)
   IS
      d   PLS_INTEGER := p_time_rec.DAY;
      h   NUMBER      := NVL (p_time_rec.hours, 0);
   BEGIN
      IF NOT msg_in_scope
      THEN
         RETURN;
      END IF;

      IF d IS NULL OR d < 1 OR d > 7 OR h = 0
      THEN
         RETURN;
      END IF;

      CASE p_time_rec.att_abs_type
         WHEN msg_tc_reg THEN msg_day_1010 (d) := msg_day_1010 (d) + h;
         WHEN msg_tc_ph  THEN msg_day_8000 (d) := msg_day_8000 (d) + h;
         WHEN '3010'     THEN msg_day_3010 (d) := msg_day_3010 (d) + h;
         WHEN '3011'     THEN msg_day_3011 (d) := msg_day_3011 (d) + h;
         WHEN '3020'     THEN msg_day_3020 (d) := msg_day_3020 (d) + h;
         WHEN '3030'     THEN msg_day_3030 (d) := msg_day_3030 (d) + h;
         WHEN '3040'     THEN msg_day_3040 (d) := msg_day_3040 (d) + h;
         WHEN '3050'     THEN msg_day_3050 (d) := msg_day_3050 (d) + h;
         WHEN '3060'     THEN msg_day_3060 (d) := msg_day_3060 (d) + h;
         WHEN '3100'     THEN msg_day_3100 (d) := msg_day_3100 (d) + h;
         WHEN '3110'     THEN msg_day_3110 (d) := msg_day_3110 (d) + h;
         WHEN '3120'     THEN msg_day_3120 (d) := msg_day_3120 (d) + h;
         ELSE NULL;
      END CASE;
   END msg_tally;


/*************************************************************************************
* PROCEDURE: msg_checks
*
* PURPOSE:
*   All fifteen INC1276683 rules. Called once from validate after the day-edit
*   loop. Reports through the existing record_error so no downstream consumer of
*   the error arrays needs to change.
*
*   Malaysia (A60), evaluated per day, errors 86000261 - 86000269
*   Singapore (A00/A80), per day and per week, errors 86000270 - 86000275
*
*   Day n corresponds to calendar date pg_end_date - 7 + n, matching the
*   convention used by the Time Type start/end date validation in validate.
*   Singapore weekday/weekend is derived from that real date rather than from
*   the 1..7 index, so the rules are correct for any org_param.WEEKLY_START_DAY.
*
*   RdW 8/10/2026 INC1276683
*************************************************************************************/
   PROCEDURE msg_checks (
      p_error_count    IN OUT   INTEGER,
      p_error_line     IN OUT   lcd.pay_edit.errorlinetype,
      p_error_number   IN OUT   lcd.pay_edit.ERRORNUMTYPE)
   IS
      l_wkday       NUMBER;        -- Malaysia working day family  (3010)
      l_offday      NUMBER;        -- Malaysia off day family      (3011)
      l_restday     NUMBER;        -- Malaysia rest day family     (3020+3030+3040)
      l_pubhol      NUMBER;        -- Malaysia public holiday fam. (3050+3060)
      l_families    PLS_INTEGER;   -- how many families are in play on this day

      l_dt          DATE;
      l_dow         VARCHAR2 (3);
      l_weekend     BOOLEAN;
      l_sb_day      NUMBER;        -- total standby units for the day
      l_3100_days   PLS_INTEGER := 0;
      l_other_sb    NUMBER      := 0;
   BEGIN
      IF NOT msg_in_scope
      THEN
         RETURN;
      END IF;

      dbms_output.put_line ('msg_checks: begin org=' || pg_org_code);

      -- =====================================================================
      -- MALAYSIA (A60) - overtime day-type rules
      -- =====================================================================
      IF pg_org_code = msg_org_my
      THEN
         FOR cnt IN 1 .. 7
         LOOP
            l_wkday   := msg_day_3010 (cnt);
            l_offday  := msg_day_3011 (cnt);
            l_restday := msg_day_3020 (cnt) + msg_day_3030 (cnt) + msg_day_3040 (cnt);
            l_pubhol  := msg_day_3050 (cnt) + msg_day_3060 (cnt);

            ---------------------------------------------------------------
            -- Check 263. Day-type families are mutually exclusive.
            -- Covers all three "Cannot enter any time for ..." clauses with
            -- one symmetric test so a single mistake yields a single error.
            ---------------------------------------------------------------
            l_families := 0;

            IF l_wkday   > 0 THEN l_families := l_families + 1; END IF;
            IF l_offday  > 0 THEN l_families := l_families + 1; END IF;
            IF l_restday > 0 THEN l_families := l_families + 1; END IF;
            IF l_pubhol  > 0 THEN l_families := l_families + 1; END IF;

            IF l_families > 1
            THEN
               record_error (
                  p_error_count,
                  p_error_line,
                  p_error_number,
                  cnt,
                  86000263
               ); --"Working day, off day, rest day and public holiday OT cannot be combined on the same day"
            END IF;

            ---------------------------------------------------------------
            -- Working day (3010)
            ---------------------------------------------------------------
            IF l_wkday > 0
            THEN
               -- Check 261. 12.00 hour cap INCLUDING regular time
               IF (msg_day_1010 (cnt) + msg_day_3010 (cnt)) > msg_ot_day_cap
               THEN
                  record_error (
                     p_error_count,
                     p_error_line,
                     p_error_number,
                     cnt,
                     86000261
                  ); --"Total regular and overtime hours for the day exceed 12.00"
               END IF;

               -- Check 262. Regular time 1010 is mandatory on a working day
               IF msg_day_1010 (cnt) = 0
               THEN
                  record_error (
                     p_error_count,
                     p_error_line,
                     p_error_number,
                     cnt,
                     86000262
                  ); --"Regular time (1010) must be recorded when overtime 3010 is used"
               END IF;
            END IF;

            ---------------------------------------------------------------
            -- Off day (3011). Cap is OT only; 1010 is not required and is
            -- not counted (assumption Q2).
            ---------------------------------------------------------------
            IF l_offday > msg_ot_day_cap
            THEN
               record_error (
                  p_error_count,
                  p_error_line,
                  p_error_number,
                  cnt,
                  86000264
               ); --"Off day overtime (3011) exceeds the 12.00 hour daily limit"
            END IF;

            ---------------------------------------------------------------
            -- Rest day (3020 / 3030 / 3040)
            ---------------------------------------------------------------
            IF l_restday > 0
            THEN
               -- Check 265. 12.00 hour cap on the sum of the three codes
               IF l_restday > msg_ot_day_cap
               THEN
                  record_error (
                     p_error_count,
                     p_error_line,
                     p_error_number,
                     cnt,
                     86000265
                  ); --"Rest day overtime exceeds the 12.00 hour daily limit"
               END IF;

               -- Check 266. 3020 is mandatory whenever 3030 or 3040 is used
               IF      (msg_day_3030 (cnt) + msg_day_3040 (cnt)) > 0
                   AND msg_day_3020 (cnt) = 0
               THEN
                  record_error (
                     p_error_count,
                     p_error_line,
                     p_error_number,
                     cnt,
                     86000266
                  ); --"Time code 3020 is mandatory when 3030 or 3040 is recorded"
               END IF;
            END IF;

            ---------------------------------------------------------------
            -- Public holiday (3050 / 3060). PH hours (8000) are excluded
            -- from the cap per the slide note.
            ---------------------------------------------------------------
            IF l_pubhol > 0
            THEN
               -- Check 267. 12.00 hour cap, excluding PH hours
               IF l_pubhol > msg_ot_day_cap
               THEN
                  record_error (
                     p_error_count,
                     p_error_line,
                     p_error_number,
                     cnt,
                     86000267
                  ); --"Public holiday overtime exceeds the 12.00 hour daily limit"
               END IF;

               -- Check 268. A public holiday (8000) must be recorded first
               IF msg_day_8000 (cnt) = 0
               THEN
                  record_error (
                     p_error_count,
                     p_error_line,
                     p_error_number,
                     cnt,
                     86000268
                  ); --"Public holiday (8000) must be recorded before public holiday overtime"
               END IF;

               -- Check 269. 3050 must precede 3060
               IF msg_day_3060 (cnt) > 0 AND msg_day_3050 (cnt) = 0
               THEN
                  record_error (
                     p_error_count,
                     p_error_line,
                     p_error_number,
                     cnt,
                     86000269
                  ); --"Time code 3050 must be recorded before 3060"
               END IF;
            END IF;
         END LOOP;
      END IF;   -- Malaysia

      -- =====================================================================
      -- SINGAPORE (A00, A80) - standby allowance rules
      -- =====================================================================
      IF pg_org_code IN ('A00', 'A80')
      THEN
         FOR cnt IN 1 .. 7
         LOOP
            l_sb_day := msg_day_3100 (cnt) + msg_day_3110 (cnt) + msg_day_3120 (cnt);

            IF l_sb_day > 0
            THEN
               ------------------------------------------------------------
               -- Check 270. Each standby entry must be exactly 1 unit
               ------------------------------------------------------------
               IF    (msg_day_3100 (cnt) > 0 AND msg_day_3100 (cnt) <> msg_sb_unit)
                  OR (msg_day_3110 (cnt) > 0 AND msg_day_3110 (cnt) <> msg_sb_unit)
                  OR (msg_day_3120 (cnt) > 0 AND msg_day_3120 (cnt) <> msg_sb_unit)
               THEN
                  record_error (
                     p_error_count,
                     p_error_line,
                     p_error_number,
                     cnt,
                     86000270
                  ); --"Standby allowance must be recorded as exactly 1 unit"
               END IF;

               ------------------------------------------------------------
               -- Check 275. No more than one standby unit per day
               ------------------------------------------------------------
               IF l_sb_day > msg_sb_unit
               THEN
                  record_error (
                     p_error_count,
                     p_error_line,
                     p_error_number,
                     cnt,
                     86000275
                  ); --"Only one standby unit may be recorded per day"
               END IF;

               ------------------------------------------------------------
               -- Day-of-week rules. Derived from the real calendar date so
               -- the result is independent of org_param.WEEKLY_START_DAY.
               ------------------------------------------------------------
               IF pg_end_date IS NOT NULL
               THEN
                  l_dt      := pg_end_date - 7 + cnt;
                  l_dow     := TO_CHAR (l_dt, 'DY', 'NLS_DATE_LANGUAGE=AMERICAN');
                  l_weekend := (l_dow IN ('SAT', 'SUN'));

                  -- Check 273. Weekday standby is Monday to Friday only
                  IF msg_day_3110 (cnt) > 0 AND l_weekend
                  THEN
                     record_error (
                        p_error_count,
                        p_error_line,
                        p_error_number,
                        cnt,
                        86000273
                     ); --"Weekday standby (3110) may only be recorded Monday through Friday"
                  END IF;

                  -- Check 274. Weekend standby is Saturday and Sunday only
                  IF msg_day_3120 (cnt) > 0 AND NOT l_weekend
                  THEN
                     record_error (
                        p_error_count,
                        p_error_line,
                        p_error_number,
                        cnt,
                        86000274
                     ); --"Weekend standby (3120) may only be recorded Saturday or Sunday"
                  END IF;
               END IF;
            END IF;

            -- Week-level fact gathering
            IF msg_day_3100 (cnt) > 0
            THEN
               l_3100_days := l_3100_days + 1;
            END IF;

            l_other_sb := l_other_sb + msg_day_3110 (cnt) + msg_day_3120 (cnt);
         END LOOP;

         ---------------------------------------------------------------
         -- Check 271. The weekly standby may be used only once per week.
         -- Reported against day 0 in line with the other weekly edits
         -- (17, 22, 90, 94).
         ---------------------------------------------------------------
         IF l_3100_days > 1
         THEN
            record_error (
               p_error_count,
               p_error_line,
               p_error_number,
               0,
               86000271
            ); --"Weekly standby (3100) may be recorded only once per week"
         END IF;

         ---------------------------------------------------------------
         -- Check 272. The weekly standby excludes daily standby for the
         -- whole week (assumption Q14 - week level, not day level).
         ---------------------------------------------------------------
         IF l_3100_days > 0 AND l_other_sb > 0
         THEN
            record_error (
               p_error_count,
               p_error_line,
               p_error_number,
               0,
               86000272
            ); --"Weekly standby (3100) cannot be combined with daily standby (3110/3120) in the same week"
         END IF;
      END IF;   -- Singapore

      dbms_output.put_line ('msg_checks: end, p_error_count=' || TO_CHAR (NVL (p_error_count, 0)));
   END msg_checks;

-- END INC1276683 MODULE BODY
-- ===========================================================================

--*************************************************************************************
--* PROCEDURE: Charge_Authorized
--*


-- ############################################################################
-- ## INJECTION I-5 : VALIDATE HOOK
-- ## Anchor: PROCEDURE validate (11-parameter overload), immediately after the
-- ##         "END LOOP;" that closes the FOR cnt IN 1 .. 7 day-edit loop and
-- ##         immediately before "ELSE --no worker information found"
-- ############################################################################

                     record_error (
                        p_error_count,
                        p_error_line,
                        p_error_number,
                        cnt,
                        86000089
                     ); --"No regular hours permitted on holidays"
                  END IF;
               END IF;
            END IF; -- worker is not a contractor
         END LOOP;

         --  12/22/05  L.I. reinstate leave_check
         --  01/04/06  L.I. Removed leave_check   

         msg_checks (p_error_count, p_error_line, p_error_number);   --RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026

      ELSE --no worker information found
         record_error (
            p_error_count,
            p_error_line,
            p_error_number,
            0,
            86000000
         ); --'No worker information available'
      END IF;
   END VALIDATE; --end of main proc


-- ############################################################################
-- ## OPTIONAL COMPANION SCRIPT — reference data
-- ## Not part of the package body. Column list is environment-specific; adapt
-- ## to match the existing 86000230-86000248 rows before running.
-- ############################################################################
--
-- --RdW 8/10/2026 INC1276683 MalaySing Validation Rules Aug 2026
-- -- INSERT INTO lcd.reason_code (reason_code, language_code, reason_desc) VALUES (86000261, 'E', 'Malaysia: total regular and overtime hours for the day exceed the 12.00 hour limit');
-- -- INSERT INTO lcd.reason_code (reason_code, language_code, reason_desc) VALUES (86000262, 'E', 'Malaysia: regular time (1010) must be recorded on a working day when overtime 3010 is used');
-- -- INSERT INTO lcd.reason_code (reason_code, language_code, reason_desc) VALUES (86000263, 'E', 'Malaysia: overtime codes for working day, off day, rest day and public holiday cannot be combined on the same day');
-- -- INSERT INTO lcd.reason_code (reason_code, language_code, reason_desc) VALUES (86000264, 'E', 'Malaysia: off day overtime (3011) exceeds the 12.00 hour daily limit');
-- -- INSERT INTO lcd.reason_code (reason_code, language_code, reason_desc) VALUES (86000265, 'E', 'Malaysia: rest day overtime (3020 + 3030 + 3040) exceeds the 12.00 hour daily limit');
-- -- INSERT INTO lcd.reason_code (reason_code, language_code, reason_desc) VALUES (86000266, 'E', 'Malaysia: time code 3020 is mandatory when 3030 or 3040 is recorded');
-- -- INSERT INTO lcd.reason_code (reason_code, language_code, reason_desc) VALUES (86000267, 'E', 'Malaysia: public holiday overtime (3050 + 3060) exceeds the 12.00 hour daily limit');
-- -- INSERT INTO lcd.reason_code (reason_code, language_code, reason_desc) VALUES (86000268, 'E', 'Malaysia: public holiday (8000) must be recorded before public holiday overtime');
-- -- INSERT INTO lcd.reason_code (reason_code, language_code, reason_desc) VALUES (86000269, 'E', 'Malaysia: time code 3050 must be recorded before 3060');
-- -- INSERT INTO lcd.reason_code (reason_code, language_code, reason_desc) VALUES (86000270, 'E', 'Singapore: standby allowance must be recorded as exactly 1 unit');
-- -- INSERT INTO lcd.reason_code (reason_code, language_code, reason_desc) VALUES (86000271, 'E', 'Singapore: weekly standby (3100) may be recorded only once per week');
-- -- INSERT INTO lcd.reason_code (reason_code, language_code, reason_desc) VALUES (86000272, 'E', 'Singapore: weekly standby (3100) cannot be combined with daily standby (3110 or 3120) in the same week');
-- -- INSERT INTO lcd.reason_code (reason_code, language_code, reason_desc) VALUES (86000273, 'E', 'Singapore: weekday standby (3110) may only be recorded Monday through Friday');
-- -- INSERT INTO lcd.reason_code (reason_code, language_code, reason_desc) VALUES (86000274, 'E', 'Singapore: weekend standby (3120) may only be recorded Saturday or Sunday');
-- -- INSERT INTO lcd.reason_code (reason_code, language_code, reason_desc) VALUES (86000275, 'E', 'Singapore: only one standby unit may be recorded per day');
-- -- COMMIT;
```

---

Two things worth flagging before you take this to the client. First, the single highest-risk assumption is Q10 — whether 3060 requires 3050 to simply exist or to be filled to normal working hours; the code labels (`<= NWH`, `> NWH`) suggest the latter, but the slide text says only "and only then." Second, the Singapore "week" for time code 3100 explicitly may start on any day, which a package that sees exactly one Saturday-to-Friday timesheet at a time structurally cannot police; I've assumed eTES owns that, and if it doesn't, we'll need a remote lookup on the pattern of `ITES.f_GET_FutureAbsenceHours@lcd_ites`.

***
