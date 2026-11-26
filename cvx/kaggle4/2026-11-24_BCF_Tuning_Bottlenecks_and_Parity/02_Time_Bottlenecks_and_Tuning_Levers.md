# Task 2 - Wall-clock bottlenecks, the brain's tuning levers, and a fast feedback loop

**Prepared:** 2026-11-24. **Subject:** the six BCF bundles in `2026-11-23_BCF_Brain_and_Dataset_RCA/bcf-brain` as built on 2026-11-24. **Three parts:** (a) where the time goes, locally on an RTX 5090 and on Kaggle; (b) every juncture where the brain can be tuned, ranked by impact over effort; (c) how to iterate quickly despite (a).

---

## 0. The five numbers that decide everything

| Number | Value | Where it comes from | Why it decides the score |
| --- | --- | --- | --- |
| The whole-submission clock | 12 hours = 43,200 seconds, inclusive of sandbox setup, exclusive of patch validation | Overview page (fetched 2026-11-24) | One second over and the submission receives no score at all |
| Mean seconds per task that fits | 43,200 divided by the task count: 372 s at 116 tasks, 360 s at 120, 335 s at 129; with a 10% margin 335, 324 and 301 | Arithmetic; the hidden set is "roughly 120" tasks on the board and 58 public tasks on the leaderboard | The published bundles with the same budgets averaged 277 s (9.2 hours for 120 tasks); the brain's target is "at or below about 270" |
| Decode rate of the scorer | 13 to 25 tokens per second for the 31B model on 4x L4; 76% of a 300-second budget was decoding at about 17 tokens per second | Discussions 755291 and 758954 | At 17 tokens per second, a 4,096-token thinking budget is 241 seconds: half of the per-task cap |
| Budget per model call | 360 s divided by 28 calls is 12.9 s; at 17 to 25 tokens per second that is 219 to 322 generated tokens per call, thought included | Arithmetic on the two rows above | Every lever that removes a call or shortens a thought is worth more than any lever that adds reasoning |
| Attempts left | One submission per day, one pending at a time, 26 to 29 hours end to end, final deadline 2026-12-02 23:59 UTC | Rules page; discussions 760471 and 761259 (2026-11-23) | From today that is about seven usable attempts, each one noisy to plus or minus 0.03 to 0.06 |

The rest of this document explains where the 12 hours go, which knobs move them, and how to learn without spending an attempt.

---

## Part A. Where the time goes

### A.1 The clock, stage by stage

The harness runs each task in two sandboxes (source: `swegemma` 0.2.11, read locally). Container A is the agent's, Container B verifies. Only Container A is inside the 12 hours.

| Stage | What happens | Local, RTX 5090 | Kaggle L4x4 notebook | Official submission | Controllable by the bundle? |
| --- | --- | --- | --- | --- | --- |
| S0 Authoring and building | Edit parts, prompts, `build.py`, tests, official compiler | 2 minutes for tests (37 tests, about 90 seconds), seconds for the compiler | not applicable | not applicable | Yes: it is your time |
| S1 Server start | Weight load, kernel compile, CUDA graph capture | 2 to 10 minutes on the first boot of a session; seconds to relaunch a warm process | Cold starts of 514 to 1,677 seconds were reported on L4; the staff notebook allows 1,200 seconds | Same, once per scoring run; a start beyond the allowance ends the submission with an exception | Only through the size of the submission (an adapter adds load time; the brain ships none) |
| S2 Data | Unpack the 21.9 GB zip, index 129 snapshots (56 seconds), extract one snapshot per task | Minutes once; about 1 second per task afterwards | Mounted read-only; extraction per task | Mounted; extraction per task | No |
| S3 Container A setup | Start sandbox, stage wheels, extract snapshot, install the package editable, install test dependencies, write `pytest.ini` and `conftest.py`, make the baseline commit, print the workspace tree, **compile the submission again** | 10 to 60 seconds per task in Docker; 1 to 3 seconds in the subprocess backend | 1 to 3 seconds (subprocess) | Tens of seconds per task (Docker); 120 tasks times 30 seconds is one hour of the 12 | Partly: a larger bundle costs a little more to compile 120 times; nothing else |
| S4 Model calls | Time to first token plus generated tokens over the decode rate | 40 to 60 tokens per second single stream (estimate from bandwidth in the earlier guide; **not measured**) | 13 to 25 tokens per second | 13 to 25 tokens per second, shared with other sessions when the notebook runs tasks in parallel | Yes: thinking budget, output cap, prompt length, number of calls |
| S5 Tool calls | Each `run_command` starts `bash`, runs the helper, returns | Helper commands take 0.5 to 1.4 seconds on a real checkout; a test up to 45 seconds | Same, on 2 vCPUs | Same, on 2 vCPUs shared with vLLM's own CPU work | Yes: helper timeouts and helper speed |
| S6 Nudges and retries | A turn that ends without `submit_patch` restarts the root agent (and with it the planner); transient model errors are retried up to 5 times with backoff (2 s, doubling, 60 s cap) | Visible in the trace | Visible in the trace | Same | Yes: a short edit and an explicit `submit_patch` avoid both |
| S7 Patch extraction and teardown | `git add -N .` and `git diff --binary`, then stop the sandbox | 1 to 3 seconds | 1 to 3 seconds | 1 to 3 seconds | No |
| S8 Container B verification | Setup again, apply the patch in up to four passes, reset protected files, apply the test patch, run pytest with a 300-second timeout | 20 to 90 seconds per task | Same | Same, **outside** the 12 hours but inside the turnaround | No (it is excluded) |
| S9 Queue | Wait for a machine | None | The L4x4 pool can queue; sessions are capped at 12 hours and burn quota at twice the rate | 8 to 9 hours of queue plus 2 to 2.5 hours of scoring per the staff update of 2026-11-19; 26 to 29 hours end to end per teams on 2026-11-23 | No |
| S10 Feedback | A score | You read traces, patches and logs immediately | Traces and logs after the session ends | One scalar on 58 public tasks, plus the result size | No |

