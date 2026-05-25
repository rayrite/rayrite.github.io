# Execution Trace: T260109.693 Time File Generation

## Overview

This report traces the complete call stack for generating a GEMS-format time export file such as `T260109.693`. The filename convention is `T{YYMMDD}.{ORG}` where `YYMMDD` is a user-chosen date identifier and `ORG` is the three-digit organization code (e.g., `693`).

The file is produced by the **LCD TimeExport** subsystem — an Oracle PL/SQL package invoked via the LCD PowerBuilder batch job infrastructure. This is distinct from the **Accounting Interface** (ACCT folder), which is a separate downstream process that reads from `LCD.LABOR_DETAIL` after Distribution.

### Sample Record (from T260109.693)

```
11775797  11775797  03/31/20258000     -9.00693
11775797  11775797  03/31/20258010      9.00693
11750700  11750700  08/15/20258000      9.00693
```

---

## Architecture Summary

```
┌──────────────────────────────────────────────────────────────────────┐
│                     PowerBuilder Client Layer                        │
│                                                                      │
│  w_time_transactions.srw                                             │
│    cb_export::clicked ──► wf_time_exp_run() ──► w_get_exp_names     │
│                                │                    │                │
│                                │             User enters filenames   │
│                                │             (e.g. T260109.693)      │
│                                ▼                    │                │
│                         wf_time_export()  ◄─────────┘                │
│                                │                                     │
│                    ┌───────────┴───────────┐                         │
│                    │                       │                         │
│              [Client-side]          [Server-side]                    │
│              FileWrite()            w_Job_Schedule                   │
│              (legacy path)               │                           │
│                                          ▼                           │
│                              lcd.LCDBatch.SUB_JOB()                  │
└──────────────────────────────┬───────────────────────────────────────┘
                               │
┌──────────────────────────────▼───────────────────────────────────────┐
│                      Oracle Batch Layer                               │
│                                                                      │
│  BATCH2.SQL                                                          │
│    SUB_JOB ──► INSERT LCD.JOB_TABLE ──► DBMS_SCHEDULER               │
│                                              │                       │
│    START_JOB ◄───────────────────────────────┘                       │
│        │                                                             │
│        ▼                                                             │
│  lcd.Get_Time_Export()  [TIMEXPR3.SQL]                               │
│        │                                                             │
│        ├─ Parse '@'-delimited filename                               │
│        ├─ LCD.Shared.f_open_out_file() ──► UTL_FILE.FOPEN           │
│        │                                                             │
│        ▼                                                             │
│  lcd.TimeExport.export_gems()  [TIMEXPR2.SQL]                       │
│        │                                                             │
│        ├─ CURSOR on LCD.TIME_EXPORT + LCD.WORKER                     │
│        ├─ emp_or_sub() → select file handle                         │
│        ├─ p_write_gems() → format 47-char fixed-width record        │
│        │       └─ lcd.shared1.f_put_out_line()                       │
│        │               └─ UTL_FILE.PUT_LINE                          │
│        └─ UPDATE LCD.TIME_EXPORT SET proc_stat_ind                   │
│                                                                      │
│  LCD.shared.close_file() ──► UTL_FILE.FCLOSE                        │
│  LCD.ServerFileCopy() ──► Archive                                    │
│  lcd.shared.f_event_log_set() ──► LCD.EVENT_LOG                     │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Full Call Stack

### Layer 1: PowerBuilder Client — User-Initiated Export

#### Step 1.1: `cb_export::clicked` — Export Button

**File:** `pb_export/TIME/w_time_transactions.srw` (line ~6917)

The user clicks the **Export** button on the Time Transactions window. This event handler:

1. Calls `f_genesis_start()` to determine the Genesis cutover date
2. Counts pre-Genesis records in `LCD.TIME_EXPORT` and purges/reports them
3. Delegates to `wf_time_exp_run()`

#### Step 1.2: `wf_time_exp_run()` — Export Orchestrator

**File:** `pb_export/TIME/w_time_transactions.srw` (line ~566)

```
wf_time_exp_run()
  ├─ Open(w_get_exp_names)           // Prompt user for filenames
  │    └─ Returns "emp_file@sub_file" string
  ├─ Parse '@' delimiter → employee file, subcontractor file
  ├─ Calculate monday_date from week_start_date
  └─ Build STR_JOB_SCHEDULE structure
       ├─ job_name = 'TIME_EXPORT'
       ├─ params = reference_org + ';' + time_format + ';' + ...
       ├─ TimeExportFile = "T260109.693@S260109.693"
       └─ OpenWithParm(w_Job_Schedule, lstr_Job_Schedule)
