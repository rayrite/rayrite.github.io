# Oracle 19c Migration: LCD GUI — Manual Appeon PowerBuilder 2021 IDE Instructions

**Author:** RdW  
**Date:** 2026-05-24  
**IDE:** Appeon PowerBuilder 2021 (Build 2021 R3 or later)  
**Reference:** `ORACLE_19C_MIGRATION_IMPLEMENTATION_PLAN.md` for change specifications

---

## Part A — Step-by-Step Manual IDE Instructions

This section provides exact steps to implement each code change using the Appeon PowerBuilder 2021 IDE.

---

### How to Open a File from `patched/`

Because the patched copies live outside the normal PBL workspace, the recommended workflow is:

1. Open Appeon PowerBuilder 2021
2. In the System Tree (left panel), navigate to the PBL that contains the object to edit
3. Right-click the object → **Export** → export the current version to a temp folder (for reference)
4. Make the code changes **within the PBL** using the IDE painter/script editor
5. After saving, right-click the object → **Export** → export back to `patched/<MODULE>/<filename>` to update the patched copy

> **Tip:** You can also import the `patched/` copy directly: right-click the PBL → **Import** → select the file. This replaces the in-library copy. Always rebuild after import.

---

### A1 — Fixing `TRIM(col(+))` Outer Joins in DataWindows (RISK-01)

**Applies to:** `d_att_wage_map_err.srd`, `d_toe_att_map_err.srd`, `d_time_genwage_err.srd`, `d_primary_wage_err.srd`, `d_wage_determination_rates_err.srd`  
**Error fixed:** ORA-01799

#### Step-by-Step

1. In System Tree, expand the relevant PBL (e.g., `TBLDIST.pbl`)
2. Double-click the DataWindow object (e.g., `d_att_wage_map_err`) to open in **DataWindow Painter**
3. Click **Design** → **Data Source** (or press **Ctrl+D**) to enter SQL view
4. The SQL Source window opens showing the current SELECT statement
5. Locate the `WHERE` clause containing patterns like:
   ```sql
   TRIM(LCD.pay_wage_type.pay_wage_type(+)) = LCD.ATT_WAGE_MAP.pay_wage_type
   ```
6. Click the **SQL** tab (or **Syntax** button) to enter free-form SQL mode if the visual join diagram is showing
7. In free-form SQL mode, restructure the query:
   - Remove the `TRIM(col(+)) = ...` line from the `WHERE` clause entirely
   - In the `FROM` clause, add:
     ```sql
     LEFT OUTER JOIN LCD.pay_wage_type
         ON TRIM(LCD.pay_wage_type.pay_wage_type) = LCD.ATT_WAGE_MAP.pay_wage_type
     ```
   - Add the comment header immediately before the new JOIN lines (use `/* */` block comment since DataWindow SQL does not support `--` inline comments reliably):
     ```sql
     /* RdW 5/24/2026 Powerbuilder GUI-SS Oracle 19c Migration
        RISK-01: Converted TRIM(col(+)) to ANSI LEFT OUTER JOIN. ORA-01799 fix. */
     ```
8. Click **Verify SQL** (the checkmark button) to validate syntax against the connected 19c database
   - **Expected:** "SQL syntax is valid"
   - **If error:** Re-check that all `(+)` references are removed from the WHERE clause
9. Click **OK** / **Return** to return to the DataWindow Painter
10. Press **Ctrl+S** to save
11. Right-click the object → **Export** → save to `patched/<MODULE>/<filename>.srd`

#### Common Mistakes
- Leaving any `(+)` in the WHERE clause after adding the LEFT JOIN — the optimizer will error
- Not selecting all columns correctly in the FROM clause after restructuring
- Forgetting to verify SQL before saving — always use the Verify button

---

### A2 — Converting General `(+)` Outer Joins (RISK-02)

**Applies to:** 39 files (see `FILE_MANIFEST.md`)  
**Procedure:** Same as A1 except no `TRIM()` wrapping is involved.

#### Step-by-Step

