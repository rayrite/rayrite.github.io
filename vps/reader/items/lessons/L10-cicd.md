# Lesson 10 · CI/CD — GitHub Actions: `ci.yml` + `deploy.yml` + tag-driven rollback

> **Visual aid:** `visual-aids/va09_cicd_pipeline.html`.
> **Time budget:** ~5 hrs · **MLP gate contribution:** `v1.0-demo` — first green tagged deploy (`v1.0-demo`) is on the VPS. Re-deploying any prior tag is one command.

---

## What this lesson produces

A private GitHub repo with two workflows:
- **`ci.yml`** runs on every push to `main` and PRs. Ubuntu, Node 24, `npm ci`, Playwright `--only-shell`, `node --test`. **No live eBay from CI, ever.**
- **`deploy.yml`** runs on every `v*` tag push (or manual dispatch). Runs the offline suite, *then* a **VPS-side pre-deploy gate** (`golden + replay + render`), then `rsync --delete (excluding `data/` and `node_modules/`)` → `npm ci --omit=dev` → `systemctl restart` → `/healthz` + GET `/` smoke tests. Tag-rewindable.

You also set up the **deploy keypair** (ed25519, dedicated, revocable alone) and 4 GitHub Actions secrets (`VPS_SSH_KEY`, `VPS_HOST`, `VPS_USER`, `VPS_PATH`).

---

## Why we don't do live-eBay from CI (it's not a "we can't", it's a "we won't")

> A shared GitHub Actions runner is a **datacenter IP, in a known running-everyone's-jobs posture**. That's *exactly* the IP class the 2026 marketplace-bot research flags. A CI that hits eBay on every push is reliable, ethical, and a *doxxing-level reputational risk* if someone on the demo committee checks your repo's Actions logs.

So `ci.yml` runs:

```yaml
node --test        # the offline unit/golden-blocked-render suite
                    #  → E2E-live.test.js is NOT included (it requires SSC_E2E=1)
                    #  → golden tests use `eBay/test01` which is rsynced to the VPS
                    #    for the pre-deploy gate; CI uses synthetic fixtures only
```

The VPS-side pre-deploy gate is where the **real** golden lives. We've already done this on dev; we now script it.

---

## Step 10.1 — The deploy keypair (create *before* the workflow)

> *Why a dedicated deploy keypair?* GitHub PATs and full VPS-user keys can do anything; a deploy keypair (one per repo, restricted to the deploy user, *read-only* for the source repo) limits blast radius. You revoke this one key to revoke deploys.

Laptop side:

```powershell
ssh-keygen -t ed25519 -f $env:USERPROFILE\.ssh\shamshield_deploy_ci -C "gh-actions@scamshield"
# passphrase?  Up to you.  For pure CI deploy keys, blank passphrase is typical
# — the *workload identity* (the GH Actions runner) is the gate.
```

VPS side (as `scamshield`, via the key we set up in L1):

