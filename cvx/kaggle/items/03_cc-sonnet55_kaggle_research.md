# COMBINED MARKDOWN - combine

_Generated 2026-09-30 19:08:42 | 5 files | folder: D:\stuff\docs\taylor_fv\github\rayrite.github.io\cvx\kaggle\items\combine_

## Contents

1. 01-roadmap-and-master-checklist_v2.md
2. 02-master-plan-day0-six-sprints_v2.md
3. 05-bcf-integration-and-paper-brainstorm_v1.md
4. 06-whitepaper-math-section_draft3.md
5. 07-prior-research-fault-interference-masking.md

---

<!-- ====================================================================== -->
<!-- FILE: 01-roadmap-and-master-checklist_v2.md -->
<!-- ====================================================================== -->

# 01 — Roadmap & Master Checklist (v2)
### Gemma 4 Developer Agent — building a winning coding-agent "brain"

*Prepared 2026-09-30 (Day −1). Owner: Cooly. Format: Markdown (per your standing format preference). Companion file: `02-master-plan-day0-six-sprints_v2.md`.*

**Evidence tags used throughout:** `[RULES]` Kaggle rules/overview · `[README]` HARNESS_README · `[NB]` Getting-Started notebook · `[INTEL]` your 9/30 discussion-board file · `[USER]` you told me · `[DERIVED]` my arithmetic from tagged facts · `[HYPOTHESIS]` my prior, must be tested · `[UNVERIFIED]` could not confirm.

**What I could not do:** the live Kaggle page is JavaScript-rendered; my fetch returned only page metadata. Everything about the competition comes from your project snapshots (taken 9/29) plus your 9/30 intel file. Leaderboard numbers (0.17 / 0.15 / 0.15) are from you.

---

## 0. Change journal (your standing rule: full diff journal for every version change)

**Lineage note.** The earlier `01-roadmap-and-master-checklist.md` and `02-master-plan-day0-six-sprints.md` (written the morning of 9/30, per intel §11) are **not in the project files**, so I could not diff against them line by line. This v2 does **not** overwrite them. Below is a conceptual diff against (a) the 9/28 `BCF-Gemma4-Competition-Plan.md` and (b) the five deltas in intel §11. If you upload the earlier files I will produce the literal unified diff as `diff-journal/01_v1_to_v2.diff.md`.

| ID | Area | Before (9/28 plan / intel §11) | Now (v2) | Why |
|---|---|---|---|---|
| C-01 | Localization | "Graph-first" navigation | **Grep-first, graph-second** | `search_similar_code` resolves the query against node *keys*, not meaning `[README §6.3]`; the notebook's natural-language query returned 0 results `[NB]`; output is uncapped and killed 6/6 tasks that returned >100k chars `[INTEL 744577]` |
| C-02 | Architecture | Root + 3 sub-agents + JSON spec gate | **Lean single agent by default**; sub-agents only if an ablation wins | Decode-bound economics (§2, insight 2); each sub-agent call re-pays prefill and adds compaction risk |
| C-03 | Plan shape | 6 weeks, paper-first, main-track after Nov 12 | **6 one-week sprints, main-track first**, paper is an optional spin-off | You asked for a winning submission; the $65k track is the critical path |
| C-04 | LoRA | "Optional, later" | **Gated track** with a cheap canary, 3 known failure layers, binary go/no-go at end of Sprint 4 | `[INTEL §4]` no adapter submission has ever scored |
| C-05 | Local validation | "Freeze splits on the 129 public tasks" | **Gold-validated pool + separate regrade pipeline** | Gold patches fail locally (54/67 fastapi even after adding wheels) while the host says hidden tasks validate 100% `[INTEL §6]` |
| C-06 | Time cap | "~6 min per task" | **Chance-constrained cap from a fitted cost model** | 12 h overrun currently errors the *whole* submission `[INTEL §3]` |
| C-07 | Host bugs | Q1–Q6 | **Q1a/Q1b split, Q3 upgraded, Q7 added, rescore backlog added** (intel §11 items 1–5) and wired into a trigger table (§11 below) | New intel |
| C-08 | 5090 capability | "Confirmed capable (~18 GB inference)" | **Conditional on a KV-cache parity gate** | Weights fit; the 32k-token KV cache may not `[DERIVED §2-8]` |
| C-09 | Submission supply | 1/day | **Plan for ≤ 1 full-length scored run per week until quota behavior is verified** | `[INTEL §8]` quota deducted ~2× wall-clock, 30 GPU-h/week |
| C-10 | Noise | Implicit | **Explicit noise model and promotion rules** (§6) | Top-3 are 1–2 tasks apart |
| C-11 | Generalization | Not addressed | **"Forge" extra-repo tasks + leave-one-repo-out** | Hidden set comes from private repos `[RULES/Data]` |
| C-12 | Design parking lot | — | Added §3 (ICE-scored brainstorm, parking lot, rejected list) | Task 1 requirement |

---

## 1. Ground truth brief (what is known)

### 1.1 Competition mechanics

| Item | Fact | Tag |
|---|---|---|
| Objective | Post-train / configure `gemma-4-31b-it-qat-w4a16-ct` into an agent that drafts patches; score = % of tasks whose hidden validation tests pass (SWE-bench style PASS/FAIL) | `[RULES]` |
| What you submit | `submission.zip`: `agent.yaml` (+ prompts, sub-agents, skills with `.py` scripts, optional LoRA adapters, optional `eval_config.yaml`). Declarative only — no arbitrary Python entrypoints | `[RULES][README §2]` |
| Size / file types | < 3 GiB unpacked; allowed: `.yaml .yml .md .txt .py .json .safetensors` | `[README §2.4]` |
| Model rule | One base model for every agent/sub-agent; adapters allowed per agent | `[RULES]` |
| Scoring environment | 4× NVIDIA L4 (24 GB each), vLLM TP=4, `max_model_len=32768`, gpu util 0.80, `max_loras=8`, `max_lora_rank=128` | `[README §3.1]` |
| Time | 12 h total for all tasks, *including* sandbox setup, *excluding* patch validation; no concurrency; fixed sequential order | `[RULES][INTEL §3]` |
| Per-task limits | Only 4 `eval_config.yaml` fields are read: `timeout_seconds`, `max_tool_calls`, `max_time_minutes`, `max_turns`; defaults = no limit | `[INTEL §3]` |
| Sandbox | Offline Docker, 4 GiB RAM, 2 vCPU, command timeout 300 s, command output cap 5,000 chars, `read_file` cap 150 lines / 10,000 chars | `[README §4,§7]` |
| Tools (9) | `run_command, submit_patch, get_status, read_file, edit_file, write_file, get_code_neighbors, search_similar_code, get_code_subgraph` | `[RULES]` |
| Free tools | `submit_patch` and `get_status` do not count toward the tool-call budget | `[README §6.1]` |
| Patch salvage | If the agent times out or runs out of budget **without** `submit_patch`, the harness still takes `git diff` of the working tree and grades it | `[README §8.1]` |
| Anti-tamper | Edits to test files and to `conftest.py, pytest.ini, pyproject.toml, tox.ini, setup.cfg, *.pth …` are reverted before hidden tests run | `[README §8.2]` |
| Pass condition | pytest exit 0 **and** JUnit XML shows every required test passed (none skipped) | `[README §8.2]` |
| Context mgmt | ADK events compaction: threshold 14,336 tokens, interval 5, overlap 2, retain 5 (notebook used interval 15) | `[README §7.2][NB]` |
| Nudges | Up to 3 continuation nudges when a turn ends without `submit_patch` | `[README §5.3]` |
| Data | 129 public tasks (fastapi, rich, requests, httpx), graphs, 256-dim embeddings, 124 wheels; hidden test ≈120 tasks from *private repositories*, "evenly divided between public and private splits" | `[RULES/Data]` |
| Submissions | **1 per day**, 2 final selections, team ≤ 5, one account, no private code sharing outside the team | `[RULES]` |
| Dates (23:59 UTC) | Paper Nov 12 (optional) · Entry + merger Nov 25 · **Final Dec 2** (= 6:59 pm US Eastern / 5:59 pm Central) | `[RULES]` |
| Prizes | $37k / $18k / $10k (main); paper track $35k separate | `[RULES]` |
| Winner obligations | Open-source licence (OSI-approved, commercial use allowed), deliver code + documentation reproducing the submission | `[RULES §2.5,§2.8]` |
| External data | Allowed if public/"reasonably accessible"; distillation allowed if the teacher's licence is complied with; closed-API teachers are a ToS risk | `[RULES][INTEL #9]` |

### 1.2 Live state of the field (from intel, 9/30)

- Leaderboard top three: **0.17, 0.15, 0.15** `[USER]`. Public notebook baselines: 0.05–0.12; same code forked twice gave 0.12 and 0.08 (run-to-run ±0.04) `[INTEL §7]`.
- Host-confirmed: hidden tasks validate at 100% with gold patches `[INTEL #1]`.
- **Open host commitments** (none confirmed live): thinking-thoughts patch (no re-score), double-JSON escaping fix, `search_similar_code` cap, LoRA KV sizing fix, 12 h overrun → score-as-zero fix, rescore backlog `[INTEL §2]`.
- No public adapter submission has ever scored; the official sample-with-adapters FAILED `[INTEL §4]`.
- Queues: 4–13+ h on L4×4; scoring ≈ 12–14.5 h; quota deducted ≈ 2× wall-clock `[INTEL §8]`.

### 1.3 Hard-constraint digest (memorize these)

1. 32,768-token context, compaction at 14,336 → **working context must stay ≈ 14k tokens**.
2. ≈ 5 minutes of wall-clock per task on average, *and the platform does not know about "average"*.
3. Decoding is slow; reading is cheap (§2, insight 2).
4. The working tree is the product; it is salvaged on any exit path.
5. Hidden tests reset test/config files; fix library code only.

---

## 2. Mentor notes — the eight things that decide this competition

> **Teaching note.** These are ordered by how much they should change your behavior, not by how interesting they are.

**1. The leaderboard is mostly noise; don't steer by it.**
`[DERIVED]` With p = 0.15 the standard error is √(p(1−p)/n): **3.3 pp at n = 120**, **4.6 pp at n = 60** (if the public board is scored on half the hidden set). A 95% Wilson interval for 18/120 is ≈ 9.7%–22.5%; for 20/120 (0.17) it is ≈ 11%–24%. The top three are 1 task apart at n = 60, or 2–3 tasks apart at n = 120. Two runs of identical code already differ by 4 pp. Public-board leaders are also subject to the **winner's curse** (selection on noise), and final ranking is on the *other* half. Implication: optimize *expected* score and *downside protection*; use the board as a sanity check, never as a gradient.

**2. Time is decode-bound: think little, read a lot.**
`[DERIVED, rough]` In the official notebook's trace (L4×4), a turn with a ~700-char thought took ≈ 8 s and one with a ~1,500-char thought took ≈ 18 s → roughly **25 tokens/s decode**. Five minutes therefore buys only **~7,000 generated tokens** (plus tool time), while prefill (reading 10k characters ≈ 2.5k tokens) costs a second or two. So: short thoughts, big reads (150-line chunks), chained shell commands, capped outputs. The default `thinking_budget: 4096` is a budget you cannot afford across 20 turns.

**3. The 12 h budget is pooled, but enforcement is per task.**
You choose a per-task cap `T`. Total time ≈ Σ min(Tᵢ, tᵢ) + setup. Because many tasks finish or give up early, `T` can exceed 12 h / N — but the hidden set's time distribution is unknown and an overrun currently **errors the entire run**. So choose `T` by *chance-constrained optimization*: maximize expected solved tasks subject to P(total > ~10.5 h) < 1%, using a cost model calibrated on real L4×4 traces (Sprint 1/4).

**4. The cheapest points are self-inflicted failures.**
Evidence from the field `[INTEL §5]`: 62 of 299 `edit_file` calls failed (39 provably from escaping) across 18 tasks; 6/6 tasks whose graph search returned >100k chars died of context overflow; thoughts dropped from history; tool calls truncated at `max_output_tokens`; scratch files swept into patches `[README §10]`. A run that merely *stops losing tasks to plumbing* may beat clever prompting.

**5. Local measurement is broken by default — repair it before you optimize anything.**
Gold patches fail locally for environment reasons (missing wheels such as `typing_inspection`, `inline-snapshot`; wheel de-dup forcing starlette 1.6.0; 8 requests tasks SSL-dead on Python 3.13; 3 version-gated tests) while the hidden scorer is clean `[INTEL §6]`. Field data show CV anti-correlating with LB (highest CV = lowest LB for one participant). Fix: a **gold-validated task pool** and a **regrade pipeline** that separates "generate the patch" from "grade the patch".

**6. Design for "anytime" behavior.**
An *anytime algorithm* returns a usable answer whenever it is interrupted. Because the harness salvages `git diff` on timeout, your agent should keep the working tree **syntactically valid after every edit** (run `python -m py_compile` on each changed file) and should have a candidate fix in the tree by ~60% of the time budget.

**7. LoRA is a call option with an expensive premium.**
Upside: fewer format errors, terser thoughts, better habits. Costs: three distinct infra failure layers (startup refusal on stock vLLM, silent zeroing, KV-cache collapse 46k → 7.6k tokens) `[INTEL §4]`; QLoRA-on-bf16 vs QAT-w4a16 serving skew; training data scarcity (~129 tasks). Buy the option only after a cheap canary proves the path, and only if local evidence says it beats the best no-adapter agent.

**8. Your 5090 is fast but not faithful — verify KV parity.**
`[DERIVED]` The intel reports ≈ 246 kB of KV cache per token per GPU at TP=4 (46,048 tokens of KV before any adapter), i.e. **~1 MB/token across the four GPUs** if nothing is replicated. A single 5090 at 0.92 utilization has ≈ 29.4 GB; minus ~18 GB of weights and ~2 GB overhead leaves **~9–10 GB of KV ≈ 9–10k tokens** at bf16 KV (your scorer has ~46k). The real number depends on Gemma 4's sliding-window layers and KV-head replication under TP=4 `[UNVERIFIED]`. **Day-0 gate:** read vLLM's "GPU KV cache size" line; if < ~24k tokens, use `--kv-cache-dtype fp8`, drive the display from the CPU's integrated graphics to free ~1–2 GB of VRAM, and/or run fidelity-critical evals on Kaggle's L4×4. Local speed will also *overstate* L4 speed ~2–4×; always report **tokens and turns**, then convert to L4 seconds with the cost model.

---

## 3. Brainstorm, parking lot, and rejected ideas

### 3.1 Idea inventory scored with ICE (Impact × Confidence × Ease, each 1–5; max 125)

> **Concept — ICE scoring.** A cheap prioritization heuristic: multiply how much it could matter (Impact), how sure you are it works (Confidence), and how easy it is (Ease). It is crude on purpose; its job is to stop you debating and start an ordering. Scores below are my `[HYPOTHESIS]` priors.

| ID | Idea | I | C | E | ICE | Decision |
|---|---|---|---|---|---|---|
| B03 | **Context-economy rules**: batch commands with `&&`, cap outputs (`head -c`, `tail -n`), big reads, no generic graph searches | 4 | 5 | 5 | 100 | **NOW** (S2) |
| B01 | **Escaping-robust edit protocol**: single-line anchors, line-number edits via `sed`/python, post-edit `git diff --stat` | 5 | 4 | 4 | 80 | **NOW** (S2) |
| B04 | **Finalize gate**: scratch cleanup, protected-file check, `py_compile`, diff review, then `submit_patch` | 4 | 5 | 4 | 80 | **NOW** (S2) |
| B10 | **Anytime patching**: valid tree after every edit; candidate patch by 60% of time | 4 | 4 | 4 | 64 | **NOW** (S2) |
| B02 | **Budget governor**: `eval_config.yaml` caps + in-prompt phase deadlines + cost model | 5 | 4 | 3 | 60 | **NOW** (S2→S4) |
| B08 | Thinking budget sweep (off / 512 / 1k / 2k / 4k) | 4 | 3 | 4 | 48 | S2 lite, S5 final |
| B05 | **Repro-first** verification (`/tmp/repro.py`) | 4 | 3 | 3 | 36 | S3 |
| B06 | **Targeted test selection** (changed file → nearest test file, tail-capped) | 4 | 3 | 3 | 36 | S3 |
| B09 | Temperature sweep (0 / 0.2 / 0.4) | 2 | 3 | 5 | 30 | S5 |
| B07 | Localization helper skill (`find_def.py`: AST def/class lookup + callers via grep) | 3 | 3 | 3 | 27 | S3 |
| B22 | Worked-example skill resources (`load_skill_resource`): 3 short gold-style transcripts, loaded on demand | 3 | 3 | 3 | 27 | S3 |
| B11 | Circuit breakers / rescue (2 failed edits → change method; 3 failed verifies → revert & new hypothesis) | 3 | 3 | 3 | 27 | S4 |
| B15 | **Forge**: mine ~100–300 extra tasks from other pure-Python repos (more power, generalization test, LoRA data) | 4 | 3 | 2 | 24 | S4–S5 |
| B12 | `code_analyzer` read-only AgentTool (context isolation) | 3 | 2 | 3 | 18 | Ablation only (S3) |
| B14 | LoRA via rejection-sampling fine-tuning (RFT) on own trajectories | 4 | 2 | 1 | 8 | **Gated** (S4 decision) |
| B13 | Sequential Analyst → Fixer with structured handoff | 2 | 2 | 2 | 8 | Ablation only |
| B16 | Distill from an open-weight teacher | 3 | 2 | 1 | 6 | Parking lot |
| B21 | Repo-specific cheat-sheets (fastapi/rich/requests/httpx) | 2 | 2 | 3 | 12 | Parking lot (hidden repos are private) |
| B23 | Langfuse / Promptfoo integration | 2 | 3 | 3 | 18 | Parking lot (DuckDB + JSONL first) |
| B24 | Paper-track write-up ($35k, deadline Nov 12) | 3 | 2 | 2 | 12 | Opportunistic spin-off at S6 if receipts exist |

### 3.2 Parking lot (captured, deliberately not scheduled)

- Fractional-factorial / Plackett–Burman screening of prompt components (revisit in S5 if leave-one-out is too slow).
- Learned tool-output summarizer (small model on the 3080) — not allowed inside the submission (single base model), dev-only.
- Static "repo-type" prompt routing (web framework vs CLI vs HTTP client) via the first `ls` — maybe, after the basics.
- Token-level edit formats (unified-diff edits) — depends on whether `edit_file` escaping is fixed by the host.
- NPU on the Ryzen AI laptop — irrelevant to this workload.

### 3.3 Rejected (with reasons)

| Idea | Why rejected |
|---|---|
| Best-of-N / self-consistency patch selection at scale | ~7k decoded tokens per task on the scorer; N samples × 120 tasks cannot fit 12 h |
| RL (GRPO/PPO) on a 31B model | No single-5090 path to meaningful signal in 6 weeks; no stable rollout infra; violates "cheap & reproducible" |
| **Cross-task state in the sandbox** (time-banking, memory files that survive between tasks) | Containers are pooled and reused, so it may be *technically* possible — but it exploits harness internals, is brittle, and risks disqualification. Not doing it |
| **Gold-patch bypass / eval-harness hacks** (e.g., the public "gold-patch-bypass" kernel referenced in intel §9) | Rules violation risk and useless for hidden-set generalization |
| Exploiting fixed task order (front-loading time on early tasks) | Intel §3 flags this as an unaddressed gaming concern; host hasn't ruled. Use **uniform** caps |
| Closed-API distillation (GPT/Claude/Gemini outputs as training data) | Provider-ToS risk and winner-licence lineage problem `[INTEL #9]` |
| Reusing CVX/Cooly civic stack (SvelteKit, Fastify, Postgres, AGE) | Out of scope, adds weight; see 9/28 plan §3.4 |

---

## 4. Strategy: three tracks and explicit targets

| Track | What | Status |
|---|---|---|
| **A — Harness-hardened prompt/skill agent (no adapter)** | The critical path. Everything in Sprints 1–6 | Always on |
| **B — Measurement & generalization** | Gold-validated pool, regrade pipeline, Forge tasks, cost model | Always on; it is what lets A improve safely |
| **C — LoRA adapter** | RFT data → QLoRA → local eval → Kaggle canary | **Gated**: binary go/no-go at end of Sprint 4; ships only if it beats Track A's best on held-out data |

**Target scenarios** (expected scorer pass rate; `[HYPOTHESIS]`, to be replaced by measured local-to-LB mapping):

| Scenario | Score | What it means |
|---|---|---|
| Floor | ≥ 0.15 | Matches today's top three; achieved by removing plumbing failures and overruns |
| Base | 0.20 | Hardened agent + verification + good budgets |
| Stretch | ≥ 0.25 | Base + a working adapter or an unexpectedly strong protocol |

**Local target ladder** (relative, so it survives the local-vs-LB mapping problem): R0 = official sample agent, R1 = best-public-notebook-style agent, both re-run in *your* pipeline. Targets on the same pool: **S2 ≥ R1 + 3 pp or −50% plumbing failures; S3 ≥ R1 + 6 pp; S5 ≥ R1 + 9 pp.** Gains are not additive; treat as aspirations with kill criteria.

**Honesty clause.** Nobody can promise a win: the field is large (829 teams), the LB is noisy, and host patches may shift the ground mid-flight. The plan maximizes expected score, caps catastrophic risks (overrun, broken package, infra stall), and keeps two diversified final submissions.

---

## 5. "The brain" — specification

### 5.1 Artifact layout (what goes in `submission.zip`)

```
submission/
├── agent.yaml                     # root LlmAgent (single agent by default)
├── eval_config.yaml               # 4 fields only: timeout_seconds, max_tool_calls, max_time_minutes, max_turns
├── configs/sampling.yaml          # temperature, top_p, max_output_tokens, thinking_config
├── prompts/system.md              # protocol P1 (below)
├── sub_agents/                    # empty unless S3 ablation promotes code_analyzer
├── skills/
│   └── bcf_toolkit/
│       ├── SKILL.md               # frontmatter: name: bcf_toolkit
│       ├── scripts/               # find_def.py, edit_lines.py, run_tests.py, finalize.py  (run via run_skill_script)
│       └── resources/             # worked_examples.md (loaded on demand)
└── adapters/                      # only if Track C ships
```

> **Unknowns to settle in Sprint 1 (E-SK1):** whether skill scripts can reach `/workspace`, how arguments are passed, and whether `run_command` can call them by path. `[README]` says skill scripts "share filesystem access with `run_command`" and debit the same budget, but the exact invocation contract is not in my snapshot. If skills prove awkward, the same logic can be pasted as `python - <<'PY'` one-liners inside the prompt.

### 5.2 Design patterns in play (short, with where they appear)

| Pattern | Plain-English meaning | Where it appears |
|---|---|---|
| **Gate** | A step that must pass before the next begins | Orient → Localize → Reproduce → Patch → Verify → Finalize |
| **Circuit breaker** | After N failures of one approach, stop retrying it and switch | Two failed `edit_file` calls → change edit method; three failed verifications → revert and re-hypothesize |
| **Anytime algorithm** | Always holds a usable answer | Valid tree after every edit; salvaged `git diff` on timeout |
| **Progressive disclosure** | Load detail only when needed | Skill resources loaded on demand; short system prompt |
| **Champion/challenger** | New version runs against the current best on identical inputs | Every prompt change vs. the incumbent on the same pool and seeds |
| **Canary release** | Send a tiny safe change through the production path first | Kaggle canary submissions with tiny budgets |
| **Ports & adapters (hexagonal)** | Core logic depends on interfaces, not concrete tools | The `lab` package (§6.5) |
| **Event log / ledger** | Append-only record of what happened | One JSONL/DuckDB row per tool call, per task, per run |
| **Separate generation from grading** | Produce patches once; grade them many ways | The regrade pipeline |

### 5.3 Seed system prompt **P1** (to be tested, not trusted)

```text
You are a senior Python engineer fixing ONE issue in the repository at /workspace.
The environment is offline and all dependencies are installed. Time and tool calls are
limited. Think in a few sentences at most, then call a tool.

WORKFLOW
1. Orient (<=2 calls). Read the issue and hints carefully. Run ONE command that finds candidate
   files (grep -rn for the exact identifiers, error text, or API names from the issue).
2. Localize (<=6 calls). Open the suspect file(s) with read_file (up to 150 lines per call; prefer
   a few large reads to many small ones). State which file and function you will change BEFORE
   editing. Use get_code_neighbors only with an exact symbol you have already found.
3. Reproduce (<=3 calls). Write /tmp/repro.py (never inside /workspace) asserting the behavior the
   issue expects; run it; confirm it fails for the stated reason. If you cannot reproduce in 3
   calls, continue from your reading of the code.
4. Patch. Make the smallest change that fixes the root cause, in the repo's style. Never edit
   tests, conftest.py, pytest.ini, pyproject.toml, setup.cfg. Keep every file syntactically valid
   after each edit.
5. Verify (<=4 calls). Run /tmp/repro.py; run the existing tests for the touched module
   (pytest -x -q <test_file> 2>&1 | tail -n 25); python -m py_compile on changed files; review
   `git diff`.
6. Finish. `git status --short` must list only intended files. Delete stray files. Call
   submit_patch as your LAST action.

EDITING RULES
- Tool results are JSON-escaped: a line break shows as \n and a quote as \". When you write
  old_string, use REAL line breaks and quotes exactly as they appear in the file. Never type
  backslash sequences unless the file itself contains them.
- Prefer one short, distinctive, single-line old_string. Change one small block at a time.
- If edit_file fails twice on the same spot, stop: view the region with `sed -n 'A,Bp' file`
  and apply the change with a line-number sed/python command instead.

EFFICIENCY RULES
- Chain commands with && in one run_command. Always cap output (| head -c 3000, | tail -n 25).
- Never pip install. Never run the whole test suite. Do not use generic words as
  search_similar_code queries.
- Call get_status about every 6 calls. By ~60% of the time you must have a candidate patch in the
  tree; at ~85% stop exploring, verify, and submit.
```

*Why each line exists* is in the experiment registry (§7). Every clause is a hypothesis: **no clause stays without an ablation or a mechanism KPI** backing it.

### 5.4 Sampling / budget starting points (placeholders until Sprint 1 data)

| Parameter | Start | Range to sweep | Rationale |
|---|---|---|---|
| `temperature` | 0.2 | 0 – 0.4 | Default leaves ±4 pp variance; lower may cut variance but risks loops |
| `thinking_config` | `include_thoughts: true`, `thinking_budget: 1024` | off / 512 / 1k / 2k / 4k | Decode-bound (insight 2). **Omit `thinking_level`** with vLLM `[README §2.4]` |
| `max_output_tokens` | 6,144 | 4k – 8k | Avoids huge truncated tool calls (`<|tool_call>` cut-offs) |
| `max_time_minutes` | 4.5 | 3 – 7 | From cost model; see §2 insight 3 |
| `max_turns` | 35 | 25 – 50 | Backstop |
| `max_tool_calls` | 45 | 30 – 60 | Backstop |
| `timeout_seconds` (per command) | 120 | 60 – 300 | A hung test must not eat a whole task |

