# Oracle 19c Migration: LCD PowerBuilder GUI — Deployment Plan

**Author:** RdW  
**Date:** 2026-05-24  
**Environments:** DEV (D22) → QA (Q22) → UAT (Q22S) → PRODUCTION  
**Application server path:** App server hosting LCD.EXE and lcd.ini  
**Oracle 19c Linux host:** `/csclcdnc0002/` NAS share

---

## Pre-Deployment Checklist

Complete ALL items before executing any deployment step.

| # | Check | Who | Done? |
|---|-------|-----|-------|
| 1 | RISK-06 grant verified: `GRANT SELECT ON SYS.DBA_ROLE_PRIVS TO LCD` applied in target env | DBA | ✓ UAT |
| 2 | All 63 patched files re-exported from Appeon PB 2021 IDE to `patched/` | Developer | |
| 3 | All affected PBLs rebuilt without errors in Appeon PB 2021 | Developer | |
| 4 | `risk07_audit_password_procs.sql` run — zero deprecated VERIFY_FUNCTION rows | DBA | |
| 5 | Oracle Directory objects confirmed: `SELECT DIRECTORY_NAME,DIRECTORY_PATH FROM ALL_DIRECTORIES WHERE DIRECTORY_NAME LIKE 'LCD%'` returns all expected dirs | DBA | |
| 6 | All NFS/shared drive paths mounted and accessible on Oracle server | DBA/SysAdmin | |
| 7 | DB link `@ites_lcd` and all links in `LCD.SUPPORT_SYSTEMS` recreated on 19c | DBA | |
| 8 | Backup of current production PBLs and LCD.EXE archived with timestamp | Developer | |

---

## Deployment Pipeline

```
DEV (D22)  →  QA (Q22)  →  UAT (Q22S)  →  PRODUCTION
```

Run full deploy + smoke test at each stage before promoting.

---

## Step 1 — DBA Pre-Deployment Tasks (Oracle 19c Server)

**Estimated time:** 2–4 hours  
**Environment:** Target Oracle 19c instance (UAT = Q22S, PROD = Q22P)

### 1a. Verify Oracle Directory Objects

```sql
-- RdW 5/24/2026 Powerbuilder GUI-SS Oracle 19c Migration
-- Verify all required Oracle Directory objects exist and point to correct paths
SET SERVEROUTPUT ON SIZE UNLIMITED;
DECLARE
  v_count NUMBER := 0;
BEGIN
  DBMS_OUTPUT.PUT_LINE('=== LCD Oracle Directory Verification ===');
  DBMS_OUTPUT.PUT_LINE('Timestamp: ' || TO_CHAR(SYSDATE,'YYYY-MM-DD HH24:MI:SS'));
  FOR r IN (
    SELECT DIRECTORY_NAME, DIRECTORY_PATH
    FROM   ALL_DIRECTORIES
    WHERE  DIRECTORY_NAME LIKE 'LCD%'
    ORDER BY DIRECTORY_NAME
  ) LOOP
    DBMS_OUTPUT.PUT_LINE('  DIR: ' || RPAD(r.DIRECTORY_NAME,25) || ' -> ' || r.DIRECTORY_PATH);
    v_count := v_count + 1;
  END LOOP;
  DBMS_OUTPUT.PUT_LINE('Total LCD directories: ' || v_count);
  IF v_count < 10 THEN
    DBMS_OUTPUT.PUT_LINE('WARNING: Expected at least 10 LCD directories. Check DB_DIRECTORIES.txt.');
  END IF;
END;
/
```

**Expected output (UAT Q22S):**
```
DIR: LCD                      -> /csclcdnc0002/Q22S
DIR: LCD_149                  -> /csclcdnc0002/Q22S-149
DIR: LCD_149_ARCH             -> /csclcdnc0002/Q22S-149/ARCHIVE
DIR: LCD_149_ARCH_IN          -> /csclcdnc0002/Q22S-149/ARCHIVE/IN
DIR: LCD_149_ARCH_OUT         -> /csclcdnc0002/Q22S-149/ARCHIVE/OUT
DIR: LCD_149_IN               -> /csclcdnc0002/Q22S-149/IN
DIR: LCD_149_OUT              -> /csclcdnc0002/Q22S-149/OUT
DIR: LCD_285_ARCH             -> /csclcdnc0002/Q22S-285/ARCHIVE
...
Total LCD directories: 35
```

**Troubleshooting:** If fewer than expected — run the CREATE DIRECTORY statements from `DB_DIRECTORIES.txt` as SYS. Ensure the NFS mount is active: `ls -la /csclcdnc0002/Q22S` from the Oracle server.

