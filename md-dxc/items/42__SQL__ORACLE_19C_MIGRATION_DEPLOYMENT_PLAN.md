# LCD-Oracle: Oracle 11g → 19c Migration — Deployment Plan

**Author:** RdW  
**Date:** 5/24/2026  
**Environment:** UAT (Q22S / Oracle 19c)  
**Patched files:** `tasks/42/patched/`  
**Originals:** `tasks/42/originals/`

---

## 1. Pre-Deployment Checklist

Complete all items before running any SQL scripts.

| # | Check | Command | Expected Result |
|---|-------|---------|-----------------|
| 1 | Confirm Oracle version is 19c | `SELECT banner FROM v$version;` | Contains `19c` |
| 2 | Confirm DIRECTORY objects exist | `SELECT directory_name, directory_path FROM all_directories WHERE directory_name LIKE 'LCD%' ORDER BY 1;` | All entries from `DB_DIRECTORIES.txt` (UAT section) present |
| 3 | Confirm filesystem paths are mounted | (DBA) `ls -la /csclcdnc0002/Q22S/` on Linux server | Directories exist and accessible |
| 4 | Take schema backup | `expdp LCD/<pwd> schemas=LCD dumpfile=lcd_pre19c_backup_%U.dmp logfile=lcd_pre19c_backup.log` | Export completes with no errors |
| 5 | Confirm SYS/DBA access for grants | `SELECT granted_role FROM dba_role_privs WHERE grantee = USER;` (run as grants user) | `DBA` or `GRANT ANY DIRECTORY` present |
| 6 | Enable DBMS_OUTPUT | `SET SERVEROUTPUT ON SIZE UNLIMITED;` | Output enabled for all sessions |

---

## 2. Deployment Order

> **Critical**: compile in this exact sequence. Later steps depend on earlier ones.

---

### Step 0 — DBA: Grant Directory Access (run as SYS or DBA)

**File:** `patched/SQL/GRANT_DIRECTORY_ACCESS.sql`

```sql
-- Run as SYS or a DBA user:
@patched/SQL/GRANT_DIRECTORY_ACCESS.sql
```

**Expected result:** No errors. Each `GRANT` completes silently.

**Verify:**
```sql
SELECT directory_name, privilege, grantee
  FROM all_tab_privs
 WHERE grantee = 'LCD'
   AND type    = 'DIRECTORY'
 ORDER BY directory_name, privilege;
```
Expected: one `READ` and one `WRITE` row per DIRECTORY object.

**Troubleshooting:**
- `ORA-01031: insufficient privileges` — run as SYS or grant `GRANT ANY DIRECTORY` to the executing user.
- `ORA-04043: object LCD_XXX does not exist` — the DBA has not yet created that DIRECTORY object. Run the corresponding `CREATE DIRECTORY` statement from `DB_DIRECTORIES.txt` first.

---

### Step 1 — Compile F_GET_19C_DIR_NAME (new helper function)

**File:** `patched/SQL/F_GET_19C_DIR_NAME.sql`

```sql
@patched/SQL/F_GET_19C_DIR_NAME.sql
SHOW ERRORS FUNCTION LCD.F_GET_19C_DIR_NAME
```

**Expected result:** `Function created.` / `No errors.`

**Verify:**
```sql
SELECT object_name, status FROM dba_objects
 WHERE owner='LCD' AND object_name='F_GET_19C_DIR_NAME';
```
Expected: `VALID`

**Quick smoke test:**
```sql
SET SERVEROUTPUT ON
SELECT lcd.f_get_19c_dir_name('/csclcdnc0002/Q22S/In') FROM dual;
-- Expected: LCD_IN

SELECT lcd.f_get_19c_dir_name('/nonexistent/path') FROM dual;
-- Expected: (null)
```

**Troubleshooting:**
- `ORA-00904: "ALL_DIRECTORIES": invalid identifier` — the executing user does not have SELECT on `ALL_DIRECTORIES`. Grant it: `GRANT SELECT ON ALL_DIRECTORIES TO LCD;` (run as SYS).
- Returns `NULL` for a valid path — check case: `SELECT directory_name, directory_path FROM all_directories WHERE UPPER(directory_path) LIKE '%Q22S%';`

