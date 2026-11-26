# Package manifest and quality record: the G914 lift-and-shift

*Prepared 2026-11-25. This is the evidence behind the guide's section H.4. Every statement below was produced by a command that was run; the command and its output are named.*

## 1. Scope

| Question | Answer |
|---|---|
| What this is | Two zips, an installer, a guide, and the record of what was checked |
| What it is for | Moving a Windows development workflow to a PowerSpec G914 running Zorin OS 18 beside Windows 11, and continuing the Kaggle Gemma 4 Developer Agent competition work there |
| What "minimum toolchain" meant here | Enough to install and test for the competition: the harness environment, the model, the research toolkit, Claude Code with its settings, rules, agents, skills and memory, VS Code with its settings, and the competition packages. Nothing for its own sake |
| Built on | Windows 11, Git Bash, Python 3.12.10, on 2026-11-25 |

## 2. The deliverables

| File | Size | SHA-256 |
|---|---|---|
| `zips/g914-lift-and-shift.zip` | 36,093,604 bytes (34.4 MB) | `2d5d78e8fe862e9302dbf0734eb6c558b2c023a8ddf8521b791efc4d7f9542ef` |
| `zips/g914-credentials.zip` | 5,798 bytes | `ac84d8603d29153c66cf9f4ec0f96194cc0692418330db113e501bc35ae118f3` |
| `G914_Zorin18_Setup_Guide.html` | 588,796 bytes | in `SHA256SUMS.docs.txt` |
| `01_Setup_Guide.md` | 378,640 characters, 4,833 lines | in `SHA256SUMS.docs.txt` |

`SHA256SUMS.txt` holds the two zips, and is the file the guide tells you to carry over and check first. `SHA256SUMS.docs.txt` holds every other file in this folder. On Zorin, `sha256sum -c <file>` checks either.

## 3. What the main zip holds

| Folder or file in the zip | Files | Size | What it holds | Where the installer puts it |
|---|---|---|---|---|
| `workspace/research-toolkit/` | 533 | 42.5 MB | The research toolkit, with its browser drivers | `~/46-wide_research_test/research-toolkit` |
| `bcf/packages/` | 723 | 31.2 MB | Ten competition packages: the brain, validation, scoring, the roadmap, the live-run kit, the private test sets, the test sets playbook, the RTX 5090 guide, the whitepapers | `~/bcf/packages` |
| `home/.claude/` | 752 | 18.8 MB | Claude Code settings translated for Linux, one rule, 49 agents, 103 skills | `~/.claude` |
| `kaggle-docs/` | 92 | 8.4 MB | The harness README, the saved Kaggle pages, the November 2026 intelligence package | `~/bcf/docs` |
| `workspace/sysprompts/` | 40 | 4.2 MB | The `sysprompts` folder of the workspace | `~/46-wide_research_test/sysprompts` |
| `bcf/wheels/` | 6 | 4.0 MB | Six harness wheels for the validator environment | `~/bcf/wheels-harness` |
| `workspace/bcf/` | 14 | 1.5 MB | The `bcf` folder of the workspace | `~/46-wide_research_test/bcf` |
| `memory/projects/` | 396 | 1.2 MB | Claude Code auto-memory for 34 projects | `~/.claude/projects/<project>/memory` |
| `workspace/` | 14 | 0.3 MB | 14 saved conversations | `~/46-wide_research_test` |
| `workspace/agent_skills/` | 45 | 0.3 MB | The `agent_skills` folder of the workspace | `~/46-wide_research_test/agent_skills` |
| `workspace/toolrecs/` | 18 | 0.2 MB | The `toolrecs` folder of the workspace | `~/46-wide_research_test/toolrecs` |
| `workspace/webfetch/` | 1 | 0.2 MB | The `webfetch` folder of the workspace | `~/46-wide_research_test/webfetch` |
| `workspace/.claude/` | 28 | 0.1 MB | The workspace's own project settings and skills | `~/46-wide_research_test/.claude` |
| `workspace/docs/` | 2 | 91 KB | The `docs` folder of the workspace | `~/46-wide_research_test/docs` |
| `workspace/kagglecompmemory/` | 15 | 38 KB | The `kagglecompmemory` folder of the workspace | `~/46-wide_research_test/kagglecompmemory` |
| `install.sh` | 1 | 33 KB | The installer, eleven stages | Runs in place |
| `SYSTEM_PROMPT_KICKOFF.md` | 1 | 16 KB | The kickoff prompt and the ten phase prompts | Read it, paste from it |
| `workspace/deliverables/` | 1 | 8 KB | The inventory of earlier deliverables | `~/46-wide_research_test/deliverables` |
| `README-FIRST.md` | 1 | 6 KB | The package's first page | Read it |
| `home/.config/` | 2 | 2 KB | VS Code settings and the list of 32 extensions | `~/.config/Code/User` |
| `home/gitconfig.template` | 1 | 0 KB | Your git name, e-mail and default branch, as a template | `~/.gitconfig`, copied by hand |
| `MANIFEST.tsv` | 1 | 1 file | Every file with its size, SHA-256 and origin | Stays in the package |

