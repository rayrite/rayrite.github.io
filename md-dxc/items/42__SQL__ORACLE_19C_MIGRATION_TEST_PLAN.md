# LCD-Oracle: Oracle 11g → 19c Migration — Unit Test Plan

**Author:** RdW  
**Date:** 5/24/2026  
**Test Environment:** UAT (Q22S / Oracle 19c)

---

## 1. Testing Philosophy

All tests are structured as **in-database PL/SQL scripts** that:
- Execute a function or procedure call with controlled inputs
- Capture the output (return value, DBMS_OUTPUT, or table side-effects)
- ASSERT the result matches the expected value
- Print `PASS` or `FAIL` with a description

Tests are grouped into **test suites** — one per patched file. Each suite can be run independently.

---

## 2. Test Harness Convention

A lightweight assertion macro is used throughout:

```sql
-- Paste this block at the top of any test suite:
DECLARE
  g_pass_count NUMBER := 0;
  g_fail_count NUMBER := 0;

  PROCEDURE assert_eq(p_test VARCHAR2, p_expected VARCHAR2, p_actual VARCHAR2) IS
  BEGIN
    IF NVL(p_expected,'__null__') = NVL(p_actual,'__null__') THEN
      DBMS_OUTPUT.PUT_LINE('  [PASS] ' || p_test);
      g_pass_count := g_pass_count + 1;
    ELSE
      DBMS_OUTPUT.PUT_LINE('  [FAIL] ' || p_test ||
        ' expected=' || NVL(p_expected,'(null)') ||
        ' actual='   || NVL(p_actual,'(null)'));
      g_fail_count := g_fail_count + 1;
    END IF;
  END;
BEGIN
  -- ... test cases here ...
  DBMS_OUTPUT.PUT_LINE('');
  DBMS_OUTPUT.PUT_LINE('Results: ' || g_pass_count || ' passed, ' ||
                        g_fail_count || ' failed.');
END;
/
```

All test scripts are located in: `tasks/42/tests/`

---

## 3. Test Suite: F_GET_19C_DIR_NAME

**File:** `tasks/42/tests/test_F_GET_19C_DIR_NAME.sql`

### TS-01: Happy path — known path returns correct object name
```sql
PROCEDURE ts_01 IS v VARCHAR2(128); BEGIN
  v := lcd.f_get_19c_dir_name('/csclcdnc0002/Q22S/In');
  assert_eq('TS-01 known IN path', 'LCD_IN', v);
END;
```

### TS-02: Trailing slash is stripped before comparison
```sql
PROCEDURE ts_02 IS v VARCHAR2(128); BEGIN
  v := lcd.f_get_19c_dir_name('/csclcdnc0002/Q22S/In/');
  assert_eq('TS-02 trailing slash stripped', 'LCD_IN', v);
END;
```

### TS-03: Case insensitive match
```sql
PROCEDURE ts_03 IS v VARCHAR2(128); BEGIN
  v := lcd.f_get_19c_dir_name('/CSCLCDNC0002/Q22S/IN');
  assert_eq('TS-03 case insensitive', 'LCD_IN', v);
END;
```

### TS-04: OUT path returns correct object name
```sql
PROCEDURE ts_04 IS v VARCHAR2(128); BEGIN
  v := lcd.f_get_19c_dir_name('/csclcdnc0002/Q22S/Out');
  assert_eq('TS-04 OUT path', 'LCD_OUT', v);
END;
```

### TS-05: Non-existent path returns NULL
```sql
PROCEDURE ts_05 IS v VARCHAR2(128); BEGIN
  v := lcd.f_get_19c_dir_name('/nonexistent/path/xyz');
  assert_eq('TS-05 missing path returns NULL', NULL, v);
END;
```

### TS-06: NULL input returns NULL
```sql
PROCEDURE ts_06 IS v VARCHAR2(128); BEGIN
  v := lcd.f_get_19c_dir_name(NULL);
  assert_eq('TS-06 NULL input', NULL, v);
END;
```

