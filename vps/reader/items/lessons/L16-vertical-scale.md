# Lesson 16 · Vertical scale — single VPS, more capacity, more users, no architecture change

> **Time budget:** ~6 hrs · **Audience:** post-v1, when DAU creeps from 10s to 100s and you want to *stay on one box*.

---

## What this lesson produces

The same VPS, the same `scamshield.service`, the same single-process Node architecture — but capable of handling ~1,000–3,000 DAU on the same `2 vCPU / 2 GB RAM` LiquidWeb box. Specifically:

1. **`target=200`, `MemoryMax=3G` tuning** for the larger MHTMLs.
2. **Connection pooling via system limits** (`/etc/systemd/system.conf` and `fs.file-max`).
3. **HTTP keepalive + a single SSE fan-out** (the orchestrator already has this).
4. **A CDN cache for static `/report/*` assets** (the byte-identical `index.html`, `common.css`, `common.js` are ideal for this).
5. **Measurement scaffolding** — a `/metrics` endpoint that emits Prometheus text format, ready for v1+ Grafana work.

We explicitly **don't** introduce Redis, Postgres, or a queue broker. The architecture's zero-dep / file-based ethos is load-bearing for v2 too; don't introduce a dependency until the workload demands it.

---

## Where the 1k–3k DAU ceiling actually sits

The design doc + the 2 GB RAM + the single-flight model each set a different limit:

| Resource | Constraint | Reason |
|---|---|---|
| Concurrent jobs | **1** | single-flight (demo mandate) |
| Per-job memory peak | **~600 MB** | MHTML size 6–126 MB × ~3× heap ratio + Chromium working set |
| Memory headroom for parallel browser launches | **0** | we don't launch parallel; it's still single-flight |
| Disk space | **50 GB** | 50 jobs × (3 facets × 100 MB MHTML + decoded HTML + dataset) ≈ 15 GB |
| Captures pruned to 20 jobs | **(default)** | configurable up to 50 if disk allows |

> **Insight:** the *real* throughput limit at single-flight is **wall-clock-per-job**, not CPU/memory. We can serve 1000 DAU if each DAU submits one query per day and each job completes in <90s. We can serve 100 DAU if each DAU submits one query per 6 minutes. **Both happen on a 2 GB box.**

When you outgrow that — when you'd want *parallel jobs* because traffic is burst-y — *that's* when L17's multi-VM lesson kicks in. Vertical scale here is "make the same single-flight pipeline faster" not "add concurrency."

---

## Step 16.1 — `target=200` and the memory-cgroup math

`target=200` (instead of the L8 conservative `target=150`) requires careful memory math. The single-strang guarantee: **only one MHTML string alive at a time**.

```
peak RAM during capture = chromium base (~300 MB) + page JS heap (~150 MB)
                        + 1× MHTML on disk-but-in-flight (~250 MB transient heap)
                        + png decoder workspace (~80 MB)
                        ≈ 780 MB

# Free: 2 GB box − 780 MB peak − 400 MB OS+systemd headroom = 820 MB slack
# cgroup MemoryHigh at 1700 MB, MemoryMax at 1950 MB.
```

Why those numbers:
- `MemoryHigh=1700M` — Linux starts reclaiming the cgroup's cache pages *before* it OOMs. We want to give back on pressure.
- `MemoryMax=1950M` — the cgroup's hard ceiling. systemd kills it cleanly; the `on-failure` restart comes back, and the job that was running is marked `error:interrupted`.
- **Never `MemoryMax=2G` exactly on a 2 GB box** — the cgroup doesn't subtract its own bookkeeping, and a `MemoryMax` reached during *legitimate* transient spikes kills the unit.

Edit `/etc/systemd/system/scamshield.service`:

```diff
 Environment=SSC_TARGET_CARDS=200
-MemoryHigh=1500M
-MemoryMax=2000M
+MemoryHigh=1700M
+MemoryMax=1950M
```

