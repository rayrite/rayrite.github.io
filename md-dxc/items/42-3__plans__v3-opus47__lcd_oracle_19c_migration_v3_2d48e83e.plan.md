---
name: LCD Oracle 19c Migration v3
overview: Independent analysis of the LCD-Oracle SQL codebase identifies ~60 active files that touch `UTL_FILE` and/or the legacy `UTL_FILE_DIR_PATHS` CSV in `LCD_FILE_PARAM`. We'll back them up to `originals/`, clone to `patched/`, then convert the file-system code from 11g path-strings to 19c directory objects using a dynamic `ALL_DIRECTORIES` lookup (Option B). All deliverable plans land in `tasks/42-3/plans/v3-opus47/`.
todos:
  - id: phase0_backup
    content: "Phase 0: clone 60 in-scope files from LCD-Oracle/SQL/ to tasks/42-3/originals/ (pristine) and tasks/42-3/patched/ (edit target); reserve slot patched/F_PATH_TO_DIR_NAME.sql"
    status: pending
  - id: phase1_helper
    content: "Phase 1: write new helper lcd.f_path_to_dir_name in patched/F_PATH_TO_DIR_NAME.sql (Option B - dynamic ALL_DIRECTORIES lookup) with the standard RdW 5/24/2026 Oracle 19c Migration comment block and DBMS_OUTPUT debug lines"
    status: pending
  - id: phase2_bucket_a
    content: "Phase 2: refactor Bucket A core file utilities (F_GET_LCD_OS_FILENAME, F_CHECK_LCD_OS_FILENAME) to call f_path_to_dir_name; add deprecation notes to LCD_FILE_PARAM_TABLE_DDL.sql and LCD_FILE_PARAM_P22_INSERT.sql"
    status: pending
  - id: phase3_bucket_b
    content: "Phase 3: refactor Bucket B wrappers (FILECOPY, GETFILE, FILEEXST, SHRD_BDY) - rewrite every UTL_FILE.FOPEN(path, ...) to UTL_FILE.FOPEN(lcd.f_path_to_dir_name(path), ...) and strip the legacy LCD_FILE_PARAM validation block"
    status: pending
  - id: phase4_bucket_c
    content: "Phase 4: refactor Bucket C high-level scripts (Work_Order_Extract, Alt_Work_Order_Extract, TimeSheetExtractLCD, Sap_Data_Load, sa_notime, Tes_Reports, TIMEDB2, ALL_DEPARTMENTS_BEELINE-proc, 10g_packages) preserving existing path arithmetic"
    status: pending
  - id: phase5_bucket_d
    content: "Phase 5: refactor ~41 Bucket D vestigial readers - remove legacy UTL_FILE_DIR_PATHS lookup loop, replace with single f_path_to_dir_name resolution and DBMS_OUTPUT debug"
    status: pending
  - id: phase6_migration_md
    content: "Phase 6a: write tasks/42-3/plans/v3-opus47/01_oracle_19c_migration_plan.md - full implementation plan with per-file change checklist"
    status: pending
  - id: phase6_deploy_md
    content: "Phase 6b: write tasks/42-3/plans/v3-opus47/02_oracle_19c_deployment_plan.md - step-by-step deployment with expected output, troubleshooting, rollback"
    status: pending
  - id: phase6_test_md
    content: "Phase 6c: write tasks/42-3/plans/v3-opus47/03_oracle_19c_unit_test_plan.md - unit-test harness design (lcd_test.pkg_19c_migration_test), driver script run_unit_tests.sql, pre-flight verify_directory_coverage.sql"
    status: pending
isProject: false
---

# LCD Oracle 11g -> 19c Migration Plan (v3-opus47)

## Scope summary (independent analysis)

- Source: `LCD-Oracle/SQL/` only (per your selection).
- 60 SQL files in scope. They fall into 4 buckets:
  - **(A) Core file utilities** that own the path -> filesystem translation - 7 files.
  - **(B) UTL_FILE wrapper packages** that call `UTL_FILE.FOPEN` with a literal path - 4 files.
  - **(C) High-level scripts** that call `UTL_FILE.FOPEN` directly - 8 files.
  - **(D) Vestigial consumers** that still read `LCD_FILE_PARAM.UTL_FILE_DIR_PATHS` but no longer call FOPEN themselves - ~41 files.
- Reference data: `LCD_ORGPARAM_Q22S-19c-UPDATED.csv` (the post-migration `LCD_SERVER_LOC` values) + `DB_DIRECTORIES.txt` (the 19c directory objects the DBA created) + `LCD_FILE_PARAM-Q22S-11g-Copied.txt` (the legacy 11g CSV being deprecated).

## Critical findings from the data

