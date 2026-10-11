# COMBINED MARKDOWN - combine

_Generated 2026-10-10 21:47:16 | 12 files | folder: D:\stuff\docs\taylor_fv\github\rayrite.github.io\cvx\games\items\combine_

## Contents

1. 00-README[glm53max].md
2. 01-executive-summary.md
3. 02-unity.md
4. 03-blender.md
5. 04-unreal.md
6. 05-phaser.md
7. 06-godot.md
8. 07-construct.md
9. 08-agent-control-landscape.md
10. 09-uvp-section.md
11. 10-cross-engine-inventories.md
12. 11-sources.md

---

<!-- ====================================================================== -->
<!-- FILE: 00-README[glm53max].md -->
<!-- ====================================================================== -->

# Game-Dev IDE Automation & Agent-Control Roundup — 2026-10-10

Comprehensive roundup of software, tools, and innovations to **automate and control** six game-development IDEs/frameworks — **Unity 3D, Blender, Unreal Engine, Godot, Phaser 3, Construct 3** — researched 2026-10-10.

## Scope

What qualifies as in-scope:

- **Content-pipeline automation** — asset generation (AI and procedural), processing, retopology, atlas/packaging, builds.
- **Editor/IDE control** — CLIs, structured APIs, headless/batch modes, editor scripting, remote-control surfaces, MCP servers — anything that lets an external process (and eventually a custom LLM agent) drive the tool.
- **Tooling categories** — AI-driven generative tools, traditional scripting/API automation frameworks, visual scripting / node-based workflow solutions, CI/CD, automated testing/QA, distribution.
- **Provenance** — official ecosystem packages, FOSS/open-source projects, and third-party commercial software, separated by category throughout.

**Eligibility window for "latest":** released or significantly updated **2025-10-10 → 2026-10-10**. Established tools that remain the current standard are included and tagged `ESTABLISHED` so a dev team gets the full map, not just the newest entries. Every item carries a recency tag: `NEW`, `UPDATED`, or `ESTABLISHED`.

**Agent-control lens:** both structured surfaces (CLI/API/headless/MCP) and GUI-only automation are covered; the report calls out which is which, because the end goal is control by a customized agent.

## Deliverables index

| File | Contents |
| --- | --- |
| [01-executive-summary.md](01-executive-summary.md) | Top-line findings, market map, what changed in the last 12 months |
| [02-unity.md](02-unity.md) | Unity 3D — full tool inventory + headless/CLI/MCP quick-reference |
| [03-blender.md](03-blender.md) | Blender — full tool inventory + headless/CLI/MCP quick-reference |
| [04-unreal.md](04-unreal.md) | Unreal Engine — full tool inventory + headless/CLI/MCP quick-reference |
| [05-phaser.md](05-phaser.md) | Phaser 3/4 toolchain — full inventory + agent quick-reference |
| [06-godot.md](06-godot.md) | Godot — full tool inventory + headless/CLI/MCP quick-reference |
| [07-construct.md](07-construct.md) | Construct 3 — full inventory + automation surfaces |
| [08-agent-control-landscape.md](08-agent-control-landscape.md) | Cross-engine MCP/LLM-agent layer, maturity comparison, risks |
| [09-uvp-section.md](09-uvp-section.md) | **Special UVP section** — every Unique Value Proposition (technical + workflow) mapped to its tools |
| [10-cross-engine-inventories.md](10-cross-engine-inventories.md) | Cross-engine inventories: generative asset pipelines, CI/CD & testing, visual scripting |
| [11-sources.md](11-sources.md) | Master source list + deep-verification & flagged-unverified registers |

## Method

11 parallel research angles (one per engine ×6, plus cross-engine agent-control, generative asset pipelines, CI/CD & testing, visual scripting, and a version-grounding sheet), each requiring primary-source verification (official blogs/docs/release notes, GitHub repos + Releases) with dates. Load-bearing and surprising claims were re-verified against primary sources during synthesis; anything resting on a single source or that could not be re-verified is flagged inline as such.

- Research window: 2025-10-10 → 2026-10-10. Report date: 2026-10-10.
- Intermediates: `independent_research/scratch/2026-10-10-gamedev-roundup/`.
- Markdown tables in all deliverables were validated mechanically (column-count consistency, separator rows, header integrity).

## How to read the tool tables

Every engine file's inventory uses the same columns:

| Column | Meaning |
| --- | --- |
| Tool | Name (repo/package/product) |
| Type | OFFICIAL (engine vendor) / FOSS / COMMERCIAL |
| What it does | One-liner |
| Surfaces | Automation surfaces exposed: GUI / CLI / API / headless / MCP / CI / editor-scripting |
| Latest ver + date | Latest release in or before the window, with date evidence |
| License / price | License or pricing model |
| Recency | NEW (first released in window) / UPDATED (meaningfully updated in window) / ESTABLISHED (pre-window but current standard) |
| Notes | Maintenance risk, adoption signals, caveats |


---

<!-- ====================================================================== -->
<!-- FILE: 01-executive-summary.md -->
<!-- ====================================================================== -->

# Game-Dev IDE Automation & Agent Control Roundup — Executive Summary

**Report date:** 2026-10-10 · **Eligibility window:** 2025-10-10 → 2026-10-10 · **Engines:** Unity 3D, Blender, Unreal Engine, Phaser 3/4, Construct 3, Godot
**Recency tags:** NEW-in-window · UPDATED-in-window · ESTABLISHED (pre-existing standard) · Provenance tags: OFFICIAL / FOSS / COMMERCIAL
**Method:** 11 parallel research agents (~430 web searches + ~250 primary-source fetches), followed by an independent deep-verification pass on every load-bearing/disputed claim (Unity MCP→CLI migration, UE 5.8 MCP plugin, UE6 timeline, Godot AI policy, Unity 6.4 GA date, Blender Lab MCP — all verified against first-party sources; results folded into these files). Single-sourced items are flagged inline.

---

## The headline: 2026 is the year every engine became agent-controllable

Twelve months ago, driving a game engine from an LLM agent meant community hacks around editor GUIs. As of this window, **five of the six stacks now have a first-party or first-party-equivalent agent-control surface**, and the pattern that emerged is consistent: an MCP server (Model Context Protocol — the Anthropic-origin open standard, spec revision 2026-07-28) or a structured CLI that lets a coding agent (Claude Code, Cursor, Codex, Copilot, Gemini CLI, Windsurf…) inspect and drive the editor directly.

| Engine | First-party agent surface (window) | Status & date | Community layer |
|---|---|---|---|
| Unity | Unity CLI + `unity mcp` MCP Mode (free) + official Claude Code/Codex/Grok plugins | CLI announced Jul 15, 2026 (beta); in-editor MCP deprecated in favor of it | CoplayDev/unity-mcp 14.8k★, IvanMurzak 4.4k★, 8+ more |
| Blender | **Blender Lab MCP Server** — official, from the Foundation itself | v1.0.3, requires Blender 5.1+ (page ~Mar 2026) | mcp-for-blender 30.4k★ (largest game/3D MCP repo anywhere) |
| Unreal | **UE 5.8 built-in MCP Server (Experimental)** + Epic Developer Assistant (5.7) | UE 5.8 released Jun 17, 2026; docs updated Aug 17, 2026 | chongdashu 2.1k★ (dormant), IvanMurzak (new, active) |
| Phaser | **Phaser Game Agent MCP + Phaser Editor v5 with built-in MCP (40+ tools)** + 28 first-party agent skill files shipped in the framework repo | Game Agent Jun 2026; Agent MCP Jul 8, 2026; Editor v5 May 1, 2026 | Thin — official layer is the ecosystem |
| Construct 3 | **None** — no official MCP, no CLI export, no editor API | The automation gap is real (double-verified) | 18-star project-file MCP; nothing drives the editor |
| Godot | **None** — but 4.6 shipped LibGodot (embed/own the engine loop) | LibGodot Jan 26, 2026 | 5+ community MCPs incl. input-injection playtest servers; commercial GDAI ($19) |

**Agent-control maturity ranking** (0–5, from 08-agent-control-landscape.md): **Unity 5 · Blender 4.5 · Godot 3.5 · Unreal 3 · Phaser 3 (official, cloud-only) / 1.5 (local) · Construct 1.**

## The eight defining developments of the window

1. **Unity CLI (Jul 2026)** — the single biggest Unity automation event: a standalone `unity` binary that installs editors, builds, runs tests, executes C# (`unity command eval`, Roslyn, no domain reload), drives a *running* editor, and ships its own MCP Mode — free, localhost-only, agent-agnostic, no Unity AI subscription required. It supersedes both the Hub CLI (deprecated since 3.18.0) and the in-editor MCP server (deprecated; same protocol, migrated via `unity pipeline install` + `unity mcp configure <client>`).
2. **Epic's first-party AI entry (Nov 2025–Jun 2026)** — UE 5.7 shipped the Epic Developer Assistant (in-editor AI assistant); UE 5.8 shipped the experimental MCP Server built on the Toolset API. Early community reception was rough (a Jul 2026 HN critique: failed a basic FName map-key task), but 5.8.1 hotfixes landed within weeks. UE 5.8 is the last planned major UE5 release; UE6 (UE+UEFN merged, Verse-centric) is announced with Early Access targeted end-2027.
3. **Blender Foundation ships an MCP server** (Blender Lab, ~Mar 2026) — scene introspection, data-block ops, and arbitrary Python execution "without any guards" (their own words). Alongside: bpy wheels now track releases to 5.2.2 (Python 3.13), and a community fork (bpy-dev/blender-mcp) adds true headless agent operation with no GUI at all.
4. **Phaser went all-in on agents** — Phaser 4.0 "Caladan" (Apr 10, 2026, ground-up WebGL rebuild) ships 28 AI-agent skill files in-repo; Phaser Game Agent (Jun 2026) generates complete games (code + art + music) in a cloud sandbox (~500 credits per full game, from $0.01/min); Phaser Agent MCP (Jul 8, 2026) drives that from your own Claude Code/Cursor/etc.; Phaser Editor v5 ($12/mo, May 2026) has a built-in MCP server with 40+ tools.
5. **Godot's engine-level control primitives + AI-hostile governance** — 4.6 (Jan 26, 2026) shipped LibGodot, JSON GDExtension interface, and delta Patch PCKs; 4.7 (Jun 18, 2026) the in-editor Asset Store. Simultaneously the Foundation banned autonomous-AI and substantially-AI-generated engine contributions (Jun 30, 2026 policy — verified verbatim: "No autonomous AI agent use or vibe coding… We require all code to be human authored"). Both are true at once: engine automation is thriving; engine *contribution* by AI is banned.
6. **AI asset generation matured into API-first, engine-adjacent services** — Meshy-7/7.1 (REST + MCP), Tripo P2.0 (native quad meshes), TRELLIS.2 (MIT, 4B params, full PBR, ComfyUI), Hunyuan3D-2.1 (open). The 2026 pattern is MCP-native: Meshy/Tripo/Hunyuan plug directly into blender-mcp and Unity MCP servers as generation backends. Luma Genie is dead (Luma pivoted to video).
7. **The CI/CD layer consolidated around GitHub Actions + engine-native build tools** — GameCI v6 unified on game-ci/cli (Sep 10, 2026); Epic Horde (UE-native CI) gained an AWS/Terraform ecosystem; Unity CLI collapses local-CI and agent-CI into one surface; Godot has the smoothest headless story (`--headless --export-release`, gdUnit4 v6.2.2, chickensoft/firebelley actions). Unity licensing in CI got easier (personal-license `.ulf` secrets) while Unity Hub 3.18.0 shipped a license regression — avoid Hub in CI.
8. **Security and governance became load-bearing design constraints** — every MCP surface here executes arbitrary code by design (Unity `eval`, `execute_blender_code` unguarded, UE Toolset bridges). The MCP 2026-07-28 spec revision now explicitly treats tool annotations as untrusted and demands explicit user consent. Godot's contribution ban and Unity's Jul 2026 ToS restrictions on automated tooling are the ecosystem pushback signals. Treat agent-with-editor access as shell-equivalent.

## Where each stack is weakest (for a team planning agent control)

- **Unity** — the AI Assistant itself is beta and subscription-gated for Personal users ($10/mo after trial); the CLI (free) is the path that matters. Licensing remains the CI tax.
- **Blender** — no official headless-first story (Blender Lab MCP is GUI-attached; the headless route is a young community fork); "no guards" security posture.
- **Unreal** — official MCP is experimental and thin; the strongest community servers went dormant in mid-2025; binary asset formats make text-level agent edits impractical → Remote Control API / Toolset is the reliable surface.
- **Phaser** — the official agent stack is **cloud + credits only**; there is no local editor-control or runtime MCP; build/deploy automation is plain web CI.
- **Construct 3** — the biggest gap in the roundup: closed web editor, no CLI export, no editor API, no official automation surface; only project-file (`.c3p`/`.c3proj`) manipulation and browser automation (CDP) are possible. Double-verified.
- **Godot** — no official MCP, but the best *headless fundamentals* of all six (text scenes, built-in LSP, `--headless`, `--doctool` XML dumps) and the most diverse community MCP ecosystem.

## Reading guide

- **02–07** — per-engine deep dives: release timeline, full tool inventory tables (official/FOSS/commercial separated), headless/CLI/MCP quick-reference blocks.
- **08** — the agent-control landscape: every MCP server, maturity matrix, connection architectures, risks.
- **09** — the special UVP section (per request): every tool mapped to both technical-integration UVPs and user-facing workflow UVPs.
- **10** — cross-engine inventories: CI/CD per engine, testing, GenAI asset pipelines, visual scripting status everywhere.
- **11** — consolidated source list + flagged-unverified register.

## Top-line recommendation for an agent-controlled pipeline (synthesis)

For a team building a customized agent today: **Unity (via free Unity CLI + MCP) and Godot (headless-first + community MCP + best CI ergonomics) are the two most tractable full-stack targets; Blender via mcp-for-blender + official Lab MCP is the content-pipeline backbone; Unreal is viable through Toolset/Remote-Control but expect the least polished agent story until UE6; Phaser's official agent is excellent if cloud-hosted generation is acceptable; Construct cannot currently be automated end-to-end at all.**

---

*Generated by an 11-agent deep-and-wide research run; primary sources cited throughout. All version numbers and dates in this package were verified against first-party sources during the run unless explicitly flagged as single-sourced/inferred in 11-sources.md.*


---

<!-- ====================================================================== -->
<!-- FILE: 02-unity.md -->
<!-- ====================================================================== -->

# Unity 3D — Automation, Tooling & Agent Control

**Current stable:** Unity 6.6 (6000.6, Sep 1, 2026; latest patch 6000.6.5f1, Oct 8, 2026) · **Current LTS:** 6.3 LTS (Dec 4, 2025 → Dec 2027) · **Next:** Unity 7 announced Jul 21, 2026 (Unite Seoul) — preview Dec 2026, GA expected early 2027; "coding agents as first-class collaborators" is the stated theme.

## 1. Release timeline in window

| Version | Date | Type | Automation-relevant content |
|---|---|---|---|
| Unity 6.3 LTS (6000.3) | Dec 4, 2025 | LTS (to ~Dec 2027) | New UI Toolkit test framework (scriptable interactions, CI-verifiable); Adaptive Performance into core |
| Unity 6.4 (6000.4) | **Mar 17, 2026** (official Unity Discussions announcement; press coverage Mar 18–20 — both dates real, Mar 17 is first-party) | Update | DirectStorage (Win), AR Foundation 6.4, Collections core-embedded, launched alongside Unity Studio; final patch 6000.4.12f1 Jun 17, 2026 |
| Unity 6.5 (6000.5) | Jun 15, 2026 (single-sourced date) | Update | Supported release; import-result caching off by default in new projects |
| Unity 6.6 (6000.6) | Sep 1, 2026 | Update — CURRENT | DXC-for-DX12 option, Android edge-to-edge, GLES 3.1 min, iOS gRPC via UnityWebRequest; uGUI SafeArea; patches through 6000.6.5f1 (Oct 8, 2026) |
| Unity 6.0 LTS | EOL Oct 16, 2026 | LTS | Latest 6000.0.84f1 — plan migration to 6.3 LTS |
| Unity 7 (7000.0) | alpha line active (7000.0.0a5) | pre-GA | Announced Unite Seoul Jul 21, 2026: agentic dev-cycle collaboration, up to 90% faster shader compilation, near-instant Play Mode |
| Unity Hub 3.18.0 | May 6, 2026 | Tool | License-activation regression ("HandshakeResponse never sent"); **Hub CLI deprecated since this version** |

Licensing context (window): Dec 2025 — reported $250K–$2M/yr "minimum contribution" for largest customers; Enterprise required above $25M trailing-12-month revenue/funding (official pricing page confirms the $25M rule). Personal free under $200K. No runtime fee anywhere in 6.x.

## 2. Official tooling inventory (OFFICIAL)

