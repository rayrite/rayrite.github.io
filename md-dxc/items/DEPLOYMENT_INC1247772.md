# Deployment Plan — INC1247772 Vietnam A01 OT Connect

| | |
|---|---|
| **Change ID** | INC1247772 |
| **Date** | 09/13/2026 |
| **Author** | R. Wright (RWRIGHT28) |
| **Scope orgs** | Vietnam `A01` only |
| **Patch plan** | `docs_INC1247772/PATCH_PLAN_INC1247772_VIETNAM_A01_OT.md` |
| **Quality audit** | `docs_INC1247772/QUALITY_AUDIT_INC1247772.md` |
| **Unit test plan** | `docs_INC1247772/UTP_INC1247772/00_UTP_INDEX.md` (34 standalone tests: 17 regular + 17 PTA) |
| **Files deployed** | `PAYEDIT2A.SQL`, `PAYEDIT2C.SQL`, `PAYEDIT_PTA_2A.SQL`, `PAYEDIT_PTA_2C.SQL`, `insert_REASONCODES_INC1247772.sql` (all in `patched/`). **Not deployed:** `UNIT_EDIT.bdy`, `TLS_TimeValidation.sql`, `CATS_Reason_Code_Description.sql` — confirmed unchanged by this ticket (see patch plan §2 / quality audit §5). |

---

## 1. Deployment order

Apply in this exact sequence — reason codes must exist before any patched package references
them, and each package must compile clean before UAT begins:

1. **`insert_REASONCODES_INC1247772.sql`** — inserts reason codes 86000300-86000303 into
   `LCD.REASON_CODES` (one row per language code + org `999`/`574`) and the master `REASON_CODE`
   table. Run first; every subsequent package's `record_error(...)` calls for these codes would
   otherwise reference rows that don't exist yet (the calls themselves won't fail — `record_error`
   doesn't validate the code — but `lcd.f_reason_code_description` / `CATS_REASON_CODE_DESC`
   would return `?`/blank for any finding raised before this script runs).
2. **`PAYEDIT2A.SQL`, `PAYEDIT2C.SQL`, `PAYEDIT_PTA_2A.SQL`, `PAYEDIT_PTA_2C.SQL`** — the four
   package bodies carrying the new `vn_in_scope`/`vn_clear`/`vn_tally`/`vn_checks` submodule. No
   inter-dependency between these four; deploy in any order, but all four must be live before
   UAT/smoke testing begins — a Vietnam worker's timesheet can route through any of the four
   depending on edit type and CATS vs. PTA, so partial deployment across this set produces
   inconsistent behavior between call paths, not a hard failure.

No downtime is required — every statement is `CREATE OR REPLACE PACKAGE BODY` or a plain `INSERT`;
neither locks readers, and in-flight validation calls complete against whichever package version
was already in memory for that session.

## 2. Pre-deployment checklist

- [ ] Confirm target environment's current package source matches this ticket's `original/`
      snapshot **before** applying — diff `original/PAYEDIT2A.SQL` (etc.) against the target's
      live source to catch drift since this patch was designed. This baseline already drifted
      **once during this ticket's own development** (the INC1290674 Sweden VAC re-application
      landed mid-session — see the patch plan's Revision History), so treat drift as an expected
      possibility, not an edge case: a mismatch doesn't automatically block deployment, but any
      injected line (`-- RdW 9/13/2026 INC1247772 ...`) landing at a different anchor than the
      patch plan documents needs a fresh review before proceeding, not a blind reapply.
- [ ] Confirm reason codes 86000300-86000303 are not already in use on the target environment
      (`SELECT * FROM lcd.reason_codes WHERE reason_code BETWEEN 86000300 AND 86000303` should
      return zero rows pre-deployment) — this patch assumed 86000299 was the highest code in use
      as of 2026-09-13 (re-confirmed after the INC1290674 drift above); re-verify that assumption
      against the actual target, not this workspace.
- [ ] Confirm `A01` is still the correct Vietnam org code on the target environment, and confirm
      the Vietnam-specific time codes (`1010`, `1012`, `1013`, `2000`, `2900`, `8000`, `8100`,
      `8900`) still carry the `ACTIVITY_GROUP` values this patch relies on for org `A01`
      specifically (`REG`/`OT`/`OT`/`OT`/`OT`/`HOL`/`VAC`/`LV` — verified against
      `tables/LCD_ATT_ABS_TYPE_P22_20260913.xlsx` in this workspace, not queried live against the
      target): `SELECT att_abs_type, activity_group FROM lcd.att_abs_type WHERE org_code = 'A01'
      AND att_abs_type IN ('1010','1012','1013','2000','2900','8000','8100','8900') ORDER BY
      att_abs_type;` — a mismatch here would change which checks fire, not just anchor lines.
- [ ] Confirm whether `2200` (Double Time) and `1011` (Hours GT 40) have been deactivated for
      `A01` per the BRD addendum's "Remove" decision (a separate, out-of-scope config change per
      this ticket's assumption A2) — if they're still active on the target, entries against them
      will still be swept into Check 302's generalized OT-group block-detection (harmless side
      effect, already documented), but confirm this is understood by the business side before
      deployment, not discovered afterward.
