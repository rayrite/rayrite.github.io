# Oracle 19c Migration — Unit Test Plan & Harness
## LCD Q22S UAT Environment | PowerBuilder GUI / SS Backend

**Author:** RdW  
**Date:** 5/24/2026  
**Tool:** Oracle SQL Developer — Worksheet mode (DECLARE blocks, DBMS_OUTPUT)  
**Connection:** LCD schema on Q22S 19c UAT instance

---

## Setup — Common Worksheet Header

Run this at the start of every test session:

```sql
-- ============================================================
-- TEST SESSION SETUP
-- RdW 5/24/2026 Powerbuilder GUI-SS Oracle 19c Migration
-- ============================================================
SET SERVEROUTPUT ON SIZE UNLIMITED;
SET DEFINE OFF;
SET FEEDBACK ON;
SET TIMING ON;

-- Convenience alias for debug output
-- (can paste into any test block)
-- DBMS_OUTPUT.PUT_LINE('[TEST] message');
```

---

## PHASE 1 — CRITICAL: Compilation Verification Tests

### TEST-01: Verify No Invalid Objects After Deployment

**Purpose:** Confirm all patched objects compiled successfully in 19c.  
**Risk:** All (any compile error blocks downstream functionality)

```sql
-- ============================================================
-- TEST-01: Invalid Object Check
-- ============================================================
DECLARE
  l_count NUMBER := 0;
BEGIN
  SELECT COUNT(*) INTO l_count
    FROM ALL_OBJECTS
   WHERE OWNER = 'LCD'
     AND STATUS = 'INVALID';

  DBMS_OUTPUT.PUT_LINE('[TEST-01] Invalid LCD objects count: ' || l_count);
  IF l_count = 0 THEN
    DBMS_OUTPUT.PUT_LINE('[TEST-01] PASS: All LCD objects are VALID');
  ELSE
    DBMS_OUTPUT.PUT_LINE('[TEST-01] FAIL: ' || l_count || ' invalid objects found');
    -- List them:
    FOR r IN (SELECT OBJECT_NAME, OBJECT_TYPE FROM ALL_OBJECTS
               WHERE OWNER='LCD' AND STATUS='INVALID'
               ORDER BY OBJECT_TYPE, OBJECT_NAME) LOOP
      DBMS_OUTPUT.PUT_LINE('  INVALID: ' || r.OBJECT_TYPE || ' ' || r.OBJECT_NAME);
    END LOOP;
  END IF;
END;
/
```

**Expected result:**
```
[TEST-01] Invalid LCD objects count: 0
[TEST-01] PASS: All LCD objects are VALID
```

**Troubleshooting:**  
- If invalid: recompile with `EXEC UTL_RECOMP.RECOMP_SERIAL('LCD');` then rerun.
- If still invalid: check `ALL_ERRORS WHERE OWNER='LCD' AND NAME=<object_name>` for root cause.

---

### TEST-02: Verify DBMS_PIPE References Eliminated (RISK-SS-01)

```sql
-- ============================================================
-- TEST-02: DBMS_PIPE Reference Check
-- ============================================================
DECLARE
  l_count NUMBER := 0;
BEGIN
  SELECT COUNT(*) INTO l_count
    FROM ALL_SOURCE
   WHERE OWNER = 'LCD'
     AND UPPER(TEXT) LIKE '%DBMS_PIPE%';

  DBMS_OUTPUT.PUT_LINE('[TEST-02] DBMS_PIPE references in LCD source: ' || l_count);
  IF l_count = 0 THEN
    DBMS_OUTPUT.PUT_LINE('[TEST-02] PASS: No DBMS_PIPE references found');
  ELSE
    DBMS_OUTPUT.PUT_LINE('[TEST-02] FAIL: DBMS_PIPE still referenced');
    FOR r IN (SELECT NAME, TYPE, LINE, TEXT FROM ALL_SOURCE
               WHERE OWNER='LCD' AND UPPER(TEXT) LIKE '%DBMS_PIPE%'
               ORDER BY NAME, LINE) LOOP
      DBMS_OUTPUT.PUT_LINE('  ' || r.NAME || ' line ' || r.LINE || ': ' || TRIM(r.TEXT));
    END LOOP;
  END IF;
END;
/
```

**Expected result:**
```
[TEST-02] DBMS_PIPE references in LCD source: 0
[TEST-02] PASS: No DBMS_PIPE references found
```

---

### TEST-03: Verify DBMS_SQL.V7 References Eliminated (RISK-SS-04)

```sql
-- ============================================================
-- TEST-03: DBMS_SQL.V7 Reference Check
-- ============================================================
DECLARE
  l_count NUMBER := 0;
BEGIN
  SELECT COUNT(*) INTO l_count
    FROM ALL_SOURCE
   WHERE OWNER = 'LCD'
     AND UPPER(TEXT) LIKE '%DBMS_SQL.V7%';

  DBMS_OUTPUT.PUT_LINE('[TEST-03] DBMS_SQL.V7 references: ' || l_count);
  IF l_count = 0 THEN
    DBMS_OUTPUT.PUT_LINE('[TEST-03] PASS: No DBMS_SQL.V7 references found');
  ELSE
    DBMS_OUTPUT.PUT_LINE('[TEST-03] FAIL: DBMS_SQL.V7 still present');
    FOR r IN (SELECT NAME, LINE, TEXT FROM ALL_SOURCE
               WHERE OWNER='LCD' AND UPPER(TEXT) LIKE '%DBMS_SQL.V7%') LOOP
      DBMS_OUTPUT.PUT_LINE('  ' || r.NAME || ' line ' || r.LINE || ': ' || TRIM(r.TEXT));
    END LOOP;
  END IF;
END;
/
```

**Expected result:** `[TEST-03] PASS: No DBMS_SQL.V7 references found`

---

### TEST-04: Verify Old (+) Outer Join Eliminated (RISK-SS-05)

