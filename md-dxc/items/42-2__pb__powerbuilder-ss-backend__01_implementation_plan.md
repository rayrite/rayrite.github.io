# LCD Server-Side Backend — Oracle 19c Migration Implementation Plan

> **Task**: 42-2 PB SS-Backend
> **Date**: May 24, 2026
> **Author**: RdW (Cascade-assisted)
> **Project Root**: `tasks/42-2/pb/powerbuilder-ss-backend/`

---

## Overview

This plan covers the remediation of all SS- findings from the Oracle 11g→19c migration analysis. Changes are organized into three phases.

---

## Phase 1 — Code Changes (Agent-Applied to `patched/`)

### 1.1 SS-01: Change_Password.sql — Dynamic ALTER USER *(HIGH)*

**Changes**:
1. Added `AUTHID CURRENT_USER` to function declaration for 19c PDB privilege resolution
2. Added `v_dict_table_exists` variable for safe pwdverify.DICTIONARY detection
3. Wrapped dictionary word check in `BEGIN...EXCEPTION` block that queries `ALL_TABLES` before accessing `pwdverify.DICTIONARY` (SS-12 fix included)
4. Added commented-out `DBMS_OUTPUT` debug lines with `19c_DEBUG SS-01` prefix
5. No change to the `ALTER USER ... IDENTIFIED BY` statement — quoted password syntax is already 19c-compatible

### 1.2 SS-02: f_Unlock_user.sql — Dynamic ALTER USER ACCOUNT UNLOCK *(HIGH)*

**Changes**:
1. Added `AUTHID CURRENT_USER` to function declaration for 19c PDB compatibility
2. Added `l_sql` variable to build ALTER USER statement before execution (better debug visibility)
3. Improved error handling: check `dbms_sql.is_open(cur_us)` before closing cursor in exception handler
4. Added commented-out `DBMS_OUTPUT` debug lines with `19c_DEBUG SS-02` prefix

### 1.3 SS-05: BATCH1.SQL, BATCH2.SQL, BATCH3.SQL — DBMS_PIPE/DBMS_SCHEDULER *(MEDIUM)*

**Changes**: Added header comments documenting Oracle 19c prerequisites:
- `GRANT EXECUTE ON SYS.DBMS_PIPE TO LCD;`
- `GRANT EXECUTE ON SYS.DBMS_SCHEDULER TO LCD;`
- `GRANT CREATE JOB TO LCD;`
- No code logic changes — DBMS_PIPE and DBMS_SCHEDULER APIs are unchanged in 19c

### 1.4 SS-08: PKG_PIPE.SQL, PKGBPIPE.SQL — lcd.pkg_pipe Wrapper *(MEDIUM)*

**Changes**:
1. Added header comments documenting `EXECUTE ON SYS.DBMS_PIPE` grant requirement
2. Added commented-out `DBMS_OUTPUT` debug line in `p_pipe_in(VARCHAR2)` overload for diagnostic tracing

---

## Phase 2 — DBA Configuration Tasks (No Code Changes)

### 2.1 SS-03: CREATE_USER / DROP_USER — Source Extraction

**Action**: Extract missing standalone procedure source from the 11g database before decommission.

```sql
-- Run on 11g database
SET LONG 50000
SET PAGESIZE 0
SPOOL create_user_source.sql
SELECT TEXT FROM DBA_SOURCE WHERE NAME = 'CREATE_USER' AND TYPE = 'PROCEDURE' ORDER BY LINE;
SPOOL OFF
SPOOL drop_user_source.sql
SELECT TEXT FROM DBA_SOURCE WHERE NAME = 'DROP_USER' AND TYPE = 'PROCEDURE' ORDER BY LINE;
SPOOL OFF
```

Then review for 19c:
- Verify DEFAULT/TEMPORARY TABLESPACE names exist in 19c PDB
- Verify QUOTA assignments
- Test `DROP USER ... CASCADE` behavior

### 2.2 SS-04: GRANT_USER_ROLE / REVOKE_USER_ROLE — Source Extraction

**Action**: Same extraction method as SS-03.

```sql
SPOOL grant_user_role_source.sql
SELECT TEXT FROM DBA_SOURCE WHERE NAME = 'GRANT_USER_ROLE' AND TYPE = 'PROCEDURE' ORDER BY LINE;
SPOOL OFF
SPOOL revoke_user_role_source.sql
SELECT TEXT FROM DBA_SOURCE WHERE NAME = 'REVOKE_USER_ROLE' AND TYPE = 'PROCEDURE' ORDER BY LINE;
SPOOL OFF
```

Verify: `GRANT ANY ROLE` privilege in 19c PDB. Verify all 30 LCD roles exist.

### 2.3 SS-06: DBMS_SCHEDULER Privileges

