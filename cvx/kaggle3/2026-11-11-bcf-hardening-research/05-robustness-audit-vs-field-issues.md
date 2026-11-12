# BCF Robustness Audit vs Field-Reported Issues

**Date:** 2026-11-11 · **Auditor role:** robustness auditor (hardening workstream L7) · **LOCAL ONLY — no web research.**
**Scope:** the two CURRENT BCF submission trees audited issue-by-issue against every failure other teams reported on the
competition discussion board, with graceful-handling verdicts, minimal safe fixes applied, and ranked recommendations.

**Trees audited (read in full, all 10 files each):**
- `31B/` = `d:/stuff/ai-misc/_bsh2026/vscode_project01/46-wide_research_test_alibaba/deliverables/2026-11-11-bcf-gemma4-brain/02-bcf-brain-31b/submission/`
- `E4B/` = `d:/stuff/ai-misc/_bsh2026/vscode_project01/46-wide_research_test_alibaba/deliverables/2026-11-11-bcf-gemma4-brain/03-bcf-brain-e4b/submission/`

All `file:line` citations below are relative to `31B/` unless prefixed `E4B/`. The skill files
(`skills/bcf-spec/SKILL.md`, `scripts/bcf.py`, `scripts/install.py`) are **byte-identical across tracks** (architecture N2);
only the two prompts, two sub-agent YAMLs, `configs/sampling.yaml`, and `eval_config.yaml` differ per track.

**Registers read in full:** `scratch/bcf-2026-11-11/intel/00-synthesis.md` (24 constraints + 30 contradictions),
`harness-bugs.md`, `skills-lora.md`, `solvability-scoring.md`, `budget-sampling.md`, `prior-art.md`;
`input/kagglecomp/intel_20261111/00-intel-brief-2026-11-11.md` (§3 bug-fix table, §6 implications);
`input/kagglecomp/intel_20261031/00-intel-brief-2026-10-31.md` (deltas + corrections; the tasking's
`intel_20261105/00-intel-brief-2026-10-31.md` path resolves to this file);
`input/kagglecomp/kagglecomp_data_package/HARNESS_README.md` (§§5.3, 7.2, 8, 10 — the contract, cited HR).
**Prior reviews verified, not trusted:** `design/architecture.md` (C0–C7 canaries), `design/compliance-review.md`
(F1–F9 fixes), `design/e4b-viability-review.md` (§5 applied / §6 proposed). Every claimed fix was re-checked against the
shipped bytes and re-probed empirically (§4 below).

---

## 1. Executive verdict

**The BCF design is structurally robust against the field's run-killing failure classes, and two real code defects in the
shipped edit-reliability engine were found and fixed this pass.** The architecture correctly neutralizes the highest-EV
hazards by construction rather than by prompt: zero array-typed tool arguments (the vLLM gemma4 parser server-freeze class),
a single QAT variant per tree, all four `eval_config.yaml` budget fields explicit against the 12 h whole-submission kill,
compaction-proof state (spec-in-instruction + `.git/bcf/` disk state + `state` compass), a deterministic line-range editor
with auto-rollback, and a pre-submit compile/protected-path gate. LoRA, graph tools, 12B, and split-probing are excluded by
design, removing whole issue families.

**Two clear defects were found in the shipped `bcf.py` and FIXED (both tracks, byte-identical):**
1. **CRITICAL — the 2-strike circuit breaker crashed.** `gen_anchors` built a *set of strike dicts*
   (`struck = {s for s in strikes ...}`), raising `TypeError: unhashable type: 'dict'` the moment any strike existed for the
   file. The exact recovery path the design relies on — `strike` → `anchors` for a different locus — returned a `BCF-ERROR`
   envelope and forced the manual fallback, undermining the core mitigation for threads 756051 / 747519 / 756433.
   No prior probe exercised anchors-after-strike, so the compliance review's "18/18 PASS" missed it.
2. **MAJOR — anchors output could truncate inside a verbatim `old_string` window.** `cmd_anchors` relied on `emit()`'s blind
   2,000-char cap; on long-line files a window was cut mid-line (`...value = call\n...[truncated]`). A model copying that cut
   window as `old_string` gets a guaranteed `edit_file` failure and a retry-loop trigger — the very 756051/744272
   copy-fidelity class the design fights. Reproduced empirically (outlen 2000, marker present, window cut).

Both fixes are minimal, contract-preserving, and verified: **both trees `validate_submission.py` PASS (0 errors / 0 warnings,
10 files, ~0.09 MB)**; skill sha256 identical across tracks (`33629118…c80f`); **18/18 compliance probes + 14/14 new audit
probes PASS**; real-task stdin smoke (`rich_3471`, URL-only) PASS; E4B mirror functionally re-tested.

**Coverage counts (§2 matrix, 70 rows):** **HANDLED 36 · PARTIAL 20 · GAP 1 · N-A-by-design 13.**
(The 7 LoRA rows F1–F7 are a single "no adapters shipped" design decision listed separately for traceability; collapsing them
gives 64 unique issues: 36 / 20 / 1 / 7.) The single GAP is a corpus gap (threads 750496/751959 never body-captured — no local
content to audit against), not a submission defect. The 20 PARTIALs are dominated by (a) prompt-only behavioral mitigations
where field evidence shows prompt-only is weak on small models, (b) scorer-side unknowns that can only be canary-gated, and
(c) the deliberate SequentialAgent deviation from synthesis constraint S4 (user-fixed hierarchy).

**Top residual risks (ranked, §5/§7):**
1. **E4B fix-authoring ceiling** — `apply` removes the `old_string`-match class but the replacement is still model-authored;
   the compile gate is syntax-only (probe A1: a literal-`\n` corruption passes `apply`+`check`). No E4B score for THIS design
   exists anywhere. Gate the bonus slot on C5 + replicated C6 (e4b-viability-review §1/§7).
2. **SequentialAgent nudge restart tax (O1)** — user-fixed hierarchy deviates from S4; mitigations verified but each restart
   spends ~10–30 s of the 270 s cap and shared turns. C2-3 is a hard pre-slot gate; keep monolithic variant B pre-validated.
3. **31B N=129 worst-case margin ~30 s (O7)** — 4.5-min caps are safe at N=120 (11.17 h) but marginal at N=129 (11.99 h).
   C2 telemetry must measure real setup time before shipping 4.5-min caps.
4. **Unverified scorer boundaries** — skill-tool injection / `skills:` path base (O4), `include_contents:none` current-turn /
   system-only request validity (O3), E4B intermittent "incorrect format" (752128), `--reasoning-config` presence (745059).
   All canary-gated (C0/C2-4/C5); none fixable from inside the submission.
5. **Semantic escape / scratch-name residuals** — the compile gate cannot catch syntactically-valid literal escapes (B4), and
   the scratch scan is name-pattern-based so an arbitrary untracked `.py` enters the patch unflagged (probe A2). Documented
   as recommendations, not silently changed (tuning decisions).

**Posture:** ship the 31B main run; **hold the E4B bonus slot** until C5 serving canary + replicated C6 show a non-zero
resolve rate. Both finals must independently finish < 12 h (better-of-two private scoring; error-fallback unanswered). Do not
spend a slot resubmitting an unchanged ZIP hoping for a scorer-side reasoning fix (744354 parity unknown).

---

## 2. Coverage matrix

**Verdict rubric.** `HANDLED` = structural code/config eliminates or bounds the failure class (prompt reinforces; residual
bounded). `PARTIAL` = mitigation present but material residual remains, OR mitigation is prompt-only where field evidence
shows prompt-only is weak, OR an unverified boundary is canary-gated. `GAP` = no handling in shipped artifacts.
`N-A-by-design` = a design choice removes exposure entirely. **Blast radius:** RUN = zeroes remaining tasks / whole
submission / burns a slot; TASK = zeroes one task; TAX = wasted time/tokens. **Handling:** STRUCTURAL (code/config) vs
PROMPT (instruction rule). **Scope:** sub = submission tree; local = local-eval protocol; ops = submission operations;
scorer = organizer-side (no submission fix possible). Canary ids map to architecture §10 (C0–C7, §6 below).

### A. Run-killing serving / parser bugs

