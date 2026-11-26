# 07 - Audit of brain v2 against the harness documentation (v2.1)

Question put on 2026-11-26: does the new BCF brain take into account
`input/kagglecomp/kagglecomp_data_package/HARNESS_README.md`, and does it optimise where that documentation allows?

Honest answer before this audit: partly. The 11-23 brain was built with the README's sandbox, verification and
best-practice sections in mind, and yesterday's v2 used those sections again for the trap verdicts. But yesterday's
run read sections 4, 5, 8 and 10 only, and never compared the whole file with the brain line by line. This audit did
that. It found one defect and three smaller gaps; all four are closed in v2.1. The result is helper version 2.1.0.

## 1. What the audit found

| Finding | Kind | Closed in v2.1 by |
|---|---|---|
| `test` could run longer than the command timeout. In the worst case the whole command could take 255 seconds, 330 with `--max`, against the 240-second command timeout that the bundles set. A command that runs longer is killed and its output is lost (README 6.1 and 7.1) | Defect | The comparison has one total limit of 60 seconds, cleanup included in a further 15, and is skipped when the test file itself needed more than 30 seconds. Worst case now 120 seconds, 195 with `--max` |
| The prompt said "BCF prints the elapsed time". The helper printed the clock only on `status` and after the freeze began (README 6.1: reading the clock with `get_status` costs no call, but still costs a model turn) | False statement in the prompt | Every helper output ends with a `TIME` line, at no call and about 15 tokens |
| The harness adds `budget_warning` to every tool response from about the 19th call and says "call submit_patch soon". The brain wants `finalize` first, where its gates run, and said nothing about the signal (README 6) | Signal not used | One sentence in the 31B solver prompt: a response that carries `budget_warning` means run `finalize`, then `submit_patch` |
| The no-skill bundles ran pytest with no bound. A hanging test file could use the whole 240-second command timeout, half of the task budget (README 6.1) | Missing bound | `timeout 45` on the pytest command in both no-skill prompts and in the helper-less fallback; exit code 124 explained |

A unit test now guards the first point: it reads the caps from the helper and the timeout from `build.py` and fails
if the worst case comes within 40 seconds of the timeout. Another test checks that a slow file is not run twice and
that the temporary worktree is cleaned up either way.

The changes are in `patches/v2.1-vs-v2.0.diff` (7 files, 406 lines). Reversing it on v2.1 reproduces v2.0 byte for
byte; the check was run in both directions.

## 2. Taken into account before this audit

| README section | Fact | How the brain uses it |
|---|---|---|
| 2.2 and 2.4 | Allowed file extensions; one root config | `build.py` refuses any other extension; the validator's controls include one |
| 2.4 | Under vLLM, omit `thinking_level` and set `thinking_budget` with `include_thoughts` | The sampling files do exactly that |
| 3.1 | One base model per submission | Every agent in a bundle declares the same model |
| 4.2, step 4 | The repository is installed in editable mode | The import gate of `finalize` imports each changed module by name |
| 4.2, step 6 | The grader writes `pytest.ini` and `conftest.py` and commits them | Both are protected paths: the helper never writes them and puts them back if touched |
| 4.2, step 7 and 8.1 | Any untracked file under `/workspace` ends in the patch | The helper lives in `.git/bcf/`, which no diff can reach; `finalize` removes scratch files |
| 4.2 | Test dependencies are installed into the agent's sandbox | A failure caused by a missing fixture is treated as older than the edit, not as a regression |
| 5.2 | Command output is cut at 5,000 characters | Every helper output is capped at 3,800 |
| 5.2 | `read_file` returns 150 lines and 10,000 characters at most | `ctx` returns 70 lines at most |
| 5.3 | The harness nudges up to three times when the agent stops without submitting | The prompts answer a continuation note with `resume`; the planner treats a second install as a re-entry |
| 6.1 | A non-zero exit returns the output twice, once in the error and once in the details | The helper always exits 0 |
| 6.1 | A timed-out command does not end the session | Every helper command is bounded, most far below the harness's timeout (section 3) |
| 6.1 | `submit_patch` and `get_status` cost no call | The prompts say so; the clock now comes with every helper output |
| 6.2 | `write_file` drops a leading slash, so `/tmp/x.py` lands inside the repository | The skill bundles attach neither `edit_file` nor `write_file`; `repro` writes through Python's own temp folder |
| 6.2 | `edit_file` has no compile check (found in the replay of 2026-11-25) | Edits go through `apply`, which refuses anything that does not compile |
| 7.1 | Agent time excludes container setup | The helper's clock starts when the installer runs, inside the agent loop |
| 7.2 | The context is compacted above 14,336 tokens | State lives on disk (journal and spec), and `resume` rebuilds the next step from it |
| 8.1 | An unsubmitted tree is diffed anyway | "An edit that exists counts" is in every prompt |
| 8.2, step 3 | Test files and runner configuration are reset before the hidden tests are applied | The protected list in the helper mirrors the README's list |
| 8.2, step 4 | The grader's pytest flags and environment | The helper's `test` uses the same flags and `PYTHONSAFEPATH` |
| 8.2, step 5 | A task resolves only when every required test passed and none was skipped | v2 lists skipped tests with that rule |
| 10.1 to 10.5 | Best practices | 10.1 small edits and a truncated block is ignored; 10.2 protected; 10.3 scratch outside the repository; 10.5 `submit_patch` last |

