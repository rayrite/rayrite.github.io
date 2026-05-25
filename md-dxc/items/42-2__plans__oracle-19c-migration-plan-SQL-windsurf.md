# Oracle 11g → 19c Migration Plan (Task 42-2)

Migrate LCD-Oracle SQL scripts from Oracle 11g `UTL_FILE_DIR`-based file I/O to Oracle 19c Directory Object-based file I/O, using a central resolver approach, with full deployment and testing plans.

---

## Problem Statement

Oracle 19c **removed the `UTL_FILE_DIR` init parameter**. All `UTL_FILE.FOPEN` calls (and `FGetAttr`, `FREMOVE`, `FRENAME`, `FCOPY`) must use **Oracle Directory Object names** (e.g., `'LCD_IN'`) instead of raw filesystem paths (e.g., `'/csclcdnc0002/Q22S/In'`). The DBA has already created the directory objects per `DB_DIRECTORIES.txt`.

## Design Decisions

| Decision | Choice |
|---|---|
| Migration approach | **Option A: Central resolver** – rewrite `f_get_lcd_os_filename` to return a directory object name |
| Scope | Main `SQL/` folder only (not `SQL (CPI)/`, `SQL (WOA)/`, etc.) |
| `LCD_FILE_PARAM` table | **Deprecate** – no longer needed with directory objects |
| `10g_packages.sql` | **Skip** – historical archive, not deployed |
| Comment prefix | `-- RdW 5/24/2026 Oracle 19c Migration` |

## Key Architecture

**Current flow (11g):**
```
LCD.ORG_PARAM.LCD_SERVER_LOC  →  f_get_lcd_os_filename()  →  filesystem path  →  UTL_FILE.FOPEN(path, file, mode)
                                          ↑
                              LCD_FILE_PARAM (UTL_FILE_DIR_PATHS) case-sensitivity lookup
```

**Target flow (19c):**
```
LCD.ORG_PARAM.LCD_SERVER_LOC  →  f_get_lcd_directory_name()  →  directory object name  →  UTL_FILE.FOPEN(dir_obj, file, mode)
                                          ↑
                              ALL_DIRECTORIES view lookup (path → directory name)
```

## Directory Object Mapping (from DB_DIRECTORIES.txt – UAT)

| Directory Object | Filesystem Path |
|---|---|
| `LCD` | `/csclcdnc0002/Q22S` |
| `LCD_IN` | `/csclcdnc0002/Q22S/In` |
| `LCD_OUT` | `/csclcdnc0002/Q22S/Out` |
| `LCD_ARCH` | `/csclcdnc0002/Q22S/Archive` |
| `LCD_ARCH_IN` | `/csclcdnc0002/Q22S/Archive/In` |
| `LCD_ARCH_OUT` | `/csclcdnc0002/Q22S/Archive/Out` |
| `LCD_149_IN` | `/csclcdnc0002/Q22S-149/IN` |
| `LCD_663_OUT` | `/csclcdnc0002/Q22S-663/OUT` |
| `LCD_CANADA_IN` | `/csclcdnc0002/Q22S-CANADA/IN` |
| `LCD_FEDERAL_ARCH_OUT` | `/csclcdnc0002/Q22S-FEDERAL/ARCHIVE/OUT` |
| *(etc. – full set in DB_DIRECTORIES.txt)* | |

---

## Files Requiring Patching (24 files)

### Tier 1 – Central Resolver (rewrite logic)
| # | File | Changes |
|---|---|---|
| 1 | `F_GET_LCD_OS_FILENAME.sql` | Rewrite to return directory object name via `ALL_DIRECTORIES` lookup; deprecate `LCD_FILE_PARAM` dependency |
| 2 | `F_CHECK_LCD_OS_FILENAME.sql` | Rewrite to validate against `ALL_DIRECTORIES` instead of `LCD_FILE_PARAM` |

