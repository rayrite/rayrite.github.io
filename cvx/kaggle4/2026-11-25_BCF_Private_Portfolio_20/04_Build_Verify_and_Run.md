# Build, verify and run: how to use the portfolio, and how to create more tasks

**Prepared:** 2026-11-25. **Scope:** three paths. Path A uses FreshSWE-Py as published (the path P20 takes). Path B uses the OOD sets, which need their own runner. Path C mines new tasks from a repository with the same rigour as the competition. Each step says whether it was executed in this run.

| Mark | Meaning |
| --- | --- |
| Executed | Run in this session on this machine; the result is in `data/` |
| Read, not executed | The command follows the set's README, its scripts or the harness source, but was not run here, because no model endpoint, no Linux Docker host and no full dataset download were available |

---

## 1. Prerequisites

| Need | For | Note |
| --- | --- | --- |
| Linux with Docker (WSL2 or the Zorin machine of the 2026-11-24 package) | Path A (Docker sandbox), the gold and empty gates, Path C | The OOD runner of Path B also needs Linux: it looks for `lib/python*/site-packages` and `bin/python3` inside the sandbox |
| The harness packages of the wheelhouse (`swegemma` 0.2.11, `google-adk` 1.36.1, `adk-submission` 0.2.13) | Every path that runs the harness | `tools/setup_validate_venv.py` of the 2026-11-23 package builds this environment |
| A vLLM server that serves the bundle's model name | Agent runs | `tools/run_panel.py` of the 2026-11-24 package refuses a server that serves another name |
| Python 3.12 or later, `git` | The helper dry runs | Windows needs git's long-path setting for three snapshots |

---

## 2. The task format

The competition's `tasks.jsonl` has eight fields per line. The harness loader (`swegemma/models/task.py`, wheel 0.2.11) accepts those eight and three optional ones and silently drops any other key, so provenance can travel beside them.

| Field | Type | Content | Example from the public set |
| --- | --- | --- | --- |
| `instance_id` | string | Repository short name and issue or pull-request number | `fastapi_11194` |
| `repo` | string | `owner/name` | `fastapi/fastapi` |
| `base_commit` | string | 40-character SHA of the commit before the fix | `a7f2dbe976bf...` |
| `problem_statement` | string | The text the agent sees | the issue text |
| `hints_text` | string | Optional hints; empty on all 129 public tasks and on every task of the four held-out sets | empty string |
| `patch` | string | The reference fix as a unified diff, library files only | `--- a/fastapi/dependencies/utils.py` with hunks |
| `test_patch` | string | The hidden tests as a unified diff | test files only |
| `created_at` | string | ISO-8601 timestamp; on the public set it is the merge time (2023-07-29 to 2026-06-20) | `2025-09-20T19:55:59Z` |
| `FAIL_TO_PASS` | optional list or JSON string | Test nodes that must pass; when absent the harness takes the test functions from `test_patch` | absent on the public set |
| `PASS_TO_PASS` | optional list or JSON string | Tests that must keep passing | absent |
| `environment_setup_commit` | optional string | Accepted by the loader and read by nothing else in the installed harness | absent |

Two conventions matter. A patch is a plain unified diff; the public patches carry no `diff --git` line, while FreshSWE-Py and the OOD sets do, and both apply. And FreshSWE-Py stores its test lists under the names `fail_to_pass_tests` and `pass_to_pass_tests` on purpose: named `FAIL_TO_PASS`, the harness would turn every entry into a required node.

---

## 3. Path A: run the bundle on P20 with FreshSWE-Py

| Step | Action | Status |
| --- | --- | --- |
| A1 | Download the dataset (6.97 GB): `kaggle datasets download -d moshegolderson/freshswe-py`, or `curl -L -o freshswe-py.zip https://www.kaggle.com/api/v1/datasets/download/moshegolderson/freshswe-py`. Unpack it into its own directory | Read, not executed. In this run only the metadata and 36 snapshots were read remotely with `tools/remote_zip.py` (executed) |
| A2 | Build the sandbox image once, from the release root: `docker build -t freshswe-sandbox:latest -f docker/Dockerfile .` It bakes the 1,537-wheel wheelhouse and the per-task lock files into the image | Read, not executed |
| A3 | Run the gold and empty gates on P20 (Section 5) before any agent run | Read, not executed |
| A4 | Run the bundle with the panel runner of the 2026-11-24 package | Read, not executed |

