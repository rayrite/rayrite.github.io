# Oracle 19c Migration Analysis - Session Notes

## Task
Analyze LCD PowerBuilder 2021 GUI source code in pb_export for Oracle 11g->19c migration risks.
Create markdown report in pb_export/_docs/reports/

## Key Findings (by severity)

### CRITICAL - Will Break
- TRIM(column(+)) outer join: Oracle 19c ORA-01799 when function applied to outer-join column
  - TBLDIST/d_att_wage_map_err.srd (2 instances)
  - TBLINTRF/d_toe_att_map_err.srd
  - TBLCOST/d_time_genwage_err.srd (2 instances)
  - TBLCOST/d_primary_wage_err.srd (2 instances)
  - TIME/d_wage_determination_rates_err.srd

### HIGH
- SYS.VERIFY_FUNCTION@ites_lcd in uo_trans.sru (commented out but indicative)
- DBA_ROLE_PRIVS access in d_user_roles_orgs.srd, d_user_roles.srd (requires SELECT ANY DICTIONARY)
- Password stored procs (CHANGE_PASSWORD, VERIFY_PASSWORD) - need 19c compatibility check

### MEDIUM
- TO_DATE(numeric, format) implicit conversion: NEWS/d_news.srd, NEWS/w_news.srw, LCD7/w_main.srw
- NEXT_DAY(date, 'FRIDAY') NLS-sensitive: ACCT/f_acct_int.srf (3x), REPORTS/d_report_time_adjustments.srd
- SYS.DUAL references in 12+ DataWindows (should be just DUAL)
- Oracle (+) outer join syntax (17+ files) - still works but should migrate to ANSI JOIN
- ROWNUM without ORDER BY protection (multiple files)

### LOW
- 2-digit year TO_DATE 'dd-mon-yy' format: ADMIN/d_tes_results.srd
- Oracle sequences (NEXTVAL/CURRVAL) - fine in 19c
- Dynamic SQL cursors - need validation
- DB Link usage for P_COPY_TABLES

## Output File
pb_export/_docs/reports/ORACLE_19C_MIGRATION_RISK_ANALYSIS.md
