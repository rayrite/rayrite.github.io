# Unit Test: PTA Termination Exclusion Patch

**Script:** `test_pta_termination_output.sql`  
**Patch:** INC#XXXXX — Exclude PTA-terminated employees from regular time export  
**Date:** 2026-05-21

---

## Usage Instructions

### Prerequisites

- Oracle SQL Developer (or equivalent PL/SQL runner with DBMS_OUTPUT support)
- Connection to the LCD schema with SELECT access to:
  - `LCD.WORKER`
  - `LCD.WORKER_HIST`
  - `LCD.TIME_EXPORT`
  - `LCD.GLOBALS` (package spec)
  - `LCD.TIMEEXPORT` (patched package with `is_pta_terminated`)
- The patched `TIMEXPR1.SQL` (spec) and `TIMEXPR2.SQL` (body) must be compiled

### Running the Script

1. Open `test_pta_termination_output.sql` in SQL Developer
2. Enable DBMS Output: **View → Dbms Output** → click the green **+** icon → select your connection
3. Run as Script: press **F5** (not F9/Ctrl+Enter)
4. When prompted:
   - `v_org` — Enter 3-digit org code (e.g. `664`, `675`, `680`)
   - `v_run_date` — Enter date in `YYYYMMDD` format (e.g. `20260520`)
5. Review output in the DBMS Output panel

### Choosing Test Parameters

| Scenario | Recommended Inputs |
|----------|-------------------|
| Validate current production run | Today's date, any active org |
| Reproduce known duplicate | Date the duplicate was reported, affected org |
| Boundary testing | A Friday date (week-end boundary) |
| No-data baseline | An org with no terminations (confirms zero impact) |

---

## Unit Test Plan

### Test Matrix

| # | Test Case | Input | Expected `is_pta_terminated` | Section |
|---|-----------|-------|:----------------------------:|:-------:|
| 1 | Worker terminated on run date, latest status = `'3'` (Active) | Org with known termination | **TRUE** | 1, 2, 3 |
| 2 | Worker terminated on run date, latest status = `'1'` (Inactive) | Same org, worker already inactive | **FALSE** | 4 |
| 3 | Worker with `TERMINATION_DATE` NULL | Any normal worker | **FALSE** | 2 |
| 4 | Worker terminated 3 weeks ago, status `'1'` | Historical termination | **FALSE** | 2 |
| 5 | Worker terminated next week, status `'3'` | Future termination | **FALSE** | 2 |
| 6 | `TERMINATION_DATE` = Saturday (week start) | Boundary: first day of window | **TRUE** | 2 |
| 7 | `TERMINATION_DATE` = Friday (week end) | Boundary: last day of window | **TRUE** | 2 |
| 8 | `TERMINATION_DATE` = day after Friday | Boundary: one day past window | **FALSE** | 2 |
| 9 | `TERMINATION_DATE` = day before Saturday | Boundary: one day before window | **FALSE** | 2 |
| 10 | Worker in INTER file AND time_export (C/P/R) | Duplicate scenario | TRUE in Sec 3 | 3 |
| 11 | Org with no terminations | Baseline | All FALSE, 0 duplicates | All |

### Section-by-Section Expected Results

#### Section 1: Termination Job Preview

| Condition | Expected Output |
|-----------|----------------|
| Workers terminated on `v_run_date` with latest status `'3'` exist | Listed with WORKER_ID, SSN, TERM_DATE, STATUS, HIST_DATE |
| No workers match | `(No workers terminated on run date for this org)` |
| Count matches INTER file row count for same org/date | Confirms query equivalence with termination job |

#### Section 2: is_pta_terminated Function Validation

| Condition | Expected Output |
|-----------|----------------|
| Worker with term date in week AND status `'3'` | `TRUE` — `EXCLUDED from T-file (handled by INTER)` |
| Worker with term date in week AND status `'1'` | `FALSE` — `KEPT: term in week but status<>3` |
| Worker with term date outside week window | `FALSE` — `KEPT: term date outside week window` |
| Worker with term date but neither condition fully met | `FALSE` — `KEPT: does not meet both conditions` |