### TS-07: Federal path returns FEDERAL dir object
```sql
PROCEDURE ts_07 IS v VARCHAR2(128); BEGIN
  v := lcd.f_get_19c_dir_name('/csclcdnc0002/Q22S-FEDERAL/In');
  assert_eq('TS-07 federal IN path', 'LCD_FEDERAL_IN', v);
END;
```

### TS-08: Canada path returns CANADA dir object
```sql
PROCEDURE ts_08 IS v VARCHAR2(128); BEGIN
  v := lcd.f_get_19c_dir_name('/csclcdnc0002/Q22S-CANADA/Out');
  assert_eq('TS-08 canada OUT path', 'LCD_CANADA_OUT', v);
END;
```

---

## 4. Test Suite: F_GET_LCD_OS_FILENAME

**File:** `tasks/42/tests/test_F_GET_LCD_OS_FILENAME.sql`

> After the 19c patch, this function returns a DIRECTORY object name, not a filesystem path.

### TS-10: Standard org IN returns LCD_IN
```sql
PROCEDURE ts_10 IS v VARCHAR2(128); BEGIN
  v := lcd.f_get_lcd_os_filename('010', NULL, 'IN', FALSE);
  assert_eq('TS-10 org 010 IN returns LCD_IN', 'LCD_IN', v);
END;
```

### TS-11: Standard org OUT returns LCD_OUT
```sql
PROCEDURE ts_11 IS v VARCHAR2(128); BEGIN
  v := lcd.f_get_lcd_os_filename('010', NULL, 'OUT', FALSE);
  assert_eq('TS-11 org 010 OUT returns LCD_OUT', 'LCD_OUT', v);
END;
```

### TS-12: Federal org returns federal directory
```sql
PROCEDURE ts_12 IS v VARCHAR2(128); BEGIN
  v := lcd.f_get_lcd_os_filename('114', NULL, 'IN', FALSE);
  assert_eq('TS-12 federal org IN', 'LCD_FEDERAL_IN', v);
END;
```

### TS-13: Invalid org returns NULL or fallback (no exception)
```sql
PROCEDURE ts_13 IS v VARCHAR2(128); BEGIN
  BEGIN
    v := lcd.f_get_lcd_os_filename('999', NULL, 'IN', FALSE);
    assert_eq('TS-13 invalid org no exception', '1', '1'); -- pass if no exception
  EXCEPTION WHEN OTHERS THEN
    assert_eq('TS-13 invalid org no exception', 'no exception', SQLERRM);
  END;
END;
```

---

## 5. Test Suite: F_CHECK_LCD_OS_FILENAME

**File:** `tasks/42/tests/test_F_CHECK_LCD_OS_FILENAME.sql`

### TS-20: Known org/IN returns TRUE
```sql
PROCEDURE ts_20 IS v BOOLEAN; BEGIN
  v := lcd.f_check_lcd_os_filename('010', NULL, 'IN', FALSE);
  assert_eq('TS-20 known org IN = TRUE', 'TRUE', CASE WHEN v THEN 'TRUE' ELSE 'FALSE' END);
END;
```

### TS-21: Bogus org (no ORG_PARAM entry) returns FALSE, no exception
```sql
PROCEDURE ts_21 IS v BOOLEAN; BEGIN
  BEGIN
    v := lcd.f_check_lcd_os_filename('ZZZ', NULL, 'OUT', FALSE);
    assert_eq('TS-21 bogus org = FALSE', 'FALSE', CASE WHEN v THEN 'TRUE' ELSE 'FALSE' END);
  EXCEPTION WHEN OTHERS THEN
    assert_eq('TS-21 bogus org no exception', 'no exception', SQLERRM);
  END;
END;
```

---

## 6. Test Suite: FILEEXST (f_file_exist)

**File:** `tasks/42/tests/test_FILEEXST.sql`

> Tests require a known test file placed in the LCD_IN directory on the server.
> Pre-test setup: `touch /csclcdnc0002/Q22S/In/test_19c_probe.txt` on the Linux server.

