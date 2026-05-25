# LCD Server-Side Backend — Oracle 19c Migration Test Plan

> **Task**: 42-2 PB SS-Backend
> **Date**: May 24, 2026
> **Author**: RdW (Cascade-assisted)
> **Execution**: SQL Developer Worksheet mode with `SET SERVEROUTPUT ON`

---

## Overview

This test plan provides SQL Developer worksheet scripts to verify each SS- remediation. Tests are organized as unit tests (individual function/procedure), integration tests (cross-component), and end-to-end tests (GUI-triggered workflows).

---

## Phase 1: Unit Tests — SQL Developer Worksheet Scripts

### UT-SS-01: Change_Password Function

**Objective**: Verify Change_Password compiles, executes, and handles missing pwdverify.DICTIONARY.

```sql
-- =====================================================================
-- UT-SS-01: Change_Password Function Test Harness
-- Run in SQL Developer Worksheet with SERVEROUTPUT ON
-- =====================================================================
SET SERVEROUTPUT ON SIZE UNLIMITED;

DECLARE
    v_result   INTEGER;
    v_msg      VARCHAR2(256);
    v_user     VARCHAR2(30) := USER;  -- current user
BEGIN
    DBMS_OUTPUT.PUT_LINE('=== UT-SS-01: Change_Password Tests ===');
    DBMS_OUTPUT.PUT_LINE('Testing as user: ' || v_user);
    DBMS_OUTPUT.PUT_LINE('');

    -- Test 1: Password same as username (should return -1)
    v_msg := SPACE(256);
    v_result := CHANGE_PASSWORD(v_user, LOWER(v_user), 'OldDummyPass1!', v_msg);
    DBMS_OUTPUT.PUT_LINE('Test 1 - Password=Username: result=' || v_result || ' msg=' || RTRIM(v_msg));
    IF v_result = -1 THEN
        DBMS_OUTPUT.PUT_LINE('  PASS: Correctly rejected password = username');
    ELSE
        DBMS_OUTPUT.PUT_LINE('  FAIL: Expected -1, got ' || v_result);
    END IF;
    DBMS_OUTPUT.PUT_LINE('');

    -- Test 2: Password too short (should return -1)
    v_msg := SPACE(256);
    v_result := CHANGE_PASSWORD(v_user, 'Short1!', 'OldDummyPass1!', v_msg);
    DBMS_OUTPUT.PUT_LINE('Test 2 - Too Short: result=' || v_result || ' msg=' || RTRIM(v_msg));
    IF v_result = -1 THEN
        DBMS_OUTPUT.PUT_LINE('  PASS: Correctly rejected short password');
    ELSE
        DBMS_OUTPUT.PUT_LINE('  FAIL: Expected -1, got ' || v_result);
    END IF;
    DBMS_OUTPUT.PUT_LINE('');

    -- Test 3: No digit in password (should return -1)
    v_msg := SPACE(256);
    v_result := CHANGE_PASSWORD(v_user, 'NoDigitsHerePlease!A', 'OldDummyPass1!', v_msg);
    DBMS_OUTPUT.PUT_LINE('Test 3 - No Digit: result=' || v_result || ' msg=' || RTRIM(v_msg));
    IF v_result = -1 THEN
        DBMS_OUTPUT.PUT_LINE('  PASS: Correctly rejected password without digit');
    ELSE
        DBMS_OUTPUT.PUT_LINE('  FAIL: Expected -1, got ' || v_result);
    END IF;
    DBMS_OUTPUT.PUT_LINE('');

    -- Test 4: No special character (should return -1)
    v_msg := SPACE(256);
    v_result := CHANGE_PASSWORD(v_user, 'NoSpecialChar1234A', 'OldDummyPass1!', v_msg);
    DBMS_OUTPUT.PUT_LINE('Test 4 - No Special: result=' || v_result || ' msg=' || RTRIM(v_msg));
    IF v_result = -1 THEN
        DBMS_OUTPUT.PUT_LINE('  PASS: Correctly rejected password without special char');
    ELSE
        DBMS_OUTPUT.PUT_LINE('  FAIL: Expected -1, got ' || v_result);
    END IF;
    DBMS_OUTPUT.PUT_LINE('');

    -- Test 5: SYS user rejection
    v_msg := SPACE(256);
    v_result := CHANGE_PASSWORD('SYS_FAKE', 'ValidPass123!Xyz', 'OldDummyPass1!', v_msg);
    DBMS_OUTPUT.PUT_LINE('Test 5 - SYS Rejection: result=' || v_result || ' msg=' || RTRIM(v_msg));
    IF v_result = -1 THEN
        DBMS_OUTPUT.PUT_LINE('  PASS: Correctly rejected SYS* user');
    ELSE
        DBMS_OUTPUT.PUT_LINE('  FAIL: Expected -1, got ' || v_result);
    END IF;
    DBMS_OUTPUT.PUT_LINE('');

    -- Test 6: AUTHID check - verify function has CURRENT_USER
    DECLARE
        v_authid VARCHAR2(30);
    BEGIN
        SELECT AUTHID INTO v_authid FROM USER_PROCEDURES
        WHERE OBJECT_NAME = 'CHANGE_PASSWORD' AND OBJECT_TYPE = 'FUNCTION' AND ROWNUM = 1;
        DBMS_OUTPUT.PUT_LINE('Test 6 - AUTHID: ' || v_authid);
        IF v_authid = 'CURRENT_USER' THEN
            DBMS_OUTPUT.PUT_LINE('  PASS: AUTHID CURRENT_USER is set');
        ELSE
            DBMS_OUTPUT.PUT_LINE('  FAIL: Expected CURRENT_USER, got ' || v_authid);
        END IF;
    EXCEPTION WHEN NO_DATA_FOUND THEN
        DBMS_OUTPUT.PUT_LINE('  FAIL: CHANGE_PASSWORD function not found');
    END;

    DBMS_OUTPUT.PUT_LINE('');
    DBMS_OUTPUT.PUT_LINE('=== UT-SS-01 Complete ===');
END;
/
```