### 5.5 Known harness gotchas the brain must respect

- Put scratch files in `/tmp`, never `/workspace` (they enter the patch).
- Don't touch `pytest.ini` / `conftest.py` (committed in baseline; changes show up in the diff and are reset anyway).
- `submit_patch()` ends the session — it must be the last action; it is free.
- `search_similar_code` returns full node source uncapped until the host patch lands; queries like `Body` surfaced `APIRouter` (~110k chars). Prefer `get_code_neighbors` (names only) `[INTEL §5]`.
- `read_file` with line ranges reportedly throws `'>' not supported between 'int' and 'str'` (Q7, unverified) → probe on Day 0/Sprint 1; if real, use `sed -n` through `run_command`.

---

## 6. Measurement system

### 6.1 Task pools

| Pool | Size (target) | Use | Rules |
|---|---|---|---|
| **Gold-valid pool (G)** | ≥ 100 of 129 | Everything below is carved from it | Task enters G only if the gold patch passes in the Grader Env |
| **Smoke-12** | 12 (3 per repo) | 20–30 min sanity loop after each change | Re-used freely |
| **Dev-A** | ~60 | Tuning, ablations (3 seeds) | Re-used freely |
| **Dev-B** | ~30 | **Held out**; looked at only at gates (S3, S5, S6) | Never tune on it |
| **Forge (F)** | 100–300 (optional) | Extra repos: power, generalization, LoRA data | Built in S4–S5 from other pure-Python repos; verify F2P/P2P with gold patches |

### 6.2 Two-stage local pipeline (separate generation from grading)

1. **Generate**: run the agent in an environment that mirrors the *scorer's agent phase* (official wheels, offline Docker; also test the subprocess sandbox).
2. **Regrade**: take the collected patches and grade them in the **Grader Env** (extra wheels added, dead tasks excluded). Never let "fixing the grader" change what the agent saw.

### 6.3 KPIs (per run, per task, per repo)

- Outcome: resolved rate (mean over seeds), CI (Wilson / paired bootstrap).
- Plumbing: patch-applies rate · empty-patch rate · `edit_file` failure rate (and "escaping-caused") · context-overflow count · timeout count · nudge count · tool-call truncation count · scratch-in-patch · protected-file-touched.
- Efficiency: turns, tool calls, decoded tokens, prefill tokens, wall-clock p50/p90, **time-to-first-edit**, fraction of tasks with a candidate patch by 60% of time.
- Behavior: repro attempted / reproduced · tests run before submit · `py_compile` before submit.

### 6.4 Statistics and promotion rules (how to decide under noise)

`[DERIVED]` With 90 tasks × 3 seeds and a per-task SD of the mean difference ≈ 0.25–0.30, the standard error of a paired difference is ≈ 0.026–0.032, so the **minimum detectable effect at 80% power is ≈ 7–9 pp**. A single-seed comparison is far weaker. More tasks (Forge: n ≈ 300) drops the MDE toward ≈ 4–5 pp.

So **promotion is not "p < 0.05"**. A change is promoted when all of these hold:

1. **Mechanism**: a named failure mode or KPI that the change targets, with a measured improvement (e.g., edit-failure rate down ≥ 50%).
2. **Non-inferiority**: paired bootstrap, one-sided 80% lower bound on Δ(resolved) ≥ −1 pp on Dev-A; no regression > 1 pp on Smoke-12.
3. **Safety**: projected full-run time at p95 ≤ 10 h via the cost model; no new package-validity risk.
4. **Diff journal entry** written (your standing rule).

> **Concept — non-inferiority.** When you can't prove a change helps, you may still adopt it if you can show it doesn't hurt *and* you have a mechanism. It is how regulators and A/B-testing teams handle underpowered experiments.

### 6.5 The `lab` package (SOLID in practice)

| Principle | Concrete rule in this codebase |
|---|---|
| **S**ingle responsibility | `TaskStore` loads tasks; `Runner` executes an agent; `Grader` grades patches; `Ledger` records events; `Reporter` renders tables — five classes, five reasons to change |
| **O**pen/closed | A new experiment = a new YAML `VariantSpec`, not a code edit |
| **L**iskov substitution | `DockerRunner` and `SubprocessRunner` are interchangeable behind `Runner` |
| **I**nterface segregation | `Grader` exposes only `grade(patch, task) -> Result`; no runner internals leak |
| **D**ependency inversion | `Experiment` depends on `Runner`/`Grader`/`Ledger` *interfaces*; concrete classes are injected at the CLI edge |

Data structures that earn their place: DuckDB tables (columnar analytics over JSONL traces), a **min-heap / top-k** for ranking failure clusters, a **trie or suffix map** for symbol resolution in `find_def.py`, **BFS with depth/edge-type pruning** for ego-subgraphs, an **LRU cache** for repeated graph loads.

---

## 7. Experiment registry

| ID | Question | Design | KPI | Sprint |
|---|---|---|---|---|
| E0 | What are 5090 and L4×4 throughput, KV capacity, and concurrency scaling? | `vllm` logs, tok/s at concurrency 1–4; Kaggle 20-task calibration | tok/s, KV tokens | D0/S1 |
| E1 | Where do R0 and R1 land, and how noisy? | 3 seeds × Dev-A | resolved, CI, failure taxonomy | S1 |
| E2 | Which edit protocol minimizes failures? | `edit_file`-only vs anchored vs line-number sed/python vs `write_file` for small files | edit-fail rate | S2 |
| E3 | Thinking policy | off / 512 / 1k / 2k / 4k | resolved, time/task, truncation | S2 lite, S5 final |
| E4 | Temperature | 0 / 0.2 / 0.4 | resolved, variance | S5 |
| E5 | Time-cap curve | one 30-min-budget run → CDF of "resolved by time t" | optimal `T` | S4 |
| E6 | Topology | T0 single · T1 + `code_analyzer` · T2 Analyst→Fixer · T3 + `LoopAgent` | resolved, time | S3 |
| E7 | Skill scripts vs pure prompt | with/without `bcf_toolkit` | edit-fail, turns | S3 |
| E8 | Graph tools policy | none / neighbors-only / all | overflow, turns | S3 |
| E9 | Context economy rules | with/without B03 | prefill tokens, compactions | S2 |
| E10 | Repro-first and test-before-submit | on/off | resolved, time | S3 |
| E11 | Breakers / rescue | on/off | loop rate, resolved | S4 |
| E12 | LoRA via RFT | base vs adapter, ≥ 3 seeds, Dev-B + Forge | resolved, format errors | S4–S5 |
| E13 | Environment sensitivity | Docker vs subprocess sandbox; seeds | delta | S1, S6 |
| E14 | Full-length safety | cost-model projection + real scored run | projected p95 hours | S4, S6 |
| E15 | Leave-one-component-out from the final stack | drop each protocol clause | resolved | S5 |

---

## 8. Roadmap and milestones

Assumed effort: **~20 h/week** (range 15–25) plus unattended overnight GPU runs; Day 0 is a full day. Dates are US-calendar, sprints run Friday → Thursday.

| Milestone | Date | Definition (binary) | Gate owner |
|---|---|---|---|
| **M0 Environment Ready** | Thu Oct 1 (Day 0) | vLLM serves the 31B model on the 5090 in WSL2; KV tokens and tok/s recorded; one task runs end-to-end through the harness in Docker and subprocess; a no-op `submission.zip` validates; `ENV.lock.json` committed | You |
| **M1 Trusted Measurement** | Thu Oct 8 (S1 end) | Gold-valid pool built; Smoke-12/Dev-A/Dev-B frozen; R0 and R1 baselines (3 seeds + CI); cost model v0 from an L4×4 calibration run; failure taxonomy v0; Q7 resolved | You |
| **M2 Harness-Hardened Agent v1** | Thu Oct 15 (S2 end) | Agent v1 meets §6.4 gates vs R1; plumbing failures halved; submission #2 accepted | You |
| **M3 Localize & Verify v2** | Thu Oct 22 (S3 end) | Topology decision recorded; repro/test gates and skills evaluated; first Dev-B look shows no overfit | You |
| **M4 Reliability, Time, LoRA Decision** | Thu Oct 29 (S4 end) | Breakers in; cap `T` chosen from cost model with p95 ≤ 10 h; LoRA go/no-go memo; adapter canary (if go) submitted | You |
| **M5 Optimized RC1** | Thu Nov 5 (S5 end) | Sampling/thinking finalized; leave-one-out done; generalization checks done; RC1 frozen and submitted | You |
| **M6 Release Candidate Final** | Thu Nov 12 (S6 end) | Clean-room rebuild passes; all host-patch re-probes done; two finalist configs named; reproducibility package built | You |
| **M7 Final Selection** | Nov 13 → Dec 2 | Last new submission ≤ **Nov 27**; hard freeze **Nov 28**; rescoring buffer Nov 28–30; select 2 finals in Kaggle UI by **Dec 1**; Dec 2 is admin-only | You |

**Submission supply model** (1/day allowed; ≤ ~1 full-length/week if quota deduction is real `[INTEL §8]`): Oct 2 canary #1 · Oct 14 v1 · Oct 21 v2 · Oct 28 v3 (+ adapter canary if go) · Nov 4 RC1 · Nov 11 RC2 · Nov 20 (post-patch re-baseline, if needed) · Nov 27 finals. The first canary also **measures** real queue time and quota deduction, which resets this table.

---

## 9. Master checklist

> Convention: `[ ]` todo · IDs are stable (use them in the diff journal and commit messages). Every checkbox is binary — if you can't tell whether it's done, rewrite it.

### M0 — Environment Ready (Day 0, Oct 1)
- [ ] **M0-01** Accept the competition rules on Kaggle with your single account (human step, needed before data download)
- [ ] **M0-02** BIOS: update MSI X870E firmware; enable EXPO (DDR5-6000), SVM/virtualization, Above-4G/ReBAR; set iGPU as display adapter if the board exposes video out
- [ ] **M0-03** Windows 11 fully updated; AMD chipset driver; latest NVIDIA production driver (Blackwell needs a recent R570+ branch); disable auto-restart; High-performance power plan; no sleep
- [ ] **M0-04** WSL2 + Ubuntu 24.04; `.wslconfig` tuned; `nvidia-smi` works inside WSL
- [ ] **M0-05** Docker Engine inside WSL2; `docker run --network none` smoke test
- [ ] **M0-06** `uv`, git, repo `bcf-gemma-agent/` with directory skeleton and diff-journal hook
- [ ] **M0-07** Kaggle CLI authenticated; competition data, wheelhouse (v25+) and model downloaded; SHA-256 manifest written
- [ ] **M0-08** Wheelhouse installed in a dedicated venv; `import swegemma, adk_submission` succeeds
- [ ] **M0-09** vLLM serves `gemma-4-31b-it-qat-w4a16-ct`; **KV-cache tokens, tok/s at concurrency 1–4 recorded**
- [ ] **M0-10** `swebench-sandbox:latest` built; 1 task runs end-to-end (Docker **and** subprocess)
- [ ] **M0-11** No-op `submission.zip` passes the local validator (size, extensions, single model)
- [ ] **M0-12** `ENV.lock.json` + `PARITY.md` (local vs scorer differences) committed
- [ ] **M0-13** AUX2 (grader farm) and AUX1 (command center) reachable over SSH/Tailscale; roles in `02-…` §1
- [ ] **M0-14** Nightly backup of `runs/`, `journal/`, `submission/` to AUX2 HDD
- [ ] **M0-15** Canary #1 (official sample, no adapters, tight caps) queued

### M1 — Trusted Measurement (Sprint 1)
- [ ] **M1-01** Gold-patch audit matrix: {Docker, subprocess, Kaggle-like image} × 129 tasks → `gold_matrix.csv`
- [ ] **M1-02** Grader Env: add missing wheels (`typing_inspection, inline-snapshot, dirty-equals, ujson, orjson, python-multipart`…), fix starlette pinning per task; re-audit
- [ ] **M1-03** `gold_valid.json` (target ≥ 100 tasks) and `dead_tasks.md` (known dead: 8 requests SSL, 3 version-gated, 1 error-string drift)
- [ ] **M1-04** Splits frozen with hashes: Smoke-12, Dev-A (~60), Dev-B (~30)
- [ ] **M1-05** `lab` package skeleton: TaskStore/Runner/Grader/Ledger/Reporter + tests
- [ ] **M1-06** Regrade pipeline: patches → Grader Env → `results.jsonl`
- [ ] **M1-07** Trace → DuckDB ingestion (ATIF `traces/*.json`)
- [ ] **M1-08** R0 (official sample) ×3 seeds on Dev-A with CI
- [ ] **M1-09** R1 (best-public-notebook-style) ×3 seeds on Dev-A with CI
- [ ] **M1-10** Failure taxonomy v0 from ≥ 30 manually labeled trajectories (top-5 failure modes quantified)
- [ ] **M1-11** Host-bug probes: escaping rate, `read_file` ranges (Q7), thinking drop, `search_similar_code` size; results in `BUGS.md`
- [ ] **M1-12** Skill-script contract test (E-SK1): can a script run, see `/workspace`, receive args?
- [ ] **M1-13** Kaggle L4×4 calibration run (~20 tasks): tok/s, compaction events, per-task time → cost model v0
- [ ] **M1-14** Canary #1 scored or queue status logged; quota deduction measured
- [ ] **M1-15** Sprint review + retro + diff journal

### M2 — Harness-Hardened Agent v1 (Sprint 2)
- [ ] **M2-01** Protocol P1 in `prompts/system.md`; tool list trimmed to what is used
- [ ] **M2-02** E2 edit-protocol experiment done; winner recorded
- [ ] **M2-03** Output-cap and batching rules (B03) in prompt; E9 measured
- [ ] **M2-04** Finalize gate (B04) in prompt or skill script
- [ ] **M2-05** `eval_config.yaml` v1 (conservative caps) and in-prompt phase deadlines
- [ ] **M2-06** Thinking policy lite sweep (off vs 1k) 
- [ ] **M2-07** Sampling config v1; `max_output_tokens` set to avoid tool-call truncation
- [ ] **M2-08** v1 vs R1 on Dev-A ×3 seeds; gates in §6.4 evaluated
- [ ] **M2-09** Projected full-run time (cost model) ≤ 9.5 h
- [ ] **M2-10** Submission #2 (v1) packaged, validated, submitted
- [ ] **M2-11** Host-patch re-probe (thinking, escaping, caps) logged
- [ ] **M2-12** Sprint review + diff journal

### M3 — Localize & Verify v2 (Sprint 3)
- [ ] **M3-01** `find_def.py` (AST def/class lookup + grep callers), tested on 5 repos
- [ ] **M3-02** Repro-first + targeted-test selection (B05/B06) with tail-capped outputs
- [ ] **M3-03** Worked-example resources (B22), ≤ 3 examples, ≤ 1.5k tokens each
- [ ] **M3-04** E6 topology comparison (T0–T3) complete; decision written
- [ ] **M3-05** E7/E8 (skills, graph policy) complete
- [ ] **M3-06** First Dev-B look: gap vs Dev-A < 5 pp
- [ ] **M3-07** Submission #3 (v2)
- [ ] **M3-08** Sprint review + diff journal

### M4 — Reliability, Time Economy, LoRA Decision (Sprint 4)
- [ ] **M4-01** Circuit breakers (B11) in prompt; E11 measured
- [ ] **M4-02** E5 time-cap curve from a 30-min-budget run; cost model v1 (prefill/decode/tool terms)
- [ ] **M4-03** Cap `T` chosen by chance-constrained rule; p95 total ≤ 10 h
- [ ] **M4-04** Forge pipeline v0 (≥ 50 verified extra-repo tasks)
- [ ] **M4-05** RFT trajectory harvest started; train–serve parity check (logprob comparison) passes
- [ ] **M4-06** LoRA pipeline smoke train on ≤ 50 samples (r = 16) loads in wheelhouse vLLM
- [ ] **M4-07** Adapter canary spec (loud adapter + long-prompt stress) ready
- [ ] **M4-08** **LoRA go/no-go memo** with binary criteria (02 §S4)
- [ ] **M4-09** Submission #4 (v3); canary submitted if host patches deployed
- [ ] **M4-10** Sprint review + diff journal

