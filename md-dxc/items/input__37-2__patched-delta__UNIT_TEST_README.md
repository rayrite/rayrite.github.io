# Unit Test Plan: PTA_TERM_DELTA_EXPORT

**Script:** `test_pta_delta_export.sql`  
**Procedure Under Test:** `PTA_TERM_DELTA_EXPORT`  
**Date:** 2026-05-21

---

## Usage Instructions

### Prerequisites

- Oracle SQL Developer (or equivalent with DBMS_OUTPUT support)
- Connection to LCD schema with SELECT on:
  - `LCD.WORKER`, `LCD.WORKER_HIST`, `LCD.LABOR_MOD_HIST`, `LCD.GLOBALS`
- `PTA_TERM_DELTA_EXPORT` procedure compiled and VALID
- `LCD.TimeExport` package compiled (for `is_pta_terminated` cross-validation)

### Running the Test

1. Open `test_pta_delta_export.sql` in SQL Developer
2. Enable DBMS Output: **View → Dbms Output** → click green **+** → select connection
3. Run as Script: **F5**
4. Enter when prompted:
   - `v_org` — 3-digit org code (e.g. `664`)
   - `v_run_date` — Date in `YYYYMMDD` format with known terminations

### Finding a Good Test Date

```sql
-- Find dates with terminations for a given org:
SELECT TO_CHAR(w.termination_date, 'YYYYMMDD') AS run_date,
       COUNT(*) AS term_count
  FROM lcd.worker w
  JOIN lcd.worker_hist h
    ON h.org_code = w.org_code AND h.worker_id = w.worker_id
   AND h.actual_date = (SELECT MAX(h2.actual_date)
                          FROM lcd.worker_hist h2
                         WHERE h2.org_code = w.org_code
                           AND h2.worker_id = w.worker_id)
 WHERE w.org_code = '664'
   AND w.termination_date IS NOT NULL
   AND w.termination_date >= SYSDATE - 90
   AND h.employment_status = '3'
 GROUP BY TO_CHAR(w.termination_date, 'YYYYMMDD')
 ORDER BY 1 DESC;
```

---

## Test Matrix

### Functional Tests

| # | Test Case | Input | Expected Result | Section |
|---|-----------|-------|-----------------|:-------:|
| 1 | Worker terminated, has approved adjustments with hour changes | Org/date with known termination + adj | Delta lines appear in Section 3 & 4 | 3, 4 |
| 2 | Worker terminated, NO adjustments in LABOR_MOD_HIST | Org/date with termination, no adj | Section 1 shows worker, Sections 2-4 empty | 1-4 |
| 3 | Worker terminated, adjustments exist but all zero-delta | Type change only, same hours | Section 2 shows rows, Section 3 empty | 2, 3, 5a |
| 4 | Positive delta (hours increased): 6 → 9 on code 1010 | Known adjustment | Output shows `+3.00` for type `1010` | 4 |
| 5 | Negative delta (hours decreased): 9 → 6 on code 1010 | Known adjustment | Output shows `-3.00` for type `1010` | 4 |
| 6 | Full removal: 8 → 0 | Known adjustment | Output shows `-8.00` | 4 |
| 7 | Full addition: 0 → 4 | Known adjustment | Output shows `4.00` | 4 |
| 8 | Multiple adjustments same worker/date/type (aggregation) | Multiple adj rows | Single line with summed delta | 3 |
| 9 | NULL BEF_LAB_UNITS in LABOR_MOD_HIST | Data with NULL | NVL treats as 0, no error | 5b |
| 10 | NULL AFT_LAB_UNITS in LABOR_MOD_HIST | Data with NULL | NVL treats as 0, no error | 5b |
| 11 | Unapproved adjustments (Pending 'P') | Worker with 'P' adj | NOT in output; shown in 5d count | 5d |
| 12 | Rejected adjustments ('R') | Worker with 'R' adj | NOT in output | 5d |
| 13 | No terminated workers for org/date | Date with no terminations | All sections empty, summary says "NO DATA" | All |
| 14 | Activity type change with delta | BEF=1010/8hrs, AFT=1020/6hrs | Line shows `-2.00` under type `1020` (AFT) | 4 |
| 15 | Lookback window boundary (actual_date = lookback_dt) | Adjustment on boundary date | Included (>= comparison) | 3 |
| 16 | Lookback window boundary (actual_date = weekend_dt) | Adjustment on Friday | Included (<= comparison) | 3 |
| 17 | Adjustment outside lookback window | Old adjustment > 4 weeks | NOT included | 2 |

