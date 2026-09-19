# Lesson 6 · Router + orchestrator + jobs store + SSE + home UI

> **Visual aids:** `visual-aids/va03_data_flow.html`, `va04_runtime_sequence.html`.
> **Time budget:** ~4 hrs · **MVP gate contribution:** `v0.3-orchestrator` — submit a query from a browser, see live SSE timeline, get a `reportUrl`, open the dashboard, share the URL on localhost.

---

## What this lesson produces

This is the lesson where the discrete libs become an *app*. Five files plus edits to `cli.js`:

1. **`lib/jobs.js`** — `createJob`, `getJob`, `listJobs`, `updateJob`, `pruneJobs(20)`, with atomic writes and an event log mirrored into `job.json` (cap 500).
2. **`lib/orchestrator.js`** — single-flight state machine; emits an `EventEmitter` that the SSE endpoint and `job.json` both subscribe to.
3. **`lib/router.js`** — 7 routes in plain `node:http` (no Express/Fastify).
4. **`server.js`** — entry point, wires config + router, hosts `views/home.html` and `views/dashboard/`.
5. **`views/home.html`** — vanilla SPA: form, SSE timeline, retry, recent reports.
6. **`lib/config.js`** (env-driven, the dev/qa/prod hook from Lesson 3 becomes real).

That's it. End of lesson you should be able to:

```powershell
cd mvp\app
npm run dev
# opens browser → http://localhost:8787
# types "rtx 3090" → submit
# Watches SSE fill in real time:
#   :stage capture
#   :facet current {cards, scrolls}
#   :facet completed {sign_in_required}
#   :facet sold     {sign_in_required}
#   :stage decode
#   :stage extract
#   :stage relevance
#   :stage analyze
#   :stage report
#   :done {reportUrl: "/report/<id>/"}
```

---

## Step 6.1 — `lib/config.js` — env-driven configuration (the qa/dev/prod hook)

This is where the env-var pattern from Lesson 3 becomes real.

```js
// mvp/app/lib/config.js
import path from "node:path";

function envInt(k, d) { const v = process.env[k]; return v ? Number(v) : d; }
function envStr(k, d) { return process.env[k] || d; }

export const config = {
  host: envStr("HOST", "127.0.0.1"),
  port: envInt("PORT", 8787),
  env:  envStr("SSC_ENV", "dev"),                          // dev | qa | prod
  dataDir: path.resolve(envStr("SSC_DATA_DIR",
    path.join(process.cwd(), "data", process.env.SSC_ENV === "prod" ? "" : process.env.SSC_ENV || "dev")
  )),
  profileDir: path.resolve(envStr("SSC_PROFILE_DIR", path.join(process.cwd(), "profiles"))),
  captureBaseUrl: envStr("SSC_CAPTURE_BASE_URL", null),    // test fixture base URL
  headed: envStr("SSC_HEADED", "0") === "1",
  pwDebug: envStr("PWDEBUG", "0") === "1",
  targetCards: envInt("SSC_TARGET_CARDS", envStr("SSC_ENV") === "prod" ? 150 : 200),
  pruneKeep: envInt("SSC_PRUNE_KEEP", 20),
};
```

`config.js` is the *only* file that reads `process.env`. **Everything else imports `config` and trusts it.** Discipline.

> `dataDir` collapses `dev`/`qa`/`prod` into a sub-folder so the three "environments" share no jobs on disk. For real prod the SPA is in `/opt/scamshield/app/data/jobs/`, which is what systemd's `WorkingDirectory=` sets up.

---

## Step 6.2 — `lib/jobs.js` — the file-based job store

Each job is one self-contained folder under `data/jobs/<id>/`. `job.json` is the *single source of truth* (state + event log + facet statuses + provenance).