```

#### Step 1.3: `w_get_exp_names` — Filename Dialog

**File:** `pb_export/TIME/w_get_exp_names.srw`

A response-type dialog that prompts for two filenames:

| Field | Default Value | Example |
|-------|---------------|---------|
| Employee Export File | `TexpEmp.{ORG}` | `TexpEmp.693` |
| Subcontractor Export File | `TexpSub.{ORG}` | `TexpSub.693` |

The user can override these defaults with custom names like `T260109.693`. The dialog:

```powerbuilder
// open event
sle_emp_file.text = 'TexpEmp.' + nvo_KeyGlobals.is_Org
sle_sub_file.text = 'TexpSub.' + nvo_KeyGlobals.is_Org

// cb_ok::clicked — returns combined string
CloseWithReturn(w_get_exp_names, sle_emp_file.text + '@' + sle_sub_file.text)
```

**Return value:** `"T260109.693@S260109.693"` (or whatever the user entered, `@`-delimited).

#### Step 1.4: `w_Job_Schedule` — Job Queue Submission

**File:** `pb_export/LCD7/w_job_schedule.srw` (referenced via `OpenWithParm`)

Receives the `STR_JOB_SCHEDULE` structure and calls the Oracle stored procedure:

```
lcd.LCDBatch.SUB_JOB(
    P_ORG_CODE    = nvo_KeyGlobals.is_Org,           -- '693'
    P_FILE_NAME   = 'T260109.693@S260109.693',       -- '@'-delimited filenames
    P_JOB_NAME    = 'TIME_EXPORT',
    P_JOB_PARAM   = 'week_end_date~monday_date',     -- '~'-delimited
    P_TABLE_NAME  = 'LCD.TIME_EXPORT',
    P_IMPORT_FLAG = 'E'                               -- Export
)
```

---

### Layer 2: Oracle Batch Infrastructure — Job Dispatch

#### Step 2.1: `LCDBatch.SUB_JOB` — Job Enqueue

**File:** `LCD-Oracle/SQL/BATCH2.SQL` (line ~92)

```sql
PROCEDURE SUB_JOB(
    P_ORG_CODE    IN LCD.JOB_TABLE.ORG_CODE%TYPE,
    P_FILE_NAME   IN LCD.JOB_TABLE.FILE_NAME%TYPE,
    P_FILE_LENGTH IN LCD.JOB_TABLE.FILE_LENGTH%TYPE,
    P_JOB_NAME    IN LCD.JOB_TABLE.JOB_NAME%TYPE,
    P_START_DATE  IN VARCHAR2,
    P_JOB_PARAM   IN LCD.JOB_TABLE.JOB_PARAM%TYPE,
    P_TABLE_NAME  IN LCD.JOB_TABLE.TABLE_NAME%TYPE,
    P_IMPORT_FLAG IN LCD.JOB_TABLE.IMPORT_FLAG%TYPE,
    p_cancellable IN LCD.JOB_TABLE.CANCELLABLE%TYPE)
```

Actions:
1. Uppercases the filename: `L_FILE_NAME := UPPER(P_FILE_NAME)`
2. Inserts a row into `LCD.JOB_TABLE` with `JOB_STATUS = 'S'` (Submitted)
3. Schedules execution via `DBMS_SCHEDULER.CREATE_JOB` → targets `LCD.START_JOB`

#### Step 2.2: `LCDBatch.START_JOB` — Job Dispatch

**File:** `LCD-Oracle/SQL/BATCH2.SQL` (line ~455)

```sql
PROCEDURE START_JOB(
    P_ORG_CODE  IN LCD.JOB_TABLE.ORG_CODE%TYPE,
    P_FILE_NAME IN LCD.JOB_TABLE.FILE_NAME%TYPE,
    P_JOB_NAME  IN LCD.JOB_TABLE.JOB_NAME%TYPE,
    P_JOB_PARAM IN LCD.JOB_TABLE.JOB_PARAM%TYPE)
