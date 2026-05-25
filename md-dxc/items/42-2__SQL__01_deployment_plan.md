# Oracle 11g → 19c Migration – Deployment Plan

## Pre-Deployment Checklist

### 1. Verify DBA Directory Objects Exist

Connect as a DBA or privileged user and run:

```sql
-- Verify all expected directory objects exist
SELECT directory_name, directory_path
  FROM all_directories
 WHERE directory_name LIKE 'LCD%'
 ORDER BY directory_name;
```

**Expected result (UAT – Q22S):**

| DIRECTORY_NAME | DIRECTORY_PATH |
|---|---|
| LCD | /csclcdnc0002/Q22S |
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

If any are missing, the DBA must create them:
```sql
CREATE OR REPLACE DIRECTORY LCD_IN AS '/csclcdnc0002/Q22S/In';
GRANT READ, WRITE ON DIRECTORY LCD_IN TO LCD;
```

### 2. Verify LCD Schema Grants

```sql
-- LCD user must have READ/WRITE on all LCD directories
SELECT privilege, directory_name
  FROM all_tab_privs
 WHERE grantee = 'LCD'
   AND table_name LIKE 'LCD%'
   AND privilege IN ('READ', 'WRITE')
 ORDER BY directory_name;
```

**Expected:** Each LCD_ directory should have both READ and WRITE grants.

If missing:
```sql
GRANT READ, WRITE ON DIRECTORY LCD_IN TO LCD;
GRANT READ, WRITE ON DIRECTORY LCD_OUT TO LCD;
-- etc. for all directories
```

### 3. Verify Filesystem Directories Exist and Are Accessible

From the Oracle Linux server:
```bash
# Check all paths are accessible
ls -la /csclcdnc0002/Q22S/In/
ls -la /csclcdnc0002/Q22S/Out/
ls -la /csclcdnc0002/Q22S/Archive/In/
ls -la /csclcdnc0002/Q22S/Archive/Out/
# ... repeat for all org-specific paths
```

**Expected:** Directories exist and are readable/writable by the `oracle` OS user.

### 4. Verify LCD_SERVER_LOC Values

```sql
SELECT org_code, lcd_server_loc
  FROM lcd.org_param
 WHERE lcd_server_loc IS NOT NULL
 ORDER BY org_code;
```

**Expected:** All paths should start with `/csclcdnc0002/Q22S` (Linux format, not Windows backslash).

---

## Deployment Steps

### Step 1: Create Backup Point

```sql
-- Create a restore point (requires DBA)
CREATE RESTORE POINT BEFORE_19C_MIGRATION GUARANTEE FLASHBACK DATABASE;
```

Or at minimum, export the current package/function bodies:
```sql
-- Save current source for rollback
SPOOL rollback_source.sql
SELECT text FROM all_source WHERE owner = 'LCD' AND name IN (
  'F_GET_LCD_OS_FILENAME','F_CHECK_LCD_OS_FILENAME','SHARED','GETFILE','COPYFILE',
  'F_FILE_EXIST','FEXISTS','FILEINFOPERMISSION','SERVERFILECOPY','SERVERFILEMOVE'
) ORDER BY name, type, line;
SPOOL OFF
```

### Step 2: Deploy Central Resolver (Phase 1)

Deploy order matters – the resolver must be compiled first since other files depend on it.

```sql
-- Connect as LCD schema owner
CONNECT lcd/password@Q22S

-- 2a. Compile the new directory resolver function
@patched/F_GET_LCD_DIRECTORY_NAME.sql

-- Verify compilation
SELECT object_name, status FROM user_objects WHERE object_name = 'F_GET_LCD_DIRECTORY_NAME';
-- Expected: STATUS = VALID

-- 2b. Quick smoke test
SET SERVEROUTPUT ON
DECLARE
  v_dir VARCHAR2(128);
BEGIN
  v_dir := f_get_lcd_directory_name(a_org_code => '571', stub => 'IN', archiveflag => FALSE);
  DBMS_OUTPUT.PUT_LINE('Result: ' || v_dir);
END;
/
-- Expected: Result: LCD_IN  (or appropriate directory for org 571)

-- 2c. Compile updated f_get_lcd_os_filename (backward compat wrapper)
@patched/F_GET_LCD_OS_FILENAME.sql

-- 2d. Compile updated f_check_lcd_os_filename
@patched/F_CHECK_LCD_OS_FILENAME.sql

-- Verify both are VALID
SELECT object_name, status FROM user_objects
 WHERE object_name IN ('F_GET_LCD_OS_FILENAME','F_CHECK_LCD_OS_FILENAME');
```

### Step 3: Deploy Core I/O Wrappers (Phase 2)