- `UTL_FILE_DIR` is desupported in 18c+; **every** literal-path FOPEN must be reworked.
- `LCD_FILE_PARAM` row `('UTL_FILE_DIR_PATHS', '...')` will become obsolete after migration; ~50 PL/SQL objects read it.
- **Gap**: `LCD_SERVER_LOC` in the CSV references `Q22S-UK`, `Q22S-Italy`, `Q22S-Nordic`, `Q22S-SAfrica`, `Q22S-Aust`, `Q22S-LatAm`, `Q22S-MidEast` but `DB_DIRECTORIES.txt` only contains directory objects for base, `LCD_149`, `LCD_285`, `LCD_663`, `LCD_CANADA`, `LCD_FEDERAL`. Several regional org paths will resolve to NULL under Option B and must be flagged for DBA action before go-live. (Captured as a UAT pre-requisite, not a code change.)
- `LCD_ORG_PARAM` UAT rows all show `LCD_SERVER_LOC` already set to the Linux path style (`/csclcdnc0002/Q22S...`), so no data normalization is needed in code; the gap is purely the missing directory objects above.

## Approach (chosen): Option B - dynamic `ALL_DIRECTORIES` lookup

- New helper `lcd.f_path_to_dir_name(p_path) RETURN VARCHAR2`:
  - `SELECT directory_name FROM all_directories WHERE UPPER(RTRIM(directory_path,'/\')) = UPPER(RTRIM(p_path,'/\'))`.
  - Returns the DB directory object name (e.g. `LCD_IN`) or NULL with diagnostic `DBMS_OUTPUT`.
- Every `UTL_FILE.FOPEN(<path>, file, mode)` site becomes `UTL_FILE.FOPEN(lcd.f_path_to_dir_name(<path>), file, mode)`.
- The `LCD_FILE_PARAM`/`UTL_FILE_DIR_PATHS` validation block (~41 files) is collapsed to a one-line `f_path_to_dir_name` call returning NULL if not found, eliminating the dependency on the legacy CSV.

## Files to back up and clone (60)

Run a backup step that copies each into both `tasks/42-3/originals/<file>` (pristine) and `tasks/42-3/patched/<file>` (working copy).

**Bucket A - Core file utilities (7):** `F_GET_LCD_OS_FILENAME.sql`, `F_CHECK_LCD_OS_FILENAME.sql`, `LCD_FILE_PARAM_P22_INSERT.sql`, `LCD_FILE_PARAM_TABLE_DDL.sql`, plus one **new** file `F_PATH_TO_DIR_NAME.sql` created in `patched/` only.

**Bucket B - Wrapper packages with direct FOPEN (4):** `FILECOPY.SQL`, `GETFILE.SQL`, `FILEEXST.SQL`, `SHRD_BDY.SQL` (5 FOPEN sites in SHRD_BDY).

**Bucket C - High-level scripts with direct FOPEN (8):** `Work_Order_Extract.sql`, `Alt_Work_Order_Extract.sql`, `TimeSheetExtractLCD.sql`, `Sap_Data_Load.prc`, `sa_notime.sql`, `Tes_Reports.bdy`, `TIMEDB2.SQL`, `ALL_DEPARTMENTS_BEELINE-proc.sql`, `10g_packages.sql`. (9 files; one is the GSAP bundle.)

**Bucket D - Vestigial LCD_FILE_PARAM readers (~41):** `AddPayImp.sql`, `ALTWO_IMP_BODY.sql`, `ATTWAGEMAP_IMP.SQL`, `attabs_imp.sql`, `BATCH.SQL`, `BeelineBusinessAreas.sql`, `BeelineDepartments.sql`, `BLOCIMP.SQL`, `CP100LAB.SQL`, `deptasgmt_imp.sql`, `DLTKINTR.SQL`, `INT800.SQL`, `JKEYIMP.sql`, `lab_impb.sql`, `lab_imps.sql`, `LABCATIM.SQL`, `LABINT.SQL`, `LCD_USER_AUDIT-proc.sql`, `LD_CWF.SQL`, `LD_PRMSN.SQL`, `NAUSD_SUBCON_FEED-proc.sql`, `NPS_Department_Select.sql`, `PAYDB3.SQL`, `paywage_imp.sql`, `PKG_COST.SQL`, `PKGBCOST.SQL`, `PRIWAGE_IMP.SQL`, `SHARED.SQL`, `SHARED1.SQL`, `SHRD_SPC.SQL`, `SUBCO_NOTIME_TERM.sql`, `TIMEDB1.SQL`, `TIMEDB3.SQL`, `TIMEGENWAGE_IMP.SQL`, `TIMEXPR1.SQL`, `TIMEXPR2.SQL`, `TOEATTABSMAP_IMP.SQL`, `UNAPPROVED_HOURS.sql`, `USR11_SUBCON_FEED-proc.sql`, `WAGEDTRATE_IMP.SQL`, `WEEKLY_NPS_EXTRACT-proc.sql`, `Wo_Imp.bdy`, `wrkdb31.sql`, `wrkrRate_imp.sql`, `WrkrWageCtrl_imp.sql`.

## Edit conventions for every patched file

- Every inserted line/block is prefixed by a flowerbox comment whose first line reads exactly:
  `-- RdW 5/24/2026 Oracle 19c Migration <description>`
