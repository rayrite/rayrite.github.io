# bcf-brain: the deterministic brain for the Batonic Coding Framework

Code for the Kaggle Gemma 4 Developer Agent competition, tracks `gemma-4-31b-it-qat-w4a16-ct` and `gemma-4-e4b-it-qat-w4a16-ct`. Design and justification: `../02_BCF_Brain_Design_and_Justification.md`. Test results: `../03_Validation_Results_and_Submission_Playbook.md`.

## Layout

```text
bcf-brain/
├── assemble.py          # builds src/bcf.py from the three parts (compile-checked, atomic, backed up)
├── build.py             # builds the six bundles and zips into dist/
├── parts/               # source of the helper
│   ├── _bcf_head.py     #   constants, taxonomy tables, repository access, the editor
│   ├── _bcf_find.py     #   the localizer (`find`)
│   └── _bcf_tail.py     #   verification, hygiene, journal, baton, installer hook, command dispatch
├── src/                 # what build.py copies into a bundle
│   ├── bcf.py           #   assembled helper (the file that runs in the sandbox)
│   ├── prompts/         #   planner and solver prompts, assembled per bundle
│   └── skills/bcf-spec/ #   SKILL.md and scripts/install.py
├── dist/                # the six ready-to-submit bundles and their zips
├── tests/test_bcf.py    # 37 behaviour tests for the helper
├── tools/               # validator, environment setup, table check, evaluation tools
└── validation/          # logs and result files of the validation runs of 2026-11-23 and 2026-11-24
```

## The six bundles

| Bundle | Topology | Skill | Files | Use |
|---|---|---|---|---|
| `bcf-31b-sequential` | planner, then solver | yes | 11 | The requested layout: root `SequentialAgent` with `bcf_plan` and `solver` |
| `bcf-31b-flat` | one agent | yes | 7 | Control twin: same helper and procedure in one agent |
| `bcf-31b-noskill` | one agent | no | 4 | Fallback and baseline: same procedure, heredoc edits, no skill tool |
| `bcf-e4b-sequential` | planner, then solver | yes | 11 | Bonus track, small thinking budget, short prompts |
| `bcf-e4b-flat` | one agent | yes | 7 | Control twin for the bonus track |
| `bcf-e4b-noskill` | one agent | no | 4 | Fallback for the bonus track |

The files of a bundle sit at the root of its zip (`agent.yaml` first). The zips in `dist/` are for convenience; the submission notebook builds its own archive from the bundle folder.

## Quick start

```bash
python build.py                       # bundles and zips in dist/
python -m unittest tests.test_bcf     # helper tests (about 90 seconds)
python tools/setup_validate_venv.py   # once: isolated environment with the official harness packages (downloads about 870 MB)
python tools/run_validator.py         # official compiler on all six bundles, then 15 negative controls
```

`build.py` needs Python 3.10 or later and nothing else. The validation environment needs Python 3.12.

## How a task runs

| Step | Who | Action |
|---|---|---|
| 1 | planner | One call to the skill: `run_skill_script(skill_name="bcf-spec", file_path="scripts/install.py")`, no other argument. The installer copies the helper to `/workspace/.git/bcf/bcf.py`, starts the clock and prints the repository map |
| 2 | planner | One `run_command`: `python3 /workspace/.git/bcf/bcf.py plan` with a short brief on standard input. The helper classifies, searches and prints the baton |
| 3 | planner | Final answer: the baton. It becomes the solver's instruction variable `bcf_spec` |
| 4 | solver | `ctx` on the first target, `apply` the fix, `repro` or `test`, `finalize`, `submit_patch` |

The helper's commands are listed in Document 02, Section 5.1. Type `python3 /workspace/.git/bcf/bcf.py` without a command for the same list.

## Where to change what

| To change | Edit | Then |
|---|---|---|
| Budget milestones (first edit, verification, freeze, hard stop) | `parts/_bcf_head.py`: `T_EDIT_S`, `T_VERIFY_S`, `FREEZE_FRAC`, `HARD_FRAC` | `python assemble.py` |
| Per-task budgets | `build.py`: `EVAL` and `parts/_bcf_head.py`: `BUDGET_S` (the build stops if they disagree) | `python assemble.py`, `python build.py` |
| Domain hints and the category rules | `parts/_bcf_head.py`: `HINTS`, `DOMAINS`, `KIND_RULES` | `python assemble.py` |
| How a route is chosen | `parts/_bcf_tail.py`: `cmd_plan` | `python assemble.py` |
| The localizer | `parts/_bcf_find.py` | `python assemble.py` |
| Prompts | `src/prompts/*.md` (planner prompts are whole files; the solver prompt is head, core and tail per track) | `python build.py` |
| Sampling parameters | `build.py`: `SAMPLING` | `python build.py` |

After any change run the three commands: assemble, tests, validator. The build refuses prompts that contain a brace expression other than the two state variables, because such an expression stops every task on the scorer.

## Tools

| Tool | Purpose |
|---|---|
| `tools/setup_validate_venv.py` | Creates the isolated environment with `adk-submission` 0.2.13, `adk-eval-core` 0.1.0, `swegemma` 0.2.11 and `google-adk` 1.36.1 from the public wheelhouse |
| `tools/validate_official.py` | Compiles one or more bundles with the harness's own `compile_submission()` and checks what the compiler does not |
| `tools/run_validator.py` | Runs the compiler on `dist/` and the negative controls; exit code 0 only if everything passes |
| `tools/negative_controls.py` | Presents 15 broken copies of a bundle to the validator; every one must be rejected |
| `tools/replay_gold.py` | Replays the published fixes through the helper's editor on real snapshots and compares with `git apply` |
| `tools/eval_localizer.py` | Measures the localizer on all snapshots: is the gold-touched file in its top ranks |
| `tools/index_snapshots.py` | Builds the snapshot store from the competition zip (needed by the two tools above and by `tools_materialize.py`) |
| `tools/tools_materialize.py` | Writes one snapshot from the store into a Git checkout |
| `tools/bench_real.py` | Times install, search and plan on real checkouts |
| `tools/qc_tables.py` | Checks the Markdown tables of a folder |

The evaluation tools need the snapshot store: `python tools/index_snapshots.py <competition zip> <tasks.jsonl> <store>` (about one minute for 129 snapshots; the store holds text files only). `eval_localizer.py` also needs `features.jsonl` and the analysis packs from `../analysis/`.

## Validation evidence

| File in `validation/` | Content |
|---|---|
| `final_validate.log` | Complete run: assembly, build, tests, real-checkout tests, timings, official compiler on six bundles, 15 negative controls, localizer evaluation |
| `replay_gold_final.json` and `.log` | The replay of the 129 published fixes, per task |
| `localizer_final.json` | The localizer evaluation, per task |
| `bench_real.log` | Timings on the FastAPI and rich checkouts |

## Known limits

- No run with the Gemma 4 model was made. Whether the planner relays the baton and the solver follows the route is untested.
- The mean seconds per task is unknown. A run that exceeds 12 hours scores zero, so measure it locally before the first submission.
- Skill scripts are reported by one team to score 0.00 on the scorer while working locally. The no-skill bundles remove that dependency.
