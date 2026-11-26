# Lift-and-shift: from the Windows workstation to the PowerSpec G914 on Zorin OS 18

*Prepared 2026-11-25. One folder: the packages to carry, the guide to follow, and the record of what was checked.*

## Start here

Open **`G914_Zorin18_Setup_Guide.html`**. Double-click it in Files on Zorin or in Explorer on Windows. It is one file: it needs no internet and no other file. Keep it open on a phone or a second screen while you work.

The guide is written for you as an experienced Windows developer who is new to Linux. It explains each Linux habit as it comes up, names the rookie mistakes, and gives the recovery path for every step that can go wrong.

## What is in this folder

| File | What it is | Use it |
|---|---|---|
| `G914_Zorin18_Setup_Guide.html` | The whole guide as one web page: sections A to H, the kickoff prompts, and sixteen attached documents folded closed until you need them | Read and follow |
| `01_Setup_Guide.md` | The same guide as Markdown, the sixteen documents attached in full at the end | For an agent to read, or for a diff |
| `02_Kickoff_System_Prompts.md` | The kickoff prompt and ten phase prompts | Copy and paste into Claude Code |
| `03_Package_Manifest_and_QC.md` | What each package holds, every check with its result, and what was not checked | When you want the evidence |
| `04_Table_QC_Report.md` | The table quality check of this folder | Reference |
| `zips/g914-lift-and-shift.zip` | The package: installer, your Claude Code and VS Code settings, skills, agents, memory, research toolkit, competition packages | Copy to the G914 |
| `zips/g914-credentials.zip` | Your access token, your Tavily key, the stored sign-in | Copy to the G914 by hand. Never through a cloud drive |
| `SHA256SUMS.txt` | The SHA-256 of both zips | Check the copy arrived intact |
| `SHA256SUMS.docs.txt` | The SHA-256 of every other file in this folder | Reference |
| `kit/` | The installer, the prompts and the manifest, unpacked | Read on Windows before you go |

## The route in six lines

| Step | Do | Where |
|---|---|---|
| 1 | Enter the Kaggle competition, if you have not. The entry deadline in the competition rules is 2026-11-25 23:59 UTC | Guide, section F.1 |
| 2 | Install Zorin OS 18 beside Windows 11. Save the BitLocker recovery key first | Guide, section A |
| 3 | Carry the two zips over, check them, run the installer | Guide, section C |
| 4 | Check VS Code, the Claude Code extension and your keys | Guide, section D |
| 5 | Paste the kickoff prompt and approve each phase | Guide, section E |
| 6 | Live run, local tests, the improvement loop, submission | Guide, section F |

## Three things to know before you start

- **Save the recovery key first.** Windows 11 turns on device encryption by itself on a new PC. Installing a second system is one of the changes that can make Windows ask for that key. Section A, step 1 takes ten minutes.
- **The RTX 5090 needs the `-open` variant of the NVIDIA driver.** Zorin's general advice says the opposite. Section A, step 8 explains, with NVIDIA's own manual as the source.
- **The credentials zip holds live secrets.** Move it on a USB stick, use it once, and delete it. The main zip was searched and contains none.
- **The harness and the model server use two Python environments.** The setup guide of 2026-11-24 puts both in one. On a fresh machine that recipe stops at its own import check. The test sets playbook of the same day splits them, the kickoff prompts already follow it, and section F.2 of the guide says which document to follow where.

## How far this was verified

The installer was run to the end three times in a fresh Ubuntu 24.04 container, with every stage passing each time. The research toolkit's browser scripts were given a Linux back-end and tested in the same container. The web page was checked in a browser at two widths.

Not verified: Zorin OS 18 itself, the NVIDIA driver, a desktop browser window, real keys and sign-ins, and everything that needs the GPU. The G914 is still factory-fresh. Section H.4 of the guide and `03_Package_Manifest_and_QC.md` list exactly what was done and what was not.

---
