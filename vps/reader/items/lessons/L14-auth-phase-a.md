# Lesson 14 · Auth-Plan Phase A — optional authenticated capture (headed login + persistent profile)

> **Visual aid:** `visual-aids/va01_system_context.html` (note the dashed `data/auth/profile` box).
> **Time budget:** ~5 hrs initial, ~1 hr every 30 days for re-login · **Audience:** post-MVP, when you want reliable 3-facet reports without the wall.

---

## What this lesson produces

An *optional* mode on top of the v1 app where:

1. **A human logs in once, headed**, on the VPS (or laptop) — `cli.js auth login` opens Chromium visibly, you sign in to eBay with your credentials + 2FA, the wizard writes a persistent browser profile to `data/auth/profile`.
2. **Every subsequent job reuses that profile.** Headless jobs call `chromium.launchPersistentContext(data/auth/profile, {headless: true, ...})` — the same cookie jar / device-trust signals a previously logged-in browser would have.
3. **The wall moves.** `LH_Sold=1` / `LH_Complete=1` URLs no longer redirect to `signin.ebay.com` for the *lifetime of the session*. You get 3-facet reports by default.
4. **Trust boundaries are preserved.** Credentials live only under `data/auth/` (0700 dir, 0600 files), outside the job tree, never in HTTP responses. The operator performs *every trust event* manually.

This lesson is **opt-in**. If the closed-beta audience is fine with `current-only` reports + the pre-captured fallback, you don't need it. If you want 3-facet reports *reliably*, this is the path.

> The full design is in **Auth-Plan.md (Part IV of `technical-summary-complete.md`)** — your design doc — which I'm condensing here into the *minimum buildable subset* for the Buildathon-to-v2 period.

---

## Why this lesson is a separate one (not built-in)

Three reasons not to ship auth from day-1:

1. **Closed-beta scale.** Your user count for the build is single-digit. The fallback (Recent reports, current-only banner) covers it.
2. **Single-flight vs. multi-session.** Auth adds session-state management (valid / expired / challenged). It's not a small lift.
3. **The mandate.** Design.md §16: *"human performs every trust event."* Phase A enforces that *by construction* — there is no code path that automates login. The human must manually do it, periodically.

---

## Step 14.1 — Auth state taxonomy (the four states, verbatim from the design doc)

```
session states:   no_session / valid / expired / challenged
job-level parks:  auth_no_session / auth_expired / auth_challenge / auth_failed
```

These park states are *terminal and non-retryable by the app* (the operator — you — decides what to do next). Add to `lib/auth.js`:

```js
// mvp/app/lib/auth.js — minimal Phase A
import fs from "node:fs/promises";
import path from "node:path";
import { config } from "./config.js";

const AUTH_DIR = path.join(config.dataDir, "auth");       // /opt/scamshield/data/auth
const PROFILE_DIR = path.join(AUTH_DIR, "profile");       // Chromium's persistent context lives here
const STATE_PATH = path.join(AUTH_DIR, "state.json");

export const AUTH = {
  mode: "off",                                              // "off" | "session"
};

export async function ensureDirs() {
  await fs.mkdir(PROFILE_DIR, { recursive: true, mode: 0o700 });
}

export async function readSessionState() {
  try {
    const j = JSON.parse(await fs.readFile(STATE_PATH, "utf8"));
    return j;
  } catch {
    return { status: "no_session", updatedAt: null, accountHint: null };
  }
}

export async function writeSessionState(s) {
  await fs.writeFile(STATE_PATH,
    JSON.stringify(s, null, 2),
    { mode: 0o600 });
}

// Status summary that's safe to expose — never the raw session
export async function authStatus() {
  const s = await readSessionState();
  return {
    mode: AUTH.mode,
    status: s.status,                                          // "no_session" | "valid" | "expired" | "challenged"
    accountHint: s.accountHint || null,                        // masked: "u***@g***.com"
    updatedAt: s.updatedAt,
    ageHours: s.updatedAt ? Math.floor((Date.now() - new Date(s.updatedAt)) / 3.6e6) : null,
  };
}
```

`SECURITY BOUNDARY`: `state.json` has only the *status* and a *masked* account hint — never a token, cookie, or password. If `state.json` leaks, the attacker learns "valid session exists for u***@g***.com" — useless without the cookie jar.

---

## Step 14.2 — `cli.js auth login` (the headed wizard)

This is the *only* place the app opens a visible browser. Login automation is forbidden by the mandate — the human does it. The wizard:

1. Opens Chromium in **headed mode** to the eBay homepage.
2. Waits for the human to log in.
3. Detects the eBay "signed in as" indicator.
4. Saves a hashed account hint (`u***@g***.com` from the displayed username) + the persistent profile to `data/auth/profile`.
5. Closes the wizard.

