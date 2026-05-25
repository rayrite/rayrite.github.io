# LCD PB GUI — Oracle 19c Migration Implementation Plan

> **Task**: 42-2 PB GUI Frontend
> **Date**: May 24, 2026
> **Author**: RdW (Cascade-assisted)
> **Project Root**: `tasks/42-2/pb/powerbuilder-pb-frontend/`

---

## Overview

This plan covers the remediation of all findings from the PB-side Oracle 11g→19c migration analysis (`00_pb_oracle19c_migration_analysis_PB.md`). Changes are organized into three phases by severity and dependency.

---

## Phase 1 — Critical Code Changes (Agent-Applied)

These changes have been applied by the Cascade agent to files in the `patched/` folder. They must be manually replicated in the PowerBuilder 2021 IDE to produce a compilable PBL.

### 1.1 PB-01: Password Case-Sensitivity Fix *(HIGH)*

**File**: `patched/SHARED/w_reconnect.srw`
**Changes applied**:

| Location | Old Code | New Code |
|---|---|---|
| `cb_ok` clicked event, line ~105 | `IF is_passwd <> upper(sqlca.dbpass) and ii_repeat = 0 THEN` | `IF is_passwd <> sqlca.dbpass and ii_repeat = 0 THEN` |
| `cb_ok` clicked event, line ~114 | `IF is_passwd <> upper(sqlca.dbpass) THEN` | `IF is_passwd <> sqlca.dbpass THEN` |
| `sle_password` modified event, line ~188 | `is_passwd = Upper(Trim(this.text))` | `is_passwd = Trim(this.text)` |

**Comment prefix**: `// RdW 5/24/2026 Powerbuilder GUI-SS Oracle 19c Migration - PB-01`
**Rationale**: Oracle 19c enforces case-sensitive passwords by default. The `Upper()` calls corrupt case-preserving passwords, causing silent authentication failures during reconnection.

### 1.2 PB-04: LISTAGG Overflow Protection *(MEDIUM)*

**File**: `patched/LCD7/d_user_roles_orgs.srd`
**Changes applied**:

| Location | Old Code | New Code |
|---|---|---|
| DataWindow SQL retrieve, line ~20 | `listagg(LCD.APPL_USER.ORG_CODE,', ')` | `listagg(LCD.APPL_USER.ORG_CODE,', ' ON OVERFLOW TRUNCATE '...' WITHOUT COUNT)` |

**Rationale**: Oracle 19c throws ORA-01489 if LISTAGG exceeds 4000 bytes. The `ON OVERFLOW TRUNCATE` clause (new in 12c R2) prevents this gracefully.

### 1.3 PB-09: Oracle 19c Error Code Handling *(LOW → elevated to MEDIUM)*

**File**: `patched/LCD7/w_login.srw`
**Changes applied**: Added two new `ELSEIF` blocks after the existing `ORA-28000` handler:

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

**Rationale**: Oracle 19c returns ORA-28001/28002 for password expiration scenarios that 11g handled differently.

---

## Phase 2 — Database-Side Configuration (DBA Tasks)

These items require DBA action, no PB code changes.

### 2.1 PB-02: DBA_ROLE_PRIVS / USER_ROLE_PRIVS Grants

**Action**: Verify/grant SELECT privileges on `DBA_ROLE_PRIVS` and `USER_ROLE_PRIVS` to LCD application users in the 19c PDB.

```sql
-- Run as SYS or SYSTEM in the PDB
GRANT SELECT ON SYS.DBA_ROLE_PRIVS TO LCD;
GRANT SELECT ON SYS.USER_ROLE_PRIVS TO LCD;
-- Also grant to any LCD admin users who log in directly
```

**Affected PB files** (8 total — no code changes needed):
- `LCD7/d_granted_roles.srd`
- `LCD7/d_user_roles.srd`
- `LCD7/d_user_roles_orgs.srd`
- `LCD7/nvo_keyglobals.sru`
- `LCD7/w_set_user_roles.srw`
- `LCD7/w_user_role_report.srw`
- `LCD7/w_main.srw`
- `SPECPAY1/dddw_special_wages.srd`

### 2.2 PB-05: RPCFUNC Server-Side Verification

**Action**: Verify all 49 RPCFUNC targets compile and execute in 19c. See Appendix A of the analysis for the full inventory. Focus on:
- `CREATE_USER`, `DROP_USER`, `GRANT_USER_ROLE`, `REVOKE_USER_ROLE` — DDL procedures
- `CHANGE_PASSWORD`, `VERIFY_PASSWORD`, `F_UNLOCK_USER` — password management
- `PIPE_DELETE` — DBMS_PIPE usage
- `F_FILE_EXIST`, `FILECOPY*`, `GET*FILE` — UTL_FILE (covered by task 42-2 SQL patches)

### 2.3 PB-08: FTP Path Verification

**Action**: Verify `LCD.ORG_PARAM` FTP columns match 19c server paths:

| Column | Purpose | 19c Path Base |
|---|---|---|
| `LCD_SERVER_LOC` | Base directory for LCD file I/O | `/csclcdnc0002/Q22S` (default org) |
| `FTP_IO_DIR` | FTP I/O directory | Must match OS path on 19c server |
| `FTP_<system>_DIR` | System-specific FTP dirs | Verify per org |

**Reference data**: See `tasks/42-2/uat/LCD_ORGPARAM_Q22S-19c-UPDATED.csv` for current values.

