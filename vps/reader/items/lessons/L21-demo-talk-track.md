# Lesson 21 · The demo talk-track — the words you say in 4 minutes that close the room

> **Time budget:** ~3 hrs rehearsal · **Audience:** the hours of *one* demo.

---

## What this lesson produces

A **2-minute, 4-minute, and 8-minute version** of the same talk — for any audience. The narrative is the same; the depth varies.

> *Most technical demos die at the 90-second mark because the demoer dives into a code path the audience doesn't care about. The fix isn't shorter code; it's a tighter story.*

---

## Step 21.1 — The audience matters first

Before you decide *what* to say, name *who* you're saying it to. The four audience archetypes that show up at the Buildathon judging table:

| Audience | Cares about | Hand them first |
|---|---|---|
| **Engineer / peer** | the parsing, the SSE, the file-based store | the architecture diagram (VA-02) |
| **PM / founder** | the *story* of the app, the wall handling | the user journey (VA-10) |
| **Designer / UX** | the dashboard layout, the typed errors | the layout screenshot at 1440 + the "blocked" card |
| **Security / compliance** | the threat model, the audit chain (L18) | VA-11 |

> If the audience is mixed, lead with the founder story (PM cares) and *make the architecture diagram the silent companion* (engineers look at it; others skim). It's been my experience that the *narrative* wins demos; the diagram wins follow-up questions.

---

## Step 21.2 — The 2-minute version (the default)

This is what you say when the judge says "you have 2 minutes, go."

> **Opening (15 s):**
>
> *"ScamShield Concierge answers one question: 'is this eBay listing priced like the real market, or like a trap?' You type the thing you're looking for — 'RTX 3090', 'Mac Studio M3 Ultra' — and the app drives a real browser through eBay's three search facets: current, completed, and sold. It captures each one as forensic evidence — SHA-256 hashed, timestamped — parses offline, computes an honest price band and scam-risk flags, and serves an interactive report. All between query and report is streamed live over SSE; every failure is reported honestly as a typed error. We never fake success."*

> **The demo (60 s):**
>
> *Open the home page. Submit "RTX 3090". Talk while the SSE timeline fills:*
>
> - *"`capture` — we've launched a fresh Chromium, navigated to eBay."*
> - *"`facet current — we're scrolling through ~200 listings, watching card counts grow as evidence-gating step."*
> - *"`facet completed` — `sign_in_required`."* (point at it) *"Since July 2026, eBay requires sign-in for the completed/sold facets. That's not a bug — it's the wall we expect, and the app reports it as a first-class outcome. The `current` facet is still open to logged-out visitors and continues to populate the dataset."*
> - *"`stage report` — we've built the JSON the dashboard consumes."*
> - *"`done` — here's the report URL."*

> **The takeaway (15 s):**
>
> *"What you just saw: a real browser, real eBay traffic, a typed first-class outcome for the wall, and a sourced report. The dashboard computes the band and the risk score client-side from `data.js`, so any report renders from any `data.js` with zero server work."*

> **The closer (10 s):**
>
> *"Honesty is the feature. We could have hidden the wall and given you a spinner; instead we tell you what eBay actually said. That's the demo."*

Stop. Breathe. Wait for the question.

---

## Step 21.3 — The 4-minute version (the standard)

Same arc as the 2-minute, but with three additions:

> **After opening:** show the *winning query* (the one you rehearsed). Then:
>
> *"Before I run it live, here's the proven reference."* (open the pre-captured fallback from Recent reports) *"This is what success looks like — full 3-facet captures, 24-hour IQR-trimmed band, scam-zone cutoff, the trap-banner lineage."*

> **After the demo run:** show the **two SVGs side-by-side** (VA-03 data flow + VA-04 runtime sequence) at 1024px. Point:
>
> - *"This box is the orchestrator. One EventEmitter feeds both the SSE stream and the persisted event log."*
> - *"Replay invariant: deleting everything except `captures/*.mhtml` and re-running `cli.js replay` regenerates the report from disk with **zero browser** and **zero eBay contact**. That's how we iterate parsers."*

> **At "what we don't do":** (the *non-adoptions* brief)
>
> *"We don't add stealth tooling because the wall is authentication, not bot detection — stealth wouldn't unlock sold data, and fighting PerimeterX-class systems is an arms race a 55-hour build loses. We don't add a database because the data are files (MHTML is 100 MB; the database would just be a slow version of the file). One runtime dependency: Playwright. That's it."*

---

## Step 21.4 — The 8-minute version (the deep-cut)

For technical judges. Everything in 4-minute, plus:

- The **profile system**: drop into `profiles/rtx-3090.json`; show how relevance rules + MSRP table + variant dims are pure data.
- The **capture state machine**: show VA-06; explain why we deliberately don't `waitForLoadState('networkidle')` (eBay telemetry starves it).
- The **commit ladder**: `v0.0-meta → v1.0-demo`. Show the tag history in `git tag -l`; explain why each gate earns its tag.
- The **DR principle**: *"we don't sneak in auth. A human does it. Phase A is optional because the design holds without it."*

