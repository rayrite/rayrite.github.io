User: Please create a new subfolder for unit testing. Create a SQL debug-style script that I can run in SQL developer with DBMS Out enabled to test the output of the termination file..

GitHub Copilot: Read patched files for context

Searched for text `is_pta_terminated` (`**/tasks/37-2/patched/TIMEXPR2.SQL`), 6 results

Searched for files matching `**/tasks/37-2/emp termination 4.sql`, 1 match

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/tasks/37-2/patched/TIMEXPR2.SQL#768-768), lines 768 to 838

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/tasks/37-2/emp%20termination%204.sql)

Read [](file:///c%3A/Users/rwright28/AppData/Roaming/Code/User/workspaceStorage/477bc488b09254803534383b72ad73dc/GitHub.copilot-chat/chat-session-resources/0a4d563c-001d-4252-886d-1e349fe5c40c/toolu_bdrk_01AgiGRS91g2ifCnsqrJ7CEE__vscode-1779412397630/content.txt#1-1), lines 1 to 200

Read [](file:///c%3A/Users/rwright28/AppData/Roaming/Code/User/workspaceStorage/477bc488b09254803534383b72ad73dc/GitHub.copilot-chat/chat-session-resources/0a4d563c-001d-4252-886d-1e349fe5c40c/toolu_bdrk_01AgiGRS91g2ifCnsqrJ7CEE__vscode-1779412397630/content.txt#200-200), lines 200 to 321

Now I have enough context. Let me look at what `week_end` variable is available in `export_gems` to ensure the test script uses the same date logic. 

Searched for text `week_end` (`**/tasks/37-2/patched/TIMEXPR2.SQL`), 20 results

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/tasks/37-2/patched/TIMEXPR2.SQL#900-900), lines 900 to 1000

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/tasks/37-2/patched/TIMEXPR2.SQL#1000-1000), lines 1000 to 1100

I have enough context now. Let me draft the plan. 

Created memory file [](file:///c%3A/Users/rwright28/AppData/Roaming/Code/User/workspaceStorage/477bc488b09254803534383b72ad73dc/GitHub.copilot-chat/memory-tool/memories/MGE0ZDU2M2MtMDAxZC00MjUyLTg4NmQtMWUzNDlmZTVjNDBj/plan.md)

## Plan: PTA Termination Unit Test Script

Create a `unit_tests/` subfolder under 37-2 with a single DBMS_OUTPUT debug script that validates the termination file output and `is_pta_terminated` function behavior against live data.

**Steps**

1. Create directory `tasks/37-2/unit_tests/`
2. Create `tasks/37-2/unit_tests/test_pta_termination_output.sql` — self-contained, runnable in SQL Developer with `SET SERVEROUTPUT ON`

The script will have these sections:

| Section | Purpose |
|---------|---------|
| **1 — Termination Job Preview** | Replicate the core SELECT from `emp termination 4.sql` (current_base + prior_base CTEs) to show which workers/rows the INTER file would contain for the given org/date |
| **2 — is_pta_terminated Validation** | Loop through workers in `lcd.time_export` with `proc_stat_ind IN ('C','P','R')` for the resolved week-end, call `lcd.timeexport.is_pta_terminated()` for each, and print TRUE/FALSE alongside `termination_date` and latest `employment_status` |
| **3 — Duplicate Detection** | Identify workers appearing in BOTH the regular T-file cursor AND the INTER termination file (the duplicate scenario this patch fixes) |
| **4 — Boundary/Edge Cases** | Show workers with `termination_date` in the week window but latest status ≠ `'3'` — these should NOT be excluded from the regular export |

**Key design details:**
- Uses SQL Developer substitution variables (`&v_org`, `&v_run_date`) for interactive input
- Week-end resolved via `NEXT_DAY(TO_DATE(&v_run_date,'YYYYMMDD') - 1, 'FRIDAY')` — matches the termination job
- Read-only: no DDL, no DML — safe to run in any environment
- Calls `lcd.timeexport.is_pta_terminated` directly (wraps BOOLEAN in IF/THEN for DBMS_OUTPUT since PL/SQL BOOLEAN isn't SQL-selectable)

**Relevant files:**
- emp termination 4.sql — termination job query logic to replicate
- TIMEXPR2.SQL — `is_pta_terminated` function (checks `empl_active = '3'`)
- PTA_TERM_EXCLUSION_PATCH_PLAN.md — test scenarios (section 10)

**Verification:**
1. Script runs in SQL Developer without compile errors
2. DBMS_OUTPUT produces labeled columnar output for each section
3. Correctly uses `NEXT_DAY` date logic matching the termination job
4. Directly validates the packaged `is_pta_terminated` function

**Decisions:**
- Single script file (not multiple) — keeps it simple to hand to a DBA
- No test data setup — queries live data, making it useful for pre/post-deploy validation
- BOOLEAN handling: anonymous PL/SQL block with cursor loop + IF for display

User: Start implementation

GitHub Copilot: Created [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/tasks/37-2/unit_tests/test_pta_termination_output.sql)

Created test_pta_termination_output.sql.

The script is ready to run in SQL Developer with DBMS Output enabled. It will prompt for an org code and run date, then produce four labeled sections:

1. **Termination Job Preview** — shows which workers the INTER file would contain
2. **is_pta_terminated Validation** — calls the patched function for each terminated worker with pending export records and prints TRUE/FALSE with explanation
3. **Duplicate Detection** — identifies workers appearing in both the T-file cursor and the termination job criteria
4. **Boundary/Edge Cases** — flags workers with term date in the week window but latest status ≠ `'3'`, verifying they are correctly kept in the regular export

Purely read-only — no DDL or DML.

Made changes.

User: Please create a UNIT_TEST_README.md file with usage instructions and a unit test plan, expected results, and troubleshooting all possible logic errors.

GitHub Copilot: Created [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/tasks/37-2/unit_tests/UNIT_TEST_README.md)

Created UNIT_TEST_README.md with:

- **Usage instructions** — prerequisites, step-by-step SQL Developer execution, and recommended test parameter combinations
- **Unit test plan** — 11-case test matrix mapping inputs to expected `is_pta_terminated` results, plus per-section expected output tables
- **Pass criteria** — clear summary conditions for a successful validation
- **Troubleshooting** — 9 categorized error scenarios covering compilation failures, incorrect TRUE/FALSE results, duplicate detection mismatches, NLS issues, no-output problems, and performance concerns, each with diagnosis steps and resolutions
- **Quick validation checklist** for rapid pass/fail assessment 



Made changes.

User: The client wants a way to see all the timesheet delta hours (from the latest prior time adjustment timesheet) for all the employees that are captured in the INTER{YYMMDD}.{ORG} file. So the output format of the the INTER{YYMMDD}.{ORG} file should be similar to the original T-file `T{YYMMDD}.{ORG}`.
So for example, if an employee make a prior time adjustmnt change activity code 1010 for a WBS code from 9 hours to 6 hours then the output should be -3.

Please perform an investigation of the LCD SQL codebase at @LCD-Oracle/ to see if there is a table I can reference (LABOR_DETAIL, LCD.LABOR_MOD_HIST ?) to fetch the desired output. 

If there is a possibility to fetch the desired data from the LCD database scheme, please write a detailed implementation plan to create new patched stored procedures that contain the desired output. Save as a markdown file.

GitHub Copilot: Created 3 todos

Investigate LCD Oracle tables for time adjustments

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL)

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/Packages)

Searched for regex `LABOR_DETAIL|LABOR_MOD_HIST` (`**/LCD-Oracle/SQL/**/*.sql`), 50 results

Searched for regex `prior time adjustment|time adjustment|mod_hist|labor_mod` (`**/LCD-Oracle/SQL/**/*.sql`), 30 results

Searched for regex `TIME_EXPORT|proc_stat_ind|p_write_gems` (`**/LCD-Oracle/SQL/**/*.sql`), 50 results

Searched for regex `CREATE TABLE.*TIME|CREATE TABLE.*LABOR` (`**/LCD-Oracle/SQL/**/*.sql`), 1 result

Searched for regex `p_write_gems|write.*gems|p_write|T-file|GEMS|cur_gems|proc_cur` (`**/LCD-Oracle/SQL/**/*.sql`), 20 results

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/TIMEXPR2.SQL#1-1), lines 1 to 100

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/LABINT.SQL#2640-2640), lines 2640 to 2750

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/LABINT.SQL#2650-2650), lines 2650 to 2800

Searched for regex `CREATE TABLE.*LABOR_MOD_HIST|CREATE TABLE.*LABOR_DETAIL|CREATE TABLE.*TIME_EXPORT` (`**/LCD-Oracle/SQL/**/*.sql`), no results

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/ProcessEtesAdjustments.sql#1-1), lines 1 to 200

Searched for regex `delta hours|delta_hours|hour difference|bef_lab_units|aft_lab_units|lab_units.*-|delta` (`**/LCD-Oracle/SQL/**/*.sql`), 20 results

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/10g_packages.sql#500-500), lines 500 to 2600

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/SendEtesMessages.sql#95-95), lines 95 to 150

Searched for regex `bef_wo_num|aft_wo_num|bef_lab_units|aft_lab_units|lmh_aprv_ind|mod_aprvl_date` (`**/LCD-Oracle/SQL/**/*.sql`), 30 results

Searched for regex `TIMEXPR|TIME_EXPORT|proc_stat_ind.*'P'|proc_stat_ind.*'R'|record type|proc.*status` (`**/LCD-Oracle/SQL/**/*.sql`), 20 results

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/TIMEXPR2.SQL#100-100), lines 100 to 200

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/TIMEXPR2.SQL#1345-1345), lines 1345 to 1345

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/BACK_PAY.SQL)

Searched for regex `proc_stat_ind.*=.*'[A-Z]'|proc_stat_ind IN|PROC_STAT_IND LIKE` (`**/LCD-Oracle/SQL/**/*.sql`), 20 results

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/TIMEXPR2.SQL#350-350), lines 350 to 1345

Created memory file [](file:///c%3A/Users/rwright28/AppData/Roaming/Code/User/workspaceStorage/477bc488b09254803534383b72ad73dc/GitHub.copilot-chat/memory-tool/memories/MGE0ZDU2M2MtMDAxZC00MjUyLTg4NmQtMWUzNDlmZTVjNDBj/LCD_Prior_Time_Adjustment_Investigation.md)

Starting: *Analyze T-file output format* (2/3)

Deep dive into LABOR_MOD_HIST and p_write_gems

Searched for files matching `**/LCD-Oracle/SQL/*.SQL`, 50 matches

Searched for files matching `**/tasks/37-2/patched/*.SQL`, 2 matches

Searched for regex `^` (`**/LCD-Oracle/SQL/LABINT.SQL`), 1 result

Searched for regex `^` (`**/LCD-Oracle/SQL/ProcessEtesAdjustments.sql`), 1 result

Searched for files matching `**/LABINT.SQL`, 3 matches

Searched for regex `p_write_gems|PROCEDURE p_write_gems` (`**/LCD-Oracle/SQL/TIMEXPR2.SQL`), 5 results

Searched for regex `LABOR_MOD_HIST|p_get_adj` (`**/LCD-Oracle/SQL/LABINT.SQL`), 6 results

Searched for regex `CREATE TABLE.*LABOR_MOD_HIST` (`**/LCD-Oracle/SQL`), no results

Searched for regex `export_gems|proc_cur|cur_gems` (`**/tasks/37-2/patched/TIMEXPR2.SQL`), 20 results

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/TIMEXPR2.SQL#350-350), lines 350 to 420

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/LABINT.SQL#2640-2640), lines 2640 to 2800

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/ProcessEtesAdjustments.sql)

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/tasks/37-2/patched/TIMEXPR2.SQL#140-140), lines 140 to 210

Searched for regex `procedure p_get_adj|PROCEDURE p_get_adj` (`**/LCD-Oracle/SQL/LABINT.SQL`), no results

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/tasks/37-2/patched/TIMEXPR2.SQL#840-840), lines 840 to 1050

Searched for regex `p_get|get_adj|procedure|function` (`**/LCD-Oracle/SQL/LABINT.SQL`), 20 results

Searched for regex `PROCEDURE p_create_labor_file` (`**/LCD-Oracle/SQL/LABINT.SQL`), 4 results

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/LABINT.SQL#2500-2500), lines 2500 to 2900

Searched for regex `CREATE TABLE.*LABOR_MOD_HIST|comment.*LABOR_MOD_HIST` (`**/LCD-Oracle/SQL`), no results

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/LABINT.SQL#2900-2900), lines 2900 to 3100

Searched for text `LABOR_MOD_HIST` (`**/LCD-Oracle/SQL`), no results

Searched for files matching `**/*.md`, 20 matches

Searched for text `CREATE TABLE LABOR_MOD_HIST`, no results

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/tasks/37-2/patched/TIMEXPR2.SQL#1-1), lines 1 to 900

Searched for regex `RECORD_TYPE_FOR_GEMS|TYPE.*record_type_for_gems` (`**/tasks/37-2/patched/TIMEXPR2.SQL`), 3 results

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/tasks/37-2/patched/TIMEXPR2.SQL#1-1), lines 1 to 60

Searched for regex `RECORD_TYPE_FOR_GEMS|wrk_id|wrk_ssn|time_type|act_date|hrs` (`**/tasks/37-2/patched/TIMEXPR1.SQL`), 19 results

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/tasks/37-2/patched/TIMEXPR1.SQL#1-1), lines 1 to 100

Read [](file:///c%3A/Users/rwright28/AppData/Roaming/Code/User/workspaceStorage/477bc488b09254803534383b72ad73dc/GitHub.copilot-chat/chat-session-resources/0a4d563c-001d-4252-886d-1e349fe5c40c/toolu_bdrk_01AMEQU9nWunigSGsCW2VVWk__vscode-1779412397670/content.txt#1-1), lines 1 to 300

Read [](file:///c%3A/Users/rwright28/AppData/Roaming/Code/User/workspaceStorage/477bc488b09254803534383b72ad73dc/GitHub.copilot-chat/chat-session-resources/0a4d563c-001d-4252-886d-1e349fe5c40c/toolu_bdrk_01AMEQU9nWunigSGsCW2VVWk__vscode-1779412397670/content.txt#300-300), lines 300 to 489

Starting: *Write implementation plan markdown* (3/3)

Now let me look at how the termination job currently resolves its data to understand if `LABOR_MOD_HIST` records are accessible for those same terminated workers: 

Check TIME_EXPORT proc_stat_ind P/R and LABOR_MOD_HIST relationship

Searched for text `proc_stat_ind|'P'|'R'` (`**/LCD-Oracle/SQL/**/*.SQL`), 200 results

Searched for files matching `**/LCD-Oracle/SQL/**/*.SQL`, 20 matches

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/LABINT.SQL#1-1), lines 1 to 100

Searched for regex `INSERT.*TIME_EXPORT|proc_stat_ind\s*=\s*'P'` (`**/LCD-Oracle/SQL/**/*.SQL`), 24 results

Searched for regex `LABOR_MOD_HIST.*TIME_EXPORT|TIME_EXPORT.*LABOR_MOD_HIST|lab_units` (`**/LCD-Oracle/SQL/**/*.SQL`), 50 results

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/LABINT.SQL#100-100), lines 100 to 300

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/PKGBRLBK.SQL#450-450), lines 450 to 550

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/10g_packages.sql#2750-2750), lines 2750 to 2820

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/TIMEXPR2.SQL#480-480), lines 480 to 550

Searched for regex `LABOR_MOD_HIST|bef_lab_units|aft_lab_units` (`**/LCD-Oracle/SQL/**/*.SQL`), 57 results

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/LABINT.SQL#600-600), lines 600 to 1000

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/LABINT.SQL#2630-2630), lines 2630 to 2950

Searched for regex `INSERT.*LABOR_DETAIL|UPDATE.*proc_stat_ind.*'P'` (`**/LCD-Oracle/SQL/**/*.SQL`), 7 results

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/ProcessEtesAdjustments.sql)

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/PKGBRLBK.SQL#460-460), lines 460 to 650

Searched for regex `proc_stat_ind\s*=\s*'P'.*TIME_EXPORT|TIME_EXPORT.*proc_stat_ind.*'P'` (`**/LCD-Oracle/SQL/**/*.SQL`), no results

Searched for regex `UPDATE.*TIME_EXPORT.*SET.*proc` (`**/LCD-Oracle/SQL/**/*.SQL`), no results

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/PKGBDIST.SQL)

Created memory file [](file:///c%3A/Users/rwright28/AppData/Roaming/Code/User/workspaceStorage/477bc488b09254803534383b72ad73dc/GitHub.copilot-chat/memory-tool/memories/MGE0ZDU2M2MtMDAxZC00MjUyLTg4NmQtMWUzNDlmZTVjNDBj/TIME_EXPORT_PRIOR_ADJUSTMENT_FLOW.md)

Find what inserts P/R records into TIME_EXPORT

Searched for text `proc_stat_ind` (`**/LCD-Oracle/SQL/**/*.sql`), 200 results

Searched for regex `INSERT INTO.*[Tt][Ii][Mm][Ee]_[Ee][Xx][Pp][Oo][Rr][Tt]` (`**/LCD-Oracle/SQL/**/*.sql`), 10 results

Searched for regex `TIME_EXPORT.*LABOR_MOD_HIST|LABOR_MOD_HIST.*TIME_EXPORT` (`**/LCD-Oracle/SQL/**/*.sql`), no results

Searched for text `load_prior|prior_adj|load_time_export` (`**/LCD-Oracle/SQL/**/*.sql`), no results

Searched for files matching `**/LCD-Oracle/SQL/**/*.sql`, 285 matches

Searched for regex `INSERT.*TIME_EXPORT.*'P'|'P'.*INSERT.*TIME_EXPORT` (`**/LCD-Oracle/SQL/**/*.sql`), no results

Searched for regex `INSERT.*TIME_EXPORT.*'R'|'R'.*INSERT.*TIME_EXPORT` (`**/LCD-Oracle/SQL/**/*.sql`), no results

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/TIMEXPR2.SQL#1-1), lines 1 to 100

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/LABINT.SQL#1-1), lines 1 to 100

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/TIMEXPR2.SQL#400-400), lines 400 to 550

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/10g_packages.sql#2750-2750), lines 2750 to 2800

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/TIMEPR2.SQL#550-550), lines 550 to 650

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/TIMEDB2.SQL#400-400), lines 400 to 450

Searched for text `export_gems` (`**/LCD-Oracle/SQL/**/*.sql`), 6 results

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/TIMEXPR2.SQL#200-200), lines 200 to 300

Searched for text `proc_stat_ind IN ('C','P','R')` (`**/LCD-Oracle/SQL/**/*.sql`), 3 results

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/TIMEXPR2.SQL#768-768), lines 768 to 1000

Searched for regex `UPDATE.*[Tt][Ii][Mm][Ee]_[Ee][Xx][Pp][Oo][Rr][Tt].*SET.*proc_stat_ind.*['\"]P['\"']|proc_stat_ind.*['\"]P['\"'].*UPDATE.*[Tt][Ii][Mm][Ee]_[Ee][Xx][Pp][Oo][Rr][Tt]` (`**/LCD-Oracle/SQL/**/*.sql`), no results

Searched for regex `UPDATE.*[Tt][Ii][Mm][Ee]_[Ee][Xx][Pp][Oo][Rr][Tt].*SET.*proc_stat_ind.*['\"]R['\"']|proc_stat_ind.*['\"]R['\"'].*UPDATE.*[Tt][Ii][Mm][Ee]_[Ee][Xx][Pp][Oo][Rr][Tt]` (`**/LCD-Oracle/SQL/**/*.sql`), no results

Searched for text `LABOR_MOD_HIST` (`**/LCD-Oracle/SQL/**/*.sql`), 29 results

Searched for regex `proc_stat_ind\s*=\s*['\"]P['\"]|proc_stat_ind\s*=\s*['\"]R['\"]` (`**/LCD-Oracle/SQL/**/*.sql`), 21 results

Searched for text `prior_adj|prior_time|load_prior|eTES|e-TES` (`**/LCD-Oracle/SQL/**/*.sql`), 79 results

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/ProcessEtesAdjustments.sql)

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/TIMEXPR2.SQL#1250-1250), lines 1250 to 1345

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/PKGBRLBK.SQL#600-600), lines 600 to 800

Searched for text `rollback|prior_adjust|prior` (`**/LCD-Oracle/SQL/**/*.sql`), 100 results

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/PKGBRLBK.SQL#450-450), lines 450 to 700

Searched for regex `INSERT INTO.*TIME_EXPORT.*SELECT.*BACKUP|SELECT.*FROM.*BACKUP.*INSERT INTO.*TIME_EXPORT` (`**/LCD-Oracle/SQL/**/*.sql`), no results

Searched for text `UPDATE.*TIME_EXPORT|proc_stat_ind = 'P'|proc_stat_ind = 'R'` (`**/LCD-Oracle/SQL/PKGBRLBK.SQL`), 3 results

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/PKGBRLBK.SQL#450-450), lines 450 to 650

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/PKGBRLBK.SQL#400-400), lines 400 to 550

Searched for regex `PROCEDURE|FUNCTION.*[Pp]rior|PROCEDURE|FUNCTION.*[Pp]ending|PROCEDURE|FUNCTION.*reject` (`**/LCD-Oracle/SQL/**/*.sql`), 100 results

Searched for text `VALUES.*'P'.*TIME_EXPORT|VALUES.*'R'.*TIME_EXPORT` (`**/LCD-Oracle/SQL/**/*.sql`), no results

Read memory

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/TIMEXPR2.SQL#350-350), lines 350 to 1200

Read memory [](file:///c%3A/Users/rwright28/AppData/Roaming/Code/User/workspaceStorage/477bc488b09254803534383b72ad73dc/GitHub.copilot-chat/memory-tool/memories/MGE0ZDU2M2MtMDAxZC00MjUyLTg4NmQtMWUzNDlmZTVjNDBj/LCD_Prior_Time_Adjustment_Investigation.md)

Read memory [](file:///c%3A/Users/rwright28/AppData/Roaming/Code/User/workspaceStorage/477bc488b09254803534383b72ad73dc/GitHub.copilot-chat/memory-tool/memories/MGE0ZDU2M2MtMDAxZC00MjUyLTg4NmQtMWUzNDlmZTVjNDBj/TIME_EXPORT_PRIOR_ADJUSTMENT_FLOW.md)

Updated memory file [](file:///c%3A/Users/rwright28/AppData/Roaming/Code/User/workspaceStorage/477bc488b09254803534383b72ad73dc/GitHub.copilot-chat/memory-tool/memories/MGE0ZDU2M2MtMDAxZC00MjUyLTg4NmQtMWUzNDlmZTVjNDBj/TIME_EXPORT_PRIOR_ADJUSTMENT_FLOW.md)

Created memory file [](file:///c%3A/Users/rwright28/AppData/Roaming/Code/User/workspaceStorage/477bc488b09254803534383b72ad73dc/GitHub.copilot-chat/memory-tool/memories/MGE0ZDU2M2MtMDAxZC00MjUyLTg4NmQtMWUzNDlmZTVjNDBj/TIME_EXPORT_proc_stat_ind_ALL_SOURCES.md)

Now let me check one more thing - how the LABOR_MOD_HIST adjustments relate to the time window for terminated employees: 

Searched for regex `proc_stat_ind.*'P'|'P'.*proc_stat_ind` (`**/LCD-Oracle/SQL/10g_packages.sql`), no results

Searched for text `StoreInTimeExport` (`**/LCD-Oracle/SQL/10g_packages.sql`), 6 results

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/10g_packages.sql#2700-2700), lines 2700 to 2820

Searched for regex `PROC_STAT_IND.*'P'|proc_stat_ind.*'P'` (`**/LCD-Oracle/SQL/*.sql`), 18 results

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/PKGBRLBK.SQL#620-620), lines 620 to 660

I have enough information now. Let me write the implementation plan. 

Updated todo list

Created [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/tasks/37-2/PTA_TERM_DELTA_EXPORT_PLAN.md)

Completed: *Write implementation plan markdown* (3/3)

Investigation complete. Here's the summary:

**Data source confirmed: `LCD.LABOR_MOD_HIST`** — this table stores complete before/after images of every timesheet adjustment with `BEF_LAB_UNITS` and `AFT_LAB_UNITS` columns. Delta = `AFT - BEF` (e.g., 9→6 = -3).

The implementation plan is saved at PTA_TERM_DELTA_EXPORT_PLAN.md. Key points:

- **New procedure:** `PTA_TERM_DELTA_EXPORT` — standalone, no schema changes needed
- **Output file:** `PTADELTA{YYMMDD}.{ORG}` — identical format to T-file (`p_write_gems` layout: WorkerID + SSN + Date + ActivityType + DeltaHours + Org)
- **Worker selection:** Same criteria as the INTER file (terminated on run date + latest status Active)
- **Adjustment source:** `LCD.LABOR_MOD_HIST` where `LMH_APRV_IND = 'A'` within a configurable lookback window (default 4 weeks)
- **Risk:** Low — read-only against existing tables, no modification of existing processes 



Made changes.

User: I created a new folder called "patched-delta" please excute the plan and create the new files here. After that please create a deployment plan, SQL Developer DBMS-Out style unit test script harness with  documentation for unit test plans, expected results and troubleshooting tips.

GitHub Copilot: Created 7 todos

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/tasks/37-2/patched-delta/TIMEXPR1.SQL#1-1), lines 1 to 50

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/tasks/37-2/patched-delta/TIMEXPR2.SQL#1-1), lines 1 to 50

Searched for text `is_pta_terminated` (`**/tasks/37-2/patched-delta/TIMEXPR1.SQL`), 1 result

Searched for text `is_pta_terminated` (`**/tasks/37-2/patched-delta/TIMEXPR2.SQL`), 6 results

Good — the patched-delta files already contain the `is_pta_terminated` patch. Now I need to read the TIMEXPR1.SQL end to see where to add the new procedure declaration, and understand the overall structure. 

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/tasks/37-2/patched-delta/TIMEXPR1.SQL#100-100), lines 100 to 161

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/tasks/37-2/patched-delta/TIMEXPR2.SQL#760-760), lines 760 to 850

Now let me check the end of TIMEXPR2.SQL to see the full package structure: 

Searched for text `END TimeExport;` (`**/tasks/37-2/patched-delta/TIMEXPR2.SQL`), 1 result

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/tasks/37-2/patched-delta/TIMEXPR2.SQL#1390-1390), lines 1390 to 1423

Starting: *Create PTA_TERM_DELTA_EXPORT.sql procedure* (2/7)

The plan calls for a standalone procedure (not inside the TimeExport package) since it's a separate job that runs alongside the termination job. Let me create it: 

Created [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/tasks/37-2/patched-delta/PTA_TERM_DELTA_EXPORT.sql)

Starting: *Create deployment plan* (5/7)

No changes needed to TIMEXPR1/TIMEXPR2 — the delta export is a standalone procedure. Now the deployment plan:  

Created [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/tasks/37-2/patched-delta/DEPLOYMENT_PLAN.sql)

Starting: *Create unit test script* (6/7)

Created [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/tasks/37-2/patched-delta/test_pta_delta_export.sql)

Starting: *Create unit test documentation* (7/7)

Created [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/tasks/37-2/patched-delta/UNIT_TEST_README.md)

Completed: *Create unit test documentation* (7/7)

All files created in the `patched-delta` folder. Here's what was delivered:

| File | Purpose |
|------|---------|
| PTA_TERM_DELTA_EXPORT.sql | New standalone procedure — queries `LCD.LABOR_MOD_HIST` for approved adjustments, computes `AFT_LAB_UNITS - BEF_LAB_UNITS`, writes T-file format output to `PTADELTA{YYMMDD}.{ORG}` |
| DEPLOYMENT_PLAN.sql | Step-by-step deployment with pre-checks, compile order, smoke test, file readback verification, and rollback instructions |
| test_pta_delta_export.sql | 7-section DBMS_OUTPUT unit test harness — terminated worker ID, raw adjustments, grouped deltas, format preview, edge cases, procedure execution, and cross-validation |
| UNIT_TEST_README.md | Full documentation: 28 test cases, expected results per section, pass criteria checklist, and 10 troubleshooting scenarios |

The existing TIMEXPR1.SQL and TIMEXPR2.SQL in the folder were **not modified** — the delta export is a standalone procedure that doesn't require package changes. 



Made changes.

User: I am curious if the number of weeks to look back defualts to 4, how does it handle if finds multiple PTA timesheets during that four-week period?

GitHub Copilot: The cursor in `PTA_TERM_DELTA_EXPORT` uses `GROUP BY` + `SUM()` to aggregate across all matching `LABOR_MOD_HIST` rows:

```sql
GROUP BY lmh.lmh_worker_id, tw.worker_ssn, lmh.actual_date,
         NVL(RTRIM(lmh.aft_att_type), RTRIM(lmh.bef_att_type))
HAVING SUM(NVL(lmh.aft_lab_units, 0) - NVL(lmh.bef_lab_units, 0)) <> 0
```

So it produces **one output line per unique (worker_id, actual_date, activity_type)** regardless of how many PTA timesheets generated adjustment rows. Multiple adjustments for the same combination are summed:

| Scenario | LABOR_MOD_HIST Rows | Output |
|----------|-------------------|--------|
| Two PTAs change code 1010 on same day: 8→6, then 6→4 | 2 rows | **1 line**: delta = (-2) + (-2) = **-4.00** |
| PTAs on different days (Mon + Wed) same code | 2 rows with different `actual_date` | **2 lines**: one per day |
| PTAs for different activity codes on same day | 2 rows with different `aft_att_type` | **2 lines**: one per code |
| Three PTAs that cancel out: 8→6, 6→10, 10→8 | 3 rows | **0 lines**: SUM = 0, filtered by `HAVING` |

The net effect is that if someone makes multiple corrections to the same day/activity, downstream payroll sees only the **cumulative net change** — not each intermediate adjustment.


***


User: Please create a new subfolder for unit testing. Create a SQL debug-style script that I can run in SQL developer with DBMS Out enabled to test the output of the termination file..

GitHub Copilot: Read patched files for context

Searched for text `is_pta_terminated` (`**/tasks/37-2/patched/TIMEXPR2.SQL`), 6 results

Searched for files matching `**/tasks/37-2/emp termination 4.sql`, 1 match

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/tasks/37-2/patched/TIMEXPR2.SQL#768-768), lines 768 to 838

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/tasks/37-2/emp%20termination%204.sql)

Read [](file:///c%3A/Users/rwright28/AppData/Roaming/Code/User/workspaceStorage/477bc488b09254803534383b72ad73dc/GitHub.copilot-chat/chat-session-resources/0a4d563c-001d-4252-886d-1e349fe5c40c/toolu_bdrk_01AgiGRS91g2ifCnsqrJ7CEE__vscode-1779412397630/content.txt#1-1), lines 1 to 200

Read [](file:///c%3A/Users/rwright28/AppData/Roaming/Code/User/workspaceStorage/477bc488b09254803534383b72ad73dc/GitHub.copilot-chat/chat-session-resources/0a4d563c-001d-4252-886d-1e349fe5c40c/toolu_bdrk_01AgiGRS91g2ifCnsqrJ7CEE__vscode-1779412397630/content.txt#200-200), lines 200 to 321

Now I have enough context. Let me look at what `week_end` variable is available in `export_gems` to ensure the test script uses the same date logic. 

Searched for text `week_end` (`**/tasks/37-2/patched/TIMEXPR2.SQL`), 20 results

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/tasks/37-2/patched/TIMEXPR2.SQL#900-900), lines 900 to 1000

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/tasks/37-2/patched/TIMEXPR2.SQL#1000-1000), lines 1000 to 1100

I have enough context now. Let me draft the plan. 

Created memory file [](file:///c%3A/Users/rwright28/AppData/Roaming/Code/User/workspaceStorage/477bc488b09254803534383b72ad73dc/GitHub.copilot-chat/memory-tool/memories/MGE0ZDU2M2MtMDAxZC00MjUyLTg4NmQtMWUzNDlmZTVjNDBj/plan.md)

## Plan: PTA Termination Unit Test Script

Create a `unit_tests/` subfolder under 37-2 with a single DBMS_OUTPUT debug script that validates the termination file output and `is_pta_terminated` function behavior against live data.

**Steps**

1. Create directory `tasks/37-2/unit_tests/`
2. Create `tasks/37-2/unit_tests/test_pta_termination_output.sql` — self-contained, runnable in SQL Developer with `SET SERVEROUTPUT ON`

The script will have these sections:

| Section | Purpose |
|---------|---------|
| **1 — Termination Job Preview** | Replicate the core SELECT from `emp termination 4.sql` (current_base + prior_base CTEs) to show which workers/rows the INTER file would contain for the given org/date |
| **2 — is_pta_terminated Validation** | Loop through workers in `lcd.time_export` with `proc_stat_ind IN ('C','P','R')` for the resolved week-end, call `lcd.timeexport.is_pta_terminated()` for each, and print TRUE/FALSE alongside `termination_date` and latest `employment_status` |
| **3 — Duplicate Detection** | Identify workers appearing in BOTH the regular T-file cursor AND the INTER termination file (the duplicate scenario this patch fixes) |
| **4 — Boundary/Edge Cases** | Show workers with `termination_date` in the week window but latest status ≠ `'3'` — these should NOT be excluded from the regular export |

**Key design details:**
- Uses SQL Developer substitution variables (`&v_org`, `&v_run_date`) for interactive input
- Week-end resolved via `NEXT_DAY(TO_DATE(&v_run_date,'YYYYMMDD') - 1, 'FRIDAY')` — matches the termination job
- Read-only: no DDL, no DML — safe to run in any environment
- Calls `lcd.timeexport.is_pta_terminated` directly (wraps BOOLEAN in IF/THEN for DBMS_OUTPUT since PL/SQL BOOLEAN isn't SQL-selectable)

**Relevant files:**
- emp termination 4.sql — termination job query logic to replicate
- TIMEXPR2.SQL — `is_pta_terminated` function (checks `empl_active = '3'`)
- PTA_TERM_EXCLUSION_PATCH_PLAN.md — test scenarios (section 10)

**Verification:**
1. Script runs in SQL Developer without compile errors
2. DBMS_OUTPUT produces labeled columnar output for each section
3. Correctly uses `NEXT_DAY` date logic matching the termination job
4. Directly validates the packaged `is_pta_terminated` function

**Decisions:**
- Single script file (not multiple) — keeps it simple to hand to a DBA
- No test data setup — queries live data, making it useful for pre/post-deploy validation
- BOOLEAN handling: anonymous PL/SQL block with cursor loop + IF for display

User: Start implementation

GitHub Copilot: Created [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/tasks/37-2/unit_tests/test_pta_termination_output.sql)

Created test_pta_termination_output.sql.

The script is ready to run in SQL Developer with DBMS Output enabled. It will prompt for an org code and run date, then produce four labeled sections:

1. **Termination Job Preview** — shows which workers the INTER file would contain
2. **is_pta_terminated Validation** — calls the patched function for each terminated worker with pending export records and prints TRUE/FALSE with explanation
3. **Duplicate Detection** — identifies workers appearing in both the T-file cursor and the termination job criteria
4. **Boundary/Edge Cases** — flags workers with term date in the week window but latest status ≠ `'3'`, verifying they are correctly kept in the regular export

Purely read-only — no DDL or DML.

Made changes.

User: Please create a UNIT_TEST_README.md file with usage instructions and a unit test plan, expected results, and troubleshooting all possible logic errors.

GitHub Copilot: Created [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/tasks/37-2/unit_tests/UNIT_TEST_README.md)

Created UNIT_TEST_README.md with:

- **Usage instructions** — prerequisites, step-by-step SQL Developer execution, and recommended test parameter combinations
- **Unit test plan** — 11-case test matrix mapping inputs to expected `is_pta_terminated` results, plus per-section expected output tables
- **Pass criteria** — clear summary conditions for a successful validation
- **Troubleshooting** — 9 categorized error scenarios covering compilation failures, incorrect TRUE/FALSE results, duplicate detection mismatches, NLS issues, no-output problems, and performance concerns, each with diagnosis steps and resolutions
- **Quick validation checklist** for rapid pass/fail assessment 



Made changes.

User: The client wants a way to see all the timesheet delta hours (from the latest prior time adjustment timesheet) for all the employees that are captured in the INTER{YYMMDD}.{ORG} file. So the output format of the the INTER{YYMMDD}.{ORG} file should be similar to the original T-file `T{YYMMDD}.{ORG}`.
So for example, if an employee make a prior time adjustmnt change activity code 1010 for a WBS code from 9 hours to 6 hours then the output should be -3.

Please perform an investigation of the LCD SQL codebase at @LCD-Oracle/ to see if there is a table I can reference (LABOR_DETAIL, LCD.LABOR_MOD_HIST ?) to fetch the desired output. 

If there is a possibility to fetch the desired data from the LCD database scheme, please write a detailed implementation plan to create new patched stored procedures that contain the desired output. Save as a markdown file.

GitHub Copilot: Created 3 todos

Investigate LCD Oracle tables for time adjustments

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL)

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/Packages)

Searched for regex `LABOR_DETAIL|LABOR_MOD_HIST` (`**/LCD-Oracle/SQL/**/*.sql`), 50 results

Searched for regex `prior time adjustment|time adjustment|mod_hist|labor_mod` (`**/LCD-Oracle/SQL/**/*.sql`), 30 results

Searched for regex `TIME_EXPORT|proc_stat_ind|p_write_gems` (`**/LCD-Oracle/SQL/**/*.sql`), 50 results

Searched for regex `CREATE TABLE.*TIME|CREATE TABLE.*LABOR` (`**/LCD-Oracle/SQL/**/*.sql`), 1 result

Searched for regex `p_write_gems|write.*gems|p_write|T-file|GEMS|cur_gems|proc_cur` (`**/LCD-Oracle/SQL/**/*.sql`), 20 results

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/TIMEXPR2.SQL#1-1), lines 1 to 100

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/LABINT.SQL#2640-2640), lines 2640 to 2750

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/LABINT.SQL#2650-2650), lines 2650 to 2800

Searched for regex `CREATE TABLE.*LABOR_MOD_HIST|CREATE TABLE.*LABOR_DETAIL|CREATE TABLE.*TIME_EXPORT` (`**/LCD-Oracle/SQL/**/*.sql`), no results

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/ProcessEtesAdjustments.sql#1-1), lines 1 to 200

Searched for regex `delta hours|delta_hours|hour difference|bef_lab_units|aft_lab_units|lab_units.*-|delta` (`**/LCD-Oracle/SQL/**/*.sql`), 20 results

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/10g_packages.sql#500-500), lines 500 to 2600

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/SendEtesMessages.sql#95-95), lines 95 to 150

Searched for regex `bef_wo_num|aft_wo_num|bef_lab_units|aft_lab_units|lmh_aprv_ind|mod_aprvl_date` (`**/LCD-Oracle/SQL/**/*.sql`), 30 results

Searched for regex `TIMEXPR|TIME_EXPORT|proc_stat_ind.*'P'|proc_stat_ind.*'R'|record type|proc.*status` (`**/LCD-Oracle/SQL/**/*.sql`), 20 results

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/TIMEXPR2.SQL#100-100), lines 100 to 200

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/TIMEXPR2.SQL#1345-1345), lines 1345 to 1345

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/BACK_PAY.SQL)

Searched for regex `proc_stat_ind.*=.*'[A-Z]'|proc_stat_ind IN|PROC_STAT_IND LIKE` (`**/LCD-Oracle/SQL/**/*.sql`), 20 results

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/TIMEXPR2.SQL#350-350), lines 350 to 1345

Created memory file [](file:///c%3A/Users/rwright28/AppData/Roaming/Code/User/workspaceStorage/477bc488b09254803534383b72ad73dc/GitHub.copilot-chat/memory-tool/memories/MGE0ZDU2M2MtMDAxZC00MjUyLTg4NmQtMWUzNDlmZTVjNDBj/LCD_Prior_Time_Adjustment_Investigation.md)

Starting: *Analyze T-file output format* (2/3)

Deep dive into LABOR_MOD_HIST and p_write_gems

Searched for files matching `**/LCD-Oracle/SQL/*.SQL`, 50 matches

Searched for files matching `**/tasks/37-2/patched/*.SQL`, 2 matches

Searched for regex `^` (`**/LCD-Oracle/SQL/LABINT.SQL`), 1 result

Searched for regex `^` (`**/LCD-Oracle/SQL/ProcessEtesAdjustments.sql`), 1 result

Searched for files matching `**/LABINT.SQL`, 3 matches

Searched for regex `p_write_gems|PROCEDURE p_write_gems` (`**/LCD-Oracle/SQL/TIMEXPR2.SQL`), 5 results

Searched for regex `LABOR_MOD_HIST|p_get_adj` (`**/LCD-Oracle/SQL/LABINT.SQL`), 6 results

Searched for regex `CREATE TABLE.*LABOR_MOD_HIST` (`**/LCD-Oracle/SQL`), no results

Searched for regex `export_gems|proc_cur|cur_gems` (`**/tasks/37-2/patched/TIMEXPR2.SQL`), 20 results

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/TIMEXPR2.SQL#350-350), lines 350 to 420

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/LABINT.SQL#2640-2640), lines 2640 to 2800

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/ProcessEtesAdjustments.sql)

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/tasks/37-2/patched/TIMEXPR2.SQL#140-140), lines 140 to 210

Searched for regex `procedure p_get_adj|PROCEDURE p_get_adj` (`**/LCD-Oracle/SQL/LABINT.SQL`), no results

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/tasks/37-2/patched/TIMEXPR2.SQL#840-840), lines 840 to 1050

Searched for regex `p_get|get_adj|procedure|function` (`**/LCD-Oracle/SQL/LABINT.SQL`), 20 results

Searched for regex `PROCEDURE p_create_labor_file` (`**/LCD-Oracle/SQL/LABINT.SQL`), 4 results

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/LABINT.SQL#2500-2500), lines 2500 to 2900

Searched for regex `CREATE TABLE.*LABOR_MOD_HIST|comment.*LABOR_MOD_HIST` (`**/LCD-Oracle/SQL`), no results

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/LABINT.SQL#2900-2900), lines 2900 to 3100

Searched for text `LABOR_MOD_HIST` (`**/LCD-Oracle/SQL`), no results

Searched for files matching `**/*.md`, 20 matches

Searched for text `CREATE TABLE LABOR_MOD_HIST`, no results

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/tasks/37-2/patched/TIMEXPR2.SQL#1-1), lines 1 to 900

Searched for regex `RECORD_TYPE_FOR_GEMS|TYPE.*record_type_for_gems` (`**/tasks/37-2/patched/TIMEXPR2.SQL`), 3 results

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/tasks/37-2/patched/TIMEXPR2.SQL#1-1), lines 1 to 60

Searched for regex `RECORD_TYPE_FOR_GEMS|wrk_id|wrk_ssn|time_type|act_date|hrs` (`**/tasks/37-2/patched/TIMEXPR1.SQL`), 19 results

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/tasks/37-2/patched/TIMEXPR1.SQL#1-1), lines 1 to 100

Read [](file:///c%3A/Users/rwright28/AppData/Roaming/Code/User/workspaceStorage/477bc488b09254803534383b72ad73dc/GitHub.copilot-chat/chat-session-resources/0a4d563c-001d-4252-886d-1e349fe5c40c/toolu_bdrk_01AMEQU9nWunigSGsCW2VVWk__vscode-1779412397670/content.txt#1-1), lines 1 to 300

Read [](file:///c%3A/Users/rwright28/AppData/Roaming/Code/User/workspaceStorage/477bc488b09254803534383b72ad73dc/GitHub.copilot-chat/chat-session-resources/0a4d563c-001d-4252-886d-1e349fe5c40c/toolu_bdrk_01AMEQU9nWunigSGsCW2VVWk__vscode-1779412397670/content.txt#300-300), lines 300 to 489

Starting: *Write implementation plan markdown* (3/3)

Now let me look at how the termination job currently resolves its data to understand if `LABOR_MOD_HIST` records are accessible for those same terminated workers: 

Check TIME_EXPORT proc_stat_ind P/R and LABOR_MOD_HIST relationship

Searched for text `proc_stat_ind|'P'|'R'` (`**/LCD-Oracle/SQL/**/*.SQL`), 200 results

Searched for files matching `**/LCD-Oracle/SQL/**/*.SQL`, 20 matches

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/LABINT.SQL#1-1), lines 1 to 100

Searched for regex `INSERT.*TIME_EXPORT|proc_stat_ind\s*=\s*'P'` (`**/LCD-Oracle/SQL/**/*.SQL`), 24 results

Searched for regex `LABOR_MOD_HIST.*TIME_EXPORT|TIME_EXPORT.*LABOR_MOD_HIST|lab_units` (`**/LCD-Oracle/SQL/**/*.SQL`), 50 results

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/LABINT.SQL#100-100), lines 100 to 300

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/PKGBRLBK.SQL#450-450), lines 450 to 550

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/10g_packages.sql#2750-2750), lines 2750 to 2820

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/TIMEXPR2.SQL#480-480), lines 480 to 550

Searched for regex `LABOR_MOD_HIST|bef_lab_units|aft_lab_units` (`**/LCD-Oracle/SQL/**/*.SQL`), 57 results

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/LABINT.SQL#600-600), lines 600 to 1000

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/LABINT.SQL#2630-2630), lines 2630 to 2950

Searched for regex `INSERT.*LABOR_DETAIL|UPDATE.*proc_stat_ind.*'P'` (`**/LCD-Oracle/SQL/**/*.SQL`), 7 results

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/ProcessEtesAdjustments.sql)

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/PKGBRLBK.SQL#460-460), lines 460 to 650

Searched for regex `proc_stat_ind\s*=\s*'P'.*TIME_EXPORT|TIME_EXPORT.*proc_stat_ind.*'P'` (`**/LCD-Oracle/SQL/**/*.SQL`), no results

Searched for regex `UPDATE.*TIME_EXPORT.*SET.*proc` (`**/LCD-Oracle/SQL/**/*.SQL`), no results

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/PKGBDIST.SQL)

Created memory file [](file:///c%3A/Users/rwright28/AppData/Roaming/Code/User/workspaceStorage/477bc488b09254803534383b72ad73dc/GitHub.copilot-chat/memory-tool/memories/MGE0ZDU2M2MtMDAxZC00MjUyLTg4NmQtMWUzNDlmZTVjNDBj/TIME_EXPORT_PRIOR_ADJUSTMENT_FLOW.md)

Find what inserts P/R records into TIME_EXPORT

Searched for text `proc_stat_ind` (`**/LCD-Oracle/SQL/**/*.sql`), 200 results

Searched for regex `INSERT INTO.*[Tt][Ii][Mm][Ee]_[Ee][Xx][Pp][Oo][Rr][Tt]` (`**/LCD-Oracle/SQL/**/*.sql`), 10 results

Searched for regex `TIME_EXPORT.*LABOR_MOD_HIST|LABOR_MOD_HIST.*TIME_EXPORT` (`**/LCD-Oracle/SQL/**/*.sql`), no results

Searched for text `load_prior|prior_adj|load_time_export` (`**/LCD-Oracle/SQL/**/*.sql`), no results

Searched for files matching `**/LCD-Oracle/SQL/**/*.sql`, 285 matches

Searched for regex `INSERT.*TIME_EXPORT.*'P'|'P'.*INSERT.*TIME_EXPORT` (`**/LCD-Oracle/SQL/**/*.sql`), no results

Searched for regex `INSERT.*TIME_EXPORT.*'R'|'R'.*INSERT.*TIME_EXPORT` (`**/LCD-Oracle/SQL/**/*.sql`), no results

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/TIMEXPR2.SQL#1-1), lines 1 to 100

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/LABINT.SQL#1-1), lines 1 to 100

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/TIMEXPR2.SQL#400-400), lines 400 to 550

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/10g_packages.sql#2750-2750), lines 2750 to 2800

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/TIMEPR2.SQL#550-550), lines 550 to 650

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/TIMEDB2.SQL#400-400), lines 400 to 450

Searched for text `export_gems` (`**/LCD-Oracle/SQL/**/*.sql`), 6 results

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/TIMEXPR2.SQL#200-200), lines 200 to 300

Searched for text `proc_stat_ind IN ('C','P','R')` (`**/LCD-Oracle/SQL/**/*.sql`), 3 results

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/TIMEXPR2.SQL#768-768), lines 768 to 1000

Searched for regex `UPDATE.*[Tt][Ii][Mm][Ee]_[Ee][Xx][Pp][Oo][Rr][Tt].*SET.*proc_stat_ind.*['\"]P['\"']|proc_stat_ind.*['\"]P['\"'].*UPDATE.*[Tt][Ii][Mm][Ee]_[Ee][Xx][Pp][Oo][Rr][Tt]` (`**/LCD-Oracle/SQL/**/*.sql`), no results

Searched for regex `UPDATE.*[Tt][Ii][Mm][Ee]_[Ee][Xx][Pp][Oo][Rr][Tt].*SET.*proc_stat_ind.*['\"]R['\"']|proc_stat_ind.*['\"]R['\"'].*UPDATE.*[Tt][Ii][Mm][Ee]_[Ee][Xx][Pp][Oo][Rr][Tt]` (`**/LCD-Oracle/SQL/**/*.sql`), no results

Searched for text `LABOR_MOD_HIST` (`**/LCD-Oracle/SQL/**/*.sql`), 29 results

Searched for regex `proc_stat_ind\s*=\s*['\"]P['\"]|proc_stat_ind\s*=\s*['\"]R['\"]` (`**/LCD-Oracle/SQL/**/*.sql`), 21 results

Searched for text `prior_adj|prior_time|load_prior|eTES|e-TES` (`**/LCD-Oracle/SQL/**/*.sql`), 79 results

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/ProcessEtesAdjustments.sql)

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/TIMEXPR2.SQL#1250-1250), lines 1250 to 1345

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/PKGBRLBK.SQL#600-600), lines 600 to 800

Searched for text `rollback|prior_adjust|prior` (`**/LCD-Oracle/SQL/**/*.sql`), 100 results

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/PKGBRLBK.SQL#450-450), lines 450 to 700

Searched for regex `INSERT INTO.*TIME_EXPORT.*SELECT.*BACKUP|SELECT.*FROM.*BACKUP.*INSERT INTO.*TIME_EXPORT` (`**/LCD-Oracle/SQL/**/*.sql`), no results

Searched for text `UPDATE.*TIME_EXPORT|proc_stat_ind = 'P'|proc_stat_ind = 'R'` (`**/LCD-Oracle/SQL/PKGBRLBK.SQL`), 3 results

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/PKGBRLBK.SQL#450-450), lines 450 to 650

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/PKGBRLBK.SQL#400-400), lines 400 to 550

Searched for regex `PROCEDURE|FUNCTION.*[Pp]rior|PROCEDURE|FUNCTION.*[Pp]ending|PROCEDURE|FUNCTION.*reject` (`**/LCD-Oracle/SQL/**/*.sql`), 100 results

Searched for text `VALUES.*'P'.*TIME_EXPORT|VALUES.*'R'.*TIME_EXPORT` (`**/LCD-Oracle/SQL/**/*.sql`), no results

Read memory

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/TIMEXPR2.SQL#350-350), lines 350 to 1200

Read memory [](file:///c%3A/Users/rwright28/AppData/Roaming/Code/User/workspaceStorage/477bc488b09254803534383b72ad73dc/GitHub.copilot-chat/memory-tool/memories/MGE0ZDU2M2MtMDAxZC00MjUyLTg4NmQtMWUzNDlmZTVjNDBj/LCD_Prior_Time_Adjustment_Investigation.md)

Read memory [](file:///c%3A/Users/rwright28/AppData/Roaming/Code/User/workspaceStorage/477bc488b09254803534383b72ad73dc/GitHub.copilot-chat/memory-tool/memories/MGE0ZDU2M2MtMDAxZC00MjUyLTg4NmQtMWUzNDlmZTVjNDBj/TIME_EXPORT_PRIOR_ADJUSTMENT_FLOW.md)

Updated memory file [](file:///c%3A/Users/rwright28/AppData/Roaming/Code/User/workspaceStorage/477bc488b09254803534383b72ad73dc/GitHub.copilot-chat/memory-tool/memories/MGE0ZDU2M2MtMDAxZC00MjUyLTg4NmQtMWUzNDlmZTVjNDBj/TIME_EXPORT_PRIOR_ADJUSTMENT_FLOW.md)

Created memory file [](file:///c%3A/Users/rwright28/AppData/Roaming/Code/User/workspaceStorage/477bc488b09254803534383b72ad73dc/GitHub.copilot-chat/memory-tool/memories/MGE0ZDU2M2MtMDAxZC00MjUyLTg4NmQtMWUzNDlmZTVjNDBj/TIME_EXPORT_proc_stat_ind_ALL_SOURCES.md)

Now let me check one more thing - how the LABOR_MOD_HIST adjustments relate to the time window for terminated employees: 

Searched for regex `proc_stat_ind.*'P'|'P'.*proc_stat_ind` (`**/LCD-Oracle/SQL/10g_packages.sql`), no results

Searched for text `StoreInTimeExport` (`**/LCD-Oracle/SQL/10g_packages.sql`), 6 results

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/10g_packages.sql#2700-2700), lines 2700 to 2820

Searched for regex `PROC_STAT_IND.*'P'|proc_stat_ind.*'P'` (`**/LCD-Oracle/SQL/*.sql`), 18 results

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/PKGBRLBK.SQL#620-620), lines 620 to 660

I have enough information now. Let me write the implementation plan. 

Updated todo list

Created [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/tasks/37-2/PTA_TERM_DELTA_EXPORT_PLAN.md)

Completed: *Write implementation plan markdown* (3/3)

Investigation complete. Here's the summary:

**Data source confirmed: `LCD.LABOR_MOD_HIST`** — this table stores complete before/after images of every timesheet adjustment with `BEF_LAB_UNITS` and `AFT_LAB_UNITS` columns. Delta = `AFT - BEF` (e.g., 9→6 = -3).

The implementation plan is saved at PTA_TERM_DELTA_EXPORT_PLAN.md. Key points:

- **New procedure:** `PTA_TERM_DELTA_EXPORT` — standalone, no schema changes needed
- **Output file:** `PTADELTA{YYMMDD}.{ORG}` — identical format to T-file (`p_write_gems` layout: WorkerID + SSN + Date + ActivityType + DeltaHours + Org)
- **Worker selection:** Same criteria as the INTER file (terminated on run date + latest status Active)
- **Adjustment source:** `LCD.LABOR_MOD_HIST` where `LMH_APRV_IND = 'A'` within a configurable lookback window (default 4 weeks)
- **Risk:** Low — read-only against existing tables, no modification of existing processes 



Made changes.

User: I created a new folder called "patched-delta" please excute the plan and create the new files here. After that please create a deployment plan, SQL Developer DBMS-Out style unit test script harness with  documentation for unit test plans, expected results and troubleshooting tips.

GitHub Copilot: Created 7 todos

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/tasks/37-2/patched-delta/TIMEXPR1.SQL#1-1), lines 1 to 50

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/tasks/37-2/patched-delta/TIMEXPR2.SQL#1-1), lines 1 to 50

Searched for text `is_pta_terminated` (`**/tasks/37-2/patched-delta/TIMEXPR1.SQL`), 1 result

Searched for text `is_pta_terminated` (`**/tasks/37-2/patched-delta/TIMEXPR2.SQL`), 6 results

Good — the patched-delta files already contain the `is_pta_terminated` patch. Now I need to read the TIMEXPR1.SQL end to see where to add the new procedure declaration, and understand the overall structure. 

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/tasks/37-2/patched-delta/TIMEXPR1.SQL#100-100), lines 100 to 161

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/tasks/37-2/patched-delta/TIMEXPR2.SQL#760-760), lines 760 to 850

Now let me check the end of TIMEXPR2.SQL to see the full package structure: 

Searched for text `END TimeExport;` (`**/tasks/37-2/patched-delta/TIMEXPR2.SQL`), 1 result

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/tasks/37-2/patched-delta/TIMEXPR2.SQL#1390-1390), lines 1390 to 1423

Starting: *Create PTA_TERM_DELTA_EXPORT.sql procedure* (2/7)

The plan calls for a standalone procedure (not inside the TimeExport package) since it's a separate job that runs alongside the termination job. Let me create it: 

Created [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/tasks/37-2/patched-delta/PTA_TERM_DELTA_EXPORT.sql)

Starting: *Create deployment plan* (5/7)

No changes needed to TIMEXPR1/TIMEXPR2 — the delta export is a standalone procedure. Now the deployment plan:  

Created [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/tasks/37-2/patched-delta/DEPLOYMENT_PLAN.sql)

Starting: *Create unit test script* (6/7)

Created [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/tasks/37-2/patched-delta/test_pta_delta_export.sql)

Starting: *Create unit test documentation* (7/7)

Created [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/tasks/37-2/patched-delta/UNIT_TEST_README.md)

Completed: *Create unit test documentation* (7/7)

All files created in the `patched-delta` folder. Here's what was delivered:

| File | Purpose |
|------|---------|
| PTA_TERM_DELTA_EXPORT.sql | New standalone procedure — queries `LCD.LABOR_MOD_HIST` for approved adjustments, computes `AFT_LAB_UNITS - BEF_LAB_UNITS`, writes T-file format output to `PTADELTA{YYMMDD}.{ORG}` |
| DEPLOYMENT_PLAN.sql | Step-by-step deployment with pre-checks, compile order, smoke test, file readback verification, and rollback instructions |
| test_pta_delta_export.sql | 7-section DBMS_OUTPUT unit test harness — terminated worker ID, raw adjustments, grouped deltas, format preview, edge cases, procedure execution, and cross-validation |
| UNIT_TEST_README.md | Full documentation: 28 test cases, expected results per section, pass criteria checklist, and 10 troubleshooting scenarios |

The existing TIMEXPR1.SQL and TIMEXPR2.SQL in the folder were **not modified** — the delta export is a standalone procedure that doesn't require package changes. 



Made changes.

User: I am curious if the number of weeks to look back defualts to 4, how does it handle if finds multiple PTA timesheets during that four-week period?

GitHub Copilot: The cursor in `PTA_TERM_DELTA_EXPORT` uses `GROUP BY` + `SUM()` to aggregate across all matching `LABOR_MOD_HIST` rows:

```sql
GROUP BY lmh.lmh_worker_id, tw.worker_ssn, lmh.actual_date,
         NVL(RTRIM(lmh.aft_att_type), RTRIM(lmh.bef_att_type))
HAVING SUM(NVL(lmh.aft_lab_units, 0) - NVL(lmh.bef_lab_units, 0)) <> 0
```

So it produces **one output line per unique (worker_id, actual_date, activity_type)** regardless of how many PTA timesheets generated adjustment rows. Multiple adjustments for the same combination are summed:

| Scenario | LABOR_MOD_HIST Rows | Output |
|----------|-------------------|--------|
| Two PTAs change code 1010 on same day: 8→6, then 6→4 | 2 rows | **1 line**: delta = (-2) + (-2) = **-4.00** |
| PTAs on different days (Mon + Wed) same code | 2 rows with different `actual_date` | **2 lines**: one per day |
| PTAs for different activity codes on same day | 2 rows with different `aft_att_type` | **2 lines**: one per code |
| Three PTAs that cancel out: 8→6, 6→10, 10→8 | 3 rows | **0 lines**: SUM = 0, filtered by `HAVING` |

The net effect is that if someone makes multiple corrections to the same day/activity, downstream payroll sees only the **cumulative net change** — not each intermediate adjustment.

User: Can you piece together the table schema of LABOR_MOD_HIST by looking at the docs?

GitHub Copilot: Searched for text `LABOR_MOD_HIST` (`**/LCD-Oracle/docs/**`), 30 results

Searched for files matching `**/LABOR_MOD_HIST*`, no matches

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/docs/sql-documentation/MAINTENANCE_UTILITIES.md#640-640), lines 640 to 700

Searched for regex `labor_mod_hist\.(lmh_|bef_|aft_|org_|actual|trans|mod_|create|update|control|work_site|reason|error|approved)` (`**/LCD-Oracle/docs/sql-documentation/**`), 5 results

Searched for text `LABOR_MOD_HIST` (`**/LCD-Oracle/docs/sql-documentation/CP100_LABORATORY.md`), 1 result

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/docs/sql-documentation/CP100_LABORATORY.md#700-700), lines 700 to 730

Searched for text `PGet_COMMSREFSATTR` (`**/LCD-Oracle/docs/sql-documentation/CP100_LABORATORY.md`), 13 results

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/docs/sql-documentation/CP100_LABORATORY.md#630-630), lines 630 to 665

Searched for regex `labor_mod_hist|LMH_SEQ|LBDTL_REC|LMH_MOD_TYPE|LMH_REASON|BEF_LAB|AFT_LAB|ACTUAL_DATE|TRANS_DATE` (`**/LCD-Oracle/docs/sql-documentation/packages/PKG_BATCH_CORRECTIONS.md`), 16 results

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/docs/sql-documentation/packages/PKG_BATCH_CORRECTIONS.md#670-670), lines 670 to 720

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/docs/sql-documentation/packages/PKG_BATCH_CORRECTIONS.md#720-720), lines 720 to 776

Now let me look at the `ProcessEtesAdjustments.sql` for the INSERT column list — this gives the complete schema: 

Searched for text `l_lmh_rec LCD.LABOR_MOD_HIST%ROWTYPE` (`**/LCD-Oracle/SQL/LABINT.SQL`), no results

Searched for text `LABOR_MOD_HIST%ROWTYPE` (`**/LCD-Oracle/SQL/LABINT.SQL`), 2 results

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/LABINT.SQL#2649-2649), lines 2649 to 2755

Now let me look at the `ProcessEtesAdjustments.sql` INSERT for the definitive column list:  

Read [](file:///c%3A/Users/rwright28/Documents/eteslcd/tickets/WeekOf_20260306/lcd_playground/LCD-Oracle/SQL/ProcessEtesAdjustments.sql#40-40), lines 40 to 80

I have the complete column list from the cursor/INSERT in ProcessEtesAdjustments.sql. Combined with the `%TYPE` references and usage patterns from docs, here's the reconstructed schema:

---

## `LCD.LABOR_MOD_HIST` — Reconstructed Table Schema

Based on the `cur_lmh` SELECT in ProcessEtesAdjustments.sql, the INSERT column list, `%ROWTYPE` usage in LABINT.SQL, and documentation in PKG_BATCH_CORRECTIONS.md:

| # | Column | Inferred Type | Category | Description |
|---|--------|---------------|----------|-------------|
| 1 | `LMH_SEQ_NUM` | NUMBER | PK | Sequence number (unique row identifier) |
| 2 | `LBDTL_REC_NUM` | NUMBER | FK | Foreign key to `LCD.LABOR_DETAIL` record |
| 3 | `ORG_CODE` | VARCHAR2(3) | Key | Organization code |
| 4 | `LMH_MOD_TYPE` | VARCHAR2 | Meta | Modification type code |
| 5 | `LMH_REASON_CODE` | VARCHAR2 | Meta | Reason code for the modification |
| 6 | `LMH_APRV_IND` | CHAR(1) | Status | Approval indicator: `'P'`=Pending, `'Q'`=Ready for approval, `'A'`=Approved, `'R'`=Rejected |
| 7 | `MOD_APRVL_DATE` | DATE | Status | Date the adjustment was approved (NULL while pending) |
| 8 | `ACTUAL_DATE` | DATE | Key | Date the work was actually performed |
| 9 | `TRANS_DATE` | DATE | Meta | Transaction/submission date |
| 10 | `BEF_LAB_AMT` | NUMBER | Before | Dollar amount before adjustment |
| 11 | `AFT_LAB_AMT` | NUMBER | After | Dollar amount after adjustment (often = BEF per code comment) |
| 12 | `CREATE_DATE` | DATE | Audit | Record creation timestamp |
| 13 | `UPDATE_DATE` | DATE | Audit | Record last update timestamp |
| 14 | `BEF_LAB_UNITS` | NUMBER | **Before** | **Hours before adjustment** |
| 15 | `AFT_LAB_UNITS` | NUMBER | **After** | **Hours after adjustment** |
| 16 | `CREATED_BY_NAME` | VARCHAR2(12) | Audit | Source system: `'ITES'` (eTES) or `'LABOR'` (LCD) |
| 17 | `UPDATED_BY_NAME` | VARCHAR2 | Audit | Last updater |
| 18 | `CONTROL_ID` | VARCHAR2 | Meta | eTES control identifier |
| 19 | `BEF_WORK_SITE` | VARCHAR2 | Before | Work site before |
| 20 | `LMH_WORKER_ID` | VARCHAR2(10) | Key | Worker ID (matches `LCD.WORKER.WORKER_ID`) |
| 21 | `LMH_WORKER_SSN` | VARCHAR2(10) | Key | Worker SSN |
| 22 | `BEF_WO_NUM` | VARCHAR2(30+) | Before | Work order + task before |
| 23 | `BEF_GL_ACCT_NUM` | VARCHAR2 | Before | GL account number before |
| 24 | `BEF_PAY_WAGE_TYPE` | VARCHAR2 | Before | Pay wage type before |
| 25 | `BEF_ACCT_ORG_ID` | VARCHAR2 | Before | Accounting org ID before |
| 26 | `BEF_ATT_TYPE` | VARCHAR2(4) | **Before** | **Activity/attendance type before** |
| 27 | `BEF_CROSS_CHARGE_ORG` | VARCHAR2 | Before | Cross-charge org before |
| 28 | `BEF_BILL_LAB_CAT` | VARCHAR2(8) | Before | Billing labor category before |
| 29 | `BEF_COST_CENTER` | VARCHAR2 | Before | Cost center before |
| 30 | `AFT_WORK_SITE` | VARCHAR2 | After | Work site after |
| 31 | `AFT_WO_NUM` | VARCHAR2(30+) | After | Work order + task after (translated for Costpoint) |
| 32 | `AFT_GL_ACCT_NUM` | VARCHAR2 | After | GL account number after |
| 33 | `AFT_PAY_WAGE_TYPE` | VARCHAR2 | After | Pay wage type after |
| 34 | `AFT_ACCT_ORG_ID` | VARCHAR2 | After | Accounting org ID after |
| 35 | `AFT_ATT_TYPE` | VARCHAR2(4) | **After** | **Activity/attendance type after** |
| 36 | `AFT_CROSS_CHARGE_ORG` | VARCHAR2 | After | Cross-charge org after (translated for Costpoint) |
| 37 | `AFT_BILL_LAB_CAT` | VARCHAR2(8) | After | Billing labor category after |
| 38 | `AFT_COST_CENTER` | VARCHAR2 | After | Cost center after |
| 39 | `APPROVED_BY_NAME` | VARCHAR2 | Audit | LCD user who approved/rejected |
| 40 | `REASON_DESC` | VARCHAR2 | Meta | Free-text reason description |
| 41 | `WORK_SITE` | VARCHAR2 | Meta | Work site (general) |
| 42 | `BEF_CLIENT_CODE` | VARCHAR2 | Before | Client code before |
| 43 | `BEF_CLIENT_SITE` | VARCHAR2 | Before | Client site before |
| 44 | `AFT_CLIENT_CODE` | VARCHAR2 | After | Client code after |
| 45 | `AFT_CLIENT_SITE` | VARCHAR2 | After | Client site after |
| 46 | `ERROR_FLAG` | VARCHAR2 | Status | Error flag |
| 47 | `BEF_CHARGE_TYPE` | VARCHAR2 | Before | Charge type before |
| 48 | `BEF_BILLING_TYPE` | VARCHAR2 | Before | Billing type before |
| 49 | `AFT_CHARGE_TYPE` | VARCHAR2 | After | Charge type after |
| 50 | `AFT_BILLING_TYPE` | VARCHAR2 | After | Billing type after |

### Key Relationships

- **PK:** `LMH_SEQ_NUM` (populated from eTES-generated sequence or LCD sequence)
- **FK to LABOR_DETAIL:** `LBDTL_REC_NUM` → `LCD.LABOR_DETAIL.LBDTL_REC_NUM`
- **FK to WORKER:** `LMH_WORKER_ID` → `LCD.WORKER.WORKER_ID` (within same `ORG_CODE`)
- **Logical Key for matching:** `(ORG_CODE, LMH_WORKER_ID, ACTUAL_DATE, BEF/AFT_ATT_TYPE, BEF/AFT_WO_NUM)`

### Approval State Machine

```
    eTES submits          LCD Labor Acct       Batch Corrections
         │                  approves                approves
         ▼                     │                      │
   'P' (Pending) ──────► 'Q' (Ready) ──────────► 'A' (Approved)
         │                                            
         └──── 'R' (Rejected) ◄── LCD rejects
```

### Columns Used by `PTA_TERM_DELTA_EXPORT`

The procedure only touches 6 of the 50 columns:

| Column | Usage |
|--------|-------|
| `ORG_CODE` | WHERE filter |
| `LMH_WORKER_ID` | JOIN to terminated workers |
| `ACTUAL_DATE` | Date window filter + GROUP BY + output |
| `LMH_APRV_IND` | WHERE = `'A'` (approved only) |
| `BEF_LAB_UNITS` | Delta calculation: `AFT - BEF` |
| `AFT_LAB_UNITS` | Delta calculation: `AFT - BEF` |
| `AFT_ATT_TYPE` / `BEF_ATT_TYPE` | Activity type for output grouping | 


***

I'm in read-only mode so I can't create files, but here's a debug version you can save as `PTA_TERM_DELTA_EXPORT_DEBUG.sql` alongside the original. Key changes:

1. Cursor selects additional raw columns (no GROUP BY — shows each row individually)
2. Output goes to DBMS_OUTPUT instead of (or in addition to) the file, so you can see values in SQL*Plus/SQL Developer
3. Easy to add/remove columns in the SELECT and the debug print section

```sql
/*******************************************************************************
 * Procedure: PTA_TERM_DELTA_EXPORT_DEBUG
 * 
 * DEBUG VERSION — outputs raw LABOR_MOD_HIST fields to DBMS_OUTPUT
 * Clone of PTA_TERM_DELTA_EXPORT for field inspection.
 ******************************************************************************/

CREATE OR REPLACE PROCEDURE PTA_TERM_DELTA_EXPORT_DEBUG (
    p_directory   IN VARCHAR2,
    p_org         IN VARCHAR2,
    p_date        IN VARCHAR2 DEFAULT NULL,
    p_weeks_back  IN NUMBER   DEFAULT 4
) AS
    l_run_date     DATE;
    l_weekend_dt   DATE;
    l_lookback_dt  DATE;
    l_rec_count    NUMBER := 0;

    --------------------------------------------------------------------------
    -- DEBUG cursor: no GROUP BY — shows every individual LMH row
    -- Add/remove columns here as needed for inspection
    --------------------------------------------------------------------------
    CURSOR cur_debug IS
    WITH term_workers AS (
        SELECT w.worker_id, w.worker_ssn
          FROM lcd.worker w
          JOIN lcd.worker_hist h
            ON h.org_code   = w.org_code
           AND h.worker_id  = w.worker_id
           AND h.actual_date = (SELECT MAX(h2.actual_date)
                                  FROM lcd.worker_hist h2
                                 WHERE h2.org_code  = w.org_code
                                   AND h2.worker_id = w.worker_id)
         WHERE w.org_code = p_org
           AND w.termination_date IS NOT NULL
           AND w.termination_date >= l_run_date
           AND w.termination_date <  l_run_date + 1
           AND h.employment_status = lcd.globals.empl_active
    )
    SELECT lmh.lmh_worker_id                         AS worker_id,
           tw.worker_ssn,
           lmh.actual_date,
           -----------------------------------------------------------------
           -- DEBUG FIELDS — add or remove as needed
           -----------------------------------------------------------------
           lmh.mod_aprvl_date,
           lmh.lmh_aprv_ind,
           lmh.aft_att_type,
           lmh.bef_att_type,
           lmh.aft_lab_units,
           lmh.bef_lab_units,
           NVL(lmh.aft_lab_units, 0) - NVL(lmh.bef_lab_units, 0) AS delta_hours
           -----------------------------------------------------------------
      FROM lcd.labor_mod_hist lmh
      JOIN term_workers tw
        ON tw.worker_id = lmh.lmh_worker_id
     WHERE lmh.org_code      = p_org
       AND lmh.actual_date   >= l_lookback_dt
       AND lmh.actual_date   <= l_weekend_dt
       -- NOTE: no lmh_aprv_ind filter so you can see ALL statuses
     ORDER BY lmh.lmh_worker_id, lmh.actual_date, lmh.mod_aprvl_date;

BEGIN
    -- Resolve dates
    IF p_date IS NOT NULL THEN
        l_run_date := TRUNC(TO_DATE(p_date, 'YYYYMMDD'));
    ELSE
        l_run_date := TRUNC(SYSDATE);
    END IF;

    l_weekend_dt  := NEXT_DAY(l_run_date - 1, 'FRIDAY');
    l_lookback_dt := l_weekend_dt - (p_weeks_back * 7);

    DBMS_OUTPUT.PUT_LINE('=== PTA_TERM_DELTA_EXPORT_DEBUG ===');
    DBMS_OUTPUT.PUT_LINE('Run Date:    ' || TO_CHAR(l_run_date, 'YYYY-MM-DD'));
    DBMS_OUTPUT.PUT_LINE('Week End:    ' || TO_CHAR(l_weekend_dt, 'YYYY-MM-DD'));
    DBMS_OUTPUT.PUT_LINE('Lookback To: ' || TO_CHAR(l_lookback_dt, 'YYYY-MM-DD'));
    DBMS_OUTPUT.PUT_LINE('Org:         ' || p_org);
    DBMS_OUTPUT.PUT_LINE(RPAD('-', 120, '-'));
    DBMS_OUTPUT.PUT_LINE(
        RPAD('WORKER_ID', 12) ||
        RPAD('SSN', 12) ||
        RPAD('ACTUAL_DATE', 12) ||
        RPAD('APRV_IND', 10) ||
        RPAD('MOD_APRVL_DATE', 16) ||
        RPAD('AFT_ATT', 8) ||
        RPAD('BEF_ATT', 8) ||
        RPAD('AFT_HRS', 9) ||
        RPAD('BEF_HRS', 9) ||
        'DELTA'
    );
    DBMS_OUTPUT.PUT_LINE(RPAD('-', 120, '-'));

    FOR r IN cur_debug LOOP
        l_rec_count := l_rec_count + 1;

        -----------------------------------------------------------------------
        -- DEBUG OUTPUT — tailor this section to show whatever you need
        -----------------------------------------------------------------------
        DBMS_OUTPUT.PUT_LINE(
            RPAD(NVL(r.worker_id, ' '), 12) ||
            RPAD(NVL(r.worker_ssn, ' '), 12) ||
            RPAD(TO_CHAR(r.actual_date, 'MM/DD/YYYY'), 12) ||
            RPAD(NVL(r.lmh_aprv_ind, '?'), 10) ||
            RPAD(NVL(TO_CHAR(r.mod_aprvl_date, 'MM/DD/YY HH24:MI'), ' '), 16) ||
            RPAD(NVL(RTRIM(r.aft_att_type), ' '), 8) ||
            RPAD(NVL(RTRIM(r.bef_att_type), ' '), 8) ||
            LPAD(NVL(TO_CHAR(r.aft_lab_units, '990.99'), ' '), 9) ||
            LPAD(NVL(TO_CHAR(r.bef_lab_units, '990.99'), ' '), 9) ||
            LPAD(TO_CHAR(r.delta_hours, 'S990.99'), 9)
        );
    END LOOP;

    DBMS_OUTPUT.PUT_LINE(RPAD('-', 120, '-'));
    DBMS_OUTPUT.PUT_LINE('Total rows: ' || l_rec_count);

EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('DEBUG ERROR: ' || SQLCODE || ' - ' || SQLERRM);
        RAISE;
END PTA_TERM_DELTA_EXPORT_DEBUG;
/
SHOW ERRORS
```

**Key differences from the production version:**

| Feature | Production | Debug |
|---------|-----------|-------|
| Grouping | GROUP BY worker/date/type | No grouping — every LMH row shown |
| Approval filter | Only `'A'` (approved) | **None** — shows all statuses so you can verify filtering |
| Output | UTL_FILE (GEMS format) | DBMS_OUTPUT (tabular, human-readable) |
| Email | Supported | Removed |
| Extra columns | None | `MOD_APRVL_DATE`, `LMH_APRV_IND`, before/after values shown separately |

**To use:**
```sql
SET SERVEROUTPUT ON SIZE UNLIMITED
EXEC PTA_TERM_DELTA_EXPORT_DEBUG('LCD_EXPORT', '044', '20260521');
```

To add more columns, just add them to the cursor SELECT and add a corresponding segment in the `DBMS_OUTPUT.PUT_LINE` inside the loop. 


***