# OpenMonoAgent.ai — Agent Operations, Developer Tools & Workflows
**Hardware Profile:** PowerSpec G914 Gaming PC (AMD Ryzen 9 9950X3D · 64GB DDR5-6000 · RTX 5090 32GB GDDR7 · 2TB NVMe)  
**Host Environment:** Zorin OS 18.1 64-bit  
**Core Runtime:** .NET 10 CLI · Roslyn Compiler Platform · Docker Sandbox  
**Document Series:** Deliverable 03 of 05  

---

## 1. Launching OpenMono in Your Workspace

Navigate to any source code repository on your filesystem and start the agent:

```bash
cd ~/projects/my-web-app

# Launch in default interactive Full-Screen ANSI TUI Mode
openmono agent

# Alternative: Launch in Classic Scrolling Terminal REPL Mode
openmono agent --classic
```

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       OPENMONO ANSI TUI INTERFACE TOUR                      │
├─────────────────────────────────────────────────────────────────────────────┤
│ ~/projects/my-web-app  •  Session: e2a94f18b3c0  •  Model: qwen3.8-27b      │
│ [Context: 14,208 / 196,608 tokens (7%)]  •  [Speed: 78.4 tok/s]            │
├─────────────────────────────────────────────────────────────────────────────┤
│ ◈ Thinking [412 tok] (Press Ctrl+T to expand reasoning chain)               │
│                                                                             │
│ → Reading Program.cs (142 lines)                                            │
│ → Analyzing symbol graph with Roslyn (blast-radius: 3 call sites affected)  │
│ → Proposing unified diff:                                                   │
│   - public void ProcessOrder(Order order)                                   │
│   + public async Task ProcessOrderAsync(Order order, CancellationToken ct)  │
│                                                                             │
│ [Permission Prompt] Allow FileEdit on 'Program.cs'?                         │
│ [1] Allow Once   [2] Allow for Session   [3] Deny Once   [4] Deny Session   │
├─────────────────────────────────────────────────────────────────────────────┤
│ you › refactor Program.cs to use async/await                                │
│ [Tab] Autocomplete  •  [Ctrl+P] Commands  •  [Ctrl+T] Think  •  [F1] Help   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.1 TUI Component Breakdown
* **Header & Telemetry Panel:** Displays active session UUID, directory path, real-time memory bandwidth, streaming token generation velocity (~75–80 tok/s on the RTX 5090), and a dynamic context-window gauge.
* **Reasoning Hourglass & Thinking Panel:** When native reasoning mode (`/think`) is engaged, a live collapsible block displays hidden chain-of-thought logic. An animated indicator confirms active tool deliberation.
* **Diff Previewer:** Code modifications are rendered as syntax-highlighted unified diffs before being committed to disk.
* **Interactive Permission Gate:** Prompts the developer before executing any mutating tool call (bash execution, file writes, git operations).

---

## 2. Complete Built-In Tool Catalog

OpenMono ships with **20 built-in tools** compiled directly into the C# CLI binary. Tools declare their input schemas, concurrency safety, and required security capabilities.