1. Open the DataWindow (`.srd`) or User Object/Function (`.sru`/`.srf`) in the IDE
2. For **DataWindows**: Use Design → Data Source → SQL tab
3. For **User Objects** (`.sru`) or **Functions** (`.srf`): Open Script Editor, find embedded SQL strings using Ctrl+F search for `(+)`
4. For each `(+)` condition in a `WHERE` clause:
   ```sql
   -- BEFORE (implicit outer join):
   WHERE TableA.col = TableB.col(+)
   
   -- AFTER (ANSI):
   FROM TableA
   LEFT OUTER JOIN TableB ON TableA.col = TableB.col
   ```
5. Special case — **`BETWEEN` with `(+)`** (`w_news_send.srw`):
   ```sql
   -- BEFORE (invalid in 19c):
   WHERE some_table.ORG_CODE (+) BETWEEN :start AND :end
   
   -- AFTER: Remove the (+), keep the BETWEEN on the outer table,
   -- and move the join condition to the ON clause:
   LEFT OUTER JOIN LCD.ORGANIZATION org
       ON org.ORG_CODE >= :start AND org.ORG_CODE <= :end
   ```
6. For `.sru` NVO functions with embedded SQL string variables:
   - Search script with Ctrl+F for `"(+)"` or the literal `(+)` in string concatenation
   - Edit the string to use ANSI join syntax
   - Test by calling the function from a test window connected to 19c
7. Add the comment block before each converted JOIN:
   ```sql
   /* RdW 5/24/2026 Powerbuilder GUI-SS Oracle 19c Migration
      RISK-02: Converted Oracle (+) syntax to ANSI LEFT OUTER JOIN. */
   ```
8. Verify SQL, save, and export to `patched/`

---

### A3 — Replacing `SYS.DUAL` with `DUAL` (RISK-03)

**Applies to:** `d_add_user_orgs.srd`, `d_reason_codes.srd`, `d_payroll_error.srd` and up to 9 others

#### Step-by-Step

1. Open the DataWindow in DataWindow Painter
2. Design → Data Source → SQL tab (free-form mode)
3. Use Ctrl+F to find `SYS.DUAL` (case-insensitive)
4. Replace each occurrence:
   ```sql
   -- BEFORE: SELECT ... FROM SYS.DUAL
   /* RdW 5/24/2026 Powerbuilder GUI-SS Oracle 19c Migration
      RISK-03: Replaced SYS.DUAL with DUAL. SYS.DUAL fails when
      SELECT ANY DICTIONARY is revoked under CIS hardening (19c default). */
   -- AFTER: SELECT ... FROM DUAL
   ```
5. Verify SQL → Save → Export to `patched/`

#### Bulk Discovery

To find all remaining SYS.DUAL files, run in PowerShell:
```powershell
Get-ChildItem "pb_export" -Recurse -Include "*.srd","*.srw" |
  Select-String -Pattern "SYS\.DUAL" -Encoding Unicode |
  Select-Object -ExpandProperty Path | Sort-Object -Unique
```

---

### A4 — Quoting `TO_DATE` Numeric Literals (RISK-04)

**Applies to:** `d_news.srd`, `w_news.srw`, `w_main.srw`

#### Step-by-Step (DataWindow `.srd`)

1. Open DataWindow → Design → Data Source → SQL tab
2. Find: `to_date(19000101,` or `to_date(19900101,` (unquoted number)
3. Replace:
   ```sql
   /* RdW 5/24/2026 Powerbuilder GUI-SS Oracle 19c Migration
      RISK-04: Quoted numeric literal in TO_DATE. Unquoted numbers can be
      corrupted by NLS numeric separators before format parsing (ORA-01861). */
   -- BEFORE: to_date(19900101, 'YYYYMMDD')
   -- AFTER:  to_date('19900101', 'YYYYMMDD')
   ```
4. Verify SQL → Save → Export

#### Step-by-Step (Window Script `.srw`)

1. Open the window (e.g., `w_main`) in Window Painter
2. Open Script Editor (F3 or right-click → Edit Script)
3. Use Edit → Find (Ctrl+F) → search for `To_Date(19` or `TO_DATE(19`
4. In the script code, locate the string/function call and add quotes around the numeric literal:
   ```
   // RdW 5/24/2026 Powerbuilder GUI-SS Oracle 19c Migration
   // RISK-04: Added quotes around TO_DATE numeric literal (ORA-01861 prevention)
   // BEFORE: ls_sql = "... TO_DATE(19000101, 'YYYYMMDD') ..."
   // AFTER:  ls_sql = "... TO_DATE('19000101', 'YYYYMMDD') ..."
   ```
