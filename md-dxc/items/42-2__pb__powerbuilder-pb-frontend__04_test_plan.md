# LCD PB GUI — Oracle 19c Migration Test Plan

> **Task**: 42-2 PB GUI Frontend
> **Date**: May 24, 2026
> **Author**: RdW (Cascade-assisted)
> **Reference**: `tasks/41-LCD-GUI/` (GUI documentation), `pb_export/` (source code)

---

## Overview

This test plan covers unit testing of the individual code changes, integration testing of the affected PB modules, and end-to-end testing of GUI workflows that exercise the Oracle 19c migration changes. Tests are organized into phases matching the implementation plan.

---

## Phase 1: Unit Tests — Code-Level Verification

### UT-01: Password Case Preservation (PB-01)

**Objective**: Verify that the reconnection dialog preserves password case and authenticates correctly.

| # | Test Case | Steps | Expected Result | Pass/Fail |
|---|---|---|---|---|
| 1.1 | Mixed-case password accepted | 1. Log in with mixed-case password (e.g., `MyPass1!Abc`) 2. Kill Oracle session 3. Enter same mixed-case password in reconnect dialog | Reconnection succeeds | |
| 1.2 | Wrong password rejected (first attempt) | 1. Trigger reconnect dialog 2. Enter wrong password | "Wrong Password - Try One More Time" message | |
| 1.3 | Wrong password rejected (second attempt) | 1. Enter wrong password again | "Wrong Password - Application Will Be Terminated" → app closes | |
| 1.4 | All-lowercase password works | 1. User with all-lowercase password triggers reconnect 2. Enter correct lowercase password | Reconnection succeeds | |
| 1.5 | All-uppercase password works | 1. User with all-uppercase password triggers reconnect 2. Enter correct uppercase password | Reconnection succeeds | |

**Troubleshooting**: If reconnect fails with correct password, verify that `sqlca.dbpass` was set case-preserved at login time (check `w_login.srw` line `SQLCA.DBPass = sle_password.text`).

---

### UT-02: LISTAGG Overflow Protection (PB-04)

**Objective**: Verify that the user-roles-orgs report handles large org lists without crashing.

| # | Test Case | Steps | Expected Result | Pass/Fail |
|---|---|---|---|---|
| 2.1 | Normal org list | 1. Open Roles/Orgs report 2. Select criteria for a user with 3-5 orgs | Report displays correctly with full org list | |
| 2.2 | Large org list | 1. (Setup) Assign a test user to 50+ orgs 2. Run Roles/Orgs report for that user | Report displays with org list truncated to `...` at end | |
| 2.3 | No orgs | 1. Run report for user with no org assignments | Report shows user with empty org column | |

**Setup SQL for test 2.2**:
```sql
-- Create test data: user assigned to many orgs
BEGIN
  FOR r IN (SELECT ORG_CODE FROM LCD.ORG_PARAM WHERE ROWNUM <= 60) LOOP
    INSERT INTO LCD.APPL_USER (APPL_USER_ID, ORG_CODE, USER_GROUP)
    VALUES ('LISTAGG_TEST', r.ORG_CODE, 'TECHNICAL');
  END LOOP;
  COMMIT;
END;
/
-- Cleanup after test:
DELETE FROM LCD.APPL_USER WHERE APPL_USER_ID = 'LISTAGG_TEST';
COMMIT;
```

**Troubleshooting**: ORA-01489 means the patch was not applied. Verify the DataWindow SQL in PB IDE.

---

### UT-03: ORA-28001 Password Expired Handler (PB-09)

**Objective**: Verify that expired Oracle passwords trigger the change password flow.

| # | Test Case | Steps | Expected Result | Pass/Fail |
|---|---|---|---|---|
| 3.1 | Expired password → change screen | 1. Expire a test user's password (see setup below) 2. Launch LCD 3. Log in as test user | MessageBox: "Your Oracle password has expired" → Change Password screen opens | |
| 3.2 | Successful password change after expiry | 1. In Change Password screen, enter new valid password 2. Click OK | Password changed, login continues | |
| 3.3 | Cancel password change | 1. In Change Password screen, click Cancel | Application terminates (existing behavior) | |

**Setup SQL**:
```sql
-- Create test user with immediate expiration
ALTER PROFILE DEFAULT LIMIT PASSWORD_LIFE_TIME UNLIMITED; -- ensure default doesn't interfere
CREATE PROFILE LCD_EXPIRE_TEST LIMIT PASSWORD_LIFE_TIME 1/1440;
CREATE USER LCD_EXPIRE_USER IDENTIFIED BY "TestExpire1!" PROFILE LCD_EXPIRE_TEST;
GRANT CREATE SESSION, LCD_DEFAULT TO LCD_EXPIRE_USER;
INSERT INTO LCD.APPL_USER (APPL_USER_ID, ORG_CODE, USER_PASSWORD)
VALUES ('LCD_EXPIRE_USER', '010', 'A' || TO_CHAR(SYSDATE, 'YYYYMMDD'));
COMMIT;
-- Wait 2 minutes, then test login
```

