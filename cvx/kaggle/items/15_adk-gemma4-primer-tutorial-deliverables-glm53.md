# COMBINED MARKDOWN - combine

_Generated 2026-10-01 00:05:31 | 6 files | folder: D:\stuff\docs\taylor_fv\github\rayrite.github.io\cvx\kaggle\items\combine_

## Contents

1. 01_adk-primer-tutorial-kaggle-gemma4-developer-agent.md
2. 02_adk-competition-divergence.md
3. 03_starter-submission-README.md
4. 04_starter-submission-sysprompt.md
5. 05_examples-ex-04-system-prompt.md
6. 06_examples-ex-10-what-not-to-submit.md

---

<!-- ====================================================================== -->
<!-- FILE: 01_adk-primer-tutorial-kaggle-gemma4-developer-agent.md -->
<!-- ====================================================================== -->

# Google ADK: Primer & Comprehensive Tutorial — Kaggle "Gemma 4 Developer Agent" Edition

**What this is:** a teaching document that takes a competent Python developer who has never used Google's Agent Development Kit (ADK) to the point where they can build, run, and debug a competition agent correctly — at Essentials, Intermediate, and Advanced levels — while never letting them mistake upstream ADK for the restricted dialect the competition actually executes.

**Target version (upstream ADK):** `google-adk` **2.10.0** (PyPI, uploaded 2026-09-25T19:02Z). The 1.x maintenance line's last observed release is **1.39.1** (2026-08-27). ADK Python 2.0.0 GA: 2026-05-19.

**Harness reference version:** `HARNESS_README.md` as shipped in the official competition dataset build of **2026-09-25 18:40 UTC** (MD5 `10e36e8e7c01035d7f420c3b8cd1e075`). Participant-observed harness stack (two independent reports, 2026-09-28 → 10-01): `swegemma 0.2.7` + `adk-submission 0.2.11` + `google-adk 1.36.1` + patched `vLLM 0.19.1` (wheelhouse). **The harness runs ADK 1.36.1, not 2.x** — treat every 2.x-only upstream feature as absent.

**Verified as of:** 2026-10-01, ~03:45 UTC (final recency sweep: live Kaggle discussion re-fetch, PyPI, GitHub releases, adk.dev).

**Stability warning — what goes stale first, in order:**

| Order | Item | Expected expiry |
|---|---|---|
| 1st | Host patch train: thinking-drop fix, `read_file` line-range fix, `search_similar_code` cap, LoRA sizing — all *promised* 2026-09-30 14:40–20:40 UTC, none confirmed deployed at verification time | Days |
| 2nd | Tonight's "Notebook Threw Exception" failure wave and wheelhouse version (v25 as of 2026-09-30) | Days |
| 3rd | Community-reported bug statuses (§13 hazard register) | 1–2 weeks |
| 4th | Harness README values (last changed 2026-09-25: compaction `token_threshold` 32,768 → 14,336) | Weeks |
| 5th | Upstream ADK docs/versions (weekly-ish release cadence) | Weeks |
| 6th | ADK object-model concepts (LlmAgent, workflow agents, state templating) | Months |

> **⚠️ THE ONE THING TO KNOW BEFORE READING FURTHER**
> **The competition does not run the ADK you will find at adk.dev.** It runs a sandboxed, declarative-only dialect (`adk-submission`) compiled from YAML against *closed registries*, on an ADK **1.36.1** runtime, served through vLLM with a single allowed model. Upstream Agent Config is an **experimental, Gemini-only** feature with a different `tools:` syntax, no `!include`, no `adapter:`, no `skills:`; upstream ADK 2.x has moved on to graph workflows the dialect does not have. Everything you learned from upstream docs must pass through the divergence table (§4, Appendix A, and the sidecar `adk-competition-divergence.md`) before it is safe to use here.

**Sidecars shipped with this tutorial:** `starter-submission/` (a minimal, fully commented, adapter-free submission tree), `examples/` (one file per example, badge headers), `adk-competition-divergence.md` (standalone divergence table).

**Badge legend used throughout (nothing is ever inflated):**
- **VALIDATED** — executed end-to-end in the live scoring path. *No example in this document carries this badge: this research had no Kaggle scorer or sandbox access. Any sentence implying live execution is a defect.*
- **SCHEMA-CHECKED** — structure verified against the official shipped `sample_submission/` (dataset build 2026-09-25) and/or field-by-field against `HARNESS_README.md` §2 and the upstream `AgentConfig.json` schema; **not executed**.
- **ILLUSTRATIVE** — pedagogical construction from documented rules; not executed.

---

## 1. How to use this tutorial

**Prerequisite knowledge.** You can read Python and YAML, you know what a system prompt and a tool/function call are at the API level, and you understand `git diff` well enough to know what a patch is. You do **not** need prior ADK, LangChain, or agent-framework experience. Prior ADK experience is actively *hazardous* here until you have read §2.

**The three tiers and what each unlocks:**

| Tier | Chapters | You can afterwards | Cost to get there |
|---|---|---|---|
| Essentials | §3–§5 | Ship a valid, correctly-configured, adapter-free submission and run it locally | ~1 evening |
| Intermediate | §6 | Decompose into sub-agents/AgentTools, plumb state, use workflow agents and skills deliberately | ~2–3 evenings |
| Advanced | §7–§13 | Engineer context and budgets under the 32k window, defend against the known harness defects, diagnose locally, decide whether the LoRA track is open | ~1 week of iteration |

**Routing table — find your problem:**

| If your problem is… | Go to |
|---|---|
| "What is ADK and what version matters?" | §3 |
| "I know upstream ADK — what's different here?" | §2, §4, Appendix A |
| "I need to ship *something* today" | §5 (start at 5.2), then `starter-submission/` |
| "Should I split my agent into sub-agents?" | §6.0–§6.2 |
| "How do Sequential/Parallel/Loop actually behave?" | §6.2 |
| "How do I keep the context window from exploding?" | §7.3 |
| "A tool result looks like a wall of backslashes" | §7.3 (escaping), §13 H-03 |
| "My edit_file says old_string not found" | §11.2, §13 H-03 |
| "Should I submit LoRA adapters?" | §11.4, §13 H-01 (short answer as of 2026-10-01: **no**) |
| "My local run fails but looked fine" | §10.5 |
| "What actually gets scored?" | §9 |
| "Is this bug fixed yet?" | §13 (hazard register, dated), §15 (re-check list) |

**Shortest path for a reader who only needs to ship:** read §2 (the mistakes list), copy `starter-submission/`, adjust `prompts/system.md`, run the self-check lab in §5.8 locally if you have the wheelhouse, then follow the submission SOP in §5.7. Skip everything else until your first score exists.

**Honest aging statement.** This document is pinned to the versions in the header. The host is actively patching the harness (five separate fixes promised on 2026-09-30 alone — see §13). Before relying on any hazard status, re-check it against the live discussion board using §15's re-check list. The *concepts* (object model, lifecycle, scoring rules) age slowly; the *defect statuses* age in days.

---

## 2. The one thing to know first: the competition dialect vs upstream ADK

The Kaggle "Gemma 4 Developer Agent" competition accepts **no Python code from you at all**. Your submission is a directory of YAML, Markdown, JSON, and safetensors files, compiled by a library called `adk-submission` into a live Google ADK agent tree **without ever importing your code** (`importlib` is never used — HARNESS_README §2.1). Everything dynamic — tools, models, skills, callbacks — is resolved against **closed registries** the host controls. This is a security boundary, not a style choice: upstream ADK's config path (`config_agent_utils.from_config()`) can import arbitrary Python (e.g. `tools: - name: ma_llm.check_prime` resolves a dotted path to *your* module, and callbacks are `CodeConfig {name, args}` references to your callables), which would let a submission execute anything on the scoring machine.

Upstream context you must hold while reading the rest of this section (all verified against adk.dev, 2026-10-01):

- Upstream **Agent Config** (the YAML feature at adk.dev/agents/config/) is **Experimental**, landed in ADK Python **v1.11.0**, and upstream **only supports Gemini models** — the competition's Gemma-on-vLLM stack is not representable in upstream Agent Config at all.
- Upstream Agent Config's `tools:` entries are name-keyed mappings (`- name: google_search`) resolving to built-in tools or **your Python functions**; the dialect's `tools:` entries are **bare strings from a fixed 9-tool registry** plus one mapping form (`agent_tool:`).
- Upstream ADK is at **2.10.0**, where templated workflows (Sequential/Parallel/Loop) are explicitly labeled *superseded* by graph-based and dynamic workflows; the dialect supports **exactly the four template classes and nothing newer** — consistent with the harness's observed **ADK 1.36.1** runtime.

**The concrete mistakes a reader who learned only upstream would make** (each is a divergence row in Appendix A; the seam is also flagged at the point of use in later chapters):

| # | Upstream-trained reader writes… | What happens in the competition |
|---|---|---|
| M1 | `tools: [- name: google_search]` or any built-in/toolset name | Validation error: only the 9 registered tool names (plus `agent_tool:`) resolve; there is no search, no MCP, no OpenAPI tool, no artifact tool |
| M2 | A Python function tool (docstring + type hints) | Impossible: no Python entrypoints exist; `.py` files are only legal inside `skills/*/scripts/` |
| M3 | `model: gemini-flash-latest` or any non-Gemma model, or two different models for two agents | `ParticipantVisibleError`: exactly one base model, and it must be `gemma-4-31b-it-qat-w4a16-ct` |
| M4 | `LiteLlm(model=...)` / `hosted_vllm/...` wiring, `api_base`, auth headers | All host-side; you never touch serving. Model strings are registry aliases only |
| M5 | An `instruction:` block scalar containing literal `{curly}` JSON examples | ADK interpolates `{identifier}` from session state; a missing key **raises an error** (use `{var?}` for optional keys like `{hints?}`) |
| M6 | `before_model_callback: my_guardrail` (or any callback/plugin) | Callbacks resolve against a closed `CallbackRegistry`; no participant-reachable callback surface is documented — assume none |
| M7 | Graph workflows / dynamic workflows / `workflow.NewAgentNode` / routing nodes | Not in the dialect (ADK 1.36.1 template classes only) |
| M8 | `global_instruction:` | Referenced by the harness README §2.2 as an include target, but **deprecated upstream** (→ `GlobalInstructionPlugin`, which is code-only and thus unavailable here). Avoid it; put shared text in each agent's `instruction` via `!include` of the same file |
| M9 | `exit_loop` tool inside a `LoopAgent` for early termination | `exit_loop` is **not** in the 9-tool registry, and no callback surface exists ⇒ no documented early exit; `max_iterations` is your only stop (strong inference — see §6.3) |
| M10 | An `AgentTool` built from a live agent instance with custom `description`/`tool_args` | Dialect form is exactly `agent_tool: {config_path, skip_summarization}`; no per-tool description or argument schema control |
| M11 | `planner=`, `code_executor=`, `output_schema=`, artifacts, memory, A2A, live/voice | None exist in the dialect's agent schema |
| M12 | Compaction/caching config on the `App` | Host-set and immutable by you (compaction `token_threshold` 14,336 etc., §11.6); your only lever is prompt discipline |

The full field-by-field table — upstream behavior, dialect behavior, and reader consequence for every seam — is **Appendix A**, duplicated as the standalone sidecar `adk-competition-divergence.md` so you can keep it open beside your editor.

---
## 3. ADK orientation

**Prerequisite: none. Decision rule: read this once before Tier 1; return for the version pin whenever a doc page disagrees with reality.**

### 3.1 Version and packaging (as of 2026-10-01)

| Fact | Value | Source, date |
|---|---|---|
| PyPI package | `google-adk` (Agent Development Kit), requires Python ≥ 3.10 | PyPI JSON, 2026-10-01 |
| Current release | **2.10.0** (2026-09-25) | PyPI + GitHub releases |
| Release cadence | Roughly weekly-to-fortnightly minor patches (2.9.0 09-10, 2.9.1 09-15, 2.9.2 09-18, 2.10.0 09-25) | GitHub releases, 2026-10-01 |
| 1.x maintenance line | Still alive: **1.39.1** released 2026-08-27, *after* 2.8.0 | GitHub releases |
| 2.0 GA dates | Python 2026-05-19; Go 2026-06-30; TypeScript 2026-08-21 | adk.dev/2.0/ |
| Docs home | adk.dev (Python/TypeScript/Go/Java/Kotlin); repo google/adk-python (≈21.7k stars) | adk.dev nav, 2026-10-01 |
| **Version the competition runs** | **google-adk 1.36.1** (participant-observed twice: discussion 744354, 744692) | Kaggle, 2026-09-30 → 10-01 |

**What the pin implies.** The harness sits on the 1.x line. Everything 2.x — the Workflow Runtime graph engine, `BaseAgent ⊂ BaseNode`, new Event fields (`node_info`, `output`), automatic retry/HITL semantics, graph and dynamic workflows — is **absent**. Even within 1.x, 1.36.1 predates 1.39.1, so late-1.x fixes may also be absent. When you read upstream docs, mentally timestamp them: "Supported in ADK Python vX" is only usable if **X ≤ 1.36.1** for harness behavior, and even then the dialect may not expose the feature.

### 3.2 The object model, in one page

- **`LlmAgent`** (aliased `Agent`): the unit that talks to a model. Identity (`name`), routing blurb (`description` — read by *parent* LLMs deciding delegation), system prompt (`instruction`), tools, sampling (`generate_content_config`), context visibility (`include_contents`), and `output_key` (save final text into session state).
- **Workflow agents** — `SequentialAgent`, `ParallelAgent`, `LoopAgent`: deterministic containers for sub-agents. No LLM inside the container itself. This is the *only* composition model in the dialect.
- **Tools**: upstream, anything from a Python function to MCP toolsets; here, exactly 9 registered functions (§11.1) plus `AgentTool` (an agent wrapped as a callable tool).
- **Session / state**: a conversation thread with a serializable key-value scratchpad (`session.state`). `{var}` in an `instruction` is interpolated from state before the model call; prefixes `user:`/`app:`/`temp:` control scope upstream (in the dialect, effectively only session state exists — the harness seeds `problem_description` and, *when non-empty*, `hints`).
- **Runner / invocation**: the engine driving agent turns; one *invocation* = one user input → final output. `temp:` state lives exactly that long (upstream semantics; relevant if you ever test outside the harness).
- **Callbacks / plugins**: intercept points (`before/after_agent`, `before/after_model`, `before/after_tool`). Upstream: your functions. Dialect: closed registry — the host uses them (`ModelRetryPlugin`, `EventDisplayPlugin`); you don't.
- **App**: the top-level wrapper where upstream sets compaction and caching. Host-owned here.

### 3.3 The configuration and extension model, and why it was replaced

Upstream offers three ways to build: (1) Python code (full power), (2) **Agent Config YAML** (experimental, Gemini-only, v1.11.0+; `adk create --type=config` generates `root_agent.yaml`; `config_agent_utils.from_config()` loads it, resolving `tools`/`callbacks`/`model_code` **code references by dotted name**), (3) 2.x graph workflows. The competition needed "participants cannot execute code on the scorer", so `adk-submission` re-implements the YAML path as a **sandboxed compiler** (`compile_submission`) with closed registries and a locked model list (HARNESS_README §2.1). Consequence: the dialect *resembles* upstream Agent Config (same `name`/`model`/`instruction`/`sub_agents: [{config_path}]` skeleton, same `agent_class` discriminator) but is neither a subset nor a superset — see Appendix A.

### 3.4 Documentation map — what to trust for which question

