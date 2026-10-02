# COMBINED MARKDOWN - combine

_Generated 2026-10-02 00:09:08 | 8 files | folder: D:\stuff\docs\taylor_fv\github\rayrite.github.io\cvx\kaggle\items\combine_

## Contents

1. 00_README_cd_opus55h.md
2. 01_Wishlist_Coverage_Gap_and_Critical_Analysis.md
3. 02_Independent_Research_Techniques_Tools_Papers_Books.md
4. 03_Insights_from_Agent_Data_Analyses.md
5. 04_Opus_Metadata_Wishlist_and_Static_Analysis_Report.md
6. 04a_Appendix_Per_Task_Metadata.md
7. 05_Roadmap_and_Checklist_First_Submission.md
8. 06_Setup_Guide_WSL2_Swegemma_RTX5090.md

---

<!-- ====================================================================== -->
<!-- FILE: 00_README_cd_opus55h.md -->
<!-- ====================================================================== -->

# 2026-10-01 — Opus 5.5 Review of the GLM-5.3 / MiniMax-M3 Metadata Work, plus Independent Static Analysis

*Prepared 2026-10-01 by Claude Opus 5.5 for the BCF (Batonic Coding Framework) entry to the Google Gemma 4 Developer Agent competition.*

## Reports (read in order)

| # | File | Answers |
|---:|---|---|
| 01 | [01_Wishlist_Coverage_Gap_and_Critical_Analysis.md](01_Wishlist_Coverage_Gap_and_Critical_Analysis.md) | Task 1: coverage matrix (20 domains), decision coverage, ranked gaps, claim-by-claim verification, consistency audit, weighted scorecard (GLM 74 / MiniMax 58), merge plan |
| 02 | [02_Independent_Research_Techniques_Tools_Papers_Books.md](02_Independent_Research_Techniques_Tools_Papers_Books.md) | Task 2: additive techniques, algorithms, FOSS tools, whitepapers and books not already in the repo's reading lists (web-verified where marked) |
| 03 | [03_Insights_from_Agent_Data_Analyses.md](03_Insights_from_Agent_Data_Analyses.md) | Task 3: the noteworthy insights from both agents' executed data work, each verified ✅ / 🟡 / ❌ |
| 04 | [04_Opus_Metadata_Wishlist_and_Static_Analysis_Report.md](04_Opus_Metadata_Wishlist_and_Static_Analysis_Report.md) | Task 4a: my own wishlist (fields tagged by when they are observable) and an exhaustive static analysis of the 129-task package |
| 04a | [04a_Appendix_Per_Task_Metadata.md](04a_Appendix_Per_Task_Metadata.md) | Per-task table (129 rows) |
| 05 | [05_Roadmap_and_Checklist_First_Submission.md](05_Roadmap_and_Checklist_First_Submission.md) | Task 4b: roadmap and checklist for before, during and after the first test-harness submission run |
| 06 | [06_Setup_WSL2_Swegemma_RTX5090/](06_Setup_WSL2_Swegemma_RTX5090/06_Setup_Guide_WSL2_Swegemma_RTX5090.md) | Setup guide for WSL2, the swegemma wheelhouse and local vLLM on the RTX 5090 PC: Markdown, standalone HTML, and numbered setup scripts |

## Analysis workspace (`analysis/`)

| Path | Contents |
|---|---|
| `scripts/s01…s04_*.py`, `common.py` | Reproducible pipeline (stdlib + numpy), about 12 minutes end-to-end, reading the 21.9 GB ZIP in place |
| `scripts/qc_tables.py` | Markdown table QC used on every report |
| `out/task_metadata_master.csv` | One row per task, ~70 columns: the main data product |
| `out/stats.json` | Every aggregate number quoted in Report 04 |
| `out/*_features.jsonl`, `out/graph_commit_stats.jsonl` | Raw per-task and per-graph outputs |
| `cache/` | `tasks.jsonl` copy and per-snapshot file inventories (scratch) |

## Five things to act on first

