# Virtual business card — DIY QR → branded landing page (for the demo)

**Context:** product demo Monday Sep 21, no paper business cards. **Goal:** share
your contact info from your phone in ~5 seconds per person. **Build time
tonight:** Path A (DIY, recommended) ≈ 45–60 min · Path B (an app) ≈ 15 min.
**Written:** 2026-09-20.

---

## TL;DR

**Build it yourself: one static QR code → your own one-page branded landing
page → a "Save contact" button that downloads a vCard.** Total cost $0,
nothing expires, nothing tracks, and it's on-brand — at a buildathon, "I built
my own card stack" is a better conversation than "I have a Blinq subscription."

How it flows at the demo:

```text
your phone (or a print)                    their phone
┌─────────────────────┐                    ┌───────────────────────────┐
│  full-screen QR     │   they scan with   │  browser opens your       │
│  (image saved in    │ ─────────────────▶ │  branded landing page     │
│   Photos)           │      camera        │                           │
└─────────────────────┘                    │  [ Save contact (.vcf) ]  │──▶ added to
                                           │  [ Call ] [ Text ]        │    their
                                           │  [ Email ] [ Product ]    │    Contacts
                                           └───────────────────────────┘
            the QR encodes ONE thing: the page URL
            https://<username>.github.io/card/
```

Why encode the **URL**, not the contact data itself: if the QR held the raw
vCard, every typo or changed number would mean reprinting the QR everywhere.
Pointing at a URL means the page (and the vCard behind the button) can be
updated any time while the QR stays valid forever — the definition of a
**static** QR, and static codes never expire (see Pitfalls).

---

## The three paths at a glance

| | Path A — DIY (recommended) | Path B — card app | Path C — phone-native |
|---|---|---|---|
| What | static QR → your GitHub-Pages page → vCard | Blinq / HiHello / Popl free account | iOS NameDrop, Samsung contact-QR |
| Time | ≈ 45–60 min tonight | ≈ 15 min | 0 min (already on phone) |
| Cost | $0 forever | $0 tier (limits apply) | $0 |
| Branding | your UDL tokens, exact | templated, partially locked | none |
| Risk | none if tested | third-party holds your data; free-tier limits | only works same-ecosystem (iPhone↔iPhone etc.) |

Paths B and C are complements, not either/or — see their sections. **Do Path A,
keep C in your pocket, skip B unless tonight disappears.**

---

## Path A — the DIY build (step by step)

Four artifacts, in this order: **1** the vCard file, **2** the landing page,
**3** hosting, **4** the QR image. Everything below is copy-paste with
placeholders in `[BRACKETS]`.

### A.1 The vCard (`card.vcf`)

The universal "contact card" format every phone understands. Create a plain
text file named `card.vcf` (Windows Notepad is fine; save as UTF-8):

```vcf
BEGIN:VCARD
VERSION:3.0
N:[Last];[First];;;
FN:[First] [Last]
ORG:Coolyvision Inc.
TITLE:Founder & Full-Stack Engineer
TEL;TYPE=CELL:+15555551234
EMAIL:you@example.com
URL:https://<product-or-card-url>
NOTE:ScamShield — deep-research scam checks before the money moves.
END:VCARD
```

Rules: real `+1` phone format; no commas inside fields (commas separate
vCard sub-values); keep NOTE to one line. This file is what "Save contact"
downloads — the phone's Contacts app opens it directly.

### A.2 The landing page (`index.html`)