```sql
-- ============================================================
-- TEST-04: Old-Style Outer Join Check in Specific Objects
-- ============================================================
DECLARE
  l_count NUMBER := 0;
BEGIN
  SELECT COUNT(*) INTO l_count
    FROM ALL_SOURCE
   WHERE OWNER = 'LCD'
     AND NAME IN ('F_RECALCULATE_LABOR','PKG_DISTRIBUTION','PAY_EDIT')
     AND TEXT LIKE '%(+)%';

  DBMS_OUTPUT.PUT_LINE('[TEST-04] (+) outer join references in target objects: ' || l_count);
  IF l_count = 0 THEN
    DBMS_OUTPUT.PUT_LINE('[TEST-04] PASS: No (+) join syntax found in target objects');
  ELSE
    DBMS_OUTPUT.PUT_LINE('[TEST-04] FAIL: (+) join still present');
    FOR r IN (SELECT NAME, LINE, TEXT FROM ALL_SOURCE
               WHERE OWNER='LCD'
                 AND NAME IN ('F_RECALCULATE_LABOR','PKG_DISTRIBUTION','PAY_EDIT')
                 AND TEXT LIKE '%(+)%') LOOP
      DBMS_OUTPUT.PUT_LINE('  ' || r.NAME || ' line ' || r.LINE || ': ' || TRIM(r.TEXT));
    END LOOP;
  END IF;
END;
/
```

**Expected result:** `[TEST-04] PASS: No (+) join syntax found in target objects`

---

### TEST-05: Verify GOTO Eliminated from TIMEEDIT_extended (RISK-SS-14)

```sql
-- ============================================================
-- TEST-05: GOTO Statement Check
-- ============================================================
DECLARE
  l_count NUMBER := 0;
BEGIN
  SELECT COUNT(*) INTO l_count
    FROM ALL_SOURCE
   WHERE OWNER = 'LCD'
     AND UPPER(TEXT) LIKE '%GOTO%';

  DBMS_OUTPUT.PUT_LINE('[TEST-05] GOTO references in LCD source: ' || l_count);
  IF l_count = 0 THEN
    DBMS_OUTPUT.PUT_LINE('[TEST-05] PASS: No GOTO statements found');
  ELSE
    -- Some GOTO may be in Change_Password (findupper, findchar) — those are acceptable
    -- in the original design; only TIMEEDIT_extended GOTO CONT is the target
    DBMS_OUTPUT.PUT_LINE('[TEST-05] WARNING: GOTO found (check if in TIMEEDIT_extended)');
    FOR r IN (SELECT NAME, LINE, TEXT FROM ALL_SOURCE
               WHERE OWNER='LCD' AND UPPER(TEXT) LIKE '%GOTO%') LOOP
      DBMS_OUTPUT.PUT_LINE('  ' || r.NAME || ' line ' || r.LINE || ': ' || TRIM(r.TEXT));
    END LOOP;
  END IF;
END;
/
```

**Expected result:** 0 GOTO references in TIMEEDIT_extended specifically.

---

## PHASE 2 — Unit Tests: Functional Verification

### TEST-10: BATCH1 / AQ Pipe Establish (RISK-SS-01)

**Purpose:** Verify the AQ-based pipe_establish returns 0 and enqueues a message.

```sql
-- ============================================================
-- TEST-10: AQ Batch IPC — pipe_establish smoke test
-- ============================================================
DECLARE
  v_org_code  VARCHAR2(10) := '010';
  v_job_name  VARCHAR2(30) := 'DISTRIBUTION';
  v_rc        INTEGER;
  v_msg_count NUMBER;
BEGIN
  DBMS_OUTPUT.PUT_LINE('[TEST-10] Testing pipe_establish for org=' || v_org_code
                       || ' job=' || v_job_name);

  -- Call the patched pipe_establish (now uses AQ internally)
  v_rc := lcd.lcdbatch.pipe_establish(v_org_code, v_job_name);

  DBMS_OUTPUT.PUT_LINE('[TEST-10] pipe_establish returned: ' || v_rc);

  -- Check queue has at least one message
  SELECT COUNT(*) INTO v_msg_count
    FROM LCD.LCD_BATCH_Q_TABLE
   WHERE MSG_STATE = 'READY';

  DBMS_OUTPUT.PUT_LINE('[TEST-10] Messages in AQ queue (READY state): ' || v_msg_count);

  IF v_rc = 0 AND v_msg_count >= 1 THEN
    DBMS_OUTPUT.PUT_LINE('[TEST-10] PASS');
  ELSE
    DBMS_OUTPUT.PUT_LINE('[TEST-10] FAIL: rc=' || v_rc || ' queue_count=' || v_msg_count);
  END IF;

  ROLLBACK; -- Clean up test message from queue
END;
/
```

**Expected result:**
```
[TEST-10] pipe_establish returned: 0
[TEST-10] Messages in AQ queue (READY state): 1
[TEST-10] PASS
```

**Troubleshooting:**  
- If `ORA-24002`: queue not created — run DBA Step 0.3 from deployment plan.
- If rc != 0: check BATCH1.SQL error handling; verify AQ grants are in place.

---

### TEST-11: UTL_FILE Directory Resolution (RISK-SS-02)

**Purpose:** Verify that `f_open_in_file` resolves the correct Oracle DIRECTORY object for each org group, and that the DBMS_OUTPUT debug lines appear correctly.

```sql
-- ============================================================
-- TEST-11: UTL_FILE Directory Resolution — standard org (010)
-- ============================================================
DECLARE
  v_org_code   VARCHAR2(10)       := '010';
  v_file_name  VARCHAR2(100)      := 'probe_test.txt';
  v_handle     UTL_FILE.FILE_TYPE;
  v_result     BOOLEAN;
BEGIN
  DBMS_OUTPUT.PUT_LINE('[TEST-11] Testing f_open_in_file for org=' || v_org_code);
  DBMS_OUTPUT.PUT_LINE('[TEST-11] Expected DIRECTORY: LCD_IN (/csclcdnc0002/Q22S/In)');
  DBMS_OUTPUT.PUT_LINE('');

  v_result := lcd.f_open_in_file(v_org_code, v_file_name, v_handle);

  -- File won't exist; result FALSE is expected, but DBMS_OUTPUT debug should show LCD_IN
  DBMS_OUTPUT.PUT_LINE('[TEST-11] f_open_in_file returned: ' || CASE WHEN v_result THEN 'TRUE' ELSE 'FALSE (file not found - expected)' END);
  DBMS_OUTPUT.PUT_LINE('[TEST-11] PASS if DBMS_OUTPUT shows: dir_obj=[LCD_IN]');
END;
/
```

