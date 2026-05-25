# Oracle 19c Migration — Server-Side Deployment Plan
## LCD Q22S UAT Environment | PowerBuilder GUI / SS Backend

**Author:** RdW  
**Date:** 5/24/2026  
**Environment:** Oracle 19c UAT (Q22S instance) — Linux shared drive `/csclcdnc0002/Q22S*`  
**Deployment Root:** `tasks/42/pb_gui_analysis/powerbuilder-ss-backend/patched/`

---

## Prerequisites Checklist

Before executing any deployment steps, confirm the following:

| # | Prerequisite | Who | Status |
|---|---|---|---|
| P1 | Oracle 19c UAT instance is running and accessible via SQL Developer | DBA | ☐ |
| P2 | LCD schema password and connect string available | DBA | ☐ |
| P3 | All DB DIRECTORY objects listed in DB_DIRECTORIES.txt (UAT section) are created | DBA | ☐ |
| P4 | READ and WRITE privileges on all DIRECTORY objects granted to LCD schema | DBA | ☐ |
| P5 | Oracle AQ queue table and queue created (see Phase 1A script below) | DBA | ☐ |
| P6 | `LCD_ITES` database link re-created in 19c | DBA | ☐ |
| P7 | `pwdverify.DICTIONARY` schema either migrated or confirmed absent (graceful fallback active) | DBA | ☐ |
| P8 | All Linux filesystem paths under `/csclcdnc0002/Q22S*` are mounted and accessible | SysAdmin | ☐ |
| P9 | SQL Developer 21.4+ connected to 19c UAT with SERVEROUTPUT ON | Dev | ☐ |
| P10 | Backup of LCD schema objects taken via `expdp` before deployment | DBA | ☐ |

---

## Step 0 — DBA Pre-Deployment Actions

### Step 0.1 — Verify DB DIRECTORY Objects

Run in SQL Developer or SQL*Plus as DBA:

```sql
-- Expected: all 33 directory objects from DB_DIRECTORIES.txt (UAT) should be present
SELECT DIRECTORY_NAME, DIRECTORY_PATH
  FROM ALL_DIRECTORIES
 WHERE DIRECTORY_NAME LIKE 'LCD%'
 ORDER BY DIRECTORY_NAME;
```

**Expected results** (UAT Q22S):

| DIRECTORY_NAME | DIRECTORY_PATH |
|---|---|
| LCD | /csclcdnc0002/Q22S |
| LCD_ARCH | /csclcdnc0002/Q22S/Archive |
| LCD_ARCH_IN | /csclcdnc0002/Q22S/Archive/In |
| LCD_ARCH_OUT | /csclcdnc0002/Q22S/Archive/Out |
| LCD_CANADA_ARCH | /csclcdnc0002/Q22S-CANADA/ARCHIVE |
| LCD_CANADA_ARCH_IN | /csclcdnc0002/Q22S-CANADA/ARCHIVE/IN |
| LCD_CANADA_ARCH_OUT | /csclcdnc0002/Q22S-CANADA/ARCHIVE/OUT |
| LCD_CANADA_IN | /csclcdnc0002/Q22S-CANADA/IN |
| LCD_CANADA_OUT | /csclcdnc0002/Q22S-CANADA/OUT |
| LCD_FEDERAL_ARCH | /csclcdnc0002/Q22S-FEDERAL/ARCHIVE |
| LCD_FEDERAL_ARCH_IN | /csclcdnc0002/Q22S-FEDERAL/ARCHIVE/IN |
| LCD_FEDERAL_ARCH_OUT | /csclcdnc0002/Q22S-FEDERAL/ARCHIVE/OUT |
| LCD_FEDERAL_IN | /csclcdnc0002/Q22S-FEDERAL/IN |
| LCD_FEDERAL_OUT | /csclcdnc0002/Q22S-FEDERAL/OUT |
| LCD_IN | /csclcdnc0002/Q22S/In |
| LCD_OUT | /csclcdnc0002/Q22S/Out |
| LCD_149 | /csclcdnc0002/Q22S-149 |
| LCD_149_ARCH | /csclcdnc0002/Q22S-149/ARCHIVE |
| LCD_149_ARCH_IN | /csclcdnc0002/Q22S-149/ARCHIVE/IN |
| LCD_149_ARCH_OUT | /csclcdnc0002/Q22S-149/ARCHIVE/OUT |
| LCD_149_IN | /csclcdnc0002/Q22S-149/IN |
| LCD_149_OUT | /csclcdnc0002/Q22S-149/OUT |
| LCD_285_ARCH | /csclcdnc0002/Q22S-285/ARCHIVE |
| LCD_285_ARCH_IN | /csclcdnc0002/Q22S-285/ARCHIVE/IN |
| LCD_285_ARCH_OUT | /csclcdnc0002/Q22S-285/ARCHIVE/OUT |
| LCD_285_IN | /csclcdnc0002/Q22S-285/IN |
| LCD_285_OUT | /csclcdnc0002/Q22S-285/OUT |
| LCD_663 | /csclcdnc0002/Q22S-663 |
| LCD_663_ARCH | /csclcdnc0002/Q22S-663/ARCHIVE |
| LCD_663_ARCH_IN | /csclcdnc0002/Q22S-663/ARCHIVE/IN |
| LCD_663_ARCH_OUT | /csclcdnc0002/Q22S-663/ARCHIVE/OUT |
| LCD_663_IN | /csclcdnc0002/Q22S-663/IN |
| LCD_663_OUT | /csclcdnc0002/Q22S-663/OUT |

