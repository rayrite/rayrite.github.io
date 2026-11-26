# Engineering digest: real Kaggle "Gemma 4 Developer Agent" harness (swegemma 0.2.11 / adk_eval_core 0.1.0 / adk_submission 0.2.13 / google_adk 1.36.1)

All citations are relative to the venv site-packages root
`scratch/2026-11-23-bcf-brain/venv/Lib/site-packages/` (project root
`d:\stuff\ai-misc\_bsh2026\vscode_project01\46-wide_research_test`). Example: `swegemma/budget.py:29` means
`scratch/2026-11-23-bcf-brain/venv/Lib/site-packages/swegemma/budget.py` line 29. Versions verified from
`*-*.dist-info/METADATA`. Everything below was read from source; a live probe with
`scratch/2026-11-23-bcf-brain/venv/Scripts/python.exe` (docker stubbed, no Docker, no model) confirmed the
import recipes in §7.

## 1. Tool inventory

The complete registry is `swegemma/tools/__init__.py:34-46` (`create_tools`): exactly nine tools. There is **no**
`list_dir`/`list_files` tool anywhere (grep over all three packages confirms); directory discovery is done via
`run_command` or via a workspace tree (maxdepth 3, 200 lines) pre-computed and injected into the prompt
(`swegemma/harness/agent_runner.py:300-314`, injected at 468-473). Skill tools (`load_skill`,
`load_skill_resource`, `run_skill_script`) are ADK `SkillToolset` tools, added only when `skills:` is declared
(`adk_submission/resolvers/tools.py:129-265`); see §5.

Every tool returns a JSON string: success `{"status":"ok",...}` (`swegemma/tools/base.py:11-15`), failure
`{"status":"error","error_type":...,"error_message":...[, "details": {...}]}` (`base.py:18-31`). Failures never
raise into the loop — every tool body is wrapped in try/except and returns an error payload (e.g.
`swegemma/tools/workspace.py:173-177`).

