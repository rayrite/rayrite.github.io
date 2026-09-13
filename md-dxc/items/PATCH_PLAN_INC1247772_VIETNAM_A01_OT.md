# Patch Plan — INC1247772 Vietnam A01 OT Connect

| | |
|---|---|
| **Change ID** | INC1247772 "Vietnam A01 OT Connect" |
| **Date** | 09/13/2026 (anchors re-verified and revised 09/13/2026 — see Revision History below) |
| **Author** | R. Wright (RWRIGHT28) |
| **Scope orgs** | Vietnam `A01` only (org `A02` explicitly excluded — out of scope per user decision) |
| **BRD source** | `tasks/98-SeptRel/VIETNAM_1247772_BRD_20260904.md`, sections 5.1–5.2 (BR-01, BR-02, BR-03) plus the 9/4/2026 addendum ("Vietnam Overtime Restriction Requirement for etes 2026Sep4.docx" / Shelby Kee email thread). Sections 3.2, 4.2 (monthly/annual limits), 5.3–5.6 (monthly/annual monitoring, WBS eligibility, Egypt/multi-client calendars, account switching) and the Reports section do **not** appear in this BRD revision at all and are explicitly out of scope for this ticket per user direction. |
| **New reason codes** | 86000300 – 86000303 (re-confirmed free as of the 09/13/2026 revision — see Revision History) |
| **Files** | `patched/PAYEDIT2A.SQL`, `patched/PAYEDIT2C.SQL`, `patched/PAYEDIT_PTA_2A.SQL`, `patched/PAYEDIT_PTA_2C.SQL` |
| **Base version** | The scripts in `original/` (current baseline includes INC1276683 MalaySing Aug 2026 BRD through INC1444350's MYSG OT-Standby Sep 2026 Changes, reason codes through 86000299, **plus the INC1290674 Sweden VAC full-day-increment re-application** (Check 276) added to all 4 PAYEDIT files after this plan's first draft — re-confirmed live in the actual package bodies via `grep -ohE '86000[0-9]{3}'` across `original/*.SQL` on 9/13/2026, independent of which reason-code insert script happens to be present in the folder at any given time) |
| **Comment tag** | `-- RdW 9/13/2026 INC1247772 Vietnam A01 OT Connect: <detail>` on every injected line/block |
| **Modularity precedent** | INC1276683/INC1444350's `msg_*` MalaySing submodule (`msg_in_scope` / `msg_clear` / `msg_tally` / `msg_checks`, forward-declared once, bodies grouped together, ending at the `-- END INC1276683 BRD MODULE BODY` marker in each file). This ticket adds a parallel, fully independent `vn_*` submodule following the exact same shape, so it can be selectively disabled without touching the MalaySing module or vice versa. |
| **Reference codebases** | `LCD-Oracle/SQL/PAYEDIT2A.SQL` should be confirmed byte-identical to `original/PAYEDIT2A.SQL` before applying (standard pre-flight check — see §8.2 of the deployment doc, not yet written). Per standing instruction, **no edits are made to `LCD-Oracle/` or `eTESWin2008/`** — all work happens in `tasks/98-SeptRel/patched/`. |
| **Companion deliverables** | Reason-code insert script: `patched/insert_REASONCODES_INC1247772.sql` (template/format: `templates/insert_REASONCODES_INC1138065.sql`, most recently followed by `original/insert_REASONCODES_INC1427475.sql` and `original/insert_REASONCODES_INC1290674.sql`). Unit test plan: `docs_INC1247772/UTP_INC1247772/00_UTP_INDEX.md` (not yet written). Quality audit: `docs_INC1247772/QUALITY_AUDIT_INC1247772.md` (not yet written). This document is the per-script patch plan (§5 gives the exact anchor/change table for each of the 4 files individually). |

### Revision History

