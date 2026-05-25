# Patch Plan: Exclude PTA-Terminated Employees from Regular Time Export

**Date:** 2026-04-20  
**Revision:** 2.0 (incorporates critical fix from PATCH_REVIEW_ANALYSIS.md)  
**INC#:** XXXXX  
**Status:** Ready for implementation  

---

## 1. Problem Statement

Workers whose `TERMINATION_DATE` falls within the current export week are written to **two** independent GEMS-format files, producing duplicate records in downstream payroll:

| Process | Package | Output File | Selects Terminated? |
|---------|---------|-------------|:-------------------:|
| Regular Time Export | `LCD.TimeExport.export_gems` | `T{YYMMDD}.{ORG}` | **Yes** — no filter |
| Termination Job | `ITES.FINAL_PTA_TERMINATED_EMP` | `INTER{YYMMDD}.{ORG}` | **Yes** — only terminated + inactive |

**Goal:** Exclude PTA-terminated employees from `export_gems` output so they appear only in the `INTER` file.

---

## 2. Termination Criteria

The termination job (`terminatin job.sql`, lines 87–101) identifies a worker as "PTA-terminated for the current week" using **two** conditions:

```sql
-- Condition A: Termination date within the Sat–Fri export week
AND lw.TERMINATION_DATE IS NOT NULL
AND lw.TERMINATION_DATE >= (l_weekend_dt - 6)    -- Saturday
AND lw.TERMINATION_DATE <  (l_weekend_dt + 1)    -- day after Friday

-- Condition B: Latest worker history status is Inactive
AND lcdw.EMPLOYMENT_STATUS = '1'                  -- lcd.globals.empl_inactive
```

The `IT_LCDWORKER` materialized view resolves `EMPLOYMENT_STATUS` from the **latest** `LCD.WORKER_HIST` record (by `MAX(actual_date)`). Both conditions must match for the termination job to pick up the worker.

### Why Both Conditions Are Required

The PATCH_REVIEW_ANALYSIS.md (Finding 1, Critical) identified a **data loss scenario** if only Condition A is checked:

| Scenario | TERMINATION_DATE in week? | Latest EMPLOYMENT_STATUS | Termination Job picks up? | Must remain in regular export? |
|----------|:-------------------------:|:------------------------:|:-------------------------:|:------------------------------:|
| Fully terminated | Yes | `'1'` (Inactive) | **Yes** | **No** — exclude |
| Pending termination | Yes | `'3'` (Active) | **No** | **Yes** — keep |
| Not terminated | No / NULL | Any | No | Yes — keep |
| Past termination | Yes (old week) | `'1'` (Inactive) | No | Yes — keep |

A worker can have `TERMINATION_DATE` set during the week while their `WORKER_HIST` status is still `'3'` (Active). If we exclude them from the regular export, but the termination job skips them (status ≠ `'1'`), their time vanishes from **both** files. The `is_pta_terminated` function must check both conditions.

---

## 3. Design Approach

### 3.1 Loop-Level Guard (Not Cursor-Level Filter)

Add a new function `is_pta_terminated` and call it inside the `export_gems` WHILE loop to **skip the file write** while **preserving the `proc_stat_ind` UPDATE**.

**Why not modify the cursor?**
- The `proc_stat_ind` UPDATE (TIMEXPR2.SQL lines ~945–956) must still execute for terminated workers, transitioning records from `C/P/R` to `1/2/3`. If filtered out of the cursor, records stay in `C` status and reappear on every subsequent export.
- The cursor has a UNION branch for the NOTIMECARD path. Adding a subquery exclusion to both branches increases complexity and risk.

### 3.2 Function Placement

The function is added to the `LCD.TimeExport` package (spec + body), co-located with the existing `active_worker` and `emp_or_sub` helper functions. This follows the established pattern in the codebase.

---

## 4. Files to Modify

