# z.ai ScamShield Prompts (2026-09)

Single-pass system prompts converting four staged research skills into self-contained prompts for **z.ai API calls** (Zhipu GLM models with the built-in `web_search` tool). Built 2026-09-20 from:

- `rdw-scamshield-check-v2` → **system-prompt-scamshield-check.md** (e-commerce content: listings, stores, social ads, suspicious emails, sellers)
- `rdw-scamshield-recall-check-v2` → **system-prompt-recall-check.md** (US product/food recalls: dual-mode roundup + lookup)
- `rdw-scamshield-tea2-corpcheck` → **system-prompt-corpcheck.md** (companies/brands: dark-pattern record with friction-based severity)
- `rdw-product-dig` → **system-prompt-product-dig.md** (physical products — cars, electronics, appliances: reliability, owner sentiment, defect/warranty history, recalls + how to respond)

## Files

| File | Purpose |
|---|---|
| `system-prompt-scamshield-check.md` | Paste-ready system prompt — e-commerce scam/seller vetting |
| `system-prompt-recall-check.md` | Paste-ready system prompt — recall roundup & lookup |
| `system-prompt-corpcheck.md` | Paste-ready system prompt — company dark-pattern background check |
| `system-prompt-product-dig.md` | Paste-ready system prompt — product reliability & ownership check (recall-response box included) |
| `FORENSIC-REVIEW-FAIRNESS-2026-09-20.md` | Audit of all prompts for balance, bias & defamation posture — findings + fixes applied |
| `zai-api-examples.md` | Python (zai SDK + OpenAI-compatible) and curl snippets with the `web_search` tool wired in, plus response-shape, vision-intake, and tuning notes |
| `vision-intake-playbook.md` | Playbook + user journey for image requests: screenshot → `glm-5.3-flash` transcription intake → `glm-4.6` verdict call (web_search can't ride with images, so it's a two-call pipeline) |

## What "single pass" means here

Each prompt runs **one** bounded research pass per request: a zero-search static smoke test first (decisive tells → snap verdict), then — only if needed — a 6–12 query web sweep ordered high-severity first, and one final response. No stages, no gate commands, no report files, no research ledger — those are the source skills' multi-stage machinery, deliberately dropped. The prompt *may* ask one clarifying question when the subject is genuinely ambiguous; "single pass" describes the final response shape, not a ban on disambiguation.

## The output contract — three independent indicators

Every response ends with three (corpcheck and product-dig: four) separate indicator lines, each with its own basis:

- **Verdict** 🟢🟡🟠🔴 — *what the evidence shows* about the subject
- **Confidence** High/Medium/Low — *how well-evidenced the verdict is* (corroborating-source count × source tier/reputation × independence × consistency × recency)
- **Ripeness** HIGH/MEDIUM/LOW — *would deeper research pay?* (signal diversity and unexplored threads; plain words, no traffic-light color, so it never blends with the verdict)

The prompts explicitly forbid merging them, deriving one from another, or computing a composite: a 🔴 scam verdict can carry Low confidence; a 🟢 clean record can carry High confidence; a closed snap case is LOW ripeness while an sprawling 🟠 controversy is HIGH. Corpcheck and product-dig add a fourth line — **Balance** (Adverse-leaning / Mixed / Favorable) — because their mandates are weighed, one-sided-never reporting (see the forensic review for how that fairness posture was audited).

## Using them

1. Pick the prompt matching the request type; send its full markdown as the `system` message.
2. Prefix the user message with `Today: YYYY-MM-DD.` — the prompts read it to anchor time-sensitive queries.
3. Enable the built-in web search via the `tools` parameter (exact JSON, date-anchored `search_prompt`, and SDK/curl examples: `zai-api-examples.md`).
4. Render `choices[0].message.content` as markdown; the `web_search[]` array in the response carries the raw sources if your app shows a sources panel.
5. **Image/screenshot requests:** images need a vision model, and `web_search` can't be combined with image input — run the two-call pipeline in `vision-intake-playbook.md` (`glm-5.3-flash` transcription intake → `glm-4.6` verdict call).

## Differences from the source skills (what was dropped / changed)

- **Dropped:** staged verify passes, go/stop gates, research ledger, report files, coverage-map tables (reduced to a one-line "checked vs not"), the recall overview-map pipeline (API output is text), and product-dig's 12-vein map + 0–100 ripeness gauge (folded into one severity-ordered sweep + HIGH/MEDIUM/LOW ripeness).
- **Changed:** verdict + confidence are now printed as separate lines (the skills fused them: "🔴 High (snap)"); ripeness is restated as HIGH/MEDIUM/LOW with a one-line basis instead of the skills' 0–100 gauge.
- **Kept:** smoke-test snap logic with false-positive guards, source tiering, evidence tags ([Documented]/[Reported]/[Inferred]), gray-zone protections, agency routing (recall; product-dig routes NHTSA vs CPSC), two-readout separation (recall), the balanced-reporting mandate (corpcheck, product-dig), "one product = one dig" with model-number/generation precision (product-dig), and all safety rules (static analysis only for suspect email, passive site inspection, no fabrication, defense-only posture, PII redaction).
