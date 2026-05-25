# Oracle 19c Migration — Simulated Code Changes

**Author:** RdW (simulated by Cursor)  
**Date:** 5/24/2026  
**Status:** Simulation only — no source files were modified  
**Basis:** [MIGRATION_CHANGELOG.md](MIGRATION_CHANGELOG.md), [oracle_19c_lcd_migration_plan[cursor-composer25].md](oracle_19c_lcd_migration_plan[cursor-composer25].md)  
**Target layout (when applied):** `tasks/42-3/patched/` mirroring `LCD-Oracle/SQL/` and `LCD-Oracle/SQL (WOA)/`

---

## 1. Purpose

This document simulates every code change specified in the migration plan. Each section shows **current 11g behavior** (from `LCD-Oracle/`), the **simulated 19c patch**, and notes on impact. All injections use the standard RdW flowerbox comment block.

**Convention used throughout:**

```sql
-- ===========================================================================
-- RdW 5/24/2026 Oracle 19c Migration - [description of change]
-- ===========================================================================
```

---

## 2. Summary

| Tier | Files | Simulated action |
|------|-------|------------------|
| A — New scripts | 2 | Create `F_GET_19C_DIR_NAME.sql`, `GRANT_DIRECTORY_ACCESS.sql` |
| B — Core resolver / I/O | 7 | Return DIRECTORY names; restore missing FOPEN; debug output |
| C — Direct FOPEN callers | 16 | Remove `LCD_FILE_PARAM` loops; resolve paths before FOPEN |
| D — SAP group | 3 | Document `p_dir` semantic change; inherit resolver |
| E — WOA scheduler | 2 | `DBMS_JOB` → `DBMS_SCHEDULER` |
| F — Deprecation comments | 2 | Header comments only |
| G — Indirect (~24) | — | No patch; inherit Tier B via `lcd.shared.f_open_*` |

---

## 3. Tier A — New Scripts

### A-1. `patched/SQL/F_GET_19C_DIR_NAME.sql` [CREATE]

**Purpose:** Map a filesystem path to an Oracle DIRECTORY object name via `ALL_DIRECTORIES`.

**Simulated full script:**

```sql
-- ===========================================================================
-- RdW 5/24/2026 Oracle 19c Migration - Bridge function: path to DIRECTORY name
-- ===========================================================================
CREATE OR REPLACE FUNCTION lcd.f_get_19c_dir_name(
    a_path IN VARCHAR2)
    RETURN VARCHAR2 IS
    l_path_clean VARCHAR2(4000);
    l_dir_name   VARCHAR2(128);
BEGIN
    IF a_path IS NULL THEN
        RETURN NULL;
    END IF;

    -- Strip trailing slash or backslash
    l_path_clean := RTRIM(a_path, '/\');

    BEGIN
        SELECT directory_name
          INTO l_dir_name
          FROM all_directories
         WHERE UPPER(directory_path) = UPPER(l_path_clean);

        DBMS_OUTPUT.PUT_LINE('-- DEBUG [RdW 19c] a_path=' || a_path ||
          ' l_path_clean=' || l_path_clean ||
          ' directory_obj=' || l_dir_name);
        RETURN l_dir_name;

    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            DBMS_OUTPUT.PUT_LINE('-- DEBUG [RdW 19c] a_path=' || a_path ||
              ' l_path_clean=' || l_path_clean ||
              ' directory_obj=NULL (not in ALL_DIRECTORIES)');
            RETURN NULL;
    END;
END f_get_19c_dir_name;
/
SHOW ERRORS
```

**Smoke test:** `SELECT lcd.f_get_19c_dir_name('/csclcdnc0002/Q22S/In') FROM dual;` → `LCD_IN`

---

### A-2. `patched/SQL/GRANT_DIRECTORY_ACCESS.sql` [CREATE]

**Purpose:** DBA script (run as SYS) granting READ/WRITE on UAT DIRECTORY objects to schema LCD.

**Simulated script (UAT Q22S objects from `uat/DB_DIRECTORIES.txt` lines 44–78):**