**Expected Results**:
- Tests 1-5: All return -1 with descriptive messages
- Test 6: AUTHID = CURRENT_USER

---

### UT-SS-02: f_Unlock_user Function

```sql
-- =====================================================================
-- UT-SS-02: f_Unlock_user Function Test Harness
-- =====================================================================
SET SERVEROUTPUT ON SIZE UNLIMITED;

DECLARE
    v_result VARCHAR2(300);
    v_authid VARCHAR2(30);
BEGIN
    DBMS_OUTPUT.PUT_LINE('=== UT-SS-02: f_Unlock_user Tests ===');

    -- Test 1: Verify AUTHID
    BEGIN
        SELECT AUTHID INTO v_authid FROM USER_PROCEDURES
        WHERE OBJECT_NAME = 'F_UNLOCK_USER' AND OBJECT_TYPE = 'FUNCTION' AND ROWNUM = 1;
        DBMS_OUTPUT.PUT_LINE('Test 1 - AUTHID: ' || v_authid);
        IF v_authid = 'CURRENT_USER' THEN
            DBMS_OUTPUT.PUT_LINE('  PASS: AUTHID CURRENT_USER is set');
        ELSE
            DBMS_OUTPUT.PUT_LINE('  FAIL: Expected CURRENT_USER, got ' || v_authid);
        END IF;
    EXCEPTION WHEN NO_DATA_FOUND THEN
        DBMS_OUTPUT.PUT_LINE('  FAIL: F_UNLOCK_USER not found');
    END;

    -- Test 2: Call with non-existent user (should return error string)
    v_result := F_UNLOCK_USER('NONEXISTENT_USER_XYZ');
    DBMS_OUTPUT.PUT_LINE('Test 2 - Non-existent user: result=' || v_result);
    IF INSTR(v_result, 'ORA-') > 0 THEN
        DBMS_OUTPUT.PUT_LINE('  PASS: Returns ORA error for non-existent user');
    ELSE
        DBMS_OUTPUT.PUT_LINE('  INFO: result=' || v_result);
    END IF;

    -- Test 3: Verify function compiles cleanly
    DECLARE
        v_status VARCHAR2(30);
    BEGIN
        SELECT STATUS INTO v_status FROM USER_OBJECTS
        WHERE OBJECT_NAME = 'F_UNLOCK_USER' AND OBJECT_TYPE = 'FUNCTION';
        DBMS_OUTPUT.PUT_LINE('Test 3 - Compilation Status: ' || v_status);
        IF v_status = 'VALID' THEN
            DBMS_OUTPUT.PUT_LINE('  PASS: Function is VALID');
        ELSE
            DBMS_OUTPUT.PUT_LINE('  FAIL: Function is ' || v_status);
        END IF;
    END;

    DBMS_OUTPUT.PUT_LINE('=== UT-SS-02 Complete ===');
END;
/
```

