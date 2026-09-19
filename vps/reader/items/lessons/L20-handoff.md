# Lesson 20 · Operator handoff — onboarding the next person

> **Time budget:** ~6 hrs for a clean handoff · **Audience:** the day *you* get to hand off this app to *someone else*.

---

## What this lesson produces

A transition kit so a new operator can be productive in a week, not a month:

1. **A 30-minute onboarding script** the new person can follow end-to-end.
2. **A `mvp/docs/` complete and discoverable** — all runbooks, design decisions, current state.
3. **A documented "what we *don't* do and why" list** — protects the new operator from re-introducing patterns the team has rejected.
4. **A demo they can show on day 2** to prove they have working knowledge.
5. **A code-reading path** the operator can follow *for an hour a day* until they're caught up.

> *A year from now, you might be "on to the next thing."* This lesson is how the work survives without you.

---

## Step 20.1 — The 30-minute onboarding script (the new operator's first actions)

Day 1, hour 1, in order:

```bash
# 1) Read README + L0
cat README.md
cat lessons/L0-meta.md

# 2) Read the design doc (skim; bookmark the table of contents)
cat mvp/docs/technical-summary.md

# 3) Read the runbook (DEMO)
cat mvp/docs/RUNBOOK-DEMO.md

# 4) Bring up a local copy
cd mvp/app
nvm use 24 || nvm install 24
npm ci
npx playwright install chromium --only-shell
node --test                       # all green
node cli.js replay --dir=../../eBay/test01 --query="mac studio"   # produces data/jobs/<id>/

# 5) Examine the produced report in a browser (the test verified byte-identity)
# open file:///<repo-root>/mvp/app/data/jobs/<id>/report/index.html

# 6) Bring up the dev server
npm run dev
# open http://localhost:8787

# 7) SSH into the VPS
ssh -i ~/.ssh/scamshield_deploy scamshield@<VPS_IP>
bash /opt/scamshield/scripts/status.sh
```

That's the hour. By the end, they have:
- a local environment identical to the team's
- a verified green test suite (the *trust* gate)
- a working local server
- access to the live VPS

If any step fails, they don't have a working environment — that's a different conversation.

---

## Step 20.2 — The code-reading path (an hour a day, in order)

The new operator reads code in this order. *Not* the directory tree; the dependency order:

