# How the current BCF brain improves on the naive agent, with the real call that shows it

**Prepared:** 2026-11-25. **Basis:** the actual runs in `evidence/lanes/`, the brain's prompts and helper, and the published work listed at the end.

## 1. The claim, stated so it can be checked

On `httpx_3672` the naive agent fails and the current brain resolves the task, for reasons that are mechanical: each is a rule or a piece of code that removes one way of losing. The brain needed 12 charged calls against 40, held a passing patch from its fourth call against the naive agent's eighth, and never lost it. Both shipped versions resolve the task with the same patch.

What this document does not claim: that the model will follow the prompts. The calls were scripted to follow them. Section 6 says what a live run must still show.

## 2. Seven mechanisms

| What the naive agent does, in the actual run | What the brain does instead | Where the mechanism lives | Measured in this run | Published work |
|---|---|---|---|---|
| Repeats reads: N5 and N7 return text identical to N4 and N6 | A journal on disk and a spec re-issued with a progress section after an interruption | Helper: `journal.jsonl`, `resume`, `spec`; installer is idempotent | 0 repeats in 13 calls | SWE-smith (S7) |
| Edits one site per call, with no compile check | Search-and-replace blocks, several per call, all-or-nothing, compiled before the file is written, written atomically | Helper: `apply` | 7 files in 7 calls; a broken edit refused (section 6) | SWE-agent (S5) |
| Trusts the first red test and reverts a correct fix | States that the issue is the specification; tests can never be edited through the helper | Solver prompt, first paragraph; helper refusal | Scripted lane keeps the rename; a test-file edit is refused | ImpossibleBench (S8) |
| Runs the whole suite three times, although no test exercises the code it just changed | One named test file, verdict on the first line, output under the cap | Helper: `test`; solver prompt | 1 test call of 1,047 characters against 3 suite runs | Agentless (S6) |
| Reads without a map: two windows, each read twice | A numbered window around a target the helper found | Helper: `find`, `ctx` | 33 lines in 1 call against 4 reads | Agentless (S6) |
| Lands fixes in one of two mirrored trees | Both trees are targets in the spec before the first read | Planner: `plan` | Both parsers edited by call 5 | Dataset study: 13 tasks of duplicated logic out of sync |
| Stops when the budget runs out | Phases enforced in code: edit by 150 seconds, verify by 300, freeze at 374, hard stop at 432 | Helper clock, started by the installer | First edit at call 4 | Competition data: budget advice in a prompt is ignored on most tasks |

## 3. What the mechanics cost and save

| Lane | Tool calls, total / charged | Text received from tools | Text the model must write (tool arguments) | Tool time on this machine | Tree states graded |
|---|---|---|---|---|---|
| Naive agent | 43 / 40 | 12,455 | 956 | 74.3 s | 10 |
| Older BCF | 30 / 26 | 6,521 | 1,663 | 19.8 s | 15 |
| Brain 2026-11-23 | 13 / 12 | 1,730 | 1,600 | 5.5 s | 8 |
| Brain 2026-11-24 | 13 / 12 | 1,729 | 1,600 | 5.5 s | 8 |

Characters divided by four. The brain's lane receives about one seventh of the naive agent's text. It does not save on writing: its edit blocks are long, about 1,600 tokens of arguments against 956 for the naive lane. On a small model writing is the slow direction, so the saving is in reading, in calls, and in the failures that do not happen.

The naive lane ran here under the 50-call budget v5 assumed. Under the brain's budget of 28 calls it would be stopped at N28, in the middle of its loop, holding the losing patch.

## 4. The two versions of the brain

Both were run with the same calls. Of 13 calls, 11 return byte-identical output; the planner's spec differs in one line and the test call differs only in timings.

| Planner's word for `kind` | 2026-11-23: class, route | 2026-11-24: class, route | First move the solver is given |
|---|---|---|---|
| `bug` | C1 bug fix / PAR · route P3 | C1 bug fix / NET · route P3 | Read the top symbol, make an early best-guess edit, verify with one test file |
| `feature` | C2 new feature / PAR · route P4 | C2 new feature / NET · route P4 | Copy the closest sibling and its registration points |
| `change` | C4 behaviour change / PAR · route P7 | C4 behaviour change / NET · route P7 | One file per apply; the helper compiles each edit |
| `refactor` | C3 refactor / PAR · route P7 | C3 refactor / NET · route P7 | One file per apply; the helper compiles each edit |

