# Phaser 3/4 & Construct 3: Web Game Engine Automation, Headless Workflows & Agentic Control (2025–2026)

*Target Engines: Phaser 3 / 4 Beta (Phaser Studio) & Scirra Construct 3 (r450+)*  
*Scope: Official Ecosystem, FOSS / Community Open-Source, and 3rd-Party Standalone Web Automation Systems*

---

## 1. Architectural Overview: Web Game Engines in the Autonomous Age

Web-first game development environments occupy a unique position in IDE automation. Unlike heavy C++ or C# desktop runtimes that require massive compilation pipelines, web game engines run on the **DOM, HTML5 Canvas, WebGL, WebGPU, and modern JavaScript/TypeScript runtimes**.

Over the past 12 months (late 2025 through late 2026), both **Phaser** and **Construct 3** underwent major shifts toward agentic integration:
1. **Phaser Studio's Official Model Context Protocol (MCP) Server:** Phaser Studio released `@phaserjs/editor-mcp-server` for **Phaser Editor v5**, making Phaser the first 2D web game engine to officially support Anthropic's MCP standard out of the box, accompanied by official Cursor starter templates.
2. **Construct 3's Full Shift to Addon SDK v2:** Scirra officially phased out legacy SDK v1 plugins (starting around r450), enforcing strict modular encapsulation, ES6 module imports, and strict TypeScript/JSON validation schemas that can be parsed and verified headlessly.
3. **Headless Browser Test Automation:** The game development community standardized on **Playwright** and **Puppeteer** for running end-to-end canvas testing, visual regression screenshot diffs, and synthetic touch/mouse input automation on cloud CI runners.

---

# PART A: PHASER 3 & PHASER 4 BETA AUTOMATION

## 2. Official Ecosystem Tools (Phaser)

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              OFFICIAL PHASER AUTOMATION STACK                          │
├─────────────────────────┬──────────────────────────────────────────────────────────────┤
│ Component               │ Core Mechanism & Purpose                                     │
├─────────────────────────┼──────────────────────────────────────────────────────────────┤
│ @phaserjs/editor-mcp    │ Official Phaser Studio MCP server connecting AI to Editor v5 │
│ Cursor Starter Template │ Pre-configured project scaffolding with .cursor/mcp.json     │
│ Phaser Editor Compiler  │ Compiles .scene / .components JSON into clean JS/TS classes  │
│ Phaser.HEADLESS Mode    │ Runs game loop and physics without Canvas/WebGL rendering    │
└─────────────────────────┴──────────────────────────────────────────────────────────────┘
```

### 2.1 The Official Phaser Editor MCP Server (`@phaserjs/editor-mcp-server`)
Released by Phaser Studio Inc. for **Phaser Editor v5**, this package brings first-party AI agent control to 2D web game creation.
* **Architecture:** Distributed via npm (`npm install -g @phaserjs/editor-mcp-server`). It communicates over stdio with AI code editors (Cursor, Claude Desktop, Windsurf, VS Code with Copilot).
* **Capabilities:**
  * **Scene Editor Control:** Programmatically creates, edits, and inspects visual `.scene` files, positioning sprites, containers, tilemaps, and bitmap text.
  * **Asset Pack Manipulation:** Inspects and updates `asset-pack.json` files, mapping sprite sheets, audio files, and bitmap fonts into the game project.
  * **Level Scaffolding:** Allows developers and agents to generate multi-room 2D level layouts using natural-language prompts.

### 2.2 Official Cursor Starter Templates
Phaser Studio maintains official AI starter templates (e.g., `phaserjs/editor-starter-template-cursor-javascript`):
* **Pre-Set AI Configuration:** Includes ready-to-use `.cursor/mcp.json` configs and `.cursorrules` markdown files.
* **Task Division Architecture:** Explicitly instructs the AI agent on how to divide tasks: visual scene assembly is routed to the MCP server, while gameplay logic and physics handlers are written cleanly into standard JavaScript/TypeScript classes.

### 2.3 The Scene & Component Compiler
Unlike traditional game engines that require proprietary binary runtime parsers, Phaser Editor relies on an open **Scene and Component Compiler**.
* **Clean Code Generation:** Visual `.scene` and `.components` files are stored as plain JSON. When saved, the compiler immediately generates readable, standard JavaScript or TypeScript classes.
* **UVP for Agents:** AI agents do not have to parse complex compiled binaries. An agent can read the compiled TypeScript class directly or modify the underlying JSON representation.

### 2.4 Headless Game Execution (`type: Phaser.HEADLESS`)
Phaser features a native headless rendering mode built into its core configuration:
```javascript
const config = {
    type: Phaser.HEADLESS, // Disables Canvas and WebGL initialization
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 300 } }
    },
    scene: [ BootScene, GamePlayScene ]
};