| Tool | Impl (swegemma/) | Args (R=required) | Counts toward tool budget | Caps / notes |
|---|---|---|---|---|
| `run_command` | `tools/execution.py:21` | `command: str` (R) | Yes (`@budget_gated`, default `count_tool_call=True`, `base.py:72`) | timeout = min(`command_timeout_seconds`, remaining session time, floor 5 s) (`execution.py:31-45`); stdout AND stderr each hard-cut to first `max_stdout_chars`=5000 chars — **head kept, tail dropped, no marker at this layer** (`execution.py:54-56`); on nonzero exit the model gets `CommandError` with `details.{stdout,stderr,exit_code}` (`execution.py:58-67`); timeout → `TimeoutExceeded`, `"Command timed out after {n} seconds"` (`execution.py:48-52`) |
| `read_file` | `tools/workspace.py:88` | `filepath: str` (R), `start_line: int\|None`, `end_line: int\|None` (both optional; strings coerced, `workspace.py:58-84`) | Yes | window first clamped to lines, then 150 lines (`max_file_lines`), then 10000 chars (`max_file_chars`) with `is_truncated: true` (`workspace.py:151-171`); returns `total_lines` so the model can page; `start_line > end_line` → `ValueError`; file pulled out of the sandbox via `copy_from` into a host tempdir (`workspace.py:116-123`) |
| `write_file` | `tools/workspace.py:181` | `filepath: str` (R), `content: str` (R) | Yes | `mkdir -p` of parent inside sandbox then `copy_to` (`workspace.py:193-203`); error type `FileWriteError` |
| `edit_file` | `tools/workspace.py:217` | `filepath`, `old_string`, `new_string` (R), `allow_multiple: bool=False` (accepts `"true"/"1"/"yes"`, `workspace.py:257-261`) | Yes | replacement applied host-side by `swegemma.edit.apply_replacement` (`workspace.py:237,263-269`); empty file → `ValueError` "Use write_file…" (`workspace.py:252-255`); unified `diff` in response, cut to first 5000 chars, `is_truncated` flag (`workspace.py:276-289`); error type `FileEditError` |
| `submit_patch` | `tools/execution.py:77` | none | **Free** (`@budget_gated(count_tool_call=False)`, `execution.py:76`) | runs `cd /workspace && git add -N .` then `cd /workspace && (git diff --binary _swegemma_baseline 2>/dev/null \|\| git diff --binary HEAD)` (`execution.py:86-90`); diff is filtered through `strip_protected_files_from_patch` unless mock repo (`execution.py:103-110`); repeatable, only final submission kept (`execution.py:112`); response is just `{patch_size, files_changed}` |
| `get_status` | `tools/execution.py:120` | none | **Free** (`execution.py:119`) | reports `tool_calls_used`, `patch_submitted`, `patch_size`, plus `tool_calls_remaining`/`max_tool_calls`, `time_seconds_remaining`/`max_time_minutes`/`agent_elapsed_seconds`, `max_turns`, `command_timeout_seconds` when set (`execution.py:126-145`) |
| `get_code_neighbors` | `tools/graph.py:89` | `node: str` (R), `edge_type: str\|None`, `max_neighbors: int=50` (coerced, `graph.py:20-46`) | Yes | neighbor list greedily kept whole until `max_stdout_chars` (first item may be cut mid-string), `is_truncated` (`graph.py:167-182`); error `GraphLookupError`; needs repo/graph dirs else `MissingRepoContext` (`graph.py:119-123`) |
| `search_similar_code` | `tools/graph.py:198` | `query: str` (R), `k: int=10` | Yes | total snippet chars capped at `max_stdout_chars` with a fair-share allocator `_allocate_code_budgets` (`graph.py:57-85`); returns `node_name`, `code`, `similarity` (4 dp); error `SimilaritySearchError` |
| `get_code_subgraph` | `tools/graph.py:292` | `nodes: list[str]` (R — the only ARRAY-typed arg; a JSON string or `"a,b"` string is also accepted and parsed, `graph.py:327-342`) | Yes | node budget = half the char cap when edges exist, remainder to edges (`graph.py:380-408`); error `SubgraphExtractionError` |

Path rules (all file tools): `_resolve_workspace_path` (`workspace.py:22-55`) strips a leading `/workspace` or
`/workspace/` (and the literal workspace root for non-`/workspace` sandboxes), then resolves and rejects any
escape with `"Path traversal detected: '<path>' escapes workspace root."`; a bare `/workspace` is rejected for
file ops with `allow_root=False`. Graph tools are always registered but only advertised in the prompt when
graph+embedding data files exist (`agent_runner.py:417-466`).

**Truncation + budget_warning placement.** Command output: head-only, first 5000 chars per stream, appended
silently (no truncation marker) — `execution.py:54-56`. (The 10 MB cut with marker
`"\n...[Output truncated at 10MB limit]\n"` lives one layer down, in the sandbox executors:
`adk_eval_core/sandbox/subprocess_sandbox.py:98-101`, `swegemma/sandbox/docker.py:740-748`.) `budget_warning`
is injected **after** the tool runs, as an extra JSON key appended to the response object (so it appears at the
end of the JSON), only when `count_tool_call=True`, only when `max_calls >= 20`, when `remaining <= 10`:
`"Only {remaining} tool call(s) remaining ({used}/{max} used). Finalize your edits and call submit_patch soon."`
(`base.py:47-69`, applied at `base.py:105-107`).

## 2. Budgets and warnings