| # | Issue (threads) | Mechanism | Radius | BCF handling (file:line) | Verdict | Residual risk | Canary |
|---|---|---|---|---|---|---|---|
| A1 | gemma4 array-arg parser infinite loop (753973/745138/746336) | bare array element containing `]` without `<\|"\|>` delimiter never advances `_parse_gemma4_array`; freezes API event loop; SIGTERM-proof; 600 s client timeout never fires | RUN | STRUCTURAL: 6 scalar-arg core tools only (`31B/sub_agents/solver.yaml:9-15`); no graph tools (`get_code_subgraph` list[str] absent); zero-arg install (`install.py:1-8`); `run_skill_script` never under `tools:`; all helper args scalar positionals in one `run_command` string (`bcf.py:1711-1735`). PROMPT: "No array-shaped tool arguments" (`solver.md:42`) | HANDLED | Host-injected `run_skill_script.args` optional array schema cannot be removed from inside a submission (O5); zero-arg call is safe in practice; bracket-heavy issue text is data not args | C3 fuzz |
| A2 | `run_skill_script` args array hang (746336/753973) | same parser bug via the skill-tool `args` array; 2 freezes/~830 skill-agent tasks; 26.7 GB OOM | RUN | STRUCTURAL: install takes ZERO args (`install.py:78-109`); PROMPT: "never pass an args field" (`bcf_plan.md:12`, `SKILL.md:23-27`) | HANDLED | same O5 host schema; C3 must fuzz the exact injected schemas | C3 |
| A3 | thought-channel tool-call drop, non-streaming (753521) | vLLM 0.19–0.23 returns a tool call emitted before `<\|channel\|>` closes entirely as reasoning; call never runs; silent nudge | TASK/TAX | PROMPT: generic nudge recovery + turn discipline (`solver.md:34`); disk-state resume (`solver.md:5-7`). No specific structural mitigation | PARTIAL | Uncorroborated single report (−3 score); ~1% of runs; symptom (nudge burned) covered by state resume but no formatting guard | C3/C4 local non-streaming repro (rec.) |

### B. Edit serialization / reliability

| # | Issue (threads) | Mechanism | Radius | BCF handling (file:line) | Verdict | Residual risk | Canary |
|---|---|---|---|---|---|---|---|
| B1 | edit_file backtick-swallow serialization loop (756051/747519) | string closed with backtick swallows next key; source line promoted to JSON key; 51 identical resends → exceeded_turns_budget | TASK | STRUCTURAL: anchors never end in backtick / contain DELIM (`bcf.py:996-1003`); stateful `strike` (`bcf.py:1541-1562`) + fresh anchors + `apply` fallback; **FIXED strike crash** (`bcf.py:1016`) + **FIXED window truncation** (`bcf.py:1363-1404`). PROMPT: 2-strike, "NEVER a third identical call" (`solver.md:16-18`) | PARTIAL | Breaker is prompt-initiated (model must call `strike`); a non-anchor `edit_file` payload can still loop; `max_turns` 50/40 backstop bounds damage to TASK | C2-6 |
| B2 | edit_file old_string loss ~28% (756607) | Kai: affected calls fail 93% vs 11%; one-line prompt fix 4.5%→1.2%; mechanism UNDISCLOSED | TASK | STRUCTURAL: edit-time anchor re-verification against live content (`bcf.py:1006-1091`, status unique/absent/ambiguous); PROMPT: copy VERBATIM from fresh anchors, never from memory (`solver.md:12`) | PARTIAL | Known stale/absent-old_string class covered; Kai's specific mechanism undisclosed → coverage unconfirmable; their fix LOWERED public LB | C1/C2 |
| B3 | double-JSON-encoded tool results (744272) | tool results JSON-escaped; model copies escapes into old_string → "not found"; 39/299 failures | TASK | STRUCTURAL: anchors read the LIVE file (`bcf.py:1010-1011`) so old_string is byte-exact, bypassing the escape-copy channel entirely; harness now single-level (fixed 09-30) | HANDLED | new_string is still model-authored (see B4); one-level escaping assumed | C1 |
| B4 | escaped new_string residual + write_file no-repair (744272 Nov-8) | exact old_string + escaped new_string writes literal escapes; write_file content gets no repair | TASK | STRUCTURAL: `check` compile gate on every changed .py (`bcf.py:1597-1606`); `apply` syntax gate (`bcf.py:1476-1481`). PROMPT: "literal backslash-n … means corruption — re-read and repair via apply" (`solver.md:14`) | PARTIAL | **Probe A1: a literal `\n` inside a string literal is syntactically VALID → passes apply+check.** Compile gate is syntax-only; semantic escapes undetected; write_file small/new files still exposed | C2-6 |
| B5 | E2B verbatim-retry edit failures (756433) | ~75% of failed edits verbatim-repeat an earlier failed call; wrong mental model of file state; 11 interventions resolved nothing | TASK | STRUCTURAL: E4B PRIMARY editor `apply` (no old_string to match) (`E4B/solver.md:30-38`, `bcf.py:1432-1499`); strike + auto-rollback. PROMPT: strict breaker (`E4B/solver.md:49-55`) | PARTIAL | Prompt-only recovery is the exact class 756433 found ineffective; `apply` removes the match step but replacement authoring remains model-mediated | C2-6/C5 |
| B6 | E4B wrong-file / whole-file overwrite (750974) | E4B edits wrong file 13/31; sometimes overwrites whole files; 0/31 solved | TASK | STRUCTURAL: `apply` ≤120-line cap (`bcf.py:1451-1453`), protected-path refusal (`bcf.py:1440-1442`), coverage-first ranking (`bcf.py:907-941`). PROMPT: "Whole-file overwrite: forbidden unconditionally" (`E4B/solver.md:41`) | HANDLED | Structural bounds hold; fix-authoring targeting is the residual ceiling (e4b review §1) | C5/C6 |
| B7 | edit_file truncated `<\|tool_call>` tag (HR §10.1 / MAX_TOKENS) | large thought + large edit hits max_output_tokens; tag cut before closing | TAX | STRUCTURAL: output 6144/4096 vs thinking 2048/0 leaves visible headroom (`configs/sampling.yaml:4,7`); anchors ≤15 lines (`solver.md:12`). PROMPT: split large edits smaller (`solver.md:34`) | HANDLED | Large heredoc apply payload could still truncate; prompt splits | C2 telemetry |

### C. Context / compaction / turns / reasoning

