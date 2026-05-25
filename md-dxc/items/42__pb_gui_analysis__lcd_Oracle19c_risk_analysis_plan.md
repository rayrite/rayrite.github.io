

## Plan: Oracle 11g → 19c Migration Risk Analysis — LCD GUI

**TL;DR:** Static analysis of 902 PowerBuilder source objects found 10 risk categories across 30+ files. The most severe are 7 DataWindows with `TRIM(column(+))` syntax that Oracle 19c rejects outright, plus security screen queries on `DBA_ROLE_PRIVS` that require elevated privileges. The file below should be created as a permanent reference for the migration team.

---

## Full Analysis Findings

The complete report content to be written to pb_export/_docs/reports/ORACLE_19C_MIGRATION_RISK_ANALYSIS.md:

---

### RISK-01 — Functions on Outer-Join Columns `TRIM(col(+))`
**Severity: CRITICAL — Will throw ORA-01799 on Oracle 19c**

Oracle 19c strictly enforces the prohibition on applying scalar functions to the `(+)` side of a proprietary outer join. This was tolerated in some 11g optimizer paths.

| File | Pattern |
|------|---------|
| d_att_wage_map_err.srd | `TRIM(LCD.pay_wage_type.pay_wage_type(+))` |
| d_att_wage_map_err.srd | `TRIM(LCD.ATT_ABS_TYPE.ATT_ABS_TYPE(+))` |
| d_toe_att_map_err.srd | `TRIM(LCD.ATT_ABS_TYPE.ATT_ABS_TYPE(+))` |
| d_time_genwage_err.srd | `TRIM(LCD.pay_wage_type.pay_wage_type(+))` |
| d_time_genwage_err.srd | `TRIM(LCD.ATT_ABS_TYPE.ATT_ABS_TYPE(+))` |
| d_primary_wage_err.srd | `TRIM(LCD.pay_wage_type.pay_wage_type(+))` |
| d_primary_wage_err.srd | `TRIM(LCD.ATT_ABS_TYPE.ATT_ABS_TYPE(+))` |
| d_wage_determination_rates_err.srd | `TRIM(LCD.ATT_ABS_TYPE.ATT_ABS_TYPE(+))` |

**Fix:** Rewrite SQL in PowerBuilder DataWindow painter using `LEFT OUTER JOIN ... ON TRIM(col) = ...`

---

### RISK-02 — Oracle `(+)` Outer-Join Syntax (General)
**Severity: MEDIUM-HIGH — Works but has known restrictions in 19c**

11 additional files use `(+)` joins without the function-wrapping issue. Still supported but carries optimizer and restriction risks. DISTRIB7/nvo_distribution.sru has 3 complex `(+)` join conditions. w_news_send.srw uses `ORG_CODE (+) BETWEEN :start AND :end` which is particularly fragile.

**Fix:** Migrate all `(+)` syntax to ANSI `LEFT/RIGHT OUTER JOIN`.

---

### RISK-03 — `SYS.DUAL` Fully-Qualified References
**Severity: MEDIUM — Fails if DBA has revoked SYS.DUAL public synonym (CIS hardening)**

12 DataWindows reference `SYS.DUAL` instead of just `DUAL`. Affected: d_add_user_orgs.srd, PAY/d_payroll_error.srd, d_reason_codes.srd, and 9 other error-display DataWindows.

**Fix:** Replace `SYS.DUAL` with `DUAL` in all DataWindow SQL.

---

### RISK-04 — `TO_DATE(numeric, format)` Implicit Conversion
**Severity: MEDIUM — ORA-01861 risk under non-US NLS settings**

`TO_DATE(19000101, 'YYYYMMDD')` passes a NUMBER, relying on implicit conversion. NLS numeric separators (e.g., thousands separator) can corrupt the string before format parsing.

| File | Line |
|------|------|
| d_news.srd | `to_date(19900101, 'YYYYMMDD')` |
| w_news.srw | `To_Date(19000101,'YYYYMMDD')` |
| w_main.srw | `TO_DATE(19000101, 'YYYYMMDD')` |

**Fix:** Quote the literal: `TO_DATE('19000101', 'YYYYMMDD')`

---

### RISK-05 — `NEXT_DAY(date, 'FRIDAY')` NLS-Sensitive
**Severity: MEDIUM — ORA-01846 if NLS_DATE_LANGUAGE ≠ AMERICAN**

f_acct_int.srf uses `NEXT_DAY(actual_date, 'FRIDAY')` in 3 places to compute week-ending Fridays for the accounting interface. d_report_time_adjustments.srd uses `NEXT_DAY(date - 7, :Start_Day)`.

**Fix:** Replace with NLS-independent arithmetic: `date + MOD(6 - TO_NUMBER(TO_CHAR(date, 'D')), 7)`, or set `NLS_DATE_LANGUAGE=AMERICAN` in the connection string.

---

### RISK-06 — `DBA_ROLE_PRIVS` Access Without Guaranteed Privilege
**Severity: HIGH — Screens will fail if SELECT ANY DICTIONARY is revoked**