The helper derives the route from the category and the category from the planner's single word. The package's own taxonomy files this task as a bug fix in network behaviour with route P3, which is the row a planner who writes `bug` gets. The patched brain's routing repair moves the domain from markup parsing to network behaviour for every word.

## 5. The decision point: the first red test

A correct fix turns the visible test red, because the visible tests call the old name. The harness replaces them when it grades. What the solver saw at its eleventh call:

```text
TEST tests/test_parsers.py: FAIL (exit 1)
…
        ^^^^^^^^^^
E       AttributeError: 'HTTPParser' object has no attribute 'complete'

tests\test_parsers.py:70: AttributeError
=========================== short test summary info ===========================
FAILED tests/test_parsers.py::test_parser - AttributeError: 'HTTPParser' obje...
!!!!!!!!!!!!!!!!!!!!!!!!!! stopping after 1 failures !!!!!!!!!!!!!!!!!!!!!!!!!!
1 failed in 0.28s
```

Three reactions were graded for real:

| Reaction | Calls, total / charged | Final patch | Container B |
|---|---|---|---|
| Keep the rename (scripted lane) | 13 / 12 | `reset` defined, `complete` gone | **resolved**, 24 passed |
| Alias the old name (`complete = reset`) | 15 / 14 | `reset` defined and `complete` kept as an alias | **resolved**, 24 passed |
| Revert the rename (the naive agent's N13) | naive lane | `complete` restored, `reset` never defined | **not resolved**, 5 failed |

The alias path had not been graded before. It resolves, because the hidden tests call `reset` and never check that `complete` is gone. Two of the three reactions score; only the full revert loses the task.

Neither the brain's solver prompt nor the official sample submission's prompt has a rule for this situation:

| Prompt | The sentence | What it leaves open |
|---|---|---|
| Brain, solver, step 5 | Failures caused by missing fixtures or unrelated imports existed before your change: ignore them and never repair tests. If a related test fails, read the traceback, fix the source once, and run it once more. | A rename-induced failure is neither a missing fixture nor an unrelated import. "Fix the source once" can be read as: undo the change |
| Brain, solver, decision rules | Stuck after a failed fix: make a different, smaller change. | A revert is a smaller change |
| Official sample submission | Once your targeted test passes: call submit_patch immediately. If an existing test fails due to pre-existing repository issues or missing fixtures, IGNORE IT. | The same two categories and the same gap |
| Brain, solver, first paragraph | The hidden tests were written from the issue: its exact names, messages, types and values are the specification. | The sentence that favours keeping the rename. A principle, not a rule |

ImpossibleBench is the published form of this problem: it builds tasks whose tests contradict the specification and counts how often agents side with the tests. Giving the agent an explicit way to flag the conflict cut GPT-5's rate from 54% to 9% (S8).

**A rule that would close the gap.** This is a proposal, not shipped doctrine: if a visible test fails because it uses a name that the issue replaces, the failure is expected; keep the change, do not edit tests, do not add the old name back. One sentence in the solver prompt. The spec already carries both names in its NAMES line, so the helper could also detect the case: a failing test whose error names a symbol that the spec lists and the agent has just edited.

## 5b. The same trap on a second real task

The dataset study named `rich_4070` the closest twin of `httpx_3672` and counts 46 tasks in the public set whose hidden test patch modifies existing visible tests. The harness's own Container A and Container B were run on that task's published fix, with no agent:

| Step | Exit | Result |
|---|---|---|
| Visible tests before the fix, in the agent's sandbox | 1 | 6 failed, 107 passed, 11 skipped in 2.02s |
| Visible tests after the published fix | 2 | ERROR tests\test_syntax.py |
| Container B, empty patch | 1 | resolved = False: 7 failed, 106 passed, 11 skipped, 1 warning in 2.24s |
| Container B, published fix | 1 | resolved = False: 6 failed, 107 passed, 11 skipped in 1.98s |

```text
E   ImportError: cannot import name 'Console' from 'rich.syntax'
```

A correct fix makes a visible test file fail to import. On `httpx_3672` the stale visible test raised AttributeError because a method was renamed; here it raises ImportError because a name moved. One mechanism, two error types.

**Host limit.** The fix turns one failing test into a passing one and leaves six failing. Those six are rendering assertions that fail at baseline on this Windows machine, so `rich_4070` cannot be graded to a verdict here. The dataset study lists 29 public tasks that cannot be graded locally. The evidence is `evidence/probes/second_task.json`.

## 6. What is validated, and what is not

| Statement | Status | Where it comes from |
|---|---|---|
| The helper refuses a broken edit and `edit_file` accepts it | Validated by execution, both brain versions | The probe below; `evidence/probes/apply_gate.json` |
| A full revert loses the task; keeping the rename or aliasing it wins | Validated by execution | Section 5 |
| The brain's lane resolves `httpx_3672` with scripted calls | Validated by execution | `evidence/lanes/brain_v1123.json` and `brain_v1124.json` |
| Edit fidelity on all 129 published fixes: 129 of 129 byte-identical to `git apply`; official compiler 6 of 6 bundles; 15 of 15 negative controls rejected | Validated without a model on 2026-11-23 and 24 | The brain package's validation records |
| That Gemma 4 31B follows the prompts: relays the spec, edits by call 10, keeps the rename at the first red test | **Not validated.** No model has run | The live-run playbook |
| Mean seconds per task on the scorer | **Not validated.** The lane fits in 8 minutes only with lean thinking: about 150 to 470 seconds by estimate | Deck, slide on the budget |

## The edit gate, real output of the 2026-11-24 helper

The broken edit is the one-line-off insertion of `is_closed` described in document 02.

```text
BCF-NOTE: NOT APPLIED: the edit does not compile - nothing was written.
SYNTAX ERROR in src/httpx/_network.py line 87 col 12: unexpected indent
            description = ""
```

```text
BCF-NOTE: NOT APPLIED: tests and test configuration are reset by the grader. Fix the library code instead.
```

```text
BCF-NOTE: NOT APPLIED: block 1: SEARCH matches 24 places; add a neighbouring line to make it unique
Copy SEARCH exactly from ctx/read_file output (2-8 lines, unique). Never repeat the same block.
```

After those four refusals `git status --short` is empty: nothing was written. The harness's own `edit_file` accepted the same broken edit, and `py_compile` then reported:

```json
{
 "status": "error",
 "error_type": "CommandError",
 "error_message": "Sorry: IndentationError: unexpected indent (src/httpx/_network.py, line 87)",
 "details": {
  "stdout": "",
  "stderr": "Sorry: IndentationError: unexpected indent (src/httpx/_network.py, line 87)",
  "exit_code": 1
 }
}
```


## Sources

| # | Source | Used for |
|---|---|---|
| S5 | Yang et al. SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering. https://arxiv.org/abs/2405.15793 | The interface an agent is given shapes how well it edits and navigates |
| S6 | Xia, Deng, Dunn, Zhang. Agentless: Demystifying LLM-based Software Engineering Agents. https://arxiv.org/abs/2407.01489 | A fixed localize, repair, validate process; 32.00% on SWE-bench Lite |
| S7 | Yang et al. SWE-smith: Scaling Data for Software Engineering Agents. https://arxiv.org/abs/2504.21798 | Repetitive file views dominate the longest loops; suppressing repetition did not raise success |
| S8 | Zhong, Raghunathan, Carlini. ImpossibleBench: Measuring LLMs' Propensity of Exploiting Test Cases. https://arxiv.org/abs/2510.20270 | Agents siding with tests against the specification; the effect of an explicit flag |
| S9 | Wang, Pradel, Liu. Are Solved Issues in SWE-bench Really Solved Correctly? https://arxiv.org/abs/2503.15223 | Plausible is not correct |
| S10 | OpenAI. Introducing SWE-bench Verified. https://openai.com/index/introducing-swe-bench-verified/ | 61.1% of tasks flagged for tests that may reject valid solutions |
