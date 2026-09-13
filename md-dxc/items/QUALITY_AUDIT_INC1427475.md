# Quality Audit — INC1427475 Round 2: N05-Sweden Company Holiday Whole-Day Increments

| Field | Value |
|---|---|
| **Audited** | 2026-09-13 |
| **Scope** | `tasks/98-SeptRel/patched/` vs `tasks/98-SeptRel/original/` |
| **Files** | `PAYEDIT2A.SQL`, `PAYEDIT2C.SQL`, `PAYEDIT_PTA_2A.SQL`, `PAYEDIT_PTA_2C.SQL`, `insert_REASONCODES_INC1427475.sql` (new) |
| **Result** | **PASS — no open findings** (see §7 for environment-limited verifications) |

---

## 1. Diff summary — purely additive

| File | Lines added | Lines removed | Lines modified |
|---|---|---|---|
| `PAYEDIT2A.SQL` | +28 (27 Check-249 block + 1 flowerbox) | 0 | 0 |
| `PAYEDIT2C.SQL` | +27 | 0 | 0 |
| `PAYEDIT_PTA_2A.SQL` | +27 | 0 | 0 |
| `PAYEDIT_PTA_2C.SQL` | +27 | 0 | 0 |

Verified with `diff original/<f> patched/<f>` — every hunk is an append (`NNaNNN`); no `<` lines
anywhere. The injected block is byte-identical across all four files (only the pre-existing
Check-232 comment above it differs cosmetically in the PTA variants, and was not altered).
A transient edit artifact (4 dropped trailing spaces on one pre-existing blank line inside the
Check-232 block) was detected and restored during patching; final diffs contain zero
modifications to existing lines.

Files deliberately untouched: `TLS_TimeValidation.sql`, `UNIT_EDIT.bdy`,
`CATS_Reason_Code_Description.sql` (diff-identical to `original/`), and the canonical `LCD-Oracle/`
tree (no writes issued at any point — all work happened under `tasks/98-SeptRel/`).

## 2. Structural balance

Word-boundary counts, `patched` minus `original`:

| File | Δ`IF` | Δ`END IF` | Ratio | Δ`BEGIN` | Δ`END` | Verdict |
|---|---|---|---|---|---|---|
| `PAYEDIT2A.SQL` | +4 | +2 | 2:1 | +2 | +4 | PASS |
| `PAYEDIT2C.SQL` | +4 | +2 | 2:1 | +2 | +4 | PASS |
| `PAYEDIT_PTA_2A.SQL` | +4 | +2 | 2:1 | +2 | +4 | PASS |
| `PAYEDIT_PTA_2C.SQL` | +4 | +2 | 2:1 | +2 | +4 | PASS |

- Δ`IF` = 4 / Δ`END IF` = 2 is exactly the expected signature of **two new `IF` statements** (each
  `END IF` keyword contains `IF`, so 2 statements → 4 `IF`-word matches vs 2 `END IF` matches) —
  the playbook's required 2:1 signature.
- Δ`BEGIN`/`END` are **comment-text only**, fully accounted for: the `-- ... BEGIN` marker (1) and
  the words "BEGIN marker"/"END marker" inside the back-out instruction comment (1 each) plus the
  two new `END IF;` lines (2). No executable `BEGIN`/`END;` blocks were added.
- No new `DECLARE`, `LOOP`, `CASE`, or `ELSIF` constructs.

## 3. Variable-collision check

The injected block declares **zero** new variables. Every symbol it references pre-exists in the
same scope (verified by grep against the pre-patch baseline):

| Symbol | Pre-existing declaration / usage in all four files |
|---|---|
| `pg_org_code` | package variable (e.g. `PAYEDIT2A.SQL:404`); already used in `leave_check` by round 1 (line 6869) |
| `total_day_phl`, `total_day_phl_nonfml` | `leave_check` locals (e.g. `PAYEDIT2A.SQL:290,327`) |
| `worker_info.long_day` | record field used by adjacent Checks 231/232/233 |
| `p_error_count`, `p_error_line`, `p_error_number`, `cnt`, `record_error` | `leave_check` parameters / loop variable, same usage as every adjacent check |

No collision possible by construction.

## 4. Reason-code placement audit

`86000278` occurrences across all deliverables (grep-verified 2026-09-13):