### 2.4 PB-10: Database Link Recreation

**Action**: Recreate database links in 19c; update `LCD.SUPPORT_SYSTEMS` where `SYSTEM_TYPE = 'DBLINK'`.

---

## Phase 3 — Deferred / Future Enhancements

### 3.1 PB-03: Oracle (+) Outer Join Syntax (39+ files)

**Action**: No code changes now. Run regression tests. Schedule ANSI JOIN conversion for future maintenance cycle.

### 3.2 PB-06 / PB-07: Cleartext Password Storage

**Action**: Document only. Plan future enhancement to use secure credential storage.

---

## To-Do Checklist

| # | Phase | Item | Status |
|---|---|---|---|
| 1 | P1 | PB-01: Apply `w_reconnect.srw` patch in PB IDE | Patched (agent) — needs IDE apply |
| 2 | P1 | PB-04: Apply `d_user_roles_orgs.srd` LISTAGG fix in PB IDE | Patched (agent) — needs IDE apply |
| 3 | P1 | PB-09: Apply `w_login.srw` ORA-28001/28002 handlers in PB IDE | Patched (agent) — needs IDE apply |
| 4 | P2 | PB-02: DBA grants for DBA_ROLE_PRIVS | DBA task |
| 5 | P2 | PB-05: Verify RPCFUNC server-side targets in 19c | Test task |
| 6 | P2 | PB-08: Verify ORG_PARAM FTP paths | DBA/ops task |
| 7 | P2 | PB-10: Recreate DB links | DBA task |
| 8 | P3 | PB-03: Outer join regression testing | Test task |
| 9 | P3 | PB-06/07: Security documentation | Doc task |

---

## File Inventory

### Files with Agent-Applied Patches (in `patched/`)

| File | Risk ID | Change Type |
|---|---|---|
| `SHARED/w_reconnect.srw` | PB-01 | Remove Upper() from password comparisons |
| `LCD7/d_user_roles_orgs.srd` | PB-04 | Add ON OVERFLOW TRUNCATE to LISTAGG |
| `LCD7/w_login.srw` | PB-09 | Add ORA-28001/28002 error handlers |

### Files Backed Up for Reference (in `originals/` — no changes needed)

| File | Risk ID | Reason for Backup |
|---|---|---|
| `LCD7/d_granted_roles.srd` | PB-02 | References USER_ROLE_PRIVS |
| `LCD7/d_user_roles.srd` | PB-02 | References DBA_ROLE_PRIVS |
| `LCD7/nvo_keyglobals.sru` | PB-02, PB-06 | DBA_ROLE_PRIVS queries + password storage |
| `LCD7/w_set_user_roles.srw` | PB-02 | DBA_ROLE_PRIVS queries |
| `LCD7/w_user_role_report.srw` | PB-02 | DBA_ROLE_PRIVS post-processing |
| `LCD7/w_main.srw` | PB-02 | Role-based menu security |
| `SPECPAY1/dddw_special_wages.srd` | PB-02 | DBA_ROLE_PRIVS in dropdown DW |
| `LCD7/w_change_password.srw` | PB-06 | Password global variable usage |
| `LCD7/w_change_password_for_another.srw` | PB-06 | Password management |
| `LCD7/uo_trans.sru` | PB-05 | RPCFUNC binding inventory |
| `SHARED/f_ftp_control.srf` | PB-08 | FTP parameter reading |
| `SHARED/f_ftp_control_ini.srf` | PB-08 | FTP INI file reading |
| `ADMIN/w_p_copy_tables.srw` | PB-10 | DB link references |

---

## Environment Reference

### Oracle Directory Objects (UAT — Q22S)

| Directory Name | OS Path |
|---|---|
| `LCD` | `/csclcdnc0002/Q22S` |
| `LCD_IN` | `/csclcdnc0002/Q22S/In` |
| `LCD_OUT` | `/csclcdnc0002/Q22S/Out` |
| `LCD_ARCH` | `/csclcdnc0002/Q22S/Archive` |
| `LCD_ARCH_IN` | `/csclcdnc0002/Q22S/Archive/In` |
| `LCD_ARCH_OUT` | `/csclcdnc0002/Q22S/Archive/Out` |
| `LCD_663` | `/csclcdnc0002/Q22S-663` |
| `LCD_663_IN` | `/csclcdnc0002/Q22S-663/IN` |
| `LCD_149` | `/csclcdnc0002/Q22S-149` |
| `LCD_149_IN` | `/csclcdnc0002/Q22S-149/IN` |
| `LCD_285_IN` | `/csclcdnc0002/Q22S-285/IN` |
| `LCD_FEDERAL_IN` | `/csclcdnc0002/Q22S-FEDERAL/IN` |
| `LCD_CANADA_IN` | `/csclcdnc0002/Q22S-CANADA/IN` |

### LCD_SERVER_LOC Values per Org (from Q22S CSV)

| Org | LCD_SERVER_LOC |
|---|---|
| 010 | `/csclcdnc0002/Q22S` |
| 580 | `/csclcdnc0002/Q22S` |
| 114 | `/csclcdnc0002/Q22S-FEDERAL` |
| 180 | `/csclcdnc0002/Q22S` |

*(See `tasks/42-2/uat/LCD_ORGPARAM_Q22S-19c-UPDATED.csv` for complete list)*

---

*End of implementation plan.*