| File | Change | Lines |
|------|--------|------:|
| `LCD-Oracle/SQL/TIMEXPR1.SQL` | Add `is_pta_terminated` function declaration to package spec | After line ~121 |
| `LCD-Oracle/SQL/TIMEXPR2.SQL` | Add `is_pta_terminated` function body | After line ~764 (after `END Get_Genesis_Date`) |
| `LCD-Oracle/SQL/TIMEXPR2.SQL` | Wrap `p_write_gems` call with termination guard | Line ~933 |
| `LCD-Oracle/SQL/TIMEXPR2.SQL` | Wrap `p_write_no_timecard` call with termination guard | Line ~968 |

**Files NOT modified:**
- `TIMEXPR3.SQL` — entry-point wrapper; passes parameters through, no filtering logic
- `Globals_spec.sql` / `GLOBALS.SQL` — constants already defined (`empl_inactive = '1'`)
- `terminatin job.sql` — reference only; the ITES-side source of truth
- No DDL / schema changes

---

## 5. Detailed Code Changes

### 5.1 TIMEXPR1.SQL — Package Specification

**Insert after the `Get_Genesis_Date` declaration, before `export_gems`:**

```sql
   FUNCTION is_pta_terminated
            (P_ORG      IN LCD.WORKER.ORG_CODE%TYPE,
             P_W_ID     IN LCD.WORKER.WORKER_ID%TYPE,
             P_WEEK_END IN DATE)
         RETURN BOOLEAN;
```

**Context:**
```
   FUNCTION Get_Genesis_Date   (P_ORG    IN LCD.TIME_EXPORT.ORG_CODE%TYPE)
         RETURN DATE;

   <<<< INSERT HERE >>>>

   PROCEDURE  export_gems
                (P_ORG           IN LCD.TIME_EXPORT.ORG_CODE%TYPE, ...
```

---

### 5.2 TIMEXPR2.SQL — Function Body (Corrected)

**Insert after `END Get_Genesis_Date;`, before the `export_gems` comment block.**

This is the **corrected** version incorporating PATCH_REVIEW_ANALYSIS Finding 1. It joins `LCD.WORKER_HIST` to check `employment_status = '1'` (Inactive), mirroring the termination job exactly.

```sql
/* *************************************************************************
 *
 * FUNCTION is_pta_terminated
 *
 * Purpose:  Returns TRUE if a worker qualifies as "PTA-terminated for the
 *           current week" — meaning both:
 *             (A) LCD.WORKER.TERMINATION_DATE falls within the Sat–Fri
 *                 export week (P_WEEK_END - 6 .. P_WEEK_END), AND
 *             (B) the worker's latest LCD.WORKER_HIST record has
 *                 EMPLOYMENT_STATUS = '1' (Inactive).
 *
 *           These two conditions mirror ITES.FINAL_PTA_TERMINATED_EMP
 *           (terminatin job.sql lines 87–101) which uses the same criteria
 *           via the IT_LCDWORKER materialized view.
 *
 *           Workers matching both conditions are excluded from the regular
 *           GEMS time file because they are handled by the termination job.
 *           Workers matching only condition A (terminated date in week but
 *           still Active) are NOT excluded, preventing data loss.
 *
 * INC#XXXXX  2026-04-20
 ************************************************************************* */

FUNCTION is_pta_terminated
           (P_ORG      IN LCD.WORKER.ORG_CODE%TYPE,
            P_W_ID     IN LCD.WORKER.WORKER_ID%TYPE,
            P_WEEK_END IN DATE)
         RETURN BOOLEAN
IS

    l_term_date LCD.WORKER.TERMINATION_DATE%TYPE;

    CURSOR cur_term IS
    SELECT w.termination_date
      FROM lcd.worker w
      JOIN lcd.worker_hist h
        ON h.org_code   = w.org_code
       AND h.worker_id  = w.worker_id
       AND h.actual_date = (SELECT MAX(h2.actual_date)
                              FROM lcd.worker_hist h2
                             WHERE h2.org_code  = w.org_code
                               AND h2.worker_id = w.worker_id)
     WHERE w.org_code  = P_ORG
       AND w.worker_id = P_W_ID
       AND h.employment_status = lcd.globals.empl_inactive;   -- '1'

BEGIN

    OPEN cur_term;
    FETCH cur_term INTO l_term_date;
    CLOSE cur_term;

    IF l_term_date IS NOT NULL
       AND l_term_date >= (P_WEEK_END - 6)
       AND l_term_date <  (P_WEEK_END + 1)
    THEN
       RETURN TRUE;
    ELSE
       RETURN FALSE;
    END IF;

    EXCEPTION
       WHEN OTHERS THEN
          IF cur_term%ISOPEN THEN
             CLOSE cur_term;
          END IF;
          DBMS_OUTPUT.PUT_LINE(TO_CHAR(SQLCODE));
          DBMS_OUTPUT.PUT_LINE(SQLErrM);
          RAISE_APPLICATION_ERROR(-20001,
              'Error in is_pta_terminated. '||SUBSTR(SQLErrM,1,100));

END is_pta_terminated;
```

