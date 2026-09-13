# Quality Audit — INC1247772 Vietnam A01 OT Connect

Companion to [`PATCH_PLAN_INC1247772_VIETNAM_A01_OT.md`](PATCH_PLAN_INC1247772_VIETNAM_A01_OT.md). Covers the patch as applied to `patched/PAYEDIT2A.SQL`, `patched/PAYEDIT2C.SQL`, `patched/PAYEDIT_PTA_2A.SQL`, `patched/PAYEDIT_PTA_2C.SQL`, and `patched/insert_REASONCODES_INC1247772.sql` on 09/13/2026.

## 1. Structural balance

| File | Line delta (patched − original) | New `IF` tokens (incl. those inside `END IF`) | New `END IF` | New standalone `IF` (= total − `END IF`) | New `BEGIN` |
|---|---|---|---|---|---|
| `PAYEDIT2A.SQL` | +174 | +14 | +7 | +7 | +4 |
| `PAYEDIT2C.SQL` | +173 | +14 | +7 | +7 | +4 |
| `PAYEDIT_PTA_2A.SQL` | +184 | +14 | +7 | +7 | +4 |
| `PAYEDIT_PTA_2C.SQL` | +184 | +14 | +7 | +7 | +4 |

- **`IF`/`END IF` balance**: net-new `IF` (14) is exactly double net-new `END IF` (7) in all four files, confirming every new `IF` closes correctly (`END IF` itself contains the substring `IF`, so a word-boundary count of `IF` alone always double-counts a balanced file by exactly the `END IF` count). Manually accounted for: `vn_tally` contributes 2 `IF`/`END IF` pairs (`vn_in_scope` guard, day/hours validity guard); `vn_checks` contributes 5 (`vn_in_scope` guard + Checks 300/301/302/303) — 7 total, matching.
- **`BEGIN` balance**: 4 new `BEGIN` blocks per file, one each for `vn_in_scope`, `vn_clear`, `vn_tally`, `vn_checks` — matches the 4 new procedure/function bodies exactly.
- **Line-delta asymmetry explained**: `PAYEDIT2A.SQL` is +1 line over `PAYEDIT2C.SQL` (174 vs 173) due to the flowerbox entry added only to `PAYEDIT2A.SQL` (the only file of the four with a dated flowerbox history — verified before assuming, per the same check the INC1444350 precedent made). The PTA files (+184 each, after the mid-audit doc-comment correction below added 6 more lines to each) are longer than the non-PTA files due to additional documentation-only comment lines in `vn_tally`'s and `vn_checks`' header blocks explaining the `ptally()`-hook and PTA call-order nuances specific to those files (no functional code difference — verified by the identical `IF`/`END IF`/`BEGIN` deltas across all four files).
- **Post-initial-audit correction (9/13/2026, during Phase 4 UTP construction)**: while building PTA test cases, tracing the actual call graph revealed `calculate_deltas` (~L2377-3008) is called from the *outer*, PTA-aware `VALIDATE` overload (~L7270) — strictly *after* the *inner* CURRENT-only `VALIDATE` overload (which calls `msg_checks`/`vn_checks` at its own end, ~L7028) has already returned. The `vn_checks` docblock comment as first applied stated the opposite (that `vn_checks` ran *after* delta-substitution) — this was wrong and has been corrected in both `patched/PAYEDIT_PTA_2A.SQL` and `patched/PAYEDIT_PTA_2C.SQL`, along with the patch plan's §2, §3.6, and assumption A11. The correction is comment-only: `vn_checks`' actual logic (reading `total_day`/`total_day_vac`/`total_day_ot`/`total_day_hol`/`vn_day_*` as raw CURRENT-pass values) was always correct — only its own explanatory comment, and this audit's understanding of *why* that's correct, needed fixing. Re-ran the full structural verification (§1 above) after this comment-only edit; all deltas unchanged in kind (IF/END IF/BEGIN balance still exact), only the PTA files' line counts grew slightly further (comment lines only).

## 2. Variable/identifier collision check

Grepped every new identifier (`vn_org_vn`, `vn_day_2000`, `vn_day_2900`, `vn_day_8900`, `vn_day_1013`, `vn_in_scope`, `vn_clear`, `vn_tally`, `vn_checks`) against `original/PAYEDIT2A.SQL`, `original/PAYEDIT2C.SQL`, `original/PAYEDIT_PTA_2A.SQL`, `original/PAYEDIT_PTA_2C.SQL`, `original/UNIT_EDIT.bdy`, and `original/TLS_TimeValidation.sql` — **zero hits in all six files**. No collisions with any pre-existing package-level array, constant, function, or procedure name.

