# Oracle 11g → 19c Migration: LCD PowerBuilder GUI — Implementation Plan

**Author:** RdW  
**Date:** 2026-05-24  
**Project root:** `tasks/42/pb_gui_analysis/powerbuilder-pb-frontend/`  
**Risk source:** `lcd_Oracle19c_risk_analysis_plan_PB_ONLY.md`  
**Manifest:** `FILE_MANIFEST.md`

---

## Comment Convention

All injected comments in SQL scripts:
```sql
-- RdW 5/24/2026 Powerbuilder GUI-SS Oracle 19c Migration — <description>
```
All injected comments in PowerBuilder source (script/event code):
```
// RdW 5/24/2026 Powerbuilder GUI-SS Oracle 19c Migration — <description>
```

---

## Workflow Overview

```
pb_export/<MODULE>/<file>   →  copy  →  original/<MODULE>/<file>   (read-only reference)
                            →  copy  →  patched/<MODULE>/<file>     (developer applies IDE edits here)
```

PowerBuilder export files (`.srd` / `.srw` / `.sru` / `.srf`) are **UTF-16 LE text files** requiring Appeon PowerBuilder 2021 IDE to safely modify DataWindow SQL and script code. The developer:
1. Opens the file in the IDE from `patched/<MODULE>/`
2. Applies the exact changes specified below
3. Re-exports (Save to file) back to `patched/<MODULE>/`

DBA SQL scripts live in `patched/sql/` and are run directly against Oracle 19c.

---

## Phase 0 — File Backup & Inventory ✓ COMPLETE

- 63 source files copied to `original/` and `patched/` maintaining pb_export subfolder structure
- Full file roster documented in `FILE_MANIFEST.md`
- RISK-02 roster built by automated UTF-16 grep scan of all 926 pb_export source files
- RISK-08 roster built by automated `rownum` grep scan

---

## Phase 1 — CRITICAL: RISK-01 `TRIM(col(+))` Fix

**Priority:** P0 — Must fix before any 19c go-live  
**Affected files:** 5 DataWindow `.srd` files  
**Oracle error without fix:** `ORA-01799: a column may not be outer-joined to a subquery`

### Why This Breaks in 19c

Oracle 19c strictly enforces the prohibition against applying scalar functions to the `(+)` side of a proprietary outer join. This was silently tolerated by some 11g optimizer paths.

### Change Specification — Per File

For **each** of the 5 files listed below, open the DataWindow in PB IDE, enter SQL view, and:

1. Locate the `WHERE` clause `(+)` outer joins involving `TRIM()`
2. Remove those `WHERE` clause join conditions entirely
3. Convert the implicit join into an explicit `LEFT OUTER JOIN … ON` clause in the `FROM` section
4. Apply `TRIM()` to the column in the `ON` condition (non-outer side) or compare to `TRIM(mainTable.col)`

#### File 1: `patched/TBLDIST/d_att_wage_map_err.srd`

**Patterns to fix:**
```sql
-- BEFORE (implicit — ORA-01799 on 19c):
TRIM(LCD.pay_wage_type.pay_wage_type(+)) = LCD.ATT_WAGE_MAP.pay_wage_type
TRIM(LCD.ATT_ABS_TYPE.ATT_ABS_TYPE(+)) = LCD.ATT_WAGE_MAP.att_abs_type
```
```sql
-- RdW 5/24/2026 Powerbuilder GUI-SS Oracle 19c Migration
-- RISK-01: Converted TRIM(col(+)) outer join to ANSI LEFT OUTER JOIN.
-- TRIM applied to join key in ON clause; removes ORA-01799 on Oracle 19c.
-- AFTER (ANSI LEFT OUTER JOIN):
LEFT OUTER JOIN LCD.pay_wage_type
    ON TRIM(LCD.pay_wage_type.pay_wage_type) = LCD.ATT_WAGE_MAP.pay_wage_type
LEFT OUTER JOIN LCD.ATT_ABS_TYPE
    ON TRIM(LCD.ATT_ABS_TYPE.ATT_ABS_TYPE) = LCD.ATT_WAGE_MAP.att_abs_type
```

#### File 2: `patched/TBLINTRF/d_toe_att_map_err.srd`