| # | Issue (threads) | Mechanism | Radius | BCF handling (file:line) | Verdict | Residual risk | Canary |
|---|---|---|---|---|---|---|---|
| C1 | compaction drops tool calls/results @14,336 (754783/756336) | `LlmEventSummarizer` reads only part.text; function_call/response dropped; last-5 events kept; permanent (ADK v2 refused) | TASK | STRUCTURAL: spec via `output_key`→solver instruction (re-rendered every turn, immune) (`sub_agents/bcf_plan.yaml:6`, `solver.yaml:5`); `.git/bcf/` disk state; `state` compass (`bcf.py:1643-1690`); narrow reads. PROMPT: paraphrase EVERY result into one visible sentence (`solver.md:30`) | HANDLED | Paraphrase is prompt-only (E4B compliance unmeasured); disk state is the canonical backstop | C2-5 |
| C2 | compaction summary sampled temp 1.0/0.95/64 (753225) | summary LlmRequest carries no sampling config; Gemma defaults; same in ADK 1.39.1 | TAX | STRUCTURAL: disk state canonical; summary treated as lossy hint, never acted on alone (`bcf.py:1643-1690`, `solver.md:5-7`) | HANDLED | Summary entropy uncontrollable; design does not rely on it | C2-5 |
| C3 | context overflow loses patch 44/44 (744692) | ContextWindowExceededError caught by generic except → skips fallback git-diff capture; empty patch even after edits | TASK | STRUCTURAL: ~3.5k start prompt, narrow reads, output caps, compaction fires at 14,336 before 32,768 overflow. PROMPT: submit at 80% time (`solver.md:38`) | PARTIAL | Overflow BEFORE submit still zeroes the task (harness fallback skips overflow); probability reduced, not eliminated | C2-5 |
| C4 | SequentialAgent nudge restarts sub_agents[0] (754636) | non-submit turn exit injects nudge into NEW run_async on root; SequentialAgent restarts at stage 1; include_contents:none re-runs blind; shared-session duplication | TASK/TAX | STRUCTURAL: plan `include_contents:none` (`bcf_plan.yaml:7`); normalized cache `sha256(norm(problem)+HEAD+VERSION)` (`bcf.py:280-282`); byte-identical spec echo; Step 0 1-call re-entry (`bcf_plan.md:7-8`); solver disk resume. **User-fixed hierarchy** (architecture §10 variant B fallback) | PARTIAL | Deliberate S4 deviation (O1); restart tax ~10–30 s + shared turns; up to 3 nudges; variant B must stay pre-validated | C2-3 (hard gate) |
| C5 | text-only turn termination (3 nudges) (HR §5.3/756336) | a plain text reply ends the session after 3 consecutive nudges | TASK | PROMPT: "ALWAYS end turns with a tool call until submit_patch" (`solver.md:34`); plan always ends with spec text (`bcf_plan.md:28`); E4B Plan-sentence bound to first tool-call message, no text-only message (`E4B/bcf_plan.md:7-12`, compliance F4) | HANDLED | Prompt-only; E4B compliance unmeasured; plan's internal final text is not a harness nudge (SequentialAgent runs both stages in one run_async) | C2 |
| C6 | reasoning_content dropped between tool calls (744354) | public vLLM v31 reads `reasoning` not `reasoning_content` (chat_utils.py:1512); thought omitted; scorer parity UNKNOWN | TASK | STRUCTURAL: visible-text state channel + disk state work with OR without thought retention (`bcf.py:1643-1690`). PROMPT: "thoughts may drop between calls — restate critical state visibly" (`solver.md:42`); E4B visible Plan (`E4B/solver.md:8`) | HANDLED | Retention-agnostic by design; do NOT resubmit unchanged ZIP until staff confirms scorer change | C4 A/B |
| C7 | MAX_TOKENS truncation nudges (HR §5.3) | finish_reason MAX_TOKENS/LENGTH → nudge to emit next call | TAX | STRUCTURAL: output headroom (B7). PROMPT: pre-agrees with nudge text — "no re-reasoning — emit the next tool call immediately" (`solver.md:34`) | HANDLED | — | C2 |
| C8 | read_file 150-line truncation re-read trap (755291) | silent 150-line/10k-char cap; 754-line file read 6× never fully seen; 1,152 lines fetched twice | TASK | STRUCTURAL: anchors give line ranges (`bcf.py:1343-1404`); locate gives match lines. PROMPT: start_line/end_line, ≤60/40 lines, grep first >400, check is_truncated (`solver.md:11`, `E4B/solver.md:21-24`) | HANDLED | Prompt compliance; anchors/locate reduce need for full reads | C2 telemetry |
| C9 | include_contents:none current-turn / system-only request (O3) | unverified whether ADK 1.36 passes current user msg under none; whether system-only messages render through Gemma template | TASK | STRUCTURAL: plan instruction self-sufficient via `{problem_description}` (harness state, HR §5.1) (`bcf_plan.yaml:5,7`, `bcf_plan.md:36`) | PARTIAL | Unverified on pinned wheelhouse; if template requires a user turn every task fails at plan (outside failure ladder); HARD gate | C2-4 (hard gate) |

### D. Budgets / 12 h / thinking config

| # | Issue (threads) | Mechanism | Radius | BCF handling (file:line) | Verdict | Residual risk | Canary |
|---|---|---|---|---|---|---|---|
| D1 | 12 h whole-submission kill (752017/743063/745805/756622) | sequential hidden tasks; public+private same run; vLLM startup inside clock; defaults = NO limit; overrun errors whole submission + burns slot | RUN | STRUCTURAL: all four eval fields explicit, caps 4.5/4.0 min (`eval_config.yaml:1-5`); worst-case 11.17 h (31B N=120) / 10.17 h (E4B) (architecture §8). PROMPT: 50%/80% soft deadlines, submit partial (`solver.md:38`) | HANDLED | O7: N=129 stress 11.99 h (~30 s margin); §8 decision rule lowers to 4.0 if setup ≥65 s or N≥125 | C6 extrapolation |
| D2 | timeout_seconds bounds grading pytest / hang tasks (748443/745805) | single command timeout also caps grading; 3 no-patch tasks hang to cap | TASK | STRUCTURAL: timeout 180/150 in 150–300 band (`eval_config.yaml:2`); repros `timeout 60`/`timeout 10`-wrapped (`bcf.py:1135-1140,1208-1210`) | HANDLED | Every design command ≤60 s by construction (3× margin) | C2 |
| D3 | thinking_budget/seed not transmitted (744566) | v25 dropped budget+seed; FIXED v28+ (participant-verified) | TASK | STRUCTURAL: explicit `seed: 7` + `thinking_budget` in sampling.yaml (`configs/sampling.yaml:5,7`); transmits on v28+ | HANDLED | Scorer parity not re-verified by tester; pin wheelhouse | C0/C5 |
| D4 | include_thoughts:false no longer disables thinking (747914) | v29/v30 runner default 4096 merged; budget checked before include_thoughts; STAFF-confirmed intended | TASK | STRUCTURAL: `thinking_budget: 2048`/`0` explicit, `include_thoughts: true`, NEVER false, no `thinking_level` (`configs/sampling.yaml:6-8`; validator warns on thinking_level) | HANDLED | E4B budget 0 is the only reliable off switch; correctly used | C0 |
| D5 | --reasoning-config 422 / transformers backend (745059) | thinking_token_budget set but reasoning_config not configured → 24/24 instant fail; transformers serve 422 → NoneType → "Sandbox execution error, 0 LLM calls" | RUN | STRUCTURAL: targets vLLM scorer path; E4B budget 0 removes both fields end-to-end. 31B 2048 requires server `--reasoning-config` | PARTIAL | Scorer `--reasoning-config` presence unconfirmed (11-05 exec summary asserts yes, no staff); transformers backend not used by scorer | C5/C2 |
| D6 | skill budget starvation / no eval_config (750887/750350/748168) | skill setup+script time debits shared clock; no eval yaml → timeout/no score; ~4.5 min half-timeout threshold | RUN | STRUCTURAL: eval_config present (D1); fast idempotent setup ≤3 plan calls (`bcf_plan.md:7-16`); 3-tier degradation ladder (architecture §9.1); install <0.2 s re-entry (`install.py:92-93`) | HANDLED | Setup time must be measured (C2); bodies of 750887/750350 never captured (addressed by proxy) | C2/C6 |
| D7 | get_status budget warnings ignored (755289 E14) | behavioral prohibitions largely ineffective; budget_warning ignored | TAX | PROMPT: get_status free at start/after edit/before check (`solver.md:38`); harness auto budget_warning at ≤10 remaining (HR §6) | PARTIAL | Prompt-only; E4B weak (755289); structural caps are the real backstop | C2 |
| D8 | 38% never-edit / edit-commitment bottleneck (749198/752848/751596) | gold file opened by call 2–3 (84%) but first edit 106 s solved vs 183 s failed; prompt rules to edit earlier "mostly ignored" | TASK | STRUCTURAL: spec delivers ranked target + anchors by call 3–4 (`bcf.py:1254-1336`). PROMPT: commit-after-one-read gate, max 3 candidate reads (`solver.md:20-22`); soft deadlines NOT hard call-12 | PARTIAL | Commit gate is prompt-only (the ignored class); structural spec target is the lever; first-edit time must be measured | C2 first-edit telemetry |

### E. Skills / serving / E4B format

