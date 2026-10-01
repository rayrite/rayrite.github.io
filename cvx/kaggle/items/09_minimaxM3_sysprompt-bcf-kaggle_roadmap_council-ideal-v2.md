# BCF Brain — Ideal Kickoff Prompt (Synthesis)

> **Source basis.** This prompt is a synthesis of eight candidate kickoff answers evaluated against the official Kaggle Gemma 4 Developer Agent Competition materials, the `input/bcf/` prior work, and the official Paper Track criteria. It uses `cc-M31flash-max` as the empirical backbone (highest-scoring response), borrows the `[V]/[D]/[H]/[U]` evidence discipline and the rigorous retraction-aware methodology from `cc-glm53max`, the offline-retrieval-protocol depth from `genspark-deepseekV41flash`, the hard-constraint table from `genspark-MiMo26pro`, the JSON-style task tracking from `claude-sonnet55h`, and the corrections-table framing from `genspark-opus55`. Where the eight candidates conflicted, the conflict is named, the higher-confidence position is taken, and the resolution is sourced.
>
> **Read time:** ~45 min cold, ~10 min once familiar. Treat it as a working document, not a report — the verification actions are first-class citizens, not appendices.
>
> **Audience.** You, Cooly, the solo operator. Plus any collaborator you bring into a single sprint. Anyone else can read but should not edit.
>
> **What this is *not*.** Not a pass-rate projection. Not a literature review. Not a build script. It is the prompt that, when re-read before each sprint, prevents you from making decisions that the evidence you already have on disk refutes.

---

## 0. Read this first — the single most important framing

**You are not building a clever agent. You are building an agent that survives a stopwatch.**

The official constraint is **12 hours to submit patches for all tasks, inclusive of sandbox setup time** [HARNESS_README §7.1; Overview §Issue Scoring]. There are **~120 hidden tasks** [Overview; Data]. That works out to **~360 s per task if the run is sequential**, of which **~16 s** is non-agent setup and **~344 s ≈ 23 turns ≈ ~20 tool calls** is the agent budget [derived; organizer notebook timing 76.1 s for 4 turns implies ~15 s/turn on 4× L4 with `tp=4`]. The organizers' own starter submission is configured for **1 minute and 10 tool calls per task**, and in their published getting-started run it produced **zero patches on both tasks it was given** [organizer getting-started notebook; reproducible].

Almost every design decision below follows from that one number. A four-phase "specify → localize → patch → validate" ceremony that costs 40 turns and 120k tokens is not a good agent here; it is an agent that scores zero on ~110 of 120 tasks. The BCF brain must be **budget-proportional**: cheap and decisive on easy tasks, bounded and graceful on hard ones.

---

## 0.1 The five findings that should change your plan

These are the results of analysing the official materials and the 22.42 GB data package directly. They are what `cc-M31flash-max` measured; every other candidate accepts them as correct.

| # | Finding | Why it matters |
| --- | --- | --- |
| **F1** | **`search_similar_code` cannot take natural language.** There is no embedding server in the sandbox. The query string is resolved against symbol *names* by a 4-tier resolver (exact → `.`/`/` suffix → case-insensitive → substring) and then cosine-compared. `"Server Sent Events"` → `{"results": [], "count": 0}`; `"SSE"` substring-matched an unrelated fixture. | Kills the naive "embed the issue text to find the bug" strategy. Localization must be **seeded by name**, then expanded by graph. |
| **F2** | **The embeddings barely discriminate.** On the `rich` graph (1,925 nodes), **98.6 %** of nodes have another node at cosine > 0.99; median best-match **0.9999**. `Console.print` retrieves `tests.test_columns_align.render` at 0.9998. | `search_similar_code` returns near-duplicate noise. Treat it as a low-value tool; `get_code_neighbors` + `read_file` is the protocol that earns its turns. |
| **F3** | **96 % of issue statements never name a `.py` file**, and `hints_text` is **empty for all 129 training tasks**. | Localization is the entire problem. There is no hint field to lean on, and there are no filenames in the prompts to seed grep with. |
| **F4** | **43 % of gold patches touch one file with ≤ 5 added lines** (median: 1 file, 8 added lines; p90 4 files, 102 added lines). 11 / 129 create a brand-new file. | The "minimum-path" tenet is empirically correct. Optimize for the small, surgical edit; actively suppress exploration. |
| **F5** | **Never end a task with a clean working tree.** If the agent is cut off without calling `submit_patch()`, the harness runs `git add -N . && git diff --binary` anyway — but **only if the tree is dirty**. A clean tree = `NO_PATCH` = certain zero. The starter scored `patch_chars=0` on 2/2 in the organizer notebook. | A cheap early "insurance edit" is worth more than a late perfect one. This inverts the usual verify-then-submit discipline and is the single highest-leverage behavioural rule. |

---

## 0.2 Do these three things today

1. **Accept the competition rules on Kaggle.** Entry deadline is **Nov 25** and you cannot enter after it. It is a legal step only you can take. Ten minutes; removes the risk of doing six weeks of work you cannot enter. *(Same day, also sign up for the **Paper Track** — it is a separate competition, and the Overview explicitly says so.)*
2. **Post the four organizer questions in §5.2 to the competition forum.** The single highest-value unknown is whether the official 12-hour run is **sequential or concurrent**. Your entire per-task budget — 1 minute vs 6 minutes — hangs on that answer, and you cannot infer it from the public materials.
3. **Run the baseline once.** Copy `sample_submission/`, run the harness (`swegemma eval`) against 5 dev tasks with the budget schedule from §2.6, and record the receipt. You need a real number before you can improve on it, and you need to know tonight whether your local harness works at all.

---

## 0.3 Evidence tiers used throughout

Every factual claim in this prompt carries one of these tags. Do not let them blur, do not promote them, do not blur them in the paper.

| Tag | Meaning | May appear as a result? |
| --- | --- | --- |
| **VERIFIED** (`[V]`) | Read directly from an official organizer document (URL + file cited) or from the Paper Track discussion | Yes |
| **MEASURED** (`[M]`) | Produced by a script in `scripts/` against the released data package, or an observed run quoted from official materials | Yes, with the script named |
| **DERIVED** (`[D]`) | Arithmetic on `[V]` or `[M]` values; the calculation is shown | Yes, with the calculation shown |
| **PROPOSED** (`[P]`) | My design recommendation, not yet tested | Only as a proposal |
| **UNKNOWN** (`[U]`) | Could not be established from available materials; the exact verification action is given | **No — must never be stated as fact** |
| **RETRACTED** (`[X]`) | Once claimed, now removed with reason | Cite as prior-art error only |

**No number in this prompt reports a BCF pass rate.** No BCF agent has been built or run. Every performance figure is either an organizer-published observation or an arithmetic bound derived from the 12-hour cap.

---

## 0.4 How this prompt is organized

| Part | Contents |
| --- | --- |
| **§0** | Framing, five findings, three-today, evidence tiers |
| **§1** | Verified competition facts (submission, model, deadlines, paper-track criteria, scoring) |
| **§2** | The BCF brain — architecture, gates, localization protocol, budget governor, repo layout, prompt rules |
| **§3** | Experiment protocol — splits, A/B ladder, metrics, receipts, statistics, claims audit |
| **§4** | Six-sprint roadmap — day-by-day checklists, hour estimates, exit gates, cut paths |
| **§5** | Risks, forum questions, UNKNOWN register, fallbacks, prior-art review, paper-track strategy |
| **§6** | Reference appendices — tools, budget, data, deadlines, reproducibility |

If you are reading cold: **§0 → §1.2 (the corrections) → §4 Sprint 1**. That is the critical path. Everything else is reference material you will come back to.

---

## 0.5 The single sprint map (one-page)

| Sprint | Dates | Theme | Binary exit gate |
| --- | --- | --- | --- |
| **1** | **Sep 29 → Oct 5** | Harness truth & baseline | A0 measured on 12 dev tasks, receipt committed, splits frozen, **competition rules accepted on Kaggle** |
| **2** | **Oct 6 → Oct 12** | Localization brain + offline retrieval protocol | Seed→expand→read beats blind search on dev-fast; offline retrieval table committed |
| **3** | **Oct 13 → Oct 19** | Patch discipline & the insurance edit | `no_patch_rate == 0` on dev-fast; ≥ 1 task resolved |
| **4** | **Oct 20 → Oct 26** | Budget governor + ablation ladder + noise floor | Full A0–A4 ladder, 3 seeds, dev split, with CIs; pre-registered confirmatory plan written |
| **5** | **Oct 27 → Nov 2** | Frozen held-out + go/no-go on LoRA | Held-out run on tagged commit; LoRA decision written with evidence |
| **6** | **Nov 3 → Nov 8** | Write-up, claims audit, package | Every number has a receipt; `submission.zip` builds clean; papertrack draft audited |

Then **Nov 9–11 buffer** → paper submitted by Nov 10. Main-track work continues to the Dec 2 deadline on a separate branch.

---

# §1 — Verified competition facts

All facts in this section are tagged `[V]` because they are quoted or paraphrased from official organizer sources: the public Kaggle competition overview, the `HARNESS_README.md` shipped inside the 22.42 GB data package, the Paper Track overview, and Ryan Holbrook's getting-started notebook. Where two sources disagree, the higher-authority one wins (HARNESS_README > Paper Track page > notebook > third-party).

## §1.1 What you submit `[V]`

| Item | Value |
| --- | --- |
| Artifact | `submission.zip` containing the **Agent Config** |
| Required root file | `agent.yaml` at the archive root (`.yml`, `root_agent.yaml`, `root_agent.yml` also accepted; **exactly one** root config) |
| Optional dirs | `configs/`, `prompts/`, `sub_agents/`, `adapters/`, `skills/`, `eval_config.yaml` |
| Hard size limit | **3 GiB (3,221,225,472 bytes) total unpacked, including adapters** |
| Permitted extensions | `.yaml .yml .md .txt .py .json .safetensors` — **nothing else**; `.bin`/`.pt`/`.pth` rejected |
| Archive limits | 10,000 files · 1,000 YAML files · 50 MiB per YAML · 50 MiB per skill dir · 1,000,000 chars instruction per agent |
| License | Winner code released under **Apache 2.0** (a fact, not a choice) |

## §1.2 The declarative-only constraint — the single biggest architectural fact

> "Competitors **do not** submit Python code entrypoints (`agent.py` or `agent_fn`). Standard ADK's `from_config()` permits arbitrary dynamic Python imports; **`adk-submission` replaces it with a sandboxed YAML compiler**. All agents, sub-agents, workflows, tools, and generation parameters are declared in YAML and resolved against closed host registries." — HARNESS_README §2.1

Python *is* allowed, but only as **ADK skill scripts** (`.py` files under `skills/<name>/scripts/`), executed via `run_skill_script` inside the persistent Docker container. `importlib` is never used to load competitor code.

**Consequence for BCF.** There is no `patch_validator.py` you can `import`. There is no orchestrator loop you can write. The "brain" is:

```
brain = system prompts (prompts/*.md)
      + declarative agent tree (agent.yaml, sub_agents/*.yaml)
      + skill scripts (skills/*/scripts/*.py, run via run_skill_script)
      + generation config (configs/sampling.yaml)
      + optional LoRA adapters (adapters/*/adapter_model.safetensors)
```

Anything the earlier BCF plans described as an in-process Python orchestrator (e.g. an orchestrator that "refuses file-access tool calls until a valid spec exists") **must be re-expressed as declarative structure + prompt + skill script**. This is not a small port; it is a redesign of the enforcement mechanism. §2.5 shows how the gates survive it.

## §1.3 The tool surface — exactly nine tools, no more

`SwegemmaContext.create_tools()` registers 9 tools. Your `agent.yaml` can attach any subset. Plus ADK provides `run_skill_script`, `load_skill_resource`, and `AgentTool` delegation — the only sanctioned ways to invoke your own logic.

