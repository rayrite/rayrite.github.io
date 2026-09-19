# Lesson 17 · Horizontal scale — multi-VM topology, load balancer, IaC

> **Visual aid:** `visual-aids/va08_deployment_topology.html` (extended by hand).
> **Time budget:** ~10 hrs · **Audience:** once DAU exceeds ~1k sustained and single-flight is the bottleneck.

---

## What this lesson produces

The same app, the same code, but split across multiple LiquidWeb VPS boxes so jobs can run *concurrently*, not serially:

1. **Three VM tiers** — `web` (proxies + Node), `worker` (Playwright + capture), `data` (golden + backups).
2. **A load balancer** — HAProxy on a third small VM, in front of two `web` VMs.
3. **Job routing** — a sticky session (or *job ID* hash) so the same query's live status is on the same VM the user connected to.
4. **IaC with Terraform** — declarative, version-controlled, reproducible.

> We leave `node:http`, `node --test`, Playwright, and the *file-based* job store unchanged. The split is deployment topology, not architecture redesign. The MVP's design choices survive this scaling.

---

## What we deliberately keep shared

The single-instance discipline is what makes horizontalizing tractable. Three properties:

- **No shared mutable state** (jobs are 100% file-based; the orchestrator is in-process).
- **No client affinity required beyond job ID** (every operation on a job is by ID).
- **No coupling between capture & analysis** (they're sequential within a job; the capture module is the only browser-touching code; analysis is pure functions).

This means **horizontal scaling only requires file synchronization** — not Redis, not Postgres, not a queue broker. We can do this with NFS or with periodic rsync. Take your pick based on cost.

---

## Step 17.1 — Topology

```
                                 Internet
                                    │
                                    ▼
                          ┌──────────────────┐
                          │      HAProxy     │   (small VM: 1 vCPU, 1 GB)
                          │  - TLS terminate │
                          │  - /api/jobs/* sticky by session
                          │  - /report/* anycast
                          │  - /static/* anycast to web tier
                          └────┬─────────┬───┘
                               │         │
              ┌────────────────┘         └────────────────┐
              ▼                                            ▼
      ┌───────────────┐                          ┌───────────────┐
      │   web-01      │                          │   web-02      │    (medium VM: 2 vCPU, 2 GB)
      │  - scamshield │                          │  - scamshield │
      │  - SvelteKit  │     ...N more if needed  │  - SvelteKit  │
      └────┬──────────┘                          └────┬──────────┘
           │                                          │
           │ Playwright + CDP                         │ Playwright + CDP
           ▼                                          ▼
      ┌───────────────┐                          ┌───────────────┐
      │  data-tier    │  ←─── same NFS volume ──▶  │
      │  /srv/data    │       (or periodic rsync)   │               │
      │  jobs/        │                              │               │
      │  golden/      │                              │               │
      │  backups/     │                              │               │
      └───────────────┘
```

The data-tier can be a small VM with a big disk; web tier is ephemeral (regenerable from `data/ + code`); worker tier is between.

---

## Step 17.2 — Choose a shared-files strategy

Two patterns; pick the one that matches your ops tolerance:

### Pattern A — NFS mount (shared state, central truth)

Single `data-tier` VM exports `/srv/data` over NFS:

```bash
# /etc/exports on the data-tier
/srv/data  10.0.0.0/24(rw,sync,no_subtree_check,no_root_squash)
```

Each web VM mounts it:

```bash
# /etc/fstab on the web tier
data-tier:/srv/data  /opt/scamshield/data  nfs  defaults,_netdev,hard,intr  0 0
```

Pros: jobs are visible to all web VMs the moment they finish. Replay cross-VM works.
Cons: single point of failure (mitigate with a hot spare & DRBD, or just snapshotted nightly backups).

### Pattern B — Distributed rsync (each web VM holds its own data)

```bash
# /etc/cron.d/scamshield-data-sync on each web VM
* * * * * scamshield rsync -az --delete data-tier:/srv/data/ /opt/scamshield/data/ 2>/dev/null
```

Pros: no NFS dependency, survives data-tier failure momentarily.
Cons: 60-second lag on cross-VM visibility; a job created on web-01 won't appear on web-02's "Recent reports" for a minute.

**For 1k DAU**, Pattern A is simpler. **For 10k+ DAU** consider a real S3-style object store.

---

## Step 17.3 — HAProxy setup

`/etc/haproxy/haproxy.cfg`:

```
global
    maxconn 5000
    log /dev/log local0
    daemon

defaults
    mode http
    log global
    option httplog
    option http-server-close
    timeout connect 5s
    timeout client  30s     # base; per-route below
    timeout server  60s     # base; per-route below

frontend fe
    bind *:443 ssl crt /etc/haproxy/certs/<sub.domain>.pem
    bind *:80
    redirect scheme https code 301 if !{ ssl_fc }
    default_backend be-static

    # Stickiness based on a per-process session cookie (the JobId is enough;
    # but HAProxy needs a separate stable cookie. We use a JSESSIONID-shaped
    # value the app sets in Set-Cookie on POST /api/jobs).
    stick-table type ip size 50k expire 30m

    # API + SSE goes to web-N, sticky by cookie
    acl api_url path_beg /api/
    acl sess_cookie req.cook(JSESSIONID) -m found
    use_backend be-web if api_url sess_cookie
    use_backend be-web if api_url
    use_backend be-static

backend be-web
    balance roundrobin
    cookie JSESSIONID insert indirect nocache
    stick on src
    server web-01 10.0.0.11:8787 check inter 5s
    server web-02 10.0.0.12:8787 check inter 5s

backend be-static
    balance roundrobin
    option httpchk GET /healthz
    server web-01 10.0.0.11:8787 check inter 5s
    server web-02 10.0.0.12:8787 check inter 5s
```

Key choices:

- **`balance roundrobin` + `option httpchk`** — every healthy web VM serves anything; we don't enforce affinity *except* for `/api/*` stickiness. That lets `/report/*` keep working even if the original web VM is gone.
- **`timeout server 60s`** is too short for SSE (long-lived). Override with per-route rules if HAProxy 2.4+: `timeout tunnel 1h` for `/api/jobs/*/events` to keep long-lived connections. In HAProxy 2.6+ this is implicit when `mode http` and the proxy protocol is `HTTP/1.1`.

Verify:

```bash
# After a restart:
sudo haproxy -c -f /etc/haproxy/haproxy.cfg
sudo systemctl reload haproxy
curl -fs https://<sub.domain>/healthz | jq
```

---

## Step 17.4 — Job routing, single-flight per web VM (NOT across)

> **Critical decision:** the orchestrator's single-flight is *per-process*, not cluster-wide. Multiple web VMs run jobs *concurrently* (one per VM). That's the whole point of horizontalizing.

This is exactly what we want at 1k DAU: jobs run in parallel across VMs. Replays and dashboard reads stay consistent because they read from the shared `/srv/data` mount.

If a single user submits two queries at once and lands on different VMs, each VM hosts its own job. The home page's Recent reports list is the union of what `listRecentJobs()` shows on the VM you hit; with an NFS mount, that's the cluster's full set (modulo a 100 ms read-after-write delay).

---

## Step 17.5 — Terraform (the IaC skeleton)

```hcl
# main.tf — full topology
terraform {
  required_providers {
    liquidweb = { source = "liquidweb/liquidweb" }
  }
}

variable "zone" { default = "USEAST1" }

locals {
  ssh_key = file("~/.ssh/scamshield_deploy.pub")
  project = "scamshield"
}

# Subnet + VLAN — LiquidWeb's API
resource "liquidweb_vlan" "main" {
  name        = "${local.project}-vlan"
  region      = var.zone
  description = "scamshield MVP main network"
}

# 1 LB
resource "liquidweb_server" "lb" {
  hostname   = "${local.project}-lb"
  zone       = var.zone
  plan       = "1CPU-1GB"
  image      = "almalinux-9"
  ssh_key    = local.ssh_key
  vlan       = liquidweb_vlan.main.id
  tags       = ["role=lb"]
}

# 2 web
resource "liquidweb_server" "web" {
  count      = 2
  hostname   = "${local.project}-web-${count.index}"
  zone       = var.zone
  plan       = "2CPU-2GB"
  image      = "almalinux-9"
  ssh_key    = local.ssh_key
  vlan       = liquidweb_vlan.main.id
  tags       = ["role=web", "tier=app"]
}

# 1 data
resource "liquidweb_server" "data" {
  hostname   = "${local.project}-data"
  zone       = var.zone
  plan       = "2CPU-4GB"          # bigger disk
  image      = "almalinux-9"
  ssh_key    = local.ssh_key
  vlan       = liquidweb_vlan.main.id
  tags       = ["role=data", "tier=storage"]
}

# DNS — point <sub.domain> at the LB
resource "liquidweb_dns_record" "app" {
  zone = "<your-root-domain>"
  name = "<sub>"
  type = "A"
  data = liquidweb_server.lb.ipv4
}

output "lb_ip" { value = liquidweb_server.lb.ipv4 }
output "web_ips" { value = liquidweb_server.web[*].ipv4 }
output "data_ip" { value = liquidweb_server.data.ipv4 }
```

> *Storing Terraform state*: pin it to the data-tier's persistent disk. The state IS critical; never store in a developer's home directory.

The deploy workflow (`deploy.yml` from L10) becomes:

```yaml
- name: rsync to all web VMs
  run: |
    for ip in $WEB_IPS; do
      rsync -az --delete --exclude node_modules/ --exclude data/ \
        mvp/app/ scamshield@$ip:/opt/scamshield/app/
      ssh scamshield@$ip "sudo systemctl restart scamshield"
    done
```

(Read `$WEB_IPS` from `terraform output -json web_ips | jq -r '.[]'` and stash in the GH Actions environment.)

---

## Step 17.6 — The "shared-state gotcha" check (NFS-specific)

> If two web VMs both produce jobs at the same time, their MHTML files can clash on the NFS mount.

Two safeguards:

**A. Job ID prefix by VM.** Make `createJob()` prefix with a hostname hash:

```js
import os from "node:os";
const VM_TAG = os.hostname().slice(0, 4);   // "web-", "webs", etc.
function newId() {
  return `${VM_TAG}-${stamp()}-${rand()}`;   // uniqueness across the cluster
}
```

**B. A `touch`-then-move atomicity.** `fs.writeFile` to `path.tmp`, then `rename`. The NFS server respects rename-atomicity on the same filesystem. We already do this in `lib/jobs.js` — keep the discipline.

Verify with `stress -h 5 bash load.sh 50`:

```bash
bash /opt/scamshield/scripts/load.sh 50
# → expect 202 ~25, 409 ~25 (each of 2 web VMs picks one in flight at a time)
```

---

## Step 17.7 — Observability across the cluster

Add a `/metrics` endpoint to *every* web VM (L16 already gave you the exporter; just expose it). HAProxy exposes *its own* metrics too:

```bash
# HAProxy stats
echo "    stats enable" >> /etc/haproxy/haproxy.cfg
echo "    stats uri /haproxy?stats" >> /etc/haproxy/haproxy.cfg
echo "    stats refresh 10s" >> /etc/haproxy/haproxy.cfg
```

Then Prometheus scrapes:

```yaml
scrape_configs:
  - job_name: scamshield-web
    static_configs:
      - targets: ['10.0.0.11:8787', '10.0.0.12:8787']
  - job_name: haproxy
    static_configs:
      - targets: ['<lb>:8404']   # HAProxy stats page
```

---

## Step 17.8 — When *not* to horizontalize (the realism check)

Cases where adding a web VM does *not* help:

- **eBay rate-limit on a single IP.** A second web VM uses a second IP, but both are *LiquidWeb datacenter IPs* — same ASN, same eBay-side blocklist bucket. Spinning up a second VM doesn't unlock more eBay traffic; the apps on each VM throttle themselves.
- **A single heavy query that takes 5 minutes.** Adding a VM doesn't make that query faster; you have to lower `target` or improve the parallelism *within* a capture (a different shape of refactor).
- **The disk is full.** Adding RAM helps; adding VMs doesn't.

When it *does* help:

- **Steady DAU where users wait >10s for a job slot.** Add a web VM.
- **The 2 GB RAM ceiling causes OOMs under load.** Move to 4 GB per VM (vertical) before adding a second VM.

> Real-world observation: most apps in this space *don't* outgrow single-VM until ~5k DAU. **Don't over-engineer;** L16's vertical ceiling is 1k DAU which buys ~6 months of runway, often.

---

## Anti-patterns to avoid

- ⛔ **Don't introduce a queue broker (Redis/RabbitMQ).** The orchestrator's single-flight + file-based jobs already serializes. Brokers add dependency, ops surface, and "we lost a job?" debugging.
- ⛔ **Don't store live state in `redis` and call it "ephemeral".** Replays are tied to MHTML on disk; moving ephemeral state to a different tier *separates* the model.
- ⛔ **Don't centralize state in one VM that all writes go through.** Bottleneck; that VM dies, your cluster dies.
- ⛔ **Don't size all web VMs the same as the production peak.** 2 web VMs of 2 GB each = 4 GB cluster; you pay for it on idle. Run 1 web VM until demand requires 2.
- ⛔ **Don't skip the VAPID-style HAProxy stickiness test.** A misrouted SSE stream is *invisible* until you watch one. Always verify.

---

## What "done" means for Lesson 17

1. **Two web VMs + one LB + one data VM** are visible via `terraform output`.
2. **`stress bash load.sh 50`** produces 25×202, 25×409 on a 2-web-VM cluster.
3. **`/healthz` from each VM** returns 200.
4. **`/haproxy?stats`** is reachable.
5. **DNS for `<sub.domain>`** points at the LB; TLS at HAProxy is issued.
6. **A `terraform destroy` test** actually destroys what you built (this verifies the state file is correct).

Most teams don't get here. When you do, you've graduated from single-box app to small fleet — and **the design doc's earlier choices pay off** by making the migration boring.

L18 picks up the *security hardening* track if you have compliance requirements (CIS benchmarks, fail2ban, Vault, audit logging). It's a separate axis from scaling; you can be at v1+ security with single-VM and at v1 security with multi-VM.