```

Actions:
1. Updates `LCD.JOB_TABLE` status to `'R'` (Running)
2. Parses `P_JOB_PARAM` by `~` delimiter into `parms()` array
3. Dispatches by job name:

```sql
ELSIF p_job_name = 'TIME_EXPORT' THEN
    lcd.Get_Time_Export(
        P_ORG_CODE,
        P_FILE_NAME,       -- 'T260109.693@S260109.693'
        parms(1),          -- week_end_date (MM/DD/YYYY)
        parms(2),          -- monday_date (MM/DD/YYYY)
        l_comments,
        return_value);
```

---

### Layer 3: Oracle TimeExport Engine — File Generation

#### Step 3.1: `lcd.Get_Time_Export` — Entry Point & Filename Parsing

**File:** `LCD-Oracle/SQL/TIMEXPR3.SQL`

```sql
CREATE OR REPLACE PROCEDURE lcd.get_time_export(
    P_ORG             IN LCD.TIME_EXPORT.ORG_CODE%TYPE,
    FILE_NAME         IN VARCHAR2,
    P_WEEK_START_DATE IN VARCHAR2,
    P_MONDAY_DATE     IN VARCHAR2,
    comments          OUT VARCHAR2,
    return_value      OUT BOOLEAN)
```

**Filename parsing** — splits the `@`-delimited string:

```sql
found_loc1 := INSTR(file_name, '@', 1, 1);

-- Employee file (Genesis format)
lcd.TimeExport.emp_file_name_genesis := SUBSTR(file_name, 1, (found_loc1 - 1));
-- Result: 'T260109.693'

found_loc2 := INSTR(file_name, '@', 1, 2);
IF found_loc2 = 0 THEN
    -- Two-file mode: emp + sub
    lcd.TimeExport.sub_file_name := SUBSTR(file_name, (found_loc1 + 1));
    -- Result: 'S260109.693'
ELSE
    -- Three-file mode: emp_genesis + sub + emp_gems
    lcd.TimeExport.split_employee := True;
    lcd.TimeExport.sub_file_name := SUBSTR(file_name, found_loc1+1, found_loc2-found_loc1-1);
    lcd.TimeExport.emp_file_name_gems := SUBSTR(file_name, (found_loc2 + 1));
END IF;
```

**File opens** via UTL_FILE:

```sql
-- Employee file
LCD.Shared.f_open_out_file(P_ORG, lcd.TimeExport.emp_file_name_genesis,
                           lcd.TimeExport.emp_out_file_genesis);

-- Subcontractor file
LCD.Shared.f_open_out_file(P_ORG, lcd.TimeExport.sub_file_name,
                           lcd.TimeExport.sub_out_file);

-- Optional GEMS split file (if split_employee = True)
LCD.Shared.f_open_out_file(P_ORG, lcd.TimeExport.emp_file_name_gems,
                           lcd.TimeExport.emp_out_file_gems);

-- Optional L1 Visa file (derived from employee filename + 'L1')
lcd.TimeExport.L1Visa_file_name :=
    SUBSTR(emp_file_name_genesis, 1, extension_pos-1)
    || 'L1'
    || SUBSTR(emp_file_name_genesis, extension_pos);
```

Then loops over distinct `week_end_date` values and calls `export_gems`:

```sql
FOR date_rec IN date_cur LOOP
    lcd.TimeExport.export_gems(
        P_ORG, FILE_NAME, TIME_TYPE,
        WEEK_START_DATE, MONDAY_DATE,
        NOTIMECARD_FLAG, COMMENTS, RETURNED);
END LOOP;
```

After the loop: closes files, copies to archive, writes event log.

#### Step 3.2: `LCD.Shared.f_open_out_file` — Physical File Open

**File:** `LCD-Oracle/SQL/SHRD_BDY.SQL` (line ~634)

```sql
FUNCTION f_open_out_file(
    p_org_code      IN VARCHAR2,
    p_out_file_name IN VARCHAR2,
    p_file_handle   OUT UTL_FILE.FILE_TYPE)