| # | Tool | Counts against `tool_calls`? | Hard limits |
| --- | --- | --- | --- |
| 1 | `run_command(command)` | **Yes** | 300 s command timeout; stdout+stderr truncated to **5,000 chars** |
| 2 | `submit_patch()` | **No — free** | Terminal; ends the agent loop once the turn completes |
| 3 | `get_status()` | **No — free** | Returns live budget consumption |
| 4 | `read_file(filepath, start_line, end_line)` | **Yes** | **150 lines** AND **10,000 chars** per call (whichever first) |
| 5 | `edit_file(filepath, old_string, new_string, allow_multiple)` | **Yes** | 3-tier resilient match (exact → flexible → regex); ambiguous match errors unless `allow_multiple` |
| 6 | `write_file(filepath, content)` | **Yes** | Creates parent dirs |
| 7 | `get_code_neighbors(node, edge_type, max_neighbors)` | **Yes** | 4-tier name resolution |
| 8 | `search_similar_code(query, k)` | **Yes** | **Symbol-name resolution only — F1 above** |
| 9 | `get_code_subgraph(nodes)` | **Yes** | Induced subgraph |

> **Free tools are strategically important.** `get_status()` costs nothing, so the agent should poll it — the budget schedule in §2.6 depends on it. `submit_patch()` costs nothing and always terminates, so there is never a reason to be afraid of calling it.

> **Budget warning is built in.** When `tool_calls ≥ 20` and remaining ≤ 10, every tool response gains a `budget_warning` field. Your prompt should assume the model *will* see this and instruct it to finalize and call `submit_patch`.

## §1.4 Budgets — the constraint everything else obeys

| Parameter | Harness default | `inference.py` (competition) | Starter `sample_submission` |
| --- | --- | --- | --- |
| `max_time_minutes` | 60.0 | 60.0 | **1** |
| `max_tool_calls` | `None` (CLI) | **100** | **10** |
| `max_turns` | 500 | 500 | **50** |
| `timeout_seconds` (per command) | 300 | 300 | 60 |

All four are overridable per submission via `eval_config.yaml` under an `evaluation:` key. **Container setup is excluded from the agent's `time_minutes`** but the **12-hour global cap explicitly includes it**. `[V]`

## §1.5 The global cap, and the arithmetic it forces `[D]`

- 12 h = **43,200 s**, for **~120 tasks**, inclusive of sandbox setup, exclusive of patch validation.
- `43,200 ÷ 120 = 360 s per task` if the run is sequential. `[D]`
- Organizer's own notebook: 4 tool calls in a 60 s agent session; `duration_seconds = 76.1`. Implies **~16 s of non-agent setup** and **~15 s per agent turn** on 4× L4 with `tp=4`. `[M]`
- Within a 360 s task: ~16 s setup, leaving **~344 s ≈ 23 turns ≈ ~20 tool calls**. `[D]`

This is the design envelope. It is roughly **half** the 40-turn / 120k-token ceiling proposed in the pre-organizer-materials plan, and it is not adjustable — it falls directly out of the published cap.

**Contingency (load-bearing `[U]`).** If the official harness runs tasks **concurrently** against the single TP=4 vLLM server, the per-task budget is far larger and a deeper protocol becomes affordable. Sprint 1 must resolve this, and the architecture is written to be **budget-parametric**: the same brain degrades gracefully from a 6-minute envelope to a 1-minute one.

## §1.6 How you are scored `[V]`

A task is `resolved = True` **iff all** hold:

1. `pytest` exits `0`,
2. JUnit XML exists,
3. `passed_tests > 0`,
4. `failures == 0`,
5. `errors == 0`,
6. every required test node (FAIL_TO_PASS / PASS_TO_PASS / tests extracted from `test_patch`) **explicitly passed without being skipped**.

Score = Resolution Rate = resolved ÷ total tasks ∈ [0,1].

Three consequences:

- **You never see `test_patch`.** The agent must reason from the issue text and the repo. (Local dev work has it in `tasks.jsonl`; the hidden test set holds it in a private `secret/solution.parquet`.)
- **Test-file tampering is silently discarded.** `_is_protected_test_or_config_path` resets any `test_*.py`, `*_test.py`, `*.py` under `tests/`/`test/`/`testing/`, plus `conftest.py`, `pytest.ini`, `pyproject.toml`, `tox.ini`, `setup.cfg`, `sitecustomize.py`, `usercustomize.py`, `_swegemma_stubs.py`, `*.pth`. Editing them wastes turns.
- **A skipped test is a failure.** The agent must not "fix" a test by skipping it.

## §1.7 Submission cadence and final picks `[V]`

> "You may submit a maximum of one (1) Submission per day. You may select up to **two (2) Final Submissions** for judging." — Official Rules §2.2

**Two shots.** With 1/day and 2 final picks, the rational play is: burn the middle of the competition on daily submissions to keep the leaderboard honest and gather signal, then reserve the final two for the best two configurations measured on the frozen held-out split.

The leaderboard noise floor is **±1 task ≈ ±1.67 pp on the public LB (~60 tasks)** `[D]`. Differences under ~10 pp are mostly noise.

## §1.8 Deadlines (all 23:59 UTC) `[V]`

| Date | Event |
| --- | --- |
| **Sep 23, 2026** | Competition start |
| **Nov 12, 2026 (Thu)** | **Research paper** (optional, $35k) |
| **Nov 25, 2026 (Wed)** | Entry deadline **and** team merger deadline |
| **Dec 2, 2026 (Wed)** | Final submission deadline |

Prizes: main track **$65k** (37/18/10k) · paper track **$35k** · max team size **5** · winner license **Apache 2.0**.

## §1.9 Paper Track criteria `[V]` (confirmed via Kaggle Paper Track overview)

The Paper Track is a **separate** competition that requires separate sign-up. Criteria (each scored 0–5, **averaged**):

| Criterion | Question it answers (paraphrased from the Paper Track overview) |
| --- | --- |
| **Novelty** | Does the work provide new insights, deepen understanding, or highlight important properties of existing methods? |
| **Quality** | How general, sound, and reproducible is the technical contribution? |
| **Relevance** | Is it on-topic for the Gemma 4 Developer Agent domain and the four suggested topic areas (Tuning & Optimization · Code Comprehension · Tasks & Benchmarks · Graph Reasoning)? |
| **Verifiability** | Can a reviewer independently check the claims (code, data, receipts)? |
| **Clarity** | Is the writeup well-organized and unambiguous? |

Writeup body **≤3,000 words** `[V]`. Unpublished work only; a private Kaggle Resource attached to a public Writeup becomes public after the deadline. Whether one Writeup may compete for multiple prizes remains `[U]` — read the Paper Track page directly in Sprint 1.

**The two unclaimed slots you can defend today:** (a) a quantified characterisation of the provided code-intelligence assets (F1, F2, plus graph-node-has-no-file/line), and (b) a budget-aware scaffold for a small offline model under a hard global wall-clock cap. Neither requires a novelty claim about graph-first navigation or four-phase loops — both are prior art and **must not be claimed as contributions**. (Full prior-art review in §5.5.)

---

## §1.10 Corrections to the earlier BCF plans `[V]/[X]`

The earlier documents (`input/bcf/BCF-Gemma4-Competition-Plan.md`, `input/bcf/BCF-Reference-Compendium.md`) were written before the official materials were published. Apply these corrections before any work begins:

| # | Earlier claim | Reality | Action |
| --- | --- | --- | --- |
| **C1** | Spec phase, localization, patch, validation as **Python sub-agents** calling a Python orchestrator | Submissions are **declarative YAML only**; no `agent.py`, no `importlib` | Re-express all enforcement as YAML + skills (§2.5) |
| **C2** | Per-task budget ~40 turns / 120k tokens | Sequential cap is **~23 turns / ~20 tool calls** | Re-budget every phase (§2.6) |
| **C3** | "Graph-first localization: `search_similar_code` to find the relevant code from the issue text" | Query is resolved against **symbol names**; natural language returns `[]` | Localization must be **seeded by name**, then expanded (§2.4) |
| **C4** | "256-dim embeddings power offline semantic retrieval" | Embeddings are near-degenerate: **98.6 %** of nodes have a >0.99 neighbour | Demote `search_similar_code`; prefer `get_code_neighbors` + `read_file` |
| **C5** | Journal must live outside `/workspace` (e.g. `/tmp/bcf/...`) to stay out of the patch | `/tmp` exists; `.git/info/exclude` filters `__pycache__/`, `*.pyc`, `.pytest_cache/`, `*.egg-info/`, `build/`, `dist/`, `.coverage` | `/tmp` works, but anything untracked inside `/workspace` is captured by `git add -N .` |
| **C6** | "Build a JSONL ledger + receipt from scratch" | The harness **already emits** `summary.json`, `task_results.jsonl`, `patches/`, `test_outputs/`, `traces/trace_*.json` (ATIF v1.7), `logs/` | Do not rebuild; post-process the harness artifacts |
| **C7** | 129 tasks across fastapi, rich, requests, httpx | **67 fastapi / 48 rich / 13 requests / 1 httpx** | httpx-specific tuning is worthless. Weight dev results by this distribution |
| **C8** | Hints available via `{hints}` session variable | `hints_text` is **empty for all 129 tasks** | `{hints}` will always be empty. Never design around it |
| **C9** | "Existing SWE-bench benchmarks as external validity" | Competition's own 129 tasks are the benchmark; hidden set is **private repos** | Keep external benchmarks post-competition only |
| **C10** | Pass-rate projections, Table 1 results, "8–10 vs 24–30 turns", invented task `httpx_6821` | Retracted by their own author; no BCF harness run has ever completed | Not carried forward. Claims-audit procedure in §3.8 |

**Not corrected, and still right.** The four core tenets, minimum-path decomposition, breadcrumbs, binary machine-checkable done, rescue/circuit-breaker concepts, external (non-self) verification, progressive disclosure, and the structured-handoff hypothesis are all sound. They are re-anchored to the declarative substrate rather than discarded.

---

# §2 — The BCF Brain: Architecture & Build Specification

## §2.1 Design principles, in priority order

These are ordered because they conflict, and when two conflict the higher one wins.

1. **Never end a task with a clean working tree.** F5 above. Every other rule yields to this one. (`patch_chars=0` on 2/2 in the organizer notebook `[M]`.)
2. **Turns are the currency.** With ~20 tool calls per task, an exploratory turn spent "understanding the codebase" is a turn not spent fixing it. Exploration must be **targeted**, never open-ended.
3. **Prefer the cheap deterministic tool.** `grep` via `run_command` costs one call and works on any repo, including private ones. Graph tools cost one call but only work if graphs exist for the hidden repos `[U]`. Where both work, `grep` is the safer default.
4. **Make the small edit.** F4 above — 43 % of answers are one file, ≤ 5 lines. Exploration that finds the right file and then makes a sprawling change throws away the win.
5. **The spec is provisional, not a gate.** Under a ~20-turn budget with 29 % of statements under 200 characters, a pre-read spec is a guess, and an irreversible guess gate throws away the task. Spec first, revise after localization, exactly once.
6. **Degrade, never derail.** At 60 % of budget, stop exploring and start editing. At 85 %, submit whatever is on disk. The agent must always be able to produce a patch from wherever it is.

## §2.2 Architecture: one coder + one read-only scout

### §2.2.1 Why not the three-subagent tree

The earlier plan proposed `issue_analyzer → solution_planner → patch_implementer`. Rejected:

- Every transfer between agents costs a full model round-trip. At ~15 s/turn and a ~20-turn budget, three transfers consume ~25 % of the task before any work happens.
- Cognition's "Don't Build Multi-Agents" warns specifically that **write-heavy, sequentially dependent** pipelines — which this is — are the regime where context sharing breaks down.
- The harness already provides a cheaper primitive for the one place isolation genuinely pays: **read-only exploration.** The organizer's own README best-practice #4 recommends delegating code search to a read-only `agent_tool` "to keep intermediate `read_file` outputs out of the root coder agent's main context history."

So: **one coder agent + one read-only scout.** The scout is the structured-handoff experiment; the coder does everything else. If the scout does not beat inline search, delete it — one-line change, ablation rung A3.