### 1b. Apply RISK-06 Grant (if not already done)

```sql
-- Already applied in UAT — run only for QA/PROD deployments
GRANT SELECT ON SYS.DBA_ROLE_PRIVS TO LCD;
```

### 1c. Recreate DB Links (RISK-10)

Run `patched/sql/risk10_dblink_recreation.sql`.  
Verify with: `SELECT DB_LINK, USERNAME, HOST FROM USER_DB_LINKS;`

### 1d. Run UTL_FILE Directory Mapping Verification

Run `patched/sql/risk_utlfile_directory_mapping.sql`.  
Confirm each org's `LCD_SERVER_LOC` path maps to an existing Oracle Directory.

---

## Step 2 — Application Build (Appeon PB 2021)

**Estimated time:** 1–2 hours  
**Who:** Developer with Appeon PB 2021 and access to PBL workspace

### 2a. Open PBL Workspace

1. Open Appeon PowerBuilder 2021
2. File → Open Workspace → navigate to LCD workspace `.pbw` file
3. Confirm all PBLs are connected

### 2b. Apply All Code Changes

For each modified PBL, apply all code changes documented in `ORACLE_19C_MANUAL_IDE_INSTRUCTIONS.md`:

| PBL | Risk(s) Addressed |
|-----|-------------------|
| `TBLDIST.pbl` | RISK-01, RISK-02 |
| `TBLINTRF.pbl` | RISK-01, RISK-02 |
| `TBLCOST.pbl` | RISK-01, RISK-02 |
| `TIME.pbl` | RISK-01, RISK-02 |
| `LCD7.pbl` | RISK-02, RISK-03, RISK-04, RISK-06 (DBA done), RISK-07, NLS |
| `NEWS.pbl` | RISK-02, RISK-04 |
| `ACCT.pbl` | RISK-05 |
| `REPORTS.pbl` | RISK-02, RISK-05 |
| `TBLADMIN.pbl` | RISK-02, RISK-03, RISK-08 |
| `ADMIN.pbl` | RISK-09, RISK-10 (no code change) |
| `PAY.pbl` | RISK-03 |
| `DISTRIB7.pbl` | RISK-02 |
| `ADJUST.pbl` | RISK-08 |
| `FORMS.pbl` | RISK-08 |
| `SPECPAY1.pbl` | RISK-08 |
| `TBLASIGN.pbl` | RISK-02, RISK-08 |
| `TBLCMON.pbl` | RISK-02 |
| `TBLWO.pbl` | RISK-02 |
| `TBLWRKRS.pbl` | RISK-02 |
| `TABLES.pbl` | RISK-02 |
| `tblsap.pbl` | RISK-08 |

### 2c. Full Build

Design → Build All (or right-click workspace → Full Build)  
**Expected:** 0 errors. Warnings acceptable only if pre-existing.  
**Troubleshooting:** See Section 7 below.

### 2d. Generate Executable

Project → Deploy (or Tools → Deploy Application)  
Output: `LCD.EXE`  
Copy to staging area: `patched/build/LCD.EXE` (timestamp: `YYYYMMDD-HHMM`)

---

## Step 3 — Update INI File

On the application server, update `lcd.ini` (or distribute to workstations):

```ini
[Database]
; ... existing entries ...
; -- RdW 5/24/2026 Powerbuilder GUI-SS Oracle 19c Migration
; RISK-05/RISK-09: Added NLS_DATE_LANGUAGE to prevent NEXT_DAY() and date mask errors
NLS_DateLanguage=AMERICAN
```

**Troubleshooting:** If LCD.EXE connects but dates display incorrectly, confirm `NLS_DateLanguage` is spelled exactly as shown (case-sensitive in the PB Oracle driver). Verify with: `SELECT SYS_CONTEXT('USERENV','NLS_DATE_LANGUAGE') FROM DUAL;` in a test connection.

---

## Step 4 — Deploy to Environment

### DEV (D22)

1. Stop LCD.EXE on all DEV workstations
2. Back up existing `LCD.EXE` → `LCD_11g_backup_YYYYMMDD.EXE`
3. Copy `patched/build/LCD.EXE` to DEV app server share
4. Update `lcd.ini` with `NLS_DateLanguage=AMERICAN`
5. Run smoke tests (Section 5)

### QA (Q22)

Same as DEV. Additionally:
- Run DBA pre-deployment tasks (Step 1) against Q22 database
- Run full unit tests from `ORACLE_19C_TEST_PLAN.md` Phase 1 and Phase 2

### UAT (Q22S)

