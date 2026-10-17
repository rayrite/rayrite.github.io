# OpenMonoAgent.ai — Installation & Configuration Guide
**Target System:** PowerSpec G914 Gaming PC (AMD Ryzen 9 9950X3D · 64GB DDR5-6000 · RTX 5090 32GB GDDR7 · 2TB NVMe)  
**Host OS:** Zorin OS 18.1 64-bit (Ubuntu 24.04 LTS "Noble" base)  
**Primary Model:** Qwen3.8-27B-UD-Q4_K_M (196,608 Context Window · Full Accuracy)  
**Document Series:** Deliverable 02 of 05  

---

## 1. Choosing Your Deployment Topology

When setting up OpenMono on your PowerSpec G914, you have two primary deployment architectures to choose from:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ OPTION A: Single-Box Mode (Recommended for the PowerSpec G914)              │
├─────────────────────────────────────────────────────────────────────────────┤
│ Both the agent CLI/TUI and the llama-server inference engine run locally on │
│ this machine. The RTX 5090's 32GB GDDR7 VRAM easily handles the 27B model,  │
│ vision projector, and full context window, while the Ryzen 9 9950X3D and    │
│ 64GB RAM power the agent, Roslyn analysis, and web scraping gateway.        │
│                                                                             │
│ [RTX 5090 (llama-server)] ◄── local socket / :7474 ──► [Agent TUI / ACP]    │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ OPTION B: Dual-Box Mode (Distributed Inference Rig)                         │
├─────────────────────────────────────────────────────────────────────────────┤
│ The PowerSpec G914 acts as a dedicated 24/7 Inference Server (Option 2).    │
│ Your secondary device (e.g. lightweight travel laptop or Android phone)     │
│ runs the Agent (Option 3) and connects via local LAN or outbound relay.     │
│                                                                             │
│ [G914 RTX 5090 (Inference)] ◄── frpc / Relay ──► [Laptop / Android Phone]   │
└─────────────────────────────────────────────────────────────────────────────┘
```

For most developers with this PC, **Option A (Single-Box Mode)** is ideal because you can run the agent locally when sitting at your desk, while simultaneously exposing the background ACP and tunnel services to your Android phone when away.

---

## 2. Step-by-Step Installation

OpenMono provides an automated, idempotent bootstrap installer that checks dependencies, builds containers, downloads models, and configures the environment.

### Step 2.1: Execute the Bootstrap Installer
Open your terminal in Zorin OS 18.1 and run:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/StartupHakk/OpenMonoAgent.ai/refs/heads/main/get-openmono.sh)
```

### Step 2.2: Interactive Prompt — Select Installation Role
The installer will prompt you to select your installation scope:

```text
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  OpenMono.ai — Bootstrap Installer
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  What do you want to install on this machine?

  1. Both              — agent + inference server on one box (single-box mode)
  2. Inference server  — dedicated inference box that runs the model (dual-box)
  3. Agent only        — laptop/workstation that talks to remote inference

  Select [1-3] (default: 1): 1
```
Press **`1`** (or press Enter).

### Step 2.3: Phase 1 — Prerequisite Installation `[1/8]` → `[8/8]`
Phase 1 scans the operating system and ensures all baseline packages are present:
1. `[1/8]` Detects OS (`Zorin OS 18.1` mapped to Ubuntu base `noble`).
2. `[2/8]` Verifies sudo privileges.
3. `[3/8]` Detects hardware:
   ```text
   NVIDIA GPU Detected: NVIDIA GeForce RTX 5090 (32768 MiB VRAM)
   Would you like to install on GPU? (Y/n): Y
   ```
   Type **`Y`** to confirm GPU mode.
4. `[4/8]` Installs build tools, CMake, ripgrep, and curl.
5. `[5/8]` Configures Docker CE and the `docker` user group.
6. `[6/8]` Configures NVIDIA Container Toolkit runtime integration.
7. `[7/8]` Installs .NET 10 SDK to `~/.dotnet`.
8. `[8/8]` Prepares local configuration directory at `~/.openmono`.

### Step 2.4: Phase 2 — Model Download & Container Composition
Once Phase 1 completes, Phase 2 begins automatically:

1. **Hardware Tier Detection:**  
   The installer reads the RTX 5090's 32GB VRAM and selects the top-tier **24GB+ configuration**:
   * **Base Model:** `Qwen3.8-27B-UD-Q4_K_M.gguf` (~15.5 GB)
   * **Multimodal Vision Projector:** `mmproj-qwen3.8-27B-F16.gguf` (~0.9 GB)
   * **Context Size Preset:** `196,608` tokens (reduced slightly to `172,032` tokens when vision encoder burst headroom is reserved).