**Key difference from original plan:** The cursor now joins `LCD.WORKER_HIST` and filters on `h.employment_status = lcd.globals.empl_inactive` (`'1'`). If the worker's latest history record has any other status (e.g., `'3'` Active), the cursor returns no rows, `l_term_date` is NULL, and the function returns FALSE — keeping the worker in the regular export.

---

### 5.3 TIMEXPR2.SQL — Wrap `p_write_gems` Call (~Line 933)

**Current code:**
```sql
               IF rec_gems.hrs <> 0 THEN
                   p_write_gems (out_file,
				P_ORG,
				rec_gems,
				l_rec_written);
               END IF;
```

**New code:**
```sql
               IF rec_gems.hrs <> 0 THEN
                   IF NOT is_pta_terminated(P_ORG, rec_gems.wrk_id, week_end) THEN
                      p_write_gems (out_file,
				P_ORG,
				rec_gems,
				l_rec_written);
                   END IF;
               END IF;
```

**Critical invariant:** The `UPDATE lcd.time_export SET proc_stat_ind = DECODE(...)` block (lines ~945–956) is **below** this IF and is NOT wrapped. It continues to execute for ALL workers, including PTA-terminated ones, ensuring their `proc_stat_ind` transitions from `C/P/R` → `1/2/3`.

---

### 5.4 TIMEXPR2.SQL — Wrap `p_write_no_timecard` Call (~Line 968)

**Current code:**
```sql
                     IF active_worker(P_ORG, rec_gems.wrk_id, week_start_date) THEN

                        IF emp_or_sub(P_ORG, WEEK_START_DATE, rec_gems.wrk_id) = 'E'
                        ...
                        p_write_no_timecard
                                       (out_file,
                                        P_ORG,
                                        rec_gems.wrk_ssn,
                                        rec_gems.wrk_id,
                                        P_TIME_TYPE,
                                        WEEK_START_DATE,
                                        MONDAY_DATE,
                                        l_rec_written);
                     END IF;
```

**New code:**
```sql
                     IF active_worker(P_ORG, rec_gems.wrk_id, week_start_date) THEN
                      IF NOT is_pta_terminated(P_ORG, rec_gems.wrk_id, week_end) THEN

                        IF emp_or_sub(P_ORG, WEEK_START_DATE, rec_gems.wrk_id) = 'E'
                        ...
                        p_write_no_timecard
                                       (out_file,
                                        P_ORG,
                                        rec_gems.wrk_ssn,
                                        rec_gems.wrk_id,
                                        P_TIME_TYPE,
                                        WEEK_START_DATE,
                                        MONDAY_DATE,
                                        l_rec_written);
                      END IF;
                     END IF;
```

