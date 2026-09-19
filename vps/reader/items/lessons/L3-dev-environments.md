# Lesson 3 · Three dev environments on your Windows laptop + the offline test suite

> **Visual aid:** `visual-aids/va05_dev_ci_prod.html` (which test runs where).
> **Time budget:** ~2 hrs · **MVP gate contribution:** offline suite green (unit + golden + blocked + render) on the laptop.

---

## The "three environments" idea, scoped to your MVP

When I introduced you to the curriculum in Lesson 0 I said we'd set up *dev/qa/prod* on your Windows laptop. I want to be straight with you about what that maps to in this particular build:

| Environment | What it is here | Why we need it |
|---|---|---|
| **dev** | your laptop. `npm run dev` → `localhost:8787`. Edits, browser reload, repeat. | the inner loop. Where you spend 95% of your time. |
| **qa** | a second mode on the same laptop: `node server.js --port=8788 --data-dir=.qa` and `localhost:8788`. Edits here are *test candidates* you don't want bleeding into dev. | gives you parallel work without a second box. In a real project this is a separate VM; for Buildathon scope it's a second port on the same box, with jobs written to a different directory. |
| **prod** | the VPS. Same code, same `package.json`, same systemd unit. | the thing the demo judge actually hits. |

> This isn't the only way to architect multi-env. In a multi-VM shop, dev/qa/prod are three separate hosts. Here, we're constrained by **one 2 GB VPS for prod** and **one Windows laptop for everything else**, so we model qa as a side-by-side process.

This is the *minimum viable* separation. It still forces every lesson to think about "where does this go?" — and that's the muscle we want for v2+ work (Lesson 15+, post-buildathon).

---

## Step 3.1 — nvm on Windows (`nvm-windows`)

You mentioned Node v26 on the dev box. That's fine for the laptop. The VPS will use Node 24 LTS (release line we'll manage separately via nvm there). To avoid drift:

1. Uninstall any system-wide Node.js (Settings → Apps → "Node.js" → Uninstall). System Node and nvm-installed Node both try to be "the default", and the loser causes you to use `node.exe` from the wrong path.
2. Install `nvm-windows`: download the latest **`nvm-setup.exe`** from [github.com/coreybutler/nvm-windows/releases](https://github.com/coreybutler/nvm-windows/releases).
3. New PowerShell tab:

```powershell
nvm version
# install the two LTS lines we care about
nvm install 26
nvm install 24
# pin per-project via a `.nvmrc` at the workspace root (we'll write one in 3.3)

nvm use 26
node --version     # expect v26.x
npm --version
```

> *Why two Node lines?* The dev box can run the latest dev release; the VPS runs LTS. Running both locally catches the day a feature is `v22-deprecated` and you spot it before deploy.

---

## Step 3.2 — Install Playwright's Chromium (Windows build)

```powershell
cd D:\stuff\ai-misc\_bsh2026\vscode_project01\70
# when there's no package.json yet, use npx.  After L4 we'll have the file.
npx --yes playwright install chromium --only-shell
# ~150 MB; chromium-by-default-launches with --headless=new
```

Sanity check:

```powershell
node -e "(async()=>{const{chromium}=require('playwright');const b=await chromium.launch({headless:true});const v=await b.version();console.log('chromium',v);await b.close()})()"
# → chromium 1XX.0.X.X.X (whatever Playwright pinned)
```

If that prints a version + nothing else, Playwright is healthy on the laptop. If it errors with a missing `.dll` (rare on Win 11), install the [Microsoft Visual C++ Redistributable](https://aka.ms/vs/17/release/vc_redist.x64.exe) and retry.

---

## Step 3.3 — The `mvp/` directory tree (it's empty; this is what we'll fill)

The package.json doesn't exist yet — we create it in Lesson 4 alongside the code. For this lesson, just verify the directory layout the design doc expects:

```
D:\stuff\ai-misc\_bsh2026\vscode_project01\70\   ← workspace root
  mvp\
    docs\         ← design.md, this curriculum, etc.
    app\
      lib\        ← mhtml.js, extract.js, ...  (added in L4)
      views\
        home.html
        dashboard\
      profiles\   ← mac-studio, rtx-3090, generic
      server.js   ← added in L6
      cli.js      ← added in L7
      package.json
    test\         ← golden, render, blocked, etc.
  eBay\
    test01\       ← 33 MB golden (gitignored; later rsynced to VPS)
    test02\       ← 226 MB golden (gitignored; never rsynced)
  deliverable\    ← 3.9 MB golden dataset + dashboard family (committed)
  design\         ← design report (committed)
  scratch\        ← provenance scripts (committed; *.html/*.png ignored)
```

Confirm the paths exist and contain what you expect:

```powershell
Test-Path mvp\docs
Test-Path eBay\test01
Test-Path deliverable
```

If any return `False`, *stop*. The design doc's first implementation step is "verify this tree" before touching code.

---

## Step 3.4 — `.nvmrc` and the first package.json

**`.nvmrc`** at workspace root:

```
26
```

Now open a new PowerShell at the workspace root and:

```powershell
nvm use        # honors .nvmrc
node --version   # → v26.x
```

**`mvp/app/package.json`** (we'll grow this lesson-by-lesson — for L3, just the bare minimum):

```json
{
  "name": "scamshield-concierge",
  "version": "0.0.0",
  "private": true,
  "description": "Logged-out eBay capture → faceted report. MVP for BSH2026 build competition.",
  "engines": {
    "node": ">=24"
  },
  "scripts": {
    "dev": "node server.js",
    "test": "node --test test/",
    "test:golden": "node --test test/golden.test.js",
    "test:blocked": "node --test test/blocked.test.js",
    "test:render": "node --test test/render.test.js"
  },
  "dependencies": {
    "playwright": "^1.63"
  }
}
```

`npm install` from `mvp/app/`:

```powershell
cd mvp\app
npm install
# Playwright is the only runtime dependency — installs in <30s, ~50 MB.
```

> ⚠️ **The pin is real.** `^1.63` is the major-version-pinned line the design doc calls for, because any Chromium bump *might* change the MHTML serializer shape and silently break the parser. We manage that risk with a capture canary (Lesson 7). When the next major appears, you re-run the canary and bump.

---

## Step 3.5 — The offline test suite — what's already in your workspace?

The design doc lists five test files:

1. `unit/` tests (totp, caps, schema tripwire, etc.)
2. `golden.test.js` (non-negotiable gate; uses `eBay/test01`)
3. `replay-rtx.test.js` (uses `eBay/test02`)
4. `render.test.js` (Playwright opens served replay reports)
5. `blocked.test.js` (fixture server; asserts typed errors)
6. *(optional)* `e2e-live.test.js` (real eBay; `SSC_E2E=1`)

In L4/L5/L6 we'll write each of these; for L3, the *only* files that exist yet are the **provenance scripts** in `scratch/` that we'll port into `lib/`. So the offline suite for *this* lesson is short:

```powershell
cd mvp\app
node --test ../test/_sanity.test.js
```

If the test file doesn't exist yet (we haven't written any), create a *placeholder* that proves the runner works and exits green:

```powershell
New-Item -ItemType Directory -Path ..\test -ErrorAction SilentlyContinue
@'
import { test } from "node:test";
import assert from "node:assert/strict";

test("the test runner itself works", () => {
  assert.equal(2 + 2, 4);
});
'@ | Set-Content -Path ..\test\_sanity.test.js -Encoding utf8

node --test ../test/_sanity.test.js
# expect: 1 test, 0 failures
```

> **Save the green output.** Paste it into `notes/L3-checklist.md`.

That's Lesson 3 done. Why "done" is so cheap: we haven't built anything yet, but we've nailed the *environment*, which means every subsequent lesson's "is it my env or my code?" diagnostic is one command.

---

## Step 3.6 — Use-case: running `qa` on the side

This won't matter yet (we have one process), but for the moment we *do* have a second process (e.g. when L5 introduces a fixture server):

```powershell
# terminal A — dev
cd mvp\app
$env:SSC_ENV="dev"; $env:SSC_DATA_DIR=".data/dev"; npm run dev

# terminal B — qa
cd mvp\app
$env:SSC_ENV="qa";  $env:SSC_DATA_DIR=".data/qa"; $env:PORT="8788"; npm run dev
```

The `SSC_*` env vars are read by `lib/config.js` (we write that in L6). For now, just know the pattern exists and is honored from the first commit.

---

## Step 3.7 — VS Code workspace settings (one-time, paid for daily)

Create `.vscode/settings.json` at the workspace root:

```json
{
  "editor.defaultFormatter": "vscode prettier",
  "editor.formatOnSave": true,
  "[javascript]": { "editor.defaultFormatter": "vscode prettier" },
  "[json]": { "editor.defaultFormatter": "vscode prettier" },
  "files.eol": "\n",
  "files.insertFinalNewline": true,
  "files.trimTrailingWhitespace": true,
  "editor.tabSize": 2,
  "terminal.integrated.profiles.windows": {
    "PowerShell (nvm)": {
      "path": "pwsh.exe",
      "args": ["-NoLogo"]
    }
  },
  "extensions.recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "ms-playwright.playwright",
    "github.vscode-pull-request-github",
    "github.vscode-github-actions"
  ]
}
```

Commit it. Everyone who clones the repo gets the same env: line endings, formatter, profile.

---

## Anti-patterns to avoid

- ⛔ **Don't install system Node.js alongside nvm-windows**. The system installer puts `node.exe` *earlier* on PATH than nvm's shim. Always pick one.
- ⛔ **Don't skip `nvm install 24` even though we mostly run 26.** It catches Drift Day.
- ⛔ **Don't write tests against fake data.** Use `eBay/test01` as truth; mock only when the test is about *your* code (e.g. `blocked.test.js` mocks eBay, but golden uses real captures).
- ⛔ **Don't add Prettier opinion settings beyond the listed 5.** Every config bikeshed is a lesson not built.

---

## What "done" means for Lesson 3

Run, in order:

```powershell
cd D:\stuff\ai-misc\_bsh2026\vscode_project01\70
nvm use
node --version                    # v26.x
npm --version
cd mvp\app
npm install
node --test ../test/_sanity.test.js
# 1 test, 0 failures
```

When all five lines produce expected output, save:

```markdown
# L3 Done
- nvm-windows installed; nvm install 26 + nvm install 24
- Playwright Chromium downloaded (--only-shell)
- .nvmrc at workspace root = 26
- mvp/app/package.json committed (Playwright ^1.63)
- npm install green
- node --test on the sanity test = green
- .vscode/settings.json committed
```

Next lesson is the biggest single artifact hour-wise: L4 ports the proven pipeline (`mhtml.js`, `extract.js`, `analyze.js`, `profile.js`) and gets the **golden test green locally**. By the end of it, you have byte-for-byte the same output the design doc specifies, and you didn't touch a browser.

That's the moment it stops being "doc-driven coding" and becomes "the design doc is the spec, and the spec passes." Let me know when you're ready and I'll write L4.
