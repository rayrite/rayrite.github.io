# Oracle 11g → 19c Migration – Implementation Plan

## Overview

Migrate LCD-Oracle PL/SQL file I/O from Oracle 11g `UTL_FILE_DIR` (deprecated) to Oracle 19c **Directory Objects**. The `UTL_FILE_DIR` init parameter is removed in 19c; all `UTL_FILE.FOPEN`, `FGetAttr`, `FREMOVE`, `FRENAME`, and `FCOPY` calls must reference Directory Object names rather than raw filesystem paths.

## Design: Central Resolver Approach

Instead of modifying every file individually, we introduce a **single new function** `f_get_lcd_directory_name` that maps an org code + stub (IN/OUT) + archive flag to the correct Oracle Directory Object name by querying the `ALL_DIRECTORIES` data dictionary view. All existing callers are updated to use this function.

### Architecture Diagram

```
BEFORE (11g):
  LCD.ORG_PARAM.LCD_SERVER_LOC  ──►  f_get_lcd_os_filename()  ──►  '/csclcdnc0002/Q22S/In'
                                              ↑                            │
                                   LCD_FILE_PARAM lookup            UTL_FILE.FOPEN(path, file, mode)

AFTER (19c):
  LCD.ORG_PARAM.LCD_SERVER_LOC  ──►  f_get_lcd_directory_name()  ──►  'LCD_IN'
                                              ↑                            │
                                   ALL_DIRECTORIES lookup           UTL_FILE.FOPEN(dir_obj, file, mode)
```

### Directory Object Mapping (UAT – from DB_DIRECTORIES.txt)

| Directory Object | Filesystem Path | Used By |
|---|---|---|
| `LCD` | `/csclcdnc0002/Q22S` | Base path for default orgs |
| `LCD_IN` | `/csclcdnc0002/Q22S/In` | Import files |
| `LCD_OUT` | `/csclcdnc0002/Q22S/Out` | Export files |
| `LCD_ARCH` | `/csclcdnc0002/Q22S/Archive` | Archive base |
| `LCD_ARCH_IN` | `/csclcdnc0002/Q22S/Archive/In` | Archived imports |
| `LCD_ARCH_OUT` | `/csclcdnc0002/Q22S/Archive/Out` | Archived exports |
| `LCD_149` | `/csclcdnc0002/Q22S-149` | Org 149 base |
| `LCD_149_IN` | `/csclcdnc0002/Q22S-149/IN` | Org 149 imports |
| `LCD_149_OUT` | `/csclcdnc0002/Q22S-149/OUT` | Org 149 exports |
| `LCD_149_ARCH` | `/csclcdnc0002/Q22S-149/ARCHIVE` | Org 149 archive |
| `LCD_149_ARCH_IN` | `/csclcdnc0002/Q22S-149/ARCHIVE/IN` | Org 149 archived imports |
| `LCD_149_ARCH_OUT` | `/csclcdnc0002/Q22S-149/ARCHIVE/OUT` | Org 149 archived exports |
| `LCD_285_IN` | `/csclcdnc0002/Q22S-285/IN` | Org 285 imports |
| `LCD_285_OUT` | `/csclcdnc0002/Q22S-285/OUT` | Org 285 exports |
| `LCD_285_ARCH` | `/csclcdnc0002/Q22S-285/ARCHIVE` | Org 285 archive |
| `LCD_285_ARCH_IN` | `/csclcdnc0002/Q22S-285/ARCHIVE/IN` | Org 285 archived imports |
| `LCD_285_ARCH_OUT` | `/csclcdnc0002/Q22S-285/ARCHIVE/OUT` | Org 285 archived exports |
| `LCD_663` | `/csclcdnc0002/Q22S-663` | Org 663 base |
| `LCD_663_IN` | `/csclcdnc0002/Q22S-663/IN` | Org 663 imports |
| `LCD_663_OUT` | `/csclcdnc0002/Q22S-663/OUT` | Org 663 exports |
| `LCD_663_ARCH` | `/csclcdnc0002/Q22S-663/ARCHIVE` | Org 663 archive |
| `LCD_663_ARCH_IN` | `/csclcdnc0002/Q22S-663/ARCHIVE/IN` | Org 663 archived imports |
| `LCD_663_ARCH_OUT` | `/csclcdnc0002/Q22S-663/ARCHIVE/OUT` | Org 663 archived exports |
| `LCD_CANADA_IN` | `/csclcdnc0002/Q22S-CANADA/IN` | Canada imports |
| `LCD_CANADA_OUT` | `/csclcdnc0002/Q22S-CANADA/OUT` | Canada exports |
| `LCD_CANADA_ARCH` | `/csclcdnc0002/Q22S-CANADA/ARCHIVE` | Canada archive |
| `LCD_CANADA_ARCH_IN` | `/csclcdnc0002/Q22S-CANADA/ARCHIVE/IN` | Canada archived imports |
| `LCD_CANADA_ARCH_OUT` | `/csclcdnc0002/Q22S-CANADA/ARCHIVE/OUT` | Canada archived exports |
| `LCD_FEDERAL_IN` | `/csclcdnc0002/Q22S-FEDERAL/IN` | Federal imports |
| `LCD_FEDERAL_OUT` | `/csclcdnc0002/Q22S-FEDERAL/OUT` | Federal exports |
| `LCD_FEDERAL_ARCH` | `/csclcdnc0002/Q22S-FEDERAL/ARCHIVE` | Federal archive |
| `LCD_FEDERAL_ARCH_IN` | `/csclcdnc0002/Q22S-FEDERAL/ARCHIVE/IN` | Federal archived imports |
| `LCD_FEDERAL_ARCH_OUT` | `/csclcdnc0002/Q22S-FEDERAL/ARCHIVE/OUT` | Federal archived exports |