Same as QA. Additionally:
- Run end-to-end tests from `ORACLE_19C_TEST_PLAN.md` Phase 3
- Have at least one user from each org group (Default, FEDERAL, CANADA, 663, India) validate their workflows
- Obtain sign-off from application owner before promoting to PROD

### PRODUCTION

- Schedule maintenance window (recommend Saturday 02:00–06:00 local time)
- Notify all LCD users at least 5 business days in advance
- Execute Steps 1–3 during window
- Perform smoke tests (Section 5)
- Monitor Oracle alert log for first 2 business days post-deployment

---

## Step 5 — Smoke Tests (per environment)

Run immediately after deployment. Expected results listed.

| # | Test | Expected Result | Fail Action |
|---|------|----------------|-------------|
| 1 | Launch LCD.EXE → login dialog appears | w_login opens, db list populated | Check Oracle client, tnsnames.ora |
| 2 | Login as any valid user, default org (010) | w_hello splash, then w_main MDI frame | Check SQLCA.DBParm in lcd.ini |
| 3 | Administration → Set User Roles | d_user_roles_orgs DataWindow loads, roles visible | Verify RISK-06 grant is applied |
| 4 | Administration → Change Password | w_change_password opens, 14-char min enforced | Audit uo_trans RPCFUNC |
| 5 | Administration → Unlock User → enter a test user ID | Success/failure message shown (no ORA- error) | Check TRANS_LOG table access |
| 6 | NEWS module → open news list | News records load with dates | RISK-04 TO_DATE fix; check NLS |
| 7 | ACCT module → Accounting Interface screen | Screen loads, org date parameters accept input | RISK-05 NEXT_DAY |
| 8 | Any err-display DataWindow (e.g., d_att_wage_map_err) | No ORA-01799 error | RISK-01 fix incomplete |
| 9 | ADMIN → Copy Tables | DB link list populates | RISK-10 DB links recreated |
| 10 | Reports → Time Adjustments | Report criteria screen loads | RISK-09 date mask |

---

## Step 6 — Rollback Procedure

If critical issues are found post-deployment:

1. **Stop LCD.EXE** on all workstations immediately
2. **Restore old EXE:** Copy `LCD_11g_backup_YYYYMMDD.EXE` → `LCD.EXE` on app server
3. **Revert lcd.ini:** Remove `NLS_DateLanguage=AMERICAN` line
4. **Database rollback** (if DBA changes caused issues):
   - Revoke RISK-06 grant: `REVOKE SELECT ON SYS.DBA_ROLE_PRIVS FROM LCD;` (only if grant was just applied)
   - Restore previous DB links from DBA backup script
5. **Notify users** that rollback is complete; schedule re-deploy after root cause analysis
6. **Open incident ticket** with Oracle trace output, alert log entries, and full stack trace

---

## Step 7 — Build Troubleshooting

| Symptom | Likely Cause | Resolution |
|---------|-------------|------------|
| PB compiler error in DataWindow SQL | Invalid ANSI JOIN syntax entered in painter | Re-open DW in painter, verify SQL in Syntax Check mode |
| `ORA-01799` at runtime | RISK-01 fix not applied to a DataWindow | Run grep on patched/ for remaining `TRIM.*\(\+\)` |
| `ORA-01799` on `w_news_send` | RISK-02 `BETWEEN` with `(+)` | Fix `ORG_CODE(+) BETWEEN` per Phase 3 spec |
| `ORA-00942` on DUAL | SYS.DUAL not fixed in all files | Run grep for `SYS\.DUAL` in patched/ |
| `ORA-01846` on NEXT_DAY | RISK-05 fix missing OR NLS override not applied | Verify f_acct_int.srf + lcd.ini NLS entry |
| Login fails: `ORA-28000` | Account locked on 19c after incorrect pwd | DBA: `ALTER USER ... ACCOUNT UNLOCK` |
| Login fails: `ORA-28001` | Password expired — 19c default 180-day policy | DBA: set `PASSWORD_LIFE_TIME UNLIMITED` for LCD service accounts if needed |
| Password change fails | Server-side CHANGE_PASSWORD proc uses deprecated verify function | DBA audit + replace proc; see RISK-07 |
| DB link errors | Links not recreated post-migration | Run `risk10_dblink_recreation.sql` |
| File write errors in production | UTL_FILE path → Oracle Directory mismatch | Run `risk_utlfile_directory_mapping.sql`; verify NFS mount |
| Wrong date on ACCT output | NEXT_DAY arithmetic or NLS issue | Verify NLS_DateLanguage in lcd.ini and run `risk05_nextday_test.sql` |