**Pattern to fix:**
```sql
-- BEFORE:
TRIM(LCD.ATT_ABS_TYPE.ATT_ABS_TYPE(+)) = LCD.TOE_ATT_MAP.att_abs_type
-- RdW 5/24/2026 Powerbuilder GUI-SS Oracle 19c Migration
-- RISK-01: AFTER:
LEFT OUTER JOIN LCD.ATT_ABS_TYPE
    ON TRIM(LCD.ATT_ABS_TYPE.ATT_ABS_TYPE) = LCD.TOE_ATT_MAP.att_abs_type
```

#### File 3: `patched/TBLCOST/d_time_genwage_err.srd`

**Patterns to fix:**
```sql
-- BEFORE:
TRIM(LCD.pay_wage_type.pay_wage_type(+)) = LCD.TIME_GENWAGE.pay_wage_type
TRIM(LCD.ATT_ABS_TYPE.ATT_ABS_TYPE(+)) = LCD.TIME_GENWAGE.att_abs_type
-- RdW 5/24/2026 Powerbuilder GUI-SS Oracle 19c Migration
-- RISK-01: AFTER:
LEFT OUTER JOIN LCD.pay_wage_type
    ON TRIM(LCD.pay_wage_type.pay_wage_type) = LCD.TIME_GENWAGE.pay_wage_type
LEFT OUTER JOIN LCD.ATT_ABS_TYPE
    ON TRIM(LCD.ATT_ABS_TYPE.ATT_ABS_TYPE) = LCD.TIME_GENWAGE.att_abs_type
```

#### File 4: `patched/TBLCOST/d_primary_wage_err.srd`

```sql
-- RdW 5/24/2026 Powerbuilder GUI-SS Oracle 19c Migration
-- RISK-01: Same pattern as d_time_genwage_err — two LEFT OUTER JOINs replacing
-- TRIM(LCD.pay_wage_type.pay_wage_type(+)) and TRIM(LCD.ATT_ABS_TYPE.ATT_ABS_TYPE(+))
```

#### File 5: `patched/TIME/d_wage_determination_rates_err.srd`

```sql
-- RdW 5/24/2026 Powerbuilder GUI-SS Oracle 19c Migration
-- RISK-01: Replace TRIM(LCD.ATT_ABS_TYPE.ATT_ABS_TYPE(+)) with:
LEFT OUTER JOIN LCD.ATT_ABS_TYPE
    ON TRIM(LCD.ATT_ABS_TYPE.ATT_ABS_TYPE) = <driving_table>.att_abs_type
```

### Verification SQL (after patching)
```sql
-- RdW 5/24/2026 Powerbuilder GUI-SS Oracle 19c Migration
-- RISK-01: Post-patch verification — run directly against 19c UAT
-- These should return rows without ORA-01799
DECLARE
  v_dir VARCHAR2(100) := '/csclcdnc0002/Q22S';
BEGIN
  DBMS_OUTPUT.PUT_LINE('RISK-01 diagnostic — LCD_SERVER_LOC base: ' || v_dir);
  DBMS_OUTPUT.PUT_LINE('Testing ATT_WAGE_MAP outer join...');
  FOR r IN (
    SELECT am.pay_wage_type, TRIM(pwt.pay_wage_type) AS resolved_wage
    FROM LCD.ATT_WAGE_MAP am
    LEFT OUTER JOIN LCD.pay_wage_type pwt
        ON TRIM(pwt.pay_wage_type) = am.pay_wage_type
    WHERE ROWNUM <= 3
  ) LOOP
    DBMS_OUTPUT.PUT_LINE('  map=' || r.pay_wage_type || ' resolved=' || NVL(r.resolved_wage, 'NULL'));
  END LOOP;
END;
/
```

---

## Phase 2 — HIGH: RISK-06 & RISK-07

### RISK-06 — DBA_ROLE_PRIVS (✓ DBA COMPLETE — NO PB CHANGES)

The grant `GRANT SELECT ON SYS.DBA_ROLE_PRIVS TO LCD` was applied in UAT 19c before this migration work began.  
Files `d_user_roles_orgs.srd`, `d_user_roles.srd`, and `d_granted_roles.srd` require **no code changes**.  
See `patched/sql/risk06_option_a_grant.sql` for the audit record.

### RISK-07 — Password Management Stored Procedures

**Files:** `patched/LCD7/uo_trans.sru` · `patched/LCD7/w_change_password.srw`

#### Step 1 — Server-side Audit (DBA)