Apply:

```bash
sudo systemctl daemon-reload
sudo systemctl restart scamshield
sudo systemctl status scamshield   # Active; check MemoryCurrent
```

Verify with a smoke job:

```powershell
$r = Invoke-WebRequest "https://<sub.domain>/api/jobs" -Method POST `
   -Headers @{"content-type"="application/json"} -Body '{"query":"playstation 5"}' `
   -SkipCertificateCheck
$jobId = ($r.Content | ConvertFrom-Json).jobId

# watch it
curl.exe -N "https://<sub.domain>/api/jobs/$jobId/events" --max-time 200 -k
```

If the unit crashes mid-job with `oom-kill`, that's a sign `target=200` is too much; back to `target=180` and try again.

---

## Step 16.2 — Filesystem and file-descriptor limits

The Linux defaults for `fs.file-max` and per-process `ulimit -n` are usually fine on a 2 GB VPS (≈ 8k file descriptors globally; ≈ 1k per process). But SSE clients and Chromium *each* hold multiple FDs. If you see `EMFILE` errors in `journalctl`:

```bash
# check current limits
cat /proc/sys/fs/file-max                    # system-wide cap (default ~80k on EL9)
ulimit -n                                    # per-process

# raise per-process for the unit
sudo systemctl edit scamshield.service
# adds an override.conf:
[Service]
LimitNOFILE=8192

sudo systemctl daemon-reload
sudo systemctl restart scamshield
```

Also: enable Chromium's `--single-process` for **monitoring** of file-descriptor pressure on a hot day (it doesn't speed things up; it just concentrates FDs into one process):

```js
// in lib/capture.js, behind a dev flag:
const launchArgs = config.headed ? [] : (process.env.SSC_SINGLE_PROCESS ? ["--single-process"] : []);
chromium.launch({ headless: true, args: launchArgs });
```

> Use `--single-process` only for *diagnostic* runs. It disables Chromium's renderer sandbox protections (not the OS sandbox); the design doc is firm: don't run with `--single-process` in production.

---

## Step 16.3 — HTTP keepalive, SSE fan-out, and TCP keepalives

The orchestrator already has **one EventEmitter** feeding SSE and the persisted event log. For 100+ concurrent SSE clients (the v1+ demo load), we need:

- **HTTP/1.1 keepalive** — Apache 2.4 default; don't disable.
- **No buffering** on the events path — already set via `SetEnvIf ... no-gzip` (L9).
- **TCP keepalive** on outbound Chromium connections so half-open detects re-establish:

```bash
# /etc/sysctl.d/90-scamshield.conf
net.ipv4.tcp_keepalive_time = 600
net.ipv4.tcp_keepalive_intvl = 60
net.ipv4.tcp_keepalive_probes = 5
sudo sysctl -p /etc/sysctl.d/90-scamshield.conf
```

---

## Step 16.4 — A CDN cache for the byte-identical dashboard assets

The three dashboard files (`index.html`, `common.css`, `common.js`) are byte-identical across jobs. They're served from `/report/<id>/*`. A CDN at this layer means *every browser hit* is a cache hit after the first.

> The one per-query artifact is `data.js`. That's the *one* file we don't put behind a CDN.

### How to do this *without* adding a CDN dependency

```apache
# add to the include file (/etc/apache2/conf.d/userdata/ssl/2_4/<USER>/<subdomain>/scamshield.conf)
# Cache the byte-identical assets for a year; never cache data.js

<LocationMatch "^/report/[0-9-]+/[A-Za-z]+\.(html|css|js)$">
  Header set Cache-Control "public, max-age=31536000, immutable"
</LocationMatch>

<LocationMatch "^/report/[0-9-]+/data\.js$">
  Header set Cache-Control "no-cache, must-revalidate"
</LocationMatch>
```

> Don't reach for Cloudflare / Fastly yet. Apache's `mod_cache` (already installed on cPanel) does the same job for ~zero new infrastructure.