---

### UT-SS-05: DBMS_PIPE Grants and LCDBatch

```sql
-- =====================================================================
-- UT-SS-05: DBMS_PIPE and LCDBatch Test Harness
-- =====================================================================
SET SERVEROUTPUT ON SIZE UNLIMITED;

DECLARE
    v_pipe_rc  INTEGER;
    v_pipe_name VARCHAR2(50) := 'LCD_SS05_TEST_PIPE';
    v_status   VARCHAR2(30);
BEGIN
    DBMS_OUTPUT.PUT_LINE('=== UT-SS-05: DBMS_PIPE Tests ===');

    -- Test 1: Create a pipe
    v_pipe_rc := DBMS_PIPE.CREATE_PIPE(v_pipe_name, 8192, FALSE);
    DBMS_OUTPUT.PUT_LINE('Test 1 - CREATE_PIPE: rc=' || v_pipe_rc);
    IF v_pipe_rc = 0 THEN
        DBMS_OUTPUT.PUT_LINE('  PASS: Pipe created successfully');
    ELSE
        DBMS_OUTPUT.PUT_LINE('  FAIL: Pipe creation failed');
    END IF;

    -- Test 2: Pack and send a message
    DBMS_PIPE.PACK_MESSAGE('SS-05 Test Message');
    v_pipe_rc := DBMS_PIPE.SEND_MESSAGE(v_pipe_name);
    DBMS_OUTPUT.PUT_LINE('Test 2 - SEND_MESSAGE: rc=' || v_pipe_rc);
    IF v_pipe_rc = 0 THEN
        DBMS_OUTPUT.PUT_LINE('  PASS: Message sent');
    ELSE
        DBMS_OUTPUT.PUT_LINE('  FAIL: Send failed');
    END IF;

    -- Test 3: Receive the message
    v_pipe_rc := DBMS_PIPE.RECEIVE_MESSAGE(v_pipe_name, 1);
    IF v_pipe_rc = 0 THEN
        DECLARE v_msg VARCHAR2(200);
        BEGIN
            DBMS_PIPE.UNPACK_MESSAGE(v_msg);
            DBMS_OUTPUT.PUT_LINE('Test 3 - RECEIVE: msg=' || v_msg);
            DBMS_OUTPUT.PUT_LINE('  PASS: Message received');
        END;
    ELSE
        DBMS_OUTPUT.PUT_LINE('Test 3 - FAIL: Receive failed rc=' || v_pipe_rc);
    END IF;

    -- Test 4: Remove pipe
    v_pipe_rc := DBMS_PIPE.REMOVE_PIPE(v_pipe_name);
    DBMS_OUTPUT.PUT_LINE('Test 4 - REMOVE_PIPE: rc=' || v_pipe_rc);
    IF v_pipe_rc = 0 THEN
        DBMS_OUTPUT.PUT_LINE('  PASS: Pipe removed');
    ELSE
        DBMS_OUTPUT.PUT_LINE('  FAIL: Remove failed');
    END IF;

    -- Test 5: Verify LCDBatch package is VALID
    SELECT STATUS INTO v_status FROM USER_OBJECTS
    WHERE OBJECT_NAME = 'LCDBATCH' AND OBJECT_TYPE = 'PACKAGE BODY';
    DBMS_OUTPUT.PUT_LINE('Test 5 - LCDBatch PACKAGE BODY: ' || v_status);
    IF v_status = 'VALID' THEN
        DBMS_OUTPUT.PUT_LINE('  PASS');
    ELSE
        DBMS_OUTPUT.PUT_LINE('  FAIL');
    END IF;

    DBMS_OUTPUT.PUT_LINE('=== UT-SS-05 Complete ===');
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('ERROR: ' || SQLERRM);
        -- Clean up pipe on error
        v_pipe_rc := DBMS_PIPE.REMOVE_PIPE(v_pipe_name);
END;
/
```

