# BCF Brain — Design Justification: Why This Design Can Top Both the Main Competition and the $10k E4B Bonus

**Date:** 2026-11-11 · **Deliverable:** Task 2 design justification (workflow step 9)
**Audience:** the competition entrant (decision-maker) + paper-track reviewers
**Status of the artifact:** both submission trees are built, byte-identical in their engine, and pass the pre-flight validator with 0 errors / 0 warnings (re-verified today, Appendix A). No end-to-end GPU score for this design exists yet; every claim below is labelled by evidence class, and every unverified assumption is flagged explicitly.

**Evidence convention.** All paths are relative to the project root
`d:/stuff/ai-misc/_bsh2026/vscode_project01/46-wide_research_test_alibaba/` unless absolute.
Thread ids (e.g. 756433) refer to Kaggle discussion threads captured locally in
`scratch/bcf-2026-11-11/intel_texts/topic_<id>.md` and/or `input/kagglecomp/intel_20261111/raw_json/`.
Evidence classes used throughout:

| Tag | Meaning |
| --- | --- |
| **[M]** | MEASURED locally, reproducible from a named script/results file |
| **[P]** | PRIMARY — verbatim staff/host or competitor capture in the local corpus |
| **[S]** | SECONDARY — competitor-reported via a local digest, not re-run by us |
| **[D]** | DESIGN inference / UNVERIFIED — explicitly flagged, canary-gated |

Primary source documents (read in full for this justification):

| Short name | Path |
| --- | --- |
| architecture | `scratch/bcf-2026-11-11/design/architecture.md` (v1.0, frozen build contract) |
| empirical | `scratch/bcf-2026-11-11/design/bcf-empirical-report.md` (+ `bcf_full_results_fixed2.json`) |
| compliance | `scratch/bcf-2026-11-11/design/compliance-review.md` |
| e4b-review | `scratch/bcf-2026-11-11/design/e4b-viability-review.md` |
| integration | `scratch/bcf-2026-11-11/design/integration-report.md` |
| skill-tests | `scratch/bcf-2026-11-11/design/skill-tests.md` (+ `skill_test_results.json`) |
| taxonomy | `scratch/bcf-2026-11-11/taxonomy.md` (+ `taxonomy.json`, `rca/<iid>.json`) |
| synthesis | `scratch/bcf-2026-11-11/intel/00-synthesis.md` (24 constraints, 14 facts, 30 contradictions) |
| brief | `input/kagglecomp/intel_20261111/00-intel-brief-2026-11-11.md` (22 implications, CSV-verified LB) |
| grounding | `scratch/bcf-2026-11-11/research/00-grounding-brief.md` (rules verbatim, model specs, 50-item contested register) |
| 31B tree | `deliverables/2026-11-11-bcf-gemma4-brain/02-bcf-brain-31b/submission/` |
| E4B tree | `deliverables/2026-11-11-bcf-gemma4-brain/03-bcf-brain-e4b/submission/` |

---

## 1. Executive summary

**Thesis.** This competition is not won by raw model intelligence; it is won by *surviving the harness* and then making a small, correct edit. The local evidence corpus documents, with primary-source precision, how runs actually die: 51-call identical-edit loops (756051), server-freezing array arguments (753973), compaction that permanently deletes tool results (754783/756336), continuation nudges that restart the agent and duplicate 10–12k tokens of context (754636), and a 12-hour whole-submission kill that burns the daily slot (743063). Meanwhile the public leaderboard is a noisy best-of-N sample: the 0.29 leader has solved 17 of 58 public tasks, and identical bundles rerun 1–4 tasks lower (757588/756438). A design that structurally eliminates the documented failure classes and spends its budget on verified minimal edits is positioned to beat a field that mostly fights those failures with prompt exhortations — the exact intervention class that a controlled 11-variant study found resolved *zero* tasks on a small model (756433).

**The BCF answer in one sentence.** Move every failure-prone step that *can* be computed deterministically out of the model and into a cached, verified, compaction-immune artifact — the **spec baton** — and leave the model only the irreducible judgment (the code change), surrounded by structural guardrails that make the documented failure classes unreachable rather than merely discouraged.

**Why it can win MAIN (31B track).**

| Mechanism | Evidence | Class |
| --- | --- | --- |
| Deterministic localization hands the solver ranked targets by call 3–4 | hit@1 = hit@3 = hit@5 = 96.9% on 129 tasks; 95.3% on the non-trivial 86-task subset; gold top-1 in a synthetic 3,002-file repo | [M] empirical §5; skill-tests |
| Verified-unique edit anchors + stateful 2-strike breaker + auto-rollback editor | 458/477 anchors unique (96.0%), **0 copy-fidelity violations** after fix; 18/18 compliance probes | [M] empirical §8; compliance §6 |
| Worst-case-safe 12h budget | 31B N=120 worst case 11.17h + 30m reserve = 11.67h; expected 6–7.5h; canary-gated cap decision rule | [M] arithmetic, architecture §8; [D] setup-time assumption |
| Compaction/nudge/reasoning-drop resilience | spec lives in the solver instruction + on disk; 1-call byte-identical cache re-entry (10/10 measured); visible-text state channel | [M] empirical §9; [P] 754636/754783/744354 |
| Private-repo generalization | generic coverage-first AST ranking is the foundation; repo priors only tune weights; grep-verified zero public ids/expected strings | [M] compliance §2 notes; [P] hidden = private repos (744370) |

**Why it can win BONUS (E4B track).** The documented E4B deficit is edit *targeting and copy fidelity*, not speed: 0/31 solved at 5 min despite 97% patch submission and 1.8 min/task, wrong file in 13/31, whole-file overwrites (750974 [S]). BCF is the only design in this workspace that makes a deterministic line-range editor (`apply`, heredoc stdin, auto-rollback) the **primary** E4B editing path — exactly the intel recommendation (synthesis constraint 14 / brief implication 13) — pairs it with thinking-off + visible planning (the contested-template hedge), and runs the same byte-identical engine as the 31B track. The bonus field is thin: **no E4B empirical score exists anywhere in the 38-thread capture** (brief §2c), and the slot is near-zero-downside because private scoring is better-of-two finals (752220) and the E4B zip stays fully eligible for main prizes and the paper track (751104). **Honest ceiling:** `apply` removes the `old_string`-matching failure class but *not* the replacement-authoring class; a probe confirmed a semantically wrong but syntactically valid edit passes `apply` + `check` (e4b-review §1). The bonus case is therefore *conditional*: spend the slot only after the C5 serving canary and a replicated C6 eval show a non-zero resolve rate (e4b-review §8).

**What is verified today (2026-11-11).**

- Both trees: `validate_submission.py` → **PASS, 0 errors, 0 warnings** (fresh run, Appendix A). [M]
- Engine byte-identical across tracks: `bcf.py` sha256 `b6ac6a07…fb93cc`, `install.py` `14a9d916…3d540`, `SKILL.md` `c9621270…c82d`, `agent.yaml` identical (fresh hashes, Appendix B). [M]
- 129/129 CPU corpus runs complete, rc 0, zero failures; all C1 gates met (empirical §3). [M]
- 114/114 integrator consistency checks; 18/18 adversarial compliance probes; 9 helper defects + 1 E4B prompt trap found and fixed (integration §3; compliance §1/§6). [M]

**What is NOT verified (flagged, canary-gated).** No end-to-end agent score on either track; skill-tool injection and `skills:` path base on the official compiler; `include_contents: none` current-turn boundary; E4B thinking/serving behavior; full-repo (2,600-file) cold runtime; real setup time per task; hidden-set transfer. Each has a named canary (C0–C7, §6/§7) and a fallback. The design is *built to be measured*, and the measurement plan is part of the design.

---

## 2. The competitive landscape

### 2.1 The leaderboard is a noisy, best-retained sample (CSV-verified)

From `input/kagglecomp/intel_20261111/leaderboard-public-2026-11-11.csv`, re-verified by the briefer (brief §5):

| Score | Nov 5 | Nov 11 | Meaning |
| --- | --- | --- | --- |
| 0.29 | 1 | 1 — Yurnero (GRANDMASTER, 18 entries) | 17/58 public tasks solved |
| 0.24 | 9 | 12 | 14/58 |
| 0.22 | 66 | 81 | 13/58 |
| 0.20 | 332 | 445 | 12/58 |
| 0.18 | 760 | 949 | 11/58 |
| 0.17 | 863 | 992 | 10/58 |
| median | 0.15 | 0.15 | 9/58 |
| teams | 4,808 | 5,439 | +13.1% in six days |

- Every distinct score equals `floor(k/58)` to two decimals — **58 scored public tasks, 1 task ≈ 0.017** (brief §5, CSV-verified). [M]
- The public LB retains each team's best: 537 teams improved Nov 5→11, **0 declined** (brief §5). Published standings are therefore best-of-N samples, not expected performance. [M]
- The real mobility is into the 0.22 band (16 of 94 teams ≥0.22 jumped from ≤0.18); only 2 teams moved ≤0.18→≥0.24 (brief §5). The 0.24 "cluster" is 12 teams + the leader. [M]

### 2.2 Score noise is large relative to the gaps that matter

| Observation | Source | Class |
| --- | --- | --- |
| Sampling sigma ≈ 2 tasks/58 (±0.035); ~15% per-task flip between identical passes; ~67% of well-sampled cells flippy | synthesis fact 14 (753524) | [S]/[M] CSV |
| Two independent teams measure ~10–13% per-task flip on identical-config repeats; agreed protocol: change counts only if it wins on both runs | brief C14 (750907) | [P] |
| Unchanged 0.24 prompt-only bundle reran **0.17** (14→10 tasks); a 0.20 bundle reran .18/.17/.17/.17/.13 | brief C11 (757588/756438) | [P] |
| Identical bundles scored 0.17/0.15/0.13/0.15; identical files 0.12–0.22 | synthesis fact 14 | [S] |
| Byte-identical ZIP 0.18→0.01 (~10 tasks) — a *second, infra* noise regime (attributed unconfirmed to parser freeze) | synthesis fact 14 / contradiction 29 (750521) | [P] |

**Implication for BCF.** Single-run public deltas <4 tasks are noise (brief implication 16). Selection must use replicated local eval on a frozen, masked denominator with a win-both rule (architecture C6; synthesis constraint 19). Chasing the public LB with one-off tweaks is negative expected value; the rank-1 competitor expects "a huge final shakeup" (757626). BCF's ops plan (§7) spends the 1/day cadence on repeated runs of its own best config, not on copying public bundles.

### 2.3 What the field does wrong — the documented failure corpus

Each row is a failure mode with primary/secondary local evidence, and the structural reason prompt-only fixes fail. This is the list BCF was built against (architecture §9 maps every row to a mitigation + canary).