```sql
-- ============================================================
-- TEST-11b: UTL_FILE Directory Resolution — FEDERAL org (114)
-- ============================================================
DECLARE
  v_org_code   VARCHAR2(10)       := '114';
  v_file_name  VARCHAR2(100)      := 'probe_test.txt';
  v_handle     UTL_FILE.FILE_TYPE;
  v_result     BOOLEAN;
BEGIN
  DBMS_OUTPUT.PUT_LINE('[TEST-11b] Testing f_open_in_file for org=' || v_org_code);
  DBMS_OUTPUT.PUT_LINE('[TEST-11b] Expected DIRECTORY: LCD_FEDERAL_IN (/csclcdnc0002/Q22S-FEDERAL/IN)');
  DBMS_OUTPUT.PUT_LINE('');
  v_result := lcd.f_open_in_file(v_org_code, v_file_name, v_handle);
  DBMS_OUTPUT.PUT_LINE('[TEST-11b] PASS if DBMS_OUTPUT shows: dir_obj=[LCD_FEDERAL_IN]');
END;
/
```

```sql
-- ============================================================
-- TEST-11c: UTL_FILE Directory Resolution — CANADA org (574)
-- ============================================================
DECLARE
  v_org_code   VARCHAR2(10)       := '574';
  v_file_name  VARCHAR2(100)      := 'probe_test.txt';
  v_handle     UTL_FILE.FILE_TYPE;
  v_result     BOOLEAN;
BEGIN
  DBMS_OUTPUT.PUT_LINE('[TEST-11c] Testing f_open_in_file for org=' || v_org_code);
  DBMS_OUTPUT.PUT_LINE('[TEST-11c] Expected DIRECTORY: LCD_CANADA_IN');
  v_result := lcd.f_open_in_file(v_org_code, v_file_name, v_handle);
  DBMS_OUTPUT.PUT_LINE('[TEST-11c] PASS if DBMS_OUTPUT shows: dir_obj=[LCD_CANADA_IN]');
END;
/
```

**Expected DBMS_OUTPUT (each test):**
```
-- [DEBUG] UTL_FILE.FOPEN dir_obj=[LCD_IN] file=[probe_test.txt]
```
(or LCD_FEDERAL_IN / LCD_CANADA_IN as appropriate)

**Troubleshooting:**  
- If `ORA-29280`: DIRECTORY object missing or not granted — check DBA Step 0.2.
- If dir_obj shows wrong name: `f_get_directory_name` logic issue — check CASE statement mappings.

---

### TEST-12: Change_Password — SQL Injection Prevention (RISK-SS-03)

**Purpose:** Verify `DBMS_ASSERT.SIMPLE_SQL_NAME` blocks injection attempts.

```sql
-- ============================================================
-- TEST-12a: Change_Password — SQL Injection Username Test
-- ============================================================
DECLARE
  v_rc  INTEGER;
  v_msg VARCHAR2(500);
BEGIN
  DBMS_OUTPUT.PUT_LINE('[TEST-12a] Testing SQL injection prevention in change_password');

  BEGIN
    -- Attempt injection via username
    v_rc := lcd.change_password(
      p_user    => 'DROP TABLE WORKER--',   -- Malicious input
      p_user_pw => 'TestPw@12345678!',
      p_old_pw  => 'OldPw@12345678!',
      p_msg_out => v_msg
    );
    DBMS_OUTPUT.PUT_LINE('[TEST-12a] FAIL: No exception raised. rc=' || v_rc);
  EXCEPTION
    WHEN OTHERS THEN
      IF INSTR(SQLERRM,'ORA-44002') > 0 THEN
        DBMS_OUTPUT.PUT_LINE('[TEST-12a] PASS: DBMS_ASSERT.SIMPLE_SQL_NAME raised ORA-44002 as expected');
        DBMS_OUTPUT.PUT_LINE('[TEST-12a]  Error: ' || SQLERRM);
      ELSE
        DBMS_OUTPUT.PUT_LINE('[TEST-12a] PARTIAL: Exception raised but not ORA-44002: ' || SQLERRM);
      END IF;
  END;
END;
/
```

```sql
-- ============================================================
-- TEST-12b: Change_Password — pwdverify.DICTIONARY Graceful Fallback (RISK-SS-07)
-- ============================================================
DECLARE
  v_rc  INTEGER;
  v_msg VARCHAR2(500);
BEGIN
  DBMS_OUTPUT.PUT_LINE('[TEST-12b] Testing pwdverify graceful fallback');
  -- This test verifies no ORA-00942 is thrown if pwdverify.DICTIONARY is absent
  -- A short password should fail at the length check, not at the dictionary check
  v_rc := lcd.change_password(
    p_user    => 'TESTUSER',
    p_user_pw => 'Short1!',              -- Too short (<14 chars)
    p_old_pw  => 'OldPassword123!',
    p_msg_out => v_msg
  );
  DBMS_OUTPUT.PUT_LINE('[TEST-12b] rc=' || v_rc || ' msg=' || v_msg);
  IF v_rc = -1 AND INSTR(v_msg,'14') > 0 THEN
    DBMS_OUTPUT.PUT_LINE('[TEST-12b] PASS: Length validation fired correctly (no ORA-00942)');
  ELSE
    DBMS_OUTPUT.PUT_LINE('[TEST-12b] FAIL or unexpected result');
  END IF;
END;
/
```

**Expected results:**
- TEST-12a: `PASS: DBMS_ASSERT.SIMPLE_SQL_NAME raised ORA-44002 as expected`
- TEST-12b: `PASS: Length validation fired correctly (no ORA-00942)`

---

### TEST-13: p_copy_tables — DBMS_SQL.NATIVE and Table Validation (RISK-SS-04)

