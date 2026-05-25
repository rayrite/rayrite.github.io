# Oracle 19c Migration: LCD GUI — Test Plan

**Author:** RdW  
**Date:** 2026-05-24  
**Reference:** `ORACLE_19C_MIGRATION_IMPLEMENTATION_PLAN.md` · `tasks/41-LCD-GUI/`  
**Environments:** UAT (Q22S) primary; repeat key tests in PROD smoke

---

## Test Environment Prerequisites

| Item | Requirement |
|------|------------|
| Oracle | 19c UAT instance (Q22S) running |
| DB grant | `GRANT SELECT ON SYS.DBA_ROLE_PRIVS TO LCD` applied |
| DB links | All links in `USER_DB_LINKS` recreated and tested |
| Oracle Directories | All `LCD_*` directory objects created (see `DB_DIRECTORIES.txt`) |
| NFS paths | `/csclcdnc0002/Q22S`, `/csclcdnc0002/Q22S-FEDERAL`, `/csclcdnc0002/Q22S-CANADA` etc. mounted and writable |
| LCD.EXE | Built from patched PBLs (all Phases 1–6 applied) |
| lcd.ini | `NLS_DateLanguage=AMERICAN` entry added |
| Test users | At least one valid user per org group: Default (010), FEDERAL (114), CANADA (574), India (663), UK (155), ASIA (660) |

---

## Phase 1 — Unit Tests (Per Risk Category)

Each test targets a specific risk fix in isolation.

---

### UT-01 — RISK-01: TRIM Outer Join (CRITICAL)

**Goal:** Confirm `TRIM(col(+))` replacement eliminates ORA-01799; DataWindows return correct rows.

| Test ID | Test Case | Steps | Expected Result | Troubleshooting |
|---------|-----------|-------|----------------|-----------------|
| UT-01-A | `d_att_wage_map_err` loads | Open TBLDIST PBL screen that uses `d_att_wage_map_err`. Retrieve data for any org with ATT_WAGE_MAP records | DataWindow populates with wage mapping error records; no ORA-01799 | Verify Phase 1 SQL rewrite was applied; check DW SQL in painter |
| UT-01-B | `d_toe_att_map_err` loads | Open TBLINTRF screen for TOE/ATT mapping; retrieve | Rows returned; no ORA-01799 | Same as above |
| UT-01-C | `d_time_genwage_err` loads | Open TBLCOST screen; retrieve for any org with time generation data | Rows or empty set; no ORA error | |
| UT-01-D | `d_primary_wage_err` loads | Open TBLCOST primary wage error screen; retrieve | No ORA-01799 | |
| UT-01-E | `d_wage_determination_rates_err` loads | Open TIME screen; retrieve | No ORA-01799 | |
| UT-01-F | Null handling preserved | For UT-01-A through E: verify that rows where the outer-joined table has no match still appear (with nulls in the joined columns) | Rows with null pay_wage_type or att_abs_type appear as before | If rows are missing, the ANSI JOIN ON condition may be too restrictive; review join key |

---

### UT-02 — RISK-02: General `(+)` Join Migration

| Test ID | Test Case | Steps | Expected Result | Troubleshooting |
|---------|-----------|-------|----------------|-----------------|
| UT-02-A | `nvo_distribution` distribution run | Run a distribution calculation for org 010 | Distribution completes without ORA- error; results match 11g baseline | Verify 3 (+) join replacements in nvo_distribution.sru |
| UT-02-B | `w_news_send` news broadcast | Open NEWS module → Send News screen; retrieve org list; select 2 orgs and send | News sent without ORA error; both orgs received | Verify BETWEEN fix for `ORG_CODE(+) BETWEEN` |
| UT-02-C | Login screen loads | Launch LCD.EXE; w_login appears with database dropdown populated | Login dialog opens; no ORA error on org validation | RISK-02 fix on w_login.srw |
| UT-02-D | Report vendor summary | Run REPORTS → Vendor Summary report | Report generates with correct vendor data; no ORA error | Check d_report_vendor_summary.srd (+) fix |
| UT-02-E | Work Orders error screen | Open TBLWO → work order error DataWindow; retrieve | Rows returned; no ORA error | Check 5 TBLWO files |
| UT-02-F | Null rows preserved | For UT-02-A: verify distribution rows where cost center has no matching work order still appear | Null WO columns appear in output | ANSI LEFT JOIN must maintain outer null semantics |

