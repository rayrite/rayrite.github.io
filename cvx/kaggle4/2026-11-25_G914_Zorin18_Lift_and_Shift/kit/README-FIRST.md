# Start here: what is in this package and what to do with it

This folder moves your work from the old Windows machine to the new PowerSpec G914 running Zorin OS 18. It holds the minimum toolchain for the Kaggle Gemma 4 Developer Agent competition and the files you asked to carry. The step-by-step guide that goes with it is `G914_Zorin18_Setup_Guide.html` (open it in any browser; it needs no internet).

## The four things to do, in order

| Step | What | Where it is explained |
|---|---|---|
| 1 | Prepare Windows and install Zorin OS 18 next to it, from a USB stick | Guide, section A |
| 2 | Copy this folder from the USB stick into your Zorin home folder and run the installer | Guide, section C |
| 3 | Install VS Code's Claude Code extension, put in your keys, paste the kickoff prompt | Guide, sections D and E |
| 4 | Let Claude Code finish the setup: two Python environments, data, model, the gate, the first runs, the live run | Guide, section F |

One rule for step 4, because it overrides one attached document: there are **two** Python environments on purpose. The model server lives in `~/bcf/.venv` and the harness in `~/bcf/.venv-harness`. Wherever the 2026-11-24 setup guide says to activate `~/bcf/.venv` before a harness command, activate `~/bcf/.venv-harness`. The test sets playbook (in `bcf/packages/`) has the recipe, and section F.2 of the guide explains why.

## What is inside

| Folder | What it holds | Where the installer puts it |
|---|---|---|
| `install.sh` | The installer. Eleven stages, each verified, safe to re-run, `--dry-run` shows the plan. Two optional switches: `--with-docker`, `--with-browser-mcps` | Runs in place |
| `SYSTEM_PROMPT_KICKOFF.md` | The kickoff prompt and one prompt per later phase | Read it; paste from it |
| `home/` | Claude Code settings, rules, agents and skills; VS Code settings and extension list; a template with your git name, e-mail and default branch | `~/.claude` and `~/.config/Code/User`. The git template is copied by hand |
| `workspace/` | `research-toolkit`, `toolrecs`, `sysprompts`, `webfetch`, `agent_skills`, `kagglecompmemory`, project skills and settings, your past conversations | `~/46-wide_research_test` |
| `memory/` | Claude Code auto-memory for 34 projects, including the full memory of the research workspace | `~/.claude/projects/<project>/memory` |
| `bcf/packages/` | Ten packages: the BCF brain of 2026-11-23, the patched brain of 2026-11-24, the harness replay and live-run kit of 2026-11-25, the private test sets of 2026-11-25, the test sets playbook of 2026-11-25, the RTX 5090 testing guide, the whitepaper and the two 2026-11-05 studies | `~/bcf/packages` |
| `bcf/wheels/` | The six harness packages (swegemma, adk-submission, adk-eval-core, google-adk 1.36.1 and two dependencies) for the validator environment | `~/bcf/wheels-harness` |
| `kaggle-docs/` | The competition's harness README and the official pages saved as markdown, plus the November 2026 forum intelligence package | `~/bcf/docs` |
| `MANIFEST.tsv` | Every file with its size, SHA-256 and where it came from | Stays here |

## What is not inside, on purpose

| Not carried | Why | What to do |
|---|---|---|
| The competition data package, 21.9 GB | Too big for a zip that also has to be checked; it is a download from Kaggle | Download it on the G914 (guide, section F, phase 3) |
| The model weights, 17 to 18 GB each | Same | Download on the G914 (phase 3) |
| Your secrets | They travel in the separate `g914-credentials.zip`, so you decide whether to copy them | Guide, section C, step 3 |
| Your SSH private key | A private key should not be copied around | Generate a new key on the G914 and add its public half to GitHub (guide, section D) |
| Session transcripts, plugin caches, browser profiles | Large, machine-specific, recreated on first use | Nothing |
| The Windows-only tools (Obscura, REA, Artemis, Browsentic, the Android bridges) | They are Windows programs or depend on Windows devices | Nothing; your rules and skills that describe them are carried |
| Your 13 MCP servers | Each one starts a Windows program | Two of them have Linux equivalents that matter for this work: pass `--with-browser-mcps` and the installer adds chrome-devtools-mcp and playwright-mcp at user scope, as they were. The rest come back only if you reinstall their Windows-only programs, which this project does not need (guide, section D, step 6) |

## Three honest limits

- The installer was **run to the end in a fresh Ubuntu 24.04 container** on 2026-11-25, three times in a row: once as this guide says, once more to prove it recognises its own work, and once with both optional switches. Every stage passed. Zorin OS 18 is built on Ubuntu 24.04, but that test had no desktop, no NVIDIA card and no real sign-ins. **It has not run on Zorin itself**, because the G914 is still factory-fresh. Its first run there is a test of the script as much as of the machine. If a stage fails, the summary names it, the log says why, and `bash install.sh --only <number>` re-runs only that stage.
- The research toolkit's browser scripts used to call Windows programs (PowerShell, `netstat`). They now have a Linux back-end, tested in the same container with a headless Chrome: launch, reuse, a fetch through the recorded browser, and close. What was not tested: a headed window on the Zorin desktop, which is where you would solve a CAPTCHA.
- Files that were edited on Windows sometimes end their lines with the Windows convention. The build of this package converted script files to the Linux convention. If a script ever fails with `$'\r': command not found`, run `sed -i 's/\r$//' <file>`.

## In a hurry

```bash
cd ~/lift/g914-lift-and-shift
bash install.sh --dry-run --credentials ../g914-credentials --with-docker     # look first
bash install.sh --credentials ../g914-credentials --with-docker               # do it
```

Then log out and back in once, so that the docker group applies.
