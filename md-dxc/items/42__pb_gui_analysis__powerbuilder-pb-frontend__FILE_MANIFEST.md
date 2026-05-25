# FILE MANIFEST — Oracle 19c Migration: LCD PowerBuilder GUI
**Generated:** 2026-05-24  
**Author:** RdW  
**Project root:** `tasks/42/pb_gui_analysis/powerbuilder-pb-frontend/`  
**Source:** `pb_export/`  
**Total files backed up:** 63 (original/ and patched/ each contain identical copies)

---

## Status Legend

| Status | Meaning |
|--------|---------|
| `PENDING` | Change specified; awaiting manual IDE edit |
| `DBA_COMPLETE` | Change already applied at database layer; no PB code edit required |
| `IN_PROGRESS` | Currently being worked |
| `PATCHED` | IDE edit applied and file re-exported to patched/ |
| `VERIFIED` | Change verified by unit test |

---

## RISK-01 — CRITICAL: `TRIM(col(+))` on Outer-Join Column
> **Severity:** CRITICAL — ORA-01799 on Oracle 19c  
> **Fix:** Rewrite DataWindow SQL from implicit `(+)` form to ANSI `LEFT OUTER JOIN`

| # | Source File (pb_export-relative) | Copied To | Status |
|---|----------------------------------|-----------|--------|
| 1 | `TBLDIST/d_att_wage_map_err.srd` | `original/TBLDIST/` · `patched/TBLDIST/` | PENDING |
| 2 | `TBLINTRF/d_toe_att_map_err.srd` | `original/TBLINTRF/` · `patched/TBLINTRF/` | PENDING |
| 3 | `TBLCOST/d_time_genwage_err.srd` | `original/TBLCOST/` · `patched/TBLCOST/` | PENDING |
| 4 | `TBLCOST/d_primary_wage_err.srd` | `original/TBLCOST/` · `patched/TBLCOST/` | PENDING |
| 5 | `TIME/d_wage_determination_rates_err.srd` | `original/TIME/` · `patched/TIME/` | PENDING |

---

## RISK-02 — MEDIUM-HIGH: Oracle `(+)` Outer-Join Syntax (General)
> **Severity:** MEDIUM-HIGH — Works but carries optimizer and restriction risks in 19c  
> **Fix:** Convert all `(+)` to ANSI `LEFT/RIGHT OUTER JOIN`  
> **Roster built by:** automated grep scan of all 926 pb_export source files (2026-05-24)

| # | Source File (pb_export-relative) | Also RISK-01? | Status |
|---|----------------------------------|---------------|--------|
| 1 | `DISTRIB7/f_generated_wage_check.srf` | | PENDING |
| 2 | `DISTRIB7/nvo_distribution.sru` | | PENDING |
| 3 | `LCD7/w_login.srw` | | PENDING |
| 4 | `LCD7/w_main.srw` | | PENDING |
| 5 | `NEWS/d_news.srd` | | PENDING |
| 6 | `NEWS/w_news_send.srw` | | PENDING |
| 7 | `REPORTS/d_report_subcontractor_ap_voucher.srd` | | PENDING |
| 8 | `REPORTS/d_report_vendor_summary.srd` | | PENDING |
| 9 | `REPORTS/d_report_vendor_summary_print_totals.srd` | | PENDING |
| 10 | `TABLES/d_proj_attr_err.srd` | | PENDING |
| 11 | `TBLADMIN/d_expense_types_err.srd` | | PENDING |
| 12 | `TBLADMIN/d_func_specs_err.srd` | | PENDING |
| 13 | `TBLADMIN/d_function_access.srd` | | PENDING |
| 14 | `TBLADMIN/d_org_param.srd` | | PENDING |
| 15 | `TBLADMIN/d_org_param_detail.srd` | | PENDING |
| 16 | `TBLADMIN/d_payroll_jobs_err.srd` | | PENDING |
| 17 | `TBLADMIN/d_vendor_group_err.srd` | | PENDING |
| 18 | `TBLADMIN/d_wrkr_wage_control_err.srd` | | PENDING |
| 19 | `TBLASIGN/d_generate_expenses.srd` | | PENDING |
| 20 | `TBLCMON/d_print_report.srd` | | PENDING |
| 21 | `TBLCOST/d_primary_wage.srd` | | PENDING |
| 22 | `TBLCOST/d_primary_wage_err.srd` | ✓ RISK-01 | PENDING |
| 23 | `TBLCOST/d_time_genwage_err.srd` | ✓ RISK-01 | PENDING |
| 24 | `TBLCOST/d_wrkr_unitrate_err.srd` | | PENDING |
| 25 | `TBLDIST/d_att_abs_err.srd` | | PENDING |
| 26 | `TBLDIST/d_att_wage_map.srd` | | PENDING |
| 27 | `TBLDIST/d_att_wage_map_err.srd` | ✓ RISK-01 | PENDING |
| 28 | `TBLDIST/d_wage_type_err.srd` | | PENDING |
| 29 | `TBLDIST/w_select_orgs.srw` | | PENDING |
| 30 | `TBLINTRF/d_toe_att_map_err.srd` | ✓ RISK-01 | PENDING |
| 31 | `TBLWO/d_alternate_wo_err.srd` | | PENDING |
| 32 | `TBLWO/d_default_wo_err.srd` | | PENDING |
| 33 | `TBLWO/d_wo_substitution_err.srd` | | PENDING |
| 34 | `TBLWO/d_work_orders_err.srd` | | PENDING |
| 35 | `TBLWO/d_work_orders_err_3.srd` | | PENDING |
| 36 | `TBLWO/d_work_orders_err2.srd` | | PENDING |
| 37 | `TBLWRKRS/d_persarea_subarea_err.srd` | | PENDING |
| 38 | `TIME/d_time_errors.srd` | | PENDING |
| 39 | `TIME/d_wage_determination_rates_err.srd` | ✓ RISK-01 | PENDING |