The command for A4:

```bash
python tools/run_panel.py \
  --tasks  /path/to/freshswe-py/tasks.jsonl \
  --snapshots /path/to/freshswe-py/snapshots \
  --bundle dist/bcf-31b-flat \
  --panel portfolio/panel20.txt \
  --sandbox docker --image freshswe-sandbox:latest \
  --results results/p20-flat-run1
```

`run_panel.py` reads the four budgets from the bundle's `eval_config.yaml`, switches on context compaction with the notebook's values and passes `--panel` as the list of task ids. FreshSWE-Py also ships `graphs/` and `embeddings/` next to `tasks.jsonl`, which the runner picks up; the BCF bundles attach no graph tools, so they are unused. The set's own route, `swegemma eval --tasks tasks.jsonl --snapshots-dir snapshots --image freshswe-sandbox:latest`, works too but ignores the bundle's budgets.

What the image does at task start, from its `sandbox/setup.py`: it reads the base commit from the snapshot's root commit message (`base <sha>`), installs that task's lock file offline from `/opt/freshswe/wheelhouse`, installs `/workspace` in editable mode, and writes `pytest.ini` (with `--import-mode=importlib -p no:anyio`) and the root `conftest.py` header as the competition's setup does. The helper needs nothing else: its installer finds `/workspace` first.

---

## 4. Paths B and C in brief

**Path B, the OOD sets.** Their tasks run in the harness's subprocess sandbox with the set's own runner, which unpacks each repository's wheels into the sandbox; without it the gold patch resolved 3 of 45 OOD-45 tasks (OOD-45 writeup). OOD-B and OOD-C ship the runner as `tools/run_ood45.py`; for OOD-45 use that copy with `--ood` pointing at the OOD-45 directory, or the OOD-45 Kaggle notebook.

```bash
python /path/to/ood/tools/run_ood45.py \
  --ood /path/to/ood --submission-dir dist/bcf-31b-flat \
  --api-base http://127.0.0.1:8000/v1 --models-root "" --concurrency 4 \
  --tasks cachetools_424,tox_4094,pint_2437,great_tables_895,nox_1188,pdm_3902 \
  --results-dir results/cross-ood45-run1          # add --gold or --baseline for the gates
```