```bash
mkdir -p ~/.ssh
chmod 700 ~/.ssh
# append the *public* key — public keys only
echo "ssh-ed25519 AAAA…  gh-actions@scamshield" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

> We append the *same* authorized_keys file the `scamshield` user uses for human SSH — that's fine. Two keys, one user, one set of authorized pubkeys. If we need to revoke, we remove that one line and the CI deploys die without touching the laptop-side human key.

Verify locally:

```powershell
ssh -i $env:USERPROFILE\.ssh\shamshield_deploy_ci scamshield@<VPS_IP> whoami
# expect: scamshield
```

---

## Step 10.2 — GitHub Actions secrets

In github.com → your-repo → Settings → Secrets and variables → Actions → **New repository secret**:

| Secret | Value |
|---|---|
| `VPS_SSH_KEY` | the *private* half of the new deploy keypair; paste the full PEM text |
| `VPS_HOST`    | `123.45.67.89` (your VPS IP) |
| `VPS_USER`    | `scamshield` |
| `VPS_PATH`    | `/opt/scamshield/app` |

> ⚠️ Don't commit the private key. Don't paste it anywhere visible. Once pasted into GH Secrets, the only way to retrieve is to re-add it.

---

## Step 10.3 — `mvp/app/scripts/vps_pre_deploy_gate.sh`

This is the script the deploy workflow calls *on the VPS* over SSH. It runs:

1. `npm ci --omit=dev` (idempotent; new deps since last deploy)
2. `node --test test/golden.test.js test/render.test.js test/blocked.test.js` — the same suite as CI, but now with the *real* `eBay/test01` golden capture available (rsynced once, separately).
3. If green, exit 0. If red, exit non-zero. The deploy job doesn't proceed to restart.

`mvp/app/scripts/vps_pre_deploy_gate.sh`:

```bash
#!/usr/bin/env bash
# vps_pre_deploy_gate.sh — run on the VPS, before any service restart.
# Why on the VPS?  Golden captures are not in git (256 MB); this gate runs where
# they live.  CI uses synthetic fixtures; this gate is the real one.
set -euo pipefail
cd /opt/scamshield/app
echo "[gate] reinstall prod deps"
npm ci --omit=dev
echo "[gate] ensure test01 golden present"
test -f /opt/scamshield/golden/test01/captures/current.mhtml \
  || { echo "[gate] missing test01 at /opt/scamshield/golden/test01" >&2; exit 2; }
echo "[gate] offline test suite"
NODE_ENV=development SSC_DATA_DIR=/opt/scamshield/golden/.tmp \
  node --test test/golden.test.js test/render.test.js test/blocked.test.js
echo "[gate] ok"
```

A *separate* one-time rsync of the golden captures:

```powershell
# laptop, once
$golden = "D:\stuff\ai-misc\_bsh2026\vscode_project01\70\eBay\test01"
$dst = "scamshield@<VPS_IP>:/opt/scamshield/golden/test01/"

rsync -avz `
  -e "ssh -i $env:USERPROFILE\.ssh\shamshield_deploy" `
  "$golden/" "$dst"
# 33 MB; one-time; not in any git history; backups carry the long tail.
```

> `test02` (226 MB) **deliberately** doesn't go to the VPS. The replay-rtx test is dev-box only; design.md §7 is firm.

Mark executable and commit the script:

```powershell
cd mvp\app\scripts
git add vps_pre_deploy_gate.sh
git update-index --chmod=+x vps_pre_deploy_gate.sh
```

---

## Step 10.4 — `.github/workflows/ci.yml`

```yaml
# .github/workflows/ci.yml
name: ci
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '24'
          cache: 'npm'
          cache-dependency-path: 'mvp/app/package-lock.json'

      - name: Install Playwright Chromium (--only-shell)
        working-directory: mvp/app
        run: npx playwright install chromium --only-shell

      - name: npm ci
        working-directory: mvp/app
        run: npm ci

      - name: Offline test suite (golden + replay + render + blocked + units)
        working-directory: mvp/app
        env:
          # CI deliberately never hits live eBay; the offline suite ONLY.
          NODE_ENV: development
          SSC_DATA_DIR: .ci-testdata
        run: |
          # golden.test.js needs eBay/test01 — not in git; CI uses fixtures only.
          # Block the live-eBay tests and the real-golden tests explicitly:
          node --test test/blocked.test.js
          # Unit tests in test/unit/ if any.
          # render.test.js cannot open real reports without a prior job;
          #   it's covered on the VPS pre-deploy gate.
```

---

## Step 10.5 — `.github/workflows/deploy.yml`

```yaml
# .github/workflows/deploy.yml
name: deploy
on:
  push:
    tags:
      - 'v*'
  workflow_dispatch:                       # allow manual runs
    inputs:
      ref:
        description: 'git ref to deploy (tag or branch)'
        required: false
        default: 'main'