```js
// mvp/app/lib/jobs.js
import fs from "node:fs/promises";
import { existsSync, mkdirSync, readdirSync } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const EVENTS_CAP = 500;

function newId() {
  const d = new Date();
  const stamp =
    d.getUTCFullYear().toString() +
    String(d.getUTCMonth() + 1).padStart(2,"0") +
    String(d.getUTCDate()).padStart(2,"0") + "-" +
    String(d.getUTCHours()).padStart(2,"0") +
    String(d.getUTCMinutes()).padStart(2,"0") +
    String(d.getUTCSeconds()).padStart(2,"0");
  return `${stamp}-${crypto.randomBytes(3).toString("hex")}`;
}

export async function createJob(dataDir, { query }) {
  await fs.mkdir(dataDir, { recursive: true });
  const id = newId();
  const jobDir = path.join(dataDir, "jobs", id);
  await fs.mkdir(path.join(jobDir, "captures"), { recursive: true });
  const init = {
    id, query,
    createdAt: new Date().toISOString(),
    state: "queued",
    facets: { current: {}, completed: {}, sold: {} },
    events: [],
  };
  await atomicWrite(path.join(jobDir, "job.json"), init);
  return { id, jobDir };
}

export async function readJob(dataDir, id) {
  const jobDir = path.join(dataDir, "jobs", id);
  const raw = await fs.readFile(path.join(jobDir, "job.json"), "utf8");
  return { id, jobDir, ...JSON.parse(raw) };
}

export async function updateJob(dataDir, id, mut) {
  const job = await readJob(dataDir, id);
  const next = mut({ ...job });
  await atomicWrite(path.join(job.jobDir, "job.json"), next);
  return next;
}

export async function appendEvent(dataDir, id, ev) {
  return updateJob(dataDir, id, (job) => {
    const events = [...(job.events || []), { ...ev, ts: new Date().toISOString() }];
    if (events.length > EVENTS_CAP) events.splice(0, events.length - EVENTS_CAP);
    return { ...job, events };
  });
}

export async function listRecentJobs(dataDir, { limit = 20 } = {}) {
  const jobsRoot = path.join(dataDir, "jobs");
  if (!existsSync(jobsRoot)) return [];
  const dirs = readdirSync(jobsRoot).filter((d) => /^\d{8}-\d{6}-[0-9a-f]{6}$/.test(d));
  const out = [];
  for (const d of dirs) {
    try {
      const j = JSON.parse(await fs.readFile(path.join(jobsRoot, d, "job.json"), "utf8"));
      out.push({
        id: d,
        query: j.query,
        state: j.state,
        createdAt: j.createdAt,
        counts: j.facets,
        reportUrl: j.state === "done" ? `/report/${d}/` : null,
      });
    } catch {}
  }
  return out.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)).slice(0, limit);
}

export async function pruneJobs(dataDir, keep = 20) {
  const recent = await listRecentJobs(dataDir, { limit: Number.MAX_SAFE_INTEGER });
  const stale = recent.slice(keep);
  for (const j of stale) {
    await fs.rm(path.join(dataDir, "jobs", j.id), { recursive: true, force: true });
  }
  return stale.map((j) => j.id);
}

// Atomic write (temp + rename).  CRITICAL: defends against killed-process half-writes.
async function atomicWrite(target, obj) {
  const tmp = target + ".tmp." + crypto.randomBytes(4).toString("hex");
  await fs.writeFile(tmp, JSON.stringify(obj, null, 2));
  await fs.rename(tmp, target);
}
```

The `atomicWrite` discipline is non-negotiable — it's what makes a crashed server unable to corrupt a `job.json`, which is the entire memory of the long-running job.

---

## Step 6.3 — `lib/orchestrator.js` — single-flight, one EventEmitter

