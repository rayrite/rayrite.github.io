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
