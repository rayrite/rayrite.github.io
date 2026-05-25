# LCD PB GUI — Oracle 19c Migration Deployment Plan

> **Task**: 42-2 PB GUI Frontend
> **Date**: May 24, 2026
> **Author**: RdW (Cascade-assisted)

---

## Prerequisites

1. **Oracle 19c database** is configured and running (CDB/PDB)
2. **Task 42-2 SQL patches** (25 server-side files) are deployed — see `tasks/42-2/SQL/01_deployment_plan.md`
3. **Appeon PowerBuilder 2021** IDE is installed and configured
4. **LCD application PBLs** are accessible (source checkout from version control)
5. **DBA access** available for grant verification
6. **Backup** of current PBLs taken before any changes

---

## Deployment Steps

### Step 1: Pre-Deployment Database Verification

Run these queries as the LCD application user to verify 19c readiness:

```sql
-- 1a. Verify DBA_ROLE_PRIVS access (PB-02)
SELECT COUNT(*) FROM DBA_ROLE_PRIVS WHERE ROWNUM = 1;
-- Expected: Returns 1
-- If ORA-00942: Ask DBA to run: GRANT SELECT ON SYS.DBA_ROLE_PRIVS TO LCD;

-- 1b. Verify USER_ROLE_PRIVS access (PB-02)
SELECT COUNT(*) FROM USER_ROLE_PRIVS WHERE ROWNUM = 1;
-- Expected: Returns a count >= 0

-- 1c. Verify LISTAGG ON OVERFLOW support (PB-04)
SELECT listagg('X', ',' ON OVERFLOW TRUNCATE '...' WITHOUT COUNT)
       WITHIN GROUP (ORDER BY 1) FROM DUAL;
-- Expected: Returns 'X'
-- If ORA-00907: Database is not 12c R2+, ON OVERFLOW not supported

-- 1d. Verify Oracle error codes (PB-09)
SELECT BANNER FROM V$VERSION;
-- Expected: Shows Oracle Database 19c ...

-- 1e. Verify DBMS_PIPE access (SS-05)
DECLARE v NUMBER; BEGIN v := DBMS_PIPE.CREATE_PIPE('LCD_TEST_PIPE'); v := DBMS_PIPE.REMOVE_PIPE('LCD_TEST_PIPE'); END;
/
-- Expected: PL/SQL procedure successfully completed
-- If ORA-06550: Ask DBA to run: GRANT EXECUTE ON SYS.DBMS_PIPE TO LCD;

-- 1f. Verify Oracle Directory Objects exist (SS-07, PB-08)
SELECT DIRECTORY_NAME, DIRECTORY_PATH FROM ALL_DIRECTORIES WHERE DIRECTORY_NAME LIKE 'LCD%' ORDER BY 1;
-- Expected: Shows all LCD_* directories per DB_DIRECTORIES.txt
```

**Troubleshooting**:
- **ORA-00942 on DBA_ROLE_PRIVS**: The LCD user lacks SELECT grant. Run `GRANT SELECT ON SYS.DBA_ROLE_PRIVS TO LCD;` as SYS.
- **ORA-01031 on DBMS_PIPE**: Missing EXECUTE grant. Run `GRANT EXECUTE ON SYS.DBMS_PIPE TO LCD;` as SYS.
- **No LCD_* directories**: Task 42-2 SQL deployment was not completed. Deploy server-side patches first.

---

### Step 2: Apply PB Code Changes in PowerBuilder IDE

Open the LCD workspace in PowerBuilder 2021 and apply each change:

#### 2a. PB-01: w_reconnect.srw — Password Case Fix

1. Open `SHARED.PBL` → `w_reconnect` window
2. Open `cb_ok` control → **Clicked** event script
3. Locate line: `IF is_passwd <> upper(sqlca.dbpass) and ii_repeat = 0 THEN`
4. Change to: `IF is_passwd <> sqlca.dbpass and ii_repeat = 0 THEN`
5. Add comment above: `// RdW 5/24/2026 Powerbuilder GUI-SS Oracle 19c Migration - PB-01 Remove Upper() for case-sensitive passwords`
6. Locate line: `IF is_passwd <> upper(sqlca.dbpass) THEN`
7. Change to: `IF is_passwd <> sqlca.dbpass THEN`
8. Add same comment above
9. Open `sle_password` control → **Modified** event script
10. Change: `is_passwd = Upper(Trim(this.text))` → `is_passwd = Trim(this.text)`
11. Add comment: `// RdW 5/24/2026 Powerbuilder GUI-SS Oracle 19c Migration - PB-01 Preserve password case for Oracle 19c`
12. **Save** the window

**Verification**: Compile SHARED.PBL — should have zero errors.

#### 2b. PB-04: d_user_roles_orgs.srd — LISTAGG Overflow

1. Open `LCD7.PBL` → `d_user_roles_orgs` DataWindow
2. Select **Design > Data Source** from the menu bar
3. Switch to **SQL** view (source/syntax view)
4. Locate: `listagg(LCD.APPL_USER.ORG_CODE,', ')`
5. Change to: `listagg(LCD.APPL_USER.ORG_CODE,', ' ON OVERFLOW TRUNCATE '...' WITHOUT COUNT)`
6. **Save** the DataWindow
7. Click **Verify Syntax** to confirm no errors

**Verification**: Preview the DataWindow with a test retrieval — should return data without ORA-01489.

#### 2c. PB-09: w_login.srw — ORA-28001/28002 Handlers

1. Open `LCD7.PBL` → `w_login` window
2. Open `cb_ok` control → **Clicked** event script
3. Locate the block ending with:
   ```
   ELSEIF SQLCA.SQLDBCode = 28000 THEN
       MessageBox (...)
       HALT CLOSE
   ```
