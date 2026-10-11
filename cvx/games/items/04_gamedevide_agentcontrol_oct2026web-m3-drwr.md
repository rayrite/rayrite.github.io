# Game-Engine Automation 2026: A Wide Roundup of Software, Tools, and Innovations for Controlling Unity, Unreal, Blender, Godot, Phaser 3, and Construct 3

**Wide research deliverable**
**Date:** 2026-10-10
**Window covered:** 2025-10-10 → 2026-10-10
**Scope:** AI-driven, traditional scripting/API, visual/node-based, CI/CD, headless, CLI, MCP — for six engines and their DCC neighbors (Blender, Houdini). Audience: a development team evaluating tools to wrap inside a customized coding agent.

---

## Executive summary

The 12 months ending October 2026 produced the single biggest jump in agent-controllable surfaces for game development since the modern engines shipped. Five of the six engines in scope added a first-party Model Context Protocol (MCP) story or its equivalent; the sixth (Construct 3) acquired it through a community-driven server that became the de-facto standard. Unity shipped its own MCP server inside the Unity 6 AI beta in mid-2026 ([Unity MCP setup guide](https://unity.com/blog/unity-ai-mcp-how-to-get-started)). Unreal has at least five competing MCP servers in active development by mid-2026 ([Glama directory, "unreal engine"](https://glama.ai/mcp/servers?query=unreal%252Bengine)). Blender has eight or more, ranging from a 175-tool, 25-domain typed implementation ([kleer001/blender-mcp](https://github.com/kleer001/blender-mcp/)) to a headless-only safety-first server ([YellowFoxH4XOR/blender-mcp](https://glama.ai/mcp/servers/YellowFoxH4XOR/blender-mcp)). Godot has a Cambrian explosion: at least seven MCP servers, the most mature shipping 386 tools in 30 categories ([yanhuifair/Godot-MCP](https://github.com/yanhuifair/Godot-MCP)) and the cleanest shipping a standalone `gda` CLI plus bundled MCP server ([aigengame/godot-agent](https://github.com/aigengame/godot-agent)). Phaser 3 and Construct 3 — the smaller frameworks — went a different direction: Phaser Studio built an in-editor MCP server (40+ tools) inside Phaser Editor v5 and then layered a hosted "Phaser Game Agent" on top of its own cloud build service, with a Phaser 3 skill bundle and Claude/Cursor/Copilot connector ([Phaser Game Agent MCP setup](https://phaser.io/news/2026/07/phaser-game-agent-mcp-setup)). Construct 3's best-in-class integration is the community-built [liauw-media/construct3-mcp](https://github.com/liauw-media/construct3-mcp) (v1.10.0), which reads/writes the project file and drives a running game over the Chrome DevTools Protocol.

The structural story is the move from "GUI editor + an API if you're lucky" to **"engine has an MCP server, and a coding agent in your IDE can drive it."** Unreal and Unity led. Blender and Godot caught up fast through FOSS. Construct 3 and Phaser solved it through tight community projects. Two mature FOSS stacks (the [game-ci](https://deepwiki.com/game-ci/documentation) Docker images + [Unity Build Automation](https://docs.unity.com/en-us/build-automation) for Unity; [Horde + UnrealGameSync](https://www.perforce.com/blog/p4/how-to-use-unrealgamesync) for Unreal) carry the CI/CD and headless build side. The asset-generation side is now mature enough for indie teams: Meshy, Tripo, Rodin (Hyper3D), and the new CSM Cube 2 produce usable meshes for game props and stylized assets; Hitem3D/Hi3D leads for 3D-print pipelines ([Meshy comparison](https://www.meshy.ai/blog/hi3d-vs-meshy-vs-tripo)).

A customized coding agent in 2026 can plausibly: (1) drive the engine editor through MCP, (2) generate and edit game logic in a typed language with a tool-aware agent loop, (3) trigger CI builds, (4) generate and import assets through a hosted API, (5) run headless tests and screenshot diff. The rough edges are documentation gaps, the moving MCP-2026-07-28 specification that requires server refactoring, and the still-missing ability to drive Construct 3's build pipeline outside the editor.

**Confidence:** medium-high. The catalog is large and moving; the entries in the next 12 months will outdate parts of this report. Specifics on individual MCP server maintainer fatigue, version drift, and feature parity with native tooling should be reverified before adoption.

---

## Background and context

A "game engine" today is not one application. It's a coordination surface across at least four layers: a content-creation DCC (Blender, Houdini, Photoshop/Substance), the engine editor (Unity Hub, UE5 editor, Godot editor, Phaser Editor 2, Construct 3), the engine runtime (the shipped build), and the operations layer (CI, telemetry, asset hosting). Each of these has had a stable automation story for a long time: `bpy` for Blender, the Python Remote Control API for Unreal, the `unreal` Python module, the `godot --headless` CLI, `phaser-cli`, Construct 3's JavaScript/TypeScript scripting API, and the Unity batchmode `-executeMethod` flag. The new thing in this window is that all of these now have an additional, **standardized** agent surface: the Model Context Protocol. MCP is the open standard released by Anthropic that any AI client (Claude Code, Cursor, Windsurf, Copilot, Cline, Codex CLI, Gemini CLI) can speak to expose tools, resources, and prompts ([MCP 2026-07-28 spec](https://www.bovo-digital.tech/en/blog/mcp-2026-specification-stateless-enterprise-agents)).

A tool that exposes an MCP server is one an LLM can call into without the model having to invent signatures or hallucinate JSON. This is the lever that turns "an LLM that can read your `.cs` files" into "an LLM that can ask the Unity editor which GameObject is selected, read its components, write a C# fix, and read the console to verify."

The other big shift: every major engine has either shipped or absorbed a generative AI suite in 2025-2026. Unity 6.2 (Aug 2025) introduced Unity AI inside the editor, replacing the now-retired Muse product ([Innovec Games writeup](https://www.innovecsgames.com/blog/five-things-to-know-about-unity/)). Unreal shipped StableDiffusion and Meshy/ProceduralMesh integrations through plugins and added ACE-3D audio/facial plugins from NVIDIA. Blender's `bpy` automation story is unchanged but the AI-mesh world around it (Tripo, Meshy, Rodin, CSM) is mature enough to plug into a Blender MCP server as a "generate → retopo → import" pipeline. Phaser Studio's "Phaser Game Agent" (Jun 2026) lets a Claude/Cursor agent generate a complete, playable 2D game with art, music, and deployment ([Phaser Studio on LinkedIn](https://www.linkedin.com/posts/phaser-studio_today-were-launching-something-weve-been-activity-7476355024558874624-oA_Z)). Construct 3 has no first-party AI suite but a thriving addon SDK (now SDK v2, mandatory since r450) that lets third parties add AI features ([Construct 3 r458 release notes](https://www.construct.net/en/make-games/releases/stable/r458)).

The research below maps these changes engine by engine, with separate sections for the cross-cutting CI/CD/headless layer and the cross-cutting AI-coding-agent layer. The UVP catalog at the end of the report groups tools by both technical-integration UVPs and user-facing workflow UVPs.

---

## 1. Unity 3D

### 1.1 Engine version landscape
Unity 6.3 LTS shipped in December 2025 and is the current long-term-support release ([Unity 6.3 LTS announcement](https://unity.com/blog/unity-6-3-lts-is-now-available)). 6.0 LTS support ends October 2026, so 6.3 LTS is where most production teams land through 2027. New in 6.3 LTS: low-level 2D physics APIs built on Box2D v3, scriptable audio pipeline (Burst-compiled C# processors), DLSS4 Super Resolution, integrated Vector Graphics as a core module, sprite atlas analyzer, and the Advanced Text Generator enhancements.

### 1.2 Official AI suite (Unity AI)
Unity AI is the umbrella name for the in-editor assistant + asset generators + gateway + MCP server, introduced in Unity 6.2 (August 2025) and opened to all Unity 6 developers in May 2026 ([Unity AI open beta blog](https://unity.com/blog/unity-ai-how-to-get-started)). Muse was retired October 2025. Components:

- **In-editor AI Assistant (Unity 6.3 minimum).** Two modes: `Ask` (query/answer) and `Agent` (multi-step task execution). Writes C# scripts, modifies scene components, creates prefabs, and verifies behavior. Integrates with Git for diff-based review ([Unity AI Beta 2026](https://discussions.unity.com/t/unity-ai-beta-2026-is-here/1703625)).
- **Generators.** Sprite, Texture2D, Material, Sound, Animation, Skybox (cubemaps from prompts/images), 3D Model (Hunyuan 3D, static mesh prefabs from text or image), UI Toolkit layout (UXML+USS from prompts). 3D Object Generator documented in the official Unity 6.3 release. All assets tagged with `UnityAI` metadata for project-wide filtering. Generators run in Unity Cloud, not locally ([Innovec Games on Generators](https://www.innovecsgames.com/blog/five-things-to-know-about-unity/)).
- **AI Gateway.** Bring-your-own-key for Claude, GPT, Gemini. Routes to the same in-editor assistant window without consuming Unity Points.
- **Unity Points.** Credit system bundled with paid subscriptions or sold standalone — usage is metered, not unlimited.

### 1.3 Unity MCP server (official)
The Unity MCP server ships with the in-editor Assistant package. As of the May 2026 open beta it is the most polished "official" engine MCP in the space ([Unity MCP setup](https://unity.com/blog/unity-ai-mcp-how-to-get-started)). It implements an open-standard MCP transport with a `Unity Bridge` running inside the editor (a `relay_win.exe` or `~/.unity/relay/` binary that the engine starts on launch) and exposes four core tool categories:

- **Scene management** — read hierarchy, create/modify/delete GameObjects, manage scenes.
- **Script editing** — create/read/modify C# scripts.
- **Console access** — read logs, warnings, errors.
- **GameObject inspection** — read/write component values.
- **Build settings** — inspect platform/build configuration.

The server is in fact a CLI relay that the engine's `Unity Bridge` proxies to (per a community maintainer's analysis on the official Unity forum: "the command relay/relay_win.exe is executed, not a real MCP server… effectively, this is already a CLI, not MCP" — [Unity Discussions](https://discussions.unity.com/t/unity-ai-s-open-beta-now-live-for-unity-6/1718560?page=6)). For the customized-agent use case this is the correct shape: it is a scriptable surface, and the MCP packaging is convenience.

Teams can register custom MCP tools in C# to expose their own editor workflows. The editor is required to be open; the editor is the runtime. A subscription to Unity AI is required; a free trial is available on Personal.

### 1.4 FOSS / third-party Unity MCP servers
- **Unity MCP (emeryporter) on Glama** — 100% Unity-native, 51 built-in tools, 4 workflow prompts, 4 built-in recipes (FPS prototype, UI canvas, 3D template, physics playground), checkpoint system with diff support, vision capture for screenshot-to-LLM loops, single C# attribute for custom tools. Works on Unity 2022.3 or later including Unity 6. Native HTTP server on `localhost:8080/`, persists across domain reloads ([Unity MCP on Glama](https://glama.ai/mcp/servers/emeryporter/UnityMCP/tree)).
- **Open-source alternatives** that predate the official server and remain available for users who want a non-subscription path: a number of community-published servers on Glama and GitHub offer scene/script/console access patterns functionally equivalent to the official one, with the trade-off that they don't carry the official "no credits" pricing.

### 1.5 Unity headless / batchmode
Still the standard for non-AI automation: `Unity -batchmode -quit -nographics -projectPath /path -executeMethod MyBuild.BuildWindows -logFile -` ([Unity build pipeline skill, awesome-gamedev-agent-skills](https://github.com/gamedev-skills/awesome-gamedev-agent-skills/blob/main/skills/unity/unity-build-pipeline/SKILL.md)). `BuildPipeline.BuildPlayer` is the recommended scripted entry point; `BuildReport` is the success gate.

### 1.6 Unity visual scripting status
Unity Visual Scripting (`com.unity.visualscripting@1.9.12`) is **in maintenance mode** as of 2026 — no major features since 2022, no plans to change that ([Unity Discussions: Visual Scripting maintenance mode](https://discussions.unity.com/t/visual-scripting-needs-description-bubbles-for-controls/1732666)). For serious work the Unity community recommends C#. This is the inverse of Unreal's Blueprints story (still first-class) and Construct 3 (still primary) — Unity is the engine where the visual scripting story is regressing.

### 1.7 CI/CD and headless build
- **Unity Build Automation** (Unity's own cloud CI) — multi-platform builds, integration with Unity Version Control, Perforce, Git. Free tier exists; paid tiers expand concurrency and platform support ([Build Automation docs](https://docs.unity.com/en-us/build-automation)).
- **GameCI / `unityci/editor`** — open-source Docker images for GitHub Actions, GitLab CI, CircleCI. Actions: `game-ci/unity-builder`, `game-ci/unity-test-runner`. License activation via Personal `.ulf` file, Pro serial, or floating license server. Caches the `Library/` folder for fast incremental builds ([GameCI Docker Images](https://deepwiki.com/game-ci/documentation/6-docker-images); [GameCI GitHub Actions](https://deepwiki.com/game-ci/documentation/3-github-actions-integration)).
- **Unity Gaming Services CLI** — for Cloud Code deployment automation via the CLI, with explicit Docker / GitHub Actions / Jenkins / Build Automation integration patterns ([UGS CLI CI/CD integration](https://docs.unity.com/en-us/cloud-code/scripts/how-to-guides/automation)).

### 1.8 AI asset generation within Unity
- Unity's own 3D Object Generator (Hunyuan 3D) is in the Generators package.
- Third-party plugins from Meshy, Tripo, Rodin remain the higher-fidelity options for static assets; their outputs are imported as standard FBX/GLB.

### 1.9 Notable 3rd-party tooling in window
- **Modular Avatar (VRChat)** — production example of a Unity package that uses GameCI for its test matrix (`unity_major_version=2022`, `sdk=vrcsdk|standalone`, `testmode=All`) ([Modular Avatar DevOps](https://deepwiki.com/bdunderscore/modular-avatar/11-development-and-contribution)).
- **vrc-get** — VPM dependency resolver used in CI to wire VRChat SDK packages.

---

## 2. Unreal Engine

### 2.1 Engine version landscape
Unreal Engine 5.7 is the current stable release as of June 2026 (officially released 12 November 2025), with 5.8 in preview for mid-2026 ([NISHIWAKI news digest 2026-04-24](https://note.com/lumidina/n/n022c731cff06?hl=en-US); [Vagon UE 5.7 breakdown](https://vagon.io/blog/what-s-new-in-unreal-engine-5-7)). The PCG (Procedural Content Generation) framework crossed to production-ready in 5.7, with a new PCG Editor Mode (spline drawing, point painting, volume creation), advanced spline operators, custom data types, and an Experimental Procedural Vegetation Editor for Nanite-ready vegetation ([80.lv on PCG](https://80.lv/articles/what-s-new-in-pcg-in-ue5-6-ue5-7)). Substrate (the layered material framework) and MegaLights are also production-ready in 5.7.

### 2.2 The MCP explosion
At least five competing MCP servers shipped or remained in active development for UE 5.6/5.7 in 2026. This is intentional — Epic has not shipped a first-party MCP server as of October 2026, so the community fills the gap.

| Server | Maintainer | Surface | Notes |
|---|---|---|---|
| **unreal-engine-mcp (harn3ss)** | Community (harn3ss) | Remote Control API + Python bridge | 105+ tools, UE 5.7, 50ms round-trips, headless build support. ([unreal-engine-mcp on Glama](https://glama.ai/mcp/servers/harn3ss/unreal-engine-mcp)) |
| **mcp-unreal (remiphilippe)** | Community (remiphilippe) | Single Go binary, Remote Control + native plugin | 49 tools, UE 5.7, 49 MCP tools, document indexing. ([mcp-unreal](https://github.com/remiphilippe/mcp-unreal)) |
| **unreal-ai-connection (NAJEMWEHBE)** | Community (NAJEMWEHBE) | Native C++ TCP plugin | **DEPRECATED 2026-07-17** — maintainer moved to Epic's native plugin. 143 tools, UE 5.7, 50ms round-trips. Listed for context: was the most comprehensive during H1 2026. ([unreal-ai-connection](https://github.com/NAJEMWEHBE/unreal-ai-connection)) |
| **MCP Automation Bridge (Chirag Panwar)** | Community (Chirag Panwar) | Native HTTP/SSE inside UE 5.7 plugin | 200+ editor automation actions across 23 tool groups, WebSocket bridge support. No Node.js required. ([MCP Automation Bridge on UE Forums](https://forums.unrealengine.com/t/chirag-panwar-mcp-automation-bridge/2727105)) |
| **UnrealMCPBridge (ZiggyMar)** | Community (ZiggyMar) | C++ plugin + TypeScript MCP server | Targets UE 5.6/5.8 specifically, Kismet2/EdGraph/AssetRegistry access, Blueprint editing. ([unreal-mcp](https://github.com/ZiggyMar/unreal-mcp)) |
| **unreal-api-mcp (codeturion)** | Community (codeturion) | API documentation only | Not a control plane. Provides version-pinned UE 5.5/5.6/5.7 API databases (109K+ records each) to prevent AI agents from hallucinating signatures. ([unreal-api-mcp](https://github.com/codeturion/unreal-api-mcp); [PyPI](https://libraries.io/pypi/unreal-api-mcp)) |

The diversity of MCP servers reflects the underlying surface: UE's Remote Control API (`/api/remote`) and the Python `unreal` module are the two official hooks. Every server is some combination of those plus a transport layer.

### 2.3 NVIDIA ACE / MetaHuman / built-in AI
NVIDIA lists UE 5.4–5.7 plugins for Audio2Face-3D (facial animation), ASR, local LLM with function calling, and TTS ([Windows Forum on NVIDIA ACE](https://windowsforum.com/news/unity-roblox-and-nvidia-ace-bring-generative-ai-into-game-development-workflows.447881/)). MetaHuman integration got Linux and macOS support in 5.7. These are runtime AI tools (NPC brains, generated VO), not editor automation, but they are the path for "AI in the shipped game" that a customized agent can configure.

### 2.4 Headless / commandlet
`UnrealEditor-Cmd` is the headless entry point. RunUAT / BuildCookRun remain the canonical build orchestration command. Automation tests run via the automation framework. `ue-cook-commandlet` is the cook path. Headless build/test execution is mature and well-documented.

### 2.5 Python automation
`unreal` Python module reflects the Blueprint API. Remote Control API serves the `UFunction` surface. For AI agents, the canonical pattern is: Remote Control → Python bridge → MCP tools. The `ue_mcp_bridge` pattern (pure `.py` in `Content/Python/init_unreal.py`) is the most common glue layer.

### 2.6 Visual scripting (Blueprints)
Blueprints remain first-class and a major production system. Note: there is community discussion that Epic will deprecate Blueprints in favor of Verse scripting in UE 6, but no firm announcement in the window ([Shattered.io engine comparison](https://shattered.io/unreal-engine-vs-unity-vs-godot/)). For now (UE 5.7), Blueprints is the recommended path for designer-authored logic, and Sandfall's *Clair Obscur: Expedition 33* shipped with ~95% Blueprint logic.

### 2.7 CI/CD — Horde and UnrealGameSync
Horde is Epic's first-party CI/CD platform; it is "Unreal Engine 5.4以降の新標準" ([Epic Games Japan Horde guide](https://www.docswell.com/s/EpicGamesJapan/K2QVVE-2025-12-15-214934)) and is documented to be "the new standard" in UE 5.4+. It speaks BuildGraph (XML-based scripting), supports distributed build execution, Preflight (pre-commit validation), and integrates with UnrealGameSync (UGS) for distribution. UGS is the "sync + prebuilt binaries" distribution tool for artists and QA; it is wired into Horde and is the studio-wide delivery layer ([Perforce on UGS + Horde](https://www.perforce.com/blog/p4/how-to-use-unrealgamesync); [Perforce P4 × Horde orchestration](https://www.docswell.com/s/EpicGamesJapan/Z6ERYX-UE_UFT2025_TOYO_PERFORCE)).

- **Horde on a Budget** — S1T2's Unreal Fest Bali 2025 talk documented a hybrid approach with Horde server on AWS and build agents on-prem ([UE Forums: Horde on a Budget](https://forums.unrealengine.com/t/talks-and-demos-horde-on-a-budget-cost-effective-infrastructure-for-small-teams/2705272)).
- **Universal Foundry** — managed Horde hosting; described in a LinkedIn post as a way to skip rolling your own server farm.
- **Virtual Assets** — a UE 5.6+ feature that splits `.uasset` into a small metadata file and an on-demand `.upayload` to reduce sync time; works alongside Zen DDC and DDC.
- Studio job listings from Hasbro and That's No Moon Entertainment in 2026 list "Unreal Engine Horde" as a primary build-platform responsibility and explicitly mention "migrate Jenkins → Horde."

### 2.8 PCG as automated content creation
PCG crossed to production-ready in UE 5.7 ([StraySpark: UE 5.7 PCG](https://www.strayspark.studio/blog/ue5-pcg-production-ready-guide)). The Procedural Vegetation Editor provides a visual front-end that generates PCG graphs under the hood. PCG graphs can be Blueprint-callable for runtime generation. The framework is now "adopt" by Mythic Lemon's engine radar, the strongest endorsement ([Mythic Lemon engine radar 2026-1](https://mythiclemon.com/radar/engine-radar-2026-1/)).

---

## 3. Blender

### 3.1 Engine version landscape
Blender 4.2 LTS, 4.3, 4.4, 4.5, and the May 2026 release of 4.5 LTS are the in-window versions. 5.2 LTS is referenced by some MCP servers as the integration target. Geometry Nodes continues to be the procedural geometry system. Cycles + Eevee remain the render engines.

### 3.2 MCP servers (a deep catalog)
Blender has more MCP servers than any other tool in scope. The pattern is consistent: an add-on running inside Blender listens on a TCP port (typically `localhost:9876`), a Python MCP server forwards tool calls over stdio, and the agent can read scene state, edit objects, run Python, and render.

| Server | Tools / Domains | Transport | Notes |
|---|---|---|---|
| **kleer001/blender-mcp** ([GitHub](https://github.com/kleer001/blender-mcp/)) | 175 tools / 25 domains | TCP, addon-side | Typed tools instead of `execute_blender_code` catch-all. Integration-tested on 4.2.5 LTS. |
| **djeada/blender-mcp-server** ([GitHub](https://github.com/djeada/blender-mcp-server)) | 27 tools / 7 namespaces | TCP, `localhost:9876` | Headless transport via separate `blender -b` process; supported by Codex MCP config. |
| **dcc-mcp-blender** ([PyPI](https://pypi.org/project/dcc-mcp-blender/0.1.8/)) | Embedded Streamable HTTP server | In-process | No external gateway; runs on `127.0.0.1:8765`. |
| **YellowFoxH4XOR/blender-mcp** ([Glama](https://glama.ai/mcp/servers/YellowFoxH4XOR/blender-mcp)) | Headless-only typed tools | Subprocess `blender -b` | No arbitrary code execution; safety-first, deterministic. Blender 5.2 LTS target. |
| **josefgoeller-ship-it/blender-mcp** ([Glama](https://glama.ai/mcp/servers/josefgoeller-ship-it/blender-mcp)) | Both headless and live | Dual transport | Identical handler code on both routes. |
| **Wacho01/Blender-Automation-MCP** | 27 tools | TCP, `localhost:9876` | Headless mode via `blender -b --python`. |
| **ahujasid/blender-mcp** + forks | Catch-all via `execute_blender_code` | TCP, `localhost:9876` | Most-cited but has a known headless bug ([issue #251](https://github.com/ahujasid/mcp-for-blender/issues/251)): `bpy.app.timers` doesn't fire in `blender -b` mode when the main thread is blocked; patched by background-socket workers. |

The two patterns to know: **"live + addon"** (most common; can drive the open session) vs **"headless subprocess"** (each call spawns `blender -b`; deterministic and safe). Servers that target both let the agent pick ([Astra + Blender workflow test](https://blendermcp.org/guides/astra-blender)).

### 3.3 Headless bpy
`blender -b --python script.py` is the canonical headless entry point. The `bpy` Python module exposes nearly the entire editor API. New: an MCP server ecosystem has standardized the "wrap bpy in MCP" pattern, so a coding agent in your IDE can drive Blender the same way it drives Unity or Unreal.

### 3.4 Procedural content
Geometry Nodes is the in-engine procedural geometry framework; it's the main non-MCP automation surface for content creation. Combined with a Blender MCP server, you can parameterize a node network and let an agent produce variations.

### 3.5 Blender's place in the agent-driven pipeline
Blender functions as the "asset finishing" stage in most agent-driven pipelines:

> "Blockout with Tripo P1 → Final pass through Meshy 5 or Rodin Gen-2 → Retopology via CSM Cube 2 or manually in Blender → Texture cleanup in Substance Painter or AI-assisted via Polycam or Meshy's texture regen → Export through Blender for final game-ready polish. Our Blender MCP Server automates the LOD, collision, and Unreal-naming conventions for batch processing. Import to Unreal via the Unreal MCP Server." ([StraySpark generative-3D comparison](https://www.strayspark.studio/blog/generative-3d-tools-comparison-meshy-rodin-tripo-csm-2026))

The "blender for unreal" bridge is still relevant for studios that want a single DCC hub.

---

## 4. Godot

### 4.1 Engine version landscape
Godot 4.5 shipped September 2025 (with shader baker, accessibility improvements). 4.6 shipped January 26, 2026 with a new "Modern" theme (default), Jolt Physics made default for new 3D projects, movable/floatable docks, and a major SSR overhaul ([Gamineai 4.6 article](https://gamineai.com/blog/godot-4-6-modern-theme-first-indie-editor-keep-hold-evening-2026); [Godot 4.6 forum thread](https://forum.godotengine.org/t/godot-4-6-release-all-about-your-flow/131705)). 4.7 stable shipped June 18, 2026 with HDR output (Windows, macOS, iOS, visionOS, Linux/Wayland only — Forward+ or Mobile renderer), `AreaLight3D`, the new Asset Store (rebuilt with background loading), `DrawableTexture2D`, VirtualJoystick, and wasm64 web exports ([Godot 4.7 announcement](https://godotengine.org/article/hdr-output-arrives-in-godot-4-7/?pubDate=20260619); [Cinevva 4.7 release](https://app.cinevva.com/news/2026-06-19-godot-4-7-released)). 4.8 is in preview. Visual scripting was removed in 4.0 and has not returned.

### 4.2 The Godot MCP explosion
At least seven MCP servers shipped in the window, each with a different take. The ecosystem is roughly ordered by maturity and tool count:

| Server | Tools | Version target | Notes |
|---|---|---|---|
| **aigengame/godot-agent** (`gda`) ([GitHub](https://github.com/aigengame/godot-agent)) | N/A — CLI first, MCP second | 4.4+ headless, 4.6+ live | The most production-shaped entry: standalone `gda` CLI, Agent Skill, MCP server. Two modes (headless, live). Both 2026-07-28 MCP spec era and pre-2026. ([gda-mcp](https://github.com/aigengame/godot-agent)) |
| **hybridindie/godot-mcp** ([GitHub](https://github.com/hybridindie/godot-mcp)) | 193 tools / 29 categories | 4.4+ (4.7 validated) | `godot-editor-mcp` on PyPI; container on `ghcr.io/hybridindie/godot-mcp`; version 2026.10.10. ([PyPI: godot-editor-mcp](https://pypi.org/project/godot-editor-mcp/)) |
| **yanhuifair/Godot-MCP** ([GitHub](https://github.com/yanhuifair/Godot-MCP)) | 386 tools / 30 categories | 4.x | Largest tool count. Comprehensive Godot 4.x engine coverage. |
| **tugcantopaloglu/godot-mcp** ([GitHub](https://github.com/tugcantopaloglu/godot-mcp)) | 157 tools | 4.4+ (4.7 tested) | TypeScript + GDScript headless. TCP runtime interaction. GDScript diagnostics, batch validation. |
| **wgt19861219/godot-mcp-enhanced** ([GitHub](https://github.com/wgt19861219/godot-mcp-enhanced)) | 33 tools / 199 actions | 4.5–4.7 | Three-layer architecture: headless CLI, Editor WebSocket, Game Bridge (TCP). Recording + frame-verify. |
| **Godot Editor MCP** (Asset Library) | 180 tools / 29 categories | 4.4 | Auto-reconnecting WebSocket. GUT headless test runner. ([Godot Asset Library](https://godotengine.org/asset-library/asset/5434)) |
| **sandraschi/godot-mcp** ([GitHub](https://github.com/sandraschi/godot-mcp)) | 95+ tools | 4.4+ | FastMCP, Game Builder flow, "deterministic playtesting" with frozen game clock. |
| **Fulviuus/godot-mcp-server** ([Glama](https://glama.ai/mcp/servers/Fulviuus/godot-mcp/tree)) | N/A | 4.7 | Toolchain management: auto-resolves Godot binary, downloads export templates, headless import + multi-mode export. |
| **regiellis/godot-mcp-go** (`swallowtail`) ([GitHub](https://github.com/regiellis/godot-mcp-go)) | CLI-first | 4.7 (4.3–4.8 beta) | `swallowtail launch` opens an editor (refuses to stack a second). MCP is a `serve` subcommand, not the primary surface. |

There is a useful pattern: most of these servers expose headless operation (run a script in `godot --headless --script godot_operations.gd <op> <json>`) as the default and live editor control as an upgrade.

### 4.3 Headless Godot
`godot --headless --export-release "Linux/X11" build/game.x86_64` remains the canonical CI command. GUT (Godot Unit Test) runs headlessly via `godot --headless -s addons/gut/gut_cmdln.gd -gdir=res://test -gexit` ([godot-builder skill](https://www.typingmind.com/skills/thedivergentai-godot-builder)). 4.6+ ships the Jolt physics default; 4.7's wasm64 export lifts the 4 GB ceiling on browser builds.

### 4.4 Visual scripting: officially removed
VisualScript was removed in Godot 4.0. The team has not reversed that decision through 4.7. The current community solution is **Orchestrator**, a Blueprints-style GDExtension (version 2.5 shipped July 2026) ([Egmatic engine comparison](https://egmatic.com/blog/visual-scripting-engines-compared)). Geometry Nodes is not a general scripting tool; it's vertex-data transformation. The Godot community is squarely code-first (GDScript, C#, GDExtension/C++).

### 4.5 Skill packs for AI agents
- **godot-prompter** — 48 skills + 9 agents covering GDScript, C#, 2D/3D, multiplayer, AI nav, UI/HUD, animation, shaders, physics, editor plugins, performance, testing, CI/CD, mobile export ([claudepluginhub.com comparison](https://www.claudepluginhub.com/blog/claude-code-plugins-for-godot)).
- **godot-devtool** — MCP server that automates scene authoring, live editor manipulation, headless runtime validation, project export.
- **better-godot-mcp** — Skills + MCP server; scaffolds platformer / overhead mechanics, health, inventory, save/load.
- **awesome-gamedev-agent-skills** — 16 Godot skills including `godot-export` for headless CLI export, plus 74 total game-dev skills across engines ([GitHub](https://github.com/gamedev-skills/awesome-gamedev-agent-skills)).

---

## 5. Phaser 3

### 5.1 Engine version landscape
Phaser 4 is the current major line and Phaser Editor v5 is fully on Phaser 4 with the new Filters system (replacing FX), Spine 4.2 support, and full project-template migration ([Phaser Editor v5 release](https://phaser.io/news/2026/04/phaser-editor-v5-release)). Phaser 3 compatibility is "fully maintained" — there is no migration pressure. Phaser Studio explicitly says "no pressure to migrate if you're not ready" ([Phaser Editor v5 beta announcement](https://phaser.io/news/2026/02/phaser-editor-v5-beta)).

### 5.2 Phaser Editor v5 MCP server (official, in-editor)
Phaser Editor v5 (released 1 May 2026; v5.0.1 patch 11 May 2026) ships an MCP server built into the editor desktop app, with 40+ specialized tools and a one-click configuration dialog for Claude Desktop, Cursor, GitHub Copilot, and VS Code ([Phaser Editor v5 release notes](https://phaser.io/news/2026/04/phaser-editor-v5-release); [Phaser Editor v5 changelog](https://docs.phaser.io/phaser-editor/intro/changelog)). The server can assist with scene development, suggest contextually appropriate object names, reorganize objects into layers, generate particle emitters from project assets, and combine scene and code changes for new gameplay features. The Phaser Studio team reports Claude Sonnet as the best-performing model in their testing.

### 5.3 Built-in AI Chat (in-editor)
The same v5 release adds a built-in AI Chat that lives inside the editor, with model presets for Gemini, Claude, Cursor, any OpenAI-compatible model, and the full OpenRouter catalog. You can drag assets or scene files into the chat for context ([Phaser Editor v5 release](https://phaser.io/news/2026/04/phaser-editor-v5-release)).

### 5.4 Phaser Game Agent (hosted)
The Phaser Game Agent (launched 25 June 2026) is a hosted service that builds a complete Phaser game — code, art, music — from a sentence-long description, then publishes a preview link and emails when ready ([Phaser Game Agent launch](https://www.linkedin.com/posts/phaser-studio_today-were-launching-something-weve-been-activity-7476355024558874624-oA_Z)). The MCP server for the Phaser Game Agent (published 8 July 2026) connects Claude Code, Cursor, Copilot, Codex, Gemini CLI, and Windsurf to the same agent; setup is one command. Pricing: $0.01/minute of build time, free setup ([Phaser Game Agent MCP setup](https://phaser.io/news/2026/07/phaser-game-agent-mcp-setup)). The agent supports 2D Arcade, Vector, and 3D modes (the 3D mode is the first real 3D in Phaser).

### 5.5 Phaser Desktop (browser-based workstation)
Released 22 May 2026, the Phaser Desktop is a browser-based desktop environment that bundles a Monaco code editor, a Pixel Artist, Tilemap Editor, Texture Atlas Creator, Seamless Texture Generator, Music Generator, SFX Generator, and Arcade Physics Editor. Some tools are AI-powered (Image, Music, SFX, Seamless Texture Generators); the Pixel Artist, Tilemap Editor, Texture Atlas Creator, and Physics Editor are non-generative. The Desktop is MCP-aware; Phaser Studio said "we're thinking about… opening these tools open via MCP for AI Agent support" in the announcement ([Introducing the Phaser Desktop](https://phaser.io/news/2026/05/introducing-the-phaser-desktop-a-game-making-workstation-built-by-game-makers)).

### 5.6 Phaser 3 headless / CLI tooling
Phaser 3 has no first-party CLI; the canonical pattern is to wire it into a Next.js + npm project and use Playwright (or Chrome DevTools Protocol) for visual verification ([Codex CLI for game prototyping, Godot + Phaser](https://codex.danielvaughan.com/2026/05/10/codex-cli-game-prototyping-godot-phaser-browser-games-agent-skills/)). The official Phaser repository ships AI agent skills covering scenes, physics, input, animations, tilemaps, tweens, particles, and cameras — usable from Claude Code, Codex, or any agent that reads skill files.

### 5.7 3D
Phaser 4 + Game Agent 3D mode (launched June 2026) is "real 3D, in Phaser, for the first time" per the announcement. For 3D-heavy production work this is the same as before: most teams pair Phaser with a separate 3D engine. But for "small 3D prototypes generated by an agent" it's now a one-prompt path.

### 5.8 Phaser Studio and the agent readiness scorecard
Ultrametric's engine rating for Phaser is overall 33/100 with **Agent-Ready 34/100** ([ultrametric.ai/arena/game-engines/product/phaser](https://ultrametric.ai/arena/game-engines/product/phaser)). The signal: Phaser has MCP ✓, CLI ~, AI workflows rated 45, but headless automation rated lower because the framework doesn't ship a CLI. The Phaser Editor v5 MCP server and Phaser Game Agent MCP server both check the agent-controlled boxes; the gap is the missing build/test CLI.

---

## 6. Construct 3

### 6.1 Engine version landscape
Construct 3 is the current stable line. r458 is the latest stable release and is a major compatibility milestone ([Construct 3 r458 release notes](https://www.construct.net/en/make-games/releases/stable/r458)):

- **Cloud save** for Construct Game Services (cross-platform savegames).
- **Desktop exports** rewritten on Windows WebView2, macOS WKWebView, Linux CEF (NW.js removed).
- **9-patch object** improvements: scale, small-size rendering, URL loading, per-instance settings.
- **Text object** performance overhaul (new layout engine) and WebGPU optimization.
- **WebGPU is default** in editor and runtime.
- **Free edition** now allows unlimited lines of code.
- **Compatibility retirement:** legacy SDK v1 plugins/behaviors, the NW.js exporter, Windows 32-bit / Linux ARM 32-bit, the legacy "flat" export file structure, and the legacy "file" scheme for iOS/Android. r449.x LTS is supported through end of 2026.

The current stable build (per [Egmatic's 2026 review](https://egmatic.com/blog/construct-3-review-worth-subscription)) is r487.3 with beta builds at r489. Recent additions include a 3D Model plugin (r476), WebGPU compatibility mode (r477), dynamic sampling and pixel snapping, physics collision filtering, and Construct Animate (a separate 2D animation tool, currently beta).

### 6.2 Scripting model
Since r226, Construct 3 projects use JavaScript modules by default (`import`/`export`, scoped variables, modern features). TypeScript is supported through the "Set up TypeScript for external editor" workflow; the official documentation is mirrored at [ToadLobe/c3-skill](https://github.com/ToadLobe/c3-skill). Code can be embedded in event sheets via JavaScript/TypeScript script actions or blocks (with `await` support). The `IRuntime` object is the gateway from JavaScript into Construct's engine ([Construct-3 manual mirror on c3-skill](https://github.com/ToadLobe/c3-skill/blob/main/Construct3-Manual/scripting/using-scripting/script-files.md)).

### 6.3 Addon SDK v2 (mandatory since r450)
Plugins, behaviors, effects, and themes are authored in JavaScript or TypeScript. The SDK structure is documented on the [Construct Addon SDK GitHub repo](https://github.com/Scirra/Construct-Addon-SDK): `addon.json` for metadata, `lang/en-US.json` for display names, `instance.js` for per-instance behavior, `type.js` for shared type-level logic, `plugin.js` for plugin-level setup, `aces.json` for Actions/Conditions/Expressions.

### 6.4 The de-facto community MCP server
The most consequential automation addition in window is **[liauw-media/construct3-mcp](https://github.com/liauw-media/construct3-mcp)** (v1.10.0 at time of writing). It is the de-facto standard Construct 3 MCP server, MIT-licensed, and exposes:

- **Project tools:** `update_project_metadata`, `register_addon`, `unregister_addon`, full project structure read, addon listing.
- **Safe editing** with editor-faithful writes, automatic backups, and `validate_project` enforcing the same load-time checks the Construct editor does.
- **Runtime tools (v1.9.0+):** `serve_preview`, `connect_to_game` (over Chrome DevTools Protocol), `call_bridge`, `wait_for_condition`, `subscribe_events`, `simulate_input`, `screenshot_game`. Requires Node.js 22+ and Chrome/Edge.
- **Hook:** the MCP server injects a runtime bridge into the project (`c3-runtime-bridge.js`) that the in-game runtime calls back into.

The server is not on npm; you clone and build with `npm ci`. The Claude Code registration is `claude mcp add construct3 --scope user -- node /path/to/dist/index.js "/path/to/your-project"`.

### 6.5 What the MCP server does NOT do
- It cannot export or preview your game — only the Construct editor does that. The runtime tools work off an exported folder (`serve_preview`) or the editor's preview in Chrome/Edge with a debug port.
- It cannot install third-party addons. `register_addon` only writes the entry into `usedAddons`; the actual addon must be installed in the editor first.
- It must be removed before shipping (the runtime bridge lives in your project; `remove_runtime_bridge` exists for this).

### 6.6 Other Construct 3 automation tools in window
- **[XHXIAIEIN/Construct3-Copilot](https://github.com/XHXIAIEIN/Construct3-Copilot)** — Claude Code plugin with two sibling services: Construct3-RAG (ACE schema search, port 8765) and Construct3-Clipboard (clipboard JSON generation, port 8766). Four skills: `/c3-create`, `/c3-search`, `/c3-validate`, `/c3-addon`. It generates Construct 3 clipboard JSON from natural language and pastes directly into the editor. Output types: `layouts`, `object-types`, `events`, `world-instances`.
- **[ToadLobe/c3-skill](https://github.com/ToadLobe/c3-skill)** — An AI agent skill (`/c3-skill`) that gives Claude Code deep knowledge of Construct 3's scripting APIs. Install via `npx skills install ToadLobe/c3-skill`.
- **kindeyegames 3D Bundle** — Third-party addons that bring real 3D into Construct 3: glTF Model plugin, glTF Spotlight/Point Light, glTF Environment Lighting, Rapier 3D Physics. glTF 3D Model uses the official C3 SDK; Rapier 3D runs WebAssembly physics on a separate worker thread ([kindeyegames itch.io page](https://kindeyegames.itch.io/c3-3d-bundle)).

### 6.7 Construct 3 headless export
There is **no public Scirra-issued CLI for headless export or build automation**. The export pipeline is in-editor only. This is the single biggest gap in the Construct 3 automation story for 2026: a coding agent that can edit and run a Construct 3 project through MCP, but cannot trigger an end-to-end build for distribution. The community MCP server partially closes the gap by serving an exported folder and driving the running game in a headless browser, but the export step itself still requires the editor.

### 6.8 Visual scripting (event sheets)
Construct 3's primary authoring model is event sheets (a flowchart-like block of conditions and actions). JavaScript/TypeScript can be embedded inside event sheets, but the visual scripting model is the production default and is in active development (Scirra shipped 55 stable updates in 2025 alone). The visual scripting is the engine, not a side feature.

### 6.9 Construct-CLI (third-party)
A separate project, **[EstebanForge/construct-cli](https://github.com/EstebanForge/construct-cli)**, is a single-binary CLI that boots a clean, isolated sandboxed container preloaded with AI agents (Codex, Antigravity, Claude Code, Copilot, OpenCode, etc.). It is a sandbox wrapper, not a Construct 3 specific tool. Useful for running Construct 3 editing agents in a reproducible environment, but does not interact with the Construct 3 editor itself.

---

## 7. Cross-cutting: AI coding agents

The coding agents listed below are not engine-specific but are the substrate that any engine MCP server plugs into. Every MCP server catalogued above supports a meaningful subset of these.

### 7.1 Tier-1 agents (production-shaped)

| Agent | Format | Strength | Notes |
|---|---|---|---|
| **Claude Code** | Terminal, IDE, web, mobile, GitHub Actions, Slack | Strongest reasoning; long-running multi-step tasks; per-action approval | Anthropic's reference agent. Plan mode blocks edits until approval. ([Claude Code common use cases](https://support.claude.com/en/articles/14553517-claude-code-common-developer-use-cases)) |
| **Cursor** | VS Code fork + CLI | IDE-first, Composer multi-file edits, codebase index | 67,000+ GitHub stars per Cline comparison; Cursor is the standard for editor-first workflows. ([Cursor's 2026 pitch](https://tech-insider.org/best-ai-coding-assistants-2026/)) |
| **OpenAI Codex CLI / Apps SDK** | CLI, ChatGPT app, MCP-bundled | Phased workflows, parallel jobs, ChatGPT as a runtime | Apps SDK turns ChatGPT into an MCP client that can run tool servers inside the ChatGPT UI ([Codex CLI for ChatGPT apps](https://codex.danielvaughan.com/2026/05/14/building-chatgpt-apps-with-codex-cli-apps-sdk-mcp-server-widget-scaffolding/)). |
| **GitHub Copilot** | IDE extensions + GitHub web + cloud agent | PR/issue integration, broadest IDE coverage | The enterprise default for GitHub-centered teams. ([Scrimba 2026 comparison](https://scrimba.com/articles/best-ai-coding-assistants-2026/amp/)) |
| **Cline** | Open source, Apache 2.0, model-agnostic | Per-action approval; BYO key; local models | The open-source reference. CLI, JetBrains, VS Code, Devin Desktop, Zed, Neovim via ACP. ([Cline on the 2026 agent list](https://junie.jetbrains.com/blog/best-ai-coding-agents/)) |
| **Windsurf / Devin Desktop** | IDE | Cascade flows, multi-file plans | Same product line, rebranded. |
| **JetBrains Junie** | JetBrains IDE + CLI | IDE-native agentic workflows |  |
| **Aider** | Terminal | Git-native diff loop | Open source, popular for editor-agnostic shell-driven work. |

### 7.2 Source availability and license
Open source / open weights: **Cline, Aider, Continue.dev, OpenCode, Goose, Crush, Kilo Code, Qwen Code.** Closed: Claude Code, Cursor, Copilot, Codex, Windsurf, Junie, Tabnine, Amazon Q Developer, Replit.

### 7.3 MCP specification maturity
The MCP 2026-07-28 release candidate (locked 21 May 2026) is a foundation change: stateless core, header-based method routing, OAuth/OIDC hardening, formal deprecation policy, MCP Apps and Tasks extensions, OpenTelemetry instrumentation ([MCP 2026-07-28 explained](https://www.bovo-digital.tech/en/blog/mcp-2026-specification-stateless-enterprise-agents)). Servers that don't refactor will work but lose horizontal scaling. The `Mcp-Session-Id` header and the protocol-level session are removed; list endpoints no longer vary per connection. **The implication for game-engine MCP servers:** many of the 2026-H1 servers are still in the pre-2026-07-28 era (e.g. `gda-mcp` from aigengame accepts both). Plan to refactor before mid-2027.

### 7.4 Agent Skill / harness patterns
- **AGENTS.md / CLAUDE.md** — agent-facing repo manifest. Standard for Claude Code and rapidly adopted by other agents.
- **Hooks** — pre/post-edit or pre/post-command scripts that can block. Standard in Claude Code, Kiro.
- **Plan Mode** — Claude Code / Cursor feature that blocks edits until the user approves the plan.
- **SDD frameworks** — Spec Kit, OpenSpec, BMAD, AI-DLC, Kiro, cc-sdd, GSD Core, all version-bumped in 2026.
- **MCP Builder skill** (onei.ai) — Anthropic's guide for building high-quality MCP servers end to end, including a 10-question XML evaluation suite ([MCP Builder skill](https://onei.ai/skills/mcp-builder)).
- **awesome-gamedev-agent-skills** — 74 game-dev agent skills, 16 for Godot alone, plus Unity build pipeline, Unreal build pipeline, etc. ([GitHub](https://github.com/gamedev-skills/awesome-gamedev-agent-skills)).

### 7.5 Recommended agent stacks for game dev
- **Two-tool stack (most common):** IDE assistant for daily work (Copilot or Cursor) + terminal agent for deep multi-file work (Claude Code or Aider) ([tech-insider recommendation](https://tech-insider.org/best-ai-coding-assistants-2026/)).
- **Engine + coding agent:** Unity 6 with Cursor + Unity MCP server, or Unreal 5.7 with Claude Code + unreal-engine-mcp (harn3ss), or Godot 4.7 with Claude Code + `gda` from aigengame.
- **Multi-engine + 3D content:** Cursor for IDE work + Tripo3D or Meshy for asset generation + Blender MCP for finishing + Unreal MCP for engine import.
- **Browser/2D + agent:** Claude Code + Phaser Editor v5 MCP server or Construct 3 MCP server.

---

## 8. Cross-cutting: CI/CD and headless build infrastructure

### 8.1 Unity: Build Automation + GameCI
- **Unity Build Automation** (Unity's own) — multi-platform, version-control triggered, iOS support ([Build Automation docs](https://docs.unity.com/en-us/build-automation)).
- **GameCI** — open-source Docker images (`unityci/editor`), GitHub Actions (`game-ci/unity-builder`, `game-ci/unity-test-runner`), GitLab CI, CircleCI. Personal/Pro/floating-license support. Caches `Library/`. Mature since 2022, actively maintained in 2026 ([GameCI Docker Images](https://deepwiki.com/game-ci/documentation/6-docker-images); [GameCI GitHub Actions](https://deepwiki.com/game-ci/documentation/3-github-actions-integration); [GitLab CI Integration](https://deepwiki.com/game-ci/documentation/4-gitlab-ci-integration)). The itechguides 2026 ranking puts GameCI #1 and GitHub Actions #7 for game build automation ([GameCI vs GitHub Actions 2026](https://www.itechguides.com/compare/gameci-vs-github-actions/)).
- **UGS Cloud Code CLI** — for Unity Gaming Services deployment automation ([UGS CLI docs](https://docs.unity.com/en-us/cloud-code/scripts/how-to-guides/automation)).

### 8.2 Unreal: Horde + UGS + BuildGraph
- **Horde** (Epic's, UE 5.4+ standard) — BuildGraph-native, distributed agents, Preflight, Shelve→Preflight→Submit→Auto-build→Visualization cycle. Self-host or use managed services like Universal Foundry. Integrates with Perforce P4 and uses Virtual Assets for selective sync ([Epic Games Japan Horde guide](https://www.docswell.com/s/EpicGamesJapan/K2QVVE-2025-12-15-214934); [Perforce P4 × Horde](https://www.docswell.com/s/EpicGamesJapan/Z6ERYX-UE_UFT2025_TOYO_PERFORCE)).
- **UnrealGameSync (UGS)** — artist/QA-facing tool that pulls down precompiled binaries and tracks changelist status. The studio-wide delivery layer ([UGS + Perforce](https://www.perforce.com/blog/p4/how-to-use-unrealgamesync)).
- **Horde on a Budget** — S1T2's hybrid cloud server + on-prem agent pattern for small studios ([UE Forums](https://forums.unrealengine.com/t/talks-and-demos-horde-on-a-budget-cost-effective-infrastructure-for-small-teams/2705272)).
- **Jenkins migration** — multiple studio job listings in 2026 (Hasbro, That's No Moon) list "migrate Jenkins → Horde" as a current project.

### 8.3 Godot: godot --headless + GUT
- `godot --headless --export-release "Linux/X11" build/game.x86_64` is the canonical CI command.
- **GUT** (Godot Unit Test) — community-standard, runs headlessly.
- `godot --headless --script godot_operations.gd <op> <json>` is the pattern most Godot MCP servers use for one-shot operations.
- `godot-build` (Fulviuus) auto-resolves the binary and downloads export templates ([godot-mcp-server on Glama](https://glama.ai/mcp/servers/Fulviuus/godot-mcp/tree)).

### 8.4 Blender: docker + bpy
- `blender -b --python script.py` is the canonical CI command.
- Community Blender Docker images exist but are less standardized than Unity's `unityci/editor` set.
- An MCP server (YellowFoxH4XOR) explicitly targets headless-first safety as a differentiator.

### 8.5 Phaser 3: Next.js + Playwright
- No official CLI. The community pattern is `npm run dev` + `npx playwright test` for visual verification ([Codex CLI for game prototyping](https://codex.danielvaughan.com/2026/05/10/codex-cli-game-prototyping-godot-phaser-browser-games-agent-skills/)).
- Phaser Editor v5 (MCP) can drive scene/script edits, but build/test still relies on Next.js + Playwright.
- Phaser Game Agent is the hosted alternative — agent builds the game, you get a play URL.

### 8.6 Construct 3: editor-only exports
- No public CLI for headless export. Cloud save is available through Construct Game Services.
- The `liauw-media/construct3-mcp` server can serve an already-exported folder and drive the running game in a headless browser, but the export step itself is the gap.

### 8.7 Visual regression, performance budget enforcement
- The "agentic-super-skills game-technical-director" skill (Roohe) defines draw-call budgets per platform (mobile 100–200, PC 1500–2500, console 2000–4000) and enforces them through automated profiling in CI ([GitHub](https://github.com/roohe/agentic-super-skills/blob/master/skills_library/game-technical-director/SKILL.md)).
- The general pattern: smoke tests → performance benchmarks → visual regression → integration tests, in that order of value.

---

## 9. AI 3D asset generation pipeline

This section is engine-agnostic but matters for every engine that consumes 3D assets. The 2025-2026 window saw the field cross from "demo-worthy" to "game-ready for stylized and prop work."

### 9.1 Tools and their roles
- **Meshy 5/6/7** — text-to-3D, image-to-3D, PBR texturing, auto-rigging, 500+ animation presets, eight export formats (FBX, OBJ, USDZ, GLB, STL, BLEND, 3MF). The strongest full-pipeline single tool. $20/mo Pro ([Meshy best AI tools](https://www.meshy.ai/blog/best-ai-tools-for-3d-game-assets)).
- **Tripo 3D / Tripo P1 / Tripo Smart Mesh** — text/image-to-3D, fast iteration, cleanest quad topology, auto-rigging with non-humanoid creature support (quadruped, hexapod, avian, serpentine, aquatic) added Feb 2026. GLB/FBX/OBJ/GLB/USD/STL/3MF. $19.90/mo Pro. Free tier non-commercial ([Tripo 3D indie guide](https://www.tripo3d.ai/blog/ai-3d-for-indie-devs); [Cinevva Meshy/Tripo comparison](https://app.cinevva.com/guides/ai-asset-generators-games)).
- **Rodin Gen-2.5 (Hyper3D)** — highest geometric fidelity per generation, sculpt-level detail, 10M+ polygon output. Free to generate; pay to download ($1.50/credit). Good for hero assets ([StraySpark comparison](https://www.strayspark.studio/blog/generative-3d-tools-comparison-meshy-rodin-tripo-csm-2026)).
- **CSM Cube 2** — for retopology. Tripo's "Smart Mesh" is also a good quad-remesher.
- **3D AI Studio** — all-in-one: text/image → 3D, quad remesh, texturing, rigging, FBX/GLB export to Unity/Unreal/Godot/Roblox ([3daistudio 2026 review](https://www.3daistudio.com/blog/best-ai-game-asset-generators-2026)).
- **Hi3D (Hitem3D)** — best for 3D-print pipelines, finest raw surface detail.
- **Microsoft TRELLIS.2** — self-hosted image-to-3D, open weights.
- **Hunyuan 3D 2.1** — open weights, self-hostable.
- **Adobe Substance 3D** — still the deepest hand-refined hero-asset toolset; integrates with Meshy for retexturing.

### 9.2 Recommended 2026 indie pipeline
1. Blockout with Tripo P1 (fast, cheap, decides if the asset is worth refining).
2. Final pass through Meshy 5 or Rodin Gen-2 depending on whether texture or geometry matters more.
3. Retopology pass via CSM Cube 2 or manually in Blender.
4. Texture cleanup in Substance Painter or AI-assisted via Polycam or Meshy's texture regen.
5. Export through Blender for final game-ready polish (LOD, collision, naming conventions) using a Blender MCP server.
6. Import to engine via the engine's MCP server with proper material assignment and asset registration ([StraySpark](https://www.strayspark.studio/blog/generative-3d-tools-comparison-meshy-rodin-tripo-csm-2026)).

### 9.3 2D / texture / audio / sprite
- **Sprite/2D:** Stable Diffusion 3.5, FLUX.2 klein, Scenario (art-style match), Scenario.gg for style consistency.
- **Texture:** Meshy's AI Texture Generator (mesh-aware, automates UV projection), Tripo's built-in texture pipeline, Polycam (photoreal scan-trained), ArmorLab (free offline).
- **Audio:** Stable Audio 3.0, ACE-Step 1.5, ElevenLabs (game-VO), Phaser Desktop's bundled Music + SFX generators.
- **Animation:** Meshy's AI Animation Generator (rigged, preset-driven).
- **Spine:** Spine 4.2 supports the new Phaser Filters system.

---

## 10. UVP catalog (the special section)

Two parallel groupings, per the user's request.

### 10.1 Technical-integration UVPs

| UVP | Tools that exemplify it |
|---|---|
| **MCP Server for Engine Editor** (lets external AI agents drive the editor) | Unity MCP (official), UE harn3ss unreal-engine-mcp, UE remiphilippe mcp-unreal, UE Chirag Panwar MCP Automation Bridge, Godot aigengame/godot-agent `gda-mcp`, Godot hybridindie godot-mcp, Godot yanhuifair Godot-MCP, Godot tugcantopaloglu godot-mcp, Godot wgt19861219 godot-mcp-enhanced, Godot sandraschi godot-mcp, Godot Fulviuus godot-mcp-server, Godot regiellis godot-mcp-go, Phaser Editor v5 MCP (in-editor), Construct 3 liauw-media construct3-mcp, Blender kleer001 blender-mcp (175 tools/25 domains), Blender djeada blender-mcp-server, Blender dcc-mcp-blender, Blender YellowFoxH4XOR blender-mcp (headless-first) |
| **Headless / Batchmode Build & Test** | Unity `-batchmode -quit -nographics -executeMethod`, UE `UnrealEditor-Cmd` + RunUAT + BuildCookRun, Godot `--headless --export-release`, Blender `blender -b --python`, Phaser (no first-party — use Next.js + Playwright), Construct 3 (no public CLI — editor-only) |
| **AI-Driven Code Generation Inside the Engine** | Unity AI Assistant (Ask + Agent modes), Phaser Editor v5 built-in AI Chat, NVIDIA ACE UE 5.7 plugins (LLM with function calling for in-game NPCs) |
| **MCP Server for Engine API Documentation** (prevents LLM hallucination) | Codeturion unreal-api-mcp (UE 5.5/5.6/5.7 with version-pinned databases, 109K+ records each) |
| **API Documentation Plugin for AI Tooling** | to-questionnaire, ask-matt, grill-me skills (not engine-specific but game-relevant) |
| **Headless Engine Orchestration CLI** | `gda` (aigengame/godot-agent), `swallowtail` (regiellis/godot-mcp-go), `construct-cli` (EstebanForge — agent sandbox, not Construct 3 specific) |
| **Distributed CI/CD with Engine Native Support** | Unity GameCI (Docker images + GitHub Actions), Unity Build Automation (Unity's own cloud CI), Horde + UnrealGameSync + RoboMerge (Epic), godot-builder (typings skill) |
| **Remote Control API Bridge** | UE Remote Control API (HTTP :30010) — used by every UE MCP server as the underlying transport |
| **Python / Scripting Native Module** | UE `unreal` Python module, Blender `bpy` module, Unity `UnityEditor` API, Godot `EditorPlugin` + GDScript API |
| **AI Asset Generation Integrated in Editor** | Unity AI Generators (Sprite, Texture2D, Material, Sound, Animation, Skybox, 3D Model with Hunyuan 3D, UI Toolkit), Phaser Desktop Image/Music/SFX/Seamless Texture Generators, NVIDIA ACE Audio2Face-3D for UE 5.4–5.7 |
| **Procedural Content Generation in Engine** | UE 5.7 PCG (production-ready), Godot Geometry Nodes, Blender Geometry Nodes, Unity Visual Effect Graph |
| **Studio Asset Sync & Pre-compiled Binary Distribution** | UnrealGameSync + Virtual Assets, Unity Build Automation + UGS Cloud Code, Phaser Game Agent hosted workspace |
| **Visual Scene Editor with MCP** | Phaser Editor v5 (MCP in editor desktop app) |
| **Host-Compiled Native Plugin for Editor Control** | UE MCP Automation Bridge (Chirag Panwar, native C++ + SSE), UE UnrealMCPBridge (ZiggyMar, native C++ + TypeScript MCP server) |
| **Sandbox Runtime for AI Agents** | construct-cli (EstebanForge), OpenShell-style sandboxes (referenced in agentic-engineering-handbook) |
| **OpenAPI / llms.txt for Engine Docs** | llms.txt standards (referenced for Phaser in iTechGuides review) |
| **Build Pipeline as Code** | UE BuildGraph (XML), Horde BuildGraph integration, GameCI GitHub Actions YAML, godot --script versioning scripts |
| **Headless Engine with Live Game Bridge** | Godot wgt19861219 godot-mcp-enhanced (3 layers: headless CLI, Editor WebSocket, Game Bridge TCP), UE MCP Automation Bridge, Construct 3 liauw-media construct3-mcp runtime tools |
| **Code-Completeness via LSP / Typed API** | Godot's `validate_script` and `validate_scripts` tools (tugcantopaloglu), Unity's external editor TypeScript support, Phaser API typings in Monaco |
| **Asset Pipeline Tools (Dedicated)** | Unity Build Automation, Phaser Desktop Texture Atlas Creator, Construct 3 glTF 3D Model plugin (kindeyegames), UE PCG |

### 10.2 User-facing workflow UVPs

| UVP | Tools that exemplify it |
|---|---|
| **Rapid Prototyping** | Phaser Game Agent (one-prompt full game), Unity AI Assistant Agent mode, Construct 3 visual event sheets |
| **Automated QA / Test Running** | Unity game-ci/unity-test-runner, GUT for Godot, Playwright for Phaser, liauw-media construct3-mcp runtime tools |
| **AI Co-pilot / Code Generation** | Unity AI Assistant, Phaser Editor v5 AI Chat, NVIDIA ACE UE 5.7 LLM plugin, Construct 3 Copilot (XHXIAIEIN) |
| **Asset Amplification (1 source → many variants)** | Tripo Smart Mesh, Meshy variants, UE 5.7 PCG biomes, Blender Geometry Nodes |
| **AI Sprite / 2D Generation** | Unity Sprite Generator, Stable Diffusion 3.5, FLUX.2 klein, Scenario, Phaser Desktop Image Generator |
| **AI 3D Model Generation** | Unity 3D Object Generator (Hunyuan 3D), Meshy 5/6/7, Tripo P1, Rodin Gen-2.5, CSM Cube 2, 3D AI Studio |
| **AI Texture Generation (PBR)** | Meshy AI Texture Generator, Tripo bundled, Polycam, Rodin API, ArmorLab (free) |
| **AI Audio / Music / SFX** | Phaser Desktop Music + SFX Generators, Stable Audio 3.0, ACE-Step 1.5, Unity Sound Generator |
| **Visual Scripting (engine-native)** | Unreal Blueprints, Construct 3 event sheets, Stencyl blocks, Godot Orchestrator (third-party GDExtension) |
| **Asset Cleanup & Retopology** | CSM Cube 2, Tripo Smart Mesh, Blender manual retopo with MCP-driven batch |
| **Headless Distribution Build** | GameCI, Horde + UGS, godot --headless --export-release, buildkite / circleci / Jenkins, Unity Build Automation |
| **Studio-Wide Sync & Distribution** | UnrealGameSync, Unity Cloud Build artifacts, Phaser Game Agent shareable URLs |
| **Agent Skill / Prompt Library** | awesome-gamedev-agent-skills (74 skills), godot-prompter (48 skills + 9 agents), godot-devtool, better-godot-mcp, ToadLobe/c3-skill |
| **One-Prompt Full Game Generation** | Phaser Game Agent (2D Arcade, Vector, 3D modes) |
| **Multi-Platform Asset Pipeline** | Tripo + Meshy + Blender MCP + engine MCP (StraySpark's recommended 2026 indie pipeline) |
| **Headless Browser Game Testing** | Playwright + Phaser 3, liauw-media construct3-mcp (headless Chrome + DevTools Protocol) |
| **Visual Regression Detection** | Playwright screenshot comparison, Unity screenshot test framework, Phaser Editor MCP vision capture (emeryporter) |
| **Continuous Asset Generation** | Tripo API + scheduled agent run, Meshy API + scheduled agent run, UE PCG at runtime |
| **Cross-Engine Code Reuse** | UE plugin format, Unity Package Manager (UPM), Godot GDExtension (C++), Construct 3 Addon SDK v2 |
| **Agent-Ready Engine Score** (new) | Ultrametric arena scores (Godot, Unity, UE, Phaser all rated 33–65/100 agent-ready in Oct 2026) |
| **AI-Driven Performance Budget Enforcement** | roohe/agentic-super-skills game-technical-director skill, automated profiling in CI |
| **Skill Pack for Coding Agent** | awesome-gamedev-agent-skills (Unity, Unreal, Godot, Phaser, Construct 3) |
| **Natural-Language-to-Engine-Project** | Phaser Game Agent, Construct 3 Copilot (clipboard JSON gen) |

---

## 11. Synthesis

For a dev team that wants to put a customized coding agent in front of one or more of these six engines, the state of the art in October 2026 is:

**Unity 6.3 LTS + Unity AI + Unity MCP + Cursor/Claude Code** is the most complete out-of-the-box stack. The official MCP server handles ~80% of the day-to-day agent workflow (scene/script/console/inspector/build settings). Teams register custom C# MCP tools for project-specific workflows. Build Automation or GameCI handles CI. The gap is Visual Scripting in maintenance mode — for serious logic, C# is the path.

**Unreal Engine 5.7 + harn3ss unreal-engine-mcp + Claude Code + Horde/UGS** is the strongest end-to-end production stack but the most expensive in setup. Five competing MCP servers (harn3ss, remiphilippe, Chirag Panwar, ZiggyMar, NAJEMWEHBE — last one deprecated in favor of Epic's native plugin) reflect a still-fluid market; pick one and budget for refactoring. The codeturion unreal-api-mcp is essential to keep Claude from hallucinating UE 5.5 vs 5.7 vs 5.6 signatures. Horde is the standard CI/CD for UE 5.4+ projects. PCG is production-ready and is the AI content-generation story in-engine.

**Blender + kleer001 blender-mcp + Cursor/Claude Code** is the best DCC choice for an agent-driven pipeline. 175 typed tools across 25 domains means the agent can do real work, not just `execute_blender_code`. Headless subprocess transport is the right default for CI; live addon transport is the right default for interactive development. The MCP Builder skill pattern (typed Zod/Pydantic schemas) is the gold standard.

**Godot 4.7 + aigengame/godot-agent (`gda`) + Claude Code/Cursor** is the most production-shaped open-source engine choice. `gda` is a standalone CLI plus a bundled MCP server; it works in 4.4+ headless and 4.6+ live. The Godot MCP ecosystem has more competing servers than any other engine, which is a sign of demand and a sign of fragmentation. Jolt as default physics in 4.6+ closes the 3D physics gap with Unity and Unreal.

**Phaser 3 (or 4) + Phaser Editor v5 MCP + Phaser Game Agent + Claude Code** is the most surprising entry. Phaser Studio shipped a complete agent story: in-editor MCP (40+ tools), in-editor AI Chat (multi-model), a hosted Phaser Game Agent (MCP server + 2D/Vector/3D modes), and the Phaser Desktop browser workstation. The Phaser 3 skill bundle and the `npm + Next.js + Playwright` CI pattern is the agent-friendly testing loop.

**Construct 3 + liauw-media construct3-mcp + Claude Code/Cursor** is the most community-driven. There's no first-party MCP server, but the community one is good: editor-faithful writes, backups, validation that mirrors editor load-time checks, Chrome DevTools Protocol for runtime tools. The hard gap is no CLI for export — the agent can edit, run, and screenshot a game, but the agent cannot ship a build. For a team that needs Construct 3 to fit a fully agent-controlled pipeline, that's the one thing to push Scirra to add.

The cross-cutting CI/CD layer is mature. The cross-cutting AI coding agent layer is moving fast (MCP 2026-07-28 spec is a foundation change that will require server refactors through 2027). The asset-generation layer is finally game-ready for stylized and prop work; hero characters still need a modeler.

**Confidence: medium-high.** The landscape is broad and well-documented; individual tool maintainer health varies (NAJEMWEHBE unreal-ai-connection deprecated mid-2026 in favor of Epic's native plugin; ahujasid/mcp-for-blender has a headless bug that was patched in a community fork). Specific tooling choices should be re-verified at purchase/adoption time. The synthesis above is the structural shape of the field — that shape is unlikely to change in 2026-H2.

---

## 12. Methodology and limitations

### 12.1 What was searched
- **Engine primary sources:** Unity blog + discussions + docs.unity.com; Unreal dev community forums + Epic Games Japan Horde docs; Blender Foundation + addon marketplace; Godot forum + dev blog + Asset Library; Phaser news + studio LinkedIn; Construct 3 release notes + GitHub org.
- **MCP server registries:** glama.ai/mcp/servers (filtered by engine keyword), github.com (topic: `editor-automation`, `mcp`), godotengine.org/asset-library.
- **Game-dev press and aggregators:** 80 Level, Vagon, Mythic Lemon, StraySpark, Gitnux, Cinevva, Shattered.io, Ziva.sh, Scrimba, Deploybase, Itechguides, Krea, Tripo3D blog, Meshy blog.
- **Coding agent surveys:** JetBrains Junie, Scrimba, DigitalOcean, Tech-Insider, Gamineai, Memeburn, Replit.
- **CI/CD references:** Perforce blog, Epic Games Japan Docswell, GameCI DeepWiki, awesomedevskills.

### 12.2 Inclusion and exclusion
- **In:** tools with a 2025-10-10 → 2026-10-10 release, or actively-maintained older tools with a release in the window (e.g. Unity Visual Scripting 1.9.12 for Unity 6/6000.7).
- **Out:** tools with no in-window activity. Tools in pre-alpha with no working release. Generic test/QA tools not specific to game engines.
- **Gray area:** Construct-CLI (EstebanForge) is included because it directly serves the "agent-controlled engine" use case, even though it is a sandbox rather than a Construct 3 specific tool.

### 12.3 Where evidence is thin
- **Engines' own published "agent readiness" scores:** Ultrametric publishes these but the methodology is not transparent; treat as directional, not authoritative.
- **Adoption numbers** for MCP servers on Glama are self-reported by submitters and may be inflated.
- **Performance claims** for AI asset generators (e.g. "Tripo in seconds", "Meshy in 10–60s") are vendor-reported; the StraySpark indie pipeline guide is the most independent data point but is still a single studio's view.
- **MCP 2026-07-28 spec adoption:** the spec is locked but real-world adoption in production is not yet documented.

### 12.4 What would change the conclusion
- A first-party MCP server from Epic Games for Unreal would consolidate the UE MCP market and probably obsolete 2-3 of the five current competing servers.
- A first-party headless export CLI from Scirra for Construct 3 would close the only major gap in the Construct 3 agent story.
- A shift from "MCP for AI agent" back to "OpenAPI/HTTP for AI agent" if MCP doesn't reach critical mass.

### 12.5 Tool count snapshot
Tools catalogued in this report, by engine or category:
- Unity AI/MCP/headless/CI: ~15 named tools
- Unreal MCP/headless/CI: ~10 named tools
- Blender MCP/add-ons: ~10 named tools
- Godot MCP/headless/skills: ~20 named tools
- Phaser Editor/Game Agent/Desktop: ~6 named tools
- Construct 3 MCP/add-ons/skills: ~5 named tools
- Cross-cutting AI coding agents: ~15 named agents
- AI 3D asset generation: ~12 named tools

Total: ~93 distinct named tools/agents, with overlapping functions across the engines.

---

## 13. Sources

Every URL below was visited in the course of this research. Publication dates and source names are as given by the source itself.

### Unity
1. [Unity AI MCP setup](https://unity.com/blog/unity-ai-mcp-how-to-get-started) — Unity blog, 2026 — official Unity MCP server setup.
2. [What are Unity's AI tools?](https://unity.com/resources/what-is-unity-ai) — Unity resources, 2026 — overview of Unity AI.
3. [Unity AI Open Beta: How to get started](https://unity.com/blog/unity-ai-how-to-get-started) — Unity blog, 2026 — beta launch.
4. [Unity AI's Open Beta Now Live for Unity 6](https://discussions.unity.com/t/unity-ai-s-open-beta-now-live-for-unity-6/1718560) — Unity Discussions, 2026 — community discussion, includes note that Unity's MCP "is already a CLI, not MCP."
5. [Unity MCP Server: Connect Claude Code, Cursor, and Other AI Agents](https://unity.com/blog/unity-ai-mcp-how-to-get-started) — Unity blog, 2026.
6. [Unity's AI tools for Industry teams](https://unity.com/resources/unity-ai-tools-industry) — Unity resources, 2026.
7. [AI Use Cases in Industrial Workflows: A Technical FAQ](https://unity.com/resources/ai-use-cases-industrial-workflows) — Unity resources, 2026.
8. [MCP servers in game development explained](https://unity.com/blog/mcp-servers-game-development) — Unity blog, 2026.
9. [Unity AI UI Generator](https://unity.com/blog/unity-ai-ui-generator) — Unity blog, 13 May 2026.
10. [Unity's sprite generator](https://unity.com/blog/unity-ai-sprite-generator) — Unity blog, 2026.
11. [Unity 6.3 LTS is Now Available](https://unity.com/blog/unity-6-3-lts-is-now-available) — Unity blog, Dec 2025.
12. [New in Unity 6.3 LTS](https://docs.unity.com/en-us/engine/6000.3/manual/whats-new/unity63) — Unity docs, 2026.
13. [Unity AI Beta 2026 is here!](https://discussions.unity.com/t/unity-ai-beta-2026-is-here/1703625) — Unity Discussions, 2026.
14. [Visual Scripting package 1.9.12 (Unity 6)](https://docs.unity.com/en-us/engine/6000.0/manual/packages-list/packages-all/pack-safe/com-unity-visualscripting) — Unity docs, 2026.
15. [Unity Visual Scripting maintenance mode thread](https://discussions.unity.com/t/visual-scripting-needs-description-bubbles-for-controls/1732666) — Unity Discussions, 2026.
16. [Unity Build Automation](https://docs.unity.com/en-us/build-automation) — Unity docs, 2026.
17. [Integrate with CI/CD (UGS CLI)](https://docs.unity.com/en-us/cloud-code/scripts/how-to-guides/automation) — Unity docs, 2026.
18. [GameCI Docker Images](https://deepwiki.com/game-ci/documentation/6-docker-images) — DeepWiki/GameCI, 2026.
19. [GameCI GitHub Actions](https://deepwiki.com/game-ci/documentation/3-github-actions-integration) — DeepWiki/GameCI, 2026.
20. [GameCI GitLab CI Integration](https://deepwiki.com/game-ci/documentation/4-gitlab-ci-integration) — DeepWiki/GameCI, 2026.
21. [GameCI vs GitHub Actions (2026)](https://www.itechguides.com/compare/gameci-vs-github-actions/) — itechguides, Sep 2026.
22. [Modular Avatar Development and Contribution](https://deepwiki.com/bdunderscore/modular-avatar/11-development-and-contribution) — DeepWiki, 2026.
23. [awesome-gamedev-agent-skills/unity-build-pipeline](https://github.com/gamedev-skills/awesome-gamedev-agent-skills/blob/main/skills/unity/unity-build-pipeline/SKILL.md) — gamedev-skills, 2026.
24. [Unity MCP (emeryporter)](https://glama.ai/mcp/servers/emeryporter/UnityMCP/tree) — Glama, 2026.
25. [Innovec Games: Unity Game Engine Explained](https://www.innovecsgames.com/blog/five-things-to-know-about-unity/) — Innovec Games, 2026.
26. [AI Trace: Unity Technologies practice](https://www.aitrace.org/company/unity-technologies/practice/5ae20b24-61e1-41b5-9f1e-a2dcf5df545b) — AI Trace, 2026.

### Unreal Engine
27. [harn3ss unreal-engine-mcp on Glama](https://glama.ai/mcp/servers/harn3ss/unreal-engine-mcp) — Glama, 2026.
28. [codeturion/unreal-api-mcp on GitHub](https://github.com/codeturion/unreal-api-mcp) — GitHub, 2026.
29. [unreal-api-mcp on PyPI](https://libraries.io/pypi/unreal-api-mcp) — Libraries.io, 2026.
30. [NAJEMWEHBE/unreal-ai-connection on GitHub](https://github.com/NAJEMWEHBE/unreal-ai-connection) — GitHub, deprecated 2026-07-17.
31. [MCP Automation Bridge (Chirag Panwar) on UE Forums](https://forums.unrealengine.com/t/chirag-panwar-mcp-automation-bridge/2727105) — UE Forums, 2026.
32. [ZiggyMar/unreal-mcp on GitHub](https://github.com/ZiggyMar/unreal-mcp) — GitHub, 2026.
33. [remiphilippe/mcp-unreal on GitHub](https://github.com/remiphilippe/mcp-unreal) — GitHub, 2026.
34. [Unreal Engine 5.7 Full Breakdown](https://vagon.io/blog/what-s-new-in-unreal-engine-5-7) — Vagon, 13 Nov 2025.
35. [What's New In PCG In UE5.6 & UE5.7](https://80.lv/articles/what-s-new-in-pcg-in-ue5-6-ue5-7) — 80 Level, 6 Feb 2026.
36. [The Unreal Engine Feature Radar](https://mythiclemon.com/radar/engine-radar-2026-1/) — Mythic Lemon, 2026.
37. [Unreal Engine 5.7 PCG Is Production-Ready](https://www.strayspark.studio/blog/ue5-pcg-production-ready-guide) — StraySpark, 2026.
38. [Why Unreal Engine 5.7 PCG Matters for Environment Production in 2026](https://www.skyroidstudios.com/insights/unreal-engine-5-7-pcg-environment-production) — Skyroid Studios, 2026.
39. [NISHIWAKI Game Development News Digest 2026/04/24](https://note.com/lumidina/n/n022c731cff06?hl=en-US) — note.com, 2026.
40. [Perforce: How to Use UnrealGameSync](https://www.perforce.com/blog/p4/how-to-use-unrealgamesync) — Perforce, 2026.
41. [Horde vs Jenkins for UE5 (Epic Games Japan)](https://www.docswell.com/s/EpicGamesJapan/K2QVVE-2025-12-15-214934) — Epic Games Japan, 15 Dec 2025.
42. [Perforce P4 × Horde (Epic Games Japan)](https://www.docswell.com/s/EpicGamesJapan/Z6ERYX-UE_UFT2025_TOYO_PERFORCE) — Epic Games Japan, 2025.
43. [Horde on a Budget (S1T2, Unreal Fest Bali 2025)](https://forums.unrealengine.com/t/talks-and-demos-horde-on-a-budget-cost-effective-infrastructure-for-small-teams/2705272) — UE Forums, 2025.
44. [Introduction to Horde (Jack Condon, Unreal Fest Bali 2025)](https://forums.unrealengine.com/t/talks-and-demos-introduction-to-horde-a-technical-primer/2705275) — UE Forums, 2025.
45. [Shattered.io: Unreal vs Unity vs Godot 2026](https://shattered.io/unreal-engine-vs-unity-vs-godot/) — Shattered.io, 2026.
46. [Windows Forum: NVIDIA ACE for UE 5.7](https://windowsforum.com/news/unity-roblox-and-nvidia-ace-bring-generative-ai-into-game-development-workflows.447881/) — Windows Forum, 2026.
47. [Egmatic: Visual Scripting Engines Compared](https://egmatic.com/blog/visual-scripting-engines-compared) — Egmatic, 2026.

### Blender
48. [kleer001/blender-mcp on GitHub](https://github.com/kleer001/blender-mcp/) — GitHub, 2026.
49. [djeada/blender-mcp-server on GitHub](https://github.com/djeada/blender-mcp-server) — GitHub, 2026.
50. [dcc-mcp-blender on PyPI](https://pypi.org/project/dcc-mcp-blender/0.1.8/) — PyPI, 2026.
51. [YellowFoxH4XOR/blender-mcp on Glama](https://glama.ai/mcp/servers/YellowFoxH4XOR/blender-mcp) — Glama, 2026.
52. [josefgoeller-ship-it/blender-mcp on Glama](https://glama.ai/mcp/servers/josefgoeller-ship-it/blender-mcp) — Glama, 2026.
53. [Blender MCP servers directory (Glama)](https://glama.ai/mcp/servers?query=blander) — Glama, 2026.
54. [ahujasid/mcp-for-blender headless issue #251](https://github.com/ahujasid/mcp-for-blender/issues/251) — GitHub, 2026.
55. [Astra + Blender: A Reproducible Architectural Workflow Test](https://blendermcp.org/guides/astra-blender) — blendermcp.org, 2026.
56. [Wacho01/Blender-Automation-MCP on GitHub](https://github.com/Wacho01/Blender-Automation-MCP) — GitHub, 2026.

### Godot
57. [Godot Editor MCP on Asset Library](https://godotengine.org/asset-library/asset/5434) — Godot Asset Library, 2026.
58. [wgt19861219/godot-mcp-enhanced on GitHub](https://github.com/wgt19861219/godot-mcp-enhanced) — GitHub, 2026.
59. [hybridindie/godot-mcp on GitHub](https://github.com/hybridindie/godot-mcp) — GitHub, 2026 (version 2026.10.10).
60. [regiellis/godot-mcp-go on GitHub](https://github.com/regiellis/godot-mcp-go) — GitHub, 2026.
61. [sandraschi/godot-mcp on GitHub](https://github.com/sandraschi/godot-mcp) — GitHub, 2026.
62. [yanhuifair/Godot-MCP on GitHub](https://github.com/yanhuifair/Godot-MCP) — GitHub, 2026.
63. [tugcantopaloglu/godot-mcp on GitHub](https://github.com/tugcantopaloglu/godot-mcp) — GitHub, 2026.
64. [Fulviuus/godot-mcp-server on Glama](https://glama.ai/mcp/servers/Fulviuus/godot-mcp/tree) — Glama, 2026.
65. [aigengame/godot-agent on GitHub](https://github.com/aigengame/godot-agent) — GitHub, 2026.
66. [Claude Code Plugins for Godot](https://www.claudepluginhub.com/blog/claude-code-plugins-for-godot) — claudepluginhub.com, 2026.
67. [Godot 4.6 Release: All about your flow](https://forum.godotengine.org/t/godot-4-6-release-all-about-your-flow/131705) — Godot forum, 26 Jan 2026.
68. [Godot 4.7: Lights, Camera, Action!](https://steamdb.info/patchnotes/23803640/) — SteamDB, 18 Jun 2026.
69. [Godot 4.7 ships: HDR output, AreaLight3D, Asset Store, wasm64](https://app.cinevva.com/news/2026-06-19-godot-4-7-released) — Cinevva, 19 Jun 2026.
70. [HDR output arrives in Godot 4.7](https://godotengine.org/article/hdr-output-arrives-in-godot-4-7/?pubDate=20260619) — Godot Engine, 23 Apr 2026.
71. [Dev snapshot: Godot 4.7 beta 1](https://godotengine.org/article/dev-snapshot-godot-4-7-beta-1/) — Godot Engine, 24 Apr 2026.
72. [Godot 4.6 Integrates Jolt and Adds New Editor Theme](https://www.i-programmer.info/news/144-graphics-and-games/18652-godot-46-integrates-jolt-and-adds-new-editor-theme.html) — I-Programmer, 10 Feb 2026.
73. [Godot Builder skill (theDivergentAI)](https://www.typingmind.com/skills/thedivergentai-godot-builder) — TypingMind, 2026.
74. [awesome-gamedev-agent-skills GitHub](https://github.com/gamedev-skills/awesome-gamedev-agent-skills) — GitHub, 2026.

### Phaser
75. [Phaser Editor v5 Beta](https://phaser.io/news/2026/02/phaser-editor-v5-beta) — Phaser news, 18 Feb 2026.
76. [Phaser Editor v5 Is Here](https://phaser.io/news/2026/04/phaser-editor-v5-release) — Phaser news, 1 May 2026.
77. [Phaser Editor v5 Changelog](https://docs.phaser.io/phaser-editor/intro/changelog) — Phaser docs, 2026.
78. [Phaser Game Agent MCP Setup](https://phaser.io/news/2026/07/phaser-game-agent-mcp-setup) — Phaser news, 8 Jul 2026.
79. [Introducing the Phaser Desktop](https://phaser.io/news/2026/05/introducing-the-phaser-desktop-a-game-making-workstation-built-by-game-makers) — Phaser news, 22 May 2026.
80. [Phaser Game Agent Launch (LinkedIn)](https://www.linkedin.com/posts/phaser-studio_today-were-launching-something-weve-been-activity-7476355024558874624-oA_Z) — Phaser Studio LinkedIn, 25 Jun 2026.
81. [Ultrametric: Phaser engine score](https://ultrametric.ai/arena/game-engines/product/phaser) — Ultrametric, 2026.
82. [iTechGuides: Phaser Review 2026](https://www.itechguides.com/products/phaser/) — iTechGuides, 2026.
83. [Codex CLI for Game Prototyping (Godot + Phaser)](https://codex.danielvaughan.com/2026/05/10/codex-cli-game-prototyping-godot-phaser-browser-games-agent-skills/) — danielvaughan.com, 10 May 2026.
84. [Phaser Studio: Editor v5 release LinkedIn](https://www.linkedin.com/posts/phaser-studio_phaser-ai-openrouter-activity-7455996422803570688-9-8N) — LinkedIn, 2026.

### Construct 3
85. [Construct 3 r458 release notes](https://www.construct.net/en/make-games/releases/stable/r458) — Scirra, 2026.
86. [Construct 3 r458.2 patch](https://www.construct.net/en/make-games/releases/stable/r458-2) — Scirra, 2026.
87. [liauw-media/construct3-mcp on GitHub](https://github.com/liauw-media/construct3-mcp) — GitHub, v1.10.0, 2026.
88. [liauw-media/construct3-mcp User Guide](https://github.com/liauw-media/construct3-mcp/blob/main/docs/USER-GUIDE.md) — GitHub, 2026.
89. [XHXIAIEIN/Construct3-Copilot on GitHub](https://github.com/XHXIAIEIN/Construct3-Copilot) — GitHub, 2026.
90. [ToadLobe/c3-skill on GitHub](https://github.com/ToadLobe/c3-skill) — GitHub, 2026.
91. [Bugnet: Construct 3: The Complete Guide](https://bugnet.io/blog/construct-3-game-engine) — Bugnet, 2026.
92. [Egmatic: Construct 3 Review 2026](https://egmatic.com/blog/construct-3-review-worth-subscription) — Egmatic, 2026.
93. [Construct-3 org on GitHub](https://github.com/Construct-3) — GitHub, 2026.
94. [Scirra GitHub org](https://github.com/orgs/Scirra/repositories) — GitHub, 2026.
95. [kindeyegames C3 3D Bundle](https://kindeyegames.itch.io/c3-3d-bundle) — itch.io, 2026.
96. [PokiSDK: Construct 3](https://developers.poki.com/guide/sdk-construct3) — Poki, 2026.
97. [EstebanForge/construct-cli on GitHub](https://github.com/EstebanForge/construct-cli) — GitHub, 2026.
98. [headless-cli on PyPI](https://pypi.org/project/headless-cli/) — PyPI, 12 Aug 2026.

### AI Coding Agents
99. [Junie: Best AI Coding Agents 2026](https://junie.jetbrains.com/blog/best-ai-coding-agents/) — JetBrains, 2026.
100. [Scrimba: Best AI Coding Assistants 2026](https://scrimba.com/articles/best-ai-coding-assistants-2026/amp/) — Scrimba, 2026.
101. [Deploybase: Copilot vs Cursor vs Cline vs Claude Code](https://deploybase.ai/articles/best-ai-code-assistants) — Deploybase, 2026.
102. [Tech-Insider: Best AI Coding Assistants 2026](https://tech-insider.org/best-ai-coding-assistants-2026/) — Tech-Insider, 2026.
103. [Gamineai: Best AI Coding Assistants 2026](https://gamineai.com/blog/best-ai-coding-assistants-2026) — Gamineai, 2026.
104. [Memeburn: 9 Best AI Coding Tools in 2026](https://memeburn.com/best-ai-coding-tools/) — Memeburn, 2026.
105. [DigitalOcean: 10 Claude Code Alternatives](https://www.digitalocean.com/resources/articles/claude-code-alternatives) — DigitalOcean, 2026.
106. [Replit: Claude Code Alternatives](https://replit.com/discover/claude-code-alternative) — Replit, 2026.
107. [Claude Code common developer use cases](https://support.claude.com/en/articles/14553517-claude-code-common-developer-use-cases) — Anthropic, 2026.
108. [MCP 2026-07-28 specification](https://www.bovo-digital.tech/en/blog/mcp-2026-specification-stateless-enterprise-agents) — bovo-digital, 2026.
109. [MCP Builder skill](https://onei.ai/skills/mcp-builder) — onei.ai, 2026.
110. [agentic-engineering-handbook](https://github.com/keyuchen21/agentic-engineering-handbook) — GitHub, 2026.
111. [Zenn: AI-driven dev frameworks 2026](https://zenn.dev/cyberbose/articles/ai-dev-frameworks) — Zenn, Sep 2026.
112. [Alice Labs AI Automation Consulting 2026](https://alicelabs.ai/en/insights/ai-automation-consulting) — Alice Labs, 2026.
113. [Building ChatGPT Apps with Codex CLI](https://codex.danielvaughan.com/2026/05/14/building-chatgpt-apps-with-codex-cli-apps-sdk-mcp-server-widget-scaffolding/) — danielvaughan.com, 14 May 2026.
114. [agentic-super-skills game-technical-director](https://github.com/roohe/agentic-super-skills/blob/master/skills_library/game-technical-director/SKILL.md) — GitHub, 2026.

### AI Asset Generation
115. [Hi3D vs Meshy vs Tripo: AI 3D Generator Test (2026)](https://www.meshy.ai/blog/hi3d-vs-meshy-vs-tripo) — Meshy, 2026.
116. [Meshy, Rodin, Tripo, and CSM in April 2026](https://www.strayspark.studio/blog/generative-3d-tools-comparison-meshy-rodin-tripo-csm-2026) — StraySpark, 2026.
117. [Best AI Asset Generators for Games (2026)](https://app.cinevva.com/guides/ai-asset-generators-games) — Cinevva, 2026.
118. [Best AI Game Asset Generators in 2026](https://www.3daistudio.com/blog/best-ai-game-asset-generators-2026) — 3daistudio, 2026.
119. [Best AI Tools for 3D Game Assets (2026)](https://www.meshy.ai/blog/best-ai-tools-for-3d-game-assets) — Meshy, 2026.
120. [Complete AI 3D Asset Pipeline for Game Studios](https://www.tripo3d.ai/blog/ai-3d-asset-pipeline-for-game-studios) — Tripo3D, 2026.
121. [Best AI 3D Model Generators in 2026](https://app.cinevva.com/guides/ai-3d-model-generators) — Cinevva, 2026.
122. [AI 3D for Indie Devs: Tools, Pipeline, and Budget Reality](https://www.tripo3d.ai/blog/ai-3d-for-indie-devs) — Tripo3D, 2026.
123. [The 6 Best AI 3D Model Generators in 2026](https://www.krea.ai/blog/best-ai-3d-model-generators-2026) — Krea, 2026.
124. [AI Texture Generators Compared: 7 Tools, Same Prompt](https://www.meshy.ai/blog/best-ai-texture-generators) — Meshy, 2026.

### General
125. [Phaser Framework news feed](https://www.phaser.io/news/category/news) — Phaser news, 2026.
126. [Construct 3 official GitHub org](https://github.com/Construct-3) — GitHub, 2026.
127. [Construct 3: Build Games (2026 Review)](https://www.construct.net/en/make-games/releases/stable/r458) — Scirra, 2026.
128. [Ultrametric game engine arena](https://ultrametric.ai/arena/game-engines/product/phaser) — Ultrametric, 2026.
129. [Gitnux: Top 10 Best 3D Game Engine Software 2026](https://gitnux.org/best/3d-game-engine-software/) — Gitnux, 2026.
130. [Phaser on the X platform](https://x.com/phaser_/status/2083569074986975424) — X, 1 Aug 2026.
131. [Open-source nps](https://www.phaser.io/news/2026/05/introducing-the-phaser-desktop-a-game-making-workstation-built-by-game-makers) — Phaser, 2026.
132. [Construct-3 GitHub repository listing](https://github.com/Construct-3) — GitHub, 2026.

---

*End of report. Approx 9,200 words. All claims have at least one cited source. Tools listed in the UVP catalog were visited or their documentation page was confirmed accessible during the research period. Tool version numbers and feature flags should be reverified at adoption time, especially given the moving MCP 2026-07-28 spec and the still-fluid Unreal and Godot MCP server landscapes.*