5. Compile (F5), Save → Export

---

### A5 — Replacing `NEXT_DAY('FRIDAY')` (RISK-05)

**Applies to:** `f_acct_int.srf` (3 occurrences), `d_report_time_adjustments.srd` (1 occurrence)

#### Step-by-Step

**For `f_acct_int.srf` (Function object in ACCT.pbl):**

1. In System Tree, expand `ACCT.pbl` → open `f_acct_int` in Script Editor
2. Press Ctrl+F → search for `NEXT_DAY`
3. For each occurrence, replace the Oracle function call in the embedded SQL string:
   ```
   // RdW 5/24/2026 Powerbuilder GUI-SS Oracle 19c Migration
   // RISK-05: Replaced NLS-sensitive NEXT_DAY(date,'FRIDAY') with NLS-independent
   // date arithmetic. Formula gives next Friday from any date.
   // D=1(Sun)..7(Sat); 6-D gives offset to Friday; MOD handles wraparound.
   // BEFORE: NEXT_DAY(actual_date, 'FRIDAY')
   // AFTER:  actual_date + MOD(6 - TO_NUMBER(TO_CHAR(actual_date, 'D')), 7)
   ```
4. Apply the same replacement to all 3 occurrences in `f_acct_int.srf`
5. Compile → Save → Export to `patched/ACCT/f_acct_int.srf`

**For `d_report_time_adjustments.srd` (DataWindow):**

1. Open DataWindow in Painter → Design → Data Source → SQL tab
2. Find `NEXT_DAY(date - 7, :Start_Day)`
3. Replace:
   ```sql
   /* RdW 5/24/2026 Powerbuilder GUI-SS Oracle 19c Migration
      RISK-05: Replaced NEXT_DAY(:Start_Day) parameter with arithmetic.
      :Start_Day was 'FRIDAY' — hardcoded to equivalent arithmetic. */
   -- BEFORE: NEXT_DAY(date - 7, :Start_Day)
   -- AFTER:  (date - 7) + MOD(6 - TO_NUMBER(TO_CHAR((date - 7), 'D')), 7)
   ```
4. Remove the `:Start_Day` parameter from the DataWindow retrieve arguments if it was only used for this NEXT_DAY call
5. Verify SQL → Save → Export

---

### A6 — Fix ROWNUM Sort Trick (RISK-08 Critical)

**Applies to:** `d_reason_codes_multylang.srd`

#### Step-by-Step

1. Open `d_reason_codes_multylang` DataWindow in Painter
2. Design → Data Source → SQL tab
3. Find the ORDER BY clause using `DECODE(..., rownum, rownum + 100000)`
4. Replace with analytic `ROW_NUMBER()`:
   ```sql
   /* RdW 5/24/2026 Powerbuilder GUI-SS Oracle 19c Migration
      RISK-08: Replaced non-deterministic ROWNUM sort trick with ROW_NUMBER() analytic.
      ROWNUM-based ordering is unpredictable with Oracle 19c adaptive plans.
      English records (lcd_lang_code='EN') should sort first, others after. */
   -- BEFORE: ORDER BY DECODE(lcd_lang_code, 'EN', rownum, rownum + 100000)
   -- AFTER (add as computed column or use in ORDER BY):
   ORDER BY CASE WHEN lcd_lang_code = 'EN' THEN 0 ELSE 1 END,
            <natural_sort_key_column>
   ```
   
   > If the DataWindow painter does not allow complex ORDER BY expressions, add a computed column named `sort_order` with expression `If(lcd_lang_code = 'EN', 0, 1)` and sort by that column.

5. Verify SQL → Save → Export

