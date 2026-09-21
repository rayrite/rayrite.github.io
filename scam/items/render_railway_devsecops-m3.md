# Render and Railway — A Beginner's DevSecOps Primer

*Wide-research deliverable for a beginner DevSecOps engineer — date anchored: 2026-09-20 (America/New_York)*

> **Verbatim request**
> "/rdw-conduct-wide-research please research the documentation for Render and Railway and provide a detailed primer on how to use the services for each provider. Please create separate sections for onboarding, beginner, intermediate, and advanced tasks and features."

---

## Executive summary

Render and Railway are both "git push to deploy" Platform-as-a-Service (PaaS) providers aimed at developers who want to ship HTTP services, background workers, and databases without managing servers. Both support GitHub-driven deploys, environment variables, custom domains, managed Postgres/Redis, and preview/ephemeral environments. Both have a CLI and infrastructure-as-code support. The differences show up in the details:

- **Render** leans toward an explicit, Heroku-style model with strong support for **Blueprints** (`render.yaml`) as the IaC source of truth, **environment groups** for shared secrets across services, **persistent disks** for stateful workloads, and **private services** reachable over an internal network. Its free tier still exists in 2026, and the platform exposes a complete lifecycle (build → pre-deploy → health check → traffic swap → drain) that is good to learn because it mirrors production patterns.
- **Railway** leans toward a usage-based, less-restrictive model with **Railpack** as a Nixpacks-style auto-detecting buildpack, **sealed variables** for write-only secrets, **reference variables** (`${{service.VAR}}`) for wiring services together without hardcoding, a **`.railway.internal` private mesh** encrypted by WireGuard, and a built-in toggle for **per-PR ephemeral environments** that deploy only the services whose code changed (useful in monorepos).

For a beginner DevSecOps engineer, the practical advice is: **start with Render to learn the deploy lifecycle**, then **move to Railway when you want usage-based pricing and tighter per-PR isolation**. The two are similar enough that skill transfers cleanly. The rest of this primer walks you through both providers in order: onboarding → beginner → intermediate → advanced. Read end-to-end on day one, then keep it as a reference when you hit a specific task (setting up a database, configuring a custom domain, deploying from a Blueprint, etc.).

---

## Background — what a beginner DevSecOps engineer needs before reading this

This primer assumes you already know:

