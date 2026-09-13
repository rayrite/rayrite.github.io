---
name: lcd-brd-patch-playbook
description: Use when a user supplies a BRD (business requirements doc, PowerPoint slide extract, or markdown spec) describing new or changed validation rules for LCD Oracle PAYEDIT-family scripts (PAYEDIT2A/2C, PAYEDIT_PTA_2A/2C, UNIT_EDIT.bdy, TLS_TimeValidation.sql, or similar) and asks to turn it into a code change — "convert this BRD into a patch", "implement these validation rules", "add these reason codes to PAYEDIT", or similar. Also use when asked to build a Unit Test Plan / deployment package for an existing LCD patch. Guides the full lifecycle: BRD analysis and clarifying questions, patch-plan authoring, applying surgical patches into a backed-up "patched" folder, and generating a full interior/exterior/boundary/edge Unit Test Plan plus deployment documentation using the standalone v2 test harness templates.
---

# LCD BRD-to-Patch Playbook

Four phases, each with a hard gate before the next: **Analyze → Plan → Patch → Test & Deploy**.
Do not skip a gate because the request "looks small" — a BRD with two rows can hide the same
routing/dual-purpose-code traps a 25-rule BRD does; the ceremony scales with what you find during
analysis, not with how the request reads on first pass.

This playbook was distilled from two real tickets worked end-to-end in this repo: INC1276683
(the original MalaySing OT/Standby rules) and INC1444350 (MYSG OT-Standby Sep 2026 Changes, which
also built the v2 standalone test-harness templates this playbook now requires). Concrete file
paths below are illustrative precedent from those tickets, not hard-coded requirements — adapt
the package names, file names, and org codes to whatever the current BRD actually targets.

## Before you start: which skills stack on top of this one

- Use **superpowers:brainstorming** for Phase 1's question-asking discipline (one question at a
  time, classify scope, get explicit approval before writing anything). This playbook tells you
  *what* LCD-specific things to investigate and ask about; brainstorming tells you *how* to run
  the conversation.
- This is almost always an **Architectural**-scope task in brainstorming's classification (new
  reason codes, multiple files, a real design) — say so out loud per that skill's requirement.

---

## Phase 1 — Analyze the BRD and ask clarifying questions

**Goal:** an unambiguous, user-confirmed rule set, expressed in terms of specific reason codes,
specific time-type codes, specific org scoping, and specific day/week granularity — with every
ambiguity in the source BRD resolved by the user, not assumed by you.

### 1.1 Read everything before asking anything

- Read the BRD document(s) in full (extract text from `.pptx`/`.docx` first if that's the source
  format — use the appropriate skill for that extraction, filtering to only the rows/slides that
  are actually in scope for this ticket, e.g. rows tagged with a specific target date).
