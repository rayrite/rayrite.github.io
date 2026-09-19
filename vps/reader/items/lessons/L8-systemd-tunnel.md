# Lesson 8 · Deploy stage 1 — VPS service user + Node 24 + systemd unit + SSH tunnel rehearsal

> **Visual aids:** `visual-aids/va08_deployment_topology.html`, `va11_security_threat_model.html`.
> **Time budget:** ~5 hrs · **MVP gate contribution:** `v0.5-vps-tunnel` — `systemctl status scamshield` is green AND you can demo from your laptop via `ssh -L`.

---

## What this lesson produces

By the end of L8 your app is **live on the VPS, bound to loopback only, reachable via an SSH tunnel from your laptop for the demo**. No public URL yet — that's L9 — but the *runtime infrastructure* (systemd + Node 24 + Chromium deps + memory cgroup) is all done and tested.

You will be able to do this from a shell on your laptop:

```powershell
ssh -L 8787:127.0.0.1:8787 -i $env:USERPROFILE\.ssh\shamshield_deploy scamshield@<VPS_IP>
# new tab:
(Invoke-WebRequest http://localhost:8787/healthz).Content
# → {"ok":true,"busy":false,"env":"prod"}
```

…and then run a real query against eBay from the VPS, see the report, share the report URL with a teammate.

---

## What we are *not* doing yet

- ⛔ No Apache proxy. (L9.)
- ⛔ No AutoSSL / HTTPS. (L9.)
- ⛔ No cPanel subdomain. (L9.)
- ⛔ No CI/CD. (L10.)
- ⛔ No demo-rehearsal. (L11.)

Keeping the lesson narrowly scoped is the cheapest way to a high-quality, debuggable deploy. When L9 layers in the proxy, the only thing that can break is Apache; the Node side is *proven*.

---

## Step 8.1 — The VPS-side service user (the deploy user)

In L1 we created `scamshield`. Now we refine it for *production* discipline:

```bash
# on the VPS, as scamshield via key login
mkdir -p ~/.ssh
chmod 700 ~/.ssh
# confirm authorized_keys is the only file in there
ls -la ~/.ssh
# expected:
# drwx------  2 scamshield scamshield  .  .
# drwx------  8 scamshield scamshield  .. ..
# -rw-------  1 scamshield scamshield  authorized_keys
```

Then create the app directory tree:

```bash
sudo mkdir -p /opt/scamshield/app /opt/scamshield/data/jobs /opt/scamshield/scripts
sudo chown -R scamshield:scamshield /opt/scamshield
# The app lives under /opt/scamshield/app.
# data/ lives under /opt/scamshield/data — separate so a redeploy never eats jobs.
```

> *Why not `mvp/app/` on the VPS?* `mvp` is a workspace root on your laptop; on the VPS we want minimal, predictable paths. The shipped code is what's inside `mvp/app/`, called `/opt/scamshield/app/` after rsync.

---

## Step 8.2 — Node 24 LTS via nvm on the VPS

> *Why nvm, not system Node?* EPEL ships Node 16 on EL9 (EOL). cPanel's ea-nodejs22 caps at 22 and is Passenger-coupled. nvm gives us Node 24 LTS until 2029-04, with the exact-binary systemd can stat.

```bash
# as scamshield (NOT root — nvm installs per-user)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
# log out + back in, OR:
. ~/.nvm/nvm.sh
nvm install 24
nvm alias default 24

# Get the exact path — systemd will point at THIS file, not "node":
which node
# → /home/scamshield/.nvm/versions/node/v24.X.Y/bin/node
# Copy that exact string; it's going into the systemd unit as ExecStart.
```

Set up an `.nvmrc` for the deploy user too, so future installs are one-liners:

```bash
echo "24" > /opt/scamshield/.nvmrc
```

---

## Step 8.3 — Rsync the app (excludes are the most important lines you'll write today)

On your *laptop*, the rsync command that *always* works:

```powershell
# workstation side, PowerShell
$app = "D:\stuff\ai-misc\_bsh2026\vscode_project01\70\mvp\app"
$dst = "scamshield@<VPS_IP>:/opt/scamshield/app/"

# --delete prunes removed files.  --exclude makes sure we don't ship:
#   node_modules (rebuilt per env), data (jobs + auth profile), .git, captures.
rsync `
  --delete `
  --exclude "node_modules/" `
  --exclude "data/" `
  --exclude ".git/" `
  --exclude "*.log" `
  --exclude ".env*" `
  -avz `
  -e "ssh -i $env:USERPROFILE\.ssh\shamshield_deploy" `
  "$app/" "$dst"