- [ ] Back up the target's current package source (a `CREATE OR REPLACE` overwrites the prior
      version in place with no automatic history — capture it yourself before deploying, e.g. via
      `DBMS_METADATA.GET_DDL` per object, so the full back-out in §3 has something to restore).
- [ ] Confirm a maintenance/change window per your organization's standard change process — while
      no downtime is technically required (§1), a `CREATE OR REPLACE` on a package currently
      executing invalidates in-flight cursors referencing it; deploying during low-traffic hours
      is still the safer default even though it isn't a hard technical requirement.

## 3. Rollback procedure

See `docs_INC1247772/PATCH_PLAN_INC1247772_VIETNAM_A01_OT.md` §8 for the authoritative back-out
steps — do not duplicate them here, they are the single source of truth and this section only
points at them:

- **§8.1 Full back-out** — reverses every numbered change across all 4 files (declarations,
  forward declarations, the `vn_*` module body, all three call sites, and the `PAYEDIT2A.SQL`
  flowerbox entry). No data, no pre-existing reason code, and no other org's logic is touched by
  this back-out.
- **§8.2 Selective (per-rule) back-out** — for rolling back just one of the four checks (BR-01,
  BR-02, BR-03, or the PH prerequisite) without touching the others, by block-commenting just that
  check's `IF`/`END IF` inside `vn_checks` with a dated note — the same modularity pattern the
  INC1290667/INC1444350 precedents established. If a rule's tally input is no longer read by any
  active check, leave the corresponding `vn_tally` arm in place regardless (harmless dead
  accumulation) — only remove it during a full back-out.

If a rollback is needed **after** the reason-code insert script has run but **before** any
`PAYEDIT*` file is deployed (i.e., only step 1 of §1 has landed), no rollback action is needed at
all — the new reason codes are simply unused until a later deployment attempt.

## 4. Post-deployment verification

Re-run the following subset of `docs_INC1247772/UTP_INC1247772/00_UTP_INDEX.md` as smoke tests
against the deployed environment — one representative test per new reason code (not the full
34-test matrix; the full matrix is for pre-deployment validation, already covered by the quality
audit and Phase 4 test development). Substitute a real `v_worker_id` if `1118838` doesn't exist
on the target environment.

| Reason code | Regular-path smoke test | PTA-path smoke test |
|---|---|---|
| 86000300 | `T-1247772-A01-002.sql` | `T-1247772-PTA-A01-002.sql` |
| 86000301 | `T-1247772-A01-006.sql` | `T-1247772-PTA-A01-006.sql` |
| 86000302 | `T-1247772-A01-010.sql` | `T-1247772-PTA-A01-010.sql` |
| 86000303 | `T-1247772-A01-014.sql` | `T-1247772-PTA-A01-014.sql` |

Also re-run `T-1247772-A01-017.sql` / `T-1247772-PTA-A01-017.sql` (the org-`111` cross-org
regression) — substitute a real org-111 worker first, since these two ship with a `REPLACE_ME`
placeholder.

**What a pass looks like:** each script prints a `TEST VERDICT` banner at the end of its output.
Compare the **Simulation Output** table's findings against the banner's **Expected** line — a
pass means the listed reason code(s) appear and nothing else new/unexpected does. These checks run
inside `validate()` itself (`vn_checks`), not `leave_check`/`future_check`, so unrelated
absence-type findings from those two are expected background and not a failure by itself; only
findings that contradict the Expected line indicate a problem.

If any smoke test fails post-deployment but passed in this workspace pre-deployment, suspect
environment drift (see the pre-deployment checklist's first and third items) before suspecting the
patch itself — re-diff the deployed package source against `patched/` for the specific file
involved, and re-confirm the target's live `ACTIVITY_GROUP` values for the 8 Vietnam time codes
still match what this patch assumed.

## 5. Sign-off

| Role | Name | Criteria for sign-off |
|---|---|---|
| Author | R. Wright (RWRIGHT28) | Patch applied per plan; quality audit has no open findings (`docs_INC1247772/QUALITY_AUDIT_INC1247772.md` §1-§7 all pass) |
| Reviewer | *(assign before deployment)* | Independently re-reads `docs_INC1247772/PATCH_PLAN_INC1247772_VIETNAM_A01_OT.md` against the actual `patched/` diffs; confirms no unrelated logic was altered; independently re-verifies the PTA call-graph correction in patch plan §2 against the deployed source, since that correction was found and applied mid-ticket |
| UAT / Business | *(assign before deployment)* | Confirms the §4 smoke-test subset passes against the deployed environment; confirms with the business side (Ngyuet / Shelby Kee's team, per the BRD addendum) whether `2200`/`1011` deactivation for `A01` has actually landed, since this patch deliberately does not enforce their removal in code |

**"Done" means:** all rows in §4's smoke-test table pass on the deployed environment, the
pre-deployment checklist (§2) was completed and no drift was found (or drift was found, reviewed,
and the patch was re-verified against it), and all three sign-off rows above are checked off.