### Tier 2 – Core I/O Wrappers (update FOPEN callers)
| # | File | Key Functions | FOPEN Calls |
|---|---|---|---|
| 3 | `SHRD_BDY.SQL` | `f_open_in_file`, `f_open_out_file`, `f_open_append_file`, `create_ftp_control_file` | 3 active |
| 4 | `GETFILE.SQL` | `f_open_in_file` | 1 active |
| 5 | `FILECOPY.SQL` | `f_open_out_file` (CopyFile pkg) | 1 active (inline path lookup) |
| 6 | `FILEEXST.SQL` | `f_file_exist` | 1 active (inline path lookup) |
| 7 | `BATCH.SQL` | `fExists`/FGetAttr, `FileInfoPermission`, `ServerFileCopy`/FCOPY/FRENAME, `ServerFileMove`/FREMOVE | 1 FOPEN + FGetAttr + FCOPY + FRENAME + FREMOVE |

### Tier 3 – Direct FOPEN Callers (update path resolution)
| # | File | Pattern | Notes |
|---|---|---|---|
| 8 | `Tes_Reports.bdy` | Raw `lcd_server_loc` path | 3 FOPEN calls using `g_org_param_data.lcd_server_loc` |
| 9 | `TIMEDB2.SQL` | Already uses `f_get_lcd_os_filename` | 1 active FOPEN |
| 10 | `UNAPPROVED_HOURS.sql` | Inline `LCD_FILE_PARAM` lookup | 2 FOPEN calls |
| 11 | `Alt_Work_Order_Extract.sql` | Inline `LCD_FILE_PARAM` lookup + `FOpenOutputFile` | 1 FOPEN |
| 12 | `Work_Order_Extract.sql` | Inline `LCD_FILE_PARAM` lookup + `FOpenOutputFile` | 1 FOPEN |
| 13 | `BeelineBusinessAreas.sql` | Inline `LCD_FILE_PARAM` lookup | 1 FOPEN |
| 14 | `BeelineDepartments.sql` | Inline `LCD_FILE_PARAM` lookup | 1 FOPEN |
| 15 | `ALL_DEPARTMENTS_BEELINE-proc.sql` | Own path resolution | 2 FOPEN |
| 16 | `NAUSD_SUBCON_FEED-proc.sql` | Inline `LCD_FILE_PARAM` lookup | 1 FOPEN |
| 17 | `USR11_SUBCON_FEED-proc.sql` | Inline `LCD_FILE_PARAM` lookup | 1 FOPEN |
| 18 | `sa_notime.sql` | Own path resolution | 1 FOPEN |
| 19 | `SUBCO_NOTIME_TERM.sql` | Inline path construction | 1 FOPEN |
| 20 | `LCD_USER_AUDIT-proc.sql` | Inline `LCD_FILE_PARAM` lookup | 1 FOPEN |
| 21 | `NPS_Department_Select.sql` | Own path resolution | 1 FOPEN |
| 22 | `TimeSheetExtractLCD.sql` | Inline `LCD_FILE_PARAM` lookup | 1 FOPEN |
| 23 | `WEEKLY_NPS_EXTRACT-proc.sql` | Inline `LCD_FILE_PARAM` lookup | 1 FOPEN |
| 24 | `Sap_Data_Load.prc` | Own path resolution | 1 FOPEN |

### Files NOT Needing Changes
- **Import files** (ATTWAGEMAP_IMP, PRIWAGE_IMP, attabs_imp, paywage_imp, etc.) – only use `UTL_FILE.PUT_LINE`/`GET_LINE`/`FCLOSE` with already-opened file handles
- **LABINT.SQL, CP100LAB.SQL, DLTKINTR.SQL** – same (handle-only usage)
- **SHARED.SQL, SHARED1.SQL, SHRD_SPC.SQL** – only declare `UTL_FILE.FILE_TYPE` types
- **10g_packages.sql** – historical archive (not deployed)

### New Files to Create
| File | Purpose |
|---|---|
| `F_GET_LCD_DIRECTORY_NAME.sql` | New central function: maps (org_code, stub, archive_flag) → directory object name |
| `LCD_DIR_MAP_SETUP.sql` | Optional: deployment script to verify/create directory objects |

