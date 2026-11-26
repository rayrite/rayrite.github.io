# The walkthrough in markdown: every call, both verdicts, its variance

Source of every row: `evidence/lanes/*.json` (actual) and `evidence/v5_calls.json` (hypothetical). The verdict columns are the harness's own grader run on the working tree after the call: **PASS** means a submit at that moment would have resolved the task, fail means it would not, an em dash means the call did not change the tree or the card was not re-run. The last column is text received from the tool, v5 against real, in characters divided by four.

Lanes: **N** naive agent, **C** the older BCF of v5, **P** and **S** the current brain (planner and solver). The brain is shown as the 2026-11-23 version; the 2026-11-24 version differs in two calls, both shown in full in step 2 and step 7.


## Step 1: Orient

### Naive agent

| Call | Tool | Call as v5 wrote it | v5 verdict | Actual verdict | v5 against actual | Tokens, v5 → actual |
|---|---|---|---|---|---|---|
| N1 | get_status | `get_status()` | fail | — | same facts (Fields) | 55 → 73 |

### Older BCF

| Call | Tool | Call as v5 wrote it | v5 verdict | Actual verdict | v5 against actual | Tokens, v5 → actual |
|---|---|---|---|---|---|---|
| C0 | get_status | `get_status()` | fail | — | same facts (Fields) | 55 → 75 |

### Current brain, 2026-11-23 (the 2026-11-24 version is identical apart from P2 and S9)

| Call | Agent | Tool | What | Actual verdict | Charged | Tokens received |
|---|---|---|---|---|---|---|
| P1 | planner | run_skill_script | `scripts/install.py` | — | charged | 241 |

**Real output of the installer (P1), as the planner sees it:**

```text
BCF INSTALLED v1.0.0 -> /workspace/.git/bcf/bcf.py
REPO workspace  root: README.md conftest.py docs pyproject.toml pytest.ini requirements.txt scripts src tests
PACKAGES: src/ahttpx src/httpx
PY FILES: src:32  tests:13  (root):1
TESTS: 13 python test files
CONFIG: pyproject.toml requirements.txt pytest.ini

ENV: python 3.13 | git ok | pytest ok
BUDGET: 480s; first edit by 150s; verify by 300s; freeze at 374s
NEXT: one run_command -> /workspace/.git/bcf/bcf.py plan <<'EOF' ... EOF   (brief lines on stdin: task:, kind:, names:, expect:, repro:)
```

The installer's path is shown as it is on the scorer. On this workstation the sandbox lives in a different folder, and the installer was told that folder once. What the installer starts is a clock: the budget phases that follow are enforced by the helper from this moment.


## Step 2: Frame

### Naive agent

| Call | Tool | Call as v5 wrote it | v5 verdict | Actual verdict | v5 against actual | Tokens, v5 → actual |
|---|---|---|---|---|---|---|
| N2 | run_command | `$ grep -rn 'complete' src/ tests/` | fail | — | same facts | 906 → 935 |
| N3 | run_command | `$ grep -rln 'complete' src/ tests/` | fail | — | same facts | 70 → 89 |

### Older BCF

| Call | Tool | Call as v5 wrote it | v5 verdict | Actual verdict | v5 against actual | Tokens, v5 → actual |
|---|---|---|---|---|---|---|
| C1 | classify_issue | `run_skill_script("classify_issue", <problem_statement, 243 chars>)` | fail | — | not re-run | 138 → 0 |

### Current brain, 2026-11-23 (the 2026-11-24 version is identical apart from P2 and S9)

| Call | Agent | Tool | What | Actual verdict | Charged | Tokens received |
|---|---|---|---|---|---|---|
| P2 | planner | run_command | `python3 /workspace/.git/bcf/bcf.py plan <<'EOF' …` | — | charged | 188 |
| P3 | planner | text answer | the spec, relayed word for word | — | — | — |

**Real output of the planner's second call (P2), 2026-11-23 brain:**