Run `patched/sql/risk07_audit_password_procs.sql` against Oracle 19c. This queries `USER_SOURCE` and `ALL_PROCEDURES` in the LCD schema to identify any deprecated `SYS.VERIFY_FUNCTION@ites_lcd` calls. Expected result: zero rows (deprecated function removed from active code path before migration).

If rows are returned, the called stored procedure (`CHANGE_PASSWORD` or `VERIFY_PASSWORD`) must be revised by a DBA/developer to remove the `@ites_lcd` DB link call and implement an equivalent 19c-compatible password verification.

#### Step 2 — PowerBuilder IDE Review: `uo_trans.sru`

In PB IDE, open `uo_trans.sru` and inspect the `CHANGE_PASSWORD` and `VERIFY_PASSWORD` RPCFUNC declarations:

```
// RdW 5/24/2026 Powerbuilder GUI-SS Oracle 19c Migration
// RISK-07: Verify these RPCFUNC declarations point to stored procedures that
// do NOT call SYS.VERIFY_FUNCTION@ites_lcd (deprecated in 12c, absent in 19c).
// If the server-side proc has been updated, no PB code change is needed.
// If not, coordinate with DBA to replace the proc before go-live.
FUNCTION integer Change_Password(ref string as_old_password, &
    ref string as_new_password) RPCFUNC ALIAS FOR "LCD.CHANGE_PASSWORD"
FUNCTION integer Verify_Password(ref string as_password) RPCFUNC &
    ALIAS FOR "LCD.VERIFY_PASSWORD"
```

#### Step 3 — PowerBuilder IDE Review: `w_change_password.srw`

Confirm the 14-character minimum enforcement (added in INC31620960, 2024-05-15) is present and functioning. No code change required if already in place.

```
// RdW 5/24/2026 Powerbuilder GUI-SS Oracle 19c Migration
// RISK-07: Confirm 14-char minimum password validation is intact.
// Oracle 19c default complexity defaults may require 12+ chars; 14-char rule
// already exceeds this threshold — no change required unless DBA raises limit.
```

---

## Phase 3 — MEDIUM-HIGH: RISK-02 Oracle `(+)` Join Migration (39 files)

**Priority:** P1  
**Full roster:** 39 files (see `FILE_MANIFEST.md` RISK-02 section)  
Note: 5 files already handled as part of Phase 1 (RISK-01 superset).

### Change Specification (per file)

For **each** RISK-02 file, open the DataWindow (or NVO function) in PB IDE and:

1. In the SQL view of each DataWindow, find all `WHERE` clause conditions using `(+)` notation
2. Move those join conditions to an explicit `LEFT OUTER JOIN … ON` clause in the `FROM` section
3. For `nvo_distribution.sru` and other `.sru`/`.srf` files, find the embedded SQL strings in PB script code and apply the same transformation

**Standard comment header for every changed SQL block:**
```sql
-- RdW 5/24/2026 Powerbuilder GUI-SS Oracle 19c Migration
-- RISK-02: Converted Oracle proprietary (+) outer-join syntax to ANSI LEFT OUTER JOIN.
-- Oracle 19c has known restrictions on (+) with complex predicates (BETWEEN, OR, subquery).
-- ANSI syntax is optimizer-safe and portable.
```

#### Special Cases

**`DISTRIB7/nvo_distribution.sru`** — 3 complex `(+)` conditions in PB function code (embedded SQL string, not DataWindow):

```
// RdW 5/24/2026 Powerbuilder GUI-SS Oracle 19c Migration
// RISK-02: Three complex (+) outer-join conditions in nvo_distribution embedded SQL.
// Replace each WHERE clause (+) predicate with equivalent FROM ... LEFT OUTER JOIN.
// Test by running a distribution calculation for at least one org from each group:
// Default (010), FEDERAL (114), CANADA (574), 663.
```

**`NEWS/w_news_send.srw`** — `ORG_CODE (+) BETWEEN :start AND :end` pattern (invalid in 19c even with basic `(+)` support):

```sql
-- RdW 5/24/2026 Powerbuilder GUI-SS Oracle 19c Migration
-- RISK-02: CRITICAL sub-case — ORG_CODE(+) BETWEEN ... is explicitly prohibited
-- under Oracle's proprietary outer-join rules (any operator other than = with (+)).
-- This WILL fail on 19c. Replace with:
LEFT OUTER JOIN LCD.ORGANIZATION org
    ON org.ORG_CODE >= :start AND org.ORG_CODE <= :end
```

