# LCD-Oracle: Oracle 11g → 19c Migration — Implementation Plan

**Author:** RdW  
**Date:** 5/24/2026  
**Status:** Implemented (patched files in `tasks/42/patched/`)

---

## 1. Background and Core Problem

Oracle 19c removed the `UTL_FILE_DIR` initialization parameter that was used in Oracle 11g to specify a comma-separated list of filesystem paths where `UTL_FILE.FOPEN` was permitted to read and write files.

In Oracle 11g, the LCD application stored those allowed paths in a table:
```sql
LCD.LCD_FILE_PARAM (type = 'UTL_FILE_DIR_PATHS')
```
and called `UTL_FILE.FOPEN(path_string, filename, mode)`.

In Oracle 19c, `UTL_FILE.FOPEN` now requires a **DIRECTORY object name** (e.g., `'LCD_IN'`) instead of a path string. These are named objects created by a DBA with:
```sql
CREATE DIRECTORY LCD_IN AS '/csclcdnc0002/Q22S/In';
GRANT READ, WRITE ON DIRECTORY LCD_IN TO LCD;
```

The DBA has already created all required DIRECTORY objects for the UAT (Q22S) environment (see `tasks/42/uat/DB_DIRECTORIES.txt`).

A secondary issue is that two WOA files used `DBMS_JOB`, which is fully deprecated in Oracle 19c; they must use `DBMS_SCHEDULER`.

---

## 2. Reference Files

| File | Purpose |
|------|---------|
| `tasks/42/uat/DB_DIRECTORIES.txt` | 19c DIRECTORY object names and their filesystem paths (DEV, QA, UAT) |
| `tasks/42/uat/LCD_ORGPARAM_Q22S-19c-UPDATED.csv` | Org → `LCD_SERVER_LOC` mapping; column 32 is the base path per org |
| `tasks/42/uat/LCD_FILE_PARAM-Q22S-11g-Copied.txt` | 11g `UTL_FILE_DIR_PATHS` value (all allowed paths, comma-separated) |

---

## 3. Org → Directory Object Mapping (UAT)

| Org group | `LCD_SERVER_LOC` | Base Dir Object | IN dir | OUT dir | ARCH dirs |
|-----------|-----------------|-----------------|--------|---------|-----------|
| Most orgs (010, 580, 200…) | `/csclcdnc0002/Q22S` | `LCD` | `LCD_IN` | `LCD_OUT` | `LCD_ARCH`, `LCD_ARCH_IN`, `LCD_ARCH_OUT` |
| Org 114, 138, 185… (FEDERAL) | `/csclcdnc0002/Q22S-FEDERAL` | *(none)* | `LCD_FEDERAL_IN` | `LCD_FEDERAL_OUT` | `LCD_FEDERAL_ARCH*` |
| Org 574, 575 (CANADA) | `/csclcdnc0002/Q22S-CANADA` | *(none)* | `LCD_CANADA_IN` | `LCD_CANADA_OUT` | `LCD_CANADA_ARCH*` |
| Org 663 (INDIA group) | `/csclcdnc0002/Q22S` | `LCD` | `LCD_IN` | `LCD_OUT` | `LCD_ARCH*` |
| Org 149 | `/csclcdnc0002/Q22S-149` | `LCD_149` | `LCD_149_IN` | `LCD_149_OUT` | `LCD_149_ARCH*` |
| Org 285 area | `/csclcdnc0002/Q22S-285` | *(none)* | `LCD_285_IN` | `LCD_285_OUT` | `LCD_285_ARCH*` |

---

## 4. Files Modified

### Tier 0 — New Files (no originals)

| File | Description |
|------|-------------|
| `patched/SQL/F_GET_19C_DIR_NAME.sql` | **NEW** helper function. Given a filesystem path, queries `ALL_DIRECTORIES` and returns the matching Oracle DIRECTORY object name. Foundation for all other patches. |
| `patched/SQL/GRANT_DIRECTORY_ACCESS.sql` | **NEW** DBA script. Grants `READ` and `WRITE` on all UAT DIRECTORY objects to the `LCD` schema. Run as SYS before any other script. |

### Tier 1 — Core Utility Files (patch critical path)

