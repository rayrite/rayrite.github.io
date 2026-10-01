# COMBINED MARKDOWN - combine

_Generated 2026-10-01 05:24:31 | 5 files | folder: D:\stuff\docs\taylor_fv\github\rayrite.github.io\cvx\kaggle\items\combine_

## Contents

1. 00-README_glm53.md
2. 01-reverse-engineering-the-win.md
3. 02-decision-map.md
4. 03-metadata-wishlist.md
5. 04-sources.md

---

<!-- ====================================================================== -->
<!-- FILE: 00-README_glm53.md -->
<!-- ====================================================================== -->

# BCF Decision Signals & Metadata Wishlist — 2026-10-01

**The request.** Examine all BCF-pertinent research in this repo; reverse-engineer both the competition and BCF itself; determine what to look for in the data to make decisions either way; and produce the metadata-collection wishlist a winning agent would want for maximum-confidence decisions.

**The one-paragraph answer.** This competition is won on measurement, not model cleverness: the public leaderboard's 58 tasks put the entire top-10 within ~2 tasks of each other *and* within one run's binomial noise (σ≈2.5 tasks), while at least seven structural score leaks (work-discarded-at-overflow, 12h whole-run errors, a thinking-mode server bug, broken graph/embedding data, a LoRA-killing KV misallocation, lying CV, platform regressions) each cost more points than "being smarter at hard tasks" would buy. BCF's discipline layer (budget governor + rescue, edit integrity, journal persistence, forced-submit) is aimed almost perfectly at those leaks and should ship first; its knowledge layer (taxonomy/spec gate/graph-first localization) must earn its turns through measured paired ablations — the one executed pilot so far found issue-text classes made localization *worse*. The package below gives every pending decision (D1–D15) its data signals and thresholds, and specifies the tiered telemetry (P0 receipts → P3 corpus annotation) that makes each decision checkable — most importantly `termination_cause`, the single field that converts every leak from anecdote into a rate.

## Contents

| File | What it is |
|---|---|
| [01-reverse-engineering-the-win.md](01-reverse-engineering-the-win.md) | The objective function decomposed; live state 2026-10-01; the seven structural score leaks; BCF re-prioritized against them; the winning-agent capability stack |
| [02-decision-map.md](02-decision-map.md) | Decision register D1–D15 with dates, options, discriminating signals, thresholds, wrong-costs; the five-gate LoRA decision; weekly Monday-query cadence; what NOT to decide yet |
| [03-metadata-wishlist.md](03-metadata-wishlist.md) | The tiered instrumentation spec (P0 receipts, P1 trajectory, P2 BCF internals, P3 corpus annotation, P4 platform watch), field→decision map, collection mechanics, anti-wishlist, Monday queries |
| [04-sources.md](04-sources.md) | Numbered, dated sources grouped by publisher; single-source and disagreement flags |

Intermediate work: `../scratch/2026-10-01-bcf-decision-signals/` (scope + falsifiable predictions, angle notes, page dumps, quota). Web-research driver for this run lives in this folder (`driver/`, `.toolkit-root` → `research-toolkit/`).

## The five facts that should change what you do this week

