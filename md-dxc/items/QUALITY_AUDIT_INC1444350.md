# Quality Audit — INC1444350 MYSG OT-Standby Sep 2026 Changes

**Date:** 09/13/2026 · **Auditor:** R. Wright (RWRIGHT28) · **Scope:** the 7 deliverable files under `tasks/98-SeptRel/patched/`

**Overall result: PASS.** No unresolved defects. One architectural limitation is documented (not a defect — see §4) and was a deliberate design decision confirmed during design review, not an oversight.

---

## 1. Structural integrity (IF/END IF, BEGIN/END balance)

Every patched file was diffed against its `original/` baseline and checked for balanced control structures. Net new `IF` statements must equal net new `END IF;` statements (a 2:1 ratio in the raw regex count below is expected and correct, since every `END IF;` token itself also matches the bare `IF` pattern once):

| File | New `IF` (raw) | New `END IF;` | New `BEGIN` | New `END;` | Balanced? |
|---|---:|---:|---:|---:|:-:|
| PAYEDIT2A.SQL | 28 | 14 | 0 | 0 | ✅ (28 = 2×14) |
| PAYEDIT2C.SQL | 28 | 14 | 0 | 0 | ✅ |
| PAYEDIT_PTA_2A.SQL | 28 | 14 | 0 | 0 | ✅ |
| PAYEDIT_PTA_2C.SQL | 28 | 14 | 0 | 0 | ✅ |
| UNIT_EDIT.bdy | 22 | 11 | 0 | 0 | ✅ (fewer — Check 295 correctly omitted here) |
| TLS_TimeValidation.sql | 0 | 0 | 0 | 0 | ✅ (string-list edit only, no new control flow) |
| CATS_Reason_Code_Description.sql | 0 | 0 | 0 | 0 | ✅ (untouched, as planned) |

No new `BEGIN`/`END;` pairs were needed anywhere — every new check was added as `IF`/`END IF;` blocks inside the pre-existing `msg_checks` procedure body (or, for the SG `msg_ot_edit_exempt` day-of-week helper, as new local variable declarations inside its existing `IS ... BEGIN` — no new procedure/function was created).

## 2. Variable-name collision check

Every new local variable (`l_my_sb_day`, `l_my_sb_week`, `l_3070_days`, `l_shift_act_day`, `l_shift_act_wk`, and the `l_dt`/`l_dow` added to `msg_ot_edit_exempt`) was grepped against the full `original/` baseline before use. No pre-existing declaration of any of these names was found in any of the 7 files. `l_dt`/`l_dow` are reused (not re-declared) inside `msg_checks` itself, where they already existed from the INC1276683 Standby day-of-week logic.

## 3. Surgical-edit confirmation

- Every injected line is tagged `-- RdW 9/13/2026 INC1444350 MYSG OT-Standby Sep 2026 Changes[: <detail>]`, per requirement (b).
- No existing `IF`/`END IF` body was rewritten except the two explicitly-planned widenings: `msg_ot_edit_exempt`'s Singapore `RETURN` (extended, old behavior for 3020/3040 preserved verbatim as the first two `OR` terms) and Check 286's guard condition (`(msg_day_3110+msg_day_3120)>0` → `l_sb_day>0`, where `l_sb_day` was already computed identically to the old expression plus `msg_day_3100`).
- Line counts grew by a consistent amount across the four structurally-identical PAYEDIT-family files (+216 / +210 / +210 / +210 lines; the +6 on `PAYEDIT2A.SQL` is exactly the four extra flowerbox lines plus two extra comment lines, verified), confirming the same edit set was applied everywhere with no file left behind or double-patched.
- `PAYEDIT2A.SQL`'s flowerbox received 4 new dated entries (one per logical change), per requirement (c). `PAYEDIT2C.SQL` and `PAYEDIT_PTA_2A/2C.SQL` were confirmed to have **no** flowerbox at all in this codebase (verified directly — they open with `create or replace PACKAGE BODY ...` or a placeholder `-- hey`), so requirement (c) does not apply to them; `UNIT_EDIT.bdy` and `TLS_TimeValidation.sql` each received one dated note appended to their own existing header comments instead.
- `insert_REASONCODES_INC1444350.sql` follows the exact structure of `templates/insert_REASONCODES_INC1138065.sql` / `insert_REASONCODES_INC1276683.sql`: one `LCD.REASON_CODES` insert per language code (`AS,AU,EN,IN,NW,NZ,PH,SA,SG,UK`) plus the Sweden `org_code='574'` `EN` row, a `commit;`, then one master `REASON_CODE` table insert, then `commit;` — repeated for all 10 new codes (86000290-86000299). Verified against `original/insert_REASONCODES.sql` that none of these 10 numbers are already in use (`grep` found `86000289` as the current highest reason code anywhere in the codebase).