Defaults (`swegemma/budget.py`): `EvaluationBudget` = `time_minutes=60.0`, `tool_calls=None`, `turns=None`,
`cost_usd=None`, `total_tokens=None` (`budget.py:14-22`). `HarnessLimits` = `command_timeout_seconds=300`,
`max_stdout_chars=5000`, `max_file_lines=150`, `max_file_chars=10000`,
`verification_timeout_seconds=300` (`budget.py:26-33`). Flat CLI kwargs override: `--max-time-minutes` (CLI
default 60.0, `cli.py:179-184`), `--max-tool-calls`, `--max-turns`, `--timeout-seconds`,
`--verification-timeout-seconds` merged in `EvalConfig.__post_init__` (`config.py:125-200`). The turn loop cap
`max_llm_calls = budget.turns or 500` (`agent_runner.py:714-716`) and the wall clock `asyncio.timeout` =
`time_minutes*60` (`agent_runner.py:718-727`).

`check_budget` (`swegemma/context.py:468-551`) checks in order tool_calls → turns (LLM calls) → cost → tokens
(each only when `count_tool_call=True`, each returning `{"status":"error","error_type":"BudgetExceeded",
"error_message":...}` verbatim e.g. `"Tool call budget exhausted (N calls)"`, `"Turn budget exhausted (N turns)"`),
then time (always, even for free tools): `"Session time budget exhausted (N minutes)"` with error_type
`TimeoutExceeded` (`context.py:527-547`). The counter increments only after all checks pass (`context.py:549-550`).
Exhaustion is also detected loop-side and ends the session with `agent_error` strings like
`"Agent exceeded tool call budget (N calls)"` / `"Agent exceeded turns budget (N turns)"` /
`"Agent exceeded session timeout (60.0 min)"` (`agent_runner.py:920-957`, 1026-1038). Cost/token budgets are
inert by default: `SwegemmaContext._token_budget` is never attached unless a caller sets it
(`context.py:146,369-371`).

When the time cap is reached mid-turn the loop breaks; if no patch was ever submitted the harness still grabs an
unsubmitted working-tree diff as a fallback patch (§3/§7 of `agent_runner.py:1054-1097`).

## 3. Container B grading (`swegemma/harness/verification.py`)

Entry point: `verify_task(docker, config, task, snapshot_path, *, base_snapshot_path=None, patch_path=None,
fast_path=True, agent_patch='', agent_error=None, trace=None, start_time=0.0) -> TaskResult`
(`verification.py:345-358`; signature verified by probe). Step order inside a fresh sandbox (`sandbox_start`,
`verification.py:384`):

1. `setup_container_wheels` (skipped if backend lacks `extract_archive_to_container`) (`verification.py:387`).
2. `extract_snapshot` — copy/extract snapshot tarball into `/workspace`, optional base+incremental patch, then
   remove circular symlinks (`container_setup.py:416-474`).
3. `setup_synthetic_hardware` — a no-op delegate (`container_setup.py:859-861`).
4. `setup_git_exclude` — appends pycache rules to `/workspace/.git/info/exclude` (`container_setup.py:498-503`).
5. `install_editable_package` — `pip install --no-index --find-links=/wheels --no-build-isolation --no-deps -e /workspace 2>/dev/null || true`; **skipped entirely for SubprocessManager/SubprocessSandbox** (`container_setup.py:506-517`).
6. `install_test_dependencies(fast_path=True)` — skipped for subprocess backends; otherwise runs
   `python3 <setup.py> --fast-path <repo>` with the bundle's `sandbox/setup.py` (`container_setup.py:520-572`).
7. `setup_workspace_test_config` — writes hermetic `pytest.ini` (`addopts = -p no:anyio`,
   `norecursedirs`, `python_classes = Test* *Test`, `python_files = test_*.py *_test.py`, filterwarnings) and
   tags `conftest.py` with `# Hermetic test discovery hook for SWE-gemma` (`container_setup.py:864-938`).
