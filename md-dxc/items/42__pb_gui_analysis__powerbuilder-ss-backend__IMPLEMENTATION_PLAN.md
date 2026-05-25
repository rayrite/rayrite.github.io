# Oracle 19c Migration — Server-Side PL/SQL Implementation Plan
## LCD Q22S UAT Environment | PowerBuilder GUI / SS Backend

**Author:** RdW  
**Date:** 5/24/2026  
**Scope:** 18 server-side SQL/PL/SQL files identified in the risk analysis plan  
**Target Environment:** Oracle 19c UAT (Q22S) on Linux (shared drive `/csclcdnc0002/Q22S*`)  
**Comment Prefix:** `-- RdW 5/24/2026 Powerbuilder GUI-SS Oracle 19c Migration`

---

## Directory Context

### DB DIRECTORY Objects (UAT — Q22S)
| Oracle Directory Name | Linux Path |
|---|---|
| `LCD` | `/csclcdnc0002/Q22S` |
| `LCD_IN` | `/csclcdnc0002/Q22S/In` |
| `LCD_OUT` | `/csclcdnc0002/Q22S/Out` |
| `LCD_ARCH` | `/csclcdnc0002/Q22S/Archive` |
| `LCD_ARCH_IN` | `/csclcdnc0002/Q22S/Archive/In` |
| `LCD_ARCH_OUT` | `/csclcdnc0002/Q22S/Archive/Out` |
| `LCD_663` | `/csclcdnc0002/Q22S-663` |
| `LCD_663_IN` | `/csclcdnc0002/Q22S-663/IN` |
| `LCD_663_OUT` | `/csclcdnc0002/Q22S-663/OUT` |
| `LCD_663_ARCH` | `/csclcdnc0002/Q22S-663/ARCHIVE` |
| `LCD_149_IN` | `/csclcdnc0002/Q22S-149/IN` |
| `LCD_149_OUT` | `/csclcdnc0002/Q22S-149/OUT` |
| `LCD_285_IN` | `/csclcdnc0002/Q22S-285/IN` |
| `LCD_285_OUT` | `/csclcdnc0002/Q22S-285/OUT` |
| `LCD_FEDERAL_IN` | `/csclcdnc0002/Q22S-FEDERAL/IN` |
| `LCD_FEDERAL_OUT` | `/csclcdnc0002/Q22S-FEDERAL/OUT` |
| `LCD_CANADA_IN` | `/csclcdnc0002/Q22S-CANADA/IN` |
| `LCD_CANADA_OUT` | `/csclcdnc0002/Q22S-CANADA/OUT` |

### ORG → LCD_SERVER_LOC Mapping (from LCD_ORGPARAM_Q22S-19c-UPDATED.csv)
Most orgs map to `/csclcdnc0002/Q22S`.  
Special mappings:
- ORGs 114, 107, 528, 138, 185, 109, 144, 145, 119, 155–159, ATD → `/csclcdnc0002/Q22S-FEDERAL`
- ORGs 574, 575 → `/csclcdnc0002/Q22S-CANADA`
- ORG 663 → `/csclcdnc0002/Q22S-663`
- ORG 149 → `/csclcdnc0002/Q22S-149`

### 11g UTL_FILE_DIR Paths (from LCD_FILE_PARAM-Q22S-11g-Copied.txt)
The 11g `UTL_FILE_DIR` parameter included all paths listed in the `LCD_FILE_PARAM` table row with `TYPE='UTL_FILE_DIR_PATHS'`. These are now replaced by Oracle DIRECTORY objects listed above.

---

## Files Touched

| File | Risks Addressed |
|---|---|
| `BATCH1.SQL` | RISK-SS-01 (DBMS_PIPE), RISK-SS-12 (BINARY_INTEGER) |
| `LCD_BTCH.SQL` | RISK-SS-01 (DBMS_PIPE call) |
| `10g_packages.sql` | RISK-SS-02 (UTL_FILE hardcoded paths) |
| `AddPayImp.sql` | RISK-SS-02 (UTL_FILE) |
| `Change_Password.sql` | RISK-SS-03 (SQL injection), RISK-SS-07 (pwdverify) |
| `p_copy_tables.SQL` | RISK-SS-04 (DBMS_SQL.V7, SQL injection) |
| `f_recalculate_labor.fun` | RISK-SS-05 `(+)` outer join |
| `PKGBDIST.SQL` | RISK-SS-05 `(+)` outer join, RISK-SS-13 (DBMS_OUTPUT) |
| `NPS_Departments_Job_Scheduler - FOR Q22.sql` | RISK-SS-06 (DBMS_JOB) |
| `Verify_Function.fun` | RISK-SS-07 (pwdverify.DICTIONARY) |
| `PAYEDIT2.SQL` | RISK-SS-08 (@LCD_ITES), RISK-SS-09 (pkg globals), RISK-SS-13 |
| `PAYEDIT.SQL` | RISK-SS-10 (date literal), RISK-SS-11 (AUTHID), RISK-SS-12 (BINARY_INTEGER) |
| `Globals_spec.sql` | RISK-SS-15 (CHAR in SMF_TYPE) |
| `TIMEEDIT.SQL` | RISK-SS-13 (DBMS_OUTPUT guard) |
| `TIMEEDIT_extended.SQL` | RISK-SS-13 (DBMS_OUTPUT guard), RISK-SS-14 (GOTO) |
| `TIMEPR1.SQL` | RISK-SS-12 (BINARY_INTEGER) |
| `PKG_DIST.SQL` | RISK-SS-12 (BINARY_INTEGER) |
| `ArchiveAndDeleteEtesAdjustments.sql` | RISK-SS-08 (@LCD_ITES annotation) |

