# LCD-Oracle: Oracle 11g → 19c Migration Change Log

**Author:** RdW  
**Date:** 5/24/2026  
**Analysis basis:** Independent review of [LCD-Oracle/](../LCD-Oracle/) SQL source, [docs/sql-documentation/](../LCD-Oracle/docs/sql-documentation/), and UAT reference data in [uat/](uat/)  
**Status:** Planned changes (not yet applied)

---

## 1. Migration Problem Statement

Oracle 19c removed the `UTL_FILE_DIR` database initialization parameter. In Oracle 11g, LCD allowed `UTL_FILE.FOPEN`, `FGetAttr`, `FCOPY`, `FRENAME`, and `FREMOVE` to accept **filesystem path strings** (e.g. `/csclcdnc0002/Q22S/In`) when those paths appeared in either:

1. The `UTL_FILE_DIR` init parameter, or  
2. The table `LCD.LCD_FILE_PARAM` where `TYPE = 'UTL_FILE_DIR_PATHS'` (comma-separated allow-list)

Oracle 19c requires a **DIRECTORY object name** (e.g. `LCD_IN`) as the location argument. DIRECTORY objects are created by the DBA:

```sql
CREATE DIRECTORY LCD_IN AS '/csclcdnc0002/Q22S/In';
GRANT READ, WRITE ON DIRECTORY LCD_IN TO LCD;
```

### Current 11g data flow

```
ORG_PARAM.LCD_SERVER_LOC
        ↓
f_get_lcd_os_filename()  ← validates against LCD_FILE_PARAM (UTL_FILE_DIR_PATHS)
        ↓
filesystem path string
        ↓
UTL_FILE.FOPEN('/csclcdnc0002/Q22S/In', filename, mode)   ← fails in 19c
```

### Target 19c data flow

```
ORG_PARAM.LCD_SERVER_LOC
        ↓
f_get_lcd_os_filename()  ← builds path, resolves via ALL_DIRECTORIES
        ↓
DIRECTORY object name ('LCD_IN')
        ↓
UTL_FILE.FOPEN('LCD_IN', filename, mode)   ← works in 19c
```

### Secondary issue: DBMS_JOB

Two WOA interface scripts use `DBMS_JOB.SUBMIT`, which is deprecated in 19c. These must migrate to `DBMS_SCHEDULER`.

---

## 2. Analysis Method

The following scans were run against `LCD-Oracle/`:

| Pattern searched | Purpose |
|------------------|---------|
| `UTL_FILE.FOPEN`, `FGetAttr`, `FCOPY`, `FRENAME`, `FREMOVE` | Direct file-I/O call sites |
| `LCD_FILE_PARAM`, `UTL_FILE_DIR_PATHS` | Deprecated 11g path validation |
| `f_get_lcd_os_filename`, `f_check_lcd_os_filename` | Central path resolver |
| `DBMS_JOB`, `dbms_job` | Legacy job scheduling |
| `shared.f_open_in_file`, `shared.f_open_out_file` | Indirect callers via SHARED package |

**Deployable scope:** `LCD-Oracle/SQL/` and `LCD-Oracle/SQL (WOA)/` only.  
**Out of scope:** `LCD-Oracle/Packages/` (historical patch bundles), `10g_packages.sql` (archive), `XFileCopy.sql` / `XFileMove.sql` / `XFileInfo.sql` (external C library, not UTL_FILE).

---

## 3. UAT Reference Data

| File | Role |
|------|------|
| [uat/LCD_ORGPARAM_Q22S-19c-UPDATED.csv](uat/LCD_ORGPARAM_Q22S-19c-UPDATED.csv) | 297 orgs; `LCD_SERVER_LOC` column = base Linux path per org |
| [uat/LCD_FILE_PARAM-Q22S-11g-Copied.txt](uat/LCD_FILE_PARAM-Q22S-11g-Copied.txt) | Legacy 11g `UTL_FILE_DIR_PATHS` seed (54 paths under `/csclcdnc0002/Q22S*`) |
| [uat/DB_DIRECTORIES.txt](uat/DB_DIRECTORIES.txt) | DBA-created DIRECTORY object names mapped to filesystem paths (DEV, QA, UAT) |

### Org → DIRECTORY mapping (UAT Q22S)