---

### UT-SS-06: DBMS_SCHEDULER

```sql
-- =====================================================================
-- UT-SS-06: DBMS_SCHEDULER Test Harness
-- =====================================================================
SET SERVEROUTPUT ON SIZE UNLIMITED;

DECLARE
    v_job_name VARCHAR2(30) := 'LCD_SS06_TEST';
BEGIN
    DBMS_OUTPUT.PUT_LINE('=== UT-SS-06: DBMS_SCHEDULER Tests ===');

    -- Test 1: Create a test job
    DBMS_SCHEDULER.CREATE_JOB(
        job_name   => v_job_name,
        job_type   => 'PLSQL_BLOCK',
        job_action => 'BEGIN NULL; END;',
        enabled    => FALSE
    );
    DBMS_OUTPUT.PUT_LINE('Test 1 - CREATE_JOB: PASS');

    -- Test 2: Drop the test job
    DBMS_SCHEDULER.DROP_JOB(v_job_name);
    DBMS_OUTPUT.PUT_LINE('Test 2 - DROP_JOB: PASS');

    DBMS_OUTPUT.PUT_LINE('=== UT-SS-06 Complete ===');
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('ERROR: ' || SQLERRM);
        BEGIN DBMS_SCHEDULER.DROP_JOB(v_job_name); EXCEPTION WHEN OTHERS THEN NULL; END;
END;
/
```

---

### UT-SS-08: lcd.pkg_pipe

```sql
-- =====================================================================
-- UT-SS-08: lcd.pkg_pipe Test Harness
-- =====================================================================
SET SERVEROUTPUT ON SIZE UNLIMITED;

DECLARE
    v_status VARCHAR2(30);
    v_pipe_name VARCHAR2(50) := 'LCD_SS08_TEST_PIPE';
    v_rc INTEGER;
BEGIN
    DBMS_OUTPUT.PUT_LINE('=== UT-SS-08: lcd.pkg_pipe Tests ===');

    -- Test 1: Verify pkg_pipe compiles
    SELECT STATUS INTO v_status FROM USER_OBJECTS
    WHERE OBJECT_NAME = 'PKG_PIPE' AND OBJECT_TYPE = 'PACKAGE BODY';
    DBMS_OUTPUT.PUT_LINE('Test 1 - PKG_PIPE BODY status: ' || v_status);
    IF v_status = 'VALID' THEN DBMS_OUTPUT.PUT_LINE('  PASS'); ELSE DBMS_OUTPUT.PUT_LINE('  FAIL'); END IF;

    -- Test 2: Call p_pipe_in with VARCHAR2
    v_rc := DBMS_PIPE.CREATE_PIPE(v_pipe_name, 8192, FALSE);
    LCD.PKG_PIPE.P_PIPE_IN(v_pipe_name, 'SS-08 Test String');
    DBMS_OUTPUT.PUT_LINE('Test 2 - p_pipe_in(VARCHAR2): PASS');

    -- Test 3: Call p_pipe_in with NUMBER
    LCD.PKG_PIPE.P_PIPE_IN(v_pipe_name, 42);
    DBMS_OUTPUT.PUT_LINE('Test 3 - p_pipe_in(NUMBER): PASS');

    -- Test 4: Call p_pipe_in with DATE
    LCD.PKG_PIPE.P_PIPE_IN(v_pipe_name, SYSDATE);
    DBMS_OUTPUT.PUT_LINE('Test 4 - p_pipe_in(DATE): PASS');

    -- Test 5: Call p_pipe_out to drain pipe
    LCD.PKG_PIPE.P_PIPE_OUT(v_pipe_name);
    DBMS_OUTPUT.PUT_LINE('Test 5 - p_pipe_out: PASS (check output above for pipe contents)');

    -- Cleanup
    v_rc := DBMS_PIPE.REMOVE_PIPE(v_pipe_name);

    DBMS_OUTPUT.PUT_LINE('=== UT-SS-08 Complete ===');
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('ERROR: ' || SQLERRM);
        v_rc := DBMS_PIPE.REMOVE_PIPE(v_pipe_name);
END;
/
```