---

## Multi-Phase Implementation Plan

---

### PHASE 1 — CRITICAL: Desupported API Fixes (Must compile before any testing)

**Goal:** Make all packages compile successfully in Oracle 19c.

#### Phase 1A — DBMS_PIPE → Oracle Advanced Queuing (RISK-SS-01)

**Files:** `BATCH1.SQL`, `LCD_BTCH.SQL`

**Design:**  
`DBMS_PIPE` is completely removed from Oracle 19c. The LCD batch framework uses pipes to communicate status back to the PowerBuilder front-end while a long-running batch process executes. The AQ replacement uses a single queue table `LCD.LCD_BATCH_QUEUE` with a message payload type that mirrors the pipe message format.

**AQ Setup Script (DBA must run first):**
```sql
-- AQ Queue Table
BEGIN
  DBMS_AQADM.CREATE_QUEUE_TABLE(
    queue_table        => 'LCD.LCD_BATCH_Q_TABLE',
    queue_payload_type => 'SYS.AQ$_JMS_TEXT_MESSAGE',
    sort_list          => 'ENQ_TIME',
    multiple_consumers => FALSE
  );
END;
/

-- AQ Queue per ORG (or a single shared queue with correlation_id = org||job)
BEGIN
  DBMS_AQADM.CREATE_QUEUE(
    queue_name  => 'LCD.LCD_BATCH_QUEUE',
    queue_table => 'LCD.LCD_BATCH_Q_TABLE',
    max_retries => 5,
    retry_delay => 5
  );
  DBMS_AQADM.START_QUEUE(queue_name => 'LCD.LCD_BATCH_QUEUE');
END;
/
GRANT ENQUEUE ON LCD.LCD_BATCH_QUEUE TO LCD;
GRANT DEQUEUE ON LCD.LCD_BATCH_QUEUE TO LCD;
```

**Code Changes in `BATCH1.SQL` (patched/):**
- `PIPE_CREATE` → enqueue an initialization AQ message keyed by `ORG||JOB_NAME`
- `PIPE_ESTABLISH` → enqueue a ready-signal AQ message; return 0 on success
- `PIPE_STATUS` → enqueue a status update AQ message
- `PIPE_DELETE` → dequeue-drain and dequeue final message
- `CHECK_PIPE` → dequeue from queue with `WAIT=1`; if timeout, return no-message
- `BINARY_INTEGER` → `PLS_INTEGER` throughout the spec

**Code Changes in `LCD_BTCH.SQL` (patched/):**
- `lcd.lcdbatch.pipe_establish(...)` call is unchanged in signature; implementation is internal to BATCH1

**Comment prefix on all changes:**
```sql
-- RdW 5/24/2026 Powerbuilder GUI-SS Oracle 19c Migration — RISK-SS-01: DBMS_PIPE removed; replaced with Oracle Advanced Queuing (AQ)
```

**TODO List 1A:**
- [ ] DBA creates AQ queue table and queue
- [ ] DBA grants ENQUEUE/DEQUEUE to LCD schema
- [ ] Patch BATCH1.SQL: rewrite PIPE_* procedures using DBMS_AQ
- [ ] Patch LCD_BTCH.SQL: no signature changes needed; add comment annotation
- [ ] Compile BATCH1.SQL spec then body
- [ ] Smoke test: call `lcd.lcdbatch.pipe_establish('010','DISTRIBUTION')` and verify 0 returned

---

#### Phase 1B — DBMS_SQL.V7 → DBMS_SQL.NATIVE (RISK-SS-04)

**File:** `p_copy_tables.SQL`

**Design:**  
`DBMS_SQL.V7` was removed in Oracle 19c. All three `DBMS_SQL.PARSE` calls in `p_copy_tables.SQL` must be changed to `DBMS_SQL.NATIVE`. Additionally, input validation against `ALL_TABLES` is added to mitigate the SQL injection risk (RISK-SS-04).

**Change pattern:**
```sql
-- Before:
DBMS_SQL.PARSE(l_cursor, l_sql, DBMS_SQL.V7);

-- After:
-- RdW 5/24/2026 Powerbuilder GUI-SS Oracle 19c Migration — RISK-SS-04: DBMS_SQL.V7 removed in 19c; replaced with DBMS_SQL.NATIVE
DBMS_SQL.PARSE(l_cursor, l_sql, DBMS_SQL.NATIVE);
```

**Validation injection before each dynamic SQL build:**
```sql
-- RdW 5/24/2026 Powerbuilder GUI-SS Oracle 19c Migration — RISK-SS-04: SQL injection whitelist check
DECLARE l_cnt INTEGER := 0;
BEGIN
  SELECT COUNT(*) INTO l_cnt FROM ALL_TABLES
   WHERE OWNER = UPPER(a_owner) AND TABLE_NAME = UPPER(a_table_name);
  IF l_cnt = 0 THEN
    RAISE_APPLICATION_ERROR(-20010, 'Invalid owner/table name: ' || a_owner || '.' || a_table_name);
  END IF;
END;
```

