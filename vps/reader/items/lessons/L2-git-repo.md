# Lesson 2 · Private GitHub repo — turning the workspace into something you can roll back

> **Visual aid:** none required for this lesson (it's a 30-minute checklist).
> **Time budget:** ~1 hr · **MVP gate contribution:** first green tag, `v0.0-meta`.

---

## Why this comes second, not tenth

You might think version control is a "polish" thing — something we add once the app works. The opposite is true.

- **Phase 0 already has value.** Design docs, golden captures of `eBay/test01`, the dashboard family — all of that is content you'd lose to a single broken partition.
- **Tags become your rollback ladder.** Every checkpoint ("first live capture", "VPS reachable", "HTTPS in place") is a `git tag`. Deploying the previous one is one command. No copying, no "wait what was the last working commit".
- **Private GitHub Actions minutes are free.** Private CI costs nothing and is more than enough for this build. There's no phase of the build where you'd rather not have CI.

---

## 2.1 — Create the `.gitignore` and `.gitattributes` *first*

> This is the lesson the design doc hammers on. Order matters: **ignore before init before add before commit.** A single `git add .` of the workspace before the ignore rules can leak the 258 MB golden captures into history. It's recoverable but it's not fun.

The two config files:

**`.gitignore`** (workspace root):

```gitignore
# dependencies — installed per environment, never in git
node_modules/

# runtime state — jobs are evidence, not code; data/auth is SECRETS
mvp/app/data/

# large derived artifacts (scratch) — regenerable
scratch/*.html
scratch/*.png

# golden captures — 258 MB, local + VPS only (rsync, not git)
eBay/

# research / session inputs
repo_data/
research-toolkit/
webfetch/
chat*.txt

# OS/tool noise
Thumbs.db
Desktop.ini
*.log
.DS_Store

# secrets — tripwire, never commit anything matching this
.env
.env.*
*.pem
*.key
```

**`.gitattributes`** — the file people forget, the one that saves a `chmod +x` herniated-disk evening:

```gitattributes
* text=auto
*.sh   text eol=lf
*.js   text
*.json text
*.md   text
*.png  binary
*.mhtml binary
*.html binary diff=html
```

> The `*.sh text eol=lf` line is doing real work: it normalizes your shell scripts to LF at commit time even if a Windows editor saved them as CRLF. systemd on EL9 will refuse a script with CRLF shebangs silently.

Create both files *now*, before any `git init`. Place them at the workspace root (the directory you're going to `git init` in).

---

## 2.2 — Init → first commit → private repo

In a PowerShell terminal (your Windows-side, not on the VPS):

```powershell
cd D:\stuff\ai-misc\_bsh2026\vscode_project01\70

git init -b main
# the ".gitattributes" line below is the Windows-only LF hygiene setting
git config core.autocrlf input

git add .
git status
# ↑↑↑ AUDIT THIS LIST ↑↑↑
# What you WANT to see:
#   mvp/app/...
#   mvp/docs/...
#   mvp/test/...
#   deliverable/...
#   design/...
#   scratch/*.js, *.md, *.txt  (NOT .html, NOT .png)
#   .gitignore  .gitattributes
# What you must NOT see:
#   eBay/   (258 MB of golden captures)
#   node_modules/
#   mvp/app/data/  (jobs + auth)
#   *.key / *.pem / .env
```

> ⚠️ **Take 30 seconds here.** Skim the `git status` list. If `eBay/` shows up, **stop** and fix `.gitignore` first. Same for `node_modules/` or any `.pem`/`.key`. Bake the audit into muscle memory; you'll do it at the start of every project.

When the audit is clean:

```powershell
git commit -m "ScamShield Concierge MVP: baseline (docs, pipeline, golden data)"
```

Then create the GitHub repo:

```powershell
# Option A — GitHub CLI (cleanest if you have it)
gh repo create scamshield-concierge --private --source . --push

# Option B — web UI: github.com → New repository → name: scamshield-concierge
#            → PRIVATE (important!) → Create.  Then:
git remote add origin git@github.com:<your-github-user>/scamshield-concierge.git
git push -u origin main
```

A tripwire you should run, once, *right now*:

```powershell
# the following find should print NOTHING:
git ls-files | Select-String -CaseSensitive:$false -Pattern "eBay|node_modules|data/auth|\\.env"
```

If it printed anything other than the literal `\.env` line at the bottom of `.gitignore`, fix it before continuing. (Optional belt-and-braces: install `gitleaks` once and run `gitleaks detect --no-git -v`. ~30 seconds.)

---

## 2.3 — Trunk-based rhythm + tag-per-gate (this is your whole strategy)

You're solo + AI-assisted + ~55 build hours. **Don't create a feature branch per lesson.** Just commit to `main` in small increments with imperative messages.

The other half of the rhythm: **every gate is a tag.**

```
v0.0-meta           (right after this lesson — proves the repo works)
v0.1-scaffold-golden  (L4) — golden replay passes locally
v0.2-capture         (L5) — lib/capture.js + blocked test green
v0.3-orchestrator    (L6) — router/orchestrator/SSE green
v0.4-report          (L7) — dashboard port + 22-field adapter green
v0.5-vps-tunnel      (L8) — systemd + SSH tunnel shows a live report
v0.6-mlp-public      (L9) — AutoSSL + Apache SSE proxy, public URL works
v1.0-demo            (L10–L12) — CI/CD + runbook + backups + rehearsed
```

To tag a checkpoint:

```powershell
git tag -a v0.0-meta -m "First checkpoint — meta lesson, design docs, golden data"
git push --tags
```

Rolling back is one command:

```powershell
git checkout v0.5-vps-tunnel
# and if you want to make THAT the live deploy, push the tag forward:
git tag -d v1.0-demo && git tag -a v1.0-demo -m "revert to v0.5-vps-tunnel"
git push --tags --force
```

> ⚠️ **Don't push `--tags --force` against `main` directly.** Tag amenders whoops public tags. Move the tag, push only the tag.

---

## 2.4 — Two repo-commit conventions to internalize

Beyond the ignore rules, two small things make this project much easier to maintain:

**A. Imperative subject + non-obvious body when needed.**

```
git commit -m "capture: switch scroll loop to card-count asserts (off-by-one in test01)"
```

**B. One commit per *thing*, not per *file*.** If you touched `lib/capture.js` and `lib/probe.js` to fix the same probe — that's one commit.

> The CI/CD lesson (L10) will formalize: this rhythm + tags + a single-line commit message = enough governance for the whole build. There is no `CONTRIBUTING.md`. Just that.

---

## 2.5 — `mvp/docs/` README sketch (root the README inside `mvp/`, not at workspace root)

> Why inside `mvp/docs/` and not at the workspace root? The workspace root contains `eBay/` (large, gitignored, sensitive) and `deliverable/` (golden data used only by golden tests). `mvp/docs/` is the cleanest "team-facing" landing pad.

Create `mvp/docs/README.md` with:

```markdown
# ScamShield Concierge (MVP)

Web app that drives logged-out headless Chromium through eBay search facets
and serves an interactive faceted dashboard report. Demo-grade MVP for
BSH2026 (single user, single-flight, ~55 build-hours). Production-ready
single-process Node app: `node:http`, SSE, file-based jobs, Playwright.

## Architecture in one line
See `docs/technical-summary.md` (single-file compilation of all
architecture docs as of 2026-09-19).

## Run

    # install (one-time)
    nvm install 24
    npm ci
    npx playwright install chromium --only-shell

    # offline test suite (~30s, no live eBay)
    node --test

    # run the server (default 127.0.0.1:8787)
    npm run dev

## Tests (when, where)
- offline suite (`node --test`): every edit
- golden gate (`test01`): pre-deploy, on the VPS box
- e2e live (manual, `SSC_E2E=1`): demo rehearsal only

## License
UNLICENSED — competition entry. No scraping circumvention, ever.
```

That's it. The README is honest about what it is and what it isn't.

---

## Anti-patterns to avoid

- ⛔ **Don't commit `eBay/`**. 258 MB of golden captures + LFS-stage history.
- ⛔ **Don't commit `mvp/app/data/`**. That's evidence + (optionally) auth secrets.
- ⛔ **Don't commit `node_modules/`**. The directory structure has 50k+ files; reinstall is one command.
- ⛔ **Don't add a `LICENSE`.** The design doc is explicit (UNLICENSED, "no scraping circumvention ever" is a stance). A LICENSE file is the wrong place to express it; the README and design doc are.
- ⛔ **Don't create a `feature/*` branch per lesson.** Solo + tags are the entire branching model.

---

## What "done" means for Lesson 2

Run, in order:

```powershell
cd D:\stuff\ai-misc\_bsh2026\vscode_project01\70
git ls-files | Select-String -CaseSensitive:$false -Pattern "eBay|node_modules|data/auth|\\.env"
# → no matches

git tag -a v0.0-meta -m "Checkpoint 0 — meta lesson, design docs, golden data"
git push --tags

# confirm the tag is on GitHub
gh release view v0.0-meta --repo <your-github-user>/scamshield-concierge
# (or: open github.com/.../releases/tag/v0.0-meta in a browser)
```

You're done when `v0.0-meta` is visible on GitHub and the audit list returned zero rows.

Next lesson (L3) is *also* short: we set up your three dev environments on the Windows laptop — one per branch of work — and confirm the offline test suite is green. The first time you can re-run tests in 4 seconds and watch failures cluster around your latest edit is the moment the rest of the build feels easy.