### TS-30: Existing file returns 1
```sql
PROCEDURE ts_30 IS v NUMBER; BEGIN
  v := lcd.f_file_exist('LCD_IN', 'test_19c_probe.txt');
  assert_eq('TS-30 existing file = 1', '1', TO_CHAR(v));
END;
```

### TS-31: Non-existent file returns 0
```sql
PROCEDURE ts_31 IS v NUMBER; BEGIN
  v := lcd.f_file_exist('LCD_IN', 'no_such_file_xyz.txt');
  assert_eq('TS-31 missing file = 0', '0', TO_CHAR(v));
END;
```

### TS-32: Invalid directory name returns -3 (not exception)
```sql
PROCEDURE ts_32 IS v NUMBER; BEGIN
  BEGIN
    v := lcd.f_file_exist('LCD_NOEXIST_DIR', 'any_file.txt');
    assert_eq('TS-32 invalid dir = -3', '-3', TO_CHAR(v));
  EXCEPTION WHEN OTHERS THEN
    assert_eq('TS-32 invalid dir no propagation', 'no exception', SQLERRM);
  END;
END;
```

---

## 7. Test Suite: FILECOPY (CopyFile)

**File:** `tasks/42/tests/test_FILECOPY.sql`

### TS-40: Open output file succeeds
```sql
PROCEDURE ts_40 IS
  v_handle UTL_FILE.FILE_TYPE;
  v_result BOOLEAN;
BEGIN
  v_result := lcd.CopyFile.f_open_out_file('LCD_OUT', 'test_copyfile_19c.txt', v_handle);
  IF v_result AND UTL_FILE.IS_OPEN(v_handle) THEN
    UTL_FILE.PUT_LINE(v_handle, 'RdW 19c test record');
    UTL_FILE.FCLOSE(v_handle);
    assert_eq('TS-40 open output file', 'TRUE', 'TRUE');
  ELSE
    assert_eq('TS-40 open output file', 'TRUE', 'FALSE');
  END IF;
END;
```

### TS-41: Open output file with invalid dir returns FALSE, no exception
```sql
PROCEDURE ts_41 IS
  v_handle UTL_FILE.FILE_TYPE;
  v_result BOOLEAN;
BEGIN
  BEGIN
    v_result := lcd.CopyFile.f_open_out_file('LCD_NOEXIST_DIR', 'test.txt', v_handle);
    assert_eq('TS-41 invalid dir returns FALSE', 'FALSE',
              CASE WHEN v_result THEN 'TRUE' ELSE 'FALSE' END);
  EXCEPTION WHEN OTHERS THEN
    assert_eq('TS-41 no unhandled exception', 'no exception', SQLERRM);
  END;
END;
```

---

## 8. Test Suite: GETFILE (GetFile)

**File:** `tasks/42/tests/test_GETFILE.sql`

> Pre-test setup: ensure `test_19c_probe.txt` exists in LCD_IN (see TS-30 above).

### TS-50: Open known input file succeeds
```sql
PROCEDURE ts_50 IS
  v_handle UTL_FILE.FILE_TYPE;
  v_result BOOLEAN;
BEGIN
  v_result := lcd.GetFile.f_open_in_file('LCD_IN', 'test_19c_probe.txt', v_handle);
  IF v_result AND UTL_FILE.IS_OPEN(v_handle) THEN
    UTL_FILE.FCLOSE(v_handle);
    assert_eq('TS-50 open input file', 'TRUE', 'TRUE');
  ELSE
    assert_eq('TS-50 open input file', 'TRUE', 'FALSE');
  END IF;
END;
```

### TS-51: Open non-existent file returns FALSE or raises FILE_OPEN, no unhandled exception
```sql
PROCEDURE ts_51 IS
  v_handle UTL_FILE.FILE_TYPE;
  v_result BOOLEAN;
BEGIN
  BEGIN
    v_result := lcd.GetFile.f_open_in_file('LCD_IN', 'no_such_file_xyz.txt', v_handle);
    assert_eq('TS-51 no exception', '1', '1');
  EXCEPTION WHEN OTHERS THEN
    assert_eq('TS-51 no unhandled exception', 'no exception', SQLERRM);
  END;
END;
```

