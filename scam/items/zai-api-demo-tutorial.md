# Z.ai API Demo — Complete Beginner Walkthrough (Phases 1 & 2)

**Opened:** 2026-09-20 · **Thread:** planb_chatui · **Status:** deliverable

Step-by-step build of a webserver-hosted demo: browser chat UI → your Python
server → Z.ai GLM API, with **function calling**, **built-in web search**, and a
**home-grown Agent Skills harness** (the "SKILL.md" pattern). Written for a
complete beginner — every command and file is given in full.

Final file layout:

```
planb_chatui/demo/
├── .env                  # your secret API key (never committed)
├── .gitignore            # tells git what to skip
├── requirements.txt      # Python dependencies
├── server.py             # the whole backend (one file)
├── static/
│   └── index.html        # the whole frontend (one file)
└── skills/
    └── scam-report-writer/
        └── SKILL.md      # your first agent skill
```

---

## The 60-second mental model (read this first)

Three computers are involved, and it matters which one runs what:

```
[Browser]  ──HTTP──▶  [Your webserver]  ──HTTPS──▶  [Z.ai's API]
 (user)                (runs YOUR code)              (runs the MODEL)
```

- **Z.ai hosts the model.** You never install or host GLM. You just send HTTP
  requests to `https://api.z.ai/api/paas/v4/` with your API key, like calling
  any web API.
- **Your webserver is the middleman.** The browser never talks to Z.ai
  directly. Why: (1) your API key is a secret — anyone who gets it spends your
  money — and a key placed in browser JavaScript is visible to every user;
  (2) the browser is on a different "origin" than Z.ai, which triggers CORS
  blocks. Putting your server in the middle solves both problems at once.
- **Tool calling is a conversation, not a feature flag.** You *describe* tools
  (functions) to the model. When the model wants to use one, it does NOT run
  anything — it replies with a structured "please call `lookup_scam_report`
  with these arguments" message. YOUR code executes the function and sends the
  result back, then the model writes the final answer. The model thinks; you act.
- **Skills are just markdown files plus your code that loads them.** There is
  no `skills=` API parameter. A skill = a folder with a `SKILL.md` (a name, a
  one-line description, and instructions). Your server tells the model the
  skill catalog; the model asks to "load" one when a task matches; your server
  pastes the instructions into the conversation. That's the whole trick.

Two Z.ai facts that shape everything below:

- **GLM-5.x always reasons** ("thinking" cannot be turned off). We pass
  `reasoning_effort="low"` to keep demo responses fast and cheap.
- **`tool_choice` only supports `"auto"`** on Z.ai. Don't try `"required"` or
  named forcing.

---

# PHASE 1 — MVP: webserver + tool calling + web search (~2 h)

## Task 1 — Get your Z.ai API key (5 min)

1. Go to **https://z.ai**, sign in / sign up.
2. Open the developer console → **API Keys** page → create a key.
3. Copy it somewhere safe. It looks like a long random string `xxxxxxxx...`.

Treat it like a password. Anyone holding it can spend your credits.

## Task 2 — Smoke-test the key with one curl call (5 min)

**Done when:** you get a JSON reply containing an answer string.

Open your terminal (Git Bash) and run — replace `YOUR_KEY`:

```bash
curl https://api.z.ai/api/paas/v4/chat/completions \
  -H "Authorization: Bearer YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"glm-5.2","messages":[{"role":"user","content":"Say hello in exactly five words."}],"reasoning_effort":"low"}'
```

What each piece does:

| Piece | Meaning |
|---|---|
| URL `.../chat/completions` | The chat endpoint (OpenAI-compatible shape) |
| `Authorization: Bearer ...` | How you authenticate — the key rides in a header |
| `"model":"glm-5.2"` | Which model answers. `glm-5.2` = current cost/speed sweet spot; `glm-5.3` = flagship |
| `"messages":[...]` | The conversation so far. `role` is `system`/`user`/`assistant`/`tool` |
| `"reasoning_effort":"low"` | Shallow thinking → faster, cheaper reply |

The reply JSON contains `choices[0].message.content` — the model's answer.

**If this fails, stop and fix before continuing:**
- `401` → key wrong/missing. `model not found` → typo in model id.
- Windows note: the command above is written for Git Bash (your shell). In
  PowerShell the single quotes need changing — just use Git Bash.

## Task 3 — Backend skeleton: a 30-line webserver (30 min)

