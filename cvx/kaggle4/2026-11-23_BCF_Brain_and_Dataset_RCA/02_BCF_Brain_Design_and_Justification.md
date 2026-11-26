# BCF Brain - design and justification for the Gemma 4 31B and E4B tracks

**Framework:** Batonic Coding Framework (BCF), profiles BCF-Gemma (base model `gemma-4-31b-it-qat-w4a16-ct`) and BCF-E (base model `gemma-4-e4b-it-qat-w4a16-ct`). **Prepared:** 2026-11-23. **Companion documents:** `01_Dataset_Taxonomy_and_Root_Cause_Analysis.md` (the task analysis this design rests on) and `03_Validation_Results_and_Submission_Playbook.md` (what was tested and how to reproduce it). **Code:** the `bcf-brain/` folder.

---

## 0. Summary

The BCF brain is a relay in which a **planner** reads the issue and hands a short specification (the baton) to a **solver**, and both are backed by one deterministic helper that does the editing, the searching, the verifying and the time-keeping. The model decides; the helper enforces.

| Component | What it is | Where it lives |
|---|---|---|
| Baton | An eleven-line specification: task, class, route, targets, names, verification recipe, hint, plan | Written by `bcf.py plan`, relayed by the planner, stored in `.git/bcf/spec.txt` |
| Cortex | `bcf.py`: single-writer editor with compile gate, localizer, repro and test runners, journal, clock | Copied into `/workspace/.git/bcf/` by `install.py` at the start of every task |
| Installer | `install.py`: finds the repository, copies the cortex, starts the clock, prints the repository map | `skills/bcf-spec/scripts/install.py`, called once with no arguments |
| Policy | Two prompts: planner and solver, with a procedure per route and per domain | `prompts/bcf_plan.md`, `prompts/solver.md` |
| Governor | Phase gates computed from a clock that starts at install: first edit by 150 s, verify by 300 s, freeze at 374 s, hard stop at 432 s | Inside `bcf.py`; the model is told the elapsed time in every reply |

Six ready-to-submit bundles were built from one source tree: `bcf-31b-sequential`, `bcf-31b-flat`, `bcf-31b-noskill` and their three E4B counterparts. The sequential bundles use the requested layout (root `SequentialAgent`: `bcf_plan` then `solver`). The flat bundles are control twins with one agent, the same helper and the same procedure. The no-skill bundles carry the same procedure without the helper and without any skill: they have no exposure to skill-tool hazards and serve as the emergency fallback and the ablation baseline.

What was verified on 2026-11-23, without running either model:

| Check | Result |
|---|---|
| Helper behaviour tests (editor, gates, governor, journal, repro, test runner, installer, line endings) | 37 of 37 pass when the optional real-snapshot test is enabled |
| Gold-patch replay: every one of the 129 published fixes applied through the helper's editor on the real repository snapshots | 129 of 129 applied, 129 of 129 byte-identical to `git apply` (278 files, 695 hunks) |
| Localizer on the 129 real snapshots with only mechanical terms from each statement | Gold-touched file in the top 9 for 96 of 129 tasks, in the top 5 for 56 of 129 |
| All six bundles compiled with the official harness compiler (`adk-submission` 0.2.13, `swegemma` 0.2.11) | 6 of 6 pass |
| Deliberately broken copies of a bundle (wrong skill name, unknown state variable, list-argument tool, null budget, and 11 more) | 15 of 15 rejected |
| Model behaviour: does the planner relay the baton, does the solver follow the route, does the sequential relay beat the flat twin on the leaderboard | **Not tested.** No Gemma 4 run was made, and the mean task time that decides whether a run finishes in 12 hours is unknown. These are the open questions of Section 12 |

---

## 1. Design inputs

### 1.1 Harness facts that constrain the brain

Every row was read in the pinned harness source (`adk-submission` 0.2.13, `swegemma` 0.2.11, `adk-eval-core` 0.1.0 from the public wheelhouse, `google-adk` 1.36.1), not taken from forum reports.

| Fact | Source | Consequence for the brain |
|---|---|---|
| A submission is declarative YAML only; agent configs reject unknown keys. A `SequentialAgent` accepts only name, description, agent class, sub-agents and callbacks | `adk_submission/schema.py` | The root file carries no model, tools or instruction. Everything lives in the two sub-agent files |
| An instruction placeholder written as `{name}` raises `KeyError` at the first model call when `name` is not in the session state; `{name?}` renders as empty | `google/adk/utils/instructions_utils.py` | The solver uses `{bcf_spec?}`. A literal brace in a prompt would silently stop every task, so the build refuses such prompts |
| With `include_contents: none` an agent sees only its instruction and the current turn; for a sub-agent the turn starts at the latest user message or at another agent's reply | `google/adk/flows/llm_flows/contents.py` | The solver sees the planner's last reply and nothing else: no duplicated planner output, no truncated history |
| Instruction text is sent again with every model request | ADK request builder | The issue and the baton survive context compaction when they are placed in the instruction |
| Each continuation nudge starts a new root run, and a `SequentialAgent` always runs its sub-agents from the first one | `sequential_agent.py`, `agent_runner.py` | A nudge re-runs the planner first. The brain turns this into a supervised restart instead of fighting it (Section 4.3) |
| The per-task time cap wraps planner, solver and nudges together; an in-flight command can outlive it by up to the command timeout | `agent_runner.py` lines 783-1025 | The clock starts at install, not when the solver begins; helper commands carry their own short timeouts |
| Tool calls are counted only for the harness tools; `get_status` and `submit_patch` are free; a skill-script execution counts as one | `context.py`, `adk_eval_core/sandbox/base.py` | The planner spends two of the 28 calls; the solver has 26 |
| A skill script runs inside the sandbox, but in a temporary folder that holds only the skill's files | `skill_toolset.py`, `AdkSandboxCodeExecutor.execute_code` | The installer must look for the repository; it cannot assume the working directory |
| `run_skill_script` has array-typed optional arguments, and the pinned vLLM 0.19.1 parser can loop forever on a list element containing a bracket | `skill_toolset.py`; vLLM issue and fix number 41991, merged after 0.19.1 | The installer takes no arguments, and no tool with a list argument is attached to any agent |
| File tools refuse paths outside `/workspace`; a read returns at most 150 lines and 10,000 characters; command output is cut at 5,000 characters | `swegemma/tools/workspace.py` | Helper output is capped at 3,800 characters and offers line-range reads and outlines |
| Edits to tests and test configuration are discarded by the grader | `agent_runner.py`, `verification.py` | The helper refuses to write them and reverts them in `check` and `finalize` |
| Unsubmitted changes are still captured as the patch when a task ends | `agent_runner.py` lines 1054-1094 | An edit that exists counts even if the solver runs out of time |