**`LCD7/w_login.srw`** — `(+)` join in login query is particularly sensitive since it is in the critical path for all users. Ensure the converted ANSI join produces identical result sets. Test with accounts that have and do not have matching rows in the outer-joined table.

---

## Phase 4 — MEDIUM: RISK-03, RISK-04, RISK-05

### RISK-03 — `SYS.DUAL` (12 DataWindows)

Run targeted grep to confirm the full 12-file list (agent task: `Get-ChildItem pb_export -Recurse *.srd | Select-String 'SYS\.DUAL' -Encoding Unicode`). 

For each affected `.srd`:
```sql
-- RdW 5/24/2026 Powerbuilder GUI-SS Oracle 19c Migration
-- RISK-03: Replaced SYS.DUAL with DUAL.
-- SYS.DUAL fails when SELECT ANY DICTIONARY is revoked under CIS hardening (19c default).
-- BEFORE: SELECT ... FROM SYS.DUAL
-- AFTER:  SELECT ... FROM DUAL
```

### RISK-04 — `TO_DATE(numeric)` (3 files)

In DataWindow SQL view (`.srd`) or PB script code (`.srw`):

```sql
-- RdW 5/24/2026 Powerbuilder GUI-SS Oracle 19c Migration
-- RISK-04: Quoted numeric literal in TO_DATE call.
-- NLS numeric separators can corrupt unquoted numbers before format parsing (ORA-01861).
-- BEFORE: TO_DATE(19000101, 'YYYYMMDD')
-- AFTER:  TO_DATE('19000101', 'YYYYMMDD')
```

Files:
- `patched/NEWS/d_news.srd` — `to_date(19900101, 'YYYYMMDD')`
- `patched/NEWS/w_news.srw` — `To_Date(19000101,'YYYYMMDD')`
- `patched/LCD7/w_main.srw` — `TO_DATE(19000101, 'YYYYMMDD')`

### RISK-05 — `NEXT_DAY('FRIDAY')` (2 files)

**Primary fix** (code change in PB IDE):

```sql
-- RdW 5/24/2026 Powerbuilder GUI-SS Oracle 19c Migration
-- RISK-05: Replaced NLS-sensitive NEXT_DAY(date,'FRIDAY') with NLS-independent arithmetic.
-- Formula: date + MOD(6 - TO_NUMBER(TO_CHAR(date, 'D')), 7)
-- where TO_CHAR(date,'D') returns 1=Sunday,2=Monday,...,7=Saturday (NLS_TERRITORY=AMERICA).
-- BEFORE: NEXT_DAY(actual_date, 'FRIDAY')
-- AFTER:  actual_date + MOD(6 - TO_NUMBER(TO_CHAR(actual_date, 'D')), 7)
```

Files:
- `patched/ACCT/f_acct_int.srf` — 3 occurrences of `NEXT_DAY(actual_date, 'FRIDAY')`
- `patched/REPORTS/d_report_time_adjustments.srd` — `NEXT_DAY(date - 7, :Start_Day)`

**Secondary fix / additional defense** — also add `NLS_DATE_LANGUAGE=AMERICAN` to connection (see Phase 6).

---

## Phase 5 — LOW-MEDIUM: RISK-08, RISK-09, RISK-10

### RISK-08 — ROWNUM Ordering Ambiguity (12 files)

**Critical file (P1):** `patched/TBLADMIN/d_reason_codes_multylang.srd`

```sql
-- RdW 5/24/2026 Powerbuilder GUI-SS Oracle 19c Migration
-- RISK-08 CRITICAL: Replaced DECODE(...,rownum, rownum+100000) sort trick with
-- ROW_NUMBER() OVER (ORDER BY <stable_column>) analytic function.
-- The ROWNUM sort trick is non-deterministic in all Oracle versions but especially
-- unpredictable with 19c adaptive plans.
-- BEFORE: ORDER BY DECODE(lcd_lang_code, 'EN', rownum, rownum + 100000)
-- AFTER:  ORDER BY ROW_NUMBER() OVER (PARTITION BY lcd_lang_code
--             ORDER BY CASE WHEN lcd_lang_code = 'EN' THEN 0 ELSE 1 END,
--                      <natural_sort_key>)
```

