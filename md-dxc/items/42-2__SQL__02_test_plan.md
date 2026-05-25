# Oracle 11g → 19c Migration – Unit Test Plan

## Overview

This test plan validates that all patched LCD PL/SQL scripts correctly use Oracle 19c Directory Objects for file I/O instead of the deprecated `UTL_FILE_DIR` filesystem paths. The plan is structured as a test harness that can be run in any environment (DEV, QA, UAT) where the DBA has created the required directory objects.

---

## Prerequisites

1. **Oracle 19c database** with LCD schema deployed
2. **Directory objects** created per `DB_DIRECTORIES.txt`
3. **Grants**: LCD schema has READ/WRITE on all `LCD_*` directories
4. **Test files**: Create small test files in the filesystem directories
5. **SERVEROUTPUT enabled**: `SET SERVEROUTPUT ON SIZE UNLIMITED`

### Setup: Create Test Files

Run on the Oracle Linux server as a user with write access:

```bash
# Create test import files for default org path
echo "TEST_HEADER|EMPLOYEE|571" > /csclcdnc0002/Q22S/In/test_19c_import.txt
echo "TEST_ROW|12345|8.0" >> /csclcdnc0002/Q22S/In/test_19c_import.txt

# Create test file for Canada org path
echo "TEST_HEADER|EMPLOYEE|574" > /csclcdnc0002/Q22S-CANADA/IN/test_19c_import.txt

# Create test file for Federal org path
echo "TEST_HEADER|EMPLOYEE|114" > /csclcdnc0002/Q22S-FEDERAL/IN/test_19c_import.txt

# Create test file for org 663
echo "TEST_HEADER|EMPLOYEE|663" > /csclcdnc0002/Q22S-663/IN/test_19c_import.txt
```

---

## Phase 1 Tests: Central Directory Resolver

### Test 1.1: `f_get_lcd_directory_name` – Default Org (IN)

```sql
SET SERVEROUTPUT ON SIZE UNLIMITED
DECLARE
  v_dir VARCHAR2(128);
BEGIN
  v_dir := f_get_lcd_directory_name(a_org_code => '571', stub => 'IN', archiveflag => FALSE);
  DBMS_OUTPUT.PUT_LINE('TEST 1.1: Org 571 IN = [' || NVL(v_dir, 'NULL') || ']');
  IF v_dir = 'LCD_IN' THEN
    DBMS_OUTPUT.PUT_LINE('TEST 1.1: PASS');
  ELSE
    DBMS_OUTPUT.PUT_LINE('TEST 1.1: FAIL - Expected LCD_IN, got ' || NVL(v_dir, 'NULL'));
  END IF;
END;
/
```
**Expected:** `LCD_IN`

### Test 1.2: `f_get_lcd_directory_name` – Default Org (OUT)

```sql
DECLARE
  v_dir VARCHAR2(128);
BEGIN
  v_dir := f_get_lcd_directory_name(a_org_code => '571', stub => 'OUT', archiveflag => FALSE);
  DBMS_OUTPUT.PUT_LINE('TEST 1.2: Org 571 OUT = [' || NVL(v_dir, 'NULL') || ']');
  IF v_dir = 'LCD_OUT' THEN
    DBMS_OUTPUT.PUT_LINE('TEST 1.2: PASS');
  ELSE
    DBMS_OUTPUT.PUT_LINE('TEST 1.2: FAIL');
  END IF;
END;
/
```
**Expected:** `LCD_OUT`

### Test 1.3: `f_get_lcd_directory_name` – Archive Path

```sql
DECLARE
  v_dir VARCHAR2(128);
BEGIN
  v_dir := f_get_lcd_directory_name(a_org_code => '571', stub => 'IN', archiveflag => TRUE);
  DBMS_OUTPUT.PUT_LINE('TEST 1.3: Org 571 ARCHIVE/IN = [' || NVL(v_dir, 'NULL') || ']');
  IF v_dir = 'LCD_ARCH_IN' THEN
    DBMS_OUTPUT.PUT_LINE('TEST 1.3: PASS');
  ELSE
    DBMS_OUTPUT.PUT_LINE('TEST 1.3: FAIL');
  END IF;
END;
/
```
**Expected:** `LCD_ARCH_IN`

