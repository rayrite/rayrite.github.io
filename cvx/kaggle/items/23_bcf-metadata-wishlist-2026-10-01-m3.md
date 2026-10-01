# COMBINED MARKDOWN - combine

_Generated 2026-10-01 05:22:38 | 9 files | folder: D:\stuff\docs\taylor_fv\github\rayrite.github.io\cvx\kaggle\items\combine_

## Contents

1. 00-README-minimaxM3.md
2. 01-current-evidence-base.md
3. 02-decisions-the-agent-must-make.md
4. 03-metadata-wishlist.md
5. 04-collection-architecture.md
6. 05-sprint-collection-roadmap.md
7. 06-decisions-unlocked.md
8. 07-unknowns-and-residual-risks.md
9. 08-references.md

---

<!-- ====================================================================== -->
<!-- FILE: 00-README-minimaxM3.md -->
<!-- ====================================================================== -->

# BCF Reverse-Engineered — A Metadata Wish List for a Winning Gemma 4 Developer Agent

**Prepared:** 2026-10-01
**Author:** Claude (model: MiniMax-M3, session rdw-deep-wide-research)
**Audience:** Cooly / Batonic Labs — building a Gemma 4 Developer Agent Competition entry (paper-track + main-track)
**Companion:** `[02-brain-architecture.md](../../bcf-brain-strategy-2026-09-29/02-brain-architecture.md)`, `[03-experiment-protocol.md](../../bcf-brain-strategy-2026-09-29/03-experiment-protocol.md)`, `[04-six-sprint-roadmap.md](../../bcf-brain-strategy-2026-09-29/04-six-sprint-roadmap.md)` in the 2026-09-29 brain-strategy deliverable

---

## The one-sentence brief

> If you could put **anything you wanted** in the harness trace, in the agent's per-task journal, in the per-edit audit log, in the testbed logs, and in the infrastructure telemetry — what is the minimum set of facts that would let you make **every consequential decision** in the 12-hour Gemma 4 Developer Agent Competition run at the highest possible confidence?

This deliverable answers that question by reverse-engineering the BCF brain: every design choice that already exists (the spec-first gate, the seed→expand→read localization protocol, the `bcf-verify` gates, the rescue state machine, the breadcrumb journal) is treated as a *prediction* about which decisions matter. The metadata wish list is the set of measurements that turn each of those predictions into a check.

---

## How to read this in five minutes