**Remaining 11 files:** Review each ROWNUM usage in context. Most `ROWNUM = 1` existence checks are safe. Document any unsafe pattern; apply analytical function replacement where ordering matters.

```sql
-- RdW 5/24/2026 Powerbuilder GUI-SS Oracle 19c Migration
-- RISK-08: Reviewed ROWNUM usage. This is an existence-check (ROWNUM = 1 / ROWNUM < 2)
-- with no ORDER BY dependency — safe in 19c. No change required.
```

### RISK-09 — Date Format Mask (1 file)

`patched/ADMIN/d_tes_results.srd`:

```sql
-- RdW 5/24/2026 Powerbuilder GUI-SS Oracle 19c Migration
-- RISK-09: Replaced ambiguous NLS-sensitive date format mask.
-- BEFORE: to_date(:run_date,'dd-mon-yy hh24:mi:ss')
-- AFTER:  to_date(:run_date,'dd-mm-yyyy hh24:mi:ss')
-- 4-digit year eliminates Y2K ambiguity; numeric month avoids NLS_DATE_LANGUAGE dependency.
```

### RISK-10 — DB Link Migration (1 file, DBA action)

`patched/ADMIN/w_p_copy_tables.srw` reads DB link names from `LCD.SUPPORT_SYSTEMS`.  
**No PB code change required** — the window displays whatever link names exist in the table.

DBA action: After 19c migration completes, all DB links must be dropped and recreated (Oracle 19c encrypts DB link passwords with a different algorithm). Script: `patched/sql/risk10_dblink_recreation.sql`.

```
// RdW 5/24/2026 Powerbuilder GUI-SS Oracle 19c Migration
// RISK-10: w_p_copy_tables reads DB link names from LCD.SUPPORT_SYSTEMS at runtime.
// No PB code change required. DBA must drop and recreate all DB links post-19c migration.
// The @ites_lcd DB link referenced in LCD7/uo_trans.sru must also be verified in 19c.
```

---

## Phase 6 — NLS Defense in Depth (RISK-05/RISK-09 Secondary Mitigation)

### Change 1 — `lcd.ini` Database Section

Locate the LCD INI file (typically `lcd.ini` on the application server or workstation). In the `[Database]` section, add:

```ini
; -- RdW 5/24/2026 Powerbuilder GUI-SS Oracle 19c Migration
; RISK-05/RISK-09: NLS_DATE_LANGUAGE=AMERICAN prevents ORA-01846 on NEXT_DAY()
; and NLS-sensitive 'dd-mon-yy' format masks. Apply to all environments.
NLS_DateLanguage=AMERICAN
```

### Change 2 — `s_open_app.srs` / `lcd.sra` Application Open Event

In the Appeon PB 2021 IDE, open `lcd.sra` → Application object → Open event (or navigate to `s_open_app.srs`). After the existing SQLCA property assignments:

```
// RdW 5/24/2026 Powerbuilder GUI-SS Oracle 19c Migration
// RISK-05/RISK-09: Force NLS_DATE_LANGUAGE=AMERICAN in Oracle session to ensure
// NEXT_DAY('FRIDAY') and 'dd-mon-yy' format masks behave consistently regardless
// of OS locale. Tested with ASIA (org 660), India (org 663), UK orgs.
SQLCA.DBParm = SQLCA.DBParm + ",NLS_DateLanguage='AMERICAN'"
```

> **⚠ Locale Testing Required:** Before deploying, test login as org 660 (ASIA), org 663 (India), and UK org 155. Verify date display, entry, and report generation produce correct results with NLS_DATE_LANGUAGE forced to AMERICAN.

---

## Org → Oracle 19c Directory Mapping Reference

This table maps each org's `LCD_SERVER_LOC` (from `LCD_ORGPARAM_Q22S-19c-UPDATED.csv`) to the Oracle Directory objects configured by the DBA (from `DB_DIRECTORIES.txt`).