---

### UT-03 — RISK-03: SYS.DUAL Replacement

| Test ID | Test Case | Steps | Expected Result | Troubleshooting |
|---------|-----------|-------|----------------|-----------------|
| UT-03-A | Add user to organization | Administration → Add User to Organization → select user → org list populates | d_add_user_orgs DataWindow loads with available orgs; no ORA-00942 | Verify SYS.DUAL → DUAL replacement in d_add_user_orgs.srd |
| UT-03-B | Reason codes screen | Open TBLADMIN → Reason Codes; retrieve | Reason codes populate; no ORA error | d_reason_codes.srd fix |
| UT-03-C | Payroll error screen | Open PAY module → payroll error DataWindow | Records load; no ORA-00942 | d_payroll_error.srd fix |
| UT-03-D | Simulate CIS hardening | DBA temporarily revokes PUBLIC synonym for SYS.DUAL: `DROP PUBLIC SYNONYM DUAL CASCADE` (test only!); then run UT-03-A through C | All screens still load (using DUAL without SYS. prefix) | Restore synonym immediately after test: `CREATE PUBLIC SYNONYM DUAL FOR SYS.DUAL` |

---

### UT-04 — RISK-04: `TO_DATE` Numeric Literal

| Test ID | Test Case | Steps | Expected Result | Troubleshooting |
|---------|-----------|-------|----------------|-----------------|
| UT-04-A | News list loads with date range | NEWS module → open News window; retrieve news from default start date | News records display; no ORA-01861 | d_news.srd fix — `to_date('19900101','YYYYMMDD')` |
| UT-04-B | News window date filter | In w_news.srw, change date range; click retrieve | Filtered results return; no ORA error | w_news.srw fix |
| UT-04-C | Main window date usage | Login → w_main loads | No ORA-01861 on w_main open event | w_main.srw fix |
| UT-04-D | NLS numeric separator test | Set Windows region to German (comma as decimal separator); repeat UT-04-A | News still loads; date arithmetic unaffected | Confirms quoted literal protects against NLS corruption |

---

### UT-05 — RISK-05: `NEXT_DAY` Replacement

| Test ID | Test Case | Steps | Expected Result | Troubleshooting |
|---------|-----------|-------|----------------|-----------------|
| UT-05-A | Accounting interface — Friday calculation | ACCT module → Run Accounting Interface for any org with WEEKLY_START_DAY=SATURDAY; execute for a week ending on a Friday | Interface completes; "Week ending" date is the correct Friday | Verify `actual_date + MOD(6 - TO_NUMBER(TO_CHAR(actual_date,'D')),7)` formula |
| UT-05-B | Time adjustment report | REPORTS → Time Adjustments → enter date range crossing a Friday | Report generates for correct week-end period | d_report_time_adjustments.srd fix |
| UT-05-C | Formula equivalence | Run `patched/sql/risk05_nextday_test.sql` against 19c database | For each test date, arithmetic result = NEXT_DAY result (when NLS_DATE_LANGUAGE=AMERICAN) | If mismatch, check D offset in MOD formula |
| UT-05-D | UK org Friday start day | Login as org 155 (WEEKLY_START_DAY=FRIDAY); run accounting interface | Week-end date computed as Friday | |

---

### UT-06 — RISK-06: `DBA_ROLE_PRIVS` Grant (DBA_COMPLETE — Verification Only)

| Test ID | Test Case | Steps | Expected Result | Troubleshooting |
|---------|-----------|-------|----------------|-----------------|
| UT-06-A | Set User Roles screen | Administration → Set User Roles → select any user | `d_user_roles_orgs` DataWindow populates with user's current roles | If ORA-00942: grant not applied; run `risk06_option_a_grant.sql` |
| UT-06-B | Role report | Administration → User Role Report → run for any user | Roles displayed correctly | d_user_roles.srd / d_granted_roles.srd |
| UT-06-C | Non-DBA connection test | Connect to 19c as LCD schema user (not as DBA); open Set User Roles | Roles still visible — confirms grant is effective without DBA privilege | |

