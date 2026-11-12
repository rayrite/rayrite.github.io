---
name: bcf-spec
description: Deterministic classifier and fix-spec helper for Python repo tasks. Install once per task with zero arguments, then drive bcf.py through run_command for ranked targets, verified unique edit anchors, line-range apply, expected-red rename prediction, caller-closure batch renames, and a pre-submit compile + import-audit + smoke gate. Standard library only; works offline.
---

# BCF spec helper

A deterministic accelerator for Python repository fix tasks. It classifies the problem,
ranks candidate files by distinct symptom-term coverage, generates verified-unique edit
anchors, applies line-range edits with an automatic syntax rollback, and gates the patch
before submission. It is an accelerator, not a dependency: the manual workflow in the agent
prompt is fully sufficient if the helper is unavailable.

## When to use

Every task, as the first action of the planning stage. The solver re-uses the installed
helper through run_command. On re-entry the helper returns the cached spec in one call, so
never re-install mid-task unless the installed file is missing. Install once per task: the
sandbox workspace is wiped between tasks.

## Install (zero arguments)

Call exactly this, with no args field:

run_skill_script(skill_name="bcf-spec", script_path="scripts/install.py")

Never pass arguments to a skill script; the args array is a documented server-hang trigger.
The installer copies the helper into the repository at .git/bcf/bcf.py and prints a small
status envelope (status ok, an installed flag, the path, and a version). If the runner
errors, retry once. If install fails with an unknown-skill error and a load-skill tool
exists, call load_skill(skill_name="bcf-spec") once, then retry install. If it still fails,
follow the manual playbook in the agent prompt. Do not call load_skill or load_skill_resource
otherwise: load_skill re-returns this whole body on every call, which wastes context.

## Use (after install, always through run_command)

All helper calls go through run_command with a single shell string starting
python3 .git/bcf/bcf.py followed by the subcommand. Never call the helper through
unverified skill-tool arguments. Subcommands:

- spec — compute and cache the fix spec. Reads the statement from .git/bcf/problem.md if
  present, otherwise from a single-quoted heredoc on stdin. Prints a spec of at most 300
  words. A second run returns the cached spec in one call. When the statement renames a
  symbol, the spec adds Rename and Expected red sections listing the visible-test sites
  that will go red after the rename (expected, not a regression — do not revert).
- anchors PATH — print fresh verified-unique edit windows for one repo-relative file, with
  line numbers and a status of unique, absent, or ambiguous. Run before every edit.
- apply PATH START END — replace the inclusive 1-indexed line range with replacement lines
  supplied on a single-quoted heredoc stdin. Refuses protected paths and ranges over 120
  lines, backs up, writes atomically, and rolls back automatically on a syntax error.
- locate WORDS — re-rank the top file:symbol:line hits, merging new words with the stored
  spec cues. Empty words reuses the spec cues. Use when a candidate looks wrong.
- strike FILE:LINE — record a failed anchor so future anchors exclude it. Use after two
  identical failed edit calls, then change strategy. Never make a third identical call.
- expected-red — re-print the predicted visible-test red sites for a statement rename and
  journal them to state. Zero arguments; reads the cached problem. Run after spec on a
  rename task to confirm which failing tests are EXPECTED (do not revert the rename).
- closure SYMBOL — print a caller-closure map for a rename: every code / comment /
  string-docstring / decoy-substring occurrence of SYMBOL in non-test, non-protected .py
  sources, plus a suggested fix order (definition file first, then callers) and a twin-tree
  note when sync/async copies exist. Review the map before running rename.
- rename OLD NEW — scoped batch rename of NAME tokens only (tokenize-based; never touches
  comments, strings, or decoy substrings). Backs up, writes, compiles, and auto-rolls back
  on a syntax error, then re-greps to prove zero remaining OLD name-tokens. Two scalar words
  only; refuses protected paths and tests. Use for rename-shaped fixes instead of per-site
  edits; keep edit_file/apply for non-rename changes.
- check — pre-submit gate: protected-path scan, scratch scan, compile gate on every changed
  Python file, and diff-nonempty, plus two non-blocking diagnostics: IMPORT-AUDIT (possible
  missing imports) and SMOKE (runs the repro seed). Prints CHECK: PASS or CHECK: FAIL with
  reasons. A green syntax gate is not a correct patch: fix SMOKE FAIL / IMPORT-AUDIT warnings
  before submit unless proven environmental. Run before submit_patch.
- state — restart compass: spec summary, git diff stat, strikes, rename predictions, last
  check, and a deterministic next-action hint. Run after any restart or compaction to re-orient.

The problem statement and apply replacements arrive on stdin via a single-quoted heredoc so
the shell does not expand backticks, dollar signs, or brackets in the payload. Helper output
is capped; helper state lives under .git/bcf/ and never enters the patch.

## Rules

Skill scripts take zero skill-tool arguments. Never edit test files or runner configs
(tests, conftest.py, pytest.ini, pyproject.toml, tox.ini, setup.cfg); the scorer discards
those changes. Put scratch scripts in /tmp via run_command, never in the workspace at submit
time. Run check before submit_patch. submit_patch is free and must be the last action; verify
the reported patch size is greater than zero. Keep edits minimal and the happy path unchanged.

## Degradation

If the helper is unavailable, the prompt's manual workflow is fully sufficient: grep symptom
terms, rank files by distinct-term coverage, read the top candidate narrowly, state the
mechanism in one sentence, edit with a verbatim unique anchor, gate with python3 -m py_compile
through run_command, run targeted tests, review git diff, and submit_patch last.