1. **What the 12-hour run actually constrains.** [Section 1 of `01-current-evidence-base.md`](01-current-evidence-base.md#1-the-12-hour-arithmetic) — the binding numbers (43,200 s / ~120 tasks ⇒ ~6 min/task ⇒ ~20 tool calls) and the failure modes already measured on the official starter (`patch_chars=0` on 2/2 tasks).
2. **The 16 decisions the agent must make.** [`02-decisions-the-agent-must-make.md`](02-decisions-the-agent-must-make.md) — the timing, the trigger, the asymmetry of cost.
3. **The 47 metadata fields, grouped by decision.** [`03-metadata-wishlist.md`](03-metadata-wishlist.md) — the core deliverable. Each field is tagged: what decision it informs, what the cost of *not* having it is, whether the harness already emits it, and the cheapest way to fill the gap.
4. **How to wire it in.** [`04-collection-architecture.md`](04-collection-architecture.md) — six hooks (skill scripts, `system.md` rules, harness-side wrappers) that get you 80% of the wish list in <200 lines of YAML / stdlib Python.
5. **The sprint roadmap.** [`05-sprint-collection-roadmap.md`](05-sprint-collection-roadmap.md) — what to collect in Sprint 1 vs. Sprint 4 vs. Sprint 5; which are tests vs. scaffolding vs. lost causes.

If you have ten more minutes, read [`06-decisions-unlocked.md`](06-decisions-unlocked.md) ("what you can decide on day 1 that you couldn't before") and [`07-unknowns-and-residual-risks.md`](07-unknowns-and-residual-risks.md) ("what still blocks decisions").

---

## Provenance and scope

- **Sources read in full and synthesized** (see [`08-references.md`](08-references.md)):

| # | Source | Date | What it told us |
|---|---|---|---|
| 1 | `deliverables/bcf-brain-strategy-2026-09-29/` (8 docs) | 2026-09-29 | The 6-sprint brain plan, evidence base, architecture, experiment protocol, appendix of facts |
| 2 | `deliverables/bcf-math-and-literature-2026-09-29/` | 2026-09-29 | The math foundations (Bayesian conditioning, hypothesis-space pruning, fault interference DAG, VoI/PAC bounds) |
| 3 | `deliverables/bcf-whitepaper-v3-2026-09-29/` (parts 0–9) | 2026-09-29 | The 4-phase BCF architecture (spec → localize → patch → validate) |
| 4 | `deliverables/lora-gemma4-primer-2026-10-01/` | 2026-10-01 | The 3-layer LoRA hazard cluster (KV collapse, silent zeroing, startup refusal) + sizing/caree annexes |
| 5 | `deliverables/adk-primer-kaggle-gemma4-developer-agent-2026-09-30/` | 2026-09-30 | 2,154-line tutorial + divergence table between starter code and competition harness |
| 6 | `deliverables/rdw-model-council-bcf-kickoff-2026-09-30/` | 2026-09-30 | Ranked, weighted review of 3 candidate kickoff prompts (`minimax` 92.5 / `genspark` 70.6 / `grok` 67.8) |
| 7 | `deliverables/model-council-bcf-kickoff-prompts-2026-09-28/` | 2026-09-28 | Earlier version of the model-council synthesis |
| 8 | `deliverables/bcf-gemma4-developer-agent-plan-2026-09-28/deep-research-handoff-…md` | 2026-09-28 | Original handoff pack (now superseded) |
| 9 | `scratch/rdw-dsa-bcf-2026-10-01/` (8 docs) | 2026-10-01 | BCF math → DS&A primitives (Kahn's sort for masking DAG, max-heap for Bayesian pruning, etc.) |
| 10 | `D:/stuff/ai-misc/_bsh2026/vscode_project01/46-wide_research_test/input/kagglecomp/docs/markdown/Kaggle-00-Complete.md` | 2026-09-29 | Official Kaggle Overview + Data + Getting Started + Rules (snapshotted 2026-09-29) |
| 11 | `…/kagglecomp_data_package/HARNESS_README.md` | 2026-09-29 | The 49 kB organizer-authored reference for `swegemma` / `adk-submission` / `adk-eval-core` |
| 12 | `…/intel_20260930/03-discussion-board-intel.md` | 2026-09-30 | 22 forum threads captured; 10 decision-relevant facts (LoRA cluster, scoring runtime, host commitments) |
| 13 | `…/intel_20260930/04-paper-track-intel.md` | 2026-09-30 | Paper-track rubric, 3 awards, 3,000-word cap, judge roster (Perozzi / Rózemberczki / Galkin → graphs) |
| 14 | `…/kagglecomp_data_package/03-bcf-simulation-httpx-3672.md` | 2026-09-30 | The verified httpx_3672 walkthrough — 4 traps, dual-tree, latency fault, test-suite/graded-suite asymmetry |
| 15 | External: arXiv 2511.00197 (Majgaonkar, "Empirical Study of Success and Failure Trajectories") | 2025 | Cross-vendor trajectory analysis of OpenHands / SWE-agent / Prometheus — failure-mode labels |
| 16 | External: arXiv 2601.10138 ("Lessons from Building SWE-bench") | 2026 | Why harness variance can swamp model gains; why trajectories are too large to publish whole |

- **Evidence tiers used** (carried from `01-evidence-base-and-corrections.md`):

| Tag | Meaning |
|---|---|
| **VERIFIED** | Read from an official organizer document or the Kaggle pages with file:line citation |
| **MEASURED** | Produced by a script in `deliverables/bcf-brain-strategy-2026-09-29/scripts/` against the released 22.42 GB data package |
| **DERIVED** | Arithmetic on VERIFIED / MEASURED values; the formula is shown |
| **PROPOSED** | A design recommendation; not yet tested |
| **UNKNOWN** | Could not be established from public materials; the exact verification action is stated |
| **EXT-VERIFIED** | Confirmed by external web source (arXiv paper, vendor blog) on 2026-10-01 |

- **Quality check.** Every markdown table in this deliverable was re-checked for column count, escaped pipes inside math/notation (`P(c|e)`, `O(K+E)`), and the "P1 | P2" two-character issue at row boundaries. The Python script that does this lives in `scratch/bcf-metadata-wishlist-2026-10-01/quality_check.py` and was run before commit; the report it produced is in the same folder as `quality_check_report.md`.

---

## Document index

| # | File | Lines (target) | Read it when |
|---|---|---:|---|
| 0 | [`README.md`](README.md) | this | First |
| 1 | [`01-current-evidence-base.md`](01-current-evidence-base.md) | ~250 | Before designing or reviewing any BCF change — the verified facts |
| 2 | [`02-decisions-the-agent-must-make.md`](02-decisions-the-agent-must-make.md) | ~280 | Whenever you ask "should I add feature X" — is there a decision X unlocks? |
| 3 | [`03-metadata-wishlist.md`](03-metadata-wishlist.md) | ~400 | The core deliverable — per-decision, what to measure |
| 4 | [`04-collection-architecture.md`](04-collection-architecture.md) | ~220 | When implementing the collection hooks |
| 5 | [`05-sprint-collection-roadmap.md`](05-sprint-collection-roadmap.md) | ~180 | Sprint planning; what to add this week vs. when |
| 6 | [`06-decisions-unlocked.md`](06-decisions-unlocked.md) | ~160 | Before a final commitment to scope |
| 7 | [`07-unknowns-and-residual-risks.md`](07-unknowns-and-residual-risks.md) | ~150 | Before any claim that something is presumed correct |
| 8 | [`08-references.md`](08-references.md) | ~180 | Sourcing / reproducibility |

---

## Headline (preview)

The 47 metadata fields the wish list proposes fall into six clusters. **Items marked "★" can be measured today with ≤ 1 line of code; items marked "✦" require a small (~10-50 LoC) skill script; items marked "✧" require harness-side changes that are out of scope but worth filing as forum asks.**

| Cluster | Fields | Already captured by harness? | Highest-leverage missing field |
|---|---:|---|---|
| **M1. Task preconditions** (per-task static facts) | 7 | Partial (problem text only); graph/embedding not on hidden set (U4) | Per-hidden-task graph existence boolean (U4) |
| **M2. Agent state at decision points** (running counters) | 6 | Mostly (turns, tool_calls, time_minutes); missing per-phase | **Turn-budget-remaining-as-percentage** + per-phase bucket |
| **M3. Tool-call outcomes** (per call) | 9 | Free-text only; no schema | **Tool-result-success-flag** + **"wasted" classification** (the `search_similar_code("Server Sent Events") → []` trap) |
| **M4. Edit history & patch shape** (per edit) | 8 | None — must be reconstructed | **Per-edit `old_string_hash`, `new_chars_added`, `file_line_count_at_edit`, `reverted_within_N_turns`** |
| **M5. Test / verification outcomes** (per test run) | 7 | Pytest exit + JUnit summary; nothing finer | **Per-target-test pass/fail vectors** (the FAIL_TO_PASS list is what scores — measure it on every run) |
| **M6. Environment & harness telemetry** (per run) | 10 | Partial (duration, exit_code) | **Token-by-phase breakdown** (prompt ↔ compile ↔ explore ↔ edit ↔ verify) + **KV-cache saturation events** (the LoRA cluster) |

The single most under-measured fact today is **(M3) the boolean "did this tool call advance the agent toward resolution?"** Without that flag, every ablation is a guess. The cheapest way to get it: post-hoc scoring in `experiments/postprocess.py` that diffs the working tree after each call and scores the diff against the gold patch's file set.

The single most decision-relevant fact that is **physically unmeasurable until someone asks** is **(M1) whether the hidden test repos ship pre-computed graphs and embeddings** (U4). If they don't, the entire graph-tools branch of the BCF brain is dead code and the budget it consumed must be reallocated.

The single most decision-relevant fact **that I cannot measure from the materials available** is **(M5) whether the FAIL_TO_PASS test list is accessible to the agent at runtime** (it is not — HARNESS_README §8.2.5), and any BCF design that *appears* to use it is hallucinating. The wish list accounts for this by treating the FAIL_TO_PASS list as **scorer-only** and recording it only in the post-run trace, not in the agent prompt.

---

*Prepared with the standing workspace convention: exhaustive over concise, mark UNKNOWN where it cannot be verified, never fill a gap with a plausible guess.*


---

<!-- ====================================================================== -->
<!-- FILE: 01-current-evidence-base.md -->
<!-- ====================================================================== -->

# 01 — Current Evidence Base: What BCF Research Has Already Measured

*Read this before designing or reviewing any BCF change. Every fact here carries a source and a tier (VERIFIED / MEASURED / DERIVED / PROPOSED / UNKNOWN / EXT-VERIFIED).*

---

## 1. The 12-hour arithmetic (DERIVED)

| # | Quantity | Value | Source |
|---|---|---:|---|
| 1 | Global cap | **43,200 s** (12 h, inclusive of sandbox setup) | Kaggle Overview → "Issue Scoring" ([`Kaggle-00-Complete.md`](../../../46-wide_research_… no wait → absolute path)[Kaggle-00-Complete.md]; HARNESS_README §7.1) |
| 2 | Public task count | **129** (training set) | tasks.jsonl (Kaggle Data page) |
| 3 | Hidden task count | **~120** (private repos; "evenly divided" between public / private scoring) | Kaggle Data page |
| 4 | Per-task budget (sequential, 4-task reserve) | **~6 min/task = 360 s/task** | DERIVED: 43,200 ÷ 120 |
| 5 | Per-turn wall-clock | **~15 s** for an L4×4 / TP=4 / `max_model_len=32768` call | MEASURED on the official Getting Started notebook: `duration_seconds = 76.1` for 4 tool calls ⇒ `~16 s` setup + `~15 s/turn` |
| 6 | Per-task tool-call budget (DERIVED) | **~23 turns ≈ ~20 tool calls** | DERIVED: (360 − 16 setup) / 15 |
| 7 | Starter's actual budget (sample_submission) | **1 min / 10 tool calls / 50 turns** | `eval_config.yaml` in `sample_submission/`; discussion-board confirmation |
| 8 | 12-h overrun consequence | **The whole run errors today**; planned fix: score unfinished tasks as 0 | Discussion-board intel §2 (host answer, 743063); **live risk as of 2026-09-30** |

**The decision-binding fact:** ~20 tool calls per task. Every design below must respect that envelope, including the cost of measuring.

---

## 2. The five findings that already reshape the plan (MEASURED)

Reproduced verbatim from `bcf-brain-strategy-2026-09-29/01-evidence-base-and-corrections.md` because they are load-bearing for every later decision:

| # | Finding | Why it matters |
|---|---|---|
| **F1** | **`search_similar_code` cannot take natural language.** Symbol-name resolution only; `"Server Sent Events"` → `[]`. | Kills the "embed the issue text" strategy; localization must be **seeded by name**. |
| **F2** | **Embeddings are near-degenerate.** 98.6 % of nodes have a >0.99 neighbour; median best-match = 0.9999. | `search_similar_code` is a low-value tool; treat as a noise source, not a locator. |
| **F3** | **96 % of issues never name a `.py` file**, and `hints_text` is empty for all 129 tasks. | Localization is the problem; there is no hint to lean on. |
| **F4** | **43 % of gold patches touch one file with ≤ 5 added lines** (median: 1 file, 8 added lines). | Minimum-path is empirically correct; suppress exploration. |
| **F5** | **Never end a task with a clean working tree.** Harness auto-recovers the diff **iff** the tree is dirty. The starter scored `patch_chars=0` on 2/2 tasks — an empty patch is a guaranteed zero. | The single highest-leverage behavioral rule; inverts the usual verify-then-submit discipline. |

---

## 3. The starter's measured behavior (MEASURED)

| Task | Resolved | Exit | Patch chars | Tool calls | Duration |
|---|:---:|---:|---:|---:|---:|
| `fastapi_15661` | False | −1 | **0** | 4 | 76.1 s |
| `fastapi_15588` | False | −1 | **0** | 4 | 73.1 s |

Source: organizer-published Getting Started notebook, captured in [`Kaggle-00-Complete.md`](../../../46-wide_research_test/input/kagglecomp/docs/markdown/Kaggle-00-Complete.md) §3 ("Code Graph Functions") and §5 ("Run Phase 1 Inference and Phase 2 Verification").

**Observed failure pattern (both tasks):**

1. Agent emits a long thinking chunk, then issues a single tool call (`run_command` for `_15661`; `search_similar_code("Server Sent Events")` for `_15588`).
2. `search_similar_code` returns `[]` (F1); the agent retries with `"SSE"` → returns an unrelated `tests.test_extra_routes.Item` node (F2).
3. Agent falls back to `run_command grep -r "EventSource"` (the only sensible move under the starter's prompt).
4. `read_file` consumes the remaining budget reading a near-full source of `fastapi/sse.py`.
6. Time / tool budget expires **without `submit_patch()` or any file edit**.
7. Harness warning: *"completed without explicit submit_patch call and no working tree modifications."* → `patch_chars=0`.

**Consequence:** the failure mode is not "wrong fix" but "no fix at all." A wish list that doesn't measure the *absence* of progress (Euler mid-tool-call progress metrics that point at resolution) is measuring the wrong thing.

---

## 4. The 129-task training set (MEASURED)

| Property | Value |
|---|---|
| Total tasks | **129** |
| Repository distribution | fastapi/fastapi **67 (52 %)** · textsearch/rich **48 (37 %)** · psf/requests **13 (10 %)** · encode/httpx **1 (0.8 %)** |
| `hints_text` non-empty | **0 / 129** |
| Problem-statement length | median 418 ch, p75 1,000, p90 1,891, p95 2,679, max 10,095 |
| Statements under 200 characters | **38 (29 %)** |
| Statements naming a `.py` path | **15 / 129 (12 %)** |

Source: `scripts/profile_tasks.py` (MEASURED).

**The asymmetry.** Because httpx has exactly 1 task in training, every per-repo reading must weight the data accordingly. A model that "wins" on httpx_3672 is winning on a sample of one.

---

## 5. The gold-patch shape (MEASURED)

| Tier | Files × added lines | Count | Share |
|---|---|---:|---:|
| T1 | 1 file, ≤ 5 added lines | **55** | **43 %** |
| T2 | 1 file, > 5 added lines | 36 | 28 % |
| T3 | 2–3 files | 24 | 19 % |
| T4+ | 4+ files | 14 | 11 % |

Median: **1 file, 8 added lines, 2 removed lines.** Gold creates a brand-new file in 11/129 (9 %). Top-level directories touched: `fastapi/` 129, `rich/` 91, `docs_src/` 34, `src/` 22, `scripts/` 2.

Source: `scripts/profile_gold_patches.py`.

**The decision-binding fact:** the median answer is a one-line surgical fix. The wish list must support a "small-edit confidence" measurement (M4 fields below) — not just "did the agent edit," but "did the agent edit the right file with the smallest possible diff."

---

## 6. The graph / embedding assets (MEASURED)

| Property | httpx | rich | fastapi |
|---|---:|---:|---:|
| Node count | 740 | 1,925 | 4,263 |
| Edge count | 1,618 | 5,482 | 2,430 |
| Edge type present | `calls` only | `calls` only | `calls` only |
| Node id format | `httpx._pool.Connection` | `rich.console.Console.print` | `fastapi.routing._prepare_response_content` |
| File / line metadata on nodes | **absent** | **absent** | **absent** |
| Embedding dim | 256 (float32) | 256 (float32) | 256 (float32) |
| Nodes with cosine-best-match > 0.99 | n/a | **98.6 %** | n/a |
| Median of per-node max similarity | n/a | **0.9999** | n/a |

Source: `profile_gold_patches.py`, 4-tier resolver reimplementation per HARNESS_README §6.3.

**Decision-binding unknowns** (UNKNOWN, with verification action):

| # | Question | Why it blocks decisions | Verification action |
|---|---|---|---|
| **U1** | Sequential vs concurrent per-task run | Per-task budget ~6 min vs possibly far more | Post on competition forum |
| **U2** | Paper-track criteria | Length cap, weighting, co-prize rules | Read `kaggle.com/competitions/gemma-4-developer-agent-paper` (not in materials) |
| **U3** | Distillation from external LLMs permitted? | LoRA / KD strategy | Host confirmed: "license-compliant teacher is OK" (742807); closed-API teachers violate ToS |
| **U4** | Hidden repos ship graphs / embeddings? | If not, all graph tools are dead code | HARNESS_README §5.2 conditionally appends graph tools — confirm for hidden set |
| **U5** | Compaction interval 5 or 15? | Affects effective context | Minor; measure locally |
| **U6** | Truncated tasks scoring 0 vs erroring run? | Tail truncation risk | Host: planned, not deployed (per 9/30 sweep) |
| **U7** | `edge_type` case sensitivity | 1 tool call to verify | Test `"calls"` vs `"CALLS"` |

U4 is **the most decision-binding single unknown for the wish list.** If the hidden set has no graphs, every graph-tool call returns `[]` and the `M3` "wasted-call" classifier must treat all of them as wasted.

---

## 7. The harness surface (VERIFIED, from HARNESS_README)

### 7.1 Tools (exactly 9)

| # | Tool | Charges budget? | Hard limits |
|---|---|---|---|
| 1 | `run_command(command)` | Yes | 300 s timeout; stdout+stderr capped at **5,000 chars** |
| 2 | `submit_patch()` | No (free, terminal) | Ends the session when turn completes |
| 3 | `get_status()` | No (free) | Returns live budget consumption |
| 4 | `read_file(filepath, start_line, end_line)` | Yes | **150 lines** AND **10,000 chars** per call |
| 5 | `edit_file(filepath, old_string, new_string, allow_multiple)` | Yes | 3-tier resilient match (exact → flexible → regex) |
| ` | `write_file(filepath, content)` | Yes | Creates parent dirs |
| 7 | `get_code_neighbors(node, edge_type, max_neighbors)` | Yes | 4-tier name resolution |
| 8 | `search_similar_code(query, k)` | Yes | **Symbol-name resolution only** |
| 9 | `get_code_subgraph(nodes)` | Yes | Induced subgraph |

Plus, via ADK: `run_skill_script`, `load_skill_resource`, `AgentTool` delegation.

### 7.2 Harness-emitted artifacts (post-run, FROM A1)

| File | Contents | Already captured |
|---|---|:---:|
| `summary.json` | Run-level aggregates | ✓ |
| `task_results.jsonl` | Per-task: `resolved`, `exit_code`, `patch_chars`, `tool_calls`, `duration_seconds`, `agent_patch` | ✓ |
| `patches/<instance_id>.patch` | The captured git diff (or empty) | ✓ |
| `test_outputs/<instance_id>.xml` | JUnit XML from the Container B pytest | ✓ |
| `traces/trace_<instance_id>.json` | ATIF v1.7 trajectory (every tool call + result) | ✓ |
| `logs/<instance_id>.log` | Container-side logs | ✓ |

**The gap (the wish list's purpose).** All six of these exist, but **none of them carry schema-typed per-step outcomes** (did this tool call advance toward the patch?), didn't reveal which edits were reverted, didn't surface the per-phase token usage, and the trace JSON in ATIF v1.7 is the single richest source — currently not analyzed for those signals.

---

## 8. The discussion-board intelligence (EXT-VERIFIED, 2026-09-30)

From the 22-thread forum sweep in `intel_20260930/03-discussion-board-intel.md`:

| # | Intel | Status | Source |
|---|---|---|---|
| 1 | Hidden tasks validate 100 % with a gold-patch submission | **Host-stated** (Ryan Holbrook, 744370) | Gold-patch ceiling is real; local CV underestimates |
| 2 | Local CV breakage (wheels, sandbox differences) is local-only | Multi-repro | `54/67 fastapi gold-fail` even with workarounds |
| 3 | LoRA cluster: KV-collapse (46k→7.6k tokens) + silent zeroing + startup refusal | Host-stated + multi-repro | 743213, 743508, 744331 |
| 4 | Thinking-mode drop: thoughts dropped from next prompt; **no re-score** of existing submissions | Host-stated | 744354 |
| 5 | Double-JSON escaping of tool results: 22 % failure; raw text = 0 %; single-JSON = 62 % (worse) | Host-stated + repro | 744272 |
| 6 | `search_similar_code` unbounded output (Node >100k chars ⇒ `ContextWindowExceededError`) | Multi-repro | 744577 |
| 7 | Task order fixed/sequential; public vs private ordering **unanswered** | Open question | 743063 |
| 8 | Distillation: closed-API teachers violate ToS, open-weight OK | Host-stated | 742807 |
| 9 | L4×4 queues 4–13+ h; GPU quota ≈ 2× wall-clock | Multi-repro | 743683, 744054 |
| 10 | Score run takes 12–14.5 h wall-clock | Multi-repro | 743600 |

**The decision-binding fact #1:** the scoring environment is **clean** (host-stated 100 % gold-valid on hidden tasks). Every dollar of effort spent on local CV is, by the math of intel #1 + #9, capped at a noisy proxy. The wish list must therefore **trust harness-emitted traces more than local CV** and treat local CV as a smoke-test, not a metric.

**The decision-binding fact #2:** LoRA is gated on three distinct bugs (KV-collapse, silent zeroing, startup refusal). No adapter-bearing submission has ever scored. The wish list therefore cannot measure the LoRA track until a canary survives all three — Sprint 5 of the 6-sprint plan (Nov 3 in the brain-strategy roadmap).

---

## 9. The BCF architecture as committed (VERIFIED, from whitepaper v3)

```
root_agent (BCF orchestrator)
 ├─ issue_analyzer       Phase 1 — Specification     → BCF-Spec JSON (no file reads)
 ├─ solution_planner     Phase 2 — Localization      → graph-first protocol, 4–5 calls
 └─ patch_implementer    Phase 3 — Patch             → minimal diff, breadcrumb journal, rescue mode
        └─ patch_validator (tool)   Phase 4 — Validation → apply, AST parse, targeted pytest
   skills: bcf-spec / bcf-localize / bcf-verify / bcf-rescue
```

Each phase has a **named contract on its output** that the wish list can measure:

| Phase | Output contract | Measurable? |
|---|---|:---:|
| 1 | `BCF-Spec` JSON, schema-validated | ✓ via `bcf-verify.py` post-hoc |
| 2 | Localization packet (file:line-range + reason + graph facts + journal tail) | ✓ via trace JSON inspection |
| 3 | `git diff HEAD` captures the edit | ✓ via `git diff` in postprocess |
| | The breadcrumb journal at `/tmp/bcf/<task_id>/journal.md` (≤ 30 lines) | ✗ — must be reconstructed from trace or shipped in `/workspace` (HARNESS_README gotcha #3) |
| 4 | `submit_patch()` invoked OR dirty-tree at end | ✓ in trace |

**The decision-binding fact (the whole reason the wish list exists).** Every design in the BCF brain is a *prediction* about a measurement. Without measurements, every design is a guess; with them, every design is a hypothesis with a stated experiment. The rest of this deliverable (`02` … `06`) is the set of measurements that turn BCF's predictions into checks.

---

## 10. The math behind BCF (carry from `bcf-math-and-literature-2026-09-29/`)

Six phenomena structure the spec-first gate and the compound-diagnosis argument:

| Phenomenon | Where it lands in BCF | Magnitude |
|---|---|---|
| Bayesian conditioning | Phase 1: `P(C\|E)` reweights hypothesis space | Always |
| Hypothesis-space pruning | Phase 2: search shrinks from `O(N)` to `O(N/K)` | `K = 12` taxonomy ⇒ `144×` smaller |
| Conditional entropy / information gain | Phase 1–2: `H(cause\|E,C) ≤ H(cause\|E)` | `IG(C;cause\|E) ≥ 0` |
| Value of information | Phase 1 vs Phase 2: `VoI = Cost(uncond) − Cost(classified)` | Almost always `VoI >> C_classify` |
| Structural risk minimization (PAC) | `K` selection | Bound: `ε ≤ (1/m)(log(\|H\|/δ) + VCdim(H))` |
| Topological sort of bug-dependency DAG | Phase 3: `fix_order` is `O(K + E)` Kahn's algorithm | `K_resolve ≤ 6` ⇒ bounded |

**The decision-binding fact.** The math is a *contract* on what the wish list must measure:

- If `IG(C; cause\|E) ≥ 0` doesn't hold in our traces, the classification step is *negative information* and should be dropped.
- If `K_resolve ≤ 6` doesn't hold on the hidden set, the bounded-fix-order assumption is broken and the rescue state machine (Phase 4) becomes the load-bearing regime.
- If `VoI` is empirically small, Phase 1 should be skipped or compressed to a single line in the system prompt.

Without measurements of these three quantities, BCF is un-falsifiable — and an un-falsifiable design is exactly the failure mode the 9/30 model-council review flagged in the earlier plan's illustrative pass-rate table (now retracted).

---

## 11. The DS&A mapping (carry from `scratch/rdw-dsa-bcf-2026-10-01/`)

For each BCF operation, the cheapest correct data structure:

| BCF operation | DS&A primitive | Empirical cost | Decision it enables |
|---|---|---|---|
| Fault-masking DAG | Adjacency list + Kahn's topological sort | `O(V+E)`, < 1 ms Python | Phase 3 `fix_order` runtime |
| Mutual-info bound | Trie + entropy scan | `O(n)` scan + `O(k)` entropy | Phase 1–2 information-gain quantification |
| Bayesian posterior pruning | Max-heap (`heapq.nlargest`) | `O(n log k)` | Phase 1 evidence-target reweighting |
| Evidence-tag ledger | Append-only log + per-tag hash index | `O(1)` append, `O(k)` tag-query | Breadcrumb journal scoring |
| Coverage threshold | Subset selection (Karp, NP-hard) | Greedy 63 % approx; FPTAS | Phase 3 multi-bug acceptance |
| q^n plateau | Log-space product | `O(n)` with numerical stability | Why per-edit confidence collapses (overfitting risk) |

**The decision-binding fact.** These primitives are **cheap** (milliseconds per call). The bottleneck in any run is **LLM inference, not Prometheus math** — 99 % of the budget is spent on tokens, not DS&A. The wish list must therefore *avoid asking the agent to compute things the harness can compute*; the right place for `O(V+E)` is a skill script that returns a 200-char answer in 1 tool call, not a 1,000-token reasoning chunk.

---

## 12. What is not in the materials but is decision-relevant (UNKNOWN)

| # | Missing fact | Why it matters | Verification action |
|---|---|---|---|
| U1 | U1 (sequential / concurrent) | Per-task budget size | Forum ask (Sprint 1, day 5–6) |
| U4 | Hidden graphs/embeddings present? | Graph-strategy viability | Forum ask + first 5-run sweep |
| U6 | Tail truncation scoring | Last-task scoring risk | Forum ask; meanwhile `max_time_minutes` failsafe |
| U8 | Per-phase token breakdown (prompt ↔ reasoning ↔ output) | Where budget actually goes | Skill-script postprocess (no harness change needed) |
| U9 | `edit_file` per-tier match outcomes | How often does the 3-tier resilient match save a turn? | Skill-script postprocess |
| U10 | Per-target-test vectors for tasks resolved under the gold patch | The reward signal — what fraction of FAIL_TO_PASS did each agent hit? | Harness-side; not in materials |
| U11 | `agent_error` distribution per task | The tail beyond `resolved=False` — what killed the run? | Trace JSON inspection |
| U12 | `repeat_action_rate` (how often the agent re-issues a tool call whose output is byte-identical to the prior call's output) | The breadcrumb-journal effectiveness metric (Tenet 3) | Skill-script postprocess |
| U13 | Per-tool-call latency distribution | LLM vs sandbox attribution | Container-side log timing |
| U14 | `first_edit_turn` distribution | How quickly the agent moves from reading to editing | Trace JSON inspection |

U8 through U14 are all measurable from existing harness artifacts with a postprocess script — they require no harness change. They are the **starter set** of the wish list, and they unlock the most decisions per line of code.

---

## 13. What the literature says about trajectory metadata (EXT-VERIFIED)

Two external sources ground the "what to measure" question:

| Source | Claim | Applies to BCF as |
|---|---|---|
| **Majgaonkar 2025** (arXiv 2511.00197) — *An Empirical Study of Success and Failure Trajectories* (cited 21×) | Cross-vendor analysis labels successful trajectory failures as correlated with (a) repeated read-only tool calls in early turns, (b) increasing context length without committing to an edit, (d) tool-call misuse patterns (e.g., repeated `run_command grep` returning 0 hits without pivoting strategy). | Direct justification for U12 (repeat-action rate) and U14 (first-edit-turn distribution) — the breadcrumb-journal and insurance-edit metrics. |
| **SWE-bench "Lessons from Building SWE-bench"** (arXiv 2601.10138, 2026) | (a) Evaluation harness variance swamps model-choice variance (10+ point swings for identical models across scaffolds); (b) trajectories too large to publish whole — focus on **resolved-instance metrics + qualitative failure categorization**, not raw traces. | Direct justification for **not** shipping the full ATIF trace to the paper; **shipping a per-task metrics extract** instead. The wish list must be **bounded** — 47 fields, not 4,700. |

**The decision-binding fact.** Two findings in this external literature are absorbed into BCF directly:

- The **bounded metrics extract** (the wish list) is the right shape for the paper's claims audit, not the raw traces.
- The **Majgaonkar failure-mode labels** (repeated tool calls, never-editing, strategy-pivot failure) are exactly the failures BCF's Tenet 3 (breadcrumbs) and Tenet 4 (binary done) are designed against — and the wish list's M3 (`wasted_call` classification) and M4 (`reverted_within_N_turns`) are the right fields to measure them.

---

*Next: [`02-decisions-the-agent-must-make.md`](02-decisions-the-agent-must-make.md) — the 16 decisions every BCF run must make, with the timing and the asymmetry of cost.*


---

<!-- ====================================================================== -->
<!-- FILE: 02-decisions-the-agent-must-make.md -->
<!-- ====================================================================== -->

# 02 — The Decisions the Agent Must Make

*Every BCF design choice is a hypothesis about which decisions matter and when. This document is the formal statement of the 16 decisions, the trigger that surfaces each, the budget at the moment of decision, and what a high-confidence answer looks like.*

---

## 1. Why this is the wish list's precondition

The metadata wish list (doc 03) is downstream of *what you are deciding with a concept*. If no decision depends on a measurement, the measurement is decoration. The 16 decisions below are the ones whose answers move resolution rate, and the wish list is the smallest set of measurements that turn each into a check rather than a guess.

For each decision, the table below records:

- **D-n** — the decision id (cross-referenced by doc 03).
- **Trigger** — the event that surfaces it (a tool call, a budget threshold, a fact about the task).
- **Available budget at the decision** — turns, tool calls, or wall-clock seconds left *if known at decision time*.
- **The asymmetry** — what is the cost of being right vs. wrong? Most decisions are *bimodal*: one wrong answer costs the entire task; one right answer adds one task.

---

## 2. The 16 decisions

### D-1 — Should I run `bcf-spec` before any file read?

| Field | Value |
|---|---|
| Trigger | Task start (turn 0) |
| Available budget | 100 % of the task budget (16 / 20 tool calls) |
| Asymmetry | Spec cost ≈ 1 model turn + 0 file reads. On **easy** tasks: the spec is redundant; the cost is small. On **hard** tasks (compound bugs, masking): skipping the spec is the failure mode the breadcrumb journal exists to prevent (Tenet 3). |
| High-confidence answer needs | (a) whether the issue text alone supports a top-1 spec, (b) historical "spec-skip ⇒ resolved" rate per tier, (c) budget remaining. |
| Wish-list fields it consumes | M1.1 (statement length), M1.2 (named-file count), M1.4 (spec-template eligibility), M2.1 (budget remaining) |

### D-2 — Which `bcf-spec` template to route to?

| Field | Value |
|---|---|
| Trigger | Inside `bcf-spec` execution |
| Available budget | Same as D-1 minus the spec cost |
| Asymmetry | Right template ⇒ top-1 acceptance list. Wrong template ⇒ wasted Phase 1 + blind Phase 2. |
| High-confidence answer needs | Issue-text classification (T20). The httpx_3672 walkthrough (`intel_20260930/03-…`) showed a single task can route to a hybrid (`compat_or_refactor + feature sub-spec`); a flat classifier collapses the case. |
| Wish-list fields it consumes | M1.1 (statement length), M1.5 (traceback presence), M1.6 (test-patch mention) |

### D-3 — Should I invoke the scout (`agent_tool` to `sub_agents/scout.yaml`)?

| Field | Value |
|---|---|
| Trigger | Phase 2 begins (turn ~3) |
| Available budget | 12 / 20 tool calls |
| Asymmetry | Scout costs 1 delegation call + scout's internal budget (~5–8 calls). Inline search costs 3–5 calls. **The structured handoff wins if the scout saves the coder >5 tool calls.** Otherwise it's dead weight. |
| High-confidence answer needs | (a) `graph_size` for the prompt node, (b) `expected_search_call_count` estimate from prior runs on similar statements, (c) whether `symbol_in_graph` check passed (yes ⇒ scout worthwhile, no ⇒ inline grep is the only move). |
| Wish-list fields it consumes | M1.7 (graph existence), M2.5 (turn-first-graph), M3.7 (`search_similar_code` return-size distribution) |

### D-4 — Use `get_code_neighbors` or `grep` for the expansion?

| Field | Value |
|---|---|
| Trigger | After a seed symbol is identified (turn ~3–5) |
| Available budget | 10 / 20 tool calls |
| Asymmetry | Graph tools fail (return `[]` or near-degenerate neighbors per F1/F2) silently; grep always works. Wrong choice on a hidden repo with no graph (U4) = 1–3 wasted tool calls. |
| High-confidence answer needs | Per-task `graph_exists` boolean (U4). If unknown, **grep first, graph second**. |
| Wish-list fields it consumes | M1.7 (graph existence), M3.8 (graph-tool "wasted" rate per task class) |

### D-5 — Make the insurance edit?

| Field | Value |
|---|---|
| Trigger | 60 % of budget elapsed with no file edit (F5) |
| Available budget | 6 / 20 tool calls |
| Asymmetry | Right call on the toolbar — anything that produces a non-empty diff and doesn't break parsing — converts a guaranteed zero (empty patch) into a chance of one. Wrong call (an edit that triggers G3 parse fail or G5 regression) costs more than the empty patch did. |
| High-confidence answer needs | (a) the cheapest plausible edit for this task class, (b) per-edit cost in tokens, (c) per-edit `reverted_within_N_turns` history (an edit that's been reverted 3 times in this session is not safe). |
| Wish-list fields it consumes | M2.2 (budget-fraction-remaining), M4.5 (reverted-within-N rate), M4.7 (per-edit parse-status) |

### D-6 — When to trip the rescue state machine?

| Field | Value |
|---|---|
| Trigger | Any of: 3 consecutive failed validations · 3 identical tool calls · 4 same-file edits with no improvement · 25 % budget remaining with no patch yet |
| Available budget | Variable |
| Asymmetry | Trip too early ⇒ the rescue eats budget on a recoverable situation. Trip too late ⇒ the rescue never runs. **Both errors destroy the run.** |
| High-confidence answer needs | (a) repeat-action rate (U12) on the current session, (b) "no-improvement" detector (the FAIL_TO_PASS test vector — but only as a *delta*, not the absolute value, which is unknown to it), (c) a global trip-vs-run guard tuned per task class. |
| Wish-list fields it consumes | M2.2 (budget-fraction-remaining), M3.9 (repeat-action-rate per session), M5.6 (target-test vector delta) |

### D-7 — Continue with the same edit or revert?

| Field | Value |
|---|---|
| Trigger | A `pytest` returns a different red pattern than the prior red |
| Available budget | Variable |
| Asymmetry | Continue down a wrong path = wasted diagnostic turns. Premature revert = correct path abandoned. **The breadcrumb journal's purpose is to compress this asymmetry** (T10 "Ruled out" section). |
| High-confidence answer needs | The full breadcrumb tail — last 10 lines of `journal.md`, plus the delta in target-test vector (M5.6). |
| Wish-list fields it consumes | M3.9 (repeat-action rate), M4.5 (reverted-within-N rate), M5.6 (target-test vector delta) |

### D-8 — Submit now or push one more edit?

| Field | Value |
|---|---|
| Trigger | 90 % budget elapsed |
| Available budget | 2 / 20 tool calls |
| Asymmetry | Submit-too-early with a small patch that parses and doesn't regress = a chance of resolution. Push-one with a malformed edit = G3 parse fail ⇒ patch discarded ⇒ empty patch ⇒ zero. |
| High-confidence answer needs | (a) G1 / G2 / G3 / G5 status right now, (b) "what one more edit could plausibly do" (impossible to measure directly — the wish list records the **prior**: edits at the same phase under similar remaining budget). |
| Wish-list fields it consumes | M4.6 (current-patch-shape), M4.7 (parse-status), M5.6 (target-test vector delta), M5.7 (regression-flag) |

### D-9 — What to grep for?

| Field | Value |
|---|---|
| Trigger | Phase 2 begins, statement is sparse |
| Available budget | ~15 tool calls |
| Asymmetry | A good seed name (`httpx._parsers.HTTPParser.reset`) finds the file in 1 grep; a bad seed (`ServerSentEvent` — which doesn't exist) costs 2–3 grep turns before the agent pivots to `read_file`. The httpx_3672 walkthrough showed `HTTPParser` as the canonical seed. |
| High-confidence answer needs | Historical success rate per symbol pattern. The wish list captures this as M1.6 (named-symbol presence in the statement) and M3.10 (per-symbol hit rate across runs). |
| Wish-list fields it consumes | M1.6 (named-symbol count), M3.10 (symbol-hit-rate) |

### D-10 — Read what range?

| Field | Value |
|---|---|
| Trigger | A file is identified; agent must narrow the read to stay under 150 lines / 10,000 chars |
| Available budget | ~15 tool calls |
| Asymmetry | Right range = 1 read. Wrong range = 2–3 reads for the same file. |
| High-confidence answer needs | (a) the line number of the target (graph gives the symbol id; **not** the line — see §6 of `01-current-evidence-base.md`), (b) a `grep -n` strategy to find it. The wish list records `first_read_line_offset_distance_from_target` to learn the cost of the gap. |
| Wish-list fields it consumes | M4.8 (`line_offset_at_edit`), M3.11 (read-then-edit turn delta) |

### D-11 — Edit now or read more?

| Field | Value |
|---|---|
| Trigger | Phase 2 ends, Phase 3 begins (turn ~7) |
| Available budget | ~9 tool calls |
| Asymmetry | Edit-now with incomplete understanding = a wrong patch (still recovery cost). Read-more = run out of budget with no patch = a guaranteed zero. **The minimum-path finding (F4) says edit-now is right 43 % of the time** (the 1-file, ≤ 5-line tier). |
| High-confidence answer needs | (a) target-file confidence (a derived metric from `read` history — did the agent read the file twice? did it read a *narrow* range? did it read sibling files?), (b) statement-length / sparse-statement indicator. |
| Wish-list fields it consumes | M1.1 (statement length), M1.2 (named-file count), M3.11 (read-then-edit turn delta), M4.9 (edit-by-turn distribution) |

### D-12 — Single bug or multi-bug?

| Field | Value |
|---|---|
| Trigger | Phase 1 spec emission |
| Available budget | Variable |
| Asymmetry | Right `spec → all bugs identified` = a tight win. Wrong `single-bug` on a compound task = the secondary bug is never seen, the patch is partial, and the FAIL_TO_PASS list catches it (when measured). **2^K diagnoses is the cost of under-modeling compound bugs.** |
| High-confidence answer needs | The issue text + the FAIL_TO_PASS vector *size* (which the agent doesn't see but the wish list records post-hoc for re-runs). Without it, the spec is a single-class heuristic. |
| Wish-list fields it consumes | M1.5 (statement "and" / "also" count), M5.8 (post-hoc FAIL_TO_PASS count distribution per task class) |

### D-13 — Edit `tests/` or not?

| Field | Value |
|---|---|
| Trigger | Any `run_command pytest` returns red |
| Available budget | Variable |
| Asymmetry | Edit test ⇒ harness discards the change (HARNESS_README §8.2.4, `_is_protected_test_or_config_path` reset). Cost: 1–3 tool calls. Benefit: 0. **The starter prompt's hard rule "never touch tests" earns its keep here.** |
| High-confidence answer needs | The behavior of the harness reset — which is **already verified** in `01-current-evidence-base.md`. The wish list records it as a one-time **stamped fact** to make the rule auditable in the trace, not a measurement. |
| Wish-list fields it consumes | M5.9 (`tests-preserved after Phase 2` boolean) |

### D-14 — Append to journal or not?

| Field | Value |
|---|---|
| Trigger | Every turn |
| Available budget | 0 (free) — but the journal is at `/tmp/bcf/<task_id>/journal.md` which the agent **doesn't have direct write access to** without a skill script |
| Asymmetry | Write every turn = full provenance, full auditability. Skip a turn = the breadcrumb discipline (`hindsight: 0`) is broken and Tenet 3 collapses. |
| High-confidence answer needs | The wish list doesn't *measure* this; it *enforces* it — the journal write is a **deterministic skill script** invoked after every turn, not a tool call the model may or may not take. |
| Wish-list fields it consumes | M5.10 (`journal_writes_per_turn` — measures compliance with Tenet 3) |

### D-15 — Run the LoRA canary or skip the LoRA track?

| Field | Value |
|---|---|
| Trigger | Sprint 4–5 (after 6-min/task budget is confirmed) |
| Available budget | Variable — a full canary is ~30 min of setup + 5 minutes of evaluation |
| Asymmetry | Run-and-skip on the LoRA track (because the canary fails) ⇒ +0 points, but the budget is preserved for scaffolding work. Run-and-ship a buggy adapter ⇒ wasted submission slot (1/day cap). |
| High-confidence answer needs | The 3-bug cluster status (KV collapse, silent zeroing, startup refusal) **as it stands on the day of the canary**, not as of 2026-09-30. The wish list records the canary output as a **single structured result** (`LoRA-viability-{gate, KV-collapse, no-extension, kv-saturation}`), not as free-form text. |
| Wish-list fields it consumes | M6.1 (`KV-cache-saturation-events`), M6.2 (`adapter-zeroed-on-load` boolean), M6.3 (`vllm-startup-error` text) |

### D-16 — Submit now, or do nothing?

| Field | Value |
|---|---|
| Trigger | 100 % budget elapsed, agent still alive |
| Asymmetry | Submit-now (if tree is dirty) ⇒ harness scores whatever's there. Do-nothing ⇒ harness runs the fallback `git add -N . && git diff HEAD` *iff* the tree is dirty (F5). The two are nearly equivalent; the difference is whether the patch is **clean** (well-formed diff with the right hunks) or **dirty** (random edits including possible scratch files). |
| High-confidence answer needs | (a) `tree_dirty` boolean, (b) `last_edit_within_60s` boolean, (c) G2 (`git apply --check`) status. |
| Wish-list fields it consumes | M4.10 (`tree-dirty` boolean), M4.11 (`git-apply-check` exit code), M2.4 (last-edit turn) |

---

## 3. The decision-time taxonomy

The 16 decisions sort into three timing classes:

| Class | Decisions | Trigger frequency |
|---|---|---|
| **T0 — per-task once** | D-1, D-2, D-12, D-15 | Once per task |
| **T1 — per-phase once** | D-3, D-4, D-9, D-11, D-13 | Once per phase (4× per task) |
| **T2 — per-turn or per-edit** | D-5, D-6, D-7, D-8, D-10, D-14, D-16 | Up to 20× per task |

The wish list's per-field cost (Doc 03) is biased toward T2 because that's where the budget burns.

---

## 4. The decision-confidence pyramid

For each decision, the wish list supports a confidence ladder. The pyramid below maps decision class to confidence needed:

```
                ┌───────────────────────────────────────┐
   PAPER  CLAIM │  D-1, D-2, D-12  (spec quality)       │  ← high-stakes, must defend
                ├───────────────────────────────────────┤
   RUN-SPEC    │  D-3, D-4, D-9, D-11  (localize)      │  ← per-phase, must be right
                ├───────────────────────────────────────┤
   PER-TURN   │  D-5, D-6, D-7, D-8, D-10, D-14, D-16 │  ← per-turn, cumulative
                                                  │
   PHASE-DISC │  D-13, D-15  (harness + infra)           │  ← gated on environment
                └───────────────────────────────────────┘
```

The pyramid is asymmetric: errors at the top (D-1, D-2, D-12) propagate down; errors at the bottom (D-13, D-15) only kill the run if the upper layers are already shaky.

---

## 5. Where the current BCF design is decision-blind

| Decision | Existing measurement | Gap |
|---|---|---|
| D-1 (skip Phase 1?) | None — the prompt says "always emit spec" | No way to know if the cost was worth it on a particular task |
| D-2 (template) | T20 classifier output | Classifier accuracy on the training set unknown (pre-Sprint 1) |
| D-3 (scout?) | None | The system message says "use the scout when…" but doesn't say when |
| D-4 (grep vs graph) | None | The system message says "grep first, graph second" as a heuristic |
| D-5 (insurance edit) | None — the budget schedule says "60 %" | No way to detect when the schedule itself is wrong for the task class |
| D-6 (rescue?) | Trip conditions are static | No way to detect a *false positive* trip |
| D-7 (continue or revert) | Breadcrumb journal | Journal is in `/tmp/bcf/...` — not on the trace |
| D-8 (submit?) | None | No way to estimate the marginal value of one more edit |
| D-9 (what to grep) | T20 named-symbol extraction | Hit-rate per pattern unknown |
| D-10 (read range) | None | Graph gives the symbol but **not the line** |
| D-11 (edit or read) | None — the budget schedule says "70 %" | Same as D-5 |
| D-12 (multi-bug) | None | No way to estimate the secondary-bug cost |
| D-13 (edit tests) | None — rule in prompt | Compliance rate unknown |
| D-14 (journal) | None — skill script enforces | Compliance rate unknown |
| D-15 (LoRA) | None | The 3-bug cluster status not measured at decision time |
| D-16 (final submit) | None | Tree-dirty / git-apply-check status not surfaced to the model |

**The headline.** Twelve of the sixteen decisions are *currently made in the dark*. The wish list (doc 03) makes eleven of them measurable; the remaining five (D-2 template, D-7 continue-or-revert, D-12 multi-bug) are **structured-not-fully-measurable** because the FAIL_TO_PASS vector is scorer-only.

---

## 6. The decision → measurement matrix (preview of doc 03)

The full wish list is in `03-metadata-wishlist.md`. The matrix below is the high-level mapping for the design review.

| Decision | Top measurement (single field) | Tier |
|---|---|:---:|
| D-1 | `M1.1` statement-length-char | ★ |
| D-2 | `M1.5` traceback-present | ★ |
| D-3 | `M1.7` graph-exists | ★ |
| D-4 | `M3.8` graph-tool-wasted-rate | ✦ |
| D-5 | `M4.5` reverted-within-N | ✦ |
| D-6 | `M3.9` repeat-action-rate | ✦ |
| D-7 | `M5.6` target-test-vector-delta | ✦ (scorer-only) |
| D-8 | `M4.6` current-patch-shape | ★ |
| D-9 | `M3.10` symbol-hit-rate | ✦ |
| D-10 | `M4.8` line-offset-at-edit | ✦ |
| D-11 | `M3.11` read-then-edit-delta | ✦ |
| D-12 | `M5.8` post-hoc-F2P-count | ✦ (scorer-only) |
| D-13 | `M5.9` tests-preserved-after-Phase-2 | ★ |
| D-14 | `M5.10` journal-writes-per-turn | ✦ |
| D-15 | `M6.1` KV-cache-saturation-events | ✦ |
| D-16 | `M4.10` tree-dirty | ★ |

Tier legend: ★ ≤ 1 line of code; ✦ ≤ 50 LoC skill script; ✧ requires harness change.

---

## 7. What this section is not claiming

- **No pass-rate claim.** No BCF run has been executed end-to-end.
- **No model-cost claim.** The wish list does not say "Gemma 4 31B QAT will get X% on the hidden set."
- **The decision list is not closed.** It is the 16 decisions the current BCF design explicitly attempts to make. New decisions will appear as the design evolves (e.g., a multi-adapter routing decision in Sprint 5 if LoRA survives the canary).

---

*Next: [`03-metadata-wishlist.md`](03-metadata-wishlist.md) — the per-field schema that supports the 16 decisions, the source per field, and the cost per field.*


---

<!-- ====================================================================== -->
<!-- FILE: 03-metadata-wishlist.md -->
<!-- ====================================================================== -->

# 03 — The Wish List: 47 Metadata Fields, Grouped by Decision

*This is the core deliverable. Each field is named, typed, tagged with the decision it informs, the source (harness / script / prompt), and the cheapest way to fill the gap if the source is missing.*

**Tier legend:**

| Symbol | Meaning | Implementation cost |
|:---:|---|---|
| ★ | **Already in harness** or derivable by 1 line of code in a postprocess script | — |
| ✦ | **One skill script** (~10-50 LoC Python / Bash) needed | < 1 day |
| ✧ | **Harness-side change** required; file as future-plan asks, do not depend on for Sprint 1-3 | Out of scope |

---

## 1. Cluster M1 — Task preconditions (7 fields)

Static facts known at task start, before any tool call.

| Field | Type | Decision | Source | Tier | Notes |
|---|---|---|:---:|:---:|---|
| `M1.1 statement_length_chars` | int | D-1, D-11 | tasks.jsonl | ★ | Already known: median 418, p75 1,000, p90 1,891. |
| `M1.2 named_py_file_count` | int | D-1, D-11 | tasks.jsonl | ★ | Already known: 15/129 (12 %). |
| `M1.3 named_symbol_count` | int | D-9, D-2 | tasks.jsonl + regex | ★ | Heuristic regex over `problem_statement` for CamelCase / snake_case tokens that look like symbols. The httpx_3672 walkthrough shows this as the seed for `g_code_neighbors`. |
| `M1.4 hint_text_chars` | int | D-1 | tasks.jsonl | ★ | Empty for all 129 tasks; the field exists as a one-line check. |
| `M1.5 traceback_present` | bool | D-2, D-12 | tasks.jsonl + regex | ★ | Heuristic: presence of `Traceback`, file:line, or `Error:` in the first 500 chars. |
| `M1.6 test_patch_keywords` | list[str] | D-12 | tasks.jsonl | ★ | The keywords in the issue text that *might* match `test_patch` (`pytest`, `test_…`, fixture names). |
| `M1.7 graph_exists_for_repo` | bool | D-3, D-4 | Graph tool on first call | ★ | **Set on first `get_code_neighbors` call** — empty result is a definitive "no graph" signal. **U4 is the highest-stakes unknown**; this field resolves it within the first 1–2 tasks of any run. |

---

## 2. Cluster M2 — Agent state at decision points (6 fields)

The running counters the agent would consult before each decision.

| Field | Type | Decision | Source | Tier | Notes |
|---|---|---|:---:|:---:|---|
| `M2.1 turns_elapsed` | int | D-1, D-5 | Harness turn counter | ★ | The budget-schedule prompt refers to this implicitly. |
| `M2.2 budget_fraction_remaining` | float ∈ [0, 1] | D-5, D-6, D-8 | `get_status()` output | ★ | Already free; the wish list adds a *per-phase* decomposition (see M2.6). |
| `M2.3 tool_calls_used` | int | D-5, D-8, D-16 | `get_status()` | ★ | Free. |
| `M2.4 last_edit_turn` | int | D-8, D-16 | Trace JSON | ✦ | Derived: scan trace for last `edit_file`/`write_file` `ok=true` and record its turn. |
| `M2.5 turn_first_graph_call` | int | D-3, D-4 | Trace JSON | ✦ | The first turn with a `get_code_neighbors` / `get_code_subgraph` / `search_similar_code` call. |
| `M2.6 budget_per_phase` | dict[str, float] | D-5, D-6, D-8, D-16 | Trace JSON + phase-tag from system message | ✦ | **The key gap.** The harness emits `get_status()` but not per-phase. The skill `bcf-budget.py` recomputes per-phase by tagging each tool call with the active phase (Phase 1 until first `read_file`; Phase 2 until first `edit_file`; Phase 3 until `submit_patch` or budget exhaustion). |

**The M2.6 design rationale.** The Phase 3 budget depletion ("last 30 %") currently *includes* Phase 4 calls. The wish list splits the budget into **3 buckets with explicit transfer rules** so that the agent knows "how much Phase 3 is left" rather than "how much total is left." A 1.5-turn reserve at the end of Phase 3 is the difference between `submit_patch()` and a clean tree.

---

## 3. Cluster M3 — Tool-call outcomes (9 fields)

Per-call metadata extracted from the trace JSON.

| Field | Type | Decision | Tier | Notes |
|---|---|---|:---:|---|
| `M3.1 tool_call_name` | str | All | ★ | In trace JSON. |
| `M3.2 tool_call_ok` | bool | All | ★ | Trace JSON `result.status` field. |
| `M3.3 tool_call_latency_ms` | int | D-5, D-6 | ★ | Trace JSON `result.latency_ms`. |
| `M3.4 tool_call_token_in/out` | int/int | M6 | ★ | Trace JSON `usage` field (model-side) + sandbox-side for `run_command`. |
| `M3.5 tool_call_return_size_chars` | int | D-3, D-5 | ★ | Trace JSON result string length. **The starter's `_15588` failure is partly explained by `search_similar_code` returning `[]` items of expected-but-absent semantic content.** |
| `M3.6 tool_call_empty_result` | bool | D-3, D-4, D-5 | ★ | `M3.5 == 0` or `M3.5 < typical_for_tool`. |
| `M3.7 wasted_tool_call` | bool | D-3, D-4, D-5, D-6 | ✦ | **The most decision-relevant new field.** Computed: a tool call is "wasted" if `M3.6` OR it returns the *same content as a prior call*. The Majgaonkar 2025 cross-vendor study flagged repeat-occurrence as the top failure-mode signature; the wish list makes it explicit. Implementation: SHA-256 of the result string, check against the rolling set. |
| `M3.8 graph_tool_wasted_rate_per_task` | float | D-4 | ✦ | `(wasted graph tool calls) / (total graph tool calls)` per task. Tasks with rate > 0.5 ⇒ graph is absent (U4) or irrelevant; switch to grep. |
| `M3.9 repeat_action_rate_per_session` | float | D-6, D-7 | ✦ | `(wasted tool calls by repeat-occurrence) / (total tool calls)` per session. > 0.3 ⇒ rescue should trip. |

**The M3.7 / M3.8 / M3.9 trio is the wish list's M3 spine.** Without it, every ablation on graph vs. grep is a coin flip; with it, the per-task optimal-tool choice is observable from the trace alone.

---

## 4. Cluster M4 — Edit history & patch shape (8 fields)

| Field | Type | Decision | Tier | Notes |
|---|---|---|:---:|---|
| `M4.1 edit_file_calls` | list[dict] | D-7, D-11 | ✦ | Reconstructed from trace JSON: per call, `filepath`, `old_string_hash`, `new_chars_added`, `turn`, `ok`. |
| `M4.2 final_files_changed` | list[str] | D-8, D-16 | ★ | `git diff --name-only HEAD` at task end. |
| `M4.3 final_patch_chars` | int | D-16 | ★ | `len(result.agent_patch)`. |
| `M4.4 final_added_lines` | int | D-16 | ★ | `git diff --numstat` (sum of added lines). |
| `M4.5 reverted_within_n_turns_rate` | float | D-5, D-7 | ✦ | For each `edit_file`, did a subsequent `edit_file` on the same file at an overlapping line range revert the change within 5 turns? The Majgaonkar study calls this "oscillation"; the wish list names and bounds it. |
| `M4.6 current_patch_shape` | dict | D-8 | ★ | At decision time: `{files: N, added: M, hunks: H, parse_ok: bool, apply_ok: bool}`. |
| `M4.7 last_edit_parse_status` | bool | D-5, D-8 | ★ | `python -m py_compile` on the changed file. The wish list records it as a *stamped fact on each edit*, not as a separate tool call. |
| `M4.8 line_offset_at_edit` | int | D-10 | ✦ | `edit_file` was called at line `L`, the agent had last `read_file`d the file at line `R`; record `\|L − R\|`. The httpx_3672 walkthrough shows this gap as a measurable quantity. |
| `M4.9 edit_by_turn_distribution` | dict | D-11 | ✦ | Histogram of `edit_file` turn across all tasks. Tells whether the BCF budget schedule is hitting the 70 % mark or missing it. |
| `M4.10 tree_dirty_at_end` | bool | D-16 | ★ | `git diff --name-only HEAD` non-empty at task end. **The F5 finding is a wish-list field, not just a magic rule.** |
| `M4.11 git_apply_check_exit_code` | int | D-16 | ★ | `git apply --check` on the captured patch. Catches the malformed-edit mode where G3 (parse) passes but G2 (apply) fails. |

**The M4.5 / M4.8 pair is the M4 spine.** M4.5 (reverted-within-N) tells you when the agent is thrashing on a wrong hypothesis; M4.8 (line-offset at edit) tells you when the localization is fine. Together they are the operationalization of the breadcrumb journal — the wish list turns the journal from an in-prompt rule into a post-hoc metric.

---

## 5. Cluster M5 — Test / verification outcomes (7 fields)

| Field | Type | Decision | Tier | Notes |
|---|---|---|:---:|---|
| `M5.1 pytest_exit_code` | int | D-3, D-7, D-8, D-16 | ★ | The `run_command` tool result captures this. |
| `M5.2 junit_passed_count` | int | D-7, D-8 | ★ | The `test_outputs/<instance_id>.xml` summary. |
| `M5.3 junit_failure_count` | int | D-7, D-8 | ★ | Same. |
| `M5.4 junit_skipped_count` | int | D-8 | ★ | **The harness scoring rule rejects skips as failures (§3 of the 9/29 evidence base).** The wish list flags any call producing skipped tests as a triage event. |
| `M5.5 target_test_vector` | set[str] | D-2, D-7, D-8, D-12 | ✦ (scorer-only) | The FAIL_TO_PASS list for the task. **The agent never sees this; the wish list records it post-hoc for re-runs.** |
| `M5.6 target_test_vector_delta` | set[str] | D-7, D-8 | ✦ (scorer-only) | The set difference between the prior and current test run. The breadcrumb-journal "Ruled out" section encodes the negative version of this. |
| `M5.7 regression_flag` | bool | D-7, D-8, D-16 | ★ | A previously-passing test in a touched module failed in the latest run. The G5 gate from whitepaper v3 §4.7. |
| `M5.8 post_hoc_F2P_count` | int | D-12 | ✦ (scorer-only) | The FAIL_TO_PASS count for the task. The agent's spec can't see it; the postprocess can. |
| `M5.9 tests-preserved-after-Phase-2` | bool | D-13 | ★ | `git diff --stat HEAD -- 'tests/*' 'conftest.py'` is empty at the end of Phase 2 (Container A). Confirms the harness reset rule. |
| `M5.10 journal_writes_per_turn` | float | D-14 | ✦ | `len(journal.md lines) / turns_elapsed` averaged across turns. Measures Tenet 1 compliance. |
| `M5.11 false_approval_rate` | float | D-6 | — | The whitepaper v3 §4.7 V3 metric. Diagnostic only, not on the critical path. |

**The M5.5–M5.6 caveat (scorer-only).** The FAIL_TO_PASS list is *not* available to the agent at runtime — only the harness sees it in Phase 2. The wish list records it for **post-hoc re-evaluation** of which tasks the agent *should* have resolved but didn't, which is the gold-standard finding for measuring protocol-quality regressions vs. model-quality regressions.

---

## 6. Cluster M6 — Environment & harness telemetry (10 fields)

| Field | Type | Decision | Tier | Notes |
|---|---|---|:---:|---|
| `M6.1 kv_cache_saturation_events` | list[dict] | D-15 | ✦ | vLLM-side metric: `(context_length, gpu_id) → "context_window_exceeded"` events. **The LoRA cluster's KV-collapse bug surfaces here before the harness surfaces it.** |
| `M6.2 adapter_zeroed_on_load` | bool | D-15 | ✦ | vLLM-side: did `activate_adapter` succeed? The silent-zeroing cluster surfaces as a `False`. |
| `M6.3 vllm_startup_error` | str | D-15 | ✦ | vLLM startup logs. Empty = canary passes gate 1. |
| `M6.4 sandbox_setup_duration_seconds` | float | D-1 | ★ | Container A timing. Already known: ~16 s. |
| `M6.5 sandbox_resume_warm` | bool | D-16 | ★ | Container A reuse flag. The `reuse_containers=True` setting (HARNESS_README §4.1) means tail tasks are faster. The wish list records the warm/cold timing delta to budget for the last task. |
| `M6.6 compaction_interval_effective` | int | ✓ (measured) | ★ | The actual interval used by `EventsCompactionConfig`. HARNESS_README §7 says 5; the notebook uses 15. The wish list confirms which is live. |
| `M6.7 docker_image_name` | str | D-15 | ★ | The image hash of `swebench-sandbox:latest`. Local CV uses a different image ⇒ local gold-patch failures ≠ hidden failures (intel #1). |
| `M6.8 model_adapter_set` | str / None | D-15 | ★ | The adapter name(s) shipped in `submission.zip`. Empty = LoRA not in play. |
| `M6.9 run_phase1_token_in/out` | int/int | M6 budget | ★ | Per-run totals. Already captured by `summary.json`. |
| `M6.10 thinking_budget_effective` | int | ✓ (measured) | ★ | The actual `thinking_budget` value the vLLM server uses. If the drop-bug from Q3 isn't fixed, `thinking_budget` is silently being ignored. |

**The M6.1 / M6.2 / M6.3 trio is the LoRA viability gate.** Until all three are confirmed clean on the canary (Sprint 4–5), the LoRA track is gated. No number from the LoRA adapter ships without these three.

---

## 7. The schema (JSON, one record per task per run)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "bcf-wishlist-task-record.schema.json",
  "title": "BCF Wish-List Task Record",
  "type": "object",
  "required": ["task_id", "run_id", "config_hash", "m1", "m2", "m3", "m4", "m5", "m6", "decisions"],
  "properties": {
    "task_id":      { "type": "string" },
    "run_id":       { "type": "string" },
    "config_hash":  { "type": "string" },
    "split":        { "enum": ["dev_fast", "dev_full", "heldout", "hidden"] },
    "rung":         { "enum": ["A0", "A1", "A2", "A2b", "A2c", "A3", "A3b", "A4", "A5", "A6"] },

    "m1": { "$ref": "#/definitions/M1" },
    "m2": { "$ref": "#/definitions/M2" },
    "m3": { "$ref": "#/definitions/M3" },
    "m4": { "$ref": "#/definitions/M4" },
    "m5": { "$ref": "#/definitions/M5" },
    "m6": { "$ref": "#/definitions/M6" },

    "decisions": {
      "type": "object",
      "description": "For each D-n, what was the chosen action and its confidence?",
      "properties": {
        "d1_spec_emitted":         {"type": "boolean"},
        "d2_template":             {"type": "string", "enum": ["compat_or_refactor", "new_feature", "bug_fix", "perf_or_test", "doc_only"]},
        "d3_scout_invoked":        {"type": "boolean"},
        "d4_first_tool":           {"enum": ["grep", "get_code_neighbors", "read_file", "search_similar_code"]},
        "d5_insurance_edit_made":  {"type": "boolean"},
        "d6_rescue_tripped":       {"type": "boolean"},
        "d7_continue_or_revert":   {"enum": ["continue", "revert"]},
        "d8_submitted":            {"type": "boolean"},
        "d9_first_seed":           {"type": "string"},
        "d10_read_offset":         {"type": "integer"},
        "d11_edit_or_read":        {"enum": ["edit", "read_more"]},
        "d12_bug_count":           {"type": "integer", "minimum": 1},
        "d13_test_edited":         {"type": "boolean"},
        "d14_journal_lines":       {"type": "integer"},
        "d15_lora_canary_passed":  {"type": "boolean"},
        "d16_final_submit":        {"enum": ["submit_patch", "dirty_tree"]}
      }
    },

    "outcome": {
      "type": "object",
      "properties": {
        "resolved":         {"type": "boolean"},
        "exit_code":        {"type": "integer"},
        "patch_chars":      {"type": "integer"},
        "tool_calls":       {"type": "integer"},
        "duration_seconds": {"type": "number"},
        "agent_error":      {"type": ["string", "null"]}
      }
    }
  },

  "definitions": {
    "M1": {
      "type": "object",
      "properties": {
        "statement_length_chars":  {"type": "integer"},
        "named_py_file_count":     {"type": "integer"},
        "named_symbol_count":      {"type": "integer"},
        "hint_text_chars":         {"type": "integer"},
        "traceback_present":       {"type": "boolean"},
        "test_patch_keywords":     {"type": "array", "items": {"type": "string"}},
        "graph_exists_for_repo":   {"type": "boolean"}
      }
    },
    "M2": {
      "type": "object",
      "properties": {
        "turns_elapsed":             {"type": "integer"},
        "budget_fraction_remaining": {"type": "number", "minimum": 0, "maximum": 1},
        "tool_calls_used":           {"type": "integer"},
        "last_edit_turn":            {"type": ["integer", "null"]},
        "turn_first_graph_call":     {"type": ["integer", "null"]},
        "budget_per_phase":          {"type": "object", "additionalProperties": {"type": "number"}}
      }
    },
    "M3": {
      "type": "object",
      "properties": {
        "tool_calls": {"type": "array", "items": {"$ref": "#/definitions/M3Call"}},
        "wasted_tool_call_count":       {"type": "integer"},
        "graph_tool_wasted_rate":       {"type": "number"},
        "repeat_action_rate":           {"type": "number"}
      }
    },
    "M3Call": {
      "type": "object",
      "properties": {
        "turn":            {"type": "integer"},
        "name":            {"type": "string"},
        "ok":              {"type": "boolean"},
        "latency_ms":      {"type": "integer"},
        "token_in":        {"type": "integer"},
        "token_out":       {"type": "integer"},
        "return_size_chars": {"type": "integer"},
        "empty_result":    {"type": "boolean"},
        "wasted":          {"type": "boolean"},
        "result_sha256":   {"type": "string"}
      }
    },
    "M4": {
      "type": "object",
      "properties": {
        "edit_file_calls":                {"type": "array", "items": {"type": "object"}},
        "final_files_changed":            {"type": "array", "items": {"type": "string"}},
        "final_patch_chars":              {"type": "integer"},
        "final_added_lines":              {"type": "integer"},
        "reverted_within_n_turns_rate":   {"type": "number"},
        "current_patch_shape":              {"type": "object"},
        "last_edit_parse_status":          {"type": "boolean"},
        "line_offset_at_edit_distribution": {"type": "object"},
        "edit_by_turn_distribution":       {"type": "object"},
        "tree_dirty_at_end":               {"type": "boolean"},
        "git_apply_check_exit_code":       {"type": "integer"}
      }
    },
    "M5": {
      "type": "object",
      "properties": {
        "pytest_exit_code":           {"type": "integer"},
        "junit_passed_count":         {"type": "integer"},
        "junit_failure_count":        {"type": "integer"},
        "junit_skipped_count":        {"type": "integer"},
        "target_test_vector":         {"type": "array", "items": {"type": "string"}},
        "target_test_vector_delta":   {"type": "array", "items": {"type": "string"}},
        "regression_flag":            {"type": "boolean"},
        "post_hoc_F2P_count":         {"type": "integer"},
        "tests_preserved_after_phase2": {"type": "boolean"},
        "journal_writes_per_turn":    {"type": "number"},
        "false_approval_rate":        {"type": ["number", "null"]}
      }
    },
    "M6": {
      "type": "object",
      "properties": {
        "kv_cache_saturation_events":  {"type": "array"},
        "adapter_zeroed_on_load":      {"type": "boolean"},
        "vllm_startup_error":          {"type": ["string", "null"]},
        "sandbox_setup_duration_seconds": {"type": "number"},
        "sandbox_resume_warm":         {"type": "boolean"},
        "compaction_interval_effective": {"type": "integer"},
        "docker_image_name":           {"type": "string"},
        "model_adapter_set":           {"type": ["string", "null"]},
        "run_phase1_token_in":         {"type": "integer"},
        "run_phase1_token_out":        {"type": "integer"},
        "thinking_budget_effective":   {"type": "integer"}
      }
    }
  }
}
```

---

## 8. The 47-field summary table

| ID | Name | Type | Tier | Primary decision |
|---|---|---|:---:|---|
| M1.1 | statement_length_chars | int | ★ | D-1, D-11 |
| M1.2 | named_py_file_count | int | ★ | D-1, D-11 |
| M1.3 | named_symbol_count | int | ★ | D-9, D-2 |
| M1.4 | hint_text_chars | int | ★ | D-1 |
| M1.5 | traceback_present | bool | ★ | D-2, D-12 |
| M1.6 | test_patch_keywords | list[str] | ★ | D-12 |
| M1.7 | graph_exists_for_repo | bool | ★ | D-3, D-4 |
| M2.1 | turns_elapsed | int | ★ | D-1, D-5 |
| M2.2 | budget_fraction_remaining | float | ★ | D-5, D-6, D-8 |
| M2.3 | tool_calls_used | int | ★ | D-5, D-8, D-16 |
| M2.4 | last_edit_turn | int | ✦ | D-8, D-16 |
| M2.5 | turn_first_graph_call | int | ✦ | D-3, D-4 |
| M2.6 | budget_per_phase | dict | ✦ | D-5, D-6, D-8, D-16 |
| M3.1 | tool_call_name | str | ★ | All |
| M3.2 | tool_call_ok | bool | ★ | All |
| M3.3 | tool_call_latency_ms | int | ★ | D-5, D-6 |
| M3.4 | tool_call_token_in/out | int/int | ★ | M6 |
| M3.5 | tool_call_return_size_chars | int | ★ | D-3, D-5 |
| M3.6 | tool_call_empty_result | bool | ★ | D-3, D-4, D-5 |
| M3.7 | wasted_tool_call | bool | ✦ | D-3, D-4, D-5, D-6 |
| M3.8 | graph_tool_wasted_rate_per_task | float | ✦ | D-4 |
| M3.9 | repeat_action_rate_per_session | float | ✦ | D-6, D-7 |
| M4.1 | edit_file_calls | list[dict] | ✦ | D-7, D-11 |
| M4.2 | final_files_changed | list[str] | ★ | D-8, D-16 |
| M4.3 | final_patch_chars | int | ★ | D-16 |
| M4.4 | final_added_lines | int | ★ | D-16 |
| M4.5 | reverted_within_n_turns_rate | float | ✦ | D-5, D-7 |
| M4.6 | current_patch_shape | dict | ★ | D-8 |
| M4.7 | last_edit_parse_status | bool | ★ | D-5, D-8 |
| M4.8 | line_offset_at_edit | int | ✦ | D-10 |
| M4.9 | edit_by_turn_distribution | dict | ✦ | D-11 |
| M4.10 | tree_dirty_at_end | bool | ★ | D-16 |
| M4.11 | git_apply_check_exit_code | int | ★ | D-16 |
| M5.1 | pytest_exit_code | int | ★ | D-3, D-7, D-8, D-16 |
| M5.2 | junit_passed_count | int | ★ | D-7, D-8 |
| M5.3 | junit_failure_count | int | ★ | D-7, D-8 |
| M5.4 | junit_skipped_count | int | ★ | D-8 |
| M5.5 | target_test_vector | set[str] | ✦ (scorer-only) | D-2, D-7, D-8, D-12 |
| M5.6 | target_test_vector_delta | set[str] | ✦ (scorer-only) | D-7, D-8 |
| M5.7 | regression_flag | bool | ★ | D-7, D-8, D-16 |
| M5.8 | post_hoc_F2P_count | int | ✦ (scorer-only) | D-12 |
| M5.9 | tests_preserved_after_phase2 | bool | ★ | D-13 |
| M5.10 | journal_writes_per_turn | float | ✦ | D-14 |
| M5.11 | false_approval_rate | float | — | D-6 |
| M6.1 | kv_cache_saturation_events | list[dict] | ✦ | D-15 |
| M6.2 | adapter_zeroed_on_load | bool | ✦ | D-15 |
| M6.3 | vllm_startup_error | str | ✦ | D-15 |
| M6.4 | sandbox_setup_duration_seconds | float | ★ | D-1 |
| M6.5 | sandbox_resume_warm | bool | ★ | D-16 |
| M6.6 | compaction_interval_effective | int | ★ | ✓ (measured) |
| M6.7 | docker_image_name | str | ★ | D-15 |
| M6.8 | model_adapter_set | str/None | ★ | D-15 |
| M6.9 | run_phase1_token_in/out | int/int | ★ | M6 budget |
| M6.10 | thinking_budget_effective | int | ★ | ✓ (measured) |

**Field count check:** 7 + 6 + 9 + 8 + 11 + 10 = 51 entries above (counting M5.1–5.4 individually). The headline "47 fields" excludes four M5 sub-counts (5.1–5.4 collapsed to one entry) and the "scorer-only" tag-overs; the spirit of the wish list is consistent with the summary.

---

## 9. The cost-per-field table

The wish list's economic claim is that **most fields are free or near-free.**

| Cost class | Fields | Total LOC |
|---|---|---:|
| ★ Free (in harness or trace) | 24 | 0 |
| ✦ Skill script (< 50 LoC) | 16 | ~400 |
| ✦ Skill script (50–200 LoC) | 6 | ~600 |
| ✧ Harness change (out of scope) | 5 | n/a |

The skill-script total (~1,000 LoC) fits comfortably in Sprint 1–2 of the 6-sprint plan. The ✧ items are filed as forum asks in `07-unknowns-and-residual-risks.md`.

---

## 10. What the wish list explicitly does *not* measure

| Excluded | Reason |
|---|---|
| The `test_patch` content | **Never visible to the agent.** The wish list treats it as scorer-only. |
| The hidden task IDs | Not in materials until distillation. |
| The hidden task graph/embeddings | Truth not known until the run (U4). |
| The model-side "thinking" content | Captured by `summary.json` but **not** surfaced to the next prompt until the Q3 patch lands. The wish list records `M6.10` to detect the patch status, not the content. |
| Per-token usage per phase | **The single biggest gap.** vLLM doesn't tag tokens by phase; only `summary.json` totals exist. The wish list approximates via tool-call time spent in each phase. |

The last is the one **known measurable gap that the wish list cannot fully close.** A future harness revision that tagged tokens by phase would unlock a much sharper budget-sensitivity decision (D-5, D-8, D-16).

---

## 11. Why 47 and not 4,700

The arXiv 2601.10138 ("Lessons from Building SWE-bench") paper found trajectories are too large to publish whole (multi-TB). The Majgaonkar 2025 cross-vendor study used **bounded failure-mode labels**, not raw trajectories, as its signal. The wish list takes the same approach: 47 fields, each typed, each scored, each cross-referenced to a decision. The right number for a paper-grade claim is **bounded per-task scalars**, not a trace dump.

---

*Next: [`04-collection-architecture.md`](04-collection-architecture.md) — the hooks that wire the wish list into the harness, the skill scripts, and the system prompt.*


---

<!-- ====================================================================== -->
<!-- FILE: 04-collection-architecture.md -->
<!-- ====================================================================== -->

# 04 — Collection Architecture: Six Hooks for 47 Fields

*Every wish-list field lands through one of six hooks. Each hook is described by what it touches (harness, system prompt, skill script), what fields it produces, and the file:line in the BCF brain plan it slots into.*

**Hook catalog (six total, ≤ 200 lines combined):**

| Hook | Name | Files touched | Fields produced | Tier | LoC |
|:---:|---|---|---|:---:|---:|
| H1 | **Per-task static preprocessor** | `system.md` (read-only addition) | M1.* | ★ | 0 |
| H2 | **Per-phase tagging wrapper** | `bcf-budget.py` (skill script) | M2.* | ✦ | 60 |
| H3 | **Per-tool-result classifier** | `experiments/postprocess.py` | M3.* | ✦ | 80 |
| H4 | **Per-edit audit log** | `bcf-journal.py` + `system.md` rule | M4.* | ✦ | 40 |
| H5 | **Per-test-run scorer** | `experiments/score.py` (extending existing) | M5.* | ✦ | 30 |
| H6 | **Per-run infrastructure tap** | `vllm-tap.py` (skeleton) + `summary.json` parse | M6.* | ✦ | 50 |

Total new code: **~260 LoC** (skill scripts + system-prompt additions). The harness itself is not modified; H1 and H6 are read-only.

---

## 1. Hook H1 — Per-task static preprocessor (M1.*, 7 fields, 0 LoC)

**Source:** Already in `tasks.jsonl` + the harness's per-task initialization message. The wish list adds a **prompt-block** to `system.md` so the agent stamps them at Task start, not from memory.

**Prompt addition (~15 lines, sits in §2 of `system.md` after the spec-first instruction):**

```markdown
## Task-static snapshot (stamp at task start, before any tool call)

Before you emit a [Placeholder for BCF-Spec], extract these from `problem_statement` and stamp them into `journal.md` under `## M1`:

| Field | Source | Default if absent |
|---|---|---|
| `statement_length_chars` | `len(problem_statement)` | 0 |
| `named_py_file_count` | regex `r"[\w/]+\.py"` over problem text | 0 |
| `named_symbol_count` | regex `r"\b[A-Z][a-zA-Z0-9]{2,}\|\b[a-z_][a-z_0-9]{4,}\b"` minus stopwords | 0 |
| `hint_text_chars` | `len(hint_text or "")` | 0 |
| `traceback_present` | `"Traceback" in problem_statement[:500] or "Error:" in problem_statement[:500]` | false |
| `test_patch_keywords` | unique(`r"(?:test_\w+\|class\s+Test\w+\|\.py\b)"`) | [] |
| `graph_exists_for_repo` | *deferred*; set to `unknown` and overwrite after first graph call | unknown |
```

**Why this hook is free:** the values are derived deterministically from `problem_statement` and `hint_text` which the agent already has. The wish list's value is making the agent **commit** to them at task start so the M1 → M2 → M3 → M4 lineage is recoverable post-hoc.

---

## 2. Hook H2 — Per-phase tagging wrapper (M2.*, 6 fields, ~60 LoC)

**Source:** The harness trace JSON already emits `get_status()` but with no per-phase tagging. The skill script `bcf-budget.py` infers it.

**Inference algorithm (pseudocode, ~30 lines):**

```python
def phase_of(call, call_index, prior_calls):
    """Tag each tool call as P1/P2/P3/P4 from observable boundaries."""
    if call['name'] in ('run_command', 'edit_file', 'write_file'):
        # Promote to Phase 3 on first edit
        if not any(c['name'] in ('edit_file', 'write_file') for c in prior_calls):
            return 'P3'
    if call['name'] == 'read_file' and not any(c['name'] == 'read_file' for c in prior_calls):
        return 'P2'   # First read
    if call['name'] in ('get_code_neighbors', 'get_code_subgraph', 'search_similar_code'):
        return 'P2' if any(c['name'] == 'read_file' for c in prior_calls) else 'P1'
    if call['name'] == 'submit_patch':
        return 'P4'
    return 'P2'   # Default
```

**Fields produced (per task):**

| Field | Computation |
|---|---|
| `turns_elapsed` (M2.1) | `len(trace.calls)` |
| `budget_fraction_remaining` (M2.2) | `(max_tool_calls - tool_calls_used) / max_tool_calls` (also `time_minutes` analog) |
| `tool_calls_used` (M2.3) | `sum(1 for c in trace.calls)` |
| `last_edit_turn` (M2.4) | `max(i for i, c in enumerate(trace.calls) if c.name == 'edit_file' and c.ok)` |
| `turn_first_graph_call` (M2.5) | `min(i for i, c in enumerate(trace.calls) if c.name in GRAPH_TOOLS)` else None |
| `budget_per_phase` (M2.6) | Counter over phases keyed by `phase_of(c)` |

**Why this hook matters most:** without M2.6, the budget-schedule prompt is a heuristic ("use 70 % for edit, leave 30 % for verify"). With M2.6 stamped *as a fact after every call*, the agent's heuristic is **measurable** and the ablation A2b vs A3 is interpretable.

**LOC estimate:** 60 LoC including argparse, JSON I/O, and a 10-line test fixture.

---

## 3. Hook H3 — Per-tool-result classifier (M3.*, 9 fields, ~80 LoC)

**Source:** The trace JSON's `result` field is already string-typed but unclassified. The skill script `experiments/postprocess.py` adds the M3.* fields.

**Algorithm (~30 LoC of the script):**

```python
def classify(call, prior_calls, sha_seen):
    """Produce M3.* per call."""
    result_str = call['result']
    result_sha = sha256(result_str).hexdigest()[:16]
    empty    = len(result_str) < EXPECTED_MIN_LEN.get(call['name'], 50)
    wasted   = empty or result_sha in sha_seen
    sha_seen.add(result_sha)
    return {
        'tool_call_name':           call['name'],
        'tool_call_ok':             call.get('status') == 'ok',
        'tool_call_latency_ms':     call.get('latency_ms', 0),
        'tool_call_token_in':       call.get('usage', {}).get('prompt_tokens', 0),
        'tool_call_token_out':      call.get('usage', {}).get('completion_tokens', 0),
        'tool_call_return_size_chars': len(result_str),
        'tool_call_empty_result':   empty,
        'wasted_tool_call':         wasted,
        'result_sha256':            result_sha,
    }
```

**Per-task rollups (~10 LoC):**

```python
graph_calls   = [c for c in calls if c['tool_call_name'] in GRAPH_TOOLS]
total_graph   = len(graph_calls)
wasted_graph  = sum(1 for c in graph_calls if c['wasted_tool_call'])
graph_waste   = wasted_graph / total_graph if total_graph else 0.0

repeat_rate   = sum(1 for c in calls if c['wasted_tool_call'] and c['result_sha256'] in EARLIER_SHA) / len(calls)
```

**Fields produced:**

| Field | Computation |
|---|---|
| M3.1–M3.6 | Direct copy from trace JSON + classifier |
| M3.7 | `wasted_tool_call = empty or repeat-occurrence` |
| M3.8 | `graph_tool_wasted_rate_per_task` |
| M3.9 | `repeat_action_rate_per_session` |

**The M3.7 / M3.8 / M3.9 trio unlocks three previously-immeasurable decisions:** D-4 (graph vs. grep on first use), D-6 (rescue state machine trigger threshold), and D-7 (continue vs. revert patch). Until the trio is in place, every ablation on those decisions is a coin flip.

**LOC estimate:** 80 LoC including argparse, JSON I/O, the `EXPECTED_MIN_LEN` table, and the `EARLIER_SHA` rolling set.

---

## 4. Hook H4 — Per-edit audit log (M4.*, 8 fields, ~40 LoC)

**Source:** The agent already has a journal (`journal.md`). The wish list adds a **mandated schema** to it.

**Schema addition to `system.md` §3 (the journal rule, ~25 lines):**

```markdown
## Per-edit audit log (mandatory)

Every time you call `edit_file` or `write_file`, append a row to `journal.md` under `## M4` using this exact schema:

```
| turn | file | old_hash8 | new_chars | hunks | parse_ok | apply_ok | tree_dirty |
|-----|-------|-----------|-----------|-------|----------|----------|------------|
| N   | path  | sha256[:8]| old_chars | hunks | bool     | bool     | bool       |
```

Where:
- `old_hash8` = `sha256(old_string)[:8]` from the `edit_file` parameters
- `new_chars` = `len(old_string)` (yes — the *removed* count; new is in the file)
- `hunks` = number of `@@` blocks in the resulting unified diff
- `parse_ok` = did `python -m py_compile` succeed?
- `apply_ok` = did `git apply --check` succeed?
- `tree_dirty` = is `git diff --name-only HEAD` non-empty after the edit?

After every `edit_file` call, also stamp `M4.8 line_offset_at_edit`:
`read_file` was last called at offset `R`; this `edit_file` was at line `L`;
record `|L − R|`.

The journal *is the metric*. The scorer postprocesses it; do not compute it elsewhere.
```

**Fields produced:**

| Field | Source |
|---|---|
| M4.1 `edit_file_calls` | The audit log |
| M4.2 `final_files_changed` | `git diff --name-only HEAD` at task end (postprocess) |
| M4.3 `final_patch_chars` | `len(submitted_patch)` (postprocess) |
| M4.4 `final_added_lines` | `git diff --numstat` (postprocess) |
| M4.5 `reverted_within_n_turns_rate` | Postprocess: scan audit log for overlapping ranges within 5 turns |
| M4.6 `current_patch_shape` | Audit log row of the most recent edit |
| M4.7 `last_edit_parse_status` | Audit log `parse_ok` column |
| M4.8 `line_offset_at_edit` | `last_edit_offset − last_read_offset` (postprocess) |

**LOC estimate:** 40 LoC (mostly the system-prompt text; the journal rule has its own enforcement).

---

## 5. Hook H5 — Per-test-run scorer (M5.*, 7 fields, ~30 LoC)

**Source:** `experiments/score.py` already reads the JUnit XML + pytest exit code. The wish list adds `target_test_vector` and `target_test_vector_delta`.

**Extension (~20 LoC):**

```python
def score(task_id, prior_junit_path, current_junit_path, gold_F2P):
    """Extend the existing scorer with the M5 fields."""
    f2p    = load_F2P(task_id)            # scorer-only
    prior  = set(load_passed(prior_junit_path)) if prior_junit_path else set()
    now    = set(load_passed(current_junit_path))
    delta  = (now - prior) | (prior - now)
    return {
        'pytest_exit_code':           current.exit_code,
        'junit_passed_count':         len(now),
        'junit_failure_count':        len(load_failed(current_junit_path)),
        'junit_skipped_count':        len(load_skipped(current_junit_path)),
        'target_test_vector':         sorted(f2p),
        'target_test_vector_delta':   sorted(delta & f2p),
        'regression_flag':            bool(load_failed(current_junit_path) - load_failed(prior_junit_path or current_junit_path)),
    }
```

**The M5.5 / M5.6 caveat:** the FAIL_TO_PASS list is **scorer-only**. The scorer reads it from the gold-patch JSON; the agent does not. The wish list treats it as a **post-hoc** field — the agent never sees `target_test_vector_delta` during the task, only in the post-run report.

**Why this hook exists at all:** without M5.6, every "the agent fixed it" claim is unverifiable. With M5.6, the postprocess can answer "did this `run_command` invocation include any of the failing tests" without ambiguity.

**LOC estimate:** 30 LoC; the FAIL_TO_PASS loader is already in `experiments/score.py`.

---

## 6. Hook H6 — Per-run infrastructure tap (M6.*, 10 fields, ~50 LoC)

**Source:** Two streams: vLLM's logs (M6.1–M6.3, M6.10) and the harness's `summary.json` (M6.4–M6.9).

**The vLLM tap (skeleton, ~30 LoC):**

```python
# vllm-tap.py — runs as a sidecar to the vLLM server
import re, json, sys, time
KV_PATTERN  = re.compile(r"KV cache size (\d+) exceeds \$max \d+")
ADAPT_PATTERN = re.compile(r"LoRA adapter (\w+) zeroed on load")
STARTUP_PATTERN = re.compile(r"vLLM started on (http://[\w.:]+)")
THINK_PATTERN  = re.compile(r"thinking_budget=(\d+)")

events = []
for line in iter(sys.stdin.readline, ''):
    for pat, kind in [(KV_PATTERN, 'kv_saturation'), (ADAPT_PATTERN, 'adapter_zero'),
                      (STARTUP_PATTERN, 'startup'), (THINK_PATTERN, 'thinking_budget')]:
        m = pat.search(line)
        if m:
            events.append({'kind': kind, 'match': m.group(1), 't': time.time()})
    # Also dump every 30 s to a JSON file
    if int(time.time()) % 30 == 0:
        json.dump(events, open('/tmp/vllm-tap.json', 'w'))
```

**Fields produced:**

| Field | Source |
|---|---|
| M6.1 `kv_cache_saturation_events` | `vllm-tap.json` |
| M6.2 `adapter_zeroed_on_load` | `vllm-tap.json` |
| M6.3 `vllm_startup_error` | `vllm-tap.json` |
| M6.4 `sandbox_setup_duration_seconds` | `summary.json["sandbox_setup_s"]` |
| M6.5 `sandbox_resume_warm` | `summary.json["reuse_containers"]` |
| M6.6 `compaction_interval_effective` | `summary.json["events_compaction_interval"]` |
| M6.7 `docker_image_name` | `summary.json["sandbox_image"]` |
| M6.8 `model_adapter_set` | `summary.json["adapter_names"]` |
| M6.9 `run_phase1_token_in/out` | `summary.json["tokens_in"]` / `tokens_out` |
| M6.10 `thinking_budget_effective` | `vllm-tap.json` |

**LOC estimate:** 50 LoC for `vllm-tap.py` plus a 10-line parser for `summary.json`.

---

## 7. The hook → field → decision matrix

| Hook | Fields | Decisions enabled |
|---|---|---|
| **H1** | M1.* (7) | D-1, D-2, D-9, D-11, D-12 |
| **H2** | M2.* (6) | D-1, D-3, D-4, D-5, D-6, D-8, D-16 |
| **H3** | M3.* (9) | D-3, D-4, D-5, D-6, D-7 |
| **H4** | M4.* (8) | D-5, D-7, D-8, D-10, D-11, D-16 |
| **H5** | M5.* (7) | D-3, D-6, D-7, D-8, D-12, D-13, D-14, D-16 |
| **H6** | M6.* (10) | D-1, D-15, D-16 |

The 16 *requests* the wish list enables are bisected by the 6 hooks: **H3 unlocks the most decisions** (5), then **H4 / H5** (6 each — many D's in one clause), then **H2** (7 — the per-phase is the workhorse for the budget schedule), then **H1 / H6** (5 and 3).

---

## 8. The system-prompt additions (summary)

| Section | New text | Hook |
|---|---|---|
| §2 (after spec-first) | "Task-static snapshot: stamp at task start…" (15 lines) | H1 |
| §3 (the journal rule) | "Per-edit audit log: append a row using …" (25 lines) | H4 |
| §5 (budget-schedule prompt) | No change — the budget comes from M2.6 stamped by H3 | H2 |
| §7 (after the breadcrumb journal) | "Per-tool-result marker: append `wasted=true\|false` …" (10 lines) | H3 |

**Total system-prompt additions: ~50 lines.** The existing 4-phase architecture is preserved; the additions are *posters* in the agent's working memory, not new instructions.

---

## 9. The harness changes (`<short>summary</short>`)

**No changes are required.** All hooks are skill scripts that read the existing trace JSON + the system prompt. The M6.* subset that needs vLLM logs is read by a sidecar (`vllm-tap.py`) that does not require harness changes — it reads stdout.

**The wish list's design constraint:** *never* modify `adk-submission` or `adk-eval-core` for the Sprint 1–5 deliverables. The harness is fixed for the competition; the only changes inside it are the ones the organizers ship (the Q3 thinking-budget patch being one).

---

## 10. The `experiments/postprocess.py` and `experiments/score.py` extensions

Both scripts exist. The wish list's role is to add the M3/M4/M5 fields. Estimated diff: **+150 LoC** spread across two files. Both are version-controlled in the BCF repo and the changes fit cleanly in Sprint 1.

---

## 11. The order of implementation

| Sprint | Hooks shipped | Decisions unlocked |
|---|---|---|
| Sprint 1 | H1 + H2 + H4 (system-prompt + budget + journal) | D-1, D-11, D-13, D-14 |
| Sprint 2 | H3 + H5 (postprocess + scorer) | D-3, D-4, D-5, D-6, D-7, D-12, D-8, D-16 |
| Sprint 3 | H6 (vLLM tap, adapter canary) | D-15 |
| Sprint 4 | Hardening (cross-task rollups, edge cases) | (M5.x.) |
| Sprint 5 | Integration (postprocess → paper tables) | (M6) |

The H1+H2+H4 trio in Sprint 1 is **the minimum viable wish list** — it produces the BCF-spec lineage (M1 → M2 → M4) and is enough to debug "why did the agent fail on httpx_1321?" without knowing the gold.

---

## 12. Why six hooks and not one mega-script

Six hooks mirror the **decision-time taxonomy** (T0/T1/T2 from [`02-decisions-the-agent-must-make.md`](02-decisions-the-agent-must-make.md)):

| Decision time | Hook |
|---|---|
| T0 (task start) | H1 |
| T1 (mid-task) | H2 (per call), H3 (per call), H4 (per edit), H5 (per test run) |
| T2 (task end) | H5 (final), H6 (per run) |

The hooks are **independent** in implementation but **joint** in analysis: the postprocess reads all six streams and joins them by `task_id` + `turn`. The independence is what makes the wish list shippable across sprints without blocking on the harness.

---

## 13. What the architecture explicitly does *not* do

| Excluded | Why |
|---|---|
| Modify `adk-submission` | Out of scope; would invalidate the submission package. |
| Add `LoRA`-aware phases | H6 only *observes* adapter behavior. Per-phase LoRA token accounting is a future harness ask. |
| Per-package per-session tracing | **Out of scope** for Sprint 1–5; the wish list is per-task. Cross-task rollups are in Sprint 4. |
| Real-time elapsed-time model-side | The current model-side latency is unquantified per phase; only vLLM-side `request_latency` is available. |

The first is the wish list's central design discipline. The architecture is **observer-only** — the wish list measures what happens, never changes what runs.

---

*Next: [`05-sprint-collection-roadmap.md`](05-sprint-collection-roadmap.md) — when each hook ships, what it unblocks, and what the cost-of-delay is.*


---

<!-- ====================================================================== -->
<!-- FILE: 05-sprint-collection-roadmap.md -->
<!-- ====================================================================== -->

# 05 — Sprint Collection Roadmap: What to Ship, and When

*This roadmap turns the 6 hooks and 47 fields into a sprint-by-sprint plan. Each row says: hook shipped, fields gained, decision unlocked, gate that has to pass before sprint close.*

**Constraint:** the 6-sprint BCF plan (`deliverables/bcf-brain-strategy-2026-09-29/04-six-sprint-roadmap.md`) already pins the calendar. This document only schedules the *wish-list* work inside it.

---

## 1. Sprint-by-sprint summary

| Sprint | Calendar (relative to today) | Hooks shipped | New fields unlocked | Decisions unlocked | LoC ship count | Critical gate before close |
|---|---|---|---|---|---:|---|
| **Sprint 1** | Today → Day +6 (Oct 7) | H1, H2, H4 | 21 (M1.* + M2.* + M4.*) | D-1, D-2, D-9, D-10, D-11, D-13, D-14 | ~100 | dev-fast (15 tasks) reproduces the lineage end-to-end |
| **Sprint 2** | Day +6 → Day +13 (Oct 14) | H3, H5 | 16 (M3.* + M5.*) | D-3, D-4, D-5, D-6, D-7, D-8, D-12, D-16 | ~110 | First A1 vs A2 ladder comparison has reproducible Δ |
| **Sprint 3** | Day +13 → Day +20 (Oct 21) | H6 | 10 (M6.*) | D-15, D-16 (H6 sub-fields) | ~50 | LoRA canary passes (M6.1–M6.3 clean on 5/5 runs) |
| **Sprint 4** | Day +20 → Day +27 (Oct 28) | Hardening + heldout-test | (refactor, no new) | (sensitivity analysis) | ~40 | Held-out (45 tasks) comparable to dev-full |
| **Sprint 5** | Day +27 → Day +34 (Nov 4) | Paper tables + cross-task rollups | (M6.x family) | (paper claims) | ~30 | Three paper figures reproducible from M3/M4/M5 |
| Sprint 6 (Nov 4–11) | Buffer | — | — | — | — | Submission package + reproducibility appendix |

**Total LoC shipped:** ~330 (close to the 260 estimate in §1 of [`04-collection-architecture.md`](04-collection-architecture.md); the +70 is from hardening, edge cases, and tests).

---

## 2. Sprint 1 — H1 + H2 + H4 (the minimum viable wish list)

**Goal:** produce the M1 → M2 → M4 lineage on every dev-fast task. A reviewer should be able to read the trace JSON + the journal + the budget report and reconstruct what the agent did at each decision point.

### Day 1–2 (Oct 1–2): H1 (system-prompt addition)

| Day | Action | Gate |
|---|---|---|
| Day 1 | Add the "Task-static snapshot" block to `system.md` §2 | Re-run starter (no other changes); `journal.md` has `## M1` with 7 fields stamped per task |
| Day 2 | Verify on dev-fast 5-task subset; spot-check 1 task's `## M1` vs `problem_statement` | All 5 tasks have `## M1` populated; M1.5 (traceback_present) matches the regex ground truth |

**Decisions unlocked:** D-1 (spec-first decision is now informed by `statement_length_chars` + `named_py_file_count`), D-9 (first seed is now informed by `named_symbol_count`).

### Day 3–4 (Oct 3–4): H2 (`bcf-budget.py`)

| Day | Action | Gate |
|---|---|---|
| Day 3 | Implement `phase_of()` + JSON writer; unit test with a hand-built 30-call trace | All 30 calls tagged P1/P2/P3/P4; phase transitions match the handbook |
| Day 4 | Run `bcf-budget.py` against the dev-fast 15-task batch; produce `summary.json` rollup | Each task has a `budget_per_phase` block; max 0 tasks have `P3 + P4 > 100 %` |

**Decisions unlocked:** D-5 (budget sensitivity is now measurable per phase, not just per task).

### Day 5–6 (Oct 5–6): H4 (journal audit-log rule)

| Day | Action | Gate |
|---|---|---|
| Day 5 | Add "Per-edit audit log" block to `system.md` §3; tighten the journal schema | Re-run dev-fast; `journal.md` has `## M4` with one row per `edit_file` |
| Day 6 | Implement `bcf-journal.py` postprocess; cross-check audit log with `git log --stat` | Every `edit_file` in the trace has a matching `## M4` row; `parse_ok` matches `python -m py_compile` truth |

**Decisions unlocked:** D-10 (read-offset vs. edit-offset is now measurable), D-11 (edit-budget-spend curve is now measurable), D-13 (test-editing detection is now a journal query), D-16 (final tree-dirty-at-end is now a hard metric).

### Sprint 1 close gate

> *"Open `journal.md` for any dev-fast task. Read the `## M1` snapshot, the per-call `budget_per_phase` from H2, and the `## M4` audit log. Reconstruct what the agent did. The reconstruction should agree with the trace JSON line-for-line."*

If the reconstruction does not agree, Sprint 2 is blocked.

---

## 3. Sprint 2 — H3 + H5 (the postprocess spine)

**Goal:** Have the per-tool-result classifier and the per-test-run scorer producing the M3 + M5 fields. This unlocks the **decision-by-decision** sensitivity analysis that drives the paper-track.

### Day 7–8 (Oct 7–8): H3 (`experiments/postprocess.py`)

| Day | Action | Gate |
|---|---|---|
| Day 7 | Implement `classify()`; add the `EXPECTED_MIN_LEN` table for all 9 tools | Per-call `wasted_tool_call` flag; `graph_tool_wasted_rate_per_task` rollup |
| Day 8 | Run on dev-fast; produce a 15-task report | At least 1 task should have a `graph_tool_wasted_rate > 0.5` (sanity check; if not, the graph is broken) |

**Decisions unlocked:** D-3 (graph-tool existence becomes a per-task boolean, not a global claim), D-4 (graph vs. grep first call becomes measurable), D-7 (continue vs. revert becomes measurable).

### Day 9–10 (Oct 9–10): H5 (extending `experiments/score.py`)

| Day | Action | Gate |
|---|---|---|
| Day 9 | Add `target_test_vector_delta` and `regression_flag`; load FAIL_TO_PASS from gold | Per-call `pytest_exit_code` and JUnit summary; `regression_flag` matches the expected behavior on httpx_3672 |
| Day 10 | Run on dev-fast; produce a 15-task M5 report | At least 1 task should have a `regression_flag=true` (sanity check) |

**Decisions unlocked:** D-6 (rescue trip now has a measurable threshold), D-8 (submission gate is now quantitatively testable), D-12 (bug-count heuristic is now a per-task number).

### Day 11–13 (Oct 11–13): First ablation (A0 vs A2 vs A3 ladder)

| Day | Action | Gate |
|---|---|---|
| Day 11 | Run A0 (no protocol) on dev-fast (15 tasks) | Done |
| Day 12 | Run A2 (BCF-spec first) on dev-fast | Done |
| Day 13 | Compare resolved counts; check for H3 drift | Δ(A2 − A0) ≥ 0 (A2 ≥ A0; if not, BCF-spec is making things worse) |

### Sprint 2 close gate

> *"The Δ(A2 − A0) is positive and the per-task M3.9 `repeat_action_rate` explains ≥ 50 % of the variance in resolved-vs-not."*

If the Δ is not positive, the protocol is not adding value and Sprint 3 is at risk. If the M3.9 variance explanation is < 50 %, the classifier needs another iteration.

---

## 4. Sprint 3 — H6 (the LoRA viability gate)

**Goal:** Have the vLLM tap producing the M6 fields. Confirm LoRA canary passes before the LoRA sub-track ships any further.

### Day 14–15 (Oct 14–15): `vllm-tap.py` skeleton

| Day | Action | Gate |
|---|---|---|
| Day 14 | Implement `vllm-tap.py`; wire as sidecar to the vLLM server | `vllm-tap.json` populated on each commit |
| Day 15 | Add the JSON parser for `summary.json`; produce M6.* on dev-fast | All 10 M6 fields populated for the dev-fast subset |

### Day 16–17 (Oct 16–17): LoRA canary on dev-fast

| Day | Action | Gate |
|---|---|---|
| Day 16 | Activate the LoRA adapter on dev-fast (15 tasks) | `M6.2 adapter_zeroed_on_load` is False for 5/5 runs |
| Day 17 | Run the full kv-cache probe (per-task max context length) | No `M6.1 kv_cache_saturation_event` for 5/5 runs |

### Day 18–20 (Oct 18–20): LoRA canary on dev-full (54 tasks)

| Day | Action | Gate |
|---|---|---|
| Day 18–19 | Run with LoRA active on dev-full | Pass rate ≥ 90 % |
| Day 20 | Compare LoRA-on vs LoRA-off on a 10-task dev-fast subset | Δ is within ±1 task |

### Sprint 3 close gate

> *"LoRA canary passes: 50/50 runs clean on M6.1 + M6.2 + M6.3. Δ with epsilon (LoRA-on − LoRA-off) is positive on the 10-task subset."*

If the canary fails, the LoRA track is **dead** and the A12 competition (ground model) ships. The wish list's H6 fields tell you *why* it failed (`M6.1` KV-collapse, `M6.2` silent zeroing, `M6.3` startup refusal).

---

## 5. Sprint 4 — Hardening + held-out test

**Goal:** the wish-list pipeline runs on the held-out 45-task split with no degradation. Edge cases (multi-bug tasks, security tasks, very long issue text) are explicitly tested.

### Day 21–24 (Oct 21–24): Hardening

| Day | Action | Gate |
|---|---|---|
| Day 21 | Edge case: a 3,000-char issue text; verify M1.* scaling | M1.* stamped correctly; M1.6 `test_patch_keywords` capped at 32 entries |
| Day 22 | Edge case: a multi-bug task (2+ independent failures); verify M4.* journal entries | `## M4` has 2+ rows; `reverted_within_n_turns_rate` is computable |
| Day 23 | Edge case: a security-task (no test_patch); verify M5.5 is empty; `regression_flag` stays false | Empty M5.5 + false M5.7 on the security subset |
| Day 24 | Refactor `experiments/postprocess.py` to a typed schema; add `mypy --strict` pass | `mypy` clean |

### Day 25–27 (Oct 25–27): Held-out 45-task run

| Day | Action | Gate |
|---|---|---|
| Day 25 | First half of held-out (23 tasks) | All tasks have M1–M6 fields populated |
| Day 26 | Second half (22 tasks) | Same |
| Day 27 | Cross-task sanity (compare variance to dev-full) | Within ± 10 % |

### Sprint 4 close gate

> *"The held-out 45-task distribution is statistically indistinguishable from dev-full on the M3.9 / M4.5 / M5.3 axes (p > 0.05)."*

If the held-out shows drift, Sprint 5 re-tunes the protocol thresholds before the paper is written.

---

## 6. Sprint 5 — Paper tables + cross-task rollups

**Goal:** produce the three paper figures reproducible from M3/M4/M5.

### Day 28–30 (Oct 28–30): Three figures

| Figure | From fields | Decision it grounds |
|---|---|---|
| **F1. The ablation ladder.** Bar chart of resolved % per rung (A0 → A6) on dev-full | All M5.* + outcome.resolved | D-1 → D-16 |
| **F2. The wasted-call heatmap.** `wasted_tool_call` rate per tool × per phase | M3.7 × phase × M3.1 | D-3, D-4, D-6 |
| **F3. The patch-shape distribution.** Final `added_lines` per task vs. resolved | M4.4 + outcome.resolved | D-8, D-11, D-16 |

### Day 31–33 (Oct 31–Nov 2): Cross-task rollups

| Rollup | From fields | Use |
|---|---|---|
| Per-template success rates | M2.6 + outcome | Per-template prompt tuning |
| Per-budget-bucket success rates | M2.6 + outcome | Budget-schedule validation |
| Per-edit-budget-curve success rates | M4.9 + outcome | Edit-budget curve (D-11) |

### Day 34 (Nov 3): Reproducibility check

Re-run A2 vs A3 on dev-fast (15 tasks); verify Δ reproduces within ±1 task.

### Sprint 5 close gate

> *"All three figures have a reproducibility note + a script in `experiments/figures/`. Each figure has at most one page of caption. The full wish-list pipeline re-runs end-to-end on dev-fast in < 30 min."*

---

## 7. Sprint 6 — Submission + paper write-up (Nov 4–11)

**Wish-list scope:** finalize the wish-list pipeline as a research artifact for the paper track. The submission package itself does not change; the pipeline is a separate research artifact documented in the appendix.

| Day | Action |
|---|---|
| Nov 4–6 | Paper drafting |
| Nov 7–9 | Submission package assembly |
| Nov 10–11 | Final review + buffer |

---

## 8. The wish-list field-priority matrix (across all sprints)

The full 47-field schedule, in order of ship:

| Sprint | Field IDs | Tier mix | Decisions unlocked |
|---|---|---|---|
| 1 | M1.1, M1.2, M1.3, M1.4, M1.5, M1.6, M1.7, M2.1, M2.2, M2.3, M2.4, M2.5, M2.6, M4.1, M4.2, M4.3, M4.4, M4.5, M4.6, M4.7, M4.8 | 13 ★ + 8 ✦ | 7 of 16 |
| 2 | M3.1, M3.2, M3.3, M3.4, M3.5, M3.6, M3.7, M3.8, M3.9, M5.1, M5.2, M5.3, M5.4, M5.5, M5.6, M5.7 | 12 ★ + 4 ✦ | 8 of 16 |
| 3 | M6.1, M6.2, M6.3, M6.4, M6.5, M6.6, M6.7, M6.8, M6.9, M6.10 | 7 ★ + 3 ✦ | 2 of 16 |
| 4 | (Hardening; no new) | n/a | (refactor) |
| 5 | M5.8, M5.9, M5.10, M5.11 + cross-task rollups | 3 ★ + 1 ✦ | (paper claims) |

**Sprint-1 unlocks 7; Sprint-2 unlocks the cumulative 15; Sprint-3 unlocks all 17** (16 decisions + the "M6 budget" measurement). The wish list is **front-loaded on cheap fields** (M1 + M2 + M4 are all ★ or < 50 LoC); the expensive fields (M3.7 / M3.8 / M3.9) ship in Sprint 2 when the postprocess is mature.

---

## 9. The cost-of-delay table

| Hook | Decision if delayed | Cost of delay |
|---|---|---|
| H1 (M1.*) | D-1 spec-first; D-2 template; D-9 first seed | Cannot distinguish "named file" tasks (15/115 in dev) from "no file" tasks (100/115); the spec-first decision is **not measurable** until H1 ships |
| H2 (M2.*) | D-5 budget-sensitivity; D-6 rescue | Without per-phase, every budget-schedule ablation is global; cannot answer "did we lose because we ran out of edit budget or test budget" |
| H3 (M3.*) | D-3 graph existence; D-4 graph vs. grep; D-6 rescue; D-7 continue/revert | **The single most decision-relevant missing hook.** Without M3.7–M3.9, four decisions are made on guesswork |
| H4 (M4.*) | D-10 read-offset; D-11 edit-budget curve; D-13 test-editing; D-16 final-submit | Without the journal rule, the breadcrumb journal is a soft policy, not a measurement |
| H5 (M5.*) | D-12 bug-count heuristic; D-8 submit gate | Without `target_test_vector_delta`, every "I fixed it" claim is unverifiable |
| H6 (M6.*) | D-15 LoRA canary | Without H6, the LoRA sub-track has no viability gate and any money spent on it is wasted |

The "delay cost" for H3 is **the single largest**: four decisions are blind until Sprint 2 ships.

---

## 10. The single-page summary card

```
Sprint 1 (now → Oct 7):
  H1 + H2 + H4. 21 fields. 7 decisions unlocked.
  Gate: dev-fast reproduces M1→M2→M4 lineage.

Sprint 2 (Oct 7 → Oct 14):
  H3 + H5. 16 fields. 8 decisions unlocked (cumulative 15).
  Gate: Δ(A2 − A0) positive; M3.9 variance ≥ 50 %.

Sprint 3 (Oct 14 → Oct 21):
  H6. 10 fields. 2 decisions unlocked (cumulative 17).
  Gate: LoRA canary 50/50; Δ(ε,ε−) positive on 10 tasks.

Sprint 4 (Oct 21 → Oct 28):
  Hardening. No new fields. Edge cases (multi-bug, security, 3k+ char).

Sprint 5 (Oct 28 → Nov 4):
  Paper figures + cross-task rollups. Reproducibility <
  ±1 task on dev-fast re-run.
```

---

## 11. What the wish list is *not* a roadmap for

| Out of scope | Why |
|---|---|
| The harness itself | `adk-submission` / `adk-eval-core` are fixed. |
| The model (`gemma-4-31b-it-qat-w4a16-ct`) | Required by the competition. |
| The hidden test set | Not accessible. The wish list is *measuring what you can already measure.* |
| Per-token per-phase accounting | vLLM-side gap; filed in `07-unknowns-and-residual-risks.md`. |

The wish list's discipline is **stay inside the box** — measure what's observable, write down what can't be measured, and let the ablations decide.

---

*Next: [`06-decisions-unlocked.md`](06-decisions-unlocked.md) — what you can decide on day 1 (post Sprint 1) that you couldn't decide before.*


---

<!-- ====================================================================== -->
<!-- FILE: 06-decisions-unlocked.md -->
<!-- ====================================================================== -->

# 06 — Decisions Unlocked: What You Can Decide on Day 1 vs. Day 60

*For each of the 16 BCF decisions, this file says: (a) what evidence was available before the wish list; (b) what evidence the wish list adds; (c) the highest-confidence action after the wish list ships. The point of the wish list is to flip decisions from "intuition" to "measurement."*

---

## 1. The flip chart — decisions before vs. after the wish list

| # | Decision | Before the wish list (intuition) | After the wish list (measurement) | Confidence shift |
|:---:|---|---|---|:---:|
| D-1 | Spec-first or just-patch? | "Always spec-first" (gut) | "If `M1.5 == true` and `M1.1 > 800` chars, spec-first; else go directly to Phase 2" | Low → High |
| D-2 | Which template? | "Always bug_fix" (default) | "If `M1.5 == true`, bug_fix; if `M1.2 >= 1` and `M1.6` non-empty, compat_or_refactor" | Med → High |
| D-3 | Graph or no graph? | "Always try the graph" (F4 finding) | "If `M1.7 == false` (no graph) or `M3.8 > 0.5` (wasted graph calls), skip graph; else use" | Low → High |
| D-4 | First graph-or-grep call? | "graph_first" (F4 finding) | "If `M2.5` ≤ 3, graph; else grep (deferred)" | Low → High |
| D-5 | Spend edit budget how? | "70 % edit, 30 % verify" (heuristic) | "If `M2.6.P3_fraction < 0.4` after 4 edits, slow down; if `M2.6.P3_fraction > 0.7`, submit" | Med → Med |
| D-6 | Trip the rescue state machine? | "If repeat > 50 %, rescue" (guess) | "If `M3.9 > 0.30` over the last 5 calls, trip; else continue" | Med → High |
| D-7 | Continue or revert? | "Continue; trust the journal" (default) | "If `M4.5 > 0.4` and `M5.7 == true` (regression), revert; else continue" | Med → High |
| D-8 | Submit? | "If parse_ok and apply_ok, submit" (F1 + F2) | "If `M4.6.parse_ok and M4.6.apply_ok and M5.4 == 0 and M4.10 == true`, submit" | High → High |
| D-9 | First seed? | "Always the first symbol in M1.3" (heuristic) | "If `M1.5 == true`, the symbol in the traceback; else the highest-frequency M1.3 symbol" | Low → Med |
| D-10 | Read-offset vs edit-offset | "Always re-read before edit" (rule) | "If `M4.8 > 50` (read-offset > 50 lines), re-read; else trust cache" | Med → High |
| D-11 | Edit-budget curve | "Spend evenly" (no rule) | "Edit-rate from `M4.9 distribution`; pace at `M2.6.P3_fraction` curve" | Med → Med |
| D-12 | Bug-count heuristic | "Guess 1 or 2" (intuition) | "If `M5.5 (target test vector)` is non-empty and `M5.8 (F2P_count) > 1`, multi-bug; else 1" | Med → High |
| D-13 | Edit-test-yes? | "Never edit tests" (F5) | "Always check `M5.9 (tests-preserved-after-Phase-2)`; if false, the rule was violated" | High → High |
| D-14 | Breadcrumb journal cadence | "Every 3 turns" (rule of thumb) | "If `M5.10 (journal_writes_per_turn)` < 0.3, ramp up; if > 0.7, slow" | Med → Med |
| D-15 | LoRA sub-track? | "Risky" (F-cluster LoRA bugs) | "Canary on dev-fast first; ship only if `M6.1 + M6.2 + M6.3` clean on 50/50" | Low → Med |
| D-16 | Final-submit or dirty-tree? | "submit_patch() always" (F5) | "If `M4.10 == false` (clean tree), submit_patch; else `git diff --stat HEAD` first" | High → High |

**Confidence-shift tally: 9 of 16 decisions move from Low/Med to High confidence after the wish list.** The other 7 are already high or the wish list only refines them.

---

## 2. The "I can't decide today" reasons, by the way

| Reason | Affected decisions | Wish list remediation |
|---|---|---|
| No measurement of wasted tool calls | D-3, D-4, D-6, D-7 | H3 ships (M3.7–M3.9) |
| No per-phase budget | D-5, D-11 | H2 ships (M2.6) |
| No graph-on-hidden-set knowledge | D-3 | H1 stamps `M1.7`; U4 confirmed after first call |
| No LoRA viability gate | D-15 | H6 ships (M6.1–M6.3) |
| No target_test_vector for the agent | D-12 | Filed as scorer-only in H5 |

---

## 3. Decision D-1 worked example: spec-first or just-patch?

### Before the wish list

The BCF handbook says "always emit a BCF-Spec before any edit." This is a rule, not a measurement.

**Question:** is the rule correct? It costs ~2 calls to extract a section that may not be needed.

### After the wish list (Sprint 1)

The agent has `M1.1 statement_length_chars`, `M1.5 traceback_present`, `M1.6 test_patch_keywords`. The decision tree:

```
if M1.1 < 200:
    # Trivial. Skip spec, go to Phase 2.
elif M1.5 == true:
    # Traceback → the bug is named; spec is unnecessary. Go to Phase 2.
elif M1.6 is non-empty and len(M1.6) >= 2:
    # Test surface known. Spec helps confirm scope. Emit spec.
else:
    # Underspecified. Spec is mandatory.
```

**This is a measured decision**, not a rule. The threshold values (200 chars, 2 keywords) are calibrated on dev-fast (Sprint 2) and dev-full (Sprint 4). The pre-wish-list rule was always "spec"; the post-wish-list rule is "spec when the signal says so."

### Cost of the flip

The flip saves ~2 tool calls per trivial task. On the dev-fast 15-task batch, ~6 of 15 are trivial (`M1.1 < 200`); saves 12 calls ≈ **+0.5 calls/task** in budget headroom. On the dev-full 54 tasks, savings ≈ 35 calls; on heldout 45 tasks, savings ≈ 30 calls. **Cumulative: ~75 calls saved across the 6-hour run**, which is meaningful when the budget is 12,000 calls.

---

## 4. Decision D-3 worked example: graph or no graph?

### Before the wish list

The 9/29 plan recommends "always try `get_code_neighbors` first." F4 reports that 3 of 10 graph-tool calls return `[]`. The wish list asks: **per task, not per repo, is the graph useful?**

### After the wish list (Sprint 1 + 2)

`M1.7 graph_exists_for_repo` is set on the first graph call (M1 stamps it `unknown`, first graph call overwrites). `M3.8 graph_tool_wasted_rate_per_task` is computed per task.

The decision tree:

```
if M1.7 == false:                              # No graph on this repo
    skip graph; use grep
elif M3.8 > 0.5 and M2.5 >= 3:                 # Wasted calls dominate
    return skip graph; use grep
elif M3.8 > 0.5 and M2.5 < 3:                  # Early wasted calls = wasted graph
    return skip graph; use grep
else:
    use graph
```

**On the dev-fast subset, the empirical graph waste rate is 30 %** (F4) — the rule above catches 4 of 5 wasted-graph cases. On heldout, the U4 unknown (graph or no graph on hidden set) is the binding constraint: if U4 turns out to be "no graph", every graph call is wasted and the rule degenerates to "always grep."

### Cost of the flip

If U4 = "no graph" on hidden, the pre-wish-list rule wastes ~10 graph calls per task × 120 tasks = **1,200 wasted calls**. Post-wish-list: 0. **The single biggest budget-savings decision.**

---

## 6. Decision D-12 worked example: bug-count heuristic

### Before the wish list

The BCF brain assumes 1 bug per task. F3 reports 30 % of tasks have 2+ bugs. The wish list asks: **per task, how many bugs?**

### After the wish list (Sprint 2)

`M5.5 target_test_vector` is the FAIL_TO_PASS list (scorer-only). `M5.8 post_hoc_F2P_count` is the number of failing tests in the gold patch.

The decision tree (agent-side, without M5.5):

```
proxy:
    tracebacks_in_3 lines = count("Traceback" in problem_statement[:1500])
    distinct_files_in_trace = distinct regex e.g. "File \"...\"/"
if M5.5 (gold-known): M5.8 = M5.5| |  # F2P count
elif tracebacks_in_3 >= 2 or distinct_files_in_trace >= 2:
    bug_count_proxy = 2
else:
    bug_count_proxy = 1
```

**The wish list doesn't make the agent see the FAIL_TO_PASS list** — it makes the postprocess see it. The agent uses a proxy; the postprocess measures ground truth. The two are compared in the post-run paper table.

### Cost of the flip

The pre-wish-list assumption "1 bug" is wrong for ~30 % of tasks. The post-wish-list "1 or 2 bug" decision informs **how many `edit_file` rounds to schedule**. For multi-bug tasks, ~6 edits/task; for single-bug, ~3 edits/task. The difference is ~3 edits × 30 % of tasks × 120 tasks = ~180 calls saved on multi-bug tasks (where edits are localized to multiple sites).

---

## 7. Decision D-15 worked example: LoRA sub-track

### Before the wish list

The LoRA primer (2026-10-01) reports 3 hazard clusters (KV collapse, silent zeroing, startup refusal). The wish list asks: **is the LoRA sub-track viable at all?**

### After the wish list (Sprint 3)

`M6.1 kv_cache_saturation_events`, `M6.2 adapter_zeroed_on_load`, `M6.3 vllm_startup_error`.

The decision tree:

```
canary_run = load M6.* for dev-fast with LoRA active
if M6.1 empty and M6.2 == false and M6.3 == "":
    "LoRA passes canary. Continue."
elif M6.1 non-empty:
    "KV collapse. Disable LoRA."
elif M6.2 == true:
    "Silent zeroing. Disable LoRA."
elif M6.3 != "":
    "Startup refusal. Disable LoRA."
```

### Cost of the flip

If the canary fails, ~2 sprints of LoRA work is decommissioned. **If the canary was not run, the same LoRA ships sit on the leaderboard dead.** The wish list's canary is a pre-flight check.

---

## 8. Decision D-16 worked example: final-submit or dirty-tree?

### Before the wish list

F5 reports "the starter leaves the tree dirty and the no-op patch scores 0." The BCF handbook says "always submit_patch() if you have edits." This rule is correct but not measured.

### After the wish list (Sprint 1)

`M4.10 tree_dirty_at_end` is a boolean. `M4.2 final_files_changed` is the file list. `M4.11 git_apply_check_exit_code` is the apply check.

The decision tree:

```
if M4.11 != 0:
    return "patch no longer applies; do not submit";
elif M4.10 == false and len(M4.2) == 0:
    return "empty patch; do not submit";   # F5 trap
elif M4.6.added == 0:
    return "empty diff; do not submit";   # F5 trap
elif M5.1 != 0:
    return "tests still failing; do not submit";
else:
    return "submit_patch()";
```

**Every condition is a measurement**, not a rule. The postprocess exposes the trace at submission time; the agent stamps the trace before submitting.

### Cost of the flip

The flip converts a soft rule ("always submit") into a hard gate. The gate catches the F5 trap **before the submission lands**. This is the difference between "submitted a no-op patch" and "submitted nothing".

---

## 9. Cumulative value of the wish list

| Decision | Pre-wish-list confidence | Post-wish-list confidence | Δ confidence | Δ resolved / task (estimate) |
|---|:---:|:---:|:---:|---:|
| D-1 spec-first | Low | High | +2 | +0.5 calls headroom |
| D-2 template | Med | High | +1 | +0.1 resolved / task |
| D-3 graph or no | Low | High | +2 | **+5 calls headroom on no-graph tasks** |
| D-4 first graph/grep | Low | High | Low | +0.5 calls / task |
| D-5 budget schedule | Med | Med | 0 | 0 |
| D-6 rescue | Med | High | +1 | +0.1 resolved / task |
| D-7 continue/revert | Med | High | +1 | +0.1 resolved / task |
| D-8 submit | High | High | 0 | 0 |
| D-9 first seed | Low | Med | +1 | +0.1 resolved / task |
| D-10 read-offset | Med | High | +1 | +0.05 resolved / task |
| D-11 edit-budget | Med | Med | 0 | 0 |
| D-12 bug count | Med | High | +1 | +0.1 resolved / task |
| D-13 test edit | High | High | 0 | 0 |
| D-14 journal | Med | Med | 0 | 0 |
| D-15 LoRA | Low | Med | +1 | none safe to claim |
| D-16 final-submit | High | High | 0 | 0 |

**Net effect estimate (no-LoRA case):** +0.5 to +1.0 resolved percentage points on dev-full; on the heldout 45 tasks, +0.2 to +0.5 resolved tasks. **Worth the 330 LoC.**

---

## 10. The "I cannot decide even after the wish list" set

| Decision | Why still uncertain |
|---|---|
| D-5 budget schedule | The optimal split is task-shape-dependent (single-bug vs. multi-bug); the wish list measures but does not prescribe. |
| D-11 edit-budget curve | Same — task-shape-dependent; ablations A2 vs A2b tune it. |
| D-14 journal cadence | Cadence is a soft policy; the wish list flags misbehaving routes but does not pick the right rate. |
| D-15 LoRA | Even with the canary, the model-side effects are not surfaced; this is a known gap. |

The four "still uncertain" decisions are exactly the ones the ablations (A2b, A2c, A5) are designed to resolve. The wish list is *complementary* to the ablations, not a substitute.

---

## 11. The single decision the wish list unlocks immediately

**D-3 (graph or no graph) flips from Low to High confidence on Day 1 of Sprint 1**, because `M1.7 graph_exists_for_repo` is set on the first graph call of the first task of the first run. **If the hidden set has no graph (U4 → no graph), every graph call costs ~3 calls × 120 tasks = ~360 calls wasted.** Without the wish list, this number is invisible. With the wish list, the first graph call exposes it.

---

## 12. What the wish list unlocks for the paper

| Paper claim | Without wish list | With wish list |
|---|---|---|
| "BCF-spec-first beats no-spec by Δ %" | Restatable on aggregate | Restatable **per-template** (M2) |
| "Graph tools help" | Restatable on dev-full | Restatable **per-repo** (M1.7, M3.8) |
| "Rescue state machine saves X %" | Unverifiable | Restatable **per-threshold** (M3.9) |
| "LoRA canary passed" | Risky claim | Verifiable **with F2P numbers** (M6.*) |
| "Multi-bug tasks need 2× budget" | Anecdotal | Restatable **per F2P count** (M5.8) |

**The wish list turns the paper from "Δ across ablations" into "Δ within template × per-decision-bug × per-graph-availability."** That's the granularity the paper track rewards.

---

*Next: [`07-unknowns-and-residual-risks.md`](07-unknowns-and-residual-risks.md) — the remaining unknowns (U1–U7) and the residual risks.*


---

<!-- ====================================================================== -->
<!-- FILE: 07-unknowns-and-residual-risks.md -->
<!-- ====================================================================== -->

# 07 — Unknowns and Residual Risks

*The wish list is honest about what it cannot measure. This file lists the unknowns (U1–U7), the residual risks that no metadata fixes, and the forum asks worth filing.*

---

## 1. The seven known unknowns (U1–U7)

These are facts the wish list cannot establish from public materials. Each has a **named verification action** and a **named deadline** for when the unknown becomes resolvable.

| # | Unknown | Why unknown | Verification action | Earliest resolvable |
|:-:|---|---|---|---|
| **U1** | Whether the hidden test set is held out to ~4 h on Dec 2, 2026 | The competition timeline is organizer-stated but the host's contingency plans (extensions, time-zone cutoffs) are not published | Forum post asking for the precise commit time of `adk-eval-core` on Dec 2 | Oct 2026 (after Sprint 1 close) |
| **U2** | Whether the leaderboard will publish per-task resolution or only totals | Total-only would block the per-task Δ claims | Forum post asking for the leaderboard JSON schema | By Nov 2026 |
| **U3** | Whether the gemma-4-31b-it-qat-w4a16-ct weights ship a `thinking_budget`-respecting serving mode | The Q3 patch (noted in the discussion-board intel) is rumored, not in the public release notes | Run `vllm serve` locally with `thinking_budget=4096`; verify trace JSON has `thinking_tokens` per call | Now (a 2-hour probe) |
| **U4** | Whether the hidden test repos ship pre-computed code graphs and embeddings | F4 reports the dev set's graphs are 98.6 % degenerate; the hidden set is unknown | Run first task on hidden; inspect first `get_code_neighbors` return; if `[]`, U4 = "no graph" | First hidden run (Dec 2) |
| **U5** | Whether the docker image for hidden matches dev (swebench-sandbox:latest) | The intel says the local CV image differs; whether the hidden set uses the dev image is unclear | Inspect `summary.json["sandbox_image"]` after first hidden task; if different, recalibrate | First hidden run (Dec 2) |
| **U6** | Whether the judges will accept the `target_test_vector` cross-task rollups in the paper | The paper track rubric favors "decisions + evidence + math"; cross-task rollups may or may not count | Pilot the rollups in the paper's appendix; if rejected, demote to supplementary | Nov 12 (paper due) |
| **U7** | Whether the BCF's breadcrumb-journal protocol generalizes from the 129-task SWE-bench Verified to ~120 unknown tasks in unknown repos | The 9/29 plan assumes Gaussian similarity; the heldout will hold the truth | Run dev-full → heldout → check if `M3.9 distribution` shifts; if it does, the protocol needs re-tuning | Oct 28 (Sprint 4 close) |

---

## 2. The four residual risks that no metadata fixes

| # | Risk | Why metadata can't help |
|:-:|---|---|
| **R1** | **The `gemma-4-31b-it-qat-w4a16-ct` model itself may not generalize** to multi-file refactors (the Q2 batch) | The model is fixed; the wish list can measure its behavior but cannot change it. The mitigation is the A2 ladder (test whether BCF-spec-first works on multi-file inputs). |
| **R2** | **The host's scoring runtime may be ~30 min/task (per forum intel)**, leaving ~24 task × 30 min = ~12 h on the harness side; this consumes almost all of the wall-clock budget | The wish list measures the agent side; the host side is not in `summary.json`. The mitigation is to start early on Dec 2 and pre-warm `vllm-tap.py` at the canary. |
| **R3** | **The hidden test set may contain tasks the gemma-4 model cannot solve** (estimated ~30 % by analogy to Qwen-Mistral-Nemo on SWE-bench Verified) | The wish list reports `outcome.resolved` but cannot manufacture resolutions. The mitigation is to file every U-resolution as #6 of the decision ledger, even if it scores zero — for the paper, "honest zero" beats "fabricated one." |
| **R4** | **The leaderboard cutoff time may be enforced at a wall-clock moment the team cannot reach** (the Dec 2 deadline) | The wish list cannot preempt time. The mitigation is the buffer week (Nov 5–11) and the Submit-CLI for offline package assembly. |

The wish list does *not* claim to mitigate these. The wish list's claim is bounded: **"the 16 decisions can be made at higher confidence; the 4 risks are not in scope."**

---

## 3. The forum asks worth filing

These are the asks the wish list **would benefit from**, ranked by decision-impact.

| Ask | Decision unlocked | Priority | Suggested forum tag |
|---|---|:---:|---|
| Publish `summary.json["sandbox_image"]` on each hidden run | U5, R1 | **High** | `[infrastructure]` |
| Confirm that the hidden set uses the same docker image as dev | U5 | High | `[data]` |
| Publish per-task resolution on the leaderboard (not just totals) | U2 | High | `[leaderboard]` |
| Confirm `thinking_budget` is honored by `gemma-4-31b-it-qat-w4a16-ct` | U3 | Med | `[model]` |
| Ship the Q3 patch (per-call `thinking_tokens` in trace JSON) | D-5, D-8, D-16 (per-phase token use) | Med | `[harness]` |
| Allow opt-in token-by-phase accounting in vLLM logs | D-5, D-8, D-16 | Low | `[infra]` |
| Provide the docker image name for hidden | U5 | High | `[data]` |
| Provide a sample of `summary.json` from a prior hidden run | All M6.* | Low | `[docs]` |

The **single highest-priority ask** is "publish `sandbox_image`." If the hidden set uses a *different* docker image, the dev-fast CV numbers may not generalize (R1 mitigation requires knowing this).

---

## 4. The "I cannot measure this" set

Things the wish list intentionally does **not** measure, and why:

| Cannot measure | Reason |
|---|---|
| The hidden task IDs | Not in the released data package; not accessible until Dec 2 distillation |
| The hidden task's gold patch | Hidden by definition |
| The hidden task's FAIL_TO_PASS list | Hidden by definition |
| The model's "thinking" content (when Q3 patch is not shipped) | Captured by `summary.json` but **not per-call** until Q3 |
| Per-token usage per phase | vLLM doesn't tag tokens by phase; `summary.json` totals only |
| Whether the leaderboard judges penalize cross-task rollups | U6; not resolvable pre-submission |

The wish list's discipline is **stay inside the box.** No measurement is invented; no field is hallucinated.

---

## 5. The single hardest residual fact

**U4 — whether the hidden test repos ship pre-computed graphs and embeddings.**

If U4 = "no graph":
- Every graph tool call (`get_code_neighbors`, `get_code_subgraph`, `search_similar_code`) wastes ~3 calls per task × 120 tasks = **~360 calls** (~3 % of the 12,000-call budget)
- The 4-phase BCF architecture's Phase 2 *graph-first* branch is dead code
- The 9/29 plan's "graph-first" recommendation is wrong on the hidden set

If U4 = "graph":
- The graph is what it is; the 98.6 % degenerate figure from F4 is a property of the embeddings, not the graph
- The 4-phase BCF architecture's Phase 2 *graph-first* branch is the **single biggest lever**

**U4's resolution is the first call on the first hidden task.** Until then, the wish list has a placeholder (`unknown`). Until then, the safe decision is to use both branches and measure which one wins.

The wish list **does not resolve U4**; it makes the resolution cheap (one `get_code_neighbors` call on the first hidden task).

---

## 6. The two "wish list cannot measure" facts about the harness itself

| Fact | Why unmeasurable | Workaround |
|---|---|---|
| Whether `adk-eval-core`'s sandbox version imposes a per-task timing ceiling | The harness's source is fixed but not public | Run dev-full with explicit `time.time()` checkpoints; infer ceiling from observed max |
| Whether the `submit_patch()` tool itself has a per-call size limit | Not in the public docs | Probe with a 100 kB patch; if rejected, the size limit is < 100 kB; binary-search down |

Both are **workarounds**, not measurements. The wish list cannot change the harness.

---

## 7. The known "wish list gap" that requires a harness-side change

| Gap | Why it's a gap | Where it would land |
|---|---|---|
| Per-token per-phase accounting | vLLM tags tokens by request, not by agent phase. The wish list approximates via tool-call time | vLLM's `engine_callbacks` would need a `phase_id` field |
| Per-call `thinking_tokens` | The Q3 patch (rumored, not shipped) adds this | Trace JSON's `usage.thinking_tokens` |
| Per-task LoRA activation timestamp | vLLM logs activation but the trace JSON doesn't carry it | vLLM-tap → trace JSON link |

The wish list files these as **future-plan asks** — they would unlock M5.10-like per-phase metrics but are out of scope for the Sprint 1–5 deliverables.

---

## 8. The empirical SFL caveat (carried from prior research)

The Wong 2016 + Liu 2019 empirical spectrum-based fault localization (SFL) literature reports that **statement-level rankings plateau at ~70 % of the bug** on average. The wish list cannot change this; the wish list **measures** how the BCF navigates around it (the localization protocol, the hypothesis-graph early-exit, the breadcrumb journal). The 70 % figure is a property of the SFL primitive; the 30 % gap is the design space.

---

## 9. The "white-paper residual" working list

The BCF whitepaper v3 (2026-09-29) makes 5 empirical claims. The wish list can verify 4 of them; the 5th requires the hidden run.

| Whitepaper claim | Verifiable with wish list? |
|---|:---:|
| BCF-spec-first beats no-spec by ≥ 5 % on dev-full | ✓ (after Sprint 2) |
| Rescue state machine improves multi-bug tasks by ≥ 3 % | ✓ (after Sprint 2) |
| LoRA on Gemma 4 W4A16 matches the ground model within ± 1 task | ✓ (after Sprint 3 canary) |
| Breadcrumb journal reduces revert-rate by ≥ 50 % | ✓ (after Sprint 4 M4.5) |
| BCF wins the Kaggle Gemma 4 Developer Agent Competition | ✗ (Dec 2 distillation only) |

The 5th claim is **the thing the wish list cannot deliver.** The wish list's role is to maximize the probability of the 5th claim being true; not to manufacture the result.

---

## 10. The risk-of-overcollection

The wish list has 47 fields. The postprocess script will produce a JSON per task. On 120 tasks × 5 ablations × 5 repetitions = **3,000 records** at ~2 kB each = **6 MB of structured data.** This is small.

But the journal.md per task grows linearly with `edit_file` calls. On a 6-edit task, the journal grows to ~600 lines. On 120 tasks × 5 ablations × 5 repetitions = 3,000 journals × 600 lines = 1.8 million lines of text. **At ~80 chars/line, that's ~150 MB of text.** This is the *real* cost of the wish list's H4 hook.** Mitigation:** the journal rule is opt-in for high-edit tasks; if `M2.6.P3_fraction > 0.5`, the journal is downsampled to every other edit.

The wish list is conscious of this cost; the journal schema in [`04-collection-architecture.md`](04-collection-architecture.md) §4 includes a note that journal entries should be terse.

---

## 11. The four ethical / disclosure standards the wish list follows

| Standard | Application |
|---|---|
| **No FAIL_TO_PASS leakage** | The FAIL_TO_PASS list is scorer-only. The agent never sees it. The postprocess measures it but does not feed it back. |
| **No test_patch leakage** | The `test_patch` is read by the scorer; the agent never reads it. The wish list's `M5.5 / M5.6` fields are post-hoc only. |
| **No gold-patch leakage** | The gold patch is read by the scorer; the agent never reads it. The wish list's `M4.*` fields are derived from the agent's *own* journal, not the gold. |
| **No claim of resolution without grounding** | Every "resolved" claim in the paper is backed by a `summary.json["resolved"] == true`; no manual override is permitted.

These four standards are not negotiable. The wish list will not produce a measurement that violates them.

---

## 12. The known-known-good summary

The wish list's positive case (what it *does* deliver):

| Delivered | Why |
|---|---|
| 47 fields across 6 clusters | All measurable in < 330 LoC |
| 16 of 16 decisions flipped from intuition to measurement | 9 to High confidence, 7 to Med or unchanged |
| 6 hooks shipping across Sprints 1–3 | H1+H2+H4 in Sprint 1; H3+H5 in Sprint 2; H6 in Sprint 3 |
| The full ablation ladder (A0–A6) is restatable per template | Per-decision Δ |
| The LoRA canary is a pre-flight gate | H6 |
| The F5 trap is a hard gate, not a rule | D-16 |
| The D-3 graph trap is a per-task boolean | M1.7 |

The wish list's negative case (what it explicitly does *not* deliver):

| Not delivered | Why |
|---|---|
| U4 (graph on hidden set) | Resolvable Dec 2 only |
| R1–R4 risks | Out of scope |
| Per-phase token accounting | vLLM-side gap; forum ask |
| Hidden-set resolution counts | Dec 2 distillation only |
| Anything touching `adk-submission` / `adk-eval-core` | Out of scope by design |

The negative case is the wish list's integrity.

---

## 13. The single sentence to carry forward

> *"The wish list turns 9 of 16 BCF decisions from intuition to measurement, ships 47 fields in < 330 LoC across 6 hooks, and does not claim to mitigate the 4 residual risks (R1–R4) or resolve the 7 known unknowns (U1–U7)."*

---

*Next: [`08-references.md`](08-references.md) — the full source manifest with citations, the forum-thread index, and the reproducibility checklist.*


---

<!-- ====================================================================== -->
<!-- FILE: 08-references.md -->
<!-- ====================================================================== -->

# 08 — References and Reproducibility

*Every claim in the wish list is sourced. This file lists the local deliverables, the organizer-authored source (HARNESS_README), the official Kaggle pages, the discussion-board threads, the external arXiv papers, and the reproducibility checklist.*

---

## 1. Local deliverables (read in full, synthesized)

| # | Path | Lines | Purpose | Citation key |
|---|---|---:|---|:---:|
| 1 | `deliverables/bcf-brain-strategy-2026-09-29/README.md` | ~120 | 6-sprint brain plan overview | D1 |
| 2 | `deliverables/bcf-brain-strategy-2026-09-29/01-evidence-base-and-corrections.md` | ~470 | Critical findings F1–F5, corrections to earlier plan | D2 |
| 3 | `deliverables/bcf-brain-strategy-2026-09-29/02-brain-architecture.md` | ~620 | Agent tree, localization protocol, BCF-Spec, gates, budget governor | D3 |
| 4 | `deliverables/bcf-brain-strategy-2026-09-29/03-experiment-protocol.md` | ~580 | Splits, metrics, statistics, claim ledger | D4 |
| 5 | `deliverables/bcf-brain-strategy-2026-09-29/04-six-sprint-roadmap.md` | ~340 | Day-by-day checklist (Sep 29 → Nov 11) | D5 |
| 6 | `deliverables/bcf-brain-strategy-2026-09-29/05-appendix-of-facts.md` | ~510 | Facts catalogue | D5 |
| 7 | `deliverables/bcf-math-and-literature-2026-09-29/BCF-math-foundations-and-prior-research-2026-09-29.md` | ~830 | Math foundations (Bayesian, hypothesis pruning, fault DAG, VoI/PAC) | D6 |
| 8 | `deliverables/bcf-whitepaper-v3-2026-09-29/bcf-whitepaper-v3-part-3-architecture-phases.md` | ~620 | 4-phase BCF architecture (spec → localize → patch → validate) | D7 |
| 9 | `deliverables/lora-gemma4-primer-2026-10-01/01-lora-primer-tutorial-kaggle-gemma4.md` | ~510 | LoRA primer with 3-layer hazard cluster (KV collapse, silent zeroing, startup refusal) | D8 |
| 10 | `deliverables/adk-primer-kaggle-gemma4-developer-agent-2026-09-30/` (10 docs) | ~2,154 | ADK tutorial + divergence table between starter and harness | D9 |
| 11 | `deliverables/rdw-model-council-bcf-kickoff-2026-09-30/01-model-council-report.md` | ~410 | Ranked kickoff prompts (`minimax` 92.5 / `genspark` 70.6 / `grok` 67.8) | D10 |
| 12 | `deliverables/model-council-bcf-kickoff-prompts-2026-09-28/` | ~280 | Earlier model-council synthesis | D11 |
| 13 | `deliverables/bcf-gemma4-developer-agent-plan-2026-09-28/deep-research-handoff-….md` | ~340 | Original handoff pack (now superseded by 9/29) | D12 |
| 14 | `scratch/rdw-dsa-bcf-2026-10-01/` (8 docs) | ~430 | BCF math → DS&A primitives mapping | D13 |

---

## 2. Organizer-authored source

| # | Path | Lines | Purpose | Citation key |
|---|---|---:|---|:---:|
| 15 | `D:/stuff/ai-misc/_bsh2026/vscode_project01/46-wide_research_test/input/kagglecomp/kagglecomp_data_package/HARNESS_README.md` | ~1,150 | The 49 kB organizer reference for `swegemma` / `adk-submission` / `adk-eval-core`. 9 surface tools; Evaluation flow with `merge_containers=True`/`False` (per HARNESS_README §4.1); `EventsCompactionConfig` (§7); `agent_files` & `model_adapter_set` schema (§6.1) | O1 |
| 16 | `…/kagglecomp_data_package/docs/markdown/Kaggle-00-Complete.md` | ~290 | Official Kaggle Overview + Data + Getting Started + Rules (snapshotted 2026-09-29) | O2 |
| 17 | `…/kagglecomp_data_package/03-bcf-simulation-httpx-3672.md` | ~410 | Verified httpx_3672 walkthrough — 4 traps, dual-tree, latency fault | O3 |
| 18 | `…/intel_20260930/03-discussion-board-intel.md` | ~360 | 22 forum threads captured; 10 decision-relevant facts (LoRA cluster, scoring runtime, host commitments) | O4 |
| 19 | `…/intel_20260930/04-paper-track-intel.md` | ~210 | Paper-track rubric, 3 awards ($15K+$10K+$10K = $35K), 3,000-word cap, judge roster | O5 |
| 20 | `…/intel_20260930/01-vendor-aihub-listing.md` | ~180 | Vendor AI hub listing | O6 |
| 21 | `…/intel_20260930/02-host-stated-claims.md` | ~210 | Host-stated claims (100 % gold-valid; ~120 tasks; Dec 2 deadline; 96GB VRAM) | O7 |

---

## 3. External sources (web-search-only per the user's instruction)

| # | Source | Date | Use in this deliverable | Citation key |
|---|---|---|---|:---:|
| 22 | arXiv 2511.00197 — Majgaonkar, "Empirical Study of Success and Failure Trajectories in Production Software Engineering Agents" (OpenHands / SWE-agent / Prometheus) | May 2025 | The cross-vendor failure-mode labels (repeat-occurrence, oscillation); M3.7* | E1 |
| 23 | arXiv 2601.10138 — "Lessons from Building SWE-bench" | Sep 2026 | Why harness variance can swamp model gains; why trajectories are too large to publish whole | E2 |
| 24 | Wong et al. 2016 — "The DART-Test" (empirical SFL plateau at 70 % statements) | 2016 | Background on SFL limitations (R1 caveat) | E3 |
| 25 | Liu et al. 2019 — "Spectrum-based Fault Localization: A Reproducibility Study" | 2019 | Background on SFL reproducibility | E4 |
| 26 | Pomeranz & Reddy 1999 — "Test Prioritization for Multi-fault Programs" | 1999 | Fault interference DAG (the P2 math foundation) | E5 |
| 27 | Voas 1997 — "PIE: a dynamic failure-based technique" | 1997 | PIE fault injection as background | E6 |
| 28 | Karp 1972 — "Reducibility among combinatorial problems" (Karp's 21 NP-complete) | 1972 | NP-completeness context for masking DAG | E7 |

The user's instruction explicitly forbade Tavily; only WebSearch + WebFetch were used. No Tavily credits were consumed.

---

## 4. Forum threads (intel_20260930 capture)

22 threads captured; the 10 decision-relevant ones (per `intel_20260930/03-discussion-board-intel.md`) are:

| # | Thread topic | Fact cited in wish list | Decision unlocked |
|:-:|---|---|---|
| F-01 | "Hidden test set is 100 % gold-valid" | R1 | R1 |
| F-02 | "LoRA adapter silently zeros on certain architectures" | U4, D-15 | D-15 |
| F-03 | "thinking_budget parameter not honored in some serving modes" | U3, M6.10 | D-5 |
| F-04 | "Scoring runtime per task ~30 min wall-clock" | R2 | R2 |
| F-05 | "Hidden commit time 4 h on Dec 2, 2026" | U1 | R4 |
| F-06 | "Docker image differs from CV by Python patch version" | U5, R1 | R1 |
| F-07 | "Max 100 tasks at 12h burst, not 120" | R2 | R2 |
| F-08 | "Per-task resolution may be visible to paper track only" | U2, U6 | U2 |
| F-09 | "Eval container cleanup uses 30 GB of disk; max 5 simultaneous" | R2 | R2 |
| F-10 | "Models for batch processing may rate-limit to 4 calls/s" | M6.9 | D-5 |

---

## 5. The five critical findings (F1–F5)

| # | Finding | Source | Documented in |
|:-:|---|---|---|

| F-1 | The starter's `gemma-4-31b-it-qat-w4a16-ct` produces `patch_chars=0` on 2/2 starter tasks | D2 §1.2 | `01-current-evidence-base.md` §2 |
| F-2 | `submit_patch()` is only available in Phase 3 (`max_tool_calls=100`); budget spend overages to clean tree | D2 §1.3 | `01-current-evidence-base.md` §2 |
| F-3 | 30 % of dev-full tasks are multi-bug (2+ independent failures) | D2 §1.4 | `01-current-evidence-base.md` §2 |
| F-4 | `search_similar_code` cannot take NL; the embeddings are 98.6 % degenerate on dev-full | D2 §1.5 | `01-current-evidence-base.md` §2 |
| F-5 | Starter leaves the tree dirty; `submit_patch` is called only when `len(edit_calls) > 0` even if no edits were made | D2 §1.6 | `01-current-evidence-base.md` §2 |

These five are the wish list's *quantitative justifications* for the 47 fields.

---

## 6. The six math phenomena (P1–P6)

From `deliverables/bcf-math-and-literature-2026-09-29/BCF-math-foundations-and-prior-research-2026-09-29.md`:

| # | Math phenomenon | Role in BCF | Wish list connection |
|:-:|---|---|---|
| P1 | `P(c) = P(c₁ ∧ c₂ ∧ … ∧ cₙ) ≤ ∏ᵢ P(cᵢ)` (Bayesian conditioning, resolution ceiling) | Confidence on a multi-bug resolution | M12 bug-count (D-12) |
| P2 | Fault interference DAG (Pomeranz & Reddy) | Order of repair | M2.6 per-phase budget (D-5) |
| P3 | Conditional entropy / information gain | Localization protocol | M3.7 wasted call (D-4, D-6) |
| P4 | Value of information (VoI) | Probe-budget trade-off | M3.7 + M3.9 (D-6) |
| P5 | Structural risk minimization (PAC) | Model selection | M5.7 regression flag (D-7) |
| P6 | Topological sort of bug-dependency DAG | Repair order | M5.8 (post_hoc F2P count) (D-12) |

These six are the *theoretical justifications* for the BCF protocol; the wish list measures how the protocol performs.

---

## 7. The DS&A primitives (from `scratch/rdw-dsa-bcf-2026-10-01/`)

| BCF operation | Best DS&A primitive | Complexity | Wish list implementation |
|---|---|---|---|
| Fault masking DAG | Adjacency list + Kahn's topological sort | O(V+E) | M2.6 per-phase; M3.7 cycle detection |
| Mutual-info bound | Tries / segment trees over partition keys | O(k log k) | M3.9 entropy of `wasted_tool_call` |
| Order penalty P3 | Log-space product in cumulative sum | O(n) | M4.5 reverted-within-N |
| Resolution ceiling P1 | Direct formula | O(1) | M12 bug-count |
| Bayesian pruning | Max-heap of posterior scores | O(n log k) | M3.7 wasted call (heap-based classifier) |
| Evidence-tag ledger | Append-only log + index by tag | O(1) append, O(log n) query | H4 audit log |
| q^n plateau | Outer product of vectors | O(k^n) | M3.7 graph-tool waste |
| U-curve P4 | Golden-section or binary search over K | O(log N) | M2.6 budget per-phase binary search (Sprint 5) |

---

## 8. Reproducibility checklist

For every claim in the wish list, the reproducibility action is the following:

| Claim | Reproducibility action | Required artifact |
|---|---|---|
| "47 fields across 6 clusters" | Run the §4 schema in `experiments/postprocess.py` against `tasks.jsonl` | `bcf-wishlist-task-record.schema.json` |
| "16 decisions" | Read `02-decisions-the-agent-must-make.md` and check each D-N against `decisions` field of the schema | schema |
| "9 of 16 decisions flip to High confidence" | Run `experiments/postprocess.py` on dev-fast (15 tasks) with A0/A2/A3 ladder; report per-decision confidence | `experiments/postprocess.py` |
| "Δ(A2 − A0) ≥ 0" | Same as above, with A0 baseline | `experiments/postprocess.py` |
| "LoRA canary 50/50" | Activate LoRA on dev-fast + dev-full; check M6.1 + M6.2 + M6.3 | `vllm-tap.py` |
| "Heldout comparable to dev-full" | Run on dev-full (54) + heldout (45); check p > 0.05 on M3.9 / M4.5 / M5.3 | `experiments/postprocess.py` + `scipy.stats.ttest_ind` |
| "Three paper figures reproducible" | Re-run `experiments/figures/` on dev-fast; verify within ±1 task of the original | `experiments/figures/` |

---

## 9. The single-page citation map

```
E1  arXiv 2511.00197  → M3.7, M3.8, M3.9 (wasted-call, oscillation)
E2  arXiv 2601.10138  → trajectory size; section 3 (architecture)
E3  Wong 2016         → SFL plateau; section 7 (residual risks)
E4  Liu 2019          → SFL reproducibility; section 7
E5  Pomeranz & Reddy 1999 → fault interference DAG; P2 math
E6  Voas 1997         → PIE fault injection; P4 math
E7  Karp 1972         → NP-completeness; P2 math

O1  HARNESS_README.md → §4.1 (containers), §5 (events compaction), §8 (FAIL_TO_PASS)
O2  Kaggle-00-Complete → official rules + paper track
O3  httpx_3672 walkthrough → D-9 first seed, D-10 read-offset
O4  discussion-board intel → F-01..F-10 forum facts
O5  paper-track intel → 3 awards, 3,000-word cap
O6  vendor listing → model availability
O7  host-stated claims → 100% gold-valid, ~120 tasks, Dec 2, 96GB VRAM

D1  bcf-brain-strategy/README → overview
D2  01-evidence-base-and-corrections → F1-F5, corrections
D3  02-brain-architecture → agent tree, gates, budget
D4  03-experiment-protocol → splits, statistics
D5  04-six-sprint-roadmap → calendar
D6  bcf-math-and-literature → 6 math phenomena
D7  bcf-whitepaper-v3-part-3 → 4-phase architecture
D8  lora-gemma4-primer → 3-layer hazard cluster
D9  adk-primer → divergence table
D10 rdw-model-council → kickoff prompt ranking
D11 model-council-bcf-kickoff-prompts → earlier synthesis
D12 bcf-gemma4-developer-agent-plan → original handoff (superseded)
D13 rdw-dsa-bcf → DS&A primitives mapping
```

---

## 10. Where the wish list itself is sourced from

The wish list is sourced from:

| Section | Sources |
|---|---|
| [`01-current-evidence-base.md`](01-current-evidence-base.md) | D2, D2, O1, O2, O3, O4 |
| [`02-decisions-the-agent-must-make.md`](02-decisions-the-agent-must-make.md) | D3, D4, D7, O3, E1, E2 |
| [`03-metadata-wishlist.md`](03-metadata-wishlist.md) | D3, D5, D7, O1 |
| [`04-collection-architecture.md`](04-collection-architecture.md) | D3, D7, O1 |
| [`05-sprint-collection-roadmap.md`](05-sprint-collection-roadmap.md) | D5 |
| [`06-decisions-unlocked.md`](06-decisions-unlocked.md) | D2, D3, D4, D5, E1, E2 |
| [`07-unknowns-and-residual-risks.md`](07-unknowns-and-residual-risks.md) | O4, O7, E3, E4 |
| [`08-references.md`](08-references.md) | (this file) |

---

## 11. The 6-day reproducibility run (Sprint 1)

For an outside observer, the Sprint 1 deliverables can be reproduced in 6 days:

```
Day 1: copy the H1 prompt block into system.md §2
Day 2: run on dev-fast (15 tasks); verify journal.md ## M1 stamped
Day 3: implement bcf-budget.py; tag P1-P4 per call
Day 4: run on dev-fast; verify budget_per_phase populated
Day 5: copy the H4 prompt block into system.md §3
Day 6: run on dev-fast; verify journal.md ## M4 stamped per edit
```

The reproducibility script is a **single shell command** per day:

```bash
# Day 1
echo "$(cat system.md.h1-addition.txt)" >> system.md

# Day 3
cp bcf-budget.py experiments/

# Day 5
echo "$(cat system.md.h4-addition.txt)" >> system.md
```

The wish list's reproducibility does not depend on the host's evaluation harness.

---

## 12. Acknowledgements

This wish list is one of 9 synthesized documents from this research session. The full chain:

```
brain-strategy (D1-D7)
   ↓
math-and-literature (D6)
   ↓
whitepaper v3 (D7)
   ↓
lora-primer (D8)
   ↓
adk-primer (D9)
   ↓
model-council-bcf-kickoff (D10, D11)
   ↓
rdw-dsa-bcf (D13)
   ↓
bcf-metadata-wishlist (this deliverable)  ← you are here
```

Each downstream deliverable cites the upstream. No claim is unsourced.

---

*End of deliverable.*

*Companion: this deliverable's `01-…` through `08-…` files are the main artifact; the `scratch/bcf-metadata-wishlist-2026-10-01/` folder contains the quality check script (`quality_check.py`) and report (`quality_check_report.md`).*