```sql
-- ============================================================
-- TEST-13a: p_copy_tables — SQL Injection Table Name Prevention
-- ============================================================
DECLARE
  v_not_deleted VARCHAR2(500) := NULL;
  v_not_copied  VARCHAR2(500) := NULL;
BEGIN
  DBMS_OUTPUT.PUT_LINE('[TEST-13a] Testing table name validation in p_copy_tables');

  BEGIN
    lcd.p_copy_tables(
      a_copy_list       => 'WORKER',
      a_delete_list     => NULL,
      a_owner           => 'LCD',
      a_from_org        => '010',
      a_to_org          => '999',
      a_db_link         => NULL,
      a_tab_not_deleted => v_not_deleted,
      a_tab_not_copied  => v_not_copied
    );
    DBMS_OUTPUT.PUT_LINE('[TEST-13a] Completed. Not copied: [' || NVL(v_not_copied,'none') || ']');
    -- A valid table (WORKER) should be in the whitelist
    IF v_not_copied IS NULL THEN
      DBMS_OUTPUT.PUT_LINE('[TEST-13a] PASS: WORKER table validated and copy attempted');
    END IF;
  EXCEPTION
    WHEN OTHERS THEN
      DBMS_OUTPUT.PUT_LINE('[TEST-13a] Exception: ' || SQLERRM);
  END;
  ROLLBACK;
END;
/
```

```sql
-- ============================================================
-- TEST-13b: p_copy_tables — Invalid Table Name Blocked
-- ============================================================
DECLARE
  v_not_deleted VARCHAR2(500) := NULL;
  v_not_copied  VARCHAR2(500) := NULL;
BEGIN
  DBMS_OUTPUT.PUT_LINE('[TEST-13b] Testing invalid table name rejection');

  BEGIN
    lcd.p_copy_tables(
      a_copy_list       => 'DUAL; DROP TABLE WORKER--',  -- Injection attempt
      a_delete_list     => NULL,
      a_owner           => 'LCD',
      a_from_org        => '010',
      a_to_org          => '999',
      a_db_link         => NULL,
      a_tab_not_deleted => v_not_deleted,
      a_tab_not_copied  => v_not_copied
    );
    -- Should either raise error or add to v_not_copied
    DBMS_OUTPUT.PUT_LINE('[TEST-13b] Not copied: [' || NVL(v_not_copied,'none') || ']');
    IF v_not_copied IS NOT NULL THEN
      DBMS_OUTPUT.PUT_LINE('[TEST-13b] PASS: Invalid table name was rejected');
    ELSE
      DBMS_OUTPUT.PUT_LINE('[TEST-13b] WARNING: Check whitelist behavior');
    END IF;
  EXCEPTION
    WHEN OTHERS THEN
      DBMS_OUTPUT.PUT_LINE('[TEST-13b] Exception (expected): ' || SQLERRM);
      DBMS_OUTPUT.PUT_LINE('[TEST-13b] PASS: Invalid table raised exception');
  END;
  ROLLBACK;
END;
/
```

---

### TEST-14: f_recalculate_labor — ANSI Join Cursor Test (RISK-SS-05)

```sql
-- ============================================================
-- TEST-14: f_recalculate_labor — Basic Execution Test
-- Uses a known org/worker from UAT test data
-- ============================================================
DECLARE
  v_org_code     VARCHAR2(10)  := '010';
  v_worker_id    VARCHAR2(20)  := 'TESTWORKER1';   -- Replace with valid UAT worker ID
  v_period_start DATE          := TRUNC(SYSDATE,'IW') - 7;  -- Previous Monday
  v_period_end   DATE          := TRUNC(SYSDATE,'IW') - 1;  -- Previous Sunday
  v_rc           INTEGER;
BEGIN
  DBMS_OUTPUT.PUT_LINE('[TEST-14] Testing f_recalculate_labor');
  DBMS_OUTPUT.PUT_LINE('[TEST-14] org=' || v_org_code || ' wid=' || v_worker_id);
  DBMS_OUTPUT.PUT_LINE('[TEST-14] period=' || TO_CHAR(v_period_start,'YYYY-MM-DD')
                       || ' to ' || TO_CHAR(v_period_end,'YYYY-MM-DD'));

  v_rc := lcd.f_recalculate_labor(v_org_code, v_worker_id, v_period_start, v_period_end);

  DBMS_OUTPUT.PUT_LINE('[TEST-14] f_recalculate_labor returned: ' || v_rc);
  IF v_rc >= 0 THEN
    DBMS_OUTPUT.PUT_LINE('[TEST-14] PASS: No ORA-01799 or exceptions');
  ELSE
    DBMS_OUTPUT.PUT_LINE('[TEST-14] FAIL or no data: rc=' || v_rc);
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    DBMS_OUTPUT.PUT_LINE('[TEST-14] EXCEPTION: ' || SQLERRM);
    IF INSTR(SQLERRM,'ORA-01799') > 0 THEN
      DBMS_OUTPUT.PUT_LINE('[TEST-14] FAIL: (+) join still present — ORA-01799 detected');
    END IF;
END;
/
```

**Expected result:**
```
[TEST-14] f_recalculate_labor returned: 0   (or positive integer = rows processed)
[TEST-14] PASS: No ORA-01799 or exceptions
```

**Troubleshooting:**  
- Substitute `v_worker_id` with a known worker from `SELECT WORKER_ID FROM LCD.WORKER WHERE ORG_CODE='010' AND ROWNUM<=1`.

---

### TEST-15: NPS Job Scheduler — DBMS_SCHEDULER Verification (RISK-SS-06)