```sql
-- ===========================================================================
-- RdW 5/24/2026 Oracle 19c Migration - Grant DIRECTORY access to LCD schema
-- Run as SYS or user with GRANT ANY OBJECT PRIVILEGE
-- ===========================================================================
GRANT READ, WRITE ON DIRECTORY LCD              TO LCD;
GRANT READ, WRITE ON DIRECTORY LCD_IN           TO LCD;
GRANT READ, WRITE ON DIRECTORY LCD_OUT          TO LCD;
GRANT READ, WRITE ON DIRECTORY LCD_ARCH         TO LCD;
GRANT READ, WRITE ON DIRECTORY LCD_ARCH_IN      TO LCD;
GRANT READ, WRITE ON DIRECTORY LCD_ARCH_OUT     TO LCD;
GRANT READ, WRITE ON DIRECTORY LCD_149           TO LCD;
GRANT READ, WRITE ON DIRECTORY LCD_149_IN        TO LCD;
GRANT READ, WRITE ON DIRECTORY LCD_149_OUT       TO LCD;
GRANT READ, WRITE ON DIRECTORY LCD_149_ARCH      TO LCD;
GRANT READ, WRITE ON DIRECTORY LCD_149_ARCH_IN   TO LCD;
GRANT READ, WRITE ON DIRECTORY LCD_149_ARCH_OUT  TO LCD;
GRANT READ, WRITE ON DIRECTORY LCD_285_IN        TO LCD;
GRANT READ, WRITE ON DIRECTORY LCD_285_OUT       TO LCD;
GRANT READ, WRITE ON DIRECTORY LCD_285_ARCH      TO LCD;
GRANT READ, WRITE ON DIRECTORY LCD_285_ARCH_IN   TO LCD;
GRANT READ, WRITE ON DIRECTORY LCD_285_ARCH_OUT  TO LCD;
GRANT READ, WRITE ON DIRECTORY LCD_663           TO LCD;
GRANT READ, WRITE ON DIRECTORY LCD_663_IN        TO LCD;
GRANT READ, WRITE ON DIRECTORY LCD_663_OUT       TO LCD;
GRANT READ, WRITE ON DIRECTORY LCD_663_ARCH      TO LCD;
GRANT READ, WRITE ON DIRECTORY LCD_663_ARCH_IN   TO LCD;
GRANT READ, WRITE ON DIRECTORY LCD_663_ARCH_OUT  TO LCD;
GRANT READ, WRITE ON DIRECTORY LCD_FEDERAL_IN    TO LCD;
GRANT READ, WRITE ON DIRECTORY LCD_FEDERAL_OUT   TO LCD;
GRANT READ, WRITE ON DIRECTORY LCD_FEDERAL_ARCH  TO LCD;
GRANT READ, WRITE ON DIRECTORY LCD_FEDERAL_ARCH_IN  TO LCD;
GRANT READ, WRITE ON DIRECTORY LCD_FEDERAL_ARCH_OUT TO LCD;
GRANT READ, WRITE ON DIRECTORY LCD_CANADA_IN     TO LCD;
GRANT READ, WRITE ON DIRECTORY LCD_CANADA_OUT    TO LCD;
GRANT READ, WRITE ON DIRECTORY LCD_CANADA_ARCH   TO LCD;
GRANT READ, WRITE ON DIRECTORY LCD_CANADA_ARCH_IN  TO LCD;
GRANT READ, WRITE ON DIRECTORY LCD_CANADA_ARCH_OUT TO LCD;
-- DBA: add regional DIRECTORY objects (UK, Nordic, MidEast, LatAm, Italy, SAfrica) when created
```

---

## 4. Tier B — Core Resolver and I/O Wrappers

### B-1. `LCD-Oracle/SQL/F_GET_LCD_OS_FILENAME.sql`

**11g return semantics:** Returns filesystem path string (validated against `LCD_FILE_PARAM`).

**Simulated patch — variable declaration (after line 27):**

```sql
    l_dir_name_19c VARCHAR2(128);  -- RdW 19c: resolved DIRECTORY object name
```

**Simulated patch — replace lines 65–87 (LCD_FILE_PARAM loop + RETURN):**

```sql
      -- ===========================================================================
      -- RdW 5/24/2026 Oracle 19c Migration - Resolve path to DIRECTORY object name
      -- Return value semantic change: DIRECTORY name (e.g. LCD_IN), not path string
      -- ===========================================================================

      /* 11g rollback reference - LCD_FILE_PARAM validation loop
      Select value into utlfpaths from LCD.lcd_file_param where type = 'UTL_FILE_DIR_PATHS';
      FOR fp IN (SELECT trim(regexp_substr(utlfpaths, '[^,]+', 1, LEVEL)) paths FROM dual
        CONNECT BY LEVEL <= regexp_count(utlfpaths, ',')+1)
      LOOP
        IF UPPER(filenamepath) = UPPER(fp.paths) THEN
              ispathfound := 1;
              fopenpath := fp.paths;
        END IF;
        EXIT WHEN ispathfound = 1;
      END LOOP;
      */

      l_dir_name_19c := lcd.f_get_19c_dir_name(fopenpath);

      DBMS_OUTPUT.PUT_LINE('-- DEBUG [RdW 19c] org=' || a_org_code ||
        ' lcd_server_loc=' || lFileDir ||
        ' resolved_path=' || fopenpath ||
        ' directory_obj=' || l_dir_name_19c);

      IF l_dir_name_19c IS NOT NULL THEN
          RETURN l_dir_name_19c;
      ELSE
          RETURN fopenpath;  -- diagnostic fallback when DIRECTORY not found
      END IF;
```