```

What that `--exclude data/` does: **a failed CI run cannot eat `data/jobs/` on the server**. It's the single most important line in the deploy script.

Verify the rsync:

```bash
# on the VPS, as scamshield
ls /opt/scamshield/app/
# → server.js · cli.js · lib/ · views/ · profiles/ · package.json · package-lock.json · test/
# (NOT: data/, NOT: node_modules/)
```

---

## Step 8.4 — Install deps + Chromium deps on EL9

> *The EL9 / Chromium story is the second "scary install" of the project.* Playwright's `install-deps` is Debian-family; on EL9 you install the libs by hand. The list is documented in design.md §10.4 — copy-paste into a single command:

```bash
# on the VPS, as scamshield
cd /opt/scamshield/app

# Dependencies Playwright's apt-bundled installer would have grabbed, but on EL9 it's manual:
sudo dnf install -y nss atk at-spi2-atk cups-libs libdrm \
  libXcomposite libXdamage libXrandr mesa-libgbm pango alsa-lib gtk3
# Some LiquidWeb boxes need an additional step: enable EPEL if a lib 404s.
# (We will not enable it preemptively; if dnf fails we'll come back.)

# Install Playwright + Chromium (shell variant only — saves ~150 MB)
npm ci --omit=dev                                   # prod-only deps, no test runner
npx playwright install chromium --only-shell
```

The first launch usually reveals one missing lib. When it does:

```bash
# capture the error from a failed launch:
/home/scamshield/.nvm/versions/node/v24.X.Y/bin/node \
  /opt/scamshield/app/cli.js live --query="rtx 3090" --target=20 --timeout=20
# any error mentioning ".so" / "libfoo.so" → install it, retry
# sudo dnf install -y the-missing-lib
```

Loop until you get a live capture on the VPS. With our 2 GB VPS and `target=20` it'll complete in <30s. Save the output.

> **Memory check.** On a 2 GB VPS with Chromium running:
> - `free -m` should show ~600 MB "available" before launch
> - After launch + one facet captured + MHTML on disk: ~300 MB available
> - When `MemoryHigh=1500M` and `MemoryMax=2000M` are set, the cgroup kills the unit *before* OOMs the whole box.
> - **Don't set `MemoryMax` higher than 2 GB** — the cgroup is meaningless if it can never be hit, and you lose the safety property.

---

## Step 8.5 — The systemd unit (`/etc/systemd/system/scamshield.service`)

The design doc's unit is canonical. Here's the file with the *EXACT* node binary path you'd substitute (replace `<v24.X.Y>` with what `which node` printed):

```ini
# /etc/systemd/system/scamshield.service
[Unit]
Description=ScamShield Concierge MVP
After=network.target

[Service]
User=scamshield
WorkingDirectory=/opt/scamshield/app

# nvm is a shell function — services never see it.  Use the exact versioned binary.
ExecStart=/home/scamshield/.nvm/versions/node/v24.X.Y/bin/node server.js

# Environment is the smallest list that lets the app find what it needs.
# PORT/HOST set the bind. NODE_ENV=production is the only production flag.
# Anything else is a developer convenience: SSC_TARGET_CARDS=150 keeps memory
# under control on 2 GB; SSC_PRUNE_KEEP=20 caps the disk.
Environment=HOST=127.0.0.1
Environment=PORT=8787
Environment=NODE_ENV=production
Environment=SSC_ENV=prod
Environment=SSC_DATA_DIR=/opt/scamshield/data
Environment=SSC_PROFILE_DIR=/opt/scamshield/app/profiles
Environment=SSC_TARGET_CARDS=150
Environment=SSC_PRUNE_KEEP=20

Restart=on-failure
RestartSec=5s

# Memory cgroup: high-water at ~80% of cap. systemd kills the unit
# (including the Chromium tree) when MemoryHigh is exceeded.
MemoryHigh=1500M
MemoryMax=2000M

