# Plan: Oracle 11g → 19c Migration for LCD-Oracle SQL

## Context Summary

**Key Problem**: Oracle 19c removed `UTL_FILE_DIR` init parameter. All file I/O must now use
`CREATE DIRECTORY` objects. The existing codebase uses path strings passed to `UTL_FILE.FOPEN(path, file, mode)`;
19c requires `UTL_FILE.FOPEN(directory_object_name, file, mode)`.

**DBA Has Already Created Directory Objects** (from `tasks/42/uat/DB_DIRECTORIES.txt`):
- `LCD` → `/csclcdnc0002/Q22S`
- `LCD_IN` → `/csclcdnc0002/Q22S/In`
- `LCD_OUT` → `/csclcdnc0002/Q22S/Out`
- `LCD_ARCH` → `/csclcdnc0002/Q22S/Archive`
- `LCD_ARCH_IN` → `/csclcdnc0002/Q22S/Archive/In`
- `LCD_ARCH_OUT` → `/csclcdnc0002/Q22S/Archive/Out`
- `LCD_663`, `LCD_663_IN`, `LCD_663_OUT`, `LCD_663_ARCH`, etc.
- `LCD_149`, `LCD_285`, `LCD_FEDERAL`, `LCD_CANADA` variants + IN/OUT/ARCH sub-dirs

**Org → LCD_SERVER_LOC Mapping** (from `LCD_ORGPARAM_Q22S-19c-UPDATED.csv`):
- Most orgs: `/csclcdnc0002/Q22S` → directory prefix `LCD`
- Org 114: `/csclcdnc0002/Q22S-FEDERAL` → `LCD_FEDERAL`
- Org 574/575: `/csclcdnc0002/Q22S-CANADA` → `LCD_CANADA`

**Current Path Resolution**: `f_get_lcd_os_filename` and `f_check_lcd_os_filename` query
`LCD.LCD_FILE_PARAM (type='UTL_FILE_DIR_PATHS')` for case-sensitive path matching.
In 19c, must instead query `ALL_DIRECTORIES` to get the directory object name.

**DBMS_JOB deprecated**: `Step3_LCDInterface_Refresh.sql`, `Step4_LCDInterface_ScheduleRefresh.sql` use `DBMS_JOB.SUBMIT` → must migrate to `DBMS_SCHEDULER`.

## Files to Migrate (Priority Order)

### Tier 0 — New Helper + Data Scripts
- `F_GET_19C_DIR_NAME.sql` (NEW) — queries `ALL_DIRECTORIES` to map a path to a dir object name
- `LCD_FILE_PARAM_P22_INSERT.sql` — add 19c dir object names mapping data row
- `GRANT_DIRECTORY_ACCESS.sql` (NEW) — `GRANT READ, WRITE ON DIRECTORY ... TO LCD`

### Tier 1 — Core Utilities (everything depends on these)
1. `SQL/F_GET_LCD_OS_FILENAME.sql`
2. `SQL/F_CHECK_LCD_OS_FILENAME.sql`
3. `SQL/FILEEXST.SQL` (f_file_exist function)
4. `SQL/FILECOPY.SQL` (CopyFile package)
5. `SQL/GETFILE.SQL` (GetFile package)

### Tier 2 — Extract/Feed Procedures
6. `SQL/Alt_Work_Order_Extract.sql`
7. `SQL/BeelineBusinessAreas.sql`
8. `SQL/BeelineDepartments.sql`
9. `SQL/TimeSheetExtractLCD.sql`
10. `SQL/Work_Order_Extract.sql`
11. `SQL/NAUSD_SUBCON_FEED-proc.sql`
12. `SQL/USR11_SUBCON_FEED-proc.sql`
13. `SQL/Sap_Data_Load.prc` — **BREAKING**: `p_dir IN VARCHAR2` changes meaning from filesystem path to Oracle 19c DIRECTORY object name (e.g., `'LCD_IN'`). Must be deployed atomically with steps 14 & 15. Update inline header comment to document new convention.
14. `SQL/Sap_Auto_Load.prc` — **Deploy with 13.** Locate where `p_dir` is built from `ORG_PARAM.LCD_SERVER_LOC`; wrap path string with `lcd.f_get_19c_dir_name()` before passing to `SAP_DATA_LOAD`. Add debug output.
15. `SQL/Sap_Submit_Data_Load.prc` — **Deploy with 13.** Same pattern as 14. Comment: "Oracle 19c DIRECTORY object name, not a filesystem path."

### Tier 3 — CPI Imports
16. `SQL (CPI)/CPGLImp.sql`
17. `SQL (CPI)/cpi_cwf.sql`
18. `SQL (CPI)/CPOrgImp.sql`
19. `SQL (CPI)/CPvendor.sql`
20. `SQL (CPI)/lab_impb.sql`

### Tier 4 — UK-I
21. `SQL (UK-I)/LABINT_SSN_For_UK.SQL`

### Tier 5 — DBMS_JOB → DBMS_SCHEDULER
22. `SQL (WOA)/Step3_LCDInterface_Refresh.sql`
23. `SQL (WOA)/Step4_LCDInterface_ScheduleRefresh.sql`

## Output Files (three markdown docs)
1. `tasks/42/ORACLE_19C_MIGRATION_IMPLEMENTATION_PLAN.md`
2. `tasks/42/ORACLE_19C_MIGRATION_DEPLOYMENT_PLAN.md`
3. `tasks/42/ORACLE_19C_MIGRATION_TEST_PLAN.md`

## Patch Pattern
- Comment prefix: `-- RdW 5/24/2026 Oracle 19c Migration `
- Flowerbox block before each changed section
- DBMS_OUTPUT debug statements for all file-path variables
- Patched copies go to `tasks/42/patched/`; originals to `tasks/42/originals/`