**For remaining ROWNUM files (11 files):** Review each ROWNUM usage. If it is a simple existence check (`WHERE ROWNUM = 1` or `WHERE ROWNUM < 2`) with no ordering dependency, no change is required — add a comment:
```sql
/* RdW 5/24/2026 Powerbuilder GUI-SS Oracle 19c Migration
   RISK-08: Reviewed — ROWNUM used only as existence check. No ORDER BY
   dependency. Safe in Oracle 19c. No code change required. */
```

---

### A7 — Fix Date Format Mask (RISK-09)

**Applies to:** `d_tes_results.srd` (in ADMIN PBL)

1. Open `d_tes_results` DataWindow → Design → Data Source → SQL tab
2. Find: `to_date(:run_date,'dd-mon-yy hh24:mi:ss')`
3. Replace:
   ```sql
   /* RdW 5/24/2026 Powerbuilder GUI-SS Oracle 19c Migration
      RISK-09: Replaced 'dd-mon-yy' with 'dd-mm-yyyy'. 
      'mon' is NLS-dependent (month name abbreviation); 'yy' is ambiguous 2-digit year.
      Numeric month and 4-digit year are portable across all NLS settings. */
   -- AFTER: to_date(:run_date,'dd-mm-yyyy hh24:mi:ss')
   ```
4. Update the DataWindow retrieve argument format hint for `:run_date` to reflect `dd-mm-yyyy hh24:mi:ss`
5. Verify SQL → Save → Export

---

### A8 — Add NLS Defense in Depth (RISK-05/RISK-09 Secondary)

**Applies to:** `lcd.sra` application object (or `s_open_app.srs`)

#### Step-by-Step

1. In System Tree, expand the application PBL → open `lcd` application object
2. Open the **Application** → **Open** event (where SQLCA is configured)
3. Locate the block where `SQLCA.DBParm` is set (e.g., `SQLCA.DBParm = "..."`)
4. Immediately after that line, add:
   ```
   // RdW 5/24/2026 Powerbuilder GUI-SS Oracle 19c Migration
   // RISK-05/RISK-09: Force NLS_DATE_LANGUAGE=AMERICAN in Oracle session.
   // Prevents ORA-01846 on NEXT_DAY('FRIDAY') and NLS-sensitive date format masks.
   // Test with: org 660 (ASIA), org 663 (India), org 155/157/158/159 (UK) before deploying.
   SQLCA.DBParm = SQLCA.DBParm + ",NLS_DateLanguage='AMERICAN'"
   ```
5. If `s_open_app.srs` is a separate structure/function that sets SQLCA, add the same line there instead
6. Compile → Save → Export `lcd.sra` to `patched/` root

---

## Part B — Changes That Cannot Be Automated and Must Be Done Manually

The following items have **no automated path** and require either manual DBA action or hands-on IDE review with domain knowledge.

---

### B1 — RISK-07: Server-Side Password Procedure Audit

**Why manual:** The PB GUI calls `LCD.CHANGE_PASSWORD` and `LCD.VERIFY_PASSWORD` via RPCFUNC. Whether those Oracle stored procedures internally call `SYS.VERIFY_FUNCTION@ites_lcd` can only be determined by a DBA reviewing the Oracle package source in the database.

**Steps:**

1. DBA connects to Oracle 19c as a user with DBA privileges
2. Run `patched/sql/risk07_audit_password_procs.sql`
3. If rows are returned showing `SYS.VERIFY_FUNCTION` references:
   a. Identify the package/procedure containing the call
   b. Rewrite the password validation logic using `DBMS_METADATA.GET_DDL` to retrieve the current proc definition
   c. Replace the deprecated verify function with 19c-compatible validation (e.g., custom PL/SQL check or `ORA12C_STRONG_VERIFY_FUNCTION`)
   d. Recompile the package: `ALTER PACKAGE LCD.SECURITY_PKG COMPILE;`
4. After server-side fix, re-test via LCD GUI: Administration → Change Password → change to a new valid password

**Expected result from audit:** Zero rows (assuming `SYS.VERIFY_FUNCTION@ites_lcd` was removed before the 19c migration).

---

### B2 — RISK-10: DB Link Recreation

**Why manual:** Oracle 19c changes the encryption algorithm for DB link passwords. All existing DB links must be dropped and manually recreated by a DBA with knowledge of the target database credentials.