```sql
-- ============================================================
-- TEST-15: DBMS_SCHEDULER Job Verification
-- ============================================================
DECLARE
  v_count NUMBER := 0;
  v_state VARCHAR2(30);
BEGIN
  DBMS_OUTPUT.PUT_LINE('[TEST-15] Checking DBMS_SCHEDULER job for NPS extract');

  SELECT COUNT(*), MAX(STATE)
    INTO v_count, v_state
    FROM USER_SCHEDULER_JOBS
   WHERE JOB_NAME = 'WEEKLY_NPS_EXTRACT_Q22_JOB';

  DBMS_OUTPUT.PUT_LINE('[TEST-15] Job found: ' || v_count || ' State: ' || NVL(v_state,'N/A'));

  IF v_count = 1 AND v_state = 'SCHEDULED' THEN
    DBMS_OUTPUT.PUT_LINE('[TEST-15] PASS: Job exists and is SCHEDULED');
  ELSIF v_count = 1 THEN
    DBMS_OUTPUT.PUT_LINE('[TEST-15] WARNING: Job exists but state=' || v_state);
  ELSE
    DBMS_OUTPUT.PUT_LINE('[TEST-15] FAIL: Job not found');
  END IF;

  -- Verify old DBMS_JOB is gone
  DECLARE v_old_count NUMBER := 0;
  BEGIN
    SELECT COUNT(*) INTO v_old_count FROM DBA_JOBS
     WHERE UPPER(WHAT) LIKE '%WEEKLY_NPS_EXTRACT%';
    DBMS_OUTPUT.PUT_LINE('[TEST-15] Old DBMS_JOB entries: ' || v_old_count
                         || CASE WHEN v_old_count=0 THEN ' (GOOD)' ELSE ' (FAIL: should be 0)' END);
  EXCEPTION WHEN OTHERS THEN
    DBMS_OUTPUT.PUT_LINE('[TEST-15] DBA_JOBS not accessible from LCD schema (normal)');
  END;
END;
/
```

---

### TEST-16: PAYEDIT — Date Default Parameter (RISK-SS-10)

```sql
-- ============================================================
-- TEST-16: PAYEDIT.SQL — NLS-safe Date Default Parameter
-- Verify the package spec compiled with TO_DATE instead of string literal
-- ============================================================
DECLARE
  l_count NUMBER := 0;
BEGIN
  DBMS_OUTPUT.PUT_LINE('[TEST-16] Checking PAYEDIT spec for NLS-safe date default');

  -- Check source does NOT contain old string literal default
  SELECT COUNT(*) INTO l_count
    FROM ALL_SOURCE
   WHERE OWNER = 'LCD'
     AND NAME = 'PAY_EDIT'
     AND TYPE = 'PACKAGE'
     AND UPPER(TEXT) LIKE '%''11-NOV-97''%';

  IF l_count = 0 THEN
    DBMS_OUTPUT.PUT_LINE('[TEST-16] PASS: No NLS-unsafe date literal found in PAY_EDIT spec');
  ELSE
    DBMS_OUTPUT.PUT_LINE('[TEST-16] FAIL: Old date literal still present in source');
  END IF;

  -- Verify it compiled (object is VALID)
  SELECT COUNT(*) INTO l_count
    FROM ALL_OBJECTS
   WHERE OWNER='LCD' AND OBJECT_NAME='PAY_EDIT' AND STATUS='VALID';

  DBMS_OUTPUT.PUT_LINE('[TEST-16] PAY_EDIT package VALID: ' || CASE WHEN l_count>0 THEN 'YES' ELSE 'NO' END);
END;
/
```

---

### TEST-17: AUTHID Clause Verification (RISK-SS-11)

```sql
-- ============================================================
-- TEST-17: AUTHID Clause Check
-- ============================================================
BEGIN
  DBMS_OUTPUT.PUT_LINE('[TEST-17] Checking AUTHID clauses on critical objects');
  FOR r IN (
    SELECT OBJECT_NAME, OBJECT_TYPE, AUTHID
      FROM ALL_PROCEDURES
     WHERE OWNER = 'LCD'
       AND OBJECT_NAME IN ('CHANGE_PASSWORD','P_COPY_TABLES','PAY_EDIT','PKG_DISTRIBUTION')
     ORDER BY OBJECT_NAME
  ) LOOP
    DBMS_OUTPUT.PUT_LINE('[TEST-17] ' || r.OBJECT_TYPE || ' ' || r.OBJECT_NAME
                         || ' AUTHID=' || NVL(r.AUTHID,'(none)'));
  END LOOP;
  DBMS_OUTPUT.PUT_LINE('[TEST-17] Expected: CHANGE_PASSWORD=CURRENT_USER, P_COPY_TABLES=CURRENT_USER');
  DBMS_OUTPUT.PUT_LINE('[TEST-17] Expected: PAY_EDIT=DEFINER, PKG_DISTRIBUTION=DEFINER');
END;
/
```

---

### TEST-18: BINARY_INTEGER Elimination (RISK-SS-12)

```sql
-- ============================================================
-- TEST-18: BINARY_INTEGER Reference Check in Key Packages
-- ============================================================
DECLARE
  l_count NUMBER := 0;
BEGIN
  SELECT COUNT(*) INTO l_count
    FROM ALL_SOURCE
   WHERE OWNER = 'LCD'
     AND NAME IN ('LCDBATCH','PAY_EDIT','PKG_DISTRIBUTION','P_COPY_TABLES')
     AND UPPER(TEXT) LIKE '%BINARY_INTEGER%';

  DBMS_OUTPUT.PUT_LINE('[TEST-18] BINARY_INTEGER references in target packages: ' || l_count);
  IF l_count = 0 THEN
    DBMS_OUTPUT.PUT_LINE('[TEST-18] PASS: All BINARY_INTEGER replaced with PLS_INTEGER');
  ELSE
    DBMS_OUTPUT.PUT_LINE('[TEST-18] FAIL: BINARY_INTEGER still present');
    FOR r IN (SELECT NAME, LINE, TEXT FROM ALL_SOURCE
               WHERE OWNER='LCD' AND NAME IN ('LCDBATCH','PAY_EDIT','PKG_DISTRIBUTION','P_COPY_TABLES')
                 AND UPPER(TEXT) LIKE '%BINARY_INTEGER%') LOOP
      DBMS_OUTPUT.PUT_LINE('  ' || r.NAME || ' L' || r.LINE || ': ' || TRIM(r.TEXT));
    END LOOP;
  END IF;
END;
/
```

---

### TEST-19: DBMS_OUTPUT Debug Guard (RISK-SS-13)