```text
<<<BCF-SPEC v1>>>
TASK: rename parser complete to reset and fix server keep-alive handling
CLASS: C4 behaviour change / PAR
ROUTE: P7
GAP: minor
TARGETS: src/ahttpx/_parsers.py:378 complete | src/httpx/_parsers.py:378 complete | src/ahttpx/_parsers.py:86 __init__ | src/httpx/_parsers.py:86 __init__
NAMES: HTTPParser keep_alive complete reset KeyboardException
VERIFY: one related test file, or an inline python check
HINT: Build a minimal input string and print the parsed tokens; escaping bugs show up immediately.
PLAN: first edit by 150s; verify by 300s; freeze at 374s
<<<END-SPEC>>>
```

**The same call on the 2026-11-24 brain.** Two lines differ, CLASS and HINT:

| Line | 2026-11-23 | 2026-11-24 |
|---|---|---|
| CLASS | CLASS: C4 behaviour change / PAR | CLASS: C4 behaviour change / NET |
| HINT | HINT: Build a minimal input string and print the parsed tokens; escaping bugs show up immediately. | HINT: Print the parsed structure for a crafted header/URL; mind case and whitespace handling. |


## Step 3: Plan

### Naive agent

No tool call in this step: the naive agent has no planning artifact to write or read.

### Older BCF

| Call | Tool | Call as v5 wrote it | v5 verdict | Actual verdict | v5 against actual | Tokens, v5 → actual |
|---|---|---|---|---|---|---|
| C2 | write_spec | `write_spec({task_class: "compat_or_refactor", anchors, bugs[5], fix_order, validation_plan, budget_p …` | fail | — | not re-run | 66 → 0 |


## Step 4: Localize

### Naive agent

| Call | Tool | Call as v5 wrote it | v5 verdict | Actual verdict | v5 against actual | Tokens, v5 → actual |
|---|---|---|---|---|---|---|
| N4 | read_file | `read_file("src/httpx/_parsers.py", 370, 425)` | fail | — | same facts (Line numbers) | 531 → 500 |
| N5 | read_file | `read_file("src/httpx/_parsers.py", 370, 425)` | fail | — | same facts (Line numbers) | 531 → 500 |
| N6 | read_file | `read_file("src/ahttpx/_parsers.py", 370, 425)` | fail | — | same facts (Line numbers) | 537 → 506 |
| N7 | read_file | `read_file("src/ahttpx/_parsers.py", 370, 425)` | fail | — | same facts (Line numbers) | 537 → 506 |

### Older BCF

| Call | Tool | Call as v5 wrote it | v5 verdict | Actual verdict | v5 against actual | Tokens, v5 → actual |
|---|---|---|---|---|---|---|
| C3 | search_similar_code | `search_similar_code("query": "HTTPParser")` | fail | — | **different content** (Self-match; Composition; Size) | 134 → 1,607 |
| C4 | get_code_subgraph | `get_code_subgraph("nodes": ["httpx._parsers.HTTPParser", "ahttpx._parsers.HTTPParser", "httpx._serve …` | fail | — | same facts (Node ids) | 53 → 54 |
| C5 | get_code_neighbors | `get_code_neighbors("node": "httpx._parsers.HTTPParser.complete")` | fail | — | same facts (Node ids) | 33 → 39 |
| C6 | read_file | `read_file("src/httpx/_server.py", 28, 105)` | fail | — | same facts (Line numbers) | 818 → 760 |
| C7 | read_file | `read_file("src/httpx/_network.py", 75, 190)` | fail | — | same facts (Line numbers) | 1,023 → 921 |
| C8 | read_file | `read_file("src/httpx/_parsers.py", 376, 420)` | fail | — | same facts (Line numbers) | 418 → 400 |

### Current brain, 2026-11-23 (the 2026-11-24 version is identical apart from P2 and S9)

| Call | Agent | Tool | What | Actual verdict | Charged | Tokens received |
|---|---|---|---|---|---|---|
| S1 | solver | run_command | `python3 /workspace/.git/bcf/bcf.py ctx src/httpx/_parsers.py 378 8 24` | — | charged | 355 |

**Real output of the brain's one read (S1), first 12 lines:**