---

### UT-07 — RISK-07: Password Management

| Test ID | Test Case | Steps | Expected Result | Troubleshooting |
|---------|-----------|-------|----------------|-----------------|
| UT-07-A | Change password — valid | Administration → Change Password → enter valid old password → enter new 14-char password → confirm | Password changed successfully; subsequent login with new password works | Check CHANGE_PASSWORD proc; audit with risk07_audit_password_procs.sql |
| UT-07-B | Change password — old pw wrong | Enter incorrect old password | Error message "Invalid password" shown; password not changed | |
| UT-07-C | Change password — too short | Enter new password < 14 characters | Error message "Password must be at least 14 characters" | PB validation in w_change_password.srw |
| UT-07-D | Change password — 19c complexity | Enter new password that meets 14-char min but fails 19c complexity (e.g., all lowercase) | Appropriate error from Oracle | If error message is cryptic ORA code, server proc should translate it |
| UT-07-E | Unlock user | Administration → Unlock User → enter a locked test account | Success message; user can login again | w_unlock_user.srw; check TRANS_LOG insert |

---

### UT-08 — RISK-08: ROWNUM Ordering

| Test ID | Test Case | Steps | Expected Result | Troubleshooting |
|---------|-----------|-------|----------------|-----------------|
| UT-08-A | Reason codes multilanguage | Open TBLADMIN → Reason Codes (multi-language screen); retrieve | EN records appear before non-EN records; order is stable across 10 consecutive retrieves | Verify ROW_NUMBER() fix in d_reason_codes_multylang.srd |
| UT-08-B | Order stability test | Close and reopen reason codes screen 5 times; note sort order | Order is identical each time | If order varies, ROWNUM sort trick may still be present |
| UT-08-C | Other ROWNUM files | Open each of the 11 other ROWNUM files in their parent windows | All load without error; ordering acceptable | Comment-only fix was applied confirming existence-check use is safe |

---

### UT-09 — RISK-09: Date Format Mask

| Test ID | Test Case | Steps | Expected Result | Troubleshooting |
|---------|-----------|-------|----------------|-----------------|
| UT-09-A | TES results DataWindow | ADMIN module → open screen using d_tes_results; enter a run_date parameter | Screen loads and returns results | Verify `dd-mm-yyyy` format in d_tes_results.srd |
| UT-09-B | Date entry with 4-digit year | Enter run_date as `15-03-2026 00:00:00` (dd-mm-yyyy format) | Query executes correctly | |
| UT-09-C | Non-English month name | With NLS_DATE_LANGUAGE forced, enter `15-MAR-2026` (old format) | Verify old format no longer accepted (if parameter format changed); no crash | |

---

### UT-10 — RISK-10: DB Links

| Test ID | Test Case | Steps | Expected Result | Troubleshooting |
|---------|-----------|-------|----------------|-----------------|
| UT-10-A | Copy Tables screen loads | ADMIN → Copy Tables (`w_p_copy_tables`) | DB link list from `LCD.SUPPORT_SYSTEMS` populates | |
| UT-10-B | DB link test | `SELECT 1 FROM DUAL@<linkname>` for each recreated link | `1` returned; no ORA-02085 / ORA-01017 | See B2 in Manual IDE Instructions |
| UT-10-C | @ites_lcd link | `SELECT 1 FROM DUAL@ites_lcd` in SQL*Plus | Link resolves | DBA must recreate this specific link |

---

### UT-11 — NLS Defense

| Test ID | Test Case | Steps | Expected Result | Troubleshooting |
|---------|-----------|-------|----------------|-----------------|
| UT-11-A | NLS session setting confirmed | After login, run `SELECT SYS_CONTEXT('USERENV','NLS_DATE_LANGUAGE') FROM DUAL` via any Oracle tool | Returns `AMERICAN` | Check lcd.ini and s_open_app SQLCA.DBParm |
| UT-11-B | ASIA org date entry | Login as org 660 (ASIA); enter a time record with today's date | Date saves and displays correctly | NLS override should not break Asian locale display |
| UT-11-C | India org date entry | Login as org 663 (India); enter time | Date correct | |
| UT-11-D | UK org date entry | Login as org 155 (UK, Friday week-start); enter time for a Friday | Week-end date is the correct Friday | |