| Question | Trust | Distrust |
|---|---|---|
| Dialect field names, limits, tool contracts, lifecycle | **HARNESS_README.md (2026-09-25 build)** + the shipped `sample_submission/` | Anything on adk.dev that contradicts it |
| ADK concepts (state templating, workflow semantics, AgentTool, skills format) | adk.dev pages for those concepts, **version-filtered to ≤ 1.36.1 behavior** | "Supported in" banners above your version; 2.x-only pages (graphs, dynamic workflows) |
| Exact upstream schema | `config_schemas/AgentConfig.json` in google/adk-python@main (fetched 2026-10-01) | The rendered schema-reference page (generated 2025-08-20, older than main) |
| Bug statuses | Live Kaggle discussion threads (§13 has IDs and dates) | Any blog/notebook older than the last host patch |
| Serving behavior (vLLM flags, thinking) | HARNESS_README §3 + adk.dev vLLM/Gemma pages for the *concepts* | Your intuition from Gemini-API behavior |

### 3.5 Stability labels (upstream, verified 2026-10-01)

| Component | Label | Since | Obligation on you |
|---|---|---|---|
| LlmAgent, workflow agents, sessions/state, LiteLlm/vLLM connectors | Stable (v0.1.0-era) | — | Safe to learn |
| Agent Config (YAML) | **Experimental** | v1.11.0 | Upstream may change shape; the *dialect* is frozen by the harness instead |
| Skills | **Experimental** | v1.25.0 | Treat `skills:` as risk-priced (§6.4, §7.1); validate early on one task |
| Context compaction | Stable-ish | v1.16.0 | Host-fixed here; you only need to understand it |
| 2.x graph/dynamic workflows | GA (2.0, 2026-05-19) | — | **Not available in the dialect** |

### 3.6 Known-changing / deprecated upstream surfaces (flagged per VQ-12)

- `global_instruction` — deprecated upstream → `GlobalInstructionPlugin` (code-only). The harness README still names it as an include target; **avoid it** — put shared text in a shared `!include` file referenced by each agent's `instruction`.
- ADK 2.0 changes Event schema (adds `node_info`, `output`) and forbids manual event appends — irrelevant to you (no code), but explains why harness-internal behavior may differ from 1.x docs you find.
- v2.10.0 changed `${var}` / `\{var}` templating (left as written). The dialect's `{var}` single-brace form is unaffected, but this is exactly the kind of drift that makes "pin the version" non-optional.

---

## 4. The competition dialect (`adk-submission`)

**Prerequisite: §3.2. Decision rule: this chapter is the contract; consult, don't memorize.**

### 4.1 Security and compilation model

Your submission directory is validated (`validate_directory`, `validate_single_declared_model`) then compiled (`compile_submission`) into an ADK `BaseAgent` tree. No `importlib`. No Python entrypoints (`agent.py`/`agent_fn` do not exist as concepts). File types are enforced by extension allowlist: `.yaml`/`.yml` (configs), `.md`/`.txt` (prompts, `SKILL.md`), `.py` (**only** ADK skill scripts), `.json` (`adapter_config.json`), `.safetensors` (adapter weights). Pickle weights (`.bin`, `.pt`, `.pth`) and archives are rejected (HARNESS_README §2.4).

### 4.2 Root config discovery and `!include`