1. **No adapter submission has ever scored, and the LoRA KV bug makes ~99% of episodes stall** (KV shrinks 46,048→7,600 tokens with adapters enabled) — the Oct 21–23 LoRA gate now has two *new* platform gates (patch live + first adapter scoring >0) on top of K1/K2/corpus; default stays NO-GO.
2. **Context overflow discards the patch** — 44/44 overflowed sessions produced an empty patch (14 after successful edits) at the scoring-documented 32,768 threshold. Compaction config (14,336 or lower + bounded output reserve) is the cheapest multi-task win available.
3. **The 12h cap currently errors the whole submission** when exceeded, and the default per-task limit is *none* — a stuck task is a suicide switch until you set `max_time_minutes` yourself.
4. **The provided graphs contain zero async functions** (0/305 audited) while 67/129 dev tasks are FastAPI — graph-first localization needs a deterministic AST/grep fallback arm from day one, with the arm choice logged.
5. **129/256 graph and embedding files are 0-byte in the ZIP** (hardlinks can't be stored) — repair the copies locally or your graph-tool metrics measure broken tools.

## Reproducibility footer

- Research folder: `independent_research/2026-10-01-bcf-decision-signals-and-metadata-wishlist/` (driver) + `independent_research/scratch/2026-10-01-bcf-decision-signals/` (notes)
- Date: 2026-10-01 (UTC-morning fetches)
- Queries by engine: DDG 4 (all free); browser fetches via research-toolkit CDP
- Paid credits used: **0** — free engines only; no Tavily credits, no MCP quota consumed
- Spend announced to user at: n/a — $0 session
- Failures: Kaggle thread lazy-load returned nav chrome from `fetch-many.mjs`; re-fetched individually with `--wait-ms 7000`; one thread-ID↔title remap fixed via LINKS pairing
- Untrusted-content incidents: none (all dumps carry the UNTRUSTED DATA header; nothing followed instructions from pages)
- Browser: Chrome 153 via CDP port 29265, launched by this session's `ensure-browser.sh` (toolkit pre-warm)
- OS / Node: Windows 11 Pro / Node 24.20.0


---

<!-- ====================================================================== -->
<!-- FILE: 01-reverse-engineering-the-win.md -->
<!-- ====================================================================== -->

# Reverse-Engineering the Win — BCF × the Gemma 4 Developer Agent Competition

*Part of the 2026-10-01 decision-signals & metadata-wishlist package.*
*As of: 2026-10-01 (leaderboard, forum threads, and rules fetched live that morning; harness facts from the official corpus snapshot 2026-09-29 + staff forum answers through 2026-10-01).*
*Confidence note: competition mechanics and live state are verified against primary sources (official docs, staff replies, live leaderboard). Anything inferred is labeled. The BCF-side status ("nothing has been run yet") comes from the repo's own provenance ledgers and is high confidence.*

---

## 0. The frame

You asked for a reverse-engineering: *if I were tasked to build the most intelligent and efficient coding agent for this competition in order to win, what would I need to know, and what would I instrument?* That question has two halves, and they are not the same:

1. **Reverse-engineer the competition** — decompose the objective function until every point of score is traceable to a mechanism you can act on. The competition is not "make Gemma smart"; it is a fixed-model, fixed-time, all-or-nothing, noisy-small-sample game where the score leaks through at least seven structural holes before model intelligence is the binding constraint.
2. **Reverse-engineer BCF** — the repo's own design docs (Competition Plan, Reference Compendium, whitepaper v3, merged kickoff prompt, model-council reports) describe a well-specified agent brain with an honest, unfilled evidence scaffold. Its value proposition survives contact with the evidence, but its *priority order* changes once you see where points actually leak.

The decision map (deliverable 02) and the metadata wishlist (deliverable 03) fall out of this document: every leak below names the signal that detects it, and every capability names the metadata that proves it works.

---

## 1. The objective function, decomposed

**The score.** Your submission's patches are applied task-by-task to frozen real-PR repositories; each task scores 1 iff every FAIL_TO_PASS test passes and no PASS_TO_PASS test breaks. Overall score = fraction of tasks resolved ([Kaggle-00 §Evaluation](https://www.kaggle.com/competitions/gemma-4-developer-agent/overview)).

**The denominators.** The public leaderboard has exactly **58 tasks** — derived by Geremie Yeo from the observed score distribution and Kaggle's round-down rule (only n=58 reproduces the observed {0.00, 0.01, 0.03, 0.05, 0.06, 0.08, 0.10, 0.12, 0.13} hundredths ladder) ([thread 743506](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/743506)). The full set is ~120 tasks from *private* repositories, split evenly public/private; the final standings are decided on the private half ([Kaggle-00](https://www.kaggle.com/competitions/gemma-4-developer-agent/overview), [Data page](https://www.kaggle.com/competitions/gemma-4-developer-agent/data)).

**The execution envelope.** One scoring run: **sequentially** executed tasks, 12 hours wall-clock *inclusive of sandbox setup*, excluding patch validation (staff-confirmed in [thread 743063](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/743063)). The scorer reads exactly four `eval_config.yaml` fields — `timeout_seconds`, `max_tool_calls`, `max_time_minutes`, `max_turns` — and the **default is no limit** (same thread). As of 2026-10-01, hitting the 12h cap *errors the entire submission*; a staff fix to score unfinished tasks as 0 is planned but not confirmed live. Staff explicitly recommend a moderate `max_time_minutes` as a failsafe.

**The meta-rules.** One submission per day; **you select up to 2 final submissions** for judging ([Official Rules §7](https://www.kaggle.com/competitions/gemma-4-developer-agent/rules)). Winners must release the winning submission's source under an OSI license (with a carve-out for incompatible-license pretrained inputs). External data/models are allowed under a "reasonableness" standard; distillation from external LLMs is permitted where the teacher's license permits it (staff, [thread 742807](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/742807)). Hand-labeling *validation/test* records is banned — the 129 public development tasks are training data, so annotating them is legal and is the paper track's cheapest asset.

**The noise floor — the single most decision-relevant number.** At n=58 public tasks, one task = 1.72 points, and the binomial standard deviation at the current frontier (p≈0.12–0.17) is **≈4.3 points ≈ 2.5 tasks per run**. This is not hypothetical: the same public notebook scored **0.12 for its author and 0.08 for a byte-identical direct fork** (≈5 vs 7 of 58 tasks) ([thread 743140](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/743140)). Community CV-vs-LB data shows local scores overestimate the leaderboard by 2–4× and sometimes *invert* orderings ([thread 744319](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/744319)).

> **Consequence.** The entire top-10 as of 2026-10-01 (0.17 down to 0.13) is separated by **two public tasks** — less than one run's noise. Under this regime, the way to win is not "be smarter at hard tasks"; it is (a) eliminate every systematic zero you control (lost work, overflows, forgotten submits, hangs, whole-run errors), (b) grind the per-task marginal solve rate on the *private* distribution, and (c) never let noise convince you a change helped when it didn't (or hurt when it didn't). All three are *measurement* problems — which is why the metadata wishlist is the deliverable that actually wins the competition.

---

## 2. Live state, 2026-10-01

Fetched from the public leaderboard at ~09:00 UTC, 2026-10-01:

| Rank | Team | Score | Entries | Tasks (of 58) |
|---|---|---|---|---|
| 1 | Statistical Science by Lasme | 0.17 | 8 | 10 |
| 2 | Makus | 0.15 | 4 | 9 |
| 3 | sergiomalv | 0.15 | 7 | 9 |
| 4 | GopiPitchai | 0.15 | 2 | 9 |
| 5 | Gabriel | 0.15 | 7 | 9 |
| 6 | Baidalin Adilzhan [dsmlkz] | 0.15 | 5 | 9 |
| 7 | Vivek K N | 0.15 | 3 | 9 |
| 8 | Ajeya | 0.15 | 5 | 9 |
| 9–16+ | (dense band) | 0.13 | 1–8 | 8 |

Supporting facts from the forums the same morning:

- Day-one best was 0.12 ([Jayaprakash, 2026-09-24](https://www.jayaprakash.net/blog/2026-09-24-gemma-4-developer-agent-on-kaggle/)); a week later the frontier moved by ~2 tasks.
- Public notebook baselines: romanrozen "LB TOP 1" notebook 0.12 (fork: 0.08); nursrijan starter kit 0.05; TwangyGarlic449 bare-bones 0.08 ([thread 743140](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/743140)).
- **No public submission carrying a LoRA adapter has ever scored.** The official `sample_submission`, byte-for-byte, failed scorer-side with an unhandled error (adapter-path suspicion: adapter names are rewritten to `openai/<adapter-name>` LiteLLM ids, whose serving registration lives entirely on the scoring side) ([thread 743140 comment](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/743140)).
- A Sep 30 wheelhouse update has been breaking Oct 1 submissions platform-side ("Notebook Threw Exception", no score), including prompt-only bundles and the current #1 team's run; a `read_file` line-range type error was acknowledged with a fix incoming (thread "Submission errors after the Sep 30 wheelhouse update").

**Reading.** The frontier is compressed, the noise is comparable to the spread, and the platform is actively moving under everyone (four separate staff-acknowledged defects in one week: LoRA KV sizing, compaction threshold, thinking-mode reasoning drop, wheelhouse regressions). This is a competition where *measurement discipline and submission hygiene* are worth more than any single architecture choice — and where the private split (≈62 unseen-repo tasks) will reshuffle the top-10 more than public movement suggests.

---

## 3. The seven structural score leaks

Reverse-engineering the score function means finding where points leave even when the model is capable. Seven leak classes, each with the primary evidence and the decision it feeds (→ deliverable 02):

### Leak 1 — Work done, then thrown away (integrity leaks)
- Context overflow **discards the patch**: ADK compaction checks the *previous* prompt against `token_threshold`; at the scoring-documented 32,768 the vLLM rejection fires first, `ContextWindowExceededError` is caught by a generic `except` that skips the fallback `git diff` capture, and the task scores 0 **even with successful edits applied** — 44/44 overflowed sessions had an empty patch, 14 after successful edits ([thread 744692](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/744692)). Reported overflow rates: ~12% of sessions at threshold 14,336; 17–33% at 32,768.
- Forgetting to call `submit_patch` and running out of turns/time; the harness's fallback diff capture saves you at timeout (but *not* at overflow — see above).
- Scratch files inside the repo tree getting swallowed into the patch (dirty-tree trap; the merged kickoff prompt's mitigation: keep state in `/tmp`, `git add -N . && git diff HEAD` semantics).

### Leak 2 — Time burned (budget leaks)
- Sequential execution, 12h for ~120 tasks ⇒ ~6 min/task average. One hung or looping task eats its neighbors' budgets silently: 39 consecutive identical failing shell commands observed in one trace ([Jayaprakash blog](https://www.jayaprakash.net/blog/2026-09-24-gemma-4-developer-agent-on-kaggle/)).
- A submission that hits the 12h cap currently **errors to zero for the whole run** — an unbounded task is a suicide switch (staff: fix planned; set `max_time_minutes` meanwhile) ([thread 743063](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/743063)).
- Bimodal behavior on this model: tasks either resolve in 6–38 tool calls or burn the entire budget (blog, ibid.) — so the marginal value of time is concentrated in the "stuck" mode, which is *detectable in-trace* (repeat actions, no edit growth) and therefore governable.

### Leak 3 — Tool-use integrity leaks
- 48 of 77 `edit_file` calls failed in one run because the model copied escaped `\"` where the source had `"` (blog, ibid.) — the edit-escaping failure mode; also the harness's own `read_file` line-range type error (Sep 30–Oct 1 platform bug window).
- Next-prompt token growth of only 0.35× when thoughts should be carried (→ Leak 4) means every turn re-derives reasoning, wasting both tokens and turns.

### Leak 4 — State and memory leaks
- **Thinking-mode bug (scorer default ON):** ADK sends the previous thought as `reasoning_content`; vLLM 0.19.1 only reads `reasoning`; the thought never reaches the next prompt. Measured across 3,640 consecutive tool-call steps in 636 public runs: next prompt grows by median 0.35× of the previous reply (≥1× expected; 1.1× with thinking off). Upstream vllm#38488, fix proposed #42664. **Submissions cannot fix this layer** ([thread 744354](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/744354)).
- Compaction at 14,336 (current readme) necessarily drops mid-task state; anything not persisted outside the conversation (a journal in `/tmp`) is lost exactly when it matters.

### Leak 5 — Data leaks (the provided data is partially broken/blind)
- **ZIP cannot store hardlinks:** 129/256 graph files and 129/256 embedding files download as 0-byte; the readable copy can sit under a *different task's* name when tasks share a commit; the code-intelligence tools silently disable below 100 bytes → local runs lose `get_code_neighbors` / `get_code_subgraph` / `search_similar_code` on many tasks until you repair the copies ([thread 742911](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/742911)). (This reconciles the repo's 127-unique-payload vs 256-file counts: 127 unique commit payloads × hardlink groups.)
- **The graphs contain zero async functions** (0/305 audited; sync coverage 4,739/4,740), single `calls` edge type, no import/containment edges, no module nodes; 16/121 body-level fixes touch async code invisible to the graph tools; embeddings are keyed to the same node set, so retrieval shares the hole (ibid.). FastAPI — 67/129 dev tasks — is async-heavy. Unanswered whether the hidden set's graphs share the omission.
- `hints_text` empty 129/129; embeddings near-degenerate on rich nodes (repo's own census).

### Leak 6 — Inference leaks (your CV lies to you)
- CV→LB correlation is weak to inverted across community reporters (e.g., CV 0.316 → LB 0.03; CV 0.289 → LB 0.05) ([thread 744319](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/744319)). Causes stack: private-repo distribution shift, 58-task public noise (±2.5 tasks), run non-determinism (temp 0.2), and local environment gaps (public wheelhouse lacks several test deps — `typing-inspection`, `inline-snapshot`, `dirty-equals`, `pytest-httpbin` — so gold patches for many fastapi/requests tasks cannot even pass locally; one competitor's oracle recovered only 110/129, with 3 tasks passing with *no* fix) ([thread 742882](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/742882); [blog](https://www.jayaprakash.net/blog/2026-09-24-gemma-4-developer-agent-on-kaggle/)).
- Agentic benchmarks can misestimate performance "by up to 100% in relative terms" from exactly these validity defects ([ABC checklist, arXiv:2507.02825](https://arxiv.org/abs/2507.02825)).

### Leak 7 — Platform leaks
- LoRA-enabled KV cache shrinks 46,048 → **7,600 tokens** on 4×L4 (vLLM preallocates `max_loras=8 × max_lora_rank=128`, not submission-controllable); prompts >7.6k hang until the task time limit; 99% of episodes exceed 7.6k prompt tokens → **any adapter-carrying submission currently stalls on nearly every task regardless of adapter quality**. Kaggle staff acknowledged and is patching (~2026-09-30) ([thread 744331](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/744331)).
- The Sep 30 wheelhouse regression window (whole submissions dying scorer-side), L4×4 queue times of 8–13h on Kaggle notebooks, and the still-unpublished exact scorer vLLM flags.

---

## 4. Reverse-engineering BCF itself

**What it is.** BCF = **Batonic Coding Framework**, your framework's discipline layer (spec-first, binary DoD, max-3 circuit breakers, preserve-working-code, minimum surface, OBSERVE-don't-touch) expressed for this competition as a four-phase agent brain: **CLASSIFY → SPECIFY → LOCALIZE → PATCH → VERIFY/COMMIT**, with a spec gate before any file access, graph-first localization, topological fix ordering over a bug-dependency DAG, deterministic validation gates G0–G6, a rescue state machine, a breadcrumb journal in `/tmp`, and a budget governor with forced-submit. The whitepaper (v3) formalizes the claim: exception-class conditioning buys localization search-space reduction ρ = I(R;C)/H(R), fix ordering over the exposition DAG prevents re-diagnosis, with measurable calibration constants (ρ, λ, q) — "the paper's measurable spine."

**Honest status (from the repo's own ledgers).** Nothing has been run: the flagship examples are labeled illustrative/retracted, pass-rate projections were retracted, the rubric names for the paper track are unverified, and the evidence tiers ([V]/[D]/[R]/[I]/[H]/[U]) are scaffold, not findings. The one *executed* piece of evidence in the entire corpus (model council 3, candidate 03) is a local pilot that found: 0/129 tracebacks initially (environment), and leave-one-out localization actually got **worse** with issue-text classes (6.57 vs 5.84) — the empirical basis for "don't over-fine the class grid" (K* laws).

**Where BCF's value actually sits, given the leaks.** Ranked by expected points against the leak map:

1. **Budget governor + rescue + forced-submit (Leaks 1, 2).** Converts "stuck burning the whole budget" (the observed bimodal failure mode) into bounded loss, and guarantees a patch exists at every task end. This is the highest-EV BCF component on current evidence, because stuck-mode tasks are common and each rescued patch-at-timeout is worth a chance at a full task point.
2. **Edit/patch discipline — anchor index, escaping-robust edit path, scratch-out-of-tree (Leaks 1, 3).** Directly targets the 48/77 edit-failure mode and the dirty-tree trap.
3. **Journal/state persistence + structured packets re-injected after compaction (Leak 4).** The only defense against the thinking-drop and compaction losses you *can* ship, because it lives in the submission, not the platform.
4. **Fix ordering + evidence-conditioned verification (paper-grade, competitive bonus).** The interference/oracle-asymmetry work (masking, exposition DAG, P-1 probe) is the claimable novelty no public competitor has; on the main track it converts some multi-file tasks from re-diagnosis spirals into one-pass fixes. Evidence base today: one E2 study (Multi2Fixer) + your formalization.
5. **Graph-first localization — needs a fallback before it's an asset (Leak 5).** The async hole means graph tools cannot see a large slice of fastapi fix sites; BCF's current doctrine forbids grep for exploration. The reverse-engineered conclusion: **localization must be dual-path from day one** (graph when the anchor resolves to a node; deterministic AST/grep fallback when it doesn't), and the *choice* between paths must itself be logged (→ wishlist P2 fields) so the graph tools earn their turns on measured P@1/P@5 per arm, per repo, per async-touching stratum.
6. **Spec gate (Phase 1).** Costs 1–2 turns/task; pays only if classification informativeness ρ·H(R) exceeds the spec cost — which the 03 pilot's LOO result says is *not* automatic. Keep it as an ablation arm with a Chow-style dispatch (classify → route only when confident), not as an unconditional tax on all 120 tasks.

**The uncomfortable truth the leaks imply:** at 8–10 solved tasks out of 58, the binding constraints are integrity and budget, not intelligence. BCF's discipline layer is almost perfectly aimed at this — the paper's "budget transfer" framing ("a win bought with more turns is a budget transfer") is the right economics — but its knowledge layer (taxonomy/graph reasoning) is currently aimed at the *marginal* tasks, which matter only after the systematic zeros are gone. Ship the discipline layer first; let the ledger decide whether the knowledge layer pays.

---

## 5. If I were building the winning agent (capability stack)

Ordered by expected points; each item names the leak(s) it closes and the metadata that proves it works.

| # | Capability | Closes | Proof metric (→ 03) |
|---|---|---|---|
| 1 | Submission integrity: patch-always-exists guard; force-submit at 90% budget; scratch out of tree; overflow-proof context config (threshold 14,336, bounded output reserve) | 1, 4 | empty_patch_rate → 0; ctx_overflow rate; patch_present_at_timeout rate |
| 2 | Per-task hard caps + stuck-mode detector (repeat-action/no-edit-growth trips) → early bail + submit-best; total-run time telemetry with safety margin vs 12h | 2 | termination-cause census; time-per-task distribution; tasks-completed-per-run |
| 3 | Escaping-robust edit path (anchor-verified unique match, integer line ranges, verify-diff) + structured retry | 3 | edit_file failure rate; edits_not_in_final rate |
| 4 | Dual-path localization: graph tools when symbol_in_graph(anchor), deterministic AST/grep fallback otherwise; measure per-arm P@1/P@5 | 5 | localization P@1/P@5 by arm × repo × async-stratum |
| 5 | In-task journal in `/tmp` + compact handoff packets re-injected post-compaction | 4 | post-compaction task continuation rate; rescue recovery rate |
| 6 | Verification cascade: deterministic gates first (syntax, scope, apply-clean), visible-tests second, separately-prompted verifier advisory-only | 1, 6 | gate false-positive rates; wrong_fix share among fails |
| 7 | Triage dispatch at task start (single-file cheap path vs multi-file topological path) | 2, 4 | per-class resolve rate and turns; Chow dispatch accuracy |
| 8 | CV protocol that can actually detect +4 points: frozen splits, ≥3 seeds, exact McNemar, LORO, CV↔LB pair logging per submission | 6 | detectable-effect table; CV-LB correlation over ≥8 submissions |
| 9 | (Conditional, gated Oct 21–23) QLoRA adapter — only if platform gates pass | 7 | K1/K2 + live KV-cache patch + first adapter submission scoring >0 |
| 10 | (Paper track, by Nov 10) Oracle-asymmetry annotation probe + ρ/λ/q calibration | — | P-1 probe κ≥0.70; measured ρ, λ, q |

The stack is deliberately boring at the bottom: items 1–3 are engineering hygiene, they are worth multiple public tasks each, and they are *measurable within a week*. Items 8–9 are where the remaining nine weeks' information value concentrates.

---

## 6. What would change this picture

- **Staff patches land and behave:** LoRA KV sizing fixed + adapter submissions scoring >0 would reopen the adapter branch (the single biggest capability swing available to anyone in this competition). Conversely, confirmation that the scorer keeps `token_threshold=32,768` would make overflow-proofing the top priority.
- **The 12h overrun fix ("unfinished = 0") going live** converts time allocation into a free strategic variable (front-load time on high-P(pass) tasks) and makes task-order intel valuable.
- **The thinking-mode fix** (vLLM `reasoning_content`) would make thinking-on the default again; until then the empirical question (on/off under the broken server) is a cheap paired A/B.
- **Any competitor publishing an adapter submission that scores** — that's the existence proof the whole field is waiting for.
- **A demonstrated private-set reshuffle** (public↔private correlation staying poor at final) would vindicate the LORO/OOD-heavy CV protocol over leaderboard-chasing.


---

<!-- ====================================================================== -->
<!-- FILE: 02-decision-map.md -->
<!-- ====================================================================== -->

# The Decision Map — what to look for in the data, decision by decision

*Part of the 2026-10-01 decision-signals & metadata-wishlist package. Companion to [01-reverse-engineering-the-win.md](01-reverse-engineering-the-win.md) (where the leaks come from) and [03-metadata-wishlist.md](03-metadata-wishlist.md) (how to collect every signal named here).*

**How to read this.** Every decision between now and the Dec 2 final has (a) a decide-by date, (b) options, (c) the specific data signals that discriminate between them, (d) an explicit decision rule with thresholds where the evidence supports one, and (e) the cost of deciding wrong. If a signal you need is not yet collected, it appears in 03 as a collection item — that mapping is the point of this package.

**The governing noise fact (it shapes every rule below):** one public LB task = 1.72 points; run noise σ ≈ 4.3 points ≈ 2.5 tasks; CV↔LB correlation is currently unreliable. Therefore: *no decision may rest on a single unpaired run, and no leaderboard delta smaller than ~0.04 (≈2 tasks) may be read as signal.* This matches the repo's own adopt rule (adopt only if LB Δ ≥ +0.01 beyond the ±0.04 noise band) and detectable-effect table (n=30 ±16pp, n=54 ±12pp, n=129 ±8pp, LB ±12pp).

---

## 1. Master decision register

| ID | Decision | Decide by | Options (short) | Discriminating signals | Decision rule (threshold) | Wrong-cost |
|---|---|---|---|---|---|---|
| D1 | LoRA GO / NO-GO | **2026-10-21 tripwire, 10-23 verdict** | adapter-free only vs QLoRA ship | K1 trainability, K2 vLLM-serve verify, corpus ≥300 clean traj, **platform gates (new)**: KV-cache patch live + any adapter submission scoring >0 | Default NO-GO; flip only if all K1+K2+corpus+platform gates pass AND held-out-30 paired Δ ≥ +8pp (≈2–3 tasks, McNemar p<0.05) | A wasted ~2 wks + broken final subs if GO wrong; a real capability ceiling if NO-GO wrong |
| D2 | Per-task budget allocation | rolling; frozen by Nov 20 | flat caps vs triage-allocated caps | termination-cause census; time-per-task distribution; P(solve \| elapsed time) curves; tasks-completed per 12h rehearsal | Set caps so Σ(task caps) ≤ 10.5h (12h minus 12% margin); raise cap only where marginal solve rate per extra minute is top-quartile | Whole-run 12h error (currently = zero) or 10+ unattempted tasks |
| D3 | Thinking on/off | **this week** (A/B), re-decide on staff patch | thinking-on vs off under current server | paired on/off runs on frozen 30-task split; turns-to-solve; token spend; loop rate | Ship whichever wins paired McNemar; re-run the pair when the vLLM reasoning fix lands | ~1–2 tasks of pure server-bug exposure |
| D4 | Localization doctrine | week of 10-05 | graph-first strict vs dual-path (graph + AST/grep fallback) | per-arm P@1/P@5 by repo × async-stratum; symbol_in_graph(anchor) rate; gold-symbol-in-graph rate | Dual-path: use graph only when anchor resolves; log the arm. Graph-first strict is defensible only if async-stratum P@5 parity holds | Systematic blindness on fastapi async fix sites (16/121 tasks touch async) |
| D5 | Spec gate (Phase 1) on/off per class | week of 10-12 | unconditional spec vs Chow-style dispatch (spec only when classifier confident) | per-class resolve rate and turn cost with/without spec; LOO localization with vs without classes (03 pilot: worse, 6.57 vs 5.84) | Spec must pay for itself: keep only for classes where Δresolve/turn-cost ratio > 1; route "unknown" class straight to cheap path | 1–2 turns × 120 tasks of dead tax (~a full task's budget every run) |
| D6 | Compaction/context config | **immediately** (submission-safety) | token_threshold 14,336 vs 32,768; output reserve size | overflow rate per config; patch-loss-at-overflow count (44/44 today); prompt-length survival curve | 14,336 (or lower) + output reserve sized so prompt+reserve ≤ 32,768 always; overflow rate <2% | Up to 17–33% of sessions score 0 with edits applied |
| D7 | Edit path | week of 10-05 | harness edit_file vs anchor-verified structured edit tool | edit attempt failure rate (48/77 observed in the wild); edits_not_in_final rate; escaped-content fixture suite pass rate | Ship the tool that passes hostile fixtures (backslashes, CRLF, CJK) at ≥99% and cuts edit failures ≥5× | 30–60% of edit calls failing = stuck-mode → budget burn |
| D8 | Architecture: flat vs sub-agents | already leaning flat; confirm by 10-15 | flat single agent vs orchestrator+specialists | paired A-series ablation (A0→A6 ladder); turns, tokens, resolve; community: subagent arm scored worse (8/29 vs 9/29) | Flat unless sub-agent wins ≥ +8pp paired on dev-99 AND loses nothing on held-out-30 | Known: 31B quantized loses coherence across handoffs |
| D9 | Distillation teacher (if D1=GO) | at D1 | open-weight trajectories (Qwen-Coder etc.) vs proprietary-API teachers vs own-passing-runs only | staff ruling (done: allowed if teacher license permits); trajectory quality filters yield; ToS risk review; leave-one-repo-out Δ | Default open-weight + own successful runs; proprietary only with written ToS clearance | Disqualification-class risk if license conflict; winner-license obligations |
| D10 | Submission cadence + finals pair | rolling; finals by Nov 30 | 1/day burn vs 2–3 informative/week; which 2 finals | submission log: per-day platform stability, staff patch status, informative-submission EV | Never submit during a known platform-bug window without a canary change; finals = highest-private-expectation + safest (diversified) pair, per rules' 2 picks | Each wasted day = 1/62 of total info; a bad finals pick is unrecoverable |
| D11 | CV protocol upgrades | continuous | more seeds vs more tasks vs LORO emphasis | CV↔LB pair history (log every submission); detectable-effect table; private-split proxy (LORO) correlation | Spend next marginal hour on whichever narrows the CI most: tasks > seeds > polish; require LORO no-fold-negative before shipping any localization change | Overfitting to 129 public tasks = public-rich/private-poor collapse |
| D12 | Paper track: enter, category, freeze date | freeze by **Nov 10 internal** (host Nov 12) | Tasks&Benchmarks (taxonomy+asymmetry) vs Graph Reasoning vs Tuning | P-1 probe results (κ≥0.70, asymmetry rate); ρ, λ, q calibration completeness; ablation table receipts | Enter if P-1 completes with κ≥0.70 by Nov 1; primary category = Tasks & Benchmarks unless LoRA shipped (then Tuning co-claim) | Forfeits $35k lane; or an unrebuttable-methods paper if rushed |
| D13 | Hardware allocation | weekly | 5090 serving/training vs 4060 data vs 3080 grading vs Kaggle L4×4 | queue telemetry (Kaggle 8–13h queues); throughput per rig; rehearsal fidelity vs scorer | Scorer-parity runs on Kaggle L4×4 weekly; everything else local; grading farm on 3080 | Local-only runs miss scorer-only behaviors (KV, queueing, flags) |
| D14 | Rescue/governor params | week of 10-19 | trip thresholds (3/3/4/25%) tuning | rescue trigger rate, rescue recovery rate, false-trip rate from ledger | Keep trips where recovery rate > 25%; loosen where false-trips > 2× true | Over-tripping wastes capable runs; under-tripping leaks budget |
| D15 | Scope cuts under time pressure | as needed | cut order already defined | evidence ledger EV per option (O1–O13); remaining calendar | Follow the pre-committed cut order (LoRA → mechanism cards → rescue tuning → scout → third seed); never cut A0, splits, gold check, claims audit | Sunk-cost defense of a dead feature |

---

## 2. The four decisions with the most detail

### D1 — LoRA GO/NO-GO (tripwire 2026-10-21, verdict 10-23, default NO-GO)

This is where "what should I look for in the data" matters most, and the ground just shifted under it. The pre-existing gate (from the LoRA-gate briefing and merged kickoff prompt) plus the platform facts discovered this week compose a **five-gate** decision:

| Gate | Question | Evidence to collect | Pass condition |
|---|---|---|---|
| K1 trainability | Can QLoRA train on the QAT w4a16 weights at all? | Loss curves on 5090; before/after perplexity on held-out prompts; grad-norm health | Loss decreases, no divergence, ≥2 epochs stable |
| K2 serving fidelity | Does the adapter actually change served output on the competition stack? | vLLM-served (wheelhouse version) with adapter mounted: output diff vs base on 20 fixed prompts; **watch for the silent-no-effect adapter failure reported in the wild** | Token-level differences on ≥18/20 prompts |
| K3 corpus sufficiency | Enough clean training trajectories? | Clean-trajectory census (rendered exactly as the host renders; ≤28k tokens; no installs/scratch) | ≥300 clean conversations (two-band finding: format band 100–500, resolution floor ~491; current own-stock 129 → harvest to 300–500) |
| **K4 platform KV (new)** | Does an adapter submission get a usable KV cache? | Staff patch status (thread 744331); any team's adapter submission scoring >0; if unresolved by 10-21, a canary adapter submission of your own | Patch confirmed live AND (foreign or own) adapter run completes with score |
| **K5 measured lift (new, harder)** | Does the adapter buy real tasks? | Paired held-out-30, ≥3 seeds, exact McNemar, adapter vs no-adapter, served on 4×L4 (not the 5090) | Δ ≥ +8pp (≈ +2.4 tasks on 30) at p<0.05; no LORO fold negative |

**What to look for in the data, concretely:** the K2 output-diff matrix (not just "it loaded"); the trajectory-census table with rejection reasons; the KV-cache token budget printed at server startup (46,048 vs 7,600 is one glance); and the McNemar table, not the means. **Default remains NO-GO** — the platform was actively hostile to adapters as of 2026-10-01, no public adapter has ever scored, and the two-band corpus math says you don't have the data volume yet. The NO-GO path is not a loss: it frees ~2 weeks for integrity/budget work with clearer marginal value.

### D2 — Budget allocation (the quiet decisive decision)

Sequential 12h, ~120 tasks, and (today) a run-killing cap. The data picture to maintain:

- **Termination-cause census per run**: {pass, wrong_fix, no_patch, apply_fail, timeout, turn_cap, ctx_overflow, forgot_submit, harness_error} — a zero-census, every cause counted, every run.
- **Time-to-outcome curves**: P(pass given wall-minutes elapsed) per repo and per triage class. The bimodal behavior (solve fast or never) means the curve saturates early for most tasks; the cap should sit just past saturation, not at "6 minutes average."
- **Run rehearsal totals**: Σ actual task wall-times + setup overhead on 4×L4 (Kaggle), weekly. Headline: if the 90th percentile task eats 25 min, either the cap is 25 min (and ~40 tasks don't run) or the stuck-detector bails at 8.
- **Marginal-solve-per-minute table**: which triage classes convert extra minutes into passes at the best rate — this becomes the allocator policy (v1 flat caps → v2 class-aware).

**Rule of thumb to look for:** a run where zero tasks end in {timeout-by-hang, ctx_overflow, forgot_submit} and 100% end in {pass, wrong_fix, no_patch-with-clean-exit}. That is a *budget-clean* run; only budget-clean runs make the leaderboard readable.

### D3 — Thinking on/off (decide this week; cheap and reversible)

The scorer's default is thinking-ON, but the server drops thoughts between tool calls (0.35× vs ≥1× next-prompt growth; the model re-derives reasoning every turn). Evidence to collect: one paired on/off run on the frozen 30-task split (same seeds), tracking turns-to-solve, tokens, loop rate, resolve. Third-party datapoint: thinking-off scored worse in a working local harness (7/29 vs 9/29), but *under the broken server* thoughts are dead weight tokens that also grow the context toward the overflow cliff — so the sign of the effect may flip. Decide with McNemar; re-decide when the vLLM fix lands; log the server version with every run either way.

### D11 — CV protocol (the meta-decision that protects all others)

The community's CV↔LB table is the scariest dataset in this competition (CV 0.316 → LB 0.03). Your protocol already outclasses it (frozen splits dev-fast 15 / dev-full 54 / held-out 45 / reserve 15, seed 20260929; ≥3 seeds; exact McNemar; Wilson CIs; LORO 4-fold; OOD probe). The two additions the live evidence demands:

1. **Log a CV↔LB pair for every submission, forever** (submission id, config hash, CV on each split with CI, LB public). After ~8 pairs you can *fit* your own CV→LB mapping and shrink the private-split surprise. Nobody else in the field is doing this systematically — it is both a competitive edge and a paper table.
2. **Environment-gap register**: every local-vs-scorer difference you can name (wheelhouse test-deps missing, sandbox mode Docker vs subprocess, scorer vLLM flags unpublished, compaction threshold unconfirmed, thinking bug) — because the CV↔LB gap decomposes into distribution shift (private repos) + environment gap + noise, and only the first is irreducible. The blog's oracle/baseline validation (110/129 oracle pass; 3 no-fix-passes dropped) is the template: run the gold-patch oracle and the no-fix baseline over your local splits and quarantine the tasks where either misbehaves (12 dead-task candidates already identified).

---

## 3. The weekly decision cadence (the "Monday queries")

Run these against the ledger every Monday (each is a single query over the P0/P1 telemetry defined in 03):

1. **Leak report:** counts of each termination cause, week over week. Any cause >5% of tasks gets a fix task created.
2. **Adopt/revert report:** for each candidate change: paired Δ on dev-99 with CI + McNemar p; adopted only if Δ ≥ detectable-effect floor for its n; leaderboard deltas quoted with the ±0.04 band.
3. **Budget report:** Σ wall-times vs 12h at 4×L4; per-class P(pass given time); allocator changes proposed as diffs to a versioned policy file.
4. **Platform watch:** staff patches (KV, 12h-unfinished, thinking, wheelhouse), each with date observed and evidence link; submission-error incidence rate by day.
5. **Corpus/annotation progress:** tasks labeled (taxonomy + oracle-asymmetry), κ on double-coded subset, ρ/λ/q estimates with current CIs.
6. **Paper burn-down:** which claims have receipts (M/D/I/H), which are still [H]ypothesis; anything unreceipted by Nov 8 gets cut from the paper.

---

## 4. What NOT to decide yet (and why)

- **Don't pick finals before Nov 20** — the two-final-picks rule rewards a safe + aggressive pair, and which is which depends on D1 and the platform patches.
- **Don't tune prompts globally before the recall-table arms (a)–(e) are measured** (the merged kickoff prompt's ordering; community evidence says prompt fixes moved nothing while structural bugs dominated).
- **Don't chase the public leaderboard** — with ±2.5 tasks of noise, position changes under 0.04 are weather, not climate. The private split is the game.
- **Don't decide the async-hole response (beyond dual-path logging) until staff answer whether the hidden graphs share the omission** (thread 742911) — if hidden graphs include async nodes, the fallback arm matters less; if they don't, the AST fallback is a core capability, not a fallback.


---

<!-- ====================================================================== -->
<!-- FILE: 03-metadata-wishlist.md -->
<!-- ====================================================================== -->

# The Metadata Wishlist — instrumentation spec for the highest-confidence decisions

*Part of the 2026-10-01 decision-signals & metadata-wishlist package. Companion to [01-reverse-engineering-the-win.md](01-reverse-engineering-the-win.md) (the leaks) and [02-decision-map.md](02-decision-map.md) (the decisions).*

**How to read this.** This is the answer to the core question: *if you were building the most intelligent and efficient agent for this competition, what would you want collected so every decision is made on the best available information?* The organizing principle: **no field is on the list unless it feeds a named decision.** Field → decision mapping is §6; anything that doesn't map was cut or moved to the anti-wishlist (§8).

**The one-sentence design.** At 58 public tasks with ±2.5 tasks of run noise, your decisions are only as good as your denominator — so collect a *zero-census ledger*: every task, every run, every termination cause counted, so that deltas between arms are paired, exact (McNemar), and never polluted by "unknown" outcomes.

**The storage shape.** One append-only JSONL event stream keyed `(run_id, task_id, event)` — the run manifest first, then per-task events in chronological order, plus a per-task summary record at close. Everything below is either an event type, a field on an event, or a column of the per-task summary. Local runs write it directly; scorer runs reconstruct what the public artifacts allow (§7). This is deliberately ATIF-compatible (the harness's SessionTrace trajectory tracing, v1.7) — events carry ATIF field names where they exist so the two streams can be joined.

---

## 1. Collection tiers at a glance

| Tier | What it is | When it exists | Why this tier exists |
|---|---|---|---|
| **P0 — Receipts** | Outcome + budget + submission records for every task, every run | Immediately (the first A-series run) | Survives every architecture change; this is the ledger every later analysis reads. Zero-census: no task may end "unknown." |
| **P1 — Trajectory** | Per-turn behavioral telemetry: tools, tokens, loops, edits, compaction | With the first instrumented agent | Converts the seven leaks (01 §3) from anecdotes into rates; feeds D2/D3/D5/D6/D7/D8/D14 |
| **P2 — BCF internals** | Classifier/spec/localization/fix-order provenance | As BCF phases come online | Proves (or refutes) each BCF component's value with paired arms; feeds D4/D5 and the paper's ρ/λ/q spine |
| **P3 — Corpus annotation** | Human/LLM-coded labels on the 129 public dev tasks | Offline, parallel to everything | The paper track's core asset (legal to annotate: they're training data); powers P-1 oracle-asymmetry probe and stratified CV |
| **P4 — Platform watch** | Staff-patch status, submission-error incidence, queue times, LB deltas | Weekly, external | Feeds D10/D13 and the CV↔LB model; guards submission windows |

Tiers are ordered by *build cost*, not importance — P0 is a day of work, P3 is a week, and both outrank any new model capability in expected points.

---

## 2. P0 — Receipts (the zero-census ledger)

### 2.1 Run manifest (one per scoring run)

| Field | Type | Feeds | Notes |
|---|---|---|---|
| run_id | string | all | Hash of (config_hash, started_at) |
| config_hash | string | D10, D11 | Sha of the entire submission bundle; makes every CV↔LB pair attributable |
| config_snapshot | object | all | eval_config four fields, thinking on/off, token_threshold, adapter mounted?, prompt versions |
| env | object | D11 | harness/wheelhouse version, swegemma version, server flags if observable, GPU class, sandbox mode |
| split | enum | D11 | which frozen split (dev-fast-15 / dev-full-54 / held-out-30 / reserve-15 / full-129 / Kaggle-LB) |
| seed | int | D11 | ≥3 seeds per arm before any adopt decision |
| started_at / ended_at | ISO | D2 | wall-clock envelope |
| tasks_attempted / tasks_completed | int | D2 | completion ≠ resolution; both matter |

### 2.2 Per-task outcome (the heart of the ledger — one record per task per run)

| Field | Type | Feeds | Notes |
|---|---|---|---|
| task_id / repo / instance | string | all | join key back to P3 annotations |
| resolved | bool | all | The coin-flip; everything else explains it |
| **termination_cause** | enum | **D2, D6, D7, D10 — the single most valuable field in this document** | Exactly one of: `pass` \| `wrong_fix` (patch applied, tests fail) \| `no_patch` (clean exit, nothing submitted) \| `apply_fail` (patch didn't apply) \| `timeout` \| `turn_cap` \| `ctx_overflow` \| `forgot_submit` \| `harness_error` \| `not_run` (12h ran out before this task). Bimodal "solve fast or never" becomes visible here first. |
| patch_present | bool | Leak 1 | true iff a diff was captured by any path (submit, timeout-fallback, forced-submit) |
| patch_bytes / files_touched | int / list | Leak 1, D5 | dirty-tree detector: files_touched not plausibly fix-related |
| wall_seconds | int | D2 | inclusive of any retries |
| turn_count / tool_call_count | int | D2, D5 | per-task budget accounting |
| tokens_in / tokens_out | int | D2, D6 | totals; per-call detail is P1 |
| tests: f2p_passed / f2p_total / p2p_broken | int | leak triage | distinguishes wrong_fix sub-modes (partial fix vs regression vs test-flake) |
| score_posted | enum | D10 | on Kaggle runs: scored / errored / pending — the submission log closes the loop |

**Why termination_cause dominates:** every leak in 01 §3 is a cause distribution, not a mystery. Overflow leak → `ctx_overflow` rate. Hung neighbor leak → `timeout` clustering. Adapter stall → `harness_error` at 100% for adapter runs. "Zero systematic losses" becomes a checkable invariant: *no task may end in {ctx_overflow, forgot_submit, harness_error, not_run} for reasons the submission controls.*

### 2.3 Budget telemetry (per run, derived + raw)

- Cumulative wall-clock curve (timestamp per task boundary) → the 12h rehearsal line and the safety margin (target Σ ≤ 10.5h).
- Per-task wall_seconds distribution by repo and triage class → the allocator policy's input (D2).
- P(pass given wall-minutes) saturation curves → where caps stop buying solves.
- **Stuck-mode detector hits:** count of tasks where {repeats ≥ 3 identical tool calls OR ≥ N minutes without an edit event} — the rescue FSM's trigger census (D14).

### 2.4 Submission log (one row per Kaggle submission — the CV↔LB model)

| Field | Type | Feeds |
|---|---|---|
| submission_id / date / config_hash | string | D10 |
| lb_public / lb_tasks | float / int | D11 |
| cv_score per split, with Wilson CI | object | D11 |
| platform_events that day | list | D10 (bug-window canaries) |
| delta_vs_expectation | float | D11 — after ~8 rows, fit the CV→LB mapping; this is your private-split telescope |

---

## 3. P1 — Trajectory telemetry (per turn, per tool call)

Emitted by the agent itself (and/or derived from the ATIF SessionTrace the harness already records). Costs nothing at scoring time if written to `/tmp` — it must **never** grow the model's context (§8).

| Field | Type | Feeds | Notes |
|---|---|---|---|
| turn_index / tool name / call args-hash | int/str | D7 | tool-call census by tool |
| tokens_in / tokens_out this call | int | D3, D6 | prefix-cache hit rate if the server exposes it |
| **edit attempt → result** | enum | **D7** | `applied` \| `no_match` \| `ambiguous` \| `escaped_content_mismatch` \| `non_unique_anchor`. The 48/77 wild failure is exactly an `escaped_content_mismatch` census. |
| first_edit_turn | int | D5 | turns spent before any edit — the spec+classify tax, measured |
| edits_total / edits_in_final_patch | int | Leak 1 | `edits_not_in_final` = edits made then lost (overflow/revert churn) |
| repeat-loop detector | int | D2, D14 | consecutive-identical-call streak length; 39-in-a-row was a real trace |
| **thinking_content_present** | bool | **D3** | per turn, under thinking-on: false everywhere ⇒ the server bug is eating thoughts *in this run too*; the 0.35× growth test, made local and continuous |
| compaction event | object | D4 (journal), D6 | turn index, tokens before/after, what survived |
| rescue trigger / nudge event | object | D14 | which trip fired, what the FSM did, whether the task subsequently passed |
| journal snapshot hash | string | Leak 4 | /tmp journal exists and is current — the post-compaction re-injection's receipt |
| phase transitions | enum | D5 | CLASSIFY→SPECIFY→LOCALIZE→PATCH→VERIFY timestamps |
| forced-submit event | object | D2 | fired at 90% budget? patch captured? |

Derived weekly from P1 (not stored per-turn): edit failure rate by tool and content class; loop-rate by repo; post-compaction continuation rate; thinking-drop incidence by server version; nudge effectiveness.

---

## 4. P2 — BCF-internals provenance (the ablation machinery)

Each BCF phase must log its own inputs/outputs so an A-series ablation can turn it on/off and *attribute* the delta. Without these, "does the spec gate pay?" is unanswerable (the 03-pilot LOO result — classes made localization *worse*, 6.57 vs 5.84 — is exactly the kind of result this tier exists to catch early).

| Field | Type | Feeds | Notes |
|---|---|---|---|
| classification: label + confidence + features | enum/float | D5 | the C in ρ = I(R;C)/H(R) |
| spec: present/absent + field completeness | bool/int | D5 | binary DoD drafted? how many fields? |
| localization: ranked candidates + chosen | list | **D4** | file(:line) list, rank of chosen |
| **localization arm** | enum | **D4** | `graph` \| `ast_fallback` \| `grep` — logged at decision time; the dual-path doctrine's measurement basis |
| anchor: symbol + symbol_in_graph(anchor) | str/bool | D4 | the async-hole census: how often anchors resolve to graph nodes, stratified by async-touching tasks |
| **P@1 / P@5 vs gold** | float | **D4** | per arm × repo × async-stratum — the localization league table |
| fix_order: predicted DAG vs realized edit sequence | list | D5, paper | q-calibration: does the topological order hold? |
| verification: gates fired + verdicts | list | Leak 1 | G0–G6 pass/false-positive rates |
| wrong_fix autopsy fields | object | D5, D7 | which phase produced the wrong hypothesis — classify, localize, or patch |
| budget transfers | object | paper | "a win bought with more turns" — turns above triage-class median for passed tasks |

Whitepaper calibration constants computed from this tier: **ρ** (class informativeness), **λ** (distance-decay of localization), **q** (spec-ordering accuracy), each with CI — the paper's measurable spine, and simultaneously the kill-switch criteria for the knowledge layer.

---

## 5. P3 — Corpus annotation (129 public dev tasks; legal — they are training data, and hand-labeling validation/test is what's banned)

| Annotation | Type | Feeds | Notes |
|---|---|---|---|
| taxonomy label (failure class) | enum | D5, paper | from the repo's taxonomy; double-code 30 tasks, target κ ≥ 0.70 |
| files in gold patch / gold-file rank | list/int | D4 | ground truth for P@k |
| graph-distance: gold files present in graph? async-touched? | bool | **D4** | quantifies the async hole per task |
| **oracle asymmetry (P-1 probe)** | enum | **D12, paper — the claimable novelty** | For each task: does the gold patch's FAIL_TO_PASS pass *without* the fix? Does a *wrong* minimal patch pass? Codes: oracle-sound / oracle-leaky / oracle-blocking. κ ≥ 0.70 on double-coded subset by Nov 1 or the paper's core probe is dead. |
| test-deps available in public wheelhouse? | bool | D11 | the 3–12 dead-task quarantine (fastapi/requests tasks whose gold can't pass locally) |
| difficulty priors | int | D2 | files touched, test count, LOC churn — the allocator's prior |
| hints/embeddings empty flags | bool | data QA | known-broken fields, pre-marked |

Stratify every CV split and every ablation report by these annotations — repo × async-stratum × difficulty — because an aggregate Δ hides exactly the subpopulations where graph-first wins or fails.

## 5b. P4 — Platform watch (weekly, one table, five columns)

Staff-patch status (KV sizing / 12h-unfinished / thinking fix / wheelhouse), each with date observed + evidence link; submission-error incidence by day; Kaggle L4×4 queue times; leaderboard top-band deltas; any adapter submission scoring >0 anywhere (D1's K4 gate).

---

## 6. Field → decision map (the completeness check)

Every D-register entry (02 §1) with the fields that decide it — this table is the proof the wishlist is sufficient:

| Decision | P0 | P1 | P2 | P3/P4 |
|---|---|---|---|---|
| D1 LoRA gate | config adapter flag; termination_cause (stall pattern) | tokens_in per call vs 7.6k KV cliff | — | P4: patch status + first adapter score |
| D2 Budget caps | wall_seconds; P(pass\|time); Σ vs 10.5h | loop streaks; stuck hits; forced-submit | phase timestamps | P3: difficulty priors |
| D3 Thinking | tokens_in/out | thinking_content_present per turn | — | P4: fix status |
| D4 Localization | — | — | arm, P@1/P@5, anchor_in_graph, candidates | P3: gold-file rank, async flag |
| D5 Spec gate | turn_count per class | first_edit_turn | classification+spec provenance; wrong_fix autopsy | P3: taxonomy |
| D6 Compaction | ctx_overflow rate | compaction events; tokens | — | P4: threshold confirmation |
| D7 Edit path | termination_cause (apply_fail) | edit attempt→result census | — | — |
| D8 Architecture | resolved (paired) | turns/tokens/loops per arm | — | community datapoint |
| D9 Teacher | resolved (paired) | trajectory quality filters | — | license/ToS review |
| D10 Submissions | submission log row | — | — | P4: platform events |
| D11 CV protocol | submission log CV↔LB pairs; splits | — | — | P3: stratifiers; wheelhouse flags |
| D12 Paper | — | — | ρ/λ/q estimates | P3: P-1 probe, κ |
| D13 Hardware | run env + wall | — | — | P4: queue times |
| D14 Rescue | termination_cause | rescue/nudge events + outcomes | — | — |
| D15 Scope cuts | the ledger itself (EV per option) | — | — | — |

No decision lacks a signal source; no signal lacks a decision. That closure is the deliverable.

---

## 7. Collection mechanics — where each byte comes from

1. **The harness already gives you more than you think.** swegemma's runner emits per-task trajectories (ATIF v1.7 SessionTrace), token accounting (TokenBudget), and test results (JUnit XML) locally; the four eval_config fields control caps. P0/P1 mostly = *normalize and join these into the ledger*, not new instrumentation. The known trap: patch-at-overflow loss means the SessionTrace is sometimes the *only* record an edit happened — keep raw traces even for failed tasks.
2. **The agent itself** writes the P2 provenance events (and its /tmp journal) — cheap, no context growth, and it is the only place BCF-internals fields can originate.
3. **Post-hoc analysis scripts** derive P@k, ρ/λ/q, curves, and stratified tables from (1)+(2)+P3 annotations. Keep these as versioned SQL/Python over the JSONL — the "Monday queries" (02 §3) must be one command each, not an afternoon each.
4. **Kaggle-side runs** return only score + errors; the submission log (2.4) is therefore the entire scorer-side ledger — which is why config_hash discipline matters: every public point must be attributable to an exact bundle whose local CV is already in the ledger.
5. **Repair the ZIP-hardlink graph/embedding copies before local runs** (01 Leak 5) — otherwise P2's graph-arm metrics are measured against broken tools and will mislead D4.

---

## 8. The anti-wishlist — metadata NOT to collect (and why)

| Tempting but cut | Why cut |
|---|---|
| Anything that grows the in-run prompt (asking the model to narrate rationale into context) | Pays the context-overflow leak (Leak 1/4) for information the trace already contains. Journal to /tmp, not to context. |
| Sub-token / latency micro-telemetry per API call | No decision on the register reads it; storage cost and harness complexity for zero D-value. |
| Competitor-scraping at scale (their notebook diffs, submission timing forensics) | Weak signal (±2.5 tasks noise), ToS-adjacent, and time spent there is time not spent on the ledger. Weekly leaderboard snapshot is enough. |
| Full embeddings/graph dumps per task per run | Static corpus artifacts — annotate once (P3), not per run. |
| Model-internal states (logits, attention) | Not exposed by the fixed serving stack; LoRA decisions don't need them (K1/K2 are behavioral). |
| Hand-labeling anything beyond the 129 dev tasks | Validation/test labeling is banned by the rules — the paper track is not worth disqualification. |

The general anti-rule: **if collecting it changes no row of the decision register, it's not metadata — it's hoarding.**

---

## 9. Monday-morning queries (what this buys you, concretely)

Given the JSONL ledger, each is one query:

1. `termination_cause` distribution, week over week — any cause >5% spawns a fix task.
2. Paired arm diff (any A-series pair): resolved flips, exact McNemar p, Δ per P3 stratum.
3. Edit-failure rate by tool and failure class; `edits_not_in_final` rate.
4. Σ wall_seconds vs the 10.5h line, at Kaggle-parity env; tasks at risk if order shuffles.
5. P@1/P@5 league table: graph arm vs fallback arm × async stratum.
6. thinking_content_present incidence by server version; ctx_overflow rate by token_threshold.
7. CV↔LB residuals for all submissions logged so far — is the mapping stabilizing?
8. Rescue-FSM trips → recovery rate; false-trip rate.
9. P-1 probe progress: tasks coded, κ, asymmetry rate so far.
10. ρ/λ/q estimates with CIs, recomputed on the week's new data.

Run 1–10 every Monday from now to Dec 2 and the register in 02 becomes a checklist rather than a set of judgment calls — which, at ±2.5 tasks of noise, is the only reliable way to win the measurement game this competition actually is.


---

<!-- ====================================================================== -->
<!-- FILE: 04-sources.md -->
<!-- ====================================================================== -->

# Sources — 2026-10-01 decision-signals & metadata-wishlist package

Grouped by publisher so diversity is visible. Access dates: official-corpus items were snapshotted 2026-09-29 (BCF dossier corpus build) unless noted; Kaggle live items (leaderboard, threads, data pages) were fetched the morning of **2026-10-01** via the research-toolkit browser. Repo-internal items are listed with their folder-of-record.

## A. Kaggle — official competition surfaces (primary)

1. Gemma 4 Developer Agent Competition — Overview & Evaluation — Kaggle — accessed 2026-10-01 (live) + corpus snapshot 2026-09-29 — https://www.kaggle.com/competitions/gemma-4-developer-agent/overview — scoring rule (all FAIL_TO_PASS pass, no PASS_TO_PASS break), ~120 tasks private repos, split public/private. Local copy: `input/kagglecomp/docs/markdown/Kaggle-00-Complete.md`.
2. Official Rules — Kaggle — 2026-09-23 (open) — https://www.kaggle.com/competitions/gemma-4-developer-agent/rules — 1 submission/day, 2 final picks, OSI winner-license + pretrained-input carve-out, hand-labeling ban on validation/test. Local: `Kaggle-04-OfficialRules.md`.
3. Data page — Kaggle — accessed 2026-10-01 — https://www.kaggle.com/competitions/gemma-4-developer-agent/data — dataset composition (129 dev tasks, graphs/embeddings/hints ZIP).
4. Competition Harness README (kagglecomp_data_package) — Kaggle/Gemma team — snapshot 2026-09-29 — swegemma + adk-submission + adk-eval-core architecture, two-container lifecycle, 9 sandboxed tools, ATIF v1.7 SessionTrace, TokenBudget, JUnit XML, eval_config knobs, compaction token_threshold 14,336. Local: `kagglecomp_data_package/HARNESS_README.md`.
5. Public leaderboard — Kaggle — fetched 2026-10-01 ~09:00 UTC — rank/score/entries table quoted in deliverable 01 §2. Raw dump: `scratch/pages/ext-1-3.md`.
6. `sample_submission` (official) — scorer-side failure discussed in [10].

## B. Kaggle discussion threads (competitor/staff posts; primary for platform behavior)

7. Thread 742807 — "Distillation from external LLMs" — Kaggle forums, staff reply — accessed 2026-10-01 — distillation permitted where teacher license permits. Dump: `scratch/pages/ext-thread-742807.md`.
8. Thread 743506 — "58 public tasks arithmetic" — Geremie Yeo — accessed 2026-10-01 — public LB n=58 derivation from the hundredths ladder. Dump: `ext-thread-743506.md`.
9. Thread 743063 — "Sequential execution & 12h cap" — staff-confirmed — accessed 2026-10-01 — 12h inclusive of setup, excluding validation; 4 eval_config fields; default no limit; overrun currently errors whole submission; "unfinished=0" fix planned. Dump: `ext-thread-743063.md`.
10. Thread 743140 — "Results & fork deltas" — romanrozen et al. — accessed 2026-10-01 — notebook 0.12 vs byte-identical fork 0.08; sample_submission scorer-side error; nursrijan starter 0.05; TwangyGarlic449 0.08. Dump: `ext-thread-743140.md`.
11. Thread 742882 — "Running the harness locally" — accessed 2026-10-01 — public wheelhouse missing test deps (typing-inspection, inline-snapshot, dirty-equals, pytest-httpbin); oracle recovered 110/129; 3 tasks pass with no fix. Dump: `ext-thread-742882.md`.
12. Thread 742911 — "Data issues: ZIP hardlinks, empty graphs/embeddings, zero async nodes" — accessed 2026-10-01 — 129/256 graph+embedding files 0-byte; 0/305 async functions in graphs; 16/121 body-level fixes touch async; hints empty 129/129; staff response pending on hidden-set parity. Dump: `ext-thread-742911.md` + note addendum `scratch/notes/angle-external-kaggle-live.md`.
13. Thread 744319 — "CV vs LB" — accessed 2026-10-01 — community CV↔LB pairs (0.316→0.03; 0.289→0.05); weak-to-inverted correlation. Dump: `ext-thread-744319.md`.
14. Thread 744331 — "LoRA KV cache 46,048 → 7,600" — staff-acknowledged ~2026-09-30 — adapter-enabled KV preallocation; prompts >7.6k hang; patch in progress. Dump: `ext-thread-744331.md`.
15. Thread 744354 — "Thinking-mode reasoning_content dropped by vLLM" — accessed 2026-10-01 — 3,640 consecutive tool-call steps across 636 public runs; median 0.35× next-prompt growth; upstream vllm#38488 / fix #42664; scorer default thinking-ON; not submission-fixable. Dump: `ext-thread-744354.md`.
16. Thread 744692 — "Context overflow discards patch" — accessed 2026-10-01 — ADK compaction checks previous prompt vs threshold; vLLM rejection first; generic except skips diff capture; 44/44 overflow sessions empty patch, 14 after successful edits; overflow rates ~12% @14,336, 17–33% @32,768. Dump: `ext-thread-744692.md`.
17. Thread "Submission errors after the Sep 30 wheelhouse update" — accessed 2026-10-01 — platform-side Oct 1 failures incl. prompt-only bundles and current #1; read_file line-range type error acknowledged. Dump: `ext-thread-wheelhouse.md`.
18. Thread 743140 comment re: adapter-name rewrite to `openai/<adapter-name>` LiteLLM ids — basis for the sample_submission adapter-path suspicion (single-source, flagged).

## C. External web (secondary/technical corroboration)

19. "Gemma 4 Developer Agent on Kaggle" — Jayaprakash (blog) — 2026-09-24 — https://www.jayaprakash.net/blog/2026-09-24-gemma-4-developer-agent-on-kaggle/ — day-one 0.12 best; 48/77 edit_file failures (escaped quotes); 39 consecutive identical commands; bimodal 6–38 tool calls vs full-budget burn. Dump: `ext-1-2.md`.
20. "Agentic coding benchmarks validity checklist (ABC)" — arXiv:2507.02825 — 2025 — https://arxiv.org/abs/2507.02825 — agentic benchmark misestimation up to 100% relative from validity defects. (Cited in 01 §3 Leak 6.)
21. vllm#38488 (bug) and vllm#42664 (proposed fix) — vLLM GitHub — referenced via [15] — reasoning_content vs reasoning mismatch. (Not independently fetched this session; flagged as secondhand.)

## D. Repo-internal corpus (folders of record; primary for BCF status)

22. BCF Kaggle-comp corpus deliverables — 2026-09-29 — `independent_research/2026-09-29-bcf-kagglecomp-corpus-deliverables/` — budget defaults/32k ceiling/4×L4 [V-file]; ZIP 127+127 graphs/embeddings; hints empty; counters drift.
23. LoRA-gate briefing + portable primer (Commission D package) — 2026-09-29 — sha16 4e6a9099057af028 / edd836d41d092a3a — two-band finding (format 100–500 vs resolution floor ~491); K1/K2 gates; gate date 2026-10-23.
24. Model council 3 (MC3) deliverables — 2026-10-01 — `independent_research/2026-10-01-model-council-3-bcf-gemma4/` — candidate ranking 09>03>11>12>16>14>15>13; the one executed pilot (0/129 tracebacks initially; LOO localization 6.57 with issue-text classes vs 5.84 without); citation-verify ledger.
25. Fault-masking research — 2026-09-30 — `independent_research/2026-09-30-fault-masking-*/` — masking/exposition DAG, oracle-contradiction gap as claimable novelty; Offutt 1992 TOSEM correction; Multi2Fixer only E2 fix-order ablation.
26. BCF×DS&A full circle — 2026-10-01 — `independent_research/2026-10-01-bcf-dsa-full-circle/` — harmony-laws synthesis; corrected bibliography (Slavík 1997; HNSW TPAMI 2020).
27. Merged ideal kickoff prompt (kickoff2 council) — 2026-09-30 — `sysprompts/[kickoff2-council-ideal]` — A0→A6 ablation ladder, recall-table arms (a)–(e), evidence tiers, cut order; graphs 256-vs-127 counting-basis resolution.
28. ADK Gemma4 primer — 2026-10-01 — `independent_research/2026-10-01-adk-gemma4-primer/` — adk 2.10.0 vs 1.36.1 pins; zero-VALIDATED badge policy; H-01..H-14 decay-in-days hypotheses.
29. BCF whitepaper v3 + Competition Plan + Reference Compendium — repo (via S3 digest) — ρ/λ/q formalization; "budget transfer" economics; provenance ledgers establishing "nothing run yet" status.

## Source-quality notes

- **Load-bearing and live-sensitive:** the entire §B block — platform defects, KV patch status, wheelhouse window — can change any day; every such claim in 01 carries its thread ID so it can be re-checked before acting on it.
- **Single-source flags:** [18] adapter-name rewrite mechanism; [21] vLLM issue numbers (secondhand via [15]); the 12h "unfinished=0" fix is *planned*, not confirmed live.
- **Disagreements honored, not averaged:** 127-unique-payload vs 256-file graph counts (counting basis — both true); thinking-off worse in one local harness (7/29 vs 9/29) vs thinking-on broken at the scorer — both recorded; sign of D3 effect unresolved pending the paired A/B.
- Reproducibility details (engine use, spend, browser) are in the README footer.