## 3. Worst-case duration of a helper command

The bundles set the command timeout to 240 seconds (`timeout_seconds` in `build.py`). Derived from the caps in
the helper, version 2.1:

| Command | Worst case in seconds | Basis |
|---|---|---|
| `test` | 120 | 45 for the file, 60 for the comparison, 15 for its cleanup |
| `test` with `--max 120` | 195 | same, with the larger own cap |
| `finalize` | about 50 | three imports of 15 seconds at most, plus the name check and the sibling report |
| `repro` | 40 | one cap |
| `find`, `plan` | 34 plus a pass for quoted literals | two capped scans of 20 and 14 seconds; the literal pass has no cap and took 1.3 seconds on the largest public repository |
| `status`, `check`, `twins`, `apply`, `ctx` | a few | git calls capped at 20 seconds each |

Before v2.1 the first two rows were 255 and 330 seconds.

The comparison with the unedited tree is skipped, and the rule printed without its labels, when the test file itself
needed more than 30 seconds: a second run would cost more than it can tell.

## 4. In the README and deliberately not used

| README item | Why not |
|---|---|
| Code graph tools (6.3) | They omit every async function, and `get_code_subgraph` takes a list argument, which the vLLM parser can hang on. The validator rejects a bundle that attaches it |
| `AgentTool` to isolate context (10.4) | Thread 760014 measured that wrapping tools in a nested tool multiplied argument errors for a small model. The brain keeps the four harness tools and one command surface |
| `LoopAgent` (2.3) | A solver-checker loop enforced by the harness would not depend on the model's discipline. It is unbuilt, and thread 760014 found that extra stages sometimes broke tasks the first stage had solved |
| `get_status` for the call count | It costs no call but one model turn. The harness's own `budget_warning` appears from about the 19th call, which is where the brain's call plan says to finalize |
| Output cap against compaction (7.2) | Smaller outputs would delay compaction and also carry less. That trade needs a model run to set |
| `max_output_tokens` of 16,384 (10.1) | The bundles use 8,192. By the decoding rates in the tuning package of 2026-11-24 (13 to 25 tokens per second, not measured on the scorer) even 8,192 tokens take 5.5 to 10.5 minutes, longer than the task budget, so time cuts a long generation before either cap is reached |

## 5. Not verified

- Whether `timeout` is present in the scorer's image. It is part of coreutils, an essential package in Debian, and
  `python:3.13-slim` is a Debian image; the image itself was not inspected.
- Whether a timed-out command returns its partial output on the scorer. The README does not say, so v2.1 assumes it
  does not.
- Whether the model acts on the `TIME` line and on `budget_warning` as the prompt asks. No model run was made.