### Test 1.4: `f_get_lcd_directory_name` – Org-Specific Path (Canada)

```sql
DECLARE
  v_dir VARCHAR2(128);
BEGIN
  v_dir := f_get_lcd_directory_name(a_org_code => '574', stub => 'IN', archiveflag => FALSE);
  DBMS_OUTPUT.PUT_LINE('TEST 1.4: Org 574 IN = [' || NVL(v_dir, 'NULL') || ']');
  IF v_dir = 'LCD_CANADA_IN' THEN
    DBMS_OUTPUT.PUT_LINE('TEST 1.4: PASS');
  ELSE
    DBMS_OUTPUT.PUT_LINE('TEST 1.4: FAIL');
  END IF;
END;
/
```
**Expected:** `LCD_CANADA_IN`

### Test 1.5: `f_get_lcd_directory_name` – Org-Specific Path (Federal)

```sql
DECLARE
  v_dir VARCHAR2(128);
BEGIN
  v_dir := f_get_lcd_directory_name(a_org_code => '114', stub => 'OUT', archiveflag => FALSE);
  DBMS_OUTPUT.PUT_LINE('TEST 1.5: Org 114 OUT = [' || NVL(v_dir, 'NULL') || ']');
  IF v_dir = 'LCD_FEDERAL_OUT' THEN
    DBMS_OUTPUT.PUT_LINE('TEST 1.5: PASS');
  ELSE
    DBMS_OUTPUT.PUT_LINE('TEST 1.5: FAIL');
  END IF;
END;
/
```
**Expected:** `LCD_FEDERAL_OUT`

### Test 1.6: `f_get_lcd_directory_name` – Archive for Org-Specific Path

```sql
DECLARE
  v_dir VARCHAR2(128);
BEGIN
  v_dir := f_get_lcd_directory_name(a_org_code => '574', stub => 'OUT', archiveflag => TRUE);
  DBMS_OUTPUT.PUT_LINE('TEST 1.6: Org 574 ARCHIVE/OUT = [' || NVL(v_dir, 'NULL') || ']');
  IF v_dir = 'LCD_CANADA_ARCH_OUT' THEN
    DBMS_OUTPUT.PUT_LINE('TEST 1.6: PASS');
  ELSE
    DBMS_OUTPUT.PUT_LINE('TEST 1.6: FAIL');
  END IF;
END;
/
```
**Expected:** `LCD_CANADA_ARCH_OUT`

### Test 1.7: `f_get_lcd_directory_name` – NULL Org (use server_loc)

```sql
DECLARE
  v_dir VARCHAR2(128);
BEGIN
  v_dir := f_get_lcd_directory_name(a_org_code => NULL, a_server_loc => '/csclcdnc0002/Q22S', stub => 'IN', archiveflag => FALSE);
  DBMS_OUTPUT.PUT_LINE('TEST 1.7: server_loc IN = [' || NVL(v_dir, 'NULL') || ']');
  IF v_dir = 'LCD_IN' THEN
    DBMS_OUTPUT.PUT_LINE('TEST 1.7: PASS');
  ELSE
    DBMS_OUTPUT.PUT_LINE('TEST 1.7: FAIL');
  END IF;
END;
/
```
**Expected:** `LCD_IN`

### Test 1.8: `f_get_lcd_directory_name` – Invalid Org (graceful failure)

```sql
DECLARE
  v_dir VARCHAR2(128);
BEGIN
  v_dir := f_get_lcd_directory_name(a_org_code => 'ZZZ', stub => 'IN', archiveflag => FALSE);
  DBMS_OUTPUT.PUT_LINE('TEST 1.8: Invalid org = [' || NVL(v_dir, 'NULL') || ']');
  IF v_dir IS NULL THEN
    DBMS_OUTPUT.PUT_LINE('TEST 1.8: PASS (graceful NULL return)');
  ELSE
    DBMS_OUTPUT.PUT_LINE('TEST 1.8: FAIL - Expected NULL');
  END IF;
END;
/
```
**Expected:** `NULL` (no exception raised)

### Test 1.9: `f_get_lcd_os_filename` – Backward Compatibility