8. `setup_baseline_commit(docker, eval_id, 'eval_baseline')` — `git add -A && git commit -m "eval_baseline" --allow-empty -q && git tag -f _swegemma_baseline` (`container_setup.py:575-582`).
9. **Anti-tamper pass 1**: agent patch is stripped of protected paths *before* use:
   `effective_agent_patch = strip_protected_files_from_patch(agent_patch, extra_protected_paths=target_test_files)`
   (`verification.py:435-441`). Protected = `conftest.py`, `pytest.ini`, `pyproject.toml`, `tox.ini`,
   `setup.cfg`, `.pytest.ini`, `sitecustomize.py`, `usercustomize.py`, `_swegemma_stubs.py`, any `*.pth`,
   `test_*.py` / `*_test.py`, and any `.py` under a `tests`/`test`/`testing` dir (`verification.py:62-85`).
10. **Apply agent patch**: written to a host temp file, `copy_to /tmp/`, then
    `apply_patch_in_container(docker, eval_id, '/tmp/<name>')` (`verification.py:444-491`). Failure →
    `resolved=False`, `error=f'Failed to apply agent patch: {err_detail}'` (`verification.py:469-489`).
11. **Anti-tamper pass 2 (reset)**: collect test/config files touched by the agent (incl. renames and untracked
    files via `git diff --name-only HEAD` + `git ls-files --others --exclude-standard`,
    `verification.py:493-519`), union with `target_test_files` (from `task.test_files` or
    `extract_test_files_from_patch(test_patch)`, `verification.py:429-433`) and the fixed list
    `['conftest.py','pytest.ini','sitecustomize.py','usercustomize.py','_swegemma_stubs.py']`
    (`verification.py:521-536`), then `git ls-tree … | xargs -0 git checkout HEAD --` and
    `git clean -f -- <files>` (`verification.py:539-551`).
12. **Apply test patch** the same way (`verification.py:553-599`); failure → `error=f'Failed to apply test_patch: …'`.
13. Re-run steps 6-7 with `overwrite=True` (`verification.py:601-616`).
14. **pytest command** (`verification.py:618-644`), targets = test files from the test patch minus `conftest.py`:

```
cd /workspace && PYTHONSAFEPATH=1 PYTHONNOUSERSITE=1 python3 -s -m pytest <files…> --junitxml=/tmp/_swegemma_junit_<uuid12>.xml -p no:anyio -o timeout=0 -o python_classes="Test* *Test" -q
```

   timeout = `harness.verification_timeout_seconds` (falls back to `command_timeout_seconds`),
   `verification.py:634-644`.

15. **`resolved` criterion** (`verification.py:646-683`): `resolved = (pytest exit_code == 0)`; then the JUnit
    XML is `cat`-ed and validated by `_validate_junit_xml(xml, fail_to_pass, pass_to_pass, test_patch)`
    (`verification.py:266-342`): must parse, must contain ≥1 pass and 0 failures/errors (skips allowed but a
    skipped *required* node fails), and every `FAIL_TO_PASS`+`PASS_TO_PASS` node (or, if absent, test functions
    extracted from the test patch, `verification.py:208-249`) must appear as passing. On top of that a stdout
    sanity check rejects `\b0 passed\b`, `no tests ran`, `collected 0 items`, or any nonempty stdout without
    `passed` (`verification.py:660-667`). Missing XML fails unless the backend is a mock
    (`verification.py:681-683`). Final `TaskResult` carries `test_output=f'STDOUT:\n{stdout}\nSTDERR:\n{stderr}'`
    (`verification.py:694`).
16. Tasks with empty `test_patch` AND empty `FAIL_TO_PASS`/`PASS_TO_PASS`/`test_files` (and not mock) short-circuit
    to `resolved=False`, `error='Missing test specification (empty test_patch and FAIL_TO_PASS; secret hydration
    failed or unavailable)'` (`verification.py:363-382`) — the test patch is **secret-hydrated** from a sibling
    `secret/solution.parquet|csv` by `Evaluator._hydrate_task_from_secret` (`evaluate.py:81-178`).

