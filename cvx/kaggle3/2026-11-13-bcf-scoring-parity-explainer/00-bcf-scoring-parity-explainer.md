# BCF Scoring Parity Explainer — Local Test Harness vs. the Official Kaggle Leaderboard

**Date:** 2026-11-13, live-verified 2026-11-14 · **Project:** BCF (Batonic Coding Framework), Gemma 4 Developer Agent Competition
**Question answered:** How does the score produced by the local BCF test-harness setup relate to the score Kaggle publishes on the official leaderboard? What is identical, what differs, how do you calibrate one against the other, and what baseline + improvement roadmap follows for the BCF brain?

**Method.** Independent re-derivation from the local dataset and deliverables only, per project policy. Every claim is tagged with an evidence class:

| Class | Meaning |
|---|---|
| OFFICIAL | Text from the organizer docs / HARNESS_README shipped in the data package (Sept 29 snapshots). |
| OFFICIAL-LIVE | Verified directly on the live Kaggle site 2026-11-14 (user's debug Chrome via Chrome DevTools MCP; public/logged-out view). Captures saved under `scratch/bcf-live-recheck-2026-11-14/pages/`. |
| CAPTURED | Primary-source capture of the live Kaggle site: staff/host thread quotes and the leaderboard CSV in `input/kagglecomp/intel_20261111/` (captured 2026-11-11). Competitor claims are labeled as such; STAFF/HOST = organizer. |
| MEASURED | Computed from a local artifact in this repo (file given). |
| ESTIMATE | Arithmetic/inference from cited facts, not yet measured on the local GPU. |
| UNVERIFIED | Not settled by any local source; a probe or live re-check is attached. |

> **Live-site verification status — DONE (2026-11-14).** The live Kaggle site was re-verified on 2026-11-14 through the user's debug Chrome (Chrome DevTools MCP, public/logged-out view): Overview, Leaderboard, Data, Discussion (incl. threads 748287 and 747519), and the wheelhouse dataset page. **All core scoring/parity facts are confirmed unchanged**, with these updates: the four QAT model variants are confirmed live; the leaderboard now carries Kaggle's official "approximately 50% of the test data" public/private note; the top score is still 0.29 (Yurnero) with the 0.24 bucket grown to 13 teams and 5,678 teams total; the wheelhouse is still v31; the **bonus small-model leaderboard notebook** is confirmed official and now scheduled daily (bonus top 0.12, §1.7); **no new staff posts since Nov 11** (the queue crisis has worsened — Nov-9 submissions stuck 80+ h, still unacknowledged). The full verification log with URLs and saved captures is §9. Local facts are current-as-of-today; the Nov 11 intel capture remains the baseline for discussion-thread detail.

**Source key** (paths relative to project root `d:/stuff/ai-misc/_bsh2026/vscode_project01/46-wide_research_test_alibaba`):

| Short | File |
|---|---|
| HR | `input/kagglecomp/kagglecomp_data_package/HARNESS_README.md` (official harness contract; §n = its sections) |
| OV / DATA / GS / RULES | `input/kagglecomp/docs/markdown/Kaggle-01-Overview.md`, `-02-Data.md`, `-03-GettingStarted.md`, `-04-OfficialRules.md` (Sept 29 page snapshots) |
| GUIDE | `deliverables/2026-11-11-bcf-local-harness-setup-guide/00-local-harness-setup-guide.md` |
| PAR | `deliverables/2026-11-11-bcf-hardening-research/03-local-env-parity-plan.md` (divergence register D1–D18 in its §8) |
| SCORE | `deliverables/2026-11-11-bcf-hardening-research/04-local-scoring-and-feedback-guide.md` (calibration protocol in its §5) |
| BRAIN | `deliverables/2026-11-11-bcf-gemma4-brain/README.md` + `04-task2-bcf-design-justification.md` |
| BRIEF | `input/kagglecomp/intel_20261111/00-intel-brief-2026-11-11.md` |
| CSV | `input/kagglecomp/intel_20261111/leaderboard-public-2026-11-11.csv` |
| tasks | `input/kagglecomp/kagglecomp_data_package/tasks.jsonl` (129 lines, MEASURED this pass) |

Thread ids (e.g. 756400) resolve to the primary dumps catalogued in BRIEF and `scratch/bcf-2026-11-11/intel_texts/topic_<id>.md`.

---

## 0. Executive summary

1. **The local harness *is* the official harness.** The setup guide pins the exact scorer stack — `swegemma 0.2.11`, `adk-submission 0.2.13`, `google-adk 1.36.1`, vLLM `0.19.1`, wheelhouse v31 — and builds the same `swebench-sandbox:latest` image with the same 4 GiB / 2 vCPU / air-gapped quotas. A given patch is graded by the **same two-container lifecycle and the same binary resolution criterion** locally and on Kaggle (HR §4, §8; GUIDE Part 4; PAR §1). Grading parity is exact *conditional on the environment*.

2. **The score differs anyway, for five reasons:** (a) **population** — local evals run on the 129 *public training* tasks, which are **never scored on Kaggle**; the leaderboard runs on ~120 *hidden private-repo* tasks (58 public-LB + ~60–62 private); (b) **hardware/numerics** — one RTX 5090 (TP1) vs 4×L4 (TP4), with a likely reduced local context window; (c) **environment** — the public wheelhouse has dependency gaps and wheel-shadowing that zero out correct patches locally but are staff-confirmed absent from hidden-task gold validation; (d) **process** — Kaggle adds a 12 h whole-run kill, 1/day + one-pending submission gates, 36–52 h queues, and a best-retained public leaderboard; (e) **a few scorer-side unknowns** (compaction interval, reasoning-drop fix state, sandbox-testing flag, timeout semantics) that no local source settles.

3. **Therefore: a local resolution rate is not a leaderboard prediction.** Raw local rates mix free points (tasks that pass with an empty patch) and dead tasks (collection errors, structurally never-resolving tasks). The only score-like signal that transfers is the **relative ordering of configs on a frozen, audited, masked task set with paired repeats** — and even that transfers only probabilistically (documented cases exist where local ties hid large hidden gaps, §5).

4. **Public leaderboard math (CSV-verified + OFFICIAL-LIVE):** every published score equals `floor(k/58 × 100)/100` — 58 scored public tasks, truncated to 2 decimals. Kaggle's live leaderboard now states it is "calculated with approximately 50% of the test data... final results will be based on the other 50%" (OFFICIAL-LIVE). Top score **0.29 = 17/58** (Yurnero, unchanged); the 0.24 bucket holds **13 teams** live on Nov 14 (12 on Nov 11); **5,678 teams** (overview, Nov 14; the Nov 11 CSV snapshot had 5,439). Run-to-run noise is ±1.5–3 tasks; per-task flip rate 10–13%; the LB retains each team's **best** score. One run is not a verdict.

5. **Your baseline today:** BCF has strong **CPU-measured mechanism metrics** (localization hit@3 96.9% upper bound, anchor uniqueness 96%, validator 0/0, 18/18 compliance probes) but **no GPU end-to-end score yet** — neither local nor Kaggle (BRAIN). The baseline to establish is a **masked resolve rate on your own audited valid set (~68 tasks), two repeats, win-both**, plus a mechanism dashboard and a 12 h wall-clock extrapolation (§7). Translate it to the LB as a *direction*, never a point prediction, and learn your own local→public mapping from a correlation ledger (§6.2).

6. **Roadmap:** canary gates C0→C7 before any slot → baseline runs → lever cycles prioritized by Frequency × Fixability × Evidence → replicated selection → two finals (31B + gated E4B) locked by **Dec 2**, entry/merger by **Nov 25**. The dominant risk is not localization (already strong) but **semantic fix authoring** and **runtime safety under the 12 h kill** (§8).
7. **The bonus has a separate daily leaderboard** — an official staff notebook (`ryanholbrook/gemma-4-developer-agent-small-model-leaderboard`) republishing the same floor(k/58) public scores filtered to E2B/E4B teams. Verified live Nov 14: scheduled daily (v27), data as of Nov 12 23:56 UTC; the bonus top is only **0.12** (7/58) with a dense 0.10 cluster — a contestable $10k, but BCF has no E4B score yet (§1.7, §7.5).

---

## 1. The official scoring pipeline — what Kaggle actually computes

### 1.1 Two stages, two containers

A submission is a `submission.zip` with `agent.yaml` at the root (declarative YAML only; no Python entrypoints; < 3 GiB unpacked). Kaggle compiles it with `adk-submission.compile_submission()` into an ADK agent tree — competitor code is never imported (HR §2). Then, per HR §1/§4/§8 and DATA:

```text
STAGE 1 — inference (scripts/inference.py on the Kaggle 4×L4 rig)
  for each hidden task (~120, sequential, one shared 12 h clock):
    Container A: fresh repo snapshot at base_commit (zero future git history)
                 + editable install + cached test deps + pytest.ini/conftest.py
                 + "baseline" commit
    agent works via the 9 harness tools under per-task budgets
    patch extracted: git add -N . && git diff --binary _swegemma_baseline
                     (explicit submit_patch() OR automatic fallback recovery)
  → submission.parquet  [id, prediction]   (prediction = unified diff, or NO_PATCH)

STAGE 2 — scoring (scripts/metric.py → score() → verify_task)
  for each non-empty prediction:
    Container B: FRESH snapshot, same bootstrap, "eval_baseline" commit
    4-pass resilient patch apply (git apply variants → GNU patch); all fail → resolved=False
    anti-tampering reset: every test file + runner config touched by the patch
                          is force-reset to baseline (git checkout HEAD / git clean -f)
    apply task.test_patch
    hermetic pytest:  PYTHONSAFEPATH=1 PYTHONNOUSERSITE=1 python3 -s -m pytest <targets>
                      --junitxml=... -p no:anyio -o timeout=0 -o python_classes="Test* *Test" -q
    resolved = (exit_code == 0) AND (JUnit XML valid)
  → Resolution Rate = resolved tasks / total tasks in the split
```

Key consequences of this design (HR §8):

- **Grading is hermetic and patch-based.** The agent's *process* is never graded — only the final diff, re-applied to a clean repo. Anything the agent did that is not in the diff (installed packages, scratch state, test edits) does not exist at grading time.
- **Test/config edits are discarded.** The reset covers `test_*.py`, `*_test.py`, `tests/`/`test/`/`testing/` files, `conftest.py`, `pytest.ini`, `pyproject.toml`, `tox.ini`, `setup.cfg`, `sitecustomize.py`, `*.pth`, etc., **plus every path referenced by `test_patch`** (unknowable from inside the sandbox). Fixes must target library code only.
- **Unsubmitted work is still graded.** If the agent never calls `submit_patch()` but left non-empty working-tree changes, the fallback extraction captures them and Phase 2 still runs (HR §8.1). An empty patch means *nothing was ever written*, not "forgot to submit".
- **Scratch files ride into the patch.** `git add -N .` includes every untracked file under `/workspace` — repro scripts belong in `/tmp` (HR §10.3).

### 1.2 The resolution criterion (exact)

A task is **resolved = True (score 1.0)** if and only if (HR §8.2 step 5):

1. the patch applied (one of the 4 passes succeeded), **and**
2. `pytest` exited **0**, **and**
3. `_validate_junit_xml` confirms the report exists, `passed_tests > 0`, `failures == 0`, `errors == 0`, and **every required test node explicitly passed without being skipped**. Required nodes = `FAIL_TO_PASS` + `PASS_TO_PASS` lists when present, otherwise test functions extracted from `test_patch`.

**There is no partial credit.** Fixing 6 of 7 required tests scores exactly 0. Passing every test but leaving one required sibling *skipped* also scores 0 — the skipped-sibling prefix-matcher mechanism that makes `rich_3486` and `fastapi_14186` structurally never-resolvable even with their gold patches (SCORE §0, §3-H; 755554, 757893 CAPTURED).

Two honest caveats on the criterion (SCORE §0):

- **"Resolved" is an upper bound on correctness.** A community mutation audit found 24/163 (14.7%) planted broken fixes still marked resolved — inverted booleans and off-by-one edits escape most often (756400 CAPTURED).
- **"Not resolved" is not necessarily a brain failure.** In a 1,143-fix audit across 36 libraries, 277 (24%) *correct* fixes failed verification purely on scorer conventions: `-p no:anyio` killing fixtures (79), overwritten `pytest.ini` (101), non-collectable `.py` targets (65), skipped-sibling matching (24+2), 10 MiB JUnit output-cap truncation (8) (757893 CAPTURED).

### 1.3 The metric, the splits, and the leaderboard math

**Metric:** Resolution Rate ∈ [0, 1] = resolved / total tasks in the evaluation split (HR §8.2; OV "Issue Scoring": "the percentage of patched repositories that pass the validation tests").

**Populations — keep these five sets separate; never average them** (SCORE §5.3):

| Set | n | What it is |
|---|---|---|
| Public practice/training tasks | **129** | Local eval corpus (`tasks.jsonl`, MEASURED). **Not scored on Kaggle.** Repos: fastapi 67, rich 48, requests 13, httpx 1. |
| Public LB split | **58** | Hidden tasks from **private repos**; every published score = floor(k/58) (CSV-verified). |
| Total hidden eval | **~120** | Public + private splits run in the **same** 12 h run (743063 STAFF via SCORE §5.3). 58×2 = 116 ≈ 120. |
| Private split | **~60–62** | ESTIMATE (754295; 120−58). Finals and the $10k bonus are decided here. |
| Strictly valid discrimination set | **68** | Gold passes AND empty fails in 756400's audit (fastapi 29, rich 39, requests 0, httpx 0). The local A/B denominator. |

The test set was curated from **private repositories** under the same pipeline as the training set, with an extra "near-completion with frontier models" filter; the training repos do **not** appear in it (DATA; 747248 STAFF via SCORE §5.3). **Confirmed verbatim live (OFFICIAL-LIVE, Nov 14):** "There are about 120 tasks in the test set, evenly divided between the public and private splits. The test set was curated from a set of private repositories." Hidden tasks are staff-confirmed to **validate 100% with a gold patch** (744370 STAFF, Sept 29 — six weeks old, not re-confirmed; BRIEF S10).

**Leaderboard quantization (CSV-verified, BRIEF §5; SCORE §5.3):** score = `floor(k/58 × 100)/100` — *truncated*, not rounded. The raw per-task increment is 1/58 ≈ 0.01724, but display truncation produces:

| k solved | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 17 | 58 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Display | 0.00 | 0.01 | 0.03 | 0.05 | 0.06 | 0.08 | 0.10 | 0.12 | 0.13 | 0.15 | 0.17 | 0.18 | 0.20 | 0.22 | 0.24 | 0.29 | 1.00 |

Structural holes (no integer k produces them): 0.02, 0.04, 0.07, 0.09, 0.11, 0.14, 0.16, 0.19, 0.21, 0.23, 0.25–0.28.

**Leaderboard state.** Nov 11 CSV snapshot (independently re-verified by script this pass: 5,439 teams, 16 distinct scores, **every** score = floor(k/58), zero exceptions): top **0.29 = 17/58** (Yurnero, 18 entries); 0.24 bucket 12; 0.22 bucket 81; 0.20 bucket 445; 0.18 bucket 949; 0.17 bucket 992; 0.15 bucket 801; median **0.15**. **Live Nov 14 (OFFICIAL-LIVE):** top still **0.29** (Yurnero, 18 entries); the 0.24 bucket grew to **13 teams**; overview participation **5,678 teams** / 6,372 participants / 16,502 entrants / 45,677 submissions. The whole 0.15–0.24 band is one statistical cluster. The LB **retains each team's best score** (537 improvers, 0 decliners Nov 5→11 — structural, not skill). The live leaderboard carries Kaggle's official note: *"This leaderboard is calculated with approximately 50% of the test data. The final results will be based on the other 50%, so the final standings may be different."*

**Noise (CAPTURED, multiple independent teams):** unchanged bundles rerun 1–4 tasks lower (0.24→0.17, 757588; 0.20→.18/.17/.17/.17/.13, 756438); run-to-run sd ≈ 1.5–3 tasks per 58; per-task flip rate 10–13% (750907, two teams) up to 15% (747168). Published scores are likely best-of-several-tries. **Single-run deltas < 4 tasks are noise.**

### 1.4 The budgets that bound a scored run

| Budget | Official behavior | Source |
|---|---|---|
| **Global wall clock** | **12 h for the whole submission**, inclusive of sandbox setup **and vLLM startup**, exclusive of patch validation. Public + private tasks share the same run, sequential. | OV "Issue Scoring"; BRAIN §4.3 (staff-verified synthesis) |
| **Exceeding 12 h** | Competitor-reported: **score zero** (all-or-nothing). Staff question 756963 **unanswered** — treat as true and design worst-case < 12 h. | 756622 CAPTURED; BRIEF C13 |
| **Per-task budgets** | From your `eval_config.yaml` (`evaluation:` key): `timeout_seconds` (single command), `max_tool_calls`, `max_time_minutes` (agent loop only — setup excluded), `max_turns`. **On the scorer, defaults = NO limit** for these four fields (743063 STAFF) → your eval_config is load-bearing. | HR §7.1; SCORE §1.3 |
| **Harness defaults (if unset)** | CLI: 60 min / tool-calls None / 500 turns / 300 s command. `inference.py`: 100 tool calls. Sample submission: 1 min / 10 calls / 50 turns. | HR §7.1 |
| **Submission cadence** | **1 submission/day**, **one pending at a time** (400 FAILED_PRECONDITION, no cancel), up to **2 final submissions** selected for judging; team ≤ 5; merger combined-count cap = 1/day × days running (≈70 by Dec 2). Queue stalls **36–52 h** (Nov 11) **worsening to 80+ h** for the Nov-9 cohort (live Nov 14); rescore **paused** since Sep 28; no staff acknowledgment. | RULES §1–2 (OFFICIAL); BRIEF S2/S3/C18 (CAPTURED); live thread 747519 (OFFICIAL-LIVE) |

### 1.5 The serving environment (official)

4 × NVIDIA L4 (24 GB each, sm_89), vLLM **0.19.1**, `tensor_parallel_size=4`, `gpu_memory_utilization=0.80`, `max_model_len=32768`, `dtype=bfloat16`, quantization auto-detected (compressed-tensors W4A16 → Marlin kernels), `tool_call_parser="gemma4"`, `reasoning_parser="gemma4"`, `enable_thinking=True`, LoRA `max_loras=8 / max_lora_rank=128`, endpoint `127.0.0.1:8000/v1` via LiteLLM `num_retries=5` (HR §3.1/§3.3). Context management: EventsCompaction `interval=5, overlap=2, token_threshold=14336, retention=5` per HR §7.2 (`scripts/inference.py`); ContextCache `min_tokens=2048, ttl=1800, intervals=10`; ModelRetryPlugin 5 retries with backoff. Sandboxes: `swebench-sandbox:latest` (python:3.13-slim + shims), `network_mode="none"`, 4 GiB RAM, 2 vCPU, warm-pool wipe between tasks (HR §4.1).

**Known harness bugs that are part of the scored environment** (do not "fix" them locally — they are parity): the gemma4 **array-argument parser infinite loop** freezes the server and zeroes every remaining task (753973, unfixed, new victims Nov 8–9); **`reasoning_content` dropped between tool calls** in public wheelhouse v31 (744354 — staff claimed a fix Oct 1, but a Nov 11 repro shows v31 still drops; *managed-scorer state unknown*); the double-JSON tool-result bug is **fixed** in 0.2.11/0.2.13 with a residual escaped-`new_string` write bug (744272). Compaction permanently drops tool calls/results (only text survives; staff ruled out ADK v2 through finals, 754783/748287). **Verified live Nov 14: no staff fix announcements since Nov 11** — the model thread (748287) and queue thread (747519) show only competitor activity; all staff badges are on month-old posts. Plan for the environment as-is.

### 1.6 Model eligibility and the bonus track

- **Single base model per submission; every agent/subagent must use the same variant** (per-agent LoRA adapters allowed) — 748287 STAFF, pinned.
- The **Sept 29 packaged HARNESS_README is stale**: its `ALLOWED_MODEL_NAMES` shows 31B-only. The **live Overview lists four QAT variants — CONFIRMED LIVE Nov 14 (OFFICIAL-LIVE)**: "At present, we only support the following Gemma 4 model variants: `gemma-4-31b-it-qat-w4a16-ct` (main), `gemma-4-12b-it-qat-w4a16-ct` (registered, not bonus-eligible), `gemma-4-e4b-it-qat-w4a16-ct`, `gemma-4-e2b-it-qat-w4a16-ct` (bonus)", followed by "Every agent and subagent in your submission must use the same model. It is not possible to mix models within the same submission." The E4B/E2B aliases are additionally sanctioned verbatim by staff thread 748287. (GUIDE §6.1; BRIEF §2a; live Overview capture.)
- **$10,000 small-model bonus** (host OP 751104, verbatim): "$10,000 to the highest-ranking submission utilizing Gemma E2B or Gemma E4B. Final scores are based on the private test set performance." Eligibility: must be **one of the team's two selected final submissions**; stays fully eligible for main prizes and Paper Track (double-count). Small models scored under **identical conditions** ("1. Yes, everything is the same." — same 4×L4, 12 h, same budgets; 748287 STAFF).
- **Bonus deadline ambiguity STILL unresolved live (Nov 14):** the live Prizes section still contains both "Deadline: Same submission deadlines apply as the main track prizes" **and** the stray "Submissions must be made by November 12, 2026 at 11:59PM UTC" sentence (the latter sits in the Paper-Track paragraph). Only substantive answer remains a competitor EXPERT: Dec 2 (the Nov 12 line is misplaced Paper-Track text). No staff confirmation. Working assumption **Dec 2**; the safe internal milestone (Nov 12) has now passed. (BRIEF S7; 757244; live Overview capture.)
- Deadlines (OFFICIAL, OV): Paper Track **Nov 12** (now passed), Entry + Team Merger **Nov 25**, Final Submission **Dec 2**, all 23:59 UTC.
- The bonus track has its **own daily leaderboard notebook** — see §1.7.

### 1.7 The separate bonus leaderboard (small-model notebook)

The bonus track has a separate leaderboard — **not a separate competition**, but an official Kaggle notebook that republishes the main public leaderboard filtered to small-model (E2B/E4B) entries. Verified live 2026-11-14.

**What it is.**
- URL: `https://www.kaggle.com/code/ryanholbrook/gemma-4-developer-agent-small-model-leaderboard`.
- **Official:** owner Ryan Holbrook (Kaggle staff); viewers Ashley Oldacre and Elan Markowitz (staff). Apache 2.0. Linked from the bonus thread 751104 host OP and the Overview's "Daily Leaderboard Tracking" line.
- **Same submission flow:** there is no separate bonus upload (§1.6). A bonus entry is a normal submission whose base model is E2B/E4B; the notebook filters the main public LB to teams that have such a submission.
- **Same metric:** `PublicScore` is the same `floor(k/58)` resolution rate on the same 58-task public split — confirmed from the live values (0.12 = 7/58, 0.10 = 6/58, 0.08 = 5/58). The bonus does **not** use a different scoring method; it is a filtered view of the same score.

**Live state (2026-11-14).**
- **Scheduled** notebook, **Version 27 of 27**, last run **6 h ago** (25.3 s, successful), 7,404 views, 86 votes, 64 copies. The Nov-6 staleness concern (amunozo's nudge in 751104, no staff reply at the time) appears **resolved** — it now runs on a daily schedule.
- Data timestamp inside the output: **"Last Updated: 2026-11-12 23:56 UTC"** — the displayed standings lag the run by ~1 day. Check this timestamp before using the standings for a decision.
- Shows the **top 100 teams** (`TeamName`, `PublicScore`, `Rank`); the full standings are in `leaderboard.csv` in the notebook output (`kaggle kernels output ryanholbrook/gemma-4-developer-agent-small-model-leaderboard -p <dir>`).

**Eligibility mechanics (notebook text, verbatim):**
> "To be eligible for the prize, the submission must be one of your two selected submissions (selected either manually or automatically) at the end of the competition. The leaderboard below shows *all* teams with a small model submission. Teams will be dropped from the private leaderboard if they do not have an eligible submission."

So the public bonus notebook is a **superset** (all small-model teams); the **private** bonus ranking drops teams without an eligible final. Selection can be **manual or automatic** (Kaggle auto-selects your best two if you do not choose). This is consistent with the "one of two finals" rule (§1.6) and clarifies how the private bonus field is formed.

**Current standings (data 2026-11-12 23:56 UTC; top 100 captured):**

| Rank | Team(s) | PublicScore | = k/58 |
|---|---|---|---|
| 1 | amunozo | 0.12 | 7 |
| 2 | Tergel Munkhbat | 0.12 | 7 |
| 3–22 | 20 teams (Amanie El-Hajj, Smart Manoj, Civitasmass, Aji Samudra, …) | 0.10 | 6 |
| 23–100 | 78 teams | 0.08 | 5 |

Distribution: **0.12 ×2, 0.10 ×20, 0.08 ×78**; 100+ eligible teams total. The bonus race is **far below the main LB** (top 0.12 vs 0.29) and **densely clustered**: one task (0.017) separates the 0.10 cluster (ranks 3–22) from the 0.08 cluster (ranks 23–100), so small absolute gains move rank a lot — do not over-read rank. Notable: amunozo (who nudged about notebook freshness) leads; Smart Manoj (the EXPERT who answered the bonus-deadline question) is 4th; several intel actors (Mehmood Zafar, M. A. Quddus, Özgün Genç) sit at 0.08. Full capture: `scratch/bcf-live-recheck-2026-11-14/pages/bonus-leaderboard-top100.csv`.

**Strategic read for BCF.** The $10k is contestable with a modest absolute score — the current bonus top is only 7/58, so a working E4B agent scoring 0.10–0.15+ would be competitive. But BCF has **no E4B empirical score yet** (BRAIN; BRIEF §2c), so this is an opportunity, not a forecast. The winner is decided on the **private** set (host OP), and the public notebook is best-retained and noisy like the main LB: optimize private-set robustness, use the notebook for race visibility, not as a target to overfit. Calibration specifics in §7.5.

---

## 2. The local harness — what your setup guide builds

### 2.1 Same engine, same criterion

GUIDE builds a **local replica of the Kaggle scoring environment** on one RTX 5090 (32 GB, sm_120), on Zorin 18.1 native (Track A) or WSL2 Ubuntu 24.04 (Track B, probe-gated). The pinned stack is the scorer's stack (GUIDE §7.1; PAR §1):

| Component | Pin (both local and remote) |
|---|---|
| Harness libs | swegemma **0.2.11**, adk-submission **0.2.13**, google-adk **1.36.1** |
| Inference | vLLM **0.19.1**, torch **2.10.0+cu128**, transformers **5.5.x**, host Python **3.12.13** |
| Wheelhouse | dataset `metric/gemma-4-developer-agent-wheelhouse` **v31**, dataset-version **19987205**, 41 wheels, installed `--no-deps --force-reinstall` (notebook-faithful) |
| Parser identity | `gemma4_tool_parser.py` SHA-256 `682b2152b76c031df9c58c3ffbb5b243945be5d8957ebdce00faef1b9de6b889` |
| Sandbox | `swebench-sandbox:latest` built from the zip's own `docker/Dockerfile.sandbox`; docker backend enforces `none` / 4 GiB / 2 vCPU automatically |
| Model | the same `-qat-w4a16-ct` checkpoint(s), bf16, gemma4 parsers, thinking ON |

Because `swegemma eval` (or the Python driver) calls the **same `Evaluator.evaluate_task` → `verify_task` code path** the scorer uses, the local `resolved` flag for a given patch in a given environment is computed by the same rules as §1.2. **This is the core parity fact: grading is identical; what differs is the population, the trajectory-producing serving path, and the environment state.**

### 2.2 The three local run paths

1. **`swegemma eval` CLI** (HR §9.1; GUIDE §5.2) — the workhorse. Flags: `--task-id/--task-ids`, `--sandbox {docker,subprocess}`, `--concurrency`, `--shard-index/--num-shards`, `--max-tool-calls/--max-time-minutes`, `--skip-agent-patch` (empty-patch audit), `--models-yaml`. **Caveat:** whether the CLI honors the submission's `eval_config.yaml` or only its own flags is UNVERIFIED — mirror the four values via flags and **verify the effective "Task Budget" block in `logs/<id>.log`** every new build (GUIDE §5.2; SCORE §1.3).
2. **Organizer-faithful Python driver** (GUIDE §4.10d, adapting GS §4–5) — reads `eval_config.yaml` exactly like `scripts/inference.py`, constructs `VllmServer`/`EvalConfig` explicitly, and **echoes EVAL_CONFIG / COMPACTION / CONTEXT_CACHE** every run. Recommended when you need budget/compaction certainty.
3. **Phase-2-only audits** — `--skip-agent-patch` for the empty side; a `verify_task` driver with `prediction = task["patch"]` for the gold side (CPU-only, no GPU). These calibrate the *environment*, not the brain (§6.1).

**Backend discipline:** use `--sandbox docker` for every run feeding a decision — it is the scorer-default backend and the only one with matching network/Python/quota semantics. The GS notebook itself uses `sandbox='subprocess'` (GS §5) — a documented organizer convenience, **not** the parity configuration. Subprocess has no air-gap and no quota; the requests failure set alone flips several tasks between backends (754586). Never mix backends within an A/B pair. (SCORE §1.5.)

### 2.3 BCF's shipped budgets (MEASURED this pass from the submission trees)

| Track | `timeout_seconds` | `max_tool_calls` | `max_time_minutes` | `max_turns` |
|---|---|---|---|---|
| 31B main (`02-bcf-brain-31b/submission/eval_config.yaml`) | 180 | 50 | 4.5 | 50 |
| E4B bonus (`03-bcf-brain-e4b/submission/eval_config.yaml`) | 150 | 40 | 4.0 | 40 |

These four values are what Kaggle will enforce (scorer defaults = no limit, §1.4). Worst-case whole-run arithmetic (BRAIN §4.3, conservative 60 s setup/task + 600 s startup + 1,800 s reserve):

| Track | Cap | N=120 worst case | +reserve | N=129 stress |
|---|---|---|---|---|
| 31B | 4.5 min | 40,200 s = **11.17 h** | 42,000 s = 11.67 h | 43,170 s = **11.99 h (marginal)** |
| E4B | 4.0 min | 36,600 s = **10.17 h** | 38,400 s = 10.67 h | 39,300 s = 10.92 h |

Expected case is far below the cap (75% of public tasks are one-line/few-lines; expected mean ~2.5–3.2 min 31B / ~1.8–2.5 min E4B → ~6–7.5 h / ~5–6.5 h). **Decision rule:** raise 31B to 5.0 min ONLY if measured setup ≤ 35 s/task AND extrapolated 120-task total ≤ 11.0 h; lower to 4.0 if setup ≥ 65 s or N ≥ 125 confirmed. Never ship 4.5 min at N=129 on assumption. (BRAIN §4.3.)

### 2.4 What local artifacts tell you

Every run writes `summary.json` (aggregate resolution_rate, per-repo, errors), `task_results.jsonl` (per-task resolved/error/exit_code/budgets/duration), `patches/<id>.patch`, `test_outputs/<id>.log` (full Phase-2 pytest), `traces/trace_<id>.json` (ATIF trajectory), `logs/<id>.log` (Phase-1 transcript incl. the Task Budget block) (HR §9.2). Add your own `PINS.txt` / `RUN_META.json` per run (stack pins, tree sha256, mask version, backend, concurrency, cold/warm, wall time) — without it, runs are incomparable a week later. SCORE §2–§4 is the artifact-by-artifact interpretation guide and the `resolved=False` decision tree (branches A–K); it is the operational companion to this explainer and is not duplicated here.

---

## 3. The parity matrix — component by component

Parity classes: **EXACT** (same value/code), **FUNCTIONAL** (differs but behaviorally equivalent for scoring), **DIVERGENT** (differs in a way that can move results — register it), **UNKNOWN** (scorer value not settled by any local source). D# = PAR §8 divergence register.

| Component | Official scorer | Local harness | Class |
|---|---|---|---|
| Resolution criterion & verifier | `verify_task` + JUnit validation (HR §8.2) | same code path | **EXACT** |
| Patch extraction | `git add -N . && git diff --binary` + fallback | same | **EXACT** |
| Anti-tampering reset | protected paths + test_patch paths | same | **EXACT** |
| Agent protocol | 7-section prompt, 9 tools, 3 nudges, budget gates | same | **EXACT** |
| Harness libs / vLLM / parser | 0.2.11 / 0.2.13 / 1.36.1 / 0.19.1 / SHA 682b2152… | same pins (verify SHA) | **EXACT** (D10 drift risk) |
| Sandbox image & quotas | python:3.13-slim, none/4GiB/2vCPU | same image, docker backend | **EXACT** (D12/D13 if misused) |
| Per-task budgets | from eval_config.yaml | same values, mirrored via flags + verified | **EXACT** (CLI honoring UNVERIFIED) |
| Compaction threshold/overlap/retention | 14,336 / 2 / 5 | same | **EXACT** |
| Compaction **interval** | HR says 5 (`inference.py`); GS notebook 15 | probe installed source; echo | **UNKNOWN** (D11) |
| Context cache / retries | 2048/1800/10; 5 retries | same | **EXACT** |
| Model checkpoint | `-qat-w4a16-ct`, bf16, Marlin | same | **EXACT** |
| GPU / tensor parallel | 4×L4, TP4 | 1×RTX 5090, TP1 | **DIVERGENT** (D1: all-reduce order → token outputs differ even at temp 0) |
| max_model_len | 32,768 | 32,768 target; KV probe may force 16,384 fp8 / ~10k bf16 | **DIVERGENT if reduced** (D2) |
| KV dtype | auto = bf16 | bf16 first; fp8 only if forced | **DIVERGENT if fp8** (D3, ≤0.7 pt reported) |
| gpu_memory_utilization | 0.80 (HR) / 0.90 (GS notebook) | 0.90 | **FUNCTIONAL** (memory-only, D9) |
| Decode speed | 33–35 tok/s MEASURED on 4×L4 | ~50–80 tok/s ESTIMATE | **DIVERGENT** (D5: local times under-predict remote) |
| Prefill speed | 4×L4 aggregate > 5090 dense | possibly slower locally | **DIVERGENT** (D6: mixed speedup) |
| Global 12 h kill / queue / slots | enforced by Kaggle | none — self-enforce + extrapolate | **DIVERGENT** (D7) |
| OS / driver / image digest | unpublished managed image | Ubuntu 24.04-class, driver 580 | **FUNCTIONAL/UNKNOWN** (D16) |
| WSL2 overhead (Track B only) | n/a | ~2–5% compute, exec hop, tail-risk bugs | **DIVERGENT** (D8) |
| **Task population** | ~120 hidden private-repo tasks | 129 public training tasks | **DIVERGENT — the big one** (§4.1) |
| Environment dependency state | hidden gold-validates 100% (staff) | public wheelhouse gaps + wheel shadowing | **DIVERGENT** (§4.4) |
| Reasoning-drop fix state | UNKNOWN (staff claimed fix; v31 public still drops) | v31 drops (must REPRODUCE) | **UNKNOWN** (D10; C4 canary) |
| enable_sandbox_testing | default True; scorer setting UNKNOWN | True (default) | **UNKNOWN** (757564) |
| Leaderboard display | best-retained, floor(k/58), noisy | single-run raw rate | **DIVERGENT** (§4.2/§4.5) |

---

## 4. Where parity breaks — and which direction it pushes your score

### 4.1 Population shift (the biggest gap)

Local evals run on the **129 public training tasks**; Kaggle scores **~120 hidden tasks from private repositories** with **no training-repo overlap** (DATA; 747248 STAFF). This is a double shift: different tasks *and* different repos. Concretely:

- **Cue richness differs.** Public statements average 3.4 localization cues; 98/129 contain file/grep anchors (taxonomy insight 7 via SCORE §5.1). Private-repo statements are sparser on average, so public localization hit-rates **overstate** hidden localization ease. BCF's public hit@3 96.9% is additionally an extraction-biased upper bound (partial sources ≤ 30 files; BRAIN).
- **URL-only/screenshot tasks** (~18–23 public, almost all rich; `hints_text` empty for all 129) arrive as plain text URLs in the air-gapped sandbox — the reproducer behind the link is unreachable. Scored-env handling is staff-unconfirmed (757149). BCF treats sparse/URL-only as a first-class path (never-fetch, reconstruct from snapshot).
- **Difficulty mix differs.** 35 of 38 multi-file gold tasks were never solved by anyone in the public corpus (753524 CAPTURED); the hidden mix is unknown. A config tuned to the public one-line/few-lines majority can be badly calibrated for hidden multi-file tasks.
- **Documented transfer failure:** a 50%-public agent **timed out on the hidden set at 15 min/task**; with a 5-min cap + thinking off it scored only 0.05 public (756400 CAPTURED). Public strength does not guarantee hidden survival.

**Direction: local rates tend to OVERSTATE hidden capability** (cue richness, familiar repos) — but see §4.4 for effects in the opposite direction.

### 4.2 Denominators and quantization

A local "resolution rate" is meaningless without its denominator and mask. The raw 129 contains:

- **5 empty-pass free points** (2 fastapi + 3 requests; the requests ones pass only because the bundled wheel shadows the patched repo) — they inflate every config equally and inject A/B noise (756400, 747248).
- **27+4 fastapi dependency-gap tasks** (tests import `inline_snapshot`/`dirty_equals`, absent from the wheelhouse → collection fails regardless of patch; 756587 + BCF local verification of 4 extra candidates).
- **~12 requests httpbin-fixture tasks** (757661) and 8 connect-timeout tasks under docker-no-network (754586) — backend-conditional.
- **2 structurally never-resolving tasks** (`rich_3486`, `fastapi_14186` — skipped-sibling matcher bug; 757893/755554).
- **13 reference-fix failures, 7 timeouts, 2 other** in the gold audit (756400).

Net: only **68/129 (52.7%)** are discrimination-valid (gold passes AND empty fails). The same brain can "score" 0.35 raw and 0.55 masked; **only the masked number discriminates configs**. And neither is the LB: the LB denominator is 58 *hidden* tasks, quantized by floor(k/58). **Never average or directly compare these sets** (SCORE §5.3). Always report `(n, mask version, environment)` with every rate.

### 4.3 Hardware and serving numerics

- **TP1 ≠ TP4.** Tensor parallelism changes all-reduce reduction order → token-level outputs differ even at temperature 0. Bitwise trajectory comparison is meaningless; **compare task metrics with replication** (PAR §5.6, D1). Float non-associativity makes LLM inference non-deterministic even at temp 0 (750521 PRIMARY).
- **KV ceiling.** Gemma-4-31B's heterogeneous sliding/global layers make 32k context fit uncertain on one 32 GB card. The startup log's `GPU KV cache size: N tokens` decides: N ≥ 32768 → full parity; else fp8 KV (halves bytes; ≤0.7 pt reported impact) and/or reduced `max_model_len` (expect 16,384 fp8 / ~10k bf16). BCF's steady-state context is < 12k by design, so a reduced window is tolerable — **but any A/B relying on long-context behavior is non-predictive** (GUIDE §4.9; D2/D3).
- **Speed asymmetry.** Local decode is ~1.5–2.3× faster (ESTIMATE), but prefill-heavy steps (compaction summarizer) may be *slower* locally (4×L4 aggregate TFLOPS > 5090 dense). Local wall-clock caps must be **re-derived for 4×L4 rates before shipping** (§6.3). A +5% local step cost blew a 12 h Kaggle run (752017 CAPTURED).
- **Seed ≠ determinism.** Identical configs flip 10–15% of tasks between runs locally too (747168: 19/123). Every single run is one sample.

### 4.4 Environment and scorer conventions

This is where local can be **pessimistic** relative to hidden:

- **Dependency gaps are a PUBLIC-environment artifact.** The 27+4 fastapi collection failures and requests httpbin failures exist in the public wheelhouse locally *and on the public Kaggle notebook environment* — they are parity, not your bug. **Do not patch-install missing packages into the sandbox** (legality asked in 744370, never answered). The hidden environment is staff-confirmed gold-clean (744370), so tasks that are locally impossible may be hidden-solvable. Whether the hidden verification container provisions deps differently is unanswered (757661; confirmed still unanswered live, Nov 14).
- **Wheel shadowing.** The bundled release wheels (fastapi/requests/httpx/rich) can shadow the patched `/workspace` repo (site-packages precedes the `.pth` workspace entry) → requests tasks pass with EMPTY patches locally. Fix in the *calibrated* sandbox variant (remove repo-under-test wheels or put `/workspace` first on sys.path), then re-audit: `requests_7309/7315/7427` must fail empty (747248 PRIMARY; SCORE §5.4 step 2).
- **Scorer conventions block correct fixes** (the 24% audit, §1.2): `-p no:anyio`, overwritten `pytest.ini`, non-collectable targets, skipped siblings, JUnit 10 MiB cap. These apply on Kaggle too — they are not local-only. BCF's doctrine response: library-code-only fixes, own repros never rely on anyio fixtures or repo pytest.ini, keep verification output small (BRAIN §4.6).
- **Gold ceiling depends on environment** (SCORE §1.7 timeline): 43/129 gold-pass in the broken public image, 52 plain notebook, 71 subprocess, 73–74 in the Nov audits, **127/129 in a calibrated scorer-like sandbox** (751487; the 2 holdouts = the never-resolve pair). Always state the environment with any gold count.

### 4.5 Process constraints

Local iteration is unbounded; Kaggle is not. The 12 h whole-run kill (score zero if exceeded, as-reported), the 1/day + one-pending gate, 36–52 h queue stalls, paused rescores, and the best-retained public display together mean: **a config that is slightly better locally can be catastrophically worse remotely if it times out**, and a public score is a *best-of-N sample*, not a measurement. You cannot rehearse queue pathology locally; you can only self-enforce budgets, extrapolate total runtime with headroom, and keep a validated fallback bundle (D7; BRAIN §7).

### 4.6 Scorer-side unknowns (no local source settles these)

Verified live Nov 14: **still no staff answers** to any of these (discussion threads show only competitor activity since Nov 11). They remain open; plan for the environment as-is.

| Unknown | Why it matters | Probe / hedge |
|---|---|---|
| Compaction interval (5 vs 15) | compaction frequency → context-loss dynamics | grep installed swegemma source; echo config; register (D11) |
| Reasoning-drop fix on managed scorer | thought retention changes agent behavior | C4 canary must REPRODUCE the drop on public v31; design retention-agnostic (BCF already is) |
| `enable_sandbox_testing` during scoring | whether in-sandbox pytest is available | assume True (default); keep verification targeted/time-bounded (757564) |
| Timeout semantics (cut vs score-0) | whole-run cliff | design worst-case < 12 h regardless (756963) |
| Hidden container dep provisioning | whether public gaps touch scoring | staff anchor says gold-clean; calibrated sandbox is the closer proxy (757661) |
| Exact wheelhouse/image digest | residual parity drift | pin what is knowable (SHA); treat residual as noise; replicate (757782) |
| Private multi-run / error-fallback semantics | finals selection | treat each final as if it must stand alone (BRIEF §6.1) |

### 4.7 "Resolved" is an upper bound

Even a perfectly replicated local rate overstates *correctness*: 14.7% of planted broken fixes escape the verifier (inverted booleans, off-by-one). For paper-track claims, add mutation-style sanity checks and keep error-path assertions in your own repros (756400; SCORE §7.20).

### 4.8 Direction summary

| Effect | Local vs hidden | Mechanism |
|---|---|---|
| Cue-rich public statements, familiar repos | local **higher** | population shift (§4.1) |
| Empty-pass free points | local **higher** | wheel shadowing / non-discriminating tasks (§4.2) |
| Faster decode → fewer timeouts | local **higher** | hardware (§4.3) |
| Dependency-gap zeros, httpbin failures | local **lower** | public env artifacts absent from hidden gold-clean env (§4.4) |
| Sparser private statements, harder mix | local **higher** (overstates) | population shift (§4.1) |
| 12 h kill, parser freeze, infra incidents | remote **catastrophically lower** | process + RUN-radius bugs (§4.5) |
| Local KV ceiling → earlier overflow | local **lower** on long tasks | hardware (§4.3) |
| Best-of-N public display | published LB **higher** than a single run | process (§4.5) |

Because effects run in **both directions**, no fixed offset converts local → LB. You must learn the mapping empirically (§6.2).

---

## 5. Documented evidence: local scores vs. leaderboard scores

Learn these numbers (SCORE §5.2; all CAPTURED):

| Case | Numbers | Source |
|---|---|---|
| Local tie → hidden divergence | Two configs tied **28/74 locally** scored **0.17 vs 0.10 hidden**; a **9–0 local win** scored LOWER hidden; "our local screen never ranked our hidden scores" | 751973 |
| Public-strong → hidden timeout | 50%-public agent timed out hidden at 15 min/task; 5-min cap + thinking off → 0.05 public | 756400 |
| Unchanged bundle rerun | public 0.24 → 0.17 (14→10 of 58); another 0.20 → .18/.17/.17/.17/.13 | 757588 / 756438 |
| Byte-identical ZIP, infra regime | same sha256 ZIP: **0.18 → 0.01** (~10 tasks vanished; attributed unconfirmed to the array-parser freeze) | 750521 PRIMARY |
| Identical files, sampling regime | identical agent files score 0.12–0.22 public; 7–13 of 58 | 750974 / 751596 |
| Local repeats are noisy too | 3 local runs: 50/50/47 of 121 (SD≈2); 19/123 (15%) tasks flipped between identical passes | 750521 / 747168 |

**Reading: there are TWO noise regimes.** Sampling noise ≈ ±2 tasks per 58-task draw (±0.035); infra failures can zero 10+ tasks in one run. A 0.18→0.01 drop is not bad luck — it is a **run-health incident** (check for the parser-freeze signature: consecutive tasks with 0 LLM calls and cap-length durations). And local screens mis-rank hidden scores *even without noise*, because the populations differ. Mechanism metrics (edit-fail rate, first-edit latency, empty-patch rate, compaction count) are the leading indicators that transfer even when scores don't.

---

## 6. Calibrating local scoring to the official leaderboard

### 6.1 The seven-step calibration protocol (run once per environment change, then freeze)

Adapted from SCORE §5.4 — this is the canonical procedure; the setup guide's verification battery (GUIDE Part 5; PAR §7 items 1–14) operationalizes steps 1–3.

**Step 1 — Pin.** Install the frozen stack (GUIDE §4.6–4.7); record everything in `PINS.txt`/`RUN_META.json`. Verify the gemma4 parser SHA and run the **reasoning-drop repro** (PAR §7 item 11): local must REPRODUCE the v31 drop — if local retains thoughts, the wheelhouse drifted; stop and re-pin. Never upgrade any pinned package mid-competition (newer vLLM rewrote the parser and fixes bugs the scorer still has — drift invalidates A/B).

**Step 2 — Build both sandbox variants.**
- *Scorer-faithful:* `Dockerfile.sandbox` as published, wheels as shipped. Reproduces the dep-gap ceilings; use for parity sanity checks.
- *Calibrated:* same image + missing test deps (`inline_snapshot`, `dirty_equals`, `typing_inspection`, `annotated_doc`, `pytest-httpbin`, closure `asttokens`/`executing`; period-correct Pygments for 7 rich tasks per 751487) + the wheel-shadowing fix. Use for discrimination A/B — it is closer to the hidden environment, which staff says is gold-clean.
- Verify the fix: `requests_7309/7315/7427` must now FAIL empty; `rich_3468` still passes empty → permanent mask.

**Step 3 — Gold+empty audit on YOUR sandbox.** Empty via `--skip-agent-patch`; gold via the `verify_task` driver with `prediction = task["patch"]` (CPU-only). Produce `gold_audit.jsonl` + `empty_audit.jsonl`. Reconcile the 27 dep-gap ids + 4 candidates, the requests httpbin set (12 vs 8 — your backend decides), `rich_3472` (Python-version conditional), and name the 5 empty-passers. Cross-check gold totals against the environment timeline (~73–74 faithful, ~127 calibrated); investigate deviations before freezing.

**Step 4 — Freeze the masked denominator.** Write `masks/excluded.txt` with reasons:

| Exclusion | ids | Reason |
|---|---|---|
| Structural never-resolve | rich_3486, fastapi_14186 | skipped required siblings; no patch can resolve |
| Dependency-gap (fastapi) | the 27-list + reconciled candidates | collection fails regardless of patch |
| requests httpbin/network | per your audit (12 or 8 ids) | fixture/network failures; backend-conditional |
| Empty-pass | rich_3468 + any task passing empty after the wheel fix | free points; zero discrimination |
| Python-version conditional | rich_3472 (only if sandbox py3.13) | AttributeError format differs 3.12 vs 3.13 |

Expected result ≈ the 68-valid set, composition rich-heavy. **Version the mask file; a mask change invalidates cross-run comparisons.**

**Step 5 — Paired repeats, win-both.** For any config change: run BOTH configs on the SAME frozen subset, ≥2 repeats each, seed 7 fixed, same backend/concurrency/server state. Promote only if it **wins on both repeats** (750907 two-team protocol). Record per-task flips, not just totals. Keep ~30 tasks for iteration and the rest held-out for the C6 gate.

**Step 6 — Statistics.** Wilson 95% CI for a rate; exact McNemar for paired discordance (code in SCORE §5.4). Noise rules: σ ≈ 2 tasks per 58-task draw; on a 30-task subset σ ≈ 2·√(30/58) ≈ 1.4 tasks (ESTIMATE) — a 2-task subset win is ~1.4σ, suggestive not decisive; win-both + McNemar is the arbiter. **Single-run deltas < 4 tasks are noise — never promote on them.** A 133-vs-77-run experiment reached only p=0.22 for a +9-point claim (753524) — respect how much data real significance needs.

**Step 7 — Time calibration before shipping caps.** Local seconds-per-task do not transfer. Convert via **seconds-per-million-model-tokens** (prompt+completion, sequential runs only) on both stacks (the 747857 method; SCORE §5.4 step 7). Re-derive the budget envelope with 4×L4 rates (33–35 tok/s decode MEASURED; 12.6 min startup MEASURED; ~0.5 min/task setup+verify) before applying the cap decision rule. Keep ≥1–2 h headroom under 12 h.

### 6.2 The correlation ledger — learn your own local→public mapping

Keep one row per scored submission and per gate-level local run (template in SCORE §5.5):

| Date | Config (tree sha / levers) | Local subset (masked, n=30, r1/r2) | Local full masked (n≈68) | Public score (implied k/58) | Δ public | Local→public read | Run-health flags |
|---|---|---|---|---|---|---|---|

Interpretation rules:
1. Compare masked-local to public only as **direction over ≥3 submissions**, never as a calibrated predictor.
2. A public drop ≥5 tasks with flat local = **infra/noise suspect**, not a config verdict (two-regime rule). Rerun before deciding.
3. Track **mechanism metrics** in the same ledger — they transfer even when scores don't.
4. Public LB is best-of-N: your single public run is a *sample*; your local paired repeats are the *experiment*.

### 6.3 Time calibration (the 12 h cliff)

The only local number that must transfer *absolutely* (not relatively) is total runtime, because exceeding 12 h scores zero. Procedure: measure per-task setup + agent wall + token counts locally at concurrency 1 (warm server, discard task #1); compute s/M-tokens; re-project at remote decode 33–35 tok/s and remote startup 12.6 min; add per-task setup ~60 s (sensitivity 30–90 s) and a ≥1,800 s reserve; require ≤11.0 h (31B) / ≤10.5 h (E4B) at N=120. Both finals must independently finish < 12 h (better-of-two scoring; error-fallback unanswered). (BRAIN §4.3; SCORE §5.4 step 7.)

### 6.4 What calibration cannot do

No protocol makes local scores *predict* hidden scores pointwise — the population shift is irreducible without scoring submissions. Calibration buys you: (a) a **rankable local signal** (masked paired repeats), (b) **run-health assurance** (canaries + parity signatures), (c) **runtime safety** (time calibration), and (d) an **empirical direction-only mapping** (ledger). The private split decides finals; optimize private-set robustness (OOD proxies, generic mechanisms, bounded runtime), not public-LB overfit.

---

## 7. Establishing your BCF baseline

### 7.1 What is measured today (MEASURED, CPU only — BRAIN)

| Metric | Result | Gate |
|---|---|---|
| Localization hit@3 (129 tasks, partial sources — upper bound) | 96.9% (gold rank-1 when found) | ≥80% |
| Root-cause family top-2 agreement | 71.3% | ≥70% |
| Kind accuracy | 76.0% | — |
| Anchor uniqueness | 458/477 (96.0%), 0 copy-fidelity violations | ≥90% |
| Cold spec runtime p95 | 0.266 s (3,002-file synthetic: 1.06 s) | ≤8 s |
| Warm cache | byte-identical, <0.5 s | <0.5 s |
| Submission validator (both trees) | PASS, 0 errors / 0 warnings | 0 errors |
| Cross-track skill identity | sha256-identical | identical |
| Compliance probes | 18/18 + 14/14 hardening probes | all pass |

**No GPU end-to-end score exists yet** for this design — neither local nor Kaggle (BRAIN §4.7). The v2 trees are canary-gated candidates (promote only on replicated win-both evidence). So the baseline is something you must *create* with the first pinned GPU runs, not something you already have.

### 7.2 The baseline metric bundle (definition)

Establish and record, on the pinned stack with the frozen mask:

1. **Primary — masked resolve rate:** resolved / n on your audited valid set (target ≈68), **two repeats**, reported as `(n, mask version, environment, r1/r2)`. This is the number you iterate on. Also run the frozen 30-task iteration subset for fast cycles.
2. **Mechanism dashboard** (the leading indicators that transfer): empty-patch rate, apply-fail rate, edit_file failure rate + max identical-call streak, first-edit call index/seconds, compaction count, overflow count, nudge/restart tax, timeout rate, median/p95 duration vs cap, token economy, and the wrong-file / right-file-wrong-lines / wrong-content split (patch locus vs gold). Targets from the architecture: first edit by call ~4–6, zero 3rd identical calls, ~0 compactions on typical tasks, restart tax ≤15 s.
3. **Runtime envelope:** measured per-task setup + agent wall; 120-task extrapolation ≤11.0 h (31B) / ≤10.5 h (E4B) at remote rates (§6.3).
4. **Run-health canaries:** C0 compiler, C2 telemetry/restart/include_contents, C3 parser fuzz (zero hangs), C4 reasoning-drop parity, C5 E4B serving. All green before any slot.
5. **E4B-specific gate:** a **non-zero replicated resolve rate** — hold the bonus slot at 0 (no E4B empirical score exists for this design anywhere in the capture; BRIEF §2c).

### 7.3 First-run parity checks (expected signatures — GUIDE §5.6)

Run the three staged tasks with their **gold** patches and expect the PUBLIC-wheelhouse failure signatures — a local PASS on the blocked tasks means your sandbox drifted:

| Task | Expected local outcome | Why |
|---|---|---|
| rich_3454 | gold resolves | rich 39/48 gold-pass; not in the blocked list |
| fastapi_14361 | pytest **collection error** | inline_snapshot/dirty_equals absent (27-list) |
| requests_7502 | **httpbin fixture errors** | 12/13 requests tasks fail this way |

Also verify: parser SHA, `docker inspect` = `none 4294967296 200000/100000`, the Task Budget block reads 4.5 min / 50 calls / 50 turns / 180 s (31B), reasoning-drop repro reproduces, KV-probe verdict logged. These are parity checks, **not** pass gates.

### 7.4 Translating baseline to leaderboard expectations

- **Do not predict a point value.** If your masked-68 rate is r, the naive public expectation would be ~r×58 tasks — but population shift (§4.1), environment shift (§4.4), and noise (§1.3) dominate. Documented cases show local ties hiding 0.07 hidden gaps and 9–0 local wins reversing hidden.
- **Use bands and direction.** The field (live Nov 14): median 0.15 (9/58), competitive band 0.17–0.24 (10–14/58, with 13 teams at 0.24), top 0.29 (17/58). A first public submission in the 0.10–0.20 range would be consistent with a working-but-untuned agent; treat it as a **calibration observation** for the ledger, not a verdict.
- **Spend the 1/day cadence on repeated runs of YOUR best config** (noise basis), not on copying public bundles. Expect a large final shakeup (public LB is best-of-N noise; LB rank 1 says so, 757626).
- **The private set is the target.** Bonus and finals are decided on private-repo tasks; keep an OOD proxy (e.g., FreshSWE-Py 663 post-release tasks / OOD-45, self-hosted) in selection rather than public-only tuning (BRIEF implication 17; BRAIN §4.5).

### 7.5 Bonus-track (E4B) baseline and leaderboard calibration

- **The E4B baseline is gated harder than 31B.** No E4B empirical trajectory/score exists for this design anywhere in the evidence base (BRIEF §2c). The baseline = **C5 serving canary green** (loads under the sanctioned alias, tool calls parse, zero-arg install runs, thinking observed, clean format) **AND a non-zero replicated masked resolve rate** (C6 win-both). **Hold the bonus slot at 0 replicated solves** (BRAIN R6; SCORE §6.6).
- **Local E4B evals carry all the §4 parity caveats plus E4B-specific ones:** the fix-authoring ceiling is the dominant unmitigated gap (`apply`/`check` catch syntax, not semantics); thinking is contested (C5 must observe effective thinking before any thinking-2048 arm); the array-parser freeze was first hit on E4B (C3 fuzz mandatory before any bonus run).
- **The bonus notebook uses the same scores (§1.7), so the §6.2 correlation ledger applies unchanged** — add a column for the bonus standing. Read your E4B public score against the **bonus top (0.12) and the 0.10 cluster**, not the main-LB top (0.29).
- **Rank sensitivity:** the bonus field is densely tied (20 teams at 0.10). The usual ±1.5–3 tasks of noise (±0.017–0.05) can move you dozens of ranks. Treat rank as noisy; track your own repeated score and use win-both for selection, exactly as for the main track.
- **Slot math:** the bonus entry consumes one of your two finals but stays eligible for main prizes + Paper Track (double-count). Both finals must independently finish < 12 h. If E4B never clears C6, ship two 31B variants (BRAIN §7.4).
- **Monitor the notebook's "Last Updated" timestamp** (data lags the daily run by ~1 day) and re-check the eligibility wording before locking finals.

---

## 8. Improvement roadmap (2026-11-13 → 2026-12-02)

The roadmap is the canary ladder + lever cycles + selection protocol already designed into the BCF deliverables, sequenced against the real calendar. Lever ids (E#/Y#/P#/S#/V#) are from the hardening lever inventory referenced by SCORE §6.

### 8.1 Phase 0 — environment, canaries, baseline (Nov 13–15)

1. Build the rig per GUIDE (Track A Zorin native recommended; Track B WSL2 only if the VRAM probe PASSes). Run the verification battery (PAR §7 items 1–14). Record PINS.txt.
2. **C0** official `compile_submission` on both trees (skill-tool injection + `skills:` path base; one-line fallback ready). **C2** telemetry + nudge-restart drill (byte-identical spec, tax ≤15 s) + `include_contents:none` boundary (HARD gate). **C3** parser fuzz ≥5,000 bracket-heavy scalar payloads, zero hangs. **C4** reasoning-drop parity (delta ≤1 task). **C5** E4B serving canary end-to-end.
3. Gold+empty audit → freeze mask (§6.1 steps 2–4).
4. **Baseline runs:** 30-task subset ×2 repeats + full masked set ×2 (C6), both tracks; mechanism dashboard; wall-clock extrapolation. This is your baseline (§7.2). CPU-only C1 battery is already DONE.

### 8.2 Phase 1 — first scored observations (Nov 15–18)

5. If all gates green, submit the best 31B **early in the day**; monitor PENDING (stalls now **80+ h** for the Nov-9 cohort, live Nov 14 — budget for lost days, not reruns); escalate same-day with submission ids in 747519/743683. Record the ledger row (zip sha256, score, implied k/58, queue latency, run-health).
6. E4B slot only after C5 **and** a non-zero replicated C6 resolve rate. Remember it consumes one of the two final slots but stays eligible for main prizes + Paper Track.
7. Triage the scored run with the same signatures as local (compile rejection vs timeout vs parser freeze vs empty patches). A "complete, no score" pattern suggests timeout; 0.00 with adapters suggests loading/packaging.

### 8.3 Phase 2 — lever cycles (Nov 18–25)

Prioritize each candidate change by **Priority = Frequency × Fixability × Evidence** (each 1–3; SCORE §6.2). RUN-radius gates (C0/C3) are prerequisites, always first. The failure-class → lever map (SCORE §6.1), ordered by the evidence:

| Failure class (branch) | Lever | Validation ladder |
|---|---|---|
| Edit targeting: def-line anchors, wrong-line edits (C2) | E1 family line priors (70/129 tasks lack priors) + E2 candidate-edit-lines in spec | L1 uniqueness ≥90% + hit@k no regression → L2 paired → L3 |
| Edit mechanics: stale windows, strike re-emits (C/F) | E4 window-granular strike exclusion; E8 9-line window arm | L1 anchors battery → C2-6 drill → L2 |
| Verbatim retry loops (F) | keep P5 + engine strike; do NOT add prompt rules (11 interventions resolved zero tasks on 2B-class editing, 756433) | C2-6 zero 3rd identical calls → L2 |
| Fix authoring: confidently-wrong-but-compiling (C3) | E3 informational semantic smoke; Y14 E4B thinking-2048 arm (only after C5 observes effective thinking) | C5 → L2 E4B arm → if 0 replicated solves: 31B-only finals |
| Agent timeouts on d5/large (E1) | Y4 cap decision rule; Y1 planner-only thinking 0/256; keep P3/P9 read limits | C2 telemetry → L2 → L3 wall ≤11.0 h |
| Compaction/overflow (A2) | keep <12k steady state; disk state canonical; paraphrase every result; trim skill description | C2-5 drill → L2 empty-patch rate |
| Localization misses (A1/C1) | E5 cue weights — **OOD-gated only** (public hit@k already 96.9%, extraction-biased; the 4 public misses are intrinsic) | L1 + locbench (McNemar/Wilson) → OOD → L2 |
| Collection errors / conventions (G/H/J) | **NO brain lever** — mask ids; calibrated sandbox; doctrine | gold/empty re-audit; mask version bump |
| Run-radius: parser freeze / compile reject | Y8/Y9 scalar surface; C0/C3 | L0 hard gates before ANY GPU time or slot |

Cadence (SCORE §6.4): Mon triage + pre-registered hypotheses → Tue L0/L1 CPU implementation (both-track byte-identical mirror + validator + C1) → Wed–Thu L2 paired subset ×2 → Fri analysis/ledger/promotions → Sat L3/C6 gate + submission if earned → Sun ops/monitoring. **Every engine edit re-mirrors both tracks byte-identical and re-runs validator + C1.** Entry/merger lock **Nov 25** (mergers irreversible, score-carry unanswered — pause submissions, compute combined count, get staff answers in 756693 first).

### 8.4 Phase 3 — final selection (Nov 25 – Dec 2)

8. Select the two finals on **replicated local eval** (2 runs on the fixed ~30-task set + ~106-task held-out, win-both) and cross-task-mix robustness + OOD proxy, **not single-run peak**.
9. Recommended allocation: **slot 1 = best 31B**, **slot 2 = E4B bonus** (double-count). If E4B never clears C6, fall back to two 31B variants. Use the bonus notebook (§1.7) for E4B race visibility when deciding slot 2 — but its dense clusters make rank noisy, and the private set decides.
10. Both finals must independently finish < 12 h (verify each by extrapolation). Keep the validated **fallback bundle** (tighter caps, e.g. 31B 4.0 min) and the pre-validated **monolithic variant B** (hierarchy fallback) ready at all times.
11. Re-check all open staff threads before locking (§10). Lock and submit **early on Dec 2 at the latest — never batch final-day submissions** (queues).

### 8.5 Stop/ship rules (SCORE §6.6)

**Ship (all must hold):** validator 0/0 + C0 compiler green; C2-3 restart + C2-4 include_contents pass; C3 fuzz zero hangs; C6 win-both replicated masked evidence + wall extrapolation ≤11.0 h/10.5 h; E4B additionally C5 + non-zero replicated resolves; ops checklist (early submit, fallback ready, PENDING monitor).

**Stop (any one triggers):** 0 replicated E4B solves → 31B-only finals; single-run delta <4 tasks → no promotion/reversion, repeat first; any RUN-radius signature → fix before score-chasing; extrapolated total >11.0 h → lower the cap; mask invalidation (wheelhouse/backend/Python change) → re-run gold/empty; unchanged-ZIP resubmission hoping for a scorer fix → forbidden (no rescores promised); public/private split probing → forbidden (240+ submissions vs ~70 cap, ban risk, no ruling).

### 8.6 Deadline calendar (from today)

| Date | Event | Action |
|---|---|---|
| **Nov 12 (passed)** | Paper Track deadline; safe internal bonus milestone | If paper not submitted, focus main + bonus; bonus working deadline remains Dec 2 (unconfirmed) |
| **Nov 13–15** | — | Phase 0: rig + canaries + baseline |
| **Nov 15–18** | — | Phase 1: first scored observations |
| **Nov 18–25** | — | Phase 2: lever cycles |
| **Nov 25** | Entry + Team Merger deadline | Lock entry; merger caution |
| **Nov 25 – Dec 1** | — | Phase 3: replicated final selection |
| **Dec 2** | Final Submission deadline (working bonus deadline) | Lock two finals; both <12 h; submit early |

---

## 9. Live-site verification log (completed 2026-11-14)

**Method:** the user's debug Chrome via Chrome DevTools MCP, public/logged-out view (sufficient for every item below). Raw text captures saved under `scratch/bcf-live-recheck-2026-11-14/pages/`. The Nov 11 intel capture was the diff baseline. (WebFetch was unusable — backend "Model not exist" error; curl returned only the JS shell; the authenticated Kaggle API/CLI were unavailable. The browser route succeeded.)

| Surface (URL) | Result (2026-11-14) | Effect on this document |
|---|---|---|
| **Overview** `/competitions/gemma-4-developer-agent/overview` | Issue Scoring PASS/FAIL + 12 h text unchanged; Timeline unchanged (paper Nov 12, entry/merger Nov 25, final Dec 2); **four QAT variants listed** + same-model rule explicit; bonus $10k terms unchanged (the stray Nov-12 sentence is still present); total prizes now shown $110k; participation **5,678 teams** / 6,372 participants / 16,502 entrants / 45,677 submissions; L4x4 section (96 GB, 2× quota, competition-only, no internet) | §1.6 model list CONFIRMED; §1.3/§7.4 standings updated; bonus ambiguity persists |
| **Leaderboard** `.../leaderboard` | Official note: *"calculated with approximately 50% of the test data... final results will be based on the other 50%"*; top **0.29 Yurnero** (18 entries) unchanged; **0.24 bucket = 13 teams**; quantization still floor(k/58); Public/Private tabs present | §1.3 split upgraded to OFFICIAL-LIVE; standings updated |
| **Data** `.../data` | *"about 120 tasks in the test set, evenly divided between the public and private splits... curated from a set of private repositories"* verbatim; 129 training tasks; frontier-model filter; `patch` excluded from hidden `rerun/tasks.jsonl`, `test_patch` in `secret/solution.parquet` | §1.3 populations CONFIRMED |
| **Discussion** `.../discussion` + threads **748287**, **747519** | **No new staff posts since Nov 11.** 748287 (models): latest activity is a competitor question (John Lambert, 1d ago, ranked 5654th — not staff); all "Kaggle Staff" badges on month-old Ryan Holbrook posts. 747519 (queue): Dustin's staff posts month-old; competitors report Nov-9 submissions stuck **80+ h**, tagging staff, no reply. New community resources posted: noise-measurement toolkit (Radek Maciaszek), E4B open code/data + held-out sets (Özgün Genç), "Three lessons from 22 submissions" (M. A. Quddus), offline-129 harness results (Sum YEUNG) | §1.5/§4.6/§10 confirmed still open; §1.4/§8 queue worsened |
| **Wheelhouse** `/datasets/metric/gemma-4-developer-agent-wheelhouse` | **Version 31** (880.84 MB), updated a month ago — no v32 | §2.1 pins hold; D10 unchanged |
| **Bonus leaderboard notebook** `/code/ryanholbrook/gemma-4-developer-agent-small-model-leaderboard` | Official staff notebook (Holbrook + Oldacre/Markowitz); **scheduled daily, v27, ran 6 h ago**; data "Last Updated 2026-11-12 23:56 UTC"; top 100 shown (full `leaderboard.csv` in output); same floor(k/58) scores filtered to E2B/E4B; bonus top **0.12** (amunozo, Tergel Munkhbat), 0.10×20, 0.08×78; eligibility = one of two finals (manual or auto), private drops ineligible | New §1.7 + §7.5; resolves the Nov-6 staleness concern |
| **Local CSV** (script re-verify, this pass) | 5,439 teams (Nov 11 snapshot); 16 distinct scores; **ALL = floor(k/58), 0 exceptions**; buckets match BRIEF §5 exactly | §1.3 quantization independently confirmed |

**Not re-fetched live (low risk):** the `/rules` page — submission limits (1/day, 2 finals, team ≤5, merger cap) are cited from the Sept 29 RULES snapshot (OFFICIAL) and are consistent with the live Overview timeline; re-check if a rules change is announced. The **private leaderboard tab** is hidden until finals. **Submission-side behavior** (compile acceptance, actual scoring, timeout semantics) can only be verified by a real submission — that is what the canary ladder + first slot are for.

**On-box parity gates (no web check replaces these):** when the rig is built, re-run the parser SHA check, the reasoning-drop repro, and the gold/empty signatures (§7.3; PAR §7 items 1–14).

---

## 10. Open questions (staff-unanswered as of the Nov 11 capture)

These are the load-bearing unknowns; monitor the threads and plan for the environment **as-is**. Verified live Nov 14: still zero staff posts since the Nov 5 cutoff (discussion activity is competitor-only).

| Thread | Question | Impact |
|---|---|---|
| 757244 | Bonus deadline Nov 12 vs Dec 2 | schedule bet for the $10k track |
| 756963 | Timeout semantics: cut vs score-0 | whole-run cliff (design <12 h regardless) |
| 757661 | Hidden verification container dep provisioning | whether public gaps touch scoring |
| 757564 | enable_sandbox_testing during scoring | in-sandbox verification budget |
| 757782 | Exact wheelhouse manifest / L4×4 image digest | residual parity drift |
| 757893 | Will organizers adopt the 5 scorer fixes | local denominators; rich_3486/fastapi_14186 |
| 744354 | Does the managed scorer include the reasoning fix | local/public parity; slot decisions |
| 753973 | Deploy the parser no-progress guard? | RUN-radius server freeze |
| 757783 / 757223 | External compute / third-party LLM annotation legality | data-handling freeze (keep everything local) |
| 756693 | Team merger score-carry / allowance reset | irreversible merge before Nov 25 |
| 754295 / 752220 | Private multi-run / error-fallback / better-of-two | finals selection (treat each final as standalone) |

---

## 11. Sources

**Official (Sept 29 snapshots, local):** HR (`HARNESS_README.md`) §1–§10; OV (Overview: Issue Scoring, 12 h, Timeline, Prizes, Model Selection); DATA (Data: tasks.jsonl schema, test-set curation, ~120 private-repo tasks, submission.parquet); GS (Getting Started notebook: §1 env/wheelhouse, §4 VllmConfig, §5 EvalConfig/Evaluator flow, §6 packaging); RULES (Official Rules: §1 team limits, §2 submission limits 1/day + 2 finals).

**Primary live-site captures (Nov 11, local):** BRIEF (`intel_20261111/00-intel-brief-2026-11-11.md`) §§1–7; CSV (`leaderboard-public-2026-11-11.csv`, 5,439 teams; top rows re-read this pass); thread dumps catalogued in `01-thread-manifest-2026-11-11.md` / `raw-capture-log.md` / `scratch/bcf-2026-11-11/intel_texts/topic_<id>.md`. Key threads: 743063, 744272, 744354, 744370, 747248, 748287, 750521, 750907, 751104, 751487, 751973, 752017, 753524, 753973, 754586, 754783, 755554, 756400, 756433, 756438, 756587, 756622, 757149, 757244, 757588, 757626, 757661, 757782, 757893, 757993.

**Local deliverables (read this pass):** GUIDE (setup guide, Parts 0–7); PAR (parity plan §1 target spec, §7 verification, §8 D1–D18); SCORE (scoring guide §0–§7, esp. §5 calibration); BRAIN (README verified metrics; 04 design justification §4.3 budget math, §4.4 resilience, §4.5 generalization, §4.6 pathology avoidance, §6 risk register R1–R18, §7 ops plan); BCF `eval_config.yaml` both tracks (MEASURED); `tasks.jsonl` (129 lines, MEASURED).

**Live re-verification (2026-11-14, this pass):** raw text captures in `scratch/bcf-live-recheck-2026-11-14/pages/` — `overview-live2.txt`, `leaderboard-live.txt`, `data-live.txt`, `discussion-live.txt`, `thread-748287-live.txt`, `thread-747519-live.txt`, `wheelhouse-live.txt`, `bonus-leaderboard-notebook.txt`, and `bonus-leaderboard-top100.csv` (fetched via the user's debug Chrome, Chrome DevTools MCP, public view). The bonus notebook URL came from the local thread-751104 dump (`scratch/bcf-2026-11-11/intel_texts/topic_751104.md`). Leaderboard CSV quantization re-verified by script this pass; bonus top-100 scores confirmed to follow the same floor(k/58) map.

**Evidence discipline:** competitor-reported numbers are labeled CAPTURED and attributed to their thread; organizer statements are STAFF/HOST; nothing here reuses prior intel *conclusions* — all claims were re-derived from the local files this pass. Live facts were re-verified on the live site 2026-11-14 (§9); the Nov 11 capture remains the baseline for discussion-thread detail.

---

*End of explainer. Companion operational detail: SCORE §2–§4 (artifact interpretation + failure clustering), GUIDE Parts 4–5 (build + run), PAR §7–§8 (verification + divergences). This document is the parity/calibration layer above them.*