#### Section 3: Duplicate Detection

| Condition | Expected Output |
|-----------|----------------|
| Post-patch, no unresolved duplicates | `** NO DUPLICATES DETECTED **` |
| Workers found in both files | Listed with `FUNC_RESULT=TRUE` confirming patch excludes them |
| `FUNC_RESULT=FALSE` for a duplicate | **BUG** — see Troubleshooting |

#### Section 4: Boundary / Edge Cases

| Condition | Expected Output |
|-----------|----------------|
| Workers with term in week + status ≠ `'3'` | `FUNC_RESULT=FALSE`, Verdict: `OK - correctly kept` |
| Any row shows `FUNC_RESULT=TRUE` | **BUG** — `** BUG: should be FALSE! **` |
| No edge-case workers exist | `No edge-case workers found` |

---

## Expected Summary Output

```
===========================================================================
  SUMMARY
===========================================================================
  INTER file candidates (Section 1):        N
  Terminated workers in time_export (Sec 2): M
    - is_pta_terminated = TRUE:              X
    - is_pta_terminated = FALSE:             Y
  Potential duplicates (Section 3):          D
  Edge cases status<>3 (Section 4):          E

  RESULT: PATCH WORKING - all duplicates excluded by is_pta_terminated.
===========================================================================
```

**Pass criteria:**
- All Section 3 duplicates have `FUNC_RESULT = TRUE`
- All Section 4 edge cases have `FUNC_RESULT = FALSE`
- Summary shows `PATCH WORKING` or `No duplicates for this org/date combination`

---

## Troubleshooting: Possible Logic Errors

### Error 1: `ORA-06550: PLS-00302: component 'IS_PTA_TERMINATED' must be declared`

| Cause | Resolution |
|-------|------------|
| Package spec (`TIMEXPR1.SQL`) not compiled | Recompile: `@TIMEXPR1.SQL` then `@TIMEXPR2.SQL` |
| Package body invalid | Check: `SELECT status FROM user_objects WHERE object_name = 'TIMEEXPORT' AND object_type = 'PACKAGE BODY'` — must be `VALID` |
| Wrong schema | Ensure connected as the LCD schema owner, or prefix with `LCD.TIMEEXPORT.is_pta_terminated` |

### Error 2: Function returns TRUE when it should return FALSE

| Possible Cause | Diagnosis | Resolution |
|----------------|-----------|------------|
| `lcd.globals.empl_active` resolves to wrong value | `SELECT lcd.globals.empl_active FROM dual;` — must be `'3'` | Fix Globals_spec.sql |
| Worker has multiple WORKER_HIST rows with same MAX(actual_date) | Query: `SELECT * FROM lcd.worker_hist WHERE org_code=:org AND worker_id=:wid ORDER BY actual_date DESC` | Data issue — investigate duplicate hist entries |
| Date window off by one | Verify `l_weekend_dt` in output header matches expected Friday | Check `NEXT_DAY` NLS settings (see Error 6) |

### Error 3: Function returns FALSE when it should return TRUE

| Possible Cause | Diagnosis | Resolution |
|----------------|-----------|------------|
| Worker's latest WORKER_HIST status is not `'3'` | Check Section 4 output — worker may have been updated to Inactive | Correct: worker is handled differently (already inactive) |
| `TERMINATION_DATE` is outside the week window | Compare TERM_DATE in output vs. Week Start/End in header | Verify you're using the correct `v_run_date` |
| `TERMINATION_DATE` has time component | `SELECT termination_date, DUMP(termination_date) FROM lcd.worker WHERE worker_id=:wid` | If time ≠ 00:00:00, the `>=` / `<` range may miss it — investigate data entry |

### Error 4: Section 3 shows duplicates with FUNC_RESULT = FALSE

**This is the critical failure mode — the patch is not working.**