**Impact:** All callers (`SHRD_BDY`, `BATCH`, `TIMEDB2`, `Sap_Submit_Data_Load`, ~24 imports via shared) receive DIRECTORY names automatically.

---

### B-2. `LCD-Oracle/SQL/F_CHECK_LCD_OS_FILENAME.sql`

**Simulated patch — replace lines 70–93:**

```sql
      -- ===========================================================================
      -- RdW 5/24/2026 Oracle 19c Migration - Validate via ALL_DIRECTORIES lookup
      -- ===========================================================================

      /* 11g rollback reference
      Select value into utlfpaths from LCD.lcd_file_param where type = 'UTL_FILE_DIR_PATHS';
      ... (CONNECT BY loop) ...
      RETURN ispathfoundrtn;
      */

      l_dir_name_19c := lcd.f_get_19c_dir_name(fopenpath);

      DBMS_OUTPUT.PUT_LINE('-- DEBUG [RdW 19c] org=' || a_org_code ||
        ' resolved_path=' || fopenpath ||
        ' directory_obj=' || l_dir_name_19c);

      IF l_dir_name_19c IS NOT NULL THEN
          RETURN TRUE;
      ELSE
          RETURN FALSE;
      END IF;
```

**Add variable:** `l_dir_name_19c VARCHAR2(128);`

---

### B-3. `LCD-Oracle/SQL/FILEEXST.SQL` — `lcd.f_file_exist`

**Current FOPEN (line 97):** Uses path string in `l_dir_name`.

**Simulated patch — after LCD_FILE_PARAM loop (before NULL check):**

```sql
    -- ===========================================================================
    -- RdW 5/24/2026 Oracle 19c Migration - Resolve OUT path to DIRECTORY name
    -- ===========================================================================
    l_dir_name_19c := lcd.f_get_19c_dir_name(l_dir_name);

    DBMS_OUTPUT.PUT_LINE('-- DEBUG [RdW 19c] org=' || a_org ||
      ' resolved_path=' || l_dir_name ||
      ' directory_obj=' || l_dir_name_19c);

    IF l_dir_name_19c IS NULL THEN
        RETURN -3;
    END IF;
```

**Simulated patch — line 97:**

```sql
        -- BEFORE: l_handle := UTL_FILE.FOPEN(l_dir_name, a_file_name, 'r');
        l_handle := UTL_FILE.FOPEN(l_dir_name_19c, a_file_name, 'r');
```

---

### B-4. `LCD-Oracle/SQL/FILECOPY.SQL` — `lcd.CopyFile.f_open_out_file`

**Known 11g defect:** Path resolved into `l_dir_name` but FOPEN never called (lines 117–123 return TRUE without opening).

**Simulated patch — after path resolution loop:**

```sql
    -- ===========================================================================
    -- RdW 5/24/2026 Oracle 19c Migration - Resolve IN path; restore missing FOPEN
    -- ===========================================================================
    l_dir_name_19c := lcd.f_get_19c_dir_name(l_dir_name);

    DBMS_OUTPUT.PUT_LINE('-- DEBUG [RdW 19c] org=' || p_org_code ||
      ' resolved_path=' || l_dir_name ||
      ' directory_obj=' || l_dir_name_19c);

    IF l_dir_name_19c IS NULL THEN
        dbms_output.put_line('f_open_out_file: DIRECTORY not resolved');
        RETURN FALSE;
    END IF;

    p_file_handle := UTL_FILE.FOPEN(l_dir_name_19c, RTRIM(p_out_file_name), 'w');
```

---

### B-5. `LCD-Oracle/SQL/GETFILE.SQL` — `lcd.GetFile.f_open_in_file`

**Current (lines 279–298):** Inline `LCD_FILE_PARAM` CONNECT BY loop; FOPEN with path.

**Simulated patch — replace lines 279–298:**

```sql
    -- ===========================================================================
    -- RdW 5/24/2026 Oracle 19c Migration - Use central resolver for DIRECTORY name
    -- ===========================================================================
    l_dir_name := lcd.f_get_19c_dir_name(filenamepath);

    DBMS_OUTPUT.PUT_LINE('-- DEBUG [RdW 19c] org=' || p_org_code ||
      ' resolved_path=' || filenamepath ||
      ' directory_obj=' || l_dir_name);

    IF l_dir_name IS NULL THEN
        dbms_output.put_line('f_open_in_file: DIRECTORY not resolved for org ' || p_org_code);
        RETURN FALSE;
    END IF;

    p_file_handle := UTL_FILE.FOPEN(l_dir_name, RTRIM(p_in_file_name), 'r');
```