---

### Step 2 — Compile Core Utility Functions (Tier 1)

Compile in this order; each depends on Step 1.

#### 2a. F_GET_LCD_OS_FILENAME
```sql
@patched/SQL/F_GET_LCD_OS_FILENAME.sql
SHOW ERRORS FUNCTION LCD.F_GET_LCD_OS_FILENAME
```
Expected: `Function created.` / `No errors.`

**Smoke test:**
```sql
SET SERVEROUTPUT ON
SELECT lcd.f_get_lcd_os_filename('010', NULL, 'IN', FALSE) FROM dual;
-- Expected: LCD_IN  (not a path string)

SELECT lcd.f_get_lcd_os_filename('114', NULL, 'IN', FALSE) FROM dual;
-- Expected: LCD_FEDERAL_IN
```

#### 2b. F_CHECK_LCD_OS_FILENAME
```sql
@patched/SQL/F_CHECK_LCD_OS_FILENAME.sql
SHOW ERRORS FUNCTION LCD.F_CHECK_LCD_OS_FILENAME
```
Expected: `Function created.` / `No errors.`

**Smoke test:**
```sql
DECLARE v BOOLEAN; BEGIN v := lcd.f_check_lcd_os_filename('010', NULL, 'IN', FALSE);
  IF v THEN DBMS_OUTPUT.PUT_LINE('TRUE'); ELSE DBMS_OUTPUT.PUT_LINE('FALSE'); END IF; END;
/
-- Expected: TRUE  (LCD_IN exists in ALL_DIRECTORIES)
```

#### 2c. FILEEXST (f_file_exist)
```sql
@patched/SQL/FILEEXST.SQL
SHOW ERRORS FUNCTION LCD.F_FILE_EXIST
```
Expected: `Function created.` / `No errors.`

#### 2d. FILECOPY (CopyFile package — spec then body)
```sql
@patched/SQL/FILECOPY.SQL
SHOW ERRORS PACKAGE LCD.COPYFILE
SHOW ERRORS PACKAGE BODY LCD.COPYFILE
```
Expected: `Package created.` + `Package body created.` / `No errors.`

#### 2e. GETFILE (GetFile package — spec then body)
```sql
@patched/SQL/GETFILE.SQL
SHOW ERRORS PACKAGE LCD.GETFILE
SHOW ERRORS PACKAGE BODY LCD.GETFILE
```
Expected: `Package created.` + `Package body created.` / `No errors.`

**Verify all Tier 1 valid:**
```sql
SELECT object_name, object_type, status FROM dba_objects
 WHERE owner='LCD'
   AND object_name IN ('F_GET_19C_DIR_NAME','F_GET_LCD_OS_FILENAME',
                       'F_CHECK_LCD_OS_FILENAME','F_FILE_EXIST','COPYFILE','GETFILE')
 ORDER BY object_name;
```
Expected: all rows show `VALID`.

---

### Step 3 — Compile SAP Atomic Group (deploy all three together)

> **All three must be compiled in the same session without errors before committing.**

```sql
@patched/SQL/Sap_Data_Load.prc
SHOW ERRORS PROCEDURE LCD.SAP_DATA_LOAD

@patched/SQL/Sap_Submit_Data_Load.prc
SHOW ERRORS PROCEDURE LCD.SAP_SUBMIT_DATA_LOAD

@patched/SQL/Sap_Auto_Load.prc
SHOW ERRORS PROCEDURE LCD.SAP_AUTO_LOAD
```
Expected: `Procedure created.` for each / `No errors.`

**Verify:**
```sql
SELECT object_name, status FROM dba_objects
 WHERE owner='LCD'
   AND object_name IN ('SAP_DATA_LOAD','SAP_SUBMIT_DATA_LOAD','SAP_AUTO_LOAD');
```
Expected: all `VALID`.

**Rollback if any step fails:** Recompile all three from `originals/SQL/` in the same order.