RETURN BOOLEAN IS
    l_dir_name LCD.ORG_PARAM.LCD_SERVER_LOC%TYPE;
BEGIN
    -- Get output directory from org parameters + '/OUT' subdirectory
    l_dir_name := lcd.f_get_lcd_os_filename(p_org_code, null, 'OUT', FALSE);

    -- Open the file for writing
    p_file_handle := UTL_FILE.FOPEN(l_dir_name, RTRIM(p_out_file_name), 'w');
    RETURN TRUE;
END f_open_out_file;
```

The output directory is derived from `LCD.ORG_PARAM.LCD_SERVER_LOC` for the organization, with `\OUT` appended. For org 693, this produces a path like:

```
\\server\share\P22-663\OUT\T260109.693
```

#### Step 3.3: `lcd.TimeExport.export_gems` — Main Export Loop

**File:** `LCD-Oracle/SQL/TIMEXPR2.SQL` (line ~829, patched version in `tasks/35/TIMEXPR2[new].SQL`)

```sql
PROCEDURE export_gems(
    P_ORG            IN VARCHAR2,
    FILE_NAME        IN VARCHAR2,
    P_TIME_TYPE      IN VARCHAR2,
    WEEK_START_DATE  IN DATE,
    MONDAY_DATE      IN DATE,
    NOTIMECARD_FLAG  IN VARCHAR2,
    comments         OUT VARCHAR2,
    return_value     OUT BOOLEAN)
```

Opens a cursor aggregating time records by worker, type, and date:

```sql
SELECT W.worker_ssn,
       W.worker_id,
       T.att_abs_type,
       T.actual_date,
       SUM(T.lab_units) AS hrs
  FROM lcd.worker W, lcd.time_export T
 WHERE W.worker_id = T.worker_id
   AND W.org_code  = P_ORG
   AND T.org_code  = P_ORG
   AND T.week_end_date = week_end
   AND T.proc_stat_ind IN ('C','P','R')
 GROUP BY W.worker_ssn, W.worker_id, T.att_abs_type, T.actual_date
 ORDER BY 2, 3, 4;
```

For each record:
1. Calls `emp_or_sub()` to determine if the worker is an employee or subcontractor
2. Selects the appropriate file handle (`emp_out_file_genesis`, `emp_out_file_gems`, or `sub_out_file`)
3. Calls **`p_write_gems()`** to format and write the record

After writing all records, updates the export status:

```sql
UPDATE lcd.time_export
   SET proc_stat_ind = DECODE(proc_stat_ind, 'C','1', 'P','2', 'R','3')
 WHERE org_code = P_ORG
   AND week_end_date = week_end
   AND proc_stat_ind IN ('C','P','R');
```

#### Step 3.4: `lcd.TimeExport.p_write_gems` — Record Formatting ★

**File:** `LCD-Oracle/SQL/TIMEXPR2.SQL` (line ~359)

This is the procedure that constructs the fixed-width output record matching the format in `T260109.693`:

```sql
PROCEDURE p_write_gems(
    P_OUT_FILE   IN UTL_FILE.FILE_TYPE,
    P_ORG        IN VARCHAR2,
    rec_gems     IN RECORD_TYPE_FOR_GEMS,
    ROWS_WRITTEN IN OUT NUMBER)
```

**Record construction:**

```sql
id_out        := RPAD(rec_gems.wrk_id, 10, ' ');                    -- worker_id  (10 chars)
ssn_out       := RPAD(rec_gems.wrk_ssn, 10, ' ');                   -- worker_ssn (10 chars)
act_date      := TO_CHAR(rec_gems.act_date, 'MM/DD/YYYY');          -- date       (10 chars)
time_type_out := RPAD(rec_gems.time_type, 4, ' ');                  -- att_abs    ( 4 chars)
hrs_string    := LPAD(TO_CHAR(hrs, '999990D99'), 10, ' ');           -- hours      (10 chars)

rec_out := id_out || ssn_out || act_date || time_type_out || hrs_string || P_ORG;

-- Write to file (skip zero-hour records)
IF lcd.shared1.f_put_out_line(P_OUT_FILE, rec_out) > 0 THEN
    rows_written := rows_written + 1;
