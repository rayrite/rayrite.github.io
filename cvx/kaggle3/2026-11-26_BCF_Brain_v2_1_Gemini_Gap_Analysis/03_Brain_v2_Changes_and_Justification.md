# 03 - Brain v2: changes and justification

The new brain is `bcf-brain-v2/` in this package. Helper version 2.1.0: version 2.0.0 was built on 2026-11-25 from
Gemini's document; version 2.1.0 followed on 2026-11-26 from an audit against the harness documentation (section 7
here, and document 07). This document explains what was changed, what evidence asked for it, what it costs, and
what was considered and left out.

## 1. Base and lineage

You asked for the new version to be built by backing up and updating
`deliverables/2026-11-23_BCF_Brain_and_Dataset_RCA/bcf-brain`. That was done, with one addition you should know about.

| Step | What | Evidence |
|---|---|---|
| 1 | The 11-23 brain copied unchanged to `backup/bcf-brain-2026-11-23` | 88 files, SHA-256 of each in `backup/MANIFEST-bcf-brain-2026-11-23.sha256.json`; copy and original equal; re-checked at the end of each run |
| 2 | The six fixes of 2026-11-24 applied to the working copy | the assembled helper was byte-identical to `2026-11-24_BCF_Tuning_Bottlenecks_and_Parity/bcf-brain-patched/src/bcf.py` before any v2 edit |
| 3 | The v2 changes | `patches/bcf-brain-v2-vs-11-24.diff`, 11 files |
| 4 | The 2.1 changes, 2026-11-26 | `patches/v2.1-vs-v2.0.diff`, 7 files; reversing it reproduces 2.0 byte for byte |

Step 2 is the addition. On 2026-11-24 an audit of the 11-23 helper found six defects by executing it, one of them a
data-loss trap in `finalize` that deleted a newly created module right before submission. Building v2 on the bare
11-23 copy would have brought those defects back. So v2 is: 11-23, plus those six validated fixes, plus the changes
below. The 11-23 original is untouched.

## 2. The principle applied

The forum evidence says guards belong in the tool, not in the prompt. Thread 760014: prompt-level budget instructions
were ignored in 61.4 percent of tasks, while guards placed behind the tool layer halved timeouts. The prompts of v2
grow by 139 words on the 31B track and 63 on E4B (111 of the 139 came with 2.0.0, the rest with the audit of section
7); the rest of the new behaviour is in the helper and costs output only when it fires.

## 3. The changes

### 3.1 `test`: a failing test is compared with the unedited tree

**Gap.** The grader discards the agent's test edits and applies its own tests. In 46 of 129 public tasks the visible
tests contain lines the fix makes fail. The v1 prompt said: "If a related test fails, read the traceback, fix the source
once". That instruction tells the model to undo a correct fix. Gemini's Law 7 says the brain detects this case. It did
not: there was no comparison with the state before the edit.

**What v2 does.** `test` lists every failing test with its one-line reason, then labels each failing test:

```
TEST tests/test_console.py -k input: FAIL (exit 1)
  1 failed, 1 passed
  tests/test_console.py::test_input_password - AttributeError: <module 'rich.console' from '...'> has no attribute 'ge
  ON THE UNEDITED TREE: PASS - 2 passed
  NEW SINCE YOUR EDIT (1): test_input_password
    A test that expects the behaviour the issue asks to change fails after a correct fix: that is expected
    (the grader replaces such tests) - keep your fix. Any other new failure means your edit broke it: read its
    assertion above, fix the source once.
```

The unedited-tree result comes from the first of three sources available: a run the model made before its first edit, a
baseline kept from an earlier call, or a fresh run on the committed tree. The fresh run happens in a temporary git
worktree outside the repository, and is refused when it cannot be trusted or does not fit: when the installed
package would win over the worktree on the import path, when git cannot create the worktree, when the clock leaves
less than 70 seconds before the freeze, or when the test file itself needed more than 30 seconds. The whole
comparison is limited to 60 seconds and its cleanup to 15. In all these cases the rule is printed without the labels.

**Why the rule is needed and not only the labels.** In the trap case the failing test passes before the edit and fails
after it, so it is "new". A new failure is either a regression or a test that asserts what the issue asks to change.
Only the model can read the assertion against the issue; the helper makes the choice explicit at the moment it arises.

**Evidence.** Unit tests T10; the real task above (`validation/real_task_rich_4070_test_delta.txt`); thread 760014 on
spec changes; HARNESS_README on the test reset.

### 3.2 `test`: the whole file runs, and skipped tests are named

v1 ran pytest with `-x`, which stops at the first failure. v2 runs the whole file as the grader does and adds skipped
tests to the summary. The grader resolves a task only when every required test "explicitly passed without being
skipped", so a skipped test is printed with that reminder. Output that pytest prints about its own configuration is
left out of the tail.

