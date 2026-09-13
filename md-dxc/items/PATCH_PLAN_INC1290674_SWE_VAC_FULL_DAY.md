# Patch Plan — INC1290674: N05-Sweden VAC Full Day Increment Restriction (re-application, reason code 86000276)

| Field | Value |
|---|---|
| **Change ID** | INC1290674 (re-application of a backed-out change) |
| **Date applied** | 2026-09-13 (original change authored 8/20/2026; re-anchored and dated 9/13/2026 per instruction) |
| **Author** | R. Wright |
| **Scope org** | `N05` (Sweden) |
| **Reason code** | `86000276` — "Vacation leave can only be taken in full day increments" (allocated by the original 8/20 change; no new allocation) |
| **Check label** | `Check: 276` (free in this baseline; historical identity preserved from the original change) |
| **Files touched** | `patched/PAYEDIT2A.SQL`, `patched/PAYEDIT2C.SQL`, `patched/PAYEDIT_PTA_2A.SQL`, `patched/PAYEDIT_PTA_2C.SQL` (body blocks) + flowerbox entry in PAYEDIT2A |
| **New script** | `patched/insert_REASONCODES_INC1290674.sql` (idempotent — see §6) |
| **Baseline** | `original/` (= the 98-SeptRel rolling baseline: LCD-Oracle snapshot + INC1444350 + INC1427475 rounds 1–2; verified identical to `patched/` except for this change) |
| **Source of the change** | `INC1290674/old_patched/` — the backed-out patched set |
| **Comment tag** | `-- RdW 9/13/2026 INC1290674 N05-Sweden VAC Full Day Increment Restriction` … `-- END RdW 9/13/2026 INC1290674` |

---

## 1. Requirement

Sweden (N05) workers must take **vacation leave (VAC) in full-day increments only**: per day,
VAC hours must be `0` or exactly `worker_info.long_day`. Any other positive VAC amount raises
reason code **86000276**. Half-day VAC increments are not permitted for N05 (unlike India's
Check 233, which allows half **or** full days for its org family).

This is a **re-application**: the identical rule was authored 8/20/2026, shipped in the 87-SWE
v4 stream, and backed out at the last minute. Per instruction, only the change associated with
reason code 86000276 is re-applied here, with all INC1290674 markers dated **9/13/2026**
(today) rather than the original 8/20/2026.

## 2. Source lineage — what `old_patched/` is and is not

`INC1290674/old_patched/` was verified (2026-09-13) **byte-identical, modulo carriage returns,
to `tasks/87-SWE/v4/INC1290674_patched_20260827/`** for all four PAYEDIT files (`diff
--strip-trailing-cr` → +0/−0 on each). It is the backed-out v4 patched set.

That set was built on the **87-SWE v4 snapshot**, which is a *divergent* baseline from
98-SeptRel's (≈1164 changed lines per file; it lacks INC1444350 and other 98-SeptRel content,
and carries its own v4-only changes). A wholesale copy was therefore impossible: the Check 276
block was **extracted and re-anchored** onto the current `patched/` files, with the block's
text otherwise unchanged.

**Deliberately excluded** from `old_patched/` (present there but NOT applied):

| Excluded content | Why it is out of scope |
|---|---|
| `-- RdW 8/27/2026 INC1296074 … Check N05-B` (all non-VAC leave buckets, re-using 86000101), which in `old_patched/` immediately follows the Check 276 block | A different ticket; the instruction was to apply only the 86000276 change |
| All other v4-only differences vs the 98-SeptRel baseline (INC1276683 rounds, INC1427500, etc.) | Already present in 98-SeptRel's own baseline where applicable, or superseded |

Post-application grep: `INC1296074` occurs **0** times in `patched/`.

## 3. Current (as-is) behavior (before this patch)

- In all four `patched/` bodies, the day loop (`FOR cnt IN 1..7`) of `leave_check` runs its
  India increment checks (Check 232/233 region), closes with the comment pair
  `-- END Check 233 (…)` / `-- disabled per INC1348107)`, then a blank line, then the
  MalaySing shutdown block (`-- RdW 6/16/25 INC0952194 … Malaysia/Singapore shutdown`, Check 240+).
- **No N05 VAC increment restriction existed**: an N05 worker could enter any positive VAC
  amount for a day (fractional or whole-hour) with no whole-day requirement. Only the generic
  increment check (86000101, `ABSENCE_INCREMENT`) and vacation balance/borrow checks applied.
- `Check: 276` and `86000276` were both **free** in this baseline (0 occurrences in all four
  files before this patch).

## 4. Design — the applied block