---

## Phase 2 — Integration Tests

These tests validate cross-module workflows that exercise multiple risk areas together.

| Test ID | Scenario | Modules Involved | Steps | Expected Result |
|---------|----------|-----------------|-------|----------------|
| IT-01 | Full login → org select → time entry flow | LCD7, TIME | Login (010) → w_main → Processing → Time Entry → retrieve week | Time entry screen loads; no ORA errors in any step |
| IT-02 | Distribution run with ANSI joins | LCD7, DISTRIB7 | Login → Processing → Run Distribution for a 2-week period | Distribution completes; cost distribution records written to Oracle |
| IT-03 | Accounting interface with NEXT_DAY fix | ACCT | Processing → Accounting Interface → select org 010 → run for current period | Interface file written to `/csclcdnc0002/Q22S/In`; no date errors |
| IT-04 | Password change during forced expiry | LCD7 | Configure test user with expired password; login → forced w_change_password | Password change completes; user proceeds to w_main |
| IT-05 | Security screen full round-trip | LCD7 | Create user → Set roles → Add to org → Verify roles visible in user role report → Drop from org → Drop user | Each step completes; DBA_ROLE_PRIVS visible throughout (RISK-06) |
| IT-06 | News broadcast to multiple orgs | NEWS, LCD7 | Create a news item → send to orgs 010, 114, 574 | News appears for users in each org; TO_DATE fix (RISK-04) prevents date error |
| IT-07 | Report with vendor outer join | REPORTS | Run Vendor Summary report for any org | Report generates; RISK-02 (+) join fix confirmed |

---

## Phase 3 — End-to-End GUI Tests

Referenced against screen documentation in `tasks/41-LCD-GUI/`. These tests simulate full user journeys as a real user would perform them.

---

### E2E-01 — First Login and Application Launch

**Reference:** `tasks/41-LCD-GUI/w_login.md` · `tasks/41-LCD-GUI/w_hello.md` · `tasks/41-LCD-GUI/w_main.md`  
**Risk areas covered:** RISK-02 (w_login.srw), RISK-04 (w_main.srw), RISK-06

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Launch LCD.EXE | w_login opens; database dropdown shows `QA Global`, `Production Global`, etc. |
| 2 | Select `QA Global` from dropdown | Connection parameters loaded from INI |
| 3 | Enter valid user ID (e.g., `TESTUSER1`) and password | Fields accept input |
| 4 | Enter org code `010` | Org validated in `LCD.ORG_PARAM` |
| 5 | Click OK | w_hello splash opens briefly; then w_main MDI frame opens maximized |
| 6 | Verify title bar | Shows `Labor Costing and Distribution — [010]` or similar |
| 7 | Verify menu enabled items | Menus enabled per TESTUSER1's roles (Security roles from `DBA_ROLE_PRIVS` via RISK-06 grant) |

**Troubleshooting:**
- Login fails with ORA-01017: Check SQLCA credentials in lcd.ini
- w_login appears but roles not applied in w_main: Run UT-06-A to confirm DBA_ROLE_PRIVS grant

---

### E2E-02 — Security Administration Full Round-Trip

**Reference:** `tasks/41-LCD-GUI/w_create_user.md` · `w_set_user_roles.md` · `w_add_user_to_organization.md` · `w_drop_user_from_organization.md` · `w_drop_user.md`  
**Risk areas covered:** RISK-06 (DBA_ROLE_PRIVS), RISK-07 (password)  
**Required role:** `LCD_ADMIN_CTRL` (role[8])

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Login as admin user with `LCD_ADMIN_CTRL` role | w_main loads; Administration menu fully enabled |
| 2 | Administration → User Access → Create User → enter `TESTMIGR01` | User created in Oracle; no ORA error |
| 3 | Administration → User Access → Set User Roles → select TESTMIGR01 | d_user_roles_orgs loads with available roles; RISK-06 grant confirmed |
| 4 | Assign role `LCD_TIME_ENTRY`; save | Role assignment saved |
| 5 | Administration → User Access → Add to Organization → add TESTMIGR01 to org 010 | d_add_user_orgs loads; org added (RISK-03 SYS.DUAL fix) |
| 6 | Logout; login as TESTMIGR01 with initial password | Login succeeds |
| 7 | Administration → Change Password → change to `TestPassw0rd!2026` (14+ chars) | Password changed; RISK-07 server proc validated |
| 8 | Logout; re-login with new password | Login succeeds with new password |
| 9 | Login as admin; Administration → User Access → Drop from Organization → TESTMIGR01 | Dropped without error |
| 10 | Administration → User Access → Drop User → TESTMIGR01 | User dropped |