---

### UT-SS-12: pwdverify.DICTIONARY Check

```sql
-- =====================================================================
-- UT-SS-12: pwdverify.DICTIONARY Existence Test
-- =====================================================================
SET SERVEROUTPUT ON SIZE UNLIMITED;

DECLARE
    v_count NUMBER;
BEGIN
    DBMS_OUTPUT.PUT_LINE('=== UT-SS-12: pwdverify.DICTIONARY Tests ===');

    -- Test 1: Check if pwdverify schema exists
    SELECT COUNT(*) INTO v_count FROM ALL_USERS WHERE USERNAME = 'PWDVERIFY';
    DBMS_OUTPUT.PUT_LINE('Test 1 - PWDVERIFY schema exists: ' || CASE WHEN v_count > 0 THEN 'YES' ELSE 'NO' END);

    -- Test 2: Check if DICTIONARY table exists
    SELECT COUNT(*) INTO v_count FROM ALL_TABLES WHERE OWNER = 'PWDVERIFY' AND TABLE_NAME = 'DICTIONARY';
    DBMS_OUTPUT.PUT_LINE('Test 2 - DICTIONARY table exists: ' || CASE WHEN v_count > 0 THEN 'YES' ELSE 'NO' END);

    -- Test 3: Verify Change_Password handles missing dictionary gracefully
    DECLARE
        v_result INTEGER;
        v_msg VARCHAR2(256) := SPACE(256);
    BEGIN
        -- This should fail on validation (password too short) NOT on ORA-00942
        v_result := CHANGE_PASSWORD(USER, 'x', 'y', v_msg);
        DBMS_OUTPUT.PUT_LINE('Test 3 - Change_Password with bad pw: result=' || v_result || ' msg=' || RTRIM(v_msg));
        IF v_result = -1 THEN
            DBMS_OUTPUT.PUT_LINE('  PASS: Validation failed gracefully (no ORA-00942)');
        ELSE
            DBMS_OUTPUT.PUT_LINE('  INFO: Unexpected result ' || v_result);
        END IF;
    EXCEPTION
        WHEN OTHERS THEN
            IF INSTR(SQLERRM, 'ORA-00942') > 0 THEN
                DBMS_OUTPUT.PUT_LINE('  FAIL: ORA-00942 thrown - pwdverify.DICTIONARY protection not working');
            ELSE
                DBMS_OUTPUT.PUT_LINE('  ERROR: ' || SQLERRM);
            END IF;
    END;

    DBMS_OUTPUT.PUT_LINE('=== UT-SS-12 Complete ===');
END;
/
```

---

## Phase 2: Integration Tests

### IT-01: Full Change Password Flow

```sql
-- =====================================================================
-- IT-01: Full Change Password Flow (simulated)
-- NOTE: This does NOT actually change a password in production.
-- It tests the validation logic only.
-- =====================================================================
SET SERVEROUTPUT ON SIZE UNLIMITED;

DECLARE
    v_result INTEGER;
    v_msg VARCHAR2(256);
    v_test_count INTEGER := 0;
    v_pass_count INTEGER := 0;

    PROCEDURE run_test(p_name VARCHAR2, p_user VARCHAR2, p_new_pw VARCHAR2, p_old_pw VARCHAR2, p_expected INTEGER) IS
    BEGIN
        v_test_count := v_test_count + 1;
        v_msg := SPACE(256);
        v_result := CHANGE_PASSWORD(p_user, p_new_pw, p_old_pw, v_msg);
        IF v_result = p_expected THEN
            v_pass_count := v_pass_count + 1;
            DBMS_OUTPUT.PUT_LINE('  PASS: ' || p_name || ' (result=' || v_result || ')');
        ELSE
            DBMS_OUTPUT.PUT_LINE('  FAIL: ' || p_name || ' expected=' || p_expected || ' got=' || v_result || ' msg=' || RTRIM(v_msg));
        END IF;
    END;
BEGIN
    DBMS_OUTPUT.PUT_LINE('=== IT-01: Change Password Integration ===');

    run_test('Password=Username',     USER, LOWER(USER),              'OldValidPass1!', -1);
    run_test('Too Short',             USER, 'Sh1!',                   'OldValidPass1!', -1);
    run_test('No Digit',              USER, 'NoDigitsHerePlz!AB',     'OldValidPass1!', -1);
    run_test('No Uppercase',          USER, 'nouppercase123!ab',      'OldValidPass1!', -1);
    run_test('No Special Char',       USER, 'NoSpecialChar1234AB',    'OldValidPass1!', -1);
    run_test('Too Similar',           USER, 'OldValidPass2!',         'OldValidPass1!', -1);
    run_test('SYS User Blocked',      'SYS_FAKE', 'ValidNew1!Pass', 'ValidOld1!Pass', -1);

    DBMS_OUTPUT.PUT_LINE('');
    DBMS_OUTPUT.PUT_LINE('Results: ' || v_pass_count || '/' || v_test_count || ' passed');
    DBMS_OUTPUT.PUT_LINE('=== IT-01 Complete ===');
END;
/
```

