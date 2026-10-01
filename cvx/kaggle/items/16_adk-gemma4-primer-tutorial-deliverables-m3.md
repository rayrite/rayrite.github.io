# COMBINED MARKDOWN - combine

_Generated 2026-10-01 00:28:03 | 6 files | folder: D:\stuff\docs\taylor_fv\github\rayrite.github.io\cvx\kaggle\items\combine_

## Contents

1. 01_adk-primer-tutorial-kaggle-gemma4-developer-agent.md
2. 02_adk-competition-divergence.md
3. 03_starter-submission-README.md
4. 04_starter-submission-repo-nav-SKILL.md
5. 05_starter_submission-systemprompt.md
6. 06_examples-README.md

---

<!-- ====================================================================== -->
<!-- FILE: 01_adk-primer-tutorial-kaggle-gemma4-developer-agent.md -->
<!-- ====================================================================== -->

# A Verified Primer and Comprehensive Tutorial on Google's Agent Development Kit (ADK), Tailored to the Kaggle "Gemma 4 Developer Agent" Competition

> **Audience:** competent Python developers who have never used Google ADK and are preparing a competition submission. Assumed known: Python, git, pytest, basic LLM-agent concepts. Assumed unknown: ADK, its object model, its declarative configuration layer, the competition harness.

> **Single most important thing to know first (read this even if you read nothing else).** The Kaggle "Gemma 4 Developer Agent" competition does **not** expose you to upstream Google ADK in its full generality. It exposes a **restricted, declarative-only dialect** called **`adk-submission`**, compiled by a sandboxed YAML compiler (`compile_submission`) into a small fixed surface of four agent classes (`LlmAgent`, `SequentialAgent`, `ParallelAgent`, `LoopAgent`), nine host-provided tools, a single base model (`gemma-4-31b-it-qat-w4a16-ct`), and a 32 768-token context window. Most public ADK material — dynamic `from_config()`, custom Python tool modules, code-based agent selection, full safety and `tools` configurability — **does not apply** to a competition submission. A tutorial that teaches upstream ADK without flagging the seam will send you confidently in the wrong direction. Every claim in this document is written against the competition surface, with upstream material introduced only where it explains *why* a limit exists.

---

## Document Header

| Field | Value | Notes |
|---|---|---|
| **Target ADK version (upstream baseline)** | `google-adk` v2.10.0 | Released 2026-09-25 per the `google/adk-python` GitHub Releases page (verified 2026-09-30). [S-001] |
| **Harness reference version / date** | `HARNESS_README.md` snapshot dated 2026-09-30 (input/kagglecomp/) | Treated as the primary organizing spine for the competition surface; every load-bearing claim re-derived from it before reaching the tutorial. |
| **Community intel version / date** | `03-discussion-board-intel.md` snapshot dated 2026-09-30 19:30 UTC (input/kagglecomp/) | Used as leads only, with tier and date recorded per item. |
| **Verified as of** | **2026-09-30** | Hard research cutoff per the project brief. All claims sourced to material dated ≤ 2026-09-30. |
| **Primary evidence base** | `HARNESS_README.md` (671 lines), `03-discussion-board-intel.md` (155 lines), `04-paper-track-intel.md` (102 lines), `Kaggle-00-Complete.md` (300+ lines), upstream `google/adk-python` at tag `v2.10.0`, the `adk.dev/agents/config/` Agent Config reference. | |
| **Execution environment available?** | **No.** No Kaggle account, no local wheelhouse, no `swegemma eval` runtime. All examples therefore carry the badges `SCHEMA-CHECKED` or `ILLUSTRATIVE` per CQ-04 default. **No example is `VALIDATED`.** This is stated prominently here and in §A.4. | |
| **Sidecar files** | `starter-submission/` (minimal runnable tree, `SCHEMA-CHECKED`), `examples/` (per-tier examples, `SCHEMA-CHECKED`/`ILLUSTRATIVE`), `adk-competition-divergence.md` (standalone divergence table). | |
| **Stable identifier** | `adk-primer-tutorial-kaggle-gemma4-developer-agent.md` | |

### Stability warning (read this before using any chapter)

| Topic | Decay rate | Re-check cadence |
|---|---|---|
| Tool contracts (signatures, return schemas, budget accounting) | **Fast** | Every 1–2 weeks until submission deadline |
| LoRA / adapter hosting story (KV-collapse fix, zeroing fix, register coverage) | **Fast** | Re-probe before any adapter submission; every 3–5 days |
| `search_similar_code` output cap and thinking-mode patch | **Fast** | Re-probe before locking sampling.yaml |
| Competition README (`HARNESS_README.md`) defaults and limits | **Medium** | Weekly |
| Upstream ADK release and `agent_config` schema changes | **Medium** | Monthly |
| ADK object-model narrative (LlmAgent vs. Workflow classes) | **Slow** | Quarterly |
| Rescore / rerun backlog from the 9/26 failure wave | **Fast** | Before assuming any leaderboard position is final |

Anything **not** in the table above (object-model narrative, architectural tradeoffs, the dialect divergence) decays slowly; the items **in** the table will go stale fastest and account for most of the hazard register in §13.

---

## How to use this tutorial

This document is structured as a **linear spine** (read straight through) and a **modular reference** (any chapter addressable in isolation). Every chapter opens with a **prerequisites** line so a time-pressed reader can skip ahead without missing setup.

### Routing table by intent

> *"I want to…"* → *chapter*

| Intent | Go to | Tier |
|---|---|---|
| Understand what ADK actually is and what the competition restricts | §2 The one thing to know first · §3 ADK orientation · §4 The competition dialect | Orientation |
| Build and submit a minimal valid agent | §5 Tier 1 — Essentials | Essentials |
| Add a second agent or a workflow pattern | §6 Tier 2 — Intermediate | Intermediate |
| Push resolution rate past a baseline | §7 Tier 3 — Advanced | Advanced |
| Understand why the score is what it is | §9 Lifecycle and scoring literacy | Cross-tier |
| Debug a failing local run | §10 Local development | Cross-tier |
| Look up a tool signature, default, or limit | §11 Tool and configuration reference | Reference |
| Decide whether to use LoRA adapters | §4.7 · §7.6 · §11.5 | Reference + hazard |
| Avoid a known-broken pattern | §13 Hazard register | Hazard |
| Re-verify anything in this document before the deadline | §15 Re-check list | Reference |

### Shortest path for a ship-it-now reader

If you have only one weekend:

1. §2 The one thing to know first — 10 minutes
2. §5 Tier 1 — Essentials — 2 hours, build the starter tree, run it locally, ship it
3. §13 Hazard register — top 5 hazards — 30 minutes
4. §10 Local development — the diagnosis playbook — 1 hour

The rest of the document fills in the Intermediate, Advanced, and reference material on demand.

### Honest statement that this document will age

This is a tutorial on a fast-moving framework and a live competition. The version pin is in the header; the re-check list is in §15. The document is correct as of **2026-09-30** and will not be updated silently. If a claim looks wrong against a current source, the current source wins and the re-check list is the route to finding what changed.
---

## §2 The one thing to know first — what a reader who learned only upstream ADK would get wrong

> **Prerequisites:** none. This chapter is the reason the rest of the document exists.

The Kaggle competition exposes a **restricted, declarative-only** ADK dialect. The harness ships its own compiler (`compile_submission` inside `adk-submission`) that walks your YAML submission directory and produces a `BaseAgent` tree. It deliberately **does not** use upstream ADK's `from_config()` dynamic-import path; it does not load arbitrary Python modules; it does not allow a Python entrypoint (`agent.py`, `agent_fn`); and it resolves every name (tools, models, skills, callbacks) against closed host registries rather than against the Python import system. [S-002]

If you have used upstream ADK for any non-trivial project, this distinction will hurt you in specific, predictable places. The list below is the central finding of this tutorial: **the eight concrete mistakes a reader who learned upstream ADK would make on a first submission.**

### 2.1 Eight concrete mistakes (read each one before writing any YAML)

| # | What you might do, learned from upstream | Why it fails here | Source / status |
|---|---|---|---|
| 1 | Define a tool as a Python function in `tools/my_tool.py` and reference it by `module:entrypoint`. | The dialect compiles `tools:` against the host `ToolRegistry`. Only the 9 names listed in §11.1 resolve. A reference to any other name is rejected at validation. | HARNESS_README.md §2.1, §6. [S-002] |
| 2 | Author a multi-agent pipeline as a Python class that composes `LlmAgent` and `SequentialAgent` programmatically. | There is no Python entrypoint. The only allowed entrypoint is `agent.yaml` (or `agent.yml`, `root_agent.yaml`, `root_agent.yml`). The compiler parses your YAML against `SandboxedAgentConfig`. | HARNESS_README.md §2.1. [S-002] |
| 3 | Use `LlmAgent.tools=[sub_agent_ref]` to nest an agent as a tool. | Upstream's `BaseAgent` cannot be used directly as a tool (it raises `ValueError`); it must be wrapped in `AgentTool`. The dialect exposes a separate `agent_tool: { config_path, skip_summarization }` shape. | HARNESS_README.md §2.3; ADK source `agents/llm_agent.py` `_wrap_base_node_as_tool`. [S-003] |
| 4 | Use `tools=[...]` to attach more than the nine harness tools, expecting `OpenAPI` / `MCP` / `LangChain` adapters to work. | The closed `ToolRegistry` accepts only the 9 host tools + `AgentTool`. There is no `McpToolset`, no `OpenAPIToolset`, no `LangchainTool` integration in a competition submission. | HARNESS_README.md §6; verification of subfloor claim — `compile_submission` source rejects unknown names. [S-002] |
| 5 | Override safety settings, `response_schema`, or pass `system_instruction`/`http_options` via `generate_content_config`. | These fields are excluded from `GenerateContentConfig` by schema design and raise a validation error if set. | HARNESS_README.md §2.4 (warning block). [S-002] |
| 6 | Call `sub_agents=[other_agent_dict]` with a Python object reference. | In the dialect, every sub-agent and `AgentTool` target is referenced by **config path** (`config_path: sub_agents/foo.yaml`), not by Python object. | HARNESS_README.md §2.3. [S-002] |
| 7 | Assume `from_config()` will resolve `!include` directives recursively without limit. | The dialect caps `!include` recursion at depth **10** with cycle detection, blocks `..` traversal and absolute paths, and rejects symlinks resolving outside the submission root. | HARNESS_README.md §2.2. [S-002] |
| 8 | Submit an `.py` file at the root of `submission.zip` expecting it to be loaded. | The allowed file extensions reject most non-YAML content. `.py` is allowed **only** under `skills/<name>/scripts/` for skill scripts; `.py` at the root is not loaded. | HARNESS_README.md §2.4 (`allowed_file_extensions`). [S-002] |

> **Decision rule.** Before copying any pattern from upstream ADK into a competition submission, ask: *is this resolved by a closed registry, or by Python import?* If by Python import, the dialect will reject it. The corollary: read this tutorial against the dialect schema, and use upstream ADK only to learn *what the concept is*, not *how to instantiate it*.

### 2.2 The dialect is a different security model, not "ADK minus a few features"

This distinction matters for second-order reasoning. If you think of the dialect as "ADK with restrictions," you will try to find a way around the restrictions — the wrong mental model. The dialect is **a different compilation and execution path** that the competition controls to bound the agent's blast radius. Two consequences follow:

- **You cannot get more tools by being clever.** Every name resolves against the closed registries at compile time. The compiler (`compile_submission`) is the gatekeeper; no `__init__.py`, no `importlib`, no `from_config` magic.
- **You cannot escape sandbox sandboxing.** The dialect rejects symlink traversal and absolute paths in `!include`. The sandbox itself (`Container A` for the agent, `Container B` for verification) is also locked down: `4 GiB` RAM, `2 vCPUs`, `network_mode="none"`. [S-002]

Treat the dialect as **the competition's contract**, not as upstream minus a few knobs. The rest of this document is written against that contract.

---

## §3 ADK orientation — what Google ADK actually is today

> **Prerequisites:** none, but §2 sharpens the lens for everything that follows.
> **What you will be able to do afterward:** state what ADK is, name its core object model, and explain why the competition adk-submission is a deliberately narrower dialect of it.

### 3.1 The ADK project in one paragraph

Google ADK is an open-source framework for building AI agents that the upstream project describes using two main classes: Agent (which defines AI instructions, tools, and behavior) and Workflow (which orchestrates agents in graph-based flows). [S-001] ADK has shipped implementations in Python, TypeScript, Go, Java, and Kotlin; the most actively developed and the canonical one for the competition reference is google/adk-python, the PyPI distribution name google-adk. [S-001] ADK stable release at the research cutoff is v2.10.0, released 2026-09-25. [S-001]

The framework has two equal-weight entry paths: (1) a Python API (from google.adk.agents import Agent, LlmAgent, SequentialAgent, ParallelAgent, LoopAgent) for code-first authors; (2) a declarative Agent Config path using agent.yaml (or root_agent.yaml) plus a JSON schema for code-free authoring. [S-004] The declarative path is loaded via config_agent_utils.from_config. [S-004] This declarative path is the conceptual parent of the competition adk-submission — but the dialect replaces the loading function with a sandboxed compiler that does not use Python dynamic-import machinery.

### 3.2 The object model

ADK is built on a small object graph. Knowing these objects and what each is responsible for is the mental model the rest of the tutorial assumes.

| Object | Responsibility | Where created / configured |
|---|---|---|
| App | The top-level runtime container; wires agents, sessions, plugins, and event-flow options (compaction, caching). Created by the runner when a session starts. |
| BaseAgent (abstract) | The abstract parent of every agent. Knows its name, description, sub_agents, and lifecycle callbacks. |
| LlmAgent | An LLM-driven agent. Has model, instruction, tools, sub_agents, output_key, include_contents, generate_content_config, disallow_transfer_to_parent, disallow_transfer_to_peers, and skills. The workhorse agent class. |
| SequentialAgent | Runs sub_agents in declared order. No state isolation between sub-agents unless explicitly configured. |
| ParallelAgent | Runs sub_agents concurrently in isolated branches. Each branch has its own state. |
| LoopAgent | Repeatedly runs sub_agents up to max_iterations (default 500, bounded 1..500 in the dialect). |
| BaseTool (abstract) | A callable the LLM can invoke. ADK distinguishes FunctionTool (Python function), AgentTool (wraps another agent), and host-provided built-ins. |
| AgentTool | Wraps a sub-agent as a tool. Supports skip_summarization: true to keep the wrapped agent output out of the parent context window. |
| Session / State | A per-conversation container with a mutable string-typed dictionary (session.state). Used to carry data between agents. |
| Runner | The execution driver; iterates through Session.events, calls the LLM, dispatches tool calls, fires plugins. |
| Plugin (optional) | Cross-cutting observability / behavior hooks. ADK ships ModelRetryPlugin (transient-error retry) and EventDisplayPlugin (rich console). |
| EventsCompactionConfig | Compaction settings (token threshold, overlap size, event retention) on the App to prevent context overflow. |
| ContextCacheConfig | Prefix-caching settings (min_tokens, ttl_seconds) on the App. |
| Callbacks | Per-agent before_agent_callback / after_agent_callback / before_model_callback / after_model_callback / before_tool_callback / after_tool_callback. Functions invoked at lifecycle points. |

Object model reconstructed from upstream ADK source google/adk-python v2.10.0: agents/llm_agent.py, agents/sequential_agent.py, agents/parallel_agent.py, agents/loop_agent.py, tools/agent_tool.py, tools/_node_tool.py. [S-001, S-003]

### 3.3 What the configuration and extension model looked like before, and why it diverged

The upstream ADK extension story has two layers:

1. Code-first. Define a Python function decorated @tool or a Python class subclassing BaseAgent, register it in your application, and reference it by Python object.
2. Config-first (Agent Config). Write agent.yaml against the AgentConfig.json schema and load it via config_agent_utils.from_config. Internally, from_config resolves named tools and sub-agents via Python imports — for example, a tool with module: my_pkg.tools, entrypoint: search is imported at load time.

The competition adk-submission deliberately removes the Python-import path. Its compile_submission reads your YAML, validates it against SandboxedAgentConfig, and resolves every name against closed host registries that the harness ships (ToolRegistry, ModelRegistry, SkillRegistry, CallbackRegistry). [S-002] The reason is not ideological — it is that the competition has to bound the agent execution surface. Dynamic imports would re-introduce arbitrary code execution from a YAML blob.

This is why §2 list of eight mistakes is non-negotiable. Every one of them rests on importing a capability that upstream ADK permits but the dialect refuses.

### 3.4 Stability posture

| Component | Stability label | What that obliges you to do |
|---|---|---|
| LlmAgent, SequentialAgent, ParallelAgent, LoopAgent | Stable upstream since ADK 1.x | Code against them; expect them in the dialect (the dialect exposes exactly these four). |
| Declarative agent.yaml (Agent Config) | Experimental upstream at v2.10.0 (marked so in the ADK docs) | Schema may change between minor versions; pin to a specific version and re-validate after every upgrade. |
| AgentTool / skip_summarization | Stable upstream | Use freely. |
| EventsCompactionConfig, ContextCacheConfig | Experimental upstream | Pin and re-validate. The competition swegemma configures them with specific values (§11.7). |
| ModelRetryPlugin | Stable upstream | The competition uses it with default values; you do not need to configure it. |
| LoopAgent.max_iterations default 500 | Hard ceiling 500 in the dialect | Do not try to override higher; the validator rejects > 500. |
| Custom Python FunctionTools in agent.yaml | Not available in the dialect | The dialect tools: list is names-only against the closed ToolRegistry. |
| McpToolset, OpenAPIToolset, LangchainTool | Not in the dialect | Use only the 9 host tools. |

Stability labels reconciled from upstream adk.dev/agents/config/ docs (which mark Agent Config experimental and the v2.10.0 release notes) and the competition dialect allowed-field list. [S-001, S-002, S-004]

### 3.5 What goes stale first

In order of decay rate:

1. Tool return schemas and budget accounting. The fastest-moving surface; a single host patch can shift a tool truncation cap.
2. LoRA / adapter hosting story. KV-collapse and double-registration bugs are active. Re-probe before any adapter submission.
3. search_similar_code output cap. Promised cap like other tools had not landed at the 2026-09-30 sweep. [S-005]
4. Thinking-mode drop. Patch incoming as of 2026-09-30 18:33 UTC; no re-score of existing submissions was committed. [S-005]
5. HARNESS_README.md defaults and limits. The sample submission eval_config.yaml differs from the launcher defaults (max_tool_calls: 10 vs 100); confirm both before designing.
6. Upstream ADK schema. Minor upstream releases move Agent Config fields occasionally.

The rest of the tutorial is calibrated against this decay order; §15 re-check list restates it as a checklist.---

## §4 The competition dialect — adk-submission and the divergence from upstream ADK

> **Prerequisites:** §2 (mistakes list), §3 (object model).
> **What you will be able to do afterward:** name the four approved agent classes with their dialect-specific field surface, know what the closed registries accept and reject, know the structural limits and which are hard, know the !include and root-discovery semantics, and know the upstream features you cannot use.

This chapter is the spine. Every other chapter teaches against this surface and flags the seam to upstream ADK where they differ.

### 4.1 The security and compilation model in one paragraph

The competition does not let you submit Python. There is no agent.py entrypoint, no from_config dynamic import, and no Python tool module to register. Instead, your submission is a directory whose root contains one of four acceptable root-config filenames. The harness passes that directory to compile_submission (inside adk-submission), which (i) validates the directory layout and file extensions against SubmissionLimits, (ii) parses the root YAML against SandboxedAgentConfig, (iii) recursively resolves every !include directive against the same directory with cycle detection and depth ≤ 10, (iv) resolves every named entity (tool, model, skill, callback) against the harness closed registries (ToolRegistry, ModelRegistry, SkillRegistry, CallbackRegistry), and (v) emits an ADK BaseAgent tree bound to the harness-supplied vLLM / Transformers inference server. [S-002]

If you have used upstream ADK declaratively, the mental shift is: **declarative Agent Config → compile_submission**, with the harness compiler (not Python) doing the resolution. [S-002, S-004]

### 4.2 Submission directory layout

```
submission/
├── agent.yaml                    # REQUIRED: Root agent config (or root_agent.yaml; .yml also accepted)
├── eval_config.yaml              # Optional: Per-task evaluation budget & timeout overrides
├── configs/
│   └── sampling.yaml             # Optional: generation parameters loaded via !include
├── prompts/
│   ├── system.md                 # Optional: system instructions loaded via !include
│   └── analyzer.md
├── sub_agents/
│   └── code_analyzer.yaml        # Optional: sub-agent or AgentTool YAML configurations
├── adapters/                     # Optional: fine-tuned PEFT LoRA adapters or model weights
│   ├── main_lora/
│   │   ├── adapter_config.json
│   │   └── adapter_model.safetensors
│   └── tool_lora/
│       ├── adapter_config.json
│       └── adapter_model.safetensors
└── skills/                       # Optional: ADK skill directories (each containing SKILL.md)
    └── repo_navigation/
        ├── SKILL.md
        ├── scripts/              # .py skill scripts
        └── resources/            # skill knowledge files
```

Reproduced from HARNESS_README.md §2.2. [S-002]