| File | Changes |
|------|---------|
| `patched/SQL/F_GET_LCD_OS_FILENAME.sql` | **Return value semantic change.** After CONNECT BY path-resolution loop, calls `lcd.f_get_19c_dir_name(fopenpath)` and returns the DIRECTORY object name instead of the raw filesystem path. Added `l_dir_name_19c VARCHAR2(128)` variable. Added debug `DBMS_OUTPUT`. |
| `patched/SQL/F_CHECK_LCD_OS_FILENAME.sql` | **Validation mechanism change.** Replaced `LCD_FILE_PARAM` CONNECT BY loop validation with `lcd.f_get_19c_dir_name()` lookup against `ALL_DIRECTORIES`. Returns `TRUE` only if a DIRECTORY object exists for the constructed path. |
| `patched/SQL/FILEEXST.SQL` | Added `l_dir_name_19c` variable. Added `f_get_19c_dir_name()` call before `UTL_FILE.FOPEN`. Returns `-3` if no DIRECTORY object found (instead of waiting for `INVALID_PATH` exception). |
| `patched/SQL/FILECOPY.SQL` | Added `l_dir_name_19c` variable. **Also restored missing `UTL_FILE.FOPEN` call** (the 2023 Unix migration omitted it — confirmed bug). `p_file_handle` is now opened with the DIRECTORY object name. |
| `patched/SQL/GETFILE.SQL` | Added `l_dir_name_19c` variable. Resolved dir object name before `UTL_FILE.FOPEN` in `f_open_in_file`. |

### Tier 2 — SAP Load Atomic Group (deploy all three together)

| File | Changes |
|------|---------|
| `patched/SQL/Sap_Data_Load.prc` | **BREAKING CHANGE documented.** Updated procedure header comment: `p_dir` now accepts a DIRECTORY object name, NOT a filesystem path. Added `DBMS_OUTPUT` debug for `p_org`, `p_dir`, `p_file` at procedure entry. |
| `patched/SQL/Sap_Submit_Data_Load.prc` | Updated `FRetrieveSystemParams`: `pRSPDir` is now set via `f_get_lcd_os_filename()` which (after Tier 1 patch) returns a DIRECTORY object name. Updated comment to document the calling convention. Added debug output. |
| `patched/SQL/Sap_Auto_Load.prc` | No `p_dir` construction here (delegates to `SAP_SUBMIT_DATA_LOAD`). DBMS_SCHEDULER already in place (2011). Added debug `DBMS_OUTPUT` for org and job name after `DBMS_SCHEDULER.CREATE_JOB`. |

### Tier 2 — Remaining Extract/Feed Procedures

| File | Changes |
|------|---------|
| `patched/SQL/BeelineBusinessAreas.sql` | Added comment block + `lcd.f_get_19c_dir_name(svr_path)` call in `utl_file.fopen`. |
| `patched/SQL/BeelineDepartments.sql` | Same pattern as BeelineBusinessAreas. |
| `patched/SQL/TimeSheetExtractLCD.sql` | Added comment block + `lcd.f_get_19c_dir_name(l_FileDir)` call in `UTL_FILE.FOPEN`. |
| `patched/SQL/Work_Order_Extract.sql` | Added comment block + `lcd.f_get_19c_dir_name(pOF_dir)` call inside `FOpenOutputFile` function. |
| `patched/SQL/Alt_Work_Order_Extract.sql` | Same pattern as Work_Order_Extract. |
| `patched/SQL/NAUSD_SUBCON_FEED-proc.sql` | Added comment block + `lcd.f_get_19c_dir_name(svr_path)` call. **Also removed legacy `\OUT` suffix** that was duplicating an already-included OUT path component. |
| `patched/SQL/USR11_SUBCON_FEED-proc.sql` | Same as NAUSD. Security note added: this feed outputs unmasked `WORKER_SSN`; ensure OS-level permissions on `LCD_OUT` directory are restricted. |

### Tier 5 — DBMS_JOB → DBMS_SCHEDULER (WOA)

| File | Changes |
|------|---------|
| `patched/SQL(WOA)/Step3_LCDInterface_Refresh.sql` | Replaced `DBMS_JOB.SUBMIT(job#, job_to_do, SYSDATE, NULL, false)` with `DBMS_SCHEDULER.CREATE_JOB(...)` using `SYSTIMESTAMP`, `auto_drop => TRUE`. Each org in the cursor loop gets its own named one-shot job. |
| `patched/SQL(WOA)/Step4_LCDInterface_ScheduleRefresh.sql` | Replaced `DBMS_JOB.SUBMIT` (every-4-hours interval) with `DBMS_SCHEDULER.CREATE_JOB(repeat_interval => 'FREQ=HOURLY;INTERVAL=4')`. Replaced `DBMS_JOB.RUN(job#)` with `DBMS_SCHEDULER.RUN_JOB(l_job_name, use_current_session => FALSE)`. |

