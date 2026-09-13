# Deployment — INC1427475 Round 2: N05-Sweden Company Holiday Whole-Day Increments (86000278)

| Field | Value |
|---|---|
| **Ticket** | INC1427475 (round 2) |
| **Date** | 2026-09-13 |
| **Author** | R. Wright |
| **Artefact root** | `tasks/98-SeptRel/` |
| **Patched files** | `patched/PAYEDIT2A.SQL`, `patched/PAYEDIT2C.SQL`, `patched/PAYEDIT_PTA_2A.SQL`, `patched/PAYEDIT_PTA_2C.SQL` |
| **New scripts** | `patched/insert_REASONCODES_INC1427475.sql` (12 inserts + 2 commits) |
| **Predecessor (round 1)** | `tasks/87-SWE/v4b/INC1427475-SWE-TableInserts/insert_tables_8921_INC1427475.sql` — time type 8921 for N05 |

---

## 1. Deployment order

Apply in this exact order. Steps 1–2 may already be deployed (round 1); verify, don't assume.

| # | Script | Action | Why this position |
|---|---|---|---|
| 1 | *(round 1)* `insert_tables_8921_INC1427475.sql` | Verify time type 8921 exists for N05 (`SELECT att_abs_type, activity_group FROM lcd.att_abs_type WHERE org_code='N05' AND att_abs_type='8921';` → must return `8921 / PHL`). Deploy if absent. | Without 8921, no N05 PHL hours can ever be entered and Check 249 has nothing to act on. Check 249 is harmless without it (no PHL hours → no error). |
| 2 | `patched/insert_REASONCODES_INC1427475.sql` | Run in full (11 `LCD.REASON_CODES` rows + `commit;` + 1 master `REASON_CODE` row + `commit;`). Verify: `SELECT COUNT(*) FROM LCD.REASON_CODES WHERE REASON_CODE=86000278;` → **11**; `SELECT reason_desc FROM REASON_CODE WHERE REASON_CODE=86000278;` → 1 row. | Reason codes must exist **before** any patched package raises them, or `record_error` output and the CATS/UI description lookups resolve to nothing. |
| 3 | `patched/PAYEDIT2A.SQL` | Compile package body `lcd.pay_editA`. | Independent; contains the only flowerbox change and the headline Check 249. |
| 4 | `patched/PAYEDIT2C.SQL` | Compile package body `lcd.pay_editC`. | Independent of 2A. |
| 5 | `patched/PAYEDIT_PTA_2A.SQL` | Compile package body `lcd.pay_editA_PTA`. | Independent. |
| 6 | `patched/PAYEDIT_PTA_2C.SQL` | Compile package body `lcd.pay_editC_PTA`. | Independent. |

No cross-package recompilation is required: the four bodies reference no new objects, only the
pre-existing `record_error`/`worker_info`/`pg_org_code` symbols and the literal `86000278`
(reason codes are data, not compile-time dependencies). If the schema invalidates dependents on
body compile, let the standard recompile sweep run — nothing in this change affects specs.

**Not deployed by this ticket** (deliberately untouched, per the quality audit): `TLS_TimeValidation.sql`, `UNIT_EDIT.bdy`, `CATS_Reason_Code_Description.sql`.

## 2. Pre-deployment checklist

1. **Baseline drift check.** Diff the target environment's current source of each of the four
   PAYEDIT bodies against this ticket's `tasks/98-SeptRel/original/` snapshot **before applying**.
   Any difference means the environment has moved since 2026-09-13 — re-evaluate the patch
   anchors (Check 232 block tail + `-- RdW 7/29/2026 INC 1405279` comment) in the target's copy
   before deploying; do not blind-apply over drifted code.
2. **Reason-code allocation still free.** `SELECT COUNT(*) FROM REASON_CODE WHERE REASON_CODE=86000278;` → must be **0**. If not, another stream has taken the allocation since
   2026-09-13 — stop and re-plan the code number (audit trail: `QUALITY_AUDIT_INC1427475.md` §4).
3. **Round-1 presence.** `original/` contains round 1 (`86000277` CASE in Check 225) and
   INC1444350 (86000290–86000299). If the target lacks round 1, deploy it first (step 1) — the
   whole-day check is still safe to deploy (they are independent), but end-to-end behavior
   requires both.
4. **Flowerbox sanity (2A).** After compiling, confirm the new flowerbox line
   `09-13-2026 R. Wright: INC 1427475: ... (new reason code 86000278)` is present exactly once.
