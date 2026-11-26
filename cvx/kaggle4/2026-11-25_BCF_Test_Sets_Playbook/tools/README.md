# Tools

Scripts of the playbook. All are Python 3 with the standard library only, so they run before anything is installed (`python3` of Zorin is enough), except where the table says otherwise. They read `playbook.conf` (next to `sets/`), write only where told, and never read the Kaggle token file.

| Script | Purpose | Usage | Status on 2026-11-25 |
| --- | --- | --- | --- |
| `common.py` | What the other scripts share: the six sets, the groups, a table writer that derives its separator row, the configuration reader | not run by itself | Used by every script |
| `make_slices.py` | Cuts every set into parts: smoke, slices, halves, the check cut, the lists by group and by statement; optional custom cuts; writes `sets/` | `python3 tools/make_slices.py [--check] [--set P20] [--custom name=3]` | Executed: the shipped lists are its output; `--check` passes; two custom cuts made (`trio`, `fifths`) |
| `run_set.py` | Runs one part of one set with one version through `run_panel.py`, after checking everything; writes a sidecar with the bundle's checksum | `python3 tools/run_set.py --set P20 --part slice_A --version v2 [--run N] [--dry-run] [--bundle PATH] [--list]` | Executed in dry-run mode and with a pretend runner (self-test). Not executed with the real runner |
| `compare.py` | Pairs two or more result folders task by task: the runs, the paired table with the sign test, by group and by statement, the tasks that changed, and what it means | `python3 tools/compare.py RUN_A RUN_B [--name BEFORE AFTER] [--md out.md]`; pooled: `name=RUN name=RUN other=RUN ...` | Executed on pretend results in the harness's result format |
| `ledger.py` | One table of every run under `RESULTS`, from the summaries and sidecars | `python3 tools/ledger.py` | Executed on pretend results |
| `gates.py` | The gold and empty gate through the harness's own grader | `python3 tools/gates.py --set P20 --part full`; `--selfcheck` | `--selfcheck` executed in the harness environment (Windows). The gate itself was not run: it needs Linux, Docker and the data set |
| `preflight.py` | What `run_panel.py` does before a run, without the server and without a task | `<harness python> tools/preflight.py --bundle PATH --tasks FILE --snapshots DIR` | Executed in the harness environment (Windows): imports, adapters, registry, settings, evaluator all pass |
| `finish_env.py` | Completes the harness environment from `harness-lock.txt` (each package with `--no-deps`), then imports every module the harness uses and repairs what is missing | `<harness python> tools/finish_env.py [--dry-run] [--check]` | Executed on Windows in a new environment: 151 packages from the lock, then the probe passed (1,340 of 1,341 modules; the other is Windows-only). Needs `uv` |
| `harness-lock.txt` | The harness tree resolved once with uv for Linux and CPython 3.12 (155 packages; the wheelhouse's versions kept) | read by `finish_env.py` | Written by `make_harness_lock.py` today, metadata only |
| `make_harness_lock.py`, `make_constraints.py` | Write the lock again if the competition publishes a new wheelhouse | `python3 tools/make_constraints.py <wheelhouse> constraints.txt`; `python3 tools/make_harness_lock.py --wheels <folder> --constraints constraints.txt` | Executed (metadata only) |
| `check_setup.py` | The acceptance checks in one table | `python3 tools/check_setup.py [--full]` | Executed on Windows: it reports what this machine lacks and passes what exists |
| `selftest.py` | 21 tests of the tools with a pretend runner and pretend results | `python3 tools/selftest.py` | Executed: 21 of 21 pass |
| `assemble.py` | Fills the placeholders of the playbooks with the tables of `sets/` | `python3 tools/assemble.py` | Executed |
| `build_guide.py`, `guide-template.html` | Build `BCF_Test_Sets_Guide.html` from the playbooks and the lists | `python3 tools/build_guide.py` (needs `pandoc`) | Executed; the guide was opened in a browser |
| `qc_tables2.py` | The table check used for this package's documents | `python3 tools/qc_tables2.py <folder>` | Executed |

Notes:

- A run folder is never overwritten: `run_set.py` takes the next free number or stops.
- The result format that `compare.py` and `ledger.py` read was taken from the harness's own source (`swegemma/results.py`, version 0.2.11): `task_results.jsonl` with `instance_id`, `resolved`, `agent_patch_size`, `test_exit_code`, `duration_seconds`, `error`, `tool_calls`, `total_llm_calls`, `task_index`.
- `finish_env.py` needs the four harness wheels installed first (Playbook 1, step 8). It installs with `uv pip install --no-deps`, one package at a time, so that nothing already installed is replaced.
- `harness-lock.txt` is for Linux and CPython 3.12.13. On another system some wheels may be missing; the script then stops with the message of uv and continues when re-run.
