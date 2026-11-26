
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

[[TABLE:routes]]

The helper derives the route from the category, the domain and two facts about the issue: whether it shows a reproducible failure, and whether the planner marked it as huge. A bug fix with a reproducible failure takes P2 and without one takes P3; a feature takes P4; a behaviour change or a refactor takes P7; documentation takes P8; build tooling takes P9. Two domains override this: a task in the schema domain takes P5 and a task in the compatibility domain takes P6. A task marked as huge takes P10 in every case. The solver prompt describes all ten routes.

### 8.3 Sub-category decides the hint

The helper carries one line of domain advice for each of the 17 sub-categories and puts it in the baton. The middle column is the exact text the model receives; the right column names the root-cause finding it encodes.

[[TABLE:domain_hints]]

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