---

## Phase 1: Central Directory Resolver

### Task 1.1: Create `F_GET_LCD_DIRECTORY_NAME.sql`

New function that replaces the filesystem-path-based resolution with a Directory Object lookup.

**Logic:**
1. Accept `a_org_code`, `stub` (IN/OUT/null), and `archiveflag` (TRUE/FALSE)
2. Fetch `LCD_SERVER_LOC` from `LCD.ORG_PARAM` (or use `a_server_loc` if org is null)
3. Build the expected filesystem path by appending `/ARCHIVE/stub` or `/stub` using the OS separator
4. Query `ALL_DIRECTORIES` where `UPPER(DIRECTORY_PATH) = UPPER(expected_path)`
5. Return the `DIRECTORY_NAME`
6. Include DBMS_OUTPUT debug lines for all variables

### Task 1.2: Update `F_GET_LCD_OS_FILENAME.sql`

Modify to call `f_get_lcd_directory_name` instead of doing its own `LCD_FILE_PARAM` lookup. This becomes a thin wrapper for backward compatibility.

### Task 1.3: Update `F_CHECK_LCD_OS_FILENAME.sql`

Replace the `LCD_FILE_PARAM` path lookup with a check against `ALL_DIRECTORIES`.

---

## Phase 2: Core I/O Wrappers (5 files)

### Task 2.1: Patch `SHRD_BDY.SQL`
- **`f_open_in_file`** (line ~463): Replace `f_get_lcd_os_filename` call with `f_get_lcd_directory_name`
- **`f_open_in_file` overload** (line ~560): Same change
- **`f_open_out_file`** (line ~643): Same change
- **`create_ftp_control_file`** and related: Update any remaining path-based opens
- Remove/deprecate inline `LCD_FILE_PARAM` lookups if present
- Add DBMS_OUTPUT debug statements

### Task 2.2: Patch `GETFILE.SQL`
- **`f_open_in_file`** (line ~279): Replace inline `LCD_FILE_PARAM` lookup with `f_get_lcd_directory_name` call
- Remove package-level `utlfpaths`, `ispathfound` variables (no longer needed)

### Task 2.3: Patch `FILECOPY.SQL`
- **`f_open_out_file`** (line ~86-116): Replace inline `LCD_FILE_PARAM` lookup with `f_get_lcd_directory_name`

### Task 2.4: Patch `FILEEXST.SQL`
- **`f_file_exist`** (line ~49-77): Replace inline `LCD_FILE_PARAM` lookup with `f_get_lcd_directory_name`

### Task 2.5: Patch `BATCH.SQL`
- **`fExists`** (line ~26-30): Update `f_get_lcd_os_filename` call to use `f_get_lcd_directory_name` (FGetAttr needs directory object name)
- **`FileInfoPermission`** (line ~183): Same
- **`ServerFileCopy`** (line ~347-353): Update for FCOPY/FRENAME (these already take location parameters)
- **`ServerFileMove`** (line ~498): Update for FREMOVE