END IF;
```

#### Step 3.5: `lcd.shared1.f_put_out_line` — Physical Write

**File:** `LCD-Oracle/SQL/SHARED1.SQL` (line ~32)

```sql
FUNCTION f_put_out_line(
    p_file_handle IN UTL_FILE.FILE_TYPE,
    p_string      IN VARCHAR2)
RETURN INTEGER IS
BEGIN
    UTL_FILE.PUT_LINE(p_file_handle, p_string);
    RETURN 1;
END;
```

#### Step 3.6: `LCD.shared.close_file` — File Close & Archive

**File:** `LCD-Oracle/SQL/SHRD_BDY.SQL` (line ~745)

```sql
PROCEDURE close_file(p_file_handle IN OUT UTL_FILE.FILE_TYPE) IS
BEGIN
    UTL_FILE.FCLOSE(p_file_handle);
END;
```

After closing, `get_time_export` calls `LCD.ServerFileCopy` to copy the completed file to an archive directory and writes a summary to `LCD.EVENT_LOG` via `lcd.shared.f_event_log_set`.

---

## Record Format Specification

### Fixed-Width Layout (GEMS Format)

| Position | Width | Field | Format | Alignment | Description |
|----------|-------|-------|--------|-----------|-------------|
| 1–10 | 10 | `worker_id` | `RPAD(id, 10)` | Left | Worker ID (padded) |
| 11–20 | 10 | `worker_ssn` | `RPAD(ssn, 10)` | Left | Worker SSN / alternate ID |
| 21–30 | 10 | `actual_date` | `MM/DD/YYYY` | Fixed | Transaction date |
| 31–34 | 4 | `att_abs_type` | `RPAD(type, 4)` | Left | Attendance/Absence type code |
| 35–44 | 10 | `lab_units` | `999990D99` | Right | Hours (signed decimal, `LPAD` to 10) |
| 45–47 | 3 | `org_code` | As-is | Left | Organization code |

**Total record width:** 47 characters (+ optional trailing spaces/comments)

### Sample Record Decoded

```
Position: 1234567890123456789012345678901234567890123456789
Record:   11775797  11775797  03/31/20258000     -9.00693
          |---------|---------|----------|----|---------|-|
          worker_id  ssn       date       type hours     org
```

| Field | Value | Meaning |
|-------|-------|---------|
| worker_id | `11775797` | Employee ID |
| worker_ssn | `11775797` | SSN (same as ID in this case) |
| actual_date | `03/31/2025` | Transaction date |
| att_abs_type | `8000` | Time type code |
| lab_units | `-9.00` | Negative 9 hours (reversal/adjustment) |
| org_code | `693` | Organization |

### Common Time Type Codes in Sample

| Code | Typical Meaning |
|------|-----------------|
| `1010` | Regular time |
| `1NSH` | Night shift premium |
| `1NSF` | Night shift full |
| `1SBF` | Standby full day (India) |
| `1SBD` | Standby double (India) |
| `8000` | Holiday |
| `8010` | Holiday premium |
| `8100` | Vacation/Annual leave |
| `8399` | Miscellaneous leave |
| `8640` | Special assignment |
| `8914` | Leave type |
| `8916` | Leave type (offset/reversal) |
| `8940` | Leave type |
| `8950` | Leave type (offset/reversal) |

Negative hours (e.g., `-9.00` on type `8916`) represent **reversal entries** — they offset a positive entry on a different type code for the same worker and date.

---

## Upstream: How LCD.TIME_EXPORT Gets Populated

The `LCD.TIME_EXPORT` table is the source data for the export. It is populated through three pathways:

### Path A: Online Time Card Save (Primary)

**File:** `LCD-Oracle/SQL/TIMEPR2.SQL` — `PKG_TIMEPROCESSING.SaveTimeRecords`

When a user saves a timesheet via the eTES web application or PowerBuilder time entry:

```sql
FOR v_j IN 1 .. 7 LOOP
    hrs      := SUBSTR(hrs_out, 4*(v_j-1)+1, 4);
    real_hrs := TO_NUMBER(SUBSTR(hrs,1,2) || '.' || SUBSTR(hrs,3,2));
    IF real_hrs > 0 THEN
        real_date := week_start_date + (v_j - 1);
        INSERT INTO LCD.TIME_EXPORT
            (WORKER_ID, ATT_ABS_TYPE, ACTUAL_DATE, WO_NUM, LAB_UNITS,
             WEEK_END_DATE, ..., PROC_STAT_IND, ...)
        VALUES
            (w_id, AttAbs, real_date, wo, real_hrs,
             week_end_date, ..., 'C', ...);
    END IF;