### 1.2 Competition evidence that shaped the design

| Evidence | Source | Design decision |
|---|---|---|
| The strongest public bundles are single agents at 8 minutes, 28 tool calls, 80 turns and a 240-second command timeout (about 277 seconds per task on average) | public bundles of three teams; discussion 758954 | Same budgets in all six bundles |
| Lean prompts win: the best public prompts are 1.2-2.6 KB; elaborate multi-agent decks solved locally and scored 0.06-0.08 | discussion 760924, 754636 | E4B prompts 1.2-3.1 KB; 31B solver prompt 5.6 KB. Rules that can be enforced by code were moved into the helper |
| Edits through `edit_file` failed often (41 of 78 calls malformed in one trace set; 31% of 248 calls in another), while a single-argument heredoc editor had 0 malformed calls in 807 | public agent `gemma4-swe-agent`, discussion 756051 | All file changes go through one helper command with a single string argument |
| Graph tools gave no gain and lack every async function; one of them takes a list argument | discussion 756400, 758854 | Not attached |
| A prompt instruction to compile after each edit was followed on about 24% of edits by the small model | discussion 760595, comment by a team with about 2,000 E4B runs | The compile gate runs in the helper, after every edit |
| About 65% of tasks had tests that already passed before the fix | discussion 760014 | `repro` requires a script to fail before any edit before it accepts a pass as proof |
| Long thinking hurt the small model (16 of 114 with thinking off versus 10 of 114 with a 4,096-token budget); 4,096 and 1,024 tied on solves | discussion 760014, 760595 | E4B solver thinks with a 1,024-token budget |
| A failed edit cuts later edit success from 90.5% to 57.2% | SWE-agent, arXiv 2405.15793 | One failed edit is refused as a whole, with the closest lines printed, so the next attempt succeeds |
| Over a quarter of 32B-agent trajectories contain a loop of ten or more repeated actions | SWE-smith, arXiv 2504.21798 | The helper refuses an identical repeated edit and the planner prompt forbids retries of a failed call |
| Context compaction triggers at 14,336 tokens and drops tool calls and results | harness configuration; discussion 754783 | State that must survive lives in the instruction and on disk, not in tool results |

### 1.3 Findings from the task analysis that shaped the brain

From `01_Dataset_Taxonomy_and_Root_Cause_Analysis.md`: 90 of 129 tasks are bug fixes and half of those are an unhandled input class with a fix of a few lines; 40% of the tasks have a severe specification gap; difficulty rises with the number of files; 29 tasks cannot be graded in the public sandbox; the statement's length predicts the route almost by itself. The brain therefore routes by statement level first and by engineering domain second, forces an early first edit, and treats verification as a requirement that something must be able to fail.

---

## 2. The brain in one page

```
            issue (statement)
                 │
     +-----------v------------+        skill: bcf-spec        +----------------------+
     │  planner  (bcf_plan)   │ --1. run_skill_script-------> │ install.py          │
     │  reads, classifies,    │                               │  finds /workspace   │
     │  hands over the baton  │ <--repo map, clock start----- │  copies bcf.py       │
     │                        │                               +----------------------+
     │                        │ --2. run_command: bcf.py plan <<'EOF' brief EOF
     │                        │ <--BCF-SPEC block (11 lines)
     │                        │ --3. final answer = the block  ==>  session state: bcf_spec
     +-----------+------------+
                 │  (the baton: written into the solver's instruction)
     +-----------v------------+        run_command  (the only write channel)
     │  solver                │ --------------------------------> /workspace/.git/bcf/bcf.py
     │  follows the route     │                                   find  outline  ctx  grep
     │  sees only its         │                                   apply  put  rm      (gated)
     │  instruction + baton   │                                   repro  test          (oracles)
     │  + its own work        │                                   status  resume       (journal)
     +-----------+------------+                                   check  finalize      (hygiene)
                 │                                                     │
                 +------------ submit_patch <------- READY ------------+
```

### 2.1 How the brain implements the four BCF axioms