| # | Issue (threads) | Mechanism | Radius | BCF handling (file:line) | Verdict | Residual risk | Canary |
|---|---|---|---|---|---|---|---|
| E1 | skills scored 0.00 "do skills still work?" (750887/750350) | documented zeros track budget/timeout/parser-hang, NOT a broken skill mechanism; scored precedents 0.05/0.10/0.13/0.15 | RUN | STRUCTURAL: see D6 (budgets) + A1/A2 (no array args) + E3 (cwd). Skills load and score per 748168/744272/755172 | HANDLED | No staff confirmation of skill health; bodies never captured; canary cheaply | C0/C2 |
| E2 | skill-tool injection / skills: path base (O4) | run_skill_script/load_skill not in HR's 9 registry tools; relies on compiler auto-injection; `../skills` file-relative vs root-relative unknown | RUN | STRUCTURAL: `skills: ../skills/bcf-spec` file-relative (`bcf_plan.yaml:13-14`), matches validator + official sample !include convention; PROMPT: load_skill-first hedge (`bcf_plan.md:12`). One-line fallback to `skills/bcf-spec` | PARTIAL | Official compiler resolution unverified; if root-relative, `../` escapes root → compile rejection (RUN); C0 hard gate | C0 compiler canary |
| E3 | skill scripts hard-coded /workspace / cwd (747923) | subprocess sandbox = temp repo; ADK chdirs into temp skill copy; first robust-edit "silently did nothing on Kaggle" | TASK | STRUCTURAL: 4-step root ladder + subprocess-sandbox probe (`bcf.py:100-133,189-214`); install honest error when no root (`install.py:47-70,84-87`, compliance F3); never hard-codes /workspace as only option | HANDLED | Ambiguous concurrent sandboxes → None → manual fallback (safe) | C1 cwd probes |
| E4 | "First call X" setup skipped (747923) | 31B skipped prompt setup instruction 11/16; needs structural setup | TAX | STRUCTURAL: plan fixed sequence with Step 0 probe (`bcf_plan.md:5-16`) — structural, not a bare prompt instruction; idempotent install | HANDLED | E4B foreman compliance unmeasured; Step 0 is the first action | C2 |
| E5 | skill scripts can't reach code-graph data (751560) | open feature request; skill scripts cannot access graph/embedding data | n/a | N-A-by-design: BCF needs no graph data; localization is AST+coverage-first in-sandbox (`bcf.py:761-941`) | N-A-by-design | none | — |
| E6 | E4B intermittent "incorrect format" (752128) | scorer-side scoring error on validator-passing bundles; one scored fine unchanged the day before | RUN(slot) | STRUCTURAL: minimal bundle (no adapters, 10 files, ~0.09 MB); validator + official compiler preflight. ops: early canary | PARTIAL | Scorer-side; no submission fix; only mitigation is C5 canary + 31B-only fallback posture | C5/C7 |
| E7 | E4B thinking template no-op (HF#26) | E4B chat template may ignore enable_thinking; contested | TASK | STRUCTURAL: `thinking_budget: 0` + `include_thoughts: true` (`E4B/configs/sampling.yaml:6-8`). PROMPT: visible "Plan:" sentence replaces thought channel (`E4B/solver.md:8`) | HANDLED | Hedge works whether thinking on or off; if template ignores budget 0, 4096 output allowance shared → truncation risk (C5 observes) | C5 |
| E8 | E4B trailing-s copy bug (753277) | QAT E4B drops trailing 's' (directs→direct); breaks exact-match editors; per_layer_model_proj ~1/65 scale; SVD repair rules UNADJUDICATED | TASK | STRUCTURAL: `apply` primary (no old_string to miscopy) (`E4B/solver.md:30`); anchors read live file (`bcf.py:1010`). PROMPT: copy character-for-character, don't fix plurals (`E4B/solver.md:46-47`); post-edit re-read (`E4B/solver.md:42-44`) | PARTIAL | Replacement text still model-authored (probe A1-class); compile gate syntax-only; SVD repair NOT shipped (rules open 756792); cherry-targeted evidence, llama.cpp not vLLM | C5 copy probe |
| E9 | warm-pool workspace wipe (HR §4.1) | /workspace + /tmp completely wiped between tasks; container returned to pool | TASK | STRUCTURAL: install once per task; idempotent within task (`install.py:92-93`); `.git/bcf/` state per-task; Step 0 probe handles missing helper (`bcf_plan.md:7-8`) | HANDLED | Within-task state persists across nudges (wipe is between tasks only) | C2 |
| E10 | enable_sandbox_testing during scoring unknown (757564) | default True per README/code; scorer value unknown | TASK | PROMPT: targeted, time-bounded repo tests (assume True) (`solver.md:26`); never bare pytest/full suites | HANDLED | If False, pytest masked → inline-assertion fallback still works via run_command | C2 |

### F. LoRA — all N-A-by-design (no adapters shipped; `adapters/` absent in both trees)

| # | Issue (threads) | Mechanism | Radius | BCF handling | Verdict | Residual / gate if attempted | Canary |
|---|---|---|---|---|---|---|---|
| F1 | LoRA zero-score / timeout (755677) | Massaron 0.00 with adapter vs 0.18 base; community-resolved as timeout/budget; rank-32 0.06; 0.17 parity at 6 min/2048 | RUN | No adapters; raw base both tracks (architecture §1) | N-A-by-design | If attempted: 5–6 min cap + thinking 2048; triage timeout vs loading; require demonstrated local gain | — |
| F2 | LoRA latency tax +29% time / +45% tokens (755677/749191) | serving tax forces budget cuts that erase gains; 8-min×120 > 12 h | RUN | No adapters → no tax | N-A-by-design | Budget +29%/+45% if attempted | — |
| F3 | KV collapse old wheelhouse (744331/749528) | max_loras 8/rank 128 prealloc → KV 46,048→7,600; >7.6k prompts hang; FIXED v28 dynamic sizing; residual 0.76× | RUN | No adapters → no `--enable-lora`; pinned v31 | N-A-by-design | cudagraph_specialize_lora=False recovers 0.94× (flag submissions cannot set) | — |
| F4 | adapter wipe / addressing (743508/743213) | double-registered layers reset_lora wipe (fixed v23); adapter routed via vLLM --lora-modules openai/<name> | RUN | No adapters | N-A-by-design | Verify attachment via traces not /metrics; runner-up logprobs not top-1 | — |
| F5 | LoRA null studies (750713/751596/750961/753793) | every controlled study null-or-worse; alpha 32 → 0.0 repetition loops | RUN | No adapters | N-A-by-design | Sweep alpha 8→32; paired gain ≥3 tasks over ≥4 seeds before a slot | — |
| F6 | E-series LoRA unproven (752239/753388) | zero confirmed end-to-end LoRA-on-12B/E4B/E2B scores; Gemma4ClippableLinear claim unverified | RUN | Raw-base E4B (no adapter) | N-A-by-design | Hold raw-base E4B final; canary serving path first | C5 |
| F7 | hand-built / SVD adapter rules (756792/754594/753277) | activation-derived / full-FT / DoRA / IA3 UNADJUDICATED; SVD copy-fix repair rules open | RUN | None shipped | N-A-by-design | Written host clearance before any non-PEFT adapter; Paper Track as safe outlet | — |

### G. Scorer verification / solvability

| # | Issue (threads) | Mechanism | Radius | BCF handling (file:line) | Verdict | Residual risk | Canary |
|---|---|---|---|---|---|---|---|
| G1 | skipped-sibling matcher rich_3486/fastapi_14186 (755554/757893) | required tests with opposite skip conditions; prefix-match bug counts skipped sibling as non-passing; NEVER resolvable | TASK | STRUCTURAL(local): mask both from every CV denominator (architecture C6:966-973). No submission fix possible/needed; hidden 100% gold per staff (744370/747248) | HANDLED | Structurally unsolvable in ANY env; do not chase 129/129 | C6 |
| G2 | pytest conventions: -p no:anyio / pytest.ini overwrite / non-collectable targets / JUnit 10 MiB (751707/757893) | 277/1,143 (24%) correct fixes fail on 5 conventions | TASK | STRUCTURAL: never edit runner configs — `apply` refuses (`bcf.py:1440-1442`), `check` protected scan (`bcf.py:1583-1589`), install skip-worktree (`install.py:96-103`); fixes target library code only. PROMPT: no anyio reliance, targeted tests, /tmp repros (`solver.md:26,42`) | HANDLED | Hidden anyio/pytest.ini-dependent tasks unpassable scorer-side regardless; agent's own repros avoid anyio | C1/C6 |
| G3 | anti-tampering test/config reset (HR §8.2/744825/748323) | scorer resets test files + runner configs to baseline before test_patch; edited tests sink fixes; reset no-op vs strip build drift | TASK | STRUCTURAL: `check` protected scan + exact revert/clean cmds (`bcf.py:1583-1589`); `apply` refusal; skip-worktree defense-in-depth. PROMPT: hard prohibition (`solver.md:42`) | HANDLED | test_patch-referenced non-test paths unknowable in sandbox (inherent); library-only doctrine minimizes | C1 gate |
| G4 | missing test deps inline_snapshot/dirty_equals/httpbin (756587/757661/754586) | 27–34 fastapi tasks fail collection regardless of patch; ~79% local ceiling; hidden provisioning unknown | TASK(local) | STRUCTURAL(local): C6 masks dep-gap ids (+4 local candidates reconciled by gold+empty). PROMPT: no pip install/network (`solver.md:42`) | HANDLED | Hidden container provisioning unanswered (757661); do NOT repair sandbox via patches (legality open) | C6 |
| G5 | empty-pass tasks (756400) | 5 tasks pass with EMPTY patch (2 fastapi + 3 requests); free local points inject A/B noise | TASK(local) | STRUCTURAL(local): C6 "never A/B on raw 129"; frozen 68-valid discrimination set (gold passes, empty fails) | HANDLED | Reconcile valid set on exact wheelhouse before freezing | C6 |
| G6 | URL-only / screenshot statements offline (757149/746944) | ~18–23 public tasks title+URL-only (33/129 sparse measured); hints empty 129/129; sandbox offline; screenshots arrive as text URLs | TASK | STRUCTURAL: two-tier sparse detection url_only/low_info (`bcf.py:619-630`); generic symptom→subsystem map (`bcf.py:637-650`); repro_seed extraction (`bcf.py:580-584`). PROMPT: never fetch, reconstruct from repo, state hypothesis (`solver.md:44-46`) | HANDLED | Sparse top-3 recall target ≥50% unproven; scored-env URL availability unconfirmed (monitor 757149) | C1 sparse recall |
| G7 | public→hidden transfer failure (756400/751973) | 50%-public agent timed out on hidden at 15 min; local screens mis-rank hidden (28/74 tie → 0.17 vs 0.10); hidden = private repos | RUN(score) | STRUCTURAL: generic-first AST+coverage ranking is the foundation; ZERO public ids/expected strings/snapshots in bcf.py; REPO_PRIORS only add +8 weight, never gate (`bcf.py:652-705,907-941`). C6 OOD proxy (FreshSWE-Py/OOD-45) | HANDLED | Unproven on private repos; requests_6644/7315 opposite-fix pair is the overfitting warning | C6 OOD |
| G8 | resolved-as-upper-bound / mutation escape (756400) | 24/163 (14.7%) planted broken fixes still marked resolved; inverted booleans/off-by-one weak | paper | Protocol: mutation-style sanity checks for paper-track claims (architecture C6; brief §6.20). Not a submission artifact | PARTIAL | Recommendation only; keep explicit error-path tests | C6/paper |

### H. Local-eval hygiene (scope: local — not fixable inside the submission)

| # | Issue (threads) | Mechanism | Radius | BCF handling | Verdict | Residual risk | Canary |
|---|---|---|---|---|---|---|---|
| H1 | wheel shadowing installed-vs-snapshot (752672/747248) | wheels/ ships repo releases; site-packages precedes /workspace .pth → tests import bundled release not patched repo; requests_7309/7315/7427 pass empty | TASK(local) | Local-eval protocol: remove repo-under-test wheels or put /workspace ahead of site-packages (synthesis #18; architecture C6). Drop rich_3468 (passes empty even after fix) | PARTIAL | Documented posture; execution pending; not a submission-side artifact | C6 |
| H2 | import shadowing in local eval (747248) | same mechanism as H1 (src-layout requests/httpx) | TASK(local) | Same as H1 | PARTIAL | Same | C6 |
| H3 | calibrated sandbox / gold+empty audit (751487/756400/757661) | gold passes 43/52/71/73–74/127 by environment; only fastapi_14186+rich_3486 fail everywhere | local | STRUCTURAL(protocol): C6 adopts calibrated scorer-like sandbox + gold_patch_check.csv (127/129) as ground truth; run own gold+empty on exact wheelhouse | HANDLED | Environment-dependent counts; always state the environment | C6 |
| H4 | local screens mis-rank hidden (751973/753524) | two configs tied 28/74 locally → 0.17 vs 0.10 hidden; 9–0 local win scored lower hidden | local | STRUCTURAL(protocol): C6 win-both replicated repeats + OOD proxy; single-run deltas <4 tasks treated as noise | HANDLED | Local rank is not evidence; pre-registered paired repeats | C6 |

### I. Noise / selection / ops / rules / policy

| # | Issue (threads) | Mechanism | Radius | BCF handling | Verdict | Residual risk | Canary |
|---|---|---|---|---|---|---|---|
| I1 | score noise / best-of-N (757588/750521/756438/753524) | σ≈2 tasks/58; 10–13% per-task flip; identical ZIP 0.18→0.01 (infra) and 0.12–0.22 (sampling); published scores likely best-of-N | RUN(score) | STRUCTURAL: explicit seed 7 (`configs/sampling.yaml:5`); C6 win-both repeats, noise threshold. ops: discount published claims | HANDLED | Private multi-run averaging unanswered (754295); infra noise regime distinct from sampling | C6 |
| I2 | queue stalls 36–52 h + one-pending gate (747519/757993/743683) | 1/day + 1-pending, no cancel; 36–52 h stalls; rescore paused since Sep 28; daily slots burn | RUN(slot) | ops: C7 checklist — submit early, validated fallback bundle, monitor PENDING, escalate same-day with ids (architecture §10 C7:975-979) | PARTIAL | Ops-only; no submission artifact possible; execution risk; budget for lost days not reruns | C7 |
| I3 | two finals better-of-two (751104/752220) | private = better of two selected finals; bonus must occupy one slot; error-fallback unanswered | ops | STRUCTURAL: two self-contained trees, both independently <12 h (D1); one 31B + one E4B posture | HANDLED | Error-fallback sub-question never answered; both must finish | C7 |
| I4 | bonus deadline ambiguity (757244) | Prizes page Nov 12 vs bonus announcement Dec 2; no staff confirmation | ops | ops: working assumption Dec 2; safe internal milestone Nov 12 (brief §2b) | PARTIAL | Open staff question; re-check before lock | C7 |
| I5 | reasoning-fix parity / unchanged-ZIP resubmit (744354) | public v31 still drops reasoning_content; scorer state unknown; no rescores promised | ops | STRUCTURAL: retention-agnostic design (C6). ops: C7 "never resubmit unchanged ZIP hoping for a scorer-side fix" | HANDLED | Do not spend a slot until staff confirms scorer change | C4/C7 |
| I6 | public/private split probing (757626) | modulate per task to identify private half; 240+ subs vs ~70 cap; ban risk | policy | N-A-by-design: NOT adopted (brief §6.21; negative EV) | N-A-by-design | none | — |
| I7 | data transmission freeze (755542/757223/757783) | Competition Data to third-party hosted APIs unanswered; rules §2.4.b | policy | N-A-by-design: local-only honored; self-host processing; no transmission (audit + design local-only) | N-A-by-design | Re-check before any external annotation | — |
| I8 | runtime pin / wheelhouse metadata (757782/748287) | exact wheelhouse version/manifest unanswered; dataset-version 19987205 | ops | STRUCTURAL: C0/C5 pin v31 / vLLM 0.19.1 (parser SHA 682b2152…) / swegemma 0.2.11 / adk-submission 0.2.13 / Python 3.12.13; validator model ids | HANDLED | Official manifest unconfirmed; add reasoning-field-survival check to local validation | C0/C5 |
| I9 | model registry / single variant (748287) | four QAT ids; no mixing across agents/subagents; stale local ALLOWED_MODEL_NAMES 31B-only | RUN | STRUCTURAL: one QAT id per tree on every LlmAgent (`sub_agents/*.yaml:4`); validator single-model rule (`validate_submission.py:224-225`); 31B/E4B correct per track | HANDLED | Validate chosen id against current validator before a slot | C0 |
| I10 | team merger math (756693) | irreversible merge; score-carry + daily-allowance reset unanswered; combined cap ≤ days since Sep 23 | ops | ops: documented caution — pause subs, compute combined count, get staff answers before Nov 25 (brief §6.6) | PARTIAL | Open staff question | ops |
| I11 | 12B serving override (748287) | 12B needs --hf-overrides; end-to-end slower; 8-min LB run blew 12 h | n/a | N-A-by-design: no 12B track (31B main + E4B bonus) | N-A-by-design | none | — |
| I12 | graph tools broken / no benefit (745731/744577/756400) | exact-id-only, lowercase calls, 14–21% coverage, no async defs; k0 50% vs k4 47% p=0.69 | n/a | N-A-by-design: NO graph tools anywhere (architecture §1; avoids list[str] parser trigger) | N-A-by-design | none | — |

### J. Corpus gaps (no local content to audit against)

| # | Issue (threads) | Status | Handling | Verdict |
|---|---|---|---|---|
| J1 | 750496 (0.22–0.24 single-agent architecture questions) / 751959 (Trap-25 / 300 SWE loop pairs / W4A16 thinking sweep) | bodies NEVER captured (listing-only); no config/numbers extractable | Recommendation: future capture if content matters; do not fabricate | GAP (corpus) |
| J2 | 752511 / 748618 / 749597 (12 h follow-ups, title-only) | bodies not captured; questions answered by PRIMARY staff 743063/745805 | Covered via D1/D2 | N-A (answered by staff threads) |

**Tally (70 matrix rows; per-row verdicts above are authoritative):**
- **HANDLED 36:** A1,A2,B3,B6,B7,C1,C2,C5,C6,C7,C8,D1,D2,D3,D4,D6,E1,E3,E4,E7,E9,E10,G1,G2,G3,G4,G5,G6,G7,H3,H4,I1,I3,I5,I8,I9.
- **PARTIAL 20:** A3,B1,B2,B4,B5,C3,C4,C9,D5,D7,D8,E2,E6,E8,G8,H1,H2,I2,I4,I10.
- **GAP 1:** J1 (corpus gap — 750496/751959 never body-captured).
- **N-A-by-design 13:** E5,F1,F2,F3,F4,F5,F6,F7,I6,I7,I11,I12,J2.

*The F-family (F1–F7) is 7 rows all N-A-by-design, collapsing to the single "no adapters shipped" decision; unique-issue
count after collapse = 64 (HANDLED 36 · PARTIAL 20 · GAP 1 · N-A-by-design 7).*

---

## 3. Graceful-handling assessment (cross-cutting)

**Degradation ladder is structural, not aspirational** (architecture §9.1, verified in shipped bytes):
- **T0 full:** skill install works → plan install→problem.md→spec; solver drives helper subcommands.
- **T1 helper-only:** skill tool errors but `.git/bcf/bcf.py` exists → plan Step 0 (`run_command spec`) already succeeds; the
  skill is never needed again (`bcf_plan.md:7-8`). The solver's only dependency is `run_command` (core registry tool).
- **T2 manual:** install fails twice / helper missing → plan emits the fixed fallback brief, guaranteeing `bcf_spec` is NEVER
  empty (`bcf_plan.md:24-28`); solver follows the prompt-embedded manual workflow (`solver.md:48-50`, `E4B/solver.md:13-17`).
- Install attempted ≤2 times per task (no loop surface); install exits 0 even on failure (`install.py:84-87,107-109`) so a
  nonzero exit cannot invite blind retries; `check` FAIL exits 0 (verdict is text, `bcf.py:1636`); partial spec exits 0 with a
  `confidence: partial-` marker (`bcf.py:1313-1316`, compliance F5).

**The two fixes this pass restore the ladder's edit-reliability rung.** Before the fix, the 2-strike breaker's recovery path
(`strike`→`anchors`) crashed (B1), silently pushing the solver to T2 manual on the very failure class the breaker exists to
contain; and a truncated anchor window could inject a corrupt `old_string` (B1/B4). Both are now verified closed (§4).

**What the design cannot contain (honest ceilings):** a confidently-wrong fix that compiles and submits (E4B 97%
patch-submission + 0/31; e4b review §3.1); semantic escape corruption that is syntactically valid (B4, probe A1); an arbitrary
untracked non-pattern `.py` entering the patch (A2 probe); scorer-side unknowns (E2/E6/C9/D5). These are score ceilings or
canary-gated boundaries, not crashes — the structural mitigations correctly bound them to TASK radius, not RUN.

---

## 4. Fixes applied (this pass)

Policy honored: minimal, unambiguous, contract-preserving; NO architecture restructure; NO budget/sampling changes; NO prompt
core-contract changes. Both fixes are in `skills/bcf-spec/scripts/bcf.py`, applied to `31B/` first then mirrored
**byte-identical** to `E4B/` (sha256-verified). Skill sha256 after: `33629118376e48bfd8f7d131a550a80fcec5546911a11ea27c4ff82b99e0c80f`
(both tracks). `install.py` (`14a9d916…3d540`) and `SKILL.md` (`c9621270…c82d`) unchanged.

### Fix 1 — CRITICAL: anchors-after-strike crash (circuit breaker)

**File:** `skills/bcf-spec/scripts/bcf.py`, `gen_anchors` (now line 1016).
**Before:**
```python
struck = {s for s in strikes if s.get("file") == relpath}
```
**After:**
```python
# LIST of strike dicts for this file (a set comprehension would raise
# TypeError: unhashable type 'dict' the moment any strike exists, crashing
# the anchors-after-strike circuit-breaker path — 756051/747519/756433).
struck = [s for s in strikes if s.get("file") == relpath]
```
**Why clear:** `strikes` is a list of dicts (`{"file","line","ts"}`, written by `cmd_strike` line 1553). A set comprehension
over dicts raises `TypeError: unhashable type: 'dict'`. The consumer at line 1058 (`any(s.get("line") == t + 1 for s in struck)`)
iterates dicts, so a LIST is the intended type. The crash fires exactly when a strike exists for the anchored file — the
2-strike recovery path. **Reproduced pre-fix:** `strike pkg/m.py:2` then `anchors pkg/m.py` → `BCF-ERROR: TypeError: unhashable
type: 'dict'` (exit 1). **Post-fix:** exit 0, "Struck loci excluded: 2", multi-strike stable (probes A7/A9).

### Fix 2 — MAJOR: anchors output truncating inside a verbatim old_string window

**File:** `skills/bcf-spec/scripts/bcf.py`, `cmd_anchors` (now lines 1363–1404).
**Before:** a flat loop appended every anchor group to `out`, then `emit(text, ANCHOR_CHAR_CAP)` blindly truncated at 2,000
chars — cutting mid-window on long-line files.
**After:** groups are built per anchor, then assembled under a byte budget that reserves the header + struck line + closing
prose line. A whole group that does not fit is dropped (absent/ambiguous advisory) or replaced by a short line-range recipe
(unique: "window too long to print verbatim; use apply PATH START END heredoc"). The closing prose line always survives (so
`emit()`'s rstrip never eats a window's trailing whitespace — compliance F9 preserved). `emit()` remains a backstop but can no
longer cut inside a window. Cap unchanged (≤2,000 chars, architecture §3.5).
**Why clear:** a cut `old_string` copied verbatim is a guaranteed `edit_file` failure and a retry-loop trigger (756051/744272).
**Reproduced pre-fix:** long-line repo + spec cues → anchors outlen 2000, `...[truncated]` present, tail `...value = call\n...[truncated]`
(window cut). **Post-fix:** outlen 1519, no marker, all emitted windows verbatim-in-file (probe A4). Normal-path output unchanged
(compliance P10a/P10b still PASS).

### Verification log (post-fix, re-run after the final re-mirror)

| Check | Command | Result |
|---|---|---|
| Validator 31B | `python -I scratch/bcf-2026-11-11/validate_submission.py 31B/` | **PASS (0 errors, 0 warnings)**, 0.09 MB, 10 files |
| Validator E4B | `python -I scratch/bcf-2026-11-11/validate_submission.py E4B/` | **PASS (0 errors, 0 warnings)**, 0.09 MB, 10 files |
| Skill byte-identity | `sha256sum` bcf.py both tracks | identical `33629118…c80f` |
| py_compile | `python -I -m py_compile bcf.py` | OK (Python 3.12; `__pycache__` cleaned from tree afterward) |
| Compliance battery | `python -I _compliance/probe_bcf.py` | **18/18 PASS** (P1–P14, incl. empty-stdin refusal, syntax rollback, protected refusal, new-file check, off-repo install, cache, partial marker) |
| Audit battery | `python -I _audit_l7/audit_probes.py` | **14/14 PASS** (S1a–e real-task stdin smoke; A1–A9 incl. FIXED A4/A7/A9) |
| Real-task stdin smoke | `bcf.py spec` on `rich_3471` (URL-only) via stdin heredoc | exit 0, `# BCF spec`, sparse tier flagged, problem.md persisted, brace-free, warm cache byte-identical |
| E4B mirror functional | spec→strike→anchors using E4B bcf.py | exit 0, no crash, strike excluded |

**Prior-review fixes re-verified present in shipped bytes** (compliance-review F1–F9): F1 empty-stdin refusal
(`bcf.py:1465-1468`), F2 untracked-new-file check/state (`bcf.py:1563-1568,1607-1626,1668-1682`), F3 sandbox probe + honest
install error (`bcf.py:189-214`, `install.py:47-70,84-87`), F4 E4B Plan-sentence bound to first tool call
(`E4B/bcf_plan.md:7-12`), F5 partial spec exit 0 (`bcf.py:1313-1316`), F6 `read_stdin_bounded` (`bcf.py:164-186`), F7
`*_test.py` + root test discovery (`bcf.py:1098-1140`), F8 untracked-protected `git clean -f` + any-depth scratch
(`bcf.py:1585-1593`), F9 emit-cap accounting / rarity case-fix / spec char-cap / anchors closing line
(`bcf.py:69-74,844-863,1224-1225,1383-1389`). e4b-viability §5.A Target-first-line prompt fix present
(`E4B/solver.md:21-27`). **The compliance review's claimed final sha `ac52167f…` differs from the shipped `b6ac6a07…` (pre-this-pass)
because the engine workstream continued editing after that review; the shipped file contained all F1–F9 fixes, and this pass
adds Fix 1/Fix 2 → `33629118…`. The e4b review's §5.C cross-track divergence is RESOLVED (bytes now identical).**

---

## 5. Gaps & recommendations (ranked)

**R1 (highest EV — E4B fix-authoring measurement).** No E4B score for this design exists; `apply`/`check` cannot validate
semantics (probe A1). Before any bonus slot: run C5 serving canary + replicated C6 (2 runs, masked denominator, win-both) and
require a non-zero replicated resolve rate; 0 replicated solves → ship 31B-only finals (architecture C5 fail clause). Apply
e4b-viability §6.1–6.2 engine proposals (below) first if real-repo localization precision is limiting. **Owner:** verification
workstream. **Not a code fix this pass** (measurement, not a defect).

**R2 (engine, both-track sync + re-test — e4b review §6.1).** `_family_lines` (`bcf.py:981-993`) has line priors for only 5 of
10 families; api-contract-violation, missing-capability, schema-generation-logic, compatibility-shim, docs-content-error get
none → anchors fall back to def lines, not edit loci. Add a generic "return/assignment/call lines within the matched symbol"
prior. **Deferred:** tuning decision, requires both-track sync + skill-author battery; out of lane for a minimal safe fix.

**R3 (engine — e4b review §6.2).** Surface matched cue lines inside the target symbol as "candidate edit lines: N, M" in the
spec `## Target` (data already exists in `cue_lines`/`pick_symbols`). Lets the foreman read the right range without inferring
it. Keep ≤300 words / brace-free. **Deferred:** spec-format change, needs re-test.

**R4 (semantic escape gate — B4).** The compile gate is syntax-only; a syntactically-valid literal-`\n`/escaped-quote
corruption passes (probe A1). A diff-review heuristic (flag literal `\n`/`\"` sequences introduced into string literals in the
git diff) could catch the 744272 residual, but false-positives on legitimate escapes make it unsafe as a hard gate.
**Recommendation:** keep the prompt corruption rule (`solver.md:14`) + add a C2-6 replay assertion; consider an opt-in WARN
(not FAIL) in `check` for newly-introduced literal escape sequences. **Not applied** (false-positive risk; tuning).

**R5 (scratch scan breadth — A2 probe).** `check` scratch WARN is name-pattern-based (`repro|scratch|test_tmp|tmp_`,
`bcf.py:1591-1593`); an arbitrary untracked `.py` (e.g. `debug_fix.py`) enters the patch unflagged. Extending to all untracked
non-library `.py` would WARN on legitimate new-file fixes (46/129 tasks). **Recommendation:** add a C1 gate assertion + prompt
"git status review before submit"; consider a WARN listing ALL untracked files (not just pattern matches) so the model sees
them. **Not applied** (noise trade-off; architecture §3.6 specifies the name pattern).

**R6 (O1 SequentialAgent deviation).** Keep monolithic variant B pre-validated; run C2-3 forced-restart drill (tax ≤15 s,
byte-identical spec, zero duplicated edits) as a HARD pre-slot gate. Do NOT flatten the tree without the user's hierarchy
decision changing. Pre-register a planner-only `thinking_budget: 0`/256 arm (O2) in C6 — the 2048 planner thinking is a pure
tax on the mechanical echo stage. **Not applied** (frozen N1 / user hierarchy).

**R7 (O7 budget margin).** C2 telemetry must measure real per-task setup time; ship 4.5-min caps only if measured setup ≤35 s
and extrapolated 120-task total ≤11.0 h; lower to 4.0 if setup ≥65 s or N≥125. **Not applied** (budget values are user tuning
decisions; the §8 decision rule is the control).

**R8 (canary-gated scorer boundaries — O3/O4/E6/D5).** C0 official-compiler canary (skill injection + path base; one-line
`skills/bcf-spec` fallback ready); C2-4 include_contents:none boundary (hard gate; fallback to `default` or variant B);
C5 E4B serving/format canary (752128) + `--reasoning-config` observation (745059). **Not fixable from inside the submission.**

**R9 (A3 thought-channel drop — 753521).** Add a local non-streaming repro with both gemma4 parsers to C3/C4; treat unexplained
"nudge burned, tool never ran" traces as this bug until proven otherwise. Low confidence (uncorroborated, −3 score); design
defensively but do not over-fit. **Recommendation only.**

**R10 (local-eval hygiene — H1/H2/G4/G5).** Before freezing the C6 valid set: fix wheel shadowing (remove repo-under-test
wheels or /workspace ahead of site-packages), drop rich_3468, run gold+empty on the exact wheelhouse, reconcile the 27
inline_snapshot/dirty_equals ids + 4 local candidates + 12 requests httpbin ids. Never A/B on raw 129. **Local protocol, not a
submission artifact.**

**R11 (corpus gap — J1).** 750496/751959 bodies never captured; if their architecture/budget-sweep content matters, flag for a
future capture rather than inferring. **No action possible locally.**

**R12 (ops — I2/I4/I10).** Submit early in the day; keep a validated fallback bundle (same tree, tighter caps); monitor
PENDING; escalate same-day with submission ids in 747519/743683; re-check open staff threads (753973 parser, 744354 reasoning
parity, 757149 URL-only, 757244 bonus deadline, 756693 merger) before the Dec 2 lock. **Ops checklist C7.**

---

## 6. Canary checklist (architecture C0–C7, mapped to issues)

### 6.0 What is a canary?

A **canary** is a small, cheap test you run *before* committing something expensive, designed to die
early if the environment is poisonous — from the canary in a coal mine. In software it usually means a
trial deployment to a few users before a full rollout; here it means **a minimal probe run that
validates one load-bearing assumption before you spend a scarce Kaggle submission slot or hours of GPU
time**.

Canaries matter in this competition because the scoring environment has undocumented and buggy
behavior that can **zero your entire run** (a compile rejection, a parser freeze, a 12 h timeout), and
slots are painfully scarce: 1/day, one-pending gate, 36–52 h queues, ~8–11 usable slots before Dec 2.
You cannot afford to discover a fatal problem *inside* a scored run. Each canary therefore isolates
one assumption and tests it cheaply first:

| Canary | What it proves | Cost | If it fails |
|---|---|---|---|
| **C0** Static pre-flight | Official compiler accepts both trees; skill tools actually inject; `skills:` path resolves; no stray braces | CPU, minutes | Fix before any GPU time — otherwise the submission is rejected at compile and burns a slot |
| **C1** Engine battery | `bcf.py` spec/anchors/apply/check behave on all 129 extracted tasks | CPU, ~1 h, no GPU | Engine bug → fix now, not mid-run |
| **C2** Harness smoke | Nudge-restart returns a byte-identical cached spec cheaply; `include_contents:none` works; compaction/overflow behavior; real setup time for the budget rule | 8–10 local tasks | e.g., restart tax too high → switch to the pre-validated monolithic variant B |
| **C3** Parser fuzz | The gemma4 tool parser doesn't hang on your exact tool schemas | CPU, subprocess + timeouts | A hang freezes the server and zeroes every remaining task — reshape args before submitting |
| **C4** Reasoning-drop A/B | Prompts work whether or not `reasoning_content` survives between calls | Local, pinned wheelhouse | Restate-state-in-text hedge adjusted |
| **C5** E4B serving | E4B loads under the sanctioned alias, tool calls parse, no intermittent "incorrect format" | Kaggle notebook, **before** a final slot | Hold the $10k bonus slot — don't bet it on an unproven serving path |
| **C6** Full local eval | Replicated paired runs on the masked-68 valid set; win-both before promotion | GPU, overnight | Candidate doesn't beat champion → don't ship it |
| **C7** Submission ops | ZIP validates; early-day submit; PENDING monitored; per-run triage | Each slot | Escalate same-day with submission IDs |

**Concrete example:** the `skills: ../skills/bcf-spec` path base is a *medium-confidence inference* —
the official docs do not spell it out. C0 compiles the tree with the real compiler and reads the trace
to confirm the skill tools appear; if the path base is wrong, it is a one-line fix found in minutes at
your desk, instead of a "Submission Scoring Error" discovered 40 hours later in the queue.

**Ordering rule:** cheapest canaries first, and never spend a slot on an assumption a canary has not
validated. The detailed checklist below maps each canary to the issues it gates, its pass criterion,
and its current status.

### 6.1 Detailed checklist

| Canary | What it proves | Issues gated | Pass criterion | Status |
|---|---|---|---|---|
| **C0** static pre-flight + official compiler | model ids/single-model; !include + skill path base; skill injection + scalar/zero-arg schema; brace/schema lint; py_compile 3.12+3.13 | I9, E2, A1/A2, D3/D4, C9 | validator 0/0 both trees; compiler injects skill tools; no array branch reachable | validator PASS (this pass); official-compiler canary PENDING |
| **C1** bcf.py unit + corpus calibration | top-3 recall ≥80% (sparse ≥50%); anchor uniqueness ≥90%; apply rollback/protected/>120; check gates; cwd-agnostic; cache; edit-replay 2-strike | B1/B2/B3/B6, E3, G2/G3/G6, H3 | all thresholds; failures fix helper not thresholds | 18 compliance + 14 audit probes PASS (this pass); full 129-corpus calibration PENDING |
| **C2** local harness smoke (8–10 tasks × both tracks) | happy path; fallback injection; forced nudge-restart; include_contents boundary; compaction survival; circuit breaker; telemetry | C4 (C2-3), C9 (C2-4), C1/C2/C3 (C2-5), B1/B4/B5 (C2-6), D1/D2/D6/D7/D8, E4/E9/E10, B7/C7/C8 | C2-3 tax ≤15 s + byte-identical spec + zero dup edits; C2-4 spec correct first entry; setup ≤60 s median; 120-task ≤11.0 h | PENDING (GPU/harness) |
| **C3** parser-freeze fuzz (vLLM 0.19.1 gemma4, subprocess+timeout) | no array branch reachable with our schemas; no hang on scalar args; ≥5,000 bracket-heavy strings | A1/A2, A3 (rec.) | zero hangs; any hang → schema change first | PENDING |
| **C4** reasoning-drop parity (pinned v31) | retention-agnostic: solve-set delta ≤1 task thoughts retained vs dropped | C6, I5, A3 (rec.) | delta ≤1 task | PENDING |
| **C5** E4B serving canary (Kaggle, BEFORE a slot) | E4B loads under sanctioned alias; tool calls parse; zero-arg install runs; thinking off/no-op; one full task; clean format; trailing-s probe | E6/E7/E8, F6, D5 | end-to-end completion + clean format; FAIL → hold E4B slot | PENDING |
| **C6** full local eval + selection (GPU) | frozen 68-valid masked set; 2 repeats × both tracks; win-both; OOD proxy; wall-clock extrapolation | D1, G1/G4/G5/G7/G8, H1–H4, I1, R1 | non-zero replicated E4B resolve; 120-task ≤11.0 h (31B) / ≤10.5 h (E4B) | PENDING |
| **C7** submission ops (each slot) | validated ZIP; early submit; PENDING monitor; fallback bundle; escalate; no unchanged-ZIP resubmit; re-check open threads | I2/I3/I4/I5/I8/I10, E6 | ops checklist executed | PENDING |

**Hard pre-slot gates:** C0 (compiler) → C2-3 (restart) → C2-4 (include_contents) → C3 (fuzz) → C5 (E4B) → C2/C6 (wall clock).
Variant B (monolithic) stays pre-validated as the hierarchy fallback. Both finals independently < 12 h.

---

## 7. Residual-risk register

| ID | Risk | Radius | Likelihood | Mitigation in place | Owner / gate |
|---|---|---|---|---|---|
| RR1 | E4B confidently-wrong fix that compiles + submits (fix-authoring ceiling) | TASK→score | High (0/31 prior; 97% submission) | apply primary, compile gate, post-edit re-read, copy-fidelity clause | C5 + replicated C6 (R1); hold slot |
| RR2 | Semantic escape corruption syntactically valid (B4) | TASK | Medium | prompt corruption rule; compile gate (syntax only) | C2-6 replay; R4 WARN heuristic |
| RR3 | SequentialAgent nudge restart tax / blind stage-1 re-run (O1) | TASK/TAX | Medium (up to 3 nudges) | include_contents:none, cache, byte-identical echo, disk resume | C2-3 hard gate; variant B (R6) |
| RR4 | 31B N=129 worst-case 11.99 h (~30 s margin) (O7) | RUN | Low-Med | caps 4.5/4.0; §8 decision rule | C2 telemetry (R7) |
| RR5 | Skill-tool injection / skills: path base wrong (O4) | RUN | Low-Med | file-relative path + validator + load_skill hedge; one-line fallback | C0 compiler canary (R8) |
| RR6 | include_contents:none system-only request invalid (O3) | RUN | Low | self-sufficient instruction | C2-4 hard gate (R8) |
| RR7 | E4B intermittent "incorrect format" (752128) | RUN(slot) | Low-Med | minimal bundle; validator; early canary | C5/C7 (R8) |
| RR8 | Scorer --reasoning-config absent → 31B 2048 instant-fail (745059) | RUN | Low | vLLM path; E4B budget 0 removes fields | C5/C2 (R8) |
| RR9 | Context overflow before submit → empty patch (C3) | TASK | Low | small prompts, narrow reads, compaction, 80% early submit | C2-5 |
| RR10 | Arbitrary untracked .py enters patch unflagged (A2) | TASK | Low-Med | scratch /tmp rule; name-pattern WARN; git diff review | C1 gate; R5 |
| RR11 | Prompt-only behavioral mitigations weak on E4B (D7/D8/B5) | TASK | High | structural caps/backstops are the real bound | C2/C6 measurement |
| RR12 | Array-arg exposure via host-injected run_skill_script.args (O5) | RUN | Low (zero-arg safe) | zero-arg install; prompt forbids args | C3 fuzz |
| RR13 | Queue stalls burn daily slots; no reruns (I2) | RUN(slot) | High (36–52 h observed) | C7 ops; fallback bundle | ops (R12) |
| RR14 | Private multi-run / error-fallback / bonus deadline unanswered (I1/I3/I4) | RUN(score) | Medium | robustness-first selection; both finals <12 h | re-check staff before Dec 2 |
| RR15 | Local-eval wheel shadowing / dep gaps mis-rank (H1/H2/G4) | local | High if unaddressed | C6 masked calibrated sandbox | local protocol (R10) |
| RR16 | Hidden private-repo localization degradation (G7) | TASK→score | Medium | generic-first ranking; zero public ids; OOD proxy | C6 OOD |

---

## 8. Method notes & provenance

- **Local only.** No web research; nothing under `input/` modified. Issue facts cited to the register files listed in the
  header (PRIMARY intel_texts dumps / raw_json; SECONDARY briefs; STAFF organizer-verified). Thread numbers are Kaggle
  discussion ids. Competitor claims are unverified unless STAFF; tiers recorded in the registers.
- **Empirical.** All verdicts on shipped-code behavior were re-probed against the actual bytes (32 probes total), not inferred
  from the prior reviews. The two fixes were reproduced pre-fix and verified post-fix. Probe artifacts:
  `scratch/bcf-2026-11-11/_audit_l7/audit_probes.py` (+ `tmp/` throwaway repos);
  `scratch/bcf-2026-11-11/_compliance/probe_bcf.py`.
- **Fix policy honored.** Only minimal, unambiguous, contract-preserving code fixes applied (both in bcf.py, mirrored
  byte-identical). No architecture restructure, no budget/sampling value changes, no prompt core-contract changes. Tuning
  decisions (family-line priors, scratch breadth, semantic-escape gate, planner thinking, caps) documented as recommendations.
- **Byte-identity discipline.** Every skill edit applied to 31B first, mirrored to E4B, sha256-verified, both trees
  re-validated, `__pycache__` cleaned. Final skill sha256: bcf.py `33629118…c80f`, install.py `14a9d916…3d540`,
  SKILL.md `c9621270…c82d` (all identical across tracks).
- **Counts.** 70 matrix rows: HANDLED 36 · PARTIAL 20 · GAP 1 (corpus) · N-A-by-design 13. The 7 LoRA rows (F1–F7) are listed
  separately for traceability but collapse to the single "no adapters shipped" design decision (64 unique issues after collapse).

*End of robustness audit (hardening L7).*
