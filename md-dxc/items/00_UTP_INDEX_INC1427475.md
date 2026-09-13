# UTP Index — INC1427475 Round 2: N05-Sweden Company Holiday Whole-Day Increments (86000278)

| Field | Value |
|---|---|
| **Ticket** | INC1427475 (round 2 — Check 249, reason code `86000278`) |
| **Date** | 2026-09-13 |
| **Code under test** | New Check 249 in `PAYEDIT2A.SQL` / `PAYEDIT2C.SQL` / `PAYEDIT_PTA_2A.SQL` / `PAYEDIT_PTA_2C.SQL` (`tasks/98-SeptRel/patched/`) |
| **Rule** | Org `N05`: PHL-bucket hours (time type 8921) per day must be 0 or exactly `worker_info.long_day`; any other positive amount raises `86000278` |
| **Templates** | `cvx_deluxe_harness/CVX_01_REGULAR_TIMESHEET_DELUXE_v2.sql` (regular), `cvx_deluxe_harness/CVX_02_PTA_TIMESHEET_DELUXE_v2.sql` (PTA) |
| **Generators** | `gen_1427475_standalone.py` (9 regular), `gen_1427475_pta_standalone.py` (6 PTA) — re-run to regenerate all `.sql` files below |
| **Test count** | 15 (9 regular + 6 PTA) |

**How to run:** substitute real worker ids for `REPLACE_ME` (lookup queries are in each script's
Prerequisites block), open in SQL Developer, press F5 (Run Script). Each script is standalone,
read-only, and ends in `ROLLBACK`. Judge each run from the **TEST VERDICT** banner at the bottom
against the **Simulation Output** table above it.

**Week-ending dates** (playbook Phase 4.3): regular tests use **2026-09-18** (nearest upcoming
Friday from 2026-09-13); PTA tests use **2026-08-21** (a Friday ≥ 14 days before today, matched
to the INC1444350 PTA set for diffability). Each script's STEP 3 prints a warning if the
configured date is not a Friday.

## Standing notes (referenced as [N1]–[N6] in the Expected Result column)

| # | Note |
|---|---|
| **N1** | **PHL balance co-fire (pre-existing, out of scope).** Available PHL = `lcd.worker.phl_bal_hrs` + `LCD.ORG_PARAM.PHL_HRS_BORROW_LIMIT` (0 for N05 per round-1 config). If a test worker's balance < charged PHL hours, Check 225 adds `86000277` (N05) / `86000225` (other orgs) rows. That is round-1/pre-existing behavior — the assertions in this UTP concern `86000278` (and the named regression codes) only. For Interior tests pick a worker with `phl_bal_hrs >= 8`; for T-1427475-SWE-009 pick one with none. |
| **N2** | **long_day assumed 8.00** (`lcd.worker_hist.wk1_long_day`). The Worker Info card prints the live value ("Long Day (hrs)") — verify it before judging; if it differs, re-derive the day-level expectations with that value (the pass/fail structure is unchanged). |
| **N3** | **ABSENCE_INCREMENT assumed 1** (N05 NVL default). `MOD(x,1) <> 0` only for fractional hours, so `86000101` co-fires only in fractional-hour scenarios. If a test worker carries a different increment, `86000101` may appear in more rows; `86000278`'s own firing is unaffected. |
| **N4** | **Round-1 prerequisite.** Time type 8921 must exist for N05 in `LCD.ATT_ABS_TYPE` (round-1 inserts: `tasks/87-SWE/v4b/INC1427475-SWE-TableInserts/insert_tables_8921_INC1427475.sql`). Without it, 8921 lines fail code validation before any Check-249 assertion. |
| **N5** | **PTA route prerequisite.** Edit type `'C'` reaches `pay_editC_PTA.leave_check` only when `ABS_EDIT='Y'` is in effect for the org (`lcd.support_systems`). STEP 3 of each PTA script prints the effective route — verify it says `lcd.pay_editC_PTA.leave_check   <== production route` before judging; if it prints SKIPPED, resolve the org's ABS_EDIT setting first. |
| **N6** | **REPLACE_ME workers.** No real N05 or org-663 worker id is recorded in any prior-round doc; each script embeds its own lookup query. The scenarios are worker-independent given N1–N3 hold. |