---

### Step 4 — Compile Extract/Feed Procedures (Tier 2)

Order within this step does not matter; compile in any sequence.

```sql
@patched/SQL/BeelineBusinessAreas.sql
@patched/SQL/BeelineDepartments.sql
@patched/SQL/TimeSheetExtractLCD.sql
@patched/SQL/Work_Order_Extract.sql
@patched/SQL/Alt_Work_Order_Extract.sql
@patched/SQL/NAUSD_SUBCON_FEED-proc.sql
@patched/SQL/USR11_SUBCON_FEED-proc.sql
```

After each: `SHOW ERRORS` and verify `No errors.`

**Verify all valid:**
```sql
SELECT object_name, status FROM dba_objects
 WHERE owner='LCD'
   AND object_name IN ('BEELINE_BUSINESS_AREAS','BEELINE_DEPARTMENTS',
                       'TIMESHEETEXTRACTLCD','WORK_ORDER_EXTRACT',
                       'ALT_WORK_ORDER_EXTRACT','NAUSD_SUBCON_FEED',
                       'USR11_SUBCON_FEED')
 ORDER BY object_name;
```

---

### Step 5 — WOA Scheduler Scripts

```sql
-- Step3: creates the lcd.lcdInterfaceRefresh procedure (uses DBMS_SCHEDULER per org)
@patched/SQL(WOA)/Step3_LCDInterface_Refresh.sql
SHOW ERRORS PROCEDURE LCD.LCDINTERFACEREFRESH

-- Step4: schedules the repeating 4-hour job
@patched/SQL(WOA)/Step4_LCDInterface_ScheduleRefresh.sql
```

**Verify scheduler job created:**
```sql
SELECT job_name, state, repeat_interval, last_run_duration
  FROM dba_scheduler_jobs
 WHERE owner='LCD' AND job_name LIKE 'LCD_INTERFACE%';
-- Expected: LCD_INTERFACE_REFRESH_4H with SCHEDULED or RUNNING state
```

**Verify no DBMS_JOB entries remain:**
```sql
SELECT COUNT(*) FROM dba_jobs WHERE schema_user='LCD';
-- Expected: 0
```

---

### Step 6 — Full Object Validity Check

Run after all steps complete:
```sql
SELECT object_name, object_type, status
  FROM dba_objects
 WHERE owner='LCD' AND status = 'INVALID'
 ORDER BY object_type, object_name;
-- Expected: 0 rows
```

If any objects remain `INVALID`, recompile their dependents:
```sql
EXEC DBMS_UTILITY.COMPILE_SCHEMA(schema => 'LCD', compile_all => FALSE);
```
Then re-check.

---

## 3. Rollback Procedure

If deployment fails at any step:

1. Stop — do not proceed to subsequent steps.
2. Recompile the failed step's original from `tasks/42/originals/` using the same compile command.
3. Recompile all previously-patched files that depend on the failed step (reverse dependency order: Tier 2 → Tier 1 → Tier 0).
4. Verify all objects are `VALID` before declaring rollback complete.
5. For DBMS_SCHEDULER jobs created in Step 5: `EXEC DBMS_SCHEDULER.DROP_JOB('LCD_INTERFACE_REFRESH_4H', force => TRUE);`

---

## 4. Post-Deployment Verification

Run these queries after a 24-hour period to confirm normal operation:

```sql
-- Confirm SAP Auto Load ran
SELECT org_code, job_name, job_status, date_completed, comments
  FROM lcd.job_table
 WHERE job_name = 'SAP_LOAD'
   AND date_completed > SYSDATE - 1
 ORDER BY date_completed DESC;

-- Confirm scheduler jobs ran without error
SELECT job_name, status, error#, additional_info
  FROM dba_scheduler_job_run_details
 WHERE owner = 'LCD'
   AND log_date > SYSTIMESTAMP - INTERVAL '1' DAY
 ORDER BY log_date DESC;

-- Confirm no UTL_FILE.INVALID_PATH errors in alert log
-- (DBA action: check alert_<SID>.log for ORA-29283 entries)
```