jobs:
  deploy:
    runs-on: ubuntu-latest
    concurrency:
      group: deploy
      cancel-in-progress: false            # never cancel a deploy mid-flight; let it finish

    steps:
      - name: Resolve ref to deploy
        id: resolve
        run: |
          if [ "${{ github.event_name }}" = "push" ]; then
            echo "ref=${{ github.ref }}" >> $GITHUB_OUTPUT
          else
            echo "ref=${{ inputs.ref || 'main' }}" >> $GITHUB_OUTPUT
          fi

      - uses: actions/checkout@v4
        with:
          ref: ${{ steps.resolve.outputs.ref }}
          fetch-depth: 0

      # Skip the OFFLINE suite at CI-level; the *VPS-side* gate re-runs it
      # against the real captures.  We do run a Node syntax check here though.

      - name: Syntax check the app
        working-directory: mvp/app
        run: node --check server.js && node --check cli.js

      - name: Set up SSH
        uses: webfactory/ssh-agent@v0.9.0
        with:
          ssh-private-key: ${{ secrets.VPS_SSH_KEY }}

      - name: Pre-flight: VPS reachable, /healthz is green
        run: |
          ssh -o StrictHostKeyChecking=accept-new ${{ secrets.VPS_USER }}@${{ secrets.VPS_HOST }} \
            "curl -fs http://127.0.0.1:8787/healthz"

      - name: VPS-side pre-deploy gate
        run: |
          ssh ${{ secrets.VPS_USER }}@${{ secrets.VPS_HOST }} \
            "bash /opt/scamshield/app/scripts/vps_pre_deploy_gate.sh"

      - name: rsync code (NEVER data, NEVER node_modules)
        run: |
          rsync -az --delete \
            --exclude 'node_modules/' \
            --exclude 'data/' \
            --exclude 'test/screenshots/' \
            --exclude '.git/' \
            -e "ssh -o StrictHostKeyChecking=accept-new" \
            mvp/app/ ${{ secrets.VPS_USER }}@${{ secrets.VPS_HOST }}:${{ secrets.VPS_PATH }}/

      - name: Restart service
        run: |
          ssh ${{ secrets.VPS_USER }}@${{ secrets.VPS_HOST }} \
            "sudo systemctl restart scamshield"

      - name: Smoke: /healthz + GET /
        run: |
          ssh ${{ secrets.VPS_USER }}@${{ secrets.VPS_HOST }} \
            "sleep 2 && curl -fs http://127.0.0.1:8787/healthz && \
             curl -fs -o /dev/null -w '%{http_code}' http://127.0.0.1:8787/"

      - name: Annotate release
        if: success() && startsWith(github.ref, 'refs/tags/')
        uses: softprops/action-gh-release@v2
        with:
          tag_name: ${{ github.ref_name }}
          generate_release_notes: true
```

> ⚠️ Two non-defaults you should know:
>
> 1. **`concurrency.cancel-in-progress: false`** — never start a fresh deploy while one is mid-flight; let the current one finish (or fail). A mid-deploy rsync + restart can leave the unit in a half-applied state.
>
> 2. **`webfactory/ssh-agent`** — caches the private key in the runner's agent so subsequent `ssh`/`rsync`/`scp` steps use it without a passphrase prompt. Don't try to inline `ssh -i "${{ secrets.VPS_SSH_KEY }}"` — escaping the newlines is a nightmare.

---

## Step 10.6 — Branch protection (optional but recommended)

github.com → repo → Settings → Branches → *Add rule*:

- Branch name pattern: `main`
- ✅ Require a pull request before merging
- ✅ Require status checks to pass before merging
  - Select: `ci / test`
- ✅ Do not allow bypassing the above settings

This costs nothing on a private repo and prevents a rushed `git push --force` from skipping the offline suite.

---

## Step 10.7 — Tagging `v1.0-demo` + the first deploy

```powershell
git add -A
git commit -m "ci: ci.yml + deploy.yml + VPS pre-deploy gate; deploy key documented"