### §2.2.2 The tree

```
coder  (LlmAgent, main_lora)          ← writes. Owns the whole task.
  tools:   run_command, read_file, edit_file, write_file,
           get_status, submit_patch,
           get_code_neighbors, get_code_subgraph,      ← useful
           search_similar_code,                       ← attached but PROMPT-SUPPRESSED (§2.4.3)
           agent_tool{ scout, skip_summarization: true }
  skills:  bcf-spec, bcf-localize, bcf-verify, bcf-rescue

scout  (LlmAgent, tool_lora)           ← read-only. Never edits, never submits.
  tools:   read_file, run_command, get_code_neighbors, get_code_subgraph
  skills:  bcf-localize
```

The scout is invoked on demand, not on a schedule. Delegation is itself a tool call, so the prompt must say when it is worth one.

## §2.3 The localization protocol — the part that matters most

F1, F2, F3 together: 96 % of issues never name a file, `hints_text` is always empty, `search_similar_code` cannot read English, and the embeddings are near-degenerate. Localization is therefore a **name-seeding problem**, not a semantic-search problem. The protocol has three steps plus an escape hatch.

### §2.3.1 Seed → Expand → Read

**Step 1 — Seed (1 call).** Mine the problem statement for anything that could be a symbol; grep for it. Even a bad guess is useful: grep failure is information.

```bash
# One call, all three seeds, ranked by hit count. No .git noise.
grep -rn --include=*.py -E "ClassName|func_name|ErrorName" /workspace \
  | grep -v "/\.git/" | head -30
```

**Step 2 — Expand (1–2 calls).** Given a hit like `fastapi/routing.py:412:def _prepare_response_content`, derive the graph symbol and expand the call graph:

```
get_code_neighbors("fastapi.routing._prepare_response_content")      → callers + callees
get_code_subgraph(["fastapi.routing._prepare_response_content", ...]) → structure
```

The symbol ID is recoverable from the file path (`fastapi/routing.py` → `fastapi.routing`) plus the definition name. The graph nodes carry `text` but **no line numbers**, so this step buys you *the right neighbourhood*, not the right line.

**Step 3 — Read (1–2 calls).** `read_file` on the narrowed region. Remember the caps: **150 lines and 10,000 chars per call.** A 3,000-line file needs a `grep -n` first to pick the window, or you will burn two calls reading the top of a file that does not contain the bug.

**Why this beats semantic search here:** the graph gives you *what calls this* and *what this calls*, which is the actual signal for "why does a bug deep in a library surface at the HTTP layer." Embedding similarity, as measured in F2, returns generic Python methods.

### §2.3.2 The escape hatch for hopeless statements

For the 29 % of tasks under 200 characters ("fix fonts", "empty live"), seeding from the issue text fails. Fall back to **structural priors in this order**, one call each, abandoning the moment you hit:

1. `git log --oneline -5` — no future commits exist (history is truncated at `base_commit`), but nearby commit subjects are topical.
2. The traceback or error string, if the statement has one.
3. `get_code_neighbors` on the *public API symbol named in the issue* (e.g. "markdown" → find the renderer class).

**Accept that some tasks are unwinnable and spend nothing on them.** A task you abandon at 6 tool calls costs 6 tool calls. The budget governor (§2.6) is what prevents a single pathological task from consuming the pool.

### §2.3.3 `search_similar_code`: attached but suppressed

Keep it in the `tools:` list (removing it is a free experiment later) but instruct the scout and the coder: *do not pass natural language; only pass an exact symbol name you already obtained from grep or the graph.* Rationale: an agent that burns 2 calls on `search_similar_code("fix fonts")` and gets `[]` is strictly worse than one that never calls it. This is a hypothesis (rung A2c), not a fact.

### §2.3.4 The offline retrieval benchmark — run this before touching the agent

`genspark-deepseekV41flash`'s strongest contribution: a **model-free, seconds-per-iteration** retrieval benchmark that de-risks the entire brain thread. Run this in Sprint 2 Day 1, before any ladder rung beyond C0/C1.

**Arms (each evaluated per task against the gold patch):**

| Arm | Method | Signal |
| --- | --- | --- |
| **A** | exact/fuzzy symbol resolve (exact → case-insensitive → `.`/`/` suffix → last-segment substring) | Highest precision when it hits |
| **B** | BM25/TF-IDF over `nodes[*].text` + extracted docstrings | Workhorse; stdlib-only; deterministic |
| **C** | embedding cosine probe over stored 256-dim vectors | Oracle-adjacent upper bound on embedding usefulness |
| **D** | 1–2 hop graph expansion from A/B seeds along `calls`/`references` | Discover callees of mentioned entry points |
| **Hybrid** | weighted scorer over A/B/D | What the brain actually ships |

**Metrics per arm:**

- `Recall@1`, `Recall@5`, `Recall@10` of the **gold symbol** in the top-k candidates.
- Per-repo breakdown (fastapi / rich / requests / httpx).
- `candidate_rank_of_gold` — the rank of the first gold symbol; averaged across tasks.

**Leave-one-repo-out (LORO)**: build arms on three repos, test on the fourth. If the LORO delta is within 10 pp of the in-repo delta, generalization holds. If it collapses, the brain memorized the four public repos; **report the negative result honestly** — it is a real and useful finding.

**Go/no-go for the brain v1**: ship only if hybrid beats BM25-alone by **≥ 15 pp on Recall@5** in-repo *and* holds in LORO. Otherwise drive the paper on budget discipline + instrumentation, which is the deeper candidate finding.

**Encoder identification (cheap, high-leverage).** If you can identify the model that produced the 256-dim embeddings, you can build a fully local text→node retriever and iterate offline at ~100× the agent's speed. Take any node's `text`, embed it with candidate encoders, compute cosine against the stored vector. A near-1.0 cosine identifies the encoder (modulo pooling and normalisation). Try the obvious 256-dim code models, then check the notebook's `sg` module source in `swegemma` — the loader may name it directly. **Cost: under an hour. Payoff: your entire retrieval A/B becomes a sub-second loop.** `[R]`

## §2.4 The `BCF-Spec`: provisional, structured, cheap

### §2.4.1 Revised stance

The compendium's schema gated all file access behind a valid spec. **That gate is removed.** Under a ~20-turn budget with 29 % of statements being near-uninformative, forcing a committed root-cause guess before the agent has seen the repository guarantees wasted tasks.

Instead the spec is:

- **emitted early and cheaply** (one model turn, as part of the first reasoning block, not a separate call),
- **explicitly marked provisional**,
- **revised exactly once**, after localization, and the revision is journaled into the spec itself (no separate breadcrumb file to keep in sync).

Its value is not gating. It is (a) forcing the model to commit to a target before it starts editing, which measurably reduces scattershot patches, and (b) giving you a per-task structured artifact for failure analysis and the Spec-File-Correct quality signal in the paper.

### §2.4.2 Schema (draft 2020-12)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "bcf-spec.schema.json",
  "title": "BCF-Spec",
  "type": "object",
  "required": ["task_id", "status", "hypothesis", "target", "fix_shape", "assertions", "scope"],
  "additionalProperties": false,
  "properties": {
    "task_id":    { "type": "string" },
    "status":     { "enum": ["provisional", "revised"] },
    "hypothesis": { "type": "string", "minLength": 20,
                    "description": "Code-level cause, not the symptom." },
    "target":     { "type": "object", "required": ["symbol"],
                    "properties": {
                      "file":   { "type": "string" },
                      "symbol": { "type": "string" }
                    } },
    "fix_shape":  { "type": "string",
                    "enum": ["delete","replace","guard_add","check_add",
                             "iterator_or_logic_rewrite","new_code","other"] },
    "assertions": { "type": "array", "minItems": 1,
                    "items": { "type": "string" },
                    "description": "Binary, test-mapped. Free text is acceptable here." },
    "scope":      { "type": "array", "items": { "type": "string" },
                    "description": "Files the agent may modify." },
    "rejected":   { "type": "array", "items": { "type": "string" },
                    "description": "Hypotheses ruled out during localization." }
  }
}
```

Two changes from the compendium version: `status` makes provisionality explicit; `rejected` folds the breadcrumb journal into the spec — one artifact instead of two.

Emit it through a **skill script** (`bcf-spec`), not as free-form prose. Small models are markedly more reliable producing structured arguments to a tool than hand-writing JSON. Keep a lenient fallback parser: if the script fails to parse, proceed without a spec rather than losing the task.

### §2.4.3 Gates — what survives without a Python orchestrator

The gates are real; only the *enforcer* changes. Deterministic checks become a **skill script** the agent is instructed to run, and the *outcome* is a tool result the model must react to.

| Gate | Predicate | Where enforced | On fail |
| --- | --- | --- | --- |
| **G0** spec present | `bcf-spec` ran, or skip flag set | Skill returns `status: ok` | Continue without spec; do not block |
| **G1** scope | changed files ⊆ `spec.scope` | `bcf-verify` script reads `git diff --name-only` | Revert out-of-scope hunks |
| **G2** applies | `git apply --check` equivalent | `bcf-verify` | Regenerate patch |
| **G3** parses | `python -m py_compile` on changed `.py` | `bcf-verify` | Fix syntax before testing |
| **G4** target passes | targeted pytest exits 0 | `run_command` | One strike; retry once, then rescue |
| **G5** no regression | previously-passing tests in touched modules still pass | `bcf-verify` | **Immediate revert** |
| **G6** not empty | `git diff HEAD \| wc -c` > 0 | `bcf-verify` | **Insurance edit, then submit** |

**The honesty limit, stated plainly.** Without a Python orchestrator these gates are *advisory*. The model chooses whether to run `bcf-verify`. That is a real weakening of the compendium's design and must be reported as such in the paper — "gates the model is instructed to honour, audited post-hoc from traces" is a different and weaker claim than "gates the model cannot bypass."

The post-hoc audit is cheap because the harness already records everything: `traces/trace_*.json` contains every tool call and result, so "did the agent run its gate before submitting?" is a queryable property of each run. That turns the weakness into a measurable quantity — **gate_compliance_rate** — which is itself a publishable result.

## §2.5 Structured handoff, declaratively

`agent_tool: { config_path: sub_agents/scout.yaml, skip_summarization: true }` is the declarative form of the compendium's "transcript-passing gap" finding:

- `skip_summarization: true` returns the scout's **final text only** — a structured report — instead of replaying the scout's whole turn history into the coder's context.
- The scout's `read_file` calls and their bulky outputs never enter the coder's context window.
- It costs exactly one tool call to invoke.

The handoff packet is simply a **contract on the scout's output format**, enforced by its prompt:

```markdown
## Localization Report
- Seed symbol:    <fully.qualified.Symbol>   (from grep at <file>:<line>)
- Neighbors:      <symbol> [source:graph]
- Suspect file:   <path>:<line-range>
- Evidence:       <the 1–3 lines that show the defect>
- Ruled out:      <hypothesis> — because <reason>
```

The three-arm ablation survives as: **T0** inline search (no scout), **T1** scout with structured report (above), **T2** scout with `skip_summarization: false`. Report pass rate + tokens for each. Note the honest framing required in the paper: Cognition argues subagents need *full* traces, and T2 exists precisely to test whether that warning applies in this setting. Whichever arm wins, report it.

## §2.6 Budget governor

### §2.6.1 Sizing

From §1.5, assuming a sequential run:

| Parameter | Value | Rationale |
| --- | --- | --- |
| `evaluation.max_time_minutes` | **4.0** | 4 min agent + ~1 min setup = 5 min × 120 = 10 h, leaving 2 h (17 %) margin under the 12 h cap |
| `evaluation.max_tool_calls` | **30** | ~15 s/turn means 4 min ≈ 16 turns; 30 is a safety ceiling, not a target |
| `evaluation.max_turns` | **60** | |
| `evaluation.timeout_seconds` | **300** | Harness default; the starter's 60 s truncates real test runs |
| `thinking_budget` | **4096** | Starter default. Raising it buys reasoning and costs turns |
| `max_output_tokens` | **16384** | Starter default |

**Re-tune after Sprint 1's measurement.** If local setup overhead is much larger than 16 s, reduce agent time; if the harness turns out to be concurrent, increase it. Record the final choice and its derivation in a receipt.

### §2.6.2 In-agent phase budget

The prompt carries an explicit schedule. `get_status()` is **free** — the agent should call it periodically, not just at the end.

| Fraction of budget | Turns (of ~16) | The agent must be doing |
| --- | --- | --- |
| 0–15 % | 0–2 | Read the prompt. Emit provisional spec. Locate a seed symbol |
| 15–40 % | 3–6 | Expand (graph or grep) and read the 1–2 candidate regions |
| 40–70 % | 7–11 | **Make the edit.** One `edit_file`, minimal, in scope |
| 70–90 % | 12–14 | Targeted test. One fix attempt if it fails |
| 90–100 % | 15–16 | Cleanup → `submit_patch` → stop |

The two rules that make this work:

- **At 60 % of budget with no edit on disk: make the insurance edit immediately**, whatever it is. Then continue improving. This converts the 2/2 empty-patch failure into a scored attempt.
- **Cleanup before submit.** `submit_patch()` runs `git add -N .` inside `/workspace`, so any untracked scratch file you created in `/workspace` is captured into the patch. Put repro scripts in `/tmp`. This is organizer gotcha #3 and it will silently corrupt patches that would otherwise pass.

### §2.6.3 Submission fallback (the harness is on your side)

If the agent never calls `submit_patch()`, the harness runs `git add -N . && git diff --binary` anyway and still scores the result — **provided the working tree is dirty.** You do not need to win the race to `submit_patch`; you need to not finish clean. This is the single cheapest point of insurance in the whole design.

## §2.7 Repository layout to build

```
bcf-brain/
├── agent.yaml                    # coder
├── eval_config.yaml              # the §2.6.1 budget
├── configs/sampling.yaml         # temperature 0.2, top_p 0.95, 16384 out, thinking 4096
├── prompts/
│   ├── system.md                 # coder: phases, tool protocol, budget schedule, hard rules
│   └── scout.md                  # read-only localization report contract
├── sub_agents/
│   └── scout.yaml                # read-only agent_tool
├── skills/
│   ├── bcf-spec/                 # SKILL.md + scripts/spec.py
│   ├── bcf-localize/             # SKILL.md + scripts/seed_scan.sh + scripts/brain_query.py (the retrieval skill)
│   ├── bcf-verify/               # SKILL.md + scripts/verify.py   (G1,G2,G3,G5,G6)
│   └── bcf-rescue/               # SKILL.md + references/state-machine.md
└── adapters/                     # optional, only after the Sprint 5 go/no-go
```

`verify.py` is the one script worth writing early. It is ~60 lines of stdlib Python and it makes five of the seven gates executable:

```python
#!/usr/bin/env python3
"""BCF gate runner. Returns a JSON gate vector. Read-only apart from G6 reporting."""
import json, subprocess, sys, ast, pathlib