**Note on `active_worker` interaction (PATCH_REVIEW Finding 4):** The existing `active_worker()` checks `employment_status = '3'` against **any** historical record, not just the latest. A worker with an older Active record and a newer Inactive record still passes `active_worker()`. Therefore the `is_pta_terminated` guard on this path is necessary and correctly placed.

---

## 6. How the Function Mirrors the Termination Job

| Aspect | `ITES.FINAL_PTA_TERMINATED_EMP` | `is_pta_terminated` (this patch) |
|--------|--------------------------------|----------------------------------|
| Termination date source | `WORKER@ITES_LCD.WORLD.TERMINATION_DATE` | `LCD.WORKER.TERMINATION_DATE` |
| Employment status source | `IT_LCDWORKER.EMPLOYMENT_STATUS` (MV from `LCD.WORKER_HIST`) | `LCD.WORKER_HIST.EMPLOYMENT_STATUS` (latest by `MAX(actual_date)`) |
| Date window | `>= (l_weekend_dt - 6)` AND `< (l_weekend_dt + 1)` | `>= (P_WEEK_END - 6)` AND `< (P_WEEK_END + 1)` |
| Status check | `= '1'` | `= lcd.globals.empl_inactive` (which is `'1'`) |
| Week-end resolution | `NEXT_DAY(l_run_date - 1, 'FRIDAY')` | `WEEK_START_DATE + 6` (passed into `export_gems`) |

The two queries are semantically equivalent: `IT_LCDWORKER` is a materialized view over `LCD.WORKER` + `LCD.WORKER_HIST` via the `@ITES_LCD.WORLD` DB link, and the function queries those same LCD tables directly.

---

## 7. Paths NOT Requiring Changes

| Path | File | Why No Change Needed |
|------|------|---------------------|
| `export_L1Visa` | TIMEXPR2.SQL | Already filters `EMPLOYMENT_STATUS = '3'` (Active) via L1Visa sub-group joins. Terminated/Inactive workers cannot pass this filter. |
| `LABINT` (SAP interface) | LABINT.SQL | Different data flow (`LCD.LABOR_INTERFACE`), different format, different purpose. Does not produce GEMS time files. |
| `TIMEXPR3.SQL` (entry point) | TIMEXPR3.SQL | Wrapper only — opens files, calls `export_gems`, closes files. Record count (`g_rec_written`) is incremented inside `p_write_gems`, which the patch correctly gates. Event log naturally reflects reduced count. |
| `Globals_spec.sql` | Globals_spec.sql | `empl_inactive = '1'` already defined at line 128. No new constants needed. |
| PowerBuilder client | Various .srw/.srf | Client-side code passes parameters to the server-side batch job. No termination logic lives here. |
| eTES Shim (.NET) | eTES.Shim.* | Separate COM shim layer for eTES web. Not involved in batch time export. |

---

## 8. Performance Analysis

The function executes **once per worker per export cycle** (inside the WHILE loop in `export_gems`).

**Query plan for `cur_term`:**
```sql
SELECT w.termination_date
  FROM lcd.worker w
  JOIN lcd.worker_hist h
    ON h.org_code = w.org_code AND h.worker_id = w.worker_id
   AND h.actual_date = (SELECT MAX(h2.actual_date) ...)
 WHERE w.org_code = P_ORG AND w.worker_id = P_W_ID
   AND h.employment_status = '1';
```

- `LCD.WORKER` is indexed on `(ORG_CODE, WORKER_ID)` — primary key lookup
- `LCD.WORKER_HIST` is indexed on `(ORG_CODE, WORKER_ID, ACTUAL_DATE)` — the `MAX(actual_date)` subquery uses the index efficiently
- For a typical org with ~500–2000 active workers, this adds ~500–2000 single-row lookups per export run
- Each lookup is a microsecond-level indexed fetch; total overhead is negligible relative to the `UTL_FILE.PUT_LINE` I/O and the existing `emp_or_sub()` cursor which already performs a similar `WORKER_HIST` query per worker