| Axiom | Statement | Mechanism in this brain | Enforced by |
|---|---|---|---|
| A1 Conservation | Working code is never knowingly destroyed | Every edit is validated before it is written: the search text must exist exactly once and the result must compile; the file is replaced atomically; a failed edit writes nothing; test files are never touched and are reverted by `check` | `apply`, `put`, `check`, `finalize` |
| A2 Ascent | Every input yields a durable artifact | Each task leaves a baton and a journal: the spec, every applied edit, every test result and every note, in `/workspace/.git/bcf/`. After a nudge or a compaction the solver resumes from them | `journal.jsonl`, `spec.txt`, `resume` |
| A3 Single Writer | Exactly one authority mutates the working set | The solver has no `edit_file` and no `write_file`; the helper is the only writer, and the planner has no write tool at all | sub-agent YAML |
| A4 Grounded Truth | Nothing enters a patch unless it is traceable | A search block is accepted only when it matches the real file; a fix is accepted only when something that could fail passes; the baton names the identifiers of the issue and the functions found in the source | `apply`, `repro`, `test`, `find` |

### 2.2 The eight articles, and what this brain does with each

| Article | Intent | In this brain | Status |
|---|---|---|---|
| C1 Preserve working code | Never ship a regression | Compile gate on every edit; all-or-nothing edits; `finalize` before submission | Implemented |
| C2 Single point of contact, gated change | A risk gate approves every mutation | The helper is the gate: protected paths refused, ambiguous search refused, non-compiling result refused, writes refused after the freeze | Implemented |
| C3 Document the process | A ledger of every step | The journal records edits, test results and notes with elapsed time; `resume` prints it | Implemented |
| C4 Reference in a usable form | Reason from the source of truth | `find` prints the source of the top symbol; `ctx` prints numbered source lines to copy from | Implemented (repository as the reference) |
| C5 Structured search | Investigate by protocol, not by paging | Rarity-weighted localizer, outline, line-range reads | Implemented |
| C6 Clean-room composition | Assemble candidates from verified parts | Not attempted: a five-minute budget leaves no room for a second candidate | Not in this version |
| C7 Root-cause review and self-improvement | Learn from failures | The journal and the trace give the post-mortem material; the review loop itself runs outside the submission | Partly |
| C8 Effort governor | Spend thinking and time by phase | Clock, phases and freeze inside the helper; the model is told the elapsed time | Implemented |

---

## 3. Bundle anatomy

### 3.1 The requested hierarchy (sequential bundles)

```text
submission/
├── agent.yaml                      # SequentialAgent: bcf_plan -> solver
├── eval_config.yaml                # per-task budgets: 8 min, 28 calls, 80 turns, 240 s command timeout
├── sub_agents/
│   ├── bcf_plan.yaml               # LlmAgent, output_key: bcf_spec, include_contents: none
│   └── solver.yaml                 # LlmAgent, instruction includes {bcf_spec?}
├── prompts/
│   ├── bcf_plan.md
│   └── solver.md
├── configs/
│   ├── plan_sampling.yaml
│   └── solver_sampling.yaml
└── skills/
    └── bcf-spec/
        ├── SKILL.md                # when and how to use the helper
        └── scripts/
            ├── install.py          # copies bcf.py into <repo>/.git/bcf/ (no arguments)
            └── bcf.py              # classify + spec, edit, search, verify, journal, clock (stdlib only)
```

Two differences from the sketch in the request, both deliberate:

- **`{bcf_spec?}` instead of `{bcf_spec}`.** The optional form is the difference between a degraded task and a dead one: if the planner ever ends without visible text, the strict form raises `KeyError` in the solver's first model call and the task makes zero tool calls. The negative control in `03_Validation_Results_and_Submission_Playbook.md` reproduces exactly that error.
- **A `configs/` folder** holds the sampling parameters so that planner and solver can be tuned independently.

### 3.2 Root and sub-agent files (31B track)

```yaml
# agent.yaml
name: bcf_root
description: BCF relay. The planner classifies the issue and writes the spec; the solver applies it.
agent_class: SequentialAgent
sub_agents:
  - config_path: sub_agents/bcf_plan.yaml
  - config_path: sub_agents/solver.yaml
```

```yaml
# sub_agents/bcf_plan.yaml
agent_class: LlmAgent
name: bcf_plan
description: Classifies the issue and writes the BCF spec (the baton) for the solver.
model: gemma-4-31b-it-qat-w4a16-ct
instruction: !include ../prompts/bcf_plan.md
output_key: bcf_spec
include_contents: none
tools:
  - run_command
skills:
  - skills/bcf-spec
generate_content_config: !include ../configs/plan_sampling.yaml
```

```yaml
# sub_agents/solver.yaml
agent_class: LlmAgent
name: solver
description: Applies the BCF spec - locates, edits through the helper, verifies and submits.
model: gemma-4-31b-it-qat-w4a16-ct
instruction: !include ../prompts/solver.md
include_contents: none
tools:
  - run_command
  - read_file
  - get_status
  - submit_patch
generate_content_config: !include ../configs/solver_sampling.yaml
```

```yaml
# eval_config.yaml
evaluation:
  max_time_minutes: 8
  max_tool_calls: 28
  max_turns: 80
  timeout_seconds: 240
```

### 3.3 Differences between the bundles

| Setting | 31B relay | 31B flat | E4B relay | E4B flat |
|---|---|---|---|---|
| Model | `gemma-4-31b-it-qat-w4a16-ct` | same | `gemma-4-e4b-it-qat-w4a16-ct` | same |
| Topology | planner, then solver | one agent that plans for itself | planner, then solver | one agent |
| Solver tools | run_command, read_file, get_status, submit_patch | same plus the skill tools | same as 31B | same as 31B flat |
| Solver instruction | issue + baton, 5,585 characters | issue + planning steps + procedure, 6,524 characters | issue + baton, 2,799 characters | 3,141 characters |
| Planner instruction | 2,488 characters | none | 1,157 characters | none |
| Solver sampling | temperature 0.2, top_p 0.95, 8,192 output tokens, thinking 4,096 | same | temperature 0.2, top_p 0.95, 8,192 output tokens, thinking 1,024 | same |
| Planner sampling | temperature 0.2, 2,048 output tokens, thinking 1,024 | none | temperature 0.0, 2,048 output tokens, thinking 256 | none |
| Budgets | 8 minutes, 28 calls, 80 turns, 240 seconds | same | same | same |
| Bundle size | 74.4 KB in 11 files | 71.8 KB in 7 files | 70.3 KB in 11 files | 68.4 KB in 7 files |

