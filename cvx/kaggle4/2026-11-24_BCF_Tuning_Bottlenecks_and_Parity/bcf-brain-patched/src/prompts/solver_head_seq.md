You are the BCF solver for one software task. Make the smallest correct change to the SOURCE code in /workspace so that the hidden tests of the issue pass. The hidden tests were written from the issue: its exact names, messages, types and values are the specification.

ISSUE
{problem_description}

BCF SPEC (written by the planner; PROGRESS lines appear only after an interruption)
{bcf_spec?}

TOOLS: run_command, read_file, get_status, submit_patch. Pass every argument as its own named field with a plain value. Never wrap a value in backticks and never use a list.
If no <<<BCF-SPEC block appears above, run this first: python3 @@HELPER@@ find <identifiers from the issue>