End with: *"Let me show you one more thing."* Click on the **Recent reports** link → show a previous job → click the various facets. *"Click a facet; flip a filter. The dashboard is query-agnostic."*

---

## Step 21.5 — The "question you'll be asked" prepared responses

Most common, most useful to have ready:

### Q. "How do you handle anti-bot detection?"

> *"Compliance mandates logged-out + honest pacing. The wall we hit is *authentication*, not bot detection — PerimeterX-class systems mark automation independent of stealth flags. Stealth wouldn't unlock sold data anyway. We treat the wall as a typed first-class outcome and document the architecture decision in mvp/docs/technical-summary.md §16. The mandate was the right call; the data we capture is court-evidence-grade because it's not being collected under false pretenses."*

### Q. "Why no Postgres? Why no Redis?"

> *"Demo scale + single-flight. A job is one folder; analysis is computed once; the event log is mirrored into job.json (capped at 500 events). A database adds dependency, ops surface, and zero functional gain for 0–1k DAU. We re-evaluate at 5k DAU. That's not 'never'; that's 'when the workload justifies it.'"*

### Q. "What happens when eBay changes the markup?"

> *"Three layers of drift defense — cheapest first. The capture module runs a layout probe (s-card vs s-item) before extracting; the schema tripwire checks the 22-field record contract post-extract; and the replay CLI lets us iterate the parser offline against saved MHTML with **zero browser and zero eBay contact**. The capture canary in CI diffs CDP-captured HTML against manual Save-As to catch silent Chromium-serializer drift on Playwright upgrades. The pipeline survives eBay's changes; the dashboard doesn't."*

### Q. "What about authentication? Are you just respecting robots.txt?"

> *"Logged-out by default. Optional Phase A is manual session reuse via persistent Chromium profile — a human signs in once, headed. We never automate a login or solve a challenge. So no, we're not respecting robots.txt (which is unenforceable anyway); we're complying with the spirit of the policy: no circumvention, no proxy rotation, no challenge-solving, no stealth. The auth red lines are documented in NON-ADOPTIONS.md."*

### Q. "How do I trust that this will work tomorrow?"

> *"Three things. First, every byte the app writes has a SHA-256 in its provenance — `job.json` carries timestamps, URLs, response timings, console messages. Second, every successful job's captures are kept on disk (we prune to 20 by default; nightly tar backups carry the long tail). Third, every successful demo is reproducible from those captures via `cli.js replay`. Tomorrow, if eBay is blocking us, the demo still works from the saved captures — that's the *Recent reports* fallback."*

### Q. "What's the catch? What does this break?"

> *"Honestly: it's eBay-shape dependent. If eBay ships a major markup change (the 2026-07-22 wall, the s-item/s-card A/B), we have a few hours of drift-recovery work to do — but no eBay contact, just the parser against the saved MHTML. It's also single-flight by design, which means bursty traffic isn't the strength (1 job at a time, ~90s/job). For the Buildathon scope — closed beta, single user, occasional demo run — that's correct. Scaling to 1k+ DAU is vertical (same code, more RAM, tuned cgroup); multi-VM at 10k+ DAU is L17 territory with the same files-based discipline."*

---

## Step 21.6 — The "show, don't tell" tactics

These 7 micro-tactics win judges who are watching you as much as the app:

| Tactic | What it does |
|---|---|
| **Open in incognito** | removes "your history affected this"; shows the lived experience. |
| **Type the query, don't paste** | proves it's not rigged. |
| **Wait the full SSE timeline** | shows you're not skipping the "interesting part". |
| **Narrate every typed error** | "this is `sign_in_required`" demonstrates you understand it. |
| **Click into a drawer** | shows the data — the price, the seller, the source facet. |
| **Switch to pre-captured fallback** | demonstrates that *honest failure* has a graceful path. |
| **End on the typed-error card** | your close is *not* a clean success; it's a transparent failure mode. |

> The last one is the underrated move. *Ending on a typed error that you explain calmly is more memorable than ending on a clean success.* Judges see clean successes all day. They don't see honest failures often.

---

## Step 21.7 — The "50 questions you might get" cheat sheet

These aren't answers; they're *anti-answers* — what *not* to say.

> ⛔ **Don't lie.** If you don't know, say "I don't know yet, but the design doc notes it as future work" and point at the doc.
>
> ⛔ **Don't bash eBay.** The wall is a feature; the design embraces it. The narrative is compliance-by-design.
>
> ⛔ **Don't oversell.** "We handle a million DAU" when you handle 10 is a credibility crash *immediately*. Honest numbers win.
>
> ⛔ **Don't undersell yourself.** "It's just a weekend project." It's a 55-hour build with a designed architecture. The design doc is right there.
>
> ⛔ **Don't demo without a fallback.** Live demo without a pre-captured report is gambling on a single outcome.
>
> ⛔ **Don't read code aloud.** The architecture diagrams are the explanation; the code is the evidence.
>
> ⛔ **Don't answer tech-stack questions defensively.** "Why no Postgres?" → "Demo scale + zero-dep ethos." Simple. Don't apologize.