The flat bundles exist for one reason: nobody has yet shown that a two-stage relay scores well on this harness, and a competitor reports that every multi-agent deck tried so far scored below a plain single agent (discussion 760924). The flat twin has the same helper, the same budgets and the same procedure, so a paired comparison between the two isolates the effect of the relay alone (Section 10.6).

The no-skill bundles (`bcf-31b-noskill`: 4 files, 4.9 KB, solver prompt 4,054 characters; `bcf-e4b-noskill`: 4 files, 2.8 KB, solver prompt 1,998 characters) declare no skill and attach four harness tools only. They follow the same call plan and edit through short Python heredocs in `run_command`. They give up the helper's gates and keep its discipline in prose. They are the bundle to submit if a skill-carrying bundle ever completes with 0.00 while working locally, which one team has reported (discussion 758547).

---

## 4. How a task runs

### 4.1 Timeline of one task (31B track)

| Time | Step | Actor | What happens |
|---|---|---|---|
| 0 s | Call 1 | planner | `run_skill_script` with `skill_name` `bcf-spec` and `file_path` `scripts/install.py`, no other argument. The installer copies the helper into `/workspace/.git/bcf/`, starts the clock and prints the repository map |
| about 10 s | Call 2 | planner | One `run_command`: `python3 /workspace/.git/bcf/bcf.py plan` with a five-line brief on standard input. The helper classifies, searches and prints the baton |
| about 20-45 s | Final answer | planner | The planner repeats the baton as its final answer. The framework stores it in the session state as `bcf_spec` |
| 35 s on | Calls 3-28 | solver | Follows the route: `ctx` on the first target, `apply` the fix, `repro` or `test`, `finalize`, `submit_patch` |
| 150 s | Gate | helper | A first edit should exist; `status` says so if it does not |
| 300 s | Gate | helper | Verification should be under way |
| 374 s | Freeze | helper | `apply`, `put` and `rm` are refused; only reading, checking, journaling and `finalize` remain |
| 432 s | Hard stop | helper | Every reply starts with "call submit_patch now" |
| 480 s | Cap | harness | The session ends; whatever is on disk is graded |

The planner's 20-45 seconds are an estimate from decode speeds reported for the 4xL4 scorer (about 17-25 tokens per second) and the roughly 300 to 800 tokens the planner writes across its three turns, thought included; they were not measured with the model. On a real FastAPI checkout the helper itself needs about 0.7 seconds for the install and 1.1 seconds for the search (Section 11).

### 4.2 Why each setting is what it is

| Setting | Value | Reason |
|---|---|---|
| Planner `include_contents` | none | The planner needs only the issue and its own two tool calls. It is not sent the 2,500-3,000 tokens of harness preamble, and on a re-entry it is not sent its earlier work |
| Solver `include_contents` | none | The solver's context is its instruction, the planner's last reply and its own tool calls. The planner's tool output (repository map, search result) never enters it twice |
| `{problem_description}` in both instructions | yes | The harness delivers the issue in a user message. An agent with `include_contents: none` would not see it otherwise, and an instruction is repeated on every request, so the issue cannot be compacted away |
| Planner tools | `run_command` and the skill | Nothing more: the planner cannot read the repository at large, so it cannot start solving |
| Solver tools | four harness tools | `edit_file` and `write_file` are withheld on purpose: the single-writer axiom is enforced by the tool list, not by a prompt |
| `output_key` | `bcf_spec` | The planner's final text becomes the solver's instruction variable |
| Budgets | 8 minutes, 28 calls, 80 turns, 240 seconds | The largest budgets with public evidence of finishing inside the 12-hour notebook limit; larger ones have produced no score |
| Command timeout | 240 seconds | Kept at the proven value because it may also bound the hidden-test run. The helper's own commands are much shorter (45 seconds for a test, 40 for a repro, 20 for a search) |
| No graph tools | - | No measured gain, no async functions, one list-typed argument |
| Solver prompt length | 5.6 KB | Longer than the leanest public prompts. The additional text is the procedure per route, which is what makes the brain category-aware; the E4B variant is 2.8 KB |

### 4.3 Nudges: turning a harness hazard into a supervised restart

When the solver ends a turn without calling `submit_patch` - because it hit the output-token limit on a long edit or answered with plain text - the harness sends a continuation note and starts the root agent again. A `SequentialAgent` then runs the planner first. Competitors report that this restart destroyed their two-stage pipelines (discussion 754636). The BCF relay is built for it:

1. The planner's first instruction is always the installer, and the installer is idempotent: on a second call it prints `BCF ALREADY INSTALLED`, the elapsed time and the stored baton with a progress section, and it tells the planner not to plan again.
2. The planner relays the baton with the progress lines. Its re-entry costs two model turns.
3. The solver, whose context starts again from the planner's last reply, sees what was already done (files edited, checks run, the next action) and continues from there; `resume` prints the journal if more detail is needed.

The progress section is written by the helper from the journal, never by the model, so it is accurate after a truncation. A restart costs two model turns, on the order of 15-30 seconds on the 31B track; it happens only when the solver failed to finish a turn, which the solver prompt discourages by requiring short edits.