```
+---------------------------------------------------------------------------------------------------+
|                                  OPENMONO BUILT-IN TOOLS CATALOG                                  |
+-------------------+---------------+-------------+-------------------------------------------------+
| Tool Name         | Access Mode   | Concurrency | Core Functionality & Purpose                    |
+-------------------+---------------+-------------+-------------------------------------------------+
| `FileRead`        | Read-Only     | Safe (Task) | Reads file slices with byte and line offsets.   |
| `FileWrite`       | Read/Write    | Serial      | Writes complete file contents to workspace disk.|
| `FileEdit`        | Read/Write    | Serial      | Surgical substring replacement in files.        |
| `ApplyPatch`      | Read/Write    | Serial      | Applies unified diffs (patch format).           |
| `Bash`            | Mutating      | Serial      | Runs bash commands within the Docker container. |
| `Glob`            | Read-Only     | Safe (Task) | Fast pattern-based file and directory searching.|
| `Grep`            | Read-Only     | Safe (Task) | Ripgrep-powered regex and literal content search|
| `ListDirectory`   | Read-Only     | Safe (Task) | Enumerates directory hierarchies and file sizes.|
| `Roslyn`          | Read-Only     | Safe (Task) | In-memory .NET compiler semantic code analysis. |
| `Lsp`             | Read-Only     | Safe (Task) | Language Server Protocol integration (hover/ref)|
| `WebSearch`       | Read-Only     | Safe (Task) | Meta-search via SearXNG gateway / DuckDuckGo.   |
| `WebFetch`        | Read-Only     | Safe (Task) | Markdown web scraper via Scrapling / Camoufox.  |
| `Agent`           | Multi-Modal   | Serial      | Spawns scoped sub-agents (Plan, Coder, Verify). |
| `PlanMode`        | Guardrail     | Safe (Task) | Locks agent into read-only exploration mode.    |
| `Playbook`        | Automation    | Serial      | Executes multi-step YAML workflow procedures.   |
| `Todo`            | Tracking      | Safe (Task) | Manages hierarchical task lists and milestones. |
| `MemorySave`      | State         | Serial      | Saves cross-session knowledge to YAML frontmatter|
| `AskUser`         | Interactive   | Serial      | Prompts the human developer for clarification.  |
| `ToolSearch`      | Discovery     | Safe (Task) | Searches dynamic tool and MCP capabilities.     |
| `SanityCheck`     | Validation    | Safe (Task) | Validates workspace boundaries and permissions. |
+-------------------+---------------+-------------+-------------------------------------------------+
```

### 2.1 Concurrency Rules
* **Read-Only Tools** (`FileRead`, `Glob`, `Grep`, `Roslyn`, `WebSearch`) implement `IsConcurrencySafe = true` and execute in parallel via `Task.WhenAll`. Read tasks can initiate even while the LLM is streaming incoming tokens.
* **Mutating Tools** (`FileWrite`, `FileEdit`, `ApplyPatch`, `Bash`) execute strictly in series to eliminate race conditions and corrupted file states.

---

## 3. Deep-Dive: Roslyn Compiler Intelligence

OpenMono is natively engineered for the .NET ecosystem. When pointed at a C# solution (`.sln`) or project (`.csproj`), the `RoslynTool` spins up an in-memory `Microsoft.CodeAnalysis.AdhocWorkspace` and loads project compilation metadata. Compilation references are cached in system RAM for 5 minutes.

The agent uses 8 distinct compiler actions:

```
+---------------------------------------------------------------------------------------------------+
|                                 ROSLYN COMPILER ENGINE ACTIONS                                    |
+-------------------+-------------------------------------------------------------------------------+
| Action            | Output & Developer Benefit                                                    |
+-------------------+-------------------------------------------------------------------------------+
| `overview`        | Enumerates all classes, structs, records, interfaces, and methods in a file.  |
| `find-references` | Discovers every exact reference to a symbol across the entire solution.       |
| `callers`         | Traces method call graphs upstream to locate every invoking method.           |
| `diagnostics`     | Runs the C# compiler against the file, returning compiler errors and warnings.|
| `search`          | Searches symbol tables for matching class, method, or property names.         |
| `type-hierarchy`  | Computes inheritance trees, base classes, interfaces, and derived types.      |
| `blast-radius`    | Calculates direct and transitive dependencies affected by changing a method. |
| `get-symbol`      | Inspects symbol metadata, exact modifiers, parameter types, and doc comments. |
+-------------------+-------------------------------------------------------------------------------+
```

### Example Roslyn Tool Invocation:
```json
{
  "action": "blast-radius",
  "symbol": "AuthService.ValidateToken",
  "file": "src/Services/AuthService.cs"
}
```
*Agent Response:*
```text
→ Blast-Radius Analysis for 'AuthService.ValidateToken':
  Direct Callers (3):
    • LoginController.cs: Line 45 (LoginController.Authenticate)
    • JwtMiddleware.cs: Line 28 (JwtMiddleware.InvokeAsync)
    • ApiKeyValidator.cs: Line 112 (ApiKeyValidator.VerifyHeader)
  Transitive Callers (2):
    • WebAppStartup.cs: Line 89 (registers JwtMiddleware in pipeline)
    • IntegrationTests/AuthTests.cs: Line 67 (test fixture invocation)
```