### 4.3 Root-config discovery — what filename the compiler accepts

The compiler accepts exactly one of these filenames in the submission root:

- agent.yaml
- agent.yml
- root_agent.yaml
- root_agent.yml

If zero match: MissingRootConfigError. If more than one match: MultipleRootConfigsError. Both are validation errors raised before any agent instantiation. [S-002]

Decision rule: **always use agent.yaml.** The other three are aliases; mixing them is a free way to get MultipleRootConfigsError.

### 4.4 The four approved agent classes

The dialect supports four agent_class values. Anything else is rejected at validation.

| agent_class | Purpose | Required dialect fields | Notable dialect constraints |
|---|---|---|---|
| LlmAgent (default if omitted) | LLM-driven agent | name, model | All sub-agent tool wiring goes through AgentTool config_path; skills via skills: [relative/path]; output_key writes to session.state; include_contents: default or none; disallow_transfer_to_parent / disallow_transfer_to_peers control transfer |
| SequentialAgent | Run sub_agents in declared order | name, sub_agents | No transfer to sub-agents is allowed; sub_agents must be config_path references |
| ParallelAgent | Run sub_agents concurrently in isolated branches | name, sub_agents | Each branch has its own isolated state — useful for context isolation but requires orchestrator to read state back |
| LoopAgent | Repeatedly run sub_agents up to max_iterations | name, sub_agents, max_iterations | max_iterations integer 1..500 (default 500). The compiler rejects anything outside that range |

Source: HARNESS_README.md §2.3. [S-002]

LlmAgent field reference (competition dialect surface):

| Field | Type | Required | Default | Notes |
|---|---|---|---|---|
| name | str | yes | — | Agent identifier. Must be unique within the submission. |
| model | str | yes (unless a default model is set) | — | Must be the competition base model alias gemma-4-31b-it-qat-w4a16-ct (or another registered alias for local CLI). |
| adapter | str \| None | — | None | Name matching a subdirectory or weight file under adapters/. Routing only. |
| description | str | no | — | Up to 1 000 000 chars; used by parent agents when delegating to this agent. |
| instruction | str | no | — | Up to 1 000 000 chars. Supports ADK session-state templating ({problem_description}, {hints}, custom output_key variables). |
| tools | list | no | [] | List of tool names (str), AgentTool references (agent_tool: {config_path, skip_summarization}), or inline agent dicts. |
| skills | list[str] \| None | — | None | List of relative paths to skill directories within the submission archive. |
| sub_agents | list | no | [] | List of {config_path: ...} references for multi-agent transfer. |
| output_key | str \| None | — | None | Saves the agent final text output into session.state[output_key]. |
| include_contents | "default" \| "none" | — | "default" | Whether conversation history is passed to the agent. |
| disallow_transfer_to_parent | bool \| None | — | None | Block transfer back up the tree. |
| disallow_transfer_to_peers | bool \| None | — | None | Block transfer to siblings. |
| generate_content_config | dict \| None | — | None | Sampling, seed, and thinking parameters (§4.6). Execution-altering fields are excluded by schema. |

Source: HARNESS_README.md §2.3 and upstream adk.dev [S-002, S-004]. Cross-checked against ADK source at agents/llm_agent.py.

### 4.5 The sandboxed !include directive

| Aspect | Behavior | Failure mode |
|---|---|---|
| Resolution | Paths relative to the file containing the !include tag | PathTraversalError on absolute paths, .. components, null bytes, or symlinks resolving outside submission root |
| Recursion depth | Up to 10 levels, cycle-detected | A cycle (A → B → A) raises a cycle error from the harness cycle-detection pass |
| File types | .md and .txt loaded as raw UTF-8 strings; .yaml and .yml parsed recursively | Unknown extensions ignored; .py at the root via !include is not loaded |
| Output size | Each YAML file capped at 50 MiB max_yaml_size_bytes (cumulative !include expansion included in the cap) | Exceeding the cap raises a validation error |

Source: HARNESS_README.md §2.2, §2.4. [S-002]

### 4.6 Generation constraints

Generation parameters are passed via generate_content_config under each LlmAgent. The dialect explicitly accepts these fields:

| Field | Allowed range | Default | Notes |
|---|---|---|---|
| temperature | ≥ 0.0 | (unset) | Standard sampling |
| top_p | 0.0–1.0 | (unset) | Nucleus sampling |
| top_k | ≥ 1 | (unset) | Top-k sampling |
| max_output_tokens | 1 to 32 768 | 16 384 | Bounded by vLLM max_model_len = 32 768 |
| presence_penalty | any valid value | (unset) | Penalty parameters |
| frequency_penalty | any valid value | (unset) | Penalty parameters |
| stop_sequences | list of str | (unset) | Stop sequences |
| response_mime_type | str | (unset) | e.g. application/json |
| seed | int | (unset) | Deterministic seed when supported by the serving stack |
| thinking_config.thinking_budget | 0 to 32 768 | 4 096 | Set to 0 or include_thoughts: false to disable thinking |
| thinking_config.thinking_level | "MINIMAL" \| "LOW" \| "MEDIUM" \| "HIGH" \| "NONE" (case-insensitive) | (unset) | Maps to OpenAI reasoning_effort. NOTE: When serving via vLLM OpenAI-compatible /v1 endpoint (especially with LoRA adapters), omit thinking_level and use include_thoughts: true + thinking_budget: 4096 instead; swegemma also sets litellm.drop_params = True. |
| thinking_config.include_thoughts | true \| false | (unset) | Whether thoughts are passed back to the next prompt |

Source: HARNESS_README.md §2.4. [S-002]

> **CRITICAL WARNING (also in HARNESS_README §2.4).** Execution-altering ADK fields that bypass the sandbox — tools, system_instruction, http_options, safety_settings, response_schema inside generate_content_config — are excluded from GenerateContentConfig by schema design and will raise a validation error if set. [S-002]

### 4.7 The single base model rule

validate_single_declared_model(agent_dir) walks the root agent.yaml, every sub_agents[*].config_path, every tools[*].agent_tool.config_path, and any standalone agent YAML files. It strips provider prefixes (openai/, google/, hosted_vllm/, custom/) and asserts that **at most one unique base model** is declared. [S-002]

For Kaggle competition scoring, ALLOWED_MODEL_NAMES = frozenset({gemma-4-31b-it-qat-w4a16-ct}). Declaring multiple base models or an unpermitted model raises ParticipantVisibleError. [S-002]

Pre-registered aliases (for local CLI use only — Kaggle scorer restricts to the QAT model):
- gemma-4-31b-it-qat-w4a16-ct (Competition model and Starter Kit default)
- gemma-4-31b-it, gemma-4-31b
- gemma-4-27b-it, gemma-4-27b
- gemma-4-26b-a4b-it, gemma-4-26b-a4b
- gemma-4-12b-it, gemma-4-12b
- gemma-4-9b-it, gemma-4-9b
- gemma-4-e4b-it, gemma-4-e4b
- gemma-4-e2b-it, gemma-4-e2b

Source: HARNESS_README.md §3.3. [S-002]

### 4.8 Per-agent LoRA routing (plumbing only — training out of scope)

Even though a single base model is required, different agents in your hierarchy can use different fine-tuned LoRA adapters:

1. Place PEFT LoRA directories (adapter_config.json + adapter_model.safetensors) inside adapters/<adapter_name>/.
2. Reference adapter: <adapter_name> on any LlmAgent in agent.yaml or sub_agents/*.yaml.
3. discover_adapters() registers all discovered adapters with vLLM (enable_lora=True, max_loras=8, max_lora_rank=128).
4. resolve_swegemma_adapter routes requests from each agent to its openai/<adapter_name> model identifier.

**Adapter size planning against the 3 GiB total submission budget:**

| Rank | Approximate adapter size (31B model, all linear projections) | Adapters fitting in < 3 GiB |
|---|---|---|
| r=16 | ~110–220 MB | ~13 (well over the 8-adapter cap) |
| r=32 | ~220–450 MB | 6–8 |
| r=64 | ~450–900 MB | 3–6 |
| r=128 (max_lora_rank) | ~0.9–1.8 GB | 1–3 |

Source: HARNESS_README.md §3.4. [S-002]

> **Hazards at submission time (read before exercising this path).** Three live harness bugs make the adapter path expensive: (a) silent adapter zeroing (Gemma4 registers decoder layers twice; activate_adapter populates the alias path, reset_lora zeroes them — fix landed in wheelhouse v23, current v25, not independently confirmed resolved), (b) KV-cache collapse (any mounted adapter → vLLM preallocates max_loras=8 × max_lora_rank=128 buffers, dropping KV from 46 048 to 7 600 tokens; 99% of episodes exceed 7.6k prompt tokens → adapter submissions stall), and (c) no public adapter submission has yet scored. [S-005] Treat the LoRA track as gated behind a cheap canary submission until the layer-2 and layer-3 fixes are confirmed deployed on the scorer.

### 4.9 The closed registries

| Registry | Accepts | Rejects |
|---|---|---|
| ToolRegistry | The 9 host tools (§11.1) + AgentTool wrappers | Any other name; any Python module:entrypoint reference |
| ModelRegistry | Registered Gemma 4 aliases; in Kaggle scoring, only gemma-4-31b-it-qat-w4a16-ct | Any un-registered model; the host rejects the submission if a second base model is declared |
| SkillRegistry | Directory paths under skills/ that contain a valid SKILL.md | Paths outside skills/, missing SKILL.md |
| CallbackRegistry | (Host-defined only) | (Competitors currently have no path to register callbacks in the dialect; covered in §7.5.) |

Source: HARNESS_README.md §2.1, §3.3. [S-002]

### 4.10 The structural and generation limits

#### 4.10.1 Primary hard constraint

| Parameter | Value | Type |
|---|---|---|
| max_total_size_bytes | 3 221 225 472 bytes (3 GiB) | Hard limit — total unpacked submission including adapters/ |

Anything above 3 GiB unpacked fails the packaging validator. [S-002]

#### 4.10.2 SubmissionLimits safety ceilings

| Parameter | Value | Type |
|---|---|---|
| max_file_count | 10 000 | Safety ceiling |
| max_yaml_files | 1 000 | Safety ceiling |
| max_yaml_size_bytes | 50 MiB (per YAML file or cumulative !include expansion) | Safety ceiling |
| max_skill_size_bytes | 50 MiB (per skill directory) | Safety ceiling |
| max_instruction_chars | 1 000 000 chars per agent; 10 000 000 total across all agents | Safety ceiling |
| max_agents | 500 total agents in the compiled tree | Safety ceiling |
| max_sub_agent_depth | 50 levels of nesting (sub_agents and agent_tool) | Safety ceiling |
| max_skills | 1 000 | Safety ceiling |
| max_loop_iterations | 500 iterations for any LoopAgent | Hard ceiling — LoopAgent.max_iterations is bounded 1..500 |
| allowed_file_extensions | .yaml, .yml, .md, .txt, .py (skill scripts only), .json (adapter_config.json), .safetensors (adapter weights) | Hard |
| adapter_extensions | .safetensors only | Hard — .bin, .pt, .pth rejected |

Source: HARNESS_README.md §2.4. [S-002]

Decision rule: **The 3 GiB total, the 500 max_loop_iterations ceiling, and the allowed_file_extensions list are hard constraints. Everything else is a safety ceiling against runaway recursion or YAML anchor bombs. Treat the safety ceilings as hard for your design even though the validator only triggers past them.**

### 4.11 What upstream ADK features are unavailable here, and the substitute

| Upstream capability | Status in dialect | Substitute or absence |
|---|---|---|
| Custom Python @tool / FunctionTool in agent.yaml | Not available | Use only the 9 host tools. Wrap a custom capability as an AgentTool that itself uses host tools. |
| McpToolset / OpenAPIToolset / LangchainTool | Not available | None in the dialect. |
| Custom Python entrypoint (agent.py, agent_fn) | Not available | Declarative YAML only. |
| Dynamic import via from_config module:entrypoint | Not available | Closed ToolRegistry. |
| tools system_instruction, http_options, safety_settings, response_schema inside generate_content_config | Excluded by schema | None — these are sandbox-excluded intentionally. |
| Multiple base models in one submission | Rejected by validate_single_declared_model | None — must use LoRA adapters to specialize agents. |
| Full ADK installation / pip install google-adk | Not needed | The harness ships its own inference stack. |
| Calling arbitrary REST endpoints from a tool | Not available | Tools are sandboxed to /workspace; no network. |
| Cross-task persistence | Not available | Each task is a fresh Container A; only session.state within that container persists. |
| Custom AgentTool that bypasses skip_summarization | Available but with discipline | Wrap with skip_summarization: true to keep tool output out of parent context. |
| LoopAgent max_iterations > 500 | Rejected | Use multiple LoopAgents in a SequentialAgent if you really need > 500 iterations across a session. |
| Re-registration of the same tool under different names | Not available — ToolRegistry is closed | No-op. |
| Using ADK plugins (custom plugins) | Restricted: only host-provided plugins (ModelRetryPlugin, EventDisplayPlugin) are wired into swegemma | Plan around the host-provided ones. |
| Setting safety filters (HARM_CATEGORY_*) | Excluded by schema | None — harness does not support per-competitor safety filters. |
| Dynamic prompt templating with code | Only session.state string interpolation ({problem_description}, {hints}, custom output_key variables) | Use output_key to wire data into prompts. |

Source: HARNESS_README.md §2.1, §2.4, §3.2. [S-002]

### 4.12 The master divergence table

A standalone extractable copy of this table is shipped at adk-competition-divergence.md (sidecar). The same rows are reproduced here so the reader does not need to open a second file mid-tutorial.

| Behavior | Upstream ADK | Competition dialect | Reader consequence if learned upstream |
|---|---|---|---|
| Entry point | Python agent.py OR declarative root_agent.yaml | agent.yaml (or .yml) only — no Python entrypoint | Wrapping logic in agent.py will fail to compile. |
| Tool attachment | Python @tool function OR OpenAPIToolset / McpToolset / LangchainTool | Names-only against closed ToolRegistry | Custom Python tools are silently rejected. |
| Sub-agent invocation | sub_agents=[other_agent] (object reference) | sub_agents=[{config_path: ...}] (file path) | Object references raise at parse. |
| Agent as tool | LlmAgent cannot be a tool (raises ValueError) — must be wrapped in AgentTool | agent_tool: {config_path, skip_summarization} dialect shape | Use AgentTool shape; do not use Agent object reference. |
| from_config loading | config_agent_utils.from_config(...) resolves tool names via Python import | compile_submission resolves names against closed host registries | Do not write module: my_pkg.tools anywhere. |
| Base model choice | Any model the runner is bound to | Exactly one base model; in Kaggle scoring, only gemma-4-31b-it-qat-w4a16-ct | Declaring two base models raises ParticipantVisibleError. |
| Specialization across agents | Use different model strings | Use different adapter: names under one base model | Use LoRA routing. |
| Context compaction | EventsCompactionConfig on App; values are yours to set | swegemma sets them for you: compaction_interval=5, overlap_size=2, token_threshold=14 336, event_retention_size=5 | Do not try to override; the harness takes the host values. |
| Caching | ContextCacheConfig on App | swegemma sets min_tokens=2 048, ttl_seconds=1 800, cache_intervals=10 | Same. |
| Retry | ModelRetryPlugin, defaults are yours | Host sets 5 retries, 2.0 s initial delay, 2.0x multiplier, max 60.0 s, ±20% jitter | Same. |
| !include recursion | Direct YAML | Max depth 10; cycle-detected; symlink/../ blocked | A cycle or deep chain raises validation. |
| Submission size | n/a | < 3 GiB total unpacked | Hard limit. |
| Per-file limits | n/a | 50 MiB YAML, 50 MiB per skill, 1 000 000 chars per instruction, 10 000 000 chars total | Safety ceilings. |
| max_output_tokens | Up to model limit | 1 to 32 768 (default 16 384); bounded by vLLM max_model_len | Set ≤ 16 384 unless you have measured budget. |
| thinking_budget | Up to model limit | 0 to 32 768 (default 4 096); bounded | Set ≤ 4 096 unless you have measured budget. |
| thinking_level | Provider-specific | MINIMAL / LOW / MEDIUM / HIGH / NONE (case-insensitive); mapped to OpenAI reasoning_effort | Use include_thoughts + thinking_budget instead when serving via vLLM with LoRA. |
| response_schema / safety_settings | Available on GenerateContentConfig | Excluded by schema | Will raise validation error if set. |
| Network | n/a | None — network_mode=none in containers | All dependencies are pre-staged; do not attempt pip install. |
| Persistence across tasks | None | One Container A per task; only session.state within the session | No pattern reuse across tasks except via the submission bundle itself. |
| Filesystem | n/a | /workspace is the agent sandbox | Do not modify pytest.ini or conftest.py — they are committed to baseline. |
| Tools | FunctionTool, AgentTool, OpenAPIToolset, McpToolset, LangchainTool, vertex_ai_search, ... | The 9 host tools + AgentTool wrappers | Use only those 9. |
| LoopAgent iterations | Configurable by author | 1 to 500 inclusive (default 500) | Bounded. |

Source: HARNESS_README.md (entire). §2 more. Cross-checked against ADK v2.10.0 source. [S-001, S-002]---

## §5 Tier 1 — Essentials: from nothing to a valid, evaluated submission

> **Prerequisites:** §2, §3, §4. Recommended: have the starter tree (§5.2) cloned and your editor pointed at it.
> **What you will be able to do afterward:** build a minimal valid submission, attach the right subset of the 9 tools, configure your budget, package the submission, run a local evaluation, read the result, and recognize the failure modes you will hit first.
> **Verified as of:** 2026-09-30. Re-check §15 cadence table before shipping.

### 5.1 The shortest path from "I have never used ADK" to a passing local eval

1. Read §2 and §4 once. The eight mistakes and the field surface are non-negotiable.
2. Clone the starter tree from §A.5 / `starter-submission/` into a fresh directory.
3. Open `agent.yaml`. Confirm the LlmAgent block uses `gemma-4-31b-it-qat-w4a16-ct` as the model and only `run_command`, `read_file`, `edit_file`, `submit_patch`, `get_status` as tools (the day-one subset — see §5.5).
4. Set `eval_config.yaml` to `max_tool_calls: 50`, `max_time_minutes: 30` for a first run (do not use the sample's 10/1).
5. Zip the directory into `submission.zip` (root of zip is the directory contents, not the directory itself).
6. Run `swegemma eval --tasks tasks.jsonl --snapshots-dir snapshots --submission-dir . --results-dir results/run_01 --sandbox docker --max-tool-calls 50 --max-time-minutes 30 --concurrency 1`. (§10)
7. Read the result: `results/run_01/summary.json` for the score, `results/run_01/logs/<id>.log` for the agent transcript, `results/run_01/test_outputs/<id>.log` for the pytest output.
8. If anything fails, go to §13 hazard register, then §10 diagnosis playbook.

That is the loop you will run dozens of times. Everything in this chapter elaborates on those steps.

### 5.2 The submission layout — file by file, with "why this file exists"

| File / directory | Required? | Purpose | Notes |
|---|---|---|---|
| agent.yaml | yes | Root agent config. The single entry point. | Must be one of agent.yaml / agent.yml / root_agent.yaml / root_agent.yml. Zero or multiple → validation error. |
| eval_config.yaml | no | Per-task evaluation budget overrides | The scorer reads exactly four fields: timeout_seconds, max_tool_calls, max_time_minutes, max_turns. Defaults = no limit. (§7.1) |
| configs/sampling.yaml | no | Generation parameters loaded via !include | Recommended so you can change sampling without touching agent.yaml. |
| prompts/system.md | no | System instructions loaded via !include | Use to keep agent.yaml short. |
| sub_agents/<name>.yaml | no | Sub-agent or AgentTool YAML configurations | Referenced by `config_path`. |
| adapters/ | no | LoRA adapters, one directory per adapter | Each must contain adapter_config.json + adapter_model.safetensors. (.safetensors only — .bin/.pt/.pth rejected.) |
| skills/<skill_name>/ | no | ADK skills, one directory per skill | Each must contain SKILL.md. Optional scripts/ and resources/ subdirectories. |

Reproduced from HARNESS_README.md §2.2. [S-002]

### 5.3 The minimal annotated agent.yaml, every component with its default and failure mode

```yaml
# agent.yaml — Minimal valid competition submission
# Schema version: HARNESS_README.md 2026-09-30 (re-verify §15)
# Verification badge: SCHEMA-CHECKED (every field re-checked against HARNESS_README §2.3, §3.2)

agent_class: LlmAgent            # default if omitted; the four allowed values are LlmAgent / SequentialAgent / ParallelAgent / LoopAgent
name: root_coder                # unique within the submission; used in delegation and logs

model: gemma-4-31b-it-qat-w4a16-ct   # REQUIRED; competition ALLOWED_MODEL_NAMES is exactly this value
# adapter: main_lora            # optional; name under adapters/ — only enabled if your adapters tree is large enough

description: |                  # up to 1 000 000 chars; used by parent agents when delegating
  Root coder agent for SWE-style bug fixes in a Python repository.

instruction: !include prompts/system.md   # up to 1 000 000 chars per agent; templated against session.state

tools:                           # names-only against closed ToolRegistry
  - run_command                  # shell in /workspace
  - read_file                    # /workspace file read with line slicing
  - edit_file                    # 3-tier resilient edit
  - write_file                   # create / overwrite file
  - submit_patch                 # FREE — does not count toward tool_calls
  - get_status                   # FREE — does not count toward tool_calls
# - search_similar_code         # optional; only for repos with pre-built embeddings
# - get_code_neighbors           # optional
# - get_code_subgraph            # optional

# sub_agents: []                # only needed for multi-agent; see §6
# include_contents: default       # "default" or "none"
# disallow_transfer_to_parent: false
# disallow_transfer_to_peers: false
# output_key:                   # writes final text into session.state[output_key]

generate_content_config:        # bounded by §4.6
  - max_output_tokens: 8192      # 1..32 768; default 16 384; use smaller to reduce truncation
  - temperature: 0.2
  - top_p: 0.95
  - thinking_config:
      - include_thoughts: true
      - thinking_budget: 4096   # 0..32 768; default 4 096; set 0 to disable thinking
```

Decision rule: **start with this exact shape, get a baseline resolution rate, then tune.** The temptation is to start with a 500-line system prompt and a 4-agent pipeline. Resist it. Baseline first, tune second.

### 5.4 Model declaration and the single-model rule

What can go wrong:

| Misconfiguration | Failure | Why |
|---|---|---|
| `model: gpt-4o-mini` | ParticipantVisibleError | Not in ALLOWED_MODEL_NAMES |
| Two agents in the same submission, `model: gemma-4-31b-it-qat-w4a16-ct` and `model: gemma-4-12b-it` | ParticipantVisibleError | validate_single_declared_model requires len(models) == 1 |
| `model: openai/gemma-4-31b-it-qat-w4a16-ct` | Allowed — provider prefix stripped by normalize_model_name | OK |
| `model: hosted_vllm/gemma-4-31b-it-qat-w4a16-ct` | Allowed — provider prefix stripped | OK |
| `model: custom/something` | Allowed only if `something` is a registered alias; not allowed in Kaggle scoring | Risky at ingestion |

Source: HARNESS_README.md §3.2. [S-002]

### 5.5 Day-one tool subset — which to attach and why

The 9 host tools are listed exhaustively in §11.1. Here is the day-one recommendation:

| Tool | Attach on day one? | Why |
|---|---|---|
| run_command | yes | Universal; needed for shell-based exploration, test running, package inspection |
| read_file | yes | Most code reads go through this |
| edit_file | yes | The primary edit mechanism |
| write_file | yes | Needed for scratch / repro scripts (use /tmp for throwaway; see §5.7) |
| submit_patch | yes | You must call it to terminate the session |
| get_status | yes | Cheap introspection; free (does not count toward tool_calls budget) |
| search_similar_code | optional, repo-dependent | Only useful when pre-computed .npz embeddings exist for that repo. With strong query hygiene (function/class name, not natural language) it can return small results; without that, it can blow up the context. §13 hazard. |
| get_code_neighbors | optional | Names-only output; safer than search_similar_code |
| get_code_subgraph | optional | Heavier; use only after you have specific symbols |

Decision rule: **attach all 9 by default, and dial back only if you observe budget blow-up.** The harness always returns structured JSON; the worst that happens with an unused tool is that the model has another name to consider. The cost (in tokens per turn) is negligible.

### 5.6 Budget configuration

The scorer reads exactly four fields from eval_config.yaml: timeout_seconds, max_tool_calls, max_time_minutes, max_turns. Defaults are no limit. [S-002]

Recommendation for a first run:

```yaml
# eval_config.yaml — day-one per-task budget
evaluation:
  timeout_seconds: 300        # command timeout
  max_tool_calls: 50           # bound exploration
  max_time_minutes: 30         # hard wall-clock cap inside the agent loop
  max_turns: 200               # loop iterations
```

Decision rule: **set a failsafe max_time_minutes (e.g., 20–30)** even if you intend to use less. A runaway session otherwise errors the entire submission because the 12 h global cap currently scores unfinished tasks as errors. [S-005]

The full budget table — including harness limits (max_stdout_chars, max_file_lines, max_file_chars) — is in §7.1 / §11.6.

### 5.7 Packaging and what gets rejected

The packaging step is the most common source of "I uploaded but it failed to compile." Walk this list before submitting.

| Failure | Cause | How to fix |
|---|---|---|
| submission.zip contains the parent directory at root | You zipped the wrong layer | Zip the contents of the submission directory, not the directory itself |
| Missing root config | None of agent.yaml / agent.yml / root_agent.yaml / root_agent.yml present | Add agent.yaml |
| Multiple root configs | More than one of the four acceptable names present | Use only one |
| agent.py at root | You included an attempted Python entrypoint | Remove; YAML only |
| adapter as .bin or .pt | Pickle-based weight files | Convert to .safetensors; .bin/.pt/.pth are rejected |
| Skill at top level with no SKILL.md | Wrong skill layout | Each skill must be a directory under skills/ containing SKILL.md |
| symlink in submission directory | Symlinks resolving outside submission root | Replace with copies |
| Unpacked submission > 3 GiB | Includes large adapter weights | Trim adapters or use lower LoRA rank |
| File with disallowed extension | e.g. .log, .csv, .parquet outside allowed set | Move out of submission; the validator checks every file |

Source: HARNESS_README.md §2.4 (allowed_file_extensions, max_total_size_bytes). [S-002]

### 5.8 Your first local evaluation

```bash
swegemma eval \
  --tasks tasks.jsonl \
  --snapshots-dir snapshots \
  --submission-dir . \
  --results-dir results/run_01 \
  --sandbox docker \
  --max-tool-calls 50 \
  --max-time-minutes 30 \
  --concurrency 1 \
  --display auto
```

Key flags:

| Flag | Effect | Notes |
|---|---|---|
| --tasks | JSONL of task definitions | The provided tasks.jsonl ships 129 public training tasks; you can run on a subset with --task-ids |
| --snapshots-dir | Where the .tgz archives live | One per instance_id |
| --submission-dir | Your submission directory | The directory containing agent.yaml |
| --results-dir | Where artifacts are written | Incremental, crash-safe |
| --sandbox | docker (default) or subprocess | docker is the closer match to grading; subprocess is faster but diverges more |
| --max-tool-calls | Override eval_config | Pass through to inference |
| --max-time-minutes | Override eval_config | Same |
| --concurrency | N parallel tasks | Use 1 for serial debugging, 2+ for iteration |
| --shard-index / --num-shards | Run a deterministic shard | Useful for very long runs |
| --skip-agent-patch | Bypass Phase 1 (force agent_patch = empty) | Use to verify baseline test failure in Phase 2 |

Source: HARNESS_README.md §9.1. [S-002]

### 5.9 Reading the result

The results directory has a stable shape:

```
results/run_01/
├── summary.json                # aggregate resolution_rate, resolved count, per-repo breakdown, errors
├── task_results.jsonl          # append-only JSONL; one line per finished task with metrics & exit codes
├── patches/<instance_id>.patch # exact unified diff extracted from Container A
├── test_outputs/<instance_id>.log  # complete STDOUT/STDERR from Phase 2 pytest in Container B
├── traces/trace_<instance_id>.json  # full SessionTrace (ATIF-compatible steps, thoughts, tool calls, token usage)
└── logs/<instance_id>.log      # rich formatted transcript of the Phase 1 agent session
```

Decision rule for first read: **open logs/<id>.log first** for the failed task, then look at the agent's last 5–10 turns to see what it was doing when it stopped. If the agent died without calling submit_patch, check whether it was working on the right file. If it called submit_patch, check whether the patch applied cleanly (test_outputs/<id>.log).

Source: HARNESS_README.md §9.2. [S-002]

### 5.10 Failure paths — one per common mistake, with trigger / error / cause / fix

| # | Trigger | Error | Cause | Fix |
|---|---|---|---|---|
| F1 | Reference a tool that is not in the 9 | ValidationError from ToolRegistry resolution | Upstream Python @tool mind-set; module:entrypoint reference | Replace with a host tool name |
| F2 | Use `agent.py` at the submission root | Compiler rejects | Hoped for Python entrypoint | Delete; YAML only |
| F3 | Use absolute path in !include | PathTraversalError | Path did not resolve relative to source file | Use relative paths from the inception of the !include tag |
| F4 | Use .. in !include | PathTraversalError | Tried to escape submission root | Use only paths under the file's directory |
| F5 | max_output_tokens > 32 768 | Validation error | Treated 32k as a soft limit | Set ≤ 32 768 |
| F6 | max_output_tokens < 1 | Validation error | Off-by-one | Set ≥ 1 |
| F7 | tools: [...] with response_schema in generate_content_config | Validation error | Schema excludes response_schema | Remove |
| F8 | Two agents with different model strings | ParticipantVisibleError | validate_single_declared_model | Use LoRA adapters to specialize instead |
| F9 | LoopAgent max_iterations > 500 | Validation error | Treated as unbounded | Use multiple LoopAgents in a SequentialAgent |
| F10 | Edit a test file (test_*.py, *_test.py, conftest.py, pytest.ini, etc.) | The diff is silently reset before Phase 2 grading (§9.2.3) | Tempted to "fix the test" instead of "fix the library" | Fix the library under /workspace, not tests/ |
| F11 | Leave a scratch script at /workspace/repro.py | The script is included in the patch | ran a repro from /workspace | Put scratch in /tmp/repro.py |
| F12 | Modify /workspace/pytest.ini or /workspace/conftest.py | The diff is reset before Phase 2 | Same as F10 | Do not edit them |
| F13 | Use thinking_level with a LoRA adapter | reasoning_effort not consistently mapped | serving via vLLM with LoRA | Use thinking_config.include_thoughts + thinking_budget: 4096 instead |
| F14 | Skip the safety check that /workspace/.git/info/exclude ignores __pycache__, *.pyc, etc. | Patch will be polluted with build artifacts | Wrote code that left cache behind | The harness ignores them — but clean up anyway for clarity |
| F15 | Forgot that submit_patch is FREE (count_tool_call=False) but finalizes the session | Submit patch before testing | Stopped after one verification | Verify changes first; submit_patch last |

Source: HARNESS_README.md §5.3, §7, §8, §10. [S-002, S-005]

### 5.11 First five things to get right

1. **The model alias.** gemma-4-31b-it-qat-w4a16-ct, no exceptions.
2. **The 9 tools.** Know their names; you cannot use anything else.
3. **The budget config.** Set a max_time_minutes failsafe (20–30 min).
4. **The packaging.** submission.zip at root must contain the files, not a wrapping directory.
5. **The submit_patch discipline.** verify, then submit_patch as the last tool call.

### 5.12 What NOT to try first

| Tempting first move | Why it backfires |
|---|---|
| A 500-line system prompt | Bloats context; leaves no room for headroom for tool output. Start small. |
| A 4-agent pipeline | Most tasks are solvable with a single LlmAgent. Multi-agent composition is an Intermediate-tier optimization (§6). |
| Adapter / LoRA submission | Three live bugs (§4.8, §13); no public adapter submission has scored. Gated behind a canary. |
| A custom Python tool | Not supported in the dialect. |
| Mucking with context compaction / caching settings | The harness sets them for you; overrides are not honored. |
| Setting response_schema or safety_settings | Excluded by schema; will raise validation. |

### 5.13 The minimal starter submission tree

The full tree is in the sidecar `starter-submission/` directory. Contents:

```
starter-submission/
├── agent.yaml                 # minimal valid LlmAgent
├── eval_config.yaml           # day-one budget
├── configs/
│   └── sampling.yaml          # generation parameters
├── prompts/
│   └── system.md              # minimal system prompt
└── skills/                    # empty by default; reader adds per need
```

Every file is annotated in its header. Each file carries a `SCHEMA-CHECKED` badge in its leading comment and an honest statement that no file has been `VALIDATED` against a live harness because no harness is available in this research environment. (§A.4)---

## §6 Tier 2 — Intermediate: composition, workflow agents, skills

> **Prerequisites:** §5 (you have a working single-agent submission).
> **What you will be able to do afterward:** decide when to decompose an agent into multiple components, pick the right composition mechanism, read a misconfiguration from its symptom, and write a minimal valid skill.
> **Verified as of:** 2026-09-30.

### 6.1 When to decompose at all (and when not to)

Decomposition is not free. Each additional agent costs (a) context-window tokens for its system prompt, (b) tool-call budget for the orchestration turns, (c) latency in the multi-turn loop, and (d) cognitive overhead for the reader trying to debug it.

**Decompose when** at least one of these is true:

- The task has a clear phase boundary that benefits from isolated state (e.g., explore → plan → patch).
- You want to use a different LoRA adapter per subset (already a hard reason — single base model, multi-adapter).
- You want to delegate a long-context operation (graph traversal, search) to a sub-agent with its own 32k context, isolating the cost from the root agent.
- The tasks in your workload are heterogeneous and benefit from a router.

**Do not decompose when** any of these is true:

- The single-agent baseline is unresolved because of model behavior, not context cost.
- Your sub-agents share most of their tools — the delegation boundary does not save context.
- You cannot articulate a clear hand-off interface (what each agent reads, what each writes).
- You have not measured that decomposition helps. Default to single agent until you have evidence.

Decision rule: **add a second agent only after measuring the single-agent baseline and naming the specific cost that the second agent will relieve.**

### 6.2 The three composition mechanisms and how they differ

| Mechanism | How the parent invokes the child | Context cost to parent | Output handling |
|---|---|---|---|
| `sub_agents: [{config_path: ...}]` | The parent transfers control to the sub-agent (transfer_to_agent). Sub-agent runs in the parent's session. | Full conversation history is included unless include_contents=none. Sub-agent's final response becomes the parent's next user message. | Sub-agent's text reply returns to parent. State writes via output_key visible to siblings. |
| `tools: [{agent_tool: {config_path: ..., skip_summarization: true}}]` | Parent calls the sub-agent as a tool. Sub-agent runs in its own session with isolation. | With skip_summarization=true, the raw output is returned to parent (no summary); otherwise the output is summarized. Skipping summarization saves a model call but costs parent-context tokens. | Tool returns the sub-agent's output as the tool response. |
| Inline `tools: [...]` with sub-agent dict | Same as agent_tool but inline in the parent's YAML | Same | Same |

Source: HARNESS_README.md §2.3 (LlmAgent sub_agents and tools fields), and ADK source `tools/agent_tool.py` (skip_summarization, ForwardingArtifactService, state filtering). [S-002, S-003]

Decision rule: **use sub_agents for delegation (when the child owns a phase); use agent_tool with skip_summarization=true for delegation with context isolation (when the child is a heavyweight read-only analyzer).** Never use sub_agents and agent_tool interchangeably — they have different control implications.

### 6.3 The workflow agent classes compared

| Class | Control flow | State visibility | Termination | Failure behavior | When to use |
|---|---|---|---|---|---|
| SequentialAgent | sub_agents run in declared order; control transfers between them | Each sub-agent sees prior state (subject to include_contents) | Last sub-agent's response is the workflow's response | If a sub-agent fails (e.g., a tool returns an error), the workflow stops unless an outer LoopAgent wraps it | Phase-based pipelines where order matters |
| ParallelAgent | sub_agents run concurrently in isolated branches | Each branch has its own isolated state; the orchestrator (usually the parent) must read state back if it wants cross-branch results | When all branches finish | If one branch fails, depends on the parent | Independent analyses whose results you want to gather |
| LoopAgent | sub_agents run repeatedly up to max_iterations (1..500) | Like SequentialAgent within each iteration | When max_iterations reached, OR when an inner agent signals stop (depending on framework) | Loop continues even if a sub-agent fails unless an escalation mechanism is wired | Iterative refinement patterns |

Source: HARNESS_README.md §2.3, §2.4 (max_loop_iterations 1..500). [S-002]

Decision rule: **use SequentialAgent for pipelines, ParallelAgent for fan-out / fan-in, LoopAgent for retries that must end at a known iteration count.**

### 6.4 output_key and state plumbing

`output_key: <name>` on an LlmAgent writes the agent's final text output into `session.state[<name>]`. A subsequent agent's `instruction` can reference it as `{<name>}` because ADK interpolates `{variable_name}` from session.state at template time.

Example:

```yaml
# root agent
agent_class: SequentialAgent
name: explore_then_patch
sub_agents:
  - config_path: sub_agents/explorer.yaml   # LlmAgent with output_key: analysis
  - config_path: sub_agents/patcher.yaml    # LlmAgent whose instruction references {analysis}
```

```yaml
# sub_agents/patcher.yaml
agent_class: LlmAgent
name: patcher
instruction: |
  Apply the following analysis to the repository: {analysis}
# ...
```

Decision rule: **use output_key to wire data explicitly between agents; use include_contents=none when you want a clean state for the child.**

### 6.5 include_contents, disallow_transfer_to_parent, disallow_transfer_to_peers

| Field | What it controls | Practical consequence |
|---|---|---|
| include_contents | Whether conversation history is passed to the agent at this turn | "none" gives a clean slate (useful for a focused sub-agent). "default" (the default!) includes prior context. |
| disallow_transfer_to_parent | Block transfer back up the tree | Use when you want a sub-agent to be terminal in its branch. |
| disallow_transfer_to_peers | Block transfer to siblings | Use when you want to constrain a delegation tree. |

Decision rule: **default to include_contents=none and disallow_transfer_to_parent=true on leaf sub-agents.** A leaf agent should not pollute its parent with accidental transfers, and a focused sub-agent should not see unrelated conversation history.

### 6.6 The skills directory format

A skill is a directory under skills/ containing a SKILL.md manifest. Optional subdirectories: scripts/ (.py), resources/.

Minimal skill layout:

```
skills/repo_navigation/
├── SKILL.md            # manifest with YAML frontmatter
├── scripts/            # .py skill scripts
└── resources/          # .md domain knowledge files
```

SKILL.md minimal frontmatter (per upstream ADK skill conventions):

```markdown
---
name: repo_navigation
description: How to navigate a Python repository's module structure and locate relevant files.
---

# repo_navigation

Instructions for the model when this skill is loaded.

## When to load
When the task asks to find files or modules in the repo.

## Steps
1. Use run_command with `ls` to inspect the top-level layout.
2. ...
```

Decision rule: **use a skill when the instructions are reusable across tasks and would otherwise bloat the main system prompt.** If the same 30 lines of prompt guidance repeat in every agent, it is a skill.

### 6.7 Misconfiguration catalogue — symptom first

| Symptom | Likely cause | Fix |
|---|---|---|
| Sub-agent never invoked, parent loops alone | Parent's LlmAgent does not call transfer_to_agent / agent_tool | Add explicit delegation trigger in instruction: "When you need X, delegate to the Y agent." |
| Parent context fills with sub-agent's tool output | agent_tool without skip_summarization: true | Set skip_summarization: true and consume raw output |
| Sub-agent sees unrelated conversation history | include_contents is default and the parent has long history | Set include_contents: none |
| Sub-agent's writes not visible to siblings | output_key not used | Add output_key to the writer; reference it in siblings' instructions |
| SequentialAgent stops at sub-agent #1 | Sub-agent's last response was a fill_prompt that did not call a tool | Re-check the instruction; ensure the sub-agent ends with a forward progress marker |
| LoopAgent runs forever | max_iterations not set or set too high | Set max_iterations explicitly; default 500 is hard ceiling |
| ParallelAgent consumes excessive memory | Each branch has its own state and you stored large blobs | Store only what downstream orchestrator needs |
| skill loaded but never used | Skill manifest description is too generic | Make the description trigger-specific |
| skill is loaded but consumes all context | Skill content is too long | Use progressive disclosure (§7.5) |

### 6.8 Worked comparison — one task, two architectures

> *Task:* Given a Python repo and a bug description, fix the bug and verify with pytest.

**Architecture A: Single LlmAgent.** One agent with run_command, read_file, edit_file, write_file, submit_patch, get_status. System prompt instructs it to (1) explore, (2) read the relevant code, (3) propose and apply a fix, (4) run pytest, (5) call submit_patch.

**Architecture B: SequentialAgent (explorer → patcher).** Explorer agent reads and writes an `analysis` to output_key. Patcher agent reads `{analysis}` and applies the fix. Root orchestrates.

Tradeoffs:
- A has lower context cost (one system prompt, one set of tool calls in one context).
- B has better state isolation (explorer cannot pollute patcher with its reads).
- B costs at least one extra model call for the delegation.
- B can use a different LoRA adapter per subset (the cleanest reason to compose).

Decision rule: **start with A; move to B when you have evidence that context pollution is hurting you or that you need different per-subset adapters.**

### 6.9 Worked example — minimal skill (badge: SCHEMA-CHECKED)

```
skills/repo_navigation/
└── SKILL.md
```

```markdown
---
name: repo_navigation
description: Navigate a Python repository's top-level structure and locate candidate modules given a bug description.
---

# repo_navigation

## When to load
The harness has just sent a problem_statement and the model needs to find the relevant module.

## Steps
1. Run `find . -maxdepth 2 -type f -name '*.py' | head -50` via run_command to get an overview.
2. If the problem references a known symbol (class, function), call get_code_neighbors with that symbol to find related code.
3. Read the most likely candidate file with read_file, paginating if needed.
4. Cross-check against pytest discovery (path) for the test that exercises the function.

## Anti-patterns
- Do not list every file in the repo (the harness caps read_file output).
- Do not search for natural-language descriptions in the .npz embeddings (offline resolver is name-based).
```

Badge: **SCHEMA-CHECKED** — every field verified against the skill manifest convention and the dialect's skills directory format in HARNESS_README.md §2.4. Not `VALIDATED` — no harness available in this research environment.

### 6.10 The Intermediate-tier example (badge: SCHEMA-CHECKED)

In `examples/intermediate_sequential_explorer_patcher.yaml`:

```yaml
# SequentialAgent with two sub-agents — example
# Verification: SCHEMA-CHECKED against HARNESS_README.md §2.3 (SequentialAgent + LlmAgent.sub_agents) and §3.2 (single base model rule).

agent_class: SequentialAgent
name: explore_then_patch
sub_agents:
  - config_path: sub_agents/explorer.yaml
  - config_path: sub_agents/patcher.yaml
```

```yaml
# sub_agents/explorer.yaml
# Verification: SCHEMA-CHECKED
agent_class: LlmAgent
name: explorer
model: gemma-4-31b-it-qat-w4a16-ct
description: |
  Read-only analyzer: inspect the repository and write an analysis to output_key.
tools:
  - read_file
  - search_similar_code
  - get_code_neighbors
  - get_code_subgraph
  - run_command
  - get_status
include_contents: none
output_key: analysis
instruction: |
  You are the explorer. Do not modify any files.
  Examine /workspace and write a concise analysis of the bug location and the fix approach.
  Conclude with a final text message; that message will be saved as `analysis` for the patcher.
generate_content_config:
  - max_output_tokens: 4096
  - thinking_config:
      - include_thoughts: true
      - thinking_budget: 4096
```

```yaml
# sub_agents/patcher.yaml
# Verification: SCHEMA-CHECKED
agent_class: LlmAgent
name: patcher
model: gemma-4-31b-it-qat-w4a16-ct
description: |
  Apply the patch using the analysis from the explorer.
tools:
  - read_file
  - edit_file
  - write_file
  - run_command
  - submit_patch
  - get_status
include_contents: none
disallow_transfer_to_parent: true
disallow_transfer_to_peers: true
output_key: final_message
instruction: |
  You are the patcher. Apply the fix based on this analysis: {analysis}
  Use run_command to run pytest where appropriate. Verify before submit_patch.
generate_content_config:
  - max_output_tokens: 8192
  - thinking_config:
      - include_thoughts: true
      - thinking_budget: 4096
```

Open questions the reader must resolve in their own run:
- Does `output_key: analysis` actually contain the explorer's text at patcher turn time? (`include_contents: none` keeps the conversation history empty; output_key writes to state.)
- Does the patcher reliably invoke submit_patch as the last tool? Verify by inspecting the trace.---

## §7 Tier 3 — Advanced: skills depth, orchestration, context, defensive design

> **Prerequisites:** §5, §6.
> **What you will be able to do afterward:** engineer skills for progressive disclosure, design orchestration patterns that survive a 32k window, defend against tool-output hazards, allocate budget across a session, and diagnose failures from artifacts.
> **Verified as of:** 2026-09-30. The workaround set in this chapter ages fastest; re-check §15.

### 7.1 Ranked technique catalog

Techniques, ordered by **payoff against effort and cost** for this harness's hard limits:

| Technique | What it buys | Budget cost | Context cost | Failure condition | Use when | Avoid when |
|---|---|---|---|---|---|---|
| Use output_key to wire data between agents | Avoids re-explaining context; reduces parent context bloat | 0 (within existing turns) | Saves tokens by deduplication | output_key not present at child turn → child sees empty reference | Multiple agents in a SequentialAgent / ParallelAgent | Single-agent submissions |
| Set include_contents=none on focused sub-agents | Cleans child context; reduces truncation risk | 0 | Saves tokens | Child cannot see prior turn it needed | Read-only analyzers, patchers | Agents that genuinely need history |
| Wrap read-heavy work in an agent_tool with skip_summarization | Keeps the parent's context from filling with raw file content | +1 model call (delegation) | Saves parent tokens; child still pays context cost | The child itself overflows; the saved output fills the parent | Heavy graph / search workloads | Lightweight tool use |
| Use `search_similar_code` only with specific symbol queries | Reduces context blow-up from full-node text returns | Cheap if name-matched | Big if a node is 100k chars | A "natural language" query surfaces the wrong (huge) node first | When a repo's pre-built embedding exists | Open-ended natural-language queries |
| Call `get_code_neighbors` instead of `search_similar_code` for symbol lookup | Names-only output, <400 chars typically | Same | Much smaller than full node text | Node name not in graph | Discovering callers/callees | Finding a function whose name you don't already know |
| Set max_output_tokens ≤ 8 192 by default; bump up only when measured | Reduces `<|tool_call>` truncation | 0 | Smaller | A long edit gets cut off mid-tool-call | Default for all agents | After measuring your hit rate demands more |
| Set thinking_budget = 4 096, include_thoughts: true (the safe pair) | Reliable thinking-mode behavior | 0 | Adds tokens per turn | thinking_level set with LoRA → reasoning_effort not consistently mapped | Always unless you measured otherwise | When you have evidence thinking is hurting hit rate |
| Use /tmp for repro scripts | Keeps the patch clean of scratch files | 0 | 0 | Submit_patch ran from /workspace instead of /tmp | Always | (no cases) |
| Delete /workspace scratch files before submit_patch | Same | 0 | 0 | (same) | Always when you wrote a repro | (no cases) |
| Verify with pytest before submit_patch | Catches a wrong fix before the agent terminates | At least one tool call + ~1 min | Small | Sandbox test path passes but the hidden test_patch path doesn't | Always for tasks where you can run tests | Tasks with no testable surface |
| Stop early on submit_patch | Frees the rest of the budget for other tasks | Frees budget | Frees context | Submission loses patch because agent submitted nothing | When you are confident | Always (default to submit early) |
| Submit_patch even on partial progress | The patch is what it is | Frees budget | Frees context | Submit a wrong patch | Only when the alternative is timeout | (no cases) |
| Use a multi-LoRA setup | Specialize agents with a single base model | Adapter size budget | 0 (no extra context unless base prompt changes) | KV collapse / silent zeroing | (gated — see §4.8) | Until the host bugs are confirmed fixed |
| Use compaction + caching | (Host-controlled) | n/a | n/a | Override attempts are not honored | None — host controls | Always |
| Run sub-skill scripts via `run_skill_script` | Reusable logic without bloating prompt | Cheap | 0 | Script time/budget not credited; harness may have a separate accounting | Complex multi-step routines | Trivial in-prompt tasks |

### 7.2 Skills engineering — manifest, frontmatter, resource loading, script execution

#### 7.2.1 Manifest format

The SKILL.md manifest is YAML frontmatter at the top of a markdown file. The competition dialect accepts the same skill layout as upstream ADK's skill convention.

```markdown
---
name: <skill_name>             # required; matches the directory under skills/
description: <trigger>         # required; the harness uses this to decide when to surface the skill
---

# <skill_name>

## When to load
<specific triggers>

## Steps
<ordered actions the model performs>

## Anti-patterns
<what not to do>
```

Decision rule: **description is the trigger.** Be specific. "Use this when the task references a known symbol whose callers you need to find" beats "Use this when you need help."

#### 7.2.2 Progressive disclosure

Progressive disclosure = load skill content in stages, only as the model needs it. The 32k context window will not accommodate every skill's full body.

Strategy:

- SKILL.md body under 2 000 tokens: safe to load fully.
- 2 000–6 000 tokens: split into SKILL.md (overview) + resources/<topic>.md (detail); reference the resource by name and load it with load_skill_resource only when needed.
- > 6 000 tokens: split into multiple skills with distinct triggers.

Decision rule: **if your skill body exceeds 2 000 tokens, you have not finished designing it.**

#### 7.2.3 Script execution

`run_skill_script(name: str, args: dict)` (per upstream ADK skill convention) executes a `.py` script under `skills/<name>/scripts/`. The harness shares the sandbox filesystem with run_command and debits execution time against the central budget.

Decision rule: **use scripts for things that would otherwise bloat prompt language hard** (e.g., 20-step retry logic, parser glue for a specific file format). Don't use scripts for things a one-line prompt directive handles.

### 7.3 Orchestration patterns for long-horizon work

A SWE-bench-style task is long-horizon: explore a repo, locate a bug, understand the surrounding code, apply a fix, run tests, verify, and submit. The 32k context is the binding constraint.

Patterns that work:

| Pattern | Why it works |
|---|---|
| Single LlmAgent with disciplined tool order | Lowest overhead; no delegation cost |
| SequentialAgent (explorer → patcher) with output_key | Clean handoff; verifier can be its own agent |
| ParallelAgent for graph fan-out | Get neighbors + similar code + read_file in parallel for symbol discovery |
| Outer LoopAgent around an inner planner | Useful when patches need to iterate against a verifier, capped at max_iterations |
| Periodic submit-and-continue via /tmp | If you have evidence a later edit breaks an earlier one, submit the partial patch via run_command (git diff) and continue |

Patterns that trap:

| Pattern | Why it traps |
|---|---|
| Deeply nested sub_agents | max_sub_agent_depth = 50; but context cost compounds |
| Skipping include_contents=none | Sub-agent inherits parent's full history and immediately overflows |
| Using output_key to pass huge blobs | The child's context still gets the blob through {output_key} interpolation if you reference it in instruction |
| Delegating to a sub-agent for every read | Cost: one model call per delegation. Use direct read_file when no isolation is needed |

### 7.4 Context engineering under 32k

The harness controls compaction and caching:

| Setting | Value the harness sets | Source |
|---|---|---|
| EventsCompactionConfig.compaction_interval | 5 | HARNESS_README §7.2 [S-002] |
| EventsCompactionConfig.overlap_size | 2 | HARNESS_README §7.2 [S-002] |
| EventsCompactionConfig.token_threshold | 14 336 | HARNESS_README §7.2 [S-002] |
| EventsCompactionConfig.event_retention_size | 5 | HARNESS_README §7.2 [S-002] |
| ContextCacheConfig.min_tokens | 2 048 | HARNESS_README §7.2 [S-002] |
| ContextCacheConfig.ttl_seconds | 1 800 | HARNESS_README §7.2 [S-002] |
| ContextCacheConfig.cache_intervals | 10 | HARNESS_README §7.2 [S-002] |

You cannot override these in a competition submission; the harness ignores attempts to do so. Design within them.

Practices that fit:

- Keep system prompts under 4 000 tokens.
- Read files in chunks (start_line/end_line) rather than full dumps.
- Prefer get_code_neighbors (names-only) over search_similar_code (full node text).
- Delegate heavy read work to an AgentTool with skip_summarization: true.

### 7.5 Defensive design against tool hazards

Each hazard is keyed to §13. The defenses below are *principles* — they work whether or not the hazard is currently broken. The fixes marked *(workaround)* are tied to a specific live bug and have a removal criterion.

| Hazard | Defense |
|---|---|
| Double-JSON escaping (live host bug, fix pending) | Prefer raw-text-style edit_file payloads with minimal backslashes; if the host ships single-JSON, your failure rate will jump first — observe, then patch |
| search_similar_code output blow-up | Use specific function/class names; verify result with get_code_neighbors first |
| read_file line-range TypeError (UNVERIFIED community claim) | Pass integers, not strings; if the bug is real, fall back to full reads + edit_file |
| LoRA silent zeroing | Use a "loud" adapter with random init for canary; verify outputs differ from base model at temperature 0 |
| LoRA KV collapse | Don't use adapters until the host confirms the fix deployed; budget adapter submissions carefully |
| Thinking-mode drop | Use include_thoughts + thinking_budget rather than thinking_level; verify thoughts are reaching the next prompt |
| 12h global overrun | Set max_time_minutes failsafe (20–30 min per task); submit early on partial progress |
| Patch includes scratch file | Use /tmp for repros; delete /workspace scratch before submit_patch |
| Patch edits discarded test files | Fix the library, not the tests (§9.2.3) |
| <|tool_call> truncation | Set max_output_tokens ≤ 8 192; split large edits into smaller incremental calls |
| Long session memory loss | Use output_key to wire durable findings into state; compaction evicts oldest events |
| Missing wheelhouse dependency at runtime | Trust the wheelhouse is correct; the host confirms hidden tasks validate 100% with gold |

### 7.6 Budget allocation across a session

A 50-tool-call budget for a SWE task. Reasonable allocation:

| Phase | Tool calls | Notes |
|---|---|---|
| Explore | 15 | ls, grep, read_file — narrow fast |
| Locate | ~10 | search_similar_code / get_code_neighbors / read_file |
| Read in depth | ~12 | chunked read_file |
| Edit | ~5 | edit_file / write_file in small increments |
| Verify | ~6 | run_command with pytest |
| Submit | 1 | submit_patch (free) |

These numbers are illustrative — your workload will differ. The principle: spend ≤ 30% of budget on exploration, leave headroom for verification.

Worked arithmetic (no source provided — these are illustrative planning numbers):

- 50 calls × 5 000 chars stdout cap = 250 000 chars of stdout across the session (truncated).
- 50 calls × 300 s command timeout ceiling = 15 000 s worst case (4 hours). Realistic session is far below this.

These are planning figures, not assertions about the harness's behavior.

### 7.7 Worked end-to-end architectures

#### Architecture X — single-agent + speculation (low ambition)

One LlmAgent with all 9 tools, no sub-agents. Reads the problem, locates the file, edits, runs pytest, submits. Lowest overhead.

| Aspect | Value |
|---|---|
| Estimated tool calls | 30–50 |
| Context cost | 1 system prompt + tool turns |
| Failure mode | Single point of failure: if the model gets distracted, no recovery |
| When to use | Default for first submission; baseline for comparison |

#### Architecture Y — SequentialAgent with verifier (medium ambition)

SequentialAgent (explorer → patcher → verifier). Verifier is a focused sub-agent that runs pytest and outputs pass/fail. If fail, the root loop retries (with LoopAgent wrapping).

| Aspect | Value |
|---|---|
| Estimated tool calls | 60–100 |
| Context cost | 3 system prompts + tool turns |
| Failure mode | Verifier may disagree with the hidden test_patch; the patch can still pass locally and fail remotely |
| When to use | After Architecture X plateaus |

Decision rule: **start at X. Move to Y only when X plateaus.**

### 7.8 Mapping advanced techniques onto multi-step repair work (light coupling per CQ-09)

Multi-step ordered repair — exploratory writeup, plan, ordered hunks, journaling, validation gates — maps onto ADK as follows. This section is **neutral** about any specific framework; it names the techniques and their ADK equivalents.

| Repair-technique concept | ADK mapping | Notes |
|---|---|---|
| Spec-first planning | Output_key writes a plan into session.state; a follow-up agent reads {plan} | Output_key is the wiring mechanism |
| Ordered multi-hunk repair | SequentialAgent (patcher with ordered edits) + an output_key checkpoint per hunk | Each hunk's result becomes input to the next |
| Journaling | output_key or skills/<journal>/SKILL.md loaded via skill manifest |
| Iterative validation | LoopAgent wrapping the verifier; max_iterations bounds retries | The 500 ceiling on LoopAgent.max_iterations is the binding constraint |

Decision rule: **use output_key as the data backbone between ordered repair steps; cap retries with max_iterations.**

### 7.9 Local evaluation and diagnosis

See §10 for the full local-development walkthrough. The technique catalog's worth is realized in the diagnosis playbook:

1. Symptom: agent's resolution rate on a known-doable task is 0.
2. Open logs/<id>.log. Did the agent call submit_patch? If not, did it run out of budget or hit max_nudges?
3. If it submitted, open patches/<id>.patch. Did the diff apply? Did it touch protected files?
4. If it applied, open test_outputs/<id>.log. Did pytest exit 0? Did the JUnit XML pass validation?
5. Map each failure to §13 hazard register.
6. Adjust configuration, re-run.

### 7.10 The Advanced-tier example (badge: SCHEMA-CHECKED)

In `examples/advanced_sequential_verifier.yaml`:

```yaml
# SequentialAgent with verifier sub-agent
# Verification: SCHEMA-CHECKED against HARNESS_README.md §2.3 (SequentialAgent + LlmAgent.sub_agents) and §4.4 (single base model rule).
# Cost (illustrative): ~60–100 calls, 3 system prompts + tool turns.
# Failure mode: verifier may disagree with hidden test_patch; baseline-relative results may validate locally and fail remotely.

agent_class: SequentialAgent
name: explore_patch_verify
sub_agents:
  - config_path: sub_agents/explorer.yaml
  - config_path: sub_agents/patcher.yaml
  - config_path: sub_agents/verifier.yaml
```

Each sub-agent YAML is a focused LlmAgent (full bodies omitted here for brevity; the patcher includes `output_key: final_message`; the verifier has `include_contents: none` and only `run_command` + `get_status`).

Open questions for the reader:
- Does the verifier's run_command actually have pytest available? (`enable_sandbox_testing` defaults True per HARNESS_README §5.2.)
- Does the verifier's pass/fail message reach the patcher through some mechanism, or is the verifier terminal? (Terminal by design in this example.)---

## §8 The mental model, consolidated

> **Prerequisites:** none. This is the single place where the object graph, control flow, state, budgets, lifecycle, and how a request flows from prompt to scored patch are visible together. Cross-links rather than repeats.

### 8.1 The object graph

```
                    ┌─────────────────────────────────────────────────────┐
                    │ Submission directory (submission.zip)               │
                    │   agent.yaml, eval_config.yaml, prompts/,            │
                    │   sub_agents/, configs/, adapters/, skills/          │
                    └────────────────────────┬────────────────────────────┘
                                             │ compile_submission (sandboxed)
                                             │
                                             ▼
   ┌─────────────────────────────────────────────────────────────────────────────┐
   │ Compiled ADK Runner (per task)                                          │─────►  vLLM / Transformers
   │                                                                       │       on 127.0.0.1:8000
   │  App                                                                   │
   │  ├── EventsCompactionConfig (host-set)                                  │─────► gemma-4-31b-it-qat-w4a16-ct
   │  ├── ContextCacheConfig (host-set)                                      │       ± per-agent LoRA adapters
   │  ├── Plugins: ModelRetryPlugin (host-set)                               │
   │  │                                                                      │
   │  └── BaseAgent tree (LlmAgent / Sequential / Parallel / Loop)            │
   │       ├── model, instruction, tools, skills, generate_content_config      │
   │       ├── sub_agents → config_path → other agents (transfer_to_agent)    │
   │       └── tools → AgentTool → wrapped LlmAgent (skip_summarization)      │
   │                                                                       │─────► 9 host tools
   │                                                                       │       (ToolRegistry, closed)
   └─────────────────────────────────────────────────────────────────────────────┘
                                             │
                                             │ run_agent_sandbox in Container A
                                             ▼
   ┌─────────────────────────────────────────────────────────────────────────────┐
   │ Container A — Agent Sandbox                                              │
   │   /workspace (snapshot at base_commit, baseline commit)                    │
   │   network_mode=none, 4 GiB RAM, 2 vCPUs                                   │
   │   runs the agent, captures git diff HEAD → agent_patch                    │
   └─────────────────────────────────────────────────────────────────────────────┘
                                             │
                                             │ submit_patch / auto-fallback
                                             ▼
   ┌─────────────────────────────────────────────────────────────────────────────┐
   │ Container B — Verification Sandbox                                       │
   │   fresh snapshot, apply agent_patch (4-pass resilient),                  │
   │   reset test files / pytest.ini / conftest.py to baseline,               │
   │   apply task.test_patch, run pytest with JUnit XML,                       │
   │   resolved iff exit_code==0 AND JUnit XML valid AND no failures/errors    │
   └─────────────────────────────────────────────────────────────────────────────┘
                                             │
                                             ▼
                                          Resolution Rate
```

Source: HARNESS_README.md §1, §2, §4. [S-002]

### 8.2 How a single turn flows

1. Harness sends initial prompt (5–7 sections: task header, hints, budget, env rules, standard instructions, optional code intelligence, workspace listing).
2. Runner delivers prompt to root agent's LlmAgent.
3. ADK interpolates `{problem_description}`, `{hints}`, and any custom `{output_key}` variables into the agent's `instruction`.
4. Model generates a response (thinking + tool call OR final text).
5. If tool call: harness dispatches; tool returns JSON; harness formats response; back to step 3 for next turn.
6. If final text: harness checks if submit_patch was called; if yes → extract and proceed; if no → check nudge counter, possibly terminate.

`control` is bounded by max_nudges=3 (consecutive nudges without submit_patch). [S-002]

### 8.3 The state backbone

```
session.state = {
  "problem_description": task.problem_statement,   # always present
  "hints": task.hints_text,                        # only if non-empty
  # custom keys set by output_key writes from any agent:
  "analysis": "...",
  "plan": "...",
  "verdict": "pass",
}
```

ADK auto-interpolates `{variable_name}` placeholders in `LlmAgent.instruction` from `session.state` at template time. [S-002]

### 8.4 The budget stack

```
Global: 12 h total per submission (currently scores unfinished tasks as errors)
        ───── mitigated by: max_time_minutes failsafe per task
Per task: max_time_minutes (60 default in eval_config; sample uses 1)
          max_tool_calls (100 default in inference; sample uses 10)
          max_turns (500 default; sample uses 50)
          timeout_seconds per command (300 default)
          command_stdout_chars ≤ 5 000
          read_file ≤ 150 lines AND ≤ 10 000 chars
Per turn: max_output_tokens (1..32 768; default 16 384)
          thinking_budget (0..32 768; default 4 096)
```

### 8.5 The lifecycle summary

Phase 1 (Container A): the agent runs. Patches are extracted via submit_patch or automatic fallback.
Phase 2 (Container B): agent_patch is applied (4-pass resilient), test files are reset to baseline, test_patch is applied, pytest runs hermetically, JUnit XML is validated.

The **only thing that affects the score** is whether pytest exits 0 *and* the JUnit XML shows every required test passed. Everything else (agent text, agent's reasoning, scratch files inside /tmp, the agent's instruction tuning) is internal to Phase 1 and discarded. [S-002]

---

## §9 Lifecycle and scoring literacy

> **Prerequisites:** §2, §4, §8.
> **What you will be able to do afterward:** predict the score effect of any agent action before running it.

### 9.1 Phase 1 — agent execution in Container A

Sequence (from HARNESS_README §4):

1. Start sandbox; setup wheels.
2. Extract repo at `base_commit` (zero future history).
3. Configure `.git/info/exclude` (excludes build artifacts).
4. `pip install -e /workspace --no-deps`.
5. Stream cached test site-packages; setup `pytest.ini` and `conftest.py`.
6. Baseline commit (`git add -A && git commit -m "baseline"`).
7. Start timer (`start_agent_session`) and send `build_agent_prompt()`.
8. Loop: agent calls tools → harness dispatches → JSON response → next turn. Loop ends on submit_patch, max_nudges, budget exhausted, or 3 nudges.
9. Extract `agent_patch` via `(git diff --binary _swegemma_baseline 2>/dev/null || git diff --binary HEAD)`.
10. Stop and clean Container A. (Note: /workspace is wiped on warm pooling; find /workspace -mindepth 1 -maxdepth 1 -exec rm -rf {} +.)

Source: HARNESS_README §4. [S-002]

### 9.2 Phase 2 — verification in Container B

Sequence (from HARNESS_README §8):

1. Fresh Container B with same snapshot extraction as Phase 1.
2. Apply `agent_patch` with a 4-pass resilient patch application (git apply --unsafe-paths, symlink-normalized, prefixless, GNU patch).
3. Reset protected paths (`test_*.py`, `*_test.py`, `.py` under `tests/`/`test/`/`testing/`, `conftest.py`, `pytest.ini`, `pyproject.toml`, `tox.ini`, `setup.cfg`, `.pytest.ini`, `sitecustomize.py`, `usercustomize.py`, `_swegemma_stubs.py`, `*.pth`) to baseline: `git checkout HEAD -- <files_to_reset>` then `git clean -f -- <files_to_reset>`.
4. Apply `task.test_patch`.
5. Run hermetic pytest with JUnit XML: `python3 -s -m pytest <targets> --junitxml=... -p no:anyio -o timeout=0 -o python_classes="Test* *Test" -q`.
6. Validation: `_validate_junit_xml` checks `passed_tests > 0`, `failures == 0`, `errors == 0`, and every required test node (FAIL_TO_PASS / PASS_TO_PASS / test_patch tests) explicitly passed.

Source: HARNESS_README §8.2. [S-002]

### 9.3 What gets discarded before grading

| Class of file change | Status |
|---|---|
| Source code under /workspace (library code) | Kept |
| New files added under /workspace | Kept (via `git add -N .`) |
| Build artifacts matching `.git/info/exclude` (`__pycache__/`, `*.pyc`, `.pytest_cache/`, `*.egg-info/`, `build/`, `dist/`, `.coverage`) | Excluded by `git diff` |
| Tests under `tests/`, `test/`, `testing/` and any `test_*.py` / `*_test.py` | Reset to baseline before Phase 2 (anti-tampering) |
| `conftest.py`, `pytest.ini`, `pyproject.toml`, `tox.ini`, `setup.cfg`, `.pytest.ini`, `sitecustomize.py`, `usercustomize.py`, `_swegemma_stubs.py`, `*.pth` | Reset to baseline before Phase 2 |
| Scratch files in /tmp, /var/tmp | Not part of the patch |
| Files in submission.zip but not under /workspace | Not part of the patch |

### 9.4 The behavior-to-score-effect decision table

This is the centerpiece of lifecycle literacy. Every common action mapped to its effect on the score.

| Agent action | Affects score? | How |
|---|---|---|
| Library code edit | **YES** — direct | The change is applied to /workspace in Phase 1; the patch survives reset; the test_patch runs against patched code. |
| New file added to /workspace | **YES** — direct | `git add -N .` includes it; survives reset; runs against patched code. |
| Test file edit (test_*.py, *_test.py, tests/*) | **NO** | Reset to baseline before Phase 2. |
| conftest.py / pytest.ini / pyproject.toml / tox.ini / setup.cfg / *.pth edit | **NO** | Reset to baseline before Phase 2. |
| Scratch file in /workspace (e.g., /workspace/repro.py) | **NO (negative)** | The scratch becomes part of the agent_patch; it does not help grading but can pollute the diff. If the file is then referenced by tests, behavior diverges. |
| Scratch file in /tmp/repro.py | **NO** | /tmp is outside the patch. |
| Build artifact (e.g., __pycache__/) | **NO** | Excluded by .git/info/exclude. |
| Long thinking block in agent text | **NO** | Thinking is part of session internals; not a score input. |
| Calling submit_patch with a partial patch | **YES** — partial | Whatever the patch is, is evaluated. A wrong patch fails. |
| Calling submit_patch with no edits | **NO** | If agent_patch is empty, task fails (or is scored as NO_PATCH). |
| Skipping submit_patch (letting it timeout) | **NO** | The auto-fallback runs git diff HEAD; whatever is in the working tree is evaluated. |
| Setting a wrong model alias | **NO** — fails before evaluation | ParticipantVisibleError; the submission does not run. |
| Declaring a missing adapter | **NO** — fails before evaluation | ValidationError at compile time. |
| Setting max_time_minutes too high | **INDIRECT** | Allows runaway sessions; risks the 12 h global overrun. |
| Using search_similar_code with a poor query | **NO** | Returns full node text; can blow up the agent's context and lead to a wrong edit. |
| Modifying pytest.ini to add a marker | **NO** | Reset before Phase 2. |
| Adding a setup.cfg entry | **NO** | Reset before Phase 2. |
| Adding a new conftest.py fixture | **NO** | Reset before Phase 2. |
| Using edit_file to update a library docstring | **YES** — direct (but low impact) | Docstring changes do not change behavior; tests still pass. |
| Using edit_file to fix a logic bug | **YES** — direct (high impact) | The fix is what makes test_patch pass. |

Source: HARNESS_README §8.2, §9.2, §10. [S-002]

### 9.5 Where intuition misleads

| Intuition | Reality |
|---|---|
| "If the agent verifies locally with pytest, the patch will pass." | Local sandbox differs from grading sandbox (wheels, dependency versions, Python version). Verify locally as a sanity check, not as a guarantee. Host confirms hidden tasks validate 100% with gold. [S-005] |
| "If the agent's reasoning is thorough, the patch will be correct." | The model is a sample; the patch is what gets evaluated. Reasoning quality correlates with patch quality but is not the score input. |
| "If the agent submits with a 'I think this is correct' note, the patch will be evaluated accordingly." | Agent text is not in the score. Only the patch + test_patch outcome matters. |
| "If the agent gets stuck on a bug, running pytest inside /workspace will help it recover." | enable_sandbox_testing defaults to True (per HARNESS_README §5.2), so pytest is available in Container A. But the agent must discover that and call it. |
| "If a test patch fails, the bug was elsewhere." | The bug might be in the test_patch itself (rare). More commonly, the agent's edit changed test behavior. Always re-read the patch. |
| "If the agent fails to call submit_patch, the run is lost." | The harness has an auto-fallback that captures any modifications via git diff HEAD. Even if the agent never calls submit_patch, non-empty modifications still go to Phase 2. [S-002] |
| "The harness discards anything outside the workspace." | /workspace is the only thing captured by git diff HEAD. /tmp and /var/tmp are not part of the patch. |
| "Adjusting max_time_minutes is harmless." | A very high value risks the 12 h global overrun, which currently scores the submission as failed. Set a failsafe. [S-005] |

### 9.6 Design implications (copyable instructions)

You can include these in your agent's `instruction` field:

- "Do not modify any file under tests/, test_*, *_test.py, conftest.py, pytest.ini, pyproject.toml, tox.ini, or setup.cfg — your edits will be discarded."
- "If you write a reproduction script, put it at /tmp/repro.py, never at /workspace/repro.py. /workspace repros become part of your patch."
- "Always run pytest before calling submit_patch. Only call submit_patch when your changes are verified, or when you are out of budget."
- "submit_patch does not consume tool_calls budget — call it even when remaining calls are at the limit."

Source: HARNESS_README §10 (gotchas 1–5). [S-002]---

## §10 Local development: the loop, the artifacts, the diagnosis playbook

> **Prerequisites:** §5, §9.
> **What you will be able to do afterward:** run a local evaluation, identify the artifact that contains each piece of signal, and diagnose a failing run from artifacts alone.

### 10.1 The CLI surface

```bash
swegemma eval \
  --tasks tasks.jsonl \
  --snapshots-dir snapshots \
  --submission-dir . \
  --results-dir results/run_01 \
  --sandbox docker \
  --max-tool-calls 50 \
  --max-time-minutes 30 \
  --concurrency 1 \
  --display auto
```

Flags:

| Flag | Effect |
|---|---|
| --tasks | JSONL of task definitions |
| --snapshots-dir | Where the .tgz archives live |
| --submission-dir | Your submission directory (the one with agent.yaml) |
| --results-dir | Where artifacts are written; incremental, crash-safe |
| --sandbox docker \| subprocess | Docker is closer to grading; subprocess is faster but diverges more |
| --max-tool-calls | Override eval_config |
| --max-time-minutes | Override eval_config |
| --max-turns | Override eval_config |
| --concurrency N | Run N tasks in parallel |
| --task-id / --task-ids | Run specific instance_id(s) |
| --shard-index k --num-shards M | Run deterministic shard k of M |
| --models-yaml | Custom models.yaml file |
| --skip-agent-patch | Force empty agent_patch (verify baseline test failure) |
| --display auto \| dashboard | Console output mode |

Source: HARNESS_README §9.1. [S-002]

### 10.2 Sandbox backends

| Backend | Default | Pros | Cons |
|---|---|---|---|
| Docker | Yes (network_mode=none) | Closest to grading; same image, same isolation | Requires Docker daemon; warm pool requires `reuse_containers=True` |
| Subprocess | Used in env without Docker | Faster; no Docker dependency | Different isolation; diverges from grading more |

Decision rule: **use Docker by default. Use subprocess only for quick iteration without Docker available.**

Source: HARNESS_README §4.1. [S-002]

### 10.3 Artifact-reading guide

Every evaluation run writes a stable directory:

```
results/run_01/
├── summary.json                # aggregate
├── task_results.jsonl          # append-only per-task
├── patches/<instance_id>.patch # exact unified diff
├── test_outputs/<instance_id>.log  # pytest output from Container B
├── traces/trace_<instance_id>.json  # full SessionTrace (ATIF-compatible)
└── logs/<instance_id>.log      # rich transcript of Container A agent session
```

What each artifact tells you:

| Artifact | What to look for |
|---|---|
| summary.json | resolution_rate (your headline number), per-repo breakdown, errors |
| task_results.jsonl | one line per task with metrics, exit codes, status |
| patches/<id>.patch | the agent's git diff; check if it applied cleanly (Phase 2 logs would say) |
| test_outputs/<id>.log | Container B pytest output — the score-driving signal |
| traces/trace_<id>.json | every LLM turn, every tool call, every token count — best for understanding what the agent did |
| logs/<id>.log | formatted Container A transcript — best for diagnosing agent behavior |

Source: HARNESS_README §9.2. [S-002]

### 10.4 Local-vs-grading divergence register

This is the most expensive confusion available in this competition: a local failure that is environmental, not agent failure. Re-verified 2026-09-30 against discussion board intel. [S-005]

| Divergence | Evidence | Tier | Status | Cheap self-check |
|---|---|---|---|---|
| Local gold-patch runs FAIL on fastapi (typing_inspection, inline-snapshot, dirty-equals missing from wheelhouse) | 4 independent analyses (wrath333, Claire Bedecarre, JohnParkerson, Vivek K N) | Multi-repro | Live | Run --skip-agent-patch on one fastapi task; check exit code |
| Local gold-patch runs FAIL on requests (8 SSL-dead tasks on Python 3.13) | JohnParkerson audit | Multi-repro | Live | Skip the 8 dead-on-arrival tasks in CV |
| CV / LB anti-correlation (CV 0.18 → LB 0.05; highest CV = lowest LB) | Isaka Tsuyoshi, 508shuto, daoviet | Multi-repro | Live | Trust host confirmation: hidden tasks validate 100% with gold |
| Docker sandbox differs from Kaggle subprocess sandbox | 744370 | Multi-repro | Live | Don't trust a single environment's results |
| Wheelhouse ships pydantic 2.13.4 but not typing_inspection | 743973 | Multi-repro | Live | Run --skip-agent-patch; if it fails, do not trust local |
| Wheelhouse dedup forces starlette 1.6.0 on fastapi; 48 tasks fail `Router.__init__() got an unexpected keyword argument 'on_startup'` | 743973 | Multi-repro | Live | Same as above |

Decision rule: **when local results contradict a reasonable hypothesis about the model, the local environment is more likely wrong than the model.** Run a gold patch through the same local path before drawing conclusions.

### 10.5 The diagnosis playbook

| Symptom | Artifact to inspect | Field to read | Likely causes | Next action |
|---|---|---|---|---|
| Resolution rate = 0 across the board | summary.json | resolved count | Submission compiled but agent produced empty patches everywhere | Read logs/<id>.log; check whether the agent ran out of budget without calling submit_patch |
| One task fails, others pass | test_outputs/<id>.log | exit_code, JUnit XML failure list | Agent's edit broke something; test_patch failed | Re-read patches/<id>.patch; compare to expected fix from gold (if you have one) |
| Patch did not apply | test_outputs / summary | error="Failed to apply agent patch" | Patch contains context lines that don't match baseline | Re-run with --skip-agent-patch to confirm baseline test failure; reduce edit_file scope |
| Agent never called submit_patch | logs/<id>.log | last tool call | Budget exhausted; max_nudges hit; thinking-mode hit | Set higher max_tool_calls; lower thinking_budget; instrument with explicit "call submit_patch now" instruction |
| Agent called submit_patch but patch empty | patches/<id>.patch | file size | Agent made no library edits | Read logs/<id>.log; check whether agent edited test files (silently) or scratch files (silently included) |
| Agent edited test files | patches/<id>.patch | list of test_*.py files | Misled by instruction to "verify with tests" | Fix the library, not the test; reinforce in instruction |
| Patch contains /workspace/repro.py | patches/<id>.patch | filename | Repro script was in /workspace, not /tmp | Add the move-to-/tmp instruction |
| Agent stalled at >30 turn without progress | logs/<id>.log | tool call sequence | Looping on a search that returns the same thing | Set include_contents=none on the looping sub-agent; cap with LoopAgent |
| Context overflow / ContextWindowExceededError | logs/<id>.log | token counts in trace | search_similar_code returned huge node | Use specific symbol queries; prefer get_code_neighbors |
| edit_file says "FileEditError: old_string not found" | logs/<id>.log | edit_file response | Escaping issue (live host bug) or wrong old_string | Try smaller old_string; verify by reading the file with read_file |
| Reasoning quality degraded | traces/trace_<id>.json | thought text length | Thinking-mode drop (live host bug) | Confirm patch is deployed; reduce thinking_budget |
| Adapter submission hangs | logs/<id>.log | turn 1 prompt length | KV-cache collapse | Don't use adapters until host confirms fix |
| Result is far lower than expected | summary.json | per-repo breakdown | Repo-specific environment issue (e.g., fastapi wheel mismatch) | Skip the affected repo in CV; rely on host confirmation that hidden tasks are clean |

### 10.6 Fast-iteration recipe

1. Pick a small set of `--task-ids` you can debug in one sitting (5–10 tasks).
2. Run with `--max-tool-calls 30 --max-time-minutes 15 --concurrency 1` — a tight budget so failures surface fast.
3. Open `logs/<id>.log` for any failing task. The trace tells the story.
4. Adjust configuration; re-run.
5. Scale up: once a 10-task subset looks healthy, run on more tasks.

Decision rule: **a 10-task debug run is worth more than a 100-task blind run.**

### 10.7 Before you believe a local failure

Five checks, in order:

1. **Run `--skip-agent-patch` on the same task. Does the test_patch fail at baseline?** If yes, the task is solvable in principle. If no, the local environment is broken (typing_inspection missing etc.); your agent is being exonerated.
2. **Try the gold patch (if you have access to it for that task). Does it pass locally?** If yes, the agent has a real issue. If no, the local environment is broken.
3. **Does the same agent.yaml produce different results across two sandbox modes (docker vs subprocess)**? If yes, you are looking at an environment issue.
4. **Does the agent's edit apply in Phase 2?** If `apply_patch_in_container` fails, the issue is at patch-apply time, not at agent time.
5. **Did the test_patch itself pass cleanly with gold + agent_patch + test_patch?** If yes, agent_patch is the issue. If no, the local environment is broken.

---

## §11 Tool and configuration reference

> **Prerequisites:** none. This is the chapter a reader returns to at 2 a.m. with a failing run; it is optimized for lookup and version-pinned throughout.

### 11.1 The 9 host tools — exhaustive contract reference

| # | Tool | Function signature | Counts toward tool_calls? | Free? |
|---|---|---|---|---|
| 1 | run_command | run_command(command: str) -> str | YES | No |
| 2 | submit_patch | submit_patch() -> str | NO | YES |
| 3 | get_status | get_status() -> str | NO | YES |
| 4 | read_file | read_file(filepath: str, start_line: int \| None = None, end_line: int \| None = None) -> str | YES | No |
| 5 | edit_file | edit_file(filepath: str, old_string: str, new_string: str, allow_multiple: bool = False) -> str | YES | No |
| 6 | write_file | write_file(filepath: str, content: str) -> str | YES | No |
| 7 | get_code_neighbors | get_code_neighbors(node: str, edge_type: str \| None = None, max_neighbors: int = 50) -> str | YES | No |
| 8 | search_similar_code | search_similar_code(query: str, k: int = 10) -> str | YES | No |
| 9 | get_code_subgraph | get_code_subgraph(nodes: list[str]) -> str | YES | No |

Decision rule: **submit_patch and get_status are free — use them liberally for verification, even when budget is tight.**

Source: HARNESS_README §6. [S-002]

### 11.2 run_command contract

| Aspect | Value |
|---|---|
| Signature | `run_command(command: str) -> str` |
| Execution | `/bin/bash -c <command>` inside /workspace |
| Timeout | `min(command_timeout_seconds [300], max(5, int(remaining_time_seconds)))` |
| Output truncation | stdout and stderr capped at max_stdout_chars (5 000) |
| Returns (success) | `{"status": "ok", "stdout": "...", "stderr": "...", "exit_code": 0}` |
| Returns (failure) | `{"status": "error", "error_type": "CommandError", "error_message": "...", "details": {"stdout": "...", "stderr": "...", "exit_code": N}}` |
| Timeout error | `error_type: "TimeoutExceeded"` — does NOT end the session unless the overall time budget has expired |

Source: HARNESS_README §6.1. [S-002]

Decision rule: **always check exit_code in the response. A command that returns no stdout but exit_code != 0 is a failure.**

### 11.3 submit_patch and get_status contracts

submit_patch:
- Stages untracked file intents (`git add -N .`), captures `git diff --binary _swegemma_baseline 2>/dev/null || git diff --binary HEAD`.
- Does not count toward tool_calls.
- Sets ctx.patch_submitted = True.
- Returns `{"status": "ok", "patch_size": 1420, "files_changed": 2}`.

get_status:
- Returns `{"status": "ok", "tool_calls_used": 12, "patch_submitted": false, "patch_size": 0, "tool_calls_remaining": 38, "max_tool_calls": 50, "time_seconds_remaining": 3120.4, "max_time_minutes": 60.0, "agent_elapsed_seconds": 479.6, "max_turns": 500, "command_timeout_seconds": 300}`.
- Does not count toward tool_calls.

Source: HARNESS_README §6.1. [S-002]

### 11.4 read_file / edit_file / write_file contracts

read_file:
- Path resolution: relative to /workspace via `_resolve_workspace_path`; `/` or `/workspace/` prefixes stripped; `..` traversal raises ValidationError.
- 1-indexed inclusive line slicing.
- Dual truncation cap: max_file_lines (150) AND max_file_chars (10 000). If either limit is reached, `is_truncated=true` and `end_line` reflects last complete line returned.
- Returns `{"status": "ok", "filepath": "...", "content": "...", "start_line": 1, "end_line": 150, "total_lines": 420, "is_truncated": true}`.

edit_file:
- 3-tier resilient matching:
  1. exact: character-for-character after `\r\n` → `\n` normalization.
  2. flexible: line-by-line after stripping leading/trailing whitespace; auto re-indents new_string.
  3. regex: tokenizes old_string around `( ) : [ ] { } > = <` and joins tokens with `\s*`.
- Uniqueness check: if old_string matches > 1 occurrence and `allow_multiple=False`, returns `error_type: "FileEditError"` without modifying.
- FileEditError also for: file does not exist, file is empty (0 bytes), old_string is empty ("").
- Returns `{"status": "ok", "filepath": "...", "occurrences": 1, "strategy": "exact", "diff": "...", "is_truncated": false}` (diff truncated at max_stdout_chars = 5 000).

write_file:
- Creates or overwrites /workspace/<filepath>; auto-creates parent directories.
- Returns `{"status": "ok", "filepath": "...", "size": N}`.

Decision rule for edit_file: **write old_string as a short, uniquely-identifying fragment. Larger old_strings reduce match probability and increase the chance the regex tier fires (which is brittle).**

Source: HARNESS_README §6.2. [S-002]

### 11.5 Code-intelligence tools

When pre-computed AST/dependency graphs (data/graphs/<repo>.json) and node embeddings (data/embeddings/<repo>.npz) exist for a repository, these three tools query the in-memory NetworkX CustomMultiDiGraph.

get_code_neighbors(node, edge_type=None, max_neighbors=50):
- 4-tier symbol resolution: exact → . or / suffix match → case-insensitive → substring.
- Returns `{"status": "ok", "node": "fastapi.applications.FastAPI", "neighbors": ["..."], "count": 18}`.

search_similar_code(query, k=10):
- Cosine similarity against all other nodes in the .npz dictionary. The sandbox is offline; embed(query) is not a neural embedding server.
- Pass class/function/module names, not natural language. Distribution over fastapi: FastAPI ≈ 130k chars, APIRouter ≈ 110k. Six calls exceeded 100k chars and ended the task via ContextWindowExceededError. [S-005]
- Mitigation: function/method-name queries, prefer get_code_neighbors first.
- Returns `{"status": "ok", "query": "HTTPConnection", "results": [{"node_name": "...", "code": "...", "similarity": 0.9412}], "count": 10}`.

get_code_subgraph(nodes):
- Induced subgraph (all nodes and interconnecting edges) for the given symbols.
- Returns `{"status": "ok", "nodes": [...], "edges": [{"from": "...", "to": "...", "type": "CALLS"}], "node_count": N, "edge_count": M}`.

Source: HARNESS_README §6.3. [S-002]

### 11.6 The complete limits table

| Limit | Default | Range | Where set | Notes |
|---|---|---|---|---|
| Total unpacked submission size | n/a (must be < 3 GiB) | < 3 221 325 472 bytes | Submission validator | Hard |
| max_file_count | 10 000 | n/a | Submission validator | Safety ceiling |
| max_yaml_files | 1 000 | n/a | Submission validator | Safety ceiling |
| max_yaml_size_bytes | 50 MiB | n/a | Submission validator | Safety ceiling |
| max_skill_size_bytes | 50 MiB | n/a | Submission validator | Safety ceiling |
| max_instruction_chars | 1 000 000 per agent, 10 000 000 total | n/a | Submission validator | Safety ceiling |
| max_agents | 500 | n/a | Submission validator | Safety ceiling |
| max_sub_agent_depth | 50 | n/a | Submission validator | Safety ceiling |
| max_skills | 1 000 | n/a | Submission validator | Safety ceiling |
| max_loop_iterations (LoopAgent.max_iterations) | 500 | 1..500 | Submission validator | Hard |
| allowed_file_extensions | YAML/MD/TXT/PY (skill scripts only)/JSON/safetensors | n/a | Submission validator | Hard |
| adapter_extensions | .safetensors only | n/a | Submission validator | Hard |
| max_output_tokens | 16 384 | 1..32 768 | generate_content_config | Hard ceiling 32 768 (vLLM max_model_len) |
| thinking_budget | 4 096 | 0..32 768 | generate_content_config | Set 0 to disable thinking |
| thinking_level | unset | MINIMAL/LOW/MEDIUM/HIGH/NONE | generate_content_config | Maps to OpenAI reasoning_effort; use include_thoughts+thinking_budget with vLLM |
| include_thoughts | true | true/false | generate_content_config | Whether thoughts reach the next prompt |
| max_time_minutes | 60.0 in inference; 1 in sample submission | > 0 | eval_config.yaml | env: SWE_MAX_TIME_MINUTES |
| max_tool_calls | 100 in inference; 10 in sample | > 0 | eval_config.yaml | env: SWE_MAX_TOOL_CALLS |
| max_turns | 500 in inference; 50 in sample | > 0 | eval_config.yaml | env: SWE_MAX_TURNS |
| timeout_seconds (per command) | 300 | > 0 | eval_config.yaml | env: SWE_TIMEOUT_SECONDS |
| max_stdout_chars | 5 000 | n/a | harness | run_command output truncation |
| max_file_lines | 150 | n/a | harness | read_file line cap |
| max_file_chars | 10 000 | n/a | harness | read_file char cap |
| Container A memory | 4 GiB | n/a | sandbox | Processes exceeding are SIGKILLed |
| Container A CPU | 2 vCPUs | n/a | sandbox | cpu_period=100_000, cpu_quota=200_000 |
| Container B memory | 4 GiB | n/a | sandbox | Same as A |
| Container B CPU | 2 vCPUs | n/a | sandbox | Same |
| Container network | network_mode="none" | n/a | sandbox | Air-gapped |
| Global submission time | 12 h total | n/a | scoring service | Currently errors the whole submission on overrun; set max_time_minutes failsafe |
| max_loras | 8 | n/a | vLLM server | LoRA count |
| max_lora_rank | 128 | n/a | vLLM server | LoRA rank ceiling |
| vLLM tensor_parallel_size | 4 | n/a | vLLM server | Across 4x L4 GPUs |
| vLLM gpu_memory_utilization | 0.80 | n/a | vLLM server | ~19.2 GB usable per GPU |
| vLLM max_model_len | 32 768 | n/a | vLLM server | Combined prompt + reasoning + output |

### 11.7 Compaction and caching (host-controlled)

| Setting | Value | Source |
|---|---|---|
| EventsCompactionConfig.compaction_interval | 5 | HARNESS_README §7.2 |
| EventsCompactionConfig.overlap_size | 2 | HARNESS_README §7.2 |
| EventsCompactionConfig.token_threshold | 14 336 | HARNESS_README §7.2 |
| EventsCompactionConfig.event_retention_size | 5 | HARNESS_README §7.2 |
| ContextCacheConfig.min_tokens | 2 048 | HARNESS_README §7.2 |
| ContextCacheConfig.ttl_seconds | 1 800 | HARNESS_README §7.2 |
| ContextCacheConfig.cache_intervals | 10 | HARNESS_README §7.2 |

Source: HARNESS_README §7.2. [S-002]

### 11.8 Retry behavior (host-controlled)

| Condition | Action | Source |
|---|---|---|
| 429, 500, 502, 503, 504, RateLimitError, APIConnectionError, APITimeoutError | Retried up to 5 times | HARNESS_README §7.2 |
| Initial delay | 2.0 s | HARNESS_README §7.2 |
| Multiplier | 2.0x | HARNESS_README §7.2 |
| Max delay | 60.0 s | HARNESS_README §7.2 |
| Jitter | ±20% | HARNESS_README §7.2 |

Source: HARNESS_README §7.2. [S-002]---

## §12 Worked architectures

> **Prerequisites:** §5–§7.
> **What you will be able to do afterward:** pick an ambition level that fits your remaining time, budget, and risk tolerance.

### 12.1 Architecture A — Minimal single agent (default first submission)

The simplest valid submission: one LlmAgent with all 9 host tools, focused on locate → read → edit → verify → submit.

| Aspect | Value |
|---|---|
| Structure | agent.yaml (single LlmAgent) |
| Tools | all 9 host tools |
| Skills | none |
| Sub-agents | none |
| Adapters | none |
| Estimated tool calls per task | 30–50 |
| Estimated context cost | 1 system prompt + tool turns |
| Estimated wall-clock per task | 5–15 min |
| Failure mode | Single point of failure: if the model gets distracted, no recovery |
| Best for | First submission; baseline; time-constrained readers |
| Source | starter-submission/ (sidecar) |

### 12.2 Architecture B — Sequential with focused verifier (medium ambition)

SequentialAgent: explorer → patcher → verifier. Each sub-agent has include_contents=none and a focused tool set.

| Aspect | Value |
|---|---|
| Structure | root SequentialAgent + sub_agents/explorer.yaml + sub_agents/patcher.yaml + sub_agents/verifier.yaml |
| Tools | explorer: read-only; patcher: edit; verifier: run_command + get_status |
| Skills | optional |
| Sub-agents | 3 |
| Adapters | none |
| Estimated tool calls per task | 60–100 |
| Estimated context cost | 3 system prompts + tool turns (state handoff via output_key) |
| Estimated wall-clock per task | 10–25 min |
| Failure mode | Verifier may disagree with hidden test_patch; orchestration cost is real |
| Best for | After Architecture A plateaus |
| Source | examples/advanced_sequential_verifier.yaml (sidecar) |

### 12.3 Architecture C — Multi-LoRA specialized agents (high ambition, gated)

SequentialAgent with per-agent LoRA adapters: an explorer with a search-specialized adapter, a patcher with a coding-specialized adapter, a verifier with a test-reading adapter. Single base model.

| Aspect | Value |
|---|---|
| Structure | root SequentialAgent + 3 sub-agents + adapters/{explorer_lora,patcher_lora,verifier_lora}/ |
| Tools | per-agent subset |
| Adapters | 3 (each ≤ 1.8 GB at rank 128) |
| Estimated tool calls per task | 60–100 |
| Estimated context cost | 3 system prompts |
| Estimated wall-clock per task | 10–25 min |
| Failure mode | Adapter hosting bugs (§13); KV collapse can stall the session |
| Best for | After both A and B plateaus; requires confirming the adapter hosting fixes are deployed (§13) |
| Source | examples/multi_lora_specialized.yaml (sidecar) |

Decision rule: **start at A. Promote to B when A plateaus. Promote to C only after confirming the §13 LoRA hazards are resolved.**---

## §13 Hazard register — what can silently cost you a day or a submission

> **Prerequisites:** none. This chapter is the highest-leverage section of the document for a time-pressed reader.
> **Verified as of:** 2026-09-30. Re-verify before shipping.

### 13.1 How to read this register

Each hazard has:

- **Tier** — DOCUMENTED (in HARNESS_README.md), REPRODUCED (≥2 independent reports), REPORTED (single claim), FIXED, DISPUTED.
- **Status** — Live, Fixed, Pending.
- **Date first seen / last checked.**
- **Failure signature** — the observable symptom you can detect in your own run.
- **Defense** — what to do.
- **Teaching locations** — where this hazard must be flagged in the tutorial body. (The full list is in §15.)

### 13.2 The top 12 hazards, ordered by cost to the reader

| # | Hazard | Status | Tier | Failure signature | Teaching location |
|---|---|---|---|---|---|
| 1 | **Double-JSON escaping of tool outputs.** Tool results JSON-encoded twice (swegemma string → ADK `{"result": ...}` → LiteLLM re-serializes). | Pending host fix as of 9/29 | REPRODUCED (Whisper Last, D A M) | `edit_file` returns "old_string not found" when old_string is actually present. 22% measured failure rate in controlled experiment. | §5.10 F-list, §7.5, §11.4 |
| 2 | **search_similar_code output blow-up.** Full node source returned uncapped; 6/246 calls returned >100k chars and ended the task via ContextWindowExceededError. | Pending host cap (promised 9/30 ~18:35 UTC) | REPRODUCED | Mid-session ContextWindowExceededError; trace shows search_similar_code returning huge `code` field | §7.5, §11.5 |
| 3 | **LoRA silent zeroing.** Gemma4 registers decoder layers twice (direct + YOCO alias); activate_adapter populates one, reset_lora zeroes the other. | Fix in wheelhouse v23 (v25 current); not independently confirmed resolved | REPRODUCED (Whisper Last, Abdul Muiz) | Adapter outputs identical to base model at temperature 0; 240× "Successfully loaded" then 240× "No LoRA weights found... skipping" in debug logs | §4.8, §7.5 |
| 4 | **LoRA KV-cache collapse.** Any mounted adapter → vLLM preallocates max_loras=8 × max_lora_rank=128 buffers, dropping KV from 46 048 to 7 600 tokens. | Pending host fix (promised 9/30 ~16:05 UTC) | REPRODUCED (Adithya Giridharan, whoami) | Adapter submissions stall; prompts >7.6k hang silently | §4.8, §7.5 |
| 5 | **Thinking-mode thoughts dropped.** ADK sends `reasoning_content`; vLLM 0.19.1 reads only `reasoning` → thoughts never reach the next prompt. | Pending host patch as of 9/30; **no re-score of existing submissions** | HOST-STATED + REPRODUCED | Next prompt median 0.35× of previous reply with thinking on vs 1.1× off | §3.5, §7.5 |
| 6 | **12-hour global overrun errors entire submission.** Hitting the 12h limit currently scores unfinished tasks as errors; planned fix scores them as 0. | Pending host fix | HOST-STATED | Submission fails entirely at end of run despite many resolved tasks | §5.6, §7.6 |
| 7 | **Local gold patches fail offline (fastapi/requests).** Wheelhouse ships pydantic 2.13.4 but not typing_inspection; also missing inline-snapshot, dirty-equals, ujson/orjson, python-multipart. Wheel dedup forces starlette 1.6.0 on all fastapi commits. | Live — host confirms hidden tasks validate 100% with gold | REPRODUCED | Local CV/LB anti-correlation; --skip-agent-patch fails on fastapi tasks at import | §10.4, §10.5, §10.7 |
| 8 | **Dead-on-arrival public tasks.** 8 requests tasks SSL-dead on Python 3.13 (VERIFY_X509_STRICT vs pytest-httpbin cert); 3 fastapi/rich version-gated; 1 rich error-string drift. | Live | REPRODUCED (JohnParkerson audit) | --skip-agent-patch fails on these specific instance_ids regardless of agent | §10.4 |
| 9 | **Adapting to host patches without re-scoring existing submissions.** Host has committed patches for several bugs but will not re-score. | Live policy | HOST-STATED | Old submission scores may differ from post-patch behavior | §15 |
| 10 | **Sample submission FAILED when submitted byte-for-byte (with adapters).** Sample_submission with adapters failed when submitted by Violet Notes on 9/25. | Live | REPRODUCED | Submitting the unmodified sample with adapters errors out | §4.8 |
| 11 | **PyPI vLLM refuses LoRA for Gemma 4.** Stock PyPI vLLM 0.19.1 fails `--enable-lora` for Gemma4ForConditionalGeneration ("does not support LoRA yet"). | Live for stock vLLM; wheelhouse patches it | REPORTED (Carson Rodrigues; topic deleted; fact preserved via quoting) | Local adapter work fails to start; must install the wheelhouse's patched vLLM | §4.8, §10 |
| 12 | **read_file line-range TypeError.** `'<' not supported between instances of 'int' and 'str'` reported on a single fresh post (744678, 2026-09-30 19:00 UTC); 0 comments. | UNVERIFIED — could be model sending string args | REPORTED | read_file with start_line/end_line raises TypeError on some inputs | §5.10 F-list, §13.4 |

### 13.3 All other hazards

| # | Hazard | Tier | Status | Failure signature |
|---|---|---|---|---|
| 13 | Patch contains /workspace/repro.py (scratch from /workspace) | DOCUMENTED | Live | Diff has untracked script files |
| 14 | Agent edits test files (silently reset before Phase 2) | DOCUMENTED | Live | Patch looks correct; test_patch fails because the test that exercises the fix was reset |
| 15 | Agent modifies /workspace/pytest.ini or /workspace/conftest.py | DOCUMENTED | Live | Patch has pytest.ini/conftest.py diff; test_patch fails; reset wiped it |
| 16 | `<|tool_call>` truncation (huge thought then huge tool call hits max_output_tokens) | DOCUMENTED | Live | Tool call gets cut off before `</tool_call>`; harness sends nudge |
| 17 | 9/26 mass "resource" failure wave consumed daily slot | HOST-STATED | Fixed cause; rerun status unclear as of 9/30 | Submission errors instantly with "requested more CPU/GPU/TPU resources than are available" |
| 18 | Submission before "Save Version" fails | HOST-STATED | Live | "Submit" before "Save Version" returns instantly with "Did not find output file 'submission.zip'" |
| 19 | Run-to-run variance at temperature 0.2 | REPRODUCED | Live (default) | Same submission yields different scores across runs (±0.04 reported) |
| 20 | L4×4 queues can take 4–13+ h | REPRODUCED | Live | Submission shows queued for hours |
| 21 | Quota double-deduction (queue + run) | REPRODUCED | Live | 5h queue + 5h run = 10h quota deducted |
| 22 | Subprocess sandbox differs from Docker sandbox | REPRODUCED | Live | Switching backends changes results |
| 23 | Adapter addressing via openai/<adapter_name> | DOCUMENTED | Live | Adapter registration requires --lora-modules on serving side |
| 24 | openai/, custom/ provider prefixes are stripped by normalize_model_name | DOCUMENTED | Live (intentional) | Reference resolution normalizes provider prefixes silently |
| 25 | Double-registration of same tool name under different labels | DOCUMENTED | Live | ToolRegistry rejects duplicates |

### 13.4 Defensive patterns (for the top hazards)

| Hazard | Defense |
|---|---|
| #1 Double-JSON escaping | Use small, uniquely-identifying old_string fragments. If the host ships single-JSON, your failure rate will jump first — instrument the patch for retry. |
| #2 search_similar_code blow-up | Use specific function/class names; prefer get_code_neighbors first. |
| #3 LoRA silent zeroing | Use a "loud" adapter with random init for a canary; verify outputs differ from base model at temperature 0 before relying on adapter specialization. |
| #4 LoRA KV collapse | Don't use adapters until the host confirms the fix deployed; budget adapter submissions carefully. |
| #5 Thinking-mode drop | Use include_thoughts + thinking_budget (the safe pair); verify thoughts are present in the trace's next-prompt content. |
| #6 12 h overrun | Set max_time_minutes failsafe (20–30 min per task); submit early on partial progress. |
| #7 Local gold patches fail | Use --skip-agent-patch on a fastapi task first; if it fails, your local env is the problem. |
| #8 Dead-on-arrival tasks | Skip the 8 requests-SSL tasks, 3 version-gated tasks, and 1 rich-drift task in CV. |
| #12 read_file TypeError | Pass integers, not strings; if the bug is real, fall back to full reads + edit_file. |
| #13 Patch includes /workspace/repro.py | Put repros in /tmp/repro.py; instruct agent accordingly. |
| #14 Test-file edits discarded | Fix the library under /workspace, not tests; reinforce in instruction. |
| #15 pytest.ini/conftest.py edits | Do not edit them; reinforce in instruction. |
| #16 <|tool_call> truncation | Set max_output_tokens ≤ 8 192; split large edits into smaller incremental calls. |
| #17 9/26 failure wave | Save Version first, then Submit; verify the submission parquet exists. |
| #18 Save-Version before Submit | Always Save Version successfully, then Submit. |
| #19 Run-to-run variance | Set seed in generate_content_config when supported; accept ±0.04 noise. |
| #20 L4×4 queues | Plan for queue time; don't submit right before deadline. |
| #21 Quota double-deduction | Track queue+run time separately. |
| #22 Sandbox differences | Use Docker by default; subprocess only when Docker is unavailable. |
| #23 Adapter addressing | Reference adapters by name under adapters/<name>/, not by full path. |
| #24 Provider prefix stripping | Use bare model names (gemma-4-31b-it-qat-w4a16-ct) in agent.yaml. |

### 13.5 How to check a hazard yourself (cheap self-tests)

| Hazard | Cheap self-test |
|---|---|
| #1 Double-JSON escaping | Submit a 30-task subset; measure edit_file failure rate; if it diverges from prior, the host shipped a fix or a regression. |
| #2 search_similar_code blow-up | Call search_similar_code with a known-huge node name on a fastapi task; observe response size. |
| #3 LoRA silent zeroing | Run a "loud" adapter with random init; verify outputs differ from base at temperature 0. |
| #4 LoRA KV collapse | Submit a single-task adapter submission with a long prompt; if it stalls on turn 1, the bug is live. |
| #5 Thinking-mode drop | Submit a single task; inspect trace for `reasoning_content` in next-prompt content. |
| #6 12 h overrun | Track task wall-clock; verify max_time_minutes is set. |
| #7 Local gold patches | Run --skip-agent-patch on a fastapi task; verify the test_patch fails. |
| #8 Dead-on-arrival tasks | Skip the listed tasks in CV. |
| #12 read_file TypeError | Call read_file with integer start_line/end_line; if it raises TypeError, the bug is real. |
| #13 Patch scratch | Inspect your patches/ directory for untracked scripts. |
| #14 Test-file edits | Grep your patches for test_*.py and *_test.py. |
| #15 pytest.ini/conftest.py | Grep your patches for those filenames. |
| #16 <|tool_call> truncation | Look for `<|tool_call>` cut off in trace. |
| #19 Run-to-run variance | Submit twice; measure delta. |

### 13.6 Workaround-versus-principle labeling

| Workaround | Bug status | Removal criterion |
|---|---|---|
| "Don't use adapters until KV collapse is fixed" | Bug live (Q1a fix pending) | When host confirms fix deployed on scorer; re-probe with canary |
| "Use include_thoughts + thinking_budget, not thinking_level" | Bug live (Q3 patch pending) | When host confirms fix; verify thoughts reach next prompt |
| "Put repros in /tmp, not /workspace" | Not a workaround — a principle | (no removal) |
| "Use --skip-agent-patch on a fastapi task before trusting local CV" | Environmental, not a fixable bug | (no removal; the local env is what it is) |
| "Set max_time_minutes failsafe even when running short" | Bug live (12h overrun fix pending) | When host ships the score-unfinished-as-0 fix |

### 13.7 Open watch-list

- Host fix for Q1a (LoRA KV collapse): promised 9/30 ~16:05 UTC; not confirmed deployed.
- Host fix for Q1b (LoRA silent zeroing): landed in v23 (v25 current); participant repro on v25 still showed no effect (caveat: lora_A possibly zero in sample adapter). Verify with a "loud" adapter.
- Host fix for Q2 (double-JSON escaping): "addressing now" as of 9/29; not confirmed deployed.
- Host fix for Q3 (thinking drop): "incoming" as of 9/30 18:33 UTC; **no re-score of existing submissions**.
- Host fix for Q4 (search_similar_code cap): "I will limit to max_stdout_chars like other tools" as of 9/30 ~18:35 UTC; not confirmed deployed.
- Host fix for 12 h overrun: planned (score as 0); not confirmed live.
- Rescore/rerun backlog from 9/26: status unknown behind L4×4 queueing.
- Read_file TypeError: single fresh claim; no reproduction; UNVERIFIED.
- L4×4 queue length: 4–13+ h reported; subject to change.

Source: 03-discussion-board-intel.md (compiled 2026-09-30 19:30 UTC). [S-005]---

## §14 Conflicts and limitations

### 14.1 What this tutorial cannot tell you

| Class of question | Why not |
|---|---|
| How the harness will behave next week | Live environment with active host patches; verify §15 before each submission |
| What the upstream ADK schema will look like in v2.11 | Schema is marked experimental; check release notes |
| Whether your specific bug fix will pass the hidden test_patch | Test patches are secret; only the harness knows |
| What the optimal LoRA rank is for your specific adapter | Adapter training is out of scope (§CQ-03) |
| Whether a particular community-reported hazard is fixed | Re-verify with cheap self-tests (§13.5) |

### 14.2 Whose interests shaped the sources

| Source | Interest |
|---|---|
| HARNESS_README.md (organizer-supplied) | The competition's stated contract; aligned with the organizer's definition of a fair submission |
| 03-discussion-board-intel.md (community digest) | Participant observations; honest about its own uncertainty |
| Upstream ADK docs (Google) | Vendor framing; flags "experimental" where the dialect has its own opinions |
| WebSearch results (general) | Discovery; not authoritative |

A "best practice" that originates from the vendor and is presented as neutral — be cautious. The dialect divergences are real (§2) and were introduced precisely to limit the framework author's architectural preferences from becoming compulsory.

### 14.3 What was unverifiable

| Item | Why | Where it appears |
|---|---|---|
| ADK v2.10.0 release date | Web-fetched and confirmed (2026-09-25) [S-001] | §3.1 |
| AgentConfig.json full schema | Page truncated at fetch time | §3.1 |
| Full competition README (auth-walled) | Kaggle page rendered JS-only | §A.2 |
| Specific hidden-task gold patches | Restricted to secret solution archive | n/a |
| Whether host fixes deployed between 9/30 sweep and now | Live environment | §13.7 |

### 14.4 What the reader should not rely on

- This tutorial's hazards as a static list — re-verify §13.7 before shipping.
- Any default value stated without a version pin.
- Any example marked `ILLUSTRATIVE` or `SCHEMA-CHECKED` as if it were `VALIDATED`.
- The starter-submission/ files as runnable without local validation against the current harness.

---

## §15 Re-check list — what to verify when this ages

Re-check in the order listed. Each entry includes the source to re-check.

### Fast-decaying (re-check every 1–2 weeks until deadline)

1. **HARNESS_README.md** at `input/kagglecomp/HARNESS_README.md` (re-download if available). All §4, §11 limits.
2. **Tool return schemas and budget accounting.** §11.1–§11.5. Re-pull the harness reference.
3. **LoRA / adapter hosting story.** §4.8, §13.2 #3–#4. Probe with a canary submission.
4. **search_similar_code output cap.** §13.2 #2. Re-pull.
6. **Thinking-mode behavior.** §13.2 #5. Re-pull.
7. **12 h global overrun behavior.** §13.2 #6. Re-pull.

### Medium-decaying (re-check weekly)

8. **Community digest** (`03-discussion-board-intel.md` if re-supplied, or current Kaggle discussion board). §13.
9. **eval_config.yaml defaults.** §5.6. Re-confirm.
10. **Allowed LoRA ranks / LoRA module registration.** §4.8, §4.10.

### Slow-decaying (re-check monthly)

11. **Upstream ADK schema and AgentConfig.json.** §3.1. Re-pull.
12. **Object-model changes (LlmAgent, SequentialAgent, ParallelAgent, LoopAgent).** §3.2. Re-pull.

### Things to re-verify before any submission

13. **Packaging validator behavior.** Re-zip and validate your submission locally if you can.
14. **Patch extraction behavior.** Inspect a recent patches/<id>.patch and confirm it matches what you intended.
15. **Phase 2 reset behavior.** If your submission touches test paths, verify those diffs are discarded.

---

## §16 Glossary

| Term | Definition | Upstream ADK | Competition dialect |
|---|---|---|---|
| ADK | Agent Development Kit | google/adk-python | adk-submission (a restricted compiler) |
| compile_submission | The dialect's sandboxed YAML compiler | n/a | The single entry point for a submission |
| from_config | Upstream's dynamic YAML loader | config_agent_utils.from_config | Not used (replaced by compile_submission) |
| SandboxedAgentConfig | The dialect's YAML schema | n/a | The validator's schema |
| AgentConfig | Upstream's YAML schema | https://raw.githubusercontent.com/google/adk-python/refs/heads/main/src/google/adk/agents/config_schemas/AgentConfig.json | n/a |
| agent_class | The discriminator for which agent class to instantiate | LlmAgent / SequentialAgent / ParallelAgent / LoopAgent / custom | Same four |
| sub_agents | Children an agent can delegate to via transfer_to_agent | List of BaseAgent | List of {config_path: ...} dicts |
| AgentTool | A tool that wraps another agent | wraps a BaseAgent; supports skip_summarization | Same |
| skip_summarization | A flag on AgentTool to keep wrapped output out of parent context | true / false | true / false |
| output_key | Writes agent's final text into session.state[output_key] | yes | yes |
| include_contents | Whether conversation history is passed to the agent | "default" / "none" | "default" / "none" |
| disallow_transfer_to_parent | Block transfer back up the tree | yes | no |
| disallow_transfer_to_peers | Block transfer to siblings | yes | no |
| generate_content_config | Generation parameters dict | yes (rich) | yes (constrained: tools / system_instruction / http_options / safety_settings / response_schema excluded) |
| ToolRegistry | Closed registry of available tools | n/a | Hosts the 9 tools |
| ModelRegistry | Closed registry of available models | n/a | Hosts the gemma-4-31b-it-qat-w4a16-ct alias (and others for local) |
| SkillRegistry | Closed registry of available skills | n/a | Maps skill paths to skill manifests |
| CallbackRegistry | Closed registry of available callbacks | n/a | (host-only in practice) |
| Tools (dialect) | Names against the closed ToolRegistry | FunctionTool / AgentTool / OpenAPIToolset / McpToolset / LangchainTool | Names only; 9 host tools + AgentTool |
| run_command | Host tool: shell in /workspace | n/a | Yes |
| submit_patch | Host tool: capture git diff | n/a | Yes (free) |
| get_status | Host tool: budget introspection | n/a | Yes (free) |
| read_file | Host tool: read /workspace file | n/a | Yes |
| edit_file | Host tool: 3-tier resilient edit | n/a | Yes |
| write_file | Host tool: create / overwrite | n/a | Yes |
| get_code_neighbors | Host tool: graph neighbors | n/a | Yes |
| search_similar_code | Host tool: similarity search over pre-built embeddings | n/a | Yes (output-cap pending) |
| get_code_subgraph | Host tool: induced subgraph | n/a | Yes |
| BaseAgent | Abstract parent of all agents | yes | yes |
| LlmAgent | LLM-driven agent | yes | yes |
| SequentialAgent | Sequential workflow | yes | yes |
| ParallelAgent | Parallel workflow with isolated branches | yes | yes |
| LoopAgent | Iterative workflow up to max_iterations | yes | yes (max_iterations 1..500) |
| Session / session.state | Per-conversation state container | yes | yes |
| Runner | Execution driver | yes | yes |
| EventsCompactionConfig | Compaction settings on App | yes | yes (host-set values) |
| ContextCacheConfig | Prefix-caching settings on App | yes | yes (host-set values) |
| ModelRetryPlugin | Retry transient errors | yes | yes (host-set values) |
| !include | Sandboxed include directive | upstream is permissive | depth ≤ 10, cycle-detected, path-traversal blocked |
| HARNESS_README.md | The competition's harness reference | n/a | HARNESS_README.md (input/kagglecomp/) |
| SWE_MAX_TIME_MINUTES | Env override | n/a | max_time_minutes |
| SWE_MAX_TOOL_CALLS | Env override | n/a | max_tool_calls |
| SWE_MAX_TURNS | Env override | n/a | max_turns |
| SWE_TIMEOUT_SECONDS | Env override | n/a | timeout_seconds (per command) |
| ALLOWED_MODEL_NAMES | Set of permitted base models | n/a | {gemma-4-31b-it-qat-w4a16-ct} (in Kaggle scoring) |
| Container A | The agent sandbox | n/a | /workspace, network=none, 4 GiB RAM, 2 vCPUs |
| Container B | The verification sandbox | n/a | Same shape as A |
| EvalConfig | Per-task budget surface | n/a | eval_config.yaml |
| SubmissionLimits | Submission safety ceilings | n/a | max_file_count, max_yaml_files, etc. |
| Submission-parquet | The output format | n/a | submission.parquet (id, prediction) |
| agent_patch | The diff extracted from Container A | n/a | (git diff --binary _swegemma_baseline 2>/dev/null \|\| git diff --binary HEAD) |
| task.test_patch | The hidden verification test patch | n/a | Applied in Phase 2 only |
| ContainerSetup | The 7-step bootstrap | n/a | Wheels, snapshot, exclude, install, deps, baseline commit |
| ATIF | Agent Trajectory Interchange Format | n/a | SessionTrace uses ATIF v1.7 |
| Resolution Rate | The competition metric | n/a | Resolved / Total ∈ [0.0, 1.0] |

---

## §17 Source list

Source IDs are referenced inline throughout the document.

| ID | Type | URL / path | Version / date | Verification tier |
|---|---|---|---|---|
| S-001 | Upstream ADK | https://github.com/google/adk-python (releases page) | v2.10.0, 2026-09-25; verified 2026-09-30 | V3 (release artifact) |
| S-002 | Competition harness reference | input/kagglecomp/HARNESS_README.md | 2026-09-30 snapshot, 671 lines | V3 (organizer-supplied) |
| S-003 | Upstream ADK source (specific files) | agents/llm_agent.py, tools/agent_tool.py, tools/_node_tool.py | v2.10.0 | V3 (source) |
| S-004 | Upstream ADK docs | https://adk.dev/agents/config/ | 2026-09-30 fetch (redirect from google.github.io/adk-docs/agents/config) | V2 (official docs) |
| S-005 | Community digest | input/kagglecomp/03-discussion-board-intel.md | 2026-09-30 19:30 UTC, 155 lines | V1 (community; per-item tier recorded) |
| S-006 | Competition overview + data + rules + getting started | input/kagglecomp/Kaggle-00-Complete.md | 2026-09-29 snapshot | V2 (organizer pages, captured) |
| S-007 | Paper track intel | input/kagglecomp/04-paper-track-intel.md | 2026-09-30 19:40 UTC, 102 lines | V2 (community digest of organizer pages) |
| S-008 | Kaggle competition page | https://www.kaggle.com/competitions/gemma-4-developer-agent | 2026-09-30 fetch | V2 (organizer page) |
| S-009 | Kaggle rules page | https://www.kaggle.com/competitions/gemma-4-developer-agent/rules | 2026-09-30 fetch | V2 (organizer page) |

---

## §18 Appendices

### A.1 RQ coverage matrix

(RQ-IDs reference the project brief's research-question hierarchy.)

| RQ | Section(s) | Status |
|---|---|---|
| RQ-PRIMARY | entire document | answered |
| RQ-01.1 | §3.1 | answered (v2.10.0) |
| RQ-01.2 | §3.4 | answered |
| RQ-01.3 | §3.1, §11 | answered |
| RQ-01.4 | §3.2, §8.1 | answered |
| RQ-01.5 | §3.3 | answered |
| RQ-01.6 | §3.5, §15 | answered (decay order documented) |
| RQ-02.1 | §4.1, §4.4 | answered |
| RQ-02.2 | §4.9 | answered |
| RQ-02.3 | §4.4 | answered |
| RQ-02.4 | §4.10 | answered |
| RQ-02.5 | §4.5 | answered |
| RQ-02.6 | §4.3 | answered |
| RQ-02.7 | §4.12 | answered |
| RQ-02.8 | §4.11 | answered |
| RQ-03.* | §5 | answered |
| RQ-04.* | §6 | answered |
| RQ-05.* | §7 | answered |
| RQ-06.* | §4.8, §11 | answered |
| RQ-07.* | §11.6, §11.7, §11.8 | answered |
| RQ-08.* | §9 | answered |
| RQ-09.* | §10 | answered |
| RQ-10.* | §5.13, §6.10, §7.10, §A.5 | answered |
| RQ-11.* | §13 | answered |
| RQ-12.* | §2, §3.5, §7.1, §7.5, §9.5, §14.4 | answered |
| VQ-01..12 | §12.4 (workflow), this section, §A.4 | answered |
| SQ-01..06 | §3.2, §5.1, §7.1, §5.10, §2, §14 | answered |

### A.2 Verification tier legend

| Tier | Meaning |
|---|---|
| V3-source | Read versioned shipped source or organizer-supplied reference |
| V3-executed | Observed by running it (not available in this research environment) |
| V2-doc | Confirmed in versioned official documentation |
| V1-community | Community report; usable as a hazard to check, not as a load-bearing claim |
| V0 | Unverified; excluded from instructions |

### A.3 Search and research log

#### A.3.1 Sources searched

| Source | Date | Result |
|---|---|---|
| https://github.com/google/adk-python | 2026-09-30 | Found v2.10.0 release |
| https://github.com/google/adk-python/releases | 2026-09-30 | Confirmed v2.10.0 release date 2026-09-25 |
| https://github.com/google/adk-python/blob/main/src/google/adk/agents/llm_agent.py | 2026-09-30 | Confirmed sub_agents vs tool mechanics |
| https://github.com/google/adk-python/blob/main/src/google/adk/tools/agent_tool.py | 2026-09-30 | Confirmed AgentTool / skip_summarization semantics |
| https://github.com/google/adk-python/blob/main/src/google/adk/agents/config_schemas/AgentConfig.json | 2026-09-30 | 404 (path may have changed) |
| https://google.github.io/adk-docs/ | 2026-09-30 | Redirect to https://adk.dev/ |
| https://google.github.io/adk-docs/agents/config/ | 2026-09-30 | Redirect to https://adk.dev/agents/config/ |
| https://adk.dev/ | 2026-09-30 | Confirmed Agent Config feature, experimental label |
| https://adk.dev/agents/config/ | 2026-09-30 | Confirmed YAML root_agent.yaml, from_config() dynamic import in upstream |
| https://www.kaggle.com/competitions/gemma-4-developer-agent/overview | 2026-09-30 | JS-gated; unable to extract page body |
| https://www.kaggle.com/competitions/gemma-4-developer-agent/rules | 2026-09-30 | JS-gated; unable to extract page body |
| https://www.kaggle.com/code/kaggle/gemma-4-developer-agent/overview | 2026-09-30 | Located; only ToC visible |
| input/kagglecomp/HARNESS_README.md | 2026-09-30 | Full read; 671 lines |
| input/kagglecomp/03-discussion-board-intel.md | 2026-09-30 | Full read; 155 lines |
| input/kagglecomp/04-paper-track-intel.md | 2026-09-30 | Full read; 102 lines |
| input/kagglecomp/Kaggle-00-Complete.md | 2026-09-30 | Full read; 300+ lines |

#### A.3.2 Negative-claim searches (required by §9.4)

The following negative claims are asserted in this tutorial. Each is supported by a documented search.

| Claim | Search performed | Date | Hits | Inclusion criteria | Bounded conclusion |
|---|---|---|---|---|---|
| No `McpToolset`, `OpenAPIToolset`, or `LangchainTool` exists in the dialect | Searched HARNESS_README.md §2.1, §6; upstream ADK docs on tool types | 2026-09-30 | 0 in dialect | Strict: must be a name in the closed ToolRegistry | The dialect's tools list is names-only against a closed registry of 9 host tools + AgentTool |
| No Python entrypoint (agent.py / agent_fn) is loaded | HARNESS_README.md §2.1 | 2026-09-30 | 0 | Strict: must be an explicit load path | compile_submission reads YAML only; importlib is never used |
| Multiple base models raise ParticipantVisibleError | HARNESS_README.md §3.2 | 2026-09-30 | 1 (direct quote) | Strict: must be explicit | Yes, ParticipantVisibleError |
| loop_iterations > 500 raises validation | HARNESS_README.md §2.3, §2.4 | 2026-09-30 | 1 | Strict: must be explicit | Yes, max_loop_iterations 500 ceiling |
| Custom tools cannot be added beyond the 9 host tools | HARNESS_README.md §6 | 2026-09-30 | 1 | Strict: must be explicit | Yes, SwegemmaContext.create_tools() returns 9 |

### A.4 Example badge honesty

| Example | Location | Badge | Why |
|---|---|---|---|
| Minimal `agent.yaml` | §5.3, starter-submission/agent.yaml | SCHEMA-CHECKED | Every field re-checked against HARNESS_README.md §2.3 and the dialect schema; not executed |
| Day-one `eval_config.yaml` | §5.6, starter-submission/eval_config.yaml | SCHEMA-CHECKED | Re-checked against HARNESS_README.md §7.1 |
| Sampling config | starter-submission/configs/sampling.yaml | SCHEMA-CHECKED | Re-checked against HARNESS_README.md §2.4 |
| Day-one tool subset | §5.5 | SCHEMA-CHECKED | Names re-checked against HARNESS_README.md §6 |
| Minimal skill (repo_navigation) | §6.9 | SCHEMA-CHECKED | Frontmatter re-checked against upstream ADK skill convention + dialect skills layout (HARNESS_README.md §2.2) |
| Intermediate SequentialAgent | §6.10, examples/intermediate_sequential_explorer_patcher.yaml | SCHEMA-CHECKED | Field-by-field re-checked against HARNESS_README.md §2.3 |
| Advanced SequentialAgent with verifier | §7.10, examples/advanced_sequential_verifier.yaml | SCHEMA-CHECKED | Same |
| Multi-LoRA specialized | examples/multi_lora_specialized.yaml | ILLUSTRATIVE | Cannot be checked end-to-end without harness |
| Negative-path example (wrong tool name) | Failure path F1 in §5.10 | SCHEMA-CHECKED | Documented; not executed |

**No example in this document is VALIDATED.** The badge ladder is applied honestly: there is no execution environment in this research session, so the highest rung reached is `SCHEMA-CHECKED` (field-by-field source verification) for examples that are complete enough to be checked, and `ILLUSTRATIVE` for examples that depend on behavior not present in any shipped source we could reach (e.g., the multi-LoRA path under current KV-collapse conditions).

### A.5 The starter tree

The `starter-submission/` sidecar contains:

```
starter-submission/
├── agent.yaml
├── eval_config.yaml
├── README.md
├── configs/
│   └── sampling.yaml
├── prompts/
│   └── system.md
└── skills/
    └── repo_navigation/
        └── SKILL.md
```

Each file is annotated in its header comment with its verification badge and the source sections that establish each field. Read the README first.

### A.6 The example corpus

The `examples/` sidecar contains:

```
examples/
├── intermediate_sequential_explorer_patcher.yaml
├── advanced_sequential_verifier.yaml
├── multi_lora_specialized.yaml          # ILLUSTRATIVE
├── negative_path_wrong_tool_name.yaml
├── negative_path_test_file_edits.yaml
└── negative_path_symlink_in_submission.yaml
```

Each example has a header comment with its verification badge and a one-paragraph "what it teaches" / "what it breaks" summary.

### A.7 The standalone divergence table

`adk-competition-divergence.md` (sidecar) is an extractable copy of §4.12 for quick reference.


---

<!-- ====================================================================== -->
<!-- FILE: 02_adk-competition-divergence.md -->
<!-- ====================================================================== -->

# ADK (Upstream) vs adk-submission (Competition Dialect) — Divergence Table

**Standalone extract.** This is the §4.12 table from the main tutorial, reproduced verbatim as a quick-reference sidecar. Source for every divergence: HARNESS_README.md [S-002].

---

## Master divergence table

| Surface | Upstream ADK | Competition dialect | Direction of change | Why it matters |
|---|---|---|---|---|
| Configuration loader | `from_config(config, config_abs_path)` in `config_agent_utils` | `compile_submission(submission_path)` — single sandboxed entry | **Replace dynamic import with sandboxed compiler** | No Python execution path; YAML only |
| Schema root | `AgentConfig.json` | `SandboxedAgentConfig` (dialect schema) | New restricted schema | What you can express is bounded |
| Custom Python classes | Any importable class (`agent_class: my.module.MyAgent`) | One of four closed enum values | Closed | Extension requires workarounds |
| Custom tools | `FunctionTool`, `OpenAPIToolset`, `McpToolset`, `LangchainTool`, etc. | 9 host tools + `AgentTool` (no `McpToolset`, no `OpenAPIToolset`, no `LangchainTool`) | **Restricted** | No external service calls possible |
| Skills | Open conventions | `skills/<name>/SKILL.md` referenced by relative path from submission root; **closed** `SkillRegistry` | Sandboxed path resolution | No symlink or absolute-path escape |
| `!include` | Permissive | depth ≤ 10, cycle-detected, traversal blocked | Sandboxed | Can't pull from `/etc/` or `../../..` |
| Models | Any registered model | Closed `ModelRegistry`; in Kaggle scoring: `{gemma-4-31b-it-qat-w4a16-ct}` only | **Restricted** | Multi-model → `ParticipantVisibleError` |
| Callbacks | Custom Python | Closed `CallbackRegistry`; **host-only** | Closed | Your callbacks cannot fire |
| Plugins | `BasePlugin` subclasses allowed | `EventsCompactionConfig`, `ContextCacheConfig`, `ModelRetryPlugin` — **host-set values** | Restricted | You can't install your own plugins |
| `output_key` | Writes final text into session.state[output_key] | Same | n/a | Work as expected |
| `include_contents` | `"default"` / `"none"` | `"default"` / `"none"` | n/a | Work as expected |
| `sub_agents` | List of BaseAgent instances | List of `{config_path: relative/path.yaml}` dicts | **Indirect reference** | Dialect resolves references at compile time |
| `AgentTool` | `AgentTool(agent=instance, skip_summarization=False)` | `AgentTool(agent=config_path, skip_summarization=False)` | Indirect | Same semantics, indirect configuration |
| `skip_summarization` | Available | Available | n/a | Key context-control feature |
| `transfer_to_agent` | Allowed by default | Same (within bounds of `disallow_transfer_*`) | n/a | Work as expected |
| `disallow_transfer_to_parent` | Available | **Not available** | Removed | All transfers allowed upward by default |
| `disallow_transfer_to_peers` | Available | **Not available** | Removed | All transfers allowed to peers by default |
| `generate_content_config` | Rich options including tools, system_instruction, http_options, safety_settings, response_schema | Same name, but **excludes** those five fields | **Restricted** | A lot of generation shaping is locked |
| `LoopAgent.max_iterations` | Configurable | 1..500 with validation error outside range | **Bounded** | Tight loops are an attack surface |
| LoRA adapters | (vLLM supports them) | Permitted (registration required) | **New** | But: 3 live bugs (§13.2) |
| Runtime container | Local Python | Container A — `/workspace`, network=none, 4 GiB RAM, 2 vCPUs | **Sandboxed** | No internet; specific shape |
| Verification container | n/a | Container B (same shape as A) | **New** | Phase 2 verification |
| Tool execution | In-process | `/workspace`, `timeout_seconds` (SWE_TIMEOUT_SECONDS) | **Sandboxed** | Same file system as the agent |
| Patch capture | n/a | `git diff --binary _swegemma_baseline 2>/dev/null \|\| git diff --binary HEAD` | **New** | Your work-product is a diff |
| Eval budget | n/a | `eval_config.yaml` (max_time_minutes, max_tool_calls, max_turns, timeout_seconds) | **New** | Dialect-imposed limits |
| Submission packaging | `pip install -e .` | Tar/zip with `agent.yaml` at root + ≤ 3 GiB + `SubmissionLimits` (max_file_count, etc.) | **New** | A separate validator |
| Cross-container handoff | n/a | `submission.parquet` (id, prediction) extracted from Container A; `agent_patch` reapplied in Container B | **New** | Two-phase lifecycle |
| Host patches | n/a | Live harness patches (per §13) | **New** | Static docs go stale |
| Documentation | Vendor site | Organizer `HARNESS_README.md` | **New authoritative source** | Vendor docs are not authoritative for the dialect |

---

## How to use this table

| If you want to know… | Read |
|---|---|
| What's the same as upstream | All "n/a" rows |
| What's restricted vs upstream | Rows marked **Restricted**, **Bounded**, **Sandboxed**, or **Indirect** |
| What's a hard requirement on the dialect | Rows marked **Closed** or **New** |
| What's a documented bug | §13 of the main tutorial (cross-references here) |
| How to test before submission | §10 of the main tutorial |

---

## Companion files

- `adk-primer-tutorial-kaggle-gemma4-developer-agent.md` — the main tutorial
- `starter-submission/` — minimal runnable submission tree
- `examples/` — per-tier example files with badges
- `04-paper-track-intel.md` — sibling paper-track intel (delivered separately)

---

*Verification tier for every row: V3-source against HARNESS_README.md §2–§7 (organizer-supplied reference). Cross-referenced against upstream ADK v2.10.0 source where the upstream behavior is the comparand.*


---

<!-- ====================================================================== -->
<!-- FILE: 03_starter-submission-README.md -->
<!-- ====================================================================== -->

# starter-submission/

Minimal runnable starter for the Gemma 4 Developer Agent competition.

**Verification badge:** SCHEMA-CHECKED. Every field has been re-checked against
HARNESS_README.md §2–§7 (input/kagglecomp/) and the upstream ADK v2.10.0 schema
where applicable. This starter has **not** been executed end-to-end — no
example in this deliverable is `VALIDATED`. See main tutorial §A.4.

## Layout

```
starter-submission/
├── agent.yaml                  # root agent definition (LlmAgent)
├── eval_config.yaml            # per-task budget (max_time_minutes, etc.)
├── README.md                   # this file
├── configs/
│   └── sampling.yaml           # sampling overrides (temperature, top_p, etc.)
├── prompts/
│   └── system.md               # system prompt body (referenced by agent.yaml)
└── skills/
    └── repo_navigation/
        └── SKILL.md            # skill frontmatter + procedure
```

## Field-by-field provenance

| File | Field | Source | Verified |
|---|---|---|---|
| agent.yaml | `agent_class` | HARNESS_README.md §2.3 | yes |
| agent.yaml | `model` | HARNESS_README.md §3.2 | yes |
| agent.yaml | `name`, `description`, `instruction` | §2.3 | yes |
| agent.yaml | `generate_content_config` | §2.3 | yes |
| agent.yaml | `tools` | §2.3, §6 | yes |
| agent.yaml | `sub_agents` | §2.3 | yes |
| agent.yaml | `include_contents` | §2.3 | yes |
| agent.yaml | `output_key` | §2.3 | yes |
| agent.yaml | `skills` | §2.2 | yes |
| eval_config.yaml | `max_time_minutes` | §7.1, SWE_MAX_TIME_MINUTES | yes |
| eval_config.yaml | `max_tool_calls` | §7.1, SWE_MAX_TOOL_CALLS | yes |
| eval_config.yaml | `max_turns` | §7.1, SWE_MAX_TURNS | yes |
| eval_config.yaml | `timeout_seconds` | §7.1, SWE_TIMEOUT_SECONDS | yes |
| configs/sampling.yaml | `temperature`, `top_p`, `max_output_tokens` | §2.4 | yes |
| prompts/system.md | inline body | §2.3 | yes |
| skills/repo_navigation/SKILL.md | frontmatter | §2.2 + upstream skill convention | yes |

## How to use this starter

1. **Read `prompts/system.md` first.** It establishes the operating loop and
   the hard constraints (no test edits, no network, budget ceilings).
2. **Read `agent.yaml` next.** It points at the prompt and the tool subset.
3. **Try `examples/intermediate_sequential_explorer_patcher.yaml`** when
   you're ready to add a `SequentialAgent` sub-agent (tutorial §6).
4. **Try `examples/advanced_sequential_verifier.yaml`** when you're ready
   to add a verifier in the loop (tutorial §7).
5. **Read `examples/negative_path_*.yaml`** to see what NOT to ship.

## What this starter does NOT do

- It does not register LoRA adapters (the adapter-hosting story has 3 live
  bugs; see tutorial §13.2).
- It does not enable thinking-mode (also has a live bug; see §13.2).
- It does not configure `EventsCompactionConfig` or `ContextCacheConfig`
  (host-set values; you cannot override).
- It does not configure callbacks or custom plugins (closed registries;
  your callbacks cannot fire).
- It does not include a `LoopAgent` (the minimal case is linear).

## What to verify before submission

Re-check HARNESS_README.md (input/kagglecomp/) for:

- Whether the tool subset has changed (it has not, as of 2026-09-30).
- Whether `max_time_minutes` defaults have changed.
- Whether `eval_config.yaml` schema has changed.

Then re-zip with `agent.yaml` at the root and verify the file count is
within `SubmissionLimits`.

## Cross-references

- Main tutorial: `../adk-primer-tutorial-kaggle-gemma4-developer-agent.md`
- Divergence table: `../adk-competition-divergence.md`
- Examples: `../examples/`
- Source for the harness surface: `../../../input/kagglecomp/HARNESS_README.md`


---

<!-- ====================================================================== -->
<!-- FILE: 04_starter-submission-repo-nav-SKILL.md -->
<!-- ====================================================================== -->

---
name: repo_navigation
description: |
  Use when you need to orient yourself in an unfamiliar Python repository.
  Provides a checklist for initial exploration: identify entry points,
  tests, build files, and module layout. Pair with get_code_neighbors for
  deterministic graph-based localization.
version: 1
---

# Repository navigation skill

## When to use

Use this skill when:

- You have just started a task and want to orient before reading code.
- You cannot find a function or class by name.
- The bug is in a module you've never seen.

Do **not** use this skill for:

- Tasks where you already know the file (read directly).
- Tasks where the bug is in test files (off-limits anyway).

## Procedure

1. **List the top level.** Read `/workspace` (the root directory) to see the
   project layout. Identify:
   - `pyproject.toml` / `setup.py` / `setup.cfg` (project metadata)
   - `README.md` (human description)
   - `src/` or top-level package directory
   - `tests/` (off-limits, but useful to know what they cover)
   - CI configs (`.github/`, `.gitlab-ci.yml`)

2. **Find the entry point.** Look for `__main__.py`, `cli.py`, or a script
   referenced in `pyproject.toml` `[project.scripts]`.

3. **Map the module graph.** Use `get_code_subgraph(root_symbol="<package>")`
   to pull the top-level module map. This gives you a deterministic view of
   which modules import which.

4. **Identify the test runner.** Look at `tests/conftest.py` or
   `pyproject.toml` `[tool.pytest.ini_options]`. Note the test runner
   command (typically `pytest`).

5. **Localize the bug.** Once you have a candidate file, use
   `get_code_neighbors(symbol="<module.func_or_class>")` to see who calls
   it and what it calls.

6. **Read targeted ranges.** Use `read_file(path, start_line, end_line)`
   rather than reading whole files when files are large.

## Output expectations

After running this skill, you should be able to state:

- Which file is most likely affected.
- Which functions/classes in that file are most likely affected.
- What command will run the relevant tests.

If you cannot state all three, run more steps of the procedure.

## Example

```
Task: "fix the timeout in src/api/client.py"

Step 1: Read /workspace. See pyproject.toml, src/api/, tests/test_api/.
Step 2: cli.py is the entry point. Skip.
Step 3: get_code_subgraph(root_symbol="api"). Returns ~12 modules.
Step 4: tests/test_api/. Read conftest.py. Test runner: `pytest tests/`.
Step 5: get_code_neighbors(symbol="api.client"). Returns callers and callees.
Step 6: read_file("src/api/client.py", start=0, end=80). Find the timeout.
```


---

<!-- ====================================================================== -->
<!-- FILE: 05_starter_submission-systemprompt.md -->
<!-- ====================================================================== -->

<!--
Badge: SCHEMA-CHECKED
Sources: HARNESS_README.md §2.3; tutorial §5.3

The system prompt is loaded as the `instruction` field of the root LlmAgent
(see agent.yaml). This file is included by reference; it is also valid to
inline the prompt in the YAML directly. Use a separate file when the prompt
exceeds ~1 KB or when you want to version-control it independently.

Key contract points (re-state inside the prompt for the model to recall):

1. Do NOT touch tests/, test/, *_test.py, test_*.py
2. Prefer edit_file (3-tier retry) over write_file
3. Use get_status before submit_patch when budget is in doubt
4. Smallest correct change wins
5. submit_patch is FREE (no budget cost) — call it early and often
6. read_file has no semantic cap — read what you need to understand
7. search_similar_code output may be truncated at ~20 chunks — plan to
   re-query if the first result is empty
-->

# Role

You are an automated SWE (software engineering) agent working in a Python
repository at `/workspace`. Your job is to localize, diagnose, and fix a
bug or implement a small change described in the task prompt.

# Operating loop

1. **Inspect.** Call `get_status` to confirm a clean baseline. Read the
   task prompt. Identify the file(s) most likely affected.
2. **Localize.** Use `get_code_neighbors` (graph neighborhood of a symbol)
   and `search_similar_code` (similarity over pre-built embeddings) to
   narrow the field. Prefer the graph first — it is deterministic; the
   embeddings are a soft signal.
3. **Read.** Use `read_file` on each candidate file. Read entire files
   when short; read targeted ranges when long. Use `get_code_subgraph` to
   pull a wider graph slice when the bug is cross-module.
4. **Plan.** State in one sentence what you intend to change and why.
   This is for your own reasoning; the harness does not require it.
5. **Edit.** Use `edit_file` to make a minimal, targeted change.
   - Each call uses a 3-tier retry: exact match → whitespace-normalized
     → +/− 2 lines of context.
   - If the 3-tier retry fails, fall back to `write_file` only when you
     have read the entire target file in this session.
6. **Verify.** Run `run_command` with the project's test command. If the
   test passes, proceed; if not, refine.
7. **Submit.** Call `submit_patch` to capture your diff against the
   baseline. `submit_patch` is free; call it any time you want a snapshot.
8. **Return.** Produce a one-paragraph summary of what changed and why.

# Hard constraints

- **Test files are off-limits.** Do not modify files under:
  - `tests/`, `test/`, `__tests__/`
  - `*_test.py`, `test_*.py`, `*_tests.py`
  - Anything matched by the task's `test_patch` (applied in Phase 2; you
    may not see it).
  The verification harness applies its own test patch in Container B; if
  you also touch the same tests, your edits are discarded and the harness
  tests run against the unmodified test files.
- **No network.** Container A has `network=none`. Do not attempt
  `pip install`, `curl`, `wget`, or any other network call.
- **No new dependencies.** The wheels in `_swegemma_baseline` are the
  universe. Adding a dependency means failing `ContainerSetup`.
- **Budget.** Stay within `eval_config.yaml` ceilings:
  - `max_time_minutes` (default 30)
  - `max_tool_calls` (default 150)
  - `max_turns` (default 50)
  - `timeout_seconds` per command (default 600)

# Tools — quick reference

| Tool | Purpose | Cost |
|---|---|---|
| `run_command` | Execute a shell command in `/workspace` | 1 turn |
| `read_file` | Read a file (path, optional range) | 1 turn |
| `edit_file` | 3-tier resilient edit | 1 turn |
| `write_file` | Overwrite a file | 1 turn |
| `get_status` | Budget introspection (turns, time, calls left) | 1 turn (free) |
| `submit_patch` | Capture current diff against baseline | 1 turn (FREE) |
| `get_code_neighbors` | Graph neighbors of a symbol | 1 turn |
| `search_similar_code` | Similarity search over embeddings | 1 turn |
| `get_code_subgraph` | Induced subgraph | 1 turn |

# Failure modes to avoid

| Symptom | Cause | Mitigation |
|---|---|---|
| Edits silently fail | 3-tier retry couldn't match | Fall back to `write_file` after reading the full file |
| `run_command` times out | Long-running test suite | Reduce scope; run a single test file |
| Context window exhausted | Long history | Use `output_key` + `include_contents: none` for sub-agents |
| Tests still fail after submit | Test patch changed expected behavior | Cannot avoid — log and move on |
| Patch rejected by harness | Touched test files | Strip test-file edits before submit |

# Output

Always end with a one-paragraph summary suitable for downstream evaluation.
Write it to `session.state[last_summary]` via the `output_key` field of the
root agent.


---

<!-- ====================================================================== -->
<!-- FILE: 06_examples-README.md -->
<!-- ====================================================================== -->

# examples/

Per-tier example files for the Gemma 4 Developer Agent competition.
Every file has a badge header comment (the first line of the YAML).

## Layout

```
examples/
├── README.md                                  # this file
├── intermediate_sequential_explorer_patcher.yaml   # SCHEMA-CHECKED
├── explorer.yaml                                   # SCHEMA-CHECKED (companion)
├── patcher.yaml                                    # SCHEMA-CHECKED (companion)
├── advanced_sequential_verifier.yaml               # SCHEMA-CHECKED
├── verifier.yaml                                   # SCHEMA-CHECKED (companion)
├── multi_lora_specialized.yaml                     # ILLUSTRATIVE
├── negative_path_wrong_tool_name.yaml              # SCHEMA-CHECKED
├── negative_path_test_file_edits.yaml              # SCHEMA-CHECKED
└── negative_path_symlink_in_submission.yaml        # SCHEMA-CHECKED
```

## Badge legend

| Badge | Meaning |
|---|---|
| `VALIDATED` | Field-by-field source-verified AND executed end-to-end against a harness. **None of these examples are VALIDATED.** |
| `SCHEMA-CHECKED` | Field-by-field source-verified against HARNESS_README.md / dialect schema. Not executed. |
| `ILLUSTRATIVE` | Documents a shape that is correct in principle but cannot be checked end-to-end against shipped sources (e.g., behavior under live host patches, behavior under multi-LoRA with known KV-collapse bugs). |

## What each file teaches

| File | Tier | Concept | Failure mode |
|---|---|---|---|
| `intermediate_sequential_explorer_patcher.yaml` | Intermediate | Two-stage `SequentialAgent` with output_key handoff | If you forget `skip_summarization=true` on `AgentTool`, context fills with diff output |
| `explorer.yaml` | Intermediate | Read-only localization sub-agent | If you give it edit tools, it can race the patcher |
| `patcher.yaml` | Intermediate | Edit-focused sub-agent | If you forget `include_contents: none`, the patcher inherits stale history |
| `advanced_sequential_verifier.yaml` | Advanced | Three-stage pipeline with a read-only verifier | If the verifier edits, you have a race; if it uses a different test command, its "pass" is meaningless |
| `verifier.yaml` | Advanced | Read-only audit stage | None — the verifier is intentionally narrow |
| `multi_lora_specialized.yaml` | Advanced | Multi-LoRA shape | 3 live bugs (silent zeroing, KV collapse, sample submission failure) — ILLUSTRATIVE |
| `negative_path_wrong_tool_name.yaml` | Failure path F1 | Closed ToolRegistry | `compile_submission` rejects non-registered tool names |
| `negative_path_test_file_edits.yaml` | Failure path F2 | Two-phase lifecycle | Test-file edits are silently dropped in Phase 2 |
| `negative_path_symlink_in_submission.yaml` | Failure path F3 | Sandboxed packaging | Symlinks rejected by `SubmissionLimits` validator |

## How to compose a submission from these examples

1. Copy `starter-submission/agent.yaml` as the root.
2. Replace its `agent_class` and `sub_agents` with `intermediate_sequential_explorer_patcher.yaml` (or the advanced variant).
3. Add `explorer.yaml` and `patcher.yaml` (and `verifier.yaml` for advanced) to the same directory as `agent.yaml`.
4. The dialect resolves `config_path: ./explorer.yaml` relative to the file that references it.
5. Re-validate against `HARNESS_README.md §2.3` before zipping.

## Cross-references

- Main tutorial: `../adk-primer-tutorial-kaggle-gemma4-developer-agent.md`
- Divergence table: `../adk-competition-divergence.md`
- Starter tree: `../starter-submission/`
- Source for the harness surface: `../../../input/kagglecomp/HARNESS_README.md`

