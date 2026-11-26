# RCA coding scheme (BCF taxonomy v1) — read fully before coding any task

You are coding root-cause records for tasks in the Kaggle "Gemma 4 Developer Agent" public dataset.
Each task = a real change from FastAPI (67 tasks), rich (48), requests (13) or httpx (1). For each task you see:
the PROBLEM STATEMENT the agent receives, the GOLD PATCH (the accepted upstream fix), and a digest of the
HIDDEN TEST PATCH (tests the grader adds later; the agent never sees them). Context: the agent works offline
in the repo snapshot at base commit with tools run_command / read_file (150 lines per call) / edit_file /
write_file, about 5 minutes and 30-40 LLM turns per task, model = Gemma 4 31B (or E4B, a 4.5B-effective model).

## Output
Return ONE JSON array (valid JSON, no markdown fence, no commentary) with exactly one object per task, keys:

- "instance_id": copy exactly.
- "title_plain": <= 14 words, plain language: what this task asks for.
- "category": one of
  C1 BUG (wrong behaviour fixed), C2 FEATURE (new capability/API), C3 REFACTOR (internal rework, behaviour
  preserved or extended), C4 BEHAVIOUR-CHANGE (deprecation, removal, new warning, stricter enforcement),
  C5 DOCS (documentation/examples content), C6 BUILD (release tooling, CI, dependency ranges, test infra).
  Decide from the gold patch's effect, not the emoji. A "fix" of broken behaviour is C1 even if tagged with
  a recycle emoji.
- "sub_primary", "sub_secondary": engineering domain (secondary "" if none). Closed list:
  VAL request/validation parameter handling (Query/Header/Cookie/Form/Body params, defaults, aliases, extra
      fields, sequences, parameter models)
  TYP type-annotation and model introspection (unions, discriminators, Annotated, forward references, wrapped
      functions, stringified annotations, PEP 604/695, arbitrary types)
  OAS OpenAPI / JSON-Schema generation
  DI dependency-injection machinery (scopes, caching, hashing, partial/wrapped dependables, class
      dependencies, security-scope propagation)
  RTG routing, app/router construction, lifecycle events (startup/shutdown, on_event, route contexts,
      exception handling and traceback metadata)
  SER response serialisation, content types and streaming (response models, JSON encoding, server-sent
      events, response classes)
  SEC security/auth behaviour (HTTP auth classes, credential headers, strict content type)
  CMP compatibility shims (pydantic.v1 support, Starlette compatibility, urllib3 versions, compat layers)
  WID text measurement and segmentation (cell widths, graphemes, wrapping, split cells)
  PAR markup / ANSI / Markdown / Syntax parsing, escaping and highlighting
  REN rendering and styling of widgets (table, panel, live, progress, styles, segments)
  CON console / terminal I/O and environment interaction (capture/record, pipe handling, tty detection,
      env vars, import-time behaviour)
  DBG developer-facing introspection output (tracebacks, pretty/repr, inspect)
  NET HTTP protocol / client behaviour (headers, content-type, redirects, netrc, URL paths, connections)
  OBJ object protocol and duck-typing semantics (isinstance vs hasattr, __getattr__ wrappers, pickling,
      hashing/caching of objects)
  EXM documentation examples / docs content
  BLD build, release, CI, dependencies, tooling
- "mechanism": root-cause mechanism, closed list:
  R01 missing branch / unhandled input class
  R02 wrong assumption about data shape or type
  R03 duplicated or parallel logic out of sync with another code path
  R04 regression from an earlier change in the same project
  R05 upstream dependency change (Starlette, Pydantic, Python version semantics)
  R06 boundary / empty-input / off-by-one error
  R07 algorithmic flaw (wrong loop, non-termination, ordering, recursion)
  R08 encoding / escaping / whitespace error
  R09 state, identity, caching or hashing error
  R10 error-handling gap (unhandled exception, missing validation, wrong status/message)
  R11 environment / platform assumption (tty, pipe, OS, terminal, import side effects)
  R12 contract mismatch (API contract or documented behaviour violated)
  R13 incomplete feature (capability missing; use for C2)
  R14 design improvement / tech debt (use for C3)
  R15 dependency / compatibility / tooling drift (use for C6 or version-range changes)
  R16 documentation error (use for C5)
- "root_cause": <= 60 words. What was wrong in the PRE-fix code (name the function/branch) and why it
  produced the wrong behaviour or gap. For features: what capability was absent and where it had to hook in.
- "origin": <= 30 words. Why the defect or gap existed (regression, edge case never covered, upstream change,
  new Python/Pydantic feature, deliberate design change, ...). Say "unknown" if the pack gives no basis.
- "fix": <= 45 words. What the gold patch changes, concretely (the minimal correct change).
- "gold_paths": array of the file paths listed under "## GOLD PATCH" in the pack (copy exactly, all of them).
- "required_by_tests": <= 35 words. Public names, parameters, messages, schemas or example files that the
  hidden tests import/assert on. Mark "(in statement)" after each one the problem statement itself names;
  mark "(NOT in statement)" after each one it does not.
- "spec_gap": "none" (statement alone determines the required behaviour and names), "minor" (statement
  describes behaviour; exact names/format must be inferred from repo conventions), or "severe" (statement is
  a terse title/link or the tests need specific new names/format the statement does not give).
- "oracle": <= 25 words. How the agent can verify without the hidden tests (repro from statement, an
  existing test file, an inline assertion, or "none").
- "difficulty": integer 1-5 for the Gemma 4 31B agent under the time budget (1 trivial, 5 near-impossible).
- "drivers": array (possibly empty) from: multi_file, new_file, docs_src_fixture (hidden tutorial tests
  import example files), large_patch, terse_statement, exact_string (tests compare exact strings/schema),
  schema_snapshot, pydantic_v1v2, python_version, upstream_starlette, algorithmic, unicode, terminal_env,
  network_fixture (needs httpbin etc.), api_naming (must guess a new public name), data_tables, removal.
- "trap": <= 35 words. The most likely way a Gemma 4 agent fails this task.
- "playbook": one route:
  P1 PRESCRIBE (statement contains the fix), P2 REPRO-DRIVEN BUGFIX (statement has repro/expected output),
  P3 TITLE-HUNT (terse statement: grep keywords, infer defect, repro, fix), P4 FEATURE-SYNTH (design and
  wire a new capability incl. example files), P5 SCHEMA-CONTRACT (OpenAPI/JSON-Schema output change),
  P6 COMPAT-SHIM (version/dependency compatibility branch), P7 MECHANICAL-SWEEP (many-call-site rework;
  compile gate after each edit), P8 DOCS-EXAMPLE (docs_src example apps that tutorial tests import),
  P9 BUILD-TOOLING, P10 TIMEBOXED-SLICE (too big for the budget: safest minimal slice, keep tree
  importable, submit early).

## Quality rules
- Base every statement on the pack. Do not invent identifiers. If the pack is ambiguous, say so in "origin".
- "root_cause" must name the actual pre-fix logic flaw, not restate the title.
- Be exact with codes (uppercase, two-letter/one-digit as listed). Exactly one object per task, in pack order.
- Difficulty: 1-2 for single-file fixes a mid-level dev does in minutes; 3 for multi-file or inference-heavy;
  4-5 when required names are unguessable, the patch is large, or fixtures/example files must be created.