**If any are missing:** DBA must create them:
```sql
CREATE OR REPLACE DIRECTORY LCD_IN AS '/csclcdnc0002/Q22S/In';
GRANT READ, WRITE ON DIRECTORY LCD_IN TO LCD;
-- (repeat for each missing directory)
```

**Troubleshooting:** If `CREATE DIRECTORY` fails with ORA-01031, the account running it must have `CREATE ANY DIRECTORY` privilege.

---

### Step 0.2 — Grant DIRECTORY Privileges to LCD

```sql
-- Run as DBA — grant READ and WRITE on all LCD directories to LCD schema
BEGIN
  FOR d IN (SELECT DIRECTORY_NAME FROM ALL_DIRECTORIES WHERE DIRECTORY_NAME LIKE 'LCD%') LOOP
    EXECUTE IMMEDIATE 'GRANT READ, WRITE ON DIRECTORY ' || d.DIRECTORY_NAME || ' TO LCD';
  END LOOP;
END;
/
```

**Expected:** No errors. Verify:
```sql
SELECT GRANTEE, PRIVILEGE, DIRECTORY_NAME
  FROM DBA_TAB_PRIVS
 WHERE GRANTEE = 'LCD' AND TABLE_NAME LIKE 'LCD%'
 ORDER BY TABLE_NAME;
```

---

### Step 0.3 — Create Oracle AQ Infrastructure (RISK-SS-01)

Run as DBA or a user with `AQADM` role:

```sql
-- Step 0.3a: Create queue table
BEGIN
  DBMS_AQADM.CREATE_QUEUE_TABLE(
    queue_table        => 'LCD.LCD_BATCH_Q_TABLE',
    queue_payload_type => 'SYS.AQ$_JMS_TEXT_MESSAGE',
    sort_list          => 'ENQ_TIME',
    multiple_consumers => FALSE,
    comment            => 'LCD Batch IPC queue table — replaces DBMS_PIPE (Oracle 19c migration)'
  );
END;
/

-- Step 0.3b: Create the queue
BEGIN
  DBMS_AQADM.CREATE_QUEUE(
    queue_name  => 'LCD.LCD_BATCH_QUEUE',
    queue_table => 'LCD.LCD_BATCH_Q_TABLE',
    max_retries => 5,
    retry_delay => 5,
    comment     => 'LCD Batch status queue — replaces DBMS_PIPE'
  );
END;
/

-- Step 0.3c: Start the queue
BEGIN
  DBMS_AQADM.START_QUEUE(queue_name => 'LCD.LCD_BATCH_QUEUE');
END;
/

-- Step 0.3d: Grant enqueue/dequeue to LCD
GRANT ENQUEUE ON LCD.LCD_BATCH_QUEUE TO LCD;
GRANT DEQUEUE ON LCD.LCD_BATCH_QUEUE TO LCD;
```