| Possible Cause | Diagnosis | Resolution |
|----------------|-----------|------------|
| Termination job uses `l_run_date` (single day) but patch uses `l_week_start..l_weekend_dt` (full week) | Compare Section 1 date range vs Section 2 | This is by design — Section 3 uses run-date criteria. If worker's term date is in week but NOT on run date, they're in T-file but NOT in INTER file — no actual duplicate |
| Worker's status changed between function call and Section 3 query | Unlikely in same session | Re-run; if persistent, check for concurrent DML |
| Function body not recompiled after edit | `SELECT last_ddl_time FROM user_objects WHERE object_name='TIMEEXPORT' AND object_type='PACKAGE BODY'` | Recompile body |

### Error 5: Section 1 shows workers but Section 3 shows zero duplicates

| Possible Cause | Diagnosis | Resolution |
|----------------|-----------|------------|
| Worker has no `time_export` records with `proc_stat_ind IN ('C','P','R')` for this week | Worker terminated before submitting time | Not a duplicate scenario — expected behavior |
| `time_export.week_end_date` doesn't match `l_weekend_dt` | Check: `SELECT DISTINCT week_end_date FROM lcd.time_export WHERE worker_id=:wid AND org_code=:org` | Date format mismatch (DATE vs TIMESTAMP) |

### Error 6: `NEXT_DAY` returns unexpected day (NLS issue)

| Cause | Resolution |
|-------|------------|
| `NLS_DATE_LANGUAGE` not English | Run: `ALTER SESSION SET NLS_DATE_LANGUAGE = 'AMERICAN';` before the script |
| Day name mismatch | The script uses `'FRIDAY'` — requires English NLS setting |

### Error 7: `ORA-01403: no data found` or cursor errors

| Possible Cause | Diagnosis | Resolution |
|----------------|-----------|------------|
| `lcd.globals.empl_active` is a function not a constant | Check: `DESC lcd.globals` | Adjust reference if it's a function call vs. package variable |
| Worker exists in `LCD.WORKER` but has zero `WORKER_HIST` rows | `SELECT COUNT(*) FROM lcd.worker_hist WHERE org_code=:org AND worker_id=:wid` | Data integrity issue — worker_hist should always have at least one row |

### Error 8: Script runs but produces no output

| Possible Cause | Resolution |
|----------------|------------|
| DBMS Output not enabled | Click green + in DBMS Output panel, select connection |
| Buffer size exhausted | Already set to UNLIMITED; if still an issue, reduce org scope |
| Script run with F9 instead of F5 | Use F5 (Run as Script) for anonymous blocks |

### Error 9: Performance — script takes > 30 seconds

| Possible Cause | Resolution |
|----------------|------------|
| Missing index on `LCD.WORKER_HIST(org_code, worker_id, actual_date)` | Verify: `SELECT index_name FROM user_ind_columns WHERE table_name='WORKER_HIST' AND column_name='ACTUAL_DATE'` |
| Large `time_export` table without proper index on `week_end_date` | Verify indexes exist; if testing only, acceptable in non-prod |
| Full table scan on `WORKER_HIST` scalar subquery | Add hint or refactor to analytic function (test script only — doesn't affect production) |

---

## Comparison: Pre-Patch vs Post-Patch Expected Behavior

| Metric | Pre-Patch | Post-Patch |
|--------|-----------|------------|
| Section 3 duplicates | > 0 (for orgs with terminations on run date) | 0 (all excluded by function) |
| Section 2 TRUE count | N/A (function doesn't exist) | Equals Section 3 duplicate count |
| Section 4 edge cases with TRUE | N/A | **Must be 0** — any TRUE is a bug |
| Worker `proc_stat_ind` after export | `C→1, P→2, R→3` for ALL workers | Same — UPDATE is NOT gated by the patch |

---

## Quick Validation Checklist

- [ ] Script compiles and runs without ORA errors
- [ ] Header shows correct Week Start (Saturday) and Week End (Friday)
- [ ] Section 1 count matches manual INTER file row count (if available)
- [ ] Section 2: All TRUE results have term date in week AND status = `'3'`
- [ ] Section 2: All FALSE results fail at least one condition
- [ ] Section 3: Zero duplicates OR all duplicates show `FUNC_RESULT = TRUE`
- [ ] Section 4: All rows show `FUNC_RESULT = FALSE` and verdict `OK`
- [ ] Summary shows `PATCH WORKING` or `No duplicates`