Self-contained — no CDN, no frameworks, auto dark mode, styled with the
demo app's own UDL tokens (light: bg `#f4f6f9`, ink `#1b2430`, accent
`#0b5cad` — swap freely to match whatever brand you land on):

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>[First] [Last] — Coolyvision Inc.</title>
<style>
  :root { --bg:#f4f6f9; --card:#ffffff; --ink:#1b2430; --muted:#5a6675;
          --line:#dde3ea; --accent:#0b5cad; --good:#0c7a43; }
  @media (prefers-color-scheme: dark) {
    :root { --bg:#0f141b; --card:#161d27; --ink:#e8edf3; --muted:#9aa7b6;
            --line:#263140; --accent:#6db3ff; --good:#5ec98d; } }
  * { box-sizing:border-box; margin:0; }
  body { font-family:system-ui,'Segoe UI',Roboto,Arial,sans-serif;
         background:var(--bg); color:var(--ink); min-height:100vh;
         display:flex; align-items:center; justify-content:center; padding:24px; }
  .card { background:var(--card); border:1px solid var(--line); border-radius:16px;
          max-width:420px; width:100%; padding:28px; text-align:center; }
  .co   { color:var(--muted); font-size:.85rem; letter-spacing:.08em;
          text-transform:uppercase; }
  h1    { font-size:1.6rem; margin:.3rem 0 .1rem; }
  .role { color:var(--muted); margin-bottom:1.4rem; }
  .tag  { color:var(--good); font-weight:600; margin-bottom:1.6rem; }
  a.btn { display:block; padding:14px; margin:10px 0; border-radius:10px;
          background:var(--accent); color:#fff; text-decoration:none;
          font-weight:600; font-size:1.05rem; }
  a.ghost { background:transparent; color:var(--accent);
            border:1px solid var(--line); }
  footer { margin-top:1.2rem; font-size:.8rem; color:var(--muted); }
</style>
</head>
<body>
  <main class="card">
    <div class="co">Coolyvision Inc. · Detroit</div>
    <h1>[First] [Last]</h1>
    <div class="role">Founder &amp; Full-Stack Engineer</div>
    <div class="tag">ScamShield — check before you pay</div>

    <a class="btn" href="card.vcf" download>⬇︎ Save contact</a>
    <a class="btn ghost" href="tel:+15555551234">Call</a>
    <a class="btn ghost" href="sms:+15555551234">Text</a>
    <a class="btn ghost" href="mailto:you@example.com">Email</a>
    <a class="btn ghost" href="https://<your-app>.up.railway.app">Try ScamShield</a>

    <footer>[github.com/you] · [linkedin.com/in/you]</footer>
  </main>
</body>
</html>
```

The page is deliberately one screen tall on a phone — every action one tap.

### A.3 Hosting — GitHub Pages (~10 min)

You are setting up GitHub tonight anyway (deploy-guide Part 0). One rule:
**make this a separate small repo** (`card` or `coolyvision-card`) — do not put
personal contact info inside the repo judges will read.

1. github.com → **New repository** → name `card` → **Public** (Pages on a free
   account requires public) → create.
2. Upload `index.html` + `card.vcf` (repo page → *Add file → Upload files*).
3. **Settings → Pages** → Source: *Deploy from a branch* → Branch: `main`,
   folder `/ (root)` → **Save**.
4. Wait 1–2 minutes. Your page: `https://<username>.github.io/card/`
   (Pages shows the exact URL — copy it; it's what the QR encodes).
5. Test on your own phone before making the QR.

Edits later: change the file, commit — the same URL updates on its own.

### A.4 The QR image — generated offline, never expires (~5 min)

Five lines of Python, no account, no redirect service, nothing to expire:

```bash
pip install "qrcode[pil]"
```

```python
import qrcode
url = "https://<username>.github.io/card/"          # ← your Pages URL
qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_M,
                   box_size=10, border=4)
qr.add_data(url)
qr.make(fit=True)
qr.make_image(fill_color="#1b2430", back_color="white").save("card-qr.png")
```

`border=4` is the required white quiet zone — don't crop it. Because the QR
is **static** (the URL is encoded in the dots themselves), it works forever;
only a *dynamic* QR (a shortlink that redirects through a paid service) can
die when a free plan lapses — that's the trap to avoid (Pitfalls, P-2).

### A.5 Test checklist (actual vs expected — before you trust it)

| # | Test | Expected |
|---|---|---|
| 1 | Scan the PNG from your phone's Photos, full-screen | camera locks on instantly |
| 2 | Open the URL on **an iPhone** (Safari) | page renders; dark mode if phone is dark |
| 3 | Tap **Save contact** | Contacts opens, pre-filled with every vCard field |
| 4 | Same on **an Android** (Chrome) | `.vcf` downloads → opens in Contacts, all fields |
| 5 | Tap Call / Text / Email | dialer / messages / mail app opens correctly |
| 6 | Print the QR, scan the paper from ~1 m | still scans (this is your table-card fallback) |
| 7 | Bad-lighting scan (dim room) | still scans — error-correction M handles this |

If 3 or 4 fails, the vCard has a syntax problem — 99% of the time a comma
in a field or a lost semicolon in the `N:` line.

### A.6 Carrying it tomorrow

- **Primary:** the QR PNG full-screen in Photos — biggest, brightest scan
  target; no app, no login, works on a dead-simple phone.
- **Table/laptop:** print a few 2.5-inch squares (`card-qr.png` + your name +
  "scan for my card") and leave one by the demo laptop — it works while
  you're mid-conversation with someone else.
- **Bonus, since the deck is due Monday 8 AM:** the same technique puts a QR
  on the closing slide — but point *that* one at the product URL, not the
  card. Two QRs, two jobs.

---

## Path B — the card apps (~15 min), if tonight disappears

Verified landscape, 2026: **Blinq**, **HiHello**, and **Popl** are the
established leaders; all three share via QR from a free tier, with NFC gear
as their upsell. Working pick if you go this route: **HiHello** — free tier
shares your card as a QR code, a URL, an email signature, *and a phone
wallet pass* (the wallet pass is genuinely nice: your card lives next to
boarding passes). **Blinq** is the reliability/enterprise-flavored rival.

Trade-offs you accept: your contact data lives on their platform, free tiers
cap cards/features/branding, and the share flow shows their chrome. Fine as a
backup — but Path A owns your brand and costs the same $0.

## Path C — phone-native (already in your pocket, $0 effort)

- **iPhone ↔ iPhone:** hold phones near → **NameDrop** (iOS 17+) exchanges
  contact cards natively. Great when it applies; useless for Android folks.
- **Samsung Contacts** has built-in share-as-QR; some Android skins too.
- **Everyone:** you already have a `card.vcf` — AirDrop / email / text it
  directly when someone asks.

These cover the person standing next to you; the QR page covers everyone
else, every phone, at any distance.

---

## Pitfalls (the short list)

- **P-1 · Public page = public info.** The landing page is reachable by anyone
  with the URL. Mitigations already in the template: `noindex` meta (keeps it
  out of search engines). If you'd rather not publish your cell number, use a
  Google Voice number on the card, or drop the Call/Text buttons and share
  email + links only — decide before you print.
- **P-2 · Never use a "free dynamic QR" service.** Dynamic codes redirect
  through the vendor's server; free plans commonly expire in 30–90 days or
  cap scans — the printed code dies silently. Static codes (A.4) encode the
  URL itself and cannot expire.
- **P-3 · Shorteners track.** Don't wrap the Pages URL in bit.ly etc. — it
  adds a redirect, an expiry risk, and hands scan analytics to a third party
  for zero benefit at this length.
- **P-4 · Keep it out of the judged repo.** Personal contact info in
  `scamshield-demo` is noise for reviewers — the separate `card` repo exists
  for exactly this reason.
- **P-5 · Don't fold the card into the ScamShield app tonight.** Dropping a
  `business-card.html` into `app/content/spas/` would auto-add it to the
  `/apps` menu — cute, but it puts your personal info inside the product and
  changes the demo the night before judging. Revisit after Tuesday if you
  want it.

---

## Tomorrow-morning checklist

1. `card-qr.png` saved to Photos (and lock-screen wallpaper as a fallback).
2. Printed QR square in the bag, one by the demo laptop.
3. Open the page URL on your phone once over cellular — confirms it's live
   and fast on a network that isn't your Wi-Fi.
4. One dry run: scan → save → "yep, you're in my contacts."

---

## Sources (accessed 2026-09-20)

- Digital-card app landscape & free tiers: [Blinq comparison (2026)](https://blinq.me/blog/top-digital-business-cards-compared) · [V1CE 25-tested roundup (Oct 2025)](https://v1ce.co/blog/best-digital-business-cards) · [Mobilo: Blinq vs HiHello (Apr 2026)](https://www.mobilocard.com/post/blinq-vs-hihello) (HiHello: QR / wallet pass / URL / email signature) · [NFC.cool app guide (Feb 2026)](https://nfc.cool/blog/best-digital-business-card-apps-2026)
- Static vs dynamic QR expiry: [Hovercode: static vs dynamic](https://hovercode.com) (static free/permanent, dynamic subscription) · [QRForever: dynamic free codes "often 30–90 day expiry"](https://qrforever.com) · [Jotform free-QR roundup (2026)](https://www.jotform.com)
- vCard 3.0: RFC 2426 (format used by `card.vcf`)
