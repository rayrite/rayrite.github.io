# COMBINED MARKDOWN - combine

_Generated 2026-10-10 22:23:19 | 2 files | folder: D:\stuff\docs\taylor_fv\github\rayrite.github.io\cvx\games\items\combine_

## Contents

1. 00_game-engine-automation-roundup_kimiK3h.md
2. 01_tool-decision-matrix.md

---

<!-- ====================================================================== -->
<!-- FILE: 00_game-engine-automation-roundup_kimiK3h.md -->
<!-- ====================================================================== -->

# Game-Engine Automation & Control Roundup — October 2026

**Engines covered:** Unity, Blender, Unreal Engine, Phaser (3/4), Construct 3, Godot
**Time window:** tools released or significantly updated between **October 2025 and October 2026** (research date: 2026-10-10)
**Scope statement:** This report maps every notable tool released or materially updated in the last 12 months that (a) automates or controls a game-development editor/IDE (CLI, headless, API, MCP, agent bridges) or (b) automates the content pipeline feeding those engines (2D/3D asset generation, testing, CI/CD). "Done" means a development team can read this and assemble a shortlist per engine, per category, with licensing and integration notes.

**How to read this report:**

- Sections 1–6 are per-engine, each split into **Official ecosystem**, **FOSS / community**, and **Commercial / third-party** (per the requested categorization).
- Section 7 covers cross-engine pipelines: 3D asset generation, 2D asset generation, audio, CI/CD, and AI QA/playtesting.
- Section 8 is the **UVP index** — tools grouped by Unique Value Proposition, framed both as technical-integration capabilities and as workflow outcomes.
- Section 9 lists open questions, disagreements, and unverifiable claims.
- Section 10 is the full source list.

---

## Executive Summary

The last 12 months are the period when **"agent drives the editor" stopped being a hack and became a first-party feature** across four of the six engines:

1. **MCP (Model Context Protocol) is the connective tissue of 2026.** Unity shipped an official, *free* MCP server (Unite Seoul, July 2026). Epic shipped an experimental MCP plugin in **UE 5.8** (June 17, 2026) and said UE6 is being built around an MCP layer. The Blender project shipped its own **Blender Lab MCP Server** (requires Blender 5.1+, March 2026), and Anthropic shipped a Claude connector for it (April 2026). Phaser shipped the **Game Agent MCP server** (July 2026). Godot has no official server but has the richest third-party MCP ecosystem of any engine (a dozen+ bridges). **Construct 3 is the outlier** — an official MCP server is only a forum request as of February 2026.

2. **Every engine also shipped serious non-AI automation surface this year:** Unity's new standalone **Unity CLI** (beta, 2026) and deeplink automation in 6.3 LTS; Blender 5.1's node tools becoming registered, scriptable operators; Unreal's Horde/BuildGraph/UET build stack maturing; Godot 4.5–4.7's headless export improvements (shader baker, selective template downloads); Phaser 4's ground-up renderer rewrite (April 2026) plus Phaser Editor v5 with built-in AI integration (May 2026); Construct 3's TypeScript support, 3D model pipeline and single-file exports.

3. **The asset pipeline is now API-first.** Effectively every major asset generator (Meshy, Scenario, Layer, PixelLab, Ludo, Leonardo, Recraft, ElevenLabs) now ships an **official MCP server**, meaning a single custom agent can generate assets *and* place them in the engine through one protocol.

4. **AI QA went commercial:** Razer QA Companion-AI, nunu.ai, ManaMind, NodeMori BugHunter and Regression Games all productized autonomous playtesting in the last 12 months; Roblox reported 60,000+ AI-generated 3D assets/day and announced a Playtesting Agent.

5. **Safety is the recurring caveat.** Blender's own MCP page warns it executes LLM-generated code "without any guards" and recommends a VM. Two Unity MCP servers in one project will break compilation. Several "free" bridges require a paid AI subscription behind them. These notes are flagged per-tool below.

---

## 1. Unity

### 1.1 Official ecosystem

| Tool | What it is | Window / status | Access & cost | Automation surface |
|---|---|---|---|---|
| **Unity AI (Assistant)** — Open Beta | First-party agentic assistant inside the Unity 6 Editor: Ask / Agent / **Plan Mode**, Skills system, vision analysis of scenes, Profiler-capture analysis, checkpoints & rollback, generated-asset tagging | Beta relaunched Jan 2026; **Open Beta for all Unity 6+ users May 2026**; requires Unity 6.3+ for newest features | 14-day trial on Personal, then $10/mo for 1,000 credits; included with Pro/Enterprise/Industry | In-Editor agent with project knowledge-graph indexing; can build custom editor tools (validators, batch processors) from prompts |
| **Unity AI Generators** | Asset generation inside Assistant: sprites, textures, animations, audio, materials, **UI Toolkit UXML/USS layouts**, **skybox cubemaps**, **3D meshes + textures** | Expanded Jan–May 2026 | Uses Unity AI credits | Text/image → engine-ready asset, placed in project |
| **Unity MCP Server (official)** | First-party MCP bridge: scene management, script editing, console reads, GameObject inspection, build settings; auto-configures Cursor, Claude Code, Windsurf | Shipped with the AI Open Beta (May 2026); **made free — no subscription, no credits, no concurrency limits — at Unite Seoul, July 2026** | Free (Unity 6.0+ only) | MCP tools + custom C# methods exposable as tools |
| **AI Gateway** | Bring-your-own-key connection for third-party agents inside the Unity Assistant | May 2026 | Free; you pay your model provider | Runs external agents in-Editor |
| **Unity plugin for Claude Code** | Official plugin with **29 Agent Skills** (UI Toolkit, 2D/tilemaps, localization, multiplayer, Shader Graph…) | Released **September 9, 2026** | Free; needs a Claude plan | Teaches Claude current-Unity workflows; complements (does not replace) MCP |
| **Unity CLI (new, beta)** | New standalone command-line tool; announced alongside the free MCP at Unite Seoul; Unity Hub 3.15 release notes (April 21, 2026) introduce "a new standalone CLI" | Beta channel, 2026 | Free | Terminal/scriptable control of Editor & MCP route — the key piece for driving Unity from a custom agent without the Hub UI |
| **Unity 6.3 LTS automation features** | **Deeplinking for local projects** (Hub 3.15+: create projects, install package versions, download Asset Store items, or custom `DeeplinkHandler` operations); new **UI Test Framework** package (simulated mouse/keyboard/scroll for UI Toolkit); LMDB-backed Search indexing; Adaptive Performance as built-in module | 6.3 LTS, 2026 | Free | Deeplinks = URL-driven editor automation; UI Test Framework = automated UI testing |
| **Unity Test Framework** | Established EditMode/PlayMode test runner; headless via `-runTests -testPlatform PlayMode -batchmode` | Mature, continuously updated | Free | CLI test execution for CI |

Key pricing clarification (a common point of confusion): the **MCP server is free**; what costs money is Unity's own **AI Assistant** ($10/mo on Personal). You can drive Unity from Claude Code/Cursor over MCP without paying Unity anything.

### 1.2 FOSS / community