- Read the reference implementation for the **most recent prior round** of changes to the same
  module, if one exists (a previous ticket's patch plan, UTP, and patched scripts). Prior rounds
  are the single best source of: the existing package structure, the comment/tagging convention,
  the reason-code numbering sequence, and — critically — traps already paid for once that you
  should not rediscover the hard way.
- Read the **actual current code** the BRD will patch, not just docs about it. Specifically:
  - Find the module's own scope gate (e.g. an `msg_in_scope`-style function) and confirm which
    orgs/entities it covers.
  - Find every place the *same numeric code* the BRD is changing is **already used**, under a
    different org or a different meaning. Payroll/time-type code numbers get reused per-org — a
    code number is not a stable identifier of business meaning across orgs. `grep` for the raw
    code string across every file the ticket might touch, not just the one the BRD is nominally
    about.
  - Find every **routing/dispatch layer** that decides which package a given time-type code
    reaches (e.g. a unit-flag-based router that sends some codes to a different validation
    package than others). A BRD rule can be structurally unenforceable if the code carrying it
    never reaches the package you're about to patch — verify this before designing, not after.
  - Find the highest already-used reason code number in the codebase (`grep` across every SQL
    file, not just the module being patched) — new codes start at `highest + 1`.

### 1.2 Ask, one question at a time, don't assume

Common ambiguity classes seen in every BRD of this shape — check for each, and ask rather than
guess when the BRD text is silent or self-contradictory:

- **Typos/inconsistent labels in the source BRD** (a code number that doesn't match its own row,
  a copy-paste artifact). Flag it, propose the obvious correction, get a yes/no.
- **Scope boundaries the BRD implies but doesn't specify** — e.g. a closing clause referencing
  "Shift Activate codes" without giving the actual code numbers; a rule that reads like it should
  apply to a related table/slide that turns out to be unrelated to this ticket. Ask for the
  missing concrete values; don't infer them from a same-looking but out-of-scope table elsewhere
  in the same deck.
- **Day-level vs. week-level granularity.** BRD prose like "cannot use X in a week with Y" is
  ambiguous between "anywhere in the same week" and "the exact same day." Get this nailed down
  per rule — it changes the accumulator design (a running week-total vs. a per-day comparison).
- **Gating conditions with contradictory-looking phrasing** — e.g. "no cap... use existing
  non-bypass rules" in the same sentence. Ask what the actual runtime behavior should be: is this
  a scope narrowing (only *these* codes are exempt, everything else keeps current behavior) or a
  full behavior change? Get the exact precondition (what must be true, at what granularity — same
  day? same week? which day-of-week restrictions?) for any new bypass/exemption.
  before applying.
- **Double-fire acceptance.** When a new rule's condition overlaps an existing rule's condition
  (e.g. a new same-day check and an existing same-week check that can both be true for the same
  underlying conflict), don't silently suppress one — ask whether both findings firing together
  for one real-world conflict is acceptable. (It usually is: multiple reason codes per day is
  normal and already supported end-to-end in this codebase — validate that assumption for the
  target procedure the same way, by tracing `record_error` → the `time_edits_validation*` copy
  loop → any downstream UI/report layer, rather than asserting it from memory.)
- **Widening an existing check.** If the BRD requires broadening a rule that currently excludes a
  case on purpose (look for a comment explaining why), treat that comment as a design decision to
  either preserve or explicitly override — never silently delete the reasoning.

### 1.3 Present the design in sections, get approval before writing the plan

- Summarize your interpretation issue by issue (not as one big wall of text) and pause for
  confirmation after each structurally distinct piece (e.g. one BRD table/rule-family per pass).
- Once every open question is resolved, present the **complete** reason-code list (numbers,
  descriptions, which file(s) each belongs in) and the **complete** file-scope list (every file
  that needs a change, including routing/dispatch files found in 1.1) as one final consolidated
  section, and get one explicit "confirmed, proceed" before starting Phase 2.

---

## Phase 2 — Develop the patch plan

Write `docs/PATCH_PLAN_<TICKET>_<SHORT_NAME>.md`. Structure (all sections required):

1. **Header table** — Change ID, date, author, scope orgs, BRD source, new reason-code range,
   files touched, base version, comment tag convention, modularity precedent, reference
   codebases, companion-deliverable paths (reason-code script, UTP, quality audit — even though
   they don't exist yet; this doc is the index other deliverables point back to).
2. **Requirement** — restate the confirmed rule set from Phase 1 in implementation terms (per
   rule: trigger condition, granularity, new vs. reused reason code). Include any rule-interaction
   matrix that clarifies day-vs-week exclusivity for a family of related codes.
3. **Current (as-is) behavior** — cite exact existing code (function names, line-anchored
   snippets) for every piece of logic the new rules touch or reuse, including the routing layer
   found in 1.1 if it's relevant.
4. **Design** — the new declarations, new checks, and any widened existing checks, as real code
   (not prose), anchored to specific insertion points ("immediately after X", "inside the existing
   `IF pg_org_code = ... THEN` block"). Call out new local variables and confirm (by `grep`) that
   none collide with existing names in every file being touched.
5. **Exact changes per file** — one row per touched file, cross-referencing the design sections
   above to concrete anchors. Note where files are only *cosmetically* different from each other
   (debug `dbms_output` lines, package-name strings) so the same relative edit applies everywhere
   despite non-identical line numbers.
6. **Assumptions** — one row per Phase-1 clarification, with a rationale line so a future reader
   can judge whether the assumption still holds.
7. **Test plan** — pointer to the UTP (Phase 4), not the UTP itself.
8. **Back-out** — both:
   - **Full back-out**: reverse every numbered change.
   - **Selective/per-rule back-out**: since every new check should be its own self-contained
     `IF`/`END IF` block, document that any single rule can be disabled by wrapping just that
     block in `/* ... */` with a dated comment, without touching the others — this is the
     established modularity pattern in this codebase (look for a prior incident's "Reverted"/
     "Re-enabled" comment trail in the target package's own header for a worked example before
     writing this section).

**Comment convention for every injected line/block:**
`-- RdW <date> INC<ticket> <short ticket description>[: <specific detail>]`

**Flowerbox entries:** check whether the file being patched actually *has* a dated flowerbox
history at its top before promising to add one — not every file in a PAYEDIT-family package set
does (verify per file, don't assume symmetry). Where one exists, add **one line per logical
change**, not one combined line, mirroring the existing multi-round entries already in that
flowerbox.

---

## Phase 3 — Copy, back up, and apply the patch

1. **Locate or create the backup.** Check for an existing pre-patch snapshot (an `original/`
   folder or equivalent). If none exists yet, create it now by copying every file the patch plan
   touches, before making any edits — this is the reference the quality audit diffs against and
   the source the back-out plan restores from. Never edit the backup itself.
2. **Create/confirm the working copy.** Copy the same files into a `patched/` folder (or confirm
   it already exists and is still byte-identical to `original/` via a diff — don't assume a prior
   session's copy is still in sync). All edits happen in `patched/` only. Per any standing
   instruction not to touch a canonical upstream repo location (e.g. a shared `LCD-Oracle/` tree),
   confirm the canonical copy is untouched — a byte-identical diff against it is good evidence the
   workspace baseline is in sync and no drift has occurred.
3. **Apply the design from Phase 2 file by file**, using exact string matches so each edit is
   verifiable against the plan's own anchors. Re-`grep` the actual current line/anchor in the
   `patched/` copy immediately before each edit rather than trusting a line number computed
   earlier in the session — earlier edits shift later line numbers within the same file.
4. **Verify structurally after every file is done**, not just visually:
   - Diff `patched/` against `original/` per file; confirm the line-count delta is consistent
     across files that should have received the identical edit set.
   - Count `IF` vs. `END IF` (and `BEGIN` vs. `END;`) deltas between `original/` and `patched/`
     for each file — a net-new `IF` count should be exactly double the net-new `END IF` count
     under a simple word-boundary regex (because `END IF` itself contains the substring `IF`);
     anything else signals an unbalanced edit.
   - `grep` every new local variable name against the pre-patch baseline across *all* touched
     files to confirm no collision.
   - `grep` every new reason code across all touched files plus the reason-code insert script to
     confirm each appears exactly where intended (and, for any file where a rule was deliberately
     *not* ported — see the routing-layer trap in 1.1 — confirm the code number appears only in
     that file's explanatory comment, not in an actual `record_error` call).
5. **Write `docs/insert_REASONCODES_<TICKET>.sql`** (or update the equivalent path used in this
   repo), following the exact structure of the nearest prior ticket's reason-code insert script:
   one `LCD.REASON_CODES` row per language code plus the org-999/generic-fallback row, a `commit;`,
   then one master reason-code-table row, then `commit;`, repeated per new code.
6. **Write `docs/QUALITY_AUDIT_<TICKET>.md`** covering: the structural-balance table from step 4,
   the variable-collision check, an explicit list of every deliberate double-fire (confirmed in
   Phase 1) and every deliberate coverage gap (e.g. a rule that can't be enforced through a
   secondary routing path — state *why*, and where that's documented, rather than silently
   omitting it), and anything not independently re-verifiable in this environment (e.g. a live
   compile pass, or bypass behavior that depends on data not modeled by the test harness).

---

## Phase 4 — Unit Test Plan and deployment documentation

### 4.1 Test harness: use the v2 standalone templates

Build every test case from the templates in `tasks/98-SeptRel/cvx_deluxe_harness/v2/`
(`CVX_01_REGULAR_TIMESHEET_DELUXE_v2.sql` for the regular/current-timesheet path,
`CVX_02_PTA_TIMESHEET_DELUXE_v2.sql` for the PTA path) — read that folder's own
`README_v2_TEMPLATES.md` first. Do not hand-roll a lighter-weight harness; the v2 templates are
already bug-fixed (no `lcd.worker.profile` reference, correctly-sized `VARCHAR2` locals) and
standalone (zero `@@` include dependencies, one file per test, F5-runnable, ends in `ROLLBACK`).

For a batch of tests, write a small Python generator (see
`cvx_deluxe_harness/standalone/gen_1444350_standalone.py` and
`gen_1444350_pta_standalone.py` as worked examples) that:
- extracts the fixed report body once,
- takes a list of `(test_id, category, reasons, header_desc, expected, org, worker, lines)`
  tuples,
- emits one `.sql` file per test into `cvx_deluxe_harness/standalone/`, named
  `T-<TICKET>-<AREA>-<NNN>.sql` (regular) / `T-<TICKET>-PTA-<AREA>-<NNN>.sql` (PTA),
- self-checks every emitted file for: no unresolved `@@` includes, no undefined `&substitution`,
  balanced `DECLARE`/`BEGIN` vs. `/` terminator counts, and (since these bugs have bitten before)
  no reintroduced `l_profile` reference or undersized `VARCHAR2(20)` contractor/long-day locals.

### 4.2 Coverage requirement

For **every new reason code**, provide test cases covering all four categories:

| Category | Meaning |
|---|---|
| Interior | a normal, clearly-valid input that should raise nothing |
| Exterior | a normal, clearly-invalid input that should raise the code under test |
| Boundary | right at the edge of a day/week/unit rule (the last legal day, the first illegal day, exactly-vs-not-exactly a unit threshold) |
| Edge | a missing-prerequisite, an unusual-but-legal combination, or a case that proves two rules don't wrongly interact |

Also include, per module (not per code): at least one **cross-org regression** test (an unrelated
org reusing the same numeric codes raises nothing new) and one regression test per **existing**
check that a new change widens or extends, proving prior behavior is preserved where it should be.

Index every test in `docs/UTP_<TICKET>/00_UTP_INDEX.md`: one row per test with columns for
ID/filename, category, assertions covered, and an explicit **Expected Result** column — this
column is a hard requirement, not optional narrative.

### 4.3 Week-ending date selection (regular vs. PTA)

Both harnesses require the configured week-ending date to be an actual Friday — get this right
per the rule below rather than reusing a date from a prior ticket's example:

- **Regular timesheet test cases** (`CVX_01`-based): use the **nearest upcoming Friday**, or
  **today's date if today is itself a Friday**. In other words: the smallest Friday that is `>=`
  today.
- **PTA test cases** (`CVX_02`-based): use **any Friday that is at least 2 weeks (14 days) before
  today**. Compute a cutoff of `today - 14 days`, then pick the most recent Friday on or before
  that cutoff (the largest Friday that is `<=` cutoff). Any earlier Friday also satisfies the
  constraint if there's a reason to prefer it (e.g. matching a prior test's week for easier
  diffing); the 14-day-prior Friday is just the default choice absent another reason.

Before relying on either date, sanity-check it actually falls on a Friday (both v2 templates
already print a runtime warning via `TO_CHAR(l_end,'DY')` if it doesn't — don't skip past that
warning if it fires).

### 4.4 Deployment documentation

Write `docs/DEPLOYMENT_<TICKET>.md` covering:

1. **Deployment order** — the sequence scripts must be applied in (typically: reason-code insert
   script first, so the new codes exist before any patched package references them; then each
   patched package, in whatever order respects cross-file dependencies if any; note any package
   that must be recompiled after a dependency changes).
2. **Pre-deployment checklist** — confirm target environment matches the assumed baseline (e.g.
   diff the target's current package source against this ticket's `original/` snapshot before
   applying, to catch environment drift since the patch was designed).
3. **Rollback procedure** — point back to the patch plan's back-out section (both full and
   selective); do not duplicate it, cross-reference it.
4. **Post-deployment verification** — which UTP test cases to re-run against the deployed
   environment as smoke tests (a representative subset covering every new reason code at least
   once, not necessarily the full matrix), and what a passing result looks like (the TEST VERDICT
   banner + Simulation Output table each standalone script already prints).
5. **Sign-off** — who authored, who should review, and what "done" means (all UTP tests pass,
   quality audit has no open findings, target environment verification complete).

---

## Deliverables checklist

By the end of Phase 4, the ticket's folder should contain:

- `original/<files>` — untouched pre-patch baseline
- `patched/<files>` — the applied patch, plus `insert_REASONCODES_<TICKET>.sql`
- `docs/PATCH_PLAN_<TICKET>_<NAME>.md`
- `docs/QUALITY_AUDIT_<TICKET>.md`
- `docs/UTP_<TICKET>/00_UTP_INDEX.md`
- `docs/DEPLOYMENT_<TICKET>.md`
- `cvx_deluxe_harness/standalone/T-<TICKET>-*.sql` and `T-<TICKET>-PTA-*.sql` (plus their
  generator scripts, kept alongside for reproducibility)

Do not declare the ticket done with any of the above missing, and do not skip Phase 1's approval
gate to get here faster — every prior run of this playbook that produced a clean Phase 3/4 did so
because Phase 1 eliminated the ambiguity first.