| Date | Change |
|---|---|
| 09/13/2026 (initial) | First draft, anchors taken against the `original/` baseline as it stood at the time. |
| 09/13/2026 (revision 1) | `patched/` re-confirmed still byte-identical to `original/` (no edits had been started, safe to revise in place). `original/*.PAYEDIT*` scripts had changed since the initial draft: the INC1290674 Sweden VAC full-day-increment check was re-applied (its back-out had left reason code 86000276 behind in the master `REASON_CODE` table; `insert_REASONCODES_INC1290674.sql` re-applies it idempotently), adding ~54-56 lines to each of the 4 PAYEDIT files. Re-ran every anchor grep in §5: `PAYEDIT2A.SQL`'s anchors all shifted by **+1 line** (one line added above them, before its `msg_day_3140` declaration — consistent with it being the one file with a dated flowerbox history at the top). `PAYEDIT2C.SQL`, `PAYEDIT_PTA_2A.SQL`, and `PAYEDIT_PTA_2C.SQL` anchors are **unchanged** (the added Check 276 content in those files lands after all of this plan's anchor points). Re-confirmed highest reason code is still 86000299 (86000276 is below the planned 86000300-303 range — no collision) and re-confirmed `CATS_Reason_Code_Description.sql`/`TLS_TimeValidation.sql`/`UNIT_EDIT.bdy` are byte-for-byte unchanged (same line counts as the initial draft), so §2's conclusions about those three files still hold without re-verification. §5's table below reflects the corrected `PAYEDIT2A.SQL` anchors. |

---

## 1. Requirement

Three numbered rules from the Sep 4 2026 BRD (5.2), refined by the same day's addendum (time-code decision table + 4 worked examples from Shelby Kee's team), plus one unnumbered rule the addendum's own example depends on that the user directed be implemented as if part of BR-01/BR-02's intent. All four are layered onto Vietnam org `A01` only, as a new, fully independent `vn_*` submodule — no existing MalaySing, India, or other org-specific logic is touched.

**Time codes in play** (confirmed against the live `A01` `ATT_ABS_TYPE` config, `tables/LCD_ATT_ABS_TYPE_P22_20260913.xlsx`):

| Code | Description | `ACTIVITY_GROUP` | Role |
|---|---|---|---|
| 1010 | Regular Time | REG | baseline working hours |
| 2000 | Overtime @1.5 | OT | workday OT |
| 1012 | Overtime @2.0 | OT | weekend OT |
| 1013 | Overtime @3.0 | OT | Public Holiday OT |
| 2900 | Bank Time | OT | OT-equivalent compensation |
| 8000 | Public Holiday | HOL | prerequisite for 1013 |
| 8100 | Annual Leave | VAC | full/half-day leave |
| 8900 | Personal Leave | LV | full/half-day leave |

`2200` (Double Time) and `1011` (Hours GT 40) are also configured for `A01` today under `ACTIVITY_GROUP='OT'`/`'REG'` respectively, per the addendum's decision table marking both "Remove" — **per user direction, no PAYEDIT code change addresses this; deactivation is a data/config change outside this patch.** `0460` ("Overtime for quota hours") is not configured for `A01` at all — nothing to do.

| # | Rule | Trigger condition | Codes | New reason code |
|---|---|---|---|---|
| 1 | BR-01 | Overtime (2000) + Bank Time (2900) combined exceed 4 hours in a day | 2000, 2900 | 86000300 |
| 2 | BR-02 | Total daily hours across every code exceed 12 in a day | all (reuses the existing all-codes daily total) | 86000301 |
| 3 | BR-03 | A full day (or combined full-day) of Annual Leave (8100) and/or Personal Leave (8900) blocks any entry against the whole OT activity group that day | 8100, 8900 (trigger) vs. 2000/1012/1013/2900/2200/1011 (blocked, generalized as "the OT group") | 86000302 |
| 4 | (implicit, PH prerequisite) | Public Holiday OT (1013) requires Public Holiday (8000) present the same day | 1013, 8000 | 86000303 |

### 1.1 Design decisions confirmed with the user (see §6 Assumptions for full rationale)