**Expected:** No errors.  
**Verify:**
```sql
SELECT QUEUE_TABLE, QUEUE_NAME, QUEUE_TYPE, ENQUEUE_ENABLED, DEQUEUE_ENABLED
  FROM USER_QUEUES
 WHERE QUEUE_NAME = 'LCD_BATCH_QUEUE';
-- Expected: ENQUEUE_ENABLED=YES, DEQUEUE_ENABLED=YES
```

**Troubleshooting:**  
- If `DBMS_AQADM.CREATE_QUEUE_TABLE` fails with `ORA-24002`: queue table already exists — skip and proceed to 0.3b.
- If `DBMS_AQADM.CREATE_QUEUE` fails with `ORA-24001`: queue already exists — run `DBMS_AQADM.START_QUEUE` only.
- If queue start fails: check that `AQ_TM_PROCESSES > 0` in the init.ora parameters.

---

### Step 0.4 — Recreate LCD_ITES Database Link (RISK-SS-08)

```sql
-- Run as LCD schema owner (or DBA with CREATE DATABASE LINK privilege)
-- Replace placeholders with actual ITES 19c credentials
CREATE DATABASE LINK LCD_ITES
  CONNECT TO <ites_user> IDENTIFIED BY <ites_password>
  USING '<ites_tns_alias>';

-- Verify
SELECT * FROM DUAL@LCD_ITES;
-- Expected: 'X' returned without error
```

**Troubleshooting:**  
- If `ORA-12154`: TNS alias not found — add entry to `tnsnames.ora` on the 19c server.
- If `ORA-02085`: DB link connects to a different database — verify ITES is Oracle 12c+. Cross-version links from 19c to 11g are unsupported.
- If credentials unknown: coordinate with ITES DBA team.

---

## Step 1 — Deploy Package Specifications (Compile Phase 1)

All package specs must be compiled before their bodies. Open SQL Developer Worksheet connected to Q22S as LCD.

```sql
SET SERVEROUTPUT ON SIZE UNLIMITED;
```

### Step 1.1 — Globals_spec.sql

```sql
@<path>\patched\Globals_spec.sql
SHOW ERRORS PACKAGE LCD.GLOBALS;
```

**Expected result:** `Package created. No errors.`  
**Troubleshooting:** If `ORA-00903` (invalid table name) on a `%TYPE` anchor: the referenced table does not exist in 19c. Check `ALL_TABLES WHERE OWNER='LCD'`.

### Step 1.2 — PKG_DIST.SQL (Package Spec)

```sql
@<path>\patched\PKG_DIST.SQL
SHOW ERRORS PACKAGE LCD.PKG_DISTRIBUTION;
```

**Expected result:** `Package created. No errors.`

### Step 1.3 — PAYEDIT.SQL (Package Spec)

```sql
@<path>\patched\PAYEDIT.SQL
SHOW ERRORS PACKAGE LCD.PAY_EDIT;
```

**Expected result:** `Package created. No errors.`  
**Troubleshooting:** If `ORA-01858` on the `TO_DATE` default: verify the format mask `'YYYYMMDD'` is used (not the old `'DD-MON-YY'`).

### Step 1.4 — BATCH1.SQL (Package Spec)

```sql
@<path>\patched\BATCH1.SQL
SHOW ERRORS PACKAGE LCD.LCDBATCH;
```

**Expected result:** `Package created. No errors.`

### Step 1.5 — TIMEPR1.SQL (Package Spec or header)

```sql
@<path>\patched\TIMEPR1.SQL
SHOW ERRORS;
```

**Expected result:** No errors.

---

## Step 2 — Deploy Package Bodies (Compile Phase 2)

### Step 2.1 — Globals_body.sql

```sql
@<path>\LCD-Oracle\SQL\Globals_body.sql
SHOW ERRORS PACKAGE BODY LCD.GLOBALS;
```