---

### B-6. `LCD-Oracle/SQL/SHRD_BDY.SQL` — `lcd.shared`

**Logic change:** Minimal — inherits B-1 automatically. FOPEN calls at lines 465–466, 562–563, 645–646 already use `f_get_lcd_os_filename` result.

**Simulated patch — after each resolver call (example: `f_open_in_file` 3-param, line 465):**

```sql
    l_dir_name := lcd.f_get_lcd_os_filename(p_org_code, null, 'IN', FALSE);

    -- ===========================================================================
    -- RdW 5/24/2026 Oracle 19c Migration - Debug DIRECTORY resolution
    -- ===========================================================================
    DBMS_OUTPUT.PUT_LINE('-- DEBUG [RdW 19c] org=' || p_org_code ||
      ' stub=IN directory_obj=' || l_dir_name);

    p_file_handle := UTL_FILE.FOPEN(l_dir_name, RTRIM(p_in_file_name), 'r');
```

**Simulated patch — error message (line 479):**

```sql
        -- BEFORE: 'UTL_FILE.INVALID_PATH: Directory not in UTL_FILE_DIR or path invalid'
        dbms_output.put_line('UTL_FILE.INVALID_PATH: DIRECTORY object invalid or not granted to LCD');
```

**Downstream:** ~24 import modules inherit fix without direct patch.

---

### B-7. `LCD-Oracle/SQL/BATCH.SQL`

**Logic change:** Minimal — all resolver call sites inherit B-1. Debug output added at each site.

**Simulated patch — example at `fExists` (after line 30):**

```sql
        -- ===========================================================================
        -- RdW 5/24/2026 Oracle 19c Migration - Debug DIRECTORY resolution
        -- ===========================================================================
        DBMS_OUTPUT.PUT_LINE('-- DEBUG [RdW 19c] fExists org=' || P_ORG_CODE ||
          ' in_out=' || P_IN_OUT || ' directory_obj=' || l_location);
```

**Verification note:** `fArchiveFile` calls `f_get_lcd_os_filename(null, P_DIR_NAME, null, TRUE)` — confirm archive DIRECTORY objects (`LCD_ARCH_IN`, `LCD_FEDERAL_ARCH_IN`, etc.) exist in `ALL_DIRECTORIES`.

---

## 5. Tier C — Direct FOPEN Callers

**Common pattern applied to C-2 through C-15:**

1. Remove `SELECT value ... FROM lcd.lcd_file_param WHERE type = 'UTL_FILE_DIR_PATHS'` CONNECT BY loop  
2. Keep path construction from `ORG_PARAM.LCD_SERVER_LOC` + stub  
3. Resolve: `v_dir_name := lcd.f_get_19c_dir_name(v_path)`  
4. Pass `v_dir_name` to FOPEN  
5. Add debug output  

---

### C-1. `LCD-Oracle/SQL/TIMEDB2.SQL`

**Current (lines 738–739):** Already uses `f_get_lcd_os_filename` before FOPEN.

**Simulated patch — debug only:**

```sql
    l_dir_name := lcd.f_get_lcd_os_filename(p_org_code, null, 'IN', FALSE);
    DBMS_OUTPUT.PUT_LINE('-- DEBUG [RdW 19c] TIMEDB2 org=' || p_org_code ||
      ' directory_obj=' || l_dir_name);
    p_file_handle := UTL_FILE.FOPEN(l_dir_name, RTRIM(p_in_file_name), 'r');
```

---

### C-2. `LCD-Oracle/SQL/UNAPPROVED_HOURS.sql`

**Current (lines 315–335):** LCD_FILE_PARAM loop; two FOPEN calls for output files.

**Simulated patch — replace loop (lines 315–329):**

```sql
    -- ===========================================================================
    -- RdW 5/24/2026 Oracle 19c Migration - Resolve OUT path to DIRECTORY name
    -- ===========================================================================
    svr_path := lcd.f_get_19c_dir_name(filenamepath);

    DBMS_OUTPUT.PUT_LINE('-- DEBUG [RdW 19c] org=' || pi_org ||
      ' resolved_path=' || filenamepath ||
      ' directory_obj=' || svr_path);

    IF svr_path IS NULL THEN
        RAISE_APPLICATION_ERROR(-20001, 'UNAPPROVED_HOURS: DIRECTORY not resolved for org ' || pi_org);
    END IF;
```