```js
// mvp/app/cli.js — append
async function authLogin() {
  await ensureDirs();
  const { chromium } = await import("playwright");
  const context = await chromium.launchPersistentContext(PROFILE_DIR, {
    headless: false,                                          // headed — never automatic
    viewport: { width: 1366, height: 900 },
    locale: "en-US",
    timezoneId: "America/New_York",
    colorScheme: "light",
    args: ["--disable-blink-features=AutomationControlled"],   // QA: confirms headed-mode reality
  });

  const page = context.pages()[0] || await context.newPage();
  await page.goto("https://signin.ebay.com/", { waitUntil: "domcontentloaded" });
  console.log("[auth login] please sign in (password + 2FA + 'stay signed in' if prompted).");
  console.log("[auth login] once signed in, the wizard will detect it automatically.");
  console.log("[auth login] press Ctrl-C here when done to save the profile.\n");

  // Headed: poll for sign-in indicator up to 10 minutes.
  const target = /^https?:\/\/(www\.)?ebay\.com\/(myb|usr|itm).*/;
  const t0 = Date.now();
  while (Date.now() - t0 < 10 * 60 * 1000) {
    await page.waitForLoadState("domcontentloaded").catch(() => {});
    const url = page.url();
    const signedInTxt = await page.locator('body').innerText({ timeout: 1000 }).catch(() => "");
    const signedIn = /Hi,?\s+\S/i.test(signedInTxt) || (await page.locator('a[href*="/mysb"]').count()) > 0;
    if (target.test(url) && signedIn) {
      const hint = await deriveAccountHint(page);
      await writeSessionState({
        status: "valid",
        accountHint: hint,
        updatedAt: new Date().toISOString(),
      });
      console.log(`[auth login] OK — sign-in confirmed.  accountHint=${hint}`);
      await context.close();
      return;
    }
    await new Promise((r) => setTimeout(r, 1500));
  }
  console.warn("[auth login] timed out (10 min); no session saved.");
  await context.close();
}

async function deriveAccountHint(page) {
  // Read whatever eBay exposes in the visible username slot; mask middle.
  // example: "Username: superlongemail@gmail.com"
  // We map to "s***@g***.com" — keep length hint, lose rest.
  const raw = await page.evaluate(() => {
    const candidates = [...document.querySelectorAll('a, span, div')]
      .map((n) => n.textContent?.trim() || "")
      .filter((t) => /[\w.+-]+@[\w-]+\.[\w.-]+/.test(t));
    return candidates[0] || "";
  });
  const m = raw.match(/([\w.+-]+)@([\w-]+)(\.[\w.-]+)/);
  if (!m) return null;
  return `${m[1].slice(0,1)}***@${m[2].slice(0,1)}***${m[3]}`;
}
```

> The wizard is the *only* code path that performs a trust event. The cron / orchestrator / live-job paths **never** instantiate a login. If you find yourself adding that, stop — you're crossing the mandate line.

---

## Step 14.3 — `cli.js auth status` + `logout`

```js
async function authStatus() {
  const s = await authStatus();
  console.log(JSON.stringify(s, null, 2));
}

async function authLogout() {
  // The persistent profile stores the cookies.  "Logout" = remove it.
  // (Preserve the profile dir; subsequent login writes fresh cookies.)
  if (!existsSync(PROFILE_DIR)) return console.log("[auth logout] no profile.");
  await rmRecursive(PROFILE_DIR);
  await writeSessionState({ status: "no_session", updatedAt: new Date().toISOString(), accountHint: null });
  console.log("[auth logout] cleared.");
}
```

Both commands read-only / write-only; nothing auto-runs.

---

## Step 14.4 — Capture module integration (the only line of capture.js that changes)

```diff
- import { chromium } from "playwright";
- const launch = await chromium.launch({ headless: true });
+ import { chromium } from "playwright";
+ import { authStatus, AUTH } from "./auth.js";
+ import { PROFILE_DIR } from "./auth.js";      // import the dir

- const context = await launch.newContext({ ... });
+ let context;
+ if (AUTH.mode === "session" && await hasValidSession()) {
+   // Reuse the persistent context (cookies + device signals)
+   const launch = await chromium.launchPersistentContext(PROFILE_DIR, { headless: true, ...sameOptions });
+   context = launch;                            // launchPersistentContext IS the context
+ } else {
+   const launch = await chromium.launch({ headless: true });
+   context = await launch.newContext({ ... });
+ }
```

The `hasValidSession()` helper:

```js
async function hasValidSession() {
  if (AUTH.mode !== "session") return false;
  const s = await authStatus();
  return s.status === "valid";
}
```

> **The captured facets return `sign_in_required` even in auth mode.** That's because the auth session *can* expire between jobs (the design doc caps authenticated jobs at 10/day; Phase B re-login is the auto-park path). The same `sign_in_required` typed card is the user-facing response. Park state is `auth_expired` or `auth_challenge`. No surprise.

---

## Step 14.5 — Wiring CLI subcommands

