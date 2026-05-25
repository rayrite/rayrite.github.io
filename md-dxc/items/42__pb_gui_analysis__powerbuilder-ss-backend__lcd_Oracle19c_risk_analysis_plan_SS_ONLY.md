## Server-Side Risk Findings (15 Categories)

### RISK-SS-01 — `DBMS_PIPE` in Batch Framework
**Severity: CRITICAL — DBMS_PIPE is desupported in Oracle 19c**

`DBMS_PIPE` was Oracle's legacy inter-process communication mechanism. It was deprecated in Oracle 12.1 and is **desupported in Oracle 19c** (MOS Doc ID 2260545.1). Any package that calls `DBMS_PIPE` will receive `ORA-06576: not a valid function or procedure name` on 19c.

| File | Lines | Usage |
|------|-------|-------|
| BATCH1.SQL | All | Package `LCD.LCDBatch`: declares `PIPE_CREATE`, `PIPE_DELETE`, `PIPE_ESTABLISH`, `PIPE_STATUS`, `CHECK_PIPE` procedures |
| LCD_BTCH.SQL | Line 25 | `lcd.lcdbatch.pipe_establish(a_login_org, a_event_name)` — called before distribution |

**Note:** BATCH2.SQL and BATCH3.SQL contain a comment (`-- 02/14 L.Ioffe DBMS_Scheduler to replace DBMS_Job`) showing `DBMS_JOB` was migrated to `DBMS_SCHEDULER` — but `DBMS_PIPE` was never migrated.

**Fix:** Replace `DBMS_PIPE` with **Oracle Advanced Queuing (AQ)**:
- `DBMS_AQ.ENQUEUE` replaces pipe send operations
- `DBMS_AQ.DEQUEUE` replaces pipe receive/listen operations
- Requires creating queue tables and queues (DBA action)
- The PowerBuilder front-end that calls `lcd_batch_distribution` will need no changes — only the server-side pipe mechanism changes

---

### RISK-SS-02 — `UTL_FILE` with Hardcoded OS Paths
**Severity: CRITICAL — Will fail on Oracle 19c without directory objects**

10g_packages.sql (line 3096) opens files using a hardcoded path concatenation:
```sql
UTL_FILE.FOPEN(l_dir_name||'\IN', RTRIM(p_in_file_name), 'r');
UTL_FILE.FOPEN(l_dir_name||'\in', RTRIM(p_in_file_name), 'r');
```

In Oracle 11g, `UTL_FILE_DIR` initialization parameter allowed directory-path-based file access. **Oracle 19c removed `UTL_FILE_DIR`** (desupported in 12c; ORA-29280 if attempted). All UTL_FILE access must go through `CREATE DIRECTORY` objects. The `\\` Windows-style path separator also indicates this was written for a Windows server; the 19c target must match.

Additional UTL_FILE usage found in AddPayImp.sql line 136–2490.

**Fix:**
```sql
-- DBA must create directory objects:
CREATE OR REPLACE DIRECTORY LCD_IN_DIR AS 'C:\lcd\data\IN';
GRANT READ ON DIRECTORY LCD_IN_DIR TO LCD;

-- Code change in 10g_packages.sql:
-- Before: UTL_FILE.FOPEN(l_dir_name||'\IN', ...)
-- After:  UTL_FILE.FOPEN('LCD_IN_DIR', ...)
```

---

### RISK-SS-03 — SQL Injection in `Change_Password.sql`
**Severity: CRITICAL — Security vulnerability AND may break under 19c stricter parsing**

`Change_Password.sql` builds a dynamic `ALTER USER ... IDENTIFIED BY` statement via string concatenation:
```sql
EXECUTE IMMEDIATE 'alter user ' || UPPER(p_user) || ' identified by ' || '"'||p_user_pw||'"'
```
This is a textbook SQL injection vector — a malicious password string containing `"` characters or Oracle DDL can terminate the quoted identifier and inject arbitrary DDL. Oracle 19c's parser is also stricter about quoted identifier DDL in dynamic SQL contexts.

The procedure also uses the older `DBMS_SQL` API (`DBMS_SQL.open_cursor`, `DBMS_SQL.NATIVE`) which, while still functional in 19c, is unnecessary here.

