User: @lcd_Oracle19c_risk_analysis_plan_PB_ONLY.md
@tasks\42\pb_gui_analysis\uat
Please see the attached server-side risk analysis plan and perform the following tasks:

0. Please treat "powerbuilder-pb-frontend" as the project root for backing up files and writing  new files. All files should be written here and its associated subfolders.


1. From the risk analysis plan identify the files from the "pb_export/" folder that need to be touched to make them compatible with Oracle 19c and remediate the risks. Please backup, clone and copy these files into the "originals/" and "patched/" subfolders.

2. Brainstorm a design and create a multi-phased implementation plan and to-do list to update the code to fix all the risks. Save the full plan as a makrdown file. The code changes should be applied to the files in the "patched" folder. All code updates, changes, and injections should be proceeded by line/flowerbox comments. Please preceed each new comment with the text "-- RdW 5/24/2026 Powerbuilder GUI-SS Oracle 19c Migration ". Please append this with a description of the changes being made. Also, include DBMS output debug statements to output the values of file system related variables for debugging and diagnostic testing that can be commented out later.
Please see the file "LCD_ORGPARAM_Q22S-19c-UPDATED.csv"  and the "LCD_SERVER_LOC" column, and also the "LCD_FILE_PARAM-Q22S-11g-Copied.txt" file for the correct folder locations for each org that were used in Oracle 11g. The "DB_DIRECTORIES.txt" file contains the new 19c directories that were set up by the DBA. Please note for each org, the "LCD_SERVER_LOC" column should point to a valid location on the Linux filesystem shared drive. Create a detailed deployment plan as a markdown file showing step-by-step instructions on how to deploy the patched files. Include details with expected results and troubleshooting typical issues.

2b. For each change in step 2 above done by the agent. Please create a markdown file with step-by-step instructions on how to implement each change manually, by hand, using the Appeon Powerbuilder 2021 IDE. Please use your web search tool calling abilities to get the up-to-date documentation from the web as needed.

2c. For any changes that cannot be done by agent and must be completed manually, also include these changes in the same markdown file created in step 2b above in a separate section.


3. Brainstorm a design and create a multi-phased implementation plan and to-do list to implement a unit test plan harness to test the new scripts to verify the correct functionality. Please save the full testing implementation plan as a markdown file. Include step-by-step test plans with expected results and troubleshooting tips.



Please include additional test plans for end-to-end testing with end-user functions from within the GUI application. Use the "tasks\41-LCD-GUI\" and "pb_export\" folder for reference and contexts of the GUI functions.



GitHub Copilot: Let me explore the workspace in depth before drafting the plan. I'll launch parallel explorations.   

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/tasks/42/pb_gui_analysis/uat/DB_DIRECTORIES.txt)

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/tasks/42/pb_gui_analysis/uat/LCD_ORGPARAM_Q22S-19c-UPDATED.csv#1-1), lines 1 to 80

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/tasks/42/pb_gui_analysis/uat/LCD_FILE_PARAM-Q22S-11g-Copied.txt)

Now let me explore the key source files referenced in the risk analysis:   

Explore risk files in pb_export

Explore tasks/41-LCD-GUI for GUI context

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/tasks/42/pb_gui_analysis/powerbuilder-pb-frontend)

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/pb_export)

Searched for files matching `**/pb_export/**/*.srd`, 20 matches

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/tasks/41-LCD-GUI)

Searched for files matching `**/tasks/41-LCD-GUI/INDEX.md`, 1 match

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/tasks/41-LCD-GUI/MASTER_INDEX.md#1-1), lines 1 to 100

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/tasks/41-LCD-GUI/INDEX.md#1-1), lines 1 to 100

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/tasks/41-LCD-GUI/w_main.md#1-1), lines 1 to 100

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/tasks/41-LCD-GUI/w_login.md#1-1), lines 1 to 100

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/tasks/41-LCD-GUI/w_change_password.md)

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/tasks/41-LCD-GUI/w_support_systems.md)

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/tasks/41-LCD-GUI/w_unlock_user.md)

Searched for files matching `**/pb_export/**/d_att_wage_map_err.srd`, 1 match

Searched for files matching `**/pb_export/**/d_toe_att_map_err.srd`, 1 match

Searched for files matching `**/pb_export/**/d_time_genwage_err.srd`, 1 match

Searched for files matching `**/pb_export/**/d_primary_wage_err.srd`, 1 match