Verify:

```powershell
(Invoke-WebRequest "https://<sub.domain>/report/<id>/index.html" -Method HEAD -SkipCertificateCheck).Headers
# → expect Cache-Control: public, max-age=31536000, immutable
(Invoke-WebRequest "https://<sub.domain>/report/<id>/data.js" -Method HEAD -SkipCertificateCheck).Headers
# → expect Cache-Control: no-cache, must-revalidate
```

---

## Step 16.5 — A `lib/metrics.js` Prometheus-style export

Prometheus's text exposition format is *plain text*. We don't need the client library; we just print to text format and serve at `/metrics`.

```js
// mvp/app/lib/metrics.js — minimal Prometheus exporter
let registry = {};

export function incr(name, labels = {}, value = 1) {
  const k = labelKey(name, labels);
  registry[k] = (registry[k] || 0) + value;
}
export function gauge(name, labels = {}, value) {
  const k = labelKey(name, labels);
  registry[k] = value;
}
export function observe(name, labels = {}, seconds) {
  // histogram-lite: store sum + count, emit avg
  const sumK = labelKey(`${name}_sum`, labels);
  const cntK = labelKey(`${name}_count`, labels);
  registry[sumK] = (registry[sumK] || 0) + seconds;
  registry[cntK] = (registry[cntK] || 0) + 1;
}

function labelKey(name, labels) {
  const l = Object.keys(labels).sort().map(k => `${k}="${labels[k]}"`).join(",");
  return `${name}{${l}}`;
}

export function expose() {
  // Group by base metric name (drop _sum / _count suffixes for avg formatting).
  const out = new Map();
  for (const [k, v] of Object.entries(registry)) {
    const m = k.match(/^([a-z_]+)(\{.*?\})?$/);
    if (!m) continue;
    const base = m[1];
    if (out.has(base)) out.get(base).push(`${k} ${v}`);
    else out.set(base, [`# TYPE ${base} gauge`, `${k} ${v}`]);
  }

  // Histograms: emit avg + count
  for (const key of Object.keys(registry)) {
    const sumMatch = key.match(/^(.+?)_sum(\{.*?\})$/);
    if (!sumMatch) continue;
    const [, base, labels] = sumMatch;
    const countK = `${base}_count${labels}`;
    const count = registry[countK] || 0;
    if (!count) continue;
    const avg = registry[key] / count;
    (out.get(`${base}_seconds`) || out.set(`${base}_seconds`, [`# TYPE ${base}_seconds gauge`]).get(`${base}_seconds`))
      .push(`${base}_seconds${labels} ${avg.toFixed(3)}`);
  }

  let body = "";
  for (const [, lines] of out) body += lines.join("\n") + "\n";
  return body;
}
```

Wire it into the router (`lib/router.js`):

```js
import { incr, observe, expose } from "./metrics.js";

// after handling a job's :done event:
observe("scamshield_job_duration_seconds", { state: job.state }, (Date.now() - jobStartMs) / 1000);
incr("scamshield_jobs_total", { state: job.state });

// in handle(), add a route:
if (req.method === "GET" && u.pathname === "/metrics") {
  res.writeHead(200, { "content-type": "text/plain; version=0.0.4" });
  return res.end(expose());
}
```

What you measure at this layer:

```
scamshield_jobs_total{state="done"}                     37
scamshield_jobs_total{state="error:sign_in_required"}  12
scamshield_jobs_duration_seconds{state="done"}          63.4
scamshield_facets_total{facet="current",status="ok"}    49
scamshield_facets_total{facet="sold",status="sign_in_required"}  49
```

You can scrape this with Prometheus later (L17). For now, it's a port you might wire to `curl` + a CSV.

---

## Step 16.6 — A simple `load.sh` for stress-testing the single-flight model

```bash
#!/usr/bin/env bash
# /opt/scamshield/scripts/load.sh
# 1) Submit N jobs back-to-back; measure completion time and 409 rate.
set -e
BASE="${SSC_BASE:-https://<sub.domain>}"
N="${1:-5}"

