# Implementation Plan: Prior Time Adjustment Delta Export for PTA-Terminated Employees

**Date:** 2026-05-21  
**Status:** Ready for review  
**Depends On:** PTA_TERM_EXCLUSION_PATCH_PLAN.md (Task 37-2)  

---

## 1. Objective

Produce a GEMS-format file containing **delta hours** from prior time adjustments for all employees captured in the `INTER{YYMMDD}.{ORG}` termination file. The output format matches the existing T-file (`T{YYMMDD}.{ORG}`) layout so downstream payroll systems can consume it without parser changes.

**Example:** Employee changes activity code 1010 from 9 hours to 6 hours → output line shows **-3.00** hours.

---

## 2. Data Source: `LCD.LABOR_MOD_HIST`

### 2.1 Table Confirmed Available

The `LCD.LABOR_MOD_HIST` table stores complete **before/after images** of every timesheet modification. It is the authoritative source for computing delta hours.

### 2.2 Relevant Columns

| Column | Type | Purpose |
|--------|------|---------|
| `LMH_WORKER_ID` | VARCHAR2 | Worker ID (matches `LCD.WORKER.WORKER_ID`) |
| `LMH_WORKER_SSN` | VARCHAR2 | Worker SSN |
| `ORG_CODE` | VARCHAR2 | Organization code |
| `ACTUAL_DATE` | DATE | Date the work was performed |
| `BEF_ATT_TYPE` | VARCHAR2 | Activity/attendance type BEFORE adjustment |
| `AFT_ATT_TYPE` | VARCHAR2 | Activity/attendance type AFTER adjustment |
| `BEF_LAB_UNITS` | NUMBER | Hours BEFORE adjustment |
| `AFT_LAB_UNITS` | NUMBER | Hours AFTER adjustment |
| `LMH_APRV_IND` | CHAR(1) | Approval status: `'A'`=Approved, `'P'`=Pending, `'R'`=Rejected |
| `MOD_APRVL_DATE` | DATE | Date the adjustment was approved |
| `TRANS_DATE` | DATE | Transaction/submission date |
| `BEF_WO_NUM` | VARCHAR2 | Work order (before) |
| `AFT_WO_NUM` | VARCHAR2 | Work order (after) |
| `CREATED_BY_NAME` | VARCHAR2 | Source system: `'ITES'` (eTES) or `'LABOR'` (LCD) |

### 2.3 Delta Calculation

```sql
delta_hours = AFT_LAB_UNITS - BEF_LAB_UNITS
```