### 4.4 Context and compaction

The scorer compacts a conversation when it reaches 14,336 tokens and keeps only text, so tool calls and their results disappear. Three design choices limit the damage:

- **The issue and the baton are in the instruction.** They are re-sent with every request and cannot be compacted.
- **The solver's context is small.** It holds the planner's last reply (about 200 tokens) and the solver's own work, instead of the harness preamble, the repository tree and the planner's tool output.
- **What matters is also on disk.** Every edit and every test result is in the journal. If the solver loses its working context, `resume` restores the facts in about 150 tokens.

### 4.5 Time and the 12-hour limit

The scoring notebook must finish all tasks in 12 hours or the submission gets no score at all. Per task, the worst case is the 8-minute cap plus the up-to-240-second tail of a command that was running when the cap hit. The published bundles with these budgets averaged 277 seconds per task, about 9.2 hours for 120 tasks. BCF's budget plan is designed to keep that average: a task ends when the solver calls `submit_patch`, and the plan pushes the solver to that point - first edit by 150 seconds, verification by 300, freeze at 374 - rather than letting it use the full cap. **This average has not been measured with the model and is the first number to establish locally before submitting** (Section 10.6): a two-stage relay that spends 35 seconds planning and then still uses the whole cap on every task would not finish.

---

## 5. The deterministic cortex: `bcf.py`

One standard-library Python file (59.0 KB), installed into the repository's `.git/bcf/` folder so that it can never appear in a patch. It never raises, always exits with status 0 and reports problems as text, because a non-zero exit would make the harness return an error object in which the model may not find the explanation. Its output is capped at 3,800 characters, below the harness limit of 5,000.

### 5.1 Commands

| Command | What it does | Why it exists |
|---|---|---|
| `map` | Repository map: packages, where the Python files are, test and example counts, files too large to read whole | Replaces the harness's pruned directory tree for an agent that does not see the task prompt |
| `find terms` | Ranks functions and classes by the terms, prints the top nine with line ranges, the top five files, related tests, literal matches and the source of the best symbol | Deterministic localisation; the model re-ranks nine candidates instead of paging through files |
| `outline path` | Every class and function of a file with line ranges | Navigation in files of 5,000 lines that a 150-line read cannot cover |
| `ctx path line [before after]` | Numbered source lines around a line, at most 70 | Exact text to copy into a search block |
| `grep regex [--in part] [--max n]` | Regular-expression search with compact output | One cheap call instead of several file reads |
| `apply path [A-B]` | Edit with search/replace blocks from standard input; or replace, insert or delete a line range | The single write channel |
| `put path` | Create or replace a file with the content from standard input | New modules and example files |
| `rm path` | Delete one source file | Removals and refactors |
| `repro [name]` | Runs a script from standard input from a folder outside the repository; remembers the result before the fix | An oracle that must fail first |
| `test target [-k expr]` | Runs one test file or node with a timeout and prints the true exit status | The `tail` pipe that hides a failing exit code is a known trap |
| `note text` | Appends a line to the journal | Free-form memory that survives compaction |
| `status` | Elapsed and remaining time, phase, number of edits, changed files, the next action | The model cannot keep time; this can |
| `resume` | `status` plus the last ten journal entries | Restart after a nudge or a compaction |
| `plan` | Builds the baton from a brief on standard input and stores it | The planner's only real decision is the brief |
| `spec` | Prints the stored baton with a progress section | Used by the installer on a re-entry |
| `check` | Reverts test and configuration files, compiles every changed Python file, lists the changes | Hygiene without ending the task |
| `finalize` | `check`, removes scratch files, and says whether the tree is ready | The last command before `submit_patch` |

### 5.2 The single-writer editor

A search/replace block is accepted only when it can be applied unambiguously, and the whole call is all-or-nothing:

1. **Locate.** The search text must occur exactly once, ignoring indentation and surrounding whitespace. If it occurs several times the edit is refused and the line numbers are listed. If it does not occur, the closest lines are printed with their numbers so that the next attempt can copy them.
2. **Validate.** The edited file must compile. A syntax error is reported with its line and column and nothing is written.
3. **Write atomically.** The new content goes to a temporary file in the same folder and replaces the old one; the file's line-ending style is preserved, so an edit to a Windows-style file stays a one-line change.
4. **Journal.** The edit is recorded with the elapsed time.

Files under tests, test modules, `conftest.py`, `pytest.ini`, `pyproject.toml`, `tox.ini`, `setup.cfg`, `sitecustomize.py` and `.pth` files are never written: the grader discards changes to them, so a tool call spent on them is a wasted call.

**Why a search/replace block and not the stock `edit_file`.** The stock tool takes three named arguments, and the model's tool-call format emits arguments in alphabetical order, so the long replacement is produced before the text to be replaced; when the replacement is cut off or closed wrongly, the search text is lost (discussion 756051, 758968). The helper's edit is one `run_command` with a single string argument in a quoted heredoc, which passes code through without escaping. The published measurements behind this choice are in Section 1.2; the replay of all 129 published fixes through this editor (Section 11) shows that it reproduces `git apply` byte for byte.

**The line-range form.** When a search block is refused twice, the solver can replace lines by number (`apply path 120-125`). It is the only way to edit a file that contains three near-identical blocks, which happened in one of the 278 replayed files.

### 5.3 The governor

The clock starts when the installer runs and is kept in a file, so it does not depend on the model remembering anything.