Patch-application fallback passes, in order, inside `apply_patch_in_container` (`container_setup.py:585-856`,
embedded script at 604-845): Pass 1 raw patch `git apply` → `-3` → `--ignore-space-change --ignore-whitespace` →
`--recount`; Pass 2 the same four on a **normalized** patch (symlink-realpath rewrite, `normalize_patch`,
665-761); Pass 3 the same four with `-p0` on raw+normalized; Pass 4 GNU `patch` non-interactive with `--dry-run`
validation: `patch -p1 --batch --forward -i`, `patch -p1 -l …`, then `-p0` variants. Path-safety pre-check rejects
absolute paths and `..` with `"Unsafe path traversal in patch: …"` (`container_setup.py:620-634`).

**Sandbox backends** (selected by `EvalConfig.sandbox`: `'docker'` default or `'subprocess'`,
`config.py:98`; CLI `--sandbox`, `cli.py:149-154`; `Evaluator.__init__` picks `ContainerManager` vs
`SubprocessManager`, `evaluate.py:69-79`):

- `ContainerManager` (`swegemma/sandbox/docker.py:96`): docker SDK (`docker.from_env(timeout=300)`, line 114),
  `containers.run(image, command='sleep infinity', …)` (line 671), exec via
  `container.exec_run(['/bin/bash','-c', f'timeout -k 5s {t} /bin/bash -c {cmd}'])` (lines 707-710). Image
  default `swebench-sandbox:latest`, falls back to `gcr.io/kaggle-playground-170215/swebench-sandbox:v1|:latest`
  (`docker.py:25-29`). Assumes Linux container, `python3`, git, GNU `patch`, `tar` (+ optional `pigz`).
- `SubprocessManager` (`swegemma/sandbox/subprocess.py:30`): per-sandbox temp root `workspace/ tmp/ wheels/
  venv/` (`subprocess.py:311-412`), command text rewritten `/tmp` `/workspace` `/usr/local/bin` `/wheels` → real
  dirs (lines 432-481), then executed as **`['/bin/bash', '-c', cmd]`** (`subprocess.py:495-501`) with
  `PATH=venv/bin:host_bin:$PATH` using `:` separators (line 487). Assumes a POSIX host with `/bin/bash`, GNU
  `git/tar/patch`, `venv/bin/python3` (line 372).
- `SubprocessSandbox` (`adk_eval_core/sandbox/subprocess_sandbox.py:147`) and `DockerSandbox`
  (`adk_eval_core/sandbox/docker_sandbox.py`) exist in eval-core; swegemma only uses the two above.
  `execute_subprocess_command` (shared helper, `subprocess_sandbox.py:57-144`) uses `os.killpg`/`os.getpgid`
  (lines 112-114, 128-144) — Unix-only.

**Windows-without-Docker verdict:** the full `verify_task` cannot run natively on Windows. Blockers: (a)
`import swegemma.*` fails on `import docker` at module level (`adk_eval_core/sandbox/containers.py:19`, pulled in
by every `swegemma` module via `adk_eval_core/__init__.py`; probe-confirmed); (b) `SubprocessManager.exec`
hard-codes `/bin/bash` (`subprocess.py:496`); (c) `execute_subprocess_command` needs `os.killpg`
(`subprocess_sandbox.py:112`); (d) venv layout assumes `bin/`, `:` PATH (`subprocess.py:372,487`); (e) every
grading step is a POSIX shell command (`cd /workspace && …`, `git checkout`, `git clean`, `tar`, `patch`).
What *can* run on Windows: importing the grading functions behind a stub `docker` module (§7), and the pure
Python pieces — `strip_protected_files_from_patch`, `_validate_junit_xml`,
`extract_test_files_from_patch`, `_extract_test_functions_from_patch` — which is enough to reproduce steps
9/11/15 by hand. Closest faithful substitute: run `verify_task` under WSL2 with `--sandbox subprocess`
(what the staff notebook itself uses; see `deliverables/2026-11-24_BCF_Tuning_Bottlenecks_and_Parity/03_Local_Kaggle_Parity_Plan.md:21,43-45`),
or replay the exact command list from steps 4-14 above under Git Bash against an extracted snapshot.

