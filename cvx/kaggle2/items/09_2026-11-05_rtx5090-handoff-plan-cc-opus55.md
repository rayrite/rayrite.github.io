# COMBINED MARKDOWN - combine

_Generated 2026-11-05 17:38:05 | 6 files | folder: D:\stuff\docs\taylor_fv\github\rayrite.github.io\cvx\kaggle2\items\combine_

## Contents

1. 00_README-cc-opus55h.md
2. 01_Handoff_Brief.md
3. 02_Runbook_5090.md
4. 03_Kickoff_Prompt_for_Claude.md
5. 04_BCF_Change_Log_2026-11-05.md
6. 05_Slot_Plan_2026-11-06_to_2026-12-02.md

---

<!-- ====================================================================== -->
<!-- FILE: 00_README-cc-opus55h.md -->
<!-- ====================================================================== -->

# Handoff package: laptop → RTX 5090 PC (revision of 2026-11-05)

**Supersedes `2026-10-27_Handoff_to_5090/`.** This revision applies the 11-05 forum-intel actions to BCF:
- **A1: no skills in scorer bundles.**
- New BCF-31B bundle **BCF31-v1a** and E4B anchor **S0 r2**.
- 12 h projection with the scorer slowdown k, plus watchdog and trace counters.
- One shared submission plan for both tracks.

Nothing here has run on a GPU or been submitted.

## 1. Contents

| Path | What |
|---|---|
| [01_Handoff_Brief.md](01_Handoff_Brief.md) | What changed since 10-27, status flags, decisions, bundles, risks. **Read first** |
| [02_Runbook_5090.md](02_Runbook_5090.md) | Steps on the 5090: setup (skip if done) → pre-flight → validate → compiled-tool check → dry runs → projection → report |
| [03_Kickoff_Prompt_for_Claude.md](03_Kickoff_Prompt_for_Claude.md) | The first message to paste into Claude Code on the 5090 PC |
| [04_BCF_Change_Log_2026-11-05.md](04_BCF_Change_Log_2026-11-05.md) | Status of every action A0–A9, the A1 evidence, design diff BCF-v1 → v1a, S0 → S0 r2, gates G-SK and Track G |
| [05_Slot_Plan_2026-11-06_to_2026-12-02.md](05_Slot_Plan_2026-11-06_to_2026-12-02.md) | Shared queue: about 14 cycles; freeze on 11-22; last submission 11-27/28 |
| `bundles/S0_r2/` and `bundles/submission_S0_r2_draft.zip` | E4B anchor, 6 tools, 5 min / 24 calls. Pre-flight PASS. sha256 `b7d635d46f1fe0d4833327828bcf1071e419088a6b82c0438f0688a5b812120e` |
| `bundles/BCF31_v1a/` and `bundles/submission_BCF31_v1a_draft.zip` | 31B, 6 tools, no skills, 7 min / 28 calls. Pre-flight PASS. sha256 `062277c1ae9a3b756fa9eb5520ac83b8104b65c62df535489534b3a4fe001fa2` |
| `tools/` | `preflight_static.py` (A1/A9), `project_12h.py` (new), `40_local_eval.py` (replaces `40_local_eval_e4b.py`), `list_compiled_tools.py` (new), `dry_run_tasks_20.txt` (3 network-dependent requests tasks swapped), `build_zip.py`, `20_fetch_assets_e4b.sh`, `render_transcript.py` |
| `reports/intel_20261105-2/` | Copy of the 11-05 forum intel (00–05; raw JSON and scripts stay in `input/kagglecomp/intel_20261105-2/`) |
| `reports/2026-10-27/` | Copies of the 10-27 reports and the BCF-v1 design, with the 11-05 banners. Some internal links point to the originals in the project root |
| `reports/evidence/adk_1.36.1_skill_toolset.py` | google-adk v1.36.1 source (Apache-2.0) that shows the `run_skill_script` array schema (A1 evidence) |
| `setup_guide_06/` | The 10-01 WSL2 + wheelhouse + local-eval guide and scripts (unchanged) |
| `memory/` | Claude Code memory files, refreshed 11-05 (install as in §3) |
| `transcript/` | This session's export (`session-export_2026-11-05.zip`) and a readable rendering. The 10-27 transcript stays in the old package |

## 2. Transfer checklist

| # | Item | Done |
|---|---|---|
| 1 | Copy this folder (or a ZIP of it) to the 5090 PC, into the project root | ☐ |
| 2 | If the 10-27 transfer never happened: copy the project folder and the 21.9 GB data ZIP (runbook §0) | ☐ |
| 3 | Install or refresh the memory files (§3) | ☐ |
| 4 | Make sure `~/.kaggle/kaggle.json` exists in WSL (created by the user) | ☐ |
| 5 | **A0:** check *My Submissions* on Kaggle for a pending or stuck BCF run | ☐ |
| 6 | Open Claude Code in the project root and paste the kickoff prompt (03) | ☐ |

## 3. Installing the memory files on the 5090 PC

Copy every file from `memory/` (including `MEMORY.md`) to:

```text
C:\Users\<you>\.claude\projects\D--stuff-ai-misc--bsh2026-vscode-project01-101b-Kaggle-claude\memory\
```

Overwrite the copies installed from the 10-27 package. The new files are:
- `forum-intel-2026-11-05.md`
- `bcf-a1-no-skills-2026-11-05.md`

`MEMORY.md`, `kaggle-forum-scrape-api.md` and `machines-and-phase0-handoff.md` were also updated.