**Note:** Globals_body.sql is not in the patched set (no changes required to the body). If it fails to compile because the spec changed, check that `get_start_default` and `get_end_default` functions still match the spec.

### Step 2.2 — PKGBDIST.SQL (Package Body for PKG_DISTRIBUTION)

```sql
@<path>\patched\PKGBDIST.SQL
SHOW ERRORS PACKAGE BODY LCD.PKG_DISTRIBUTION;
```

**Expected result:** `Package body created. No errors.`  
**Troubleshooting:**  
- If `ORA-00942` on a cursor: table name may have changed in 19c schema. Run `SELECT TABLE_NAME FROM ALL_TABLES WHERE OWNER='LCD'` to confirm.
- If `ORA-01799`: an `(+)` join was missed — search the file for remaining `(+)` occurrences.

### Step 2.3 — PAYEDIT2.SQL (Package Body for PAY_EDIT)

```sql
@<path>\patched\PAYEDIT2.SQL
SHOW ERRORS PACKAGE BODY LCD.PAY_EDIT;
```

**Expected result:** `Package body created. No errors.`  
**Troubleshooting:**  
- If `ORA-00904`: column `SAL_CURNCY_IND` — verify WORKER table exists and has this column.
- If `ORA-04021`: lock timeout — another session holds the package lock; disconnect idle sessions.

### Step 2.4 — TIMEEDIT.SQL

```sql
@<path>\patched\TIMEEDIT.SQL
SHOW ERRORS;
```

### Step 2.5 — TIMEEDIT_extended.SQL

```sql
@<path>\patched\TIMEEDIT_extended.SQL
SHOW ERRORS;
```

**Verify GOTO removal:**
```sql
SELECT TEXT FROM ALL_SOURCE
 WHERE OWNER='LCD' AND TYPE IN ('PROCEDURE','PACKAGE BODY') AND NAME LIKE '%TIMEEDIT%'
   AND UPPER(TEXT) LIKE '%GOTO%';
-- Expected: no rows returned
```

---

## Step 3 — Deploy Standalone Functions and Procedures

### Step 3.1 — Change_Password.sql

```sql
@<path>\patched\Change_Password.sql
SHOW ERRORS FUNCTION LCD.CHANGE_PASSWORD;
```

**Expected result:** `Function created. No errors.`  
**Verify AUTHID clause:**
```sql
SELECT AUTHID FROM ALL_PROCEDURES WHERE OWNER='LCD' AND OBJECT_NAME='CHANGE_PASSWORD';
-- Expected: CURRENT_USER
```

### Step 3.2 — Verify_Function.fun

```sql
@<path>\patched\Verify_Function.fun
SHOW ERRORS FUNCTION LCD.VERIFY_FUNCTION;
```

### Step 3.3 — p_copy_tables.SQL

```sql
@<path>\patched\p_copy_tables.SQL
SHOW ERRORS PROCEDURE LCD.P_COPY_TABLES;
```

**Verify V7 constant removed:**
```sql
SELECT TEXT FROM ALL_SOURCE WHERE OWNER='LCD' AND NAME='P_COPY_TABLES'
 AND UPPER(TEXT) LIKE '%DBMS_SQL.V7%';
-- Expected: no rows returned
```

### Step 3.4 — f_recalculate_labor.fun

```sql
@<path>\patched\f_recalculate_labor.fun
SHOW ERRORS FUNCTION LCD.F_RECALCULATE_LABOR;
```

**Verify no (+) joins remain:**
```sql
SELECT TEXT FROM ALL_SOURCE WHERE OWNER='LCD' AND NAME='F_RECALCULATE_LABOR'
 AND TEXT LIKE '%(+)%';
-- Expected: no rows returned
```

### Step 3.5 — 10g_packages.sql

This is a large file containing multiple package bodies. Run and check for errors at the end:

```sql
@<path>\patched\10g_packages.sql
SHOW ERRORS;
```

**Expected:** Multiple "Package body created" messages with no errors.

**Verify f_get_directory_name exists:**
```sql
SELECT OBJECT_NAME, STATUS FROM ALL_OBJECTS WHERE OWNER='LCD' AND OBJECT_NAME='F_OPEN_IN_FILE';
-- Note: this may be a member of a package body; check via ALL_SOURCE if needed
```

