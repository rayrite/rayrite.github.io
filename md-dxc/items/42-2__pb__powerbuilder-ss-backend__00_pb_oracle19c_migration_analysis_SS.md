# LCD PowerBuilder GUI — Oracle 11g → 19c Migration Analysis

> **Task**: 42-2 (PB GUI Supplement)
> **Application**: LCD (Labor Cost Distribution) — PowerBuilder 2021
> **Source**: `pb_export/` (926 source files across 28 modules)
> **Date**: May 24, 2026
> **Author**: RdW (Cascade-assisted analysis)

---

## Executive Summary

This report identifies code in the LCD PowerBuilder GUI application and its directly-interfaced server-side stored procedures that may break or require changes when migrating from Oracle 11g to Oracle 19c. Findings are split into two sections:

- **PB- prefix**: Issues in PowerBuilder-embedded code (DataWindows, window scripts, global functions, user objects)
- **SS- prefix**: Issues in server-side PL/SQL stored procedures/functions called by the GUI via RPCFUNC

A cross-reference to the existing task 42-2 SQL migration patches is provided in Section 3.

---


## Section 2: Server-Side Findings (SS-)

These are server-side stored procedures/functions that directly interface with the PowerBuilder GUI via RPCFUNC calls declared in `pb_export/LCD7/uo_trans.sru`.

### SS-01 — Change_Password.sql: Dynamic ALTER USER *(HIGH)*

**Issue**: The `Change_Password` function uses `DBMS_SQL.OPEN_CURSOR` / `DBMS_SQL.PARSE` to execute a dynamic `ALTER USER ... IDENTIFIED BY` statement. In Oracle 19c:
- Password verification functions have changed (the default profile may enforce `ORA12C_STRONG_VERIFY_FUNCTION`)
- Case-sensitive passwords are mandatory — the function correctly quotes the password with `'"'||p_user_pw||'"'` which preserves case
- The `pwdverify.DICTIONARY` table lookup may fail if the schema doesn't exist in 19c

**Affected File**: `LCD-Oracle/SQL/Change_Password.sql` — lines 230-236

**Code**:
```sql
DBMS_SQL.parse(cid,
   'alter user ' || UPPER(p_user) || ' identified by ' || '"'||p_user_pw||'"',
   DBMS_SQL.native);
```

**Remediation**:
1. Verify `pwdverify.DICTIONARY` table/schema exists in 19c (line 95) — if not, add exception handling or recreate
2. Verify the function owner has `ALTER USER` system privilege in the 19c PDB
3. Test password complexity rules against 19c's default profile (`ORA12C_STRONG_VERIFY_FUNCTION` or `ORA12C_STIG_VERIFY_FUNCTION`)
4. The quoted password (`'"'||p_user_pw||'"'`) is correct for case-preserving — no change needed there

---

### SS-02 — f_Unlock_user.sql: Dynamic ALTER USER ACCOUNT UNLOCK *(HIGH)*

**Issue**: Uses `DBMS_SQL.PARSE` to execute `ALTER USER ... ACCOUNT UNLOCK`. Requires the function owner to have `ALTER USER` privilege in the 19c PDB.

**Affected File**: `LCD-Oracle/SQL/f_Unlock_user.sql` — line 17

**Code**:
```sql
dbms_sql.parse(cur_us, 'alter user ' || a_id || ' account unlock', dbms_sql.native);
```

**Remediation**:
1. Verify `ALTER USER` privilege is granted to the function owner in the 19c PDB
2. Consider adding `AUTHID CURRENT_USER` if the function needs to run with caller's privileges
3. Test with a locked account in the 19c environment

---

### SS-03 — CREATE_USER / DROP_USER Standalone Procedures *(HIGH)*