---

## Step 21.8 — The 30-second *handshake* version

> Sometimes you get a hallway moment — 30 seconds while walking between tables. The handshake version:

*"ScamShield: you type what you're looking for on eBay, the app drives a real Chromium browser through 3 search facets, captures each as forensic evidence, parses offline, and serves a faceted dashboard with honest price bands. Playwright is our one runtime dependency. eBay blocks sold/completed behind sign-in since July 2026 — we treat it as a typed first-class outcome, not a bug. The data layer is the filesystem; the dashboard computes bands client-side. It's compliance by design — no stealth, no proxy rotation, no challenge-solving. Honest failure is the feature."*

End. Smile. Move on.

---

## Step 21.9 — The "talk-track backup" (when the demo is *not* the right thing)

If something IS broken (the demo isn't going to land):

> *"The live demo is having a moment — let me show you a saved capture from yesterday that demonstrates the same flow. While it loads, here's the architecture diagram. The point I want to make is that the design holds whether or not the live demo works: every report is reproducible from the captured evidence, and the wall we expect to hit is part of the demo."*

Then open the pre-captured fallback. *You haven't lost the room; you've shown resilience.*

---

## Step 21.10 — Print the talk-track

Put the 2-minute version on a 4×6 card, fold it into your wallet, take it out before the demo, glance at it once. Two minutes of rehearsal converts a 5-minute demo into a 90-second one.

```
┌─ 2-minute SCAMSHIELD ─────────────────────────────┐
│                                                    │
│  what is it?                                       │
│   ScamShield Concierge answers: is this eBay       │
│   listing priced like a real market or a trap?     │
│                                                    │
│  who types the query?                              │
│   Anyone. You submit, you read.                    │
│                                                    │
│  what's the wall?                                  │
│   Since July 2026, eBay requires sign-in for       │
│   completed/sold. We treat that as a typed         │
│   first-class outcome, not a bug.                  │
│                                                    │
│  what does the app do?                             │
│   Drives headless Chromium through 3 search       │
│   facets → captures MHTML+PNG with SHA-256 →      │
│   parses offline → honest IQR price bands →       │
│   faceted dashboard. SSE streams it live.         │
│                                                    │
│  what's the dependency story?                      │
│   One: Playwright. node:http vanilla server.       │
│   Filesystem is the store. 22-field data contract. │
│                                                    │
│  what's the closer?                                │
│   Honesty is the feature. We never fake success.   │
│                                                    │
└────────────────────────────────────────────────────┘
```

(Or just keep this PDF on your phone.)

---

## Anti-patterns to avoid

- ⛔ **Don't ramble.** Rehearse the 2-minute version with a stopwatch. If it's 3:30, cut.
- ⛔ **Don't read the architecture diagram aloud.** It's silent support. Refer to it; don't narrate it.
- ⛔ **Don't react to a wall-hit in real-time.** Just say "this is the honest outcome; here's the typed card" and move on.
- ⛔ **Don't apologize for the wall.** It's a feature, not a failure.
- ⛔ **Don't volunteer information not asked for.** The 2-minute version is *tight*; the 8-minute version is *deeper*. Pick the one that fits.
- ⛔ **Don't end the demo without telling them what the next step is.** "Email me at …", or "Try it at https://<sub.domain>".

---

## What "done" means for Lesson 21

1. **The 2-minute talk rehearsed at least 3 times** (with a stopwatch, alone or with a friend).
2. **The 4-minute version rehearsed once**, end-to-end, with a fallback run if the live fails.
3. **The 50-question cheat sheet reviewed once**.
4. **The 4×6 card in your wallet.**
5. **A "what we'd say in 8 minutes" doc** exists even if you don't plan to use it.

> That's the talk-track. *Most of the work is in the rehearsal; the script is just the scaffold.* When you've said it 5 times, you stop needing the card.

---

# 🎤 You've completed the curriculum.

You have:

- 21 lessons with copy-paste-able commands and diagrams
- 13 visual aids that map the system
- 4 milestones (MVP → MLP → v1 → ongoing) and the ladder between
- A talk-track for the day that matters

The rest is you — sitting down, typing the lessons in order, tagging as you go, and shipping.

This is the finish of the v0 of the curriculum. *Future lessons* (v2+ lessons, after Buildathon) come as you need them — and they reuse the same patterns: ASCII + Mermaid in standalone HTML, vocabulary in code, runbook for the morning-of, demo-talk track for the day-of.

Go build. The wall will come; the design holds.

— Mavis