const game = new Phaser.Game(config);
```
* **Use Cases:** Running authoritative multiplayer game servers in Node.js, automated unit testing of physics interactions, and background game simulation without a graphical display.

---

## 3. FOSS & Community Open-Source Tooling (Phaser)

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        COMMUNITY OPEN-SOURCE TOOLING (PHASER)                          │
├─────────────────────────┬──────────────────────────────────────────────────────────────┤
│ Tool / Repository       │ Architectural Mechanism & Role in Pipeline                   │
├─────────────────────────┼──────────────────────────────────────────────────────────────┤
│ Playwright / Puppeteer  │ Headless browser automation for canvas input & visual diffing│
│ jest-canvas-mock/Vitest │ In-memory Node.js canvas stubs for unit testing logic        │
│ Vite / ESBuild CLI      │ Instant HMR and sub-second production web bundling           │
│ phasereditor2d-launcher │ npx launcher spinning up headless editor server in pipelines │
└─────────────────────────┴──────────────────────────────────────────────────────────────┘
```

### 3.1 Headless Canvas Testing via Playwright
Because HTML5 Canvas renders pixels as an opaque bitmap rather than individual DOM elements, testing games requires automated browser orchestration.
* **Playwright Automation Pattern:** Launches a headless Chromium instance, injects input events (clicks, keypresses, touch swipes), inspects the `window.__PHASER_GAME__` global state, and captures screenshots for visual regression:
  ```typescript
  import { test, expect } from '@playwright/test';

  test('Phaser 3 Player Movement and Score Verification', async ({ page }) => {
      await page.goto('http://localhost:3000');
      // Wait for Phaser canvas to mount
      await page.waitForSelector('canvas');

      // Query internal game state exposed on window
      const initialScore = await page.evaluate(() => window.__GAME_STATE__.score);
      expect(initialScore).toBe(0);

      // Simulate keyboard input (Arrow Right)
      await page.keyboard.press('ArrowRight', { delay: 500 });

      // Verify player position changed
      const playerX = await page.evaluate(() => window.__PLAYER__.x);
      expect(playerX).toBeGreaterThan(100);

      // Capture screenshot for automated regression diffing
      await page.screenshot({ path: 'reports/gameplay_snapshot.png' });
  });
  ```

### 3.2 Unit Testing with Vitest & `jest-canvas-mock`
For fast unit tests of state machines, inventory logic, and math calculations without launching a full browser:
* **Mechanism:** Vitest runs inside pure Node.js, using `jest-canvas-mock` to mock `HTMLCanvasElement.getContext('2d')` and window animation frames. Tests execute in milliseconds.

---

## 4. Third-Party Standalone Software (Phaser)

* **TexturePacker CLI (CodeAndWeb):** The industry standard for sprite sheet generation. Offers an automated command-line interface (`TexturePacker.exe`) that packs loose PNG sprites into optimized sprite sheets, trims transparent borders, and exports Phaser 3 JSON hash/array formats automatically:
  ```bash
  TexturePacker --format phaser --data assets/spritesheet.json --sheet assets/spritesheet.png raw_frames/*.png
  ```
* **Audiosprite CLI:** Automatically stitches individual `.wav` or `.mp3` sound effects into a single composite audio sprite file accompanied by a JSON timing map, reducing HTTP network requests to a single download.

---

# PART B: CONSTRUCT 3 SCRIPTING & HEADLESS WORKFLOWS

