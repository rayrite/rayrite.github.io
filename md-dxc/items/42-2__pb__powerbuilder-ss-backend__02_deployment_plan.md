# LCD Server-Side Backend — Oracle 19c Migration Deployment Plan

> **Task**: 42-2 PB SS-Backend
> **Date**: May 24, 2026
> **Author**: RdW (Cascade-assisted)

---

## Prerequisites

1. Oracle 19c PDB is running and accessible
2. Task 42-2 SQL patches (UTL_FILE migration) deployed — especially `BATCH.SQL`
3. DBA access available (SYS or SYSTEM) for grant operations
4. SQL Developer or SQL*Plus connected to the 19c PDB
5. Backup of current stored procedures taken

---

## Deployment Steps

### Step 1: Pre-Deployment Grant Setup

Connect as **SYS** or **SYSTEM** to the 19c PDB and execute:

```sql
-- =====================================================================
-- Step 1: Oracle 19c Grant Setup for LCD Server-Side Backend
-- =====================================================================

-- SS-01/SS-02: ALTER USER privilege (Change_Password, f_Unlock_user)
GRANT ALTER USER TO LCD;

-- SS-05/SS-08: DBMS_PIPE (LCDBatch pipes, lcd.pkg_pipe)
GRANT EXECUTE ON SYS.DBMS_PIPE TO LCD;

-- SS-06: DBMS_SCHEDULER (LCDBatch.SUB_JOB)
GRANT EXECUTE ON SYS.DBMS_SCHEDULER TO LCD;
GRANT CREATE JOB TO LCD;

-- Verify grants
SELECT PRIVILEGE FROM DBA_SYS_PRIVS WHERE GRANTEE = 'LCD' ORDER BY PRIVILEGE;
```

**Expected output** should include: `ALTER USER`, `CREATE JOB`, `CREATE SESSION`, etc.

**Troubleshooting**:
- `ORA-01031: insufficient privileges` → You're not connected as SYS/SYSTEM
- `ORA-65096: invalid common user or role name` → You're in the CDB root, switch to PDB: `ALTER SESSION SET CONTAINER = <pdb_name>;`

---

### Step 2: Deploy Patched Change_Password.sql (SS-01/SS-12)

Connect as **LCD** schema owner (or SYS with `ALTER SESSION SET CURRENT_SCHEMA = LCD`):

```sql
-- Step 2: Deploy Change_Password.sql
@patched/Change_Password.sql

-- Verify compilation
SELECT OBJECT_NAME, STATUS FROM USER_OBJECTS WHERE OBJECT_NAME = 'CHANGE_PASSWORD';
```

**Expected**: `STATUS = VALID`

**Troubleshooting**:
- `STATUS = INVALID` → Check `SELECT TEXT FROM USER_ERRORS WHERE NAME = 'CHANGE_PASSWORD';`
- `ORA-01031` on ALTER USER → Step 1 grants not applied
- Compilation warning about `pwdverify.DICTIONARY` → Expected if schema doesn't exist — the function handles this gracefully now

---

### Step 3: Deploy Patched f_Unlock_user.sql (SS-02)

```sql
-- Step 3: Deploy f_Unlock_user.sql
@patched/f_Unlock_user.sql

-- Verify compilation
SELECT OBJECT_NAME, STATUS FROM USER_OBJECTS WHERE OBJECT_NAME = 'F_UNLOCK_USER';
```

**Expected**: `STATUS = VALID`

---

### Step 4: Deploy LCDBatch Package (SS-05/SS-06)

```sql
-- Step 4a: Deploy package specification
@patched/BATCH1.SQL

-- Step 4b: Deploy package body
@patched/BATCH2.SQL

-- Verify compilation
SELECT OBJECT_NAME, OBJECT_TYPE, STATUS FROM USER_OBJECTS
WHERE OBJECT_NAME = 'LCDBATCH' ORDER BY OBJECT_TYPE;
```

**Expected**:
| OBJECT_NAME | OBJECT_TYPE | STATUS |
|---|---|---|
| LCDBATCH | PACKAGE | VALID |
| LCDBATCH | PACKAGE BODY | VALID |

**Troubleshooting**:
- `PACKAGE BODY = INVALID` → Missing DBMS_PIPE grant. Run Step 1 grants and recompile:
  ```sql
  ALTER PACKAGE LCD.LCDBATCH COMPILE BODY;
  ```

---

### Step 5: Deploy BATCH3.SQL — GetStatus/RMQueue/BRJob (SS-05/SS-06)

```sql
-- Step 5: Deploy BATCH3.SQL
@patched/BATCH3.SQL

-- Verify all three procedures
SELECT OBJECT_NAME, STATUS FROM USER_OBJECTS
WHERE OBJECT_NAME IN ('GETSTATUS','RMQUEUE','BRJOB') ORDER BY OBJECT_NAME;
```

**Expected**: All `STATUS = VALID`

---

### Step 6: Deploy lcd.pkg_pipe (SS-08)

```sql
-- Step 6a: Deploy package specification
@patched/PKG_PIPE.SQL

-- Step 6b: Deploy package body
@patched/PKGBPIPE.SQL

-- Verify compilation
SELECT OBJECT_NAME, OBJECT_TYPE, STATUS FROM USER_OBJECTS
WHERE OBJECT_NAME = 'PKG_PIPE' ORDER BY OBJECT_TYPE;
```

**Expected**: Both PACKAGE and PACKAGE BODY = VALID

---

### Step 7: Post-Deployment Verification