| Phase | From | What the helper does |
|---|---|---|
| Explore | 0 s | Everything is allowed; after the first edit the reply says so and names the next step |
| Verify | 300 s | `status` points at verification, then at finishing |
| Freeze | 374 s (78% of the budget) | `apply`, `put`, `rm`, `repro` and `test` are refused; reading, checking, journaling and `finalize` remain. Every reply states the freeze and the next command |
| Hard stop | 432 s (90% of the budget) | Only `status`, `check` and `finalize` remain; every reply starts with "call submit_patch now" |

The governor is a policy in code because a budget instruction in a prompt is unreliable: a team that audited 114 tasks with the small model reported that budget instructions in the prompt were ignored on 61% of them (discussion 760014).

### 5.4 The journal

Every applied edit, every test and repro result and every note is a line in `journal.jsonl` with its elapsed time. The baton's progress section is generated from it: how many edits, in which files, which checks ran with which result, the latest notes. Three things read it: the installer on a re-entry, `status` (which chooses its "next" line from what has and has not been done) and `resume`.

### 5.5 The localizer

`find` scores every text file by the rarity-weighted occurrences of its terms: quoted literals count most, identifiers and file paths next, parts of identifiers least. Package source outranks tests, examples and documentation. It then parses the best files and ranks their functions and classes, with a penalty for very large ones so that a focused function outranks a 4,000-line class that merely mentions the term. A path named in the issue is matched directly. Source files are scanned before tests and documentation so that a slow disk cannot hide the answer.

Measured on the 129 real snapshots with only mechanical terms taken from each statement (Section 11): the gold-touched file is among the top nine symbols' files for 96 tasks and in the top five files for 56; the gold-edited function itself is in the top three symbols for 42 of the 121 tasks where the fix is inside a function. A search takes about 0.4 seconds in memory and about 1.1 seconds on a cold 1,322-file checkout.

### 5.6 Classification and the baton

`plan` reads a brief of up to seven lines (`task`, `kind`, `names`, `expect`, `repro`, `scope`, `gap`) and derives:

| Baton line | How it is derived |
|---|---|
| `TASK` | The planner's one-line description |
| `CLASS` | Category from the planner's `kind` word, else from keyword rules on the task text; domain from a keyword table of 17 engineering domains |
| `ROUTE` | Category plus `repro` and `scope`: bug with a repro gives P2, bug without gives P3, feature gives P4, behaviour change and refactor give P7, documentation gives P8, build gives P9, and a task marked as huge gives P10 |
| `GAP` | The planner's judgement; if absent, severe when the issue yields at most one usable term |
| `TARGETS` | The top four results of the localizer for the `names` |
| `NAMES` | The identifiers, literals and paths the planner extracted |
| `VERIFY` | Repro when the issue shows one, otherwise one related test file |
| `HINT` | One line of domain-specific advice (the category brain of Section 8) |
| `PLAN` | The budget milestones |

The helper does the mechanical part so that the planner's output is small and consistent, and the solver receives a baton that was produced by code rather than recalled by a model.

---

## 6. The installer and the skill

`install.py` takes no arguments and is the planner's first and only skill call. It runs in the environment the framework creates for skill scripts: inside the sandbox, but in a temporary folder that holds only the skill's own files (fact A9). So it:

1. finds the repository by probing `/workspace`, the `BCF_REPO` variable, the folders above the working directory and two directory levels below the usual mount points;
2. copies `bcf.py` to `<repo>/.git/bcf/bcf.py` unless an identical file is already there;
3. loads the helper and calls its install routine, which starts the clock, resets the journal from any earlier task, prints the repository map, the environment line, the budget milestones and the exact next command.

If the repository cannot be found, or the helper cannot be loaded, the installer prints `BCF-INSTALL-FAILED` followed by the no-helper procedure and exits with status 0, so that the model always receives an instruction it can act on.

`SKILL.md` contains one instruction: make that call, and run the helper itself only through `run_command` inside the repository, never through `run_skill_script`. Its name is `bcf-spec`, in the lowercase hyphenated form the framework requires (a competitor lost two submissions to an underscore in a skill name; discussion 758854).

**Known open question.** A team reported that a bundle whose only tool was a skill script resolved 40% of tasks locally and scored 0.00 twice on the leaderboard (discussion 758547); staff have not answered whether the scoring environment differs. BCF limits its exposure: the skill is called once, with no arguments, and every later step goes through the harness's own `run_command`. If the skill script does not run on the scorer, the solver falls back to the procedure written for that case (Section 7.3).

---

## 7. The prompts

### 7.1 Planner (31B track, 2,488 characters)

Three numbered steps, a short guide to filling the brief, and the rules. The planner is told to pass no other argument to the skill call, never to call the skill-discovery tools or any search tool, and to return the baton and nothing else. If the installer fails, its final answer is a fixed fallback baton that tells the solver to work without the helper.

### 7.2 Solver (31B track, 5,585 characters)

The issue and the baton come from the session state. The rest is the operating procedure:

- **One worked example** of the edit command. An in-context tool example is the cheapest known way to reduce malformed calls (SWE-agent, arXiv 2405.15793, Table 3).
- **Hard limits** in the vocabulary of the harness: 28 calls, 8 minutes, an edit that exists counts, tests are never touched, the whole suite is never run.
- **A call plan**: calls 1-4 locate, 4-10 edit, a first edit by call 10 and before 150 seconds, 11-20 verify, from 20 finish.
- **A procedure per route** (P1 to P10).
- **Decision rules** for the situations that stall agents: an ambiguous issue, several possible places, an empty search, a rejected edit, a failed fix, and the rule that no task needs no change.
- **Interruption and no-helper rules.**

### 7.3 Rules the prompts follow