```sql
-- 3a. Shared package body (largest change)
@patched/SHRD_BDY.SQL

-- Verify
SELECT object_name, object_type, status FROM user_objects
 WHERE object_name = 'SHARED' AND object_type = 'PACKAGE BODY';
-- Expected: STATUS = VALID

-- 3b. GetFile package
@patched/GETFILE.SQL

-- 3c. CopyFile package
@patched/FILECOPY.SQL

-- 3d. File exist function
@patched/FILEEXST.SQL

-- 3e. Batch utilities
@patched/BATCH.SQL

-- Verify all
SELECT object_name, object_type, status FROM user_objects
 WHERE object_name IN ('GETFILE','COPYFILE','F_FILE_EXIST','FEXISTS',
   'FILEINFOPERMISSION','SERVERFILECOPY','SERVERFILEMOVE','GET_NEXTLINE')
 ORDER BY object_name;
```

### Step 4: Deploy Direct FOPEN Callers (Phase 3)

```sql
-- Deploy in any order (these are independent)
@patched/TIMEDB2.SQL
@patched/Tes_Reports.bdy
@patched/UNAPPROVED_HOURS.sql
@patched/Alt_Work_Order_Extract.sql
@patched/Work_Order_Extract.sql
@patched/BeelineBusinessAreas.sql
@patched/BeelineDepartments.sql
@patched/ALL_DEPARTMENTS_BEELINE-proc.sql
@patched/NAUSD_SUBCON_FEED-proc.sql
@patched/USR11_SUBCON_FEED-proc.sql
@patched/sa_notime.sql
@patched/SUBCO_NOTIME_TERM.sql
@patched/LCD_USER_AUDIT-proc.sql
@patched/NPS_Department_Select.sql
@patched/TimeSheetExtractLCD.sql
@patched/WEEKLY_NPS_EXTRACT-proc.sql
@patched/Sap_Data_Load.prc

-- Verify all objects are VALID
SELECT object_name, object_type, status
  FROM user_objects
 WHERE status = 'INVALID'
 ORDER BY object_name;
-- Expected: No rows returned
```

### Step 5: Post-Deployment Verification

```sql
SET SERVEROUTPUT ON SIZE UNLIMITED

-- Test 1: Directory resolver for default org
DECLARE
  v_dir VARCHAR2(128);
BEGIN
  v_dir := f_get_lcd_directory_name(a_org_code => '571', stub => 'IN', archiveflag => FALSE);
  DBMS_OUTPUT.PUT_LINE('Org 571 IN: ' || NVL(v_dir, 'NULL'));
  
  v_dir := f_get_lcd_directory_name(a_org_code => '571', stub => 'OUT', archiveflag => FALSE);
  DBMS_OUTPUT.PUT_LINE('Org 571 OUT: ' || NVL(v_dir, 'NULL'));
  
  v_dir := f_get_lcd_directory_name(a_org_code => '571', stub => 'IN', archiveflag => TRUE);
  DBMS_OUTPUT.PUT_LINE('Org 571 ARCH IN: ' || NVL(v_dir, 'NULL'));
END;
/
-- Expected: LCD_IN, LCD_OUT, LCD_ARCH_IN

-- Test 2: Directory resolver for org-specific paths
DECLARE
  v_dir VARCHAR2(128);
BEGIN
  v_dir := f_get_lcd_directory_name(a_org_code => '574', stub => 'IN', archiveflag => FALSE);
  DBMS_OUTPUT.PUT_LINE('Org 574 (Canada) IN: ' || NVL(v_dir, 'NULL'));
  
  v_dir := f_get_lcd_directory_name(a_org_code => '114', stub => 'OUT', archiveflag => FALSE);
  DBMS_OUTPUT.PUT_LINE('Org 114 (Federal) OUT: ' || NVL(v_dir, 'NULL'));
END;
/
-- Expected: LCD_CANADA_IN, LCD_FEDERAL_OUT

-- Test 3: File existence check
DECLARE
  v_result INTEGER;
BEGIN
  v_result := lcd.f_file_exist('571', 'test_nonexistent.txt');
  DBMS_OUTPUT.PUT_LINE('File exist result: ' || v_result);
END;
/
-- Expected: 0 (file does not exist) or -3 (invalid path if test file missing)

-- Test 4: Verify no invalid objects
SELECT object_name, object_type, status
  FROM user_objects
 WHERE status = 'INVALID'
 ORDER BY object_name;
-- Expected: No rows
```

---

## Rollback Plan

If issues are found, restore from the `originals/` folder:

```sql
-- Rollback all changes
@originals/F_GET_LCD_OS_FILENAME.sql
@originals/F_CHECK_LCD_OS_FILENAME.sql
@originals/SHRD_BDY.SQL
@originals/GETFILE.SQL
@originals/FILECOPY.SQL
@originals/FILEEXST.SQL
@originals/BATCH.SQL
@originals/Tes_Reports.bdy
@originals/TIMEDB2.SQL
@originals/UNAPPROVED_HOURS.sql
@originals/Alt_Work_Order_Extract.sql
@originals/Work_Order_Extract.sql
@originals/BeelineBusinessAreas.sql
@originals/BeelineDepartments.sql
@originals/ALL_DEPARTMENTS_BEELINE-proc.sql
@originals/NAUSD_SUBCON_FEED-proc.sql
@originals/USR11_SUBCON_FEED-proc.sql
@originals/sa_notime.sql
@originals/SUBCO_NOTIME_TERM.sql
@originals/LCD_USER_AUDIT-proc.sql
@originals/NPS_Department_Select.sql
@originals/TimeSheetExtractLCD.sql
@originals/WEEKLY_NPS_EXTRACT-proc.sql
@originals/Sap_Data_Load.prc

-- Drop the new function (did not exist before)
DROP FUNCTION lcd.f_get_lcd_directory_name;

-- Verify all objects are VALID
SELECT object_name, object_type, status FROM user_objects WHERE status = 'INVALID';
```

**Note:** Rollback also requires restoring the `UTL_FILE_DIR` init parameter, which would need DBA intervention.

---

## Troubleshooting

### Issue: `ORA-29280: invalid directory path`
**Cause:** The directory object name passed to UTL_FILE.FOPEN does not exist or has a typo.
**Fix:**
```sql
-- Check what was resolved
SET SERVEROUTPUT ON
SELECT directory_name, directory_path FROM all_directories WHERE directory_name LIKE 'LCD%';
-- Verify the function returns a valid name
SELECT f_get_lcd_directory_name('571', 'IN', FALSE) FROM dual;
```

### Issue: `ORA-29289: directory access denied`
**Cause:** LCD schema does not have READ/WRITE grants on the directory object.
**Fix:**
```sql
-- As DBA:
GRANT READ, WRITE ON DIRECTORY LCD_IN TO LCD;
```

### Issue: `ORA-29283: invalid file operation` (file does not exist)
**Cause:** The file is not in the directory the object points to. Check the filesystem path.
**Fix:**
```bash
# On the Oracle Linux server
ls -la /csclcdnc0002/Q22S/In/
# Verify the file exists and has correct permissions
```

### Issue: Package body compiles with errors
**Cause:** Dependency on the new resolver function that hasn't been compiled yet.
**Fix:** Always deploy in order: Phase 1 → Phase 2 → Phase 3.
```sql
-- Recompile invalid objects
EXEC DBMS_UTILITY.COMPILE_SCHEMA(schema => 'LCD', compile_all => FALSE);
```

### Issue: `ORA-04063: package body has errors` at runtime
**Cause:** A dependent package was invalidated during deployment.
**Fix:**
```sql
-- Force recompilation of all LCD objects
ALTER PACKAGE lcd.shared COMPILE BODY;
ALTER PACKAGE lcd.getfile COMPILE BODY;
ALTER PACKAGE lcd.copyfile COMPILE BODY;
```

### Issue: Debug output not showing
**Cause:** DBMS_OUTPUT not enabled.
**Fix:**
```sql
SET SERVEROUTPUT ON SIZE UNLIMITED
-- Or in PL/SQL: DBMS_OUTPUT.ENABLE(1000000);
```

### Issue: Resolver returns NULL for an org
**Cause:** No directory object matches the filesystem path for that org.
**Fix:**
1. Check what `LCD_SERVER_LOC` is set to for that org:
   ```sql
   SELECT org_code, lcd_server_loc FROM lcd.org_param WHERE org_code = '###';
   ```
2. Check if a matching directory object exists:
   ```sql
   SELECT directory_name, directory_path FROM all_directories
    WHERE UPPER(directory_path) LIKE UPPER('%' || '<path_suffix>' || '%');
   ```
3. If missing, ask the DBA to create the directory object.

---

## Environment-Specific Notes

| Environment | Server Path Prefix | Notes |
|---|---|---|
| DEV (D22) | `/csclcdnc0002/D22` | Directory objects prefixed `LCD_` with D22 paths |
| QA (Q22) | `/csclcdnc0002/Q22` | Directory objects prefixed `LCD_` with Q22 paths |
| UAT (Q22S) | `/csclcdnc0002/Q22S` | Primary migration target – directory objects per `DB_DIRECTORIES.txt` |
| PROD (P22) | `/cmis60/P22` or `/csclcdnc0002/P22` | DBA must create directory objects matching prod paths |

The resolver function is environment-agnostic – it looks up `ALL_DIRECTORIES` at runtime, so the same code works in all environments as long as the DBA has created the appropriate directory objects.