def sh(*a):
    p = subprocess.run(a, cwd="/workspace", capture_output=True, text=True, timeout=60)
    return p.returncode, (p.stdout or "") + (p.stderr or "")

def main():
    g = {}
    rc, names = sh("git", "diff", "--name-only", "HEAD")
    changed = [n for n in names.split("\n") if n.strip()]
    g["G6_not_empty"] = bool(changed)
    g["G1_scope"] = None  # filled from spec.scope if the caller passes --allowed
    g["G2_applies"] = True  # working tree is the source of truth; N/A as a gate here
    parse_ok, bad = True, []
    for f in changed:
        if f.endswith(".py"):
            try: ast.parse(pathlib.Path("/workspace", f).read_text(encoding="utf-8", errors="replace"))
            except SyntaxError as e: parse_ok = False; bad.append(f"{f}:{e.lineno}")
    g["G3_parses"] = parse_ok
    g["G5_no_regression"] = None  # requires a prior green run; the agent supplies it
    print(json.dumps({"status": "ok", "gates": g, "changed": changed, "syntax_errors": bad}))

if __name__ == "__main__":
    sys.exit(main())
```

Ship this early, extend it as each gate earns its keep. Everything else in `skills/` is prompt text until an experiment says otherwise — do not build machinery you have not justified.

## §2.8 Prompt rules that must be in `system.md`

Each maps to a measured failure mode or a harness rule. Keep the starter's hard-won lines (`NEVER` touch test files; never bare `pytest`; FastAPI `docs_src/` note) — the organizers wrote them for a reason.

1. **Never end with a clean working tree.** F5. If you are out of budget, ensure at least one real source edit exists.
2. **Never modify, create or delete test files, `conftest.py`, or `pytest.ini`.** They are discarded before scoring; the edit is wasted.
3. **Put scratch files in `/tmp`, never `/workspace`.** Anything untracked in `/workspace` is captured into the patch.
4. **Never run bare `pytest` or a full-repo sweep.** Always name the target file. Full suites blow the command timeout.
5. **Call `submit_patch()` last**, after verification and cleanup. It is free, and it ends the session.
6. **Pass symbols, not sentences, to `search_similar_code`.** English queries return nothing.
7. **Prefer the smallest change that could work.** One file, few lines, no refactoring.
8. **If the statement is too vague to act on, use the structural escape hatch (§2.3.2) — and if that also fails, make a defensible small edit and submit.** Do not burn the budget.
9. **FastAPI documentation-code tasks live under `docs_src/`.** (From the starter; 34 gold patches touch it.)
10. **At 60 % of budget with no edit made, make one now.**

## §2.9 What this design is *not* claiming

- No pass rate is claimed. Nothing has been run.
- The gates are advisory, not enforced (§2.4.3). The paper must say so.
- The graph tools may not exist on the hidden set (`[U]`). The design degrades to grep; say so.
- The budget assumes a sequential harness (`[U]`). If concurrent, this design is leaving score on the table.
- `search_similar_code` is suppressed on a measured hypothesis, not a proven optimum.
- The four-phase loop and graph-first navigation are **prior art**, not contributions.

---

# §3 — Experiment Protocol

## §3.1 The measurement budget, before anything else

**A full 129-task sweep is not a unit of iteration.** At ~4 min/task, one sweep of the whole set costs **~8.6 hours**. Across six weeks at 15–20 h/week you can afford perhaps **10–15 full sweeps in total**, including the held-out runs and the paper. Design the protocol around that scarcity.

| Tier | Size | Cost per sweep | Purpose |
| --- | --- | --- | --- |
| **`dev-fast`** | 15 tasks | **~50 min** | Iteration. Every prompt edit, every gate change |
| **`dev-full`** | 54 tasks | **~3.6 h** | Promotion. A change must win here before it touches held-out |
| **`heldout`** | 45 tasks | **~3.0 h** | **Frozen.** Touched ≤ 3 times in the entire project |
| *reserve* | 15 tasks | — | Held back; absorbs a task found to be broken in the harness |

**Useful local/eval alignment.** The competition model is INT4 ~16–18 GB, which **fits a 32 GB RTX 5090 at `tp=1`.** Local wall-clock should therefore be roughly comparable to the 4×L4 `tp=4` eval host rather than dramatically faster. Treat local timings as informative about the real budget, but still measure turns and tokens as the primary currency — hardware differs, and you cannot control theirs.

## §3.2 Splits and the leakage policy

### §3.2.1 Stratification — the repo distribution forces the rule

The 129 tasks are **67 fastapi / 48 rich / 13 requests / 1 httpx**. A random split will hand you ~8 httpx tasks out of 129 if you are unlucky and 0 if you are not — and either way, per-repo numbers become unreadable at small n. **Stratify proportionally by repo**, and allocate the single httpx task to `dev` so that at least one non-fastapi/rich task is always in view.

### §3.2.2 The rule (implement in Sprint 1, commit, then do not touch)

```
seed = 20260929
stratify by repo, proportional, no replacement
dev-fast  = 15   (8 fastapi, 5 rich, 1 requests, 1 httpx)
dev-full  = 54   (28 fastapi, 20 rich, 6 requests)
heldout   = 45   (31 fastapi, 14 rich — adjusted to keep rich ≥ 25% for readability)
reserve   = 15
```

Exact counts are whatever your stratified draw produces. What matters is that the script writes:

- `splits/dev_fast.txt`, `splits/dev_full.txt`, `splits/heldout.txt`, `splits/reserve.txt` — one `instance_id` per line,
- `splits/manifest.json` — seed, algorithm, per-split repo histogram, and a **SHA-256 of the concatenation of all four files**,
- the same manifest committed to git with a `PreToolUse` hook that **blocks edits to `splits/heldout.txt` and `splits/manifest.json`**.

That hook is not ceremony. The single most common way to destroy a competition result is to look at held-out numbers twice and "just adjust the prompt" between them.

### §3.2.3 The one legitimate early peek, and what it costs

You will be tempted to run the held-out set early to sanity-check the harness. Do it **once**, in Sprint 1, and record it honestly. It is defensible for a *pipeline* check (does the harness produce artifacts, does the scorer work) provided you:

1. Run **A0 only** — the unmodified starter. There is nothing to tune against.
2. Record it in the manifest as `heldout_peek: {rung: "A0", date, result}`.
3. Do not look at **per-task** results — only the aggregate. Per-task inspection is how contamination actually happens.
4. Never tune against it.

This is defensible. What is not defensible is a held-out baseline measured in Sprint 2 *after* you have started iterating, because by then the number is anchored in your decisions whether or not you admit it.

### §3.2.4 Rule for the hidden set

The hidden ~120 tasks come from **private repositories**. So:

- Nothing may be memorised per-repo. The four public repos are a *development* distribution, not a target.
- Any knowledge that ships in the brain must be **repo-agnostic**: general search strategy, general graph-traversal procedure, general test-selection heuristic, failure playbooks.
- Per-repo facts discovered during development **do not ship** in prompts or skills.

## §3.3 The A/B ladder

Each rung changes **exactly one mechanism**. Build up; never skip a rung; never change two things.

| Rung | Change vs previous | Question it answers | Cheap signal first |
| --- | --- | --- | --- |
| **A0** | `sample_submission/`, unmodified | What is the real baseline? | — |
| **A1** | + BCF `system.md`: phases, budget schedule, hard rules, insurance-edit discipline | Does structured prompting alone move the needle? | 15-task dev-fast |
| **A2** | + seed→expand→read localization protocol (grep seeding, no graph) | Does disciplined localization beat open search? | dev-fast |
| **A2b** | + `get_code_neighbors` / `get_code_subgraph` in the protocol | Do the graph tools earn their turns? | dev-fast |
| **A2c** | − `search_similar_code` (suppressed) | Confirms F1/F2 at the outcome level | dev-fast |
| **A3** | + read-only scout via `agent_tool`, `skip_summarization: true` | Does structured handoff beat inline search? | dev-fast |
| **A3b** | scout with `skip_summarization: false` | Does Cognition's "share full traces" warning apply here? | dev-fast |
| **A4** | + `bcf-verify` skill gates (G1,G2,G3,G5,G6) | Do executable gates reduce bad submissions? | dev-fast |
| **A5** | + rescue mode + breadcrumbs | Does bounded recovery rescue failures without costing good tasks? | dev-full |
| **A6** | + LoRA (routed adapter) | Does post-training add anything beyond scaffolding? | dev-full, then heldout |

**A0 is not optional and not a formality.** Without it, every subsequent delta is uninterpretable.

### §3.3.1 Promotion rule

A rung moves from `dev-fast` (15 tasks) to `dev-full` (54) only if it does **all** of:

1. Improve resolution rate on `dev-fast` (even by one task),
2. Reduce `no_patch_rate` toward 0 (ideally to 0),
3. Stay inside the per-task budget (no config that raises `max_time_minutes` or `max_tool_calls`).

Condition 3 exists because a "win" bought with more turns is not a win — it is a budget transfer that will not survive the 12-hour cap on 120 tasks.

## §3.4 Metrics

The harness already writes everything you need. **Do not build a parallel ledger** — that was a correct instinct under the wrong assumption and is a waste of Sprint 1.

From `--results-dir`: `summary.json`, `task_results.jsonl`, `patches/`, `test_outputs/`, `traces/trace_*.json` (ATIF v1.7), `logs/`.

| Metric | Definition | Why it earns its place |
| --- | --- | --- |
| `resolution_rate` | resolved ÷ n | The competition metric. The only number that scores |
| `no_patch_rate` | tasks with empty patch ÷ n | **F5.** The #1 observed failure mode. Must reach 0 |
| `tool_calls_p50`, `p95` | per task | Budget is the binding constraint; the median hides the tail |
| `turns_p50`, `p95` | per task | Same |
| `tokens_in`, `tokens_out` | from traces | Context economics; drives compaction behaviour |
| `graph_tool_share` | graph calls ÷ total tool calls | Tests the graph-tools-on-hidden hypothesis and the A2b rung |
| `wasted_turns` | calls returning `{"results": []}` or empty output | Directly measures the `search_similar_code` trap |
| `gate_compliance_rate` | runs where `bcf-verify` was called before `submit_patch` | Makes the advisory-gate weakness measurable (§2.4.3) |
| `budget_exhaustion_rate` | tasks hitting the time/tool ceiling | Identifies the truncation risk at 12 h |
| `per_repo_resolution` | by repo | The hidden set is private repos; per-repo variance is the generalization story |
| `first_attempt_vs_rescued` | resolution split by `rescue_triggered` | Whether rescue earns its turns |
| `spec_file_correct` | fraction of dev tasks where `spec.target.file` matches gold | Spec-quality signal; correlates with PASS in pre-registration |

**Report the median and p95, never just the mean.** The starter's failure mode is bimodal: a task either dies in 4 turns or burns the whole budget. A mean of 9.5 tool calls conceals both tails, and the p95 is what determines whether you finish 120 tasks in 12 hours.

## §3.5 Receipts

One receipt per run. Commit it. The paper cites receipt IDs, not numbers.

```json
{
  "receipt_id": "R-0007",
  "rung": "A2b",
  "git_commit": "",
  "config_hash": "sha256:",
  "harness_version": "swegemma <version>",
  "model": "gemma-4-31b-it-qat-w4a16-ct",
  "adapter": null,
  "sampling": { "temperature": 0.2, "top_p": 0.95,
                "max_output_tokens": 16384, "thinking_budget": 4096 },
  "budget": { "max_time_minutes": 4.0, "max_tool_calls": 30,
              "max_turns": 60, "timeout_seconds": 300 },
  "sandbox": "docker",
  "split": "dev_fast",
  "split_manifest_sha": "sha256:",
  "seed": 0,
  "task_ids": [],
  "metrics": { "resolution_rate": 0.0, "n": 0, "no_patch_rate": 0.0,
               "tool_calls_p50": 0, "tool_calls_p95": 0 },
  "started_utc": "", "finished_utc": "", "notes": ""
}
```

`config_hash` = SHA-256 over the sorted contents of `agent.yaml`, `eval_config.yaml`, `configs/sampling.yaml`, every `prompts/*.md` and every `sub_agents/*.yaml`. Compute it with a 10-line script so it is never a manual discipline problem.

## §3.6 Statistics — honest expectations for small n

### §3.6.1 Use paired tests, because the tasks are the same

Every rung runs the same task list, so outcomes are paired. **McNemar's test** on discordant pairs is the right tool, not a two-proportion z-test. For continuous metrics (turns, tokens), use a **paired bootstrap** with 10,000 resamples.

### §3.6.2 What you can and cannot detect

Be realistic before you design the experiment, or you will spend the paper chasing noise:

- At n=54 (`dev-full`) with a base rate near 10 %, a rung must roughly **double** the resolved count before McNemar approaches significance. Differences of 1–2 tasks are **noise**.
- At n=45 (`heldout`) the same holds. You will likely end with **one or two** statistically defensible comparisons, not eight.
- Therefore: **run the ladder to generate hypotheses cheaply on `dev-fast`, then make exactly 2–3 confirmatory claims on held-out.** Everything else goes in the results table as exploratory, clearly labelled.

### §3.6.3 Reporting rules

- **Wilson score intervals** for every single proportion. The normal approximation is bad at these base rates and small n; Wilson is not.
- **Bootstrap CIs (10,000 resamples, task-level)** for deltas between adjacent rungs. Report the interval, not just a p-value.
- **Per-repo breakdown always.** Aggregate pass rate hides that your whole result is fastapi.
- **Multiple comparisons.** With 9 rungs you will get a nominal p < 0.05 by chance alone. State the number of comparisons and either correct (Holm) or restrict claims to the pre-registered confirmatory set. Pre-register it in Sprint 4, before you see the numbers.

### §3.6.4 Noise floor — do this in Sprint 4

Before any rung-comparison claim, run the *same* config twice on the same split. The difference between those two runs is your noise floor. If it is 6 pp, you cannot claim a 5 pp win. Costs one run, saves you from writing a false paper.

### §3.6.5 Pre-registration (do this in Sprint 4, ~20 min)

Write down, in `experiments/confirmatory_plan.md`:

- the 2–3 claims you intend to make on held-out,
- the metric and split each is tested on,
- the test used and the correction applied,
- what result would falsify each claim.

Doing this after seeing held-out results converts a confirmatory test into an exploratory one, and the difference is visible to a reviewer who asks.

## §3.7 A useful negative-result framing

Three of the findings in §0 are **negative results about the provided assets**:

1. `search_similar_code` cannot accept natural language and the embeddings are near-degenerate (F1, F2).
2. Graph nodes carry no file or line information, so graphs localize *neighbourhoods*, not *lines*.
3. 96 % of issues never name a file and hints are always empty (F3).

These are not failures of your agent — they are properties of a dataset that ~830 teams are building against. Quantifying them carefully and reporting the resulting design is a legitimate, useful, falsifiable contribution, and the Paper Track explicitly invites work on **Code Comprehension** and **Graph Reasoning**. **Do not claim novelty before the prior-art review in §5.5** — but do not bury these either. They are the most defensible thing you have found so far.

## §3.8 Claims audit (Sprint 6, non-negotiable)

The earlier plan's draft contained a results table built from illustrative numbers. That is the failure mode this procedure exists to prevent.

**Procedure.** For every sentence in the paper containing a digit:

1. Identify the number.
2. Find its receipt ID, or show the arithmetic from receipted values (mark it `[D]` with the formula shown).
3. If neither exists → **delete the number**, or reword to a qualitative claim ("substantially fewer tool calls").
4. Tag every remaining claim `[M]`, `[D]`, or `[I]` (illustrative). Illustrative numbers may appear only inside an explicitly labelled example.

**Additionally banned in the paper:**

- Pass rates or turn counts projected rather than measured.
- Any task ID that does not exist in `tasks.jsonl`. (The earlier draft's `httpx_6821` does not exist; there is exactly one httpx task in the set. Verify every ID against the file.)
- "Consistently outperforms" / "regardless of the underlying model" — you have one model.
- Causal language for a single observational comparison.
- "We invented graph-first navigation" / "We invented the four-phase loop" — both are prior art.

**Receipt ledger.** Keep `experiments/receipts.jsonl` (one receipt per line) and paste the audit's completion state into the paper's reproducibility section. A reviewer should be able to go from any number in the results table to a receipt to a git commit to a raw trace file.

---

# §4 — Six-Sprint Roadmap & Task Checklist

## §4.0 Global rules that apply every sprint

- Every run produces a receipt (§3.5) before the sprint ends.
- `splits/heldout.txt` is never edited after Sprint 1. The `PreToolUse` hook enforces it.
- No number enters any document without a receipt ID.
- Stop a variant immediately if `no_patch_rate` rises or the per-task budget is exceeded — those are the two failure modes that destroy a run, and neither is recoverable by averaging.
- **Honour the exit gate.** If it is not met by Sunday night, take the sprint's **cut path** rather than sliding into the next sprint carrying debt.

## §4.1 Sprint 1 — Harness truth & baseline

**Sep 29 (Tue) → Oct 5 (Sun) · ~18 h**

**Theme.** Find out what is actually true before designing against assumptions. Everything after this sprint depends on a working local harness and a measured A0.

### Day 1 — Tue Sep 29 · (3 h)
- [ ] **Accept the competition rules on Kaggle.** Entry deadline is Nov 25; this is a legal step only you can take. *(Do it now so it is never a risk.)*
- [ ] **Sign up for the Paper Track** — it is a separate competition, and the Overview explicitly says so.
- [ ] Create the working repo `bcf-brain/`, `git init`, add `.gitignore` for model weights, snapshots, `results/`.
- [ ] Read §0 and §1 in full. Note the five findings and the ten corrections.
- [ ] Extract the data package: `sample_submission/`, `docker/`, `sandbox/`, `tasks.jsonl`, and **one** snapshot (`snapshots/httpx_*.tgz`, the smallest repo) — do not unpack all 22 GB.
- [ ] Run `scripts/profile_tasks.py` and `scripts/profile_gold_patches.py` and read the output.

### Day 2 — Wed Sep 30 · (4 h)
- [ ] Get `swegemma` + `adk-submission` + `adk-eval-core` importable locally. Follow the wheelhouse approach in the official getting-started notebook; the competition wheels ship as a Kaggle dataset if the PyPI route is incomplete.
- [ ] Serve `gemma-4-31b-it-qat-w4a16-ct` locally. It is INT4 (~16–18 GB) and fits a 32 GB 5090 at `tp=1`. Set `tool_call_parser='gemma4'`, `reasoning_parser='gemma4'`, `max_model_len=32768`, `enable_auto_tool_choice=True`.
- [ ] Smoke test: one chat completion, then one **forced tool call** (`get_status`). If the tool call does not parse, nothing else matters — stop and fix this.

### Day 3 — Thu Oct 1 · (3 h)
- [ ] Run the harness with `--task-id <the single httpx task>` against unmodified `sample_submission/`.
- [ ] Confirm the artifact tree appears: `summary.json`, `task_results.jsonl`, `patches/`, `traces/`, `logs/`.
- [ ] **Time three things separately:** container setup, agent session, Phase 2 verification. Setup and verification are excluded from the agent budget but the first is *inside* the 12 h cap. You need real numbers to set the budget in Sprint 4.

### Day 4 — Fri Oct 2 · (3 h)
- [ ] **Build the splits.** Write `scripts/make_splits.py` (stratified by repo, seed 20260929, per §3.2.2). Emit the four `.txt` files + `manifest.json` with SHA-256. **Commit.**
- [ ] Add the `PreToolUse` hook blocking edits to `splits/heldout.txt` and `splits/manifest.json`.
- [ ] Compute `config_hash` tooling (10 lines).

### Day 5–6 — Sat/Sun Oct 3–4 · (5 h)
- [ ] **Run A0 on `dev-fast` (15 tasks).** Expect ~50 min. Let it run unattended.
- [ ] Post the four organizer questions from §5.2 to the competition forum. **Q1 (sequential vs concurrent) is the one that matters.**
- [ ] While A0 runs: write `experiments/confirmatory_plan.md` skeleton, and the per-task failure taxonomy codebook draft (labels: `wrong_file_localized`, `no_patch`, `budget_exhausted`, `patch_malformed`, `test_misread`, `loop`, `other`).

### Day 7 — Mon Oct 5 · (2 h)
- [ ] Analyse A0: resolution rate, `no_patch_rate`, tool calls p50/p95, budget exhaustion.
- [ ] Commit the receipt.
- [ ] **Reconcile against the organizer notebook:** they got `patch_chars=0` on 2/2. If your A0 is materially different, find out why before proceeding — a difference means your local setup diverges from theirs in a way that invalidates your measurements.

### 🚪 Exit gate

> **Do you have a reproducible A0 number on 15 dev tasks, with a committed receipt, frozen splits, and a working local harness?**

- **NO** → **cut path:** drop the GraphRAG and scout work entirely and spend the week on harness bring-up. Everything in Sprints 2–5 is worthless without a harness. Escalate to the competition forum/support.
- **YES** → proceed. Write the actual number in your journal. This is the first real number in the project and it is the baseline every claim is measured against.

## §4.2 Sprint 2 — The localization brain + offline retrieval protocol

**Oct 6 → Oct 12 · ~18 h**

**Theme.** Attack the actual bottleneck. Localization is the task. The offline retrieval benchmark (§2.3.4) de-risks the entire brain thread before any agent run.

### Day 1 — Tue Oct 6 · (3 h)
- [ ] **Build the offline retrieval benchmark first.** Implement arms A, B, C, D, Hybrid per §2.3.4. Compute Recall@1/5/10 on all 129 tasks. This is a pure-Python script; costs no GPU time.
- [ ] **Encoder-identification experiment** (§2.3.4 last paragraph). Under one hour; if it lands, the whole retrieval loop becomes sub-second.

### Day 2 — Wed Oct 7 · (3 h)
- [ ] **Read the result.** Per-arm Recall@5 table; LORO delta; per-repo breakdown.
- [ ] **Go/no-go on the brain v1.** Ship only if Hybrid beats BM25-alone by ≥15 pp on Recall@5 in-repo *and* holds in LORO (§2.3.4). Write the decision down.
- [ ] Copy `sample_submission/` → `bcf-brain/` as your working submission. Keep A0 pristine in `variants/A0_starter/` for reference.

### Day 3 — Wed Oct 8 · (3 h)
- [ ] Write `skills/bcf-localize/scripts/seed_scan.sh`: a single grep that takes 2–3 candidate symbols and returns ranked hits, excluding `.git/`.
- [ ] Hand-test `seed_scan.sh` against 5 real dev tasks offline. **You are testing the script, not the model** — this costs no GPU time.
- [ ] **Answer the edge-type case question empirically:** call `get_code_neighbors("x", edge_type="calls")` and `edge_type="CALLS"` on a dev task. The data contains lowercase `calls`; the README's examples are uppercase. Record which works.

### Day 4 — Thu Oct 9 · (3 h)
- [ ] Verify `[U] graph-tools-on-hidden`: confirm graph and embedding files exist for your dev repos and that the tools are attached when they do.
- [ ] Establish the symbol-naming convention: file path `fastapi/routing.py` + def `_prepare_response_content` → `fastapi.routing._prepare_response_content`. Write it into the skill as a worked example.

### Day 5–6 — Sat/Sun Oct 10–11 · (5 h)
- [ ] **Write `prompts/localize.md`** — the seed→expand→read protocol from §2.3, including the structural escape hatch for vague statements.
- [ ] Rewrite `prompts/system.md`: budget schedule table, insurance-edit rule, scratch-files-to-`/tmp` rule, symbol-not-sentence rule. **Keep the starter's hard-won lines** (never touch tests, never bare pytest, `docs_src/`).
- [ ] Wire `agent.yaml` to attach the scout (read-only, `skip_summarization: true`) and the `bcf-localize` skill.

### Day 7 — Mon Oct 12 · (2 h)
- [ ] **Rung A1** (prompt only) on `dev-fast`. ~50 min.
- [ ] **Rung A2** (+ seed→expand protocol, no graph) on `dev-fast`. ~50 min.
- [ ] Compare A0 / A1 / A2 with Wilson CIs. Promote the winner to `dev-full` per §3.3.1.
- [ ] Commit receipts. **Update the failure taxonomy with what you actually saw** — your Sprint 1 draft will be partly wrong.

### 🚪 Exit gate

> **Does the seed→expand→read protocol beat open-ended search on the same 15 tasks — measured, with a receipt — AND does the offline retrieval benchmark show Hybrid ≥ BM25-alone by ≥15 pp on Recall@5 in-repo?**

- **NO (search protocol)** → **cut path:** fall back to a pure-grep protocol with heavier prompt guidance, and re-run A1. Localization is still the bottleneck; do not skip it, but do not keep a protocol that does not pay.
- **NO (retrieval benchmark)** → **cut path:** simplify the brain to lexical-only (BM25 + symbol-resolve); drive the paper on budget discipline + instrumentation instead. Brain v1 does not ship.
- **YES** → proceed to graph expansion (A2b) in Sprint 3.

## §4.3 Sprint 3 — Patch discipline & the insurance edit

**Oct 13 → Oct 19 · ~18 h**

**Theme.** Convert attempts into scored outcomes. F5: the starter produced `patch_chars=0` on 2/2 tasks — an empty patch is a guaranteed zero, and a wrong patch is only a near-certain zero.

### Day 1 — Tue Oct 13 · (3 h)
- [ ] Write `skills/bcf-verify/scripts/verify.py` — the gate runner from §2.7. Start with G6 (not empty), G3 (parses), G1 (scope). ~60 lines of stdlib.
- [ ] Add `--allowed` so the script compares `git diff --name-only` against `spec.scope`.

### Day 2 — Wed Oct 14 · (3 h)
- [ ] Add G2 (patch applies) and G5 (no regression on previously-passing tests in touched modules). G5 needs a recorded prior-green run — decide how the agent supplies it and make it cheap.
- [ ] Test `verify.py` offline against 3 dev workspaces. No GPU needed.

### Day 3–4 — Thu/Fri Oct 15–16 · (6 h)
- [ ] **Rung A2b** (+ `get_code_neighbors` / `get_code_subgraph`) on `dev-fast`.
- [ ] **Rung A2c** (`search_similar_code` suppressed vs attached-and-free) on `dev-fast`. This is the experiment that tests F1 at the outcome level, and it is a genuinely publishable result either way.

### Day 5–6 — Sat/Sun Oct 17–18 · (5 h)
- [ ] **Rung A4** (+ `bcf-verify` gates) on `dev-fast`.
- [ ] Add the insurance-edit rule to `system.md` and the budget schedule with explicit phase percentages.
- [ ] Write the rescue state machine `skills/bcf-rescue/references/state-machine.md`: trip conditions (2 consecutive failed validations · 3 identical tool calls · 25 % budget with no edit), R1 intake → R2 minimum baseline → R3 induction, cap 2 rounds, **immediate revert on regression**.

### Day 7 — Mon Oct 19 · (2 h)
- [ ] Analyse A2b / A2c / A4. Confirm `no_patch_rate == 0` on `dev-fast`.
- [ ] Commit receipts and the current best configuration. Tag it: `dev-best-<date>`.

### 🚪 Exit gate

> **Is `no_patch_rate` zero on `dev-fast`, and is at least one task resolved?**

- **NO** (nothing resolved yet) → **cut path:** the gates are the priority, not the graph work. Re-run A1 with a much more prescriptive system prompt — literally a numbered procedure with an explicit "make an edit by turn 8" instruction. A small model needs to be *told* the schedule, not trusted to plan one.
- **YES** → proceed to budget tuning and the full ladder.

## §4.4 Sprint 4 — Budget governor & the ablation ladder

**Oct 20 → Oct 26 · ~18 h**

**Theme.** Tune the budget against measurement, then run the ladder properly. This is where the project either produces a defensible result or runs out of time.

### Day 1 — Tue Oct 20 · (3 h)
- [ ] **Set `eval_config.yaml` from your Sprint 1 measurements** (§2.6.1). If measured setup overhead ≠ 16 s, recompute: `agent_minutes = (360 − setup_s) / 60 − margin`. Write the arithmetic into the receipt.
- [ ] Re-run the current best config at the new budget on `dev-fast`. Confirm the rate did not degrade.

### Day 2 — Wed Oct 21 · (3 h)
- [ ] **Noise floor run** (§3.6.4): identical config twice on the same split. Record the delta.
- [ ] Write `experiments/confirmatory_plan.md` — the 2–3 claims you will test on held-out, the metric, the test, the correction, and the falsification condition. **Do this before you see held-out numbers.**
- [ ] Build the results table generator: reads `task_results.jsonl` + traces, emits the metric table from §3.4. Every figure in the paper comes from this script.

### Day 3–5 — Thu–Sat Oct 22–24 · (9 h, mostly unattended)
- [ ] **Full ladder on `dev-fast`**, 3 seeds where the sampler is stochastic (temperature 0.2, so seeds are not free): A0, A1, A2, A2b, A2c, A3, A3b, A4.
- [ ] Use overnight/AFK runs. The 5090 is otherwise idle.
- [ ] **Rung A3/A3b** (scout with/without summarization) is the structured-handoff experiment — run it, and let the result decide whether the scout ships at all.

### Day 6 — Sun Oct 25 · (3 h)
- [ ] Promote the top 2–3 rungs to `dev-full` (54 tasks, ~3.6 h each). Run unattended.
- [ ] Begin **rung A5** (rescue) only after A4 is confirmed — rescue on top of an unvalidated core just adds variables.

### Day 7 — Mon Oct 26 · (2 h)
- [ ] Analysis with Wilson + bootstrap CIs. Build the failure taxonomy from traces.
- [ ] **Go/no-go on LoRA (`[U]`), written down with evidence.** Go only if failures are *model-limited* (the agent knows what to change but produces the wrong code) rather than *protocol-limited* (it cannot find the file or runs out of budget). The taxonomy tells you which. If protocol-limited, LoRA will not help — spend the time on localization instead.

### 🚪 Exit gate

> **Do you have a full A0–A4 ladder on dev with 3 seeds, CIs, a quantified noise floor, and a written LoRA go/no-go?**

- **NO** → **cut path:** drop A3b, drop the 3rd seed, drop A5. Get A0–A2b + A4 measured and defended. Two clean claims beat seven shaky ones.
- **YES** → proceed to the frozen held-out run.

## §4.5 Sprint 5 — Frozen held-out & the go/no-go

**Oct 27 → Nov 2 · ~18 h**

**Theme.** One honest measurement, then lock everything. No configuration changes after this sprint.

### Day 1 — Tue Oct 27 · (3 h)
- [ ] Freeze the config. Tag the commit: `paper-candidate-2026-11-02`. **`config_hash` recorded.**
- [ ] Write the held-out run plan: which rungs, how many seeds, what you will claim.

### Day 2–3 — Wed/Thu Oct 28–29 · (7 h, unattended)
- [ ] **Run the confirmatory rungs on `heldout` (45 tasks).** Exactly the rungs in the pre-registration. No peeking at per-task results; aggregate only.
- [ ] This is the single most important run of the project. Budget ~3 h per rung unattended.

### Day 4 — Fri Oct 30 · (3 h)
- [ ] Analyse: resolution rate with Wilson CI, per-repo breakdown, deltas with bootstrap CIs, McNemar on the pre-registered comparisons.
- [ ] If A6 (LoRA) was a GO, train and evaluate it now, with **leave-one-repo-out** — the hidden set is private repos and a LoRA fit to four public repos may simply memorise them. If it does not beat the best non-adapter config on held-out, **it does not ship.** Say so in the paper.

### Day 5 — Sat Oct 31 · (3 h)
- [ ] Freeze the final submission configuration.
- [ ] **Clean-room rebuild:** package `submission.zip` from a fresh clone and confirm it compiles under `adk-submission`. Verify size < 3 GiB and that every extension is in the allowed set.

### Day 6–7 — Sun/Mon Nov 1–2 · (2 h)
- [ ] Draft the paper skeleton with **real numbers only**. Sections per §1.9 and the prior-art plan in §5.5.
- [ ] Run the first claims audit pass (§3.8). Expect to delete a number or two. That is the procedure working.

### 🚪 Exit gate

> **Do you have held-out results on a tagged commit, a LoRA decision with evidence, and a paper draft whose every number has a receipt?**

- **NO** → **cut path:** drop the paper's ambition to an honest short report: the three negative results about the provided assets (§3.7) plus one confirmed scaffold result. That is a publishable, defensible paper and it is far better than one with unfalsifiable claims. **The Paper Track is optional; entering the main track is not.** Protect the main-track submission first.
- **YES** → Sprint 6 is writing and packaging only.

## §4.6 Sprint 6 — Write-up, claims audit & package

**Nov 3 → Nov 8 · ~18 h**

**Theme.** No new experiments. Everything here is making existing evidence defensible.

### Day 1 — Tue Nov 3 · (3 h)
- [ ] Complete the paper: abstract → problem & setting → method → protocol → results (ablation ladder, per-repo, efficiency, retrieval benchmark, generalization) → failure taxonomy → limitations → related work → reproducibility.
- [ ] **Limitations must state, in your own words:** n is small; the four training repos are public and may be partly memorised by the base model; the hidden set is private repos; the gates are advisory not enforced; the budget assumes a sequential harness; local hardware differs from the eval host.

### Day 2 — Wed Nov 4 · (3 h)
- [ ] Related work with real citations. **Do not claim novelty for graph-first navigation or four-phase loops** — prior art exists. Claim novelty only for what your ablations actually show.

### Day 3 — Thu Nov 5 · (3 h)
- [ ] **Final claims audit.** Every digit traced to a receipt or a shown derivation. Banned-claims sweep (§3.8). Verify every task ID exists in `tasks.jsonl`.
- [ ] Publish the reproducibility resource: configs, `bcf-spec.schema.json`, the `verify.py` gate runner, `scripts/` (profile + retrieval + splits + results), splits (dev only — **not** the held-out IDs if that would compromise your own final evaluation), receipts, and the results-table generator.

### Day 4 — Fri Nov 6 · (3 h)
- [ ] Independent read-through — hand the draft to someone (or re-read it cold after 24 h). Check: does every claim have support; does the reader hit a number they cannot trace; does the framing overstate the gates?
- [ ] Check the Paper Track format requirements **directly on the Kaggle Paper Track page** (`[U]` — the page was not in your captured docs, so the exact criteria names, weighting and length cap are still in §1.9 with verbatim text from the discussion).

### Day 5–6 — Sat/Sun Nov 7–8 · (3 h)
- [ ] Final packaging rehearsal. Package from scratch, confirm it builds and evaluates.
- [ ] Confirm the Paper Track signup (it is a **separate** competition — you must sign up for it, and the Overview explicitly says so).

### 🚪 Exit gate

> **Can a reader trace every number in the paper to a receipt, a git commit, and a raw trace file — and does `submission.zip` build from a clean clone?**

- **NO** → **cut path:** submit the paper with fewer claims. A short, fully-audited paper beats a long, partly-audited one, and an unaudited number is a credibility risk that outranks the points it might win.
- **YES** → **Buffer Nov 9–11: submit the paper by Nov 10.** Keep Nov 11 for emergency fixes only.

## §4.7 After the paper — main track to Dec 2

The paper describes the **tagged** configuration. Keep improving the main-track agent on a separate branch and say so if the final submission differs from what the paper describes.

- [ ] **By Nov 25:** confirm entry and team status (max team 5; mergers must be complete by this date). *If you solo, this is a formality — but confirm it.*
- [ ] **Nov 26–28:** continue improvements on a separate branch. Re-test only on `dev`.
- [ ] **Nov 29–30:** final full-length timing run against the 12 h cap using the exact submission package. Confirm no task is truncated and no task ends with a clean tree.
- [ ] **By Nov 30** (two days early): submit. Remember **one submission per day** and **two final submissions** — reserve the second for your best-measured configuration.

## §4.8 Consolidated risk-to-sprint map

| Risk | Where it is caught | Where it is mitigated |
| --- | --- | --- |
| Local harness never works | Sprint 1 gate | Sprint 1 cut path; escalate early |
| 12 h is sequential at ~6 min/task | Sprint 1 forum question | Sprint 4 budget sizing |
| Graph tools absent on hidden repos (`[U]`) | Sprint 2 Day 4 | Pure-grep fallback already in A2 |
| `search_similar_code` is a dead end | Sprints 1 + 3 (A2c) | Suppressed by default in §2.3.3 |
| Empty patches (the observed failure) | Sprint 3 gate | Insurance-edit rule + budget schedule |
| Overfitting 129 public tasks | Frozen held-out + per-repo reporting | Limitations section |
| LoRA fits the four public repos | Sprint 4 go/no-go + Sprint 5 LORO | Ship only if it beats non-adapter on held-out |
| Untraceable numbers in the paper | Sprint 5 + Sprint 6 audits | Cut path: fewer claims |
| Solo bandwidth | Every sprint gate | Cut paths; AFK overnight runs |

## §4.9 The cut order, if you fall behind

Cut in this sequence. Never cut items 1–3.

1. **A6 (LoRA)** — highest cost, most likely to be null, and the paper is stronger without a null result than with an unreproducible one.
2. **A3b** (full-trace handoff arm) — interesting, not load-bearing.
3. **A5 (rescue mode)** — only pays on tasks already failing.
4. **The 3rd seed** — keep 2, drop 1, and report the reduced n honestly.
5. **The scout sub-agent** if A3 does not beat inline search — one-line deletion.

**Never cut:** the A0 baseline, the frozen held-out split, the ablation ladder's core rungs (A1, A2, A4), or the claims audit. A result you cannot defend is worth less than a smaller result you can.

---

# §5 — Risks, unknowns, prior art & paper-track strategy

## §5.1 Risk register (R1–R12)

Each row names a risk, a leading indicator that fires before it becomes fatal, the sprint where it is caught, and the fallback.

| # | Risk | Leading indicator | Sprint | Fallback |
| --- | --- | --- | --- | --- |
| R1 | Local harness never works on the 5090 | `vllm` OOM or tool-call parser returns prose | S1 | Replicate the notebook's 4×L4 setup via cloud GPU; the protocol logic does not depend on local |
| R2 | 12 h is sequential; budget per task is not 6 min | `tasks` array in `eval_config.yaml` is single-entry | S1 | Engineer a parallel harness locally; report sequential budgets; design for sequential anyway |
| R3 | Graph tools are absent on the hidden repos | Empty graph JSON for hidden tasks | S2 | Pure-grep A2 fallback is already wired; A2 ≥ A1 will be the result either way |
| R4 | `search_similar_code` is a dead end | Recall@5 ≈ 0 on dev gold | S2 | Already suppressed by default in §2.3.3; this is the empirical paper finding |
| R5 | Empty patches are the dominant failure | `no_patch_rate` > 0 on dev-fast | S3 | Insurance-edit rule + budget schedule + gate; the failure is forced to a small concrete edit |
| R6 | LoRA fits the four training repos | LORO result ≈ held-out result | S4–S5 | Adapter does not ship; the paper claims the protocol, not the weights |
| R7 | Hidden set is different in kind, not degree | Held-out repo distribution ≠ hidden | S5 | Limitations section says so; the brain is per-repo, not per-corpus |
| R8 | The harness compacts events; agent loses state | Critical decision absent from trace | S3 | Durable state already lives in `/tmp/journal.md` and is re-read every turn |
| R9 | Scratch leaks into the diff | `git diff` lists a journal/spec | S3 | Gate refuses to submit; path moves to `/tmp` only |
| R10 | Paper claim cannot be traced to a receipt | Audit finds an orphan number | S6 | Cut path: delete the number, not the audit |
| R11 | Solo bandwidth exhausts at Sprint 4 | Two consecutive sprints over 22 h | S4 | Drop A5 + the 3rd seed; tighten scope to A0–A4 |
| R12 | Submission packaging fails on rebuild | `adk-submission` rejects the zip | S5–S6 | Re-read `HARNESS_README.md`; use the organizer notebook's `subprocess` smoke test before submit |

## §5.2 Organizer questions to file in the competition forum

The Kaggle discussion is the appropriate channel. These are the questions that, unanswered, leave the design exposed. File early — answer time is unpredictable.

**Q1. Hidden-set infrastructure.** *Will the hidden `search_similar_code` / `get_code_neighbors` / `get_code_subgraph` tools be present on the hidden repos, with the same API and the same `.npz` assets? If not, what replaces them — BM25 over source, raw grep, or nothing?* This decides whether A2 is a portfolio candidate or a vestigial arm.

**Q2. Task parallelism.** *In `HARNESS_README.md`, is `eval_config.yaml`'s task array processed sequentially or concurrently? If concurrent, what is the effective per-task budget when N tasks run in parallel inside the 12 h global cap?* Determines the budget schedule in §2.6.

**Q3. Per-task scorer budget fields.** *Which fields under `eval_config.yaml` does the scorer honor vs ignore? The notebook's defaults of 100 tool calls / 60 min are explicitly labelled fallbacks. Is the public scoring environment using those defaults, or a smaller published cap?* The local run can pick a sensible cap either way, but the paper needs to report what the eval host used.

**Q4. Patch scoring on a "resolved-but-failing" task.** *When the agent produces a non-empty diff that does not fix the issue, is the score exactly 0, partial (e.g. passing visible tests), or scored against the gold test_patch independently?* Affects the no_patch_rate denominator — the right gate vs the wrong gate may both end at zero, but only one was due to the gate.

## §5.3 UNKNOWN register (U1–U10)

Things the prompt will *not* pretend to know. Mark every fact in the paper that depends on a `[U]` and either resolve it, falsify it, or report it as a limitation.

| # | Unknown | Where it bites | What to do |
| --- | --- | --- | --- |
| U1 | Graph tools exist on hidden repos | A2 arms | Falsify in Sprint 2 forum post (Q1) |
| U2 | Harness is sequential vs concurrent | Budget schedule | Falsify in Q2; design for sequential |
| U3 | Which `eval_config.yaml` fields the scorer reads | Reported numbers | Read `HARNESS_README.md` literally; report what was set |
| U4 | Hidden repo distribution (counts per language / domain) | Generalizability | Limitations section |
| U5 | Exact Paper Track criterion weights | Abstract framing | Read the Paper Track page the day you write the abstract |
| U6 | Whether `NO_PATCH` counts as resolved if visible tests pass | Resolution denominator | Inspect `score_patch` in `HARNESS_README.md` |
| U7 | Whether the LORO LoRA result will replicate at the held-out scale | LoRA ship decision | Sprint 5 LORO pre-registration |
| U8 | Whether organizers will accept an attached Kaggle resource (spec schema + ledger + cards) | Reproducibility | Q5 to organizers; default = no resource |
| U9 | Whether `/tmp` survives between tool calls | Journal mechanics | Read the README; the agent already keeps the journal in /tmp |
| U10 | Whether `search_similar_code` requires a node id or accepts text on the eval host | A2c arm | Reproduce on local first; if text works, A2c is meaningful |

## §5.4 Prior-art review — and what to claim

A claim the literature already makes is worse than no claim. The paper must distinguish **what we did** from **what was already known**, with citations.

- **SWE-agent** (Yang et al., 2024). Established the agent + custom tool-calling + terminal-based loop for SWE-bench. A 31B agent is not a contribution *per se*; the protocol is.
- **Aider**. Established conversational pair-programming with diff-aware edits and a repo map; the `architect` mode already does repo-aware context assembly. Cite, do not re-derive.
- **Agentless** (Xia, Deng, 2024). Established the *localize → edit → test* pipeline without an interactive agent. The four-phase loop is prior art. Cite, do not claim.
- **AutoCodeRover / CodexGraph** (Zhang et al., 2024). Established graph-augmented localization on SWE-bench-like tasks. Graph navigation is prior art.
- **GraphRAG** (Microsoft, 2024). Established retrieval-augmented generation over graph-structured repositories. The retrieval framing is prior art.
- **DSPy** / **TextGrad** style optimisers. Prompt optimisation loops are well known.

**What is genuinely original here** (and must be defended with the ablations):

1. The empirical finding that the supplied `.npz` embeddings are near-degenerate on the public repos, with a recall@5 measurement that explicitly justifies *not* trusting `search_similar_code` as the primary signal.
2. The frozen-split, McNemar-paired, Wilson-CI + bootstrap-CI ablation protocol executed inside a 12-hour eval budget on a small model.
3. The **provisional-spec gate** that treats the spec as a *revisable hypothesis* until edits validate — and the accompanying structured-handoff pattern between a read-only scout and an edit-capable coder.
4. The **operational test** that `no_patch_rate` is the right metric to monitor (an empty diff is a guaranteed zero even before wrong content is scored), with a measured evidence-driven edit-by-turn-8 insurance rule.
5. *(If it survives the LORO test)* the repo-agnostic mechanism cards as a shipped GraphRAG artefact that survives a leave-one-repo-out audit.

None of these is a generic claim about graph navigation. All five are answerable from the receipts. Anything that is *not* on this list does not go in the contributions section.

## §5.5 Paper-track strategy — Option A / Option B pivot

The Paper Track has **two viable framings**, both defensible, both small enough to fit the 3,000-word cap. Pick one early — Sprint 3 — so the ablation table is shaped to support it.

### Option A — *The protocol is the contribution*

Headline: *An evidence-driven 31B agent that uses the supplied graph tools as a weak prior, on tasks where naive navigation is a dead end.*

**Required evidence.** Recall table on dev gold, A2 vs A1 ladder, no_patch_rate with the insurance-edit rule, frozen held-out resolution with CI.

**Risk.** Reviewer may call the four-phase loop derivative of Agentless.

**Defence.** Novelty is not the loop; novelty is the *measured protocol* that says *lead with identifiers from the issue; expand via neighbours; treat embeddings as a weak prior* and the ablation that proves it. Cite Agentless, AutoCodeRover, GraphRAG in related work.

### Option B — *The negative finding is the contribution*

Headline: *What the supplied Gemma-4 code-graph assets actually buy you, measured.*

**Required evidence.** Recall@5/10 table, one-hop neighbour recovery, near-1.0 similarity observation, the A2c (search_similar_code suppressed) ablation on dev. Possibly a LORO cards result.

**Risk.** A negative-only paper can read as "nothing worked." The defence is the second half: *this is what works* (spec-first, gates, insurance edit, scout pattern).

**Defence.** Negative results that save the community time are publishable. Three of the five findings (F1, F2, F3) are *negative*. Frame the paper as "here is what we measured; here is what to build instead."

### Recommendation

**Default to Option B**, with Option A as the embedded positive half. The negative findings are the most distinctive thing this project will produce — no other competitor is positioned to say them as cleanly, because no other competitor has the recall table or the LORO test. The paper writes itself from the receipts.

**Switch to Option A only if:** the A2 arm beats A1 by ≥ 5 pp on dev with non-overlapping CI, AND the LORO cards result is positive. Without those, "the protocol works" is a thin claim.

---

# §6 — Reference appendices

## §6.1 The 9 sandbox tools

Source: `HARNESS_README.md` shipped inside the dataset, plus the organizer notebook (Ryan Holbrook, "Getting started — Gemma 4 Developer Agent"). Tags: `[V]` verified by direct quote in the highest-scoring source dossier; `[U]` not directly confirmed in the captured docs.

| Tool | Signature (representative) | Cost | Use |
| --- | --- | --- | --- |
| `run_command(cmd, timeout?)` | `str` | Debits budget | Run shell commands in `/workspace`. The single most-used tool. |
| `submit_patch(message?)` | `str` | **Free** | Runs `git add -N .` then `git diff HEAD` in `/workspace`. Ends the session. |
| `get_status()` | — | Free | Remaining wall-clock, tool-call counts, current diff stat. |
| `read_file(path, start?, end?)` | `str, int?, int?` | Debits | Bounded file read. **No whole-file slurp on large files.** |
| `edit_file(path, old, new)` | `str, str, str` | Debits | Exact-string replace. Fails on non-unique `old`. |
| `write_file(path, content)` | `str, str` | Debits | Whole-file write. Use sparingly; `edit_file` is safer. |
| `get_code_neighbors(node_id, depth?)` | `str, int?` | Debits | One-hop (or N-hop) neighbourhood from a node id. `[U]` exact API. |
| `search_similar_code(query, k=10)` | `str, int` | Debits | Embedding nearest-neighbour over the supplied `.npz`. Returns empty for natural-language English `[V]`. |
| `get_code_subgraph(node_ids)` | `list[str]` | Debits | Pull subgraph JSON. Use after `get_code_neighbors` to bound a context packet. |

**Operating rules.**
- Never invent a 10th tool. If a need shows up that no tool covers, the response is "do not do that thing."
- `read_file` should be bounded by default — full reads of large files blow the context window.
- `edit_file` failures must be retried with more context, not with `write_file` overrides.
- `search_similar_code` is passed *symbols* not sentences (F1).
- `get_status()` is called on a fixed cadence (e.g. once per turn) so the budget schedule (§2.6) can react.

## §6.2 Budget defaults — the conservative starter

These are the *local* defaults the design assumes until the harness proves otherwise. They are derived from the global cap arithmetic, not from the notebook demo's one-minute cap.

| Field | Default | Why |
| --- | --- | --- |
| Global wall-clock | 12 h | Mandated `[V]` |
| Per-task setup overhead (measured in Sprint 1) | ~16 s | M31 candidate estimate, set in §2.6.1 |
| Per-task agent budget | ~344 s | `360 − 16` |
| Per-task tool-call cap | ~20 calls | `344 / ~17 s per call` — a hard floor below the notebook's 100 default |
| Per-task command timeout | ~30 s | The notebook's 60 s is too long when commands can stack |
| Insurance-edit floor | 60 % of per-task budget | Forces a concrete edit before the model wanders |
| Sub-agent overhead | 1 call budget each | A scout's existence is justified by A3, not asserted |
| Token cap per turn | ~6 k output, ~14 k input | Below the 14,336-token compaction threshold noted in the notebook |

## §6.3 Repository layout to ship

A clean `submission.zip` layout. The agent root must contain `agent.yaml`. Everything else is in `skills/`.

```
submission/
├── agent.yaml
├── README.md
├── skills/
│   ├── bcf-spec/
│   │   ├── SKILL.md
│   │   └── references/
│   │       └── schema.json           # BCF-Spec JSON Schema 2020-12
│   ├── bcf-localize/
│   │   ├── SKILL.md
│   │   ├── references/
│   │   │   ├── seed_strategy.md      # how to extract identifiers from issue text
│   │   │   └── fallback_pure_grep.md # when graph tools are absent
│   │   └── resources/
│   │       └── (optional) cards/     # only if LORO ships them
│   ├── bcf-patch/
│   │   ├── SKILL.md
│   │   └── scripts/
│   │       └── minimal_edit.py
│   ├── bcf-verify/
│   │   ├── SKILL.md
│   │   └── scripts/
│   │       └── verify.py             # gate runner (G0–G6)
│   ├── bcf-rescue/
│   │   ├── SKILL.md
│   │   └── references/
│   │       └── state-machine.md
│   └── bcf-scout/                    # only if A3 ships
│       ├── SKILL.md
│       └── (no scripts — read-only)
└── data/                             # nothing here ships — used only locally
    ├── splits/
    │   ├── dev-fast.txt
    │   ├── dev-full.txt
    │   └── heldout.txt
    ├── ledger/
    │   └── tasks.jsonl
    ├── receipts/
    │   └── <run-id>.json
    └── traces/
        └── <run-id>/
```

**Hard rules.**
- `agent.yaml` is at the archive root. The notebook's packaging check enforces this.
- No file with an extension outside the allowed list. Common offenders: `.ipynb`, `.pkl`, `.bin`, `.pt`, `.safetensors`.
- Total archive < 3 GiB.
- The `data/` directory never ships.

## §6.4 Data-package contents (what to download once)

| Asset | Size | Notes |
| --- | --- | --- |
| Kaggle dataset (rules-gated) | 22.42 GB | Includes `HARNESS_README.md`, the four training repos, `.npz` embeddings, graph JSON, `eval_config.yaml`, `sample_submission/` |
| `gemma-4-31b-it-qat-w4a16-ct` | INT4 ~16–18 GB | The only allowed model; BF16 will not fit a 32 GB card |
| Organizer notebook output (1.4 GB image, ~12 MB notebook) | — | Reference traces, not authoritative numbers |

**Do not** redistribute any of the above to people who have not accepted the rules. The Paper Track attachment warning in §4.6 applies.

## §6.5 Deadlines (all 23:59 UTC, `[V]`)

| Date | Item |
| --- | --- |
| 2026-09-29 | Project kickoff |
| 2026-10-19 | Sprint 3 close — patch discipline must be in place |
| 2026-11-02 | Sprint 5 close — held-out frozen, paper-candidate commit tagged |
| **2026-11-12** | **Paper Track submission deadline** (separate Kaggle signup required) |
| 2026-11-25 | Entry and team-merger deadline (max team 5; solo is fine, just confirm) |
| **2026-12-02** | **Main track final submission deadline** |

## §6.6 Reproducibility — what to publish with the paper

The Paper Track page warns that a private Kaggle resource attached to a public Writeup becomes public after the deadline. That does **not** waive the main-competition data-redistribution rules. The default is **publish only what is safe.**

**Ship, attached to the writeup if the organizer permits it:**

1. `bcf-spec.schema.json` — the BCF-Spec JSON Schema (2020-12 dialect).
2. The ledger format (one example line, fully redacted of task text).
3. The cards directory — *only* if the LORO test ships them.
4. `verify.py` — the gate runner.
5. The `scripts/` (profile, retrieval benchmark, splits, results table).
6. `eval_config.yaml` — the values you actually ran with, redacted of any auth tokens.
7. The `splits/dev-fast.txt` and `splits/dev-full.txt` — the development splits. **Do not** ship `splits/heldout.txt`; it is meant to remain untouched until the paper is tagged.

**Do not ship:**

- The dataset (rules forbid redistribution).
- The model weights.
- The held-out IDs with labels.
- The raw traces (they contain task text you are not allowed to redistribute).
- Any artifact that quotes `HARNESS_README.md` excerpts longer than necessary for understanding the protocol.

**The paper itself must include**, per the Kaggle Paper Track template:

- Title and subtitle.
- Abstract (~150 words).
- Introduction (problem, contribution, why now).
- Methods and experiments (the protocol, the splits, the budget, the statistics).
- Results (the ablation ladder with CIs, per-repo, recall table, no_patch_rate, failure taxonomy).
- Limitations (n, the four-repo memorisation risk, hidden-set uncertainty, gates advisory not enforced, sequential assumption).
- Related work (SWE-agent, Aider, Agentless, AutoCodeRover/CodexGraph, GraphRAG, prompt optimisation) — citing each rather than re-deriving.
- Reproducibility statement (what ships, what doesn't, and why).

## §6.7 Single-glance summary card

For when you cannot remember anything else:

```
THE TASK
  Build a 31B Gemma agent that resolves ~120 hidden Python issues under a 12 h global budget,
  using a frozen set of 9 sandbox tools, evaluated against private repos. Submit twice before
  Dec 2 23:59 UTC; optionally publish a Paper Track writeup by Nov 12.

THE BRAIN
  Flat agent + optional read-only scout + BCF-Spec gate + verify gates + insurance edit.
  Lead with identifiers from the issue. Treat search_similar_code as a weak prior.
  If the spec hypothesis fails, revise it. Make an edit by 60% of budget.

THE PROTOCOL
  6 sprints × ~18 h. Freeze a dev/held-out split in Sprint 1.
  Run A0 → A1 → A2 → A2b → A2c → A3 → A4 → A5 → A6 ladder.
  Pre-register confirmatory claims. Wilson CI, McNemar, bootstrap CI, LORO.

THE PAPER
  Negative findings as the headline, protocol as the positive half.
  ≤ 3000 words. Every number has a receipt.
  Option A only if A2 > A1 by ≥5 pp on dev with non-overlapping CI AND LORO ships cards.

THE CUT ORDER (if behind)
  A6 → A3b → A5 → 3rd seed → scout. Never cut A0, the split, A1/A2/A4, the audit.
```

---

*End of synthesis prompt. The §0 framing, F1–F5 findings, and three-today actions in §0, the verified facts in §1, the brain architecture in §2, the experiment protocol in §3, the six-sprint day-by-day plan in §4, the risks and paper strategy in §5, and the reference appendices in §6 together form the *ideal kickoff system prompt* for the BCF agent brain project.*