### Format Validation Tests

| # | Test Case | Expected | Section |
|---|-----------|----------|:-------:|
| 18 | Worker ID field is 10 chars wide | Right-padded with spaces | 4 |
| 19 | SSN field is 10 chars wide | Right-padded with spaces | 4 |
| 20 | Date field is MM/DD/YYYY (10 chars) | Correct date format | 4 |
| 21 | Time type field is 4 chars wide | Right-padded with spaces | 4 |
| 22 | Hours field is 10 chars wide | Left-padded, `S999990D99` for neg | 4 |
| 23 | Negative hours show leading sign | e.g. `-3.00` not `3.00-` | 4 |
| 24 | Total record length before comments = 47 chars | Format check passes | 4 |
| 25 | Full record with comments = 107 chars | 47 + 60 spaces | 4 |

### Integration Tests

| # | Test Case | Expected | Section |
|---|-----------|----------|:-------:|
| 26 | All delta workers are subset of INTER file workers | Every delta worker shows "In INTER file: YES" | 7 |
| 27 | Procedure executes without error | "PROCEDURE EXECUTED SUCCESSFULLY" or expected UTL_FILE error | 6 |
| 28 | Procedure reports record count | DBMS_OUTPUT shows "N records written" | 6 |

---

## Expected Results by Section

### Section 1: Terminated Worker Identification

| Condition | Expected |
|-----------|----------|
| Workers found | Table with WORKER_ID, SSN, TERM_DATE, STATUS, HIST_DATE |
| No workers found | Message: "NO TERMINATED WORKERS FOUND" |

### Section 2: Raw LABOR_MOD_HIST Data

| Condition | Expected |
|-----------|----------|
| Adjustments exist | Each row shows BEF/AFT type, BEF/AFT hours, computed delta |
| No adjustments | Empty table, count = 0 |
| NULL units present | Displayed with NVL-resolved value (0) |

### Section 3: Grouped Delta Calculation

| Condition | Expected |
|-----------|----------|
| Non-zero deltas exist | Aggregated lines with SUM(delta) per worker/date/type |
| All deltas cancel to zero | Empty (HAVING filters them out) |
| Multiple rows aggregate | Single line with summed total |

### Section 4: Output Format Preview

| Condition | Expected |
|-----------|----------|
| Lines formatted | Enclosed in `[...]` brackets showing exact field positions |
| Negative hours | Format: `S999990D99` → `-3.00` |
| Positive hours | Format: `999990D99` → `3.00` with leading space |
| Length check | No "FORMAT ERROR" messages |

### Section 5: Edge Cases

| Sub-section | Expected |
|-------------|----------|
| 5a Zero-delta | Count shown; STATUS: OK |
| 5b NULL units | Count shown; STATUS: OK (NVL handles) |
| 5c Type changes | Count shown; NOTE about AFT type |
| 5d Unapproved | Count shown; confirms exclusion |

### Section 6: Procedure Execution

| Condition | Expected |
|-----------|----------|
| UTL_FILE directory valid | "PROCEDURE EXECUTED SUCCESSFULLY" + "N records written" |
| UTL_FILE directory missing | Error message + note "expected if not configured" |
| No data to export | "SKIPPED: No delta records" |

### Section 7: Cross-Validation

| Condition | Expected |
|-----------|----------|
| All delta workers in INTER set | Every row shows "Has delta adjustments: YES" for those with data |
| Worker in INTER but no deltas | Shows "Has delta adjustments: NO" — acceptable |