---

## RISK-03 — MEDIUM: `SYS.DUAL` Fully-Qualified References
> **Severity:** MEDIUM — Fails if DBA revokes `SYS.DUAL` public synonym (CIS hardening)  
> **Fix:** Replace `SYS.DUAL` with `DUAL`

| # | Source File (pb_export-relative) | Status |
|---|----------------------------------|--------|
| 1 | `LCD7/d_add_user_orgs.srd` | PENDING |
| 2 | `TBLADMIN/d_reason_codes.srd` | PENDING |
| 3 | `PAY/d_payroll_error.srd` | PENDING |
| 4–12 | *(9 additional error-display DataWindows — full list TBD via targeted grep)* | PENDING |

> **Note:** A targeted `SYS.DUAL` grep should be run in Phase 4 to confirm remaining files.

---

## RISK-04 — MEDIUM: `TO_DATE(numeric, format)` Implicit Conversion
> **Severity:** MEDIUM — ORA-01861 risk under non-US NLS settings  
> **Fix:** Quote the numeric literal: `TO_DATE('19000101','YYYYMMDD')`

| # | Source File (pb_export-relative) | Status |
|---|----------------------------------|--------|
| 1 | `NEWS/d_news.srd` | PENDING |
| 2 | `NEWS/w_news.srw` | PENDING |
| 3 | `LCD7/w_main.srw` | PENDING |

---

## RISK-05 — MEDIUM: `NEXT_DAY(date,'FRIDAY')` NLS-Sensitive
> **Severity:** MEDIUM — ORA-01846 if `NLS_DATE_LANGUAGE ≠ AMERICAN`  
> **Fix:** Replace with arithmetic OR set `NLS_DATE_LANGUAGE=AMERICAN` in connection (additional defense already planned)

| # | Source File (pb_export-relative) | Status |
|---|----------------------------------|--------|
| 1 | `ACCT/f_acct_int.srf` | PENDING |
| 2 | `REPORTS/d_report_time_adjustments.srd` | PENDING |

---

## RISK-06 — HIGH: `DBA_ROLE_PRIVS` Access
> **Severity:** HIGH — Screens fail if `SELECT ANY DICTIONARY` revoked  
> **Fix Applied:** Option A — `GRANT SELECT ON DBA_ROLE_PRIVS TO LCD` executed by DBA in UAT 19c  
> **No PowerBuilder code changes required**

| # | Source File (pb_export-relative) | Status |
|---|----------------------------------|--------|
| 1 | `LCD7/d_user_roles_orgs.srd` | DBA_COMPLETE |
| 2 | `LCD7/d_user_roles.srd` | DBA_COMPLETE |
| 3 | `LCD7/d_granted_roles.srd` | DBA_COMPLETE |

---

## RISK-07 — HIGH: Password Management Stored Procedures
> **Severity:** HIGH — Oracle 19c password architecture differs from 11g  
> **Fix:** Audit server-side procs; verify `SYS.VERIFY_FUNCTION@ites_lcd` not called; test `w_change_password`

| # | Source File (pb_export-relative) | Status |
|---|----------------------------------|--------|
| 1 | `LCD7/uo_trans.sru` | PENDING |
| 2 | `LCD7/w_change_password.srw` | PENDING |

---

## RISK-08 — LOW-MEDIUM: `ROWNUM` Ordering Ambiguity
> **Severity:** LOW-MEDIUM — Adaptive optimizer in 19c may expose latent bugs  
> **Critical:** `TBLADMIN/d_reason_codes_multylang.srd` — DECODE rownum sort trick  
> **Fix (critical):** Replace ROWNUM sort trick with `ROW_NUMBER() OVER (ORDER BY ...)`

