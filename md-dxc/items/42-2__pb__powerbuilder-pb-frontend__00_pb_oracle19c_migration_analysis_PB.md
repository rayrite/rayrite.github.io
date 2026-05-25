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

## Section 1: GUI-Side Findings (PB-)

### PB-01 — Password Case-Sensitivity in Reconnection *(HIGH)*

**Issue**: Oracle 19c enforces case-sensitive passwords by default (`SEC_CASE_SENSITIVE_LOGON = TRUE` and the `10G_STRONG_VERIFY_FUNCTION` is deprecated). The reconnection window compares passwords using `Upper()`, which will silently corrupt case-sensitive passwords and cause authentication failures.

**Affected Files**:
- `pb_export/SHARED/w_reconnect.srw` — lines 105, 114

**Code**:
```powerscript
// w_reconnect.srw cb_ok clicked event
IF is_passwd <> upper(sqlca.dbpass) and ii_repeat = 0 THEN
  messagebox("Reconnection","Wrong Password" ...
...
IF is_passwd <> upper(sqlca.dbpass) THEN
```

The `sle_password` modified event also uppercases input:
```powerscript
is_passwd = Upper(Trim(this.text))
```

**Remediation**:
1. Remove `Upper()` calls from both the comparison and the `sle_password` modified event
2. Compare `is_passwd` directly against `sqlca.dbpass` (case-preserved)
3. Verify that `sqlca.dbpass` is stored case-preserved at login time (see PB-06)

---

### PB-02 — DBA_ROLE_PRIVS / USER_ROLE_PRIVS Access *(HIGH)*

**Issue**: The GUI directly queries Oracle data dictionary views `DBA_ROLE_PRIVS` and `USER_ROLE_PRIVS` from embedded SQL and DataWindows. In Oracle 19c with CDB/PDB architecture, `SELECT` grants on `DBA_` views may need to be explicitly re-granted to the LCD schema or application users. If the DBA has not configured `DBA_ROLE_PRIVS` access, these queries will return ORA-00942.

**Affected Files** (8 total):

| File | View Used | Context |
|---|---|---|
| `pb_export/LCD7/d_granted_roles.srd` | `USER_ROLE_PRIVS` | DataWindow retrieve — fetches current user's LCD roles at login |
| `pb_export/LCD7/d_user_roles.srd` | `DBA_ROLE_PRIVS` | DataWindow retrieve — security report showing all user/role assignments |
| `pb_export/LCD7/d_user_roles_orgs.srd` | `DBA_ROLE_PRIVS` | DataWindow retrieve — comprehensive user-role-org matrix report |
| `pb_export/LCD7/nvo_keyglobals.sru` | `DBA_ROLE_PRIVS` | `of_check_user()` — validates user exists; `of_check_org()` — verifies org access |
| `pb_export/LCD7/w_set_user_roles.srw` | `DBA_ROLE_PRIVS` | `wf_populate_old_roles()` — reads current role assignments for a user |
| `pb_export/LCD7/w_user_role_report.srw` | `DBA_ROLE_PRIVS` | Post-retrieval processing of role-report DataWindow |
| `pb_export/LCD7/w_main.srw` | *(indirect via d_granted_roles)* | `ue_security` event — role-based menu enablement |
| `pb_export/SPECPAY1/dddw_special_wages.srd` | `DBA_ROLE_PRIVS` | Dropdown DataWindow — filters special wages by user's granted roles |

**Remediation**:
1. Verify that `SELECT` on `DBA_ROLE_PRIVS` is explicitly granted to the LCD application user(s) in the 19c PDB
2. If CDB/PDB isolation prevents direct access, create a view or synonym in the LCD schema that wraps the dictionary view
3. Test `d_granted_roles.srd` (uses `USER_ROLE_PRIVS`) — this is the most critical since it gates all menu security in `w_main`
4. No PB source code changes required if grants are properly configured on the database side

---

### PB-03 — Oracle-Style Outer Join (+) Syntax in DataWindows *(MEDIUM)*