```sql
DECLARE
  v_result VARCHAR2(128);
BEGIN
  v_result := f_get_lcd_os_filename(a_org_code => '571', stub => 'IN', archiveflag => FALSE);
  DBMS_OUTPUT.PUT_LINE('TEST 1.9: f_get_lcd_os_filename = [' || NVL(v_result, 'NULL') || ']');
  IF v_result = 'LCD_IN' THEN
    DBMS_OUTPUT.PUT_LINE('TEST 1.9: PASS (now returns directory name)');
  ELSE
    DBMS_OUTPUT.PUT_LINE('TEST 1.9: FAIL');
  END IF;
END;
/
```
**Expected:** `LCD_IN` (same as the new function)

### Test 1.10: `f_check_lcd_os_filename` – Validation

```sql
DECLARE
  v_result BOOLEAN;
BEGIN
  v_result := f_check_lcd_os_filename(a_org_code => '571', stub => 'IN', archiveflag => FALSE);
  IF v_result THEN
    DBMS_OUTPUT.PUT_LINE('TEST 1.10: PASS (directory found)');
  ELSE
    DBMS_OUTPUT.PUT_LINE('TEST 1.10: FAIL (directory not found)');
  END IF;
END;
/
```
**Expected:** `TRUE`

---

## Phase 2 Tests: Core I/O Wrappers

### Test 2.1: `shared.f_open_in_file` – Read a File

```sql
DECLARE
  v_handle UTL_FILE.FILE_TYPE;
  v_result BOOLEAN;
  v_line   VARCHAR2(4000);
  v_rtn    INTEGER;
BEGIN
  v_result := lcd.shared.f_open_in_file('571', 'test_19c_import.txt', v_handle);
  IF v_result THEN
    DBMS_OUTPUT.PUT_LINE('TEST 2.1a: File opened successfully - PASS');
    v_rtn := lcd.shared.f_get_in_line(v_handle, v_line);
    DBMS_OUTPUT.PUT_LINE('TEST 2.1b: First line = [' || NVL(v_line, 'NULL') || ']');
    IF v_rtn > 0 THEN
      DBMS_OUTPUT.PUT_LINE('TEST 2.1b: PASS');
    ELSE
      DBMS_OUTPUT.PUT_LINE('TEST 2.1b: FAIL - return code: ' || v_rtn);
    END IF;
    lcd.shared.close_file(v_handle);
  ELSE
    DBMS_OUTPUT.PUT_LINE('TEST 2.1a: FAIL - Could not open file');
  END IF;
END;
/
```
**Expected:** File opens, first line reads successfully.

### Test 2.2: `shared.f_open_out_file` – Write a File

```sql
DECLARE
  v_handle UTL_FILE.FILE_TYPE;
  v_result BOOLEAN;
BEGIN
  v_result := lcd.shared.f_open_out_file('571', 'test_19c_output.txt', v_handle);
  IF v_result THEN
    DBMS_OUTPUT.PUT_LINE('TEST 2.2: Output file opened - PASS');
    UTL_FILE.PUT_LINE(v_handle, 'Test output line from 19c migration');
    lcd.shared.close_file(v_handle);
  ELSE
    DBMS_OUTPUT.PUT_LINE('TEST 2.2: FAIL - Could not open output file');
  END IF;
END;
/
```
**Expected:** File created in `/csclcdnc0002/Q22S/Out/test_19c_output.txt`.

### Test 2.3: `lcd.f_file_exist` – File Exists Check

```sql
DECLARE
  v_result INTEGER;
BEGIN
  -- Should find test file
  v_result := lcd.f_file_exist('571', 'test_19c_import.txt');
  DBMS_OUTPUT.PUT_LINE('TEST 2.3a: Existing file = ' || v_result);
  IF v_result = 1 THEN
    DBMS_OUTPUT.PUT_LINE('TEST 2.3a: PASS');
  ELSE
    DBMS_OUTPUT.PUT_LINE('TEST 2.3a: FAIL - Expected 1');
  END IF;

  -- Should NOT find this file
  v_result := lcd.f_file_exist('571', 'nonexistent_file_xyz.txt');
  DBMS_OUTPUT.PUT_LINE('TEST 2.3b: Non-existing file = ' || v_result);
  IF v_result = 0 THEN
    DBMS_OUTPUT.PUT_LINE('TEST 2.3b: PASS');
  ELSE
    DBMS_OUTPUT.PUT_LINE('TEST 2.3b: FAIL - Expected 0');
  END IF;
END;
/
```