Totals: 2,687 files, 114 MB unpacked. The zip's own `MANIFEST.tsv` lists every file with its size, its SHA-256 and where it came from.

## 4. What was left out on purpose

| Not carried | Why | What to do on the G914 |
|---|---|---|
| The competition data package, 21.9 GB | A download from Kaggle, too big to check as part of a zip | Download it. Guide, section F, phase 3 |
| The FreshSWE-Py data set, about 7 GB | A download from Kaggle, and not this package's to copy | Download it. F9, step 6 |
| The model weights, 17 to 18 GB each | Same as the data | Download them. Phase 3 |
| The SSH private key | A private key should not be copied around | Use GitHub CLI, or generate a new key. Guide, section D, step 7 |
| Session transcripts, plugin caches, browser profiles | Large, machine-specific, recreated on first use | Nothing |
| Eleven of the thirteen MCP servers | Each starts a Windows program or a Windows container | Nothing, unless you want one: guide, section D, step 6 |
| The Windows-only tools: Obscura, REA, Artemis, Browsentic, the Android bridges | Windows programs, or dependent on Windows devices | Nothing. The rules and skills that describe them are carried |
| `bcf/bcf_rayrite_github_io` in the workspace | A mirror of deliverable documents that another run built while this package was being built. It duplicates files that are carried | Nothing |
| Every other folder under `deliverables` and `input` | Not needed for the competition workflow | Nothing |

## 5. Where the secrets are

| Secret | Travels in | Lands in | Mode |
|---|---|---|---|
| Claude Code access token | `g914-credentials.zip` | `~/.claude/settings.json` | Readable by you only (600) |
| Stored Claude Code sign-in | `g914-credentials.zip` | `~/.claude/.credentials.json` | Readable by you only (600) |
| Tavily key | `g914-credentials.zip` | `research-toolkit/.research-config.json` | With the folder |
| Tavily command-line config | `g914-credentials.zip` | `~/.tavily/config.json` | Readable by you only (600) |
| Your original Windows settings, for reference | `g914-credentials.zip` | Nowhere | Reference only |

| Check | Result |
|---|---|
| The main zip was searched for the access token and the Tavily key | Not present in any of its 2,687 files |
| The credentials zip holds exactly the seven expected files | Yes |
| The dry run prints neither secret | Checked against the real values: absent |

**After the installer has run, delete the credentials folder and zip** from the G914 and from the stick. The tokens then exist in their two working places and on the Windows machine.

## 6. The installer: what was checked

### 6.1 On the Windows machine

| Check | Command | Result |
|---|---|---|
| Syntax | `bash -n kit-src/install.sh` | Passes |
| Style | `shellcheck -S warning` | Three notes, all the same false positive: a redirection that `sudo` does not affect, which is the intended behaviour |
| The three Python fragments inside the installer | `python tests/test_snippets.py` | 12 of 12 pass |
| The zips, read as Linux reads them | `python tests/test_zips.py` | 15 of 15 pass |
| The dry run, as if on Zorin OS 18.1 | `bash tests/test_dryrun_zorin.sh` | 13 of 13 checks pass |

### 6.2 On real Linux

A fresh `ubuntu:24.04` container on Docker Desktop, a normal user with `sudo`, false credentials, no desktop and no graphics card. The scripts that ran are `tests/linux_step6_final.sh`, `tests/linux_step7_direct.sh` and `tests/linux_step8_dryrun_footprint.sh` on the shipped zip, and `tests/linux_step1` to `linux_step5` on earlier builds. Their output is kept in `tests/linux-run/`.