| Tool | What it does | Surfaces | Latest ver + date | License/price | Recency | Notes |
|---|---|---|---|---|---|---|
| **Unity CLI** | Standalone `unity` binary: install editors, open/build projects, run tests, eval C# against a running editor, run MCP server, install agent skills | CLI (localhost), JSON/TSV/NDJSON output | 1.0.0-beta.10, Sep 22, 2026 (announced Jul 15, 2026) | Free; no Unity AI subscription needed; no concurrency limits | NEW | The headline automation item. Experimental — expect breaking changes. `unity command eval` runs C# via Roslyn, no domain reload, fewer tokens than MCP |
| **Unity MCP (official)** | MCP server exposing editor control to AI clients | MCP (stdio via relay binary → named pipes/Unix sockets into Editor) | Deprecated (in-editor server in `com.unity.ai.assistant`) → replaced by `unity mcp` (CLI) | Free; live-editor control needs Unity 6.0 LTS+ + Unity Pipeline package | NEW→superseded | Migration: `unity pipeline install` → `unity mcp configure claude\|cursor\|vscode\|windsurf` → `unity skill install <agent>`. Assistant pkg ≥2.13 required to avoid CLI conflict (docs-verified) |
| **Unity AI tools** (Assistant, Generators, Sentis, AI Gateway) | In-editor agentic assistant; sprite/texture/animation/audio/material generation; runtime NN inference; run third-party agents inside Assistant | In-editor; AI Gateway runs Claude Code/Codex/Gemini/Cursor in-Editor without Unity credits | Beta (open beta since ~May 1, 2026); `com.unity.ai.assistant` 2.13.0-pre.2 seen | Included Pro/Enterprise/Industry; Personal $10/mo after 14-day trial; 1,000 free one-time credits in beta | NEW | "Muse" brand deprecated; tools now use third-party models. One secondary source claims GA with 6.4 — official page still says beta; treat as beta |
| **Official Unity plugin for Claude Code / Codex / Grok** | Unity engineering skills (UI Toolkit/uGUI/TMP, URP/Shader Graph, physics, IAP, multiplayer, localization…) + CLI + MCP | Plugin/skills | Claude Code plugin ~Sep 9, 2026; Codex ~Sep 16, 2026 (single-sourced dates) | Free | NEW | `unity skill install` is the generic mechanism |
| Classic editor CLI (batchmode) | Headless builds/tests via `-batchmode -executeMethod` etc. | CLI | Unity 6.6 docs — none deprecated | Included | ESTABLISHED | New flags: `-build <path>`, `-activeBuildProfile`, `-quitTimeout`, `-refreshImportMode`; profile-based build path |
| Unity Hub CLI | Headless Hub ops | CLI | Deprecated (minimal support since Hub 3.18.0) | Free | ESTABLISHED, DEPRECATED-in-window | Use Unity CLI instead |
| Unity Test Framework | Edit/PlayMode tests, `runTests` CLI, JUnit XML | Editor + CLI | 1.6.0 ships with 6.4/6.5; 1.8.0 changelog Apr 10, 2026 (Test Runner UI + player-test builds) | Included | UPDATED | **2.0-exp line abandoned** (2.0.1-exp.2, 2022; Unity stated Dec 2024 no foreseeable updates). New UI Test Framework (UI Toolkit) core from 6.3 |
| Unity Performance Testing | Benchmarks (`Measure.Method/Frames`) | Package | 2.8.1-preview, Mar 2021 | Included | STALE | Dormant ~5.5 yrs — don't build on it |
| Unity Build Automation (ex-Cloud Build) | Cloud builds from commit/PR | Web/API | Active (incidents/maintenance in window) | Bundled with plans | ESTABLISHED | REST API surface not re-verified this run |
| Unity Accelerator | Asset import cache server | Server + CLI | Active; first-class in Unity CLI (`unity diagnose accelerator`) | Included | ESTABLISHED | |
| Unity DevOps / Version Control (ex-Plastic) | VCS + cloud build under Unity DevOps | CLI (`unity vcs …`), service accounts (`UNITY_SERVICE_ACCOUNT_ID/_SECRET`) | Active | Subscription tiers | ESTABLISHED/UPDATED | Game-server **Hosting deprecated Apr 1, 2026** |

**Visual Scripting status:** `com.unity.visualscripting` **1.9.12 is "released" for Unity 6000.6** — not deprecated, but effectively frozen (community threads Mar 2026; speculation places deprecation at Unity 7, unconfirmed). See 10-cross-engine for the full visual-scripting landscape.

## 3. FOSS inventory

| Tool | What it does | Latest ver + date | Recency | Notes |
|---|---|---|---|---|
| **CoplayDev/unity-mcp** | Leading community MCP bridge — 50 tool entrypoints + optional vfx/animation/ui/testing groups: scenes, GameObjects, C# editing, assets, run tests, profiling, builds, BYO-key AI asset gen, Blender Bridge | v10.3.0, Oct 4, 2026 (pushed Oct 8; 14,825★) | UPDATED (very active) | MIT; Unity 2021.3–6.x; Python 3.10+/uv; Claude Desktop/Code, Cursor, VS Code, Windsurf, Cline, Gemini, Codex + more; stdio+HTTP; remote-host with auth; IS the original justinpbarnett repo (transfered, API-confirmed); sponsored by Coplay → upsell to commercial Aura; not Unity-affiliated |
| **IvanMurzak/Unity-MCP** | "AI Skills, MCP Tools, and CLI" — claims 100+ tools; one-line C#-method→MCP-tool conversion | v0.93.3, Oct 10, 2026 | UPDATED (fastest cadence) | Apache-2.0; 4,416★; CI-tested vs Unity 6000.6.3f1; shares engine-agnostic core with its Godot/Unreal siblings; pre-1.0 versioning |
| CoderGamester/mcp-unity | Node WebSocket bridge plugin | pushed Sep 3, 2026 (1,925★) | UPDATED | Active but slowing |
| AnkleBreaker-Studio/unity-mcp-server | Unity Editor + Hub control; claims 268 tools | updated ~Oct 6, 2026 (492★) | NEW | Tool count is README-claimed |
| FunplayAI/funplay-unity-mcp | execute_code, input simulation, screenshots, play-mode automation | updated ~Oct 8, 2026 (260★) | NEW | "Most advanced" positioning |
| TheArcForge/Hades | macOS app serving Unity-project **knowledge graph** over MCP (32 tools) — context compression | pushed Sep 19, 2026 (28★) | NEW | Claude Code-specific |
| MosaicXR-AI/mosaic-bridge | ~290 claimed domain tools (procgen/sim/physics/rendering) | pushed Sep 29, 2026 (10★) | NEW | License NOASSERTION vs Apache claim — commercial-use hazard |
| gamekit-agent/gamekit-cli | CLI for Unity dev with Claude Code | pushed Feb 17, 2026 (65★) | NEW | Low momentum since Feb |
| **GameCI** (unity-builder/unity-test-runner/…) | GitHub Actions suite in Docker | unity-builder v6.0.0 (Sep 10, 2026, rewrite on game-ci/cli); test-runner v4.4.0/v4.3.2 (Sep 9, 2026); v4.1.0 (Dec 13, 2025) activation strategy change | UPDATED | See 10-cross-engine for CI detail |
| AltTester | Input-driven UI test automation (SDK free) | SDK 2.3.2 ~Jun 11, 2026; Desktop 2.3.3; new AltTester CLI "built for AI-assisted testing" | UPDATED | Desktop app commercial; license split — check LICENSE |
| akiojin/unity-mcp-server | deprecated → successor akiojin/unity-cli | — | superseded | |
| notargs/UnityNaturalMCP; nurture-tech "Union" | — | ARCHIVED | dead | |

## 4. Commercial third-party