**Optimization note:** If future performance profiling shows this to be a concern, the function could be refactored to bulk-collect all PTA-terminated worker_ids into a PL/SQL associative array at the start of `export_gems` and do in-memory lookups. This is not warranted at current volumes.

---

## 9. Compilation & Deployment

### 9.1 Order

```sql
-- Step 1: Compile package spec
@LCD-Oracle/SQL/TIMEXPR1.SQL

-- Step 2: Compile package body
@LCD-Oracle/SQL/TIMEXPR2.SQL

-- Step 3: Verify
SELECT name, type, line, text
  FROM user_errors
 WHERE name = 'TIMEEXPORT'
 ORDER BY type, line;
-- Expected: 0 rows
```

### 9.2 Rollback

1. Recompile the **original** `TIMEXPR1.SQL` and `TIMEXPR2.SQL` from source control (pre-patch versions)
2. The `is_pta_terminated` function is automatically dropped when the old spec (which lacks the declaration) is compiled
3. No DDL to revert. No data migration needed.
4. Side effect of rollback: terminated workers reappear in regular time files (the current pre-patch behavior)

---

## 10. Test Plan

### 10.1 Compilation Verification

| # | Test | Expected |
|---|------|----------|
| 1 | Compile spec + body | `user_errors` for `TIMEEXPORT` returns 0 rows |
| 2 | Package validity | `SELECT status FROM user_objects WHERE object_name = 'TIMEEXPORT' AND object_type IN ('PACKAGE','PACKAGE BODY')` → both `VALID` |

### 10.2 Unit Tests — `is_pta_terminated` Function

| # | Input | Expected Return | Rationale |
|---|-------|:---------------:|-----------|
| 3 | `TERM_DATE` in week, latest status `'1'` (Inactive) | `TRUE` | Both conditions met — worker handled by termination job |
| 4 | `TERM_DATE` in week, latest status `'3'` (Active) | `FALSE` | Condition B fails — termination job won't pick up, must stay in regular export |
| 5 | `TERM_DATE IS NULL`, latest status `'3'` (Active) | `FALSE` | Condition A fails — normal active worker |
| 6 | `TERM_DATE` 3 weeks ago, latest status `'1'` (Inactive) | `FALSE` | Condition A fails — past termination outside current week window |
| 7 | `TERM_DATE` next week, latest status `'1'` (Inactive) | `FALSE` | Condition A fails — future termination |
| 8 | `TERM_DATE` = `P_WEEK_END - 6` (Saturday), status `'1'` | `TRUE` | Boundary — first day of window (inclusive) |
| 9 | `TERM_DATE` = `P_WEEK_END` (Friday), status `'1'` | `TRUE` | Boundary — last day of window (inclusive, since `< P_WEEK_END + 1`) |
| 10 | `TERM_DATE` = `P_WEEK_END + 1` (Saturday after), status `'1'` | `FALSE` | Boundary — one day past window |
| 11 | `TERM_DATE` = `P_WEEK_END - 7` (Friday before), status `'1'` | `FALSE` | Boundary — one day before window |

### 10.3 Integration Tests — `export_gems` Behavior

| # | Test Case | Expected Result |
|---|-----------|-----------------|
| 12 | PTA-terminated worker (both conditions met) | NOT in `T{YYMMDD}.{ORG}` file; `proc_stat_ind` updated `C` → `1` |
| 13 | Normal worker (`TERM_DATE IS NULL`) | Still in file — no behavior change |
| 14 | Worker with `TERM_DATE` in week but status `'3'` | **Still in file** — protected from data loss |
| 15 | No-timecard path for PTA-terminated worker | `p_write_no_timecard` NOT called |
| 16 | No-timecard path for normal worker | `p_write_no_timecard` called as before |
| 17 | Run termination job + regular export for same org/week | Zero duplicate `worker_id` values across `INTER*.{ORG}` and `T*.{ORG}` files |

