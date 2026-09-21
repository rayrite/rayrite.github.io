# z.ai API Examples — ScamShield System Prompts + Web Search

How to call the z.ai (Zhipu GLM) chat completions endpoint with one of the three system prompts in this folder and the built-in **web search** tool enabled. Verified against [docs.z.ai/guides/tools/web-search](https://docs.z.ai/guides/tools/web-search) and [docs.z.ai/api-reference/tools/web-search](https://docs.z.ai/api-reference/tools/web-search) (checked 2026-09-20).

## The pieces

| Piece | Value |
|---|---|
| Endpoint | `POST https://api.z.ai/api/paas/v4/chat/completions` |
| Auth | `Authorization: Bearer $ZAI_API_KEY` |
| Model | `glm-4.6` recommended for multi-step search + verdict discipline (swap for a faster/cheaper GLM tier if latency matters more than depth) |
| System prompt | The full markdown content of one `system-prompt-*.md` file, as `messages[0]` with `role: "system"` |
| User message | `"Today: YYYY-MM-DD. "` prefix + the user's request (see *Date injection* below) |
| Tool | The `web_search` built-in via the `tools` parameter (below) |

### The `tools` JSON

```json
[
  {
    "type": "web_search",
    "web_search": {
      "enable": "True",
      "search_engine": "search-prime",
      "search_result": "True",
      "search_prompt": "Today is {TODAY}. You are researching for a consumer-protection background check. Prioritize authoritative sources: regulators (.gov, FTC, CFPB, FDA, USDA-FSIS, CPSC, NHTSA, CDC), court/settlement records, official company pages, BBB, and named-outlet press. Prefer dated, specific results over aggregators; ignore SEO content farms. Use {{search_result}} to answer with the key facts ranked by importance, citing the source and its date.",
      "count": "10",
      "search_recency_filter": "noLimit",
      "content_size": "high"
    }
  }
]
```

Notes (per the docs):

- `enable` / `search_result` are passed as **strings** (`"True"`), not booleans. `search_result: "True"` echoes the raw results back in the response so you can display sources.
- `search_prompt` is injected around the search results; **`{{search_result}}` is the literal placeholder** the provider replaces — keep it verbatim. Leading it with "Today is …" is the docs' own date-anchoring pattern.
- `count` = results per search; `content_size` = detail level (`"high"` recommended for verdict work); drop `search_recency_filter` to `"noLimit"` (default) so historical enforcement records aren't filtered out.
- In the response body, a top-level `web_search` array carries each result's `title`, `link`, `media`, `publish_date`, `content`, and a `refer` id (`ref_1`, …); the assistant message cites sources inline as `[Source: ref_1]`. Map those to the citations in the prompt's output contract.

### Date injection (do both)

The model's knowledge has a cutoff, and these prompts live on dates (recall status, "current" enforcement, domain age):

1. Put `Today: YYYY-MM-DD.` at the **front of the user message** — the system prompts are written to read this prefix.
2. Put `Today is YYYY-MM-DD.` at the **front of `search_prompt`** — date-anchors the search synthesis itself.

---

## Python — official `zai` SDK

```python
# pip install zai-sdk
from datetime import date
from zai import ZaiClient

client = ZaiClient(api_key="YOUR_ZAI_API_KEY")

# 1. Load the system prompt (pick one of the three)
with open("system-prompt-scamshield-check.md", encoding="utf-8") as f:
    system_prompt = f.read()

today = date.today().isoformat()  # e.g. 2026-09-20

# 2. Wire the built-in web search tool
tools = [{
    "type": "web_search",
    "web_search": {
        "enable": "True",
        "search_engine": "search-prime",
        "search_result": "True",
        "search_prompt": (
            f"Today is {today}. You are researching for a consumer-protection "
            "background check. Prioritize authoritative sources: regulators (.gov, FTC, "
            "CFPB, FDA, USDA-FSIS, CPSC, NHTSA, CDC), court/settlement records, official "
            "company pages, BBB, and named-outlet press. Prefer dated, specific results "
            "over aggregators; ignore SEO content farms. Use {{search_result}} to answer "
            "with the key facts ranked by importance, citing the source and its date."
        ),
        "count": "10",
        "search_recency_filter": "noLimit",
        "content_size": "high",
    },
}]

# 3. Send: system prompt + date-prefixed user message
user_request = "Got an email: 'Your USPS package is on hold — pay $1.99 redelivery fee: usps-delivery-fee.net'. Real?"

response = client.chat.completions.create(
    model="glm-4.6",
    messages=[
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": f"Today: {today}. {user_request}"},
    ],
    tools=tools,
)

print(response.choices[0].message.content)   # the markdown verdict response
for ref in getattr(response, "web_search", []):  # raw sources, if you render them
    print(ref.get("refer"), ref.get("title"), ref.get("link"), ref.get("publish_date"))
```

> Note the `{{search_result}}` placeholder must survive as a literal — use a plain string (as above), not an f-string, for the part containing it.

## Python — OpenAI-compatible client

z.ai exposes an OpenAI-compatible surface; the same `tools` payload passes through unchanged:

```python
# pip install openai
from openai import OpenAI
from datetime import date

client = OpenAI(
    api_key="YOUR_ZAI_API_KEY",
    base_url="https://api.z.ai/api/paas/v4/",
)

today = date.today().isoformat()

with open("system-prompt-recall-check.md", encoding="utf-8") as f:
    system_prompt = f.read()

tools = [{
    "type": "web_search",
    "web_search": {
        "enable": "True",
        "search_engine": "search-prime",
        "search_result": "True",
        "search_prompt": (
            f"Today is {today}. Consumer-safety recall research: prioritize .gov agency "
            "records (FDA, USDA-FSIS, CPSC, NHTSA), CDC investigations, state health "
            "departments, and dated press. Use {{search_result}} to answer with key "
            "facts ranked by importance, citing the source and its date."
        ),
        "count": "10",
        "search_recency_filter": "noLimit",
        "content_size": "high",
    },
}]

response = client.chat.completions.create(
    model="glm-4.6",
    messages=[
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": f"Today: {today}. was Silk almond milk recalled? I have a carton."},
    ],
    tools=tools,
)

print(response.choices[0].message.content)
```

## curl

```bash
TODAY=$(date +%F)   # e.g. 2026-09-20
SYSTEM=$(cat system-prompt-corpcheck.md)

curl -s https://api.z.ai/api/paas/v4/chat/completions \
  -H "Authorization: Bearer $ZAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d "$(jq -n \
    --arg sys "$SYSTEM" \
    --arg user "Today: $TODAY. background check Planet Fitness before I join" \
    --arg sp "Today is $TODAY. Consumer-protection company research: prioritize regulators (.gov, FTC, CFPB, state AG), court/settlement records, BBB, named-outlet press. Prefer dated, specific results. Use {{search_result}} to answer with key facts ranked by importance, citing the source and its date." \
    '{
      model: "glm-4.6",
      messages: [
        {role: "system", content: $sys},
        {role: "user",   content: $user}
      ],
      tools: [{
        type: "web_search",
        web_search: {
          enable: "True",
          search_engine: "search-prime",
          search_result: "True",
          search_prompt: $sp,
          count: "10",
          search_recency_filter: "noLimit",
          content_size: "high"
        }
      }]
    }')"
```

`jq` builds the JSON safely (markdown and quotes survive); pipe the response through `jq -r '.choices[0].message.content'` for the rendered markdown, and `.web_search[]` for the source list.

## Response shape (what comes back)

```json
{
  "choices": [{
    "message": {
      "role": "assistant",
      "content": "**🔴 Verdict:** Scam pattern match — delivery-fee phishing…\n**Confidence:** High — …\n**Ripeness:** LOW — …"
    }
  }],
  "web_search": [
    {
      "content": "…snippet…",
      "icon": "…",
      "link": "https://…",
      "media": "FTC",
      "publish_date": "2026-08-30",
      "refer": "ref_1",
      "title": "USPS fee scam alert"
    }
  ],
  "usage": { "prompt_tokens": 0, "completion_tokens": 0, "total_tokens": 0 }
}
```

Render `choices[0].message.content` as markdown (emoji verdict block included); use `web_search[]` if your app displays a sources panel alongside it.

## Vision intake — screenshots & images (two-call pipeline)

The endpoint accepts images, **on vision models only** (`glm-5.3-flash`, `glm-5.3-flashx`, `glm-4.6v` series, `glm-4.5v`), and the vision request schema does **not** allow the built-in `web_search` tool alongside image input (text requests get `web_search`/`retrieval`; vision requests get function tools only). So an image request runs as two calls:

1. **Intake (vision):** `glm-5.3-flash` + a short extraction prompt → verbatim, defanged transcription of the screenshot(s).
2. **Verdict (text):** `glm-4.6` + one of the system prompts + the `web_search` tool → the standard three-indicator response.

Image constraints per the API reference: **jpg / png / jpeg · under 5 MB per image · ≤6000×6000 px · up to 150 images per request** (GLM-5V/GLM-4.6V series; GLM-4.5V caps at 50). URLs or base64 data URIs both work in `image_url.url`.

### Call 1 — vision extraction (Python)

```python
# pip install zai-sdk
from zai import ZaiClient
from datetime import date

client = ZaiClient(api_key="YOUR_ZAI_API_KEY")
today = date.today().isoformat()

EXTRACTION_PROMPT = """You are a transcription specialist for consumer-protection analysis.
Transcribe the attached screenshot(s) of an email, text message, web page, or product
listing VERBATIM. Rules:
- Structured markdown output. For email/text: From (display name + full sender address),
  Reply-To if visible, Subject, Date, Body verbatim.
- Reproduce every URL as defanged text (e.g. usps-delivery-fee[.]net), never as a link.
- Mark illegible or cropped regions [illegible]; note blocked-image placeholders as
  [blocked image].
- Do NOT interpret, judge, or advise. Transcription only — analysis happens downstream."""

response = client.chat.completions.create(
    model="glm-5.3-flash",                     # vision-capable intake model
    messages=[
        {"role": "system", "content": EXTRACTION_PROMPT},
        {"role": "user", "content": [
            {"type": "text", "text": f"Today: {today}. Is this email real? (2 screenshots attached)"},
            {"type": "image_url", "image_url": {"url": "https://your-app.example/uploads/email_top.png"}},
            {"type": "image_url", "image_url": {"url": "https://your-app.example/uploads/email_body.png"}},
        ]},
    ],
)

transcript = response.choices[0].message.content  # → feed into Call 2
```

### Call 2 — verdict with search (Python)

```python
with open("system-prompt-scamshield-check.md", encoding="utf-8") as f:
    system_prompt = f.read()

tools = [{ /* the web_search tool JSON from the top of this file, unchanged */ }]

response = client.chat.completions.create(
    model="glm-4.6",
    messages=[
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": (
            f"Today: {today}. Is this email a scam? "
            f"It arrived as screenshots; here is the verbatim transcription:\n\n{transcript}"
        )},
    ],
    tools=tools,
)
print(response.choices[0].message.content)
```

### curl — both calls

```bash
TODAY=$(date +%F)
ZAI="https://api.z.ai/api/paas/v4/chat/completions"
AUTH="Authorization: Bearer $ZAI_API_KEY"

# Call 1: vision intake (image as public URL — or data:image/png;base64,$(base64 -w0 shot.png))
curl -s $ZAI -H "$AUTH" -H "Content-Type: application/json" -d "$(jq -n \
  --arg sp "You are a transcription specialist for consumer-protection analysis. Transcribe the attached screenshot(s) VERBATIM. Structured markdown: From (display name + sender address), Reply-To if visible, Subject, Date, Body. Reproduce every URL as defanged text (e.g. usps-delivery-fee[.]net), never as a link. Mark illegible/cropped regions [illegible]; blocked-image placeholders as [blocked image]. Do NOT interpret or advise." \
  '{model: "glm-5.3-flash",
    messages: [
      {role: "system", content: $sp},
      {role: "user", content: [
        {type: "text", text: "Today: '"$TODAY"'. Is this email real?"},
        {type: "image_url", image_url: {url: "https://your-app.example/uploads/email.png"}}
      ]}
    ]}')" | jq -r '.choices[0].message.content' > transcript.md

# Call 2: verdict call — system prompt + transcription + web_search (as in the curl section above)
SYSTEM=$(cat system-prompt-scamshield-check.md)
TRANSCRIPT=$(cat transcript.md)
# ...same jq payload as the main curl example, with the user content:
#   "Today: $TODAY. Is this email a scam? It arrived as a screenshot; verbatim transcription:\n\n$TRANSCRIPT"
```

**Fast path:** when a decisive Phase-A tell is plainly visible in the screenshot (sender domain ≠ the claimed brand), Call 1 alone can carry the snap verdict — append to the extraction prompt: *"After the transcription, if the sender/claim domain clearly does not match the well-known brand it claims, add a one-line ⚠️ note stating only that. Otherwise add nothing."* Keep the real verdict in Call 2; the note is a UX courtesy for the obvious cases. Full walkthrough with payloads: `vision-intake-playbook.md`.

## Tuning per prompt

| Prompt | `count` | `search_recency_filter` | Notes |
|---|---|---|---|
| scamshield-check | `"10"` | `noLimit` (need old scam reports too) | For "is this email a scam" snapshots, `content_size: "high"` matters less — Phase A often needs no search at all |
| recall-check | `"10"` | `noLimit` for lookups; `"month"`/`"week"` acceptable for Mode-1 roundups | Roundups benefit from recency filtering; historical lookups must not use it |
| corpcheck | `"10"` | `noLimit` | Enforcement records can be years old — never recency-filter them away |

Keep `temperature` low (0.1–0.3) if your client exposes it — verdict discipline over creativity.