**Cleanup SQL**:
```sql
DROP USER LCD_EXPIRE_USER CASCADE;
DROP PROFILE LCD_EXPIRE_TEST;
DELETE FROM LCD.APPL_USER WHERE APPL_USER_ID = 'LCD_EXPIRE_USER';
COMMIT;
```

---

### UT-04: ORA-28002 Password Expiring Soon (PB-09)

**Objective**: Verify that soon-to-expire passwords show a warning but allow login.

| # | Test Case | Steps | Expected Result | Pass/Fail |
|---|---|---|---|---|
| 4.1 | Password expiring warning | 1. Set test user's profile to expire in 3 days 2. Log in | Warning MessageBox: "password will expire soon" → login continues normally | |
| 4.2 | Application functions after warning | 1. Dismiss warning 2. Navigate to Workers, Time, Reports | All screens function normally | |

**Setup SQL**:
```sql
CREATE PROFILE LCD_WARN_TEST LIMIT PASSWORD_LIFE_TIME 3 PASSWORD_GRACE_TIME 7;
ALTER USER <test_user> PROFILE LCD_WARN_TEST;
ALTER USER <test_user> IDENTIFIED BY "<same_password>"; -- reset timer
-- Login within grace period to trigger ORA-28002
```

---

### UT-05: DBA_ROLE_PRIVS Access (PB-02)

**Objective**: Verify that all screens using DBA_ROLE_PRIVS function correctly.

| # | Test Case | Steps | Expected Result | Pass/Fail |
|---|---|---|---|---|
| 5.1 | Login role retrieval | 1. Log in to LCD | Main window opens, menus enabled based on roles | |
| 5.2 | Set User Roles screen | 1. Navigate to Admin > Set User Roles 2. Enter a user ID 3. Click Retrieve | Checkboxes populate with current role assignments | |
| 5.3 | Security Report | 1. Navigate to Admin > Security Report | Report displays user/role data | |
| 5.4 | User Role Report | 1. Navigate to Admin > Roles/Orgs Report 2. Set criteria and generate | Report generates with role and org data | |
| 5.5 | Special Wages dropdown | 1. Navigate to Special Payments 2. Open a special pay record | Wage type dropdown populates based on user's roles | |

**Troubleshooting**: ORA-00942 on any of these → DBA needs to grant SELECT on DBA_ROLE_PRIVS.

---

## Phase 2: Integration Tests — Module-Level Verification

### IT-01: Security Module (LCD7)

**Reference**: `tasks/41-LCD-GUI/INDEX.md` — LCD7 Module

| # | Test Case | Screens Involved | Steps | Expected Result |
|---|---|---|---|---|
| 1 | Full login cycle | w_login, w_hello, w_main | Launch app → login → splash → main | All screens render, menu security applied |
| 2 | Create user | w_create_user | Admin > Create User → fill form → OK | User created in Oracle, default role granted |
| 3 | Change own password | w_change_password | Admin > Change Password → enter old/new/confirm | Password changed, global variable updated |
| 4 | Change another's password | w_change_password_for_another | Admin > Change Another's Password → enter user/new | Password changed for target user |
| 5 | Drop user | w_drop_user | Admin > Drop User → enter user → OK | User dropped from Oracle and APPL_USER |
| 6 | Add user to org | w_add_user_to_organization_new | Admin > Add to Org → select org → save | User added to organization |
| 7 | Drop user from org | w_drop_user_from_organization | Admin > Drop from Org → select org → OK | User removed from organization |
| 8 | Unlock user | w_unlock_user | Admin > Unlock User → enter locked user → OK | Account unlocked |
| 9 | Change organization | w_change_org, w_login | File > Change Org → select org → login | Reconnects to same DB with new org context |
| 10 | Security history | w_users_secur_hist, w_secur_hist | Admin > Security History → select criteria | Audit log displays |

---

### IT-02: Timekeeping Module (TIME)

**Reference**: `tasks/41-LCD-GUI/TIME/INDEX.md`