---

## Summary Pass Criteria

The test passes when ALL of the following are true:

- [ ] Section 1 correctly identifies terminated workers matching INTER file criteria
- [ ] Section 2 shows raw adjustment data with correct before/after values
- [ ] Section 3 delta calculation: `SUM(AFT - BEF)` produces expected values
- [ ] Section 4 format: all records are 47 chars (before comments), no FORMAT ERROR
- [ ] Section 4 format: negative hours display as `-N.NN`, positive as ` N.NN`
- [ ] Section 5a: zero-delta rows excluded (not in Section 3 or 4)
- [ ] Section 5b: NULL units handled without ORA errors
- [ ] Section 5d: unapproved adjustments counted but not in output
- [ ] Section 6: procedure either succeeds or fails only on UTL_FILE (not logic error)
- [ ] Section 7: all delta workers are a subset of INTER file workers

---

## Troubleshooting

### Error 1: `ORA-06550: PLS-00201: identifier 'PTA_TERM_DELTA_EXPORT' must be declared`

| Cause | Resolution |
|-------|------------|
| Procedure not compiled | Run: `@patched-delta/PTA_TERM_DELTA_EXPORT.sql` |
| Compiled in different schema | Prefix with schema: `LCD.PTA_TERM_DELTA_EXPORT(...)` |
| Compilation failed silently | Check: `SELECT * FROM user_errors WHERE name = 'PTA_TERM_DELTA_EXPORT'` |

### Error 2: `ORA-06550: PLS-00201: identifier 'LCD.GLOBALS.EMPL_ACTIVE' must be declared`

| Cause | Resolution |
|-------|------------|
| LCD.GLOBALS package not compiled | Compile: `@Globals_spec.sql` |
| Constant doesn't exist | Verify: `SELECT lcd.globals.empl_active FROM dual;` — should be `'3'` |

### Error 3: Section 1 shows workers but Section 2 is empty

| Cause | Resolution |
|-------|------------|
| No LABOR_MOD_HIST records for those workers | Expected for workers who never had adjustments |
| Adjustments exist but outside lookback window | Increase `l_weeks_back` (change in DECLARE section) |
| Adjustments exist but not approved | Check Section 5d — they're counted as "Unapproved" |
| Wrong ORG_CODE in LABOR_MOD_HIST | `SELECT DISTINCT org_code FROM lcd.labor_mod_hist WHERE lmh_worker_id = :wid` |

### Error 4: Delta calculation produces unexpected values

| Cause | Diagnosis | Resolution |
|-------|-----------|------------|
| Multiple adjustment rows for same day/type | Section 2 shows individual rows; Section 3 shows sum | Verify: `SELECT * FROM lcd.labor_mod_hist WHERE lmh_worker_id=:wid AND actual_date=:dt ORDER BY trans_date` |
| BEF/AFT values swapped in source | Compare Section 2 BEF vs AFT columns | Data entry issue in eTES or LCD Labor Accounting |
| Reversed sign | Check if `BEF > AFT` produces negative (correct) | Formula is `AFT - BEF`: reduction = negative, addition = positive |

### Error 5: Section 4 shows "FORMAT ERROR: record length = N"

| Cause | Resolution |
|-------|------------|
| Worker ID > 10 chars | Check: `SELECT worker_id, LENGTH(worker_id) FROM lcd.worker WHERE org_code=:org AND LENGTH(worker_id)>10` |
| SSN > 10 chars | Check: `SELECT worker_ssn, LENGTH(worker_ssn) FROM lcd.worker WHERE LENGTH(worker_ssn)>10` |
| Time type > 4 chars | Check: `SELECT DISTINCT aft_att_type, LENGTH(aft_att_type) FROM lcd.labor_mod_hist WHERE LENGTH(aft_att_type)>4` |
| Hours format overflow | Value > 999999.99 or < -999999.99 (extremely unlikely) |

### Error 6: Section 6 raises `ORA-29280: invalid directory path` or `ORA-29283: invalid file operation`