```sql
-- ============================================================
-- TEST-19: DBMS_OUTPUT Guard — Verify g_debug_output flag
-- ============================================================
BEGIN
  DBMS_OUTPUT.PUT_LINE('[TEST-19] Testing g_debug_output flag in lcd.globals');
  DBMS_OUTPUT.PUT_LINE('[TEST-19] Default value should be FALSE');

  -- Access the flag (it's a package variable; test through its declared type)
  -- Verify it exists and is callable
  DECLARE l_flag BOOLEAN := lcd.globals.g_debug_output;
  BEGIN
    DBMS_OUTPUT.PUT_LINE('[TEST-19] g_debug_output = ' || CASE WHEN l_flag THEN 'TRUE' ELSE 'FALSE' END);
    IF NOT l_flag THEN
      DBMS_OUTPUT.PUT_LINE('[TEST-19] PASS: Debug output is OFF by default (production-safe)');
    ELSE
      DBMS_OUTPUT.PUT_LINE('[TEST-19] WARNING: Debug output is ON — check Globals_spec.sql');
    END IF;
  END;
END;
/
```

---

### TEST-20: Verify_Function — pwdverify Graceful Fallback (RISK-SS-07)

```sql
-- ============================================================
-- TEST-20: Verify_Function — pwdverify.DICTIONARY Fallback
-- ============================================================
DECLARE
  v_result BOOLEAN;
BEGIN
  DBMS_OUTPUT.PUT_LINE('[TEST-20] Testing Verify_Function with standard password');
  BEGIN
    -- A valid strong password should return TRUE even if pwdverify.DICTIONARY is absent
    v_result := lcd.verify_function(
      username     => 'TESTUSER',
      password     => 'StrongPassword@1!9c',
      old_password => 'OldPassword@0!8b'
    );
    DBMS_OUTPUT.PUT_LINE('[TEST-20] verify_function returned: ' || CASE WHEN v_result THEN 'TRUE' ELSE 'FALSE' END);
    IF v_result THEN
      DBMS_OUTPUT.PUT_LINE('[TEST-20] PASS: Verify_Function passed without ORA-00942');
    ELSE
      DBMS_OUTPUT.PUT_LINE('[TEST-20] WARNING: Returned FALSE — check password complexity rules');
    END IF;
  EXCEPTION
    WHEN OTHERS THEN
      IF INSTR(SQLERRM,'ORA-00942') > 0 THEN
        DBMS_OUTPUT.PUT_LINE('[TEST-20] FAIL: ORA-00942 — pwdverify fallback not working');
      ELSE
        DBMS_OUTPUT.PUT_LINE('[TEST-20] Exception: ' || SQLERRM);
      END IF;
  END;
END;
/
```

---

## PHASE 3 — Distribution Integration Tests

### TEST-30: Distribution End-to-End — Single Org (PKGBDIST + LCD_BTCH)

```sql
-- ============================================================
-- TEST-30: Distribution Integration Test — Org 010
-- Requires: test data in LABOR_DETAIL for the target week
-- ============================================================
DECLARE
  v_org_code   VARCHAR2(10) := '010';
  v_posted_dt  VARCHAR2(20);
  v_msg        VARCHAR2(500);
  v_rc         BOOLEAN;
BEGIN
  -- Use the most recent complete week end date (Saturday)
  v_posted_dt := TO_CHAR(TRUNC(SYSDATE,'IW') - 2, 'DD MON YYYY');  -- Previous Saturday

  DBMS_OUTPUT.PUT_LINE('[TEST-30] Distribution test: org=' || v_org_code
                       || ' posted_date=' || v_posted_dt);

  lcd.lcd_batch_distribution(
    a_login_org   => v_org_code,
    a_posted_date => v_posted_dt,
    a_event_name  => 'DISTRIBUTION',
    a_msg         => v_msg,
    a_rc          => v_rc
  );

  DBMS_OUTPUT.PUT_LINE('[TEST-30] RC=' || CASE WHEN v_rc THEN 'TRUE (SUCCESS)' ELSE 'FALSE (FAIL)' END);
  DBMS_OUTPUT.PUT_LINE('[TEST-30] MSG=' || NVL(v_msg,'(empty)'));

  IF v_rc THEN
    DBMS_OUTPUT.PUT_LINE('[TEST-30] PASS: Distribution completed successfully');
  ELSE
    DBMS_OUTPUT.PUT_LINE('[TEST-30] FAIL or PARTIAL: Check EVENT_LOG for details');
    -- Query event log for details
    FOR r IN (SELECT event_info, proc_stat_ind, create_date
                FROM LCD.EVENT_LOG
               WHERE ORG_CODE = v_org_code AND EVENT_NAME = 'DISTRIBUTION'
                 AND CREATE_DATE >= TRUNC(SYSDATE)
               ORDER BY CREATE_DATE DESC FETCH FIRST 3 ROWS ONLY) LOOP
      DBMS_OUTPUT.PUT_LINE('[TEST-30] EVENT_LOG: [' || r.proc_stat_ind || '] ' || r.event_info);
    END LOOP;
  END IF;
  ROLLBACK; -- Roll back test distribution
END;
/
```

---

### TEST-31: Pay Validation — Basic Edit Test (PAYEDIT2)