## 5. Official Ecosystem Tools (Construct 3)

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                            OFFICIAL CONSTRUCT 3 AUTOMATION STACK                       │
├─────────────────────────┬──────────────────────────────────────────────────────────────┤
│ Component               │ Core Mechanism & Purpose                                     │
├─────────────────────────┼──────────────────────────────────────────────────────────────┤
│ JavaScript Scripting API│ Hybrid visual event sheets + standard ES6 class scripting    │
│ Addon SDK v2 (r450+)    │ Enforces strict encapsulation, JS modules, and JSON schemas  │
│ Developer Mode          │ Local HTTP server integration for live hot-reload addon tests│
│ Scirra Cloud Export API │ Cloud build infrastructure for mobile & desktop packaging    │
└─────────────────────────┴──────────────────────────────────────────────────────────────┘
```

### 5.1 The JavaScript Scripting API (Hybrid Event Sheets + Code)
Construct 3 evolved from a purely visual block-based engine into a hybrid JavaScript powerhouse:
* **Direct Scripting Integration:** Developers and AI assistants can write standard modern JavaScript (ES6+ / TypeScript) directly inside Construct projects.
* **Unified Classes:** Runtime script classes double as script interface classes. Public properties and methods declared on an instance are immediately addressable from visual event sheets.
* **Runtime API (`runtime.objects`):** Exposes direct manipulation of all active layout instances:
  ```javascript
  runOnStartup(async runtime => {
      runtime.addEventListener("beforeprojectstart", () => OnBeforeProjectStart(runtime));
  });

  function OnBeforeProjectStart(runtime) {
      const player = runtime.objects.Player.getFirstInstance();
      player.x = 400;
      player.y = 300;
      console.log(`[C3 Script] Initialized Player at (${player.x}, ${player.y})`);
  }
  ```

### 5.2 Addon SDK v2 (Enforced in r450+ Main Releases)
In 2025–2026, Scirra completely phased out legacy SDK v1 in favor of **Addon SDK v2**:
* **Strict Encapsulation:** Third-party plugins and behaviors can no longer tamper with unstable internal engine internals via monkey-patching; all communication must go through the official runtime scripting API.
* **JavaScript Module Support:** First-class support for `import` and `export` statements, allowing clean dependency graphs.
* **Validation Schemas:** Every addon is strictly validated against JSON schemas (`aces.json` for Actions, Conditions, Expressions; `addon.json` for metadata), enabling headless CI/CD scripts to validate plugin structures before deployment.

---

## 6. FOSS & Community Open-Source Tooling (Construct 3)

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                       COMMUNITY OPEN-SOURCE TOOLING (CONSTRUCT 3)                      │
├─────────────────────────┬──────────────────────────────────────────────────────────────┤
│ Tool / Repository       │ Architectural Mechanism & Role in Pipeline                   │
├─────────────────────────┼──────────────────────────────────────────────────────────────┤
│ liauw-media/construct3-mcp│ MCP server parsing, editing, and validating .c3proj files  │
│ construct-factory       │ Autonomous factory generating Construct 3 games from prompts │
│ claude-code-plugin-gvt  │ Claude Code skill plugin bundling domain chef MCP servers    │
│ c3project Headless Tools│ Node.js scripts for unpacking/packing .c3p zip archives      │
└─────────────────────────┴──────────────────────────────────────────────────────────────┘
```

### 6.1 `liauw-media/construct3-mcp` (Model Context Protocol for Construct 3)
Because Construct 3 is predominantly browser-based, AI agents traditionally had no structured way to edit projects. The open-source `construct3-mcp` server bridges this gap:
* **Mechanism:** Interacts with Construct 3 projects stored in the **project folder format** (`.c3proj` directory containing modular JSON files for layouts, event sheets, and object types).
* **Capabilities:**
  * **AST & Structure Inspection:** Reads the project schema, validating that object UID references, event condition blocks, and variable types are semantically sound.
  * **Editor-Faithful Writing:** Modifies event sheets and layout object placements while maintaining Construct's strict JSON formatting, including automated project backups.

### 6.2 `ZubeidHendricks/construct-factory`
A higher-level autonomous game factory:
* **Workflow:** Takes high-level game concepts (e.g. "Create a top-down retro tank shooter with 3 enemy types and a high-score tracker"), decomposes the requirements into layouts and event sheets, and calls the underlying MCP server to generate a fully playable Construct 3 project folder ready for export.

### 6.3 Headless Packaging & Unpacking Pipelines
Construct 3 projects can be saved either as a single compressed zip file (`.c3p`) or an expanded folder (`.c3proj`). Community Node.js scripts automate the unpacking of `.c3p` files into clean folders for Git version control and AI agent editing, and repack them for distribution.

---

## 7. Third-Party Standalone Software (Construct 3)

* **Capacitor & Cordova CLI:** For mobile distribution, Construct exports a standard web application project that is compiled into native iOS (Xcode) and Android (Android Studio / Gradle) binaries using `npx cap build` or `cordova build android`.
* **NW.js CLI:** For desktop distribution (Windows, macOS, Linux), Construct packages the web game into a standalone native executable using the NW.js runtime wrapper.

---

## 8. Web Engine Comparison for Agentic Automation

| Dimension | Phaser 3 / 4 Beta | Construct 3 (r450+) |
| :--- | :--- | :--- |
| **Primary Code Paradigm** | Pure TypeScript / JavaScript codebases | Hybrid Visual Event Sheets + JavaScript Classes |
| **Official MCP Support** | **First-Party** (`@phaserjs/editor-mcp-server`) | **Community Open-Source** (`construct3-mcp`) |
| **Project File Transparency** | 100% Plain Code (TS/JS) + JSON Scene files | JSON project folder (`.c3proj`) or zipped `.c3p` |
| **Headless Runtime Testing** | Native `Phaser.HEADLESS` mode in Node.js | Requires Headless Browser (Playwright / Puppeteer) |
| **Git & Version Control** | Flawless, standard Git diffs on source code | Excellent when using `.c3proj` folder mode |
| **Agentic Ergonomics** | Ideal for code-centric LLMs (Claude Code, Cursor) | Ideal for hybrid visual/logic design pipelines |