### A.2 What the arithmetic says about one task

With 120 tasks the average task must fit in 360 seconds including its setup. The BCF bundle allows 480 seconds of agent time plus a 240-second command tail, so **the bundle is safe only if the governor makes the average task end well before the cap**. That is the unmeasured number the validation report names first, and it is the first thing to measure locally.

Three consequences follow from the table above:

1. **Thinking is the largest single cost.** At 17 tokens per second the solver's 4,096-token thinking budget is 241 seconds if used; at 25 tokens per second it is 164. A model that thinks to the limit twice in a task has spent the whole cap on thought. The budget of 219 to 322 generated tokens per call means that **a thinking budget of 4,096 is fourteen to nineteen times the affordable average**. The published finding that 4,096 and 1,024 tied on solves for the small model (discussion 760014, confirmed by a team with about 2,000 runs in 760595) is the strongest hint that the large model can also think less.
2. **Setup is a fixed tax the bundle cannot see.** At 30 seconds per task, setup is 6% of the clock for 120 tasks. The governor's clock starts at install, which happens after setup, so the governor is blind to it: a mean agent time of 330 seconds is safe on its own and unsafe with the tax. Keep the mean agent time at or below 300 seconds until the real setup cost is known.
3. **The local rig is too fast to show the problem.** If the 5090 decodes at 40 to 60 tokens per second, every time gate of the helper (first edit by 150 s, verify by 300 s, freeze at 374 s) fires when the model has done 2 to 3.5 times more work than it will have done on the scorer at the same moment. A panel that never times out locally says nothing about the 12-hour risk.

### A.3 The local bottlenecks, ranked by how much of your day they take

