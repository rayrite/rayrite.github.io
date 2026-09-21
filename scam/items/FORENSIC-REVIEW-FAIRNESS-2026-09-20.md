# Forensic review — fairness, bias & defamation posture of the system prompts

**Date:** 2026-09-20 · **Scope:** all system prompts in this folder — `system-prompt-scamshield-check.md`, `system-prompt-recall-check.md`, `system-prompt-corpcheck.md`, and the newly added `system-prompt-product-dig.md` (reviewed against the same rubric on arrival).

**Mandate:** ensure the prompts produce research that is balanced, unbiased, and grounded in facts; positives reported as positives; output fair and non-defamatory; no unproven or unsubstantiated claims.

## Method

Each prompt was read in full and audited against eight dimensions drawn from the mandate: (1) fabrication guards, (2) evidence tags & source tiering, (3) defamation/language discipline, (4) positives/balance mandate, (5) band-escalation discipline (no top-severity verdict on thin evidence), (6) internal consistency (rules vs. worked examples), (7) gray-zone protection, (8) absence-claim phrasing ("no record found" must never become "safe/trustworthy/reliable"). Findings were only recorded where the prompt text itself — not model behavior — permits or encourages an unfair output.

## Summary verdict

| Dimension | scamshield-check | recall-check | corpcheck | product-dig (new) |
|---|---|---|---|---|
| Fabrication guards | ✅ §9 | ✅ §3 | ✅ §8 | ✅ §9 |
| Evidence tags & tiering | ✅ §4–5 | ✅ §2, §5 | ✅ §3–4 | ✅ §3–4 |
| Defamation/language discipline | ✅ §9 | ✅ §3 | ✅ §4 | ✅ §4 |
| Positives/balance mandate | ✅ *after fix F3* | ✅ by design* | ✅ §3.6 + Balance line | ✅ §3.7 + Balance line |
| Band-escalation discipline | ✅ *after fix F2* | ✅ §5 (agency-record gate) | ✅ §5 + downgrade guard | ✅ §5 + downgrade guard |
| Rules ↔ examples consistency | ✅ *after fix F1* | ✅ | ✅ | ✅ |
| Gray-zone protection | ✅ §5 | ✅ §5 step 2 | ✅ §4 | ✅ §4 |
| Absence-claim phrasing | ✅ §6/§9 | ✅ §3 | ✅ §5 | ✅ §4 |

\* recall-check's subject is an agency-record fact, not an entity's reputation — the fairness-equivalent mechanisms are its exact "no recall record found … never as 'safe'" phrasing and the unverified-claim-is-🟡 guard, both present.

**Three defects found, all in scamshield-check, all fixed (below). recall-check and corpcheck passed clean. product-dig was built with the full fairness machinery from the start.**

## Findings & fixes

**F1 (fixed) — Example 2 contradicted the verdict-band rules; trained overcalling.** §6 defines 🔴 as "a decisive tell observed directly, or documented scam record (tier 1–4 sources)" and 🟠 as "a cluster of corroborating signals, no single decisive one." Example 2 nonetheless issued **🔴 "Scam pattern match"** on exactly such a cluster — young domain + 80%-off pricing + Zelle-only checkout + Reddit reports about *near-identical* domains — while its own confidence basis admitted "no single tier-1 record on this exact domain." Every element is a *corroborating* tell under §3, and reports about near-identical domains are inference, not a documented record about this domain. A model trained on that example learns to escalate clusters to 🔴 — the single most direct defamation pathway in the suite (🔴 "scam" attached to an unproven case). **Fix:** the example now outputs 🟠 with an explicit "stays 🟠 (§6) rather than escalating to 🔴" rationale, notes what would tip it to 🔴, and keeps practical guidance unchanged (band is severity-of-evidence, not severity-of-consequence).

**F2 (fixed) — missing downgrade guard.** corpcheck's §6 carries "a 🔴 with Low confidence (one shaky blog claim — shouldn't happen; downgrade the band instead)" and product-dig carries the same rule; scamshield-check's §7 independence examples allowed "a 🔴 can carry Low confidence (one shaky source)" with *no instruction to prefer downgrading the band*. Permitting the combination invites exactly the unsubstantiated-🔴 output the mandate prohibits. **Fix:** added the guard sentence to §7 (mirroring corpcheck's wording).

**F3 (fixed) — clean verdicts weren't required to report what checked out.** The output contract listed adverse findings but nothing obliged a 🟡/🟢 response to surface affirmative trust signals observed during the sweep (established domain age, real review history, normal pricing). Under the "if positive results are found then report as such" mandate, absence-only renderings understate honest sellers. **Fix:** §8 item 2 now requires clean-verdict responses to include the affirmative signals that checked out. (corpcheck already had the equivalent at full strength — "A response with adverse findings and no positives sweep is invalid" — which is why it passed.)

## Notes on the prompts that passed

- **recall-check** is structurally the safest of the set: its 🔴 recall-status verdict *requires* an agency (.gov) record with specifics (or ≥2 independent confirmations labeled `access-limited` when bot-walled), so a thin-evidence 🔴 cannot be produced by following the prompt. Its two-readout separation (recall status vs. content authenticity) prevents a scam-pattern finding from bleeding into a product-safety claim. The "✅" on roundup coverage is a coverage statement, not a safety band — intentional and labeled.
- **corpcheck** remains the fairness gold standard: mandatory positives sweep, Balance line, [Alleged] tag for pending suits, no-admission settlement labeling, complaint-volume scaling, gray-zone list, and the downgrade guard. One residual watch-item: §3 item 5's "scandals & controversies" query can surface tabloid-tier material; the existing tiering (slop never cited; low tiers never sufficient) is the adequate mitigation, so no edit was made.
- **product-dig (new)** was written to this rubric: complaint scaling to units sold, recall-vs-TSB-vs-class-action separation, generation/revision precision (no smearing a line for a generation's defect, no clearing a current gen by hiding a fixed predecessor's), defect-vs-wear-vs-expectation distinction, no-admission labels, positives at the same evidence standard, "absence ≠ reliability," the downgrade guard, and an explicit purpose-scoping rule (buying/ownership research only — no competitor attack dossiers).

## Residual limits no prompt text can remove

1. **Prompt ≠ behavior guarantee.** A model can still err; the guardrails raise the floor, they don't eliminate the risk. Periodic spot-checks of live outputs against the mandate are the real backstop.
2. **Search-result quality bounds grounding.** If the retrievable record for a subject is thin or polluted, the prompts report that honestly (🟡, Low confidence) — which is the correct behavior, but it means some subjects cannot be cleared *or* condemned in one pass.
3. **The examples use real, widely documented public-record arcs** (LG compressor litigation, Joy-Con drift and Nintendo's repair program, Miele's reliability reputation) described qualitatively — no dates, docket numbers, or figures are asserted anywhere in the examples, per the no-fabrication rules.