| Rule | Reason |
|---|---|
| No braces except the two state variables | A brace expression is read as a state variable and stops every task (fact A2) |
| Every number comes from one place | The build script copies the budget constants out of `bcf.py` and `eval_config.yaml` into the prompts |
| Short sentences, numbered steps, one idea per line | A quantized 31B model follows a checklist better than a paragraph; public evidence favours lean prompts |
| State what to do, and state the reason once | "Never touch tests (they are discarded)" is followed more often than "never touch tests" |
| The helper is the example | The model sees one complete command, not an abstract description |
| Nothing is asked of the model that code can enforce | Compiling, time-keeping, test-file protection and journaling are in the helper |

### 7.4 E4B prompts

The small model gets fewer words and more structure: a planner prompt of 1,157 characters with a two-line brief (task and names), and a solver prompt of 2,799 characters with seven numbered steps, a first edit by call 6, one verification, and five rules. The classification is left to the helper's keyword rules. The evidence for the differences is in Section 9.

---

## 8. The brain per category and sub-category

### 8.1 Statement level decides how much exploration is justified

| Statement level | Share of the 129 tasks | What the solver does |
|---|---|---|
| Prescriptive: the issue contains code and a fix | 9% | Route P2: apply the fix the issue gives after confirming that its example fails |
| Descriptive: 250 characters or more | 54% | Routes P1, P2, P3 or P4: reproduce, locate by the issue's identifiers, fix the cause |
| Title plus a link | 21% | Route P3: the link is unreachable, so the title is all there is; locate by its words, make a best-guess edit early |
| Title only | 16% | Routes P3, P4, P8 or P10: smallest plausible change, submit early |

### 8.2 Category and statement together decide the route

The route is the procedure the solver follows. The table lists the ten routes with the number of published tasks that the root-cause review assigned to each; the counts sum to 129.

| Route | Name | Published tasks | Categories served | Mean difficulty | First action | Oracle | Stop rule |
| --- | --- | ---: | --- | ---: | --- | --- | --- |
| P1 | Prescribe | 22 | bug fix (17), behaviour change (3), build tooling (1), new feature (1) | 1.86 | Run the issue's example; it must fail | The same example passes | One verification |
| P10 | Timeboxed-slice | 6 | behaviour change (2), new feature (2), bug fix (1), refactor (1) | 5.00 | Smallest change that satisfies the visible part | The package imports | Submit before the freeze |
| P2 | Repro-driven bugfix | 27 | bug fix (26), behaviour change (1) | 2.33 | Turn the issue's example into a script outside the repository | Script fails before the fix, passes after | One fix, one correction |
| P3 | Title-hunt | 44 | bug fix (40), behaviour change (3), new feature (1) | 3.05 | Rank symbols by the issue's words and read the top symbol | One related test file or an inline assertion | First edit early; no new exploration late |
| P4 | Feature-synthesis | 15 | new feature (13), refactor (1), behaviour change (1) | 3.80 | Find the closest sibling implementation and its registration points | The sibling's tests, run for the new name | Every visible requirement wired |
| P5 | Schema-contract | 4 | bug fix (3), behaviour change (1) | 3.25 | Print the generated schema for a minimal application | Exact comparison of the structure | One regeneration |
| P6 | Compat-shim | 3 | bug fix (2), refactor (1) | 4.33 | Find where the version is detected | Both code paths import | One branch |
| P7 | Mechanical-sweep | 4 | refactor (2), bug fix (1), new feature (1) | 3.25 | List every call site | Compile after each file; sibling tests | All sites changed |
| P8 | Docs-example | 3 | documentation (3) | 2.67 | Find the example module the tutorial tests import | The tutorial test file | Example matches the issue |
| P9 | Build-tooling | 1 | build tooling (1) | 5.00 | Read the neighbouring script | Run the script on a dry input | The script runs |
| Total |  | 129 |  | 2.92 |  |  |  |

The helper derives the route from the category, the domain and two facts about the issue: whether it shows a reproducible failure, and whether the planner marked it as huge. A bug fix with a reproducible failure takes P2 and without one takes P3; a feature takes P4; a behaviour change or a refactor takes P7; documentation takes P8; build tooling takes P9. Two domains override this: a task in the schema domain takes P5 and a task in the compatibility domain takes P6. A task marked as huge takes P10 in every case. The solver prompt describes all ten routes.

### 8.3 Sub-category decides the hint

The helper carries one line of domain advice for each of the 17 sub-categories and puts it in the baton. The middle column is the exact text the model receives; the right column names the root-cause finding it encodes.

