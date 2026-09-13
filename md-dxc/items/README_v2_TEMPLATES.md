# CVX Deluxe Harness — v2 Standalone Test-Case Templates

This subfolder holds **v2** of the two CVX deluxe reporting harnesses one directory up
(`CVX_01_REGULAR_TIMESHEET_DELUXE.sql`, `CVX_02_PTA_TIMESHEET_DELUXE.sql`). The originals (v1)
are untouched and still work exactly as documented in `../README_CVX_DELUXE_HARNESS.md` — v2
does not replace them, it packages the same reporting logic as a **reusable, standalone
test-case template**, in the style that emerged organically across two tickets:

- `cvx_deluxe_harness/standalone/T-AVCP-*.sql` (INC1276683) — first used the pattern
- `cvx_deluxe_harness/standalone/T-1444350-*.sql` / `T-1444350-PTA-*.sql` (INC1444350) — extended
  it to the PTA path and is where the two bug fixes below were found

## What's in this folder

| File | Use for |
|---|---|
| `CVX_01_REGULAR_TIMESHEET_DELUXE_v2.sql` | New regular-timesheet test cases (`LCD.time_edits_validation`) |
| `CVX_02_PTA_TIMESHEET_DELUXE_v2.sql` | New PTA test cases (`LCD.time_edits_validation_pta`, CURRENT+ORIGINAL grids) |
| `_build_v2_regular.py` / `_build_v2_pta.py` | Regenerate the two files above from `../standalone/_extracted_body_{regular,pta}.sql` if the shared report body changes |

## Why a v2 exists

1. **Standalone-by-default.** Both v1 scripts already had zero `@@` include dependencies, but
   they were written as general-purpose *reporting tools* you edit and re-run, not as discrete,
   named *test cases* with a pass/fail verdict. v2 adds the same header block (Test / Category /
   Reason(s) / Expected / Org / Worker / Week ending) and closing **TEST VERDICT** banner that
   `T-AVCP-001.sql` and `T-1444350-*.sql` already use — so copying this file and filling in STEP 0
   produces a runnable test case, not just a report.
2. **Two real bugs fixed**, discovered while building the INC1444350 standalone tests against a
   live schema (see `docs/QUALITY_AUDIT_INC1444350.md` in the ticket's own `docs/` folder for the
   full audit trail):
   - `lcd.worker.profile` does not exist on this schema. v1 declares and selects it anyway; v2
     removes the column reference, the local variable, and the Worker Info row entirely.
   - `l_contractor` / `l_long_day` were `VARCHAR2(20)` in v1 — shorter than their own default
     literal (38 chars), which raised `ORA-06502` on `DECLARE` block entry for *every* org/worker
     before `BEGIN` ever ran. v2 widens both to `VARCHAR2(100)`.
3. **PTA-specific guidance preserved.** `CVX_02_PTA_TIMESHEET_DELUXE_v2.sql`'s header documents a
   finding that cost real investigation time on INC1444350: `msg_tally`-family validation logic
   (i.e., anything hooked into `tally()` rather than `ptally()` in a `PAYEDIT_PTA_*` package) can
   only ever see the CURRENT (`p_array_*`) timesheet — the ORIGINAL (`b_array_*`) grid is
   irrelevant to it, no matter what it contains. Future PTA test authors should check which tally
   procedure their target check is hooked into before assuming the ORIGINAL grid needs to differ
   from CURRENT — see the template's own header, item 3, for the exact grep to run.

## How to use

1. Copy the relevant template to a new file named for your ticket, e.g.
   `T-<TICKET>-<AREA>-<NNN>.sql` (regular) or `T-<TICKET>-PTA-<AREA>-<NNN>.sql` (PTA) — anywhere
   convenient, `cvx_deluxe_harness/standalone/` is the established location.
2. Fill in the `<EDIT ME>` header block and STEP 0's `DEFINE` values (test id, expected result,
   org/worker/week, edit type, timesheet lines — and for PTA, both CURRENT and ORIGINAL grids).
3. Open in SQL Developer, press F5 (Run Script). The file is fully self-contained — nothing else
   needs to travel with it.
4. Read the **TEST VERDICT** banner at the bottom of the output against the Simulation Output
   table above it.

## Regenerating after a body change

If the shared report body needs a fix (a third bug found later, a new card added, etc.), edit
`../standalone/_extracted_body_regular.sql` and/or `_extracted_body_pta.sql` — the same files
`gen_1444350_standalone.py` / `gen_1444350_pta_standalone.py` read from — then re-run:

```
cd cvx_deluxe_harness/v2
python _build_v2_regular.py
python _build_v2_pta.py
```

Do not hand-edit the STEP 1-5 body inside the two `CVX_*_v2.sql` files directly; it will drift
from the extracted source and from every test case already built against it.
