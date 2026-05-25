# LCD-Oracle Oracle 11g → 19c Migration — Simulated Change Log

**Author:** RdW  
**Date:** 5/24/2026  
**Task:** 42-3  
**Status:** Simulated (not yet applied to `tasks/42-3/patched/`)

This document records every planned code change for the Oracle 19c migration. Each entry describes what will differ between `originals/` (11g baseline from `LCD-Oracle/`) and `patched/` (19c-compatible copies). Seed implementations exist in `tasks/42/SQL/patched/` and `tasks/42-2/SQL/patched/`.

---

## Summary

| Category | Files | New lines (est.) | Removed lines (est.) |
|----------|-------|------------------|----------------------|
| Tier 0 — New scripts | 2 | ~120 | 0 |
| Tier 1 — Core I/O | 7 | ~180 | ~40 |
| Tier 2 — Direct FOPEN callers | 16 | ~240 | ~320 |
| Tier 3 — SAP group | 3 | ~45 | ~10 |
| Tier 4 — WOA scheduler | 2 | ~60 | ~20 |
| Tier 5 — Deprecation | 2 | ~20 | 0 |
| **Total** | **32** | **~665** | **~390** |

---

## Tier 0 — New Files (no originals)

### 1. `patched/SQL/F_GET_19C_DIR_NAME.sql` [NEW]

**Seed:** `tasks/42/SQL/patched/SQL/F_GET_19C_DIR_NAME.sql`

**Simulated content:**
- New function `LCD.f_get_19c_dir_name(a_path IN VARCHAR2) RETURN VARCHAR2`
- Strips trailing `/` and `\` from input path
- Queries `ALL_DIRECTORIES` with `UPPER(directory_path) = UPPER(l_path_clean)`
- Returns `directory_name` or NULL on `NO_DATA_FOUND`
- Debug: `DBMS_OUTPUT.PUT_LINE('-- DEBUG [RdW 19c] f_get_19c_dir_name a_path=...')`

**Example:**
```sql
SELECT lcd.f_get_19c_dir_name('/csclcdnc0002/Q22S/In') FROM dual;
-- Before (11g): N/A — function did not exist
-- After  (19c): LCD_IN
```

---

### 2. `patched/SQL/GRANT_DIRECTORY_ACCESS.sql` [NEW]

**Seed:** `tasks/42/SQL/patched/SQL/GRANT_DIRECTORY_ACCESS.sql`

**Simulated content:**
- DBA script (run as SYS)
- `GRANT READ, WRITE ON DIRECTORY LCD_IN TO LCD;` (and all UAT dirs from `DB_DIRECTORIES.txt`)
- Covers: `LCD`, `LCD_IN`, `LCD_OUT`, `LCD_ARCH*`, `LCD_149*`, `LCD_285*`, `LCD_663*`, `LCD_FEDERAL*`, `LCD_CANADA*`
- Comment block noting regional dirs (UK, Nordic, etc.) must be added when DBA creates them

---

## Tier 1 — Core Resolver and I/O Wrappers

### 3. `patched/SQL/F_GET_LCD_OS_FILENAME.sql`

**Original:** `LCD-Oracle/SQL/F_GET_LCD_OS_FILENAME.sql`  
**Seed:** `tasks/42/SQL/patched/SQL/F_GET_LCD_OS_FILENAME.sql`

| Change | Detail |
|--------|--------|
| Header comment | Add flowerbox documenting return-value semantic change (path → DIRECTORY name) |
| New variable | `l_dir_name_19c VARCHAR2(128)` |
| Post-loop logic | After CONNECT BY `LCD_FILE_PARAM` loop, call `lcd.f_get_19c_dir_name(fopenpath)` |
| Return value | Return `l_dir_name_19c` if NOT NULL; else fallback to `fopenpath` (diagnostic) |
| Debug output | `DBMS_OUTPUT.PUT_LINE('-- DEBUG [RdW 19c] f_get_lcd_os_filename l_dir_name_19c=...')` |
| Retained | Original path-construction and `LCD_FILE_PARAM` loop (for rollback reference) |

**Before → After:**
```sql
-- BEFORE (11g): returns '/csclcdnc0002/Q22S/In'
RETURN fopenpath;