**Done when:** `http://localhost:8000` loads and `POST /api/chat` returns a reply.

### 3.1 Install Python (skip if you have it)

Check: `python --version`. You want **3.10 or newer**. If missing, install
from python.org (check "Add python.exe to PATH" during install).

### 3.2 Create the project and a virtual environment

A *virtual environment* is a private Python package folder per project, so
this demo's libraries don't pollute your machine.

```bash
cd "D:/stuff/ai-misc/_bsh2026/vscode_project01/70/planb_chatui"
mkdir -p demo/static
cd demo
python -m venv .venv
source .venv/Scripts/activate     # Git Bash (Windows)
```

(If you ever use cmd instead: `.venv\Scripts\activate.bat`. PowerShell:
`.venv\Scripts\Activate.ps1`.)

You should now see `(.venv)` at the start of your prompt.

### 3.3 Install the three libraries you need

```bash
pip install fastapi uvicorn openai python-dotenv
```

- **fastapi** — turns Python functions into HTTP endpoints.
- **uvicorn** — the program that runs your fastapi server.
- **openai** — the OpenAI SDK. We point it at Z.ai by changing its base URL,
  because Z.ai's API speaks the same protocol. (Z.ai also has its own
  `zai-sdk`; the OpenAI one is more widely documented, so we use it.)
- **python-dotenv** — loads your `.env` file.

### 3.4 Create `.env` (the secret)

In the `demo` folder, create a file named exactly `.env` containing one line:

```
ZAI_API_KEY=paste-your-real-key-here
```

### 3.5 Create `requirements.txt`

Pins the libraries so a deploy server installs the same ones:

```
fastapi
uvicorn
openai
python-dotenv
```

### 3.6 Create `server.py`

```python
import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from openai import OpenAI
from pydantic import BaseModel

load_dotenv()  # reads .env and puts ZAI_API_KEY into the environment

client = OpenAI(
    api_key=os.environ["ZAI_API_KEY"],
    base_url="https://api.z.ai/api/paas/v4/",  # <-- the only line that makes it Z.ai instead of OpenAI
)

app = FastAPI()


class ChatRequest(BaseModel):
    messages: list[dict]  # expects JSON like {"messages": [{"role": "user", "content": "hi"}]}


@app.post("/api/chat")
def chat(req: ChatRequest):
    response = client.chat.completions.create(
        model="glm-5.2",
        messages=req.messages,
        reasoning_effort="low",
    )
    return {"reply": response.choices[0].message.content}


# Serve the static/ folder as the site root. MUST come after the routes above,
# otherwise it swallows everything.
app.mount("/", StaticFiles(directory="static", html=True), name="static")
```

Read it top to bottom: load the secret → create an API client pointed at
Z.ai → define a route `POST /api/chat` that forwards the conversation to GLM
and returns the answer → serve `static/` as your website.

### 3.7 Run it

```bash
uvicorn server:app --reload --port 8000
```

(`server` = filename, `app` = the variable inside it, `--reload` = auto-restart
on edits.) You'll get a placeholder 404 at `http://localhost:8000` because
`static/` is empty — that's Task 4. The API is already testable:

```bash
curl localhost:8000/api/chat -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Introduce yourself in one sentence."}]}'
```

You should get `{"reply":"..."}`.

## Task 4 — Minimal chat page (30 min)

**Done when:** you can chat through the browser at `http://localhost:8000`.