### Step 3.6 — AddPayImp.sql

```sql
@<path>\patched\AddPayImp.sql
SHOW ERRORS;
```

---

## Step 4 — Deploy Job Scheduler Script

### Step 4.1 — Remove Old DBMS_JOB Entry (DBA)

First, find the old job number:
```sql
-- Run as DBA or user with DBA_JOBS access
SELECT JOB, WHAT, NEXT_DATE, INTERVAL FROM DBA_JOBS
 WHERE UPPER(WHAT) LIKE '%WEEKLY_NPS_EXTRACT%';
```

If found, remove it:
```sql
BEGIN
  DBMS_JOB.REMOVE(<job_number_from_above>);
  COMMIT;
END;
/
```

### Step 4.2 — Create DBMS_SCHEDULER Job

```sql
@<path>\patched\NPS_Departments_Job_Scheduler - FOR Q22.sql
```

**Verify:**
```sql
SELECT JOB_NAME, STATE, ENABLED, LAST_START_DATE, NEXT_RUN_DATE
  FROM USER_SCHEDULER_JOBS
 WHERE JOB_NAME = 'WEEKLY_NPS_EXTRACT_Q22_JOB';
-- Expected: STATE=SCHEDULED, ENABLED=TRUE
```

**Troubleshooting:**  
- If `ORA-27486`: insufficient privileges — DBA must grant `CREATE JOB` to LCD schema.
- If job is DISABLED: `EXEC DBMS_SCHEDULER.ENABLE('LCD.WEEKLY_NPS_EXTRACT_Q22_JOB');`

---

## Step 5 — Post-Deployment Verification

### Step 5.1 — Compile Status Check

```sql
-- Verify no LCD package or procedure is INVALID
SELECT OBJECT_NAME, OBJECT_TYPE, STATUS, LAST_DDL_TIME
  FROM ALL_OBJECTS
 WHERE OWNER = 'LCD'
   AND STATUS = 'INVALID'
 ORDER BY OBJECT_TYPE, OBJECT_NAME;
-- Expected: no rows returned
```

If invalid objects are found, recompile:
```sql
EXEC UTL_RECOMP.RECOMP_SERIAL('LCD');
-- Then re-check the above query
```

### Step 5.2 — UTL_FILE Directory Resolution Smoke Test

Run the following in SQL Developer Worksheet with SERVEROUTPUT ON:

```sql
-- Test directory lookup for org 010 (maps to LCD_IN)
DECLARE
  l_handle UTL_FILE.FILE_TYPE;
  l_result BOOLEAN;
BEGIN
  l_result := lcd.f_open_in_file('010', 'test_probe.txt', l_handle);
  -- Expect: [DEBUG] UTL_FILE.FOPEN dir_obj=[LCD_IN] in DBMS_OUTPUT
  -- l_result will be FALSE since test file doesn't exist — that's OK
  DBMS_OUTPUT.PUT_LINE('Result: ' || CASE WHEN l_result THEN 'TRUE' ELSE 'FALSE' END);
END;
/
```

**Expected DBMS_OUTPUT:**  
```
-- [DEBUG] UTL_FILE.FOPEN dir_obj=[LCD_IN] file=[test_probe.txt]
Result: FALSE
```

If `ORA-29280 (invalid directory path)`: the directory object does not exist or was not granted.

### Step 5.3 — AQ Batch IPC Smoke Test

```sql
SET SERVEROUTPUT ON SIZE UNLIMITED;
DECLARE
  l_rc INTEGER;
BEGIN
  l_rc := lcd.lcdbatch.pipe_establish('010', 'DISTRIBUTION');
  DBMS_OUTPUT.PUT_LINE('pipe_establish rc=' || l_rc);
END;
/
-- Expected: rc=0 (success), and a message enqueued in LCD.LCD_BATCH_QUEUE
```