| # | Field failure mode | Evidence | Why prompts alone don't fix it |
| --- | --- | --- | --- |
| 1 | Verbatim-retry edit loops: 51 consecutive `edit_file` calls, 38/51 byte-identical, died at `exceeded_turns_budget` (max_turns 60) | 756051 [P]; E2B: ~75% of failed edits are verbatim retries (756433 [P]); ACI "failed edit recovery" = 23.4% of unresolved instances, recovery probability collapses with attempts (grounding §7) | "Knowing ≠ emitting": correct values in reasoning, next call malformed anyway (756051). 11 harness/config interventions resolved **zero** tasks on E2B (756433) |
| 2 | Wrong mental model of file state: intended/absent code placed in `old_string`; whole-file overwrites | 756433 [P]; E4B wrong file 13/31 + whole-file overwrites (750974 [S]) | The model cannot reliably recall live file content; compaction deletes the reads (754783) |
| 3 | Edit-commitment bottleneck: gold file opened by call 2–3 in 84% of runs, but first edit ~106s (solved) vs ~183s (failed); ~10 of 28 calls spent reading; 38% never edit; 11/41 failures opened gold but never edited | 752848/751596/749198 [P]/[S]; hard "edit by call 12" forces wrong-place edits ~40% (747980 [S]) | Prompt rules to edit earlier are "mostly ignored" (751596). Needs harness-side machinery + soft deadlines, not exhortation |
| 4 | Array-typed tool args freeze the inference server: one malformed array element with `]` loops the gemma4 parser forever, SIGTERM-proof, zeroes every remaining task; 74–85/60,000 fuzz strings hang (two local digests differ slightly); fresh victims Nov 8–9 | 753973/745138/746336 [P]; unfixed, zero staff replies (brief §3) | Submissions cannot patch the harness; no code hooks. Only schema design avoids it |
| 5 | Compaction permanently drops tool calls/results at ~14,336 tokens; overflow → empty patch in 44/44 sessions (14 after successful edits); summarizer samples at temp 1.0 regardless of config | 754783/753225/756336 [P]; ADK v2 migration refused (staff, Oct 11) | Locked host-side; the only durable channels are visible text, files, and session.state |
| 6 | Continuation nudges restart SequentialAgent from sub_agents[0]; shared-session duplication adds 10–12k tokens → premature compaction; permanent (no v2) | 754636 [P] | Any non-idempotent plan stage re-does work and corrupts output_key on every restart |
| 7 | 12h whole-submission kill; eval_config defaults = NO limit; observed runs 8.9–11.9h; a +5% local step blew a 12h run; 12B 8-min/task run blew 12h for zero | 743063/745805 staff [P]; 752017/750974 [S] | Budget must be worst-case-safe by construction, not average-case hopeful |
| 8 | Whole-file reads + restatement: read_file silently truncates at 150 lines/10k chars (754-line file read 6× never fully seen); restating a file cost 1,788 tokens/104s per incident; 76% of wall clock is pure decode | 755291 [P] | Token-lean discipline must be structural (line-bounded reads, anchors-first), not optional |
| 9 | LoRA chasing: infrastructure works but every controlled study is null-or-worse; best confirmed 0.17 (= baseline parity), rank-32 0.06; serving tax +29% time / +45% tokens | 755677/750713/751596/750961/753793 [P]/[S]; synthesis fact 10 | The tax forces budget cuts that erase any gain; no public evidence identifies a top team's method as LoRA (contradiction 21) |
| 10 | Thinking misconfiguration: disabling collapses 48→23/129; thought summaries OFF collapses to 34–35/129; `include_thoughts:false` no longer disables thinking on adk-submission ≥0.2.13 | 746250/747914 staff-confirmed [P] | Version-pinned explicit config required; folk defaults are wrong |
| 11 | Editing tests/runner configs: scorer force-resets them; 277/1,143 (24%) real fixes fail verification only due to 5 scorer conventions | HR §8.2 [P]; 757893 [S] | Tampering is structurally futile; fixes must target library code only |
| 12 | Overfitting public strings: hidden tasks come from PRIVATE repos; requests_6644 collapses leading '//' and requests_7315 later DELETES that exact collapse (it broke S3 presigned URLs) — a correct fix in one task is the bug in a later task | 744370 staff [P]; taxonomy insight 4/5 [M] | Memorized expected strings/snapshots cannot transfer; base behavior is not sacred |
| 13 | Trusting conversation memory: reasoning_content dropped between calls on public wheelhouse v31 (Nov 11 repro) despite staff "fixed" claim; scorer parity unknown | 744354 [P] | State must live outside the event stream and outside the thought channel |
| 14 | Single-run LB chasing + split-probing: best-of-N inflation 1–4 tasks; split-probing needs 240+ submissions vs ~70 cap, ban-adjacent, no staff ruling | 757588/757626 [P] | Negative expected value; robustness and private transfer win |

**The strategic read.** The 0.22–0.24 claim band is occupied by prompt-only single agents (synthesis contradiction 21: TTX no-train baselines 0.22/"0.24 i think"; Adam Johnson 0.18 without subagents/skills). The frontier is not a secret LoRA; it is reliability engineering on a hostile harness. BCF competes on exactly that axis, with measured artifacts instead of claims.

---

## 3. BCF architecture walkthrough — the baton metaphor

**Design provenance.** The architecture is the judged synthesis of a 3-architect panel (architecture §0): three independent proposals (deterministic-first, autonomy-balanced, risk-first) were scored on six dimensions (harness-contract compliance, harness-bug resilience, E4B viability, private-repo generalization, budget efficiency, implementability). Autonomy-balanced won (50/60) because it was the only proposal making a built-in deterministic line-range editor the PRIMARY E4B editing path; the final design grafts deterministic-first's engine (window-expansion anchors, stateful strike, normalized cache, incremental AST index, state compass, check gate), risk-first's safety envelope (conservative budgets, 3-tier degradation ladder, failure-mode matrix with blast radius, canary per row), and autonomy-balanced's skeleton (two trust levels, apply primary, include_contents:none, coverage-first ranking, guaranteed-non-empty spec). Every graft is normative in the frozen contract. This is a designed-and-adjudicated architecture, not an ad-hoc prompt. [M] architecture §0.

> **The deterministic spec carries the reasoning; the model carries the baton.**

In a relay, the baton is the thing that must survive every handoff intact. In BCF the baton is the **spec**: a ≤300-word, brace-free, deterministically computed fix specification. The reasoning that used to live fragilely in a model's context — *what kind of bug is this, where is it, what mechanism fixes it, how do I verify it* — is computed once by a stdlib-only Python helper (`bcf.py`), cached, and handed off verbatim. The model never re-derives the baton from memory; it reads it, runs with it, and on any restart re-reads it from disk. The model supplies only what no deterministic helper can: the actual code change.

This is a deliberate inversion of the field's default. A prompt-only agent carries its plan in conversation memory, which the harness actively destroys (compaction drops tool results, 754783; reasoning drops between calls, 744354; nudges restart the agent, 754636). BCF carries its plan in three redundant, harness-immune channels:

1. **The solver instruction** — `output_key: bcf_spec` saves the plan's final text into `session.state`, which the solver instruction interpolates as `{bcf_spec}`. The instruction is re-rendered every turn → **compaction-immune** (grounding §4 documents this exact output_key→interpolation pattern). [P]
2. **The disk** — `.git/bcf/spec.md` is canonical; the prompt says "if the interpolated copy looks garbled, trust the disk file." Git never diffs inside its own `.git`, so the baton can never pollute the patch (HR §8.1; grounding §5). [P]
3. **The filesystem state compass** — `bcf.py state` reconstructs progress (spec summary, `git diff --stat`, strikes, last check, deterministic next-action hint) from disk, never from conversation memory (architecture §3.7). [M]

### 3.1 The relay: plan → solver (both tracks)

The root is a `SequentialAgent` (`bcf_root`) with exactly two legs (31B tree `agent.yaml`, byte-identical in E4B):

```text
bcf_plan (LlmAgent, output_key: bcf_spec, include_contents: none)
   -> solver (LlmAgent, instruction interpolates {bcf_spec} + {problem_description})
```

**Leg 1 — the plan is a mechanical setup operator, NOT a problem-solver.** Its prompt (31B `prompts/bcf_plan.md`) forbids exploration, code reads, edits, and bug analysis. It runs a fixed idempotent sequence:

| Step | Action | When |
| --- | --- | --- |
| 0 | `run_command python3 .git/bcf/bcf.py spec` — re-entry probe | every entry; cache hit → echo spec verbatim, STOP (1 call) |
| 1 | `run_skill_script(skill_name="bcf-spec", script_path="scripts/install.py")` — ZERO args | only if Step 0 failed |
| 2 | `write_file .git/bcf/problem.md` — statement copied verbatim (first ~1,500 chars) | only if Step 0 failed |
| 3 | `run_command python3 .git/bcf/bcf.py spec` — compute + cache | only if Step 0 failed |

