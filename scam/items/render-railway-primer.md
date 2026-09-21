# Render and Railway: A Practical Primer (Onboarding → Advanced)

*Research scope: how to actually use Render (render.com) and Railway (railway.com) as a developer, built from each provider's official documentation, changelogs, and pricing pages, supplemented by community experience for the "what people wish they'd known" angle. Organized per provider by skill level: onboarding, beginner, intermediate, advanced. Not a formal evaluation — a working manual with the current numbers.*
*As of: 2026-09-20. Both platforms changed pricing or plan structure within the last 6 months (Render restructured workspace plans in April 2026 and renamed compute plans in August 2026; Railway deprecated its config-as-code format with a hard cutoff of 2026-12-01). Re-verify anything dollar-denominated against the live pricing pages before committing to a budget.*

## Executive summary

Render and Railway are the two leading "post-Heroku" PaaS platforms, and in 2026 they have diverged into genuinely different products. **Render** bills flat, predictable, per-instance prices on top of flat workspace tiers (Hobby $0 / Pro $25/mo / Scale $499/mo since April 2026), is the more operationally conservative platform (native static-site hosting, managed Postgres with HA/read replicas/PITR, autoscaling, ISO 27001 + SOC 2 + HIPAA with a BAA), and constrains you to one of five fixed regions per service. **Railway** bills pure usage ($10/GB RAM + $20/vCPU per month, per second, plus egress), lets a single service span multiple regions natively, has no free always-on tier (a one-time $5 trial credit, then a $1/month-credit Free plan), and is rebuilding its whole configuration layer — `railway.json` config-as-code is deprecated with a 2026-12-01 hard cutoff, replaced by TypeScript/Python/Go Infrastructure as Code, and the Nixpacks builder was replaced by Railpack in September 2025. Community sentiment roughly tracks that split: Railway is widely called the easier, faster-to-start platform; Render the more "set and forget" one, though Railway's 2026 incident record (an ~8-hour platform-wide SEV-1 in May 2026 among 26 published incident reports since late 2023) is the biggest caveat for production use. Confidence is high on documented mechanics (all from official docs fetched 2026-09-20) and moderate on community-sentiment claims (small review samples, snippet-level Reddit access).

## How the platforms compare at a glance