**FOPEN calls (lines 335, ~390):** Unchanged signature — `svr_path` now holds DIRECTORY name.

---

### C-3. `LCD-Oracle/SQL/Alt_Work_Order_Extract.sql`

**Simulated patch — `FOpenOutputFile` (line 134):**

```sql
    -- ===========================================================================
    -- RdW 5/24/2026 Oracle 19c Migration - FOPEN via DIRECTORY name
    -- ===========================================================================
    pOF_handle := UTL_FILE.FOPEN(lcd.f_get_19c_dir_name(pOF_dir), pOF_file, 'w');
```

**Simulated patch — main block (~line 335):** Remove LCD_FILE_PARAM loop; resolve `svr_path` via `f_get_19c_dir_name` before passing to `FOpenOutputFile`.

---

### C-4. `LCD-Oracle/SQL/Work_Order_Extract.sql`

Same pattern as C-3.

---

### C-5. `LCD-Oracle/SQL/BeelineBusinessAreas.sql`

Remove LCD_FILE_PARAM loop; resolve path; FOPEN with DIRECTORY name; debug output.

---

### C-6. `LCD-Oracle/SQL/BeelineDepartments.sql`

Same pattern as C-5.

---

### C-7. `LCD-Oracle/SQL/ALL_DEPARTMENTS_BEELINE-proc.sql`

**Current (line 68):** `UTL_FILE.FOPEN(svr_path||'/Out', file_out, 'w')`

**Simulated patch:**

```sql
    -- ===========================================================================
    -- RdW 5/24/2026 Oracle 19c Migration - Resolve OUT directory before FOPEN
    -- ===========================================================================
    v_dir_name := lcd.f_get_19c_dir_name(svr_path || '/Out');

    DBMS_OUTPUT.PUT_LINE('-- DEBUG [RdW 19c] svr_path=' || svr_path ||
      ' directory_obj=' || v_dir_name);

    fh := UTL_FILE.FOPEN(v_dir_name, file_out, 'w');
```

**Note:** Line 105 `LCD.ServerFileCopy` passes `svr_path` — inherits B-7 DIRECTORY handling after BATCH patch.

---

### C-8. `LCD-Oracle/SQL/NAUSD_SUBCON_FEED-proc.sql`

**Known 11g defect (line 166):** `svr_path||'\OUT'` doubles OUT suffix on Linux path.

**Current:**

```sql
       fh := utl_file.fopen(svr_path||'\OUT', file_out,'w');
```

**Simulated patch — replace lines 145–166:**

```sql
    -- ===========================================================================
    -- RdW 5/24/2026 Oracle 19c Migration - Remove LCD_FILE_PARAM loop and \OUT bug
    -- svr_path already contains full OUT path from line 133
    -- ===========================================================================
    svr_path := lcd.f_get_19c_dir_name(filenamepath);

    DBMS_OUTPUT.PUT_LINE('-- DEBUG [RdW 19c] org=' || l_org ||
      ' resolved_path=' || filenamepath ||
      ' directory_obj=' || svr_path);

    IF svr_path IS NULL THEN
        RAISE_APPLICATION_ERROR(-20001, 'NAUSD_SUBCON_FEED: DIRECTORY not resolved');
    END IF;

       file_out := file_nme || '_' ||to_char(sysdate,'yyyymmdd')||'.TXT';
       rec_count := 0;
       dbms_output.put_line('   Start: '||to_char(sysdate,'dd mon yyyy hh:mi:ss'));
       fh := utl_file.fopen(svr_path, file_out, 'w');
```

---

### C-9. `LCD-Oracle/SQL/USR11_SUBCON_FEED-proc.sql`

Same pattern as C-8. **Security note:** outputs unmasked `WORKER_SSN` — restrict OS-level permissions on OUT directory.

---

### C-10. `LCD-Oracle/SQL/sa_notime.sql`

**Current (line 53):** `UTL_FILE.FOPEN(pOF_dir, pOF_file, 'w')` — `pOF_dir` is job submit parameter.

**Simulated patch:**

```sql
FUNCTION fOpenNoTimeOutputFile (pOF_dir  IN VARCHAR2,
            pOF_file   IN VARCHAR2,
            pOF_handle OUT UTL_FILE.FILE_TYPE) RETURN BOOLEAN IS
    l_dir_name VARCHAR2(128);
BEGIN
    -- ===========================================================================
    -- RdW 5/24/2026 Oracle 19c Migration - pOF_dir must be DIRECTORY name or resolvable path
    -- ===========================================================================
    l_dir_name := lcd.f_get_19c_dir_name(pOF_dir);

    DBMS_OUTPUT.PUT_LINE('-- DEBUG [RdW 19c] pOF_dir=' || pOF_dir ||
      ' directory_obj=' || l_dir_name);

    IF l_dir_name IS NULL THEN
        RETURN FALSE;
    END IF;

    pOF_handle := UTL_FILE.FOPEN(l_dir_name, pOF_file, 'w');
    RETURN TRUE;
```