---

### E2E-03 — Password Change and Expiry

**Reference:** `tasks/41-LCD-GUI/w_change_password.md` · `tasks/41-LCD-GUI/w_login.md`  
**Risk areas covered:** RISK-07

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | DBA sets test user password expiry to 0 days: `ALTER USER TESTUSER2 PASSWORD EXPIRE` | User password is expired |
| 2 | Login as TESTUSER2 | w_login redirects to w_change_password (forced mode; cancel = HALT CLOSE) |
| 3 | Attempt to enter a 13-character password | Error: "Password must be at least 14 characters" |
| 4 | Enter 14-character password; confirm | Password changed; w_hello → w_main open normally |
| 5 | Logout; re-login with new password | Success |

---

### E2E-04 — Unlock User

**Reference:** `tasks/41-LCD-GUI/w_unlock_user.md`  
**Risk areas covered:** None directly (validates TRANS_LOG audit trail)

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | DBA locks test account: `ALTER USER TESTUSER3 ACCOUNT LOCK` | Account locked |
| 2 | Attempt login as TESTUSER3 | ORA-28000 or "Account Locked" message |
| 3 | Login as admin; Administration → User Access → Unlock User | w_unlock_user opens |
| 4 | Enter `TESTUSER3` in user ID field; click Unlock | Success message; `TRANS_LOG` record written with action 'UNLOCK' |
| 5 | Login as TESTUSER3 | Login succeeds |

---

### E2E-05 — TIME Module: Time Entry Week

**Reference:** `tasks/41-LCD-GUI/TIME/` (screens) · `tasks/41-LCD-GUI/w_main.md`  
**Risk areas covered:** RISK-02 (time error DataWindows), RISK-09 (TES results)

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Login as TESTUSER1 (org 010) | w_main loads |
| 2 | Processing → Time Entry → select current week | Time entry screen loads with work orders |
| 3 | Enter 8 hours on a work order for Monday–Friday | Hours entered; totals calculated |
| 4 | Save time | No ORA error; time saved to database |
| 5 | Processing → View Time Errors | d_time_errors DataWindow loads (RISK-02 (+) join fix) |
| 6 | Processing → Wage Determination Rates (if applicable) | d_wage_determination_rates_err loads; no ORA-01799 (RISK-01) |

---

### E2E-06 — Accounting Interface Run (ACCT Module)

**Reference:** `tasks/41-LCD-GUI/ACCT/w_acct_interface.md`  
**Risk areas covered:** RISK-05 (NEXT_DAY), RISK-10 (file I/O via Oracle Directories)

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Login as admin (org 010) | w_main loads |
| 2 | ACCT → Accounting Interface → select org 010 | Interface screen loads |
| 3 | Set date range for current week (ending Friday) | "Week ending" date shows correct Friday computed by arithmetic formula |
| 4 | Click Run | Interface executes; output file written to Oracle Directory `LCD_IN` → path `/csclcdnc0002/Q22S/In/` |
| 5 | DBA verifies file exists at `/csclcdnc0002/Q22S/In/` | File present with correct content | 
| 6 | Repeat for org 114 (FEDERAL) | File written to `/csclcdnc0002/Q22S-FEDERAL/IN/` |

---

### E2E-07 — News Module: Create, Broadcast, View