---

## Implementation Phases

### Phase 0: Backup & Setup
- [ ] Copy all 24 files from `LCD-Oracle/SQL/` to `tasks/42-2/originals/`
- [ ] Copy all 24 files from `LCD-Oracle/SQL/` to `tasks/42-2/patched/`
- [ ] Save implementation plan as `tasks/42-2/00_implementation_plan.md`
- [ ] Save deployment plan as `tasks/42-2/01_deployment_plan.md`
- [ ] Save test plan as `tasks/42-2/02_test_plan.md`

### Phase 1: Central Directory Resolver
- [ ] Create `F_GET_LCD_DIRECTORY_NAME.sql` – new function that:
  1. Builds expected filesystem path from `LCD_SERVER_LOC` + stub + archive_flag (like current `f_get_lcd_os_filename`)
  2. Queries `ALL_DIRECTORIES` to find the matching directory object name
  3. Returns the directory object name (e.g., `'LCD_IN'`)
  4. Includes DBMS_OUTPUT debug statements
  5. Falls back gracefully if no directory object found
- [ ] Update `F_GET_LCD_OS_FILENAME.sql` – make it call the new function (backward compat wrapper)
- [ ] Update `F_CHECK_LCD_OS_FILENAME.sql` – validate against `ALL_DIRECTORIES` instead of `LCD_FILE_PARAM`

### Phase 2: Core I/O Wrappers
- [ ] Patch `SHRD_BDY.SQL` – update `f_open_in_file`, `f_open_out_file`, `f_open_append_file` to use directory names from the resolver
- [ ] Patch `GETFILE.SQL` – update `f_open_in_file` 
- [ ] Patch `FILECOPY.SQL` – replace inline `LCD_FILE_PARAM` lookup with resolver call
- [ ] Patch `FILEEXST.SQL` – replace inline lookup with resolver call
- [ ] Patch `BATCH.SQL` – update `fExists`/`FGetAttr`, `ServerFileCopy`, `ServerFileMove` to use directory names

### Phase 3: Direct FOPEN Callers
- [ ] Patch remaining 16 files (Tier 3 list above):
  - Replace inline `LCD_FILE_PARAM` lookups with resolver call
  - Replace raw `lcd_server_loc` path construction with resolver call
  - Add DBMS_OUTPUT debug statements for directory resolution
  - Add migration comment prefix to all changes

### Phase 4: Deprecation & Cleanup
- [ ] Add deprecation comments to `LCD_FILE_PARAM_TABLE_DDL.sql`
- [ ] Add deprecation comments to `LCD_FILE_PARAM_P22_INSERT.sql`
- [ ] Document that `LCD_FILE_PARAM` can be retired after migration is verified

---

## Comment & Debug Convention

Every code change will be preceded by:
```sql
-- RdW 5/24/2026 Oracle 19c Migration - <description>
```

Every file path variable resolution will include:
```sql
-- RdW 5/24/2026 Oracle 19c Migration - Debug: directory resolution
DBMS_OUTPUT.PUT_LINE('19c_DEBUG: org_code=' || v_org || ' stub=' || v_stub || ' dir_name=' || v_dir_name);
DBMS_OUTPUT.PUT_LINE('19c_DEBUG: resolved_path=' || v_path || ' directory_obj=' || v_dir_obj);
```

---

## Deliverables Summary

| # | Deliverable | Location |
|---|---|---|
| 1 | Original (unmodified) SQL files | `tasks/42-2/originals/` (24 files) |
| 2 | Patched SQL files | `tasks/42-2/patched/` (24 files + 1-2 new) |
| 3 | Implementation plan | `tasks/42-2/00_implementation_plan.md` |
| 4 | Deployment plan | `tasks/42-2/01_deployment_plan.md` |
| 5 | Unit test plan | `tasks/42-2/02_test_plan.md` |