Inserted verbatim from the original change (executable statements byte-identical to the 8/20
version; only the two RdW tag dates changed to 9/13/2026), as a self-contained standalone
block between the Check 233 tail comment and the MalaySing shutdown comment — the same
relative position the original design chose (after the India checks conclude, before the
MalaySing checks begin), so it can be independently located and backed out by deleting the
block only. Regular-path style shown (2A/2C); the two PTA files use their house two-space
comment style (`--  Check: 276.`, `); --  "Vacation…`) — executable lines identical:

```sql
              -----------------------------------------------------------------------
              -- RdW 9/13/2026 INC1290674 N05-Sweden VAC Full Day Increment Restriction
              -- Check: 276. Sweden (N05) workers: vacation leave must be taken in full
              -- day increments only. Appended here as its own standalone block (after
              -- the India checks conclude, before the MalaySing checks begin) rather
              -- than interleaved with either, so it can be independently located and
              -- backed out by deleting this block only.
              -- Unlike India's Check 233 (half or full day), N05 does not permit a
              -- half-day VAC increment - full day or nothing.
              -----------------------------------------------------------------------
              IF  pg_org_code = 'N05'
              THEN
                IF  total_day_vac(cnt) > 0 AND
                    total_day_vac(cnt) <> worker_info.long_day
                THEN
                   record_error (
                      p_error_count,
                      p_error_line,
                      p_error_number,
                      cnt,
                      86000276
                   ); --"Vacation leave can only be taken in full day increments"
                END IF;
              END IF;
              -- END RdW 9/13/2026 INC1290674
              -----------------------------------------------------------------------
```

**No new declarations.** The block uses only symbols already in scope in every file:
`pg_org_code`, `total_day_vac(cnt)` (the per-day VAC-hour accumulator), `worker_info.long_day`,
and `record_error`'s existing parameter list. Verified no name collisions by construction
(nothing is declared).

**Rule interactions (all pre-existing behavior, no suppression added):**

| Neighbor check | Relationship |
|---|---|
| India Check 233 (VAC/PB/LV/UPD half-or-full, 86000233) | Mutually exclusive by org gate — Check 233 applies to the India family (INR orgs, e.g. 663), Check 276 only to N05 |
| Generic 86000101 (`ABSENCE_INCREMENT`) | Can co-fire on fractional VAC hours (N05 increment assumed 1 → fires only on non-whole hours); accepted multiple-codes-per-day behavior, same overlap family as INC1427475 |
| Vacation balance/borrow checks | Independent — Check 276 says nothing about balance; a balance violation and an increment violation can both appear for one day |
| INC1427475 Check 249 (PHL whole-day, 86000278) | Different bucket (PHL/Company Holiday 8921 vs VAC) — per-day independent, may co-fire on the same day if both buckets are mis-incremented |

## 5. Exact changes per file

All four edits are the identical relative change; only comment spacing differs (PTA = two-space
style). "Anchor" = the line before the inserted region in the pre-edit file.

| File | Insertion point (pre-edit lines) | Change |
|---|---|---|
| `patched/PAYEDIT2A.SQL` | after line 7407 `-- disabled per INC1348107)` + its blank line | Insert blank + 26-line Check 276 block (one-space comment style) before `-- RdW 6/16/25 INC0952194` (was line 7409). **Plus** flowerbox line 201: `--   09-13-2026 R. Wright: INC 1290674: N05-Sweden VAC Full Day Increment Restriction (re-applied; new reason code 86000276)` (immediately after the INC 1427475 entry) |
| `patched/PAYEDIT2C.SQL` | after line 7182 `-- disabled per INC1348107)` + blank | Same 26-line block (one-space style), before `-- RdW 6/16/25 …` (was line 7184). No flowerbox (2C carries none) |
| `patched/PAYEDIT_PTA_2A.SQL` | after line 9131 `--  disabled per INC1348107)` + blank | Same block, **two-space comment style** (`--  Check: 276.`, `); --  "Vacation…`), before `--  RdW 6/16/25 …` (was line 9133). No flowerbox |
| `patched/PAYEDIT_PTA_2C.SQL` | after line 9128 `--  disabled per INC1348107)` + blank | Same as PTA_2A (was line 9130). No flowerbox |

Structural verification (run 2026-09-13, `diff --strip-trailing-cr original/ patched/`):