4. After the `HALT CLOSE` line and before the next `ELSEIF`, insert:
   ```powerscript
   // RdW 5/24/2026 Powerbuilder GUI-SS Oracle 19c Migration - PB-09 Handle ORA-28001 password expired
   ELSEIF SQLCA.SQLDBCode = 28001 THEN
       MessageBox ("Database Connect", "Your Oracle password has expired." + &
                                     "~r~nYou will be redirected to the Change Password screen.")
       // 19c_DEBUG PB-09 ORA-28001 password expired for user
       nvo_KeyGlobals.is_Who_Calls = 'LOGIN'
       Open(w_Change_Password)
       RETURN

   // RdW 5/24/2026 Powerbuilder GUI-SS Oracle 19c Migration - PB-09 Handle ORA-28002 password will expire
   ELSEIF SQLCA.SQLDBCode = 28002 THEN
       MessageBox ("Database Connect", "Warning: Your Oracle password will expire soon." + &
                                     "~r~nPlease change your password at your earliest convenience." + &
                                     "~r~n" + SQLCA.SQLErrText)
       // 19c_DEBUG PB-09 ORA-28002 password expiring soon - allow login to continue
   ```
5. **Save** the window

**Verification**: Compile LCD7.PBL — should have zero errors.

---

### Step 3: Full Build and Incremental Build

1. In PowerBuilder IDE: **Run > Full Build** on the LCD target
2. Expected result: **0 errors, 0 warnings** (warnings about deprecated features are acceptable)
3. If errors:
   - Syntax errors in DataWindow SQL → verify LISTAGG syntax is valid for your Oracle version
   - Unresolved function references → verify all PBLs are in the library search path
4. **Incremental rebuild** after fixing any issues

---

### Step 4: Deploy to UAT Environment

1. Copy the rebuilt PBLs to the UAT server deployment directory
2. Update the LCD.INI file if database connection parameters changed:
   ```ini
   [database]
   DBMS=O19 Oracle19c
   Database=Q22S
   ServerName=<19c_tns_alias>
   ```
3. Verify TNS alias resolves to the 19c PDB

---

### Step 5: Post-Deployment Verification

#### 5a. Login Test (PB-09)
1. Launch LCD application
2. Enter valid credentials → should log in successfully
3. Enter wrong password → should get "Invalid user name/password" (ORA-1017)
4. Lock the account (fail 3+ times) → should get "ID is locked" (ORA-28000)

#### 5b. Reconnection Test (PB-01)
1. Log in to LCD
2. Kill the Oracle session from SQL*Plus: `ALTER SYSTEM KILL SESSION 'sid,serial#';`
3. Perform any action in LCD → should trigger reconnection dialog
4. Enter correct password (with mixed case) → should reconnect successfully
5. Enter wrong password → should show "Wrong Password" then terminate

#### 5c. Security Report Test (PB-02, PB-04)
1. Navigate to Administration > User Access > Roles/Orgs Report
2. Select criteria and generate report → should display user/role/org matrix
3. Verify LISTAGG column shows org codes (or truncated with `...`)
4. Verify no ORA-00942 errors

#### 5d. Role Assignment Test (PB-02)
1. Navigate to Administration > User Access > Set User Roles
2. Enter a test user ID → should populate checkboxes with current roles
3. Check/uncheck a role → should grant/revoke successfully

---

### Step 6: DBA Grant Verification (if not done in Step 1)

```sql
-- Verify all LCD roles exist in 19c PDB
SELECT ROLE FROM DBA_ROLES WHERE ROLE LIKE 'LCD_%' ORDER BY ROLE;
-- Expected: 30 LCD_* roles

-- Verify FTP paths in ORG_PARAM
SELECT ORG_CODE, LCD_SERVER_LOC, FTP_IO_DIR FROM LCD.ORG_PARAM ORDER BY ORG_CODE;
-- Expected: Paths match DB_DIRECTORIES.txt Linux paths

-- Verify database links (PB-10)
SELECT SYSTEM_CODE, SYSTEM_DESC FROM LCD.SUPPORT_SYSTEMS WHERE SYSTEM_TYPE = 'DBLINK';
-- Expected: Links point to valid 19c targets
```

---

## Rollback Procedure

If critical issues are found after deployment:

1. **Restore PBLs**: Copy the backup PBLs back to the deployment directory
2. **Restore LCD.INI**: Revert database connection parameters to 11g
3. **Verify**: Launch application and confirm it connects to 11g

The database grants (Step 1) are additive and do not need to be reverted.

---

## Troubleshooting Guide

| Symptom | Likely Cause | Fix |
|---|---|---|
| "ORA-00942: table or view does not exist" on login | DBA_ROLE_PRIVS/USER_ROLE_PRIVS not granted | Grant SELECT as SYS |
| "ORA-01489: result of string concatenation is too long" in Roles/Orgs report | LISTAGG patch not applied | Apply PB-04 fix |
| Reconnection fails with correct password | PB-01 Upper() not removed | Apply PB-01 fix |
| Login shows generic error for expired password | PB-09 28001 handler not applied | Apply PB-09 fix |
| FTP transfer fails | LCD_SERVER_LOC or FTP_IO_DIR wrong | Update ORG_PARAM paths |
| Batch job status display blank | DBMS_PIPE not granted | Grant EXECUTE ON DBMS_PIPE |
| "ORA-04063: package body LCD has errors" | Task 42-2 SQL patches not deployed | Deploy server-side patches first |
| PowerBuilder compile error on LISTAGG | Connected to pre-12.2 Oracle during compile | Connect to 19c for syntax validation |

---

*End of deployment plan.*