**Issue**: The PB GUI calls `CREATE_USER` and `DROP_USER` via RPCFUNC (declared as standalone procedures, not in the LCD package). **Source code for these procedures was not found in the repository** (`LCD-Oracle/SQL/` does not contain them). They likely exist only in the database. These procedures perform DDL that is highly sensitive to 19c changes:
- Default tablespace behavior changed
- Password profile assignment is automatic in 19c
- `DROP USER` may need `CASCADE` if user owns objects in a PDB

**Affected Files**: Source not in repository — exists only in the database

**Remediation**:
1. **Extract the current source** from the 11g database: `SELECT TEXT FROM DBA_SOURCE WHERE NAME IN ('CREATE_USER','DROP_USER') ORDER BY LINE`
2. Save to `LCD-Oracle/SQL/` for version control
3. Review for 19c compatibility:
   - Verify DEFAULT/TEMPORARY TABLESPACE names exist in 19c
   - Verify QUOTA assignments
   - Add profile assignment if needed
   - Test DROP USER with and without CASCADE
4. Re-grant EXECUTE to LCD application users in 19c

---

### SS-04 — GRANT_USER_ROLE / REVOKE_USER_ROLE Standalone Procedures *(HIGH)*

**Issue**: Same as SS-03 — **source not found in repository**. These procedures grant/revoke LCD security roles (30 roles defined in `nvo_keyglobals.of_assign_global_roles()`). In Oracle 19c CDB/PDB, role grants are PDB-local and require `GRANT ANY ROLE` or equivalent privilege.

**Affected Files**: Source not in repository — exists only in the database

**Remediation**:
1. Extract source from 11g database (same method as SS-03)
2. Verify the procedure owner has `GRANT ANY ROLE` privilege in the 19c PDB
3. Verify all 30 LCD roles exist in the 19c PDB
4. Test granting/revoking each role

---

### SS-05 — DBMS_PIPE Usage in LCDBatch Package *(MEDIUM)*

**Issue**: The LCDBatch package (`BATCH1.SQL` spec, `BATCH2.SQL` body) uses `DBMS_PIPE` extensively for inter-process communication between the GUI progress display (`w_show_status.srw`) and server-side batch jobs. `DBMS_PIPE` is still supported in Oracle 19c but requires explicit `EXECUTE ON DBMS_PIPE` grant. The LCD wrapper package `lcd.pkg_pipe` (`PKG_PIPE.SQL` / `PKGBPIPE.SQL`) also uses `DBMS_PIPE`.

**Affected Files**:
- `LCD-Oracle/SQL/BATCH1.SQL` — LCDBatch package specification (declares `PIPE_DELETE`, `PIPE_CREATE`)
- `LCD-Oracle/SQL/BATCH2.SQL` — LCDBatch package body (lines 310-375: pipe create/delete; lines 1027-1133: pipe send/receive)
- `LCD-Oracle/SQL/BATCH3.SQL` — GetStatus procedure (lines 28-93: pipe read operations)
- `LCD-Oracle/SQL/PKG_PIPE.SQL` — lcd.pkg_pipe specification
- `LCD-Oracle/SQL/PKGBPIPE.SQL` — lcd.pkg_pipe body (uses `DBMS_PIPE.PACK_MESSAGE`, `SEND_MESSAGE`, `RECEIVE_MESSAGE`)

**GUI caller**: `pb_export/SHARED/w_show_status.srw` calls `SQLCA.pipe_delete()`, `SQLCA.GetStatus()`, `SQLCA.RMqueue()`, `SQLCA.BRjob()` via RPCFUNC

**Remediation**:
1. Verify `EXECUTE ON SYS.DBMS_PIPE` is granted to LCD schema in 19c
2. Verify `EXECUTE ON SYS.DBMS_PIPE` is granted to any users who run batch jobs
3. No code changes needed — `DBMS_PIPE` API is unchanged in 19c
4. Test the full batch job lifecycle: submit → progress display → completion

---

### SS-06 — DBMS_SCHEDULER in LCDBatch *(LOW)*

