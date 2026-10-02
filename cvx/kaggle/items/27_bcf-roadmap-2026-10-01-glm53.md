# COMBINED MARKDOWN - combine

_Generated 2026-10-01 22:10:49 | 5 files | folder: D:\stuff\docs\taylor_fv\github\rayrite.github.io\cvx\kaggle\items\combine_

## Contents

1. 00-README-glm53.md
2. 01-ROADMAP.md
3. 02-PLAN.md
4. 03-TASKS.md
5. 04-READING.md

---

<!-- ====================================================================== -->
<!-- FILE: 00-README-glm53.md -->
<!-- ====================================================================== -->

# BCF Metadata Collection Project

**Started 2026-10-01.** Data-collection project implementing the
[metadata wishlist](../2026-10-01-bcf-decision-signals-and-metadata-wishlist/03-metadata-wishlist.md)
against the local training dataset `input/kagglecomp/kagglecomp_data_package/`
(`gemma-4-developer-agent.zip`, 21.9 GB, 524 entries). **Phases 0, 1a and 1b all ran
2026-10-01: everything capturable without harness runs is now on disk.**

- **[PLAN.md](PLAN.md)** — the multi-phased implementation plan (phases, principles, risks, decision-coverage closure).
- **[TASKS.md](TASKS.md)** — the master task list (IDs, tools, acceptance tests, dependencies, milestones, effort).
- **[ROADMAP.md](ROADMAP.md)** — analysis roadmap (A-1..A-8) + v1 agent/harness design, constraints C1-C11, build sequence R1-R6.
- **[READING.md](READING.md)** — books, videos, whitepapers, algorithms, external data — each mapped to a D-register decision.
- **[data/dataset-card.md](data/dataset-card.md)** — one-page consolidation of every static stratum (generated).
- `data/census-summary.md` + `data/deep/*-summary.md` — per-tool human tables.

## 1. How to run (Windows git-bash, from this folder)

```bash
PYTHONIOENCODING=utf-8 python tools/00_extract_static.py      # manifest + selective extraction
PYTHONIOENCODING=utf-8 python tools/10_phase1_census.py       # 129-task census
PYTHONIOENCODING=utf-8 python tools/11_graph_deep.py          # structural graph analysis
PYTHONIOENCODING=utf-8 python tools/12_testdeps.py            # test-deps vs wheelhouse
PYTHONIOENCODING=utf-8 python tools/13_snapshot_verify.py     # snapshot git state (--n 16 / --all)
PYTHONIOENCODING=utf-8 python tools/14_embedding_spec.py      # embedding format + parity
PYTHONIOENCODING=utf-8 python tools/15_features.py            # features, taxonomy v0, difficulty, strata
PYTHONIOENCODING=utf-8 python tools/18_harness_static.py      # eval_config, adapters, docker, README constants
PYTHONIOENCODING=utf-8 python tools/17_dataset_card.py        # consolidate everything
node ../scratch/2026-10-01-bcf-decision-signals/qc-tables.mjs .   # markdown table QC
```

All tools are idempotent, read the ZIP directly, stdlib-only, and need no network or MCP.

## 2. Folder map

| Path | What it is |
|---|---|
| `tools/` | Numbered scripts (00 scaffold, 10 census, 11–18 static-deep, 17 card; 2x/3x/4x/5x planned) |
| `data/zip-manifest.tsv` | Every ZIP entry: name, size, CRC-32, compress_size |
| `data/extracted/` | 147 files: tasks.jsonl, 127 graphs, sample_submission/, docker/, sandbox/, HARNESS_README.md, 3 sample embeddings |
| `data/tasks.census.jsonl` | Per-task census records (P3 seed schema) |
| `data/dataset-card.md` | Consolidated static dataset card |
| `data/harness-static.md` | Sample budgets, LoRA stubs, docker surface, README constants (line-cited) |
| `data/deep/graph-deep.{jsonl,summary.md}` | Structural async census + gold-file join + gold ranks |
| `data/deep/testdeps.{json,summary.md}` | Test-dep classification vs the 124-wheel wheelhouse |
| `data/deep/snapshot-verify.{json,md}` | Snapshot git-state verification (sample 16) |
| `data/deep/embedding-spec.{json,md}` | Embedding correspondence + format |
| `data/deep/features.jsonl`, `data/deep/stratification.md` | Statement/test features, taxonomy v0, difficulty terciles, stratification matrix |
| `data/annotations/`, `data/ledger/`, `data/reports/`, `data/watch/` | Phase 2/3/5 outputs as they land |

## 3. Everything captured without harness runs (2026-10-01)

Full tables in `data/dataset-card.md`; headline findings here. All figures local-verified.