```js
// mvp/app/lib/orchestrator.js
import { EventEmitter } from "node:events";
import { runCapture } from "./capture.js";
import { decodeMhtml } from "./mhtml.js";
import { extractCardsFromHtml, mergeCaptures } from "./extract.js";
import { filterRelevant } from "./relevance.js";
import { analyze } from "./analyze.js";
import { buildReport } from "./report.js";
import { loadProfile, matchProfile, genericProfile } from "./profile.js";
import { createJob, appendEvent, updateJob, pruneJobs } from "./jobs.js";
import { config } from "./config.js";

class Orchestrator extends EventEmitter {
  constructor() { super(); this.busy = false; }

  // submit() returns 202 + the SSE url, or 409 if a job is already running.
  async submit(query) {
    if (this.busy) return { error: "busy", jobId: null };
    this.busy = true;

    const { id, jobDir } = await createJob(config.dataDir, { query });
    const profile = (await matchProfile(query)) || genericProfile(query);

    // Background: run to completion.  Listeners (SSE) attach to this emitter.
    this.runJob(id, jobDir, query, profile).catch((e) => {
      this.emit("event", { kind: "error", jobId: id, msg: e.message });
    });

    return { jobId: id, eventsUrl: `/api/jobs/${id}/events`, statusUrl: `/api/jobs/${id}/status` };
  }

  async runJob(id, jobDir, query, profile) {
    const evt = (e) => { this.emit("event", { jobId: id, ...e }); appendEvent(config.dataDir, id, e); };
    try {
      evt({ kind: "stage", stage: "capture", t0: Date.now() });
      const out = await runCapture({
        query, profile,
        outDir: `${jobDir}/captures`,
        log: (e) => evt({ kind: "subevent", ...e }),
        baseUrl: config.captureBaseUrl,
      });

      // Update per-facet statuses
      await updateJob(config.dataDir, id, (job) => {
        const facets = { ...job.facets };
        for (const f of ["current","completed","sold"]) {
          const r = out.facets[f] || {};
          facets[f] = { status: r.status, cards: r.cards || 0, note: r.note || "" };
        }
        return { ...job, facets };
      });

      // Bail to typed terminal if no facet succeeded enough to be worth processing
      const okish = ["ok","partial"].includes(out.facets.current?.status);
      if (!okish) {
        await updateJob(config.dataDir, id, (j) => ({ ...j, state: `error:${out.facets.current?.status || "no-facet"}` }));
        this.emit("event", { jobId: id, kind: "done", reportUrl: null, state: `error:${out.facets.current?.status}` });
        this.busy = false;
        pruneJobs(config.dataDir, config.pruneKeep).catch(()=>{});
        return;
      }

      // Decode + extract + relevance + analyze + report
      const decoded = {};
      for (const f of ["current","completed","sold"]) {
        const mhtmlPath = `${jobDir}/captures/${f}.mhtml`;
        try {
          const buf = await fs.readFile(mhtmlPath);
          decoded[f] = decodeMhtml(buf);
        } catch { decoded[f] = ""; }
      }

      evt({ kind: "stage", stage: "extract" });
      const captures = {};
      for (const f of ["current","completed","sold"]) {
        if (!decoded[f]) { captures[f] = []; continue; }
        try { captures[f] = extractCardsFromHtml(decoded[f], { profile }); }
        catch (e) { captures[f] = []; evt({ kind: "warn", facet: f, msg: e.code || "extract-fail" }); }
      }
      const merged = mergeCaptures(captures, { query });

      evt({ kind: "stage", stage: "relevance" });
      const { kept, excluded, byReason } = filterRelevant(merged.rows, query, profile);

      evt({ kind: "stage", stage: "analyze" });
      const analysis = analyze({ records: kept }, profile, {});

      evt({ kind: "stage", stage: "report" });
      await updateJob(config.dataDir, id, (j) => ({ ...j, state: "report" }));
      await buildReport(jobDir, { rows: kept, byReason, profile, analysis, facetStatuses: out.facets });

      await updateJob(config.dataDir, id, (j) => ({ ...j, state: "done" }));
      const reportUrl = `/report/${id}/`;
      evt({ kind: "done", reportUrl });
      this.busy = false;
      pruneJobs(config.dataDir, config.pruneKeep).catch(()=>{});
    } catch (e) {
      evt({ kind: "error", msg: e.message });
      await updateJob(config.dataDir, id, (j) => ({ ...j, state: `error:${e.code || "exception"}` })).catch(()=>{});
      this.busy = false;
    }
  }
}

import fs from "node:fs/promises";  // ← single import for the runJob body
export const orchestrator = new Orchestrator();
```