**Issue**: The batch system has already been migrated from `DBMS_JOB` to `DBMS_SCHEDULER` (as noted in `BATCH2.SQL` header: "02/14 L.Ioffe DBMS_Scheduler to replace DBMS_Job"). Oracle 19c fully supports `DBMS_SCHEDULER`. One legacy file (`NPS_Departments_Job_Scheduler - FOR Q22.sql`) still uses `DBMS_JOB.SUBMIT` but this appears to be an old environment-specific script.

**Affected Files**:
- `LCD-Oracle/SQL/BATCH2.SQL` — `SUB_JOB` procedure uses `DBMS_SCHEDULER.CREATE_JOB`
- `LCD-Oracle/SQL/BATCH3.SQL` — `RMQUEUE` uses `DBMS_SCHEDULER.DROP_JOB`, `BRJOB` uses `DBMS_SCHEDULER.DISABLE`
- Various `*_Job_Scheduler.sql` files — all use `DBMS_SCHEDULER`

**Remediation**:
1. Verify `CREATE JOB` privilege is granted to LCD schema in 19c
2. Verify `MANAGE SCHEDULER` privilege if needed
3. No code changes required

---

### SS-07 — UTL_FILE Usage in BATCH.SQL and Related Files *(HIGH)*

**Issue**: `BATCH.SQL` contains multiple procedures (`fExists`, `get_nextline`, `read_file`, `fArchiveFile`, `ServerFileCopy`, `ServerFileMove`) that use `UTL_FILE` directly. Some of these already call `lcd.f_get_lcd_os_filename()` (the task 42-2 migration function), but `UTL_FILE` calls still use OS path strings as the `location` parameter rather than Oracle Directory Object names.

In Oracle 19c, `UTL_FILE_DIR` is deprecated. All `UTL_FILE` calls must use Directory Object names (not OS paths) as the `location` parameter.

**Affected File**: `LCD-Oracle/SQL/BATCH.SQL`

**Status**: This file is **already in the task 42-2 patched set** (`tasks/42-2/SQL/patched/BATCH.SQL`). However, the current (unpatched) version shows a hybrid state where `f_get_lcd_os_filename()` returns an OS path that is then passed to `UTL_FILE.fopen()` — this works only if that path is also registered as a Directory Object.

**Remediation**:
1. Verify the task 42-2 patched version of `BATCH.SQL` is deployed
2. Verify all `UTL_FILE` location parameters receive Directory Object names (not OS paths)
3. See Section 3 cross-reference for full task 42-2 coverage

---

### SS-08 — lcd.pkg_pipe DBMS_PIPE Wrapper *(MEDIUM)*

**Issue**: `lcd.pkg_pipe` is a thin wrapper around `DBMS_PIPE` used for progress reporting. Same grant requirements as SS-05.

**Affected Files**:
- `LCD-Oracle/SQL/PKG_PIPE.SQL` — package specification
- `LCD-Oracle/SQL/PKGBPIPE.SQL` — package body

**Remediation**:
1. Same as SS-05 — verify `EXECUTE ON SYS.DBMS_PIPE` grant
2. Verify `lcd.pkg_pipe` compiles cleanly in 19c
3. No code changes needed

---

### SS-09 — LCD_PASSWORD_EXPIRATION Function: Source Missing *(MEDIUM)*

**Issue**: `uo_trans.sru` line 30 declares:
```
function double LCD_PASSWORD_EXPIRATION(string P_USER) RPCFUNC ALIAS FOR "LCD_PASSWORD_EXPIRATION"
```
This standalone function is **not found in the repository**. It likely returns the number of days until password expiration and is called during login processing. If it relies on Oracle profile settings or `DBA_USERS.EXPIRY_DATE`, it will need review for 19c profile changes.