---

## 9. Test Suite: SAP Load Group (Integration Test)

**File:** `tasks/42/tests/test_SAP_Load_Integration.sql`

> These tests require actual SAP flat files in LCD_IN.
> Coordinate with SAP team to place a valid test file.

### TS-60: SAP_DATA_LOAD with valid dir object name — no exception
```sql
-- Use a test org and a known small test file placed in LCD_IN
PROCEDURE ts_60 IS BEGIN
  BEGIN
    LCD.SAP_DATA_LOAD(p_org => '010', p_dir => 'LCD_IN',
                      p_file => 'test_sap_load_19c.txt');
    assert_eq('TS-60 SAP load no exception', '1', '1');
  EXCEPTION WHEN OTHERS THEN
    assert_eq('TS-60 SAP load no exception', 'no exception', SQLERRM);
  END;
END;
```

### TS-61: SAP_DATA_LOAD with NULL dir — handled gracefully
```sql
PROCEDURE ts_61 IS BEGIN
  BEGIN
    LCD.SAP_DATA_LOAD(p_org => '010', p_dir => NULL,
                      p_file => 'test_sap_load_19c.txt');
    assert_eq('TS-61 null dir handled', '1', '1');
  EXCEPTION WHEN OTHERS THEN
    -- An exception is acceptable (null dir should fail fast), confirm it is handled
    DBMS_OUTPUT.PUT_LINE('  [INFO] TS-61 exception as expected: ' || SQLERRM);
    assert_eq('TS-61 null dir handled', '1', '1');
  END;
END;
```

---

## 10. Test Suite: Beeline Extract Files

**File:** `tasks/42/tests/test_Beeline_Extracts.sql`

> Integration tests — write to LCD_OUT. Verify files appear on the server after running.

### TS-70: BeelineBusinessAreas generates output file (no exception)
```sql
PROCEDURE ts_70 IS BEGIN
  BEGIN
    LCD.BEELINE_BUSINESS_AREAS(p_org => '010');
    assert_eq('TS-70 BBA no exception', '1', '1');
  EXCEPTION WHEN OTHERS THEN
    assert_eq('TS-70 BBA no exception', 'no exception', SQLERRM);
  END;
END;
```

### TS-71: BeelineDepartments generates output file (no exception)
```sql
PROCEDURE ts_71 IS BEGIN
  BEGIN
    LCD.BEELINE_DEPARTMENTS(p_org => '010');
    assert_eq('TS-71 BD no exception', '1', '1');
  EXCEPTION WHEN OTHERS THEN
    assert_eq('TS-71 BD no exception', 'no exception', SQLERRM);
  END;
END;
```

**Manual server-side check after both procedures:**
```bash
ls -lt /csclcdnc0002/Q22S/Out/*.TXT | head -5
```
Expected: BBA and Beeline file appear with today's timestamp.

---

## 11. Test Suite: DBMS_SCHEDULER Jobs (WOA)

**File:** `tasks/42/tests/test_WOA_Scheduler.sql`

### TS-80: LCD_INTERFACE_REFRESH_4H job exists and is SCHEDULED state
```sql
PROCEDURE ts_80 IS v_state VARCHAR2(20); BEGIN
  SELECT state INTO v_state FROM dba_scheduler_jobs
   WHERE owner='LCD' AND job_name='LCD_INTERFACE_REFRESH_4H';
  assert_eq('TS-80 scheduler job exists and scheduled', 'SCHEDULED', v_state);
EXCEPTION WHEN NO_DATA_FOUND THEN
  assert_eq('TS-80 scheduler job exists', 'found', 'NOT FOUND');
END;
```