```text
--- src/httpx/_parsers.py lines 370-402 of 516 ---
  370|                msg = 'Not enough data received for declared Content-Length'
  371|                raise ProtocolError(msg)
  372|
  373|        if body == b'':
  374|            # Handle body close
  375|            self.recv_state = State.DONE
  376|        return body
  377|
  378|    def complete(self):
  379|        is_fully_complete = self.send_state == State.DONE and self.recv_state == State.DONE
  380|        is_keepalive = self.send_keep_alive and self.recv_keep_alive
… (22 more lines)
```

**Real output of the graph ranking (C3), all ten rows.** v5's emulated ranking had the query's own node first and seven test functions; the real one has no self-match, eight test functions and a source snippet per row, so it is cut at the 5,000-character cap:

```text
0.9976  httpx._server.HTTPConnection.__init__
0.9975  httpx._server.HTTPConnection
0.9968  tests.test_parsers.test_1xx_status_code
0.9968  tests.test_parsers.test_parser_invalid_status_line
0.9968  tests.test_parsers.test_parser_recv_unsupported_protocol
0.9968  tests.test_parsers.test_invalid_status_code
0.9968  tests.test_parsers.test_parser
0.9968  tests.test_parsers.test_client_connection_close
0.9968  tests.test_parsers.test_server_connection_close
0.9968  tests.test_parsers.test_parser_server
```


## Step 5: The rename

### Naive agent

| Call | Tool | Call as v5 wrote it | v5 verdict | Actual verdict | v5 against actual | Tokens, v5 → actual |
|---|---|---|---|---|---|---|
| N8 | edit_file | `edit_file("src/httpx/_parsers.py", old → new)` | PASS | **PASS** | same facts (Diff) | 57 → 125 |
| N9 | run_command | `$ python -m pytest tests/test_parsers.py -q` | PASS | **PASS** | same facts (Non-zero exit) | 1,250 → 2,703 |
| N10 | read_file | `read_file("tests/test_parsers.py", 55, 75)` | PASS | **PASS** | same facts (Line numbers) | 152 → 161 |
| N11 | read_file | `read_file("tests/test_parsers.py", 305, 320)` | PASS | **PASS** | same facts (Line numbers) | 136 → 157 |
| N12 | run_command | `$ git diff` | PASS | **PASS** | same facts | 117 → 136 |
| N13 | edit_file | `edit_file("src/httpx/_parsers.py", old → new)` | fail | fail | same facts (Diff) | 57 → 125 |

### Older BCF

| Call | Tool | Call as v5 wrote it | v5 verdict | Actual verdict | v5 against actual | Tokens, v5 → actual |
|---|---|---|---|---|---|---|
| C9 | edit_file | `edit_file("src/httpx/_parsers.py", old → new)` | PASS | **PASS** | same facts (Diff) | 80 → 182 |
| C10 | edit_file | `edit_file("src/httpx/_parsers.py", old → new)` | PASS | **PASS** | same facts (Diff) | 34 → 104 |
| C11 | edit_file | `edit_file("src/ahttpx/_parsers.py", old → new)` | PASS | **PASS** | same facts (Diff) | 85 → 188 |
| C12 | edit_file | `edit_file("src/ahttpx/_parsers.py", old → new)` | PASS | **PASS** | same facts (Diff) | 35 → 106 |
| C13 | run_command | `$ sed -i -E 's/\b_complete\b/_reset/g; s/_parser\.complete(\(\))?/_parser.reset()/g' src/httpx/_pool …` | PASS | **PASS** | same facts | 65 → 82 |
| C14 | run_command | `$ grep -rnE '\bcomplete\b\|_complete\b' src/ \| grep -v '_streams.py'` | PASS | **PASS** | same facts | 348 → 367 |

### Current brain, 2026-11-23 (the 2026-11-24 version is identical apart from P2 and S9)

