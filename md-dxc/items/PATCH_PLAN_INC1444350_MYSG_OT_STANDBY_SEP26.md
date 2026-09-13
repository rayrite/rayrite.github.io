# Patch Plan — INC1444350 MYSG OT-Standby Sep 2026 Changes

| | |
|---|---|
| **Change ID** | INC1444350 (continuation of INC1276683, the Aug 2026 MalaySing round) |
| **Date** | 09/13/2026 |
| **Author** | R. Wright (RWRIGHT28) |
| **Scope orgs** | Malaysia `A60`, Singapore `A00`, `A80` |
| **BRD source** | `MYSG_BRD_sep26.md` (slides 5, 6, 7 of `eTES Enhancements Validations - SG & MY 0902-RDWpptx.pptx`, rows tagged "Priority Change - Sep'26" only) |
| **New reason codes** | 86000290 – 86000299 |
| **Files** | `patched/PAYEDIT2A.SQL`, `patched/PAYEDIT2C.SQL`, `patched/PAYEDIT_PTA_2A.SQL`, `patched/PAYEDIT_PTA_2C.SQL`, `patched/UNIT_EDIT.bdy`, `patched/TLS_TimeValidation.sql` |
| **Base version** | The scripts in `original/` (the completed INC1276683 baseline, through the 8/29/2026 AVCP fixes / India RLV entry) |
| **Comment tag** | `-- RdW 9/13/2026 INC1444350 MYSG OT-Standby Sep 2026 Changes: <detail>` on every injected line/block |
| **Modularity precedent** | India INC1290667 (`Check: 233`, `PAYEDIT2A.SQL` ~L6722-7157): a single self-contained `IF worker_info.currency IN ('INR') THEN` block containing one independent inner `IF` per leave type, each individually disabled by wrapping it in `/* ... */` (not deleted) when out of scope, with a dated comment trail of every round. This ticket follows the same shape: every new check below is its own independent, block-commentable `IF`/`END IF`, so any single rule can be selectively disabled without touching the others. |
| **Reference codebases** | `LCD-Oracle/SQL/PAYEDIT2A.SQL` confirmed byte-identical to `original/PAYEDIT2A.SQL` (this workspace's baseline is in sync with the canonical repo). Per standing instruction, **no edits are made to `LCD-Oracle/` or `eTESWin2008/`** — all work happens in `tasks/98-SeptRel/patched/`. |
| **Companion deliverables** | Reason-code insert script: `patched/insert_REASONCODES_INC1444350.sql` (template: `templates/insert_REASONCODES_INC1138065.sql`). Unit test plan: `docs/UTP_INC1444350/00_UTP_INDEX.md`. Quality audit: `docs/QUALITY_AUDIT_INC1444350.md`. This document is the per-script patch plan (§4 gives the exact anchor/change table for each of the 6 files individually). |

---

## 1. Requirement

Three independent rule sets from the Sep'26 BRD, layered onto the existing INC1276683 MalaySing validation module (`msg_in_scope` / `msg_tally` / `msg_checks` / `msg_ot_edit_exempt`, replicated across the four PAYEDIT-family packages, plus its Singapore-only port in `UNIT_EDIT.bdy`, plus the `TLS_TimeValidation.sql` routing carve-out that gets unit-flagged AVCP codes to `msg_checks` at all):

1. **Malaysia Standby Allowance — codes 3070/3080/3090/3100 (Slide 5).** New to Malaysia; these code numbers currently only carry a Singapore meaning (Shift Allowance 3070-3090, weekly Standby 3100). Since `pg_org_code` is fixed for the whole validation run of a given worker, and all existing Singapore logic for these codes is already gated `IF pg_org_code IN ('A00','A80')`, a parallel `IF pg_org_code = msg_org_my` branch can reuse the same `msg_day_30xx` accumulators with no cross-org collision — the same dual-meaning pattern already in production for codes 3050/3060 (Malaysia OT-PH vs. Singapore Shift Allowance).
2. **Malaysia Shift Activate — codes 3130/3140 (Slide 5, closing clause).** New codes, not used anywhere in the codebase today. Must be mutually exclusive with all four Malaysia Standby codes, both same-day and same-week.
3. **Singapore Overtime — codes 3010/3030 (Slide 6).** These code numbers already carry a Malaysia meaning (OT-Workday / OT-RestDay). Singapore gets a second, PH-conditional meaning: entry requires Public Holiday code 8000 present the *same day*, and that day must be Monday-Friday. When satisfied, the legacy 12-hour-cap edits (86000062/67) are bypassed for that day by extending `msg_ot_edit_exempt`'s Singapore set. No other OT code family (1000/2000-range, or any 3xxx code not named in this BRD) changes behavior.
4. **Singapore Shift Allowance — codes 3050–3090 (Slide 7).** Confirmed already implemented by the 8/27/2026 UAT fixes (86000286/287/288), with one gap: check 86000286 today only compares Shift Allowance against the *daily* standby codes (3110/3120) on the same day, deliberately excluding the *weekly* standby code (3100) to avoid double-reporting with the week-level check 86000288. Per this BRD round, Shift Allowance must be blocked against **all** Standby codes (3100-3120) on the same day — 86000286 is widened to include 3100, and 86000288 is left as-is (both may now fire together for a same-day SA+3100 conflict; confirmed acceptable — GVR supports multiple reason codes per day).

### 1.1 Malaysia Standby exclusivity matrix (Slide 5)

| Code | Meaning | Valid days | Unit rule | Exclusivity |
|---|---|---|---|---|
| 3070 | SB-Weekly Rate RM150/wk | any day | 1 unit, ≤1×/week | **Week-level**: excludes 3080/3090/3100 anywhere else that week |
| 3080 | SB-Daily Mon-Sat RM15/day | Mon-Sat only | 1 unit/day | Participates in 3070's week-level exclusion; may coexist with 3090 in the same week |
| 3090 | SB-Weekend/Sun RM20/day | Sunday only | 1 unit/day | Participates in 3070's week-level exclusion; may coexist with 3080 in the same week |
| 3100 | SB-PH RM30/day | any day, requires 8000 same day | 1 unit/day | **Day-level**: excludes 3070/3080/3090 on the same day only (independent of the week-level check above) |
| 3130/3140 | Shift Activate | n/a | n/a | Excludes 3070/3080/3090/3100 both same-day **and** same-week |

### 1.2 Singapore OT exception matrix (Slide 6)

| Code | Meaning (Singapore) | Requires | Result when satisfied | Result when not satisfied |
|---|---|---|---|---|
| 3010 | OT-PH Weekday ≤8hrs (1x) | 8000 present same day, Mon-Fri | 86000062/67 bypassed (no 12-hr cap) that day | New error 86000299; legacy 86000062/67 still enforced |
| 3030 | OT-PH Weekday >8hrs (1.5x) | 8000 present same day, Mon-Fri | 86000062/67 bypassed that day | New error 86000299; legacy 86000062/67 still enforced |

---

## 2. Current (as-is) behavior

- `msg_day_3070/3080/3090/3100` exist today, populated by `msg_tally` for any in-scope org, but interpreted **only** under `IF pg_org_code IN ('A00','A80')` in `msg_checks` (Singapore Shift Allowance / weekly Standby). No Malaysia branch exists for these codes.
- `msg_day_3010/3030` exist today, interpreted under `IF pg_org_code = msg_org_my` (Malaysia OT family). No Singapore branch exists for these codes; Singapore's `msg_ot_edit_exempt` set is `{3020, 3040}` only.
- `msg_ot_edit_exempt`'s Singapore branch (all 4 PAYEDIT files):
  ```sql
  ELSIF pg_org_code IN ('A00', 'A80')
  THEN
     RETURN (   msg_day_3020 (p_day) > 0
             OR msg_day_3040 (p_day) > 0 );
  ```
- `86000286` (Shift Allowance vs. daily Standby, same day) reads, in all four PAYEDIT files and in `UNIT_EDIT.bdy`:
  ```sql
  IF (msg_day_3110 (cnt) + msg_day_3120 (cnt)) > 0
  THEN
     record_error (..., cnt, 86000286);
  END IF;
  ```
  — deliberately excludes `msg_day_3100`, per the existing comment ("the WEEKLY standby (3100) is handled at week level by Check 288... so a single conflict does not raise two errors").
- `TLS_TimeValidation.sql`'s `f_IsAvcpStandbyCode` already includes org `A60` and codes `3070/3080/3090/3100` in its routing carve-out (added 8/29/2026, apparently pre-positioned for this), but does not include `3130`/`3140`.
- `UNIT_EDIT.bdy` has no `msg_org_my` constant and no Malaysia branch anywhere — it only ports the Singapore section, per its own header comment ("Malaysia's checks are all hours-type codes... that structurally cannot reach this package"), which stops being true once Malaysia gets unit-flagged Standby/Shift-Activate codes.
- Highest existing reason code: **86000289**.

---

## 3. Design

### 3.1 New package-level declarations (all 4 PAYEDIT files + `UNIT_EDIT.bdy`)

Immediately after the existing `msg_day_3090` declaration:

```sql
-- RdW 9/13/2026 INC1444350 MYSG OT-Standby Sep 2026 Changes: Malaysia shift-activate accumulators
   msg_day_3130          lcd.pay_edit.hourstype;   -- MY Shift Activate (code A)
   msg_day_3140          lcd.pay_edit.hourstype;   -- MY Shift Activate (code B)
```

(`UNIT_EDIT.bdy` uses bare `hourstype`, not `lcd.pay_edit.hourstype`, matching its existing declarations — and additionally needs its own `msg_org_my CONSTANT VARCHAR2(3) := 'A60';`, which the PAYEDIT-family files already have.)

### 3.2 `msg_clear` — reset the two new arrays

```sql
-- RdW 9/13/2026 INC1444350 MYSG OT-Standby Sep 2026 Changes
         msg_day_3130 (cnt) := 0;
         msg_day_3140 (cnt) := 0;
```

### 3.3 `msg_tally` — accumulate the two new codes

```sql
-- RdW 9/13/2026 INC1444350 MYSG OT-Standby Sep 2026 Changes
         WHEN '3130'     THEN msg_day_3130 (d) := msg_day_3130 (d) + h;
         WHEN '3140'     THEN msg_day_3140 (d) := msg_day_3140 (d) + h;
```

### 3.4 `msg_ot_edit_exempt` — extend the Singapore branch (day-level, PH+weekday gated)

```sql
   FUNCTION msg_ot_edit_exempt (p_day IN PLS_INTEGER)
      RETURN BOOLEAN
   IS
-- RdW 9/13/2026 INC1444350 MYSG OT-Standby Sep 2026 Changes: day-of-week
-- helper for the new SG 3010/3030 PH-gated exemption
      l_dt    DATE;
      l_dow   VARCHAR2 (3);
   BEGIN
      IF pg_org_code = msg_org_my
      THEN
         RETURN (   msg_day_3011 (p_day) > 0
                 OR msg_day_3020 (p_day) > 0
                 OR msg_day_3030 (p_day) > 0
                 OR msg_day_3040 (p_day) > 0
                 OR msg_day_3050 (p_day) > 0
                 OR msg_day_3060 (p_day) > 0 );
      ELSIF pg_org_code IN ('A00', 'A80')
      THEN
-- RdW 9/13/2026 INC1444350 MYSG OT-Standby Sep 2026 Changes: 3010/3030
-- bypass requires PH(8000) present the same day AND that day is Mon-Fri
         l_dt  := pg_end_date - 7 + p_day;
         l_dow := TO_CHAR (l_dt, 'DY', 'NLS_DATE_LANGUAGE=AMERICAN');

         RETURN (   msg_day_3020 (p_day) > 0
                 OR msg_day_3040 (p_day) > 0
                 OR (    (msg_day_3010 (p_day) > 0 OR msg_day_3030 (p_day) > 0)
                     AND msg_day_8000 (p_day) > 0
                     AND l_dow NOT IN ('SAT', 'SUN') ) );
      ELSE
         RETURN FALSE;
      END IF;
   END msg_ot_edit_exempt;
```

Note: `msg_day_8000` is already populated for every in-scope org (Malaysia's PH-gating for 3050/3060 already depends on it), so no new tally hook is needed for it.

### 3.5 New Malaysia Standby block in `msg_checks` (immediately after `END IF; -- Malaysia`, before the Singapore block)

```sql
-- RdW 9/13/2026 INC1444350 MYSG OT-Standby Sep 2026 Changes
-- =====================================================================
-- MALAYSIA (A60) - standby allowance rules (Sep'26 BRD, slide 5)
-- =====================================================================
IF pg_org_code = msg_org_my
THEN
   l_my_sb_week   := 0;   -- sum of 3080+3090+3100 across the week (for 3070's week-level exclusion)
   l_3070_days    := 0;
   l_shift_act_wk := 0;   -- sum of 3130+3140 across the week

   FOR cnt IN 1 .. 7
   LOOP
      l_my_sb_day   := msg_day_3070 (cnt) + msg_day_3080 (cnt)
                      + msg_day_3090 (cnt) + msg_day_3100 (cnt);
      l_shift_act_day := msg_day_3130 (cnt) + msg_day_3140 (cnt);
      l_shift_act_wk  := l_shift_act_wk + l_shift_act_day;

      IF msg_day_3070 (cnt) > 0 THEN l_3070_days := l_3070_days + 1; END IF;
      l_my_sb_week := l_my_sb_week + msg_day_3080 (cnt) + msg_day_3090 (cnt) + msg_day_3100 (cnt);

      ------------------------------------------------------------
      -- Check 290. Each of 3070/3080/3090/3100 must be exactly 1 unit.
      ------------------------------------------------------------
      IF     (msg_day_3070 (cnt) > 0 AND msg_day_3070 (cnt) <> msg_sb_unit)
         OR (msg_day_3080 (cnt) > 0 AND msg_day_3080 (cnt) <> msg_sb_unit)
         OR (msg_day_3090 (cnt) > 0 AND msg_day_3090 (cnt) <> msg_sb_unit)
         OR (msg_day_3100 (cnt) > 0 AND msg_day_3100 (cnt) <> msg_sb_unit)
      THEN
         record_error (p_error_count, p_error_line, p_error_number, cnt, 86000290);
      END IF;

      ------------------------------------------------------------
      -- Check 293. 3080 may only be recorded Monday-Saturday.
      -- Check 294. 3090 may only be recorded on Sunday.
      -- Check 295. 3100 requires PH(8000) present the same day.
      -- Check 296. 3100 excludes 3070/3080/3090 the same day.
      ------------------------------------------------------------
      IF pg_end_date IS NOT NULL
      THEN
         l_dt  := pg_end_date - 7 + cnt;
         l_dow := TO_CHAR (l_dt, 'DY', 'NLS_DATE_LANGUAGE=AMERICAN');

         IF msg_day_3080 (cnt) > 0 AND l_dow = 'SUN'
         THEN
            record_error (p_error_count, p_error_line, p_error_number, cnt, 86000293);
         END IF;

         IF msg_day_3090 (cnt) > 0 AND l_dow <> 'SUN'
         THEN
            record_error (p_error_count, p_error_line, p_error_number, cnt, 86000294);
         END IF;
      END IF;

      IF msg_day_3100 (cnt) > 0
      THEN
         IF msg_day_8000 (cnt) = 0
         THEN
            record_error (p_error_count, p_error_line, p_error_number, cnt, 86000295);
         END IF;

         IF (msg_day_3070 (cnt) + msg_day_3080 (cnt) + msg_day_3090 (cnt)) > 0
         THEN
            record_error (p_error_count, p_error_line, p_error_number, cnt, 86000296);
         END IF;
      END IF;

      ------------------------------------------------------------
      -- Check 297. Shift Activate (3130/3140) excludes MY Standby
      -- the same day.
      ------------------------------------------------------------
      IF l_shift_act_day > 0 AND l_my_sb_day > 0
      THEN
         record_error (p_error_count, p_error_line, p_error_number, cnt, 86000297);
      END IF;
   END LOOP;

   ------------------------------------------------------------
   -- Check 291. 3070 (weekly) may be used at most once per week.
   ------------------------------------------------------------
   IF l_3070_days > 1
   THEN
      record_error (p_error_count, p_error_line, p_error_number, 0, 86000291);
   END IF;

   ------------------------------------------------------------
   -- Check 292. 3070 excludes 3080/3090/3100 anywhere else that week.
   ------------------------------------------------------------
   IF l_3070_days > 0 AND l_my_sb_week > 0
   THEN
      record_error (p_error_count, p_error_line, p_error_number, 0, 86000292);
   END IF;

   ------------------------------------------------------------
   -- Check 298. Shift Activate excludes MY Standby anywhere in the
   -- same week (independent of the day-level Check 297).
   ------------------------------------------------------------
   IF l_shift_act_wk > 0 AND (l_3070_days > 0 OR l_my_sb_week > 0)
   THEN
      record_error (p_error_count, p_error_line, p_error_number, 0, 86000298);
   END IF;
END IF;   -- Malaysia standby (Sep'26)
```

New local variables needed in `msg_checks`'s declare section (verified against `PAYEDIT2A.SQL` L2536-2550: the block ends with `l_sa_week NUMBER := 0;` immediately before `BEGIN` at L2550 — insert here, and at the equivalent position in the other 4 files):

```sql
-- RdW 9/13/2026 INC1444350 MYSG OT-Standby Sep 2026 Changes
      l_my_sb_day     NUMBER;               -- MY standby (3070+3080+3090+3100) units for the day
      l_my_sb_week    NUMBER      := 0;     -- MY standby (3080+3090+3100) units for the week
      l_3070_days     PLS_INTEGER := 0;     -- count of days 3070 was used this week
      l_shift_act_day NUMBER;               -- MY shift activate (3130+3140) units for the day
      l_shift_act_wk  NUMBER      := 0;     -- MY shift activate (3130+3140) units for the week
```

Checked for name collisions against every existing local/package variable in all 4 PAYEDIT files and `UNIT_EDIT.bdy` — none found. The existing `l_dt`/`l_dow` locals are reused as-is (already declared, already used for the Standby day-of-week logic in the same procedure).

### 3.6 New Singapore OT check in `msg_checks` (inside the existing `IF pg_org_code IN ('A00','A80')` loop)

```sql
-- RdW 9/13/2026 INC1444350 MYSG OT-Standby Sep 2026 Changes
------------------------------------------------------------
-- Check 299. SG 3010/3030 require PH(8000) present the same
-- day, Monday-Friday. (The bypass itself is granted by the
-- msg_ot_edit_exempt change in 3.4 - this is the blocking
-- error for the case where the precondition is NOT met.)
------------------------------------------------------------
IF (msg_day_3010 (cnt) > 0 OR msg_day_3030 (cnt) > 0)
   AND NOT (    msg_day_8000 (cnt) > 0
            AND pg_end_date IS NOT NULL
            AND TO_CHAR (pg_end_date - 7 + cnt, 'DY', 'NLS_DATE_LANGUAGE=AMERICAN') NOT IN ('SAT','SUN') )
THEN
   record_error (p_error_count, p_error_line, p_error_number, cnt, 86000299);
END IF;
```

Placed alongside the existing Check 282 (3020/3040 exclusivity) in the same `FOR cnt IN 1..7` loop, so it reuses that loop's existing day-of-week machinery.

### 3.7 Widen Check 286 to include weekly standby (3100), same day (Slide 7 fix)

In all four PAYEDIT files **and** `UNIT_EDIT.bdy`, change:

```sql
IF (msg_day_3110 (cnt) + msg_day_3120 (cnt)) > 0
```
to
```sql
-- RdW 9/13/2026 INC1444350 MYSG OT-Standby Sep 2026 Changes: widen same-day
-- SA-vs-SB check to include weekly standby 3100 (previously excluded to
-- avoid double-firing with week-level Check 288 - both may now fire)
IF l_sb_day > 0
```

`l_sb_day` already equals `msg_day_3100(cnt) + msg_day_3110(cnt) + msg_day_3120(cnt)` at this point in every file — no new variable needed, just swapping which existing local is compared.

### 3.8 `UNIT_EDIT.bdy` — full port

Apply 3.1–3.3, 3.5, 3.7 to `UNIT_EDIT.bdy` (it has no `msg_ot_edit_exempt` / Malaysia OT concept at all, so 3.4 and 3.6 do not apply there — Singapore OT 3010/3030 are hours-type and cannot reach this unit-only package). Also add the missing `msg_org_my CONSTANT VARCHAR2(3) := 'A60';` constant and widen `msg_in_scope`'s call sites are unaffected (already returns TRUE for A60).

### 3.9 `TLS_TimeValidation.sql` — routing carve-out

```sql
-- was:
   RETURN a_org IN ('A00', 'A60', 'A80')
      AND a_attabs IN ('3050','3060','3070','3080','3090','3100','3110','3120');
-- becomes:
-- RdW 9/13/2026 INC1444350 MYSG OT-Standby Sep 2026 Changes: route Malaysia
-- shift-activate codes to msg_checks the same way the standby codes are
   RETURN a_org IN ('A00', 'A60', 'A80')
      AND a_attabs IN ('3050','3060','3070','3080','3090','3100','3110','3120','3130','3140');
```

No org-list change needed (`A60` is already present).

---

## 4. Exact changes per file

| File | Declarations (3.1) | `msg_clear` (3.2) | `msg_tally` (3.3) | `msg_ot_edit_exempt` (3.4) | MY Standby block (3.5) | SG check 299 (3.6) | Check 286 widen (3.7) |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| `PAYEDIT2A.SQL` | after L495 | after L2436 | after L2489 | L2385-2404 | after L2798 (`END IF; -- Malaysia`) | inside loop at L2803-2822 (near Check 282) | L2843 area (86000286) |
| `PAYEDIT2C.SQL` | after L302 | after L2214 | after L2274 | L2163-2182 | after L2586 (`END IF; -- Malaysia`) | inside loop at L2591-2611 | L2637 area (86000286, exact line TBD at implementation time — reference: check occurs immediately after `l_sa_day` block) |
| `PAYEDIT_PTA_2A.SQL` | after L471 | after L3954-ish (`msg_day_3090(cnt):=0` sibling) | after L4007-ish | L3909-3928 | after L4322 (`END IF; -- Malaysia`) | inside loop at L4327-4347 | near existing 86000286 site |
| `PAYEDIT_PTA_2C.SQL` | after L471 | after L3954-ish | after L4007-ish | L3909-3928 | after L4322 (`END IF; -- Malaysia`) | inside loop at L4327-4347 | near existing 86000286 site |
| `UNIT_EDIT.bdy` | after L41 (`msg_day_3090`) + add `msg_org_my` const | after L417 | after L460 | n/a (no MY OT concept here) | new block after Singapore block (L668, before `END msg_checks;`), gated `IF pg_org_code = msg_org_my` | n/a (hours-type, unreachable here) | L530 (`(msg_day_3110+msg_day_3120)>0` → `l_sb_day > 0`) |
| `TLS_TimeValidation.sql` | n/a | n/a | n/a | n/a | n/a | n/a | n/a — see 3.9, L289 |

Exact line numbers are anchors as of the `original/` baseline; the four PAYEDIT-family files are logic-identical at these anchors (only cosmetic differences: package names, a few debug `dbms_output` lines, and stray whitespace in trailing comments per the direct diffs taken during planning) — apply the same relative insertion points, then re-verify line numbers per file after each edit since earlier insertions shift later ones downward within the same file.

### 4.1 Flowerbox entries — one line per logical change, not one combined line

Per requirement (c), `PAYEDIT2A.SQL`'s flowerbox gets a **separate dated entry for each change**, mirroring how INC1276683 itself used five separate entries (8/18, 8/20, 8/25, 8/26, 8/27) rather than one. Add these four lines immediately after the existing `-- 08-29-2026 R. Wright: INC1415066 ...` line:

```sql
--   09-13-2026 R. Wright: INC1444350 MYSG OT-Standby Sep 2026 Changes: Malaysia Standby Allowance (3070-3100) unit/day/week rules, errors 86000290-86000296
--   09-13-2026 R. Wright: INC1444350 MYSG OT-Standby Sep 2026 Changes: Malaysia Shift Activate (3130/3140) exclusivity vs Standby, errors 86000297-86000298
--   09-13-2026 R. Wright: INC1444350 MYSG OT-Standby Sep 2026 Changes: Singapore PH-gated OT (3010/3030), error 86000299 + msg_ot_edit_exempt bypass extension
--   09-13-2026 R. Wright: INC1444350 MYSG OT-Standby Sep 2026 Changes: Singapore Shift Allowance vs weekly Standby 3100 same-day check widened (86000286)
```

Verified against the actual files: `PAYEDIT2C.SQL` and `PAYEDIT_PTA_2A/2C.SQL` carry **no** dated flowerbox at all (they open directly with `create or replace PACKAGE BODY ...`, or a placeholder `-- hey`) — only `PAYEDIT2A.SQL` has one, so requirement (c) applies there only. `UNIT_EDIT.bdy` has its own smaller dated port-history comment (at its top, describing the 8/29/2026 AVCP003-010 port) — that gets one appended line noting the 9/13/2026 Malaysia extension, and `TLS_TimeValidation.sql` gets one appended line at `f_IsAvcpStandbyCode`'s existing dated comment block.

---

## 5. Assumptions

| # | Assumption | Rationale / verification |
|---|---|---|
| A1 | "1 UNIT" for Malaysia standby means the same `msg_sb_unit = 1.0` constant already used for Singapore standby — no separate MY-specific unit constant. | Same numeric rule text ("The number must be 1 UNIT"); reusing the existing constant avoids a redundant declaration. |
| A2 | RM/SGD currency rates in the BRD (RM150/wk, RM15/day, RM20/day, RM30/day) are informational (GHR/payroll display) only — not validated in PAYEDIT. | Consistent with how Singapore's SGD270/33.75/50.65 rates were never validated in the Aug implementation; only unit-count and day/week placement are checked. |
| A3 | Shift Activate codes are `3130` and `3140`, per explicit user confirmation — independent of slide 2's Job Level table (which is out of scope for this ticket). | User-provided; slide 2 disregarded per instruction. |
| A4 | Shift Activate (3130/3140) is unit-flagged, per user confirmation — routed to `msg_checks` via the `TLS_TimeValidation.sql` carve-out and also ported to `UNIT_EDIT.bdy`. | User-provided. |
| A5 | Singapore 3010/3030 PH-gating is day-level (same day, Mon-Fri), not week-level — per user correction of the BRD's ambiguous "falls on work week" phrasing. | User-provided; overrides literal BRD wording. |
| A6 | 86000286 and 86000288 may both fire for the same underlying same-day SA+3100 conflict. | User-confirmed; GVR supports multiple reason codes per day. |
| A7 | No changes needed to `CATS_Reason_Code_Description.sql` — its `NO_DATA_FOUND` fallback to `org_code='999'` (added 8/29/2026) already generically covers any new reason code inserted only at `org_code='999'/'574'`, which is how `insert_REASONCODES_INC1444350.sql` inserts these. | Verified by reading the function; no MalaySing-specific logic lives there. |
| A8 | Malaysia's new Standby codes require no changes to `PAYEDIT_PTA_2A/2C`'s `tally()`/`ptally()` hook wiring beyond mirroring the existing `msg_tally` hook already present for INC1276683 — no new hook call sites needed, only body edits. | Existing hook (`tally` → `msg_tally`) already fires unconditionally for all in-scope orgs; the new codes just add new `CASE` arms to the same procedure. |

---

## 6. Test plan

All 50 tests (25 regular-timesheet + 25 PTA) are standalone, F5-runnable scripts in `docs/UTP_INC1444350/T-1444350-{MY|SG}-NNN.sql` and `T-1444350-PTA-{MY|SG}-NNN.sql`, built directly from the v2 spec templates in `cvx_deluxe_harness/v2/` (`CVX_01_REGULAR_TIMESHEET_DELUXE_v2.sql` / `CVX_02_PTA_TIMESHEET_DELUXE_v2.sql`), against real test employees: Malaysia org `A60` worker `11514649`, Singapore org `A00` worker `11500877`, week ending Friday `20260918` (regular) / `20260821` (PTA). See `docs/UTP_INC1444350/00_UTP_INDEX.md` for the full interior/exterior/boundary/edge-case matrix (one script per scenario, each with an **Expected Results** column), covering:
- MY 3070/3080/3090/3100 unit rule, day-of-week restrictions, week-level 3070 exclusion, day-level 3100 exclusion
- MY 3130/3140 vs Standby, same-day and same-week
- SG 3010/3030 with/without same-day PH, weekday vs weekend
- SG regression: 3020/3040 bypass unaffected by the `msg_ot_edit_exempt` change
- SG Shift Allowance vs 3100 same-day (widened 86000286) plus regression of 86000287/288
- Cross-org regression: a non-MalaySing org (e.g. `111`) touching any of these codes raises nothing new

---

## 7. Back-out

### 7.1 Full back-out

1. Delete the two new declarations (3.1) from all 6 files.
2. Delete the `msg_clear` reset lines (3.2) and `msg_tally` CASE arms (3.3).
3. Revert `msg_ot_edit_exempt`'s Singapore branch (3.4) to the pre-INC1444350 two-line `RETURN`.
4. Delete the new Malaysia Standby block (3.5) from `msg_checks` in all 5 applicable files.
5. Delete the new Check 299 block (3.6) from the 4 PAYEDIT files.
6. Revert Check 286 (3.7) from `l_sb_day > 0` back to `(msg_day_3110(cnt)+msg_day_3120(cnt)) > 0` in all 5 applicable files.
7. Revert `f_IsAvcpStandbyCode`'s code list (3.9) to drop `'3130','3140'`.
8. Revert the flowerbox entries (4.1).

No data, no pre-existing reason code, and no INC1276683 logic is touched by this back-out — it is fully independent and reverting it restores the exact 8/29/2026 baseline.

### 7.2 Selective (per-rule) back-out — pattern from INC1290667

Each of the four logical changes (3.5 Malaysia Standby, 3.5's Shift Activate sub-block, 3.6 Singapore OT, 3.7 the Check-286 widening) is its own self-contained `IF`/`END IF`, exactly like INC1290667's per-leave-type blocks under `Check: 233`. Any single one can be disabled **without touching the others** by wrapping just that block in `/* ... */` and leaving a dated note, e.g.:

```sql
-- RdW <date> INC<followup> Disabled per <reason> - see INC1444350 for original
/*
IF l_shift_act_day > 0 AND l_my_sb_day > 0
THEN
   record_error (p_error_count, p_error_line, p_error_number, cnt, 86000297);
END IF;
*/
```

This is the preferred revert path for a partial rollback (e.g. Shift Activate scope turns out wrong but Standby rules are fine) — the code stays in place, commented out and dated, rather than deleted, so its history and intent remain visible in-file (matching how INC1348107/INC1405279 handled 86000233 above it in the same file).