| Tool | What it does | Status |
|---|---|---|
| **Coplay "Aura for Unity"** | Premium assistant/MCP product from the CoplayDev team; Orchestrator multi-task agent mode; Indie plan | UPDATED-in-window (Aura 15); single-sourced depth — evaluate directly |
| GameDriver | Test-automation SDK for Unity + Unreal (agent-in-app API, C#/Python, CI hooks) | Active (Unity 6.3 Boss Room samples Sep 18, 2026); pricing behind site |
| Meshy / Scenario / Kaedim | GenAI asset services with Unity import paths (Meshy free plugin; Scenario uses open-source agent skills instead of a plugin) | See 10-cross-engine GenAI section |
| AltTester Desktop | Driver UI for the FOSS SDK | Lite/Pro subscriptions |

## 5. Headless / CLI / agent-control quick reference (verified)

```bash
# === New Unity CLI (experimental; beta channel) — announced Jul 2026 ===
# macOS/Linux:
curl -fsSL https://public-cdn.cloud.unity3d.com/hub/prod/cli/install.sh | UNITY_CLI_CHANNEL=beta bash
# Windows PowerShell:
$env:UNITY_CLI_CHANNEL='beta'; irm https://public-cdn.cloud.unity3d.com/hub/prod/cli/install.ps1 | iex

unity install 6000.3.7f1 -m android --cm   # editor + modules (aliases: latest, lts, 6, 6.5)
unity open ./MyProject        # or: unity ./MyProject --wait
unity build --list-targets    # headless builds; also --list-profiles, 'build run'
unity test                    # Edit+PlayMode; exit 8 = tests ran & failed; --affected
unity watch test              # re-run on change
unity recompile --strict
unity command eval "return Application.version;" --json   # drive a RUNNING editor, no MCP
unity command eval_file script.cs
unity commands --format json  # machine-readable tool manifest
unity list                    # editor-registered tools with schemas
unity job                     # detached editor command jobs
unity mcp                     # MCP server (REPLACES deprecated in-editor MCP)
unity mcp configure claude|cursor|vscode|windsurf ; unity mcp configure --list
unity skill install <agent-name>
unity pipeline install        # Unity Pipeline package (prereq for driving a live editor; Unity 6.0 LTS+)
unity vcs setup|status|sync|doctor ; unity auth ; unity diagnose accelerator
# Output: --format human|tsv|json|ndjson|github ; env UNITY_FORMAT, UNITY_NON_INTERACTIVE,
#         UNITY_PROJECT_PATH, UNITY_SERVICE_ACCOUNT_ID/_SECRET ; logs: cli-log.json

# === Classic batch mode (fully supported in Unity 6.6) ===
Unity -batchmode -quit -projectPath <path> -buildTarget android \
  -executeMethod BuildScript.Run -logFile - -nographics -accept-apiupdate \
  [-activeBuildProfile <profile>] [-build <out>] [-quitTimeout N]

# Unity Test Framework CLI:
Unity -batchmode -nographics -runTests -testPlatform EditMode -testResults results.xml

# === Deprecated ===
# Hub CLI: 'Unity Hub -- --headless' (Win/mac) / '--headless' (Linux) — deprecated since Hub 3.18.0
# In-editor MCP server (com.unity.ai.assistant) — deprecated; use 'unity mcp'
```

**How agents connect (official):** MCP client → stdio → relay binary (`~/.unity/relay/… --mcp`) → named pipes (Win) / Unix sockets (mac/Linux) → in-editor bridge → tool registry. Requires Unity 6+, Unity Cloud project link, AI-beta trial/subscription for the *in-editor* assistant route — but **the CLI + MCP Mode is free and agent-agnostic** ("Installing the CLI doesn't require a Unity AI subscription", docs-verified).

**Three Unity agent-control architectures:** (1) Unity CLI commands/eval — fastest, cheapest tokens; (2) Unity CLI MCP Mode or deprecated in-editor MCP — standard MCP clients; (3) community MCPs (CoplayDev richest at 50+ tools incl. builds/tests/profiling).

## 6. CI essentials (Unity-specific)

- Activation: Personal → activate in Hub locally, store `.ulf` in `UNITY_LICENSE` secret (not platform-bound); Pro → `UNITY_SERIAL` + creds; or floating license server via `unityLicensingServer` input / `Unity.Licensing.Client` CLI.
- **Pin game-ci actions ≥ v4.3.2 / v5.0.1** for the Unity 6.6+ Docker shm fix (64 MB → ~1 GiB).
- Avoid Unity Hub in CI (3.18.0 activation regression).
- unity-activate@v2 has a reported wrong-version bug (Feb 2026, community-sourced).

## 7. Key sources

1. https://docs.unity.com/en-us/unity-cli/replace-mcp-server-unity-cli — MCP→CLI migration (deep-verified this run: exact quotes in run scratch)
2. https://docs.unity.com/en-us/unity-cli/unity-cli-reference ; https://docs.unity.com/en-us/hub/unity-cli
3. https://discussions.unity.com/t/announcing-the-unity-cli-a-new-way-to-connect-your-tools-and-agents/1731104 (Jul 15, 2026)
4. https://unity.com/blog/meet-the-unity-cli (Jul 20, 2026); https://unity.com/features/ai
5. https://unity.com/blog/unity-6-3-lts-is-now-available (Dec 4, 2025); discussions.unity.com "Unity 6.4/6.5/6.6 is now available"
6. https://docs.unity3d.com/Manual/EditorCommandLineArguments.html (6.6)
7. https://docs.unity.com/en-us/hub/cli-overview (Hub CLI deprecation)
8. https://github.com/CoplayDev/unity-mcp (+releases; api.github.com transfer check) — v10.3.0
9. https://github.com/IvanMurzak/Unity-MCP/releases — v0.93.3
10. https://github.com/game-ci/unity-builder/releases — v6.0.0
11. https://docs.unity.com/en-us/licensing-server (licensing); https://unity.com/pricing ($25M Enterprise rule)
12. Unity roadmap / Unite Seoul 2026 keynote recap (Jul 21, 2026) — Unity 7 agentic cycle

**Flagged/unverified:** Unity 6.5 exact date (single-sourced); Unity AI GA-vs-beta (official says beta); com.unity.ai.assistant exact latest pin; "Vector Embeddings" as a product (unverified — likely conflation with Sentis or Unity Vector ads ML); unity-ci/editor Docker image freshness; Build Automation REST endpoints; Unity 6.3 exact day (Dec 4 vs 5).


---

<!-- ====================================================================== -->
<!-- FILE: 03-blender.md -->
<!-- ====================================================================== -->

# Blender — Automation, Tooling & Agent Control

**Current stable:** Blender 5.2.2 LTS (Sep 15, 2026) · **LTS pin:** 5.2 LTS (Jul 14, 2026 → Jul 2028) · **In dev:** 5.3 (alpha, Oct 2026) · **Module route:** bpy 5.2.2 on PyPI (requires Python 3.13 exactly)

## 1. Release timeline in window (dates verified from download.blender.org file timestamps)

| Version | Date | Type | Automation-relevant content |
|---|---|---|---|
| 4.5 LTS | Jul 15, 2025 | LTS (to ~2027) | Bake node w/ shared storage; PyPI 4.5.14 updated Sep 15, 2026 |
| **5.0** | Nov 18, 2025 | Major (breaking) | **Breaking Python API**: ~15 modules private, BGL removed, `BLENDER_EEVEE_NEXT`→`BLENDER_EEVEE`, Action API legacy removed (`action.fcurves`→`channelbag.fcurves`), `scene.node_tree`→`scene.compositing_node_group`, custom props no longer dict-addressable, Vector→float32. **Render-log format changed** — farm/CI log parsers must be updated. ACES default, GN volumes+SDF |
| 5.0.1 | Dec 16, 2025 | Patch | |
| **5.1** | Mar 17, 2026 | Feature | USD `get_prim_map` export hook; FBX shapekey-normals export (engine-friendlier); AVIF; HTJ2K EXR; ffmpeg CRF control. **Minimum version for the official Blender Lab MCP server** |
| 5.1.1 / 5.1.2 | Apr 14 / May 19, 2026 | Patch | |
| **5.2 LTS** | Jul 14, 2026 | LTS (to Jul 2028) | GN simulation-zone bake items; **recommended pipeline pin** |
| 5.2.1 / 5.2.2 | Aug 25 / Sep 15, 2026 | Patch | 5.2.2 = current stable |
| 5.2.3 | planned Oct 20, 2026 | Patch | |
| 5.3 | alpha now | Dev | Do not pin |

Licensing: GPL unchanged; no AI policy press release found (verified negative — any "Blender Foundation AI statement" claim is unconfirmed).

## 2. Official surfaces (OFFICIAL)

| Tool | What it does | Surfaces | Latest ver + date | Recency | Notes |
|---|---|---|---|---|---|
| **Blender Lab MCP Server** | The Foundation's official MCP server: scene introspection, data-block rename, data-relationship queries, geometry-nodes auto-documentation, **arbitrary Python execution "without any guards"** (their wording) | MCP (add-on; source at projects.blender.org/lab/blender_mcp) | Add-on v1.0.3; requires Blender 5.1+; Lab page ~Mar 2026 | NEW | The most important 2026 Blender agent-control event — the Foundation itself ships an MCP server. No headless mode documented; sandbox it yourself |
| bpy (Python module) | Full Blender as a pip wheel — embed in scripts/CI without the app | PyPI | 5.2.2 (Sep 15, 2026); full in-window cadence 5.0.0→5.2.2 + LTS lines 4.5.14/4.2.23 | UPDATED | **Python ==3.13.\* pinned**; wheels 210–402 MB (cache in CI); non-LTS wheels are removed from PyPI after their line ends — pin LTS |
| Headless CLI | `--background --python`, `--python-expr`, `--factory-startup`, `--render-anim/-frame`, `--cycles-device CPU\|CUDA\|OPTIX\|HIP\|ONEAPI\|METAL` | CLI | 5.2 LTS manual | ESTABLISHED | No `--cli` flag exists (common hallucination). Watch the 5.0 log-format break for parsers |
| Geometry Nodes | Node-based procedural geometry; assets manipulable via bpy (node trees are data) — the real agent lever | Editor + bpy | GN assets/SDF/volumes (5.0), sim-zone bakes (5.2) | UPDATED | GN API evolves every release — pin LTS; bug #147172 in bake area |
| Flamenco | Render/workload farm (Manager+Worker+add-on); arbitrary command frames, MQTT events | Server + workers | 3.9.3 stable + 3.10-beta1; 3.8 (Dec 5, 2025) added web job editor + **backward-incompatible MQTT change**; 3.8.2 (Dec 29, 2025) | UPDATED | Self-hosted; doubles as a free batch job runner for asset baking. (Note: an early CI/CD sweep reported 3.7/Apr 2025 — superseded by the Blender-specialist sweep's 3.8→3.9.3 timeline, download-page-verified) |
| extensions.blender.org | Official extension platform | Web | ~16 fuzzy "AI" matches, **zero dedicated AI extensions** | ESTABLISHED | AI tooling lives on GitHub/marketplaces, not here |

## 3. MCP / LLM-agent bridges (community)

| Tool | What it does | Latest ver + date | Recency | Notes |
|---|---|---|---|---|
| **mcp-for-blender** (ahujasid; ex blender-mcp) | The dominant community MCP: `execute_blender_code`, `get_scene_info`, `look` (viewport/camera/wireframe/X-ray/animation-frame screenshots), PolyHaven (~2,400 CC0)/Sketchfab/Poly Pizza asset import, **built-in gen-3D backends: Hyper3D Rodin, Tripo, Hunyuan3D** | v2.1.9 (PyPI), Oct 6, 2026; ~30,422★ — largest game/3D MCP repo anywhere | UPDATED | MIT; renamed in-window; add-on = TCP JSON socket localhost:9876 **no auth/encryption** (VulDB RCE entry exists — never expose beyond localhost; `BLENDER_MCP_SAFE_MODE=1` recommended); clients incl. Claude Desktop/Code, Cursor, VS Code, Codex, Antigravity; Docker option |
| **bpy-dev/blender-mcp** | Headless distribution of the official Lab MCP: `BLENDER_MCP_CLI_BACKEND=1` → `_for_cli` tools run against saved .blend files via pip bpy — **agent-driven Blender with no GUI at all**; live generated API docs; per-call isolation+timeouts ("not an OS sandbox"); BlenderBench 27-task benchmark | dev preview; ~98★ | NEW | Young fork of an experimental official project — high maintenance risk, but the only maintained headless-first MCP route found |
| BlenderGPT (gd3kr) | Prompt→bpy assistant add-on | last commit Jun 10, 2023 | DEAD | Superseded by MCP servers; ignore "newgene3 fork" claims (unverifiable) |
| bpy-rpc | — | — | DOES NOT EXIST | PyPI 404 — a hallucination; RPC control = MCP or custom sockets |

## 4. FOSS pipeline / procedural tooling

| Tool | What it does | Latest ver | Recency | Notes |
|---|---|---|---|---|
| Sverchok | Node-based procedural geometry (parametric/code/script nodes) | 1.4.0, ~Mar 5, 2026; Blender 3.6–5.1 | UPDATED | GPL-3.0; drivable via bpy; use where GN is insufficient |
| AI Render (benrugg) | SD image generation in Blender (A1111, Stability API, SHARK; SDXL/Turbo) | v1.1.1, Dec 28, 2025 (5.0-compat fix) | UPDATED | MIT; single maintainer; ComfyUI support unverified |
| blenderless | Wrap headless Blender from Python without local install | 0.1.8 (date unverified) | thin | Prefer official bpy wheels |

## 5. Commercial tooling

| Tool | What it does | Status | Automation notes |
|---|---|---|---|
| **InstaLOD** | LOD/optimize/remesh; InstaLOD 2026 under Abstract (Feb 11, 2026); Jul 2026 added Adaptive Quad Remesher, NURBS Patch, Omniverse integrations | UPDATED | **CLI + Profile XML batch mode** — the pick for unattended CI LOD/remesh; indie-free under revenue threshold |
| QuadRemesher (Exoside) | Interactive quad retopology | v1.3 (docs rev. Feb 4, 2026) | **EULA forbids automated-process integration without a special agreement**; no CLI; Blender 5.x support NOT claimed (docs still say 2.93–4.0). Avoid pirate-mirror sites found during research |
| RetopoFlow 4 | Interactive retopo suite (BlenderMarket) | 4.x, stable on 4.5; 5.x unconfirmed | GUI-centric — weak automation fit |
| Retopia (Superhive) | Retopo add-on | released Sep 30, 2026; tested on 5.2 | NEW; first 5.2-ready commercial retopo verified this run |
| Cloud farms — Conductor / GarageFarm / RebusFarm / Render.st | Cloud rendering w/ Blender submission plugins | ESTABLISHED–UPDATED | **Conductor = strongest CI fit** (API-driven submission add-on); Render.st API claim single-sourced |

## 6. GenAI-3D touching Blender (summary; full landscape in 10)

Run TRELLIS.2 (MIT) / Hunyuan3D-2.1 headless and import GLB/OBJ via bpy, or use the gen-3D backends **built into mcp-for-blender** (Rodin/Tripo/Hunyuan, API-key gated). No official/confirmed TRELLIS.2 Blender plugin exists (Unreal-only via camenduru, Jan 10, 2026); Hunyuan3DBlenderBridge is single-sourced/high-risk. The official extensions platform has no AI extensions; Blender 5.0–5.2 shipped no first-party generative features (verified by absence).

## 7. Headless / CI / agent-control quick reference (verified)

```bash
# Binary mode
blender --background file.blend --factory-startup --render-anim
blender --background file.blend --render-frame 42 --cycles-device OPTIX
blender --background file.blend --python build.py -- arg1 arg2
blender --background --python-expr "import bpy; print(bpy.data.version)"

# Module mode (no Blender install; Python 3.13 exactly; LTS lines only survive on PyPI)
pip install bpy==5.2.2
python -c "import bpy; bpy.ops.mesh.primitive_cube_add(); bpy.ops.wm.save_as_mainfile(filepath='out.blend')"

# MCP agent control
uvx mcp-for-blender        # community server v2.1.9; BLENDER_MCP_SAFE_MODE=1 recommended
# official: Blender Lab MCP add-on v1.0.3 (Blender 5.1+) — "no guards"; sandbox it yourself
# headless agents (no GUI): bpy-dev/blender-mcp + BLENDER_MCP_CLI_BACKEND=1

# Farm/CI
Flamenco 3.9.3 (self-hosted; MQTT event stream) ; Conductor submitter (cloud API) ; InstaLOD CLI profiles (LOD/remesh)
```

**CI pattern (verified):** either install Blender in the job and run `blender -b --python`, or `pip install bpy==<LTS>` with Python 3.13 (cache the 200–400 MB wheel). No official GitHub Action exists (verified negative; community discussion #170070, Aug 2025, no shipped product). Do NOT build on nytimes/blender Docker images (dead since 2022-11-28, Blender 3.3.1); there is no official Foundation Docker image.

**Security posture:** all Blender MCP surfaces execute arbitrary Python. Official Lab: "without any guards". mcp-for-blender: unauthenticated localhost socket + VulDB entry. Treat agent+Blender as shell-equivalent; run under restricted user/container; keep SAFE_MODE on for untrusted prompts.

## 8. Key sources

1. https://www.blender.org/download/releases/ — release dates/LTS (file-timestamp verified)
2. https://developer.blender.org/docs/release_notes/5.0/python_api/ — 5.0 breaking changes + log-format change
3. https://developer.blender.org/docs/release_notes/5.1/pipeline_io/ — USD/FBX/AVIF (note slug: pipeline_io)
4. https://pypi.org/project/bpy/ — wheel matrix 5.0.0→5.2.2 + LTS lines
5. https://docs.blender.org/manual/en/latest/advanced/command_line/arguments.html — 5.2 LTS CLI flags
6. https://www.blender.org/lab/mcp-server/ (+ projects.blender.org/lab/blender_mcp) — official MCP v1.0.3 (double-verified by two independent agents this run)
7. https://pypi.org/project/mcp-for-blender/ + https://github.com/ahujasid/mcp-for-blender — v2.1.9
8. https://github.com/bpy-dev/blender-mcp — headless CLI-backend distribution + BlenderBench
9. https://flamenco.blender.org/download/ — 3.9.3/3.10-beta1
10. https://exoside.com/quadremesher/quadremesher-doc/ ; https://docs.instalod.io — retopo/remesh licensing constraints

**Flagged/unverified:** Flamenco 3.9.3 exact date (projects.blender.org blocked fetches); QuadRemesher 5.x compatibility (ask Exoside before buying); Blender Lab MCP source-repo details (Cloudflare-blocked); blenderless freshness; TRELLIS.2/Hunyuan community bridges (single-sourced); Render.st API; Hunyuan3D 3.1 claims.


---

<!-- ====================================================================== -->
<!-- FILE: 04-unreal.md -->
<!-- ====================================================================== -->

# Unreal Engine — Automation, Tooling & Agent Control

**Current stable:** UE 5.8 (GA week of Jun 17–23, 2026; official announcement post Jun 23; press GA Jun 17 from State of Unreal / Unreal Fest Chicago) · hotfixes 5.8.1 (Jul 2026, 260+ fixes incl. an MCP crash fix) → 5.8.2 (Aug 25, 2026, secondary-sourced) · **UE 5.8 is the last planned major UE5 release** · **UE6 announced** (first reveal ~May 24, 2026; official blog "[The road to Unreal Engine 6](https://www.unrealengine.com/News)" Jun 22, 2026): Early Access targeted end-2027, full release 12–18 months later, merges UE + UEFN, moves toward Verse. (UE6 status deep-verified this run.)

## 1. Release timeline in window

| Version | Date | Type | Automation-relevant content |
|---|---|---|---|
| UE 5.7 | Nov 12, 2025 | Major | **PCG production-ready + PCG editor mode** (draw-spline/paint-volume); Nanite Foliage/Assemblies (micro-instancing); Substrate production; MetaHuman 5.7 + Crowd; "Epic Developer Assistant" AI assistant (thin-sourced) |
| 5.7.2 / 5.7.3 | Jan 21 / Feb 2026 | Hotfix | 150+ / 45+ fixes |
| UE 5.8 Preview | May 13, 2026 | Preview | MCP visible in preview (mid-May) |
| **UE 5.8** | **GA Jun 17–23, 2026** | Major — CURRENT | **Experimental first-party Unreal MCP server** (editor control + engine-state queries, built on the Toolset API); Mesh Terrain (3D procedural sculpting); PCG + Procedural Vegetation Editor; MegaLights expansion; Control Rig Physics → Beta; AutomationDriver Python API |
| 5.8.1 | ~Jul 28, 2026 | Hotfix | 260+ fixes incl. **AI/ML MCP: avoid fatal crash adding a component to a Blueprint** |
| 5.8.2 | Aug 25, 2026 | Hotfix | secondary-sourced |
| Unreal MCP in **UEFN** | Aug 20, 2026 | Beta | MCP for Fortnite editors: Verse write/compile, devices, UMG, play sessions with Verse hot-push |
| UE6 | EA target end-2027 | announced | UE+UEFN unified; Verse-centric; first UE6 game revealed ~May 2026 |

Licensing: 5% royalty above $1M/product; "Launch Everywhere with Epic" reductions since Jan 2025; no change verified in window.

## 2. Official surfaces (OFFICIAL)

| Tool | What it does | Surfaces | Status | Recency | Notes |
|---|---|---|---|---|---|
| **Unreal MCP (in-engine, 5.8)** | First-party MCP server plugin — LLM agents invoke editor functionality; Epic even documents **"Working with PCG and LLMs Using Unreal MCP"** | MCP (stdio) | Experimental; docs updated Aug 17, 2026; Epic walkthrough "Using the UE5 MCP Server with Claude Code" (Jul 27, 2026) covers Claude Code / Codex CLI / Cursor | NEW | Port/endpoint/tool-list specifics not extracted this run — pull Epic's doc before wiring. Early reception mixed: a Jul 2026 HN critique reports failure at a basic FName map-key edit ("large editor surface vs limited tool-call bandwidth" is the structural issue) |
| **Unreal MCP in UEFN** | Coding agents write Verse, place devices, build UMG, run/stop/debug play with hot-push | MCP (Beta Access in editor settings) | Beta, Aug 20, 2026 | NEW | UEFN/Verse-scoped |
| Remote Control API + Presets | HTTP+WS API into a live editor: read/set exposed props, call remote functions | HTTP/WebSocket — **default port 30010** (`http://localhost:30010/remote/info`) | Current | ESTABLISHED | Still the lowest-friction non-MCP programmatic surface |
| Horde | Epic's open-source CI/CD orchestrator (BuildGraph, remote exec, device farms) — ships with UE source | Server + agents + dashboard/API | Versioned with 5.8; AWS Terraform module in progress (discussion #217); "How Epic Games Uses Horde" (Nov 2025); "Horde on a Budget" (Mar 2026) | UPDATED | Jenkins-migration friction reported; the UE-native CI path |
| UAT / UnrealBuildTool / BuildGraph / Gauntlet | Build/cook/package (UAT BuildCookRun), XML fan-out orchestration, gameplay-level test harness (headless/dedicated/multiplayer) | CLI | Maintained with 5.7/5.8 | ESTABLISHED | Epic BuildGraph talk Mar 2026; CircleCI reference pipeline exists |
| Python editor scripting + Remote Execution | In-editor Python 3; remote script exec into a live editor (the substrate of several community MCPs); AutomationDriver (Slate UI drivers) in 5.8 | Python / WebSocket | Current | ESTABLISHED | |
| Commandlets / `-run=` | Headless editor tasks | CLI | Standard | ESTABLISHED | Exact 5.8 flag syntax not re-verified |
| Fab marketplace | Asset procurement | Web only | **No official API/CLI (verified negative)** | gap | Community: jwindgassen/ue-asset-cli (PyPI) |
| "Epic Developer Assistant" | In-editor AI assistant (5.7 era) | Editor | single-sourced details | thin | |

**First-party generative assets: none.** UE 5.7/5.8 shipped no Epic generative-asset tooling; the gap is filled by PCG + third-party plugins (below).

## 3. Community MCP bridges (FOSS)

| Tool | What it does | Stars / last push | Recency | Notes |
|---|---|---|---|---|
| chongdashu/unreal-mcp | C++ TCP plugin (port 55557) + Python FastMCP sidecar; actors, Blueprints + node-graph editing, viewport control | 2,092★; pushed Apr 22, 2025 — **dormant >1 yr** | ESTABLISHED, DORMANT | MIT badge vs API "no license" — commercial-use hazard. Seed name "ChongZhiIT" = garble of this |
| kvick-games/UnrealMCP | UE 5.5+ editor MCP; "90+ tools" (Blueprints/assets/input/UMG) | 613★; API push Jun 22, 2025 — **dormant**; another sweep called it active-in-production — verify before pinning | ESTABLISHED | Relevant for pre-5.8 engines; needs C++ toolchain |
| IvanMurzak/Unreal-MCP | "AI Game Developer" — C++ plugin + .NET bridge + unreal-cli; Apache-2.0; Fab-listed; ai-game.dev or local | 45★; pushed Oct 10, 2026 — very active, young | NEW | Cross-engine sibling of the Unity/Godot repos |
| runreal/unreal-mcp | MCP over **Python Remote Execution** — no project plugin needed | 115★; pushed Jun 6, 2025 — dormant | ESTABLISHED | Suits locked-down projects |
| erhansiraci/ue-mcp | TypeScript/npm MCP on the Remote Control API | 22★; updated Dec 26, 2025 | NEW | |
| UAIP (Naotsun19B) | Plugin exposing Editor + **Runtime** as structured API — agents "drive, observe, execute, verify" (screenshots/verification) | forum demo Jun 17, 2026; Fab Jun 22, 2026; community "190+ bridges" for Toolset | NEW | Runtime observation that pure editor MCP lacks |
| AgenticLink | "Professional-grade" bidirectional agent↔editor bridge, JSON CLI commands | announced Feb 23, 2026 | NEW (unverified) | |
| flopperam, ChiR24, mariuz, alexkissijr, "88-tool" community server | Various bridges | search-level only | — | Expect consolidation post-official-MCP; check abandonment before adopting |
| Dead seeds: "loigen/UnrealMCP", "getAsterisk/unreal-mcp", "ChongZhiIT", "Electron Toolset", "Code Canvas" | — | GitHub 404 / zero evidence | **do not cite** | |

## 4. Scripting / tooling ecosystems

| Tool | Type | What it does | Status |
|---|---|---|---|
| Hazelight UnrealEngine-Angelscript | FOSS (MIT) | Gameplay **and editor** code in AngelScript (production use at Hazelight); VS Code language server + Rider port | ESTABLISHED, maintained; needs UE source build |
| Blueprint Assist | COMMERCIAL (Fab) | Keyboard-driven Blueprint editing | ESTABLISHED; no 2026-dated release verified |
| Blueprints (Editor Utility Widgets/Libraries) | OFFICIAL | The editor-automation backbone | ESTABLISHED; UE6 may evolve internals (roadmap-level) |
| Verse | OFFICIAL | UEFN-scoped today; agent-targetable via UEFN MCP (Aug 2026); "mainline Verse in UE" = chatter | watch |

## 5. Commercial AI / genAI-asset layer

| Tool | What it does | Status |
|---|---|---|
| **Sentry Unreal SDK** | Crash/error telemetry; v1.24.0 (Sep 29, 2026) adds an **editor AI toolset with Unreal MCP integration**; prebuilt for UE 4.27–5.8; 6 releases in Sep 2026 alone | UPDATED (very active) |
| Inworld | Runtime AI NPCs — **Runtime SDK** unifying model providers behind one API key (announced Oct 29, 2025; Fab Oct 31) | NEW |
| Convai | Conversational AI NPCs w/ perception + actions | UPDATED — 3.6.9 line (Jan 2026, UE 5.7 support), docs Jun 2026 |
| NVIDIA ACE → NVIGI | GenAI avatar stack (Audio2Face → MetaHuman blendshapes); ACE plugin 2.5 (legacy path); direction is NVIGI UE plugin (5.6) | UPDATED/plateauing |
| Rapid Assets (rapidassets.ai) | Free UE (+Godot) plugin: prompt → Texture2D + Static Mesh import | NEW-ish; verify |
| GenAI Model Generator | In-editor AI 3D via Meshy/Hunyuan/Nano backends (UE 5.1–5.7) | NEW; verify license/backends |
| Meshy | Free "Meshy for Unreal" plugin + **MCP integrations** (agents generate 3D straight into UE/Omniverse) | UPDATED |
| TextureFast / Neural4D / Layer AI / TotalAI | Textures/PBR/2D gen with UE paths | ESTABLISHED–NEW (mostly verify-first) |
| Scenario | **No native UE plugin found** (browser + API only — corrects seed assumptions) | flagged |
| Incredibuild | Distributed builds | ESTABLISHED (not re-verified this run) |

## 6. Headless / CLI / agent-control quick reference (verified items)

```text
Official Unreal MCP (UE 5.8, Experimental)
  docs: dev.epicgames.com/documentation/unreal-engine/unreal-mcp-in-unreal-editor
  clients: Claude Code, Codex CLI, Cursor (Epic walkthrough 2026-07-27)
  PCG+LLM workflow: "Working with PCG and LLMs Using Unreal MCP"
  (port/endpoint specifics: consult Epic page — not extracted this run)

UEFN Unreal MCP (Beta, 2026-08-20): enable Beta Access in editor settings →
  generate agent config → Verse write/compile, devices, UMG, play run/stop/debug

Remote Control API: HTTP+WS on port 30010 (default)
  GET http://localhost:30010/remote/info   ; Presets expose props/functions as endpoints

Build/CI:
  Engine\Build\BatchFiles\RunUAT.bat BuildCookRun -project=<proj> -platform=Win64 \
    -build -cook -package
  BuildGraph XML for fan-out; Horde for orchestration + device farms
  Tests: Gauntlet via RunUAT (-run=-test=<Filter>); self-hosted GH runners the norm

Python: import unreal (editor / UnrealEditor-Cmd); Python Remote Execution
  (websocket) for no-deploy remote control; AutomationDriver for Slate UI driving
```

## 7. Key sources

1. https://www.unrealengine.com/news/unreal-engine-5-8-is-now-available (Jun 23, 2026; GA week verified via IGN/press Jun 17)
2. https://www.unrealengine.com/News — "The road to Unreal Engine 6" (Jun 22, 2026; EA end-2027) — deep-verified this run
3. https://dev.epicgames.com/documentation/unreal-engine/unreal-mcp-in-unreal-editor (+ PCG-and-LLMs page) — docs updated Aug 17, 2026
4. https://www.fortnite.com/news/unreal-mcp-is-now-available-in-uefn (Aug 20, 2026)
5. Epic dev community: "Using the Unreal Engine 5 MCP Server with Claude Code" (Jul 27, 2026)
6. https://dev.epicgames.com/documentation/en-us/unreal-engine/remote-control-api-quick-start
7. https://dev.epicgames.com/documentation/en-us/unreal-engine/horde (5.8-era docs)
8. https://github.com/kvick-games/UnrealMCP ; github.com/chongdashu/unreal-mcp ; github.com/IvanMurzak/Unreal-MCP
9. https://github.com/Conv-AI/Convai-UnrealEngine-SDK/releases (3.6.9)
10. https://github.com/getsentry/sentry-unreal/releases (1.24.0, MCP integration)
11. https://www.unrealengine.com/news/unreal-engine-5-7-is-now-available (Nov 12, 2025)

**Flagged/unverified:** official MCP technical specifics (port/tools); Epic Developer Assistant details; 5.8.2 date (secondary); Scenario UE-plugin absence (search-negative); Blueprint Assist 2026 activity; Inworld versions; MetaHuman beyond 5.7; UE6's effect on Blueprints (directional only).


---

<!-- ====================================================================== -->
<!-- FILE: 05-phaser.md -->
<!-- ====================================================================== -->

# Phaser 3/4 — Automation, Tooling & Agent Control

**Current stable:** Phaser 4.2.1 "Giedi" (Jul 9, 2026) · **3.x final:** 3.90.0 "Tsugumi" (May 23, 2025, feature-frozen) · Phaser has the **most aggressive official agentic play of all six stacks** — but it is cloud/credits-based, not local-editor control.

## 1. Framework timeline in window

| Version | Date | Type | Automation-relevant content |
|---|---|---|---|
| v3.88.0–v3.88.2 | Feb 2025 | 3.x patches | 3.88.2 reverted a Scale Manager break |
| v4.0.0 RC5–RC7 | Aug 22, 2025 / Dec 23, 2025 / Mar 25, 2026 | RC | RC6/RC7 in-window milestones |
| **v4.0.0 "Caladan"** | **Apr 10, 2026** | Major GA | Ground-up WebGL renderer rebuild (managed state, context restoration); unified Filter system (replaces v3 FX+Masks); SpriteGPULayer (claimed 1M sprites/draw call); TilemapGPULayer (4096² tiles); 6-mode tint; Gradient/Noise/Stamp game objects; `sprite.setLighting(true)`; GLSL #pragma. **Ships 28 first-party AI-agent skill files in-repo (`skills/`) + a v3→v4 migration skill** |
| v4.1.0 "Salusa" | Apr 30, 2026 | Minor | Layer as true GameObject; ESM fixes |
| v4.2.0 "Giedi" | Jun 19, 2026 | Minor | Cone Lights, Mesh2D, Stencil objects |
| v4.2.1 | Jul 9, 2026 | Patch — CURRENT | Stencil/ScaleManager/tween fixes |

CORRECTION embedded in the record: "Phaser 4 released Aug 2025" is wrong (that was RC5); final 4.0.0 = Apr 10, 2026. The "TypeScript rewrite" claim is unconfirmed by the 4.0.0 announcement. No post-4.2.1 roadmap captured.

## 2. The official agentic stack (OFFICIAL/COMMERCIAL — all NEW-in-window)

| Tool | What it does | Surfaces | Date | Price | Notes |
|---|---|---|---|---|---|
| **Phaser Game Agent** | "Describe a game in one sentence" → complete custom game (code + art + music/sound), built on **Phaser AE** — every game gets a custom engine build, "no templates." 3 modes: 2D Arcade, Vector (destructible polygon terrain), 3D (meshes/lights/procedural islands; renderer upgraded Jul 7, 2026) | Hosted cloud sandbox; public play URLs; export Web/Win/mac/Linux | Beta Jun 2026 | Credits; **~500 credits for a fully featured game**; build time from $0.01/min | Models offered: Opus 5.5, Grok 4.7, Muse Spark 1.3 (Sep 22, 2026); built with Claude Managed Agents + Superserve |
| **Phaser Agent MCP** | Drives the Game Agent **from your own coding tool** — agent designs/codes/tests/ships, publishes preview | MCP: `npx @phaserjs/game-agent` installer (Node 20+) detects installed CLIs, browser sign-in, writes MCP configs; Claude Code speaks remote MCP directly, other CLIs use bundled `bridge.mjs` stdio bridge (repo phaserjs/phaser-game-agent, MIT) | Jul 8, 2026 | Setup free; credits for builds | Clients: Claude Code/Desktop, Cursor, VS Code, Copilot, Codex, Gemini CLI, Google Antigravity, Qoder, Windsurf |
| **Phaser AE ("Arcade Engine")** | Separate engine purpose-built for LLMs; powers Game Agent | Via Game Agent only (not OSS, no standalone CLI) | v2 → v2.8 by Sep 22, 2026 | via credits | Official "Phaser 4 vs Phaser AE" clarification (Jul 2026) |
| **Phaser Editor v5** | Visual scene editor w/ Phaser-rendered live preview, Inspector, prefab system, physics bodies, Animations editor, Spine 4.2; **built-in AI Chat (Gemini/Claude/OpenAI-compat/OpenRouter) + built-in MCP server with 40+ tools**; publishes pure Phaser code; full Phaser 4 support | Desktop + MCP (`@phaserjs/editor-mcp-server` on npm) | v5 May 1, 2026 (beta from Feb 2026); npm pkg v1.0.6 (soft-verified — npm 403) | $12/mo (1/3/6-mo self-cancelling) | Author: Arian Fornaris (Phaser Studio since Jan 2024). phasereditor2d.com homepage is STALE (still v3.67/2024) — don't use for status; docs.phaser.io says v4 line (last: 4.11.0, Mar 17, 2025) is no longer maintained |
| 28 in-repo agent skills | Framework knowledge for any agent harness (Animations, Cameras, Audio, Input, Physics… + migration skill) | files in phaserjs/phaser `skills/` | with 4.0.0 | MIT | Indexed by skills-hub.ai |
| Cursor starter template | phaserjs/editor-starter-template-cursor-javascript, preconfigured with Editor MCP | template | NEW (date uncaptured) | free | |
| Phaser Sandbox | Browser editor, Phaser 4-ready | web | refreshed Sep 22, 2026 | free | No automation surface |

## 3. Core toolchain (official + standard)

| Tool | What it does | Latest | Recency | Notes |
|---|---|---|---|---|
| Phaser Box2D | Physics plugin on Box2D v3 | v1.1.0, Jan 1, 2025 | NEW (nothing newer found — verify before pinning) | MIT, free; TS/npm import friction reported |
| create-phaser-game (phaserjs/create-game) | Official scaffold CLI | `npm create phaser-game` (exact npm name/version UNVERIFIED — run `npm view` before scripting) | ESTABLISHED | |
| Official templates | template-vite-ts, template-webpack-ts, template-solid, Vue 3, editor starters | — | ESTABLISHED | |
| Phaser Launcher | Beginners' all-in-one desktop app | no date/version found | flagged | No CLI/API |
| **Tiled** | Tilemap editor; Phaser loads Tiled JSON natively | 1.12.2 (May 27, 2026; 1.12 Mar 13, 2026: rewritten Properties, oblique orientation) | UPDATED | Long-standing CLI export |
| **TexturePacker** (CodeAndWeb) | Atlas packing, 40+ engine exporters incl. Phaser JSON; **CLI + watch-folder auto-repack for CI** | v8.2.0 (AUR-sourced — flag) | UPDATED (ecosystem) | Perpetual license; Free Sprite Sheet Packer online for zero-budget |
| **Aseprite** | Pixel-art with `aseprite -b` batch CLI + Lua scripting | 1.3.18 (1.3.x — seed's "3.x" was wrong) | UPDATED | |
| ElevenLabs SFX API | REST SFX generation (V2: 0.5–22 s, looping) + elevenlabs-mcp for agents | PAYG since May 2026 | UPDATED | |
| Sprite Fusion | Tilemap/level designer exporting Phaser JSON → now also pixel-art sprite gen (phaser.io news Aug 31, 2026) | — | UPDATED | |
| ShoeBox | — | DEAD (Adobe AIR; site down; last v3.6) | — | Exclude from pipelines; sheet-slicing tools have "no obvious replacement" |
| jsfxr/jfxr/bfxr | FOSS browser SFX | no CLI found (confirmed gap) | ESTABLISHED | Wrap the library yourself for CI |

## 4. Testing & CI (the honest gaps)

- **No Phaser-specific test framework exists** (confirmed). Pattern: Vitest/Jest + **MockScene** (test logic without booting Phaser — codified in a Sep 2026 agent skill); E2E = Playwright headless (default) with `webServer: vite preview`, canvas assertions via `page.evaluate` game-state hooks or screenshots.
- CI shape: checkout → `vitest run` → build → serve → `npx playwright test` → artifacts. **No official Phaser CI template repo** (gap).
- Deploy: **butler** (`butler push ./dist html5`; itchio/butler v15.32.0 Oct 6, 2026; headless `butler launch` since v15.31.0) via community actions (manleydev/yeslayla wrappers, freshness flagged); Steam route = Game Agent export tutorial (Jul 7, 2026) or classic Electron/NW.js.

## 5. MCP gap check (explicit)

Official surfaces exist (editor MCP + Agent MCP). **Verified absences as of 2026-10-10:** no community/runtime Phaser MCP (scene-graph inspection, live patching of a running game); no MCP for the build toolchain; no node-graph visual-scripting plugin (Editor Script Nodes are the only mature visual-behavior system — property-wired, not wire-graphs; Phaser 4's "node-based renderer" is internal architecture, not a user editor). Research gap: no 2025–26 academic paper on LLM-generated Phaser games (adjacent: ProjectEval arXiv Mar 2025; ProxyWar HF Feb 2026).

## 6. Quick reference (agent-controlled Phaser workflow)

```bash
npm create phaser-game          # scaffold (verify exact package name first)
npm install phaser              # 4.2.1
# point your coding agent at phaserjs/phaser 'skills/' (28 subsystem skills)
# full game generation from your own agent:
#   phaser.io/agent/mcp → generate token → npx @phaserjs/game-agent
#   (installs CLI, detects editors, writes MCP configs) → build prompt → playUrl
#   exports: Web/Win/macOS/Linux ; ~500 credits per full game; from $0.01/min
# editor-in-the-loop: Phaser Editor v5 ($12/mo) built-in MCP (@phaserjs/editor-mcp-server)
# atlas pipeline: TexturePacker CLI + Phaser exporters + watch-folder in CI
# tests: vitest + MockScene ; playwright headless E2E (webServer: vite preview)
# deploy: butler push ./dist user/game:html5
```

## 7. Key sources

1. https://phaser.io/download/archive — version codenames + exact dates
2. https://github.com/phaserjs/phaser/releases + discussion #7274 (4.0.0, Apr 10, 2026, 28 skills)
3. https://phaser.io/news/2026/07/phaser-game-agent-mcp-setup (Jul 8, 2026)
4. https://phaser.io/agent/about ; https://phaser.io/agent/mcp (+ claude-code page)
5. https://phaser.io/editor (Editor v5) ; https://www.npmjs.com/package/@phaserjs/editor-mcp-server
6. https://github.com/phaserjs/phaser-game-agent (bridge.mjs)
7. https://www.mapeditor.org (Tiled 1.12) ; https://www.codeandweb.com/texturepacker/documentation
8. https://itch.io/docs/butler
9. phaser.io/news index (Game Agent 3D Jul 7; Opus 5.5/Grok 4.7 Sep 22, 2026; LSDE Sep 30)
10. https://github.com/phaserjs/phaser-box2d

**Flagged/unverified:** `@phaserjs/editor-mcp-server` version/date (npm 403); "40+ tools" is the editor page's own claim; create-game npm specifics; TexturePacker 8.2.0 (AUR-sourced); Phaser Launcher dates; butler-action wrapper freshness; PixelLab/Scenario/Layer.ai pricing; RC6/RC7 year-inference; "PhaserNation" = fictitious (no evidence anywhere).


---

<!-- ====================================================================== -->
<!-- FILE: 06-godot.md -->
<!-- ====================================================================== -->

# Godot — Automation, Tooling & Agent Control

**Current stable:** Godot 4.7.2 (Aug 18, 2026) · **4.8 in development** (feature freeze at dev7, Sep 29, 2026) · **3.x still maintained** (3.6.3, Aug 22, 2026) · **No official MCP** — but the best headless fundamentals of all six stacks, plus the most diverse community MCP ecosystem and an explicit AI-contribution policy.

## 1. Release timeline in window (dates from godotengine.org archive)

| Version | Date | Type | Automation-relevant content |
|---|---|---|---|
| 4.5.1 | Oct 15, 2025 | Maintenance | |
| 4.5.2 | Mar 19, 2026 | Maintenance | |
| **4.6** | **Jan 26, 2026** | Feature | **LibGodot** (embed the engine in a host app and own startup/loop — the deepest process-level control of the year); **JSON GDExtension interface** (machine-readable interop); Tracy/Perfetto/Instruments profilers; LSP docstrings BBCode→Markdown; scriptable custom editor shortcuts; ObjectDB snapshots/diffing; **delta-encoded Patch PCKs** (incremental content updates); Jolt default (new 3D); D3D12 default (Win) |
| 4.6.1–4.6.3 | Feb 16 / Apr 1 / May 20, 2026 | Maintenance | |
| **4.7 "Lights, Camera, Action!"** | **Jun 18, 2026** | Feature | **In-editor Asset Store** replacing Asset Library (background-threaded — editor no longer blocks); per-platform export-template downloader; background editor threading; MeshLibrary editor; 2D Scene Paint Mode; GDScript Java interface overrides |
| 4.7.1 / 4.7.2 | Jul 14 / Aug 18, 2026 | Maintenance | 4.7.2 = current |
| 3.6.3 | Aug 22, 2026 | Maintenance (3.x) | Android/iOS requirement-driven |
| 4.8 dev1–dev7 | Jul 6 → Sep 29, 2026 | Pre-release | Feature freeze at dev7 (Sep 29, 2026); stable not yet dated |
| Asset Store platform | May 22, 2026 | Platform | Paid asset sales planned |
| GABE 1.0 | Jun 2, 2026 | Tooling | Godot Android Build Environment — on-device Gradle builds |

**Governance (deep-verified verbatim):** Contribution Policy amendment **Jun 30, 2026** — "No autonomous AI agent use or vibe coding"; "No use of AI to generate substantial pieces of code… We require all code to be human authored"; AI-assisted menial use (completion/regex/find-replace) allowed with disclosure in the PR; new contributors (≤3 merged PRs) need maintainer permission for features/refactors. This governs **engine-source contributions, not game projects or tooling** — Godot remains fully usable for AI-driven game dev; the policy signals the project's stance.

## 2. Official automation surfaces (OFFICIAL)

| Surface | What it does | Status | Notes |
|---|---|---|---|
| CLI / headless runtime | Full flag set (see quick-ref): `--headless`, `-e`, `--export-release/debug/pack`, `-s/--script`, `--check-only`, `--doctool`, `--remote-debug` | ESTABLISHED | **Docs warn unrecognized flags are silently ignored** — verify flag spelling per version; `--export-pack` implies `--import` |
| GDScript LSP (built-in) | Language server embedded in the editor; configurable port (long-standing default 6005) | ESTABLISHED | 4.6 made docstrings Markdown; spawns headless via vscode plugin's `godotTools.lsp.headless` |
| Remote debug protocol | `--remote-debug tcp://127.0.0.1:6007` — the wire community MCPs reuse to observe running games | ESTABLISHED | |
| Editor scripting | `EditorScript` / `-e --quit`; all addon MCPs build on `EditorInterface` | ESTABLISHED | |
| **LibGodot** (4.6) | Embed engine in another app, own the main loop | NEW | Full process-level control — unique among the six engines |
| JSON GDExtension interface (4.6) | Machine-readable extension interface | NEW | Codegen/interop agents |
| Patch PCKs (4.6) | Delta-encoded incremental content updates | NEW | Live-ops pipelines |

## 3. MCP / LLM-agent bridges

| Tool | Type | What it does | Stats | Recency |
|---|---|---|---|---|
| **Coding-Solo/godot-mcp** | FOSS MIT | ~20 tools: launch editor, run/stop project + capture debug output, scene parse/modify, GDScript read/write; external Node stdio architecture, no editor addon; npm `@coding-solo/godot-mcp` | 6,001★; pushed Apr 16, 2026 — slowing | UPDATED |
| **satelliteoflove/godot-mcp** | FOSS MIT | The most sophisticated agent-verification design found: MCP client ↔ Node stdio ↔ editor addon over WebSocket 6550 ↔ running game via debug protocol; **21 tools / 86 actions incl. input injection (`godot_input`), runtime state, game time (deterministic playtesting), profiler, mesh validation**; read/write tool split + `--read-only` flag; Godot 4.5+, Node 20+, WSL2 auto-detect | 173★, 311 commits | NEW |
| **ee0pdt/Godot-MCP** | FOSS MIT | Editor addon + Node stdio bridge; ~20 tools + `godot://` resources; run/stop project | 618★ | UPDATED |
| **bradypp/godot-mcp** | FOSS MIT | Fork of Coding-Solo; single bundled `godot_operations.gd`; 16 tools incl. Godot 4.4+ UID management, mesh-library export; `READ_ONLY_MODE` env for CI/review; Godot 3.5+/4.x | 90★ | NEW |
| **IvanMurzak/Godot-MCP** | FOSS Apache-2.0 | C# AI tools for the editor; ai-game.dev cloud link; shares core with the Unity/Unreal siblings | 279★; pushed Oct 10, 2026 | NEW (fast-rising) |
| **GDAI MCP** | COMMERCIAL $19 one-time (lifetime updates) | MCP server **inside** Godot as a plugin: scene/node/resource/script creation, debugger + parse-error reading, res:// search, auto screenshots, **input simulation**; Claude Desktop/Code, Cursor, Windsurf, Copilot, Zed | gdaimcp.com (comparison page Mar 10, 2026); source repo docs-only, all-rights-reserved | NEW |
| Erodenn "Godot MCP Runtime" | FOSS | Agents **play the running game** (runtime, not editor) — TypeScript, 572 weekly npm downloads, updated Oct 8, 2026 | 39★ | NEW |
| sc-lacanlale "~149-tool" fork; TomasLucasUTN bridge (claims 213 tools) | FOSS | search-level only | unverified | flagged |
| godot-mcp-bridge, Dokujaa, better-godot-mcp (17 composite tools), mcp_godot_rag | FOSS | listed-only | — | flagged |

**Three canonical architectures** (all verified live this year): (1) external stdio MCP spawning the CLI (Coding-Solo, bradypp); (2) editor-addon MCP + WebSocket bridge into `EditorInterface` + debug protocol (GDAI, ee0pdt, satelliteoflove — richest control incl. playtest verification); (3) LibGodot embedding (4.6+) for full process-level control.

## 4. Testing, linting, IDE

| Tool | What it does | Latest | Notes |
|---|---|---|---|
| **gdUnit4** | Unit/integration testing, headless CLI runner + standalone .NET runner for C# | v6.2.2 (Oct 7, 2026); ~7 releases in window; CI tracks Godot 4.8-dev7 | Very active; org migration to "godot-gdunit-labs" signaled (docs domain + issue templates) |
| GUT | GDScript testing | 9.7.1 (~Jul 2026, year inferred; badge drift 9.6.1 noted) | 2,750★; license field null on API (historically MIT — re-verify) |
| gdtoolkit (gdparse/gdlint/gdformat/gdradon) | Lint/format/metrics; official GH Action + pre-commit | PyPI 4.5.0 (Oct 9, 2025 — one day pre-window); repo stalled since | Version numbers track Godot syntax; mild maintenance risk |
| **godot-vscode-plugin** | v2.0.0 major ("ALL FEATURES FULLY SUPPORT GODOT 4"): rewritten debugger (port 6007), breakpoints/stepping/watch, scene-tree/inspector, built-in GDScript formatter, **`godotTools.lsp.headless` spawns a windowless editor as pure LSP server** — the headless AI-coding enabler | v2.0.0 (in-window) | godotengine org |

## 5. Visual scripting / node-based logic (official VisualScript removed in 4.0, never returned)

| Tool | What it does | Stats | Recency |
|---|---|---|---|
| **Orchestrator** (Crater Crash Studios) | Visual scripting GDExtension — the de-facto successor; docs.cratercrash.space; Godot 4.9 support planned | 1,630★; pushed Oct 7, 2026 | UPDATED — **seed correction: still Apache-2.0 and free; the "renamed Crater Space / went paid" seed is garbled** |
| **LimboAI** | Behavior trees + HFSM + blackboard, editor + visual debugger; 1.8.x line (GDExt for 4.6+, module build for 4.7) | ~3.0k★ | UPDATED (very active) |
| **Beehave** (bitbrain) | Pure-GDScript behavior trees; 2.10+ for Godot 4.5+; runtime debug view | 3.3k★ | UPDATED |

## 6. CI/CD, export, distribution

| Tool | What it does | Latest | Notes |
|---|---|---|---|
| **abarichello/godot-ci** | Docker image + canonical GitLab/GH Pages/Itch templates; Android keystore; iOS unsupported | 1,141★; pushed Oct 5, 2026 | UPDATED |
| **chickensoft-games/setup-godot** | GH Action: install + cache Godot, optional export templates, .NET | v2.4.3 (Oct 1, 2026; arm64 added v2.3.4; macOS "Killed: 9" fix v2.3.0) | UPDATED — also ships GodotEnv |
| **firebelley/godot-export** | GH Action: exports, .pck, macOS codesigning, Wine Windows exports, custom builds | v8.0.0 (May 28, 2026) | UPDATED |
| ActionCommons/build-godot | Build Godot from source via SCons | single-sourced | flagged |
| dulvui/godot-4-html-export | — | **ARCHIVED Jun 2025** | dead |
| **GodotSteam** | Steamworks GDExtension (4.23; Steamworks SDK 1.65); Server edition 4.11 (Godot 4.7.2) = headless dedicated-server path | **GitHub repo ARCHIVED Oct 5, 2026 → moved to Codeberg** — update pins | UPDATED |
| butler / steamcmd | Distribution CLIs | butler v15.32.0 (Oct 6, 2026) | see 10-cross-engine |

## 7. Level-design bridge

- **TrenchBroom** v2026.2 (Aug 21, 2026) — FOSS .map level editor, steady 2025–26 cadence (2025.4 → 2026.1 → 2026.2). UPDATED.
- **Qodot** (the .map→Godot importer): all known repo URLs 404 — **dead/unverifiable**. TrenchBroom→Godot needs an alternative bridge or manual glTF export.

## 8. Headless / CLI / agent-control quick reference (verified from stable docs)

```bash
godot --headless                                  # no display server (CI/servers)
godot -e --headless --quit                        # editor automation run
godot --export-release "Windows Desktop" out.exe  # headless export (templates required)
godot --export-pack <preset> <path>               # implies --import
godot -s script.gd --check-only                   # syntax-check gate (script must inherit SceneTree/MainLoop)
godot --doctool <path>                            # dump engine XML docs (machine-readable API surface)
godot --remote-debug tcp://127.0.0.1:6007         # attach to debugger wire
godot --log-file log.txt -d -v --quit-after 60
# Caveat: unrecognized flags are SILENTLY IGNORED — don't infer success from exit code alone.
# Ports: GDScript LSP ~6005 (default not re-verified); debug wire 6007; satelliteoflove bridge 6550 (its own).
```

Minimal pipeline: `chickensoft-games/setup-godot@v2.4.3` (or barichello/godot-ci image) → gdUnit4 headless runner (+ .NET runner for C#) → `godot --headless --export-release` → `butler push`. Known traps: Vulkan errors when editor runs on GPU-less CI (use `--headless`), no signed macOS exports from Linux CI (need a macOS runner).

## 9. Key sources

1. https://godotengine.org/download/archive/ — dated version archive
2. https://godotengine.org/releases/4.6 ; /releases/4.7 — LibGodot / Asset Store features
3. https://godotengine.org/article/contribution-policy-2026 — Jun 30, 2026 AI policy (deep-verified this run with verbatim quotes)
4. https://docs.godotengine.org/en/stable/tutorials/editor/command_line_tutorial.html
5. https://github.com/Coding-Solo/godot-mcp ; github.com/satelliteoflove/godot-mcp ; github.com/ee0pdt/Godot-MCP ; github.com/bradypp/godot-mcp
6. https://gdaimcp.com — commercial Godot MCP
7. https://github.com/MikeSchulze/gdUnit4 (+releases) — v6.2.2
8. https://github.com/CraterCrash/godot-orchestrator ; github.com/limbonaut/limboai ; github.com/bitbrain/beehave
9. https://github.com/chickensoft-games/setup-godot ; github.com/firebelley/godot-export ; github.com/abarichello/godot-ci
10. https://github.com/godotengine/godot-vscode-plugin (v2.0.0 headless LSP)
11. https://github.com/GodotSteam/GodotSteam → Codeberg migration (Oct 5, 2026)
12. https://github.com/TrenchBroom/TrenchBroom/releases

**Flagged/unverified:** sc-lacanlale fork identity; Coding-Solo npm date; LimboAI 1.8.x exact date (ignore stale "1.5.0 Aug 2026" claim); Beehave 2.9.2 date (AssetLib-sourced); GUT license field + release year; LSP default port value; GodotSteam release dates; Qodot moved-vs-dead; W4 Games $18M Tencent round (single secondary source); gdUnit4 org migration (signaled, unannounced).


---

<!-- ====================================================================== -->
<!-- FILE: 07-construct.md -->
<!-- ====================================================================== -->

# Construct 3 — Automation, Tooling & Agent Control

**Latest verified stable:** r476 (+patches r476.2–.4, ~Mar 11, 2026) · **Current LTS:** r449.x (promoted ~Oct 15, 2025; supported to end of 2026; r449.4 maintenance Apr 1, 2026) · **Construct 4 does not exist** (debunked — 2021 wishlist thread only) · Construct Animate rides the same release train (Animate r476.x, Mar 2026).

**The headline is negative:** Construct 3 is the **least automatable of the six stacks** — no official CLI/headless export, no editor scripting API, no official MCP, no AI features (all four verified by absence + independently corroborated by a competitor page and a second research sweep). Automation happens at two layers only: **project files** (`.c3proj` folder format is plain JSON) and the **running game** (Chrome DevTools Protocol).

*Access caveat: construct.net served frozen CDN caches (releases beyond ~Mar 2026 unenumerable) and 403'd/500'd fetchers; some facts rest on cached snapshots + SERP snippets and are flagged.*

## 1. Release timeline in window (verified anchors)

| Version | Date | Notes |
|---|---|---|
| r449.3 → LTS | ~Oct 15, 2025 | Replaces r397 LTS; supported to end-2026; **last train that runs SDK v1 addons** |
| r465/r466 STABLE | Dec 9 / Dec 16, 2025 | Physics collision filtering, new blend modes; r466.2 Jan 8, 2026 |
| r467–r472 betas | Jan–Feb 2026 | r467: WebView2 + iOS export updates; r469: **3D model plugin**; r471/472: 3D positions/bounding boxes |
| **r476 STABLE + Animate r476** | ~Mar 11, 2026 (+patches to r476.4) | Promotes 3D model plugin + dynamic sampling to stable |
| r449.4 | Apr 1, 2026 | LTS maintenance |
| r477+ (May–Oct 2026) | — | **Exist but unenumerable** (cache-blocked); a parallel sweep's search snippet saw stable r495.2 / beta r504 as current — consistent with the quarterly-stable cadence, dates unverified |

2025 flagship (per Dec 19, 2025 year-in-review, single-sourced): online services — authentication, leaderboards, cloud save → shipped as the Construct Game Services plugin.

## 2. Official surfaces (OFFICIAL) — and their limits

| Surface | What it does | Status | Automation limit |
|---|---|---|---|
| Editor (web app) | All editing/building happens here (editor.construct.net) | r476+ | **No scripting API, no automation surface — GUI-only dialogs** |
| Project formats | `.c3p` (zip) or `.c3proj` (folder of JSON/text) — the machine-readable layer | ESTABLISHED | Folder format is what community MCPs edit; `.c3p` must be extracted first |
| Runtime JavaScript scripting | JS/TS in event sheets + script files, TS support, import maps, full runtime API (IRuntime, IWorldInstance…) | ESTABLISHED | **Scripts the game runtime, never the editor** |
| Addon SDK v2 | Plugins/behaviors/effects/themes + custom importers; JSON schemas + VS Code autocomplete; optional TS | ESTABLISHED, actively evolved; **v1 retired at r450+** (v1 addons only run on r449 LTS) | SDK repo: no license file displayed, no contributions accepted |
| Export manager | HTML5, NW.js desktop, Windows WebView2, Cordova mobile, third-party console ports | ESTABLISHED | **All export goes through the editor GUI + Scirra's build service — no offline/CLI path (authoritative negative, double-sourced)** |
| Remote Preview | Share a preview URL to any device; the sanctioned external-test hook | ESTABLISHED (since 2017) | Pair with Playwright/CDP for real-runtime testing without export |
| Game Services plugin | Auth/leaderboards/cloud save | NEW-in-window | |

Pricing (SERP snapshot of construct.net/en/buy — single-sourced, page 500s): Free; Quarterly $32.99/3mo; Pro $99.99/yr; Unlimited $199.99/yr; **Team $399.99/yr (5 seats)**. A third-party review quotes different numbers ($129.99/$468.99) — conflict flagged; treat all as unconfirmed until the buy page is readable.

## 3. Community automation layer (the real story)

| Tool | Type | What it does | Stats | Recency |
|---|---|---|---|---|
| **construct3-mcp** (liauw-media) | FOSS MIT | The flagship LLM bridge: **~83 tools** over the folder-format project — resource query/analysis/mutation, dependency graphs, orphan detection, performance audit, validate_project, 7 workflow prompts + **19 runtime tools over CDP** (connect_to_game, call_bridge via `globalThis.__c3bridge`, simulate_input, screenshot_game; Node 22+ for CDP). Safety discipline: SID/UID collision-checked generation, `.bak` backups, atomic writes + read-back verification, editor-faithful line endings/BOM/case | v1.10.0; 18★; page evidence Sep 25, 2026 | NEW |
| BeatsByZann fork | FOSS MIT | Expanded to 169 tools; CDP input simulation + screenshots of a served build | working branch only | NEW (fork drift risk) |
| ultimate-construct3-mcp (nahuelgallo) | FOSS MIT | 44 tools; differentiator = **offline Construct docs search + ACE reference** baked into the server | 1★ | NEW (negligible adoption) |
| c3-skill (ToadLobe) | FOSS? | Agent SKILL (not MCP) for the C3 JS scripting interface | **license unstated — legally unusable until clarified** | NEW |
| gamecodex "construct-arch-rules" | FOSS doc | AI-coding architecture rules for C3 inside the gamecodex npm package — agent system-prompt seed | v2.0.1 | NEW |
| construct-addon-wizard (ConstructFund) | FOSS MIT | VS Code extension for SDK v2 addon dev; scaffold updated Sep 19, 2026 | 2★ — tiny, bus factor 1 | UPDATED |
| c3addon (ConstructFund) | FOSS MIT | Automates **publishing** .c3addon builds to construct.net | pushed Aug 27, 2026 | UPDATED |
| c3ide2 family | FOSS | Code-first addon framework (SDK v1 era) | frozen Feb 15, 2025 — superseded; seed URL `github.com/c3ide2-framework/...` is 404 (real home: ConstructFund org) | STALE |
| nagyv/c3-addon-cli | FOSS | C2/C3-early packaging CLI (2019) | abandoned | STALE |

**Verified-absent list:** no official or community CLI/headless export (one search-AI claim of a "command-line export API" contradicts all primary evidence — hallucination; do not cite); no game.ci equivalent; no packaged GitHub Action (one consultant described an unpublished GH-Actions→Steam flow); no LLM game-gen SaaS targeting Construct; no AI features in the editor (confirmed by Scirra's own notes-by-absence **and** SummerEngine's independent Sep 2026 statement).

## 4. The two automation patterns that actually work

```text
(1) PROJECT FILES — .c3proj is JSON on disk:
    construct3-mcp (~83 tools) mutates layout/event-sheet/object JSON
    with SID/UID-safe generation + backups.
    ⚠ Close/reopen the project in the editor after external edits;
    no rename refactoring; .c3p zips must be extracted first.

(2) RUNTIME via CDP — the editor/runtime are ordinary web apps:
    export HTML5 (or Remote Preview URL) → serve on 127.0.0.1 →
    Chrome/Edge --remote-debugging-port → inject globalThis.__c3bridge →
    call runtime functions, simulate input, screenshot
    (construct3-mcp's 19 runtime tools = the reference implementation)

    Editor UI itself: NO tool targets it — GUI-only.
    Addon dev: SDK v2 + construct-addon-wizard (VS Code) + c3addon (publishing).
    Assets: HTTP APIs (Retro Diffusion / Scenario / PixelLab) →
    write sprites into .c3proj via MCP mutation tools.
```

## 5. Adjacent commercial

- **SummerEngine** (competitor): Godot-4-compatible desktop engine + **its own first-party MCP server** (run/input/probe/screenshot of the native game), marketing a "Construct 3 MCP" landing page (Sep 25, 2026). It cannot import Construct projects — it's a migration pitch, but with genuinely useful competitive intel (and it independently confirms Scirra ships no MCP/AI). Pricing: engine free; Pro $20/mo (+$20 credit); $0.07/1K images; $0.01/5-s SFX.
- AI asset services that feed C3 pipelines (engine-agnostic, see 10-cross-engine): **Retro Diffusion** (HTTP API + official examples repo — best sprite/tileset fit; hosts on Scenario as RD Plus/RD Tile/RD Animation), Scenario (REST, style-locked custom models), PixelLab, Ludo.ai (sprite-sheet claims are marketing-level).

## 6. Key sources

1. https://www.construct.net/en/make-games/releases (+/stable/r476) — cached anchors to Mar 2026
2. https://github.com/Scirra/Construct-Addon-SDK — SDK v2 + v1 retirement
3. https://www.construct.net/en/make-games/manuals/construct-3/scripting — runtime scripting (cached TOC)
4. https://www.construct.net/en/make-games/manuals/construct-3/overview/testing-projects — Remote Preview
5. https://github.com/liauw-media/construct3-mcp — v1.10.0
6. https://summerengine.com/construct-3-mcp — competitor page (2026-09-25)
7. https://github.com/orgs/ConstructFund/repositories — addon tooling family
8. https://github.com/Retro-Diffusion/api-examples
9. https://www.construct.net/en/buy — pricing (SERP snapshot only)

**Flagged/unverified:** r477→current release dates (cache-blocked; r495.2/r504 seen in a search snippet); pricing conflict; c3-skill license; Retro Diffusion pricing; PixelLab/Ludo API reality; Animate standalone pricing; May–Oct 2026 release contents.

**Bottom line:** Construct 3 cannot currently reach full build→ship automation. The realistic stack for an agent is: construct3-mcp for project authoring + CDP bridge for runtime testing + manual (or Scirra-cloud) export, with CI limited to post-export packaging (Electron/NW.js, butler push, Steam via steamcmd).


---

<!-- ====================================================================== -->
<!-- FILE: 08-agent-control-landscape.md -->
<!-- ====================================================================== -->

# The LLM-Agent Control Landscape — MCP & Agent Infrastructure for Game Development

The 2025→2026 story in one sentence: **agent control of game editors standardized on MCP (Model Context Protocol), every major engine except Construct now has an official or Foundation-shipped entry point, and Claude Code is the de-facto first-class client across the entire ecosystem.**

## 1. The MCP spec itself (context)

- Current revision **2026-07-28** (modelcontextprotocol.io/specification/latest; schema in github.com/modelcontextprotocol/specification). Anthropic-origin open standard — no single vendor owns it (Unity's own blog describes it as "an open standard created by Anthropic").
- New vs 2025: **Elicitation** (server-initiated user input); opt-in extensions — **Tasks** (async long-running ops: polling, mid-flight input, durable handles — directly relevant to engine builds/cooks), **Skills over MCP** working group, **MCP Apps** (inline interactive UI).
- Security hardened: tool annotations treated as **untrusted**; hosts must obtain explicit user consent before invoking tools — protocol-level acknowledgment that game-editor MCP tools are arbitrary code execution.

## 2. Official first-party surfaces (the big shift)

| Engine | Surface | Mechanics (verified) | Gates |
|---|---|---|---|
| **Unity** | In-editor MCP (deprecated) → **Unity CLI MCP Mode** (free, recommended) | client → stdio → relay binary (`~/.unity/relay/… --mcp`) → named pipes/Unix sockets → in-editor bridge → tool registry; CLI path: `unity mcp` on the Unity Pipeline package; `unity command eval` drives the editor without MCP (faster, fewer tokens) | In-editor assistant route: Unity 6+ + Unity Cloud + AI-beta trial/subscription. CLI route: free, localhost-only, no subscription |
| **Blender** | **Blender Lab MCP Server** (Foundation, v1.0.3, Blender 5.1+) | Add-on; source projects.blender.org/lab/blender_mcp; scene introspection, data-block ops, GN auto-documentation, arbitrary Python "without any guards" | Free/GPL; experimental track; sandbox yourself |
| **Unreal** | **UE 5.8 built-in MCP Server (Experimental)** + UEFN MCP (beta, Aug 20, 2026) | Built on Epic's Toolset API; Epic docs (updated Aug 17, 2026) + official walkthrough for Claude Code/Codex CLI/Cursor (Jul 27, 2026); docs also cover "Working with PCG and LLMs Using Unreal MCP" | Experimental; early reception rough (Jul 2026 HN: failed a basic FName map-key edit); 5.8.1 fixed a fatal Blueprint-component crash |
| **Phaser** | **Phaser Agent MCP** (cloud) + **Editor v5 built-in MCP** (local) | Agent MCP: `npx @phaserjs/game-agent` installer writes configs; Claude Code speaks remote MCP, other CLIs use bridge.mjs stdio bridge; ~500 credits/full game; Editor MCP: `@phaserjs/editor-mcp-server`, 40+ tools (vendor-claimed count) | Agent MCP = credits (from $0.01/min); Editor = $12/mo |
| **Godot** | **None** — all third-party (below); engine ships the *substrates* instead (headless CLI, text scenes, built-in LSP, debug protocol, LibGodot) | — | — |
| **Construct** | **None** — and nothing can drive the editor UI; only project-file + CDP layers exist | — | — |
| (adjacent) **PlayCanvas** | playcanvas/editor-mcp-server — official-org MCP for another web engine (137★, updated ~Sep 9, 2026) | — | data point for the web-engine trend |

## 3. Community FOSS server inventory (existence-checked this run)

**Unity (deepest ecosystem):**
- **CoplayDev/unity-mcp** — 14,825★, v10.3.0 (Oct 4, 2026), 50 tool entrypoints + optional groups (vfx/anim/ui/testing), Unity 2021.3–6.x, multi-instance routing, OpenUPM install, remote-host-with-auth, Blender Bridge in v10.3; IS the original justinpbarnett repo (transfer verified via API; stewardship by Coplay announced Aug 8, 2025)
- **IvanMurzak/Unity-MCP** — 4,416★, v0.93.3 (Oct 10, 2026), claims 100+ tools, C#-method→MCP-tool in one line; shares engine-agnostic core `GameDev-MCP-Server` with Godot/Unreal siblings
- CoderGamester/mcp-unity (1,925★, WS bridge); AnkleBreaker-Studio (492★, claims 268 tools); FunplayAI (260★, input simulation + play-mode); TheArcForge/**Hades** (28★ — Unity knowledge-graph MCP, 32 tools, context compression); MosaicXR-AI/mosaic-bridge (claims ~290 tools; license NOASSERTION hazard); gamekit-cli (65★, Claude Code CLI)
- Dead: UnityNaturalMCP (archived), nurture-tech "Union" (archived), akiojin/unity-mcp-server (deprecated → unity-cli)

**Blender (biggest single repo, single-hubbed):**
- **ahujasid/mcp-for-blender** — 30,422★ (largest game/3D MCP repo anywhere), v2.1.9 (Oct 6, 2026); 9 focused tools + asset libraries (PolyHaven/Sketchfab/Poly Pizza) + gen-3D backends (Rodin/Tripo/Hunyuan); TCP socket localhost:9876, **no auth**; BLENDER_MCP_SAFE_MODE=1
- bpy-dev/blender-mcp — headless distribution of the official Lab server (bpy backend, BlenderBench benchmark)

**Unreal (thin-active layer, older giants dormant):**
- chongdashu/unreal-mcp (2,092★, TCP 55557, Blueprint node-graph editing — **dormant since Apr 2025**); kvick-games (613★ — API shows Jun 2025); runreal (115★, Python Remote Execution route — dormant); **IvanMurzak/Unreal-MCP** (45★, pushed Oct 10, 2026 — the active one); erhansiraci/ue-mcp (Remote Control API, TS/npm)

**Godot (most diverse):**
- Coding-Solo/godot-mcp (6,001★ — slowing); satelliteoflove/godot-mcp (input injection + playtest verification over the debug protocol); ee0pdt (addon+bridge); bradypp (fork w/ READ_ONLY_MODE); IvanMurzak/Godot-MCP (fast-rising); Erodenn Godot MCP Runtime (agents **play** the running game); commercial **GDAI MCP** ($19 lifetime, in-editor, input simulation)

**Construct:** liauw-media/construct3-mcp (18★, ~83 tools on .c3proj + 19 CDP runtime tools); nahuelgallo/ultimate-construct3-mcp (docs search)

**Engine-agnostic runtime:** lauripiispanen/game-mcp (TCP to any running game); wildware-uk/game-bridge-mcp (HTTP, toolsets discovered from the game); nowsprinting/gameplay-mcp (MCP embedded in your game's build so models play it)

**Dead/never-existed seeds (stop citing):** loigen/UnrealMCP, getAsterisk/unreal-mcp, Zanader/game-engineering-mcp (all 404); "ChongZhiIT" (garble of chongdashu); "PhaserNation"; "Code Canvas"; "Electron Toolset".

## 4. Agent-control maturity matrix (2026-10-10)

| Engine | Official support | Best FOSS server | Ecosystem depth | Headless story | Maturity 0–5 |
|---|---|---|---|---|---|
| Unity | Yes — CLI+MCP (free); in-editor MCP (subscription beta) | CoplayDev 14.8k★ | Deepest: 10+ servers, a startup (Coplay), Claude-Code infra | batchmode + CLI verified | **5** |
| Blender | Yes — Foundation Lab MCP | mcp-for-blender 30.4k★ | Deep but single-hubbed | `--background`+bpy standard; headless-MCP = young fork | **4.5** |
| Godot | No official server | Coding-Solo 6k★ (slowing); satelliteoflove (playtest) | Healthy; runtime-play servers emerging | **Best-in-class**: --headless + text scenes + LSP + --doctool | **3.5** |
| Unreal | Yes — 5.8 experimental (rough) | giants dormant; IvanMurzak active | Shallow-active | Remote Control API / Python Remote Exec; binary assets hurt | **3** |
| Phaser | Yes — cloud+credits Agent MCP; local = Editor v5 MCP | bridge only | Thin outside official | Cloud sandbox replaces local headless | **3 official / 1.5 local** |
| Construct | None | construct3-mcp (project files only) | Minimal | None — closed web editor; CDP only | **1** |

## 5. How agents actually connect (verified wiring)

```text
Unity official:      client --stdio--> ~/.unity/relay/relay_win.exe --mcp
                     --named pipes/unix socket--> Editor bridge --> McpToolRegistry
Unity CLI (new):     unity mcp / unity command eval / unity skill install
CoplayDev:           OpenUPM or git package --> "Configure All Detected Clients"
mcp-for-blender:     uvx mcp-for-blender (stdio) <-- TCP 9876 <-- Blender add-on
Blender Lab (off.):  add-on v1.0.3, Blender 5.1+ ("no guards")
bpy-dev headless:    BLENDER_MCP_CLI_BACKEND=1 --> _for_cli tools via pip bpy
chongdashu UE:       C++ plugin TCP 55557 <-- Python FastMCP sidecar (stdio)
satelliteoflove GD:  MCP <-> stdio <-> editor addon WS 6550 <-> game (debug proto 6007)
Coding-Solo GD:      npx stdio server --> spawns godot binary
Phaser Agent MCP:    npx @phaserjs/game-agent --> remote MCP (Claude) / bridge.mjs (others)
construct3-mcp:      project-file tools (stdio) + CDP bridge into served export
```

## 6. Clients & the Claude-Code-first pattern

Claude Code is the most consistently named first-class client across official docs and community READMEs (Unity, CoplayDev, IvanMurzak trio, Phaser — which ships a dedicated /agent/mcp/claude-code page, mcp-for-blender, CoderGamester, FunplayAI, loomle, Hades, gamekit-cli). A distinct 2026 pattern: **Claude-Code-specific infrastructure layered on top of MCP** — Unity knowledge-graph apps (Hades), CLIs (gamekit-cli, akiojin/unity-cli), agent *skills* (Unity's `unity skill install`, Phaser's 28 in-repo skills, ToadLobe c3-skill, MCP Market listings). OpenAI/Google participate as **clients only** (Codex, Gemini CLI, Antigravity are named integration targets; no engine-specific official servers from either).

## 7. Risks & critiques (verified anchors)

1. **Arbitrary code execution is the norm** — `execute_blender_code`, Unity `eval`/`execute_code`, unguarded official Blender Lab, UE Toolset bridges. mcp-for-blender's socket: no auth/encryption + a VulDB RCE entry; safe modes exist but are opt-in/off-by-default.
2. **Official ≠ polished** — UE 5.8 MCP's early reception; Unity's docs "never address determinism, context size, or safety" (marketing-first).
3. **Tool-count philosophies split** — focused surfaces (Coplay 50, blender-mcp 9+compact scene info, Hades knowledge graph) vs mega-surfaces (268/290/213 claimed tools). No practitioner benchmark of context bloat exists — a real research gap.
4. **Governance backlash is real** — Godot's contribution ban (Jun 30, 2026); Unity community anger at subscription-gating the in-editor MCP (Reddit, single-sourced) — though the CLI route is free; Unity ToS (Jul 2026) restricts automated tooling pointed at Unity data.
5. **Maintenance risk** — Unreal's community giants dormant since Apr–Jun 2025; archived Unity servers; license metadata gaps (chongdashu, Mosaic, c3-skill) are commercial-use hazards.
6. **Practitioner reality-check** — single-prompt games routinely need follow-up fixes (gamevibe.us logs); "experienced game devs certainly have an edge" (space-cruise.dev log).

## 8. Research & startup layer (agentic gamedev, 2025–26)

- **Startups:** Coplay (SF — unity-mcp steward, Aura assistant, Orchestrator multi-task mode); Phaser Studio's Agentic Engine (credit-metered cloud builds); IvanMurzak's cross-engine stack (ai-game.dev).
- **arXiv (API-verified):** Cutscene Agent (2604.25318 — multi-agent LLMs w/ **bidirectional MCP** to a game engine); RuleSmith (2602.06232 — engine-in-the-loop game balancing); LLMs as KSP operators (2505.19896).
- **Community layer:** Vibe Jam 2026 ($35k prizes, 1000+ submissions claimed); gamevibe.us (93+ days of daily Claude-built games); Clawfight.ai (MCP-driven agent-vs-agent play).

## 9. Open questions

UE 5.8 official MCP tool-list/transport specifics (page bot-blocked to fetchers — highest-value follow-up); Unity MCP's original launch date (earliest hard date: May 11, 2026 blog); MCP directories not swept (smithery/mcp.so/cursor.directory); tool-count claims are all self-reported; no quantitative context-size benchmark exists; whether Google/OpenAI ship engine-side equivalents.


---

<!-- ====================================================================== -->
<!-- FILE: 09-uvp-section.md -->
<!-- ====================================================================== -->

# UVP Map — Value Propositions → Tools (dual framing, per request)

Every tool in this roundup was classified by UVP. This section lists the UVPs twice — once framed as **technical integration capabilities** (how the tool connects), once as **user-facing workflow outcomes** (what the team gets) — because the same tool often sells on both. Provenance: **O** = OFFICIAL, **F** = FOSS, **C** = COMMERCIAL.

## A. Technical-integration UVPs

| # | UVP | Definition | Tools (provenance · engine · recency) |
|---|---|---|---|
| T1 | **Headless Pipeline Orchestration** | Engine drives builds/tests/exports without a GUI, scriptable from CI | Unity CLI (O·NEW) · classic `Unity -batchmode` (O·EST) · Godot `--headless --export-release` (O·EST) · Blender `--background --python` + bpy wheels (O·EST/UPD) · UAT/UBT/BuildGraph (O·EST) · commandlets (O·EST) · npm/vite web CI for Phaser (F·EST) |
| T2 | **LLM-Native Editor Control (MCP)** | A coding agent (Claude Code, Cursor, Codex…) inspects and drives the live editor over MCP | `unity mcp` CLI Mode (O·NEW) · in-editor Unity MCP (O·NEW, deprecated→CLI) · Blender Lab MCP (O·NEW) · mcp-for-blender (F·UPD, 30.4k★) · UE 5.8 Unreal MCP (O·NEW, exp.) · UEFN MCP (O·NEW, beta) · Phaser Agent MCP (O/C·NEW) · Phaser Editor v5 MCP (C·NEW) · CoplayDev unity-mcp (F·UPD, 14.8k★) · IvanMurzak Unity/Godot/Unreal trio (F·NEW) · Coding-Solo/satelliteoflove/ee0pdt/bradypp godot-mcp (F·NEW/UPD) · GDAI (C·NEW, $19) · construct3-mcp (F·NEW) · PlayCanvas editor-mcp (O·NEW, adjacent) |
| T3 | **Arbitrary-Code Execution Surface** | Agent runs host-language code inside the tool (fastest, most general, most dangerous) | `unity command eval` Roslyn (O·NEW) · `execute_blender_code` + Lab "no guards" (O/F) · Python editor scripting + Remote Execution (O·EST) · FunplayAI execute_code (F) · bpy-dev CLI backend (F·NEW) |
| T4 | **Structured Remote API (non-MCP)** | HTTP/WS/socket API into a live editor/runtime — the pre-MCP workhorse | UE Remote Control API port 30010 (O·EST) · chongdashu TCP 55557 (F) · mcp-for-blender TCP 9876 (F) · satelliteoflove WS 6550 (F·NEW) · CDP into browser editors/runtimes (community pattern) · Godot remote-debug wire 6007 (O·EST) |
| T5 | **Headless Embedding / Process-Level Control** | Own the engine inside your own process | **LibGodot** (O·NEW, 4.6) · bpy-as-module wheels (O·UPD) · Unity CLI driving runtime in dev builds (O·NEW) · gameplay-mcp embedded runtime tools (F·NEW) |
| T6 | **Agent Knowledge Packaging** | Docs/skills/LSP shipped *for* agents to consume | Phaser 28 in-repo skills (O·NEW) · `unity skill install` + official plugins for Claude Code/Codex/Grok (O·NEW) · Godot built-in LSP + `--doctool` XML dumps (O·EST/UPD) · godot-vscode-plugin headless LSP (F·UPD) · Hades Unity knowledge graph (F·NEW) · ultimate-construct3-mcp offline docs (F·NEW) · bpy-dev runtime-generated API docs (F·NEW) |
| T7 | **REST/SDK Asset Generation** | Programmatic asset creation usable from any agent script | Meshy REST+MCP (C·UPD) · Tripo API (C) · Hyper3D Rodin (C) · Scenario (C) · ElevenLabs incl. PAYG (C·UPD) · Stable Audio API (C) · PixelLab API+MCP (C) · Retro Diffusion HTTP API (C) · Stable Diffusion platform (C) |
| T8 | **Local / Self-Hosted Generative Models** | Own the model + weights, no vendor lock | TRELLIS.2 (F·MIT·NEW) · Hunyuan3D-2.1 (F·UPD) · ComfyUI pipelines (F·EST) · stable-audio-open weights (F) · AI Render / Dream Textures in-Blender SD (F) |
| T9 | **CI/CD Build Automation** | Version-controlled, reproducible build/test pipelines | GameCI v6 on game-ci/cli (F·UPD) · Horde (O·UPD) · Unity Build Automation (O/C·EST) · chickensoft setup-godot v2.4.3 + firebelley/godot-export v8 + godot-ci (F·UPD) · self-hosted GH runners for UE (pattern) · GitHub Actions (F·EST) |
| T10 | **Automated Test Execution** | Headless test frameworks with CI exit codes | Unity Test Framework 1.x CLI (O·UPD) · gdUnit4 v6.2.2 + .NET runner (F·UPD) · Gauntlet/UAT (O·EST) · GUT (F·UPD) · Vitest+MockScene / Playwright for Phaser (pattern) · gdtoolkit `--check-only` lint gate (F) |
| T11 | **Runtime Observation & Input Injection** | Agent *plays/verifies* the running game | satelliteoflove godot-mcp (F·NEW) · Erodenn Godot MCP Runtime (F·NEW) · UAIP (F·NEW) · AltTester CLI (F/C·UPD) · GameDriver (C) · modl.ai (C) · nunu.ai (C) · CDP simulate_input in construct3-mcp (F) |
| T12 | **Distributed Build/Render Infrastructure** | Scale cooking/rendering across machines | Horde + UBA (O) · Flamenco 3.9.3 (O·UPD) · Conductor API submissions (C) · InstaLOD CLI profiles (C·UPD) · UE Horde AWS Terraform (O/community·NEW) |
| T13 | **Project-File Manipulation (no editor API)** | Edit engine project formats directly as text/JSON | construct3-mcp on .c3proj (F·NEW) · Godot text .tscn editing (O format ·EST) · ConstructFund addon tooling (F) |
| T14 | **Distribution Automation** | Ship artifacts to stores from CI | steamcmd/SteamPipe VDF (O·EST) · itch butler v15.32 incl. headless launch (O/F·UPD) · Construct Game Services (O·NEW) |

## B. User-facing workflow UVPs

| # | UVP | "Our team can…" | Tools |
|---|---|---|---|
| U1 | **Rapid Prototyping / One-Sentence Games** | Go from prompt to playable in minutes | Phaser Game Agent + AE (O/C·NEW) · Unity AI Assistant + Generators (O·NEW beta) · Seeles.ai (C·NEW) · SummerEngine (C·NEW) · Meshy/Tripo quick props |
| U2 | **Automated QA & Playtesting Without Humans** | Bots hunt crashes/soft-locks/progression blockers and verify fixes | modl.ai (C — Side MOU Aug 2026) · nunu.ai (C) · GameDriver (C) · AltTester (F/C) · Gauntlet (O) · satelliteoflove deterministic playtests (F) · Playwright smoke suites (F) |
| U3 | **Ship More, Click Less (release automation)** | Commit → tested build → store, no manual GUI steps | GameCI (F) · Horde (O) · Unity CLI (O) · godot actions + butler + steamcmd (F/O) · Unity Build Automation (O/C) |
| U4 | **Style-Locked Asset Production** | Generate on-model sprites/textures trained on your art | Scenario (C) · Layer.ai (C, pivoting) · PixelLab (C) · Retro Diffusion (C) · Leonardo (C) |
| U5 | **Text/Image-to-3D Hero Assets** | Concept → rigged, quad-topo, PBR-ready meshes | Meshy-7.1 (C) · Tripo P2.0 native quads (C) · Hyper3D Rodin Gen-2 (C) · TRELLIS.2 self-host PBR 1536³ (F) · Hunyuan3D-2.1 (F) |
| U6 | **AI-Assisted Animation & Mocap** | Animate/rig without a mocap stage | Meshy Text-to-Motion API (C) · Cascadeur 2025.3 quadrupeds (C) · Move One single-phone mocap (C) · Rokoko Vision (C) · NVIDIA ACE→NVIGI MetaHuman faces (free/C) |
| U7 | **Procedural Content at Scale** | Rule-based worlds/props that agents can also drive | UE PCG production-ready + "PCG with LLMs" official workflow (O) · Dungeon Architect (C) · Geometry Nodes/Sverchok (O/F) · LimboAI/Beehave behavior trees (F) · Orchestrator visual scripting (F) |
| U8 | **Voice, SFX & Music on Demand** | Fill audio passes via API | ElevenLabs PAYG (C) · Stable Audio (C) · Suno/Udio commercial tiers (C) |
| U9 | **Editor-as-a-Teammate (agent pair-programming in-engine)** | An agent edits scenes/scripts while you watch | Unity official plugins + CLI (O) · Blender Lab/mcp-for-blender (O/F) · CoplayDev/Aura Orchestrator (F/C) · UEFN MCP writing Verse (O) · Phaser Editor AI chat (C) · godot MCPs (F/C) |
| U10 | **Retopology & Asset Conditioning at Scale** | Turn scans/gen meshes into game-ready topology unattended | InstaLOD CLI (C) · Meshy quad mode / Tripo native quads (C) · Blender quad remesh via bpy (F) · QuadRemesher (C — GUI/EULA-restricted) |
| U11 | **Deterministic Reproducible Pipelines** | Same inputs → byte-same outputs in CI | pinned LTS engines (Blender 5.2 LTS/bpy, Godot 4.7.2, Unity 6.3 LTS) · `--factory-startup` · godot `--check-only` gates · VDF-pinned SteamPipe builds |
| U12 | **Live-Ops Content Updates** | Incremental content pushes post-launch | Godot delta Patch PCKs (O·NEW) · SteamPipe set_live branches (O) · butler delta patching (O/F) |

## C. Cross-reference: the eight "load-bearing" tools by UVP coverage

The tools that appear under the most UVPs (i.e., the ones a team adopting agent control should evaluate first):

1. **Unity CLI + MCP** — T1, T2, T3, T5, T6, T9, U3, U9, U11
2. **mcp-for-blender** — T2, T3, T4, T7 (gen-3D backends), T12 (asset import), U9, U10 (via bpy)
3. **Godot headless stack** (CLI + LSP + gdUnit4 + setup-godot) — T1, T6, T9, T10, U3, U11
4. **CoplayDev/unity-mcp** — T2, T11 (test runs via MCP), U9 (+ Aura → U1)
5. **Phaser Game Agent + Agent MCP** — T2, U1, U3 (export/deploy), U4/U8 (art+music gen)
6. **GameCI** — T9, T10, U3, U11
7. **Meshy** — T7, U1, U5, U6, U10
8. **InstaLOD CLI** — T12, U10


---

<!-- ====================================================================== -->
<!-- FILE: 10-cross-engine-inventories.md -->
<!-- ====================================================================== -->

# Cross-Engine Inventories — CI/CD, Testing, GenAI Assets, Visual Scripting, Distribution

## 1. CI/CD & build automation per engine (recommended minimal pipelines, verified commands/actions)

### Unity
Activation (Personal: activate in Hub locally → `.ulf` into `UNITY_LICENSE` secret; Pro: `UNITY_SERIAL`+creds; or floating server via `unityLicensingServer`/`Unity.Licensing.Client`) → `game-ci/unity-test-runner@v4` → `game-ci/unity-builder@v6` → artifact → butler/steamcmd.
- **unity-builder v6.0.0** (Sep 10, 2026) = thin wrapper on **game-ci/cli** (the v6 unification is the window's main architectural event); v5.0.1/v4.8.2 (Sep 1, 2026) fix Unity 6.6+ Docker shm (needs ~1 GiB); test-runner **v4.1.0 (Dec 13, 2025) requires UNITY_EMAIL/PASSWORD**; known unity-activate@v2 wrong-version bug (Feb 2026).
- **Avoid Unity Hub in CI** (3.18.0 license regression, May 6, 2026). Docs lag v6 majors (v6 gaps: providerStrategy != "local" throws).

### Unreal
Self-hosted runner → `Engine\Build\BatchFiles\RunUAT.bat BuildCookRun -project=<p> -platform=Win64 -build -cook -package` → Gauntlet via `-run=-test=<Filter>` or BuildGraph fan-out → Sentry UE 1.24.x telemetry. Consider **Horde** (>2 agents; UE-native CI — agents, device farms, UBA; AWS Terraform module in progress; "Horde on a Budget" write-up Mar 2026). No canonical GH Action exists (verified); Sentry builds its UE SDK on GH Actions (reference).

### Godot
`chickensoft-games/setup-godot@v2.4.3` (or `barichello/godot-ci` Docker image) → gdUnit4 headless CLI (+ standalone .NET runner) → `godot --headless --export-release <preset> <out>` → `butler push`. Traps: Vulkan errors on GPU-less CI (use `--headless`), no signed macOS exports from Linux runners, templates must be installed first. Dead: dulvui/godot-4-html-export (archived Jun 2025). GodotSteam moved GitHub→Codeberg (Oct 5, 2026) — update pins.

### Blender
`pip install bpy==5.2.2` (Python 3.13; cache the 200–400 MB wheel) for scripted jobs, or full binary `blender -b scene.blend --python script.py` for render/CUDA paths. **nytimes/blender Docker images are DEAD since Nov 2022 — do not adopt**; no official Foundation image exists. Flamenco 3.9.3 for persistent farms (3.8's MQTT change is backward-incompatible). CUDA 12.8/driver pinning is the active compatibility issue.

### Phaser / web
npm test (Vitest+MockScene) → build (vite) → Playwright headless smoke (`webServer: vite preview`) → GitHub Pages or `butler push`. No Phaser-specific CI action needed or existing. No official CI template repo (gap).

### Construct
**No CLI export exists (double-verified)** — GUI/cloud export + CI post-processing (Electron/NW.js packaging, butler). Full build→ship automation is unreachable today.

### Distribution (cross-engine)
- **steamcmd/SteamPipe** (EST): `steamcmd +login <build_account> +run_app_build ../scripts/app_build_<appid>.vdf +quit`; `set_live` for CD (beta branches only); constraints: IP rate-limiting reports, Steam Guard 2FA on headless runners (dedicated build account), first-run self-unpack.
- **itch butler v15.32.0** (Oct 6, 2026; MIT): delta patching, Steam→itch build copying (experimental), **headless `butler launch` since v15.31.0**; `BUTLER_API_KEY` CI auth.
- Codemagic/Bitrise: niche — only earn their place for mobile store-signing chains (no Godot; Unity only via custom setups).

## 2. Testing & automated QA across engines

| Engine | Unit/framework | Runtime/UI automation | Notes |
|---|---|---|---|
| Unity | **UTF 1.x** (1.6 ships 6.4/6.5; 1.8.0 Apr 2026; **2.0-exp abandoned**); new UI Toolkit test framework (6.3) | AltTester 2.3.x (+ new AI-oriented CLI, Jun 2026) · GameDriver · Unity CLI `unity test --affected` | Performance Testing pkg dormant since 2021 |
| Unreal | Gauntlet + UAT `-run=` (O) | GameDriver UE SDK · UAIP runtime observation | AutomationDriver (Slate UI) in 5.8 docs |
| Godot | **gdUnit4 v6.2.2** (very active; CI on 4.8-dev7) · GUT 9.7.x | satelliteoflove input-injection playtests · Erodenn runtime MCP | gdtoolkit `--check-only` = lint gate |
| Blender | pytest over bpy (pattern) | — | Flamenco for batch verification jobs |
| Phaser | Vitest/Jest + **MockScene** (no Phaser-specific framework exists — confirmed gap) | Playwright/Cypress headless E2E on the built page | |
| Construct | none (runtime JS only) | CDP bridge (construct3-mcp's 19 runtime tools) · Remote Preview | |
| Cross | **modl.ai** (AI bots hunt crashes/soft-locks; Side MOU Aug 2026 → hybrid JV) · **nunu.ai** (vision-driven agents, PC+iOS/Android) | **Regression Games DEAD** (site frozen 2023 + possibly compromised + emptied GitHub org) · PlaytestCloud = human panel (EST) | Sentry UE 1.24 adds AI toolset + MCP integration (Sep 29, 2026) |

## 3. GenAI asset-pipeline landscape

### 3D generation (image/text→mesh)

| Tool | Prov | Latest | Differentiator | Gaps/flags |
|---|---|---|---|---|
| **Meshy** | C | meshy-7 (Aug 12–13, 2026) · **7.1** (Sep 18, 2026: geometry_resolution 2k/4k); meshy-5 retires Oct 10, 2026 | Richest API surface (REST+MCP; rig/anim, Text-to-Motion, UV unwrap, auto-split); Unity/Blender/Unreal plugins; free 20–100 cr/mo, Pro ~$16–20/mo | Benchmarks: fastest text-to-3D, slowest image-to-3D (HackerNoon Jun 2026) |
| **Tripo (VAST)** | C | P2.0 (Sep 2026 — single-sourced): **native quad meshes** | "Game-ready straight out of the generator"; DCC Bridge for Blender 4.1+ (Feb 5, 2026); REST | P2.0 claim needs re-verification (source article 404'd) |
| **Hyper3D Rodin** | C | Gen-2 (Oct 1, 2025) + 3D editing platform (Mar 31, 2026) | High-fidelity; API-first; 302.ai relay | Gen-2.5 unverified; pricing opaque |
| **TRELLIS / TRELLIS.2** | F (MIT) | TRELLIS.2 (Dec 16, 2025 project / Jan 11, 2026 repo): 4B params, PBR (basecolor/metallic/roughness), 1536³, 3–60 s | **The safest open option** — MIT + full PBR; ComfyUI node live mid-2026 | Linux + 16 GB+ VRAM; no official Blender plugin (Unreal-only community port) |
| **Hunyuan3D (Tencent)** | F | 2.1 open-sourced (Jun 13, 2025); HunyuanWorld-1.0 (Jul 26, 2025) | Official Blender addon (Jan 2025); bundled api_server.py; ~6–16 GB VRAM | Community license w/ revenue threshold — **read LICENSE before commercial use**; "3.1"/"Buffalo" claims unverified |
| Kaedim · Sloyd · SPAR3D (Stability) | C | — | Human-in-the-loop studio service · parametric templates · <1 s single-image 3D | Kaedim custom-quoted; no APIs on Kaedim/Sloyd |
| **Luma Genie** | C | — | — | **DEAD** — Luma pivoted entirely to video (verified by direct fetch, Oct 2026) |

### 2D / sprites / textures
**Scenario** (C — custom-trained style-locked models; REST on paid plans; 650+ models/40+ providers; open-source agent "skills" drive Blender/Unity/etc. instead of plugins) · **Leonardo** (C — Canva-owned; Creative Engine API) · **PixelLab** (C — pixel-art specialist incl. rotations/animations; API+MCP; Aseprite extension) · **Retro Diffusion** (C — HTTP API; best-regarded base pixel sprites; also hosts on Scenario) · **Layer.ai** (C — pivoting from game assets to UA creatives; customers Zynga/Tripledot) · **Adobe Substance 3D** (O/C — Sampler 6.0 OpenPBR Apr 16, 2026; no gen-texture API) · **Poly/withpoly.com** (C — **presumed dead**, no activity since ~2023) · ComfyUI (F — the standard local route, esp. for Godot).

### Animation / mocap
**Cascadeur 2025.3** (C — quadrupeds, Jan 2026) · **Meshy Text-to-Motion** (C — the only direct API motion option) · **Move One** (C — single-phone mocap, Free=30 credits / $18/mo) · Rokoko Vision (C, free tier) · DeepMotion (C — weakly verified).

### Audio
**ElevenLabs** (C — TTS/SFX/music; **price cuts + PAYG May 7, 2026**; game-ready licensing on paid tiers) · **Stable Audio** (C + open weights; Pro-tier commercial rights) · Suno/Udio commercial tiers usable in games (licensing context).

### Level/environment generation
No dominant dedicated genAI level product with engine integrations. Production reality: **Dungeon Architect** (C, Unity+UE — the workhorse), ProceduralDungeon (F, UE), UE **PCG** production-ready + official "PCG with LLMs" MCP workflow (O), agentic scene-driving as the 2026 pattern (Unity/UE MCP + GDC-2026 multi-agent write-ups). Watchlist: **Seeles.ai** (describe→native UE5 project), **SummerEngine** (AI-native engine, deterministic code you own), HunyuanWorld-1.0 (F).

### Native engine AI features (official)
**Unity**: AI stack beta — Assistant (agentic, in-editor), Generators (sprites/textures/anim/audio/materials), Sentis, AI Gateway, MCP/CLI/plugins (Personal $10/mo after trial; Muse deprecated). **Unreal**: none first-party (5.7's Developer Assistant + 5.8 MCP are control surfaces, not generators); third-party fills it (Rapid Assets UE+Godot plugins, GenAI Model Generator). **Blender**: none official (extensions platform has zero AI extensions; Lab MCP is control, not generation); community AI Render/StableGen/Dream Textures. **Godot**: none; ComfyUI+MCP is the standard route.

### Agent-friendlyness matrix (how to consume)
- **REST/CLI (best for custom agents):** Meshy, Tripo, Rodin, Scenario, Leonardo, ElevenLabs, Stable Audio, PixelLab, Retro Diffusion; self-host TRELLIS.2/Hunyuan/stable-audio-open.
- **Official engine plugins:** Meshy (Unity/Blender/UE), Tripo DCC Bridge, Hunyuan Blender addon, Rapid Assets (UE/Godot), PixelLab↔Aseprite.
- **No API (GUI only):** Kaedim, Sloyd, Cascadeur, Move.ai, Rokoko, Substance, Dungeon Architect.
- **Quality signal:** except Tripo-P2/Meshy-quad outputs, generated meshes are triangle soup → retopo post-step (InstaLOD CLI / Blender quad remesh) remains required. **Legal:** fully-AI assets get no US copyright (May 2026 legal analysis); 52% of devs say genAI hurts the industry (GDC 2026 survey, up from 30%).

## 4. Visual scripting / node-based workflows per engine (2026 state)

| Engine | Official | Community/de-facto | Status |
|---|---|---|---|
| Unity | **Visual Scripting 1.9.12** ships "released" with 6000.6 | — | **Frozen, not deprecated** (community expects deprecation at Unity 7 — unconfirmed). "Code Canvas" = fictitious seed |
| Unreal | **Blueprints** (backbone) + **Verse** (UEFN-scoped; agent-writable via UEFN MCP) | Blueprint Assist (C, keyboard-driven editing) | Blueprints ESTABLISHED; UE6 may evolve internals (directional) |
| Godot | none since 4.0 removal | **Orchestrator** (1,630★, Apache-2.0 — de-facto successor) · LimboAI BT/HFSM (~3k★) · Beehave BT (3.3k★) | All UPDATED-in-window; no official revival |
| Blender | **Geometry Nodes** (O — programmable via bpy; the agent lever) + GN-based modifiers/assets | **Sverchok** 1.4.0 (code/script nodes) | Both UPDATED; GN API churns — pin LTS |
| Phaser | Script Nodes + User Components (Editor v5) — property-wired, not wire-graph | none (confirmed gap; Rete/LiteGraph used ad hoc) | v4's "node-based renderer" is internal architecture, not an editor |
| Construct | **Event sheets** (the native paradigm) | none | ESTABLISHED; not node-graph by design |

## 5. Dead / avoid register (verified this run)

**Dead:** Luma Genie (pivot) · Regression Games (frozen+emptied) · BlenderGPT (2023) · nytimes/blender images (2022) · ShoeBox (AIR) · Qodot (404s) · dulvui/godot-4-html-export (archived) · UnityNaturalMCP + nurture-tech "Union" (archived) · Poly/withpoly (presumed) · KVick/chongdashu/runreal Unreal MCPs (dormant since mid-2025 — verify before pinning).
**Never existed / garbled seeds:** "Code Canvas", "Electron Toolset", "loigen/UnrealMCP", "getAsterisk/unreal-mcp", "ChongZhiIT", "Zanader/game-engineering-mcp", "Firehose", "run-uberbuilder", "BuildRocket", "JamSV", "PhaserNation", "bpy-rpc", "Construct 4", "newgene3 fork", "Vector Embeddings" (as a Unity product).
**License hazards:** QuadRemesher EULA bans automation · chongdashu/MosaicXR/c3-skill license gaps · Hunyuan community license · GodotSteam platform move.


---

<!-- ====================================================================== -->
<!-- FILE: 11-sources.md -->
<!-- ====================================================================== -->

# Sources & Verification Register

## 1. Method

11 parallel research agents (per-engine specialists for Unity/Blender/Unreal/Phaser/Godot/Construct + grounding + CI/CD + GenAI assets + visual scripting + MCP landscape), ~430 searches + ~250 primary-source fetches total, window 2025-10-10 → 2026-10-10. The parent session then **deep-verified every load-bearing or disputed claim against first-party sources** (section 3). Items that could not be double-sourced are flagged inline throughout the package and collected in section 4. Agent reports are archived verbatim in `independent_research/scratch/2026-10-10-gamedev-roundup/results-*.md` (11 files).

## 2. Primary source anchors (by engine)

**Unity**
1. docs.unity.com/en-us/unity-cli/replace-mcp-server-unity-cli — MCP→CLI deprecation/migration
2. docs.unity.com/en-us/unity-cli/unity-cli-reference · docs.unity.com/en-us/hub/unity-cli · unity.com/blog/meet-the-unity-cli (Jul 20, 2026)
3. discussions.unity.com — Unity CLI announcement (Jul 15, 2026); "Unity 6.4/6.5/6.6 is now available" posts
4. unity.com/features/ai · docs.unity3d.com Assistant/MCP/AI-Gateway package docs
5. docs.unity3d.com/Manual/EditorCommandLineArguments.html (6.6) · docs.unity.com/en-us/hub/cli-overview
6. unity.com/releases (+ /releases/editor/whats-new) · unity.com/pricing · docs.unity.com/en-us/licensing-server
7. github.com/CoplayDev/unity-mcp (+releases, api.github.com redirect check) · github.com/IvanMurzak/Unity-MCP/releases
8. github.com/game-ci/unity-builder/releases · /unity-test-runner/releases · game.ci/docs/github/activation

**Blender**
9. blender.org/download/releases/ (+download.blender.org/release file timestamps)
10. developer.blender.org/docs/release_notes/5.0/python_api/ · /5.1/pipeline_io/
11. blender.org/lab/mcp-server/ (+projects.blender.org/lab/blender_mcp) — official MCP v1.0.3
12. pypi.org/project/bpy/ · pypi.org/project/mcp-for-blender/ · github.com/ahujasid/mcp-for-blender · github.com/bpy-dev/blender-mcp
13. docs.blender.org/manual/en/latest/advanced/command_line/arguments.html · flamenco.blender.org/download/ · blender.org/category/press/
14. exoside.com/quadremesher/quadremesher-doc/ · docs.instalod.io · docs.conductortech.com/tutorials/blender

**Unreal**
15. unrealengine.com/news/unreal-engine-5-7-is-now-available (Nov 12, 2025) · /unreal-engine-5-8-is-now-available (Jun 23, 2026)
16. unrealengine.com/News — "The road to Unreal Engine 6" (Jun 22, 2026)
17. dev.epicgames.com — unreal-mcp-in-unreal-editor · "Working with PCG and LLMs Using Unreal MCP" · remote-control-api-quick-start · horde · "Using the UE5 MCP Server with Claude Code" (Jul 27, 2026)
18. fortnite.com/news/unreal-mcp-is-now-available-in-uefn (Aug 20, 2026)
19. github.com/kvick-games/UnrealMCP · github.com/chongdashu/unreal-mcp · github.com/IvanMurzak/Unreal-MCP · github.com/Conv-AI/Convai-UnrealEngine-SDK/releases · github.com/getsentry/sentry-unreal/releases

**Phaser**
20. phaser.io/download/archive · phaser.io/agent/about · phaser.io/agent/mcp (+/claude-code) · phaser.io/editor · phaser.io/news index (Jul 8 / Jul 7 / Sep 22, 2026 posts)
21. github.com/phaserjs/phaser/releases + discussion #7274 · github.com/phaserjs/phaser-game-agent · npmjs.com/package/@phaserjs/editor-mcp-server
22. mapeditor.org · codeandweb.com/texturepacker/documentation · itch.io/docs/butler

**Godot**
23. godotengine.org/download/archive/ · /releases/4.6 · /releases/4.7 · /blog (+atom.xml) · /article/contribution-policy-2026
24. docs.godotengine.org/en/stable/tutorials/editor/command_line_tutorial.html
25. github.com — Coding-Solo/godot-mcp · satelliteoflove/godot-mcp · ee0pdt/Godot-MCP · bradypp/godot-mcp · gdaimcp.com
26. github.com/MikeSchulze/gdUnit4 · bitwes/Gut · Scony/godot-gdscript-toolkit · CraterCrash/godot-orchestrator · limbonaut/limboai · bitbrain/beehave
27. github.com/chickensoft-games/setup-godot · firebelley/godot-export · abarichello/godot-ci · GodotSteam/GodotSteam (→Codeberg) · godotengine/godot-vscode-plugin · TrenchBroom/TrenchBroom

**Construct**
28. construct.net/en/make-games/releases (+/stable/r476) · /manuals (addon-sdk, scripting, testing-projects) · /en/buy (SERP snapshot)
29. github.com/Scirra/Construct-Addon-SDK · github.com/liauw-media/construct3-mcp · github.com/orgs/ConstructFund/repositories · summerengine.com/construct-3-mcp

**Cross-engine / GenAI / MCP**
30. modelcontextprotocol.io/specification/latest (rev 2026-07-28)
31. pcgamer.com — Godot AI-contribution ban coverage (Jul 1, 2026)
32. docs.meshy.ai/en/api/changelog · tripo3d.ai/help/api-plugins · github.com/microsoft/TRELLIS (+TRELLIS.2 project page) · github.com/Tencent-Hunyuan/Hunyuan3D-2 · lumalabs.ai (Genie-dead verification) · scenario.com · docs.move.ai · elevenlabs.io (PAYG May 7, 2026)
33. github.com/itchio/butler/releases · partner.steamgames.com SteamPipe docs (wiki updated Jul 25, 2026)
34. coplay.dev/blog/coplay-and-open-source-unity-mcp-join-forces (Aug 8, 2025) · pocketgamer.biz
35. arXiv 2604.25318 (Cutscene Agent) · 2602.06232 (RuleSmith) · 2505.19896 (KSP operators)
36. GDC 2026 State of the Game Industry (via Reed Smith summary) · gamesindustry.biz (Unity pricing, Dec 17, 2025)

## 3. Deep-verification register (parent-session checks, 2026-10-10)

| Claim | Method | Verdict |
|---|---|---|
| Unity in-editor MCP deprecated → `unity mcp` in CLI | Direct fetch of docs.unity.com migration page | **CONFIRMED verbatim**: "Unity has deprecated the MCP server component of the in-editor AI assistant package com.unity.ai.assistant… The `unity mcp` command in the Unity CLI replaces the in-Editor server." CLI MCP "remains fully supported"; CLI free, "doesn't require a Unity AI subscription"; Unity 6.0 LTS+ for live editor; assistant pkg ≥2.13 fixes CLI conflict |
| Godot AI contribution policy | Direct fetch of godotengine.org article | **CONFIRMED verbatim** (Jun 30, 2026): bans autonomous agents/vibe-coding + substantial AI code; "We require all code to be human authored"; disclosure required for assistive use; human review mandatory |
| UE 5.8 MCP server | Multi-source (news + Epic docs + roadmap + forum hotfix note) | **CONFIRMED**: GA Jun 17, 2026 (official post Jun 23); "experimental Unreal MCP system… allows AI tools to control the editor and query engine state"; docs updated Aug 17, 2026; 5.8.1 hotfix fixed fatal MCP crash; on official Productboard roadmap; integrates with Toolset API |
| UE6 announcement | Search to official blog | **CONFIRMED** (was previously unverified): announced ~May–Jun 2026; official "The road to Unreal Engine 6" (Jun 22, 2026): EA targeted end-2027, full release 12–18 months later, UE+UEFN merged |
| Unity 6.4 GA date | Search to official forum + press | **RESOLVED**: official Unity Discussions post = **Mar 17, 2026**; press coverage Mar 18–20. Both agent dates were real; Mar 17 is the first-party date |
| Blender Lab MCP server existence | Two independent agents fetched blender.org/lab/mcp-server | **CONFIRMED (double-sourced)**: official Foundation MCP server, add-on v1.0.3, Blender 5.1+, "no guards" wording; page ~Mar 2026 |
| Unity Test Framework 2.0 | Package changelog | **CONFIRMED abandoned** (2.0.1-exp.2, 2022; Unity stated no foreseeable updates Dec 2024) — 1.x is the maintained line |
| Construct CLI export absence | Two independent sweeps | **CONFIRMED negative (double-sourced)** |

## 4. Flagged-unverified register (items cited with caution elsewhere)

- **Dates inferred** (GitHub releases show month/day only): unity-builder v6.0.0, setup-godot v2.4.3, godot-export v8.0.0, butler v15.32.0, GUT 9.7.1 year.
- **Single-sourced:** Unity 6.5 GA date (Jun 15) · Unity AI "GA with 6.4" claim vs official beta · Unity plugin launch dates (Sep 9/16) · Tripo P2.0 native quads · Hunyuan3D "3.1"/"Buffalo" · Hyper3D Gen-2.5 · Kaedim pricing conflict · W4 Games $18M Tencent round · Construct pricing tiers (SERP snapshot vs review) · Phaser RC6/RC7 years · TexturePacker 8.2.0 (AUR) · Phaser Editor MCP "40+ tools" (vendor claim) · Unity MCP-paywall Reddit thread · sc-lacanlale fork · SummerEngine claims.
- **Unfetchable pages (content asserted from secondary records):** unrealengine.com news (403) · dev.epicgames.com JS-shelled pages · construct.net (cache-frozen; releases >r476 unenumerable) · npm (403) · projects.blender.org (Cloudflare) · pypi project pages (some).
- **Count claims (self-reported, never independently counted):** 268 / ~290 / 213 / 100+ / 90+ / 169 / 83 tool counts across MCP servers.
- **Freshness unverified:** unityci/editor Docker image rebuilds · Playwright/Cypress current versions · butler GH-Action wrappers · ourcade templates · Dream Textures 5.x compat · RetopoFlow 5.x · Epic Developer Assistant details · MetaHuman beyond 5.7 · Incredibuild · PlaytestCloud.
- **Known gaps not covered:** smithery/mcp.so/cursor.directory MCP directories · UE official MCP port/tool list · Unity Asset Store AI-tool survey · academic LLM-gamegen literature for Phaser/Construct (confirmed sparse-to-absent).
- **Debunked seeds (do not cite):** see "Dead / avoid register" in 10-cross-engine-inventories.md §5.