| Call | Agent | Tool | What | Actual verdict | Charged | Tokens received |
|---|---|---|---|---|---|---|
| S2 | solver | run_command | `python3 /workspace/.git/bcf/bcf.py apply src/httpx/_parsers.py <<'EOF' …` | **PASS** | charged | 113 |
| S3 | solver | run_command | `python3 /workspace/.git/bcf/bcf.py apply src/ahttpx/_parsers.py <<'EOF' …` | **PASS** | charged | 94 |
| S4 | solver | run_command | `python3 /workspace/.git/bcf/bcf.py apply src/httpx/_pool.py <<'EOF' …` | **PASS** | charged | 45 |
| S5 | solver | run_command | `python3 /workspace/.git/bcf/bcf.py apply src/ahttpx/_pool.py <<'EOF' …` | **PASS** | charged | 48 |

**Real output of the brain's first edit (S2):**

```text
APPLIED 3 block(s) -> src/httpx/_parsers.py
  408|    def is_keepalive(self) -> bool:
  409|        return (
  410|            self.send_keep_alive and
  411|            self.recv_keep_alive and
  412|            self.send_state != State.CLOSED
  413|        )
  414|
  415|    def is_idle(self) -> bool:
FIRST EDIT DONE. Now verify: run your repro or one test file, then finalize.
```

**What the naive agent received at N9.** v5 showed 5,000 characters of pytest output. The real tool returned an error envelope of 10,811 characters in which the same truncated output appears twice:

```json
{
 "status": "error",
 "error_type": "CommandError",
 "details": {
  "stdout": "FF...F..........FF......                                                 [100%]\n================================== FAILURES ===================================\n_________________________________ test_parser _________________________________\n\n    def test_parser():\n        stream = httpx.DuplexStream( \u2026",
  "stderr": "",
  "exit_code": 1
 },
 "error_message": "\u2026 the same 5,000 characters again \u2026"
}
```


## Step 6: The rest of the issue

### Naive agent

| Call | Tool | Call as v5 wrote it | v5 verdict | Actual verdict | v5 against actual | Tokens, v5 → actual |
|---|---|---|---|---|---|---|
| N14 | edit_file | `edit_file("src/httpx/_parsers.py", old → new)` | fail | fail | same facts (Diff) | 75 → 149 |
| N15 | read_file | `read_file("src/httpx/_server.py", 1, 126)` | fail | fail | same facts (Line numbers) | 1,186 → 1,071 |
| N16 | edit_file | `edit_file("src/httpx/_server.py", old → new)` | fail | fail | same facts (Diff) | 59 → 130 |
| N17 | run_command | `$ python -m pytest tests/ -q` | fail | fail | same facts (Host parity) | 49 → 64 |
| N18 | read_file | `read_file("src/httpx/_response.py", 75, 100)` | fail | fail | same facts (Line numbers) | 246 → 252 |
| N19 | edit_file | `edit_file("src/httpx/_server.py", old → new)` | fail | fail | same facts (Diff) | 78 → 161 |
| N20 | read_file | `read_file("src/httpx/_network.py", 140, 200)` | fail | fail | same facts (Line numbers) | 534 → 497 |
| N21 | edit_file | `edit_file("src/httpx/_network.py", old → new)` | fail | fail | same facts (Diff) | 51 → 110 |
| N22 | edit_file | `edit_file("src/httpx/_network.py", old → new)` | fail | fail | same facts (Diff) | 55 → 109 |
| N23 | run_command | `$ python -m pytest tests/test_network.py -q` | fail | fail | same facts | 25 → 40 |
| N24 | edit_file | `edit_file("src/httpx/_server.py", old → new)` | fail | fail | same facts (Diff) | 57 → 105 |
| N25 | run_command | `$ python -c "import httpx; print(httpx.__version__)"` | fail | fail | same facts | 3 → 18 |
| N26 | run_command | `$ python -m pytest tests/ -q` | fail | fail | same facts (Host parity) | 49 → 64 |

### Older BCF