Three things to check before the first run (read in the runner's source, not executed): it builds the model name from `--models-root` and the bundle's model, so pass an empty `--models-root` for a local vLLM server that serves the plain model name; the OOD-45 harness insists on exactly 45 tasks in `tasks.jsonl`, so select with `--tasks` and never trim the file; and the first run without `--gold` or `--baseline` uses the rewritten statement (`--statement g1`).

**Path C, mine new tasks.** Section 6.

---

## 5. The gate: gold and empty patch on every task

Before an agent runs on a task, prove two things in the sandbox that the agent will use: the reference patch resolves the task, and an empty patch does not. This is the organizers' own criterion (`verify_sample_task_airgapped` in `swegemma/harness/sample_verification.py`: base exit code not zero, patched exit code zero) and the criterion of all four held-out sets. Do it even for a published set: on the public 129, the number of gold patches that pass locally ranged from 43 to 127 between teams depending on how the sandbox was built.

The snippet below follows the OOD runner's method for the Docker sandbox (read, not executed). It runs the harness's own `Evaluator` twice: once with the reference patch in place of the agent's, once with no patch at all.

```python
import asyncio, pathlib
from adk_submission import discover_adapters
from adk_submission.registry import ModelRegistry
from adk_eval_core.tracing import SessionTrace
from swegemma.config import ALLOWED_ADAPTER_EXTENSIONS, EvalConfig, build_submission_limits
from swegemma.evaluate import Evaluator

data, bundle = pathlib.Path("/path/to/freshswe-py"), pathlib.Path("dist/bcf-31b-flat")
ids = [l.strip() for l in open("portfolio/panel20.txt") if l.strip() and not l.startswith("#")]
limits, gen = build_submission_limits()
adapters = discover_adapters(str(bundle), adapter_extensions=ALLOWED_ADAPTER_EXTENSIONS)

def make(skip_agent_patch):
    return EvalConfig(tasks_path=data / "tasks.jsonl", snapshots_dir=data / "snapshots",
                      results_dir=pathlib.Path("results/gate"), submission_dir=bundle, models=ModelRegistry(),
                      sandbox="docker", image="freshswe-sandbox:latest", task_ids=ids, limits=limits,
                      generation_constraints=gen, adapter_manifest=adapters, skip_agent_patch=skip_agent_patch)

class Gold(Evaluator):                       # the reference patch stands in for the agent's patch
    async def _run_agent_sandbox(self, task, snapshot_path, task_index, total_tasks, **kw):
        return task.patch, None, SessionTrace()

gold = asyncio.run(Gold(make(False)).run())   # expect: 20 of 20 resolved
empty = asyncio.run(Evaluator(make(True)).run())   # expect: 0 of 20 resolved
print("gold", gold.resolved, "of", gold.total, "| empty", empty.resolved, "of", empty.total)
```

Keep only tasks that pass both. A task whose gold patch fails points at the environment (a missing wheel, a test plugin); a task that passes with an empty patch has no failing test and measures nothing.

---

## 6. Path C in detail: create tasks with the competition's rigour

The procedure below is the one FreshSWE-Py used, as documented in its scripts and paper, with the OOD builder's snapshot step. It needs no GitHub API calls and no LLM. What it produced for its authors: 1,143 candidates, 663 validated tasks.

| Step | What to do | Command or source | Status |
| --- | --- | --- | --- |
| C1 | Choose a repository with a permissive licence, an active 2026 history, a pytest-style suite and few dependencies (Document 02, Section 4) | GitHub API survey | The survey was executed; the choice is yours |
| C2 | Clone the full history | `git clone https://github.com/OWNER/REPO.git repos/OWNER_REPO` | Read, not executed |
| C3 | Mine candidates: every first-parent commit after the cutoff that changes both library code and tests; drop dependency bumps, documentation, release and revert commits and fixes of more than 5 library files or 200 lines | `validation/scripts/mine.py` of FreshSWE-Py (Apache-2.0); it writes `data/candidates.jsonl` with `patch`, `test_patch`, `base_commit` and the pull-request number | Read, not executed |
| C4 | Take the statement from the closed issue when there is one; otherwise the pull-request description; mark which | `statement_source` field of FreshSWE-Py | Read |
| C5 | Pin the environment at the base commit: the project's `uv.lock` when it has one, otherwise its dependencies resolved as of the day after the base commit | `uv lock`, or `uv pip compile --exclude-newer <date>`; export to a requirements file | Read, not executed |
| C6 | Fetch wheels for Linux and CPython 3.13 into an offline wheelhouse | `pip download -r lock.txt -d wheelhouse --platform manylinux_2_17_x86_64 --python-version 3.13 --only-binary=:all:` | Read, not executed |
| C7 | Make the snapshot: the history up to the base commit into a fresh repository on `main`, so no later commit exists | `git fast-export <base>` piped into `git fast-import` of a new repository; FreshSWE-Py uses one commit whose message is `base <sha>`, which its `sandbox/setup.py` reads | Read, not executed; the OOD builder (`tools/build_env.py`, MIT) does this step |
| C8 | Write the task row with the eight fields of Section 2 and the provenance: pull-request number, merge commit, statement source, the date the issue was opened, the date the pull request was opened and the date it was merged | Section 2 | Read |
| C9 | Validate under the scorer's rules: the tests of `test_patch` fail at the base commit, pass with `patch`, and pass again; the empty patch fails | Section 5, inside the sandbox image | Read, not executed |
| C10 | Audit the statement for fix material | `tools/check_statement_leakage.py` of OOD-45 (MIT) | Read, not executed |
| C11 | Freeze: write the task list and its checksums, and keep a part of it for confirmation runs only | | |

For repositories without a usable lock file, SWE-Factory and Repo2Run (Document 03, Section 4) build the environment with an agent; `swebench/collect` only scrapes candidates and leaves versions, install specifications and validation to you.

---

## 7. Pitfalls, each with the number behind it

| Pitfall | Evidence | What to do |
| --- | --- | --- |
| The subprocess sandbox installs no task dependencies | Gold resolves 3 of 45 OOD-45 tasks when no runner installs the task's wheels (OOD-45 writeup); on the public set teams measured 52 of 129 and 61 of 104 gold patches passing in plain notebooks (threads 751487 and 750573) | Use the Docker sandbox, or a runner that installs wheels |
| The scorer's test rules exclude real fixes | 277 of 1,143 real fixes (24 percent) fail only because of a scoring rule: the anyio plugin ban (79 fixes, and every starlette fix), the `pytest.ini` overwrite (101), non-test `.py` files passed as test targets (65, mostly black), a skipped test matched by name prefix (24), a JUnit report over 10 MiB (8) (FreshSWE-Py paper) | Validate with the scorer's rules, not the repository's; drop tasks that only pass under the repository's settings |
| The merge date hides exposure | Nine "post-cutoff" FastAPI pull requests had been open for up to 2.5 years before the cutoff (contamination audit, 2026-10-07) | Record when the issue was opened and when the pull request was opened |
| Statements mined from pull requests carry the fix | 43 of 45 OOD-45 originals; 44 of 129 public statements as shipped; replacing an issue by its pull-request description raised a tuned agent from 22 to 32 percent | Prefer the issue; run the leakage checker |
| Many candidates never become gradable tasks | FreshSWE-Py 663 of 1,143; OOD-45 45 of 64 pull requests; OOD-B 82 of 160 candidates; OOD-C 58 of 258 | Screen two to three times as many candidates as tasks wanted |
| Windows refuses long paths during the replay | kedro and py-shiny snapshots | `GIT_CONFIG_COUNT=1 GIT_CONFIG_KEY_0=core.longpaths GIT_CONFIG_VALUE_0=true` |
| The localizer evaluation undercounts | `tools/eval_localizer.py` skips the first file of its top-file line (Document 05, Section 2.1) | Count every entry |
| Identical runs disagree | 10.7 percent of tasks between two runs of one agent on 663 tasks; 19 percent between two identical runs on 98 tasks (FreshSWE-Py; arXiv 2611.19359) | Paired runs, several repeats (Document 06) |
| A fast endpoint flatters thinking | The reference agent's 11-point lead from thinking is gone at the scorer's decode speed (FreshSWE-Py paper) | Pad model calls to about 30 tokens per second in local runs |
| A popular set is private only from your own tuning | FreshSWE-Py: 99,851 downloads on 2026-11-25 | Keep B40 untouched; mine fresh tasks for a final check |

---

## 8. Checklist before the first agent run on P20

| Step | Action | Pass condition |
| --- | --- | --- |
| 1 | Build the sandbox image | `docker run --rm freshswe-sandbox:latest python --version` prints 3.13 |
| 2 | Gold gate on P20 | 20 of 20 resolved |
| 3 | Empty-patch gate on P20 | 0 of 20 resolved |
| 4 | Helper dry run on the P20 snapshots (optional; done here) | every gold patch applies byte-identically |
| 5 | Bundle compiles with the official compiler | `python tools/run_validator.py` passes |
| 6 | One smoke task (`packaging_1187`: 4 lines, a 0.6 s test file) through the full bundle | the planner makes two calls, the solver edits through the helper, `finalize` runs before `submit_patch` |
| 7 | First full run of P20 | per-task results written; mean seconds per task recorded |