---

### IT-02: LCDBatch Pipe Lifecycle

```sql
-- =====================================================================
-- IT-02: LCDBatch Pipe Create → Send → Receive → Delete Lifecycle
-- =====================================================================
SET SERVEROUTPUT ON SIZE UNLIMITED;

DECLARE
    v_rc INTEGER;
    v_org VARCHAR2(3) := '010';
    v_job VARCHAR2(30) := 'TEST_SS05';
BEGIN
    DBMS_OUTPUT.PUT_LINE('=== IT-02: LCDBatch Pipe Lifecycle ===');

    -- Step 1: Create pipe via LCDBatch
    v_rc := LCD.LCDBATCH.PIPE_CREATE(v_org, v_job);
    DBMS_OUTPUT.PUT_LINE('Step 1 - PIPE_CREATE: rc=' || v_rc);

    -- Step 2: Send a status message
    LCD.LCDBATCH.PIPE_STATUS(v_org, v_job, 42);
    DBMS_OUTPUT.PUT_LINE('Step 2 - PIPE_STATUS(42): sent');

    -- Step 3: Delete pipes
    LCD.LCDBATCH.PIPE_DELETE(v_org, v_job);
    DBMS_OUTPUT.PUT_LINE('Step 3 - PIPE_DELETE: done');

    DBMS_OUTPUT.PUT_LINE('=== IT-02 Complete: PASS ===');
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('ERROR: ' || SQLERRM);
        BEGIN LCD.LCDBATCH.PIPE_DELETE(v_org, v_job); EXCEPTION WHEN OTHERS THEN NULL; END;
END;
/
```

---

## Phase 3: End-to-End GUI Workflow Tests

These tests are executed from within the PowerBuilder LCD application after deploying the patched server-side code.

### E2E-SS-01: User Lifecycle (SS-01 through SS-04)

**Reference**: `tasks/41-LCD-GUI/INDEX.md` — LCD7 Security Module

| Step | GUI Action | Server-Side Function | Expected Result |
|---|---|---|---|
| 1 | Admin > Create User → enter test ID, password, org | `CREATE_USER` (SS-03) | User created, no errors |
| 2 | Admin > Set User Roles → assign LCD_PAY_VIEW | `GRANT_USER_ROLE` (SS-04) | Role granted |
| 3 | Log out, log in as new user | `CONNECT`, role check via `d_granted_roles` | Login succeeds, PAY menu enabled |
| 4 | Admin > Change Password → new user changes own password | `CHANGE_PASSWORD` (SS-01) | Password changed |
| 5 | Log out, log in with new password | `CONNECT` | Login succeeds with new password |
| 6 | Admin (original) > Set User Roles → revoke LCD_PAY_VIEW | `REVOKE_USER_ROLE` (SS-04) | Role revoked |
| 7 | Admin > Drop User → remove test user | `DROP_USER` (SS-03) | User dropped |

### E2E-SS-02: Account Lock/Unlock (SS-02)

| Step | GUI Action | Server-Side Function | Expected Result |
|---|---|---|---|
| 1 | Attempt login with wrong password 5 times | Oracle profile locks account | "ID is locked" message |
| 2 | Admin > Unlock User → enter locked user | `F_UNLOCK_USER` (SS-02) | Returns 'OK' |
| 3 | Log in as unlocked user with correct password | `CONNECT` | Login succeeds |