### Skipped (deferred to future sprint)

- `SQL (CPI)/` — CPGLImp, cpi_cwf, CPOrgImp, CPvendor, lab_impb (Tier 3)
- `SQL (UK-I)/LABINT_SSN_For_UK.SQL` (Tier 4)

---

## 5. Implementation Phases and To-Do List

### Phase 1 — Foundation (DBA action required first)
- [x] DBA confirms `CREATE DIRECTORY` objects exist (see `DB_DIRECTORIES.txt` for UAT)
- [x] Create `patched/SQL/F_GET_19C_DIR_NAME.sql`
- [x] Create `patched/SQL/GRANT_DIRECTORY_ACCESS.sql`

### Phase 2 — Core Utilities
- [x] Patch `F_GET_LCD_OS_FILENAME.sql` — now returns DIRECTORY object name
- [x] Patch `F_CHECK_LCD_OS_FILENAME.sql` — validates against `ALL_DIRECTORIES`
- [x] Patch `FILEEXST.SQL`
- [x] Patch `FILECOPY.SQL` (also restored missing FOPEN call)
- [x] Patch `GETFILE.SQL`

### Phase 3 — SAP Atomic Group
- [x] Patch `Sap_Data_Load.prc` — document `p_dir` semantic change
- [x] Patch `Sap_Submit_Data_Load.prc` — update `FRetrieveSystemParams`
- [x] Patch `Sap_Auto_Load.prc` — add debug output

### Phase 4 — Extract/Feed Procedures
- [x] Patch `BeelineBusinessAreas.sql`
- [x] Patch `BeelineDepartments.sql`
- [x] Patch `TimeSheetExtractLCD.sql`
- [x] Patch `Work_Order_Extract.sql`
- [x] Patch `Alt_Work_Order_Extract.sql`
- [x] Patch `NAUSD_SUBCON_FEED-proc.sql`
- [x] Patch `USR11_SUBCON_FEED-proc.sql`

### Phase 5 — DBMS_JOB Migration
- [x] Patch `Step3_LCDInterface_Refresh.sql`
- [x] Patch `Step4_LCDInterface_ScheduleRefresh.sql`

### Phase 6 — Deferred (CPI / UK-I)
- [ ] Patch `SQL (CPI)/CPGLImp.sql`
- [ ] Patch `SQL (CPI)/cpi_cwf.sql`
- [ ] Patch `SQL (CPI)/CPOrgImp.sql`
- [ ] Patch `SQL (CPI)/CPvendor.sql`
- [ ] Patch `SQL (CPI)/lab_impb.sql`
- [ ] Patch `SQL (UK-I)/LABINT_SSN_For_UK.SQL`

---

## 6. Comment and Annotation Convention

All changes are preceded by a flowerbox comment:
```sql
-- ===========================================================================
-- RdW 5/24/2026 Oracle 19c Migration - [description of change]
-- ===========================================================================
```

Debug `DBMS_OUTPUT` lines (comment out before production):
```sql
DBMS_OUTPUT.PUT_LINE('-- DEBUG [RdW 19c] <context> var=' || var);
```

---

## 7. Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| Use `ALL_DIRECTORIES` directly via `f_get_19c_dir_name` | No additional data maintenance required; always in sync with DBA's DIRECTORY objects |
| Retain CONNECT BY `LCD_FILE_PARAM` loops (commented in) | Provides rollback reference and diagnostic context |
| `FILECOPY.SQL` FOPEN bug fix included in this patch | The 2023 Unix migration omitted the `UTL_FILE.FOPEN` call; correcting it is required for correct operation regardless of the 19c migration |
| `Sap_Data_Load.prc` `p_dir` is a calling-convention change | All callers updated in same phase; deploy as atomic unit |
| `NAUSD`/`USR11` legacy `\OUT` suffix removed | `svr_path` already contains the full path with OUT; the suffix was a Windows artifact doubling the suffix |
| DBMS_SCHEDULER job names are org-scoped and timestamped (Step3) | Prevents name collisions when multiple orgs run concurrently |