**Fix:** Passwords cannot be parameterized in `ALTER USER IDENTIFIED BY` (Oracle doesn't support bind variables for passwords). The correct mitigation is strict input validation:
```sql
-- Validate user and password before concatenation
IF NOT REGEXP_LIKE(p_user, '^[A-Za-z][A-Za-z0-9_$#]{0,29}$') THEN
   RAISE_APPLICATION_ERROR(-20001, 'Invalid username format');
END IF;
-- Use the VALUES clause approach instead of concatenation where possible
EXECUTE IMMEDIATE 'ALTER USER "' || UPPER(DBMS_ASSERT.SIMPLE_SQL_NAME(p_user)) || '" IDENTIFIED BY "' || ... || '"';
```
Use `DBMS_ASSERT.SIMPLE_SQL_NAME` to validate the username is a legal Oracle identifier before concatenation.

---

### RISK-SS-04 — SQL Injection in `p_copy_tables.SQL`
**Severity: CRITICAL — Unparameterized dynamic DDL/DML**

`p_copy_tables.SQL` builds dynamic `INSERT` and `DELETE` statements concatenating the owner, table name, and org code:
```sql
'INSERT INTO ' || a_owner || '.' || a_table_name || ' SELECT * FROM ' || a_owner || '.' || a_table_name || '@' || ...
```
Table names and owner names are passed as procedure parameters with no whitelist validation against `ALL_TABLES`. A caller with EXECUTE privilege on this procedure can inject arbitrary SQL.

Also contains `DBMS_SQL.V7` syntax (line 70) — `DBMS_SQL.PARSE(cursor, sql_string, DBMS_SQL.V7)` — the `V7` compatibility mode constant was **removed in Oracle 19c**. This will throw a compile error immediately.

**Fix:**
1. Replace `DBMS_SQL.V7` with `DBMS_SQL.NATIVE` (or convert to `EXECUTE IMMEDIATE`)
2. Validate table/owner names against `ALL_TABLES` before use:
```sql
SELECT COUNT(*) INTO l_cnt FROM ALL_TABLES WHERE OWNER = UPPER(a_owner) AND TABLE_NAME = UPPER(a_table_name);
IF l_cnt = 0 THEN RAISE_APPLICATION_ERROR(-20002, 'Invalid table name'); END IF;
```

---

### RISK-SS-05 — `(+)` Outer Join in Server-Side PL/SQL
**Severity: CRITICAL — Same ORA-01799 risk as GUI layer**

The server-side PL/SQL packages use the deprecated Oracle outer-join syntax internally:

| File | Instances | Context |
|------|-----------|---------|
| f_recalculate_labor.fun | 7+ | `H.EMPLOYEE_GROUP = S.WORKER_GROUP(+)`, `G.START_DATE(+)`, `W.ORG_CODE(+)` |
| PKGBDIST.SQL | 1 | `M.ORG_CODE (+) = a_cur_reference_org` |

**Fix:** Convert to ANSI `LEFT OUTER JOIN` syntax (same remediation as RISK-01 in GUI analysis).

---

### RISK-SS-06 — `SYS.DBMS_JOB` Still Present
**Severity: HIGH — Partially migrated; one active script still uses old API**

`DBMS_JOB` was deprecated in Oracle 12c and desupported in Oracle 19c. While BATCH2.SQL and BATCH3.SQL were migrated to `DBMS_SCHEDULER`, one script still uses the old API:

NPS_Departments_Job_Scheduler - FOR Q22.sql:
```sql
SYS.DBMS_JOB.SUBMIT(job => X, what => 'weekly_nps_extract(...)', ...
   INTERVAL => 'NEXT_DAY(TRUNC(SYSDATE),''TUESDAY'') + 5/24')
```

Note: The `INTERVAL` expression also uses `NEXT_DAY` with an English day name — NLS risk if database language is non-English.

**Fix:** Replace with `DBMS_SCHEDULER.CREATE_JOB`:
```sql
DBMS_SCHEDULER.CREATE_JOB(
   job_name   => 'WEEKLY_NPS_EXTRACT_JOB',
   job_type   => 'STORED_PROCEDURE',
   job_action => 'LCD.WEEKLY_NPS_EXTRACT',
   start_date => SYSTIMESTAMP,
   repeat_interval => 'FREQ=WEEKLY;BYDAY=TUE;BYHOUR=5;BYMINUTE=0',
   enabled    => TRUE
);
```

---

### RISK-SS-07 — `pwdverify.DICTIONARY` Schema Dependency
**Severity: HIGH — Application will fail to change passwords if schema doesn't exist**

`Verify_Function.fun` queries `pwdverify.DICTIONARY` to check if new passwords are dictionary words. This is a non-standard schema dependency — if the `pwdverify` schema and its `DICTIONARY` table are not present in the Oracle 19c target, every call to `CHANGE_PASSWORD` will throw `ORA-00942`.

**Fix:**
1. Inventory whether `pwdverify.DICTIONARY` exists in the source 11g database
2. If it does, include it in the migration script
3. Add a defensive `EXECUTE IMMEDIATE` wrapper with exception handling so password changes succeed even if the dictionary check fails
4. Consider replacing with Oracle's built-in `ORA12C_STRONG_PASSWORD_VERIFY_FUNCTION` complexity rules

---

### RISK-SS-08 — `@LCD_ITES` Database Link in Production Code
**Severity: HIGH — All dependent queries will fail if link is absent**

`PAYEDIT2.SQL` contains a cursor that queries the remote ITES database:
```sql
SELECT NVL(sal_curncy_ind,'USD'), ...
  FROM lcd.worker, ITES.IT_ORGANIZATION@LCD_ITES
 WHERE org_code = pg_org_code AND worker_id = pg_worker_id
```

ArchiveAndDeleteEtesAdjustments.sql also makes remote procedure calls:
```sql
ites.ad_Management.p_ArchiveAdjustments@LCD_ITES(pi_worker, pi_end, ...);
ites.ad_TimeDisplay.p_DeleteAD@LCD_ITES(pi_tsGUID);
```

**Fix:**
1. After Oracle 19c migration, DBA must recreate the `LCD_ITES` DB link
2. Verify the remote ITES database is also on Oracle 12c+ (cross-version DB links to 11g are unsupported in 19c)
3. Test all cross-schema queries end-to-end before go-live

---

### RISK-SS-09 — Package Global State (Session Reuse Risk)
**Severity: HIGH — Data leakage potential in pooled connection environments**

`PAYEDIT2.SQL` initializes package-level global variables with dummy values:
```sql
pg_org_code   lcd.toe_attabs_map.org_code%TYPE := '111';
pg_worker_id  lcd.worker.worker_id%TYPE        := 'AAAAAAAAAA';
```

In Oracle 19c environments using connection pooling (Database Resident Connection Pooling / DRCP or application-level pools), a session may be reused by a different user without re-initializing package state. If `pg_org_code` or `pg_worker_id` is set by one user's call and another user reuses the session, the second user's validation may incorrectly use the first user's context.

**Fix:** Remove package globals; pass org and worker context as `IN` parameters to each function. Alternatively, reset package state explicitly in each entry-point procedure.

---

### RISK-SS-10 — Date String Literal as Default Parameter
**Severity: HIGH — Will fail with `ORA-01858` if NLS_DATE_FORMAT changes**

`PAYEDIT.SQL` declares a default date parameter using a string literal:
```sql
p_end_date IN DATE := '11-NOV-97'
```

Oracle resolves this at parse time using the session's `NLS_DATE_FORMAT`. If the 19c instance has a different `NLS_DATE_FORMAT` than the 11g source, this will throw `ORA-01858: a non-numeric character was found where a numeric was expected` at package compilation time.

**Fix:**
```sql
-- Before
p_end_date IN DATE := '11-NOV-97'

-- After
p_end_date IN DATE := TO_DATE('11-NOV-97','DD-MON-YY')
-- Or preferably use a named constant
p_end_date IN DATE := TO_DATE('19971101','YYYYMMDD')
```

---

### RISK-SS-11 — Missing `AUTHID` Clause on All Procedures/Packages
**Severity: MEDIUM — Implicit DEFINER rights; privilege escalation risk**

Every package and standalone procedure/function in the codebase is missing an explicit `AUTHID` clause. Without it, Oracle defaults to `AUTHID DEFINER` — the object executes with the privileges of its owner (`LCD`), not the calling user. In Oracle 19c's security model this is considered a privilege escalation risk for any package that executes dynamic SQL.

**Fix:** For packages that build dynamic SQL (Change_Password, p_copy_tables), explicitly add:
```sql
CREATE OR REPLACE PROCEDURE lcd.p_copy_tables(...)
AUTHID CURRENT_USER  -- executes with caller's privileges
IS ...
```
For pure data-access packages that don't build dynamic SQL, `AUTHID DEFINER` (the default) is acceptable — but should be made explicit for clarity.

---

### RISK-SS-12 — `BINARY_INTEGER` Type (Deprecated Alias)
**Severity: MEDIUM — Supported in 19c but flagged by Oracle's code advisor**

Multiple array type declarations use `INDEX BY BINARY_INTEGER`:
```sql
TYPE rec_del_type IS TABLE OF VARCHAR2(1) INDEX BY BINARY_INTEGER;
TYPE arr_parms_type IS TABLE OF ... INDEX BY BINARY_INTEGER;
```

`BINARY_INTEGER` is a supported alias for `PLS_INTEGER` in 19c but Oracle's own documentation and the PL/SQL code advisor recommend `PLS_INTEGER` as the canonical type.

**Fix:** Global search-and-replace `BINARY_INTEGER` → `PLS_INTEGER` in all package specifications and bodies.

---

### RISK-SS-13 — `DBMS_OUTPUT` in Production Code
**Severity: MEDIUM — Not a runtime error, but produces unexpected output in 19c environments**

`PAYEDIT2.SQL` alone has 100+ `DBMS_OUTPUT.PUT_LINE` calls; `TIMEEDIT.SQL` has 26+; `TIMEEDIT_extended.SQL` has 30+; `PKGBDIST.SQL` has multiple. In Oracle 19c:
- If `SERVEROUTPUT` is ON for a session, these produce unintended output in PowerBuilder applications that parse return strings
- They represent debugging code that was never removed from production builds

**Fix:** Wrap in a conditional debug flag or create a `DEBUG.LOG` wrapper procedure:
```sql
-- Add to GLOBALS package
g_debug BOOLEAN := FALSE;

-- Replace DBMS_OUTPUT calls with:
IF lcd.globals.g_debug THEN DBMS_OUTPUT.PUT_LINE(...); END IF;
```

---

### RISK-SS-14 — `GOTO` Statement in `TIMEEDIT_extended.SQL`
**Severity: MEDIUM — Syntactically valid but logically error-prone**

`TIMEEDIT_extended.SQL` contains a `GOTO` statement as a control flow mechanism:
```sql
GOTO CONT;
<<CONT>>
```

`GOTO` is syntactically valid in Oracle 19c PL/SQL but its use is discouraged and can create unreachable code paths. Oracle's own PL/SQL style guide recommends using `IF/ELSIF/ELSE` or `CONTINUE` (available since Oracle 11g).

**Fix:** Refactor the `GOTO` branch into a standard conditional structure.

---

### RISK-SS-15 — `CHAR`-Type SMF Record in `Globals_spec.sql` (Character Set Risk)
**Severity: MEDIUM — Risk if database migrates from WE8ISO8859P1 to AL32UTF8**

The `SMF_TYPE` record in `Globals_spec.sql` declares all 47 fields as `CHAR`:
```sql
TYPE smf_type IS RECORD (
   org_code    CHAR(3),
   ssn         CHAR(9),
   ...
```

If the Oracle 19c migration also involves a character set conversion (e.g., from `WE8ISO8859P1` to `AL32UTF8`), multi-byte characters in CHAR fields will consume more bytes than single-byte, causing data truncation or `ORA-12899: value too large` errors. The SMF record is used throughout the distribution and time processing logic.

**Fix:** Confirm the target 19c database character set. If changing to AL32UTF8, convert CHAR fields in SMF_TYPE to VARCHAR2 and audit all CHAR column definitions in the LCD schema DDL.

---

## Summary Table

| Risk ID | Category | Severity | Files | Action |
|---------|----------|----------|-------|--------|
| RISK-SS-01 | `DBMS_PIPE` in batch framework | **CRITICAL** | BATCH1.SQL, LCD_BTCH.SQL | Replace with Oracle AQ |
| RISK-SS-02 | `UTL_FILE` hardcoded paths | **CRITICAL** | 10g_packages.sql, AddPayImp.sql | Create `DIRECTORY` objects |
| RISK-SS-03 | SQL injection in password change | **CRITICAL** | Change_Password.sql | Use `DBMS_ASSERT.SIMPLE_SQL_NAME` |
| RISK-SS-04 | SQL injection + `DBMS_SQL.V7` | **CRITICAL** | p_copy_tables.SQL | Whitelist tables; remove V7 constant |
| RISK-SS-05 | `(+)` outer join in server PL/SQL | **CRITICAL** | f_recalculate_labor.fun, PKGBDIST.SQL | Convert to ANSI JOIN |
| RISK-SS-06 | `SYS.DBMS_JOB` still active | **HIGH** | NPS_Departments_Job_Scheduler…sql | Migrate to `DBMS_SCHEDULER` |
| RISK-SS-07 | `pwdverify.DICTIONARY` missing | **HIGH** | Verify_Function.fun | Migrate schema or add fallback |
| RISK-SS-08 | `@LCD_ITES` DB link dependency | **HIGH** | PAYEDIT2.SQL, ArchiveAndDelete…sql | Recreate link post-migration |
| RISK-SS-09 | Package global state reuse | **HIGH** | PAYEDIT2.SQL | Refactor to IN parameters |
| RISK-SS-10 | Date string literal default | **HIGH** | PAYEDIT.SQL | Wrap in explicit `TO_DATE()` |
| RISK-SS-11 | Missing `AUTHID` clause | **MEDIUM** | All 8+ packages | Add explicit AUTHID |
| RISK-SS-12 | `BINARY_INTEGER` deprecated alias | **MEDIUM** | BATCH1.SQL, TIMEPR1.SQL, PKG_DIST.SQL | Replace with `PLS_INTEGER` |
| RISK-SS-13 | `DBMS_OUTPUT` in production | **MEDIUM** | PAYEDIT2, TIMEEDIT, PKGBDIST | Add debug flag guard |
| RISK-SS-14 | `GOTO` statement | **MEDIUM** | TIMEEDIT_extended.SQL | Refactor to `IF/ELSE` |
| RISK-SS-15 | `CHAR` SMF record (charset risk) | **MEDIUM** | Globals_spec.sql | Audit if character set changes |

**Also confirmed safe (no migration risk):** Oracle sequences (`NEXTVAL`/`CURRVAL`), `DBMS_SCHEDULER` (already used in BATCH2/BATCH3), `DECODE` function, `NVL`/`NVL2`, static cursor patterns, `%TYPE` / `%ROWTYPE` column-anchored types.

---

**Relevant files to create/modify:**
- Save report to: `LCD-Oracle/docs/reports/ORACLE_19C_SERVER_SIDE_MIGRATION_RISK_ANALYSIS.md`
- Key source files: BATCH1.SQL, LCD_BTCH.SQL, 10g_packages.sql, Change_Password.sql, p_copy_tables.SQL, f_recalculate_labor.fun, PAYEDIT.SQL, PAYEDIT2.SQL, Verify_Function.fun

**Verification:**
1. Confirm reports directory exists (it does — `list_dir` showed reports subfolder)
2. Validate all 15 risk items are in the file with source file links
3. Cross-reference with the GUI-layer report — RISK-01 (TRIM on outer join) maps to RISK-SS-05 here; both need ANSI JOIN migration
4. Deliver both reports to: DB Migration team (SS-01 through SS-10), Security team (SS-03, SS-04, SS-09)

**Decisions:**
- Scope includes only files in SQL; the SQL-Interfaces-Support-Library (GVR, CPI, FACTS, etc.) is a separate system and should have its own audit
- BATCH2.SQL and BATCH3.SQL DBMS_SCHEDULER migrations are noted as **already complete** — not listed as risks
- cmpllcd.sql is the master compile script; the `@@` include chain is the deployment mechanism and should be reviewed for completeness before 19c migration but is not itself a risk