Create `static/index.html` (full file):

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>ScamShield Concierge — Z.ai demo</title>
<style>
  body { font-family: system-ui, sans-serif; max-width: 720px; margin: 0 auto; padding: 16px; background: #f6f7f9; }
  h1 { font-size: 1.2rem; }
  .tag { font-size: .7rem; background: #1355ff; color: #fff; border-radius: 99px; padding: 2px 8px; vertical-align: middle; }
  #chat { display: flex; flex-direction: column; gap: 8px; margin: 16px 0; }
  .msg { padding: 10px 14px; border-radius: 12px; max-width: 85%; white-space: pre-wrap; }
  .user { align-self: flex-end; background: #1355ff; color: #fff; }
  .assistant { align-self: flex-start; background: #fff; border: 1px solid #e3e6ea; }
  details.tools { align-self: flex-start; font-size: .8rem; color: #666; background: #fff8e6; border: 1px dashed #d9c37a; border-radius: 8px; padding: 4px 10px; }
  details.tools pre { white-space: pre-wrap; }
  form { display: flex; gap: 8px; }
  input { flex: 1; padding: 10px; border: 1px solid #ccc; border-radius: 8px; }
  button { padding: 10px 18px; border: 0; border-radius: 8px; background: #1355ff; color: #fff; }
</style>
</head>
<body>
  <h1>🛡️ ScamShield Concierge <span class="tag">Z.ai demo</span></h1>
  <div id="chat"></div>
  <form id="form">
    <input id="input" autocomplete="off" placeholder="Describe a suspicious call, text, or email...">
    <button>Send</button>
  </form>

<script>
const history = [];                       // the whole conversation, kept client-side
const chatEl = document.getElementById("chat");

function bubble(role, text) {
  const div = document.createElement("div");
  div.className = "msg " + role;
  div.textContent = text;
  chatEl.appendChild(div);
  window.scrollTo(0, document.body.scrollHeight);
  return div;
}

// ADDED IN TASK 11: renders tool activity as a collapsible yellow box
function toolsBox(events) {
  if (!events || !events.length) return;
  const d = document.createElement("details");
  d.className = "tools";
  const lines = events.map(e =>
    e.type === "tool_call"
      ? `🔧 call ${e.name}(${JSON.stringify(e.args)})`
      : `↩️ result: ${e.result}`
  ).join("\n");
  d.innerHTML = `<summary>tool activity (${events.length})</summary><pre></pre>`;
  d.querySelector("pre").textContent = lines;
  chatEl.appendChild(d);
}

document.getElementById("form").addEventListener("submit", async (ev) => {
  ev.preventDefault();                    // stop the browser reloading the page
  const input = document.getElementById("input");
  const text = input.value.trim();
  if (!text) return;
  input.value = "";
  bubble("user", text);
  history.push({ role: "user", content: text });

  const div = bubble("assistant", "…");

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: history }),
    });
    const data = await res.json();
    history.push({ role: "assistant", content: data.reply });
    div.textContent = data.reply;
    toolsBox(data.events);                // ADDED IN TASK 11
  } catch (err) {
    div.textContent = "Error: " + err;
  }
});
</script>
</body>
</html>
```

(Yes, `toolsBox` is already in there — it does nothing until Task 11 turns on
`events`. One file, no later re-pasting.)

How it works, briefly: `history` is an array of `{role, content}` objects —
the exact format the chat API speaks. Every send posts the ENTIRE history,
because chat APIs are stateless: the model remembers nothing between calls;
the conversation lives on your side and is resent each time. `fetch` is the
browser's built-in way to make an HTTP request to your own server (same
origin — that's why there's no CORS pain).

## Task 5 — The function-calling loop (45 min) — the heart of the demo

**Done when:** a question like *"Is the number 800-555-0199 a known scam?"*
gets answered using data your own code provided.

### 5.1 The concept

The loop your server runs:

```
1. Send conversation + tool DESCRIPTIONS to Z.ai
2. Response has tool_calls? ──no──▶ done: reply is the answer
3. YES: run each requested function in YOUR Python
4. Append: the model's request + your results (role "tool")
5. Go to 1  (model now sees the results and can answer — or call another tool)
```

Two rules that trip everyone:
- **Append the assistant's tool-call message BEFORE the tool results.** The
  API errors with "tool message must follow tool_calls" otherwise.
- `tool_call.function.arguments` is a **JSON-encoded string**, not a dict —
  you must `json.loads()` it.

### 5.2 The code

In `server.py`: add imports at top (`import json`), add this block above the
routes — a canned data source, a real Python function, and the tool
*description* the model sees:

```python
SCAM_REPORTS = {
    "+1-800-555-0199": {
        "times_reported": 143,
        "category": "IRS impersonation",
        "first_seen": "2026-06-02",
        "risk": "HIGH",
        "notes": "Robocall claiming back taxes; threatens arrest; asks for gift cards.",
    },
    "billing@secure-account-verify.net": {
        "times_reported": 87,
        "category": "Phishing",
        "first_seen": "2026-08-11",
        "risk": "HIGH",
        "notes": "Fake 'unusual login' email; link leads to credential-harvesting page.",
    },
}


def lookup_scam_report(query: str) -> dict:
    """Canned 'database' lookup — replace with a real data source later."""
    q = query.lower().replace(" ", "")
    for key, report in SCAM_REPORTS.items():
        if q in key.lower() or key.lower() in q:
            return {"match": key, **report}
    return {
        "match": None,
        "note": "No records found. Treat as unverified; never act on unsolicited urgency.",
    }


TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "lookup_scam_report",
            "description": "Look up a phone number, email, or keyword in the scam-report database. Use whenever the user mentions a specific number, sender address, or asks if something is a known scam.",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "The phone number, email address, or keyword to look up",
                    }
                },
                "required": ["query"],
            },
        },
    },
]
```

About the description fields: **`description` is prompt engineering**, not
documentation. The model decides when to call the tool almost entirely from
it. Vague description → tool never fires or fires randomly.

Then REPLACE the `/api/chat` function with the loop version, and add the
`run_tool` dispatcher:

```python
SYSTEM_PROMPT = (
    "You are ScamShield Concierge, a friendly anti-scam assistant. "
    "Be concise and concrete. When the user mentions a specific phone number, "
    "email address, or asks whether something is a known scam, use the "
    "lookup_scam_report tool before answering."
)