---

## Phase 3: Direct FOPEN Callers (16 files)

Each file follows one of these patterns and requires the corresponding fix:

### Pattern A – Already uses `f_get_lcd_os_filename` (1 file)
**TIMEDB2.SQL**: Change `f_get_lcd_os_filename` call to `f_get_lcd_directory_name`

### Pattern B – Inline `LCD_FILE_PARAM` lookup (10 files)
Replace the inline path resolution block with a single call to `f_get_lcd_directory_name`:
- UNAPPROVED_HOURS.sql
- Alt_Work_Order_Extract.sql
- Work_Order_Extract.sql
- BeelineBusinessAreas.sql
- BeelineDepartments.sql
- NAUSD_SUBCON_FEED-proc.sql
- USR11_SUBCON_FEED-proc.sql
- LCD_USER_AUDIT-proc.sql
- TimeSheetExtractLCD.sql
- WEEKLY_NPS_EXTRACT-proc.sql

### Pattern C – Raw `lcd_server_loc` path construction (5 files)
Replace path construction with `f_get_lcd_directory_name` call:
- Tes_Reports.bdy (3 FOPEN locations)
- sa_notime.sql
- SUBCO_NOTIME_TERM.sql
- NPS_Department_Select.sql
- ALL_DEPARTMENTS_BEELINE-proc.sql

### Pattern D – Path passed as parameter (1 file)
- Sap_Data_Load.prc: Update the caller chain to pass directory object names

---

## Phase 4: Deprecation

- Add deprecation notices to `LCD_FILE_PARAM_TABLE_DDL.sql` and `LCD_FILE_PARAM_P22_INSERT.sql`
- The `LCD_FILE_PARAM` table data can be retained as historical reference but is no longer queried at runtime

---

## Comment Convention

All changes preceded by:
```sql
-- RdW 5/24/2026 Oracle 19c Migration - <description of change>
```

## Debug Convention

All directory resolution points include:
```sql
DBMS_OUTPUT.PUT_LINE('19c_DEBUG: org_code=[' || v_org || '] stub=[' || v_stub || '] archive=[' || v_arch || ']');
DBMS_OUTPUT.PUT_LINE('19c_DEBUG: expected_path=[' || v_path || '] directory_obj=[' || v_dir_obj || ']');
```

---

## Checklist

- [ ] Phase 0: Files copied to originals/ and patched/
- [ ] Phase 0: Plan documents created
- [ ] Phase 1: F_GET_LCD_DIRECTORY_NAME.sql created
- [ ] Phase 1: F_GET_LCD_OS_FILENAME.sql updated
- [ ] Phase 1: F_CHECK_LCD_OS_FILENAME.sql updated
- [ ] Phase 2: SHRD_BDY.SQL patched
- [ ] Phase 2: GETFILE.SQL patched
- [ ] Phase 2: FILECOPY.SQL patched
- [ ] Phase 2: FILEEXST.SQL patched
- [ ] Phase 2: BATCH.SQL patched
- [ ] Phase 3: TIMEDB2.SQL patched
- [ ] Phase 3: UNAPPROVED_HOURS.sql patched
- [ ] Phase 3: Alt_Work_Order_Extract.sql patched
- [ ] Phase 3: Work_Order_Extract.sql patched
- [ ] Phase 3: BeelineBusinessAreas.sql patched
- [ ] Phase 3: BeelineDepartments.sql patched
- [ ] Phase 3: ALL_DEPARTMENTS_BEELINE-proc.sql patched
- [ ] Phase 3: NAUSD_SUBCON_FEED-proc.sql patched
- [ ] Phase 3: USR11_SUBCON_FEED-proc.sql patched
- [ ] Phase 3: sa_notime.sql patched
- [ ] Phase 3: SUBCO_NOTIME_TERM.sql patched
- [ ] Phase 3: LCD_USER_AUDIT-proc.sql patched
- [ ] Phase 3: NPS_Department_Select.sql patched
- [ ] Phase 3: TimeSheetExtractLCD.sql patched
- [ ] Phase 3: WEEKLY_NPS_EXTRACT-proc.sql patched
- [ ] Phase 3: Sap_Data_Load.prc patched
- [ ] Phase 3: Tes_Reports.bdy patched
- [ ] Phase 4: Deprecation notices added
- [ ] All patched files compile cleanly
- [ ] Unit test plan executed