| Rank | Bottleneck | Cost per occurrence | How often | What removes it |
| --- | --- | --- | --- | --- |
| 1 | The agent loop of a panel | 30 tasks at 277 s = 2.3 hours sequential; three runs per bundle = 7 hours | Every comparison | Concurrency on one 5090 (an estimate of three parallel sessions at the 14k-context compaction threshold beside 17 to 18 GB of weights: read the server's KV-cache log line to get the real number), a smaller smoke panel, and the no-model tiers of Part C |
| 2 | The server start | 2 to 10 minutes | Every reboot, every model swap, every crash | Never restart inside a working session; start once, run many; swap models through vLLM's sleep mode (level 2 discards weights; wake reloads) instead of a new process |
| 3 | The data package | 21.9 GB to download and unpack, 28 GB of snapshots | Once per machine | Do it once per operating system; keep the content-addressed store the RCA tools built (98 MB of text) for all no-model work |
| 4 | Trace reading by hand | 10 to 30 minutes per task | Every failure you want to understand | An extractor that prints one line per call (tool, seconds, tokens, status) from `traces/trace_<id>.json`; the harness writes one trace per task |
| 5 | Docker on Windows | Container start and `pip install -e` are slower through Docker Desktop's WSL2 engine | Every task in Docker mode | Use the subprocess backend for iteration and Docker only for the acceptance run; or run the whole rig on Zorin |
| 6 | The validator environment | The first setup downloads 870 MB | Once | Already scripted (`tools/setup_validate_venv.py`) |

### A.4 The remote bottlenecks, ranked by how much of the remaining calendar they take

| Rank | Bottleneck | Cost | What removes it |
| --- | --- | --- | --- |
| 1 | One pending submission blocks the next | 26 to 29 hours per attempt | Validate before every submission; never submit an untested change; keep the best-known bundle's exact bytes as the fallback |
| 2 | A silent 0.00 | One full slot (26 hours) for nothing | The signature is a result of about 3,230 bytes instead of 60 to 130 KB; resubmit the same file and ask for the slot back on thread 761004; do not change the bundle in response |
| 3 | The queue grows toward the deadline | The staff update promised under 24 hours for 94% of submissions; teams reported 26 to 29 hours on 2026-11-21 to 23 | Submit early in the day (UTC evening is the busiest); plan the last attempt for 2026-12-01 morning |
| 4 | One scalar per attempt | Noise of 4 to 5 tasks per run | Decide locally on paired panels; use the leaderboard to confirm, never to choose |
| 5 | L4x4 quota | Twice the rate of T4x2; about 15 hours of L4x4 per week on a 30-hour quota (check your account's quota panel) | Use the notebook tier for parity checks, not for exploration |

---

## Part B. Every tuning juncture, ranked by impact over effort

### B.1 How to read the table

- **Impact** is the expected effect on the two quantities that decide the private ranking, the mean and the spread of the single-run score (Document 02 of the RCA package, section 10.1), and on the mean task time that decides whether a run finishes. Scale 1 (small) to 5 (large).
- **Effort** is the work to make the change and to validate it at the cheapest tier that can decide it. Scale 1 (one line, minutes) to 5 (days, a model run per variant).
- **Evidence** names what is known today. "Board" means competitor-reported; "source" means read in the harness source; "measured" means measured on this machine without the model; "hypothesis" means no evidence yet.
- The rank is the order to try things in, given seven attempts and the calendar.

### B.2 The levers

| Rank | Lever | Where | Today | Try | Impact | Effort | Evidence | Deciding measurement |
| --- | --- | --- | --- | --- | ---: | ---: | --- | --- |
| 1 | Solver thinking budget | `build.py` `SAMPLING[("31b","solver")]` | 4096 | 2048, then 1024 | 5 on time, unknown on solves | 1 | The small model tied at 4,096 and 1,024 (board 760014, 760595); 4,096 is 164 to 241 s on the scorer | Paired panel runs; adopt if resolved is equal and mean time is lower (hypothesis H4 of the design document) |
| 2 | Governor gates | `parts/_bcf_head.py` `T_EDIT_S`, `T_VERIFY_S`, `FREEZE_FRAC`, `HARD_FRAC` | 150 s, 300 s, 0.78, 0.90 | 100 s, 220 s, 0.65, 0.82 | 4 on time and spread | 1 | First edit at 106 s in solved runs against 183 s in failed runs (board 752848) | Mean seconds per task and tasks lost at the freeze |
| 3 | Per-task budgets | `build.py` `EVAL` and `BUDGET_S` | 8 min, 28 calls, 80 turns, 240 s | 7 or 6 min if the mean is above 270 s; 24 calls; 48 turns; 120 s | 5 on the all-or-nothing risk | 1 | 15 minutes and 50 calls exceeded 12 hours (board 760140); 28 calls is the published cliff (761060) | Mean seconds per task on the local panel, projected to the scorer's rate |
| 4 | Solver prompt length | `src/prompts/solver_core_31b.md` | 5,585 characters | at most 3,000 | 3 on mean, 4 on spread | 2 | Lean prompts win; complex decks scored 0.06 to 0.08 (board 760924) | Panel; look at tool-call malformation rate in the trace |
| 5 | Topology | choice of bundle | relay and flat twins | flat | 3 | 1 | Public evidence favours single agents; a relay costs about 35 s and 2 calls per task, and every nudge re-runs the planner | H1: paired runs of `bcf-31b-sequential` and `bcf-31b-flat` |
| 6 | Localizer weights and cache | `parts/_bcf_find.py`, `cmd_find` | literals 6.0, identifiers 4.0, 8 s first-pass cap, three scans of the tree | one indexed scan with a cached file list; 4 s cap | 3 on mean, 2 on time | 2 | Measured without a model: top-9 file 96 of 129 | `tools/eval_localizer.py`; adopt when top-9 rises and the search stays under 1 s |
| 7 | Helper `status` cost | `cmd_status` in `parts/_bcf_tail.py` | runs `git status` and recompiles every changed file on each call | journal-only outside the freeze | 2 on time | 1 | Source: `_check()` is called by `status`, which the model calls often | `tools/bench_real.py`; seconds saved per task |
| 8 | Installer probe | `install()` in `parts/_bcf_tail.py` | `import pytest` with a 15 s timeout; `git rev-parse` | 5 s timeout, lazy | 1 | 1 | Source: the probe runs inside the skill call, inside the budget | Bench |
| 9 | Test and repro timeouts | `parts/_bcf_head.py` `CMD_TIMEOUT_S`, `REPRO_TIMEOUT_S` | 45 s, 40 s | 35 s, 25 s | 2 on time | 1 | Source; a test that needs more than 35 s is not a test the agent can use | Fraction of test calls that time out |
| 10 | Solver tool list | `build.py` solver YAML | `run_command`, `read_file`, `get_status`, `submit_patch` | drop `read_file` (the helper reads) | 2 on malformed calls | 1 | Board: multi-key tools fail more often; hypothesis for this list | Trace: malformed calls per 100 |
| 11 | Sampling temperature and seed | `build.py` `SAMPLING` | 0.2, no seed | 0.0 or 0.1; a fixed seed | 2 on spread | 1 | Temp 0 is not deterministic for agents (board 760014); lower temperature reduced nothing measurable so far | Spread across three paired runs |
| 12 | Output cap | `build.py` `max_output_tokens` | 8192 | 6144 for 31B; keep 8192 for E4B | 2 on time | 1 | A smaller output cap doubled edit errors for the small model (board 760014) | Count of MAX_TOKENS nudges |
| 13 | Planner thinking | `SAMPLING[("31b","plan")]` | 1024 | 0 | 2 on time | 1 | H5 of the design document | Baton relayed correctly on at least 29 of 30 |
| 14 | Route rules | `KIND_RULES` and `DOMAINS` in `parts/_bcf_head.py` | first match wins; C4 before C1; VAL before TYP | C1 before C4 for statements that contain "fix" and a warning word; TYP before VAL | 3 on mean | 1 | Source: `warn` matches "warning" in bug titles; `field` and `default` pull typing tasks into VAL | Replay the 129 statements through `classify` and `domain_of` and compare with the RCA labels: no model needed |
| 15 | Hints | `HINTS` | 17 lines | the additions of Task 1, section 6 | 2 | 1 | Task 1 of this package | Panel failures by domain |
| 16 | Protected-path rule and test flags | `PROTECTED_RE`, `cmd_test` | narrower than the harness; plain pytest | the harness rule; the five scorer flags | 2 on correctness of local signals | 1 | Task 1, section 6 | Helper tests |
| 17 | E4B thinking and prompts | `SAMPLING[("e4b", ...)]`, E4B prompts | 1024 solver, 256 planner, 2.8 KB | 0 or 512 solver; 0 planner | 3 on the bonus track | 1 | Board 760014: zero-think beat 4,096 by 16 to 10 on 114 tasks | H7: paired E4B panel |
| 18 | Skill or no skill | bundle choice | skill with a no-skill fallback | keep both until the first skill-carrying submission scores normally | 5 on the all-or-nothing risk | 0 | Board 758547; the Overview page says scripts run in the same container as `run_command` | First submission's result size |
| 19 | LoRA | none | none | none | negative by default | 5 | Board 760309 (minus 7 tasks for a zero-weight adapter), 758968 | Not worth an attempt before the deadline |

### B.3 Levers the bundle does not have

Three knobs would help and are not in the submission: the notebook's task concurrency (it decides how many sessions share the GPUs), `gpu_memory_utilization` (0.90 in the staff notebook, 0.80 in the older README), and the queue. Treat them as weather.

---

## Part C. Iterating fast despite the bottlenecks

### C.1 The ladder of feedback loops

Each tier answers a different question at a different cost. Climb only as far as the question requires.

| Tier | Question it answers | Cost | Uses the model? | Uses a Kaggle resource? |
| --- | --- | --- | --- | --- |
| T0 Static | Does the bundle build, pass hygiene and compile with the official compiler? | Seconds | No | No |
| T1 Helper | Does the helper still behave (37 tests), still replay the 129 gold fixes byte-identically, still localize as well or better? | 3 to 5 minutes | No | No |
| T2 Smoke | Does one task run end to end on this machine with this bundle, and what does one call cost in seconds and tokens? | 2 to 8 minutes | Yes | No |
| T3 Panel | Is bundle A better than bundle B on the same tasks? | 1 to 3 hours per run locally | Yes | No |
| T4 Parity | Does the same panel behave the same at the scorer's speed, in the staff harness, on L4? | 2 to 4 hours per run plus quota and queue | Yes | Yes: a notebook session, no submission slot |
| T5 Official | What does the leaderboard say? | 26 to 29 hours | Yes | Yes: one of about seven attempts |

**Work at the lowest tier that can decide the question.** Every helper change goes through T0 and T1 before any model time is spent. Every prompt change goes through T0, T2 and T3 before T4. T5 is for banking a score and for the two things only the real scorer can show: that skill scripts run, and that the mean task time fits.

### C.2 Removing each local bottleneck

| Bottleneck | Strategy |
| --- | --- |
| Server start per experiment | Start the server once per session and run every bundle against it: the model is the same for all six bundles. Swap between the 31B and the E4B server through sleep mode or by keeping two vLLM processes (the E4B server is small) rather than by restarting |
| Panel wall clock | Run three sessions in parallel on the 5090; parallelism also lowers each stream's decode rate toward the scorer's, which makes the time gates fire at a more realistic point |
| The rig is too fast | Project every local run to scorer time from its trace: for each model call, time to first token plus generated tokens over 17 to 25 tokens per second; for each tool call, its own duration unchanged. The projected mean is the number to compare with 360 seconds, not the local mean. Record tokens per call in the panel log |
| Hand-made traces | One extractor script, run after every panel: a table of task, resolved, projected seconds, calls, malformed calls, refused edits, tests run, phase at submission, nudges, compactions. The validation report already names these columns; the traces exist in `results/traces` |
| Docker on Windows | Iterate with `--sandbox subprocess`; run the acceptance panel in Docker once per bundle |
| Re-running what did not change | A fixed panel in a fixed order, a fixed seed where the harness allows one, and a results folder named by the bundle's SHA-256 so a rerun is recognisable |

### C.3 Removing each remote bottleneck

| Bottleneck | Strategy |
| --- | --- |
| One attempt per day | Never spend an attempt on a question that T3 or T4 can answer. Keep a short list of what only T5 can tell you and batch it into each attempt |
| The parity tier is slow | The staff Getting Started notebook is the harness: copy it, attach your bundle as a private dataset, select a 30-task panel, run. It burns GPU quota at twice the rate and needs no submission slot |
| Noise | Decide on paired runs: the same tasks, the same order, the same panel for both bundles. With a per-task flip rate of 10 to 19% one run cannot separate two bundles that differ by two tasks (Task 4, section 5) |
| A silent 0.00 | Check the result size after every scored run; resubmit the same file |
| The deadline | Freeze the bundle you will select as a final by 2026-11-30; use the remaining attempts to confirm it, not to explore |

### C.4 A weekly cadence that fits the calendar

| Day (UTC) | Local work | Kaggle work |
| --- | --- | --- |
| Nov 24 | Measure the mean task time of `bcf-31b-flat` on the smoke panel; fix the two helper defects of Task 1 (protected paths, test flags); run T0 and T1 | Submit the better of `bcf-31b-flat` and `bcf-31b-sequential` as validated on Nov 23; this is the attempt that answers "do skills run on the scorer" |
| Nov 25 | Panel comparison: thinking 4,096 against 2,048 (T3) | Notebook-publish freeze at 23:59 UTC: publish the notebook versions you may still need |
| Nov 26 | Adopt or reject lever 1; governor at the tighter gates (T3) | Read the Nov 24 result: score, hours to score, result size |
| Nov 27 | Localizer cache and weights (T1, no model) | Submit the improved 31B bundle if T3 says it is not worse |
| Nov 28 | E4B panel with thinking 0 against 1,024 (T3) | Submit the E4B bundle once (bonus eligibility needs one E4B submission among the two finals) |
| Nov 29 | Three paired runs of the two best bundles | Optional T4 parity run on L4 |
| Nov 30 | Freeze the two finalists by local mean | Submit the first finalist again only if its Nov result was abnormal |
| Dec 1 | Nothing new | Last safe morning for a submission; select the two finals |
| Dec 2 | Nothing new | Deadline 23:59 UTC |

### C.5 The hypothesis ledger

One row per idea, written before the run, so that a result cannot be reinterpreted afterwards.

| ID | Hypothesis | Tier | Adopt if | Reject if | State |
| --- | --- | --- | --- | --- | --- |
| H1 | The relay is at least as good as the flat twin | T3 | Mean resolved not lower | Any loss with no gain | Open |
| H2 | The helper's edit channel beats the heredoc editor | T3 | More resolved, fewer malformed calls | Equal | Open |
| H3 | Planner-written terms beat mechanical ones | T1 plus T2 | Top-9 above 96 of 129 | Equal or lower | Open |
| H4 | Solver thinking 2,048 loses nothing | T3 | Equal resolved, lower mean time | Lower resolved | Open |
| H5 | The planner can work without thinking | T2 plus T3 | Baton relayed on 29 of 30 | Fewer | Open |
| H6 | An earlier freeze keeps runs inside 12 hours | T3 with projection | Projected mean at or below 300 s with no loss | Lower resolved | Open |
| H7 | For E4B, thinking 1,024 beats thinking off | T3 | More resolved | Equal or lower | Open |
| H8 | The spec gap predicts wasted time | T3 logs | Severe-gap tasks use most of the budget | No difference | Open |
| H9 | Projected scorer time predicts the real mean | T5 against T3 | Within 15% | Otherwise recalibrate the rate | New in this document |

---

## 4. What is not known

| Gap | Why it matters | First measurement |
| --- | --- | --- |
| Mean seconds per task of any BCF bundle with the model | Decides the 12-hour risk and the per-task cap | One local panel with the projection of C.2 |
| The 5090's real decode rate for the 31B QAT checkpoint | Every projection depends on it | One smoke task: tokens and seconds per call from the trace |
| The scorer's setup cost per task in Docker | About 6% of the clock at 30 s per task | Not measurable by participants; assume 30 s |
| The scorer's task count | 58 public tasks; the total is "roughly 120" on the board | Not measurable; plan for 120 |
| Whether the projection holds | It rests on the published decode rate | Compare the projected mean with the hours to score of the first attempt |

---

## 5. Sources

| Source | Publisher | Date | Used for |
| --- | --- | --- | --- |
| Competition Overview, Rules pages | Kaggle | fetched 2026-11-24 | 12-hour rule, one submission per day, L4x4 quota at twice the rate, no internet on L4 sessions |
| [Getting Started notebook](https://www.kaggle.com/code/ryanholbrook/getting-started-gemma-4-developer-agent), version 3 | Ryan Holbrook (staff) | last run 2026-11-21 | Server settings, 0.90 memory utilisation, 1,200 s startup allowance, sequential tasks |
| `swegemma` 0.2.11, `adk-eval-core` 0.1.0, `adk-submission` 0.2.13 source (wheelhouse v31) and `HARNESS_README.md` | Kaggle | read 2026-11-24 | Stages S3 to S8, container limits, retry policy, nudges, artifacts |
| [vLLM 0.19.1 engine arguments](https://docs.vllm.ai/en/v0.19.1/configuration/engine_args.html), [sleep mode](https://docs.vllm.ai/en/v0.19.1/features/sleep_mode.html), [optimization](https://docs.vllm.ai/en/v0.19.1/configuration/optimization.html) | vLLM project | fetched 2026-11-24 | Memory utilisation default, sleep levels, optimization levels and start-up time |
| [Update on Submission Queue](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/760471) | Ashley Oldacre (staff), with comments to 2026-11-23 | 2026-11-19 to 23 | Queue and scoring times |
| [Byte-identical resubmission scored 0.00](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/761004) | Jiatian Zhang2 and others | 2026-11-22 to 23 | The 3,230-byte signature |
| [E4B trace-level diagnosis](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/760595), [1,800+ trials of a 4B agent](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/760014), [Variation is the biggest differentiator](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/760924), [What sets the ceiling here](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/761060) | competitors | 2026-11-18 to 23 | Decode rate, thinking budgets, lean prompts, the 28-call cliff |
| `02_BCF_Brain_Design_and_Justification.md` and `03_Validation_Results_and_Submission_Playbook.md` | this project | 2026-11-24 | Hypotheses H1 to H8, budgets, measured helper timings |
| Leaderboard capture | this machine | 2026-11-24 06:01 UTC | 6,605 teams; 0.24 x 16, 0.22 x 140, 0.20 x 640 |