| Dimension | Render | Railway |
|---|---|---|
| Pricing model | Flat workspace tier + flat per-instance compute plans, per-second prorated | Pure usage metering: RAM, vCPU, egress, volumes, buckets |
| Entry cost (always-on small web service) | ~$7/mo (0.5 CPU / 512 MB) on a free Hobby workspace | ~$5–8/mo metered (512 MB + 0.5 vCPU ≈ $15/mo list, less with Serverless sleep); Hobby plan $5/mo incl. $5 usage |
| Free tier | 750 instance-hrs/mo; web service spins down after 15 min idle; free Postgres expires in 30 days; free static sites with CDN, custom domain | One-time $5 trial credit (30 days); then Free plan with $1/mo credit, 1 vCPU / 0.5 GB caps |
| Regions | 5 fixed (Oregon, Ohio, Virginia, Frankfurt, Singapore); one per service, immutable | 4 "Metal" regions (US West, US East, EU West Amsterdam, SE Asia Singapore); per-service choice, changeable (downtime only with volumes); native multi-region replicas |
| Service types | Web, static site, private service, background worker, cron job, Workflows (durable execution) | Persistent services (any container), Cron Jobs, Functions, Sandboxes (ephemeral VMs) |
| Build system | Native runtimes (Node/Bun, Python, Ruby, Go, Rust, Elixir on Debian 12) or Docker (BuildKit) | Railpack (default since 2025-09-19) or Dockerfile; 11 languages auto-detected |
| Databases | Managed Postgres (HA, read replicas, PITR, pgvector) and Key Value (Valkey 8) | Unmanaged DB templates (Postgres, MySQL, MongoDB, Redis + HA variants), PITR via pgBackRest/binlog |
| Object storage | **Not GA** (alpha + waitlist; MinIO template workaround) | Storage Buckets, S3-compatible, GA ($0.015/GB-mo, free egress) |
| IaC | `render.yaml` Blueprints + official Terraform provider | `.railway/railway.ts|py|go` IaC (new); `railway.json/toml` deprecated, cutoff 2026-12-01 |
| Horizontal scaling | Manual 1–100 instances on all plans; autoscaling (CPU/mem targets) Pro+ | Manual replicas (Hobby: 6, Pro: 42); no utilization-based autoscaling; vertical scales automatically to plan limits |
| Preview environments | Service previews (all plans) + full-stack preview environments (Pro+) | PR environments on every plan, incl. "focused" monorepo previews |
| Compliance | SOC 2 Type II, ISO 27001, HIPAA (Scale+, 20% surcharge, BAA), EU-US DPF | SOC 2 Type II, SOC 3, HIPAA BAA (Enterprise, spend threshold); no ISO 27001 claim found |
| API | REST | GraphQL (`backboard.railway.com/graphql/v2`) |
| Multi-region story | Separate services per region (Render's own comparison concedes this) | `multiRegionConfig` with per-region replica counts on one service |

Sources for this table appear inline in the sections below.

---

# Part I — Render

Render brands itself "The cloud for builders" ([render.com](https://render.com)) and maintains migration guides for both [Heroku](https://render.com/docs/migrate-from-heroku) and [Railway](https://render.com/docs/migrate-from-railway) alumni. Its mental model: you connect a Git provider, pick a service type per piece of your app, and Render builds and runs each one with zero-downtime deploys.

## Onboarding (sign up → first running app)

The official first-deploy tutorial is six steps — sign up, connect your Git provider, choose a service type, deploy your code, monitor the deploy, open your app — and requires no payment method ([docs](https://render.com/docs/your-first-deploy)).

**Account and Git connection.** Sign up with email or via GitHub/GitLab/Bitbucket SSO. Connect deployment credentials under Account Settings → Git Deployment Credentials; GitHub uses the Render GitHub App (control repo access at [github.com/apps/render](https://github.com/apps/render)), and GitLab requires at least Maintainer permissions for auto-deploys ([docs](https://render.com/docs/git-provider)). A fourth option, "Cursor Origin (beta)," also appears. Once connected, "you can deploy services using any repository you have access to."

**Create your first service.** Dashboard → **+ New** → choose a service type → pick a repo → set Branch, Root Directory, Language (runtime), Build Command, Start Command, and optionally the Free compute plan → Create Web Service. The deploy streams build logs, then the service gets a public `*.onrender.com` URL. The one contract your app must honor: **listen on host `0.0.0.0` and default port 10000** (`PORT` is injected); ports 18012/18013/19099 are reserved ([docs](https://render.com/docs/web-services)).

**Three ways to start.** Beyond the dashboard, you can create services with the CLI (`render services create --repo ... --runtime node --plan free`) or, new in 2026, via coding agents: install the CLI plus the official "render-deploy" skill for Claude Code, Codex, Cursor, or OpenCode ([docs](https://render.com/docs/your-first-deploy)). The [templates gallery](https://render.com/templates) (~96 templates, heavy on AI/LLM stacks) deploys multi-service apps from a Blueprint in one click.

**What's free.** 750 free instance-hours per workspace per month; free web services (0.1 CPU / 512 MB) spin down after **15 minutes without inbound traffic** and take ~1 minute to wake, wiping filesystem changes. Free static sites are genuinely free with CDN and custom domain. Free Postgres (0.1 CPU / 256 MB, 1 GB) **expires 30 days after creation** (14-day grace), one per workspace; free Key Value (25 MB, in-memory only — no persistence) is also one per workspace ([free tier docs](https://render.com/docs/free)).

## Beginner (daily operation)

**Environment variables.** Set them per service or in shareable **environment groups** (a group can link to many services; a service can link many groups). Service-level vars always beat group vars; between multiple linked groups, precedence is explicitly "not guaranteed" (currently most-recently-created wins). **Secret files** (e.g., keys) land at `/etc/secrets/<name>`, capped at 1 MB total. Saving vars offers three modes: *Save, rebuild, and deploy* / *Save and deploy* (reuses the existing build) / *Save only* ([docs](https://render.com/docs/configure-environment-variables)).

**Deploys.** Pushes to the linked branch auto-deploy by default (options: *On Commit*, *After CI Checks Pass* — works with GitHub Checks, GitLab CI, Bitbucket Pipelines — or *Off*). Skip a deploy with `[skip render]` in the commit message. Manual triggers: dashboard (latest/specific commit, clear-cache deploy, restart), CLI `render deploys create`, a per-service **deploy hook** URL (GET or POST), or the API ([docs](https://render.com/docs/deploys)). Only one deploy runs per service at a time; overlap policy is *Wait* (default for workspaces created after 2025-07-14) or *Override*.

**Logs and metrics.** Dashboard log explorer with search, filters, regex, live tail. Retention: 7 days Hobby / 14 Pro / 30 Scale+ (older logs are gone for good even after upgrade). App log lines are rate-limited to 6,000/minute per instance. The Metrics tab shows CPU/memory/disk, HTTP volume by status code, and (Pro+) latency percentiles p50–p99 ([logging](https://render.com/docs/logging), [metrics](https://render.com/docs/service-metrics)).

**Databases.** Render Postgres is fully managed (connection string injected via `DATABASE_URL`-style env vars); supported versions 13–18 ([docs](https://render.com/docs/postgresql-upgrading)). Key Value is Valkey-8-based (Redis-compatible); paid tiers persist to disk, free does not ([docs](https://render.com/docs/key-value)).

**Custom domains** are per service, with free TLS. Rollback reuses a previous deploy's build artifact (fast) — free workspaces can only roll back two deploys ([docs](https://render.com/docs/rollbacks)).

**Cost awareness for beginners.** A typical Hobby-workspace bill for one always-on small web service + small Postgres is ~$13/mo ([Render's own example](https://render.com/pricing)); bandwidth beyond the workspace allowance (5 GB Hobby / 25 GB Pro / 1 TB Scale) is $0.15/GB.

## Intermediate (Docker, previews, workers, monorepos, CI)

**Docker.** Set the service language to Docker; Render builds the repo-root `Dockerfile` (custom path supported) with BuildKit, honors `.dockerignore`, caches layers, and stores the image in its private registry. You **cannot customize the image build command**; you *can* override the runtime command ("Docker Command"). Env vars are auto-exposed as build args — don't bake secrets into layers; use secret files. Prebuilt images (linux/amd64, <10 GB compressed) can be deployed from Docker Hub, GHCR, GitLab, Google Artifact Registry, or AWS ECR — but image-backed services never auto-deploy; trigger them via deploy hook (with `imgURL` param), CLI, or API ([docker docs](https://render.com/docs/docker), [image docs](https://render.com/docs/deploy-an-image)).

**Previews — two different systems.**
- *Service previews* (all plans): a temporary copy of **one** service per PR, manual-by-default, own `onrender.com` URL, deleted on merge/close, billed at the base service's rate prorated by the second ([docs](https://render.com/docs/service-previews)).
- *Preview environments* (**Pro workspace required**): a disposable copy of **every** service/datastore/env group in a Blueprint, for integration testing; datastore copies start empty; controlled by `previews.generation: off|manual|automatic` in `render.yaml` (`[render preview]` in the PR title creates one in manual mode; `expireAfterDays` cleans stale ones). Cost-control knobs: `previews.plan`, `previewPlan`, `previewValue`. `sync: false` secrets are **not** copied into previews — point previews at a manually-created env group instead ([docs](https://render.com/docs/preview-environments)).

**Monorepos.** `rootDir` scopes a service to a subdirectory; `buildFilter` paths/globs (relative to repo root, ignored-paths win) skip builds for unrelated changes. `render.yaml` changes always bypass filters ([docs](https://render.com/docs/build-filters)).

**Background workers and cron.** Workers run continuously with no inbound traffic (Celery, Sidekiq, BullMQ, Oban, etc.). Cron jobs use UTC-only cron expressions; at most one run is active per job (overlapping scheduled runs are delayed, manual runs cancel the active one); runs hard-stop at 12 hours; billing is per-second with a **$1/mo minimum per cron job** ([docs](https://render.com/docs/cronjobs)).

**Health checks and zero-downtime.** Web/private services get TCP probes by default; web services can add an HTTP path check (2xx/3xx = healthy). 15 consecutive failed seconds stop traffic to an instance; 60 seconds triggers auto-restart. Deploy sequence: new instances start alongside old → all must pass within 15 minutes or the deploy reverts → traffic switches → 60 s later SIGTERM with a configurable graceful window (default 30 s, max 300 s via `maxShutdownDelaySeconds`). **Attaching a persistent disk disables zero-downtime** and caps the service at one instance ([deploys](https://render.com/docs/deploys), [health checks](https://render.com/docs/health-checks)).

**CI/CD.** The documented pattern is GitHub Actions running tests, then curling the deploy-hook URL (stored as `RENDER_DEPLOY_HOOK_URL`) only on green merges to main. There is **no official Render GitHub Action**; the Marketplace one is third-party ([docs](https://render.com/docs/deploy-hooks)).

**SSH.** Paid web/private/worker services support dashboard Shell and real SSH (`render ssh`, plus `--ephemeral` for isolated instances); free services, static sites, and datastores do not ([docs](https://render.com/docs/ssh)).

## Advanced (Blueprints, autoscaling, observability, compliance)

**Blueprints (`render.yaml`) — Render's IaC.** One YAML file is the source of truth for interconnected services, databases, and env groups; created via Dashboard → New → Blueprint. Sync semantics: pushes that modify the file deploy added/changed resources; dashboard edits to managed resources are overwritten at next sync; syncs **never delete** resources. The spec covers `services` (types `web`, `pserv`, `worker`, `cron`, `keyvalue`, `workflow`), `databases`, `envVarGroups`, `projects`/`environments` (added Oct 2025), and `previews`. Renamed keys to know: `env`→`runtime`, `autoDeploy`→`autoDeployTrigger`, `redis`→`keyvalue`. Env-var features: `sync: false` (secret prompted once), `generateValue: true`, and `fromService`/`fromDatabase` references (properties like `connectionString`, `host`, `port`). Validate with `render blueprints validate` or the API; schema is on SchemaStore. An official **Terraform provider** is the alternative IaC path ([Blueprint spec](https://render.com/docs/blueprint-spec), [IaC overview](https://render.com/docs/infrastructure-as-code)).

```yaml
# render.yaml — representative shape (see the spec for the full field list)
services:
  - type: web
    name: api
    runtime: node
    plan: 1c-2g            # spec-based plan IDs since Aug 2026
    region: oregon          # immutable
    buildCommand: npm ci && npm run build
    startCommand: npm start
    healthCheckPath: /health
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: mydb
          property: connectionString
databases:
  - name: mydb
    plan: basic-256mb
```

**Scaling.** Manual scaling to 100 instances on any plan; **autoscaling** (min/max instances + CPU and/or memory targets) requires a Pro workspace; disk-attached services can't scale out; no sticky sessions — state must be externalized to Key Value or equivalent ([docs](https://render.com/docs/scaling)).

**Compute plans (renamed Aug 26, 2026).** Spec-based IDs with legacy names still valid: `0.5c-512mb` (Starter) $7/mo, `1c-2g` (Standard) $25, `2c-4g` (Pro) $85, `4c-8g` (Pro Plus) $175 … up to `12c-96g` $1,500, plus new memory-optimized tiers. Postgres scales to `128c-1024g` ($11,000/mo); connection caps step 100→500. **Workspace plans (changed Apr 23, 2026):** Hobby $0 (1 seat, 25 services), Pro $25/mo (unlimited seats), Scale $499/mo, Enterprise custom — all workspaces force-migrated by Aug 1, 2026 ([compute plans](https://render.com/docs/compute-plans), [pricing](https://render.com/pricing)). Per-instance dollar figures are from the pricing page (docs deliberately omit them); treat as of 2026-09-20.

**Observability plumbing.** Log streams (syslog/TLS or HTTPS) to 10 providers; OpenTelemetry metrics streaming (Datadog, Grafana, Honeycomb, etc.) — both Pro+ and neither counts against bandwidth. Notifications (email/Slack) cover deploy failures, crash-loop suspensions, disk >80% — but there are **no native CPU/RAM utilization alerts and no budget alerts**; wire webhooks (1 destination on Pro, 100 on Scale) or external monitoring instead ([log streams](https://render.com/docs/log-streams), [metrics streams](https://render.com/docs/metrics-streams), [notifications](https://render.com/docs/notifications)).

**Networking and security.** Private networking is same-region, same-workspace (max 75 open ports per service). No VPC peering — external private connectivity is **AWS PrivateLink** (Pro+, $30/mo up to 3 links). Dedicated outbound IPs: $100/mo per set of 3 (Pro+). IP allowlists require Scale+. DDoS protection (Cloudflare-powered) is free for everything. Compliance: SOC 2 Type II + ISO 27001 (certs behind NDA on Pro+), HIPAA-enabled workspaces on Scale+ with a BAA and a **20% surcharge on all usage** (docs show no minimum as of 2026-09-20; the pricing page has shown a $250/mo floor — likely legacy, verify before contracting) ([docs](https://render.com/docs/hipaa-compliance)). SAML SSO/SCIM and org-level audit logs are Scale+.

**Newer things to know.** **Workflows** (beta Apr 2026): a durable-execution engine for TypeScript/Python task functions — managed queue at no extra cost, scales to zero, runs up to 24 h, `flex` plan bills $0.20/active-CPU-hour ([docs](https://render.com/docs/workflows)). **Object Storage is still alpha** (founder-confirmed on the feedback board Mar 2026; no docs or pricing) — the documented workaround is the [MinIO template](https://render.com/templates/minio). **Sandboxes** appear in homepage nav as Early Access without public docs. Render's MCP server for Claude Code/Codex/Cursor shipped Jul 2026.

---

# Part II — Railway

Railway describes itself as an "all-in-one intelligent cloud provider" organized around Development → Deployment → Diagnosis ([philosophy](https://docs.railway.com/platform/philosophy)). Canonical docs live at **docs.railway.com**. Its mental model: Projects contain **Environments** (isolated copies of everything), environments contain **Services** (containers), services get **Variables**, **Volumes**, and **Deployments**.

## Onboarding (sign up → first running app)

**Two front doors.** Dashboard flow: New Project → one of exactly three options — *GitHub repo*, *Empty project*, or *Deploy a template* — then watch the Project Canvas ("mission control") build ([quick start](https://docs.railway.com/quick-start)). CLI flow: install with `curl -fsSL agents.railway.com | sh`, `brew install railway`, `npm i -g @railway/cli`, or `scoop install railway`, then:

```bash
railway login        # browser auth; --browserless for SSH/remote
railway init         # create a project
railway up           # scans, compresses, uploads your code; streams logs
railway open         # open the Project Canvas
```

**Get a URL.** After first deploy, click **Generate Domain** in service settings for a `*.up.railway.app` URL. The docs' own troubleshooting tip: the real error "is rarely at the bottom" of build logs.

**Templates.** The marketplace has 650+ templates (Postgres, n8n, SaaS starters…); maintainers can publish their own and earn commission under the partner program ([docs](https://docs.railway.com/templates)).

**What's free.** A one-time **$5 trial credit valid 30 days** (no card required; balance carries over if you upgrade). After that you land on the Free plan: $1 of credit per month, 1 vCPU / 0.5 GB per service, 1 replica, 3 services, 1 project ([pricing](https://railway.com/pricing)). There is **no ongoing free always-on tier** — Railway killed its original free tier in 2023 and brought back this limited Free plan in May 2025.

## Beginner (daily operation)

**Variables.** Three scopes: per-service, **shared variables** (`${{ shared.KEY }}`, defined per environment in Project Settings), and **reference variables** that pull another service's value — `DATABASE_URL=${{Postgres.DATABASE_URL}}` — which also creates deploy-order dependencies. Railway scans your repo for `.env*` files and offers one-click import. **Sealed variables** deliver values to builds/deploys but can never be read again in the UI or API ([docs](https://docs.railway.com/variables)).

**Staged changes.** Edits to variables/settings accumulate as *staged changes* you must review and deploy — Railway's core safety mechanism.

**Environments.** Every project starts with `production`; create more by *Duplicate* or *Empty*; PR environments (below) are ephemeral. Changes are scoped per environment, and private networks are isolated per environment — staging cannot talk to production privately ([docs](https://docs.railway.com/environments)).

**Logs and metrics.** stdout/stderr captured automatically (500 lines/sec/replica cap). Retention: 3 days Free / 7 Hobby / 30 Pro / 90 Enterprise — upgrading immediately restores older logs. Metrics: CPU, memory, disk, network per service, 30-day retention, deployment markers. Railway deliberately collects no app-level metrics (latency, error rates) — use OpenTelemetry ([logs](https://docs.railway.com/observability/logs), [metrics](https://docs.railway.com/observability/metrics)).

**Databases.** Add Postgres/MySQL/Mongo/Redis from the command palette (⌘K) or "+ New". They're **unmanaged template deployments** — you handle tuning, and the docs steer compliance-heavy users to Enterprise. Each database exposes `DATABASE_URL` (private) and, only if you enable Public Access, `DATABASE_PUBLIC_URL` via TCP proxy. (Legacy tutorials mention `DATABASE_PRIVATE_URL` — that variable no longer exists; reference `${{Postgres.DATABASE_URL}}` instead.) ([docs](https://docs.railway.com/databases/postgresql))

**Basic deploys.** Pushes to the connected branch auto-deploy (per-service trigger branch). `railway redeploy` reruns the latest code (how you apply variable changes); rollback restores the previous successful deployment's image *and* variables, gated by plan image-retention (24 h Free → 120 h Pro) ([deployment actions](https://docs.railway.com/deployments/deployment-actions)).

## Intermediate (GitHub flows, monorepos, Docker, volumes, cost control)

**GitHub integration.** Watch paths (gitignore-style) prevent empty-commit redeploys; *Wait for CI* holds deploys until GitHub checks pass (2-hour timeout). **PR environments** spin up an isolated copy per PR (Project Settings → Environments) and are deleted on merge/close. Since Jan 2026, **Focused PR Environments** deploy only services affected by the PR's changed files plus reference-variable dependencies — a big monorepo cost saver. **Bot PR environments** (toggle) covers Dependabot, Renovate, Copilot, Claude Code, Devin, Jules. PRs from users outside your workspace won't deploy ([environments](https://docs.railway.com/environments)).

**Monorepos.** Per-service Root Directory; the service name is generated from the package name; Railway auto-detects one deployable service per package in pnpm/npm/yarn/bun monorepos and configures `pnpm --filter <pkg> start`. Edit per-service config from the CLI: `railway environment edit --service-config backend source.rootDirectory /backend` ([docs](https://docs.railway.com/deployments/monorepo)).

**Builds: Railpack and Dockerfiles.** [Railpack](https://railpack.com) (default since 2025-09-19) auto-detects Node, Python, Go, PHP, static HTML, Java, Ruby, Deno, Rust, Elixir, and shell scripts; customize via `railpack.json` (`provider`, package versions like `"node": "22"`, `startCommand`, apt packages, caches) or env knobs (`RAILPACK_PACKAGES`, `RAILPACK_INSTALL_CMD`, `NO_CACHE=1`). If a `Dockerfile` (capital D, repo/root-directory root) exists, Railway always uses it; point elsewhere with `RAILWAY_DOCKERFILE_PATH` ([Railpack](https://docs.railway.com/builds/railpack), [Dockerfiles](https://docs.railway.com/builds/dockerfiles)).

**Healthchecks and lifecycle.** HTTP-path healthchecks (2xx within 300 s default; `RAILWAY_HEALTHCHECK_TIMEOUT_SEC` to override; requests originate from `healthcheck.railway.app`) gate deploys — old deployment stays live on failure. Restart policies: `ON_FAILURE` (default, max 10 retries) / `ALWAYS` (paid plans) / `NEVER`. Zero-downtime knobs: `RAILWAY_DEPLOYMENT_OVERLAP_SECONDS` and `RAILWAY_DEPLOYMENT_DRAINING_SECONDS` (both default 0). **Serverless sleep**: opt-in per service; sleeps after ~5 minutes without *outbound* packets; the first request after sleep may 502 ([healthchecks](https://docs.railway.com/deployments/healthchecks), [serverless](https://docs.railway.com/deployments/serverless)).

**Volumes.** Mount at container start (not build, not during pre-deploy commands); Railway builds into `/app`, so mount at `/app/data` for a `./data` path. One volume per service; **replicas and volumes are mutually exclusive**. Live (zero-downtime) resize on paid plans. Backups: daily kept 6 days / weekly 27 / monthly 89, plus manual (up to 50% of volume size) ([docs](https://docs.railway.com/volumes)).

**Networking.** Public: `Generate Domain` or custom domains (**both a CNAME and a TXT record required**; free Let's Encrypt certs). Limits per service: 10,000 concurrent connections, ~11,000 RPS/domain, 15-min max request duration, 32 KB headers; WebSockets can stay open indefinitely ([specs](https://docs.railway.com/networking/public-networking/specs-and-limits)). **TCP proxy** for non-HTTP protocols (databases, game servers): Railway assigns `something.proxy.rlwy.net:<port>`. **Private networking**: encrypted WireGuard, DNS names `<service>.railway.internal`, zero config, no egress charges — always prefer `DATABASE_URL` over `DATABASE_PUBLIC_URL` to avoid billed egress ([docs](https://docs.railway.com/networking/private-networking)).

**Cost control (the skill that keeps bills boring).** Set a **hard usage limit** (min $10, any plan) — when exceeded Railway *stops workloads* rather than deleting them; soft alerts email at 75/90/100%. The **Serverless** toggle stops idle services so you stop paying for allocated-but-idle CPU/RAM. Per-service **replica limits** cap max CPU/RAM. Note SMTP ports are **Pro-only** — Hobby and below must use HTTPS-API email services ([cost control](https://docs.railway.com/pricing/cost-control), [pricing](https://railway.com/pricing)).

## Advanced (IaC, multi-region, API, AI tooling, buckets)

**Infrastructure as Code — the big 2026 change.** `railway.json`/`railway.toml` **config-as-code is deprecated: existing files work until 2026-12-01 (hard cutoff), and new services can't opt in.** The replacement is `.railway/railway.ts` (TypeScript, GA) or `.py`/`.go` (beta), managing services, databases, volumes, buckets, domains, variables, and replicas:

```typescript
import { defineRailway, project, service } from "railway/iac";

export default defineRailway(() => {
  const web = service("web", { /* config */ });
  return project("my-app", { resources: [web] });
});
```

CLI lifecycle: `railway config init | pull | plan | apply` (`plan` is a dry-run with `--detailed-exit-code`: 0 = no drift, 2 = pending changes; `config migrate` converts legacy files, mapping e.g. `buildCommand`→`build`) ([IaC docs](https://docs.railway.com/infrastructure-as-code)). Legacy schema you'll still encounter in repos: `build.builder: RAILPACK|DOCKERFILE`, `deploy.startCommand`, `healthcheckPath`, `restartPolicyType`, `numReplicas`, `multiRegionConfig` ([reference](https://docs.railway.com/config-as-code/reference)).

**Scaling and multi-region.** Vertical scaling is automatic up to your plan's per-service ceiling (Hobby 48 vCPU/48 GB; Pro 1,000 vCPU/1 TB — limits include replica multiplication). Horizontal scaling is manual replica counts (Hobby 6, Pro 42) via settings or `numReplicas`; `multiRegionConfig` puts replicas of *one service* in multiple regions (`{"us-east4-eqdc4a": {"numReplicas": 2}, "europe-west4-drams3a": {...}}`); replica changes apply without a full redeploy; traffic routes to the nearest region then round-robins; **no sticky sessions** ([scaling](https://docs.railway.com/deployments/scaling)). There is no utilization-triggered autoscaling — schedule or script scaling yourself via the API.

**API and automation.** GraphQL API at `backboard.railway.com/graphql/v2` ("the same API that powers the dashboard"). Token types: Account/Workspace (`Authorization: Bearer`), Project (`Project-Access-Token` header — different header!), OAuth. Rate limits: 100 req/hr Free → 10,000/hr Pro (+50 req/s). GraphQL errors can arrive with HTTP 200 — always check the `errors` array ([docs](https://docs.railway.com/integrations/api)). Webhooks (per project) fire on deployment status/volume-usage/CPU-RAM alerts; 30 s timeout, ≤3 retries, **not cryptographically signed** (secret goes in the URL), circuit-broken after 100 failures/6 h ([docs](https://docs.railway.com/observability/webhooks)).

**Data platform.** **Storage Buckets** (GA): S3-compatible object storage at $0.015/GB-month with **free egress** and free API operations — but uploads from Railway services traverse the public network and incur normal egress, and buckets aren't on the private network ([billing](https://docs.railway.com/storage-buckets/billing)). Database durability: volume backups (COW incremental), **PITR** for Postgres via pgBackRest (~4-week window) and MySQL via 7-day binlog; HA variants (Postgres/Patroni, MySQL/Group Replication, Redis/Sentinel); in-place Postgres major-version upgrades with one-click revert (Sep 2026).

**Edge and egress.** Free per-service **CDN caching** for static assets (all plans; cache hits cost no compute and no egress; 2 h default TTL; SSE never cached). **WAF / Under Attack Mode** (browser-check for bot floods; blocks non-browser traffic on API-only domains). Static outbound egress IPs are **Pro-only** (3 IPs, HA). Outbound IPv6 is opt-in per service ([CDN](https://docs.railway.com/networking/cdn), [WAF](https://docs.railway.com/networking/waf)).

**The AI layer (2026 direction).** Railway has invested heavily here: the **Railway Agent** (dashboard/CLI/Slack/Discord) can inspect deployments and propose PRs; Agent Connectors (Notion, Linear, Sentry, MCP servers); a hosted MCP server (`railway mcp install`) and Skills (`railway skills install`); **Cloud Agents** — "your coding agent on a persistent Railway computer" (`railway code --claude`, beta); and **Sandboxes**, isolated ephemeral Linux VMs for agents/builds at $50/GB-mo memory + $50/vCPU-mo *active* CPU ([docs](https://docs.railway.com/ai), [pricing](https://railway.com/pricing)).

**Compliance and support.** SOC 2 Type II + SOC 3; HIPAA via paid BAA add-on with a spend threshold (Enterprise); GDPR DPA self-service. Support: community (Central Station) on Free/Hobby; ~72-hour direct response on Pro; "Business Class" (Pro add-on, qualifies at $5,000/mo spend) with SLOs — P1 outage acknowledgment in 1 hour, 24/7; Enterprise adds contractual SLAs ([support](https://docs.railway.com/platform/support), [compliance](https://docs.railway.com/enterprise/compliance)).

---

# Choosing between them

**Pricing in practice.** The models diverge in ways that matter more than the sticker numbers. Render's per-instance flat pricing means every service, worker, and always-on preview is a fixed line item — predictable, and cheaper for steady 24/7 loads — but the April 2026 restructure quietly cut Pro's included bandwidth from 1 TB to 25 GB ("a major price hike for indie developers" as one HN poster put it; 1 TB of overage now costs ~$150/mo at $0.15/GB). Railway's metering is the reverse: nearly free for intermittent or sleeping apps, but the canonical complaint is "the bill is unpredictable" — an always-on app plus a database can burn the $5 Hobby credit in a week, and Trustpilot carries 2026 complaints about charges exceeding expectations (and, in a few, continuing after cancellation). The mitigation — hard usage limits, minimum $10 — exists on every plan but is under-known; one 2026 comparison article still claimed no hard cap exists ([HN](https://news.ycombinator.com/item?id=48235993), [Trustpilot/Railway](https://www.trustpilot.com/review/railway.app), [cost-control docs](https://docs.railway.com/pricing/cost-control)).

**Reliability record.** Railway publishes unusually candid postmortems — 26 incident reports on its blog between Dec 2023 and Jul 2026, including a **May 19, 2026 ~8-hour platform-wide SEV-1** (Google erroneously suspended Railway's production GCP account, cascading to even non-GCP workloads), a **Mar 30, 2026 52-minute cross-account cache-exposure incident**, and a **Jul 2, 2026 ~4.5-hour US-East outage** ([postmortem](https://blog.railway.com/p/incident-report-may-19-2026-gcp-account-outage), [postmortem](https://blog.railway.com/p/incident-report-july-2-2026-us-east-services-outage)). Render doesn't publish postmortems; third-party trackers show frequent-but-short, rarely platform-wide incidents (Pulsetic's 90-day window: 15 incidents, median resolution 1 h 29 m). Community production verdicts track this: "Railway is easier to get started but in our experience it is unreliable for anything serious in production" is a representative thread take, while Render is described as "set and forget" — with the counterweight of its own 2023–2026 pricing-change friction and a sharply split review profile (G2 ~4.5 vs Trustpilot 2.3; Railway similar at 2.7 but polarized). Treat all review-site numbers as small samples.

**Fit heuristics that held up across sources.** Static sites and marketing pages → Render (free tier with CDN + custom domain; Railway has no static-site product). Multi-region single service or bursty/spiky workloads → Railway (native `multiRegionConfig`; per-second metering rewards sleeping). Predictable team budget, compliance needs (ISO 27001, HIPAA below enterprise spend) → Render. Heaviest AI/agent tooling and fastest zero-to-deploy loop → Railway. Both keep app-level lock-in low: bring a Git repo or Docker image, 12-factor env vars, and both sides publish migration guides in each direction — the real switching cost is re-authoring platform config (render.yaml vs Railway IaC) and moving managed data.

# Open questions / where the evidence runs out

- **Render Object Storage** — alpha per the founder (Mar 2026) with no docs/pricing; no launch date. If you need buckets today, Railway has them and Render's workaround is MinIO.
- **Render HTTP request timeout** — undocumented (the community's old "100 seconds" figure couldn't be verified on any current page). Long-request designs should test.
- **Render HIPAA minimum** — the dedicated docs page (fetched 2026-09-20) shows only the 20% surcharge with no minimum; the pricing page HTML has shown a "$250/mo or 20%, whichever is higher" formulation. Likely a stale pricing-page artifact, but confirm with sales before signing a BAA.
- **Railway Pro replica sizing** — the scaling docs page's "up to 24 vCPU/24 GB per replica" example and the plans tables' 1,000 vCPU/1 TB per-service aggregate are consistent if read as per-replica vs. aggregate, but wording differs across pages; a third-party claim of an Aug 2026 Pro cap cut to 48 vCPU/48 GB contradicted both official pages and looked like confusion with Hobby limits.
- **Railway prepay removal date** — docs say prepaid credits were removed "as of March 30" with the year unstated (likely 2026). Single source.
- **Hobby-plan replica CLI gating** — official tables allow 6 replicas on Hobby; one third-party blog claims `railway service scale --replicas` requires Pro. Unverified.
- **Railway latency claims** — the "~150 ms added queuing vs ~40 ms on Render" report traces to one r/rails thread plus secondhand citations; could be workload-specific. Test with your own app before treating as a platform property.
- **Preview-environment count limits (Render)** and Railway's Dockerfile "target stage" setting — both undocumented/absent from current docs.
- **Sentiment evidence quality** — Reddit threads were readable only via search snippets (bot walls), and Trustpilot samples are small (Render n=58, Railway n=85); G2 text is partially gated. Directionally consistent, individually weak.
- Anything dollar-denominated on either platform moves fast — Render restructured twice in 2026 already. Re-check [render.com/pricing](https://render.com/pricing) and [railway.com/pricing](https://railway.com/pricing) at decision time.

# Sources

**Render — official**
1. Render docs: [Your first deploy](https://render.com/docs/your-first-deploy), [Git providers](https://render.com/docs/git-provider), [Service types](https://render.com/docs/service-types), [Free tier](https://render.com/docs/free), [Compute plans](https://render.com/docs/compute-plans), [Deploys](https://render.com/docs/deploys), [Docker](https://render.com/docs/docker), [Deploy an image](https://render.com/docs/deploy-an-image), [Blueprint spec](https://render.com/docs/blueprint-spec), [Infrastructure as code](https://render.com/docs/infrastructure-as-code), [Preview environments](https://render.com/docs/preview-environments), [Service previews](https://render.com/docs/service-previews), [Environment variables](https://render.com/docs/configure-environment-variables), [Build filters](https://render.com/docs/build-filters), [Build pipeline](https://render.com/docs/build-pipeline), [Native environments](https://render.com/docs/native-environments), [Health checks](https://render.com/docs/health-checks), [Scaling](https://render.com/docs/scaling), [Rollbacks](https://render.com/docs/rollbacks), [Logging](https://render.com/docs/logging), [Log streams](https://render.com/docs/log-streams), [Metrics streams](https://render.com/docs/metrics-streams), [Notifications](https://render.com/docs/notifications), [SSH](https://render.com/docs/ssh), [Cron jobs](https://render.com/docs/cronjobs), [Background workers](https://render.com/docs/background-workers), [Workflows](https://render.com/docs/workflows), [Key Value](https://render.com/docs/key-value), [Postgres HA](https://render.com/docs/postgresql-high-availability), [Read replicas](https://render.com/docs/postgresql-read-replicas), [Private networking](https://render.com/docs/private-network), [PrivateLink](https://render.com/docs/private-link), [Dedicated IPs](https://render.com/docs/dedicated-ips), [DDoS protection](https://render.com/docs/ddos-protection), [Certifications & compliance](https://render.com/docs/certifications-compliance), [HIPAA](https://render.com/docs/hipaa-compliance), [Team members](https://render.com/docs/team-members), [Platform features by plan](https://render.com/docs/platform-features-by-plan), [Regions](https://render.com/docs/regions), [Deploy hooks](https://render.com/docs/deploy-hooks), [API](https://render.com/docs/api), [CLI](https://render.com/docs/cli) — all fetched 2026-09-20.
2. [Render pricing page](https://render.com/pricing) (fetched 2026-09-20) and [status page](https://status.render.com).
3. Render changelog and blog: workspace plan restructure (Apr 23, 2026), compute plan renames (Aug 26, 2026), Workflows beta (Apr 7, 2026), build-time reductions (Aug 7 / Jun 11, 2026), PostgreSQL 18 (Nov 13, 2025), Deploys page (Sep 3, 2026) — via [render.com/changelog](https://render.com/changelog) and [render.com/blog](https://render.com/blog).
4. Render feedback board: [Object Storage alpha](https://feedback.render.com/features/p/cloud-object-storage) (Mar 2026).

**Railway — official**
5. Railway docs (docs.railway.com, fetched 2026-09-20): [Quick start](https://docs.railway.com/quick-start), [The basics](https://docs.railway.com/overview/the-basics), [Philosophy](https://docs.railway.com/platform/philosophy), [Services](https://docs.railway.com/services), [Environments](https://docs.railway.com/environments), [Variables](https://docs.railway.com/variables), [Volumes](https://docs.railway.com/volumes), [CLI](https://docs.railway.com/cli), [CLI deploying](https://docs.railway.com/cli/deploying), [GitHub autodeploys](https://docs.railway.com/deployments/github-autodeploys), [Monorepos](https://docs.railway.com/deployments/monorepo), [Builds/Railpack](https://docs.railway.com/builds/railpack), [Dockerfiles](https://docs.railway.com/builds/dockerfiles), [Healthchecks](https://docs.railway.com/deployments/healthchecks), [Restart policy](https://docs.railway.com/deployments/restart-policy), [Serverless](https://docs.railway.com/deployments/serverless), [Scaling](https://docs.railway.com/deployments/scaling), [Deployment actions](https://docs.railway.com/deployments/deployment-actions), [Config-as-code (deprecated)](https://docs.railway.com/config-as-code), [Infrastructure as Code](https://docs.railway.com/infrastructure-as-code), [Pricing/plans](https://docs.railway.com/pricing/plans), [Cost control](https://docs.railway.com/pricing/cost-control), [Understanding your bill](https://docs.railway.com/pricing/understanding-your-bill), [Logs](https://docs.railway.com/observability/logs), [Metrics](https://docs.railway.com/observability/metrics), [Webhooks](https://docs.railway.com/observability/webhooks), [Public networking + specs](https://docs.railway.com/networking/public-networking/specs-and-limits), [TCP proxy](https://docs.railway.com/networking/tcp-proxy), [Private networking](https://docs.railway.com/networking/private-networking), [CDN](https://docs.railway.com/networking/cdn), [WAF](https://docs.railway.com/networking/waf), [Storage buckets billing](https://docs.railway.com/storage-buckets/billing), [Databases](https://docs.railway.com/databases), [PostgreSQL](https://docs.railway.com/databases/postgresql), [Backups](https://docs.railway.com/volumes/backups), [PITR](https://docs.railway.com/volumes/point-in-time-recovery), [Regions](https://docs.railway.com/deployments/regions), [API](https://docs.railway.com/integrations/api), [AI features](https://docs.railway.com/ai), [Workspaces](https://docs.railway.com/projects/workspaces), [Support](https://docs.railway.com/platform/support), [Compliance](https://docs.railway.com/enterprise/compliance), [Migrate from Render](https://docs.railway.com/platform/migrate-from-render).
6. [Railway pricing](https://railway.com/pricing) and [changelog](https://railway.com/changelog) (fetched 2026-09-20); [Railway incident postmortems](https://blog.railway.com) (May 20, 2026; Jul 3, 2026; Mar 31, 2026).
7. [Railpack docs](https://railpack.com/config/file) (Railway's open-source builder).

**Community / third-party**
8. [Encore.dev — Render vs Railway 2026](https://encore.dev) (Apr 19, 2026); [ExpressTech — Railway alternatives & flat vs usage pricing](https://expresstech.io/7-railway-alternatives-in-2026-flat-pricing-vs-usage-bills) (May 26, 2026); [Northflank — Railway alternatives](https://northflank.com) (Jun 1, 2026) — vendor-adjacent, biased but specific.
9. [Juan Vásquez — Heroku→Railway migration with gotcha list](https://juanvasquez.dev/blog/migrating-from-heroku-to-railway/) (Mar 31, 2026) — the single most detailed migration source found.
10. Hacker News: [Render April 2026 pricing thread](https://news.ycombinator.com/item?id=48235993) (~May 2026); [Render 2023 pricing thread](https://news.ycombinator.com/item?id=35010970) (Mar 2023); [Railway GCP-outage thread](https://news.ycombinator.com/item?id=48201484) (May 2026); [Heroku maintenance-mode update](https://www.heroku.com/blog) (Feb 6, 2026).
11. Trustpilot: [Render](https://www.trustpilot.com/review/render.com) (2.3/5, n=58) and [Railway](https://www.trustpilot.com/review/railway.app) (2.7/5, n=85), reviews through Sep 2026; G2 reviews for both (partially gated).
12. Reddit threads (via search snippets; full threads unfetchable): r/vibecoding, r/statichosting, r/webdev, r/rails, r/devops, r/indiehackers comparisons, 2024–2026.
13. Render's own [Render vs Railway comparison](https://render.com/articles/render-vs-railway) (May 6, 2026) and Railway's [compare-to-render](https://docs.railway.com/platform/compare-to-render) — each vendor's version, useful for conceded points only.
