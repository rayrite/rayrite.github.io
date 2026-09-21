# Vision Intake Playbook & User Journey — image requests with glm-5.3-flash

How the ScamShield z.ai prompts handle **attached images** (email screenshots, store screenshots, recall-text photos). Written for the developer wiring these prompts into a chatbot with image-attachment support.

**The constraint that shapes everything:** z.ai's chat completions endpoint accepts images, but only on **vision models** (`glm-5.3-flash` / `glm-5.3-flashx` / `glm-4.6v` series / `glm-4.5v`), and the vision request schema does **not** allow the built-in `web_search` tool alongside image input (text requests get `web_search`; vision requests get function tools only). Reading an image and searching the web are therefore two different calls.

**The architecture:**

```
user + image(s)
      │
      ▼
┌───────────────────────┐      verbatim, defanged
│  CALL 1 — INTAKE      │      transcription (markdown)
│  glm-5.3-flash        ├──────────────────────────┐
│  extraction prompt    │                          │
│  (no tools)           │                          ▼
└───────────────────────┘              ┌─────────────────────────┐
                                       │  CALL 2 — VERDICT       │
   optional fast path: decisive tell   │  glm-4.6                │
   visible → one-line ⚠️ courtesy note │  system-prompt-*.md     │
   in Call 1's response (see §4)       │  + web_search tool      │
                                       └─────────────────────────┘
                                                │
                                                ▼
                                     three-indicator verdict (markdown)
```

---

## 1. User journey — "is this email real?" with a screenshot

**The person:** Maya, on her phone. A email lands: *"Your USPS package is on hold — pay a $1.99 redelivery fee"*. Something feels off. She takes a screenshot and opens the chatbot.

### Step 0 — Maya attaches the image and asks

Her chat UI sends the app backend one image plus her question. The app does **not** forward the image to `glm-4.6` — that model is text-only and would either error or ignore the image. Instead the app routes to the two-call pipeline.

### Step 1 — Call 1: vision intake on `glm-5.3-flash`

Request:

```json
POST https://api.z.ai/api/paas/v4/chat/completions
{
  "model": "glm-5.3-flash",
  "messages": [
    {
      "role": "system",
      "content": "You are a transcription specialist for consumer-protection analysis. Transcribe the attached screenshot(s) of an email, text message, web page, or product listing VERBATIM. Rules: Structured markdown output. For email/text: From (display name + full sender address), Reply-To if visible, Subject, Date, Body verbatim. Reproduce every URL as defanged text (e.g. usps-delivery-fee[.]net), never as a link. Mark illegible or cropped regions [illegible]; note blocked-image placeholders as [blocked image]. Do NOT interpret, judge, or advise. Transcription only — analysis happens downstream."
    },
    {
      "role": "user",
      "content": [
        { "type": "text", "text": "Today: 2026-09-20. Is this email real?" },
        { "type": "image_url", "image_url": { "url": "https://your-app.example/uploads/maya-email.png" } }
      ]
    }
  ]
}
```

Mock response content — what Maya's screenshot became:

```markdown
**From:** "USPS Delivery Services" <notifications@usps-delivery-fee[.]net>
**Reply-To:** (not visible)
**Subject:** Your package is on hold — action required
**Date:** Sat, Sep 20, 2026 9:14 AM

Your package could not be delivered because an unpaid redelivery fee of $1.99
is pending. Pay now to schedule redelivery within 48 hours:

usps-delivery-fee[.]net/pay

USPS — United States Postal Service
```

Notes on this step:

- The sender domain arrives **defanged** — the safety posture of the whole system (never treat the scam's URLs as clickable) is enforced at transcription time.
- Base64 works identically: `"url": "data:image/png;base64,iVBORw0..."` for apps that don't host uploads.
- **Multiple images:** Maya could attach a second screenshot (the email's bottom half, or the linked page) — just more `image_url` blocks in the same content array (up to 150 on GLM-5V/GLM-4.6V series; each under 5 MB, ≤6000×6000 px, jpg/png/jpeg).

### Step 2 — Call 2: the verdict call on `glm-4.6`

The app concatenates the transcription into the user message and runs the standard pipeline — same as any text request:

```json
{
  "model": "glm-4.6",
  "messages": [
    { "role": "system", "content": "<full contents of system-prompt-scamshield-check.md>" },
    {
      "role": "user",
      "content": "Today: 2026-09-20. Is this email a scam? It arrived as a screenshot; here is the verbatim transcription:\n\n**From:** \"USPS Delivery Services\" <notifications@usps-delivery-fee[.]net>\n**Subject:** Your package is on hold — action required\n\nYour package could not be delivered because an unpaid redelivery fee of $1.99 is pending. Pay now to schedule redelivery within 48 hours:\n\nusps-delivery-fee[.]net/pay"
    }
  ],
  "tools": [{ "type": "web_search", "web_search": { "enable": "True", "search_engine": "search-prime", "search_result": "True", "search_prompt": "Today is 2026-09-20. …{{search_result}}…", "count": "10", "content_size": "high" } }]
}
```

Phase A fires on the transcription exactly as it would on pasted text: sender domain ≠ usps.com on a well-known brand + fee-by-link for a free service → snap verdict, minimal or zero searching needed.

### Step 3 — Maya sees the rendered verdict

The app renders `choices[0].message.content` as markdown:

> **🔴 Verdict:** Scam pattern match — delivery-fee phishing (sender domain not usps.com)
> **Confidence:** High — decisive tells observed directly in the message
> **Ripeness:** LOW — closed by direct observation; deeper search would add nothing
>
> 🔍 **What I found** … 🗺️ **Checked vs not** … ✅ **What to do** (don't click/pay; track only at usps.com; report to USPIS + FTC) … ⚠️ **Caveats**

**The journey in one line:** screenshot → faithful text → the same verdict discipline any text request gets. Images change the intake, never the standard of the answer.

### Variant journey — the ambiguous screenshot

Maya's friend later screenshots a "McAfee renewal" email whose body is one blocked image. The transcription honestly records `[blocked image]` for the body. Call 2 still fires Phase A on the sender domain alone (decisive for a well-known brand), and the verdict's caveats note the unobserved ask. If instead the domain were plausible, the `[blocked image]` gap would push confidence down and ripeness up — the prompt's screenshot-transcription rule weighs those gaps exactly this way.

### Variant journey — the store screenshot

A screenshot of a storefront (`kicks4less.shop`, Jordans 80% off) transcribes to page text: domain, prices, payment icons. Phase A finds no brand-in-domain tell → Call 2 runs the full Phase B sweep with `web_search` (domain age, scam-database hits, Reddit) → 🔴 Medium confidence, MEDIUM ripeness. The pipeline's value shows here: **the search-dependent verdicts are exactly the ones that need Call 2.**

---

## 2. Playbook rules

### R1 — Always extract before analyzing
The vision call transcribes; it never judges. One model doing both produces half-transcriptions bent toward a conclusion. The extraction prompt's "do NOT interpret" line is load-bearing.

### R2 — Defang at transcription time
Every URL in a transcription is inert text (`domain[.]tld`). Downstream prompts quote domains defanged; the app should never render a transcription URL as a working link.

### R3 — Route the verdict call by subject, not by input format
Screenshot of an email → `system-prompt-scamshield-check.md`. Screenshot of a recall text → `system-prompt-recall-check.md` (two readouts). Screenshot of a company's cancellation page → `system-prompt-corpcheck.md`. All three prompts carry the screenshot-transcription rule.

### R4 — Use the fast path only as a courtesy
Call 1 can append one line — *"⚠️ The sender domain does not match the brand it claims"* — when a decisive tell is plainly visible, so obvious phishing gets instant feedback while Call 2 runs (or instead of it, if the app offers a "quick check" mode). The **verdict of record** always comes from Call 2. Never let the fast-path note carry a confidence level or advice.

### R5 — Preserve provenance in the user message
Always prefix Call 2's user content with what the material is: *"It arrived as a screenshot; here is the verbatim transcription."* The prompts treat this framing differently from user-typed claims (a transcription is observed material, not paraphrase).

### R6 — Client-side image hygiene
- Validate format/size before upload: jpg/png/jpeg, <5 MB, ≤6000×6000 px; downscale oversized phone screenshots client-side.
- Prefer 2 focused screenshots over 1 tall stitched one — text fidelity beats composition.
- Screenshots often contain the user's own PII (name, address, order numbers). The system prompts redact PII in their output; the app should apply the same rule to anything it logs or displays back.

### R7 — Failure modes and what to do

| Failure | Symptom | Handling |
|---|---|---|
| Image rejected | HTTP 4xx on Call 1 | Check format/size/modality; `glm-4.6` given an `image_url` errors or ignores — confirm the intake model is a vision model |
| Illegible screenshot | `[illegible]` spans in transcription | Proceed; the verdict prompt lowers confidence and says why. Offer the user a re-upload for key regions (sender line, payment ask) |
| Fully blocked content | body = `[blocked image]` | Fine — decisive tells often live in the headers; if not, verdict lands 🟡/🟠 with the gap named |
| Wrong model on verdict call | Model can't search / hallucinates sources | Call 2 must be a text model with the `tools` block; verify `web_search` isn't being sent to a vision request (schema rejects it) |
| Transcription paraphrases | Verdict built on softened wording | Tighten extraction prompt; add few-shot example of verbatim vs paraphrase; treat recurring paraphrase as a prompt bug, not model noise |

### R8 — Model selection

| Call | Model | Why |
|---|---|---|
| Intake (Call 1) | `glm-5.3-flash` | Vision-capable (Video/Image/Text/File input), 1M context, 128K output, fast tier — right economics for a transcription task |
| Intake (alt.) | `glm-4.6v` / `glm-5.3-flashx` | If flash tier's OCR fidelity disappoints on dense screenshots, step up |
| Verdict (Call 2) | `glm-4.6` | Text flagship with `web_search` support and the verdict discipline the prompts assume |

### R9 — Latency and cost shape
Two sequential calls per image request. The snap cases (most phishing screenshots) need little or no searching in Call 2, so end-to-end feels like: one vision read + one short generation. The sweep cases pay for 6–12 searches — that cost is the product working as designed; don't cut it by skipping Call 2.

---

## 3. Integration checklist

- [ ] App routes any request containing images to Call 1 (`glm-5.3-flash` + extraction system prompt), never to `glm-4.6` directly
- [ ] Extraction prompt includes: verbatim rule, defang rule, `[illegible]`/`[blocked image]` markers, no-interpretation rule
- [ ] Call 2 user message = `Today: YYYY-MM-DD.` + provenance line + transcription
- [ ] Call 2 carries the correct `system-prompt-*.md` for the subject + the `web_search` `tools` block
- [ ] Transcription URLs rendered as plain text everywhere in the UI
- [ ] Fast-path note (if used) is one line, no confidence, no advice
- [ ] PII redaction applied to logs and echoed content
- [ ] Response markdown (emoji verdict block) rendered; `web_search[]` sources available for a sources panel