- For each phase we add DBMS_OUTPUT diagnostics around path / directory variables that can be commented out later, e.g.:
  ```
  -- RdW 5/24/2026 Oracle 19c Migration DEBUG: trace file-system resolution (comment out post-UAT)
  DBMS_OUTPUT.PUT_LINE('[19c-DEBUG] org_code='||p_org_code);
  DBMS_OUTPUT.PUT_LINE('[19c-DEBUG] lcd_server_loc='||l_dir_name);
  DBMS_OUTPUT.PUT_LINE('[19c-DEBUG] computed_path='||filenamepath);
  DBMS_OUTPUT.PUT_LINE('[19c-DEBUG] resolved_dir_name='||l_dir_object);
  ```

## Multi-phased implementation (executes only after you confirm)

- **Phase 0 - Backup & clone**: copy 60 files into `originals/` (read-only baseline) and `patched/` (edit target). Create the new file slot `patched/F_PATH_TO_DIR_NAME.sql`.
- **Phase 1 - New helper**: write `lcd.f_path_to_dir_name` in `patched/F_PATH_TO_DIR_NAME.sql` (Option B lookup against `ALL_DIRECTORIES`).
- **Phase 2 - Refactor Bucket A**: rewrite `F_GET_LCD_OS_FILENAME` and `F_CHECK_LCD_OS_FILENAME` to (a) compute the path identically (so callers see no signature change), (b) optionally also return the directory name via overload/out-parameter, (c) replace the `LCD_FILE_PARAM` validation loop with a single `f_path_to_dir_name` resolution. Keep `LCD_FILE_PARAM_TABLE_DDL.sql` unchanged but add a deprecation header. Update `LCD_FILE_PARAM_P22_INSERT.sql` to insert the Q22S directory list as INFO/deprecated.
- **Phase 3 - Refactor Bucket B** (4 wrappers, ~13 FOPEN sites): rewrite each FOPEN to `UTL_FILE.FOPEN(lcd.f_path_to_dir_name(l_dir_name), file, mode)`. Strip the local `LCD_FILE_PARAM` lookup loop. Preserve all exception handlers.
- **Phase 4 - Refactor Bucket C** (8 files, ~10 FOPEN sites): same FOPEN rewrite. For `Tes_Reports.bdy` (which strips the trailing slash) and `ALL_DEPARTMENTS_BEELINE-proc.sql` (which appends `/Out`), preserve the existing path arithmetic and translate the final string at FOPEN.
- **Phase 5 - Refactor Bucket D** (~41 vestigial): remove the `Select value into utlfpaths from LCD.lcd_file_param ...` block and the CONNECT-BY case-fix loop. Replace with a single call `l_dir_name := lcd.f_path_to_dir_name(filenamepath); IF l_dir_name IS NULL THEN <log/raise>; END IF;`. Most of these files compute a path but never FOPEN; keep the variable so downstream behaviour is preserved.
- **Phase 6 - Deliverable markdown plans**: create the three deliverable docs in `tasks/42-3/plans/v3-opus47/`:
  - `01_oracle_19c_migration_plan.md` (mirror this plan + per-file change checklist).
  - `02_oracle_19c_deployment_plan.md` (DBA pre-reqs, compile order, smoke tests, rollback).
  - `03_oracle_19c_unit_test_plan.md` (test harness design + per-file test cases).

## Compile order for deployment (preview)

```
1. F_PATH_TO_DIR_NAME.sql              (no deps)
2. F_GET_LCD_OS_FILENAME.sql           (depends on #1)
3. F_CHECK_LCD_OS_FILENAME.sql         (depends on #1)
4. FILECOPY.SQL, GETFILE.SQL, FILEEXST.SQL, SHRD_BDY.SQL
5. Bucket C scripts (8)
6. Bucket D scripts (41)
```

## Unit-test harness (preview)

- New PL/SQL package `lcd_test.pkg_19c_migration_test` in `patched/` (lightweight, no framework dep) with one test procedure per touchpoint:
  - `t_path_to_dir_name_known_path` / `t_path_to_dir_name_unknown` / `t_path_to_dir_name_case_insensitive`.
  - `t_get_lcd_os_filename_org` / `t_get_lcd_os_filename_by_server_loc` / `t_get_lcd_os_filename_archive`.
  - `t_check_lcd_os_filename_*`.
  - End-to-end: `t_fopen_in`, `t_fopen_out`, `t_file_exists_yes`, `t_file_exists_no`.
- A driver script `run_unit_tests.sql` enables `SERVEROUTPUT`, executes all `t_*` procs, prints PASS/FAIL with the `[19c-DEBUG]` traces.
- A pre-flight SQL `verify_directory_coverage.sql` reports any `LCD_SERVER_LOC` (and `/IN`, `/OUT`, `/ARCHIVE/IN`, `/ARCHIVE/OUT` variants) that have no matching row in `ALL_DIRECTORIES` - this is the operational gate before code is deployed.