### 3.3 `check` and `finalize`: names that are never defined

**Gap.** `compile()` accepts a name that does not exist. Of the 12 broken-code failures in the 91-task trace audit
(thread 760595), the classes were `SyntaxError`, `IndentationError`, `NameError` and `UnboundLocalError`. The v1 gate
saw the first two only.

**What v2 does.** For each changed Python file a scope analysis lists names the file loads and never binds, with line
and enclosing function. The model is over-permissive on purpose: a name bound anywhere in a scope, or anywhere in the
file, counts as bound. Three rules keep it quiet on real code: dunder names are skipped; a use inside a `try` that
catches `NameError` is a probe; a file with a star import is not checked.

**Evidence** (`validation/undefined_names_eval.json`):

| Measure | Result |
|---|---|
| Untouched code of four repositories at base | 1,416 files, 182,716 lines |
| Reports in package code | 0 |
| Reports in example and test files | 12, all of names that are truly undefined there (documentation pseudo-code; a demo and a test that raise on purpose) |
| Injected mistakes found | 4 of 4 on each repository: a new name never defined, a needed import deleted, a variable of another method used, one use of a variable misspelled |
| Known blind spot | a name used before its assignment on one path (no flow analysis) |
| Speed | about 2 ms per file; slowest file 0.09 s |

The rule about `try` blocks was added after the first measurement reported `get_ipython` four times in rich.

### 3.4 `finalize`: the import gate

**What v2 does.** `finalize` imports each changed module in a separate Python process (at most three, 15 seconds
each) and reports a failure only when the traceback passes through a changed file. A package that is not installed on
a development machine therefore stays silent. The gate is skipped in the last tenth of the budget.

**Evidence.** Thread 760595: the two mechanical checks that helped a small agent were "after every edit:
`py_compile` and `import MODULE`" and one related test file run so that its summary stays visible; broken edits went
from 12 to 7. The helper had the first half of that.

### 3.5 `twins`, `check`, `finalize`: copies of the changed code and call sites of a changed signature

**Gap.** 38 of 129 public fixes change several source files. v1 said nothing about what a one-file fix leaves behind.

**What v2 does.** Two links that can be found by name:

- **TWIN NOT EDITED.** Another file defines the same name with a near-identical body (85 percent, or 50 percent when
  the file name is also the same, as in a sync and async twin tree); an example file that is a near-identical variant
  of an edited example.
- **SIGNATURE CHANGED.** A definition's parameter list changed. Call sites in files that were not edited are listed,
  and the line says whether those calls now fail (a required parameter was added or one disappeared) or still work (an
  optional parameter was added).

**Evidence, and why this is shipped as an informational line only** (`validation/siblings_eval_38_multi_file_tasks.json`).
On the 38 multi-file tasks, with only the largest file of the published fix applied:

| Outcome | Tasks |
|---|---|
| A line names another file of the published fix | 4 of 38 (`fastapi_14262`, `fastapi_14459`, `fastapi_14978` through a changed signature; `httpx_3672` through the twin tree) |
| Lines name no file of the fix | 2 |
| A line is still reported after the complete fix | 7 of 38 |

The measurement also showed what this cannot do. In 35 of the 38 tasks the other files are tied to the first by
callers, wrappers and tables that share no name with the edited code. An earlier, looser "similar code" level was
removed because every one of its lines on complete fixes was a false alarm. The lines never block the submission:
`finalize` answers "READY, WITH n WARNING(S)" and says what each kind means.

### 3.6 Prompts

| Prompt | Change | Why |
|---|---|---|
| 31B solver, step 5 | the verify step now distinguishes older failures from new ones and states the rule for a test that asserts what the issue changes | to use the new `test` output (TRAP-1, TRAP-6) |
| 31B solver, step 6 | follow each warning line as its text says | the text is in the tool |
| 31B solver without helper | the same rule in one sentence; import each edited package before submitting; search callers of a function whose parameters changed | the no-skill bundle has no helper |
| E4B solver | one sentence on older and new failures; one on undefined names | the same rule, in 63 words |
| Every solver prompt | "Start every command with python3, cd or git" | thread 760830: the tool parser can hang on a bare argument value that starts as an array |
| No-skill E4B | one sentence on the expected failure | |
| 31B solver, call plan (2.1) | a tool response that carries `budget_warning` means: run `finalize`, then `submit_patch` | the harness's own message says "call submit_patch soon"; `finalize` is where the gates run (README, section 6) |
| 31B solver, call plan (2.1) | the clock is "the TIME line at the end of every BCF output" | the earlier wording promised a printed time that ordinary commands did not print |
| Both no-skill prompts and the helper-less fallback (2.1) | `timeout 45` on the pytest command; exit code 124 means do not run it again | a hanging test file could use the whole 240-second command timeout (README, section 6.1) |

