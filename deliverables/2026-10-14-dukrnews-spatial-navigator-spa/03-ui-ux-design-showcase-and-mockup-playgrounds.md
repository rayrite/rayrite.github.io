# UI/UX Design Showcase & Mockup Playgrounds

**Date:** 2026-10-14  
**Author:** AI Architecture & UX Engineering Team (incorporating `ux-architect-cooly` & UI Playground)  
**Deliverable Subfolder:** `deliverables/2026-10-14-dukrnews-spatial-navigator-spa/`  
**Deliverable Document:** `03-ui-ux-design-showcase-and-mockup-playgrounds.md`  
**Status:** User-Approved Unified Architecture Baseline  

---

## 1. Executive Overview & User Selection

Following the Matt Pocock requirements interview and tactile evaluation of the UI Playground, the user has selected and approved the consolidation of **"Dual-Mode Hybrid"** and **"Kinetic Columns"** into a single cohesive SPA architecture.

Rather than treating spatial graph exploration and high-velocity feed reading as mutually exclusive modes, the finalized design establishes a **Unified Dual-View Experience**:
1. **Primary View 1: 🌌 Dual-Mode Spatial Canvas:** A full-screen 60 FPS hardware-accelerated interactive canvas that seamlessly morphs between an organic **Force Constellation** and a **Geospatial World Projection**, accompanied by the slide-out **Glassmorphic Intelligence Drawer**.
2. **Primary View 2: 📰 Kinetic Column Wire:** A Bloomberg-inspired multi-column feed featuring a curated story wire, a side-by-side multi-perspective publisher framing comparator (Left / Center / Right), and a **Synchronized Live Floating Entity Radar** that tracks active relationships in real time.