### Test 2.4: `getfile.f_open_in_file` – Import Package

```sql
DECLARE
  v_handle UTL_FILE.FILE_TYPE;
  v_result BOOLEAN;
BEGIN
  v_result := lcd.getfile.f_open_in_file('571', 'test_19c_import.txt', v_handle);
  IF v_result THEN
    DBMS_OUTPUT.PUT_LINE('TEST 2.4: GetFile open - PASS');
    lcd.getfile.CloseFile(v_handle);
  ELSE
    DBMS_OUTPUT.PUT_LINE('TEST 2.4: FAIL');
  END IF;
END;
/
```

### Test 2.5: `lcd.fExists` – Batch File Exists

```sql
DECLARE
  v_result BOOLEAN;
BEGIN
  v_result := lcd.fExists('test_19c_import.txt', '/csclcdnc0002/Q22S', 'IN');
  IF v_result THEN
    DBMS_OUTPUT.PUT_LINE('TEST 2.5: fExists - PASS');
  ELSE
    DBMS_OUTPUT.PUT_LINE('TEST 2.5: FAIL');
  END IF;
END;
/
```

### Test 2.6: `lcd.ServerFileCopy` – Archive Copy

```sql
BEGIN
  -- First ensure test file exists in Out directory
  DECLARE
    v_handle UTL_FILE.FILE_TYPE;
    v_result BOOLEAN;
  BEGIN
    v_result := lcd.shared.f_open_out_file('571', 'test_19c_archive.txt', v_handle);
    IF v_result THEN
      UTL_FILE.PUT_LINE(v_handle, 'Archive test content');
      lcd.shared.close_file(v_handle);
    END IF;
  END;

  -- Test the copy
  lcd.ServerFileCopy('571', 'test_19c_archive.txt', '/csclcdnc0002/Q22S', 'OUT');
  DBMS_OUTPUT.PUT_LINE('TEST 2.6: ServerFileCopy - PASS (no exception)');
EXCEPTION
  WHEN OTHERS THEN
    DBMS_OUTPUT.PUT_LINE('TEST 2.6: FAIL - ' || SQLERRM);
END;
/
```

---

## Phase 3 Tests: Direct FOPEN Callers (Smoke Tests)

These tests verify compilation and basic execution without errors. Full functional testing requires real business data.

### Test 3.1: Verify All Objects Are Valid

```sql
SELECT object_name, object_type, status
  FROM user_objects
 WHERE object_name IN (
   'F_GET_LCD_DIRECTORY_NAME', 'F_GET_LCD_OS_FILENAME', 'F_CHECK_LCD_OS_FILENAME',
   'SHARED', 'GETFILE', 'COPYFILE', 'F_FILE_EXIST',
   'FEXISTS', 'GET_NEXTLINE', 'FILEINFOPERMISSION', 'SERVERFILECOPY', 'SERVERFILEMOVE',
   'FILECOPYOPEN', 'FILECOPYWRITE', 'FILECOPYCLOSE',
   'GETEXPNAMES', 'GETTRANSDATA', 'GETCLOSEFILE', 'GETOPENFILE',
   'TES_REPORTS', 'TIMESTOREINDB',
   'UNAPPROVED_HOURS', 'ALT_WORK_ORDER_EXTRACT', 'WORK_ORDER_EXTRACT',
   'BEELINE_BUSINESS_AREAS', 'BEELINE_DEPARTMENTS',
   'ALL_DEPARTMENTS_BEELINE', 'NAUSD_SUBCON_FEED', 'USR11_SUBCON_FEED',
   'SA_NOTIME', 'SUBCO_NOTIME_TERM', 'LCD_USER_AUDIT',
   'WEEKLY_NPS_EXTRACT', 'NPS_DEPARTMENT_SELECT',
   'TIMESHEET_EXTRACT_LCD', 'SAP_DATA_LOAD'
 )
 ORDER BY object_name, object_type;
```
**Expected:** All STATUS = VALID. If any are INVALID, check compilation errors:
```sql
SHOW ERRORS FUNCTION f_get_lcd_directory_name
SHOW ERRORS PACKAGE BODY shared
-- etc.
```