```sql
-- =====================================================================
-- Step 7: Comprehensive Post-Deployment Verification
-- =====================================================================

-- 7a: All patched objects should be VALID
SELECT OBJECT_NAME, OBJECT_TYPE, STATUS
FROM USER_OBJECTS
WHERE OBJECT_NAME IN (
    'CHANGE_PASSWORD', 'F_UNLOCK_USER',
    'LCDBATCH', 'GETSTATUS', 'RMQUEUE', 'BRJOB',
    'PKG_PIPE'
)
ORDER BY OBJECT_NAME, OBJECT_TYPE;

-- 7b: Verify AUTHID on patched functions
SELECT OBJECT_NAME, AUTHID FROM USER_PROCEDURES
WHERE OBJECT_NAME IN ('CHANGE_PASSWORD','F_UNLOCK_USER')
AND OBJECT_TYPE = 'FUNCTION';

-- 7c: Verify DBMS_PIPE accessibility
DECLARE v NUMBER;
BEGIN
    v := DBMS_PIPE.CREATE_PIPE('LCD_DEPLOY_TEST');
    v := DBMS_PIPE.REMOVE_PIPE('LCD_DEPLOY_TEST');
    DBMS_OUTPUT.PUT_LINE('DBMS_PIPE: OK');
END;
/

-- 7d: Verify DBMS_SCHEDULER accessibility
BEGIN
    DBMS_SCHEDULER.CREATE_JOB(
        job_name => 'LCD_DEPLOY_TEST_JOB',
        job_type => 'PLSQL_BLOCK',
        job_action => 'BEGIN NULL; END;',
        enabled => FALSE
    );
    DBMS_SCHEDULER.DROP_JOB('LCD_DEPLOY_TEST_JOB');
    DBMS_OUTPUT.PUT_LINE('DBMS_SCHEDULER: OK');
END;
/

-- 7e: Verify Change_Password can find pwdverify.DICTIONARY (or skip gracefully)
DECLARE
    v_result INTEGER;
    v_msg VARCHAR2(256);
BEGIN
    v_msg := SPACE(256);
    -- Use a dummy call that should fail on validation (password = username)
    v_result := CHANGE_PASSWORD('LCD', 'LCD', 'dummy_old_pw', v_msg);
    DBMS_OUTPUT.PUT_LINE('Change_Password test result: ' || v_result || ' msg: ' || v_msg);
END;
/
-- Expected: result = -1, msg about password same as username
```

---

### Step 8: Recompile Any Invalid Objects

```sql
-- Step 8: Recompile any INVALID objects in LCD schema
BEGIN
    DBMS_UTILITY.COMPILE_SCHEMA('LCD', FALSE);
END;
/

-- Check for remaining invalids
SELECT OBJECT_NAME, OBJECT_TYPE, STATUS FROM USER_OBJECTS
WHERE STATUS = 'INVALID' AND OBJECT_TYPE IN ('FUNCTION','PROCEDURE','PACKAGE','PACKAGE BODY')
ORDER BY OBJECT_NAME;
```

**Expected**: No invalid objects related to the patched files.

---

## Rollback Procedure

If issues are found, restore from originals:

```sql
-- Rollback by deploying original (unpatched) versions
@original/Change_Password.sql
@original/f_Unlock_user.sql
@original/BATCH1.SQL
@original/BATCH2.SQL
@original/BATCH3.SQL
@original/PKG_PIPE.SQL
@original/PKGBPIPE.SQL

-- Recompile
ALTER PACKAGE LCD.LCDBATCH COMPILE;
ALTER PACKAGE LCD.LCDBATCH COMPILE BODY;
ALTER PACKAGE LCD.PKG_PIPE COMPILE;
ALTER PACKAGE LCD.PKG_PIPE COMPILE BODY;
```

The grants from Step 1 are additive and do not need to be revoked.

---

## Quick Troubleshooting Reference

| Symptom | Cause | Fix |
|---|---|---|
| `ORA-01031: insufficient privileges` on ALTER USER | Missing ALTER USER grant | `GRANT ALTER USER TO LCD;` as SYS |
| `PACKAGE BODY INVALID` for LCDBATCH | Missing DBMS_PIPE grant | `GRANT EXECUTE ON SYS.DBMS_PIPE TO LCD;` |
| `ORA-00942` in Change_Password | Missing pwdverify.DICTIONARY | Patched version skips gracefully; verify with test |
| `ORA-06550: wrong number of parameters` | Old RPCFUNC signature mismatch | Verify PB uo_trans.sru bindings match function signatures |
| Batch jobs fail to submit | Missing CREATE JOB privilege | `GRANT CREATE JOB TO LCD;` |
| GetStatus returns nothing | DBMS_PIPE pipes not created | Check DBMS_PIPE grant; run batch job lifecycle test |

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
| `LCD_663*` | `/csclcdnc0002/Q22S-663/*` |
| `LCD_149*` | `/csclcdnc0002/Q22S-149/*` |
| `LCD_285*` | `/csclcdnc0002/Q22S-285/*` |
| `LCD_FEDERAL*` | `/csclcdnc0002/Q22S-FEDERAL/*` |
| `LCD_CANADA*` | `/csclcdnc0002/Q22S-CANADA/*` |

### LCD_SERVER_LOC by Org (from CSV)

| Org | LCD_SERVER_LOC |
|---|---|
| 010, 180, 580 | `/csclcdnc0002/Q22S` |
| 114 | `/csclcdnc0002/Q22S-FEDERAL` |
| 149 | `/csclcdnc0002/Q22S-149` |
| 285 | `/csclcdnc0002/Q22S-285` |
| 663 | `/csclcdnc0002/Q22S-663` |

---

*End of deployment plan.*