## 4. Known, deliberate limitation — Check 295 is CATS/PTA-only

`UNIT_EDIT.bdy`'s `VALIDATE` procedure only ever receives unit-flagged rows (its caller,
`TLS_TimeValidation.sql`'s `f_IsUnit`/`f_IsAvcpStandbyCode` routing, pre-filters what reaches it).
PH code `8000` is an hours-type code, so it can never arrive in this package's `p_time_rec`
stream. Porting Check 295 ("3100 requires PH 8000 present the same day") into `UNIT_EDIT.bdy`
would therefore read an always-zero `msg_day_8000` and **misfire on every legitimate 3100 entry**
submitted through the `LCDUnitEdits`/`UNIT_VALIDATION` path — a false positive, not a false
negative, and one that would be silently wrong rather than loudly broken.

**Resolution:** Check 295 is implemented only in `pay_editA`/`pay_editC`(`_PTA`), which do see the
full timesheet including `8000`. `UNIT_EDIT.bdy` ports checks 290-294 and 296-298 (all of which
depend only on unit-flagged codes it can see) plus the widened 286. This is documented in three
places for future maintainers: the comment block above `msg_org_my` in `UNIT_EDIT.bdy`, the patch
plan (§3.8), and the UTP index's "Known coverage gap" section. This was raised and accepted during
design review, not discovered post-hoc — it does not require a follow-up ticket unless a genuine
`UNIT_EDIT.VALIDATE`-only entry path for Malaysia standby is found to exist in production (the
routing carve-out in `TLS_TimeValidation.sql` suggests it does not: MY's new codes are already
forced onto the CATS/PTA path the same way SG's codes are).

## 5. Confirmed intentional double-fires (not bugs)

Two pairs of checks are expected to fire together for the same underlying conflict, per explicit
confirmation during design review (GVR supports multiple reason codes per day):

- **86000286 + 86000288** — Shift Allowance and weekly Standby 3100 on the same day (widened per Sep'26 BRD slide 7).
- **86000297 + 86000298** — Shift Activate and MY Standby overlapping on the same day (which is necessarily also a same-week overlap).

Both are covered by dedicated UTP scripts (UTP-SG-008, UTP-MY-013) with both codes listed in the Expected column, so a future regression that drops either code from the pair will be caught.

## 6. Cross-org regression safety

`msg_in_scope` (the single entry gate for the whole MalaySing submodule, in every one of the 6
files) is unchanged — still `pg_org_code IN ('A00','A60','A80')`. Every new check is additionally
gated by `pg_org_code = msg_org_my` or `pg_org_code IN ('A00','A80')` inside that. UTP-SG-007
exercises org `111` reusing the same numeric codes and expects zero new-ticket errors, confirming
no cross-org leakage.

## 7. Items not independently re-verified in this audit

- The exact suppression of legacy `86000062`/`86000067` for SG 3010/3030 when the new PH-gated
  exemption applies depends on worker-specific OT break parameters (`worker_info.ot_daily_hours`,
  etc.) not modeled in the lightweight UTP harness calls. UTP-SG-001/004 note this explicitly;
  live UAT with a real A00/A80 worker record is needed to close this out, consistent with how the
  original INC1276683 UTP (`UTP-SG-010/011`) already handled the analogous 3020/3040 case.
- No compiler/`ALTER ... COMPILE` pass was run against a live Oracle instance (none is available
  in this workspace) — the structural checks in §1-§2 are the strongest verification available
  here. Recommend a `CREATE OR REPLACE` compile + `SHOW ERRORS` pass in a real environment before
  promotion, per standard practice for every prior MalaySing round in this codebase.