# `KillMode=control-group` ensures the *entire* Playwright/Chromium tree dies
# when the unit dies.  Without this, orphaned chromium processes leak RAM.
KillMode=control-group

# Chromium sandbox needs real user namespaces.  EL9 ships them on by default,
# so we DO NOT add `NoNewPrivileges`/`PrivateUsers`/`DynamicUser` (they break
# Chromium's sandbox).  See design.md §10.2.

[Install]
WantedBy=multi-user.target
```

> ⚠️ **Three things to NOT add**: `NoNewPrivileges=true`, `PrivateUsers=true`, `DynamicUser=...`. These all clash with Chromium's renderer sandbox (systemd#5921). The mandate §16 / design.md §10.2 is firm.

Reload systemd, start, observe:

```bash
sudo systemctl daemon-reload
sudo systemctl enable scamshield.service       # autostart at boot (optional, but nice)
sudo systemctl start scamshield.service
sudo systemctl status scamshield.service
```

Expected:

```
● scamshield.service - ScamShield Concierge MVP
   Active: active (running) since …
   Main PID: 12345 (node)
   Memory: 80.0M (high: 1.5G, max: 2.0G)
   …
```

If `status` is `failed` (red), `journalctl -u scamshield --no-pager -n 50` shows why. Common failures:

| Symptom | Likely cause |
|---|---|
| `code=exited, status=203/EXEC` | wrong node path; `ls -l <ExecStart>` and try `ExecStart=` again |
| `code=killed, signal=KILL` | OOM; check `MemoryMax` (probably Chromium + Playwright exceeded) — bump or reduce `SSC_TARGET_CARDS` |
| `code=exited, status=1` | application error; check `journalctl` |
| Status OK but no `:8787` listening | `HOST=127.0.0.1` binding worked; on the *server*, `curl http://127.0.0.1:8787/healthz` works; loopback+SSH tunnel from your laptop is the next step |

The terminal sanity check on the server:

```bash
curl -s http://127.0.0.1:8787/healthz
# expect: {"ok":true,"busy":false,"env":"prod"}
```

That's the L8 backend green light.

---

## Step 8.6 — SSH-tunnel rehearsal (the "demo reachability" test)

The point of this step is **no DNS, no Apache, no TLS — pure reachability.** The judge (or a teammate) can already use the report through this tunnel while L9 layers in the public URL.

On your *laptop*:

```powershell
# Open a long-running shell; -N means don't open an interactive session.
ssh -i $env:USERPROFILE\.ssh\shamshield_deploy -L 8787:127.0.0.1:8787 -N scamshield@<VPS_IP>
# leave it running
```

In a *second* PowerShell tab:

```powershell
(Invoke-WebRequest http://localhost:8787/healthz).Content
# → {"ok":true,"busy":false,"env":"prod"}
```

Open `http://localhost:8787` in your browser. Submit `mac studio` (or `rtx 3090`). Watch the SSE fill. Get a reportUrl. Open `/report/<id>/`. **You are done — the demo is live for whatever device can reach your laptop.**

### Why the SSH tunnel matters even after L9

Once the public URL is up (L9), the SSH tunnel remains a *lower-fidelity but always-available* escape hatch:

- During cPanel / Apache config changes (L9 surfaces a 502 while you reload Apache), the tunnel keeps showing the app.
- During a cert renewal mismatch, the tunnel shows the app HTTP-only (your laptop, your proxy).
- During a demo-day internet wobble in the judge's network, if your laptop has any tether, they can see the app through you.

That's not theoretical. Save the `ssh -L` command in your note as the *backup* demo path. We add the public URL to it in L9; we never remove it.

> ⚠️ **Don't make the SSH-tunnel session the demo.** Keep `~30s` to reattach in case it dies; the public URL (L9) is the demo path.

---

## Step 8.7 — First end-to-end live capture on the VPS

This is the moment of truth. The unit, the system unit, the Chrome deps, the network egress — all on the VPS — need to produce a real `reportUrl`.

```powershell
# In a third laptop tab:
$base = "http://localhost:8787"
$r = Invoke-WebRequest "$base/api/jobs" -Method POST -Headers @{"content-type"="application/json"} -Body '{"query":"rtx 3090"}'
$jobId = ($r.Content | ConvertFrom-Json).jobId
echo "jobId = $jobId"

curl.exe -N "$base/api/jobs/$jobId/events"
# expect: capture stages → done {reportUrl}
```