> Why an `EventEmitter` and not hand-rolled promises? Because **the same event stream feeds two consumers**: the SSE endpoint (live clients) and `jobs.appendEvent` (replay buffer in `job.json`). One emitter, two listeners; a job is replay-able for the lifetime of the SSE EventSource.

---

## Step 6.4 — `lib/router.js` (7 routes, no framework)

```js
// mvp/app/lib/router.js
import { createReadStream, statSync } from "node:fs";
import path from "node:path";
import { config } from "./config.js";
import { orchestrator } from "./orchestrator.js";
import { listRecentJobs, readJob } from "./jobs.js";

const HOME_ID_RE = /^[A-Za-z0-9-]+\/[A-Za-z0-9-_\.]+$/;     // not strictly needed for /, kept for parity

const REPORT_ID_RE = /^\d{8}-\d{6}-[0-9a-f]{6}$/;

export async function handle(req, res) {
  const u = new URL(req.url, `http://${req.headers.host}`);
  const send = (status, body, type = "application/json") => {
    res.writeHead(status, { "content-type": type });
    res.end(typeof body === "string" ? body : JSON.stringify(body));
  };

  // GET /
  if (req.method === "GET" && u.pathname === "/") {
    return send(200, await readFileUtf("views/home.html"), "text/html; charset=utf-8");
  }

  // GET /report/:id   +   GET /report/:id/:file
  if (req.method === "GET" && u.pathname.startsWith("/report/")) {
    const parts = u.pathname.slice("/report/".length).split("/");
    if (parts[0] === "" || !REPORT_ID_RE.test(parts[0])) return send(404, { error: "not found" });
    const id = parts[0];
    const file = parts[1] || "index.html";
    const jobDir = path.join(config.dataDir, "jobs", id);
    let job;
    try { job = await readJob(config.dataDir, id); }
    catch { return send(404, { error: "not found" }); }
    if (job.state !== "done") return send(409, { error: "not ready", state: job.state });
    const safeFile = path.normalize(file).replace(/^[/\\]+/, "");
    const fullPath = path.join(jobDir, "report", safeFile);
    const reportRoot = path.join(jobDir, "report") + path.sep;
    if (!fullPath.startsWith(reportRoot)) return send(403, { error: "forbidden" });

    try {
      const st = statSync(fullPath);
      if (!st.isFile()) return send(404, { error: "not found" });
      const ct = contentTypeFor(fullPath);
      res.writeHead(200, { "content-type": ct });
      return createReadStream(fullPath).pipe(res);
    } catch { return send(404, { error: "not found" }); }
  }

  // POST /api/jobs
  if (req.method === "POST" && u.pathname === "/api/jobs") {
    let body = "";
    for await (const chunk of req) body += chunk;
    let parsed;
    try { parsed = JSON.parse(body || "{}"); } catch { return send(400, { error: "bad json" }); }
    const query = (parsed.query || "").trim();
    if (!query || query.length > 80) return send(400, { error: "query 1..80 chars" });
    const r = await orchestrator.submit(query);
    if (r.error === "busy") return send(409, { error: "busy" });
    return send(202, { jobId: r.jobId, eventsUrl: r.eventsUrl, statusUrl: r.statusUrl });
  }

  // GET /api/jobs
  if (req.method === "GET" && u.pathname === "/api/jobs") {
    return send(200, { jobs: await listRecentJobs(config.dataDir) });
  }

  // GET /api/jobs/:id/events   ← SSE
  if (req.method === "GET" && u.pathname.startsWith("/api/jobs/") && u.pathname.endsWith("/events")) {
    const id = u.pathname.slice("/api/jobs/".length, -"/events".length);
    if (!REPORT_ID_RE.test(id)) return send(400, { error: "bad id" });
    return startSse(res, id);
  }

  // GET /api/jobs/:id/status   ← polling fallback
  if (req.method === "GET" && u.pathname.startsWith("/api/jobs/") && u.pathname.endsWith("/status")) {
    const id = u.pathname.slice("/api/jobs/".length, -"/status".length);
    if (!REPORT_ID_RE.test(id)) return send(400, { error: "bad id" });
    try { return send(200, await readJob(config.dataDir, id)); }
    catch { return send(404, { error: "not found" }); }
  }

  // GET /healthz
  if (req.method === "GET" && u.pathname === "/healthz") {
    return send(200, { ok: true, busy: orchestrator.busy, env: config.env });
  }

  send(404, { error: "not found" });
}