- Org scope: `A01` only, not `A02`.
- BR-01's 4-hour cap applies **only** to 2000+2900 combined — **not** to 1012 (weekend OT) or 1013 (PH OT), which per the BRD's own Eg.3/Eg.4 may run up to the full 12-hour day cap directly, with no separate 4-hour sub-limit.
- BR-02's 12-hour cap includes **every** code entered that day (1010, all OT-family codes, 8000, 8100, 8900) — confirmed via Eg.1 (`1010:4h + AL-or-BankTime:4h + OT:max4h = 12h`) and the final answer that PH (8000) hours count toward the cap.
- BR-03's full-day/half-day threshold is `worker_info.long_day` (existing per-worker field, already used this way for every other leave-daily-max check in these files) for "full day," and implicitly `long_day / 2` for "half day" (the BRD's own 8h/4h worked examples are consistent with `long_day = 8`).
- BR-03's trigger is 8100 and/or 8900 only (**not** 2900) reaching `long_day`, either alone or combined. Bank Time (2900) does **not** count toward the full-day trigger.
- BR-03's blocked set, once triggered, is generalized to the entire OT `ACTIVITY_GROUP` (2000/1012/1013/2900/2200/1011) rather than enumerated individually — reuses the existing generic `total_day_ot` bucket for the block-detection side.
- The PH-prerequisite check (1013 requires 8000 same day) is in scope, per explicit user direction, even though it is not a separately numbered BR in this BRD revision.
- BR-04 through BR-13 from the original (superseded) BRD draft — monthly/annual caps, WBS eligibility, Egypt/multi-client calendars, PTA 90-day window, alerts/reports — are **not present in this BRD revision** and are out of scope for this ticket.

---

## 2. Current (as-is) behavior