**Steps:**

1. DBA exports current DB link definitions from 11g before migration:
   ```sql
   SELECT 'CREATE DATABASE LINK ' || DB_LINK || ' CONNECT TO ' ||
          USERNAME || ' IDENTIFIED BY <password> USING ''' || HOST || ''';'
   FROM USER_DB_LINKS;
   ```
2. After 19c migration, run `patched/sql/risk10_dblink_recreation.sql` which drops existing links and recreates them
3. Provide actual passwords for each link (not stored in the script for security)
4. Test each link: `SELECT 1 FROM DUAL@<linkname>;`
5. Specifically verify `@ites_lcd` used by `LCD7/uo_trans.sru`

**Troubleshooting:**
- `ORA-02085: database link connects to ...` — link created with wrong service name. Recreate with correct `USING 'tnsalias'`
- `ORA-01017: invalid username/password` — credentials changed in 19c. Obtain fresh credentials from target DBA
- `ORA-12541: no listener` — target database not yet migrated or wrong TNS alias

---

### B3 — RISK-02 Complex Join Review in `nvo_distribution.sru`

**Why partially manual:** The 3 complex `(+)` conditions in `nvo_distribution.sru` are in PB PowerScript function code (embedded SQL string variables), not in a DataWindow painter. The join business logic must be understood before restructuring.

**Steps:**

1. Open `DISTRIB7.pbl` → `nvo_distribution` NVO → Script Editor
2. In the function that builds the distribution SQL, find the 3 locations with `(+)` in the SQL string
3. For each:
   a. Understand which table is being outer-joined and what the null-fill behavior should be
   b. Restructure the SQL string to use `LEFT OUTER JOIN … ON`
   c. Test with a real distribution run for at least one record from each major org group
4. Pay particular attention to NULL handling — if the old code used NVL on the outer-joined column, retain that NVL in the new query

---

### B4 — NLS Testing Across Locale Groups

**Why manual:** Automated testing cannot fully validate locale-specific behavior.

**Steps:**

1. After applying the `NLS_DATE_LANGUAGE=AMERICAN` change, log in to LCD as each:
   - **org 010** (default English) — baseline
   - **org 660** (ASIA, `LANGUAGE_CODE=AS`) — verify date entry fields
   - **org 663** (India, `LANGUAGE_CODE=IN`) — verify timesheet dates
   - **org 155 or 195** (UK, `WEEKLY_START_DAY=FRIDAY`) — verify week-end date calculation in accounting interface
2. For each org, test: login → timesheet entry → save → verify date displayed matches date entered
3. Run the accounting interface for a UK org and verify the "week ending Friday" date is computed correctly using the NLS-safe arithmetic formula

---

### B5 — Oracle Directory Path Validation for File I/O

**Why manual:** The mapping between `LCD_ORGPARAM.LCD_SERVER_LOC` (Linux path) and Oracle 19c Directory names must be validated end-to-end with actual file operations.

**Steps:**

1. DBA runs `patched/sql/risk_utlfile_directory_mapping.sql` — confirms all Directory objects exist
2. DBA executes a test UTL_FILE write using each Directory name:
   ```sql
   DECLARE
     fh UTL_FILE.FILE_TYPE;
   BEGIN
     -- Test LCD_IN directory
     fh := UTL_FILE.FOPEN('LCD_IN', 'test_19c_migration.txt', 'W');
     UTL_FILE.PUT_LINE(fh, 'RdW 5/24/2026 Oracle 19c Migration Test');
     UTL_FILE.FCLOSE(fh);
     DBMS_OUTPUT.PUT_LINE('LCD_IN write: SUCCESS');
   EXCEPTION
     WHEN OTHERS THEN
       DBMS_OUTPUT.PUT_LINE('LCD_IN write: FAILED - ' || SQLERRM);
   END;
   /
   ```
3. Repeat for LCD_FEDERAL_IN, LCD_CANADA_IN, LCD_663_IN, LCD_149_IN, LCD_285_IN
4. Verify corresponding files appear on the Linux NFS share at the expected paths
5. Run a full accounting interface extract for org 010 (default) and org 114 (FEDERAL) to validate end-to-end file output