**TODO List 1B:**
- [ ] Patch p_copy_tables.SQL: replace all `DBMS_SQL.V7` with `DBMS_SQL.NATIVE`
- [ ] Add ALL_TABLES whitelist check inside `f_copy` and `f_delete` local functions
- [ ] Replace `BINARY_INTEGER` index types with `PLS_INTEGER`
- [ ] Compile and verify no errors

---

#### Phase 1C — Date Literal Default Parameter (RISK-SS-10)

**File:** `PAYEDIT.SQL`

**Design:**  
The package spec has date literals as parameter defaults. These fail if `NLS_DATE_FORMAT` differs at compile time. Replace with `TO_DATE` using an explicit format mask.

**Change pattern (multiple validate/leave_check procedure signatures):**
```sql
-- Before:
p_end_date   IN DATE := '11-NOV-97',

-- After:
-- RdW 5/24/2026 Powerbuilder GUI-SS Oracle 19c Migration — RISK-SS-10: NLS_DATE_FORMAT-safe explicit TO_DATE
p_end_date   IN DATE := TO_DATE('19971101','YYYYMMDD'),
```

**TODO List 1C:**
- [ ] Patch PAYEDIT.SQL: replace all `'11-NOV-97'` date literals with `TO_DATE('19971101','YYYYMMDD')`
- [ ] Compile PAYEDIT.SQL spec; then recompile PAYEDIT2.SQL body

---

### PHASE 2 — CRITICAL: UTL_FILE → Oracle DIRECTORY Objects (RISK-SS-02)

**Files:** `10g_packages.sql`, `AddPayImp.sql`

**Design:**  
Oracle 19c does not support `UTL_FILE_DIR`. All `UTL_FILE.FOPEN(path_string, ...)` calls must use a pre-created Oracle DIRECTORY object name (a constant string, not a path).

**Mapping helper function:** Add a helper `f_get_directory_name` in `10g_packages.sql` that translates `LCD_SERVER_LOC` values to the corresponding DIRECTORY object names:

```sql
-- RdW 5/24/2026 Powerbuilder GUI-SS Oracle 19c Migration — RISK-SS-02: UTL_FILE path-to-DIRECTORY mapping
FUNCTION f_get_directory_name(
  p_lcd_server_loc IN VARCHAR2,
  p_sub_dir        IN VARCHAR2 -- 'IN' or 'OUT' or 'ARCH_IN' etc.
) RETURN VARCHAR2 IS
BEGIN
  -- Map LCD_SERVER_LOC to Oracle DIRECTORY object name
  -- /csclcdnc0002/Q22S        → LCD
  -- /csclcdnc0002/Q22S-FEDERAL → LCD_FEDERAL
  -- /csclcdnc0002/Q22S-CANADA  → LCD_CANADA
  -- /csclcdnc0002/Q22S-663     → LCD_663
  -- /csclcdnc0002/Q22S-149     → LCD_149
  -- /csclcdnc0002/Q22S-285     → LCD_285
  DECLARE
    l_suffix VARCHAR2(30);
    l_prefix VARCHAR2(30) := 'LCD';
  BEGIN
    -- Extract suffix after /csclcdnc0002/Q22S
    l_suffix := UPPER(REPLACE(REPLACE(p_lcd_server_loc, '/csclcdnc0002/Q22S', ''), '/csclcdnc0002/Q22s', ''));
    l_suffix := REPLACE(l_suffix, '-', '_'); -- e.g. '-FEDERAL' → '_FEDERAL'
    l_suffix := LTRIM(l_suffix, '_');        -- remove leading underscore if present
    
    IF TRIM(l_suffix) IS NULL THEN
      -- Base org: LCD_IN, LCD_OUT, etc.
      RETURN 'LCD' || CASE WHEN TRIM(p_sub_dir) IS NOT NULL THEN '_' || UPPER(TRIM(p_sub_dir)) ELSE '' END;
    ELSE
      RETURN 'LCD_' || l_suffix || CASE WHEN TRIM(p_sub_dir) IS NOT NULL THEN '_' || UPPER(TRIM(p_sub_dir)) ELSE '' END;
    END IF;
  END;
END f_get_directory_name;
```

**Change pattern in `f_open_in_file`:**
```sql
-- Before:
IF UPPER(SUBSTR(l_dir_name,1,1)) = SUBSTR(l_dir_name,1,1) THEN
   p_file_handle := UTL_FILE.FOPEN(l_dir_name||'\IN', RTRIM(p_in_file_name), 'r');
ELSE
   p_file_handle := UTL_FILE.FOPEN(l_dir_name||'\in', RTRIM(p_in_file_name), 'r');
END IF;

-- After:
-- RdW 5/24/2026 Powerbuilder GUI-SS Oracle 19c Migration — RISK-SS-02: UTL_FILE_DIR removed in 19c; use Oracle DIRECTORY objects
DECLARE
  l_dir_obj VARCHAR2(60);
BEGIN
  l_dir_obj := f_get_directory_name(l_dir_name, 'IN');
  DBMS_OUTPUT.PUT_LINE('-- [DEBUG] UTL_FILE.FOPEN dir_obj=[' || l_dir_obj || '] file=[' || RTRIM(p_in_file_name) || ']');
  p_file_handle := UTL_FILE.FOPEN(l_dir_obj, RTRIM(p_in_file_name), 'r');
END;
```