**Action**: Grant verification only.
```sql
GRANT CREATE JOB TO LCD;
GRANT MANAGE SCHEDULER TO LCD;
```

### 2.4 SS-07: BATCH.SQL UTL_FILE → Task 42-2

**Action**: Verify task 42-2 SQL patches are deployed. BATCH.SQL is already patched in `tasks/42-2/SQL/patched/BATCH.SQL`.

### 2.5 SS-09/SS-10: Missing Function Source Extraction

**Action**: Extract from 11g database:
```sql
SPOOL lcd_password_expiration_source.sql
SELECT TEXT FROM DBA_SOURCE WHERE NAME = 'LCD_PASSWORD_EXPIRATION' ORDER BY LINE;
SPOOL OFF
SPOOL verify_password_source.sql
SELECT TEXT FROM DBA_SOURCE WHERE NAME = 'VERIFY_PASSWORD' ORDER BY LINE;
SPOOL OFF
```

### 2.6 SS-11: Database Links

**Action**: Recreate database links in 19c. Update `LCD.SUPPORT_SYSTEMS` where `SYSTEM_TYPE = 'DBLINK'`.

### 2.7 SS-12: pwdverify.DICTIONARY

**Action**: Verify or recreate the `pwdverify` schema and `DICTIONARY` table. The patched `Change_Password.sql` now safely skips this check if the table doesn't exist.

---

## Phase 3 — Grant Verification Script

Run this comprehensive script in the 19c PDB as SYS or SYSTEM:

```sql
-- Phase 3: Oracle 19c Grant Verification for LCD Server-Side Backend
-- =====================================================================

-- SS-01/SS-02: ALTER USER privilege for Change_Password and f_Unlock_user
GRANT ALTER USER TO LCD;

-- SS-05/SS-08: DBMS_PIPE for LCDBatch and lcd.pkg_pipe
GRANT EXECUTE ON SYS.DBMS_PIPE TO LCD;

-- SS-06: DBMS_SCHEDULER for LCDBatch.SUB_JOB
GRANT EXECUTE ON SYS.DBMS_SCHEDULER TO LCD;
GRANT CREATE JOB TO LCD;

-- SS-12: pwdverify.DICTIONARY read access (if schema exists)
-- GRANT SELECT ON PWDVERIFY.DICTIONARY TO LCD;

-- Verify all grants applied
SELECT PRIVILEGE FROM DBA_SYS_PRIVS WHERE GRANTEE = 'LCD' ORDER BY PRIVILEGE;
SELECT TABLE_NAME, PRIVILEGE FROM DBA_TAB_PRIVS WHERE GRANTEE = 'LCD' AND GRANTOR = 'SYS' ORDER BY TABLE_NAME;
```

---

## To-Do Checklist

| # | Phase | Item | Status |
|---|---|---|---|
| 1 | P1 | SS-01: Patch Change_Password.sql | Done (agent) |
| 2 | P1 | SS-02: Patch f_Unlock_user.sql | Done (agent) |
| 3 | P1 | SS-05: Add grant comments to BATCH1/2/3.SQL | Done (agent) |
| 4 | P1 | SS-08: Add grant comments to PKG_PIPE/PKGBPIPE.SQL | Done (agent) |
| 5 | P2 | SS-03: Extract CREATE_USER/DROP_USER from 11g | DBA task |
| 6 | P2 | SS-04: Extract GRANT_USER_ROLE/REVOKE_USER_ROLE from 11g | DBA task |
| 7 | P2 | SS-06: Verify DBMS_SCHEDULER grants | DBA task |
| 8 | P2 | SS-07: Verify task 42-2 BATCH.SQL deployed | Deploy verification |
| 9 | P2 | SS-09/SS-10: Extract LCD_PASSWORD_EXPIRATION, VERIFY_PASSWORD | DBA task |
| 10 | P2 | SS-11: Recreate DB links | DBA task |
| 11 | P2 | SS-12: Verify pwdverify.DICTIONARY | DBA task |
| 12 | P3 | Run grant verification script | DBA task |

---

## File Inventory

| File | SS-ID | Change Type |
|---|---|---|
| `Change_Password.sql` | SS-01, SS-12 | AUTHID CURRENT_USER, dictionary check protection, debug output |
| `f_Unlock_user.sql` | SS-02 | AUTHID CURRENT_USER, improved error handling, debug output |
| `BATCH1.SQL` | SS-05, SS-06 | Grant prerequisite comments |
| `BATCH2.SQL` | SS-05, SS-06 | Grant prerequisite comments |
| `BATCH3.SQL` | SS-05, SS-06 | Grant prerequisite comments |
| `PKG_PIPE.SQL` | SS-08 | Grant prerequisite comments |
| `PKGBPIPE.SQL` | SS-08 | Grant prerequisite comments, debug output |

---

*End of implementation plan.*