| Org group | Example orgs | `LCD_SERVER_LOC` | IN directory | OUT directory |
|-----------|-------------|------------------|--------------|---------------|
| Default | 010, 580, 200 | `/csclcdnc0002/Q22S` | `LCD_IN` | `LCD_OUT` |
| Federal | 114 | `/csclcdnc0002/Q22S-FEDERAL` | `LCD_FEDERAL_IN` | `LCD_FEDERAL_OUT` |
| Canada | 574, 578 | `/csclcdnc0002/Q22S-CANADA` | `LCD_CANADA_IN` | `LCD_CANADA_OUT` |
| Org 663 | 670, 674 | `/csclcdnc0002/q22s-663` | `LCD_663_IN` | `LCD_663_OUT` |
| Org 149 | 149 | `/csclcdnc0002/Q22S-149` | `LCD_149_IN` | `LCD_149_OUT` |
| Org 285 | 285 area | `/csclcdnc0002/Q22S-285` | `LCD_285_IN` | `LCD_285_OUT` |
| UK | 455, 456, S23 | `/csclcdnc0002/Q22S-UK` | **Not in DB_DIRECTORIES.txt** | **Gap — DBA action required** |
| Nordic | N06–N17 | `/csclcdnc0002/Q22S-Nordic` | **Gap** | **Gap** |
| MidEast, LatAm, Italy, SAfrica | per CSV | per CSV | **Gap** | **Gap** |

**Note:** `DB_DIRECTORIES.txt` UAT section (lines 44–78) documents base, 149, 285, 663, FEDERAL, and CANADA only. Regional paths present in `LCD_FILE_PARAM` and `LCD_ORGPARAM` require DBA to create matching DIRECTORY objects before those orgs can be tested.

**Case sensitivity:** Path comparison must use `UPPER()` — org rows use mixed case (e.g. `/q22s-663` vs `/Q22S-663`).

---

## 4. Change Convention

All code injections preceded by:

```sql
-- ===========================================================================
-- RdW 5/24/2026 Oracle 19c Migration - [description of change]
-- ===========================================================================
```

Debug output (comment out before production):

```sql
DBMS_OUTPUT.PUT_LINE('-- DEBUG [RdW 19c] org=' || v_org ||
  ' lcd_server_loc=' || v_lcd_server_loc ||
  ' resolved_path=' || v_path ||
  ' directory_obj=' || v_dir_name);
```

---

## 5. File Inventory Summary

| Tier | Count | Action |
|------|-------|--------|
| A — New scripts | 2 | Create |
| B — Core resolver / I/O | 7 | Patch |
| C — Direct FOPEN callers | 16 | Patch |
| D — SAP group | 3 | Patch (atomic deploy) |
| E — WOA scheduler | 2 | Patch |
| F — Deprecation comments | 2 | Patch |
| G — Indirect (via SHARED) | ~24 | No patch — inherit Tier B |
| H — Skipped | — | See §12 |

**Total files to copy to `originals/` and patch in `patched/`: 32**

---

## 6. Tier A — New Scripts

### A-1. `patched/SQL/F_GET_19C_DIR_NAME.sql` [CREATE]

**Purpose:** Bridge function mapping a filesystem path to an Oracle DIRECTORY object name.

