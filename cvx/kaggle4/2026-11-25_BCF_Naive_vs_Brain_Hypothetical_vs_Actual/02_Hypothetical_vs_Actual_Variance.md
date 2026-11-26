# Hypothetical against actual: where v5's emulator and the real harness differ, and why

**Prepared:** 2026-11-25. **Method:** `live-run-kit/replay/scripts/variance.py`; results in `evidence/variance.json`.

## The question

v5 executed both of its trajectories through an emulator of the harness written from the README. It said so, and it listed what it emulated. The test of an emulator is to run the same inputs through the real thing and compare. That is what this document reports, for all 43 naive cards and all 30 older-BCF cards.

## How a card was classified

Each v5 card was paired with the real output of the same call. The two were compared after removing what is pure presentation: the line numbers v5 added to file reads, the context lines of edit diffs, durations, and Windows path separators. A card is **same facts, different envelope** when the remaining text agrees and only the packaging differs (JSON, escaping, duplicated fields). It is **different content** when the real output says something v5's did not, or omits something it did. Two cards of the older BCF could not be run.

## Result

| Lane | Cards | Same facts, different envelope | Different content | Not re-run | Text received, v5 | Text received, real |
|---|---|---|---|---|---|---|
| Naive agent | 43 | 43 | 0 | 0 | 10,146 | 12,455 |
| Older BCF | 30 | 26 | 2 | 2 | 4,305 | 6,521 |

Token counts are characters divided by four. "Text received" counts tool results only: not the first message, not the model's own words, not its thinking.

## Why they differ

| Reason | Naive cards | Older BCF cards | Calls | What it changes for the agent |
|---|---|---|---|---|
| JSON envelope on the tool result | 41 | 26 | every card except get_status | Nothing learned; a few characters paid for keys and escaped newlines |
| Failing command returns the capped output twice | 1 | 0 | N9 | About 2,700 tokens for one truncated test run, against 1,250 in v5 |
| read_file carries no line numbers | 13 | 3 | every read_file card | The agent must count lines itself |
| edit_file diffs carry three context lines per hunk | 11 | 13 | every edit_file card | Longer text, same edit |
| get_status reports time | 2 | 1 | N1, N41, C0 | The agent can see the clock |
| budget_warning is a key at the end of the JSON | 1 | 0 | N42 | v5 drew it above the output |
| One skipped test (host parity) | 3 | 0 | N17, N26, N36 | Linux passes this test |
| Graph ranking differs | 0 | 1 | C3 | No self-match, eight test functions, snippets up to the cap: 1,607 tokens against 134 |
| submit_patch strips test files | 0 | 1 | C29 | 7 files and 9,563 bytes against 8 files and 10,768 |
| Not re-run | 0 | 2 | C1, C2 | Scripts of the older BCF, not shipped |

## The cards worth reading in full

| Call | Tool | Classification | v5 tokens | Real tokens | Reasons recorded by the classifier |
|---|---|---|---|---|---|
| N9 | run_command | same facts different envelope | 1,250 | 2,703 | Envelope: the real run_command returns JSON (status, stdout, stderr, exit_code); v5 showed the bare stdout. Non-zero exit: the real tool answers error_type=CommandError and repeats the capped stdout in error_message AND in details.stdout, so the agent pays for the same text twice. |
| C3 | search_similar_code | different content | 134 | 1,607 | Self-match: v5 listed the query's own node first at 1.0000; the real tool leaves it out. Composition: 8 of the real top 10 are test functions (v5: 7 of 10). Size: every real result carries its source snippet, so the output hits the 5,000-char cap (is_truncated=true); v5 showed a 10-line ranking. |
| C29 | submit_patch | different content | 43 | 14 | Envelope: the real submit_patch answers only {patch_size, files_changed}; v5's card listed the files. File count: v5 counted 8, the real tool reports 7 (test files are stripped from the patch before it is stored). |
| C4 | get_code_subgraph | same facts different envelope | 53 | 54 | Node ids: the real graph prefixes every node with the repository (`encode/httpx;`). Envelope: the real answer adds is_truncated. |
| C5 | get_code_neighbors | same facts different envelope | 33 | 39 | Node ids: the real graph prefixes every node with the repository (`encode/httpx;`). Envelope: the real answer adds is_truncated. |
| N42 | run_command | same facts different envelope | 25 | 69 | Envelope: the real run_command returns JSON (status, stdout, stderr, exit_code); v5 showed the bare stdout. budget_warning: the real harness appends it as the last key of the tool's JSON; v5's card printed it as a line above stdout. |

## What the comparison means

**The emulator was faithful to content and unfaithful to cost.** Every verdict v5 reported was confirmed by the real grader: the naive agent held a passing patch from N8 to N12 and lost it at N13; the older BCF held one from C9 to the end. No trajectory conclusion changes. What changes is the price of the same trajectory. The naive agent received 12,455 tokens of tool output where v5's cards account for 10,146. The largest single gap is N9, the one call that carried bad news.

**A lesson about emulators.** v5 built its emulator from the README and flagged two parts as emulated from documentation: the graph tools' resolver and the skill scripts. The real subgraph and neighbour calls behaved as v5 guessed (zero edges, one neighbour) and cost about the same; the real ranking call behaved almost as guessed and cost twelve times more context. The lesson is not that emulation fails. It is that an emulator should be checked against the real tool's output size as well as its content, because context cost is what decides whether a small model notices the decisive line.

## Errata for v5, found by execution

| # | v5 said or assumed | The real harness does | Effect |
|---|---|---|---|
| 1 | A failing command shows its output once, cut at 5,000 characters | Returns an error envelope with the capped output in `error_message` and again in `details.stdout` | Double the context cost exactly when the news is bad |
| 2 | read_file prints a line number before each line | Returns the content as a JSON string without numbers, with `total_lines` and `is_truncated` | An agent that cites line numbers must count |
| 3 | The similarity ranking lists the query's own node first and seven test functions | No self-match; eight test functions; a source snippet per result; truncated at the cap | A call v5 cost at 134 tokens costs 1,607 |
| 4 | BCF's patch has 8 files and 10,768 bytes | 7 files and 9,563 bytes: test files are stripped before the patch is stored | v5's own erratum 14 anticipated this |
| 5 | An edit lands as written (strategy exact, one to two context lines) | `edit_file` applies an exact, flexible or regex match with no compile check, and shows three context lines | A malformed edit is accepted silently (document 03, section 6) |
| 6 | Durations are estimates | Measured here: 74.3 seconds of tool time for the naive lane on a Windows host | Still not the scorer's timing |

## Corrections to this package's own process

Kept because they are part of the evidence.

| # | What happened | How it was found | What was done |
|---|---|---|---|
| 1 | An edit of the older-BCF lane was anchored one line off while it was transcribed for the real harness | The lane's verdict flipped to not resolved | The broken run is kept in `evidence/slip/`; the edit was corrected and the lane re-run; document 03, section 6, uses the slip as evidence |
| 2 | The `is_keepalive` insertion was anchored on `def close` (line 401) instead of `def is_idle` (line 407) in three lanes | The variance classifier flagged N14 and N37 as different content | Anchors corrected, all six lanes re-run; N37 now matches v5 |
| 3 | An environment probe imported the package before the agent's first call, leaving `__pycache__` files that two early greps then listed | N3 and C14 flagged as different content | The probe now runs with `-B`; N3 and C14 match v5 |