| Pass | Command | Result | Seconds |
|---|---|---|---|
| A | `bash install.sh --credentials ../cred` | 11 of 11 stages PASS, exit 0 | 229 |
| B | The same again | Everything recognised as done, 11 of 11 PASS, exit 0 | 13 |
| C | `--with-docker --with-browser-mcps --all-extensions --credentials ../cred` | 11 of 11 PASS, exit 0 | 179 |
| Refusal | As root | Exit 1 | |
| Refusal | With the package's settings file removed | Exit 1 | |
| Refusal | An unknown option | Exit 2 | |

What pass C left behind, each checked with a command:

| Fact | Evidence |
|---|---|
| Docker Engine 29.10.1 from the `noble` repository | `docker --version` |
| The user is in the `docker` group | `getent group docker` shows `docker:995:tester` |
| 32 of 32 VS Code extensions | `code --list-extensions` |
| Both MCP servers registered at user scope | `claude mcp list`: both "Connected"; each answered a first request with its tool list (30 and 25 tools) |
| The settings file | Mode 600, token filled, no placeholder left, no carriage return, hook path rewritten to Linux |
| Skills, agents, rules | 103, 49, 1 |
| Memory | 34 project folders; the one for the workspace under its new Linux name |
| Backups | A backup folder for each run that replaced a file |
| A dry run writes nothing of its own | Every file under the home folder, listed before and after (`tests/linux_step8_dryrun_footprint.sh`, output in `tests/linux-run/container-dryrun-footprint.log`): nothing modified and nothing created in any folder the installer manages, on two dry runs. The only new files were 17 and then 14 that other programs wrote for themselves: 15 and 14 log files of VS Code's command-line tool, which logs each start, and 2 cache files of uv |

The zip that ran in these tests is the one in this folder. Its SHA-256 is `2d5d78e8fe862e9302dbf0734eb6c558b2c023a8ddf8521b791efc4d7f9542ef`. The installer in it:

```text
448329c81f6b92c356c8fa87317829000fa7ea42af8440d8ccb4a8af4e1170e1
```

The installer in the final zip has the same SHA-256. So do the two research toolkit scripts that were tested the same way: `launch-browser.sh` is `5d9e81aa9bc59e32e2c5f1f5184ee677d90092225c5182161a1a85780703df32` and `close-browser.sh` is `0ce3507fe3b99f35df7a0ab4975214793425aa0a9ca29c8f79b48dac1d751473`. The build of the guide stops if any of the three changes after these tests.

### 6.3 What the testing changed

Each of these was found by a test, not by reading. They are listed because they say what the first run on the G914 might still surprise you with.

| Found by | Defect | Fix |
|---|---|---|
| The first Linux run | The installer stopped inside the Docker stage: it relied on the `USER` variable, which that shell did not set, and a missing variable is fatal under `set -u`. The verification stage and the summary never ran | The user name is derived from the system when the variable is absent |
| Reading the same log | A re-run said Docker was "already installed" without ever adding the user to its group | Group membership is checked on every run |
| The first Linux run | The VS Code stage read PASS although no extension had installed: VS Code's launcher asked a yes-or-no question, got no answer, and exited | The launcher's own switch for that question is set, standard input is closed for its calls, and the stage now fails unless the four required extensions are present |
| The reproducible dry-run test | The dry run created two empty folders and said "restored" for things it had not done | A dry run now changes nothing, and says "would" |
| The first Linux run | The preflight reported "Internet: not reachable" when only `curl` was missing | It reports the network, and says nothing about a program it is about to install |
| Reading the toolkit's scripts | The browser launcher and closer called PowerShell and `netstat`, so neither could work on Linux | A Linux back-end for the four process lookups they need. Tested on Linux and re-tested on Windows |
| Comparing settings | Two MCP servers used in this workflow, both browser tools, were not carried | An optional switch adds them at the versions the Windows machine ran |
| A later build | The package grew by 134 files from a website build in progress | That folder is excluded |
| The cross-reference check | Sub-steps such as A.4.1 were bold sentences, not headings, so "step A.4.1" could not be a link | They are headings; 59 step references in the page are links |
| Reading a package written the same day | Section F and the kickoff prompts followed the setup guide's one environment, which stops at its own import check on a fresh machine | Section F and the prompts follow the test sets playbook's two environments. The playbook is carried in the package and attached as F9 to F16 |
| Checking that package's reason | It says a strict resolver refuses vLLM 0.19.1 together with `google-adk` 1.36.1 | True for the wheelhouse's pinned versions. With a free choice of versions, uv resolved both. Section F.2 gives the accurate reason for two environments |
| Checking a repeated claim | This guide said the model's repository is gated | The Hugging Face API says it is not. Corrected in section D, step 7 |