If the project lives at a different path, open Claude Code there once and look under `~\.claude\projects\` for the new folder name.

## 4. Standing constraints

- **No Kaggle submission and no GPU rental without asking the user first.** AMBER projections need an explicit OK.
- No forum posts to the hosts.
- The Kaggle token is created by the user and never pasted into chat.


---

<!-- ====================================================================== -->
<!-- FILE: 01_Handoff_Brief.md -->
<!-- ====================================================================== -->

# 01 — Handoff brief, revision of 2026-11-05 (laptop → RTX 5090 PC)

*Updates the 10-27 brief (`2026-10-27_Handoff_to_5090/01_Handoff_Brief.md`). Written on the laptop (GTX 1060, cannot serve models). Read this first on the 5090 PC.*

## 1. What changed since 10-27

| Area | 10-27 | 11-05 |
|---|---|---|
| Forum and LB intel | Sweep 10-12 → 10-27 | Sweep 10-31 → 11-05: `input/kagglecomp/intel_20261105-2/` (copy in `reports/intel_20261105-2/`) |
| Host activity | Rulings on 10-20 / 10-24 | **No staff posts since 10-15**; every new question is unanswered |
| Scorer risk | Parser hang known for malformed arrays | Hang reproduced on **ordinary** `run_skill_script` arguments. Declaring any skill exposes that tool (ADK 1.36.1 source) → **A1: no skills in scorer bundles** |
| Time budget | p50/p90 × 125 tasks | Scorer about **1.6–1.7× slower** than a local Blackwell GPU (3 tasks at a time). Public 8 min / 28 calls is at the 12 h edge. New `project_12h.py` (GREEN/AMBER/RED at k = 1.7) |
| Queue | About 22–25 h | **18–32 h**; stuck runs cannot be cancelled. One pending slot is shared by both tracks |
| BCF-31B | BCF-v1 with skills `bcf-locate` / `bcf-check` | **BCF31-v1a**: 6 tools, no skills, 7 min / 28 calls / 80 turns / 180 s, thinking 4096 |
| E4B anchor | S0 | **S0 r2**: same budgets, prompt fixes (malformed edit, 150-line reads, Done. stop rule) |
| Tools | `preflight_static.py`, `40_local_eval_e4b.py` | Pre-flight with A1/A9 checks; `40_local_eval.py` for any model, with watchdog and trace counters; `project_12h.py`; `list_compiled_tools.py` |
| Slot plan | Per-track weekly counts | **One shared queue**, about 14 cycles; last submission **11-27/28** ([05](05_Slot_Plan_2026-11-06_to_2026-12-02.md)) |
| LB, 11-05 | 3,916 teams; top 0.24 | 4,835 teams. Top 0.29 (Yurnero). 10 teams at 0.24 or above. Medal lines: gold 0.22 (rank 19), silver 0.20 (rank 241), bronze 0.18 (rank 483). Small-model board top 0.10 (12 teams) |

The full list of changes, with evidence, is in [04_BCF_Change_Log_2026-11-05.md](04_BCF_Change_Log_2026-11-05.md).

## 2. Status flags

1. **Coolyvision is not on the public LB (11-05, about 22:05 UTC).** Nothing from BCF has scored. Before anything else, the user checks *My Submissions* (A0). A run that is pending or stuck blocks the only slot.
2. **Phase 0 status on the 5090 is unknown from the laptop.** If the 10-27 Phase 0 was run, keep its results (environment, timings, S0 findings) and run only the new parts: runbook §5–9 with the r2 and v1a bundles and the new tools.
3. **Nothing in this package has run on a GPU.** `40_local_eval.py` (full path) and `list_compiled_tools.py` are untested against the real wheelhouse.

## 3. Decisions in force (user, 2026-10-27; unchanged)

| # | Decision |
|---|---|
| 1 | Team **Coolyvision**, solo, no merger |
| 2 | Run BCF-31B in parallel with the E4B anchor. **Since 11-05 this means BCF31-v1a** |
| 3 | The 5090 does all E4B work and the 31B dry runs. Rented GPUs are approved for 31B screening; proposed cap $300, released in steps (pilot $10 first). **Ask before renting** |
| 4 | **No forum posts** to the hosts |
| 5 | LoRA in two tracks: N (default final) and G (E4B LoRA). Merge rule on 11-22. Extra gate A8 added (change log §6) |
| 6 | **No Kaggle submission and no GPU rental without asking the user first** |

Projections in the AMBER band (11–12 h at k = 1.7) need the user's explicit OK before submitting.

## 4. Bundles in this package

| Bundle | Model | Tools | Budgets (min / calls / turns / cmd s) | Sampling (out / think / T) | Laptop status |
|---|---|---|---|---|---|
| `bundles/S0_r2/` | gemma-4-e4b-it-qat-w4a16-ct | 6, no skills | 5 / 24 / 60 / 120 | 4096 / 1024 / 0.2 | Static pre-flight PASS, 0 WARN. Draft ZIP `submission_S0_r2_draft.zip` sha256 `b7d635d4…120e` |
| `bundles/BCF31_v1a/` | gemma-4-31b-it-qat-w4a16-ct | 6, no skills | 7 / 28 / 80 / 180 | 8192 / 4096 / 0.2, seed 7 | Static pre-flight PASS, 0 WARN. Draft ZIP `submission_BCF31_v1a_draft.zip` sha256 `062277c1…1fa2` |

Rebuild both ZIPs on the 5090 after validation (`tools/build_zip.py`). The drafts were **not submitted**.

## 5. Risks for the 5090 work

| Risk | What to do |
|---|---|
| vLLM 0.19.1 / torch 2.10 cu128 lacks sm_120 kernels | Separate `.venv-dev` with a newer vLLM for local dev only. **Newer vLLM has the parser guard**, so hang counts from it do not represent the scorer |
| 31B on one 32 GB card | One task at a time; `--gpu-mem 0.90` or `0.80`. Its timing is optimistic compared with the scorer (runbook §9) |
| `compile_submission` signature unknown | `list_compiled_tools.py` tries the common call shapes; adapt it from Getting Started revision 3 |
| Local timing ≠ scorer timing | Planning k = 1.7. Calibrate in a Kaggle 4×L4 notebook (5 tasks per bundle) |
| A submission gets stuck | No cancel button. The user opens a support ticket after 36 h (05 §3) |

## 6. Next steps

1. **A0 (user):** check *My Submissions*.
2. Runbook §5–8: S0 r2 validation and dry run → report → **ask** before submitting (cycle 1, 11-06/07).
3. Runbook §9: BCF31-v1a dry run → report → **ask** before submitting (cycle 2, about 11-08).
4. Optional calibration: a Kaggle 4×L4 notebook for k on both models.
5. Then roadmap P2 (S1) and v1.1 work, following the slot plan. Use [03 BCF impact](reports/intel_20261105-2/03_BCF_Impact_and_Actions.md) §5 for what to work on (the fix, not finding the file).


---

<!-- ====================================================================== -->
<!-- FILE: 02_Runbook_5090.md -->
<!-- ====================================================================== -->

# 02 — Runbook on the RTX 5090 PC (revision of 2026-11-05)

*Goal: get **S0 r2** (E4B) and **BCF31-v1a** (31B) to a go/no-go decision on the 5090. For each bundle: official validation, compiled-tool check (A1), a 20-task dry run with hang and trace counters, and a 12 h projection with the scorer slowdown k. **Stop there.** Do not submit to Kaggle and do not rent GPUs without asking the user.*

**If the 10-27 package has already been run on this PC:** skip §1–4 (the environment is set up). Copy this package next to the old one (§0, last command) and go straight to §5.

---

## 0. Transfer (from the laptop)

| What | Size | How |
|---|---|---|
| This package `2026-11-05_Handoff_to_5090/` (or its ZIP) | ~2 MB | Any (USB, LAN share, cloud drive) |
| The project folder **without** venvs and the data ZIP | ~750 MB | `robocopy` (below); skip if already copied on 10-27 |
| Competition data `input/kagglecomp/kagglecomp_data_package/gemma-4-developer-agent.zip` | 21.9 GB | LAN copy; skip if already on the 5090 |

Keep the same project path (`D:\stuff\ai-misc\_bsh2026\vscode_project01\101b-Kaggle_claude`) so the Claude Code memory folder name stays the same. In PowerShell on the 5090 PC (replace `LAPTOP`):

```powershell
robocopy "\\LAPTOP\d\stuff\ai-misc\_bsh2026\vscode_project01\101b-Kaggle_claude" "D:\stuff\ai-misc\_bsh2026\vscode_project01\101b-Kaggle_claude" /E /XD .venv node_modules __pycache__ /XF gemma-4-developer-agent.zip /R:1 /W:1
```

```powershell
robocopy "\\LAPTOP\d\stuff\ai-misc\_bsh2026\vscode_project01\101b-Kaggle_claude\input\kagglecomp\kagglecomp_data_package" "D:\g4-transfer" gemma-4-developer-agent.zip /J
```

Inside WSL, copy the new package to the home folder (needed in every case):

```bash
rm -rf ~/g4-handoff2 && cp -r "/mnt/d/stuff/ai-misc/_bsh2026/vscode_project01/101b-Kaggle_claude/2026-11-05_Handoff_to_5090" ~/g4-handoff2 && sed -i 's/\r$//' ~/g4-handoff2/tools/*.sh ~/g4-handoff2/tools/*.py ~/g4-handoff2/setup_guide_06/scripts/*.sh
```

## 1. Windows prep (only if WSL is not set up yet)

1. Task Manager → Performance → CPU: "Virtualization: Enabled" (otherwise turn on SVM in the BIOS).
2. Current NVIDIA Windows driver (supports the 5090 and WSL CUDA). Never install a Linux driver inside WSL.
3. **User, admin PowerShell, then reboot:** `wsl --install -d Ubuntu-24.04`
4. Copy `setup_guide_06/scripts/wslconfig.example` to `C:\Users\<you>\.wslconfig`, then run `wsl --shutdown`.

## 2. Ubuntu base

```bash
bash ~/g4-handoff2/setup_guide_06/scripts/10_ubuntu_bootstrap.sh
```

Check: `nvidia-smi` inside WSL shows the RTX 5090.

## 3. Kaggle token and assets

**The user does this:** kaggle.com → Settings → API → Create New Token, saved as `~/.kaggle/kaggle.json` in WSL. Never paste it into a chat.

```bash
bash ~/g4-handoff2/tools/20_fetch_assets_e4b.sh /mnt/d/g4-transfer/gemma-4-developer-agent.zip
```

The 31B weights (`google/gemma-4/other/gemma-4-31b-it-qat-w4a16-ct/2`, about 18–20 GB) are fetched with `setup_guide_06/06_Setup_Guide_WSL2_Swegemma_RTX5090.md` §3.4. Checks:
- 129 tasks.
- Wheelhouse hashes match 750753 (swegemma-0.2.11 `9ad87658…`, adk_submission-0.2.13 `f156f0bd…`).
- `config.json` is present for both models under `~/g4/models/`.

## 4. Wheelhouse

```bash
bash ~/g4-handoff2/setup_guide_06/scripts/30_install_wheelhouse.sh
```

```bash
source ~/g4/.venv/bin/activate && python -c "import torch, vllm, google.adk; print(torch.__version__, vllm.__version__, google.adk.__version__, torch.cuda.get_arch_list(), torch.cuda.get_device_name(0))"
```

- Expect vLLM 0.19.1 and google-adk 1.36.1.
- If `sm_120` is missing, or vLLM fails with "no kernel image", create a **separate** `~/g4/.venv-dev` with a newer vLLM for local dev only, and record the parity loss.
- **A newer vLLM already contains the #41991 parser guard, so hang counts measured there do not represent the scorer.** Say so in the report.

## 5. Stage both bundles and run the static pre-flight

```bash
mkdir -p ~/g4/submissions && rm -rf ~/g4/submissions/S0_r2 ~/g4/submissions/BCF31_v1a && cp -r ~/g4-handoff2/bundles/S0_r2 ~/g4-handoff2/bundles/BCF31_v1a ~/g4/submissions/
```

```bash
cd ~/g4-handoff2/tools && python preflight_static.py ~/g4/submissions/S0_r2 && python preflight_static.py ~/g4/submissions/BCF31_v1a --model gemma-4-31b-it-qat-w4a16-ct
```

Both must print `RESULT PASS`; they did on the laptop with 0 warnings.

## 6. Official validation and compiled-tool check (A1)

```bash
python -c "import adk_submission as a; print([n for n in dir(a) if 'valid' in n.lower() or 'compile' in n.lower()])"
```

Call `validate_directory` on both bundles. Then:

```bash
cd ~/g4-handoff2/tools && python list_compiled_tools.py ~/g4/submissions/S0_r2 && python list_compiled_tools.py ~/g4/submissions/BCF31_v1a
```

- **Pass:** each agent lists the 6 declared tools and **no `run_skill_script`**.
- `list_compiled_tools.py` is untested. If `compile_submission` needs other arguments, adapt it from Getting Started revision 3 and log the fix.
- Optional evidence for gate G-SK: run it on a copy of v1a with a dummy `skills:` entry. It should FAIL and list `run_skill_script`.

## 7. S0 r2: smoke test and 20-task dry run (E4B)

```bash
cd ~/g4-handoff2/tools && python 40_local_eval.py ~/g4/submissions/S0_r2 requests_7309
```

```bash
cd ~/g4-handoff2/tools && python 40_local_eval.py ~/g4/submissions/S0_r2 --tasks-file dry_run_tasks_20.txt
```

```bash
python ~/g4-handoff2/tools/project_12h.py ~/g4/results/S0_r2_*/dry_run_rows.jsonl --cap-min 5
```

- Outputs go to `~/g4/results/S0_r2_<timestamp>/`. If more than one run folder matches the glob, pass the newest folder explicitly.
- `40_local_eval.py` is **untested** end to end. Fix it against Getting Started revision 3 if needed and log every fix.
- If vLLM runs out of memory, use `--gpu-mem 0.80`.

## 8. Pass conditions (both bundles)

| Check (field in `dry_run_summary.json`) | Pass |
|---|---|
| `crashes` | 0 |
| `hangs`, `server_frozen` | 0, false. On a hang, save the trace and the vLLM log: it is evidence for W1 |
| `over_cap` | 0 |
| `protected_edits`, `junk_files` | 0 |
| `skill_calls`, `skill_array_args` | 0 (no skills declared) |
| `malformed_edit_calls` | Report. On 31B, check in the traces that the heredoc fallback ran |
| `compaction_markers` | Report (A7). If most tasks show compaction, tighten read discipline in the next revision |
| `done_replies`, `budget_warnings` | Report (stop-rule and warning compliance) |
| `rewrite_suspects`, `non_empty_patch`, `resolved` | Report. Expected E4B baseline: 0–4/20 |
| `project_12h.py` verdict at k = 1.7 | **GREEN** ≤ 11.0 h to ship. **AMBER** (11–12 h) ships only with the user's OK. **RED**: lower the cap and re-run |

## 9. BCF31-v1a on the 5090 (31B)

The 31B QAT model (about 18–20 GB) fits on the 32 GB card with one sequence at a time. If start-up fails on memory, try `--gpu-mem 0.90`, then 0.80.

```bash
cd ~/g4-handoff2/tools && python 40_local_eval.py ~/g4/submissions/BCF31_v1a requests_7309 --model-alias gemma-4-31b-it-qat-w4a16-ct
```

```bash
cd ~/g4-handoff2/tools && python 40_local_eval.py ~/g4/submissions/BCF31_v1a --tasks-file dry_run_tasks_20.txt --model-alias gemma-4-31b-it-qat-w4a16-ct
```

```bash
python ~/g4-handoff2/tools/project_12h.py ~/g4/results/BCF31_v1a_*/dry_run_rows.jsonl --cap-min 7
```

- Apply the §8 pass conditions.
- **Timing caveat:** this runs one task at a time on one GPU. The k range 1.6–1.8 was measured at 3 tasks at a time on an RTX PRO 6000. Running one at a time is faster per call, so treat the projection as optimistic by about 1.4× (the concurrency factor Alex Ust reports). For 31B timing, either:
  - run a 3-at-a-time sample on a rented GPU (**ask first**, pilot $10), or
  - run 5 tasks in a Kaggle 4×L4 notebook (uses notebook quota, not a submission). This is the most direct calibration.
- If the projection is RED at 7 min, set `max_time_minutes: 6` **and** change the prompt to "about 6 minutes", then re-run §5 and §9.

## 10. Report

Write `2026-11-0X_Phase0_Report/01_Phase0_Report.md` in the project root (dated folder, numbered file). Run `2026-10-01_Opus55_BCF_Review_and_Static_Analysis/analysis/scripts/qc_tables.py` on it. Contents:
1. Environment: versions, sm_120 outcome, any script fixes.
2. Pre-flight, validation and compiled-tool results for both bundles.
3. Dry-run summaries, per-task tables and counters.
4. `project_12h.py` tables and verdicts.
5. ZIPs rebuilt with `tools/build_zip.py`, with their SHA-256. The laptop drafts are in `bundles/`.
6. Go / no-go for S0 r2 (cycle 1) and BCF31-v1a (cycle 2), following [05_Slot_Plan](05_Slot_Plan_2026-11-06_to_2026-12-02.md).

**Then stop and ask the user before any Kaggle submission.**

## 11. Optional (no slot, no money)

- **Kaggle 4×L4 calibration notebook:** fork Getting Started so it stays on Python 3.12. Run 5 tasks per bundle and record seconds per task, which gives k for both models. Abhimanu Bhagwati's *Run Your Agent Locally* notebook is a ready-made A/B template (see `reports/intel_20261105-2/02`).
- **Track G canary G-L0b on the 5090:** compare a zero adapter with a loud adapter on E4B.
- **XingLing's config checker** (Kaggle CPU notebook) on both bundles, as a second opinion.


---

<!-- ====================================================================== -->
<!-- FILE: 03_Kickoff_Prompt_for_Claude.md -->
<!-- ====================================================================== -->

# 03 — Kickoff prompt for Claude Code on the 5090 PC (revision of 2026-11-05)

1. Open Claude Code with the project folder `D:\stuff\ai-misc\_bsh2026\vscode_project01\101b-Kaggle_claude` as the working directory.
2. Install or refresh the memory files first ([00_README.md](00_README.md) §3).
3. Paste the block below as the first message.

---

```text
Continue the Gemma 4 Developer Agent work. This PC has the RTX 5090. The latest laptop session (2026-11-05)
updated BCF after a forum sweep; the package is 2026-11-05_Handoff_to_5090/ (it supersedes 2026-10-27_Handoff_to_5090/).