**Corpus shape.** 129 tasks; fastapi 67, rich 48, requests 13, httpx 1; 76% from 2025–26;
single-file golds 91/129 (70.5%); median 1 file, +8/−2 lines; 0/129 gold patches touch tests;
hints empty 129/129. **Join rule:** tasks↔graphs/embeddings join 129/129 only after
`owner/repo → repo_short` normalization; the 129-vs-127 file gap = 2 shared-commit pairs
(rich_3882/3894, requests_6589/6629). Local ZIP has zero 0-byte entries (the forum's "empty
files" is a download-side artifact).

**Six decision-relevant findings:**

1. **Problem statements are prose, not tracebacks** (0/129 start with one; 6/129 contain one;
   median 418 chars) — exception-class conditioning applies to ≤6 tasks; CLASSIFY's real input
   is issue-style prose (D5). 17/129 have code blocks; 82/129 contain a URL.
2. **The async hole is REAL and structural — forum 742911 CONFIRMED.** Across 370,683 nodes
   in 129 graphs there are **zero first-class async nodes**; 460,018 calls edges are all
   sync-to-sync. Async source survives only *nested inside* 4,449 enclosing sync def/class
   nodes (93.5% of which are call-graph-connected), with no keyword stripping and no
   nested-name promotion. Implication (D4): graph+embedding retrieval can land on the right
   *enclosing object*, but async call chains are invisible — dual-path AST fallback is a
   verified requirement, not a hedge. 23/129 tasks (17.8%) touch async via gold patch or tests.
3. **Embedding correspondence solved by construction.** Every `.npz` member is named
   `<node_name>.npy` — one float32(256,) vector per node; name-sets identical 129/129. k-NN
   over embeddings joins to the call graph without guesswork.
4. **Test-dep quarantine candidates identified.** 115/129 tasks have fully-satisfied test
   imports; 14 fastapi tasks import `inline_snapshot` (13) or `dirty_equals` (2), absent from
   the 124-wheel public wheelhouse — the D11 dead-task list, pending oracle-run confirmation.
5. **Snapshots have NO history — synthetic single-commit exports.** In all 16 sampled
   snapshots (all 4 repos): HEAD → `main` == `export_ref` == one synthetic export commit;
   `base_commit` exists in neither packs nor loose objects. `git log`/`blame`/`diff-vs-base`
   are impossible in-sandbox; `git diff HEAD` is the only anchor. Any BCF phase planning to
   "consult history" must work from working tree + graph + embeddings only.
6. **Provisional taxonomy v0 is free and deterministic.** Statements carry conventional-commit
   emoji prefixes (🐛×34, ✨×14, ♻️×7, 📝×3) — 95/129 tasks get a v0 label (bug 66, feature 16,
   refactor 7, docs 3, security 1, chore 2) from prefix alone; Phase-2 LLM labeling + κ
   supersedes but now starts from a prior. Difficulty terciles (z-composite of files, churn,
   test functions, statement length) feed the D2 allocator; stratification matrix shows
   repo × async × tercile feasibility (5 of 12 cells thin — stratify on repo × async only).

Also captured: sample `eval_config.yaml` budgets (60 s / 10 calls / 1 min / 50 turns — the
self-throttle), both LoRA stub configs (r=4, α=8, q_proj+o_proj, 217 KB each), docker/sandbox
surface (public + sandbox Dockerfiles, `imp.py`/`telnetlib.py` shims), and 21 line-cited
harness-limit grep hits in `data/harness-static.md`.

## 4. What still cannot be captured statically

FAIL_TO_PASS / PASS_TO_PASS are **not in the dataset** (snapshots are history-less working
trees) — so the P-1 oracle-asymmetry probe (D12 paper gate, **Nov 1**) needs harness oracle
runs (Phase 2, `24_oracle_probe.py`), and all P0/P1 runtime telemetry begins with the first
instrumented run (Phase 3). Taxonomy κ double-coding likewise (Phase 2; v0 labels done).
Platform watch (P4) is external/weekly, not training-set metadata.

## 5. Conventions

Zero-census discipline, ATIF-compatible ledger field names, /tmp-only agent telemetry,
stdlib-first, provenance stamped, every markdown table QC'd (`qc-tables.mjs`), intermediates
in `independent_research/scratch/`, no MCP quota.


---

<!-- ====================================================================== -->
<!-- FILE: 01-ROADMAP.md -->
<!-- ====================================================================== -->

# BCF Analysis Roadmap + v1 Test-Harness Design

**Written 2026-10-01, after Phases 0/1a/1b (all static metadata captured).**
Companion: [READING.md](READING.md) (books, videos, whitepapers, algorithms, external data).
Every design choice below cites the static fact that motivates it — facts live in
[data/dataset-card.md](data/dataset-card.md) and `data/deep/*`.

---

## 1. What the static metadata already dictates (design constraints, not preferences)

| # | Verified fact | Consequence for the agent/harness |
|---|---|---|
| C1 | Problem statements are prose issue titles (0/129 tracebacks; median 418 chars; emoji conventional-commit prefixes) | CLASSIFY is a *text classification over issue reports* — no exception-parsing path in v1; triage from v0 label + difficulty tercile |
| C2 | Async hole CONFIRMED structural: 0 first-class async nodes of 370,683; async lives nested in 4,449 enclosing sync nodes (93.5% edge-touched) | LOCALIZE must return *enclosing objects* (nodes), then AST-verify inside; async-internal reasoning is fallback-arm territory, always logged (D4) |
| C3 | Embeddings are per-node, name-keyed, float32(256,), 129/129 identical to node sets | A k-NN arm over the provided vectors is free and joins to the call graph by name — no index-building needed at runtime |
| C4 | Snapshots are history-less synthetic exports (base not in packs OR loose; git diff HEAD only) | NO git log/blame/show tools in the agent; everything is working-tree + graph + embeddings; the harness's unified diff = diff-to-HEAD |
| C5 | Gold patches: 70.5% single-file, median +8/−2, 0/129 touch tests | Bias PATCH toward small diffs; big-diff tasks are the tail (max 26 files) — cap and escalate |
| C6 | Test patches: median 1 new test function, 15/129 parametrize, 0 unittest, 1 async test | VERIFY = run pytest on the touched/related test files with strict JUnit semantics (skipped = fail) |
| C7 | 12 h sequential, ~120 tasks (~6 min/task average), σ≈2.5-task noise | Governor + forced-submit are v1 features, not v2; Σ caps ≤ 10.5 h |
| C8 | Sample eval_config self-throttles (60 s / 10 calls / 1 min / 50 turns) | The FIRST commit in our fork un-throttles eval_config.yaml |
| C9 | 14 fastapi tasks import inline_snapshot / dirty_equals (absent from the 124-wheel wheelhouse) | Quarantine these from local CV until oracle runs confirm; they can silently poison paired diffs |
| C10 | 32k ctx; KV cliff; overflow discards the patch; thinking-drop server bug | Lean prompt, 14,336 token_threshold + output reserve (D6); thinking A/B is a run-1 question (D3) |
| C11 | Node lists are name-sorted (129/129) → deterministic ordering | Offline rank baselines are reproducible; P@k league must still use *agent* ordering |

---

## 2. Data-analysis next steps (ordered by decision value per hour)

| ID | Analysis | Input (already on disk) | Feeds | Effort |
|---|---|---|---|---|
| A-1 | **Offline localization benchmark (no LLM)** — score BM25-over-node-texts, per-node-embedding k-NN, Personalized PageRank over the calls graph (seeded from problem-statement symbols and test-function names), and hybrid RRF against the gold-file joins in graph-deep.jsonl | graphs + embeddings + tasks.jsonl + graph-deep.jsonl | D4 doctrine *before* spending a single agent run; picks the arm blend for v1 | 4 h |
| A-2 | Gold-test symbol coupling — do added test functions import/call symbols touched by the gold patch? (symbol overlap between test_patch context and patch hunks) | tasks.jsonl | oracle-predictive feature; VERIFY scope heuristic (which test files to run first) | 2 h |
| A-3 | Problem-statement clustering — embed 129 statements, cluster (HDBSCAN/k-means), compare clusters to v0 taxonomy labels | statements + v0 labels | taxonomy adjudication set selection (the 30 to double-code); CLASSIFY prompt design | 2 h |
| A-4 | λ feasibility — distribution of gold-node graph distance from statement-mentioned anchors; is distance-decay estimable offline? | graph-deep + graphs | ρ/λ/q paper math dry-run | 2 h |
| A-5 | Budget simulation — simulate 12 h sequences over per-task predicted durations (proxy: graph size, repo, tercile); test orderings and cap policies against the 10.5 h line | census + features | D2 allocator v1 without burning GPU hours | 2 h |
| A-6 | Snapshot verify --all (T-114 completion) + splits parity (T-117: locate the frozen-split algorithm record, or re-derive + document) | ZIP + prior research folders | D11 CV integrity | 2 h |
| A-7 | Quarantine confirmation — oracle-run the 14 candidates first (gold patch + run tests); expect dependency-import errors | harness env (R1) + testdeps | D11 dead-task list, final | 1 h + runs |
| A-8 | (Optional) embedding-model provenance — cosine-align provided 256-d vectors against locally computable models over the same node texts; identifies the encoder and whether a better one is shippable | 3 extracted npz + local models | retrieval-arm upgrade; skip if no local encoder | 2 h |

A-1 is the highest-leverage item on this list: it converts the D4 doctrine question from
"run A/B agent arms" (expensive, noisy) into "score retrievers offline against 129 known
answers" (exact, free, repeatable). Do it before the first instrumented agent run.

---

## 3. The build sequence (week-by-week, aligned to the D-register)

### R1 — Harness bring-up (Oct 2–5) — the critical path
1. Local parity environment: docker sandbox from `docker/`, eval_config env overrides
   (`SWE_MAX_*`), one task end-to-end → assert the three artifacts exist (ATIF trace,
   JUnit XML, unified diff). This is T-131; nothing else unblocks without it.
2. Oracle smoke: apply gold patch + run tests on 3 tasks (one per repo); strict-gate
   parity (skipped = fail). Then A-7 (the 14 quarantined tasks).
3. A-1 offline localization benchmark (runs on a laptop, no GPU).
4. Ledger schema v1 (T-132) + SessionTrace ingest (T-133) — build NOW so the first
   real run is already ledgered; retrofitting telemetry never happens.
5. Decisions armed this week: **D4** (arm blend from A-1), **D6** (compaction config),
   **D7** (edit path — adopt the harness 3-tier `apply_replacement`, census its failure
   tiers from run 1).

### R2 — v1 agent + first ledgered runs (Oct 5–9)
- A0 baseline agent (§5 below) on dev-fast-15 × 3 seeds; budget-clean acceptance
  (zero ctx_overflow / forgot_submit / not_run; 100% termination_cause classified).
- Monday queries 1–10 live (T-137); CV↔LB submission log open (T-136).
- D3 thinking A/B on the same split (cheap, reversible — decide by McNemar).

### R3 — Instrumentation + annotation (Oct 9–19)
- BCF emitters (T-141): phase transitions, localization arm, classifier label, spec
  fields, fix order, gate verdicts — /tmp only, zero context growth, CI-asserted.
- Taxonomy: LLM pass over task cards (T-123), double-code 30, κ ≥ 0.70 (T-124);
  A-3 clusters pick the adjudication set.
- Oracle probe ramp (T-126): gold / no-patch / wrong-patch on all 129, prioritized
  non-quarantined first; **κ gate Nov 1**.
- Rescue FSM v1 (D14): trip on 3 identical calls or N minutes without an edit;
  recovery-rate telemetry from run 2 onward.

### R4 — A-series ablations + first submissions (Oct 19–26)
- A1 BCF-lite workflow, A2 dual-path localization with arm logging, A3 arm ablation,
  A4 spec-gate dispatch by v0 class (spec only when classifier confident — the 03-pilot
  LOO warning says unconditional spec loses), A5 rescue.
- **D1 LoRA verdict Oct 23 — default NO-GO** (five-gate: K1–K5); if NO-GO, the two
  weeks go to integrity + budget work (higher EV at σ≈2.5).
- First Kaggle submission only after a budget-clean parity run (D10; never during a
  known platform-bug window; canary rule).

### R5 — Paper track + calibration (Oct 26–Nov 12)
- ρ/λ/q with bootstrap CIs from P2 events (T-143); P-1 asymmetry table; freeze Nov 10.

### R6 — Finals (Nov 12–Dec 2)
- Allocator freeze Nov 20 (bandit over triage classes by then has real saturation
  curves); finals pair (safe + aggressive) Nov 30; Dec 2 final.

---

## 4. v1 agent architecture (BCF as a *workflow inside one flat agent*)

Flat single agent (D8: sub-agent handoffs lose coherence on 31B-QAT; community datapoint
agrees). BCF phases are prompted stages with logged transitions — same model, same context,
explicit phase markers, so P2 telemetry can attribute every outcome to a phase.

```
system.md (lean: C1 prose-issue framing, C4 no-history framing, C10 budget discipline)
  │
  ├─ CLASSIFY  → v0-style label + triage class (from problem statement + repo + tercile prior)
  │             logs: label, confidence, features            [P2 → D5]
  ├─ SPECIFY   → DoD fields (expected behavior, touched-surface guess, test guess)
  │             dispatched: only when CLASSIFY is confident  [D5 dispatch rule]
  ├─ LOCALIZE  → dual-path, arm logged at decision time      [P2 → D4]
  │    arm 'graph'    : k-NN over provided per-node embeddings (C3) + PPR over calls
  │    arm 'ast_fall' : AST/grep fallback when anchor unresolved OR async-internal (C2)
  │    output: enclosing-object candidates (node names → file paths), rank list
  ├─ PATCH     → 3-tier apply_replacement; small-diff bias (C5); fix-order list
  ├─ VERIFY    → run pytest subset (C6; A-2 picks the subset), strict JUnit semantics
  └─ COMMIT    → submit_patch; forced-submit at 90% task budget; governor owns C7
```

**Tools (v1, minimal):** `list_tree`, `read_file` (respects the 150-line/10k limits),
`search` (grep -nC3), `find_symbol` (def/class regex over tree — no git tools, C4),
`apply_replacement` (harness 3-tier), `run_tests` (pytest -x -q, timeout), `submit_patch`.
Each tool call's edit-outcome tier is logged for the D7 census (W2's
`escaped_content_mismatch` etc.).

**Governor (outside the model):** per-task wall/turn caps by triage class; 12 h global
ledger with Σ ≤ 10.5 h; watchdog kill → forced submit → termination_cause emission;
stuck-detector (3 identical calls / N min no edit) → rescue nudge or bail. The governor
is the difference between a 0 and a score when the 12 h wall approaches (C7).

**What v1 deliberately does NOT have:** sub-agents, LoRA adapters (default NO-GO until
D1), git-history tools (impossible, C4), retrieval index shipping (bundle-rules question
— ask staff before shipping any index; the provided per-task embeddings already cover
retrieval), global prompt tuning before arms are measured.

---

## 5. v1 submission checklist (what actually goes in the bundle)

1. `eval_config.yaml` — un-throttled, sane caps from R1 measurements (C8).
2. `agent.yaml` + `prompts/system.md` — rewritten for prose issues, no-history, budget
   discipline; analyzer sub-agent prompt trimmed or removed (flat doctrine).
3. Tool definitions as above; governor config; rescue thresholds.
4. **No adapters** (NO-GO default; K1–K5 unresolved as of 2026-10-01).
5. `/tmp` journal emitters (P2) — verify bundle-size neutral and context-growth-zero
   via the CI prompt-diff assertion before submitting.
6. Acceptance gates before ANY submission: budget-clean dev-fast-15 × 3 seeds;
   termination_cause 100%; patch_present rate reported; edit-failure tiers counted;
   config_hash recorded in the submission log (T-136) so every public point is
   attributable.

---

## 6. Risks specific to v1 (from the corpus, not generic)

| Risk | Static evidence | Mitigation in v1 |
|---|---|---|
| Retrieval arm mismatch: provided 256-d embeddings may be weak for prose queries | unknown encoder (A-8) | BM25-over-node-texts as the always-on second arm; RRF hybrid; measure both from run 1 |
| Async tasks systematically fail graph arm | C2 (0 first-class async nodes) | AST fallback mandatory for async_touch tasks (23/129 known); arm logged |
| Quarantine tasks poison paired stats | C9 (14 candidates) | Exclude from CV until oracle-confirmed; report both with/without |
| Big-diff tail tasks eat the budget | C5 tail (max 26 files) | Triage-class cap + early-bail heuristic when SPECIFY predicts multi-file |
| Platform volatility (KV, 12 h overrun errors, thinking drop) | watch log | Canary submissions, env-gap register (T-152), weekly parity run on L4×4 |
| Overfitting the 129 | D11 | Frozen splits + LORO + the Aug-style discipline already specced; never read LB deltas < 0.04 |

---

## 7. Decision-gate calendar (unchanged from 02, now with owners)

| Date | Gate | Owner artifact |
|---|---|---|
| Oct 5 | D4 localization doctrine | A-1 offline benchmark + arm logging live |
| Oct 5 | D7 edit path | run-1 edit-failure census |
| Oct 9 | D3 thinking A/B | paired run + McNemar |
| Oct 12 | D5 spec-gate dispatch | per-class resolve/turn cost |
| Oct 19 | D14 rescue params | trip/recovery telemetry |
| Oct 21/23 | D1 LoRA tripwire/verdict | K1–K5 evidence file |
| Nov 1 | P-1 probe κ ≥ 0.70 | oracle-p1.json |
| Nov 10/12 | paper freeze / host | calibration.md |
| Nov 20 / Nov 30 / Dec 2 | allocator freeze / finals pick / final | budget reports |


---