1. `mvp/app/server.js` (~60 lines) — the entire entry point.
2. `mvp/app/lib/config.js` (~30 lines) — env-driven knobs.
3. `mvp/app/lib/router.js` (~150 lines) — the 7 routes.
4. `mvp/app/lib/orchestrator.js` (~120 lines) — the state machine + EventEmitter.
5. `mvp/app/lib/jobs.js` (~120 lines) — file store + atomic writes.
6. `mvp/app/cli.js` (~80 lines) — the operator CLI; first taste of "same libs."
7. `mvp/app/lib/mhtml.js` (~80 lines) — QP-decode port.
8. `mvp/app/lib/extract.js` (~200 lines) — the s-card regex parser. (Read with the dashboard's data shape in mind.)
9. `mvp/app/lib/relevance.js` (~50 lines) — the inclusion-biased filter.
10. `mvp/app/lib/profile.js` + `profiles/*.json` — pure data + lookup.
11. `mvp/app/lib/analyze.js` — variants, bands, risk. Constants moved out by L4.
12. `mvp/app/lib/report.js` — the 22-field adapter; the byte-identical-asset copy.
13. `mvp/app/lib/capture.js` (~400 lines) — the *only* browser-touching code. The capture state machine.
14. `mvp/app/views/home.html` — the SPA. Inline JS, no framework.
15. `mvp/app/views/dashboard/{index.html, common.css, common.js}` — the dashboard family; golden, byte-identical across jobs.

> **The discipline:** every file is small, has one purpose, and depends only on what's listed above it. A new operator should be comfortable with this codebase after 1–2 weeks of reading 1 file per day.

---

## Step 20.3 — The "what we *don't* do and why" list

This is the *most valuable doc* in the handoff. It protects the new operator from re-introducing patterns the team has rejected, *with reasons*.

`mvp/docs/NON-ADOPTIONS.md` (canonical list):

```markdown
# Non-adoptions (the pattern-anti-pattern catalogue)

## No Express / Fastify / Koa

**Decision:** Use Node's built-in `node:http` for the 7 routes.

**Reasoning:** Each framework is a maintenance surface and a dependency. The
7 routes don't justify the second runtime dependency. We re-evaluate if the
route count grows past ~15, but the "zero-dep ethos" extends here.

## No frameworks in the dashboard

**Decision:** Vanilla JS + HTML + CSS for both SPAs (home, dashboard).

**Reasoning:** Byte-identical asset copy per job (report/ subdir) requires
deterministic, inlinable assets. Bundlers add build steps to a file-copy
pipeline; frameworks add a render step the dashboard doesn't need. The
dashboard is query-agnostic and golden-tested.

## No stealth / anti-detect tooling

**Decision:** Logged-out default, default Playwright UA, no proxies.

**Reasoning:** The mandate. Reinforced by the 2026-09 research: the wall is
*authentication*, not bot detection — stealth wouldn't unlock it anyway. The
honest `HeadlessChrome` UA is accepted residual risk.

## No Redis / Postgres / RabbitMQ

**Decision:** Filesystem is the store. Atomic writes (temp + rename) defend
data integrity.

**Reasoning:** Demo scale + single-flight mean a database adds zero value.
Persisted MHTML is already file-based; analysis is computed once per job;
the job store is a directory. We re-evaluate at 1k+ DAU.

## No automated sign-in

**Decision:** Phase A only — human signs in headed, cookies are reused as-is.

**Reasoning:** Mandate §16. The trust events (password, 2FA, device check)
are not automatable under the design. Phase B (TOTP, scheduled) exists
but remains a Phase B+ feature.

## No `npm run` outside `npm ci` + `npm run dev`

**Decision:** Pinned single runtime dependency: Playwright ^1.63.

**Reasoning:** Major version bumps on Chromium can silently change the MHTML
serializer shape. We pin and re-run the capture canary before bumping.

## No LLM-assisted extraction yet

**Decision:** Regex parser only.

**Reasoning:** v1 works without it; LLM extraction adds cost, latency, and a
new dependency (an LLM transport). The dashboard's `data.js` shape is the
contract; expanding to LLM is a stretch that doesn't affect Buildathon.

## No emojis in production logs

**Decision:** Plain text only.

**Reasoning:** Encoding ambiguity in error-path logs.

## No pre-built Docker images / container registry

**Decision:** Bare-metal systemd on cPanel.

**Reasoning:** 2 GB RAM + Playwright doesn't tolerate container overhead;
debugging is faster when `journalctl -u scamshield` *is* the truth. We
re-evaluate at L17 (multi-VM) when container orchestration pays for itself.

## No `PowerShell` requires Windows-specific tooling

**Decision:** All server-side ops work in Bash + PowerShell-laptop.

**Reasoning:** Bash everywhere we can; PowerShell is a thin wrapper. Both
sides ship from the same scripts.
```

> The new operator reads this once and saves days of "but why didn't you…?" questions.

---

## Step 20.4 — The "current state" doc

A `<two-pages>` document that tells the new operator what's true *today*:

```markdown
# ScamShield Concierge — current state (date)

## What is live

- Production: https://concierge.<your-domain> (TLS via AutoSSL, Apache SSEl proxy).
- Last deploy: v1.0-demo (date); gateway tag v1.0-demo.
- Active credentials: vault-backed via systemd-creds; current rotation policy is "on suspicion of compromise."

## What is in flight

- Phase A (auth) is *optional*. Off by default; toggled via SSC_AUTH_MODE.
- No multi-VM. Single VPS at <VPS_IP>.
- Backups: nightly tar + JetBackup at 04:00Z.
- Last incident: see mvp/docs/incidents/<date>.md (if any).

## What is known-rough

- eBay wall hits every 30–60 jobs in practice (logged in auth-plan.md);
  the app surfaces it as `sign_in_required` and the Recent reports list
  carries a pre-captured demo as fallback.
- 2 GB RAM cgroup is tight at target=200; if OOMs appear, drop to 180 and
  re-test, do NOT raise the box.
- AutoSSL renewal silently failed once on 2026-XX-XX; check the next renewal
  window.

## What's deliberately absent

- No Docker, no Kubernetes, no Vault. (See NON-ADOPTIONS.)
- No auth (Phase A *optional*). No multi-tenancy.
- No LLM extraction. No CAPTCHA solver. (See NON-ADOPTIONS.)
```

Update this monthly; commit it; point the new operator at it on day 1.

---

## Step 20.5 — The first handoff conversation (60 minutes, agenda)

The best handoff is a 1-hour conversation. **Don't skip it:**

```
00:00 — show the live app (a 1-minute demo: submit a query, click around the report)
05:00 — talk about the design doc's principle section
10:00 — show a recent job's JSON (jq .facets; what each status means)
20:00 — show the runbook; walk through it. Ask: "what would you do for X?"
30:00 — break; the new operator runs `status.sh` themselves, lists 5 jobs, and submits a small test query
40:00 — talk about the non-adoptions; *don't argue them*, tell the story behind each
55:00 — Q&A; land on the 2-week reading list (code-reading path)
60:00 — done.  Set up the recurring 30-minute check-in.
```

> The intent isn't *transfer knowledge* — that's impossible in an hour. The intent is *start the conversation that matters* and make it obvious what to ask about on day 8.

---

## Step 20.6 — The "two-week reading rhythm"

Hand the new operator this exact list and tell them to read one file per day:

| Day | File | Goal |
|---|---|---|
| 1 | `README.md` + `lessons/L0-meta.md` | understand the curriculum's shape |
| 2 | `mvp/docs/technical-summary.md` | understand the design surface |
| 3 | `mvp/app/server.js` | the entry point |
| 4 | `mvp/app/lib/router.js` | the 7 routes |
| 5 | `mvp/app/lib/orchestrator.js` | the state machine |
| 6 | `mvp/app/lib/jobs.js` | the file store |
| 7 | `mvp/app/cli.js` | the operator CLI |
| 8 | `mvp/app/lib/capture.js` | the browser; the only state machine you have to *trace carefully* |
| 9 | `mvp/app/lib/extract.js` | the parser |
| 10 | `mvp/app/views/home.html` | the user-facing SPA |
| 11 | `mvp/app/views/dashboard/index.html` | the dashboard |
| 12 | `mvp/docs/NON-ADOPTIONS.md` | the pattern-anti-pattern catalogue |
| 13 | `mvp/docs/incidents/<most recent>.md` | recent pain |
| 14 | (no new file — open questions, ask the predecessor) | meta |

The 14-day rhythm means every file is read at least once, in dependency order. By the end of week 2, the operator can read code and ask intelligent questions.

---

## Step 20.7 — The "trust" signals (what *doesn't* need a password)

> Once the new operator has run the 30-minute onboarding, *what access do they get?*

| Access | When they get it | Why |
|---|---|---|
| `scamshield` SSH (via their own keypair added to `authorized_keys`) | day 1 | they need to ssh in to read logs, restart the unit |
| VPS sudo (limited to `/opt/scamshield/scripts/*.sh`) | day 2 or 3 | they need to restart the unit, run scripts; *not* full wheel |
| `whmapi1` access (cPanel admin) | day 7+ | they need this for cert renewals; NOT before they've read RUNBOOK-DEMO.md |
| GitHub repo write | day 1 (or never — read-only is fine for a handoff role) | if read-only, send PRs; deploy is from their laptop via tag push |
| The `ebay_*` credentials (env vars in vault) | when Phase A is enabled — and only that | rotates easily if compromised |
| The deploy SSH key (CI side) | day 14+ and they take over CI/CD | if it leaks, revoke; this is "blast-radius" sensitive |

> The pattern: **scoped access that grows**. They don't get sudo day 1. They get sudo NOPASSWD to specific systemctl commands on day 2. They get full whmapi1 on day 7. They get the deploy key on day 14. Trust increments as the *2-week reading rhythm* completes.

---

## Step 20.8 — The "you're on your own" checklist (90 days later)

After 90 days, the new operator should:

- [ ] Have run *at least one* deploy from a laptop.
- [ ] Have written *at least one* incident report.
- [ ] Have read all 12+ lessons in the curriculum (L0–L19).
- [ ] Have opened *at least one* PR fixing a parser bug.
- [ ] Have *refused* at least one feature request that conflicted with non-adoptions, with documentation.

If they check all five, the handoff is complete. If not, *that's* the gap — name it, schedule another session.

---

## Step 20.9 — The "the original author was wrong, and that's fine" note

> Add to the bottom of `NON-ADOPTIONS.md`:

```markdown
## Re-evaluation policy

This document is **not** a constitution. It's a record of decisions *as of
the date of writing*. When conditions change (DAU, security, vendor behavior),
re-evaluate.

Triggers that warrant re-evaluation:
- DAU > 5,000 sustained → re-evaluate the "no Redis / Postgres / queue broker" rule.
- Compliance audit (SOC 2, ISO 27001) → re-evaluate the "no Vault" rule (probably).
- eBay wall blocking > 30% of jobs → re-evaluate the "no auth" decision.
- Capture-canary drift > 5% → re-evaluate the Playwright major pin.
- A serious incident in production → update the relevant runbook + postmortem.

Decision record: each re-evaluation is `mvp/docs/decisions/YYYY-MM-DD-<topic>.md`,
signed and committed.
```

> *Hand-off succeeds when the next person can disagree with you — politely, with reasoning — and *nothing breaks*.* That's the goal.

---

## Anti-patterns to avoid

- ⛔ **Don't dump the codebase on the new operator.** The reading rhythm is 1 file/day for a reason.
- ⛔ **Don't grant them the deploy key on day 1.** Trust increments.
- ⛔ **Don't let them fix things before they understand them.** A "quick fix" by a confused new operator creates a worse codebase.
- ⛔ **Don't lose the non-adoptions doc.** It's the most protective thing for the codebase's long-term shape.
- ⛔ **Don't treat the handoff as "I explained it."** Treat it as the start of a *relationship* — the 30-minute weekly check-in is the load-bearing piece.

---

## What "done" means for Lesson 20

1. **`mvp/docs/NON-ADOPTIONS.md`** committed with this lesson's list (or your personalized equivalent).
2. **`mvp/docs/current-state.md`** committed.
3. **The new operator has run the onboarding script** end-to-end and reached `bash /opt/scamshield/scripts/status.sh` showing 7 OKs.
4. **A 60-minute conversation happened.** Not 60 minutes of slideware; 60 minutes of talking through the design and answering real questions.
5. **A recurring check-in is on the calendar** (weekly, 30 min).
6. **At 90 days, the new operator has run a deploy, written an incident report, and read the curriculum.** That's it.

When those are true, the handoff is real. The app will outlive you, which is the actual test of a solopreneur's software.

*Last lesson next: L21 — the demo talk-track (the words you'll say on demo day).*