## 3. Reason code verification

- `grep -c "86000300\|86000301\|86000302\|86000303"` against all four `original/PAYEDIT*` files returns 0 — confirmed these codes did not exist in the pre-patch baseline.
- `grep -c "record_error.*86000300"` (and the same for 301/302/303) against each `patched/PAYEDIT*` file returns exactly 1 — each new code fires from exactly one `record_error` call site, in the intended file, with no accidental duplication. (Raw text-occurrence counts are higher in `PAYEDIT2A.SQL` for 86000300/86000303 specifically, +1 each — fully accounted for by the flowerbox entry's summary text "`errors 86000300-86000303`", not an extra functional call.)
- Reason codes 86000276 (INC1290674, re-applied) and 86000278 (INC1427475) are both below the new 86000300-303 range — no collision. Highest reason code in the patched baseline remains 86000299 until this ticket's insert script runs, after which it is 86000303.

## 4. Call-site wiring verification

Grepped each file for the three call-site patterns (`vn_clear;`, `vn_tally (p_time_rec);`, `vn_checks (p_error_count`) — each pattern matches exactly once per file (3 total per file), confirming all three hooks are wired into `validate()`/`tally()`/`clear_tables` and none are orphaned (declared + bodied but never invoked). `PROCEDURE vn_clear` (as a representative sample) appears exactly twice per file: once in the forward declaration, once in the body definition — the expected spec+body pair with no duplicate bodies.

## 5. Confirmed unaffected files

`diff -q` against `original/` shows **zero differences** for `UNIT_EDIT.bdy`, `TLS_TimeValidation.sql`, and `CATS_Reason_Code_Description.sql` — none were touched, consistent with the patch plan's assumptions A9/A10 (Vietnam's codes are all hours-type, so no unit-flagged routing path or `UNIT_EDIT.bdy` port is needed; the reason-code description function's existing `org_code='999'` fallback already covers the new codes without modification).

## 6. Deliberate scope decisions (not defects — cross-referenced to patch plan §6 Assumptions)

- **`A02` (also a Vietnam org) gets nothing from this patch** — `vn_in_scope` checks `pg_org_code = 'A01'` only, by explicit user decision (A1).
- **`2200`/`1011` are not blocked or specially handled** by any new check, despite carrying `ACTIVITY_GROUP='OT'`/`'REG'` for A01 today — by explicit user decision (A2), their removal is a config-side change outside this patch's scope. They do, however, fall inside Check 302's generalized `total_day_ot` block-detection bucket, so on a day already triggering the full-day-leave block, entries against 2200/1011 would also be counted (harmless side effect of the generalization the user explicitly requested).
- **BR-01's 4-hour cap does not apply to `1012` (weekend OT) or `1013` (PH OT)** — by explicit user decision (A3), grounded in the BRD addendum's own worked examples.
- **The PH-prerequisite check (Check 303) is not a separately numbered BR** in the governing BRD revision — included by explicit user direction (A7) since the BRD's own Eg.4 depends on it.

## 7. Not independently re-verifiable in this environment

- **No live Oracle compile was performed.** This is a text-level patch against flat `.SQL`/`.bdy` files with no local Oracle instance available; the structural checks above (IF/END IF/BEGIN balance, identifier collision, call-site wiring) are the strongest available substitute, but a `CREATE OR REPLACE PACKAGE BODY` compile against the real schema (confirming `lcd.pay_edit.hourstype`, `lcd.pay_edit.errorlinetype`, `lcd.pay_edit.ERRORNUMTYPE`, `worker_info.long_day`, and `record_error`'s signature all resolve exactly as assumed) has not been run and should be the first step of deployment testing.
- **`lcd.time_limits` was not queried directly** (no live DB access) — the patch plan's assumption that no pre-existing `org_code='A01'` rows in that table would double-fire alongside the new checks is inferred from the absence of any Vietnam-specific logic anywhere in the codebase, not from a direct query against that table.
- **The live `LCD.REASON_CODES`/`REASON_CODE` tables were not queried** to confirm 86000300-303 are still free at deployment time — the patch plan's verification is against the `original/*.SQL` package bodies and the `tables/LCD_REASON_CODE_P22_20260913.xlsx` snapshot only. Given the baseline has already drifted once this session (INC1290674's re-application), re-run the `grep -ohE '86000[0-9]{3}'` check immediately before deploying `insert_REASONCODES_INC1247772.sql`.

## Verdict

No open findings. All four patched files pass structural verification (balanced blocks, no collisions, correctly-wired call sites, exactly-once reason-code firing) and the three files determined out of scope are confirmed untouched. Proceed to Phase 4 (Unit Test Plan).