Read first, in this order:
1. 2026-11-05_Handoff_to_5090/01_Handoff_Brief.md          (state, decisions, risks)
2. 2026-11-05_Handoff_to_5090/04_BCF_Change_Log_2026-11-05.md  (what changed and why: A1 no skills, budgets, tools)
3. 2026-11-05_Handoff_to_5090/02_Runbook_5090.md            (the steps)
4. 2026-11-05_Handoff_to_5090/05_Slot_Plan_2026-11-06_to_2026-12-02.md (submission order; skim)
Background if needed: reports/intel_20261105-2/ (forum intel) and reports/2026-10-27/ (roadmap, decisions).

First, tell me whether Phase 0 from the 10-27 package was already run on this PC (look for ~/g4, ~/g4/results/
and any 2026-10-2X_Phase0_* or 2026-11-0X_Phase0_* folder in the project root). Reuse what exists.

Task: for bundles/S0_r2 (E4B) and bundles/BCF31_v1a (31B), run runbook §5-9: static pre-flight, official
validate_directory, list_compiled_tools.py (must show no run_skill_script), a smoke test, the 20-task dry run
with 40_local_eval.py, and project_12h.py. Write the report as in runbook §10.

Constraints:
- Do NOT submit anything to Kaggle and do NOT rent any GPU without asking me first.
- AMBER projections (11-12 h at k = 1.7) need my explicit OK before any submission.
- I create the Kaggle API token myself; never ask me to paste it into the chat.
- Steps that need admin rights or a reboot are mine; tell me exactly what to run.
- 40_local_eval.py and list_compiled_tools.py are untested against the real wheelhouse; fix them against
  Getting Started revision 3 if needed and log every fix.