**Deployment note:** Job definitions calling `sa_notime` must pass DIRECTORY name, not Windows path.

---

### C-11. `LCD-Oracle/SQL/SUBCO_NOTIME_TERM.sql`

Remove LCD_FILE_PARAM loop (lines 347–410 area); resolve `svr_path`; debug output.

---

### C-12. `LCD-Oracle/SQL/LCD_USER_AUDIT-proc.sql`

Remove LCD_FILE_PARAM loop (lines 84–107); resolve path; debug output.

---

### C-13. `LCD-Oracle/SQL/NPS_Department_Select.sql`

**Known 11g defect (lines 60–68):** Windows `\OUT` on Linux path.

**Current:**

```sql
    Select LCD_SERVER_LOC  || '\OUT' into svr_path 
    FROM LCD.ORG_PARAM ...
       fh := utl_file.fopen(svr_path, file_out, 'w');
```

**Simulated patch:**

```sql
    -- ===========================================================================
    -- RdW 5/24/2026 Oracle 19c Migration - Use resolver for org OUT directory
    -- ===========================================================================
    svr_path := lcd.f_get_lcd_os_filename(
        (SELECT SYSTEM_CODE FROM LCD.SUPPORT_SYSTEMS
          WHERE SYSTEM_TYPE = 'NPSORG' AND SYSTEM_DESC = 'COMET' AND ROWNUM = 1),
        NULL, 'OUT', FALSE);

    DBMS_OUTPUT.PUT_LINE('-- DEBUG [RdW 19c] NPS directory_obj=' || svr_path);

       fh := utl_file.fopen(svr_path, file_out, 'w');
```

---

### C-14. `LCD-Oracle/SQL/WEEKLY_NPS_EXTRACT-proc.sql`

Same pattern as C-12 (LCD_FILE_PARAM loop at lines 86–109).

---

### C-15. `LCD-Oracle/SQL/TimeSheetExtractLCD.sql`

Remove LCD_FILE_PARAM loop; resolve `l_FileDir` via `f_get_19c_dir_name` before FOPEN.

---

### C-16. `LCD-Oracle/SQL/Tes_Reports.bdy` — `lcd.tes_reports`

**Most complex file.** Multiple FOPEN sites use raw path manipulation.

#### `OPEN_OUTPUT_FILE` (line 344)

**Current:**

```sql
p_file_handle := UTL_FILE.FOPEN(substr(p_dir_name,1,length(p_dir_name)-1), p_file_name, 'w');
```

**Simulated patch:**

```sql
    -- ===========================================================================
    -- RdW 5/24/2026 Oracle 19c Migration - Remove substr path hack; use DIRECTORY name
    -- ===========================================================================
    l_dir_name_19c := lcd.f_get_19c_dir_name(RTRIM(p_dir_name, '/\'));

    DBMS_OUTPUT.PUT_LINE('-- DEBUG [RdW 19c] OPEN_OUTPUT_FILE p_dir_name=' || p_dir_name ||
      ' directory_obj=' || l_dir_name_19c);

    IF l_dir_name_19c IS NULL THEN
        RETURN FALSE;
    END IF;

    p_file_handle := UTL_FILE.FOPEN(l_dir_name_19c, p_file_name, 'w');
```

#### `OPEN_WIN_OUTPUT_FILE` (line 442)

Same patch as `OPEN_OUTPUT_FILE`.

#### `CREATE_CONTROL_FILE` (line 733)

**Current:**

```sql
hcfile := UTL_FILE.FOPEN(substr(g_org_param_data.lcd_server_loc,1,length(...)-1), ctl_file, 'w');
```

**Simulated patch:**

```sql
    l_dir_name_19c := lcd.f_get_lcd_os_filename(g_org_param_data.org_code, NULL, 'OUT', FALSE);
    hcfile := UTL_FILE.FOPEN(l_dir_name_19c, ctl_file, 'w');
```

#### Call sites (~lines 850–1686)

Callers passing `g_org_param_data.lcd_server_loc` to `OPEN_WIN_OUTPUT_FILE` should pass org-resolved OUT path or org code for internal resolution. `ADD_SERVER_SUBDIR` path appending becomes unnecessary at FOPEN sites when using `f_get_lcd_os_filename(org, NULL, 'OUT', FALSE)`.