### M5 — Optimized RC1 (Sprint 5)
- [ ] **M5-01** Thinking and temperature sweeps on the best stack (E3, E4)
- [ ] **M5-02** Leave-one-component-out (E15)
- [ ] **M5-03** Leave-one-repo-out and Forge evaluation
- [ ] **M5-04** If go: full LoRA training; ≥ 3-seed Dev-B + Forge comparison; ship/no-ship recorded
- [ ] **M5-05** RC1 frozen (git tag) and submitted (#5)
- [ ] **M5-06** Dev-B second look; KPI dashboard snapshot

### M6 — Release Candidate Final (Sprint 6)
- [ ] **M6-01** Re-probe all host patches; rerun Smoke-12 + Dev-A on patched behavior
- [ ] **M6-02** Regression suite: Smoke-12 must not drop > 1 pp vs RC1
- [ ] **M6-03** Clean-room rebuild on AUX2 from a fresh clone (package, validate, small run)
- [ ] **M6-04** Timing safety: cost-model p95 and latest real scored run agree within 15%
- [ ] **M6-05** Licence (Apache-2.0 or OSI equivalent), README, reproducibility package, winner-documentation draft
- [ ] **M6-06** Finalist A (robust no-adapter) and Finalist B (diversified) named
- [ ] **M6-07** RC2 submitted (#6/#7)
- [ ] **M6-08** Optional paper spin-off decision (Nov 12)

### M7 — Final Selection (Nov 13 – Dec 2)
- [ ] **M7-01** Weekly intel sweeps; re-validate after any host patch
- [ ] **M7-02** Verify entry acceptance before **Nov 25** (and team merges, if any)
- [ ] **M7-03** Last new submission in by **Nov 27**
- [ ] **M7-04** Freeze **Nov 28**; rescoring buffer to Nov 30
- [ ] **M7-05** Select 2 final submissions in the Kaggle UI by **Dec 1**
- [ ] **M7-06** Winner-obligation packet ready (code, training/inference description, environment)

---

## 10. Subject-matter experts (SMEs) — the hats, and what each one checks

You are a one-person team; these are the hats to wear (or to ask me to wear in a dedicated session). Each has a scope, a first question, and an artifact they own.

| SME hat | Scope | The question they always ask | Owns |
|---|---|---|---|
| **LLM serving engineer** (vLLM, CUDA, Blackwell) | WSL2 GPU, vLLM build, KV sizing, LoRA serving, fp8 KV | "What is the KV-cache token count and is this the same kernel path as the scorer?" | `ENV.lock.json`, `serve_local.py` |
| **Agent-harness engineer** (Google ADK, LiteLLM, YAML compiler) | Agent config, tools, skills, compaction, nudges | "What exactly does the harness send to the model on turn N?" | `agent.yaml`, `PARITY.md` |
| **SWE-bench / eval scientist** | Gold-validation, Fail-to-Pass / Pass-to-Pass, contamination, dead tasks | "Does the gold patch pass here? Could the test be skipped or flaky?" | `gold_matrix.csv`, Grader Env |
| **Statistician** | Noise, power, paired tests, non-inferiority, multiple comparisons | "What's the standard error, and how many looks have we taken?" | §6.4, promotion rules |
| **Prompt & context engineer** | Protocol, token economy, symbol/escaping handling | "How many tokens does each instruction cost, and which KPI does it move?" | `prompts/`, experiment registry |
| **PEFT / fine-tuning engineer** | RFT data, QLoRA, chat-template parity, adapter sizing | "Is the training template byte-identical to what vLLM renders at inference?" | Track C pipeline |
| **Python packaging & test-infra specialist** | Wheels, pins, pytest behavior, Python 3.13 quirks | "Which dependency version did this commit expect?" | Grader Env, Forge |
| **Windows/WSL2/DevOps** | Drivers, Docker, networking, backups, thermals | "What happens on reboot, sleep, or a Windows Update tonight?" | Day-0 runbook |
| **OSINT / intel analyst** | Forum monitoring, source grading, change detection | "Who said it, how do they know, and is it confirmed live?" | §11 |
| **Software architect (SOLID/patterns)** | `lab` package design, simplicity | "What changes when we add a variant — code or config?" | `lab/` |
| **Release manager** | Packaging, licence, reproducibility, freeze discipline | "Can a stranger rebuild this from a fresh clone?" | M6 |

---

## 11. Intel desk (OSINT procedure)

> **Concept — OSINT.** Open-source intelligence: turning public information into decisions. Its core discipline is *grading sources and claims separately* and logging when you learned each thing.

**Sources (all public, no logins beyond your own Kaggle):** competition Discussion tab, Code tab (new public notebooks), Leaderboard, Models/Datasets pages (wheelhouse version changes), Kaggle staff posts. Polite cadence: serial fetches with ≥ 25 s spacing (the rate-limit lesson in your intel file). No scraping behind authentication, no DMs fishing for hidden-set details.

**Grading — Admiralty (NATO) system.** Source reliability **A–F** (A completely reliable … F cannot be judged); information credibility **1–6** (1 confirmed … 6 cannot be judged). Mapping to your intel file's confidence key:

| Your key | Admiralty |
|---|---|
| Host-stated (staff) | A1–B2 (A2 if unconfirmed live) |
| Reproduced by ≥ 2 participants | B2–C2 |
| Single-participant repro | C3 |
| Unverified | F6 / C4 |

**Cadence:** 2×/week in Sprints 1–3, daily in Sprints 4–6 and the reserve window, plus an immediate sweep after any wheelhouse version bump.

**Trigger → action table (extends intel §2):**

| Trigger seen | Action |
|---|---|
| Wheelhouse version bump | Reinstall in a *fresh* venv; diff vLLM/ADK files vs. previous; rerun Smoke-12; log in `PARITY.md` |
| Thinking patch deployed (744354) | Re-probe thinking on/off on Smoke-12 (check that previous thoughts appear in the next prompt); **re-run E3**; don't compare scores across the patch |
| Double-JSON fix deployed (744272) | Re-measure edit failure rate; if raw-text, keep anchored-edit rules but drop redundant workarounds only if KPI equal; if single-JSON, **expect edit failures to rise** (62% in the experiment) and strengthen line-number edits |
| `search_similar_code` cap deployed (744577) | Re-run E8; consider re-enabling as a secondary locator |
| LoRA KV sizing deployed (744331) | Run the adapter canary (long prompt >8k tokens + loud adapter) before any adapter submission |
| Overrun → score-as-zero fix live (743063) | Keep caps anyway; relax margin slightly only after one full-length scored run confirms |
| Host answers task-order / public-first question | Re-evaluate uniform-cap policy; do **not** exploit ordering |
| Rescore/backlog news (743683) | Expect leaderboard shifts not caused by participants; don't chase |
| New top public notebook ≥ 0.15 | Fork its *ideas* into Dev-A as a challenger (respecting the private-sharing rule: public notebooks only) |
| Q7 (`read_file` ranges) confirmed | Move all range reads to `sed -n` through `run_command` |

---

## 12. Risk register

| # | Risk | P | Impact | Early signal | Mitigation |
|---|---|---|---|---|---|
| R1 | 12 h overrun errors the entire run | M | **Catastrophic** | Cost-model p95 > 10 h | Chance-constrained caps; `max_time_minutes`; real full-length scored run by S4; margin ≥ 1.5 h |
| R2 | 5090 cannot reproduce 32k context | M | High | KV tokens < 24k on Day 0 | fp8 KV, iGPU display, Kaggle L4×4 for fidelity runs |
| R3 | vLLM wheel lacks Blackwell (sm_120) kernels | M | High | Import/launch errors on Day 0 | Build vLLM from source at the same version with the wheelhouse's Gemma-4 LoRA patch; fallback: Kaggle-only serving + rented GPU |
| R4 | Local CV misleads (env differences) | H | High | CV ↔ LB anti-correlation | Gold-valid pool, regrade pipeline, `PARITY.md`, Docker-vs-subprocess tests |
| R5 | Host patches change behavior mid-flight (thinking, escaping) | H | Med | Intel triggers | Protocol robust to both states; re-probe gates |
| R6 | LoRA path never works on the scorer | M | Med | Canary fails or stalls | Track C is gated; Track A is complete without it |
| R7 | Package invalid at the last minute | L | **Catastrophic** | — | Local validator from Day 0; clean-room rebuild in S6; last new submission Nov 27 |
| R8 | Overfitting to 129 public tasks | H | Med | Dev-A ≫ Dev-B, per-repo gaps | Dev-B holdout, leave-one-repo-out, Forge |
| R9 | Solo bandwidth / day-job interruptions | H | Med | Sprint slips >2 days | Cut order: (1) LoRA, (2) Forge, (3) topology ablations, (4) fine sweeps. **Never cut**: gold-valid pool, regrade, budget governor, finalize gate, clean-room rebuild |
| R10 | Thermal/power trouble on overnight runs | M | Med | GPU > 83 °C, WSL crashes | Power-limit the 5090 (~450–500 W), monitor, fans, AUX2 550 W PSU kept CPU-only |
| R11 | Quota/queue starve submissions | M | Med | Canary queue > 12 h | Fewer, better-chosen submissions; cheaper (shorter) runs via tighter caps |
| R12 | Rules/licensing breach | L | **Catastrophic** | — | One account, no private code sharing, no closed-API distillation, no harness hacks, OSI licence from Day 1 |

---

## Appendix A — Concept primer (obscure terms, plainly)

| Term | Explanation |
|---|---|
| **ADK (Agent Development Kit)** | Google's framework for building LLM agents (agents, tools, sub-agents, sessions). The competition compiles your YAML into ADK agents. |
| **LiteLLM** | A library that gives one interface to many model providers; here it talks to the local vLLM OpenAI-compatible endpoint. |
| **vLLM / PagedAttention / KV cache** | vLLM is a fast inference server. The **KV cache** stores each token's attention keys/values so the model needn't recompute them; PagedAttention manages it in blocks like virtual memory. KV memory, not weights, limits context length and concurrency. |
| **Tensor parallelism (TP)** | Splitting each layer's matrices across GPUs (TP=4 on the scorer). Needs fast interconnect; L4s use PCIe, so all-reduce costs latency. |
| **QAT, W4A16, compressed-tensors** | *Quantization-aware training* tunes the model for low precision; *W4A16* = 4-bit weights with 16-bit activations; *compressed-tensors* is the on-disk format. Your LoRA trained on a bf16 base and served on this base has a small **train–serve skew** to test. |
| **YOCO (as it shows up in the bug reports)** | "You Only Cache Once"-style layer sharing: some layers reuse earlier layers' KV. Gemma 4's layers are registered under two names (a direct name and an alias), which is what zeroed LoRA weights in 743508. `[my understanding; verify against the thread]` |
| **LoRA / QLoRA / rank** | Train small low-rank matrices added to frozen weights (adapter). QLoRA trains them over a 4-bit-quantized base. Rank r sets adapter size and capacity (r=16 ≈ 110–220 MB here). |
| **PEFT** | Hugging Face library implementing LoRA-style methods. |
| **RFT / rejection sampling** | Sample many attempts, keep only those that pass tests, fine-tune on the keepers. Simple, stable, weaker than RL but far cheaper. |
| **Distillation** | Training on another model's outputs. License and terms-of-service of the teacher matter. |
| **F2P / P2P** | *Fail-to-Pass* tests fail before the fix and pass after; *Pass-to-Pass* must keep passing. Both must pass for a task to count. |
| **Gold patch** | The reference (true) fix. If it fails in your environment, your grader is broken, not the task. |
| **Wheelhouse** | A folder of pre-built Python wheels installed offline. The host's includes a patched vLLM. |
| **Compaction** | ADK summarizes older events once context passes a threshold (14,336 tokens). Summaries cost decode time and lose detail. |
| **Prefix caching** | vLLM reuses computed KV for identical prompt prefixes. Keep the system prompt stable and put variable text last. |
| **Pass@1, pass@k** | Probability a single attempt / at least one of k attempts succeeds. The competition scores one attempt per task. |
| **Wilson interval** | A confidence interval for proportions that behaves well for small n and extreme p. |
| **McNemar / paired bootstrap** | Paired tests for "same tasks, two configs" comparisons, using only the tasks where the configs disagree or resampling task-level differences. |
| **Winner's curse** | The top of a noisy ranking is biased upward: part of the score is luck. |
| **Admiralty code** | Two-part intel grade (source A–F, information 1–6). |
| **Chance-constrained optimization** | Maximize an objective subject to a constraint that holds with high probability (e.g., "total time under 10.5 h with 99% confidence"). |
| **Anytime algorithm** | Yields a valid answer at any stopping point, improving with more time. |

## Appendix B — How an LLM "sees" symbols, and why edits fail

1. **Tokens are byte-pair chunks, not characters.** A real newline, the two characters `\` + `n`, and the four characters `\\n` are *different token sequences*. Models blur them when copying.
2. **Double JSON encoding** (your intel 744272): the file's real newline becomes `\n` after the first encoding and `\\n` after the second. The model reads `\\n` in its observation and, when composing `old_string`, often types those backslashes literally → "old_string not found." In the controlled test: double-JSON 22% failures, single-JSON **62%** (because `\n` looks like an ordinary Python escape and is unescaped inconsistently), raw text **0%**.
3. **Whitespace runs** (indentation) tokenize into variable-length chunks; counting 12 vs 16 spaces is error-prone. Anchors built from distinctive identifiers (`def _prepare_response_content(`) beat anchors built from indentation.
4. **Special tokens** such as the tool-call delimiters and thought channels are multi-token control markers; if generation stops at `max_output_tokens` mid-marker, the parser sees an unclosed tag (the harness even has a dedicated nudge for that).
5. **Quoting hazards in shell**: use `<<'EOF'` (quoted) heredocs so `$`, backticks, and backslashes aren't interpreted; prefer `python - <<'PY'` for multi-line edits; avoid `sed` with `/` delimiters when the pattern contains `/` (use `|`).
6. **Practical rules that follow**: single-line anchors; edit small blocks; verify with `git diff --stat` after every edit; when two `edit_file` attempts fail, switch methods rather than retrying.

---
*End of 01. Next: `02-master-plan-day0-six-sprints_v2.md` (Day-0 runbook and the six sprints).*


---

<!-- ====================================================================== -->
<!-- FILE: 02-master-plan-day0-six-sprints_v2.md -->
<!-- ====================================================================== -->

# 02 — Master Plan: Day 0 bare-metal → six one-week sprints → final submission (v2)
### Gemma 4 Developer Agent (Kaggle)

*Prepared 2026-09-30. Owner: Cooly. Companion to `01-roadmap-and-master-checklist_v2.md` (IDs like `M0-07` refer to its checklist; evidence tags `[RULES] [README] [NB] [INTEL] [DERIVED] [HYPOTHESIS] [UNVERIFIED]` mean the same here).*

**Preservation note (standing rule).** This file does not overwrite the earlier `02-master-plan-day0-six-sprints.md`. Changes versus the 9/28 plan and intel §11 are in the change journal of file 01 (§0). Section 5.3 below installs a git hook that writes a full diff journal for every future change to the plan, prompts, and code.

---

## 0. Calendar and assumptions

| Block | Dates | Notes |
|---|---|---|
| **Day 0** | Thu Oct 1 | Full day (~10–11 h): bare metal → working rig |
| **Sprint 1** | Fri Oct 2 – Thu Oct 8 | Trusted measurement & baselines |
| **Sprint 2** | Fri Oct 9 – Thu Oct 15 | Harden the basics → Agent v1 |
| **Sprint 3** | Fri Oct 16 – Thu Oct 22 | Localize & verify → v2 |
| **Sprint 4** | Fri Oct 23 – Thu Oct 29 | Reliability, time economy, LoRA decision → v3 |
| **Sprint 5** | Fri Oct 30 – Thu Nov 5 | Optimize & generalize → RC1 |
| **Sprint 6** | Fri Nov 6 – Thu Nov 12 | Release-candidate hardening → RC-final |
| **Reserve window** | Fri Nov 13 – Wed Dec 2 | Patch re-validation, final submissions, selection |
| Hard dates | Nov 12 (paper, optional) · **Nov 25** entry/merger · **Nov 27** my last new submission · **Nov 28** freeze · **Dec 1** select 2 finals · **Dec 2 23:59 UTC** deadline | Dec 2 23:59 UTC = 6:59 pm US Eastern / 5:59 pm Central |

**Assumptions:** ~20 h/week of your attention (15–25 works), unattended GPU runs overnight and on weekends; Kaggle's submission day boundary is 00:00 UTC (8 pm US Eastern while daylight saving lasts, 7 pm after Nov 1). Daylight saving ends Sun Nov 1 — check that your cron/scheduler times still mean what you think.

**How to use this file.** Each sprint has: goal → mentor note → day-by-day table → experiments → deliverables → **gate** (binary) → cut list → watch list. If the gate fails, don't start the next sprint's work until you've written a one-paragraph decision (continue / re-plan / cut), in `journal/decisions.md`.

---

## 1. Hardware roles

| Machine | Role | Why | Do not |
|---|---|---|---|
| **MAIN** — Ryzen 9 9950X3D, 64 GB DDR5, RTX 5090 32 GB, 2 TB NVMe, Win11 Pro | **Workhorse**: WSL2 + vLLM + the harness; generation runs; LoRA training; all Day-0 fidelity gates | Only machine that can host the 31B model | Don't run the graders here during generation if CPU contention slows vLLM (keep ≤ 8 sandbox vCPUs busy while generating) |
| **AUX2** — i7-12700F, 64 GB, RTX 3080 10 GB, 512 GB SSD + 2 TB HDD, 550 W PSU, Win (assume 10/11) | **Grader farm + archive**: Phase-2 regrading in Docker (CPU-bound, 2 vCPU + 4 GB per container, ~5 parallel), gold-patch audits, nightly backup target (HDD), Forge task mining/verification, Langfuse/DuckDB services if ever needed | CPU cores and RAM are what grading needs; the 3080 can run small-model plumbing tests (E2B/E4B) | Don't run GPU-heavy + CPU-heavy simultaneously (550 W) |
| **AUX1** — ProArt P16, Ryzen AI 9 HX 370, RTX 4060 8 GB, 32 GB, Win11 Home | **Command center**: VS Code/Claude Code remote into MAIN's WSL, dashboards, intel sweeps, writing; small-model smoke tests | Portable; Home edition runs WSL2 and Docker Desktop fine but cannot host Remote Desktop | Don't train or serve on it; don't run it hot for hours |
| **Kaggle L4×4** | **Fidelity reference**: calibration runs, timing, real scorer behavior | The only place with the scorer's hardware | Don't burn quota on hill-climbing |

**Networking:** put all three on the same LAN with static IPs (or Tailscale). Use SSH keys; sync `runs/` from MAIN to AUX2 with `rsync -a --partial`; Git for code/prompts.

---

## 2. Day 0 — Thursday Oct 1: bare metal to working rig

> **Goal (M0):** by the end of the day you can (1) serve the required 31B model on the 5090, (2) run one task through the real harness in Docker and subprocess sandboxes, (3) package and locally validate a `submission.zip`, (4) say how many KV-cache tokens you have, and (5) have it all captured in a lockfile.
> **Time-box rule:** no install path gets more than 90 minutes. If it blows the box, take the next fallback (§2.6).

### 2.1 Timeline

| Time (local) | Block | Output |
|---|---|---|
| 08:00–08:30 | **Pre-flight** (human steps) | Rules accepted on Kaggle; `kaggle.json` created; dataset + wheelhouse + model downloads **started on AUX2** (idle machine, parallel to your BIOS work) |
| 08:30–10:00 | **A. Firmware, drivers, Windows** | M0-02, M0-03 |
| 10:00–11:30 | **B. WSL2, Docker, uv, repo** | M0-04, M0-05, M0-06 |
| 11:30–13:00 | **C. Data, wheelhouse env, sandbox image** | M0-07, M0-08, part of M0-10 |
| 13:00–13:45 | Lunch / buffer | — |
| 13:45–15:45 | **D. Serve the model; KV gate; throughput** | M0-09 |
| 15:45–17:15 | **E. Harness smoke test (Docker + subprocess)** | M0-10 |
| 17:15–18:15 | **F. Validator, lockfile, parity ledger, first commit** | M0-11, M0-12 |
| 18:15–19:15 | **G. Aux machines, backups** | M0-13, M0-14 |
| 19:15–19:45 | **H. Canary #1 package** (submit now if before 00:00 UTC, else Oct 2 morning) | M0-15 |

### 2.2 Block A — firmware, drivers, Windows (MAIN)

1. **BIOS** (MSI X870E Tomahawk): update via M-Flash from a FAT32 USB stick. Then set: EXPO profile for DDR5-6000; **SVM Mode = Enabled** (needed for WSL2/Docker); Resizable BAR and Above-4G decoding Enabled; leave PBO/undervolt at defaults for the first week (stability beats 2%).
2. **Display on the iGPU (optional, worth ~1–2 GB VRAM):** if your board exposes video output, enable integrated graphics (Initiate Graphic Adapter = IGD), plug the monitor into the motherboard output, and leave the 5090 headless. `[HYPOTHESIS]` saves VRAM that vLLM can use for KV cache.
3. **Windows 11 Pro:** install all updates; then
   - AMD chipset driver (from AMD), latest NVIDIA **production-branch** driver (Blackwell needs a recent R570+ generation driver; verify with `nvidia-smi` showing a CUDA version ≥ 12.8).
   - Power: High performance; never sleep on AC (`powercfg /change standby-timeout-ac 0`; `powercfg /change monitor-timeout-ac 0`).
   - **Stop surprise reboots** (Pro only): `gpedit.msc` → Computer Config → Administrative Templates → Windows Components → Windows Update → *No auto-restart with logged on users…* = Enabled.
4. **Thermals/power safety for overnight runs:** set the 5090 power limit to ~80–85% (MSI Afterburner slider, or `nvidia-smi -pl 480` from an admin shell after confirming the supported range with `nvidia-smi -q -d POWER`). Note baseline idle/load temperatures in `docs/ENV.lock.json`.

### 2.3 Block B — WSL2, Docker, tooling (MAIN)

```powershell
# Admin PowerShell
wsl --install -d Ubuntu-24.04
wsl --update
```

Create `C:\Users\<you>\.wslconfig`:

```ini
[wsl2]
memory=48GB
processors=24
swap=16GB
[experimental]
sparseVhd=true
```

Inside Ubuntu (first run), enable systemd and install the basics:

```bash
sudo tee /etc/wsl.conf >/dev/null <<'EOF'
[boot]
systemd=true
EOF
# (from PowerShell: wsl --shutdown, then reopen Ubuntu)

sudo apt update && sudo apt -y upgrade
sudo apt -y install build-essential git curl unzip jq tmux htop rsync ca-certificates pkg-config
curl -LsSf https://astral.sh/uv/install.sh | sh          # uv: fast Python/venv manager
curl -fsSL https://get.docker.com | sudo sh               # Docker Engine inside WSL2
sudo usermod -aG docker $USER && newgrp docker
nvidia-smi                                                # must show the 5090 inside WSL
docker run --rm --network none alpine sh -c 'wget -T2 -qO- http://1.1.1.1 || echo "offline OK"'
```

Keep **everything** under `~/` (ext4), never under `/mnt/c` — file I/O through the Windows mount is many times slower and breaks permissions.

Repo skeleton:

```bash
mkdir -p ~/bcf-gemma-agent && cd ~/bcf-gemma-agent && git init
mkdir -p submission/{prompts,configs,sub_agents,skills/bcf_toolkit/{scripts,resources}} \
         lab scripts splits runs journal docs
git add -A && git commit -m "D0: repo skeleton" --allow-empty
```

### 2.4 Block C — data, environment, sandbox image

Downloads (run on AUX2 first, then `rsync` to MAIN `~/data/gemma4/`; check slugs on the dataset/model pages):

```bash
uv tool install kaggle && mkdir -p ~/.kaggle && chmod 600 ~/.kaggle/kaggle.json
kaggle competitions download -c gemma-4-developer-agent -p ~/data/gemma4 && unzip -q ~/data/gemma4/*.zip -d ~/data/gemma4/comp
kaggle datasets download -d metric/gemma-4-developer-agent-wheelhouse -p ~/data/gemma4 --unzip   # slug from notebook path; confirm
# Model (path from notebook: google/gemma-4/other/gemma-4-31b-it-qat-w4a16-ct/2)
python -c "import kagglehub; print(kagglehub.model_download('google/gemma-4/other/gemma-4-31b-it-qat-w4a16-ct/2'))"
sha256sum -b $(find ~/data/gemma4 -type f \( -name '*.whl' -o -name '*.safetensors' -o -name 'tasks.jsonl' \)) > docs/SHA256SUMS.txt
```

**Python environment — three paths, in order (time-box each to 90 min):**

- **Path A — native venv (try first).** Python 3.12 (the Kaggle notebook's version).
  ```bash
  uv venv --python 3.12 ~/venvs/g4 && source ~/venvs/g4/bin/activate
  uv pip install "vllm==0.19.1"                     # brings the dependency closure (torch etc.)
  # overlay the host's wheels WITHOUT deps (mirrors the notebook's Section 1)
  python scripts/install_wheelhouse.py ~/data/gemma4/wheelhouse
  python -c "import torch,vllm,swegemma,adk_submission;print(torch.__version__,torch.cuda.get_arch_list())"
  ```
  `scripts/install_wheelhouse.py` = the notebook's cell: for each `*.whl` skip `cutlass` wheels, rename `cu128` → `+cu128` when no `+` is present, symlink into a temp dir, then `uv pip install --no-deps --force-reinstall <all>`. **Gate:** `get_arch_list()` must include `sm_120` (Blackwell). The wheelhouse's vLLM is the patched 0.19.1 with `SupportsLoRA` for Gemma 4; stock PyPI vLLM refuses `--enable-lora` for this architecture `[INTEL §4]`.
- **Path B — Kaggle's GPU image for the *server*, plain venv for the *harness*.** Pull `gcr.io/kaggle-gpu-images/python`, mount the wheelhouse and model, run the notebook's vLLM start-up inside the container (needs the NVIDIA Container Toolkit in WSL), expose port 8000; the harness venv on the host talks to `http://127.0.0.1:8000/v1`. Highest fidelity to the scorer's software stack; check the image's PyTorch has Blackwell kernels `[UNVERIFIED]`.
- **Path C — build vLLM 0.19.1 from source for sm_120** (`TORCH_CUDA_ARCH_LIST="12.0"`) and port the wheelhouse's Gemma-4 LoRA patch by diffing `vllm/model_executor/models/gemma4*.py` between stock and wheelhouse. Slow (1–3 h compile); use only if A and B fail.

**Sandbox image:**

```bash
cd ~/data/gemma4/comp
docker build -f docker/Dockerfile.sandbox -t swebench-sandbox:latest docker/    # if COPY paths fail, use the dataset root as context
docker images swebench-sandbox
```

### 2.5 Block D — serve the model and run the gates

Write `scripts/serve_local.py` by copying **Section 4 of the Getting-Started notebook** and changing only: `tensor_parallel_size=1`, `gpu_memory_utilization=0.92` (0.90 if unstable), the model path, and (optionally) a `kv_cache_dtype="fp8"` switch. Using the same `VllmServer/VllmConfig` wrapper keeps flags (`tool_call_parser=gemma4`, `reasoning_parser=gemma4`, thinking default on) identical to the scorer.

Gates (write numbers into `docs/ENV.lock.json`):

| Gate | Command / source | Pass | If fail |
|---|---|---|---|
| G-D1 Model loads | server log says ready | ≤ 20 min | Path B/C |
| G-D2 **KV parity** | grep the vLLM log for `GPU KV cache size` | **≥ 24k tokens** (bf16 KV) — scorer has ≈ 46k | Try `--kv-cache-dtype fp8`; iGPU display; lower `max_model_len` for *dev-only* smoke (note parity break); use Kaggle L4×4 for fidelity-critical runs |
| G-D3 Tool calling works | `curl` a chat completion with a tool schema; expect a parsed tool call and `reasoning_content` | Both present | Check parser flags |
| G-D4 Decode speed | script below | record tok/s at concurrency 1, 2, 3, 4 | Record only; used in cost model |
| G-D5 Stability | 30-min soak with concurrency 2 | no OOM, temp < 83 °C | Lower power limit / `gpu_memory_utilization` |

Throughput probe (keep it tiny):

```python
# scripts/bench_tps.py — measures aggregate decode tokens/s vs concurrency
import asyncio, time, sys
from openai import AsyncOpenAI
c = AsyncOpenAI(base_url="http://127.0.0.1:8000/v1", api_key="EMPTY")
PROMPT = "Explain, step by step, how to reverse a singly linked list in Python. " * 40   # ~1k tokens in
async def one():
    r = await c.chat.completions.create(model=sys.argv[2], messages=[{"role":"user","content":PROMPT}],
                                        max_tokens=256, temperature=0.2)
    return r.usage.completion_tokens
async def main(n):
    t=time.time(); toks=sum(await asyncio.gather(*[one() for _ in range(n)])); d=time.time()-t
    print(f"concurrency={n}  total_tok={toks}  {toks/d:.1f} tok/s aggregate  ({toks/d/n:.1f}/stream)")
asyncio.run(main(int(sys.argv[1])))
```

### 2.6 Fallback ladder if the 5090 cannot serve the model faithfully

1. Path B (Kaggle image) → 2. Path C (source build) → 3. **Dual-rig mode:** use Kaggle L4×4 (30 GPU-h/week nominal, deducted ~2×) for *all* serving-fidelity work, and use the 5090 for what doesn't need vLLM parity: LoRA training, Forge mining, analysis → 4. rent a single 48–96 GB GPU by the hour for serving (community reports ~$1k/month for a dedicated RTX Pro 6000 `[INTEL §8]`; by the hour is far cheaper for bursts) → 5. dual-boot native Ubuntu on the NVMe if WSL2 is the culprit.

### 2.7 Block E — harness smoke test

The README shows a CLI, `swegemma eval …`, but does not show how to point it at *your* running server (`--models-yaml` exists). The notebook shows the Python path that definitely works: build `EvalConfig(...)` with `models=server.create_model_registry(...)` and call `Evaluator.evaluate_task(...)`. **Write `scripts/run_eval.py` from notebook §5**, because you will need it anyway for seeds, shards, per-task ledger rows, and result-directory control. Run:

- `fastapi_15588` (a task that uses the graph tools) and one `rich` task, `sandbox='docker'` then `sandbox='subprocess'`.
- Use the notebook's caps first (10 tool calls, 1 min) to see the **timeout → salvage** path; then 30 calls / 8 min to see a full attempt.
- Check that `results/<run>/{summary.json, task_results.jsonl, patches/, traces/, logs/}` all appear.

**M0-10 passes** when both sandboxes produce a trace and a verdict for each of the two tasks (resolved or not is irrelevant today).

### 2.8 Block F — local validator, lockfile, parity ledger

- `scripts/validate_submission.py`: zip the `submission/` dir; assert size ≤ `MAX_SUBMISSION_SIZE_BYTES` and every extension ∈ `ALLOWED_SUBMISSION_EXTENSIONS` (import both from `swegemma.config`, as the notebook does); call `validate_single_declared_model(dir)`; attempt `compile_submission(...)` if importable. **Fail closed.**
- `docs/ENV.lock.json`: driver, CUDA, `pip freeze`, wheelhouse version (v25 today), model version (`/2`), docker image digests, vLLM KV tokens, tok/s table, GPU power limit, temps.
- `docs/PARITY.md` — two columns, **Scorer** vs **Local**, every known difference. Seed rows: GPU count/type · TP · KV tokens · `gpu_memory_utilization` (0.80 vs yours) · sandbox backend (Docker vs subprocess) · compaction interval (README 5 vs notebook 15) · Python versions · wheel sets (agent phase vs grader) · thinking-patch status · escaping-patch status.

### 2.9 Block G — aux machines and backups

- **AUX2**: WSL2 + Docker Engine as above; clone the repo; copy `~/data/gemma4` (dataset + wheelhouse; not the model); run `scripts/gold_audit.py` later. Mount its 2 TB HDD as `/archive`.
- **AUX1**: Tailscale or OpenSSH, VS Code Remote to MAIN's WSL, Claude Code where you use it.
- Nightly job on MAIN (cron): `rsync -a --partial ~/bcf-gemma-agent/{runs,journal,docs,submission,splits} aux2:/archive/bcf/` + a weekly `git bundle`.

### 2.10 Block H — canary #1 package

Start from the official `sample_submission/`, **delete the `adapters/` directory and every `adapter:` line** (the sample-with-adapters FAILED for everyone `[INTEL §4]`), keep one agent, and use `eval_config.yaml`:

```yaml
evaluation:
  timeout_seconds: 60
  max_tool_calls: 10
  max_time_minutes: 1
  max_turns: 12
```

Tiny caps finish the full scored run in roughly 2–3 h instead of 12 — the purpose is to **test the pipeline and measure queue time and quota deduction**, not to score. Package via the notebook's Section 6, Save Version (must succeed), then Submit. Log in `docs/submissions.md`.

### 2.11 Day-0 definition of done (all must be true)

- [ ] `nvidia-smi` OK in WSL · [ ] Docker offline test prints "offline OK" · [ ] vLLM serves the model · [ ] **KV tokens and tok/s recorded** · [ ] 2 tasks × 2 sandboxes ran · [ ] `validate_submission.py` passes on the no-op package · [ ] `ENV.lock.json`, `PARITY.md`, `SHA256SUMS.txt` committed · [ ] AUX reachable and nightly backup runs once · [ ] canary package built (submitted if before 00:00 UTC)

---

## 3. The six sprints

### Sprint 1 — Fri Oct 2 → Thu Oct 8: Trusted Measurement & Baselines  (→ M1)

**Goal.** Know what a baseline agent *really* scores, what it costs in time on the scorer's hardware, and why it fails — in a pipeline you trust.

> **Mentor note — measurement before optimization.** Every hour you spend tuning prompts on a broken grader is an hour spent training yourself on noise. The field already shows this: participants whose local CV was highest had the *lowest* leaderboard scores `[INTEL §6]`. The cure is (1) **gold validation** — a task is usable only if the reference patch passes in your grader; (2) **separating generation from grading** so you can fix the grader without re-running the agent; (3) a **fitted cost model** so that local seconds (5090) translate into scorer seconds (L4×4).

| Day | Work | Output |
|---|---|---|
| Fri Oct 2 | Submit canary #1 (if not done Day 0). Write `lab/` skeleton (TaskStore, Runner, Grader, Ledger, Reporter) and `scripts/run_eval.py` with ledger hook. Start `gold_audit.py` on AUX2 (Docker backend, all 129 tasks, `patch` as the agent patch) | M1-05, audit running |
| Sat Oct 3 | Read audit. Build the **Grader Env**: extra wheels (`typing_inspection, inline-snapshot, dirty-equals, ujson, orjson, python-multipart`, per-task starlette pins) fetched online on your machine into `wheels_grader/`; re-audit in Docker, subprocess, and (if feasible) a Kaggle-like image | `gold_matrix.csv` (M1-01/02) |
| Sun Oct 4 | Freeze `gold_valid.json`, `dead_tasks.md`; carve **Smoke-12 / Dev-A / Dev-B** stratified by repo and patch size; hash the files. Regrade pipeline (M1-06). Trace → DuckDB (M1-07). E0 concurrency curves | M1-03/04/06/07 |
| Mon Oct 5 | **Launch R0** (official sample, no adapters) ×3 seeds on Dev-A overnight. **Launch the Kaggle L4×4 calibration notebook** (~20 tasks, instrumented) now, because queues run 4–13 h. Meanwhile run host-bug probes on Smoke-12 (M1-11) | R0 running; calibration queued |
| Tue Oct 6 | Reproduce **R1** from the best public notebook's prompts/config (fork publicly available code only); launch ×3 seeds overnight. Hand-label 15 R0 trajectories | R1 running |
| Wed Oct 7 | Finish 30 labels → taxonomy v0. E-SK1: can a skill script run, see `/workspace`, take args? Read calibration logs if landed | M1-10, M1-12 |
| Thu Oct 8 | Fit **cost model v0** from calibration traces. Fill `PARITY.md`. Check canary. Sprint review, retro, diff journal | M1-13/14/15 |

**Experiments:** E0, E1, E13 (Docker vs subprocess on Smoke-12).

**Cost model v0 (fit from traces):**
`t_task ≈ c_setup + P/r_prefill + D/r_decode + t_tools + t_compaction`, where P, D = prompt and decoded tokens, `r_*` = L4×4 rates fitted from calibration, `t_tools` = command run time (from logs). Validate by predicting the calibration run's wall-clock on held-out tasks (target error ≤ 30%).

**Gate S1 (all must hold, else write a decision):**
1. `gold_valid.json` ≥ 100 tasks (accept ≥ 90; below that, Forge moves into Sprint 2).
2. R0 and R1 each have 3 seeds on Dev-A with CIs; run-to-run SD recorded.
3. Top-5 failure modes quantified from ≥ 30 labeled trajectories.
4. Cost model v0 exists with error ≤ 30% or an explicit plan to fix it.
5. Q7 (`read_file` ranges) and the escaping rate measured locally.
6. Canary #1 accepted by Kaggle (scored or queued with a known position).

**Cut list (in order):** second sandbox comparison (E13) → Kaggle-like image audit → R1 third seed.
**Watch list:** thinking patch · escaping fix · rescore backlog · any wheelhouse bump.

---

### Sprint 2 — Fri Oct 9 → Thu Oct 15: Harden the Basics → Agent v1  (→ M2)

**Goal.** Stop losing tasks to plumbing; ship the first serious agent with safe time caps.

> **Mentor note — token economy.** On the scorer you can afford roughly 7k generated tokens per task. Treat decode tokens like money: each turn's thought costs ~1 s per 25 tokens. **Batching** (`a && b && c` in one tool call) removes whole round-trips; **output caps** (`| tail -n 25`) protect the 14k-token compaction threshold; **big reads** exploit cheap prefill. *Amdahl's law* applies: if 40% of failures are plumbing, no prompt cleverness can exceed a 40%-bounded improvement until plumbing is fixed.

| Day | Work | Output |
|---|---|---|
| Fri Oct 9 | Install P1 (file 01 §5.3) as `prompts/system.md`; trim tools to those used; Smoke-12 loop established (≤ 30 min per iteration) | M2-01 |
| Sat Oct 10 | **E2 edit-protocol experiment** (4 variants, Dev-A, 1 seed each, overnight): (a) `edit_file` only; (b) + anchored single-line rule; (c) + line-number `sed`/python fallback after 2 failures; (d) `write_file` for files < 150 lines | M2-02 running |
| Sun Oct 11 | Analyze E2 by **edit-failure rate and escaping-caused failures**; adopt winner. Write the finalize gate (scratch cleanup, `git status`, protected-file check, `py_compile` of changed files) | M2-02/04 |
| Mon Oct 12 | E3-lite (thinking off vs 1k) on Dev-A; set `eval_config.yaml` v1 and `sampling.yaml` v1; **v1 × 3 seeds on Dev-A overnight** | M2-05/06/07 |
| Tue Oct 13 | Compare v1 vs R1 (paired) and apply §6.4 gates (file 01). Use cost model to project full-run time | M2-08/09 |
| Wed Oct 14 | Package, validate, **submit #2 (v1)**. Re-probe thinking/escaping/caps status | M2-10/11 |
| Thu Oct 15 | Review; failure taxonomy v1 (what dominates *now*); plan S3; diff journal | M2-12 |

**Experiments:** E2, E3-lite, E9.

**Gate S2:**
1. v1 ≥ R1 + 3 pp on Dev-A **or** plumbing failures (edit-fail, empty-patch, overflow, scratch-in-patch) cut ≥ 50%, with non-inferiority on resolved rate.
2. Zero context-overflow deaths and zero scratch/protected-file leaks in the last Dev-A run.
3. Cost-model p95 full-run projection ≤ 9.5 h.
4. Package validates; submission #2 accepted.

**Cut list:** E3-lite → worked examples → `write_file` variant (d).
**Watch list:** escaping patch (if it lands mid-sprint, freeze comparisons and re-baseline).

---

### Sprint 3 — Fri Oct 16 → Thu Oct 22: Localize & Verify → Agent v2  (→ M3)

**Goal.** Improve *finding* and *checking*: grep→AST→graph localization, reproduction-driven repair, targeted tests, and a topology decision.

> **Mentor note — test oracles and reproduction.** SWE tasks are graded by hidden tests, so your best proxy is a **reproduction script derived from the issue's stated expectations**. "Reproduce → fix → re-run" converts a vague natural-language task into a binary signal the model can act on — the same move as test-driven development. The **graph tools** are useful for *expansion from a known symbol* (callers/callees), not for *discovery*: `search_similar_code` resolves against node names, which is why a natural-language query returned nothing in the official notebook.

| Day | Work | Output |
|---|---|---|
| Fri Oct 16 | `find_def.py` (AST def/class lookup + grep callers, capped output) + tests on 5 repos; finalize E-SK1 learnings (skill vs inline one-liners) | M3-01 |
| Sat Oct 17 | Repro-first + targeted-test selection clauses (changed file → nearest `tests/` file; `pytest -x -q … | tail -n 25`) | M3-02 |
| Sun Oct 18 | Worked examples (≤ 3, ≤ 1.5k tokens each) as `resources/worked_examples.md`, loaded on demand | M3-03 |
| Mon Oct 19 | **E6 topology**: T0 single · T1 + `code_analyzer` AgentTool (`include_contents: none`, `skip_summarization: true`) · T2 Analyst→Fixer via `output_key` · T3 + `LoopAgent`; Dev-A, 1 seed each overnight | M3-04 running |
| Tue Oct 20 | E7 (skill scripts on/off) and E8 (graph policy: none / neighbors-only / all); best-stack × 3 seeds overnight | M3-05 |
| Wed Oct 21 | **First Dev-B look** (once). Decide topology. **Submit #3 (v2)** | M3-06/07 |
| Thu Oct 22 | Review; update parity ledger; diff journal; plan S4 | M3-08 |

**Experiments:** E6, E7, E8, E10.

**Gate S3:** v2 ≥ v1 + 3 pp on Dev-A (non-inferiority + mechanism acceptable); Dev-B − Dev-A gap < 5 pp; topology decision written (default: T0 unless a variant clearly wins *and* costs < 15% extra time).

**Cut list:** T2/T3 variants → worked examples → E8 "all" arm.
**Watch list:** `search_similar_code` cap · Q7.

---

### Sprint 4 — Fri Oct 23 → Thu Oct 29: Reliability, Time Economy, LoRA Decision → Agent v3  (→ M4)

**Goal.** Lock the time budget with evidence, add recovery behavior, and make a disciplined go/no-go on fine-tuning.

> **Mentor note — survival curves and chance constraints.** One long-budget run gives you the **cumulative distribution of "resolved by minute t"** (like survival analysis: how long until success?). Pair it with the distribution of task durations to choose the cap `T` that maximizes expected solved tasks while keeping P(total > 10 h) below ~1%. Simulation recipe: resample 120 task-duration profiles from your runs (truncated at `T`), add setup time, repeat 10,000×, read the 95th/99th percentile.
>
> **Mentor note — what a LoRA is.** Instead of changing a weight matrix W, train two thin matrices B (d×r) and A (r×k) and use W′ = W + (α/r)·BA. With r = 16 you train ~0.1–1% of the parameters. **RFT** (rejection-sampling fine-tuning) means: run many attempts, keep only the ones that pass tests, and fine-tune on those. It's cheap and stable; its ceiling is the model's own best behavior, so it mostly teaches *habits and format* (tool-call syntax, terse thoughts, edit discipline), not new knowledge.

| Day | Work | Output |
|---|---|---|
| Fri Oct 23 | Circuit breakers in prompt (2 failed edits → switch method; 3 failed verifications → `git stash`/revert and new hypothesis; 70% time → candidate patch; 90% → finalize). E11 on Dev-A | M4-01 |
| Sat Oct 24 | **E5:** best stack with a 30-minute per-task budget on Dev-A (overnight, concurrency 3); collect CDF of submit time and outcomes | M4-02 running |
| Sun Oct 25 | Cost model v1; simulate `T`; pick caps; update `eval_config.yaml`; re-project runtime | M4-02/03 |
| Mon Oct 26 | **Forge v0:** mine candidate commits from 5–8 pure-Python repos (commits touching source + tests), build per-task envs online, validate F2P/P2P with gold patches → ≥ 50 tasks. Start RFT trajectory harvest in background (temp 0.6, 4 samples/task, keep passes) | M4-04/05 |
| Tue Oct 27 | LoRA smoke: render ≤ 50 trajectories with the **exact chat template** vLLM uses; r = 16 QLoRA 1 epoch; load in wheelhouse vLLM (`--enable-lora --max-loras 1 --max-lora-rank 16`); run the "loud adapter" check (output differs from base) and the train–serve logprob parity check | M4-05/06 |
| Wed Oct 28 | **LoRA go/no-go memo.** Adapter canary spec. **Submit #4 (v3)**; if host LoRA patches are confirmed, also queue the adapter canary | M4-07/08/09 |
| Thu Oct 29 | Review; diff journal; plan S5 accordingly | M4-10 |

**LoRA go / no-go — GO only if ALL hold:**
1. The host has confirmed fixes for **KV collapse** and **silent zeroing**, *or* your adapter canary (loud adapter + a >8k-token prompt) runs to completion on Kaggle.
2. ≥ 150 deduplicated verified-success trajectories, from ≥ 40 distinct tasks (Forge counts).
3. Smoke adapter loads in the wheelhouse vLLM and the loud-adapter test changes outputs.
4. Train–serve parity: mean |Δ token log-prob| between HF-forward and vLLM on held-out trajectories below a threshold you set *before* looking (suggest 0.05 nats).
5. The failure taxonomy says ≥ 25% of remaining losses are habit/format errors (addressable by SFT) rather than reasoning limits.
6. ≥ 10 days remain before RC1 freeze.
Any failure → **NO-GO**: fold the time into Track A, Forge, and robustness.

**Gate S4:** cap `T` chosen with p95 ≤ 10 h; breakers measured (loop rate down, no resolved-rate loss); go/no-go recorded; submission #4 accepted.
**Cut list:** Forge beyond 50 tasks → RFT harvest → E11 variants.
**Watch list:** KV fix · 12 h overrun fix · rescore news.

---

### Sprint 5 — Fri Oct 30 → Thu Nov 5: Optimize & Generalize → RC1  (→ M5)

**Goal.** Fine-tune the knobs, prove the gains survive on unseen repos, (if GO) train and evaluate the adapter, and freeze RC1.

> **Mentor note — leave-one-out and generalization.** Adding clauses to a prompt is easy; knowing which ones still pay rent is hard. **Leave-one-component-out** (drop each clause from the final stack, re-run) reveals dead weight, which also saves precious context tokens. **Leave-one-repo-out** and **Forge** answer the question the hidden set will ask: "does this work on repositories you've never seen?"

| Day | Work | Output |
|---|---|---|
| Fri Oct 30 | Thinking/temperature sweeps on best stack (E3 full, E4): 3 thinking × 2 temps × 2 seeds on Dev-A over the weekend | M5-01 running |
| Sat Oct 31 | If GO: launch full RFT harvest on Dev-A-excluded + Forge tasks (**never train on Dev-B or on Smoke tasks**) | harvest running |
| Sun Nov 1 | DST ended — check schedules. Analyze sweeps; choose settings | M5-01 |
| Mon Nov 2 | E15 leave-one-component-out (8–10 clauses, 1 seed each on Dev-A, overnight) | M5-02 |
| Tue Nov 3 | Leave-one-repo-out analysis and Forge evaluation of the best stack. If GO: QLoRA train (r = 16–32, ≤ 2 epochs, loss on assistant tokens only) overnight | M5-03/04 |
| Wed Nov 4 | If GO: adapter vs base, ≥ 3 seeds on Dev-B + Forge. Second Dev-B look. **Freeze RC1 (git tag) → submit #5** | M5-04/05/06 |
| Thu Nov 5 | Review; diff journal; RC1 post-mortem plan | — |

**Gate S5:** RC1 ≥ R1 + 6–9 pp locally on Dev-A (your target ladder) with Dev-B and Forge non-inferior; if an adapter ships, it beats the best no-adapter config on Dev-B + Forge with CI lower bound > 0 **and** process KPIs improved.
**Cut list:** full sweeps → E15 half-set → Forge evaluation depth.
**Watch list:** all host patches; any top-notebook ideas.

---

### Sprint 6 — Fri Nov 6 → Thu Nov 12: Release-Candidate Hardening → RC-final  (→ M6)

**Goal.** Make the package boring: reproducible, validated, timed, licensed, and re-tested against whatever the host changed.

> **Mentor note — release engineering.** The best model that cannot be rebuilt, or that errors in the last hour, scores zero. Do a **clean-room rebuild** (fresh clone on a different machine), treat the **freeze** as a change-control event (only bug fixes with a diff journal), and re-run the **regression suite** after every host patch. Pin versions; record hashes.

| Day | Work | Output |
|---|---|---|
| Fri Nov 6 | Re-probe all host patches (thinking, escaping, caps, LoRA KV); rerun Smoke-12 + Dev-A on patched behavior; decide whether any protocol clause is now redundant or harmful | M6-01 |
| Sat Nov 7 | Regression suite vs RC1 (≤ 1 pp drop on Smoke-12; paired non-inferiority on Dev-A) | M6-02 |
| Sun Nov 8 | **Clean-room rebuild on AUX2** from a fresh clone: package, validate, small run | M6-03 |
| Mon Nov 9 | Timing safety: compare cost-model p95 with RC1's real scored runtime; reconcile within 15% | M6-04 |
| Tue Nov 10 | Licence (Apache-2.0 suggested), README, reproducibility package, winner-documentation draft (training/inference description, environment) | M6-05 |
| Wed Nov 11 | Name **Finalist A** (robust no-adapter) and **Finalist B** (diversified: adapter *only if* proven, else a differently-seeded or differently-budgeted variant). **Submit RC2** | M6-06/07 |
| Thu Nov 12 | Go/no-go for freeze; optional paper spin-off decision (deadline today); review | M6-08 |

**Gate S6 (RC-final):** clean-room passes · timing p95 ≤ 10 h and consistent with real runs · all re-probes done · two finalists named · package validates · licence in place.
**Cut list:** everything except clean-room rebuild, timing safety, and package validation.

---

## 4. Reserve window — Fri Nov 13 → Wed Dec 2  (→ M7)

| Dates | Purpose | Rules |
|---|---|---|
| Nov 13–19 | **Stability week:** watch host patches; rerun regression seeds; fix only regressions | No new ideas without a diff journal and Smoke-12 + Dev-A non-inferiority |
| Nov 20–24 | **Optional improvement sprint** — only if a clear, mechanism-backed gain exists (e.g., a host patch unlocks a cheaper protocol or a working adapter) | One change-set at a time; ≥ 1 scored submission to confirm |
| Nov 25 | **Entry/merger deadline:** confirm rules accepted and team status | — |
| **Nov 27** | **Last new submission** (A and B if not already scored) | After this: no new configs |
| Nov 28 | **Freeze.** Re-score buffer begins (scoring ≈ 12–14.5 h + queue up to 13 h) | Only reruns of identical packages |
| Nov 29–30 | Rescoring buffer for infra failures (“infra-failed submissions are rerun” `[INTEL §8]`) | — |
| **Dec 1** | **Select your 2 final submissions in the Kaggle UI** (selection is separate from submitting) | Choose by local paired evidence first, LB second |
| Dec 2 | Admin only: verify the selections stuck; prepare winner packet | Deadline 23:59 UTC |

**Selecting the two finals.** Finalist A = best expected score with the smallest catastrophic risk (no adapter, comfortable timing). Finalist B = a *different risk profile* (adapter if proven; otherwise a variant with different sampling/budget). Don't pick two near-duplicates; and don't let a lucky public-board bump override consistent local evidence (winner's curse).

---

## 5. Operating system for the project

### 5.1 Weekly cadence

| When | Ritual | Time |
|---|---|---|
| Fri | Sprint planning: confirm gate, list experiments, set overnight queue | 45 min |
| Daily | Log: what ran, what changed, what's queued (`journal/daily.md`) | 10 min |
| Mon/Thu (Sprints 1–3), daily (4–6, reserve) | Intel sweep (file 01 §11) | 20 min |
| Thu | Sprint review + retro + gate decision | 60 min |

### 5.2 Repository layout

```
bcf-gemma-agent/
  submission/    # what ships (agent.yaml, prompts/, configs/, skills/, eval_config.yaml, adapters/)
  lab/           # SOLID tooling: TaskStore, Runner(Docker/Subprocess), Grader, Ledger, Reporter, Experiment
  scripts/       # run_eval.py, regrade.py, gold_audit.py, validate_submission.py, serve_local.py, install_wheelhouse.py, bench_tps.py
  splits/        # gold_valid.json, smoke12.json, dev_a.json, dev_b.json (committed, hashed)
  runs/          # result dirs (not committed; rsync'd nightly)
  journal/       # diff journals, decisions.md, daily.md
  docs/          # 01/02 plans, PARITY.md, BUGS.md, ENV.lock.json, submissions.md, SHA256SUMS.txt
```

### 5.3 Diff-journal hook (your standing rule, automated)

`.git/hooks/pre-commit` (mark executable). It writes a detailed unified diff (±40 lines of context) for every changed tracked file in the important directories, and stages it:

```bash
#!/usr/bin/env bash
set -euo pipefail
ts=$(date -u +%Y%m%d-%H%M%S)
mkdir -p journal
while IFS= read -r f; do
  out="journal/${ts}_$(echo "$f" | tr '/' '_').diff.md"
  {
    echo "# Diff journal — $f"
    echo "- when (UTC): $ts"
    echo "- experiment/decision ID: <fill in>"
    echo "- why: <fill in>"
    echo '```diff'
    git diff --cached -U40 -- "$f"
    echo '```'
  } > "$out"
  git add "$out"
done < <(git diff --cached --name-only --diff-filter=AMDR -- submission lab scripts splits docs)
```

For deleted or renamed files the diff shows the removal; nothing is ever silently overwritten.

### 5.4 Submission log (`docs/submissions.md`)

`# | date | git tag | config hash | caps (time/turns/tools) | local Dev-A mean±SE | projected p95 hours | queue h | run h | LB | notes`

### 5.5 Templates

`submission/agent.yaml` (verify field names against `sample_submission/agent.yaml` before use):

```yaml
name: bcf_coder
model: gemma-4-31b-it-qat-w4a16-ct
description: Fixes one repository issue with minimal, verified patches.
instruction: !include prompts/system.md
generate_content_config: !include configs/sampling.yaml
tools:
  - run_command
  - read_file
  - edit_file
  - write_file
  - get_code_neighbors
  - submit_patch
  - get_status
# skills:
#   - skills/bcf_toolkit          # enable after E-SK1 shows scripts are callable
```

`submission/configs/sampling.yaml`:

```yaml
temperature: 0.2
top_p: 0.95
max_output_tokens: 6144
thinking_config:
  include_thoughts: true
  thinking_budget: 1024      # sweep: 0 / 512 / 1024 / 2048 / 4096
```

`submission/eval_config.yaml` (starting point; Sprint 4 replaces these with simulated values):

```yaml
evaluation:
  timeout_seconds: 120
  max_tool_calls: 45
  max_time_minutes: 4.5
  max_turns: 35
```

Budget arithmetic check: with N ≈ 120 tasks, setup s ≈ 0.5 min, cap T = 4.5 min → worst case 120 × 5.0 = 600 min = **10 h**, leaving ~2 h of the 12 h. Expected usage is lower because many tasks end earlier; Sprint 4 turns this back-of-envelope into a simulated p95.

### 5.6 Chance-constrained cap (pseudo-code for Sprint 4)

```python
# durations[t] : list of observed per-task agent minutes from E5 (uncapped, in L4-equivalent minutes)
# setup_min    : measured per-task setup (minutes)
def p95_total(T, N=120, sims=10_000):
    totals = []
    for _ in range(sims):
        draw = random.choices(durations, k=N)
        totals.append(sum(min(d, T) + setup_min for d in draw))
    return np.percentile(totals, 95)

feasible = [T for T in np.arange(3, 9.01, 0.25) if p95_total(T) <= 10*60]
T_star = max(feasible)                       # largest cap that keeps p95 ≤ 10 h
# then check expected solved(T_star) from the E5 CDF; if flat beyond ~T0, choose T0 to save quota and margin
```

---

## 6. Contingency playbooks (if → then)

| If… | Then… |
|---|---|
| Patched vLLM wheel has no Blackwell kernels | Path B → Path C → dual-rig mode (§2.6). Decide by 16:00 on Day 0; don't sink the day |
| KV tokens < 24k on the 5090 | fp8 KV → iGPU display → concurrency 1–2 → fidelity runs on Kaggle L4×4 |
| Gold-valid pool < 90 | Proceed with ≥ 80 and pull Forge forward to Sprint 2 |
| Skill scripts unusable | Replace with `python - <<'PY'` one-liners inside the prompt; shorten examples |
| A host patch lands mid-sprint | Freeze comparisons; run the re-probe; re-baseline the incumbent on the new behavior before judging challengers |
| Canary / package fails on Kaggle | Bisect: remove adapters → remove sub-agents → remove skills → minimal `agent.yaml`; run `validate_single_declared_model` and the extension whitelist locally |
| LB drops while local improved | Do **not** roll back on one result (±4 pp run noise). Rerun the same package if quota allows; check `PARITY.md` for new host changes; decide on local paired evidence |
| 12 h overrun error occurs | Cut `max_time_minutes` by 25% and `max_turns` by 20%, resubmit immediately; update the cost model with the new evidence |
| Queue ≥ 13 h | Submit earlier in the UTC day; reduce submissions to the ones that answer a question |
| Sprint slips > 2 days | Execute the cut order in risk R9; never cut the gold-valid pool, regrade, budget governor, finalize gate, or clean-room rebuild |
| Thermal/power trouble | Lower power limit to 400–450 W; reduce concurrency; add a fan curve; check the PSU headroom |
| Tempted by a "clever" shortcut (cross-task memory, eval hacks, closed-API distillation) | Don't. See file 01 §3.3. The winner must open-source and document the approach; a disqualification costs everything |

---

## 7. Final pre-flight checklist (print this for Nov 26)

- [ ] Rules accepted; one account; team status correct
- [ ] Finalists A and B built from tagged commits; diff journals complete
- [ ] `validate_submission.py` passes on both; sizes and extensions OK; single declared model
- [ ] Caps set; cost-model p95 ≤ 10 h; last real scored run time recorded
- [ ] No scratch or test-file edits in sample patches from Smoke-12 (spot check 10 patches)
- [ ] Both packages scored at least once (or a documented reason why not)
- [ ] Host-patch status logged; re-probes done after the last patch
- [ ] Licence, README, reproducibility package, winner packet drafted
- [ ] Two finals selected in the UI; screenshot saved

---
*End of 02.*


---

<!-- ====================================================================== -->
<!-- FILE: 05-bcf-integration-and-paper-brainstorm_v1.md -->
<!-- ====================================================================== -->

# 05 — What's Useful in the New Documents, How It Enters the Master Plan, and Ideas for Whitepaper Draft 3

*Prepared 2026-09-30 (late). Companion to `01-roadmap-and-master-checklist_v2.md` and `02-master-plan-day0-six-sprints_v2.md` (which are **not modified** — your standing "preserve data, journal every change" rule applies; all changes are expressed as a patch in §3). Sister files: `06-whitepaper-math-section_draft3.md` (the math) and `07-prior-research-fault-interference-masking.md` (the literature).*

**Evidence tags:** `[RULES]` Kaggle rules/overview · `[README]` harness README · `[INTEL3]` your forum intel (03) · `[INTEL4]` paper-track intel (04) · `[DOSSIER]` the BCF dossier · `[COMP]` BCF Reference Compendium · `[DERIVED]` my arithmetic/logic · `[HYPOTHESIS]` untested.

---

## 0. What I reviewed, and what was (and wasn't) new

| File | Verdict |
|---|---|
| `Kaggle-00-Complete.md` | **Nothing new.** It is the four 9/29 snapshots (Overview, Data, Getting Started notebook, Official Rules) concatenated — the same content I used for files 01/02. No rule differs from what I already reported. |
| `04-paper-track-intel.md` | **New and important**: paper-track mechanics (3,000-word cap, 5 writeups/day, at most 2 judged, five equal-weight criteria, tie → earliest entry, non-archival/arXiv-friendly, graph-ML-flavored judge circle, writeup-editor bug risk). Drives §5. |
| `BCF-Reference-Compendium.md` | **Useful, mostly already in the plan** (the 9/28 plan was built from it). I re-read it item by item and extract what still adds value (§2). It is candid that Batonic originals were unreadable and many specs are `[RECONSTRUCTED]`. |
| `BCF-contestsubmission_dossier_20260928.html` | A transcript-style dossier: two whitepaper drafts, an invented stress-test task, a retraction ledger, a labeling roadmap, a "classification gate" design. **Its own ledger retracts many claims** — read §1 before reusing anything from it. |

### 0.1 Problems I found in these documents (fix before any reuse)

| # | Problem | Evidence | Consequence |
|---|---|---|---|
| P1 | **`httpx_6821` is invented.** The dossier says so itself (ledger + Turn 7): "not in the competition dataset". Its 30-turn and 10-turn traces are illustrations, not data. | `[DOSSIER]` ledger | Fine as a teaching example. Not usable as a result, a case study "from the training set", or a citation of BCF's behavior. Draft 2 calls it "representative httpx scenario" — keep that label, and replace it with a *real* masked pair found by the lattice experiment (file 06 §6). |
| P2 | **The Phase-1a classifier in the dossier's §20 reads `test_patch`.** The agent never sees it at scoring time. The dossier's own ledger retracts this (Turn 21), but the code sample is still on the page. | `[RULES/Data]`: `test_patch` is kept in the private solution archive; `[DOSSIER]` ledger | Classification must use issue text + hints + output of the agent's own reproduction. (File 06 builds a two-stage gate around that.) |
| P3 | **"50-turn budget" is presented as a competition constraint** (Draft 2 §1; ledger says "Verified"). | `[README §7.1]`: turns default to 500 when unset; "50" is the *sample submission's* value | It is a knob you set, not a rule. Rewrite the sentence. |
| P4 | **Draft 2's `search_similar_code` protocol assumes free-text semantic search.** The README says the tool resolves the query against node keys and suggests passing symbol names; the official notebook's query "Server Sent Events" returned 0 results. | `[README §6.3]`, `[NB]` | The "two-query semantic phrasing" claim (Draft 2 §4.1–4.2) needs redesign around symbol-name queries. The dossier's Category-B "P@k with the issue text as query" analysis is invalid for the same reason. |
| P5 | **Draft 2 uses tool parameters that the README does not list.** `get_code_subgraph` takes only `nodes` (Draft 2 passes `max_depth` and `edge_types`). `get_code_neighbors(edge_type="called_by")`: the README lists edge-type filters such as `CALLS`, `DEFINED_IN`, `IMPORTS`, and says the tool returns *incoming and outgoing* neighbors. No `called_by` type is documented. | `[README §6.3]` | Verify the real semantics on Day 0/Sprint 1 (E-SK1 sibling). Until verified, strike "called-by insight" (§4.3) as a contribution. |
| P6 | **Draft 2 is ≈ 4,500 words** (I counted the rendered text); the writeup cap is **3,000**. | `[INTEL4]` | ≥ 1,500 words must go *before* adding any math. See §5.4. |
| P7 | **"Spec identifies both bugs from the issue before any file is read"** (Draft 2 §3.1, §7.2). By definition a *masked* fault is not visible in the failure signals. It can be anticipated only if the issue text hints at it (in the invented example the issue does contain the second assertion). | logic; `[DOSSIER]` | Reframe as a *testable hypothesis*: "issue-stated expectations contain latent-fault hints in X % of multi-fault tasks." (file 06 §4.6, experiment E20). |
| P8 | **Taxonomy categories were fixed before labeling** (12 names in Draft 2 §6.1), contradicting the rule recorded in `[COMP B5.2]` ("derive categories from data first"). Several are repo-specific (`redirect_history_accumulation`), so they cannot transfer to the *private* hidden repos. | `[DOSSIER]` vs `[RULES/Data]` | Two layers: repo-agnostic **mechanism/failure-signature classes** (used by the agent) and repo-specific **tags** (used only for analysis). See E31. |
| P9 | **Result paths in the dossier's logging script** (`results/{agent}/{task}/result.json`, `trace.jsonl`, `patch.diff`) do not match what the harness writes (`task_results.jsonl`, `traces/trace_<id>.json`, `patches/<id>.patch`). | `[README §9.2]` | Adapt the ledger script; don't paste it. |
| P10 | **Jev (TypeSafe AI) is API-only**, so it cannot live inside a submission, and using closed-API outputs as *training* labels raises the same licence/ToS questions the forum is already arguing about. | `[DOSSIER]` Jev report; `[INTEL3 #9]` | Dev-time labeling should use the local Gemma (free, licence-clean). Keep Jev's *design lessons* (escape class, calibration check), not the product. |
| P11 | **Draft 2's Table 1 "expected" ranges and the "12–20 → 3–4 calls" abstract claim are unmeasured.** The dossier itself flags them (line ≈ 3503). | `[DOSSIER]` | Remove from the abstract; replace with measured numbers or delete. |
| P12 | "61 teams entered" is unsourced; current counts are 829 teams (main) and 84 (paper track). | `[RULES]`, `[INTEL4]` | Stale. The paper track is far less crowded than the main track. |

**Good news hidden in the ledger:** the dossier already concluded that (i) a *flat* single agent should be primary and the multi-agent tree an ablation, (ii) graph-first + four-phase loop is *not* a novelty claim, and (iii) repo-specific keyword maps don't transfer. Files 01/02 already follow (i). (ii) matters for the paper: the *novelty* has to come from elsewhere — that is what `06` and `07` are for.

---

## 1. How to read §2

For every technique I give a **verdict** (Adopt / Adapt / Defer / Reject), **where it enters the plan** (sprint and checklist ID), and **how it is tested** (experiment ID, metric, and a pass/kill rule). The testing rules follow file 01 §6.4 (paired design on Dev-A × 3 seeds; promote on mechanism + non-inferiority, not p < 0.05). Effects smaller than ≈ 7–9 pp are undetectable on Dev-A, so **mechanism KPIs** (plumbing rates, loop rate, time-to-first-edit, class-gate accuracy) carry much of the decision weight.

---

## 2. Technique register

### 2.1 From the Compendium and dossier (BCF core)

| ID | Technique | Source | Verdict | Enters plan | Test and decision rule |
|---|---|---|---|---|---|
| **T-01** | **Lite BCF-Spec**: before any edit, the agent writes hypothesis / target symbol / fix shape / bug order (≤ 120 tokens, plain text; the JSON Schema in `[COMP A6.3]` is too heavy for a 31B model on a decode-bound budget) | `[COMP A6]`, `[DOSSIER]` | **Adapt** | S2 (prompt P1 §3 "state file+function before editing" already approximates it); full variant S3 | **E16**: spec-lite on/off, Dev-A × 3 seeds. KPIs: `spec_file_correct` (vs gold patch file), time-to-first-edit, resolved. Keep if `spec_file_correct ≥ 0.6` **and** resolved non-inferior (lower 80% bound ≥ −1 pp) **and** tokens ≤ +8%. Kill if spec adds > 1 turn median without raising `spec_file_correct`. |
| **T-02** | **Phase boundaries by tool scoping** (issue_analyzer cannot edit; patch_implementer cannot explore) | `[COMP A1.4]`, Draft 2 §5.1 | **Adapt → ablation only** | S3, inside existing **E6** as arm **T-BCF** (analyzer → planner → implementer) | Same paired design. Cost check: each sub-agent call re-pays prefill and adds compaction risk on a 14,336-token threshold. Promote only if T-BCF ≥ T0 + 3 pp *and* time ≤ +15%. Dossier ledger already demoted the tree to an ablation. |
| **T-03** | **Gate table G0–G6** (spec valid, scope respected, applies, parses, target passes, no regression, non-empty) | `[COMP A8]` | **Adopt subset** | S2 finalize gate (B04) gains **G1 scope** (changed files ⊆ declared files) and **G5 regression** (run the test file containing the touched symbol; revert on new failures) | **E-gate**: remove G1, then G5, in turn (Dev-A × 2 seeds). KPIs: regression rate, scratch/protected-file leaks, resolved. G2/G3 (apply/parse) are cheap → keep unconditionally. |
| **T-04** | **BCF-Rescue** state machine (3 validation failures → revert to minimum baseline; immediate revert on regression) | `[COMP A2]` | **Adapt** | S4, **E11** (already planned) | Trip conditions: 3 failed validations, same tool call repeated 3×, same file edited 4× with no gain, < 25% budget left with no valid patch. KPIs: `rescue_trigger_rate`, `rescue_recovery_rate`, loop rate. Adopt if recovery_rate ≥ 15% of triggered tasks and no resolved-rate loss. |
| **T-05** | **Breadcrumb journal** in `/tmp/bcf/<task>/journal.md` (≤ 30 lines), re-read each turn | `[COMP A3]` | **Adopt (as compaction-proof memory)** | S4, **E27** | Why it may matter more than the Compendium thinks: ADK **compaction** summarizes history when context passes 14,336 tokens (interval 5) `[README §7.2]`, so old failed attempts can vanish from context. **E27:** journal on/off, stratified by number of compactions in the trajectory. KPIs: `repeat_action_rate`, loop rate, resolved among tasks with ≥ 1 compaction. Must live outside `/workspace` (else it can enter the patch: the harness diffs `/workspace` against the `eval_baseline` commit — `[README §4.2, §8.1]`). |
| **T-06** | **Structured handoff / reducer** vs transcript passing | `[COMP A4]` | **Defer** (only if a sub-agent topology survives E6) | S3→S4 | Arms T0 (full transcript), T1 (packet), T2 (packet + last N tool outputs). The Compendium itself notes Cognition's counter-evidence. A true *deterministic* reducer is only possible as a skill script the agent calls, so the "reducer" is advisory. |
| **T-07** | **Verification hierarchy** V0–V3; "V2b/V3 may trigger revision, never approve" | `[COMP A5]` | **Adopt V0–V2b; defer V3** | S2–S3 (repro-first E10) | V3 (a second model call as verifier) costs decode time. **E29** (false-approval rate on Dev-A) is a *cut candidate* — run only if S3 leaves slack. |
| **T-08** | **Progressive disclosure** (skills: name+description, body on activation, resources on demand) | `[COMP A7]` | **Adapt** | S3, **E30** | Depends on E-SK1 (how the harness loads skills — still `[GAP]`). **E30:** all-in-system-prompt vs skill-loaded; KPIs: prompt tokens/turn, activation correctness, resolved. Note the Compendium's warning: with a small model, *descriptions* decide whether a skill is ever used. |
| **T-09** | **Evidence tiers M/D/I/H + receipts + claims audit** | `[COMP B1]` | **Adopt fully** (paper and plan) | S1 (receipt schema) → S6 (claims audit) | Mechanical check: every sentence with a number carries a receipt ID or derivation. This is also your defense against the two fabricated-number incidents in the dossier ledger. |
| **T-10** | **Ledger with OTel-GenAI-style fields** (`gen_ai.usage.*`, `gate`, `spec_ref`) | `[COMP B5]` | **Adopt (adapted)** | S1 (`lab.Ledger`) | Map from the *real* harness outputs (P9) into the ledger. Don't log chain-of-thought as a research artifact (Compendium's advice; also avoids leaking prompt detail). |
| **T-11** | **Promptfoo regression for prompt edits** | `[COMP B3]` | **Defer** | — | DuckDB + Smoke-12 already gives a 20–30 min regression loop. Revisit only if Smoke-12 turns out too slow. |
| **T-12** | **Langfuse/LiteLLM** | `[COMP B4]` | **Reject for now** | — | Postgres+ClickHouse+Redis+S3 on WSL2 is weight you don't need; ATIF traces + DuckDB suffice. |
| **T-13** | **SWE-bench Pro as the external benchmark** (Verified demoted) | `[COMP 0.3 #1]` | **Adopt as post-competition only** | — | Not on the critical path. |

### 2.2 From the dossier's new design and analysis ideas

| ID | Technique | Source | Verdict | Enters plan | Test and decision rule |
|---|---|---|---|---|---|
| **T-14** | **Phase-1a classification gate** (route by issue class; class-specific playbooks: logic / contract / crash / feature) | `[DOSSIER §20]` | **Adapt heavily** → this is the seed of the math in file 06 | Labels + priors S1; gate prompt S3 (**E17–E19**) | **E17:** classifier accuracy and calibration on the gold-valid pool (labels derived from base-commit failing runs + gold patch). **E18:** two-stage classification (text → after first repro run). **E19:** class-conditioned playbooks vs one flat prompt. Rules in file 06 §6 (break-even accuracy, calibration ECE ≤ 0.10, escape class present). Must not use `test_patch` (P2). |
| **T-15** | **Crash-class fork: "defensive" (fix upstream state) vs "guard-missing" (fix at crash site)**; check whether the patch touches an upstream file | `[DOSSIER §20, Class 3]` | **Adopt as E23** | S3 | Applies only to crash-signature tasks. KPI: among tasks whose gold patch touches a file other than the traceback's top frame, the fraction where the agent's patch does too. Paired on the crash subset. Kill if crash subset < 15 tasks (too small to read) — then fold into the lattice analysis instead. |
| **T-16** | **Feature-request playbook** (capability / integration point / shape; find the nearest precedent rather than a fault) | `[DOSSIER §20, Class 4]` | **Adapt** | S3 | The dossier asserts feature tasks exist; `[RULES/Data]` says only "bug fixes and feature requests". First *measure* the share (E31). Playbook only if ≥ 10% of the gold-valid pool. |
| **T-17** | **Taxonomy labeling** (bug category, tier 1–5, multi_bug, root-cause file/symbol, fix shape; human-override flag; 20-task inter-rater κ) | `[DOSSIER]` Cat. A; `[COMP B5.2]` | **Adopt with two changes** | S1–S2 (**E31**) | Change 1: derive categories by open coding *after* seeing data; two layers (repo-agnostic mechanism classes + repo tags). Change 2: auto-derive objective fields from the gold patch (files, hunks, lines, symbols via graph `node.id`) so human time goes only to judgment fields. Report Cohen's κ on 20 tasks with a second rater (a local-Gemma rater counts as a *model* rater, label it so). |
| **T-18** | **Graph structural stats** (degree, betweenness) per repo | `[DOSSIER]` Cat. B #1 | **Adopt (cheap)** | S1, AUX2 (CPU) | Descriptive. Report with the caveat that graph edges are CALLS/IMPORTS-type and incomplete by construction (AST-derived). |
| **T-19** | **Embedding clustering by category** (intra- vs inter-category cosine) | `[DOSSIER]` Cat. B #2 | **Adopt with controls** | S2, **E26** | Add a **permutation test** (shuffle labels 10,000×), control for same-file/same-module proximity (symbols in one file are naturally similar), and report effect size. Without the controls, "diagonal is darker" is not evidence. |
| **T-20** | **Semantic search precision@k** | `[DOSSIER]` Cat. B #3 | **Redesign** | S1 | Use **symbol-name queries** (names extracted from the issue, or node-as-query), because free-text queries are not supported (P4). Report P@1/3/5 *and* "tool returned 0 results" rate — the latter is a finding in its own right. |
| **T-21** | **Three-configuration ablation on 30 tasks** | `[DOSSIER]` Cat. C | **Replace** | — | 30 tasks × 1 seed cannot detect anything under ≈ 15–20 pp. Use Dev-A (≈ 60) × 3 seeds, paired, as in file 01 §6. |
| **T-22** | **"BCF localization turns falls with complexity tier while baseline's rises"** as the headline | `[DOSSIER]` | **Reframe** | S5 | Harder tasks need more turns for *every* agent; a raw correlation is confounded. Fit `turns ~ tier × config` (interaction term) with task random effect; the claim is the *interaction slope*, pre-registered. Expect it to be weak; don't build the paper around it. |
| **T-23** | **`eval_config.yaml` tuning loop** (timeouts from the 75th–80th percentile of resolved times) | `[DOSSIER]` | **Already covered** (E5 + chance-constrained cap) | S4 | Keep the dossier's insight "failed tasks rarely succeed with more time"; our E5 CDF tests exactly that. |
| **T-24** | **GraphRAG knowledge base / `repo_mapper.py` keyword maps / resolved-issue index** | `[DOSSIER]` | **Reject for hidden repos; keep as a diagnostic** | S5 | The ledger retracts repo-specific maps. Only use to *measure* how much local score comes from repo-specific knowledge: run **E33** (leave-one-repo-out) — if removing a repo's tasks from the knowledge base drops its score, the gain is not transferable. |
| **T-25** | **Typed-gate design rules**: always include `none_of_these`; test option-order sensitivity; don't ask the model to count or compare versions; calibration-bucket test on ≥ a few hundred labeled examples | `[DOSSIER]` (Jev section) | **Adopt the rules** | S3 (class gate) | Applies to the Gemma class gate (T-14). Reliability diagram + ECE in file 06 §6. |

### 2.3 From the paper-track intel (04) — process techniques

| ID | Technique | Verdict | Enters plan |
|---|---|---|---|
| **T-26** | **Submit a stub writeup early** (tie → earliest entry; editor 404 bug history) | **Adopt now** | Day 0/S1. Unknown: whether later edits reset the "entered" timestamp — ask on the paper-track forum (§5.6). |
| **T-27** | **Two writeups maximum** (Methods + Resource) | **Adopt conditionally** | Decide at end of S4 (see §5.3). |
| **T-28** | **Regenerated graphs/embeddings as a resource are acceptable with citation and link** (host answer) | **Note** | Only relevant if Resource entry is chosen; don't redistribute shipped files. |
| **T-29** | **Graph-ML-flavored judge circle** | **Shapes framing** | Put a real graph analysis in the paper (T-18, E25). |

---

## 3. The patch to the master plan (change journal)

*Nothing in files 01/02 was edited. Apply these deltas when you next revise them (version 3); this table is the diff journal.*

| Δ ID | Location in 01/02 | Change | Why |
|---|---|---|---|
| Δ-01 | 01 §7 (experiment registry) | **Add E16–E34** (list in §3.1) | New techniques |
| Δ-02 | 01 §5.3 prompt P1, step 5 "Verify" | Replace `pytest -x -q <file> \| tail -n 25` with a **two-step observation policy**: first `pytest -q --tb=line -rf <file> 2>&1 \| tail -n 30` (complete failure set), then `-x` only in the inner fix loop | `-x` and `head`/`tail` truncation *hide* co-existing failures (tool-induced masking; file 06 §4.6). Testable as **E21**. |
| Δ-03 | 01 §5.3 prompt P1, step 3 "Reproduce" | Make the repro **atomized**: one independent check per expectation in the issue, each in its own try/except, so the first failing assertion cannot hide the rest | Assertion short-circuit is a masking mechanism; **E20** |
| Δ-04 | 01 §6.1 pools | Add **Lattice-set**: tasks from the gold-valid pool with 2 ≤ m ≤ 4 gold-patch fault units (used for E24/E22) | Real multi-fault structure for the paper |
| Δ-05 | 02 Sprint 1 day table | Add (AUX2, CPU only, parallel to R0/R1): **hunk-lattice runner** (E24), **graph/frame-distance stats** (E25), **taxonomy auto-fields + open coding** (E31), **`-x` masking probe** | Uses idle aux hardware; no GPU needed |
| Δ-06 | 02 Sprint 2 | Add E20, E21, E16-lite | Cheap prompt-level tests |
| Δ-07 | 02 Sprint 3 | Add E17–E19, E22, E23, E26 | Class gate, look-ahead, crash fork, embeddings |
| Δ-08 | 02 Sprint 4 | Add E27, E33; analyze lattice → class-transition matrix (feeds look-ahead prior) | Closes the loop |
| Δ-09 | 02 Sprint 5–6 | Paper assembly moves earlier: freeze paper numbers at end of S5 (Nov 5); final submit **Nov 10** (buffer 2 days before Nov 12 23:59 UTC) | Platform-bug and tie-break risk |
| Δ-10 | 01 risk register | **Add R13** paper-track platform failure (404 on save/submit) → stub now, submit final ≥ 48 h early; **R14** fabricated-number recurrence → claims audit + receipts | `[INTEL4 §5]`, `[DOSSIER]` |
| Δ-11 | 01 checklist | Add items below (§3.2) | Traceability |

### 3.1 New experiments (registry entries)

| ID | Question | Design | KPI | Sprint |
|---|---|---|---|---|
| E16 | Does a lite spec help? | on/off, Dev-A × 3 seeds | `spec_file_correct`, resolved, tokens | S2–S3 |
| E17 | How accurate/calibrated is a text-only fault-class gate? | classifier vs labels from base-commit runs on gold-valid pool; leave-one-repo-out | accuracy, ECE, Fano floor check | S1 labels → S3 |
| E18 | Does seeing the first repro output improve class accuracy? | text-only vs text+first-run stage | Δ accuracy, Δ I(Ĉ;L) | S3 |
| E19 | Do class-conditioned playbooks beat one flat prompt? | flat vs gated, paired | resolved, tool calls, time | S3 |
| E20 | Does atomized repro expose masked faults? | monolithic vs atomized repro | fraction of multi-fault tasks where second failure is seen pre-patch; resolved | S2 |
| E21 | Does `pytest -x` hide failures? | `-x` first vs complete-observation first | distinct failing tests observed; turns; resolved | S2 |
| E22 | Does differential-coverage look-ahead find latent faults sooner? | skill using stdlib `trace`; on/off on Lattice-set | rounds to resolve, resolved | S3 |
| E23 | Crash-class defensive/guard fork | on/off on crash subset | upstream-file touch rate where gold is upstream | S3 |
| E24 | **How common and what shape are masking/interference structures in these tasks?** | hunk-subset lattice on gold-valid pool (file 06 §6.2) | π_multi, shadow/cancel/synergy rates, depth D, transition matrix | S1–S4 |
| E25 | How far is the fix site from the crash frame in the call graph? | shortest-path length crash-frame → patched symbol | distribution by class | S1–S2 |
| E26 | Do bug categories cluster in embedding space? | intra/inter cosine + permutation test | effect size, p | S2 |
| E27 | Does a /tmp journal reduce loops after compaction? | on/off, stratified by compaction count | repeat-action rate | S4 |
| E28 | Handoff arms | T0/T1/T2 | resolved, tokens | S4 (conditional) |
| E29 | V3 verifier false-approval | on/off | false-approval rate | cut candidate |
| E30 | Progressive disclosure | prompt vs skills | tokens/turn, activation | S3 |
| E31 | Taxonomy labels + κ | open coding + 20-task inter-rater | κ, override rate, class shares | S1–S2 |
| E32 | Leaderboard noise study | bootstrap from our repeated runs | SE, MDE, rank volatility | S5 (paper sidebar) |
| E33 | Do class priors transfer across repos? | leave-one-repo-out priors | Δ log-loss, Δ resolved | S4 |
| **E34** | **What share of failed agent patches are partial fixes of multi-unit tasks?** | map each failed patch's hunks to the lattice's essential fault units (E24) | partial-fix rate with Wilson CI | S4–S5 (uses R0/R1/v1 patches already produced) |

### 3.2 New checklist items (append to file 01 §9)

- **M1-16** `lab.Lattice`: apply any subset of gold-patch hunks to a base snapshot, run F2P/P2P, record outcomes + failure signatures (file 06 App. B)
- **M1-17** `gold_units.json`: per task, gold-patch hunks grouped into *fault units* (hunks that cannot be separated are merged)
- **M1-18** Open-coding pass on ≥ 40 tasks → frozen two-layer class codebook v0 (incl. `none_of_these`)
- **M1-19** Frame-distance/graph-distance script (E25) on all gold-valid tasks
- **M1-20** Paper stub created and submitted on Kaggle (platform test)
- **M2-13** Observation-policy and atomized-repro clauses added to P1; E20/E21 run
- **M3-09** Class gate v0 (two-stage) + calibration plot; E17–E19 run
- **M3-10** Look-ahead skill (`diffcov.py`, stdlib `trace`) + E22
- **M4-11** Lattice analysis complete: π_multi, shadow/cancel/synergy rates, D, transition matrix with CIs
- **M4-12** Partial-fix rate (E34) computed on all failed patches from R0/R1/v1
- **M5-07** Paper numbers frozen with receipts; claims audit passed
- **M6-09** Paper submitted (target Nov 10); second writeup decision executed

---

## 4. Testing conventions specific to the paper-facing experiments

1. **Pre-register** each hypothesis in `journal/prereg/` *before* the run (one paragraph: claim, metric, test, kill rule). The dossier's failure was numbers written before measurement; pre-registration is the structural fix.
2. **Two kinds of evidence, never mixed in one table:** *measured* (from receipts) and *illustrative* (hand-built or simulated). Mark every table and figure caption with `[M]` or `[I]`.
3. **Every proportion gets a Wilson interval**; every paired comparison gets a paired bootstrap interval; report the number of looks taken at Dev-B.
4. **Hunks are not faults.** The lattice experiment measures *hunk-level* interaction; merge inseparable hunks into units and say so (Callaghan & Fischer warn that multi-hunk faults are sometimes mistaken for multi-fault programs — see file 07).
5. **Keep negative results.** A null on E19 is publishable here ("class-conditioned playbooks did not beat a flat prompt at n = …") and scores well on Verifiability.

---

## 5. Brainstorm: ideas for whitepaper Draft 3

### 5.1 Constraints that decide the design `[INTEL4]`

- **3,000-word Kaggle Writeup**; optional arXiv-ready PDF via the Public Project Link (so: a tight 3k-word writeup + a longer attached PDF).
- Five equal criteria, each 0–5: **Novelty, Quality (generality beyond this competition), Relevance, Verifiability, Clarity.** Feedback is never shown.
- Prizes are per-writeup; a writeup wins **one** prize; at most **two** writeups are judged per team.
- Field is thin: 84 teams, 86 submissions at the snapshot. Earliest-entered wins ties.
- Judges' circle leans **graph ML** (Perozzi, Rózemberczki, Galkin) plus SE testing (Hemmati). Prefer graph-native analysis to prompt anecdotes.
- Draft 2's novelty claims (graph-first, four-phase loop) are already flagged as **not novel** by your own ledger.

### 5.2 Candidate contributions (scored 1–5 against the rubric; F = feasibility by Nov 10 alone)

| # | Idea | Nov | Qual | Rel | Ver | Clar | F | Notes |
|---|---|---|---|---|---|---|---|---|
| I-1 | **Masked-fault peeling for small-model SWE agents**: formal model of fault-class priors + masking DAG + look-ahead (file 06), with measured interference structure | 5 | 4 | 5 | 4 | 4 | 4 | Main idea. Novel bridge between multi-fault theory (masking/synergy/cascading) and LLM issue-resolution. I did not find a measurement of this structure on SWE-bench-style tasks (limited search — file 07 §4). |
| I-2 | **SWE-Lattice resource**: for every gold-valid task, outcomes for all subsets of gold fault units (pass/fail + failure signature), released as JSON | 4 | 4 | 5 | 5 | 4 | 4 | Directly reusable (benchmarks, PRMs, curriculum). Pairs with I-1. Needs only CPU on AUX2. |
| I-3 | **Observation-channel integrity**: masking occurs at three layers — code, test (assertion short-circuit, `-x`), tool (truncation, double-JSON escaping: 22 % / 62 % / 0 % in the forum experiment) — and each can cost resolves | 4 | 5 | 5 | 4 | 5 | 4 | Generalizes beyond this competition (Quality). Forum numbers are participants' findings (credit them; re-measure yours). |
| I-4 | **Fault-signature taxonomy with priors and transition matrix**, repo-agnostic (Python exception-rooted + no-exception classes) | 4 | 4 | 4 | 5 | 4 | 5 | Cheap, verifiable, feeds I-1. |
| I-5 | **Graph-distance analysis**: distribution of call-graph distance from the crash frame (or issue-mentioned symbol) to the patched symbol, by class | 4 | 4 | 5 | 5 | 4 | 5 | Graph-native, agent-free, fast. Best fit to judges' taste. |
| I-6 | **Budgeting as a first-class resource**: chance-constrained per-task cap; survival curves; 12 h error-on-overrun risk | 3 | 4 | 5 | 4 | 4 | 4 | Practical; a good Resource-paper section. |
| I-7 | **Noise and power for small agentic benchmarks**: SE ≈ 3–5 pp, MDE ≈ 7–9 pp, winner's curse, paired designs; compressed leaderboard (124-team bronze tie) | 4 | 5 | 4 | 5 | 5 | 5 | Cheap; highly general; credit the community data. Good sidebar or short standalone section. |
| I-8 | **Embedding geometry vs bug class** (E26 with permutation test) | 3 | 3 | 3 | 5 | 4 | 4 | Include only if it passes the controls; else report as a null. |
| I-9 | **Class-conditioned traversal policy** (which edge types per class) with hit-rate metrics | 4 | 3 | 4 | 4 | 4 | 3 | Needs I-5/I-4 first. |
| I-10 | **Masking-aware LoRA data curation** (keep trajectories that resolved multi-fault tasks; down-weight lucky single-hunk wins) | 4 | 3 | 4 | 3 | 3 | 2 | Only if Track C goes; otherwise future work. |
| I-11 | **Negative-results appendix** (what did not help, with CIs) | 3 | 4 | 4 | 5 | 4 | 5 | Cheap credibility. |
| I-12 | **Benchmark hygiene note**: gold-validation, dead tasks, wheel dedup failures | 3 | 4 | 4 | 5 | 4 | 4 | Credit the forum authors; belongs in a Resource entry. |

### 5.3 Two-writeup strategy (recommended)

- **Writeup A (Methods → "Overall Best Paper", $15k):** I-1 + I-3 + I-4 + I-5, with I-7 as a sidebar and I-11 as an appendix. Title candidates: *"What Hides the Second Bug? Fault Masking and Fault-Class Priors in Small-Model Issue Resolution"* · *"Peeling Masked Faults: Class-Conditioned Search for Local SWE Agents"*.
- **Writeup B (Resource → "Best New Resource", $10k):** I-2 + I-12 + I-6 + gold-valid pool + labeled taxonomy + the `lab` tools, released under Apache-2.0. Title: *"SWE-Lattice: Subset-Outcome Data for Studying Fault Interference in Python Issue Resolution."*
- **Decision rule at end of S4 (Oct 29):** submit B only if (i) the lattice covers ≥ 60 tasks with m ≥ 2 **and** (ii) the data pass a reproducibility check on AUX2. Otherwise fold B's best pieces into A and submit one strong writeup. Host guidance is "quality over quantity".
- The BCF *framework* (four phases, rescue, journals) becomes a **baseline configuration** inside A, described in one short section, not the headline.

### 5.4 Word budget for Draft 3 (cap 3,000; assume abstract counts)

| Section | Words | Content |
|---|---|---|
| Title + abstract | 170 | Contribution + 2–3 *measured* numbers (placeholders until S5) |
| 1 Introduction | 280 | Problem: one visible failure ≠ one fault; why small local agents are hit hardest; contributions list |
| 2 Related work | 250 | Multi-fault FL/repair (DiGiuseppe–Jones; Debroy–Wong; Al-Bataineh), masking in testing (squeeziness; CIT), SWE agents/failure studies — file 07 §1 |
| 3 Model | 620 | Class-conditioned search (3 results) + masking DAG + peeling + look-ahead — file 06 §7 is paste-ready |
| 4 Resource & measurement | 350 | Gold-valid pool, lattice protocol, taxonomy, graph-distance |
| 5 Results | 700 | **Only measured**: interference prevalence, transition matrix, class gate accuracy/calibration, E19–E22 paired effects, noise analysis |
| 6 Limitations | 200 | hunk ≠ fault, 4 public repos vs private hidden repos, n, local vs L4 |
| 7 Conclusion | 100 | |
| References | not counted (confirm) | compact |

What to **cut** from Draft 2: Section 2.4 (System 1/2, Jev), most of §5 (ADK tree figure), §5.3 (training objective, unless Track C ships), Table 1, Case A (fastapi_11194 walkthrough), the "superlinear advantage" paragraph (§9.2), and any sentence whose number lacks a receipt.

### 5.5 Figures and tables (graph-first, per the judge circle)

1. **Fig 1 [M]** Masking DAG examples drawn from *real* lattice cases (3 small panels: independent, shadowed pair, 3-deep chain).
2. **Fig 2 [M]** Heatmap of class-transition matrix T[c→c′] with Wilson/Dirichlet intervals in the supplement.
3. **Fig 3 [M]** Call-graph distance (crash frame → fix site) by class (violin/ECDF).
4. **Table 1 [M]** Interference prevalence: π_multi, shadow, cancel, synergy, depth D — with intervals.
5. **Table 2 [M]** Paired effects E19–E22 (Δ resolved with bootstrap CI, Δ time).
6. **Fig 4 [I]** Toy trade-off curve E[T] vs K (from `bcf_math_sim.py`) — only as an explicitly illustrative figure, caption "[I] toy model; assumptions in Appendix".

### 5.6 Open questions to ask on the paper-track forum (host: Elan Markowitz)

1. Does editing a submitted writeup change its "entered" timestamp for the tie-break rule?
2. Is the 3,000-word cap applied to the abstract, captions, tables, and references?
3. May a Public Project Link PDF exceed 3,000 words, and will judges read it?
4. Is a *released dataset derived from the competition's gold patches* acceptable as a "New Resource" under the data licence (Apache-2.0, competition use)?
5. Is a team allowed one Methods and one Resource writeup both built on the same experiments?

### 5.7 Timeline (paper-specific)

| Date | Action |
|---|---|
| Oct 1–2 | Create and submit a **stub** writeup (platform test; ask §5.6 questions) |
| Oct 8 | Lattice runner + gold units done (M1-16/17); first prevalence numbers (even partial) |
| Oct 15 | Prereg for E19–E22; outline locked to §5.4 word budget |
| Oct 29 | Decision: one or two writeups; transition matrix v1 |
| Nov 5 | Paper numbers frozen; claims audit |
| Nov 8 | Independent read-through (another person, or a separate model session with no project context) |
| **Nov 10** | **Submit final** (buffer for editor bugs); arXiv after the deadline |

---

## 6. What I would do first tomorrow (ordered)

1. Submit the paper stub (20 min) and post the §5.6 questions.
2. Write `lab.Lattice` and run it on the two or three smallest multi-hunk gold-valid tasks by hand, to see what real masking looks like in this data — **before** committing to more theory.
3. Replace `httpx_6821` in every draft with "illustrative example (constructed)" until a real case replaces it.
4. Add the Δ-02/Δ-03 prompt clauses (complete observation first; atomized repro) to P1 for the Sprint-2 tests.

*End of 05.*


---

<!-- ====================================================================== -->
<!-- FILE: 06-whitepaper-math-section_draft3.md -->
<!-- ====================================================================== -->

# 06 — Whitepaper Math Section (Draft 3 working file)
### Fault-class-conditioned search, fault masking, fault interference, and chained faults (the "`httpx_6821` problem")

*Prepared 2026-09-30. Companion files: `05-…` (plan integration, paper brainstorm), `07-…` (prior research), `bcf_math_sim.py` (toy models; every number tagged `[SIM]` below is reproduced by running it).*

**Evidence tags used in this file**

| Tag | Meaning | May appear in the paper as |
|---|---|---|
| `[DEF]` | definition (mine, or standard) | Model section |
| `[THM]` | standard theorem from the literature (cited; verify citation details before submission) | Model section, with citation |
| `[DER]` | derived here from `[DEF]`/`[THM]` by elementary algebra | Model section |
| `[SIM]` | output of a toy model whose inputs are **assumptions** | Only in a figure captioned "illustrative toy model" |
| `[ILL]` | hand-built illustration (e.g. `httpx_6821`) | Only in a figure/box captioned "constructed example" |
| `[HYP]` | hypothesis to be tested | Hypotheses / future work |
| `[MEAS]` | measured, has a receipt ID | Results (none exist yet) |

> **Standing warning (from your own dossier ledger).** Nothing below is a measurement of Gemma, BCF, or the competition data. Two earlier drafts contained numbers that were never measured. This file is built so that the paper's *model section* can be defended on mathematics alone, and its *results section* stays empty until receipts exist.

---

## 0. Bottom line

1. **Your idea is sound and worth building the paper around — with four corrections.** Classifying the visible failure into a class and using the class to reorder the search is a textbook *Bayesian search* move, and it has a clean information-theoretic description. But the statement "speed and effectiveness will simply depend on the number and fidelity of the categories" is too strong: they also depend on the **evidence available at runtime**, the **cost of being wrong**, the **within-class ordering quality**, the **cost of classifying**, and **distribution shift** to the hidden private repos (§1, §3).
2. **The mathematics you were reaching for has names.** Your three phenomena correspond to: *conditional-entropy reduction / guessing entropy* (class-restricted search), *non-additive interaction on a Boolean lattice* (fault interference), and *information loss under a many-to-one map — "squeeziness"* (fault masking); chains are a *dependency DAG whose longest path lower-bounds the number of observe-and-fix rounds* (§2).
3. **Classes must be reordering priors, not filters.** Hard pruning is brittle: in the toy model a classifier at chance level is *worse than no classifier* (40.2 vs 33.7 expected inspections `[SIM]`). A Bayes-style soft ordering never discards a candidate.
4. **Masked faults cannot be classified until they are revealed.** That is why chains need a *peeling loop* (observe → classify the visible fault → fix → re-observe), and why the agent's own reproduction script is itself a masked observation channel (assertion short-circuit, `pytest -x`, output truncation).
5. **Two cheap, testable agent-side rules fall out of the math:** *atomize the repro* (one independent check per expectation in the issue) and *observe the complete failure set before fixing* (don't rely on `-x` or `| head` as the only view). Both are included as experiments E20/E21 in file 05.
6. **The `httpx_6821` example is constructed** (the dossier says so). It is used in §5 purely to illustrate the definitions. Replace it with a real case from the lattice experiment (§6.2) before submission.

---

## 1. Reading your statement sentence by sentence

> *"I aim to build BCF to help solve more issues sooner by classifying errors into exception classes. This effectively limits the search space to the most probable root causes."*

| Phrase | Verdict | Precise version |
|---|---|---|
| "classifying errors into exception classes" | **Right idea, too narrow a label set.** Python exceptions (`KeyError`, `AttributeError`, `AssertionError`…) exist only when something raises. The dossier's own reasoning is that many SWE-bench-style tasks are *silent wrong output* (no exception) `[HYP]`, and feature requests have no failure at all. | Use **failure-signature classes**: a two-axis label (failure mode ∈ {exception, wrong value, wrong state/side effect, wrong status/protocol, hang, missing capability}) × (for exceptions: Python exception family). Keep an explicit `none_of_these` class. Python's exception hierarchy gives a natural *tree*, so granularity can be chosen by cutting the tree (§3.7). |
| "limits the search space to the most probable root causes" | **Right, and this is Bayesian reweighting of the prior over root-cause sites.** Caution: it must be *ordering*, not *deletion*. | `P(L | x) = Σ_c P(c | x) · P(L | c, x)` — a mixture of class-conditional priors weighted by classifier confidence (§3.5). |
| "solve more issues sooner" | **Two distinct goals.** "Sooner" = lower expected inspections `E[T]`; "more" = higher `P(solve within budget B)`. | Class guidance helps both only if its error rate is below a break-even `ε*` (§3.5). |
| "the speed and overall effectiveness … will simply depend on the adjustments to the number and fidelity of the exception categories" | **Partly true, but not "simply".** Number `K` and fidelity `α` set the *first-order* effect. The bound on achievable fidelity is set by the evidence `X`, not by the classifier (Fano, §3.6). Interior optimum in `K` exists (§3.7). Masked faults add a per-round error compounding (§4.4). | `J(K) = overhead(K) + E[T | K, α(K)] + estimation-risk(K)` — a function you can minimize. |

> *"[Flesh out … ‘fault interference’, ‘fault masking’, and multi-step chained issues such as `httpx_6821`]."*

These three are **not** special cases of "classifying errors": they are the reason a *single* classification of the *first visible* failure is not enough. §4 builds that extension.

---

## 2. What phenomena did you describe? (naming table)

| What you wrote | Formal name | Field / origin | Where it is used below |
|---|---|---|---|
| "limits the search space to the most probable root causes" | **Conditional entropy reduction / information gain** `I(L;C) = H(L) − H(L|C)`; **Bayesian posterior ordering**; expected number of guesses = **guessing entropy** (Massey 1994; Arıkan 1996) | information theory; **Bayesian search theory** (Koopman, Blackwell, Stone) | §3.1–3.4 |
| "number and fidelity of categories" | **Granularity–accuracy trade-off**: refinement lowers `H(L|C)` (data-processing) but raises classifier error (**Fano's inequality**) and estimation risk (**bias–variance / model-selection**) | information theory, statistics | §3.6–3.7 |
| "fault interference" | **Non-additive interaction between components**: the second-order finite difference / **Möbius inversion** on the Boolean lattice of fault subsets (same object as a **Shapley interaction index** or **ANOVA interaction term**). Literature terms: *fault interference*, with *constructive / destructive* variants | software fault localization (Debroy–Wong 2009; DiGiuseppe–Jones 2011; Li et al. 2017) | §4.1 |
| "fault masking" | **Observability loss**: one fault prevents another from being *observed*. Forms: **failed error propagation / coincidental correctness**, **information loss under a many-to-one map ("squeeziness")**, **control-flow dominance/shadowing**, and **masking effects** in combinatorial testing | testing theory (Voas PIE; Clark–Hierons squeeziness; Dumlu–Yılmaz) | §4.1–4.3 |
| "multi-step, chained issues" (`httpx_6821`) | **Cascading faults**: a **dependency DAG**; its **longest path (critical path)** lower-bounds the number of reactive observe–fix rounds; sequential **peeling** (iterative repair) | multi-fault repair (Al-Bataineh 2024–2025: *iterative / parallel / simultaneous*; *masking, synergy, cascading*); iterative FLITSR (Callaghan–Fischer) | §4.2–4.5 |
| "error compounding over a chain" (implicit) | **Product of per-round success probabilities**; **recovery by verification** reduces effective error | elementary probability | §4.4 |
| "look-ahead at what the fix will reveal" (new) | **Reachability difference / differential coverage**; **Markov transition over fault classes** | program analysis; Markov chains | §4.5 |

*(Literature details and verification status are in file 07. I could read abstracts, not full texts, of the 2025 Al-Bataineh papers; I use their terminology, not their theorems.)*

---

## 3. Single-fault model: class-conditioned search

### 3.1 Setup `[DEF]`

- **Evidence** `X`: what the agent can see — issue text, hints, and (after one or two tool calls) the output of its own reproduction. *Not* `test_patch` (not available at scoring time; file 05 §0.1 P2).
- **Candidate set** `𝒞(x)`, `|𝒞| = N`: symbols surviving cheap retrieval (grep on identifiers from the issue, traceback frames, graph neighbors). Raw repo size `n` is thousands of symbols (the official notebook shows 4,263 nodes for one fastapi snapshot `[NB]`); `N` is typically ~10².
- **Root-cause site** `L ∈ 𝒞` (for a single fault; multiple faults are §4).
- **Failure signature** `σ` and **class** `C = c(σ)`, where `c` maps signatures into a partition `𝒫_K` of `K` classes. A family of nested partitions `𝒫_1 ≺ 𝒫_2 ≺ …` (each refines the previous) models choosing granularity.
- **Inspection** of a candidate costs `c_i` (tool calls or seconds; in the decode-bound regime, reading is cheap and *thinking/editing* is what costs) and finds the fault, if it is there, with probability `q_i ≤ 1` (an LLM can read a buggy function and fail to notice the bug; `q_i < 1` is realistic).

### 3.2 Proposition 1 — classes can only help, and finer classes help more `[THM]`

```
I(L; C)  =  H(L) − H(L | C)  ≥  0
If 𝒫' refines 𝒫, then  H(L | C')  ≤  H(L | C).
```

*Proof sketch.* `C = f(C')` for the coarsening map `f`; conditioning on more information cannot increase entropy. ∎
**Consequence:** in the absence of classification error and overhead, more classes never hurts. Everything interesting in the trade-off comes from the *other two terms* (§3.6–3.7).

### 3.3 Proposition 2 — entropy lower-bounds search effort `[THM]` (Massey 1994)

Let `G*` be the number of guesses needed when candidates are tried in order of decreasing posterior probability (perfect detection, unit cost). Then, for `H(L|C) ≥ 2` bits:

```
E[G* | C]  ≥  2^( H(L | C) − 2 ) + 1
```

**Reading:** each bit of class information can at best *halve* the lower bound on expected inspections. In the toy model (§3.8) every doubling of `K` removes ≈ 1 bit: `H(L|C_K) = 6.37, 5.37, 4.37, 3.53, 2.96` bits for `K = 1, 2, 4, 8, 16` and the lower bound falls `21.6 → 11.3 → 6.2 → 3.9 → 2.95` `[SIM]`. (Verify Massey's bound statement and the `H ≥ 2` condition in the original before publication.)

### 3.4 Proposition 3 — the right ordering: probability per unit cost `[THM]` (Bayesian search theory)

For one hidden object, box priors `p_i`, costs `c_i`, detection probabilities `q_i`, repeated looks allowed, the expected-cost-minimizing rule is: *next inspect the box maximizing* `p_i q_i / c_i`, then update after a miss:

```
p_i'  =  p_i (1 − q_i) / (1 − p_i q_i)        (inspected box)
p_j'  =  p_j / (1 − p_i q_i)                   (all others)
```

(Koopman 1956; Blackwell 1962; Stone 1975 — verify exact attributions.) Two lessons for BCF: (i) a *cheap* candidate with modest probability can rank above an *expensive* likely one (for a 150-line read versus a graph lookup); (ii) `q_i < 1` means a miss does **not** eliminate a candidate, only lowers its weight — so the agent should be allowed to revisit, and the prompt should not say "rule out".

### 3.5 Proposition 4 — noisy classes, break-even accuracy, and why ordering beats filtering `[DER]`

Let `ε = P(Ĉ ≠ C)` be the classifier error, `T_0` the expected cost without classes, `T_in` the expected cost when the class is right (guided list), and `T_miss` the expected cost when it is wrong. With hard "predicted class first" ordering:

```
E[T]  =  (1 − ε) · T_in  +  ε · T_miss
Helps iff   ε  <  ε*  =  (T_0 − T_in) / (T_miss − T_in)
```

**Two warnings from the toy model `[SIM]`** (exact scan, not the closed form): the break-even error is `ε* = 0.50, 0.71, 0.84` for `K = 4, 8, 16` — classes are forgiving when they are informative — **but** a classifier at chance level is *worse than none* (expected inspections 45.1, 40.2, 37.0 vs a baseline of 33.7). Guidance that points the wrong way costs more than no guidance.

**The fix is the Bayes posterior, not a hard filter:**

```
P(L = l | x)  =  Σ_c  P(c | x) · P(l | c, x)            (soft ordering)
```

It degrades gracefully: with a flat `P(c|x)` it reduces to the no-class ordering. Its requirement is **calibration** — the class probabilities must mean what they say (expected calibration error, ECE; §6.4). Gemma's self-reported probabilities are ordinal at best (Compendium A8.2) so calibrate on held-out labeled tasks before trusting them.

### 3.6 Proposition 5 — fidelity is bounded by the evidence, not by the classifier `[THM]` (Fano)

For any classifier that predicts `C` from `X` over `K` classes:

```
H(C | X)  ≤  h_b(P_e) + P_e · log2(K − 1)       ⇒     P_e  ≥  ( H(C | X) − 1 ) / log2(K − 1)
```

**Reading:** adding classes raises `H(C)`; unless the evidence reveals them, `H(C|X)` rises with `K` and so does the error floor. This is why the *text-only* stage and the *after-first-repro* stage differ: a runtime traceback carries most of the information about an exception-family class, the issue prose carries little `[HYP]`. The two-stage gate (E18) measures exactly `I(Ĉ_text; L)` versus `I(Ĉ_run; L)`.

### 3.7 Proposition 6 — there is an interior optimum in the number of classes `[DER]` + `[THM]`

Total expected cost for granularity `K`:

```
J(K)  =  overhead(K)                      # prompt tokens + classification call(s)
       +  E[ T | K, α(K) ]                # guided search (Prop. 4, soft ordering)
       +  λ · R_est(K)                    # cost of learning priors from finite data
R_est(K)  ≈  Σ_c  P(c) · (m_c − 1) / (2 n_c)      # expected KL risk of an add-constant multinomial estimator
```

where `m_c` is the number of outcome categories the class-conditional prior must distinguish and `n_c` the labeled examples in class `c`. With 129 public tasks, each additional leaf class starves the others of data — so **hierarchical smoothing** (back off from a leaf class to its parent in the exception tree, weighted by `n_c`; a Dirichlet-tree / Katz back-off) is the standard remedy, and it is what makes "cut the exception tree at depth d" a tunable, data-aware knob.

### 3.8 Toy-model numbers (illustrate the shapes; **do not quote as results**) `[SIM]`

Assumptions (all arbitrary, all in `bcf_math_sim.py`): `N = 120` candidates; 16 latent fine classes with Zipf prior; uniform within class; `K` coarse groups formed by merging latent classes; classifier accuracy falls linearly in `log2 K` (strong: −0.25 at K=16, weak: −0.45); overhead = `1 + 0.15K` inspection-equivalents.

| Scenario | K | accuracy α | E[T] if class known | E[T] with errors | + overhead |
|---|---|---|---|---|---|
| — | 1 | 1.00 | 33.66 | 33.66 | 33.66 |
| strong | 2 | 0.94 | 17.87 | 21.62 | 22.92 |
| strong | 4 | 0.88 | 10.99 | 16.68 | 18.28 |
| strong | **8** | 0.81 | 6.40 | 13.64 | **15.84** |
| strong | 16 | 0.75 | 4.40 | 13.10 | 16.50 |
| weak | 2 | 0.89 | 17.87 | 24.62 | 25.92 |
| weak | 4 | 0.78 | 10.99 | 21.23 | 22.83 |
| weak | **8** | 0.66 | 6.40 | 19.44 | **21.64** |
| weak | 16 | 0.55 | 4.40 | 20.06 | 23.46 |

**What the shapes show (and all they show):** a large gain from the first few classes; a gap between "class known" and "class predicted" that grows with `K`; an interior optimum (`K = 8` in both toy scenarios) once overhead is included; and — separately — soft ordering is never worse than hard ordering and matters only when accuracy is low. **What they do not show:** how informative real classes are about real root-cause sites. That number — `I(L; C)` on the actual tasks — is the empirical heart of the section (E17, E24).

---

## 4. Multi-fault model: interference, masking, and chains

### 4.1 Definitions on the lattice of present faults `[DEF]`

Let `F = {f_1, …, f_m}` be **fault units** (minimal independent fixes; in practice groups of gold-patch hunks that cannot be applied separately). Let `S ⊆ F` be the set of faults **present** (unfixed). For a test `t`:

- `τ_t(S) ∈ {0,1}` — 1 if `t` fails with `S` present; `τ_t(∅) = 0`.
- `o_t(S)` — the **failure signature** observed (exception type, location, message class) when `τ_t(S) = 1`.

**Null model (independent faults, OR-trigger):** `τ_t(S) = max_{i∈S} τ_t({i})`, and the signature is one of the `o_t({i})` with `τ_t({i}) = 1`.

Deviations from the null, for a pair `(i, j)` in context `B` (other present faults):

```
Outcome interference   J_t(i,j | B) = τ_t(B∪{i,j}) − max( τ_t(B∪{i}), τ_t(B∪{j}) )  ∈ {−1, 0, +1}
   J = −1  cancellation / destructive interference   (two failing faults together pass: compensating errors)
   J = +1  synergy / constructive interference       (passes with either alone, fails with both)
   J =  0  null (OR-consistent)

Signature shadowing    i ⇝_t j   :⇔   τ_t({j}) = 1  ∧  τ_t({i,j}) = 1  ∧  o_t({i,j}) = o_t({i}) ≠ o_t({j})
   (with i present, j's failure is still a failure but j's signature is unobservable: "masking")
```

`J_t` is the second-order mixed difference of the indicator `τ_t` — the same object as a Möbius-inversion interaction coefficient on the Boolean lattice (equivalently, a pairwise Shapley interaction index). **Mapping to the literature vocabulary:** fault interference in both directions — faults hiding others, or helping them manifest (Debroy–Wong 2009; DiGiuseppe–Jones 2011), with the *constructive/destructive* wording used by, e.g., Li et al. 2017, *masking, synergy, cascading* (Al-Bataineh, ASE 2025 abstract), *masking effects* (Dumlu–Yılmaz–Cohen–Porter 2011: a failure that perturbs execution so that other behaviors are never exercised).

**Important distinction for the agent.** The grader only needs `F2P ∪ P2P` to pass. A fault unit is **essential** iff removing it from the fix makes some F2P test fail. Let `m*` = size of the smallest sufficient subset of units (a 1-minimal subset, computed by delta debugging over units). **Interference only affects the score through the essential units.** Non-essential units inflate hunk counts but not difficulty.

### 4.2 The shadowing graph, depth, and a lower bound for reactive agents `[DEF]` + `[DER]`

Define the **masking digraph** `M` on `F`: an edge `i → j` if `i ⇝_t j` for some test `t` in the agent's observation channel. Let `D(M)` be the number of vertices on the longest directed path (the **depth**).

**Proposition 7 (reactive critical path).** Suppose `M` contains a path `f_1 → f_2 → … → f_D` in which every shadowing is total for the agent's observation channel (no test the agent can run reveals `f_{k+1}` while `f_k` is present). An agent that (a) fixes only faults it has observed and (b) observes only through that channel needs at least `D` observe–fix rounds.

*Proof.* By induction: `f_1` is the only observable fault in round 1; `f_2` becomes observable only after `f_1` is fixed, and so on. ∎

**Why this matters:** `D` is a property of the *code and tests*, not of the agent, and it is the floor for any strategy that learns solely by watching failures. The only way below `D` is **prediction** — fixing or inspecting `f_{k+1}` before it has been observed (§4.5). Cycles in `M` (mutual shadowing) make the order ambiguous and show up as **oscillation**: fixing `A` reveals `B`, fixing `B` restores `A`'s signature; detect it and switch to a joint edit (Al-Bataineh's "simultaneous" repair).

### 4.3 Masking as information loss `[THM]`-flavored, `[HYP]` for code

If a component computes a deterministic function `y = g(x)` of a random input, the information destroyed is `H(X | Y) = H(X) − H(Y)` — **squeeziness** (Clark & Hierons; normalised form Clark–Hierons–Patel 2019). High squeeziness correlates with failed error propagation, i.e. a wrong internal value that never reaches the output (Patel–Hierons–Clark 2022 report strong rank correlation between such measures and the probability of FEP in mutation experiments). Interpretation for debugging: **a many-to-one step between a fault and the assertion hides the fault** (clamps, truthiness coercion, `dict.get(k, default)`, `getattr(obj, name, default)`, `x or default`, broad `except`, `isinstance` dispatch that falls through). Section 2.2 of file 07 lists the Python pattern catalog. Static proxy (`[HYP]`): count lossy operations on the graph path between the first-visible fault and the failing assertion; use it as a prior for where a second fault may hide.

### 4.4 Sequential peeling: complexity and error compounding `[DER]`

**Joint search is combinatorial; peeling is additive.** Locating `m` faults simultaneously among `N` candidates has `C(N,m) ≈ N^m / m!` hypotheses (for `N = 120, m = 2`: 7,140). Peeling handles them one visible fault at a time, with a class-guided list each round (toy `K = 8`: ≈ 13.6 inspections per round `[SIM]`), so ≈ `m × 13.6 = 27` — provided `M` is acyclic and each round reveals at least one new source.

**Errors compound along the chain.** If round `r` picks the wrong class with probability `ε_r` and a verification signal (the failure signature did not change, a previously passing test now fails, the reproduction is unchanged) catches a fraction `v` of wrong picks before effort is wasted, the effective error is `ε_r(1 − v)` and

```
P(all D rounds correct)  =  Π_r ( 1 − ε_r (1 − v) )
```

`[SIM]` table (constant `ε`, chain depth `D`):

| ε | v = 0 | D=1 | D=2 | D=3 | D=4 |
|---|---|---|---|---|---|
| 0.2 | no verification | 0.80 | 0.64 | 0.51 | 0.41 |
| 0.2 | v = 0.5 | 0.90 | 0.81 | 0.73 | 0.66 |
| 0.2 | v = 0.8 | 0.96 | 0.92 | 0.89 | 0.85 |
| 0.3 | no verification | 0.70 | 0.49 | 0.34 | 0.24 |
| 0.3 | v = 0.8 | 0.94 | 0.88 | 0.83 | 0.78 |

**Reading:** a gate that looks good on one fault (80 % accurate) is weak on a 4-deep chain (41 %) unless the loop has a **re-classification and mismatch check after every fix**. This is the quantitative reason BCF needs the loop, not just the gate — and a concrete use for the rescue/breaker machinery (Compendium A2).

### 4.5 Look-ahead: predicting what a fix will unmask `[DER]` + `[HYP]`

Two complementary predictors of the next fault, both of which reduce the reactive floor of Proposition 7:

**(a) Differential coverage.** Let `Cov(t, P)` be the set of lines executed by the reproduction under patch state `P`. After fixing `f_r`, the **newly reachable region** is `U_r = Cov(t, P_r) ∖ Cov(t, P_{r−1})`. If the next fault lies in `U_r` with probability `π_U` (much larger than its share `|U|/N`), inspecting `U_r` first costs

```
E[inspections]  =  π_U · (u+1)/2  +  (1 − π_U) · ( u + (N − u + 1)/2 ),       u = |U_r|
```

Toy `[SIM]`: `N = 120, u = 10, π_U = 0.7` → 23.5 inspections versus 60.5 for blind search. `π_U` is unknown (`[HYP]`); the lattice data (§6.2) estimate it. Implementation needs only the standard-library `trace` module (or `sys.settrace`), which is what the sandbox has (no network; `coverage` may not be installed). **Limitation:** catches *control-flow* masking (a guard or early exit that hid a region), not *value* masking (a lossy step).

**(b) Class-transition Markov chain.** Estimate `T[c → c′] = P(next visible class = c′ | fixed class = c)` from the lattice data. The information the current class carries about the next one is `H(C′) − H(C′ | C) = I(C; C′) ≥ 0`; apply Proposition 2 with this extra bit count to the next round's search. Smooth with a Dirichlet prior and back off through the class tree (§3.7).

### 4.6 Three layers at which masking happens in the agent setting `[DEF]`, `[HYP]`

| Layer | Mechanism | Example | Countermeasure (testable) |
|---|---|---|---|
| **Code** | control-flow dominance (guard/early exit), value squeezing, exception swallowing, shared-state corruption | `history = []` guard prevents the `Response.stream` assertion from ever running `[ILL]` | differential coverage look-ahead (E22); mask-proneness prior |
| **Test** | *assertion short-circuit* (first failing `assert` hides the rest of the test body); `pytest -x` (stops at first failing test); reproduction scripts written as one sequence of asserts | the issue lists `assert len(history) == 3` then `assert history[0].stream`; the second line never runs `[ILL]` | **atomized repro** (E20): one independent check per expectation, each in its own `try/except`; **complete observation first** (E21) |
| **Tool** | output truncation (`| head`, 5,000-char cap), double-JSON escaping making `edit_file` fail, dropped reasoning between turns | forum experiment: double-JSON 22 % edit failures, single-JSON 62 %, raw text 0 % `[INTEL3 §5]` (participants' measurement) | anchor rules in prompt P1; re-measure yourself |

**The agent's own oracle is a masked channel.** The hidden F2P tests are a *superset* observation channel: an agent that stops when its own reproduction passes can still fail the hidden test that exercises the second fault. Two protocol rules follow from the math and cost little:

1. **Atomize the repro.** Transcribe *every* expectation in the issue as a separate check; run all checks without short-circuit.
2. **Exercise the next use of the repaired value.** After a fix, run code that *consumes* the repaired output downstream (the issue's later assertions are the best hint). This is the operational form of "look-ahead".

Template (stdlib only; put in `/tmp`, never `/workspace`):

```python
# /tmp/atomized_repro.py — every expectation is its own check; nothing short-circuits
import traceback
CHECKS = []
def check(name):
    def deco(fn): CHECKS.append((name, fn)); return fn
    return deco

@check("history has 3 entries")
def _(): assert len(r.history) == 3
@check("first history item has a stream")
def _(): assert r.history[0].stream

if __name__ == "__main__":
    for name, fn in CHECKS:
        try: fn(); print(f"PASS  {name}")
        except Exception as e: print(f"FAIL  {name}: {type(e).__name__}: {str(e)[:120]}")
```

### 4.7 Assumptions and where the guarantees end

1. **Peelability:** `M` acyclic; each round exposes a new source. False under mutual masking (oscillation).
2. **Class informativeness:** `I(L;C)` high enough that guided search beats flat (measure, don't assume).
3. **Stationarity:** class-conditional priors from four public repos transfer to private repos (`[HYP]`; leave-one-repo-out E33 measures the drop).
4. **Hunks ≈ fault units:** coarse. Callaghan–Fischer note that datasets are sometimes "incorrectly considered multi-fault datasets due to multi-hunk faults" — group inseparable hunks into units.
5. **Observation:** the agent's channel shows at least the first visible fault. If *nothing* is visible (empty failure set), the gate degenerates to text-only classification.
6. **Costs are roughly additive** and detection probability `q` roughly constant — both false in detail; they are simplifications for the model section, flagged as such.

---

## 5. Worked example: the `httpx_6821` chain in the language of §4  `[ILL]`

> **Banner.** `httpx_6821` is a **constructed** scenario (the dossier's own ledger: "a task id that does not exist in the competition dataset"). Function names, line numbers, and the test outcomes below are reconstructed from the dossier's description, not read from the repository. The example is used to show how the definitions behave; do not cite it as data.

### 5.1 The lattice

Fault units: `f1` = history reset on scheme change in `_send_handling_redirects` (`_client.py`); `f2` = hard `assert self._stream is not None` in `Response.stream` (`_models.py`). Tests (from the dossier's description): `T1` `test_history_http_to_https_chain`, `T2` `test_history_full_scheme_chain`, `T3` `test_history_stream_state`.

| Present faults `S` | T1 | T2 | T3 | Reading |
|---|---|---|---|---|
| `{f1, f2}` (original) | FAIL: `len(history)` wrong | FAIL: `len(history)` wrong | ERROR: `AssertionError` in `.stream` | two distinct signatures already visible |
| `{f2}` (f1 fixed) | FAIL: `AssertionError` in `.stream` | FAIL: same | FAIL: same | T1/T2's signature **changes** to f2's |
| `{f1}` (f2 fixed) | FAIL: `len(history)` wrong | FAIL: same | pass | f2 alone does not fix T1/T2 |
| `∅` (both fixed) | pass | pass | pass | |

Outcome interference: `J = 0` for T1, T2, T3 (consistent with independent OR-triggers). **Signature shadowing:** `f1 ⇝ f2` on T1 and T2 (with `f1` present, T1 shows f1's signature; f2's appears only after f1 is fixed), *not* on T3. So `M = {f1 → f2}`, `D = 2`.

### 5.2 What the math says about the naive and the class-aware agent

1. **Why the naive agent went wrong (in the constructed trace):** it ran `pytest -x … | head`, so it observed *one* signature — T3's `AssertionError` — the **downstream** fault's. The most concrete error message belonged to the fault that is *not* first in the causal order. That is a **tool-layer masking** (§4.6) of a code-layer chain.
2. **Complete observation collapses the chain.** With all three tests shown (no `-x`), the agent sees *two* signatures at once. Since both can occur inside T1's body and the `len` assertion executes before `.stream`, execution order gives `f1` before `f2`: the order is **decidable from the observation set**, reducing the reactive floor from `D = 2` rounds to one round of two fixes. (This is only true because T3 reveals f2 early; with only T1/T2 in the channel the floor is 2.)
3. **The class gate's job:** the visible classes are `c1` = *wrong value (container length)* and `c2` = *AssertionError (invariant)*. The crash-class rule from the dossier ("guard-missing vs defensive: default to defensive — trace the invalid state backward") points from `c2` toward the region of `c1`. In Bayes terms: `P(L | c2)` should put weight on *upstream writers of the asserted state* (graph: callers/assigners of `_stream` and of `history`), not only on the assert's own symbol.
4. **In this grader, the main danger is not the order — it is stopping early.** The final patch is the same two hunks whatever the order; fix order changes *time and regression risk*. The scoring failure is **submitting after fixing only the visible fault** because the agent's own reproduction (one script, sequential asserts) passes — a *partial fix of an essential-unit set*. That is directly measurable (E34: "partial-fix rate").

### 5.3 Toy numbers for this example `[SIM]` + `[ILL]`

With the toy `K = 8` (per-round `E[T] ≈ 13.6` vs flat `33.7`) and two rounds: ≈ **27 vs 67 inspections**. With constant class error `ε = 0.2`: `P(both rounds correct) = 0.64` with no verification, `0.81` if a mismatch check catches half of wrong picks (`v = 0.5`), `0.92` at `v = 0.8`. Hypothetical look-ahead: if fixing `f1` makes `u = 10` new lines reachable and `π_U = 0.7`, the second fault costs ≈ 23.5 instead of 60.5 inspections. **All inputs are assumptions.**

### 5.4 Consistency check on the constructed example (for whoever reuses it)

The issue text says the second assertion "only surfaces after the above is fixed", yet `T3` is listed as already erroring on the original code. Both cannot hold for the *same* observation channel: the second fault is hidden from `T1/T2` (short-circuit) but visible to `T3`. A cleaner masking illustration has **no** test that touches the second fault while the first is present. In the real data, the lattice will tell you which pattern actually occurs.

---

## 6. Measurement plan (turns each `[HYP]` into `[MEAS]`)

All of §6.1–6.3 need **no agent runs** — only the gold patches, snapshots, graphs, and a grader environment — so they run on AUX2 (CPU) in Sprint 1 while MAIN produces baselines.

### 6.1 Class labels and priors from the data (no agent)

1. For each gold-valid task, run the F2P tests at `base_commit` in the Grader Env; capture failing test ids, exception types, and the innermost/outermost frames inside the repo → **failure-signature class** `C*` (two-axis label, §1).
2. Map each hunk of the gold patch to graph `node.id` (enclosing function/method) → **root-cause site(s) `L*`**.
3. Estimate `P(L | C)` structure through: **frame distance** (graph shortest-path length from the traceback's top in-repo frame to `L*`), and fraction `P(L* ∈ traceback frames | C)` — the analogue of published stack-trace studies (file 07 §1.F) but for Python and for this task distribution. Report by class; leave-one-repo-out.
4. **Mutual information** `Î(L; C)` with Miller–Madow bias correction and bootstrap interval (plug-in MI is biased upward on small samples; with 100 tasks and ≥ 10 classes it will flatter you). Report both.

### 6.2 The hunk-lattice experiment (E24) — the paper's real "meat"

Protocol (`lattice_tools.py`, tested on a synthetic repo only):

1. Split each gold patch into hunks; **group inseparable hunks into fault units** (a subset that fails to apply, or fails to import, merges into its neighbors).
2. Keep tasks with `2 ≤ m ≤ 4` units (cost `2^m − 1` runs: 3, 7, 15).
3. For every subset of units applied to the base snapshot, run the F2P tests (and the P2P tests that touch the changed files); record per-test pass/fail **and failure signature**.
4. Compute for each task: `m*` (1-minimal sufficient set via ddmin), outcome interference `J` per pair and context, shadowing edges, masking digraph, depth `D`, and the **signature transition** `c → c′` when a proper subset changes the visible class.
5. Report with Wilson intervals: `π_multi = P(m* ≥ 2)`, `ρ_shadow`, `ρ_cancel`, `ρ_synergy`, distribution of `D`, and the transition matrix `T`.

What this gives the paper: *the first measurement of masking/interference structure in this family of issue-resolution tasks* (I did not find one; file 07 §4), a real replacement for `httpx_6821`, and the prior `π_U`/`T` used in §4.5.

Caveats to print next to the numbers: (i) hunk-level ≠ fault-level; (ii) gold patches bundle refactors and unrelated hunks; (iii) four public repos only; (iv) F2P tests are the maintainers' tests, which choose what is observable.

### 6.3 Reporting precision (what n buys you) `[SIM]`

Wilson 95 % intervals for a proportion: `6/30 → [0.10, 0.37]`; `18/100 → [0.12, 0.27]`; `30/100 → [0.22, 0.40]`. With ~100 gold-valid tasks, prevalence estimates carry roughly ±8–10 pp; **per-repo** breakdowns (≈ 20–40 tasks each) carry ±15 pp or more. Say so in the Limitations paragraph; don't over-read repo differences.

### 6.4 Classifier evaluation (E17–E18)

- Labels from §6.1 step 1 (objective: derived from runs, not from reading prose).
- Metrics: accuracy, macro-F1, confusion matrix; **ECE** with 10 equal-mass bins and a **reliability diagram**; `none_of_these` rate; **option-order sensitivity** (shuffle the class list, recompute); leave-one-repo-out.
- **Fano check:** estimate `H(C|X)` by the held-out cross-entropy of the calibrated classifier (an upper bound), compute the implied `P_e` floor, and compare with the observed error.
- **Two stages:** text-only (`X_text`) and after one reproduction run (`X_run`). Report `Î(Ĉ; L)` for both.
- Use the **local Gemma** for the classifier (dev-time and in-submission): no ToS/licence question (file 05 P10).
- Decision: adopt the gate in the submission only if accuracy exceeds the toy-model-independent **break-even** `α_be` computed from *your measured* `T_0, T_in, T_miss` (Prop. 4) by a margin, **and** ECE ≤ 0.10. Otherwise use the class only as a soft prior or drop it.

### 6.5 Agent-side experiments (paired, pre-registered; detail in file 05 §3.1)

| ID | Hypothesis (H) | Primary metric | Kill rule |
|---|---|---|---|
| E20 | Atomized repro exposes the second failure before patching more often than a monolithic repro | fraction of multi-unit tasks where ≥ 2 distinct signatures are observed pre-patch | no improvement **and** time +10 % |
| E21 | Complete-observation-first reveals strictly more distinct failures than `-x`-first | distinct failing tests observed | none |
| E19 | Class-conditioned playbooks beat a flat prompt | resolved (paired), tool calls | lower 80 % bound < −1 pp |
| E22 | Differential-coverage look-ahead reduces rounds on Lattice-set tasks | rounds to resolve; resolved | rounds unchanged |
| **E34** | **A substantial share of failed agent patches are *partial fixes* of multi-unit tasks** | partial-fix rate = failed patches whose hunks cover a proper non-empty subset of essential units | (descriptive) |

E34 is the most direct test of the masking story *in the grader's terms*. It needs only the agent patches already produced by R0/R1/v1 and the unit map from §6.2.

---

## 7. Paste-ready draft text for the paper ("Model" section, ≈ 520 words)

*Tags in `[...]` are for you; delete them in the final. Numbers in `⟦…⟧` are placeholders that **must** be filled from receipts or the sentence deleted.*

---

**3 Fault-Class-Conditioned Search with Masked-Fault Peeling**

**3.1 Setting.** An issue-resolution agent receives evidence *X* (issue text, hints, and the output of its own reproduction) and must locate a root-cause site *L* among *N* candidate symbols retrieved from the repository graph. Faults *F = {f₁,…,f_m}* are minimal independent fix units. We write τ_t(S) for the failure indicator of test *t* when the set *S ⊆ F* of faults is present, and o_t(S) for its failure signature.

**3.2 Fault classes as search priors.** Let *c* map signatures into *K* classes (a cut of the Python exception hierarchy extended with non-exception modes: wrong value, wrong state, wrong status, hang, missing capability, and an explicit *none-of-these*). Since conditioning cannot increase entropy, *I(L;C) = H(L) − H(L|C) ≥ 0*, and refining the partition never increases *H(L|C)*. By Massey's bound, the expected number of inspections under optimal ordering satisfies *E[G*] ≥ 2^{H(L|C)−2} + 1*: each bit of class information can at best halve the lower bound on search effort. Classes are used as a *soft prior*, *P(L|x) = Σ_c P(c|x) P(L|c,x)*, never as a filter: with classifier error ε, a hard "class first" policy helps only if ε < ε* = (T₀ − T_in)/(T_miss − T_in), and a classifier at chance can be worse than none. Fano's inequality, *P_e ≥ (H(C|X) − 1)/log₂(K−1)*, shows that the attainable fidelity is bounded by the evidence: we therefore classify in two stages — from text, and again after the first reproduction run. Granularity trades information gain against classifier error and the cost of estimating priors from finite data; we choose *K* by minimizing an empirical objective with hierarchical (tree) smoothing. [measured on the gold-valid pool: ⟦Î(L;C)⟧, ⟦accuracy, ECE⟧, ⟦break-even α⟧ — E17/E18]

**3.3 Interference, masking, and chains.** For a pair *(i,j)* we define *outcome interference* J_t = τ_t({i,j}) − max(τ_t({i}), τ_t({j})) ∈ {−1,0,+1} (cancellation, null, synergy) and *signature shadowing* i ⇝_t j when j fails alone but, with i present, t shows i's signature: the second fault is *masked*. Shadowing edges form a digraph *M* whose depth *D* lower-bounds the number of observe-and-fix rounds for any agent that learns only from failures. Masking arises at three layers: code (guards, early exits, lossy steps — "squeezing" in the sense of Clark and Hierons), test (assertion short-circuit, `pytest -x`), and tool (truncation, escaping). An agent's own reproduction is therefore a *masked observation channel*, and hidden tests are a superset of it.

**3.4 Peeling and look-ahead.** Joint localization of *m* faults has ≈ N^m/m! hypotheses; peeling reduces this to *m* class-guided searches if *M* is acyclic. With per-round class error ε_r and a mismatch check catching a fraction *v* of wrong picks, *P(success) = Π_r (1 − ε_r(1−v))*, so a gate that is adequate for one fault degrades along a chain unless every fix is followed by re-observation and re-classification. To go below the reactive floor *D* we predict the next fault from (a) the *newly reachable region* U_r = Cov(t, P_r) ∖ Cov(t, P_{r−1}) of the reproduction after fix *r*, and (b) a class-transition matrix T[c→c′] estimated from data. Two protocol rules follow: *atomize* the reproduction (one independent check per expectation in the issue) and *observe the complete failure set* before fixing. [measured: ⟦π_multi⟧, ⟦shadowing rate⟧, ⟦depth distribution⟧, ⟦partial-fix rate of failed patches⟧, ⟦E19–E22 paired effects⟧ — E24, E34, E19–E22]

---

*Word count of the block above ≈ 520 (excluding bracketed notes; whitespace-delimited, so formulas count as words). Budget in file 05 §5.4 is 620 → about 100 words of headroom for the measured numbers.*

---

## 8. Claims audit for the math section (what the paper may say today)

| Claim | Allowed now? | Needs before it may appear |
|---|---|---|
| "Conditioning on a class cannot increase entropy; refinement never increases `H(L|C)`." | **Yes** `[THM]` | — |
| "Massey's bound implies each bit of class information can at best halve the lower bound on expected guesses." | **Yes**, with citation (verify statement) | check the `H ≥ 2` condition in the original |
| "Hard class-first ordering can be worse than no classifier; soft Bayes ordering degrades gracefully." | **Yes** as a statement about the model; the toy numbers only as `[SIM]` figure | — |
| "Fano's inequality bounds classifier error below by the conditional entropy of class given evidence." | **Yes** `[THM]` | — |
| "Shadowing depth `D` lower-bounds the number of rounds of a reactive agent." | **Yes** `[DER]` (state the assumptions) | — |
| "Peeling reduces joint search from `C(N,m)` to additive cost." | **Yes** under stated assumptions | — |
| "`I(L;C)` is ≥ X bits on this task distribution." | **No** | E17/E24 receipts |
| "Masking/interference occurs in X % of tasks." | **No** | E24 receipts |
| "Partial fixes account for X % of failed patches." | **No** | E34 receipts |
| "Atomized repro / complete observation improves resolve rate." | **No** | E20/E21 paired results |
| "BCF reduces localization calls from 12–20 to 3–4." | **No — delete** | never measured (file 05 P11) |
| "`httpx_6821` shows …" | **Only as a labeled constructed example** | — |

---

## Appendix A — Reproducing the toy numbers

```bash
python3 bcf_math_sim.py        # stdlib only; deterministic
```
Produces: Model 1 (E[T] vs K for strong/weak classifier, hard vs soft ordering), Model 2 (closed-form approximation and exact break-even scan), Model 3 (chain compounding), Model 4 (look-ahead), Model 5 (Wilson intervals), Model 6 (subset-run counts). Change the assumptions at the top of the file and watch which conclusions survive: the *shapes* (diminishing returns, interior optimum, compounding) are robust to the arbitrary constants; the *values* are not.

## Appendix B — Hunk-lattice tooling

`lattice_tools.py` provides `split_hunks`, `build_patch`, `apply_subset`, `ddmin`. Its `__main__` self-test builds a two-file, two-hunk repo, applies all four subsets, evaluates two predicates, and runs ddmin — it passed here. It has **not** been run on any competition task. Integration sketch for the real runner:

```python
for task in gold_valid_pool:                              # needs the Grader Env (file 02, Sprint 1)
    units = group_inseparable(split_hunks(task.patch))    # merge hunks that cannot be applied alone
    if not 2 <= len(units) <= 4: continue
    for r in range(len(units) + 1):
        for subset in combinations(range(len(units)), r):
            with fresh_container(task) as c:              # Container-B-style: fresh snapshot + baseline commit
                apply_subset(c.repo, task.patch, flatten(units, subset))
                res = c.run_pytest(task.f2p_tests + touched_p2p_tests, junit=True)
                ledger.write(task.id, subset, res.per_test_outcome, res.signatures)
```
(`group_inseparable`, `fresh_container`, `run_pytest` are for you to implement against the harness's `swegemma.sandbox` helpers — I have not seen their exact signatures, only the README.)

*End of 06.*


---

<!-- ====================================================================== -->
<!-- FILE: 07-prior-research-fault-interference-masking.md -->
<!-- ====================================================================== -->

# 07 — Prior Research: Fault Interference, Fault Masking, and Where They Arise in a Codebase
### What has been done, what is relevant to BCF, and where the gap is

*Prepared 2026-09-30. Companion to `06-whitepaper-math-section_draft3.md` (the model) and `05-…` (plan). This is a **focused** literature sweep (≈ 10 web searches plus fetching one full paper), not a systematic review. Read §5 (limits) before citing anything.*

**Verification status used in every table**

| Mark | Meaning |
|---|---|
| **V-full** | I opened and read the paper text this session |
| **V-abs** | I read the abstract/listing/venue page this session |
| **V-via** | I saw the result only as reported by another paper or survey (cite the original only after reading it) |
| **K** | Recalled from general knowledge; I did **not** verify it this session — confirm authors, year, venue, and pages before citing |

---

## 1. Map of the field

### A. Multi-fault fault localization and "fault interference"

*The phenomenon you call "fault interference" has an established name and a 15-year empirical literature, mostly on spectrum-based fault localization (SBFL) for Java/C programs.*

| Work | What it establishes | Status | Relevance to BCF |
|---|---|---|---|
| **Debroy & Wong**, "Insights on fault interference for programs with multiple bugs," ISSRE 2009, pp. 165–174 | Introduces the study of interference between simultaneous faults: some faults **hide** others' incorrect behavior; conversely some help manifest others. A later survey reports interference in ~67 % of the programs they assessed | V-abs (dblp listing) + V-via (survey, arXiv:1607.04347) | **High** — the original naming of the phenomenon; cite |
| **DiGiuseppe & Jones**, "On the influence of multiple faults on coverage-based fault localization," ISSTA 2011 | Multiple faults barely hurt finding the *first* fault, but localization of *later* faults degrades as the number of faults grows; suspiciousness scores of faults tend to fall; some faults become unlocalizable; interference reported in ~80 % of programs | V-abs (UCI listing) + V-via (same survey) | **High** — "first fault is easy, later ones suffer" is exactly the structure peeling exploits |
| **Xue & Namin**, effect of fault interactions on five coverage-based localizers, ESEM 2013 | Interference can reduce effectiveness (≈ 20 % for Ochiai) and also improve it (≈ 30 % of cases) | V-via (survey only); title/venue **K** | Medium — shows interference is two-sided |
| **Li, Yan, Liu, Wang**, "An insight of double-faults interactions in program: an empirical study," ICRSE 2017 | Fault-injection on Siemens suite; three interaction types (independent / masking / construction); pairwise interference **< 1 %**, masking more frequent than construction; interference is **not random — it involves the same variable** | V-abs | **High** — (i) a measured prevalence on small programs, (ii) a *mechanism* hint (shared variable) that is directly usable as a scenario detector (§2.2 #5) |
| **Yan, Liu, Li**, "The failure behaviors of multi-faults programs: an empirical study" | Four industrial systems, 128 faults, 3,111 tests; how multiple faults manifest in failures | V-abs | Medium — methodology for mapping faults to observed failure behavior |
| **Abreu, Zoeteweij, van Gemund**, "Spectrum-based multiple fault localization," ASE 2009, pp. 88–99 | Bayesian/probabilistic multiple-fault localization (Barinel lineage) | V-abs (reference listing); content **K** | Medium — probabilistic model over *sets* of faults |
| **Steimann & Bertschler**, "A simple coverage-based locator for multiple faults," ICST 2009; **Steimann & Frenkel**, ISSRE 2012 (partitioning via ILP algorithms); **Höglerle, Steimann, Frenkel**, "More debugging in parallel," ISSRE 2014 | Explain each failed test by a *set of possible fault locations*; take a *probability distribution over the number of faults* as input; break the problem into independent sub-problems | V-abs | **High (idea)** — the "number-of-faults prior" and "decompose into independent sub-problems" are the multi-fault analogues of your class prior |
| **Jones, Harrold, Bowring**, "Debugging in parallel," ISSTA 2007 | Cluster failing tests by the fault that caused them and debug clusters in parallel | **K** | Medium — the *parallel* alternative to peeling |
| **Callaghan & Fischer**, "Improving spectrum-based localization of multiple faults by iterative test suite reduction" (FLITSR), ISSTA 2023 | Iterative localization: locate, remove the failing tests explained by the top fault, repeat | V-via (reference list) | **High (idea)** — the SBFL analogue of peeling |
| **Zakari, Lee, Chong**, "Simultaneous localization of software faults based on complex network theory," IEEE Access 2018 | Notes that fault interference reduces effectiveness of existing techniques; alternatives are *one-fault-at-a-time* and *parallel* debugging; uses graph centrality measures | V-abs | Medium — graph-theoretic localization (judge-circle taste) |

### B. Multi-fault **repair**

| Work | What it establishes | Status | Relevance |
|---|---|---|---|
| **Al-Bataineh**, "Automated repair of multi-fault programs: obstacles, approaches, and prospects," ASE 2024 (NIER) | APR tools are tuned for single-fault programs; real projects contain multiple bugs that can **interact with and mask each other**; identifies obstacles; describes three strategies — **iterative, parallel, simultaneous** — and when each works. Claims to be the first paper to study multi-fault repair specifically | V-abs | **Very high** — names the strategies BCF's peeling belongs to (*iterative*) |
| **Al-Bataineh**, "Current challenges in automated multi-fault program repair," APR workshop at ICSE 2025 | Open research challenges for repair in the presence of interacting faults | V-abs | High |
| **Al-Bataineh**, "Debugging the undebuggable: why multi-fault programs break debugging and repair tools," ASE 2025 (NIER) | Introduces a **formal model of how faults interact — masking, synergy, cascading** — and a framework for reasoning about faults "as part of a network of influences" | V-abs (abstract only) | **Very high** — same vocabulary as §4.1 of file 06; **read the full text before writing the related-work paragraph** |
| **Al-Bataineh**, "Interaction-aware patch assessment for multi-fault automated program repair," ASE 2025 (NIER); "Towards effective lightweight test oracles for automated multi-fault program repair," ICSME 2025 (NIER) | Validation must account for interactions with remaining faults so **valid partial fixes are not rejected**; combines output-, halting-, and assertion-based oracles, informed by bug reports | V-abs (venue pages; the first's abstract not read in full) | **High** — partial patches are exactly the object of your E34 (partial-fix rate) |

### C. Datasets with real multi-fault structure

| Work | What it provides | Status | Relevance |
|---|---|---|---|
| **Callaghan & Fischer**, "Mining bug repositories for multi-fault programs" (arXiv:2403.19171) | **Defects4J-mf** and **BugsInPy-mf**: true multi-fault variants built by *test-case transplantation* (copy a later fix's failing test into an earlier version; if it fails there, the fault already existed) and *fault-location translation*. Reports on average 9.2 faults per Defects4J version (311 versions) and **18.6 faults per BugsInPy version (501 versions, 17 Python projects — including fastapi, httpie, black, keras, pandas, scrapy…)**. Notes that datasets are sometimes "incorrectly considered multi-fault datasets due to multi-hunk faults" | **V-full** | **Very high** — (i) proof that latent co-existing faults are common in Python projects' histories; (ii) a technique (transplantation) usable to *expose* masked faults; (iii) the multi-hunk ≠ multi-fault warning your lattice must respect; (iv) the BugsInPy-mf fastapi versions are a **cross-check sample** for your own analysis |
| **An, Yoon, Yoo**, "Searching for multi-fault programs in Defects4J," SSBSE 2021; **Zheng et al.**, *J. Syst. Softw.* 2018 | Earlier constructions of multi-fault Java datasets | V-via | Low–medium |
| **Perez, Abreu, (d'Amorim)**, "Prevalence of single-fault fixes and its impact on fault localization," ICST 2017 | Argues that most bug-fix commits in benchmark datasets touch one fault; the single-fault assumption is prevalent in evaluation data | V-abs (title/listing only; authors and venue **K**) | Medium — supports "benchmarks under-represent multi-fault structure" |
| **SWE-bench Verified statistics** (via Skywork-SWE, arXiv:2506.19290) | Average gold patch edits ≈ 1.2 files, 2.1 functions, **2.4 hunks**, 14.3 lines | V-abs | Medium — hunk counts > 1 are typical, *but hunks ≠ faults* |

### D. Masking in testing theory (the "information loss" side)

| Work | What it establishes | Status | Relevance |
|---|---|---|---|
| **Voas**, "PIE: a dynamic failure-based technique," *IEEE TSE* 1992 | The **Propagation–Infection–Execution** model: a fault must be executed, infect the state, and the infection must propagate to output; *failed error propagation* is the masking path | **K** | High — the standard model of code-layer masking |
| **Masri et al.** on coincidental correctness | An error is executed but the test still passes; empirical prevalence: in one corpus, ~60 % of tests were affected in 13 % of programs (as quoted by Clark et al.) | V-via | Medium–high |
| **Clark & Hierons**, "Squeeziness: an information theoretic measure for avoiding fault masking," *Inf. Process. Lett.* 2012 | Information-loss measure (≈ `H(X) − H(f(X))`) as a predictor of failed error propagation | **K** (2012 original); V-abs for follow-ups | **Very high** — the mathematical basis for §4.3 of file 06 |
| **Clark, Hierons, Patel**, "Normalised squeeziness and failed error propagation," *IPL* 149 (2019) 6–9 | Squeeziness is unsuitable for comparing programs with different input domains; the **normalised** form fixes that | **V-abs** | High |
| **Patel, Hierons, Clark**, "An information theoretic notion of software testability," *Inf. Softw. Technol.* 143 (2022) 106759 | Strong rank correlation between several information-theoretic measures (incl. whole-program normalised squeeziness) and the probability of failed error propagation measured with mutants | **V-abs** | High — evidence that these measures predict masking |
| **Androutsopoulos et al.**, conditional entropy and failed error propagation, ICSE 2014 | Relationship between conditional entropy and FEP | **K** | High |
| **DeMillo, Lipton, Sayward** (1978) and **Offutt** (1992): the *coupling effect* | Complex (multi-fault) mutants are "coupled" to simple ones; higher-order mutants sometimes *mask* first-order ones | **K** | Medium — a testing-theory basis for studying two-fault combinations |
| **Dumlu, Yılmaz, Cohen, Porter**, "Feedback driven adaptive combinatorial testing," ISSTA 2011; **Yılmaz et al.**, *IEEE TSE* 40(1) 2014 | Defines **masking effects** in combinatorial interaction testing: failures that perturb execution so that other behaviors are never exercised (e.g., an early crash prevents later configuration-dependent code from running). Their remedy is a **feedback loop**: detect masking, isolate likely causes, regenerate tests that avoid them, iterate | **V-abs** | **Very high** — this is the *shadowing* of §4.1 and the *peeling loop* of §4.4, in another field. Closest precedent for the loop's logic |
| **Kuhn, Wallace, Gallo**, "Software fault interactions and implications for software testing," *IEEE TSE* 2004 | Empirical distribution of how many parameters interact in failures | **K** | Medium — interaction-strength statistics |

### E. Diagnosis and minimization theory

| Work | Status | Relevance |
|---|---|---|
| **Reiter** (1987), "A theory of diagnosis from first principles"; **de Kleer & Williams** (1987), "Diagnosing multiple faults" (GDE) — minimal hitting sets of conflict sets; probabilistic ranking of multi-fault diagnoses | **K** | High — the classical formal framework for *sets* of faults; your "fault unit" sets correspond to diagnoses |
| **Zeller & Hildebrandt** (2002), delta debugging / `ddmin` | **K** | High — used for the 1-minimal sufficient set `m*` in file 06 §6.2 |

### F. Exceptions, stack traces, and defect classification (the "class → root cause" side)

| Work | What it establishes | Status | Relevance |
|---|---|---|---|
| **Schröter, Bettenburg, Premraj**, "Do stack traces help developers fix bugs?," MSR 2010, pp. 118–121 | Eclipse study; per a later paper, **more than 47 %** of stack traces extracted from bug reports contained at least one buggy method | V-abs + V-via (SBEST) | **High** — the only-about-half figure is a caution: the crash site is often *not* the fault |
| **SBEST** (arXiv:2405.00565), stack-trace-based SBFL without fault-triggering tests, Defects4J 2.0 | Only **3.33 %** of bugs have fault-triggering tests in bug reports; **98.3 %** of bug-fix intentions align with exceptions in stack traces; **78.3 %** of buggy methods reachable within **0.34** method calls on average (Java) | V-abs | **High** — the "frame distance" quantity of file 06 §6.1; Java, so re-measure for Python |
| **Wu et al.**, CrashLocator (FSE 2014) | Locating faulty functions from crash stacks | **K** | Medium |
| **Chillarege et al.** (1992), Orthogonal Defect Classification; **Tan et al.**, bug characteristics in open-source software (EMSE 2014); **Thung et al.**, automatic defect categorization (WCRE 2012) | Defect taxonomies and classifiers | **K** | Medium — prior art for "classify, then act" |
| **Campos & Maia**, "Common bug-fix patterns: a large-scale observational study," ESEM 2017; **Pan, Kim, Whitehead** (2008) bug-fix patterns | Most common fix patterns (condition fixes, changed call arguments, right-hand-side changes) | V-abs (snippet), V-via | Medium — a prior over *fix shapes* by pattern (Java) |
| Exception-handling bug studies (e.g., Ebert, Castor, Serebrenik, *JSS* 2015; Nakshatri et al., MSR 2016) | Catalogs of exception-handling mistakes and anti-patterns (catch-and-ignore, over-broad catch) | **K** | High for §2.2 scenarios #3 — verify |

### G. LLM agents, issue-resolution benchmarks, and their failures

| Work | What it establishes | Status | Relevance |
|---|---|---|---|
| **Jimenez et al.**, SWE-bench, ICLR 2024; **Yang et al.**, SWE-agent, arXiv:2405.15793 | Benchmark and ACI baseline | V-abs | Required citations |
| **Agentless** (Xia et al., 2024), **AutoCodeRover** (Zhang et al., 2024) | Hierarchical localization (file → function → edit location); spectrum-based + program-structure localization | **K** | High — prior art for structured localization (so graph-first is not novel; your ledger agrees) |
| **Liu et al.**, "An empirical study on failures in automated issue solving" (arXiv:2509.13941) | Manual analysis of 150 failed instances on SWE-bench Verified → taxonomy of 3 phases, 9 categories, 25 subcategories; agentic failures dominated by flawed reasoning and "cognitive deadlocks" | V-abs | High — the nearest failure taxonomy; yours should *cite and extend*, not reinvent |
| **"Beyond resolution rates: behavioral drivers of coding agent success and failure"** (arXiv:2604.02547) | 9,374 trajectories, 19 agents, 500 tasks; failure cause ≠ patch size; the trajectory-length–failure correlation **reverses once difficulty is controlled** | V-abs | High — supports the confound warning in file 05 T-22 |
| Trajectory-and-localization study of OpenHands / SWE-agent / Prometheus (arXiv:2511.00197) | Failed trajectories are longer and higher-variance; **file-level localization is correct in 72–81 % of trajectories even in failures**; success depends on approximate vs exact modification | V-abs | High — *localization is often fine; the fix is wrong/partial*, which is consistent with an interference/partial-fix story |
| **Multi-SWE-bench** (arXiv:2504.02605) | Failures dominated by incorrect fault localization; suggests integrating SBFL; agents exhaust the 50-round limit | V-abs | Medium |
| **ChainSWE** (arXiv:2607.02606, July 2026) | *Sequential multi-bug rollouts*: performance drops by up to 70 % versus the single-issue setting, with the sharpest drops at the deepest positions in a chain; calls for dependency tracking and repository-state management | V-abs | **High** — the closest LLM-side work to "chained issues"; but its chains are sequences of *related issues carried across resets of context*, not (as far as the abstract says) masking DAGs within one task |
| **Active-SWE** (arXiv:2608.04682, Aug 2026) | Proactive discovery and fixing of multiple bugs without issue reports (1,663 tasks) | V-abs | Medium — multi-bug without reports |
| "Characterizing the failure modes of LLMs in resolving real-world GitHub issues" (arXiv:2605.12270) | Process-level failure analysis vs human patches (3 frontier models, 900 attempts) | V-abs | Medium |

### H. Information theory and search theory (for the model)

| Work | Status |
|---|---|
| **Massey** (1994), "Guessing and entropy" (lower bound on expected guesses from entropy); **Arıkan** (1996), "An inequality on guessing and its application to sequential decoding" | **K** |
| **Fano's inequality** (Cover & Thomas, *Elements of Information Theory*) | **K** (standard) |
| **Koopman** (1956), **Blackwell** (1962), **Stone** (1975, *Theory of Optimal Search*) — Bayesian search: inspect the box maximizing `p q / c` | **K** — verify attributions |
| Möbius inversion / interaction indices (Shapley interaction index, Grabisch–Roubens) | **K** |

---

## 2. Where can fault interference occur in a codebase? (scenario identification)

### 2.1 How to identify such scenarios — four families of method

| Family | Method | What it finds | Cost | Precedent |
|---|---|---|---|---|
| **Static, syntactic** | AST scans for masking constructs (table in §2.2) | *Candidate* masking points | seconds/repo | exception-handling studies (**K**) |
| **Static, structural (uses the competition graph)** | For a suspect node, list nodes on call paths to the failing assertion that (a) are lossy (§2.2 #4), (b) write shared state read downstream (#5), or (c) guard execution (#1); compute pairs of nodes sharing callers/callees within distance ≤ k | *Where a second fault could hide relative to the first* | seconds with the provided graphs | Li et al. 2017 (shared variable); Zakari et al. 2018 (graph measures) |
| **Dynamic** | Differential coverage before/after a partial fix; test-case transplantation; two-mutant experiments (higher-order mutants); delta debugging on patch hunks | *Actual* masked regions and interference | minutes/task | Dumlu et al. 2011; Callaghan–Fischer 2024; Offutt (**K**); Zeller (**K**) |
| **Empirical on fixes (ours)** | Hunk-subset lattice on gold patches (file 06 §6.2) | Interference and shadowing *as they occurred in real fixed issues* | minutes/task, CPU | extends Callaghan–Fischer's "multi-hunk ≠ multi-fault" caution |

### 2.2 Scenario catalog — Python patterns where one fault can mask, enable, or feed another

*Mechanism types: **M** = masking (shadowing); **C** = cancellation; **S** = synergy; **K** = cascading (fix reveals next). Literature anchor is the closest source I found; most rows are **`[HYP]` for Python** and are meant to be turned into measurements.*

| # | Scenario | Type | Python pattern (what to scan for) | Static detector | Dynamic detector | Anchor | SWE-task relevance |
|---|---|---|---|---|---|---|---|
| 1 | **Guard / early exit dominates later code** | M, K | `if cond: return/raise/continue`, `while … : … break`, state reset inside a loop (`history = []`) | CFG dominators: nodes dominated by the guard | differential coverage after editing the guard | Dumlu et al.: early crash prevents later behaviors | **High** — the `httpx_6821`-type chain |
| 2 | **Assertion short-circuit within a test or repro** | M | sequential `assert a; assert b` in one test body; script-style repros | parse test bodies for ≥ 2 independent asserts | atomized repro; run each expectation separately | (testing folklore; **K**) | **High** — affects the agent's own oracle |
| 3 | **Exception swallowing / rewriting** | M | `except:`; `except Exception: pass/log`; `return` or `raise` inside `finally`; `raise NewError` without `from`; catching a broad base class | AST scan | run with `-W error`; inject a raise and see whether it surfaces | exception-handling bug studies (**K**) | High |
| 4 | **Value squeezing (many-to-one steps)** | M | `bool(x)`, truthiness tests, `x or default`, `d.get(k, default)`, `getattr(o, n, default)`, `min/max` clamps, `str(x)`, `isinstance` fall-through, `len(x) > 0` | count lossy ops on the path to the assertion | mutation of intermediate values; observe output sensitivity | squeeziness (Clark–Hierons); FEP (Voas) | High |
| 5 | **Shared mutable state** (same variable written/read by two faults) | K, S, C | module globals, class attributes, instance attributes across methods, default mutable arguments, caches | def–use sets on the graph: nodes writing an attribute that another node reads | trace reads/writes of the attribute | Li et al. 2017 (interference involves the same variable) | **High** |
| 6 | **Caching / memoization** | M, K | `functools.lru_cache`, per-instance caches, `@cached_property` | AST scan | clear caches between runs; compare | (**K**) | Medium |
| 7 | **Fallback and retry paths** | M | `try: fast() except …: slow()`, `ImportError` shims, feature detection | AST scan | force the primary path to fail | (**K**) | Medium–high (version-compat shims are common in library code) |
| 8 | **Lazy evaluation / iterators / streams consumed once** | K | generators, `iter()`/`next()`, file/stream objects, `Response.stream` semantics | AST scan for generators feeding later consumers | run the consumer twice | (illustrative `httpx` case) | High for httpx/requests |
| 9 | **Configuration and option propagation** | M, K | defaults dicts merged in several places; `kwargs` forwarding; `**options` | graph: multiple callers passing the option | set option to a sentinel and trace | CIT: option-dependent behavior masked | Medium–high |
| 10 | **Type coercion and validation layers** | M, C | pydantic/dataclass validators, implicit coercions, `int(x)`, JSON encoders | AST/typing scan | feed boundary values | squeeziness-like | High for fastapi |
| 11 | **Ordering dependence** (first-match-wins) | M, S | `next(x for x in … if …)`, `flat_body_fields[0]`, route/dispatch order, middleware order | AST pattern `[0]`/`next(`; dict-order reliance | permute input order | (illustrative fastapi case) | **High** in routing/dispatch code |
| 12 | **Concurrency / async ordering** | K, M | `await` ordering, task cancellation, context vars | async-function scan | seeded interleavings | (**K**) | Medium (httpx async paths) |
| 13 | **Test-fixture and monkeypatch masking** | M | autouse fixtures, `monkeypatch`, `conftest.py` | scan fixtures | run with/without fixtures | (testing folklore) | Medium; note the harness resets `conftest.py` |
| 14 | **Two faults, one assertion (synergy)** | S | a test fails only if both bad conditions hold | pair-wise from lattice | subset outcomes | Al-Bataineh (synergy) | Medium |
| 15 | **Tool-induced masking in the agent loop** | M | `pytest -x`; `| head`/`| tail`; 5,000-char output cap; `search_similar_code` flooding; double-JSON escaping | prompt/tool audit | compare full vs truncated observation | forum data (participants) | **High** for *agents* (novel angle) |
| 16 | **Benchmark-level masking** (gold patches bundling refactors; F2P tests exercising only part of the fix) | M | multi-hunk gold patches with non-essential hunks | `m*` vs number of hunks (ddmin) | lattice | Callaghan–Fischer warning | **High** for measurement validity |

### 2.3 A minimal "mask-proneness" score per node (`[HYP]`, for E22/E26-style tests)

```
mask(v)  =  w1·lossy_ops(v) + w2·broad_except(v) + w3·guard_count(v) + w4·shared_state_writes(v) + w5·first_match_dispatch(v)
```

Use it as a *prior* for where a second fault may hide **relative to a first-visible fault's path**. Validation: on the lattice-set, does `mask` rank the true shadowed fault higher than centrality alone? Report AUC against a degree/betweenness baseline. (No claim until measured.)

---

## 3. Which prior work matters most for BCF, and how to use it

| Rank | Work | Use in the paper |
|---|---|---|
| 1 | **Al-Bataineh 2024 / 2025** (iterative vs parallel vs simultaneous; masking–synergy–cascading model) | Positioning: BCF's peeling is an *iterative* multi-fault strategy; your formal definitions are compatible with theirs (state the mapping; read the 2025 full text first). |
| 2 | **Callaghan & Fischer 2024** (Defects4J-mf / BugsInPy-mf) | (i) Evidence that co-existing faults are prevalent in Python projects; (ii) transplantation as a way to expose masked faults; (iii) the multi-hunk caution; (iv) *fastapi* overlap — a cross-check |
| 3 | **DiGiuseppe & Jones 2011; Debroy & Wong 2009** | Establish "interference" and the first-fault/later-fault asymmetry that motivates peeling |
| 4 | **Clark & Hierons (squeeziness) + Patel et al.** | Information-theoretic backbone for *why* masking occurs; connects to your information-theoretic class model |
| 5 | **Dumlu et al. / Yılmaz et al. (masking effects in CIT)** | Closest precedent for the *detect–isolate–regenerate* feedback loop; cite as prior art for peeling's logic in another field |
| 6 | **Steimann et al. (number-of-faults prior; independent sub-problems); FLITSR** | Precedent for priors over *sets* of faults and for iterative reduction |
| 7 | **Schröter et al.; SBEST** | Baseline facts for "class/exception → where is the fault" (Java) → your Python re-measurement (frame distance) |
| 8 | **ChainSWE; Liu et al. 2025; "Beyond resolution rates"; trajectory/localization study** | LLM-side context; your work differs by modeling *within-task* masking and by measuring partial fixes |
| 9 | **Massey / Fano / Bayesian search** | Standard results used in §3 of file 06 |
| 10 | **Zeller & Hildebrandt; Reiter; de Kleer & Williams** | `m*` via ddmin; diagnosis-as-hitting-sets framing |

**What is not relevant (skip):** general SBFL formula comparisons (Tarantula vs Ochiai vs DStar) except as background, because your agents localize with reading and graph tools rather than spectra; and deep-learning fault localization unless you adopt a learned ranker.

---

## 4. The gap — and how firmly I can claim it

**What I did not find** in this sweep (≈ 10 searches plus one full paper):

1. A **measurement of fault masking/interference structure on SWE-bench-style issue-resolution tasks** (gold-patch hunk-subset outcomes; shadowing digraph; depth distribution).
2. A **class-conditioned search model with information-theoretic bounds** (conditional entropy, guessing entropy, Fano floor) for *LLM issue-resolution agents*.
3. **Partial-fix rate** — the fraction of failed agent patches that fix a proper subset of essential fault units — as a failure metric.
4. **Observation-channel masking at the agent-tool layer** (`-x`, truncation, escaping) framed as the same phenomenon as code-level masking.

**How firmly to claim:** write "*to our knowledge, we found no prior measurement of …*" and describe the search you did — **not** "we are the first". My search was short and used a general web engine; I could read only abstracts of most 2025–2026 papers, several of which (Al-Bataineh; ChainSWE) are close enough that a full read could narrow the gap. Closest threats to novelty: (i) Al-Bataineh's 2025 formal model (theory, NIER-scale; likely no LLM-agent evaluation — **verify**), (ii) ChainSWE (sequential multi-bug; different structure), (iii) Callaghan–Fischer (dataset construction; FL not LLM agents).

---

## 5. Limits of this sweep and a verification to-do list

**Limits.** General-engine search, top results only; no access to ACM/IEEE full texts; several items are cited from abstracts or from another paper's summary (marked V-via). Nothing here has been checked against a citation manager. Two survey-reported percentages (67 %, 80 %) come from a single secondary source.

**Before any citation appears in the paper:**

- [ ] Read the full texts of Al-Bataineh (ASE 2024 NIER, ASE 2025 NIER ×2, ICSME 2025 NIER) and map his definitions of masking/synergy/cascading to yours (file 06 §4.1).
- [ ] Confirm DiGiuseppe–Jones and Debroy–Wong findings (prevalence numbers) from the originals, not the survey.
- [ ] Confirm every **K** item: authors, year, venue, pages — especially Clark & Hierons 2012, Androutsopoulos et al. 2014, Voas 1992, Massey 1994 (statement and `H ≥ 2` condition), Blackwell/Stone attributions, Xue & Namin title, Perez–Abreu authorship, exception-handling studies.
- [ ] Re-run the search with three additional angles: *"coincidental correctness"* + APR; *"patch overfitting partial fix multi-hunk"*; *"hidden bug revealed after fix"* / *"bug masking"* in SWE-bench trajectory studies.
- [ ] Check arXiv for 2026 work on **multi-hunk / multi-location** issue resolution (this field moves monthly; today's date is 2026-09-30).
- [ ] Check BugsInPy-mf's fastapi versions as a cross-check sample for E24.

---

## 6. Reference list (working; verification status as above)

```
[V-abs ] Debroy & Wong. Insights on fault interference for programs with multiple bugs. ISSRE 2009, 165–174.
[V-abs ] DiGiuseppe & Jones. On the influence of multiple faults on coverage-based fault localization. ISSTA 2011.
[V-via ] de Souza, Chaim, Kon. Spectrum-based software fault localization: a survey of techniques, advances, and challenges. arXiv:1607.04347.
[V-abs ] Abreu, Zoeteweij, van Gemund. Spectrum-based multiple fault localization. ASE 2009, 88–99.
[V-abs ] Steimann & Bertschler. A simple coverage-based locator for multiple faults. ICST 2009.
[V-abs ] Steimann & Frenkel. Improving coverage-based localization of multiple faults using algorithms from integer linear programming. ISSRE 2012, 121–130.
[V-via ] Höglerle, Steimann, Frenkel. More debugging in parallel. ISSRE 2014, 133–143.
[V-via ] Callaghan & Fischer. Improving spectrum-based localization of multiple faults by iterative test suite reduction. ISSTA 2023.
[V-full] Callaghan & Fischer. Mining bug repositories for multi-fault programs. arXiv:2403.19171.
[V-abs ] Zakari, Lee, Chong. Simultaneous localization of software faults based on complex network theory. IEEE Access 6 (2018) 23990–24002.
[V-abs ] Li, Yan, Liu, Wang. An insight of double-faults interactions in program: an empirical study. ICRSE 2017.
[V-abs ] Yan, Liu, Li. The failure behaviors of multi-faults programs: an empirical study.
[V-abs ] Al-Bataineh. Automated repair of multi-fault programs: obstacles, approaches, and prospects. ASE 2024 (NIER).
[V-abs ] Al-Bataineh. Current challenges in automated multi-fault program repair. APR@ICSE 2025.
[V-abs ] Al-Bataineh. Debugging the undebuggable: why multi-fault programs break debugging and repair tools. ASE 2025 (NIER).
[V-abs ] Al-Bataineh. Interaction-aware patch assessment for multi-fault automated program repair. ASE 2025 (NIER).
[V-abs ] Al-Bataineh. Towards effective lightweight test oracles for automated multi-fault program repair. ICSME 2025 (NIER).
[V-abs ] Dumlu, Yılmaz, Cohen, Porter. Feedback driven adaptive combinatorial testing. ISSTA 2011.
[V-abs ] Yılmaz, Dumlu, Cohen, Porter. Reducing masking effects in combinatorial interaction testing: a feedback driven adaptive approach. IEEE TSE 40(1):43–66, 2014.
[V-abs ] Clark, Hierons, Patel. Normalised squeeziness and failed error propagation. Inf. Process. Lett. 149:6–9, 2019.
[V-abs ] Patel, Hierons, Clark. An information theoretic notion of software testability. Inf. Softw. Technol. 143:106759, 2022.
[K     ] Clark & Hierons. Squeeziness: an information theoretic measure for avoiding fault masking. Inf. Process. Lett., 2012.
[K     ] Androutsopoulos, Clark, Dan, Hierons, Harman. An analysis of the relationship between conditional entropy and failed error propagation in software testing. ICSE 2014.
[K     ] Voas. PIE: a dynamic failure-based technique. IEEE TSE 18(8), 1992.
[V-abs ] Schröter, Bettenburg, Premraj. Do stack traces help developers fix bugs? MSR 2010, 118–121.
[V-abs ] SBEST: spectrum-based fault localization without fault-triggering tests. arXiv:2405.00565.
[V-abs ] Jimenez et al. SWE-bench: can language models resolve real-world GitHub issues? ICLR 2024 (arXiv:2310.06770).
[V-abs ] Yang et al. SWE-agent. arXiv:2405.15793.
[V-abs ] Liu et al. An empirical study on failures in automated issue solving. arXiv:2509.13941.
[V-abs ] Beyond resolution rates: behavioral drivers of coding agent success and failure. arXiv:2604.02547.
[V-abs ] Trajectory and fault-localization analysis of OpenHands, SWE-agent, Prometheus. arXiv:2511.00197.
[V-abs ] Multi-SWE-bench. arXiv:2504.02605.
[V-abs ] ChainSWE: benchmarking coding agents on multi-bug software maintenance. arXiv:2607.02606.
[V-abs ] Active-SWE. arXiv:2608.04682.
[V-abs ] Skywork-SWE (dataset statistics incl. SWE-bench Verified). arXiv:2506.19290.
[K     ] Massey. Guessing and entropy. ISIT 1994.  Arıkan. An inequality on guessing and its application to sequential decoding. IEEE Trans. IT 1996.
[K     ] Stone. Theory of Optimal Search. 1975.  (and Koopman 1956; Blackwell 1962 — verify)
[K     ] Zeller & Hildebrandt. Simplifying and isolating failure-inducing input. IEEE TSE 2002.
[K     ] Reiter. A theory of diagnosis from first principles. AI 1987.  de Kleer & Williams. Diagnosing multiple faults. AI 1987.
```

*End of 07.*

