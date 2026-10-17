# Competition Brief & BCF Agent Architecture Dossier
**Target Competition:** [Google - The Gemma 4 Developer Agent Competition](https://www.kaggle.com/competitions/gemma-4-developer-agent/overview)  
**Deliverable File:** `01-competition-brief-and-agent-architecture.md`  
**Date of Record:** October 13, 2026  
**Status:** Grounded Research & Technical Specification  

---

## 1. Competition Overview & Official Tracks

The **Google - The Gemma 4 Developer Agent Competition** on Kaggle represents a major benchmark in autonomous artificial intelligence for software engineering. The competition tasks participants with developing, configuring, and post-training an autonomous software engineering (SWE) agent utilizing Google's open-weights **Gemma 4** model family. The agent operates in a real-world repository environment, autonomously reading issue descriptions, exploring multi-module codebases, modifying source code, running tests, and generating production-grade patches.

```
+----------------------------------------------------------------------------------------------------+
|                         THE GEMMA 4 DEVELOPER AGENT COMPETITION STRUCTURE                         |
+----------------------------------------------------------------------------------------------------+
|                                                                                                    |
|    +------------------------------------------+    +------------------------------------------+    |
|    |           TRACK 1: MAIN LEADERBOARD      |    |            TRACK 2: PAPER TRACK          |    |
|    +------------------------------------------+    +------------------------------------------+    |
|    | * Autonomous bug resolution on hidden    |    | * Kaggle Writeup / arXiv-ready PDF       |    |
|    |   software repositories.                 |    | * Up to 3,000 words.                     |    |
|    | * Ranked by Pass/Fail score on unit      |    | * Focus: Agentic architectures, tool     |    |
|    |   test patches (`test_patch`).           |    |   ablation studies, fine-tuning recipes. |    |
|    | * Submission: `submission.zip` containing|    | * Submissions open concurrently via      |    |
|    |   root `agent.yaml` + LoRA adapters.     |    |   Kaggle Writeup interface.              |    |
|    +------------------------------------------+    +------------------------------------------+    |
|                                                                                                    |
|    +------------------------------------------------------------------------------------------+    |
|    | KEY DEADLINE: Submissions close on November 25, 2026 at 23:59 UTC.                      |    |
|    +------------------------------------------------------------------------------------------+    |
+----------------------------------------------------------------------------------------------------+
```

---

## 2. Declarative Security Model & Compilation Pipeline

A defining attribute of the Gemma 4 Developer Agent Competition is its strict **declarative-only security framework**. Standard competition formats often allow competitors to submit arbitrary Python execution scripts (e.g., `agent.py` or `main.py`) executed via dynamic importing (`importlib`). In contrast, to guarantee container safety, deterministic evaluation, and strict isolation during offline grading, the Gemma 4 evaluation harness mandates that agents be declared statically.

### 2.1 The Role of `agent.yaml` and `submission.zip`
Every submission to the competition must be packaged as a single compressed zip archive named `submission.zip`. The archive must strictly contain the root configuration file `agent.yaml` at its root directory level:

```text
submission.zip
├── agent.yaml              # MANDATORY: Root agent configuration and schema entrypoint
├── configs/
│   └── sampling.yaml       # OPTIONAL: Model generation parameters (temperature, top_p, etc.)
├── prompts/
│   ├── system.md           # OPTIONAL / RECOMMENDED: Modular system instructions
│   └── tools_guide.md      # OPTIONAL: Specialized guidelines for tool dispatching
└── lora/                   # OPTIONAL: Fine-tuned LoRA / PEFT adapter weights
    ├── adapter_config.json
    └── adapter_model.safetensors
```

### 2.2 Compilation via `adk_submission`
During automated evaluation on Kaggle's backend, the runner does not execute shell scripts from the competitor. Instead, it invokes the official compilation pipeline:

```python
from adk_submission import compile_submission, ModelRegistry, ToolRegistry
from swegemma.config import build_submission_limits

# Fetch host sandbox boundaries and generation limits
limits, constraints = build_submission_limits()

# Closed host registries prevent unauthorized network or system calls
models = ModelRegistry()
tools = ToolRegistry()

# Statically compile the declarative tree into live BaseAgent objects
agent = compile_submission(
    bundle_dir="/path/to/unzipped_submission",
    tool_registry=tools,
    model_registry=models,
    limits=limits,
    generation_constraints=constraints
)
```

If an archive lacks `agent.yaml` at the root, contains invalid YAML tags, attempts to import unapproved Python modules, or specifies models outside the approved registry, `compile_submission` throws an immediate compilation error, resulting in a submission failure.

---

## 3. Base Models & Inference Architecture

The competition is centered on Google DeepMind's **Gemma 4** open-weights architecture, with particular emphasis on high-efficiency quantization and reasoning capabilities.

### 3.1 Primary Leaderboard Target: `gemma-4-31b-it-qat-w4a16-ct`
The pre-registered model alias in the competition harness is:
`gemma-4-31b-it-qat-w4a16-ct`

| Component | Technical Specification | Operational Impact |
| :--- | :--- | :--- |
| **`31b`** | 31-Billion Parameter Dense Architecture | High reasoning capacity, strong code syntax and context comprehension. |
| **`it`** | Instruction-Tuned Variant | Optimized for conversational multi-turn agent loops and function calling. |
| **`qat`** | Quantization-Aware Training | Weights trained while modeling quantization noise; retains full-precision accuracy. |
| **`w4a16`** | 4-bit Weights, 16-bit Activations | VRAM footprint drops from ~64 GB (FP16) down to ~18–20 GB. |
| **`ct`** | Compressed-Tensors Format | Supported natively by optimized vLLM kernels for zero-loss inference throughput. |

Because the memory footprint is under 20 GB VRAM, the model fits with massive headroom on your **PowerSpec G914's MSI Ventus 3X OC RTX 5090 (32GB GDDR7 VRAM)**. With ~12 GB of unconstrained VRAM headroom, you can allocate huge KV caches (handling up to 16k–32k multi-turn agent context windows) and perform on-device 4-bit QLoRA fine-tuning without CPU offloading or memory thrashing.

### 3.2 PowerSpec G914 Hardware Advantage vs. Standard Competition Environments
Most competitors develop on constrained 16GB or 24GB GPUs (RTX 4090 / 3090 / Kaggle T4x2 / L4), which forces aggressive context truncations and slow CPU-offloaded training. Your PowerSpec G914 setup provides a decisive edge:
* **AMD Ryzen 9 9950X3D (Zen 5, 16C/32T):** 28 vCPUs dedicated to WSL2 enable parallel local batch evaluation across multiple Docker sandboxes simultaneously.
* **64GB DDR5-6000 (EXPO Profile 1):** Eliminates system memory bottlenecks when parsing large repository ASTs and code dependency graphs.
* **MSI RTX 5090 32GB GDDR7:** Runs both the 31B base inference engine and Unsloth LoRA fine-tuning 100% on-device.

### 3.3 Proxy Models for Fast Local Prototyping
For rapid local iteration, prompt experimentation, and testing harness wiring without loading the full 31B weights, smaller Gemma 4 family variants can be used in your local development environment:
* `gemma-4-e2b` / `gemma-4-e4b`: Ultra-lightweight edge variants for instant CPU/GPU sanity checks.
* `gemma-4-12b`: Intermediate balance for quick trajectory generation and sanity testing.
* `gemma-2-9b-it`: Readily accessible Hugging Face / Ollama fallback for pipeline testing.

---

## 4. Evaluation Benchmark & Sandbox Lifecycle

### 4.1 Benchmark Dataset Structure
The public development set provided by Google is distributed as `tasks.jsonl` containing 129 curated benchmark tasks adapted from high-impact open-source Python repositories (e.g., `fastapi`, `rich`, `requests`, `httpx`, `pydantic`).

Each line in `tasks.jsonl` contains the following schema:
```json
{
  "instance_id": "fastapi__fastapi-1024",
  "repo": "tiangolo/fastapi",
  "base_commit": "a1b2c3d4e5f6...",
  "problem_statement": "Issue description detailing unexpected HTTP 422 validation failure...",
  "patch": "diff --git a/fastapi/routing.py b/fastapi/routing.py...",
  "test_patch": "diff --git a/tests/test_routing.py b/tests/test_routing.py...",
  "version": "0.95.0",
  "environment_setup_commit": "setup_commit_hash..."
}
```

### 4.2 The Two-Container Sandbox Lifecycle
During evaluation, the harness spins up a sandboxed environment where:
1. **Repository Check-Out:** The target repository is checked out at `base_commit` inside `/workspace`.
2. **Offline Isolation:** Network access is completely disabled. All dependencies are pre-installed in the local repository environment.
3. **Agent Loop:** The agent receives `problem_statement` as its initial prompt and interacts with `/workspace` via declared tools.
4. **Terminal Patch Capture:** When the agent invokes `submit_patch()`, the harness executes `git diff` against `base_commit` and stores the resulting patch string.
5. **Grading Phase:** The harness applies the golden verification unit tests (`test_patch`), runs `pytest`, and evaluates whether all previously failing tests now pass without breaking existing tests.

```
+---------------------------------------------------------------------------------------------------+
|                                  SWEGEMMA EVALUATION HARNESS FLOW                                 |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|    +-----------------------------+               +-------------------------------------------+    |
|    |      `tasks.jsonl` Task     | ------------> | Isolated Docker Sandbox (`/workspace`)    |    |
|    | (repo, base_commit, issue)  |               | Clean Git checkout at `base_commit`       |    |
|    +-----------------------------+               +-------------------------------------------+    |
|                                                                    |                              |
|                                                                    v                              |
|                                                  +-------------------------------------------+    |
|                                                  | Multi-Turn BCF Agent Interaction Loop     |    |
|                                                  | Tools: `run_command`, `read_file`, etc.   |    |
|                                                  +-------------------------------------------+    |
|                                                                    |                              |
|                                                                    v                              |
|                                                  +-------------------------------------------+    |
|                                                  | Terminal Action: `submit_patch()`         |    |
|                                                  | Freezes unified `git diff` of workspace   |    |
|                                                  +-------------------------------------------+    |
|                                                                    |                              |
|                                                                    v                              |
|    +-----------------------------+               +-------------------------------------------+    |
|    | Hidden `test_patch` Applied | ------------> | PyTest Automated Verification Runner      |    |
|    +-----------------------------+               | PASS -> +1 Bug Fixed / FAIL -> 0          |    |
|                                                  +-------------------------------------------+    |
+---------------------------------------------------------------------------------------------------+
```

### 4.3 Compute & Resource Constraints
To avoid compute timeouts and submission disqualification:
* **Global Evaluation Limit:** The Kaggle evaluation notebook must complete all tasks within a global runtime window (typically 12 hours).
* **Per-Task Timeout:** Each task is governed by parameters such as `timeout_seconds: 600` (10 minutes) and `max_turns: 25`.
* **Turn Limits:** If an agent enters an infinite loop or fails to issue `submit_patch` before reaching `max_turns`, the task is terminated and scored as an empty patch.

---

## 5. Host Tool Registry

The host environment exposes a closed, sandboxed tool registry through `swegemma`. The BCF agent configures bindings to these exact tools in `agent.yaml`:

| Tool Name | Parameters | Description | Best Practice for BCF Agent |
| :--- | :--- | :--- | :--- |
| **`run_command`** | `command: string` | Executes non-interactive shell commands inside `/workspace`. | Use to run `pytest`, inspect git status, or check syntax. Avoid interactive commands (`vim`, `less`, `top`). |
| **`read_file`** | `path: string`, `start_line: int`, `end_line: int` | Reads slice of file contents with line numbers. | Always specify line ranges when reading large source files to conserve model context. |
| **`write_file`** | `path: string`, `content: string` | Overwrites or creates a new file. | Use when creating new reproduction test scripts. |
| **`edit_file`** | `path: string`, `old_str: string`, `new_str: string` | Replaces exact string block in file. | Ensure `old_str` contains unique surrounding context lines to avoid ambiguity errors. |
| **`get_status`** | *None* | Returns `git status` summary of modified files. | Use in the Check and Fix stages to monitor uncommitted workspace changes. |
| **`submit_patch`** | *None* | Terminal action that completes the task and freezes the git diff. | **MANDATORY.** Must be executed before context or turn limits expire. |
| **`get_code_neighbors`**| `symbol: string`, `depth: int` | Explores AST code graph neighbors (callers, callees, classes). | Use during the Branch phase to localize where buggy methods are invoked across files. |
| **`search_similar_code`**| `query: string`, `top_k: int` | Semantic and keyword retrieval across the repository AST. | Essential for locating error messages or identifiers mentioned in the issue. |
| **`get_code_subgraph`** | `node_id: string` | Extracts localized AST dependency subgraph. | Used for understanding class inheritance and data flow in complex modules. |

---

## 6. The BCF (Branch-Check-Fix) Coding Agent Architecture

The **BCF (Branch-Check-Fix / Behavior-Context-Feedback)** architecture is an engineering paradigm tailored to maximize SWE-bench bug resolution rates under constrained token budgets and turn limits.

### 6.1 Conceptual Foundation

```
                  +----------------------------------------------+
                  |               ISSUE STATEMENT                |
                  +----------------------------------------------+
                                         |
                                         v
+----------------------------------------------------------------------------------+
| PHASE 1: BRANCH (Hypothesis Generation & Context Scoping)                        |
| * Parse issue description & extract keywords / tracebacks.                      |
| * Use `search_similar_code` and `get_code_neighbors` to isolate target files.   |
| * Restrict context window to suspect modules; avoid dumping whole directories.  |
+----------------------------------------------------------------------------------+
                                         |
                                         v
+----------------------------------------------------------------------------------+
| PHASE 2: CHECK (Reproduction & Baseline Verification)                            |
| * Write a minimal standalone reproduction script or identify relevant unit test.  |
| * Execute `run_command("pytest ...")` to confirm the bug is reproducible.        |
| * Establish baseline: The test MUST fail before attempting any fix.              |
+----------------------------------------------------------------------------------+
                                         |
                                         v
+----------------------------------------------------------------------------------+
| PHASE 3: FIX (Surgical Implementation & Localized Modification)                  |
| * Formulate targeted patch targeting the exact root cause.                       |
| * Apply modification using `edit_file` with precise contextual anchors.          |
| * Re-run reproduction test: It must now pass cleanly.                           |
| * Re-run repository regression test suite: No other tests may break.            |
+----------------------------------------------------------------------------------+
                                         |
                                         v
+----------------------------------------------------------------------------------+
| PHASE 4: CONVERGENCE & TERMINAL ACTION (Integrity Guard)                         |
| * Run `get_status` to ensure no stray temporary files exist.                     |
| * Remove temporary test scripts.                                                 |
| * Call `submit_patch()` to freeze unified git diff and conclude task.            |
+----------------------------------------------------------------------------------+
```

### 6.2 Key Architectural Safeguards in BCF

1. **Anti-Hallucination Reproduction Gate:**  
   The agent is strictly instructed never to modify source code until it has confirmed a failing test. This prevents "blind edits" that alter logic without resolving the root issue.
2. **Context Budget Compaction:**  
   Gemma 4 models perform best when prompt context is concise. BCF uses `read_file` with line slices (max 80 lines per view) rather than reading entire 2,000-line files.
3. **Guaranteed Terminal Exit:**  
   If the turn counter reaches `max_turns - 2` (e.g., Turn 23 out of 25) or remaining execution time drops below 60 seconds, BCF abandons further exploratory loops, cleans up temporary files, and executes `submit_patch()` immediately. Any partial progress is preserved rather than throwing a turn-limit exception.