---

## 6. Tier D — SAP Atomic Group

Deploy all three together in one maintenance window.

---

### D-1. `LCD-Oracle/SQL/Sap_Data_Load.prc`

**Breaking change:** `p_dir` parameter to `FOpenInputFile` must be DIRECTORY object name, not filesystem path.

**Simulated patch — `FOpenInputFile` (before line 396):**

```sql
    -- ===========================================================================
    -- RdW 5/24/2026 Oracle 19c Migration - pOFDir must be Oracle DIRECTORY name
    -- ===========================================================================
    DBMS_OUTPUT.PUT_LINE('-- DEBUG [RdW 19c] FOpenInputFile pOFDir=' || pOFDir ||
      ' pOFFile=' || pOFFile);

    -- Optional validation:
    -- IF lcd.f_get_19c_dir_name(
    --      (SELECT directory_path FROM all_directories WHERE directory_name = pOFDir)) IS NULL
    -- THEN RETURN FALSE; END IF;

    pOFHandle := UTL_FILE.FOPEN(pOFDir, pOFFile, 'r');
```

---

### D-2. `LCD-Oracle/SQL/Sap_Submit_Data_Load.prc`

**Current (line 51):** `pRSPDir := lcd.f_get_lcd_os_filename(trim(p_org), null, 'IN', FALSE);`

**Simulated patch — comment + debug (inherits B-1):**

```sql
        -- ===========================================================================
        -- RdW 5/24/2026 Oracle 19c Migration - pRSPDir is now DIRECTORY name (e.g. LCD_IN)
        -- ===========================================================================
        ispathfound := lcd.f_check_lcd_os_filename(trim(p_org), null, 'IN', FALSE);

        IF (ispathfound) THEN
             pRSPDir := lcd.f_get_lcd_os_filename(trim(p_org), null, 'IN', FALSE);
             DBMS_OUTPUT.PUT_LINE('-- DEBUG [RdW 19c] SAP org=' || p_org ||
               ' directory_obj=' || pRSPDir);
             RETURN TRUE;
```

---

### D-3. `LCD-Oracle/SQL/Sap_Auto_Load.prc`

**Current:** Already uses `DBMS_SCHEDULER.CREATE_JOB` (line 58).

**Simulated patch — debug after job creation:**

```sql
    DBMS_OUTPUT.PUT_LINE('-- DEBUG [RdW 19c] Sap_Auto_Load org=' || p_org ||
      ' job_name=' || jobname);
```

---

## 7. Tier E — WOA DBMS_JOB → DBMS_SCHEDULER

### E-1. `LCD-Oracle/SQL (WOA)/Step3_LCDInterface_Refresh.sql`

**Current (line 62):**

```sql
     dbms_job.submit(job#, job_to_do, SYSDATE, l_interval, false);
```

**Simulated patch:**

```sql
     -- job# BINARY_INTEGER;  -- 11g reference; retained commented

     -- ===========================================================================
     -- RdW 5/24/2026 Oracle 19c Migration - DBMS_JOB replaced by DBMS_SCHEDULER
     -- ===========================================================================
     l_job_name := 'WOAREFRESH_' || rec.organizationid || '_' ||
                   TO_CHAR(SYSDATE, 'YYYYMMDDHH24MISS');

     DBMS_SCHEDULER.CREATE_JOB(
         job_name   => l_job_name,
         job_type   => 'PLSQL_BLOCK',
         job_action => 'BEGIN ' || job_to_do || ' END;',
         start_date => SYSTIMESTAMP,
         enabled    => TRUE,
         auto_drop  => TRUE);

     DBMS_OUTPUT.PUT_LINE('-- DEBUG [RdW 19c] WOA refresh org=' || rec.organizationid ||
       ' job_name=' || l_job_name);
```

**Add variable:** `l_job_name VARCHAR2(128);`

---

### E-2. `LCD-Oracle/SQL (WOA)/Step4_LCDInterface_ScheduleRefresh.sql`

**Current (lines 11, 17):**

```sql
  dbms_job.submit(job#, job_to_do, TRUNC(SYSDATE + 1/24), 'TRUNC(SYSDATE + 4/24,''HH'')', false);
  ...
  dbms_job.run(job#);
```

**Simulated patch:**