| Call | Tool | Call as v5 wrote it | v5 verdict | Actual verdict | v5 against actual | Tokens, v5 → actual |
|---|---|---|---|---|---|---|
| C15 | edit_file | `edit_file("src/httpx/_parsers.py", old → new)` | PASS | **PASS** | same facts (Diff) | 75 → 149 |
| C16 | edit_file | `edit_file("src/ahttpx/_parsers.py", old → new)` | PASS | **PASS** | same facts (Diff) | 76 → 152 |
| C17 | edit_file | `edit_file("src/httpx/_server.py", old → new)` | PASS | **PASS** | same facts (Diff) | 67 → 138 |
| C18 | edit_file | `edit_file("src/ahttpx/_server.py", old → new)` | PASS | **PASS** | same facts (Diff) | 72 → 145 |
| C19 | edit_file | `edit_file("src/httpx/_network.py", old → new)` | PASS | **PASS** | same facts (Diff) | 51 → 110 |
| C20 | edit_file | `edit_file("src/httpx/_network.py", old → new)` | PASS | **PASS** | same facts (Diff) | 43 → 117 |
| C21 | edit_file | `edit_file("src/httpx/_network.py", old → new)` | PASS | **PASS** | same facts (Diff) | 120 → 197 |
| C22 | edit_file | `edit_file("src/httpx/_server.py", old → new)` | PASS | **PASS** | same facts (Diff) | 57 → 105 |
| C23 | run_command | `$ sed -i 's/Response(code=500, /Response(500, /' src/httpx/_server.py src/ahttpx/_server.py && grep …` | PASS | **PASS** | same facts | 43 → 59 |

### Current brain, 2026-11-23 (the 2026-11-24 version is identical apart from P2 and S9)

| Call | Agent | Tool | What | Actual verdict | Charged | Tokens received |
|---|---|---|---|---|---|---|
| S6 | solver | run_command | `python3 /workspace/.git/bcf/bcf.py apply src/httpx/_server.py <<'EOF' …` | **PASS** | charged | 73 |
| S7 | solver | run_command | `python3 /workspace/.git/bcf/bcf.py apply src/ahttpx/_server.py <<'EOF' …` | **PASS** | charged | 58 |
| S8 | solver | run_command | `python3 /workspace/.git/bcf/bcf.py apply src/httpx/_network.py <<'EOF' …` | **PASS** | charged | 160 |


## Step 7: Validate

### Naive agent

| Call | Tool | Call as v5 wrote it | v5 verdict | Actual verdict | v5 against actual | Tokens, v5 → actual |
|---|---|---|---|---|---|---|
| N27 | run_command | `$ grep -rn 'complete' src/ tests/` | fail | fail | same facts | 906 → 1,055 |
| N28 | read_file | `read_file("src/httpx/_parsers.py", 370, 425)` | fail | fail | same facts (Line numbers) | 515 → 482 |
| N29 | read_file | `read_file("src/ahttpx/_parsers.py", 370, 425)` | fail | fail | same facts (Line numbers) | 537 → 506 |
| N30 | run_command | `$ python -m pytest tests/test_parsers.py -q` | fail | fail | same facts | 25 → 41 |
| N31 | read_file | `read_file("src/httpx/_pool.py", 230, 245)` | fail | fail | same facts (Line numbers) | 131 → 148 |
| N32 | run_command | `$ grep -rn 'reset' src/` | fail | fail | same facts | 16 → 48 |
| N33 | read_file | `read_file("tests/test_parsers.py", 55, 75)` | fail | fail | same facts (Line numbers) | 152 → 161 |
| N34 | edit_file | `edit_file("src/ahttpx/_parsers.py", old → new)` | fail | fail | same facts (Diff) | 60 → 129 |
| N35 | edit_file | `edit_file("src/ahttpx/_pool.py", old → new)` | fail | fail | same facts (Diff) | 65 → 120 |
| N36 | run_command | `$ python -m pytest tests/ -q` | fail | fail | same facts (Host parity) | 49 → 64 |
| N37 | run_command | `$ git diff --stat` | fail | fail | same facts | 55 → 72 |
| N38 | edit_file | `edit_file("src/ahttpx/_pool.py", old → new)` | fail | fail | same facts (Diff) | 65 → 120 |
| N39 | run_command | `$ python -m pytest tests/test_parsers.py -q` | fail | fail | same facts | 25 → 41 |

### Older BCF