```sql
-- ============================================================
-- TEST-31: Pay Validation — Single Worker Time Sheet Validation
-- ============================================================
DECLARE
  v_org_code    VARCHAR2(10) := '010';
  v_worker_id   VARCHAR2(20) := 'TESTWORKER1';   -- Replace with valid UAT worker
  v_end_date    DATE         := TRUNC(SYSDATE,'IW') - 2;  -- Previous Saturday
  v_size        INTEGER      := 1;
  v_abs_type    lcd.pay_edit.AbsType;
  v_wo_num      lcd.pay_edit.WoType;
  v_time_str    lcd.pay_edit.TimeStrType;
  v_err_count   INTEGER      := 0;
  v_err_line    lcd.pay_edit.ErrorLineType;
  v_err_num     lcd.pay_edit.ErrorNumType;
BEGIN
  DBMS_OUTPUT.PUT_LINE('[TEST-31] Pay validation test: org=' || v_org_code
                       || ' wid=' || v_worker_id
                       || ' end_date=' || TO_CHAR(v_end_date,'YYYY-MM-DD'));

  -- Build a minimal 1-row time entry array (REG 8 hours on Monday)
  v_abs_type(1) := 'REG';
  v_wo_num(1)   := ' ';
  v_time_str(1) := '00080000000000000000000000000000'; -- 8 hrs day 1, zeros rest

  pay_edit.validate(
    p_org_code        => v_org_code,
    p_worker_id       => v_worker_id,
    p_end_date        => v_end_date,
    p_size            => v_size,
    p_array_abs_type  => v_abs_type,
    p_array_wo_num    => v_wo_num,
    p_array_time      => v_time_str,
    p_error_count     => v_err_count,
    p_error_line      => v_err_line,
    p_error_number    => v_err_num
  );

  DBMS_OUTPUT.PUT_LINE('[TEST-31] Errors returned: ' || v_err_count);
  FOR i IN 1..v_err_count LOOP
    DBMS_OUTPUT.PUT_LINE('[TEST-31]   Error line=' || v_err_line(i) || ' code=' || v_err_num(i));
  END LOOP;
  DBMS_OUTPUT.PUT_LINE('[TEST-31] PASS if no unexpected ORA errors (validation errors are expected behavior)');
EXCEPTION
  WHEN OTHERS THEN
    DBMS_OUTPUT.PUT_LINE('[TEST-31] EXCEPTION: ' || SQLERRM);
    IF INSTR(SQLERRM,'ORA-01858') > 0 THEN
      DBMS_OUTPUT.PUT_LINE('[TEST-31] FAIL: NLS date issue — check PAYEDIT.SQL date literal fix');
    END IF;
END;
/
```

---

## PHASE 4 — End-to-End GUI Tests (PowerBuilder Application)

These tests are executed from within the LCD PowerBuilder application connected to the Q22S 19c UAT environment.

### E2E-01: User Login and Session Establishment

**Screen:** `w_login`  
**Pre-condition:** A valid LCD user account exists in `LCD.APPL_USER` with a non-expired password.

**Steps:**
1. Launch LCD PowerBuilder application connected to Q22S 19c.
2. Enter valid user ID (e.g., `LCDUSER`) and password.
3. Click **OK**.

**Expected result:**
- Login succeeds — `w_main` window opens.
- No "ORA-" error messages.
- Event Log entry created in `LCD.EVENT_LOG` for the login.

**GUI Verification:**
```sql
-- Verify login event logged
SELECT * FROM LCD.APPL_USER WHERE USER_ID = 'LCDUSER';
-- Confirm LAST_SIGN_ON_DATE updated to today
```

**Troubleshooting:**  
- If "ORA-06576" on login: `LCD.LCDBATCH` package is INVALID — recompile BATCH1.SQL.
- If "Password expired" dialog — complete E2E-02 first.

---

### E2E-02: Change Password — Full Flow (GUI → DB)

**Screen:** `w_change_password`  
**Entry point:** Administration → Change Password  
**Mapped to:** `lcd.change_password()` function (patched), `lcd.verify_function()`

**Steps:**
1. Log in as `LCDUSER`.
2. Go to **Administration → Change Password**.
3. Enter old password in "Old Password" field.
4. Enter a new valid password (≥14 chars, uppercase, digit, special) in "New Password".
5. Re-enter new password in "Confirmation".
6. Click **OK**.

**Expected result:**
- Success message: "Password has been successfully changed."
- `LCD.APPL_USER` record updated with new password hash.
- No "ORA-" errors in PowerBuilder message boxes.

**Verification query:**
```sql
SELECT USER_ID, LAST_PWD_CHG_DATE, USER_STATUS
  FROM LCD.APPL_USER
 WHERE USER_ID = 'LCDUSER';
-- LAST_PWD_CHG_DATE should be today
```

**Security edge case test:**  
Enter a username containing `'` or `"` in the Change Password dialog (via a test script). The application should display an Oracle error message (ORA-44002) rather than allowing injection.

**Troubleshooting:**
- "Password does not contain dictionary words" error without pwdverify: this means the fallback handler is not working — check Verify_Function.fun patch.
- "Must be 14 characters" but password IS 14 chars: check sle_new_password field max chars (should be ≥14 on PB side).

---

### E2E-03: Time Entry and Submission (w_time_transactions)

**Screen:** `w_time_transactions` (TIME module)  
**Maps to:** `lcd.pay_edit.validate()` (PAYEDIT2.SQL — patched), `lcd.timeedit_proc` (TIMEEDIT_extended.SQL)

**Steps:**
1. Navigate to **Time** module.
2. Enter a time sheet for a test worker (org 010).
3. Enter 8 hours REG for Monday.
4. Click **Submit**.

**Expected result:**
- Time sheet is validated without "ORA-01799" or "ORA-01858" errors.
- Records inserted into `LCD.TIME_EXPORT`.
- Event log updated.

**Verification query:**
```sql
SELECT WORKER_ID, ATT_ABS_TYPE, ACTUAL_DATE, LAB_UNITS, PROC_STAT_IND
  FROM LCD.TIME_EXPORT
 WHERE ORG_CODE = '010'
   AND WORKER_ID = '<test_worker_id>'
   AND ACTUAL_DATE >= TRUNC(SYSDATE,'IW') - 7
 ORDER BY ACTUAL_DATE;
```

**Troubleshooting:**
- ORA-01799 error during submission: f_recalculate_labor or PKGBDIST still has `(+)` join — check TEST-04 output.
- ORA-01858: date literal not patched in PAYEDIT.SQL — check TEST-16.

---

### E2E-04: Distribution (Batch Process)

**Screen:** `w_main` → Distribution option  
**Maps to:** `lcd.lcd_batch_distribution()` → `lcd.pkg_distribution.f_batch_distribution()` (PKGBDIST.SQL)  
**Batch IPC:** Now uses AQ (patched BATCH1.SQL) instead of DBMS_PIPE

**Steps:**
1. Log in to LCD application.
2. Select **Distribution** for org 010 and a test posted date.
3. Initiate the distribution batch.
4. Monitor the batch progress indicator in the GUI.

**Expected result:**
- Distribution progress updates appear in the PowerBuilder front-end status bar (AQ messages received).
- Distribution completes with "Distribution was successful" message.
- Labor Detail records are created.