| # | Source File (pb_export-relative) | Critical? | Status |
|---|----------------------------------|-----------|--------|
| 1 | `TBLADMIN/d_reason_codes_multylang.srd` | ✓ CRITICAL | PENDING |
| 2 | `ADJUST/w_r_adjust_archive_approved.srw` | | PENDING |
| 3 | `ADJUST/w_r_adjust_conversion.srw` | | PENDING |
| 4 | `ADJUST/w_r_global_corrections.srw` | | PENDING |
| 5 | `FORMS/w_r_forms_selection_criteria.srw` | | PENDING |
| 6 | `LCD7/w_main.srw` | | PENDING |
| 7 | `SPECPAY1/w_p_specpay_approve_exec.srw` | | PENDING |
| 8 | `SPECPAY1/w_p_specpay_main.srw` | | PENDING |
| 9 | `TBLADMIN/w_wage_controls.srw` | | PENDING |
| 10 | `TBLADMIN/w_worker_wage_controls.srw` | | PENDING |
| 11 | `TBLASIGN/w_generated_expense_types.srw` | | PENDING |
| 12 | `tblsap/w_sap_param.srw` | | PENDING |

---

## RISK-09 — LOW: `TO_DATE 'dd-mon-yy'` Format
> **Severity:** LOW — NLS-sensitive month names and 2-digit year  
> **Fix:** `'dd-mon-yy hh24:mi:ss'` → `'dd-mm-yyyy hh24:mi:ss'`

| # | Source File (pb_export-relative) | Status |
|---|----------------------------------|--------|
| 1 | `ADMIN/d_tes_results.srd` | PENDING |

---

## RISK-10 — LOW: Database Link Migration
> **Severity:** LOW — DB links must be recreated after Oracle 19c migration  
> **Fix:** DBA drops and recreates all DB links; PB code reads link names from `LCD.SUPPORT_SYSTEMS`

| # | Source File (pb_export-relative) | Status |
|---|----------------------------------|--------|
| 1 | `ADMIN/w_p_copy_tables.srw` | PENDING |

---

## NLS Defense in Depth (RISK-05 / RISK-09 Secondary Mitigation)
> **Fix:** Add `NLS_DATE_LANGUAGE=AMERICAN` to `lcd.ini` and `s_open_app.srs` SQLCA init

| # | Target | Type | Status |
|---|--------|------|--------|
| 1 | `lcd.ini` `[Database]` section | INI file edit (no PB compile) | PENDING |
| 2 | `lcd.sra` application open event / `s_open_app.srs` | PB IDE script edit | PENDING |

---

## DBA SQL Scripts (patched/sql/)

| Script | Purpose | Status |
|--------|---------|--------|
| `risk01_debug.sql` | Verify TRIM behavior on affected tables; diagnostic DBMS_OUTPUT | PENDING |
| `risk06_option_a_grant.sql` | Audit record of DBA_ROLE_PRIVS grant (already applied) | PENDING |
| `risk07_audit_password_procs.sql` | Query USER_SOURCE for deprecated VERIFY_FUNCTION references | PENDING |
| `risk10_dblink_recreation.sql` | DROP/CREATE statements for all LCD DB links with DBMS_OUTPUT | PENDING |
| `risk_utlfile_directory_mapping.sql` | Org → LCD_SERVER_LOC → Oracle 19c Directory mapping + verification | PENDING |
| `risk05_nextday_test.sql` | Verify NEXT_DAY arithmetic replacement produces same result | PENDING |

---

## Summary

| Risk | Severity | Files | DBA Action | PB IDE Action |
|------|----------|-------|-----------|---------------|
| RISK-01 | CRITICAL | 5 | — | DataWindow SQL rewrite |
| RISK-02 | MEDIUM-HIGH | 39 total (34 new) | — | DataWindow SQL rewrite |
| RISK-03 | MEDIUM | 12 | — | Replace SYS.DUAL |
| RISK-04 | MEDIUM | 3 | — | Quote TO_DATE literals |
| RISK-05 | MEDIUM | 2 | — | Replace NEXT_DAY + NLS |
| RISK-06 | HIGH | 3 | ✓ **COMPLETE** | None required |
| RISK-07 | HIGH | 2 | Audit server procs | Review uo_trans.sru |
| RISK-08 | LOW-MEDIUM | 12 | — | Fix ROWNUM sort (1 critical) |
| RISK-09 | LOW | 1 | — | Fix date mask |
| RISK-10 | LOW | 1 | Recreate DB links | None required |
| NLS | Mitigation | 2 targets | — | INI + s_open_app.srs |