**Issue**: Oracle's proprietary outer join syntax `(+)` is deprecated in favor of ANSI `LEFT/RIGHT JOIN`. While Oracle 19c still supports `(+)` syntax, it has known limitations (cannot be used with `OR`, full outer joins, or certain subquery patterns) and may behave differently under the 19c optimizer.

**Affected Files** (39 DataWindows + 1 user object):

| Module | Files with (+) syntax |
|---|---|
| **DISTRIB7** | `nvo_distribution.sru` (6 occurrences in cursor declarations) |
| **TBLDIST** | `d_att_wage_map.srd`, `d_att_wage_map_err.srd`, `d_att_abs_err.srd`, `d_wage_type_err.srd` |
| **TBLCOST** | `d_primary_wage.srd`, `d_primary_wage_err.srd`, `d_time_genwage_err.srd`, `d_wrkr_unitrate_err.srd` |
| **TBLWO** | `d_work_orders_err.srd`, `d_work_orders_err2.srd`, `d_work_orders_err_3.srd`, `d_wo_substitution_err.srd`, `d_default_wo_err.srd`, `d_alternate_wo_err.srd` |
| **TBLWRKRS** | `d_persarea_subarea_err.srd` |
| **REPORTS** | `d_report_subcontractor_ap_voucher.srd`, `d_report_vendor_summary.srd`, `d_report_vendor_summary_print_totals.srd` |
| **TBLADMIN** | `d_org_param.srd`, `d_org_param_detail.srd`, `d_expense_types_err.srd`, `d_func_specs_err.srd`, `d_function_access.srd`, `d_payroll_jobs_err.srd`, `d_vendor_group_err.srd`, `d_wrkr_wage_control_err.srd` |
| **TBLASIGN** | `d_generate_expenses.srd` |
| **TBLCMON** | `d_print_report.srd` |
| **TBLINTRF** | `d_toe_att_map_err.srd` |
| **NEWS** | `d_news.srd` |
| **TIME** | `d_time_errors.srd`, `d_wage_determination_rates_err.srd` |
| **TABLES** | `d_proj_attr_err.srd` |

**Common pattern** — Most `_err` DataWindows use the same outer join pattern:
```sql
WHERE LCD.error_log.reason_code = LCD.reason_code.reason_code (+)
```

**Remediation**:
1. **Short-term**: No immediate action required — `(+)` syntax works in 19c
2. **Long-term**: Convert to ANSI JOIN syntax in a future maintenance cycle
3. **Risk mitigation**: Run regression tests on all `_err` DataWindows and the distribution engine (`nvo_distribution.sru`) after migration
4. **Priority**: Focus testing on `nvo_distribution.sru` as it contains the most complex queries with outer joins in cursor declarations

---

### PB-04 — LISTAGG Overflow Risk *(MEDIUM)*

**Issue**: `d_user_roles_orgs.srd` uses `LISTAGG()` to concatenate all org_codes for each user/role combination. The result column is defined as `char(4000)`. In Oracle 19c, if the concatenated string exceeds 4000 bytes, the query throws `ORA-01489: result of string concatenation is too long`. Oracle 19c introduced `LISTAGG(...) ON OVERFLOW TRUNCATE` to handle this gracefully.

**Affected File**: `pb_export/LCD7/d_user_roles_orgs.srd` — line 20

**Code**:
```sql
listagg(LCD.APPL_USER.ORG_CODE,', ')
within group (order by lcd.appl_user.org_code) org_code
FROM DBA_ROLE_PRIVS, LCD.APPL_USER
```

**Remediation**:
1. Modify the DataWindow SQL to add overflow handling:
   ```sql
   listagg(LCD.APPL_USER.ORG_CODE,', ' ON OVERFLOW TRUNCATE '...' WITHOUT COUNT)
   ```
2. Alternatively, keep the column at `char(4000)` and verify no user has more than ~1300 3-character org assignments (unlikely but should be verified)
3. This is a DataWindow `.srd` change — requires recompiling in PB 2021

---

### PB-05 — RPCFUNC Bindings to DDL/Security Procedures *(HIGH)*