2. **Parallel Download:**  
   Downloads stream directly from Hugging Face (`unsloth/Qwen3.8-27B-GGUF`) with checksum verification into `~/openmono.ai/models/`.

3. **Container Build & Startup:**  
   The script builds the `openmono-agent` container, pulls `ghcr.io/ggml-org/llama.cpp:server`, and launches the inference daemon via Docker Compose.

4. **Completion Message:**
   ```text
   ────────────────────────────────────────────────────────────
     Setup Complete
   ────────────────────────────────────────────────────────────

     ✓ OpenMono.ai is ready to use!
     Your machine is configured for single-box mode (agent + inference).

     Next steps:
       1. cd your-project/
       2. openmono agent

     Other commands:
       openmono status       # Show container and model state
       openmono config       # Configure runtime parameters
   ────────────────────────────────────────────────────────────
   ```

### Step 2.5: Reload Shell Environment
Update your active terminal session so that `openmono` is present on your system `PATH`:

```bash
source ~/.bashrc
```

Verify that the CLI is accessible:
```bash
openmono help
```

---

## 3. Managing the Inference Server Lifecycle

The inference server runs as a background system container (`llama-server`) managed by Docker Compose. You control it directly using the `openmono` wrapper:

```bash
# Check container health, model loaded, VRAM usage, and active port
openmono status

# Tail the real-time inference server logs (shows prompt processing tok/s)
openmono logs

# Stop the inference server and free GPU VRAM
openmono stop

# Start the inference server
openmono start

# Restart the inference server (useful after changing model quantization or context size)
openmono restart
```

### Checking Active GPU Allocation
To verify that the model is fully offloaded to the RTX 5090's VRAM without CPU paging:

```bash
nvidia-smi
```
Under `Processes`, you will see `llama-server` consuming approximately **18.5GB to 24.5GB** of VRAM (depending on active KV cache allocation). On your 32GB RTX 5090, you still retain **7.5GB to 13.5GB of free VRAM headroom**, preventing out-of-memory crashes even during long multi-turn sessions with vision.

---

## 4. Web Search & Scraping Services Setup

By default, OpenMono includes built-in fallback web search (via DuckDuckGo) and direct HTTP fetching. For private, production-grade search and anti-bot stealth scraping, OpenMono includes self-hosted containers:

```bash
# 1. Install SearXNG private meta-search engine + Caddy Gateway
openmono setup search

# 2. Install Scrapling + Camoufox stealth headless browser engine
openmono setup scraper
```

### How the Web Services Stack Works
```
Agent Tool: WebSearch ──┐
                        ├──► Caddy Gateway (:47480) ──┬──► SearXNG (:8080)
Agent Tool: WebFetch  ──┘     (Bearer Auth Protected) └──► Scrapling (:5000)
```
* **SearXNG:** Aggregates search results without tracking, advertisements, or rate limits.
* **Scrapling:** A high-speed FastAPI scraper with intelligent escalation:
  1. *Fast Path:* Asynchronous HTTP fetcher.
  2. *Stealth Path:* If a target website returns Cloudflare or Bot challenges (HTTP 403/429), it automatically escalates to **Camoufox** (a stealth, anti-fingerprinting headless Firefox browser) to render the DOM and extract clean Markdown.

---

## 5. Comprehensive Configuration Reference

OpenMono loads settings through a 6-tier hierarchical cascade, where later layers override earlier ones:
1. Built-in defaults.
2. Global user configuration (`~/.openmono/settings.json`).
3. Project-specific configuration (`.openmono/settings.json` in your project root).
4. Explicit configuration flag (`--config <path>`).
5. Environment variables (prefixed with `OPENMONO_`).
6. CLI runtime flags (`--model`, `--endpoint`, etc.).

### 5.1 Using `openmono config`
You can inspect and modify settings without opening text editors:

```bash
# Read a setting
openmono config get llm.endpoint

# Set a setting for the current project
openmono config set llm.temperature 0.6

# Set a setting globally across all projects
openmono config set --global llm.model qwen3.8-27b
```

### 5.2 Master `settings.json` Schema
Below is an annotated, production-ready `~/.openmono/settings.json` tailored for the PowerSpec G914:

```jsonc
{
  // Primary LLM connection and sampling settings
  "llm": {
    "endpoint": "http://localhost:7474",
    "model": "qwen3.8-27b",
    "context_size": 196608,
    "max_output_tokens": 16384,
    "temperature": 0.7,
    "top_p": 0.8,
    "top_k": 20,
    "presence_penalty": 1.5,
    "min_p": 0.0,
    "repetition_penalty": 1.0
  },

  // Opt-in cloud providers for hybrid workflows (Anthropic, OpenAI, Ollama)
  "providers": {
    "anthropic": {
      "api_key": "",
      "model": "claude-sonnet-4-20250514",
      "active": false
    },
    "openai": {
      "api_key": "",
      "model": "gpt-4o",
      "active": false
    },
    "ollama": {
      "endpoint": "http://localhost:11434",
      "model": "llama3",
      "active": false
    }
  },

  // Security and execution permissions
  "permissions": {
    "tools": {
      "Bash": {
        "allow": ["git *", "dotnet *", "npm *", "cargo *", "pytest *"],
        "deny": ["rm -rf /*", "mkfs *", "dd *", ":(){ :|:& };:"],
        "ask": ["sudo *", "docker rm *", "git reset --hard *"]
      },
      "FileWrite": {
        "deny": ["*.env", "*.pem", "*.key", "id_rsa*"]
      }
    }
  },

  // Lifecycle shell hooks
  "hooks": {
    "pre_tool_use": [
      {
        "if": { "tool": "Bash", "input_contains": "git push" },
        "run": "echo '[AUDIT] Git push attempted at $(date)' >> ~/.openmono/audit.log"
      }
    ],
    "post_tool_use": [],
    "session_start": []
  },

  // Model Context Protocol (MCP) external server registrations
  "mcp_servers": {
    "database-inspector": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://user:pass@localhost:5432/mydb"],
      "enabled": false
    }
  },

  // Sampling bundles switchable via /model or presets
  "model_presets": {
    "precise": {
      "temperature": 0.2,
      "top_p": 0.9,
      "presence_penalty": 0.0,
      "active": false
    },
    "creative": {
      "temperature": 1.0,
      "top_p": 0.95,
      "presence_penalty": 1.8,
      "active": false
    }
  },

  // Self-hosted web gateway settings
  "web": {
    "gateway": "http://localhost:47480",
    "search": true,
    "scrape": true
  },

  // System-level flags
  "auto_detect_code_graph": true,
  "vision_enabled": true,
  "verbose": false,
  "data_directory": "~/.openmono"
}
```

---

## 6. Environment Variables Reference

Every parameter in `settings.json` can be overridden by environment variables:

| Environment Variable | Equivalent Setting | Description |
|---|---|---|
| `OPENMONO_ENDPOINT` | `llm.endpoint` | URL of the inference server (e.g. `http://localhost:7474`) |
| `OPENMONO_MODEL` | `llm.model` | Model name alias sent in chat completions |
| `OPENMONO_API_KEY` | `llm.api_key` | Bearer authentication key |
| `OPENMONO_CONTEXT_SIZE` | `llm.context_size` | Context window ceiling in tokens |
| `OPENMONO_VISION_ENABLED` | `vision_enabled` | Set to `1` to enable multimodal image processing |
| `OPENMONO_WEB_SEARCH` | `web.search` | Set to `1` to route searches through local SearXNG |
| `OPENMONO_WEB_SCRAPE` | `web.scrape` | Set to `1` to route page fetches through local Scrapling |
| `OPENMONO_ACP_ENABLED` | (Internal) | Set to `1` to host the ACP server on port `7475` |
| `OPENMONO_WORKSPACE` | `working_directory` | Overrides the active workspace directory |
| `OPENMONO_MODEL_PRESET` | (Preset Selector) | Activates a named preset (e.g. `precise`, `creative`) |

---

## 7. Command-Line (CLI) Flag Overrides

Flags passed directly to `openmono agent` have the highest precedence, overriding both `settings.json` and environment variables for that single session:

| Flag | Parameter | Purpose |
|---|---|---|
| `--classic` | Display Mode | Launches standard scrolling terminal instead of the full-screen Spectre.Console ANSI TUI. |
| `--acp-only` | Headless Mode | Skips the terminal UI and runs exclusively as an ACP background server on port `7475` (for IDE extensions). |
| `--acp-port <port>` | Port Selection | Changes the ACP server port (default is `7475`). |
| `--endpoint <url>` | `llm.endpoint` | Redirects the agent to an alternate inference server (e.g. a remote box). |
| `--model <name>` | `llm.model` | Overrides the target model identifier. |
| `--verbose`, `-v` | Debugging | Displays full streaming JSON chunks, token counters, and tool execution diagnostics. |
| `--config <path>` | File Path | Forces OpenMono to load configuration from a specified JSON file. |