| File | View |
|------|------|
| d_user_roles_orgs.srd | `DBA_ROLE_PRIVS` |
| d_user_roles.srd | `DBA_ROLE_PRIVS` |
| d_granted_roles.srd | `USER_ROLE_PRIVS` |

**Fix (Option A):** `GRANT SELECT ON DBA_ROLE_PRIVS TO LCD;`  
**Fix (Option B):** Create `LCD.V_ROLE_PRIVS` wrapper view with restricted access.

---

### RISK-07 — Password Management Stored Procedures
**Severity: HIGH — Oracle 19c password architecture differs from 11g**

LCD7/uo_trans.sru exposes `CHANGE_PASSWORD` and `VERIFY_PASSWORD` via RPCFUNC. A commented-out line shows previous use of `SYS.VERIFY_FUNCTION@ites_lcd` — deprecated in 12c and absent in 19c. The active stored procedures must be audited server-side to confirm they don't call deprecated Oracle internals. LCD7/w_change_password.srw GUI must also align with 19c's stronger password complexity defaults.

---

### RISK-08 — `ROWNUM` Ordering Ambiguity
**Severity: LOW-MEDIUM — Adaptive optimizer in 19c may expose latent bugs**

9 files use `ROWNUM = 1` / `ROWNUM < 2`. Most are safe existence checks. Risky use: d_reason_codes_multylang.srd uses `DECODE(..., rownum, rowNum + 100000)` for sort ordering — non-deterministic in any version, but 19c's adaptive plans make the ordering less predictable.

**Fix:** Replace ROWNUM-based sort trick with `ROW_NUMBER() OVER (ORDER BY ...)`.

---

### RISK-09 — `TO_DATE 'dd-mon-yy'` Format
**Severity: LOW — NLS-sensitive month names and 2-digit year**

d_tes_results.srd: `to_date(:run_date,'dd-mon-yy hh24:mi:ss')` — uses NLS-dependent month abbreviations and ambiguous 2-digit year.

**Fix:** Use `'dd-mm-yyyy hh24:mi:ss'` or `'dd-MON-yyyy hh24:mi:ss'` with `NLS_DATE_LANGUAGE` set.

---

### RISK-10 — Database Link Migration
**Severity: LOW — DB links must be recreated after Oracle 19c migration**

ADMIN/w_p_copy_tables.srw retrieves DB link names from `LCD.SUPPORT_SYSTEMS`. Oracle 19c encrypts DB link passwords differently; all DB links must be dropped and recreated post-migration. The `@ites_lcd` DB link referenced in LCD7/uo_trans.sru must be verified in the 19c environment.

---

## Summary Table

| Risk ID | Severity | Files | Key Action |
|---------|----------|-------|------------|
| RISK-01 | **CRITICAL** | 7 DataWindows | Convert `TRIM(col(+))` to ANSI LEFT JOIN in PB painter |
| RISK-06 | **HIGH** | 3 DataWindows | Grant `SELECT ON DBA_ROLE_PRIVS TO LCD` or create wrapper view |
| RISK-07 | **HIGH** | 3 files | Audit server-side password procs; test `w_change_password` |
| RISK-02 | **MEDIUM-HIGH** | 11+ files | Migrate all `(+)` joins to ANSI syntax |
| RISK-03 | **MEDIUM** | 12 DataWindows | Replace `SYS.DUAL` with `DUAL` |
| RISK-04 | **MEDIUM** | 3 files | Quote `TO_DATE` numeric literals |
| RISK-05 | **MEDIUM** | 2 files | Replace `NEXT_DAY('FRIDAY')` with arithmetic |
| RISK-08 | **LOW-MEDIUM** | 9 files | Review ROWNUM uses; fix sort trick in `d_reason_codes_multylang` |
| RISK-09 | **LOW** | 1 file | Use unambiguous date format mask |
| RISK-10 | **LOW** | 1 window | Recreate DB links post-migration; test copy tables |

---

**Verification steps after creating the file:**
1. Confirm file exists at `pb_export/_docs/reports/ORACLE_19C_MIGRATION_RISK_ANALYSIS.md`
2. Validate all 10 risk items are included with file links
3. Share with DBA team for RISK-06 and RISK-07 remediation (server-side work required)

**Decisions:**
- Included only the PowerBuilder GUI layer; server-side Oracle PL/SQL packages (`TIMESAVE`, `LOADPAY`, `P_COPY_TABLES`, etc.) need a separate audit
- `DECODE` and Oracle sequences (`NEXTVAL`) were confirmed compatible with 19c — not listed as risks
- `LONG` keyword occurrences in the source are PowerBuilder data types, not Oracle `LONG RAW` SQL types — not a risk

**Further Considerations:**
1. The DBA should run the Oracle 19c pre-migration advisor (`DBMS_PREUPGRD`) on the source 11g database for a server-side complement to this GUI analysis.
2. PowerBuilder 2021 supports ANSI JOIN syntax natively in DataWindow SQL — migration of `(+)` joins can be done in the DataWindow painter without any PB version upgrade.
3. Consider setting `NLS_DATE_LANGUAGE=AMERICAN` and `NLS_NUMERIC_CHARACTERS='.,'` in the Oracle 19c `init.ora`/`spfile` to minimize NLS-related breakage before individual fixes are applied.