| # | Test Case | Screens Involved | Steps | Expected Result |
|---|---|---|---|---|
| 1 | Time entry | w_time_transactions | Processing > Time Entry → select worker → enter time | Time saved via TIMESAVE RPCFUNC |
| 2 | Time validation | w_time_transactions | Enter invalid time → save | Error displayed from TIME_EDITS_VALIDATION RPCFUNC |
| 3 | Time error display | d_time_errors | Trigger error → view error log | Error DW loads (tests outer join PB-03) |
| 4 | Late time | w_late_time | Processing > Late Time → retrieve | DataWindow loads |

---

### IT-03: Payroll Module (PAY)

**Reference**: `tasks/41-LCD-GUI/PAY/INDEX.md`

| # | Test Case | Screens Involved | Steps | Expected Result |
|---|---|---|---|---|
| 1 | Payroll processing | w_payroll | Processing > Payroll → select org/week → execute | LOADPAY RPCFUNC called successfully |
| 2 | Payroll insert | w_payroll_insert | Processing > Payroll Insert | Insert completes |
| 3 | Payroll errors | w_payroll_errors | View payroll errors | Error display works |

---

### IT-04: Adjustments Module (ADJUST)

**Reference**: `tasks/41-LCD-GUI/ADJUST/INDEX.md`

| # | Test Case | Screens Involved | Steps | Expected Result |
|---|---|---|---|---|
| 1 | Individual adjustment | w_r_adjust_individual | Adjustments > Individual → enter criteria | Adjustment screen loads |
| 2 | Global adjustment | w_r_adjust_global | Adjustments > Global → enter criteria | Global adjustment screen loads |
| 3 | Approval workflow | w_r_adjust_approvals | Adjustments > Approvals → retrieve | Approval list displays |

---

### IT-05: Distribution Module (DISTRIB7)

**Reference**: `tasks/41-LCD-GUI/DISTRIB7/INDEX.md`

| # | Test Case | Screens Involved | Steps | Expected Result |
|---|---|---|---|---|
| 1 | Reconciliation | w_reconcile_date | Distribution > Reconcile → select dates | Runs nvo_distribution with (+) outer joins (PB-03) |
| 2 | Problem tracking | w_dist_problem | Distribution > Problems → retrieve | Problem list displays |

---

### IT-06: Batch Processing & File I/O (SHARED, ADMIN)

**Reference**: `tasks/41-LCD-GUI/SHARED/INDEX.md`, `tasks/41-LCD-GUI/ADMIN/INDEX.md`

| # | Test Case | Screens Involved | Steps | Expected Result |
|---|---|---|---|---|
| 1 | Job status display | w_show_status | Submit a batch job → view status | Progress bar updates via DBMS_PIPE (SS-05) |
| 2 | Cancel batch job | w_show_status | Click Cancel Job during running job | Job cancelled via BRJOB/RMQUEUE |
| 3 | Import employees | w_field_delimiter | Processing > Import → select file | File imported via GETOPENFILE RPCFUNC (SS-07) |
| 4 | Table copy | w_p_copy_tables | Admin > Copy Tables → select envs → execute | P_COPY_TABLES RPCFUNC with DB links (PB-10) |

---

### IT-07: Reports Module (REPORTS)

**Reference**: `tasks/41-LCD-GUI/REPORTS/INDEX.md`

| # | Test Case | Screens Involved | Steps | Expected Result |
|---|---|---|---|---|
| 1 | Vendor Summary | w_reports_vendor_summary_criteria | Reports > Vendor Summary → criteria → generate | Report loads (tests (+) outer joins in DW) |
| 2 | Subcontractor AP | corresponding report screen | Reports > Subcontractor AP → generate | Report loads |
| 3 | Labor Summary | w_reports_labor_summary_criteria | Reports > Labor Summary → generate | Report loads |

---

### IT-08: Table Maintenance (TBLADMIN, TBLWO, TBLCOST)

| # | Test Case | Module | Steps | Expected Result |
|---|---|---|---|---|
| 1 | Org Parameters | TBLADMIN | Tables > Org Param → retrieve | d_org_param loads with (+) joins |
| 2 | Work Orders | TBLWO | Tables > Work Orders → retrieve | DW loads, error display works |
| 3 | Primary Wages | TBLCOST | Tables > Cost Calc Setup → Primary Wages | d_primary_wage loads with (+) join |
| 4 | Worker Assignments | TBLASIGN | Tables > Worker Assignments → retrieve | DW loads |

---

### IT-09: Special Payments (SPECPAY1)

**Reference**: `tasks/41-LCD-GUI/SPECPAY1/INDEX.md`

| # | Test Case | Screens Involved | Steps | Expected Result |
|---|---|---|---|---|
| 1 | Special pay main | w_p_specpay_main | Payroll > Special Pay → retrieve | Loads with dddw_special_wages dropdown (PB-02) |
| 2 | Special pay approve | w_p_specpay_approve_exec | Approve/execute a special pay | Completes successfully |