### Test 3.2: Cross-Org Directory Resolution Sweep

```sql
DECLARE
  v_dir VARCHAR2(128);
  CURSOR c_orgs IS
    SELECT org_code, lcd_server_loc
      FROM lcd.org_param
     WHERE lcd_server_loc IS NOT NULL
     ORDER BY org_code;
BEGIN
  FOR r IN c_orgs LOOP
    BEGIN
      v_dir := f_get_lcd_directory_name(a_org_code => r.org_code, stub => 'IN', archiveflag => FALSE);
      DBMS_OUTPUT.PUT_LINE('Org ' || r.org_code || ' → ' || NVL(v_dir, '*** NOT FOUND ***') ||
                           ' (path: ' || r.lcd_server_loc || ')');
    EXCEPTION
      WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Org ' || r.org_code || ' → ERROR: ' || SQLERRM);
    END;
  END LOOP;
END;
/
```
**Expected:** Every org resolves to a valid directory name. Any `*** NOT FOUND ***` results indicate a missing directory object that the DBA needs to create.

---

## Cleanup: Remove Test Files

After all tests pass:

```bash
rm /csclcdnc0002/Q22S/In/test_19c_import.txt
rm /csclcdnc0002/Q22S/Out/test_19c_output.txt
rm /csclcdnc0002/Q22S/Out/test_19c_archive.txt
rm /csclcdnc0002/Q22S/Archive/Out/test_19c_archive.txt
rm /csclcdnc0002/Q22S-CANADA/IN/test_19c_import.txt
rm /csclcdnc0002/Q22S-FEDERAL/IN/test_19c_import.txt
rm /csclcdnc0002/Q22S-663/IN/test_19c_import.txt
```

---

## Test Results Summary Template

| Test | Description | Expected | Actual | Pass/Fail |
|---|---|---|---|---|
| 1.1 | Default org IN resolution | LCD_IN | | |
| 1.2 | Default org OUT resolution | LCD_OUT | | |
| 1.3 | Archive path resolution | LCD_ARCH_IN | | |
| 1.4 | Canada org IN resolution | LCD_CANADA_IN | | |
| 1.5 | Federal org OUT resolution | LCD_FEDERAL_OUT | | |
| 1.6 | Canada archive OUT resolution | LCD_CANADA_ARCH_OUT | | |
| 1.7 | NULL org with server_loc | LCD_IN | | |
| 1.8 | Invalid org graceful failure | NULL | | |
| 1.9 | f_get_lcd_os_filename backward compat | LCD_IN | | |
| 1.10 | f_check_lcd_os_filename validation | TRUE | | |
| 2.1 | shared.f_open_in_file read | File opened | | |
| 2.2 | shared.f_open_out_file write | File created | | |
| 2.3a | f_file_exist (existing) | 1 | | |
| 2.3b | f_file_exist (non-existing) | 0 | | |
| 2.4 | getfile.f_open_in_file | File opened | | |
| 2.5 | fExists batch utility | TRUE | | |
| 2.6 | ServerFileCopy archive | No exception | | |
| 3.1 | All objects VALID | No INVALID rows | | |
| 3.2 | Cross-org sweep | All orgs resolve | | |

---

## Troubleshooting Test Failures

### Test fails with `ORA-29280: invalid directory path`
The resolver returned a directory name that doesn't exist in `ALL_DIRECTORIES`. Run:
```sql
SELECT directory_name FROM all_directories WHERE directory_name LIKE 'LCD%';
```
Compare with what the resolver returned. Ask DBA to create missing directory.

### Test fails with `ORA-29289: directory access denied`
The LCD schema lacks grants. Run as DBA:
```sql
GRANT READ, WRITE ON DIRECTORY <dir_name> TO LCD;
```

### Test fails with `ORA-06512` / compilation error
Check the specific error:
```sql
SELECT line, text FROM user_errors WHERE name = '<OBJECT_NAME>' ORDER BY line;
```
Most likely cause: the new resolver function wasn't compiled first.

### Test 3.2 shows `*** NOT FOUND ***` for some orgs
Those orgs have a `LCD_SERVER_LOC` path that doesn't match any directory object. Either:
1. The DBA needs to create a new directory object for that path
2. The `LCD_SERVER_LOC` value needs updating to match an existing directory path