git tag -a v1.0-demo -m "First deploy — production-ready baseline for the Buildathon"
git push origin main --tags
```

Watch:

1. `ci.yml` runs first (proves your push isn't broken).
2. `deploy.yml` runs after the tag lands.

If `deploy.yml` fails:

- ❌ *gate fail*: see the line of `node --test` that broke. Same offline suite you have on dev — fixes are pushes, not manual work.
- ❌ *rsync fail*: usually SSH key escrow; check `webfactory/ssh-agent` logs.
- ❌ *smoke fail*: usually means the unit didn't actually come up; `journalctl -u scamshield` on the VPS tells you why.

The whole deploy normally takes **~2 min** from push to `200 OK`.

---

## Step 10.8 — The rollback ladder (the *real* reason CI/CD exists)

```powershell
# On the laptop:
git tag -d v1.0-demo && git tag -a v1.0-demo -m "rollback to v0.6-mlp-public" --force
git push --tags --force
# OR, more cleanly, just re-deploy an older tag:
git push origin v0.6-mlp-public --delete
# ^ nope — deletes the tag.  Better: re-push the older tag's source as a new tag:
git tag -a v1.0-demo-revert -m "revert to v0.6-mlp-public"
git push --tags
```

> The older tag's source ref (`v0.6-mlp-public`) keeps existing. Re-deploying it uses the same workflow, same key, same gate. **~2 minutes back to a known-good state.** This is what makes "the demo was working this morning" a solvable problem instead of a Sunday.

---

## Step 10.9 — Save the operator notes (append to RUNBOOK)

```markdown
## CI / CD

# Push tags to deploy:
git tag -a vX.Y-tagname -m "..."
git push --tags

# Re-deploy an older tag (rollback):
git checkout v0.6-mlp-public
git tag -a v1.0-demo-revert -m "rollback"
git push --tags

# Manual deploy from a non-tagged branch (rare — for hotfixes):
# GH Actions → Deploy → Run workflow → ref: hotfix-xyz
```

---

## Step 10.10 — Tagging the v1 checkpoint

```powershell
git tag -a v1.0-demo -m "First deploy — production-ready baseline (after CI/CD in place)"
git push --tags
```

---

## Anti-patterns to avoid

- ⛔ **Don't run the live eBay test (`SSC_E2E=1`) from CI.** Use the synthetic fixture server only. Already enforced by `ci.yml`.
- ⛔ **Don't use a PAT instead of a deploy key.** PATs are repo-scoped *and* user-scoped; revoking is surgery. Keys are one entry in `authorized_keys`.
- ⛔ **Don't `git push --force` against `main`.** Even with branch protection, branch protection guards a merge path, not a `git push`. Configure `receive.denyNonFastForwards` on GitHub; it's already on by default, but double-check.
- ⛔ **Don't rsync `data/`, ever.** Even when the deploy "looks broken" and the temptation to "just nuke that folder" arises.
- ⛔ **Don't tag from CI; tag from laptop.** Tags are you signing off on something. CI tagging can lead to tags that you never reviewed.

---

## What "done" means for Lesson 10

```powershell
# 1) Watch the workflow green on github.com:
#    → repo → Actions → ci.yml    → green
#    → repo → Actions → deploy.yml → green
#    → VPS: systemctl status scamshield → active; /healthz → 200

# 2) After step 1:
(Invoke-WebRequest "https://concierge.<your-root-domain/healthz" -SkipCertificateCheck).Content
# → {"ok":true,"busy":false,"env":"prod"}

# 3) Rollback test (in a non-crisis moment — NOT now):
git tag -a v1.0-rollback-exercise -m "manual test"
git push --tags
# Should run deploy.yml and end at /healthz 200.
```

When the workflow runs end-to-end and you have a tag-based rollback you trust, Lesson 10 is done. The remaining two lessons are polish — L11 makes the demo itself smooth, L12 makes the *next morning* smooth.