## Regular-timesheet tests — `T-1427475-SWE-NNN.sql` (edit type 'I' → `pay_editA.leave_check` = PAYEDIT2A Check 249)

| ID | File | Category | Scenario (N05, week ending 2026-09-18) | **Expected Result** |
|---|---|---|---|---|
| T-1427475-SWE-001 | `T-1427475-SWE-001.sql` | Interior | 8921 = 8.00 Mon (exactly `long_day`) | **(none) for 86000278** — full-day Company Holiday is valid. `86000277` may co-fire if `phl_bal_hrs < 8` [N1][N2] |
| T-1427475-SWE-002 | `T-1427475-SWE-002.sql` | Exterior | 8921 = 4.00 Mon (classic half day, whole hours) | **86000278 raised on Monday only.** `86000101` NOT raised — `MOD(4,1)=0` with increment 1 [N3]. `86000277` may co-fire [N1] |
| T-1427475-SWE-003 | `T-1427475-SWE-003.sql` | Boundary | 8921 = 7.50 Mon (`long_day` − 0.5, fractional) | **86000278 AND 86000101 both raised on Monday** — the user-accepted dual-fire (same overlap as India Check 232). `86000277` may co-fire [N1] |
| T-1427475-SWE-004 | `T-1427475-SWE-004.sql` | Boundary | 8921 = 9.00 Mon (whole hours, **more than** `long_day`) | **86000278 raised on Monday only** — the `<>` comparison fails over-usage too, not just under-usage. `86000101` NOT raised (`MOD(9,1)=0`) [N3]. `86000277` may co-fire [N1] |
| T-1427475-SWE-005 | `T-1427475-SWE-005.sql` | Interior | 1010 (REGULAR HOURS) = 8.00 Mon; no PHL hours anywhere | **(none) for 86000278** — zero PHL hours on every day passes; the check stays silent when Company Holiday is not used |
| T-1427475-SWE-006 | `T-1427475-SWE-006.sql` | Edge | One 8921 line: 8.00 Mon + 4.00 Wed (valid day + invalid day, same week) | **86000278 raised on Wednesday ONLY** — per-day granularity (Monday's full day passes; no week-level coupling). `86000277` may co-fire on Wednesday [N1] |
| T-1427475-SWE-007 | `T-1427475-SWE-007.sql` | Edge | 8921 = 4.00 Mon on line 1 + 8921 = 4.00 Mon on line 2 (split half-days summing to `long_day`) | **(none) for 86000278** — Check 249 evaluates the day-bucket SUM (4+4 = 8.00), not each line. Any duplicate-time-type finding from `validate` is out of scope; the assertion is the absence of 86000278 [N1] |
| T-1427475-SWE-008 | `T-1427475-SWE-008.sql` | Edge (cross-org regression) | Org **663** (India family, INR): 8000 = 4.00 Mon — same PHL bucket, non-N05 org | **86000232 raised on Monday** (pre-existing India Check 232 preserved); **86000278 NOT raised** (Check 249 org-gated to N05). `86000225` may co-fire [N1]. Worker must be INR-paid [N6] |
| T-1427475-SWE-009 | `T-1427475-SWE-009.sql` | Edge (round-1 regression) | 8921 = 8.00 Mon, worker with `phl_bal_hrs < 8` | **86000277 raised on Monday** (round-1 balance behavior preserved for N05); **86000278 NOT raised** (whole-day satisfied) [N1] |

## PTA tests — `T-1427475-PTA-SWE-NNN.sql` (edit type 'C' → `pay_editC_PTA.leave_check` = PAYEDIT_PTA_2C Check 249)

ORIGINAL ("b_") grid is identical to CURRENT ("p_") in every PTA test — a no-op baseline that
isolates the finding from leave-check delta noise (v2 PTA template guidance).

| ID | File | Category | Scenario (week ending 2026-08-21) | **Expected Result** |
|---|---|---|---|---|
| T-1427475-PTA-SWE-001 | `T-1427475-PTA-SWE-001.sql` | Interior | CURRENT 8921 = 8.00 Mon | **(none) for 86000278** — full-day usage on a prior-timesheet adjustment is valid. `86000277` may co-fire [N1]. Route prereq [N5] |
| T-1427475-PTA-SWE-002 | `T-1427475-PTA-SWE-002.sql` | Exterior | CURRENT 8921 = 4.00 Mon (half day adjusted onto a prior timesheet) | **86000278 raised on Monday** — the whole-day rule governs prior-timesheet adjustments too. `86000101` NOT raised [N3]. `86000277` may co-fire [N1]. Route prereq [N5] |
| T-1427475-PTA-SWE-003 | `T-1427475-PTA-SWE-003.sql` | Boundary | CURRENT 8921 = 9.00 Mon (whole hours > `long_day`) | **86000278 raised on Monday only** — over-usage fails on the PTA path exactly as on the regular path (SWE-004). `86000101` NOT raised [N3]. Route prereq [N5] |
| T-1427475-PTA-SWE-004 | `T-1427475-PTA-SWE-004.sql` | Edge | CURRENT one 8921 line: 8.00 Mon + 4.00 Wed | **86000278 raised on Wednesday ONLY** — per-day granularity on the PTA path. `86000277` may co-fire on Wednesday [N1]. Route prereq [N5] |
| T-1427475-PTA-SWE-005 | `T-1427475-PTA-SWE-005.sql` | Edge | CURRENT one 8921 line: 4.00 Mon + 4.00 Wed (two bad days) | **86000278 raised on BOTH Monday and Wednesday** (two findings, one per violated day) — no per-day dedup swallows the second day. Route prereq [N5] |
| T-1427475-PTA-SWE-006 | `T-1427475-PTA-SWE-006.sql` | Edge (cross-org regression) | Org **663** (INR): CURRENT 8000 = 4.00 Mon | **86000232 raised on Monday** (Check 232 preserved on the PTA path); **86000278 NOT raised**. `86000225` may co-fire [N1]. Route prereq [N5] |

## Coverage matrix (playbook Phase 4.2)

| Category | 86000278 evidence |
|---|---|
| Interior | SWE-001 (exactly `long_day`), SWE-005 (zero PHL hours), PTA-SWE-001 |
| Exterior | SWE-002 (half day), PTA-SWE-002 |
| Boundary | SWE-003 (`long_day` − 0.5, fractional → dual-fire), SWE-004 (`long_day` + 1, over-usage), PTA-SWE-003 |
| Edge | SWE-006 (mixed days, granularity), SWE-007 (split lines summing to a whole day — bucket semantics), PTA-SWE-004/005 (multi-day), PTA route itself |
| Cross-org regression | SWE-008, PTA-SWE-006 (India org 663, PHL bucket, non-N05: Check 232 preserved, no new code) |
| Existing-check regression | SWE-008/PTA-SWE-006 (Check 232 / 86000232), SWE-009 (round-1 86000277), SWE-003 (generic 86000101 overlap behaves as accepted) |

**Package coverage:** regular set exercises `PAYEDIT2A` (edit 'I' → `pay_editA.leave_check`);
PTA set exercises `PAYEDIT_PTA_2C` (edit 'C' → `pay_editC_PTA.leave_check`). `PAYEDIT2C` and
`PAYEDIT_PTA_2A` received the byte-identical Check 249 block (verified in
`QUALITY_AUDIT_INC1427475.md` §1); `PAYEDIT2C`'s own CATS route is only reachable for
`ABS_EDIT='Y'` orgs via the regular path — if N05's `ABS_EDIT` is 'Y', re-running any SWE-002
scenario with `v_edit_type='C'` covers it in one keystroke (STEP 3 prints the taken route).

## Generator self-checks (both generators, run 2026-09-13)

Each emitted file is verified for: no unresolved `@@` includes; no unresolved template
placeholders (`EDIT ME`, `<TICKET>`, `<AREA>`, `<NNN>`); no `l_profile` reference (v2 bug a);
`l_contractor`/`l_long_day` declared `VARCHAR2(100)` and no `VARCHAR2(20) :=` initializer
(v2 bug b); `ROLLBACK` present; PL/SQL `/`-terminator count matches the template body exactly;
STEP 0 `DEFINE` set identical across all files of the same harness. All 15 files passed.

## Regeneration

```
cd docs_INC1427475/UTP_INC1427475
python gen_1427475_standalone.py      # 9 regular tests
python gen_1427475_pta_standalone.py  # 6 PTA tests
```

The generators read the shared report body directly from the v2 templates (flattened into
`cvx_deluxe_harness/`, no `v2/` subfolder) — a template fix is picked up on re-run; do not
hand-edit the STEP 1–5 body inside the emitted test files.