| Cause | Resolution |
|-------|------------|
| UTL_FILE directory object doesn't exist | `SELECT directory_name, directory_path FROM all_directories;` |
| No write permission on OS directory | DBA must grant OS permissions |
| Directory object not granted to schema | `GRANT READ, WRITE ON DIRECTORY <name> TO LCD;` |
| **This is NOT a logic error** | Sections 1-5 and 7 still validate the query logic independently |

### Error 7: Section 7 shows a delta worker NOT in INTER file

| Cause | Resolution |
|-------|------------|
| This should NEVER happen | The delta cursor uses the same `term_workers` CTE as worker identification |
| If it occurs | Compare the WHERE clauses — possible version mismatch between procedure and test |

### Error 8: `NEXT_DAY` returns unexpected date

| Cause | Resolution |
|-------|------------|
| NLS_DATE_LANGUAGE not English | `ALTER SESSION SET NLS_DATE_LANGUAGE = 'AMERICAN';` |
| Run date IS a Friday | `NEXT_DAY(Friday - 1, 'FRIDAY')` = `NEXT_DAY(Thursday, 'FRIDAY')` = same Friday ✓ |

### Error 9: No data found for any org/date combination

| Cause | Resolution |
|-------|------------|
| No recent terminations in system | Query: `SELECT org_code, COUNT(*) FROM lcd.worker WHERE termination_date >= SYSDATE-90 GROUP BY org_code` |
| Workers terminated but status ≠ '3' | They don't qualify — termination job wouldn't pick them up either |
| LABOR_MOD_HIST is empty or very sparse | `SELECT COUNT(*) FROM lcd.labor_mod_hist WHERE org_code = :org AND lmh_aprv_ind = 'A'` |

### Error 10: Procedure works but output format doesn't match T-file

| Issue | Diagnosis |
|-------|-----------|
| Hours field alignment off | Compare with actual T-file: `head -5 T260520.664` vs PTADELTA output |
| Different decimal separator | Check `NLS_NUMERIC_CHARACTERS`: `SELECT value FROM nls_session_parameters WHERE parameter='NLS_NUMERIC_CHARACTERS'` — should be `'.,'` |
| ORG field width differs | T-file uses raw ORG (no padding); PTADELTA uses `RPAD(p_org, 3)` — both produce 3 chars for 3-digit orgs |

---

## Quick Validation Checklist

- [ ] Script runs without ORA errors (compile/runtime)
- [ ] Header shows correct Week End (Friday) and Lookback dates
- [ ] Section 1 count matches INTER file worker count (if known)
- [ ] Section 2 BEF/AFT values are reasonable (0-24 hour range)
- [ ] Section 3 delta = Section 2 AFT - BEF (summed per group)
- [ ] Section 4 format: no FORMAT ERROR messages
- [ ] Section 4: negative hours show minus sign, positive show space
- [ ] Section 5a: zero-delta count + Section 3 count = total unique groups
- [ ] Section 6: procedure succeeds (or fails only on UTL_FILE)
- [ ] Section 7: all workers with deltas are in INTER file set
- [ ] Summary: counts are internally consistent

---

## Comparison: INTER File vs PTADELTA File

| Aspect | INTER{YYMMDD}.{ORG} | PTADELTA{YYMMDD}.{ORG} |
|--------|---------------------|------------------------|
| Source | IT_TIMESHEET / AD_TIMESHEET | LCD.LABOR_MOD_HIST |
| Hours value | Raw timesheet hours | Delta (AFT - BEF) from adjustments |
| Can be negative | Unlikely (raw entry) | **Yes** — reductions show as negative |
| Workers included | Terminated + status Active | Same set (subset with adjustments) |
| File may be empty | Only if no terminated workers | If terminated workers have no adjustments |
| Format | T-file layout (10+10+10+4+10+3) | Identical T-file layout |
| Record source | Current week + 3 prior weeks timesheets | Approved LABOR_MOD_HIST within lookback |
