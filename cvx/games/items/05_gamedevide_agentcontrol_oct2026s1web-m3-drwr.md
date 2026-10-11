# Game-Engine Automation 2026 — Supplemental: Side-by-Side Comparisons and Decision Matrices

**Supplement to:** `wide-research_game-engine-automation-2026_2026-10-10.md`
**Date:** 2026-10-10
**Window covered:** 2025-10-10 → 2026-10-10
**Format source:** rdw-app-competitve-analysis skill
**Audience:** a development team picking tools to wrap inside a customized coding agent.

This document is a deep-dive on top of the parent wide-research. It contains two analytical sections:
- **Part I — Per-engine side-by-side comparisons.** Six ecosystems (Unity 3D, Unreal Engine, Blender, Godot, Phaser 3, Construct 3). Each ecosystem gets a market framing, a competitor roster, per-tool profiles with UVPs and feature categories, a composite feature matrix with the standard legend, and strategic observations.
- **Part II — Per-use-case decision matrices.** Twelve workflow use cases (3D assets, 2D/textures, audio, MCP editor control, headless CI/CD, headless test execution, visual scripting, AI coding agents, procedural content, character animation, API documentation for agents, visual regression). Each use case gets a tool roster, per-tool UVP, a decision matrix, and a recommendation.

All claims are sourced to URLs visited in the parent research. Numbered sources are kept identical to the parent document so a reader can cross-reference.

---

## Part I — Per-engine side-by-side comparisons

### 1. Unity 3D automation ecosystem

