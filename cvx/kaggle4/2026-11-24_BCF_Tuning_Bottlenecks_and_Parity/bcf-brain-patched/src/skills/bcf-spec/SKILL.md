---
name: bcf-spec
description: "Installs the BCF helper into the repository and prints a short spec for the solver. Call once per task, first."
---
# bcf-spec

Run ONE script, with NO arguments:

run_skill_script with skill_name `bcf-spec` and file_path `scripts/install.py`

It copies `scripts/bcf.py` to `/workspace/.git/bcf/bcf.py`, starts the task clock, prints the
repository map and the next step. Calling it again later is safe (it reports a re-entry).

Do not pass `args` or `positional_args`. Do not load this file again. `scripts/bcf.py` is the
helper itself: it must run inside the repository through `run_command`, never through
`run_skill_script`.