---

## 4. Language Server Protocol (LSP) Engine

For non-.NET languages, OpenMono features a universal LSP client (`LspServerManager`). Language servers load lazily upon first file access:

| Language | Extension | Underlying Language Server Binary |
|---|---|---|
| **C#** | `.cs` | OmniSharp |
| **TypeScript / JavaScript** | `.ts`, `.tsx`, `.js` | `typescript-language-server` |
| **Python** | `.py` | `pylsp` (Python LSP Server) |
| **Go** | `.go` | `gopls` |
| **Rust** | `.rs` | `rust-analyzer` |

The `LspTool` exposes 5 standard primitives: `hover`, `definition`, `references`, `completion`, and `diagnostic`.

---

## 5. Model Context Protocol (MCP) Integration

OpenMono acts as a first-class **Model Context Protocol (MCP)** host client. It connects to external MCP servers over `stdio` using JSON-RPC 2.0.

### 5.1 Auto-Detected Knowledge Graphs
OpenMono automatically discovers and registers MCP knowledge graph servers without requiring manual configuration:
1. **`code-review-graph`:** If present on your system path and a graph database exists in the workspace, OpenMono registers it automatically.
2. **`graphify`:** If `graphify-out/graph.json` exists in the repository, OpenMono exposes code knowledge graphs to the model.

### 5.2 Registering Custom MCP Servers
Add external tool providers in `~/.openmono/settings.json`:

```jsonc
"mcp_servers": {
  "sqlite-db": {
    "command": "uvx",
    "args": ["mcp-server-sqlite", "--db-path", "/workspace/data.db"],
    "enabled": true
  },
  "git-analyzer": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-git"],
    "enabled": true
  }
}
```
Registered MCP tools are automatically exposed to the agent as:  
`mcp__{serverName}__{toolName}` (e.g. `mcp__sqlite-db__query`).

---

## 6. Capability-Based Permissions & Sandboxing

Every tool request passes through OpenMono's security engine before touching disk or launching processes:

```
Tool Invocation ──► Schema Validation ──► Path Sanity Check ──► Plan Mode Guard
                                                                      │
                                                                      ▼
Denied ◄── Match 'deny' ◄── Match 'allow' ◄── PermissionEngine Capability Check
  │                            │                              │
Show Alert                 Auto-Approve                  Unmatched
                                                              │
                                                              ▼
                                                   Interactive Prompt
                                             (Allow Once / Session / Deny)
```

### Capability Declarations:
* `FileReadCap(path)` — Reading files within `/workspace`.
* `FileWriteCap(path, op)` — Creating, editing, or deleting files.
* `ProcessExecCap(binary, args)` — Executing bash or child commands.
* `NetworkEgressCap(host, port)` — Outbound HTTP/HTTPS requests.
* `VcsMutationCap(repo, op)` — Git commit, push, or branch operations.
* `AgentSpawnCap(type, task)` — Spawning child sub-agents.

---

## 7. Native Reasoning Mode (`/think`) & Plan Mode (`/plan`)

### 7.1 Reasoning Mode (`/think` / `Ctrl+T`)
Qwen3.8-27B possesses native chain-of-thought capabilities. When enabled:
* The model emits tokens to a hidden `reasoning_content` stream.
* Temperature is automatically dropped from `0.7` to **`0.6`**.
* Presence penalty is set to **`0.0`** to permit reiterative logical loops.
* The thinking chain displays in the TUI as a collapsible block: `◈ Thinking [312 tok]`.

### 7.2 Plan Mode (`/plan`)
Engaging Plan Mode restricts the agent exclusively to read-only tools (`FileRead`, `Glob`, `Grep`, `Roslyn`, `Lsp`, `WebSearch`). Any attempt by the model to call `FileWrite`, `FileEdit`, or mutating `Bash` commands is intercepted and blocked at the tool pipeline boundary. This provides a risk-free environment for exploring architecture before authorizing changes.

---

## 8. Slash Commands Reference