```sql
DECLARE
  -- job# binary_integer;  -- 11g reference
  l_job_name VARCHAR2(128) := 'LCD_WOA_REFRESH_SCHED';
  job_to_do  VARCHAR2(50) := 'LCD.LCDINTERFACEREFRESH;';
BEGIN
  -- ===========================================================================
  -- RdW 5/24/2026 Oracle 19c Migration - 4-hour recurring DBMS_SCHEDULER job
  -- ===========================================================================
  DBMS_SCHEDULER.CREATE_JOB(
      job_name        => l_job_name,
      job_type        => 'PLSQL_BLOCK',
      job_action      => 'BEGIN ' || job_to_do || ' END;',
      start_date      => TRUNC(SYSDATE + 1/24),
      repeat_interval => 'FREQ=HOURLY;INTERVAL=4',
      enabled         => TRUE,
      auto_drop       => FALSE);

  DBMS_OUTPUT.PUT_LINE('-- DEBUG [RdW 19c] WOA schedule job_name=' || l_job_name);

  DBMS_SCHEDULER.RUN_JOB(l_job_name, use_current_session => FALSE);
END;
/
```

---

## 8. Tier F — Deprecation Comments

### F-1. `LCD-Oracle/SQL/LCD_FILE_PARAM_TABLE_DDL.sql`

**Simulated patch — prepend header:**

```sql
-- ===========================================================================
-- RdW 5/24/2026 Oracle 19c Migration - DEPRECATED for path validation
-- Table retained for audit/history. UTL_FILE_DIR_PATHS type obsolete in 19c.
-- Path validation now via ALL_DIRECTORIES and lcd.f_get_19c_dir_name().
-- ===========================================================================
CREATE TABLE LCD_FILE_PARAM ...
```

---

### F-2. `LCD-Oracle/SQL/LCD_FILE_PARAM_P22_INSERT.sql`

**Simulated patch — prepend header:**

```sql
-- ===========================================================================
-- RdW 5/24/2026 Oracle 19c Migration - 11g seed data only
-- Do NOT deploy UTL_FILE_DIR_PATHS insert to 19c UAT.
-- DIRECTORY objects replace this mechanism. See GRANT_DIRECTORY_ACCESS.sql.
-- ===========================================================================
REM INSERTING into LCD_FILE_PARAM
```

---

## 9. Files Not Patched (Tier G and Skipped)

| File / group | Reason |
|--------------|--------|
| `wo_imps.sql`, `lab_imps.sql`, `LABINT.SQL`, `LD_CWF.SQL`, wage imports, etc. | Call `lcd.shared.f_open_in_file` / `f_open_out_file` — inherit B-6 |
| `SQL (CPI)/*`, `SQL (UK-I)/LABINT_SSN_For_UK.SQL` | Same — delegate to SHARED |
| `10g_packages.sql`, `LCD-Oracle/Packages/*` | Historical archive |
| `XFileCopy.sql`, `XFileMove.sql`, `XFileInfo.sql` | External C library, not UTL_FILE |
| `NPS_Departments_Job_Scheduler - FOR Q22.sql` | Obsolete hardcoded Windows path |
| `BATCH2.SQL` | DBMS_JOB commented out — no action |
| `NPS_Departments_Job_Scheduler.sql` | Already uses DBMS_SCHEDULER |

---

## 10. Compile Order (when patches are applied)

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

## 11. Verification Smoke Tests

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

## 12. Known Defects Fixed by Simulation

| File | 11g defect | Simulated fix |
|------|-----------|---------------|
| `FILECOPY.SQL` | `f_open_out_file` resolves path but never calls FOPEN | Restore FOPEN with DIRECTORY name |
| `NAUSD_SUBCON_FEED-proc.sql` | `svr_path||'\OUT'` doubles OUT on Linux | Remove `\OUT` suffix |
| `USR11_SUBCON_FEED-proc.sql` | Same `\OUT` suffix bug | Same fix |
| `NPS_Department_Select.sql` | `LCD_SERVER_LOC||'\OUT'` Windows backslash on Linux | Use `f_get_lcd_os_filename` with OUT stub |
| `Tes_Reports.bdy` | `substr(p_dir_name,1,length-1)` path hack | Replace with DIRECTORY name resolution |

---

## 13. DBA Prerequisites (not code)

| # | Action |
|---|--------|
| 1 | Create missing DIRECTORY objects for UK, Nordic, MidEast, LatAm, Italy, SAfrica |
| 2 | Run `GRANT_DIRECTORY_ACCESS.sql` as SYS |
| 3 | Verify `ORG_PARAM.LCD_SERVER_LOC` matches filesystem mounts |
| 4 | Grant `CREATE JOB` to LCD for WOA scheduler |
| 5 | Update job definitions calling `sa_notime(path, ...)` to pass DIRECTORY names |

---

## 14. Document History

| Date | Author | Change |
|------|--------|--------|
| 5/24/2026 | Cursor | Initial simulation document — no source files modified |