- Exactly one root config at the submission root: `agent.yaml`, `agent.yml`, `root_agent.yaml`, or `root_agent.yml`. Zero roots ⇒ `MissingRootConfigError`; more than one ⇒ `MultipleRootConfigsError`. (Upstream's `adk create --type=config` generates `root_agent.yaml` — same discovery family.)
- `!include <relative-path>` embeds external files into YAML: `.md`/`.txt` load as raw UTF-8 strings (ideal for `instruction`); `.yaml`/`.yml` parse recursively, **max depth 10 with cycle detection**. Absolute paths, null bytes, `..` traversal, and symlinks escaping the root all raise `PathTraversalError`. Include paths are relative to the *including file's* directory — the shipped sample's sub-agent uses `!include ../prompts/analyzer.md` (SCHEMA-CHECKED against `sample_submission/sub_agents/code_analyzer.yaml`).
- This directive **does not exist upstream** — it is dialect-only sugar so prompts can live outside YAML.

### 4.3 Agent classes and their fields (HARNESS_README §2.3, cross-checked against upstream `AgentConfig.json`)

`agent_class` discriminates; omitted ⇒ `LlmAgent`.

**`LlmAgent`** (the only class with a model):

| Field | Type / values | Notes (dialect-specific in **bold**) |
|---|---|---|
| `name` | str, required | Unique across tree; avoid `user` |
| `model` | registry alias | **Must be the single declared base model** (`gemma-4-31b-it-qat-w4a16-ct` for scoring); provider prefixes are stripped by `normalize_model_name` |
| **`adapter`** | str \| none | **Dialect-only.** Names a subdir under `adapters/`; rewrites the model id to `openai/<adapter-name>` (see §11.4 — currently gated) |
| `description` | str ≤ 1,000,000 chars | Read by parent agents for delegation decisions |
| `instruction` | str ≤ 1,000,000 chars | System prompt; `{var}` templating from session state |
| `tools` | list | Bare tool-name strings and/or `agent_tool:` mappings — **nothing else resolves** |
| `skills` | list[str] \| none | **Dialect addition** (upstream Agent Config has no `skills:` key); relative paths to skill dirs |
| `sub_agents` | list of `{config_path}` | Transfer-based delegation |
| `output_key` | str \| none | Final text → `session.state[output_key]` |
| `include_contents` | `"default"` \| `"none"` | Whether conversation history reaches the agent |
| `disallow_transfer_to_parent` / `disallow_transfer_to_peers` | bool \| none | Transfer graph control |
| `generate_content_config` | dict | Sampling/thinking; snake_case keys (§11.3); execution-altering keys (`tools`, `system_instruction`, `http_options`, `safety_settings`, `response_schema`) are **excluded by schema** and raise on use |

Upstream-only fields you might type out of habit — `model_code`, `static_instruction`, `input_schema`, `output_schema`, the four `*_callbacks` lists — are **not part of the documented dialect schema**; the README's mention of "agent callbacks" on workflow classes refers to the closed `CallbackRegistry` (host-side). Assume any callback reference is rejected or ignored; there is no documented participant-reachable name to put there.

**`SequentialAgent` / `ParallelAgent` / `LoopAgent`:** `name`, `description`, `sub_agents` (Loop adds `max_iterations`, default 500, bounded 1–500). No model, no tools, no instruction — they are pure containers.

### 4.4 Limits — hard constraint vs safety ceilings (HARNESS_README §2.4, all version-pinned to the 2026-09-25 build)

| Category | Limit | Nature |
|---|---|---|
| Total unpacked submission size | **< 3 GiB** (3,221,225,472 bytes, incl. `adapters/`) | **Hard** |
| Files / YAML files | 10,000 / 1,000 | Safety ceiling |
| Per-YAML size (incl. include expansion) | 50 MiB | Safety ceiling |
| Per-skill dir size | 50 MiB | Safety ceiling |
| Instruction chars per agent / total | 1,000,000 / 10,000,000 | Safety ceiling |
| Agents in compiled tree | 500 | Safety ceiling |
| Nesting depth (`sub_agents` + `agent_tool`) | 50 | Safety ceiling |
| Skills | 1,000 | Safety ceiling |
| Loop iterations | 500 | Safety ceiling |
| `max_output_tokens` | 1–32,768 (default 16,384) | Hard (vLLM `max_model_len=32768`) |
| `thinking_config.thinking_budget` | 0–32,768 (default 4,096) | Hard (same bound) |
| Context window (prompt + reasoning + output) | 32,768 tokens | **Hard — the resource everything else orbits** |

### 4.5 The closed registries and what rejection looks like

- `ToolRegistry`: exactly 9 tools (§11.1). An unknown name fails validation.
- `ModelRegistry`: competition scoring restricts `ALLOWED_MODEL_NAMES = {gemma-4-31b-it-qat-w4a16-ct}`; multiple base models or any other name ⇒ `ParticipantVisibleError`. (Local CLI has more aliases registered — do not be fooled by local acceptance; see §10.4.)
- `SkillRegistry`, `CallbackRegistry`: host-managed; skills resolve from your submitted directories, callbacks have no documented participant surface.
- The intended substitutes for everything unavailable: sub-agents instead of pipelines-of-code; `agent_tool` instead of function tools; prompt engineering instead of callbacks; `eval_config.yaml` instead of runtime budget logic; skills directories instead of prompt includes when progressive disclosure matters.
- **The full divergence table** — every named upstream-vs-dialect seam with its reader consequence — is [Appendix A](#appendix-a--complete-upstream-vs-dialect-divergence-table) (duplicated as the sidecar `adk-competition-divergence.md`); §2's M1–M12 table is its mistake-shaped short form.

---
## 5. Tier 1 — Essentials: from nothing to a valid, evaluated submission

**Prerequisite: §2 read. Every sub-chapter carries: decision rule → badged example → failure signature → cost.**

### 5.1 Environments: where work actually happens

There are exactly two places your agent runs: (a) the **scorer** — Kaggle's L4×4 notebook path, harness-driven, no interaction; (b) **your local loop** — the official wheelhouse dataset (v25 as of 2026-09-30) + Getting Started notebook or the `swegemma` CLI in Docker. You write the same YAML for both; you *debug* only in (b). Do not try to "test on the scorer" — a submission costs a daily slot and 12–14.5 h of scoring wall-clock (community-measured, §13 H-14).

### 5.2 Anatomy of the minimal submission

**Decision rule:** start from `starter-submission/` (this tutorial's adapter-free, fully commented tree, itself modeled byte-for-byte on the official `sample_submission/` structure). Minimal valid submission = **one root YAML + one instruction**; everything else is optional.

```text
submission/
├── agent.yaml                  # REQUIRED root config
├── eval_config.yaml            # optional budgets (4 fields)
├── configs/sampling.yaml       # optional, via !include
├── prompts/system.md           # optional, via !include
├── sub_agents/*.yaml           # optional
├── adapters/<name>/            # optional LoRA (gated — §11.4)
└── skills/<name>/SKILL.md      # optional
```

**Example 5-1 — the smallest agent** *(ILLUSTRATIVE — constructed from HARNESS_README §2.3; not executed)*:

```yaml
# agent.yaml — the entire submission (plus nothing else) is valid
name: minimal_coder
model: gemma-4-31b-it-qat-w4a16-ct
instruction: |
  You are an autonomous software engineer. Read the problem statement,
  locate the target code, apply a minimal fix, run only the targeted test,
  then call submit_patch. Never modify test files.
tools:
  - run_command
  - read_file
  - edit_file
  - submit_patch
```

**Failure signature:** `MissingRootConfigError` (you named it `main.yaml` or nested it in a folder); `MultipleRootConfigsError` (you left both `agent.yaml` and `root_agent.yaml`). **Cost:** one validation cycle, caught before any GPU time.

### 5.3 Declaring the model

**Decision rule:** every agent in the tree declares the same `model: gemma-4-31b-it-qat-w4a16-ct`, or you rely on… nothing — there is no documented default-model inheritance in the dialect (upstream has `LlmAgent.set_default_model` since v1.22.0, but that is code-side and host-owned here). Write it explicitly on every agent.

The validator traverses the root config, every `sub_agents[*].config_path`, every `tools[*].agent_tool.config_path`, and standalone agent YAMLs; strips provider prefixes (`openai/`, `google/`, `hosted_vllm/`, `custom/`); and requires exactly one unique base model, which in scoring must be the competition alias. **Failure signature:** `ParticipantVisibleError` naming the violation. **Cost:** none — caught at validation.

### 5.4 Writing the instruction (and templating it)

The instruction is your main lever. The harness seeds `session.state` with:

- `problem_description` — always present (`task.problem_statement`);
- `hints` — **only when** `task.hints_text` is non-empty.

`{var}` placeholders in any `LlmAgent` instruction are interpolated from state before the model call. Rules (upstream-verified semantics on the 1.x line):

- `{problem_description}` — safe, always present.
- `{hints}` — **raises when absent** (upstream: missing key ⇒ error). Use `{hints?}` to make it optional, or keep hints handling in the *user prompt*, which is where the harness already puts them (HARNESS_README §5.2) — the shipped sample does exactly this and does not template `{hints}` anywhere (SCHEMA-CHECKED).
- Literal curly braces in your instruction (JSON examples!) will be treated as placeholders when their content matches an identifier; upstream's escape hatch is an `InstructionProvider` function, which you cannot write. **Practical rule: keep JSON/format examples out of the instruction, or phrase them without `{identifier}`-shaped text.**

**Cost:** instruction length is bounded (1M chars) but every char is a token spent *per model call* — the real budget is the 32,768-token window, not the char limit.

### 5.5 Attaching tools

**Decision rule:** attach the smallest tool set that covers your loop. Each extra tool is schema the model must reason about, and some carry context blow-up risk (§13 H-04).

| Your loop needs… | Attach |
|---|---|
| Read code, edit, run one test, submit | `read_file`, `edit_file`, `run_command`, `submit_patch` |
| Create new files / rewrite whole files | + `write_file` |
| Budget awareness mid-task | + `get_status` (free — doesn't consume `tool_calls`) |
| Repo navigation beyond grep | + `get_code_neighbors`, `search_similar_code`, `get_code_subgraph` (use carefully — H-04) |

`submit_patch` and `get_status` do **not** count against the tool-call budget (`count_tool_call=False`); the other seven do (HARNESS_README §6). **Failure signature:** unknown tool name fails validation; a tool you didn't attach simply doesn't exist for the model (it may hallucinate calling it). **Cost:** each attached tool's declaration costs prompt tokens on every call.

### 5.6 Budgets and `eval_config.yaml`

Four fields, read by the scorer; **defaults when omitted = no limit** (i.e., harness defaults 60 min / 100 calls / 500 turns apply in `scripts/inference.py`; the *sample* submission ships deliberately tighter values — 1 min / 10 calls / 50 turns / 60 s — as a demo, not a recommendation):

```yaml
evaluation:
  timeout_seconds: 300    # single run_command wall-clock (default 300)
  max_tool_calls: 100     # budget-gated tool calls
  max_time_minutes: 60    # per-task agent wall-clock (container setup excluded)
  max_turns: 500          # LLM reasoning turns
```

**Decision rule (host-recommended, 2026-09-24→29, thread 743063):** DO set `max_time_minutes` to something moderate as a failsafe — a task that would run forever otherwise consumes the 12 h *global* budget, and hitting the global limit **errors the entire submission** today (planned fix: score unfinished tasks as 0 — unconfirmed). With 129 public tasks and 12 h, a defensible per-task cap is ~3–5 min; the frontier of that trade-off is yours to probe.

**Failure signatures:** `TimeoutExceeded` from `run_command` kills only that command; exhausting `max_time_minutes`/`max_tool_calls`/`max_turns` ends the task (with the unsubmitted-patch fallback — §9.2 — still harvesting your diff). **Cost model:** time budget starts only after container setup (`start_agent_session`), so slow wheel installation doesn't eat your minutes.

### 5.7 Packaging and the submission SOP

Zip the submission **directory's contents at the root** (not the folder itself). The 9/26 failure wave and the "Did not find output file 'submission.zip'" error trace to workflow mistakes, not packaging: the SOP (host-stated, thread 743683) is **Save Version (successful run) first → then Submit**. Submitting an unsaved version fails instantly. **Cost:** a failed submission still consumes the daily slot (community-reported for the 9/26 wave; reruns were granted then — do not rely on it).

### 5.8 First local run and the self-check lab

With the wheelhouse (v25) attached and GPU session running (see §10 for the full loop):

1. **Compile-check:** load your directory through the official compiler path (the Getting Started notebook's validation cell). Expected: no `Missing/MultipleRootConfigsError`, no registry rejection, no `PathTraversalError`.
2. **One-task smoke:** `swegemma eval --task-id <one fast task> --submission-dir <dir> --sandbox docker` (or subprocess mode if no Docker daemon). Watch `results/<run>/logs/<id>.log` for the agent transcript.
3. **Gold-patch control:** rerun with `--skip-agent-patch` to see baseline test behavior (§10.3).
4. **Self-check questions** (answer from your artifacts, not memory): Did the model call an unattached tool? Did any single tool result exceed ~5k chars (escaping pressure)? Did the task end *with* `submit_patch` (good) or by nudge-exhaustion (fix the prompt)? Is the extracted patch non-empty (`patches/<id>.patch`)?

**What NOT to try first (RQ-03.8):** adapters (gated, §11.4), skills (experimental, §6.4), LoopAgents (§6.2), parallel fan-outs (§6.2), or tuning `thinking_budget` before the thinking-drop fix status is confirmed (§13 H-05). Get one scored prompts-only submission on the board; it is your control group for every later change.

---

## 6. Tier 2 — Intermediate: composition, state, workflow agents, skills

**Prerequisite: a scored Essentials submission. Opens with the decompose-or-not decision because that is where cost is decided.**

### 6.0 When to decompose at all

**Decision rule:** decompose for **context isolation**, not for organizational aesthetics. Every sub-agent boundary costs turns (a delegation is a model call) and shares the same budgets (`tool_calls`, time, turns are per-*task*, not per-agent — the `SwegemmaContext` gate is created once per task). Decompose when: (a) exploration output is bulky and you want it *out* of the coder's history (`agent_tool` + `skip_summarization: true` returns only the sub-agent's final text); (b) you want genuinely different instructions/sampling per role. Do not decompose when: the task fits in ~10 tool calls and 20k tokens — a single tight agent beats a committee (baseline evidence: prompts-only single agents score 0.05–0.12 LB; community reports, §12).

### 6.1 `sub_agents` vs `tools` vs `agent_tool` (RQ-04.1/04.2)

| Dimension | `sub_agents` (transfer) | `tools` (function) | `agent_tool` (delegation-as-tool) |
|---|---|---|---|
| Control | LLM decides to transfer conversation control | LLM calls like a function | LLM calls like a function; inner agent runs its own loop |
| Context | Sub-agent sees conversation (unless `include_contents: none`) | Tool gets arguments only | Inner agent gets the *call arguments as its task* |
| Output handling | Sub-agent's replies join the conversation | JSON string result injected | With `skip_summarization: true`, inner agent's final text returned verbatim |
| Best for | Role handoffs (router → specialist) | The 9 harness tools | **Context landfills** (analysis, search) whose details you want discarded |
| Dialect form | `sub_agents: [{config_path: x.yaml}]` | bare name strings | `agent_tool: {config_path: x.yaml, skip_summarization: true}` |

The official sample's shape is the canonical intermediate pattern — a root coder holding all mutating tools, plus one read-only analyzer as an `agent_tool` (SCHEMA-CHECKED, `sample_submission/agent.yaml` + `sub_agents/code_analyzer.yaml`):

```yaml
# ILLUSTRATIVE copy of the official sample shape (structure SCHEMA-CHECKED)
name: swe_baseline_agent
model: gemma-4-31b-it-qat-w4a16-ct
instruction: !include prompts/system.md
tools:
  - run_command
  - read_file
  - edit_file
  - write_file
  - get_status
  - submit_patch
  - get_code_neighbors
  - search_similar_code
  - get_code_subgraph
  - agent_tool:
      config_path: sub_agents/code_analyzer.yaml
      skip_summarization: true
generate_content_config: !include configs/sampling.yaml
```

```yaml
# sub_agents/code_analyzer.yaml — read-only specialist (SCHEMA-CHECKED)
name: code_analyzer_agent
description: Analyzes repository source files and symbol graphs to locate root causes.
model: gemma-4-31b-it-qat-w4a16-ct
instruction: !include ../prompts/analyzer.md     # note ../ — relative to THIS file
tools:
  - read_file
  - search_similar_code
  - get_code_neighbors
  - get_code_subgraph
generate_content_config: !include ../configs/sampling.yaml
```

**Failure signature:** forgetting `skip_summarization: true` leaves the wrapper summarizing (or echoing) the inner agent's work into your context anyway — the isolation you wanted evaporates. **Cost:** each `agent_tool` invocation = the inner agent's whole loop (its model calls count toward turns/time; its tool calls toward `tool_calls`).

### 6.2 The workflow agents (RQ-04.3)

Semantics (upstream 1.x-verified, and the classes are the same objects the harness compiles):

- **`SequentialAgent`** — sub-agents in list order, one InvocationContext shared, `temp:` state shared, data passed via `output_key` → `{var}` in the next agent's instruction. Deterministic.
- **`ParallelAgent`** — branches run concurrently in isolated branches; **no shared conversation history or state during execution**; results collected afterwards (classic pattern: parallel scouts with distinct `output_key`s, then a sequential merger that templates them).
- **`LoopAgent`** — body repeats in order up to `max_iterations` (dialect bound 1–500). Upstream's early-exit mechanisms are escalation-based (`exit_loop` tool setting `tool_context.actions.escalate`, or callbacks) — **neither is reachable in the dialect** (`exit_loop` is not one of the 9 registered tools; callbacks are closed). **Strong inference (V1, verify on scorer): a dialect LoopAgent always runs to `max_iterations`.** Price a loop as `iterations × body-cost`, always.

```yaml
# ILLUSTRATIVE — plan → edit → verify pipeline
agent_class: SequentialAgent
name: repair_pipeline
sub_agents:
  - config_path: sub_agents/planner.yaml      # output_key: repair_plan
  - config_path: sub_agents/coder.yaml        # instruction uses {repair_plan}
  - config_path: sub_agents/verifier.yaml     # runs targeted test, advises
```

**Failure signatures:** a ParallelAgent branch that reads state another branch writes (unspecified — design as if branches share nothing); a LoopAgent priced as "runs until done" (it runs until `max_iterations`, always); sequential agents expecting conversation carry-over without `output_key` (pass state explicitly). **Cost:** each workflow node that is an LlmAgent is a full model call minimum.

### 6.3 State flow in the dialect (RQ-04.4/04.5)

- Writes: `output_key` (agent final text → state) is your only *documented* write path — tools here don't get `ToolContext.state` manipulation documented for participants, and callbacks are closed. Read that again: **state writes = `output_key`, period.**
- Reads: `{var}` templating in any instruction; `{var?}` for optional.
- `include_contents: none` gives an agent amnesia (instruction + current input only) — right for pure-function steps in pipelines, wrong for conversational ones.
- `disallow_transfer_to_parent` / `disallow_transfer_to_peers` prune the transfer graph — use on specialists so they can't wander back up.

### 6.4 The skills format (RQ-04.6)

A skill is a directory with `SKILL.md` (YAML frontmatter `name` + `description`; body = instructions), optionally `references/`, `assets/`, `scripts/`. Validation: `name` ≤ 64 chars, lowercase kebab-case, no leading/trailing/consecutive hyphens; `description` ≤ 1024 chars, non-empty (upstream spec, agentskills.io). Attach via `skills: [skills/repo-navigation]` on an agent. The runtime injects skill-listing/`load_skill` behavior so content is pulled in **progressively** — that is the whole point: instructions that only cost tokens when used.

**Dialect caveats:** (a) upstream Skills are **Experimental** (v1.25.0+ — post-dates nothing in 1.36.1's favor: 1.25 < 1.36, so present, but experimental); (b) `.py` under `skills/*/scripts/` is the only legal Python — where it executes is not documented; assume harness-process and treat as unverified (V1); (c) no participant report of end-to-end skill use on the scorer was found as of 2026-10-01 — validate cheaply before leaning on it.

### 6.5 Worked comparison: one problem, two ways

**Problem:** "fix the off-by-one in `parse_header`, verified by `tests/test_parsing.py::test_parse_header`".

- **Way A — single agent (Essentials shape):** instruction directs: read the function, edit, run `python3 -m pytest tests/test_parsing.py::test_parse_header -q`, `submit_patch`. Turns: ~4–6. Context: the read + diff + test output.
- **Way B — root + analyzer (Intermediate shape):** root calls `agent_tool` analyzer ("locate the exact lines for the reported symptom") — analyzer's `search_similar_code`/`read_file` churn stays in *its* context; root receives three lines of coordinates, edits, tests, submits. Turns: ~6–8 total. Context in root: small and stable.

**When B wins:** repos/tasks where exploration is wide (the analyzer absorbs the landfill). **When A wins:** surgical tasks where the file is named in the problem statement — B's extra turn is pure overhead. The official sample ships B; romanrozen's 0.12-LB public notebook is A-shaped (community-reported, thread 743140, 2026-09-24). Neither number is a controlled experiment — it is the shape of the trade, not a verdict.

---
## 7. Tier 3 — Advanced: context, budgets, defense, diagnosis

**Prerequisite: Tier 2 shipped and scored. Opens with the costed catalog — read it before wanting any technique.**

### 7.0 Costed technique catalog (every technique: cost + failure condition)

| Technique | Cost | Fails when / condition |
|---|---|---|
| Prompt tightening (few-shot edit discipline) | ~0; prompt tokens per call | Instruction grows past ~2–3k tokens; per-call tax |
| Analyzer-as-`agent_tool` (context landfill) | +1–2 turns/task | Task is surgical; coordinates already known |
| `include_contents: none` on pipeline steps | Nothing | Step actually needs conversation |
| Skills (progressive disclosure) | Small; grows only on use | Skill description misleads the listing model; content > needed |
| Sequential plan→edit→verify | +2 turns | Plan drifts from what editing reveals |
| LoopAgent polish loop | iterations × body cost | **No early exit (§6.2)** — always pays full price |
| Parallel scouts + merger | Branches concurrent; KV pressure on 4×L4 | Branches share nothing — merger must re-read everything |
| Thinking budget tuning | thinking tokens per call | H-05 status unconfirmed; budget competes with output |
| Adapter (LoRA) specialization | Whole 3 GiB + serving risk | **H-01: track gated as of 2026-10-01** |
| Aggressive per-task time caps | Forfeits long tasks | Cap set below median solve time |

### 7.1 Skills engineering (RQ-05.1/05.2)

Design skills as **progressively disclosed runbooks**: frontmatter `description` is always in context (make it a routing signal: "use when the task involves X"), body loads on demand (make it a checklist), `references/` for deep material (load only the needed file). Size bodies for a 32,768-token window with ~14k effective history before compaction (§11.6): a skill body of >4k tokens is a context event, not a free include. `scripts/` Python is legal by extension allowlist but its execution environment is undocumented — treat as unverified (V1) and prefer instructing the *agent* to write/run code via `run_command` in `/tmp` instead.

### 7.2 Orchestration for long horizons (RQ-05.4/05.9)

The harness drives an outer loop with **continuation nudges** (max 3 consecutive no-progress turns end the task — HARNESS_README §5.3): a turn with ≥1 valid tool call resets the nudge counter; a turn ending with an unclosed `<|tool_call>` tag or `MAX_TOKENS` gets *specific* nudges telling the model to stop re-reasoning and emit the call. Design rules that fall out:

1. **Every turn should contain a tool call.** Pure-prose turns increment nudge pressure.
2. **Split large edits** so no single `edit_file`/`write_file` rides past `max_output_tokens` behind a long thought (HARNESS_README gotcha #1).
3. **End on `submit_patch`** — it's free, immediate, and the fallback (§9.2) is strictly worse (it can't clean up scratch files first).
4. **Multi-step ordered repair** (scaffolding then logic then tests): SequentialAgent pipelines read naturally, but each stage boundary costs a turn; for ≤3 steps, one agent with a numbered instruction usually prices better.

### 7.3 Context engineering under 32,768 tokens (RQ-05.5/05.6)

Your levers, ranked by leverage:

1. **Read less:** `read_file` caps at 150 lines / 10k chars *per call* — ranged reads (`start_line`/`end_line`) are the right tool *once* the H-06 TypeError fix is confirmed deployed; until then prefer full reads (the cap protects you) plus the analyzer pattern to keep reads out of the root context.
2. **Query narrowly:** `search_similar_code` with *specific function/method names*; never broad class names (`FastAPI`, `APIRouter`, `Body` → 100k+ char nodes → `ContextWindowExceededError` → task over). `get_code_neighbors` first (names only, <400 chars typically). (H-04.)
3. **Escaping tax (H-03):** every tool result reaches the model **double-JSON-encoded** (`"` → `\\\"`, newline → `\\n`) — swegemma returns a JSON string, ADK wraps it as `{"result": ...}`, LiteLLM re-serializes. Measured impact: 22% of `edit_file` calls fail `old_string not found` under double-JSON (62% under single-JSON if the host's cheaper fix lands; 0% under raw text — the *safe* fix). **Defenses:** instruct the model to anchor `old_string` on quote-free lines; prefer `write_file` for new files (no matching needed); teach "when copying from a read, un-escape twice"; keep verification asserts short.
4. **Compaction is host-owned** (§11.6): you cannot tune it. Your defense is not hitting it: keep the *sum* of instruction + history + tool results comfortably under ~14k tokens, because that is where compaction fires (and where the overflow-loses-patch bug punishes overshoot — H-02).
5. **Thinking budget:** `thinking_budget` competes with `max_output_tokens` inside 32,768. The sample's 4,096/16,384 split is the host's own sane default; deviating is a measured experiment, not an opinion — and re-verify H-05 first.

### 7.4 Defensive design: failure signatures to pre-empt

| Signature (in logs/traces) | Meaning | Pre-emptive design |
|---|---|---|
| `ContextWindowExceededError` | Prompt+output > 32,768 (or a 100k+ graph node landed) | §7.3 levers 1–2; cap `k` in searches; short instructions |
| `old_string not found` clusters | Escaping copies (H-03) | Quote-free anchors; two-level un-escape instruction |
| 3× "Please continue…" nudges then end | Turns with no tool calls | Every-turn-a-tool-call rule (§7.2) |
| `TimeoutExceeded` from `run_command` | Command > `timeout_seconds` (300 s) | Never full-repo pytest; targeted `-k` / file-scoped runs |
| `patch_size: 0` at submit | No tracked changes (or everything excluded) | Verify with `get_status` before submitting; edits in `/workspace` only |
| Empty patch after a good session | Overflow bug (H-02) | Same as ContextWindow defense — stay under the cliff |

### 7.5 Budget allocation across the run (RQ-05.7)

Tasks run **sequentially, fixed order** (host-stated, thread 743063); the 12 h global limit currently **errors the whole run** if hit. Allocation arithmetic: 129 public tasks ⇒ ~5.6 min/task average at 12 h. Community-reported scoring wall-clock is 12–14.5 h on L4×4 — i.e., **the global limit is live at default budgets**. Set `max_time_minutes` ≈ 3–5 as a failsafe (host recommendation), keep `max_tool_calls` high enough that time, not calls, is the binding constraint for hard tasks, and treat the "are public tasks first / is order fixed per run" question as **unanswered** (asked 2026-09-28, no host reply by 2026-10-01) — do not build front-loading strategies on an assumption.

### 7.6 Local diagnosis (RQ-05.8)

The results directory is your flight recorder (§10.2): `logs/<id>.log` (full transcript — read the *actual* tool arguments the model sent), `traces/trace_<id>.json` (ATIF trajectory: thoughts, calls, tokens), `patches/<id>.patch` (what was actually harvested), `test_outputs/<id>.log` (Phase 2 pytest output — read failures bottom-up), `summary.json` (aggregate + per-repo). Diagnosis playbook: reproduce one task → read the transcript at the first `error` → classify against §7.4's table → fix prompt/architecture → re-run the *same* task id (deterministic shards: `--shard-index k --num-shards M`).

---

## 8. The mental model, consolidated

One picture, cross-linked rather than repeated:

- **Object graph:** `agent.yaml` (root LlmAgent) ── `tools:` → 9 registered functions + N `agent_tool` leaves (each an LlmAgent from `sub_agents/*.yaml`) ── `sub_agents:` → transfer children ── workflow classes contain children deterministically. One model alias everywhere; optionally one adapter name per agent (gated).
- **Control flow:** harness seeds state (`problem_description`, `hints?`) → builds the 7-section user prompt (problem, hints, budget, environment rules, standard instructions, code-intel tools if present, workspace layout ≤150 entries) → runs the root agent → ADK runs the LLM loop (LiteLlm → local vLLM :8000, TP4, gemma4 parsers) → tools execute via `docker exec`/subprocess in **Container A** → nudges on stall → `submit_patch` (or fallback) ends Phase 1.
- **State:** reads via `{var}` in instructions; writes via `output_key` only. Parallel branches share nothing; sequential bodies share the invocation.
- **Budgets:** per task — time (default 60 min), tool calls (100), turns (500), command timeout (300 s); free tools: `submit_patch`, `get_status`; warning injected into tool results when ≤10 calls remain (after 20 used). Per run — 12 h global (currently run-killing), 1 submission/day.
- **Lifecycle:** Phase 1 (agent, Container A) → patch extracted (`git add -N .` + `git diff --binary` vs baseline) → Phase 2 (fresh Container B): re-bootstrap → 4-pass patch apply → **reset of protected test/config paths** → apply `test_patch` → hermetic pytest + JUnit XML → `resolved` iff exit 0 **and** JUnit valid (passed>0, failures=errors=0, required nodes not skipped). Score = Resolution Rate over the split.
- **How a keystroke becomes a score:** model emits `edit_file` → 3-tier matching mutates the working tree → (later) `submit_patch` freezes `git diff` → Container B replays it against the *pristine* snapshot → the *task's own tests*, un-tampered, decide. **Anything your agent did that isn't in that diff never happened; anything in it that touches protected paths is discarded.**

---

## 9. Lifecycle and scoring literacy

### 9.1 The two phases (HARNESS_README §4, §8)

Phase 1 runs your agent in **Container A** (Docker default: `swebench-sandbox:latest`, network **none**, 4 GiB RAM, 2 vCPUs, `/workspace`; subprocess fallback rewrites paths into an isolated dir + venv). Bootstrap: wheels staged → snapshot extracted at `base_commit` with **zero future git history** (`git fast-export | fast-import`) → `.git/info/exclude` patterns → editable install (`--no-deps`) → test deps streamed → harness-written `pytest.ini` + `conftest.py` → `baseline` commit. **Implication:** the harness's own `pytest.ini`/`conftest.py` are *committed into your baseline* — modifying them pollutes your diff (gotcha #2); the model must never "fix" them.

Phase 2 re-bootstraps a **fresh Container B**, applies your patch with 4 fallback passes (`git apply -p1` → three-way → whitespace/recount → symlink-normalized → `-p0` → GNU `patch`), then **resets to HEAD every protected path your patch touched** (anything referenced by `test_patch`, plus `test_*.py`/`*_test.py`/`tests/…` and runner configs `conftest.py`, `pytest.ini`, `pyproject.toml`, `tox.ini`, `setup.cfg`, `.pytest.ini`, `sitecustomize.py`, `usercustomize.py`, `_swegemma_stubs.py`, `*.pth`), applies `task.test_patch`, and runs hermetic pytest (`PYTHONSAFEPATH=1 PYTHONNOUSERSITE=1 python3 -s -m pytest <targets> --junitxml=... -p no:anyio -o timeout=0 -q`).

### 9.2 Patch extraction and the fallback (§8.1)

`submit_patch()`: `git add -N .` (intent-to-add, so **new files are included**) then `git diff --binary _swegemma_baseline 2>/dev/null || git diff --binary HEAD`. If the session ends **without** `submit_patch` (nudges exhausted, budget/timeout), the harness runs the same commands as a fallback — *except* when the session died to `ContextWindowExceededError`, which lands in a generic `except Exception` that **skips the fallback** ⇒ empty patch ⇒ 0, even with edits applied (H-02, community-measured 44/44, 2026-10-01). Excluded from the diff: `__pycache__/`, `*.pyc`, `.pytest_cache/`, `*.egg-info/`, `build/`, `dist/`, `.coverage`. **Scratch scripts in `/workspace` get patched in** — put them in `/tmp` (gotcha #3).

### 9.3 The resolution criterion and where intuition misleads (§8.2)

`resolved = True` **iff** pytest exit 0 **and** JUnit XML valid: report exists, `passed_tests > 0`, `failures == 0`, `errors == 0`, and every required node (FAIL_TO_PASS / PASS_TO_PASS / functions from `test_patch`) explicitly passed — **not skipped**.

| Behavior | Score effect | Where intuition misleads |
|---|---|---|
| Fix the code, tests pass | +1/task | — |
| Fix code but leave a scratch file in `/workspace` | Patch includes junk; apply usually still succeeds; **risk** of conflicts | "Cleanup doesn't matter" — it does, at apply time |
| Also "improve" a test file | **Discarded** by the reset | "Helping the tests" is literally erased |
| Edit `pytest.ini`/`conftest.py` | Discarded; may break apply | They look like repo files; they're harness files |
| Tests pass for the wrong reason (e.g., env side-effect in A) | Phase 2 is a **fresh** container — side-effects vanish | "It worked locally in the agent sandbox" |
| Skip-needed tests marked skip | JUnit rejects skipped required nodes | "Skipped ≈ passed" — no |
| Long exploration, good fix, no `submit_patch` | Fallback saves you — *unless* the session died to overflow (H-02) | "Unsubmitted = lost" — usually false; true exactly under H-02 |
| Task takes 40 min | Eats 7+ average-task slots of the 12 h | Sunk-cost perseverance is run-killing |

---
## 10. Local development: your only real debugging loop

**Prerequisite: Essentials shipped. The scorer is not a debugger — every fact below exists so you never spend a daily submission on a question a local run answers.**

### 10.1 The stack you install (RQ-06.1/06.2)

The official path (HARNESS_README §1.2) is the **wheelhouse dataset** — a Kaggle dataset containing every wheel the scorer uses (version **v25** as of 2026-09-30; check its version before trusting any "it's pinned" claim, and run `sync-drivers.sh`-style hygiene: re-attach the latest wheelhouse to your notebook after each host update). Two ways to run it:

1. **Kaggle GPU notebook** (the lowest-friction path): attach the wheelhouse + competition datasets, open the official **Getting Started notebook**, point its variables at your submission directory, Save Version. The notebook brings up the same patched vLLM server (TP4 across the L4s, `gpu_memory_utilization` 0.90 here vs the README's 0.80 scorer value — an unexplained dial mismatch; treat notebook GPU headroom as slightly more generous than the scorer's).
2. **Local CLI** (`swegemma`) with your own GPUs or CPU-only for compile checks: `pip install` from the wheelhouse (offline, `--no-index --find-links`), then `swegemma validate <dir>`, `swegemma serve` (GPU) and `swegemma eval ...`. Without Docker, eval falls back to the subprocess sandbox (isolated dir + venv) — weaker isolation, same protocol.

**Version truth:** the *scorer's* ADK (1.36.1) is **not shipped in the wheelhouse dataset** (participant observation: the dataset's `wheels/` directory carries test-dependency wheels, not the harness's own runtime — the harness runs from Kaggle's pinned environment). So your local `pip install google-adk==<latest>` will be *newer* than scoring and can silently accept (or reject) different YAML than the scorer does. **Mitigation:** validate against the Getting Started notebook's compiler cell (which uses the pinned `adk-submission` version), and treat any behavior that differs between local and scorer as the first symptom of version drift, not a flake.

### 10.2 The results directory (RQ-06.3)

Every eval run writes a timestamped `results/<run-id>/` tree (HARNESS_README §9):

| Path | What it holds | What you read it for |
|---|---|---|
| `logs/<task>.log` | Full agent transcript: every model call, every tool invocation with actual arguments and raw results | "What did the model *actually* send?" (escaping issues, hallucinated tools, nudge baits) |
| `traces/trace_<task>.json` | ATIF trajectory: per-step thoughts, tool calls, token counts | Token accounting; where context blew up |
| `patches/<task>.patch` | The extracted diff — the *only* thing that becomes your score | Non-empty? Touches protected paths? Includes junk files? |
| `test_outputs/<task>.log` | Phase-2 pytest output | Read failures bottom-up; skip vs fail distinction |
| `summary.json` | Aggregate + per-repo resolved counts | The scoreboard you iterate against |

### 10.3 Controls that make runs interpretable (RQ-06.4)

- **Gold-patch control** (`--skip-agent-patch`): runs Phase 2 on the task's own gold patch. If gold doesn't resolve locally, *nothing* you do to the agent can — the task is broken locally (missing wheels, sandbox mismatch) and any score on it is noise.
- **Deterministic shards** (`--shard-index k --num-shards M`): the same task list every time, so a score delta is your change, not sampling. Keep shards fixed across experiments.
- **One-task iteration:** develop against a handful of known-fast task ids; run the full 129 only when you need a comparable number.
- **Temperature discipline:** the sample ships 0.2 for the coder — replicate it locally or your deltas measure sampling, not design.

### 10.4 Local-vs-scorer divergence register (RQ-06.5/06.6)

Every row here is a way a local result lies to you. Re-verify against the live discussion board (§15) before trusting a row's status.

| Dimension | Local (notebook/CLI) | Scorer | Consequence |
|---|---|---|---|
| ADK version | Whatever you pip-installed (likely ≥ 2.x) | **1.36.1** (observed twice) | YAML that validates locally can fail on scorer; semantics drift |
| Model registry | CLI registers extra aliases | `ALLOWED_MODEL_NAMES = {gemma-4-31b-it-qat-w4a16-ct}` only | Local acceptance of another alias means nothing |
| `gpu_memory_utilization` | 0.90 (Getting Started notebook) | 0.80 (README §3) | KV headroom differs; adapter tests locally ≠ scorer |
| Time pressure | Yours (fast GPU, one task) | 129 tasks sequential + 12 h global | Per-task budgets that feel fine locally can be run-killing at scale |
| Patch application | Same 4-pass logic | Same | (One thing that does transfer) |
| Today's patches | Whatever wheelhouse you attached | Host's current train, deployed silently | The 2026-09-30 promised fixes (§13) may be live on one and not the other |
| Network | Yours | Container A: network **none** | Anything your agent fetches (pip install, docs) works locally, fails on scorer |
| Failure wave attribution | — | "Notebook Threw Exception" waves with no host note (2026-10-01, §13 H-13) | A scorer failure may be infra, not your submission — check the board before debugging |

### 10.5 Debugging playbook when local says "fine" and the scorer says no (RQ-06.7)

1. Pull the exact submission that failed; byte-compare against your local directory (packaging drift is the #1 cause: zip built from the wrong level, stale wheelhouse).
2. Reproduce one shard locally with the current wheelhouse and read `logs/` + `summary.json` end to end — look for the failure signatures in §7.4.
3. Check §13's hazard register for a matching dated community report; check the board for a same-day failure wave before blaming your YAML.
4. Only then change the submission — and change **one thing**, because you get one scored run per day (§11.5) and the CV/LB anti-correlation (§13 H-10) means local numbers are direction, not truth.

---
## 11. Reference: tools, configs, serving, budgets, mechanics

**Consult-don't-memorize chapter. Everything here is version-pinned to the HARNESS_README 2026-09-25 build and re-verified against it 2026-10-01; anything community-sourced is marked and dated.**

### 11.1 The nine registered tools (HARNESS_README §6)

All budget-gated tools return a JSON string: success `{"status": "ok", ...}` or `{"status": "error", "error_type": ..., "error_message": ..., "details": {...}}`. When `tool_calls_used ≥ 20` **and** ≤ 10 remain, every response carries an extra `budget_warning` field telling the model to finalize and submit.

| # | Tool | Signature | Budget-gated | Key limits / behavior |
|---|---|---|---|---|
| 1 | `run_command` | `(command: str)` | Yes | `/bin/bash -c` in `/workspace`; timeout = min(300 s, remaining time); stdout+stderr truncated at **5,000 chars**; timeout returns `TimeoutExceeded` **without ending the session** |
| 2 | `submit_patch` | `()` | **No** | `git add -N .` + `git diff --binary` vs baseline; stores patch; after the current turn the harness **exits the loop immediately**; callable even at `tool_calls == max` |
| 3 | `get_status` | `()` | **No** | Live budget echo: calls used/remaining, time remaining, turns, patch state, sizes |
| 4 | `read_file` | `(filepath, start_line=None, end_line=None)` | Yes | Dual cap **150 lines AND 10,000 chars** per call; 1-indexed inclusive slice; `is_truncated` + `total_lines` returned; path `..` ⇒ `ValidationError`; `/workspace/` prefix auto-stripped |
| 5 | `edit_file` | `(filepath, old_string, new_string, allow_multiple=False)` | Yes | 3-tier matching (§11.2); multiple matches + `allow_multiple=False` ⇒ `FileEditError`, file untouched; empty file / empty `old_string` ⇒ `FileEditError`; returned `diff` truncated at 5,000 chars |
| 6 | `write_file` | `(filepath, content)` | Yes | Create-or-overwrite, `mkdir -p` parents |
| 7 | `get_code_neighbors` | `(node, edge_type=None, max_neighbors=50)` | Yes | Graph in/out-neighbors of a symbol; short-name resolution in 4 tiers (exact → `.`/`/` suffix → case-insensitive → substring); optional edge filter (`CALLS`, `DEFINED_IN`, `IMPORTS`) |
| 8 | `search_similar_code` | `(query, k=10)` | Yes | Cosine similarity over pre-computed node embeddings; **pass symbol names, not natural language** (offline resolver matches against node keys/suffixes); results embed full node `code` — **uncapped today** (§13 H-04) |
| 9 | `get_code_subgraph` | `(nodes: list[str])` | Yes | Induced subgraph: nodes + edges + counts; can be very large for broad symbols |

Tools 7–9 exist **per repo** only where pre-computed graph `.json` + embedding `.npz` data exist; the initial user prompt tells the agent when they do (§11.5's 7-section prompt, section 6).

### 11.2 `edit_file`'s 3-tier matching — why sloppy edits still land

1. **`exact`** — character-for-character substring after normalizing `\r\n` → `\n`.
2. **`flexible`** — line-by-line match with leading/trailing whitespace stripped per line; `new_string` is **auto-re-indented** to the matched block's baseline indentation.
3. **`regex`** — `old_string` tokenized around code delimiters `( ) : [ ] { } > = <`, tokens joined with `\s*`, so minor line-wrapping/spacing differences still match.

Practical reading: exactness of whitespace matters at tier 1 only, and indentation errors in `new_string` are forgiven at tier 2 — but **content** must still match, so the double-JSON escaping defect (H-03) that corrupts quotes defeats all three tiers equally (quotes are not delimiters in the tier-3 tokenizer). The returned `strategy` field tells you which tier fired — a run whose edits all land at `regex` is a run flirting with mismatch.

### 11.3 `generate_content_config` (snake_case, schema-enforced)

Sampling and thinking knobs, passed through to the Gemini-style config on each LlmAgent (usually via `!include configs/sampling.yaml`). Keys are **snake_case** (upstream Python uses camelCase in the SDK surface; the dialect schema validates snake_case). Execution-altering keys — `tools`, `system_instruction`, `http_options`, `safety_settings`, `response_schema` — are excluded by schema and raise if present. The shipped sample's values (SCHEMA-CHECKED, `sample_submission/configs/sampling.yaml`): `temperature: 0.2`, `top_p: 0.95`, `max_output_tokens: 16384`, `thinking_config: {thinking_budget: 4096, include_thoughts: true}`. Bounds: `max_output_tokens` 1–32,768 (default 16,384); `thinking_budget` 0–32,768 (default 4,096) — both hard-capped by `max_model_len`.

### 11.4 Serving and the adapter (LoRA) surface — currently gated

Scorer serving (HARNESS_README §3, `scripts/inference.py`): vLLM on `127.0.0.1:8000`, `tensor_parallel_size=4`, `gpu_memory_utilization=0.80` (~19.2 GiB usable/GPU), `max_model_len=32768`, `tool_call_parser="gemma4"`, `reasoning_parser="gemma4"`, `enable_thinking=True` by default, `enable_lora=True`, `max_loras=8`, `max_lora_rank=128`. The declared alias binds via `LiteLlm(model="openai/<alias>", api_base="http://127.0.0.1:8000/v1", num_retries=5)`. The local CLI additionally registers seven other Gemma aliases (bf16) — scoring accepts exactly `gemma-4-31b-it-qat-w4a16-ct`.

**Adapters:** PEFT directories under `adapters/<name>/` (`adapter_config.json` + `adapter_model.safetensors`), referenced per-agent as `adapter: <name>`; the compiler rewrites that agent's model id to `openai/<name>`. README sizing guidance: r=16 ≈ 110–220 MB (8 adapters fit < 3 GiB), r=32 ≈ 220–450 MB, r=64 ≈ 450–900 MB, r=128 ≈ 0.9–1.8 GB (1–3 fit). The shipped sample's adapter is demo-grade (r=4, α=8, q_proj+o_proj only, 217 KB) — it exists to exercise the pipeline, not to improve the model.

**Why gated (all community-sourced, live as of 2026-10-01 — §13 H-01):** (a) with LoRA enabled, effective KV capacity collapses to ~7,600 tokens (16 KV heads × 256 head_dim × 60 layers ≈ 246 kB/token/GPU at TP4; ~1.74 GiB/GPU free at 0.80) — a prompt the base model serves fine at 14k hangs; (b) an alias-zeroing bug silently disables adapters (240× loaded / 240× skipped in logs, `lora_b` all zero); (c) adapter-bearing submissions were still failing tonight (56719837: ~30 min, unhandled error, no score, while a byte-identical no-adapter bundle scored 0.06). Host fixes were promised 2026-09-30 14:40–16:40 UTC and were **not confirmed deployed** at verification time. **Do not submit adapters until §15's H-01 re-check clears.**

### 11.5 Consolidated budget and limit tables (HARNESS_README §7)

Participant-settable (`eval_config.yaml`, `evaluation:` key):

| Key | inference.py default | Sample ships | Env override (scorer scripts) |
|---|---|---|---|
| `max_time_minutes` | 60.0 | 1 | `SWE_MAX_TIME_MINUTES` |
| `max_tool_calls` | 100 | 10 | `SWE_MAX_TOOL_CALLS` |
| `max_turns` | 500 | 50 | `SWE_MAX_TURNS` / `SWE_MAX_LOOP_ITERATIONS` |
| `timeout_seconds` (single command) | 300 | 60 | `SWE_TIMEOUT_SECONDS` |

Host-fixed (not participant-settable): `max_stdout_chars` 5,000; `max_file_lines` 150; `max_file_chars` 10,000; nudges `max_nudges=3`; global run limit 12 h (currently errors the whole submission if hit); submission cadence 1 scored run/day. Time budget starts **after** container setup (`start_agent_session`), so wheel installation doesn't eat your minutes.

**The initial user prompt the model actually receives** (§5.2) has up to 7 sections: task header + problem statement; hints (only if non-empty); task budget echo; execution environment rules (including "offline — do not pip install"); standard instructions 0–5 (work under `/workspace`, verify with targeted tests, `submit_patch` when done); code-intelligence tools blurb (repo-conditional); workspace layout (`find . -maxdepth 3`, first 150 entries). Your `instruction` is the *system* prompt on top of this — do not duplicate what the harness already says.

### 11.6 Compaction, caching, retry — host-owned mechanics

Configured on the ADK `App` by the harness, not by you (§7.2 of the README):

| Mechanism | Parameters | What it means for you |
|---|---|---|
| Events compaction | interval 5 turns, overlap 2, `token_threshold` **14,336**, retention 5 | History compacts once the *previous* prompt exceeds ~14k tokens; your usable working history is therefore ~14k, not 32k |
| Context caching | min 2,048 tokens, TTL 1,800 s, 10 intervals | Prompt-prefix reuse — invisible to you, but explains why re-reading the same file twice is cheaper than it looks |
| `ModelRetryPlugin` | 5 retries, 2.0 s initial, 2.0× backoff, 60 s cap, ±20% jitter, on 429/500/502/503/504/RateLimit/APIConnection/APITimeout | Transient serving errors are absorbed — you never code retries |

**Conflict flag (V0, unresolved):** the current README says threshold 14,336; an older README said 32,768, and tonight's overflow analysis (§13 H-02) measured ~12% overflow at 14,336 vs 17–33% at 32,768 — consistent with the scorer running 14,336 but not proof. Design to the smaller number; it is also the safer one.

---

## 12. Worked architectures (RQ-10 series)

Three deliberate shapes, ordered by cost. All YAML is ILLUSTRATIVE unless marked; all assume the model alias `gemma-4-31b-it-qat-w4a16-ct` on every agent and an `eval_config.yaml` per §5.6. Companion files live in `examples/`.

### Architecture A — the tight single agent (Essentials-plus)

```yaml
# agent.yaml — everything in one head (ILLUSTRATIVE; see examples/arch-a-single.md)
name: coder
model: gemma-4-31b-it-qat-w4a16-ct
instruction: !include prompts/system.md
tools: [read_file, edit_file, write_file, run_command, get_status, submit_patch]
generate_content_config: !include configs/sampling.yaml
```

`prompts/system.md` carries the working discipline: read narrowly → smallest edit → targeted test (`python3 -m pytest <file>::<test> -q`) → cleanup scratch to `/tmp` → `submit_patch`. **Use when:** tasks are mostly surgical; you want the cheapest possible turn structure and the cleanest ablation baseline. **Cost profile:** ~4–8 turns/task, one context. **Failure modes:** exploration landfill in the single context (mitigate via §7.3 levers 1–2); no isolation between searching and editing. **Evidence:** prompts-only single agents are the public 0.05–0.12 LB shape (community-reported, thread 743140, 2026-09-24 — uncontrolled).

### Architecture B — root coder + analyzer `agent_tool` (the official sample shape)

Root as in Architecture A plus:

```yaml
# appended to root tools: (structure SCHEMA-CHECKED against sample_submission/)
  - agent_tool:
      config_path: sub_agents/code_analyzer.yaml
      skip_summarization: true
```

with a read-only `code_analyzer` (§6.1's verbatim shape): analyzer holds `read_file`, `search_similar_code`, `get_code_neighbors`, `get_code_subgraph`; its final text — coordinates, root-cause notes — is all the root sees. **Use when:** repos/tasks need real exploration; you want the root context to stay small and stable across tasks. **Cost profile:** +1–2 turns/task vs A. **Failure modes:** forgetting `skip_summarization: true` (isolation evaporates); analyzer hallucinating locations the root then trusts — have the root re-verify the exact lines with one narrow `read_file` before editing. **Evidence:** this is the shipped starter-kit shape (SCHEMA-CHECKED) — the host's own recommendation for context discipline (README gotcha #4).

### Architecture C — Sequential pipeline plan → edit → verify (Intermediate-plus)

```yaml
# agent.yaml (ILLUSTRATIVE; see examples/arch-c-pipeline.md)
agent_class: SequentialAgent
name: repair_pipeline
sub_agents:
  - config_path: sub_agents/planner.yaml    # output_key: repair_plan; include_contents: none
  - config_path: sub_agents/coder.yaml      # instruction templates {repair_plan}; holds the mutating tools
  - config_path: sub_agents/verifier.yaml   # runs the targeted test; output_key: verify_verdict
```

Planner reads the problem + graph data and emits a short plan (`output_key: repair_plan`); coder's instruction consumes `{repair_plan}` and does the edit; verifier runs the targeted pytest and reports. **Use when:** your single agent keeps *planning well but executing sloppily* (or vice versa) and you want per-stage instructions/sampling. **Cost profile:** +2 turns minimum; every stage boundary is a model call. **Failure modes:** plan drift (the coder discovers the plan is wrong mid-edit and has no channel back — LoopAgent would give you cycles but at full price, §6.2); `include_contents: none` on a stage that actually needed history. **Evidence:** no public leaderboard datapoint for this shape as of 2026-10-01 — treat as unproven here, priced before trusted.

**Deliberately not recommended tonight:** parallel scout fan-outs (KV pressure on 4×L4 with no shared state benefit), LoopAgent polish loops (no early exit ⇒ fixed cost), adapter-carrying variants (§11.4 gate), skills-heavy builds before one cheap end-to-end validation (§6.4).

---
## 13. Hazard register: known defects and traps, ordered by cost

Ordered by expected score impact. **Tier:** T1 = host-confirmed in code/README; T2 = host-acknowledged on the board; T3 = community-reported with repro; T4 = single report/inference. **Status and dates are UTC, as of 2026-10-01 ~03:45.** Every host "fix promised" below was promised on 2026-09-30 (14:40–20:40) with **no deployment confirmation** found — treat statuses as pre-deployment.

| ID | Hazard | Tier | Status | Why it costs you |
|---|---|---|---|---|
| H-01 | Adapter track gated: KV collapse + silent zeroing + failing adapter submissions | T3 (2 repro threads + host ack) | Open | Whole LoRA strategy unavailable; adapter submissions burn daily slots for 0 |
| H-02 | Context overflow ⇒ `ContextWindowExceededError` ⇒ fallback skipped ⇒ **empty patch ⇒ 0** | T3 (44/44 measured) + host ack ("will look into it", 09-30 19:40) | Open | A good session scores zero if it overflows near the end |
| H-03 | Tool results double-JSON-escaped on the way to the model | T3 (22%/62%/0% experiment) + host ack ("addressing now", 09-28) | Open, fix unconfirmed | ~22% of `edit_file` calls fail `old_string not found`; inflated context |
| H-04 | `search_similar_code` returns uncapped node code | T2 (host: "will limit to max_stdout_chars") | Open | One broad query → 100k+ chars → overflow (H-02) → task dead |
| H-05 | Thinking tokens dropped: vLLM 0.19.1 reads `reasoning`, ADK 1.36.1 sends `reasoning_content` | T3 (tokenize repro + 636-run baseline) + host ack ("patch incoming", 09-30 18:40) | Open | `include_thoughts: true` currently buys nothing; reasoning-heavy prompts silently degrade (and next-prompt growth 0.35× vs 1.1× suggests lost context) |
| H-06 | `read_file` with `start_line`/`end_line` raises TypeError | **T1** (host-confirmed bug, "fix incoming" 09-30 20:40) | Open | Line-range reads fail; model may flail |
| H-07 | 12 h global run limit **errors the entire submission** | T1 (behavior) / T2 (planned fix: score unfinished as 0 — unconfirmed) | Open | One overrun day = no score that day |
| H-08 | A failed submission still consumes the daily slot | T3 (9/26 wave; host granted reruns then — goodwill, not policy) | Open | Cheap to lose a day to packaging/workflow mistakes |
| H-09 | Compaction `token_threshold` ambiguity: 14,336 (current README) vs 32,768 (older README; scorer value unconfirmed) | T1/T3 conflict | Unresolved | Your effective-history assumption may be off by 2.3× |
| H-10 | CV/LB anti-correlation: public-129 tuning ≠ hidden-split gains | T3 (multiple participants, dated 09-24→30) | Standing risk | Overfitting the public split actively hurts |
| H-11 | Scorer's ADK (1.36.1) not in the wheelhouse dataset; local `pip install` gives a different ADK | T3 (dataset inspection ×2) | Standing | Local validation is advisory, not authoritative |
| H-12 | 2026-09-30 patch train (thinking, read_file, search cap, LoRA sizing) deployment status unknown | T2 (promises without confirmations) | Open | Today's local findings may not match today's scorer |
| H-13 | 2026-10-01 "Notebook Threw Exception" wave: 4 submissions, no host replies (incl. prompt-only and adapter-bearing) | T3 | Open | Scorer failures may be infra — check the board before debugging your YAML |
| H-14 | Scoring wall-clock 12–14.5 h (community-measured, L4×4) vs the 12 h limit | T3 | Open | Even healthy runs flirt with H-07 |

**Per-hazard essentials** (signature → defense → removal criterion):

- **H-01.** Signature: submission runs ~30 min, no score, unhandled error; logs show 240× "Successfully loaded LoRA weights … language_model.model.layers.N" + 240× "No LoRA weights found … self_decoder.decoder_layers.N"; `/v1/models` missing the adapter entry (or adapter dirs expected at submission **root** by your notebook code). Defense: ship adapter-free; if experimenting, verify `discover_adapters` paths and expect KV ceiling ~7,600 tokens. Removal: host confirms loras-sizing patch deployed **and** a community adapter submission scores.
- **H-02.** Signature: `ContextWindowExceededError` in the log tail; `patches/<id>.patch` empty despite edits in the transcript. Defense: §7.3 discipline — stay under ~14k history; narrow searches; split edits. Removal: host confirms fallback-on-overflow (or H-09 resolves to 14,336 and you simply never overflow).
- **H-03.** Signature: `error_type: "FileEditError"` clusters; transcripts show `\\\"` walls in tool results. Defense: quote-free `old_string` anchors; `write_file` for new files; teach double-un-escape. Removal: host confirms the raw-text (0%-failure) fix; re-run the 30-context experiment.
- **H-04.** Signature: one `search_similar_code` result measured in tens of kB, then overflow. Defense: symbol-name queries only; `k` small; prefer `get_code_neighbors` (names) → one targeted `read_file`. Removal: host confirms the `max_stdout_chars` cap.
- **H-05.** Signature: `/tokenize` shows thought tokens with `reasoning` key but not `reasoning_content`; traces show `reasoning_content` fields never echoed. Defense: keep `thinking_budget` moderate (4,096), keep instructions self-sufficient (don't rely on the model remembering its own thoughts). Removal: host confirms the parser fix; spot-check a trace for returned thoughts.
- **H-06.** Signature: TypeError immediately after a ranged `read_file`. Defense: full-file reads (then slice mentally) or integer-only args; re-test after patch. Removal: host confirmation + one clean ranged read in a trace.
- **H-07/H-14.** Signature: run dies at 12 h with unfinished tasks; LB wall-clock 12–14.5 h. Defense: per-task `max_time_minutes` 3–5 failsafe; efficient prompts; accept forfeiting the hardest tasks. Removal: host ships score-unfinished-as-0.
- **H-08.** Signature: instant failure, slot gone. Defense: the SOP (§5.7) — Save Version first, then Submit; validate before submitting. Removal: none expected — process discipline is the fix.
- **H-09.** Signature: overflow rates ~12% (14,336) vs 17–33% (32,768) across your runs. Defense: design to 14,336. Removal: host states the scorer's value.
- **H-10.** Defense: change one variable at a time; prefer interventions justified by mechanism (context discipline, edit reliability) over leaderboard micro-tuning. Removal: none — it is the competition's structure.
- **H-11/H-12.** Defense: validate through the pinned compiler path; re-read the board before each submission. Removal: host ships the harness environment to the wheelhouse.
- **H-13.** Defense: before debugging, check whether same-day submissions from others also failed. Removal: host post-mortem.

---

## 14. Conflicts, contradictions, and limitations of this research

**Unresolved source conflicts (both positions kept, no side picked):**

| # | Conflict | Position A | Position B | Our treatment |
|---|---|---|---|---|
| C1 | Compaction threshold | 14,336 (README 2026-09-25 build) | 32,768 (older README; tonight's measured 17–33% overflow rate implies some runs see it) | Design to 14,336 (H-09); flag V0 |
| C2 | `gpu_memory_utilization` | 0.80 scorer (README §3) | 0.90 Getting Started notebook | Divergence-register row (§10.4); adapter experiments unreliable until resolved |
| C3 | Sample `eval_config` values | Demo values (1 min / 10 calls / 50 turns / 60 s) | Harness defaults (60 / 100 / 500 / 300) | §5.6 treats sample values as demo-only; defaults are the real baseline |
| C4 | Adapter zeroing fix | "Landed in v23 (now v25) of the wheelhouse" | v25 repro shows no effect (but only `lora_B` randomized) | H-01 stays gated; repro was one-sided |
| C5 | Task order / public-first | Fixed order, public tasks interleaved (host, thread 743063) | Unanswered whether public tasks run first per run | §7.5 marks front-loading strategies as unbuildable today |

**Research limitations, stated plainly:**

1. **No scorer or sandbox access** — nothing here is VALIDATED; no example was executed against the live scoring path. All SCHEMA-CHECKED items are structural verifications only.
2. **Discussion-board evidence decays fast** — T2/T3 items carry timestamps; several will be stale within days of the 2026-10-01 verification sweep. The host was mid-patch-train at verification time.
3. **Relative timestamps** — board times were reconstructed from "Xh ago" markers relative to ~03:40 UTC 2026-10-01; ±hours accuracy, not minutes.
4. **Sample-submission adapter is demo-grade** — any statement about adapter *quality* is about a 217 KB r=4 demo, not about what a real adapter would do.
5. **Upstream behavior cited for semantics** (workflow agents, templating) is verified against upstream docs/schema at the harness's 1.36.1 level, but the dialect's compiled runtime could still differ in unobserved corners (e.g., the LoopAgent no-early-exit inference is V1, not T1).

---

## 15. Re-check list (what expires, where to look, what changes)

| What to re-check | Where | If changed, update |
|---|---|---|
| H-01 adapter gate | Board threads 744331, 743508 + any new adapter submission scoring | §11.4, §13 H-01, Architecture appendix guidance |
| H-02 overflow fallback | Thread 744692 + host confirmations | §9.2, §7.3, §13 |
| H-03 escaping fix | Thread 744272; re-run the 30-context experiment | §7.3 lever 3, §11.2, §13 |
| H-04 search cap | Thread 744577; try a broad query locally | §7.3 lever 2, §11.1 |
| H-05 thinking fix | Thread 744354; inspect a trace for returned thoughts | §7.3 lever 5, §11.3, §13 |
| H-06 read_file fix | Thread 744678; one ranged read | §11.1, §7.3 lever 1 |
| H-07 global-limit behavior | Any host note; failed-at-12h submissions | §7.5, §13 |
| H-13 failure waves | Board, day of submission | §10.4, §10.5 |
| Wheelhouse version (v25 → v26…) | Dataset page | §10.1, §10.4 |
| HARNESS_README build | Dataset file MD5 vs the 2026-09-25 one cited in the header | Every §11 table |
| Scorer ADK version (1.36.1) | New participant observation threads | §3.1, §10.4 |
| Upstream ADK version (2.10.0) | PyPI | Header pin, §3 |
| LB shape (0.05–0.12 prompts-only band) | Leaderboard | §6.0, §12 evidence notes |

**Expiry of this document's fast-decaying content:** hazard statuses (§13) — days; divergence rows tied to harness behavior — weeks; concepts and lifecycle — months. Re-verify §13 before any submission decision made after ~2026-10-07.

---
## 16. Glossary (upstream name · former/alias · dialect equivalent)

| Term | Upstream ADK name | Former / alias | Competition-dialect equivalent |
|---|---|---|---|
| The thing that talks to a model | `LlmAgent` | `Agent` (alias) | `agent_class: LlmAgent` (default when omitted) |
| Deterministic containers | `SequentialAgent` / `ParallelAgent` / `LoopAgent` | "workflow agents" (pre-2.0); "templated workflows" | Same names via `agent_class:` — the **only** composition mechanism |
| 2.x composition model | graph / dynamic workflows, `BaseNode` | — | **Does not exist** (harness is ADK 1.36.1) |
| YAML authoring | Agent Config (`adk create --type=config`, `root_agent.yaml`) | — | Restricted declarative dialect (`agent.yaml` family; different schema) |
| YAML loader | `config_agent_utils.from_config()` | — | `compile_submission` (no `importlib`, closed registries) |
| Agent-as-tool | `AgentTool(agent, description, tool_args, skip_summarization)` | — | `agent_tool: {config_path, skip_summarization}` mapping under `tools:` |
| Transfer delegation | `sub_agents` + `transfer_to_agent` | — | Same field, closed to compiled agents |
| Prompt file inclusion | — (does not exist upstream) | — | `!include <path>` (dialect-only; depth 10, cycle + traversal checks) |
| State write | `output_key` | — | Same |
| State read | `{var}` templating; `{var?}` optional; `{artifact.var}` | — | Same core; state = harness-seeded session state |
| Conversation visibility | `include_contents` | — | Same (`default` / `none`) |
| Transfer pruning | `disallow_transfer_to_parent/peers` | — | Same |
| Shared top-level prompt | `global_instruction` | deprecated upstream → `GlobalInstructionPlugin` | Listed in README §2.2 include targets; **avoid** (§3.6) |
| Sampling config | `generate_content_config` (camelCase SDK surface) | `generation_config` (older GenAI SDKs) | Same name, **snake_case** keys, execution keys excluded |
| Tool registry | any function / builtin / OpenAPI / MCP / toolset | — | `ToolRegistry`: exactly 9 tools + AgentTools |
| Model registry | any provider, `LiteLlm(...)` | — | `ModelRegistry` alias; scoring allows exactly `gemma-4-31b-it-qat-w4a16-ct` |
| Skills | `skills:` (Experimental, v1.25.0+) | agentskills spec | Present (dialect addition relative to upstream *Agent Config*); `SKILL.md` format |
| Callbacks | `before/after_agent/model/tool` | — | Closed `CallbackRegistry` — no participant surface |
| Plugins | `ModelRetryPlugin`, `GlobalInstructionPlugin`, … | — | Host-installed only (`ModelRetryPlugin` visible in behavior) |
| Context management | `EventsCompactionConfig`, `ContextCacheConfig` on `App` | — | Host-fixed (§11.6) |
| Loop early exit | `exit_loop` escalation / callbacks | — | **Not reachable** (V1: no documented early exit; §6.2) |
| Session identity | `app_name`, `user_id` free | — | Fixed: `swegemma_eval` / `eval_user` |
| Code execution | `code_executor`s (built-in, vertex, unsafe) | — | None — the *sandbox command* `run_command` is the substitute |
| The patch unit | — | — | `submit_patch()` / fallback `git diff --binary` vs `_swegemma_baseline` |
| Container A / B | — | — | Phase-1 agent sandbox / Phase-2 verification sandbox (fresh) |
| Adapter | — (n/a) | LoRA | `adapters/<name>/` + `adapter:` field — dialect-only, gated (H-01) |
| Budget config | — | — | `eval_config.yaml` → `evaluation:` 4 keys |
| Scoring metric | — | — | Resolution Rate = resolved tasks / split size |

---

## 17. Source list (grouped by class; all retrieval dates UTC)

**S1 — Official competition artifacts (Tier-1 ground truth):**

| ID | Source | Version / build | Retrieved | Tier |
|---|---|---|---|---|
| S1.1 | `HARNESS_README.md` (competition data package) | build 2026-09-25 18:40 UTC, MD5 `10e36e8e7c01035d7f420c3b8cd1e075` | 2026-09-30 (full read), re-checked 2026-10-01 | V3-source |
| S1.2 | `sample_submission/` tree (agent.yaml, sub_agents/code_analyzer.yaml, configs/sampling.yaml, prompts/*, eval_config.yaml, adapters/main_lora/*) | same build | 2026-09-30, byte-level | V3-source |
| S1.3 | Competition overview page + evaluation/terms pages (Kaggle) | live | 2026-09-30 | V3-source |
| S1.4 | Official wheelhouse dataset (v25) — contents inspected for harness wheels | v25 (2026-09-30) | 2026-09-30/10-01 | V3-source (for the absence claim) |

**S2 — Live Kaggle discussion board (host statements + community repros; tiered per item):**

| ID | Thread | What it established | Latest host/participant statement seen | Tier |
|---|---|---|---|---|
| S2.1 | 743063 | Task order fixed; sequential; `max_time_minutes` failsafe advice; 12 h global behavior | 2026-09-24 → 29 | V1-community / host-stated |
| S2.2 | 743683 | Save-Version-then-Submit SOP; 9/26 failure wave mechanics | 2026-09-26 → 28 | V1-community |
| S2.3 | 743140 | Prompts-only single-agent 0.12 LB notebook | 2026-09-24 | V1-community |
| S2.4 | 743508 | Adapter silent-zeroing mechanism (240×/240× logs; double layer registration); wheelhouse v23→v25 fix claim | 2026-09-30 14:40 | V1-community + host ack |
| S2.5 | 744272 | Double-JSON escaping experiment (22%/62%/0%); host "addressing now" | 2026-09-28 → 30 | V1-community + host ack |
| S2.6 | 744331 | KV-collapse mechanics (246 kB/token/GPU; ~7,600-token ceiling); `--max-loras` forced; adapter submission failure 56719837 | 2026-09-30 16:40 → 22:04 | V1-community + host ack |
| S2.7 | 744354 | Thinking-drop root cause (vLLM `reasoning` vs ADK `reasoning_content`); 636-run baseline; harness stack versions (1.36.1) | 2026-09-30 18:40 | V1-community + host ack |
| S2.8 | 744577 | `search_similar_code` uncapped; host cap promise | 2026-09-30 18:40 | V2-host-ack |
| S2.9 | 744678 | `read_file` line-range TypeError — **host-confirmed** | 2026-09-30 20:40 | T1/V2-host-confirmed |
| S2.10 | 744692 | Overflow ⇒ skipped fallback ⇒ empty patch (44/44); threshold 14,336 vs 32,768 question; second 1.36.1 observation | 2026-09-30 19:40 | V1-community + host ack |
| S2.11 | 744153 | Zip-submission UI error (minor) | 2026-09-28 | V1-community |
| S2.12 | 2026-10-01 wave threads (submissions 56722615, 56739788, 56740049, +1) | "Notebook Threw Exception" cluster post-wheelhouse-update | 2026-10-01 00:48–01:04 | V1-community |

**S3 — Upstream ADK (primary):**

| ID | Source | Version | Retrieved | Tier |
|---|---|---|---|---|
| S3.1 | PyPI `google-adk` JSON | 2.10.0 (2026-09-25T19:02Z) | 2026-10-01 | V3-source |
| S3.2 | google/adk-python releases | incl. 1.39.1 (2026-08-27), 2.0.0 GA (2026-05-19) | 2026-10-01 | V3-source |
| S3.3 | `config_schemas/AgentConfig.json` @main | main @ 2026-10-01 | 2026-10-01 | V3-source |
| S3.4 | adk.dev: agents-config, agents, tools, multi-agents, sessions-state, compaction, skills, vLLM/Gemma, 2.0 landing, changelog | live @ 2026-09-30/10-01 | fetched, timestamps in scratch | V3-source |
| S3.5 | agentskills.io skill spec | live | 2026-09-30 | V3-source |
| S3.6 | vLLM issues #38488 / PR #42664 | **cited in S2.7, not independently opened** | — | V1-community-cited |

**Source-interest note (per §14 duty):** S1 is the host's own documentation — authoritative for the contract but written to showcase, not to document defects; every hazard in §13 comes from S2 (participants) or host acks inside S2. S3 documents the product the host *forked away from*; its "Supported in vX" banners are the main vehicle of reader error, hence the version-pin discipline in §3.

---

## 18. Appendices

### Appendix A — Complete upstream-vs-dialect divergence table

The standalone sidecar `adk-competition-divergence.md` duplicates this table. "Upstream" = google-adk as documented at 2.10.0 with 1.x behaviors noted; "dialect" = `adk-submission` per HARNESS_README 2026-09-25 + observed harness stack (ADK 1.36.1).

| # | Dimension | Upstream ADK (version noted) | Competition dialect | Reader consequence |
|---|---|---|---|---|
| A1 | Runtime version | 2.10.0 current; 1.39.1 last of 1.x | **1.36.1** (observed ×2) | All 2.x features absent; even late-1.x fixes may be |
| A2 | Authoring surface | Python code (full), Agent Config YAML (experimental), graphs (2.x GA) | Declarative YAML/MD/JSON/safetensors only | No Python entrypoints at all |
| A3 | Config loading | `from_config()` resolves dotted module refs (`tools: - name: pkg.fn`) | `compile_submission`, no `importlib`, closed registries | Code references don't exist; unknown names fail validation |
| A4 | Agent Config model support | Gemini-only | Local vLLM Gemma alias | Upstream config docs mislead on model fields |
| A5 | Model choice | Any provider via LiteLlm/Gemini/vertex | Exactly `gemma-4-31b-it-qat-w4a16-ct` (scoring) | `ParticipantVisibleError` otherwise |
| A6 | `tools:` syntax | `- name: x` mappings (builtins or your functions) | Bare strings from 9-tool registry + `agent_tool:` mapping | Name-keyed mapping form is invalid here |
| A7 | Tool universe | Functions, builtins (search, maps), OpenAPI, MCP, toolsets, artifacts | 9 sandbox tools + AgentTool | No search/MCP/OpenAPI whatsoever |
| A8 | AgentTool parameters | `AgentTool(agent, description, tool_args, skip_summarization)` | `{config_path, skip_summarization}` only | No custom tool description/args schema |
| A9 | Prompt includes | None | `!include` (md/txt raw, yaml recursive, depth 10) | Dialect-only; upstream readers won't know it exists |
| A10 | Adapters | n/a | `adapters/` + per-agent `adapter:` (gated, H-01) | Dialect-only feature — currently a trap |
| A11 | Skills | Experimental (v1.25.0+) | Present (dialect addition vs Agent Config) | Validate before leaning on it |
| A12 | Callbacks | 8 hook points, your functions | Closed `CallbackRegistry` | No guardrails/observability hooks for you |
| A13 | Instruction logic | `InstructionProvider` functions, dynamic | Static text + `{var}` templating only | Logic must live in prompts |
| A14 | Templating details | `{var}`, `{var?}`, `{artifact.var}`; 2.10 changed `${var}` handling | 1.x single-brace semantics | Missing required key ⇒ error; escape via phrasing |
| A15 | `global_instruction` | Deprecated → plugin (code-only) | README lists it as include target | Avoid; use shared `!include` per agent |
| A16 | Composition model | Templated workflows "superseded" by graph/dynamic (2.x) | The 4 template classes only | Everything 2.x-marketed is absent |
| A17 | Loop early exit | `exit_loop` escalation, callbacks | Not reachable (V1) | Price loops as `max_iterations × body` |
| A18 | State scopes | `user:`/`app:`/`temp:` prefixes | Session state (harness-seeded) only in practice | Don't rely on prefix semantics |
| A19 | Sampling config case | camelCase SDK surface | snake_case schema keys | Wrong case fails schema |
| A20 | Execution-altering config keys | Settable via code | Excluded (`tools`, `system_instruction`, `http_options`, `safety_settings`, `response_schema`) | Config is sampling-only |
| A21 | Root config | `root_agent.yaml` via `adk create` | `agent.yaml`/`agent.yml`/`root_agent.yaml`/`root_agent.yml`, exactly one | Discovery errors are the #1 first-day failure |
| A22 | Structural limits | None of these | 3 GiB, 10k files, 1k YAMLs, 500 agents, depth 50, … (§4.4) | Hard budget planning required |
| A23 | Compaction | Configurable per App | Host-fixed (interval 5, overlap 2, threshold 14,336†, retention 5) | ~14k effective history — design to it |
| A24 | Prefix caching | Configurable | Host-fixed (2,048 / 1,800 s / 10) | Free speed, no control |
| A25 | Transient retries | Your code/plugins | Host `ModelRetryPlugin` (5×, 2 s→60 s) | Never implement retries in prompts |
| A26 | Session identity | Free `app_name`/`user_id` | Fixed `swegemma_eval`/`eval_user` | Irrelevant but explains traces |
| A27 | Code execution | `code_executor`s | `run_command` in the task container (offline) | The *only* execution surface |
| A28 | Event schema | 2.x adds `node_info`, `output`; manual appends forbidden | 1.x events | Trace formats differ from 2.x docs |
| A29 | Multi-LoRA routing | n/a | `openai/<adapter-name>` rewrite per agent | Whole adapter surface is dialect-only |
| A30 | Environment pinning | You pick versions | Wheelhouse (v25) + invisible scorer env | Local acceptance ≠ scorer acceptance |

† threshold per current README; older README and tonight's measurements disagree — H-09/C1.

### Appendix B — Example catalog (files in `examples/`)

| File | Badge | Teaches | Breaks when |
|---|---|---|---|
| `ex-01-minimal-agent.yaml` | ILLUSTRATIVE | Smallest valid root (§5.2, Example 5-1) | Renamed/nested root; second root added |
| `ex-02-eval-config.yaml` | SCHEMA-CHECKED | The 4 budget fields with sane failsafe values | Values copied from sample's demo numbers |
| `ex-03-sampling.yaml` | SCHEMA-CHECKED | Sampling + thinking config (sample's values) | camelCase keys; execution keys added |
| `ex-04-system-prompt.md` | ILLUSTRATIVE | Instruction discipline (read→edit→test→submit; escaping rules) | JSON examples with `{var}`-shaped braces |
| `ex-05-analyzer-subagent.yaml` | SCHEMA-CHECKED | Read-only `agent_tool` leaf, `../` includes | `skip_summarization` omitted |
| `ex-06-root-with-agent-tool.yaml` | SCHEMA-CHECKED | Root attaching the analyzer (sample shape) | Mutating tools given to the analyzer |
| `ex-07-sequential-pipeline.yaml` | ILLUSTRATIVE | Architecture C (plan→edit→verify) | Stages needing conversation get `include_contents: none` |
| `ex-08-loop-gated.yaml` | ILLUSTRATIVE | LoopAgent priced honestly (full iterations) | Used hoping for early exit |
| `ex-09-skill/SKILL.md` | ILLUSTRATIVE | Skill frontmatter + progressive-disclosure body | Oversized body; misleading description |
| `ex-10-what-not-to-submit.md` | ILLUSTRATIVE | The M1–M12 mistakes as YAML anti-examples | — (it *is* the failure gallery) |

### Appendix C — Complete limits and defaults, one table (versions pinned)

| Limit / default | Value | Set by | Source build |
|---|---|---|---|
| Unpacked submission size | < 3 GiB (3,221,225,472 B) | Hard | README 2026-09-25 |
| Files / YAML files | 10,000 / 1,000 | Ceiling | 〃 |
| Per-YAML size (incl. includes) | 50 MiB | Ceiling | 〃 |
| Per-skill dir | 50 MiB | Ceiling | 〃 |
| Instruction chars per agent / total | 1,000,000 / 10,000,000 | Ceiling | 〃 |
| Agents / nesting depth / skills / loop iters | 500 / 50 / 1,000 / 500 | Ceiling | 〃 |
| `max_output_tokens` | 1–32,768 (default 16,384) | Hard (vLLM) | 〃 |
| `thinking_budget` | 0–32,768 (default 4,096) | Hard (vLLM) | 〃 |
| Context window | 32,768 tokens | Hard | 〃 |
| Session time / tool calls / turns | 60 min / 100 / 500 (inference.py defaults) | You (`eval_config.yaml`) | 〃 |
| Single command timeout | 300 s | You (`timeout_seconds`) | 〃 |
| `max_stdout_chars` | 5,000 | Host | 〃 |
| `read_file` lines / chars | 150 / 10,000 | Host | 〃 |
| Nudges | max 3 consecutive | Host | 〃 |
| Compaction | interval 5 / overlap 2 / threshold 14,336† / retention 5 | Host | 〃 |
| Prefix cache | 2,048 tok / 1,800 s / 10 intervals | Host | 〃 |
| Model retries | 5×, 2.0 s→60 s, 2.0×, ±20% jitter | Host | 〃 |
| Global run limit | 12 h (errors whole submission today) | Host | host-stated 2026-09-24→29 |
| Submission cadence | 1 scored run / day | Host | competition page |
| Container A/B resources | 4 GiB RAM, 2 vCPU, network none | Host | README 2026-09-25 |
| Scoring wall-clock (observed) | 12–14.5 h on L4×4 | — | community, 2026-09-24→30 |

### Appendix D — Search and research log (including negative-claim searches)

Engine note: all web access via the research-toolkit fetch driver (headless Chromium; Google SERP headed where needed) on 2026-09-30 → 2026-10-01; zero MCP quota used; $0 paid engines. Board times reconstructed from relative "Xh ago" markers (~03:40 UTC reference). Hit counts are pages/threads actually opened after screening (SERP top-10 screens); where a count is approximate it is marked `~`.

| # | Date (UTC) | Query / intent | Screened | Kept | Feeds |
|---|---|---|---|---|---|
| D1 | 09-30 | Kaggle "Gemma 4 Developer Agent" competition + discussion board (board sweep, all threads) | ~40 threads | 12 (S2.1–S2.12) | §13, §11.4 |
| D2 | 09-30 | Re-verification sweep of hazard threads 743508/744272/744331/744354/744577/744678/744692 | 7 | 7 | §13 statuses |
| D3 | 09-30/10-01 | adk.dev agents-config page (upstream Agent Config) | 1 | 1 | §2, §3.3, A4–A6 |
| D4 | 10-01 | google/adk-python `config_schemas/AgentConfig.json` @main (raw) | 1 | 1 | §4.3, A-table |
| D5 | 10-01 | adk-changelog (full 474 KB) for version/GA/stability dates | 1 | 1 | §3.1, §3.5 |
| D6 | 10-01 | PyPI google-adk JSON | 1 | 1 | header pin |
| D7 | 09-30/10-01 | adk.dev concept pages: agents, tools, multi-agents, sessions-state, compaction, skills, vLLM/Gemma, 2.0 landing | ~15 | 10 | §3, §6 |
| D8 | 09-30 | Kaggle overview/evaluation/rules pages (re-fetch with 5 s wait — SPA render) | 3 | 3 | §9, §11.5 |
| D9 | 09-30 | agentskills.io spec | 1 | 1 | §6.4 |
| D10 | 10-01 | Tonight's failure-wave threads (post-wheelhouse-update) | 4 | 4 | H-13 |

**Negative-claim searches (each "you cannot do X" in this tutorial traces here):**

| Claim | Where asserted | Searched | Result | Inclusion criteria |
|---|---|---|---|---|
| No early exit for dialect LoopAgent | §6.2, A17 | README §6 tool registry (9 tools enumerated); §2.3 field tables; upstream exit_loop docs | `exit_loop` absent from registry; no callback surface in schema | Registry enumeration + schema field list = exhaustive for the dialect |
| Scorer's google-adk not in wheelhouse | §10.1, H-11 | wheelhouse v25 archive listing (grep `adk`, wheel-name scan) | No harness `google-adk` wheel present (test-dep wheels only) | Archive contents inspectable directly |
| No participant callback surface | §4.3, A12, M6 | README §2 + AgentConfig.json field list | No `*_callbacks` accepted in dialect docs; upstream has them | Absence in both contract docs |
| No upstream `!include` / `adapter:` / `skills:` in Agent Config | A9–A11 | AgentConfig.json @main (key scan) | Keys absent upstream; all three present in dialect docs | Raw schema enumeration |
| No community end-to-end skills-on-scorer report | §6.4 | Full board sweep D1+D2 | 0 threads reporting skill usage on scorer | Any thread mentioning `skills:`/`SKILL.md` |
| No VALIDATED examples possible | header | (environmental: no scorer/sandbox access in this research) | — | n/a — access limitation, stated |
| Task order / public-first question unanswered | §7.5, C5 | Thread 743063 (question posted 2026-09-28) | No host reply as of 2026-10-01 sweep | Host reply in-thread |
| Graph workflows absent | A16 | README §2.3 `agent_class` enumeration | Only 4 classes listed | Contract enumeration |
| `thinking_level` not used by sample | §11.3 | sample sampling.yaml inspection | Only `thinking_budget` + `include_thoughts` | File inspection |

### Appendix E — Verification ledger, badge audit, traceability matrix

**Badge audit:** VALIDATED — **0** (by policy: no scorer access; any occurrence would be a defect). SCHEMA-CHECKED — structural claims tied to S1.1/S1.2 or the raw upstream schema (S3.3). ILLUSTRATIVE — everything constructed. No badge inflation found in the second pass (audit checklist item 3, below).

**Claim-tier ledger (load-bearing claims):** version pins (header, §3.1) = V3-source (S3.1, S3.2). Dialect contract (§4, §11) = V3-source (S1.1, S1.2). Workflow/templating semantics (§6) = V2-doc (S3.4, version-filtered ≤1.36.1). Hazard statuses (§13) = V1-community unless marked T1/T2. LoopAgent no-early-exit = V1 inference. Compaction threshold scorer value = V0-excluded (conflict C1).

**Traceability matrix (schema per the commissioning handoff; one row per RQ cluster):**

| objective_id | rq_id | workstream_id | tutorial_chapter | claim_ids | source_ids | source_version | verification_tier | example_badge | confidence | alternatives_considered | known_gap | staleness_rate |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| O1 | RQ-01.1–01.6 | WS-01 | §3 | C-VER, C-STAB | S3.1–S3.4 | 2.10.0 / docs @10-01 | V3-source | n/a | high | none | version pin ages | medium |
| O2 | RQ-02.1–02.8 | WS-02 | §2, §4, App. A | C-DIAL, C-DIV | S1.1, S1.2, S3.3 | build 09-25 | V3-source | SCHEMA-CHECKED | high | upstream-only framing rejected | callback surface inferred | medium |
| O3 | RQ-03.1–03.8 | WS-03 | §5 | C-MIN, C-BUD | S1.1, S1.2 | 〃 | V3-source | ILLUSTRATIVE | high | — | packaging validator internals | fast |
| O4 | RQ-04.1–04.7 | WS-04 | §6 | C-COMP, C-STATE | S1.1, S3.4 | 〃 | V2-doc | SCHEMA-CHECKED + ILLUSTRATIVE | med-high | single-agent-first | transfer misconfig data | medium |
| O5 | RQ-05.1–05.9 | WS-05 | §7 | C-CTX, C-ESC | S1.1, S2.4–S2.10 | live 10-01 | V1-community (hazards) | ILLUSTRATIVE | medium | — | escaping fix pending | fast |
| O6 | RQ-06.1–06.6 | WS-06 | §11 | C-TOOLS, C-SERV | S1.1, S2.6, S2.7 | 〃 | V3-source + V1 | n/a | high (contract) / low (adapter state) | — | adapter gate outcome | fast |
| O7 | RQ-07.1–07.6 | WS-07 | §7.5, §11.5–11.6 | C-LIM | S1.1 | 〃 | V3-source | n/a | high | — | threshold C1 | fast |
| O8 | RQ-08.1–08.6 | WS-08 | §8, §9 | C-LIFE | S1.1 | 〃 | V3-source | n/a | high | — | H-02 mechanism | fast |
| O9 | RQ-09.1–09.5 | WS-09 | §10 | C-LOCAL | S1.1, S1.4, S2.12 | 〃 | V3-source + V1 | n/a | med-high | — | scorer env invisible | fast |
| O10 | RQ-10.1–10.5 | WS-10 | §12, App. B, examples/ | C-ARCH | S1.2, S2.3 | 〃 | V2-doc/V1 | SCHEMA-CHECKED + ILLUSTRATIVE | medium | 4th arch (parallel) rejected | no LB datapoints for B/C | medium |
| O11 | RQ-11.1–11.5 | WS-11 | §13 | C-HAZ | S2.1–S2.12 | live 10-01 | V1-community (2×T1/T2) | n/a | medium | — | deployment status unknown | fast |
| O12 | SQ-01–SQ-06 | all | §1, §2, §14 | — | all | — | mixed | n/a | high | — | — | mixed |

---
### Appendix F — Audit report and fixes applied

**F.1 Markdown table QC (mechanical, all deliverables).** A script re-parsed every GFM table in the finished files (18 files, 35 tables): header/delimiter structure, delimiter-row legality, and per-row column counts against the header, with escaped `\|` handled. One defect found and fixed: the §2 M5 row originally contained a literal pipe inside a code span (`` `instruction: |` `` — pipes split GFM cells even inside backticks), which broke that row into four columns. Re-worded; re-run reports **0 defects across 35 tables**.

**F.2 Version-discipline audit (two independent passes).** Pass 1 during writing pinned every default/limit/signature to the HARNESS_README 2026-09-25 build, the sample submission (same build), or a dated upstream source; pass 2 grepped the assembled document for unpinned-recency phrasing ("as of writing", "latest", "just released") — zero hits. Values that could not be pinned to a source were demoted to conflicts (C1) or hazard statuses (§13) rather than taught. Internally inconsistent values found during research (compaction 14,336 vs 32,768; `gpu_memory_utilization` 0.80 vs 0.90; sample-vs-default budgets) are recorded as conflicts C1–C3 with dispositions, not silently harmonized.

**F.3 Badge audit.** Final counts (main tutorial): SCHEMA-CHECKED 18, ILLUSTRATIVE 18, VALIDATED **0** — the four occurrences of the word "VALIDATED" in the main document are policy statements (legend, limitations, search log, this audit), not badges; likewise one policy mention in the sidecar README. Correction count from the audit passes: 0 badge corrections needed after the initial assignment (the initial assignment itself was conservative by design).

**F.4 Divergence-seam audit (second pass, per the stopping rule).** Re-read hunting for upstream-flavored claims without an at-the-point-of-use seam marker. Seams confirmed marked: tools syntax (§5.5, §6.1), Python-anywhere (§4.1), single-model (§5.3), serving opacity (§5.3/§11.4), templating-missing-key (§5.4), callbacks (§4.3, §6.3), graphs/2.x (§3.1, §6.2), `global_instruction` (§3.6, M8), `exit_loop` (§6.2, §7.0), AgentTool kwargs (§6.1), planner/executors/artifacts (§4.3), App-level compaction (§7.3, §11.6), skills experimental status (§6.4, §7.1), camelCase config (§11.3), root discovery (§5.2). No unmarked seams remained; two ambiguous cross-references to the *commissioning handoff's* own section numbers (which collided numerically with tutorial §12) were reworded to name the artifact instead.

**F.5 Pedagogical audit (§ checklist, per chapter).** Each of §3–§13 carries a stated prerequisite line, decision rules (routing table §1; per-chapter "Decision rule:" callouts in §5–§6; ranked levers in §7), badged examples, named failure signatures (bold error names + symptom tables in §5, §6, §7.4), and cost statements (per-chapter "Cost:"/"Cost model:" notes; the §7.0 catalog exists precisely to price techniques). Forward/backward pointers verified: §5→§6 (Tier 2 prerequisite line), §6→§7, §7→§13 for statuses, §1 routing table covers all intents. One cold-read blocker fixed: cross-references written before subsection numbering settled (§6.6→§6.4, §6.3→§6.2 for workflow semantics, §11.7→§11.5 for the daily-cadence fact) — all validated against the final heading list by script (every `§x.y` reference now resolves to a real heading or is an explicitly prefixed HARNESS_README/README section).

**F.6 Questions this research could not answer, and what would answer them.**

| Open question | What would answer it |
|---|---|
| Scorer's compaction threshold (14,336 vs 32,768) | Host statement, or a controlled overflow-rate measurement on the scorer |
| Whether the 2026-09-30 patch train deployed (H-05, H-06, H-04, LoRA sizing) | Host confirmation posts; re-running the community repros (§15 tells you where) |
| Whether dialect LoopAgent truly has no early exit (V1) | One scored submission with a LoopAgent and a trace showing iteration count |
| Whether skills work end-to-end on the scorer | One cheap skills-bearing submission, one task |
| Task order / public-first across the run | Host reply in thread 743063 (asked 2026-09-28) |
| Cause of the 2026-10-01 failure wave | Host post-mortem |
| Architecture B/C vs A on the leaderboard | Any participant publishing a controlled comparison |

**F.7 Reproducibility.** Deliverables assembled from part files via plain concatenation (order p1→p8); table QC and reference QC scripts live in `research-adk-gemma4-primer-tutorial-2026-09/scratch/` (`qc-tables.mjs`); all fetched sources with timestamps in `scratch/pages/`; research notes in `scratch/notes/`. Web access used the project research-toolkit only (no MCP quota, $0 paid engines).


---

<!-- ====================================================================== -->
<!-- FILE: 02_adk-competition-divergence.md -->
<!-- ====================================================================== -->

# ADK: upstream vs the Kaggle "Gemma 4 Developer Agent" dialect — the divergence table

**Standalone quick-reference.** Upstream = `google-adk` as documented at **2.10.0** (PyPI, 2026-09-25) with 1.x behaviors noted. Dialect = `adk-submission` per **HARNESS_README build 2026-09-25** (MD5 `10e36e8e7c01035d7f420c3b8cd1e075`) on the observed harness stack (**google-adk 1.36.1**, participant-observed ×2, 2026-09-28→10-01). Verified as of **2026-10-01 ~03:45 UTC**. Companion to `adk-primer-tutorial-kaggle-gemma4-developer-agent.md` (Appendix A; §2 carries the mistake-shaped short form M1–M12).

| # | Dimension | Upstream ADK (version noted) | Competition dialect | Reader consequence |
|---|---|---|---|---|
| A1 | Runtime version | 2.10.0 current; 1.39.1 last of 1.x (2026-08-27) | **1.36.1** (observed ×2) | All 2.x features absent; even late-1.x fixes may be |
| A2 | Authoring surface | Python code (full), Agent Config YAML (experimental), graphs (2.x GA) | Declarative YAML/MD/JSON/safetensors only | No Python entrypoints at all |
| A3 | Config loading | `from_config()` resolves dotted module refs (`tools: - name: pkg.fn`) | `compile_submission`, no `importlib`, closed registries | Code references don't exist; unknown names fail validation |
| A4 | Agent Config model support | Gemini-only (experimental feature) | Local vLLM Gemma alias | Upstream config docs mislead on model fields |
| A5 | Model choice | Any provider via LiteLlm/Gemini/vertex | Exactly `gemma-4-31b-it-qat-w4a16-ct` (scoring) | `ParticipantVisibleError` otherwise |
| A6 | `tools:` syntax | `- name: x` mappings (builtins or your functions) | Bare strings from the 9-tool registry + `agent_tool:` mapping | Name-keyed mapping form is invalid here |
| A7 | Tool universe | Functions, builtins (search, maps…), OpenAPI, MCP, toolsets, artifacts | 9 sandbox tools + AgentTool | No search/MCP/OpenAPI whatsoever |
| A8 | AgentTool parameters | `AgentTool(agent, description, tool_args, skip_summarization)` | `{config_path, skip_summarization}` only | No custom tool description / args schema |
| A9 | Prompt includes | None | `!include` (md/txt raw; yaml recursive, depth 10; cycle + traversal checks) | Dialect-only; upstream readers don't know it exists |
| A10 | Adapters (LoRA) | n/a | `adapters/` + per-agent `adapter:` (**gated**, H-01) | Dialect-only feature — currently a trap |
| A11 | Skills | Experimental (v1.25.0+) | Present (dialect addition vs Agent Config); `.py` only under `skills/*/scripts/` | Validate before leaning on it |
| A12 | Callbacks | 8 hook points, your functions | Closed `CallbackRegistry` | No guardrails/observability hooks for you |
| A13 | Instruction logic | `InstructionProvider` functions, dynamic | Static text + `{var}` templating only | Logic must live in prompts |
| A14 | Templating details | `{var}`, `{var?}`, `{artifact.var}`; 2.10 changed `${var}` handling | 1.x single-brace semantics | Missing required key ⇒ error; escape via phrasing |
| A15 | `global_instruction` | Deprecated → `GlobalInstructionPlugin` (code-only) | README lists it as an include target | Avoid; use a shared `!include` per agent |
| A16 | Composition model | Templated workflows "superseded" by graph/dynamic (2.x GA) | The 4 template classes only | Everything 2.x-marketed is absent |
| A17 | Loop early exit | `exit_loop` escalation, callbacks | Not reachable (V1 inference) | Price loops as `max_iterations × body` |
| A18 | State scopes | `user:`/`app:`/`temp:` prefixes | Session state (harness-seeded) in practice | Don't rely on prefix semantics |
| A19 | Sampling config case | camelCase SDK surface | **snake_case** schema keys | Wrong case fails schema |
| A20 | Execution-altering config keys | Settable via code | Excluded: `tools`, `system_instruction`, `http_options`, `safety_settings`, `response_schema` | Config is sampling-only |
| A21 | Root config | `root_agent.yaml` via `adk create --type=config` | `agent.yaml`/`.yml`/`root_agent.yaml`/`.yml`, exactly one | Discovery errors are the #1 first-day failure |
| A22 | Structural limits | None of these | <3 GiB unpacked, 10k files, 1k YAMLs, 500 agents, depth 50, 1k skills, 500 loop iters | Hard budget planning required |
| A23 | Context compaction | Configurable per App | Host-fixed: interval 5, overlap 2, threshold 14,336†, retention 5 | ~14k effective history — design to it |
| A24 | Prefix caching | Configurable | Host-fixed: 2,048 tok / 1,800 s / 10 intervals | Free speed, no control |
| A25 | Transient retries | Your code/plugins | Host `ModelRetryPlugin` (5×, 2.0 s→60 s, 2.0×, ±20% jitter) | Never implement retries in prompts |
| A26 | Session identity | Free `app_name`/`user_id` | Fixed `swegemma_eval` / `eval_user` | Irrelevant, but explains traces |
| A27 | Code execution | `code_executor`s | `run_command` in the task container (offline) | The only execution surface |
| A28 | Event schema | 2.x adds `node_info`, `output`; manual appends forbidden | 1.x events | Trace formats differ from 2.x docs |
| A29 | Multi-LoRA routing | n/a | Model id rewritten to `openai/<adapter-name>` per agent | Whole adapter surface is dialect-only |
| A30 | Environment pinning | You pick versions | Wheelhouse (v25) + invisible scorer env | Local acceptance ≠ scorer acceptance |

† Threshold per current README; an older README said 32,768 and 2026-09-30 measurements are consistent with 14,336 — conflict C1 in the tutorial, design to the smaller number.

**The nine dialect tools** (the closed registry behind A6/A7): `run_command`, `submit_patch`, `get_status`, `read_file`, `edit_file`, `write_file`, `get_code_neighbors`, `search_similar_code`, `get_code_subgraph`. Only the last two cost nothing to misuse dangerously — see the tutorial's §11.1 and §13 H-04.


---

<!-- ====================================================================== -->
<!-- FILE: 03_starter-submission-README.md -->
<!-- ====================================================================== -->

# starter-submission — minimal, adapter-free, fully commented

A copy-and-adapt starting point for the Kaggle "Gemma 4 Developer Agent"
competition. Structure mirrors the official `sample_submission/`
(SCHEMA-CHECKED against HARNESS_README build 2026-09-25); every file is
commented. **Nothing here has been executed against the scorer**
(no sandbox access during authoring) — validate locally before submitting.

## Tree

| File | Role | Required? |
|---|---|---|
| `agent.yaml` | Root LlmAgent: model, instruction, 6 core tools, sampling | **Yes** (one root config, exactly one) |
| `eval_config.yaml` | Per-task budgets (time failsafe pattern) | No — omit to get 60/100/500/300 defaults |
| `configs/sampling.yaml` | Sampling + thinking config (sample's values) | No — inline or omit |
| `prompts/system.md` | The system prompt (working discipline) | No — instruction may be inline |

That is the whole minimum: **one root YAML + one instruction**. Everything
else in the competition schema (sub-agents, agent_tool, skills, adapters)
is optional — and adapters are gated as of 2026-10-01 (hazard H-01).

## Before you zip

1. Point `instruction` at your edited `prompts/system.md` (or inline it).
2. Set budgets in `eval_config.yaml` deliberately (see its header comment).
3. Optional Tier 2 step: uncomment the `agent_tool:` block in `agent.yaml`
   and copy `examples/ex-05-analyzer-subagent.yaml` to
   `sub_agents/code_analyzer.yaml`.

## Packaging SOP (host-stated, thread 743683)

- Zip the submission **directory's contents at the root** — not the folder
  itself. The archive must contain `agent.yaml` at its top level.
- Kaggle flow: **Save Version (successful run) first, then Submit** from
  that version. Submitting an unsaved version fails instantly, and a
  failed submission still consumes the daily slot.
- One scored submission per day; scoring wall-clock is 12–14.5 h
  (community-measured) against a 12 h global limit that currently errors
  the whole run — hence the per-task time failsafe in `eval_config.yaml`.

## Local smoke test (if you have the wheelhouse)

```bash
swegemma eval \
  --tasks tasks.jsonl \
  --snapshots-dir snapshots \
  --submission-dir starter-submission \
  --results-dir results/starter_smoke \
  --sandbox docker \
  --task-id <one-fast-instance-id>
```

Then read, in order: `results/starter_smoke/logs/<id>.log` (did the model
obey the discipline?), `patches/<id>.patch` (non-empty? protected paths
untouched?), `test_outputs/<id>.log` (Phase-2 pytest result).


---

<!-- ====================================================================== -->
<!-- FILE: 04_starter-submission-sysprompt.md -->
<!-- ====================================================================== -->

<!-- prompts/system.md — system prompt for the starter coder agent.
     ILLUSTRATIVE (written for this tutorial, not executed). Loaded into
     agent.yaml via !include. Keep it short: every token here is spent on
     EVERY model call out of a 32,768-token window with ~14k effective
     history before compaction. Do not use literal {curly_braces} that
     look like identifiers — ADK interpolates them from session state
     and a missing key raises an error. -->

You are an autonomous software engineer fixing one repository task per session.

Working discipline — follow in order:

1. Understand the problem from the task message. Identify the file and
   function it most likely concerns before touching anything.
2. Read narrowly: read_file on the specific file (150-line / 10k-char
   cap per call). Do not dump whole directories.
3. Make the smallest edit that fixes the issue: one edit_file with a
   short, unique old_string anchored on lines WITHOUT quotes or
   backslashes when possible. For new files use write_file.
   - Tool results you see are JSON-encoded; when you copy text out of
     a read_file result into edit_file arguments, un-escape it twice
     (e.g. \" becomes ", \n becomes a real newline).
4. Verify with the narrowest command that exercises the fix, e.g.
   python3 -m pytest path/to/test_file.py::test_name -q
   Never run a whole test suite. Commands are capped at 300 seconds
   and 5,000 characters of output.
5. Keep the repository clean: put any scratch scripts under /tmp, never
   in /workspace — everything untracked in /workspace lands in your
   submitted patch. Never modify test files, pytest.ini, or
   conftest.py: test-file changes are discarded before grading, and
   pytest.ini/conftest.py belong to the harness.
6. Call get_status if you are unsure how much budget remains (it is
   free). When the fix is verified, call submit_patch as your FINAL
   tool call — it is free and immediately ends the task.

If a tool call fails, read the error, adjust, and retry once; if it
fails again, choose a different approach rather than repeating it.


---

<!-- ====================================================================== -->
<!-- FILE: 05_examples-ex-04-system-prompt.md -->
<!-- ====================================================================== -->

<!--
Example — a coder system prompt shaped for this harness's failure modes.
Badge: ILLUSTRATIVE — written for this tutorial, not executed. Load via:
    instruction: !include prompts/system.md
Breaks if: you add JSON examples containing {identifier_shaped} braces
(ADK interpolates them from session state; a missing key raises), or let
it grow past ~2–3k tokens (paid on every call out of a 32,768 window).
-->

You are an autonomous software engineer fixing one repository task.

Loop: understand → read narrowly → smallest edit → narrowest test →
submit_patch. Rules that keep your work scoreable:

- Anchor edit_file old_strings on lines without quotes/backslashes when
  possible; tool results reach you double-JSON-escaped, so un-escape
  copied text twice before reusing it in an edit.
- Verify with `python3 -m pytest <file>::<test> -q`, never a full suite
  (commands cap at 300 s and 5,000 chars of output).
- Scratch scripts go in /tmp, never /workspace — untracked files in
  /workspace are included in your patch.
- Never edit test files, pytest.ini, or conftest.py — test changes are
  discarded before grading; those two files belong to the harness.
- Call submit_patch as your FINAL tool call. It is free and ends the
  task the moment your turn completes.


---

<!-- ====================================================================== -->
<!-- FILE: 06_examples-ex-10-what-not-to-submit.md -->
<!-- ====================================================================== -->

# What NOT to submit — the upstream-trained reader's failure gallery
<!-- Badge: ILLUSTRATIVE — anti-examples, each mapped to tutorial §2's
     M-numbers and Appendix A divergence rows. Every snippet below is
     INVALID in the competition dialect. Use this file as a pre-flight
     checklist: grep your submission for each pattern. -->

## M1 — name-keyed tool mappings (upstream Agent Config syntax)

```yaml
tools:
  - name: google_search        # INVALID: no built-in tools resolve here
```

Only bare registry names work: the 9 sandbox tools, plus
`agent_tool: {config_path, skip_summarization}` mappings.

## M2 — Python anywhere

```yaml
tools:
  - name: my_package.my_tool   # INVALID: dotted code refs do not exist
```

There are no Python entrypoints. `.py` files are legal ONLY under
`skills/*/scripts/` — and where those execute is undocumented (V1).

## M3 — any model but the one

```yaml
model: gemini-flash-latest     # INVALID: ParticipantVisibleError
```

Every agent: `gemma-4-31b-it-qat-w4a16-ct`. One base model per tree.

## M4 — serving wiring

```yaml
model: hosted_vllm/gemma-4-31b-it
```

Prefixes are stripped; you never configure serving. Registry alias only.

## M5 — bare {hints} in an instruction

```yaml
instruction: |
  Solve: {problem_description}
  Hints: {hints}               # RAISES on hint-less tasks
```

Use `{hints?}` — or nothing: the harness already places hints in the
user prompt.

## M6 — callbacks

```yaml
before_model_callback: my_guardrail   # INVALID: closed registry
```

No participant callback surface is documented. Prompt-engine instead.

## M7 — 2.x graphs

```python
workflow.NewAgentNode(agent=coder)    # Not in the dialect at all
```

The harness runs ADK 1.36.1: the four template classes only.

## M8 — global_instruction

Deprecated upstream, code-only replacement; avoid entirely (§3.6).
Share text via one !include file referenced by each agent.

## M9 — exit_loop

```yaml
tools: [exit_loop]             # INVALID: not in the 9-tool registry
```

No documented early exit from LoopAgent (V1) — set max_iterations.

## M10 — AgentTool constructor kwargs

```yaml
agent_tool:
  config_path: sub_agents/a.yaml
  description: Analyzes code    # INVALID: not a dialect field
```

Exactly two keys: config_path, skip_summarization.

## M11 — planner/code_executor/output_schema/artifacts/memory/A2A/voice

None exist in the dialect's agent schema. Sub-agents and prompts are
the substitutes.

## M12 — App-level compaction/caching config

Host-owned and immutable (§11.6). Your lever is prompt discipline.