| File | Diff | Net-new IF statements | Δ`IF` tokens : Δ`END IF` (word-boundary) | `Check: 276` | `86000276` | `RdW 9/13/2026 INC1290674` tags |
|---|---|---|---|---|---|---|
| PAYEDIT2A | **+28 / −0** (27-line block region + 1 flowerbox line) | 2 | 4 : 2 = 2:1 ✓ | 1 ✓ | 2 (flowerbox + `record_error`) ✓ | 2 ✓ |
| PAYEDIT2C | **+27 / −0** | 2 | 4 : 2 ✓ | 1 ✓ | 1 ✓ | 2 ✓ |
| PAYEDIT_PTA_2A | **+27 / −0** | 2 | 4 : 2 ✓ | 1 ✓ | 1 ✓ | 2 ✓ |
| PAYEDIT_PTA_2C | **+27 / −0** | 2 | 4 : 2 ✓ | 1 ✓ | 1 ✓ | 2 ✓ |

All diffs purely additive; zero deletions; `8/20/2026 INC1290674` and `INC1296074` remnants: 0.

## 6. Reason-code script — why it is idempotent

`patched/insert_REASONCODES_INC1290674.sql` re-creates the original 8/20 row set (source:
`tasks/87-SWE/v3/INC1276883_patched_20260826/insert_REASONCODES_INC87SWE.sql`, lines 11–25):
10 languages (`AS AU EN IN NW NZ PH SA SG UK`) at `ORG_CODE 999` + the `EN/574` fallback row
in `LCD.REASON_CODES`, then the master `REASON_CODE` row (`START_DATE 01-JAN-90`,
`END_DATE 31-DEC-99`).

**Critical difference from a normal insert script:** the P22 snapshot of the master
`REASON_CODE` table taken 2026-09-13 (`tables/LCD_REASON_CODE_P22_20260913.xlsx`) still
contains 86000276 — created 20-AUG-26 by RWRIGHT28/INC1290674. The back-out removed the
package bodies' code but **not** the reason rows (at least not the master row; no P22 snapshot
exists for `LCD.REASON_CODES`, so its state is unknown). A blind re-run of the original INSERT
script would fail on any surviving row. The new script therefore guards every row with
`insert … select … from dual where not exists (…)` keyed on the row's own identity
(code + language + org; code alone for the master table), and ends with verification queries
that show provenance — rows that survived the back-out keep their 20-AUG-26 CREATE_DATE, rows
newly inserted carry 13-SEP-26; a mixed result is expected and correct.

*(Convention note: reason-code insert scripts for this release stream live in `patched/`,
alongside the package bodies — the INC1427475 script was relocated from `original/` to
`patched/` on 2026-09-13 to match every doc reference to it.)*

## 7. Test plan (scoped for this re-application)

Per the instruction, this task is the surgical re-application of a previously tested change —
no new UTP set was generated. The executable statements are byte-identical to the v4 change
that already went through the 87-SWE stream's testing; only comment dates differ. Coverage
status and how to exercise the rule if needed:

- **Reuse/adapt the INC1427475 harness** (`docs_INC1427475/UTP_INC1427475/` generators): swap
  the time type from 8921 (PHL) to N05's VAC-bucket time type and the expected reason from
  86000278 to 86000276. The four UTP categories map directly — Interior (VAC = `long_day`),
  Exterior (VAC = 4.00), Boundary (7.50 fractional → 86000276 + 86000101 dual-fire; 9.00
  over-usage), Edge (cross-org: India org raising 86000233, not 86000276; PTA route via edit
  type 'C').
- **Smoke check after deploy** (any environment): an N05 worker with VAC = 4.00 on one day
  must produce one 86000276 finding for that date; VAC = `long_day` must produce none; a
  non-N05 org must never produce 86000276.
- No live Oracle compile or harness execution was possible in the authoring environment
  (same caveat as the INC1427475 quality audit) — first compile happens at deployment.

## 8. Back-out

**Full back-out** — delete, in each of the four files, the inserted region between (and
including) the blank line after `-- (…) disabled per INC1348107)` up to and including the
trailing `-------` line of the block — i.e. precisely the 27-line region; restore the blank
line + `-- RdW 6/16/25 INC0952194 …` adjacency. Remove the PAYEDIT2A flowerbox line 201.
`original/` is the file-level restore source.

**Selective back-out (disable the rule only)** — the established modularity pattern: wrap just
the block's executable statements (`IF  pg_org_code = 'N05'` through the second `END IF;`) in
`/* … */` with a dated note, e.g. `-- RdW <date> INC1290674 disabled per <incident>`, leaving
comments and all other checks intact.

**Reason-code rows** — optional to delete; harmless if left in place (an allocated-but-unused
reason code affects nothing). If removed: `DELETE FROM LCD.REASON_CODES WHERE
REASON_CODE = 86000276;` `DELETE FROM REASON_CODE WHERE REASON_CODE = 86000276;` `commit;` —
but only after confirming no other stream re-used the allocation (it had not as of the
2026-09-13 P22 snapshot). Because the master row predates this re-application (survived the
back-out), deleting it also erases the original 8/20 provenance — prefer leaving the rows.
