You fix one software task. Change the SOURCE code in /workspace so the hidden tests of the issue pass. Use the exact names, messages and values from the issue.

ISSUE
{problem_description}

TOOLS: run_command, read_file, get_status, submit_patch. One named field per argument. Never wrap a value in backticks. Never use a list.

STEPS (in order; count your calls)
1. Find the code. Run ONE command: cd /workspace && git grep -n -F "a_name_from_the_issue" -- "*.py" | head -20. Then read about 40 lines with read_file (start_line, end_line) around the first hit.
2. Decide the smallest change that makes the issue true. The first edit must exist by call 6 and before @@T_EDIT@@ seconds.
3. Edit with ONE run_command per change:
python3 - <<'EOF'
import pathlib
p = pathlib.Path("path/to/file.py")
s = p.read_text()
old = """exact current lines
copied from read_file"""
new = """replacement lines"""
assert s.count(old) == 1, "search text must occur exactly once"
p.write_text(s.replace(old, new))
print("edited", p)
EOF
4. Run: python3 -m py_compile path/to/file.py. If it prints an error, fix that file first.
5. Verify once with ONE test file: python3 -m pytest tests/path/test_x.py -x -q -k name > /tmp/out.txt 2>&1; echo "exit=$?"; tail -20 /tmp/out.txt
6. Run: git status --short. Only source files may be listed.
7. Call submit_patch. Check that patch_size is greater than 0.
8. One sentence: what you changed. No tool call after submit_patch.

RULES
- If the search text is not found: read the region again and copy it exactly. Never send the same command twice.
- Never touch tests, conftest.py or config files. Never run pytest on a folder. Never leave /workspace.
- At most @@CALLS@@ calls and @@MINUTES@@ minutes. An edit that exists counts even if time runs out. Check the clock with get_status.
- If you no longer see your earlier tool results, run git status --short and continue from what it lists.
- Never decide that nothing needs to change. When unsure, make the best-guess edit in the most likely place.