END LOOP;
```

`PROC_STAT_IND = 'C'` (Created) — record is pending export.

### Path B: Batch File Import

**File:** `LCD-Oracle/SQL/TIMEDB2.SQL` — `PKG_TIMESTOREINDB.StoreInTimeExport`

When time data is loaded from external flat files (e.g., SAP CATS):

```sql
INSERT INTO LCD.TIME_EXPORT(...)
VALUES(l_worker_id, l_AttAbs, l_real_date, l_wo, l_real_hrs,
       p_week_end_date, ..., 'C', SYSDATE, USER, ...);
```

Also handles `DTE` (Delete Time Entry) records by negating hours: `l_real_hrs := l_real_hrs * -1`.

### Path C: NoTimeCard Generation

**File:** `LCD-Oracle/SQL/TIMEXPR2.SQL` — `lcd.TimeExport.p_write_no_timecard`

For workers who did not submit timecards, the system auto-generates 5 weekday records using the longest hours found for that worker:

```sql
FOR l IN 1 .. 5 LOOP
    real_date := MONDAY_DATE + l - 1;
    INSERT INTO LCD.TIME_EXPORT
        (..., PROC_STAT_IND, ..., CREATED_BY_NAME, ...)
    VALUES
        (w_id, Time_Type, real_date, ..., '1', ..., 'NOTIMECARD', ...);
END LOOP;
```

### PROC_STAT_IND Lifecycle

| Value | State | Set By |
|-------|-------|--------|
| `C` | Created — pending export | SaveTimeRecords, StoreInTimeExport |
| `P` | Posted/approved | Approval process |
| `R` | Resubmitted | Re-approval |
| `1` | Exported (from C) | export_gems UPDATE |
| `2` | Exported (from P) | export_gems UPDATE |
| `3` | Exported (from R) | export_gems UPDATE |
| `S` | Submitted for distribution | Distribution process |
| `D` | Distributed (pending delete) | nvo_distribution |

---

## Relationship to the Accounting Interface (ACCT Folder)

The **Accounting Interface** is a completely separate downstream process:

```
                    ┌───────────────┐
                    │ eTES Web/PB   │
                    │ Time Entry    │
                    └──────┬────────┘
                           │ SaveTimeRecords
                           ▼
                   ┌───────────────┐
                   │ LCD.TIME_EXPORT│  ◄── Source for T260109.693
                   └──────┬────────┘
                          │
              ┌───────────┴────────────┐
              │                        │
              ▼                        ▼
     ┌─────────────────┐    ┌─────────────────────┐
     │ Time Export      │    │ Distribution         │
     │ (TIMEXPR2.SQL)   │    │ (nvo_distribution)   │
     │                  │    │                      │
     │ ► T260109.693   │    │ ► LCD.LABOR_DETAIL   │
     │   (GEMS file)    │    │   (Oracle table)     │
     └─────────────────┘    └──────────┬───────────┘
                                       │
                                       ▼
                            ┌─────────────────────┐
                            │ Accounting Interface │
                            │ (ACCT/f_acct_int)    │
                            │                      │
                            │ ► EDTL693.TXT etc.  │
                            │   (Acct files)       │
                            └──────────────────────┘