echo "[load] submitting $N jobs to $BASE"
SUCCESS=0
BUSY=0
ERROR=0

for i in $(seq 1 $N); do
  R=$(curl -sk -X POST "$BASE/api/jobs" \
       -H 'content-type: application/json' \
       -d "{\"query\":\"load-test-$i\"}" -w "%{http_code}" -o /tmp/.resp)
  if [ "$R" = "202" ]; then SUCCESS=$((SUCCESS+1));
  elif [ "$R" = "409" ]; then BUSY=$((BUSY+1));
  else ERROR=$((ERROR+1));
  fi
done

echo "[load] 202=$SUCCESS, 409=$BUSY, error=$ERROR"
```

Run:

```bash
bash /opt/scamshield/scripts/load.sh 20
```

Expected:

```
[load] submitting 20 jobs to https://concierge.<domain>
[load] 202=1, 409=19, error=0
```

That's by design: single-flight. The 19 `409`s are **correct behavior**. If you want more than 1 job in flight, you've outgrown vertical scale; L17.

---

## Step 16.7 — Cost-of-vertical-scale (the realism check)

A 2 GB VPS is ~$10/month. Doubling to 4 GB RAM + 4 vCPU is typically ~$25/month on LiquidWeb.

Vertical-scale options, in cost order:

| Tier | RAM | vCPU | Cost (mo) | DAU ceiling (single-flight) |
|---|---|---|---|---|
| Current | 2 GB | 2 | ~$10 | ~500–1k DAU |
| Mid | 4 GB | 4 | ~$25 | ~5k–10k DAU |
| Top | 8 GB | 6 | ~$50 | ~10k–20k DAU |

The break-even point is when **wall-clock-per-job** (currently 60–90s) becomes the bottleneck rather than memory. Mitigations before going up a tier:

| Mitigation | Effort | Saves |
|---|---|---|
| Reduce target to 120 cards/facet | 1 line config | ~30% peak RAM, ~15% job duration |
| Skip the fullPage PNG if eBay's rate-limit signal is high | ~30 lines code | ~25% job duration, ~80% RAM during capture |
| Reuse the *current* facet capture across queries (cache last 5 queries' current-facet captures) | ~50 lines code | 100% saved on cache hit |
| Cache `report/data.js` for popular queries in the same `report/` subdir | trivial | 100% on cache hit |

> *The honest answer to "do I need to scale now?" is usually "no, your design is already more efficient than you think."* The single-flight model is more efficient than concurrent-scaling at single-digit DAU; the cap is reached at ~1k sustained DAU when the eBay rate-limit becomes the actual constraint.

---

## Anti-patterns to avoid

- ⛔ **Don't add Redis.** You're serving single-job-at-a-time; in-memory state is faster.
- ⛔ **Don't add Postgres.** Job metadata is `job.json`; query list is `listRecentJobs()`. A database is overhead.
- ⛔ **Don't worry about "WebSocket vs SSE" until you have 5+ concurrent SSE clients complaining.** SSE handles that just fine.
- ⛔ **Don't reach for Cloudflare before exhausting Apache's `mod_cache`.** Same effect, zero new dependency.
- ⛔ **Don't `MemoryMax=2G` exactly.** Service crash on transient spikes.

---

## What "done" means for Lesson 16

1. `target=200` and `MemoryMax=1950M` are in production and survived 3 jobs without OOM.
2. Apache `Cache-Control` headers verified for both `*.html|css|js` and `data.js`.
3. `/metrics` returns valid Prometheus text format with `scamshield_*` metrics.
4. `load.sh` returns the expected (1, 19, 0) pattern.

Vertical scale has a ceiling (≈ 1k DAU on this architecture). When you outgrow it, that's L17. **Most apps in this space won't outgrow it.**
