# Deployment Plan — INC1444350 MYSG OT-Standby Sep 2026 Changes

| | |
|---|---|
| **Change ID** | INC1444350 |
| **Date** | 09/13/2026 |
| **Author** | R. Wright (RWRIGHT28) |
| **Scope orgs** | Malaysia `A60`, Singapore `A00`, `A80` |
| **Patch plan** | `docs/PATCH_PLAN_INC1444350_MYSG_OT_STANDBY_SEP26.md` |
| **Quality audit** | `docs/QUALITY_AUDIT_INC1444350.md` |
| **Unit test plan** | `docs/UTP_INC1444350/00_UTP_INDEX.md` (50 standalone tests) |
| **Files deployed** | `PAYEDIT2A.SQL`, `PAYEDIT2C.SQL`, `PAYEDIT_PTA_2A.SQL`, `PAYEDIT_PTA_2C.SQL`, `UNIT_EDIT.bdy`, `TLS_TimeValidation.sql`, `insert_REASONCODES_INC1444350.sql` (all in `patched/`) |

---

## 1. Deployment order

Apply in this exact sequence — reason codes must exist before any patched package references
them, and each package must compile clean before the next depends on it:

1. **`insert_REASONCODES_INC1444350.sql`** — inserts reason codes 86000290-86000299 into
   `LCD.REASON_CODES` (one row per language code + org `999`/`574`) and the master `REASON_CODE`
   table. Run first; every subsequent package's `record_error(...)` calls for these codes would
   otherwise reference rows that don't exist yet (the calls themselves won't fail — `record_error`
   doesn't validate the code — but `lcd.f_reason_code_description` / `CATS_REASON_CODE_DESC`
   would return `?`/blank for any finding raised before this script runs).
2. **`TLS_TimeValidation.sql`** — updates `f_IsAvcpStandbyCode`'s code list to add `3130`/`3140`.
   Deploy before the PAYEDIT-family packages below: if a Malaysia Shift Activate row is submitted
   while this routing change is not yet live, it silently reaches only `UNIT_EDIT.VALIDATE`'s
   generic cap-only logic, not `msg_checks` — no error, just silently unenforced, which is a
   worse failure mode than a compile error would be. Deploying this first (before the checks that
   depend on it exist) is harmless; the new checks simply see zero matching rows until step 3-4
   land.
3. **`UNIT_EDIT.bdy`** — no dependency on the PAYEDIT-family packages (it's a self-contained
   port), so it can deploy in any order relative to step 4. Grouped here because, like step 2, its
   only prerequisite is step 1 (the reason codes existing).
4. **`PAYEDIT2A.SQL`, `PAYEDIT2C.SQL`, `PAYEDIT_PTA_2A.SQL`, `PAYEDIT_PTA_2C.SQL`** — the four
   structurally-identical package bodies carrying the `msg_checks` / `msg_ot_edit_exempt`
   changes. No inter-dependency between these four; deploy in any order, but all four must be
   live before UAT/smoke testing begins (a worker's timesheet can route through any of the four
   depending on org, edit type, and CATS vs. PTA — partial deployment across this set of four
   produces inconsistent behavior between call paths, not a hard failure).

No downtime is required — every statement is `CREATE OR REPLACE PACKAGE BODY` or a plain `INSERT`;
neither locks readers, and in-flight validation calls complete against whichever package version
was already in memory for that session.

## 2. Pre-deployment checklist

- [ ] Confirm target environment's current package source matches this ticket's `original/`
      snapshot **before** applying — diff `original/PAYEDIT2A.SQL` (etc.) against the target's
      live source to catch drift since this patch was designed (e.g. an unrelated hotfix landed
      on production after `original/` was captured on 2026-09-13). A mismatch doesn't
      automatically block deployment, but any injected line (`-- RdW 9/13/2026 INC1444350 ...`)
      landing at a different anchor than the patch plan documents needs a fresh review before
      proceeding, not a blind reapply.
- [ ] Confirm reason codes 86000290-86000299 are not already in use on the target environment
      (`SELECT * FROM lcd.reason_codes WHERE reason_code BETWEEN 86000290 AND 86000299` should
      return zero rows pre-deployment) — this patch assumed 86000289 was the highest code in use
      as of 2026-09-13; re-verify that assumption against the actual target, not this workspace.
- [ ] Confirm `A60`/`A00`/`A80` are still the correct org codes for Malaysia/Singapore on the
      target environment (org codes are environment-specific configuration, not hard-coded
      constants shared across all LCD instances).
- [ ] Back up the target's current package source (a `CREATE OR REPLACE` overwrites the prior
      version in place with no automatic history — capture it yourself before deploying, e.g. via
      `DBMS_METADATA.GET_DDL` per object, so the full back-out in §3 has something to restore).
- [ ] Confirm a maintenance/change window per your organization's standard change process — while
      no downtime is technically required (§1), a `CREATE OR REPLACE` on a package currently
      executing invalidates in-flight cursors referencing it; deploying during low-traffic hours
      is still the safer default even though it isn't a hard technical requirement.