The final message is the spec stdout **verbatim** — no fences, no commentary. A guaranteed-non-empty fallback brief (`BCF-TOOLS-UNAVAILABLE. Work manually: …`) ensures `{bcf_spec}` is never a missing key even if the helper dies (architecture §6.1, graft #22). [M] prompt read.

**Leg 2 — the solver runs with the baton.** It reads the spec's numbered Steps, localizes via the spec's ranked Targets + fresh `anchors`, makes the minimal mechanism change, verifies with the spec's timeout-wrapped test command, runs `check`, reviews `git diff`, and calls `submit_patch` LAST (free, not counted). Its first action after any restart/compaction is `bcf.py state` + free `get_status` + `git diff --stat` — "your memory is the filesystem" (both `prompts/solver.md`). [M]

**Why SequentialAgent despite the intel's monolith recommendation (constraint 4).** This is a *deliberate, user-fixed hierarchy deviation* (compliance O1). The intel recommends a monolithic root because nudges restart sub_agents[0] (754636). BCF keeps the two-stage hierarchy (a user requirement) but makes the restart *harmless* instead of avoiding it: the plan is idempotent and cache-backed, so a restart costs one cache-hit call and a byte-identical echo, not a re-analysis. The mitigations were verified attack-by-attack (compliance O1: probe P1b byte-identical echo, P13 idempotent install, P10b no stale anchor after edit). A pre-validated monolithic **emergency variant B** is held as the fallback if canary C2-3 proves the fixed tree unrecoverable (architecture §10). The residual restart tax is quantified honestly in §6 (R3).

### 3.2 The skill: one engine, seven subcommands, stdlib only

`skills/bcf-spec/` contains `SKILL.md` + `scripts/install.py` + `scripts/bcf.py`, **byte-identical across tracks** (normalization N2 — no `track.txt`, no `--track` flag; track behavior lives entirely in per-track prompts + YAML). `bcf.py` is ~1,500 lines / 72.6 KB, stdlib only, no network, cwd-agnostic, idempotent, deterministic (architecture §3). [M]

| Subcommand | What it does | Why it exists (failure mode attacked) |
| --- | --- | --- |
| `spec` | classify → extract cues → index repo → rank candidates → generate anchors → discover tests → select playbook → render ≤300-word spec; cache | localization + edit-commitment bottleneck (§2.3 #3); compaction (§2.3 #5) |
| `anchors <file>` | fresh verified-unique `old_string` windows + line numbers + status (unique/absent/ambiguous); excludes struck | stale-anchor + double-apply + wrong-mental-model (§2.3 #1/#2) |
| `apply <file> <start> <end>` | line-range editor, heredoc stdin, protected-path refusal, ≤120-line cap, backup, atomic write, auto-rollback on syntax error, empty-stdin refusal | E4B old_string/copy class + whole-file overwrite (§2.3 #2); escaped-new_string residual |
| `locate <words>` | re-rank top-5 file:symbol:line merging new words with stored cues | cheap re-localization when a candidate fails |
| `strike <file>:<line>` | record failed anchor; future anchors exclude it | stateful 2-strike circuit breaker (§2.3 #1) |
| `check` | protected-path scan + revert cmds, scratch scan, compile() gate on every changed .py, diff-nonempty (incl. untracked new files) | anti-tampering + escaped-new_string + empty-patch (§2.3 #11) |
| `state` | restart compass: spec summary + diff stat + strikes + last check + deterministic next-action hint | nudge/compaction recovery (§2.3 #5/#6) |

All args are scalar positional inside one `run_command` shell string; heredocs are shell text, not tool args. **Zero array-typed parameters anywhere** on the attached surface (the parser-freeze avoidance, §2.3 #4). `install.py` takes ZERO arguments (the `run_skill_script` args array is a documented hang trigger). After install, ALL helper access is via `run_command` — the solver never calls skill tools, so its only dependency is a core registry tool (architecture §2.3/§3.0). [M]

### 3.3 The cache: nudge-idempotent by construction

`key = sha256(norm(problem) + git_HEAD + BCF_VERSION)`. Normalization (lowercase, collapse whitespace, strip emoji/URLs/fences) absorbs E4B copy drift on a re-written statement; `git HEAD` is the harness baseline commit, stable across solver edits because edits are never committed → re-entry after edits is still a cache hit. A cache hit prints the cached spec **byte-identical** in <0.5s (architecture §3.3a). Measured: 10/10 stratified tasks byte-identical second run, unchanged cache mtime, one key; probes confirmed edit-a-library-file → still hit, different statement → new key, restore → original key (empirical §9). [M]

This is what turns the SequentialAgent nudge bug from a liability into a bounded tax: every restart re-enters Step 0, gets the identical baton in one call, and overwrites `output_key` with identical content (harmless). With `include_contents: none` the plan context stays ~1.2k tokens instead of replaying the solver's 10–12k shared history (754636 duplication accelerator). [P] mechanism; [M] cache; [D] exact context-token figure.

### 3.4 Both tracks: one relay, two trust levels

The spec format is identical (N3); the **prompt** sets the trust level (architecture §6.3/§6.4):

| Aspect | 31B — *advisor* | E4B — *foreman* |
| --- | --- | --- |
| Spec authority | ranked HYPOTHESES; may overrule any candidate with a one-sentence reason; `locate` on contradiction | follow the numbered Steps in order, one action per turn, no re-planning; `locate` ONCE if target looks wrong |
| Primary editor | `edit_file` with a fresh verified-unique `old_string` (≤15 lines) | `bcf.py apply` line-range heredoc (no old_string to get wrong) |
| Fallback editor | `apply` after 2 strikes; `write_file` new/small only | `edit_file` verbatim anchor (≤10 lines); `write_file` new/<60 lines only |
| Thinking | budget 2048 + include_thoughts true (every agent) | budget 0 + include_thoughts true; one-sentence visible "Plan:" replaces the thought channel |
| Read appetite | ≤60 lines/read, ≤3 candidate reads before committing | ≤40 lines/read, ≤2 candidate files before committing |
| Commit gate | after ONE targeted read, if mechanism + lines nameable → EDIT NOW | first edit by ~90s; finalize by ~3.5 min |
| Sampling | temp 0.2 [ARM 0.0], top_p 0.95, top_k 64, max_output 6144 [ARM 8192], seed 7 | temp 0.0, top_p 0.95, top_k 64, max_output 4096, seed 7 |
| eval_config | timeout 180 / calls 50 / time 4.5 min / turns 50 | timeout 150 / calls 40 / time 4.0 min / turns 40 |

(Configs verified verbatim in both trees today; Appendix A/B.) The 31B advisor exploits the larger model's judgment; the E4B foreman removes every degree of freedom the smaller model demonstrably mishandles. The engine never changes — only the prompt and the four config files differ (integration §3 cross-track checks). [M]

### 3.5 The spec baton itself (architecture §7)

≤300 words AND ≤4,800 chars, zero curly braces (brace-free by construction + sanitized), stable section order: `# BCF spec` header (kind / family + alt / shape / confidence / repo / sparse) → `## Target` (ranked path—symbol—line) → `## Anchors` (fetch-fresh instruction) → `## Fix` (≤40-word mechanism-generic playbook) → `## Steps` (numbered work order) → `## Verify` (timeout-wrapped targeted test command) → `## Rules`. Measured: 129/129 specs ≤300 words (p50 176, max 219), max 1,561 chars, brace-free, all 7 sections (empirical §7). `old_string` is deliberately NOT in the spec — it lives in `anchors.json` and is fetched fresh at edit time, so the baton stays lean and anchors are guaranteed current (no double-copy through the LLM). [M]

The 10 mechanism playbooks (boundary-edge-case, type-introspection, state-lifecycle, infinite-loop-recursion, api-contract-violation, missing-capability, schema-generation-logic, ordering-off-by-one, compatibility-shim, docs-content-error) are generic vocabulary, NOT repo-specific, and contain zero public expected strings (architecture §3.8; taxonomy §3). Families are emitted as *hypotheses to verify*, with a runner-up and a confirm-before-editing banner when the margin <20% (anti-overfit). [M]

---

## 4. Why it wins MAIN — per-mechanism evidence

### 4.1 Localization: measured hit rates, with the honest caveat

The C1 corpus calibration ran `bcf.py spec` on **all 129 tasks** against the extracted sources, comparing `candidates.json` to the gold patch files (empirical §5; machine-readable `bcf_full_results_fixed2.json`, independently re-aggregated for this doc). [M]

| Subset | n | hit@1 | hit@3 | hit@5 |
| --- | --- | --- | --- | --- |
| All tasks | 129 | 96.9% | 96.9% | 96.9% |
| Localizable (≥1 existing gold file) | 128 | 97.7% | 97.7% | 97.7% |
| Solo-gold (gold = only non-test .py) | 43 | 100% | 100% | 100% |
| **Non-solo-gold (the honest subset)** | **86** | **95.3%** | **95.3%** | **95.3%** |
| Census-sparse | 34 | — | 97.1% | — |
| Cue-rich | 95 | — | 96.8% | — |

**Caveat, stated plainly (empirical §2).** `sources/<iid>` are *selective extractions* (patch/test files + packaging metadata), not full repos: median 4 .py files, max 30; 43/129 tasks have the gold file as the ONLY non-test .py file. **hit@k on this corpus is an upper bound.** The non-trivial 86-task subset still scores 95.3%, and the only full-repo discrimination test — a synthetic 3,002-file repo with the gold planted among ~3,000 distractors — returned **gold top-1, cold 1.063s** (skill-tests). Full-repo recall on real 2,600-file snapshots remains a C2-stage risk (§6 R10). [M] + [D]

**The 4 misses are intrinsic, not ranking bugs** (empirical §5): fastapi_15661 (pure new-file task, correctly flagged `shape: new-files`), rich_3105 (reference-only "See #3104", correctly flagged `low_info`), rich_3278 + rich_4076 (zero lexical overlap with `rich/ansi.py`; the word "ansi" appears only inside a Wikipedia URL, and URLs are never fetched by contract). Closing them would require URL fetching (forbidden) or extraction-specific hacks (overfitting). All four receive correct sparse/new-file fallback guidance. [M]

**Why this beats the field.** The field finds the gold file by call 2–3 in 84% of runs but then spends ~10 of 28 calls reading and often never edits (38% never-edit; 11/41 opened-gold-never-edited) — first edit ~106s solved vs ~183s failed (752848/751596/749198). BCF hands the solver ranked targets + verified anchors by call 3–4, and the 31B commit gate ("after ONE targeted read, if you can state the mechanism and name the lines, EDIT NOW; max 3 candidate reads") attacks the 106s-vs-183s gap *without* the hard "edit by call 12" rule that forces wrong-place edits ~40% of the time (747980). Localization is necessary but not sufficient — the field's bottleneck is edit commitment, and BCF addresses both. [P]/[S] + [M]

### 4.2 Edit reliability vs the field's #1 failure mode

The single best-documented failure class in the corpus is the edit loop (§2.3 #1/#2). BCF attacks it *structurally*, at four layers, because prompt-only recovery instructions are the exact class 756433 found ineffective (11 interventions, zero solves):

| Layer | Mechanism | Evidence it works |
| --- | --- | --- |
| Fresh verified anchors | `anchors` re-runs against CURRENT file content before EVERY edit; window-expansion to uniqueness; status unique/absent/ambiguous; excludes struck; no trailing backtick, no `<\|"\|>` delimiter | 458/477 unique (96.0%); **0 copy-fidelity violations** in final build (baseline had 2: trailing-blank-line rstrip on fastapi_15030/fastapi_9425, fixed). 17 ambiguous → deterministic apply recipe; 2 absent. [M] empirical §8/§11 |
| Stateful 2-strike breaker | two identical failed edits → `strike FILE:LINE` (recorded in state.json, not prompt memory) → fresh anchors OR apply OR write_file small; NEVER a third identical call | The 51-identical-call loop (756051) and E2B's 75% verbatim-retry class (756433) become structurally unreachable. Compliance probe P10b: no stale window after an edit. [M]/[P] |
| Deterministic line-range editor | `apply`: protected-path refusal, ≤120-line cap (anti-whole-file-overwrite), backup, atomic write, py_compile, **auto-rollback on syntax error**, empty-stdin refusal | Probes: syntax-breaking edit → auto-rollback, file byte-identical (skill-tests); empty stdin → APPLY-REFUSED, file unchanged (compliance F1/P2); protected path → refused (P4); >120 lines → refused. [M] |
| Pre-submit compile gate | `check` runs `compile()` on every changed .py (no bytecode pollution) + protected-path scan with exact revert cmds + scratch scan + diff-nonempty | Catches the escaped-`new_string` residual (exact old_string + escaped new_string writes literal escapes; write_file gets no repair — 744272) and every copy-corruption that breaks syntax. Probes P11a/P11b pass. [M]/[P] |

**Honest boundary (e4b-review §1, probe-confirmed).** The compile gate catches *syntax*, not *semantics*: a `directs`→`direct` trailing-s edit (the QAT bug class, 753277) is accepted by `apply` (exit 0) and passes `check`. Semantic correctness rests on the model running and correctly interpreting the Verify command. This is the residual that decides the score on both tracks, and it is why C2/C6 end-to-end measurement is a hard gate, not a formality (§6 R6). [M] probe + [D]

**Edit-reliability ≠ score, by itself.** The corpus is explicit that a robust editor eliminated argument-loss + edited-test loss classes but left resolved count unchanged (6/16 both arms, underpowered vs sigma≈2; synthesis contradiction 27). BCF therefore does not bet on the editor alone — it bets on the *combination* of localization + commitment machinery + reliability + budget safety, measured end-to-end. [P]

### 4.3 Budget math: worst-case-safe by construction

Global clock facts (staff-verified, synthesis fact 4): 12h = 43,200s is a WHOLE-SUBMISSION kill that burns the daily slot; hidden tasks run sequentially; public + private share the SAME run; vLLM startup IS inside the clock; sandbox setup is inside the global clock but outside the per-task agent timer; patch validation excluded; **eval_config defaults = NO limit** → all four fields are load-bearing. Observed scoring runs 8.9–11.9h; one +5% local step blew a 12h run. [P]

Conservative assumptions (architecture §8, each canary-measured): N=120 design / 129 stress; vLLM startup 600s; per-task setup+teardown 60s (sensitivity 30–90s); safety reserve 1,800s. [D] assumptions, [M] arithmetic.

| Track | Cap | Agent worst | +N×60s setup | +startup | Total | +reserve | vs 12h |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 31B (N=120) | 4.5 min (270s) | 32,400s | 7,200s | 600s | 40,200s = 11.17h | 42,000s = 11.67h | 20m headroom |
| 31B stress (N=129) | 4.5 min | 34,830s | 7,740s | 600s | 43,170s = 11.99h | — | marginal → decision rule |
| E4B (N=120) | 4.0 min (240s) | 28,800s | 7,200s | 600s | 36,600s = 10.17h | 38,400s = 10.67h | 1h20m headroom |
| E4B stress (N=129) | 4.0 min | 30,960s | 7,740s | 600s | 39,300s = 10.92h | — | 65m headroom |

**Expected case (the cap is NOT the average).** 75% of public tasks are one-line/few-lines (taxonomy §5.3: 27 one-line + 70 few-lines = 97/129). With spec+anchors by call 3–4 and soft-deadline submission, expected mean ~2.5–3.2 min (31B) / ~1.8–2.5 min (E4B, already measured 1.8 min/task at 97% submission on a different scaffold, 750974 [S]). Expected totals ≈ 6–7.5h (31B) / ~5–6.5h (E4B). [D] extrapolation from [M] taxonomy + [S] speed.

**Decision rule (canary-gated).** Measure actual setup (C2) and full-run wall clock (C6). Ship caps 4.5/4.0. Raise 31B to 5.0 ONLY if measured setup ≤35s/task AND extrapolated 120-task total ≤11.0h. Lower 31B to 4.0 if setup ≥65s/task OR N≥125 confirmed. E4B's 240s is safe through N=149 at 45s setup. Never rely on a post-12h "safe zone" (unverified anomalies) or score-unfinished-as-0 (reconsidered, never confirmed shipped). Both finals must independently finish <12h (better-of-two; error-fallback unanswered). [D] rule, [P] basis.

**Why this beats the field.** The field's budget failures are documented: 12B 8-min/task run blew 12h for zero (750974); a +5% local verification step blew a 12h run (752017); defaults = no limit silently kills runs (743063). BCF's caps are worst-case-safe at the conservative 60s setup assumption, with a measured decision rule rather than hope. No LoRA tax (+29% time / +45% tokens avoided entirely — no adapters shipped). [P]/[S]

### 4.4 Compaction, nudge, and reasoning-drop resilience

| Hostile behavior | Evidence | BCF structural answer |
| --- | --- | --- |
| Compaction drops tool results permanently at ~14,336 tokens; summarizer samples temp 1.0 | 754783/753225/756336 [P] | spec in solver instruction (re-rendered every turn, immune) + disk spec.md + paraphrase-every-result-into-one-visible-sentence rule + narrow reads (≤60/40 lines) delay the trigger; `state` recovers from filesystem. Start-of-task ≈3.5k tokens. [M] prompts |
| Context overflow → empty patch 44/44 (14 after successful edits) | 756336 [P] | small prompts + 6144/4096 output cap + grep-first + no restatement; disk state means overflow loses nothing. [M] |
| Nudges restart sub_agents[0]; 10–12k duplication | 754636 [P] | plan `include_contents: none` (~1.2k vs 10–12k); normalized cache → 1-call byte-identical re-entry; solver disk-state resume, anchors re-verify (no double-apply). [M] cache; [D] token figure |
| Text-only turn ×3 terminates session | HR §5.3 [P] | always end turns with a tool call until submit_patch; the single final text after submit is deliberate; plan's final spec text is the sanctioned stage end. [M] prompts |
| reasoning_content dropped between calls (public v31; scorer unknown) | 744354 [P] | visible-text state channel works WITH or WITHOUT thought retention; disk state canonical; never rely on remembering a thought. C4 A/B parity gate (solve-set delta ≤1 task). [M] prompts; [D] scorer parity |
| MAX_TOKENS truncates tool call mid-tag | HR gotcha #1 [P] | 6144 output vs 2048 thinking leaves ~4k visible; anchors keep payloads ≤1.5k; on truncation nudge emit next call immediately, no re-reasoning (prompt pre-agrees with nudge text). [M] |
| read_file silent 150-line/10k-char truncation → stale mental model | 755291 [P] | anchors give line ranges; always start_line+end_line; grep first >400 lines; check is_truncated; `check` catches syntax damage. [M] |

The design *assumes compaction will fire* on long tasks and loses nothing when it does. That is the difference between surviving the harness and fighting it. [M] design + [P] mechanism.

### 4.5 Generalization to private repos

Hidden tasks come from PRIVATE repos (staff, 744370: "hidden tasks validate at 100% with a gold patch"; no training-repo overlap with the test set). [P] The overfitting warning is concrete: requests_6644 collapses leading '//' and requests_7315 later DELETES that exact collapse (taxonomy insight 4). BCF's generalization posture:

- **Generic mechanism is the foundation.** Coverage-first AST ranking (distinct-term coverage dominates raw count; rarity-weighted symptom terms) works on any repo. Repo detection (fastapi/rich/requests/httpx) is a *fast path only* — it tunes weights (+8), NEVER gates the generic path; unknown repo → generic symptom→directory map (architecture §3.3d). [M]
- **Zero public leakage.** Grep-verified ZERO public task ids / expected strings / snapshots in the scripts (compliance §2 notes). Playbooks are mechanism-generic vocabulary. [M]
- **Tests-as-spec doctrine.** The statement + mechanism is the contract; base tests may encode OLD behavior flipped by the hidden test patch (requests_7315, rich_3470); never edit tests; existing tests are regression guards, not the acceptance spec (architecture §3.3f; taxonomy insight 5/8). [M]
- **Sparse/URL-only first-class path.** 33–36/129 statements are sparse depending on census rule (architecture §0 judge measurement 33; empirical §4 independent census 34, helper-flagged 36 = 17 url_only + 19 low_info); the intel's 18–23 estimate counted only the URL-only tier. Two-tier detection (url_only/low_info), generic subsystem map, repro_seed extraction, never-fetch rules. Sparse-subset hit@3 = 97.1% (empirical §5). [M]
- **OOD proxy in selection.** C6 generalization proxy: held-out task mix + FreshSWE-Py / OOD-45 (self-hosted; no competition data to third-party APIs). The public→hidden transfer failure is documented (a 50%-public agent timed out on hidden at 15 min/task; 5-min cap + thinking off scored 0.05 public — 756400), so public-only tuning is explicitly rejected. [P]/[S] + [D] proxy plan.

### 4.6 Harness-pathology avoidance (the RUN-radius killers)

These are the failures that zero a whole submission, not one task. BCF removes them by construction:

- **Zero array-typed tool args** on the attached surface; no `get_code_subgraph` (its `list[str]` arg is a parser-freeze trigger); zero-arg install; all helper args scalar positional in one shell string. The only residual array parameter is the host-injected `run_skill_script.args` (optional, cannot be removed from inside a submission) — mitigated by the zero-arg rule + C3 fuzz (compliance O5). [M] + [D]
- **No graph tools** (no end-to-end benefit, McNemar p=0.69, k0 50% vs k4 47%; <10% natural usage — 756400) and **no LoRA** (null-or-worse corpus-wide; +29%/+45% tax). [S]/[P]
- **No `thinking_level`** anywhere (maps to OpenAI reasoning_effort on the vLLM path); explicit version-pinned thinking_budget 2048/0 + include_thoughts true; never include_thoughts:false. [P]
- **Anti-tampering by construction:** `apply` refuses the full protected set; `check` scans tracked+untracked with correct revert/remove cmds; install skip-worktree defense-in-depth; fixes target library code only (the 24% scorer-convention block, 757893). [M]
- **Single QAT variant per submission**, declared on every LlmAgent; validator enforces. [M]

### 4.7 The honest MAIN bottom line

No end-to-end 31B score for this design exists locally (no GPU run yet). The case is: every documented RUN-radius killer is structurally removed; the dominant TASK-radius failure classes (localization, edit loops, compaction, nudges, budget) each have a *measured* structural mitigation; and the remaining gap (semantic fix correctness) is exactly what C2/C6 will measure before any slot is spent. The design is the best-grounded available response to the failure corpus, and it is built to be validated, not asserted. [M] + [D]

---

## 5. Why it wins BONUS — the E4B case

### 5.1 The bonus terms and the slot strategy (rules verbatim)

From the host OP (751104, Elan Markowitz [HOST], pinned, verbatim via grounding §1 / brief §2a):

- **Award:** "$10,000 to the highest-ranking submission utilizing Gemma E2B or Gemma E4B. Final scores are based on the private test set performance. Same submission rules and tie-breaking apply."
- **Eligibility:** "Submissions must explicitly use either Gemma E2B or Gemma E4B as the base model. For a submission to be eligible it must be one of the team's two selected final submissions. LoRA fine-tuning is allowed just as done for the main track."
- **Cross-track:** "Submissions eligible for the Small Model Prize remain fully eligible for general leaderboard awards and the Paper Track."
- **Two finals, better-of-two:** private score = BETTER of the two selected finals' private scores; "There's no downside to selecting a second submission" (752220 [HOST]). The error-fallback sub-question (one final errors → other scored alone?) is **never explicitly answered** (synthesis supporting facts). [P]

**Slot strategy: two finals = one 31B + one E4B.** The E4B zip competes for the bonus AND stays eligible for main prizes and the paper track (double-count). Because private scoring is better-of-two, adding a validated E4B final is *strictly additive upside* on the main prize — it cannot lower the better-of-two score. The one residual risk is the unanswered error-fallback: if the E4B final *errors* (e.g. blows 12h) and the fallback is not "score the other alone," it could jeopardize the pair. **Mitigation:** BOTH finals must independently finish <12h (the §4.3 budget math gives E4B 1h20m headroom at N=120), and the C5 serving canary clears the format path before the slot is committed. [P] rules + [D] error-fallback open.

**Bonus deadline ambiguity (757244, flagged).** The Prizes page says "Submissions must be made by November 12, 2026 at 11:59PM UTC" under the Small Model section; the host OP says main-track deadlines (Dec 2). The only substantive answer is a competitor EXPERT (Smart Manoj): "December 2. That section should be inserted above the Paper section." No staff confirmation. **Working assumption: Dec 2; safe internal milestone: Nov 12** (brief §2b; synthesis contradiction 3). Ops plan treats Nov 12 as the safe bonus-ready date. [P] ambiguity + [D] resolution.

### 5.2 The E4B deficit is targeting + copy fidelity, NOT speed

| Fact | Value | Source | Class |
| --- | --- | --- | --- |
| E4B @5min, good scaffold | 0/31 solved, 97% patch-submission, 1.8 min/task avg; wrong file 13/31; whole-file overwrites | 750974 (Gluzdov, MASTER) via prior-art §5 | [S] — different scaffold (Budget-Fit), NOT this design |
| E2B editing study | ~75% of failed edits verbatim retries; distinct failures put intended/absent code in old_string; 11 interventions resolved no task | 756433 | [P] |
| QAT trailing-s copy bug | directs→direct breaks exact-match editors; 18 cherry-targeted inputs, llama.cpp not vLLM, rules unadjudicated | 753277 | [S] — do not extrapolate to coding ability |
| Localization is NOT the small-model bottleneck | right file ~90% (750907); gold file by call 2 (751596); E2B reads right file (756433) | convergent 3 teams | [P]/[S] |
| E4B capability | 4.5B effective / 8B total, 42-layer dense, PLE; LCB v6 44.0 vs 31B 80.0 | grounding §3 (tech report verbatim) | [P] specs / [S] benchmark |
| E4B Lite-class ceiling | 16.67% (50/300) SWE-bench Lite with bash scaffold, single self-reported source, no replication | grounding §7 (ai-muninn) | [S] — different benchmark, not this task set |

**The design consequence (all research passes agree, grounding §3):** the E4B brain must compensate with deterministic skill scripts, aggressive context hygiene, smaller edits, earlier submit, and category playbooks — not raw reasoning. BCF does exactly this. The intel recommendation is explicit: "prefer line-range/heredoc editors over exact-match string editing on E4B" (synthesis constraint 14 / brief implication 13). [P]/[S] + [M] design.

### 5.3 The E4B-specific mechanisms

**(a) Thinking-off design.** E4B thinking is CONTESTED: Google's E4B card says enable_thinking=True works; HF discussion #26 on Google's own repo says the flag has NO effect on E4B/E2B (the chat template omits the thinking control token); resolution not captured (grounding §3, contested register #1). [P] both sides. BCF hedges both ways: `thinking_budget: 0` (the ONLY reliable off switch on adk-submission ≥0.2.13 — include_thoughts:false no longer disables thinking, staff-confirmed) + `include_thoughts: true` (harmless no-op at budget 0, keeps one field shape) + a **mandatory one-sentence visible "Plan:" on every message** that replaces the thought channel AND feeds the summarizer's text-only retention (architecture §2.4/§6.4). If thinking is silently on, the visible plan still works; if off, the visible plan is the reasoning. C5 observes the actual behavior. [M] config + [D] template behavior.

**(b) Transcribe-and-apply.** The plan's only model-mediated transfer is copying the statement verbatim into `problem.md` (write_file, the lowest-risk payload — two simple payloads beat one complex heredoc for E4B, graft #9). Everything downstream is deterministic: the spec is computed by bcf.py, not authored by the model. The solver's primary editor is `apply <file> <start> <end>` with replacement lines on a single-quoted heredoc — **no `old_string` to get wrong**, directly attacking the E2B/E4B "old_string from a wrong mental model" + trailing-s copy class (architecture §3.5b/§6.4). The normalized cache absorbs minor copy drift on re-entry. [M]

**(c) Copy-fidelity scaffolding.** "Copy identifiers, strings, and anchors character-for-character from tool output. Do not autocomplete words, do not fix plurals, do not normalize quotes." Anchors-before-edit REQUIRED before the first edit of any file; after EVERY edit, immediately re-read the edited range and compare against intent. Whole-file overwrite forbidden unconditionally (the measured E4B failure). `apply`'s ≤120-line cap + auto-rollback + empty-stdin refusal (compliance F1) bound the damage to TASK radius. [M] prompt + probes.

**(d) Speed headroom.** E4B is already fast (1.8 min/task measured, 750974 [S]); temp 0 = speed at equal score (755066, n=376 [P]); no thinking spend; smaller payloads (4096 output cap, ≤40-line reads). The 4.0-min cap and 40-turn backstop bind on *loops*, not slowness — E4B's failure mode is loops, so the turns backstop is the correct binding constraint (architecture §2.5). Worst-case 12h total 10.17h (N=120) leaves 1h20m headroom. [M] arithmetic + [S] speed.

**(e) Foreman trust level.** Follow the spec's numbered Steps in order, one action per turn, no re-planning; no deviation license (locate ONCE if the target looks wrong, then apply the best candidate minimally and verify). This removes the exploratory degrees of freedom the smaller model mishandles, while the deterministic spec carries the localization reasoning the model would otherwise get wrong (wrong file 13/31). [M] prompt.

### 5.4 The honest BONUS ceiling (the skeptic's finding, incorporated)

The e4b-review (skeptic pass) is part of the evidence base, and its central finding is load-bearing for an honest justification:

> **`apply` eliminates the `old_string`-matching failure class but NOT the replacement-authoring failure class.** The replacement lines are still model-authored heredoc text. The compile gate catches syntax only — a semantically wrong but syntactically valid edit passes `apply` + `check` (probe-confirmed). The spec's `## Fix` is a generic ≤40-word playbook and `## Steps` is the same six generic steps for every task; there is no task-specific fix instruction. Fix authoring — the hard half — is 100% on the model. (e4b-review §1/§3.1/§4)

Consequences, stated plainly:

- The helper invests ~1,400 of its ~1,500 lines in localization/classification/guardrails and ~0 in fix synthesis. This is the *right shape* given no code hooks are allowed and a deterministic fix synthesizer for arbitrary private repos is infeasible — but it means the ceiling is set by E4B's raw fix-authoring ability, which **no local evidence shows is sufficient**. [M] code read + [D]
- 97% patch-submission + 0/31 means E4B will happily submit confidently-wrong patches. That is a score ceiling, not a crash. The structural mitigations correctly contain the run-killing and loop classes; they cannot contain a wrong fix that compiles and submits. [S]/[M]
- Prompt-only behavioral mitigations (budget awareness, Plan-sentence discipline, copy-fidelity clause) are the *exact class* 756433 found ineffective on 2B-class editing. The structural caps/backstops are what actually bound damage. The applied E4B prompt fix (Target line = symbol's FIRST line, not the edit line; externalize the one-line delta into visible text before editing) is justified because it removes a *broken reference* and *externalizes intent*, not because "more instructions help." [P] + [M]
- **No E4B score for THIS design exists anywhere.** 0/31 is Budget-Fit, not BCF. The whole viability case is an extrapolation. The panel's "E4B viability 7–9/10" scores are design intuition, not measurement. [D]

**The gate (e4b-review §8).** Hold the E4B slot until C5 (serving canary: loads, tool calls parse, zero-arg install runs, thinking observed off/no-op, one full canary task, clean format, trailing-s probe) passes end-to-end **AND** a replicated C6 local eval (2 runs, masked denominator, win-both) shows a **non-zero, replicated resolve rate**. The crossexam target is 4–6 tasks (0.06–0.10); even 2–3 replicated solves would justify the slot in a thin field; **0 replicated solves = ship 31B-only finals posture** (architecture C5 fail clause). Two engine improvements are proposed but NOT yet applied (verified in the current build: `_family_lines` still has priors for only 5 of 10 families; the spec does not yet surface candidate edit lines) — apply both-track-synced before C6 if localization precision on real repos is limiting (e4b-review §6.1–6.2). [M] code verified + [D] gate.

### 5.5 Why the bonus is still worth the slot

The bonus field is thin and unmeasured: **no E4B empirical trajectory/score evidence exists in the entire 38-thread capture** (brief §2c); the promised daily small-model leaderboard may be stale (amunozo nudge Nov 6, no staff reply); zero confirmed end-to-end LoRA-on-E-series scores anywhere (synthesis fact 10). In a field where the best documented E4B result is 0/31 on a *different* scaffold, a structurally sound raw-base E4B entry that solves even 2–6 private tasks is plausibly competitive — and the slot is near-zero-downside via better-of-two + cross-eligibility (§5.1). The expected value is positive *conditional on the C5/C6 gates*, which is exactly how the ops plan treats it. [S]/[P] field + [D] competitiveness estimate (flagged: the 0.06–0.10 win band is a crossexam estimate, not a measurement).

---

## 6. Honest risk register

Every risk below is drawn from the local evidence, with its blast radius (RUN = zeroes remaining tasks/whole submission; TASK = zeroes one task; TAX = wasted time/tokens), mitigation, and the canary that owns it. Unverified assumptions are marked **[D]**.

| # | Risk | Evidence | Radius | Mitigation | Canary / gate | Residual |
| --- | --- | --- | --- | --- | --- | --- |
| R1 | Skill-tool injection + `skills:` path base unverified on official compiler (run_skill_script/load_skill not in HR's 9 registry tools; `../skills/bcf-spec` is config-relative) | compliance O4; grounding §5 (official documentation gap) | RUN (compile rejection) | C0 compiler canary confirms injection + scalar/zero-arg schemas; one-line fallback `skills/bcf-spec` if root-relative; T1/T2 degradation ladder means skill failure is not fatal | C0 before packaging | [D] injection is strong inference, medium confidence; scored skill precedents 0.05–0.15 exist |
| R2 | `include_contents: none` current-turn boundary + system-only request validity on pinned wheelhouse | compliance O3; grounding contested #37 | TASK/RUN (plan LLM error) | instruction self-sufficient via {problem_description}; C2-4 hard gate; fallback to `default` (accept restart tax) or variant B | C2-4 before any slot | [D] no local adk source to settle statically |
| R3 | SequentialAgent nudge restart tax (deliberate deviation from monolith constraint 4) | compliance O1; 754636 | TASK/TAX | idempotent cache-backed plan (1-call re-entry, byte-identical echo); include_contents:none (~1.2k vs 10–12k); solver disk-state resume; variant B pre-validated | C2-3 forced MAX_TOKENS restarts | [D] restart ~10–30s with 31B planner thinking 2048 (not the optimistic 5–10s); worst-case turns 31B ~40<50, E4B ~35–40 vs 40 (backstop can bind on multi-file E4B) |
| R4 | E4B thinking contested (template may ignore enable_thinking) | e4b-review O6; grounding #1 (HF#26) | TASK | budget 0 + include_thoughts true + visible Plan sentence (works either way); thinking-2048 E4B arm ready | C5 observes on/off | [D] resolution not captured |
| R5 | E4B intermittent scorer "incorrect format" on validator-passing bundles | 752128/753388/752239; e4b-review §7.4 | RUN (slot) | minimal bundle (no adapters, 10 files); validator + official compiler preflight; early canary | C5 before final slot | [S] staff-unanswered; one scored fine unchanged the day before |
| R6 | E4B fix-authoring ceiling (dominant, unmitigated); apply/check catch syntax not semantics | e4b-review §1/§3.1/§4 (probe-confirmed) | TASK (score ceiling) | C6 replicated non-zero resolve gate; engine proposals §6.1–6.2 (family line priors + candidate edit lines) before C6; hold slot if 0 replicated solves | C5 + replicated C6 | [D] no E4B score for this design exists; 0/31 is a different scaffold |
| R7 | Queue stalls 36–52h + one-pending gate + no reruns | 747519/757993/743683; brief S2/S3 | RUN (slot) | submit early in day; validated fallback bundle; monitor PENDING; escalate same-day with ids; budget for lost days not reruns | ops checklist (§7) | [P] rescore paused since Sep 28; zero staff acknowledgment |
| R8 | Score noise (sigma ≈2 tasks/58; 10–13% flip; best-of-N inflation) | 753524/757588/750907; brief C11/C14 | selection | win-both replicated selection; masked denominators; ignore single-run deltas <4 tasks; no split-probing | C6 selection protocol | [S]/[M] noise is real; private multi-run policy unanswered (754295) |
| R9 | Hidden-set transfer (private repos; public→hidden failure documented) | 756400 (50%-public agent timed out hidden; 0.05 public at 5-min thinking-off); taxonomy insight 5 | TASK | generic-first ranking; zero public strings; tests-as-spec; OOD proxy (FreshSWE-Py/OOD-45) | C6 OOD proxy | [S] single data point, strategy-critical |
| R10 | Full-repo runtime/recall unexercised (partial sources ≤30 files; 17s scan guard never triggered; discover_tests has no own deadline) | empirical §2/§12; skill-tests methodology | TASK/TAX | C2 re-measure cold spec on ≥1 full 2,600-file repo; synthetic 3,002-file gold top-1 @1.063s is the discrimination evidence | C2 | [M] upper-bound recall; [D] full-repo behavior |
| R11 | 31B worst-case 12h margin at N=129 is ~30s | compliance O7; architecture §8 | RUN | §8 decision rule (lower to 4.0 if setup ≥65s or N≥125); C2 telemetry measures real setup; do not ship 4.5 on assumption | C2/C6 wall-clock | [D] setup-time assumption 60s |
| R12 | Array-arg exposure via host-injected run_skill_script.args (cannot remove from inside submission) | compliance O5; 753973 | RUN | zero-arg rule in prompt + SKILL.md; no array branch reachable with our schemas; C3 fuzz on exact injected schemas | C3 before any bonus run | [D] hang requires malformed array element with `]`; zero-arg call safe in practice |
| R13 | Reasoning-drop parity (public v31 drops; scorer unknown) | 744354; brief S4 | TASK | visible-text state channel (retention-agnostic); disk canonical; do NOT resubmit unchanged ZIP until staff confirms scorer change | C4 A/B (delta ≤1 task) | [P] public repro; [D] scorer state |
| R14 | Bonus deadline ambiguity (Nov 12 vs Dec 2) | 757244; brief S7 | ops | working Dec 2; safe internal Nov 12; monitor for staff ruling | ops (§7) | [P] ambiguity real, 0 staff |
| R15 | strike exclusion is line-granular (expanded window containing struck line can still emit) | compliance O9 | TASK (minor) | prompt 2-strike rule + anchors re-verification backstop | — | noted for engine workstream |
| R16 | Statement copy truncated to ~1,500 chars (deep evidence lost to cue extraction) | compliance O8 | TASK (minor) | solver still gets FULL statement via {problem_description}; loss confined to deterministic cues; 3,000-char 31B arm in C6 | C6 | acceptable residual |
| R17 | api-contract-violation family top-1 weak (4/23); 3 zero-overlap + 1 new-file miss | empirical §4/§5 | TASK (minor) | top-2 (12/23) + tie banner; families are hypotheses; do not overfit further on public set | — | designed residual |
| R18 | Data policy / paper derived-data status unconfirmed | 757223/757783; synthesis constraint 16 | legal | self-host all competition data; aggregates only in paper until clarified; no third-party API transmission | ops + paper (§8) | [P] unanswered |

**Canary plan (architecture §10, cheap-first).** C0 static pre-flight + official compiler canary (CPU, minutes) → C1 bcf.py unit + 129-corpus calibration (CPU, ~1h; **DONE**, empirical) → C2 local harness smoke (8–10 canary tasks × both tracks: happy path, fallback injection, forced nudge-restart, include_contents boundary, compaction survival, circuit breaker, telemetry) → C3 parser-freeze fuzz (≥5,000 bracket-heavy strings, zero hangs) → C4 reasoning-drop parity (pinned v31, delta ≤1 task) → C5 E4B serving canary (Kaggle notebook, BEFORE a final slot) → C6 full local eval + selection (GPU, 2 repeats × both tracks, win-both, masked denominator, OOD proxy, wall-clock extrapolation) → C7 submission ops. **Emergency variant B** (monolithic single LlmAgent, plan prompt-embedded, same bcf.py/skill) is pre-validated in parallel so the hierarchy fallback never costs a slot. [M] C1 done; [D] C2–C7 pending.

---

## 7. Submission ops plan

### 7.1 Deadlines (all 23:59 UTC; grounding §1, brief §6)

| Date | Event | BCF action |
| --- | --- | --- |
| 2026-11-11 (today) | — | C0 compiler canary + C2 drills; freeze engine; reconcile any cross-track drift |
| **2026-11-12** | **Paper Track deadline** (optional $35k); safe internal bonus milestone | Submit paper (design + CPU empirical + taxonomy; §8); have a validated E4B bundle ready as the Nov-12-safe bonus posture |
| 2026-11-12 → 11-24 | iteration window | C3/C4/C5/C6; spend 1/day cadence on replicated runs of best config; monitor open staff threads |
| **2026-11-25** | **Entry + Team Merger deadline** | Lock entry; if merging, pause submissions, compute combined count (≤1/day since Sep 23), get staff answers in 756693 first (merge irreversible, score-carry unanswered) |
| 2026-11-25 → 12-01 | final selection | Replicated local eval (2 runs, fixed ~30-task set + ~106 held-out, win-both); select two finals on cross-task-mix robustness, not single-run peak |
| **2026-12-02** | **Final Submission deadline** (working bonus deadline) | Lock two finals: one 31B + one E4B; both independently <12h; re-check all open threads before locking |

### 7.2 Cadence and queue defense (synthesis constraint 20; brief implication 7)

- **1 submission/day + 1-pending limit, no cancel** (verbatim 11-11: "400 FAILED_PRECONDITION: Your team already has 1 pending submissions…"). Queue/scoring stalls 36–52h reported (refs 58167555/58169454/58168732/58168380); scoring can exceed 24h and still finish. [P]
- **Submit early in the day**; monitor PENDING; escalate same-day with submission ids in 747519/743683 (staff precedent Oct 8: timeout extension + reprocessing, latency days). [P]
- **Budget for lost days, not reruns** — rescore paused since Sep 28; no rerun commitment. Never batch final-day submissions. [P]
- **Never resubmit an unchanged ZIP hoping for a scorer-side fix** (744354 reasoning-drop; no rescores promised). [P]
- **Spend the cadence on repeated runs of YOUR best config**, not on copying public bundles (brief implication 16). [P] noise basis.

### 7.3 Validation before any slot (the gate ladder)

1. `validate_submission.py` both trees → PASS 0/0 (done today, Appendix A; re-run after every change). [M]
2. C0 official `compile_submission` canary on both trees → confirm skill injection + path base + scalar/zero-arg schemas (R1). [D] pending.
3. C2-3 forced nudge-restart (tax ≤15s, byte-identical spec, no duplicated edits) + C2-4 include_contents boundary (hard gate) (R2/R3). [D] pending.
4. C3 parser fuzz (zero hangs) before any bonus run (R12). [D] pending.
5. C5 E4B serving/format canary before committing the bonus slot (R4/R5/R6). [D] pending.
6. C2/C6 wall-clock telemetry feeding the §8 cap decision rule (R11). [D] pending.
7. C6 replicated resolve rate (win-both, masked denominator) gates promotion to a slot; E4B additionally requires non-zero replicated solves (R6). [D] pending.

### 7.4 Fallback bundle

Keep a **validated fallback bundle ready at all times**: the same tree with tighter caps (e.g. 31B 4.0 min) for queue/timeout defense, plus the pre-validated **monolithic variant B** as the hierarchy fallback if C2-3 proves the fixed SequentialAgent tree unrecoverable on the pinned wheelhouse (architecture §10; compliance O1). The fallback never costs a slot because it is validated in parallel. Both finals must independently finish <12h. [M] design + [D] variant B validation pending.

### 7.5 Runtime pin for scorer parity (brief implication 22)

Pin local runtime to the corroborated stack: wheelhouse v31 (dataset-version 19987205), vLLM 0.19.1 (parser SHA 682b2152…), swegemma 0.2.11, adk-submission 0.2.13, google-adk 1.36.1, Python 3.12.13, 4×L4 TP4 bf16 max_model_len 32768, parser gemma4. Add a reasoning-field-survival check (tokenize repro) to local validation. Assume enable_sandbox_testing=True but keep verification targeted and time-bounded. [P] corroborated stack; [D] exact pins never staff-confirmed (757782).

---

## 8. Paper-track angle (deadline Nov 12 — tomorrow)

The Paper Track ($35k, optional) deadline is **2026-11-12 23:59 UTC** (grounding §1). The E4B bonus submission stays fully eligible for the Paper Track (751104 cross-track clause). What is novel and publishable from this work, grounded in local artifacts:

### 8.1 Novel contributions

| Contribution | What is new | Local evidence |
| --- | --- | --- |
| **Deterministic spec baton** | Externalize the planning reasoning into a cached, brace-free, compaction-immune artifact passed plan→solver via output_key→instruction + disk, instead of carrying it in fragile conversation memory. A concrete, measured alternative to prompt-only agents under a hostile harness. | architecture §3.3/§7; empirical §7 (129/129 specs ≤300 words, brace-free) + §9 (cache 10/10 byte-identical); grounding §4 (output_key pattern) |
| **Nudge-idempotent planning** | Turn the SequentialAgent restart bug (754636) from a liability into a bounded tax: normalized cache key sha256(norm(problem)+git_HEAD+BCF_VERSION), byte-identical echo, 1-call re-entry, include_contents:none context isolation. | architecture §3.3a/§6.1; empirical §9 (edit-invariance + drift-absorption probes); compliance O1 (attack-by-attack verification) |
| **Edit-fidelity scaffolding for sub-5B models** | A line-range editor (apply) with auto-rollback + stateful 2-strike breaker + verified-unique anchors + compile gate, measured on a 129-task corpus and a synthetic 3,002-file repo; CPU-cheap E2B-funnel-style edit replay. Contrasts with the 11 null prompt interventions (756433). | empirical §8 (96.0% unique, 0 violations); skill-tests (behavioral + synthetic); compliance §1 (F1 empty-stdin, probes); e4b-review (honest semantic-ceiling probe) |
| **Taxonomy + RCA resource** | 129 tasks, 9 kinds, 10 cross-repo mechanism families, 40 normalized subcategories, difficulty/edit-shape distributions; temporal coupling (requests_6644/7315 opposite-fix pair), kind≠is_bug (5 bugs hide in non-bugfix kinds), 75% small-edit dominance. A reproducible classification + localization benchmark. | taxonomy.md/.json; rca/<iid>.json (15 analyst files, 0 field diffs); 01-task1-dataset-classification-rootcause.md (418 KB); empirical C1 driver + results JSON |
| **Harness pathology catalog + structural mitigations** | A systems-paper contribution: 24 design constraints and a failure-mode matrix with blast radius (RUN/TASK/TAX), each tied to primary-source thread evidence and a canary. | synthesis §3; architecture §9; compliance §3/§4 (constraint + implication coverage) |
| **Evaluation hygiene under noise** | Masked denominators (68/129 strictly valid), mutation-style sanity checks (14.7% of planted broken fixes escape), resolved-as-upper-bound, win-both selection under sigma≈2 tasks. | brief §4b/§4c (756400/757893); architecture C6; synthesis constraint 18/19/22 |

### 8.2 What can be claimed honestly by Nov 12

- **Design + CPU empirical results are ready now**: the architecture, the 129-task C1 calibration (localization, anchors, classification, cache, runtime), the synthetic-repo discrimination test, the compliance probe battery, and the taxonomy resource. These are reproducible from named scripts (Appendix M). [M]
- **End-to-end agent scores are NOT ready** (no GPU run). The paper should present the design + deterministic-helper measurements + failure-mode analysis, with end-to-end evaluation as the immediate next step (C2/C6), rather than claim a resolve rate it does not have. This is the honest, defensible posture. [D]
- **Mutation-style sanity checks for any correctness claim** (brief implication 20): harness "resolved" is an upper bound (14.7% mutant escape; inverted booleans/off-by-one weak). Keep explicit error-path tests. [S]

### 8.3 Data-policy constraints on the paper (flagged)

Until §4.b (757783) and Rule 2.4.b (757223) are answered: **publish aggregates only** (derived-data status unconfirmed); self-host all competition-data processing; do NOT transmit task rows/snapshots/patches/harness code to third-party hosted APIs (synthesis constraint 16; brief implication 3). Winner obligations are Apache-2.0/commercial-use compatible (grounding §1). The taxonomy/RCA resource publication must respect this — aggregate distributions and mechanism descriptions are safe; raw task content redistribution is not cleared. [P] unanswered + [D] derived-data status.

---

## 9. Verification evidence appendix

### Appendix A — Fresh validator outputs (re-run 2026-11-11 for this document)

Command: `python -I scratch/bcf-2026-11-11/validate_submission.py <tree>` (PyYAML bootstrapped from `scratch/bcf-2026-11-11/pylibs`).

31B (exit 0):

```text
Submission: D:\stuff\ai-misc\_bsh2026\vscode_project01\46-wide_research_test_alibaba\deliverables\2026-11-11-bcf-gemma4-brain\02-bcf-brain-31b\submission
Size: 0.09 MB unpacked, 10 files
RESULT: PASS (0 errors, 0 warnings)
```

E4B (exit 0):

```text
Submission: D:\stuff\ai-misc\_bsh2026\vscode_project01\46-wide_research_test_alibaba\deliverables\2026-11-11-bcf-gemma4-brain\03-bcf-brain-e4b\submission
Size: 0.09 MB unpacked, 10 files
RESULT: PASS (0 errors, 0 warnings)
```

Both trees: 10 files, ~0.09 MB unpacked (≪ 3 GiB cap), all extensions whitelisted (.yaml/.md/.py), no symlinks, exactly one root config. [M]

### Appendix B — Cross-track byte identity (fresh sha256, 2026-11-11)

| File | sha256 (both tracks identical) | Bytes |
| --- | --- | --- |
| `skills/bcf-spec/scripts/bcf.py` | `b6ac6a072f2b045352d07fc149f7b9eed7d24913bfd938c779311607bcfb93cc` | 72,626 |
| `skills/bcf-spec/scripts/install.py` | `14a9d91618406dafee594932a53466a20581ff736a7b559a5de64e902533d540` | 4,123 |
| `skills/bcf-spec/SKILL.md` | `c9621270807be3d1c04e3a85eb9f95a65e790f8e60e515de6fe62132ea54c82d` | 4,625 |
| `agent.yaml` | `eb36a73b70aacb30faea1172690ff22889055857300a3a7b2568384f28b0bd3a` | 267 |

Per-track differing (as designed): `sub_agents/*.yaml` (model line only), `configs/sampling.yaml`, `eval_config.yaml`, `prompts/bcf_plan.md`, `prompts/solver.md`. [M]

**Build-lineage reconciliation (paper hygiene).** The integration report (18:25) recorded `bcf.py` at 62,733 bytes / sha `7b709bb5…`; the compliance review (18:46) recorded its post-fix sha `ac52167f…`; the empirical report (18:52) recorded the final sha `b6ac6a07…`. The **current shipped build is `b6ac6a07…` (72,626 bytes)**, verified today to (a) match the empirical report's final measured build, (b) contain all compliance fixes (`read_stdin_bounded` at line 164, `_sandbox_workspace_probe` at 189, `APPLY-REFUSED: empty replacement` at 1440, `confidence: partial-` at 1313; install.py sandbox probe + honest error envelope + skip-worktree), and (c) be byte-identical across tracks. The e4b-review §5.C blocking cross-track divergence (a moving 31B engine target during that pass) is **resolved**: today's hashes are identical. The integration report's 62,733-byte inventory is stale relative to the final build; the empirical report + this fresh hash check are authoritative. [M]

**Verified config values (read today).** 31B sampling: temp 0.2 / top_p 0.95 / top_k 64 / max_output 6144 / seed 7 / thinking_budget 2048 / include_thoughts true. E4B sampling: temp 0.0 / top_p 0.95 / top_k 64 / max_output 4096 / seed 7 / thinking_budget 0 / include_thoughts true. 31B eval: timeout 180 / calls 50 / time 4.5 / turns 50. E4B eval: timeout 150 / calls 40 / time 4.0 / turns 40. No `thinking_level`, no forbidden fields. E4B plan prompt carries the F4 fix (Plan sentence bound to the first tool-call message, no text-only message); E4B solver carries the Target-line clarification (symbol's FIRST line, externalize the one-line delta). [M]

### Appendix C — C1 empirical metrics (baseline → final, 129/129 runs; JSON-verified)

Source: empirical §3; independently re-aggregated from `bcf_full_results_fixed2.json` (label `fixed2`, bcf sha `b6ac6a07…`, 129 rows) for this document. [M]

| Metric | C1 gate | Baseline | Final | Status |
| --- | --- | --- | --- | --- |
| Tasks completed (rc 0, no exception) | — | 129/129 | 129/129 | PASS |
| Degraded runs (rc 2 / partial) | — | 0 / 0 | 0 / 0 | — |
| Kind accuracy | reported | 72.1% | 76.0% (98/129) | improved |
| Family top-1 agreement | reported | 44.2% | 56.6% (73/129) | improved |
| Family top-2 agreement | ≥70% | 62.0% | 71.3% (92/129) | FAIL → PASS |
| is_bug agreement | reported | 81.4% | 83.7% (108/129) | improved |
| edit_shape agreement | reported | 48.8% | 51.2% (66/129) | improved |
| Localization hit@1 (all / localizable) | ≥55% | 96.9% / 97.7% | 96.9% / 97.7% | PASS |
| Localization hit@3 (all / localizable) | ≥80% | 96.9% / 97.7% | 96.9% / 97.7% | PASS |
| Localization hit@5 (all / localizable) | ≥80% | 96.9% / 97.7% | 96.9% / 97.7% | PASS |
| hit@3 sparse subset (34 census-sparse) | ≥50% | 97.1% | 97.1% | PASS |
| hit@3 cue-rich subset (95) | ≥80% | 96.8% | 96.8% | PASS |
| hit@3 non-solo-gold subset (86) | — | 95.3% | 95.3% | — |
| Cold spec runtime p50 / p95 / max | ≤8s (guard 20s) | 0.219 / 0.347 / 0.797s | 0.219 / 0.266 / 0.625s | PASS |
| Warm spec runtime max (10-sample) | <0.5s | 0.250s | 0.235s | PASS |
| `anchors` CLI runtime p95 | ≤1s | 0.290s | 0.219s | PASS |
| Spec ≤300 words | hard cap | 129/129 (max 219) | 129/129 (max 219) | PASS |
| Spec ≤4,800 chars stdout | hard cap | 129/129 (max 1,561) | 129/129 (max 1,561) | PASS |
| Spec brace-free + all 7 sections | hard | 129/129 | 129/129 | PASS |
| Anchor uniqueness rate | ≥90% | 96.0% (458/477) | 96.0% (458/477) | PASS |
| Anchor uniqueness violations (independent re-count) | 0 | 2 | 0 | FAIL → PASS |
| Cache: byte-identical second run | 10/10 | 10/10 | 10/10 | PASS |
| Failures (crash/timeout/violation) | 0 | 2 | 0 | FAIL → PASS |

JSON cross-check (this document): `n_ok=129`, `n_fatal=0`, `n_degraded_rc2=0`, `failures=[]`, `anchor_violation_tasks=[]`, `hit3_all=96.9`, `hit3_multi_file=95.3`, `hit3_sparse=97.1`, `family_top2_accuracy=71.3`, `kind_accuracy=76.0`, `anchor_uniqueness_rate=96.0`, `runtime_cold_max=0.625`, `warm_max=0.235`, `warm_byte_identical=10`, `spec_words_max=219`, `track_trees_identical={SKILL.md:true, bcf.py:true, install.py:true}`, `bcf_sha256=b6ac6a07…`. All match the report. [M]

### Appendix D — Localization subsets and the four intrinsic misses

| Subset | n | hit@1 | hit@3 | hit@5 |
| --- | --- | --- | --- | --- |
| All tasks | 129 | 96.9% | 96.9% | 96.9% |
| Localizable (≥1 existing gold file) | 128 | 97.7% | 97.7% | 97.7% |
| Solo-gold (gold = only non-test .py) | 43 | 100% | 100% | 100% |
| Non-solo-gold | 86 | 95.3% | 95.3% | 95.3% |
| Census-sparse | 34 | — | 97.1% | — |
| Cue-rich | 95 | — | 96.8% | — |

hit@1 = hit@3 = hit@5: when the gold file is found it is always rank 1 (path/coverage scoring is decisive on this corpus); no task was rescued by ranks 2–5. [M]

| Miss | Cause | Correct fallback emitted |
| --- | --- | --- |
| fastapi_15661 | pure new-file task (scripts/prepare_release.py absent at base; 0 .py in source) | `shape: new-files` + "mirror the nearest sibling" |
| rich_3105 | reference-only statement ("Fix #3104 … See #3104" + PR template); zero extractable cues | `sparse: low_info`, confidence low, "No strong candidate → locate" |
| rich_3278 | statement vocabulary has zero lexical overlap with rich/ansi.py ("ansi" only inside a Wikipedia URL; URLs never fetched) | sparse/locate fallback |
| rich_4076 | "preserve newlines" + issue URL; rich/ansi.py contains neither word | sparse/locate fallback |

Corpus validity caveat (empirical §2): sources are selective extractions (min/p50/max .py per source = 0/4/30; full-repo file counts 74–2,673; max files scanned by bcf in any run = 18). hit@k and runtime are upper bounds; the 17s scan guard / exit-2 partial path was never exercised at this corpus size. [M]

### Appendix E — Runtime (wall clock, includes interpreter startup)

| Measurement | p50 | p95 | Max | Gate |
| --- | --- | --- | --- | --- |
| Cold `spec` (129 tasks, final) | 0.219s | 0.266s | 0.625s | ≤8s target / 20s guard |
| `anchors` CLI (129 runs, final) | 0.172s | 0.219s | 0.313s | ≤1s |
| Warm `spec` (10-sample, final) | 0.203s | — | 0.235s | <0.5s |

Synthetic full-repo discrimination test (skill-tests): 3,002-file repo (2,971 stubs + gold), cold spec 1.063s, warm 0.172s, no partial scan, exit 0, **gold (richlike/cells.py) rank top-1**. The scan uses a single case-insensitive presence regex to skip lowercasing/counting/ast.parse for non-matching files; only matching files are AST-parsed and cached keyed (size, mtime_ns). Windows Defender first-access scanning inflates the very first read (pre-warmed for the timed run); the Linux scoring container (2 vCPU, no AV) should be faster. [M]

### Appendix F — Cache behavior (10-task stratified sample + probes)

Second `spec` run per task: byte-identical stdout, cache spec.md mtime unchanged, exactly one cache key, rc 0. All 10 tasks (fastapi_11194/11355/12942, httpx_3672, requests_6589/6592/6629, rich_2725/2943/3006) cold 0.187–0.266s, warm 0.172–0.235s, byte-identical, cache hit, <0.5s. Probes on fastapi_11194: appended a comment to the top candidate library file → still a cache hit (HEAD unchanged; file restored byte-exact); different statement text → new cache key; original statement restored → original key hit, byte-identical spec. Warm ≈ cold on this corpus because cold scans are only ~0.1s of work — the cache dividend grows with repo size. [M] empirical §9.

### Appendix G — Anchor integrity and the fixes applied

477 anchors emitted across the top-2 files of all 129 tasks: **458 unique (96.0%)**, 17 ambiguous (empty old_string + deterministic apply line-range recipe — the designed fallback), 2 absent. Independent re-count of every `status: unique` window against the live file: **0 violations** in the final build (occurrences == 1, no trailing backtick, no `<|"|>` delimiter, JSON ↔ CLI copy fidelity). Baseline had 2 copy-fidelity violations (fastapi_15030 routing.py:963-965; fastapi_9425 dependencies/utils.py:264-266) — both windows end in a blank line; anchors.json was correct but the CLI stdout lost the trailing blank line to emit()'s global rstrip(). Fixed by adding a closing prose line so a code window is never the output tail. [M] empirical §8/§11.

Engine fixes applied to both tracks (kept byte-identical): (1) emit() stdout-cap off-by-one (reserve marker+newline, cap-16); (2) anchors CLI copy-fidelity closing line; (3) rarity_weights() case bug (CamelCase/quoted-literal cues got df=0 → inflated IDF; path df case-sensitive) — no hit@k regression after fix. Classification gate fixes (generic mechanisms only, no task ids/expected strings/snapshots): PR-template boilerplate cleaning, specificity-weighted pattern scoring, code-span exclusion for verb-driven labels, "fix support" guard, generic vocabulary additions, deterministic tie-break + kind-conditioned fallback, include_docs broadened + persisted (caught and fixed the fastapi_15023 regression in the intermediate run). Verification loop: baseline(129) → fixes → intermediate(129, exposed regression) → fixes → final(129, all gates green). [M] empirical §11.

### Appendix H — Classification (final, vs taxonomy.json ground truth)

| Gold family | n | Top-1 | Top-2 |
| --- | --- | --- | --- |
| missing-capability | 33 | 22 | 25 |
| boundary-edge-case | 24 | 18 | 21 |
| api-contract-violation | 23 | 4 | 12 |
| type-introspection | 15 | 9 | 11 |
| state-lifecycle | 14 | 6 | 9 |
| schema-generation-logic | 7 | 4 | 5 |
| compatibility-shim | 6 | 5 | 6 |
| infinite-loop-recursion | 3 | 3 | 3 |
| ordering-off-by-one | 3 | 1 | 1 |
| docs-content-error | 1 | 1 | 1 |
| **Total** | **129** | **73 (56.6%)** | **92 (71.3%)** |

Residual weakness: api-contract-violation top-1 4/23 (its vocabulary — should/must/expected/behavior — is deliberately generic discourse; concrete mechanism words legitimately outscore it); top-2 recovers 12/23. Families are hypotheses by contract; the spec carries top + alt with a confirm-before-editing banner when margin <20%. Confidence distribution: high 77, medium 31, low 21. Sparse flags: url_only 17, low_info 19, no 93. Kind accuracy by gold kind: bugfix 87.2% (86), feature 65.0% (20), dependency-compat 100% (3), deprecation/docs 66.7% (3 each), dx/refactor 25.0% (4 each), security 0.0% (3), performance 33.3% (3). [M] empirical §4.

### Appendix I — Adversarial compliance probe battery (18/18 PASS) and defects fixed

Source: compliance §1/§6; driver `scratch/bcf-2026-11-11/_compliance/probe_bcf.py` (throwaway git repos). [M]

| Probe | What it asserts | Result |
| --- | --- | --- |
| P1/P1b | cold/warm spec + byte-identical cache + brace-free | PASS |
| P2 | empty-stdin apply refused (no silent range deletion) | PASS (post-F1) |
| P3 | syntax-breaking apply → auto-rollback | PASS |
| P4 | protected-path apply refused | PASS |
| P5 | new-file-only fix → CHECK: PASS | PASS (post-F2) |
| P6 | state sees untracked work → correct next-action | PASS (post-F2) |
| P7 | empty statement → clean error, no hang | PASS |
| P8 | both test conventions (test_*.py / *_test.py) discovered | PASS (post-F7) |
| P9 | no off-repo install from skill cwd | PASS (post-F3) |
| P10/P10b | anchors unique + post-edit re-verify (no stale window) | PASS |
| P11a/P11b | syntax + protected check gates | PASS |
| P12 | proper heredoc apply regression | PASS |
| P13 | install repo-cwd/subdir idempotence | PASS |
| P14 | partial-marker plumbing | PASS (post-F5) |

Defects found and FIXED (applied to both trees, skill bytes kept identical): F1 CRITICAL apply empty-stdin silent deletion; F2 MAJOR check/state failed new-file-only fixes (46/129 public tasks create new files); F3 MAJOR install claimed success into a non-repo cwd (subprocess sandbox); F4 MAJOR E4B planner "Plan:" sentence could become the captured output_key (text-only trap); F5 MINOR partial spec exit 2 wrapped usable output in CommandError; F6 MINOR unbounded stdin read could hang to command timeout (read_stdin_bounded 10s); F7 MINOR test discovery missed private-repo conventions; F8 MINOR untracked protected file revert cmd + scratch depth; F9 concurrent engine fixes preserved + re-mirrored. [M]

### Appendix J — Integrator consistency checks (114/114) and brace audit

Source: integration §3; script `scratch/bcf-2026-11-11/integrator_checks.py`; log `scratch/bcf-2026-11-11/_progress/integrator-checks.log` (tail verified today: "SUMMARY: 114 checks, 0 FAIL"). Covers root shape, model ids, output_key wiring, include_contents, interpolation vars, tool surfaces, !include resolution, skills resolution, sampling/eval exact values, brace audit, compile gate (3.12.10 AND 3.13.15), stdlib-only imports, install zero-arg contract, SKILL.md frontmatter, bcf.py contract markers, track prompt deltas, fallback brief. [M]

Brace audit: inside the two submission trees there are exactly SIX brace pairs, all sanctioned placeholders — 31B bcf_plan.md `{problem_description}`; 31B solver.md `{bcf_spec}` + `{problem_description}`; E4B bcf_plan.md `{problem_description}`; E4B solver.md `{bcf_spec}` + `{problem_description}`. Both SKILL.md files: ZERO braces. All YAML: ZERO braces (block style). No `{hints}` (empty 129/129), no thinking_level, no get_code_subgraph anywhere. [M] integration §3.1.

### Appendix K — Skill-author behavioral + contract tests

Source: skill-tests.md; driver `design/skill_test_driver.py`; results `design/skill_test_results.json`. 12-task diverse corpus: spec caps 12/12, max words 203, cache byte-identical 12/12, warm <0.5s 12/12 (max 0.203s), family top-2 11/12 = 92%, mean top-3 file recall 0.948 / top-5 0.974, anchors unique 11/11. Behavioral tests (rich_4006 / requests_7502 work copies) all passed: apply valid edit OK; apply syntax-breaking → auto-rollback (file byte-identical); apply protected → refused; apply >120-line → refused; check clean tree → FAIL (empty diff); check after edit → PASS; check planted syntax error → FAIL + SYNTAX file:line; check planted protected edit → FAIL + revert cmd; strike recorded + anchors exclude; locate returns hits; state NEXT hint 520 chars; spec via stdin persists problem.md. Cache contract tests (fastapi_14361): edit tracked file (no commit) → byte-identical cache hit; drifted statement (upper-case + whitespace + extra URL) → normalized key absorbs → hit; different problem → different key. cwd-agnosticism + install tests passed; py_compile clean on 3.12.10 and 3.13.15; SKILL.md frontmatter name bcf-spec (8 chars ≤64), description 285 chars ≤1024, 0 braces, 76 lines. [M]

Known limitations (honest): rich_3942 family miss (54-char ambiguous statement, low confidence flagged); httpx_3672 top-5 cap (7 gold files, top-3 recall 0.43 / top-5 0.71 — expected for multi-file under the top-5 cap); fastapi_14361 symbol precision (gold _remap vs sibling _replace_refs on a 96-char statement; file correct, anchors hit $ref loci); partial-source recall is an upper bound. [M]

### Appendix L — Budget math (worst case, every task hits its cap)

| Track | Cap | Agent worst | +N×60s | +startup | Total | +reserve | vs 12h |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 31B (N=120) | 270s | 32,400s | 7,200s | 600s | 40,200s = 11.17h | 42,000s = 11.67h | 20m headroom |
| 31B stress (N=129) | 270s | 34,830s | 7,740s | 600s | 43,170s = 11.99h | — | marginal → decision rule |
| E4B (N=120) | 240s | 28,800s | 7,200s | 600s | 36,600s = 10.17h | 38,400s = 10.67h | 1h20m headroom |
| E4B stress (N=129) | 240s | 30,960s | 7,740s | 600s | 39,300s = 10.92h | — | 65m headroom |

Assumptions: N=120 design / 129 stress (58 public ×2 ≈116–120; never average denominators); vLLM startup 600s (staff "inside clock"); per-task setup+teardown 60s (outside agent timer; sensitivity 30–90s); safety reserve 1,800s. Expected mean ~2.5–3.2 min (31B) / ~1.8–2.5 min (E4B) → expected totals ~6–7.5h / ~5–6.5h. Decision rule: raise 31B to 5.0 only if setup ≤35s AND extrapolated ≤11.0h; lower to 4.0 if setup ≥65s OR N≥125; E4B 240s safe through N=149 at 45s setup. [M] arithmetic (architecture §8); [D] setup assumption.

### Appendix M — Reproduction

```bash
# Pre-flight validator (both trees) — Appendix A
cd d:/stuff/ai-misc/_bsh2026/vscode_project01/46-wide_research_test_alibaba
python -I scratch/bcf-2026-11-11/validate_submission.py deliverables/2026-11-11-bcf-gemma4-brain/02-bcf-brain-31b/submission
python -I scratch/bcf-2026-11-11/validate_submission.py deliverables/2026-11-11-bcf-gemma4-brain/03-bcf-brain-e4b/submission

# C1 corpus calibration (129 tasks) — Appendices C-H
cd scratch/bcf-2026-11-11/design
python -I -X utf8 test_bcf_full.py --label baseline   # pre-fix bcf.py (sha 7b709bb5…)
python -I -X utf8 test_bcf_full.py --label fixed2     # final bcf.py  (sha b6ac6a07…)

# Skill-author behavioral + synthetic-repo battery — Appendix K
py -3.12 -I -X utf8 design/skill_test_driver.py

# Adversarial compliance probes — Appendix I
python -I scratch/bcf-2026-11-11/_compliance/probe_bcf.py

# Integrator consistency checks — Appendix J
python -I scratch/bcf-2026-11-11/integrator_checks.py
```

### Appendix N — Evidence index (claim → source → class)

| Claim | Source | Class |
| --- | --- | --- |
| Leader 0.29 = 17/58; 0.24×12; 0.22×81; 5,439 teams; median 0.15; floor(k/58) | brief §5; leaderboard-public-2026-11-11.csv | [M] CSV |
| Score noise sigma≈2 tasks; 0.24→0.17 rerun; 10–13% flip; win-both | synthesis fact 14; brief C11/C14 (757588/756438/750907) | [P]/[S] |
| 51-call edit loop; E2B 75% verbatim retry; 11 null interventions | 756051; 756433 | [P] |
| Array-arg parser freeze; 74–85/60,000 fuzz hangs; unfixed Nov 8–9 | 753973/745138; brief C2 | [P] |
| Compaction 14,336; overflow empty patch 44/44; summarizer temp 1.0 | 754783/753225/756336 | [P] |
| Nudge restart sub_agents[0]; 10–12k duplication; permanent | 754636 | [P] |
| 12h whole-submission kill; defaults no limit; runs 8.9–11.9h | 743063/745805 staff | [P] |
| Thinking off 48→23; summaries off 34–35; 2k tied 4k; include_thoughts:false no longer disables | 746250/747914 | [P] |
| E4B 0/31, 1.8 min/task, 97% submission, wrong file 13/31 | 750974 via prior-art §5 | [S] |
| QAT trailing-s copy bug (cherry-targeted, llama.cpp) | 753277 | [S] |
| E4B thinking contested (HF#26) | grounding §3 / contested #1 | [P] both sides |
| E4B 4.5B effective/8B total, 42 layers, PLE; LCB 44.0 vs 80.0 | grounding §3 (tech report) | [P]/[S] |
| E4B Lite 16.67% (single source) | grounding §7 (ai-muninn) | [S] |
| LoRA null-or-worse; +29%/+45% tax; 0.17 parity / 0.06 rank-32 | synthesis fact 10; 755677 | [P]/[S] |
| Edit commitment 106s vs 183s; gold by call 2–3 84%; hard call-12 ~40% wrong | 752848/751596/747980 | [P]/[S] |
| Prose > examples 31%→5% malformed; read_file 150-line truncation | 745143; 755291 | [P] |
| Scorer conventions block 24% (277/1,143); 2 never-resolvable tasks | 757893 | [S] |
| 68/129 valid; mutation escape 14.7%; graph p=0.69; transfer 0.05 | 756400 | [S]/[P] |
| Hidden = private repos; 100% gold validation | 744370 staff | [P] |
| Two finals better-of-two; cross-eligibility; bonus terms | 752220; 751104 | [P] |
| Bonus deadline Nov12/Dec2 ambiguity | 757244 | [P] |
| Queue 36–52h; one-pending gate; rescore paused | 747519/757993/743683 | [P] |
| Reasoning-drop public v31 repro; scorer unknown | 744354 | [P] |
| 129 tasks; 75% one-line/few-lines; 10 families; 6644/7315 pair; kind≠is_bug | taxonomy.md/.json; rca/ | [M] |
| Localization 96.9% / non-solo 95.3% / sparse 97.1%; anchors 96.0% unique 0 violations; cache 10/10; cold p50 0.219s | empirical; bcf_full_results_fixed2.json | [M] |
| Synthetic 3,002-file gold top-1 @1.063s; behavioral tests | skill-tests; skill_test_results.json | [M] |
| Validator 0/0 both trees; 114 checks; 18/18 probes; 6 sanctioned braces | integration; compliance; fresh run today | [M] |
| Engine byte-identical b6ac6a07; all compliance fixes present | fresh sha256 + grep today | [M] |
| apply/check catch syntax not semantics (trailing-s probe) | e4b-review §1 | [M] probe |
| No end-to-end score for this design (either track) | e4b-review §2; no GPU run | [D] |
| Skill injection / path base / include_contents boundary / E4B serving | compliance O3/O4; grounding §5 | [D] canary-gated |

---

*End of design justification. Every quantitative claim is traceable to a named local file or captured thread; every unverified assumption is tagged [D] and assigned a canary. The design is built to be measured before a slot is spent — that discipline, not hype, is the argument.*