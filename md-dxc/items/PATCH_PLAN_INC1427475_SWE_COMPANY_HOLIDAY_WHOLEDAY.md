# Patch Plan: INC1427475 — N05-Sweden Company Holiday Whole-Day Increments (Round 2)

| Field | Value |
|---|---|
| **Change ID** | INC1427475 (round 2 — extends the 08-20-2026 round-1 change already in the baseline) |
| **Date** | 2026-09-13 |
| **Author** | R. Wright (patch authored by RdW tooling) |
| **Scope org** | `N05` (Sweden) only, via `pg_org_code = 'N05'` |
| **BRD source** | Ticket text: "ensure the Company Holiday activity code, which should be assigned to the PHL leave bucket, can only be taken in whole day increments" |
| **New reason code** | `86000278` — "Company Holiday can only be taken in whole day increments" (1 new code; next-adjacent to round 1's 86000277) |
| **Files touched** | `PAYEDIT2A.SQL`, `PAYEDIT2C.SQL`, `PAYEDIT_PTA_2A.SQL`, `PAYEDIT_PTA_2C.SQL` + new `insert_REASONCODES_INC1427475.sql` |
| **Base version** | `tasks/98-SeptRel/original/` snapshot of 2026-09-13 (contains round 1 of this ticket and INC1444350; `patched/` verified byte-identical to `original/` pre-patch) |
| **Comment tag** | `-- RdW 9/13/2026 INC1427475 N05-Sweden Company Holiday whole-day increments ...` |
| **Modularity precedent** | One self-contained `IF pg_org_code = 'N05' ... END IF` block delimited by `BEGIN`/`END` marker comments (same revert convention as INC1296074 / Check N05-B and the INC1405279 selective restores) |
| **Reference codebases** | `LCD-Oracle/` (canonical, untouched), `eTESWin2008/` (ETES context), `tasks/87-SWE/v4/INC1290674_patched_20260827/` (SWE increment pattern), `tasks/87-SWE/v4b/INC1427475-SWE-TableInserts/` (round-1 table inserts for time type 8921) |
| **Companion deliverables** | `patched/insert_REASONCODES_INC1427475.sql` · `docs_INC1427475/QUALITY_AUDIT_INC1427475.md` · `docs_INC1427475/UTP_INC1427475/00_UTP_INDEX.md` · `docs_INC1427475/DEPLOYMENT_INC1427475.md` |

---

## 1. Requirement (confirmed rule set)

**Rule W-1 (the only rule).** For org `N05` (Sweden) workers, hours charged to the **PHL** leave bucket
(fed by time type **8921 "COMPANY HOLIDAY SWEDEN"**, created in round 1) must equal exactly one whole
day per day charged:

- **Trigger condition:** `(total_day_phl(cnt) > 0 AND total_day_phl(cnt) <> worker_info.long_day) OR (total_day_phl_nonfml(cnt) > 0 AND total_day_phl_nonfml(cnt) <> worker_info.long_day)`
- **Granularity:** per day (`cnt` = 1..7), inside the existing `FOR cnt IN 1..7` day loop of `leave_check`
- **Reason code:** **new** `86000278` "Company Holiday can only be taken in whole day increments"
- **Pass cases:** 0 hours on the day (no Company Holiday taken); exactly `worker_info.long_day` hours
- **Fail cases:** any positive amount ≠ `worker_info.long_day` — including half days, and amounts **greater** than `long_day`

**Confirmed interactions:**
- **Double-fire with `86000101` accepted** (user-confirmed 2026-09-13): a partial-day PHL entry that also violates the generic `MOD(total_day_phl, ABSENCE_INCREMENT)` check may raise both `86000101` and `86000278` for the same day. This mirrors the existing India overlap (Check 232 vs. the generic increment checks).
- **No interaction with Check 232** (India, `worker_info.currency IN ('INR')`): N05 workers are not INR-paid; the gates are disjoint. No N05 worker can be INR (India org family), verified by the disjoint org/currency model used since INC33219685.
- **Round-1 balance check untouched:** the `86000277` "Company Holiday balance exceeded" logic is not modified.

---

## 2. Current (as-is) behavior

### 2.1 Round 1 of this ticket (already in baseline)

Time type 8921 "COMPANY HOLIDAY SWEDEN" for N05 (`UNIT_FLAG='H'`, `FML_FLAG='N'`,
`ACTIVITY_GROUP='PHL'`, `COST_CALC_GROUP='PHL'`) — table inserts delivered in
`tasks/87-SWE/v4b/INC1427475-SWE-TableInserts/insert_tables_8921_INC1427475.sql` (not yet present in
the P22 snapshot used for this patch; deployment sequencing handled by round-1 docs).

PHL bucket accumulation (identical mechanics in all four files), e.g. `PAYEDIT2A.SQL:1733-1746`:

```sql
ELSIF activity_type.grp = 'PHL'
THEN -- Public holiday Leave
   total_day_phl (p_time_rec.DAY) := total_day_phl (p_time_rec.DAY) + p_time_rec.hours;
   total_week_phl := total_week_phl + p_time_rec.hours;
   IF activity_type.fml = 'N'
   THEN -- non FML hours
      total_day_phl_nonfml (p_time_rec.DAY) := total_day_phl_nonfml (p_time_rec.DAY) + p_time_rec.hours;
   END IF;
```

Because 8921 has `FML_FLAG='N'`, its hours land in **both** `total_day_phl` and `total_day_phl_nonfml`.

Round-1 PAYEDIT change (present in all four files), e.g. `PAYEDIT2A.SQL:6868-6870`:

```sql
-- RdW 8/20/2026 INC1427475 N05-Sweden Company Holiday time type PHL bucket (revert to literal 86000225 to back out)
CASE WHEN pg_org_code = 'N05' THEN 86000277 ELSE 86000225 END
); -- 'Public Holiday Hours leave balance exceeded' (86000277 'Company Holiday balance exceeded' for N05)
```

### 2.2 What N05 PHL hours are subject to today

1. **Generic increment check** (`PAYEDIT2A.SQL:4566-4574`, same relative block in all four files):
   `MOD(total_day_phl(cnt), worker_info.ABSENCE_INCREMENT) <> 0` → `86000101`, applied to **all orgs**
   inside the "All worker day edits" `FOR cnt IN 1..7` loop. `ABSENCE_INCREMENT` is worker-profile data
   (`PAYEDIT2A.SQL:2081`: NULL/0 defaults to 1). → A 4h entry on an 8h day with increment 4 (half-day)
   or increment 1 **passes** this check.
2. **PHL balance check** (round 1) — quota only, not increments.
3. **Nothing else.** There is **no** whole-day requirement for N05 PHL. India's Check 232 is
   currency-gated to `INR` and does not apply to N05.

**Conclusion: the requirement is NOT currently enforced; a new check is required.**

### 2.3 The pattern being mirrored — India Check 232

Present in all four files (line-anchored in the `original/` baseline):

| File | Block |
|---|---|
| `PAYEDIT2A.SQL` | lines 6915-6934 |
| `PAYEDIT2C.SQL` | lines 6691-6710 |
| `PAYEDIT_PTA_2A.SQL` | lines 8640-8659 |
| `PAYEDIT_PTA_2C.SQL` | lines 8637-8656 |

```sql
-- Check: 232. India workers: public holiday leave hours must be taken in full day increments
-- RdW INC 33219685 11/25/2024
-- India workers must take a full day of public holiday
IF  worker_info.currency in ('INR')
THEN
  IF  ((total_day_phl(cnt) > 0 AND
      total_day_phl(cnt) <> worker_info.long_day) OR
      (total_day_phl_nonfml(cnt) > 0 AND
      total_day_phl_nonfml(cnt) <> worker_info.long_day))
  THEN
     record_error (
        p_error_count,
        p_error_line,
        p_error_number,
        cnt,
        86000232
     ); -- "Public Holiday leave can only be taken in full day increments"

  END IF;
END IF;
```

---

## 3. Design

### 3.1 New check (one block, identical in all four files)

Insert immediately **after** Check 232's outer `END IF;` (and the blank line that follows it),
**before** the `-- RdW 7/29/2026 INC 1405279 India Increments Selective Restore...` comment:

```sql
              -- RdW 9/13/2026 INC1427475 N05-Sweden Company Holiday whole-day increments BEGIN
              -----------------------------------------------------------------------
              -- Check: 249. N05 Sweden workers: Company Holiday (PHL bucket, time
              -- type 8921) must be taken in whole day increments only. Mirrors the
              -- structure of Check 232 (India PHL full-day, 86000232) with an org
              -- gate instead of a currency gate. May double-fire with the generic
              -- ABSENCE_INCREMENT check (86000101) - accepted per INC1427475.
              -- To back out: delete from the BEGIN marker to the END marker below.
              -----------------------------------------------------------------------
              IF  pg_org_code = 'N05'
              THEN
                IF  ((total_day_phl(cnt) > 0 AND
                      total_day_phl(cnt) <> worker_info.long_day) OR
                     (total_day_phl_nonfml(cnt) > 0 AND
                      total_day_phl_nonfml(cnt) <> worker_info.long_day))
                THEN
                   record_error (
                      p_error_count,
                      p_error_line,
                      p_error_number,
                      cnt,
                      86000278
                   ); -- "Company Holiday can only be taken in whole day increments"
                END IF;
              END IF;
              -- RdW 9/13/2026 INC1427475 N05-Sweden Company Holiday whole-day increments END
```

**Check number 249:** highest existing `-- Check: NNN` label in the baseline is 248; 249 is unused in
all four files (verified by grep).

### 3.2 Symbols used — no new declarations

The block references only existing, in-scope symbols; **zero new local variables** (so zero
variable-collision risk):

| Symbol | Kind | Scope evidence |
|---|---|---|
| `pg_org_code` | package-level variable | declared `PAYEDIT2A.SQL:404` (`lcd.toe_attabs_map.org_code%TYPE`); already used inside `leave_check` by round 1 at `PAYEDIT2A.SQL:6869` |
| `total_day_phl`, `total_day_phl_nonfml` | `leave_check` local arrays | declared `PAYEDIT2A.SQL:290,327`; accumulated at `1733-1746` |
| `worker_info.long_day` | worker record field | used by Check 232 one block above; override-capable at `PAYEDIT2A.SQL:4174` |
| `record_error`, `p_error_count`, `p_error_line`, `p_error_number`, `cnt` | `leave_check` procedure params/loop var | same usage as every adjacent check |

### 3.3 Flowerbox entry (PAYEDIT2A.SQL only)

Insert after line 198 (the last `09-13-2026 INC1444350 ... (86000286)` entry), separated by a blank
line per the flowerbox's ticket-group convention:

```sql
--   09-13-2026 R. Wright: INC 1427475: N05-Sweden Company Holiday PHL whole-day increments only (new reason code 86000278)
```

Only `PAYEDIT2A.SQL` has the dated flowerbox; `PAYEDIT2C.SQL`, `PAYEDIT_PTA_2A.SQL`,
`PAYEDIT_PTA_2C.SQL` have no revision-history header (verified — consistent with all prior rounds).

### 3.4 Reason-code insert script (new file)

`patched/insert_REASONCODES_INC1427475.sql`, following
`templates/insert_REASONCODES_INC1138065.sql` / `original/insert_REASONCODES_INC1444350.sql` exactly:

- 10 `LCD.REASON_CODES` rows for `86000278` — languages `AS, AU, EN, IN, NW, NZ, PH, SA, SG, UK`,
  `ORG_CODE='999'`, dates `13-SEP-26`, `CREATED_BY_NAME='RWRIGHT28'`, `UPDATED_BY_NAME='INC1427475'`
- 1 additional `EN` row with `ORG_CODE='574'` (org-specific fallback, per 86000277/86000290 precedent)
- `commit;`
- 1 master `REASON_CODE` row: desc as above, `START_DATE 01-JAN-90`, `END_DATE 31-DEC-99`, same
  create/update stamps
- `commit;`

**Allocation verification:** `86000278` absent from the P22 `REASON_CODE` snapshot (2026-09-13),
absent from all four baseline PAYEDIT files, and absent from every pending stream
(`tasks/98-SeptRel`, `tasks/87-SWE/v3..v5`, `LCD-Oracle`) — verified by grep 2026-09-13.

---

## 4. Exact changes per file

| # | File | Location (baseline line refs) | Change |
|---|---|---|---|
| 1 | `PAYEDIT2A.SQL` | Flowerbox: after line 198, before existing blank line 199 | Insert blank + new `--   09-13-2026 R. Wright: INC 1427475: ...` line (§3.3) |
| 2 | `PAYEDIT2A.SQL` | `leave_check`, after Check 232 outer `END IF;` (line 6934) + blank line 6935 | Insert Check 249 block (§3.1) |
| 3 | `PAYEDIT2C.SQL` | `leave_check`, after Check 232 outer `END IF;` (line 6710) + blank | Insert Check 249 block (§3.1) |
| 4 | `PAYEDIT_PTA_2A.SQL` | `leave_check`, after Check 232 outer `END IF;` (line 8659) + blank | Insert Check 249 block (§3.1) |
| 5 | `PAYEDIT_PTA_2C.SQL` | `leave_check`, after Check 232 outer `END IF;` (line 8656) + blank | Insert Check 249 block (§3.1) |
| 6 | `patched/insert_REASONCODES_INC1427475.sql` | new file | Reason-code inserts (§3.4) |

**Anchor uniqueness note for the edits:** the anchor string
`86000232` → `); -- "Public Holiday leave...` → `    ` → `END IF;` → `END IF;` → blank →
`-- RdW 7/29/2026 INC 1405279...` is unique inside each file (the only other `86000232` occurrence is
a flowerbox history line in `PAYEDIT2A.SQL`, which does not match the multi-line anchor). The PTA
files' comment variant has **two** spaces after `--` (`); --  "Public Holiday...`) — the edits use
per-file exact text. Files differ only cosmetically at the insertion point; the injected block is
byte-identical everywhere, so post-patch line-count delta is identical (+27 block lines per file,
plus +1 flowerbox line in `PAYEDIT2A.SQL`; zero lines removed or modified anywhere).

**Deliberately NOT ported / NOT touched:**
- `TLS_TimeValidation.sql`, `UNIT_EDIT.bdy`, `CATS_Reason_Code_Description.sql` — 8921 is
  `UNIT_FLAG='H'` so it flows through the standard PAYEDIT `leave_check` path; no routing/dispatch
  change is needed (verified: no `N05`/`8921` handling in those files).
- The generic `ABSENCE_INCREMENT` MOD block and the round-1 balance check — untouched (surgical rule).

---

## 5. Assumptions (from Phase-1 clarifications)

| # | Assumption | Rationale | Confirmed by |
|---|---|---|---|
| 1 | New reason code is **86000278** (not 86000300) with description "Company Holiday can only be taken in whole day increments" | User-allocated; sits adjacent to round-1's 86000277 for the same ticket; verified free | User, 2026-09-13 |
| 2 | Double-fire of `86000101` + `86000278` for one bad entry is acceptable | Identical overlap already exists for India (Check 232 vs. generic MOD checks); multiple reason codes per day is normal end-to-end | User, 2026-09-13 |
| 3 | Scope gate is `pg_org_code = 'N05'` only (org), not `worker_info.currency` and not other Sweden orgs (N00/N06-N09/N14/NDE) | Ticket title says "Sweden N05"; round 1 used the same gate | Design presentation, not vetoed |
| 4 | All four PAYEDIT files including both PTA variants get the check | Round 1 touched all four; prior-timesheet adjustments must obey the same whole-day rule | Design presentation, not vetoed |
| 5 | Both `total_day_phl` and `total_day_phl_nonfml` are checked | Mirrors Check 232 exactly; 8921 (FML_FLAG='N') feeds both arrays | Design presentation, not vetoed |
| 6 | 0 hours passes; `> long_day` also fails (`<>` comparison) | Mirrors Check 232 semantics | Design presentation, not vetoed |
| 7 | Baseline = `tasks/98-SeptRel/original` (contains round 1 + INC1444350) | `patched/` verified byte-identical to `original/` pre-patch; LCD-Oracle untouched per standing instruction | Verified by cmp, 2026-09-13 |
| 8 | Check label 249 | Highest existing label is 248; 249 free in all four files | Verified by grep |

---

## 6. Test plan

Pointer to `docs_INC1427475/UTP_INC1427475/00_UTP_INDEX.md` (built in Phase 4 from the
`cvx_deluxe_harness/v2/` standalone templates). Coverage required for reason code `86000278`:
interior / exterior / boundary / edge categories, plus cross-org regression (another org with PHL
hours raising nothing new) and round-1 regression (`86000277` balance behavior preserved).

---

## 7. Back-out

### 7.1 Full back-out

1. In each of the four PAYEDIT files: delete the block from
   `-- RdW 9/13/2026 INC1427475 N05-Sweden Company Holiday whole-day increments BEGIN`
   through
   `-- RdW 9/13/2026 INC1427475 N05-Sweden Company Holiday whole-day increments END`
   inclusive (25 lines). Nothing outside the markers is touched.
2. In `PAYEDIT2A.SQL`: additionally delete the flowerbox line
   `--   09-13-2026 R. Wright: INC 1427475: N05-Sweden Company Holiday PHL whole-day increments only (new reason code 86000278)`
   and its preceding blank line.
3. Reason-code cleanup (optional; leaving the rows in place is harmless if the code is never raised):
   `DELETE FROM LCD.REASON_CODES WHERE REASON_CODE = 86000278;` and
   `DELETE FROM REASON_CODE WHERE REASON_CODE = 86000278;` + `commit;`
4. Restore from `original/` if a file-level rollback is preferred — the patch makes no other changes.

### 7.2 Selective back-out (disable the rule, keep everything else)

Wrap only the injected block body in a block comment with a dated note:

```sql
-- RdW <date> INC1427475 disabled per <reason>
/*
IF  pg_org_code = 'N05'
...
END IF;
*/
```

The `BEGIN`/`END` marker comments stay in place, making the disabled block grep-able. This is the
established modularity pattern in this codebase (see the INC1348107/INC1405279 revert/re-enable trail
in Check 233's comment history at `PAYEDIT2A.SQL:6941-6942`).
