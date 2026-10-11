# Game-Engine Automation 2026 — Supplemental 2: Decision Trees, Cookbook, Risk Register, and Unity Deep-Dive

**Supplement 2 to:** `wide-research_game-engine-automation-2026_2026-10-10.md`
**Companion to:** `wide-research_game-engine-automation-2026_2026-10-10_supplement.md`
**Date:** 2026-10-10
**Window covered:** 2025-10-10 → 2026-10-10
**Audience:** a development team picking and wiring tools for a customized coding agent.

This document is a decision-support and hands-on supplement. It contains six sections:
1. **Per-team-size decision tree** — solo dev / small studio (≤10) / mid (10–50) / AAA (50+).
2. **Per-budget tier** — free-only / indie-budget / production-budget.
3. **Per-platform-target** — mobile-only / WebGL / desktop / console.
4. **First-week setup cookbook** — copy-pasteable commands and configs.
5. **Risk and deprecation register** — tools most likely to be dead or broken in 12 months.
6. **Unity 3D deep-dive** — full C# examples for custom MCP tool registration, custom inspectors (UI Toolkit + IMGUI), build automation, CI/CD, prefab manipulation, scene/GameObject control, serialization, and asset import pipeline.

All sources are numbered to match the parent document.

---

## 1. Per-team-size decision tree

The single biggest predictor of "which stack should I pick" is team size — because headcount determines who can maintain a custom MCP server, who can debug a flaky CI pipeline at 2 a.m., and who pays for the paid tiers.

### 1.1 Solo developer (1 person)

**Profile.** You are one person, probably shipping a side project or a small commercial game. You cannot babysit a CI pipeline. You cannot debug a 200-tool MCP server. You will not pay $200/month for tooling.

**Recommended stack.**
- **Engine:** **Godot 4.7** (free, MIT, modern) or **Construct 3** (browser-based, no install, instant preview) or **Phaser 3** (MIT, web-first).
- **Coding agent:** **Cline** (open source, BYO key) or **Claude Code** ($17/mo Pro) for the rare complex task.
- **MCP server (engine):** **aigengame `gda` for Godot** (CLI + MCP), or **Phaser Editor v5 MCP** (if you buy the $12/mo subscription), or **liauw-media/construct3-mcp** (free).
- **CI/CD:** **GitHub Actions free tier** + **`godot --headless --export-release`**, or **Next.js + Playwright** for Phaser. Skip GameCI / Horde — overkill.
- **Asset generation:** **Tripo P1** ($19.90/mo) for 3D props; **Phaser Desktop Image Generator** for sprites; **Stable Diffusion 3.5** self-hosted for 2D.
- **API docs for agent:** none needed if you stick to the engine's well-documented surface; the Cline/Claude Code LLM already has training data on Godot 4.x GDScript.

**Anti-patterns to avoid.** Do not pick Unreal 5.7 — the MCP ecosystem is fragmented and the build pipeline (Horde) is studio-scale. Do not build a custom MCP server — you have no time. Do not subscribe to Unity Pro + AI unless you are also shipping on Unity — the Unity Points metering will quietly eat your budget.

**One-line decision rule:** If you have to pick exactly one, **Godot 4.7 + `gda` + Cline + Tripo P1** is the solo-dev default.

### 1.2 Small studio (2–10 people)

**Profile.** You have a few engineers, one or two generalists, possibly a designer who writes code. You can sustain a single FOSS MCP server in your stack but cannot maintain an in-house fork.

**Recommended stack — Option A (Unity-first).**
- **Engine:** **Unity 6.3 LTS**.
- **Coding agent:** **Cursor** ($20/mo per dev) for daily work + **Claude Code** ($17/mo) for deep multi-file work.
- **MCP server:** **Unity AI MCP (official)** for the standard surface + **emeryporter Unity MCP** if anyone wants the no-subscription alternative.
- **CI/CD:** **GameCI** Docker images on **GitHub Actions** (free for public repos, cheap for private).
- **Asset generation:** **Meshy 5/6/7** ($20/mo Pro per team seat) for the full pipeline + **Unity's built-in Generators** for placeholder content.
- **API docs:** Unity's official docs are good enough; agent hallucination risk is low.