**Reference:** `tasks/41-LCD-GUI/NEWS/` · `tasks/41-LCD-GUI/w_main.md`  
**Risk areas covered:** RISK-04 (TO_DATE), RISK-02 (w_news_send outer join)

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | NEWS → Create News → enter title, body, expiry date | d_news DataWindow saves new record; no ORA-01861 (RISK-04) |
| 2 | NEWS → Send News → select orgs 010 and 114 → send | w_news_send retrieves org list (RISK-02 (+) BETWEEN fix); news sent to both orgs |
| 3 | Login as org 010 user | News item appears on home screen |
| 4 | Login as org 114 user | Same news item appears |

---

### E2E-08 — DISTRIB7 Distribution Run

**Reference:** `tasks/41-LCD-GUI/DISTRIB7/`  
**Risk areas covered:** RISK-02 (nvo_distribution 3 complex outer joins)

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Login as admin (org 010) | w_main loads |
| 2 | Processing → Run Distribution → select current period | Distribution setup screen opens |
| 3 | Run distribution for org 010 | Distribution calculation completes; labor distribution records written |
| 4 | Verify distribution results in detail screen | Cost distribution matches expected (compare to 11g baseline if available) |
| 5 | Repeat for org 114 (FEDERAL) | Same results; no ORA error from nvo_distribution |

---

## Phase 4 — Regression Tests

Confirm that the migration changes did not break any pre-existing functionality.

| Test ID | Area | Test | Expected Result |
|---------|------|------|----------------|
| RT-01 | Time entry save | Enter and save time for a standard work order | Saves correctly; no new ORA errors |
| RT-02 | Adjustment workflow | Enter a labor adjustment via ADJUST module | Adjustment posts correctly |
| RT-03 | Pay calculation | PAY module → run pay calculation | Completes without error |
| RT-04 | Reports — standard | Run 3 different standard reports | Reports generate; output matches pre-migration baseline |
| RT-05 | TBLCMON/TBLDIST tables | Edit ATT_WAGE_MAP entries | Save/update works; no constraint errors |
| RT-06 | User report | Administration → User Role Report | Report generates for all users |
| RT-07 | Security history | Administration → Security History | d_users_secur DataWindow loads with audit records |

---

## Troubleshooting Reference

| Symptom | Test(s) Affected | Root Cause | Fix |
|---------|-----------------|-----------|-----|
| ORA-01799 on any screen | UT-01-x | RISK-01 fix not applied or partial | Re-open DW in painter; confirm no `(+)` in WHERE with TRIM |
| ORA-00942 (table/view not found) | UT-03-x | SYS.DUAL still present or grant missing | Run grep; check RISK-03 patch and RISK-06 grant |
| ORA-01861 (format mismatch) | UT-04-x | TO_DATE numeric literal not quoted | Check d_news.srd, w_news.srw, w_main.srw |
| ORA-01846 (invalid day of week) | UT-05-x | NEXT_DAY still present OR NLS not set | Check f_acct_int.srf + lcd.ini NLS entry |
| Incorrect Friday date in ACCT | UT-05-A | Arithmetic formula bug | Verify `MOD(6 - TO_NUMBER(TO_CHAR(date,'D')),7)` for test dates in risk05_nextday_test.sql |
| Roles not visible in w_main | UT-06-x, E2E-01 | DBA_ROLE_PRIVS grant missing | DBA: `GRANT SELECT ON SYS.DBA_ROLE_PRIVS TO LCD` |
| Password change fails with ORA | UT-07-x | Server proc calls deprecated VERIFY_FUNCTION | DBA: run risk07_audit_password_procs.sql; rewrite proc |
| Unstable sort in reason codes | UT-08-A,B | ROWNUM sort trick still in place | Verify ROW_NUMBER() fix in d_reason_codes_multylang |
| d_tes_results won't accept date | UT-09-x | Date format mask still using `mon` or `yy` | Check ADMIN/d_tes_results.srd patched file |
| DB link resolution failure | UT-10-x | Links not recreated in 19c | DBA: risk10_dblink_recreation.sql |
| File write fails in ACCT interface | E2E-06 | Oracle Directory not found / NFS not mounted | DBA: run risk_utlfile_directory_mapping.sql; check NFS mount |
| Asian org dates garbled | UT-11-B,C | NLS_DATE_LANGUAGE conflicts with display expectations | Review lcd.ini + s_open_app.srs; may need per-org NLS override |