**Logic:**
1. Accept `a_path IN VARCHAR2`
2. Strip trailing `/` and `\`
3. Query `ALL_DIRECTORIES` where `UPPER(directory_path) = UPPER(l_path_clean)`
4. Return `directory_name` or NULL on `NO_DATA_FOUND`
5. Emit debug output for `a_path`, `l_path_clean`, resolved name

**Called by:** `f_get_lcd_os_filename`, `f_check_lcd_os_filename`, `f_file_exist`, inline FOPEN callers

---

### A-2. `patched/SQL/GRANT_DIRECTORY_ACCESS.sql` [CREATE]

**Purpose:** DBA script (run as SYS) granting `READ, WRITE` on all UAT DIRECTORY objects to schema `LCD`.

**Must include grants for:** All objects listed in `uat/DB_DIRECTORIES.txt` UAT section, plus any regional DIRECTORY objects the DBA creates for UK, Nordic, MidEast, LatAm, Italy, SAfrica.

---

## 7. Tier B — Core Resolver and I/O Wrappers

These files are on the **critical path**. ~24 import modules call `lcd.shared.f_open_in_file` / `f_open_out_file` and inherit fixes once Tier B is deployed.

---

### B-1. `LCD-Oracle/SQL/F_GET_LCD_OS_FILENAME.sql`

**11g behavior:** Builds path from `ORG_PARAM.LCD_SERVER_LOC` + stub + archive flag; validates against `LCD_FILE_PARAM` CONNECT BY loop; **returns filesystem path**.

**Required changes:**
| # | Change |
|---|--------|
| 1 | Add header comment documenting return-value semantic change |
| 2 | Add variable `l_dir_name_19c VARCHAR2(128)` |
| 3 | After existing path-construction loop, call `lcd.f_get_19c_dir_name(fopenpath)` |
| 4 | Return `l_dir_name_19c` when NOT NULL; else return `fopenpath` as diagnostic fallback |
| 5 | Add debug output for org, path, resolved directory name |
| 6 | Retain existing `LCD_FILE_PARAM` loop (commented) for rollback reference |

**Impact:** All callers of `f_get_lcd_os_filename` automatically receive DIRECTORY names once this function is recompiled — including `SHRD_BDY`, `BATCH.fExists`, `BATCH.ServerFileCopy`, `BATCH.ServerFileMove`, `BATCH.fArchiveFile`, `BATCH.FileInfoPermission`, `TIMEDB2`, `Sap_Submit_Data_Load`.

---

### B-2. `LCD-Oracle/SQL/F_CHECK_LCD_OS_FILENAME.sql`

**11g behavior:** Same path construction as B-1; returns TRUE if path found in `LCD_FILE_PARAM` allow-list.

**Required changes:**
| # | Change |
|---|--------|
| 1 | After path construction, call `lcd.f_get_19c_dir_name(fopenpath)` |
| 2 | Return TRUE when directory name resolved; FALSE when NULL |
| 3 | Comment out or retain `LCD_FILE_PARAM` loop for reference |
| 4 | Add debug output |

---

### B-3. `LCD-Oracle/SQL/FILEEXST.SQL` — function `lcd.f_file_exist`

**11g behavior:** Inline `LCD_FILE_PARAM` lookup; `UTL_FILE.FOPEN(l_dir_name, a_file_name, 'r')` where `l_dir_name` is full OUT path.

**Required changes:**
| # | Change |
|---|--------|
| 1 | Add `l_dir_name_19c VARCHAR2(128)` |
| 2 | After path resolution: `l_dir_name_19c := lcd.f_get_19c_dir_name(l_dir_name)` |
| 3 | Return `-3` early if `l_dir_name_19c IS NULL` |
| 4 | Change FOPEN to `UTL_FILE.FOPEN(l_dir_name_19c, a_file_name, 'r')` |
| 5 | Add debug output |

---

### B-4. `LCD-Oracle/SQL/FILECOPY.SQL` — package `lcd.CopyFile`

**11g behavior:** Inline `LCD_FILE_PARAM` lookup in `f_open_out_file`; **bug:** path is resolved into `l_dir_name` but `UTL_FILE.FOPEN` is never called — function returns TRUE without opening file (lines 117–123).

**Required changes:**
| # | Change |
|---|--------|
| 1 | Add `l_dir_name_19c VARCHAR2(128)` |
| 2 | Call `lcd.f_get_19c_dir_name(l_dir_name)` after path resolution |
| 3 | **Restore missing FOPEN:** `p_file_handle := UTL_FILE.FOPEN(l_dir_name_19c, RTRIM(p_out_file_name), 'w')` |
| 4 | Return FALSE if directory name unresolved |
| 5 | Add debug output |

---

### B-5. `LCD-Oracle/SQL/GETFILE.SQL` — package `lcd.GetFile`, function `f_open_in_file`

**11g behavior:** Inline `LCD_FILE_PARAM` CONNECT BY loop (lines 279–292); FOPEN with path at line 298.

**Required changes:**
| # | Change |
|---|--------|
| 1 | Replace inline loop with `l_dir_name := lcd.f_get_19c_dir_name(filenamepath)` OR call updated `f_get_lcd_os_filename` |
| 2 | FOPEN uses directory name not path |
| 3 | Add debug output |

---

### B-6. `LCD-Oracle/SQL/SHRD_BDY.SQL` — package body `lcd.shared`

**11g behavior:** `f_open_in_file`, `f_open_out_file` call `lcd.f_get_lcd_os_filename(p_org_code, NULL, stub, archiveflag)` then pass result to FOPEN (lines 465–466, 562–563, 645–646).

**Required changes:**
| # | Change |
|---|--------|
| 1 | Minimal logic change — inherits B-1 semantic change automatically |
| 2 | Add debug output after resolver call in `f_open_in_file` (3-param and 4-param), `f_open_out_file` |
| 3 | Update `UTL_FILE.INVALID_PATH` error message to reference DIRECTORY objects not UTL_FILE_DIR |

**Downstream benefit:** ~24 import modules (`lab_imps.sql`, `wo_imps.sql`, `LABINT.SQL`, `LD_CWF.SQL`, wage imports, etc.) require **no direct patch**.

---

### B-7. `LCD-Oracle/SQL/BATCH.SQL`

**11g behavior:** Already calls `f_get_lcd_os_filename` in `fExists`, `fArchiveFile`, `ServerFileCopy`, `ServerFileMove`, `FileInfoPermission` — but receives path strings back.

**Required changes:**
| # | Change |
|---|--------|
| 1 | Minimal logic change — inherits B-1 automatically for `fExists`, `FGetAttr`, `FCOPY`, `FRENAME`, `FREMOVE` |
| 2 | Add debug output at each resolver call site |
| 3 | Verify `fArchiveFile` archive path resolution: currently calls `f_get_lcd_os_filename(null, P_DIR_NAME, null, TRUE)` — confirm archive DIRECTORY names (`LCD_ARCH_IN`, etc.) exist in `ALL_DIRECTORIES` |

---

## 8. Tier C — Direct FOPEN Callers

These files contain their own path construction and/or `LCD_FILE_PARAM` loops and do **not** fully delegate to the central resolver.

**Common patch pattern:**
1. Remove `SELECT value INTO utlfpaths FROM lcd.lcd_file_param WHERE type = 'UTL_FILE_DIR_PATHS'` CONNECT BY loop
2. Build filesystem path from `ORG_PARAM.LCD_SERVER_LOC` + stub (retain existing logic)
3. Resolve: `v_dir_name := lcd.f_get_19c_dir_name(v_path)` OR use updated `f_get_lcd_os_filename(org, NULL, stub, archiveflag)`
4. Pass `v_dir_name` to FOPEN / FGetAttr / FCOPY / FRENAME / FREMOVE
5. Add debug output

---

### C-1. `LCD-Oracle/SQL/TIMEDB2.SQL`

**Location:** Line 738–739 — already uses `f_get_lcd_os_filename` before FOPEN.

**Required changes:** Verify only; add debug output. No logic change if B-1 deployed.

---

### C-2. `LCD-Oracle/SQL/UNAPPROVED_HOURS.sql`

**Location:** Lines 307–335, 390 — `LCD_FILE_PARAM` loop; 2× FOPEN for output files.

**Required changes:**
| # | Change |
|---|--------|
| 1 | Remove CONNECT BY loop |
| 2 | Resolve `svr_path` to directory name before each FOPEN |
| 3 | Debug output for both file handles |

---

### C-3. `LCD-Oracle/SQL/Alt_Work_Order_Extract.sql`

**Location:** `FOpenOutputFile` function (line 135); main block `LCD_FILE_PARAM` loop (line 335).

**Required changes:**
| # | Change |
|---|--------|
| 1 | `FOpenOutputFile`: `UTL_FILE.FOPEN(lcd.f_get_19c_dir_name(pOF_dir), pOF_file, 'w')` |
| 2 | Remove main-block `LCD_FILE_PARAM` loop |
| 3 | Debug output |

---

### C-4. `LCD-Oracle/SQL/Work_Order_Extract.sql`

**Same pattern as C-3.**

---

### C-5. `LCD-Oracle/SQL/BeelineBusinessAreas.sql`

**Location:** `LCD_FILE_PARAM` loop; single FOPEN.

**Required changes:** Remove loop; FOPEN via resolver; debug output.

---

### C-6. `LCD-Oracle/SQL/BeelineDepartments.sql`

**Same pattern as C-5.**

---

### C-7. `LCD-Oracle/SQL/ALL_DEPARTMENTS_BEELINE-proc.sql`

**Location:** Line 60 — `UTL_FILE.FOPEN(svr_path||'/Out', file_out, 'w')` where `svr_path` is passed as procedure parameter (base path).

**Required changes:**
| # | Change |
|---|--------|
| 1 | Replace `svr_path||'/Out'` with `lcd.f_get_19c_dir_name(svr_path || '/Out')` OR accept org code and call `f_get_lcd_os_filename` |
| 2 | Line 105: `LCD.ServerFileCopy` passes `svr_path` — verify ServerFileCopy handles DIRECTORY names after B-7 |
| 3 | Debug output |

---

### C-8. `LCD-Oracle/SQL/NAUSD_SUBCON_FEED-proc.sql`

**Location:** Lines 145–166 — `LCD_FILE_PARAM` loop; FOPEN at line 166 uses **`svr_path||'\OUT'`** (Windows backslash artifact on Linux path).

**Required changes:**
| # | Change |
|---|--------|
| 1 | Remove `LCD_FILE_PARAM` loop |
| 2 | Remove `\OUT` suffix — `svr_path` already contains full OUT path from line 133 |
| 3 | FOPEN: `utl_file.fopen(lcd.f_get_19c_dir_name(svr_path), file_out, 'w')` |
| 4 | Debug output |

---

### C-9. `LCD-Oracle/SQL/USR11_SUBCON_FEED-proc.sql`

**Same pattern as C-8.** Security note: outputs unmasked `WORKER_SSN` — restrict OS-level permissions on OUT directory.

---

### C-10. `LCD-Oracle/SQL/sa_notime.sql`

**Location:** `fOpenNoTimeOutputFile` (line 53) — `UTL_FILE.FOPEN(pOF_dir, pOF_file, 'w')` where `p_dir` is a **job submit parameter**.

**Required changes:**
| # | Change |
|---|--------|
| 1 | Resolve `pOF_dir` via `lcd.f_get_19c_dir_name(pOF_dir)` before FOPEN |
| 2 | Update procedure header comment: `p_dir` must be DIRECTORY name or resolvable path |
| 3 | **Deployment note:** Any `DBMS_SCHEDULER` / job definition calling `sa_notime` must pass DIRECTORY name not Windows path |
| 4 | Debug output |

---

### C-11. `LCD-Oracle/SQL/SUBCO_NOTIME_TERM.sql`

**Location:** Lines 347–410 — `LCD_FILE_PARAM` loop; FOPEN at line 410.

**Required changes:** Remove loop; resolve `svr_path`; debug output.

---

### C-12. `LCD-Oracle/SQL/LCD_USER_AUDIT-proc.sql`

**Location:** Lines 84–107 — `LCD_FILE_PARAM` loop; FOPEN at line 107.

**Required changes:** Remove loop; resolve path; debug output.

---

### C-13. `LCD-Oracle/SQL/NPS_Department_Select.sql`

**Location:** Lines 60–68 — uses **`LCD_SERVER_LOC || '\OUT'`** (Windows path on Linux); FOPEN at line 68.  
**Note:** File contains procedure `weekly_nps_extract` (duplicate of C-14 pattern).

**Required changes:**
| # | Change |
|---|--------|
| 1 | Replace `\OUT` concatenation with `f_get_lcd_os_filename(org, NULL, 'OUT', FALSE)` |
| 2 | FOPEN with directory name |
| 3 | Debug output |

---

### C-14. `LCD-Oracle/SQL/WEEKLY_NPS_EXTRACT-proc.sql`

**Location:** Lines 86–109 — `LCD_FILE_PARAM` loop; FOPEN at line 109.

**Required changes:** Same as C-12 pattern.

---

### C-15. `LCD-Oracle/SQL/TimeSheetExtractLCD.sql`

**Location:** `LCD_FILE_PARAM` loop; FOPEN with `l_FileDir`.

**Required changes:** Remove loop; `lcd.f_get_19c_dir_name(l_FileDir)` before FOPEN; debug output.

---

### C-16. `LCD-Oracle/SQL/Tes_Reports.bdy` — package body `lcd.tes_reports`

**Most complex file in scope.** Multiple FOPEN call sites using raw path manipulation on `g_org_param_data.lcd_server_loc`.

| Function / location | 11g behavior | Required change |
|---------------------|-------------|-----------------|
| `ADD_SERVER_SUBDIR` (line 165) | Appends `OUT/` to base `lcd_server_loc` path | Replace with call to `f_get_lcd_os_filename(org, NULL, 'OUT', FALSE)` at FOPEN sites instead |
| `OPEN_OUTPUT_FILE` (line 344) | `UTL_FILE.FOPEN(substr(p_dir_name,1,length-1), ...)` | Resolve `p_dir_name` via `f_get_19c_dir_name`; pass directory name to FOPEN |
| `OPEN_WIN_OUTPUT_FILE` (line 442) | Same substr trick on path with trailing slash | Same fix as OPEN_OUTPUT_FILE |
| Line 733 | Direct FOPEN on `g_org_param_data.lcd_server_loc` | Use `f_get_lcd_os_filename` for org's OUT directory |
| ~10 callers of `open_win_output_file` (lines 850–1686) | Pass `g_org_param_data.lcd_server_loc` (base path) | Change to pass org code and resolve inside `OPEN_WIN_OUTPUT_FILE`, OR pre-resolve before call |

**Required changes summary:**
1. Refactor `OPEN_WIN_OUTPUT_FILE` and `OPEN_OUTPUT_FILE` to accept org code OR resolve path parameter through `f_get_19c_dir_name`
2. Remove `substr(p_dir_name, 1, length-1)` path hack — not valid for DIRECTORY names
3. Update all ~10 call sites to use resolver
4. Debug output at each FOPEN

---

## 9. Tier D — SAP Atomic Group

Deploy all three together in a single maintenance window.

---

### D-1. `LCD-Oracle/SQL/Sap_Data_Load.prc`

**Location:** `FOpenInputFile` (line 396) — `UTL_FILE.FOPEN(pOFDir, pOFFile, 'r')`; called from main at line 1984 with `p_dir` parameter.

**Required changes:**
| # | Change |
|---|--------|
| 1 | **Breaking change:** Document that `p_dir` parameter must be DIRECTORY object name, not filesystem path |
| 2 | Add entry debug: log `p_org`, `p_dir`, `p_file` |
| 3 | Optionally validate `p_dir` exists in `ALL_DIRECTORIES` before FOPEN |

---

### D-2. `LCD-Oracle/SQL/Sap_Submit_Data_Load.prc`

**Location:** Line 51 — `pRSPDir := lcd.f_get_lcd_os_filename(trim(p_org), null, 'IN', FALSE)`.

**Required changes:**
| # | Change |
|---|--------|
| 1 | Inherits B-1 automatically — `pRSPDir` becomes DIRECTORY name |
| 2 | Update comment documenting calling convention |
| 3 | Debug output for org and resolved dir name |

---

### D-3. `LCD-Oracle/SQL/Sap_Auto_Load.prc`

**11g behavior:** Already uses `DBMS_SCHEDULER.CREATE_JOB` (line 58).

**Required changes:** Add debug output for org and job name after job creation. No scheduling logic change.

---

## 10. Tier E — WOA DBMS_JOB → DBMS_SCHEDULER

---

### E-1. `LCD-Oracle/SQL (WOA)/Step3_LCDInterface_Refresh.sql`

**Location:** Line 62 — `dbms_job.submit(job#, job_to_do, SYSDATE, l_interval, false)` inside org cursor loop.

**Required changes:**
| # | Change |
|---|--------|
| 1 | Add `l_job_name VARCHAR2(128)` |
| 2 | Replace with `DBMS_SCHEDULER.CREATE_JOB(job_name => 'WOAREFRESH_' \|\| org \|\| timestamp, job_type => 'PLSQL_BLOCK', job_action => 'BEGIN lcd.woaToLCD(...); END;', start_date => SYSTIMESTAMP, enabled => TRUE, auto_drop => TRUE)` |
| 3 | Retain `job# BINARY_INTEGER` as commented reference |
| 4 | Debug output per org |

**Before → After:**
```sql
-- BEFORE:
dbms_job.submit(job#, job_to_do, SYSDATE, l_interval, false);

-- AFTER:
l_job_name := 'WOAREFRESH_' || rec.organizationid || '_' ||
              TO_CHAR(SYSDATE, 'YYYYMMDDHH24MISS');
DBMS_SCHEDULER.CREATE_JOB(
    job_name   => l_job_name,
    job_type   => 'PLSQL_BLOCK',
    job_action => 'BEGIN ' || job_to_do || ' END;',
    start_date => SYSTIMESTAMP,
    enabled    => TRUE,
    auto_drop  => TRUE);
```

---

### E-2. `LCD-Oracle/SQL (WOA)/Step4_LCDInterface_ScheduleRefresh.sql`

**Location:** Lines 11, 17 — `dbms_job.submit` with 4-hour interval; `dbms_job.run(job#)`.

**Required changes:**
| # | Change |
|---|--------|
| 1 | Replace with `DBMS_SCHEDULER.CREATE_JOB(repeat_interval => 'FREQ=HOURLY;INTERVAL=4', ...)` |
| 2 | Replace `DBMS_JOB.RUN` with `DBMS_SCHEDULER.RUN_JOB(l_job_name, use_current_session => FALSE)` |
| 3 | Use named job: e.g. `LCD_WOA_REFRESH_SCHED` |
| 4 | Debug output |

---

## 11. Tier F — Deprecation Comments

---

### F-1. `LCD-Oracle/SQL/LCD_FILE_PARAM_TABLE_DDL.sql`

Add header comment: table retained for audit; `UTL_FILE_DIR_PATHS` type deprecated in Oracle 19c; path validation now via `ALL_DIRECTORIES`.

---

### F-2. `LCD-Oracle/SQL/LCD_FILE_PARAM_P22_INSERT.sql`

Add header comment: 11g seed data only; do not deploy `UTL_FILE_DIR_PATHS` insert to 19c UAT; DIRECTORY objects replace this mechanism.

---

## 12. Files Explicitly Not Patched

| File / group | Reason |
|--------------|--------|
| `wo_imps.sql`, `lab_imps.sql`, `lab_impb.sql`, `LABINT.SQL`, `LD_CWF.SQL`, `LD_PRMSN.SQL`, `INT800.SQL`, `DLTKINTR.SQL`, `CP100LAB.SQL`, wage/rate imports, `AddPayImp.sql`, etc. | Call `lcd.shared.f_open_in_file` / `f_open_out_file` — inherit Tier B-6 |
| `SQL (CPI)/*` | Same — delegate to SHARED package |
| `SQL (UK-I)/LABINT_SSN_For_UK.SQL` | Calls `LCD.shared.f_open_out_file` (line 392) |
| `10g_packages.sql` | Historical monolithic archive |
| `LCD-Oracle/Packages/*` | Historical patch bundles, not deployed |
| `XFileCopy.sql`, `XFileMove.sql`, `XFileInfo.sql` | External C library via `LCDEXECUTOR_LIB`, not UTL_FILE |
| `cmpllcd.sql`, `LCDBCMPL.SQL`, `LCD_CMPL.SQL` | Compilation orchestrators — no 19c logic change |
| `NPS_Departments_Job_Scheduler - FOR Q22.sql` | Obsolete one-off `DBMS_JOB` with hardcoded Windows path `\\cmis60\dev-tp$\Q22\OUT` — do not deploy |
| `BATCH2.SQL` | `DBMS_JOB.SUBMIT` present but commented out (line 195) — no action |
| `NPS_Departments_Job_Scheduler.sql` | Already uses `DBMS_SCHEDULER` — no action |
| `UK_Grants.sql` | `GRANT CREATE ANY DIRECTORY TO LCD` — review with DBA; not a code patch |

---

## 13. Indirect Callers (inherit Tier B — no patch required)

Verified via grep for `shared.f_open_in_file` / `shared.f_open_out_file`:

| File | Calls |
|------|-------|
| `WrkrWageCtrl_imp.sql` | f_open_in_file |
| `wrkrRate_imp.sql` | f_open_in_file |
| `Wo_Imp.bdy` | f_open_in_file |
| `WAGEDTRATE_IMP.SQL` | f_open_in_file |
| `TOEATTABSMAP_IMP.SQL` | f_open_in_file |
| `TIMEGENWAGE_IMP.SQL` | f_open_in_file |
| `PRIWAGE_IMP.SQL` | f_open_in_file |
| `paywage_imp.sql` | f_open_in_file |
| `LD_PRMSN.SQL` | f_open_in_file |
| `LD_CWF.SQL` | f_open_in_file |
| `lab_impb.sql` | f_open_in_file |
| `LABINT.SQL` | f_open_out_file (×10) |
| `LABCATIM.SQL` | f_open_in_file |
| `JKEYIMP.sql` | f_open_in_file |
| `INT800.SQL` | f_open_in_file |
| `DLTKINTR.SQL` | f_open_in_file (×3) |
| `deptasgmt_imp.sql` | f_open_in_file |
| `CP100LAB.SQL` | f_open_in_file (×3) |
| `BLOCIMP.SQL` | f_open_in_file |
| `ATTWAGEMAP_IMP.SQL` | f_open_in_file |
| `attabs_imp.sql` | f_open_in_file |
| `ALTWO_IMP_BODY.sql` | f_open_in_file |
| `AddPayImp.sql` | f_open_in_file |

**Prerequisite:** Tier B must be compiled and deployed before testing any import module.

---

## 14. DBA and Data Prerequisites

| # | Action | Owner |
|---|--------|-------|
| 1 | Create missing DIRECTORY objects for UK, Nordic, MidEast, LatAm, Italy, SAfrica | DBA |
| 2 | Run `GRANT_DIRECTORY_ACCESS.sql` as SYS | DBA |
| 3 | Verify `LCD_ORGPARAM.LCD_SERVER_LOC` values match filesystem mount paths | App admin |
| 4 | Confirm `/csclcdnc0002/Q22S*` directories exist and are readable/writable by Oracle OS user | DBA / Sysadmin |
| 5 | Grant `CREATE JOB` to LCD if not already granted (WOA scheduler) | DBA |
| 6 | Update job definitions calling `sa_notime(path, ...)` to pass DIRECTORY names | App admin |

---

## 15. Compile Order

```
Step 0:  GRANT_DIRECTORY_ACCESS.sql                    (as SYS)
Step 1:  F_GET_19C_DIR_NAME.sql
Step 2:  F_GET_LCD_OS_FILENAME.sql
         F_CHECK_LCD_OS_FILENAME.sql
Step 3:  FILEEXST.SQL, FILECOPY.SQL, GETFILE.SQL
Step 4:  SHRD_BDY.SQL, BATCH.SQL
Step 5:  Tier C files (any order)
Step 6:  Sap_Data_Load.prc → Sap_Submit_Data_Load.prc → Sap_Auto_Load.prc  (atomic)
Step 7:  Step3_LCDInterface_Refresh.sql, Step4_LCDInterface_ScheduleRefresh.sql
```

---

## 16. Verification Smoke Tests

After each compile step:

```sql
SET SERVEROUTPUT ON SIZE UNLIMITED

-- Step 1: path → directory name
SELECT lcd.f_get_19c_dir_name('/csclcdnc0002/Q22S/In') FROM dual;
-- Expected: LCD_IN

-- Step 2: org → directory name (not path)
SELECT lcd.f_get_lcd_os_filename('010', NULL, 'IN', FALSE) FROM dual;
-- Expected: LCD_IN  (must NOT return '/csclcdnc0002/Q22S/In')

-- Federal org
SELECT lcd.f_get_lcd_os_filename('114', NULL, 'OUT', FALSE) FROM dual;
-- Expected: LCD_FEDERAL_OUT

-- Validation function
SELECT lcd.f_check_lcd_os_filename('010', NULL, 'IN', FALSE) FROM dual;
-- Expected: TRUE

-- Directory inventory
SELECT directory_name, directory_path
  FROM all_directories
 WHERE directory_name LIKE 'LCD%'
 ORDER BY 1;
```

---

## 17. Known Defects Fixed by This Migration

| File | Defect | Fix |
|------|--------|-----|
| `FILECOPY.SQL` | `f_open_out_file` resolves path but never calls FOPEN | Restore FOPEN with directory name |
| `NAUSD_SUBCON_FEED-proc.sql` | `svr_path||'\OUT'` doubles OUT on Linux path | Remove `\OUT` suffix |
| `USR11_SUBCON_FEED-proc.sql` | Same `\OUT` suffix bug | Same fix |
| `NPS_Department_Select.sql` | `LCD_SERVER_LOC||'\OUT'` uses Windows backslash on Linux | Use resolver with org OUT stub |
| `Tes_Reports.bdy` | `substr(p_dir_name,1,length-1)` path hack | Replace with DIRECTORY name resolution |

---

## 18. Change Log Revision History

| Date | Author | Change |
|------|--------|--------|
| 5/24/2026 | RdW | Initial independent analysis of LCD-Oracle SQL codebase |