## 3. Rollback procedure

See `docs/PATCH_PLAN_INC1444350_MYSG_OT_STANDBY_SEP26.md` §7 for the authoritative back-out
steps — do not duplicate them here, they are the single source of truth and this section only
points at them:

- **§7.1 Full back-out** — reverses every numbered change across all 6 files, in the reverse of
  the deployment order in §1 above (PAYEDIT-family + `UNIT_EDIT.bdy` first, then
  `TLS_TimeValidation.sql`'s routing change, then the reason-code inserts can be left in place —
  orphaned reason codes with no code path producing them are harmless).
- **§7.2 Selective (per-rule) back-out** — for rolling back just one of the four logical changes
  (MY Standby, MY Shift Activate, SG PH-gated OT, or the SG Check 286 widening) without touching
  the others, by block-commenting just that check's `IF`/`END IF` with a dated note — the
  INC1290667 modularity pattern this patch plan followed throughout.

If a rollback is needed **after** the reason-code insert script has run but **before** any
PAYEDIT-family file is deployed (i.e., only step 1 of §1 has landed), no rollback action is
needed at all — the new reason codes are simply unused until a later deployment attempt.

## 4. Post-deployment verification

Re-run the following subset of `docs/UTP_INC1444350/00_UTP_INDEX.md` as smoke tests against the
deployed environment — one representative test per new reason code (not the full 50-test matrix;
the full matrix is for pre-deployment validation, already covered by the quality audit and Phase
4 test development). Fill in a real `v_worker_id` for each org if the ones baked into these
scripts (`11514649` / `11500877`) don't exist on the target environment.

| Reason code | Regular-path smoke test | PTA-path smoke test |
|---|---|---|
| 86000290 | `T-1444350-MY-002.sql` | `T-1444350-PTA-MY-002.sql` |
| 86000291 | `T-1444350-MY-003.sql` | `T-1444350-PTA-MY-003.sql` |
| 86000292 | `T-1444350-MY-004.sql` | `T-1444350-PTA-MY-004.sql` |
| 86000293 | `T-1444350-MY-006.sql` | `T-1444350-PTA-MY-006.sql` |
| 86000294 | `T-1444350-MY-008.sql` | `T-1444350-PTA-MY-008.sql` |
| 86000295 | `T-1444350-MY-010.sql` | `T-1444350-PTA-MY-010.sql` |
| 86000296 | `T-1444350-MY-011.sql` | `T-1444350-PTA-MY-011.sql` |
| 86000297 + 86000298 | `T-1444350-MY-013.sql` | `T-1444350-PTA-MY-013.sql` |
| 86000299 | `T-1444350-SG-002.sql` | `T-1444350-PTA-SG-002.sql` |
| 86000286 (widened) | `T-1444350-SG-008.sql` | `T-1444350-PTA-SG-008.sql` |

Also re-run `T-1444350-SG-007.sql` / `T-1444350-PTA-SG-007.sql` (the org-`111` cross-org
regression) — substitute a real org-111 worker first, since these two ship with a `REPLACE_ME`
placeholder.

**What a pass looks like:** each script prints a `TEST VERDICT` banner at the end of its output.
Compare the **Simulation Output** table's findings against the banner's **Expected** line — a
pass means the listed reason code(s) appear and nothing else new/unexpected does. All listed
codes are validate-only (`msg_checks`), so `leave_check`/`future_check` noise from unrelated
absence types is expected background and not a failure by itself; only findings that contradict
the Expected line indicate a problem.

If any smoke test fails post-deployment but passed in this workspace pre-deployment, suspect
environment drift (see the pre-deployment checklist's first item) before suspecting the patch
itself — re-diff the deployed package source against `patched/` for the specific file involved.

## 5. Sign-off

| Role | Name | Criteria for sign-off |
|---|---|---|
| Author | R. Wright (RWRIGHT28) | Patch applied per plan; quality audit has no open findings (`docs/QUALITY_AUDIT_INC1444350.md` §1-§7 all pass) |
| Reviewer | *(assign before deployment)* | Independently re-reads `docs/PATCH_PLAN_INC1444350_MYSG_OT_STANDBY_SEP26.md` against the actual `patched/` diffs; confirms no unrelated logic was altered |
| UAT / Business | *(assign before deployment)* | Confirms the §4 smoke-test subset passes against the deployed environment, and that `T-1444350-SG-001`/`004` and their PTA equivalents (the SG PH-gated bypass) behave as expected against a real worker with live OT-break parameters, since that specific behavior could not be fully verified in this workspace (see `docs/QUALITY_AUDIT_INC1444350.md` §7) |

**"Done" means:** all rows in §4's smoke-test table pass on the deployed environment, the
pre-deployment checklist (§2) was completed and no drift was found (or drift was found, reviewed,
and the patch was re-verified against it), and all three sign-off rows above are checked off.
