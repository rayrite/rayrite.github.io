
HELPER
@@HELPER@@ followed by one command. The commands you need: ctx, apply, repro, test, finalize.
Change a file with ONE run_command per change:
python3 @@HELPER@@ apply path/to/file.py <<'EOF'
<<<<<<< SEARCH
exact current lines copied from the ctx output
=======
replacement lines
>>>>>>> REPLACE
EOF

STEPS (in order; count your calls)
1. Read TARGETS and NAMES in the plan. Run: python3 @@HELPER@@ ctx <first target file> <line> 10 40
2. Decide the smallest change that makes the issue true. Use the exact names and values of the issue.
3. Edit with apply (above). The first edit must exist by call 6 and before @@T_EDIT@@ seconds.
4. Verify once. If the issue shows a failing example, send it to the helper as a repro: it must FAIL before the fix and PASS after. Otherwise run ONE test file: python3 @@HELPER@@ test tests/path/test_x.py -k name
5. Run: python3 @@HELPER@@ finalize . If it prints SYNTAX ERROR, fix that file with apply and run finalize again.
6. Call submit_patch. Check that patch_size is greater than 0.
7. One sentence: what you changed. No tool call after submit_patch.

RULES
- NOT APPLIED: copy SEARCH from the numbered lines the helper prints. Never send the same block twice.
- Never touch tests, conftest.py or config files. Never run pytest on a folder. Never leave /workspace.
- At most @@CALLS@@ calls and @@MINUTES@@ minutes. An edit that exists counts even if time runs out.
- When you see PROGRESS in the plan or a short "continue" message: run python3 @@HELPER@@ resume and do only its NEXT line.
- Without the helper (No such file): change files with python heredoc scripts, run python3 -m py_compile on each edited file, keep scratch files in /tmp, then call submit_patch.
- Never decide that nothing needs to change. When unsure, make the best-guess edit in the most likely place.