def run_tool(name: str, args: dict) -> str:
    """The ONLY place tools execute. Add new tools here."""
    if name == "lookup_scam_report":
        return json.dumps(lookup_scam_report(**args))
    return json.dumps({"error": f"unknown tool: {name}"})


@app.post("/api/chat")
def chat(req: ChatRequest):
    messages = [{"role": "system", "content": SYSTEM_PROMPT}] + req.messages
    events = []  # a log of everything the machinery did, for the UI (Task 11)

    for _round in range(5):  # hard cap: never loop forever
        response = client.chat.completions.create(
            model="glm-5.2",
            messages=messages,
            tools=TOOLS,
            tool_choice="auto",      # Z.ai only supports "auto"
            reasoning_effort="low",
        )
        msg = response.choices[0].message

        if not msg.tool_calls:                     # model is done → final answer
            return {"reply": msg.content, "events": events}

        messages.append(msg.model_dump())          # rule 1: request BEFORE results
        for tc in msg.tool_calls:
            name = tc.function.name
            try:
                args = json.loads(tc.function.arguments or "{}")
                result = run_tool(name, args)      # rule 2: arguments is a string
            except Exception as e:
                result = json.dumps({"error": str(e)})  # feed errors back, don't crash
            events.append({"type": "tool_call", "name": name, "args": args})
            events.append({"type": "tool_result", "name": name, "result": result})
            messages.append({"role": "tool", "tool_call_id": tc.id, "content": result})

    return {"reply": "I got stuck in a tool loop — try rephrasing.", "events": events}
```

Why the try/except around execution: if the model sends malformed arguments,
you return the error as the tool's result and the model self-corrects on the
next round. Crashing the endpoint is the only unforgivable failure.

### 5.3 Test it

Server auto-reloads (`--reload`). In the browser ask:
`Is the number 800-555-0199 a known scam?`

Watch the terminal — nothing visible happens client-side yet (that's Task 11),
but the answer will cite "143 reports" and "IRS impersonation", which can only
have come from your canned dict → your function ran. You have tool calling.

## Task 6 — Built-in web search (10 min)

**Done when:** a current-events question returns an answer with citations.

Everything so far ran YOUR code. The `web_search` tool is different: **Z.ai's
servers execute it during generation** — no loop, no code from you. Add one
entry to the `TOOLS` list:

```python
TOOLS = [
    {  # your function from Task 5, unchanged...
    },
    {  # NEW: Z.ai's built-in search, executed on their servers
        "type": "web_search",
        "web_search": {
            "enable": True,
            "search_result": True,   # include the sources in the response
            "count": 5,
        },
    },
]
```

Test: `What are the latest AI scam trends this month?` → the answer includes
inline citations like `[Source: ref_1]`.

**Honest caveat:** the docs demonstrate `web_search` on its own; mixing it
with custom function tools in one request *usually* works but isn't clearly
documented on the current platform. If you get an API error after adding it,
wrap it in a toggle so the fallback is one line:

```python
ENABLE_WEB_SEARCH = True
TOOLS = [function_tools] + ([web_search_tool] if ENABLE_WEB_SEARCH else [])
```

## Task 7 — Deploy early (30–45 min)

**Done when:** the public URL on your phone runs the Task 5 question end-to-end.

Deploy-first rule: do this NOW, while there's time to debug, not at 18:00.

### 7.1 Make the repo deployable

In `demo/`, create `.gitignore`:

```
.venv/
__pycache__/
.env
```

(The `.env` line is critical — that's your key. It must never reach GitHub.)

### 7.2 Push to GitHub

```bash
git init
git add .
git commit -m "Z.ai demo: chat UI + tool calling"
```

Create an empty repo on github.com (no README), then:

```bash
git remote add origin https://github.com/YOURUSERNAME/zai-demo.git
git branch -M main
git push -u origin main
```

(If your buildathon repo is already a git repo, instead just commit inside it
and push that — then set the demo folder as Root Directory in the next step.)

### 7.3 Deploy on Render (free tier)

1. render.com → sign up → **New → Web Service** → connect your GitHub account
   → pick the repo.
2. Settings:
   - **Root Directory:** `planb_chatui/demo` (skip if the repo IS the demo)
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn server:app --host 0.0.0.0 --port $PORT`
   - **Instance type:** Free