## 7. The research toolkit on Linux

| Behaviour | Windows, before and after the change | Linux, in the container |
|---|---|---|
| Launch a debug browser for a folder | Same | Pass, headless when there is no display |
| Launch again: the same browser is reused, after its ownership is checked | Same | Pass |
| A fetch attaches through the recorded browser and verifies the profile | Same | Pass: "pointer-verified" |
| The kickoff pre-warm | Same | Pass |
| Close all, close by port, close when there is nothing to close | Same | Pass, nothing left running |
| A foreign listener on the wanted port is stepped around and left alone | Not re-tested on Windows | Pass |
| A foreign debug browser is refused, never reused and never killed | Not re-tested on Windows | Pass |
| A stale pointer that names a foreign browser: removed, reported as a takeover | Not re-tested on Windows | Pass, exit code 2 |

The change is in the live toolkit, `research-toolkit/bin/`. The files as they were before are kept in `research-toolkit.backup-2026-11-25-linux-backend/` in the workspace.

## 8. The guide

| Check | Result |
|---|---|
| Tables in the Markdown, with the table quality tool | 1 file(s), 195 table(s), 0 defect(s), 1 prose line(s) containing a pipe (not tables) |
| Cross-references: every "section A.4" and "step A.4.1" against the headings that exist | 237 checked, 0 dangling (`scripts/check_refs.py`) |
| Kickoff and phase prompts | Taken from the one file that ships in the package, so the two cannot drift apart |
| The sixteen attached documents | Copied whole; only their heading levels were moved, to nest inside the guide |
| The page in a browser at 1680 px wide, attachments closed and open | 195 tables, 0 ragged rows, 0 tables cut off, 0 cells overflowing, nothing wider than the window, no duplicate anchor, no broken link, no console message |
| The page in a browser at 885 px wide | The same overflow result, with the widest tables scrolling inside their own box instead of being crushed |
| Prose measure | 704 pixels, about 66 characters a line |
| Interactive parts | Copy buttons (119), contents links that open a folded document, the disk plan, the checklist's memory, open and close all: each exercised |
| Not checked | Printing, in both of its modes. The print style sheet is written but was not run through a printer or a print preview |

## 9. Not verified

| Not tested | Why |
|---|---|
| Zorin OS 18 itself | The G914 is factory-fresh. Ubuntu 24.04, which Zorin 18 is built on, stood in |
| The NVIDIA driver | No NVIDIA card in the test machine |
| A browser window on a desktop | The container had no display |
| The two Python environments on Linux | The harness half of the recipe was built on Windows by the run that wrote the test sets playbook. The server half needs the RTX 5090 |
| Real keys and sign-ins | False values were used, by design |
| Claude Code against your gateway | Needs the real token |
| The installer started from the desktop, or with `sudo` asking for a password | The test user had passwordless `sudo` |
| Everything in the guide's section F | It needs the GPU |

## 10. How it was built, and how to rebuild it

All scripts are in `scratch/2026-11-25-g914-lift-and-shift/`. Run them from that folder, in this order.

| Step | Command | Writes |
|---|---|---|
| 1 | `python -X utf8 scripts/build_package.py` | The stage, both zips, `SHA256SUMS.txt`, `MANIFEST.tsv`, `build_result.json` |
| 2 | `python -X utf8 tests/test_snippets.py .` | Results on screen |
| 3 | `python -X utf8 tests/test_zips.py <deliverables folder>` | Results on screen |
| 4 | `bash tests/test_dryrun_zorin.sh .` | Results on screen, output in `tests/dryrun-zorin/` |
| 5 | With Docker running: `tests/linux_container_setup.sh`, `tests/linux_fake_credentials.sh`, then `tests/linux_step6_final.sh` inside a fresh `ubuntu:24.04` container | `tests/linux-run/` |
| 6 | `python -X utf8 scripts/build_guide.py` | `01_Setup_Guide.md` and `G914_Zorin18_Setup_Guide.html` |
| 7 | `python -I -X utf8 scripts/check_refs.py <deliverables folder>/01_Setup_Guide.md` | Results on screen |
| 8 | `python -I -X utf8 scripts/write_qc_report.py <deliverables folder>` | `04_Table_QC_Report.md` |

Step 6 refuses to run if the installer or the two toolkit scripts no longer match the versions that were tested in the container. If you change one of them, run step 5 again and update the three hashes at the top of `scripts/build_guide.py`.

---