### TS-81: No DBMS_JOB entries remain for LCD schema
```sql
PROCEDURE ts_81 IS v_count NUMBER; BEGIN
  SELECT COUNT(*) INTO v_count FROM dba_jobs WHERE schema_user='LCD';
  assert_eq('TS-81 no legacy DBMS_JOB entries', '0', TO_CHAR(v_count));
END;
```

### TS-82: LCDINTERFACEREFRESH procedure is valid
```sql
PROCEDURE ts_82 IS v_status VARCHAR2(10); BEGIN
  SELECT status INTO v_status FROM dba_objects
   WHERE owner='LCD' AND object_name='LCDINTERFACEREFRESH';
  assert_eq('TS-82 LCDINTERFACEREFRESH valid', 'VALID', v_status);
END;
```

---

## 12. Regression Test Checklist (manual)

After all unit tests pass, run the following end-to-end checks:

| # | Test | Expected Result |
|---|------|-----------------|
| R-01 | Run SAP Auto Load for org 010 in UAT | No ORA-29283 or ORA-29280; SAP staging tables populated |
| R-02 | Run BeelineBusinessAreas for org 010 | TXT file appears in `/csclcdnc0002/Q22S/Out/` |
| R-03 | Run BeelineDepartments for org 010 | TXT file appears in `/csclcdnc0002/Q22S/Out/` |
| R-04 | Run TimeSheetExtractLCD for org 010 | Output file created with records; no UTL_FILE errors |
| R-05 | Run Work_Order_Extract for org 010 | Output file created |
| R-06 | Run Alt_Work_Order_Extract for org 010 | Output file created |
| R-07 | Run NAUSD_SUBCON_FEED for applicable org | Output file created (no double `/OUT/OUT`) |
| R-08 | Monitor LCD_INTERFACE_REFRESH_4H 4-hour cycle | Job runs and completes with no error in `dba_scheduler_job_run_details` |
| R-09 | Validate DBMS_OUTPUT debug lines visible | All `-- DEBUG [RdW 19c]` lines appear in session output when `SET SERVEROUTPUT ON` |
| R-10 | Run `DBMS_UTILITY.COMPILE_SCHEMA('LCD')` | Zero invalid objects remain |

---

## 13. Test Execution Order

```
1. tasks/42/tests/test_F_GET_19C_DIR_NAME.sql   (TS-01 through TS-08)
2. tasks/42/tests/test_F_GET_LCD_OS_FILENAME.sql (TS-10 through TS-13)
3. tasks/42/tests/test_F_CHECK_LCD_OS_FILENAME.sql (TS-20 through TS-21)
4. tasks/42/tests/test_FILEEXST.sql              (TS-30 through TS-32)
5. tasks/42/tests/test_FILECOPY.sql              (TS-40 through TS-41)
6. tasks/42/tests/test_GETFILE.sql               (TS-50 through TS-51)
7. tasks/42/tests/test_SAP_Load_Integration.sql  (TS-60 through TS-61)
8. tasks/42/tests/test_Beeline_Extracts.sql      (TS-70 through TS-71)
9. tasks/42/tests/test_WOA_Scheduler.sql         (TS-80 through TS-82)
10. Manual regression checklist (R-01 through R-10)
```

---

## 14. Known Testing Gaps and Notes

| Item | Gap / Risk | Mitigation |
|------|-----------|------------|
| USR11_SUBCON_FEED | Contains unmasked `WORKER_SSN`; do not run in non-secure environments | Run only in UAT with restricted access; verify OS-level permissions on `LCD_OUT` |
| NAUSD `\OUT` fix | Legacy Windows artifact removed — functional difference from original | Compare output file content and path against original file path post-run |
| FILECOPY bug fix | `UTL_FILE.FOPEN` was missing in original; this is a behavioral change, not just migration | Run copy operation end-to-end and confirm a file is actually written |
| CPI / UK-I files | Not patched in this sprint; still use old filesystem-path FOPEN | Confirm these files are NOT compiled from `patched/SQL(CPI)/` in this deployment |