### 3.7 Hints

Four domain hints gained a clause, each from one of the document's laws: input and output names can differ (VAL), input
and output schemas can differ (OAS), copy a value shared between requests before changing it (DI), a wire length is
counted in encoded bytes (NET). Routing is unchanged: category 97, domain 82 and route 52 of 129 on the reviewed labels,
as on 11-24.

## 4. Considered and not adopted

| Proposal or idea | Decision | Reason |
|---|---|---|
| A failing reproduction before every fix (Law 10) | Not adopted | thread 760014: forcing it lowered a small agent from 6.0 to 3.5 on a 20-task subset. The repro stays required on the two routes where the issue shows it |
| Prompt text about async functions (Law 9, TRAP-4) | Not adopted | the helper already indexes with the standard library `ast`; staff state that no scored task touches an `async def` |
| The seven categories as a routing table | Not adopted | a category spans 4 to 8 of the existing routes and is unknown before the fix |
| The 16 defect cards as procedures | Not adopted | 109 distinct titles for 129 tasks, no definition, one card unused |
| A "similar code" level in the twin report | Removed | every line it produced on complete fixes was a false alarm |
| "Example files that call the changed name" | Removed | it flagged examples the fix never touched and missed the one case where six variants of a tutorial changed together |
| Local handling of missing fixture packages (TRAP-8) | Not adopted | on the scorer the packages are pre-installed; the v1 rule to ignore older failures covers a development machine |
| Special handling for skipped tests in the prompts | Not adopted | the helper prints skipped tests with the grader's rule; tests cannot be edited anyway |
| A lower per-task time cap | Not adopted here | thread 761467 shows the 12-hour risk is real, but changing budgets without a measured mean per task would be a guess. See section 6 |
| Taxing the model with a mandatory `check` call | Not adopted | one call of 28; `finalize` carries the same lines |

## 5. Cost

| Item | 31B sequential | 31B flat | 31B no-skill | E4B sequential | E4B flat | E4B no-skill |
|---|---|---|---|---|---|---|
| Solver prompt, words added | 139 | 139 | 95 | 63 | 63 | 31 |
| Solver prompt, characters added | 814 | 814 | 543 | 346 | 346 | 170 |

The figures are against the 11-24 prompts and include the 2.1 additions (28 words on the 31B track).

| Command | Median seconds on five real checkouts | Comment |
|---|---|---|
| `status` | 0.24 to 0.35 | unchanged |
| `check` | 0.52 to 2.11 | name check and sibling report |
| `twins` | 0.50 to 1.97 | sibling report alone |
| `finalize` | 1.43 to 3.68 | adds up to three import processes |
| `test`, first failing run after an edit | one more pytest run; 3.4 seconds for both runs on the real task | the comparison on the committed tree: at most 60 seconds plus 15 for cleanup, skipped when the file needed more than 30 seconds |
| Any command | one extra output line of about 15 tokens | the clock (2.1) |

## 6. What to watch in the first run with the model

1. Does the solver keep its fix when `test` prints NEW SINCE YOUR EDIT? The task to watch is one where the visible
   test asserts the old behaviour.
2. Does a "READY, WITH n WARNING(S)" line cost more than one extra call?
3. Mean seconds per task. With 120 scored tasks the 12-hour limit allows 360 seconds per task including setup; one
   team measured 253 seconds per task for a 31B configuration (thread 761843).
4. Whether the skill bundles start at all on the scorer. If a bundle scores 0.00 with a result size of 3,230 bytes,
   that is the faulty-GPU signature of thread 761004 and should be reported rather than debugged.

## 7. Version 2.1: the audit against the harness documentation

On 2026-11-26 the whole of `HARNESS_README.md` was compared with the brain, section by section. The v2.0 work had
used its sandbox, verification and best-practice sections, but had never checked the file end to end. The audit
found one defect and three smaller gaps. They are closed in 2.1, and `07_Harness_Readme_Audit.md` lists every fact of
the README with what the brain does about it, including the items used deliberately not at all.

| Finding | Fix |
|---|---|
| In the worst case `test` could take 255 seconds, more than the 240-second command timeout of the bundles, and lose its output | one total limit of 60 seconds for the comparison, 15 for its cleanup, and no comparison for a file that needed more than 30 seconds; a unit test guards the arithmetic |
| The prompt said the helper prints the elapsed time, which only `status` did | every output ends with a `TIME` line |
| The harness's `budget_warning` tells the model to submit, skipping `finalize` | one sentence maps it to finalize, then submit |
| The no-skill bundles ran pytest without a bound | `timeout 45` |