Searched for files matching `**/pb_export/**/d_add_user_orgs.srd`, 1 match

Searched for files matching `**/pb_export/**/d_reason_codes.srd`, 1 match

Searched for files matching `**/pb_export/**/d_news.srd`, 1 match

Searched for files matching `**/pb_export/**/w_main.srw`, 1 match

Searched for files matching `**/pb_export/**/f_acct_int.srf`, 1 match

Searched for files matching `**/pb_export/**/d_report_time_adjustments.srd`, 1 match

Searched for files matching `**/pb_export/**/d_user_roles_orgs.srd`, 1 match

Searched for files matching `**/pb_export/**/d_user_roles.srd`, 1 match

Searched for files matching `**/pb_export/**/d_granted_roles.srd`, 1 match

Searched for files matching `**/pb_export/**/uo_trans.sru`, 1 match

Searched for files matching `**/pb_export/**/w_change_password.srw`, 1 match

Searched for files matching `**/pb_export/**/d_reason_codes_multylang.srd`, 1 match

Searched for files matching `**/pb_export/**/d_tes_results.srd`, 1 match

Searched for files matching `**/pb_export/**/w_p_copy_tables.srw`, 1 match

Searched for files matching `**/pb_export/**/w_news_send.srw`, 1 match

Searched for files matching `**/pb_export/**/d_payroll_error.srd`, 1 match

Searched for files matching `**/pb_export/**/nvo_distribution.sru`, 1 match

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/pb_export/TBLINTRF/d_toe_att_map_err.srd#1-1), lines 1 to 60

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/pb_export/TBLDIST/d_att_wage_map_err.srd#1-1), lines 1 to 60

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/pb_export/TBLCOST/d_time_genwage_err.srd#1-1), lines 1 to 60

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/pb_export/TBLCOST/d_primary_wage_err.srd#1-1), lines 1 to 60

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/pb_export/TIME/d_wage_determination_rates_err.srd#1-1), lines 1 to 60

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/pb_export/LCD7/d_add_user_orgs.srd#1-1), lines 1 to 60

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/pb_export/DISTRIB7/nvo_distribution.sru#1-1), lines 1 to 60

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/pb_export/TBLADMIN/d_reason_codes.srd#1-1), lines 1 to 60

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/pb_export/NEWS/d_news.srd)

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/pb_export/LCD7/w_main.srw#1-1), lines 1 to 60

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/pb_export/ACCT/f_acct_int.srf#1-1), lines 1 to 60

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/pb_export/REPORTS/d_report_time_adjustments.srd#1-1), lines 1 to 60

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/pb_export/LCD7/d_user_roles_orgs.srd#1-1), lines 1 to 60

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/pb_export/LCD7/d_user_roles.srd)

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/pb_export/LCD7/d_granted_roles.srd)

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/pb_export/LCD7/uo_trans.sru#1-1), lines 1 to 60

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/pb_export/LCD7/w_change_password.srw#1-1), lines 1 to 60

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/pb_export/TBLADMIN/d_reason_codes_multylang.srd#1-1), lines 1 to 60

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/pb_export/ADMIN/d_tes_results.srd)

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/pb_export/ADMIN/w_p_copy_tables.srw#1-1), lines 1 to 60

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/pb_export/NEWS/w_news_send.srw#1-1), lines 1 to 60

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/pb_export/PAY/d_payroll_error.srd#1-1), lines 1 to 60

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/tasks/42/pb_gui_analysis/powerbuilder-pb-frontend/original)

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/tasks/42/pb_gui_analysis/powerbuilder-pb-frontend/patched)

Read [](file:///c%3A/Users/rwright28/AppData/Roaming/Code/User/workspaceStorage/477bc488b09254803534383b72ad73dc/GitHub.copilot-chat/chat-session-resources/df18bdfa-e941-4992-b9a7-e585bbcf8ffe/toolu_vrtx_01FQQEh7ZD8GnhtUizp3e3BQ__vscode-1779642339733/content.txt#1-1), lines 1 to 200

Now let me check the existing documentation and look at a few more files for completeness:   

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/pb_export/_docs/objects)

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/pb_export/_docs)

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/tasks/41-LCD-GUI/IMPLEMENTATION_PLAN.md#1-1), lines 1 to 80

Now I have sufficient context. Let me compile the plan. 