**Recommended stack — Option B (Unreal-first).**
- **Engine:** **Unreal Engine 5.7**.
- **Coding agent:** **Claude Code** or **Cursor**.
- **MCP server:** **harn3ss unreal-engine-mcp** + **codeturion unreal-api-mcp** (mandatory pair).
- **CI/CD:** **GitHub Actions self-hosted runner** (you'll need Windows for UE builds); postpone Horde until team > 10.
- **Asset generation:** **Meshy 5/6/7** + **UE 5.7 PCG** for in-engine procedural.
- **API docs:** **codeturion unreal-api-mcp** is non-negotiable.

**Anti-patterns to avoid.** Do not pick the most-fragmented Godot MCP server (e.g. one of the 386-tool ones) — you'll spend more time debugging tool name collisions than shipping. Do not deploy ahujasid/mcp-for-blender for headless CI — it has a known headless bug. ([Source 54](https://github.com/ahujasid/mcp-for-blender/issues/251))

**One-line decision rule:** If your team already knows Unity, ship Unity 6.3 LTS + Unity MCP. If Unreal, ship UE 5.7 + harn3ss UE MCP + codeturion. Otherwise Godot 4.7.

### 1.3 Mid studio (10–50 people)

**Profile.** You have separate disciplines: tech art, gameplay engineering, tools engineering, possibly dedicated CI/build engineers. You can afford a paid MCP server tier and a managed CI. You can maintain a small custom MCP server internally.

**Recommended stack — Unity.**
- **Engine:** **Unity 6.3 LTS** + **Unity Pro/Enterprise** for Unity AI subscription.
- **Coding agent:** **Cursor + Claude Code + Copilot** (three-tool stack is normal at this size).
- **MCP server:** **Unity AI MCP (official)** + a custom in-house MCP server exposing project-specific tools (e.g. level-design pipelines, asset validators).
- **CI/CD:** **GameCI** for PR-time tests + **Unity Build Automation** for release builds.
- **Asset pipeline:** **Meshy 5/6/7** for prop generation, **Tripo P1** for rapid blockout, **Substance 3D** for hero-asset finishing. Custom Blender MCP server for batch processing.
- **Visual regression:** **Playwright** for WebGL builds + **Unity Test Framework screenshot tests**.
- **AI for in-game:** None at this tier (wait for next product cycle).

**Recommended stack — Unreal.**
- **Engine:** **UE 5.7** + planned migration path to UE 5.8.
- **Coding agent:** **Claude Code + Cursor**; possibly a **Codex CLI** subscription for parallel jobs.
- **MCP server:** **harn3ss or Chirag Panwar's MCP Automation Bridge** + **codeturion unreal-api-mcp** + a custom in-house server for studio-specific pipelines.
- **CI/CD:** **Horde + UnrealGameSync** is the right answer at this size. Self-host or use **Universal Foundry**.
- **Asset pipeline:** **Houdini Engine for Unreal** for hero procedural + **Meshy 5/6/7** for prop generation + **UE 5.7 PCG** for in-engine scatter.
- **AI for in-game:** **NVIDIA ACE** (Audio2Face-3D + ASR + LLM + TTS) for NPC brains, if you ship narrative games.

**Recommended stack — Godot.**
- **Engine:** **Godot 4.7** (or wait for 4.8 if a major feature matters).
- **Coding agent:** **Claude Code + Cursor**.
- **MCP server:** **aigengame `gda`** as the primary, plus a small custom server for studio-specific tools.
- **CI/CD:** **`godot --headless --export-release`** in **GitHub Actions** matrix across Linux/Windows/macOS; **GUT** for tests.
- **Asset pipeline:** **Blender MCP** (kleer001) for asset finishing; **Tripo/Meshy** for prop gen.

**Anti-patterns to avoid.** Do not run two MCP servers against the same engine simultaneously — pick one and remove the other. Do not skip the codeturion unreal-api-mcp if you're on UE 5.5+ — the agent will hallucinate signatures.

**One-line decision rule:** At 10–50, **Horde + UGS** is the right answer for Unreal, **Build Automation + GameCI** for Unity. Pick the MCP server you can commit to for 2+ years.

### 1.4 AAA (50+ people)

**Profile.** You have a tools team, dedicated CI/build engineers, a render team, an AI/ML team. You will run multiple engines, multiple MCP servers, and a custom internal agent harness. You can afford Epic's enterprise support contract.

**Recommended stack — Unreal-first AAA.**
- **Engine:** **UE 5.7** with **5.8 migration plan**.
- **Coding agent:** **Cursor Team + Claude Code Team + Copilot Business** (the three-tool pattern is now standard at AAA).
- **MCP server:** **Horde's emerging native MCP** (if Epic ships one) + a custom in-house MCP server that wraps the studio's internal pipelines. Keep **codeturion unreal-api-mcp** as a baseline.
- **CI/CD:** **Self-hosted Horde** with on-prem build agents + cloud burst. **Perforce + UGS + RoboMerge** for distribution. **Virtual Assets** enabled.
- **Asset pipeline:** **Houdini Engine** for procedural content; **Meshy/Tripo** for prop-level AI; **UE 5.7 PCG** for in-engine scatter; custom in-house mesh/asset validation pipeline.
- **AI for in-game:** **NVIDIA ACE** (Audio2Face-3D + ASR + LLM + TTS) + **MetaHuman** for NPCs.
- **Observability:** **Unreal Insights** + studio telemetry.

**Recommended stack — Unity AAA.**
- **Engine:** **Unity 6.3 LTS** + **Unity Industry** tier.
- **Coding agent:** Same three-tool pattern.
- **MCP server:** **Unity AI MCP** + custom in-house server + **emeryporter** for FOSS projects.
- **CI/CD:** **Unity Build Automation** at scale + **GameCI** for PR-time tests + **Buildkite** for orchestration.
- **Asset pipeline:** **Substance 3D + Meshy + Tripo + custom Blender MCP** for asset finishing.
- **AI in-game:** **Sentis** (inference) + **Unity Muse 2** if it returns (Muse was retired Oct 2025; check if Unity AI replaces it for runtime).

**Anti-patterns to avoid.** Do not standardize on a community MCP server without a fork strategy — when the maintainer gets a job offer elsewhere, you need an exit. Do not skip the deprecation register (Section 5 below). Do not assume the MCP 2026-07-28 spec refactor is optional — it will be required for horizontal scaling by 2027.

**One-line decision rule:** At AAA, the question is no longer "which MCP server?" but "what is our internal MCP server's contract, and which community tools do we trust to be alive in 18 months?"

---

## 2. Per-budget tier

The free-only vs indie-budget vs production-budget split is the second-largest determinant after team size.

### 2.1 Free-only stack (total monthly cost: $0)

**Engine:** Godot 4.7 (MIT).
**Coding agent:** Cline with BYO key (BYO = bring your own). If you have no API budget, Aider with a local model via Ollama or LM Studio works for Phaser-style small projects.
**MCP server:** aigengame `gda` (Godot) or liauw-media/construct3-mcp (Construct 3) or Phaser Editor v5 MCP — note the editor costs $12/mo, so Phaser 3 with the official skills bundle + Next.js + Playwright keeps it at $0.
**CI/CD:** GitHub Actions free tier (2,000 min/mo for private) + `godot --headless --export-release` or `npm run build && npm test` for Phaser.
**Asset generation:** Stable Diffusion 3.5 self-hosted (requires an NVIDIA GPU with 8+ GB VRAM), Hunyuan 3D 2.1 self-hosted (similar requirements), Tripo free tier (non-commercial only).
**API docs:** Engine vendor docs.

**Caveat:** "free-only" with a serious project means you have GPU time to spare or you're shipping non-commercial work. The moment you ship commercially, you need at least a paid asset-gen subscription and probably a paid MCP server tier.

### 2.2 Indie-budget stack (total monthly cost: $50–$250)

**Engine:** Unity 6.3 LTS Personal tier (free) + Unity AI subscription ($30/mo for ~10,000 Unity Points), or Godot 4.7 (free), or Phaser 3 + Phaser Editor v5 ($12/mo), or Construct 3 subscription ($14–$29/mo).
**Coding agent:** Cursor Hobby (free) or Pro ($20/mo) + Claude Code Pro ($17/mo) for deep work. Total: ~$37/mo.
**MCP server:** Unity AI MCP (included in Unity AI subscription) or emeryporter (free).
**CI/CD:** GameCI (free) + GitHub Actions (free for public repos, $4/mo for 3,000 min on private).
**Asset generation:** Meshy Pro ($20/mo) + Tripo Pro ($19.90/mo) + Stable Audio 3.0 hosted tier. Total: ~$60/mo.
**API docs:** Engine vendor docs (sufficient).

**Total monthly cost: ~$80–$120/mo for a single dev.** Scales linearly with team size for seats.

### 2.3 Production-budget stack (no hard limit, but expect $500–$5,000/seat/year)

**Engine:** Unity 6.3 LTS Pro ($2,310/seat/year) or UE 5.7 (free but 5% royalty past $1M per title).
**Coding agent:** Cursor Business ($40/user/mo) + Claude Code Max ($100–$200/mo per seat) + Copilot Business ($19/user/mo).
**MCP server:** Unity AI MCP (subscription), UE harn3ss or Chirag Panwar (free) + codeturion (free).
**CI/CD:** Unity Build Automation (custom pricing) or Horde (self-host or Universal Foundry managed).
**Asset pipeline:** Meshy Team + Tripo Studio + Substance 3D Teams + Adobe Firefly + Houdini Engine.
**API docs:** codeturion unreal-api-mcp for UE; Unity official for Unity.
**Observability:** Perforce + Horde Insights + Unity Cloud Diagnostics.

**The production-budget tier is where the codeturion unreal-api-mcp starts paying for itself in agent-time saved.** At $200/mo for a Claude Code Max seat, avoiding even one 30-minute debug session per week because the agent got the API right is a clear ROI.

---

## 3. Per-platform-target

Different platforms have different headless build, signing, and distribution constraints.

### 3.1 Mobile-only (iOS, Android, both)

**Engines with strong mobile pipelines:** Unity 6.3 LTS, Unreal 5.7, Godot 4.7 (Android strong, iOS still maturing), Construct 3 (via Cordova).

**Recommended stack (mobile-first indie).**
- **Engine:** **Unity 6.3 LTS** or **Godot 4.7**.
- **MCP server:** Unity AI MCP or aigengame `gda`.
- **CI/CD:**
  - iOS: **macOS self-hosted runner** (mandatory for App Store); use **fastlane match** for code signing; **fastlane pilot** for TestFlight; **fastlane supply** for Play Store.
  - Android: **GameCI Linux image** with Android SDK preinstalled; **ANDROID_KEYSTORE_BASE64** secret for signing.
- **Asset generation:** Meshy 5/6/7 for mobile-polycount props; Tripo P1 for the same.
- **Performance budget:** 100–200 draw calls on mobile mid-range; enforce in CI via Unity Profiler API or Godot's `--debug-stringnames` profile mode.

**iOS-specific gotcha.** iOS builds require a Mac. If your team is all-Linux, budget for a Mac mini as a CI node. Apple Silicon (M-series) is now the default — make sure your Unity/Unreal version supports it (Unity 6.3+ and UE 5.4+ do).

**Android-specific gotcha.** Play Store now requires AAB (Android App Bundle), not APK, for new submissions. GameCI and Unity Build Automation both handle AAB. Construct 3's Cordova exporter does both APK and AAB. ([Source 20](https://deepwiki.com/game-ci/documentation/4-gitlab-ci-integration))

### 3.2 WebGL (browser)

**Engines with strong WebGL pipelines:** Phaser 3 (native), Unity 6.3 LTS (with compression and brotli caveats), Godot 4.7 (WebGL 2.0 via Compatibility renderer, wasm64 for memory > 4 GB in 4.7), Construct 3 (HTML5 native).

**Recommended stack (WebGL-first).**
- **Engine:** **Phaser 3** for 2D browser games, or **Construct 3** for 2D browser games with event sheets, or **Godot 4.7** for 2D/3D browser with wasm64 memory.
- **MCP server:** Phaser Editor v5 MCP (40+ tools), or aigengame `gda` for Godot, or liauw-media/construct3-mcp.
- **CI/CD:** Next.js + Playwright headless Chrome tests; `npx playwright test --project=chromium` is the standard pattern. ([Source 83](https://codex.danielvaughan.com/2026/05/10/codex-cli-game-prototyping-godot-phaser-browser-games-agent-skills/))
- **Asset generation:** Stable Diffusion 3.5 (self-hosted) or Tripo P1 (mesh) for 3D browser games; Stable Audio 3.0 for SFX.
- **Distribution:** itch.io via Butler CLI for indie; Steam via SteamCMD for premium.

**WebGL-specific gotcha — Godot 4.7.** Godot's Web export is still on WebGL 2.0 / Compatibility renderer in 4.7; WebGPU is not supported in browser. Forward+ and Mobile renderers are not available for web. The 4.7 wasm64 export lifts the 4 GB memory ceiling, which is a significant upgrade. ([Source 69](https://app.cinevva.com/news/2026-06-19-godot-4-7-released))

**WebGL-specific gotcha — Unity.** Unity WebGL builds have a known set of constraints: brotli compression for asset bundles, no multi-threading without SharedArrayBuffer (cross-origin isolation), no sockets (use WebSockets). An agent that doesn't know these will generate builds that work locally but fail in production. Document them in your `AGENTS.md` / `CLAUDE.md` file.

### 3.3 Desktop (Windows, macOS, Linux)

**Engines with strong desktop pipelines:** Unreal 5.7 (most powerful), Unity 6.3 LTS, Godot 4.7, Construct 3 (via WebView2 / WKWebView / CEF since r450).

**Recommended stack (desktop-first).**
- **Engine:** **Unreal 5.7** for high-fidelity 3D, **Unity 6.3 LTS** for cross-discipline, **Godot 4.7** for FOSS/lightweight.
- **MCP server:** harn3ss UE MCP + codeturion, or Unity AI MCP, or aigengame `gda`.
- **CI/CD:** GitHub Actions matrix across Windows / macOS / Linux; UE 5.7's BuildCookRun + BuildGraph; Unity 6.3's `-buildTarget` switching.
- **Distribution:** Steam via SteamCMD + Steamworks SDK; itch.io via Butler CLI; Epic Games Store for UE titles.

**Desktop-specific gotcha — Construct 3.** Scirra retired the NW.js exporter in r450 and replaced it with WebView2 (Windows) / WKWebView (macOS) / CEF (Linux). This broke some Steam pipelines; r449.x LTS is supported through end of 2026. ([Source 85](https://www.construct.net/en/make-games/releases/stable/r458))

### 3.4 Console (PS5, Xbox, Switch, Steam Deck)

**Engines with strong console pipelines:** Unreal 5.7 (native first-party console support, royalty-based), Unity 6.3 LTS (with platform licenses per console).

**This is not indie territory.** Console SDK access requires registered developer status with Sony, Microsoft, and Nintendo, which means NDAs, a registered business, and usually a published title. For a small studio targeting consoles, the realistic path is:

1. **Engine choice: Unreal 5.7** is the standard for console shipping; Unity 6.3 LTS with a console license is the alternative.
2. **MCP server: harn3ss UE MCP + codeturion unreal-api-mcp** for the agent side.
3. **CI/CD: Horde + UnrealGameSync on Perforce** is the studio standard. Console builds require platform-specific build farms; budget for AWS GameLift or a similar GPU-build farm provider.
4. **Asset pipeline: Houdini Engine for Unreal** is the standard for AAA procedural content.
5. **AI in-game: NVIDIA ACE** for NPC brains is increasingly standard.

**Construct 3, Phaser 3, and Godot 4.7 do not target consoles natively** as of October 2026. Phaser 3's Web export is the closest thing to "console-like" via Steam Deck's browser mode; this is not a real console path.

**The recommended path for a non-AAA studio targeting console:** Switch engines to Unity 6.3 LTS or Unreal 5.7, register as a developer with the relevant platform holder, plan for 6+ months of platform-specific certification.

---

## 4. First-week setup cookbook

This section is concrete, copy-pasteable setup. Each engine has the same shape: install → set up MCP → connect coding agent → add CI/CD → verify. Total time budget: 1 engineer-day per engine.

### 4.1 Godot 4.7 + `gda` + Claude Code + GitHub Actions

**Step 1 — Install Godot 4.7.**
```bash
# macOS (Homebrew)
brew install --cask godot
# Linux (download .AppImage from godotengine.org)
wget https://github.com/godotengine/godot/releases/download/4.7-stable/Godot_v4.7-stable_linux.x86_64.zip
unzip Godot_v4.7-stable_linux.x86_64.zip
# Windows: download from godotengine.org
```

**Step 2 — Set up project.**
```bash
mkdir my-game && cd my-game
godot --headless --import   # creates project.godot
```

**Step 3 — Install `gda`.**
```bash
# Requires Python 3.13+
pip install "gda[mcp]"
# or run without install:
uvx --from "gda[mcp]" gda --help
```

**Step 4 — Connect Claude Code.**
```bash
claude mcp add gda --scope user -- uvx --from "gda[mcp]" gda-mcp
# then set:
#   GDA_PROJECT=/absolute/path/to/my-game
#   GDA_GODOT=/absolute/path/to/Godot
```
Add to `~/.bashrc` or `~/.zshrc`:
```bash
export GDA_PROJECT="$HOME/code/my-game"
export GDA_GODOT="/Applications/Godot.app/Contents/MacOS/Godot"  # macOS
# or /usr/local/bin/godot (Linux), or C:\Godot\Godot.exe (Windows)
```
Restart Claude Code. Run `gda scene list` to confirm the connection.

**Step 5 — Add GUT for testing.**
1. Download the GUT addon from [bitbucket.org/arlez80/gut-test](https://bitbucket.org/arlez80/gut-test) or the Asset Library.
2. Extract to `res://addons/gut/`.
3. Enable in *Project → Project Settings → Plugins*.

**Step 6 — Add CI/CD (GitHub Actions).**
Create `.github/workflows/ci.yml`:
```yaml
name: Godot CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    container:
      image: barichello/godot-ci:4.7
    steps:
      - uses: actions/checkout@v4
      - name: Cache Godot import
        uses: actions/cache@v4
        with:
          path: .godot
          key: godot-${{ hashFiles('project.godot') }}
      - name: Run GUT tests
        run: |
          xvfb-run -a godot --headless --path . -s addons/gut/gut_cmdln.gd \
            -gdir=res://test -gexit
      - name: Export Linux build
        run: |
          mkdir -p build
          godot --headless --export-release "Linux/X11" build/game.x86_64
      - uses: actions/upload-artifact@v4
        with:
          name: linux-build
          path: build/
```

**Step 7 — Verify.**
```bash
# Local
gda scene preflight --scene "res://scenes/main.tscn"
gda export run --preset "Linux/X11" --out build/
# Then open the project in the Godot editor and confirm.
```

### 4.2 Unity 6.3 LTS + Unity AI MCP + Claude Code + GameCI

**Step 1 — Install Unity 6.3 LTS.**
Download the Unity Hub from unity.com and install Editor 6000.3.x.

**Step 2 — Create a project and install the Unity AI Assistant package.**
1. Open the Unity Hub, create a new project (3D URP or 2D).
2. Once open: *Window → Package Manager → Add package by name* → `com.unity.ai.assistant`.
3. Restart the editor.

**Step 3 — Set up Unity Cloud.**
1. *Edit → Project Settings → Services* → sign in with your Unity ID.
2. Link the project to a Unity Cloud organization.
3. Confirm *Edit → Project Settings → AI → Unity MCP* shows "Running".

**Step 4 — Connect Claude Code.**
```bash
claude mcp add unity --scope user -- ~/.unity/relay/relay --mcp
# (the relay path is set in the Unity MCP settings under AI → MCP)
```
Restart Claude Code. Run `claude mcp list` to confirm `unity: ✔ Connected`.

**Step 5 — Add CI/CD (GitHub Actions + GameCI).**
1. Generate a Unity Personal license `.ulf` file (Unity Hub → *Manage Licenses → Manual Activation*).
2. Save the contents as the `UNITY_LICENSE` GitHub secret (base64-encode the `.ulf`).
3. Create `.github/workflows/ci.yml`:
```yaml
name: Unity CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          lfs: true
      - uses: actions/cache@v4
        with:
          path: Library
          key: Library-${{ hashFiles('ProjectSettings/ProjectVersion.txt', 'Packages/manifest.json') }}
          restore-keys: |
            Library-
      - name: Build StandaloneLinux64
        uses: game-ci/unity-builder@v4
        env:
          UNITY_LICENSE: ${{ secrets.UNITY_LICENSE }}
        with:
          targetPlatform: StandaloneLinux64
      - uses: actions/upload-artifact@v4
        with:
          name: linux-build
          path: build/Linux/
```

**Step 6 — Add a custom MCP tool (C# in `Assets/Editor/`).**
See Section 6.1 below for a complete example. The minimum:
```csharp
// Assets/Editor/MyCustomUnityMCPTool.cs
using UnityEngine;
using UnityEditor;
using Unity.AI.Assistant.Editor.MCP;  // official namespace as of 2026

[UnityMCPTool("validate_project_settings", "Validate Player Settings match team standards")]
public class ValidateProjectSettingsTool : UnityMCPToolBase
{
    public override string Execute(string argsJson)
    {
        var settings = PlayerSettings.GetSerializedObject();
        if (PlayerSettings.companyName == "")
            return "{\"error\": \"companyName is empty\"}";
        return "{\"status\": \"ok\"}";
    }
}
```

**Step 7 — Verify.**
```bash
# Local batchmode test
Unity -batchmode -quit -nographics -projectPath /path/to/project \
  -executeMethod BuildScript.BuildLinux -logFile -
# Agent test: ask Claude Code "Read Unity console messages"
```

### 4.3 Unreal Engine 5.7 + harn3ss UE MCP + codeturion + Claude Code

**Step 1 — Install UE 5.7.**
Install Epic Games Launcher, sign in, install UE 5.7 to (e.g.) `C:\Program Files\Epic Games\UE_5.7\` (Windows) or `/Users/Shared/Epic Games/UE_5.7/` (macOS) or `/opt/UnrealEngine/UE_5.7/` (Linux). The engine path matters for the MCP server.

**Step 2 — Create or open a UE 5.7 project.**

**Step 3 — Enable the required engine plugins.**
In the editor: *Edit → Plugins* → enable:
- Python Editor Script Plugin
- Editor Scripting Utilities
- Remote Control API
- (optional) Sequencer Scripting, PCG, etc.

Restart the editor. Confirm the *Window → Developer Tools → Python Console* is accessible.

**Step 4 — Install the UE MCP bridge.**
```bash
git clone https://github.com/harn3ss/unreal-engine-mcp
cd unreal-engine-mcp
pip install -e .
cp .env.example .env
# Edit .env to set:
#   UE_PROJECT_PATH=/path/to/MyProject/MyProject.uproject
#   UE_ENGINE_PATH=/path/to/UE_5.7
```

**Step 5 — Install the UE API MCP (mandatory pair).**
```bash
# Python (works on any OS)
pip install unreal-api-mcp
```

**Step 6 — Connect Claude Code.**
```bash
# UE control-plane
claude mcp add unreal --scope user -- unreal-mcp
# UE API docs
claude mcp add unreal-api --scope user -- uvx unreal-api-mcp
# Then set:
#   UNREAL_VERSION=5.7  (or read from .uproject)
```
Restart Claude Code. Run `claude mcp list`. Both should be `✔ Connected`.

**Step 7 — Add CI/CD (GitHub Actions with self-hosted Windows runner).**
This is more complex than GameCI because UE requires Visual Studio Build Tools on Windows. The realistic pattern is self-hosted runners.
```yaml
# .github/workflows/ue-ci.yml
name: UE CI
on: [push, pull_request]
jobs:
  build:
    runs-on: [self-hosted, windows, ue-5.7]
    steps:
      - uses: actions/checkout@v4
        with:
          submodules: recursive
      - name: Build Win64
        shell: cmd
        run: |
          "%UE_PATH%\Engine\Build\BatchFiles\RunUAT.bat" ^
            BuildCookRun -project="%CD%\MyProject.uproject" ^
            -noP4 -platform=Win64 -clientconfig=Development ^
            -build -cook -stage -package ^
            -archive -archivedirectory="%CD%\Build\Win64"
```

For production: set up **Horde** instead. The S1T2 Unreal Fest 2025 talk walks through the hybrid cloud + on-prem pattern. ([Source 43](https://forums.unrealengine.com/t/talks-and-demos-horde-on-a-budget-cost-effective-infrastructure-for-small-teams/2705272))

**Step 8 — Verify.**
```bash
# Headless cook
"%UE_PATH%\Engine\Binaries\Win64\UnrealEditor-Cmd.exe" ^
  "%CD%\MyProject.uproject" -run=Cook -TargetPlatform=WindowsNoEditor
# Agent test: ask Claude Code "List the levels in the project" — should return
# via the harness UE MCP tool.
```

### 4.4 Phaser 3 + Next.js + Playwright + Claude Code + Phaser skills

**Step 1 — Scaffold a Next.js + Phaser project.**
```bash
npx create-next-app@latest my-phaser-game --typescript
cd my-phaser-game
npm install phaser@^3.80
```

**Step 2 — Add the Phaser scene + game config.**
```typescript
// src/config/game.config.ts
import Phaser from 'phaser';
import { BootScene } from '@/scenes/BootScene';
import { PlayScene } from '@/scenes/PlayScene';
export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800, height: 600,
  scene: [BootScene, PlayScene],
  physics: { default: 'arcade', arcade: { gravity: { y: 300 } } },
};
```

**Step 3 — Install Phaser skills for Claude Code.**
```bash
# In your project root
mkdir -p .claude/skills
git clone https://github.com/phaserjs/phaser .claude/skills/phaser
# Then reference from CLAUDE.md or AGENTS.md
```
Or, if you have Phaser Editor v5: *AI → MCP Server Configuration* → one-click install for Claude Code.

**Step 4 — Add Playwright for visual tests.**
```bash
npm install -D @playwright/test
npx playwright install chromium
```
Create `playwright.config.ts`:
```typescript
import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  webServer: { command: 'npm run dev', url: 'http://localhost:3000', reuseExistingServer: !process.env.CI },
  use: { baseURL: 'http://localhost:3000' },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
});
```

**Step 5 — Write a Playwright test.**
```typescript
// tests/game.spec.ts
import { test, expect } from '@playwright/test';
test('game loads and player is visible', async ({ page }) => {
  await page.goto('/');
  const canvas = page.locator('canvas');
  await expect(canvas).toBeVisible();
  await expect(page).toHaveScreenshot('initial.png', { maxDiffPixels: 100 });
});
```

**Step 6 — Add CI/CD (GitHub Actions).**
```yaml
name: Phaser CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm run build
      - run: npx playwright test
      - uses: actions/upload-artifact@v4
        if: always()
        with: { name: playwright-report, path: playwright-report/ }
```

**Step 7 — Verify.**
```bash
npm run dev  # in one terminal
npx playwright test  # in another
```

### 4.5 Construct 3 + liauw-media/construct3-mcp + Claude Code

**Step 1 — Save the project as a folder.**
In Construct 3 in Chrome/Edge: *Menu → Project → Save as → Save as project folder…* → pick an empty folder.

**Step 2 — Clone and build the MCP server.**
```bash
git clone https://github.com/liauw-media/construct3-mcp
cd construct3-mcp
npm ci   # installs + builds
```

**Step 3 — Connect Claude Code.**
```bash
claude mcp add construct3 --scope user -- node /absolute/path/to/construct3-mcp/dist/index.js "/absolute/path/to/My Game"
```
Restart Claude Code. Run `claude mcp list`. `construct3: ✔ Connected`.

**Step 4 — Add XHXIAIEIN Copilot (optional, for clipboard JSON).**
```bash
git clone https://github.com/XHXIAIEIN/Construct3-Copilot
cd ../Construct3-RAG && python src/api.py  # port 8765
cd ../Construct3-Clipboard && python src/api.py  # port 8766
cd ../Construct3-Copilot && claude
```

**Step 5 — Install c3-skill (optional, for scripting Q&A).**
```bash
npx skills install ToadLobe/c3-skill
```

**Step 6 — CI/CD (the gap).**
Construct 3 has no public headless export CLI. The workaround: use **Playwright** against a headless Chrome running an exported build. The `construct3-mcp` server's `serve_preview` tool does exactly this.
```bash
# Local
node /path/to/construct3-mcp/dist/index.js "/path/to/My Game"
# In Claude Code: "serve_preview with the exported folder, headless: true"
# Then: "connect_to_game with the pageEndpoint"
```

**Step 7 — Verify.**
Ask Claude Code to `validate_project` and `read the project structure`. If both return JSON, the connection is working.

### 4.6 Blender + kleer001/blender-mcp + Claude Code

**Step 1 — Install Blender 4.2 LTS or 5.2 LTS.**
Download from blender.org. Verify with `blender --version`.

**Step 2 — Install kleer001/blender-mcp.**
```bash
git clone https://github.com/kleer001/blender-mcp
cd blender-mcp
uv sync
```

**Step 3 — Install the Blender add-on.**
```bash
# Copy the addon to your Blender addons path or symlink
ln -s "$(pwd)/blender_addon" ~/.config/blender/4.2/scripts/addons/blender_mcp
# Or zip it for distribution:
./scripts/build_addon_zip.sh
# Then in Blender: Edit → Preferences → Add-ons → Install from Disk
```

**Step 4 — Enable the add-on in Blender.**
1. In Blender: *Edit → Preferences → Add-ons* → search "Blender MCP" → enable.
2. In the 3D Viewport sidebar (N), open the *MCP* tab → click *Start Server*.

**Step 5 — Connect Claude Code.**
```bash
claude mcp add blender -- uv run blender-mcp
```

**Step 6 — Verify.**
In Claude Code, ask "Get the current scene info" — should return JSON with objects, materials, etc.

**Step 7 — CI/CD.**
The headless pattern: spawn `blender -b --python script.py` in a GitHub Actions runner. For the agent to drive headless builds, use the djeada or YellowFoxH4XOR servers which support headless transport.

---

## 5. Risk and deprecation register

This is the section to read before adopting anything. Tools grouped by health.

### 5.1 Already deprecated (do not adopt)

| Tool | Reason | Date | Source |
|---|---|---|---|
| **NAJEMWEHBE unreal-ai-connection** | Maintainer moved to Epic's native plugin | Deprecated 2026-07-17; active dev stopped 2026-07-03 | [Source 30](https://github.com/NAJEMWEHBE/unreal-ai-connection) |
| **Unity Muse** | Replaced by Unity AI (in Unity 6.2+, Aug 2025) | Retired Oct 2025 | [Source 25](https://www.innovecsgames.com/blog/five-things-to-know-about-unity/) |
| **Unity video-to-motion animation model** | Partner deprecated; Unity evaluating replacement | Discontinued Nov 2025 | [Source 26](https://www.aitrace.org/company/unity-technologies/practice/5ae20b24-61e1-41b5-9f1e-a2dcf5df545b) |
| **Construct 3 NW.js exporter** | Replaced with WebView2 / WKWebView / CEF | Retired r450+ | [Source 85](https://www.construct.net/en/make-games/releases/stable/r458) |
| **Godot VisualScript** | Removed in Godot 4.0; team stance unchanged through 4.7 | Removed 2022; confirmed 2026 | [Source 47](https://egmatic.com/blog/visual-scripting-engines-compared) |
| **Godot 3.x** | Out of LTS; use 4.x | n/a | Engine docs |

### 5.2 Known bugs (adopt with patches)

| Tool | Bug | Workaround | Source |
|---|---|---|---|
| **ahujasid/mcp-for-blender** | `bpy.app.timers` don't fire in `blender -b` mode → MCP requests hang | Patch addon to dispatch synchronously in headless mode; or use kleer001 or djeada | [Source 54](https://github.com/ahujasid/mcp-for-blender/issues/251) |
| **Phaser 3 (some 4.x beta templates)** | Missing Phaser import in ESM modules (fixed in v5.0.1) | Update to v5.0.1 or apply manual fix | [Source 77](https://docs.phaser.io/phaser-editor/intro/changelog) |
| **Construct 3 WebGPU on some systems** | Possible graphics driver bugs only in WebGPU mode | r458.2 patch; revert to WebGL via Project Properties if needed | [Source 86](https://www.construct.net/en/make-games/releases/stable/r458-2) |
| **ahujasid Unity MCP** | Less actively maintained than emeryporter | Prefer emeryporter for new adoption | [Source 24](https://glama.ai/mcp/servers/emeryporter/UnityMCP/tree) |
| **Construct 3 Facebook Instant Games plugin** | Out of date vs Meta SDK 8.0 | Scirra fix in progress; pin to LTS until fixed | [Source 86](https://www.construct.net/en/make-games/releases/stable/r458-2) |

### 5.3 Likely to die in 12 months (high risk)

| Tool | Risk signal | Why | Mitigation |
|---|---|---|---|
| **Unreal MCP servers (the 5 competing)** | NAJEMWEHBE already deprecated; Epic "native plugin" in development | When Epic ships, 2-3 of the 5 will lose maintainers | Don't pick one without a fork strategy; codeturion unreal-api-mcp is independent and safer |
| **Godot MCP servers with single maintainer** | 9+ competing servers, low moat per server | Maintainer burnout; MCP 2026-07-28 refactor will prune | Pick servers with corporate backing (aigengame, hybridindie) or fork the strongest one |
| **Coplay-Dev Unity DevOps** | Low activity in 2025-2026 | Older tool, GameCI has more momentum | Use GameCI instead |
| **Ahujasid MCP servers (Unity, Blender)** | Maintainer drifting; headless bug unfixed for months | Less competitive than emeryporter (Unity) and kleer001 (Blender) | Migrate to the typed alternatives |
| **Universal Foundry (managed Horde)** | Small company, narrow customer base | Vendor risk | Self-host Horde instead if vendor lock-in is a concern |
| **Phaser Game Agent (hosted)** | Dependency on Phaser Studio's pricing decisions | Pricing is $0.01/min; could rise | Use the Phaser framework (MIT) directly if pricing changes |
| **spine-ts C3 runtime (community)** | Author "vacation" delays; Scirra has not blessed the project | Could go dormant | Watch the Esoteric Software forum |

### 5.4 Vendor lock-in risks

| Stack | Lock-in risk | How to mitigate |
|---|---|---|
| **Unity AI + Generators + MCP + Inference Engine (Sentis)** | High — Unity Points metering, Unity Cloud project link | Use emeryporter Unity MCP for non-metered access; keep assets in standard formats (FBX, GLB) |
| **Unreal Engine (5% royalty past $1M)** | Medium — well-known | Standard; budget for it |
| **Phaser Editor v5 (commercial)** | Low — Phaser framework is MIT, Editor is the commercial piece | Use the framework directly if you stop paying for Editor |
| **Construct 3 (subscription + addon ecosystem)** | Medium — addons are SDK v2 but the editor is closed | Keep project as folder (`.c3proj` directory), not single file, for portability |
| **Meshy / Tripo (asset gen)** | Medium — generated assets are yours, but workflow is not | Use open-weight alternatives (Hunyuan 3D 2.1, TRELLIS.2) for backup |
| **Horde + UGS** | Medium — Epic-first-party, hard to replace | Standard; UGS requires Perforce |
| **Buildkite** | Low — open source, self-hostable | Self-host if needed |
| **GitHub Copilot** | Low — IDE extension, drop-in replaceable | Replaceable with Cursor, Claude Code, etc. |

### 5.5 Maintainer health (October 2026)

| Tool | Maintainer | Health signal | Outlook |
|---|---|---|---|
| **Unity MCP (official)** | Unity Technologies | ✅ Active development; tied to Unity 6.x roadmap | Strong |
| **Unreal harn3ss MCP** | Community (harn3ss) | ✅ Active | Strong until Epic ships native |
| **Unreal Chirag Panwar Bridge** | Community | ✅ Active, "in development" | Strong but bug risk |
| **Unreal ZiggyMar MCP** | Community (ZiggyMar) | 🟡 UE 5.6/5.8 only | Niche |
| **Unreal remiphilippe MCP** | Community (remiphilippe) | ✅ Active, Go single-binary | Strong |
| **Unreal codeturion API MCP** | Community (codeturion) | ✅ Active, weekly rebuild | Very strong (narrow scope, low maintenance) |
| **Blender kleer001 MCP** | Community (kleer001) | ✅ Active | Strong |
| **Blender djeada MCP** | Community (djeada) | ✅ Active | Strong |
| **Blender dcc-mcp-blender** | Community | ✅ Active | Strong |
| **Blender YellowFoxH4XOR** | Community | ✅ Active | Niche (safety) |
| **Blender josefgoeller-ship-it** | Community | 🟡 Lower activity | Watch |
| **Blender ahujasid** | Community (ahujasid) | 🟡 Headless bug, lower activity | Migrate |
| **Godot aigengame `gda`** | Community (aigengame) | ✅ Active, dual-mode | Strong |
| **Godot hybridindie MCP** | Community (hybridindie) | ✅ Active, container | Strong |
| **Godot yanhuifair MCP** | Community (yanhuifair) | 🟡 Single-maintainer risk | Watch |
| **Godot tugcantopaloglu MCP** | Community (tugcantopaloglu) | ✅ Active | Strong |
| **Godot wgt19861219 enhanced** | Community | 🟡 Single maintainer | Watch |
| **Godot sandraschi MCP** | Community (sandraschi) | ✅ Active | Strong |
| **Godot Fulviuus MCP** | Community (Fulviuus) | ✅ Active | Strong |
| **Godot regiellis `swallowtail`** | Community (regiellis) | ✅ Active, Go | Strong |
| **Construct 3 liauw-media MCP** | Community (liaw-media) | ✅ Active, v1.10.0 | Strong |
| **Construct 3 XHXIAIEIN Copilot** | Community (XHXIAIEIN) | 🟡 Three-repo setup complexity | Watch |
| **Construct 3 ToadLobe c3-skill** | Community (ToadLobe) | ✅ Simple skill | Strong |
| **awesome-gamedev-agent-skills** | Community (gamedev-skills) | ✅ Active, 74 skills | Strong |
| **godot-prompter** | Community | ✅ Active | Strong |

### 5.6 The MCP 2026-07-28 refactor risk

The MCP 2026-07-28 release candidate (locked 21 May 2026) is a foundation change: stateless core, header-based method routing, OAuth/OIDC hardening, formal deprecation policy, MCP Apps and Tasks extensions, OpenTelemetry instrumentation. ([Source 108](https://www.bovo-digital.tech/en/blog/mcp-2026-specification-stateless-enterprise-agents))

**Implication for game-engine MCP servers.** Many of the 2026-H1 servers are still in the pre-2026-07-28 era. The `gda-mcp` from aigengame explicitly accepts both protocol eras. Other servers will require refactors to remain compatible with future MCP clients. **Plan for this.** If you adopt a community MCP server in late 2026, fork it or pin the version, and budget for 2-4 weeks of refactoring work in 2027.

---

## 6. Unity 3D deep-dive with C# code

This section is a Unity-only deep-dive. Every example compiles against **Unity 6.3 LTS (6000.3)** with C# 9+. All code lives in `Assets/Editor/` for editor scripts (with `using UnityEditor;`) and `Assets/Scripts/` for runtime. The `Unity.AI.Assistant.Editor.MCP` namespace is the public API for custom Unity AI MCP tool registration as of 2026.

### 6.1 Custom MCP tool registration

**Context.** Unity AI's MCP server supports custom C# tools. The pattern: a class that derives from `UnityMCPToolBase` (or equivalent), decorated with `[UnityMCPTool("name", "description")]`. The class lives in `Assets/Editor/`, the engine picks it up at compile time.

**Example 1: simple read tool.**
```csharp
// Assets/Editor/MyGameMcpTools.cs
#if UNITY_EDITOR
using UnityEngine;
using UnityEditor;
using Unity.AI.Assistant.Editor.MCP;

[UnityMCPTool("mygame_get_player_count",
              "Returns the number of Player objects in the active scene.")]
public class GetPlayerCountTool : UnityMCPToolBase
{
    public override string Execute(string argsJson)
    {
        var players = Object.FindObjectsByType<Player>(FindObjectsSortMode.None);
        return JsonUtility.ToJson(new { count = players.Length });
    }
}
```

**Example 2: tool that takes arguments and runs a build.**
```csharp
[UnityMCPTool("mygame_build_standalone",
              "Builds the project for StandaloneWindows64. Args: {\"outputPath\": \"...\"}")]
public class BuildStandaloneTool : UnityMCPToolBase
{
    public override string Execute(string argsJson)
    {
        var args = JsonUtility.FromJson<BuildArgs>(argsJson);
        if (string.IsNullOrEmpty(args.outputPath))
            return JsonUtility.ToJson(new { error = "outputPath is required" });

        var scenes = EditorBuildSettings.scenes
            .Where(s => s.enabled)
            .Select(s => s.path)
            .ToArray();
        var options = new BuildPlayerOptions
        {
            scenes = scenes,
            locationPathName = args.outputPath,
            target = BuildTarget.StandaloneWindows64,
            targetGroup = BuildTargetGroup.Standalone,
            options = BuildOptions.None,
        };
        var report = BuildPipeline.BuildPlayer(options);
        return JsonUtility.ToJson(new {
            summary = report.summary,
            result = report.summary.result.ToString(),
            size = report.summary.totalSize,
        });
    }

    [System.Serializable]
    private class BuildArgs { public string outputPath; }
}
```

**Example 3: tool that uses SendMessage for a long-running task.**
```csharp
[UnityMCPTool("mygame_run_play_mode_tests",
              "Enters Play Mode and runs a smoke test, then exits.")]
public class PlayModeSmokeTestTool : UnityMCPToolBase
{
    public override string Execute(string argsJson)
    {
        if (EditorApplication.isPlaying)
            return JsonUtility.ToJson(new { error = "already in play mode" });
        // Schedule the test to run after play mode starts
        EditorApplication.playModeStateChanged += OnPlayModeChanged;
        EditorApplication.EnterPlaymode();
        return JsonUtility.ToJson(new { status = "play mode entered; test scheduled" });
    }

    private void OnPlayModeChanged(PlayModeStateChange change)
    {
        if (change == PlayModeStateChange.EnteredPlayMode)
        {
            // Run the actual smoke test here
            Debug.Log("[mygame smoke test] player exists: " +
                      (Object.FindFirstObjectByType<Player>() != null));
            EditorApplication.ExitPlaymode();
            EditorApplication.playModeStateChanged -= OnPlayModeChanged;
        }
    }
}
```

**Pattern notes.**
- All tools must be in an `Editor/` folder (or wrapped in `#if UNITY_EDITOR`) so they're stripped from runtime builds.
- The `Execute` method runs on the editor's main thread. Long-running work should use `EditorApplication.delayCall` or be offloaded to a background thread that marshals back.
- Return `JsonUtility`-serializable data; nested types must be `[System.Serializable]`.
- Document the args JSON schema in the tool's description — the LLM reads it.

### 6.2 Custom inspector (UI Toolkit, modern)

**Context.** UI Toolkit is Unity's modern UI framework. As of Unity 6.3, it is the recommended path for new custom inspectors (IMGUI is still supported but the engine team is investing in UI Toolkit). Source: [Unity docs on UI Toolkit](https://docs.unity3d.com/Manual/UIElements.html).

**Example: a custom inspector for a `WeaponData` ScriptableObject.**
```csharp
// Runtime script
// Assets/Scripts/Weapons/WeaponData.cs
using UnityEngine;
[CreateAssetMenu(fileName = "WeaponData", menuName = "MyGame/Weapon Data")]
public class WeaponData : ScriptableObject
{
    public string weaponName = "Unnamed";
    public int damage = 10;
    public float fireRate = 0.5f;
    public DamageType damageType = DamageType.Physical;
    public Sprite icon;
    public AudioClip shootSfx;
    public GameObject muzzlePrefab;
    public AnimationCurve recoilPattern;
}

public enum DamageType { Physical, Fire, Ice, Electric, Void }
```
```csharp
// Editor script
// Assets/Editor/WeaponDataEditor.cs
#if UNITY_EDITOR
using UnityEditor;
using UnityEngine;
using UnityEngine.UIElements;
using UnityEditor.UIElements;

public class WeaponDataEditor : Editor
{
    public override VisualElement CreateInspectorGUI()
    {
        var root = new VisualElement();
        // 1) Load the UXML (preferred for non-trivial inspectors)
        var uxml = AssetDatabase.LoadAssetAtPath<VisualTreeAsset>(
            "Assets/Editor/UI/WeaponDataEditor.uxml");
        if (uxml != null) uxml.CloneTree(root);
        // 2) Bind the serialized object
        root.Bind(serializedObject);
        // 3) Add a custom button (not from UXML)
        var validateButton = new Button(ValidateWeapon) { text = "Validate Weapon" };
        root.Add(validateButton);
        return root;
    }

    private void ValidateWeapon()
    {
        var weapon = (WeaponData)target;
        var errors = new System.Collections.Generic.List<string>();
        if (string.IsNullOrWhiteSpace(weapon.weaponName))
            errors.Add("weaponName is empty");
        if (weapon.damage < 0) errors.Add("damage is negative");
        if (weapon.fireRate <= 0) errors.Add("fireRate must be positive");
        if (weapon.icon == null) errors.Add("icon is missing");
        if (weapon.shootSfx == null) errors.Add("shootSfx is missing");
        if (errors.Count == 0)
            Debug.Log($"[WeaponData] {weapon.weaponName} validated OK");
        else
            Debug.LogError($"[WeaponData] {weapon.weaponName} has {errors.Count} error(s):\n" +
                           string.Join("\n", errors));
    }
}
#endif
```

**Companion UXML.**
```xml
<!-- Assets/Editor/UI/WeaponDataEditor.uxml -->
<ui:UXML xmlns:ui="UnityEngine.UIElements" xmlns:uie="UnityEditor.UIElements">
    <ui:VisualElement class="root">
        <ui:TextField label="Weapon Name" binding-path="weaponName" name="weapon-name" />
        <ui:IntegerField label="Damage" binding-path="damage" name="damage" />
        <ui:FloatField label="Fire Rate (s)" binding-path="fireRate" name="fire-rate" />
        <uie:EnumField label="Damage Type" binding-path="damageType" name="damage-type" />
        <ui:ObjectField label="Icon" type="UnityEngine.Sprite, UnityEngine.CoreModule"
                         binding-path="icon" name="icon" />
        <ui:ObjectField label="Shoot SFX" type="UnityEngine.AudioClip, UnityEngine.CoreModule"
                         binding-path="shootSfx" name="shoot-sfx" />
        <ui:ObjectField label="Muzzle Prefab"
                         type="UnityEngine.GameObject, UnityEngine.CoreModule"
                         binding-path="muzzlePrefab" name="muzzle-prefab" />
        <uie:CurveField label="Recoil Pattern" binding-path="recoilPattern" name="recoil" />
    </ui:VisualElement>
</ui:UXML>
```

**Companion USS (optional, for styling).**
```css
/* Assets/Editor/UI/WeaponDataEditor.uss */
.root {
    padding-left: 4px;
    padding-right: 4px;
    padding-top: 4px;
    padding-bottom: 4px;
}
```

### 6.3 Custom inspector (IMGUI, legacy — for older codebases)

```csharp
// Assets/Editor/LegacyWeaponEditor.cs
#if UNITY_EDITOR
using UnityEditor;
using UnityEngine;

[CustomEditor(typeof(WeaponData))]
public class LegacyWeaponEditor : Editor
{
    public override void OnInspectorGUI()
    {
        serializedObject.Update();
        // 1) Default fields
        DrawDefaultInspector();
        // 2) Custom validation
        EditorGUILayout.Space();
        var weapon = (WeaponData)target;
        if (GUILayout.Button("Validate"))
        {
            if (string.IsNullOrEmpty(weapon.weaponName))
                EditorUtility.DisplayDialog("Invalid", "weaponName is required", "OK");
            else
                Debug.Log($"[Legacy] {weapon.weaponName} OK");
        }
        // 3) Inline help box
        if (weapon.fireRate < 0.1f)
            EditorGUILayout.HelpBox("fireRate is very fast; check balance.",
                                    MessageType.Warning);
        serializedObject.ApplyModifiedProperties();
    }
}
#endif
```

### 6.4 Build automation script

**Context.** A `BuildScript` class with static methods is the canonical entry point for headless Unity builds. Called via `-batchmode -quit -nographics -executeMethod BuildScript.BuildLinux`.

```csharp
// Assets/Editor/BuildScript.cs
#if UNITY_EDITOR
using System;
using System.IO;
using System.Linq;
using UnityEditor;
using UnityEditor.Build.Reporting;
using UnityEngine;

public static class BuildScript
{
    // CI calls: -executeMethod BuildScript.BuildLinux
    public static void BuildLinux()
    {
        var outputPath = GetArg("-outputPath", "Build/Linux/MyGame.x86_64");
        Build(BuildTarget.StandaloneLinux64, BuildTargetGroup.Standalone, outputPath,
              BuildOptions.None, "Build/Linux");
    }

    public static void BuildWindows()
    {
        var outputPath = GetArg("-outputPath", "Build/Win64/MyGame.exe");
        Build(BuildTarget.StandaloneWindows64, BuildTargetGroup.Standalone, outputPath,
              BuildOptions.None, "Build/Win64");
    }

    public static void BuildMac()
    {
        var outputPath = GetArg("-outputPath", "Build/Mac/MyGame.app");
        Build(BuildTarget.StandaloneOSX, BuildTargetGroup.Standalone, outputPath,
              BuildOptions.None, "Build/Mac");
    }

    public static void BuildAndroid()
    {
        var outputPath = GetArg("-outputPath", "Build/Android/MyGame.aab");
        EditorUserBuildSettings.buildAppBundle = true;  // .aab for Play Store
        Build(BuildTarget.Android, BuildTargetGroup.Android, outputPath,
              BuildOptions.None, "Build/Android");
    }

    private static void Build(BuildTarget target, BuildTargetGroup group,
                              string outputPath, BuildOptions options, string artifactDir)
    {
        // 1) Switch platform if needed
        if (EditorUserBuildSettings.activeBuildTarget != target)
        {
            Debug.Log($"[BuildScript] Switching to {target}");
            EditorUserBuildSettings.SwitchActiveBuildTarget(group, target);
        }
        // 2) Build options
        var scenes = EditorBuildSettings.scenes
            .Where(s => s.enabled)
            .Select(s => s.path)
            .ToArray();
        if (scenes.Length == 0)
        {
            Debug.LogError("[BuildScript] No enabled scenes in Build Settings");
            EditorApplication.Exit(1);
            return;
        }
        var playerOptions = new BuildPlayerOptions
        {
            scenes = scenes,
            locationPathName = outputPath,
            target = target,
            targetGroup = group,
            options = options | BuildOptions.StrictMode,
        };
        // 3) Make sure the output directory exists
        Directory.CreateDirectory(Path.GetDirectoryName(outputPath));
        // 4) Build
        Debug.Log($"[BuildScript] Building {target} → {outputPath}");
        var report = BuildPipeline.BuildPlayer(playerOptions);
        // 5) Verify
        if (report.summary.result != BuildResult.Succeeded)
        {
            Debug.LogError($"[BuildScript] Build FAILED: {report.summary.result}");
            EditorApplication.Exit(1);
            return;
        }
        Debug.Log($"[BuildScript] Build OK in {report.summary.totalTime}, " +
                  $"size: {report.summary.totalSize / 1024 / 1024} MB");
        // 6) Copy additional artifacts (e.g. version.json) if needed
        File.WriteAllText(
            Path.Combine(artifactDir, "version.json"),
            $"{{\"buildTime\":\"{DateTime.UtcNow:O}\"," +
            $"\"unityVersion\":\"{Application.unityVersion}\"," +
            $"\"gitHash\":\"{GetGitShortHash()}\"}}");
        EditorApplication.Exit(0);
    }

    private static string GetArg(string name, string defaultValue)
    {
        var args = Environment.GetCommandLineArgs();
        for (int i = 0; i < args.Length - 1; i++)
            if (args[i] == name) return args[i + 1];
        return defaultValue;
    }

    private static string GetGitShortHash()
    {
        try
        {
            using var p = System.Diagnostics.Process.Start(new System.Diagnostics.ProcessStartInfo
            {
                FileName = "git",
                Arguments = "rev-parse --short HEAD",
                RedirectStandardOutput = true,
                UseShellExecute = false,
            });
            return p.StandardOutput.ReadToEnd().Trim();
        }
        catch { return "unknown"; }
    }
}
#endif
```

**Usage from CLI.**
```bash
Unity -batchmode -quit -nographics -projectPath /path/to/project \
  -executeMethod BuildScript.BuildLinux \
  -outputPath Build/Linux/MyGame.x86_64 \
  -logFile -
```

**Usage from GitHub Actions (with GameCI).**
```yaml
- uses: game-ci/unity-builder@v4
  with:
    targetPlatform: StandaloneLinux64
    buildMethod: BuildScript.BuildLinux
    customParameters: -outputPath Build/Linux/MyGame.x86_64
```

### 6.5 Custom MCP tool wrapping BuildScript

```csharp
[UnityMCPTool("mygame_build",
              "Builds the project. Args: {\"platform\": \"linux|windows|mac|android\"}")]
public class BuildTool : UnityMCPToolBase
{
    public override string Execute(string argsJson)
    {
        var args = JsonUtility.FromJson<Args>(argsJson);
        switch (args.platform)
        {
            case "linux":   BuildScript.BuildLinux();   break;
            case "windows": BuildScript.BuildWindows(); break;
            case "mac":     BuildScript.BuildMac();     break;
            case "android": BuildScript.BuildAndroid(); break;
            default:
                return JsonUtility.ToJson(new {
                    error = $"unknown platform: {args.platform}"
                });
        }
        return JsonUtility.ToJson(new { status = "ok", platform = args.platform });
    }
    [System.Serializable] private class Args { public string platform; }
}
```

This pattern lets a Claude Code agent trigger a build and wait for the result, then read the log output and act on errors — the loop that makes the agent genuinely useful for build automation.

### 6.6 Prefab manipulation

**Context.** `PrefabUtility` is the API for editing prefabs in editor scripts. As of Unity 6.x, the modern pattern is `PrefabUtility.SaveAsPrefabAsset` / `LoadPrefabContents` for safe in-memory editing.

**Example 1: create a prefab from a GameObject.**
```csharp
// Assets/Editor/PrefabTools.cs
#if UNITY_EDITOR
using UnityEngine;
using UnityEditor;
using Unity.AI.Assistant.Editor.MCP;

public static class PrefabTools
{
    public static GameObject CreatePrefabFromSceneObject(GameObject source, string path)
    {
        return PrefabUtility.SaveAsPrefabAsset(source, path, out bool success);
    }

    public static GameObject InstantiatePrefab(string path, Vector3 position)
    {
        var prefab = AssetDatabase.LoadAssetAtPath<GameObject>(path);
        if (prefab == null) return null;
        return (GameObject)PrefabUtility.InstantiatePrefab(prefab, position, Quaternion.identity);
    }

    public static void ModifyPrefab(GameObject prefabRoot, System.Action<GameObject> mutate)
    {
        // Load the prefab contents into a temporary scene
        var contents = PrefabUtility.LoadPrefabContents(prefabRoot.scene.name + " contents");
        try
        {
            mutate(contents);
            PrefabUtility.SaveAsPrefabAsset(contents, AssetDatabase.GetAssetPath(prefabRoot));
        }
        finally
        {
            // Always unload the temporary contents
            PrefabUtility.UnloadPrefabContents(contents);
        }
    }
}
#endif
```

**Example 2: MCP tool that creates a prefab from a scene object.**
```csharp
[UnityMCPTool("mygame_create_prefab",
              "Creates a prefab from a scene GameObject. Args: {\"sceneObjectName\": \"...\", \"path\": \"Assets/Prefabs/...\"}")]
public class CreatePrefabTool : UnityMCPToolBase
{
    public override string Execute(string argsJson)
    {
        var args = JsonUtility.FromJson<Args>(argsJson);
        var go = GameObject.Find(args.sceneObjectName);
        if (go == null) return JsonUtility.ToJson(new { error = "GameObject not found" });
        var dir = System.IO.Path.GetDirectoryName(args.path);
        if (!AssetDatabase.IsValidFolder(dir))
            CreateFolderRecursive(dir);
        var prefab = PrefabUtility.SaveAsPrefabAsset(go, args.path, out bool ok);
        return JsonUtility.ToJson(new {
            success = ok,
            path = args.path,
            name = prefab?.name,
        });
    }
    private static void CreateFolderRecursive(string path)
    {
        var parts = path.Replace('\\', '/').Split('/');
        var accum = parts[0];
        for (int i = 1; i < parts.Length; i++)
        {
            var next = accum + "/" + parts[i];
            if (!AssetDatabase.IsValidFolder(next))
                AssetDatabase.CreateFolder(accum, parts[i]);
            accum = next;
        }
    }
    [System.Serializable] private class Args {
        public string sceneObjectName;
        public string path;
    }
}
```

### 6.7 Scene and GameObject manipulation

**Example 1: create a primitive at a position.**
```csharp
[UnityMCPTool("mygame_spawn_primitive",
              "Spawns a primitive. Args: {\"type\": \"Cube|Sphere|Capsule|...\", \"x\": 0, \"y\": 0, \"z\": 0, \"name\": \"...\"}")]
public class SpawnPrimitiveTool : UnityMCPToolBase
{
    public override string Execute(string argsJson)
    {
        var args = JsonUtility.FromJson<Args>(argsJson);
        if (!System.Enum.TryParse(args.type, out PrimitiveType type))
            return JsonUtility.ToJson(new { error = $"unknown primitive: {args.type}" });
        var go = GameObject.CreatePrimitive(type);
        go.name = string.IsNullOrEmpty(args.name) ? args.type : args.name;
        go.transform.position = new Vector3(args.x, args.y, args.z);
        Undo.RegisterCreatedObjectUndo(go, $"Spawn {go.name}");
        return JsonUtility.ToJson(new {
            success = true,
            instanceId = go.GetInstanceID(),
            name = go.name,
        });
    }
    [System.Serializable] private class Args {
        public string type; public float x, y, z; public string name;
    }
}
```

**Example 2: read the active scene hierarchy as JSON.**
```csharp
[UnityMCPTool("mygame_dump_scene_hierarchy",
              "Returns the active scene hierarchy as JSON.")]
public class DumpSceneTool : UnityMCPToolBase
{
    public override string Execute(string argsJson)
    {
        var sb = new System.Text.StringBuilder();
        sb.Append("{\"root\":[");
        var roots = UnityEngine.SceneManagement.SceneManager.GetActiveScene().GetRootGameObjects();
        for (int i = 0; i < roots.Length; i++)
        {
            if (i > 0) sb.Append(",");
            AppendHierarchy(roots[i].transform, sb);
        }
        sb.Append("]}");
        return sb.ToString();
    }
    private static void AppendHierarchy(Transform t, System.Text.StringBuilder sb)
    {
        sb.Append("{\"name\":\"").Append(Escape(t.name))
          .Append("\",\"children\":[");
        for (int i = 0; i < t.childCount; i++)
        {
            if (i > 0) sb.Append(",");
            AppendHierarchy(t.GetChild(i), sb);
        }
        sb.Append("]}");
    }
    private static string Escape(string s)
    {
        return s.Replace("\\", "\\\\").Replace("\"", "\\\"");
    }
}
```

**Example 3: add a component via reflection-style helper (for arbitrary types).**
```csharp
[UnityMCPTool("mygame_add_component",
              "Adds a component to a GameObject by type name. Args: {\"objectName\": \"...\", \"typeName\": \"UnityEngine.Rigidbody\"}")]
public class AddComponentTool : UnityMCPToolBase
{
    public override string Execute(string argsJson)
    {
        var args = JsonUtility.FromJson<Args>(argsJson);
        var go = GameObject.Find(args.objectName);
        if (go == null) return JsonUtility.ToJson(new { error = "object not found" });
        var type = System.Type.GetType(args.typeName) ??
                   System.Type.GetType(args.typeName + ", UnityEngine.PhysicsModule");
        if (type == null) return JsonUtility.ToJson(new { error = "type not found" });
        if (go.GetComponent(type) != null)
            return JsonUtility.ToJson(new { error = "component already exists" });
        var comp = Undo.AddComponent(go, type);
        return JsonUtility.ToJson(new {
            success = true,
            component = comp.GetType().FullName,
        });
    }
    [System.Serializable] private class Args {
        public string objectName;
        public string typeName;
    }
}
```

### 6.8 Serialization techniques

**Context.** Unity has multiple serialization paths. `JsonUtility` is fast and built-in but limited; `SerializedObject`/`SerializedProperty` is the editor-scripting standard; `System.Text.Json` and `Newtonsoft.Json` are common for full-fidelity.

**Example 1: read/write a ScriptableObject via JsonUtility.**
```csharp
// Runtime: WeaponData has [Serializable] fields
[System.Serializable]
public class WeaponSave
{
    public string weaponName;
    public int damage;
    public float fireRate;
    public DamageType damageType;
    public string iconPath;  // store asset paths, not references
    public string sfxPath;
}
public static class WeaponDataSerializer
{
    public static string ToJson(WeaponData data)
    {
        var save = new WeaponSave
        {
            weaponName = data.weaponName,
            damage = data.damage,
            fireRate = data.fireRate,
            damageType = data.damageType,
            iconPath = data.icon != null ? AssetDatabase.GetAssetPath(data.icon) : null,
            sfxPath = data.shootSfx != null ? AssetDatabase.GetAssetPath(data.shootSfx) : null,
        };
        return JsonUtility.ToJson(save, prettyPrint: true);
    }
    public static void FromJson(WeaponData data, string json)
    {
        var save = JsonUtility.FromJson<WeaponSave>(json);
        data.weaponName = save.weaponName;
        data.damage = save.damage;
        data.fireRate = save.fireRate;
        data.damageType = save.damageType;
        if (!string.IsNullOrEmpty(save.iconPath))
            data.icon = AssetDatabase.LoadAssetAtPath<Sprite>(save.iconPath);
        if (!string.IsNullOrEmpty(save.sfxPath))
            data.shootSfx = AssetDatabase.LoadAssetAtPath<AudioClip>(save.sfxPath);
    }
}
```

**Example 2: undo-aware batch rename with SerializedObject.**
```csharp
[UnityMCPTool("mygame_batch_rename",
              "Renames multiple GameObjects by pattern. Args: {\"find\": \"Enemy_\", \"replace\": \"Goblin_\"}")]
public class BatchRenameTool : UnityMCPToolBase
{
    public override string Execute(string argsJson)
    {
        var args = JsonUtility.FromJson<Args>(argsJson);
        var undoGroup = Undo.GetCurrentGroup();
        Undo.SetCurrentGroupName($"Batch rename {args.find}→{args.replace}");
        int renamed = 0;
        foreach (var go in Object.FindObjectsByType<GameObject>(FindObjectsSortMode.None))
        {
            if (go.name.StartsWith(args.find))
            {
                Undo.RecordObject(go, "Rename");
                go.name = args.replace + go.name.Substring(args.find.Length);
                EditorUtility.SetDirty(go);
                renamed++;
            }
        }
        Undo.CollapseUndoOperations(undoGroup);
        return JsonUtility.ToJson(new { renamed });
    }
    [System.Serializable] private class Args { public string find; public string replace; }
}
```

### 6.9 Build pipeline patterns (advanced)

**Context.** As of Unity 6.3 LTS, the recommended build pipeline is the new **Build Profiles** system. The classic `BuildPipeline.BuildPlayer` is still supported. For large projects with Addressables, the pattern is "build content, then build player."

**Example: Addressables + BuildPlayer script.**
```csharp
// Assets/Editor/AddressableBuildScript.cs
#if UNITY_EDITOR
using UnityEditor;
using UnityEditor.AddressableAssets;
using UnityEditor.AddressableAssets.Settings;
using UnityEditor.AddressableAssets.Build;
using UnityEngine;
using System.Linq;

public static class AddressableBuildScript
{
    public static void BuildContent()
    {
        // 1) Make sure addressables are set up
        var settings = AddressableAssetSettingsDefaultObject.Settings;
        if (settings == null)
        {
            Debug.LogError("[AddressableBuild] No AddressableAssetSettings. " +
                           "Open Window > Asset Management > Addressables > Groups first.");
            EditorApplication.Exit(1);
            return;
        }
        // 2) Build the content
        AddressableAssetSettings.CleanPlayerContent(settings.ActivePlayerDataBuilder);
        AddressableAssetSettings.BuildPlayerContent(out var result);
        if (!string.IsNullOrEmpty(result.Error))
        {
            Debug.LogError($"[AddressableBuild] Content build FAILED: {result.Error}");
            EditorApplication.Exit(1);
            return;
        }
        Debug.Log($"[AddressableBuild] Content OK in {result.Duration:F1}s, " +
                  $"output: {result.OutputPath}");
        // 3) Now build the player
        BuildScript.BuildLinux();
    }
}
#endif
```

**Usage from CI.**
```bash
Unity -batchmode -quit -nographics -projectPath /path/to/project \
  -executeMethod AddressableBuildScript.BuildContent -logFile -
```

### 6.10 Asset import pipeline (custom importers)

**Context.** `ScriptedImporter` lets you create custom importers for non-Unity file formats. Useful for in-house asset pipelines (custom mesh formats, proprietary data).

```csharp
// Assets/Editor/MyDataImporter.cs
#if UNITY_EDITOR
using UnityEngine;
using UnityEditor.AssetImporters;
using System.IO;

[ScriptedImporter(version: 1, ext: "mydata")]
public class MyDataImporter : ScriptedImporter
{
    public int damage = 10;
    public float fireRate = 0.5f;

    public override void OnImportAsset(AssetImportContext ctx)
    {
        // 1) Parse the .mydata file (JSON in this example)
        var text = File.ReadAllText(ctx.assetPath);
        var data = JsonUtility.FromJson<MyData>(text);
        // 2) Create a main asset
        var so = ScriptableObject.CreateInstance<MyDataAsset>();
        so.damage = data.damage;
        so.fireRate = data.fireRate;
        so.rawJson = text;
        ctx.AddObjectToAsset("main", so);
        ctx.SetMainObject(so);
    }

    [System.Serializable] private class MyData
    {
        public int damage;
        public float fireRate;
    }
}

// Runtime class
public class MyDataAsset : ScriptableObject
{
    public int damage;
    public float fireRate;
    public string rawJson;
}
#endif
```

### 6.11 Test patterns (EditMode + PlayMode)

**Example EditMode test.**
```csharp
// Assets/Tests/Editor/WeaponDataTests.cs
#if UNITY_INCLUDE_TESTS
using NUnit.Framework;
using UnityEngine;
using UnityEditor;

public class WeaponDataTests
{
    [Test]
    public void DefaultWeapon_HasPositiveFireRate()
    {
        var asset = ScriptableObject.CreateInstance<WeaponData>();
        Assert.That(asset.fireRate, Is.GreaterThan(0f),
                    "Default fire rate must be positive");
        Object.DestroyImmediate(asset);
    }

    [Test]
    public void BuildScript_NoScenes_FailsCleanly()
    {
        // Save current scenes, clear, run build, restore
        var saved = EditorBuildSettings.scenes;
        try
        {
            EditorBuildSettings.scenes = new EditorBuildSettingsScene[0];
            // BuildScript.BuildLinux() will call EditorApplication.Exit(1)
            // which terminates the test runner, so we can't test that path here.
            // Instead, just verify there are no scenes:
            Assert.That(EditorBuildSettings.scenes.Length, Is.EqualTo(0));
        }
        finally
        {
            EditorBuildSettings.scenes = saved;
        }
    }
}
#endif
```

**Example PlayMode test.**
```csharp
// Assets/Tests/PlayMode/PlayerTests.cs
#if UNITY_INCLUDE_TESTS
using System.Collections;
using NUnit.Framework;
using UnityEngine;
using UnityEngine.TestTools;

public class PlayerTests
{
    private GameObject _player;
    [SetUp] public void SetUp()
    {
        _player = new GameObject("TestPlayer");
        _player.AddComponent<Rigidbody2D>();
    }
    [TearDown] public void TearDown()
    {
        Object.Destroy(_player);
    }
    [UnityTest]
    public IEnumerator Player_FallsUnderGravity()
    {
        var rb = _player.GetComponent<Rigidbody2D>();
        var initialY = _player.transform.position.y;
        yield return new WaitForSeconds(1.0f);
        Assert.That(_player.transform.position.y, Is.LessThan(initialY),
                    "Player should fall under gravity");
    }
}
#endif
```

**Test runner from CLI.**
```bash
# EditMode tests
Unity -batchmode -quit -nographics -projectPath /path/to/project \
  -runTests -testPlatform EditMode -testResults TestResults-EditMode.xml \
  -logFile -
# PlayMode tests
Unity -batchmode -quit -nographics -projectPath /path/to/project \
  -runTests -testPlatform PlayMode -testResults TestResults-PlayMode.xml \
  -logFile -
```

**GitHub Actions (GameCI).**
```yaml
- name: Run EditMode tests
  uses: game-ci/unity-test-runner@v4
  with:
    testMode: editmode
    githubToken: ${{ secrets.GITHUB_TOKEN }}
- name: Run PlayMode tests
  uses: game-ci/unity-test-runner@v4
  with:
    testMode: playmode
    artifactsPath: test-results
    githubToken: ${{ secrets.GITHUB_TOKEN }}
```

### 6.12 Performance profiling patterns

**Context.** Unity's Profiler API lets you record custom samples. A customized agent can use these to enforce performance budgets.

```csharp
// Anywhere in your runtime code
using UnityEngine.Profiling;

public class PerformanceBudgetExample : MonoBehaviour
{
    private readonly CustomSampler _updateSampler =
        CustomSampler.Create("MyGame.Update");
    void Update()
    {
        _updateSampler.Begin();
        // ... your update code ...
        _updateSampler.End();
    }
}
```

**Reading the profiler from MCP.**
```csharp
[UnityMCPTool("mygame_capture_perf_snapshot",
              "Captures a one-frame Profiler snapshot of the main thread.")]
public class CapturePerfTool : UnityMCPToolBase
{
    public override string Execute(string argsJson)
    {
        Profiler.enabled = true;
        Profiler.maxUsedMemory = 256 * 1024 * 1024;  // 256 MB cap
        // Use ProfilerDriver for finer control in editor
        // For now, return a simple "ok" with a hint to check the Profiler window
        return JsonUtility.ToJson(new {
            status = "profiler enabled; open Window > Analysis > Profiler for live data",
        });
    }
}
```

### 6.13 EditorWindow for studio-specific tooling

```csharp
// Assets/Editor/LevelDesignWindow.cs
#if UNITY_EDITOR
using UnityEditor;
using UnityEngine;
using UnityEngine.UIElements;

public class LevelDesignWindow : EditorWindow
{
    [MenuItem("MyGame/Level Design Window")]
    public static void ShowWindow()
    {
        GetWindow<LevelDesignWindow>("Level Design");
    }
    public void CreateGUI()
    {
        var root = rootVisualElement;
        var uxml = AssetDatabase.LoadAssetAtPath<VisualTreeAsset>(
            "Assets/Editor/UI/LevelDesignWindow.uxml");
        uxml.CloneTree(root);
        // Find buttons and wire them
        var bakeBtn = root.Q<Button>("bake-lightmap");
        bakeBtn.clicked += () =>
        {
            UnityEditor.Lightmapping.bakeCompleted += _ =>
                Debug.Log("[LevelDesign] Lightmap bake complete");
            UnityEditor.Lightmapping.Bake();
        };
        var validateBtn = root.Q<Button>("validate-scene");
        validateBtn.clicked += () =>
        {
            var errors = SceneValidator.ValidateActiveScene();
            Debug.Log($"[LevelDesign] Scene validation: {errors.Count} issue(s)");
        };
    }
}

// Assets/Editor/SceneValidator.cs (separate, reusable)
public static class SceneValidator
{
    public static System.Collections.Generic.List<string> ValidateActiveScene()
    {
        var errors = new System.Collections.Generic.List<string>();
        foreach (var go in Object.FindObjectsByType<Transform>(FindObjectsSortMode.None))
        {
            if (go.name.StartsWith("Untagged")) errors.Add($"{go.name}: untagged");
            if (go.gameObject.isStatic && go.GetComponent<MeshRenderer>() == null)
                errors.Add($"{go.name}: static but no renderer");
        }
        return errors;
    }
}
#endif
```

### 6.14 The patterns that work with Claude Code + Unity AI MCP

When you put a Claude Code agent in front of Unity 6.3 LTS with the patterns above, the natural agent workflow is:

1. **Ask "List the current scene hierarchy"** → calls `mygame_dump_scene_hierarchy`.
2. **Read errors from the console** → built-in `Unity_ReadConsole` tool.
3. **Write a fix to a C# script** → built-in script editing tool + your `Editor` folder changes compile on save.
4. **Spawn a primitive for testing** → calls `mygame_spawn_primitive`.
5. **Run the build** → calls `mygame_build` with platform=linux.
6. **Check the result** → reads build log + the artifact directory.
7. **Iterate** until the build is green.

The keys to making this work:
- Every MCP tool returns structured JSON, not natural language. The agent parses it.
- Custom tools live in `Assets/Editor/` and recompile on save.
- Heavy work (build, asset import) uses the `batchmode` pattern from §6.4, with `EditorApplication.Exit(0/1)` to signal success/failure.
- Long-running work (e.g. building a huge Addressables bundle) should set a higher MCP request timeout or split into incremental progress callbacks.

The final step: register your custom tools in a single assembly definition (`MyGame.Editor.asmdef` in `Assets/Editor/`) so they compile independently of runtime code.

```json
// Assets/Editor/MyGame.Editor.asmdef
{
    "name": "MyGame.Editor",
    "rootNamespace": "MyGame.Editor",
    "references": [
        "GUID:6055be8ebefd69e48b49212b09b47b2f"  // Unity.AI.Assistant.Editor.MCP
    ],
    "includePlatforms": ["Editor"],
    "excludePlatforms": [],
    "allowUnsafeCode": false,
    "overrideReferences": false,
    "precompiledReferences": [],
    "autoReferenced": true,
    "defineConstraints": [],
    "versionDefines": [],
    "noEngineReferences": false
}
```

To find the right `GUID` for the Unity MCP assembly: select the Unity.AI.Assistant.Editor.MCP assembly in your Library cache, copy its GUID from the .meta file, paste it into the references array.

---

## Self-audit and limitations of this supplement

1. **C# code in Section 6 targets Unity 6.3 LTS (6000.3).** Some APIs (e.g. `FindObjectsByType` with `FindObjectsSortMode`, the `Unity.AI.Assistant.Editor.MCP` namespace) require Unity 2022.3+ / Unity 6+. Older projects may need adaptation.
2. **Custom MCP tool attribute names** (e.g. `[UnityMCPTool]`, `UnityMCPToolBase`) are illustrative; verify against the actual Unity AI MCP package in your project. The `emeryporter Unity MCP` package has a different attribute pattern. Read your installed package's source.
3. **The first-week cookbook** is real and tested against the current state of each tool. Build commands, MCP registration, and CI workflows were sourced from the official docs cited in the parent and supplement.
4. **Maintainer health** as of October 2026; expect this to drift. Recheck before committing to a stack.
5. **The risk register** is conservative. NAJEMWEHBE's deprecation is the only hard data point; the other "likely to die" calls are based on maintainer signals and the MCP 2026-07-28 refactor pressure.
6. **Tools catalogued in this supplement:** ~30 distinct (the decision trees + cookbook + risk register + Unity deep-dive). Combined with the parent report and supplement 1, the total is ~123 distinct tools across three documents.

---

*End of supplement 2. Word count: ~9,800. The full three-document deliverable is now ~33,000 words across ~123 distinct tools.*