| Location | Count | Expected |
|---|---|---|
| `patched/PAYEDIT2A.SQL` | 2 | 1 × `record_error` + 1 × flowerbox history line |
| `patched/PAYEDIT2C.SQL` | 1 | 1 × `record_error` |
| `patched/PAYEDIT_PTA_2A.SQL` | 1 | 1 × `record_error` |
| `patched/PAYEDIT_PTA_2C.SQL` | 1 | 1 × `record_error` |
| `patched/insert_REASONCODES_INC1427475.sql` | 13 | 11 × `LCD.REASON_CODES` + 1 × master `REASON_CODE` + 1 × header comment |
| `original/` (any file) | 0 | 0 — code did not exist pre-patch |
| `TLS_TimeValidation.sql` / `UNIT_EDIT.bdy` / `CATS_*` (patched) | 0 | 0 — out of scope by design |

Insert-script structure matches the INC1138065/INC1444350 template: 11 `LCD.REASON_CODES` rows
(10 languages `AS AU EN IN NW NZ PH SA SG UK` @ `ORG_CODE='999'` + `EN` @ `'574'`), `commit;`,
1 master `REASON_CODE` row (START `01-JAN-90`, END `31-DEC-99`), `commit;`.

**Allocation uniqueness:** `86000278` absent from the P22 `REASON_CODE` snapshot (2026-09-13),
from every baseline script, and from all pending change streams (`tasks/98-SeptRel`,
`tasks/87-SWE/v3`, `v4`, `v4b`, `v5`, `LCD-Oracle`) — verified by grep before allocation.

## 5. Logic review

- **Condition** `(phl > 0 AND phl <> long_day) OR (phl_nonfml > 0 AND phl_nonfml <> long_day)` is
  structurally identical to India Check 232 (in production since INC33219685, 2024-11-25), with the
  currency gate replaced by `pg_org_code = 'N05'`. Semantics: 0 hours passes; exactly `long_day`
  passes; anything else positive (half day, quarter day, more than a full day) raises `86000278`.
- **Time type 8921 routing verified:** `UNIT_FLAG='H'` → standard hours path into `leave_check`;
  `FML_FLAG='N'` → hours accumulate into both `total_day_phl` and `total_day_phl_nonfml`, so both
  arrays are checked (mirroring Check 232). No unit-router (`UNIT_EDIT.bdy`) involvement.
- **Gate disjointness:** Check 232 (`worker_info.currency IN ('INR')`) vs Check 249
  (`pg_org_code = 'N05'`) — N05 is a Sweden org (non-INR); no worker can satisfy both gates, so the
  two checks cannot double-fire with each other.
- **Round-1 code untouched:** the `CASE WHEN pg_org_code = 'N05' THEN 86000277 ...` balance check
  and its comment trail are byte-identical to the baseline.
- **Flowerbox:** exactly one new entry, following the existing `MM-DD-YYYY R. Wright: INC NNNNNNN:`
  format, placed after the last INC1444350 entry with the established blank-line group separator.
- **Check label 249** is unused in all four files pre-patch (highest existing label: 248).

## 6. Deliberate double-fires and coverage notes (per playbook)

| Item | Status | Detail |
|---|---|---|
| `86000101` + `86000278` double-fire | **Accepted, user-confirmed 2026-09-13** | A partial-day PHL entry that also violates `MOD(total_day_phl, ABSENCE_INCREMENT)` raises both codes for the same day. Identical overlap already exists for India (Check 232 vs. the generic increment block). Multiple reason codes per day are normal end-to-end in this codebase. |
| Bucket-level vs. code-level check | **By design** | The check operates on the PHL bucket, not on time type 8921 specifically — matching the requirement wording ("assigned to the PHL leave bucket") and the architecture of every adjacent check. If a future N05 time type is also assigned to the PHL bucket, it will automatically be subject to the same whole-day rule. |
| Round-1 table inserts (8921) not in P22 snapshot | **Tracked dependency, not a defect** | `insert_tables_8921_INC1427475.sql` (87-SWE/v4b) deploys separately. Check 249 is harmless without it (no N05 PHL hours → no error). Deployment order documented in DEPLOYMENT_INC1427475.md. |

## 7. Not independently re-verifiable in this environment

1. **Live Oracle compile** of the four package bodies (no database connection available in this
   workspace). Mitigation: the injected block uses only symbols proven in-scope and mirrors the
   syntactic shape of the adjacent Check 232; a compile pass should be run in the test environment
   per the deployment doc.
2. **Runtime harness execution** — the UTP scripts (Phase 4) are delivered but not executed here;
   they are F5-runnable standalone and print a TEST VERDICT banner.
3. **N05 worker profile data** (`long_day`, `ABSENCE_INCREMENT` values for real N05 workers) —
   boundary tests parameterize `long_day` explicitly rather than relying on live profile data.