1. **Install WSL2 and the swegemma wheelhouse.** This PC has neither Docker nor WSL, so no local harness run is possible yet (Report 05 §1.1).
2. **Un-throttle `eval_config.yaml`.** The sample is set to 1 min / 10 calls. Use about 5 min / 40 calls, and keep the 12-hour total under 10.5 h.
3. **Localize lexically first.** Use statement→file BM25 plus `git log` recency (the history *is* present, despite GLM's report). Together they put the gold file in the top 5 for 105/129 tasks. Use graph tools only for expansion.
4. **Verify by running the whole target test module.** The scorer needs every test in those files to pass: median 11 tests, and 224 for requests.
5. **Fix local tooling.** Re-append the stripped patch newline, and add the `inline-snapshot`, `dirty-equals`, `pytest-httpbin` and `typing-inspection` wheels locally (29 tasks depend on them).

## Quality check

| Check | Result |
|---|---|
| Markdown tables (column counts, separators, blank line before each table, pipes inside code) | `qc_tables.py`: 66 tables across 7 files, **0 issues** |
| Numbers in Reports 01, 03, 04 and 05 | Traced to `analysis/out/stats.json` or the master CSV. Forum-derived facts are labelled [forum] / ⚪ |
| Agent claims marked FALSE | Each one re-tested on the raw ZIP data (git history over 129 snapshots; patch application of 258 patches; AST test counts) |
| Web citations (Report 02) | Verified 2026-10-01 ([W]); items from memory marked [K] |
| Limits | No tests were executed (no Docker/WSL). All oracle facts are structural (Report 04 §11) |


---

<!-- ====================================================================== -->
<!-- FILE: 01_Wishlist_Coverage_Gap_and_Critical_Analysis.md -->
<!-- ====================================================================== -->

# 01 — Coverage, Gap and Critical Analysis of the Two Metadata Wishlists (GLM-5.3 vs MiniMax-M3)

*Prepared 2026-10-01 by Claude Opus 5.5. Every factual claim below that I label as checked was re-verified against the competition ZIP using the scripts in `analysis/scripts/` (see Report 04). Claims I could not check locally (live Kaggle forum facts) are labelled **[forum, unverified here]**.*

---

## 0. Scope and method

**Primary documents reviewed**

| Agent | Primary wishlist | Supporting documents read |
|---|---|---|
| GLM-5.3 | `glm53/independent_research/2026-10-01-bcf-decision-signals-and-metadata-wishlist/03-metadata-wishlist.md` | `README.md`, `01-reverse-engineering-the-win.md`, `02-decision-map.md`, `04-sources.md`; the collection project `2026-10-01-bcf-metadata-collection/` (README, PLAN, ROADMAP, `data/*.md`, `data/deep/*.md`, tools) |
| MiniMax-M3 | `minimaxM3/deliverables/bcf-metadata-wishlist-2026-10-01/03-metadata-wishlist.md` | `README.md`, `01-current-evidence-base.md`, `02-decisions-the-agent-must-make.md`, `07-unknowns-and-residual-risks.md`; the collection deliverable `bcf-metadata-collection-2026-10-01/` (`08`, `09`, `10`) and `scratch/` reports |

**Method**

1. Read both plans in full. Extract every field and every decision.
2. Build a **coverage matrix** over 20 metadata domains that a winning agent needs (§3). Five of these domains come from my own independent wishlist (Report 04), so the matrix is not limited to what the two agents thought of.
3. Build a **decision-coverage comparison** (§4).
4. **Gap analysis**: what neither plan collects, ranked by decision value (§5).
5. **Critical analysis**: each load-bearing factual claim was re-tested on the data (§6), and internal consistency was checked (§7).
6. A weighted **scorecard** (§8) and a **merge recommendation** (§9).

---

## 1. Executive verdict

| | GLM-5.3 | MiniMax-M3 |
|---|---|---|
| **What it really is** | A **project-level measurement plan**: a run ledger, a decision register over 9 weeks, statistical discipline, and a platform watch | A **per-episode instrumentation plan**: the 16 decisions the agent makes inside one task, with per-call, per-edit and per-test fields |
| **Strongest idea** | `termination_cause` as a zero-census field. This turns every structural leak into a rate. Add the ±2.5-task noise floor, exact McNemar, and a CV↔LB pair log | Per-tool-call "wasted call" detection (empty result / repeated result hash), and the "never end with a clean tree" rule (F5) |
| **Weakest point** | The static ground truth contains a high-impact false finding ("snapshots have no git history"). That finding then became a design constraint: **"NO git log/blame tools in the agent"** | Several factual errors in static data handling, and a v1 design that **routes at turn 0 on features derived from the hidden gold patch and test patch** |
| **Data work quality** | Careful and mostly reproducible. One major error (history) and one internal contradiction (node ordering) | Useful coverage, but several misdiagnoses: patch "malformation", a 10-call budget, F2P counts that miss class-method tests |
| **Score (§8, /100)** | **74** | **58** |
| **Best use** | Adopt as the **backbone** (ledger, decision register, statistics) | Adopt its **M3/M4 per-call and per-edit fields** as the P1 layer under GLM's ledger. Discard its v1 routing design |

**Bottom line.** The two plans complement each other. GLM decides *which experiments are worth running and how to read them*. MiniMax decides *what to log inside one episode*. Neither plan exploits the richest free asset in the data:

- the **full git history inside every snapshot**,
- the **static oracle structure of the test patches**: how many tests must stay green, and which tests import APIs that do not exist yet,
- the **information content and solution-leakage of the PR-style problem statements**.

Neither plan treats the private-repository test set as a **distribution shift** that has to be designed for.

---

## 2. What each plan contains (structure)

### 2.1 GLM-5.3: tiered ledger (P0–P4), 15 project decisions (D1–D15)

| Tier | Content | Field count (approx.) |
|---|---|---:|
| P0 Receipts | Run manifest (8), per-task outcome (12, incl. `termination_cause` with 10 values), budget telemetry, submission log (CV↔LB) | ~30 |
| P1 Trajectory | Per-turn tool / tokens / edit result / loop detector / thinking presence / compaction / rescue / journal hash / phase transitions / forced-submit | ~11 |
| P2 BCF internals | Classification, spec, localization arm, P@1/P@5, anchor-in-graph, fix order, gates, wrong-fix autopsy, budget transfers | ~10 |
| P3 Corpus annotation | Taxonomy (κ ≥ 0.70), gold files and rank, async flag, oracle-asymmetry P-1 probe, test-deps, difficulty priors | ~7 |
| P4 Platform watch | Staff-patch status, error incidence, queue times, LB deltas | ~5 |
| Extras | W1–W10 cross-check, field→decision closure table, anti-wishlist, 10 "Monday queries" | — |

### 2.2 MiniMax-M3: 6 clusters (M1–M6), 16 in-episode decisions (D-1…D-16)

| Cluster | Content | Fields |
|---|---|---:|
| M1 Task preconditions | Statement length, named files and symbols, hints, traceback, test keywords, graph exists | 7 |
| M2 Agent state | Turns, budget fraction, tool calls, last edit turn, first graph call, per-phase budget | 6 |
| M3 Tool-call outcomes | Name, ok, latency, tokens, return size, empty, **wasted**, graph-waste rate, repeat rate | 9 |
| M4 Edit / patch shape | Edit calls, final files and size, revert-within-N, parse status, line offset at edit, tree dirty, apply check | 11 |
| M5 Test / verify | pytest exit, JUnit pass/fail/skip, target-test vector (scorer-only), regression flag, journal writes | 11 |
| M6 Environment | KV saturation, adapter zeroing, vLLM errors, sandbox timing, compaction interval, image, thinking budget | 10 |
| Extras | JSON Schema per task record, cost-per-field table, "what we don't measure" | — |

The headline says "47 fields". The tables actually list 54 rows. The document admits the mismatch (§8 "Field count check").

---

## 3. Coverage analysis (20 domains × 2 plans)

Legend: **●** full / **◐** partial / **○** absent. "Opus" is what my own wishlist (Report 04 §1) adds.

| # | Metadata domain | Why it matters | GLM | MiniMax | Opus |
|---:|---|---|:---:|:---:|:---:|
| 1 | Run receipts and termination cause | Turns leaks into rates; the basis of zero-census | ● | ◐ (`agent_error`, `resolved`) | ● (adopt GLM) |
| 2 | Per-call tool telemetry | Loops, wasted calls, edit failures | ◐ | ● | ● (adopt MiniMax) |
| 3 | Edit integrity (match tier, escaping, revert churn) | 48/77 edit-failure anecdote [forum] | ● | ● | ● |
| 4 | Verification signals (JUnit, skipped = fail, regression) | Matches the scorer's strict gate | ◐ | ● | ● |
| 5 | BCF-internal provenance (class, spec, localization arm, P@k) | Ablation attribution | ● | ◐ (decisions block) | ● |
| 6 | Statistical decision protocol (paired, McNemar, noise floor, CV↔LB) | ±2.5-task noise | ● | ○ | ● (+ CUPED covariates) |
| 7 | Platform / environment (KV, thinking bug, wheelhouse) | Structural zeros | ● | ● | ◐ |
| 8 | Static gold-patch shape | Size and scope priors | ● | ● | ● |
| 9 | **Test-oracle structure** (number of tests in target files = P2P blast radius; added vs modified tests) | Every test in the target files must pass, not just the new ones | ○ | ◐ (F2P count only; misses class methods) | ● |
| 10 | **Interface burden** (tests import symbols/modules absent at base) | "Implement exactly-named API" tasks cannot be solved without guessing names | ○ | ○ | ● |
| 11 | **Statement information content** (PR-template boilerplate, title-only, effective characters) | Many statements carry almost no specification | ◐ (length only) | ◐ (length only) | ● |
| 12 | **Solution leakage** (statement names the fix, the gold symbol or the file) | Main cause of CV↔LB shift if the private set differs | ○ | ○ | ● |
| 13 | **Exception-class signature** (statement + test `pytest.raises` + gold raise/except) | BCF's core thesis; needs a measured prior | ◐ (P2 label; GLM notes ≤ 6 tracebacks) | ◐ (traceback flag) | ● |
| 14 | **Git-history affordance** (commits available; recency prior for the gold file) | A free localization signal | ✗ (asserts there is no history, which is wrong) | ○ | ● |
| 15 | Graph/embedding quality joined to gold (in-graph rate, hops, anisotropy, test-node share) | Should graph tools be used at all, and when | ● (async census, gold-file join) | ◐ (degeneracy claim) | ● |
| 16 | **Offline localization baselines** (BM25 / recency / node-BM25 / embedding P@k vs gold) | Sets the bar any agent localization must beat, at zero GPU cost | ◐ (proposed as A-1, not run) | ○ | ● (measured) |
| 17 | **Turn-0 observable signals** (graph-tools section present in the prompt; workspace layout truncation; budget lines) | What the agent can *know* before the first tool call | ○ | ◐ (says graph existence is only knowable on Dec 2, which is wrong) | ● |
| 18 | **Hidden-set distribution shift** (private repos, no memorization, statement style) | Explains CV→LB collapse | ◐ (LORO, OOD probe) | ○ | ● |
| 19 | Local-CV environment gaps (missing test deps, harness parity) | Dead tasks poison paired diffs | ◐ (14 tasks, added-line imports only) | ○ | ● (29 tasks, full-file imports) |
| 20 | Retrievability of agent-side telemetry (does `/tmp` data survive?) | Container A is wiped, and Kaggle returns only a score | ○ | ○ | ● (emit via tool stdout into the trace) |

**Coverage score** (● = 1, ◐ = 0.5, ✗/○ = 0):

| Plan | Score | Share of the 20 domains |
|---|---:|---:|
| GLM | 10.5 / 20 | 53% |
| MiniMax | 8.5 / 20 | 43% |
| Union of the two | 13 / 20 | 65% |

The seven domains neither plan covers are rows 9–14 and 16–20 in the table above (some only partly).

---

## 4. Decision coverage

The two registers operate at different altitudes:

- **GLM's D1–D15** are *project* decisions: LoRA go/no-go, caps, thinking on/off, localization doctrine, spec gate, compaction, edit path, architecture, teacher, submission cadence, CV protocol, paper, hardware, rescue parameters, scope cuts.
- **MiniMax's D-1…D-16** are *episode* decisions: whether to spec, which template, whether to use the scout, graph vs grep, insurance edit, rescue trip, continue vs revert, submit now, what to grep, read range, edit vs read, single vs multi bug, edit tests, journal, LoRA canary, final submit.

| Decision area | GLM | MiniMax | Missing in both |
|---|---|---|---|
| Budget (per-task caps, Σ ≤ 10.5 h) | D2 (strong) | D-5/D-8/D-16 (in-episode) | **Task-order/time allocation using static difficulty priors** at turn 0 |
| Localization strategy | D4 (dual path) | D-3/D-4/D-9/D-10 | **Turn-0 seed choice among BM25 / recency / graph**, informed by measured hit rates |
| Verification | D7 / G-gates | D-7/D-8/D-13 | **Which test files to run** (the target-file guess) and **whether to write a reproduction test**, gated by oracle kind |
| Interface / API tasks | — | — | **Detect "implement a new named API" tasks and change strategy** (search the docs for names, keep the API surface minimal, follow conventions) |
| Statement quality | D5 (Chow dispatch) | D-1/D-2 | **Low-information triage**: title-only statements should go to the cheap path with immediate exploration |
| Distribution shift | D11 (LORO) | — | **What the private test set rewards**: robustness to statements that describe the symptom rather than the fix |

---

## 5. Gap analysis (ranked by decision value)

| Rank | Gap | Evidence it matters (from my static analysis, Report 04) | What to collect | Cost |
|---:|---|---|---|---|
| 1 | **Git history is present and unused** | 128/129 snapshots carry the upstream history (fastapi median 6,356 commits; rich 4,127; requests 6,420; httpx 4). The gold file was touched within the last 20 commits in 59/122 tasks | `git_commits`, `recency_rank_of_candidate`; agent-side: a one-call `git log --name-only -n 50` prior | ≈ 0 (one tool call per task) |
| 2 | **P2P blast radius ignored** | The scorer runs every test in the target files and needs exit code 0. The median target file holds **11** tests; **33/129 tasks have ≥ 50**; requests' median is **224** | `tests_in_target_files`; agent rule: run the whole target test file, not just one test | Static, free |
| 3 | **Interface-burden tasks unidentified** | **9/129** tasks' tests import symbols or modules that do not exist at base and are introduced by the gold patch (e.g. `fastapi.routing.RouteContext`, `rich.cells.split_graphemes`, `scripts.prepare_release`). **40/129** gold patches add new defs | `interface_burden`; agent detector: the reproduction test hits ImportError, or the statement says "add/support" | Static, free |
| 4 | **Statement information and solution leakage** | 34 statements are title-only; 31 carry PR templates; median *effective* text is 268 characters (rich: **61**); titles start with "Fix" in 56 tasks; the statement names a gold-enclosing symbol in **35/129** | `stmt_eff_chars`, `title_only`, `solution_phrased`, `mentions_gold_symbol` | Static, free |
| 5 | **No offline localization bar** | Statement→file BM25 puts the gold file at **#1 in 59/129** and **top-5 in 99/129** (of a median of 739 fastapi candidates). Union with the recency prior covers top-5 in **105/129**. Node-level BM25 reaches top-5 in 62/129 | Report P@k per arm per repo; any agent localization arm must beat these | Done (Report 04) |
| 6 | **Exception-class prior not measured** | Only **15/129** statements name an exception class; **0** contain a full traceback; **10/129** tests are `pytest.raises`-style oracles, all fastapi | `exc_signature`, `oracle_kind` per task; BCF's classes must come from a reproduction run, not from the statement | Static, free |
| 7 | **Turn-0 observability** | The harness appends the "Code Intelligence Tools" section **only when graph and embedding files exist**. That answers MiniMax's "U4", whether hidden repos ship graphs, at turn 0 on every hidden task, not on Dec 2. The workspace layout exceeds 150 entries in **115/129** tasks, so the prompt listing is truncated | `prompt_has_graph_section`, `layout_truncated` | Free |
| 8 | **Telemetry retrievability** | Container A is wiped after each task, and the Kaggle scorer returns only the score. `/tmp` journals are **not** retrievable unless echoed through tool output (which the ATIF trace captures, locally only) | A design rule: every P2 event is printed as a tool-call stdout line with a fixed prefix (e.g. `BCF_EVT {...}`) | Design only |
| 9 | **Local CV environment gap understated** | Full-file import analysis: **29** tasks import packages absent from the wheelhouse (`inline_snapshot` 22, `dirty_equals` 9, …). GLM counted 14 from added lines only. requests tests also need the `pytest-httpbin` fixture plugin [forum] | Quarantine list v2, or add these wheels to the local image (the scorer evidently has them: host says gold validates 100% [forum]) | 1 h |
| 10 | **Large-file navigation cost** | The gold edit starts beyond line 150 (the first `read_file` window) in **51/129** tasks; **65/129** gold files exceed 1,000 lines; 26 exceed 2,000 | `gold_first_line`, `gold_max_file_lines`; agent rule: `grep -n` before `read_file` | Static, free |

---

## 6. Critical analysis: claims re-tested against the data

### 6.1 GLM-5.3

| # | GLM claim | Where | My test | Verdict |
|---:|---|---|---|---|
| G1 | "Snapshots have NO history — synthetic single-commit exports … `git log`/`blame`/`diff-vs-base` are impossible in-sandbox" | collection README §3 finding 5; `snapshot-verify.md`; ROADMAP C4 ("NO git log/blame/show tools in the agent") | Extracted `rich_2725` and `httpx_3672`; ran `git rev-list --count HEAD` over **all 129** snapshots | **FALSE.** History is present: rich 3,787–4,449 commits, fastapi 6,016–7,353, requests 6,205–6,475, httpx 4. The SHAs are **rewritten** by `git fast-export | fast-import`, which is why the task's `base_commit` SHA is absent (0/129). GLM tested only for that SHA. The HEAD commit predates `created_at` in 129/129 tasks (median gap 4.9 h), so there is no future leak. **Consequence: ROADMAP C4 removes a useful localization tool. Reverse it.** |
| G2 | "129/256 graph and embedding files are 0-byte in the ZIP … repair before local runs" (Leak 5; wishlist §7.5) | `01` §3 Leak 5; `03` §7 | ZIP manifest: 127 graphs + 127 npz, **0 zero-byte** entries | **Outdated inside GLM's own package.** The collection README already corrects it ("Local ZIP has zero 0-byte entries"), but the wishlist still lists it as a P0 action. It is a download-tool artifact [forum], not a property of the data |
| G3 | "Graphs: single `calls` edge type, no import/containment edges" | `01` Leak 5 | `calls` is indeed the only type (452,588 edges), but a median **8.8%** of `calls` edges are parent→child (`Class → Class.method`), i.e. containment encoded as calls | **Partly wrong.** Containment is present, disguised as `calls`. This matters for hop-distance metrics (λ) |
| G4 | ROADMAP C11 "Node lists are name-sorted (129/129)" vs `graph-deep-summary.md` "name-sorted in 0/129" | ROADMAP vs deep summary | — | **Internal contradiction.** Its own tool output says 0/129 |
| G5 | "14 fastapi tasks import inline_snapshot/dirty_equals" | `testdeps-summary.md` | Full post-patch test-file import scan | **Undercount.** Only lines added by the test patch were scanned. Whole target files: **29** tasks (27 fastapi + 2 rich) |
| G6 | "async hole: 0 first-class async nodes" | `graph-deep-summary.md` | Gold-hunk enclosing-function analysis: **20/129** tasks edit inside an `async def` (19 fastapi) | **Confirmed**, and this quantifies its task impact |
| G7 | "Exception-class conditioning applies to ≤ 6 tasks; CLASSIFY's real input is prose" | collection README finding 1 | 15/129 name an exception class; 0 contain `Traceback (most recent call last)` | **Confirmed in substance.** Strong, honest finding |
| G8 | "58 public LB tasks; σ ≈ 2.5 tasks; top-10 within noise" | `01` §1–2 | Not checkable locally; the arithmetic is internally consistent with binomial σ at p ≈ 0.15, n = 58 | **Plausible**, and the most decision-relevant framing in either package |
| G9 | Forum-derived leaks (44/44 overflow patch loss, LoRA KV 46,048→7,600, thinking drop 0.35×) | `01` §3 | Not checkable locally | **[forum, unverified here].** Treat as hypotheses to re-check on the first instrumented runs. GLM's own P0/P1 fields are designed to do exactly that |
| G10 | "P2 events written by the agent to /tmp" as a collection source | `03` §7.2 | HARNESS_README §4.1: Container A's `/tmp` is wiped at teardown; Kaggle returns only the score | **Collection gap.** Workable only if events are echoed into tool stdout, so they land in the local ATIF trace |

### 6.2 MiniMax-M3

| # | MiniMax claim | Where | My test | Verdict |
|---:|---|---|---|---|
| M1 | "Patches encode empty context lines as a bare `+` … `git apply` rejects; 9/129 malformed even for GNU patch" | `09` §Implementation caveat, §M4.11; `10` F6 | Inspected all 258 patch strings | **FALSE diagnosis.** Every `patch` and `test_patch` string was `.strip()`-ed when the dataset was built: no final newline, and a trailing blank context line `" "` disappears. After restoring the tail, **129/129 gold and 129/129 test patches pass `git apply --check`**, including all nine "malformed" ones. The recommended pre-submit gate `patch --dry-run` on the *agent's* patch is still sensible. The rule that 7% of gold patches are malformed is not |
| M2 | "These are the actual evaluation constraints: ≤ 10 tool calls, ≤ 1 minute, ≤ 50 turns" | `08` §"What this run changes" 5; `10` F1 and the whole v1 budget | `eval_config.yaml` belongs to the sample submission; HARNESS_README §7.1 says defaults are 60 min / 100 calls and the file is competitor-controlled | **FALSE.** It reads the sample's self-throttle as a platform constraint. The entire v1 design (3–6 tool calls per task) is over-compressed as a result |
| M3 | v1 Phase 0 routes fast/slow path on `m5.multi_bug_indicator` and `m4.final_added_lines` | `10` §6.2–6.3 | These come from `test_patch` and the gold `patch`, which the agent never sees | **Design-breaking leakage.** The router cannot run on hidden tasks. It also contradicts MiniMax's own "No FAIL_TO_PASS leakage" standard (`07` §11) |
| M4 | "M5.5 is the secret weapon … the BCF plan-loop can emit 'the N tests that must turn green'" | `09` §M5.5 | Same as M3 | **Contradiction / leakage.** Valid only as post-hoc analysis |
| M5 | "38% of tasks are multi-bug (F2P ≥ 2)"; "requests 12/13 have F2P = 0" | `08` §Phase 1b | AST count of collectable tests in the post-patch test files | **Wrong proxy, buggy count.** The regex `+def test_*` misses indented class methods; requests tests are mostly `TestRequests.test_*` methods. The number of added tests ≠ the number of bugs. **25** tasks add **no** new test function at all (19 only modify existing tests) |
| M6 | "All 129 tasks have a graph file … no fallback path is needed" | `08` §"What this run changes" 4 | Async hole: 20 tasks edit inside `async def`; 54 tasks include module-level edits with no node; 15 tasks have gold edits that map to no graph node | **Overreach.** Having a graph file ≠ the graph covering the fix site |
| M7 | "U4 [hidden graphs?] … resolvable on Dec 2 only" | `07` §1, §5 | HARNESS_README §5.2: the "Code Intelligence Tools" prompt section is appended **only** when graph and embedding files over 100 bytes exist | **Wrong.** It is observable at turn 0 of every scored task. The agent can branch on it, and a probe submission reveals it |
| M8 | "Embeddings near-degenerate (98.6% have a > 0.99 neighbour) → `search_similar_code` is a noise source" | `01` F2; `08` §2b | Mean pairwise cosine: raw 0.79 median → **0.09 after mean-centering**. > 0.99 neighbours: 97% of sampled nodes, but for rich/requests **0** are identical text (anisotropy). For fastapi, 33% *are* literally duplicated `docs_src` tutorial code. Retrieval from statement-resolved seeds: when the seed is not the gold node itself, the median gold rank is the top **4.5%** of nodes (raw ≈ centered) | **Half right.** Strongly anisotropic, and partly true duplication in fastapi, but not pure noise: the tool carries locality signal. MiniMax's own probe report says "PARTIAL" while the deliverable says "CONFIRMED" |
| M9 | "Sandbox resume warm = False because eval_config lacks `reuse_containers`" | `09` §M6.5 | `reuse_containers` is a harness setting (HARNESS_README §4.1), not an `eval_config` key | **Non sequitur** |
| M10 | "docker_image_name = python:3.13-slim" | `08` §Phase 3 | That is the `FROM` base; the runtime image is `swebench-sandbox:latest` | **Mislabelled** |
| M11 | D-14: "The agent doesn't have direct write access to `/tmp` without a skill script" | `02` D-14 | `run_command` runs arbitrary bash in the container; the README explicitly recommends `/tmp/repro.py` | **FALSE** |
| M12 | "the 129-task SWE-bench Verified"; "textsearch/rich"; R3 "~30% by analogy to Qwen-Mistral-Nemo on SWE-bench Verified" | `07` U7, `01` §4, `07` R3 | — | **Factual slips / unsupported numbers** |
| M13 | F3/F5 evidence: "96% of issues never name a .py file"; "never end with a clean tree" | `01` §2 | 14/129 statements mention a gold file (basename, path or module) | **Consistent.** The dirty-tree rule is sound given the harness fallback capture (HARNESS_README §8.1) |

### 6.3 Shared blind spots

1. **Both treat the 129 public tasks as representative of the scored set.** The Data page says the test set "was curated from a set of private repositories" and filtered so that "a larger frontier model can pass the case or get within a single test case of passing." The consequences:
   - no memorization advantage on hidden repos,
   - no repo-specific priors (fastapi conventions) transfer,
   - statement style may differ,
   - difficulty is truncated from above.

   Neither wishlist has a field that measures robustness to this shift. Examples would be leave-one-repo-out deltas per feature, or performance on statements with the "fix" wording removed.
2. **Neither defines what the agent can observe at turn 0** versus what is only available post hoc. That boundary should be a schema attribute on every field: `observable_at ∈ {turn0, runtime, post_hoc_scorer_only}`.
3. **Neither quantifies the scoring rule's breadth.** A task resolves only if *every* test in the target files passes (exit 0, no skips). The relevant risk is collateral breakage across a whole test module, not just "the F2P tests".

---

## 7. Internal-consistency audit

| Issue | GLM | MiniMax |
|---|---|---|
| Field identifiers referenced but undefined | — | D-9 uses `M3.10`, D-10/D-11 use `M3.11`; neither exists in `03` |
| Field identifiers that mean something else | — | D-1 uses "M1.4 (spec-template eligibility)", but M1.4 = `hint_text_chars`. D-12 uses "M1.5 (and/also count)", but M1.5 = `traceback_present`. D-9 uses "M1.6 (named-symbol)", but that is M1.3 |
| Headline numbers vs body | "Repair 0-byte copies" (wishlist) vs "zero 0-byte entries" (collection) | "47 fields" vs 54 rows; "9 of 16 decisions" vs "16 of 16 flipped" (`07` §12) |
| Unknown numbering | — | U1–U7 in `07` ≠ U1–U14 in `01` (different questions under the same IDs) |
| Markdown defects | none found in sampled tables | Broken row in `01` §7.1 (the tool #6 `write_file` row starts with a stray backtick instead of "6"); evidence-base link text "… no wait → absolute path" left in |
| Self-contradicting conclusions | ROADMAP C11 vs deep summary (sorting) | "No FAIL_TO_PASS leakage" standard vs v1 router using F2P-derived features |

---

## 8. Weighted scorecard

| Criterion | Weight | GLM (0–10) | MiniMax (0–10) | Notes |
|---|---:|---:|---:|---|
| Decision linkage (every field feeds a decision) | 15 | 9 | 7 | GLM's closure table is exemplary; MiniMax has dangling IDs |
| Coverage of needed domains (§3) | 15 | 6 | 5 | — |
| Factual accuracy of static claims | 20 | 6 | 3 | G1 is severe; M1–M5 are several severe errors |
| Feasibility / collectability | 10 | 7 | 6 | Both miss the `/tmp` retrievability problem; MiniMax's M6 vLLM fields can't be observed on Kaggle |
| Leakage hygiene (runtime vs post-hoc) | 10 | 9 | 3 | MiniMax's v1 router uses gold/test features |
| Statistical rigor | 10 | 9 | 3 | — |
| Actionability (cost, ordering, hooks) | 10 | 7 | 8 | MiniMax's ★/✦/✧ cost tiers are practical |
| Clarity and internal consistency | 10 | 7 | 5 | — |
| **Weighted total (/100)** | 100 | **74** | **58** | |

---

## 9. Merge recommendation

1. **Backbone = GLM P0 ledger + D-register + statistics.** Fix G1: re-enable git history as a localization arm. Fix G2: drop the 0-byte repair task. Fix G5: use quarantine list v2 (29 tasks).
2. **P1 layer = MiniMax M3 + M4 fields.** Keep `wasted_tool_call`, `repeat_action_rate`, `reverted_within_n_turns`, `line_offset_at_edit`, `tree_dirty_at_end`.
3. **Discard** MiniMax's v1 Phase-0 router (M3) and the 10-call budget premise (M2). Replace them with turn-0 *observable* triage: statement information content, title verb, prompt graph section, BM25 top-k concentration.
4. **Add the Opus static layer** (Report 04): blast radius, interface burden, solution leakage, exception signature, history recency, baseline P@k, large-file navigation, turn-0 observability, CV quarantine v2. Tag every field with `observable_at`.
5. **Add a telemetry transport rule.** Every agent-side event is printed to stdout of a tool call with a `BCF_EVT` prefix, so it lands in the ATIF trace locally.


---

<!-- ====================================================================== -->
<!-- FILE: 02_Independent_Research_Techniques_Tools_Papers_Books.md -->
<!-- ====================================================================== -->

# 02 — Independent Research: Techniques, Algorithms, FOSS Tools, Papers and Books to Improve BCF and Extend the Data Analysis

*Prepared 2026-10-01 by Claude Opus 5.5. This adds to the reading lists already in the repo; it does not repeat them.*

---

## 0. How this list was built, and what it leaves out

**Rule for inclusion.** Before adding an item, I searched the earlier lists for it: `2026-10-01_BCF_v1_Roadmap/02–05`, `2026-09-30_FOSS_Tools`, `2026-09-30_BCF/03`, both book catalogs, the BCF Reference Compendium, GLM-5.3's `READING.md`, and MiniMax-M3's `10-bcf-v1-roadmap.md`. Items those lists already cover are left out: SWE-agent, Agentless, OpenHands, SWE-Gym, SWE-smith, R2E-Gym, SWE-rebench, GRPO/DPO/QLoRA/Unsloth/axolotl, DSPy/GEPA, SBFL basics (Ochiai/DStar), delta debugging, LocAgent, GraphRAG, McNemar, Wilson CIs, *Why Programs Fail*, and *Working Effectively with Legacy Code*. Every item below was either missing from those lists or appeared only as a passing mention with no plan for using it.

**Rule for relevance.** Each item is tied to one or more of:

- a specific weakness found in the static data (Report 04),
- a BCF phase (CLASSIFY, SPECIFY, LOCALIZE, PATCH, VERIFY, RESCUE), or
- an analysis that is still missing (Report 01, §5).

**Verification labels**

| Label | Meaning |
|---|---|
| **[W]** | Checked on the web on 2026-10-01; the link is given. |
| **[K]** | From my own knowledge (cutoff mid-2026). The citation is standard and well known, but I did not re-check it today. Confirm before citing in the paper. |

**Sandbox constraints that limit where each item can be used.** These come from HARNESS_README and the competition Overview:

- The agent sandbox is offline, with 2 vCPU and 4 GiB RAM, Python 3.13, git, and pytest.
- The only allowed file types in a submission are `.py .md .txt .yaml .yml .json .safetensors`.
- Skill scripts run inside the container.

So anything with native extensions, model weights, or `.pyi`/`.so` files is **dev-time only** — it can't run in the sandbox. Pure-Python, stdlib-only code can be **vendored** into a skill.

---

## 1. Top 12 additions, ranked by expected value for the first submissions

| Rank | Item | Kind | BCF phase | Why now (linked to a data finding) | Where it runs |
|---:|---|---|---|---|---|
| 1 | Git-history recency prior (FixCache / BugCache family) | Algorithm | LOCALIZE | The snapshots **do** contain full git history (rewritten SHAs, thousands of commits). One `git log --name-only -n 50` gives a strong prior on which files to look at (Report 04 §5) | In-sandbox (`run_command`) |
| 2 | Observation masking: "The Complexity Trap" | Paper + technique | Context / RESCUE | It halves cost with no loss of solve rate in SWE-agent. That speaks directly to the 32k-context overflow leak that GLM documented | Prompt and agent design |
| 3 | Issue-reproduction test generation (Otter / e-Otter++ / SWT-bench / SWE-Tester), with the counter-evidence | Papers | VERIFY | `test_patch` is hidden at run time. The agent's only executable oracle is a reproduction test it writes itself. Evidence on whether these tests help is mixed, so treat this as an ablation, not a default | In-sandbox |
| 4 | Two-axis defect taxonomy: ODC defect type × trigger, plus Pan et al. bug-fix patterns | Taxonomy theory | CLASSIFY / SPECIFY | Only 15/129 statements name an exception class. A taxonomy built only on exception classes has almost nothing to condition on, so BCF needs a symptom × fix-pattern grid | Paper + prompt |
| 5 | Stdlib SBFL via `sys.settrace` / `trace` (FauxPy as the reference design) | Algorithm + tool | LOCALIZE | Once a failing reproduction test exists, about 40 lines of stdlib code give an Ochiai ranking of lines and functions inside the sandbox, without coverage.py | In-sandbox (vendored skill) |
| 6 | Stdlib-`ast` async-aware call graph (PyCG / Scalpel / pyan as design references) | Tool design | LOCALIZE | The provided graphs have **zero** first-class async nodes. A small AST pass inside a skill fills that gap | In-sandbox (vendored skill) |
| 7 | Solution-leakage literature (SWE-Bench+) and weak-test literature (PatchDiff, UTBoost) | Papers | CLASSIFY / VERIFY + paper | The task statements are **PR descriptions** that often describe the fix itself. The private test set may or may not share this property; it is a major source of CV↔LB drift | Analysis + paper |
| 8 | Paired-difference error bars with covariate adjustment (Miller 2024; Kohavi's CUPED) | Statistics | Experiment protocol | With noise of ±2.5 tasks, regression adjustment using the static difficulty features in Report 04 cuts the number of runs needed per decision | Dev-time |
| 9 | BM25 retrieval as a vendored skill (`rank_bm25`-style, pure Python) | Tool | LOCALIZE | Statement→file BM25 ranks the gold file first on a large share of tasks (Report 04 §5). It is cheap and deterministic | In-sandbox |
| 10 | SweRank / CoRNStack (CodeRankEmbed) | Papers + models | LOCALIZE (offline) | A better code retriever for offline analysis and for building LoRA training data. The provided embeddings are near-degenerate | Dev-time only |
| 11 | Trae Agent (generate → prune → select) | Paper + tool | PATCH / VERIFY | The best-documented open test-time-scaling design. Within ~6 min per task, only a 2-candidate version is affordable | Dev-time reference |
| 12 | Kimi-Dev ("Agentless training as skill prior") | Paper | LoRA track | If the LoRA gate opens, train workflow skills (localize, edit, self-reflect) first, then agentic behavior | Dev-time |

---

## 2. Techniques and algorithms, grouped by BCF phase

### 2.1 CLASSIFY / SPECIFY: replace a grid built only on exception classes

**The data problem.** The static analysis (Report 04 §3) found:

- 15/129 statements name an exception class.
- 6/129 contain any traceback text.
- 34 statements are effectively title-only.
- 31 carry PR-template boilerplate.

A class grid keyed on exception types has almost nothing to condition on at turn 0. The literature offers better-founded grids.

| Item | Source | What to take from it | Status |
|---|---|---|---|
| **Orthogonal Defect Classification (ODC)** | Chillarege et al., *IEEE TSE* 18(11), 1992, DOI 10.1109/32.177364 ([ADS](https://ui.adsabs.harvard.edu/abs/1992ITSEn..18..943C/abstract), [Wikipedia](https://en.wikipedia.org/wiki/Orthogonal_defect_classification)) | Two orthogonal attributes. **Defect type** (assignment, checking, algorithm, interface, function, timing…) tells you about the fix. **Trigger** (what exposed it) tells you about the symptom. Orthogonality and "necessary and sufficient" conditions are exactly the formal property BCF's ρ = I(R;C)/H(R) claim needs from its classes. | [W] |
| **Bug-fix patterns** | Pan, Kim, Whitehead, "Toward an understanding of bug fix patterns", *Empirical Software Engineering* 14(3), 2009 | 27 automatically detectable fix patterns, e.g. *IF-CC* (change of if-condition), *MC-DAP* (method-call parameter change), *AS-CE* (assignment expression change). They can be mined from a diff. Report 04 shows the gold patches split into small replacements, guard additions and logic rewrites, which is the same space. | [K] |
| **Template-based repair for Python type errors (PyTER)** | Oh & Oh, ESEC/FSE 2022, DOI 10.1145/3540250.3549130 ([PDF](https://prl.korea.ac.kr/papers/fse22.pdf)) | The best published example of **exception-class-conditioned repair**: `TypeError` traces → type-aware fault localization → typed fix templates; 48.4% fixed at 77.6% precision on 93 bugs. This is the right citation for the BCF "class narrows the search space" thesis, and it is honest about needing a failing run that *produces* the exception. | [W] |
| **Fix templates for LLM prompts** | "Domain Knowledge Matters: Improving Prompts with Fix Templates for Repairing Python Type Errors", ICSE 2024 (cited from the PyTER result above) | Shows that templates help as **prompt context** for an LLM, which is a cheap way to ship BCF's `fix_shape` vocabulary as a skill resource. | [W] (via citation) |

**Recommended design change.** Make the BCF class a **pair**:

- `symptom` = ODC trigger-like. Computed from the *reproduction run*, not from the statement: `ImportError` (missing interface) / expected-exception-not-raised / unexpected exception class / wrong output / warning.
- `fix_shape` = Pan-style pattern, predicted.

The static data already supports estimating the prior for both axes (Report 04 §3.4). The symptom axis is **observable after one reproduction run**. That is when exception-class conditioning becomes real.

### 2.2 LOCALIZE: cheap, deterministic signals that beat the provided graph tools

| Item | Source | Use in BCF | Status |
|---|---|---|---|
| **FixCache / BugCache (history-based defect prediction)** | Kim, Zimmermann, Whitehead, Zeller, "Predicting Faults from Cached History", ICSE 2007; Rahman et al., "BugCache for inspections: hit or miss?", FSE 2011 | Recently changed and recently fixed files are disproportionately likely to hold the next fix. The snapshots keep the full upstream history (Report 04 §2), so `git log --name-only -n 50 -- '*.py'` is a **one-tool-call localization prior**. Report 04 §5 gives its measured hit rate on the 129 tasks. | [K] |
| **BM25 statement→file and statement→function ranking** | Robertson & Zaragoza, "The Probabilistic Relevance Framework: BM25 and Beyond", 2009; Agentless uses it (already covered) | Not new as a method. What is new is the **measured** strength on this corpus (Report 04 §5), and the option to vendor it as a ~60-line pure-Python skill (`rank_bm25` is pure Python, Apache-2.0) | [K] |
| **SweRank (retrieve + list-wise rerank for issue localization)** | Reddy et al., arXiv:2505.07849, ICLR 2026 ([arXiv](https://arxiv.org/abs/2505.07849), [code](https://github.com/SalesforceAIResearch/SweRank)); follow-up SweRank+ arXiv:2512.20482 | It can't run in the sandbox (model weights). Use it **offline** to build a reference localization ranking for the 129 dev tasks, as a ceiling to compare in-sandbox heuristics against, and as hard-negative mining for LoRA data | [W] |
| **CoRNStack / CodeRankEmbed** | Suresh et al., ICLR 2025, arXiv:2412.01007 ([arXiv](https://arxiv.org/pdf/2412.01007), [model](https://huggingface.co/nomic-ai/nomic-embed-code)) | A 137M code retriever. Offline only: re-embed the 129 graphs' node texts to test how much the *provided* 256-d embeddings lose (Report 04 §6 shows they are strongly anisotropic) | [W] |
| **Embedding post-processing: "All-but-the-Top" and whitening** | Mu & Viswanath, ICLR 2018; Su et al., "Whitening Sentence Representations…", 2021; Gao et al., "Representation Degeneration Problem", ICLR 2019 | The provided embeddings have a mean pairwise cosine near 0.85 (MiniMax measured this; I re-measured it in Report 04 §6). Mean-centering removes the common direction. The harness's `search_similar_code` can't be changed, but for **offline analysis and the paper's Code-Comprehension track** this is a cheap, citable fix | [K] |
| **Async-aware static call graph** | PyCG (Salis et al., ICSE 2021, [GitHub](https://github.com/vitsalis/PyCG); archived Nov 2023, breaks on Python ≥ 3.12 per the [pycg-ml fork](https://github.com/smirnoffmg/pycg-ml)); Scalpel (Li et al., 2022); pyan3 | None of these document `async def`/`await` support (checked: no async in PyCG's feature list). **Recommendation:** don't vendor them. Write about 150 lines of stdlib `ast` code that emits `async def` nodes and `await` call edges for the files the agent is looking at. That fills exactly the hole the provided graphs have | [W] |
| **Spectrum-based fault localization in stdlib** | FauxPy: Rezaalipour & Furia, arXiv:2404.18596 ([arXiv](https://arxiv.org/pdf/2404.18596), [replication](https://github.com/atom-sw/fauxpy-experiments)); the empirical study arXiv:2305.19834 on 135 BugsInPy bugs | FauxPy itself is a pytest plugin built on coverage.py, which is not in the wheelhouse, so use it dev-time. In-sandbox, `sys.settrace` + Ochiai over (reproduction test failing, nearby tests passing) gives function-level suspiciousness. It only works after a failing reproduction test exists, so it belongs in RESCUE, not the default path | [W] |
| **Stack-trace-based localization** | CrashLocator (Wu et al., ISSTA 2014); FauxPy's stack-trace mode | When a reproduction run produces a traceback, rank the frames inside the repo by recency. Zero model cost | [K] |

### 2.3 VERIFY: the agent can't see `test_patch`, so it must write its own oracle

| Item | Source | Takeaway | Status |
|---|---|---|---|
| **Otter / Otter++** | Ahmed et al., ICML 2025, arXiv:2502.05368 ([arXiv](https://arxiv.org/pdf/2502.05368)) | Builds tests from the issue text plus repo code, with rule-based checks and repair of the generated tests. Otter++ reached 37% fail-to-pass on TDD-Bench-Verified. As a patch filter: 65–92% precision, 30–41% recall | [W] |
| **e-Otter++** | arXiv:2508.06365 ([arXiv](https://arxiv.org/html/2508.06365)) | Adds execution feedback: 63% average fail-to-pass | [W] |
| **SWE-Tester** | arXiv:2601.13713 ([arXiv](https://arxiv.org/pdf/2601.13713)) | Trains open LLMs for issue reproduction. Relevant if the LoRA gate opens | [W] |
| **Counter-evidence** | SWE-Doctor, arXiv:2607.00990; "Rethinking the Value of Agent-Generated Tests for LLM-Based SWE Agents", arXiv:2602.07900 ([arXiv](https://arxiv.org/html/2602.07900v2)) | Adding generated tests to mini-SWE-agent gave **little or negative** benefit. Writing tests costs turns. **Treat reproduction tests as a paired ablation arm, gated by task type**: worth it where the oracle kind is "expects exception" or "wrong output with clear expected value", not for "implement new API" tasks | [W] |
| **PatchDiff (differential patch testing)** | Wang, Pradel, Liu, arXiv:2503.15223, ICSE 2026 ([arXiv](https://arxiv.org/abs/2503.15223)) | 29.6% of plausible patches behave differently from the developer patch, and passing tests overstate resolution by 6.4 pp. For BCF's **paper**, this is the method to quantify your oracle-asymmetry (P-1) probe on the 129 dev tasks | [W] |
| **UTBoost** | Yu et al., ACL 2025, arXiv:2506.09289 ([ACL](https://aclanthology.org/2025.acl-long.189/), [code](https://github.com/cuhk-shenzhen-se/utboost)) | 345 wrongly passing patches across Lite and Verified, caused by weak tests. Use its UTGenerator idea offline to label which dev tasks have **weak F2P tests**, where a wrong patch could still pass | [W] |
| **SWE-Bench+ (solution leakage, weak tests)** | Aleithan et al., arXiv:2410.06992 ([arXiv](https://arxiv.org/abs/2410.06992)) | 32.67% of successful SWE-agent patches came from solutions already stated in the issue text. **Directly relevant here:** this corpus's statements are PR bodies whose titles and descriptions often state the fix ("Fix X by Y"). Measure leakage on the dev set (Report 04 §3.2) and do not assume the private set has the same leakage rate | [W] |

### 2.4 Context management and long-horizon control (Leaks 1 and 4 in GLM's analysis)

| Item | Source | Takeaway for a 32k-token, quantized 31B model | Status |
|---|---|---|---|
| **"The Complexity Trap"** | Lindenbauer et al., arXiv:2508.21433, DL4C @ NeurIPS 2025 ([arXiv](https://arxiv.org/abs/2508.21433), [code](https://github.com/JetBrains-Research/the-complexity-trap)) | Masking old observations (keep only the latest tool output in full) matched LLM summarization while halving cost. **In ADK YAML you can't edit history directly.** You can get a similar effect by: (a) routing exploration through an `AgentTool` sub-agent with `skip_summarization` (the harness's own Gotcha #4); (b) keeping reads narrow (≤ 60 lines); (c) a "state packet" skill that prints a ≤ 30-line summary from `/tmp` after compaction | [W] |
| **ACON** | Kang et al., arXiv:2510.00615 ([arXiv](https://arxiv.org/abs/2510.00615), [code](https://github.com/microsoft/acon)) | Compression guidelines are *learned* from paired trajectories where the full context succeeds and the compressed one fails. 26–54% fewer peak tokens. The method fits BCF's paired-ablation culture: write compaction guidance into the system prompt, revised from failure pairs in your ledger | [W] |
| **Systems view: "Engineering Reliable Coding Agents"** | Jarmak, arXiv:2608.13867 ([arXiv](https://arxiv.org/abs/2608.13867)) | "Repair asymmetry": many apparent model failures sit in the harness, state or oracle layers. This independently supports GLM's "measurement before cleverness" thesis and is citable in the paper | [W] |

### 2.5 PATCH, selection and test-time scaling

| Item | Source | Takeaway | Status |
|---|---|---|---|
| **Trae Agent** | arXiv:2507.23370 ([arXiv](https://arxiv.org/abs/2507.23370), [code](https://github.com/bytedance/trae-agent), MIT) | A generation → pruning → selection ensemble with +10.2% Pass@1 on average over ensemble baselines. With ~6 min per task, only a **2-candidate** variant with deterministic pruning (applies cleanly, parses, reproduction test passes) is affordable. Keep it as a late-stage ablation | [W] |
| **Kimi-Dev** | arXiv:2509.23045 ([arXiv](https://arxiv.org/abs/2509.23045)) | Workflow ("agentless") training builds localization, edit and self-reflection priors that carry over to agent mode. If LoRA ever opens, train on **workflow-shaped** data built from the 129 dev tasks plus SWE-smith-style synthetic data, not raw agent trajectories | [W] |

### 2.6 Experiment statistics: making ±2.5-task noise affordable

| Item | Source | Takeaway | Status |
|---|---|---|---|
| **"Adding Error Bars to Evals"** | Miller (Anthropic), arXiv:2411.00640 ([arXiv](https://arxiv.org/pdf/2411.00640)); tooling [`errorbars`](https://github.com/antonsoo/errorbars) | Use paired per-task differences. Var(A−B) = Var A + Var B − 2Cov. Resample each task K times to shrink within-task variance. Power analysis tells you how many tasks × seeds a +2-task effect needs *before* you spend GPU hours | [W] |
| **CUPED / regression adjustment** | Deng, Xu, Kohavi, Walker, "Improving the Sensitivity of Online Controlled Experiments by Utilizing Pre-Experiment Data", WSDM 2013 | Use the static per-task difficulty prior (gold size, interface burden, BM25 rank; Report 04 §8) as a covariate. When the covariate correlates with resolution (expected r ≈ 0.3–0.5), the variance reduction is equivalent to running roughly 10–25% more tasks, at no cost | [K] |
| **Multiple comparisons** | Benjamini & Hochberg, *JRSS-B* 1995 | The ledger will run many paired A/Bs. Control the false discovery rate across the weekly "Monday queries" | [K] |

---

## 3. FOSS tools (new to the repo's lists)

| Tool | License | Kind | Use | Where | Caveat |
|---|---|---|---|---|---|
| **Docker Desktop + WSL2** (or a Linux box) | Docker Desktop: subscription terms for large orgs, free for personal use; WSL2: Microsoft | Platform | **Required for local `swegemma eval`.** This machine has neither Docker nor WSL installed (checked 2026-10-01). The harness's subprocess backend also assumes `/bin/bash` | Dev-time | Highest-priority setup item (Report 05) |
| `git` (already in the sandbox) | GPL-2.0 | VCS | Recency prior, `git log -S`, `git blame` on the target lines, `git log -p -- <file>` | In-sandbox | Snapshot SHAs are rewritten, so the task's `base_commit` cannot be looked up |
| `rank_bm25` (pattern) | Apache-2.0 | Retrieval | Vendor a minimal BM25 into `skills/bcf-localize/scripts/bm25.py` | In-sandbox | Allowed: `.py` only |
| Python stdlib `ast`, `tokenize`, `trace`, `sys.settrace` | PSF | Static/dynamic analysis | Async-aware mini call graph; Ochiai SBFL; enclosing-function lookup for any line | In-sandbox | 2 vCPU: cap the files analyzed |
| `parso` (+ optionally `jedi`) | MIT | Parser / IDE engine | Go-to-definition and find-references inside a skill | In-sandbox **if** it passes the extension whitelist | Jedi ships typeshed `.pyi` stubs, which the whitelist rejects. Test whether Jedi degrades gracefully without them. parso's grammar files are `.txt`, which is allowed |
| PyCG / pyan3 / Scalpel | Apache-2.0 / GPL-2.0 / Apache-2.0 | Call-graph generators | Dev-time reference graphs to compare against the provided `calls` graph | Dev-time | PyCG archived and broken on Python ≥ 3.12; none handle async |
| FauxPy | open-source (see repo) | SBFL/MBFL/stack-trace FL | Dev-time: during oracle runs on the 129 tasks, compute SBFL suspiciousness of the gold function, to give an upper bound on what in-sandbox SBFL could do | Dev-time | Needs coverage.py |
| coverage.py | Apache-2.0 | Coverage | Dev-time spectra; P2P "blast radius" analysis | Dev-time | Not in the wheelhouse |
| tree-sitter + `ast-grep` | MIT | Structural code search | Dev-time corpus mining (fix-pattern labelling across the 129 golds) | Dev-time | Native binaries |
| Semgrep CE | LGPL-2.1 | Pattern rules | Dev-time detection of "solution-leak phrasing" and risky patch shapes | Dev-time | — |
| DuckDB | MIT | Embedded SQL over JSONL/Parquet | Run the "Monday queries" over the ledger JSONL in one SQL file each | Dev-time | Lightweight alternative to Langfuse |
| statsmodels | BSD-3 | Statistics | Exact McNemar, regression adjustment, logistic models of P(resolve \| features) | Dev-time | — |
| junitparser | Apache-2.0 | Parser | Parse `test_outputs/*.xml` into per-test vectors (skipped counts as failed) | Dev-time | — |
| Inspect AI (UK AISI) | MIT | Eval framework | Optional: log viewer and reproducible eval runs if you mirror `swegemma` tasks | Dev-time | Not needed for v1 |
| JetBrains `the-complexity-trap` | (see repo) | Reference implementation | Observation-masking baselines | Dev-time | — |
| SweRank, CodeRankEmbed, nomic-embed-code | (see repos) | Retrieval models | Offline localization ceilings; re-embedding study for the paper | Dev-time (GPU) | 5090 is enough |

---

## 4. Whitepapers: one-line value and reading order

Read in this order. The items marked ★ change a decision in Report 05.

| # | Paper | Venue / ID | Why read it | Status |
|---:|---|---|---|---|
| 1 ★ | The Complexity Trap | arXiv:2508.21433 | Context policy for the 32k window | [W] |
| 2 ★ | SWE-Bench+ | arXiv:2410.06992 | Solution leakage; weak tests; how to measure both | [W] |
| 3 ★ | Are "Solved Issues" in SWE-bench Really Solved Correctly? (PatchDiff) | arXiv:2503.15223, ICSE 2026 | Oracle asymmetry in the paper; differential testing | [W] |
| 4 ★ | Otter / e-Otter++ | arXiv:2502.05368; 2508.06365 | Reproduction-test design | [W] |
| 5 ★ | Rethinking the Value of Agent-Generated Tests | arXiv:2602.07900 | Why reproduction tests must be ablated | [W] |
| 6 | ODC | IEEE TSE 1992, DOI 10.1109/32.177364 | Taxonomy theory for BCF classes | [W] |
| 7 | Bug-fix patterns (Pan, Kim, Whitehead) | EMSE 2009 | Mineable fix-shape vocabulary | [K] |
| 8 | PyTER | ESEC/FSE 2022 | Exception-class-conditioned repair, done honestly | [W] |
| 9 | FixCache | ICSE 2007 | History-based localization prior | [K] |
| 10 | FauxPy + Python FL empirical study | arXiv:2404.18596; 2305.19834 | What SBFL achieves on Python | [W] |
| 11 | SweRank (+ SweRank+) | arXiv:2505.07849; 2512.20482 | State-of-the-art localization ranking | [W] |
| 12 | CoRNStack | arXiv:2412.01007, ICLR 2025 | Code retriever training data | [W] |
| 13 | UTBoost | ACL 2025, arXiv:2506.09289 | Weak-test detection | [W] |
| 14 | ACON | arXiv:2510.00615 | Learned compression guidelines | [W] |
| 15 | Trae Agent | arXiv:2507.23370 | Generate/prune/select ensembles | [W] |
| 16 | Kimi-Dev | arXiv:2509.23045 | Workflow → agent skill priors (LoRA) | [W] |
| 17 | Adding Error Bars to Evals | arXiv:2411.00640 | Paired statistics, power analysis | [W] |
| 18 | CUPED | WSDM 2013 | Variance reduction with covariates | [K] |
| 19 | Engineering Reliable Coding Agents | arXiv:2608.13867 | Systems-level failure attribution | [W] |
| 20 | All-but-the-Top; Whitening; Representation Degeneration | ICLR 2018; 2021; ICLR 2019 | Fixing anisotropic embeddings (paper track) | [K] |

---

## 5. Books (new to the repo's lists, or only mentioned in passing before)

| Book | Author(s) / year | Chapters that matter | BCF link | Status |
|---|---|---|---|---|
| **The Debugging Book** (free online, executable Python) | A. Zeller et al., debuggingbook.org | Statistical debugging, delta debugging, dynamic slicing, repairing code, tracking failure origins | Ready-made **Python** implementations of SBFL, slicing and automated repair to adapt into skills | [K] |
| **Debugging: The 9 Indispensable Rules** | D. Agans, 2002 | "Make it fail", "Quit thinking and look", "Change one thing at a time", "**Keep an audit trail**" | Maps one-to-one onto BCF's tenets (breadcrumbs = audit trail). Good framing for the whitepaper's introduction (mentioned once before, never used) | [K] |
| **Effective Debugging: 66 Specific Ways** | D. Spinellis, 2016 | Hypothesis-driven debugging, differential debugging, using version control to find regressions | `git log`/`bisect` thinking for the history affordance | [K] |
| **Trustworthy Online Controlled Experiments** | Kohavi, Tang, Xu, 2020 | Variance reduction (CUPED), sample-ratio checks, the "Twyman's law" mindset | Experiment protocol for ±2.5-task noise | [K] |
| **Statistical Rethinking** (2nd ed.) | R. McElreath, 2020 | Beta-binomial models, partial pooling across repos | Pool per-repo resolution rates without overfitting the 1-task httpx stratum | [K] |
| **Python Concurrency with asyncio** | M. Fowler, Manning 2022 | Coroutines, event loops, async context managers | Skill-resource knowledge for the async gap: FastAPI fixes that touch `async def` code the graph does not show | [K] |
| **Fluent Python** (2nd ed.) | L. Ramalho, 2022 | Data model, descriptors, typing, asyncio | Background for Rich/FastAPI-style dunder and protocol fixes | [K] |

---

## 6. How each item extends the data analysis already done

| Existing analysis (GLM / MiniMax / Report 04) | Extension enabled by the research above | Effort |
|---|---|---|
| Static census: statement length, tracebacks, hints | **Solution-leak labelling** (SWE-Bench+ method): does the title or body state the fix? Compare dev-set leakage with what a private-repo set may have | 0.5 day |
| Gold-patch shape (files / lines) | **Fix-pattern mining** (Pan et al. patterns, via `ast` diff) → per-task `fix_shape` labels. This gives the prior for BCF's SPECIFY | 1 day |
| Async-hole census (GLM) | **Async-aware mini call graph** (stdlib `ast`), so you can measure how many gold functions become reachable from statement symbols with async edges added | 1 day |
| Embedding degeneracy (MiniMax) | **Mean-centering and whitening** re-ranking; CodeRankEmbed re-embedding; gold-node retrieval rank under each (Report 04 §6 has the centered baseline) | 1 day |
| Localization (both agents: proposed, not measured) | **BM25 + recency prior + SBFL ceiling** measured per task (Report 04 §5); SweRank as the offline ceiling | 1–2 days |
| P-1 oracle-asymmetry probe (GLM) | **PatchDiff / UTBoost**-style differential testing on the dev set once Docker oracle runs work | 3–4 days |
| Paired ablation protocol (both) | **Error-bar power analysis + CUPED covariates** from Report 04's difficulty prior | 0.5 day |
| Context overflow leak (GLM, from forum) | **Observation-masking-like policy** + ACON-style guideline revision from paired failures | 1 day prompt work + ablation |

---

## Sources (web-verified 2026-10-01)

- [The Complexity Trap, arXiv:2508.21433](https://arxiv.org/abs/2508.21433) · [code](https://github.com/JetBrains-Research/the-complexity-trap)
- [Otter, arXiv:2502.05368](https://arxiv.org/pdf/2502.05368) · [e-Otter++, arXiv:2508.06365](https://arxiv.org/html/2508.06365) · [SWE-Tester, arXiv:2601.13713](https://arxiv.org/pdf/2601.13713) · [SWE-Doctor, arXiv:2607.00990](https://arxiv.org/pdf/2607.00990) · [Rethinking agent-generated tests, arXiv:2602.07900](https://arxiv.org/html/2602.07900v2)
- [SweRank, arXiv:2505.07849](https://arxiv.org/abs/2505.07849) · [SweRank+, arXiv:2512.20482](https://arxiv.org/pdf/2512.20482)
- [SWE-Bench+, arXiv:2410.06992](https://arxiv.org/abs/2410.06992)
- [PyCG GitHub](https://github.com/vitsalis/PyCG) · [PyCG ICSE 2021 (dblp)](https://dblp.org/rec/conf/icse/SalisSLSM21.html) · [pycg-ml fork](https://github.com/smirnoffmg/pycg-ml) · [CPyGraph](https://github.com/awen-li/CPyGraph)
- [Kimi-Dev, arXiv:2509.23045](https://arxiv.org/abs/2509.23045)
- [PyTER (FSE 2022)](https://2022.esec-fse.org/details/fse-2022-research-papers/52/PyTER-Effective-Program-Repair-for-Python-Type-Errors) · [PDF](https://prl.korea.ac.kr/papers/fse22.pdf)
- [Adding Error Bars to Evals, arXiv:2411.00640](https://arxiv.org/pdf/2411.00640) · [errorbars package](https://github.com/antonsoo/errorbars)
- [PatchDiff, arXiv:2503.15223](https://arxiv.org/abs/2503.15223)
- [FauxPy, arXiv:2404.18596](https://arxiv.org/pdf/2404.18596) · [Python FL study, arXiv:2305.19834](https://arxiv.org/pdf/2305.19834) · [replication](https://github.com/atom-sw/fauxpy-experiments)
- [ACON, arXiv:2510.00615](https://arxiv.org/abs/2510.00615) · [code](https://github.com/microsoft/acon)
- [CoRNStack, arXiv:2412.01007](https://arxiv.org/pdf/2412.01007) · [nomic-embed-code](https://huggingface.co/nomic-ai/nomic-embed-code)
- [Trae Agent, arXiv:2507.23370](https://arxiv.org/abs/2507.23370) · [code](https://github.com/bytedance/trae-agent)
- [Engineering Reliable Coding Agents, arXiv:2608.13867](https://arxiv.org/abs/2608.13867)
- [ODC (ADS record)](https://ui.adsabs.harvard.edu/abs/1992ITSEn..18..943C/abstract) · [ODC overview](https://en.wikipedia.org/wiki/Orthogonal_defect_classification)
- [UTBoost, ACL 2025](https://aclanthology.org/2025.acl-long.189/) · [code](https://github.com/cuhk-shenzhen-se/utboost)


---

<!-- ====================================================================== -->
<!-- FILE: 03_Insights_from_Agent_Data_Analyses.md -->
<!-- ====================================================================== -->

# 03 — Noteworthy Insights from the Data Analysis Done by GLM-5.3 and MiniMax-M3

*Prepared 2026-10-01 by Claude Opus 5.5. This report pulls together what can be learned from the two agents' **executed** data work: GLM's `2026-10-01-bcf-metadata-collection/` (tools 00–18, `data/`) and MiniMax's `bcf-metadata-collection-2026-10-01/` (scripts in `scratch/`, reports 08–09). I re-checked each insight against my own independent extraction (Report 04).*

**Verification status labels**

| Label | Meaning |
|---|---|
| ✅ | Confirmed |
| 🟡 | Confirmed with a correction or a nuance |
| ❌ | Refuted |
| ⚪ | Not checkable offline (forum or runtime facts) |

---

## 1. The ten insights that matter most (after verification)

| # | Insight | Origin | Status | What it means for BCF |
|---:|---|---|:---:|---|
| 1 | **The problem statements are prose PR descriptions, not bug reports with tracebacks.** 0/129 start with a traceback, and none contain `Traceback (most recent call last)`. They are PR titles with emoji or conventional-commit prefixes (🐛, ✨, ♻️, 📝), often followed by template boilerplate | GLM (finding 1, features) | ✅ | CLASSIFY cannot be driven by exception parsing of the statement. BCF's exception-class conditioning must come from **a reproduction run** (Report 04 §3.4) |
| 2 | **`hints_text` is empty for all 129 tasks** | Both | ✅ | Prompts must not rely on `{hints}`. Keep the template robust when the field is absent |
| 3 | **The async gap is structural**: 0 first-class async nodes among 370,683; async code exists only *inside* the text of enclosing sync/class nodes | GLM (graph-deep) | ✅ | Graph tools are blind to async call chains. **20/129 gold patches edit inside an `async def`** (19 FastAPI). Dual-path localization (graph + AST/grep) is required |
| 4 | **Gold patches are small and mostly single-file**: 91/129 single-file; median 1 file, +8/−2 lines (12 changed lines); 43% are one file with ≤ 5 added lines | Both | ✅ | Minimum-edit discipline is correct for most tasks. The tail is long (max 26 files / 12,714 lines), so cap and escalate |
| 5 | **Graph nodes carry no file path**; node ids are dotted module paths. Prefixes like `docs_src.` may be stripped, and `src/` layouts collapse | MiniMax (F4), GLM (join rules) | ✅ | A deterministic id→file mapper (try suffixes of the dotted path) is needed in any skill that combines graph tools with `read_file` |
| 6 | **The embeddings are strongly anisotropic**: nearly every node has a > 0.99 cosine neighbour | MiniMax (F2/F3), probe report | 🟡 | Real, but MiniMax over-read it as "useless". Mean pairwise cosine is 0.79 raw → **0.09 after centering**. For rich, requests and httpx, **0** of the > 0.99 pairs are identical text (geometric anisotropy). For FastAPI, **33%** are literal `docs_src` tutorial duplicates. When the statement names a symbol that resolves to a node other than the gold node, the gold node still ranks in the **top 4.5%** (median). Weak but non-zero locality signal |
| 7 | **Test dependencies missing from the public wheelhouse** (`inline_snapshot`, `dirty_equals`) | GLM (testdeps) | 🟡 | Undercounted. GLM scanned only lines added by the test patch (14 tasks). Scanning the whole post-patch test files gives **29 tasks** (`inline_snapshot` 22, `dirty_equals` 9, plus `importlib_metadata`, `attr`). These are **local-CV** dead tasks only: the host says gold validates 100% on the scorer ⚪ |
| 8 | **The sample `eval_config.yaml` self-throttles** (60 s / 10 calls / 1 min / 50 turns) | GLM (harness-static, C8), MiniMax | 🟡 | GLM read this correctly ("un-throttle first"). MiniMax read it as the competition's evaluation constraint and designed a 3–6-call agent around it ❌ |
| 9 | **Two task pairs share a base commit** (rich_3882/3894, requests_6589/6629) → 127 graph and embedding payloads for 129 tasks; the ZIP has **no** 0-byte files | GLM (census), MiniMax (graph probe) | ✅ | Graph and embedding joins must use `(repo_short, base_commit)`. The forum's "0-byte files" come from download tooling, not the data ⚪ |
| 10 | **The sample LoRA adapters are stubs**: r = 4, α = 8, `q_proj`+`o_proj`, `layers_to_transform = [0]`, ~217 KB | GLM, MiniMax | ✅ | They only check that adapter loading works. Never read anything about capability from them. The LoRA track stays gated on the platform KV-cache fix ⚪ |

---

## 2. Insights that turned out wrong (and the corrected fact)

| Claimed insight | Origin | Corrected fact (Report 04) | Why it matters |
|---|---|---|---|
| "Snapshots are history-less single-commit exports; `git log`/`blame` impossible" | GLM finding 5 / ROADMAP C4 | Snapshots keep the **full upstream history with rewritten SHAs**: fastapi ≈ 6,000–7,350 commits, rich ≈ 3,800–4,450, requests ≈ 6,200–6,475, httpx 4. HEAD always predates `created_at` (median 4.9 h earlier), so there are no future commits | Restores a free localization signal. The gold file was changed within the last 20 commits in 59/122 tasks with a pre-existing gold `.py` file |
| "Patches use bare `+` empty lines; 9/129 malformed even for GNU patch" | MiniMax 09 / 10-F6 | The dataset `.strip()`-ed all 258 patch strings (missing final newline and blank context line). With the tail restored, **129/129 + 129/129 apply with `git apply --check`** | Local CV tooling must normalize patch tails, or it will report false "corrupt patch" failures |
| "38% multi-bug (F2P ≥ 2); requests 12/13 have F2P = 0" | MiniMax 08 | The regex missed class-method tests. AST count: requests target files hold a median of **224** tests; 25 tasks add no new test function (19 only modify existing tests). The number of tests also measures the *test*, not the number of bugs | Use `tests_in_target_files` (P2P blast radius) and `tests_added/modified`. Drop "multi-bug" as a label derived from test counts |
| "All tasks have a graph → no fallback needed" | MiniMax 08 | Fix sites missing from the graph: 20 tasks are async; 54 tasks include module-level edits (imports, constants) that have no node; 15 tasks have gold hunks that map to no node; 11 tasks create new files | The graph exists but often does not cover the fix site |
| "U4 unknowable until Dec 2" | MiniMax 07 | The harness prompt contains the "Code Intelligence Tools" section **iff** graph and embedding files exist | Turn-0 observable. The agent can switch strategy immediately |
| "Graphs: no containment edges" | GLM 01 | `calls` edges include class→method containment (median 8.8% of edges) | Hop-distance metrics (λ) partly measure containment, not calls |

---

## 3. Insights that only emerge when both analyses are combined

1. **Statement + graph combined: localization hinges on how symbols get named.** GLM showed statements are short prose (median 418 characters), and MiniMax showed `search_similar_code` needs a symbol name, not prose. My measurement: statement identifiers resolve strongly (exact, suffix or case-insensitive) to graph nodes in **52/129** tasks. In **29/129** the statement directly names a gold-enclosing node. For the other ~77 tasks the graph tools have **no reliable entry point**. **Implication:** the first localization call should be lexical (BM25 / `grep -rn`, or `git log` recency), with graph tools used for *expansion* once a symbol is in hand. GLM already argued for dual-path; the combined evidence says **lexical-first**.

2. **Gold shape + test oracle combined: "small fix, big blast radius".** Both agents found median gold patches of ~1 file and ~10 lines. Neither noticed that the scorer runs **all** tests in the target files: median 11 tests, ≥ 50 in 33 tasks, median 224 for requests. A one-line fix that breaks a sibling test in the same module scores 0. **Implication:** the agent's VERIFY step must run the **entire** target test module (cheap: seconds), not just a hand-picked test.

3. **Missing deps + 100% gold validity combined: local CV is a biased proxy.** GLM's dependency gap (now 29 tasks) together with the forum's host statement (100% gold-valid on the scorer ⚪) means local CV systematically **under**-scores fastapi snapshot-style tasks. That is one concrete, fixable cause of the CV↔LB disconnect GLM documented. **Implication:** add `inline-snapshot`, `dirty-equals`, `pytest-httpbin` and `typing-inspection` wheels to the *local* image, rather than quarantining 29 tasks (22% of the dev set).

4. **Taxonomy v0 + fix-shape combined: BCF's class grid should be two-dimensional.** GLM's emoji-prefix taxonomy (bug/feature/refactor…) and MiniMax's four size tiers describe different axes. My fix-shape labels (small_replace 34, guard_add 10, logic_rewrite 42, rewrite_plus_new_code 35, …) only moderately track title class. "Bug" titles split almost evenly between small_replace (26) and logic_rewrite (24); "feature" titles skew to rewrite_plus_new_code (9 of 18). **Implication:** a `symptom × fix_shape` grid (Report 02 §2.1: ODC + Pan patterns) is better grounded than a single exception-class axis.

5. **Embeddings + `docs_src` duplication combined: FastAPI's retrieval is polluted twice.** Test nodes are a median **61.5%** of all graph nodes (fastapi 63.6%), and FastAPI graphs are ~68% isolated nodes (mostly `docs_src` tutorial variants, a third of them textually duplicated). **Implication:** filter results to non-test, non-`docs_src` nodes. Gold patches touch `docs_src` in only 15 tasks, and only alongside library code.

---

## 4. Quality notes on the agents' analysis code

| Aspect | GLM-5.3 tools | MiniMax-M3 scripts |
|---|---|---|
| Reads directly from ZIP, idempotent | ✅ | ✅ |
| stdlib-only | ✅ | ✅ (hand-rolled YAML parser, which the agent itself flags as a hack) |
| Bugs found and fixed during the run, then documented | n/a | ✅ (`has_graph()` extension; diff header regex) — good transparency |
| Remaining correctness issues | Snapshot-verify heuristic (base SHA presence ≠ history); added-lines-only import scan | Patch-tail misdiagnosis; non-indented `def test_` regex; F2P→multi-bug inference |
| Reproducibility doc | Strong (README "how to run", dataset card) | Moderate (reports, scattered scripts) |
| Separation of runtime-observable vs scorer-only fields | Implicit (anti-wishlist) | Stated in principle; violated in the v1 design |

---

## 5. What to carry forward (and what to drop)

**Carry forward:**

- GLM's dataset card and join rules.
- The async census.
- The taxonomy v0 prior.
- The difficulty-tercile idea.
- MiniMax's per-task static record schema.
- MiniMax's pre-submit gates idea: AST/`py_compile` + apply-check + no-test-files.

**Drop or replace:**

| Drop | Replace with |
|---|---|
| The "no history" constraint | git-based recency and context tools |
| The 0-byte repair task | nothing (it is not a data problem) |
| MiniMax's patch-malformation rule | patch-tail normalization in local tooling |
| The 10-call budget assumption | a real budget derived from the 12-hour envelope |
| The F2P-derived turn-0 router | turn-0-observable triage (Report 04 §9) |
| The "multi-bug" label | `tests_in_target_files` + `tests_added` |


---

<!-- ====================================================================== -->
<!-- FILE: 04_Opus_Metadata_Wishlist_and_Static_Analysis_Report.md -->
<!-- ====================================================================== -->

# 04 — Independent Metadata Wishlist and Exhaustive Static Analysis of the Training Package

*Prepared 2026-10-01 by Claude Opus 5.5, working as software architect, data scientist and ML engineer. This was built independently from the GLM/MiniMax work: my own wishlist, my own extraction scripts, and a direct read of the 21.9 GB competition ZIP. Every number here can be regenerated with `analysis/scripts/s01…s04` (≈ 12 minutes on the main PC, stdlib + numpy only). The per-task table is in [04a_Appendix_Per_Task_Metadata.md](04a_Appendix_Per_Task_Metadata.md); the full ~70-column table is `analysis/out/task_metadata_master.csv`.*

---

## 0. Executive summary: the 15 facts that should shape the first submission

| # | Finding | Number | Implication |
|---:|---|---|---|
| 1 | Statements are **PR descriptions** (titles with emoji or verbs; often template boilerplate) | 34/129 title-only; 31/129 contain PR templates; median *effective* text 268 chars (rich: **61**) | Most tasks are under-specified. The agent must recover intent from code and tests, not from prose |
| 2 | **Exceptions rarely appear in the statement** | Only 15/129 name an exception class; 0 contain a full traceback | BCF exception classes must come from a **reproduction run**, not from statement parsing |
| 3 | **Statement→file BM25 is a strong localizer** | Gold file is #1 in **59/129**, top-3 in 83, top-5 in **99**, top-10 in 106 (fastapi median 739 candidate files) | Make the first localization step **lexical**, ideally as a vendored BM25 skill or a `grep` routine |
| 4 | **Git history is present** (GLM wrongly said absent) | fastapi ≈ 6.4k commits, rich ≈ 4.1k, requests ≈ 6.4k; HEAD always before PR creation | `git log --name-only -n 50` is a free recency prior. Union with BM25 gives top-5 in **105/129** |
| 5 | **Graph tools have no entry point for most tasks** | Statement identifiers resolve strongly to graph nodes in 52/129; the statement names a gold node in 29/129 | Graph = expansion tool, used *after* a symbol is found, not a first step |
| 6 | **Graph is dominated by tests and isolated nodes** | Median 61.5% of nodes are test code; fastapi graphs ≈ 68% isolated nodes | Filter graph and embedding results to non-test library nodes |
| 7 | **Async gap affects real fixes** | 20/129 gold patches edit inside `async def` (19 fastapi) | Needs a stdlib-AST fallback for async code |
| 8 | **Embeddings are anisotropic, not useless** | Mean pairwise cosine 0.79 → 0.09 after centering; non-trivial gold retrieval median = top 4.5% | `search_similar_code` gives weak locality hints. Never rely on it alone |
| 9 | **Scoring needs every test in the target files to pass** | Median 11 tests per target file set; ≥ 50 in 33 tasks; requests median 224 | VERIFY must run the **whole** target test module(s) before submitting |
| 10 | **Some tasks require inventing exactly-named APIs** | 9/129 tests import repo symbols or modules that don't exist at base; 40/129 gold patches add new defs | Detect `ImportError`/`AttributeError` in the reproduction and switch to an "API-design" mode, keeping names consistent with the statement and docs |
| 11 | **Fixes are deep in big files** | Gold edit starts beyond line 150 in 51/129; 65/129 gold files exceed 1,000 lines | Always `grep -n` before `read_file` (150-line cap) |
| 12 | **The initial workspace listing is truncated** | > 150 entries at depth ≤ 3 in 115/129 | The prompt listing can't be trusted to show the target file |
| 13 | **The dataset's patch strings lost their trailing newline** | 258/258 stripped; 129/129 + 129/129 apply after the tail fix | Local CV tooling must re-append `\n` (and the trailing blank context line) |
| 14 | **Local CV environment gap** | 29/129 tasks import packages missing from the public wheelhouse (`inline_snapshot` 22, `dirty_equals` 9) | Add these wheels to the *local* image instead of quarantining 22% of the dev set |
| 15 | **Gold fixes are small but long-tailed** | Median 1 file / 12 changed lines; p90 4 files / 127 lines; max 26 files / 12,714 lines | Minimum-edit default with an escalation path; cap effort on the extreme tail |

---

## 1. My metadata wishlist (designed independently)

**Design principles**

1. Every field is tagged with **when it is observable**:
   - **S** — static, computable now from the training package
   - **T0** — observable by the agent at turn 0 on a *hidden* task
   - **R** — runtime, per call
   - **P** — post-hoc / scorer-only
   - **E** — environment, per run
2. Every field feeds a named BCF decision.
3. Fields observable at T0 or R are the ones an agent can *act on* on the hidden set. Fields tagged S or P are for **calibration and research only**, and must never be used as agent inputs (this avoids MiniMax's leakage error).
4. Agent-side telemetry is emitted as tool-call stdout lines with a `BCF_EVT` prefix, so it survives into the ATIF trace. `/tmp` does not survive Container A teardown.

**Status column**

| Status | Meaning |
|---|---|
| ✅ | Extracted in this report |
| 🔜 | Needs local harness runs (Docker/WSL2) |
| 📈 | Needs Kaggle submissions |

### 1.1 Task statement (feeds CLASSIFY, triage, budget)

| Field | Obs. | Decision | Status |
|---|:---:|---|:---:|
| `title_class` (emoji / conventional / leading verb) | T0 | Path choice: bug vs feature vs refactor | ✅ |
| `stmt_eff_chars` (after stripping HTML comments, checklists, template headers, URLs) | T0 | Low-information triage | ✅ |
| `title_only`, `has_pr_template`, `boilerplate_share` | T0 | Same | ✅ |
| `exc_in_statement` | T0 | Whether exception-class conditioning applies | ✅ |
| `identifiers` (backticks, dotted, calls, CamelCase, snake_case) + `n_strong_resolved` in graph | T0 | Graph entry point available? | ✅ |
| `mentions_gold_file`, `mentions_gold_symbol` (solution leakage) | S | CV↔LB shift estimate | ✅ |
| `solution_phrased_title` (Fix/Add/Handle…) | T0 | Leakage proxy on hidden tasks | ✅ (via title verb) |

### 1.2 Gold patch (calibration only: S)

| Field | Decision informed (as a prior) | Status |
|---|---|:---:|
| `gold_files`, `gold_added/removed`, `gold_hunks`, `gold_new_files` | Edit-size caps, escalation thresholds | ✅ |
| `fix_shape` (small_replace, guard_add, insert_only, delete, logic_rewrite, rewrite_plus_new_code, new_code, new_module) | SPECIFY `fix_shape` prior | ✅ |
| `gold_enclosing` (AST innermost def/class for every hunk), `gold_enclosing_async`, module-level edits | Graph coverage of fix sites | ✅ |
| `gold_max_file_lines`, `gold_first_line`, read windows | Navigation policy (grep before read) | ✅ |
| `gold_new_symbols` | API-creation frequency | ✅ |
| `gold_raise/except added/removed` | Exception-signature prior | ✅ |
| `gold_git_apply_ok` | Local tooling sanity | ✅ |

### 1.3 Test oracle (S for structure; P for outcomes)

| Field | Obs. | Decision | Status |
|---|:---:|---|:---:|
| `test_files`, `test_new_files` | S | Which test module the agent should run or create | ✅ |
| `tests_in_target_files` (AST count after `test_patch`) = **P2P blast radius** | S (count at base is T0-observable if the agent guesses the module) | VERIFY scope | ✅ |
| `tests_added`, `tests_modified` | S | Oracle-kind prior | ✅ |
| `oracle_kind` (expects_exception / expects_warning / snapshot_equality / assert_behaviour) | S | Reproduction-test template | ✅ |
| `interface_burden` (test imports of repo symbols/modules missing at base) | S; T0-detectable via a failing import in a reproduction | API-design mode | ✅ |
| `third_party_missing` (full-file imports vs wheelhouse) | S/E | Local CV quarantine / image fix | ✅ |
| `f2p_pass/fail vector`, `skipped` | P | Ablation attribution | 🔜 |

### 1.4 Repository and environment

| Field | Obs. | Decision | Status |
|---|:---:|---|:---:|
| `git_commits`, `head_gap_hours`, `base_commit_present` | T0 | Whether history tools are usable | ✅ |
| `recency_rank` of the gold file (`git log --name-only`) | T0 (agent computes) | Localization prior | ✅ |
| `repo_py_files`, `repo_py_loc`, `layout_entries_d3` (prompt truncation) | T0 | Exploration budget | ✅ |
| `requires_python` | T0 | Python-version pitfalls (3.13 sandbox) | ✅ |
| `prompt_has_graph_section` | T0 | Graph tools on/off | 🔜 (always true on dev; check on hidden via probe) |
| Container setup seconds, test runtime per target module | E/R | Budget allocator | 🔜 |

### 1.5 Graph and embeddings

| Field | Obs. | Decision | Status |
|---|:---:|---|:---:|
| `graph_nodes`, `test_node_share`, `isolated_share`, `containment_share` | S/T0 | Filtering policy | ✅ |
| `gold_nodes` (mapped), `gold_unmapped`, `gold_module_level_edits` | S | Graph coverage of fix sites | ✅ |
| `gold_min_hops` from strongly resolved statement nodes | S | λ (distance-decay) for the paper; expansion depth | ✅ |
| `bm25_node_rank` | S | Node-level lexical localization bar | ✅ |
| `emb_rank_raw`, `emb_rank_centered`, mean pair cosine | S | Value of `search_similar_code` | ✅ |

### 1.6 Localization baselines (S; these set the bar)

| Field | Status |
|---|:---:|
| `bm25_file_rank` (full statement), `bm25_title_rank`, `bm25_path_rank` | ✅ |
| `recency_rank`, `recency_commit_idx` | ✅ |
| Union of BM25 and recency top-k | ✅ |

### 1.7 Runtime ledger (R/P/E — adopt GLM P0 + MiniMax M3/M4, plus these)

| Field | Obs. | Decision | Status |
|---|:---:|---|:---:|
| `termination_cause` (GLM's 10-value enum) | P | Leak census | 🔜 |
| `first_localization_hit_turn` (turn when a gold file is first opened) | P | Localization efficiency | 🔜 |
| `ran_full_target_module` (bool) | R | Blast-radius discipline | 🔜 |
| `repro_test_written`, `repro_failed_at_base`, `repro_exception_class` | R | **The BCF exception class, measured** | 🔜 |
| `api_mode_triggered` | R | Interface-burden handling | 🔜 |
| `edit_match_tier` (exact/flexible/regex/fail) | R | Edit integrity | 🔜 |
| `wasted_call` (empty or duplicate result hash) | R | Rescue trigger | 🔜 |
| CV↔LB pair per submission | 📈 | Calibration | 📈 |

---

## 2. Pipeline and reproducibility

| Script | Input | Output | Runtime |
|---|---|---|---|
| `s01_task_text_features.py` | `tasks.jsonl` | `task_text_features.jsonl` | < 5 s |
| `s02_snapshot_scan.py` | streams 129 `snapshots/*.tgz` out of the ZIP; extracts `.git` temporarily; applies patches in scratch dirs | `snapshot_features.jsonl`, `cache/inventory/*.json` | ≈ 9 min |
| `s03_graph_embedding.py` | 127 graphs + 127 npz | `graph_features.jsonl`, `graph_commit_stats.jsonl` | ≈ 2 min |
| `s04_aggregate.py` | all of the above | `task_metadata_master.{csv,jsonl}`, `stats.json` | < 5 s |

Run from `analysis/scripts/` with `PYTHONIOENCODING=utf-8 python s0N_*.py`.

**Environment used:** Windows 11, Python 3.13, numpy 2.5, git 2.55, GNU patch 2.7.6. No Docker or WSL is installed (checked), so no test was *executed*.

**Heuristic caveats** (also listed in §11): exception regexes, fix-shape rules, identifier extraction, and the "interface burden" check are static heuristics.

---

## 3. Corpus and problem-statement anatomy

### 3.1 Composition

| Repo | Tasks | Years | Median .py files | Median py LOC | Median BM25 candidate (non-test) files |
|---|---:|---|---:|---:|---:|
| fastapi | 67 | 2025: 41, 2026: 26 | 1,191 | 104,783 | 739 |
| rich | 48 | 2023: 9, 2024: 17, 2025: 6, 2026: 16 | 190 | 39,497 | 124 |
| requests | 13 | 2023: 1, 2024: 4, 2026: 8 | 36 | 11,206 | 21 |
| httpx | 1 | 2025 | 45 | 9,315 | 32 |

76% of tasks are from 2025–26. The hidden set is from **private** repositories, so no memorization and no repo-specific priors carry over. Recency matters less for contamination there than for the *style* of statements.

### 3.2 What the agent actually reads

| Metric | Value |
|---|---|
| Raw statement chars (min / p25 / median / p75 / p90 / max) | 42 / 146 / 418 / 1,000 / 1,801 / 10,095 |
| **Effective** chars after removing HTML comments, checklists, template headers, URLs | 17 / 111 / **268** / 631 / 1,331 / 9,042 |
| Effective text < 100 chars | **31/129** |
| Boilerplate share > 50% | 36/129 |
| Title-only statements (body adds < 20 effective chars) | **34/129** (rich 21, fastapi 12, requests 1) |
| PR-template markers present | 31/129 |
| AI-disclaimer / AI-authored PR mentioned | 7/129 |
| Code block present | 18/129 |
| Full traceback present | **0/129** |
| Statement names an exception class | **15/129** |
| Statement names a gold-enclosing function/class | **35/129** |
| Statement names a gold file (basename, path or module) | 14/129 |
| Title starts with "fix" (after stripping emoji) | 56/129 |

**Reading.** These are PR titles and descriptions written *by the people who fixed the bug*, so they are often **solution-phrased** ("Fix X when Y", "Handle empty Z"). That is a mild form of the solution leakage SWE-Bench+ documented. It helps on the dev set (BM25 rank 1 in 25/35 tasks where the gold symbol is named, versus 34/94 where it is not). Whether the private-repo set was written the same way is the **largest unmeasured source of CV→LB shift**. Treat dev-set localization numbers as optimistic.

### 3.3 Title class (deterministic v0) × fix shape (gold)

| Title class | small_replace | guard_add | insert_only | delete | logic_rewrite | rewrite_plus_new_code | new_code | new_module |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| bug (70) | 26 | 3 | 2 | 1 | 24 | 13 | 1 | 0 |
| feature (18) | 3 | 5 | 0 | 0 | 1 | 9 | 0 | 0 |
| unlabeled (21) | 3 | 2 | 1 | 0 | 10 | 4 | 1 | 0 |
| other (20: refactor 7, docs 3, deps 2, ux 2, change 2, …) | 2 | 0 | 1 | 0 | 7 | 9 | 0 | 1 |

Fix-shape totals: logic_rewrite 42, rewrite_plus_new_code 35, small_replace 34, guard_add 10, insert_only 4, new_code 2, new_module 1, delete 1.

**Reading.** "Bug" titles are bimodal: a one-line replacement *or* a logic rewrite. "Feature" titles mostly add code. A BCF `fix_shape` prior keyed on title class is informative but not decisive.

### 3.4 The BCF exception-class question, measured

| Signal | Tasks |
|---|---:|
| Exception class named in the statement | 15 |
| Gold patch adds/removes `raise X` or `except X` | (part of signature) |
| Any exception signature (statement ∪ gold raise/except ∪ added `pytest.raises`) | 33 |
| Test oracle kind = expects_exception (added `pytest.raises`) | 10 (all fastapi) |
| expects_warning (`pytest.warns`) | 2 |
| snapshot_equality (`inline_snapshot`) | 12 |
| assert_behaviour (plain asserts on output/state) | **105** |
| Target test files that use `pytest.raises` anywhere | 55 |
| Most frequent signature classes | ValueError 7, AssertionError 6, FastAPIError 4, HTTPException 3, TypeError 3, NameError 3, RuntimeError 3 |

**Reading.** BCF's claim is that classifying errors into exception classes "limits the search space to the most probable root causes". That needs an exception to exist **at the moment of classification**. On this corpus the *statement* supplies one in ~12% of tasks, and **81%** of oracles are behavioural assertions. The defensible version of the thesis is:

> *Run a minimal reproduction first; the observed failure (ImportError / AttributeError → missing interface; `pytest.raises` not triggered → missing guard; wrong value → logic; unexpected exception class → crash path) is the class. Condition localization on it.*

That makes ρ = I(R;C)/H(R) measurable from runtime data (field `repro_exception_class`, §1.7). It also fits the PyTER line of work (Report 02 §2.1).

---

## 4. Gold-patch anatomy

| Metric | Value |
|---|---|
| Files per patch (median / p75 / p90 / max) | 1 / 2 / 4 / 26 |
| Single-file patches | **91/129 (70.5%)** |
| Changed lines (added + removed): p25 / median / p75 / p90 / max | 4 / **12** / 44 / 127 / 12,714 |
| Patches > 4 files / > 200 changed lines | 11 / 10 |
| Patches creating a new file | 11 |
| Patches touching `docs_src/` (always alongside library code) | 15 (all fastapi) |
| Patches touching test-like paths | 0 |
| Patches adding new def/class symbols | 40 |
| Patches with any hunk at module level (imports/constants, no enclosing def) | 54 (7 are module-level only) |
| Gold edits inside an `async def` | **20** (fastapi 19, httpx 1) |
| Largest gold file (lines): p25 / median / p75 / p90 / max | 475 / **1,004** / 1,182 / 4,586 / 5,694 |
| Gold files > 1,000 lines | 65 tasks; > 2,000 lines: 26 tasks |
| First edited line: median / p75 / p90 | 82 / 343 / 804 |
| First edit beyond line 150 (the first `read_file` window) | **51/129** |
| Gold paths at depth ≤ 3 | 128/129 |
| `git apply --check` after tail normalisation | **129/129** gold, **129/129** test |

**Patch-string defect (important for local tooling).** All 258 `patch`/`test_patch` strings end without a newline. When the last hunk line was a blank context line, that line is missing too. `git apply` reports "corrupt patch at line N" and GNU patch reports "patch unexpectedly ends in middle of line". `common.fix_patch_tail()` re-appends `\n` and pads the final hunk with `" \n"` until the `@@` counts match. MiniMax's diagnosis ("bare `+` lines", "9 malformed") was a symptom of this. The scorer obviously handles it, since gold validates.

---

## 5. Localization baselines (the bar any BCF localization arm must beat)

All ranks are over **non-test `.py` files** at base (median candidates: fastapi 739, rich 124, requests 21, httpx 32). Targets are the gold `.py` files that already exist at base. 7 tasks have no defined rank:

- 1 task whose gold file is new.
- 6 rich tasks whose statement shares no informative token with the gold file — all title-only or near-title-only.

### 5.1 File level (hits out of 129)

| Method | @1 | @3 | @5 | @10 | @20 | Median rank |
|---|---:|---:|---:|---:|---:|---:|
| BM25 (full cleaned statement) | **59** | 83 | **99** | 106 | 114 | 2 |
| BM25 (title only) | 42 | 59 | 77 | 91 | 105 | 3.5 |
| BM25 (file *path* tokens only, i.e. `find`/`ls`-style) | 26 | 39 | 43 | 47 | 56 | 3 |
| Git recency (most recently changed `.py`, last 400 commits) | 8 | 26 | 37 | 60 | 83 | 11 |
| **BM25 top-5 ∪ recency top-5** | — | — | **105** | — | — | — |

Recency in raw commit terms: the gold file was touched in the last 5 commits for 24/122 tasks, the last 20 for 59/122, and the last 100 for 101/122.

### 5.2 By repo (BM25 full statement / recency)

| Repo | n | BM25 @1 / @3 / @5 / @10 | Recency @5 / @10 | Node-BM25 @5 |
|---|---:|---|---|---:|
| fastapi | 67 | 27 / 38 / 48 / 54 | 24 / 36 | 31 |
| rich | 48 | 23 / 32 / 37 / 38 | 9 / 17 | 21 |
| requests | 13 | 8 / 12 / 13 / 13 | 4 / 7 | 9 |
| httpx | 1 | 1 / 1 / 1 / 1 | 0 / 0 | 1 |

By statement type: title-only statements reach BM25 top-3 in 14/34 and top-5 in 18/34. Where the statement names the gold symbol, BM25 @1 = 25/35. Where it doesn't, @1 = 34/94 and @5 = 67/94.

### 5.3 Function (node) level

| Method | @1 | @3 | @5 | @10 | @20 | Median |
|---|---:|---:|---:|---:|---:|---:|
| Node-level BM25 over non-test graph nodes | 31 | 52 | 62 | 71 | 84 | 4 |
| Statement names a gold node directly (strong resolver hit) | 29 | — | — | — | — | — |

**Design consequence: a "LEXICAL-FIRST" localization routine**

| Step | Action | Tool calls |
|---|---|---:|
| 1 | Run `bm25.py "<statement>"` over non-test `.py` files (vendored skill) and print the top 8 files with matching line numbers | 1 |
| 2 | Run `git log --name-only -n 30 --format=` and intersect with the step-1 top 8 | 1 |
| 3 | Use `grep -n` for the most specific statement identifiers inside the top 3 files, then a targeted `read_file` around the hits | 1–2 |
| 4 | Only then: `get_code_neighbors` on the enclosing function, for callers and callees, to find secondary edit sites | 1 |

Expected: the gold file is in hand within ~3 calls on ~75–80% of dev tasks. Discount this on hidden tasks for statement-style shift (§3.2).

---

## 6. Code graph and embeddings

| Metric | Value |
|---|---|
| Graph payloads | 127 (129 tasks; 2 shared commits); 0 zero-byte files; embeddings ↔ nodes join 127/127 |
| Edge types | `calls` only (452,588 edges in the unique graphs) |
| Containment encoded as `calls` (`X → X.method`) | median **8.8%** of edges |
| Test-code share of nodes (median) | **61.5%** (fastapi 63.6%, requests 60.4%, rich 41.7%, httpx 19.5%) |
| Isolated nodes (no edge) | median 2,219 per graph; fastapi ≈ **68%** of nodes; rich ≈ 3% |
| Class nodes have method bodies elided (`...`) | median 109 per graph |
| Tasks with ≥ 1 gold-enclosing function/class mapped to a node | 117/129 |
| Tasks where some gold hunk maps to no node | 15 |
| Tasks with module-level gold edits (no node by construction) | 54 |
| Statement identifiers with a strong resolver hit (exact / suffix / case-insensitive) | 52/129 tasks |
| Gold node reached directly by statement identifiers | 29/129 |
| Undirected hops from strongly resolved nodes to the nearest gold node | 0: 29 · 1: 5 · 2: 4 · 3: 3 · 4: 4 · ≥ 5: 3 · unreachable/no seed: 81 |

### Embeddings (256-d float32, one per node)

| Metric | Value |
|---|---|
| Mean pairwise cosine, raw (median over graphs) | **0.79** (rich 0.90, requests 0.86, httpx 0.87, fastapi 0.78) |
| Same, after mean-centering | **0.09** (rich 0.02) |
| Sampled nodes whose nearest neighbour has cosine > 0.99 | 97.4% |
| Of those, identical source text | fastapi 33% (`docs_src` tutorial duplicates); rich 0; requests 0 |
| Gold retrieval rank, querying with a statement-resolved node (n = 56; 29 trivially rank 0) | Non-trivial cases (n = 27): median rank **101 raw / 106 centered**, i.e. the top **4.5%** of nodes |

**Reading.**

- The provided graph is a *function-level, mostly-sync call graph polluted by tests*.
- It is excellent for expanding from a known function (beyond the 29 tasks where the statement names a gold node, 1–2 hops reach the gold node in 9 more tasks, and ≤ 4 hops in 16 more), and poor as a search engine.
- The embeddings encode some locality (top 4.5% versus 50% at random), but mean-centering does not improve gold retrieval. The anisotropy is cosmetic for ranking.
- Give `search_similar_code` a low prior. Use it only with a symbol name, never prose. Exclude test results.

---

## 7. Test-oracle anatomy (how a patch is judged)

| Metric | Value |
|---|---|
| Test files per task (median / p90 / max) | 1 / 3 / 29 |
| Tasks whose `test_patch` creates a new test file | 44 |
| Collectable tests in the target files after `test_patch` (min / p25 / median / p75 / p90 / max) | 1 / 4 / **11** / 51 / 105 / 370 |
| Tasks with ≥ 50 tests in the target files | **33** |
| Median tests in target files: requests / httpx / rich / fastapi | **224** / 24 / 20.5 / 6 |
| Tests added (median / p90 / max) | 1 / 5 / 47 |
| Tasks adding **no** new test function (only modifying or parametrizing existing ones) | 25 (19 modify-only) |
| **Interface-burden tasks** (tests import repo symbols/modules missing at base) | **9** (fastapi 7, requests 1, rich 1) |
| Tasks whose target tests import packages missing from the public wheelhouse | **29** (`inline_snapshot` 22, `dirty_equals` 9, `importlib_metadata` 1, `attr` 1) |
| Tests importing `docs_src` modules | 3 (all exist at base) |

**Interface-burden tasks** (an agent must guess exact names):

| Task | Missing names | Added by gold |
|---|---|:---:|
| fastapi_14186 | `may_v1` (from `fastapi._compat`) | No |
| fastapi_14605 | `FastAPIDeprecationWarning` | Yes |
| fastapi_14609 | `PydanticV1NotSupportedError` | Yes |
| fastapi_15030 | `EventSourceResponse` + module `fastapi.sse` | Yes |
| fastapi_15661 | module `scripts.prepare_release` (whole new CLI) | Yes |
| fastapi_15745 | `_IncludedRouter`, `_iter_included_route_candidates`, `_restore_fastapi_scope_key` | Yes |
| fastapi_15785 | `RouteContext`, `iter_route_contexts` | Yes |
| requests_6757 | `is_urllib3_1` (`requests.compat`) | Yes |
| rich_3930 | `CellSpan`, `split_graphemes`, `split_text` + module `rich._unicode_data` | Yes |

(`requests.packages.urllib3.*` imports were excluded as runtime `sys.modules` aliases.)

**Reading.**

1. **Blast radius.** The scorer requires `pytest` exit 0 over all target tests, with no skips. A correct one-line fix that breaks one of 224 sibling tests in `tests/test_requests.py` scores 0. Running the full target module costs seconds. That is the cheapest insurance in the whole design.
2. **Interface tasks** (≈ 7%, and likely similar on the hidden set) are near-unsolvable without good guesses at names. Spend effort there only when the statement names the API.
3. **Oracle-kind prior for reproduction tests:** 81% plain behavioural asserts. A reproduction that asserts the *expected value stated or implied in the PR text* is the right template. `pytest.raises` reproductions matter mostly for fastapi validation and deprecation tasks.

---

## 8. Git history and environment

| Metric | Value |
|---|---|
| Commits reachable from HEAD (min / median / max) | fastapi 6,016 / 6,356 / 7,353 · rich 3,787 / 4,127 / 4,449 · requests 6,205 / 6,420 / 6,475 · httpx 4 |
| Task `base_commit` SHA present in the snapshot | **0/129** (SHAs rewritten by fast-export/import) |
| HEAD commit later than PR `created_at` | **0/129**. Gap p25 / median / p75 = 0.8 h / 4.9 h / 36 h (max 237 days) |
| Branches | `main` + `export_ref` (same commit); 0 tags |
| `requires-python` | fastapi ≥ 3.8 (38), ≥ 3.9 (14), ≥ 3.10 (15); requests ≥ 3.10 (8) or unset (5); rich unset (Poetry) |
| Sandbox Python | 3.13 (shims for `imp`, `telnetlib`) |
| Workspace layout entries at depth ≤ 3 | > 150 in **115/129**, so the prompt's listing is truncated |
| HEAD subject (fastapi) | Typically "📝 Update release notes" or "🔖 Release version …" |

**Reading.** In-sandbox history is a real affordance:

- `git log -n 30 --name-only` → recency prior.
- `git log -S'<identifier>' --oneline` → when a symbol was introduced or changed.
- `git blame -L a,b <file>` → which recent PR touched the suspicious lines.
- `git log -p -n 3 -- <file>` → the local coding conventions of recent fixes.

None of these can leak the answer: HEAD predates the PR in every task.

---

## 9. Difficulty prior and tiers (for allocation, splits and CUPED)

**Score** = z(log changed lines) + z(log gold files) + z(log BM25 rank, with 200 if undefined) + z(log(interface burden + new files)) − z(log effective chars). Split into terciles of 43.

| Tier | Repos | Median gold lines | Single-file | BM25 @3 | Interface tasks | Median effective chars | Median tests in target | Async edits | First edit > line 150 |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|
| A_easy | fastapi 22, requests 10, rich 11 | 4 | 43/43 | 39/43 | 0 | 576 | 8 | 2 | 24 |
| B_mid | fastapi 23, requests 2, rich 18 | 13 | 32/43 | 25/43 | 0 | 195 | 7 | 8 | 18 |
| C_hard | fastapi 22, rich 19, requests 1, httpx 1 | 55 | 16/43 | 19/43 | 9 | 145 | 25 | 10 | 9 |

**Uses**

1. Frozen CV splits stratified by repo × tier.
2. A covariate in paired A/B analysis (CUPED, Report 02 §2.6).
3. Expected-value budgeting: on dev data, tier-A tasks are where a minimal, verify-then-submit agent should collect its points. Tier C is where budget caps should bite early.

**Caveat:** only the statement, title, BM25 and effective-chars components are T0-observable on hidden tasks. Gold-size components are dev-only.

**T0-observable triage proxy** (usable in the system prompt / skill):

| Proxy | Signal |
|---|---|
| `title_only` or effective chars < 100 | Expect an under-specified task. Explore by recency + BM25 and write a reproduction early |
| Title verb ∈ {add, support, allow, implement} | Feature. Expect new code and possible interface burden |
| Statement contains backticked identifiers that resolve in the graph | Graph expansion is available |
| BM25 top-1 score ≫ top-2 score | High-confidence file. Go straight to `grep -n` → read → edit |

---

## 10. Design implications for BCF v1 (ranked by expected points per engineering hour)

| # | Change | Evidence | Expected effect |
|---:|---|---|---|
| 1 | Un-throttle `eval_config.yaml`; set `max_time_minutes` ≈ 5–6, `max_tool_calls` ≈ 40, `max_turns` ≈ 60 | Sample = 1 min / 10 calls; 12 h ÷ ~120 tasks ≈ 6 min | Prerequisite for any score |
| 2 | **Verify by running the full target test module(s)** before `submit_patch` | Blast radius median 11, requests 224 | Prevents silent P2P zeros |
| 3 | **Lexical-first localization** (BM25 skill + git recency + `grep -n`) | §5: top-5 in 99–105/129 | Fewer wasted calls; earlier first edit |
| 4 | **Grep before read**; read ±40 lines around hits | 51/129 edits beyond line 150 | Saves 1–3 calls per task |
| 5 | Minimal-diff default; escalate only when reproduction or tests demand more | 70.5% single-file; median 12 lines | Lower regression risk |
| 6 | Reproduction-first **only when cheap**: one-file `/tmp/repro.py` capturing the observed failure class → BCF class | 81% behavioural oracles; 15/129 exception mentions | Makes BCF classification real; ablate (Report 02 §2.3) |
| 7 | Graph tools for **expansion only**, filtered to non-test nodes; AST fallback for `async def` | §6 | Keeps graph value, avoids noise |
| 8 | API-design mode when the reproduction hits `ImportError`/`AttributeError` on a name from the statement | 9 interface tasks | Some partial wins on feature tasks |
| 9 | Never edit tests, conftest or pytest.ini; scratch files only in `/tmp`; never leave a clean tree at timeout | Harness reset rules; F5 | Removes structural zeros |
| 10 | Emit `BCF_EVT` telemetry to stdout | §1 principle 4 | Makes the ledger possible locally |

---

## 11. Limits of this analysis (honest list)

- **No tests were executed.** There is no Docker or WSL on this machine. F2P/P2P outcomes, test runtimes and environment failures are **not** measured, and all oracle facts are structural (AST/regex).
- Heuristic labellers can be wrong on individual tasks:
  - fix shape uses line-pattern rules;
  - exception signatures are found by regex;
  - title class uses emoji, prefix or verb;
  - interface burden comes from static import resolution.

  Spot-check them before relying on any single task's label.
- The BM25 tokenizer and stop-list are my own. An in-sandbox BM25 skill will give similar but not identical ranks.
- The graph-node mapping uses AST qualnames on the base file. Nested functions map to their nearest graph ancestor (counted separately).
- All figures describe the **public dev set**. The hidden set comes from private repos, with a frontier-model solvability filter. Expect weaker statement leakage and different repo conventions.

---

## 12. Artifact index

| Path | Contents |
|---|---|
| `analysis/scripts/common.py` | Diff parser, BM25, tokenizer, statement cleaner, `fix_patch_tail` |
| `analysis/scripts/s01_task_text_features.py` | Statement, gold and test text features; exception signature; fix shape; oracle kind |
| `analysis/scripts/s02_snapshot_scan.py` | Snapshot streaming, git history, AST enclosing defs, patch application, test AST counts, interface burden, BM25/recency |
| `analysis/scripts/s03_graph_embedding.py` | Graph stats, resolver re-implementation, hops, node BM25, embedding anisotropy and retrieval |
| `analysis/scripts/s04_aggregate.py` | Master table, difficulty tiers, `stats.json` |
| `analysis/out/task_metadata_master.csv` / `.jsonl` | **One row per task, ~70 columns** |
| `analysis/out/stats.json` | Every aggregate number in this report |
| `analysis/out/*_features.jsonl`, `graph_commit_stats.jsonl` | Raw per-task / per-graph outputs |
| `04a_Appendix_Per_Task_Metadata.md` | Human-readable per-task table |


---

<!-- ====================================================================== -->
<!-- FILE: 04a_Appendix_Per_Task_Metadata.md -->
<!-- ====================================================================== -->

# 04a — Appendix: Per-Task Static Metadata (129 tasks)

*Generated from `analysis/out/task_metadata_master.csv` (full ~70-column version). Column meanings are in Report 04 §1. "—" = not defined (e.g. gold file is new, so no BM25 rank).*

| Task | Yr | Title class | Eff. chars | Fix shape | Gold files | + | − | Async | 1st line | Tests in target | Tests added | Iface | Local-missing deps | BM25 rank | Recency rank | Hops | Tier |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| fastapi_11194 | 2025 | bug | 604 | logic_rewrite | 1 | 3 | 4 | Y | 875 | 2 | 2 | 0 |  | 12 | 3 | — | B_mid |
| fastapi_11355 | 2025 | bug | 206 | logic_rewrite | 1 | 9 | 2 |  | 1 | 1 | 1 | 0 |  | 1 | 3 | — | A_easy |
| fastapi_12942 | 2025 | bug | 1260 | guard_add | 1 | 3 | 0 |  | 590 | 1 | 1 | 0 | dirty_equals, inline_snapshot | 1 | 2 | 3 | A_easy |
| fastapi_13207 | 2025 | bug | 299 | logic_rewrite | 1 | 12 | 2 |  | 184 | 2 | 0 | 0 |  | 9 | 5 | 7 | B_mid |
| fastapi_13537 | 2025 | bug | 1575 | small_replace | 1 | 2 | 1 | Y | 906 | 2 | 2 | 0 |  | 1 | 8 | — | A_easy |
| fastapi_13713 | 2025 | feature | 749 | guard_add | 2 | 31 | 0 |  | 488 | 6 | 0 | 0 | dirty_equals | 1 | 4 | 1 | B_mid |
| fastapi_13786 | 2025 | bug | 4406 | rewrite_plus_new_code | 11 | 176 | 83 | Y | 1 | 67 | 0 | 0 | dirty_equals | 2 | 31 | 0 | C_hard |
| fastapi_13920 | 2026 | feature | 178 | guard_add | 1 | 4 | 0 |  | 66 | 1 | 1 | 0 |  | 5 | 1 | — | B_mid |
| fastapi_14077 | 2025 | deps | 625 | logic_rewrite | 3 | 5 | 6 | Y | 1 | 3 | 0 | 0 |  | 1 | 45 | — | B_mid |
| fastapi_14099 | 2025 | bug | 631 | rewrite_plus_new_code | 5 | 346 | 131 | Y | 1 | 44 | 13 | 0 |  | 19 | 27 | — | C_hard |
| fastapi_14186 | 2025 | bug | 632 | rewrite_plus_new_code | 10 | 266 | 98 |  | 1 | 51 | 0 | 1 |  | 1 | 13 | — | C_hard |
| fastapi_14246 | 2025 | bug | 171 | logic_rewrite | 1 | 24 | 4 |  | 210 | 15 | 2 | 0 | inline_snapshot | 37 | 19 | — | C_hard |
| fastapi_14258 | 2026 | feature | 268 | guard_add | 1 | 4 | 0 |  | 1393 | 1 | 1 | 0 |  | 2 | 2 | — | A_easy |
| fastapi_14262 | 2025 | feature | 2360 | rewrite_plus_new_code | 10 | 196 | 70 | Y | 2 | 15 | 15 | 0 |  | 2 | 2 | 0 | C_hard |
| fastapi_14266 | 2025 | bug | 145 | logic_rewrite | 1 | 8 | 10 |  | 248 | 3 | 3 | 0 | inline_snapshot | 18 | 2 | — | C_hard |
| fastapi_14297 | 2025 | bug | 1068 | guard_add | 1 | 7 | 0 |  | 371 | 14 | 4 | 0 |  | 3 | 8 | — | A_easy |
| fastapi_14301 | 2025 | bug | 728 | small_replace | 1 | 4 | 1 |  | 132 | 11 | 4 | 0 |  | 1 | 6 | 0 | A_easy |
| fastapi_14303 | 2025 | bug | 2217 | logic_rewrite | 1 | 6 | 2 | Y | 906 | 6 | 2 | 0 | dirty_equals | 2 | 1 | — | A_easy |
| fastapi_14306 | 2025 | ux | 2610 | rewrite_plus_new_code | 2 | 121 | 16 | Y | 1 | 7 | 7 | 0 |  | 1 | 16 | 0 | B_mid |
| fastapi_14349 | 2025 | bug | 119 | logic_rewrite | 1 | 6 | 6 |  | 265 | 2 | 2 | 0 | inline_snapshot | 2 | 18 | — | B_mid |
| fastapi_14356 | 2025 | bug | 1317 | logic_rewrite | 1 | 9 | 2 |  | 794 | 11 | 5 | 0 | dirty_equals, inline_snapshot | 2 | 1 | 3 | A_easy |
| fastapi_14360 | 2025 | bug | 747 | small_replace | 1 | 1 | 2 |  | 790 | 6 | 6 | 0 | dirty_equals | 1 | 6 | 4 | A_easy |
| fastapi_14361 | 2025 | bug | 95 | small_replace | 1 | 1 | 1 |  | 307 | 2 | 2 | 0 | inline_snapshot | 2 | 8 | — | B_mid |
| fastapi_14371 | 2025 | bug | 274 | rewrite_plus_new_code | 4 | 46 | 16 | Y | 19 | 370 | 0 | 0 | dirty_equals | 3 | 2 | — | C_hard |
| fastapi_14372 | 2025 | refactor | 1091 | logic_rewrite | 2 | 4 | 3 |  | 1 | 1 | 1 | 0 |  | 8 | 7 | 0 | B_mid |
| fastapi_14419 | 2025 | bug | 506 | rewrite_plus_new_code | 2 | 42 | 20 | Y | 41 | 2 | 2 | 0 |  | 1 | 2 | — | B_mid |
| fastapi_14430 | 2025 | bug | 195 | small_replace | 1 | 2 | 2 |  | 20 | 13 | 1 | 0 |  | 5 | 5 | — | B_mid |
| fastapi_14448 | 2025 | bug | 1158 | rewrite_plus_new_code | 2 | 82 | 24 | Y | 15 | 1 | 0 | 0 |  | 4 | 2 | — | B_mid |
| fastapi_14455 | 2025 | bug | 233 | logic_rewrite | 1 | 11 | 2 |  | 82 | 4 | 4 | 0 | inline_snapshot | 8 | 103 | — | B_mid |
| fastapi_14458 | 2025 | bug | 533 | logic_rewrite | 1 | 6 | 1 |  | 110 | 1 | 0 | 0 |  | 1 | 4 | 0 | A_easy |
| fastapi_14459 | 2025 | bug | 759 | rewrite_plus_new_code | 3 | 49 | 22 |  | 5 | 8 | 4 | 0 | inline_snapshot | 4 | 2 | — | C_hard |
| fastapi_14463 | 2026 | bug | 9042 | small_replace | 1 | 2 | 1 |  | 1 | 1 | 1 | 0 |  | 1 | 121 | 1 | A_easy |
| fastapi_14479 | 2026 | ux | 2391 | small_replace | 1 | 1 | 1 |  | 555 | 4 | 0 | 0 |  | 1 | 3 | 0 | A_easy |
| fastapi_14482 | 2025 | bug | 160 | logic_rewrite | 1 | 25 | 7 |  | 4 | 3 | 3 | 0 | inline_snapshot | 57 | 59 | — | C_hard |
| fastapi_14485 | 2025 | bug | 170 | rewrite_plus_new_code | 1 | 13 | 6 |  | 212 | 2 | 2 | 0 | inline_snapshot | 4 | 62 | — | B_mid |
| fastapi_14487 | 2025 | docs | 203 | logic_rewrite | 1 | 5 | 2 | Y | 15 | 4 | 0 | 0 |  | 19 | — | — | B_mid |
| fastapi_14492 | 2026 | docs | 158 | small_replace | 1 | 1 | 1 |  | 31 | 2 | 0 | 0 |  | 1 | 651 | — | A_easy |
| fastapi_14512 | 2025 | bug | 187 | rewrite_plus_new_code | 1 | 48 | 4 |  | 21 | 3 | 3 | 0 | inline_snapshot | 176 | 45 | 4 | C_hard |
| fastapi_14583 | 2025 | feature | 103 | guard_add | 2 | 24 | 0 |  | 1 | 189 | 4 | 0 | inline_snapshot | 38 | 41 | — | C_hard |
| fastapi_14605 | 2025 | feature | 159 | rewrite_plus_new_code | 7 | 28 | 16 |  | 1 | 89 | 0 | 11 | dirty_equals, inline_snapshot | 1 | 173 | — | C_hard |
| fastapi_14609 | 2025 | deps | 140 | logic_rewrite | 20 | 192 | 1855 | Y | 1 | 36 | 1 | 1 | inline_snapshot | 1 | 3 | — | C_hard |
| fastapi_14616 | 2026 | bug | 1050 | rewrite_plus_new_code | 1 | 10 | 2 |  | 54 | 4 | 4 | 0 |  | 4 | 1 | 5 | A_easy |
| fastapi_14786 | 2026 | bug | 1882 | small_replace | 1 | 1 | 1 |  | 10 | 9 | 2 | 0 |  | 14 | 414 | 0 | A_easy |
| fastapi_14791 | 2026 | bug | 541 | insert_only | 1 | 2 | 0 |  | 49 | 107 | 0 | 0 | dirty_equals, inline_snapshot | 1 | 136 | — | A_easy |
| fastapi_14794 | 2026 | feature | 701 | small_replace | 1 | 3 | 2 |  | 452 | 7 | 7 | 0 |  | 1 | 182 | 0 | A_easy |
| fastapi_14851 | 2026 | refactor | 460 | rewrite_plus_new_code | 1 | 153 | 4 |  | 13 | 9 | 3 | 0 |  | 6 | 290 | 2 | B_mid |
| fastapi_14873 | 2026 | bug | 467 | logic_rewrite | 1 | 11 | 10 |  | 955 | 10 | 1 | 0 |  | 5 | 257 | 0 | B_mid |
| fastapi_14953 | 2026 | refactor | 1389 | rewrite_plus_new_code | 4 | 102 | 2 |  | 30 | 98 | 4 | 0 | inline_snapshot | 4 | 887 | — | C_hard |
| fastapi_14962 | 2026 | feature | 209 | rewrite_plus_new_code | 3 | 49 | 6 | Y | 2 | 6 | 4 | 0 | inline_snapshot | 2 | 6 | — | C_hard |
| fastapi_14964 | 2026 | deprecate | 316 | logic_rewrite | 1 | 44 | 8 |  | 1 | 9 | 4 | 0 | inline_snapshot | 1 | — | 0 | B_mid |
| fastapi_14978 | 2026 | security | 111 | rewrite_plus_new_code | 3 | 81 | 1 | Y | 329 | 37 | 22 | 0 | inline_snapshot | 26 | 10 | — | C_hard |
| fastapi_14986 | 2026 | refactor | 987 | rewrite_plus_new_code | 2 | 25 | 9 | Y | 5 | 7 | 7 | 0 |  | 1 | 4 | — | B_mid |
| fastapi_15023 | 2026 | docs | 111 | rewrite_plus_new_code | 1 | 18 | 8 | Y | 25 | 2 | 0 | 0 | inline_snapshot | 4 | 4 | — | B_mid |
| fastapi_15030 | 2026 | feature | 144 | rewrite_plus_new_code | 9 | 525 | 35 | Y | 1 | 30 | 30 | 2 | inline_snapshot | 21 | 10 | — | C_hard |
| fastapi_15280 | 2026 | feature | 63 | rewrite_plus_new_code | 2 | 71 | 1 |  | 13 | 1 | 1 | 0 |  | 181 | 13 | — | C_hard |
| fastapi_15588 | 2026 | refactor | 1078 | rewrite_plus_new_code | 1 | 18 | 5 |  | 36 | 19 | 1 | 0 |  | 1 | 53 | — | A_easy |
| fastapi_15589 | 2026 | refactor | 443 | insert_only | 1 | 4 | 0 |  | 826 | 7 | 2 | 0 |  | 1 | 15 | — | A_easy |
| fastapi_15661 | 2026 | ci | 178 | new_module | 1 | 216 | 0 |  | — | 14 | 14 | 1 |  | — | — | — | C_hard |
| fastapi_15745 | 2026 | refactor | 3280 | rewrite_plus_new_code | 4 | 939 | 291 | Y | 1 | 34 | 31 | 3 | inline_snapshot | 1 | 20 | 0 | C_hard |
| fastapi_15763 | 2026 | bug | 214 | logic_rewrite | 1 | 10 | 3 |  | 2438 | 34 | 3 | 0 |  | 1 | 5 | — | B_mid |
| fastapi_15785 | 2026 | feature | 402 | rewrite_plus_new_code | 2 | 66 | 15 |  | 482 | 38 | 4 | 2 |  | 1 | 44 | — | C_hard |
| fastapi_15800 | 2026 | feature | 432 | rewrite_plus_new_code | 8 | 649 | 5 |  | 1 | 47 | 47 | 0 |  | 4 | 5 | — | C_hard |
| fastapi_5077 | 2025 | feature | 2501 | small_replace | 1 | 4 | 2 |  | 195 | 1 | 1 | 0 |  | 1 | 9 | 0 | A_easy |
| fastapi_5624 | 2025 | bug | 62 | small_replace | 1 | 3 | 1 |  | 281 | 1 | 1 | 0 |  | 9 | 37 | — | B_mid |
| fastapi_9425 | 2025 | feature | 231 | guard_add | 1 | 2 | 0 |  | 254 | 1 | 1 | 0 |  | 6 | 8 | — | B_mid |
| fastapi_9555 | 2025 | feature | 2700 | rewrite_plus_new_code | 1 | 14 | 8 |  | 80 | 1 | 1 | 0 |  | 3 | 18 | 5 | A_easy |
| fastapi_9753 | 2025 | feature | 625 | logic_rewrite | 1 | 5 | 2 |  | 4 | 1 | 1 | 0 |  | 1 | 7 | — | A_easy |
| httpx_3672 | 2025 | unlabeled | 238 | rewrite_plus_new_code | 7 | 57 | 22 | Y | 36 | 24 | 0 | 0 |  | 1 | 11 | 0 | C_hard |
| requests_6589 | 2024 | unlabeled | 233 | guard_add | 1 | 3 | 0 |  | 134 | 225 | 2 | 0 |  | 2 | 4 | 0 | A_easy |
| requests_6592 | 2023 | unlabeled | 233 | small_replace | 1 | 1 | 1 |  | 82 | 223 | 1 | 0 |  | 5 | 21 | — | A_easy |
| requests_6629 | 2024 | bug | 820 | new_code | 1 | 10 | 0 |  | 41 | 224 | 1 | 0 |  | 3 | 16 | 1 | A_easy |
| requests_6644 | 2024 | unlabeled | 291 | guard_add | 1 | 3 | 0 |  | 390 | 1 | 1 | 0 |  | 1 | 11 | — | A_easy |
| requests_6757 | 2024 | unlabeled | 267 | logic_rewrite | 2 | 16 | 1 |  | 10 | 230 | 2 | 1 |  | 1 | 4 | — | C_hard |
| requests_7205 | 2026 | bug | 605 | small_replace | 1 | 1 | 1 |  | 234 | 63 | 1 | 0 |  | 1 | 12 | — | A_easy |
| requests_7309 | 2026 | bug | 363 | logic_rewrite | 1 | 6 | 9 |  | 505 | 63 | 0 | 0 |  | 1 | 2 | 0 | A_easy |
| requests_7315 | 2026 | bug | 491 | delete | 1 | 0 | 2 |  | 548 | 1 | 1 | 0 |  | 2 | 6 | 0 | A_easy |
| requests_7328 | 2026 | bug | 576 | small_replace | 1 | 1 | 2 |  | 182 | 234 | 1 | 0 |  | 1 | 8 | 2 | A_easy |
| requests_7427 | 2026 | unlabeled | 359 | small_replace | 1 | 4 | 2 |  | 855 | 64 | 1 | 0 |  | 2 | 19 | 4 | A_easy |
| requests_7433 | 2026 | bug | 488 | small_replace | 1 | 3 | 3 |  | 599 | 235 | 1 | 0 |  | 1 | 18 | 0 | A_easy |
| requests_7502 | 2026 | bug | 67 | small_replace | 1 | 3 | 1 |  | 239 | 236 | 1 | 0 |  | 1 | 7 | 0 | B_mid |
| requests_7505 | 2026 | feature | 514 | rewrite_plus_new_code | 2 | 9 | 7 |  | 29 | 237 | 1 | 0 |  | 1 | 1 | 1 | B_mid |
| rich_2725 | 2024 | bug | 1311 | logic_rewrite | 1 | 5 | 5 |  | 778 | 11 | 1 | 0 |  | 2 | 9 | — | A_easy |
| rich_2943 | 2024 | unlabeled | 56 | small_replace | 1 | 1 | 1 |  | 666 | 27 | 1 | 0 |  | 1 | 62 | — | B_mid |
| rich_3006 | 2023 | bug | 243 | small_replace | 1 | 1 | 1 |  | 79 | 8 | 0 | 0 |  | 4 | 40 | — | A_easy |
| rich_3043 | 2023 | bug | 282 | small_replace | 1 | 1 | 1 |  | 1 | 91 | 0 | 0 |  | 2 | 20 | — | A_easy |
| rich_3052 | 2024 | unlabeled | 417 | logic_rewrite | 1 | 29 | 5 |  | 36 | 7 | 1 | 0 |  | 1 | — | 0 | B_mid |
| rich_3061 | 2023 | unlabeled | 319 | rewrite_plus_new_code | 1 | 67 | 24 |  | 97 | 84 | 2 | 0 |  | 1 | 8 | 3 | B_mid |
| rich_3063 | 2023 | bug | 39 | small_replace | 1 | 3 | 1 |  | 64 | 21 | 1 | 0 |  | — | — | — | C_hard |
| rich_3064 | 2023 | bug | 30 | logic_rewrite | 1 | 8 | 9 |  | 257 | 4 | 1 | 0 |  | 1 | 8 | — | B_mid |
| rich_3067 | 2023 | feature | 148 | small_replace | 1 | 1 | 1 |  | 101 | 7 | 0 | 0 |  | 23 | 47 | — | B_mid |
| rich_3105 | 2023 | bug | 19 | small_replace | 1 | 1 | 1 |  | 15 | 91 | 0 | 0 |  | — | 24 | — | C_hard |
| rich_3130 | 2023 | bug | 443 | logic_rewrite | 1 | 5 | 7 |  | 317 | 6 | 2 | 0 |  | 1 | 5 | 0 | A_easy |
| rich_3180 | 2023 | bug | 744 | logic_rewrite | 2 | 89 | 38 |  | 2 | 92 | 8 | 0 |  | 10 | 46 | — | C_hard |
| rich_3278 | 2024 | unlabeled | 596 | insert_only | 1 | 1 | 0 |  | 9 | 4 | 1 | 0 |  | 3 | 71 | — | A_easy |
| rich_3296 | 2024 | bug | 174 | small_replace | 1 | 1 | 3 |  | 622 | 24 | 1 | 0 | importlib_metadata | 1 | 15 | — | A_easy |
| rich_3454 | 2024 | bug | 372 | small_replace | 1 | 1 | 1 |  | 101 | 7 | 0 | 0 |  | 1 | 65 | 0 | A_easy |
| rich_3468 | 2024 | bug | 94 | rewrite_plus_new_code | 1 | 36 | 6 |  | 1388 | 93 | 1 | 0 |  | 17 | 3 | — | C_hard |
| rich_3469 | 2024 | bug | 29 | small_replace | 1 | 1 | 1 |  | 680 | 7 | 1 | 0 |  | — | 7 | — | C_hard |
| rich_3470 | 2024 | bug | 28 | small_replace | 1 | 1 | 1 |  | 2032 | 93 | 0 | 0 |  | 1 | 3 | — | B_mid |
| rich_3471 | 2024 | bug | 40 | insert_only | 1 | 1 | 0 |  | 1041 | 86 | 1 | 0 |  | 4 | 26 | 0 | B_mid |
| rich_3472 | 2024 | bug | 42 | small_replace | 1 | 3 | 1 |  | 784 | 52 | 1 | 0 | attr | 1 | 7 | — | B_mid |
| rich_3480 | 2024 | bug | 35 | small_replace | 1 | 2 | 2 |  | 1001 | 87 | 1 | 0 |  | 11 | 3 | — | C_hard |
| rich_3486 | 2024 | unlabeled | 97 | logic_rewrite | 3 | 74 | 24 |  | 1 | 20 | 2 | 0 |  | 2 | 20 | 4 | C_hard |
| rich_3506 | 2024 | bug | 66 | logic_rewrite | 1 | 15 | 2 |  | 114 | 29 | 3 | 0 |  | 1 | 50 | 0 | B_mid |
| rich_3518 | 2024 | bug | 227 | small_replace | 1 | 1 | 1 |  | 454 | 12 | 1 | 0 |  | 1 | 28 | 0 | A_easy |
| rich_3521 | 2024 | unlabeled | 31 | logic_rewrite | 1 | 16 | 19 |  | 132 | 29 | 0 | 0 |  | 1 | 13 | 2 | B_mid |
| rich_3535 | 2024 | unlabeled | 187 | logic_rewrite | 2 | 7 | 1 |  | 10 | 8 | 1 | 0 |  | 4 | 2 | — | B_mid |
| rich_3675 | 2025 | unlabeled | 114 | logic_rewrite | 2 | 28 | 13 |  | 18 | 94 | 1 | 0 |  | 1 | 15 | — | B_mid |
| rich_3676 | 2025 | unlabeled | 41 | logic_rewrite | 2 | 12 | 1 |  | 121 | 21 | 1 | 0 |  | 4 | 24 | — | C_hard |
| rich_3718 | 2025 | bug | 320 | logic_rewrite | 1 | 3 | 4 |  | 149 | 7 | 2 | 0 |  | 18 | 29 | 1 | B_mid |
| rich_3772 | 2025 | bug | 39 | logic_rewrite | 1 | 29 | 16 |  | 14 | 22 | 1 | 0 |  | 2 | 18 | — | C_hard |
| rich_3777 | 2025 | unlabeled | 337 | logic_rewrite | 2 | 12 | 1 |  | 26 | 94 | 1 | 0 |  | 1 | 7 | — | B_mid |
| rich_3782 | 2025 | unlabeled | 22 | rewrite_plus_new_code | 1 | 24 | 5 |  | 1 | 25 | 1 | 0 |  | 1 | 44 | — | C_hard |
| rich_3882 | 2026 | bug | 189 | small_replace | 1 | 1 | 1 |  | 265 | 8 | 1 | 0 |  | 1 | 61 | 0 | A_easy |
| rich_3894 | 2026 | bug | 851 | guard_add | 1 | 4 | 0 |  | 101 | 19 | 1 | 0 |  | 3 | 12 | 2 | A_easy |
| rich_3905 | 2026 | change | 468 | logic_rewrite | 1 | 4 | 3 |  | 1175 | 35 | 1 | 0 |  | 1 | 1 | 0 | A_easy |
| rich_3930 | 2026 | bug | 1128 | rewrite_plus_new_code | 26 | 12170 | 544 |  | 1 | 104 | 9 | 4 |  | 2 | 7 | — | C_hard |
| rich_3934 | 2026 | unlabeled | 18 | rewrite_plus_new_code | 2 | 17 | 3 |  | 1 | 11 | 1 | 0 |  | 1 | 37 | — | C_hard |
| rich_3935 | 2026 | bug | 29 | logic_rewrite | 1 | 13 | 3 |  | 485 | 14 | 1 | 0 |  | 4 | 67 | — | C_hard |
| rich_3938 | 2026 | bug | 43 | rewrite_plus_new_code | 2 | 40 | 5 |  | 275 | 122 | 3 | 0 |  | 2 | 53 | — | C_hard |
| rich_3942 | 2026 | change | 53 | rewrite_plus_new_code | 2 | 43 | 27 |  | 1 | 8 | 0 | 0 |  | 1 | 70 | — | C_hard |
| rich_3944 | 2026 | bug | 17 | small_replace | 1 | 1 | 1 |  | 60 | 12 | 1 | 0 |  | — | 14 | — | C_hard |
| rich_3953 | 2026 | bug | 38 | logic_rewrite | 1 | 16 | 10 |  | 59 | 14 | 2 | 0 |  | — | 1 | — | C_hard |
| rich_4006 | 2026 | bug | 50 | logic_rewrite | 1 | 33 | 12 |  | 164 | 15 | 1 | 0 |  | 1 | 1 | 0 | B_mid |
| rich_4070 | 2026 | perf | 2966 | logic_rewrite | 9 | 71 | 57 |  | 1 | 119 | 0 | 0 |  | 1 | 12 | 0 | C_hard |
| rich_4075 | 2026 | unlabeled | 54 | logic_rewrite | 1 | 12 | 3 |  | 7 | 95 | 1 | 0 |  | 3 | 3 | — | B_mid |
| rich_4076 | 2026 | bug | 25 | small_replace | 1 | 3 | 3 |  | 130 | 5 | 1 | 0 |  | — | — | — | C_hard |
| rich_4077 | 2026 | unlabeled | 20 | new_code | 1 | 3 | 0 |  | 55 | 4 | 1 | 0 |  | 1 | — | — | B_mid |
| rich_4079 | 2026 | unlabeled | 25 | logic_rewrite | 1 | 4 | 3 |  | 334 | 8 | 1 | 0 |  | 1 | 8 | — | B_mid |


---

<!-- ====================================================================== -->
<!-- FILE: 05_Roadmap_and_Checklist_First_Submission.md -->
<!-- ====================================================================== -->

# 05 — Roadmap and Checklist: Before, During and After the First BCF Test-Harness Submission

*Prepared 2026-10-01 by Claude Opus 5.5. This builds on Reports 01–04. Dates assume the first Kaggle submission targets **Tue 2026-10-06** (about 5 working days). Shift the dates if needed; the order of steps is what matters. Rules recap: **1 submission per day**, 2 final picks, final deadline Dec 2, paper deadline Nov 12.*

---

## 0. The first submission's job

The first submission is a **measurement instrument**, not a bid for the top of the leaderboard. It must:

1. **Score > 0 without a platform error.** This proves the bundle, budgets and 12-hour envelope are safe.
2. Produce a **CV↔LB pair** with a known config hash. This is row 1 of the calibration log.
3. Isolate the **hygiene and discipline layer** of BCF, the part with the clearest expected value, from the knowledge layer (taxonomy, spec gate, graph-first), which still has to earn its place.

**Realistic target:** 0.07–0.12 public LB, i.e. 4–7 of the 58 public tasks.

- Public notebooks score 0.05–0.12, and the leader is at 0.17 [forum, as of 10-01].
- Any LB delta under about ±0.04 (≈ 2 tasks) is noise.

**Success criteria for submission #1** (all must hold):

| Criterion | Pass condition |
|---|---|
| Status | Scored (not "Notebook Threw Exception") |
| Score | > 0 |
| Runtime | Finished inside 12 h, with the per-task cap respected |
| Calibration | Local dev-fast CV for the same hash recorded beforehand |

---

## 1. Before the first submission (Oct 1 → Oct 6)

### 1.1 Environment bring-up (Day 1–2): the critical path

| ✓ | Step | Detail | Done when |
|:-:|---|---|---|
| ☐ | **Install WSL2 + Ubuntu 24.04** on the main PC (RTX 5090) | This machine has no Docker or WSL. The swegemma subprocess sandbox needs Linux `/bin/bash` (the official notebook uses `swegemma.sandbox.subprocess`) | `wsl -l -v` shows Ubuntu, version 2 |
| ☐ | Install the NVIDIA CUDA driver for WSL; check `nvidia-smi` inside WSL | 5090, 32 GB | GPU visible in WSL |
| ☐ | (Optional) Docker Engine inside WSL | Needed only for the `--sandbox docker` mode (4 GiB / 2 vCPU limits = scorer parity) | `docker run hello-world` |
| ☐ | Download the **"Gemma 4 Developer Agent Wheelhouse"** Kaggle dataset | It contains `swegemma`, `adk-submission`, `adk-eval-core` and pinned `vllm` (41 wheels per the notebook) | `python -c "import swegemma, adk_submission"` works |
| ☐ | Download `gemma-4-31b-it-qat-w4a16-ct` from Kaggle Models | W4A16 ≈ 17 GB, so it fits a single 5090 at `max_model_len=32768` | Weights on local NVMe |
| ☐ | Start vLLM locally with the **scorer flags**: `tool_call_parser=gemma4`, `reasoning_parser=gemma4`, `enable_thinking=True`, `max_model_len=32768`; no LoRA | Use TP=1 on the 5090 (the scorer uses TP=4 on L4s, so expect speed differences, not behavioural ones) | `curl :8000/v1/models` lists the model |
| ☐ | Unpack the competition ZIP (21.9 GB) into WSL ext4, **not** `/mnt/d` | Keeps I/O fast and avoids CRLF and permission artefacts | `tasks.jsonl`, `snapshots/`, `graphs/`, `embeddings/`, `wheels/` present |
| ☐ | **Patch-tail fix** in every local tool that applies `patch` or `test_patch` | All 258 strings lack the final newline (Report 04 §4). Reuse `analysis/scripts/common.py::fix_patch_tail` | `git apply --check` = 129/129 |
| ☐ | **Add missing test wheels to the local wheelhouse**: `inline-snapshot`, `dirty-equals`, `pytest-httpbin`, `typing-inspection` (download once, then offline) | 29 tasks import them (Report 04 §7). The scorer evidently has them | The oracle run below passes on these tasks |

### 1.2 Harness parity and oracle (Day 2–3)

| ✓ | Step | Detail | Done when |
|:-:|---|---|---|
| ☐ | Smoke-test one task end-to-end with the **sample submission un-throttled** (`max_time_minutes: 10`) | `swegemma eval --task-id requests_7309 …` | `results/` has `summary.json`, `task_results.jsonl`, `patches/`, `traces/`, `test_outputs/` |
| ☐ | **Gold oracle run** over all 129 tasks (`agent_patch = gold`, via a tiny driver around `verify_task`) | Confirms gold passes locally after the deps fix. Also records per-task **test runtime** (a budget input) | ≥ 125/129 resolved; the rest go on quarantine list v3 with reasons |
| ☐ | **Empty-patch baseline** (`--skip-agent-patch`) over all 129 | Detects tasks that pass with no fix (forum reported 3) | Those tasks are excluded from CV |
| ☐ | Freeze **CV splits** stratified by repo × tier (Report 04 §9): `dev-fast-15`, `dev-30`, `held-out-45` (no tuning), with the remainder for regression | Use seed 20261001 and commit the split file | `splits.json` committed |
| ☐ | Ledger v0: one JSONL row per task per run = `task_results.jsonl` + `termination_cause` (derived from trace and log) + `config_hash` + `split` | Add the GLM P0 fields first; MiniMax M3/M4 fields later | A `ledger.py` that can be re-run |

### 1.3 Build submission v1 ("BCF-Hygiene", Day 3–4)

**Bundle (no adapters):**

```text
submission/
├── agent.yaml               # single flat LlmAgent, model gemma-4-31b-it-qat-w4a16-ct
├── eval_config.yaml         # evaluation: {max_time_minutes: 5, max_tool_calls: 40, max_turns: 60, timeout_seconds: 120}
├── configs/sampling.yaml    # temperature 0.2, top_p 0.95, max_output_tokens 8192, thinking_budget 2048, include_thoughts true
├── prompts/system.md        # BCF workflow below (≤ 120 lines)
└── skills/
    ├── bcf-localize/        # SKILL.md + scripts/bm25.py (stdlib) + scripts/recent_files.py (git log)
    └── bcf-verify/          # SKILL.md + scripts/precheck.py (py_compile changed files, git diff sanity, no test/config paths, run target test module)
```

**Budget arithmetic for `eval_config`:**

- 12 h ≈ 43,200 s, for ≈ 120 tasks run sequentially.
- Container setup is outside the agent timer but inside the 12 h.
- `max_time_minutes: 5` gives Σ ≤ 10 h + setup ≈ ≤ 11 h worst case, leaving a margin for the 12-h kill.
- Raise it to 5.5 only after the first scored run shows the actual total.

**System-prompt workflow (BCF v1, lexical-first, verify-whole-module):**

| Step | Name | What the agent does | Calls |
|---:|---|---|---:|
| 0 | READ | Read the task. Note: title verb, any backticked or named identifiers, and whether a "Code Intelligence Tools" section is present | 0 |
| 1 | LOCALIZE | `run_skill_script bcf-localize/bm25.py "<statement>"` → top-8 files with matching lines; `recent_files.py` → recently changed files; prefer the intersection | 1–2 |
| 2 | NARROW | `grep -n` the identifiers in the top 3 files, then `read_file` ±40 lines around hits. Use `get_code_neighbors` only on a found function, to see callers and callees | 2–4 |
| 3 | REPRODUCE (optional, cheap) | Write `/tmp/repro.py` (never inside `/workspace`) and run it. The **observed failure is the BCF class**: ImportError / AttributeError → missing API; no exception where one is expected → missing guard; wrong value → logic; exception → crash path | 1–2 |
| 4 | PATCH | The smallest edit that addresses the class. Use `edit_file` with a short, unique `old_string` | 1–3 |
| 5 | VERIFY | Run the **whole** test module(s) for the touched code (e.g. `pytest -q tests/test_x.py`), plus the repro. Run `bcf-verify/precheck.py` | 1–2 |
| 6 | SUBMIT | If verification passes, or if ≥ 80% of the budget is used and an edit exists: `submit_patch`. **Never** finish with a clean tree. **Never** touch tests, conftest or pytest.ini | 0 (free) |
| 7 | RESCUE | 3 identical calls, or 3 failed verifications → revert to the last good diff and try the next candidate file once, then submit the best | — |

**Validation before upload:**

| ✓ | Check |
|:-:|---|
| ☐ | Allowed extensions only (`.yaml .yml .md .txt .py .json .safetensors`); no symlinks; size < 3 GiB |
| ☐ | `validate_directory` + `validate_single_declared_model` from `adk_submission` / `swegemma` pass locally |
| ☐ | `!include` paths are relative and contain no `..` |
| ☐ | Skill scripts are **stdlib-only** and run under Python 3.13 inside the sandbox (test them inside the local sandbox, not on the host) |
| ☐ | Every skill script prints `BCF_EVT {json}` lines for the ledger and never writes inside `/workspace` |

### 1.4 Local evaluation of v1 (Day 4–5)

| ✓ | Step | Gate |
|:-:|---|---|
| ☐ | Run the **sample submission (un-throttled)** on `dev-30`: baseline A0 | Recorded in the ledger |
| ☐ | Run **BCF-Hygiene v1** on the same `dev-30`, same seeds | Recorded |
| ☐ | Paired comparison: per-task flips, exact McNemar, Δ with CI | v1 ≥ A0 (non-inferior), and no `harness_error` / `forgot_submit` / `clean_tree` terminations |
| ☐ | **Budget projection**: per-task wall-seconds distribution (setup + agent + verify). Projected Σ over 120 tasks at the scorer's slower L4 speed: assume 1.5–2× local per-turn latency | Projected Σ ≤ 10.5 h |
| ☐ | Termination-cause census | `ctx_overflow` < 5%, `timeout` < 30%, `no_patch` < 10% |
| ☐ | Localization check: turn of first `read_file` on a gold file | Median ≤ 4 (the BM25 bar from Report 04 §5 suggests this is reachable) |
| ☐ | Spot-check 5 traces by hand (one per tier, plus a failure) | No scratch files in patches; no test edits |

### 1.5 Pre-registration (Day 5, 15 minutes, written before uploading)

| ✓ | Field | Value |
|:-:|---|---|
| ☐ | Config hash and git tag of the bundle | |
| ☐ | Local CV: `dev-30` resolved count + 95% CI; `held-out-45` *not yet touched* | |
| ☐ | Expected public LB band | e.g. 0.07–0.12 |
| ☐ | Decision rule after the score | See §3.3 |
| ☐ | What would trigger an immediate rollback | Error, or 0.00 |

### 1.6 Go / no-go

| ✓ | Gate |
|:-:|---|
| ☐ | Bundle validated locally |
| ☐ | Projected 12-h total ≤ 10.5 h, with `max_time_minutes` set |
| ☐ | No adapter in the bundle (LoRA stays gated: KV-cache platform bug [forum]) |
| ☐ | Platform status checked on the forum that morning: no open "submission errors" incident (e.g. the Sep 30 wheelhouse regression [forum]) |
| ☐ | Pre-registration written |

---

## 2. During the submission run (Day 6)

| ✓ | Step | Detail |
|:-:|---|---|
| ☐ | Upload `submission.zip` via the competition notebook flow | Same structure as the official Getting Started notebook |
| ☐ | Record the submission timestamp, notebook version and config hash in `submissions.csv` | Row 1 of the CV↔LB log |
| ☐ | **Do not** change the local bundle while it runs | Keeps attribution clean |
| ☐ | Monitor the notebook status (queued / running / error) every few hours. Note queue time | Forum reports 4–13 h L4×4 queues [forum] |
| ☐ | Meanwhile, run the **same bundle locally on `held-out-45`** once (first and only touch this week) | Gives an untuned CV point for the pair |
| ☐ | Meanwhile, start the next experiment branch (one variable only), e.g. the reproduction step on/off | Prepares submission #2 |
| ☐ | If it errors: capture the error text, check the forum, and **do not resubmit the same bundle the same day** (1 per day) | Diagnose locally with `scripts/inference.py`-style packaging |

---

## 3. After the submission (Day 7 onward)

### 3.1 Immediate (same day the score posts)

| ✓ | Step |
|:-:|---|
| ☐ | Record LB score, runtime and status in `submissions.csv` next to `dev-30` and `held-out-45` CV |
| ☐ | Compute LB tasks = round(score × 58) and its binomial CI. Compare to the pre-registered band |
| ☐ | If **0.00 or error**: treat it as a harness/budget failure. The usual suspects are an unhandled timeout over the 12 h total, a skill-script crash, or bundle validation. Fix it before any capability work |

### 3.2 Analysis (within 2 days)

| ✓ | Step | Output |
|:-:|---|---|
| ☐ | Termination-cause census on the local mirror runs (`dev-30` + `held-out-45`) | Leak table: the top cause becomes the next fix |
| ☐ | Per-tier and per-repo resolve rates vs Report 04 tiers | Does tier A convert? (expected: most points come from tier A) |
| ☐ | Localization funnel: BM25 top-5 hit → gold file opened → gold function edited → resolved | Where the funnel leaks |
| ☐ | Blast-radius failures: tasks whose patch fixed the new test but broke a sibling test in the module | Count. If > 0, enforce the whole-module verify harder |
| ☐ | Reproduction usefulness (if enabled): `repro_exception_class` distribution vs resolve | First real estimate of BCF's ρ |
| ☐ | Update the ledger and the "Monday queries" | — |

### 3.3 Decision rules for submission #2

- Change **one** thing. Submit only if the paired local Δ on `dev-30` + `held-out-45` is ≥ +3 tasks with McNemar p < 0.10, *or* the change fixes a structural leak (a termination-cause rate drops by ≥ 50%).
- LB deltas smaller than ±0.04 are **not** evidence. Decide on local paired data; use the LB only to check the CV→LB mapping.
- Keep a **safe pick**: the best-scoring hygiene bundle remains a final-selection candidate throughout.

### 3.4 Candidate experiment queue (one per submission, highest expected value first)

| # | Arm | Rationale (report) | Local gate |
|---:|---|---|---|
| 1 | Verify-whole-module strictness (prompt + precheck enforcement) | Blast radius (04 §7) | Fewer P2P breaks |
| 2 | Reproduction step on/off, gated by title verb and statement length | 04 §3.4; 02 §2.3 counter-evidence | Paired Δ |
| 3 | Thinking budget 2048 vs 0 vs 4096 | Thinking-drop server bug [forum] | Paired Δ + overflow rate |
| 4 | Async AST fallback skill (stdlib) | 20 async gold edits | Δ on the fastapi async stratum |
| 5 | Graph expansion limited to non-test nodes vs graph off | 04 §6 | Δ + calls per task |
| 6 | `max_time_minutes` 5 → 6 (only if the 12-h total allows) | Budget curve | Σ ≤ 10.5 h |
| 7 | API-design mode for ImportError reproductions | 9 interface tasks | Δ on the interface stratum |
| 8 | Spec-gate (BCF Phase 1) as a 1-turn structured plan, only for long statements | GLM D5 | Paired Δ must pay for the turn |

---

## 4. Milestone calendar to the finals

| Date | Milestone | Exit criterion |
|---|---|---|
| Oct 3 | WSL2 + vLLM + swegemma running locally | One task end-to-end |
| Oct 4 | Gold oracle + empty baseline over 129; splits frozen | Quarantine list v3 |
| Oct 5 | BCF-Hygiene v1 vs A0 paired on dev-30 | Non-inferior, no structural zeros |
| **Oct 6** | **Submission #1** | Scored > 0 within 12 h |
| Oct 7–19 | Experiments 1–5, ≈ 1 submission every 1–2 days | ≥ 8 CV↔LB pairs logged by Oct 19 |
| Oct 21–23 | LoRA gate (GLM D1: default NO-GO unless platform KV fix is live and K1/K2/K5 pass) | Written decision |
| Oct 26 | Paper data freeze candidates: ρ from reproduction classes, λ from hops, P-1 probe | Tables with CIs |
| Nov 10 | Paper internal freeze (deadline Nov 12) | — |
| Nov 20 | Pick the final two: a safe hygiene build + the best measured improvement | — |
| Dec 2 | Final deadline | — |

---

## 5. Risk register for the first run

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| 12-h overrun errors the whole submission [forum] | Medium | Total (score error) | `max_time_minutes` set; local Σ projection with a 1.5–2× latency factor |
| Skill script incompatible with the sandbox (Python 3.13, no network) | Medium | Many tasks degrade | Test skills inside the local sandbox; stdlib only; wrap in try/except and print `BCF_EVT error` |
| Context overflow discards the patch [forum] | Medium | Per task | Narrow reads (≤ 80 lines), 5k-char outputs, observation discipline; submit early when an edit exists |
| Scratch files leak into the patch | Low (with rule) | Patch rejected or wrong | `/tmp` only; precheck rejects untracked files outside library dirs |
| Dev-set optimism (solution-phrased statements) | High | LB < CV | Pre-registered band; compare against `held-out-45`; don't over-tune prompts on dev |
| Platform regression on submission day [forum] | Medium | Lost day | Check the forum before uploading; keep the previous bundle as fallback |


---

<!-- ====================================================================== -->
<!-- FILE: 06_Setup_Guide_WSL2_Swegemma_RTX5090.md -->
<!-- ====================================================================== -->

# 06 — Setup Guide: WSL2 + swegemma Wheelhouse + Local vLLM on the RTX 5090 PC

*Prepared 2026-10-01 by Claude Opus 5.5 for the BCF Gemma 4 Developer Agent entry. These steps follow the official Getting Started notebook (input/kagglecomp/docs/markdown/Kaggle-03-GettingStarted.md) and HARNESS_README.md, with changes for running locally on a single GPU.*

**Target machine:** PowerSpec G914 with Ryzen 9 9950X3D, 64 GB RAM, **RTX 5090 32 GB**, and Windows 11 Pro.

**Do not use the laptop for the model.** The laptop (i7-8750H, GTX 1060 6 GB) cannot serve the 31B model. It is still useful for analysis and for gold-patch oracle runs, which need no model.

---

## Contents of this folder

| File | Step | What it does |
|---|---|---|
| `06_Setup_Guide_WSL2_Swegemma_RTX5090.md` | — | This guide (Markdown) |
| `06_Setup_Guide_WSL2_Swegemma_RTX5090.html` | — | The same guide as one portable HTML file with copy buttons; works offline |
| `scripts/wslconfig.example` | 1 | WSL2 memory/CPU limits for the 5090 PC |
| `scripts/10_ubuntu_bootstrap.sh` | 2 | apt packages, uv, Python 3.12 + 3.13, `~/g4` workspace, GPU check |
| `scripts/20_fetch_assets.sh` | 3 | Wheelhouse, competition data (or a local ZIP), model weights |
| `scripts/30_install_wheelhouse.sh` | 4 | The notebook's wheel install in a Python 3.12 venv, then fills missing dependencies |
| `scripts/41_make_unthrottled_sample.sh` | 5a | Sample submission with the 1-min / 10-call throttle lifted and stub LoRAs removed |
| `scripts/40_local_eval.py` | 5b | Starts vLLM on one GPU and runs Phase 1 + Phase 2 on chosen tasks |
| `scripts/50_docker_sandbox.sh` | 6 | Docker Engine, missing test wheels, `swebench-sandbox:latest` image |
| `scripts/60_verify_setup.sh` | any | Health check |
| `build_html.py` | — | Regenerates the HTML from this Markdown |

**Fastest path:**

1. Do step 1 by hand.
2. Copy this folder into WSL:

   ```bash
   cp -r "/mnt/d/<path>/06_Setup_WSL2_Swegemma_RTX5090" ~/g4-setup
   ```

3. Run the scripts in numeric order.

Scripts copied from Windows can pick up CRLF line endings. If one fails with `$'\r': command not found`, fix them with:

```bash
sed -i 's/\r$//' ~/g4-setup/scripts/*.sh
```

---

## 1. Windows prep (on the 5090 PC)

**1.1 Virtualization.** Open Task Manager → Performance → CPU and check "Virtualization: Enabled". If it says Disabled, turn on **SVM Mode** in the MSI X870E BIOS (OC → Advanced CPU Configuration).

**1.2 NVIDIA driver.** Update the **Windows** driver. Any current Game Ready or Studio driver supports the RTX 5090 and WSL CUDA. Never install a Linux NVIDIA driver inside WSL.

**1.3 Install WSL2 + Ubuntu 24.04.** Run this in an admin PowerShell, reboot, and create your Linux user when prompted:

```powershell
wsl --install -d Ubuntu-24.04
```

**1.4 Give WSL enough memory.** By default WSL only gets half the RAM. Copy `scripts/wslconfig.example` to `C:\Users\<you>\.wslconfig`:

```text
[wsl2]
memory=48GB
processors=24
swap=32GB
```

Then restart WSL:

```powershell
wsl --shutdown
```

---

## 2. Ubuntu base (inside WSL)

Script: `bash scripts/10_ubuntu_bootstrap.sh`. Manual equivalent:

```bash
sudo apt-get update && sudo apt-get install -y build-essential git patch pigz unzip curl jq protobuf-compiler
```

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

Python 3.12 is the scorer's host interpreter (the notebook paths show `python3.12`). Python 3.13 is the test sandbox (`FROM python:3.13-slim`).

```bash
uv python install 3.12 3.13
```

```bash
mkdir -p ~/g4/{data,wheelhouse,models,results,submissions}
```

```bash
nvidia-smi
```

**Keep everything under `~/g4` on the WSL ext4 disk.** `/mnt/c` and `/mnt/d` are slow for snapshot extraction and git.

---

## 3. Kaggle access and downloads

Script: `bash scripts/20_fetch_assets.sh [/mnt/d/.../gemma-4-developer-agent.zip]`

**3.1 API token.** Create it yourself: kaggle.com → Settings → API → Create New Token. Copy `kaggle.json` to `~/.kaggle/kaggle.json` inside WSL. **Do not paste the token into a chat.**

```bash
chmod 600 ~/.kaggle/kaggle.json
```

```bash
uv tool install kaggle
```

**3.2 Wheelhouse.** This holds `swegemma`, `adk-submission`, `adk-eval-core` and pinned vLLM/torch. The notebook reports 41 wheels.

```bash
kaggle datasets download -d metric/gemma-4-developer-agent-wheelhouse -p ~/g4/wheelhouse --unzip
```

**3.3 Competition data** (21.9 GB ZIP). Copying the ZIP over the LAN from the laptop is usually faster. Pass its path to the script. Otherwise download it:

```bash
kaggle competitions download -c gemma-4-developer-agent -p ~/g4
```

```bash
unzip -q ~/g4/gemma-4-developer-agent.zip -d ~/g4/data
```

**3.4 Model weights** (about 18–20 GB). The notebook loads them from `google/gemma-4/other/gemma-4-31b-it-qat-w4a16-ct/2`.

```bash
kaggle models instances versions download google/gemma-4/other/gemma-4-31b-it-qat-w4a16-ct/2 -p ~/g4/models
```

If your Kaggle CLI version rejects that syntax, use kagglehub instead. It stores the files in its cache; symlink the printed path into `~/g4/models/`.

```bash
uvx --with kagglehub python -c "import kagglehub; print(kagglehub.model_download('google/gemma-4/other/gemma-4-31b-it-qat-w4a16-ct/2'))"
```

---

## 4. Install the wheelhouse

Script: `bash scripts/30_install_wheelhouse.sh`. This mirrors notebook cell 1 in a Python 3.12 venv.

Check which Python the wheels target (expect `cp312`):

```bash
ls ~/g4/wheelhouse/*.whl | grep -oE 'cp3[0-9]+' | sort | uniq -c
```

```bash
uv venv --python 3.12 ~/g4/.venv && source ~/g4/.venv/bin/activate && uv pip install pip
```

Stage the wheels exactly as the notebook does: skip `cutlass` and rename `cu128` → `+cu128`.

```bash
mkdir -p /tmp/whl && for w in ~/g4/wheelhouse/*.whl; do b=$(basename "$w"); [[ "${b,,}" == *cutlass* ]] && continue; [[ "$b" == *cu128* && "$b" != *+* ]] && b="${b/cu128/+cu128}"; ln -sf "$w" "/tmp/whl/$b"; done
```

```bash
python -m pip install --no-deps --force-reinstall /tmp/whl/*.whl && python -m pip freeze > ~/g4/constraints.txt
```

Kaggle's image already ships torch, transformers and similar packages; a fresh venv does not. This installs only the missing dependencies, pinned to what the wheelhouse installed. Repeat until `pip check` reports nothing missing.

```bash
python -m pip install -c ~/g4/constraints.txt $(python -m pip check | sed -nE 's/.* requires ([^,]+), which is not installed\./\1/p' | sort -u) pyyaml pandas
```

Smoke test:

```bash
python -c "import swegemma, adk_submission, vllm, torch; print(torch.cuda.get_device_name(0))"
```

---

## 5. First end-to-end task

**5a. Make an un-throttled sample submission.** Script: `bash scripts/41_make_unthrottled_sample.sh`. It:

- copies the official sample,
- replaces its `eval_config.yaml` (60 s / 10 calls / 1 min / 50 turns) with 300 s / 60 calls / 10 min / 80 turns,
- removes the two stub LoRA adapters (r = 4, layer 0 only). Pass `--keep-adapters` to keep them.

**5b. Run one task.** Script: `scripts/40_local_eval.py`. It reuses the notebook's own calls (cells 4–5) with three local changes:

| Change | Why |
|---|---|
| `tensor_parallel_size=1` | One GPU instead of the scorer's four L4s |
| LoRA serving only when the submission has adapters | Preallocating 8 rank-128 slots uses most of the 5090's spare memory for context (the KV cache) |
| Budgets read from the submission's `eval_config.yaml` | Matches how the scorer reads them |

The first run spends a few minutes loading the model.

```bash
source ~/g4/.venv/bin/activate && python ~/g4-setup/scripts/40_local_eval.py ~/g4/submissions/sample_unthrottled requests_7309
```

**What success looks like:** a JSON line per task with `resolved`, `patch_chars`, `tool_calls` and `seconds`, plus a results folder `~/g4/results/sample_unthrottled_<timestamp>/` containing `summary.json`, `task_results.jsonl`, `patches/`, `traces/`, `test_outputs/` and `logs/`. Pass or fail doesn't matter for this smoke test. The point is that the pipeline runs end to end.

Other ways to run it:

- **Several tasks:** pass a comma-separated list, e.g. `requests_7309,rich_2725,fastapi_11355`.
- **All 129 tasks:** pass `ALL`.

---

## 6. Docker sandbox for scorer parity (day 2)

Script: `bash scripts/50_docker_sandbox.sh`. Run it twice: the first run installs Docker, then you restart WSL, then run it again.

The `subprocess` sandbox is enough to start with. The scorer, though, runs tests in a **Python 3.13** container limited to **4 GB RAM / 2 vCPU**. For parity, install Docker Engine inside WSL (not Docker Desktop):

```bash
curl -fsSL https://get.docker.com | sudo sh && sudo usermod -aG docker $USER
```

Add the test packages that **29 dev tasks** need but the public wheelhouse lacks (see Report 04 §7):

```bash
python -m pip download --only-binary=:all: --python-version 3.13 --platform manylinux2014_x86_64 -d ~/g4/data/wheels inline-snapshot dirty-equals pytest-httpbin typing-inspection
```

Build the sandbox image:

```bash
cd ~/g4/data && cp docker/imp.py docker/telnetlib.py . && docker build -f docker/Dockerfile.public -t swebench-sandbox:latest .
```

Then run the evaluator with `--sandbox docker`.

**Unverified:** I haven't confirmed whether the harness expects the image built from `Dockerfile.public` (wheels baked in) or the plain `Dockerfile.sandbox` (it may mount `/wheels` itself). Check the first Docker run's logs.

---

## 7. Health check

Run this any time:

```bash
bash ~/g4-setup/scripts/60_verify_setup.sh
```

---

## 8. Things to watch for

| Symptom / risk | Cause | Fix |
|---|---|---|
| vLLM fails with "no kernel image is available for execution on the device" | The wheelhouse vLLM/torch were built for the scorer's L4 GPUs and may lack RTX 5090 (Blackwell) kernels | For local development only, install a recent vLLM release with Blackwell support in a **separate** venv. Agent behaviour should be the same |
| CUDA out-of-memory at vLLM start | LoRA preallocation, or `gpu_memory_utilization` too high next to the Windows desktop | Use the adapter-free sample (5a), or `--gpu-mem 0.85` |
| `git apply` reports "corrupt patch" on `patch` / `test_patch` from `tasks.jsonl` | All 258 strings lost their trailing newline (Report 04 §4) | Use `fix_patch_tail()` from `analysis/scripts/common.py` in any tool you write |
| Oracle failures on fastapi snapshot tests | `inline-snapshot` / `dirty-equals` missing locally | Step 6 wheel download |
| Very slow extraction or git | Working under `/mnt/c` or `/mnt/d` | Keep everything in `~/g4` |
| A `kaggle models ...` or `VllmServer` / `EvalConfig` argument errors | I took these from the notebook and README but could not execute them on this machine | Send the error text and I'll adjust the script |

---

## 9. What this unlocks (Report 05)

| Day | Milestone |
|---|---|
| 1 | Steps 1–4 working: `60_verify_setup.sh` all OK |
| 2 | Step 5 on 3 tasks (one per repo); step 6 Docker parity |
| 3 | Gold-patch oracle and empty-patch baseline over all 129 tasks; freeze CV splits |
| 4–5 | BCF-Hygiene v1 vs the un-throttled sample, paired on dev-30 |
| 6 | First Kaggle submission (Report 05 §1.6 go/no-go) |