| Sub-category | Hint in the baton (exact text) | Root-cause finding it encodes |
| --- | --- | --- |
| request/validation parameter handling | Trace one request value end to end; multi-value containers often collapse to the last value. | Multi-value containers collapsed to one value; aliases were read from one property in five places |
| type-annotation and model introspection | Resolve the annotation the way typing.get_type_hints does; check wrapped/deferred/Annotated forms. | Each new typing construct was an unhandled branch in the hand-written resolver |
| schema/contract generation | Print the generated structure before and after; hidden tests compare exact keys and values. | Keys assumed to be strings; schemas shared, duplicated or missing fields; 15 tasks compare the schema exactly |
| dependency-injection machinery | Find where the dependency graph is built and cached; check hashing, scopes and callable wrapping. | Cache keys and scope lists drifted from the dependency tree; wrapped, partial and class callables not recognised |
| routing and lifecycle | Follow construction order (init, include, startup, teardown); register new behaviour at every entry point. | One rule in several places; regressions after internal rewrites |
| serialisation and streaming | Check the encoder selected for the return type and the exact wire format (bytes/frames). | Encoders and wire formats compared literally |
| security and auth | Follow the credential from header to verifier; statuses and WWW-Authenticate values are literal. | Status codes and `WWW-Authenticate` asserted exactly; whitespace and content-type handling |
| compatibility shims | Branch on the runtime version once, in one place; keep both code paths importable. | Parallel stacks for two dependency versions of the same library |
| text measurement and segmentation | Run a one-line script printing widths/segments for the failing input before editing. | Arithmetic on mixed-width text; scans that do not terminate |
| markup / markdown / syntax parsing | Build a minimal input string and print the parsed tokens; escaping bugs show up immediately. | Escaping and tokenising defects that show on a small input string |
| widget rendering and styling | Render the widget to text with record/capture and compare styles per segment. | Measure and draw disagreed on padding and styles |
| console / terminal I/O | Check the detection predicate (isatty, env var, pipe) and its default in each code path. | Detection predicates: tty, pipes, capture flags |
| developer-facing introspection | Feed a crafted object/exception and print the rendered output; compare wording exactly. | Wording and structure compared exactly; recursion without a visited set |
| network / HTTP protocol behaviour | Print the parsed structure for a crafted header/URL; mind case and whitespace handling. | Byte counts, separators, history lists, keep-alive state |
| object protocol and duck typing | Replace type checks with capability checks where duck-typed objects are accepted. | `isinstance` failed on proxies that expose attributes through `__getattr__` |
| documentation examples | Hidden tutorial tests import example modules: edit the example app exactly as documented. | 13 tasks have tutorial tests that import example modules |
| build, release and tooling | Keep it mechanical: the same edit in every call site, compile after each file. | Large mechanical patches; version ranges |
| (none of the above) | Locate where the wrong value is produced (not where it is observed); fix the cause. | Used when no domain keyword matches |

### 8.4 How the three tables reach the model

The statement level reaches the solver twice: as the planner's `GAP` line in the baton (the planner prompt tells it to write "severe" when the issue is only a title), and indirectly through the number of targets, because a short issue yields few terms for the search. The category and the route arrive as the `CLASS` and `ROUTE` lines, the sub-category as `CLASS` and `HINT`. None of this depends on the repository being one of the four published ones, which matters because the scored tasks come from private repositories.

---

## 9. The two tracks

### 9.1 Why the tracks differ

| Aspect | 31B track | E4B track | Evidence |
|---|---|---|---|
| Thinking budget of the solver | 4,096 tokens | 1,024 tokens | Thinking off beat a 4,096 budget 16 to 10 on 114 tasks; 4,096 and 1,024 tied on solves with 1,024 cheaper in time (discussion 760014, 760595) |
| Planner | Writes a five-line brief: task, kind, names, expectation, repro, gap | Writes a two-line brief: task and names | Classification is a reasoning step that the small model does not do reliably; the helper's keyword rules take it over |
| Solver prompt | 5,585 characters, a procedure per route, decision rules | 2,799 characters, seven numbered steps, five rules | Small models lose rules in long prompts (discussion 760924) |
| First edit due | Call 10, before 150 s | Call 6, before 150 s | The small model edited the right file in 56 of 83 failures and broke the syntax in 12; its limit is writing the fix (discussion 760595) |
| Verification | Repro or one test file, up to three calls | One verification call | The small model submits early (median 91 seconds of 480) and gains nothing from extra checks it cannot use |
| Planner temperature | 0.2 | 0.0 | The E4B planner's job is to relay a block verbatim |
| LoRA adapter | None by default | None by default | A zero-weight adapter cost 7 of 129 tasks on its own; adapters were seen to silence the thinking channel (discussion 760309, 758968) |
| Bonus eligibility | Main track only | Main track and the $10,000 small-model prize | The small-model prize requires the E4B submission to be one of the two final selections |

Both tracks use the same helper, the same budgets and the same tool lists. The helper is where the small model gets most of its leverage: a team with about 2,000 E4B runs reported that across all weight-side experiments the net new coverage was about four tasks while all other gains came from the scaffold around the model (discussion 760595, comment by Adam Johnson).

### 9.2 LoRA posture

The BCF bundles carry no adapter. Adding one is a separate decision with three conditions, each drawn from a published failure: the adapter must be trained against the unquantized base model, as the rules require; the reasoning channel must still be present with the adapter loaded (0 of 109 calls carried it for one team); and the time budget must absorb the roughly 20-25% speed loss, which was worth 7 tasks on 129 in one measurement. A trained adapter has to beat the base model by more than that before it is worth a finals slot.

### 9.3 The flat twin

`bcf-31b-flat` and `bcf-e4b-flat` make the same agent install the helper in its first call, build the baton in its second, and then follow the same procedure. They differ from the sequential bundles in one respect only: the baton is read from the tool result inside the conversation instead of being carried in a second agent's instruction. A paired local comparison between the two (Section 10.6) therefore measures the relay and nothing else.

### 9.4 The no-skill floor

`bcf-31b-noskill` and `bcf-e4b-noskill` keep the call plan, the decision rules and the single-argument heredoc edit, but without the helper: the model writes a short Python script that reads the file, asserts that the search text occurs once, and writes it back, then compiles the file with `python3 -m py_compile`. They declare no skill and attach only `run_command`, `read_file`, `get_status` and `submit_patch`, so no tool with a list argument exists anywhere in the request. They are the floor of the measurement ladder (plain procedure), the emergency fallback if skill scripts fail on the scorer, and the clean comparison for the helper's value: no-skill against flat measures the helper, flat against relay measures the baton.

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