- **No existing Vietnam-specific logic anywhere** in any of the four files, `UNIT_EDIT.bdy`, or `TLS_TimeValidation.sql` — confirmed via `grep -i "A01\|Vietnam\|VN"` across `original/`. This is a greenfield module, unlike the MalaySing precedent (no dual-purpose-code collisions to route around).
- **`tally()`'s generic activity-group accumulation** (`PAYEDIT2A.SQL` ~L1101-1210, logic-identical in the other 3 files at different offsets) already populates, for *every* org unconditionally, from the `f_activity_type()` lookup against `ACTIVITY_GROUP`:
  - `total_day (cnt)` — sum of every hours-type code entered that day, regardless of group (used directly for BR-02; no new tally hook needed).
  - `total_day_reg (cnt)` — REG group (1010 + 1011 for `A01`).
  - `total_day_ot (cnt)` — OT group (2000 + 1012 + 1013 + 2900 + 2200 + 1011 for `A01` — confirmed via the same live config export; used directly for BR-03's block-detection side).
  - `total_day_vac (cnt)` — VAC group. **Confirmed unique to 8100 for `A01`** (no other `A01` code shares `ACTIVITY_GROUP='VAC'`) — safe to reuse directly for BR-03's Annual Leave side.
  - `total_day_hol (cnt)` — HOL group. **Confirmed unique to 8000 for `A01`** — safe to reuse directly for the PH-prerequisite check.
  - `total_day_lv (cnt)` — LV group. **Confirmed shared by 14 different `A01` leave codes** (8900 Personal Leave, 8370 Examination, 8640 Maternity, 8610 Hospital, 8648 Garden, `84SL` Subcon, 8650 Volunteer, 8381 Marriage, 8380 Company Trip, 8902 Special, 8643 Paternity, 8646 Childcare, 8300 Bereavement, 8911 Bench/Buffer, 8350 Military) — **not safe to reuse** for a Personal-Leave-specific check; a dedicated `vn_day_8900` array is required.
- **`worker_info.long_day`** — existing per-worker field (sourced from `lcd.worker_hist`, populated in `f_worker_info`), already used unconditionally throughout `validate()` as the "full day" threshold for numerous existing leave-type daily-maximum checks (e.g. Check 2/86000002, Check 86, Check 9/86000009, Check 35). No new sourcing needed.
- **`PAYEDIT_PTA_2A.SQL`/`PAYEDIT_PTA_2C.SQL` delta-substitution lives in a separate procedure, `calculate_deltas` (~L2377-3008), and runs *after* `msg_checks`/`vn_checks`, not before.** Traced the actual call graph (correcting an earlier draft of this plan, which had this backwards): the PTA-aware `VALIDATE` overload (~L7158) first calls the inner, CURRENT-only `VALIDATE` overload (~L1053-7039, which runs `tally()` over the CURRENT/`p_array_*` grid and, at its very end, calls `msg_checks`/`vn_checks`) — **only after that inner call returns** does the outer procedure conditionally (`IF b_modb = 'B'`) run `ptally()` over the ORIGINAL/`b_array_*` grid and then call `calculate_deltas` (~L7270), which is what overwrites `total_day`/`total_day_vac`/`total_day_ot`/`total_day_hol` with `(new_pass − prior_pass)`, floored at 0. Those delta-substituted values are consumed by `leave_check` (a separate procedure, called later still by the outer PTA flow), not by anything inside `VALIDATE`. **Net effect: `msg_checks` and `vn_checks` always read the raw, non-delta CURRENT-pass totals in every one of the 4 patched files, identically, regardless of PTA vs. regular path or whether an ORIGINAL grid is supplied.** This is simpler than originally documented and needs no special test-design accommodation for the PTA path (§7's UTP note updated accordingly).
- **`msg_tally` is hooked into `tally()` only, not `ptally()`** (confirmed via the existing comment in `PAYEDIT_PTA_2A.SQL`/`PAYEDIT_PTA_2C.SQL` ~L1752: "Unlike tally() above, ptally() has NO msg_tally()-style hook"). The new `vn_tally` will be hooked the same way — into `tally()` only — matching the existing MalaySing precedent exactly.
- **Highest existing reason code: 86000299** (Check 299, INC1444350 Singapore PH-gated OT), confirmed live in the package bodies independent of which reason-code insert script is currently present in `original/`.
- **`CATS_Reason_Code_Description.sql`** — verified directly (not assumed): its `NO_DATA_FOUND` exception handler already falls back to `org_code='999'` for both the `'EN'` and non-`'EN'` branches. No change needed; new Vietnam codes inserted only at `org_code='999'`/`'574'` will resolve correctly.
- **Routing / unit-flag path**: all 8 Vietnam codes are `UNIT_FLAG='H'` (hours-type) for `A01` — confirmed via the live `ATT_ABS_TYPE` export. Per the same reasoning already established for the MalaySing module's hours-type codes, these are unreachable from `UNIT_EDIT.bdy` (which only ever receives unit-flagged rows) and require no `TLS_TimeValidation.sql` routing change (that carve-out exists only to route *unit-flagged* AVCP codes into `msg_checks`; nothing here is unit-flagged). **`UNIT_EDIT.bdy` and `TLS_TimeValidation.sql` are untouched by this patch.**

---

## 3. Design

### 3.1 Forward declarations (all 4 PAYEDIT files)

Immediately after the existing `msg_checks` forward declaration:

```sql
-- RdW 9/13/2026 INC1247772 Vietnam A01 OT Connect
   FUNCTION  vn_in_scope RETURN BOOLEAN;
   PROCEDURE vn_clear;
   PROCEDURE vn_tally (p_time_rec IN lcd.pay_edit.timetype);
   PROCEDURE vn_checks (
      p_error_count    IN OUT   INTEGER,
      p_error_line     IN OUT   lcd.pay_edit.errorlinetype,
      p_error_number   IN OUT   lcd.pay_edit.ERRORNUMTYPE
   );
```

### 3.2 New package-level declarations (all 4 PAYEDIT files)

Immediately after the existing `msg_day_3140` declaration:

```sql
-- RdW 9/13/2026 INC1247772 Vietnam A01 OT Connect
   vn_org_vn             CONSTANT VARCHAR2(3) := 'A01';   -- Vietnam
   vn_day_2000           lcd.pay_edit.hourstype;   -- VN Overtime@1.5 (workday OT)
   vn_day_2900           lcd.pay_edit.hourstype;   -- VN Bank Time
   vn_day_8900           lcd.pay_edit.hourstype;   -- VN Personal Leave (8900 only - total_day_lv is shared with 13 other leave types for A01)
   vn_day_1013           lcd.pay_edit.hourstype;   -- VN Overtime@3.0 (Public Holiday OT)
```

Only 4 new arrays are needed — everything else (BR-02's 12-hour total, BR-03's Annual Leave side and block-detection side, the PH-prerequisite's Public Holiday side) rides on the existing generic `total_day`/`total_day_vac`/`total_day_ot`/`total_day_hol` arrays, verified unique/safe to reuse per §2 above.

### 3.3 `vn_in_scope`

```sql
-- RdW 9/13/2026 INC1247772 Vietnam A01 OT Connect
   FUNCTION vn_in_scope
      RETURN BOOLEAN
   IS
   BEGIN
      RETURN (pg_org_code = vn_org_vn);
   END vn_in_scope;
```

### 3.4 `vn_clear` — reset the four new arrays

```sql
-- RdW 9/13/2026 INC1247772 Vietnam A01 OT Connect
   PROCEDURE vn_clear
   IS
   BEGIN
      FOR cnt IN 1 .. 7
      LOOP
         vn_day_2000 (cnt) := 0;
         vn_day_2900 (cnt) := 0;
         vn_day_8900 (cnt) := 0;
         vn_day_1013 (cnt) := 0;
      END LOOP;
   END vn_clear;
```

Called immediately after the existing `msg_clear;` call site (inside `clear_tables`).

### 3.5 `vn_tally` — accumulate the four Vietnam-specific codes

```sql
-- RdW 9/13/2026 INC1247772 Vietnam A01 OT Connect
   PROCEDURE vn_tally (p_time_rec IN lcd.pay_edit.timetype)
   IS
      d   PLS_INTEGER := p_time_rec.DAY;
      h   NUMBER      := NVL (p_time_rec.hours, 0);
   BEGIN
      IF NOT vn_in_scope
      THEN
         RETURN;
      END IF;

      IF d IS NULL OR d < 1 OR d > 7 OR h = 0
      THEN
         RETURN;
      END IF;

      CASE p_time_rec.att_abs_type
         WHEN '2000'   THEN vn_day_2000 (d) := vn_day_2000 (d) + h;
         WHEN '2900'   THEN vn_day_2900 (d) := vn_day_2900 (d) + h;
         WHEN '8900'   THEN vn_day_8900 (d) := vn_day_8900 (d) + h;
         WHEN '1013'   THEN vn_day_1013 (d) := vn_day_1013 (d) + h;
         ELSE NULL;
      END CASE;
   END vn_tally;
```

Called immediately after the existing `msg_tally (p_time_rec);` call site, inside `tally()` **only** — matching the existing precedent that `ptally()` gets no equivalent hook (see §2). `1010`, `1012`, and `8000` need no dedicated tally hook: `1010` and `1012` aren't read by any of the four new checks directly (BR-02 uses the pre-existing `total_day` total; BR-01 excludes 1012 entirely per §1.1), and `8000` is read via the existing, verified-unique `total_day_hol`.

### 3.6 `vn_checks` — the four new checks

```sql
-- RdW 9/13/2026 INC1247772 Vietnam A01 OT Connect
   PROCEDURE vn_checks (
      p_error_count    IN OUT   INTEGER,
      p_error_line     IN OUT   lcd.pay_edit.errorlinetype,
      p_error_number   IN OUT   lcd.pay_edit.ERRORNUMTYPE
   )
   IS
   BEGIN
      IF NOT vn_in_scope
      THEN
         RETURN;
      END IF;

      FOR cnt IN 1 .. 7
      LOOP
         ------------------------------------------------------------
         -- Check 300. BR-01: Overtime (2000) + Bank Time (2900)
         -- combined may not exceed 4 hours in a single day. Does NOT
         -- include 1012 (weekend OT) or 1013 (PH OT) - those may run
         -- up to the full 12-hour day cap directly (Check 301), per
         -- the BRD addendum's Eg.3/Eg.4.
         ------------------------------------------------------------
         IF (vn_day_2000 (cnt) + vn_day_2900 (cnt)) > 4
         THEN
            record_error (p_error_count, p_error_line, p_error_number, cnt, 86000300);
         END IF;

         ------------------------------------------------------------
         -- Check 301. BR-02: total daily hours across every code
         -- (regular, all OT-family codes, Public Holiday, Annual/
         -- Personal Leave) may not exceed 12. Reuses the existing
         -- generic total_day(cnt) - already the exact sum needed,
         -- no new tally hook required.
         ------------------------------------------------------------
         IF total_day (cnt) > 12
         THEN
            record_error (p_error_count, p_error_line, p_error_number, cnt, 86000301);
         END IF;

         ------------------------------------------------------------
         -- Check 302. BR-03: a full day (or combined full-day) of
         -- Annual Leave (8100) and/or Personal Leave (8900) blocks
         -- any entry against the whole OT activity group that day
         -- (2000/1012/1013/2900/2200/1011 - reuses the existing
         -- generic total_day_ot bucket, generalized per user
         -- direction rather than enumerating each code). Half-day
         -- AL/PL does not block. Bank Time (2900) does not count
         -- toward the full-day trigger (per user direction), only
         -- toward Check 300's cap and Check 302's blocked set.
         ------------------------------------------------------------
         IF     (total_day_vac (cnt) + vn_day_8900 (cnt)) >= worker_info.long_day
            AND total_day_ot (cnt) > 0
         THEN
            record_error (p_error_count, p_error_line, p_error_number, cnt, 86000302);
         END IF;

         ------------------------------------------------------------
         -- Check 303. Public Holiday OT (1013) requires Public
         -- Holiday (8000) present the same day. Not a separately
         -- numbered BR in this BRD revision, but explicitly
         -- confirmed in scope (Eg.4's worked example depends on it).
         ------------------------------------------------------------
         IF vn_day_1013 (cnt) > 0 AND total_day_hol (cnt) = 0
         THEN
            record_error (p_error_count, p_error_line, p_error_number, cnt, 86000303);
         END IF;
      END LOOP;
   END vn_checks;
```

Called immediately after the existing `msg_checks (p_error_count, p_error_line, p_error_number);` call site, at the end of the inner (CURRENT-only) `VALIDATE` procedure — in the two PTA files this runs *before* `calculate_deltas` (§2), so it reads the same raw CURRENT-pass totals as the non-PTA files, not delta-substituted values.

New local variables needed: **none** — `vn_checks` uses only its own package-level arrays plus the pre-existing `total_day`, `total_day_vac`, `total_day_ot`, `total_day_hol`, and `worker_info.long_day`, all already in scope throughout `validate()`. No collision check needed against new locals since none are introduced.

---

## 4. Reason code text (for `insert_REASONCODES_INC1247772.sql`)

| Code | Text |
|---|---|
| 86000300 | Overtime and Bank Time combined cannot exceed 4 hours per day |
| 86000301 | Total daily hours (regular, overtime, bank time, leave, public holiday) cannot exceed 12 hours |
| 86000302 | Overtime and Bank Time are not permitted on a full-day Annual Leave or Personal Leave day |
| 86000303 | Public Holiday Overtime requires Public Holiday time entered the same day |

Following the format of `templates/insert_REASONCODES_INC1138065.sql` / `original/insert_REASONCODES_INC1427475.sql`: one row per language code plus the `org_code='999'` generic-fallback row, `commit;`, then one master `REASON_CODE` table row per code, `commit;`.

---

## 5. Exact changes per file

| File | Forward decls (3.1) | Package decls (3.2) | `vn_clear` body + call (3.4) | `vn_tally` body + call (3.5) | `vn_checks` body + call (3.6) |
|---|:-:|:-:|:-:|:-:|:-:|
| `PAYEDIT2A.SQL` | after L521 (`msg_checks` spec) | after L511 (`msg_day_3140`) | body after L3244 (`-- END INC1276683 BRD MODULE BODY`); call after L1874 (`msg_clear;`) | body after L3244; call after L1120 (`msg_tally (p_time_rec);`) | body after L3244; call after L5509 (`msg_checks (...)`) |
| `PAYEDIT2C.SQL` | after L321 | after L311 | body after L3031; call after L1635 | body after L3031; call after L887 | body after L3031; call after L5283 |
| `PAYEDIT_PTA_2A.SQL` | after L490 | after L480 | body after L4760; call after L3383 | body after L4760; call after L1071 | body after L4760; call after L7028 |
| `PAYEDIT_PTA_2C.SQL` | after L490 | after L480 | body after L4760; call after L3383 | body after L4760; call after L1071 | body after L4760; call after L7028 |

All four `vn_*` bodies (3.3-3.6) are added together as one new block immediately after each file's `-- END INC1276683 BRD MODULE BODY` marker, mirroring how the existing `msg_*` module is itself grouped as one contiguous block. Anchors are as of the `original/` baseline re-confirmed live on 9/13/2026 (revision 1, post-INC1290674 re-application — see Revision History); re-`grep` each anchor in `patched/` immediately before editing regardless, since earlier edits within the same file shift later line numbers downward, and since baseline drift has already happened once this session (`PAYEDIT_PTA_2A.SQL` and `PAYEDIT_PTA_2C.SQL` share identical anchors both before and after the drift, consistent with them being logic-identical files per the INC1444350 precedent's own finding — `PAYEDIT2A.SQL` and `PAYEDIT2C.SQL` do not share this exact identity because only `PAYEDIT2A.SQL` carries a dated flowerbox at its top).

### 5.1 Flowerbox entries

Per the same verification the INC1444350 patch plan already did: only `PAYEDIT2A.SQL` carries a dated flowerbox history at its top; `PAYEDIT2C.SQL` and `PAYEDIT_PTA_2A/2C.SQL` do not. Add one line to `PAYEDIT2A.SQL`'s flowerbox, immediately after its most recent entry:

```sql
--   09-13-2026 R. Wright: INC1247772 Vietnam A01 OT Connect: BR-01/02/03 daily OT/Bank Time caps and full-day leave block, errors 86000300-86000303
```

---

## 6. Assumptions

| # | Assumption | Rationale / verification |
|---|---|---|
| A1 | Org scope is `A01` only; `A02` (also a Vietnam org per `LCD_ORG_PARAM`) gets nothing from this patch. | Explicit user decision — ticket title and reference employee lists are A01-specific. |
| A2 | `2200`/`1011`/`0460` need no PAYEDIT code changes despite being marked "Remove" in the addendum. | Explicit user decision — deactivation is a data/config change (end-dating or reclassifying the `ATT_ABS_TYPE` rows) outside this patch's scope. If they remain active, entries against them keep today's behavior (none) except where they incidentally fall inside the generalized `total_day_ot` bucket used by Check 302's block-detection side. |
| A3 | BR-01's 4-hour cap applies only to 2000+2900, not 1012/1013. | Explicit user decision, grounded in Eg.3 ("1012: max 12 hours per day") and Eg.4, where weekend/PH OT have no separate 4-hour sub-cap. |
| A4 | BR-02's 12-hour cap is the existing generic `total_day(cnt)` (every code, unconditionally). | Explicit user decision that PH (8000) hours count toward the cap, plus Eg.1's arithmetic (1010:4h + AL-or-BankTime:4h + OT:4h = 12h) confirming leave hours also count. |
| A5 | BR-03's full-day trigger is 8100+8900 only (not 2900), and the blocked set on trigger is the entire OT activity group (not just 2000/1012/1013). | Explicit user decision after resolving a self-reference risk (would otherwise block the very Bank Time entry that helped define the day as "full"). |
| A6 | "Full day" = `worker_info.long_day`; "half day" = `long_day / 2` (not enforced as its own check — simply not blocked). | Explicit user decision from the original BRD round, consistent with the new BRD's 8h/4h worked examples and with how every other existing leave-daily-max check in these files already uses `long_day`. |
| A7 | The PH-prerequisite check (1013 requires 8000 same day) is in scope despite not being a separately numbered BR. | Explicit user decision — Eg.4's worked example depends on it. |
| A8 | `total_day_vac` (VAC group) is safe to reuse as-is for 8100 detection; `total_day_lv` (LV group) is **not** safe to reuse for 8900 and needs a dedicated `vn_day_8900` array; `total_day_hol` (HOL group) is safe to reuse as-is for 8000 detection; `total_day_ot` (OT group) is safe to reuse as-is for Check 302's block-detection side. | Directly verified against the live `A01` `ATT_ABS_TYPE` export (`ACTIVITY_GROUP` column) on 9/13/2026 — VAC and HOL are each single-code groups for `A01`; LV is shared by 14 codes; OT is shared by exactly 2000/1012/1013/2900/2200/1011 with no unexpected members. |
| A9 | No changes needed to `CATS_Reason_Code_Description.sql`. | Verified directly by reading the function (not assumed from precedent) — its `NO_DATA_FOUND` fallback to `org_code='999'` already generically covers any new reason code inserted only at `org_code='999'`/`'574'`. |
| A10 | No changes needed to `UNIT_EDIT.bdy` or `TLS_TimeValidation.sql`. | All 8 Vietnam codes are `UNIT_FLAG='H'` for `A01` per the live config — structurally unreachable in the unit-flagged routing path, same reasoning already established for the MalaySing module's hours-type codes. |
| A11 | `vn_tally` is hooked into `tally()` only, not `ptally()`; `vn_checks` runs from inside the inner (CURRENT-only) `VALIDATE` overload, *before* `calculate_deltas` is ever invoked (that call happens later, from the outer PTA-aware `VALIDATE` overload). So in every one of the 4 patched files — PTA and non-PTA alike — `vn_checks` reads `total_day`/`total_day_vac`/`total_day_ot`/`total_day_hol` as raw, non-delta CURRENT-pass totals, and its own `vn_day_*` arrays are likewise raw CURRENT-pass tallies. No delta-substitution ever applies to any of the 4 new checks, in any file. | Corrected 9/13/2026 after tracing the actual call graph while building the Phase 4 UTP (an earlier draft of this assumption had the call order backwards, matching a since-corrected comment that was briefly present in the patched PTA files' `vn_checks` docblock). Matches the existing `msg_tally`/`msg_checks` precedent exactly, which has the same call-order property. |
| A12 | Reason codes 86000300-303 are free. | Confirmed via `grep -ohE '86000[0-9]{3}' original/*.SQL original/*.bdy` on 9/13/2026, and **re-confirmed** after the INC1290674 re-application changed the underlying scripts (see Revision History) — highest in use is still 86000299 (`86000276` is INC1290674's own re-applied code, below this range; `86000999` is an unrelated default/fallback code). Re-verify once more immediately before writing `insert_REASONCODES_INC1247772.sql` in Phase 3, since this baseline has already drifted once mid-session. |

---

## 7. Test plan

Pointer only — see `docs_INC1247772/UTP_INC1247772/00_UTP_INDEX.md` (Phase 4, not yet written). Expected coverage per the playbook's interior/exterior/boundary/edge matrix for each of the 4 new reason codes, plus:
- Cross-org regression: a non-Vietnam org entering 2000/2900/8900/1013 raises nothing new (confirms `vn_in_scope` gating).
- Regression: `A01` entering 1012 (weekend OT) alone up to 12 hours, with no Check 300 firing (confirms the 4-hour cap correctly excludes 1012).
- Regression: `A01` entering a half-day (4h) Annual Leave alongside OT does not fire Check 302, but a full-day (8h) does.
- Regression: `A01` entering 8100 (4h) + 8900 (4h) on the same day (combined full-day) fires Check 302 even though neither alone reaches `long_day`.

---

## 8. Back-out

### 8.1 Full back-out

1. Delete the forward declarations (3.1) from all 4 files.
2. Delete the 4 new package-level declarations (3.2).
3. Delete the `vn_clear` call site and body (3.4).
4. Delete the `vn_tally` call site and body (3.5).
5. Delete the `vn_checks` call site and body (3.6).
6. Revert the `PAYEDIT2A.SQL` flowerbox entry (5.1).

No data, no pre-existing reason code, and no MalaySing/other-org logic is touched by this back-out — it is fully independent of every other module in these files and reverting it restores the exact pre-INC1247772 baseline.

### 8.2 Selective (per-rule) back-out

Each of the four checks in `vn_checks` (3.6) is its own self-contained `IF`/`END IF`, following the same modularity pattern established by INC1290667 and reused by INC1444350. Any single rule can be disabled without touching the others by wrapping just that block in `/* ... */` with a dated comment, e.g.:

```sql
-- RdW <date> INC<followup> Disabled per <reason> - see INC1247772 for original
/*
IF (vn_day_2000 (cnt) + vn_day_2900 (cnt)) > 4
THEN
   record_error (p_error_count, p_error_line, p_error_number, cnt, 86000300);
END IF;
*/
```

If a rule's *tally* input is also no longer needed (e.g. Check 303 is disabled and nothing else reads `vn_day_1013`), leave the tally arm in place regardless — it is harmless dead accumulation and keeping it avoids touching `vn_tally`/`vn_clear` for a partial rollback. Only remove tally arms during a **full** back-out (8.1).