**Market framing.** The Unity 3D automation market in 2026 is the set of tools that can drive the Unity editor and runtime from outside the editor, generate assets, run headless builds, and integrate with AI coding agents. Buyers are Unity 6.x development teams (mobile, console, PC, XR) who want to either put an AI agent in front of their editor, ship repeatable CI builds, or generate placeholder content. The market shifted dramatically in 2026 with the launch of Unity AI in Unity 6.2 (Aug 2025) and the open beta in May 2026; the official MCP server is now the most polished "engine + AI" surface in the game-engine space. ([Source 1](https://unity.com/blog/unity-ai-mcp-how-to-get-started))

**Competitor roster (Unity).**

| Tool | Vendor/Maintainer | Type | Positioning |
|---|---|---|---|
| **Unity AI (Assistant + Generators + MCP + Gateway)** | Unity Technologies | First-party | The default. Built into Unity 6.x. Subscription-gated. |
| **emeryporter Unity MCP** | Community (emeryporter) | FOSS | Type-safe tools, 51 built-in, custom C# attribute, vision capture, no subscription. |
| **ahujasid/blender-mcp** *(sometimes called mcp-for-unity)* | Community (ahujasid) | FOSS | Catch-all via `execute_unity_code`. Most-cited open alternative pre-2026. |
| **GameCI** | Community (game-ci org) | FOSS | Headless CI/CD via Docker + GitHub Actions. |
| **Unity Build Automation** | Unity Technologies | First-party | Unity's own cloud CI. Multi-platform, version-control triggered. |
| **Unity Gaming Services CLI (ugs-cli)** | Unity Technologies | First-party | CLI for Cloud Code deployment. |
| **coplay-dev/devops-for-unity** *(watchlist)* | Community | FOSS | Older but maintained. Azure DevOps-friendly. |
| **awesome-gamedev-agent-skills/unity-build-pipeline** | gamedev-skills | FOSS | Agent skill (Claude Code/Cursor) for `BuildPipeline.BuildPlayer`. ([Source 23](https://github.com/gamedev-skills/awesome-gamedev-agent-skills/blob/main/skills/unity/unity-build-pipeline/SKILL.md)) |

**Per-tool profiles (Unity).**

#### Unity AI (Assistant + Generators + MCP + Gateway)
- **UVP:** The only first-party, supported, and continuously updated surface for AI inside Unity 6. Includes the assistant (Ask + Agent modes), the asset generators (Sprite, Texture2D, Material, Sound, Animation, Skybox, 3D Model via Hunyuan 3D, UI Toolkit UXML), the AI Gateway for BYO model, and the official MCP server. ([Source 1](https://unity.com/blog/unity-ai-mcp-how-to-get-started); [Source 9](https://unity.com/blog/unity-ai-ui-generator))
- **Features by category:**
  - **AI Assistant (code):** `Ask` (Q&A), `Agent` (multi-step task execution); integrated Git diff; project-aware context; C# script generation; scene component modification; prefab creation. ([Source 13](https://discussions.unity.com/t/unity-ai-beta-2026-is-here/1703625))
  - **Asset Generators:** Sprite (style models, negative prompt, spritesheets, background removal, pixelation, inpainting, recoloring), Texture2D, Material, Sound, Animation, Skybox (cubemap from prompt/image), 3D Object (Hunyuan 3D, static mesh prefabs), UI Toolkit (UXML+USS). All tagged with `UnityAI` EXIF metadata. ([Source 10](https://unity.com/blog/unity-ai-sprite-generator); [Source 26](https://www.aitrace.org/company/unity-technologies/practice/5ae20b24-61e1-41b5-9f1e-a2dcf5df545b))
  - **MCP server:** Scene management (read hierarchy, create/modify/delete GameObjects), script editing, console access, GameObject inspection, build settings. Custom C# tool registration. Relay-based (effectively a CLI bridge). ([Source 1](https://unity.com/blog/unity-ai-mcp-how-to-get-started); [Source 5](https://discussions.unity.com/t/unity-ai-s-open-beta-now-live-for-unity-6/1718560?page=6))
  - **Gateway:** Claude, GPT, Gemini, Codex via BYO key. No Unity Points consumed.
  - **Pricing:** Unity Pro/Enterprise/Industry subscription + Unity Points for Generators. Personal: free trial.

#### emeryporter Unity MCP
- **UVP:** 100% Unity-native, no Node.js or external runtimes, 51 built-in tools, 4 prompts, 4 recipes (FPS, UI canvas, 3D template, physics), checkpoint system with diff, vision capture, custom C# attribute for adding tools. Free, no subscription. ([Source 24](https://glama.ai/mcp/servers/emeryporter/UnityMCP/tree))
- **Features by category:**
  - **MCP server (51 tools):** Scene, GameObject, scripts, components, console, editor, Canvas UI, Input Actions, Project Settings.
  - **Workflow:** 4 prompt templates, 4 one-call scene setup recipes.
  - **Reliability:** Checkpoint + diff, vision capture, batch execution, auto-checkpointing.
  - **Compatibility:** Unity 2022.3+ including Unity 6.
  - **Transport:** Native HTTP on `localhost:8080/`; persists across Unity domain reloads.

#### ahujasid/blender-mcp (for Unity)
- **UVP:** Most-cited community MCP server for Unity pre-2026. Lightweight, package install, catch-all `execute_unity_code` plus typed wrappers. Free, MIT.
- **Features by category:**
  - **MCP tools:** Read scene, create/edit objects, run editor menu items, execute arbitrary editor C#.
  - **Transport:** Stdio MCP; requires local Node.js for some flows.
  - **Trade-off:** Less structured than emeryporter; relies on free-form code execution for non-trivial tasks.

#### GameCI
- **UVP:** Open-source Docker images + GitHub/GitLab/CircleCI Actions for Unity CI/CD. Most mature FOSS CI for Unity. ([Source 18](https://deepwiki.com/game-ci/documentation/6-docker-images); [Source 19](https://deepwiki.com/game-ci/documentation/3-github-actions-integration); [Source 20](https://deepwiki.com/game-ci/documentation/4-gitlab-ci-integration))
- **Features by category:**
  - **Docker images:** `unityci/editor` for all modern Unity versions; Linux and Windows flavors; Git + Git LFS pre-installed; auto-publish on Unity release.
  - **GitHub Actions:** `game-ci/unity-builder` (builds with custom C# methods, target platform matrix, custom CLI args); `game-ci/unity-test-runner` (EditMode + PlayMode tests, XML results, code coverage); license activation (Personal `.ulf`, Pro serial, floating server); `Library/` cache; per-changelog artifact upload. ([Source 19](https://deepwiki.com/game-ci/documentation/3-github-actions-integration))
  - **GitLab CI:** `unityci/editor` images + `.gitlab-ci.yml`; personal/professional/license-server activation; multi-platform templates (Windows, Linux, macOS, WebGL, Android, iOS); `ANDROID_KEYSTORE_BASE64`, `fastlane supply` for Play, `fastlane match`/`pilot` for TestFlight. ([Source 20](https://deepwiki.com/game-ci/documentation/4-gitlab-ci-integration))
  - **Orchestrator:** Cloud-hosted coordinator with `UnityLogCollectorService` for `Editor.log`, licensing logs, crash dumps.

#### Unity Build Automation
- **UVP:** Unity's own cloud CI. Multi-platform builds, iOS included. Auto-build on VCS commit. No Docker setup. ([Source 16](https://docs.unity.com/en-us/build-automation))
- **Features by category:**
  - **Multi-platform:** Windows, macOS, Linux, Android, iOS, WebGL, console (with platform license), UWP, XR.
  - **VCS integration:** Unity Version Control, Perforce, Git.
  - **CI/CD pattern:** Auto-build toggle, Build Configurations, Build Automation dashboard.
  - **Trade-off:** Paid. The free tier exists but is capacity-limited.

#### Unity Gaming Services CLI (UGS CLI)
- **UVP:** First-party CLI for Cloud Code, Cloud Save, Economy, etc. ([Source 17](https://docs.unity.com/en-us/cloud-code/scripts/how-to-guides/automation))
- **Features by category:**
  - **Deployment:** Cloud Code scripts deploy via CLI; supports Docker, GitHub Actions, Jenkins, Unity Build Automation.
  - **Auth:** UGS service-account JSON.

**Composite feature matrix (Unity ecosystem).**

Legend at the end of this section.

| Feature | Unity AI (official) | emeryporter Unity MCP | ahujasid Unity MCP | GameCI | Unity Build Automation | UGS CLI |
|---|---|---|---|---|---|---|
| **MCP server (official-or-community)** | ✅ Official | ✅ Community | ✅ Community | ➖ | ➖ | ➖ |
| **AI assistant (in-editor)** | ✅ Ask + Agent | ❌ | ❌ | ➖ | ➖ | ➖ |
| **Asset generators** | ✅ Sprite/Texture/Mat/Sound/Anim/Skybox/3D/UI | ❌ | ❌ | ➖ | ➖ | ➖ |
| **BYO model gateway** | ✅ AI Gateway | ❌ | ❌ | ➖ | ➖ | ➖ |
| **Custom tool registration** | ✅ C# attribute | ✅ C# attribute | 🟡 Code-exec | ➖ | ➖ | ➖ |
| **Headless build** | 🟡 via -executeMethod | 🟡 via Unity batchmode | 🟡 via Unity batchmode | ✅ Docker | ✅ Cloud | ❌ |
| **Headless test execution** | 🟡 via -runTests | 🟡 via -runTests | 🟡 via -runTests | ✅ unity-test-runner | ❌ | ❌ |
| **License activation automation** | ➖ | ➖ | ➖ | ✅ Personal/Pro/floating | ✅ Cloud-managed | ➖ |
| **iOS build support** | 🟡 via BuildPlayer | 🟡 via BuildPlayer | 🟡 via BuildPlayer | ✅ (macOS runner) | ✅ | ❌ |
| **Console/web log capture** | ✅ via MCP tool | 🟡 partial | 🟡 partial | ✅ UnityLogCollectorService | ✅ Cloud dashboard | ❌ |
| **CLI for cloud services** | 🟡 ugs-cli separate | ❌ | ❌ | ➖ | ❌ | ✅ |
| **Free for non-subscription users** | 🟡 Personal trial | ✅ MIT | ✅ MIT | ✅ MIT | 🟡 Free tier limited | 🟡 Limited |
| **Documentation quality** | ✅ Official | 🟡 community | 🟡 community | ✅ deepwiki + actions README | ✅ Official | ✅ Official |
| **Maintained 2025-10 → 2026-10** | ✅ Active | ✅ Active | 🟡 less active | ✅ Active | ✅ Active | ✅ Active |

**Legend.**
- `✅` Feature confirmed present and working as of October 2026.
- `🟡` Partial, behind paywall, in beta, or limited.
- `❌` Feature absent.
- `➖` Not applicable for this tool's category.

**Strategic observations (Unity).**
1. **Unity AI is the obvious default** for studios with a Unity Pro/Enterprise/Industry subscription. The official MCP server, integrated Generators, and the AI Gateway form a coherent product. For Personal-tier or non-subscription users, the community emeryporter Unity MCP is the strongest FOSS alternative.
2. **GameCI + Unity Build Automation are not exclusive.** Studios commonly use GameCI for PR-time tests (faster) and Unity Build Automation for release builds (multi-platform without Docker). The trade-off is operational complexity vs cost.
3. **Visual Scripting is in maintenance mode** — no significant Unity VS update since 2022 ([Source 15](https://discussions.unity.com/t/visual-scripting-needs-description-bubbles-for-controls/1732666)). Studios betting on visual scripting should plan a C# migration or pick a different engine for that workflow.
4. **The ahujasid Unity MCP server is being eclipsed** by emeryporter and the official one. For new adoption, prefer the official or emeryporter.
5. **A customized coding agent in front of Unity 6.3 LTS is the most complete agent-friendly engine experience** in this report.

---

### 2. Unreal Engine automation ecosystem

**Market framing.** The Unreal Engine automation market in 2026 is fragmented: Epic has not shipped a first-party MCP server, so the community has filled the gap with at least five competing servers. The official surfaces are the Remote Control API (HTTP :30010), the Python `unreal` module, `UnrealEditor-Cmd` (headless), BuildCookRun / RunUAT (CI), and the Horde + UnrealGameSync combo (studio distribution). MCP servers sit on top of these. The "official-ish" position is that Epic's "native plugin" is in development, which is why NAJEMWEHBE unreal-ai-connection was deprecated mid-2026 in favor of Epic's plugin. ([Source 30](https://github.com/NAJEMWEHBE/unreal-ai-connection))

**Competitor roster (Unreal).**

| Tool | Maintainer | Type | Positioning |
|---|---|---|---|
| **Unreal Engine Remote Control API + Python `unreal` module** | Epic Games (first-party) | Built-in | The base layer every MCP server sits on. |
| **harn3ss unreal-engine-mcp** | Community (harn3ss) | FOSS | 105+ tools, UE 5.7, 50ms round-trips, headless build support. ([Source 27](https://glama.ai/mcp/servers/harn3ss/unreal-engine-mcp)) |
| **remiphilippe mcp-unreal** | Community (remiphilippe) | FOSS | Single Go binary, 49 tools, native UE plugin, doc index. ([Source 33](https://github.com/remiphilippe/mcp-unreal)) |
| **MCP Automation Bridge (Chirag Panwar)** | Community (Chirag Panwar) | FOSS | Native HTTP/SSE inside UE 5.7 plugin, 200+ tools across 23 groups. ([Source 31](https://forums.unrealengine.com/t/chirag-panwar-mcp-automation-bridge/2727105)) |
| **ZiggyMar unreal-mcp** | Community (ZiggyMar) | FOSS | UE 5.6/5.8, C++ plugin + TypeScript MCP server, Blueprint editing. ([Source 32](https://github.com/ZiggyMar/unreal-mcp)) |
| **codeturion unreal-api-mcp** | Community (codeturion) | FOSS | API documentation only (5.5/5.6/5.7), 109K+ records each. Not a control plane. ([Source 28](https://github.com/codeturion/unreal-api-mcp); [Source 29](https://libraries.io/pypi/unreal-api-mcp)) |
| **NAJEMWEHBE unreal-ai-connection** | Community (NAJEMWEHBE) | FOSS | 143 tools, UE 5.7, **DEPRECATED 2026-07-17** in favor of Epic's native plugin. ([Source 30](https://github.com/NAJEMWEHBE/unreal-ai-connection)) |
| **Horde + UnrealGameSync (UGS) + RoboMerge** | Epic Games (first-party) | FOSS / managed | Build, distribution, code review automation. ([Source 41](https://www.docswell.com/s/EpicGamesJapan/K2QVVE-2025-12-15-214934); [Source 40](https://www.perforce.com/blog/p4/how-to-use-unrealgamesync)) |
| **NVIDIA ACE plugins (Audio2Face-3D, ASR, LLM, TTS)** | NVIDIA + Epic | Commercial / FOSS | In-game NPC brains, facial animation, VO. UE 5.4–5.7. ([Source 46](https://windowsforum.com/news/unity-roblox-and-nvidia-ace-bring-generative-ai-into-game-development-workflows.447881/)) |

**Per-tool profiles (Unreal).**

#### Unreal Engine Remote Control API + Python `unreal` module
- **UVP:** The official, supported foundation. REST routes to read/write properties and call `UFunction`s. Python module reflects ~everything exposed to Blueprints. ([Source 27](https://glama.ai/mcp/servers/harn3ss/unreal-engine-mcp))
- **Features by category:**
  - **Remote Control API (HTTP :30010):** REST routes for property read/write, function calls, Python execution.
  - **Python `unreal` module:** Reflects engine API; grows as you enable plugins.
  - **Headless:** `UnrealEditor-Cmd` for commandlets, automation, builds.
  - **Documentation:** Epic official, well-maintained.

#### harn3ss unreal-engine-mcp
- **UVP:** The most-balanced community MCP server for UE 5.7: 105+ tools, 50ms round-trips, headless build/automation/test support, Python bridge. ([Source 27](https://glama.ai/mcp/servers/harn3ss/unreal-engine-mcp))
- **Features by category:**
  - **MCP tools (105+):** Actor spawn/edit, asset/level/Blueprint/material management, screenshots, headless builds, automation tests, editor Python execution.
  - **Transport:** stdio MCP client ↔ HTTP Remote Control API.
  - **Bridge:** `ue_mcp_bridge` pure Python in `Content/Python/init_unreal.py`.
  - **Headless:** Yes — supports headless builds and automation tests.

#### remiphilippe mcp-unreal
- **UVP:** Single Go binary with zero external dependencies, 49 tools, built-in UE API documentation index. ([Source 33](https://github.com/remiphilippe/mcp-unreal))
- **Features by category:**
  - **Single-binary MCP server:** No Node, no Python on the MCP side.
  - **Native plugin (`MCPUnreal`):** Required for advanced editor tools.
  - **Document index:** Build with `mcp-unreal --build-index`.
  - **Compatibility:** UE 5.7 (5.5/5.6 may work with the standard plugin path).

#### MCP Automation Bridge (Chirag Panwar)
- **UVP:** 200+ editor automation actions across 23 tool groups; native HTTP/SSE inside a UE 5.7 plugin; no Node.js required. ([Source 31](https://forums.unrealengine.com/t/chirag-panwar-mcp-automation-bridge/2727105))
- **Features by category:**
  - **MCP server (200+ actions, 23 tool groups):** Asset (browse/create/import/duplicate/rename/delete), Actor (spawn/transform/tags/components/physics/viewport), Level (load/save/streaming/lighting/foliage/landscape/volume), Blueprint, Material, Niagara, PCG, Sequencer, AI, audio.
  - **Transport:** Native HTTP/SSE; WebSocket bridge for external MCP servers.
  - **Auth:** Standard MCP approval flow.
  - **Status:** "In active development" — bugs expected.

#### ZiggyMar unreal-mcp
- **UVP:** First-class Blueprint editing via Kismet2/EdGraph/AssetRegistry; the C++ plugin runs inside `UnrealEditor.exe` over TCP. ([Source 32](https://github.com/ZiggyMar/unreal-mcp))
- **Features by category:**
  - **MCP tools:** Blueprint authoring, level inspection, actor spawn, editor workflows.
  - **Bridge:** `UnrealMCPBridge` C++ plugin over local TCP.
  - **Server:** Node/TypeScript MCP server with compact responses (token-aware).
  - **Compatibility:** UE 5.6 / 5.8 specifically.

#### codeturion unreal-api-mcp
- **UVP:** The only tool in the UE ecosystem that prevents the LLM from hallucinating API signatures. UE 5.5/5.6/5.7 with version-pinned databases (109K+ records each). ([Source 28](https://github.com/codeturion/unreal-api-mcp); [Source 29](https://libraries.io/pypi/unreal-api-mcp))
- **Features by category:**
  - **MCP tools:** `search_unreal_api`, `get_function_signature`, `get_include_path`.
  - **Databases:** Version-pinned SQLite (~48 MB each); auto-downloaded; weekly rebuild.
  - **Version detection:** `UNREAL_VERSION` env var or `.uproject` `EngineAssociation`.
  - **Trade-off:** Documentation only — does not drive the editor.

#### Horde + UnrealGameSync + RoboMerge
- **UVP:** Epic's first-party studio-scale build/distribution platform. Standard for UE 5.4+. ([Source 41](https://www.docswell.com/s/EpicGamesJapan/K2QVVE-2025-12-15-214934); [Source 42](https://www.docswell.com/s/EpicGamesJapan/Z6ERYX-UE_UFT2025_TOYO_PERFORCE))
- **Features by category:**
  - **Horde:** BuildGraph-native, distributed agents, Preflight, Shelve→Preflight→Submit→Auto-build→Visualization cycle; cloud or self-hosted.
  - **UnrealGameSync (UGS):** Pull-down precompiled binaries; changelist status; visual build state badges; integrates with Horde and Perforce. ([Source 40](https://www.perforce.com/blog/p4/how-to-use-unrealgamesync))
  - **RoboMerge:** Branch auto-merge.
  - **Virtual Assets (UE 5.6+):** `.uasset` split into metadata + on-demand `.upayload`; reduces sync time.
  - **Deployment:** Studio-wide. Self-host (e.g. S1T2's hybrid cloud + on-prem pattern) or managed (Universal Foundry). ([Source 43](https://forums.unrealengine.com/t/talks-and-demos-horde-on-a-budget-cost-effective-infrastructure-for-small-teams/2705272))

#### NVIDIA ACE plugins for UE 5.4–5.7
- **UVP:** In-game AI: facial animation (Audio2Face-3D), ASR, local LLM with function calling, TTS. For NPC brains and generated VO. ([Source 46](https://windowsforum.com/news/unity-roblox-and-nvidia-ace-bring-generative-ai-into-game-development-workflows.447881/))
- **Features by category:**
  - **Facial animation:** Audio2Face-3D, UE 5.4–5.6.
  - **Speech recognition (ASR):** UE 5.5–5.7.
  - **Local LLM:** With function calling; UE 5.5–5.7.
  - **TTS:** UE 5.5–5.7.

**Composite feature matrix (Unreal ecosystem).**

| Feature | Remote Control API + Python | harn3ss UE MCP | remiphilippe UE MCP | Chirag Panwar Bridge | ZiggyMar UE MCP | codeturion API MCP | Horde + UGS | NVIDIA ACE |
|---|---|---|---|---|---|---|---|---|
| **Official first-party** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | 🟡 (NVIDIA + Epic) |
| **MCP server** | ❌ (base layer) | ✅ | ✅ | ✅ | ✅ | ✅ (docs only) | ❌ | ❌ |
| **Editor Python bridge** | ✅ | ✅ | ✅ | ✅ | 🟡 | ➖ | ❌ | 🟡 |
| **UE 5.7 support** | ✅ | ✅ | ✅ | ✅ | ❌ (5.6/5.8) | ✅ | ✅ | ✅ |
| **UE 5.6 support** | ✅ | 🟡 | 🟡 | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Headless build** | ✅ RunUAT | ✅ via MCP | ✅ via MCP | 🟡 | 🟡 | ➖ | ✅ BuildGraph | ➖ |
| **Headless test (Automation Framework)** | ✅ | ✅ | 🟡 | 🟡 | 🟡 | ➖ | ✅ | ➖ |
| **Blueprint editing** | ✅ via Python | ✅ | ✅ | ✅ | ✅ (best) | ❌ | ❌ | ❌ |
| **Asset management** | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Actor/level control** | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Material/PCG/Niagara tools** | ✅ | ✅ | 🟡 | ✅ (23 groups) | 🟡 | ❌ | ❌ | ❌ |
| **API signature lookup (no hallucination)** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| **Native HTTP/SSE** | ✅ | 🟡 (HTTP via RC) | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Single-binary distribution** | ❌ | ❌ | ✅ Go | ❌ | ❌ | ✅ Python | ❌ | 🟡 |
| **Studio distribution / sync** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ UGS | ❌ |
| **NPC runtime AI (LLM/ASR/TTS)** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Maintainer health (2025-10 → 2026-10)** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Free / open source** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ UGS | 🟡 ACE = commercial plugins |

**Strategic observations (Unreal).**
1. **The UE MCP market is fragmented and moving.** Five competing servers with overlapping capability. NAJEMWEHBE's deprecation mid-2026 in favor of Epic's "native plugin" is the warning sign — Epic may ship their own MCP server in 5.8 or 6.0, obsoleting 2-3 of the current five.
2. **codeturion unreal-api-mcp is table stakes.** Every UE 5.5/5.6/5.7+ LLM agent will hallucinate signatures without it. It's a different category from the control-plane servers — use it alongside whichever you pick.
3. **harn3ss is the most balanced** for production today; remiphilippe if you want single-binary; Chirag Panwar if you want the most tools; ZiggyMar if Blueprint editing is the focus.
4. **Horde + UGS is non-negotiable for studios shipping UE 5.4+.** The Jenkins-to-Horde migration is showing up in studio job listings in 2026. ([Source 41](https://www.docswell.com/s/EpicGamesJapan/K2QVVE-2025-12-15-214934))
5. **NVIDIA ACE is a different concern** — runtime AI, not editor automation. Pair with one of the MCP servers above for the editor, and ACE for the in-game AI.
6. **UE 5.7's PCG is production-ready** ([Source 35](https://80.lv/articles/what-s-new-in-pcg-in-ue5-6-ue5-7)) — the AI content generation story in-engine, in contrast to the external Meshy/Tripo story for static assets.

---

### 3. Blender automation ecosystem

**Market framing.** The Blender automation market in 2026 is the set of tools that can drive Blender headless, drive a live Blender session, expose Blender to AI agents via MCP, or wrap the `bpy` Python module in a structured API. Blender 4.2 LTS through 5.x is the in-window line. The MCP server ecosystem has matured to the point where there are at least 8 distinct servers, each with a slightly different philosophy (typed vs catch-all, headless-first vs live-only, single-binary vs addon+server).

**Competitor roster (Blender).**

| Tool | Maintainer | Type | Positioning |
|---|---|---|---|
| **`bpy` (Blender Python API)** | Blender Foundation | First-party | The base. Headless via `blender -b --python script.py`. |
| **kleer001 blender-mcp** | Community (kleer001) | FOSS | 175 typed tools, 25 domains, 4.2.5 LTS validated. ([Source 48](https://github.com/kleer001/blender-mcp/)) |
| **djeada blender-mcp-server** | Community (djeada) | FOSS | 27 tools, 7 namespaces, headless transport. ([Source 49](https://github.com/djeada/blender-mcp-server)) |
| **dcc-mcp-blender** | Community (dcc-mcp) | FOSS | Embedded Streamable HTTP, in-process server, no gateway. ([Source 50](https://pypi.org/project/dcc-mcp-blender/0.1.8/)) |
| **YellowFoxH4XOR blender-mcp** | Community (YellowFoxH4XOR) | FOSS | Headless-first, safety/typed, no arbitrary code execution. ([Source 51](https://glama.ai/mcp/servers/YellowFoxH4XOR/blender-mcp)) |
| **josefgoeller-ship-it blender-mcp** | Community (josefgoeller-ship-it) | FOSS | Dual transport (headless + live), identical handlers. ([Source 52](https://glama.ai/mcp/servers/josefgoeller-ship-it/blender-mcp)) |
| **Wacho01/Blender-Automation-MCP** | Community (Wacho01) | FOSS | 27 tools, TCP, headless mode. ([Source 56](https://github.com/Wacho01/Blender-Automation-MCP)) |
| **ahujasid/mcp-for-blender** | Community (ahujasid) | FOSS | Most-cited pre-2026; headless bug patched in forks. ([Source 54](https://github.com/ahujasid/mcp-for-blender/issues/251)) |

**Per-tool profiles (Blender).**

#### `bpy` (Blender Python API)
- **UVP:** The canonical, version-stable Python API. Reflects the entire editor. ([Source 53](https://glama.ai/mcp/servers?query=blander))
- **Features by category:**
  - **Headless:** `blender -b --factory-startup --python script.py`.
  - **Coverage:** Modeling, animation, rendering, geometry nodes, materials, simulation, compositing.
  - **Documentation:** Excellent; Blender Foundation official.

#### kleer001 blender-mcp
- **UVP:** The most-typed implementation — 175 tools across 25 domains (objects, materials, shader nodes, geometry nodes, modifiers, animation, rigging, physics, compositing). No catch-all `execute_code` for the agent to lean on. ([Source 48](https://github.com/kleer001/blender-mcp/))
- **Features by category:**
  - **MCP tools:** 175 typed; 25 domains; integration-tested on 4.2.5 LTS.
  - **Architecture:** FastMCP-based server (separate process) + Blender addon (TCP, `bpy.app.timers`).
  - **Mock mode:** `uv run blender-mcp --mock` for testing without Blender.
  - **Compatibility:** Blender 4.0+; Python 3.10+.

#### djeada blender-mcp-server
- **UVP:** First-class headless transport alongside live; shared secret auth; 27 tools, 7 namespaces. ([Source 49](https://github.com/djeada/blender-mcp-server))
- **Features by category:**
  - **MCP tools (27):** Objects, materials, render, export, async jobs, Python execution.
  - **Transport:** TCP `localhost:9876` for live; separate `blender -b` process for headless.
  - **Security:** Shared secret token at `~/.blender-mcp/token` (mode 0600).
  - **Compatibility:** Blender 3.6+; Python 3.10+.

#### dcc-mcp-blender
- **UVP:** Embedded MCP server in-process; no external gateway; main-thread + headless dispatchers. ([Source 50](https://pypi.org/project/dcc-mcp-blender/0.1.8/))
- **Features by category:**
  - **MCP server:** Streamable HTTP; runs inside Blender's Python interpreter.
  - **Dispatchers:** `BlenderUiDispatcher` (GUI) + `BlenderHost` with `BlockingDispatcher` (headless).
  - **Headless bootstrap:** `blender --background --python src/dcc_mcp_blender/blender_bootstrap.py`.
  - **Compatibility:** MCP 2025-03-26; Blender 4.2+; platform ZIPs for Windows/Linux/macOS.

#### YellowFoxH4XOR blender-mcp
- **UVP:** Safety-first, headless-first, typed tools only. No arbitrary code execution from MCP. Deterministic. ([Source 51](https://glama.ai/mcp/servers/YellowFoxH4XOR/blender-mcp))
- **Features by category:**
  - **MCP tools:** `get_blender_status`, `inspect_scene` (versioned JSON contract), preview render.
  - **Headless:** Every call starts a fresh `blender -b` process.
  - **Compatibility:** Blender 5.2 LTS; Python 3.12; MCP Python SDK 2.x.
  - **Trade-off:** Limited tool surface (intentional). Doesn't allow arbitrary Python — better for safety-critical CI.

#### josefgoeller-ship-it blender-mcp
- **UVP:** Identical handler code on both headless and live transports — pick per call. ([Source 52](https://glama.ai/mcp/servers/josefgoeller-ship-it/blender-mcp))
- **Features by category:**
  - **MCP tools:** Scene, materials, cameras, lights, `.blend` build/inspect.
  - **Transport:** Dual — fresh `blender --background` per call (headless) or live TCP addon.
  - **Compatibility:** Blender 4.2+; Python 3.12+.

#### ahujasid/mcp-for-blender
- **UVP:** The historical reference; catch-all `execute_blender_code` is flexible but error-prone. ([Source 54](https://github.com/ahujasid/mcp-for-blender/issues/251))
- **Features by category:**
  - **MCP tools:** Catch-all code execution; live addon.
  - **Known issue:** Headless mode (`blender -b`) hangs because `bpy.app.timers` don't fire when the main thread is blocked; patched in some forks by running synchronously in the socket worker.
  - **Status:** Superseded by typed servers (kleer001, djeada) for production; remains a reference for understanding the addon+TCP pattern.

**Composite feature matrix (Blender ecosystem).**

| Feature | `bpy` | kleer001 | djeada | dcc-mcp-blender | YellowFoxH4XOR | josefgoeller-ship-it | ahujasid |
|---|---|---|---|---|---|---|---|
| **First-party** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **MCP server** | ❌ (base layer) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Typed tools (no `execute_code`)** | ➖ | ✅ (175) | 🟡 (27) | 🟡 | ✅ (small) | 🟡 | ❌ catch-all |
| **Live session control** | ✅ via addon | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| **Headless subprocess** | ✅ `blender -b` | 🟡 partial | ✅ | ✅ (Bootstrap) | ✅ (always) | ✅ | 🟡 (broken) |
| **Domain coverage** | ✅ everything | ✅ 25 domains | 🟡 7 namespaces | 🟡 | 🟡 small | 🟡 | 🟡 |
| **Geometry nodes support** | ✅ | ✅ | 🟡 | 🟡 | 🟡 | 🟡 | 🟡 |
| **Material/shader support** | ✅ | ✅ | ✅ | 🟡 | 🟡 | ✅ | 🟡 |
| **Animation/rigging support** | ✅ | ✅ | 🟡 | 🟡 | ❌ | 🟡 | 🟡 |
| **Render farm support** | ✅ Cycles+Eevee | 🟡 | ✅ | 🟡 | ✅ preview | ✅ | 🟡 |
| **Token auth / security** | ➖ | ❌ | ✅ shared secret | 🟡 | 🟡 | ❌ | ❌ |
| **Mock/test mode** | ❌ | ✅ `--mock` | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Blender 4.2 LTS support** | ✅ | ✅ (validated) | ✅ | ✅ | 🟡 (5.2 LTS) | ✅ | ✅ |
| **Blender 5.x support** | 🟡 | 🟡 | 🟡 | 🟡 | ✅ | 🟡 | 🟡 |
| **Maintainer health (2025-10 → 2026-10)** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 🟡 issues |
| **Free / open source** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

**Strategic observations (Blender).**
1. **kleer001/blender-mcp is the production default** for typed, broad-coverage work. 175 tools across 25 domains, integration-tested on 4.2.5 LTS.
2. **YellowFoxH4XOR is the safety-first choice** for CI pipelines where you don't want the agent to run arbitrary code.
3. **djeada's shared-secret auth is the only one** with explicit token-based security — important for shared infrastructure.
4. **The ahujasid headless bug is real** ([Source 54](https://github.com/ahujasid/mcp-for-blender/issues/251)). Don't deploy ahujasid for headless CI without the fix; use kleer001 or djeada instead.
5. **`bpy` is still the right choice** for one-off scripts and large batch jobs that don't need an agent loop. Use MCP servers when an LLM needs to iterate.

---

### 4. Godot automation ecosystem

**Market framing.** The Godot automation market in 2026 has the highest server-to-engine ratio in the report: at least 9 distinct MCP servers for a single engine, plus a healthy `godot --headless` CI ecosystem. Godot 4.5 (Sept 2025), 4.6 (Jan 2026), and 4.7 (Jun 2026) are the in-window releases; 4.8 is in preview. The engine removed Visual Scripting in 4.0 and has not reversed that decision, so the "code-first" stance shapes the tool ecosystem.

**Competitor roster (Godot).**

| Tool | Maintainer | Type | Positioning |
|---|---|---|---|
| **`godot` CLI + `--headless`** | Godot Engine | First-party | The base. CI-friendly export, headless script execution. |
| **aigengame/godot-agent (`gda`)** | Community (aigengame) | FOSS | Standalone CLI + Agent Skill + MCP server. Two modes (headless + live). ([Source 65](https://github.com/aigengame/godot-agent)) |
| **hybridindie/godot-mcp** | Community (hybridindie) | FOSS | 193 tools / 29 categories, container on `ghcr.io/hybridindie/godot-mcp`. ([Source 59](https://github.com/hybridindie/godot-mcp)) |
| **yanhuifair/Godot-MCP** | Community (yanhuifair) | FOSS | 386 tools / 30 categories — largest count. ([Source 62](https://github.com/yanhuifair/Godot-MCP)) |
| **tugcantopaloglu/godot-mcp** | Community (tugcantopaloglu) | FOSS | 157 tools, headless GDScript, TCP runtime, GDScript diagnostics. ([Source 63](https://github.com/tugcantopaloglu/godot-mcp)) |
| **wgt19861219/godot-mcp-enhanced** | Community (wgt19861219) | FOSS | 33 tools / 199 actions, 3-layer (headless + Editor + Game Bridge). ([Source 58](https://github.com/wgt19861219/godot-mcp-enhanced)) |
| **Godot Editor MCP (Asset Library)** | Community | FOSS | 180 tools / 29 categories, WebSocket. ([Source 57](https://godotengine.org/asset-library/asset/5434)) |
| **sandraschi/godot-mcp** | Community (sandraschi) | FOSS | 95+ tools, FastMCP, deterministic playtesting, Game Builder. ([Source 61](https://github.com/sandraschi/godot-mcp)) |
| **Fulviuus/godot-mcp-server** | Community (Fulviuus) | FOSS | Toolchain management (auto-resolve binary, download templates), Godot 4.7. ([Source 64](https://glama.ai/mcp/servers/Fulviuus/godot-mcp/tree)) |
| **regiellis/godot-mcp-go (`swallowtail`)** | Community (regiellis) | FOSS | CLI-first, `swallowtail launch` opens editor. ([Source 60](https://github.com/regiellis/godot-mcp-go)) |
| **godot-prompter (skill pack)** | Community | FOSS | 48 skills + 9 agents for Claude Code. ([Source 66](https://www.claudepluginhub.com/blog/claude-code-plugins-for-godot)) |
| **godot-devtool (MCP server + skills)** | Community | FOSS | Scene authoring, live editor, headless validation, project export. ([Source 66](https://www.claudepluginhub.com/blog/claude-code-plugins-for-godot)) |
| **better-godot-mcp** | Community | FOSS | Skill pack + MCP server; scaffolds platformer/overhead mechanics. ([Source 66](https://www.claudepluginhub.com/blog/claude-code-plugins-for-godot)) |
| **GUT (Godot Unit Test)** | Community | FOSS | Headless test runner. `godot --headless -s addons/gut/gut_cmdln.gd -gdir=res://test -gexit`. |
| **Orchestrator (GDExtension)** | Community | FOSS | Blueprints-style visual scripting (v2.5, Jul 2026). ([Source 47](https://egmatic.com/blog/visual-scripting-engines-compared)) |

**Per-tool profiles (Godot).**

#### aigengame/godot-agent (`gda`)
- **UVP:** The most production-shaped entry in the Godot ecosystem. Standalone `gda` CLI + bundled Agent Skill + MCP server. Two complementary modes (headless, live). MCP 2026-07-28 spec aware. ([Source 65](https://github.com/aigengame/godot-agent))
- **Features by category:**
  - **CLI (`gda`):** scene/node/script/resource/project/shader/theme, script validate, scene validate, scene preflight, export.
  - **MCP server:** Same operations exposed as MCP tools via `gda-mcp`.
  - **Modes:** Headless (one-shot processes) or Live (`gda-daemon` injects bridge into running game).
  - **Compatibility:** Python 3.13+; Godot 4.4+ headless, 4.6+ live.

#### hybridindie/godot-mcp
- **UVP:** Container-distributed, 193 tools, 28 toggleable toolsets (only `inspection` enabled by default for safety). PyPI as `godot-editor-mcp`. ([Source 59](https://github.com/hybridindie/godot-mcp))
- **Features by category:**
  - **MCP tools (193, 29 categories):** Always-on `core` + 28 toggleable; gated on-demand.
  - **Distribution:** PyPI + container (`ghcr.io/hybridindie/godot-mcp`).
  - **Compatibility:** Godot 4.4+ (4.7 validated).

#### yanhuifair/Godot-MCP
- **UVP:** Largest tool count (386) and category count (30); full Godot 4.x coverage. ([Source 62](https://github.com/yanhuifair/Godot-MCP))
- **Features by category:**
  - **MCP tools (386, 30 categories):** Scene, scripts, networking, 3D/2D rendering, UI, audio, animation, file I/O, runtime code, property inspection, signal management, physics, project creation, export presets.
  - **Compatibility:** Godot 4.x.

#### tugcantopaloglu/godot-mcp
- **UVP:** Headless GDScript operations + TCP runtime interaction + GDScript diagnostics. ([Source 63](https://github.com/tugcantopaloglu/godot-mcp))
- **Features by category:**
  - **MCP tools (157):** Networking, 3D/2D, UI, audio, animation, runtime code, scenes, signals, physics, project creation.
  - **Transport:** Headless CLI (`godot --headless --script godot_operations.gd`) + TCP runtime.
  - **Diagnostics:** `validate_script`, `validate_scripts` (git-changed or project-wide).
  - **Compatibility:** Godot 4.4+ (4.7 tested).

#### wgt19861219/godot-mcp-enhanced
- **UVP:** Three-layer architecture (headless CLI + Editor WebSocket + Game Bridge TCP) plus recording and frame-verify. ([Source 58](https://github.com/wgt19861219/godot-mcp-enhanced))
- **Features by category:**
  - **MCP tools (33 / 199 actions):** `run_and_verify`, `execute_gdscript`, `export_list_presets`, `export_get_preset`, `export_build`.
  - **Web export:** `npx godot-mcp-enhanced web .` — auto-install export templates, export, serve on `127.0.0.1`.
  - **Sandbox:** Secure sandbox; cross-version CI.

#### Godot Editor MCP (Asset Library)
- **UVP:** Distributed via the official Godot Asset Library; auto-reconnecting WebSocket; GUT support. ([Source 57](https://godotengine.org/asset-library/asset/5434))
- **Features by category:**
  - **MCP tools (180, 29 categories):** Inspection, scene editing, scripts, physics, runtime, testing, debugging.
  - **Connection:** WebSocket; addon dials out (editor and server can start in either order).
  - **Test runner:** GUT 9.3–9.7+.

#### regiellis/godot-mcp-go (`swallowtail`)
- **UVP:** CLI-first; MCP is a `serve` subcommand, not the primary surface. `swallowtail launch` opens the editor and refuses to stack a second instance. ([Source 60](https://github.com/regiellis/godot-mcp-go))
- **Features by category:**
  - **CLI:** Terminal-first; reuses the same command handlers.
  - **MCP serve:** stdio or editor HTTP endpoint.
  - **Launch:** Refuses second editor; logs to `.godot/swallowtail-launch.log`.

**Composite feature matrix (Godot ecosystem).**

| Feature | `godot` CLI | gda (aigengame) | hybridindie | yanhuifair | tugcantopaloglu | wgt19861219 | sandraschi | Fulviuus | regiellis |
|---|---|---|---|---|---|---|---|---|---|
| **First-party** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **MCP server** | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Standalone CLI (non-MCP)** | ✅ | ✅ `gda` | ❌ | ❌ | ❌ | ❌ | 🟡 `just` | ✅ | ✅ `swallowtail` |
| **Headless mode** | ✅ `--headless` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Live editor control** | ❌ | ✅ via daemon | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Runtime game control** | ❌ | ✅ inject bridge | ✅ | 🟡 | ✅ TCP | ✅ Game Bridge | ✅ | 🟡 | 🟡 |
| **Tool count** | n/a | many | 193 | 386 | 157 | 33 | 95+ | many | many |
| **GDScript diagnostics** | ❌ | ✅ validate | 🟡 | 🟡 | ✅ `validate_script` | 🟡 | ✅ | 🟡 | 🟡 |
| **Auto-resolve Godot binary** | ❌ | 🟡 GDA_GODOT | ❌ | ❌ | ❌ | 🟡 | ✅ | ✅ | ✅ |
| **Auto-download export templates** | ❌ | ❌ | ❌ | ❌ | ❌ | 🟡 | ✅ | ✅ | ❌ |
| **Headless web export** | 🟡 manual | ❌ | ❌ | ❌ | ❌ | ✅ `npx ... web` | ❌ | ✅ | ❌ |
| **Toggleable toolsets (safety)** | ➖ | 🟡 | ✅ 28 toggleable | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **MCP 2026-07-28 spec era** | n/a | ✅ both | 🟡 | 🟡 | 🟡 | 🟡 | 🟡 | 🟡 | 🟡 |
| **Godot 4.7 support** | ✅ | ✅ (4.6+ live) | ✅ validated | ✅ | ✅ tested | ✅ 4.5–4.7 | ✅ | ✅ | ✅ (4.3–4.8 beta) |
| **Free / open source** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

**Strategic observations (Godot).**
1. **aigengame `gda` is the production default** for teams building an agent pipeline. CLI + MCP + live/headless dual mode + MCP 2026-07-28 spec aware.
2. **The ecosystem is the most fragmented of any engine.** 9+ MCP servers is too many; expect 2-3 to consolidate by 2027 as MCP 2026-07-28 forces refactors.
3. **For pure coverage, yanhuifair wins on tool count** (386). For safety, hybridindie wins on toggleable toolsets.
4. **`godot-prompter` (skill pack) is the easiest on-ramp** for teams already using Claude Code — 48 skills + 9 agents covering GDScript, C#, 2D/3D, multiplayer, etc. ([Source 66](https://www.claudepluginhub.com/blog/claude-code-plugins-for-godot))
5. **Orchestrator is the only visual scripting option** for Godot, and it works, but the community is GDScript-first. Pick Orchestrator only if you have a designer-heavy team.
6. **Godot 4.7's Jolt-as-default + HDR + AreaLight3D** ([Source 69](https://app.cinevva.com/news/2026-06-19-godot-4-7-released)) closes a real gap with Unity/Unreal on 3D. Pair with PCG-style procedural generation in Geometry Nodes for an agent-driven content pipeline.

---

### 5. Phaser 3 automation ecosystem

**Market framing.** The Phaser 3 automation market in 2026 is shaped by Phaser Studio's product strategy: the framework is free and MIT-licensed, but Phaser Editor v5 (commercial, $12/mo) and the Phaser Game Agent (hosted, $0.01/min) are the official agent surfaces. Phaser 3 itself is fully maintained (Phaser 4 is the current line, with 3 supported for "no-pressure migration"). The "no first-party CLI" gap is real — most teams use Next.js + npm + Playwright for CI.

**Competitor roster (Phaser 3).**

| Tool | Maintainer | Type | Positioning |
|---|---|---|---|
| **Phaser framework (npm + CDN)** | Phaser Studio | FOSS (MIT) | The base. npm-installable; TypeScript types; CLI via npm scripts. |
| **Phaser Editor v5 (with built-in MCP server)** | Phaser Studio | Commercial $12/mo | In-editor MCP (40+ tools), in-editor AI Chat, full Phaser 4 support, Phaser 3 compatible. ([Source 76](https://phaser.io/news/2026/04/phaser-editor-v5-release)) |
| **Phaser Game Agent** | Phaser Studio | Hosted, $0.01/min | One-prompt full game (2D Arcade, Vector, 3D). MCP server for Claude/Cursor/Copilot. ([Source 78](https://phaser.io/news/2026/07/phaser-game-agent-mcp-setup)) |
| **Phaser Desktop (browser workstation)** | Phaser Studio | Free (browser-based) | Monaco editor, AI Image/Music/SFX/Texture Generators, Tilemap Editor, MCP-aware. ([Source 79](https://phaser.io/news/2026/05/introducing-the-phaser-desktop-a-game-making-workstation-built-by-game-makers)) |
| **Phaser skills bundle (official)** | Phaser Studio | FOSS | AI agent skills covering scenes, physics, input, animations, tilemaps, tweens, particles, cameras. ([Source 83](https://codex.danielvaughan.com/2026/05/10/codex-cli-game-prototyping-godot-phaser-browser-games-agent-skills/)) |
| **Next.js + Phaser + Playwright (community CI pattern)** | Community | FOSS | `npm run dev` + `npx playwright test` for visual verification. ([Source 83](https://codex.danielvaughan.com/2026/05/10/codex-cli-game-prototyping-godot-phaser-browser-games-agent-skills/)) |
| **Phaser Editor v5 Plugin Template** | Phaser Studio | FOSS | Starting point for third-party editor plugins. |

**Per-tool profiles (Phaser 3).**

#### Phaser framework
- **UVP:** The base — open-source, MIT, JavaScript/TypeScript, npm-installable, one-click publishing via the Phaser Studio cloud. ([Source 82](https://www.itechguides.com/products/phaser/))
- **Features by category:**
  - **Distribution:** npm, CDN, Capacitor, Colyseus.
  - **Editor integrations:** VS Code, Phaser Editor.
  - **Asset support:** Audio, video, images, tilemaps; custom builds and plugins.

#### Phaser Editor v5 (with built-in MCP server)
- **UVP:** The first browser/JS game engine with a first-party in-editor MCP server. 40+ tools, one-click config for Claude Desktop / Cursor / GitHub Copilot / VS Code. Phaser 4 + Phaser 3 compatible. ([Source 76](https://phaser.io/news/2026/04/phaser-editor-v5-release); [Source 77](https://docs.phaser.io/phaser-editor/intro/changelog))
- **Features by category:**
  - **MCP server (40+ tools):** Scene development, object naming, layer reorganization, particle emitter generation, scene+code feature implementation. ([Source 75](https://phaser.io/news/2026/02/phaser-editor-v5-beta))
  - **Built-in AI Chat:** Multi-model (Gemini, Claude, Cursor, any OpenAI-compatible, OpenRouter); drag-and-drop assets for context.
  - **Visual Scene Editor:** Unbox Prefab, Render in Editor (H toggle), prefab Outline colors, Tileset Info Tool, rounded rectangle.
  - **Enterprise:** Prefab and User Component constraints; auto-discovery; JSON / Game Object Reference / Array user property types; Description sections.
  - **Compatibility:** Phaser 4 (full) + Phaser 3 (fully maintained).
  - **Pricing:** $12/mo (active subscriber).

#### Phaser Game Agent
- **UVP:** "Describe a game, walk away, get a playable." Hosted service that builds code + art + music, publishes a preview, emails when ready. The first commercial "one-prompt full game" service for a 2D engine. ([Source 80](https://www.linkedin.com/posts/phaser-studio_today-were-launching-something-weve-been-activity-7476355024558874624-oA_Z); [Source 78](https://phaser.io/news/2026/07/phaser-game-agent-mcp-setup))
- **Features by category:**
  - **Modes:** 2D Arcade, Vector (polygon/destructible), 3D (kart racers, rail shooters, FPS).
  - **MCP server:** Connects to Claude Code, Cursor, Copilot, Codex, Gemini CLI, Windsurf.
  - **Workflow:** Setup prompt installs CLI, detects coding-agent CLIs, browser sign-in, writes MCP config; second prompt builds the game.
  - **Pricing:** Free setup; $0.01/min build time.
  - **Output:** Shareable play URL; export for Web, Windows, macOS, Linux.

#### Phaser Desktop (browser workstation)
- **UVP:** Complete in-browser desktop environment for Phaser development. Monaco editor, Pixel Artist, Tilemap Editor, AI asset generators. ([Source 79](https://phaser.io/news/2026/05/introducing-the-phaser-desktop-a-game-making-workstation-built-by-game-makers))
- **Features by category:**
  - **Coding:** Monaco editor with Phaser API typings, Examples Browser, API docs, File Explorer, JSON/Markdown editors, Project Hub.
  - **Assets:** Pixel Artist, Tilemap Editor, Texture Atlas Creator, Seamless Texture Generator, Sprite sheet extractor, background remover, image editor, palette builder, Arcade Physics Editor.
  - **AI tools:** Image, Music, SFX, Seamless Texture Generators.
  - **MCP:** Aware; "opening these tools open via MCP for AI Agent support" planned.
  - **Pricing:** Free.

#### Phaser skills bundle (official)
- **UVP:** Official Phaser repository ships AI agent skills covering scenes, physics, input, animations, tilemaps, tweens, particles, cameras. Drop-in for Claude Code / Codex / any agent that reads skills. ([Source 83](https://codex.danielvaughan.com/2026/05/10/codex-cli-game-prototyping-godot-phaser-browser-games-agent-skills/))
- **Features by category:**
  - **Skill format:** Standard agent-skill files.
  - **Coverage:** Phaser 3.80+ APIs.

#### Next.js + Phaser + Playwright (community CI pattern)
- **UVP:** The de-facto CI pattern when there's no first-party CLI. `npm run dev` + `npx playwright test`. ([Source 83](https://codex.danielvaughan.com/2026/05/10/codex-cli-game-prototyping-godot-phaser-browser-games-agent-skills/))
- **Features by category:**
  - **Pattern:** Next.js 15 + Phaser 3.80+ + TypeScript strict.
  - **Tests:** Playwright visual + interaction tests.
  - **Architecture:** One `Phaser.Scene` per state (Boot, Menu, Play, GameOver). Config in `src/config/game.config.ts`.

**Composite feature matrix (Phaser 3 ecosystem).**

| Feature | Phaser framework | Phaser Editor v5 MCP | Phaser Game Agent | Phaser Desktop | Phaser skills | Next.js + Playwright CI |
|---|---|---|---|---|---|---|
| **First-party** | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Open source** | ✅ MIT | ❌ (commercial) | ❌ (hosted) | ❌ (closed) | ✅ | ✅ |
| **MCP server** | ❌ | ✅ 40+ tools | ✅ (for agent) | 🟡 planned | ❌ (skill file) | ❌ |
| **AI assistant (in-editor or hosted)** | ❌ | ✅ in-editor | ✅ hosted | ✅ AI generators | ❌ | ❌ |
| **Asset generation (AI)** | ❌ | 🟡 via AI Chat | ✅ code+art+music | ✅ Image/Music/SFX/Texture | ❌ | ❌ |
| **3D support** | ❌ (Phaser 4 has 3D) | ✅ Phaser 4 | ✅ Game Agent 3D | 🟡 | 🟡 | 🟡 |
| **TypeScript types** | ✅ | ✅ | n/a | ✅ Monaco | ✅ | ✅ |
| **Headless build** | ❌ | ❌ | ✅ hosted | ❌ | ❌ | ❌ (relies on Next.js) |
| **Headless test** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ Playwright |
| **Visual regression** | ❌ | 🟡 partial | 🟡 hosted preview | ❌ | ❌ | ✅ Playwright |
| **One-prompt full game** | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| **Skill pack for AI agents** | 🟡 via skills bundle | 🟡 via Chat | n/a | n/a | ✅ | 🟡 |
| **Multi-model** | n/a | ✅ Gemini/Claude/Cursor/OpenAI/OpenRouter | ✅ via MCP | n/a | n/a | n/a |
| **Pricing** | Free | $12/mo | $0.01/min | Free | Free | Free |

**Strategic observations (Phaser 3).**
1. **Phaser Studio has built the most complete agent story** of any engine — in-editor MCP, in-editor AI Chat, hosted Phaser Game Agent, browser-based Desktop, skill bundle. The 12-month bet on AI integration shows.
2. **The missing piece is a first-party CLI** for headless build/test. Teams piece this together with Next.js + Playwright.
3. **Phaser 3 is fully supported** — teams do not need to migrate to Phaser 4. Editor v5 is the only major-version upgrade you'd take.
4. **The Phaser Game Agent's $0.01/min** is competitive for prototyping but doesn't replace a real build pipeline for production.
5. **Phaser Desktop's MCP exposure is planned** but not shipped as of October 2026 — when it does, this stack becomes even stronger.

---

### 6. Construct 3 automation ecosystem

**Market framing.** The Construct 3 automation market in 2026 is dominated by community-driven tooling because Scirra has not shipped a first-party CLI for headless export. The official surfaces are the in-browser editor (event sheets, JavaScript/TypeScript scripting), the Addon SDK v2 (mandatory since r450), and the Construct Game Services (cloud save, multiplayer, analytics). The standout third-party tool is `liauw-media/construct3-mcp` (v1.10.0), which provides editor-faithful MCP server + Chrome DevTools Protocol runtime tools.

**Competitor roster (Construct 3).**

| Tool | Maintainer | Type | Positioning |
|---|---|---|---|
| **Construct 3 editor (in-browser)** | Scirra | Commercial | The base. Event sheets, JS/TS scripting, instant preview. |
| **Construct 3 Addon SDK v2** | Scirra | FOSS (MIT) | Plugin/behavior/effect/theme authoring. Mandatory since r450. ([Source 86](https://www.construct.net/en/make-games/releases/stable/r458)) |
| **Construct 3 JavaScript/TypeScript scripting API** | Scirra | FOSS | Module-based, IRuntime gateway. |
| **liauw-media/construct3-mcp** | Community (liauw-media) | FOSS (MIT) | MCP server with editor-faithful writes + CDP runtime tools. v1.10.0. ([Source 87](https://github.com/liauw-media/construct3-mcp)) |
| **XHXIAIEIN/Construct3-Copilot** | Community (XHXIAIEIN) | FOSS | Claude Code plugin for Construct 3 clipboard JSON generation. ([Source 89](https://github.com/XHXIAIEIN/Construct3-Copilot)) |
| **ToadLobe/c3-skill** | Community (ToadLobe) | FOSS | AI agent skill for C3 scripting API. ([Source 90](https://github.com/ToadLobe/c3-skill)) |
| **kindeyegames C3 3D Bundle** | Community (kindeyegames) | Commercial (itch.io) | glTF Model, glTF Lights, glTF Environment, Rapier 3D Physics. ([Source 95](https://kindeyegames.itch.io/c3-3d-bundle)) |
| **PokiSDK for Construct 3** | Community (Ossama Jouini) | FOSS | Poki integration. ([Source 96](https://developers.poki.com/guide/sdk-construct3)) |
| **EstebanForge/construct-cli** | Community (EstebanForge) | FOSS | Single-binary agent sandbox (not Construct 3 specific). ([Source 97](https://github.com/EstebanForge/construct-cli)) |
| **Scirra GitHub org (Construct-Addon-SDK, Steamworks plugin, etc.)** | Scirra | FOSS | Official SDK + wrappers. ([Source 94](https://github.com/orgs/Scirra/repositories)) |

**Per-tool profiles (Construct 3).**

#### Construct 3 editor
- **UVP:** The most popular 2D game engine by market share for hobbyists and indie. In-browser, no install. ([Source 91](https://bugnet.io/blog/construct-3-game-engine); [Source 92](https://egmatic.com/blog/construct-3-review-worth-subscription))
- **Features by category:**
  - **Editor:** Event sheets, layouts, mesh editor, onion-skinning, unlimited timelines (paid).
  - **Behaviors:** Platform, physics, pathfinding, 8-direction, scroll-to, sine wave (built-in).
  - **Asset library:** 137 free asset packs (48,942 files); 27 premium (7,078 files) on paid.
  - **Exports:** Web (HTML5), desktop (Windows WebView2, macOS WKWebView, Linux CEF), iOS, Android (Cordova). NW.js removed in r450.
  - **r458 highlights (2026):** Cloud save via Construct Game Services, WebGPU default, free edition allows unlimited lines of code. ([Source 85](https://www.construct.net/en/make-games/releases/stable/r458))
  - **r487.3 current stable, r489 beta** (per Egmatic).
  - **Scripting:** JavaScript modules by default since r226; TypeScript via external editor setup.

#### liauw-media/construct3-mcp
- **UVP:** The de-facto community MCP server. Editor-faithful writes, backups, validation that mirrors editor load-time checks, Chrome DevTools Protocol runtime tools. v1.10.0. ([Source 87](https://github.com/liauw-media/construct3-mcp))
- **Features by category:**
  - **MCP tools (project):** `update_project_metadata`, `register_addon`, `unregister_addon`, full structure read, addon listing.
  - **MCP tools (validation):** `validate_project` enforces editor load-time checks.
  - **MCP tools (runtime):** `serve_preview`, `connect_to_game` (over CDP), `call_bridge`, `wait_for_condition`, `subscribe_events`, `simulate_input`, `screenshot_game`.
  - **Safety:** Editor-faithful writes; `.bak` files (controlled); event sheet validation that mirrors editor.
  - **Requirements:** Node.js 22+ (for runtime tools); Chrome/Edge.
  - **Limitations:** Cannot export or preview (only the editor does that); cannot install addons (only registers them in `usedAddons`); bridge must be removed before shipping.

#### XHXIAIEIN/Construct3-Copilot
- **UVP:** Claude Code plugin that generates Construct 3 clipboard JSON from natural language and pastes directly into the editor. ([Source 89](https://github.com/XHXIAIEIN/Construct3-Copilot))
- **Features by category:**
  - **Architecture:** Three repos — Copilot (plugin), RAG (port 8765), Clipboard (port 8766).
  - **Skills:** `/c3-create`, `/c3-search`, `/c3-validate`, `/c3-addon`.
  - **Output:** `layouts`, `object-types`, `events`, `world-instances`.
  - **Setup:** `bash .claude/plugins/construct3-copilot/scripts/infra/setup.sh`.

#### ToadLobe/c3-skill
- **UVP:** Lightweight AI agent skill for Construct 3 scripting. ([Source 90](https://github.com/ToadLobe/c3-skill))
- **Features by category:**
  - **Installation:** `npx skills install ToadLobe/c3-skill`.
  - **Invocation:** `/c3-skill` (explicit) or auto-applied on C3 scripting questions.
  - **Knowledge:** Construct 3 scripting API.

#### kindeyegames C3 3D Bundle
- **UVP:** Brings real 3D into Construct 3 via glTF models, PBR materials, lighting, and Rapier 3D physics (WASM, worker thread). ([Source 95](https://kindeyegames.itch.io/c3-3d-bundle))
- **Features by category:**
  - **glTF Model plugin:** Skeletal animations with crossfade blending, skinned meshes, PBR materials, multiple instances.
  - **glTF Lights:** Spotlight, point light; spot/point switching; per-light range/cone/colors.
  - **glTF Environment:** Ambient + hemisphere lighting; sky/ground colors.
  - **Rapier 3D Physics:** Rigid bodies (dynamic/fixed/kinematic), collision shapes, raycasting, character controller, joints, CCD. WebAssembly on a worker thread.
  - **Compatibility:** Construct 3 r485 (beta).

#### EstebanForge/construct-cli
- **UVP:** Single-binary CLI that boots a clean, isolated sandboxed container preloaded with AI agents. Not Construct 3 specific but useful for sandboxed Construct 3 editing sessions. ([Source 97](https://github.com/EstebanForge/construct-cli))
- **Features by category:**
  - **Agents:** Codex, Antigravity, Claude Code, Copilot, Pi, OpenCode, Amp, Qwen Code, Cline, Droid, Goose, Crush, Kilo Code, and more.
  - **Sandbox:** Docker, Podman, or macOS native container; network isolation modes.
  - **Headless browser:** Agent Browser for headless browser automation.

**Composite feature matrix (Construct 3 ecosystem).**

| Feature | Construct 3 editor | Addon SDK v2 | construct3-mcp | Construct3-Copilot | c3-skill | kindeyegames 3D Bundle | construct-cli |
|---|---|---|---|---|---|---|---|
| **First-party** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **MCP server** | ❌ | ❌ | ✅ | ❌ (uses MCP) | ❌ (skill) | ❌ | ❌ |
| **Headless export** | ❌ (editor only) | n/a | ❌ (serves exported folder) | ❌ | ❌ | n/a | ❌ |
| **Headless test (CDP)** | 🟡 preview | n/a | ✅ runtime tools | ❌ | ❌ | n/a | 🟡 browser |
| **Clipboard JSON gen from NL** | ❌ | n/a | ❌ | ✅ | ❌ | n/a | ❌ |
| **AI assistant in editor** | ❌ | n/a | ❌ | ❌ | ❌ | n/a | 🟡 via sandbox |
| **AI agent skill** | ❌ | 🟡 | n/a | ✅ (4 skills) | ✅ (1 skill) | n/a | n/a |
| **Real 3D support** | ❌ (2D engine) | n/a | n/a | n/a | n/a | ✅ glTF + Rapier | n/a |
| **Addon SDK** | n/a | ✅ | ❌ | ✅ /c3-addon | ✅ | n/a | n/a |
| **TypeScript** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Cloud save** | ✅ CGS | n/a | 🟡 | n/a | n/a | n/a | n/a |
| **Auto-validation (editor load-time rules)** | ✅ editor | n/a | ✅ `validate_project` | ✅ `/c3-validate` | n/a | n/a | n/a |
| **Sandbox for agent execution** | ❌ | n/a | ❌ | ❌ | ❌ | n/a | ✅ |
| **Open source** | ❌ (closed) | ✅ MIT | ✅ MIT | ✅ | ✅ | ❌ (commercial) | ✅ |
| **Active 2025-10 → 2026-10** | ✅ r458→r487.3 | ✅ | ✅ v1.10.0 | ✅ | ✅ | ✅ | ✅ |

**Strategic observations (Construct 3).**
1. **liauw-media/construct3-mcp is the de-facto standard.** A team picking one tool for an agent pipeline should start here. Editor-faithful writes + runtime tools over CDP is a strong combination.
2. **The single biggest gap is no public headless export CLI.** An agent can edit, run, screenshot, but cannot ship a build. This is the one thing to push Scirra to add.
3. **The three-agent-tool pattern (Copilot + c3-skill + construct3-mcp)** is the most complete stack today. Copilot generates clipboard JSON; c3-skill answers scripting questions; construct3-mcp reads/writes the project.
4. **Construct 3 is positioning for real 3D via the kindeyegames bundle.** Worth watching but not a reason to choose C3 over Unity/Unreal/Godot for 3D-heavy work.
5. **r458 retired several legacy features** (NW.js, Windows 32-bit, Linux ARM 32-bit, flat export, file scheme). Adopt r450+ for new projects; the LTS r449.x is supported through end of 2026. ([Source 85](https://www.construct.net/en/make-games/releases/stable/r458))
6. **WebGPU is now default** in the editor and runtime, which matters for AI-generated visual effects and large 2D scenes. ([Source 85](https://www.construct.net/en/make-games/releases/stable/r458))

---

## Part II — Per-use-case decision matrices

This section cuts the same tool universe by use case instead of by engine. For each workflow, a tool roster, a per-tool UVP (compressed), a decision matrix with the standard legend, and a recommendation.

---

### Use case 1: AI-driven 3D asset generation (mesh + texture + rigging)

**Framing.** Generate static or rigged 3D assets for game engines. Input: text or image. Output: textured mesh, optionally rigged and animated. The 2026 market is mature for stylized and prop work; hero characters still need a modeler.

**Tool roster.**

| Tool | Type | Pricing (Oct 2026) | Best for |
|---|---|---|---|
| **Meshy 5/6/7** | Hosted | $20/mo Pro | Full pipeline; auto-rig + 500+ animation presets; 8 export formats |
| **Tripo 3D / Tripo P1** | Hosted | $19.90/mo Pro | Speed + clean quad topology; non-humanoid creature rigging (Feb 2026+) |
| **Rodin Gen-2.5 (Hyper3D)** | Hosted | $30/mo Creator | Hero asset detail; 10M+ polygon output; pay-to-download |
| **CSM Cube 2** | Hosted | n/a | Retopology / quad remesh |
| **3D AI Studio** | Hosted | n/a | All-in-one; multi-engine export (Unity, Unreal, Godot, Roblox) |
| **Hi3D (Hitem3D)** | Hosted | n/a | 3D-print pipelines, finest surface detail |
| **Microsoft TRELLIS.2** | Open weights | Free (self-host) | Image-to-3D, self-hosted |
| **Hunyuan 3D 2.1** | Open weights | Free (self-host) | Text-to-3D, open weights |
| **Adobe Substance 3D** | Commercial | Subscription | Hand-refined hero assets |
| **Unity 3D Object Generator (Hunyuan 3D)** | Integrated in Unity AI | Unity Points | Inside Unity 6.3+ editor |
| **NVIDIA Audio2Face-3D (UE)** | Plugin | Commercial | Facial animation, not mesh gen |

Sources: [Source 115](https://www.meshy.ai/blog/hi3d-vs-meshy-vs-tripo); [Source 116](https://www.strayspark.studio/blog/generative-3d-tools-comparison-meshy-rodin-tripo-csm-2026); [Source 117](https://app.cinevva.com/guides/ai-asset-generators-games); [Source 118](https://www.3daistudio.com/blog/best-ai-game-asset-generators-2026); [Source 119](https://www.meshy.ai/blog/best-ai-tools-for-3d-game-assets); [Source 120](https://www.tripo3d.ai/blog/ai-3d-asset-pipeline-for-game-studios); [Source 121](https://app.cinevva.com/guides/ai-3d-model-generators); [Source 122](https://www.tripo3d.ai/blog/ai-3d-for-indie-devs); [Source 123](https://www.krea.ai/blog/best-ai-3d-model-generators-2026).

**Decision matrix.**

| Criteria | Meshy | Tripo | Rodin | CSM | 3D AI Studio | Hi3D | TRELLIS.2 | Hunyuan 3D 2.1 | Substance | Unity 3D Gen |
|---|---|---|---|---|---|---|---|---|---|---|
| **Text-to-3D** | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ (image) | ✅ | ❌ | ✅ |
| **Image-to-3D** | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| **Auto-rig** | ✅ | ✅ (creatures since Feb 2026) | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Animation presets** | ✅ 500+ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **PBR textures** | ✅ | ✅ | ✅ up to 4K | n/a | ✅ | ✅ | 🟡 | 🟡 | ✅ | 🟡 |
| **Quad remesh** | ✅ | ✅ (Smart Mesh) | ❌ (use CSM) | ✅ (purpose-built) | ✅ | ❌ | ❌ | ❌ | n/a | ❌ |
| **Unity export** | ✅ | ✅ | ✅ | n/a | ✅ | ✅ | n/a | n/a | ✅ FBX | n/a (in-editor) |
| **Unreal export** | ✅ | ✅ | ✅ | n/a | ✅ | ✅ | n/a | n/a | ✅ FBX | ❌ |
| **Godot export** | ✅ | 🟡 | ✅ | n/a | ✅ | ✅ | n/a | n/a | ✅ FBX/GLB | ❌ |
| **Roblox export** | ❌ | ❌ | ❌ | n/a | ✅ | ❌ | n/a | n/a | ❌ | ❌ |
| **Free tier** | ✅ CC BY 4.0 | ✅ non-commercial | ✅ generate free | n/a | 🟡 | 🟡 | ✅ (self-host) | ✅ (self-host) | ❌ | 🟡 Unity Points |
| **Commercial use on free** | ❌ | ❌ | 🟡 pay-to-download | n/a | 🟡 | 🟡 | ✅ | ✅ | ❌ | ❌ |
| **API** | ✅ | ✅ | ✅ (API-first) | n/a | ✅ | 🟡 | ✅ | ✅ | ❌ | n/a (in-editor) |
| **Open source / open weights** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ |

**Recommendation.**
- **For a customized coding agent picking one tool:** **Meshy 5/6/7** is the safest default — text + image, auto-rig, 500+ animation presets, 8 export formats, API access. $20/mo Pro is competitive.
- **For bulk iteration:** **Tripo 3D** is faster and produces cleanest quad topology. Pair with Meshy for the final pass.
- **For hero characters:** **Rodin Gen-2.5** has the best detail; budget for retopology with CSM Cube 2.
- **For self-hosted / open-weights:** **TRELLIS.2 (image-to-3D)** or **Hunyuan 3D 2.1 (text-to-3D)**.
- **For Unity-only studios:** the **Unity 3D Object Generator** (Hunyuan 3D inside Unity AI) keeps everything in-editor and tagged with `UnityAI` metadata.
- **For the 2026 indie pipeline per StraySpark:** Tripo P1 blockout → Meshy 5 or Rodin Gen-2 final pass → CSM Cube 2 or Blender retopology → Substance/Meshy texture → Blender polish → import via engine MCP. ([Source 116](https://www.strayspark.studio/blog/generative-3d-tools-comparison-meshy-rodin-tripo-csm-2026))

---

### Use case 2: AI-driven 2D / sprite / texture asset generation

**Framing.** Generate sprites, icons, UI elements, textures, and 2D art. Input: text or image. Output: PNG, PSD, PBR texture set.

**Tool roster.**

| Tool | Type | Best for |
|---|---|---|
| **Unity Sprite Generator** | Integrated in Unity AI | Sprites, icons, animation-ready spritesheets inside Unity 6.3+ |
| **Unity Texture2D Generator** | Integrated in Unity AI | Backgrounds, panel fills, billboards |
| **Stable Diffusion 3.5** | Open weights | Local generation, broad community |
| **FLUX.2 klein** | Open weights | Efficient, smaller, fast |
| **Scenario.gg** | Hosted | Style matching, art-direction control |
| **Meshy AI Texture Generator** | Hosted | Mesh-aware retexturing; UV auto-projection; PBR set |
| **Tripo AI Texture Generator** | Hosted | Bundled with Tripo's text-to-3D pipeline |
| **Polycam** | Hosted | Photoreal scan-trained materials |
| **ArmorLab** | Open source | Free offline texturing |
| **Adobe Substance 3D** | Commercial | Hand-refined hero assets |
| **Phaser Desktop Image Generator** | Integrated in Phaser Studio | Browser-based 2D asset gen for Phaser games |

Sources: [Source 124](https://www.meshy.ai/blog/best-ai-texture-generators); [Source 117](https://app.cinevva.com/guides/ai-asset-generators-games); [Source 10](https://unity.com/blog/unity-ai-sprite-generator); [Source 79](https://phaser.io/news/2026/05/introducing-the-phaser-desktop-a-game-making-workstation-built-by-game-makers).

**Decision matrix.**

| Criteria | Unity Sprite Gen | Unity Texture2D | SD 3.5 | FLUX.2 | Scenario | Meshy Texture | Tripo Texture | Polycam | ArmorLab | Substance | Phaser Desktop Image |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **Sprite generation** | ✅ | 🟡 | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Texture (PBR) generation** | ❌ | ✅ | ✅ | 🟡 | 🟡 | ✅ (mesh-aware) | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Mesh-aware retexture** | n/a | n/a | ❌ | ❌ | ❌ | ✅ | 🟡 | ❌ | ❌ | ✅ | n/a |
| **UV auto-projection** | n/a | n/a | ❌ | ❌ | ❌ | ✅ | 🟡 | ❌ | ❌ | ✅ | n/a |
| **Style consistency** | 🟡 | 🟡 | 🟡 | 🟡 | ✅ (designed for it) | 🟡 | 🟡 | ✅ | ❌ | 🟡 | 🟡 |
| **In-engine workflow** | ✅ Unity 6.3+ | ✅ Unity 6.3+ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ Photoshop pipeline | ✅ Phaser Desktop |
| **Open weights** | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| **Free tier** | 🟡 Unity Points | 🟡 | ✅ (self-host) | ✅ (self-host) | 🟡 | ✅ (CC BY) | 🟡 (non-commercial) | 🟡 | ✅ | ❌ | ✅ (free Desktop) |
| **API** | ❌ | ❌ | ✅ (local) | ✅ (local) | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |

**Recommendation.**
- **For Unity-only:** **Unity Sprite + Texture2D Generators** keep everything in the editor with `UnityAI` metadata for later filtering.
- **For self-hosted / open-weights:** **Stable Diffusion 3.5** (broad) or **FLUX.2 klein** (fast) for general 2D; **ArmorLab** for free offline texturing.
- **For style-consistent production art:** **Scenario.gg**.
- **For PBR textures with UV automation:** **Meshy AI Texture Generator**.
- **For photoreal scan-trained materials:** **Polycam**.
- **For hero 2D/UI/texture work:** **Substance 3D** still dominates hand-refined output.

---

### Use case 3: AI audio / music / SFX generation

**Framing.** Generate music, sound effects, voiceover, ambient audio for game engines.

**Tool roster.**

| Tool | Type | Best for |
|---|---|---|
| **Unity Sound Generator** | Integrated in Unity AI | SFX, ambient in Unity 6.3+ |
| **Phaser Desktop Music Generator** | Integrated in Phaser Studio | Background music in Phaser games |
| **Phaser Desktop SFX Generator** | Integrated in Phaser Studio | Sound effects and ambience |
| **Stable Audio 3.0** | Open weights | Self-hosted music and SFX |
| **ACE-Step 1.5** | Open weights | Open-weight music generation |
| **ElevenLabs** | Hosted | Game VO, character voices |
| **NVIDIA Audio2Face-3D (UE)** | Plugin | Real-time facial animation from audio |
| **Replica Studios** | Commercial | Game VO, character voices |
| **Suno / Udio** | Hosted | Music generation |

Sources: [Source 117](https://app.cinevva.com/guides/ai-asset-generators-games); [Source 79](https://phaser.io/news/2026/05/introducing-the-phaser-desktop-a-game-making-workstation-built-by-game-makers); [Source 46](https://windowsforum.com/news/unity-roblox-and-nvidia-ace-bring-generative-ai-into-game-development-workflows.447881/).

**Decision matrix.**

| Criteria | Unity Sound | Phaser Music | Phaser SFX | Stable Audio 3.0 | ACE-Step 1.5 | ElevenLabs | NVIDIA A2F-3D | Suno/Udio |
|---|---|---|---|---|---|---|---|---|
| **Music generation** | 🟡 | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ |
| **SFX generation** | ✅ | ❌ | ✅ | ✅ | 🟡 | ❌ | ❌ | 🟡 |
| **Voiceover / character VO** | ❌ | ❌ | ❌ | 🟡 | 🟡 | ✅ | ❌ | ❌ |
| **Real-time facial animation** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ (UE 5.4–5.6) | ❌ |
| **In-engine integration** | ✅ Unity 6.3+ | ✅ Phaser Desktop | ✅ Phaser Desktop | ❌ | ❌ | ❌ | ✅ UE plugin | ❌ |
| **Open weights** | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Commercial license** | 🟡 Unity Points | 🟡 bundled | 🟡 bundled | 🟡 | 🟡 | ✅ paid | 🟡 NVIDIA license | 🟡 paid |
| **API** | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |

**Recommendation.**
- **For Unity:** **Unity Sound Generator** is the simplest path; pair with **ElevenLabs** for VO.
- **For Phaser:** **Phaser Desktop Music + SFX Generators** are bundled and free.
- **For UE with character AI:** **NVIDIA Audio2Face-3D** for lip-sync + **ElevenLabs** for VO is the strongest 2026 stack.
- **For self-hosted / open-weights:** **Stable Audio 3.0** for music + SFX; **ACE-Step 1.5** for music.

---

### Use case 4: Agent-controlled editor (MCP server) by engine

**Framing.** Drive a game engine editor from an AI coding agent (Claude Code, Cursor, Cline, Codex CLI, etc.) via Model Context Protocol.

**Tool roster and recommendation.** This is the same data as the per-engine sections above, re-cut by "which MCP server for which engine". The recommendation is one line per engine.

| Engine | Recommended MCP | Alternative | Notes |
|---|---|---|---|
| **Unity 6.x** | **Unity MCP (official)** | emeryporter Unity MCP (free, no subscription) | Official = best integration; emeryporter = best free option. |
| **Unreal 5.7** | **harn3ss unreal-engine-mcp** | Chirag Panwar MCP Automation Bridge (most tools) or ZiggyMar (Blueprint focus) | Pair all with **codeturion unreal-api-mcp** for signature accuracy. |
| **Blender** | **kleer001/blender-mcp** (175 typed tools) | YellowFoxH4XOR (safety) or djeada (headless + auth) | ahujasid's headless bug is real — don't deploy. |
| **Godot 4.7** | **aigengame `gda` (CLI + MCP)** | hybridindie (toggleable safety) or yanhuifair (most tools) | For CLI-only, regiellis `swallowtail` is good. |
| **Phaser 3** | **Phaser Editor v5 MCP** (40+ tools, in-editor) | Phaser Game Agent MCP (hosted) | Editor v5 is commercial ($12/mo) but the only first-party in-editor MCP for Phaser. |
| **Construct 3** | **liauw-media/construct3-mcp** (v1.10.0) | XHXIAIEIN Copilot (clipboard JSON) + ToadLobe c3-skill (scripting Q&A) | Editor v5 equivalent for Construct 3 doesn't exist — community fills the gap. |

Sources for this matrix: see Part I sections 1–6.

**Decision matrix (agent compatibility).**

| Criteria | Unity MCP | UE harn3ss | Blender kleer001 | Godot gda | Phaser Editor v5 | Construct 3 liauw-media |
|---|---|---|---|---|---|---|
| **First-party** | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| **Open source** | ❌ (closed binary) | ✅ | ✅ | ✅ | ❌ | ✅ |
| **Free / no subscription** | 🟡 Personal trial | ✅ | ✅ | ✅ | ❌ ($12/mo) | ✅ |
| **Tool count** | 4 core categories | 105+ | 175 | many | 40+ | ~15 |
| **Headless mode** | 🟡 (editor must be open) | ✅ | ✅ | ✅ | ❌ | 🟡 (serves export) |
| **Live editor control** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Runtime game control** | ❌ | 🟡 | ❌ | ✅ | ❌ | ✅ (CDP) |
| **Custom tool registration** | ✅ C# | ✅ Python | ❌ | ✅ | ❌ | 🟡 |
| **MCP 2026-07-28 spec** | 🟡 | 🟡 | 🟡 | ✅ | 🟡 | 🟡 |
| **Maintainer health** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Documentation** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

**Recommendation.**
- **The single best engine to put a customized coding agent in front of in 2026 is Unity 6.3 LTS** — the official MCP server, integrated Generators, and the AI Gateway are the most complete.
- **The single best FOSS engine to put a customized coding agent in front of is Godot 4.7** with `gda` — the CLI + MCP + dual mode combination is unmatched in the FOSS space.
- **For 3D content finishing in the pipeline, Blender with kleer001/blender-mcp is the right stage** between asset generation (Meshy/Tripo) and engine import.

---

### Use case 5: Headless CI/CD for engine builds

**Framing.** Run repeatable engine builds in CI without a human at the editor.

**Tool roster.**

| Tool | Engines | Type | Best for |
|---|---|---|---|
| **Unity Build Automation** | Unity | First-party cloud CI | Multi-platform iOS+; no Docker |
| **GameCI** | Unity (primary), Godot, Unreal | FOSS Docker + Actions | GitHub/GitLab/CircleCI; license activation |
| **Horde + UnrealGameSync** | Unreal | First-party (Epic) | Studio-scale UE 5.4+; Perforce |
| **Universal Foundry** | Unreal | Managed Horde hosting | Skip rolling your own Horde |
| **Buildkite** | All | CI platform | Custom agents, complex pipelines |
| **GitHub Actions** | All | CI platform | GitHub-native |
| **GitLab CI** | All | CI platform | GitLab-native |
| **CircleCI** | All | CI platform | Hosted, Docker-native |
| **Jenkins** | All | Self-hosted | Legacy, large plugin ecosystem |
| **Perforce + UGS** | Unreal | Version control + distribution | Sync prebuilt binaries to artists/QA |
| **`godot --headless --export-release`** | Godot | Built-in | CI script |
| **`blender -b --python script.py`** | Blender | Built-in | Batch scripts |
| **`UnrealEditor-Cmd` + RunUAT** | Unreal | Built-in | Commandlets, BuildCookRun |

Sources: [Source 16](https://docs.unity.com/en-us/build-automation); [Source 17](https://docs.unity.com/en-us/cloud-code/scripts/how-to-guides/automation); [Source 18](https://deepwiki.com/game-ci/documentation/6-docker-images); [Source 19](https://deepwiki.com/game-ci/documentation/3-github-actions-integration); [Source 20](https://deepwiki.com/game-ci/documentation/4-gitlab-ci-integration); [Source 21](https://www.itechguides.com/compare/gameci-vs-github-actions/); [Source 40](https://www.perforce.com/blog/p4/how-to-use-unrealgamesync); [Source 41](https://www.docswell.com/s/EpicGamesJapan/K2QVVE-2025-12-15-214934); [Source 42](https://www.docswell.com/s/EpicGamesJapan/Z6ERYX-UE_UFT2025_TOYO_PERFORCE); [Source 43](https://forums.unrealengine.com/t/talks-and-demos-horde-on-a-budget-cost-effective-infrastructure-for-small-teams/2705272).

**Decision matrix.**

| Criteria | Unity Build Auto | GameCI | Horde + UGS | Buildkite | GitHub Actions | Jenkins | Godot --headless | Blender -b |
|---|---|---|---|---|---|---|---|---|
| **Unity support** | ✅ best | ✅ | 🟡 | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Unreal support** | ❌ | 🟡 | ✅ best | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Godot support** | ❌ | ✅ | 🟡 | ✅ | ✅ | ✅ | ✅ best | ❌ |
| **Blender support** | ❌ | 🟡 | ❌ | ✅ | ✅ | ✅ | ❌ | ✅ best |
| **iOS build** | ✅ | ✅ (macOS runner) | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Android build** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 🟡 | ❌ |
| **WebGL/Web** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Console build** | 🟡 | 🟡 | ✅ | ✅ | 🟡 | ✅ | ❌ | ❌ |
| **License activation automation** | ✅ cloud-managed | ✅ | ✅ (UGS) | ✅ | ✅ | ✅ | n/a | n/a |
| **Pre-compiled binary distribution** | ✅ artifacts | 🟡 | ✅ UGS (best) | 🟡 | ✅ artifacts | 🟡 | ❌ | ❌ |
| **Self-host option** | ❌ | ✅ | ✅ | ✅ | 🟡 (runners) | ✅ | n/a | n/a |
| **Free tier** | 🟡 limited | ✅ | ✅ | 🟡 | ✅ 2000 min/mo | ✅ | ✅ | ✅ |
| **Setup complexity** | Low | Medium | High | Medium | Low | High | Low | Low |

**Recommendation.**
- **For Unity:** **Unity Build Automation** if you want no Docker; **GameCI** if you want FOSS + flexibility. Common to use both.
- **For Unreal:** **Horde + UGS** is non-negotiable for studios. Self-host (S1T2 pattern) or use Universal Foundry.
- **For Godot:** **`godot --headless --export-release`** with GitHub Actions or GitLab CI; GameCI has a Godot path.
- **For Blender:** **`blender -b --python`** with any CI; the API is stable enough to script complex batch jobs.
- **For multi-engine studios:** **Buildkite** is the most flexible cross-engine platform; **GitHub Actions** is the most convenient.

---

### Use case 6: Headless test execution

**Framing.** Run unit, integration, and visual tests against the real engine without a human at the editor.

**Tool roster.**

| Tool | Engines | Type | Best for |
|---|---|---|---|
| **Unity Test Runner (EditMode + PlayMode)** | Unity | Built-in | Standard Unity tests; `game-ci/unity-test-runner` in CI |
| **GUT (Godot Unit Test)** | Godot | FOSS | Headless GDScript tests |
| **Unreal Automation Framework** | Unreal | Built-in | Functional, perf, smoke tests |
| **Playwright** | Phaser, browser games | FOSS | Visual + interaction tests in real browser |
| **Chrome DevTools Protocol** | Construct 3 (via liauw-media) | Built-in | Headless Chrome for runtime testing |
| **construct3-mcp runtime tools** | Construct 3 | FOSS | High-level: `wait_for_condition`, `simulate_input`, `screenshot_game` |
| **`uv run blender-mcp --mock`** | Blender | FOSS | Mock Blender for testing the MCP server itself |
| **`godot --headless --script`** | Godot | Built-in | One-shot test scripts |
| **screenshot test frameworks** | All | varies | Visual regression (per-engine: Unity, Playwright, CDP) |
| **Horde perf budgets** | Unreal | First-party | `roohe/agentic-super-skills game-technical-director` |

Sources: [Source 19](https://deepwiki.com/game-ci/documentation/3-github-actions-integration); [Source 65](https://github.com/aigengame/godot-agent); [Source 73](https://www.typingmind.com/skills/thedivergentai-godot-builder); [Source 114](https://github.com/roohe/agentic-super-skills/blob/master/skills_library/game-technical-director/SKILL.md); [Source 83](https://codex.danielvaughan.com/2026/05/10/codex-cli-game-prototyping-godot-phaser-browser-games-agent-skills/).

**Decision matrix.**

| Criteria | Unity Test Runner | GUT (Godot) | UE Automation | Playwright | construct3-mcp CDP | Blender mock | Horde perf |
|---|---|---|---|---|---|---|---|
| **EditMode / unit** | ✅ | ✅ | ✅ | n/a | 🟡 | n/a | n/a |
| **PlayMode / integration** | ✅ | ✅ | ✅ | ✅ | ✅ (CDP runtime) | n/a | ✅ |
| **Visual regression** | ✅ (screenshot) | 🟡 | ✅ (screenshot) | ✅ (best) | ✅ `screenshot_game` | n/a | ✅ |
| **Performance benchmarks** | 🟡 | 🟡 | ✅ (very strong) | 🟡 | ❌ | n/a | ✅ (best) |
| **Headless in CI** | ✅ | ✅ | ✅ | ✅ | ✅ (headless Chrome) | ✅ (mock Blender) | ✅ |
| **No editor required** | ✅ | ✅ | ✅ (with cmdlets) | ✅ | ✅ (post-export) | n/a | ✅ |
| **Custom tool binding** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **AI agent native** | ✅ via MCP | ✅ via gda | ✅ via harn3ss MCP | ✅ via Playwright MCP | ✅ | ✅ | 🟡 |

**Recommendation.**
- **For Unity:** **Unity Test Runner** in EditMode + PlayMode, run via **game-ci/unity-test-runner** in CI.
- **For Godot:** **GUT** headlessly via `godot --headless -s addons/gut/gut_cmdln.gd -gdir=res://test -gexit`.
- **For Unreal:** **Unreal Automation Framework** via `UnrealEditor-Cmd`. Pair with **Horde** for distributed perf budget enforcement.
- **For Phaser:** **Playwright** in a real headless browser against `npm run dev` — the de-facto pattern.
- **For Construct 3:** **liauw-media/construct3-mcp runtime tools** (which drive Chrome via CDP). The bridge must be removed before shipping.

---

### Use case 7: Visual scripting (node/event-sheet)

**Framing.** Author gameplay logic visually rather than in code. Mature in Unreal and Construct 3; in maintenance mode in Unity; officially removed in Godot 4.0.

**Tool roster.**

| Tool | Engine | Status (Oct 2026) | Best for |
|---|---|---|---|
| **Unreal Blueprints** | UE 5.7 | First-class, production | Designers; proven at AAA (Clair Obscur) |
| **Unity Visual Scripting** | Unity 6.x | Maintenance mode | Niche/internal tooling only |
| **Godot Orchestrator** (GDExtension) | Godot 4.7 | Active, v2.5 (Jul 2026) | Designers who want Blueprints-style |
| **Construct 3 event sheets** | Construct 3 | First-class, primary | 2D games, hobbyists, indies |
| **Stencyl blocks** | Stencyl | Maintained | 2D education/prototyping |
| **Construct 3 JS/TS script actions** | Construct 3 | First-class | Hybrid: event sheets + scripts |
| **GDevelop visual events** | GDevelop | Maintained | No-code 2D |

Sources: [Source 47](https://egmatic.com/blog/visual-scripting-engines-compared); [Source 14](https://docs.unity.com/en-us/engine/6000.0/manual/packages-list/packages-all/pack-safe/com-unity-visualscripting); [Source 15](https://discussions.unity.com/t/visual-scripting-needs-description-bubbles-for-controls/1732666); [Source 86](https://www.construct.net/en/make-games/releases/stable/r458).

**Decision matrix.**

| Criteria | Unreal Blueprints | Unity VS | Godot Orchestrator | Construct event sheets | Stencyl blocks |
|---|---|---|---|---|---|
| **First-party** | ✅ | ✅ | ❌ (GDExtension) | ✅ | ✅ |
| **Production-ready** | ✅ | ❌ (maintenance) | ✅ v2.5 | ✅ | 🟡 |
| **Native C++/engine access** | ✅ (full) | 🟡 | ✅ (via GDExtension) | 🟡 (via SDK v2) | ❌ |
| **Designer autonomy** | ✅ | 🟡 | ✅ | ✅ | ✅ |
| **Performance ceiling** | High (slower than C++) | Medium | Medium | Medium (faster than JS) | Low |
| **Code escape hatch** | ✅ C++ | ✅ C# | ✅ GDScript/C++ | ✅ JS/TS | 🟡 |
| **Hybrid (visual + code)** | ✅ | ✅ | ✅ | ✅ (event sheet + script blocks) | 🟡 |
| **AI agent compatibility** | 🟡 (Blueprint editing via ZiggyMar MCP) | 🟡 | 🟡 | ✅ via liauw-media MCP | ❌ |

**Recommendation.**
- **For new visual scripting in 2026:** **Unreal Blueprints** (production) or **Construct 3 event sheets** (2D) are the right answers.
- **For Godot users who want visual scripting:** **Orchestrator v2.5** is the only credible option.
- **For Unity users:** **Plan a C# migration.** Unity Visual Scripting is effectively unmaintained.
- **For AI-agent compatibility:** Construct 3 event sheets are the most agent-friendly visual scripting in 2026 (via liauw-media/construct3-mcp).

---

### Use case 8: AI coding agent (general-purpose substrate)

**Framing.** The substrate that every MCP server plugs into. The 2026 market has clear tier-1, tier-2, and FOSS tiers.

**Tool roster.** Same data as the parent report's Section 7.1, condensed.

| Agent | Format | Strength |
|---|---|---|
| **Claude Code** | Terminal, IDE, web, mobile, GitHub Actions, Slack | Strongest reasoning; long-running; per-action approval |
| **Cursor** | VS Code fork + CLI | Editor-first; Composer; codebase index |
| **OpenAI Codex CLI / Apps SDK** | CLI, ChatGPT app | Phased workflows; parallel jobs; ChatGPT runtime |
| **GitHub Copilot** | IDE + GitHub web | PR/issue integration; broadest IDE coverage |
| **Cline** | Open source, model-agnostic | Per-action approval; BYO key; local models |
| **Windsurf / Devin Desktop** | IDE | Cascade flows |
| **JetBrains Junie** | JetBrains IDE + CLI | IDE-native agentic workflows |
| **Aider** | Terminal | Git-native diff loop |

Sources: [Source 99](https://junie.jetbrains.com/blog/best-ai-coding-agents/); [Source 100](https://scrimba.com/articles/best-ai-coding-assistants-2026/amp/); [Source 101](https://deploybase.ai/articles/best-ai-code-assistants); [Source 102](https://tech-insider.org/best-ai-coding-assistants-2026/); [Source 103](https://gamineai.com/blog/best-ai-coding-assistants-2026); [Source 104](https://memeburn.com/best-ai-coding-tools/); [Source 105](https://www.digitalocean.com/resources/articles/claude-code-alternatives); [Source 106](https://replit.com/discover/claude-code-alternative); [Source 107](https://support.claude.com/en/articles/14553517-claude-code-common-developer-use-cases); [Source 113](https://codex.danielvaughan.com/2026/05/14/building-chatgpt-apps-with-codex-cli-apps-sdk-mcp-server-widget-scaffolding/).

**Decision matrix.**

| Criteria | Claude Code | Cursor | Codex CLI | Copilot | Cline | Windsurf | Junie | Aider |
|---|---|---|---|---|---|---|---|---|
| **Terminal native** | ✅ best | ✅ | ✅ best | ✅ | ✅ | 🟡 | ✅ | ✅ best |
| **IDE native** | ✅ | ✅ best | ✅ | ✅ best | ✅ | ✅ best | ✅ best | ❌ |
| **Web/desktop** | ✅ | ✅ web | ✅ ChatGPT | ✅ web | 🟡 | ✅ | ❌ | ❌ |
| **Model-agnostic / BYO key** | ❌ (Claude only) | ✅ | 🟡 | 🟡 | ✅ best | ❌ | 🟡 | ✅ |
| **Open source** | ❌ | ❌ | ❌ | ❌ | ✅ best | ❌ | ❌ | ✅ |
| **MCP support** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 🟡 |
| **Plan mode** | ✅ | ✅ | ✅ | 🟡 | ✅ | ✅ | 🟡 | ❌ |
| **Multi-file agent** | ✅ best | ✅ best | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Long-running autonomous** | ✅ best | ✅ | ✅ | 🟡 | ✅ | 🟡 | 🟡 | 🟡 |
| **Cost** | $17/mo Pro | $20/mo | ChatGPT Plus | $10/mo | Free (BYO API) | $15/mo | $20/mo | Free (BYO API) |
| **Game-dev community traction** | ✅ | ✅ | ✅ | ✅ | ✅ | 🟡 | 🟡 | 🟡 |

**Recommendation.**
- **For game-dev teams adopting a coding agent in 2026:** the most common pattern is a **two-tool stack** — an IDE assistant for daily work (Cursor or Copilot) + a terminal agent for deep multi-file tasks (Claude Code or Aider). ([Source 102](https://tech-insider.org/best-ai-coding-assistants-2026/))
- **For the most open / model-flexible setup:** **Cline** (Apache 2.0) with a BYO key to Claude or a local model via Ollama / LM Studio.
- **For the strongest multi-agent / parallel workflow:** **OpenAI Codex CLI** with `--profile` flags.
- **For the strongest enterprise default:** **GitHub Copilot** + a Claude Code or Aider for terminal work.

---

### Use case 9: Procedural content generation in-engine

**Framing.** Generate environments, scatter, vegetation, terrain procedurally rather than placing every instance by hand.

**Tool roster.**

| Tool | Engine | Status (Oct 2026) | Best for |
|---|---|---|---|
| **UE 5.7 PCG (Procedural Content Generation)** | Unreal 5.7 | Production-ready (Nov 2025) | Biomes, scatter, vegetation, modular sets |
| **UE Procedural Vegetation Editor** | Unreal 5.7 | Experimental | Nanite-ready vegetation; biome painting |
| **Godot Geometry Nodes** | Godot 4.7 | Built-in | Procedural geometry, scattering |
| **Blender Geometry Nodes** | Blender 4.x / 5.x | Built-in | Procedural geometry, environments |
| **Unity Visual Effect Graph** | Unity 6.x | Built-in | Particle/VFX procedural (not geometry) |
| **Houdini Engine** | All (via plugins) | Commercial | Studio-scale procedural content |
| **Houdini Engine for Unity** | Unity | Commercial | Houdini graphs inside Unity |
| **Houdini Engine for Unreal** | Unreal | Commercial | Houdini graphs inside UE |
| **Tripo Smart Mesh** | (any engine, import) | Hosted | Quad retopology, not full PCG |

Sources: [Source 35](https://80.lv/articles/what-s-new-in-pcg-in-ue5-6-ue5-7); [Source 37](https://www.strayspark.studio/blog/ue5-pcg-production-ready-guide); [Source 36](https://mythiclemon.com/radar/engine-radar-2026-1/); [Source 70](https://godotengine.org/article/hdr-output-arrives-in-godot-4-7/?pubDate=20260619).

**Decision matrix.**

| Criteria | UE 5.7 PCG | Godot GeoNodes | Blender GeoNodes | Unity VFX Graph | Houdini Engine |
|---|---|---|---|---|---|
| **In-engine native** | ✅ | ✅ | ✅ | ✅ | ❌ (host app) |
| **Production-ready** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Scatter / placement** | ✅ best | ✅ | ✅ | ❌ (VFX only) | ✅ best |
| **Biome painting** | ✅ | 🟡 | 🟡 | ❌ | ✅ |
| **Vegetation generation** | ✅ (Nanite-ready) | 🟡 | ✅ | ❌ | ✅ best |
| **Runtime generation** | ✅ (Blueprint-callable) | ✅ | ❌ (export required) | ✅ | 🟡 |
| **Async / partition-aware** | ✅ | ✅ | n/a | n/a | ✅ |
| **Learning curve** | Medium | Medium | Medium | Medium | High |
| **Cost** | Free (UE) | Free | Free | Free (Unity) | $$$$ |
| **Engine integration** | n/a | n/a | ✅ Blender-to-Unity pipeline via MCP | n/a | ✅ via Engine plugin |

**Recommendation.**
- **For Unreal:** **UE 5.7 PCG + Procedural Vegetation Editor** is now production-ready; adopt for biomes, scatter, vegetation, modular sets. ([Source 37](https://www.strayspark.studio/blog/ue5-pcg-production-ready-guide))
- **For Godot:** **Geometry Nodes** for procedural geometry; consider for low/mid-scale needs.
- **For Blender:** **Geometry Nodes** is the standard; pair with **kleer001/blender-mcp** for an agent-driven pipeline.
- **For Unity:** **Visual Effect Graph** is VFX-only; for environment procedural work, consider Houdini Engine or external Tripo Smart Mesh.
- **For studio-scale procedural content:** **Houdini Engine** (Unity or Unreal plugin) is the answer.

---

### Use case 10: Avatar / character animation

**Framing.** Skeletal animation, facial animation, motion capture, retargeting.

**Tool roster.**

| Tool | Engines | Best for |
|---|---|---|
| **Spine 4.2** | Phaser 4, Unity, Unreal, Godot (via Spine Runtimes) | 2D skeletal animation; Phaser Editor v5 supports it natively |
| **Mixamo** | All (export FBX) | Auto-rig from a single mesh; huge motion library |
| **Meshy AI Animation Generator** | All (export FBX) | AI-generated character animations with preset library |
| **NVIDIA Audio2Face-3D (UE)** | Unreal 5.4–5.6 | Real-time facial animation from audio |
| **Control Rig (UE 5.7)** | Unreal | In-engine procedural animation; production-ready |
| **MetaHuman** | Unreal 5.4+ | Photoreal digital humans; Linux/macOS support in 5.7 |
| **Motion capture (Rokoko, Xsens)** | All | Real body motion to skeletal animation |
| **Tripo auto-rigger** | (any, export FBX) | Non-humanoid creature rigging (Feb 2026+) |

Sources: [Source 76](https://phaser.io/news/2026/04/phaser-editor-v5-release); [Source 119](https://www.meshy.ai/blog/best-ai-tools-for-3d-game-assets); [Source 122](https://www.tripo3d.ai/blog/ai-3d-for-indie-devs); [Source 46](https://windowsforum.com/news/unity-roblox-and-nvidia-ace-bring-generative-ai-into-game-development-workflows.447881/); [Source 36](https://mythiclemon.com/radar/engine-radar-2026-1/).

**Decision matrix.**

| Criteria | Spine 4.2 | Mixamo | Meshy Anim | NVIDIA A2F-3D | Control Rig | MetaHuman | Tripo rigger |
|---|---|---|---|---|---|---|---|
| **2D skeletal** | ✅ best | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **3D skeletal** | ❌ | ✅ best | ✅ | ❌ | ✅ | ✅ | ✅ |
| **Auto-rig from mesh** | n/a | ✅ | ✅ | n/a | ❌ (manual) | n/a (scan) | ✅ |
| **Non-humanoid rigging** | ✅ | ❌ | 🟡 | n/a | ✅ | ❌ | ✅ (since Feb 2026) |
| **Facial animation** | ✅ (Spine graphs) | ❌ | ❌ | ✅ best | ✅ | ✅ | ❌ |
| **Real-time audio-to-face** | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ (via A2F) | ❌ |
| **Motion library** | ❌ | ✅ best | ✅ 500+ | ❌ | n/a | n/a | ❌ |
| **Engine integration** | All (via runtimes) | All (FBX) | All (FBX) | Unreal only | Unreal only | Unreal only | All (FBX) |
| **AI-driven** | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ |

**Recommendation.**
- **For 2D skeletal animation:** **Spine 4.2** (the standard). Phaser Editor v5 supports it natively.
- **For 3D character animation, default choice:** **Mixamo** for the breadth of motion library.
- **For AI-generated animation:** **Meshy AI Animation Generator** (500+ presets) or **Tripo auto-rigger** (creatures since Feb 2026).
- **For UE with character AI:** **NVIDIA Audio2Face-3D** + **Control Rig** + **MetaHuman** is the strongest 2026 stack.
- **For motion capture:** Rokoko / Xsens into the engine of choice.

---

### Use case 11: API documentation for AI agents

**Framing.** Prevent LLM hallucination of engine API signatures. The single biggest gap in agent-driven game dev as of 2026.

**Tool roster.**

| Tool | Engine | Type | Best for |
|---|---|---|---|
| **codeturion unreal-api-mcp** | Unreal 5.5/5.6/5.7 | FOSS | Version-pinned API databases; 109K+ records each |
| **Unity 6 docs + `llms.txt`** | Unity | FOSS | Standard LLM-friendly docs |
| **Phaser API typings in Monaco** | Phaser | FOSS | TypeScript types in editor |
| **Godot GDScript diagnostics** (tugcantopaloglu, gda) | Godot | FOSS | `validate_script`, `validate_scripts` |
| **Construct 3 scripting reference** | Construct 3 | FOSS (via c3-skill) | Construct 3 manual mirror |
| **llms.txt standard** | All | FOSS | llms.txt on engine vendor sites for LLM ingestion |

Sources: [Source 28](https://github.com/codeturion/unreal-api-mcp); [Source 29](https://libraries.io/pypi/unreal-api-mcp); [Source 63](https://github.com/tugcantopaloglu/godot-mcp); [Source 65](https://github.com/aigengame/godot-agent); [Source 90](https://github.com/ToadLobe/c3-skill).

**Decision matrix.**

| Criteria | unreal-api-mcp | Unity docs | Phaser typings | Godot GDScript diag | c3-skill | llms.txt |
|---|---|---|---|---|---|---|
| **MCP-native** | ✅ | ❌ | ❌ | ✅ (gda) | ❌ | ❌ |
| **Version-pinned** | ✅ (5.5/5.6/5.7) | ✅ (6.x) | ✅ (3/4) | ✅ (4.x) | ✅ | n/a |
| **Prevents hallucination** | ✅ | 🟡 | 🟡 | ✅ | 🟡 | 🟡 |
| **Auto-update** | ✅ weekly | ✅ docs | ✅ | ✅ | 🟡 | n/a |
| **Searchable in agent** | ✅ | ✅ via llms.txt | ✅ | ✅ | ✅ | ✅ |
| **Engine-vendor-official** | ❌ | ✅ | ✅ | ✅ | ❌ | ✅ |

**Recommendation.**
- **For Unreal:** **codeturion unreal-api-mcp is non-negotiable.** Without it, agents will hallucinate 5.5 vs 5.6 vs 5.7 signatures. Pair with one of the UE control-plane MCP servers.
- **For Unity:** Use the official docs + an `llms.txt` aggregator; the community is large enough that LLM training data is reasonably accurate for Unity 6.x.
- **For Godot:** Use the `validate_script` / `validate_scripts` tools in gda or tugcantopaloglu to catch errors post-edit.
- **For Phaser:** Monaco editor with Phaser typings catches errors at edit time.
- **For Construct 3:** Use the c3-skill knowledge + the construct3-mcp `validate_project` for editor-load-time rules.
- **General best practice:** Every engine vendor should publish an `llms.txt` and a typed API surface for MCP. As of October 2026, only Unreal has a community-built one.

---

### Use case 12: Visual regression / screenshot testing

**Framing.** Catch visual bugs in builds before they reach players.

**Tool roster.**

| Tool | Engines | Type | Best for |
|---|---|---|---|
| **Playwright** | Phaser, browser games | FOSS | Best-in-class for browser; pixel diff + visual comparison |
| **Unity Test Framework screenshot tests** | Unity | Built-in (experimental) | In-PlayMode pixel diff |
| **construct3-mcp `screenshot_game`** | Construct 3 | FOSS | Headless Chrome screenshot via CDP |
| **emeryporter Unity MCP vision capture** | Unity | FOSS | Send Game/Scene View to AI for visual analysis |
| **Headless Chrome via CDP** | Any browser-based | Built-in | Screenshot via DevTools Protocol |
| **Blender MCP render preview** | Blender | FOSS | `inspect_scene` + render still |
| **Godot screenshot via MCP** | Godot | FOSS | tugcantopaloglu, gda, hybridindie |
| **Astra visual verification** | Phaser (hosted) | FOSS | `playwright test` against `npm run dev` |

Sources: [Source 24](https://glama.ai/mcp/servers/emeryporter/UnityMCP/tree); [Source 65](https://github.com/aigengame/godot-agent); [Source 87](https://github.com/liauw-media/construct3-mcp); [Source 83](https://codex.danielvaughan.com/2026/05/10/codex-cli-game-prototyping-godot-phaser-browser-games-agent-skills/).

**Decision matrix.**

| Criteria | Playwright | Unity Test Framework | construct3-mcp CDP | emeryporter vision | Blender MCP render | Godot MCP screenshot | Astra / Phaser pattern |
|---|---|---|---|---|---|---|---|
| **Pixel diff** | ✅ best | ✅ | ✅ via screenshot_game | ❌ (vision-to-LLM) | ✅ render compare | ✅ | ✅ |
| **AI-driven diff** | 🟡 | ❌ | 🟡 | ✅ best (sends to LLM) | ❌ | 🟡 | 🟡 |
| **Headless** | ✅ | ✅ | ✅ (headless Chrome) | ✅ | ✅ | ✅ | ✅ |
| **No editor required** | ✅ | 🟡 (need build) | ✅ (post-export) | ❌ (editor open) | ✅ | ✅ | ✅ |
| **CI integration** | ✅ best | ✅ | ✅ | 🟡 | ✅ | ✅ | ✅ |
| **Cross-engine** | ✅ (browser) | ❌ | ❌ (C3 only) | ❌ (Unity only) | ❌ (Blender only) | ❌ (Godot only) | ❌ (Phaser) |
| **Setup complexity** | Low | Medium | Medium | Low | Low | Low | Low |

**Recommendation.**
- **For Phaser / browser games:** **Playwright** is the standard.
- **For Unity:** **Unity Test Framework screenshot tests** in CI, plus **emeryporter vision capture** for AI-driven visual analysis when a human review is needed.
- **For Construct 3:** **construct3-mcp `screenshot_game`** over headless Chrome via CDP.
- **For Blender asset pipeline:** use the Blender MCP server to render a preview still and diff against a reference.
- **For Godot:** screenshot tools in gda, tugcantopaloglu, or hybridindie.

---

## Cross-references back to the parent report

| Section in this supplement | Section in parent report |
|---|---|
| Part I §1 Unity ecosystem | Parent §1 (Unity 3D) |
| Part I §2 Unreal ecosystem | Parent §2 (Unreal Engine) |
| Part I §3 Blender ecosystem | Parent §3 (Blender) |
| Part I §4 Godot ecosystem | Parent §4 (Godot) |
| Part I §5 Phaser 3 ecosystem | Parent §5 (Phaser 3) |
| Part I §6 Construct 3 ecosystem | Parent §6 (Construct 3) |
| Part II §1 3D asset gen | Parent §9 (AI 3D asset pipeline) |
| Part II §2 2D / texture gen | Parent §9 (subsection on 2D / texture) |
| Part II §3 audio gen | Parent §9 (subsection on audio) |
| Part II §4 MCP editor control | Parent §7 (AI coding agents) + per-engine MCP sections |
| Part II §5 CI/CD | Parent §8 (CI/CD and headless build) |
| Part II §6 headless tests | Parent §8 (subsection on test execution) |
| Part II §7 visual scripting | Parent §1.6 / §2.6 (visual scripting status) |
| Part II §8 AI coding agents | Parent §7 (AI coding agents) |
| Part II §9 procedural content | Parent §2.8 (UE PCG) + per-engine procedural sections |
| Part II §10 character animation | Parent §1.5 (Unity Visual Scripting) + §2.3 (NVIDIA ACE) |
| Part II §11 API docs for agents | Parent §2.2 (codeturion unreal-api-mcp) |
| Part II §12 visual regression | Parent §7 + parent §10 (UVP catalog) |

---

## Self-audit and limitations of this supplement

1. **Density over depth.** Each tool's UVP and feature list is condensed; for the full deep-dive, see the per-engine profile in the parent document.
2. **Tools catalogued:** ~93 distinct named tools across both parts, same as the parent report.
3. **Source reuse:** Numbered sources match the parent document 1:1. If a source moves, fix the parent first.
4. **Matrix legend** is intentionally identical to the rdw-app-competitve-analysis skill template: `✅` confirmed, `🟡` partial/beta, `❌` absent, `➖` not applicable, `❓` could not confirm.
5. **Recency check:** All tools with active releases in the 2025-10 → 2026-10 window are included. Tools that did not appear in any 2026 search have been dropped or marked `❓`.
6. **Roster cross-check:** For each engine's MCP server ecosystem, I cross-referenced 2–3 GitHub "alternatives to" / Awesome lists (e.g. glama.ai/mcp/servers, Glama directories, awesome-gamedev-agent-skills, claudepluginhub.com). Tools that appeared across multiple 2026 roundups are included; tools that didn't are dropped.
7. **What this supplement is not:** It is not a replacement for the parent report. It is a comparative cut that helps a team pick tools.

---

*End of supplement. Word count: ~10,400. All sources are numbered to match the parent document. The combined deliverable (parent + supplement) is ~20,500 words.*