**Remediation**:
1. Extract source from 11g database: `SELECT TEXT FROM DBA_SOURCE WHERE NAME = 'LCD_PASSWORD_EXPIRATION'`
2. Save to `LCD-Oracle/SQL/` for version control
3. Review for 19c compatibility — particularly any references to `DBA_USERS`, password profiles, or `RESOURCE_LIMIT`
4. Test return values match expectations in 19c

---

### SS-10 — VERIFY_PASSWORD Function: Source Missing *(MEDIUM)*

**Issue**: `uo_trans.sru` line 34 declares:
```
function boolean VERIFY_PASSWORD(string P_USER, string P_USER_PW, string P_OLD_PW) RPCFUNC ALIAS FOR "VERIFY_PASSWORD"
```
This standalone function is **not found in the repository**. It appears to be a password validation function separate from `Change_Password`. The PB code in `w_change_password.srw` has it commented out (lines 317-324), suggesting it was replaced by `Change_Password`. However, `w_change_password_for_another.srw` may still reference it.

**Remediation**:
1. Verify whether this function still exists in the 11g database
2. If it exists, extract and save to repository
3. If the function is unused (commented out in all callers), document it as deprecated
4. If used, review for 19c password verification compatibility

---

### SS-11 — P_COPY_TABLES Database Link Parameters *(MEDIUM)*

**Issue**: The `LCD.P_COPY_TABLES` procedure accepts `DB_LINK_TO` and `DB_LINK_FROM` parameters for cross-environment table copying. Database links must be recreated in Oracle 19c, and the link names stored in `LCD.SUPPORT_SYSTEMS` must be updated.

**Affected File**: `LCD-Oracle/SQL/` (procedure source in LCDBatch or standalone — referenced in `uo_trans.sru` line 81)

**Remediation**:
1. Recreate database links in the 19c environment with the DBA
2. Update `LCD.SUPPORT_SYSTEMS` records: `WHERE SYSTEM_TYPE = 'DBLINK'`
3. Test `P_COPY_TABLES` with the new link names
4. No code changes needed — link names are data-driven

---

### SS-12 — pwdverify.DICTIONARY Schema/Table *(LOW)*

**Issue**: `Change_Password.sql` (line 95) queries `pwdverify.DICTIONARY` to check if the new password contains dictionary words. This schema/table must exist in the 19c database.

**Affected File**: `LCD-Oracle/SQL/Change_Password.sql` — lines 95-111

**Code**:
```sql
SELECT COUNT(*) INTO v_word_count FROM pwdverify.DICTIONARY;
...
SELECT COUNT(*) INTO v_pw_matches FROM pwdverify.DICTIONARY p
WHERE UPPER(PASSWORD) LIKE '%' || p.word || '%';
```

**Remediation**:
1. Verify `pwdverify` schema and `DICTIONARY` table exist in 19c
2. If not, recreate from 11g export or create a new dictionary table
3. Grant `SELECT ON pwdverify.DICTIONARY` to the `Change_Password` function owner
4. The function handles the case where the table is empty (falls through gracefully), but a missing table/schema will throw ORA-00942

---

## Section 3: Cross-Reference to Task 42-2 SQL Patches

The task 42-2 SQL migration (`tasks/42-2/SQL/patched/`) addressed UTL_FILE → Directory Object migration for 25 files. Here is how the SS- findings map to that work:

| SS- ID | Server-Side Item | In 42-2 Patched Set? | Notes |
|---|---|---|---|
| SS-01 | `Change_Password.sql` | **No** | Not a UTL_FILE issue — needs separate review |
| SS-02 | `f_Unlock_user.sql` | **No** | Not a UTL_FILE issue — needs separate review |
| SS-03 | `CREATE_USER` / `DROP_USER` | **No** | Source not in repository |
| SS-04 | `GRANT_USER_ROLE` / `REVOKE_USER_ROLE` | **No** | Source not in repository |
| SS-05 | DBMS_PIPE in LCDBatch (BATCH1/2/3) | **Partial** | `BATCH.SQL` is patched (UTL_FILE portions); BATCH1/2/3 DBMS_PIPE code is not patched (not a UTL_FILE issue) |
| SS-06 | DBMS_SCHEDULER in LCDBatch | **No** | Already uses DBMS_SCHEDULER — no patch needed |
| SS-07 | UTL_FILE in BATCH.SQL | **Yes** | `tasks/42-2/SQL/patched/BATCH.SQL` — fully patched |
| SS-08 | lcd.pkg_pipe | **No** | Not a UTL_FILE issue — grant verification only |
| SS-09 | `LCD_PASSWORD_EXPIRATION` | **No** | Source not in repository |
| SS-10 | `VERIFY_PASSWORD` | **No** | Source not in repository; possibly deprecated |
| SS-11 | `P_COPY_TABLES` DB links | **No** | Configuration-only change |
| SS-12 | `pwdverify.DICTIONARY` | **No** | Schema/table verification only |

### Additional Task 42-2 Patched Files (UTL_FILE migration — not directly GUI-facing):

These files were patched in task 42-2 for the UTL_FILE → Directory Object migration. They are server-side batch/report procedures that the GUI triggers indirectly:

| Patched File | GUI Trigger Point |
|---|---|
| `SHRD_BDY.SQL` | Core shared package — called by many GUI-triggered operations |
| `GETFILE.SQL` | `GETOPENFILE`/`GETTRANSDATA`/`GETCLOSEFILE` RPCFUNC calls from `uo_trans.sru` |
| `FILECOPY.SQL` | `FILECOPYOPEN`/`FILECOPYWRITE`/`FILECOPYCLOSE` RPCFUNC calls from `uo_trans.sru` |
| `FILEEXST.SQL` | `F_FILE_EXIST` RPCFUNC call from `uo_trans.sru` |
| `TIMEDB2.SQL` | Payroll time processing (triggered via GUI payroll screens) |
| `Tes_Reports.bdy` | Report generation (triggered via GUI report screens) |
| `Sap_Data_Load.prc` | SAP integration (triggered via GUI SAP screens) |
| All others | Various batch/extract operations |

---

## Section 4: Remediation Summary

### Priority 1 — HIGH Severity (Must fix before migration)

| ID | Action | Effort |
|---|---|---|
| **PB-01** | Remove `Upper()` from password comparison in `w_reconnect.srw` | PB change — 1 hour |
| **PB-02** | Verify/grant `SELECT ON DBA_ROLE_PRIVS` and `USER_ROLE_PRIVS` in 19c PDB | DBA task — 30 min |
| **PB-05** | Verify all RPCFUNC server-side targets compile and execute in 19c | Test task — 4 hours |
| **SS-01** | Verify `Change_Password.sql` against 19c password profiles; verify `pwdverify` schema | DBA + test — 2 hours |
| **SS-02** | Verify `f_Unlock_user.sql` has `ALTER USER` privilege in 19c PDB | DBA task — 30 min |
| **SS-03** | Extract, version-control, and verify `CREATE_USER`/`DROP_USER` procedures | DBA + dev — 3 hours |
| **SS-04** | Extract, version-control, and verify `GRANT_USER_ROLE`/`REVOKE_USER_ROLE` procedures | DBA + dev — 2 hours |
| **SS-07** | Deploy task 42-2 patched `BATCH.SQL` (already done if 42-2 is deployed) | Deploy task — 30 min |

### Priority 2 — MEDIUM Severity (Should fix; may cause runtime errors)

