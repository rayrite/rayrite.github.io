BUSINESS CARD KIT — Ray D. Wright, II / Coolyvision Inc.
=========================================================
(companion to ../VIRTUAL-BUSINESS-CARD-2026-09-20.md — that doc
explains the why; this folder is the finished, filled-in build)

FILES IN THIS FOLDER
--------------------
card.vcf      your contact card (vCard 3.0, RFC 2426-compliant).
              Verified: CRLF line endings, comma escaped, "II" in the
              suffix slot, phone in +1 E.164 format.
index.html    the branded landing page (ScamShield UDL tokens, auto
              dark mode, noindex). Buttons: Save contact / Call /
              Text / Email. The "Try ScamShield" product button is
              COMMENTED OUT at the bottom of the card — uncomment and
              fill in the Railway URL when the deploy is live.
make-qr.py    generates card-qr.png (static QR -> the page URL).
              Edit PAGE_URL inside after GitHub Pages is live.

WHAT'S LEFT (IN ORDER) — ~15 MINUTES
------------------------------------
1. github.com -> New repository -> name: card -> Public -> Create.
   (Separate repo on purpose: keeps personal contact info out of
    the judged scamshield-demo repo.)

2. In the new repo: "Add file -> Upload files" -> upload BOTH
   card.vcf and index.html -> Commit changes.

3. Repo Settings -> Pages -> Source: Deploy from a branch ->
   Branch: main, folder: / (root) -> Save.

4. Wait 1-2 minutes. Pages shows your URL:
      https://<username>.github.io/card/
   Test it on your phone first — page renders, "Save contact"
   opens Contacts with all fields.

5. Open make-qr.py, replace USERNAME in PAGE_URL with your real
   GitHub username. Save.

6. In a terminal (any folder with Python):
      pip install "qrcode[pil]"
      python make-qr.py
   -> prints [ok] card-qr.png -> encodes <your URL>
   -> save card-qr.png to your phone's Photos.

7. Test: full-screen the QR, scan with a second phone, tap
   "Save contact", confirm the contact lands with name/company/
   title/cell/email/note. (Full 7-step checklist: section A.5
   of the main doc.)

RESCUE NOTES
------------
- card.vcf must keep CRLF line endings. If Windows Notepad or an
  editor re-saves it and phones stop reading it, regenerate with
  LF-only fix by re-saving with Unix line endings or re-copying
  this file from the kit.
- The white margin around the QR (border=4) is required — never
  crop it when printing.
- QR is STATIC: it encodes the page URL itself, so it never
  expires. To change your info later, edit index.html or card.vcf
  in the GitHub repo — same URL, same QR, forever.