**AddPayImp.sql:** Search for all `UTL_FILE.FOPEN` calls and apply the same directory-name lookup pattern.

**TODO List Phase 2:**
- [ ] Add `f_get_directory_name` helper function to 10g_packages.sql
- [ ] Patch `f_open_in_file` to use DIRECTORY object names
- [ ] Search AddPayImp.sql for all UTL_FILE.FOPEN usages and apply same fix
- [ ] Add DBMS_OUTPUT debug statements showing resolved directory name and filename
- [ ] Compile and verify; test with valid org code that maps to each DIRECTORY
- [ ] Confirm DBA has granted `READ ON DIRECTORY` and `WRITE ON DIRECTORY` to LCD schema for each directory object

---

### PHASE 3 — CRITICAL: SQL Injection Fixes (RISK-SS-03, RISK-SS-04)

**Files:** `Change_Password.sql`, `p_copy_tables.SQL` (p_copy_tables already addressed in Phase 1B)

#### Phase 3A — Change_Password.sql (RISK-SS-03)

**Design:**  
Replace the `DBMS_SQL.parse / DBMS_SQL.native` pattern (which is not necessary here — DDL can use `EXECUTE IMMEDIATE`) and add `DBMS_ASSERT.SIMPLE_SQL_NAME` validation on the username before concatenation.

```sql
-- Before (end of function body):
DBMS_SQL.parse (cid, 'alter user ' || UPPER(p_user) || ' identified by ' || '"'||p_user_pw||'"', DBMS_SQL.native);
DBMS_SQL.close_cursor (cid);

-- After:
-- RdW 5/24/2026 Powerbuilder GUI-SS Oracle 19c Migration — RISK-SS-03: SQL injection prevention; use DBMS_ASSERT.SIMPLE_SQL_NAME
DECLARE
  l_safe_user VARCHAR2(65);
BEGIN
  -- Validate username is a legal Oracle identifier (no injection)
  l_safe_user := DBMS_ASSERT.SIMPLE_SQL_NAME(UPPER(p_user));
  DBMS_OUTPUT.PUT_LINE('-- [DEBUG] ALTER USER target: [' || l_safe_user || ']');
  EXECUTE IMMEDIATE 'ALTER USER "' || l_safe_user || '" IDENTIFIED BY "' || p_user_pw || '"';
END;
```

Remove the `cid INTEGER := DBMS_SQL.open_cursor` declaration (no longer needed).

**TODO List Phase 3A:**
- [ ] Remove `cid` cursor declaration from Change_Password.sql
- [ ] Replace DBMS_SQL block with EXECUTE IMMEDIATE + DBMS_ASSERT.SIMPLE_SQL_NAME
- [ ] Add DBMS_OUTPUT debug statement for the target username
- [ ] Compile and test with valid/invalid usernames

#### Phase 3B — pwdverify.DICTIONARY (RISK-SS-07)

**Files:** `Change_Password.sql`, `Verify_Function.fun`

**Design:**  
The `pwdverify.DICTIONARY` table may not exist in Oracle 19c. Wrap the dictionary check in a defensive exception handler. If `ORA-00942` (table not found), skip the check and log the fact.

```sql
-- RdW 5/24/2026 Powerbuilder GUI-SS Oracle 19c Migration — RISK-SS-07: pwdverify.DICTIONARY may not exist in 19c; wrap in defensive handler
BEGIN
  SELECT COUNT(*) INTO v_word_count FROM pwdverify.DICTIONARY;
  IF v_word_count > 0 THEN
    v_use_dictionary := TRUE;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    -- ORA-00942 table or view does not exist — dictionary check skipped
    DBMS_OUTPUT.PUT_LINE('-- [DEBUG] pwdverify.DICTIONARY not available; dictionary check skipped. SQLERRM=' || SQLERRM);
    v_use_dictionary := FALSE;
END;
```

**TODO List Phase 3B:**
- [ ] Patch Change_Password.sql: wrap both pwdverify.DICTIONARY SELECTs in BEGIN/EXCEPTION blocks
- [ ] Patch Verify_Function.fun: same defensive wrapper
- [ ] Document in deployment plan: DBA should either migrate pwdverify schema or accept the graceful fallback

---

### PHASE 4 — CRITICAL: Outer Join Syntax (RISK-SS-05)

**Files:** `f_recalculate_labor.fun`, `PKGBDIST.SQL`

**Design:**  
Replace all `(+)` Oracle-proprietary outer join syntax with ANSI `LEFT OUTER JOIN` syntax. This is necessary because Oracle 19c throws `ORA-01799` when `(+)` outer joins are mixed with certain subquery patterns.