**Verify queue has a message:**
```sql
SELECT MSG_STATE, ENQUEUE_TIME, USER_DATA.TEXT_VC AS MSG
  FROM LCD.LCD_BATCH_Q_TABLE
 WHERE MSG_STATE = 'READY';
```

### Step 5.4 — Password Change Function Test

```sql
SET SERVEROUTPUT ON SIZE UNLIMITED;
DECLARE
  l_rc  INTEGER;
  l_msg VARCHAR2(500);
BEGIN
  -- Test with an obviously invalid username (should raise ORA-44002 from SIMPLE_SQL_NAME)
  BEGIN
    l_rc := lcd.change_password('DROP TABLE WORKER--', 'Test@Pass1!456', 'OldPass@1234!', l_msg);
    DBMS_OUTPUT.PUT_LINE('Injection test rc=' || l_rc || ' msg=' || l_msg);
  EXCEPTION
    WHEN OTHERS THEN
      DBMS_OUTPUT.PUT_LINE('Expected exception caught: ' || SQLERRM);
  END;
END;
/
-- Expected: ORA-44002 (invalid simple SQL name) raised and caught
```

### Step 5.5 — Outer Join Cursor Test (Distribution)

Run a minimal distribution test using a known org code and a posted date with historical data:

```sql
SET SERVEROUTPUT ON SIZE UNLIMITED;
DECLARE
  l_error_text VARCHAR2(300);
  l_rc         INTEGER;
BEGIN
  l_rc := lcd.pkg_distribution.f_batch_distribution(
    '010',
    TRUNC(SYSDATE) - 7,  -- Previous week end date
    'DISTRIBUTION_TEST',
    l_error_text
  );
  DBMS_OUTPUT.PUT_LINE('RC=' || l_rc || ' MSG=' || l_error_text);
END;
/
-- Expected: RC >= 0 (0=success, 1=partial). RC < 0 means distribution error (check l_error_text)
```

**Troubleshooting:**  
- `ORA-01799`: still has `(+)` join somewhere — search PKGBDIST.SQL for remaining `(+)`.
- `ORA-00942`: table not found — verify all referenced tables exist in LCD schema.

---

## Step 6 — Rollback Procedure

If deployment fails and rollback is needed:

### Step 6.1 — Restore from original/ folder

```sql
-- Recompile original versions from the original/ subfolder
@<path>\original\BATCH1.SQL
@<path>\original\PKG_DIST.SQL
@<path>\original\PKGBDIST.SQL
-- ... (repeat for all files that were compiled from patched/)
```

### Step 6.2 — Remove AQ Objects (if Phase 0.3 was executed)

```sql
-- DBA action:
BEGIN
  DBMS_AQADM.STOP_QUEUE(queue_name => 'LCD.LCD_BATCH_QUEUE');
  DBMS_AQADM.DROP_QUEUE(queue_name => 'LCD.LCD_BATCH_QUEUE');
  DBMS_AQADM.DROP_QUEUE_TABLE(queue_table => 'LCD.LCD_BATCH_Q_TABLE');
END;
/
```

### Step 6.3 — Reactivate DBMS_JOB (if it was removed in Step 4.1)

```sql
-- If the old DBMS_JOB is still in DBA_JOBS_RUNNING, no action needed.
-- If it was removed, reschedule manually until the old BATCH1.SQL is restored.
DECLARE X NUMBER;
BEGIN
  SYS.DBMS_JOB.SUBMIT(
    job => X,
    what => 'weekly_nps_extract(''\\cmis60\dev-tp$\Q22\OUT'',''GVRDPTS'');',
    next_date => TO_DATE('27/08/2007 05:00:00','dd/mm/yyyy hh24:mi:ss'),
    INTERVAL => 'NEXT_DAY(TRUNC(SYSDATE),''TUESDAY'') + 5/24',
    no_parse => TRUE
  );
  COMMIT;
END;
/
```

---

## Deployment Checklist Summary