### 10.4 Verification SQL

```sql
-- Count workers that WILL be excluded for org :org, week ending :week_end
SELECT COUNT(DISTINCT w.worker_id) AS excluded_count
  FROM lcd.worker w
  JOIN lcd.worker_hist h
    ON h.org_code  = w.org_code
   AND h.worker_id = w.worker_id
   AND h.actual_date = (SELECT MAX(h2.actual_date)
                          FROM lcd.worker_hist h2
                         WHERE h2.org_code  = w.org_code
                           AND h2.worker_id = w.worker_id)
  JOIN lcd.time_export t
    ON t.worker_id = w.worker_id
   AND t.org_code  = w.org_code
 WHERE w.org_code = :org
   AND t.week_end_date = :week_end
   AND t.proc_stat_ind IN ('C','P','R')
   AND w.termination_date IS NOT NULL
   AND w.termination_date >= (:week_end - 6)
   AND w.termination_date <  (:week_end + 1)
   AND h.employment_status = lcd.globals.empl_inactive;

-- Compare: workers with TERM_DATE in week but still Active (should NOT be excluded)
SELECT w.worker_id, w.termination_date, h.employment_status
  FROM lcd.worker w
  JOIN lcd.worker_hist h
    ON h.org_code  = w.org_code
   AND h.worker_id = w.worker_id
   AND h.actual_date = (SELECT MAX(h2.actual_date)
                          FROM lcd.worker_hist h2
                         WHERE h2.org_code  = w.org_code
                           AND h2.worker_id = w.worker_id)
 WHERE w.org_code = :org
   AND w.termination_date IS NOT NULL
   AND w.termination_date >= (:week_end - 6)
   AND w.termination_date <  (:week_end + 1)
   AND h.employment_status <> lcd.globals.empl_inactive;
-- Expected: these workers REMAIN in the regular export
```

---

## 11. Open Questions / Decisions

| # | Question | Recommendation | Impact if Deferred |
|---|----------|----------------|-------------------|
| 1 | **Audit logging** — Should skipped records be counted and written to `LCD.EVENT_LOG`? | Yes — add `l_pta_skipped NUMBER := 0` counter in `export_gems`, increment when `is_pta_terminated` returns TRUE, append to the existing event log posting alongside `l_rec_written`. | Low functional risk. Aids troubleshooting. |
| 2 | **Org scope** — The termination job hardcodes 11 orgs. Should `is_pta_terminated` apply only to those, or universally? | **Universal.** The `TERMINATION_DATE` + `EMPLOYMENT_STATUS` check is generic and safe. If an org doesn't use the termination job, the function simply returns FALSE (no terminations in week), causing zero behavioral change. Hardcoding org codes would add maintenance burden. | Low — universal is more defensive. |
| 3 | **INC ticket number** — Placeholder `INC#XXXXX` in code comments. | Assign before deployment. | None — cosmetic. |

---

## 12. Summary of Changes from Original Plan

| Aspect | Original Plan (v1.0) | This Plan (v2.0) |
|--------|---------------------|-------------------|
| `is_pta_terminated` cursor | Queries `LCD.WORKER` only (termination date check) | Joins `LCD.WORKER` + `LCD.WORKER_HIST`, checks `employment_status = lcd.globals.empl_inactive` |
| Data loss risk | **Present** — workers with Active status + term date in week excluded from both files | **Eliminated** — function returns FALSE unless status is Inactive |
| Guard placement | Same: loop-level in `export_gems`, wrapping `p_write_gems` and `p_write_no_timecard` | Same — no change |
| `proc_stat_ind` UPDATE | Same: NOT wrapped, always executes | Same — no change |
| Files modified | Same: TIMEXPR1.SQL (spec) + TIMEXPR2.SQL (body) | Same — no change |
| Spec declaration | Same | Same |
| Test plan | 10 test cases | 17 test cases (added boundary tests, Active-status protection test) |