## 4. Compaction and model configuration

Compaction is **off by default**: `EvalConfig.events_compaction_config=None` (`config.py:118`) and
`run_agent_sandbox` only passes it to the ADK `App` when set (`agent_runner.py:692-695`); the CLI exposes no flag
(`cli.py` has none). If a config supplies it, ADK's `EventsCompactionConfig` requires `compaction_interval` and
`overlap_size`, with optional `token_threshold` and `event_retention_size`
(`google/adk/apps/_configs.py:50-85`). Model: the submission's `agent.yaml` `model:` alias resolved through
`ModelRegistry`; competition model is `gemma-4-31b-it-qat-w4a16-ct` (`HARNESS_README.md` / GettingStarted
Kaggle-03, line 109/185). CLI registry built from env `MODEL_PROXY_URL` / `LITELLM_API_BASE` /
`LOCAL_INFERENCE_URL` / `OPENAI_BASE_URL` (default `http://localhost:8000/v1`) and key env
`MODEL_PROXY_API_KEY` / `LITELLM_API_KEY` / `LOCAL_API_KEY` / `OPENAI_API_KEY` (default `'EMPTY'`), wrapped in
`LiteLlm(..., num_retries=5)` (`cli.py:37-109`). Context window 32768 (the "4x L4 vLLM context length" bound,
`config.py:42-43`); generation bounds `max_output_tokens ∈ [1,32768]`, `thinking_budget ∈ [0,32768]`, defaults
`max_output_tokens=16384`, `thinking_config.thinking_budget=4096` applied when the submission sets none
(`config.py:59-67`; application at `adk_submission/resolvers/generation.py:48-55`). Temperature/top_p/top_k are
whatever `agent.yaml` sets; the harness adds none.

## 5. Agent loading (`compile_submission`)

`compile_submission(submission_dir, tool_registry, model_registry, callback_registry=None, limits=None,
generation_constraints=None, code_executor=None, script_timeout=300, skill_registry=None, adapter_manifest=None,
adapter_resolver_fn=None, agent_factory=None) -> BaseAgent` (`adk_submission/compiler.py:59-114`; called from
`agent_runner.py:616-628` with the nine-tool dict, `AdkSandboxCodeExecutor`, `script_timeout` =
`command_timeout_seconds or 300`). A plain dict tool_registry is wrapped into `ToolRegistry`
(`compiler.py:115-120`); a plain-string tool resolves to the callable with `__name__` forced to the YAML name
(`resolvers/tools.py:64-86`).

- **SequentialAgent semantics**: compiled with just `name/description/sub_agents` + callbacks
  (`builders/workflows.py:40-68`) → ADK runs sub-agents in order, resuming from persisted
  `current_sub_agent` state (`google/adk/agents/sequential_agent.py:55-92`). State passes between sub-agents via
  `output_key`: an LlmAgent's final text event is written to `event.actions.state_delta[output_key]`
  (`google/adk/agents/llm_agent.py:830-871`), and other agents read it from session state. The eval harness
  nudges via a fresh `new_message` on the same session (nudge texts at `agent_runner.py:983-1000`), so a
  re-entered SequentialAgent resumes per its saved agent state; `max_nudges = 3`
  (`agent_runner.py:784,965-971`).
- **`include_contents: none`** (schema allows only `"default"|"none"`, `adk_submission/schema.py:284`): the
  content processor then sends **current-turn contents only, not full history**
  (`google/adk/flows/llm_flows/contents.py:71-86`) — note it is not literally "no contents".
- **`{var}` vs `{var?}`**: state injection replaces `{var}` from session state; a missing `{var}` raises
  `KeyError` (the model sees the raw text if the name is invalid), while `{var?}` substitutes `""` when missing
  (`google/adk/utils/instructions_utils.py:80-125`). Applied to instructions at
  `google/adk/flows/llm_flows/instructions.py:51-59`.