| Before | After | Delta | Meaning |
|:------:|:-----:|:-----:|---------|
| 9.00 | 6.00 | **-3.00** | Hours reduced |
| 0.00 | 4.00 | **+4.00** | Hours added |
| 8.00 | 8.00 | **0.00** | No change (skip — don't write) |
| 8.00 | 0.00 | **-8.00** | Hours fully removed |

### 2.4 Feasibility: CONFIRMED

The data required exists entirely within the LCD schema:
- Terminated worker identification: `LCD.WORKER` + `LCD.WORKER_HIST` (same as `is_pta_terminated`)
- Adjustment history: `LCD.LABOR_MOD_HIST`
- Worker SSN: `LCD.WORKER.WORKER_SSN` or `LCD.LABOR_MOD_HIST.LMH_WORKER_SSN`

No cross-database links required. No new tables needed.

---

## 3. Output Format

### 3.1 File Naming

```
PTADELTA{YYMMDD}.{ORG}
```

Example: `PTADELTA260520.664`

This distinguishes from:
- `T260520.664` — regular time export
- `INTER260520.664` — termination job raw hours

### 3.2 Record Layout (Matches T-File / `p_write_gems`)

| Position | Width | Content | Format |
|:--------:|:-----:|---------|--------|
| 1–10 | 10 | Worker ID | Right-padded with spaces |
| 11–20 | 10 | Worker SSN | Right-padded with spaces |
| 21–30 | 10 | Actual Date | `MM/DD/YYYY` |
| 31–34 | 4 | Activity Type (after) | Right-padded with spaces |
| 35–44 | 10 | Delta Hours | Left-padded; `S999990D99` if negative, `999990D99` if positive |
| 45–47 | 3 | ORG Code | As-is |
| 48–107 | 60 | Comments | Spaces (reserved) |

### 3.3 Example Output Lines

```
SMITH001  123456789 05/18/2026101       -3.00664                                                            
SMITH001  123456789 05/19/2026101        4.00664                                                            
JONES002  987654321 05/20/20261020      -8.00664                                                            
```

---

## 4. Design

### 4.1 New Stored Procedure

Create a standalone procedure `ITES.PTA_TERM_DELTA_EXPORT` (or `LCD.PTA_TERM_DELTA_EXPORT` depending on schema ownership conventions) that:

1. Identifies the set of PTA-terminated workers for the given org/date (same criteria as `FINAL_PTA_TERMINATED_EMP`)
2. Queries `LCD.LABOR_MOD_HIST` for approved adjustments belonging to those workers
3. Computes delta hours per worker/date/activity-type
4. Writes output in T-file format using `UTL_FILE`

### 4.2 Procedure Signature

```sql
CREATE OR REPLACE PROCEDURE PTA_TERM_DELTA_EXPORT (
    p_directory   IN VARCHAR2,        -- UTL_FILE directory object
    p_org         IN VARCHAR2,        -- 3-digit org code
    p_date        IN VARCHAR2 DEFAULT NULL,  -- YYYYMMDD (defaults to SYSDATE)
    p_weeks_back  IN NUMBER  DEFAULT 4,     -- How many weeks of adjustments to include
    p_destination IN VARCHAR2 DEFAULT NULL   -- Email recipients (semicolon-delimited)
) AS
```

### 4.3 Worker Selection Criteria (Mirrors `FINAL_PTA_TERMINATED_EMP`)

```sql
-- Workers terminated on run date with latest status = Active ('3')
-- Exactly matches the INTER file population
SELECT w.worker_id, w.worker_ssn
  FROM lcd.worker w
  JOIN lcd.worker_hist h
    ON h.org_code   = w.org_code
   AND h.worker_id  = w.worker_id
   AND h.actual_date = (SELECT MAX(h2.actual_date)
                          FROM lcd.worker_hist h2
                         WHERE h2.org_code  = w.org_code
                           AND h2.worker_id = w.worker_id)
 WHERE w.org_code = p_org
   AND w.termination_date IS NOT NULL
   AND w.termination_date >= l_run_date
   AND w.termination_date <  l_run_date + 1
   AND h.employment_status = '3';          -- lcd.globals.empl_active
```

### 4.4 Adjustment Selection from LABOR_MOD_HIST

```sql
-- For each terminated worker, fetch approved adjustments
-- within the lookback window (default: 4 weeks from week-end)
SELECT lmh.lmh_worker_id,
       lmh.lmh_worker_ssn,
       lmh.actual_date,
       lmh.aft_att_type                          AS time_type,
       (lmh.aft_lab_units - lmh.bef_lab_units)  AS delta_hours
  FROM lcd.labor_mod_hist lmh
 WHERE lmh.org_code       = p_org
   AND lmh.lmh_worker_id  = <terminated_worker_id>
   AND lmh.lmh_aprv_ind   = 'A'                 -- Approved only
   AND lmh.actual_date    >= (l_weekend_dt - (p_weeks_back * 7))
   AND lmh.actual_date    <= l_weekend_dt
   AND (lmh.aft_lab_units - lmh.bef_lab_units) <> 0  -- Skip zero-delta
 ORDER BY lmh.actual_date, lmh.aft_att_type;
```

### 4.5 Combined Query (Single Pass)

For efficiency, combine worker selection and adjustment fetch in one query:

```sql
CURSOR cur_deltas IS
WITH term_workers AS (
    SELECT w.worker_id, w.worker_ssn
      FROM lcd.worker w
      JOIN lcd.worker_hist h
        ON h.org_code   = w.org_code
       AND h.worker_id  = w.worker_id
       AND h.actual_date = (SELECT MAX(h2.actual_date)
                              FROM lcd.worker_hist h2
                             WHERE h2.org_code  = w.org_code
                               AND h2.worker_id = w.worker_id)
     WHERE w.org_code = p_org
       AND w.termination_date IS NOT NULL
       AND w.termination_date >= l_run_date
       AND w.termination_date <  l_run_date + 1
       AND h.employment_status = '3'
)
SELECT lmh.lmh_worker_id                        AS worker_id,
       tw.worker_ssn,
       lmh.actual_date,
       NVL(RTRIM(lmh.aft_att_type), 
           RTRIM(lmh.bef_att_type))             AS time_type,
       SUM(lmh.aft_lab_units - lmh.bef_lab_units) AS delta_hours
  FROM lcd.labor_mod_hist lmh
  JOIN term_workers tw
    ON tw.worker_id = lmh.lmh_worker_id
 WHERE lmh.org_code      = p_org
   AND lmh.lmh_aprv_ind  = 'A'
   AND lmh.actual_date   >= (l_weekend_dt - (p_weeks_back * 7))
   AND lmh.actual_date   <= l_weekend_dt
 GROUP BY lmh.lmh_worker_id,
          tw.worker_ssn,
          lmh.actual_date,
          NVL(RTRIM(lmh.aft_att_type), RTRIM(lmh.bef_att_type))
HAVING SUM(lmh.aft_lab_units - lmh.bef_lab_units) <> 0
 ORDER BY lmh.lmh_worker_id, lmh.actual_date, time_type;
```

### 4.6 File Write Logic (Mirrors `p_write_gems`)

```sql
-- Format each output record identically to T-file
IF l_delta_hrs < 0 THEN
    l_hrs_str := TO_CHAR(l_delta_hrs, 'S999990D99');
ELSE
    l_hrs_str := TO_CHAR(l_delta_hrs, '999990D99');
END IF;

l_rec_out := RPAD(r.worker_id, 10, ' ') ||
             RPAD(r.worker_ssn, 10, ' ') ||
             TO_CHAR(r.actual_date, 'MM/DD/YYYY') ||
             RPAD(r.time_type, 4, ' ') ||
             LPAD(l_hrs_str, 10, ' ') ||
             p_org ||
             RPAD(' ', 60, ' ');

UTL_FILE.PUT_LINE(l_file, l_rec_out);
l_rec_count := l_rec_count + 1;
```

---

## 5. Full Procedure Code

```sql
CREATE OR REPLACE PROCEDURE PTA_TERM_DELTA_EXPORT (
    p_directory   IN VARCHAR2,
    p_org         IN VARCHAR2,
    p_date        IN VARCHAR2 DEFAULT NULL,
    p_weeks_back  IN NUMBER  DEFAULT 4,
    p_destination IN VARCHAR2 DEFAULT NULL
) AS
    l_file         UTL_FILE.FILE_TYPE;
    l_filename     VARCHAR2(200);
    l_file_opened  BOOLEAN := FALSE;

    l_run_date     DATE;
    l_weekend_dt   DATE;
    l_yymmdd       VARCHAR2(6);
    l_lookback_dt  DATE;

    l_hrs_str      VARCHAR2(10);
    l_rec_out      VARCHAR2(110);
    l_rec_count    NUMBER := 0;
    l_worker_count NUMBER := 0;

    rtnCode        INTEGER;
    rtnMsg         VARCHAR2(200);
    arrAddr        ITES.EITCOMMON.ArrOut_ty;
    EmailException EXCEPTION;

    -- Combined cursor: terminated workers + their approved adjustments
    CURSOR cur_deltas IS
    WITH term_workers AS (
        SELECT w.worker_id, w.worker_ssn
          FROM lcd.worker w
          JOIN lcd.worker_hist h
            ON h.org_code   = w.org_code
           AND h.worker_id  = w.worker_id
           AND h.actual_date = (SELECT MAX(h2.actual_date)
                                  FROM lcd.worker_hist h2
                                 WHERE h2.org_code  = w.org_code
                                   AND h2.worker_id = w.worker_id)
         WHERE w.org_code = p_org
           AND w.termination_date IS NOT NULL
           AND w.termination_date >= l_run_date
           AND w.termination_date <  l_run_date + 1
           AND h.employment_status = '3'   -- Active (same as INTER file criteria)
    )
    SELECT lmh.lmh_worker_id                        AS worker_id,
           tw.worker_ssn,
           lmh.actual_date,
           NVL(RTRIM(lmh.aft_att_type),
               RTRIM(lmh.bef_att_type))             AS time_type,
           SUM(lmh.aft_lab_units - lmh.bef_lab_units) AS delta_hours
      FROM lcd.labor_mod_hist lmh
      JOIN term_workers tw
        ON tw.worker_id = lmh.lmh_worker_id
     WHERE lmh.org_code      = p_org
       AND lmh.lmh_aprv_ind  = 'A'
       AND lmh.actual_date   >= l_lookback_dt
       AND lmh.actual_date   <= l_weekend_dt
     GROUP BY lmh.lmh_worker_id,
              tw.worker_ssn,
              lmh.actual_date,
              NVL(RTRIM(lmh.aft_att_type), RTRIM(lmh.bef_att_type))
    HAVING SUM(lmh.aft_lab_units - lmh.bef_lab_units) <> 0
     ORDER BY lmh.lmh_worker_id, lmh.actual_date, time_type;

BEGIN
    --------------------------------------------------------------------------
    -- 1) Resolve dates
    --------------------------------------------------------------------------
    IF p_date IS NOT NULL THEN
        l_run_date := TRUNC(TO_DATE(p_date, 'YYYYMMDD'));
    ELSE
        l_run_date := TRUNC(SYSDATE);
    END IF;

    l_weekend_dt  := NEXT_DAY(l_run_date - 1, 'FRIDAY');
    l_lookback_dt := l_weekend_dt - (p_weeks_back * 7);
    l_yymmdd      := TO_CHAR(l_run_date, 'YYMMDD');

    --------------------------------------------------------------------------
    -- 2) File naming
    --------------------------------------------------------------------------
    l_filename := 'PTADELTA' || l_yymmdd || '.' || p_org;

    --------------------------------------------------------------------------
    -- 3) Parse email list if provided
    --------------------------------------------------------------------------
    IF p_destination IS NOT NULL THEN
        IF NOT ites.eitCommon.ParseDelimitedString(
               p_destination, arrAddr, ';', rtnMsg
           ) THEN
            RAISE EmailException;
        END IF;
    END IF;

    --------------------------------------------------------------------------
    -- 4) Process adjustments and write file
    --------------------------------------------------------------------------
    FOR r IN cur_deltas LOOP
        -- Open file on first record
        IF NOT l_file_opened THEN
            l_file := UTL_FILE.FOPEN(p_directory, l_filename, 'W', 32767);
            l_file_opened := TRUE;
        END IF;

        -- Format hours (same as p_write_gems in TIMEXPR2.SQL)
        IF r.delta_hours < 0 THEN
            l_hrs_str := TO_CHAR(r.delta_hours, 'S999990D99');
        ELSE
            l_hrs_str := TO_CHAR(r.delta_hours, '999990D99');
        END IF;

        -- Build record in T-file format
        l_rec_out := RPAD(r.worker_id, 10, ' ') ||
                     RPAD(r.worker_ssn, 10, ' ') ||
                     TO_CHAR(r.actual_date, 'MM/DD/YYYY') ||
                     RPAD(NVL(r.time_type, ' '), 4, ' ') ||
                     LPAD(l_hrs_str, 10, ' ') ||
                     RPAD(p_org, 3, ' ') ||
                     RPAD(' ', 60, ' ');

        UTL_FILE.PUT_LINE(l_file, l_rec_out);
        l_rec_count := l_rec_count + 1;
    END LOOP;

    --------------------------------------------------------------------------
    -- 5) Close file and email if applicable
    --------------------------------------------------------------------------
    IF l_file_opened THEN
        UTL_FILE.FCLOSE(l_file);

        DBMS_OUTPUT.PUT_LINE('PTA_TERM_DELTA_EXPORT: ' || l_filename ||
                             ' — ' || l_rec_count || ' records written.');

        IF p_destination IS NOT NULL AND arrAddr.COUNT > 0 THEN
            FOR j IN 1 .. arrAddr.LAST LOOP
                ites.EmailFile(
                    ' ',
                    l_filename,
                    p_directory,
                    arrAddr(j),
                    'PTA Term Delta - ' || p_org || ' - ' || l_yymmdd,
                    rtnCode,
                    rtnMsg
                );
                IF rtnCode = -1 THEN
                    RAISE EmailException;
                END IF;
            END LOOP;
        END IF;
    ELSE
        DBMS_OUTPUT.PUT_LINE('PTA_TERM_DELTA_EXPORT: No adjustment records for ' ||
                             p_org || ' on ' || TO_CHAR(l_run_date, 'YYYY-MM-DD'));
    END IF;

EXCEPTION
    WHEN EmailException THEN
        IF UTL_FILE.IS_OPEN(l_file) THEN
            UTL_FILE.FCLOSE(l_file);
        END IF;
        RAISE;

    WHEN OTHERS THEN
        IF UTL_FILE.IS_OPEN(l_file) THEN
            UTL_FILE.FCLOSE(l_file);
        END IF;
        RAISE;
END PTA_TERM_DELTA_EXPORT;
/
```

---

## 6. Activity Type Handling

### 6.1 Type Change Adjustments

When an employee changes **both** the activity type and hours (e.g., moves 8 hours from code `1010` to code `1020`), `LABOR_MOD_HIST` stores:

| BEF_ATT_TYPE | AFT_ATT_TYPE | BEF_LAB_UNITS | AFT_LAB_UNITS |
|:------------:|:------------:|:-------------:|:-------------:|
| 1010 | 1020 | 8.00 | 8.00 |

The delta in hours = 0, but the activity type changed. This record would be **skipped** by the `HAVING <> 0` clause. This is correct behavior — from a payroll perspective, only hour differences matter for the delta file.

### 6.2 Split Adjustments

When hours are moved between types, `LABOR_MOD_HIST` may contain **two** rows:

| Row | BEF_ATT_TYPE | AFT_ATT_TYPE | BEF_UNITS | AFT_UNITS | Delta |
|:---:|:------------:|:------------:|:---------:|:---------:|:-----:|
| 1 | 1010 | 1010 | 9.00 | 6.00 | -3.00 |
| 2 | 1020 | 1020 | 0.00 | 3.00 | +3.00 |

Both rows are written to the output file as separate lines (grouped by `actual_date` + `time_type`), producing:

```
SMITH001  123456789 05/18/2026101       -3.00664
SMITH001  123456789 05/18/20261020       3.00664
```

### 6.3 Which Activity Type to Display

The query uses `NVL(RTRIM(lmh.aft_att_type), RTRIM(lmh.bef_att_type))` — preferring the AFTER type. This is correct because:
- If hours are reduced on a code, AFT type = BEF type (same code, fewer hours)
- If hours are added to a new code, AFT type = the new code
- If type is blanked out (rare), falls back to BEF type

---

## 7. Time Window Parameters

### 7.1 Default Lookback: 4 Weeks

The `p_weeks_back` parameter (default 4) controls how far back to look for adjustments:

```sql
l_lookback_dt := l_weekend_dt - (p_weeks_back * 7);
```

This matches the `FINAL_PTA_TERMINATED_EMP` pattern which includes the current week + 3 prior weeks of timesheet data.

### 7.2 Adjustment Date vs. Actual Date

The query filters on `lmh.actual_date` (the date the work was performed), NOT `lmh.mod_aprvl_date` (when approved). This ensures:
- Adjustments for work performed within the lookback window are captured
- It doesn't matter WHEN the adjustment was approved, only WHAT dates it affects

### 7.3 Alternative: Filter by Approval Date

If the business requirement is "only adjustments approved since the last export," add:

```sql
AND lmh.mod_aprvl_date >= <last_export_date>
```

This would require tracking the last run date (via `LCD.EVENT_LOG` or a parameter).

---

## 8. Integration with Existing Termination Job

### 8.1 Execution Order

```
1. FINAL_PTA_TERMINATED_EMP  →  produces INTER{YYMMDD}.{ORG}  (raw hours)
2. PTA_TERM_DELTA_EXPORT     →  produces PTADELTA{YYMMDD}.{ORG} (delta hours)
```

Both procedures share the same worker selection criteria and can run independently or sequentially. The delta procedure can be called from the same scheduler job that calls the termination job.

### 8.2 Wrapper Integration (Optional)

Add a call to the existing termination job wrapper:

```sql
-- After FINAL_PTA_TERMINATED_EMP completes for each org:
PTA_TERM_DELTA_EXPORT(
    p_directory   => p_directory,
    p_org         => v_orgs(i),
    p_date        => p_date,
    p_weeks_back  => 4,
    p_destination => p_destination
);
```

---

## 9. Files to Create / Modify

| Action | File | Description |
|--------|------|-------------|
| **CREATE** | `LCD-Oracle/SQL/PTA_TERM_DELTA_EXPORT.sql` | New standalone procedure |
| Optional | `LCD-Oracle/SQL/emp termination 4.sql` | Add call to delta export after INTER file generation |

**No schema changes (DDL) required.** The procedure queries existing tables only.

---

## 10. Edge Cases

| Scenario | Behavior | Rationale |
|----------|----------|-----------|
| Worker terminated but has no adjustments | No records written for that worker | File may be empty or not created |
| Multiple adjustments for same worker/date/type | Summed into one delta line | `GROUP BY` + `SUM()` aggregation |
| Adjustment approved but delta = 0 | Skipped | `HAVING <> 0` filter |
| Worker has adjustments outside lookback window | Not included | `actual_date >= l_lookback_dt` filter |
| No terminated workers for org/date | File not created | `IF NOT l_file_opened` path — outputs message only |
| `BEF_LAB_UNITS` or `AFT_LAB_UNITS` is NULL | Treated as 0 | Should wrap with `NVL(..., 0)` — see Section 11 |
| Activity type changed but hours unchanged | Record skipped (delta = 0) | Correct — no payroll impact |

---

## 11. Defensive NULL Handling

Add `NVL` wrappers to protect against NULL unit values:

```sql
SUM(NVL(lmh.aft_lab_units, 0) - NVL(lmh.bef_lab_units, 0)) AS delta_hours
```

This is important because `ProcessEtesAdjustments.sql` already uses `NVL(rec.BEF_LAB_UNITS, 0)` and `NVL(rec.AFT_LAB_UNITS, 0)` when inserting — confirming NULLs are possible in source data.

---

## 12. Performance

| Aspect | Assessment |
|--------|------------|
| Terminated workers per org/date | Typically 0–5 |
| LABOR_MOD_HIST rows per worker (4 weeks) | Typically 0–20 |
| Total rows processed | < 100 per org |
| Indexes used | `LABOR_MOD_HIST(ORG_CODE, LMH_WORKER_ID, ACTUAL_DATE)` |
| UTL_FILE writes | Negligible I/O |
| **Overall:** | Sub-second execution per org |

---

## 13. Compilation & Deployment

```sql
-- Step 1: Create the procedure
@LCD-Oracle/SQL/PTA_TERM_DELTA_EXPORT.sql

-- Step 2: Verify
SELECT object_name, status
  FROM user_objects
 WHERE object_name = 'PTA_TERM_DELTA_EXPORT'
   AND object_type = 'PROCEDURE';
-- Expected: VALID

-- Step 3: Grant execute (if needed for ITES schema)
GRANT EXECUTE ON PTA_TERM_DELTA_EXPORT TO ITES;

-- Step 4: Test run
BEGIN
    PTA_TERM_DELTA_EXPORT(
        p_directory => 'LCD_EXPORT_DIR',  -- your UTL_FILE directory object
        p_org       => '664',
        p_date      => '20260520',
        p_weeks_back => 4
    );
END;
/
```

---

## 14. Rollback

1. Drop the procedure: `DROP PROCEDURE PTA_TERM_DELTA_EXPORT;`
2. Remove any scheduler job entries referencing it
3. No data impact — procedure is read-only against LCD tables

---

## 15. Test Plan

### 15.1 Unit Tests

| # | Test | Expected |
|---|------|----------|
| 1 | Procedure compiles | `user_objects` shows VALID |
| 2 | Run for org with no terminations | No file created; DBMS_OUTPUT message |
| 3 | Run for org with termination but no adjustments | No file created |
| 4 | Run for worker with adjustment: 9→6 on code 1010 | Line shows `-3.00` for type `1010` |
| 5 | Run for worker with adjustment: 0→4 on code 1020 | Line shows `4.00` for type `1020` |
| 6 | Multiple adjustments same worker/date/type | Single line with summed delta |
| 7 | Adjustment with delta = 0 | No line written |
| 8 | File format matches T-file column positions | Compare character positions with `T{YYMMDD}.{ORG}` |
| 9 | NULL `AFT_LAB_UNITS` in LABOR_MOD_HIST | Handled gracefully (treated as 0) |
| 10 | `p_weeks_back = 0` | Only current week adjustments |

### 15.2 Integration Tests

| # | Test | Expected |
|---|------|----------|
| 11 | Run both `FINAL_PTA_TERMINATED_EMP` and `PTA_TERM_DELTA_EXPORT` for same org/date | Both files produced; same worker set |
| 12 | Verify PTADELTA file workers ⊆ INTER file workers | All worker_ids in delta file also appear in INTER file |
| 13 | Downstream parser accepts PTADELTA file | Same format as T-file; no parser errors |

### 15.3 Verification Query

```sql
-- Preview delta output without writing file
WITH term_workers AS (
    SELECT w.worker_id, w.worker_ssn
      FROM lcd.worker w
      JOIN lcd.worker_hist h
        ON h.org_code = w.org_code AND h.worker_id = w.worker_id
       AND h.actual_date = (SELECT MAX(h2.actual_date)
                              FROM lcd.worker_hist h2
                             WHERE h2.org_code = w.org_code
                               AND h2.worker_id = w.worker_id)
     WHERE w.org_code = :org
       AND w.termination_date >= TO_DATE(:run_date,'YYYYMMDD')
       AND w.termination_date <  TO_DATE(:run_date,'YYYYMMDD') + 1
       AND h.employment_status = '3'
)
SELECT lmh.lmh_worker_id AS worker_id,
       tw.worker_ssn,
       lmh.actual_date,
       NVL(RTRIM(lmh.aft_att_type), RTRIM(lmh.bef_att_type)) AS time_type,
       lmh.bef_lab_units,
       lmh.aft_lab_units,
       (NVL(lmh.aft_lab_units,0) - NVL(lmh.bef_lab_units,0)) AS delta_hours
  FROM lcd.labor_mod_hist lmh
  JOIN term_workers tw ON tw.worker_id = lmh.lmh_worker_id
 WHERE lmh.org_code = :org
   AND lmh.lmh_aprv_ind = 'A'
   AND lmh.actual_date >= NEXT_DAY(TO_DATE(:run_date,'YYYYMMDD') - 1, 'FRIDAY') - 28
   AND lmh.actual_date <= NEXT_DAY(TO_DATE(:run_date,'YYYYMMDD') - 1, 'FRIDAY')
 ORDER BY lmh.lmh_worker_id, lmh.actual_date;
```

---

## 16. Open Questions

| # | Question | Recommendation |
|---|----------|----------------|
| 1 | **Schema ownership** — Should procedure live in LCD or ITES schema? | LCD schema (same as LABOR_MOD_HIST owner). Grant EXECUTE to ITES if needed for scheduler. |
| 2 | **Lookback window** — Should it be parameterized or fixed at 4 weeks? | Parameterized (default 4) for flexibility. |
| 3 | **Approval date filter** — Include only adjustments approved since last run? | Not for v1. Use `actual_date` window only. Can add `mod_aprvl_date` filter in v2 if needed. |
| 4 | **Activity type changes** — Should type-change-only adjustments (0 delta) produce output? | No — only hour deltas matter for payroll. |
| 5 | **Multi-org wrapper** — Should it loop through all 11 orgs like `FINAL_PTA_TERMINATED_EMP`? | Yes for production. Single-org signature allows per-org testing. Add a wrapper procedure or call from existing term job loop. |
| 6 | **File naming** — `PTADELTA` prefix acceptable? Or should it append to existing INTER file? | Separate file recommended. Keeps INTER format unchanged; avoids breaking existing consumers. |

---

## 17. Summary

| Item | Status |
|------|--------|
| Data source identified | **LCD.LABOR_MOD_HIST** — confirmed available with before/after hours |
| Delta calculation | `AFT_LAB_UNITS - BEF_LAB_UNITS` — confirmed from LABINT.SQL patterns |
| Output format | Matches T-file (p_write_gems) exactly — 10+10+10+4+10+3+60 characters |
| Worker identification | Same criteria as INTER file (terminated + status Active) |
| Schema changes required | **None** — standalone procedure, no new tables |
| Risk level | **Low** — read-only queries, new file output, no modification of existing processes |
| Estimated effort | 1 procedure file + testing |
