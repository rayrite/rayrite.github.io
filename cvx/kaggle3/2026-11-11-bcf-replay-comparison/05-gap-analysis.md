# BCF Gap Analysis — v6 "BCF v3" vs the Current Shipped Brain

**Date:** 2026-11-11 · **Inputs:** the other agent's v6 package (`input/kagglecomp/2/2026-11-11-bcf-v6/`), three new replay simulations against the CURRENT brain (`deliverables/2026-11-11-bcf-gemma4-brain/`), the v6 review (`01-review-of-v6-research.md`), and the verified intel corpus.
**Method:** the current brain's deterministic machinery was **really executed** for all three tasks (36 logged steps, all rc=0, including real reference-hunk `apply` with auto-compile, `check`, strike-recovery, warm-cache re-entry). LLM turns are **[MODELED]** from the shipped prompts + RCAs + reference patches — not sampled from Gemma. Costs are **[EST]** (31B decode 34 tok/s on 4×L4, ~10.3 s median/model call, ~60 s setup/task). **No grader run was performed; every verdict is a prediction from reference-patch equivalence.**

---

## 1. Executive summary

The current shipped brain is the **stronger foundation**: its reliability machinery is executed and logged (not design claims), its localization generalizes (no task-fitted router), and it survives the harness's hostile behaviors (compaction, nudge restarts, edit loops, dep-gap noise) by structure. On all three replayed tasks it is **predicted to PASS** where the naive agent fails, at a fraction of the naive token bill.

The v6 package nonetheless contributes **three high-value mechanisms the current brain lacks**: (1) an **expected-red predictor + ratchet in code** (the current brain's revert-avoidance is a prompt sentence — the single biggest falsification risk on rename tasks like httpx_3672); (2) **scoped batch renames bounded by a caller-closure map** (the current brain's per-site edits blow the 4.5-min cap on the 7-file httpx task); (3) **written predictions/journal** (the current brain records actions, not expectations — masking-task recovery after compaction is weaker). Several smaller gaps (classifier vocabulary, edit-locus anchor priors, syntax-only `check`, evidence shaping, one prompt line for the "producer question") are cheap, high-leverage fixes.

But the v6 package's *apparent* superiority is partly an artifact: its replays are scripted, two of three decks present "Container B verdicts" as if executed, its fastapi_14482 narrative is **falsified** (the two defects are ~330 lines apart, not adjacent; the task cannot pass locally due to the `inline_snapshot` dep gap), and its thinking-budget prescription (256–512) contradicts the verified corpus evidence (thinking-off halves solves; 2048 is the measured sweet spot). **Adopt the mechanisms; reject the framing and the stale config.**

## 2. Per-task results (predicted, not graded)

| Task | Track A · naive | Track B · v6 "BCF v3" | Track C · CURRENT brain |
|---|---|---|---|
| httpx_3672 (d4, 7 files, rename + lifecycle) | **FAIL** — reverts the correct `complete→reset` rename when stale visible tests go red | PASS (claimed; emulator shadow "24 passed"; scripted) | **PASS (predicted, med-high)** — executed apply lands the reference hunk; doctrine refuses revert; graded rename lands before cap; ungraded bullets truncated |
| fastapi_14463 (d1, +2/−1, aliasing) | **FAIL** — symptom dedup passes a count-only repro but fails the hidden exact per-route **title** | PASS (claimed; ~7 charged; fitted `rule_note`; impossible "one window shows the import") | **PASS (predicted, high ~0.85–0.9)** — full reference patch executed via apply (**reference_equivalent=True**); 13 charged, ~3.7 min agent, under cap |
| fastapi_14482 (d3, error masking, 4 hunks) | **FAIL** — 1/3 (only the Pydantic-only control passes); thrashes through the unchanged-error reveal | PASS* (conditional; "one read sees both" is impossible — loci ~330 lines apart; unshown second localization) | **PASS (predicted, primary branch ~65–80%)** — 22±1 charged, ~3.8 min session; False on risk branches R1 (consumer-only first edit) / R5 (two repair cycles breach cap) |

Cost scorecards (charged calls / output tokens / agent wall, [EST]):