// --- SSE implementation
function startSse(res, id) {
  res.writeHead(200, {
    "content-type": "text/event-stream",
    "cache-control": "no-cache, no-transform",
    "connection": "keep-alive",
    "x-accel-buffering": "no",                              // critical for Apache
  });

  // 1) Replay from persisted event log
  readJob(config.dataDir, id).then((job) => {
    for (const ev of job.events || []) {
      res.write(formatEvent(ev));
    }
    res.write(formatEvent({ kind: "replay-complete" }));
  }).catch(() => {});

  // 2) Subscribe to live events for THIS job
  const onEvent = (ev) => {
    if (ev.jobId !== id) return;
    res.write(formatEvent(ev));
  };
  orchestrator.on("event", onEvent);

  // 3) Keepalive
  const ping = setInterval(() => res.write(": ping\n\n"), 15_000);

  req.on("close", () => {
    clearInterval(ping);
    orchestrator.off("event", onEvent);
  });
}

function formatEvent(ev) {
  return `data: ${JSON.stringify(ev)}\n\n`;
}

function contentTypeFor(p) {
  if (p.endsWith(".html")) return "text/html; charset=utf-8";
  if (p.endsWith(".css"))  return "text/css; charset=utf-8";
  if (p.endsWith(".js"))   return "application/javascript; charset=utf-8";
  if (p.endsWith(".json")) return "application/json; charset=utf-8";
  return "application/octet-stream";
}

import { readFile } from "node:fs/promises";
const cache = new Map();
async function readFileUtf(p) {
  if (cache.has(p)) return cache.get(p);
  const v = await readFile(path.resolve(p), "utf8");
  cache.set(p, v);
  return v;
}

// `req` is hoisted from closure; not safe across module reload
let req;
export function attachHttpReq(r) { req = r; }       // ← see server.js below
```

Wait — that last closure trick is awkward. Let me give you the clean version: **don't close over `req`** — pass it into `handle`:

```js
// final router signature
export function handle(req, res) {
  // req is in scope now, no tricks
  const cleanup = () => { /* ... */ };
  req.on("close", cleanup);   // safe in handle() because we keep the closure
}
```

Use that form. The pseudo-code above's `req` global was just for exposition.

---

## Step 6.5 — `server.js`

```js
#!/usr/bin/env node
// mvp/app/server.js
import { createServer } from "node:http";
import { handle } from "./lib/router.js";
import { config } from "./lib/config.js";

createServer((req, res) => {
  handle(req, res).catch((e) => {
    console.error("unhandled:", e);
    res.writeHead(500, { "content-type": "application/json" });
    res.end(JSON.stringify({ error: "internal" }));
  });
}).listen(config.port, config.host, () => {
  console.log(`scamshield on http://${config.host}:${config.port}  (env=${config.env})`);
});
```

That's the whole server. Run it:

```powershell
cd mvp\app
npm run dev
# → "scamshield on http://127.0.0.1:8787  (env=dev)"
```

Open `http://localhost:8787` in a browser. You should see the home page (next step).