- If you must use a newer vLLM (sm_120), say that its hang counts do not represent the scorer (it has the guard).
- Deliverables: markdown in a new dated, numbered subfolder; run the table QC script before finishing.
```


---

<!-- ====================================================================== -->
<!-- FILE: 04_BCF_Change_Log_2026-11-05.md -->
<!-- ====================================================================== -->

# 04 — BCF change log, 2026-11-05 (A1 and the other actions from the 11-05 intel)

*Source of the actions: [reports/intel_20261105-2/03_BCF_Impact_and_Actions.md](reports/intel_20261105-2/03_BCF_Impact_and_Actions.md). This log records what was changed in the BCF designs, bundles and tools, and what still needs the 5090 or the user. "Applied" means written into this package; nothing has been run on a GPU or submitted.*

## 1. Status of each action

| # | Action | Status | Where |
|---|---|---|---|
| A0 | Check *My Submissions* (S0 or BCF-v1 pending or stuck?) | **Open, user** | Kaggle website |
| A1 | No `run_skill_script` or array-argument tools in scorer bundles | **Applied** | BCF-31B is now `bundles/BCF31_v1a` (no skills); pre-flight fails on `skills:` (§2) |
| A2 | 12 h projection with scorer slowdown k | **Applied (tool)**; numbers need the 5090 | `tools/project_12h.py`; built into `tools/40_local_eval.py` |
| A3 | One shared slot plan for 31B and E4B | **Applied** | [05_Slot_Plan](05_Slot_Plan_2026-11-06_to_2026-12-02.md) |
| A4 | Last submission 11-27/28; both finals scored by about 11-30 | **Applied** | 05 §2 |
| A5 | Effort from finding the file to the fix, anytime patch, thinking on | **Applied** in the v1a prompt and sampling; S1/S2 design note in §5 | `bundles/BCF31_v1a/prompts/system.md` |
| A6 | Malformed `edit_file` rule plus a single-argument fallback | **Applied** (31B: heredoc fallback; E4B: resend with all three keys) | both prompts |
| A7 | Count compaction and hangs in local traces | **Applied (tool)**; numbers need the 5090 | `tools/40_local_eval.py` counters |
| A8 | Track G gate: ≥ +3 tasks at equal scorer time, canary check | **Applied** to the plan | §6 |
| A9 | New pre-flight checks | **Applied** | `tools/preflight_static.py` (§4) |

## 2. A1 — why the skills path is removed from scorer bundles

**Finding:** declaring any skill exposes an array-argument tool. We confirmed this in the source of google-adk **1.36.1**, the version in the wheelhouse (copy in [reports/evidence/adk_1.36.1_skill_toolset.py](reports/evidence/adk_1.36.1_skill_toolset.py)):
- A `skills:` entry in `agent.yaml` makes ADK add a `SkillToolset` with `list_skills`, `load_skill`, `load_skill_resource` and `run_skill_script`.
- `run_skill_script` declares `args` as *object or array of strings*, and `positional_args` as an *array*.
- So whenever skills are declared, the model can emit an array argument.
- In vLLM 0.19.1, an unquoted array element that contains `[` or `]` makes the gemma4 parser loop forever inside the API server (753973). Two freezes were seen in about 830 tasks run with skill agents.

**Consequence:** the 10-27 mitigation ("never pass issue text through `args`; install with a zero-argument call") still leaves the tool in the model's tool list. On a 120-task run, a single stray array argument can zero every remaining task.

**What changed:**

| Item | Before (BCF-v1 design, 10-01; v5 replay, 10-27) | Now |
|---|---|---|
| First 31B submission | BCF-v1 with skills `bcf-locate`, `bcf-check` (+ fallback `v1-inline`) | **BCF31-v1a**: same 6 tools as S0, **no skills, no graph tools, no adapter** |
| Spec, locate and check helpers | Skill scripts (`locate.py`, `check.py`, `bcf.py` installed into `.git/bcf/`) | The prompt does the work: thinking-only spec (CHANGE / TARGET / DONE), `grep -rn`, one-command check (`git status --short && timeout 150 python -m pytest -x -q …`) |
| Skill variant | Planned for v1 | **BCF31-v1b, lab only**, behind gate **G-SK** (below) |
| Pre-flight | Skills allowed | `preflight_static.py` **fails** on `skills:` unless `--allow-skills` (lab variants only) |
| Compiled-tool check | none | `tools/list_compiled_tools.py`: compiles with `adk_submission` and fails if `run_skill_script` appears (untested, needs the wheelhouse) |

**Gate G-SK (all four must hold before any skill bundle goes to the scorer):**
1. `list_compiled_tools.py` shows exactly which tools the skill bundle exposes.
2. At least 300 local tasks run on the **unpatched** vLLM 0.19.1 parser with 0 hangs and 0 `skill_array_args` (counters in `40_local_eval.py`).
3. A paired gain of at least +2 tasks over v1a **at equal scorer-equivalent time** (local cap = scorer cap ÷ k).
4. Or: the hosts confirm that the scorer has the #41991 guard (watch-list W1).

The `scratch/bcf_skill_proto/bcf.py` prototype stays as the v1b candidate. It is already driven by `run_command` heredocs after one zero-argument install call.

## 3. BCF-31B design: BCF-v1 (10-01 draft) → BCF31-v1a

| Choice | BCF-v1 draft (06 §4.1–4.4) | BCF31-v1a | Evidence (11-05 intel) |
|---|---|---|---|
| Topology | One root `LlmAgent` | Unchanged | Multi-stage pipelines break under nudges, compaction and the shared budget (754636) |
| Tools | 6 + `get_code_neighbors` | **6** (no graph tools) | Declaring graph tools injects a "use these" paragraph into the prompt; same-file neighbours in 4/4 traces (XingLing) |
| Skills | `bcf-locate`, `bcf-check` | **None** (A1) | §2 |
| Budgets | 4 min, 30 calls, 40 turns, 120 s | **7 min, 28 calls, 80 turns, 180 s** | 8 min / 28 sits at the 12 h edge (k ≈ 1.6–1.7); 7 min projects AMBER on public-bundle timings; 40 calls / 8 min timed out; every success finished within 45 model requests (755066). Final cap comes from `project_12h.py` on the v1a dry run |
| Sampling | T 0.2, out 8192, thinking 2048, seed 7 | **T 0.2, out 8192, thinking 4096**, seed 7 | Thinking on: 48 vs 23 of 129. 8192 / 4096 is the native-trajectory regime. 2k vs 4k tie, so 4096 is the safe default. `seed` and `thinking_budget` reach vLLM since wheelhouse v28 (744566) |
| Spec | Heredoc into `/tmp/bcf/spec.md` (1 call) | Thinking only (no call) | Calls are the scarce budget; thinking is kept across turns |
| Journal | `echo … >> /tmp/bcf/journal.md` every step | **Dropped** | A call per step is too expensive at 28 calls |
| Check | `bcf-check` skill | One `run_command`: `git status --short` + one test file under `timeout 150` | Junk files and test runs are the useful parts of bcf-check |
| Malformed edit | — | Never resend; use the single-argument heredoc replace via `run_command` | 51/51 malformed calls in one run (756051); fallbacks that rewrite the file corrupt it (755289 E19) |
| Stop rule | "call submit_patch, then reply with one sentence" | "…then reply with exactly one word: Done." | `submit_patch` is optional; this stops spending calls |
| Anytime patch | "At about half the budget with no edit…" | First edit by call 8; narrowest edit by call 12 | 54 % empty patches in one control; solved runs edit about 75 s earlier |
| `read_file` | Integer ranges | Also: "at most 150 lines; `grep -n` first" | `read_file` stops at 150 lines / 10k characters |

**Day-1 probes from 06 §5, updated:**

| ID | Status on 11-05 |
|---|---|
| P-1 (are skills runnable?) | Replaced by gate G-SK |
| P-2 (`read_file` integer ranges) | Still check on the 5090 |
| P-3 (`edit_file` argument corruption) | Confirmed in the field (756051); counted by `malformed_edit_calls` |
| P-4 (scorer setup time) | Replaced by the k-based projection (A2) |
| P-5 (`/tmp` persistence) | Still check |
| P-6 (`seed` honoured) | Reaches vLLM since v28 (744566); determinism still to measure |

## 4. Pre-flight additions (A9), now in `tools/preflight_static.py`

| Check | Result if violated |
|---|---|
| `skills:` declared (array-argument tool exposed) | FAIL (`--allow-skills` for lab variants) |
| `max_tool_calls < 20` (no `budget_warning`) | FAIL |
| `timeout_seconds ≥ max_time_minutes × 60` | FAIL |
| `max_output_tokens < 2048` | FAIL |
| Prompt's "about N minutes and M tool calls" ≠ `eval_config.yaml` | FAIL |
| Graph tools declared | WARN |
| Sub-agents declared | WARN |
| Adapter declared (+29 % time) | WARN |
| No "Done." stop rule | WARN |
| More than 28 calls at 8 min or longer | WARN |

Laptop results:
- `S0_r2` and `BCF31_v1a` pass with 0 warnings.
- The 10-27 S0 passes with one WARN (no stop rule).
- A deliberately broken copy produced the 5 expected FAILs and 1 WARN.

The roadmap's §7 checklist item 4 (official validate/compile) now also requires `list_compiled_tools.py` → PASS.

## 5. E4B: S0 → S0 r2, and notes for S1/S2

The S0 r2 budgets and sampling are **unchanged** (5 min, 24 calls, 60 turns, 120 s; out 4096, thinking 1024): 24 ≥ 20 calls keeps `budget_warning` active. Prompt-only changes:
1. `read_file` stops at 150 lines; use `grep -n` first; never re-read lines; never copy file contents into the reply.
2. `edit_file` needs all three arguments and no backticks. After "mandatory input parameters are not present", resend once with a shorter `old_string`. There is no heredoc fallback for E4B, which already tends to rewrite whole files (750974).
3. The check becomes `git status --short && timeout 120 python -m pytest …`, and the agent deletes any stray new file.
4. Stop rule "reply with exactly one word: Done."; stop on `budget_warning`.

S1/S2 (roadmap P2/P3), per A5:
- Spend the ablation slots on fix quality: check-and-retry, anytime patch, and malformed-call recovery.
- Do not spend them on locate (the gold file is found in 84–90 % of runs).
- Do not tune temperature.
- No skill-based ablations until G-SK passes.

## 6. Track G (E4B LoRA), per A8

New gates are added to 05 §3 G-L0 … G-L4. Before an adapter bundle may take a shared slot, all of these must hold:
- `g4kit-canary`, or the 10-27 G-L0b canary, shows that the served adapter changes the logits. Diff-review gemma4-swe-kit from `42b473e` to `a9270ed0` first.
- Local held-out gain ≥ **+3 tasks** at **equal scorer-equivalent time**.
- `project_12h.py --time-factor 1.29` is GREEN or AMBER.
- How to read a scorer result (Kapil Chopra): "complete, no score" means a time overrun; 0.00 means a loading problem.

The 11-22 merge rule stands. The default final stays Track N.

## 7. Tools in this package

| Tool | Status | Change |
|---|---|---|
| `preflight_static.py` | Tested on the laptop | A1/A9 checks (§4) |
| `project_12h.py` | Tested; reproduces Alex Ust's published hours exactly | New. GREEN ≤ 11.0 h, AMBER ≤ 12.0 h, RED > 12.0 h at k = 1.7 |
| `40_local_eval.py` | Helper functions tested offline; **the full run is untested** (needs the wheelhouse) | Replaces `40_local_eval_e4b.py`: any model, watchdog plus frozen-server stop, trace counters, k-projection |
| `list_compiled_tools.py` | **Untested** | New (A1) |
| `dry_run_tasks_20.txt` | Checked against `tasks.jsonl` | requests_6589, 6592 and 7328 swapped for 6644, 7205 and 7315 (the old three fail the gold patch without a network, 754586) |
| `build_zip.py`, `20_fetch_assets_e4b.sh`, `render_transcript.py` | Unchanged copies | — |

## 8. Not done or not verified

- Nothing has run on a GPU. Every number for S0 r2 and v1a (resolve rate, timing, projection, hang and compaction counts) comes from the 5090 runbook ([02](02_Runbook_5090.md)).
- `40_local_eval.py` (full path) and `list_compiled_tools.py` have not been run against the real wheelhouse.
- The planning range k = 1.6–1.8 is borrowed from an RTX PRO 6000 measurement and assumed to carry over to the RTX 5090. Re-fit it after the first BCF score.
- The original design files carry a short "superseded in part" banner pointing here (§9). Their bodies are unchanged.

## 9. Files touched outside this package

| File | Change |
|---|---|
| `2026-10-01_BCF_v1_Roadmap/06_BCF_v1_Harness_Build.md` | Banner: §4 superseded by BCF31-v1a (A1) |
| `2026-10-27_Forum_Intel_and_Small_Model_Bonus/03_BCF_Small_Model_Bonus_Roadmap.md` | Banner: §6 slot plan → 05 here; §7 pre-flight additions; P5 dates |
| `2026-10-27_Forum_Intel_and_Small_Model_Bonus/05_Decisions_GPU_Budget_and_LoRA_Tracks.md` | Banner: Track G gate additions (A8) |
| `2026-10-27_Handoff_to_5090/00_README.md` | Banner: superseded by `2026-11-05_Handoff_to_5090/` |


---

<!-- ====================================================================== -->
<!-- FILE: 05_Slot_Plan_2026-11-06_to_2026-12-02.md -->
<!-- ====================================================================== -->

# 05 — Shared submission plan, 2026-11-06 to 2026-12-02 (A3, A4)

*Replaces roadmap 03 §6. Every submission still needs the user's go-ahead.*

## 1. Constraints

- **One pending submission per team.** A stuck run blocks the team, there is no cancel button, and only Kaggle support can clear it (ticket route, 756044).
- **One submission per day.**
- **Submit to score takes 18–32 h** (11-05 reports), plus up to 12 h of run time. Plan on **1.5 days per cycle**.
- **Deadlines (23:59 UTC):** paper 11-12 (not in BCF scope), entry and merger 11-25, **final selection 12-02**.
- **Finals:** the private score is the better of the two selected finals. The E4B bonus counts only if an E4B submission is one of them.

From 11-06 to the last submission on 11-28 there are about **14 cycles**. The split is about 6 for E4B, 6 for 31B and 2 spare (stuck or failed runs).

## 2. Plan

| Cycle | Earliest submit (UTC) | Bundle | Track | Purpose | Gate before submitting |
|---:|---|---|---|---|---|
| 0 | now | — | — | **A0:** check *My Submissions*. If an S0 or BCF-v1 run is pending, wait; if it is stuck for more than 36 h, the user opens a support ticket | — |
| 1 | 11-06/07 | **S0 r2** | E4B (N) | Eligibility anchor and E4B baseline | Runbook §5–7: dry run 0 crashes, 0 hangs, projection GREEN; user OK |
| 2 | 11-08 | **BCF31-v1a** | 31B | First BCF score; calibrates k | Runbook §9: 20-task dry run on the 5090, `list_compiled_tools` PASS, projection GREEN (or AMBER + user OK) |
| 3 | 11-10 | S1 | E4B | P2 ablation winner | Roadmap P2 ship rule (≥ +3 tasks vs S0, paired) |
| 4 | 11-11 | v1a, second draw or v1a′ (cap re-set from k) | 31B | Measure variance; act on the first k re-fit | If cycle 2 scored "no score", lower the cap by 1 min first |
| 5 | 11-13 | S1′ or S2 | E4B | — | P3 rule (≥ +2 tasks on HO) |
| 6 | 11-14 | v1.1 (A5/A6 fixes from traces) | 31B | — | Paired local gain ≥ +2 tasks at equal time |
| 7 | 11-16 | S2 | E4B | — | — |
| 8 | 11-17 | v1.2 or v1b (only if G-SK passes) | 31B | — | G-SK (change log §2) |
| 9 | 11-19 | Spare / Track G (only if the A8 gate passes) | E4B | — | Change log §6 |
| 10 | 11-20 | Spare | — | Re-run of any slot lost to the platform | — |
| — | **11-22** | **Freeze.** Pick one 31B candidate and one E4B candidate | — | Track G merge rule (05 decisions) | — |
| 11 | 11-22 | 31B final candidate, draw A | 31B | Repeat for the mean | Byte-identical to the frozen ZIP |
| 12 | 11-24 | E4B final candidate, draw A | E4B | — | — |
| 13 | 11-25 | 31B final candidate, draw B | 31B | — | — |
| 14 | **11-27, by 11-28 at the latest** | E4B final candidate, draw B | E4B | **Last submission** (A4) | — |
| — | 11-30 to 12-01 | — | — | Both finals must have **scored**. Select one 31B and one E4B, chosen on the mean of their draws. On a tie, pick the earlier submission | — |
| — | 12-02 23:59 | — | — | Final-selection deadline | — |

## 3. Rules

1. **Never let an intended final still be pending after 11-30.**
2. If a run stays at "Running/Pending" for more than 36 h, ask the user to open a Kaggle support ticket and quote the submission ID. Do not resubmit duplicates; the pending limit blocks them anyway.
3. A "complete, no score" or "Notebook Timeout" result is treated as a **time overrun**. Before the next attempt with that bundle, lower `max_time_minutes` by 1 and re-run `project_12h.py`.
4. When a draw scores, add it to the ledger together with its local dry-run timings, then re-fit k:
   - k ≈ (scorer run time ÷ 120 tasks) ÷ local mean seconds per task.
   - The scorer run time is not shown to participants. Use 12 h as an upper bound if the run finished; use > 12 h if it timed out.
5. Every slot is shared, so no exploratory submissions. Each needs a local paired gain and its gate.