| Call | Tool | Call as v5 wrote it | v5 verdict | Actual verdict | v5 against actual | Tokens, v5 → actual |
|---|---|---|---|---|---|---|
| C24 | run_command | `$ cat > /tmp/repro_reset.py <<'EOF' import httpx from httpx import HTTPParser assert hasattr(HTTPPar …` | PASS | **PASS** | same facts | 11 → 27 |
| C25 | edit_file | `edit_file("tests/test_parsers.py", old → new, allow_multiple=True)` | PASS | **PASS** | same facts (Diff) | 177 → 291 |
| C26 | run_command | `$ python -m pytest tests/test_parsers.py -q` | PASS | **PASS** | same facts | 25 → 41 |
| C27 | run_command | `$ python -m pytest tests/test_pool.py tests/test_client.py tests/test_network.py -q` | PASS | **PASS** | same facts | 25 → 41 |
| C28 | run_command | `$ git diff --name-only && python -m py_compile $(git diff --name-only -- '*.py') && git diff HEAD > …` | PASS | **PASS** | same facts | 45 → 63 |

### Current brain, 2026-11-23 (the 2026-11-24 version is identical apart from P2 and S9)

| Call | Agent | Tool | What | Actual verdict | Charged | Tokens received |
|---|---|---|---|---|---|---|
| S9 | solver | run_command | `python3 /workspace/.git/bcf/bcf.py test tests/test_parsers.py` | **PASS** | charged | 262 |
| S9d | solver | decision | keep | — | — | — |

**Real output of the brain's test call (S9), last 14 lines, identical on both versions apart from the timing:**

```text
        ]
        assert body == b'hello, world'
        assert terminator == b''
    
        assert not p.is_idle()
>       p.complete()
        ^^^^^^^^^^
E       AttributeError: 'HTTPParser' object has no attribute 'complete'

tests\test_parsers.py:70: AttributeError
=========================== short test summary info ===========================
FAILED tests/test_parsers.py::test_parser - AttributeError: 'HTTPParser' obje...
!!!!!!!!!!!!!!!!!!!!!!!!!! stopping after 1 failures !!!!!!!!!!!!!!!!!!!!!!!!!!
1 failed in 0.28s
```


## Step 8: Submit

### Naive agent

| Call | Tool | Call as v5 wrote it | v5 verdict | Actual verdict | v5 against actual | Tokens, v5 → actual |
|---|---|---|---|---|---|---|
| N40 | run_command | `$ git status --short` | fail | fail | same facts | 25 → 41 |
| N41 | get_status | `get_status()` | fail | fail | same facts (Fields) | 55 → 74 |
| N42 | run_command | `$ python -m pytest tests/test_parsers.py tests/test_pool.py -q` | fail | fail | same facts (budget_warning) | 25 → 69 |
| N43 | submit_patch | `submit_patch()` | fail | fail | same facts | 22 → 14 |

### Older BCF

| Call | Tool | Call as v5 wrote it | v5 verdict | Actual verdict | v5 against actual | Tokens, v5 → actual |
|---|---|---|---|---|---|---|
| C29 | submit_patch | `submit_patch()` | PASS | **PASS** | **different content** (File count) | 43 → 14 |

### Current brain, 2026-11-23 (the 2026-11-24 version is identical apart from P2 and S9)

| Call | Agent | Tool | What | Actual verdict | Charged | Tokens received |
|---|---|---|---|---|---|---|
| S10 | solver | run_command | `python3 /workspace/.git/bcf/bcf.py finalize` | **PASS** | charged | 82 |
| S11 | solver | submit_patch | `submit_patch()` | **PASS** | free | 14 |

**Real output of finalize (S10):**

```text
FINALIZE
  M src/ahttpx/_parsers.py
  M src/ahttpx/_pool.py
  M src/ahttpx/_server.py
  M src/httpx/_network.py
  M src/httpx/_parsers.py
  M src/httpx/_pool.py
  M src/httpx/_server.py
RESULT: READY. NEXT: call submit_patch once and confirm patch_size > 0.
```
**Real output of submit_patch (S11):**

```json
{"status": "ok", "patch_size": 7549, "files_changed": 7}
```