Open the `reportUrl` in a browser. Verify the dashboard loads.

> ⚠️ **First capture on a fresh VPS IP often hits the eBay block interstitial.** That's not a deploy problem; it's "the IP is new and the rate-limiter is curious." The design-doc fallback (Recent reports list, pre-captured demo) handles this. We'll set up the pre-capture in L11.

---

## Step 8.8 — `mvp/docs/RUNBOOK-VPS.md` (write it now)

By the end of L8, you have enough context to write the operator runbook. This isn't documentation busy-work — it lets *future you* land at 7am on demo day and remember nothing.

```markdown
# ScamShield VPS Runbook

## First-time access (per workstation)
ssh -i ~/.ssh/scamshield_deploy scamshield@<VPS_IP>

## Common commands
sudo systemctl status scamshield        # is the unit alive?
sudo systemctl restart scamshield       # restart cleanly
sudo journalctl -u scamshield -n 100    # logs
curl -s http://127.0.0.1:8787/healthz   # liveness probe

## Deploy (from laptop, after push + tag)
ssh -i ~/.ssh/scamshield_deploy scamshield@<VPS_IP> \
  "cd /opt/scamshield/app && \
   rsync -avz --delete \
     --exclude node_modules/ --exclude data/ \
     /local/repo/mvp/app/ /opt/scamshield/app/ && \
   npm ci --omit=dev && \
   sudo systemctl restart scamshield && \
   curl -s http://127.0.0.1:8787/healthz"

## Replays (no eBay)
node cli.js replay --dir=/path/to/captures --query="mac studio"

## Backups
# data/jobs rsync nightly to cPanel home directory (L12)

## Known gotchas
- "blocked" → wait 10–30 min, retry
- Apache config (L9): don't proxy "/.well-known/*"
- "Memory killed" in journal: usually 3 MHTMLs alive simultaneously — verify
  one-at-a-time memory discipline in L5 capture
```

Commit this to `mvp/docs/`. It's the doc you thank yourself for on demo day.

---

## Step 8.9 — Tagging

```powershell
git tag -a v0.5-vps-tunnel -m "MVP via SSH tunnel: systemd service green, /healthz 200, first live capture on VPS"
git push --tags
```

---

## Anti-patterns to avoid

- ⛔ **Don't bind to `0.0.0.0`.** Ever. Public traffic enters through Apache (L9), not Node. Loopback bind ⇒ zero CSF changes; that's the whole point.
- ⛔ **Don't use `DynamicUser=`.** It generates a per-boot user; the persistent `data/jobs/` directory's ownership becomes a mystery.
- ⛔ **Don't skip `KillMode=control-group`.** Without it, the launcher dies and Chromium keeps the memory held.
- ⛔ **Don't rsync `data/` or `node_modules/`.** `data/` is jobs + (optionally) secrets; `node_modules/` is rebuilt per environment.
- ⛔ **Don't launch Chromium via `sudo`.** The unit runs as `scamshield`; sudo is for the *deploy* user only on the orchestrating commands.
- ⛔ **Don't bump `MemoryMax` past the box's RAM.** The cgroup that can never be hit is no cgroup at all.
- ⛔ **Don't add `'--no-sandbox'` to Chromium args.** EL9 has user namespaces; the sandbox is on by design.

---

## What "done" means for Lesson 8

```powershell
ssh -i $env:USERPROFILE\.ssh\shamshield_deploy -L 8787:127.0.0.1:8787 -N scamshield@<VPS_IP> &
Start-Sleep -Seconds 1
(Invoke-WebRequest http://localhost:8787/healthz).Content
# {"ok":true,"busy":false,"env":"prod"}

$r = Invoke-WebRequest http://localhost:8787/api/jobs -Method POST -Headers @{"content-type"="application/json"} -Body '{"query":"rtx 3090"}'
$jobId = ($r.Content | ConvertFrom-Json).jobId
Start-Sleep -Seconds 60
(Invoke-WebRequest "http://localhost:8787/report/$jobId/").StatusCode   # 200
```

When all four return expected values, **the MVP demo is technically complete** — it's just not reachable on the public internet yet. That's L9's job: turn this into `https://concierge.<your-domain>` with TLS and the SSE safety dance.

L9 incoming when you're ready.