Created memory file [](file:///c%3A/Users/rwright28/AppData/Roaming/Code/User/workspaceStorage/477bc488b09254803534383b72ad73dc/GitHub.copilot-chat/memory-tool/memories/ZGYxOGJkZmEtZTk0MS00OTkyLWI5YTctZTU4NWJiY2Y4ZmZl/plan.md)

Here is the comprehensive plan:

---

## Plan: Oracle 19c Migration — LCD PowerBuilder GUI

**TL;DR:** 22 PowerBuilder export files (binary UTF-16 LE .srd/.srw/.sru/.srf) need SQL and code fixes across 10 risk categories. The agent will copy all files to `original/` and `patched/`, create 4 deliverable markdown documents, and create DBA SQL scripts. Because PB export files require Appeon PB 2021 IDE for safe editing, the agent produces exact change specifications + the developer applies them in the IDE. Four deliverables are produced: implementation plan, deployment plan, manual IDE guide, and test plan.

---

### Critical Constraint (Governs Everything)

PowerBuilder export files are **UTF-16 LE encoded text files**. Editing them outside the Appeon PB 2021 IDE risks corrupting the DataWindow DSL format. The **agent's role** is to:
- Copy files (original/ and patched/ – maintaining subfolder hierarchy)
- Create all markdown documentation and DBA SQL scripts
- Specify every exact SQL/code change with comment headers
- The developer applies changes in the PB IDE, then re-exports to `patched/`

---

### Phase 0 — File Backup & Inventory

**Step 1.** Copy the following 22+ confirmed risk files from pb_export into both `original/` and `patched/`, **preserving the subfolder structure**:

| Risk | Source Path in pb_export/ |
|------|--------------------------|
| RISK-01 | `TBLDIST/d_att_wage_map_err.srd` |
| RISK-01 | `TBLINTRF/d_toe_att_map_err.srd` |
| RISK-01 | `TBLCOST/d_time_genwage_err.srd` |
| RISK-01 | `TBLCOST/d_primary_wage_err.srd` |
| RISK-01 | `TIME/d_wage_determination_rates_err.srd` |
| RISK-02 | `DISTRIB7/nvo_distribution.sru` + 10 others (grep needed) |
| RISK-03 | `LCD7/d_add_user_orgs.srd`, `TBLADMIN/d_reason_codes.srd`, `PAY/d_payroll_error.srd` + 9 others |
| RISK-04 | `NEWS/d_news.srd`, `NEWS/w_news.srw`, `LCD7/w_main.srw` |
| RISK-05 | `ACCT/f_acct_int.srf`, `ADJUST/d_report_time_adjustments.srd` |
| RISK-06 | `LCD7/d_user_roles_orgs.srd`, `LCD7/d_user_roles.srd`, `LCD7/d_granted_roles.srd` |
| RISK-07 | `LCD7/uo_trans.sru`, `LCD7/w_change_password.srw` |
| RISK-08 | `TBLADMIN/d_reason_codes_multylang.srd` + 8 ROWNUM files |
| RISK-09 | `TIME/d_tes_results.srd` |
| RISK-10 | `ADMIN/w_p_copy_tables.srw` |

**Step 2.** Create `powerbuilder-pb-frontend/FILE_MANIFEST.md` listing every copied file, source location, size, risk category, and status (`PENDING` → `PATCHED`).

---

### Phase 1 — CRITICAL: RISK-01 `TRIM(col(+))` Fix *(5 files)*

**What:** Oracle 19c rejects scalar functions applied to the `(+)` side of a proprietary outer join (ORA-01799).

**Change spec** (to be applied in PB DataWindow Painter → SQL view):

For each file, find patterns like:
```sql
TRIM(LCD.pay_wage_type.pay_wage_type(+))
TRIM(LCD.ATT_ABS_TYPE.ATT_ABS_TYPE(+))
```
Replace the implicit outer join `(+)` form with ANSI syntax:
```sql
-- RdW 5/24/2026 Powerbuilder GUI-SS Oracle 19c Migration
-- RISK-01: Converted TRIM(col(+)) to ANSI LEFT OUTER JOIN to fix ORA-01799 on Oracle 19c
LEFT OUTER JOIN LCD.pay_wage_type ON LCD.pay_wage_type.some_key = t.some_key
  AND TRIM(LCD.pay_wage_type.pay_wage_type) = ...
```

Each `.srd` file needs the DataWindow SQL completely rewritten from `WHERE` clause implicit joins to full ANSI `FROM … LEFT OUTER JOIN … ON` form.

**DBA debug script** (`patched/sql/risk01_debug.sql`): SELECT statements to verify TRIM behavior on each affected table under 19c, with `DBMS_OUTPUT.PUT_LINE` for path/directory variable values.

---

### Phase 2 — HIGH: RISK-06 DBA_ROLE_PRIVS + RISK-07 Password

**RISK-06 — Two options (agent creates both SQL scripts, DBA chooses):**

- `patched/sql/risk06_option_a_grant.sql` — `GRANT SELECT ON DBA_ROLE_PRIVS TO LCD;` with `DBMS_OUTPUT.PUT_LINE` confirming grant
- `patched/sql/risk06_option_b_view.sql` — Creates `LCD.V_ROLE_PRIVS` wrapper view, then PB DataWindow SQL updated to reference `LCD.V_ROLE_PRIVS` instead of `DBA_ROLE_PRIVS`

DataWindow SQL change for `d_user_roles_orgs.srd`, `d_user_roles.srd`, `d_granted_roles.srd`: Replace `DBA_ROLE_PRIVS` → `LCD.V_ROLE_PRIVS` (or keep `DBA_ROLE_PRIVS` if Option A chosen).

**RISK-07 — Password Management (manually reviewed in IDE):**

- `LCD7/uo_trans.sru`: Audit `CHANGE_PASSWORD` and `VERIFY_PASSWORD` RPCFUNC declarations; confirm server-side procs don't call `SYS.VERIFY_FUNCTION@ites_lcd` (deprecated in 12c, removed in 19c)
- `LCD7/w_change_password.srw`: Verify 14-char minimum enforcement still aligns with 19c's password complexity defaults
- Agent creates `patched/sql/risk07_audit_password_procs.sql` — queries `USER_SOURCE` to find `VERIFY_FUNCTION` references in the LCD schema

---

### Phase 3 — MEDIUM-HIGH: RISK-02 `(+)` Join Migration *(11+ files)*

**Change spec:** All remaining `(+)` join patterns (not already fixed in Phase 1) converted to ANSI `LEFT/RIGHT OUTER JOIN … ON` in DataWindow SQL. Special attention:
- `DISTRIB7/nvo_distribution.sru` — 3 complex `(+)` conditions in PB function code
- `NEWS/w_news_send.srw` — `ORG_CODE (+) BETWEEN :start AND :end` (not valid even in 19c)

Agent identifies the full list of `(+)` files via grep of decoded UTF-16 content or from _docs analysis, adds them to the manifest.

---

### Phase 4 — MEDIUM: RISK-03, RISK-04, RISK-05

**RISK-03 — `SYS.DUAL` (12 DataWindows):**
- Global search for `SYS.DUAL`; replace with `DUAL` in DataWindow SQL for each of the 12 files
- Comment: `-- RdW 5/24/2026 Powerbuilder GUI-SS Oracle 19c Migration -- RISK-03: Replaced SYS.DUAL with DUAL`

**RISK-04 — `TO_DATE(numeric)` (3 files):**
- `d_news.srd`, `w_news.srw`, `w_main.srw` — quote numeric literals:
  - `TO_DATE(19000101,'YYYYMMDD')` → `TO_DATE('19000101','YYYYMMDD')`

**RISK-05 — `NEXT_DAY('FRIDAY')` (2 files):**
- `ACCT/f_acct_int.srf` — 3 occurrences in PB function code
- Replace: `NEXT_DAY(actual_date, 'FRIDAY')` → `actual_date + MOD(6 - TO_NUMBER(TO_CHAR(actual_date, 'D')), 7)`
- Agent creates `patched/sql/risk05_nextday_test.sql` to verify arithmetic equivalence

---

### Phase 5 — LOW-MEDIUM: RISK-08, RISK-09, RISK-10

**RISK-08 — `ROWNUM` sort trick (1 critical file):**
- `d_reason_codes_multylang.srd`: Replace `DECODE(…, rownum, rownum + 100000)` sort trick with `ROW_NUMBER() OVER (ORDER BY …)` analytic function

**RISK-09 — Date mask (1 file):**
- `d_tes_results.srd`: `'dd-mon-yy hh24:mi:ss'` → `'dd-mm-yyyy hh24:mi:ss'`

**RISK-10 — DB Links (1 file):**
- `ADMIN/w_p_copy_tables.srw`: No PB code change needed; PB reads link names from `LCD.SUPPORT_SYSTEMS`
- Agent creates `patched/sql/risk10_dblink_recreation.sql` with DROP and CREATE DATABASE LINK statements for `@ites_lcd` and all links from `SUPPORT_SYSTEMS`, with `DBMS_OUTPUT.PUT_LINE` to echo each link name/status

---

### Phase 6 — Oracle Directory Migration (UTL_FILE / LCD_SERVER_LOC)

This connects the UAT CSV data to the 19c DB Directory objects set up by the DBA.

**Agent creates `patched/sql/risk_utlfile_directory_mapping.sql`** with:
1. A reference table showing Org Code → `LCD_SERVER_LOC` path → Oracle 19c Directory Name:

| Org Group | 11g Path (LCD_SERVER_LOC) | 19c Oracle Dir (IN) | 19c Oracle Dir (OUT) | 19c Oracle Dir (ARCH) |
|---|---|---|---|---|
| Default (most orgs) | `/csclcdnc0002/Q22S` | `LCD_IN` | `LCD_OUT` | `LCD_ARCH` |
| FEDERAL (114) | `/csclcdnc0002/Q22S-FEDERAL` | `LCD_FEDERAL_IN` | `LCD_FEDERAL_OUT` | `LCD_FEDERAL_ARCH` |
| CANADA (574) | `/csclcdnc0002/Q22S-CANADA` | `LCD_CANADA_IN` | `LCD_CANADA_OUT` | `LCD_CANADA_ARCH` |
| 663-group | `/csclcdnc0002/Q22S-663` | `LCD_663_IN` | `LCD_663_OUT` | `LCD_663_ARCH` |
| 149-group | `/csclcdnc0002/Q22S-149` | `LCD_149_IN` | `LCD_149_OUT` | `LCD_149_ARCH` |
| 285-group | `/csclcdnc0002/Q22S-285` | `LCD_285_IN` | `LCD_285_OUT` | `LCD_285_ARCH` |

2. Verification queries confirming each Oracle Directory exists: `SELECT * FROM ALL_DIRECTORIES WHERE DIRECTORY_NAME LIKE 'LCD%'` with `DBMS_OUTPUT.PUT_LINE` for each result
3. A `LCD_FILE_PARAM` UPDATE script converting legacy UTL_FILE_DIR path strings to named directory references (if `LCD_FILE_PARAM` table is still used in 19c)

**Note:** If any PB code in `uo_trans.sru` or other `.sru` files passes raw paths to Oracle stored procedures, those calls must be audited in the IDE. Agent creates a checklist in the implementation plan.

---

### Phase 7 — Deliverable Documents

The agent creates 4 markdown files and a `patched/sql/` folder:

| File | Path |
|---|---|
| Implementation Plan | `powerbuilder-pb-frontend/ORACLE_19C_MIGRATION_IMPLEMENTATION_PLAN.md` |
| Deployment Plan | `powerbuilder-pb-frontend/ORACLE_19C_DEPLOYMENT_PLAN.md` |
| Manual IDE Instructions (2b + 2c) | `powerbuilder-pb-frontend/ORACLE_19C_MANUAL_IDE_INSTRUCTIONS.md` |
| Test Plan | `powerbuilder-pb-frontend/ORACLE_19C_TEST_PLAN.md` |
| DBA SQL scripts | `powerbuilder-pb-frontend/patched/sql/risk01_debug.sql`, `risk06_option_a_grant.sql`, `risk06_option_b_view.sql`, `risk07_audit.sql`, `risk10_dblink_recreation.sql`, `risk_utlfile_directory_mapping.sql` |

---

### Phase 8 — Deployment Plan Structure

`ORACLE_19C_DEPLOYMENT_PLAN.md` covers:

1. **Pre-deployment DBA** — Verify 19c Oracle Directories exist (`ALL_DIRECTORIES`); apply RISK-06 grant or view; drop/recreate DB links; run `risk_utlfile_directory_mapping.sql`
2. **Backup** — Export current production PBLs to timestamped archive folder
3. **Build** — Open patched/ files in Appeon PB 2021; full rebuild of affected PBLs (`TBLDIST.pbl`, `TBLINTRF.pbl`, `TBLCOST.pbl`, `TIME.pbl`, `LCD7.pbl`, `NEWS.pbl`, `ACCT.pbl`, `DISTRIB7.pbl`, `TBLADMIN.pbl`, `ADMIN.pbl`, `PAY.pbl`)
4. **Deploy EXE** — Replace LCD.EXE on app server; update INI file DB connection string if NLS settings changed
5. **Smoke test** — Login, change org, verify security screens load
6. **Rollback** — Restore previous PBLs/EXE if failures found
7. Expected results and troubleshooting for each step

---

### Phase 9 — Test Plan Structure

`ORACLE_19C_TEST_PLAN.md` covers:

**Unit Tests (per risk):**
- RISK-01: Run each patched DataWindow SQL directly in SQL*Plus; confirm no ORA-01799
- RISK-06: Login as LCD user; open `w_set_user_roles`; confirm roles load; test with/without `SELECT ANY DICTIONARY`
- RISK-07: Change password via `w_change_password`; verify old/new password validation; test with 19c complexity rules
- RISK-04: Open windows with date filter; submit with and without NLS settings; confirm no ORA-01861
- RISK-05: Run accounting interface for a Friday-week-end org; verify correct date computed
- RISK-08: Open `d_reason_codes_multylang`; verify display order is deterministic across multiple runs
- RISK-03: Open each affected window; confirm no ORA-00942 (table/view not found on SYS.DUAL)
- RISK-10: Open `ADMIN/w_p_copy_tables`; verify DB link list loads; attempt a copy-table operation

**Integration Tests:**
- Full login flow → org selection → time entry screen load (validates file path resolution)
- Distribution run through DISTRIB7 module (validates nvo_distribution.sru outer joins)
- Accounting interface generation through `ACCT/w_acct_interface` → `f_acct_int.srf`

**End-to-End GUI Tests** (using 41-LCD-GUI as reference):
- `w_login` → `w_hello` → `w_main`: verify MDI frame loads, security roles applied
- `w_main` Administration → Change Password: full password change cycle
- `w_main` Administration → Unlock User: unlock a test user
- `w_main` Administration → Set User Roles: assign/remove roles; verify `d_user_roles_orgs.srd` loads
- `w_main` Administration → Add User to Organization: verify `d_add_user_orgs.srd` SYS.DUAL fix works
- NEWS module: open `w_news`; verify `TO_DATE('19000101','YYYYMMDD')` does not error
- ACCT module: run interface; verify NEXT_DAY replacement produces correct Friday
- REPORTS module: open time adjustment report; verify date mask works

---

### Relevant Files

- lcd_Oracle19c_risk_analysis_plan_PB_ONLY.md — source risk analysis (read-only reference)
- LCD_ORGPARAM_Q22S-19c-UPDATED.csv — org → LCD_SERVER_LOC mapping
- DB_DIRECTORIES.txt — 19c Oracle Directory objects (DEV/QA/UAT)
- LCD_FILE_PARAM-Q22S-11g-Copied.txt — 11g UTL_FILE_DIR path list
- d_att_wage_map_err.srd — RISK-01 critical
- d_user_roles_orgs.srd — RISK-06 high
- uo_trans.sru — RISK-07 high
- w_main.srw — RISK-04 + security hub
- f_acct_int.srf — RISK-05
- nvo_distribution.sru — RISK-02
- 41-LCD-GUI — GUI screen reference for E2E test specs

---

### Decisions & Scope

- **Agent does**: file copy, all 4 markdown files, all DBA SQL scripts, exact change specifications with `-- RdW 5/24/2026 ...` comment headers, DBMS_OUTPUT debug lines in SQL scripts
- **Developer does**: apply changes in Appeon PB 2021 IDE DataWindow/Script painters; re-export to `patched/`
- **DBA does**: RISK-06 grant or view, RISK-10 DB link recreation, RISK-07 server-side proc audit
- **Out of scope**: Changes to Oracle stored packages, modifications to non-GUI server-side code, changes to non-LCD-GUI PBLs
- **Comment in SQL scripts**: `-- RdW 5/24/2026 Powerbuilder GUI-SS Oracle 19c Migration`
- **Comment in PB source**: `// RdW 5/24/2026 Powerbuilder GUI-SS Oracle 19c Migration`

### Further Considerations

1. **RISK-02 full file list**: The plan lists 11+ files with `(+)` joins but the exact roster needs a grep pass over decoded UTF-16 content — the agent will do this during implementation using the objects folder (which may contain decoded text) or a file search step.

2. **RISK-06 Option A vs B**: Does your DBA prefer granting `SELECT ON DBA_ROLE_PRIVS TO LCD` directly, or creating a wrapper view? Recommendation: Option B (wrapper view) is more CIS-hardening compliant but requires a DataWindow SQL change. **Please confirm preference before implementation begins.**

3. **NLS Connection String**: RISK-05 (`NEXT_DAY`) and RISK-09 (`dd-mon-yy`) can both be partially mitigated by setting `NLS_DATE_LANGUAGE=AMERICAN` in the Oracle connection string (SQLCA initialization in `lcd.sra` or INI file). Should this be added as an additional defense in depth? **Please confirm.**

User: in response to "Further Considerations" 1. Please add tasks for the agent to complete this step. 2. Option A has been completed proceed as if Option A has been completed. 3. please add this to the plan

GitHub Copilot: Updated memory file [](file:///c%3A/Users/rwright28/AppData/Roaming/Code/User/workspaceStorage/477bc488b09254803534383b72ad73dc/GitHub.copilot-chat/memory-tool/memories/ZGYxOGJkZmEtZTk0MS00OTkyLWI5YTctZTU4NWJiY2Y4ZmZl/plan.md)

Read memory [](file:///c%3A/Users/rwright28/AppData/Roaming/Code/User/workspaceStorage/477bc488b09254803534383b72ad73dc/GitHub.copilot-chat/memory-tool/memories/ZGYxOGJkZmEtZTk0MS00OTkyLWI5YTctZTU4NWJiY2Y4ZmZl/plan.md)

The session file only has the context summary. Let me update it with the resolved decisions and present the updated plan. 

Updated memory

Updated memory file [](file:///c%3A/Users/rwright28/AppData/Roaming/Code/User/workspaceStorage/477bc488b09254803534383b72ad73dc/GitHub.copilot-chat/memory-tool/memories/ZGYxOGJkZmEtZTk0MS00OTkyLWI5YTctZTU4NWJiY2Y4ZmZl/plan.md)

Good. Here is the updated plan with all three items resolved:

---

## Plan: Oracle 19c Migration — LCD PowerBuilder GUI *(Updated)*

**TL;DR:** Same approach as before. Three open items from the prior review are now resolved below. All other phases remain as specified.

---

### Resolved Items (Changes to Prior Plan)

---

#### 1. RISK-02 Full File List — Agent Task Added

**New agent step added to Phase 3 (before any patching begins):**

The agent will perform a two-pass scan to build the definitive `(+)` join file roster:

- **Pass 1** — Search objects subfolders (decoded text documentation) for the `(+)` pattern using grep
- **Pass 2** — Run a binary-aware `grep` across all `pb_export/**/*.srd`, `*.srw`, `*.sru`, `*.srf` files treating them as UTF-16 text (searching for the Unicode-encoded `(+)` byte sequence)
- The full discovered list is written to `FILE_MANIFEST.md` under a RISK-02 section, each file tagged `STATUS: PENDING`
- All newly discovered files are also copied to `original/` and `patched/` in Phase 0 before any other work proceeds

*This step must complete before Phase 3 begins — it depends on Phase 0 being done.*

---

#### 2. RISK-06 `DBA_ROLE_PRIVS` — Option A Already Completed

- **Grant is in place**: `GRANT SELECT ON DBA_ROLE_PRIVS TO LCD` has been applied by the DBA in the 19c UAT environment
- **No DataWindow SQL changes required** for `d_user_roles_orgs.srd`, `d_user_roles.srd`, or `d_granted_roles.srd`
- These 3 files are still copied to `original/` and `patched/` as a precautionary backup, but are marked **`STATUS: DBA_COMPLETE — NO CODE CHANGE REQUIRED`** in `FILE_MANIFEST.md`
- Agent still produces `patched/sql/risk06_option_a_grant.sql` as an **audit/documentation artifact** containing the grant statement with the `-- RdW 5/24/2026` comment header, for future reference and rollback documentation:
  ```sql
  -- RdW 5/24/2026 Powerbuilder GUI-SS Oracle 19c Migration
  -- RISK-06: DBA_ROLE_PRIVS access — Option A (direct grant) applied in UAT 19c.
  -- This script is an audit record. Grant has already been executed.
  GRANT SELECT ON SYS.DBA_ROLE_PRIVS TO LCD;
  -- Verification:
  BEGIN
    DBMS_OUTPUT.PUT_LINE('DBA_ROLE_PRIVS grant check:');
    FOR r IN (SELECT GRANTEE, PRIVILEGE, ADMIN_OPTION FROM DBA_TAB_PRIVS
              WHERE TABLE_NAME = 'DBA_ROLE_PRIVS' AND GRANTEE = 'LCD') LOOP
      DBMS_OUTPUT.PUT_LINE('  Grantee='||r.GRANTEE||' Priv='||r.PRIVILEGE);
    END LOOP;
  END;
  /
  ```

---

#### 3. NLS_DATE_LANGUAGE=AMERICAN — Added as Defense in Depth

This addition mitigates both **RISK-05** (`NEXT_DAY('FRIDAY')`) and **RISK-09** (`dd-mon-yy` format mask) as a secondary layer alongside the direct code fixes.

**Two implementation points** documented in `ORACLE_19C_MIGRATION_IMPLEMENTATION_PLAN.md` and `ORACLE_19C_MANUAL_IDE_INSTRUCTIONS.md`:

**Point A — `lcd.ini` / Database Profile (agent documents, DBA/admin applies):**
Add to the `[Database]` section of the LCD INI file and/or the Oracle Net connection descriptor:
```ini
; -- RdW 5/24/2026 Powerbuilder GUI-SS Oracle 19c Migration
; RISK-05/RISK-09: Added NLS_DATE_LANGUAGE=AMERICAN to prevent ORA-01846
; on NEXT_DAY() and NLS-sensitive date format masks under non-US locales.
NLS_DateLanguage=AMERICAN
```

**Point B — `s_open_app.srs` Application Open Event (manual IDE change in `lcd.sra` → open event or `s_open_app`):**

In the PowerBuilder application open event where SQLCA is configured, add after the existing SQLCA property assignments:
```
// RdW 5/24/2026 Powerbuilder GUI-SS Oracle 19c Migration
// RISK-05/RISK-09: Force NLS_DATE_LANGUAGE=AMERICAN in session to ensure
// NEXT_DAY('FRIDAY') and 'dd-mon-yy' format masks work regardless of OS locale.
SQLCA.DBParm = SQLCA.DBParm + ",NLS_DateLanguage='AMERICAN'"
```

**Testing caveat** (added to `ORACLE_19C_TEST_PLAN.md`):
- Must verify against org 660 (ASIA locale, `LANGUAGE_CODE=AS`), org 663 (India, `LANGUAGE_CODE=IN`), and UK orgs that the `NLS_DATE_LANGUAGE` override does not break any locale-specific display expectations
- Specific test: login as each locale org, navigate to a date-entry screen, confirm dates display and save correctly

---

### Full Phase Summary *(no other changes)*

| Phase | Scope | Agent Action | Dev/DBA Action |
|-------|-------|-------------|----------------|
| 0 | File copy + RISK-02 full scan | Copy 22+ files; grep for (+) roster; write manifest | Review manifest |
| 1 | RISK-01 TRIM(col(+)) — 5 files | Create SQL change specs + debug scripts | PB IDE DataWindow SQL rewrite |
| 2 | RISK-06 (done) + RISK-07 password | Audit SQL script; password proc query | DBA confirms; IDE review of uo_trans.sru |
| 3 | RISK-02 (+) joins — 11+ files | Create full spec per file | PB IDE DataWindow + code rewrite |
| 4 | RISK-03 SYS.DUAL, RISK-04 TO_DATE, RISK-05 NEXT_DAY | Change specs per file | PB IDE |
| 4+ | NLS connection string | Document in plan + manual guide | INI edit + IDE s_open_app.srs change |
| 5 | RISK-08 ROWNUM, RISK-09 date mask, RISK-10 DB links | Specs + SQL scripts | PB IDE + DBA |
| 6 | Oracle Directory / UTL_FILE mapping | Mapping SQL script + verification queries | DBA validates |
| 7 | 4 markdown deliverables + SQL scripts | Agent creates all | Developer reviews |
| 8 | Deploy | Deployment plan written | DBA + Dev execute |
| 9 | Test | Test plan written | QA executes |

---

All three open items are now resolved. **Ready to proceed to implementation?** If approved, the agent will begin executing Phase 0 (file copy) and all document creation tasks.