| Tool | License / stars | Engine versions | Highlights | Notes |
|---|---|---|---|---|
| **MCP for Unity (CoplayDev/unity-mcp)** | MIT; ~14–15k★ (the largest community) | 2021.3 LTS → 6.x | 25–47 tool entry points (v10.2.0, Sep 1, 2026): scenes, GameObjects, C# editing, assets/prefabs, **test running**, builds, profiling; multi-client; in-Editor setup window auto-configures detected clients | Requires Python 3.10+ with `uv` |
| **Unity-MCP (IvanMurzak)** | Apache-2.0 | 2022.3+ | 70+ tools; `tests-run` for EditMode/PlayMode; **self-contained server binary — no Python**; suited to in-game runtime AI too | v0.91.0 (Sep 17, 2026) |
| **mcp-unity (CoderGamester)** | Open source | Unity Editor plugin + Node server (WebSocket :8090) | Designed for Cursor/Claude Code/Codex/Windsurf; one-click client config from Editor window | Needs Node 18+ |
| **Unity-MCP (Ops-Nation, "AnkleBreaker")** | Open source | Unity | Positions itself as **AI Skills + MCP tools + CLI** for a full AI develop-and-test loop; "any C# method may be turned into a tool by a single line"; works with Claude Code, Gemini, Copilot, Cursor | CLI-first setup |
| **GameCI** (game.ci) | FOSS | Unity (+ detection/build commands for Unreal & Godot) | Community Docker images with Unity pre-installed; GitHub Actions / GitLab CI / CircleCI templates; license activation handling; **new plugin-based GameCI CLI** (standalone binary, no Node required; GitHub Action `game-ci/cli`) | The de facto standard for Unity CI |

⚠️ **Integration warning (verified across multiple guides):** do not install two MCP bridges in one Unity project — on 6.3+ the AI Assistant package and MCP for Unity ship conflicting `System.Collections.Immutable` versions and the project stops compiling. Pick one server per project.

### 1.3 Commercial / third-party

| Tool | What it is | Notes |
|---|---|---|
| **AutomaticUnityBuilds.com** | CI/CD service that compiles on **your own hardware** managed from a web UI; auto-deploys to itch.io; supports console targets | Avoids Unity cloud-licensing issues and per-build cloud costs; pitched at game jams and indies (Mar 2026) |
| **AltTester (Altom)** | Free GPL-3.0 Unity SDK for UI/integration test automation; pairs with Appium for device fleets | Zero-cost automated game UI testing stack |
| **Scenario** | 2D asset platform with **official Unity integration** + MCP; custom LoRA style training | See §7.2 |
| **Ludus / Coplay / general coding agents** | Claude Code, Cursor, Codex, Copilot, Windsurf all operate on Unity repos directly, and through the MCP bridges above | Repo-level agents are strongest at multi-file refactors; MCP is what lets them act on the *open Editor* |

---

## 2. Blender

### 2.1 Official ecosystem

| Tool | What it is | Window / status | Automation surface |
|---|---|---|---|
| **Blender Lab MCP Server (official)** | The Blender project's own MCP server: core tool `execute_blender_code` plus **`*_for_cli` twins that run in a background (headless) Blender process**; structured scene summaries; viewport/window screenshot tools (for *looking*, not clicking) | Requires **Blender 5.1+** (5.1 released Mar 17, 2026); client-neutral (works with Claude, Codex, Cursor, local models via llama.cpp) | Full `bpy` execution, interactive *and* headless — the strongest "custom agent" fit in this report |
| **Blender 5.1 release** | Python upgraded to **3.13** (VFX Platform 2026); **Node Tools now get registered operators** — callable from Python and bindable to hotkeys; copy/paste nodes between Blender instances; OpenUSD export Python hooks (`get_prim_map`); new Geometry Nodes (Bone Info, grid/volume nodes, Matrix SVD, UV Unwrap/Pack improvements) | Mar 17, 2026 (5.1.1 Apr 14; 5.1.2 May 19) | Direct automation-relevant API changes |
| **Blender 5.0 release** | New C++ FBX importer default; Collada removed; Geometry Attribute constraint; adaptive subdivision & Cycles sampling improvements | Nov 18, 2025 | Faster asset I/O in pipelines |
| **Blender Extensions platform** | 900+ free add-ons/themes; online stock-asset library announced for 2026 | Ongoing | One-click extension updates; scripted installs possible |
| **Headless `bpy` (long-standing, newly validated)** | `blender --background --python script.py`; OpenAI's GPT-6 "Astra" arch-viz demo (Sep 2026) built scenes exactly this way — *programmatic actuation, visual verification* (Computer Use only to inspect renders) | Pattern of 2026 | The vendor-endorsed agent pattern: code execution over GUI clicking |

**Official stance worth quoting:** Blender's AI policy (May 1, 2026): *"No generative AI functionality is currently available or planned to be integrated in Blender"* and *"Blender does not have any built-in functionality for connecting to LLMs"* — the MCP server is deliberately a neutral bridge. Its page warns the server **"will execute LLM generated code in Blender without any guards"** and recommends a VM or a machine without sensitive data.

### 2.2 FOSS / community

| Tool | License / scale | Highlights | Notes |
|---|---|---|---|
| **blender-mcp (ahujasid) / "MCP for Blender"** | MIT; ~28k★ | Socket server inside Blender (port 9876) bridged to MCP; **asset integrations: Poly Haven, Sketchfab, Poly Pizza, Hyper3D Rodin, Hunyuan3D**; arbitrary Python execution; works with Blender 3.0+, documented Codex/Claude/Cursor/VS Code clients | Opt-in `BLENDER_MCP_SAFE_MODE=1`; README: "ALWAYS save your work before using it" |
| **ViperMesh** | Open source | LangChain v1 agent with **22 native tools** and a ReAct loop with hallucination recovery for autonomous modeling | Newer entrant, 2026 |
| **StableGen** | Open source add-on | Runs **TRELLIS.2** text-to-3D / image-to-3D *inside* Blender, up to 1536 Cascade resolution, multi-view consistency | Bridges open 3D-gen models into the DCC |
| **Mixar** | Custom **fork of Blender 5.0** | Ships "Mixie" in-app conversational agent + layer-based AI texture painting | Fork (not add-on) — consider maintenance implications |
| **Hermes Blender MCP** | FOSS connector | Lets Nous Research's Hermes agent control Blender end-to-end from one prompt, self-screenshotting to iterate | Part of a broader agent OS; free |
| **BlenderGPT** | Open source | The pioneering ChatGPT→bpy add-on | **Largely unmaintained; search interest down ~71% YoY** — listed for completeness, use MCP options instead |

### 2.3 Commercial / third-party

| Tool | Model | Highlights |
|---|---|---|
| **Anthropic Claude Blender connector** | Any Claude plan incl. Free (Apr 28, 2026, "Claude for Creative Work") | Claude Desktop install of Blender's own MCP server; Anthropic became a Blender corporate patron |
| **3D-Agent** | Subscription desktop app (macOS/Windows); Blender 4.2+ | No MCP setup / no API key needed; works on your open scene; topology-rework tools; **Ultra plan exposes its own MCP server so Claude Code/Cursor/Codex can hand whole tasks to it** |
| **BlendAI** ($19.95 one-time) / **Blender AI Assistant** ($6.30) | Cheap add-ons | Lighter chat/script helpers — budget options |
| **Dream Textures / AI Material Factory** | Add-ons | Stable-Diffusion texture/material generation inside Blender — complementary to an MCP orchestrator (a common 2026 pattern: MCP agent sets scene + applies textures; add-on generates them) |