**Issue**: `uo_trans.sru` declares 40+ RPCFUNC bindings to server-side stored procedures. Several of these perform DDL operations (CREATE/DROP USER, GRANT/REVOKE ROLE) that are sensitive to Oracle 19c security changes. The RPCFUNC binding mechanism itself is fine, but the server-side implementations need verification.

**Affected File**: `pb_export/LCD7/uo_trans.sru` — lines 13-82

**Critical RPCFUNC bindings**:

| RPCFUNC Declaration | Server Target | Risk |
|---|---|---|
| `CREATE_USER(USER_NAME, PASSWORD, DEFLT_TSPACE, TEMP_TSPACE)` | Standalone procedure `"CREATE_USER"` | 19c DEFAULT TABLESPACE, QUOTA, PROFILE defaults changed |
| `DROP_USER(USER_NAME)` | Standalone procedure `"DROP_USER"` | May need CASCADE in 19c if user owns objects |
| `GRANT_USER_ROLE(USER_NAME, ROLENAME)` | Standalone procedure `"GRANT_USER_ROLE"` | Role grant semantics in CDB/PDB |
| `REVOKE_USER_ROLE(USER_NAME, ROLENAME)` | Standalone procedure `"REVOKE_USER_ROLE"` | Same as above |
| `CHANGE_PASSWORD(P_USER, P_USER_PW, P_OLD_PW, P_ErrorMsg)` | `Change_Password.sql` | DBMS_SQL + ALTER USER (see SS-01) |
| `VERIFY_PASSWORD(P_USER, P_USER_PW, P_OLD_PW)` | Source not in repository | Must locate and verify |
| `F_UNLOCK_USER(A_ID)` | `LCD.F_UNLOCK_USER` | DBMS_SQL + ALTER USER (see SS-02) |
| `LCD_PASSWORD_EXPIRATION(P_USER)` | `LCD_PASSWORD_EXPIRATION` | Source not in repository |
| `PIPE_DELETE(ORG, JOB_NAME)` | `LCD.PIPE_DELETE` in LCDBatch | DBMS_PIPE usage (see SS-05) |
| `SUB_JOB(...)` | `LCD.SUB_JOB` in LCDBatch | DBMS_SCHEDULER (see SS-06) |
| `F_FILE_EXIST(A_ORG, A_FILE_NAME)` | `LCD.F_FILE_EXIST` | UTL_FILE dependent (see SS-07) |
| `FILECOPYCLOSE/OPEN/WRITE(...)` | `LCD.FILECOPY*` | UTL_FILE dependent (see SS-07) |
| `GETOPENFILE/GETTRANSDATA/GETCLOSEFILE(...)` | `LCD.GET*FILE` | UTL_FILE dependent (see SS-07) |

**Remediation**:
1. No PB-side RPCFUNC binding changes needed — the signatures remain the same
2. All remediation is on the server side (see SS- findings below)
3. Test each RPCFUNC call path after server-side changes are applied

---

### PB-06 — Cleartext Password in Global Variable *(LOW)*

**Issue**: `nvo_keyglobals.is_Password` stores the user's cleartext password throughout the session. This is used by `w_change_password.srw` to verify the old password client-side. While not a functional break, Oracle 19c's enhanced audit policies may flag client-side password handling.

**Affected Files**:
- `pb_export/LCD7/nvo_keyglobals.sru` — line 63: `STRING is_Password`
- `pb_export/LCD7/w_login.srw` — lines 725, 735, 852: `nvo_KeyGlobals.is_Password = SQLCA.DBPass`
- `pb_export/LCD7/w_change_password.srw` — line 286: comparison, line 393: update after change

**Remediation**:
1. No immediate action required for migration — this is a security best-practice item
2. Future enhancement: remove client-side password comparison; use server-side validation only

---

### PB-07 — Password Written to INI File *(LOW)*

**Issue**: During organization-change operations, `w_login.srw` writes the database password (`DBPass`) to the LCD INI file on disk so it can be recovered after application restart. The value is written in cleartext.

**Affected File**: `pb_export/LCD7/w_login.srw` — lines 282-302

