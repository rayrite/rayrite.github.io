
---

## 10. Special section: winning, the 0.24 deadlock, pitfalls, and always returning a score

### 10.1 Why the public leaderboard is stuck at 0.24

The public leaderboard on 2026-11-24 00:29 UTC: 6,591 teams, sixteen at 0.24, 139 at 0.22, 637 at 0.20. One task is worth 1/58, so 0.24 means 14 of the 58 public tasks and 0.22 means 13. The deadlock has four causes, and only some of them can be attacked.

| Cause | Evidence | What it means |
|---|---|---|
| The public score is a maximum over noisy draws | Byte-identical bundles scored 0.17 and 0.24; the per-task flip rate between identical runs is 10-19% (discussion 757588, 758969, 758954; arXiv 2611.19359) | The top of the board is the lucky tail of bundles whose typical run is 0.20-0.22. Standing still at 0.24 does not mean nobody improved; it means improvements of one task are invisible |
| Time per task is the binding budget | 76% of a 300-second budget was pure decoding at about 17 tokens per second; tasks not solved within about 28 tool calls are rarely solved with more (discussion 755291, 761060) | More thinking does not buy tasks. Fewer and shorter turns do |
| The 12-hour notebook limit punishes generosity | A bundle with 15 minutes and 50 calls per task exceeded 12 hours and received no score; the public submit notebook has crashed on null budgets (discussion 760140; one team's submission 58376497) | Nobody can simply buy more time per task |
| A large share of tasks is under-specified relative to their tests | In the published tasks, 40% have a severe specification gap and the tests compare exact strings in 47% (Document 01, Sections 2.2 and 6.2) | Some share of the hidden tasks cannot be solved reliably by any agent that sees only the statement |

One number keeps the ceiling in perspective: a competitor ran frontier models through the same harness and obtained 54 of 124 for Gemma 4 31B, 58 of 124 for DeepSeek V4 Pro and 59 of 123 for Qwen3.6-27B, with 48 tasks that no model solved (discussion 761060). The harness and the budget together top out well below 100% even for the strongest models. The scored tasks come from private repositories, so that measurement on the published tasks is a reference, not a bound.

**The conclusion that matters for the final ranking.** The private leaderboard is a single run of each of the two selected finals. A bundle whose best draw is 0.24 and whose mean is 0.21 will usually score about 0.21 privately, and so will the fifteen teams beside it. The competition is therefore decided on two quantities that the public board does not show: the **mean** of the single-run score and its **spread**. Every design decision below is justified by its effect on one of the two.

### 10.2 Where the brain expects to gain

Levers are ranked by the strength of the public evidence behind them. None has been measured with BCF on the model; each is a hypothesis with a deciding measurement in Section 10.3.

| Rank | Lever | Public evidence | Effect aimed at |
|---|---|---|---|
| 1 | One write channel with a single string argument and a compile gate | Heredoc editor: 0.4% malformed calls and 37 of 91 panel tasks resolved; `edit_file`: 4.5% malformed and 22 of 107 (one team's panels, public agent `gemma4-swe-agent`; not a controlled comparison). One failed edit lowers later edit success from 90.5% to 57.2% | Mean and spread |
| 2 | An oracle that must fail first | 65% of tasks had tests that passed before any fix (discussion 760014); only 44% of generated repro scripts verify a correct fix (Agentless, arXiv 2407.01489) | Mean: fewer false "done" submissions |
| 3 | A first edit by call 10 and by 150 seconds, enforced by the clock | First edit after 106 seconds in solved runs versus 183 seconds in failed runs (discussion 752848); resolved runs take a median of 12 steps against 21 (arXiv 2405.15793) | Mean |
| 4 | Deterministic localisation in one call | Gold-touched file in the top 9 for 96 of 129 published tasks, measured here | Mean: calls saved are calls available for fixing |
| 5 | State that survives compaction and nudges | Compaction at 14,336 tokens drops tool results; continuation nudges restart a sequential pipeline (discussion 754783, 754636) | Spread: fewer lost tasks on long trajectories |
| 6 | A small thinking budget for the small model | Thinking off beat a 4,096 budget 16 to 10 on 114 tasks; 4,096 and 1,024 tied (discussion 760014, 760595) | Bonus track: mean |
| 7 | No run-level failure | 91% of teams sat at 0.00 on 2026-11-05; compile errors and budget crashes are among the causes (intel of 2026-11-05) | Spread: the difference between a bad day and no score |

The brain does not try to out-reason the model. It removes the failure modes that are independent of intelligence, so that the score reflects what the model can do.

### 10.3 Hypotheses that could break the deadlock, and the measurement that decides each

| Hypothesis | Deciding measurement | Adopt if | Cost of the test |
|---|---|---|---|
| H1 The relay is at least as good as the flat twin | Paired runs of `bcf-31b-sequential` and `bcf-31b-flat` on the 30-task panel, three runs each | Mean resolved not lower, and fewer tasks lost to compaction or nudges | 6 panel runs |
| H2 The helper's edit channel beats the stock tools | `bcf-31b-flat` against `bcf-31b-noskill`, paired | More tasks resolved and fewer malformed or repeated edit calls | 6 panel runs |
| H3 Planner-written search terms beat mechanical ones | Top-9 hit rate of the localizer with the planner's `names` line against the mechanical terms, on the panel | Hit rate above the measured 74% | No model run for the mechanical side; planner calls only |
| H4 A smaller solver thinking budget loses nothing | Solver thinking 2,048 against 4,096, paired | Resolved tasks equal, mean task time lower | 6 panel runs |
| H5 The planner can work without thinking | Planner thinking 0 against 1,024 | Baton relayed correctly on at least 29 of 30 tasks; 8-10 seconds saved per task | 2 panel runs |
| H6 An earlier freeze keeps more runs inside 12 hours | Mean task time with the freeze at 300 seconds against 374 seconds | Mean per task at or below 270 seconds with no loss of resolved tasks | 6 panel runs |
| H7 For E4B, thinking 1,024 beats thinking off when the output channel is intact | `bcf-e4b-flat` with both settings | More tasks resolved on the E4B panel | 6 panel runs |
| H8 The spec gap predicts wasted time | Fraction of the budget used on severe-gap tasks against addressable tasks | If severe-gap tasks use most of the budget, add an early-exit rule for them | From the logs of any panel run |

Two further ideas were considered and left out of this version: spending leftover budget on a second candidate fix (no reliable oracle to choose between candidates) and retrieval over documentation (no measured gain on this harness, and the scored repositories are unseen).

### 10.4 Always returning a score

"I want a system that always returns a score after the allotted time has expired" separates into four layers. A failure at any one of them costs the whole submission or the task.

**Layer 1 - The bundle must start.** A bundle that fails to compile scores 0.00 with the status "complete" and no error message. BCF closes the known ways to get there, and each is covered by a negative control in the validation:

| Way to score 0.00 silently | Cause | Defence in BCF | Verified |
|---|---|---|---|
| Skill name not in lowercase hyphenated form | The framework rejects the name; the agent never starts | Name `bcf-spec` | Control rejected |
| Unknown state variable in an instruction | `KeyError` at the first model call of every task | Optional form `{bcf_spec?}`; the build refuses other brace expressions | Control rejected |
| Unquoted colon in the skill description | Frontmatter does not parse | Quoted description | Control rejected |
| Unknown key in a `SequentialAgent` | Schema rejects unknown keys | Root file carries five keys only | Two controls rejected |
| Null or missing budgets | The public submit notebook parses budgets with `int()` | Four explicit integers | Three controls rejected |
| Wrong model alias, missing include file, stray file extension | Compiler errors | Checked by the validator | Three controls rejected |

The compiler check found one such defect during this work: an unquoted colon in the description of the new no-skill bundle. It was caught before the bundle left the machine, which is the purpose of the check.

**Layer 2 - The model server must keep running.** The pinned vLLM 0.19.1 parser can loop forever on a list argument whose element contains a bracket, and every task after that point in the run scores zero (discussion 753973, 760830). BCF attaches no tool with a list argument. The residual exposure is the skill tool itself, whose schema has two optional list arguments; the planner is told to pass none, and the no-skill bundles remove the exposure completely. A second server-level risk is a LoRA adapter; BCF ships without one.

**Layer 3 - The run must finish inside 12 hours.** The notebook is killed at 12 hours and the submission receives nothing. This limit is enforced by the platform, not by the agent, so the defence is arithmetic:

| Mean seconds per task | 120 tasks | 129 tasks |
|---|---|---|
| 240 | 8.0 hours | 8.6 hours |
| 270 | 9.0 hours | 9.7 hours |
| 277 (published bundles with these budgets) | 9.2 hours | 9.9 hours |
| 300 | 10.0 hours | 10.8 hours |
| 330 | 11.0 hours | 11.8 hours |
| 360 | 12.0 hours | 12.9 hours |

BCF keeps the mean down by ending a task when the solver calls `submit_patch`, by capping calls at 28 and turns at 80, by refusing edits after 374 seconds and by cutting every helper command short (45 seconds for a test, 40 for a repro, 20 for a search, against a harness limit of 240). The worst case for one task is the 480-second cap plus the tail of one long command. **The mean for BCF has not been measured and must be measured locally before the first submission** (Section 10.6); if it exceeds about 270 seconds, the per-task cap has to come down to 7 or 6 minutes, and the build keeps the helper, the prompts and the configuration in step when it does.

**Layer 4 - Every task must yield its best available patch when time expires.** The harness grades whatever is on disk when the cap is reached, so the task-level rule is: never leave the tree worse than the last good state, and never leave it empty.

| Task-level failure | Defence in BCF | Verified |
|---|---|---|
| Time runs out with nothing edited | The clock pushes a first edit by 150 seconds; `status` says "make your best-guess edit now" when time is short | Governor tests |
| An edit leaves a syntax error | The result must compile before it is written; `finalize` compiles every changed file again | Editor tests, replay of 129 real fixes |
| A broken edit replaces a working file | All-or-nothing per call, atomic replacement | Editor tests |
| The model repeats a refused edit until the calls are gone | The refusal prints the closest lines with numbers and names the line-range alternative | Editor tests |
| Scratch files leak into the patch | Repro scripts live outside the repository; `finalize` removes scratch files | Repro and finalize tests |
| Calls to edit tests are wasted | Test and configuration paths are refused, and reverted by `check` and `finalize` | Editor and check tests |
| A long command outlives the session | Helper commands carry their own timeouts | Repro and test tests |
| The helper blocks on a missing input | Standard input is read only when a heredoc supplies it, and the helper always exits | Stdin test |
| A nudge restarts the pipeline | Idempotent installer, baton with a progress section, `resume` | Installer tests |
| The skill script does not run on the scorer | The solver falls back to the no-helper procedure; the no-skill bundle removes the dependency | Not verifiable locally |

What BCF cannot defend against: a backend failure during scoring (two teams received 0.00 with a 3,230-byte result, and staff are investigating; discussion 761004), a notebook exception with no stage information (discussion 743683), and the queue itself. The only defence is procedural and is in Section 10.7.

### 10.5 Pitfall register: what has cost other teams score

| Pitfall | Symptom | Reported by | BCF defence |
|---|---|---|---|
| Budgets too large | Run exceeds 12 hours, no score | discussion 760140, 761060 | 8 minutes and 28 calls, the largest proven values |
| Budgets left at defaults | 60 minutes per task starves later tasks | harness documentation | Explicit budgets in every bundle |
| One pending submission blocks all others | 26-29 hours per attempt near the deadline | discussion 760471, 761259 | Validate before every submission; keep attempts few and early |
| Byte-identical resubmission scores 0.00 | Status complete, result size 3,230 bytes | discussion 761004 | Recognise the signature and resubmit the same file; do not change the bundle in response |
| `edit_file` loses its search text | Dozens of identical failed calls | discussion 756051 | Helper editor with one string argument |
| A pipe hides a failing test | Green output, red exit code | discussion 760595 | `test` prints the real exit status |
| Scratch files in the workspace | Reproduction scripts appear in the patch | harness documentation, discussion 760595 | Repro scripts outside the repository; `finalize` |
| Edits to tests | Discarded by the grader | harness documentation | Refused by the helper |
| Whole-suite test runs | Timeouts | public bundles | One file or node only |
| Continuation nudge restarts the first stage | Lost context in two-stage pipelines | discussion 754636 | Idempotent installer and progress section |
| Compaction drops tool results | Agent forgets what it read | discussion 754783, 756336 | Issue and baton in the instruction; journal on disk |
| Thoughts not carried between tool calls | Reasoning repeated every turn | discussion 744354 | No reliance on thought memory; visible state only |
| Reads capped at 150 lines | Six re-reads of one file | discussion 755291 | `outline`, `ctx`, and a prompt rule against whole-file reads |
| Skill script sees its own folder | Search returned the skill's files | discussion 758854, 760886 | Installer locates the repository; helper runs through `run_command` |
| Skill-only bundle scores 0.00 | Works locally, 0.00 on the board | discussion 758547 | One skill call with no arguments; no-skill bundle as fallback |
| List argument freezes the server | All later tasks score zero | discussion 753973, 760830 | No list-argument tool attached |
| Long thinking on the small model | Fewer tasks, more time | discussion 760014 | Thinking 1,024 for E4B |
| Nested tools multiply argument errors | Schema errors | discussion 760014 | Four tools, scalar arguments |
| LoRA costs time and can silence thinking | Lower score with adapter than without | discussion 760309, 758968 | No adapter |
| Graph tools | No gain; no async functions | discussion 756400, 758854 | Not attached |
| Local evaluation on all 129 tasks | Noise | Document 01, Section 2.4 | Fixed panel without the 29 ungradable tasks |
| Trusting a single run | Wrong decisions | discussion 757588, 750907 | Three paired runs and a decision rule |
| Public-private split probing | Ban risk, infeasible | discussion 757626 | Not attempted |

### 10.6 A local evaluation protocol that can rank bundles

The leaderboard cannot rank bundles that differ by two tasks; a local protocol can, if it is built for the purpose.

| Element | Rule | Reason |
|---|---|---|
| Panel | 30 published tasks that an agent can address: specification gap none or minor, difficulty 3 or less, gradable in the sandbox; stratified by repository | Mixing in severe-gap or ungradable tasks adds noise without information |
| Exclusions | The 29 tasks whose tests import `inline_snapshot`, `dirty_equals` or an `httpbin` fixture | A correct patch cannot be verified on them |
| Repeats | Three runs per bundle, same tasks, same order | With a flip rate of 10-19%, one run cannot separate two bundles |
| Decision rule | A change is adopted when its mean resolved count is higher and it resolves strictly more tasks than it loses across the paired runs | Pairs cancel task difficulty |
| Speed calibration | Record mean seconds per model call locally; the scorer runs at about 17-25 tokens per second on 4xL4 | A local panel that is faster than the scorer hides time-outs |
| Run-level check | Mean seconds per task multiplied by the task count must stay below about 10 hours | The 12-hour limit is all-or-nothing |
| Per-task log | Resolved, time of first edit, calls used, refused edits, tests run, phase at submission, nudges, compactions | Shows where a bundle loses, which the score does not |

The proposed panel is listed in `03_Validation_Results_and_Submission_Playbook.md`. The ladder to climb: `bcf-noskill` as the floor, `bcf-flat` for the helper, `bcf-sequential` for the relay.

### 10.7 Submission plan

Deadlines: 2026-11-25 23:59 UTC for the notebook-publishing freeze and team merges; 2026-12-02 23:59 UTC for the final submission. With 26-29 hours per attempt and one pending submission at a time, only a handful of attempts remain.

| Step | Action | Why |
|---|---|---|
| 1 | Run the local panel on `bcf-31b-flat` and `bcf-31b-sequential`; measure the mean task time | Decides which relay to submit and whether the cap must come down |
| 2 | Submit the better 31B bundle first | Banks a score with the least unproven machinery |
| 3 | Submit `bcf-e4b-flat` once | The small-model prize requires an E4B submission among the two finals; it stays eligible for the main prizes |
| 4 | Iterate on measurements, not on public deltas below 0.05 | One public task is 0.017 and the flip rate is 10-19% |
| 5 | Before every submission: compile with the official compiler, then compare the result size after scoring | A result of about 3,230 bytes means a backend failure: resubmit the same file |
| 6 | Select the two finals by local mean, using the public score only to break ties | The private leaderboard is one draw |

### 10.8 The bonus track

The small-model prize goes to the best E4B or E2B submission on the private set, and the submission must be one of the two finals. On 2026-11-19 the public standings for eligible submissions were 0.12 for two teams, 0.10 for thirty and 0.08 for sixty-eight. E4B is the variant to choose: a public report describes a loading failure of the E2B checkpoint on the pinned serving stack (discussion 748287, comment of 2026-11-22).

The E4B bundles apply what the published E4B measurements support: the base model without an adapter, a small thinking budget, a short prompt with numbered steps, an early first edit and a single verification call. The helper does for the small model what it does for the large one, and matters more: with E4B, 56 of 83 failures had edited the right file and 12 had broken the syntax, so the compile gate and the all-or-nothing edit act directly on its main failure modes.

---

## 11. What was validated, and what was not

| Check | Method | Result |
|---|---|---|
| Helper behaviour | 37 tests on temporary repositories: editor matching, gates, protected paths, compile refusal, atomicity, line-range edits, line endings, repro and test runners, journal, clock phases, spec building, installer in a simulated skill environment | 36 pass, plus the real-snapshot test on two real checkouts |
| Editor fidelity on real code | All 129 published fixes converted to search/replace blocks and applied through the helper on the real snapshots, compared with `git apply` | 129 of 129 applied and byte-identical (278 files, 695 hunks); 4 files needed search context wider than three lines, 1 needed the line-range form |
| Localizer | 129 real snapshots, mechanical terms from each statement | Gold-touched file in the top 9 for 96 tasks, top 5 for 56; gold-edited function in the top 3 symbols for 42 of 121 |
| Speed on real checkouts | FastAPI (1,322 files) and rich (509 files) | Install 0.6-0.7 s, search 0.5-1.3 s, baton 0.5-1.1 s |
| Bundles | Official compiler with the harness's own limits; instruction rendering with the framework's own templating under both state shapes | 6 of 6 compile and render |
| Validator | 15 broken copies of a good bundle | 15 of 15 rejected for the intended reason |
| Prompts | Build-time checks: brace expressions, tabs, carriage returns, encoding, unfilled placeholders | Clean |
| Model behaviour | - | **Not tested** |
| Mean task time on the scorer | - | **Not measured** |
| Skill-script execution on the scorer | - | **Unknown**; open question on the forum |

Details, logs and the reproduction steps are in `03_Validation_Results_and_Submission_Playbook.md`.

---

## 12. Limitations and open risks

| Risk | Why it matters | Mitigation |
|---|---|---|
| The relay is unproven on this harness | Public evidence favours single agents; multi-agent decks scored below them | The flat twin is built from the same source; submit it if H1 fails |
| Mean task time is unknown | A run over 12 hours scores zero | Measure locally first; lower the per-task cap if the mean exceeds about 270 seconds |
| Skill scripts on the scorer | One team's skill-only bundle scored 0.00; staff have not answered | One no-argument skill call; no-helper procedure in the prompt; no-skill bundle |
| The skill tool has optional list arguments | A malformed list argument can freeze the model server | The planner passes none; the no-skill bundles have no skill tool |
| The planner may not relay the baton verbatim | A garbled baton weakens the solver's start | The solver falls back to its own search when the baton is missing; thinking 1,024 for the 31B planner, temperature 0 for E4B |
| The solver may repeat a refused edit | Wasted calls | The refusal prints the closest lines and the line-range alternative |
| Localisation is weak on title-only issues | 40% of the hit rate of descriptive issues | Early best-guess edit; the clock limits the cost |
| The 31B solver prompt is 5.6 KB | Lean prompts score best publicly | The E4B prompt is 2.8 KB; a shorter 31B prompt is the first thing to try if H1 or H2 fails |
| The task analysis describes published tasks | The scored tasks come from private repositories | The brain is repository-agnostic: keyword domain table, on-demand search |
| Scoring-side unknowns | Backend 0.00, reasoning dropped between tool calls | Procedural checks after every submission |

---

## 13. Sources

| Kind | Sources |
|---|---|
| Harness source | `adk-submission` 0.2.13 (`schema.py`, `compiler.py`, `resolvers/tools.py`), `swegemma` 0.2.11 (`harness/agent_runner.py`, `context.py`, `tools/base.py`, `tools/execution.py`, `tools/workspace.py`), `adk-eval-core` 0.1.0 (`sandbox/base.py`), `google-adk` 1.36.1 (`utils/instructions_utils.py`, `flows/llm_flows/contents.py`, `agents/sequential_agent.py`, `tools/skill_toolset.py`, `skills/_utils.py`), all from the public wheelhouse version 31 |
| Official documentation | Gemma 4 model cards and Technical Report (arXiv 2607.02770); vLLM documentation for Gemma 4 and reasoning outputs; vLLM issues 38488, 38887, 39130, 41991, 42664, 43562; ADK documentation on sequential agents, LLM agents, session state, compaction and skills; the agentskills.io specification |
| Discussion board | 743683, 744354, 745998, 747519, 748287, 750907, 751104, 752848, 753973, 754636, 754783, 755291, 756051, 756400, 756336, 757588, 757626, 758218, 758547, 758854, 758954, 758968, 758969, 760014, 760140, 760309, 760471, 760595, 760830, 760886, 760924, 761004, 761060, 761259 |
| Public code | `emamira02/gemma4-swe-agent` (heredoc editor and measured edit-channel failure rates), `pupa3066/gemma4-agent-track-blind-spots` (submission validator), `ozgung/gemma4-weight-edit-study`, `rathko/kaggle-glassbox` |
| Papers | SWE-agent (arXiv 2405.15793), Agentless (arXiv 2407.01489), AutoCodeRover (arXiv 2404.05427), SWE-smith (arXiv 2504.21798), R2E-Gym (arXiv 2504.07164), One Run Is Not Enough (arXiv 2611.19359) |