3. **Environment** → add `ZAI_API_KEY` = your key. (This is the cloud
   equivalent of your `.env` — Render injects it into the server.)
4. Deploy. First build takes a few minutes.

`--host 0.0.0.0 --port $PORT` explained: a server that only listens on
localhost is unreachable from the internet, and Render assigns the port via
an environment variable named `PORT` — that flag combo is you agreeing to
both.

---

# PHASE 2 — The Agent Skills harness (~1.5–2.5 h)

## Task 8 — Create the skill folder and its SKILL.md (15 min)

**Done when:** the folder exists and you can name its two parts.

A skill is a convention, and this is the whole format: a folder whose
`SKILL.md` starts with a small header (name + description), then markdown
instructions.

Create `skills/scam-report-writer/SKILL.md`:

```markdown
---
name: scam-report-writer
description: Use when the user describes a suspicious call, text, or email and wants a structured scam assessment. Produces a standardized risk report.
---

# Scam Report Writer

When this skill is loaded, produce every assessment in exactly this structure:

1. **Summary** — one sentence on what the user is dealing with.
2. **Red flags** — bullet list; each bullet quotes the user's own words and
   names the manipulation tactic (urgency, authority, fear, secrecy...).
3. **Risk level** — Low / Medium / High, with a one-line justification.
4. **Recommended actions** — maximum three bullets, most urgent first.

Rules:
- Never state that a specific company definitely committed fraud — say
  "the pattern matches" instead.
- If a lookup tool is available, run it before scoring risk.
- Keep the whole report under 200 words.
```

Why the split: the **description** is the model's only basis for *choosing*
the skill (like a tool description); the **body** is loaded only when chosen —
lazy loading, so you can accumulate dozens of skills without bloating every
request.

## Task 9 — The dispatcher: `list_skills` + `load_skill` (45–60 min)

**Done when:** a scam-story question makes the model call `load_skill` itself,
then produce a report in the skill's exact format.

The trick: expose the skill system AS TWO MORE FUNCTION TOOLS. The model
discovers and pulls in skills using the same tool calling you built in Task 5.

### 9.1 Read skills at startup

Add to `server.py` (top, after imports; `pathlib` and `re` imports included):

```python
import pathlib
import re

SKILLS_DIR = pathlib.Path(__file__).parent / "skills"


def load_skills() -> dict:
    """Scan skills/*/SKILL.md and parse the --- header. Tiny on purpose."""
    skills = {}
    for skill_file in sorted(SKILLS_DIR.glob("*/SKILL.md")):
        text = skill_file.read_text(encoding="utf-8")
        meta = {}
        m = re.match(r"^---\s*\n(.*?)\n---", text, re.DOTALL)
        if m:
            for line in m.group(1).splitlines():
                if ":" in line:
                    key, _, value = line.partition(":")
                    meta[key.strip()] = value.strip()
        body = text[m.end():].strip() if m else text
        skills[meta.get("name", skill_file.parent.name)] = {
            "description": meta.get("description", ""),
            "body": body,
        }
    return skills


SKILLS = load_skills()  # runs once when the server starts
```

### 9.2 Register the two tools

Add two entries to `TOOLS`:

```python
{
    "type": "function",
    "function": {
        "name": "list_skills",
        "description": "List the available specialized skill modules with one-line descriptions. Call this when a user task might benefit from a structured workflow.",
        "parameters": {"type": "object", "properties": {}},
    },
},
{
    "type": "function",
    "function": {
        "name": "load_skill",
        "description": "Load the full instructions for a skill by its exact name. Call this BEFORE attempting a task that the skill covers, then follow the loaded instructions exactly.",
        "parameters": {
            "type": "object",
            "properties": {"name": {"type": "string", "description": "Exact skill name from list_skills"}},
            "required": ["name"],
        },
    },
},
```

### 9.3 Handle them in `run_tool`

```python
    if name == "list_skills":
        return json.dumps(
            [{"name": n, "description": s["description"]} for n, s in SKILLS.items()]
        )
    if name == "load_skill":
        skill = SKILLS.get(args.get("name", ""))     # whitelist lookup —
        if not skill:                                 # never build file paths
            return json.dumps({"error": "unknown skill"})  # from model input
        return json.dumps({"instructions": skill["body"]})
```

Note the security detail flagged inline: the model supplies the name, so we
look it up in our pre-scanned dict rather than opening a file from the raw
string — a malicious or garbled name simply misses.

### 9.4 Teach the model the protocol (system prompt)

Extend `SYSTEM_PROMPT`:

```python
SYSTEM_PROMPT = (
    "You are ScamShield Concierge, a friendly anti-scam assistant. "
    "Be concise and concrete. When the user mentions a specific phone number, "
    "email address, or asks whether something is a known scam, use the "
    "lookup_scam_report tool before answering. "
    "You have a skill library. At the start of any substantive task, call "
    "list_skills(); if one matches the task, call load_skill(name) and follow "
    "its instructions exactly."
)
```

### 9.5 The flow you just built

```
user: "I got a text from my 'bank' saying my account is locked, click here..."
  └─ model: list_skills()
       └─ model: load_skill("scam-report-writer")
            └─ model: lookup_scam_report(...)         (Task 5 tool, still works)
                 └─ model: final report in the SKILL.md format
```

Same loop, same machinery — "skills" turned out to be two tools and a folder.

## Task 10 (optional) — A script inside a skill (30–45 min)

Real skills can carry scripts. Demo-sized version: the skill references a
tool that already exists. Add to `SKILL.md`'s rules: "Use the
lookup_scam_report tool to check any number or address before scoring risk."
— done, no new code: the skill now directs tool usage. A step further (cut
this first if behind): add e.g. `generate_case_id()` as another entry in
`TOOLS` + `run_tool`, and have the SKILL.md tell the model to open every
report with `Case #` from that tool.

## Task 11 — Show the machinery in the UI (30 min)

**Done when:** yellow collapsible "tool activity" boxes appear under replies.

You already did the work: the backend has been returning `events` since
Task 5, and `index.html` shipped with the `toolsBox` renderer and the one
line that calls it. This task is literally: refresh the page and ask
`Is the number 800-555-0199 a known scam?` → a `<details>` box shows

```
🔧 call lookup_scam_report({"query": "800-555-0199"})
↩️ result: {"match": "+1-800-555-0199", "times_reported": 143, ...}
```

Click to expand/collapse. This is the demo's money shot: judges see the
agent thinking AND acting, not just prose.

---

# Wrap-up

Run the three-question script (on the DEPLOYED URL, not localhost):

1. Plain: `What's the safest way to answer unknown calls?` → no tools.
2. Tool: `Is the number 800-555-0199 a known scam?` → yellow box, canned DB.
3. Skill: `My mom got a scary text about her bank account being locked...` →
   load_skill fires, structured report comes back.

## Troubleshooting table

| Symptom | Cause / fix |
|---|---|
| `401` from Z.ai | Key missing/wrong. Check `.env`, restart uvicorn (dotenv loads at startup) |
| `openai` import error | Virtual env not activated → `source .venv/Scripts/activate` |
| "tool message must follow tool_calls" | You skipped `messages.append(msg.model_dump())` before tool results |
| Model never calls tools | Weak tool `description`, or question doesn't need it — sharpen wording |
| Error after adding web_search | Mixing tools vs. search on this endpoint — flip `ENABLE_WEB_SEARCH = False` |
| First token is slow | GLM-5.x always reasons; you're on `low` already; patience or `glm-5.2` |
| Deploy shows blank page | Root Directory wrong in Render, or `static/index.html` not committed |
| Works locally, 500 on deploy | `ZAI_API_KEY` env var not set in Render dashboard |