**2026 meta-pattern (worth internalizing):** vendors and engine projects converge on "if an app exposes an API/MCP/plugin, use it; use pixels only when you must *see*." Grounding is nearly solved, long-horizon GUI control is not (OSWorld 2.0 ≈ 72.6% partial success, ~40 min/task) — so programmatic `bpy`/MCP is the recommended control channel for custom agents.

---

## 3. Unreal Engine

### 3.1 Official ecosystem

| Tool | What it is | Window / status | Automation surface |
|---|---|---|---|
| **Unreal MCP plugin (experimental)** | First-party MCP server embedded in the Editor process: Blueprints, assets, levels, materials, meshes exposed as tools; enable via Plugin Browser → "Unreal MCP"; **Auto Start Server** binds `http://127.0.0.1:8000/mcp`; `ModelContextProtocol.GenerateClientConfig All` writes `.mcp.json` | Shipped with **UE 5.8, June 17, 2026** (Unreal Fest); Toolset Registry dependency auto-enabled | Documented clients: Claude Code, Cursor, MCP Inspector, VS Code, Gemini, Codex. Localhost only, no auth — not for remote/multi-user |
| **UE6 direction** | Epic (State of Unreal 2026): UE6 development pipeline includes an **MCP layer with Claude/Gemini integrations**, LLMs optional | UE6 Early Access targeted **late 2027** | Strategic signal: MCP is Epic's chosen agent interface |
| **MetaHuman 5.8** | **Mesh-to-MetaHuman for arbitrary topology** (any scanned/sculpted human mesh → fully rigged MetaHuman); **markerless single-webcam mocap** (body + face); MetaHuman Collections for auto-scaling crowds | UE 5.8, Jun 2026 | Major content-automation win for character pipelines |
| **Horde + BuildGraph + UBA** | Epic's distributed build/CI platform (server + agents, Perforce-integrated), **BuildGraph** XML scripting, **Unreal Build Accelerator** for distributed/cached compilation | Mature; heavily documented through 2025–2026 (UE 5.4+) | The studio-grade CI backbone |
| **UAT / BuildCookRun / Gauntlet** | Unreal Automation Tool (`RunUAT BuildCookRun -RunAutomationTests`), Gauntlet test framework, Commandlets, Unreal Build Tool | Long-standing, current | Headless cook/build/test CLI surface |
| **Unreal Python API** | Full editor scripting | Long-standing, current | Batch asset ops, pipeline scripting |

**Honest limit (Puget Systems hands-on, July 2026):** the 5.8 MCP plugin is genuinely Experimental — "some systems were accessible, others were not." It discovers your project one tool call at a time rather than holding whole-project context.

### 3.2 FOSS / community