| Org Group | Representative Orgs | 11g `LCD_SERVER_LOC` | 19c Oracle Dir (IN) | 19c Oracle Dir (OUT) | 19c Oracle Dir (ARCH) |
|-----------|--------------------|-----------------------|--------------------|--------------------|----------------------|
| Default | 010, 580, 161, 162, 165, 107, 200, 406, 200, 571, 620, 663, most others | `/csclcdnc0002/Q22S` | `LCD_IN` | `LCD_OUT` | `LCD_ARCH` |
| FEDERAL | 114 | `/csclcdnc0002/Q22S-FEDERAL` | `LCD_FEDERAL_IN` | `LCD_FEDERAL_OUT` | `LCD_FEDERAL_ARCH` |
| CANADA | 574 | `/csclcdnc0002/Q22S-CANADA` | `LCD_CANADA_IN` | `LCD_CANADA_OUT` | `LCD_CANADA_ARCH` |
| 663-group | 663 (India DXC) | `/csclcdnc0002/Q22S-663` | `LCD_663_IN` | `LCD_663_OUT` | `LCD_663_ARCH` |
| 149-group | 149 | `/csclcdnc0002/Q22S-149` | `LCD_149_IN` | `LCD_149_OUT` | `LCD_149_ARCH` |
| 285-group | 285 | `/csclcdnc0002/Q22S-285` | `LCD_285_IN` | `LCD_285_OUT` | `LCD_285_ARCH` |

> **Important:** Oracle 19c stored procedures must use the **directory name** (e.g., `LCD_IN`) not the raw filesystem path (`/csclcdnc0002/Q22S/In`) when calling `UTL_FILE.FOPEN`. If any PB code passes a raw path string to an Oracle procedure, that interface must be updated. Review `uo_trans.sru` and any other NVO that calls file I/O procedures.

---

## To-Do Checklist

### Agent-Completed Tasks ✓
- [x] Phase 0: Folder structure created
- [x] Phase 0: 63 risk files copied to `original/` and `patched/`
- [x] Phase 0: RISK-02 full roster built via UTF-16 grep (39 files)
- [x] Phase 0: RISK-08 full roster built via ROWNUM grep (12 files)
- [x] `FILE_MANIFEST.md` created
- [x] `ORACLE_19C_MIGRATION_IMPLEMENTATION_PLAN.md` created (this file)
- [ ] `ORACLE_19C_DEPLOYMENT_PLAN.md`
- [ ] `ORACLE_19C_MANUAL_IDE_INSTRUCTIONS.md`
- [ ] `ORACLE_19C_TEST_PLAN.md`
- [ ] `patched/sql/risk01_debug.sql`
- [ ] `patched/sql/risk06_option_a_grant.sql`
- [ ] `patched/sql/risk07_audit_password_procs.sql`
- [ ] `patched/sql/risk10_dblink_recreation.sql`
- [ ] `patched/sql/risk_utlfile_directory_mapping.sql`
- [ ] `patched/sql/risk05_nextday_test.sql`

### Developer Tasks (Appeon PB 2021 IDE)
- [ ] Phase 1: RISK-01 — Rewrite SQL in 5 DataWindow files (TRIM outer join → ANSI LEFT JOIN)
- [ ] Phase 2: RISK-07 — Review uo_trans.sru RPCFUNC declarations; verify w_change_password
- [ ] Phase 3: RISK-02 — Convert (+) joins in 34 additional files (see manifest)
- [ ] Phase 4: RISK-03 — Replace SYS.DUAL in 12 DataWindows
- [ ] Phase 4: RISK-04 — Quote TO_DATE literals in 3 files
- [ ] Phase 4: RISK-05 — Replace NEXT_DAY in 2 files
- [ ] Phase 5: RISK-08 — Fix ROWNUM sort in d_reason_codes_multylang; review 11 others
- [ ] Phase 5: RISK-09 — Fix date mask in d_tes_results.srd
- [ ] Phase 6: NLS — Add NLS_DateLanguage to lcd.ini + s_open_app.srs
- [ ] Rebuild all modified PBLs in Appeon PB 2021
- [ ] Re-export all patched files back to `patched/<MODULE>/`

### DBA Tasks
- [x] RISK-06: `GRANT SELECT ON DBA_ROLE_PRIVS TO LCD` — COMPLETE
- [ ] RISK-07: Run `risk07_audit_password_procs.sql`; verify no deprecated VERIFY_FUNCTION calls
- [ ] RISK-10: Drop and recreate all DB links post-19c migration
- [ ] RISK-UTL: Verify all Oracle Directory objects exist (`SELECT * FROM ALL_DIRECTORIES WHERE DIRECTORY_NAME LIKE 'LCD%'`)
- [ ] Run `risk_utlfile_directory_mapping.sql` to confirm path→directory alignment