- **Git basics**: clone, add, commit, push, branches, pull requests. If you don't, GitHub's [Hello World](https://docs.github.com/en/get-started/start-your-journey/hello-world) is enough.
- **Docker basics**: what a Dockerfile is, what an image is, what a container does. You don't need to be a Docker expert — Render and Railway both have auto-detecting build systems — but knowing what `CMD`, `EXPOSE`, and `ENV` mean helps.
- **HTTP basics**: ports, methods, headers, status codes, what an environment variable is.
- **One language runtime** (Node.js, Python, or Go). All examples below show all three where it matters.
- **One terminal**: bash, zsh, or PowerShell. Commands shown are bash; PowerShell equivalents are noted where they differ.
- **A GitHub account**: both providers strongly prefer GitHub for source-linked deploys.

This primer does **not** assume:

- Kubernetes, Terraform, or AWS experience.
- Familiarity with the prior Heroku-style PaaS world (`Procfile`, `slug`, etc.). Where these terms appear, they're explained inline.
- Deep networking knowledge. Where private networking, dedicated IPs, and TLS come up, the primer explains the concepts as well as the steps.

The DevSecOps angle — meaning the parts of the platform that touch security, identity, secrets, networking, audit, and compliance — appears throughout, but is concentrated in the **Intermediate** and **Advanced** sections of each provider.

---

# Section A — Render primer

Render is a managed cloud platform that runs web services, background workers, cron jobs, static sites, and managed databases (Postgres + Key Value / Redis) inside one workspace. You connect a GitHub/GitLab/Bitbucket repo, Render builds and deploys, and you manage everything via the dashboard, the Render CLI, or a declarative `render.yaml` Blueprint. ([Render pricing](https://render.com/pricing); [Render Docs](https://docs.render.com))

## A.1 — Render: Onboarding

Goal of this section: create your Render account, install the CLI, understand the workspace model, and deploy "hello world" with one command.

### Step 1 — Create an account

1. Go to [dashboard.render.com/register](https://dashboard.render.com/register).
2. Sign up with email, GitHub, GitLab, or Bitbucket. **If you intend to deploy from a Git repository, sign up with that provider** — Render will then have permission to read your repos and trigger builds on push.
3. After signup, Render creates a default workspace. Workspaces are containers for services, members, billing, and audit history. Most solo developers use one workspace; teams often split workspaces by environment (`personal`, `work`, `client-acme`).

Render uses **workspaces** instead of "organizations" or "teams". Every account starts on the free **Hobby** workspace tier with 1 seat, 5 GB outbound bandwidth, and 500 build-pipeline minutes per month. ([Render free docs](https://docs.render.com/free))

### Step 2 — Install the Render CLI

The Render CLI lets you deploy from your terminal, view logs, SSH into running services, and validate `render.yaml` files locally. ([Render CLI docs](https://docs.render.com/docs/cli))

**macOS / Linux (Homebrew)**:

```bash
brew install render
```

**macOS / Linux (direct download)**:

```bash
curl -L https://github.com/render-oss/cli/releases/latest/download/cli_linux_amd64.zip -o render.zip
unzip render.zip
sudo mv cli_* /usr/local/bin/render
```

**Windows**:

```powershell
winget install Render.cli
```

Verify the install:

```bash
render --version
```

Authenticate the CLI against your Render account. Two modes:

```bash
# Interactive — opens a browser, you confirm
render login

# Non-interactive — for CI/CD pipelines
export RENDER_API_KEY=rnd_xxx
```

Get an API key from [dashboard.render.com/u/*/settings#api-keys](https://dashboard.render.com/u/*/settings#api-keys). Use the API key mode only when you need scripts to run unattended; never paste it into a chat or commit it to a repo.

### Step 3 — Set the active workspace

If you have more than one workspace:

```bash
render workspaces                  # list all
render workspace set <workspace>  # set as active
```

Every subsequent CLI command operates against the active workspace.

### Step 4 — Create your first service via the dashboard

1. In the dashboard, click **New → Web Service**.
2. Connect a GitHub repo (or pick "Existing Image" to deploy a prebuilt Docker image).
3. Fill in the service creation form. The defaults usually work — but understand what each field does:

| Field | Meaning |
|---|---|
| Name | The service identifier and your `*.onrender.com` subdomain |
| Region | Oregon (default), Ohio, Virginia, Frankfurt, Singapore |
| Branch | Git branch to build (default: `main`) |
| Runtime | Node, Python, Go, Ruby, Rust, Elixir, PHP, or Docker |
| Build Command | e.g. `npm install`, `pip install -r requirements.txt` |
| Start Command | e.g. `npm start`, `uvicorn app:app --host 0.0.0.0 --port $PORT` |
| Instance Type | Free / Starter / Standard / Pro / Pro Plus / Pro Max / Pro Ultra |

**Critical**: your app **must bind to `0.0.0.0:$PORT`** (Render injects `$PORT` as an env var). Hardcoding port 3000 or 8080 won't work — Render expects port 10000 by default and routes external traffic to whatever `$PORT` your app listens on.

### Step 5 — Watch the first build

Render builds in the cloud. The **Events** tab streams progress in real time:

```
==> Cloning from https://github.com/you/your-app...
==> Installing dependencies...
==> Building...
==> Build succeeded 🎉
==> Deploying...
==> Your service is live at https://your-service-name.onrender.com
```

If the build fails, the previous version keeps running — Render does not deploy a broken version to production traffic.

### Onboarding checklist

- [ ] Account created via GitHub OAuth
- [ ] CLI installed and authenticated
- [ ] Default workspace understood (Hobby / free)
- [ ] First Web Service deployed via dashboard
- [ ] Service responds at `*.onrender.com`

---

## A.2 — Render: Beginner

Goal: understand environment variables, custom domains, deploy hooks, basic logs, and how to trigger deploys from a Git push.

### Environment variables — three ways to set them

Render exposes configuration to your service as **environment variables**. Values are always strings at the platform layer; applications must parse numbers, booleans, and JSON themselves. ([Render env vars docs](https://docs.render.com/environment-variables))

#### Method 1 — Dashboard UI

1. Open your service in the dashboard.
2. Click **Environment** in the left sidebar.
3. Click **Add Environment Variable**.
4. Enter key + value, or paste a `.env`-style file for bulk import.
5. Choose a save option:
   - **Save and rebuild & deploy** — picks up build-time changes
   - **Deploy only** — runtime change without a rebuild (when applicable)
   - **Save only** — persist without triggering a deploy

#### Method 2 — Blueprint (`render.yaml`)

In your repo root, add a `render.yaml`:

```yaml
services:
  - type: web
    name: api
    runtime: node
    plan: starter
    buildCommand: npm ci
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: ZAI_API_KEY
        sync: false  # prompts in the dashboard on first apply
      - key: DATABASE_URL
        fromDatabase:
          name: mydb
          property: connectionString
```

The four value sources in `envVars`:

| Source | What it does |
|---|---|
| `value: <literal>` | Hardcoded value — only for non-secrets |
| `fromDatabase: { name, property }` | Injects a managed Postgres connection string |
| `fromService: { type, name, property }` | Injects another service's URL or connection string |
| `generateValue: true` | Render generates a base64-encoded 256-bit random value at provision time |
| `sync: false` | Declared in YAML but value set manually in dashboard; excluded from preview environments |

#### Method 3 — Render MCP / API

The Render MCP server exposes `update_environment_variables` and other tools to AI agents and external scripts. For Bash automation, hit the REST API directly:

```bash
curl -X PATCH "https://api.render.com/v1/services/$SERVICE_ID/env-vars" \
  -H "Authorization: Bearer $RENDER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '[{"key": "ZAI_API_KEY", "value": "sk-xxx"}]'
```

#### Effect of changing an env var

- **Runtime-only variable** (most API keys, `LOG_LEVEL`): changing it triggers a **restart** of the running container, not a rebuild. Your service is briefly unavailable during the restart — typically 5–15 seconds.
- **Build-time variable** (e.g. `NEXT_PUBLIC_API_URL` baked into a JS bundle): triggers a **rebuild and redeploy**.

### Secret files — for multi-line credentials

For service-account JSON files, TLS certificates, or any multi-line credential, use **Secret Files** instead of stuffing a giant string into an env var.

1. Dashboard → Service → **Environment → Secret Files**.
2. Enter the path the file should appear at inside the container (e.g. `/etc/secrets/gcp-service-account.json`).
3. Paste the file contents.
4. Combined limit: **1 MB total secret file payload per service or per linked env group**.

In your app:

```js
const credentials = JSON.parse(
  fs.readFileSync('/etc/secrets/gcp-service-account.json', 'utf8')
);
```

### Custom domains + automatic TLS

Render assigns every Web Service a free `*.onrender.com` subdomain. To use your own domain:

1. Dashboard → Service → **Settings → Custom Domains → Add Domain**.
2. Enter the domain (e.g. `api.example.com`).
3. Render tells you the DNS record to add. Two patterns:

| Pattern | DNS record | When to use |
|---|---|---|
| Apex (`example.com`) | ALIAS / ANAME at the registrar pointing to `render.com` (or CNAME to the onrender host) | Root domain |
| Subdomain (`api.example.com`) | CNAME `api` → `<service-name>.onrender.com` | Subdomains |

After DNS propagates, Render provisions a Let's Encrypt TLS certificate automatically. Both `http://` and `https://` work; Render forces HTTPS by redirecting HTTP to HTTPS at the edge.

To set up a www redirect (e.g. `www.example.com` → `example.com`):

1. Add both `example.com` and `www.example.com` as custom domains.
2. In service settings, mark `example.com` as the **primary**.
3. Render issues a single cert covering both names and configures the redirect.

### Logs

Two kinds of logs on Render:

- **Build logs**: visible in the **Events** tab or via `render deploys list` → click a deploy → "Build log" link.
- **Runtime logs**: the stdout/stderr of your running service.

View in dashboard: **Logs** tab. View in CLI:

```bash
render logs -r srv-xxxxx                  # last 100 lines
render logs -r srv-xxxxx --tail           # stream live
render logs -r srv-xxxxx --level error    # filter by level
render logs -r srv-xxxxx --text "panic"   # substring filter
render logs -r srv-xxxxx --start 5m       # last 5 minutes (ISO 8601 or relative)
render logs -r srv-xxxxx -o json | jq .   # structured output, pipe to jq
```

### Deploy hooks — trigger deploys from external systems

Render exposes a **Deploy Hook URL** for every service. POST to it to trigger a manual deploy without a git push.

1. Service → Settings → **Deploy Hook → Create Deploy Hook**.
2. Copy the URL (looks like `https://api.render.com/deploy/srv-xxx?key=yyy`).
3. Hit it with `curl`, or wire it to a CMS, a static-site rebuild, a webhook from another service, etc.

```bash
curl -X POST "https://api.render.com/deploy/srv-xxx?key=yyy"
```

### Auto-deploy on git push

By default, Render redeploys on every push to the connected branch. Configure under **Settings → Auto-Deploy**:

| Trigger | Behavior |
|---|---|
| `commit` | Deploy on every push to the connected branch (default) |
| `checksPass` | Deploy only when required Git checks pass (CI must succeed first) |
| `off` | Manual deploys only — use this for prod |

### Beginner checklist

- [ ] Can set env vars via dashboard, `render.yaml`, and CLI
- [ ] Understand the four value sources (`value`, `fromDatabase`, `fromService`, `generateValue`, `sync: false`)
- [ ] Can use Secret Files for multi-line credentials
- [ ] Custom domain configured with auto-TLS
- [ ] Can read build + runtime logs via dashboard and CLI
- [ ] Knows how to trigger a manual deploy via Deploy Hook

---

## A.3 — Render: Intermediate

Goal: managed Postgres, persistent disks, private services, environment groups, health checks, zero-downtime deploys, and basic horizontal scaling.

### Managed Postgres

Render Postgres is a managed PostgreSQL service that runs in the same workspace as your other services. ([Render Postgres docs](https://docs.render.com/postgresql))

1. Dashboard → **New → PostgreSQL**.
2. Pick a plan. The free tier exists but **expires 30 days after creation**, then enters a 14-day grace period before deletion. Paid tiers:

| Plan | RAM | Storage | Price | Backups | PITR |
|---|---|---|---|---|---|
| Free | 256 MB | 1 GB | $0 | None | No |
| Basic | 256 MB | 10 GB | $7/mo | 7 days | No |
| Starter | 256 MB | 10 GB | $15/mo | 7 days | No |
| Pro | 1 GB | 50 GB | $35/mo | 30 days | Yes |
| Pro Plus | 4 GB | 200 GB | $135/mo | 30 days | Yes |
| Pro Max | 8 GB | 500 GB | $250/mo | 30 days | Yes |

3. After creation, Render assigns the database an **internal hostname** (e.g. `dpg-xxxxx`) reachable only from services in the same region. It also assigns an **external hostname** for connecting from your laptop or from outside Render.

4. Wire it to a Web Service via Blueprint:

```yaml
databases:
  - name: mydb
    plan: starter
    databaseName: app_production
    postgresMajorVersion: "16"

services:
  - type: web
    name: api
    runtime: node
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: mydb
          property: connectionString  # internal URL, fastest
      - key: DATABASE_PUBLIC_URL
        fromDatabase:
          name: mydb
          property: externalConnectionString  # public URL, slower
```

The difference matters for performance and security. **Use the internal URL inside Render** (private network, lower latency, free egress). **Use the external URL only when connecting from your laptop, a CI runner, or a service outside Render**.

5. Render Postgres is encrypted at rest and in transit by default. To enable external connections from a static IP (e.g. your office VPN), use **Static Outbound IPs** (see Advanced section).

### Render Key Value (Redis-compatible)

Redis-compatible in-memory cache/store. Free tier: 25 MB, in-memory only, data lost on restart. Paid tiers start at $10/mo for 1 GB persistent Redis with backups.

### Persistent disks — for stateful workloads

A persistent disk is a block-storage volume that survives deploys and restarts. Attach one to a paid Web Service, Private Service, or Background Worker. ([Render disks docs](https://docs.render.com/disks))

**Critical constraint**: services with a persistent disk attached have **zero-downtime deploys disabled**. The platform swaps in a new instance instead of running two in parallel, because the disk is single-attach.

Dashboard → Service → **Disks → Add Disk** → set mount path + size. In Blueprint:

```yaml
services:
  - type: web
    name: api
    plan: starter
    disk:
      name: api-data
      mountPath: /data
      sizeGB: 10
```

Constraints:

| Constraint | Impact |
|---|---|
| Runtime access only | Disk is not available during `buildCommand` or `preDeployCommand` |
| Single-service attach | Only the attached service can read/write the disk |
| Not on cron jobs | Attach to a web service, private service, or worker instead |
| Not on one-off jobs | One-off jobs run on separate compute without disk access |
| Can grow, cannot shrink | Start small and grow as needed |

To copy data to/from the disk, use SCP via SSH:

```bash
scp -s YOUR_SERVICE@ssh.YOUR_REGION.render.com:/mount/path/file ./local-file
scp -s ./local-file YOUR_SERVICE@ssh.YOUR_REGION.render.com:/mount/path/file
```

### Private services — internal-only network endpoints

A Private Service is a Web Service that is **not** reachable from the public internet. Other services in the same region and workspace can reach it over Render's private network. ([Render private services](https://docs.render.com/private-services))

Use cases:

- Internal APIs that only other services should call
- Background workers that should not be exposed
- Microservices that compose with public-facing services

```yaml
services:
  - type: pserv  # "private service"
    name: internal-api
    runtime: go
    plan: starter
    buildCommand: go build -o bin/app
    startCommand: ./bin/app
```

Other services reach it via `http://internal-api:10000` (port is what your app listens on). For Redis/Postgres-style references, use `fromService` in env vars.

### Environment groups — shared config across services

When multiple services need the same `DATABASE_URL`, `LOG_LEVEL`, or third-party API key, define them once in an **environment group** and link the group to any number of services. ([Render env vars docs](https://docs.render.com/environment-variables))

Dashboard → **Environment Groups → New Environment Group** → add keys and values → link to services. Updating the group redeploys all linked services.

```yaml
envVarGroups:
  - name: shared-config
    envVars:
      - key: LOG_LEVEL
        value: info
      - key: NODE_ENV
        value: production

services:
  - type: web
    name: api
    envVars:
      - fromGroup: shared-config
      - key: API_KEY  # service-specific override
        sync: false
  - type: worker
    name: worker
    envVars:
      - fromGroup: shared-config
```

Precedence rules:

- **Service-level variables override group variables with the same name.**
- **Multiple groups on one service**: the most recently created group wins for overlapping keys. Don't rely on this — use distinct names or consolidate.

### Health checks — the cornerstone of zero-downtime

Render uses health checks to determine when a new deploy is ready to receive traffic. The flow is: build new instance → run health check → route traffic to new instance → terminate old instance. ([Render health check docs](https://docs.render.com/health-checks))

Configure a `healthCheckPath` in Blueprint or dashboard:

```yaml
services:
  - type: web
    name: api
    healthCheckPath: /healthz
```

The endpoint must return `2xx` or `3xx` for the deploy to go live. If it returns `4xx`/`5xx` or times out, the deploy fails and the previous version keeps serving traffic.

Best practices for the health check endpoint:

- Keep it **fast** (< 100 ms) — Render polls it on an interval.
- Don't connect to the database on every call (slow, false negatives).
- Don't check third-party services (your `/healthz` shouldn't fail because Stripe is having an outage).
- Use a **two-phase pattern** for slow-startup apps: `/healthz` returns 200 immediately ("process is alive"), `/ready` returns 200 only after heavy init ("ready for traffic"). Point Render's health check at `/ready` for slow services.

### Zero-downtime deploy lifecycle

The full Render deploy flow for a Web Service:

1. **Build** — clone repo, run `buildCommand`, produce the runnable artifact.
2. **Pre-deploy command** (optional) — runs in the new image **before** traffic switches. Use for **migrations**. If it fails, the deploy is canceled.
3. **Deploy** — new instances start; health checks must pass before traffic moves.
4. **Zero-downtime swap** — traffic shifts to new instances; **old instances drain** in-flight work.
5. **`maxShutdownDelaySeconds`** (range 1–300, default 30) — how long old instances may keep handling requests during drain before SIGTERM.

When the platform sends SIGTERM (during deploy, scale-down, or manual restart), your app has up to 30 seconds to drain. Implement a SIGTERM handler that stops accepting new connections and finishes in-flight requests:

```js
// Node.js
process.on('SIGTERM', () => {
  console.log('SIGTERM received, draining...');
  server.close(() => process.exit(0));
  // Force exit after 25 seconds
  setTimeout(() => process.exit(1), 25_000).unref();
});
```

Without a handler, Render sends SIGKILL at 30 seconds and in-flight requests drop.

### Manual scaling and autoscaling

Two scaling modes:

**Manual**: set `numInstances` in Blueprint or dashboard. Simple.

```yaml
services:
  - type: web
    name: api
    plan: standard
    numInstances: 3
```

**Autoscaling** (requires Professional/Pro workspace or higher):

```yaml
services:
  - type: web
    name: api
    plan: standard
    scaling:
      minInstances: 1
      maxInstances: 10
      targetCPUPercent: 60
      targetMemoryPercent: 70
```

Render scales between `minInstances` and `maxInstances` to keep CPU and memory below the targets. Autoscaling is disabled in preview environments.

### Intermediate checklist

- [ ] Provisioned a managed Postgres and wired it via `fromDatabase`
- [ ] Knows when to use `internalConnectionString` vs `externalConnectionString`
- [ ] Attached a persistent disk to a paid service
- [ ] Created a private service and reached it over the internal network
- [ ] Set up an environment group with shared variables
- [ ] Configured a health check path on a web service
- [ ] Understands the deploy lifecycle and SIGTERM drain behavior
- [ ] Configured manual scaling or autoscaling

---

## A.4 — Render: Advanced

Goal: Blueprints (`render.yaml`) as IaC, preview environments, dedicated outbound IPs, cron jobs, one-off jobs, SSH access, and security hardening.

### Blueprints (`render.yaml`) — infrastructure as code

A Blueprint is a `render.yaml` file at your repo root that declaratively defines your entire stack: services, databases, env vars, scaling, and groups. Render reads it and provisions everything in one step. ([Render Blueprint spec](https://docs.render.com/blueprint-spec))

#### Full-featured example

```yaml
services:
  # Public web service
  - type: web
    name: api
    runtime: node
    plan: starter
    region: oregon
    buildCommand: npm ci && npm run build
    startCommand: npm start
    branch: main
    autoDeploy: true
    healthCheckPath: /health
    numInstances: 2
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        fromDatabase:
          name: app-db
          property: connectionString
      - key: REDIS_URL
        fromService:
          name: app-cache
          type: redis
          property: connectionString
      - key: JWT_SECRET
        generateValue: true
      - key: STRIPE_SECRET_KEY
        sync: false
      - fromGroup: shared-config

  # Background worker (no public URL, no health check)
  - type: worker
    name: job-processor
    runtime: python
    plan: starter
    buildCommand: pip install -r requirements.txt
    startCommand: celery -A tasks worker --loglevel=info
    envVars:
      - key: REDIS_URL
        fromService:
          name: app-cache
          type: redis
          property: connectionString

  # Cron job
  - type: cron
    name: daily-cleanup
    runtime: node
    plan: starter
    schedule: "0 3 * * *"
    buildCommand: npm ci
    startCommand: node scripts/cleanup.js
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: app-db
          property: connectionString

  # Private service (internal only)
  - type: pserv
    name: internal-api
    runtime: go
    plan: starter
    buildCommand: go build -o bin/app
    startCommand: ./bin/app

  # Static site
  - type: static
    name: docs
    runtime: static
    buildCommand: npm ci && npm run build
    staticPublishPath: ./dist
    routes:
      - type: rewrite
        source: /*
        destination: /index.html

databases:
  - name: app-db
    plan: starter
    databaseName: app_production
    postgresMajorVersion: "16"
    region: oregon

  - type: redis
    name: app-cache
    plan: starter
    ipAllowList: []  # only reachable via private network by default

envVarGroups:
  - name: shared-config
    envVars:
      - key: LOG_LEVEL
        value: info
      - key: ENVIRONMENT
        value: production
```

#### How to apply a Blueprint

There are three ways to deploy from a Blueprint:

1. **Dashboard**: New → Blueprint → connect repo → Render reads `render.yaml` → creates all resources → prompts for any `sync: false` secrets → applies.
2. **CLI**:
   ```bash
   render blueprints validate            # validate syntax locally
   render blueprints apply               # apply to the active workspace
   ```
3. **API** (for automation):
   ```bash
   curl -X POST "https://api.render.com/v1/blueprints" \
     -H "Authorization: Bearer $RENDER_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"name":"my-stack","repo":"https://github.com/you/your-app"}'
   ```

#### Blueprint immutability

Once a resource is created via Blueprint, certain fields become **immutable** (you can't change them by editing the Blueprint and re-applying). The classic gotcha: changing a service's `plan` after creation requires a manual dashboard edit. Immutable fields typically include `type`, `runtime`, `region`, and `name`. Always check the [Blueprint spec docs](https://docs.render.com/blueprint-spec) before relying on a change.

#### Preview environments via Blueprint

Render can spin up **preview environments** automatically for every pull request. Enable in your Blueprint:

```yaml
previews:
  generation: auto_preview  # one preview per PR
  expiresAfter: 7 days      # auto-cleanup
```

Each preview gets its own `.onrender.com` URL, isolated env vars, isolated databases (if you use `fromDatabase` with separate preview databases), and is destroyed when the PR is merged or closed.

### Dedicated outbound IPs

Some integrations (databases on AWS RDS, payment processors, partner APIs) require you to whitelist your service's outbound IP. Render's shared egress IPs rotate occasionally, which breaks allowlists. ([Render dedicated IPs](https://render.com/blog/dedicated-ips-for-your-services-on-render))

Render offers **Dedicated IPs** for workspaces on Pro/Scale/Enterprise:

- $100/month per IP set
- 3 static IPv4 addresses per set, scoped to a single region
- Routed through different availability zones for redundancy
- Scoped to a workspace or to specific environments (production vs staging)

If you don't need dedicated IPs and only need to whitelist a stable set of IPs, use QuotaGuard or a similar proxy service that gives you two static IPs and routes Render traffic through them.

### Cron jobs

Cron jobs run on a schedule you define. They're separate from Web Services — each invocation starts a fresh container with no shared state. ([Render cron jobs](https://docs.render.com/cron-jobs))

```yaml
services:
  - type: cron
    name: nightly-report
    runtime: node
    plan: starter
    schedule: "0 2 * * *"
    buildCommand: npm ci
    startCommand: node scripts/report.js
```

Constraints:

| Constraint | Impact |
|---|---|
| No persistent disk | Cron jobs cannot attach Render disks — use a database or external storage instead |
| Single concurrent run | At most one active invocation per cron service; if a new tick arrives while previous is still running, Render delays it |
| 12-hour max duration | Render terminates the job after 12 hours |
| UTC scheduling | Cron expressions are UTC, not local time |
| Private network outbound only | Cron can send to private network but cannot receive inbound private connections |
| Pricing | Minimum $1/month per cron service |

### One-off jobs

A one-off job is an ad-hoc command you run in a fresh container with the same env, image, and disk as your service. Use it for migrations, debugging, batch operations.

CLI:

```bash
render jobs create srv-xxxxx --command "python manage.py migrate"
render jobs create srv-xxxxx --command "npm run seed" --confirm
```

The job's logs stream in the dashboard under the service → **Jobs** tab.

### SSH access

SSH into a running service on a paid plan (Starter or above):

```bash
render ssh srv-xxxxx              # opens a shell on the running instance
render ssh srv-xxxxx --ephemeral  # opens an isolated debug container (safer for prod)
```

Once inside:

```bash
ls -la                          # see the filesystem (ephemeral + disk if attached)
ps aux                          # see running processes
curl localhost:10000/healthz    # hit your own health check
env | grep DATABASE_URL          # verify env vars are injected
```

Use `--ephemeral` when you want to debug without disturbing the running instance.

### Security hardening (DevSecOps notes)

| Topic | What to do on Render |
|---|---|
| **Secrets in transit** | All env vars encrypted at rest and in transit. Use Secret Files for multi-line credentials. |
| **Secrets in git** | Never commit secrets to `render.yaml` directly. Use `sync: false` for sensitive values. |
| **Secrets rotation** | Update in dashboard → service restarts → verify health → revoke old credential at the provider. For zero-downtime rotation, accept both keys during a transition window. |
| **Outbound allowlist** | Use Dedicated IPs ($100/mo) or QuotaGuard to get stable egress IPs. |
| **Private network** | Use `type: pserv` for internal services. Render services in the same region can talk over the private network. |
| **Database access** | Use the internal `connectionString` from app services. External URL only when necessary; restrict by IP. |
| **Audit logs** | Available on Pro+ workspaces. Records who changed what, when. |
| **SSO / SAML** | Available on Scale ($499/mo) and Enterprise. |
| **Compliance** | Render is SOC 2 Type II; HIPAA available on Scale. PCI DSS on Enterprise. |
| **Outbound SMTP** | Free Web Services block outbound SMTP ports (25, 465, 587). Paid services can use them. |
| **Dependency updates** | Render does not auto-update your `package.json` — you own that. Use Dependabot/Renovate in your Git repo. |

### Advanced checklist

- [ ] Authored and applied a `render.yaml` Blueprint for the full stack
- [ ] Validated Blueprint locally with `render blueprints validate`
- [ ] Configured preview environments via `previews:` block
- [ ] Purchased dedicated outbound IPs (if needed)
- [ ] Set up a cron job with the right schedule and timezone awareness
- [ ] Ran a one-off job for a migration
- [ ] SSHed into a running service (`render ssh`)
- [ ] Reviewed security: secrets in `sync: false`, env groups, private services, dedicated IPs

---

# Section B — Railway primer

Railway is a usage-based cloud platform for deploying persistent services — apps, databases, and background workers that run continuously. You connect a GitHub repo (or a local directory), Railway detects the runtime and builds it with **Railpack** (a Nixpacks-style auto-detecting buildpack), and you manage everything via the dashboard, the Railway CLI, or `railway.json` / `railway.toml`. ([Railway Docs](https://docs.railway.com))

## B.1 — Railway: Onboarding

### Step 1 — Create an account

1. Go to [railway.com](https://railway.com) and click **Login**.
2. Sign in with **GitHub**. Railway requires GitHub for source-linked deploys.
3. After login, you land on the dashboard with an empty workspace.

The Railway account model in 2026:

- **Workspace** — top-level container for projects, members, billing.
- **Project** — a single application deployment; contains services, databases, and environments.
- **Environment** — a configuration boundary inside a project (production, staging, PR preview). Each environment has its own variables, service instances, and networking.

New accounts in 2026 start on a **Free plan** with $1 of recurring monthly usage credit, OR a **Free Trial** with a one-time $5 credit valid ~30 days. The Free plan caps each service at 1 vCPU / 0.5 GB RAM and supports 1 project with 3 services. ([Railway Plans](https://docs.railway.com/reference/pricing/plans))

### Step 2 — Install the Railway CLI

The CLI manages projects, deploys, services, variables, and logs from your terminal. ([Railway CLI](https://docs.railway.com/cli))

**macOS / Linux (Homebrew)**:

```bash
brew install railway
```

**macOS / Linux / Windows (npm)**:

```bash
npm install -g @railway/cli
```

Verify:

```bash
railway version
```

Authenticate:

```bash
railway login
# Opens browser, stores token locally at ~/.railway/config.json
```

For CI/CD, set `RAILWAY_TOKEN` instead:

```bash
export RAILWAY_TOKEN=$(railway login --browserless)
```

### Step 3 — Create your first project

**Via dashboard**:

1. Click **New Project**.
2. Choose **Deploy from GitHub repo**.
3. Select the repo, then either **Deploy Now** (immediately build and deploy) or **Add variables** (set env vars first, then click Deploy).

**Via CLI**:

```bash
cd my-project
railway init           # creates an empty project, links local dir
railway up             # uploads and deploys current dir
railway open           # opens the project in your browser
```

`railway init` creates a `railway.json` (or `railway.toml`) in your repo and links the local directory to the project.

### Step 4 — Deploy

Railway has two build modes:

- **Railpack** (default) — analyzes source, detects language/framework, generates an optimized OCI image. No Dockerfile needed.
- **Dockerfile** — if a `Dockerfile` exists at repo root, Railway uses it. Set `RAILWAY_DOCKERFILE_PATH` for a non-standard location.

The default `start` command comes from your `package.json` (`scripts.start`), `pyproject.toml`, etc. Override in service settings.

After `railway up`, Railway:

1. Detects runtime (Node, Python, Go, etc.)
2. Installs dependencies
3. Builds the production bundle
4. Starts the container
5. Runs health check (if configured)
6. Issues a public URL like `your-app.up.railway.app`

### Step 5 — Generate a domain

After deploy, your service has no public URL by default. Generate one:

**Dashboard**: Service → Settings → **Networking → Generate Domain**.

**CLI**:

```bash
railway domain
```

This produces `https://your-app.up.railway.app`. To set up a custom domain, see Beginner.

### Onboarding checklist

- [ ] Account created via GitHub
- [ ] CLI installed and authenticated
- [ ] First project created
- [ ] First service deployed via dashboard or `railway up`
- [ ] Domain generated and service accessible

---

## B.2 — Railway: Beginner

Goal: environment variables (regular, shared, sealed, reference), custom domains, logs, deploy hooks, and the `railway run` command for local dev with prod env vars.

### Environment variables — five kinds

Railway's variable system is richer than Render's. You have five kinds: ([Railway Variables](https://docs.railway.com/guides/variables))

| Type | Scope | Example |
|---|---|---|
| **Service variable** | One service in one environment | `DATABASE_URL` on the `api` service in `production` |
| **Shared variable** | All services in one environment | `LOG_LEVEL`, `NODE_ENV` |
| **Reference variable** | Pulls from another service's variable using `${{service.VAR}}` | `DATABASE_URL=http://${{Postgres.DATABASE_URL}}` |
| **Sealed variable** | Write-only after creation — cannot be retrieved | `STRIPE_SECRET_KEY=sk_live_...` |
| **Railway-provided** | Auto-injected by Railway; not editable | `PORT`, `RAILWAY_PUBLIC_DOMAIN`, `RAILWAY_PRIVATE_DOMAIN` |

#### Set via dashboard

Service → **Variables** tab → **+ New Variable** → choose type → enter key + value.

#### Set via CLI

```bash
railway variables                                    # list all variables
railway variables --kv                               # key=value format
railway variables --json                             # JSON output

railway variables set ZAI_API_KEY=sk-xxx             # service variable
railway variables set --shared LOG_LEVEL=info        # shared variable
railway variables set --sealed STRIPE_KEY=sk_live    # sealed (write-only)
railway variables set API_URL='${{api.PUBLIC_URL}}'  # reference

railway variables unset ZAI_API_KEY                  # delete
```

#### Reference syntax (`${{namespace.VAR}}`)

Reference variables let one service read another service's variable without hardcoding:

| Namespace | Meaning | Example |
|---|---|---|
| (empty) | Another service's variable (case-sensitive) | `${{api.API_KEY}}` |
| `shared` | Shared variable (project-wide) | `${{shared.DOMAIN}}` |
| (Railway-provided) | System-injected | `${{RAILWAY_PUBLIC_DOMAIN}}`, `${{PORT}}` |

Common patterns:

```bash
# Service B references Service A's database URL
railway variables set DATABASE_URL='${{Postgres.DATABASE_URL}}'

# Service C references Service B's private domain for internal HTTP
railway variables set BACKEND_URL='http://${{api.RAILWAY_PRIVATE_DOMAIN}}:${{api.PORT}}'

# Combine reference + literal text
railway variables set CORS_ORIGIN='https://${{frontend.RAILWAY_PUBLIC_DOMAIN}}'
```

Sealed variables are **intentionally not copied to PR environments**. If a sealed variable needs to be available in PR previews, store it as a **shared variable** and reference it (`${{shared.KEY}}`) — the reference variable itself is not sealed, so it propagates.

#### Sealed variables — when and how

Use sealed variables for any credential you don't want to be retrievable, even by you. ([Railway sealed variables](https://docs.railway.com/guides/variables))

```bash
railway variables set --sealed STRIPE_SECRET_KEY=sk_live_...
railway variables set --sealed AWS_SECRET_ACCESS_KEY=...
railway variables set --sealed DATABASE_PASSWORD=...
```

Once sealed, you can overwrite or delete but never read the value. Sealed variables do **not** appear in `railway variables` output as plaintext — the CLI shows `<sealed>` or `null` to indicate the key exists but is unrecoverable.

#### Effect of changing a variable

Railway **stages** variable changes until the next deploy, then injects them into both build and runtime. To apply immediately:

```bash
railway variables set ZAI_API_KEY=new_value
railway redeploy --yes    # or railway up to trigger a fresh build
```

### `railway run` — local commands with prod env vars

The `railway run` command executes a local command with the environment variables from a Railway service injected. This is the cleanest way to run database migrations or seed scripts against your production database from your laptop:

```bash
railway run python manage.py migrate
railway run --service api npm run seed
railway run --service worker bash   # interactive shell with prod env
```

`railway run` runs **locally**, not on the remote service. It downloads the variables and executes the command on your machine.

### Custom domains + automatic TLS

Railway assigns every service a free `*.up.railway.app` subdomain. For your own domain:

1. Service → **Settings → Networking → Custom Domain → Add Domain**.
2. Enter `api.example.com`.
3. Railway tells you to add a CNAME: `api.example.com` → `<service>.up.railway.app`.
4. After DNS propagates, Railway issues a Let's Encrypt cert automatically.

Apex domains (`example.com`) require ALIAS/ANAME records at your registrar (Railway doesn't currently accept apex CNAMEs).

### Logs

```bash
railway logs                                       # tail all services
railway logs --service api                         # tail one service
railway logs --service worker --deployment         # tail current deployment
railway logs --service api --build                 # tail build logs
railway logs --service api --deployment --json     # JSON for parsing
railway logs --prev                                # previous deployment's logs
```

Three kinds of logs:

- **Build logs** — from Railway's build machine (`--build`)
- **Deploy logs** — stdout/stderr from the running container (`--deployment`)
- **HTTP logs** — structured request logs from Railway's edge

### Deploy hooks

Same idea as Render. Service → **Settings → Deploy Hooks**. Railway returns a URL like `https://backboard.railway.com/hooks/deploy/{id}`; POST to it to trigger a deploy.

### `railway up --watch`

`railway up` defaults to non-interactive (no `--watch`), but you can monitor live:

```bash
railway up --service api        # deploy and stay attached to logs
railway up --service api --detach  # deploy and exit
```

### Beginner checklist

- [ ] Understand the five variable types (service, shared, sealed, reference, Railway-provided)
- [ ] Used `${{service.VAR}}` reference syntax to wire two services
- [ ] Set a sealed variable for a real secret
- [ ] Used `railway run` for a one-off command with prod env
- [ ] Configured a custom domain with auto-TLS
- [ ] Can read build, deploy, and HTTP logs via CLI and dashboard

---

## B.3 — Railway: Intermediate

Goal: managed Postgres / Redis / MySQL, volumes (persistent disks), private networking (`.railway.internal`), health checks, restart policies.

### Managed databases — one-click templates

Railway exposes one-click templates for the common data stores: Postgres, Redis, MySQL, MongoDB. ([Railway templates](https://railway.com/templates))

**Via dashboard**:

1. Project → **+ New → Database → Postgres** (or Redis, MySQL, Mongo).
2. Railway provisions the service with default settings.
3. The service auto-generates `DATABASE_URL`, `REDIS_URL`, etc. Use the **`RAILWAY_PRIVATE_DOMAIN`** form for internal connections.

**Via CLI**:

```bash
railway deploy --template postgres
railway deploy --template redis
railway deploy --template postgres --variable "POSTGRES_USER=admin"
```

#### Auto-generated variables

When you add a Postgres template, Railway automatically injects these into the service:

| Variable | Value | Use it for |
|---|---|---|
| `DATABASE_URL` | Internal URL with private hostname | App services in same project |
| `DATABASE_PUBLIC_URL` | External URL via TCP proxy | External clients (your laptop, CI) |
| `DATABASE_USERNAME` / `DATABASE_PASSWORD` | Credentials | Manual config |
| `PGHOST` / `PGPORT` / `PGUSER` / `PGPASSWORD` / `PGDATABASE` | Individual components | Standard libpq clients |

Always prefer the **private URL** (`DATABASE_URL`) inside Railway — it's free and faster. Use the **public URL** only for external access. ([Railway docs](https://docs.railway.com/guides/postgresql))

#### Postgres over TCP proxy — security note

The TCP proxy is a public endpoint that forwards raw TCP to your database. Railway's TCP proxy **does not terminate or add TLS** — protecting the connection requires configuring SSL on the Postgres instance itself, with `sslmode=require` or higher on the client. ([Railway docs on TCP proxy](https://docs.railway.com/networking/tcp-proxy))

Private networking inside Railway (`*.railway.internal`) **is encrypted** via WireGuard (ChaCha20, Curve25519, BLAKE2s). Always prefer it over the TCP proxy for service-to-service traffic.

### Volumes — persistent block storage

A Railway volume is a block-storage volume that survives deploys and restarts. ([Railway volumes](https://docs.railway.com/storage/volumes))

Dashboard → Service → **Settings → Volumes → Add Volume** → set mount path + size.

**In `railway.json`**:

```json
{
  "$schema": "https://railway.com/railway.schema.json",
  "build": { "builder": "DOCKERFILE" },
  "deploy": {
    "startCommand": "uvicorn app.main:app --host :: --port 8080",
    "mounts": {
      "/data": "app-data"
    }
  }
}
```

Constraints:

| Constraint | Impact |
|---|---|
| Mounted at runtime, not build time | Volumes not available during `pre-deploy` commands |
| One volume per service | Cannot share a volume across services |
| Regional | If you change service region, volume data is not migrated automatically |
| Not a backup | Volumes are not replicated; deleted volumes are permanently destroyed after a 48-hour grace window |
| Not versioned | No point-in-time restore (unlike managed databases) |

For backups on the Pro plan, snapshots are self-managed — retention per your configured schedule.

Plan limits:

| Plan | Default Size | Max Volumes per Project |
|---|---|---|
| Trial/Free | 0.5 GB | 1–3 |
| Hobby | 5 GB | 10 |
| Pro | Up to 1 TB | 20 |

### Private networking — `*.railway.internal`

Every service in a Railway project gets an internal hostname under `railway.internal`. Services in the same project + environment can reach each other over this private mesh, encrypted by WireGuard. ([Railway private networking](https://docs.railway.com/networking/private-networking))

```bash
# Service A is "api", listens on port 8080
# Service B references it
railway variables set --service worker \
  API_URL='http://${{api.RAILWAY_PRIVATE_DOMAIN}}:${{api.PORT}}'
```

In your code:

```python
# FastAPI in worker service
import httpx
api_url = os.environ['API_URL']  # http://api.railway.internal:8080
response = httpx.get(f"{api_url}/jobs/pending")
```

Critical binding rule: **bind to `::` (IPv6 all interfaces), not `0.0.0.0`**. Environments created after October 16, 2025, support both IPv4 and IPv6, but the private network DNS still resolves to IPv6 first in many cases. Listening on `::` covers both.

```python
# Wrong — only accepts IPv4
uvicorn app:app --host 0.0.0.0 --port 8080

# Right — accepts both
uvicorn app:app --host :: --port 8080
```

For Redis clients connecting over the private network, append `?family=0` to the URL so the client tries both IPv4 and IPv6:

```
redis://default:pass@redis.railway.internal:6379?family=0
```

### TCP proxy — for non-HTTP traffic from outside

For databases, SSH, or any custom TCP protocol that needs to be reachable from outside Railway (your laptop, a CI runner), Railway provides a TCP proxy:

1. Service → **Settings → Networking → TCP Proxy → Enable**.
2. Railway assigns a hostname like `metro.proxy.rlwy.net:12345`.
3. Connect from your laptop: `psql -h metro.proxy.rlwy.net -p 12345 -U postgres ...`.

The TCP proxy is **free for service-to-internal** but **billed as egress for service-to-external**. Prefer the private network whenever possible.

### Health checks

Configure under Service → **Settings → Deploy → Healthcheck Path**.

```json
{
  "deploy": {
    "healthcheckPath": "/health",
    "healthcheckTimeout": 300
  }
}
```

Railway pings this endpoint after container start. If it doesn't return 2xx within `healthcheckTimeout` seconds (default 300, max 5 minutes), the deployment is marked as failed.

Best practices:

- Path should be cheap (don't hit the database)
- Return 200 only when the process is actually ready to receive traffic
- For slow-startup apps (loading models, warming caches), use `/ready` not `/healthz`

### Restart policies

Three restart policies ([Railway config reference](https://docs.railway.com/config-as-code/reference)):

| Policy | Behavior | Use for |
|---|---|---|
| `ALWAYS` | Always restart on exit (including clean exit code 0) | Most apps — web services, workers |
| `ON_FAILURE` | Restart only on non-zero exit | Apps that exit cleanly when done (cron-like) |
| `NEVER` | Never restart | Tasks you want to run once and stop |

```json
{
  "deploy": {
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### Graceful shutdown

Railway sends `SIGTERM` before stopping a deployment. Configure how long the old deployment stays alive during a swap:

| Variable | Default | Meaning |
|---|---|---|
| `RAILWAY_DEPLOYMENT_DRAINING_SECONDS` | (default) | Time given for SIGTERM graceful shutdown |
| `RAILWAY_DEPLOYMENT_OVERLAP_SECONDS` | (default) | Overlap time between old and new deployments |

Implement a SIGTERM handler that drains in-flight work:

```python
import signal, sys
def handle_sigterm(*_):
    print("SIGTERM received, draining...", flush=True)
    # close DB connections, finish current job
    sys.exit(0)
signal.signal(signal.SIGTERM, handle_sigterm)
```

### Intermediate checklist

- [ ] Provisioned Postgres via template; wired via `DATABASE_URL` reference
- [ ] Knows when to use private URL vs TCP proxy URL
- [ ] Attached a volume to a service
- [ ] Reached another service over `*.railway.internal` private network
- [ ] Bound a service to `::` (not `0.0.0.0`)
- [ ] Configured health check path and timeout
- [ ] Set restart policy (ALWAYS / ON_FAILURE / NEVER)
- [ ] Implemented SIGTERM drain

---

## B.4 — Railway: Advanced

Goal: `railway.json` / `railway.toml` as IaC, PR environments with focused deployment, multi-region config, Enterprise guardrails, and security hardening.

### Config as code — `railway.json` / `railway.toml`

Railway reads either a `railway.json` or `railway.toml` file from your repo root (or a path you specify) and uses it as the source of truth for service settings. Settings in code **override** dashboard settings at deploy time. ([Railway config as code](https://docs.railway.com/config-as-code))

#### Schema reference

`railway.json`:

```json
{
  "$schema": "https://railway.com/railway.schema.json",
  "build": {
    "builder": "RAILPACK",
    "buildCommand": "npm run build"
  },
  "deploy": {
    "startCommand": "node dist/index.js",
    "preDeployCommand": ["npm run db:migrate"],
    "healthcheckPath": "/health",
    "healthcheckTimeout": 300,
    "restartPolicyType": "ALWAYS",
    "restartPolicyMaxRetries": 5,
    "sleepApplication": false,
    "multiRegionConfig": {
      "us-west2": { "numReplicas": 2 },
      "us-east4-eqdc4a": { "numReplicas": 1 }
    },
    "runtime": "V2",
    "numReplicas": 1,
    "cpu": 1000,
    "memory": "2Gi"
  },
  "environments": {
    "staging": {
      "deploy": { "startCommand": "npm run start:staging" }
    }
  }
}
```

`railway.toml`:

```toml
[build]
builder = "RAILPACK"
buildCommand = "npm run build"

[deploy]
startCommand = "node dist/index.js"
preDeployCommand = ["npm run db:migrate"]
healthcheckPath = "/health"
healthcheckTimeout = 300
restartPolicyType = "ALWAYS"
restartPolicyMaxRetries = 5
sleepApplication = false

[deploy.multiRegionConfig]
us-west2 = { numReplicas = 2 }

[environments.staging.deploy]
startCommand = "npm run start:staging"
```

#### Builder selection

Two builders:

- `RAILPACK` (default) — Railway's buildpack. Detects Node, Python, Go, Ruby, etc. No Dockerfile needed.
- `DOCKERFILE` — Railway uses your Dockerfile. Set `dockerfilePath` for non-standard locations, `dockerContext` for monorepos.

For monorepos, each service gets its own `railway.json` in a subdirectory, and Railway reads it. Example for `apps/auth`:

```json
{
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "Dockerfile",
    "dockerContext": "."
  }
}
```

#### Watch paths — trigger builds only when relevant files change

For monorepos, you don't want a docs change to redeploy your API. Use gitignore-style watch patterns:

```json
{
  "build": {
    "watchPatterns": ["apps/api/**", "packages/**"]
  }
}
```

#### `preDeployCommand` — run migrations before traffic

`preDeployCommand` runs **after** the build but **before** the new deployment starts serving traffic. Use it for database migrations, schema setup, etc.

```json
{
  "deploy": {
    "preDeployCommand": ["npm run db:migrate", "npm run cache:warm"]
  }
}
```

If `preDeployCommand` fails, the deploy is canceled and the old version keeps serving.

### PR environments — per-pull-request ephemeral deployments

This is one of Railway's standout features. With one toggle, every pull request gets its own isolated deployment, auto-deleted when the PR is merged or closed. ([Railway PR environments](https://docs.railway.com/environments))

Enable in **Project Settings → Environments → Enable PR Environments**.

What you get per PR:

- A complete isolated environment with all services from the base environment
- Each service deployed from the PR branch (or only the changed ones in monorepos — see below)
- Fresh databases and dependencies
- Unique URLs for each exposed service
- Isolated private networking (services in PR-A can't reach services in PR-B)
- Automatic teardown on PR close/merge

#### Focused PR environments (monorepo optimization)

For monorepos, Railway deploys **only the services whose code changed** (based on `watchPatterns` or root directory). This keeps monorepo preview costs down — you don't spin up 12 untouched services per PR.

#### Per-PR environment overrides

Override env vars, regions, or resources for PR environments only. Useful to give previews a smaller instance size or a staging-only API key:

```json
{
  "environments": {
    "staging": { "deploy": { "numReplicas": 1 } }
  }
}
```

When a PR environment is created from `staging`, it inherits the override.

#### PR environment lifecycle

| Step | Action |
|---|---|
| PR opened | Railway creates a new environment cloned from your chosen base (e.g. staging) |
| Code pushed | Each affected service builds and deploys from the PR branch |
| Review | Reviewers click the preview URL posted as a PR comment by Railway's bot |
| New commits | Railway auto-deploys (since the source branch is now the PR branch) |
| PR closed/merged | Railway deletes the entire environment and all its resources |

### Multi-region deployments

Configure replicas across multiple Railway regions in `railway.json`:

```json
{
  "deploy": {
    "multiRegionConfig": {
      "us-west2": { "numReplicas": 2 },
      "europe-west4-drams3a": { "numReplicas": 2 }
    }
  }
}
```

Railway regions available in 2026: `us-west2`, `us-east4-eqdc4a`, `europe-west4-drams3a`, plus a few more. Each region is a separate geographic location with its own network ingress.

For global low-latency apps, put replicas near your users. For data-residency compliance (e.g. EU users must stay in EU), restrict replicas to specific regions.

### TCP proxy hardening

The TCP proxy is a public endpoint. To keep your database safe:

1. **Prefer private networking** for service-to-service traffic. Don't expose your database's TCP proxy to services that can use the private network.
2. **Enable `sslmode=require`** on Postgres clients connecting via TCP proxy.
3. **Use a non-default port** if possible (Railway assigns ports randomly).
4. **Rotate credentials regularly** — update `POSTGRES_PASSWORD` on the database service.

### Enterprise guardrails (workspaces on Enterprise plans)

Railway ships policy controls on Enterprise workspaces: ([Railway changelog](https://railway.com/changelog))

- **Restrict generate domain** — non-admins can't create Railway-generated domains.
- **Restrict TCP proxy** — non-admins can't create public TCP proxies.
- **Restrict deployments to approved sources** — only GitHub orgs you allowlist can ship.

Set these once in workspace settings and they enforce across all projects.

### Audit logs

Audit logs are available on **all** Railway plans, including the Free plan. They record:

- Variable add/edit/delete/read
- Shared variable updates
- CLI env reads
- Service configuration changes
- Deploy triggers

Free plan retention: 48 hours. Pro plan: longer retention.

Access at `railway.com/workspace/audit-logs`.

### Security hardening (DevSecOps notes)

| Topic | What to do on Railway |
|---|---|
| **Secrets in transit** | All variables encrypted at rest. Use sealed variables for credentials you never need to read back. |
| **Secrets in git** | Never commit secrets to `railway.json`. Use the dashboard, CLI, or API to set them. |
| **Secrets rotation** | `railway variables set --sealed NEW_KEY=value` to overwrite. Old key is replaced on next deploy. |
| **Network segmentation** | Use private networking (`*.railway.internal`) for service-to-service. Don't expose databases via TCP proxy unnecessarily. |
| **Database access** | Prefer private URL inside Railway. Restrict TCP proxy via firewall or non-default port. Enable SSL on Postgres (`sslmode=require`). |
| **PR isolation** | Each PR environment is network-isolated from other PR environments. Services in PR-A cannot reach services in PR-B. |
| **Audit logs** | Available on all plans; 48-hour retention on Free, longer on paid. |
| **SSO / SAML** | Available on Enterprise plans. |
| **Compliance** | Railway is SOC 2 Type II. HIPAA available on Enterprise. PCI DSS on Enterprise. |
| **Outbound restrictions** | Railway does not provide static outbound IPs. For IP allowlist scenarios, use a proxy service like QuotaGuard. |
| **Dependency updates** | Same as Render — Railway does not auto-update your dependencies. Use Dependabot/Renovate. |
| **Region pinning** | For data-residency compliance, restrict deployments to specific regions via `multiRegionConfig`. |

### Advanced checklist

- [ ] Authored `railway.json` with builder, deploy, and environment-specific config
- [ ] Configured `preDeployCommand` for migrations
- [ ] Set up watch patterns for monorepo
- [ ] Enabled PR environments with focused deployment
- [ ] Configured multi-region replicas via `multiRegionConfig`
- [ ] Reviewed Enterprise guardrails (if applicable)
- [ ] Reviewed audit logs and rotation policy
- [ ] Reviewed security: sealed variables, private networking, TCP proxy hardening

---

# Side-by-side comparison

When to use Render vs Railway — by capability.

| Capability | Render | Railway |
|---|---|---|
| **Free compute** | 512 MB / 0.1 vCPU on Hobby workspace; 750 free instance-hours/mo; sleeps after 15 min idle | $1/month recurring usage credit on Free plan (1 vCPU / 0.5 GB cap per service); one-time $5 trial credit for new accounts |
| **First deploy** | Dashboard → New → Web Service → connect repo → deploy | Dashboard → New Project → connect repo → deploy, or `railway up` from CLI |
| **Build system** | Buildpack (auto-detect) or Dockerfile | Railpack (Nixpacks-style buildpack) or Dockerfile |
| **Infrastructure as Code** | Blueprints (`render.yaml`) | `railway.json` / `railway.toml` |
| **Env var scoping** | Per-service + environment groups (shared) | Per-service + shared + reference + sealed |
| **Secret files** | Yes (Dashboard → Secret Files) | No native; base64-encode into a variable |
| **Custom domains** | Yes, with auto-TLS; apex via ALIAS | Yes, with auto-TLS; apex via ALIAS only |
| **Managed Postgres** | Yes (Free, Basic, Starter, Pro, Pro Plus, Pro Max) | Yes (Postgres template, sized via RAM/storage/volume) |
| **Managed Redis** | Yes (Render Key Value, free + paid tiers) | Yes (Redis template) |
| **Persistent disk** | $0.25/GB-month on paid services | Volumes on all plans; size varies by plan |
| **Private network** | Private services (`type: pserv`) reachable via internal hostnames | `*.railway.internal` mesh encrypted with WireGuard |
| **Static outbound IPs** | Dedicated IPs ($100/mo per set, 3 IPs per set per region) | Not natively — use proxy like QuotaGuard |
| **PR environments** | Blueprint `previews:` block (auto_preview / manual / none) | Built-in toggle in project settings |
| **Monorepo PR optimization** | Path filters in Blueprint | Focused PR environments via watch patterns |
| **Cron jobs** | Native (`type: cron` with schedule) | Not native — use a service with sleepApplication: false and an external scheduler, or a worker triggered by a cron service on Render and wired via API |
| **One-off jobs** | `render jobs create` | `railway run --service <svc> -- <command>` (runs locally with prod env) |
| **SSH access** | `render ssh srv-xxx` (paid plans) | Not supported natively — exec into the container is not exposed |
| **Health checks** | Configurable path + grace period | Configurable path + timeout (max 300s) |
| **Autoscaling** | CPU/memory targets (Pro workspace required) | Manual `numReplicas`; no native autoscale |
| **Multi-region** | Pick region per service; no native replication | `multiRegionConfig` in `railway.json` |
| **CLI install** | `brew install render` or download | `brew install railway` or `npm i -g @railway/cli` |
| **CLI deploy** | `render deploys create srv-xxx --wait` | `railway up` |
| **CLI logs** | `render logs -r srv-xxx --tail` | `railway logs --service api --deployment` |
| **CLI env vars** | `update_environment_variables` via MCP/API | `railway variables set KEY=value` |
| **Pricing model** | Workspace fee + per-instance compute + bandwidth overage | Usage-based: $0.00000772/vCPU-sec, $0.0000018/GB-sec RAM, $0.05/GB egress |
| **Cheapest paid "always-on"** | Starter $7/mo (512 MB, no sleep) | Hobby $5/mo + $5 usage credit (typically $5–$15 all-in) |
| **Audit logs** | Available on Pro+ workspaces | Available on all plans (Free = 48h retention) |
| **SSO / SAML** | Scale ($499/mo) | Enterprise (custom) |
| **Compliance** | SOC 2 Type II; HIPAA on Scale; PCI on Enterprise | SOC 2 Type II; HIPAA + PCI on Enterprise |

### Quick decision matrix

| If your priority is… | Pick | Why |
|---|---|---|
| **Genuinely free, low-traffic demo** | Render Hobby | Only permanent $0 compute tier; accepts the 15-min sleep |
| **Cheapest always-on** | Render Starter ($7/mo) | No sleep, persistent disks, 512 MB |
| **Cheapest usage-based that scales** | Railway Hobby | $5/mo floor + usage; meter starts at $5 |
| **Per-PR isolation as a built-in toggle** | Railway | PR Environments with focused deploy for monorepos |
| **Infrastructure as Code that's the source of truth** | Render Blueprints | `render.yaml` is more mature, immutable fields well-documented |
| **Private mesh encryption by default** | Railway | WireGuard-encrypted `.railway.internal` |
| **Static outbound IPs for allowlist** | Render Dedicated IPs | $100/mo, no proxy needed |
| **Cron jobs native** | Render | `type: cron` with schedule; Railway has no native cron |
| **Sealed write-only secrets** | Railway | `--sealed` flag; CLI hides value permanently |
| **Reference variables for service wiring** | Railway | `${{service.VAR}}` syntax eliminates hardcoded URLs |
| **Built-in autoscale on CPU/memory** | Render | Requires Pro workspace but works out of the box |
| **Multi-region replicas in one config** | Railway | `multiRegionConfig` in `railway.json` |
| **Next.js front-end on Vercel + cheap backend** | Render | Mature Vercel-to-Render integration patterns; Railway works too |
| **Long-running workers (Celery, Sidekiq, BullMQ)** | Render (Worker type) | Native worker service; Railway can do it via `sleepApplication: false` |
| **Compliance-grade workspace policies** | Both — Enterprise only | Render Enterprise, Railway Enterprise |

---

# Common pitfalls and gotchas

These are the mistakes beginners hit most often. Treat this as a checklist when something is "almost working."

### Both platforms

- **Port binding**: Always bind to `0.0.0.0` (Render) or `::` (Railway). The platform injects `$PORT`. Hardcoding port 3000/8080 will not receive traffic.
- **Health check endpoint must return 200 on GET**: Render and Railway both probe with HTTP GET. If your `/healthz` only accepts POST, deploys fail.
- **Don't put secrets in your Blueprint / `railway.json`**: Use `sync: false` (Render) or set via dashboard/CLI (Railway).
- **Env vars vs build-time vars**: `NEXT_PUBLIC_API_URL` (Next.js), `VITE_API_URL` (Vite), `REACT_APP_*` (Create React App) are inlined at build time. Changing them requires a rebuild, not a restart.

### Render-specific

- **Free Web Service sleeps after 15 min idle**: First request after idle takes ~30–60 s. Use Render Starter for always-on.
- **Free Postgres expires at 30 days**: Use paid tier for anything persistent.
- **Persistent disk disables zero-downtime deploys**: Single-attach means the platform swaps instead of blue-green.
- **`sync: false` is excluded from preview environments**: Use environment groups for shared secrets across previews.
- **Outbound SMTP ports blocked on free tier**: Ports 25, 465, 587 are blocked. Use a transactional email provider's HTTP API instead.
- **Outbound IP addresses change occasionally**: For stable allowlists, use Dedicated IPs ($100/mo) or QuotaGuard.
- **Health check must pass during deploy**: If your health endpoint depends on a DB, the deploy may fail if the DB is slow to respond.

### Railway-specific

- **`${{namespace.VAR}}` is case-sensitive on service names**: Service name `Postgres` ≠ `postgres`. Use exact case.
- **Sealed variables don't propagate to PR environments**: Store as shared variable and reference instead.
- **`.railway.internal` resolves IPv6 first** in many environments: Bind to `::`, append `?family=0` to Redis URLs.
- **TCP proxy doesn't terminate TLS**: Configure SSL on the database itself; use `sslmode=require` on Postgres.
- **`railway run` runs locally, not on the remote**: It downloads env vars and executes the command on your laptop. The remote service doesn't run anything.
- **`RAILWAY_PORT` (legacy) vs `PORT` (current)**: Always use `PORT`; the platform sets it automatically.
- **No native cron**: Use a `sleepApplication: false` service that loops on a schedule, or trigger via an external cron like GitHub Actions + `railway up`.
- **Free plan can't sustain always-on service**: $1/mo credit isn't enough; the meter starts at $5/mo on Hobby.

---

# Methodology and limitations

**What was researched**:
- Official documentation at `docs.render.com`, `docs.railway.com`, `render.com/docs`, `railway.com/docs` (verified directly via web_fetch where possible).
- Official CLI reference docs (Render CLI v1.x, Railway CLI v5.x).
- Official blog posts / changelogs for 2025–2026 feature updates (Render's August 2025 workspace restructure, Railway's PR environment focused-deploy for monorepos).
- Official Render OSS skills repo (`render-oss/skills` on GitHub) for current CLI/YAML syntax.
- Multiple independent secondary sources (Render blog, Railway blog, deploycloud.app, deepwiki.com, kuberns.com, mrchief.ai, latchkey.dev, clime.sh) for cross-checks.

**What was excluded**:
- Vercel, Fly.io, AWS — covered in the previous pricing report.
- Render's enterprise-only features beyond what's documented publicly.
- Railway's GPU support (Hobby plan: no; Enterprise: yes).
- Database-specific deep dives (Render's PostgreSQL extensions, Railway's Postgres tuning).

**Where evidence was thin / what could change**:
- **Render's CLI is still v1.x as of 2026-09-20**: command flags may evolve; always run `render <command> --help` to confirm.
- **Railway's free plan was restructured in 2023 and again in 2024**: the "$1 Free plan" wording may shift. Confirm at [Railway Plans](https://docs.railway.com/reference/pricing/plans) before quoting.
- **Region availability changes**: Both platforms add regions. Confirm in the dashboard before relying on a specific region.
- **Compliance certifications**: SOC 2 Type II is widely confirmed; HIPAA/PCI availability changes by plan. Confirm with the platform's trust center for current audits.
- **Pricing**: All pricing referenced is current as of 2026-09-20; see the previous pricing report for the full pricing matrix.

**Disagreements between sources found**:
- Some older Render CLI examples still use `render services deploy` (deprecated); the current command is `render deploys create`. This primer uses the current commands.
- Some Railway tutorials describe the "Free plan" as having "$5 free credit per month" — that was retired in 2023. The current Free plan is $1/month; the one-time $5 trial credit is a separate mechanism.
- Several Render docs still reference `type: private` for private services; the current keyword in Blueprints is `type: pserv`.

---

# Sources

1. Render — [Pricing](https://render.com/pricing) (official, accessed 2026-09-20)
2. Render — [Free tier documentation](https://docs.render.com/free) (official docs, accessed 2026-09-20)
3. Render — [Blueprint specification](https://docs.render.com/blueprint-spec) (official docs, 2026)
4. Render — [Environment variables](https://docs.render.com/environment-variables) (official docs, 2026)
5. Render — [CLI reference](https://render.com/docs/cli-reference) (official docs, 2026)
6. Render — [PostgreSQL docs](https://docs.render.com/postgresql) (official docs, 2026)
7. Render — [Persistent disks](https://docs.render.com/disks) (official docs, 2026)
8. Render — [Private services](https://docs.render.com/private-services) (official docs, 2026)
9. Render — [Health checks](https://docs.render.com/health-checks) (official docs, 2026)
10. Render — [Cron jobs](https://docs.render.com/cron-jobs) (official docs, 2026)
11. Render — [WebSocket support](https://render.com/docs/websocket) (official docs, 2026)
12. Render — [Dedicated IPs blog post](https://render.com/blog/dedicated-ips-for-your-services-on-render) (official blog, 2026)
13. Render — [Outbound IP addresses](https://render.com/docs/outbound-ip-addresses) (official docs, 2026)
14. Render OSS — [`render-env-vars` skill](https://github.com/render-oss/skills/blob/main/skills/render-env-vars/SKILL.md) (official OSS, 2026)
15. Render OSS — [`render-blueprints` skill](https://github.com/render-oss/skills/blob/main/skills/render-blueprints/SKILL.md) (official OSS, 2026)
16. Render OSS — [`render-cron-jobs` skill](https://github.com/render-oss/skills/blob/main/skills/render-cron-jobs/SKILL.md) (official OSS, 2026)
17. Render OSS — [`render-disks` skill](https://github.com/render-oss/skills/blob/main/skills/render-disks/SKILL.md) (official OSS, 2026)
18. Render OSS — [`render-debug` skill](https://github.com/render-oss/skills/blob/main/skills/render-debug/SKILL.md) (official OSS, 2026)
19. Render — [CLI power-user tutorial: logs](https://render.com/tutorials/render-cli-power-user/logs) (official tutorial, 2026)
20. Render — [When deploys go wrong: health checks and crashes](https://render.com/tutorials/when-deploys-go-wrong/health-checks-and-crashes) (official tutorial, 2026)
21. Render — [Full-stack FastAPI template](https://github.com/render-examples/full-stack-fastapi-template) (official example, 2026)
22. Railway — [Quick Start](https://docs.railway.com/quick-start) (official docs, accessed 2026-09-20)
23. Railway — [Plans and pricing](https://docs.railway.com/reference/pricing/plans) (official docs, 2026)
24. Railway — [Variables guide](https://docs.railway.com/guides/variables) (official docs, 2026)
25. Railway — [Private networking](https://docs.railway.com/networking/private-networking) (official docs, 2026)
26. Railway — [TCP proxy](https://docs.railway.com/networking/tcp-proxy) (official docs, 2026)
27. Railway — [Volumes reference](https://docs.railway.com/storage/volumes) (official docs, 2026)
28. Railway — [Config as code reference](https://docs.railway.com/config-as-code/reference) (official docs, 2026)
29. Railway — [Environments](https://docs.railway.com/environments) (official docs, 2026)
30. Railway — [Deployments](https://docs.railway.com/deployments) (official docs, 2026)
31. Railway — [CI/CD for Modern Deployment](https://blog.railway.com/p/cicd-for-modern-deployment-from-manual-deploys-to-pr-environments) (official blog, 2026)
32. Railway — [Railway vs Cloudflare networking comparison](https://blog.railway.com/p/railway-vs-cloudflare-how-their-architectures-differ-and-when-to-use-each) (official blog, 2026)
33. Railway — [Serverless functions vs containers](https://blog.railway.com/p/serverless-functions-vs-containers-cicd-database-connections-cron-jobs-and-long-running-tasks) (official blog, 2026)
34. Railway OSS — [`railway-cli` skill on configure](https://github.com/railwayapp/railway-skills/blob/main/plugins/railway/skills/use-railway/references/configure.md) (official OSS, 2026)
35. Railway — [Variables deepwiki summary](https://deepwiki.com/railwayapp/docs/6.4-environments-and-variables-management) (community deep-wiki, 2026)
36. Railway — [Networking and deployment systems deepwiki summary](https://deepwiki.com/railwayapp/docs/4-networking-and-deployment-systems) (community deep-wiki, 2026)
37. Railway — [Build configuration deepwiki summary](https://deepwiki.com/railwayapp/docs/4.3-deployment-pipeline-and-build-configuration) (community deep-wiki, 2026)
38. Railway — [Data storage: databases, volumes, buckets](https://deepwiki.com/railwayapp/docs/3.3-data-storage:-databases-volumes-and-buckets) (community deep-wiki, 2026)
39. bex.co — [Preview environments audit (Sept 2026)](https://bex.co/blog/2026/09/11/preview-environments-ephemeral-per-pr-deploys) (independent analysis, Sept 2026)
40. kuberns — [How to deploy on Render (2026)](https://kuberns.com/blogs/how-to-deploy-on-render/) (independent guide, 2026)
41. mrchief.ai — [Render Blueprint deploys case study](https://mrchief.ai/cases/render-blueprint-deploy) (independent case study, 2026)
42. codeables.dev — [Render Blueprints for infrastructure-as-code](https://codeables.dev/article/how-do-i-use-render-blueprints-for-infrastructure-as-code) (independent guide, 2026)
43. checkyourvibe — [Render security guide](https://checkyourvibe.dev/blog/guides/render) (independent security review, 2026)
44. latchkey — [`fly secrets set` reference (cross-platform)](https://latchkey.dev/learn/command-reference/fly-secrets-set-command) (independent reference, 2026)
45. clime.sh — [Render CLI commands reference](https://clime.sh/cli/render) (independent reference, 2026)
46. adhdecode — [Railway CLI cheatsheet (2026)](https://adhdecode.com/cheatsheets/railway/) (independent cheatsheet, 2026)
47. runxbuild — [Railway CLI: 8 commands for 80% of work](https://www.runxbuild.com/blog/railway-cli/) (independent guide, 2026)
48. explainx — [What is Railway? Beginner's guide (2026)](https://explainx.ai/blog/what-is-railway-how-to-deploy-beginners-guide-2026) (independent guide, 2026)
49. guvi — [Railway deployment tutorial](https://www.guvi.in/blog/railway-deployment-tutorial/) (independent tutorial, 2026)
50. better-simple — [FastAPI on Railway (April 2026)](https://www.better-simple.com/fastapi/2026/04/27/deploying-the-example-fastapi-app-on-railway/) (independent tutorial, 2026)

---

# Final words for the beginner DevSecOps engineer

If you read this primer end to end, you should now be able to:

1. **Sign up, install the CLI, and deploy a service from a GitHub repo** on either Render or Railway in under 30 minutes.
2. **Set environment variables** using the dashboard, the CLI, and IaC files (`render.yaml` / `railway.json`), and understand the difference between `sync: false` and sealed variables.
3. **Provision a managed Postgres**, wire it to your service using internal connection strings, and explain why the internal URL is preferred over the external one.
4. **Set up a custom domain** with auto-TLS and a CNAME / ALIAS record.
5. **Implement a health check endpoint** that returns 200 only when the service is actually ready for traffic.
6. **Use private networking** — Render private services or Railway `*.railway.internal` — to keep services off the public internet.
7. **Write a Blueprint** (`render.yaml`) or **`railway.json`** that declaratively defines your full stack: web, worker, cron, database, env groups, persistent disks.
8. **Enable PR environments** to give every pull request its own ephemeral deployment.
9. **Implement SIGTERM drain** so your service doesn't drop in-flight requests during deploys.
10. **Apply DevSecOps basics**: secrets in `sync: false` / sealed variables, audit logs reviewed, dependencies updated, no hardcoded credentials in code or IaC, dedicated IPs / proxy for stable egress.

The next step is to do it: pick a small project, deploy it on Render first (because the deploy lifecycle is more explicit and easier to learn), get it working end-to-end, then re-deploy it on Railway to see the differences. The skill transfers cleanly — the two platforms are more similar than different, and a beginner who knows one can be productive on the other within a day.

Welcome to PaaS. Ship fast. 🚀