| Tool | License | Highlights |
|---|---|---|
| **UET (Redpoint Games)** | FOSS (C#) | "Unreal Engine Tool" CLI: easy build/test of projects & plugins, **BuildGraph distribution, remote automation-test execution on devices and across machines, fault tolerance, auto-retries**. Actively maintained (2026); JSON schema repo for `BuildConfig.json` |
| **unrealcontainers (Adam Rehn)** | FOSS | Build your own UE Docker images (30 GB+) for CI — the standard path to containerized Unreal builds; recommended by GameCI docs |
| **Community Unreal MCP servers** (StraySpark Unreal MCP Server, Monolith, UEBridgeMCP, ue5-python Blueprint servers, etc.) | Mostly MIT | Predate and exceed the official plugin: read/write editor control, batch processing, cross-app bridging; Python-based Blueprint editing servers (graphs, variables, functions, components) |
| **UnrealClaude (Natfii)** | Open source | Claude Code CLI integration for UE 5.7 with built-in UE docs context, directly in the editor |

### 3.3 Commercial / third-party

| Tool | What it is | Positioning |
|---|---|---|
| **Aura AI Assistant** | Proprietary, deeply integrated UE assistant | Launched **Jan 2026**; conversation/explanation/code-gen strength |
| **Ludus AI** | In-editor project-aware assistant (UE 5.4–5.8) | Synthesizes the whole project every ~5 s to hold full context before generating — directly addresses the official plugin's context ceiling; reads Blueprints & C++ natively |
| **UnrealCopilot** | In-editor coding copilot | Complements MCP tooling for C++ work |
| **Tencent GIGA** | Full-pipeline proprietary AI tech (gamescom 2026 debut) | Signal that large publishers are building private equivalents |

**Consensus guidance from 2026 comparisons:** use the built-in/MCP bridge to *do* things (batch ops, Blueprint edits, automation tests), an assistant like Aura/Ludus to *understand* things, and don't force one tool into the other's role.

---

## 4. Godot

### 4.1 Official ecosystem

| Tool | What it is | Window / status | Automation surface |
|---|---|---|---|
| **Headless CLI export & validation** | `godot --headless --export-release`, `--check-only --script <file>.gd` for syntax validation without opening the editor | Long-standing; materially improved this window | The backbone of Godot CI and agent loops |
| **Godot 4.5** | **Shader baker** (faster load/export), screen-reader accessibility, foveated rendering on mobile | Sep 15, 2025 | Export-pipeline improvements |
| **Godot 4.6** | **Jolt Physics default**, **LibGodot** (embed the engine as a library in other apps — Linux/Windows/macOS), IK framework return (IKModifier3D), SSR rewrite, Modern editor theme | Jan 26, 2026 | LibGodot = embed Godot inside custom tooling/automation hosts |
| **Godot 4.7** | HDR output, Vulkan ray-tracing groundwork, **AwaitTweener**, **selective export-template downloads** (stop pulling 600 MB of unneeded platforms), DrawableTexture2D, shader inline previews, VirtualJoystick | Stable **Jun 18, 2026** | CI-friendlier template management |
| **Godot Asset Store / AssetLib** | Distribution channel that now carries the AI/MCP plugins below | Newer store path live 2026 | One-click install of agent bridges |

Godot ships **no first-party AI assistant or MCP server** (its features page lists none) — the ecosystem below fills the gap.

### 4.2 FOSS / community (the richest MCP ecosystem of any engine)

| Tool | License / price | Godot | Highlights | Verified version/date |
|---|---|---|---|---|
| **Godot AI (hi-godot / "dlight")** | Free, MIT plugin + `uv` Python server | 4.5+ (4.7+ rec.) | ~43 tools / 120+ ops: scene/node/script edits, runs game, reads errors; dock auto-configures Cursor/Claude Code; telemetry opt-out via `GODOT_AI_DISABLE_TELEMETRY` | v3.0.6 Jul 24, 2026; v3.2.1 Aug 27, 2026 |
| **Gamedev AI (Fredarts)** | MIT, free | 4.6+ | Drag nodes into chat; Add Node/Set Property tools; **Watch Mode auto-fixes Output-window errors**; Gemini/OpenAI/OpenRouter/NIM/Ollama | Repo pushed Sep 22, 2026 |
| **Fennara** | MIT, free | 4.5+ | Chat dock **and** MCP bridge (Codex/Claude/Cursor/Gemini/Antigravity); scene tree, runtime errors, stack traces, screenshots; BYO keys incl. local Ollama/LM Studio | v0.4.3, Sep 12, 2026 |
| **AI Assistant Hub** | MIT, free | 4.x | Agent tools on **Ollama/llama.cpp** — the fully local route | 2026 |
| **tomyud Godot MCP** | MIT, free | 4.x | Tree/errors/run/input/viewport screenshots; **writes to disk not live tree — use its `mcp_undo`** (Ctrl+Z won't reach AI changes) | v0.6.0, Aug 24, 2026 |
| **Coding-Solo godot-mcp** | MIT, free; 5.8k★ | CLI-driven | **No editor plugin** — drives the Godot command line: `run_project`, `get_debug_output`; works with editor closed (great for CI-style agents) | Last push Apr 16, 2026 |
| **KeeVeeG godot-mcp** | MIT, free | 4.x | Tree, run game, **input replay** | 2026 |
| **Copilot plugin (lrdcxdes)** | MIT (Copilot subscription separate, Free tier OK) | 4.6 README | Ghost-text autocomplete in Godot's own script editor for .gd/.cs/.glsl | v2.1.0, Feb 2026 |

### 4.3 Commercial / third-party

| Tool | Price | Highlights |
|---|---|---|
| **Ziva** | Hobby free (BYO Claude Code/Codex sub or local model); Basic $20/mo; Pro $50/mo | In-editor agent: scenes, nodes, scripts, signals, GDScript/C#, doc search, error reading, **runs tests and plays the game turn-by-turn, every turn undoable**; `generate_image` (RetroDiffusion/ChatGPT backends); **runs as a local MCP server** for Claude Code/Codex/Cursor; Pro adds a **Playtest Agent that plays a whole game** |
| **Godot MCP Pro (youichi-uda)** | $15 one-time | "Over 160 tools" (its own pages disagree on the count); input simulation, editor+game screenshots; GDScript plugin open, Node server paid-only |
| **GDAI MCP (Delano Lourenco)** | $19 one-time, binary-only | Tree, errors, play/stop with screenshots; Claude/Cursor/Windsurf/Copilot/Zed. v0.3.3, Sep 7, 2026 |
| **Beckett (beckettlab)** | Lite free (MIT); Full $15 one-time | Single GDScript plugin, **no Node.js**; Full adds playtest input + assertions; input reaches the action system. v1.15.2, Sep 19, 2026 |
| **JetBrains Rider** | Free non-commercial; $169/yr commercial | Full C# IDE for Godot; AI Free tier included |

**Caveats surfaced in deep-dive:** tool-count marketing ("162 tools!") doesn't correlate with better agent outcomes (a focused 50-tool agent often beats a distracted 162-tool one); LLM-generated summaries of these tools were found to contain factual errors traceable to competitor blogs — verify against each tool's own docs.

---

## 5. Phaser

### 5.1 Official ecosystem

| Tool | What it is | Window / status | Automation surface |
|---|---|---|---|
| **Phaser 4.0 "Caladan"** | Ground-up **WebGL2 renderer rewrite**, node-based architecture, **unified Filters system** (works on any object/camera, stackable: Glow, Blur, ImageLight, Blend, GradientMap, Quantize, Mask…), GPU sprite/tilemap layers (1M+ sprites), simplified lighting | **April 2026**; 4.2.0 "Giedi" Jun 19, 2026; 4.2.1 Jul 2026 | Most Phaser 3 code ports with minimal changes; custom WebGL pipelines need rework |
| **Phaser Editor v5** | Visual IDE: full Phaser 4 support (visual filter editing, Mask filter, Spine 4.2 with event preview), **new AI integration system**, enterprise workflow features; Phaser 3 compatibility retained | Beta Feb 18, 2026; **full release May 1, 2026** | GUI + AI-assisted scene authoring |
| **Phaser Game Agent + Game Agent MCP server** | Cloud workspace agent that builds complete games (code + art + music) from a description, publishes a preview URL; **MCP server connects it to Claude Code, Cursor, Copilot, Codex, Gemini CLI, Windsurf** via a one-command setup prompt | Announced **Jul 8, 2026** | Setup free; **build time billed from $0.01/minute**; exports Web/Windows/macOS/Linux |
| **Phaser AE** | Separate **agent-oriented engine** with a verb-based API "designed for AI reasoning" (distinct from Phaser 4, which remains the human-authored open-source framework) | v2.6 in 2026 coverage | Signal: an engine variant designed *for* agents, not just *with* agents |
| **Game Agent Box3D / Spine Mesh2D** | Prompt-driven 3D physics (Box3D) in Game Agent; Spine 4.3 Mesh2D renderer in Phaser 4 | 2026 | Content-pipeline automation |

**Context:** Phaser 3 topped out at **3.90.0 (May 2025)** — just outside the window but relevant since many production projects remain on it; the FAQ position is "new projects → Phaser 4."

### 5.2 FOSS / community

- **phaserjs/phaser** remains MIT, ~40k★, active. Because Phaser games are plain JS/TS, **generic coding agents (Claude Code, Cursor, Codex, Copilot) are first-class automation tools** — no bridge required for repo-level work; the Game Agent MCP covers the cloud build/publish loop.
- **Vite-based templates** (`npm install phaser@latest`) keep the build chain scriptable end-to-end — the most CLI-friendly engine in this report by default.

### 5.3 Commercial / third-party

| Tool | What it is | Notes |
|---|---|---|
| **Sorceress WizardGenie** | Browser/desktop agent that scaffolds Phaser 4.2 / Three.js projects (Planner+Executor model split) | $49 lifetime + your own API key; sibling tools (Auto-Sprite, Tileset Forge, Music Gen) feed the asset side |
| **SpriteCook** | AI 2D/pixel art generator with **engine-ready export presets for Phaser** (also Unity/Godot/GameMaker) + MCP/skills | Free tier 40 credits/30 days; from $8/mo |

---

## 6. Construct 3

### 6.1 Official ecosystem (Scirra)

| Tool / release | What it is | Date | Automation relevance |
|---|---|---|---|
| **r498 beta** | **New 3D light plugin**; 3D model updates | Aug 11, 2026 | 3D pipeline maturation |
| **r479 beta** | **3D editor preview in Layout View**; big Construct Game Services update; **single-file Windows exports** | Mar 31, 2026 | Simplified distribution builds |
| **r469 beta** | **3D model plugin**; import 3D models via Project Bar; dynamic sampling | Jan 20, 2026 | 3D asset ingestion |
| **r442 beta** | New in-editor **Asset Browser** | Jun 3, 2025 | Asset management |
| **r433 beta** | **TypeScript coding in the editor**; Monaco improvements; debugger improvements | Apr 1, 2025 | Full-TS scripting surface for automation-style code |
| **r428 beta** | **Monaco code editor** (the VS Code editor engine) built in | Feb 25, 2025 | Modern scripting UX |
| **Addon SDK v2** | New addon architecture; **SDK v1 support dropped June 2025** | 2025 | Third-party addons must be v2 to run on current releases |
| **Construct Game Services plugin** | First-party services (Arcade scores etc.) | r437+, updated r479 | Live-ops hooks |

### 6.2 FOSS / community & 6.3 Commercial

- **There is no official Construct 3 MCP server, headless CLI, or external automation API as of October 2026.** An official MCP server is an **open forum request** (Feb 2026), with users explicitly asking Scirra for a bridge for Claude Code / Copilot / Gemini CLI.
- What practitioners actually do today (forum-verified): point **Claude Code or similar agents at the project folder** — Construct projects are JSON/text (`.c3proj`, event-sheet JSON), so repo-level agents can read and modify project files directly, then open the project in the editor to verify. This is workable but lacks the live-tree/error feedback that MCP bridges give other engines.
- The built-in **JavaScript/TypeScript scripting** (Monaco) is the sanctioned in-product automation route.
- Rich third-party addon marketplace exists (SDK v2), but addons extend *runtime/editor features*, not external control.

**Bottom line for an agent-control roadmap:** Construct 3 is currently the weakest of the six for programmatic control — file-level agent editing + in-editor scripting are the only routes; an official MCP/CLI is the thing to watch.

---

## 7. Cross-Engine Pipelines

### 7.1 3D asset generation (text/image → mesh, engine-ready)

| Tool | Open/hosted | Standout | Engine integration | Licensing note |
|---|---|---|---|---|
| **Meshy (6/7)** | Hosted; ~15 s/gen | Best all-round: auto-rig, PBR, low-poly mode, **plugins for Blender/Unity/Unreal**, API + MCP | Native plugins + GLB/FBX | Free tier CC BY (attribution); Pro from $20/mo owns outputs |
| **Tripo (H3.1)** | Hosted; fastest (~10 s) | Rapid iteration; Smart Mesh P2.0; segmentation/retopo/rigging workflow; quadruped rigs | GLB/FBX export; versioned API | Paid tier for commercial |
| **Rodin Gen-2.5 (Hyper3D)** | Hosted | Sculpt-level hero detail; quad/triangle control; multi-view input | GLB/FBX/OBJ/USDZ/STL; **integrated into ahujasid blender-mcp** | Check plan rights |
| **Hunyuan3D (2.1 / 3.x, Tencent)** | **Open source, local** | Full control, no data leaves your GPU; 10–29 GB VRAM | GLB; convert after inspection; also in blender-mcp | Commercial OK **except EU/UK/South Korea** |
| **TRELLIS.2 (Microsoft)** | **Open source (Apache 2.0/MIT-ish), ~3 s/gen** | Top open pick; runs inside Blender via **StableGen** | GLB | Permissive |
| **Sloyd** | Hosted + API | Parametric hard-surface props/buildings; clean topology; game-asset-first | Engine plugins/API | Commercial on paid |
| **Luma Genie** | Hosted | Best free starting point | GLB | Free tier limits |
| **Wireflow** | Hosted node canvas | Hunyuan3D v3/Meshy/Tripo/TRELLIS.2/Rodin as **nodes; every workflow is a REST endpoint and MCP tool** | API/MCP | From $24/mo |
| **Autodesk Wonder 3D** | Flow Studio | Text/image→3D inside a Maya/3ds Max production workflow | DCC-native | Subscription |
| **UniRig** | **Open (MIT)** | Auto-rigging step for generated characters | Pipeline stage | Permissive |
| **Roblox Cube (context)** | Platform | 60,000+ 3D assets/day generated by creators; ~1,400 games use Cube content daily (Q2 2026 earnings) | Roblox-only | Platform terms |

**Practical consensus across 2026 comparisons:** AI meshes arrive with rough topology — plan **retopo/UV finish in Blender/ZBrush**; for indie/mobile props the "generated base + manual finish" gap is effectively closed; hero AAA characters still need manual work.

### 7.2 2D asset generation (sprites, textures, UI)

| Tool | Standout | Agent/API surface | Entry price |
|---|---|---|---|
| **Scenario** | Custom **LoRA training on your art bible** → on-brand consistency; 550+ models; node workflow builder; hosts RetroDiffusion animation models | **Official MCP, REST API, Unity integration** | $15/mo (training from $45/mo) |
| **Layer.ai** | Studio-scale batch 2D generation; commercial license on **every** tier | API, MCP | From $10/mo |
| **PixelLab** | Deepest pixel-art specialist: skeleton animation, 4/8-dir rotations, tilesets, **Aseprite extension** | MCP, API | $12/mo |
| **Retro Diffusion** | Purpose-trained pixel models; Aseprite extension; RD Animation (walk/run/idle sheets) | API (also hosted on Scenario) | Pay-as-you-go; Aseprite $20–65 |
| **Ludo** | All-in-one: sprites, 3D, audio, video; 12 animatable asset types, 641 motion presets | MCP covering full stack | $20/mo |
| **SpriteCook** | Pixel + HD art; **engine-ready exports (Unity/Godot/Phaser/GameMaker)** | API, MCP/skills | Free tier; from $8/mo |
| **FLUX.2 klein 4B / Qwen-Image / SD 3.5** | Open-weight image models for textures/concept (self-host) | Local pipelines | Free (check each license; SD3.5 free under $1M revenue) |

**MCP is now table stakes in this category** — Ludo, Scenario, Meshy, PixelLab, Layer, Leonardo, Recraft and ElevenLabs all ship official MCP servers (verified Sep 2026), so one custom agent can chain *generate asset → retopo/rig → import to engine → place in scene*.

### 7.3 Audio

| Tool | Notes |
|---|---|
| **ElevenLabs** | SFX + music + voices; official MCP (vendor-hosted OAuth connector shipped Aug 2026); from $6/mo |
| **Stable Audio 3.0** | Open (Small/Medium), free under $1M revenue |
| **ACE-Step 1.5** | Open (MIT) music generation |

### 7.4 CI/CD & build orchestration

| Tool | Engines | Highlights |
|---|---|---|
| **GameCI (+ new game-ci CLI)** | Unity (primary), **Unreal & Godot built-in detection/build commands**, plugin API for more | Docker images, GitHub Actions/GitLab/CircleCI templates; Orchestrator for AWS/K8s/local-docker; standalone binary (no Node) |
| **Horde / BuildGraph / UBA** | Unreal | Epic's own distributed CI; presubmit tests, packaged builds, remote execution |
| **UET** | Unreal | FOSS CLI wrapping UAT/BuildGraph with retries & device farms |
| **barichello/godot-ci, firebelley/godot-export** | Godot | Community Docker image & GitHub-Actions-native export workflows (endorsed in GameCI FAQ) |
| **AutomaticUnityBuilds** | Unity | Your-hardware build farm with itch.io auto-deploy |
| **Phaser toolchain** | Phaser | Native npm/Vite — the most conventional CI story of the six |
| **Unity Test Framework / Unreal Automation Framework (`RunUAT BuildCookRun -RunAutomationTests`) / `godot --headless`** | Respective | The per-engine headless test entry points to wire into any of the above |

Game-CI-specific practices (Semaphore 2026 guide, worth adopting): Git LFS or external asset storage; cache Unity `Library/` and Unreal DDC; parallelize per-platform builds; split fast checks vs. full builds.

### 7.5 AI QA & playtesting (the newest category)

| Tool | Approach | Status |
|---|---|---|
| **Razer QA Companion-AI** | **Vision-based, zero-integration**: watches frames, detects graphical/animation/physics bugs, **generates test cases from GDDs** | Debuted GDC 2026; enterprise via AWS Marketplace |
| **nunu.ai** | Multimodal agents that see and interact with 3D environments like humans | YC-backed ($6M); studio pricing |
| **ManaMind** | API-connected agents; thousands of simulated sessions for **difficulty/balance validation** | €1.2M pre-seed (Jun 2026) |
| **NodeMori BugHunter** | Autonomous overnight play with **reproducible bug packages** (video + input logs + replay steps); Scout Mode for behavior intel | GDC 2026 exhibitor; B2B SaaS w/ indie tier |
| **Regression Games** | Scenario replay vs. baselines for live-game regression | Commercial |
| **PlaytestCloud** | Real players + LLM-analyzed recordings (48 h turnaround) | Commercial |
| **GameBench / Appium + AltTester** | Cross-device performance metrics; free open-source mobile UI test stack | Free → enterprise |
| **Google Cloud AI playtesting** | Vertex-AI-based playthrough agents (GDC 2026 announcement); survey claims 47% of devs already use AI for playtesting/balancing | Cloud service |
| **Roblox Creator Agents** | Playtesting / Analytics / Experiment agents rolling out to creators (Q2 2026 earnings) | Platform-only |

---

## 8. UVP Index — tools grouped by Unique Value Proposition

### 8.1 Technical-integration UVPs

| UVP (integration capability) | Tools |
|---|---|
| **First-party MCP editor control** | Unity MCP Server (free, 6.0+); Unreal MCP plugin (5.8, experimental); Blender Lab MCP Server (5.1+); Phaser Game Agent MCP |
| **Community MCP editor control** | MCP for Unity (CoplayDev); Unity-MCP (IvanMurzak); mcp-unity (CoderGamester); Ops-Nation Unity-MCP; ahujasid/blender-mcp; ViperMesh; Godot AI (hi-godot); Fennara; tomyud/KeeVeeG/Coding-Solo godot-mcp; StraySpark/Monolith/UEBridgeMCP (UE) |
| **Headless CLI / batch execution** | Unity CLI (beta) + `-batchmode`; `blender --background --python` (+ MCP `*_for_cli` twins); UAT/BuildCookRun/Commandlets + UET (UE); `godot --headless --export-release`; Phaser npm/Vite chain; GameCI CLI |
| **In-editor agent with live context (no external client needed)** | Unity AI Assistant (Plan Mode, Skills, rollback); Ziva (Godot); Gamedev AI (Godot); Ludus AI (UE); Aura (UE); 3D-Agent (Blender); Phaser Editor v5 AI integration |
| **Agent-skill / knowledge-layer distribution** | Unity plugin for Claude Code (29 skills); Unity Assistant Skills; Ziva skills + AGENTS.md loading; Scenario Skills; Ops-Nation AI Skills |
| **Agent-native engine design** | Phaser AE (verb-based API for agents); LibGodot (embed engine in your own tooling); Mixar (Blender fork w/ agent) |
| **Sandboxed agent execution** | Blender VM guidance; EstebanForge construct-cli (generic agent sandbox: container/microVM isolation, network policies — engine-agnostic but directly relevant to letting agents drive editors); `BLENDER_MCP_SAFE_MODE`; Godot AI telemetry opt-out |
| **Build orchestration / CI backbone** | Horde+BuildGraph+UBA (UE); GameCI (Unity/UE/Godot); UET (UE); godot-ci/godot-export; AutomaticUnityBuilds; Phaser npm CI |
| **Asset-generation-as-API (MCP/REST)** | Meshy, Tripo, Rodin, Wireflow, Scenario, Layer, PixelLab, Ludo, SpriteCook, Leonardo, Recraft, ElevenLabs |
| **Self-hostable / local-model stack** | Hunyuan3D, TRELLIS.2, FLUX.2 klein, Qwen-Image, Stable Audio, ACE-Step (models); AI Assistant Hub + Ollama, Ziva local, blender-mcp + Ollama, Coding-Solo godot-mcp (tooling) |
| **Zero-integration QA (vision-based)** | Razer QA Companion-AI; nunu.ai |
| **Deep-integration QA (API/state-based)** | ManaMind; NodeMori BugHunter; Regression Games; Unity UI Test Framework; AltTester+Appium |

### 8.2 Workflow-outcome UVPs

| UVP (outcome) | Best-fit tools |
|---|---|
| **Rapid prototyping / prompt-to-playable** | Phaser Game Agent; Unity AI Generators; Ziva; Sorceress WizardGenie; Ludo; Summer Engine (Godot-compatible, assets arrive *placed*) |
| **Multi-file code refactoring at repo scale** | Claude Code / Cursor / Codex + engine MCP bridge (any engine except Construct 3, where file-level only) |
| **Automated QA & overnight bug hunting** | NodeMori BugHunter; Razer QA Companion-AI; nunu.ai; Regression Games; Ziva Playtest Agent; GameCI + per-engine test runners |
| **Difficulty & balance validation** | ManaMind; nunu.ai; PlaytestCloud (human layer) |
| **Bulk 3D prop production** | Meshy, Tripo, Sloyd, Hunyuan3D (local bulk), Wireflow pipelines + Blender MCP for retopo/finish |
| **Hero-character production acceleration** | MetaHuman 5.8 (arbitrary topology + webcam mocap); Rodin Gen-2.5; UniRig |
| **On-brand 2D asset families** | Scenario (custom LoRA); PixelLab (pixel); Layer (batch); Retro Diffusion (pixel purists) |
| **Studio build infrastructure** | Horde+Perforce (UE); GameCI+Docker (Unity/Godot); Semaphore-style pipelines |
| **Fully offline / air-gapped automation** | Blender Lab MCP + llama.cpp; Hunyuan3D/TRELLIS.2 local; AI Assistant Hub + Ollama; `godot --headless`; blender-mcp safe mode |
| **Agent-ready web game publishing** | Phaser Game Agent (one-command MCP setup, play-URL output, $0.01/min) |

---

## 9. Open Questions, Disagreements & Unverified Claims

1. **Unreal MCP maturity.** Epic's own hands-on reviewers (Puget Systems, July 2026) report partial system coverage in 5.8. Treat the official plugin as experimental; community servers (Monolith/UEBridgeMCP/StraySpark) currently expose more, at the cost of maintenance risk. Which wins by UE6 is unresolved.
2. **Construct 3 automation.** No official MCP/CLI exists; the forum request (Feb 2026) has no confirmed roadmap response found in this research. File-level agent editing is a workaround, not parity.
3. **Unity MCP "free" scope.** Free as of July 2026 per Unity's AI FAQ; older guides still claim a subscription is required — those are stale. The *Assistant* remains paid. Watch for packaging changes when Open Beta ends.
4. **Godot MCP tool counts.** Godot MCP Pro's own pages disagree (162/163/187 tools). Treat counts as marketing; evaluate on workflow fit.
5. **"60% of indie games ship to web/PWA"** (Sorceress) and **"47% of devs use AI for playtesting"** (Google Cloud survey, secondhand) — single-source or vendor-adjacent claims; treat as directional, not verified.
6. **Blender version requirements.** Blender Lab MCP needs **5.1+**; the community ahujasid server works on 3.0+. Several blogs conflate the two.
7. **Pricing volatility.** Every price cited here was current in mid-2026 sources and changes frequently; re-check before procurement.
8. **Security posture is your problem.** Blender's official warning (unguarded code execution → use a VM), localhost-only/no-auth design of Epic's plugin, and telemetry defaults in some Godot bridges mean a custom-agent rollout needs its own sandbox/allowlist policy (see EstebanForge construct-cli for a general-purpose agent sandbox pattern).

---

## 10. Sources

**Unity**
- Game Dev AI Hub, "Claude Code Unity MCP Setup: 3 Routes Compared (2026)" — https://gamedevaihub.com/claude-code-unity-mcp-setup/ (Sep 26, 2026)
- Unity Discussions, "Unity AI's Open Beta Now Live for Unity 6" — https://discussions.unity.com/t/unity-ai-s-open-beta-now-live-for-unity-6/1718560 (May 2026)
- Unity Discussions, "Unity AI Beta 2026 is here!" — https://discussions.unity.com/t/unity-ai-beta-2026-is-here/1703625 (Jan 2026)
- Unity Docs, "New in Unity 6.3 LTS" — https://docs.unity3d.com/6000.7/Documentation/Manual/WhatsNewUnity63.html
- Unity Hub Release Notes — https://unity.com/unity-hub/release-notes (Apr 21, 2026 CLI entry)
- GamineAI, "Unity MCP with Cursor — First Safe Editor Bridge Session 2026" — https://gamineai.com/blog/unity-mcp-with-cursor-first-safe-editor-bridge-session-2026
- Skiln, "Unity MCP Server 2026" — https://skiln.co/blog/unity-mcp-server-guide-2026
- useloadout, "Unity MCP server: control the Unity Editor from Claude" — https://useloadout.com/blog/unity-mcp-server-setup/
- wsisp / juejin 2026 AI-game-MCP toolchain guides — https://www.wsisp.com/helps/102030.html (Sep 7, 2026)

**Blender**
- lagindicator, "Codex and Blender: the agent isn't clicking — it's running bpy" — https://lagindicator.com/dev-tools/codex-blender-control-2026-09-10/ (Sep 10, 2026)
- lagindicator, "Yes — the incumbents are shipping MCP servers" — https://lagindicator.com/dev-tools/mcp-first-party-adoption-2026-09-10/
- dev.to, "Blender MCP vs 3D-Agent (2026 Update)" — https://dev.to/glglgl/from-blender-mcp-to-3d-agent-... (Sep 2026 update)
- 3d-agent.com, "Blender MCP options in 2026" — https://3d-agent.com/blender-mcp (Sep 25, 2026)
- blendermcp.org, "Best Blender AI Assistants in 2026" — https://blendermcp.org/compare/best-blender-ai-assistant
- Neural4D, "Blender vs Maya for AI 3D Workflows in 2026" — https://blog.neural4d.com/comparisons/blender-vs-maya-ai-3d-workflows/
- Blender 5.1 release page — https://www.blender.org/download/releases/5-1/ ; Blender 5.0 — https://www.blender.org/download/releases/5-0/
- CG Channel, "See the 2026 Blender development roadmap" — https://www.cgchannel.com/2026/02/see-the-2026-blender-development-roadmap/
- StraySpark, "Blender MCP vs Traditional Blender AI Addons" — https://www.strayspark.studio/blog/blender-mcp-vs-ai-addons-comparison-2026

**Unreal Engine**
- ludusengine, "Does Unreal Engine Have a Built-In AI Assistant? (2026)" — https://ludusengine.com/blog/unreal-engine-built-in-ai-assistant (Sep 13, 2026)
- sorceress.games, "Best AI for Unreal Engine Blueprints (2026)" — https://sorceress.games/blog/match-the-best-ai-for-unreal-engine-blueprints-2026
- Puget Systems, "Unreal Engine MCP Hands-On" — https://www.pugetsystems.com/blog/2026/07/09/unreal-engine-mcp-hands-on-testing-ai-inside-the-editor/ (Jul 9, 2026)
- essamamdani, "Unreal Engine 5.8 Lands Today" — https://essamamdani.com/blog/unreal-engine-5-8-experimental-features-game-development-2026
- StraySpark, "Aura vs MCP" / "UE 5.7's Built-In AI Assistant vs. MCP" — https://www.strayspark.studio/blog/
- Epic Dev, "Horde Build Automation Tutorial" — https://dev.epicgames.com/documentation/unreal-engine/horde-build-automation-tutorial-for-unreal-engine
- Redpoint Games UET — https://github.com/redpointgames
- Medium, "Why Unity 6 and Unreal Engine 5 Are Rewriting the Rules" (May 5, 2026)

**Godot**
- Ziva.sh, "Best AI Tools for Godot in 2026: 21 Tools Compared" — https://ziva.sh/blogs/best-ai-tools-for-godot-game-engine (Sep 27, 2026)
- Ziva.sh, "Best AI Coding Assistant for Godot in 2026" — https://ziva.sh/blogs/best-ai-coding-assistant-for-godot (Sep 19, 2026)
- GamineAI, "How to Use Godot AI MCP with Cursor" — https://gamineai.com/blog/how-to-use-godot-ai-mcp-with-cursor-first-safe-editor-session-2026 (Aug 1, 2026)
- Godot Asset Store, "Godot AI" — https://store.godotengine.org/asset/dlight/godot-ai/
- oflight, "Godot 4.5 and 4.6 feature update" — https://www.oflight.co.jp/en/columns/godot-4-5-and-4-6-feature-update-2026
- Ziva.sh, "Godot 4.7: Stable Release Date, HDR & Key Features" — https://ziva.sh/blogs/godot-4-7 (Oct 3, 2026)
- Godot forum, "Godot 4.6 Release" — https://forum.godotengine.org/t/godot-4-6-release-all-about-your-flow/131705

**Phaser**
- Phaser, "Phaser Game Agent MCP setup" — https://phaser.io/news/2026/07/phaser-game-agent-mcp-setup (Jul 8, 2026)
- Phaser, "Phaser Editor v5 Is Here" — https://phaser.io/news/2026/04/phaser-editor-v5-release (May 1, 2026)
- Phaser, "Phaser 3 vs Phaser 4" — https://phaser.io/news/2026/05/phaser-3-vs-phaser-4 (May 13, 2026)
- GitHub, "Phaser v4.0.0 discussion" — https://github.com/phaserjs/phaser/discussions/7274 (Apr 2026)
- GamineAI, "How to Use Phaser Game Agent MCP with Cursor" — https://gamineai.com/blog/how-to-use-phaser-game-agent-mcp-with-cursor-first-browser-game-evening-2026 (Aug 10, 2026)
- GameFromScratch, "Phaser 4 Released" — https://gamefromscratch.com/phaser-4-released/ (Apr 14, 2026)
- Cinevva, "Phaser vs Defold (2026)" — https://app.cinevva.com/guides/phaser-vs-defold

**Construct 3**
- Construct.net, "New Features" release history — https://www.construct.net/en/make-games/new-features-1
- Construct forum, "Construct 3 in the AI agent era" — https://www.construct.net/en/forum/construct-3/general-discussion-7/construct-ai-agent-era-187897 (Feb 2026)
- Construct forum, "AI tool and environment recommendations?" — https://www.construct.net/en/forum/construct-3/general-discussion-7/ai-tool-environment-188235 (May 2026)
- BrashMonkey forum, "Construct 3 Addon SDK support" (SDK v1 deprecation) — https://brashmonkey.com/forum/index.php?/topic/36368-construct-3-addon-sdk-support/

**Cross-engine**
- GameCI CLI — https://github.com/game-ci/cli ; GameCI FAQ — https://game.ci/docs/faq/
- Semaphore, "How to Manage CI/CD for Game Development" — https://semaphore.io/blog/how-to-manage-ci-cd-for-game-development-unity,-unreal,-large-binaries (Jun 29, 2026)
- Unity Discussions, "AutomaticUnityBuilds" — https://discussions.unity.com/t/packaged-all-my-ci-cd-workarounds-for-unity.../1712038 (Mar 2026)
- Pixazo, "Best 3D Model Generation APIs in 2026" — https://www.pixazo.ai/blog/best-closed-source-3d-model-generation-apis (Sep 9, 2026)
- Cinevva, "Best AI Asset Generators for Games (2026)" — https://app.cinevva.com/guides/ai-asset-generators-games (Sep 2026)
- Ludo.ai, "Best AI Tools for Game Assets in 2026" — https://ludo.ai/compare/best-ai-game-asset-generators (Sep 2026)
- focusfuturemagazine, "AI for 3D Asset Generation News 2026" — https://focusfuturemagazine.com/ai-for-3d-asset-generation-news-2026/ (Aug 21, 2026)
- techotakulab, "AI 3D model generator guide 2026" — https://techotakulab.com/ai-3d-model-generator-guide-2026/ (Sep 23, 2026)
- radiancefields, "Tripo AI Alternatives" — https://radiancefields.com/tripo-ai-alternatives
- AIconjured, "Best Game Playtesting & QA Tools" — https://aiconjured.com/ai-game-dev-tools/playtesting-qa/ (Jun 17, 2026)
- galaxy4games, "How Game Development Companies Are Using AI in 2026" — https://galaxy4games.com/en/knowledgebase/blog/...
- Roblox Q2 2026 earnings (SEC) — https://www.sec.gov/Archives/edgar/data/1315098/000162828026051059/ex991-robloxq22026earnin.htm
- EstebanForge/construct-cli (agent sandbox) — https://github.com/EstebanForge/construct-cli
- SpriteCook vs Retro Diffusion — https://www.spritecook.ai/compare/retro-diffusion
- Scenario — https://www.scenario.com/

*Report compiled 2026-10-10. Prices, versions and star counts were captured from sources dated June–October 2026 and drift quickly; verify before committing budget.*


---

<!-- ====================================================================== -->
<!-- FILE: 01_tool-decision-matrix.md -->
<!-- ====================================================================== -->

# Tool Decision Matrix — “Matrix” worksheet

*Scores 1–5 (5 = strongest). Converted from `tool-decision-matrix.xlsx` (Matrix tab); Weighted Score / Rank computed per the workbook’s own formulas (SUMPRODUCT vs `Weights!D6:K6`, normalized by Σweights = 1.00; Excel descending RANK). The 🟥🟧🟨🟩 chip on Weighted Score approximates the workbook’s red-yellow-green conditional color scale (min `#F8696B` → median `#FFEB84` → max `#63BE7B`), bucketed to quartiles.*

| Tool | Category | Editor Control API / MCP | Headless / CLI Execution | Agent-Client Neutrality | Content Pipeline Automation | Test / QA Automation | Cost & License Openness | Maturity & Maintenance | Safety & Governance | Weighted Score | Rank |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Blender Lab MCP Server (official) | Official | 5 | 5 | 5 | 3 | 2 | 5 | 3 | 2 | 🟩 3.90 | 6 |
| blender-mcp (ahujasid) | FOSS community | 5 | 3 | 5 | 5 | 2 | 5 | 5 | 3 | 🟩 4.20 | 1 |
| 3D-Agent | Commercial | 4 | 2 | 3 | 4 | 1 | 2 | 4 | 4 | 🟧 3.10 | 17 |
| Unity MCP Server (official) | Official | 5 | 4 | 5 | 3 | 3 | 5 | 3 | 3 | 🟩 3.95 | 5 |
| Unity AI Assistant | Official | 5 | 2 | 2 | 5 | 3 | 2 | 3 | 4 | 🟨 3.45 | 10 |
| MCP for Unity (CoplayDev) | FOSS community | 5 | 3 | 5 | 3 | 4 | 5 | 5 | 3 | 🟩 4.10 | 3 |
| Unity-MCP (IvanMurzak) | FOSS community | 5 | 4 | 5 | 3 | 4 | 5 | 4 | 3 | 🟩 4.15 | 2 |
| GameCI + game-ci CLI | FOSS community | 1 | 5 | 3 | 2 | 4 | 5 | 5 | 4 | 🟨 3.35 | 11 |
| AutomaticUnityBuilds | Commercial | 1 | 4 | 2 | 1 | 3 | 3 | 3 | 3 | 🟥 2.35 | 22 |
| Unreal MCP plugin (official, experimental) | Official | 4 | 2 | 5 | 3 | 3 | 5 | 2 | 2 | 🟨 3.25 | 15 |
| Community UE MCP servers (Monolith/StraySpark/UEBridgeMCP) | FOSS community | 4 | 3 | 5 | 3 | 3 | 5 | 3 | 3 | 🟨 3.60 | 9 |
| UET (Redpoint) | FOSS community | 1 | 5 | 3 | 2 | 5 | 5 | 4 | 4 | 🟨 3.35 | 11 |
| Horde + BuildGraph + UBA | Official | 1 | 5 | 2 | 2 | 4 | 4 | 4 | 4 | 🟧 3.05 | 18 |
| Ludus AI | Commercial | 4 | 1 | 2 | 3 | 2 | 2 | 3 | 3 | 🟥 2.60 | 21 |
| Godot AI (hi-godot) | FOSS community | 5 | 3 | 5 | 3 | 4 | 5 | 4 | 3 | 🟩 4.00 | 4 |
| Ziva | Commercial | 5 | 2 | 4 | 4 | 5 | 3 | 3 | 4 | 🟩 3.80 | 7 |
| Coding-Solo godot-mcp | FOSS community | 2 | 5 | 5 | 1 | 4 | 5 | 3 | 3 | 🟨 3.30 | 14 |
| Godot headless CLI + godot-export/CI | Official + FOSS | 1 | 5 | 3 | 2 | 3 | 5 | 4 | 4 | 🟧 3.15 | 16 |
| Phaser Game Agent + MCP | Official | 4 | 4 | 5 | 5 | 3 | 2 | 3 | 3 | 🟩 3.75 | 8 |
| Phaser 4 + Editor v5 AI integration | Official | 3 | 4 | 4 | 3 | 2 | 4 | 4 | 3 | 🟨 3.35 | 11 |
| Construct 3 (TS scripting + file-level agents) | Official | 2 | 1 | 3 | 2 | 1 | 3 | 4 | 3 | 🟥 2.25 | 24 |
| Meshy | Commercial | 1 | 4 | 4 | 5 | 1 | 3 | 4 | 3 | 🟧 3.05 | 18 |
| Scenario | Commercial | 1 | 4 | 4 | 5 | 1 | 3 | 4 | 3 | 🟧 3.05 | 18 |
| AI playtesting platforms (nunu.ai / NodeMori / ManaMind / Razer QA-AI) | Commercial | 1 | 3 | 2 | 1 | 5 | 2 | 3 | 3 | 🟥 2.30 | 23 |

**Score legend:** 1 = poor / absent, 3 = adequate, 5 = best-in-class. Assessments per the 2026-10-10 roundup report; verify against vendor docs before procurement.

**Criterion weights** (`Weights!D6:K6`): Editor Control API / MCP = 0.2 · Headless / CLI Execution = 0.15 · Agent-Client Neutrality = 0.1 · Content Pipeline Automation = 0.15 · Test / QA Automation = 0.1 · Cost & License Openness = 0.1 · Maturity & Maintenance = 0.1 · Safety & Governance = 0.1.

*Workbook colors not carried over: navy header fill `#2F5597` and gray row banding `#F2F2F2` are styling-only (markdown tables zebra-stripe themselves), and the blue input-font coding marks editable cells, which a static export doesn’t have.*