Accompanying this document is the updated, runnable interactive HTML5 application ([`index.html`](file:///d:/stuff/ai-misc/_bsh2026/vscode_project01/46-wide_research_test_gemini/deliverables/2026-10-14-dukrnews-spatial-navigator-spa/index.html)) embodying this exact unified architecture.

---

## 2. Comparative Matrix: 4 Navigation Layout Designs

| Design ID | Layout Archetype | Primary Visual Anchor | Interaction Paradigm | User Verdict | 60 FPS Rendering Demands |
|:---|:---|:---|:---|:---|:---|
| **Design 1** | **Dual-Mode Hybrid** | Seamless Canvas toggle between Force Constellation and 2D/3D Geospatial World Map | Zooming spatial canvas with one-click perspective morphing and synchronized sliding glassmorphic intelligence drawer | **SELECTED & APPROVED** | Moderate WebGL / 2D Canvas pipeline with smooth matrix interpolation |
| **Design 2** | **Cosmic Constellation & Split Drawer** | Free-form 2D/3D N-body force-directed gravitational universe | Physics-based spring layout with node attraction, orbital entity clustering, and pinned focus states | Merged as default mode within Dual-Mode Canvas | QuadTree/Barnes-Hut off-thread Web Worker physics simulation |
| **Design 3** | **Geospatial Globe & Connected Arcs** | Interactive 3D orthographic globe or 2D Robinson projection map | Spatial pin clusters anchored to coordinates with glowing Great-Circle bezier arcs representing international corridors | Merged as sub-mode within Dual-Mode Canvas | Orthographic bezier curve shader pipeline with coordinate culling |
| **Design 4** | **Kinetic Column Feed with Micro-Radar** | Multi-column columnar news stream (Bloomberg / TweetDeck model) | High-speed vertical scanning feed synchronized with an interactive mini force-graph radar in the top HUD | **SELECTED & APPROVED** | Minimal canvas overhead; DOM virtual scrolling with lightweight HUD canvas |

---

## 3. The Unified "Dual-Mode Hybrid + Kinetic Wire" Architecture

```mermaid
graph TD
    subgraph Top HUD Navigation
        LOGO[DukrNews Spatial Navigator]
        SWITCH{{Primary View Switcher}}
        THEMES[Themes: Obsidian | Swiss | Sci-Fi]
    end

    subgraph View 1: Dual-Mode Spatial Canvas
        SUB_TOGGLE[Sub-Toggle: Constellation vs Geospatial]
        CANVAS[WebGL / 2D Canvas Stage: 60 FPS]
        DRAWER[Glassmorphic Intelligence Drawer]
    end

    subgraph View 2: Kinetic Column Wire
        COL1[Column 1: Curated Breaking Story Stream]
        COL2[Column 2: Multi-Perspective Bias Comparison]
        RADAR[Floating Synchronized Micro-Radar]
    end

    subgraph Shared Reactive State
        STATE[(Selected Node & Entity Hop History)]
        DATA[(news-graph-bundle.json: 276 Stories, 4,186 Sources)]
    end

    SWITCH -->|Toggle View| View 1
    SWITCH -->|Toggle View| View 2
    CANVAS <--> STATE
    COL1 <--> STATE
    COL2 <--> STATE
    RADAR <--> STATE
    DRAWER <--> STATE
    DATA --> STATE
```

### 3.1 Primary Layout Wireframes

#### View 1: Dual-Mode Spatial Canvas Screen

```text
+-------------------------------------------------------------------------------------------------------------+
| [DukrNews Spatial]   [ [🌌 Spatial Canvas]  |  [📰 Kinetic Wire] ]   (Sub: Force | Geo)   [Theme: Obsidian] |
+-------------------------------------------------------------+-----------------------------------------------+
|                                                             | [INTELLIGENCE DRAWER]                         |
|   (TOPIC: AI Gaming)             (THING: White House)       | --------------------------------------------- |
|          o                               o                  | FOCUS: Donald Trump                           |
|           \                             /                   | Class: Person | 56 Stories | 420 Sources      |
|            \                           /                    |                                               |
|             (STORY: AI Testing Move)  o                      | BIAS FOOTPRINT:                               |
|                     \               /                       | [Left: 18%] [Center: 44%] [Right: 38%]        |
|                      \             /                        |  ======       ============  ==========        |
|                       * [TRUMP] *                            |                                               |
|                      /           \                          | CONNECTED ENTITY HUBS:                        |
|                     /             \                         | - [Topic] Russian Diesel Pacts (15 stories)   |
|     (PLACE: Kyiv)  o               o (STORY: Diesel Deal)    | - [Place] Washington, DC (46 stories)         |
|                     \             /                         | - [Place] Kyiv, Ukraine (18 stories)          |
|                      \           /                          | - [Thing] White House (13 stories)            |
|            (SOURCE: Times of India - Lean Right)             | --------------------------------------------- |
|                                                             | COVERAGE HEADLINES:                           |
| [PERSPECTIVE CONTROLS]                                      | 1. "Trump defends Russia diesel deal after    |
| (•) Force Constellation   (•) Geospatial World Map          |     bipartisan pushback: 'Right choice'"      |
| [Timeline Slider: 2026-10-12 <========o========> Now]       |     Sources: 8 | High Factuality | Read >     |
+-------------------------------------------------------------+-----------------------------------------------+
```

#### View 2: Kinetic Column Wire with Synchronized Micro-Radar

```text
+------------------------------------------------------------------------------------+------------------------+
| [DukrNews Spatial]   [ [🌌 Spatial Canvas]  |  [📰 Kinetic Wire] ]  [Filter: All]  | [FLOATING RADAR HUD]   |
+-----------------------------------+------------------------------------------------+                        |
| COLUMN 1: TOP HARVESTED STORIES   | COLUMN 2: MULTI-PERSPECTIVE SOURCE BREAKDOWN   |         (P)            |
+-----------------------------------+------------------------------------------------+        /   \           |
| [11:47] Donald Trump defends      | TIMES OF INDIA [Lean Right | Mixed]            |      (S)---(T)         |
| Russian diesel imports after      | "Trump defends Russia diesel deal: America 1st"|        \   /           |
| bipartisan Senate backlash        |                                                |         (L)            |
| Sources: 8 | Bias: Lean Right     | ABC NEWS [Center | High]                       | [Active: 12 Nodes]     |
| Entities: Trump, Zelenskyy, Kyiv  | "Bipartisan anger mounts over Russian imports" | ---------------------- |
| --------------------------------- |                                                | SHARED DRAWER:         |
| [11:32] Epic Games delays Disney  | BLOOMBERG [Center | High]                      | Whichever story is     |
| video game to inject more AI tools| "Epic postpones unannounced Disney shooter..." | selected updates both  |
| Sources: 12 | Bias: Center        |                                                | the Radar and the      |
| Entities: Epic, Disney, Schreier  | IGN [Lean Left | High]                         | Side Intelligence      |
| --------------------------------- | "AI-first mandate causes delay on Star Wars..."| Drawer simultaneously. |
| [10:15] Michael Jordan 1998 jersey| SOTHEBY'S OFFICIAL RELEASE                     |                        |
| smashes record with $14M auction  | "Historic Last Dance jersey reaches record..." |                        |
+-----------------------------------+------------------------------------------------+------------------------+
```

---

## 4. Visual Aesthetic Theme Specifications

| Aesthetic Persona | Color Palette Tokens | Visual Vibe & Polish | Typography Pairing | Target Psychological Response |
|:---|:---|:---|:---|:---|
| **Theme 1: Obsidian Cyber-Radar** *(Recommended)* | Base: `#090D16`<br/>Surface: `#111827`<br/>Left: `#06B6D4`<br/>Center: `#8B5CF6`<br/>Right: `#EF4444`<br/>Border: `#1F2937` | Sleek dark obsidian slate, glassmorphic backdrop-blur, luminescent node halos, pulsing neon connection lines | Display: *Outfit / Inter* (Geometric Sans)<br/>Data/Code: *JetBrains Mono / Fira Code* | High-tech command center, immersive, sophisticated, authoritative |
| **Theme 2: Swiss Editorial Minimalist** | Base: `#0F1115`<br/>Surface: `#181B20`<br/>Accent: `#E2E8F0`<br/>Border: `#2D323B`<br/>Subtle Bias: Pastels | Stark monochrome elegance, high-contrast crisp line weights, clean architectural grid lines, zero blur gimmicks | Display: *Newsreader / Playfair Display* (Editorial Serif)<br/>Body: *Geist / Inter* | Thoughtful journalistic rigor, calm clarity, distraction-free analysis |
| **Theme 3: Sci-Fi Planetary Observatory** | Base: `#050811`<br/>Nebula: `#0C1A30`<br/>Grid: `#0EA5E922`<br/>Entities: Neon Amber, Cyan, Magenta | Holographic HUD, animated orbital reticles, starfield particle dust, glowing telemetry gauges | Display: *Space Grotesk / Orbitron*<br/>Data: *Share Tech Mono* | Wonder, futuristic data exploration, sci-fi intelligence terminal |

---

## 5. Interaction Synchronization Across Views

1. **State Coherence:** The active selection state is single-sourced:
   - Selecting a story in the **Kinetic Column Wire** immediately populates its political perspectives, updates the **Micro-Radar**, and pre-stages the **Intelligence Drawer**.
   - Clicking `[🌌 Spatial Canvas]` instantly flies the camera to that story node without resetting user context.
2. **Entity Hop in Both Views:**
   - In **Spatial Mode**, clicking a connected entity tag glides the canvas camera to that entity.
   - In **Kinetic Mode**, clicking a connected entity tag filters the story feed to all stories mentioning that entity (e.g. clicking *Volodymyr Zelenskyy* filters the feed to Ukrainian energy and defense stories).
3. **Perspective Morphing:**
   - In **Spatial Mode**, clicking `Geospatial World` triggers a 750ms cubic-bezier transition, aligning geocoded news nodes to latitude/longitude world coordinates and generating flight arcs between international hubs.