5. **Compile clean.** All four bodies must compile with zero errors/warnings (the quality audit
   could not run a live compile in the authoring environment — this is the first point a
   compiler sees the block; `USER_ERRORS` should be empty for all four objects).

## 3. Rollback procedure

Cross-referenced, not duplicated — see `PATCH_PLAN_INC1427475_SWE_COMPANY_HOLIDAY_WHOLEDAY.md` **§7**:

- **§7.1 Full back-out** — delete each file's `BEGIN`→`END` marker block (25 lines), remove the
  2A flowerbox line, optionally `DELETE` the 86000278 reason rows (harmless if left in place).
  `original/` is the file-level restore source if preferred.
- **§7.2 Selective back-out** — wrap just the Check 249 body in `/* ... */` with a dated note to
  disable the rule while keeping everything else (the established modularity pattern).

Rollback order is the reverse of deployment; reason-code rows may be deleted before or after the
package rollbacks (a raised-but-undefined code only affects message display, not validation
logic) — deleting them after is the safer sequencing.

## 4. Post-deployment verification (smoke tests)

Run this subset of `docs_INC1427475/UTP_INC1427475/` against the deployed environment — every new
reason code at least once, both paths, both regression families (see `00_UTP_INDEX.md` for the
full matrix and standing notes N1–N6; substitute real workers for `REPLACE_ME` first):

| Order | Test | Proves |
|---|---|---|
| 1 | `T-1427475-SWE-002.sql` | 86000278 fires (regular path / PAYEDIT2A) |
| 2 | `T-1427475-SWE-001.sql` | 86000278 stays silent for a valid full day (regular) |
| 3 | `T-1427475-SWE-004.sql` | Over-usage (9h) also fails — boundary semantics |
| 4 | `T-1427475-SWE-008.sql` | Cross-org: 86000232 preserved, 86000278 absent for non-N05 |
| 5 | `T-1427475-SWE-009.sql` | Round-1 86000277 behavior preserved |
| 6 | `T-1427475-PTA-SWE-002.sql` | 86000278 fires (PTA path / PAYEDIT_PTA_2C) |
| 7 | `T-1427475-PTA-SWE-001.sql` | 86000278 silent for a valid full day (PTA) |
| 8 | `T-1427475-PTA-SWE-006.sql` | Cross-org regression on the PTA path |

A **pass** = the script's closing `TEST VERDICT` banner agrees with its `Expected:` line against
the Simulation Output table (findings match expected, per the expected-result column and standing
notes in `00_UTP_INDEX.md`). Any mismatch — especially 86000278 firing for a non-N05 org
(SWE-008/PTA-006) or on a full valid day (SWE-001/PTA-001) — is a stop-and-rollback condition.

If the target is a production-like environment without the UTP harness's assumptions (e.g.
`ABS_EDIT` unknown for N05), run the regular-path subset first; the PTA subset requires STEP 3 of
each script to print the `pay_editC_PTA.leave_check` production route (standing note N5).

## 5. Sign-off

| Role | Name | Criteria |
|---|---|---|
| **Authored by** | R. Wright | Patch plan, quality audit, UTP, deployment doc complete (deliverables checklist below) |
| **Reviewed by** | _(assign)_ | Four patched bodies compile clean; diffs match patch plan §4 exactly (purely additive, +27/+28 lines); reason-code script matches template structure |
| **Accepted by** | _(assign)_ | All 8 smoke tests pass against the deployed environment; `QUALITY_AUDIT_INC1427475.md` has no open findings; live-compile caveat (audit §7.1) cleared by the step-2.5 compile check |

**Done** = reviewer + acceptor signed, smoke suite green, and this document's step-2 checks
recorded with actual counts (8921 present, 11 reason rows, 0 pre-existing 86000278).

### Deliverables checklist (playbook)

- [x] `original/` — untouched pre-patch baseline (4 PAYEDIT files)
- [x] `patched/` — 4 patched PAYEDIT files + `insert_REASONCODES_INC1427475.sql`
- [x] `docs_INC1427475/PATCH_PLAN_INC1427475_SWE_COMPANY_HOLIDAY_WHOLEDAY.md`
- [x] `docs_INC1427475/QUALITY_AUDIT_INC1427475.md`
- [x] `docs_INC1427475/UTP_INC1427475/00_UTP_INDEX.md` + 15 `T-1427475-*.sql` + 2 generators
- [x] `docs_INC1427475/DEPLOYMENT_INC1427475.md` (this document)
