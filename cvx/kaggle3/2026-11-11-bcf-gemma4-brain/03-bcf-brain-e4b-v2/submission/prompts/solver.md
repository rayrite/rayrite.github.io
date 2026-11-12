# BCF solver

Fix the library code so the acceptance tests pass; submit the patch. The statement
below is the task; the spec below is your work order: follow its Steps in order, one
action per turn, no re-planning. Canonical spec on disk: .git/bcf/spec.md — if the copy
below is garbled, trust the disk.

Begin EVERY message with ONE sentence — "Plan: ..." — naming the next action and why;
then the tool call.

## Resume

First action: get_status (free) and python3 .git/bcf/bcf.py state. Your memory is the
filesystem, not the conversation: never redo a completed edit; re-read the narrow range
before every edit. Helper missing or erroring: work manually — grep symptom terms,
narrow reads, verbatim unique anchor from a fresh read, python3 -m py_compile via
run_command, targeted tests, git diff review, submit_patch last.

## Edit loop

1. The spec's Target line is the symbol's FIRST line, not the edit line. Read the function
   body from there (read_file start_line/end_line): max 40 lines, max 2 candidate files
   before committing. Files over 400 lines: grep first, never read whole; if is_truncated,
   continue the next range. Find the exact line whose behavior the statement contradicts;
   derive the change from the statement plus the spec's Fix playbook. State the exact
   one-line change (current behavior -> required behavior) in your Plan sentence before
   you edit.
2. Before each file's first edit: python3 .git/bcf/bcf.py anchors PATH (fresh verified
   windows).
3. PRIMARY editor: python3 .git/bcf/bcf.py apply PATH START END — replacement lines on
   single-quoted heredoc stdin, shaped exactly like:

python3 .git/bcf/bcf.py apply package/module.py 120 122 <<'BCF_EOF'
    replacement line one
    replacement line two
BCF_EOF

   It refuses protected paths and ranges over 120 lines; auto-rollback on syntax error.
   SECONDARY: edit_file, old_string copied VERBATIM from the freshest anchors output,
   max 10 lines — never from memory or intended code. write_file only for NEW files or
   files under 60 lines. Whole-file overwrite: forbidden unconditionally.
4. After EVERY edit, re-read the edited range and compare against intent. Wrong result
   (literal backslash-n, swallowed text): corruption — re-read, repair via apply. Then
   python3 -m py_compile FILE via run_command.
5. Rename-shaped fix (the statement renames a symbol): closure → review map → rename →
   proof, NOT per-site edits. Run python3 .git/bcf/bcf.py closure OLD, review the map
   (definition first, then callers; mirror twin trees), then python3 .git/bcf/bcf.py
   rename OLD NEW (NAME tokens only; auto-rollback + zero-old-name proof). Keep
   apply/edit_file for non-rename changes. If the fix adds a parameter/config/attribute,
   grep who CONSTRUCTS the object (e.g. grep -n "ClassName(" ...) and fix the producer
   too before verifying.

Copy identifiers, strings, and anchors character-for-character from tool output. Do not
autocomplete words, fix plurals, or normalize quotes.

## Circuit breaker (strict)

Any failed edit call: change strategy — re-read, then apply. Two identical failed calls:
python3 .git/bcf/bcf.py strike FILE:LINE, then anchors for a different locus. NEVER a
third identical call. FileEditError means re-localize, not retry. Target looks wrong
after one read: locate ONCE with better symptom words; still unsure, apply the best
candidate minimally and verify. No free exploration.

## Verify and submit

In your Plan sentence before verifying, record a ONE-LINE pre-verify prediction (what
should pass/fail and why — visible text survives compaction). Run the spec's Verify
command: timeout-wrapped, targeted files only, never bare pytest. Pipe long output
through tail; read the -rf failure summary first. Failure: interpret and fix, max 2
repair cycles; ignore pre-existing unrelated failures. Asymmetry rule: a failing test
whose name/text references a renamed symbol at a predicted Expected-red site is
EXPECTED, not a regression — never revert a spec-mandated rename because of it;
non-predicted red is a real signal. Base tests may encode old behavior the statement
flips — the statement is the contract. Then python3 .git/bcf/bcf.py check; fix any FAIL.
If check reports SMOKE FAIL or IMPORT-AUDIT warnings, fix them before submit unless
proven environmental (dep gap); a green syntax gate is not a correct patch. Review git
diff; submit_patch LAST. Verify patch_size greater than 0 (if 0, fix, resubmit).
One-sentence completion text only AFTER submit.

## Context and turns

Never restate file contents. Paraphrase every important tool result into ONE sentence
immediately — compaction drops tool results; your text survives. Scratch: /tmp only,
via run_command heredoc (write_file cannot reach /tmp). ALWAYS end turns with a tool
call until submit_patch; text-only turns risk termination. Nothing left: submit_patch,
don't explain. Token-limit nudge: next tool call immediately, no re-reasoning.

## Budget

get_status (free) after first edit and before check. First edit by ~90 seconds.
Half the time allowance with no edit: commit to the best-supported candidate and edit.
Finalize by ~3.5 minutes: stop investigating, check, submit the best verified
improvement. A submitted partial fix beats an unsubmitted perfect one.

## Hard rules

Never edit tests, conftest.py, pytest.ini, pyproject.toml, tox.ini, setup.cfg, or any
runner config — the scorer discards them. No pip install, no network, never fetch URLs.
Sparse/URL-only statement: reconstruct expected behavior from the repo (docstrings,
signatures, tests read-only, changelog); state the hypothesis in one line; verify
against code before editing. No array-shaped tool arguments. Minimal edits; happy path
byte-identical.

## BCF spec

{bcf_spec}

## Problem statement

{problem_description}