### E2E-SS-03: Batch Job Progress (SS-05/SS-06/SS-08)

**Reference**: `tasks/41-LCD-GUI/SHARED/INDEX.md` — w_show_status

| Step | GUI Action | Server-Side Function | Expected Result |
|---|---|---|---|
| 1 | Processing > Import Employees → select file → Submit | `SUB_JOB` → `DBMS_SCHEDULER.CREATE_JOB` (SS-06) | Job submitted |
| 2 | View job status window | `GETSTATUS` → `DBMS_PIPE.RECEIVE_MESSAGE` (SS-05) | Progress bar updates |
| 3 | Wait for completion | Pipe signals completion | Status shows "Complete" |
| 4 | Click "Remove Job" | `PIPE_DELETE` → `DBMS_PIPE.REMOVE_PIPE` (SS-05) | Job removed from display |

### E2E-SS-04: Distribution with Pipe Monitoring (SS-05/SS-08)

**Reference**: `tasks/41-LCD-GUI/DISTRIB7/INDEX.md`

| Step | GUI Action | Server-Side Function | Expected Result |
|---|---|---|---|
| 1 | Processing > Distribute → select dates | `SUB_JOB` | Job submitted |
| 2 | Monitor progress | `pkg_pipe.p_pipe_in` / `GETSTATUS` | Progress updates displayed |
| 3 | Distribution completes | `PIPE_DELETE` | Clean completion |
| 4 | Distribution > Reconcile | Verification queries | Results match expected |

### E2E-SS-05: Table Copy with DB Links (SS-11)

**Reference**: `tasks/41-LCD-GUI/ADMIN/INDEX.md` — w_p_copy_tables

| Step | GUI Action | Server-Side Function | Expected Result |
|---|---|---|---|
| 1 | Admin > Copy Tables → select source/target envs | `P_COPY_TABLES` with DB link params | Copy completes |
| 2 | Verify copied data | Manual query in target | Data matches source |

---

## Test Execution Checklist

| Test ID | Description | Phase | Executor | Date | Result | Notes |
|---|---|---|---|---|---|---|
| UT-SS-01 | Change_Password validation | Unit | | | | |
| UT-SS-02 | f_Unlock_user compilation | Unit | | | | |
| UT-SS-05 | DBMS_PIPE operations | Unit | | | | |
| UT-SS-06 | DBMS_SCHEDULER operations | Unit | | | | |
| UT-SS-08 | lcd.pkg_pipe operations | Unit | | | | |
| UT-SS-12 | pwdverify.DICTIONARY check | Unit | | | | |
| IT-01 | Change Password integration | Integration | | | | |
| IT-02 | LCDBatch pipe lifecycle | Integration | | | | |
| E2E-SS-01 | User lifecycle via GUI | End-to-End | | | | |
| E2E-SS-02 | Account lock/unlock via GUI | End-to-End | | | | |
| E2E-SS-03 | Batch job progress via GUI | End-to-End | | | | |
| E2E-SS-04 | Distribution with pipes | End-to-End | | | | |
| E2E-SS-05 | Table copy with DB links | End-to-End | | | | |

---

## Troubleshooting Tips

| Problem | Likely Cause | Fix |
|---|---|---|
| UT-SS-01 throws ORA-00942 | pwdverify.DICTIONARY missing + old code | Deploy patched Change_Password.sql |
| UT-SS-02 returns ORA-01031 | Missing ALTER USER grant | `GRANT ALTER USER TO LCD;` |
| UT-SS-05 throws ORA-06550 | Missing DBMS_PIPE grant | `GRANT EXECUTE ON SYS.DBMS_PIPE TO LCD;` |
| UT-SS-06 throws ORA-27486 | Missing CREATE JOB privilege | `GRANT CREATE JOB TO LCD;` |
| IT-02 PIPE_CREATE fails | LCDBatch package invalid | Recompile: `ALTER PACKAGE LCD.LCDBATCH COMPILE BODY;` |
| E2E-SS-01 Create User fails | CREATE_USER proc missing or invalid | Extract from 11g and deploy |
| E2E-SS-03 progress bar frozen | Pipe not created or wrong name | Check PIPE_CREATE return code in server log |

---

*End of test plan.*