- **Skills**: `skills:` list on an LlmAgent (`schema.py:288-291`) → `resolve_skills` loads each dir with
  `google.adk.skills.load_skill_from_dir` (or SkillRegistry), enforces size/instruction limits, then builds one
  `SkillToolset(skills=…, code_executor=ctx.code_executor, script_timeout=…, additional_tools=<agent's own
  resolved tools>)` and appends it to `tools` (`resolvers/tools.py:129-265`; llm builder
  `builders/llm.py:67-69`). This is why a skill-declaring agent exposes `load_skill`, `load_skill_resource`,
  `run_skill_script` *plus* every registry tool (`_SKILL_TOOL_NAMES`, `agent_runner.py:61`).
- **`run_skill_script` schema** (`google/adk/tools/skill_toolset.py:724-774`): required `skill_name: str`,
  `file_path: str` (auto-prefixed `scripts/`); optional `args` — `anyOf` object or **array of strings** —
  `short_options: object`, `positional_args: array[string]` (mutually exclusive with list `args`). Supported
  script types `.py`, `.sh`, `.bash` else `UNSUPPORTED_SCRIPT_TYPE` (`skill_toolset.py:479-490`).
- **Where skill scripts execute**: `RunSkillScriptTool` → `_SkillScriptCodeExecutor._build_wrapper_code`
  materializes *all skill files* into a fresh `tempfile.TemporaryDirectory()`, `os.chdir(td)` there, runs the
  script with cwd = that temp dir (`skill_toolset.py:571-710`), and hands the generated wrapper to
  `AdkSandboxCodeExecutor.execute_code`, which writes `.adk_exec_<hex>.py` into the sandbox work_dir and runs
  `python3 <path>` via `sandbox.run_command` (`adk_eval_core/sandbox/base.py:164-223`). So: executor = the same
  sandbox as `run_command`; cwd = temp dir (NOT `/workspace`); `/workspace` reachable only by absolute path;
  shell scripts return a JSON `__shell_result__` envelope parsed back into stdout/stderr/returncode
  (`skill_toolset.py:503-528`). Missing executor → `NO_CODE_EXECUTOR` error (`skill_toolset.py:855-862`).