**Code**:
```powerscript
ls_PW_From_File = ProfileString(ls_WinPath, "database", "DBPass", "DUMMY")
...
SetProfileString(nvo_Application.fnv_get_inifilename(), "database", "DBPass", "DUMMY")
```

**Remediation**:
1. No functional break in 19c — this is a security concern
2. Future enhancement: use Windows Credential Manager or DPAPI for credential caching

---

### PB-08 — FTP Control Parameters from ORG_PARAM *(MEDIUM)*

**Issue**: `f_ftp_control.srf` reads FTP connection parameters (IP address, user ID, password, directory paths) from `LCD.ORG_PARAM` columns like `ftp_<system>_ipaddr`, `ftp_<system>_dir`, `ftp_io_dir`, and `lcd_server_loc`. The task 42-2 SQL migration deprecated `LCD_FILE_PARAM` and moved file paths to Oracle Directory Objects, but the FTP control function reads path information from ORG_PARAM directly. If `lcd_server_loc` or `ftp_io_dir` values change as part of the 19c migration, FTP operations will fail.

**Affected Files**:
- `pb_export/SHARED/f_ftp_control.srf` — lines 35-40 (field name construction), lines 42-68 (SELECT from ORG_PARAM)
- `pb_export/SHARED/f_ftp_control_ini.srf` — line 25 (reads oracle_server from INI file)
- `pb_export/TBLADMIN/w_org_control.srw` — FTP parameter maintenance screen
- `pb_export/TBLADMIN/w_org_detail.srw` — ORG_PARAM detail screen

**Remediation**:
1. Verify that `lcd_server_loc`, `ftp_io_dir`, and `ftp_<system>_dir` values in `ORG_PARAM` are updated to reflect 19c server paths
2. No PB source code changes needed — the function reads dynamically from the table
3. Coordinate with DBA to ensure FTP paths match the new Oracle Directory Object OS paths

---

### PB-09 — Oracle Error Code Handling *(LOW)*

**Issue**: The login window handles specific Oracle error codes for authentication failures. Oracle 19c may return additional or different error codes, particularly around password expiration and account locking.

**Affected File**: `pb_export/LCD7/w_login.srw` — lines 658-692

**Error codes currently handled**:
| Code | Current Handling | 19c Risk |
|---|---|---|
| `ORA-1017` | "Invalid user name/password" | Still valid in 19c |
| `ORA-28000` | "ID is locked" → `HALT CLOSE` | Still valid, but 19c may also return ORA-28000 for failed login attempts under stricter profile settings |
| General else | Generic error message → `HALT CLOSE` | May need ORA-28001 (password expired), ORA-28002 (password will expire) handling |

**Remediation**:
1. Add explicit handling for `ORA-28001` (password expired) — redirect to password change screen
2. Add handling for `ORA-28002` (password grace period) — show warning and allow login
3. Test the existing `wf_User_Active()` logic which implements LCD's own password expiration check against `LCD.APPL_USER.user_password` — verify it doesn't conflict with Oracle 19c's native profile-based expiration

---

### PB-10 — Database Link References in Table Copy *(MEDIUM)*

**Issue**: `w_p_copy_tables.srw` uses database links stored in `LCD.SUPPORT_SYSTEMS` (where `SYSTEM_TYPE = 'DBLINK'`) to copy table data between environments. Database links must be recreated in Oracle 19c, and the `P_COPY_TABLES` stored procedure (called via RPCFUNC) uses `DB_LINK_TO` and `DB_LINK_FROM` parameters.

**Affected Files**:
- `pb_export/ADMIN/w_p_copy_tables.srw` — lines 176-235 (DB link lookup and parameter passing)
- `pb_export/LCD7/uo_trans.sru` — line 81: `P_COPY_TABLES` RPCFUNC declaration

**Remediation**:
1. Recreate all database links in the 19c environment
2. Update `LCD.SUPPORT_SYSTEMS` records where `SYSTEM_TYPE = 'DBLINK'` with new link names
3. No PB code changes needed — link names are table-driven

---