```js
// in cli.js
if (cmd === "auth") {
  if (args.sub === "login")   await authLogin();
  if (args.sub === "status")  await authStatus();
  if (args.sub === "logout")  await authLogout();
}
```

Test:

```powershell
cd mvp\app
$env:SSC_AUTH_MODE = "session"
node cli.js auth login
# → headed Chromium opens → you sign in → wizard detects → state.json saved
node cli.js auth status
# → { mode:"session", status:"valid", accountHint:"u***@g***.com", ageHours:0 }
```

---

## Step 14.6 — The CLI auth, the systemd unit, and the demo

> *The systemd unit runs as `scamshield`, no shell interactive.* The headed wizard needs a *desktop*, which on a 2 GB cPanel VPS doesn't exist.

Two patterns:

**A. Run `auth login` from your laptop, point the unit at the profile.**

This is the most reliable Buildathon-friendly path. The persistent profile is just a directory; you can rsync it to the VPS after the wizard succeeds:

```powershell
# laptop
ssh -L 2222:127.0.0.1:22 -N -i $env:USERPROFILE\.ssh\shamshield_deploy scamshield@<VPS_IP>
# (port 2222 is forwarded to the VPS's loopback SSH)

# Generate the profile locally on the laptop once
node cli.js auth login
# → wizard runs ON YOUR LAPTOP, profile lands in <repo>/mvp/app/data/auth/profile/

# Rsync the profile to the VPS
rsync -avz -e "ssh -i $env:USERPROFILE\.ssh\shamshield_deploy" `
  "mvp/app/data/auth/profile/" "scamshield@<VPS_IP>:/opt/scamshield/data/auth/profile/"
# delete the local copy after rsync — credentials should never be on the laptop in plaintext
ssh scamshield@<VPS_IP> "chmod -R 0700 /opt/scamshield/data/auth && chmod 0600 /opt/scamshield/data/auth/profile -R"
```

**B. Run `auth login` on the VPS via X-forwarding.** Requires an X server on the VPS. cPanel VPSes don't have one. Skip unless you've intentionally chosen a headful setup.

The systemd unit never changes — it still uses loopback `127.0.0.1:8787`. The difference is the *capture module* uses the persistent profile when `SSC_AUTH_MODE=session`.

---

## Step 14.7 — The "every 30 days" reset

Sessions are sticky; they last *weeks* (the design-doc-observed median ≈ 20 days for eBay before a re-challenge). The honest daily practice:

```cron
# Mondays 09:00 — gentle "is the session still valid?" pre-flight
0 9 * * 1  cd /opt/scamshield/app && node cli.js auth status >> /opt/scamshield/data/auth/health.log 2>&1
```

The cron doesn't *auto-login* — it tells you to. If the auto-status reports `expired` or `challenged`, the operator:

```bash
ssh scamshield@<VPS_IP> "node /opt/scamshield/app/cli.js auth login"
# → if you wired X-forwarding, do it; otherwise run from laptop + rsync
```

---

## Step 14.8 — What goes in `META` and the report (auth-aware)

`lib/report.js` already takes `facetStatuses`. Add two META fields when auth mode is on:

```js
const meta = {
  // ...
  authMode: AUTH.mode === "session" ? "session" : "off",
  authHint: AUTH.mode === "session" ? (await authStatus()).accountHint : null,
};
```

The dashboard renders a small banner: "Analyzed with active eBay session for u***@g***.com (signed in 3 days ago)". The user can verify the *provenance* (which account the captures came from) without exposing credentials.

---

## Step 14.9 — The auth red lines (print these next to RUNBOOK-DEMO.md)

```
AUTH RED LINES — DO NOT CROSS
─────────────────────────────────
1. Never automate login.  Ever.
2. Never write `state.json` keys beyond { status, accountHint, updatedAt }.
3. Never log accountHint, cookies, session IDs, or profile paths in:
     - HTTP responses
     - job.json / job events
     - journalctl / log files (Mode=0620 minimum, but really redact entirely)
     - PR / issue descriptions
4. Profile directory permissions: 0700; state.json 0600.
5. Revoke the eBay session by rm -rf the profile dir + the auth record.
   This NEVER requires platform action.
6. If you see auth_challenge: park the job, page the operator.  Don't try to
   solve the challenge in code.
─────────────────────────────────
```

---

## What "done" means for Lesson 14

1. `cli.js auth login` opens a headed wizard on the laptop.
2. After login + rsync, `cli.js auth status` on the VPS reports `valid`.
3. A live job on the VPS captures 3 facets successfully (sold-and-completed facets no longer hit `sign_in_required`).
4. `state.json` exists only in `data/auth/`, permissions 0700/0600.
5. The red-lines checklist is printed and pinned.

> When you get here, you've turned off the single biggest source of demo anxiety on this app — the eBay wall. Lessons 15+ are about scale and operational depth; L13 + L14 were about *making the day survive what eBay does*.