- **Budget gating of skill calls**: not `@budget_gated` (they're ADK tools), but the executor calls
  `budget_check_fn()` = `context.check_budget()` with default `count_tool_call=True` before every execution
  (`adk_eval_core/sandbox/base.py:179-181`; wired at `agent_runner.py:609-615`) — so each `run_skill_script`
  **does consume one tool call**, and timeout is min(`script_timeout`, remaining session time).

## 6. End-to-end `swegemma eval`

CLI `swegemma eval --tasks … --snapshots-dir … --results-dir … --submission-dir … [--image swebench-sandbox:latest]
[--sandbox docker|subprocess] [--max-tool-calls N] [--max-turns N] [--timeout-seconds N]
[--verification-timeout-seconds N] [--max-time-minutes 60.0] [--models-yaml …] [--task-id …] [--skip-agent-patch]
[--concurrency 1] [--shard-index N --num-shards N] [--display auto]` (`cli.py:122-235`). Requires a model server
reachable at the env-selected endpoint (§4) and, for docker mode, a running daemon with the sandbox image.
Phase 1 = `run_agent_sandbox` (Container A; snapshot extract → wheels → git exclude → editable install → test
deps → test config → baseline commit `'baseline'`+tag `_swegemma_baseline` → optional pytest masking → prompt →
loop, `agent_runner.py:493-1019`). Phase 2 = `verify_task` (§3).

Outputs (`swegemma/results.py`): `task_results.jsonl` per line
`{instance_id, repo, resolved, agent_patch_size, test_exit_code, duration_seconds(rounded 2dp), error,
tool_calls, total_llm_calls[, task_index]}` (`results.py:17-36`); `summary.json`
`{total_tasks, resolved, resolution_rate, by_repo, errors}` (`results.py:80-88`); `patches/<id>.patch`;
`test_outputs/<id>.log`; `logs/<instance_id>.log` (agent console, `agent_runner.py:503-509`);
`traces/trace_<id>.json` (SessionTrace; ids with `/` → `__`, `verification.py:42-59`). `resolved` = §3 step 15.
`duration_seconds` = `perf_counter() - start_time` where the clock starts **before** Container A setup
(`evaluate.py:233` → `verification.py:685`), so it includes setup + verification; the budgeted agent time is the
separate `agent_elapsed_seconds` window (`context.py:435-445`). Task loading: `load_tasks` from JSONL with
secret hydration (`evaluate.py:165-178`, `models/task.py:218-233`).

## 7. "No-model" recipe (real Container B verdict without a model)

Inside `scratch/2026-11-23-bcf-brain/venv/Scripts/python.exe -X utf8` (probe-verified imports):

```python
import sys, types
docker_stub = types.ModuleType('docker')
err = types.ModuleType('docker.errors')
class _E(Exception): pass
err.DockerException = err.NotFound = err.APIError = err.ImageNotFound = _E
docker_stub.errors = err
docker_stub.from_env = lambda **k: None
docker_stub.DockerClient = object
sys.modules['docker'] = docker_stub
sys.modules['docker.errors'] = err

from pathlib import Path
from swegemma.config import EvalConfig
from swegemma.models import load_tasks
from swegemma.harness.verification import verify_task, strip_protected_files_from_patch, _validate_junit_xml
from swegemma.harness.container_setup import apply_patch_in_container
```

Then, on a Linux/WSL2 host (not native Windows), build `EvalConfig(tasks_path=…, snapshots_dir=…,
results_dir=…, submission_dir=…, models=ModelRegistry(), sandbox='subprocess')`, hydrate the task's
`test_patch` from the secret bundle (or inject it into the Task yourself), and
`asyncio.run(verify_task(SubprocessManager(timeout_seconds=300), config, task, snapshot_path,
agent_patch=<patch string>, start_time=time.perf_counter()))` → `TaskResult.resolved` is the real Container B
verdict. `--skip-agent-patch` (`evaluate.py:300-303`) is the built-in way to grade the empty-patch baseline.
Pure-Windows substitute: extract the snapshot with Python `tarfile`, run the four `git apply` passes of
`apply_patch_in_container` verbatim (`container_setup.py:775-841`), apply the reset + test patch, run the exact
pytest line of §3 step 14 under Git Bash, then call `_validate_junit_xml(xml, FAIL_TO_PASS, PASS_TO_PASS,
test_patch)` and apply the stdout checks of §3 step 15. Every blocker + substitute is listed at the end of §3.

## Unconfirmed / could not verify

- `swegemma/sandbox/docker.py` exec/copy paths were read but never executed (Docker daemon stopped); runtime
  behavior of `exec_run` timeouts and `put_archive` fallbacks is source-derived only.
- The staff-side `sandbox/setup.py` (install_test_dependencies target) is not in the local data package paths
  probed; its `--fast-path` behavior is inferred from the call site only (`container_setup.py:553-555`).
- `google/adk` skill `Skill`/`SkillResources` loading (`load_skill_from_dir`) was not read in full; schema of
  `frontmatter` returned by `load_skill` unverified.
- JUnit `classname` matching heuristics (`_node_matches_requirement`, `verification.py:252-263`) verified by
  reading, not by fixture execution.
- Whether Kaggle's production scorer runs this exact `swegemma` version is unverifiable locally; everything here
  describes the shipped packages 0.2.11 / 0.1.0 / 0.2.13 / 1.36.1.
- The README (`HARNESS_README.md`) agreed with source everywhere I cross-checked (tool list lines 378-508, caps
  547-548, nudges 357-359, budget_warning 373); no disagreements found, so no errata section was needed.