| Step | Action | Expected Result | Status |
|---|---|---|---|
| 0.1 | Verify DB DIRECTORY objects | 33 LCD_* directories visible | ☐ |
| 0.2 | Grant DIRECTORY privileges to LCD | No errors | ☐ |
| 0.3 | Create AQ queue table and queue | Queue ENQUEUE/DEQUEUE enabled | ☐ |
| 0.4 | Recreate LCD_ITES DB link | `SELECT * FROM DUAL@LCD_ITES` returns 'X' | ☐ |
| 1.1 | Deploy Globals_spec.sql | Package created, no errors | ☐ |
| 1.2 | Deploy PKG_DIST.SQL | Package created, no errors | ☐ |
| 1.3 | Deploy PAYEDIT.SQL | Package created, no errors | ☐ |
| 1.4 | Deploy BATCH1.SQL | Package created, no errors | ☐ |
| 1.5 | Deploy TIMEPR1.SQL | No errors | ☐ |
| 2.1 | Deploy Globals_body.sql | Package body created | ☐ |
| 2.2 | Deploy PKGBDIST.SQL | No ORA-01799, no (+ ) joins | ☐ |
| 2.3 | Deploy PAYEDIT2.SQL | Package body created | ☐ |
| 2.4 | Deploy TIMEEDIT.SQL | No errors | ☐ |
| 2.5 | Deploy TIMEEDIT_extended.SQL | No GOTO, no errors | ☐ |
| 3.1 | Deploy Change_Password.sql | AUTHID=CURRENT_USER | ☐ |
| 3.2 | Deploy Verify_Function.fun | No errors | ☐ |
| 3.3 | Deploy p_copy_tables.SQL | No DBMS_SQL.V7 | ☐ |
| 3.4 | Deploy f_recalculate_labor.fun | No (+ ) joins | ☐ |
| 3.5 | Deploy 10g_packages.sql | No errors, f_get_directory_name present | ☐ |
| 3.6 | Deploy AddPayImp.sql | No hardcoded paths | ☐ |
| 4.1 | Remove old DBMS_JOB | Job no longer in DBA_JOBS | ☐ |
| 4.2 | Create DBMS_SCHEDULER job | Job in USER_SCHEDULER_JOBS, ENABLED | ☐ |
| 5.1 | Compile status check | No INVALID objects in LCD schema | ☐ |
| 5.2 | UTL_FILE directory smoke test | DEBUG shows LCD_IN, no ORA-29280 | ☐ |
| 5.3 | AQ batch IPC smoke test | pipe_establish rc=0 | ☐ |
| 5.4 | Password injection test | ORA-44002 caught as expected | ☐ |
| 5.5 | Distribution outer join test | RC>=0, no ORA-01799 | ☐ |

---

## Common Errors and Resolutions

| Error | Cause | Resolution |
|---|---|---|
| `ORA-29280: invalid directory path` | UTL_FILE DIRECTORY object not created | Run Step 0.1, create missing directory |
| `ORA-29283: invalid file operation` | Linux path does not exist or LCD has no OS permission | Verify `/csclcdnc0002/Q22S/In` is mounted and LCD OS user has read/write |
| `ORA-01799: a column may not be outer-joined to a subquery` | Remaining `(+)` join in cursor | Search ALL_SOURCE for `%(+)%`, recompile |
| `ORA-06576: not a valid function or procedure name` | DBMS_PIPE reference still in compiled code | Verify BATCH1.SQL patched version is compiled |
| `ORA-24002: queue table does not exist` | AQ queue table not created | Run Step 0.3 |
| `ORA-44002: invalid simple SQL name` | DBMS_ASSERT rejects injection attempt | Expected — correct behavior |
| `ORA-00942: table or view does not exist` | pwdverify.DICTIONARY absent | Expected if schema not migrated — defensive handler should suppress this |
| `ORA-12154: TNS not found` | LCD_ITES DB link references unknown TNS alias | Add ITES alias to tnsnames.ora on 19c server |
| `ORA-04021: timeout waiting for lock` | Another session holds package lock | Kill idle sessions; retry |
| `ORA-27486: insufficient privileges` | LCD schema lacks CREATE JOB privilege | DBA: `GRANT CREATE JOB TO LCD` |
| `ORA-00904: invalid identifier` | Column/table renamed or missing in 19c | Check ALL_TAB_COLUMNS for the LCD schema |