**Pattern in f_recalculate_labor.fun:**
```sql
-- Before (c_lab_weekly_totals cursor):
		WHERE ...
			H.EMPLOYEE_GROUP = S.WORKER_GROUP(+) AND
			H.EMPLOYEE_SUB_GROUP = S.WORKER_SUB_GROUP(+) AND
			S.ORG_CODE(+) = H.ORG_CODE

-- After:
-- RdW 5/24/2026 Powerbuilder GUI-SS Oracle 19c Migration — RISK-SS-05: Oracle (+) outer join replaced with ANSI LEFT OUTER JOIN
		FROM  LABOR_DETAIL L
		JOIN  WORKER W ON (W.ORG_CODE = ca_org AND W.WORKER_ID = ca_wid)
		JOIN  WORKER_HIST H ON (H.ORG_CODE = ca_org AND H.WORKER_ID = L.WORKER_ID
			AND H.ACTUAL_DATE = (SELECT MAX(ACTUAL_DATE) FROM WORKER_HIST
				WHERE ORG_CODE = ca_org AND WORKER_ID = ca_wid
				AND ACTUAL_DATE <= csc_get.week_start(L.ACTUAL_DATE,l_org_param_row.WEEKLY_START_DAY)))
		JOIN  ATT_ABS_TYPE A ON (A.ORG_CODE = ca_org AND A.ATT_ABS_TYPE = L.ATT_ABS_TYPE)
		LEFT OUTER JOIN GROUP_SUBGROUP S ON (
			S.ORG_CODE = H.ORG_CODE AND
			S.WORKER_GROUP = H.EMPLOYEE_GROUP AND
			S.WORKER_SUB_GROUP = H.EMPLOYEE_SUB_GROUP)
		WHERE L.ORG_CODE = ca_org AND
			L.ACTUAL_DATE BETWEEN ca_start AND ca_end AND
			L.WORKER_ID = ca_wid
```

**Pattern in PKGBDIST.SQL:** Each cursor with `M.ORG_CODE (+)` pattern becomes a `LEFT OUTER JOIN LCD.GENERATED_WAGE_TYPE_MAPPING M ON (...)`.

**TODO List Phase 4:**
- [ ] Patch f_recalculate_labor.fun: convert all 7+ `(+)` joins in each cursor definition
- [ ] Patch PKGBDIST.SQL: convert all 5 `(+)` join occurrences (lines ~135, 873, 1028, 1054, 1067)
- [ ] Compile both files; verify cursor equivalence with original query results in test environment

---

### PHASE 5 — HIGH: Scheduler, DB Link, and Package Global Fixes

#### Phase 5A — DBMS_JOB → DBMS_SCHEDULER (RISK-SS-06)

**File:** `NPS_Departments_Job_Scheduler - FOR Q22.sql`

```sql
-- Before:
SYS.DBMS_JOB.SUBMIT(job => X, what => 'weekly_nps_extract(...)', INTERVAL => 'NEXT_DAY(...)');

-- After:
-- RdW 5/24/2026 Powerbuilder GUI-SS Oracle 19c Migration — RISK-SS-06: DBMS_JOB desupported in 19c; replaced with DBMS_SCHEDULER
BEGIN
  DBMS_SCHEDULER.CREATE_JOB(
    job_name        => 'LCD.WEEKLY_NPS_EXTRACT_Q22_JOB',
    job_type        => 'STORED_PROCEDURE',
    job_action      => 'LCD.WEEKLY_NPS_EXTRACT',
    job_arguments   => 2,
    start_date      => SYSTIMESTAMP,
    repeat_interval => 'FREQ=WEEKLY;BYDAY=TUE;BYHOUR=5;BYMINUTE=0;BYSECOND=0',
    enabled         => TRUE,
    auto_drop       => FALSE,
    comments        => 'Q22S Weekly NPS Extract - migrated from DBMS_JOB'
  );
  DBMS_SCHEDULER.SET_JOB_ARGUMENT_VALUE('LCD.WEEKLY_NPS_EXTRACT_Q22_JOB', 1, '\\cmis60\dev-tp$\Q22\OUT');
  DBMS_SCHEDULER.SET_JOB_ARGUMENT_VALUE('LCD.WEEKLY_NPS_EXTRACT_Q22_JOB', 2, 'GVRDPTS');
END;
/
```

**Note:** The `NEXT_DAY` string with English day names is replaced by ISO-8601 `FREQ=WEEKLY;BYDAY=TUE` which is NLS-independent.

**TODO List Phase 5A:**
- [ ] Drop old DBMS_JOB entry (requires SYS or DBA: `EXEC DBMS_JOB.REMOVE(job_number)`)
- [ ] Run patched script to create DBMS_SCHEDULER job
- [ ] Verify job appears in `DBA_SCHEDULER_JOBS`

#### Phase 5B — @LCD_ITES DB Link Annotation (RISK-SS-08)

**Files:** `PAYEDIT2.SQL`, `ArchiveAndDeleteEtesAdjustments.sql`

**Design:**  
The code using `@LCD_ITES` cannot be changed without coordination with the ITES team. Add clear comment blocks and a runtime availability check.

```sql
-- RdW 5/24/2026 Powerbuilder GUI-SS Oracle 19c Migration — RISK-SS-08: @LCD_ITES DB link must be recreated in 19c
-- DBA ACTION REQUIRED: Execute: CREATE DATABASE LINK LCD_ITES CONNECT TO ... USING '...';
-- Verify link: SELECT * FROM DUAL@LCD_ITES;
-- NOTE: Remote ITES database must be Oracle 12c+ for cross-version DB link compatibility
```