---

## Step 6.6 — `views/home.html` (the SSE-driven SPA)

This is a single HTML file; no build step; the assets are all here.

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>ScamShield Concierge</title>
<style> /* see mvp/app/views/home.html — paste into the lesson on first edit */ </style>
</head>
<body>
  <main>
    <h1>ScamShield Concierge</h1>
    <p>Type a query. See if the listings are priced like a market, or a trap.</p>

    <form id="f">
      <input id="q" name="q" maxlength="80" placeholder='e.g. "rtx 3090"' required />
      <button type="submit" id="go">Analyze</button>
    </form>

    <div id="busy" hidden>
      <p>Analysis in progress — watch the timeline below.</p>
      <pre id="log" aria-live="polite"></pre>
    </div>

    <section id="recent" hidden>
      <h2>Recent reports</h2>
      <ul id="recent-list"></ul>
    </section>
  </main>

  <script>
    const $ = (s) => document.querySelector(s);

    $("form#f").addEventListener("submit", async (ev) => {
      ev.preventDefault();
      const query = $("#q").value.trim();
      if (!query) return;

      $("#busy").hidden = false;
      $("#log").textContent = "";

      const r = await fetch("/api/jobs", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (r.status === 409) {
        $("#log").textContent = "An analysis is already running. Please wait for it.";
        return;
      }
      if (!r.ok) { $("#log").textContent = "Error: " + r.statusText; return; }
      const { jobId, eventsUrl } = await r.json();

      const log = (line) => { $("#log").textContent += line + "\n"; };

      const es = new EventSource(eventsUrl);
      es.onmessage = (m) => {
        const e = JSON.parse(m.data);
        if (e.kind === "replay-complete") log("— replay complete —");
        else log(JSON.stringify(e));
        if (e.kind === "done" && e.reportUrl) {
          es.close();
          window.location.href = e.reportUrl;
        }
      };
      es.onerror = () => {
        log("[SSE error — falling back to polling]");
        es.close();
        pollFallback(jobId);
      };
    });

    async function pollFallback(jobId) {
      const t = setInterval(async () => {
        const r = await fetch(`/api/jobs/${jobId}/status`);
        const j = await r.json();
        if (j.state === "done") {
          clearInterval(t);
          window.location.href = `/report/${jobId}/`;
        }
      }, 2000);
    }

    // Recent reports
    (async () => {
      const r = await fetch("/api/jobs");
      const { jobs } = await r.json();
      if (!jobs.length) return;
      $("#recent").hidden = false;
      const list = $("#recent-list");
      for (const j of jobs.slice(0, 8)) {
        const li = document.createElement("li");
        li.innerHTML = `<a href="${j.reportUrl || "#"}">${j.query}</a>
                        <small>${new Date(j.createdAt).toLocaleString()} · ${j.state}</small>`;
        list.appendChild(li);
      }
    })();
  </script>
</body>
</html>
```

> **Inline styling**: add a stylesheet that fits the dark-on-light ScamShield look — a darker version of the visual-aid CSS, no React, no Tailwind. Keep this file under 250 lines. If you find it getting longer, the design needs a CSS file, not an HTML file.

Open `http://localhost:8787`. Type `rtx 3090`. Submit. Watch the SSE fill in real time, then auto-navigate to the report.

---

## Step 6.7 — Manual smoke-test of every route

```powershell
$base = "http://localhost:8787"
# 1. home page is text/html
(Invoke-WebRequest $base).Content | Select-String -Pattern "<title>" | Select-Object -First 1

# 2. healthz reports "ok"
(Invoke-WebRequest "$base/healthz").Content

# 3. POST /api/jobs returns 202 + jobId
$r = Invoke-WebRequest "$base/api/jobs" -Method POST -Headers @{"content-type"="application/json"} -Body '{"query":"rtx 3090"}'
$jobId = ($r.Content | ConvertFrom-Json).jobId
echo "jobId = $jobId"

# 4. SSE delivers a 'replay-complete' first (because the job is still running, it'll still come)
(Invoke-WebRequest "$base/api/jobs/$jobId/events" -TimeoutSec 5).Content  # NB: PowerShell Invoke-WebRequest wraps SSE; use curl instead:

# use curl for SSE (more honest about the wire format)
curl.exe -N "$base/api/jobs/$jobId/events" --max-time 8

# 5. polling fallback after SSE closes
(Invoke-WebRequest "$base/api/jobs/$jobId/status").Content | Out-String

# 6. /report/:id/  → serves index.html  once job completes
$report = "$base/report/$jobId/"
while ((Invoke-WebRequest "$base/api/jobs/$jobId/status" | ConvertFrom-Json).state -ne "done") { Start-Sleep -Seconds 2 }
(Invoke-WebRequest $report).Content | Select-String -Pattern "data.js|common.js|index.html"

# 7. /report/<id>/../captures  → MUST 404 (path traversal guard)
# (this URL is illegal; just confirm it doesn't blow up the server, returns 404)
try {
  Invoke-WebRequest "$base/report/$jobId/../captures/current.mhtml"
} catch { $_.Exception.Response.StatusCode.value__ }   # expect: 404
```

> If step 7 returns anything other than 404, the path-normalize traversal guard is broken. **Stop and fix it before tagging.** This is a security check, not a cosmetic one.

---

## Step 6.8 — The single-flight 409 contract

Open **two** browser tabs to `localhost:8787`. Submit a query from tab 1, then submit from tab 2 while tab 1's job is still running. Tab 2 should see a "busy" notice (the home page shows the 409 message). When tab 1's job completes, tab 2's UI doesn't auto-recover (that's fine; the user clicks Retry).

> If you instead see both jobs racing — i.e. both `orchestrator.busy` flags are false simultaneously — the lock is broken. Re-check `submit()`.

---

## Step 6.9 — Tagging the checkpoint

```powershell
git add -A
git commit -m "server: router + orchestrator + jobs + SSE + home UI; all 7 routes green locally"
git tag -a v0.3-orchestrator -m "MVP: server + orchestrator live on localhost"
git push --tags
```

---

## Anti-patterns to avoid

- ⛔ **Don't `import express` or `fastify`**. The 7 routes don't justify the second dependency. The design doc is firm.
- ⛔ **Don't use `EventSourceEvent.onopen` then trust it.** Always provide the polling fallback (`/api/jobs/:id/status`); connections *will* drop on hotel Wi-Fi.
- ⛔ **Don't read `process.env` outside `config.js`.** Tests, dev, prod all derive from one place.
- ⛔ **Don't mutate `job.json` non-atomically.** The atomic temp+rename is your last defense against a Node process crash mid-write.
- ⛔ **Don't serve `captures/` or `dataset.json` from `/report/:id/`**. Path traversal is real; the `startsWith(reportRoot)` check is the wall.

---

## What "done" means for Lesson 6

```powershell
cd mvp\app
npm run dev
# in browser:
#   1) http://localhost:8787 → home loads
#   2) submit "rtx 3090" → timeline fills, redirects to /report/<id>/
#   3) the report loads
#   4) Recent reports list shows this + previous jobs
# in terminal:
#   5) curl -N /api/jobs/<id>/events shows the same event stream
#   6) second submit during a run → 409
#   7) /report/<id>/../captures/... → 404 (path traversal)
```

All seven? Tag `v0.3-orchestrator` and push. Lesson 7 — the ported dashboard + 22-field adapter — closes the loop on the *visual* contract. Let me know when you're ready.