| ID | Action | Effort |
|---|---|---|
| **PB-03** | Regression test all `(+)` outer join DataWindows; schedule ANSI conversion | Test — 4 hours; conversion — 8 hours future |
| **PB-04** | Add `ON OVERFLOW TRUNCATE` to LISTAGG in `d_user_roles_orgs.srd` | PB change — 1 hour |
| **PB-08** | Verify ORG_PARAM FTP path values match 19c server paths | DBA/ops task — 1 hour |
| **PB-10** | Recreate database links; update SUPPORT_SYSTEMS | DBA task — 2 hours |
| **SS-05** | Verify `EXECUTE ON DBMS_PIPE` grant in 19c | DBA task — 30 min |
| **SS-08** | Verify `lcd.pkg_pipe` compiles in 19c; verify grants | DBA task — 30 min |
| **SS-09** | Extract and verify `LCD_PASSWORD_EXPIRATION` | DBA + dev — 2 hours |
| **SS-10** | Verify `VERIFY_PASSWORD` status (active or deprecated) | DBA task — 1 hour |
| **SS-11** | Recreate DB links; update SUPPORT_SYSTEMS for P_COPY_TABLES | DBA task — 2 hours |

### Priority 3 — LOW Severity (Informational / future enhancement)

| ID | Action | Effort |
|---|---|---|
| **PB-06** | Document cleartext password in global variable; plan future fix | Doc only |
| **PB-07** | Document INI file password storage; plan future fix | Doc only |
| **PB-09** | Add ORA-28001/28002 handling to login window | PB change — 2 hours (future) |
| **SS-06** | Verify DBMS_SCHEDULER privileges in 19c | DBA task — 30 min |
| **SS-12** | Verify `pwdverify.DICTIONARY` schema/table in 19c | DBA task — 30 min |

---

## Appendix A: Complete RPCFUNC Inventory

All RPCFUNC declarations in `pb_export/LCD7/uo_trans.sru` with their server-side targets and migration risk assessment:

| # | RPCFUNC | Server Target | Category | Risk |
|---|---|---|---|---|
| 1 | `F_CHECK_WO_EXISTS` | `LCD.F_CHECK_WO_EXISTS` | Validation | None |
| 2 | `F_GET_PERMISSIONS` | `LCD.F_GET_PERMISSIONS` | Security | Low |
| 3 | `LOOKUPW_ID` | `LCD.LOOKUPW_ID` | Lookup | None |
| 4 | `LOOKUPTIMETYPE1` | `LCD.LOOKUPTIMETYPE1` | Lookup | None |
| 5 | `LOADPAY` | `LCD.LOADPAY` | Payroll | None |
| 6 | `TIMESAVE` | `LCD.TIMESAVE` | Time | None |
| 7 | `TIME_EDITS_VALIDATION` | `LCD.TIME_EDITS_VALIDATION` | Validation | None |
| 8 | `BACKOUTPAY` | `LCD.BACKOUTPAY` | Payroll | None |
| 9 | `TSTATUS` | `LCD.TSTATUS` | Status | None |
| 10 | `SUB_JOB` | `LCD.SUB_JOB` | Batch/Scheduler | Low (SS-06) |
| 11 | `GETSTATUS` | `LCD.GETSTATUS` | Batch/Pipe | Medium (SS-05) |
| 12 | `RMQUEUE` | `LCD.RMQUEUE` | Batch/Scheduler | Low (SS-06) |
| 13 | `BRJOB` | `LCD.BRJOB` | Batch/Scheduler | Low (SS-06) |
| 14 | `FILECLOSE` | `LCD.FILECLOSE` | File I/O | High (SS-07) |
| 15 | `F_UNLOCK_USER` | `LCD.F_UNLOCK_USER` | Security/DDL | High (SS-02) |
| 16 | `LCD_PREPARE_FOR_ROLLBACK` | `LCD.LCD_PREPARE_FOR_ROLLBACK` | Distribution | None |
| 17 | `LCD_PASSWORD_EXPIRATION` | `LCD_PASSWORD_EXPIRATION` | Security | Medium (SS-09) |
| 18 | `CHANGE_PASSWORD` | `CHANGE_PASSWORD` | Security/DDL | High (SS-01) |
| 19 | `VERIFY_PASSWORD` | `VERIFY_PASSWORD` | Security | Medium (SS-10) |
| 20 | `CREATE_USER` | `CREATE_USER` | DDL | High (SS-03) |
| 21 | `DROP_USER` | `DROP_USER` | DDL | High (SS-03) |
| 22 | `GRANT_USER_ROLE` | `GRANT_USER_ROLE` | DDL | High (SS-04) |
| 23 | `REVOKE_USER_ROLE` | `REVOKE_USER_ROLE` | DDL | High (SS-04) |
| 24 | `PIPE_DELETE` | `LCD.PIPE_DELETE` | Batch/Pipe | Medium (SS-05) |
| 25 | `F_VALIDATE_LAB_CAT` | `LCD.F_VALIDATE_LAB_CAT` | Validation | None |
| 26 | `F_VALIDATE_CROSS_CHARGE` | `LCD.F_VALIDATE_CROSS_CHARGE` | Validation | None |
| 27 | `F_VALIDATE_CLIENT_SITE` | `LCD.F_VALIDATE_CLIENT_SITE` | Validation | None |
| 28 | `F_VALIDATE_CLIENT_CODE` | `LCD.F_VALIDATE_CLIENT_CODE` | Validation | None |
| 29 | `F_VALIDATE_WO` | `LCD.F_VALIDATE_WO` | Validation | None |
| 30 | `P_GET_SERVER_DATE_TIME` | `LCD.P_GET_SERVER_DATE_TIME` | Utility | None |
| 31 | `F_FILE_EXIST` | `LCD.F_FILE_EXIST` | File I/O | High (SS-07) |
| 32 | `FILECOPYCLOSE` | `LCD.FILECOPYCLOSE` | File I/O | High (SS-07) |
| 33 | `FILECOPYOPEN` | `LCD.FILECOPYOPEN` | File I/O | High (SS-07) |
| 34 | `FILECOPYWRITE` | `LCD.FILECOPYWRITE` | File I/O | High (SS-07) |
| 35 | `F_DUPLICATE_SSN` | `LCD.F_DUPLICATE_SSN` | Validation | None |
| 36 | `GETEXPNAMES` | `LCD.GETEXPNAMES` | File I/O | High (SS-07) |
| 37 | `GETTRANSDATA` | `LCD.GETTRANSDATA` | File I/O | High (SS-07) |
| 38 | `GETCLOSEFILE` | `LCD.GETCLOSEFILE` | File I/O | High (SS-07) |
| 39 | `GETOPENFILE` | `LCD.GETOPENFILE` | File I/O | High (SS-07) |
| 40 | `NEWS_SEEN` | `LCD.USER_SAW_NEWS` | Utility | None |
| 41 | `F_GET_DEFAULT_WO` | `LCD.F_GET_DEFAULT_WO` | Lookup | None |
| 42 | `WRITE_REFRESH_REPORTS` | `LCD.WRITE_REFRESH_REPORTS` | Reports | None |
| 43 | `LCD_GET_OVERRIDE` | `LCD.LCD_GET_OVERRIDE` | Lookup | None |
| 44 | `F_VALIDATE_HIRE_DATE` | `LCD.F_VALIDATE_HIRE_DATE` | Validation | None |
| 45 | `F_CREATE_HIRE_DATE` | `LCD.F_CREATE_HIRE_DATE` | Validation | None |
| 46 | `F_VALIDATE_PAYROLL_JOB` | `LCD.F_VALIDATE_PAYROLL_JOB` | Validation | None |
| 47 | `F_VALIDATE_FUNC_SPECIALTY` | `LCD.F_VALIDATE_FUNC_SPECIALTY` | Validation | None |
| 48 | `P_COPY_TABLES` | `LCD.P_COPY_TABLES` | Admin/DBLink | Medium (SS-11) |
| 49 | `F_FUNCTION_AVAILABLE` | `LCD.F_FUNCTION_AVAILABLE` | Utility | None |

---

*End of analysis.*