**TODO List Phase 5B:**
- [ ] Add comment block above every `@LCD_ITES` reference in PAYEDIT2.SQL and ArchiveAndDeleteEtesAdjustments.sql
- [ ] DBA creates `LCD_ITES` DB link in 19c environment
- [ ] Test: `SELECT COUNT(*) FROM ITES.IT_ORGANIZATION@LCD_ITES;`

#### Phase 5C — Package Global State (RISK-SS-09)

**File:** `PAYEDIT2.SQL`

**Design:**  
The package globals `pg_org_code` and `pg_worker_id` with dummy defaults pose data leakage risk in pooled connections. Add a session-context initialization guard to reset them at each entry point.

```sql
-- RdW 5/24/2026 Powerbuilder GUI-SS Oracle 19c Migration — RISK-SS-09: Package global state reset at entry points to prevent DRCP session reuse leakage
-- Add to the VALIDATE procedure entry:
pg_org_code := p_org_code;  -- Explicit reset; do not rely on package init
pg_worker_id := p_worker_id;
DBMS_OUTPUT.PUT_LINE('-- [DEBUG] pay_edit.validate entry: org=[' || pg_org_code || '] wid=[' || pg_worker_id || ']');
```

**TODO List Phase 5C:**
- [ ] Patch PAYEDIT2.SQL: add explicit reset of pg_org_code and pg_worker_id at top of each entry procedure
- [ ] Add DBMS_OUTPUT debug statement showing session context at entry

---

### PHASE 6 — MEDIUM: Code Quality and Safety Fixes

#### Phase 6A — BINARY_INTEGER → PLS_INTEGER (RISK-SS-12)

**Files:** `BATCH1.SQL`, `PAYEDIT.SQL`, `TIMEPR1.SQL`, `PKG_DIST.SQL`, `p_copy_tables.SQL`

Use global search-and-replace (case-insensitive) within each file:
```
BINARY_INTEGER → PLS_INTEGER
```

```sql
-- RdW 5/24/2026 Powerbuilder GUI-SS Oracle 19c Migration — RISK-SS-12: BINARY_INTEGER replaced with canonical PLS_INTEGER
```

**TODO List Phase 6A:**
- [ ] Patch BATCH1.SQL: replace `BINARY_INTEGER` → `PLS_INTEGER` in ARR_PARMS_TYPE definition
- [ ] Patch PAYEDIT.SQL: replace all `INDEX BY BINARY_INTEGER` in TimeArrayType, AbsType, WoType, etc.
- [ ] Patch TIMEPR1.SQL: replace all 5 occurrences
- [ ] Patch PKG_DIST.SQL: replace all 20+ occurrences
- [ ] Patch p_copy_tables.SQL: replace `l_table_num` and `i` declarations

#### Phase 6B — DBMS_OUTPUT Debug Guard (RISK-SS-13)

**Files:** `PKGBDIST.SQL`, `PAYEDIT2.SQL`, `PAYEDIT.SQL`, `TIMEEDIT.SQL`, `TIMEEDIT_extended.SQL`

**Design:**  
Rather than removing DBMS_OUTPUT calls, wrap them in a debug flag check so they can be selectively enabled. Add a package-level debug flag to `Globals_spec.sql`.

```sql
-- In Globals_spec.sql — add:
-- RdW 5/24/2026 Powerbuilder GUI-SS Oracle 19c Migration — RISK-SS-13: Debug output guard flag
g_debug_output   BOOLEAN := FALSE; -- Set TRUE in session for diagnostic output
```

**In each package body, wrap DBMS_OUTPUT calls:**
```sql
-- Before:
DBMS_OUTPUT.PUT_LINE('some message');

-- After:
-- RdW 5/24/2026 Powerbuilder GUI-SS Oracle 19c Migration — RISK-SS-13: DBMS_OUTPUT guarded by lcd.globals.g_debug_output
IF lcd.globals.g_debug_output THEN
  DBMS_OUTPUT.PUT_LINE('some message');
END IF;
```

**Note:** File-system-related DBMS_OUTPUT in RISK-SS-02 patches are kept always-on for diagnostic tracing of UTL_FILE directory issues.

**TODO List Phase 6B:**
- [ ] Add `g_debug_output BOOLEAN := FALSE` to Globals_spec.sql
- [ ] Patch PKGBDIST.SQL: wrap all DBMS_OUTPUT calls in `IF lcd.globals.g_debug_output THEN`
- [ ] Patch PAYEDIT2.SQL: same for 100+ DBMS_OUTPUT calls (use regex replace)
- [ ] Patch TIMEEDIT.SQL: same treatment
- [ ] Patch TIMEEDIT_extended.SQL: guard non-critical DBMS_OUTPUT; keep file-path debug always-on

#### Phase 6C — GOTO Refactoring (RISK-SS-14)

**File:** `TIMEEDIT_extended.SQL`

**Design:**  
The single `GOTO CONT` / `<<CONT>>` pattern in `TIMEEDIT_extended.SQL` can be eliminated by inverting the condition:

```sql
-- Before:
IF NVL(p_error_count,0) > 0 THEN
   FOR i IN 1..p_error_count LOOP ... END LOOP;
   GOTO CONT;
END IF;
-- ... more processing code ...
<<CONT>>
-- final return

-- After:
-- RdW 5/24/2026 Powerbuilder GUI-SS Oracle 19c Migration — RISK-SS-14: GOTO replaced with IF/ELSE conditional structure
IF NVL(p_error_count,0) > 0 THEN
   FOR i IN 1..p_error_count LOOP ... END LOOP;
ELSE
   -- ... all subsequent processing code moved into ELSE block ...
END IF;
-- <<CONT>> label removed; falls through to EXCEPTION / END naturally
```

**TODO List Phase 6C:**
- [ ] Patch TIMEEDIT_extended.SQL: wrap post-GOTO code in ELSE block, remove GOTO and <<CONT>> label
- [ ] Compile and verify functional equivalence

#### Phase 6D — AUTHID Clause (RISK-SS-11)

**Files:** `Change_Password.sql` (function-level), `p_copy_tables.SQL` (procedure-level)

```sql
-- RdW 5/24/2026 Powerbuilder GUI-SS Oracle 19c Migration — RISK-SS-11: Explicit AUTHID clause added for security clarity
CREATE OR REPLACE FUNCTION lcd.change_password(...)
AUTHID CURRENT_USER   -- Executes with caller's privileges (has dynamic ALTER USER DDL)
RETURN INTEGER IS ...
```

```sql
CREATE OR REPLACE PROCEDURE lcd.p_copy_tables(...)
AUTHID CURRENT_USER   -- Executes with caller's privileges (has dynamic DML)
IS ...
```

For data-access packages without dynamic DDL/DML, add `AUTHID DEFINER` explicitly.

**TODO List Phase 6D:**
- [ ] Patch Change_Password.sql: add `AUTHID CURRENT_USER`
- [ ] Patch p_copy_tables.SQL: add `AUTHID CURRENT_USER`
- [ ] Patch PAYEDIT.SQL, PKG_DIST.SQL package specs: add `AUTHID DEFINER` explicitly

#### Phase 6E — CHAR SMF_TYPE (RISK-SS-15)

**File:** `Globals_spec.sql`

**Design:**  
If the 19c database charset is changing to AL32UTF8, the 47 CHAR fields in `SMF_TYPE` must be converted to `VARCHAR2` to avoid multi-byte truncation. For now, add a conditional note block.

```sql
-- RdW 5/24/2026 Powerbuilder GUI-SS Oracle 19c Migration — RISK-SS-15: CHAR fields in SMF_TYPE may cause ORA-12899 if charset changes to AL32UTF8
-- DBA ACTION: Confirm target charset. If AL32UTF8, convert all CHAR fields below to VARCHAR2.
-- Current charset assumption: WE8ISO8859P1 (single-byte) — CHAR fields are safe.
-- If charset changes, execute: SELECT * FROM NLS_DATABASE_PARAMETERS WHERE PARAMETER='NLS_CHARACTERSET';
```

**TODO List Phase 6E:**
- [ ] Add charset risk comment block above `TYPE smf_type IS RECORD` in Globals_spec.sql
- [ ] DBA confirms target charset before go-live
- [ ] If AL32UTF8: change all 47 CHAR declarations to VARCHAR2

---

## Complete TODO Master List (Ordered by Phase)

### Phase 1 — CRITICAL (Compilation Blockers)
- [ ] **1A-1** DBA creates AQ queue table `LCD.LCD_BATCH_Q_TABLE`
- [ ] **1A-2** DBA creates and starts `LCD.LCD_BATCH_QUEUE`
- [ ] **1A-3** DBA grants ENQUEUE/DEQUEUE to LCD schema
- [ ] **1A-4** Patch BATCH1.SQL: rewrite all PIPE_* procedures using DBMS_AQ
- [ ] **1A-5** Patch BATCH1.SQL: replace `BINARY_INTEGER` with `PLS_INTEGER`
- [ ] **1A-6** Patch LCD_BTCH.SQL: add RISK-SS-01 annotation comments
- [ ] **1B-1** Patch p_copy_tables.SQL: replace `DBMS_SQL.V7` → `DBMS_SQL.NATIVE`
- [ ] **1B-2** Patch p_copy_tables.SQL: add ALL_TABLES whitelist validation
- [ ] **1C-1** Patch PAYEDIT.SQL: replace `'11-NOV-97'` → `TO_DATE('19971101','YYYYMMDD')`

### Phase 2 — CRITICAL (UTL_FILE)
- [ ] **2-1** DBA confirms all LCD_* DIRECTORY objects exist and are granted to LCD schema
- [ ] **2-2** Add `f_get_directory_name` helper to 10g_packages.sql
- [ ] **2-3** Patch `f_open_in_file` in 10g_packages.sql to use DIRECTORY object names
- [ ] **2-4** Patch AddPayImp.sql: fix all UTL_FILE.FOPEN calls
- [ ] **2-5** Add DBMS_OUTPUT debug lines for resolved directory names