**Verification:**
```sql
-- Verify distribution event log
SELECT EVENT_NAME, PROC_STAT_IND, EVENT_INFO, CREATE_DATE
  FROM LCD.EVENT_LOG
 WHERE ORG_CODE = '010' AND EVENT_NAME = 'DISTRIBUTION'
   AND CREATE_DATE >= TRUNC(SYSDATE)
 ORDER BY CREATE_DATE DESC FETCH FIRST 5 ROWS ONLY;

-- Verify AQ queue was consumed (should be empty after distribution)
SELECT COUNT(*) FROM LCD.LCD_BATCH_Q_TABLE WHERE MSG_STATE = 'READY';
-- Expected: 0 (all messages consumed by PowerBuilder front-end)
```

**Troubleshooting:**  
- "Unable to establish pipe" in app: AQ queue not started — DBA run `DBMS_AQADM.START_QUEUE`.
- Distribution completes but no progress in GUI: PowerBuilder RECEIVE_FROM_PIPE calls need to be updated to use AQ DEQUEUE — coordinate with PB developer.
- ORA-01799 in distribution: remaining `(+)` join in PKGBDIST — run TEST-04.

---

### E2E-05: File Import (UTL_FILE Resolution)

**Screen:** File import screens in LCD (time import, pay import)  
**Maps to:** `10g_packages.sql` `f_open_in_file` (patched), `AddPayImp.sql`

**Steps:**
1. Place a valid test input file in `/csclcdnc0002/Q22S/In/` on the Linux server.
2. Trigger a file import process from the LCD GUI for org 010.
3. Monitor DBMS_OUTPUT (or check event log) for directory resolution debug lines.

**Expected result:**
- DBMS_OUTPUT (if debug mode ON) shows: `-- [DEBUG] UTL_FILE.FOPEN dir_obj=[LCD_IN] file=[testfile.txt]`
- File is read successfully.
- Records imported into target LCD tables.

**Verification query:**
```sql
SELECT * FROM LCD.EVENT_LOG
 WHERE ORG_CODE = '010'
   AND EVENT_NAME LIKE '%IMPORT%'
   AND CREATE_DATE >= TRUNC(SYSDATE)
 ORDER BY CREATE_DATE DESC FETCH FIRST 5 ROWS ONLY;
```

**Troubleshooting:**
- ORA-29280 (invalid directory): DBA must create the LCD_IN directory object.
- ORA-29283 (invalid file operation): File doesn't exist at the Linux path, or LCD OS user lacks read permission. Verify with `ls -la /csclcdnc0002/Q22S/In/` on server.
- Wrong DIRECTORY selected: f_get_directory_name mapping has a bug — check the CASE logic for the org's LCD_SERVER_LOC value.

---

## Test Summary Matrix

| Test ID | Area | Risk | Type | Pass Criteria |
|---|---|---|---|---|
| TEST-01 | Object Compilation | All | Auto | 0 INVALID objects |
| TEST-02 | DBMS_PIPE removal | SS-01 | Auto | 0 references in source |
| TEST-03 | DBMS_SQL.V7 removal | SS-04 | Auto | 0 references |
| TEST-04 | (+) join removal | SS-05 | Auto | 0 in target objects |
| TEST-05 | GOTO removal | SS-14 | Auto | 0 in TIMEEDIT_extended |
| TEST-10 | AQ pipe_establish | SS-01 | Functional | rc=0, queue message enqueued |
| TEST-11 | UTL_FILE directory | SS-02 | Functional | Correct DIRECTORY in DBMS_OUTPUT |
| TEST-12 | SQL injection | SS-03, SS-07 | Security | ORA-44002 raised; no ORA-00942 |
| TEST-13 | Table whitelist | SS-04 | Security | Invalid table rejected |
| TEST-14 | ANSI join cursor | SS-05 | Functional | No ORA-01799 |
| TEST-15 | Scheduler job | SS-06 | Admin | Job SCHEDULED in USER_SCHEDULER_JOBS |
| TEST-16 | Date default | SS-10 | Regression | No '11-NOV-97' in source |
| TEST-17 | AUTHID clauses | SS-11 | Security | CURRENT_USER on DDL packages |
| TEST-18 | PLS_INTEGER | SS-12 | Auto | 0 BINARY_INTEGER in targets |
| TEST-19 | Debug flag | SS-13 | Functional | g_debug_output=FALSE by default |
| TEST-20 | pwdverify fallback | SS-07 | Functional | No ORA-00942; fallback active |
| TEST-30 | Distribution E2E | SS-01, SS-05 | Integration | Distribution completes without ORA errors |
| TEST-31 | Pay validation | SS-05, SS-10 | Integration | No ORA-01799, ORA-01858 |
| E2E-01 | Login | All | GUI | Login succeeds, w_main opens |
| E2E-02 | Change Password | SS-03, SS-07 | GUI | Password changes; no ORA injection |
| E2E-03 | Time Entry | SS-05, SS-10 | GUI | Time submitted; no ORA errors |
| E2E-04 | Distribution | SS-01, SS-05 | GUI | Distribution completes; AQ IPC works |
| E2E-05 | File Import | SS-02 | GUI | File read from correct DIRECTORY |

---

## Regression Safety Queries

Run these queries before and after deployment to detect data-level regressions:

```sql
-- Snapshot LABOR_DETAIL count per org before deployment
SELECT ORG_CODE, COUNT(*) CNT
  FROM LCD.LABOR_DETAIL
 GROUP BY ORG_CODE
 ORDER BY ORG_CODE;

-- Snapshot EVENT_LOG status per org
SELECT ORG_CODE, EVENT_NAME, PROC_STAT_IND, COUNT(*) CNT
  FROM LCD.EVENT_LOG
 WHERE CREATE_DATE >= SYSDATE - 7
 GROUP BY ORG_CODE, EVENT_NAME, PROC_STAT_IND
 ORDER BY ORG_CODE, EVENT_NAME;

-- Snapshot WORKER row counts
SELECT ORG_CODE, COUNT(*) CNT
  FROM LCD.WORKER
 GROUP BY ORG_CODE
 ORDER BY ORG_CODE;
```

Compare pre/post counts after running TEST-30 (with ROLLBACK) and E2E-04 (with ROLLBACK in UAT).