<!-- ====================================================================== -->
<!-- FILE: 02-PLAN.md -->
<!-- ====================================================================== -->

# BCF Metadata Collection — Multi-Phased Implementation Plan

**Project:** assemble the tools and scripts that collect and extract every field in the
[metadata wishlist](../2026-10-01-bcf-decision-signals-and-metadata-wishlist/03-metadata-wishlist.md)
(P0–P4 tiers, feeding decisions D1–D15) from the local training dataset at
`input/kagglecomp/kagglecomp_data_package/` (21.9 GB ZIP `gemma-4-developer-agent.zip` + `HARNESS_README.md`).
**Started:** 2026-10-01. **Companion task list:** [TASKS.md](TASKS.md). **Index:** [README.md](README.md).

**Design rule carried over from the wishlist:** no field is collected unless it feeds a named
decision (03 §6). Every tool below cites the wishlist fields it produces and the D-register
decisions it serves.

---

## 0. Status snapshot (as of 2026-10-01 end of day)

| Phase | Scope | Status | On disk now |
|---|---|---|---|
| Phase 0 | Scaffold + selective extraction | **DONE** | `tools/00_extract_static.py`; `data/extracted/` (147 files); `data/zip-manifest.tsv` (524 entries) |
| Phase 1a | Static census of all 129 tasks | **DONE** | `tools/10_phase1_census.py`; `data/tasks.census.jsonl`; `data/census-summary.md` |
| Phase 1b | Deep static extraction (graph structure, test-deps, snapshots, embeddings, features + taxonomy v0, harness statics) | **DONE 2026-10-01** | tools 11–18; data/deep/*; data/dataset-card.md; data/harness-static.md |
| Phase 2 | P3 corpus annotation + oracle probe | planned | `tasks.census.jsonl` is the P3 seed schema |
| Phase 3 | P0/P1 runtime ledger + Monday queries | planned | — |
| Phase 4 | P2 BCF-internals instrumentation | planned | — |
| Phase 5 | P4 platform watch + pipeline QA | planned | — |

What Phases 0+1a already captured (the "capture now" answer to the wishlist) is summarized in
[README.md](README.md) §3 and fully tabulated in `data/census-summary.md`.

---

## 1. Design principles (apply to every tool in every phase)

1. **Zero-census discipline.** Every task, every run, every termination cause gets counted; no
   record may end "unknown". A tool that cannot classify an outcome writes the closest enum plus
   a `notes` field — never a silent drop.
2. **ATIF-compatible ledger.** All runtime data lands in one append-only JSONL event stream keyed
   `(run_id, task_id, event)` (03 "storage shape"). Field names reuse ATIF v1.7 SessionTrace
   names where they exist so harness traces and agent-side events join without a mapping layer.
3. **Re-derivable from the ZIP.** Every static tool reads the source ZIP (or `data/extracted/`)
   and is idempotent — re-running after a dataset update produces a fresh census without manual
   surgery. Nothing depends on Kaggle web state for the local strata.
4. **No context growth in-run.** Agent-side instrumentation (Phase 4) writes to `/tmp` only and
   never appends telemetry into the model's context window (03 §8 anti-wishlist, first row).
5. **Stdlib-first Python.** `json/zipfile/tarfile/re/collections/pathlib` only for Phases 0–2;
   numpy allowed in Phase 1b for embedding inspection (isolated to one tool). Windows/git-bash
   conventions: `PYTHONIOENCODING=utf-8`, forward slashes inside Python, never `sed` for content
   containing backslashes, Write-tool for authoring files with backslashes.
6. **No MCP quota; web only via research-toolkit** where a phase needs it (Phase 5 platform watch
   and any staff-thread re-verification — per the standing session rules).
7. **Provenance stamped.** Every output records source ZIP path, entry counts, and generation
   date in its header row or front matter, so a figure can always be traced to a payload.

---

## 2. Phase overview

| Phase | Goal | Wishlist tier served | Key tools (numbered) | Depends on | Est. effort | Gate to next phase |
|---|---|---|---|---|---|---|
| 0 | Scaffold + selective extraction | (enabler) | 00 | — | done | census runs clean |
| 1a | Per-task static census | P3 seed + data QA | 10 | 0 | done | 129/129 join, 0 unknowns |
| 1b | Deep static extraction | P3 (graph-distance, async structural, test-deps, difficulty, splits) | 11–17 | 1a | 1–2 days | dataset card passes review |
| 2 | Corpus annotation pipeline | P3 all fields (taxonomy, P-1 probe, κ) | 20–25 | 1b; oracle probe needs harness | 4–7 days (calendar-bound) | κ ≥ 0.70 on double-coded 30 |
| 3 | Runtime ledger + Monday queries | P0 + P1 | 30–35 | 1a (task IDs); first instrumented run | 2–3 days | ledger validator green on first real run |
| 4 | BCF-internals instrumentation | P2 | 40–42 | 3 (ledger), BCF agent skeleton | 3–5 days | P@k + ρ/λ/q computed from one A-series pair |
| 5 | Platform watch + pipeline QA | P4 + validation | 50–52 | 3 | weekly cadence, 0.5 day setup | first Monday report produced |

Phases 2 and 3 are **parallel tracks** — annotation is calendar-bound (κ by Nov 1 per D12) while
the ledger is needed before any adopt/revert decision is trusted (D-series rule: no decision on
an unpaired or unledgered run). Phase 4 starts as soon as the BCF agent skeleton exists; Phase 5
runs weekly from first setup to Dec 2.

---

## 3. Phase 0 — Scaffold + selective extraction (DONE 2026-10-01)

**What it does:** `tools/00_extract_static.py` writes a full ZIP entry manifest (name, size,
CRC-32, compress_size → `data/zip-manifest.tsv`, 524 entries) for payload-twin analysis without
reading bodies; selectively extracts everything except the bulk (`snapshots/*.tgz` 20.0 GiB,
`wheels/*` 0.03 GiB, 124 of 127 `embeddings/*.npz` 0.44 GiB) into `data/extracted/` (147 files:
`tasks.jsonl`, 127 graphs, `sample_submission/`, `docker/`, `sandbox/`, `HARNESS_README.md`,
3 smallest embeddings); peeks the smallest snapshot's member list → `data/snapshot-peek.json`.

**Findings banked:** snapshots are plain repo checkouts including `.git`, with no per-task
manifest — FAIL_TO_PASS / PASS_TO_PASS are **harness-derived, not statically present**, which is
why the P-1 oracle probe (Phase 2) requires harness runs rather than file parsing. Local ZIP has
**zero 0-byte entries** — the forum's "empty graph/embedding files" report is a
Kaggle-download-side artifact, closing wishlist §7 item 5's repair task for this copy (kept as a
re-verify item in Phase 5 after any re-download).

**Acceptance (met):** manifest row count = ZIP entry count; extracted file count matches include
list; snapshot peek JSON valid.

---

## 4. Phase 1 — Static corpus census + deep extraction

### 1a. Census (DONE) — `tools/10_phase1_census.py`

One JSON record per task in `data/tasks.census.jsonl` (the P3 seed schema): identity
(instance_id, repo, base_commit, created_at, year); difficulty priors (patch files, +/− lines,
single-file flag, test-patch shape); data-QA flags (hints empty, graph/embedding/snapshot
presence + size + CRC); graph stratum (nodes, edges, node types, `async` / `async def` /
`asyncio` marker counts); provenance (shared-commit groups). Human summary: `data/census-summary.md`.

**Verified findings (all figures in README §3):** perfect 129/129 task↔graph join after
`owner/repo → repo_short` normalization (the raw-name join fails 0/129 — the #1 gotcha for any
future tool); 127 distinct graph CRCs, 0 twin groups; 2 shared-commit pairs
(rich_3882/3894, requests_6589/6629) fully explain the 129-vs-127 file-count gap; 129/129
snapshots present.

### 1b. Deep static extraction (planned) — tools 11–17

| Tool | What it adds | Wishlist fields | Decisions |
|---|---|---|---|
| `11_graph_deep.py` | Per-node structural analysis of all 127 graphs: which `async def` texts correspond to callable nodes, `calls`-edge counts into async vs sync nodes, gold-patch-file ↔ node-name join (gold-file-in-graph flag + graph-distance bucket) | graph-distance, async-touched (structural), gold-file rank input | D4, D12 |
| `12_testdeps.py` | Extract test-time imports from every `test_patch`, match against `wheels/*` contents (124 wheels) → per-task test-deps-available flag | test-deps available | D11 (dead-task quarantine) |
| `13_snapshot_verify.py` | For a stratified sample first, then all 129: open snapshot tgz, verify `git rev-parse HEAD == base_commit`, record working-tree cleanliness, repo size, test-dir layout | snapshot integrity, env-gap register input | D11, D13 |
| `14_embedding_spec.py` | Decode the 3 sampled `.npz` files: array names, shapes, dtypes, row↔node correspondence hypothesis | embedding format spec | (enabler for any Phase-4 graph arm) |
| `15_difficulty.py` | Composite difficulty prior per task (files, +/− lines, test count from test_patch, problem length, repo) — the allocator's P3 input | difficulty priors | D2 |
| `16_splits_parity.py` | Regenerate the frozen splits from seed 20260929 and assert stratification by repo × async-stratum × difficulty; report any stratum thinner than the detectable-effect floor | stratifiers | D11 |
| `17_dataset_card.py` | Emit `data/dataset-card.md` — every census + deep-static number in one QC'd table set (the artifact Phase 2 annotators read first) | (all P3 static) | all |

**11 has run and the question is resolved (2026-10-01): the forum claim is CONFIRMED structurally.** Across 370,683 nodes in 129 graphs there is not one first-class async node; async source survives only nested inside 4,449 enclosing sync def/class nodes (93.5% of which carry calls edges); no keyword stripping; no nested-name promotion; the 460,018 calls edges are all sync-to-sync. Dual-path (AST fallback) is therefore a verified corpus requirement, not a hedge - graph+embedding retrieval can land on the right enclosing object, but async call chains are invisible. Full tables: data/deep/graph-deep-summary.md.

**Acceptance:** 129/129 records enriched, zero nulls in any new field without a notes entry;
dataset card renders (table QC via `../scratch/2026-10-01-bcf-decision-signals/qc-tables.mjs`).

---

## 5. Phase 2 — P3 corpus annotation pipeline (offline, parallel to Phase 3)

Legal scope reminder (03 §5): annotating the **129 public dev tasks is training-data work**;
hand-labeling validation/test is banned — this pipeline never touches anything outside the
129.

| Tool | What it does | Wishlist fields | Decisions |
|---|---|---|---|
| `20_annot_schema.py` | Define + validate `data/annotations/<instance_id>.json`: taxonomy label + evidence span, gold-file list, gold-file rank, async-touch flags (text + structural), oracle-asymmetry code (empty until 24 runs), difficulty prior, annotator + date + model version | P3 envelope | D5, D12 |
| `21_annotate_assist.py` | Render one self-contained "task card" per instance (problem statement, gold patch, test patch, census row, graph async stats) for LLM-assisted first-pass labeling; prompt template with the taxonomy rubric inlined | taxonomy label (draft) | D5 |
| `22_kappa.py` | Double-code 30 tasks (two independent passes: model A + model B, or model + human adjudication); Cohen's κ per label; disagreement queue for adjudication | κ ≥ 0.70 gate | D12 |
| `23_gold_rank.py` | Pure-static: parse `patch` → gold file list + rank of each gold file in the repo's graph node ordering; P@1/P@3/P@5 ground truth per task | gold-file rank | D4 |
| `24_oracle_probe.py` | The P-1 probe runner: for each task, three harness runs — (a) gold patch applied (oracle-sound check), (b) no patch (leak check), (c) minimal wrong patch (blocking check) → oracle-sound / oracle-leaky / oracle-blocking code. Requires the local harness (Phase 3 env) since F2P/P2P are harness-derived | **oracle asymmetry (P-1)** — the paper's claimable novelty | D12 |
| `25_deadtask_quarantine.py` | Join 12's test-deps flags with 24's oracle results → the dead-task list (gold can't pass locally); emits quarantine manifest consumed by 16's split regen check | dead tasks | D11 |

**Sequencing note:** 20/21/22/23 are pure-static and can start the day 1b lands. 24 gates on the
harness being runnable locally (Phase 3's `env` bring-up, not its ledger). **Nov-1 hard date:**
D12 requires P-1 complete with κ ≥ 0.70 by Nov 1 or the paper's core probe is cut — work back
from that date, not forward from comfort.

**Acceptance:** 129/129 annotation files valid against schema; κ report per label; oracle probe
results for all 129 with zero "unknown" codes.

---

**Status note (2026-10-01):** a deterministic provisional taxonomy v0 already exists via
15_features.py (emoji conventional-commit prefixes + keyword fallback; 95/129 labeled,
bug 66 / feature 16 / refactor 7 / docs 3 / security 1 / chore 2). Phase-2 LLM labeling
and the kappa gate supersede it; v0 is the prior, the sanity check, and the label seed.

## 6. Phase 3 — P0/P1 runtime ledger + Monday queries

The harness already emits the raw material (HARNESS_README, verified 2026-10-01):
`traces/trace_<instance_id>.json` (ATIF v1.7 SessionTrace), JUnit XML at
`/tmp/_swegemma_junit_<id>.xml`, the unified git diff from `scripts/inference.py`,
`TokenBudget`/`PricingTable`, and env-var parity overrides (`SWE_MAX_TIME_MINUTES`,
`SWE_MAX_TOOL_CALLS`, `SWE_MAX_TURNS`, `SWE_TIMEOUT_SECONDS`). P0/P1 is mostly **normalize and
join**, not new instrumentation (03 §7 item 1).

| Tool | What it does | Wishlist fields | Decisions |
|---|---|---|---|
| `30_ledger_schema.py` | JSON Schema (versioned) for the event stream: `run_manifest` (run_id, config_hash, config_snapshot, env, split, seed, timestamps), `task_outcome` (resolved, **termination_cause** enum: pass / wrong_fix / no_patch / apply_fail / timeout / turn_cap / ctx_overflow / forgot_submit / harness_error / not_run, patch_present, files_touched, wall_seconds, turns, tokens, f2p/p2p counts, score_posted), P1 turn events, `submission` rows | P0 §2.1–2.4 | D2, D6, D7, D10, D11, D14 |
| `31_trace_ingest.py` | ATIF SessionTrace parser → P1 events: per-turn tool census, tokens, edit attempt→result (`applied / no_match / ambiguous / escaped_content_mismatch / non_unique_anchor`), first_edit_turn, repeat-loop streaks, thinking_content_present, compaction events, forced-submit; **keeps raw traces even for failed tasks** (patch-at-overflow loss makes the trace the only edit record) | P1 §3 | D3, D5, D6, D7, D14 |
| `32_junit_ingest.py` | JUnit XML → f2p_passed / f2p_total / p2p_broken; strict-gate parity (skipped = failed) | P0 §2.2 tests | leak triage |
| `33_budget_report.py` | Cumulative wall curve, Σ vs the 10.5 h line, P(pass given wall-minutes) per repo × triage class, stuck-mode detector census | P0 §2.3 | D2 |
| `34_submission_log.py` | Append-only `data/ledger/submissions.jsonl`: submission_id, date, config_hash, lb_public, cv per split with Wilson CI, platform events, delta_vs_expectation; CV↔LB fit after ~8 rows | P0 §2.4 | D10, D11 |
| `35_monday_queries.py` | The 10 Monday queries (03 §9) as one command each over the ledger: termination-cause census w/w, paired arm diff + McNemar, edit-failure rates, Σ wall vs 10.5 h, P@k league (joins Phase-4 data when present), thinking/ctx_overflow incidence, CV↔LB residuals, rescue trips→recovery, P-1 progress, ρ/λ/q with CIs | §9 | all |

**Ingest contract:** tools never read the ledger for facts they can read from the source
artifact; the ledger is the join layer, not the system of record.

**Acceptance:** validator green on the first real instrumented run (schema-valid, referential
integrity run_id/task_id, zero "unknown" termination causes); each Monday query returns in
< 5 s over a 129-task × multi-run ledger.

---

## 7. Phase 4 — P2 BCF-internals instrumentation (agent-side)

Only the agent can emit these (03 §7 item 2). Constraints: journal to `/tmp`, zero context
growth, no prompt bloat, bundle-size neutral (submission zip limits).

| Tool | What it does | Wishlist fields | Decisions |
|---|---|---|---|
| `40_emitters.py` | BCF event journal writer imported by the agent: phase transitions (CLASSIFY→SPECIFY→LOCALIZE→PATCH→VERIFY/COMMIT timestamps), classification label + confidence + features, spec present/absent + field completeness, localization ranked candidates + chosen + **arm** (`graph / ast_fallback / grep` at decision time), anchor symbol + symbol_in_graph, fix-order DAG vs realized sequence, verification gates fired + verdicts, budget transfers | P2 §4 | D4, D5 |
| `41_pk_scorer.py` | Offline: join 40's localization events with 23's gold ranks → P@1/P@3/P@5 league table per arm × repo × async-stratum; wrong-fix autopsy (which phase produced the wrong hypothesis) | P2 P@k | D4 |
| `42_rlbq_estimators.py` | ρ = I(R;C)/H(R), λ distance-decay, q spec-ordering accuracy, each with bootstrap CIs; kill-switch thresholds for the knowledge layer; paper tables | P2 calibration | D12, paper |

**Ablation contract:** every BCF component is toggleable via config so an A-series pair turns
it on/off and the ledger attributes the delta (this is what makes "does the spec gate pay?"
answerable — the 03-pilot LOO surprise, classes making localization worse, is the failure mode
this exists to catch).

**Acceptance:** one A-series pair fully attributed (arm choice logged for every localization,
P@k table rendered, ρ/λ/q with CIs); instrumentation adds 0 tokens to any prompt (asserted in
CI by diffing the rendered prompt with emitters on/off).

---

## 8. Phase 5 — P4 platform watch + pipeline QA (weekly, to Dec 2)

| Tool | What it does | Wishlist fields | Decisions |
|---|---|---|---|
| `50_platform_watch.md` | Standing five-column table (per 03 §5b), updated weekly: staff-patch status (KV sizing, 12h-unfinished, thinking fix, wheelhouse) with date + evidence link; submission-error incidence by day; Kaggle L4×4 queue times; top-band LB deltas; any adapter scoring > 0 anywhere (K4) | P4 | D1, D10, D13 |
| `51_env_gap.md` | Environment-gap register: every local-vs-scorer difference (wheelhouse test-deps, sandbox Docker vs subprocess, vLLM flags unpublished, compaction threshold, thinking bug), each with status + parity plan | D11 §2 | D11, D13 |
| `52_e2e_validate.py` | End-to-end pipeline check: re-run 00→10→(11..17 as they exist) on the current ZIP, diff census against previous, run ledger validator against latest runs, run table QC over all generated markdown | (all) | D15 |

Watch data collection follows the standing research rules: research-toolkit browser for any web
verification (leaderboard snapshot, staff threads), **never MCP quota**. Platform-watch claims
are re-verified before reuse (the standing errata discipline: prior watch facts — KV 46,048 vs
7,600, 0/305 async — carry dates and get re-checked, and the async one is now RESOLVED - 11 confirmed 0 first-class async nodes; see data/deep/graph-deep-summary.md).

**Acceptance:** first Monday report (all 10 queries + watch table) produced from real run data;
52 green from a clean clone of this folder.

---

## 9. Storage layout

```
2026-10-01-bcf-metadata-collection/
  PLAN.md  TASKS.md  README.md
  tools/                      numbered, re-runnable scripts (00_..52_)
  data/
    zip-manifest.tsv          every ZIP entry: name/size/CRC32/compress_size
    snapshot-peek.json        smallest snapshot member census
    tasks.census.jsonl        Phase-1a per-task records (P3 seed)
    census-summary.md         Phase-1a human tables
    extracted/                selective ZIP extraction (Phase 0)
    deep/                     Phase-1b outputs (graph join, test-deps, difficulty)
    dataset-card.md           Phase-1b consolidation
    annotations/              Phase-2 per-instance JSON + kappa reports
    ledger/                   Phase-3 event stream: runs/<run_id>/*.jsonl + submissions.jsonl
    reports/                  Monday-query outputs (weekly, dated)
    watch/                    Phase-5 platform watch + env-gap register
```

Intermediates that are exploratory (not pipeline inputs) go to
`independent_research/scratch/` per the standing folder convention, not here.

---

## 10. Risk register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Local harness cannot reproduce F2P/P2P (missing test deps) → P-1 probe stalls | medium | D12 paper claim dies Nov 1 | 12 (test-deps) + 25 (quarantine) run before 24; probe proceeds on the quarantined-clean subset and reports coverage honestly |
| Graph structural pass shows async defs not promoted to nodes (real async hole) | medium | Changes D4 doctrine weighting — not a data loss | 11 answers it definitively; dual-path doctrine (D4 default) already assumes it |
| Re-download of dataset reintroduces 0-byte entries (forum artifact) | low | Silent graph-arm corruption | 52 re-runs manifest checks; any re-download triggers zero-byte scan before tools run |
| Annotation drift (labels not stable across model versions) | medium | κ fails, taxonomy unusable | 20 stores model version per label; 22 re-runs κ on any version bump |
| Ledger schema churn mid-season | medium | Monday queries break | schema is versioned; 30 ships a migrator for additive changes; breaking changes require a new ledger dir, never in-place rewrites |
| /tmp journal lost at sandbox teardown (Phase 4) | high | P2 events vanish per task | emitters flush per event; 31 also scans SessionTrace as a fallback source for phase markers where the agent encodes them in tool args |

---

## 11. Phase → decision coverage (closure check against 03 §6)

| Decisions | Served by |
|---|---|
| D1 LoRA gate | 30 (config/termination), 50 (K4 platform), 31 (KV-cliff tokens) |
| D2 Budget | 33, 15, 30 |
| D3 Thinking | 31 (thinking_content_present), 50 (fix status) |
| D4 Localization | 11, 23, 40, 41, 50 (staff answer on hidden graphs) |
| D5 Spec gate | 21/22 (taxonomy), 31 (first_edit_turn), 40 |
| D6 Compaction | 31, 30 (ctx_overflow rate) |
| D7 Edit path | 31 (edit census), 32 |
| D8 Architecture / D9 Teacher | 30 paired resolved + 31 trajectory filters; 50 community datapoints |
| D10 Submissions / D13 Hardware | 34, 50 |
| D11 CV protocol | 16, 25, 34, 51 |
| D12 Paper | 24 (P-1), 22 (κ), 42 (ρ/λ/q) |
| D14 Rescue | 30, 31 (trips → recovery) |
| D15 Scope cuts | the ledger itself (EV per option) |

Every wishlist tier has a owning phase; every phase cites the decisions it feeds. That closure
is the plan's acceptance test, mirroring 03 §6.


---

<!-- ====================================================================== -->
<!-- FILE: 03-TASKS.md -->
<!-- ====================================================================== -->

# BCF Metadata Collection — Master Task List

Executable companion to [PLAN.md](PLAN.md). Status: `[x]` done · `[~]` partial · `[ ]` open.
Effort is focused hours (not calendar). "Coverage" cites wishlist fields (03 §§2–5) and the
D-register decisions (02 §1) each task serves — a task with no coverage line was cut.

## Phase 0 — Scaffold + extraction (DONE 2026-10-01)

| ID | Status | Task | Tool | Output | Depends | Acceptance | Effort |
|---|---|---|---|---|---|---|---|
| T-001 | [x] | Full ZIP manifest w/ CRC-32 (twin analysis without body reads) | `00_extract_static.py` | `data/zip-manifest.tsv` | — | 524 rows = ZIP entry count | 0.5 |
| T-002 | [x] | Selective extraction (all but snapshots, wheels, 124 embeddings) | `00_extract_static.py` | `data/extracted/` (147 files) | T-001 | count matches include list; re-run idempotent | 0.5 |
| T-003 | [x] | Smallest-snapshot member peek (where do manifests live?) | `00_extract_static.py` | `data/snapshot-peek.json` | T-001 | valid JSON; member sample present | 0.2 |
| T-004 | [x] | Finding: snapshots are bare checkouts; F2P/P2P harness-derived | — | recorded in PLAN §3 | T-003 | — | 0.1 |
| T-005 | [x] | Finding: local ZIP has zero 0-byte entries (forum artifact is download-side) | manifest scan | PLAN §3 + risk register | T-001 | zero rows with size 0 | 0.1 |

## Phase 1a — Static census (DONE 2026-10-01)

| ID | Status | Task | Tool | Output | Depends | Acceptance | Effort | Coverage |
|---|---|---|---|---|---|---|---|---|
| T-101 | [x] | Per-task census join (tasks ↔ manifest ↔ graphs) with repo_short normalization | `10_phase1_census.py` | `data/tasks.census.jsonl` | T-002 | 129/129 graph join; 0 no-graph tasks | 1.5 | P3 seed; difficulty priors (D2) |
| T-102 | [x] | Difficulty priors (files, +/− lines, single-file, test-patch shape) | `10` | census records | T-101 | medians match spot-checks | (incl.) | P3 difficulty priors (D2) |
| T-103 | [x] | Data-QA flags (hints empty, presence/size/CRC per stratum) | `10` | census records | T-101 | hints 129/129 flagged; presence 129/129 ×3 | (incl.) | P3 QA flags |
| T-104 | [x] | Shared-commit + twin-CRC provenance groups | `10` | census records | T-101 | 2 shared groups; 0 twins; 129-vs-127 explained | (incl.) | data QA (D11) |
| T-105 | [x] | Graph text-level async census (`async`, `async def`, `asyncio` guard) | `10` | census + summary | T-101 | guard ≤1% of markers; per-graph counts stored | (incl.) | D4 async stratum (text level) |
| T-106 | [x] | Traceback premise check (starts-with + contains-anywhere) | `10` | census records | T-101 | 0/129 + 6/129 stable | (incl.) | D5 (CLASSIFY input reality) |
| T-107 | [x] | Human summary tables | `10` | `data/census-summary.md` | T-101 | table QC green | (incl.) | — |

## Phase 1b — Deep static extraction (DONE 2026-10-01)

| ID | Status | Task | Tool | Output | Depends | Acceptance | Effort | Coverage |
|---|---|---|---|---|---|---|---|---|
| T-111 | [x] | Structural async analysis — **forum 742911 CONFIRMED: 0 first-class async nodes / 370,683; 4,449 nested-bearing nodes (93.5% edge-touched); 0 stripped; 0 promoted** | `11_graph_deep.py` | `data/deep/graph-deep.{jsonl,summary.md}` | T-101 | four tiers counted per task + aggregate | 3 | D4 (async stratum, structural); D12 |
| T-112 | [x] | Gold-file ↔ graph-node join (in-graph flag, node counts, rank, async-bearing) | `11` | graph-deep.jsonl | T-101 | 278 gold py files classified; 218/278 in graph | 2 | P3 gold-file rank (D4) |
| T-113 | [x] | Test-deps manifest — **14 quarantine candidates: inline_snapshot ×13, dirty_equals ×2 (both fastapi)** | `12_testdeps.py` | `data/deep/testdeps.{json,summary.md}` | T-002 | 129/129 classified; 115 clean | 2 | P3 test-deps (D11) |
| T-114 | [~] | Snapshot git-state verification — **16/16 synthetic export commits; base in neither packs nor loose; --all pending** | `13_snapshot_verify.py` | `data/deep/snapshot-verify.{json,md}` | T-001 | sample verdicts recorded; --all before Phase 2 | 3 | D11, D13 |
| T-115 | [x] | Embedding spec — **correspondence solved: members named per node; name-sets identical 129/129; float32 (256,)** | `14_embedding_spec.py` | `data/deep/embedding-spec.{json,md}` | T-002 | parity + headers parsed | 1 | Phase-4 graph arm enabler |
| T-116 | [x] | Difficulty composite + terciles + stratification feasibility (5/12 thin cells) | `15_features.py` | `data/deep/features.jsonl`, `stratification.md` | T-102 | terciles 43/43/43; matrix rendered | 1.5 | P3 difficulty (D2); D11 |
| T-117 | [~] | Stratification feasibility DONE (repo × async × tercile); frozen-split seed-20260929 regeneration parity still pending (needs the split algorithm record) | `16_splits_parity.py` | `data/deep/splits-parity.md` | T-111, T-116 | splits match seed; no stratum below floor | 1.5 | D11 |
| T-118 | [x] | Dataset card (all static numbers, QC-able) | `17_dataset_card.py` | `data/dataset-card.md` | T-111..T-116 | renders; annotators can work from it | 1 | all P3 static |
| T-119 | [x] | Provisional taxonomy v0 — **95/129 deterministic labels (bug 66, feature 16, refactor 7, docs 3, security 1, chore 2; emoji 59 + keyword 36)**; Phase-2 LLM + κ supersedes | `15_features.py` | features.jsonl + stratification.md | T-102 | labels stored per task; sources recorded | 1 | P3 taxonomy v0 (D5) |
| T-125 | [x] | Gold rank ground truth (alphabetical node-order baseline; P@k needs agent ordering) | `11` | graph-deep.jsonl `best_rank_pct` | T-112 | rank defined for in-graph gold files | 0.5 | D4 |
| T-190 | [x] | Harness statics: eval_config budgets, both LoRA stub configs, docker/sandbox surface, 21 line-cited README constants | `18_harness_static.py` | `data/harness-static.md` + deep JSON | T-002 | tables render; values match source files | 1 | W2 config; D11; D1 facts |

## Phase 2 — P3 annotation pipeline (parallel track; Nov-1 gate on T-126)

| ID | Status | Task | Tool | Output | Depends | Acceptance | Effort | Coverage |
|---|---|---|---|---|---|---|---|---|
| T-121 | [ ] | Annotation envelope schema + validator | `20_annot_schema.py` | `data/annotations/` + schema | T-118 | rejects malformed; stores model version + date | 1 | P3 envelope |
| T-122 | [ ] | Task-card renderer for assisted labeling (seeds from census + features + graph rows) | `21_annotate_assist.py` | per-instance cards | T-118 | card self-contained | 1.5 | P3 taxonomy (drafts) |
| T-123 | [ ] | LLM first-pass labels, all 129 (v0 prefix labels are the prior, not the answer) | model pass over cards | `data/annotations/*.json` | T-122 | 129/129 labeled; evidence span per label | 3 | P3 taxonomy (D5) |
| T-124 | [ ] | Double-code 30; Cohen's κ; adjudication queue | `22_kappa.py` | `data/annotations/kappa.md` | T-123 | κ ≥ 0.70 per label or adjudication scheduled | 2 | D12 gate |
| T-126 | [ ] | P-1 oracle probe: gold / no-patch / wrong-patch harness runs → sound/leaky/blocking | `24_oracle_probe.py` | `data/annotations/oracle-p1.json` | T-114 (--all preferred), harness env (T-131) | 129/129 coded; zero unknown; **due Nov 1** | 6 | P3 oracle asymmetry (D12, paper) |
| T-127 | [ ] | Dead-task quarantine (test-deps × oracle join; confirm the 14 candidates) | `25_deadtask_quarantine.py` | `data/deep/quarantine.json` | T-113, T-126 | list w/ cause per task; feeds T-117 | 1 | D11 |

## Phase 3 — P0/P1 runtime ledger (start after 1b; parallel to Phase 2)

| ID | Status | Task | Tool | Output | Depends | Acceptance | Effort | Coverage |
|---|---|---|---|---|---|---|---|---|
| T-131 | [ ] | Local harness bring-up + parity env (env-var overrides; sample self-throttle documented in harness-static.md) | runbook | verified one task end-to-end | T-004 | trace + JUnit + diff artifacts for 1 task | 3 | enabler |
| T-132 | [ ] | Ledger JSON Schema (run_manifest, task_outcome w/ termination_cause enum, P1 events, submission) + validator | `30_ledger_schema.py` | `data/ledger/schema.json` | — | validator unit-tested on bad rows | 2 | P0 §2 (D2/D6/D7/D10/D11/D14) |
| T-133 | [ ] | ATIF SessionTrace ingest → P1 events (edit census, loops, thinking flag, compaction, forced-submit; keep raw traces always) | `31_trace_ingest.py` | ledger events | T-131 | 1 real trace fully normalized | 4 | P1 §3 (D3/D5/D6/D7/D14) |
| T-134 | [ ] | JUnit XML ingest (strict: skipped = failed) | `32_junit_ingest.py` | ledger tests fields | T-131 | f2p/p2p populated | 1 | P0 §2.2 tests |
| T-135 | [ ] | Budget report (Σ vs 10.5 h; P(pass given wall-minutes); stuck-mode census) | `33_budget_report.py` | `data/reports/budget-*.md` | T-133 | curve + saturation table | 2 | P0 §2.3 (D2) |
| T-136 | [ ] | Submission log + CV↔LB pair capture | `34_submission_log.py` | `data/ledger/submissions.jsonl` | T-132 | every Kaggle sub gets a row; Wilson CI | 1 | P0 §2.4 (D10/D11) |
| T-137 | [ ] | Monday queries 1–10 as one command each | `35_monday_queries.py` | `data/reports/monday-*.md` | T-133..T-136 | all 10 < 5 s over multi-run ledger | 3 | 03 §9 (all) |

## Phase 4 — P2 BCF-internals instrumentation

| ID | Status | Task | Tool | Output | Depends | Acceptance | Effort | Coverage |
|---|---|---|---|---|---|---|---|---|
| T-141 | [ ] | BCF event emitters (phase transitions, classification, spec, localization + arm, anchors, fix order, gates) — /tmp only, zero context growth | `40_emitters.py` | journal per task | BCF agent skeleton | prompt-diff CI assertion: 0 tokens added | 4 | P2 §4 (D4/D5) |
| T-142 | [ ] | P@1/P@3/P@5 scorer: arm × repo × async-stratum league (uses T-125 join + T-119/T-111 strata) | `41_pk_scorer.py` | `data/reports/pk-league.md` | T-141, T-125 | league table from one A-series pair | 2 | D4 |
| T-143 | [ ] | ρ / λ / q estimators with bootstrap CIs + kill-switch thresholds | `42_rlbq_estimators.py` | `data/reports/calibration.md` | T-142 | CIs on real data; paper-table format | 3 | D12, paper |
| T-144 | [ ] | Wrong-fix autopsy join (which phase erred) | extends `41` | autopsy fields | T-142 | every wrong_fix attributed or "unclear+notes" | 1.5 | P2 autopsy (D5/D7) |

## Phase 5 — P4 watch + QA (weekly cadence to Dec 2)

| ID | Status | Task | Tool | Output | Depends | Acceptance | Effort | Coverage |
|---|---|---|---|---|---|---|---|---|
| T-151 | [ ] | Platform-watch standing table (staff patches, error incidence, queue times, LB deltas, adapter>0) — research-toolkit only, no MCP | `50_platform_watch.md` | `data/watch/platform-YYYY-WW.md` | — | weekly entry w/ evidence links; claims dated | 0.5/wk | P4 §5b (D1/D10/D13) |
| T-152 | [ ] | Environment-gap register (local vs scorer; seeded with T-114 git-state + T-190 statics) | `51_env_gap.md` | `data/watch/env-gap.md` | T-131 | every known gap listed w/ status | 1 | D11/D13 |
| T-153 | [ ] | E2E pipeline validation (re-run 00→…; census diff; ledger validate; table QC) | `52_e2e_validate.py` | green report | all prior | clean-folder re-run succeeds | 2 | D15 |
| T-154 | [ ] | Table QC on every generated markdown (standing rule) | `../scratch/2026-10-01-bcf-decision-signals/qc-tables.mjs` | QC output | any md change | 0 defects before shipping | per change | — |

## Milestones

| Date | Milestone | Tasks |
|---|---|---|
| **2026-10-01** | **Phases 0 + 1a + 1b complete — all no-harness metadata captured** | T-001..T-125, T-190 |
| 2026-10-02 | Snapshot verify --all; split-regeneration parity if algorithm located | T-114, T-117 |
| 2026-10-05 | D4 localization doctrine decision armed (structural facts + gold joins + strata in hand) | T-111/112/125 done; T-141 started |
| 2026-10-09 | First ledgered instrumented run; Monday queries live | T-131..T-137 |
| 2026-10-19 | Taxonomy double-coded; κ reported (v0 prior in hand) | T-121..T-124 |
| **2026-11-01** | **P-1 probe complete (D12 paper gate)** | T-126, T-127 |
| weekly | Platform watch + Monday report, to 2026-12-02 | T-151, T-137 |

## Totals

**2026-10-01: 20 tasks closed** (T-001..T-007 census set, T-111..T-119, T-125, T-190), 2
partial (T-114 sample 16/129; T-117 feasibility done), 6 decision-relevant findings banked
(prose statements; async hole CONFIRMED structural; embeddings solved; 14 quarantine
candidates; history-less snapshots; taxonomy v0 95/129), all tables QC'd.


---

<!-- ====================================================================== -->
<!-- FILE: 04-READING.md -->
<!-- ====================================================================== -->

# Reading, Algorithms, and External-Data List for the BCF Agent Build

**Written 2026-10-01; catalog cross-match added same day.** Companion to
[ROADMAP.md](ROADMAP.md). Ordered by relevance to the v1 build, not by fame. Papers
marked **[verify]** carry our standing errata discipline: resolve the exact venue/year
via Crossref/dblp before citing in the paper track (the bibliographic-verification
memory: Crossref polite pool is the workhorse; some prior citations in the repo were
wrong and are listed in the errata memories — check `2026-10-01-bcf-x-dsa-full-circle/04*`
bibliography before re-citing anything from that run).

**Catalog cross-match (2026-10-01).** Your collection has now been examined:
the two ranked summaries `input/books_videos/01-coderprog-catalog-bcf-ranked.md`
(3,130 entries, top 55 ranked) and `input/books_videos/02-0dayprizrak-catalog-bcf-ranked.md`
(46,567 unique titles, top 44 ranked), plus full-JSON title/synopsis scans of both
catalogs (scanner scripts: `independent_research/scratch/2026-10-01-bcf-metadata-collection/catalog_*.py`).
§1 marks every recommendation owned-or-not; §1b re-ranks what you DO own through the
current decision state (D1 = NO-GO default until Oct 23; v1 = flat agent + governor —
so adapter-training material is gate-gated, harness/evals/localization material is not).

---

## 1. Books (mapped to what they unlock, with collection status)

| Book | Author | Read for | Maps to | In your collection? |
|---|---|---|---|---|
| Why Programs Fail (2nd ed.) | Andreas Zeller | THE textbook for VERIFY: delta debugging (ddmin), isolation, automated simplification — directly the oracle-probe and rescue mechanics | VERIFY, P-1 probe, D14 | **No — buy.** No substitute in either catalog (checked title + synopsis). The one must-buy on this list. |
| Working Effectively with Legacy Code | Michael Feathers | Seam analysis and behavior-preserving edits on unfamiliar code — literally the PATCH skill on history-less snapshots | PATCH, C4 | **No — buy.** Only Java/PHP legacy-refactoring niche books exist in the catalogs. |
| An Illustrated Guide to AI Agents (2026, 448 pp) | Maarten Grootendorst & Jay Alammar | How agents with tools + memory are built, graphically — the conceptual spine for the v1 agent | whole v1 design | **YES (coderprog, 2026).** Replaces the older *Hands-On Large Language Models* by the same authors (not in collection; superseded). |
| Refactoring (2nd ed.) | Martin Fowler | The catalog of small behavior-preserving edits; the vocabulary for fix-order DAGs and small-diff bias | PATCH, q metric | **No.** Only C# SOLID refactoring courses + a German *Tidy First?* in the catalogs. Buy or skim — the concepts transfer from Zeller + Feathers. |
| Introduction to Information Retrieval | Manning, Raghavan, Schütze | BM25, ranking, evaluation (P@k, interpolation) — the localization league's foundation | LOCALIZE, A-1 | **No — but free PDF online** (nlp.stanford.edu/IR-book); the catalogs' only IR theory is an unvetted *Advanced Information Retrieval System* (2026). Use Elasticsearch in Action (owned, §1b Tier B) for the practical BM25 half. |
| AI Engineering | Chip Huyen (2025) | Eval design, RAG, agent architecture, the build-vs-finetune decision framework — the modern spine for everything here | whole roadmap | **Italian edition only** (prizrak-2204573). English: buy, or use her free blog posts + *AI Evals in Practice* (owned, §1b) for the eval chapters that matter most. |
| Hands-On Large Language Models | Alammar & Grootendorst (2024) | LoRA/PEFT mechanics with working code — the K1 prep if D1 ever flips to GO | D1, K1 | Superseded — their 2026 *Illustrated Guide to AI Agents* is owned (row above); PEFT mechanics are covered by the Tier C training books you own. |
| Software Engineering at Google | Winters, Manshreck, Wright | Testing culture, CI, reproducibility — how to build the harness itself without lying to yourself | harness, ledger | **No — but free online** (abseil.io/resources/swe-book). |
| Debugging: The 9 Indispensable Rules | David Agans | Cheap, 150 pages; the heuristics your CLASSIFY/SPECIFY prompts should encode | CLASSIFY prompts | **No.** Optional buy; Zeller covers the same ground deeper. |
| Designing Machine Learning Systems | Chip Huyen | Data pipelines and the annotation/eval loop discipline for P3 | P3, κ workflow | **No.** Optional; the eval-relevant 20% is in *AI Evals in Practice* (owned). |
| Probabilistic Machine Learning: An Introduction | Kevin Murphy | The math under ρ/λ/q estimation and Bayesian calibration | paper track | **No — free draft online** (probml.github.io). |
| Designing Data-Intensive Applications (2nd ed., 2026) | Martin Kleppmann | Event-sourced ledger thinking; durable design intuition | ledger design | **YES (coderprog, 2026 2nd ed.)** — read only the log/append-only chapters if the ledger needs them; lowest priority of your owned books. |
| Build a Reasoning Model (From Scratch) | Sebastian Raschka (2026, 440 pp) | Evaluation with verifiers, RL with verifiable rewards, GRPO, format rewards — the recipe for machine-checkable "done" | D1, RLVR, tenet 4 | **YES** — coderprog (final ed.) + video edition + prizrak MEAP. Read the eval/verifier chapters NOW (they inform oracle scoring); the GRPO training chapters are D1-gated. |

Skippable for this project: generic deep-learning texts (you are not pretraining),
general Python books (you know Python — though *Effective Python* 3rd ed is owned, see §1b Tier E),
and graph-theory texts beyond the GNN books you own.

## 1b. What your collection covers — re-ranked through the v1 lens

The Sep-30 catalog rankings weighted LoRA/adapter training at 35%; post-ROADMAP our
decision state is D1 = NO-GO until Oct 23 and v1 = flat agent. Tiers below reorder
their rankings by what R1–R4 actually needs. Scores are the catalog files' own.

### Tier A — read/watch NOW (v1 harness + agent, feeds R1–R2)

| Resource | Catalog | Score | Maps to |
|---|---|---:|---|
| Agentic Harness Engineering: Harness Design for AI Engineers (video, 2.4 GB) | prizrak #1 (0daydown-3499372) | 9.6 | Governor design: multi-layer harness, long-running code-executing agents, multi-session memory, **context-rot control**, custom execution loops — literally the v1 governor + watchdog spec (C7, D2, D14) |
| Loop Engineering for Agentic AI (video, 9.8 GB) | prizrak #2 (2258690) | 9.4 | **Termination conditions, non-progress/repetition detection, traces, tests** — the rescue FSM (D14: trip on 3 identical calls or N min no edit) in course form |
| AI Coding Agents: 100 Labs to Production Mastery (video, 1.1 GB) | prizrak #3 (2258539) | 9.2 | Terminal harnesses, sandboxing, approval gates, output measurement — the sandbox contract and strict-gate discipline (C6) |
| An Illustrated Guide to AI Agents (book, 448 pp) | coderprog (2026) | — | The agents conceptual spine; read before writing system.md (D8 flat-agent doctrine) |
| Harness Engineering & Agent Orchestration (video, 1.56 GB) | coderprog #6 | 8.7 | One pattern per lesson on memory/tools/guardrails around an LLM — designing within the fixed 9-tool contract |
| Build Your Own Claude Code (video, 11.3 GB) | coderprog #7 | 8.6 | read/write/edit tools + agent loop from scratch — the closest analog to our tool set (D7 edit tiers) |
| The Claude Code Operating Model (book, 346 pp) | coderprog #8 | 8.5 | Skills, hooks, sub-agent orchestration as a governed system — SKILL.md + prompts/ authoring discipline |
| Evaluating Large Language Models (Pearson video, 8 h, S. Ozdemir) | prizrak #7 (2195889) | 8.6 | Eval design — the Monday-queries statistical spine (McNemar, paired runs, σ discipline) |
| AI Evals in Practice (book, 150 pp, 2026) | coderprog #10 | 8.4 | Python eval harness + datasets + scorers + CI regression — the ledger is an eval system; build it once, correctly (R1 step 4) |
| Master LLM Inference Engineering (4-week live workshop) | coderprog #14 | 8.2 | Serving flags, latency, batching — K2/K4 local parity with the scorer's vLLM on 4×L4 |
| Build GenAI Agents with OpenAI + vLLM (book, 120 pp) | coderprog #15 | 8.1 | vLLM-backed agents, structured outputs, tool calling against the OpenAI-compatible endpoint the harness exposes |
| Pytest pair: Modern Python Testing with pytest (514 MB) + Pytest Complete Guide 50 Exercises (2.3 GB) | prizrak #22/#28 | 7.1–7.4 | VERIFY-phase reproduction: fixtures, parametrize (15/129 tasks use it), strict JUnit semantics (skipped = fail) |
| Context Engineering courses (coderprog 7.4 + prizrak 7.4) | both | 7.4 | D6: context composition under the 32k window; lean-prompt discipline |

### Tier B — A-1 localization window (read alongside building the offline benchmark)

| Resource | Catalog | Score | Maps to |
|---|---|---:|---|
| Vector Databases: A Practical Introduction (O'Reilly, 292 pp) | coderprog #22 | 7.6 | Embedding/k-NN mechanics — what the provided 256-d vectors can and cannot answer (C3) |
| Agentic GraphRAG (book, 386 pp) | coderprog #16 | 8.0 | Graph retrieval + reasoning patterns over the calls graph — the PPR arm's pattern book (D4) |
| Advanced RAG: Bridging LLMs and Knowledge Graphs (560 pp) | coderprog #26 | 7.4 | Hybrid text+graph retrieval — RRF/late-interpolation ideas for A-1 |
| Elasticsearch in Action (2nd ed., 2023) | coderprog + prizrak | — | Lucene BM25 in practice: analyzer choices, field weighting — direct input to the BM25-over-node-texts arm |
| Vector DBs Fundamentals course + Vector Databases & RAG course | coderprog #35, prizrak #34 | 6.7–7.3 | Deeper drills if the k-NN arm underperforms in A-1 |

### Tier C — D1-gated (only if the Oct-23 gate flips GO; cheap to skim regardless)

| Resource | Catalog | Score | Maps to |
|---|---|---:|---|
| Build a Reasoning Model (From Scratch) — training chapters | owned (3 copies) | 9.0 | RLVR/GRPO — the adapter-training recipe if K1–K5 pass |
| The Craft of Post-Training (No Starch 2026, 416 pp) | coderprog #3 | 9.2 | Decision-level SFT→RL playbook; ships a SKILL.md companion (dual-use even at NO-GO) |
| Reinforcement Learning for LLM Alignment and Reasoning (Pearson video) | coderprog #2 | 9.4 | DPO + GRPO — the two named post-training paths |
| RLHF book pair (Manning 312 pp + Packt 399 pp) | coderprog #9/#11 | 8.3–8.5 | Preference data → reward modeling → policy optimization theory spine |
| SLM Engineering: End-to-End (video, 7.4 GB) | both catalogs | 8.4–9.6 | Full small-LM lifecycle on the competition's model class |
| LLM Quantization and Compression (video) | prizrak #10 | 8.4 | What QAT W4A16 already is; how fine-tuning interacts with quantized weights (readable now — it explains the base model) |
| Edge AI with SLMs: Fine-Tuning & Local Deployment | prizrak #12 | 8.3 | LoRA/QLoRA under hardware limits |
| Hands-On Fine-Tuning LLMs with PyTorch + HF (306 pp) | coderprog #13 | 8.2 | The PEFT/safetensors mechanics of the adapters/ stub |

### Tier D — paper track / graph math (Oct 26–Nov 12 window)

| Resource | Catalog | Score | Maps to |
|---|---|---:|---|
| Graph Neural Networks: Concepts and Applications (Wiley, 960 pp) | coderprog #17 | 8.0 | GNN grounding over the released graphs — paper-track angle |
| A Complete Guide to Graph Representation Learning (448 pp) | coderprog #18 | 7.9 | GRL fundamentals → SOTA; the substrate behind get_code_neighbors-style reasoning |
| Applied Deep Learning on Graphs (Packt) | prizrak #17 | 7.8 | GCN/GAT productionization |
| The Mathematics of LLMs (477 pp) | coderprog #30 | 7.3 | Readable math behind KL, DPO beta, sampling params — ρ/λ/q support |
| Kimi K3 course ("evaluate with your own harness") | prizrak #16 | 7.9 | Open-weight agent workflows; the local-SWE-bench mindset |
| The Kaggle Book (2nd ed., 2026) | prizrak #18 | 7.7 | Competition wrapper craft: validation discipline, LB mechanics, submission strategy (D10, D11) |

### Tier E — corpus-adjacent Python craft (background, high-school-football level)

| Resource | Catalog | Maps to |
|---|---|---|
| Asynchronous Programming in Python (True PDF) + From Zero to Async (asyncio course) + The Python Concurrency Guide | prizrak | **C2 relevance**: the 23/129 async-touch tasks and the AST-fallback arm need asyncio fluency; understanding what the graphs lost |
| Effective Python (3rd ed., 2025) | both catalogs | PATCH-quality heuristics; idiomatic small diffs |
| Statistics Every Programmer Needs (Gary Sutton) + Bayesian ML in Python: A/B Testing (Udemy) | prizrak | Lightweight stats backup for the Monday queries (McNemar/Wilson stay paper-based) |
| Operations Research: An Introduction (Taha, 11th ed.) | coderprog | The one allocator-math text you own — knapsack/scheduling chapters back D2 |

**Collection gaps (no in-catalog substitute):** the entire debugging/legacy canon
(Zeller, Feathers, Fowler, Agans), IR theory (Manning — free anyway), SE at Google
(free), Murphy (free), Sutton & Barto RL (bandit chapters — but D2's bandit math fits
in two papers, §4), nothing on Weiser slicing or delta debugging anywhere. The
classical-SE gap is real: your shelves skew 2025–26 practitioner ML; the competition's
VERIFY phase is exactly where the missing canon pays.

## 2. Video / course shorts (with owned substitutes marked)

| Video / course | Why | In collection? |
|---|---|---|
| Agentic Harness Engineering + Loop Engineering (Tier A above) | Governor/watchdog/rescue design | **YES** — promote these over the free-online picks below |
| Master LLM Inference Engineering + Build GenAI Agents w/ OpenAI+vLLM | vLLM serving flags, KV sizing, prefix caching — K2/K4 parity | **YES** — substitutes for vLLM community talks |
| Build Your Own Claude Code; AI Coding Agents 100 Labs; Build an AI Agent (From Scratch) video | Tool-loop anatomy; the mental model of what the compiled ADK agent does | **YES** |
| Karpathy, Deep Dive into LLMs (2025) | Tokenizer/context/sampling mental model behind the 32k discipline | Free online — not catalog material |
| Karpathy, Let's build the GPT Tokenizer | Token accounting for the KV cliff and output reserve (C10) | Free online |
| 3Blue1Brown attention series | QAT w4a16 behavior intuition | Free online |
| Hugging Face Agents Course (free) | Tool-calling patterns; the sample agent.yaml ecosystem | Free online — your owned agent courses (Tier A) cover the same ground with more depth |
| Anthropic, Building Effective Agents (essay + talk) | The workflow-vs-agent taxonomy framing BCF-as-workflow-inside-agent | Free online — read regardless |
| Stanford CS25 / CS336 guest lectures | CodeAct loops, serving internals breadth | Free online — not in catalog |
| Recorded SWE-bench / SWE-agent talks | The failure modes everyone hits first (edit formats, navigation cost) | Free online — not in catalog |

## 3. Whitepapers — core list (~30, grouped; one-line why)

### 3a. The SWE-agent canon (what the winners are built from)
| Paper | Venue | Why here |
|---|---|---|
| SWE-bench: Can Language Models Resolve Real Issues? | Jiménez et al., ICLR 2024 | The task class definition; read for oracle/harness design |
| SWE-agent: Agent-Computer Interfaces | Yang et al., NeurIPS 2024 | ACI design — your tool set IS your interface; edit/search costs quantified |
| Agentless: Demystifying LLM-based SE Agents | Xia et al., 2024 | The localize-then-patch pipeline without agent loops; the strongest cheap baseline |
| AutoCodeRover | Zhang et al., 2024 | Program-structure-guided localization (AST first) — the fallback-arm doctrine |
| OpenHands (OpenDevin) | 2024 | Open harness architecture; sandbox patterns |
| Mini-SWE-agent | 2025 | The 100-line-baseline result: interface > scaffolding — v1 minimalism is evidence-based |
| CodeAct: Executable Actions | Wang et al., 2024 | Code-as-action tool calls; why our tool set is small and composable |
| SWE-bench Verified / post-hoc analyses | 2024–25 | Noise, annotator disagreement, and why σ≈2.5 tasks must shape every rule |

### 3b. Localization + retrieval (the D4 spine)
| Paper | Venue | Why here |
|---|---|---|
| BM25 / Okapi | Robertson & Zaragoza, 2009 [verify] | The always-on text arm over node texts |
| Learning to Rank for IR | Burges, MSR-TR-2005-82 | Ranking the candidate list; LambdaMART if A-1 says merge arms |
| Reciprocal Rank Fusion | Cormack et al., SIGIR 2009 | The cheapest effective hybrid for kNN + BM25 + PPR |
| Maximal Marginal Relevance | Carbonell & Goldstein, 1998 | Candidate diversification when 20 nodes from one module drown the list |
| HNSW | Malkov & Yashunin, TPAMI 2020 (verified in DS&A run) | ANN over the provided 256-d vectors; already a known-good citation |
| Personalized PageRank for bug localization | Wong et al. survey, 2014 [verify] + IR+graph hybrids | The call-graph arm seeded from statement/test symbols |
| Program Slicing | Weiser, IEEE TSE, 1984 [verify — prior citation in repo was wrong] | The concept under AST-fallback scoping and minimal-change bias |
| Delta Debugging (ddmin) | Zeller & Hildebrandt, TOSEM 2002 [verify] | Shrink failing input/repro; the rescue FSM's core move |
| Spectrum-based fault localization (Tarantula, Ochiai) | Jones et al. 2002; Abreu et al. 2006 [verify both] | Post-oracle: use F2P/P2P from P-1 runs as spectra per task |

### 3c. Agent behavior + context (D3/D6/D14)
| Paper | Venue | Why here |
|---|---|---|
| ReAct | Yao et al., ICLR 2023 | The base loop |
| Reflexion | Shinn et al., NeurIPS 2023 | Post-failure re-injection — the /tmp journal's ancestor |
| Self-Debugging | Chen et al., 2023 | Run-then-fix loops; VERIFY-phase prompting |
| Tree of Thoughts | Yao et al., NeurIPS 2023 | Only if fix-order search ever needs branching (probably not in v1) |
| Lost in the Middle | Liu et al., TACL 2024 | Where to put the graph candidates in the prompt |
| LLMLingua (prompt compression) | Jiang et al., EMNLP 2023 | If context pressure wins over compaction tuning (D6 alternative) |
| RULER | 2024 | Measuring effective context — 32k nominal ≠ 32k usable |
| PagedAttention / vLLM | Kwon et al., SOSP 2023 | Serving reality: KV sizing, prefix caching, the 46,048→7,600 cliff |

### 3d. Data + fine-tuning (gate-gated by D1; read anyway — cheap)
| Paper | Venue | Why here |
|---|---|---|
| LoRA | Hu et al., ICLR 2022 | The adapter math the sample stubs ship (r=4, q/o_proj) |
| QLoRA | Dettmers et al., NeurIPS 2023 | 4-bit + adapter training reality |
| LIMA | Zhou et al., NeurIPS 2023 | Quality ≫ quantity — the two-band corpus finding's theoretical twin |
| STaR / Expert Iteration | Zelikman 2022; Anthony 2018 | Rejection-sampling trajectories from own runs (the 129→300-500 harvest) |
| Self-Instruct | Wang et al., ACL 2023 | Task synthesis method (SWE-smith's ancestor) |
| SWE-Gym | Pan et al., 2025 | Training environments + trajectories for SWE agents |
| R2E-Gym / SWE-smith / SWE-rebench | 2025 | Scaling task synthesis — the legal way to grow beyond 129 |
| Multi-SWE-bench / SWE-bench-Live | 2025 | Distribution breadth + leakage discipline |
| Let's Verify Step by Step | Lightman et al., ICLR 2024 | Process supervision → SWE-PRM lineage |
| Math-Shepherd | Wang et al., ACL 2024 | Automatic process labels without step annotations |
| ChainSWE, LivePlan, SWE-PRM | 2026 (verified real via GitHub API in MC3 council run — check CITATION-VERIFY.md) | The live 2026 frontier for this exact problem class |
| Gemma technical reports (3 and 4) | Google DeepMind, 2025/2026 | Your actual base model: QAT behavior, thinking format, known quirks |

## 4. Algorithms to research (each tied to a corpus fact and a decision)

| Algorithm | Use here | Tied to |
|---|---|---|
| Hybrid retrieval: BM25 + k-NN + RRF | LOCALIZE arm blend; scored offline in A-1 before any GPU run | C3 embeddings, D4 |
| Personalized PageRank on the calls graph | Rank enclosing objects from statement/test symbol seeds | 460,018 edges, D4 |
| AST walking + rope/libcst edits | Fallback arm and lossless small-diff application | C2 async, C5 small diffs, D7 |
| ddmin (delta debugging) | Shrink repro; isolate failing test subset in VERIFY | P-1 probe, D14 |
| SBFL (Tarantula/Ochiai) | Rank suspicious enclosing nodes once oracle F2P/P2P spectra exist | post-P-1 |
| Learning-to-rank (LambdaMART) | Merge arm scores if A-1 shows no single winner | A-1 output |
| Logistic survival curves (Kaplan-Meier on censored durations) | P(pass given wall-minutes) with termination_cause censoring | C7, D2 |
| Budgeted multi-armed bandits (UCB/Thompson with knapsack) | Triage-class time-cap allocation under a hard 12 h budget | D2 |
| Anytime search (Greiner-style) | Graceful degradation of VERIFY depth as budget drains | D2, D14 |
| Greedy topological ordering | Fix-order DAG (q metric) over dependent hunks | PATCH, paper |
| McNemar exact + Wilson + bootstrap | Every adopt/revert decision at σ≈2.5-task noise | all D-register |
| MinHash/LSH trajectory dedup | Corpus hygiene for the 300-500 harvest (W7) | D1 K3 |
| κ (Cohen) + adjudication queue | Taxonomy reliability gate | D12 |

Catalog note: the collection has no bandit or RL-textbook coverage (Sutton & Barto
absent; "bandit" title hits are crime novels) — the D2 allocator math must come from
the papers above plus Taha's OR text (owned, §1b Tier E). asyncio fluency for the C2
fallback arm IS covered (§1b Tier E).

Skip (for now): MCTS/ToT-heavy planners, RLHF/GRPO pipelines, spec formal methods —
all fail the "does any D-register row read this?" test at v1.

## 5. External data to collect (license-checked before use; D9 discipline)

| Source | What it gives | License/status check |
|---|---|---|
| The 4 repos' public history (fastapi, rich, requests, httpx) | Issue→PR→patch chains to synthesize MORE tasks locally (SWE-smith method) — the single biggest corpus upgrade, fully legal (public repo history, not the hidden set) | permissive (MIT/BSD/Apache) — verify each |
| SWE-Gym / R2E-Gym / SWE-smith artifacts | Pre-built training environments + trajectory corpora | permissive, verify per repo |
| NVIDIA / open SWE trajectory collections (2025-26) | Large trajectory pools for format-band filtering | CC-BY variants — check |
| SWE-bench family task definitions (excl. this competition's hidden set) | Distribution breadth for robustness checks | research licenses vary |
| SWE-agent / OpenHands / Aider public run logs | Prompt mining; failure-mode taxonomy; imitation data | mostly MIT |
| vLLM docs + issue tracker | Serving flags that match the scorer (K2/K4 parity) | Apache-2.0 |
| Gemma 3/4 technical reports + model cards | Tokenizer/thinking/QAT facts for prompt design | open weights terms |
| pytest/JUnit XML specs | Exact gate semantics (skipped = fail) reproduction | std |
| Staff forum threads (weekly watch, T-151) | The only ground truth on platform patches | research-toolkit only, no MCP |

**Do NOT collect:** anything requiring hand-labeling validation/test tasks (banned —
paper track is not worth disqualification), competitor submission forensics (03 §8),
per-token logits/latency telemetry (no decision reads it).

## 6. Priority order if you only do five things (revised post-cross-match)

1. **Agentic Harness Engineering + Loop Engineering** (owned) — watch while building
   R1: they ARE the governor/watchdog/rescue curriculum.
2. **Zeller's book (buy — the only must-buy)** + the SWE-agent/Agentless/Mini-SWE-agent
   triangle (free papers): VERIFY mechanics + ACI/localization/minimalism.
3. **AI Evals in Practice + Evaluating LLMs video** (owned) — the ledger is an eval
   system; design it once, in R1, correctly.
4. **A-1 offline localization benchmark** (doing, not reading) with Vector Databases +
   Agentic GraphRAG (owned) open beside it.
5. **An Illustrated Guide to AI Agents** (owned) before writing system.md; Master LLM
   Inference Engineering (owned) before the first K4 parity run.


***

Cross-match complete. [READING.md](independent_research/2026-10-01-bcf-metadata-collection/READING.md) is rewritten with the results (35 tables QC'd, 0 defects), memory updated. What the two catalogs actually revealed:

## The headline verdict

**Your collection and my list barely overlap — and that's informative.** Of my 10 book recommendations, exactly **one exists in your catalogs in usable form** (and it's a pleasant surprise: *An Illustrated Guide to AI Agents* 2026, 448 pp, is by Grootendorst & Alammar — the *Hands-On LLMs* authors — so it supersedes my recommendation with something newer and better-fitted to v1). Also owned: DDIA 2nd ed (2026). One quirk: **Chip Huyen's *AI Engineering* exists only in Italian** (prizrak-2204573).

**The gap is the classical canon, and it maps exactly onto VERIFY:** Zeller, Feathers, Fowler, Agans, Manning IR, SE at Google, Murphy — none present, and I scanned titles *and* synopses of all 49,693 entries. Your shelves (3,130 + 46,567) skew hard 2025–26 practitioner-ML. The three free-anyway items (Manning IR, SE at Google, Murphy) cost nothing; **Zeller is the single must-buy** — no in-catalog substitute, and it is the P-1-probe/D14-rescue textbook.

## The re-rank that matters

The Sep-30 rankings weighted LoRA/adapter training at 35% — but post-ROADMAP our state is D1 = NO-GO until Oct 23. Re-tiered through the v1 lens (READING.md §1b), your owned material lines up almost perfectly with the build sequence:

| Window | Owned material | Feeds |
|---|---|---|
| **R1–R2 (now)** | Agentic Harness Engineering (9.6), Loop Engineering (9.4), AI Coding Agents 100 Labs (9.2), Build Your Own Claude Code (8.6), Claude Code Operating Model (8.5) | Governor, watchdog, rescue FSM, tool contract — the catalog's top items ARE the v1 curriculum |
| **R1 ledger** | AI Evals in Practice (8.4), Evaluating LLMs video (Ozdemir, 8.6), Langfuse pair | The ledger is an eval system; design once |
| **A-1 localization** | Vector Databases (7.6), Agentic GraphRAG (8.0), Advanced RAG→KG (7.4), Elasticsearch in Action 2e | BM25 + k-NN + graph retrieval patterns |
| **K2/K4 parity** | Master LLM Inference Engineering (8.2), Build GenAI Agents w/ OpenAI+vLLM (8.1) | vLLM serving flags on 4×L4 |
| **C2 async fallback** | Asynchronous Programming in Python, From Zero to Async, Python Concurrency Guide | The 23/129 async-touch tasks |
| **D1-gated (Oct 23)** | Raschka *Build a Reasoning Model* (**owned ×3** — read its eval/verifier chapters *now*, GRPO chapters gated), Craft of Post-Training (9.2), RLHF pair, SLM Engineering, Quantization course | Only if K1–K5 pass |
| **Paper track** | GNN Wiley 960 pp (8.0), Graph Representation Learning (7.9), Math of LLMs, Kaggle Book 2e | ρ/λ/q + D10/D11 craft |

Two more scan finds worth knowing: the collection has **zero bandit/RL-textbook coverage** ("bandit" title hits are crime novels — Sutton & Barto absent), so D2's allocator math comes from papers + the one OR text you do own (Taha 11th ed); and *Effective Python* 3rd ed is in both catalogs for PATCH-quality heuristics.

## Revised five-things list

1. **Agentic Harness Engineering + Loop Engineering** (owned) — watch while building R1; they are the governor/watchdog/rescue curriculum.
2. **Zeller (buy)** + SWE-agent/Agentless/Mini-SWE-agent (free papers).
3. **AI Evals in Practice + Evaluating LLMs** (owned) — before writing ledger schema v1.
4. **A-1 benchmark** (doing) with Vector Databases + Agentic GraphRAG (owned) open beside it.
5. **Illustrated Guide to AI Agents** (owned) before writing system.md.

Scanner scripts are preserved at [scratch/2026-10-01-bcf-metadata-collection/](independent_research/scratch/2026-10-01-bcf-metadata-collection/) (`catalog_crossmatch.py`, `catalog_title_scan.py`, `catalog_scan3.py`) if you want to re-run or extend the probes after a catalog update.