Slash commands provide immediate control over the active session:

| Command | Syntax | Operational Effect |
|---|---|---|
| `/help` | `/help` | Displays command reference and keyboard shortcuts. |
| `/think` | `/think` (or `Ctrl+T`) | Toggles native step-by-step reasoning mode. |
| `/plan` | `/plan` | Toggles read-only architectural planning guardrails. |
| `/model` | `/model <name>` | Switches active model or provider on the fly. |
| `/checkpoint` | `/checkpoint [name]` | Persists an immediate named snapshot of conversational state. |
| `/undo` | `/undo [n]` | Reverts the last $n$ file modifications using snapshot diffs. |
| `/compact` | `/compact [focus]` | Summarizes conversation history to reclaim context window. |
| `/resume` | `/resume [session_id]` | Resumes an earlier session from `~/.openmono/sessions/`. |
| `/status` | `/status` | Prints turn count, token utilization, model, and active directory. |
| `/stats` | `/stats` | Shows aggregate prompt tokens, completion tokens, and tok/s. |
| `/export` | `/export [markdown\|html]`| Exports conversation transcript and code diffs to a file. |
| `/init` | `/init` | Generates a tailored `OPENMONO.md` rules file for the project. |
| `/clear` | `/clear` | Flushes context window and initializes a clean turn. |
| `/debug` | `/debug` | Toggles verbose diagnostic logging in the console. |
| `/quit` | `/quit` (or `Ctrl+C` x2) | Safely shuts down the agent session. |

---

## 9. Automated Workflows: Playbooks

Playbooks are version-controlled, multi-step engineering procedures encoded in YAML frontmatter and Markdown. They allow engineering teams to codify repeatable workflows (e.g. pre-commit reviews, release tagging, security audits) with built-in human verification gates.

### 9.1 Directory Structure
Playbooks reside in `.openmono/playbooks/` (project-specific) or `~/.openmono/playbooks/` (user-wide):

```
.openmono/playbooks/
└── commit/
    ├── PLAYBOOK.md          # Primary workflow declaration
    └── constraints/
        └── git-rules.md     # Commit message formatting constraints
```

### 9.2 PLAYBOOK.md Architecture
```yaml
---
name: commit
version: 1.0.0
description: Prepares, tests, and stages git changes with conventional commit messages.
trigger: manual
parameters:
  scope:
    type: string
    description: Component or module scope (e.g. auth, api, ui)
    required: false
steps:
  - id: analyze-diff
    name: Inspect Git Status and Diffs
    instructions: Run 'git status' and 'git diff' to identify modified files.
  - id: run-tests
    name: Verify Test Suite
    instructions: Run 'dotnet test' or test suite. Halt if any test fails.
  - id: human-gate
    name: Developer Approval
    gate: confirm
    prompt: Review the proposed commit message. Proceed with commit?
  - id: execute-commit
    name: Commit Changes
    instructions: Stage files and execute git commit with conventional commit format.
---

You are an expert release engineer. Follow the step instructions precisely.
Do not proceed past gates without explicit human confirmation.
```
Run a playbook from the terminal with:
```bash
openmono agent --playbook commit
```

---

## 10. VS Code & Cursor IDE Extension Integration

For developers who prefer working inside their code editor, OpenMono provides an official extension (`StartupHakk.openmono-agent`). The extension communicates with OpenMono via the **Agent Client Protocol (ACP)** on port `7475`.

### Step 10.1: Install the Extension
```bash
# In VS Code or Cursor
code --install-extension StartupHakk.openmono-agent
```

### Step 10.2: Start OpenMono in ACP Mode
In your project directory, launch OpenMono in headless ACP server mode:

```bash
cd ~/projects/my-web-app
openmono agent --acp-only --acp-port 7475
```

### Step 10.3: Connect the Extension
1. Open the **OpenMono Agent** icon in the VS Code sidebar.
2. Click **Start Agent for Workspace**.
3. The panel connects to `localhost:7475` via streaming Server-Sent Events (SSE). You can reference files using `@filename`, toggle Plan/Build modes, and review diffs directly inside your editor.