-- AFTER (19c): returns 'LCD_IN'
l_dir_name_19c := lcd.f_get_19c_dir_name(fopenpath);
IF l_dir_name_19c IS NOT NULL THEN RETURN l_dir_name_19c; END IF;
RETURN fopenpath;
```

---

### 4. `patched/SQL/F_CHECK_LCD_OS_FILENAME.sql`

**Original:** `LCD-Oracle/SQL/F_CHECK_LCD_OS_FILENAME.sql`  
**Seed:** `tasks/42/SQL/patched/SQL/F_CHECK_LCD_OS_FILENAME.sql`

| Change | Detail |
|--------|--------|
| Validation logic | Replace `LCD_FILE_PARAM` CONNECT BY match with `lcd.f_get_19c_dir_name(filenamepath) IS NOT NULL` |
| Return TRUE | When DIRECTORY object exists in `ALL_DIRECTORIES` |
| Return FALSE | When resolver returns NULL |
| Debug output | Log `filenamepath`, resolved `l_dir_name_19c`, result |
| Retained | Original loop commented out |

---

### 5. `patched/SQL/FILEEXST.SQL`

**Original:** `LCD-Oracle/SQL/FILEEXST.SQL`  
**Seed:** `tasks/42/SQL/patched/SQL/FILEEXST.SQL`

| Change | Detail |
|--------|--------|
| New variable | `l_dir_name_19c VARCHAR2(128)` |
| Pre-FOPEN | `l_dir_name_19c := lcd.f_get_19c_dir_name(l_dir_name)` |
| Early exit | Return `-3` if `l_dir_name_19c IS NULL` (directory not found) |
| FOPEN arg | `UTL_FILE.FOPEN(l_dir_name_19c, p_file_name, 'R')` instead of path |
| Debug output | Log path, dir name, file name |

---

### 6. `patched/SQL/FILECOPY.SQL`

**Original:** `LCD-Oracle/SQL/FILECOPY.SQL`  
**Seed:** `tasks/42/SQL/patched/SQL/FILECOPY.SQL`

| Change | Detail |
|--------|--------|
| Bug fix | Restore missing `UTL_FILE.FOPEN` call (omitted in 2023 Unix migration) |
| New variable | `l_dir_name_19c VARCHAR2(128)` in `f_open_out_file` |
| Pre-FOPEN | `l_dir_name_19c := lcd.f_get_19c_dir_name(l_dir_name)` |
| FOPEN | `p_file_handle := UTL_FILE.FOPEN(l_dir_name_19c, RTRIM(p_out_file_name), 'w')` |
| Debug output | Log `filenamepath`, `l_dir_name`, `l_dir_name_19c` |

---

### 7. `patched/SQL/GETFILE.SQL`

**Original:** `LCD-Oracle/SQL/GETFILE.SQL`  
**Seed:** `tasks/42/SQL/patched/SQL/GETFILE.SQL`

| Change | Detail |
|--------|--------|
| `f_open_in_file` | Add `l_dir_name_19c` resolution before FOPEN |
| FOPEN arg | Use DIRECTORY name from `f_get_19c_dir_name()` |
| Debug output | Log org, path, directory object name |

---

### 8. `patched/SQL/SHRD_BDY.SQL`

**Original:** `LCD-Oracle/SQL/SHRD_BDY.SQL`  
**Seed:** `tasks/42-2/SQL/patched/SHRD_BDY.SQL`

| Change | Detail |
|--------|--------|
| `f_open_in_file` (3-param) | Add comment + `DBMS_OUTPUT.PUT_LINE('19c_DEBUG shared.f_open_in_file: org=... directory_name=...')` after resolver call |
| `f_open_in_file` (4-param) | Same debug pattern |
| `f_open_out_file` | Add debug output for `l_dir_name` (resolver already called) |
| `f_open_append_file` | Add debug output for `l_dir_name` |
| Logic change | Minimal — inherits fix from `f_get_lcd_os_filename` returning dir name |
| Error message | Update INVALID_PATH message text to reference DIRECTORY objects |

---

### 9. `patched/SQL/BATCH.SQL`

**Original:** `LCD-Oracle/SQL/BATCH.SQL`  
**Seed:** `tasks/42-2/SQL/patched/BATCH.SQL`

| Change | Detail |
|--------|--------|
| `FileInfoPermission` | Replace raw `lcd_server_loc` FOPEN with `f_get_lcd_os_filename(p_org_code, NULL, 'IN', FALSE)` |
| `fExists` / `FGetAttr` | Resolve path to dir name via `f_get_19c_dir_name()` before `UTL_FILE.FGetAttr` |
| `ServerFileCopy` | `FCOPY`/`FRENAME` src/dest locations use dir names not paths |
| `ServerFileMove` | `FREMOVE` location uses dir name |
| Debug output | `19c_DEBUG FileInfoPermission: org=... directory_name=...` at each resolution point |

---

## Tier 2 — Direct FOPEN Callers

Pattern for files 10–25: remove inline `SELECT ... FROM lcd_file_param WHERE type = 'UTL_FILE_DIR_PATHS'` CONNECT BY loop; replace FOPEN first argument with `lcd.f_get_19c_dir_name(resolved_path)` or call through `f_get_lcd_os_filename()`.

### 10. `patched/SQL/TIMEDB2.SQL` [VERIFY ONLY]

**Original:** `LCD-Oracle/SQL/TIMEDB2.SQL`  
**Seed:** `tasks/42-2/SQL/patched/TIMEDB2.SQL`

| Change | Detail |
|--------|--------|
| Existing | Already calls `f_get_lcd_os_filename()` before FOPEN |
| Simulated | Add debug output only; no logic change if Tier 1 #3 deployed |

---

### 11. `patched/SQL/UNAPPROVED_HOURS.sql`

**Original:** `LCD-Oracle/SQL/UNAPPROVED_HOURS.sql`  
**Seed:** `tasks/42-2/SQL/patched/UNAPPROVED_HOURS.sql`

| Change | Detail |
|--------|--------|
| Remove | `LCD_FILE_PARAM` CONNECT BY loop (~15 lines × 2 call sites) |
| Add | `l_dir_name := lcd.f_get_19c_dir_name(svr_path)` before each FOPEN |
| FOPEN (×2) | File 1 (UNAPPROVED_TIME) and File 2 (LATE TIME APPROVALS) |
| Debug | Log `svr_path`, `l_dir_name` for each file open |

---

### 12. `patched/SQL/Alt_Work_Order_Extract.sql`

**Original:** `LCD-Oracle/SQL/Alt_Work_Order_Extract.sql`  
**Seed:** `tasks/42/SQL/patched/SQL/Alt_Work_Order_Extract.sql`

| Change | Detail |
|--------|--------|
| `FOpenOutputFile` | Replace FOPEN path arg with `lcd.f_get_19c_dir_name(pOF_dir)` |
| Main block | Retain path construction; remove `LCD_FILE_PARAM` loop |
| Debug | Log `pOF_dir`, resolved directory name |

---

### 13. `patched/SQL/Work_Order_Extract.sql`

**Original:** `LCD-Oracle/SQL/Work_Order_Extract.sql`  
**Seed:** `tasks/42/SQL/patched/SQL/Work_Order_Extract.sql`

| Change | Detail |
|--------|--------|
| `FOpenOutputFile` | `UTL_FILE.FOPEN(lcd.f_get_19c_dir_name(pOF_dir), pOF_file, 'w')` |
| Main block | Remove `LCD_FILE_PARAM` CONNECT BY loop |
| Debug | Log `pOF_dir`, directory object name |

---

### 14. `patched/SQL/BeelineBusinessAreas.sql`

**Original:** `LCD-Oracle/SQL/BeelineBusinessAreas.sql`  
**Seed:** `tasks/42/SQL/patched/SQL/BeelineBusinessAreas.sql`

| Change | Detail |
|--------|--------|
| Remove | `LCD_FILE_PARAM` loop |
| FOPEN | `utl_file.fopen(lcd.f_get_19c_dir_name(svr_path), file_name, 'w')` |
| Debug | Log `svr_path`, directory name |

---

### 15. `patched/SQL/BeelineDepartments.sql`

**Original:** `LCD-Oracle/SQL/BeelineDepartments.sql`  
**Seed:** `tasks/42/SQL/patched/SQL/BeelineDepartments.sql`

| Change | Detail |
|--------|--------|
| Same pattern | As BeelineBusinessAreas |

---

### 16. `patched/SQL/ALL_DEPARTMENTS_BEELINE-proc.sql`

**Original:** `LCD-Oracle/SQL/ALL_DEPARTMENTS_BEELINE-proc.sql`  
**Seed:** `tasks/42-2/SQL/patched/ALL_DEPARTMENTS_BEELINE-proc.sql`

| Change | Detail |
|--------|--------|
| FOPEN (×2) | Resolve `svr_path` via `f_get_19c_dir_name()` at both call sites |
| Remove | Inline path validation loop |
| Debug | Log org, path, directory name per FOPEN |

---

### 17. `patched/SQL/NAUSD_SUBCON_FEED-proc.sql`

**Original:** `LCD-Oracle/SQL/NAUSD_SUBCON_FEED-proc.sql`  
**Seed:** `tasks/42/SQL/patched/SQL/NAUSD_SUBCON_FEED-proc.sql`

| Change | Detail |
|--------|--------|
| Remove | `LCD_FILE_PARAM` loop |
| Remove | Legacy `\OUT` suffix on `svr_path` (Windows artifact — path already includes OUT) |
| FOPEN | Use `f_get_19c_dir_name(svr_path)` |
| Debug | Log `svr_path`, directory name |

---

### 18. `patched/SQL/USR11_SUBCON_FEED-proc.sql`

**Original:** `LCD-Oracle/SQL/USR11_SUBCON_FEED-proc.sql`  
**Seed:** `tasks/42/SQL/patched/SQL/USR11_SUBCON_FEED-proc.sql`

| Change | Detail |
|--------|--------|
| Same pattern | As NAUSD_SUBCON_FEED |
| Security note | Comment: feed outputs unmasked SSN; restrict OS permissions on OUT dir |

---

### 19. `patched/SQL/sa_notime.sql`

**Original:** `LCD-Oracle/SQL/sa_notime.sql`  
**Seed:** `tasks/42-2/SQL/patched/sa_notime.sql`

| Change | Detail |
|--------|--------|
| Path resolution | Replace own path construction + validation with resolver |
| FOPEN | Use directory name |
| Debug | Log org, lcd_server_loc, directory name |

---

### 20. `patched/SQL/SUBCO_NOTIME_TERM.sql`

**Original:** `LCD-Oracle/SQL/SUBCO_NOTIME_TERM.sql`  
**Seed:** `tasks/42-2/SQL/patched/SUBCO_NOTIME_TERM.sql`

| Change | Detail |
|--------|--------|
| Remove | `LCD_FILE_PARAM` loop |
| FOPEN | Use `f_get_19c_dir_name()` on constructed path |
| Debug | Log path variables |

---

### 21. `patched/SQL/LCD_USER_AUDIT-proc.sql`

**Original:** `LCD-Oracle/SQL/LCD_USER_AUDIT-proc.sql`  
**Seed:** `tasks/42-2/SQL/patched/LCD_USER_AUDIT-proc.sql`

| Change | Detail |
|--------|--------|
| Remove | `LCD_FILE_PARAM` loop |
| FOPEN | Use directory name from resolver |
| Debug | Log svr_path, directory name |

---

### 22. `patched/SQL/NPS_Department_Select.sql`

**Original:** `LCD-Oracle/SQL/NPS_Department_Select.sql`  
**Seed:** `tasks/42-2/SQL/patched/NPS_Department_Select.sql`

| Change | Detail |
|--------|--------|
| Path resolution | Replace own path logic with `f_get_19c_dir_name()` |
| FOPEN | Use directory name |
| Debug | Log org, path, directory name |

---

### 23. `patched/SQL/TimeSheetExtractLCD.sql`

**Original:** `LCD-Oracle/SQL/TimeSheetExtractLCD.sql`  
**Seed:** `tasks/42/SQL/patched/SQL/TimeSheetExtractLCD.sql`

| Change | Detail |
|--------|--------|
| Remove | `LCD_FILE_PARAM` loop |
| FOPEN | `UTL_FILE.FOPEN(lcd.f_get_19c_dir_name(l_FileDir), ...)` |
| Debug | Log `l_FileDir`, directory name |

---

### 24. `patched/SQL/WEEKLY_NPS_EXTRACT-proc.sql`

**Original:** `LCD-Oracle/SQL/WEEKLY_NPS_EXTRACT-proc.sql`  
**Seed:** `tasks/42-2/SQL/patched/WEEKLY_NPS_EXTRACT-proc.sql`

| Change | Detail |
|--------|--------|
| Remove | `LCD_FILE_PARAM` loop |
| FOPEN | Use directory name |
| Debug | Log path, directory name |

---

### 25. `patched/SQL/Tes_Reports.bdy`

**Original:** `LCD-Oracle/SQL/Tes_Reports.bdy`  
**Seed:** `tasks/42-2/SQL/patched/Tes_Reports.bdy`

| Change | Detail |
|--------|--------|
| FOPEN (×3) | Replace raw `g_org_param_data.lcd_server_loc` path with `f_get_lcd_os_filename(org, NULL, 'OUT', FALSE)` |
| Locations | Worker export, department export, activity export file opens |
| Debug | Log org, lcd_server_loc, directory name at each FOPEN |

---

## Tier 3 — SAP Atomic Group

### 26. `patched/SQL/Sap_Data_Load.prc`

**Original:** `LCD-Oracle/SQL/Sap_Data_Load.prc`  
**Seed:** `tasks/42/SQL/patched/SQL/Sap_Data_Load.prc`

| Change | Detail |
|--------|--------|
| Header comment | **BREAKING:** `p_dir` now accepts DIRECTORY object name, not filesystem path |
| Entry debug | `DBMS_OUTPUT.PUT_LINE('-- DEBUG [RdW 19c] Sap_Data_Load p_org=... p_dir=... p_file=...')` |
| FOPEN | Expects `p_dir` = `'LCD_IN'` etc. (caller responsibility) |

---

### 27. `patched/SQL/Sap_Submit_Data_Load.prc`

**Original:** `LCD-Oracle/SQL/Sap_Submit_Data_Load.prc`  
**Seed:** `tasks/42/SQL/patched/SQL/Sap_Submit_Data_Load.prc`

| Change | Detail |
|--------|--------|
| `FRetrieveSystemParams` | `pRSPDir := f_get_lcd_os_filename(...)` now yields DIRECTORY name |
| Comment | Document calling convention change |
| Debug | Log org, pRSPDir value |

---

### 28. `patched/SQL/Sap_Auto_Load.prc`

**Original:** `LCD-Oracle/SQL/Sap_Auto_Load.prc`  
**Seed:** `tasks/42/SQL/patched/SQL/Sap_Auto_Load.prc`

| Change | Detail |
|--------|--------|
| Debug only | Log org and job name after `DBMS_SCHEDULER.CREATE_JOB` |
| No logic change | DBMS_SCHEDULER already in place (2011) |

---

## Tier 4 — WOA DBMS_JOB → DBMS_SCHEDULER

### 29. `patched/SQL (WOA)/Step3_LCDInterface_Refresh.sql`

**Original:** `LCD-Oracle/SQL (WOA)/Step3_LCDInterface_Refresh.sql`  
**Seed:** `tasks/42/SQL/patched/SQL(WOA)/Step3_LCDInterface_Refresh.sql`

| Change | Detail |
|--------|--------|
| Remove | `dbms_job.submit(job#, job_to_do, SYSDATE, l_interval, false)` |
| Add variable | `l_job_name VARCHAR2(128)` |
| Add | `DBMS_SCHEDULER.CREATE_JOB(job_name => 'WOAREFRESH_' \|\| org \|\| timestamp, job_type => 'PLSQL_BLOCK', job_action => 'BEGIN lcd.woaToLCD(...); END;', start_date => SYSTIMESTAMP, enabled => TRUE, auto_drop => TRUE)` |
| Debug | Log job name per org |
| Retained | `job# BINARY_INTEGER` commented as unused reference |

**Before → After:**
```sql
-- BEFORE:
dbms_job.submit(job#, job_to_do, SYSDATE, l_interval, false);

-- AFTER:
l_job_name := 'WOAREFRESH_' || rec.organizationid || '_' || TO_CHAR(SYSDATE,'YYYYMMDDHH24MISS');
DBMS_SCHEDULER.CREATE_JOB(job_name => l_job_name, job_type => 'PLSQL_BLOCK', ...);
```

---

### 30. `patched/SQL (WOA)/Step4_LCDInterface_ScheduleRefresh.sql`

**Original:** `LCD-Oracle/SQL (WOA)/Step4_LCDInterface_ScheduleRefresh.sql`  
**Seed:** `tasks/42/SQL/patched/SQL(WOA)/Step4_LCDInterface_ScheduleRefresh.sql`

| Change | Detail |
|--------|--------|
| Remove | `DBMS_JOB.SUBMIT` with 4-hour interval |
| Add | `DBMS_SCHEDULER.CREATE_JOB(repeat_interval => 'FREQ=HOURLY;INTERVAL=4')` |
| Replace | `DBMS_JOB.RUN(job#)` → `DBMS_SCHEDULER.RUN_JOB(l_job_name, use_current_session => FALSE)` |
| Debug | Log job name, schedule |

---

## Tier 5 — Deprecation Comments

### 31. `patched/SQL/LCD_FILE_PARAM_TABLE_DDL.sql`

| Change | Detail |
|--------|--------|
| Header comment | Deprecation notice: `UTL_FILE_DIR_PATHS` type no longer used in 19c; table retained for audit |

### 32. `patched/SQL/LCD_FILE_PARAM_P22_INSERT.sql`

| Change | Detail |
|--------|--------|
| Header comment | Deprecation notice: seed data for 11g only; do not deploy to 19c UAT |

---

## Files NOT Patched (inherit Tier 1 fixes)

These modules call `lcd.shared.f_open_in_file` / `f_open_out_file` and require **no direct edits** once Tier 1 + SHRD_BDY are deployed:

| Module group | Example files |
|--------------|---------------|
| Work order import | `wo_imps.sql`, `Wo_Imp.bdy` |
| Labor import | `lab_imps.sql`, `lab_impb.sql`, `LABINT.SQL` |
| CPI imports | `SQL (CPI)/CPGLImp.sql`, `cpi_cwf.sql`, `CPOrgImp.sql`, `CPvendor.sql` |
| UK interface | `SQL (UK-I)/LABINT_SSN_For_UK.SQL` |
| Wage/rate imports | `PRIWAGE_IMP.SQL`, `paywage_imp.sql`, `WrkrWageCtrl_imp.sql`, etc. |

---

## Files Explicitly Skipped

| File | Reason |
|------|--------|
| `10g_packages.sql` | Historical archive, not deployed |
| `Packages/*` | Historical patch bundles |
| `XFileCopy.sql`, `XFileMove.sql`, `XFileInfo.sql` | External C library calls, not UTL_FILE |
| `NPS_Departments_Job_Scheduler - FOR Q22.sql` | Obsolete one-off DBMS_JOB with hardcoded Windows path |
| `cmpllcd.sql`, compilation scripts | No 19c-specific changes |

---

## DBA Prerequisites (not code changes)

| Action | Detail |
|--------|--------|
| Create missing DIRECTORY objects | UK, Nordic, MidEast, LatAm, Italy, SAfrica paths from `LCD_FILE_PARAM` not in `DB_DIRECTORIES.txt` |
| Filesystem mount | Confirm `/csclcdnc0002/Q22S*` paths accessible from Oracle server |
| Org param data | `LCD_ORGPARAM_Q22S-19c-UPDATED.csv` column `LCD_SERVER_LOC` must match DIRECTORY paths |
| Grants | Run `GRANT_DIRECTORY_ACCESS.sql` before any patched script compile |

---

## Comment and Debug Convention (all files)

Every injection uses:
```sql
-- ===========================================================================
-- RdW 5/24/2026 Oracle 19c Migration - [description]
-- ===========================================================================
```

Debug lines (comment out before production):
```sql
DBMS_OUTPUT.PUT_LINE('-- DEBUG [RdW 19c] org=' || v_org ||
  ' lcd_server_loc=' || v_lcd_server_loc ||
  ' resolved_path=' || v_path ||
  ' directory_obj=' || v_dir_name);
```

---

## Seed Source Matrix

| File | Primary seed | Secondary seed |
|------|-------------|----------------|
| F_GET_19C_DIR_NAME.sql | tasks/42 | — |
| GRANT_DIRECTORY_ACCESS.sql | tasks/42 | — |
| F_GET_LCD_OS_FILENAME.sql | tasks/42 | — |
| F_CHECK_LCD_OS_FILENAME.sql | tasks/42 | — |
| FILEEXST, FILECOPY, GETFILE | tasks/42 | — |
| SHRD_BDY, BATCH | tasks/42-2 | — |
| Tier 2 (most) | tasks/42-2 | tasks/42 (extracts) |
| SAP group | tasks/42 | — |
| WOA Step3, Step4 | tasks/42 | — |
