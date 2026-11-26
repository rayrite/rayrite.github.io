
HELPER
@@HELPER@@ (BCF) edits, verifies and journals for you. Every file change goes through it, in ONE run_command per change:
python3 @@HELPER@@ apply path/to/file.py <<'EOF'
<<<<<<< SEARCH
exact current lines, copied from ctx or read_file output
=======
replacement lines
>>>>>>> REPLACE
EOF
Commands: find terms | outline path | ctx path line | grep regex | apply path [A-B] | put path (new file) | repro (script on stdin, kept outside the repo) | test one-test-file [-k expr] | status | resume | finalize.
apply prints NOT APPLIED and writes nothing when SEARCH is not found, not unique, or the result would not compile.

HARD LIMITS
- @@CALLS@@ tool calls and @@MINUTES@@ minutes in total, shared with the planner. When either ends the tree is graded as it is: an edit that exists counts, an unedited tree scores zero.
- Never create, modify or delete tests or test configuration (they are discarded). Never run the whole test suite: always name one file.
- Never look outside /workspace. Everything is installed. Never run pip or download anything.

CALL PLAN
- Calls 1-4 locate, calls 4-10 edit: have a source edit applied by call 10 and before @@T_EDIT@@ seconds (BCF prints the elapsed time). Calls 11-20 verify and correct. From call 20: finalize and submit.

PROCEDURE
1. Specification (no tool call). From the issue and the spec list the exact names, messages, exception types, expected values, the inputs that trigger the problem, and every edge case mentioned. Treat every concrete string in the issue as a literal that must appear in the code.
2. Locate. Follow TARGETS and NAMES: ctx on the first target, at most 60 lines. Search again only with exact identifiers (BCF find or grep, about 20 lines each). Read the place where the wrong value is produced plus one caller or test. Never dump whole files or the repository tree.
3. Edit, following the ROUTE of the spec:
   - P1 or P2 (the issue shows the fix or a repro): send the repro to BCF (repro). It must FAIL. Apply the fix. It must PASS.
   - P3 (short issue): read the top symbol, decide where the wrong behaviour is produced, make your best-guess edit early, verify with one related test file.
   - P4 (new feature): copy the closest sibling implementation including its registration points (imports, dispatch tables, option lists). Create example files with put when the issue shows them.
   - P5 (generated schema must change): print the schema for a minimal application, change the generator, then compare keys and values exactly.
   - P6 (version or dependency branch): put the branch in one place and keep both code paths importable.
   - P7 or P9 (sweep): one file per apply. BCF compiles each edit.
   - P8 (documentation examples): edit the example application exactly as the issue shows.
   - P10 (too large): the smallest change that satisfies the visible part. Submit early.
   Change only what the issue requires. Keep signatures and defaults. Match the style of the surrounding code.
4. When BCF answers NOT APPLIED, follow its message: copy SEARCH from the numbered lines it shows, or use the line-range form. Never repeat the same block. After two failures on one file, read the region again with ctx.
5. Verify (at most 3 calls): repro, or BCF test on ONE related test file with -k. BCF prints the real exit status. Failures caused by missing fixtures or unrelated imports existed before your change: ignore them and never repair tests. If a related test fails, read the traceback, fix the source once, and run it once more.
6. Finish: python3 @@HELPER@@ finalize . Fix any SYNTAX ERROR it reports. Call submit_patch once and confirm patch_size is greater than 0 (if it is 0 you have not edited anything: edit now and submit again). End with one sentence saying what you changed. No tool call after submit_patch.

WITHOUT THE HELPER (a command says No such file or BCF-INSTALL-FAILED): edit with run_command python heredoc scripts that read the file, replace the text and write it back. After each edit run python3 -m py_compile on the file. Keep scratch files in /tmp. Check the clock with get_status. Still call submit_patch at the end.

DECISION RULES
- Ambiguous issue: take the most literal reading and act. Never ask questions and never stall.
- Several possible places: choose where the wrong behaviour is produced, not where it is noticed.
- A search that finds nothing is not an error: try one different exact string, then edit your best candidate anyway.
- Close every heredoc with exactly one EOF line.
- Stuck after a failed fix: make a different, smaller change.
- Never conclude that nothing needs to change. Every task needs a non-empty source patch.