```

The ACCT folder's `f_acct_int` function reads from `LCD.LABOR_DETAIL` (populated by Distribution from `TIME_EXPORT`) and writes accounting interface files (e.g., `EDTL693.TXT`, `DLTK693.TXT`) in a different fixed-width format (80 chars). This is triggered separately from `Processing → Generate Accounting Interface` in the menu.

---

## Complete Source File Index

### PowerBuilder Client Layer

| File | Object | Role |
|------|--------|------|
| `pb_export/TIME/w_time_transactions.srw` | `cb_export::clicked` (line ~6917) | User trigger — Export button |
| `pb_export/TIME/w_time_transactions.srw` | `wf_time_exp_run()` (line ~566) | Export orchestrator |
| `pb_export/TIME/w_time_transactions.srw` | `wf_time_export()` (line ~3706) | Client-side export (legacy) |
| `pb_export/TIME/w_get_exp_names.srw` | `w_get_exp_names` | Filename dialog (`TexpEmp.{ORG}` defaults) |
| `pb_export/LCD7/m_main.srm` | `m_time1::clicked` (line ~2413) | Time Import menu alternative entry |
| `pb_export/SPECPAY1/f_new_file_name.srf` | `f_new_file_name()` | Inserts `\GEMS_` prefix for split files |
| `pb_export/LCD7/nvo_keyglobals.sru` | `nvo_KeyGlobals` | Global state: `is_Org`, `is_Start_Day`, `is_Reference_Org` |

### Oracle Batch & Export Layer

| File | Object | Role |
|------|--------|------|
| `LCD-Oracle/SQL/BATCH2.SQL` | `LCDBatch.SUB_JOB` (line ~92) | Job enqueue + DBMS_SCHEDULER |
| `LCD-Oracle/SQL/BATCH2.SQL` | `LCDBatch.START_JOB` (line ~455) | Job dispatch by job_name |
| `LCD-Oracle/SQL/TIMEXPR3.SQL` | `lcd.get_time_export` | Entry point — filename parse, file open, loop, close |
| `LCD-Oracle/SQL/TIMEXPR2.SQL` | `lcd.TimeExport.export_gems` (line ~829) | Main cursor loop over TIME_EXPORT |
| `LCD-Oracle/SQL/TIMEXPR2.SQL` | `lcd.TimeExport.p_write_gems` (line ~359) | **Fixed-width record formatter** ★ |
| `LCD-Oracle/SQL/TIMEXPR2.SQL` | `lcd.TimeExport.p_write_no_timecard` (line ~485) | NoTimeCard auto-generation |
| `LCD-Oracle/SQL/TIMEXPR1.SQL` | `lcd.TimeExport` (package spec) | Package specification |
| `LCD-Oracle/SQL/SHRD_BDY.SQL` | `LCD.Shared.f_open_out_file` (line ~634) | UTL_FILE.FOPEN wrapper |
| `LCD-Oracle/SQL/SHRD_BDY.SQL` | `LCD.shared.close_file` (line ~745) | UTL_FILE.FCLOSE wrapper |
| `LCD-Oracle/SQL/SHARED1.SQL` | `lcd.shared1.f_put_out_line` (line ~32) | UTL_FILE.PUT_LINE wrapper |

### Upstream Data Population

| File | Object | Role |
|------|--------|------|
| `LCD-Oracle/SQL/TIMEPR2.SQL` | `PKG_TIMEPROCESSING.SaveTimeRecords` (line ~583) | Online time save → INSERT TIME_EXPORT |
| `LCD-Oracle/SQL/TIMEDB2.SQL` | `PKG_TIMESTOREINDB.StoreInTimeExport` (line ~410) | Batch import → INSERT TIME_EXPORT |
| `pb_export/TIME/w_time_transactions.srw` | `wf_save` (line ~849) | PB direct INSERT (online save) |

### Downstream (Accounting Interface — Separate Process)

| File | Object | Role |
|------|--------|------|
| `pb_export/ACCT/f_acct_int.srf` | `f_acct_int()` | Reads LABOR_DETAIL → writes ACCT files |
| `pb_export/ACCT/f_save_acct.srf` | `f_save_acct()` | FileOpen for ACCT output |
| `pb_export/ACCT/f_get_ready_for_acct.srf` | `f_get_ready_for_acct()` | Pre-validation / NEW vs ALL |
| `pb_export/ACCT/f_convert_negative.srf` | `f_convert_negative()` | Negative sign → overpunch character |
| `pb_export/ACCT/f_update_interface_date.srf` | `f_update_interface_date()` | Stamps LABOR_DETAIL.INTERFACE_DATE |
| `pb_export/LCD7/m_main.srm` | `m_generateaccountinginterface::clicked` (line ~5793) | ACCT menu trigger |

### Database Tables

| Table | Role in Time Export |
|-------|---------------------|
| `LCD.TIME_EXPORT` | **Source table** — contains time records pending export |
| `LCD.WORKER` | Joined for worker_ssn lookup |
| `LCD.ORG_PARAM` | `LCD_SERVER_LOC` → output directory, `ACCT_SYS_TYPE`, `TIME_FORMAT` |
| `LCD.JOB_TABLE` | Batch job queue |
| `LCD.EVENT_LOG` | Audit trail of export runs |
| `LCD.TIME_EXPORT_BACKUP` | Snapshot before distribution (rollback support) |
| `LCD.LABOR_DETAIL` | Downstream — populated by Distribution, consumed by ACCT |
| `LCD.ATT_WAGE_TYPE_MAP` | Time type ↔ wage type mapping (used by ACCT) |
| `LCD.TOE_ATTABS_MAP` | TOE code mapping by att_abs_type (used by ACCT) |
| `LCD.TOE_PAYWAGE_MAP` | TOE code mapping by pay_wage_type (used by ACCT) |

---

## Condensed Call Stack (Quick Reference)

```
User clicks [Export] in w_time_transactions
  └─ cb_export::clicked                          [w_time_transactions.srw:6917]
      └─ wf_time_exp_run()                       [w_time_transactions.srw:566]
          ├─ Open(w_get_exp_names)                [w_get_exp_names.srw]
          │   └─ User enters "T260109.693"
          │   └─ Returns "T260109.693@S260109.693"
          └─ OpenWithParm(w_Job_Schedule, ...)    [STR_JOB_SCHEDULE]
              └─ lcd.LCDBatch.SUB_JOB(...)        [BATCH2.SQL:92]
                  ├─ INSERT INTO LCD.JOB_TABLE
                  └─ DBMS_SCHEDULER → lcd.START_JOB
                      └─ START_JOB(...)           [BATCH2.SQL:455]
                          └─ lcd.Get_Time_Export(  [TIMEXPR3.SQL]
                                org='693',
                                file='T260109.693@S260109.693',
                                week_end, monday)
                              ├─ Parse filenames by '@'
                              ├─ f_open_out_file(  [SHRD_BDY.SQL:634]
                              │     '693', 'T260109.693', handle)
                              │   └─ f_get_lcd_os_filename('693',,'OUT',FALSE)
                              │   └─ UTL_FILE.FOPEN(dir, 'T260109.693', 'w')
                              │
                              ├─ FOR EACH week_end_date:
                              │   └─ export_gems(  [TIMEXPR2.SQL:829]
                              │        org, file, time_type,
                              │        week_start, monday, ...)
                              │     ├─ CURSOR: LCD.TIME_EXPORT ⋈ LCD.WORKER
                              │     │   WHERE proc_stat_ind IN ('C','P','R')
                              │     ├─ emp_or_sub() → pick file handle
                              │     ├─ p_write_gems(handle, org, rec)
                              │     │               [TIMEXPR2.SQL:359]
                              │     │   ├─ RPAD(worker_id, 10)
                              │     │   ├─ RPAD(worker_ssn, 10)
                              │     │   ├─ TO_CHAR(date, 'MM/DD/YYYY')
                              │     │   ├─ RPAD(att_abs_type, 4)
                              │     │   ├─ LPAD(TO_CHAR(hrs,'999990D99'),10)
                              │     │   ├─ || org_code
                              │     │   └─ f_put_out_line(handle, rec_out)
                              │     │                     [SHARED1.SQL:32]
                              │     │       └─ UTL_FILE.PUT_LINE ← FILE WRITE
                              │     │
                              │     └─ UPDATE LCD.TIME_EXPORT
                              │          SET proc_stat_ind = '1'/'2'/'3'
                              │
                              ├─ close_file(handle) [SHRD_BDY.SQL:745]
                              │   └─ UTL_FILE.FCLOSE
                              ├─ ServerFileCopy → archive
                              └─ f_event_log_set → LCD.EVENT_LOG
```