| Task | A naive | B v6 v3 | C CURRENT |
|---|---|---|---|
| httpx_3672 | 40 / ~14,400 / ~9.6 min | ~14 / ~3,700 / ~2.5 min | 33 / ~16,600 / ~8.9 min **uncapped → 4.5-min cap binds** |
| fastapi_14463 | ~17 / ~10,500 / ~6.0 min | ~7 / ~2,100 / ~1.4 min | 13 / ~6,570 / ~3.7 min |
| fastapi_14482 | ~22 / ~10,550 / ~6.6 min | ~9 / ~2,800 / ~1.8 min | 22±1 / ~6,400 / ~3.8 min |

**Uncomfortable finding (14482):** the current brain spends about as many charged calls as naive on the masking task. Its discipline is not call-cheap — it buys **reliability per call** and halves naive's thinking bill (mechanism found once, not re-derived per reveal). v6's ~9 calls is reachable only by skipping per-edit verification. Ranking: **B cheapest-if-scripted · C cheapest-that-actually-runs · A expensive and wrong.**

## 3. Strategy divergence matrix (consolidated)

| # | Axis | v6 "BCF v3" | CURRENT shipped brain | Verdict |
|---|---|---|---|---|
| 1 | Routing | "model routes, script measures" — but replays use task-fitted `rule_note`s | deterministic `classify()` + spec demoted to "guidance, not orders"; model overrules with evidence | **Current wins on generalization** (private-repo hidden set); v6 contradicts its own design |
| 2 | Pre-flight | one emulated `bcf.py plan "<title>"` call (subcommand does not exist) | install + problem.md + spec: 3–4 calls cold, **1 call warm (0.215 s executed)** | Warm parity; current is real |
| 3 | Spec | ≤150 words pinned via output_key | ≤300 words (actual 171–219) pinned via output_key; disk canonical | Both survive compaction; current ~2× echo cost (+7–10 s) — trim-worthy |
| 4 | Expected-red | deterministic predictor + journal + ratchet + asymmetry detector | **none in code**; prompt doctrine ("statement plus mechanism is the contract") | **v6 wins — the crux gap** (decisive on httpx; ~1–3% corpus trigger) |
| 5 | Written predictions | journal records expectations | state.json records actions only | v6 wins on masking-recovery after compaction |
| 6 | Proxy tests | mandated copy+`s/old/new/` transform to /tmp | /tmp scratch allowed, repro_seed auto-extracted, not scaffolded as transform | v6 slightly better on rename tasks; tie elsewhere |
| 7 | Caller closure / topo | closure map + topological `fix_order` enforced in code | `locate` ranking only; order reasoned by model | v6 wins on multi-file renames |
| 8 | Batching | scoped `sed` over closure (~14 charged on httpx) | edit_file/apply per site (~33 charged on httpx) | **v6 wins — call count binds the cap** |
| 9 | Thinking | 256–512, A/B 0, unmeasured | 2048 (31B) / 0 (E4B); corpus: off halves solves (23 vs 50/129) | **Current wins on evidence**; A/B 1024 worth pre-registering |
| 10 | Plan tools | full tool list on every agent (avoid fatal unknown-tool) | planner: run_command + write_file only, fixed sequence | Trade-off: current fewer fatal-call chances; v6 more robust to model deviation; low-med risk either way |
| 11 | Edit machinery | claimed AST closure (async def, twin trees) | **executed** anchors/apply/strike/check/state; unique-window verification, atomic apply + syntax rollback | **Current wins decisively** — demonstrated, logged, sub-second |
| 12 | Gates | folded 1-call gate | `check` (protected paths + scratch + compile + diff-nonempty) + `state` compass, executed | Current wins; but **syntax-only** (see G6) |
| 13 | Evidence shaping | `pytest -q --tb=line -rf \| tail` | targeted `-k kw -x -q`, timeout-wrapped; no shaping | v6 free adoptable |
| 14 | Time cap | 4 min | 4.5 min + 180 s commands + 50 calls/turns; 80% force-submit rule | Current's regime changes naive's trajectory (force-submit mid-thrash) |
| 15 | Dep-gap doctrine | silent | masked-68 + "ignore pre-existing unrelated failures" + /tmp plain-assert repro | **Current wins** (14482 cannot pass locally; v6's "True" is locally impossible) |

## 4. Improvements of the CURRENT brain over v6 v3 (evidence-backed)

1. **Executed reliability vs design claims.** apply of real reference hunks rc=0 on all three tasks; full two-hunk patch on 14463 verified **reference_equivalent=True**; strike→anchors recovery executed; warm cache byte-identical at 0.215–0.217 s. v6's AST closure/expected_red/fix_order are shown, never executed (no rc/elapsed logs).
2. **General localization without a fitted router.** On 14463 the classifier's family label is wrong (state-lifecycle scores 0) yet cues+anchors still land the exact line L380 — localization rides evidence, not labels. v6's `rule_note` router is fitted per task and contradicts its own "rule router guesses 128/129" claim (our measured kind accuracy 76% / family top-2 71.3% / hit@3 96.9% refute that figure).
3. **Two-strike circuit breaker with strike exclusion** (executed: "Struck loci excluded: 1") — structurally kills the documented 51-identical-call / 75%-verbatim-retry failure classes; v6 has no equivalent executed mechanism.
4. **Compaction/nudge survival by structure:** output_key spec + disk canonical + state compass + paraphrase rule; v6's journal is similar in spirit but unexecuted.
5. **Truncation robustness (executed):** 14463's 10,095-char statement truncated to the planner's 1,500-char allowance yields an identical spec/target.
6. **Honest import handling:** 14463's missing `import copy` is found by a separate L1–12 read + unique-anchor edit; v6's "one window (370–390) shows the import" is impossible (imports at L1–30).
7. **Dep-gap / masked-68 doctrine:** structural answer to the 27-task local collection failures; v6 is silent and its 14482 "True" verdict is locally impossible.
8. **Manual fallback ladder** if the helper is unavailable; v6 depends on the pre-flight succeeding.

## 5. Regressions / gaps of the CURRENT brain (ranked, with evidence)

| ID | Gap | Evidence | Impact | Fix lever |
|---|---|---|---|---|
| G1 | **No expected-red predictor / journal / ratchet in code** — revert-avoidance is a prompt sentence | solver.md L26; bcf.py subcommands lack expected_red; httpx replay: naive reverts at the red, current's refusal is doctrine-only | **Critical on rename tasks** (httpx_3672 decisive; ~1–3% corpus but high-leverage); #1 falsification risk | A1 (E3 family) |
| G2 | **Per-site edits → call count binds the cap** on multi-file renames | httpx modeled 33 charged ≈ 5.7–8.9 min > 4.5 cap; even v3-style thinking leaves it over; v3's scoped sed ~14 fits | High on d4/d5 multi-file tasks (23 multi-file + 7 large in corpus) | A3 (new E-lever + P2) |
| G3 | **Thinking 2048 wall-clock tax on long tasks** | httpx ~12k thinking tok vs v3 ~1.8k; 14482 worst-case 20×2048/34 ≈ 20 min | Med; corpus evidence protects against going too low (off halves solves) | A8 (Y-arm A/B 1024) |
| G4 | **Classifier vocabulary gaps + dishonest fallback** | 14482: no FAMILY_PATTERNS match → no-evidence fallback prints wrong playbook (boundary-edge-case) with "medium" confidence; 14463: state-lifecycle=0; httpx: kind=feature (RCA bugfix); shapes mislabeled | Med — localization survives via cues, but wrong playbooks mislead weak models (R2 branch) | A4 (E vocab + fallback honesty) |
| G5 | **Anchor family-heuristics miss the edit locus** | httpx anchors landed init region (89/105) not `def complete` (378); 14482 target `type_` property (82) adjacent to defect (85–99) | Med — apply line-range compensates; weak models may edit the wrong locus | A5 (E1 _family_lines priors) |
| G6 | **`check` is syntax-only — PASS ≠ correct patch** | 14463: check PASS with `copy.deepcopy` but **no `import copy`** (runtime NameError); 14482: producer-only apply PASSes (TypeError/NameError at runtime) | Med — a green gate can mask an incomplete fix (the task's own lesson reflected in the machinery) | A7 (E3 semantic smoke via repro_seed) |
| G7 | **No caller-closure / topological fix_order** | bcf.py cmd_locate ranks hits; no closure graph; twin-rename order reasoned not enforced | Med on multi-file; pairs with G2 | A3 |
| G8 | **No evidence shaping** | prompts lack `-q --tb=line -rf \| tail`; naive N9-style truncated red summary | Low — free adoptable | A6 (P) |
| G9 | **Proxy-test transform not scaffolded** | /tmp allowed but no copy+rename+run guidance | Low-med on rename tasks | A9 (E25) |
| G10 | **Producer question implicit** | 14482 R1 branch: consumer-only first edit → unchanged error → possible thrash; prompt never says "grep who constructs the object" | Med on masking tasks; one-line fix | A2 (P) |
| G11 | **Spec verbosity ~2× v3** | 171–219 words vs ≤150; Steps/Rules duplicate solver.md; +~240 tok echo ≈ +7–10 s | Low | A10 (P trim) |

## 6. v6 package errors that do NOT reflect on the current brain

From the review (22 logged errors; full detail in `01-review-of-v6-research.md`):

- **v6-3's central narrative is falsified:** the two 14482 defects are ~330 lines apart (64/95 vs 419), not "adjacent lines in one read"; gold is 5 hunks in their count vs the verified 4; the task imports `inline_snapshot` → on the 27 never-pass-locally list → its "True" verdict is locally impossible.
- **Honesty regression:** v6-2/v6-3 drop the [REPLAY] tag yet present "Container B verdict" scorecards as if executed; v6-1's httpx "True" is emulator-grade (httpx is a known official-sandbox gold-fail per 756400).
- **Internal contradiction:** "model routes, no rule router" vs task-fitted `rule_note`s in both fastapi decks.
- **Misattributions:** "rule router guesses 128/129" (refuted by our measured metrics); "unknown tool fatal (deck §2/§9.2)" (actually thread 747923); "deck §9/§11 concedes frequency" (no such text in v5); 745998 quote scope wrong.
- **Stale config:** thinking 256–512 contradicts the verified 2048 sweet spot and thinking-off collapse; silent on E4B bonus, nudge-restart bug, masked-68, score noise, queue ops; cited wallclock-tuning artifact absent.

**Implication:** where v3 "looks better" on paper (call counts, one-read-both-defects, 3/3 verdicts), part of the edge is scripting/fiction, not mechanism. The genuine, adoptable edge is G1/G2/G7/G8/G9/G10.

## 7. Adoptable recommendations (ranked; lever ids map to 02b of the hardening research)

| Rank | Adoption | What | Effort | Expected value | Validation |
|---|---|---|---|---|---|
| 1 | **A1 · Expected-red predictor + asymmetry detector** (G1) | engine: grep visible tests for symbols the statement renames; emit `expected_red` lines in spec; solver labels that red "EXPECTED — do not revert"; journal the prediction | M | Decisive on rename tasks; converts prompt doctrine into structure (756433 lesson: prompt-only interventions don't move small-model reliability) | C2 rename/expected-red panel; httpx replay re-run |
| 2 | **A2 · Producer-question prompt line** (G10) | add to solver.md: "If the fix adds a parameter/config, grep who constructs the object before editing the consumer" | S | Neutralizes the main masking-task thrash branch (R1) | 14482 C2 drill; watch for `ModelField(` grep before edit #4 |
| 3 | **A3 · Scoped batch renames + caller-closure map** (G2/G7) | engine: closure map (word-bounded grep, classified callers/decoys) + topological fix_order; one scoped sed/apply batch + re-grep proof of zero old-name sites | M-L | Cuts httpx-class tasks from ~33 to ~14 charged → fits cap; enforces twin-tree order | httpx C2 timed drill; call-count delta |
| 4 | **A4 · Classifier vocabulary + honest fallback** (G4) | add `arbitrary_types\|TypeAdapter\|model_config\|ConfigDict` etc. to FAMILY_PATTERNS; when no evidence, print "no family signal" instead of a wrong playbook; audit kind/shape labels | S-M | Removes wrong-playbook compliance risk (R2); better sparse-task guidance | C1 corpus re-run (family top-2 ≥70% gate) |
| 5 | **A5 · Edit-locus anchor priors** (G5) | extend `_family_lines` priors to the 5 unpatterned families; surface candidate edit lines in spec Target | M | Anchors land edit sites, not def signatures (already the E1 lever in the tuning inventory) | C1 anchor-integrity probe |
| 6 | **A6 · Evidence shaping** (G8) | add `-q --tb=line -rf \| tail` to the verify guidance | S | Free; prevents truncated-red misjudgment | prompt lint + C2 |
| 7 | **A7 · Semantic smoke gate** (G6) | after apply/check, if repro_seed.py exists run it under timeout 10 and report pass/fail (non-blocking) | M | Catches missing-import/producer-only incomplete fixes that syntax gates pass | 14463 missing-import canary must flip to WARN |
| 8 | **A8 · Thinking A/B 1024 arm** (G3) | pre-register 31B thinking 1024 (and planner-only 0/256) vs 2048; keep E4B 0 | S | ~55–70 s/task potential on d3+; break-even if P(miss) rises <~15–20% | C6 paired win-both on masked-68 |
| 9 | **A9 · Proxy-test scaffold** (G9) | guide copy+`s/old/new/`+run of visible tests to /tmp for rename tasks | M | Confirms renames without touching real tests | httpx drill |
| 10 | **A10 · Spec trim** (G11) | dedupe Steps/Rules already in solver.md; target ~150–200 words | S | +7–10 s/task saved | C1 word-cap + echo-token measure |

**Rejected v6 prescriptions** (evidence against): across-the-board thinking 256–512 (corpus cliff; unmeasured); `max_output_tokens` 8192 default (no dependable gain over ~6k; real peaks ~3.7k); "full tool list on every agent" including graph tools (array-arg RUN-freeze risk; graph tools null p=0.69); task-fitted rule routers (overfitting; hidden = private repos); the nonexistent `plan` subcommand as a transcript.

## 8. Net assessment

- **Foundation:** keep the current brain. Its executed machinery, general localization, structural harness-survival, and dep-gap doctrine are advantages v6 does not actually demonstrate.
- **Highest-value upgrades:** A1 (expected-red in code) + A3 (batched closure renames) + A2 (producer question) — together they close the two tasks where the current brain is most exposed (httpx cap-breach + revert risk; 14482 masking thrash).
- **Predicted score impact:** on the replayed trio, current ≈ 3/3 primary-branch vs naive 0/3; the gaps threaten the *margin* (cap-breach partials, doctrine non-compliance), not the primary branch. Corpus-wide, A1 fires on ~1–3% of tasks but decisively; A3/A5 matter on the 30 multi-file/large tasks; A4/A6/A7 are broad cheap reliability.
- **Honesty:** all verdicts are predictions; the executed backbone applied reference hunks to demo machinery, not full end-to-end solves; no Gemma sampling, no grader. The canaries below are the path to real evidence.

## 9. Validation plan (what would falsify this analysis)

1. **C2 drills (local harness, real Gemma):** httpx rename/expected-red panel (measure revert rate with/without A1); 14482 masking drill (watch R1: consumer-only first edit + no producer grep); timed httpx run (does 33 charged breach 4.5 min? does A3 fit?).
2. **C1 corpus re-run after A4/A5:** family top-2 ≥70%, anchor edit-locus hit rate, kind accuracy delta.
3. **Real grader runs:** apply hidden test_patch to the replayed patches (httpx sync-tree rename; 14463 exact-equality; 14482 masked — use the /tmp plain-assert repro locally, grader on Kaggle).
4. **A/B (C6, paired win-both):** thinking 2048 vs 1024; per-site vs batched renames; spec 300 vs 150 words. Ignore single-run deltas <4 tasks/58 (noise floor).
5. **Canaries already executed that constrain overclaims:** check PASS with missing import (gate ≠ grader); state-lifecycle=0 yet correct anchors (classifier ≠ understanding); locate distractor L56 (locate ≠ always-locus); producer-only apply + green check (live DAG violation).

## 10. Honesty ledger

- **[EXECUTED]:** 36 helper steps across 3 tasks (exec-*.json), 14463 extras (full-patch reference equivalence, truncation robustness, family scores, missing-import canary), all rc=0.
- **[MODELED]:** every LLM turn in all three decks; naive trajectories (shapes from v6); verdicts and risk branches.
- **[EST]:** all token counts and wall-clock (constants: 34 tok/s decode, 1.4 s + 28.7 ms/tok fitted call latency, 10.3 s median, 60 s setup).
- **[R]:** v6 transcripts/claims; task/RCA/index facts; intel threads (750974, 755066, 746250, 747914, 756433, 756400, 754636, 754783, 745998, 747923).
- **Not run:** Gemma inference, competition grader, hidden test_patch, full end-to-end pytest solves.