---

## Phase 3: End-to-End Workflow Tests

These tests simulate complete user workflows that exercise multiple modules.

### E2E-01: New Employee Lifecycle

1. **Create Oracle user**: Admin > Create User → enter details → OK
2. **Set roles**: Admin > Set User Roles → assign LCD_PAY_MOD, LCD_PAY_VIEW
3. **Add to org**: Admin > Add to Org → assign to org 010
4. **Log in as new user**: Close LCD → relaunch → log in as new user
5. **Verify menu access**: Only payroll-related menus should be enabled
6. **Enter time**: Processing > Time Entry → enter time for a worker → save
7. **Run payroll**: Processing > Payroll → execute
8. **Change password**: Admin > Change Password → set new password
9. **Log out and back in**: Verify new password works
10. **Drop user**: Log in as admin → Admin > Drop User → remove test user

**Expected**: All steps complete without errors. Tests PB-01, PB-02, PB-05, PB-09.

---

### E2E-02: Organization Switch with Reconnection

1. **Log in**: Enter credentials for org 010
2. **Switch org**: File > Change Organization → select org 114 (FEDERAL)
3. **Re-authenticate**: Enter password (mixed-case) in login screen
4. **Verify context**: Check window title shows new org
5. **Navigate**: Open Workers, Time, Reports screens
6. **Force disconnect**: Kill session from DBA side
7. **Reconnect**: Enter password in reconnect dialog
8. **Resume work**: Continue working in the new org context

**Expected**: All steps work. Org switch re-authenticates, reconnect preserves case. Tests PB-01, PB-07, PB-08.

---

### E2E-03: Security Reports Full Cycle

1. **Generate Security Report**: Admin > Security Report → verify DBA_ROLE_PRIVS access
2. **Generate Roles/Orgs Report**: Admin > Roles/Orgs Report → select all orgs → generate
3. **Verify LISTAGG**: Check that users with many orgs show truncated list
4. **Generate User Group Report**: Admin > User Group Report
5. **Generate Inactive User Report**: Admin > Inactive User Report
6. **Export data**: Click Export button on any report

**Expected**: All reports generate without ORA-00942 or ORA-01489. Tests PB-02, PB-04.

---

### E2E-04: Batch Import with Progress Display

1. **Prepare import file**: Place a test employee import file in the org's IN directory
2. **Start import**: Processing > Import Employees → select file → submit
3. **Monitor progress**: Job status window shows progress bar updating
4. **Verify completion**: Status shows "Complete" with record counts
5. **Check results**: Open Workers screen → verify imported data

**Expected**: File found via Directory Objects, progress updates via DBMS_PIPE. Tests PB-05 (RPCFUNC), SS-05 (DBMS_PIPE), SS-07 (UTL_FILE).

---

### E2E-05: Distribution and Cost Calculation

1. **Set up**: Ensure time and payroll data exists for a test period
2. **Run cost calculation**: Processing > Cost Calculation → execute
3. **Run distribution**: Processing > Distribute → select posted date → execute
4. **Monitor**: View job status during execution
5. **Check reconciliation**: Distribution > Reconciliation → verify results
6. **View problems**: Distribution > Problems → check for any issues

**Expected**: Distribution engine runs with (+) outer joins successfully. Tests PB-03, PB-05.

---

## Test Environment Requirements

| Requirement | Details |
|---|---|
| **Database** | Oracle 19c PDB (UAT: Q22S) |
| **Server** | `/csclcdnc0002/Q22S` filesystem accessible |
| **Directory Objects** | All `LCD_*` directories created per `DB_DIRECTORIES.txt` |
| **Task 42-2 SQL** | Server-side patches deployed |
| **Test Users** | At least 2: one admin (LCD_ADMIN_CTRL), one standard (LCD_PAY_MOD) |
| **Test Data** | Workers, time records, payroll data in at least one org |

---

## Test Execution Summary Template

| Test ID | Description | Tester | Date | Result | Notes |
|---|---|---|---|---|---|
| UT-01.1 | Mixed-case password reconnect | | | | |
| UT-02.1 | Normal LISTAGG | | | | |
| UT-03.1 | Expired password flow | | | | |
| UT-04.1 | Password expiring warning | | | | |
| UT-05.1 | Login role retrieval | | | | |
| IT-01.1 | Full login cycle | | | | |
| IT-06.1 | Job status display | | | | |
| E2E-01 | New employee lifecycle | | | | |
| E2E-02 | Org switch + reconnect | | | | |
| E2E-03 | Security reports | | | | |
| E2E-04 | Batch import | | | | |
| E2E-05 | Distribution | | | | |

---

*End of test plan.*