### Phase 3 — CRITICAL (Security)
- [ ] **3A-1** Patch Change_Password.sql: add DBMS_ASSERT.SIMPLE_SQL_NAME validation
- [ ] **3A-2** Patch Change_Password.sql: replace DBMS_SQL with EXECUTE IMMEDIATE
- [ ] **3A-3** Patch Change_Password.sql: add AUTHID CURRENT_USER
- [ ] **3B-1** Patch Change_Password.sql: wrap pwdverify.DICTIONARY in defensive handler
- [ ] **3B-2** Patch Verify_Function.fun: same defensive wrapper
- [ ] **3B-3** DBA: decide whether to migrate pwdverify schema to 19c

### Phase 4 — CRITICAL (Outer Joins)
- [ ] **4-1** Patch f_recalculate_labor.fun: convert all 7 `(+)` joins to ANSI LEFT JOIN
- [ ] **4-2** Patch PKGBDIST.SQL: convert all 5 `(+)` join occurrences to ANSI LEFT JOIN

### Phase 5 — HIGH (Infrastructure)
- [ ] **5A-1** Drop old DBMS_JOB entry (DBA action)
- [ ] **5A-2** Patch NPS_Departments_Job_Scheduler - FOR Q22.sql: replace with DBMS_SCHEDULER
- [ ] **5B-1** Patch PAYEDIT2.SQL: add @LCD_ITES comment blocks
- [ ] **5B-2** Patch ArchiveAndDeleteEtesAdjustments.sql: add @LCD_ITES comment blocks
- [ ] **5B-3** DBA: recreate LCD_ITES DB link in 19c
- [ ] **5C-1** Patch PAYEDIT2.SQL: reset package globals at each entry point

### Phase 6 — MEDIUM (Quality)
- [ ] **6A-1** Patch all files: `BINARY_INTEGER` → `PLS_INTEGER`
- [ ] **6B-1** Patch Globals_spec.sql: add `g_debug_output BOOLEAN := FALSE`
- [ ] **6B-2** Patch Globals_body.sql: implement `g_debug_output` accessor
- [ ] **6B-3** Patch PKGBDIST.SQL, PAYEDIT2.SQL, TIMEEDIT.SQL, TIMEEDIT_extended.SQL: wrap DBMS_OUTPUT
- [ ] **6C-1** Patch TIMEEDIT_extended.SQL: replace GOTO with IF/ELSE structure
- [ ] **6D-1** Patch Change_Password.sql, p_copy_tables.SQL: add AUTHID CURRENT_USER
- [ ] **6D-2** Patch PAYEDIT.SQL, PKG_DIST.SQL specs: add AUTHID DEFINER explicitly
- [ ] **6E-1** Patch Globals_spec.sql: add charset risk comment block above SMF_TYPE
- [ ] **6E-2** DBA: confirm NLS_CHARACTERSET before go-live

---

## Compile Order (Dependency Chain)

```
1. Globals_spec.sql         (package spec — no dependencies)
2. Globals_body.sql         (package body — depends on spec)
3. PKG_DIST.SQL             (package spec — depends on Globals)
4. PKGBDIST.SQL             (package body — depends on PKG_DIST spec)
5. PAYEDIT.SQL              (package spec — independent)
6. PAYEDIT2.SQL             (package body — depends on PAYEDIT spec)
7. BATCH1.SQL               (package spec)
8. LCD_BTCH.SQL             (procedure — depends on BATCH1 and PKG_DIST)
9. TIMEPR1.SQL              (package spec)
10. TIMEEDIT.SQL            (package or procedure — depends on TIMEPR1)
11. TIMEEDIT_extended.SQL   (procedure — depends on pay_edit, p_get_empl_time)
12. 10g_packages.sql        (standalone functions — depends on ORG_PARAM)
13. AddPayImp.sql           (procedure — depends on 10g_packages)
14. Change_Password.sql     (standalone function — depends on pwdverify if present)
15. Verify_Function.fun     (standalone function — depends on pwdverify if present)
16. p_copy_tables.SQL       (standalone procedure — depends on ALL_TABLES)
17. f_recalculate_labor.fun (standalone function — depends on PKG_DIST)
18. NPS_Departments_Job_Scheduler*.sql  (anonymous block — no dependencies)
19. ArchiveAndDeleteEtesAdjustments.sql (procedure — depends on @LCD_ITES)
```

---

## Risk Summary

| Risk ID | Priority | Phase | Status |
|---|---|---|---|
| RISK-SS-01 | CRITICAL | 1A | To Do |
| RISK-SS-02 | CRITICAL | 2 | To Do |
| RISK-SS-03 | CRITICAL | 3A | To Do |
| RISK-SS-04 | CRITICAL | 1B, 3 | To Do |
| RISK-SS-05 | CRITICAL | 4 | To Do |
| RISK-SS-06 | HIGH | 5A | To Do |
| RISK-SS-07 | HIGH | 3B | To Do |
| RISK-SS-08 | HIGH | 5B | To Do |
| RISK-SS-09 | HIGH | 5C | To Do |
| RISK-SS-10 | HIGH | 1C | To Do |
| RISK-SS-11 | MEDIUM | 6D | To Do |
| RISK-SS-12 | MEDIUM | 6A | To Do |
| RISK-SS-13 | MEDIUM | 6B | To Do |
| RISK-SS-14 | MEDIUM | 6C | To Do |
| RISK-SS-15 | MEDIUM | 6E | To Do |
