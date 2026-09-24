# Project ZENITH — Implementation Plan
### An “Art of Balance”-style physics stacking game in Unity 6 (C#)

| | |
|---|---|
| **Document version** | 1.0 |
| **Engine assumption** | Unity 6 (6000.x editor line; substitute your exact patch, e.g. 6000.0.x) |
| **Render pipeline** | Universal Render Pipeline (URP) |
| **Input** | New Input System package (no legacy Input Manager) |
| **Physics** | Built-in PhysX (Unity 6 default) |
| **Working title** | “Project ZENITH” (placeholder — do **not** ship with any reference to the original trademark) |

> **Scope statement.** This plan recreates the *mechanics and feel* of the original WiiWare game (minimalist physics stacking, pointer-based placement, zen presentation) and then layers on the gameplay variations introduced by later ports (3DS TOUCH!, Wii U, PlayStation 4, Nintendo Switch). All art, audio, naming, and UI layout must be original; mechanics and design patterns are what we are recreating.

---

## Table of Contents

1. [Game Overview & Design Pillars (Original WiiWare)](#1)
2. [Tech Stack & Project Setup](#2)
3. [Core Architecture](#3)
4. [Physics Foundation (Deep Dive)](#4)
5. [Piece System — Shapes, Meshes, Colliders](#5)
6. [Input & Object Manipulation — Recreating the Wii Feel](#6)
7. [Core Gameplay Loop (WiiWare Arcade)](#7)
8. [Visual Recreation (WiiWare Look)](#8)
9. [Audio Design](#9)
10. [UI / HUD](#10)
11. [Puzzle / Campaign Framework (cross-cutting system)](#11)
12. [Port Deep Dives](#12)
    - 12.1 [3DS “TOUCH!”](#121)
    - 12.2 [Wii U](#122)
    - 12.3 [PlayStation 4](#123)
    - 12.4 [Nintendo Switch](#124)
    - 12.5 [Modern consolidated feature set (campaign / time attack / versus / leaderboards)](#125)
13. [Platform Services Abstraction Layer](#13)
14. [Performance Targets & Optimization](#14)
15. [Save, Progression & Settings](#15)
16. [Tools & Content Pipeline](#16)
17. [Testing Strategy](#17)
18. [Production Plan & Milestones](#18)
19. [Risks & Mitigations](#19)
20. [Appendices](#20) — Sample code, physics tuning table, control matrix, mode matrix

---

<a name="1"></a>
## 1. Game Overview & Design Pillars (Original WiiWare)

**Concept.** The player uses a screen pointer to grab falling-in-sequence objects and stack them into an ever-growing tower. Every placed object must come to rest and *stay* balanced. The camera slowly rises as the tower grows. Any collapse ends the run. The tone is calm, meditative, and minimalist — a “zen physics toy,” not an action game.

**Design pillars:**

| Pillar | What it means in practice |
|---|---|
| **Physical honesty** | No fake physics. If it looks unstable, it *is* unstable. Simulation is the antagonist and the toy. |
| **Precision placement** | Held objects track the pointer 1:1 on a fixed depth plane; release imparts a small, readable throw velocity. |
| **Calm presentation** | Soft gradients, matte objects, gentle audio, almost no camera shake, no aggressive UI. Tension comes from physics alone. |
| **Readable silhouettes** | Every piece shape must be instantly identifiable at a glance; beveled edges, flat shading, high contrast vs. background. |
| **Short loops, long sessions** | One placement = one 5–15 second micro-loop. Runs last minutes; “one more try” pressure is constant. |

**Feature set of the original WiiWare build we must ship first (v1.0 “Classic” scope):**

1. Endless / Arcade stacking mode (single pointer input).
2. Weighted piece spawning with difficulty ramp (boxes → planks → cylinders → wedges → L/T beams → spheres).
3. Settle detection, scoring, lives (dropped pieces), collapse = game over.
4. Rising camera with fixed horizontal framing.
5. Two-player alternating mode (shared tower, shared input device on Wii; abstracted for our platforms).
6. Theme/color progression as height increases.
7. Minimal HUD, menus, results, local high scores.

Everything in Sections 11–12 is additive on top of this core.

---

<a name="2"></a>
## 2. Tech Stack & Project Setup

### 2.1 Packages (Unity Package Manager)

| Package | Purpose |
|---|---|
| `com.unity.render-pipelines.universal` | Rendering + post-processing |
| `com.unity.inputsystem` | All input (mouse, touch, gamepad, gyro) + `EnhancedTouch` |
| `com.unity.cinemachine` | Optional camera damping helpers (we will mostly use a custom rig) |
| `com.unity.test-framework` | EditMode/PlayMode tests |
| `com.unity.ui` (UI Toolkit) | Menus/HUD (preferred over uGUI for resolution scaling + localization) |
| `com.unity.addressables` | Per-theme art bundles (helpful on console memory budgets) |
| `com.unity.collections` / `jobs` | Only if needed for contact-graph or VFX batching later |

### 2.2 Project settings decisions

- **Color space:** Linear. **Gamma workflow is not acceptable** for the soft-gradient look.
- **Physics:** PhysX (default in Unity 6). See Section 4 — stacking quality depends entirely on tuning here.
- **Fixed timestep:** `0.02` (60 Hz) baseline; never raise it. If perf allows on desktop/console, keep 60 Hz and raise solver iterations instead of lowering the step.
- **URP asset:** one per quality tier (see Section 14): `URP_Desktop_High`, `URP_Console_Base`, `URP_Handheld`.
- **Target frame rate:** 60 FPS everywhere (physics feel depends on it).

### 2.3 Folder layout

```
Assets/_Project/
├─ Art/
│  ├─ Meshes/            # Beveled piece meshes, pedestal, anchors
│  ├─ Materials/
│  ├─ Shaders/           # Shader Graph: background gradient, piece rim-light
│  ├─ VFX/
│  └─ Themes/            # Palette LUTs, per-theme sprites
├─ Audio/
│  ├─ Music/  Ambience/  SFX/  Mixers/
├─ Code/
│  ├─ Core/              # GameStateMachine, ModeController base, Scoring, Rules
│  ├─ Pieces/            # PieceDefinition, PieceInstance, Spawner, Pool
│  ├─ Manipulation/      # PlacementRig, HeldPiece, RotationDriver, DropGuide
│  ├─ PhysicsTools/      # SettleDetector, ContactGraph, InstabilityProbe, SleepManager
│  ├─ Camera/            # TowerCameraRig, KillPlaneFollower
│  ├─ Input/             # IPointerSource impls, ActionMaps, VirtualCursor
│  ├─ Modes/             # ArcadeMode, PuzzleMode, TimeAttackMode, VersusMode
│  ├─ Objectives/        # Objective SOs + evaluation
│  ├─ Platform/          # IPlatformServices + per-platform impls/stubs
│  ├─ Save/
│  └─ UI/
├─ Data/                 # ScriptableObjects: Pieces/, Levels/, Themes/, ModeConfigs/
├─ Scenes/               # Boot, Menu, Game, LevelTest, PerfTest
└─ Settings/             # URP assets, InputActionAssets, PhysicsMaterial presets
```

### 2.4 World conventions (lock these early — everything depends on them)

| Convention | Value |
|---|---|
| Tower grows along | **+Y** |
| Camera looks along | **+Z** (camera sits at negative Z) |
| Placement plane | `z = 0` |
| Depth slab (invisible walls) | `z = ±0.75 m` static planes |
| Base pedestal | static collider at `y = 0`, width ≈ 3 m |
| Units | 1 unit = 1 meter; pieces 0.4–4 m |

> The **depth slab** is the single most important “invisible trick” for recreating the original feel: the original plays like a 2.5D game. Pieces are placed on a plane and shallow invisible walls prevent the tower from drifting in Z, while still allowing full 3D toppling in X/Y.

---

<a name="3"></a>
## 3. Core Architecture

### 3.1 High-level diagram

```
                    ┌────────────────────────────┐
                    │        GameManager         │  (boot, scene flow, services)
                    └─────────────┬──────────────┘
                                  │
                    ┌─────────────▼──────────────┐
                    │      ModeController        │  Arcade | Puzzle | TimeAttack | Versus
                    └──┬──────┬───────┬──────┬───┘
                       │      │       │      │
        ┌──────────────▼┐  ┌──▼─────┐ ┌▼──────▼────────┐
        │ PieceSpawner  │  │ Rules/ │ │ Objectives     │
        │ (weighted)    │  │ Scoring│ │ (puzzle only)  │
        └──────┬────────┘  └────────┘ └────────────────┘
               │
   ┌───────────▼─────────────────────────────────────────────┐
   │ PieceInstance  =  Rigidbody + Colliders + SettleDetector │
   │                 + HeldPiece + InstabilityProbe + Visual  │
   └───────────┬─────────────────────────────────────────────┘
               │ manipulated by
   ┌───────────▼────────────┐     ┌──────────────────────┐
   │ PlacementRig + Input   │     │ TowerCameraRig +      │
   │ (pointer abstraction)  │     │ ThemeSystem + VFX/SFX │
   └────────────────────────┘     └──────────────────────┘
```

### 3.2 Primary types

- `GameStateMachine` — states: `Boot → MainMenu → ModeSelect → Gameplay → Paused → Results`.
- `ModeController` (abstract) — owns the per-mode loop, subscribes to `PieceSpawner`, `SettleDetector`, `ScoringService`, `ObjectiveEvaluator`. Concrete: `ArcadeModeController`, `PuzzleModeController`, `TimeAttackModeController`, `VersusModeController`.
- `GameContext` — per-run read model passed to objectives/UI: `HighestSettledY`, `PieceCount`, `SurvivalTimer`, `Lives`, `CurrentPlayer`.
- `RuleConfig` (SO) — lives, drop penalty, collapse policy, score table. Tunable per mode without code changes.
- `IPointerSource` / `IRotateSource` — input abstraction (Section 6 & 13). **No gameplay code ever reads device APIs directly.**

### 3.3 Event flow for one placement (the atomic loop)

```
Spawner.RequestNext() → piece appears at hover point (kinematic, gently bobbing)
Player grabs (IPointerSource.IsHeld) → HeldPiece.Attach()
Player aims (fixed updates) → PlacementRig.DriveHeldPiece(...)
Player releases → HeldPiece.Detach(maxThrowSpeed) → free Rigidbody
SettleDetector watches velocity → OnSettled → ScoringService.Award()
                                   → OnFailedToSettle / fell past KillPlane → Rules.LoseLife()
CameraRig re-evaluates HighestSettledY → rises smoothly
Spawner.RequestNext() … repeat
```

---

<a name="4"></a>
## 4. Physics Foundation (Deep Dive)

Stacking games live or die by solver stability. Treat this section as the first milestone gate: **if stacking feels jittery, nothing else matters.**

### 4.1 Project Settings → Physics (defaults to ship)

| Setting | Value | Why |
|---|---|---|
| Fixed Timestep | `0.02` | Baseline stability/cost. Never raise. |
| Max Allowed Timestep | `0.05` | Prevent spiral-of-death on hitches. |
| Solver Type | **TGS** (Temporal Gauss–Seidel) | Better convergence for stacked contact chains than PGS. |
| Default Solver Iterations | **12** (tune 8–20) | Kills micro-jitter between stacked flat faces. |
| Default Solver Velocity Iterations | 4 | |
| Default Contact Offset | `0.005` | Tighter contacts, crisper resting. |
| Sleep Threshold | `0.005` | Default; raising it freezes swaying towers too early. |
| Bounce Threshold | `2` | Combined with zero-bounce materials → no micro-bounces. |
| Reuse Collision Callbacks | ✔ | Reduces GC in OnCollision handlers. |
| Layer matrix | `Piece ↔ Piece`, `Piece ↔ Static`, `Piece ↔ KillTrigger` only | No wasted pairs. |

### 4.2 Materials

One shared `PhysicMaterial` for all pieces and statics:

| Property | Value |
|---|---|
| Dynamic friction | `0.9` |
| Static friction | `1.0` |
| Bounciness | `0` |
| Friction combine | **Maximum** |
| Bounce combine | Minimum |

> High friction is essential: the original game’s towers feel “grippy,” not icy. If spheres/cylinders feel uncontrollable, tune *per-piece* friction (never below 0.7) before touching solver settings.

### 4.3 Rigidbody defaults per piece

| Property | Value |
|---|---|
| Mass | Derived: `rb.SetDensity(def.density)` after colliders exist |
| Interpolation | **Interpolate** (mandatory for smooth visuals at 60 Hz rendering) |
| Collision detection | Discrete (held pieces are kinematic, so CCD is unnecessary) |
| `maxDepenetrationVelocity` | `4` | Prevents explosive corrections when the player jams pieces together |
| Angular damping | `0.05` | Tiny air resistance; keeps toppling natural |
| Constraints | None |

**Mass-ratio rule:** keep contacting bodies within ~10:1 mass ratio. Clamp densities in the piece catalog (Section 5) so a 4 m plank can’t be 30× heavier than a cube.

### 4.4 Stability & settling

- `SettleDetector` (per piece, code in Appendix B): piece is *settled* when `|v| < 0.06 m/s` and `|ω| < 3°/s` for **0.9 s** continuous. Hard timeout at 6 s → treated as “never settled” (piece is wobbling forever → counts as failed placement only in strict puzzle rules; in arcade it settles on timeout if in contact with the tower).
- `InstabilityProbe` (per awake piece, cheap heuristic): `instability = k1·|ω| + k2·COM offset beyond support contacts`. Drives the red warning tint + audio cue (Section 8.6).
- `SleepManager`: every 0.5 s, force-sleep (`rb.Sleep()`) any settled piece whose AABB is more than 3 m below the camera’s bottom frustum edge. Sleeping bodies are nearly free; awake contact islands are the real cost.
- **Never make old tower pieces kinematic** — it changes mass to “infinite” and breaks the feel of later placements rocking the tower. Sleep them instead.

### 4.5 Determinism & replays

PhysX is not bitwise-deterministic across platforms. Therefore:

- Ghost/replay features (Section 12.1) record **placement records** (`pieceId, position, rotation, timestamp`) and re-execute them, not raw solver state.
- Daily-challenge modes (Section 12.5) use a seeded piece RNG only — physics outcomes are *not* compared across machines, only scores.

### 4.6 Physics tuning checklist (definition of “feels right”)

- [ ] Stack of 6 cubes rests motionless for 60 s (no drift > 1 mm).
- [ ] Plank balanced on a cube edge holds for ≥ 2 s if placed carefully.
- [ ] Dropping a cube from 3 m does not tunnel or jitter on landing.
- [ ] Grabbing/releasing never injects visible energy spikes.
- [ ] 40-piece tower at 60 FPS on target hardware (Section 14).

---

<a name="5"></a>
## 5. Piece System — Shapes, Meshes, Colliders

### 5.1 Piece catalog (v1.0)

| ID | Shape | Collider strategy | Tier | Notes |
|---|---|---|---|---|
| `cube` | 1×1×1 box | BoxCollider | Basic | The workhorse |
| `brick` | 2×1×1 box | BoxCollider | Basic | |
| `plank` | 3×0.4×1 box | BoxCollider | Basic | Bridge builder |
| `column` | 0.7×2×0.7 box | BoxCollider | Basic | Height generator |
| `longplank` | 4×0.2×0.8 box | BoxCollider | Intermediate | Seesaw hazard |
| `cylinder` | r0.5 × h1 | CapsuleCollider (cheap) or convex | Intermediate | Rolls — placement risk |
| `wedge` | Triangular prism 1×1×1 | Convex mesh collider | Intermediate | Deflects stacks |
| `lbeam` | L-shape 2×2×0.6 | 2 BoxColliders (compound) | Advanced | Hooks over edges |
| `tbeam` | T-shape 2.4×1.4×0.6 | 2 BoxColliders (compound) | Advanced | |
| `sphere` | r0.5 | SphereCollider | Expert | Only placeable on flats/cradles |
| `halfpipe` | Half-cylinder trough | Concave mesh (static-only? No →) convex decomposition, 3 hulls | Expert | Cradle for spheres; advanced content |
| `arch` | Arch block | Convex decomposition, 2–3 hulls | Expert | Cosmetic/structural variation |

Rules:

- **Compound primitives over mesh colliders** wherever possible (boxes/spheres/capsules are faster and more stable).
- Convex hulls only for L/T/wedge/arch shapes; keep hull count ≤ 3, inflation ≤ 0.01.
- Every visual mesh gets **beveled edges** (0.02–0.05 m chamfer) — this is the defining silhouette trait of the original look, and it also reduces perfectly-edge-on-edge solver degeneracy.

### 5.2 PieceDefinition (ScriptableObject)

See Appendix B.1. One asset per shape; fields: id, tier, material type (SFX/VFX), density, visual mesh, collider setups, spawn weight, allowed spawn rotations.

### 5.3 Spawning & difficulty ramp

- `PieceSpawner` draws from a weighted pool: `weight(def) = def.weightInPool × rampCurve(def.tier, piecesPlaced)`.
- `ModeConfig.rampCurve` — AnimationCurve per tier; e.g. Expert tier weight is 0 for pieces 0–10, ramps to full by piece 30.
- Spawn position: unproject the **top-center of the placement plane frustum** → piece hovers there with a slow 0.1 m sine bob until grabbed.
- **Next-piece preview:** small 3D thumbnail rendered by a second ortho camera into a UI RawImage (top corner). Configurable per mode (Puzzle shows the full ordered queue; Arcade shows the next 1).

---

<a name="6"></a>
## 6. Input & Object Manipulation — Recreating the Wii Feel

The original’s feel = **direct pointer control on a plane, with a small honest throw on release.** Reproduce that exactly, then adapt the *source* of the pointer per platform.

### 6.1 Pointer abstraction

```
IPointerSource           → ScreenPosition, IsHeld, WasReleasedThisFrame, ScrollDelta
 ├─ MousePointerSource          (Desktop)
 ├─ TouchPointerSource          (3DS-style, Wii U GamePad, Switch handheld)
 ├─ VirtualCursorPointerSource  (Gamepad: left stick drives a reticle)
 └─ (platform-specific plugins can add more later)
```

The `ManipulationManager` consumes exactly one active `IPointerSource` at a time. Switching sources at runtime (e.g., a Switch player docks and grabs a controller) is automatic via last-active-device detection (Section 12.4).

### 6.2 Held-piece behavior

- On grab: `rb.isKinematic = true`, zero velocities, snap z to 0.
- Each FixedUpdate: ray from camera through pointer → intersect plane `z=0` → clamp to play bounds (Rect in world units, derived from camera frustum minus margins) → `MovePosition` with exponential smoothing (`k ≈ 18`). This gives the slightly-floating, non-instant tracking of the original.
- Track smoothed frame-to-frame velocity; on release: `isKinematic=false`, `linearVelocity = clamp(smoothedVelocity, 3 m/s)`. The clamp matters — wild flicks must not become cannon shots.
- While held: subtle cosmetic tilt toward movement direction (≤ 6°, visual-only, via local rotation of the mesh child, **not** the Rigidbody). This sells the “floating object” feel.

### 6.3 Rotation

Original behavior: rotate the held object around the **screen-facing axis (world Z)** in continuous or stepped increments. Implement `RotationDriver`:

- Desktop: mouse wheel or `R`/`T` keys.
- Touch: on-screen ⟲/⟳ buttons (hold = continuous, tap = 45° step). Optional two-finger twist gesture (Appendix B.4).
- Gamepad: `RB`/`LB` (continuous while held; tap = 45° step).
- Advanced (puzzle levels only): optional Y-axis rotation via a modifier key/second stick — off by default, since the depth slab makes yaw mostly cosmetic.

### 6.4 Drop Guide (accessibility & modern QoL)

Raycast straight down from the held piece’s lowest collider point; render a thin dashed line to first hit + a soft ellipse “landing shadow” blob decal. **Toggleable**, default ON in Puzzle mode, OFF in Arcade (to preserve original difficulty).

### 6.5 Play bounds & kill plane

- Play bounds: derived from camera frustum at `z=0`; pieces cannot be dragged outside.
- `KillPlane` (trigger) follows the camera: `y = cameraY − halfViewHeight − 2`. Crossing it with an *unsettled* piece = dropped (−1 life). Crossing it with a *settled/scored* piece = **collapse** (Section 7.3).

---

<a name="7"></a>
## 7. Core Gameplay Loop (WiiWare Arcade)

### 7.1 Mode rules (RuleConfig defaults for Arcade)

| Rule | Value |
|---|---|
| Lives | 3 (dropping the *current* piece costs 1) |
| Collapse policy | Any **scored** piece leaves the tower → run ends |
| Settle requirement | 0.9 s calm (Section 4.4) |
| Throw speed clamp | 3 m/s |
| Score table | See 7.4 |

### 7.2 State machine (per run)

```
READY ──grab──► HELD ──release──► FALLING ──calm──► SETTLED ──► SCORE
  ▲                                                        │
  │                                   fell / timeout       ▼
  └────────────── next piece ◄──────────────────── RESOLVE
                                         │
                                         ├─ drop  → lives−1 (lives=0 → GAMEOVER)
                                         └─ scored piece lost → GAMEOVER
```

Camera rise runs concurrently with RESOLVE (never blocks input for the next piece longer than 0.3 s).

### 7.3 Collapse detection

A scored piece is “lost” if:

1. It crosses the KillPlane, **or**
2. Its `y` falls more than `1.5 m` below its recorded settle height.

On collapse: brief slow-motion (`timeScale 0.4` for 0.8 s — the one exception to the “stay calm” rule), camera holds, debris falls into the void with splash VFX, then Results.

### 7.4 Scoring (tunable in RuleConfig)

| Event | Points |
|---|---|
| Piece settles | +100 |
| Risky placement bonus | +50…+150 (inverse of contact-area heuristic: few contact points = riskier) |
| Risk combo | ×1.0 → ×2.0 for consecutive risky placements |
| Height milestone (every 5 m) | +250 |
| Endless record break | banner + chime |

Local leaderboard entries: `{mode, score, pieces, heightM, date}`.

### 7.5 Two-player alternating mode (original WiiWare 2P)

- Shared tower, shared camera, **alternating turns** after every successful settle.
- Each player has 3 lives; a dropped piece costs the *active* player a life and passes the turn.
- If the tower collapses, the player whose placement caused it loses immediately.
- Implementation: `TurnManager` wraps the state machine — swaps `CurrentPlayer`, swaps input source if two devices are present (relevant on Switch, Section 12.4), tints held-piece rim color to player color (P1 blue / P2 orange).

### 7.6 Difficulty ramp (Arcade)

Driven by `piecesPlaced`:

| Pieces | Pool change | Ambient change |
|---|---|---|
| 0–10 | Basic tier only | Theme A (dawn pastels) |
| 11–25 | + Intermediate | Theme B |
| 26–45 | + Advanced | Theme C |
| 46+ | + Expert (spheres, halfpipes) | Theme D (dusk) |

Theme transitions are 4-second gradient crossfades (Section 8.3).

---

<a name="8"></a>
## 8. Visual Recreation (WiiWare Look)

### 8.1 Art direction summary

- Full-screen **vertical gradient background** with slow hue drift; no skyboxes with detail.
- **Matte, slightly rubbery objects**, soft rim light, no hard speculars.
- **Soft directional shadow** as the only strong grounding cue.
- Subtle bloom, vignette, film grain ≤ 0.05. UI is thin, small, uppercase-tracked sans-serif.
- The void below is implied, never shown — pieces fall into gradient and splash particles.

### 8.2 Rendering stack (URP)

| Element | Implementation |
|---|---|
| Renderer | URP Renderer with: Bloom, Vignette, Color LUT (per theme), FXAA/SMAA on console, MSAA 4× on desktop |
| Lighting | One directional light (shadow distance 20 m, 2048 atlas, soft), one low-intensity fill, ambient from gradient |
| Background | Camera-aligned quad at far plane with Shader Graph gradient (3 stops + subtle vertical noise + `hueDriftSpeed`) — **not** a skybox, so it stays perfectly flat and calm |
| Piece shader | Shader Graph “URP Piece”: base color from palette index, smoothness 0.15, Fresnel rim (intensity 0.15, tint = theme accent), optional instability tint layer (Section 4.4) |
| Pedestal/anchors | Same piece shader, muted palette entry |
| Depth slab walls | No visual; debug gizmo only |

### 8.3 Theme system

`ThemeDefinition` SO (Appendix B.6): sky gradient stops, piece palette (6–8 colors), pedestal color, fog tint, ambient loop, hue drift speed, LUT.

`ThemeDirector`:

- Arcade: crossfade to next theme at height milestones (Section 7.6). Crossfade = 4 s lerp of all material property block values + audio crossfade.
- Puzzle: fixed theme per level (from `LevelDefinition`).

### 8.4 VFX list (all subtle)

| Event | Effect |
|---|---|
| Landing | Small dust puff scaled by impact impulse; 2–6 soft particles |
| Settle confirmed | Tiny sparkle ring at contact, 0.2 s |
| Piece lost / collapse debris hits void | Soft “water” splash particle burst + expanding ripple decal at kill-plane depth, far below camera |
| Height milestone | Slow rising light motes (ambient, non-distracting) |
| Grab/release | None (keep it clean) — audio only |

### 8.5 Camera presentation

- `TowerCameraRig` (Appendix B.5): fixed `z = -14`, FOV 40, horizontal position **locked to x=0** (the original never pans sideways), vertical SmoothDamp toward `highestSettledY + 2.2 m`, max rise speed 4 m/s.
- Framing: tower top kept at ~65% screen height; upper 35% is reserved for incoming pieces.
- No shake. No FOV punch. Slight ease when crossing theme boundaries only.

### 8.6 Feedback layer

- Instability tint: piece shader exposes `_DangerTint`; `InstabilityProbe` lerps it 0→1; combined with a very soft low drone SFX (Section 9).
- Player-color rim in 2P (Section 7.5).
- Drop guide (Section 6.4) in matching theme accent color at 20% opacity.

---

<a name="9"></a>
## 9. Audio Design

### 9.1 Mixer routing

```
Master
 ├─ Music (ducked −3 dB during collapse only)
 │   └─ Ambience layers (per theme, crossfaded by ThemeDirector)
 ├─ SFX
 │   ├─ Pieces (grab tick, rotate click, impact thud, scrape)
 │   ├─ UI (hover, select, back)
 │   └─ Events (settle chime, milestone chime, splash, collapse rumble)
```

### 9.2 Piece SFX rules

- Impact sound chosen by `PieceMaterialType` (wood/stone/rubber/ice families), **pitch randomized ±5%**, volume mapped to impact impulse (`Collision.relativeVelocity`), capped so loud crashes stay gentle.
- Scrape loop on sustained contact + tangential velocity (one shared voice pool, max 4).
- The “settle chime” is the emotional reward: a soft pentatonic pluck; pitch ascends the combo ladder. This single sound carries the dopamine of the whole loop — budget real time for it.

### 9.3 Music

- Generative-feeling ambient bed: 2 layered loops per theme + sparse melodic stingers triggered by milestones (never on a fixed grid, to avoid feeling mechanical).
- Original-style calm electronica/organic hybrid; must be fully original composition.

---

<a name="10"></a>
## 10. UI / HUD

### 10.1 Style guide

- Font: light geometric sans (licensed/open, e.g. an Inter/Manrope-class face), uppercase, wide tracking, 60–80% white.
- UI Toolkit (USS) with safe-area padding; all touch targets ≥ 48 dp (console/3DS/Wii U/Touch requirement).
- Menus animate with 200 ms fades only. No bouncy game-y motion.

### 10.2 HUD (Arcade)

```
┌────────────────────────────────────────────┐
│  ⬤⬤⬤ lives          STACKED 27            │
│                     HEIGHT 8.4 m           │
│                        [next piece thumb]  │
│                                            │
│                 (tower area)               │
│                                            │
│  (2P: P1/P2 turn indicator, player colors) │
└────────────────────────────────────────────┘
```

### 10.3 Screens

- **Main menu:** logo, Play, Modes, Options, Credits — over a live ambient scene (slow auto-stacking attract-mode demo tower).
- **Results:** score breakdown table, best score, retry/menu, screenshot-friendly composition (console capture buttons will hit this screen constantly).
- **Pause:** resume, restart, options (incl. drop guide, rotation style, rumble), quit.
- **Level select** (Puzzle): world map grid, stars, par info — built in Section 11 work.

---

<a name="11"></a>
## 11. Puzzle / Campaign Framework (cross-cutting system)

This is the biggest addition the ports brought (originating with the 3DS “TOUCH!” release and expanded on PS4/Switch). Build it as one generic framework consumed by all later content.

### 11.1 LevelDefinition (ScriptableObject)

| Field | Purpose |
|---|---|
| `worldId`, `index`, `displayName` | Progression placement |
| `theme` | ThemeDefinition reference |
| `basePreset` | Pedestal + static **anchors**: pillars, floating platforms, ramps, gaps (serialized transforms + collider shapes) |
| `pieceSequence` | Ordered list of PieceDefinitions (puzzle) **or** bag + count (semi-open levels) |
| `objectives[]` | 1–3 Objective SOs (AND-combined) |
| `starPar` | `{threeStarPiecesUsed, threeStarSeconds}` |
| `modifiers[]` | Optional: wind zones, moving anchors, breakable supports, no-drop-guide-off |

### 11.2 Objective types (v1.0 set)

| Objective | Completion check |
|---|---|
| `ReachHeightObjective` | `highestSettledY ≥ target` |
| `SurviveTimeObjective` | tower intact for N seconds after last required piece settles |
| `PlaceAllPiecesObjective` | all sequence pieces settled, none lost |
| `ConnectZonesObjective` | BFS over the live **contact graph** from any piece touching Zone A reaches a piece touching Zone B (bridge building) |
| `DeliverPieceObjective` | a *marked* piece (glowing rim) ends settled inside a goal trigger volume |

`ContactGraph` implementation: maintain per-frame adjacency from `OnCollisionStay` contacts (piece↔piece and piece↔zone triggers); BFS runs only on objective-relevant frames (when a new settle fires). Cheap and robust. See Appendix B.7 for the interface.

### 11.3 Stars & flow

- ★★★: beat both pars (pieces used ≤ par AND time ≤ par)
- ★★: beat one par
- ★: level complete
- Retry is instant (no fade > 0.3 s) — puzzle games live and die by retry friction.

### 11.4 Tooling

Custom Editor window “Level Workbench”: pick/create LevelDefinition → scene gizmo placement for anchors/zones → piece sequence editor (drag from piece catalog) → **Test** button boots `Scenes/LevelTest` with that level and debug harness (spawn any piece, slow-mo, contact visualization, insta-win). Target: a designer can author and verify a level in under 20 minutes.

---

<a name="12"></a>
## 12. Port Deep Dives

> **Licensing reality check.** Unity cannot build actual Wii U / 3DS / PS4 / Switch binaries without the respective first-party SDKs and registered developer status. The sections below therefore specify (a) the *feature sets* those ports introduced, and (b) exactly how each feature is implemented in our Unity codebase so it is testable on PC today and lights up automatically when a platform plugin is dropped in later.

<a name="121"></a>
### 12.1 3DS “TOUCH!” (the touch + puzzle origin)

**What the port introduced:** fully touch-driven controls, the puzzle/campaign mode, StreetPass-style ghost sharing, stereoscopic presentation.

**Implementation:**

1. **Touch control scheme** (`TouchPointerSource`):
   - **Relative drag**: the piece follows finger *deltas*, not absolute position (finger never covers the piece). Sensitivity 1.0, user-adjustable 0.5–1.5.
   - On-screen ⟲/⟳ buttons (bottom corners), tap = 45°, hold = continuous.
   - Optional two-finger twist → rotation (Appendix B.4 math).
   - EnhancedTouch (`com.unity.inputsystem.EnhancedTouch`) for touch history/smoothing.
2. **Puzzle mode** → Section 11 framework; the 3DS-era campaign is the content template: short levels (3–8 pieces), single objective, generous par.
3. **Ghost towers** (StreetPass analogue):
   - Record `PlacementRecord { pieceId, pos, rot, t }` per settle into a JSON run file.
   - Save to `Application.persistentDataPath/ghosts/` locally; expose `IGhostService.Exchange()` so a future online layer can swap ghost files between players.
   - Replay: spawn ghost pieces on a dedicated `Ghost` layer (no collision with real pieces), translucent material (40% opacity, theme accent), timed from record timestamps, playing alongside the live run at 30% visual weight.
4. **Session design:** every mode must be pausable/resumable within 2 seconds (handheld DNA). Save mid-run state for Puzzle and Arcade (Section 15).

<a name="122"></a>
### 12.2 Wii U

**What the port introduced:** GamePad-touch-first play, Off-TV play, pointer lineage from the Wii version, social sharing hooks.

**Implementation:**

1. **GamePad touch** = identical pipeline to 12.1 (`TouchPointerSource`), larger canvas; UI safe areas from `Screen.safeArea`.
2. **Off-TV play emulation:** Unity multi-display — `Display.displays[1].Activate()` with a settings toggle “Play on second screen.” On real hardware the platform plugin maps the GamePad screen; our code only ever asks `IDisplayService.Primary/Secondary`.
3. **Pointer parity:** keep `MousePointerSource` and `VirtualCursorPointerSource` fully equivalent so the Wii-pointer feel survives anywhere.
4. **Optional gyro rotation:** `IRotateSource` implementation reading the Input System gyro quaternion delta (roll axis), off by default, toggle in Options. Cheap to build, authentic flavor.
5. **Sharing:** `IPlatformServices.ShareScreenshot` — captures the Results screen framebuffer (`AsyncGPUReadback`), saves PNG, hands to OS share sheet on supported platforms.

<a name="123"></a>
### 12.3 PlayStation 4

**What the port emphasized:** controller-first UX, trophies, Share button integration, crisp 1080p60 presentation, full campaign.

**Implementation:**

1. **Virtual cursor scheme** (`VirtualCursorPointerSource`): left stick drives an on-screen reticle with an acceleration curve (slow near the tower, fast in open space — a simple `speed = base + k·distFromTower²`). Reticle is drawn only when a gamepad is the active device.
2. **Button map** (Appendix C): `A/Cross` grab & release, `RB/R1` + `LB/L1` rotate, `D-pad` fine-nudge (1 cm steps — surprisingly important for expert play), `Options` pause.
3. **Trophies:** `IAchievementsService.Report(id)`; example set:

| Trophy | Condition |
|---|---|
| First Steps | Place 10 pieces total |
| Architect | Stack 50 pieces in one run |
| Skyward | Reach 25 m |
| Puzzle Mind | 3-star every level in World 1 |
| Zen Master | Finish an Arcade run with 0 risky placements lost |
| Tag Team | Win a 2P Versus match |

4. **Share button:** bind to `IPlatformServices.ShareScreenshot` + a dedicated “Share this tower” item on Results.
5. **Controller FX:** light-bar tint = instability color; route through `IControllerFx` (no-op stub in generic builds; real implementation only exists inside the Sony SDK build).
6. **Presentation:** `URP_Console_Base` — native 1080p, SMAA, shadow distance 20 m, 60 FPS locked (Section 14).

<a name="124"></a>
### 12.4 Nintendo Switch

**What the port emphasized:** hybrid touch/controller play, HD Rumble, single-Joy-Con local multiplayer, handheld performance discipline.

**Implementation:**

1. **Automatic input-mode switching:** subscribe to Input System control-scheme changes; touch active → direct scheme (12.1); controller connected → virtual cursor (12.3). HUD hint icons swap automatically. All of this is testable on PC with a touchscreen + controller.
2. **Single Joy-Con 2P (Versus):** each player uses one Joy-Con held sideways. `PlayerInput` pair with a restricted action map: D-pad/stick = move, `A` = grab/release, `SL/SR` = rotate. Turn-based play means one *pair* of Joy-Cons runs the whole mode — mirror this constraint in the PC test harness (two limited gamepads).
3. **HD Rumble** via `IRumbleProvider` (Section 13). Event map:

| Event | Rumble profile |
|---|---|
| Grab | 10 ms tick, low amplitude |
| Rotate step | 5 ms tick |
| Landing | thud scaled by impact impulse (low-band) |
| Instability warning | slow low-band pulse, looping while danger > 0.7 |
| Collapse | 600 ms descending sweep |

On non-Switch platforms: DualShock/DualSense haptics where available, otherwise no-op.

4. **Performance:** docked 1080p60, handheld 720p60. Use Unity 6 **STP upscaling** (or `UniversalRenderPipelineAsset.renderScale 0.8`) in handheld mode; quality toggle driven by `PresentMode`/dock state from the platform plugin, with a manual override in Options.
5. **Capture button:** OS-level; our responsibility is making Results and milestone moments *worth* capturing (clean composition, no pop-ins).
6. **Mid-run suspend:** Switch can sleep mid-game — serialize run state on suspend, restore on resume (reuse Section 15 resume system).

<a name="125"></a>
### 12.5 Modern consolidated feature set (PS4/Switch-era and later)

The later ports consolidated into a single package. Our v1.x roadmap mirrors it:

1. **Campaign:** 6 worlds × 12 levels (~72 levels) using Section 11; worlds gate on total stars; each world has its own theme + signature mechanic (World 2: gaps/bridges → ConnectZones; World 3: rolling pieces; World 4: wind modifiers; World 5: deliver objectives; World 6: mixed expert).
2. **Endless Survival:** the Arcade mode (Section 7) with modern scoring (risk multipliers, Section 7.4).
3. **Time Attack:** 120 s timer; identical rules to Arcade minus lives (drops just cost time); final countdown pulses the music filter. Implementation: `TimeAttackModeController` = Arcade controller + countdown + no-lives RuleConfig.
4. **Local Versus:** Section 7.5, plus optional **Pressure events** (toggleable in match setup): wind gust every 20–35 s (horizontal ForceMode.Impulse on awake pieces above a height), announced by a 2 s wind SFX cue so it reads as fair.
5. **Leaderboards:**
   - Local always-on (`ILeaderboardService` file-backed).
   - Online behind the same interface (platform services later; Steamworks if a PC store release happens).
   - **Daily Challenge:** seeded piece RNG from `hash(YYYYMMDD)`; fixed 25-piece run; global board of score+time. Physics non-determinism is fine because only scores are compared (Section 4.5).
6. **Options completeness:** drop guide on/off, rotation style (step/continuous), rumble, sensitivity, colorblind-safe palettes (alt piece palettes with pattern decals), text size.

---

<a name="13"></a>
## 13. Platform Services Abstraction Layer

One interface, injected everywhere. Generic builds get a fully functional desktop stub so all gameplay features are testable without SDKs.

```csharp
public interface IPlatformServices
{
    bool SupportsTouch   { get; }
    bool SupportsRumble  { get; }
    void Rumble(PlayerIndex player, RumbleEvent evt);
    void SubmitScore(string boardId, long score);
    void FetchScores(string boardId, System.Action<LeaderboardPage> cb);
    void ShowLeaderboardUI(string boardId);
    void ReportAchievement(string id);
    void ShareScreenshot(Texture2D image, string caption);
    void SetControllerFx(PlayerIndex player, ControllerFxState fx); // light bar, etc.
}
```

Implementations: `DesktopPlatformServices` (file leaderboards, PNG save), `SwitchPlatformServices`, `PS4PlatformServices`, `SteamPlatformServices` — each compiled only inside its platform asmdef so the core never references SDK types. `IGhostService` and `IDisplayService` follow the same pattern.

---

<a name="14"></a>
## 14. Performance Targets & Optimization

| Target platform | Resolution | FPS | Physics budget | Render budget |
|---|---|---|---|---|
| Desktop (high) | 1440p+ | 60 | ≤ 3.5 ms | ≤ 8 ms |
| PS4-class console | 1080p | 60 | ≤ 3.5 ms | ≤ 9 ms |
| Handheld-class | 720p (STP) | 60 | ≤ 3.5 ms | ≤ 10 ms |

**Rules:**

- Awake rigidbody cap: ~40; the SleepManager (4.4) enforces it. Above ~120 total pieces in scene, oldest sub-camera pieces are despawned with a fade (they can never re-enter play).
- Object pooling for pieces, VFX, and splash decals — zero runtime `Instantiate` during play.
- UI Toolkit dynamic atlas; no per-frame text mesh rebuilds (cache score strings on change only).
- Shadows: single directional, 2048, distance 20 m; pieces below camera bottom cast nothing (shadow layer swap on sleep).
- Profiling harness: `Scenes/PerfTest` auto-stacks 60 pieces with a scripted placer and reports frame-time percentiles per platform.

---

<a name="15"></a>
## 15. Save, Progression & Settings

- Format: JSON, `Application.persistentDataPath`, versioned schema (`"schema": 3`), atomic writes (tmp + rename).
- Files:
  - `settings.json` — volume, sensitivity, drop guide, rotation style, rumble, display mode.
  - `progress.json` — level stars/best scores, unlocked worlds, achievements-earned flags (mirror to platform service when available).
  - `highscores.json` — top-10 per mode.
  - `ghosts/*.json` — ghost run records (12.1).
  - `resume.json` — mid-run suspend state (active mode, placed pieces as `PlacementRecord[]`, lives, score). Rebuild = re-simulate placements kinematically (no physics pop).
- Save service behind `ISaveService` so console platform-save requirements (user-account scoping) slot in later.

---

<a name="16"></a>
## 16. Tools & Content Pipeline

| Tool | Purpose |
|---|---|
| **Level Workbench** (custom EditorWindow) | Author/test puzzle levels (Section 11.4) |
| **Piece Forge** (editor utility) | Create PieceDefinition + validate collider fit (renders collider overlay vs mesh, warns on volume mismatch > 15%) |
| **Theme Lab** | Live-tune ThemeDefinition values in play mode |
| **Debug harness overlay** (UI Toolkit, dev builds only) | Spawn any piece, slow-mo ×0.25, show contacts, show velocities, force-collapse, skip level |
| **Balance runner** | Headless-ish play mode script that plays N random Arcade runs with a bot placer (drops at center-of-support) to flag impossible piece weights |

---

<a name="17"></a>
## 17. Testing Strategy

| Layer | Approach |
|---|---|
| Unit (EditMode) | Scoring math, weighted spawner distributions, objective predicates with mocked GameContext, save schema round-trips |
| Physics regression (PlayMode) | Scripted scenarios in a dedicated `PhysicsScene`: 6-cube stack stillness, plank-on-edge hold, wedge-deflection sanity; run with fixed seeds, assert positions within epsilon |
| Settle/fail logic (PlayMode) | Simulated drops of each catalog piece on flat pedestal → must settle within timeout |
| Mode flows | State machine table tests (every transition), 2P turn alternation |
| Performance | PerfTest scene per platform per milestone (Section 14) |
| Manual matrix | Every milestone: mouse, touch, gamepad × Arcade/Puzzle/TimeAttack/Versus; plus “chaos test” (spam inputs during settle/camera-rise) |

---

<a name="18"></a>
## 18. Production Plan & Milestones

Assumes a small team (1–2 programmers, 1 artist, audio contractor). Solo-dev: roughly double the timeline.

| Milestone | Weeks | Contents | Exit criteria |
|---|---|---|---|
| **M0 — Foundations** | 1 | Repo + CI, URP setup, input scaffolding, scene harness, world conventions locked | Empty scene with gradient bg, pointer ray, piece spawning in code |
| **M1 — Physics feel** | 2–4 | Section 4 tuning, pieces catalog v1, grab/release, settle detector, camera rig, kill plane | Section 4.6 checklist fully green; “greybox is already fun” |
| **M2 — Arcade complete** | 5–7 | Arcade state machine, scoring, lives, collapse, 2P alternating, HUD v1, local high scores | Full playable Arcade + Versus run, no crashes, 60 FPS desktop |
| **M3 — Presentation** | 8–10 | Theme system, piece shader, VFX, post, audio v1, instability feedback, menu shell | Looks/feels like the pillar screenshots; audio pass on all loop events |
| **M4 — Puzzle framework** | 11–14 | Section 11 systems + Level Workbench + first 24 levels (2 worlds) | 24 levels beatable, stars saving, retry < 0.3 s |
| **M5 — Port feature layer** | 15–17 | Touch scheme, virtual cursor, ghost system, time attack, daily challenge, rumble/share stubs, resume system | Every feature in Sections 6/12 testable on PC with real devices |
| **M6 — Content + certification polish** | 18–20 | Remaining worlds (~48 levels), perf passes per target, localization pass (string table), options completeness, bug burn-down | v1.0 candidate: all modes, all platforms stubs green, perf table met |

**Post-1.0 backlog:** online leaderboards, additional piece packs, photo/share modes, more versus pressure events.

---

<a name="19"></a>
## 19. Risks & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Physics never feels “right” | Fatal | M1 is a hard gate; TGS + high iterations early; friction-first tuning; reference videos of the original for A/B comparison |
| Perf collapse on big towers | High | SleepManager, pooling, awake-body cap, PerfTest scene from M2 onward |
| Puzzle content is slow to author | High | Level Workbench before content (M4 ordering); par auto-suggestion from bot placer |
| Touch vs cursor parity gaps | Medium | One pointer abstraction from day 1; matrix testing every milestone |
| Platform SDK gating (console builds) | Medium | All platform features behind interfaces + desktop stubs; code is console-ready even before dev kits exist |
| IP concerns | Medium | Original name/art/audio/UI; mechanics-only inspiration; no asset ripping; review marketing copy before launch |
| Scope creep from port features | Medium | Sections 12 features are explicitly additive; v1.0 gate = M0–M3 + partial M4 |

---

<a name="20"></a>
## 20. Appendices

### Appendix B — Sample code (Unity 6 APIs; note `linearVelocity` naming)

#### B.1 PieceDefinition

```csharp
// _Project/Code/Pieces/PieceDefinition.cs
using UnityEngine;

public enum PieceMaterialType { Wood, Stone, Rubber, Ice }
public enum DifficultyTier   { Basic, Intermediate, Advanced, Expert }

[CreateAssetMenu(menuName = "ZENITH/Piece Definition", fileName = "Piece_")]
public sealed class PieceDefinition : ScriptableObject
{
    [Header("Identity")]
    public string id;
    public DifficultyTier tier = DifficultyTier.Basic;
    public PieceMaterialType materialType = PieceMaterialType.Wood;

    [Header("Visuals")]
    public Mesh visualMesh;          // beveled mesh; colliders below are separate

    [Header("Physics")]
    public float density = 800f;     // kg/m^3 -> Rigidbody mass via SetDensity
    public ColliderSetup[] colliders = new ColliderSetup[1];

    [Header("Spawning")]
    [Range(0f, 1f)] public float weightInPool = 1f;
    public bool allowYawFlip = true; // 180° yaw variety on spawn
}

[System.Serializable]
public struct ColliderSetup
{
    public PrimitiveType type;   // Box | Sphere | Capsule; convex hulls added manually
    public Vector3 center;
    public Vector3 size;         // Box: full extents. Sphere: x = diameter. Capsule: x = diameter, y = length.
}
```

#### B.2 HeldPiece (grab/release feel)

```csharp
using UnityEngine;

[RequireComponent(typeof(Rigidbody))]
public sealed class HeldPiece : MonoBehaviour
{
    public Rigidbody Body { get; private set; }
    Vector3 prevPos;
    Vector3 smoothedVelocity;

    void Awake() => Body = GetComponent<Rigidbody>();

    public void Attach()
    {
        Body.isKinematic = true;
        Body.linearVelocity = Vector3.zero;
        Body.angularVelocity = Vector3.zero;
        prevPos = Body.position;
        smoothedVelocity = Vector3.zero;
    }

    // Call once per FixedUpdate while held.
    public void TrackVelocity()
    {
        Vector3 v = (Body.position - prevPos) / Time.fixedDeltaTime;
        smoothedVelocity = Vector3.Lerp(smoothedVelocity, v, 0.35f);
        prevPos = Body.position;
    }

    public void Detach(float maxThrowSpeed)
    {
        Body.isKinematic = false;
        Body.linearVelocity = Vector3.ClampMagnitude(smoothedVelocity, maxThrowSpeed);
    }
}
```

#### B.3 PlacementRig (pointer → world plane)

```csharp
using UnityEngine;

public sealed class PlacementRig : MonoBehaviour
{
    [SerializeField] Camera cam;
    [SerializeField] float planeZ = 0f;
    [SerializeField] float followSpeed = 18f;

    public Vector3 PointerToWorld(IPointerSource pointer)
    {
        Ray ray = cam.ScreenPointToRay(pointer.ScreenPosition);
        float t = (planeZ - ray.origin.z) / Mathf.Abs(ray.direction.z) * Mathf.Sign(ray.direction.z);
        Vector3 p = ray.origin + ray.direction * Mathf.Max(t, 0.1f);
        p.z = planeZ;
        return p;
    }

    public void DriveHeldPiece(HeldPiece piece, Vector3 target, Rect playBounds)
    {
        target.x = Mathf.Clamp(target.x, playBounds.xMin, playBounds.xMax);
        target.y = Mathf.Clamp(target.y, playBounds.yMin, playBounds.yMax);
        float k = 1f - Mathf.Exp(-followSpeed * Time.fixedDeltaTime);
        piece.Body.MovePosition(Vector3.Lerp(piece.Body.position, target, k));
    }
}
```

#### B.4 Two-finger twist (touch rotation)

```csharp
// Inside TouchPointerSource, using EnhancedTouch:
float TwistDelta()
{
    var t = UnityEngine.InputSystem.EnhancedTouch.Touch.activeTouches;
    if (t.Count < 2) { prevAngle = 0f; return 0f; }

    Vector2 d = t[0].screenPosition - t[1].screenPosition;
    float angle = Mathf.Atan2(d.y, d.x) * Mathf.Rad2Deg;
    float delta = prevAngle == 0f ? 0f : Mathf.DeltaAngle(prevAngle, angle);
    prevAngle = angle;
    return delta; // degrees this frame -> feed RotationDriver
}
```

#### B.5 TowerCameraRig

```csharp
using UnityEngine;

public sealed class TowerCameraRig : MonoBehaviour
{
    [SerializeField] float framingOffset = 2.2f;
    [SerializeField] float riseSmoothTime = 0.6f;
    [SerializeField] float maxRiseSpeed = 4f;
    float velY;

    [System.NonSerialized] public float HighestSettledY;
    [System.NonSerialized] public float BaseY = 0f;

    void LateUpdate()
    {
        float targetY = Mathf.Max(BaseY, HighestSettledY + framingOffset);
        float y = Mathf.SmoothDamp(transform.position.y, targetY,
                                   ref velY, riseSmoothTime, maxRiseSpeed);
        transform.position = new Vector3(0f, y, transform.position.z); // x locked: original never pans sideways
    }
}
```

#### B.6 SettleDetector

```csharp
using UnityEngine;

public sealed class SettleDetector : MonoBehaviour
{
    [SerializeField] float linearEps = 0.06f;        // m/s
    [SerializeField] float angularEpsDeg = 3f;       // deg/s
    [SerializeField] float requiredSeconds = 0.9f;
    [SerializeField] float timeoutSeconds = 6f;

    Rigidbody rb; float calm, alive;
    public bool Resolved { get; private set; }
    public event System.Action OnSettled;
    public event System.Action OnFailedToSettle;

    void Awake() => rb = GetComponentInParent<Rigidbody>();

    void FixedUpdate()
    {
        if (Resolved) return;
        alive += Time.fixedDeltaTime;

        float angEps = angularEpsDeg * Mathf.Deg2Rad;
        bool calmNow = rb.linearVelocity.sqrMagnitude < linearEps * linearEps
                    && rb.angularVelocity.sqrMagnitude < angEps * angEps;

        calm = calmNow ? calm + Time.fixedDeltaTime : 0f;

        if (calm >= requiredSeconds)      { Resolved = true; OnSettled?.Invoke(); }
        else if (alive >= timeoutSeconds) { Resolved = true; OnFailedToSettle?.Invoke(); }
    }
}
```

#### B.7 Objectives & GameContext

```csharp
public abstract class Objective : ScriptableObject
{
    public abstract bool IsComplete(GameContext ctx);
    public abstract string ProgressLabel(GameContext ctx);
}

[CreateAssetMenu(menuName = "ZENITH/Objectives/Reach Height")]
public sealed class ReachHeightObjective : Objective
{
    public float targetHeight = 10f;
    public override bool IsComplete(GameContext ctx) => ctx.HighestSettledY >= targetHeight;
    public override string ProgressLabel(GameContext ctx) =>
        $"{ctx.HighestSettledY:0.0} / {targetHeight:0.0} m";
}

[CreateAssetMenu(menuName = "ZENITH/Objectives/Survive Time")]
public sealed class SurviveTimeObjective : Objective
{
    public float seconds = 15f; // timer runs only after last required piece settles (PuzzleModeController)
    public override bool IsComplete(GameContext ctx) => ctx.SurvivalTimer >= seconds;
    public override string ProgressLabel(GameContext ctx) =>
        $"{ctx.SurvivalTimer:0.0} / {seconds:0.0} s";
}
```

#### B.8 Platform/input interfaces

```csharp
public interface IPointerSource
{
    Vector2 ScreenPosition { get; }        // pixels
    bool    IsHeld { get; }                // grab button / touch contact
    bool    WasReleasedThisFrame { get; }
    float   ScrollDelta { get; }           // desktop rotation
}

public interface IRotateSource
{
    float AxisDelta { get; }               // continuous (wheel/stick/gyro/twist)
    void    RotateStep(int direction);     // discrete taps/buttons
}
```

### Appendix C — Control matrix

| Action | Mouse+KB | Touch | Gamepad | Single Joy-Con (2P) |
|---|---|---|---|---|
| Aim | pointer | relative drag | left stick (virtual cursor) | stick/D-pad |
| Grab / release | LMB hold | drag = implicit hold; release = lift finger* | Cross/A | A |
| Rotate | wheel or R/T | ⟲/⟳ buttons (tap/hold) | RB/LB | SL/SR |
| Fine nudge | arrow keys | — | D-pad | D-pad |
| Drop guide | G | — | — | — |
| Pause | Esc | ⏸ button | Options/Start | + |

\* Touch release rule: finger leaves the screen → piece drops; matches TOUCH!-era feel.

### Appendix D — Mode × version feature matrix (target scope)

| Feature | WiiWare-era core | 3DS TOUCH! | Wii U | PS4-era | Switch-era | Our build |
|---|---|---|---|---|---|---|
| Arcade/Endless | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ (M2) |
| 2P alternating | ✔ | — | ✔ | ✔ | ✔ | ✔ (M2) |
| Touch controls | — | ✔ | ✔ (GamePad) | — | ✔ (handheld) | ✔ (M5) |
| Puzzle campaign | — | ✔ | partial | ✔ (full) | ✔ (full) | ✔ (M4/M6) |
| Time attack | ✔-style | — | ✔ | ✔ | ✔ | ✔ (M5) |
| Ghost sharing | — | ✔ (StreetPass) | ✔ (Miiverse-style) | — | — | ✔ local→online (M5+) |
| HD Rumble / haptics | — | — | — | light bar | ✔ | ✔ via abstraction (M5) |
| Online leaderboards | — | — | — | ✔ | ✔ | ✔ post-1.0 |
| Daily challenge | — | — | — | — | — | ✔ (M5, our addition) |

---

*End of document. Suggested first action: complete Section 2 setup, then start M1 with the physics tuning checklist (4.6) as the sprint goal — everything downstream depends on that feel.*


***

# Project ZENITH — Follow-up Deliverable
### Part A: M1 Starter Kit (bootable grab/drop/settle scene)
### Part B: Level Workbench — editor tool design

| | |
|---|---|
| Companion document | `Project_ZENITH_ArtOfBalanceStyle_Unity6_ImplementationPlan.md` |
| Engine | Unity 6 (6000.x), URP, new Input System |
| Goal of Part A | Press Play in an almost-empty scene and get the full greybox loop working with zero hand-built assets |

---

# Part A — M1 Starter Kit

## A.0 What boots vs. what is deferred

| In M1 (this kit) | Deferred to later milestones |
|---|---|
| Piece spawning, weighted catalog, hover-bob | Next-piece preview camera (M2) |
| Pointer grab on a plane, throw-velocity release | Touch rotate buttons / gamepad cursor (M5) |
| Wheel + Q/E rotation | Two-player turn system (M2) |
| Settle detection + timeout rule | Risk-bonus scoring, combos (M2) |
| Lives, collapse detection, restart | Themes crossfade, gradient themes (M3) |
| Rising camera + play bounds + kill plane | Drop guide (M5) |
| IMGUI debug HUD | UI Toolkit production HUD (M3) |
| Auto-built pedestal, depth walls, background | Beveled art meshes (M3, artist) |

Everything is wired in code by a single `GameBootstrap` component, so the scene requires no manual object placement.

## A.1 Prerequisites & project setup (do once)

1. Create a **Unity 6 URP 3D project**.
2. Package Manager → install **Input System** (`com.unity.inputsystem`).
3. `Edit → Project Settings → Player → Active Input Handling` = **Input System Package (New)** → restart editor.
4. `Edit → Project Settings → Physics`:
   - **Solver Type = TGS** (not settable from script — the one manual step)
   - Everything else is applied automatically at boot by `PhysicsConfigurator`.
5. *(Recommended)* `Edit → Project Settings → Tags and Layers` → add a layer named **`Piece`**. The kit falls back gracefully if missing, but the grab raycast is cleaner with it.
6. Create the files from A.2 at the listed paths, create the scene per A.4, press Play.

## A.2 File manifest

| # | Path | Role |
|---|---|---|
| 1 | `Assets/_Project/Code/PhysicsTools/PhysicsConfigurator.cs` | Applies physics tuning at boot |
| 2 | `Assets/_Project/Code/Input/IPointerSource.cs` | Pointer abstraction |
| 3 | `Assets/_Project/Code/Input/UnifiedPointerSource.cs` | Mouse + touch pointer (New Input System) |
| 4 | `Assets/_Project/Code/Pieces/PieceDefinition.cs` | Piece ScriptableObject spec |
| 5 | `Assets/_Project/Code/Pieces/PieceFactory.cs` | Builds runtime pieces + shared physics/visual materials |
| 6 | `Assets/_Project/Code/Pieces/PieceInstance.cs` | Runtime piece wrapper + events |
| 7 | `Assets/_Project/Code/PhysicsTools/SettleDetector.cs` | Calm-time settle logic |
| 8 | `Assets/_Project/Code/Manipulation/HeldPiece.cs` | Kinematic hold + release velocity |
| 9 | `Assets/_Project/Code/Manipulation/PlacementRig.cs` | Pointer → world plane mapping |
| 10 | `Assets/_Project/Code/Camera/TowerCameraRig.cs` | Rising camera + frustum helpers |
| 11 | `Assets/_Project/Code/PhysicsTools/KillPlane.cs` | Camera-following drop trigger |
| 12 | `Assets/_Project/Code/Core/ArcadeGameController.cs` | The M1 game loop |
| 13 | `Assets/_Project/Code/UI/SimpleHUD.cs` | IMGUI debug HUD |
| 14 | `Assets/_Project/Code/Core/GameBootstrap.cs` | Builds the whole scene in code |
| 15 | `Assets/_Project/Art/Shaders/GradientBackground.shader` | Zen gradient backdrop |

## A.3 Code

### A.3.1 PhysicsConfigurator.cs

```csharp
using UnityEngine;

public static class PhysicsConfigurator
{
    [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.BeforeSceneLoad)]
    static void Apply()
    {
        Time.fixedDeltaTime = 1f / 60f;
        Time.maximumDeltaTime = 0.05f;
        Physics.defaultSolverIterations = 12;
        Physics.defaultSolverVelocityIterations = 4;
        Physics.defaultContactOffset = 0.005f;
        Physics.sleepThreshold = 0.005f;
        Physics.bounceThreshold = 2f;
        // Reminder: Solver Type = TGS must be set in Project Settings (not scriptable).
    }
}
```

### A.3.2 IPointerSource.cs

```csharp
using UnityEngine;

public interface IPointerSource
{
    Vector2 ScreenPosition { get; }
    bool IsPressed { get; }
    bool WasPressedThisFrame { get; }
    bool WasReleasedThisFrame { get; }
    float ScrollDelta { get; }   // mouse wheel; 0 on touch
}
```

### A.3.3 UnifiedPointerSource.cs

```csharp
using UnityEngine;
using UnityEngine.InputSystem;
using UnityEngine.InputSystem.EnhancedTouch;
using Touch = UnityEngine.InputSystem.EnhancedTouch.Touch;
using TouchPhase = UnityEngine.InputSystem.TouchPhase;

public sealed class UnifiedPointerSource : IPointerSource
{
    Vector2 lastPos = new Vector2(Screen.width * 0.5f, Screen.height * 0.6f);

    public Vector2 ScreenPosition { get; private set; }
    public bool IsPressed { get; private set; }
    public bool WasPressedThisFrame { get; private set; }
    public bool WasReleasedThisFrame { get; private set; }
    public float ScrollDelta { get; private set; }

    // Call once per Update.
    public void Poll()
    {
        ScrollDelta = 0f;
        var mouse = Mouse.current;
        var touchScreen = Touchscreen.current;

        if (touchScreen != null && Touch.activeTouches.Count > 0)
        {
            Touch t = Touch.activeTouches[0];
            ScreenPosition = t.screenPosition;
            IsPressed = t.phase != TouchPhase.Ended && t.phase != TouchPhase.Canceled;
            WasPressedThisFrame = t.phase == TouchPhase.Began;
            WasReleasedThisFrame = t.phase == TouchPhase.Ended;
        }
        else if (mouse != null)
        {
            ScreenPosition = mouse.position.ReadValue();
            IsPressed = mouse.leftButton.isPressed;
            WasPressedThisFrame = mouse.leftButton.wasPressedThisFrame;
            WasReleasedThisFrame = mouse.leftButton.wasReleasedThisFrame;
            ScrollDelta = mouse.scroll.ReadValue().y;
        }
        else
        {
            ScreenPosition = lastPos;
            IsPressed = WasPressedThisFrame = WasReleasedThisFrame = false;
        }
        lastPos = ScreenPosition;
    }
}
```

### A.3.4 PieceDefinition.cs

```csharp
using UnityEngine;

public enum PieceMaterialType { Wood, Stone, Rubber, Ice }
public enum DifficultyTier { Basic, Intermediate, Advanced, Expert }

// In M1 these are created in-memory by GameBootstrap; from M4 on they become real assets.
public sealed class PieceDefinition : ScriptableObject
{
    public string id;
    public DifficultyTier tier = DifficultyTier.Basic;
    public PieceMaterialType materialType = PieceMaterialType.Wood;

    public float density = 700f;               // kg/m^3 -> Rigidbody mass via SetDensity
    public ColliderSetup[] colliders = new ColliderSetup[1];

    [Range(0f, 1f)] public float weightInPool = 1f;
    public bool allowYawFlip = true;
}

[System.Serializable]
public struct ColliderSetup
{
    public PrimitiveType type;   // M1 supports Box | Sphere | Capsule
    public Vector3 center;
    public Vector3 size;         // Box: extents. Sphere: x = diameter. Capsule: x = diameter, y = length.
}
```

### A.3.5 PieceFactory.cs

```csharp
using UnityEngine;

public static class PieceFactory
{
    static PhysicMaterial physicsMat;
    static Material[] palette;
    static Material pedestalMat;

    public static PhysicMaterial PhysicsMaterial => physicsMat;
    public static Material PedestalMaterial => pedestalMat;

    public static void Prepare()
    {
        if (physicsMat != null) return;

        physicsMat = new PhysicMaterial("ZENITH_Stack")
        {
            dynamicFriction = 0.9f,
            staticFriction = 1.0f,
            bounciness = 0f,
            frictionCombine = PhysicMaterialCombine.Maximum,
            bounceCombine = PhysicMaterialCombine.Minimum
        };

        Shader lit = Shader.Find("Universal Render Pipeline/Lit") ?? Shader.Find("Standard");
        pedestalMat = MakeMat(lit, new Color(0.35f, 0.38f, 0.42f));
        palette = new[]
        {
            MakeMat(lit, new Color(0.85f, 0.54f, 0.45f)),
            MakeMat(lit, new Color(0.90f, 0.76f, 0.45f)),
            MakeMat(lit, new Color(0.62f, 0.76f, 0.55f)),
            MakeMat(lit, new Color(0.52f, 0.70f, 0.82f)),
            MakeMat(lit, new Color(0.72f, 0.62f, 0.80f)),
            MakeMat(lit, new Color(0.86f, 0.86f, 0.86f)),
        };
    }

    static Material MakeMat(Shader s, Color c)
    {
        var m = new Material(s);
        if (m.HasProperty("_BaseColor")) m.SetColor("_BaseColor", c);
        else m.color = c;
        return m;
    }

    public static PieceInstance Create(PieceDefinition def)
    {
        var go = new GameObject($"Piece_{def.id}");
        int layer = LayerMask.NameToLayer("Piece");
        if (layer >= 0) go.layer = layer;

        foreach (var c in def.colliders) AddColliderAndVisual(go, c, GetVisualMaterial(def));

        var rb = go.AddComponent<Rigidbody>();
        rb.SetDensity(def.density);                       // requires colliders to exist first
        rb.interpolation = RigidbodyInterpolation.Interpolate;
        rb.maxDepenetrationVelocity = 4f;
        rb.angularDamping = 0.05f;                        // Unity 6 name (was angularDrag)
        rb.sharedMaterial = physicsMat;                   // applies to all child colliders

        var held = go.AddComponent<HeldPiece>();
        var settle = go.AddComponent<SettleDetector>();
        settle.enabled = false;                           // armed only after release
        var inst = go.AddComponent<PieceInstance>();
        inst.Init(def, held, settle, rb);
        return inst;
    }

    static void AddColliderAndVisual(GameObject go, ColliderSetup c, Material mat)
    {
        switch (c.type)
        {
            case PrimitiveType.Box:
            {
                var bc = go.AddComponent<BoxCollider>();
                bc.center = c.center; bc.size = c.size;
                AddVisual(go, PrimitiveType.Box, mat, c.size, c.center);
                break;
            }
            case PrimitiveType.Sphere:
            {
                var sc = go.AddComponent<SphereCollider>();
                sc.center = c.center; sc.radius = c.size.x * 0.5f;
                AddVisual(go, PrimitiveType.Sphere, mat, Vector3.one * c.size.x, c.center);
                break;
            }
            case PrimitiveType.Capsule:   // greybox stand-in for a cylinder
            {
                var cc = go.AddComponent<CapsuleCollider>();
                cc.center = c.center; cc.direction = 1;
                cc.radius = c.size.x * 0.5f; cc.height = c.size.y;
                AddVisual(go, PrimitiveType.Capsule, mat,
                          new Vector3(c.size.x, c.size.y * 0.5f, c.size.x), c.center);
                break;
            }
        }
    }

    static void AddVisual(GameObject parent, PrimitiveType type, Material mat, Vector3 scale, Vector3 center)
    {
        var v = GameObject.CreatePrimitive(type);
        Object.Destroy(v.GetComponent<Collider>());
        v.transform.SetParent(parent.transform, false);
        v.transform.localPosition = center;
        v.transform.localScale = scale;
        v.GetComponent<Renderer>().sharedMaterial = mat;
    }

    public static Material GetVisualMaterial(PieceDefinition def)
        => palette[Mathf.Abs(def.id.GetHashCode()) % palette.Length];
}
```

### A.3.6 PieceInstance.cs

```csharp
using UnityEngine;

public sealed class PieceInstance : MonoBehaviour
{
    public PieceDefinition Definition { get; private set; }
    public HeldPiece Held { get; private set; }
    public SettleDetector Settle { get; private set; }
    public Rigidbody Body { get; private set; }

    public bool HasContact { get; private set; }
    public bool IsScored { get; set; }
    public float SettledY { get; set; }

    public event System.Action<PieceInstance> Settled;
    public event System.Action<PieceInstance> FailedToSettle;

    public void Init(PieceDefinition def, HeldPiece held, SettleDetector settle, Rigidbody rb)
    {
        Definition = def; Held = held; Settle = settle; Body = rb;
        settle.Settled += () => Settled?.Invoke(this);
        settle.TimedOut += () => FailedToSettle?.Invoke(this);
    }

    void OnCollisionEnter(Collision collision) => HasContact = true;
}
```

### A.3.7 SettleDetector.cs

```csharp
using UnityEngine;

public sealed class SettleDetector : MonoBehaviour
{
    public float linearEps = 0.06f;        // m/s
    public float angularEpsDeg = 3f;       // deg/s
    public float requiredSeconds = 0.9f;
    public float timeoutSeconds = 6f;

    public bool Resolved { get; private set; }
    public event System.Action Settled;
    public event System.Action TimedOut;

    Rigidbody rb;
    float calm, alive;

    void Awake() => rb = GetComponentInParent<Rigidbody>();

    public void Begin()
    {
        calm = 0f; alive = 0f; Resolved = false; enabled = true;
    }

    void FixedUpdate()
    {
        if (Resolved || rb == null) return;
        alive += Time.fixedDeltaTime;

        float angEps = angularEpsDeg * Mathf.Deg2Rad;
        bool calmNow = rb.linearVelocity.sqrMagnitude < linearEps * linearEps
                    && rb.angularVelocity.sqrMagnitude < angEps * angEps;
        calm = calmNow ? calm + Time.fixedDeltaTime : 0f;

        if (calm >= requiredSeconds) { Resolved = true; enabled = false; Settled?.Invoke(); }
        else if (alive >= timeoutSeconds) { Resolved = true; enabled = false; TimedOut?.Invoke(); }
    }
}
```

### A.3.8 HeldPiece.cs

```csharp
using UnityEngine;

[RequireComponent(typeof(Rigidbody))]
public sealed class HeldPiece : MonoBehaviour
{
    public Rigidbody Body { get; private set; }
    Vector3 prevPos;
    Vector3 smoothedVelocity;

    void Awake() => Body = GetComponent<Rigidbody>();

    public void Attach()
    {
        Body.isKinematic = true;
        Body.linearVelocity = Vector3.zero;
        Body.angularVelocity = Vector3.zero;
        prevPos = Body.position;
        smoothedVelocity = Vector3.zero;
    }

    // Called every FixedUpdate while held.
    public void TrackVelocity()
    {
        Vector3 v = (Body.position - prevPos) / Time.fixedDeltaTime;
        smoothedVelocity = Vector3.Lerp(smoothedVelocity, v, 0.35f);
        prevPos = Body.position;
    }

    public void Detach(float maxThrowSpeed)
    {
        Body.isKinematic = false;
        Body.linearVelocity = Vector3.ClampMagnitude(smoothedVelocity, maxThrowSpeed);
        smoothedVelocity = Vector3.zero;
    }
}
```

### A.3.9 PlacementRig.cs

```csharp
using UnityEngine;

public sealed class PlacementRig : MonoBehaviour
{
    public Camera cam;
    public float planeZ = 0f;
    public float followSpeed = 18f;

    public Vector3 PointerToWorld(IPointerSource pointer)
    {
        Ray ray = cam.ScreenPointToRay(pointer.ScreenPosition);
        if (Mathf.Abs(ray.direction.z) < 1e-4f) return Vector3.zero;
        float t = (planeZ - ray.origin.z) / ray.direction.z;
        Vector3 p = ray.origin + ray.direction * Mathf.Max(t, 0.1f);
        p.z = planeZ;
        return p;
    }

    public void DriveHeldPiece(HeldPiece piece, Vector3 target, Rect playBounds)
    {
        target.x = Mathf.Clamp(target.x, playBounds.xMin, playBounds.xMax);
        target.y = Mathf.Clamp(target.y, playBounds.yMin, playBounds.yMax);
        float k = 1f - Mathf.Exp(-followSpeed * Time.fixedDeltaTime);
        piece.Body.MovePosition(Vector3.Lerp(piece.Body.position, target, k));
        piece.TrackVelocity();
    }

    public void RotateHeld(HeldPiece piece, float degrees)
    {
        if (!piece.Body.isKinematic) return;
        piece.Body.MoveRotation(piece.Body.rotation * Quaternion.Euler(0f, 0f, degrees));
    }
}
```

### A.3.10 TowerCameraRig.cs

```csharp
using UnityEngine;

[RequireComponent(typeof(Camera))]
public sealed class TowerCameraRig : MonoBehaviour
{
    public float framingOffset = 1.8f;
    public float riseSmoothTime = 0.6f;
    public float maxRiseSpeed = 4f;
    public float pitchDeg = -8f;      // look slightly up -> tower top sits low on screen
    public float distance = 14f;
    public float BaseY = 2f;

    [System.NonSerialized] public float HighestSettledY;

    public Camera Cam { get; private set; }
    float velY;

    void Awake() => Cam = GetComponent<Camera>();

    void LateUpdate()
    {
        float targetY = Mathf.Max(BaseY, HighestSettledY + framingOffset);
        float y = Mathf.SmoothDamp(transform.position.y, targetY, ref velY, riseSmoothTime, maxRiseSpeed);
        transform.position = new Vector3(0f, y, -distance);   // x locked: original never pans sideways
        transform.rotation = Quaternion.Euler(pitchDeg, 0f, 0f);
    }

    public Rect WorldRectAtPlaneZ(float planeZ)
    {
        Vector3 bl = PlanePoint(Cam.ViewportPointToRay(new Vector2(0f, 0f)), planeZ);
        Vector3 tr = PlanePoint(Cam.ViewportPointToRay(new Vector2(1f, 1f)), planeZ);
        return Rect.MinMaxRect(bl.x, bl.y, tr.x, tr.y);
    }

    public float WorldHalfHeightAtPlaneZ(float planeZ) => WorldRectAtPlaneZ(planeZ).height * 0.5f;

    static Vector3 PlanePoint(Ray r, float planeZ)
    {
        float t = (planeZ - r.origin.z) / r.direction.z;
        return r.origin + r.direction * t;
    }
}
```

### A.3.11 KillPlane.cs

```csharp
using UnityEngine;

public sealed class KillPlane : MonoBehaviour
{
    public TowerCameraRig Rig;
    public float margin = 2f;
    public float PlaneY { get; private set; }
    public event System.Action<Rigidbody> BodyCrossed;

    void Awake()
    {
        var trigger = gameObject.AddComponent<BoxCollider>();
        trigger.isTrigger = true;
        trigger.size = new Vector3(80f, 2f, 30f);
    }

    void LateUpdate()
    {
        if (Rig == null) return;
        PlaneY = Rig.transform.position.y - Rig.WorldHalfHeightAtPlaneZ(0f) - margin;
        transform.position = new Vector3(0f, PlaneY - 1f, 0f); // box top edge ~= PlaneY
    }

    void OnTriggerEnter(Collider other)
    {
        if (other.attachedRigidbody != null) BodyCrossed?.Invoke(other.attachedRigidbody);
    }
}
```

### A.3.12 ArcadeGameController.cs

```csharp
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.InputSystem;

public sealed class ArcadeGameController : MonoBehaviour
{
    public enum Phase { Between, AwaitingGrab, Held, Falling, GameOver }

    [Header("Tuning")]
    public int startingLives = 3;
    public float maxThrowSpeed = 3f;
    public float nextPieceDelay = 0.45f;
    public float collapseDropDistance = 1.5f;

    [Header("Wiring (set by GameBootstrap)")]
    public TowerCameraRig Rig;
    public PlacementRig Placement;
    public List<PieceDefinition> Catalog = new();

    public Phase Current { get; private set; } = Phase.Between;
    public int Score { get; private set; }
    public int Lives { get; private set; }
    public int Stacked { get; private set; }
    public float HighestY { get; private set; }
    public string StatusText { get; private set; } = "";

    readonly UnifiedPointerSource pointer = new();
    readonly List<PieceInstance> scored = new();
    readonly List<PieceInstance> allPieces = new();
    PieceInstance current;
    Vector3 spawnPoint;
    bool pendingSpawn;
    float nextSpawnAt;
    int pieceMask;

    void Start()
    {
        int layer = LayerMask.NameToLayer("Piece");
        pieceMask = layer >= 0 ? 1 << layer : ~0;

        var kill = FindFirstObjectByType<KillPlane>();
        if (kill != null) kill.BodyCrossed += HandleBodyCrossed;

        BeginRun();
    }

    public void BeginRun()
    {
        foreach (var p in allPieces) if (p != null) Destroy(p.gameObject);
        allPieces.Clear(); scored.Clear(); current = null;
        Score = 0; Stacked = 0; HighestY = 0f; Lives = startingLives;
        Rig.HighestSettledY = 0f;
        StatusText = "";
        QueueNext();
        nextSpawnAt = Time.time + 0.2f;
    }

    void Update()
    {
        pointer.Poll();
        HandleDebugKeys();

        switch (Current)
        {
            case Phase.Between:
                if (pendingSpawn && Time.time >= nextSpawnAt) SpawnNext();
                break;
            case Phase.AwaitingGrab: UpdateAwaitingGrab(); break;
            case Phase.Held: UpdateHeld(); break;
        }

        if (Current != Phase.GameOver) CheckCollapse();
    }

    void FixedUpdate()
    {
        if (Current == Phase.AwaitingGrab && current != null)
        {
            float bob = Mathf.Sin(Time.time * 2f) * 0.06f;
            current.transform.position = spawnPoint + new Vector3(0f, bob, 0f);
        }
        else if (Current == Phase.Held && current != null)
        {
            Placement.DriveHeldPiece(current.Held, Placement.PointerToWorld(pointer), InsetBounds());
        }
    }

    void UpdateAwaitingGrab()
    {
        if (!pointer.WasPressedThisFrame || current == null) return;

        bool grab = false;
        Ray ray = Rig.Cam.ScreenPointToRay(pointer.ScreenPosition);
        if (Physics.Raycast(ray, out RaycastHit hit, 200f, pieceMask))
            grab = hit.rigidbody != null && hit.rigidbody.gameObject == current.gameObject;

        if (!grab) // generous fallback: click anywhere near the hovering piece
        {
            Vector2 sp = Rig.Cam.WorldToScreenPoint(current.transform.position);
            grab = Vector2.Distance(pointer.ScreenPosition, sp) < 140f;
        }

        if (grab) { Current = Phase.Held; StatusText = ""; }
    }

    void UpdateHeld()
    {
        float deg = Mathf.Clamp(pointer.ScrollDelta * 0.2f, -20f, 20f);
        var kb = Keyboard.current;
        if (kb != null)
        {
            if (kb.qKey.isPressed) deg -= 120f * Time.deltaTime;
            if (kb.eKey.isPressed) deg += 120f * Time.deltaTime;
        }
        if (Mathf.Abs(deg) > 0.001f) Placement.RotateHeld(current.Held, deg);

        if (pointer.WasReleasedThisFrame)
        {
            current.Held.Detach(maxThrowSpeed);
            current.Settle.Begin();
            Current = Phase.Falling;
        }
    }

    void SpawnNext()
    {
        pendingSpawn = false;
        PieceDefinition def = PickWeighted();
        current = PieceFactory.Create(def);
        allPieces.Add(current);

        Rect bounds = Rig.WorldRectAtPlaneZ(0f);
        spawnPoint = new Vector3(bounds.center.x, bounds.yMax - 1.2f, 0f);
        current.transform.position = spawnPoint;
        current.transform.rotation = Quaternion.Euler(0f,
            def.allowYawFlip && Random.value < 0.5f ? 180f : 0f, 0f);
        current.Held.Attach();

        current.Settled += OnPieceSettled;
        current.FailedToSettle += OnPieceFailed;
        Current = Phase.AwaitingGrab;
    }

    PieceDefinition PickWeighted()
    {
        float total = 0f;
        foreach (var d in Catalog) total += d.weightInPool;
        float r = Random.value * total;
        foreach (var d in Catalog) { r -= d.weightInPool; if (r <= 0f) return d; }
        return Catalog[Catalog.Count - 1];
    }

    void OnPieceSettled(PieceInstance p)
    {
        if (Current == Phase.GameOver) return;
        Score += 100; Stacked++;
        p.IsScored = true;
        p.SettledY = p.transform.position.y;
        scored.Add(p);
        HighestY = Mathf.Max(HighestY, p.SettledY);
        Rig.HighestSettledY = HighestY;
        StatusText = $"+100  ·  {Stacked} stacked  ·  {HighestY:0.0} m";
        QueueNext();
    }

    void OnPieceFailed(PieceInstance p)
    {
        if (Current == Phase.GameOver) return;
        if (p.HasContact) { OnPieceSettled(p); return; }  // wobbled forever but rests on tower: counts
        StatusText = "Never came to rest…";
        LosePiece();
    }

    public void HandleBodyCrossed(Rigidbody rb)
    {
        if (rb == null || Current == Phase.GameOver) return;
        var p = rb.GetComponent<PieceInstance>();
        if (p == null) return;

        if (p.IsScored) { Collapse(); return; }
        if (p == current) { StatusText = "Piece lost!"; LosePiece(); }
    }

    void LosePiece()
    {
        if (current != null)
        {
            allPieces.Remove(current);
            Destroy(current.gameObject);
            current = null;
        }
        Lives--;
        if (Lives <= 0) { EndRun("Out of pieces"); return; }
        QueueNext();
    }

    void Collapse() => EndRun($"Tower collapsed at {Stacked} stacked");

    void EndRun(string reason)
    {
        StatusText = reason;
        if (current != null && Current == Phase.Held) current.Held.Detach(0f);
        Current = Phase.GameOver;
    }

    void QueueNext()
    {
        current = null;
        pendingSpawn = true;
        nextSpawnAt = Time.time + nextPieceDelay;
        Current = Phase.Between;
    }

    void CheckCollapse()
    {
        for (int i = scored.Count - 1; i >= 0; i--)
        {
            var p = scored[i];
            if (p == null) { scored.RemoveAt(i); continue; }
            if (p.transform.position.y < p.SettledY - collapseDropDistance) { Collapse(); return; }
        }
    }

    Rect InsetBounds()
    {
        Rect b = Rig.WorldRectAtPlaneZ(0f);
        const float m = 0.7f;
        return Rect.MinMaxRect(b.xMin + m, b.yMin + m, b.xMax - m, b.yMax - m);
    }

    void HandleDebugKeys()
    {
        var kb = Keyboard.current;
        if (kb == null) return;
        if (kb.rKey.wasPressedThisFrame) BeginRun();
        if (kb.fKey.wasPressedThisFrame)
            Time.timeScale = Mathf.Approximately(Time.timeScale, 1f) ? 0.35f : 1f;
    }
}
```

### A.3.13 SimpleHUD.cs

```csharp
using UnityEngine;

[RequireComponent(typeof(ArcadeGameController))]
public sealed class SimpleHUD : MonoBehaviour
{
    ArcadeGameController game;
    GUIStyle big, small, center;

    void Awake() => game = GetComponent<ArcadeGameController>();

    void OnGUI()
    {
        if (big == null)
        {
            big = new GUIStyle(GUI.skin.label) { fontSize = 26, fontStyle = FontStyle.Bold };
            small = new GUIStyle(GUI.skin.label) { fontSize = 15 };
            center = new GUIStyle(GUI.skin.label) { alignment = TextAnchor.MiddleCenter, fontSize = 20 };
        }

        GUI.Label(new Rect(16, 12, 600, 40),
            $"STACKED {game.Stacked}    HEIGHT {game.HighestY:0.0} m", big);
        GUI.Label(new Rect(16, 50, 600, 30),
            $"SCORE {game.Score}    LIVES {new string('●', Mathf.Max(0, game.Lives))}", small);

        if (!string.IsNullOrEmpty(game.StatusText))
            GUI.Label(new Rect(Screen.width * 0.5f - 250f, 90f, 500f, 30), game.StatusText, center);

        if (game.Current == ArcadeGameController.Phase.GameOver)
        {
            center.fontSize = 34;
            GUI.Label(new Rect(Screen.width * 0.5f - 300f, Screen.height * 0.5f - 70f, 600f, 50f),
                "RUN OVER", center);
            center.fontSize = 19;
            GUI.Label(new Rect(Screen.width * 0.5f - 300f, Screen.height * 0.5f - 10f, 600f, 30f),
                $"{game.StatusText}  —  press R to restart", center);
            center.fontSize = 20;
        }

        small.fontSize = 13;
        GUI.Label(new Rect(16, Screen.height - 44, 900, 30),
            "Hold LMB on piece: grab/move  ·  Wheel or Q/E: rotate  ·  Release: drop  ·  R: restart  ·  F: slow-mo",
            small);
    }
}
```

### A.3.14 GameBootstrap.cs

```csharp
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.InputSystem.EnhancedTouch;

[DefaultExecutionOrder(-100)]
public sealed class GameBootstrap : MonoBehaviour
{
    [Header("Look (greybox)")]
    public Color skyTop = new Color(0.45f, 0.55f, 0.68f);
    public Color skyBottom = new Color(0.82f, 0.84f, 0.88f);

    void Awake()
    {
        EnhancedTouchSupport.Enable();

        TowerCameraRig rig = EnsureCamera();
        EnsureLight();
        CreateBackground(rig.Cam);
        PieceFactory.Prepare();
        CreatePedestal();
        CreateDepthWalls();

        var killObj = new GameObject("KillPlane");
        var kill = killObj.AddComponent<KillPlane>();
        kill.Rig = rig;

        var gameObj = new GameObject("GameController");
        var placement = gameObj.AddComponent<PlacementRig>();
        placement.cam = rig.Cam;

        var game = gameObj.AddComponent<ArcadeGameController>();
        game.Rig = rig;
        game.Placement = placement;
        game.Catalog = BuildDefaultCatalog();
        gameObj.AddComponent<SimpleHUD>();
    }

    TowerCameraRig EnsureCamera()
    {
        var cam = FindFirstObjectByType<Camera>();
        if (cam == null) cam = new GameObject("Main Camera").AddComponent<Camera>();
        cam.gameObject.tag = "MainCamera";
        cam.clearFlags = CameraClearFlags.SolidColor;
        cam.backgroundColor = skyBottom;
        cam.fieldOfView = 40f;
        cam.nearClipPlane = 0.3f;
        cam.farClipPlane = 120f;
        cam.transform.position = new Vector3(0f, 2f, -14f);
        return cam.GetComponent<TowerCameraRig>() ?? cam.gameObject.AddComponent<TowerCameraRig>();
    }

    void EnsureLight()
    {
        var light = FindFirstObjectByType<Light>();
        if (light == null)
        {
            var go = new GameObject("Sun");
            light = go.AddComponent<Light>();
            light.type = LightType.Directional;
            go.transform.rotation = Quaternion.Euler(45f, -25f, 0f);
        }
        light.shadows = LightShadows.Soft;
        light.shadowStrength = 0.55f;
    }

    void CreateBackground(Camera cam)
    {
        var shader = Shader.Find("ZENITH/GradientBackground");
        if (shader == null) return; // solid-color fallback already set on camera

        var quad = GameObject.CreatePrimitive(PrimitiveType.Quad);
        quad.name = "Background";
        Destroy(quad.GetComponent<Collider>());
        quad.transform.position = new Vector3(0f, 30f, 40f);
        quad.transform.rotation = Quaternion.Euler(0f, 180f, 0f); // face the camera (-Z looking +Z)
        quad.transform.localScale = new Vector3(220f, 140f, 1f);
        quad.GetComponent<Renderer>().shadowCastingMode = UnityEngine.Rendering.ShadowCastingMode.Off;

        var mat = new Material(shader);
        mat.SetColor("_TopColor", skyTop);
        mat.SetColor("_BottomColor", skyBottom);
        quad.GetComponent<Renderer>().sharedMaterial = mat;
    }

    void CreatePedestal()
    {
        var go = new GameObject("Pedestal");
        go.transform.position = new Vector3(0f, -0.55f, 0f);
        var bc = go.AddComponent<BoxCollider>();
        bc.size = new Vector3(3.6f, 1.1f, 2.4f);   // top surface exactly at y = 0

        var visual = GameObject.CreatePrimitive(PrimitiveType.Box);
        Destroy(visual.GetComponent<Collider>());
        visual.transform.SetParent(go.transform, false);
        visual.transform.localScale = new Vector3(3.6f, 1.1f, 2.4f);
        visual.GetComponent<Renderer>().sharedMaterial = PieceFactory.PedestalMaterial;
    }

    void CreateDepthWalls()   // the 2.5D “depth slab” from the master plan
    {
        foreach (float z in new[] { -0.85f, 0.85f })
        {
            var go = new GameObject($"DepthWall_z{z:0.00}");
            go.transform.position = new Vector3(0f, 40f, z);
            var bc = go.AddComponent<BoxCollider>();
            bc.size = new Vector3(60f, 140f, 0.3f);
        }
    }

    List<PieceDefinition> BuildDefaultCatalog()
    {
        var list = new List<PieceDefinition>
        {
            MakeDef("cube", DifficultyTier.Basic, 700f, 1f,
                Box(new Vector3(1f, 1f, 1f))),
            MakeDef("brick", DifficultyTier.Basic, 650f, 1f,
                Box(new Vector3(2f, 1f, 1f))),
            MakeDef("plank", DifficultyTier.Basic, 550f, 0.9f,
                Box(new Vector3(3f, 0.4f, 1f))),
            MakeDef("column", DifficultyTier.Basic, 700f, 0.7f,
                Box(new Vector3(0.7f, 2f, 0.7f))),
            MakeDef("cylinder", DifficultyTier.Intermediate, 600f, 0.6f,
                new ColliderSetup { type = PrimitiveType.Capsule, size = new Vector3(1f, 1f, 0f) }),
            MakeDef("sphere", DifficultyTier.Advanced, 600f, 0.4f,
                new ColliderSetup { type = PrimitiveType.Sphere, size = new Vector3(1f, 0f, 0f) }),
        };
        return list;
    }

    static ColliderSetup Box(Vector3 size) =>
        new() { type = PrimitiveType.Box, size = size };

    static PieceDefinition MakeDef(string id, DifficultyTier tier, float density,
                                   float weight, params ColliderSetup[] colliders)
    {
        var d = ScriptableObject.CreateInstance<PieceDefinition>();
        d.name = id; d.id = id; d.tier = tier;
        d.density = density; d.weightInPool = weight; d.colliders = colliders;
        return d;
    }
}
```

### A.3.15 GradientBackground.shader

```shader
Shader "ZENITH/GradientBackground"
{
    Properties
    {
        _TopColor ("Top", Color) = (0.45, 0.55, 0.68, 1)
        _BottomColor ("Bottom", Color) = (0.82, 0.84, 0.88, 1)
    }
    SubShader
    {
        Tags { "RenderType" = "Opaque" "RenderPipeline" = "UniversalPipeline" }
        Pass
        {
            HLSLPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            #include "Packages/com.unity.render-pipelines.universal/ShaderLibrary/Core.hlsl"

            struct Attributes { float4 positionOS : POSITION; float2 uv : TEXCOORD0; };
            struct Varyings  { float4 positionCS : SV_POSITION; float2 uv : TEXCOORD0; };

            half4 _TopColor, _BottomColor;

            Varyings vert (Attributes IN)
            {
                Varyings OUT;
                OUT.positionCS = TransformObjectToHClip(IN.positionOS.xyz);
                OUT.uv = IN.uv;
                return OUT;
            }

            half4 frag (Varyings IN) : SV_Target
            {
                return lerp(_BottomColor, _TopColor, IN.uv.y);
            }
            ENDHLSL
        }
    }
    FallBack Off
}
```

## A.4 Scene build steps

1. `File → New Scene` (Basic URP template) → save as `Assets/_Project/Scenes/M1_Greybox.unity`.
2. Delete the default `Main Camera` and `Directional Light` if present — the bootstrap recreates them. (If you leave them, the bootstrap reuses them.)
3. Create an empty GameObject named `Bootstrap` → add `GameBootstrap`.
4. Press **Play**.

## A.5 Controls & debug keys (M1)

| Input | Action |
|---|---|
| LMB hold on hovering piece | Grab |
| LMB drag | Move on placement plane |
| Mouse wheel / Q / E | Rotate around Z |
| LMB release | Drop (imparts clamped throw velocity) |
| R | Restart run |
| F | Toggle slow-mo (0.35×) |

## A.6 Verification checklist (M1 exit criteria)

- [ ] A stack of 6 cubes rests motionless for 60 s (drift < ~1 mm).
- [ ] A plank balanced on a cube edge holds ≥ 2 s when placed carefully.
- [ ] Dropping a cube from spawn height never tunnels or explodes on landing.
- [ ] Grabbing/releasing adds no visible energy spikes (piece doesn’t “pop”).
- [ ] Releasing while moving fast produces a short, clamped throw — never a cannon shot.
- [ ] Camera rises smoothly after the 3rd–4th stacked piece; never pans horizontally.
- [ ] Dropping a piece off the pedestal costs a life; losing all 3 ends the run.
- [ ] Pulling a scored piece out of the tower triggers collapse → RUN OVER.
- [ ] Steady 60 FPS with 25+ pieces in scene (desktop editor).

## A.7 Troubleshooting

| Symptom | Fix |
|---|---|
| Input does nothing | Player Settings → Active Input Handling = Input System Package (New); restart |
| Pink pieces/background | Project is not URP, or shader path differs; check `Shader.Find` names |
| Pieces jitter at rest | Confirm Solver Type = TGS; raise `Physics.defaultSolverIterations` toward 20 |
| Pieces feel icy | Verify `PieceFactory.Prepare()` ran (materials exist) and friction combine = Maximum |
| Grab raycast unreliable | Create the `Piece` layer; or rely on the 140 px proximity fallback |
| Piece spins forever on timeout | Intended: timeout with contact counts as settled; tune `timeoutSeconds` |

## A.8 Path from M1 to M2 (next work items)

1. **Next-piece preview**: second orthographic camera rendering the upcoming piece into a UI RawImage.
2. **Difficulty ramp**: replace flat weights with `AnimationCurve` per tier driven by `Stacked`.
3. **Risk bonus**: on settle, count contact points (`Physics.OverlapBox` + contacts) → bonus score.
4. **Two-player**: `TurnManager` wrapping the state machine; swap `CurrentPlayer` in `OnPieceSettled`.
5. **Theme crossfade**: `ThemeDefinition` + material property block lerp at height milestones.

---

# Part B — Level Workbench: Editor Tool Design

## B.0 Where this sits in the master plan

The Level Workbench is the authoring front-end for the Puzzle/Campaign framework (master plan §11) and is scheduled inside **M4**. It exists so that one designer can author, validate, and playtest a puzzle level in under 20 minutes without touching code or hand-editing YAML.

## B.1 Purpose & user stories

| Persona | Story |
|---|---|
| Designer | “I want to create a level, place floating anchors and goal zones with gizmos, and test it within seconds.” |
| Designer | “I want the tool to tell me when my level is broken (unreachable goals, empty sequences) before I ship it.” |
| Lead | “I want every level in the project listed in one window with completion status and stars from playtests.” |
| Producer | “I want pars suggested automatically so star tuning doesn’t take days.” |

Non-goals for v1: runtime in-game editing, multiplayer level previews, procedural level generation.

## B.2 Window layout

Open via menu `ZENITH → Level Workbench` (shortcut Ctrl/Cmd+Shift+L).

```
┌────────────────────────────────────────────────────────────────────────────┐
│  ZENITH Level Workbench     [Filter ▍________] [↻] [+ New] [⧉ Dup] [🗑]    │
├───────────────┬────────────────────────────────────────────────────────────┤
│ LEVELS        │  INSPECTOR                                                  │
│ ▾ World 1     │  Level w01_l03 · "Bridge the Gap"      [ Open in Scene ]   │
│   ● w01_l01 ✔ │  Theme: [Theme_Dawn ▾]   Par: pieces [5] time [60]         │
│   ◐ w01_l02   │  ──────────────────────────────────────────────────────────  │
│   ○ w01_l03   │  BOARD     [✔ include default pedestal]                     │
│ ▸ World 2     │  ANCHORS (2)                                    [+ Add]     │
│ ▸ World 3     │    ⚓ pillar_left   (−1.8, 0.0, 0.0)   1.0 × 2.0 × 1.0      │
│               │    ⚓ pillar_right  ( 1.8, 0.0, 0.0)   1.0 × 2.0 × 1.0      │
│               │  PIECES    Mode: [Fixed Order ▾]  (7 pieces)   [+ Add]      │
│               │    plank → column → plank → cube → cube → wedge → plank    │
│               │  OBJECTIVES (1)                                 [+ Add]     │
│               │    ◎ Connect Zones: zone_a ⇄ zone_b                         │
│               │  ZONES (2)                                      [+ Add]     │
│               │    ▣ zone_a  ConnectA  (−1.8, 2.1, 0)  1.0 × 0.5 × 1.0     │
│               │    ▣ zone_b  ConnectB  ( 1.8, 2.1, 0)  1.0 × 0.5 × 1.0     │
│               │  MODIFIERS (0)                                  [+ Add]     │
├───────────────┴────────────────────────────────────────────────────────────┤
│ VALIDATION                                                                  │
│   ⚠ L-06  No theme assigned – level will render with fallback palette      │
│   ✔ L-04  All zone references resolve                                       │
├────────────────────────────────────────────────────────────────────────────┤
│ Last test: ★★☆ · 4 pieces · 38.2 s        [ Validate ] [ ▶ Test ] [ Save ] │
└────────────────────────────────────────────────────────────────────────────┘
```

List symbols: `●` playtested & complete · `◐` authored, never playtested · `○` stub/empty.

## B.3 Data model (production spec)

These types are the shared contract between the Workbench, the `PuzzleModeController`, and the validator.

```csharp
using UnityEngine;

public enum PieceSequenceMode { FixedOrder, Bag }
public enum ZoneKind { ConnectA, ConnectB, Goal }

public sealed class LevelDefinition : ScriptableObject
{
    [Header("Placement")]
    public string levelId = "w01_l01";          // must match ^w\d{2}_l\d{2}$, unique
    public int worldIndex = 1;
    public string displayName = "New Level";
    public ThemeDefinition theme;

    [Header("Board")]
    public bool includeDefaultPedestal = true;
    public AnchorDefinition[] anchors = new AnchorDefinition[0];
    public ZoneDefinition[] zones = new ZoneDefinition[0];

    [Header("Pieces")]
    public PieceSequenceMode sequenceMode = PieceSequenceMode.FixedOrder;
    public PieceDefinition[] pieceSequence = new PieceDefinition[0]; // FixedOrder
    public PieceDefinition[] bagPool = new PieceDefinition[0];       // Bag
    public int bagDrawCount = 5;

    [Header("Goals (AND-combined)")]
    public Objective[] objectives = new Objective[0];

    [Header("Par (stars)")]
    public int parPiecesUsed = 5;
    public float parSeconds = 60f;

    [Header("Modifiers")]
    public LevelModifier[] modifiers = new LevelModifier[0];
}

[System.Serializable]
public struct AnchorDefinition
{
    public string name;
    public Vector3 position;       // local to level root (pedestal top center = origin)
    public Vector3 eulerAngles;
    public Vector3 boxSize;
    public bool isBreakable;       // post-M4 modifier support
}

[System.Serializable]
public struct ZoneDefinition
{
    public string name;            // referenced by objectives
    public ZoneKind kind;
    public Vector3 center;
    public Vector3 size;
}

public abstract class LevelModifier : ScriptableObject
{
    public abstract void Apply(GameObject levelRoot);   // e.g. WindModifier adds a force volume
}
```

Objective SOs (from master plan Appendix B.7) gain zone references for the puzzle set:

| Objective SO | Extra fields | Completion |
|---|---|---|
| `ReachHeightObjective` | `targetHeight` | `highestSettledY ≥ target` |
| `SurviveTimeObjective` | `seconds` | intact N s after last required piece settles |
| `PlaceAllPiecesObjective` | — | full sequence settled, none lost |
| `ConnectZonesObjective` | `zoneA`, `zoneB` (names) | BFS over live contact graph connects zones |
| `DeliverPieceObjective` | `zoneName` | the *marked* piece rests inside the zone |

## B.4 Scene-view authoring (proxy + handles)

Editing happens in a normal scene through a `LevelWorkbenchProxy` component; the workbench’s **Open in Scene** button finds-or-creates it and assigns the selected level. The proxy’s custom editor draws:

| Element | Handle | Color code |
|---|---|---|
| Anchors | Position handle + `BoxBoundsHandle` for size + rotation disc | Slate grey, label `⚓ name` |
| Zones | `BoxBoundsHandle` only (zones are triggers, not physical) | ConnectA green · ConnectB blue · Goal gold |
| Pedestal | Static gizmo (wire box) when `includeDefaultPedestal` | Theme-muted |
| Spawn column | Wire cylinder at (0, spawnY, 0) | White 20% — warns if anchors intersect it |

All edits go through `Undo.RecordObject(level, …)` + `EditorUtility.SetDirty(level)`, so full undo/redo works. The proxy is `[ExecuteAlways]` and compiles into builds harmlessly (stripped by stripping settings; never referenced at runtime).

## B.5 Workflow states

```
BROWSE ──select──► EDIT ──Open in Scene──► SCENE AUTHORING (handles)
   ▲                 │  ▲                        │
   │                 ▼  └───── auto-validate on change
   │              VALIDATE (issue panel)
   │                 │
   └──results◄── TEST (plays LevelTest scene, writes results JSON)
```

- **Edit**: embedded default inspector renders all SO fields (lists get Unity’s reorderable lists for free). Custom drawers add piece-picker dropdowns filtered to `PieceDefinition` assets and zone-name dropdowns on objectives.
- **Auto-validate**: any change triggers `LevelValidator.Run` (debounced 0.5 s); issues render in the bottom panel, click-to-ping offending asset/field.
- **Test**: see B.7.

## B.6 Validation rules

| Code | Sev | Rule |
|---|---|---|
| L-01 | Error | `levelId` matches `^w\d{2}_l\d{2}$` and is unique project-wide |
| L-02 | Error | At least one objective assigned |
| L-03 | Error | FixedOrder ⇒ sequence non-empty · Bag ⇒ pool non-empty and `bagDrawCount > 0` |
| L-04 | Error | Every zone name referenced by an objective exists in `zones[]` |
| L-05 | Error | `PlaceAllPiecesObjective` ⇒ `parPiecesUsed ≥ sequence length` |
| L-06 | Warn | No theme assigned |
| L-07 | Warn | Anchor AABB intersects the spawn column (likely spawn collision) |
| L-08 | Warn | Zone floats in air with nothing within 6 m below it (unreachable rest spot) |
| L-09 | Warn | Duplicate `displayName` inside the same world |
| L-10 | Info | Sequence longer than 12 pieces (pacing review) |

## B.7 Test harness flow

1. **Test Level** button:
   - `EditorPrefs.SetString("zenith.testLevelPath", AssetDatabase.GetAssetPath(level))`
   - Requires `Scenes/LevelTest.unity` open (or uses `EditorSceneManager.LoadSceneInPlayMode` as an upgrade), then `EditorApplication.isPlaying = true`.
2. `LevelTestHarness` (in LevelTest scene, `#if UNITY_EDITOR` guarded):
   - Loads the asset path from EditorPrefs, builds board (pedestal + anchors + translucent zone trigger visuals), feeds the sequence into `PuzzleModeController` in test mode.
   - Debug keys: `F1` spawn next · `F2` skip piece · `F3` slow-mo · `F4` contact visualization · `F5` insta-complete · `F9` restart level.
   - On completion/failure writes `Library/ZENITH_LevelTestResult.json`:

```json
{ "levelId": "w01_l03", "outcome": "complete", "piecesUsed": 4, "seconds": 38.2, "stars": 2 }
```

   - If workbench toggle **Auto-stop after test** is on → `EditorApplication.isPlaying = false`.
3. Workbench listens to `EditorApplication.playModeStateChanged → EnteredEditMode`, reads the result JSON, and shows the banner line (`★★☆ · 4 pieces · 38.2 s`) plus updates the list dot for that level.

## B.8 Par bot (stretch, post-M4)

Context-menu action on a level: **“Suggest par (bot)”**.

1. Bot policy: greedy center-of-support placement; per piece sample K = 12 candidate x-positions (and 0/90° rotations for boxes), choose the one minimizing resulting tower angular momentum after settle.
2. Run N = 10 headless playthroughs in an isolated `PhysicsScene` (`scene.Simulate` stepping at fixed dt, up to 4× speed).
3. Propose `parPiecesUsed = ceil(P75 of successful pieces)` and `parSeconds = median time`; writes suggestion into the validation panel (“Apply” button commits to the SO).
4. Documented caveat: physics variance means bot pars are starting points, not final values.

## B.9 Conventions & content pipeline

| Concern | Convention |
|---|---|
| Asset path | `Assets/_Project/Data/Levels/World{NN}/Level_w{NN}_l{MM}.asset` |
| Pieces / themes | `Data/Pieces/`, `Data/Themes/` (referenced, never duplicated) |
| Localization | `displayName` mirrored to string key `level.{levelId}.name` at localization pass |
| Addressables | One group per world (console memory budgets) |
| Versioning | Levels are plain assets → git-diffable; breaking schema changes bump a `[SerializeField] int schemaVersion` |

## B.10 Implementation skeletons

### B.10.1 LevelWorkbenchWindow.cs

```csharp
#if UNITY_EDITOR
using System.Collections.Generic;
using UnityEditor;
using UnityEngine;

public sealed class LevelWorkbenchWindow : EditorWindow
{
    const string TestLevelPrefKey = "zenith.testLevelPath";
    const string ResultPath = "Library/ZENITH_LevelTestResult.json";

    [MenuItem("ZENITH/Level Workbench %#l")]
    public static void Open() => GetWindow<LevelWorkbenchWindow>("Level Workbench");

    readonly List<LevelDefinition> catalog = new();
    readonly List<LevelValidator.Issue> issues = new();
    LevelDefinition selected;
    Editor cachedEditor;
    Vector2 listScroll, detailScroll;
    string filter = "";
    bool autoStopAfterTest = true;
    string lastResultBanner = "";

    void OnEnable()
    {
        RefreshCatalog();
        EditorApplication.playModeStateChanged += OnPlayModeChanged;
    }

    void OnDisable()
    {
        EditorApplication.playModeStateChanged -= OnPlayModeChanged;
        if (cachedEditor != null) DestroyImmediate(cachedEditor);
    }

    void RefreshCatalog()
    {
        catalog.Clear();
        foreach (string guid in AssetDatabase.FindAssets("t:LevelDefinition"))
        {
            var lvl = AssetDatabase.LoadAssetAtPath<LevelDefinition>(
                AssetDatabase.GUIDToAssetPath(guid));
            if (lvl != null) catalog.Add(lvl);
        }
        catalog.Sort((a, b) => string.Compare(a.levelId, b.levelId,
                       System.StringComparison.Ordinal));
    }

    void OnGUI()
    {
        DrawToolbar();
        EditorGUILayout.BeginHorizontal();
        DrawLevelList();
        DrawDetailPane();
        EditorGUILayout.EndHorizontal();
        DrawValidationPanel();
        DrawActionBar();
    }

    void DrawToolbar()
    {
        EditorGUILayout.BeginHorizontal(EditorStyles.toolbar);
        filter = EditorGUILayout.TextField(filter, EditorStyles.toolbarSearchField);
        if (GUILayout.Button("↻", EditorStyles.toolbarButton)) RefreshCatalog();
        if (GUILayout.Button("+ New", EditorStyles.toolbarButton)) CreateLevel();
        if (GUILayout.Button("⧉ Dup", EditorStyles.toolbarButton)) DuplicateSelected();
        GUI.enabled = selected != null;
        if (GUILayout.Button("🗑", EditorStyles.toolbarButton)) DeleteSelected();
        GUI.enabled = true;
        EditorGUILayout.EndHorizontal();
    }

    void DrawLevelList()
    {
        EditorGUILayout.BeginVertical(GUILayout.Width(230));
        listScroll = EditorGUILayout.BeginScrollView(listScroll);
        int currentWorld = -1;
        foreach (var lvl in catalog)
        {
            if (!string.IsNullOrEmpty(filter) &&
                !lvl.levelId.Contains(filter) &&
                !lvl.displayName.ToLower().Contains(filter.ToLower())) continue;

            if (lvl.worldIndex != currentWorld)
            {
                currentWorld = lvl.worldIndex;
                EditorGUILayout.LabelField($"World {currentWorld}", EditorStyles.boldLabel);
            }

            string status = lvl.objectives is { Length: > 0 } ? "●" : "○";
            var style = lvl == selected ? EditorStyles.helpBox : EditorStyles.label;
            if (GUILayout.Button($"  {status} {lvl.levelId}  {lvl.displayName}", style))
                Select(lvl);
            // TODO: context menu (rename id, move world, duplicate), star dots from last result
        }
        EditorGUILayout.EndScrollView();
        EditorGUILayout.EndVertical();
    }

    void DrawDetailPane()
    {
        detailScroll = EditorGUILayout.BeginScrollView(detailScroll);
        if (selected == null)
        {
            EditorGUILayout.HelpBox("Select or create a level.", MessageType.Info);
        }
        else
        {
            EditorGUILayout.BeginHorizontal();
            EditorGUILayout.LabelField($"{selected.levelId} · \"{selected.displayName}\"",
                                       EditorStyles.boldLabel);
            if (GUILayout.Button("Open in Scene", GUILayout.Width(120))) OpenProxyInScene();
            EditorGUILayout.EndHorizontal();

            if (cachedEditor == null || cachedEditor.target != selected)
            {
                if (cachedEditor != null) DestroyImmediate(cachedEditor);
                cachedEditor = Editor.CreateEditor(selected);
            }
            EditorGUI.BeginChangeCheck();
            cachedEditor.OnInspectorGUI();
            if (EditorGUI.EndChangeCheck()) Validate();   // debounced in real impl
        }
        EditorGUILayout.EndScrollView();
    }

    void DrawValidationPanel()
    {
        EditorGUILayout.LabelField("Validation", EditorStyles.boldLabel);
        foreach (var issue in issues)
        {
            var type = issue.severity switch
            {
                LevelValidator.Severity.Error => MessageType.Error,
                LevelValidator.Severity.Warn  => MessageType.Warning,
                _ => MessageType.Info
            };
            EditorGUILayout.HelpBox($"{issue.code}  {issue.message}", type);
            // TODO: click-to-ping the offending field
        }
    }

    void DrawActionBar()
    {
        EditorGUILayout.BeginHorizontal();
        EditorGUILayout.LabelField(lastResultBanner, GUILayout.Width(320));
        GUILayout.FlexibleSpace();
        autoStopAfterTest = GUILayout.Toggle(autoStopAfterTest, "Auto-stop after test",
                                             GUILayout.Width(160));
        if (GUILayout.Button("Validate", GUILayout.Width(100))) Validate();
        GUI.enabled = selected != null;
        if (GUILayout.Button("▶ Test Level", GUILayout.Width(120))) TestSelectedLevel();
        GUI.enabled = true;
        EditorGUILayout.EndHorizontal();
    }

    void Select(LevelDefinition lvl) { selected = lvl; issues.Clear(); Validate(); }

    void Validate()
    {
        issues.Clear();
        if (selected != null) issues.AddRange(LevelValidator.Run(selected, catalog));
        Repaint();
    }

    void TestSelectedLevel()
    {
        EditorPrefs.SetString(TestLevelPrefKey, AssetDatabase.GetAssetPath(selected));
        EditorPrefs.SetBool(TestLevelPrefKey + ".autoStop", autoStopAfterTest);
        EditorApplication.isPlaying = true;
        // Robustness upgrade: EditorSceneManager.LoadSceneInPlayMode(testScenePath, cb)
    }

    void OnPlayModeChanged(PlayModeStateChange state)
    {
        if (state != PlayModeStateChange.EnteredEditMode) return;
        if (!System.IO.File.Exists(ResultPath)) return;
        // TODO: parse JSON -> lastResultBanner = "★★☆ · 4 pieces · 38.2 s"; update list dot
        Repaint();
    }

    void CreateLevel()
    {
        // TODO: create asset at Data/Levels/World01/..., unique id, Select() it
    }
    void DuplicateSelected() { /* TODO: Instantiate + new id + SaveAsset */ }
    void DeleteSelected()    { /* TODO: confirm dialog + AssetDatabase.DeleteAsset */ }
    void OpenProxyInScene()
    {
        // TODO: find LevelWorkbenchProxy in active scene or create one,
        //       proxy.level = selected; Selection.activeGameObject = proxy.gameObject;
    }
}
#endif
```

### B.10.2 LevelValidator.cs (shape)

```csharp
#if UNITY_EDITOR
using System.Collections.Generic;
using UnityEditor;
using UnityEngine;

public static class LevelValidator
{
    public enum Severity { Error, Warn, Info }
    public struct Issue { public Severity severity; public string code; public string message; }

    public static List<Issue> Run(LevelDefinition lvl, List<LevelDefinition> all)
    {
        var issues = new List<Issue>();
        // L-01 id format + uniqueness (scan `all`)
        // L-02 objectives.Length > 0
        // L-03 sequence/bag integrity
        // L-04 zone reference resolution (objectives with zoneA/zoneB/zoneName fields)
        // L-05 PlaceAllPieces vs parPiecesUsed
        // L-06 theme null check
        // L-07 anchor AABB vs spawn column (|x|<2 && y in [0, 8])
        // L-08 zone ground raycast (Physics.Raycast down 6 m in edit-mode physics scene)
        // L-09 duplicate display names per world
        // L-10 sequence length > 12 info
        return issues;
    }
}
#endif
```

### B.10.3 LevelWorkbenchProxy + scene handles

```csharp
using UnityEngine;

[ExecuteAlways]
public sealed class LevelWorkbenchProxy : MonoBehaviour
{
    public LevelDefinition level;
}

#if UNITY_EDITOR
using UnityEditor;
using UnityEditor.IMGUI.Controls;

[CustomEditor(typeof(LevelWorkbenchProxy))]
public sealed class LevelWorkbenchProxyEditor : Editor
{
    static readonly BoxBoundsHandle boxHandle = new();

    void OnSceneGUI()
    {
        var proxy = (LevelWorkbenchProxy)target;
        var lvl = proxy.level;
        if (lvl == null) return;

        if (lvl.anchors != null)
            for (int i = 0; i < lvl.anchors.Length; i++) DrawAnchor(proxy, lvl, i);
        if (lvl.zones != null)
            for (int i = 0; i < lvl.zones.Length; i++) DrawZone(proxy, lvl, i);
    }

    void DrawAnchor(LevelWorkbenchProxy proxy, LevelDefinition lvl, int i)
    {
        var a = lvl.anchors[i];
        Vector3 world = proxy.transform.TransformPoint(a.position);

        EditorGUI.BeginChangeCheck();
        Vector3 newWorld = Handles.PositionHandle(world, Quaternion.Euler(a.eulerAngles));
        if (EditorGUI.EndChangeCheck())
        {
            Undo.RecordObject(lvl, "Move Anchor");
            a.position = proxy.transform.InverseTransformPoint(newWorld);
            lvl.anchors[i] = a;
            EditorUtility.SetDirty(lvl);
        }

        boxHandle.center = world;
        boxHandle.size = a.boxSize;
        EditorGUI.BeginChangeCheck();
        boxHandle.DrawHandle();
        if (EditorGUI.EndChangeCheck())
        {
            Undo.RecordObject(lvl, "Resize Anchor");
            a.boxSize = boxHandle.size;
            lvl.anchors[i] = a;
            EditorUtility.SetDirty(lvl);
        }

        Handles.Label(world + Vector3.up * (a.boxSize.y * 0.5f + 0.3f), $"anchor: {a.name}");
        // TODO: rotation handle, per-face size snapping (0.1 m grid)
    }

    void DrawZone(LevelWorkbenchProxy proxy, LevelDefinition lvl, int i)
    {
        var z = lvl.zones[i];
        boxHandle.center = proxy.transform.TransformPoint(z.center);
        boxHandle.size = z.size;
        Handles.color = z.kind switch
        {
            ZoneKind.ConnectA => new Color(0.3f, 0.9f, 0.4f, 0.6f),
            ZoneKind.ConnectB => new Color(0.3f, 0.6f, 0.95f, 0.6f),
            _ => new Color(0.95f, 0.8f, 0.3f, 0.6f)
        };
        EditorGUI.BeginChangeCheck();
        boxHandle.DrawHandle();
        if (EditorGUI.EndChangeCheck())
        {
            Undo.RecordObject(lvl, "Edit Zone");
            z.size = boxHandle.size;
            lvl.zones[i] = z;
            EditorUtility.SetDirty(lvl);
        }
        Handles.Label(boxHandle.center + Vector3.up * (z.size.y * 0.5f + 0.2f),
                      $"zone: {z.name} ({z.kind})");
    }
}
#endif
```

## B.11 Build order & effort estimate

| Task | Effort |
|---|---|
| Data model + window shell + catalog list | 3 d |
| Detail pane, CRUD, reorderable piece sequence | 3 d |
| Proxy + scene handles/gizmos + undo | 4 d |
| Validator (rules L-01…L-10) | 2 d |
| Test harness + result round-trip + debug keys | 4 d |
| Polish: context menus, click-to-ping, star dots | 3 d |
| Buffer | 2 d |
| **Total** | **~4 weeks** (fits inside M4 alongside the runtime puzzle framework) |

Stretch backlog: par bot (B.8), world-map thumbnails rendered from level preview camera, bulk re-validate command for CI.

---

*End of follow-up document. Suggested next step: stand up Part A in a fresh project and run the A.6 checklist — expect tuning passes on solver iterations and throw clamp before M1 sign-off.*

***

# Project ZENITH — Follow-up Deliverable 2
### Part C: Level Workbench (Complete Editor Implementation)
### Part D: M2 Feature Set (Next-Piece Preview, Difficulty Ramp, 2P Versus)

| | |
|---|---|
| Companion document | `Project_ZENITH_ArtOfBalanceStyle_Unity6_ImplementationPlan.md` |
| Previous companion | `Project_ZENITH_M1_StarterKit_and_LevelWorkbench.md` |
| Focus | Editor tooling polish (C) and core gameplay evolution (D) |

---

# Part C — Level Workbench (Complete Editor Implementation)

In Part B, we defined the architecture and provided skeletons with `// TODO` markers. This section provides the production-ready editor code to make the Workbench a fully functional CRUD and authoring tool.

## C.1 Enhancing the Validation Data Model

To support "click-to-ping" in the inspector (jumping directly to the offending field), we need to track the `SerializedProperty` path in our issues.

```csharp
#if UNITY_EDITOR
using UnityEngine;
using UnityEditor;
using System.Collections.Generic;

public static class LevelValidator
{
    public enum Severity { Error, Warn, Info }

    public struct Issue
    {
        public Severity severity;
        public string code;
        public string message;
        public string propertyPath; // e.g., "pieceSequence.Array.data[2]" or "theme"
    }

    public static List<Issue> Run(LevelDefinition lvl, List<LevelDefinition> all)
    {
        var issues = new List<Issue>();

        // L-01: ID format and uniqueness
        if (!System.Text.RegularExpressions.Regex.IsMatch(lvl.levelId, @"^w\d{2}_l\d{2}$"))
            issues.Add(new Issue { severity = Severity.Error, code = "L-01", message = "Level ID must match format wXX_lXX.", propertyPath = "levelId" });

        foreach (var other in all)
        {
            if (other != lvl && other.levelId == lvl.levelId)
                issues.Add(new Issue { severity = Severity.Error, code = "L-01", message = $"Duplicate Level ID '{lvl.levelId}' found.", propertyPath = "levelId" });
        }

        // L-02: Objectives
        if (lvl.objectives == null || lvl.objectives.Length == 0)
            issues.Add(new Issue { severity = Severity.Error, code = "L-02", message = "At least one objective is required.", propertyPath = "objectives" });

        // L-03: Pieces integrity
        if (lvl.sequenceMode == PieceSequenceMode.FixedOrder && (lvl.pieceSequence == null || lvl.pieceSequence.Length == 0))
            issues.Add(new Issue { severity = Severity.Error, code = "L-03", message = "Fixed Order requires a non-empty sequence.", propertyPath = "pieceSequence" });

        if (lvl.sequenceMode == PieceSequenceMode.Bag && (lvl.bagPool == null || lvl.bagPool.Length == 0))
            issues.Add(new Issue { severity = Severity.Error, code = "L-03", message = "Bag mode requires a non-empty pool.", propertyPath = "bagPool" });

        // L-04: Zone references
        if (lvl.objectives != null)
        {
            foreach (var obj in lvl.objectives)
            {
                // Assuming objectives expose a GetReferencedZoneNames() or we check specific types
                if (obj is ConnectZonesObjective cz)
                {
                    if (!ZoneExists(lvl, cz.zoneAName))
                        issues.Add(new Issue { severity = Severity.Error, code = "L-04", message = $"Zone '{cz.zoneAName}' not found in zones array.", propertyPath = "objectives" });
                    if (!ZoneExists(lvl, cz.zoneBName))
                        issues.Add(new Issue { severity = Severity.Error, code = "L-04", message = $"Zone '{cz.zoneBName}' not found in zones array.", propertyPath = "objectives" });
                }
            }
        }

        // L-05: Par vs Pieces
        if (lvl.sequenceMode == PieceSequenceMode.FixedOrder && lvl.parPiecesUsed < lvl.pieceSequence.Length)
            issues.Add(new Issue { severity = Severity.Error, code = "L-05", message = "Par pieces must be >= sequence length for Fixed Order.", propertyPath = "parPiecesUsed" });

        // L-06: Theme
        if (lvl.theme == null)
            issues.Add(new Issue { severity = Severity.Warn, code = "L-06", message = "No theme assigned. Fallback palette will be used.", propertyPath = "theme" });

        // L-07: Spawn column collisions
        if (lvl.anchors != null)
        {
            for (int i = 0; i < lvl.anchors.Length; i++)
            {
                var a = lvl.anchors[i];
                // Spawn column is roughly x=0, z=0, radius ~1.5m
                if (Mathf.Abs(a.position.x) < 1.5f + a.boxSize.x * 0.5f && 
                    Mathf.Abs(a.position.z) < 1.5f + a.boxSize.z * 0.5f &&
                    a.position.y < 8f) // Only matters for low anchors blocking the spawn
                {
                    issues.Add(new Issue { severity = Severity.Warn, code = "L-07", message = $"Anchor '{a.name}' intersects the spawn column.", propertyPath = $"anchors.Array.data[{i}]" });
                }
            }
        }

        return issues;
    }

    static bool ZoneExists(LevelDefinition lvl, string name)
    {
        if (lvl.zones == null) return false;
        foreach (var z in lvl.zones) if (z.name == name) return true;
        return false;
    }
}
#endif
```

## C.2 Complete LevelWorkbenchWindow.cs (CRUD & Scene Handling)

```csharp
#if UNITY_EDITOR
using System.Collections.Generic;
using System.IO;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.SceneManagement;

public sealed class LevelWorkbenchWindow : EditorWindow
{
    const string TestLevelPrefKey = "zenith.testLevelPath";
    const string ResultPath = "Library/ZENITH_LevelTestResult.json";
    const string BaseAssetPath = "Assets/_Project/Data/Levels";

    [MenuItem("ZENITH/Level Workbench %#l")]
    public static void Open() => GetWindow<LevelWorkbenchWindow>("Level Workbench");

    readonly List<LevelDefinition> catalog = new();
    readonly List<LevelValidator.Issue> issues = new();
    LevelDefinition selected;
    Editor cachedEditor;
    SerializedObject serializedLevel;
    Vector2 listScroll, detailScroll;
    string filter = "";
    bool autoStopAfterTest = true;
    string lastResultBanner = "No test results yet.";

    void OnEnable()
    {
        RefreshCatalog();
        EditorApplication.playModeStateChanged += OnPlayModeChanged;
    }

    void OnDisable()
    {
        EditorApplication.playModeStateChanged -= OnPlayModeChanged;
        if (cachedEditor != null) DestroyImmediate(cachedEditor);
    }

    void RefreshCatalog()
    {
        catalog.Clear();
        foreach (string guid in AssetDatabase.FindAssets("t:LevelDefinition"))
        {
            var lvl = AssetDatabase.LoadAssetAtPath<LevelDefinition>(AssetDatabase.GUIDToAssetPath(guid));
            if (lvl != null) catalog.Add(lvl);
        }
        catalog.Sort((a, b) => string.Compare(a.levelId, b.levelId, System.StringComparison.Ordinal));
    }

    void OnGUI()
    {
        DrawToolbar();
        EditorGUILayout.BeginHorizontal();
        DrawLevelList();
        DrawDetailPane();
        EditorGUILayout.EndHorizontal();
        DrawValidationPanel();
        DrawActionBar();
    }

    void DrawToolbar()
    {
        EditorGUILayout.BeginHorizontal(EditorStyles.toolbar);
        filter = EditorGUILayout.TextField(filter, EditorStyles.toolbarSearchField);
        if (GUILayout.Button("↻", EditorStyles.toolbarButton, GUILayout.Width(25))) RefreshCatalog();
        if (GUILayout.Button("+ New", EditorStyles.toolbarButton, GUILayout.Width(50))) CreateLevel();
        GUI.enabled = selected != null;
        if (GUILayout.Button("⧉ Dup", EditorStyles.toolbarButton, GUILayout.Width(45))) DuplicateSelected();
        if (GUILayout.Button("🗑", EditorStyles.toolbarButton, GUILayout.Width(30))) DeleteSelected();
        GUI.enabled = true;
        GUILayout.FlexibleSpace();
        EditorGUILayout.EndHorizontal();
    }

    void DrawLevelList()
    {
        EditorGUILayout.BeginVertical(GUILayout.Width(230));
        listScroll = EditorGUILayout.BeginScrollView(listScroll);
        int currentWorld = -1;
        foreach (var lvl in catalog)
        {
            if (!string.IsNullOrEmpty(filter) &&
                !lvl.levelId.ToLower().Contains(filter.ToLower()) &&
                !lvl.displayName.ToLower().Contains(filter.ToLower())) continue;

            if (lvl.worldIndex != currentWorld)
            {
                currentWorld = lvl.worldIndex;
                EditorGUILayout.LabelField($"World {currentWorld}", EditorStyles.boldLabel);
            }

            string status = lvl.objectives is { Length: > 0 } ? "●" : "○";
            var style = lvl == selected ? EditorStyles.helpBox : EditorStyles.label;
            if (GUILayout.Button($"  {status} {lvl.levelId}  {lvl.displayName}", style))
                Select(lvl);
        }
        EditorGUILayout.EndScrollView();
        EditorGUILayout.EndVertical();
    }

    void DrawDetailPane()
    {
        detailScroll = EditorGUILayout.BeginScrollView(detailScroll);
        if (selected == null)
        {
            EditorGUILayout.HelpBox("Select or create a level.", MessageType.Info);
        }
        else
        {
            EditorGUILayout.BeginHorizontal();
            EditorGUILayout.LabelField($"{selected.levelId} · \"{selected.displayName}\"", EditorStyles.boldLabel);
            if (GUILayout.Button("Open in Scene", GUILayout.Width(120))) OpenProxyInScene();
            EditorGUILayout.EndHorizontal();

            if (serializedLevel == null || serializedLevel.targetObject != selected)
            {
                serializedLevel = new SerializedObject(selected);
                if (cachedEditor != null) DestroyImmediate(cachedEditor);
                cachedEditor = Editor.CreateEditor(selected);
            }

            serializedLevel.Update();
            EditorGUI.BeginChangeCheck();
            cachedEditor.OnInspectorGUI();
            if (EditorGUI.EndChangeCheck())
            {
                serializedLevel.ApplyModifiedProperties();
                Validate();
            }
        }
        EditorGUILayout.EndScrollView();
    }

    void DrawValidationPanel()
    {
        EditorGUILayout.LabelField("Validation", EditorStyles.boldLabel);
        if (issues.Count == 0 && selected != null)
        {
            EditorGUILayout.HelpBox("✔ Level is valid.", MessageType.Info);
        }

        foreach (var issue in issues)
        {
            var type = issue.severity switch
            {
                LevelValidator.Severity.Error => MessageType.Error,
                LevelValidator.Severity.Warn  => MessageType.Warning,
                _ => MessageType.Info
            };

            EditorGUILayout.BeginHorizontal(EditorStyles.helpBox);
            GUILayout.Label($"{issue.code}  {issue.message}", EditorStyles.wordWrappedLabel);
            GUILayout.FlexibleSpace();
            if (GUILayout.Button("Ping", GUILayout.Width(50)))
            {
                EditorGUIUtility.PingObject(selected);
                Selection.activeObject = selected;
                // Highlight specific property if possible
                if (!string.IsNullOrEmpty(issue.propertyPath) && serializedLevel != null)
                {
                    var prop = serializedLevel.FindProperty(issue.propertyPath);
                    if (prop != null)
                    {
                        // Scroll to property (approximation via expanding hierarchy)
                        // Highlighter.Highlight("LevelDefinition", prop.displayName); // Optional visual flash
                    }
                }
            }
            EditorGUILayout.EndHorizontal();
        }
    }

    void DrawActionBar()
    {
        EditorGUILayout.BeginHorizontal(EditorStyles.toolbar);
        GUILayout.Label(lastResultBanner, GUILayout.Width(320));
        GUILayout.FlexibleSpace();
        autoStopAfterTest = GUILayout.Toggle(autoStopAfterTest, "Auto-stop after test", GUILayout.Width(160));
        GUI.enabled = selected != null;
        if (GUILayout.Button("Validate", GUILayout.Width(100))) Validate();
        if (GUILayout.Button("▶ Test Level", GUILayout.Width(120))) TestSelectedLevel();
        GUI.enabled = true;
        EditorGUILayout.EndHorizontal();
    }

    void Select(LevelDefinition lvl)
    {
        selected = lvl;
        issues.Clear();
        serializedLevel = new SerializedObject(selected);
        if (cachedEditor != null) DestroyImmediate(cachedEditor);
        cachedEditor = Editor.CreateEditor(selected);
        Validate();
    }

    void Validate()
    {
        issues.Clear();
        if (selected != null) issues.AddRange(LevelValidator.Run(selected, catalog));
        Repaint();
    }

    void TestSelectedLevel()
    {
        if (issues.Exists(i => i.severity == LevelValidator.Severity.Error))
        {
            EditorUtility.DisplayDialog("Validation Failed", "Fix errors before testing.", "OK");
            return;
        }

        EditorPrefs.SetString(TestLevelPrefKey, AssetDatabase.GetAssetPath(selected));
        EditorPrefs.SetBool(TestLevelPrefKey + ".autoStop", autoStopAfterTest);
        EditorApplication.isPlaying = true;
        // Note: Assumes LevelTest scene is already added to Build Settings and loaded via a wrapper,
        // or that the user manually loads it. For robustness, use EditorSceneManager.LoadSceneInPlayMode.
    }

    void OnPlayModeChanged(PlayModeStateChange state)
    {
        if (state != PlayModeStateChange.EnteredEditMode) return;

        if (!File.Exists(ResultPath))
        {
            lastResultBanner = "Test aborted or no result file found.";
            Repaint();
            return;
        }

        try
        {
            string json = File.ReadAllText(ResultPath);
            var result = JsonUtility.FromJson<TestResult>(json);
            if (result != null && result.levelId == selected.levelId)
            {
                string stars = new string('★', result.stars) + new string('☆', 3 - result.stars);
                lastResultBanner = $"{stars} · {result.piecesUsed} pieces · {result.seconds:F1} s";
            }
        }
        catch (System.Exception e)
        {
            lastResultBanner = "Failed to parse test result.";
            Debug.LogWarning(e);
        }

        if (EditorPrefs.GetBool(TestLevelPrefKey + ".autoStop", true))
        {
            // Already in EditMode, just repaint
        }
        Repaint();
    }

    void CreateLevel()
    {
        string folderPath = EditorUtility.SaveFolderPanel("Select Level Folder", BaseAssetPath, "");
        if (string.IsNullOrEmpty(folderPath) || !folderPath.StartsWith(Application.dataPath))
            return;

        string relativePath = "Assets" + folderPath.Substring(Application.dataPath.Length);
        int count = AssetDatabase.FindAssets("t:LevelDefinition", new[] { relativePath }).Length + 1;
        string newId = $"w01_l{count:D2}";
        string assetPath = $"{relativePath}/Level_{newId}.asset";

        var newLevel = ScriptableObject.CreateInstance<LevelDefinition>();
        newLevel.levelId = newId;
        newLevel.worldIndex = 1;
        newLevel.displayName = "New Level";
        newLevel.includeDefaultPedestal = true;

        AssetDatabase.CreateAsset(newLevel, AssetDatabase.GenerateUniqueAssetPath(assetPath));
        AssetDatabase.SaveAssets();
        RefreshCatalog();
        Select(newLevel);
    }

    void DuplicateSelected()
    {
        if (selected == null) return;
        string path = AssetDatabase.GetAssetPath(selected);
        string dir = Path.GetDirectoryName(path);
        string newName = Path.GetFileNameWithoutExtension(path) + "_Copy";
        string newPath = $"{dir}/{newName}.asset";
        newPath = AssetDatabase.GenerateUniqueAssetPath(newPath);

        var copy = Object.Instantiate(selected);
        copy.levelId = selected.levelId + "_copy"; // Force unique ID to pass validation
        copy.displayName = selected.displayName + " (Copy)";
        AssetDatabase.CreateAsset(copy, newPath);
        AssetDatabase.SaveAssets();
        RefreshCatalog();
        Select(copy);
    }

    void DeleteSelected()
    {
        if (selected == null) return;
        if (EditorUtility.DisplayDialog("Delete Level?",
            $"Are you sure you want to delete '{selected.displayName}'?", "Delete", "Cancel"))
        {
            string path = AssetDatabase.GetAssetPath(selected);
            AssetDatabase.DeleteAsset(path);
            selected = null;
            serializedLevel = null;
            if (cachedEditor != null) DestroyImmediate(cachedEditor);
            RefreshCatalog();
            Repaint();
        }
    }

    void OpenProxyInScene()
    {
        if (selected == null) return;

        // Ensure we are in a scene, not just the workbench window
        if (SceneManager.sceneCount == 0)
        {
            EditorSceneManager.NewScene(NewSceneSetup.DefaultGameObjects, NewSceneMode.Single);
        }

        // Find or create proxy
        LevelWorkbenchProxy proxy = Object.FindFirstObjectByType<LevelWorkbenchProxy>();
        if (proxy == null)
        {
            var go = new GameObject("LevelWorkbenchProxy");
            proxy = go.AddComponent<LevelWorkbenchProxy>();
        }

        proxy.level = selected;
        Selection.activeGameObject = proxy.gameObject;
        SceneView.FrameLastActiveSceneView();
    }

    [System.Serializable]
    class TestResult
    {
        public string levelId;
        public string outcome;
        public int piecesUsed;
        public float seconds;
        public int stars;
    }
}
#endif
```

## C.3 LevelTestHarness (JSON Writer)

To make the Workbench's `OnPlayModeChanged` parser work, the runtime `LevelTestHarness` needs to write the JSON when play mode ends.

```csharp
#if UNITY_EDITOR
using UnityEngine;
using UnityEditor;
using System.IO;

public class LevelTestHarness : MonoBehaviour
{
    public static LevelTestHarness Instance { get; private set; }

    [SerializeField] LevelDefinition testLevel;
    int piecesUsed;
    float startTime;
    bool completed;

    void Awake()
    {
        if (Instance != null) { Destroy(gameObject); return; }
        Instance = this;

        string path = EditorPrefs.GetString("zenith.testLevelPath");
        if (!string.IsNullOrEmpty(path))
        {
            testLevel = AssetDatabase.LoadAssetAtPath<LevelDefinition>(path);
            if (testLevel != null)
            {
                // TODO: Hook into PuzzleModeController to setup level
                startTime = Time.time;
            }
        }
    }

    // Called by PuzzleModeController on win/loss
    public void ReportLevelEnd(bool success, int pieces)
    {
        piecesUsed = pieces;
        completed = success;
        if (EditorPrefs.GetBool("zenith.testLevelPath.autoStop", true))
        {
            EditorApplication.isPlaying = false;
        }
    }

    void OnDisable()
    {
        if (!Application.isPlaying && testLevel != null)
        {
            var result = new LevelWorkbenchWindow.TestResult
            {
                levelId = testLevel.levelId,
                outcome = completed ? "complete" : "failed",
                piecesUsed = piecesUsed,
                seconds = Time.time - startTime,
                stars = completed ? CalculateStars() : 0
            };

            string json = JsonUtility.ToJson(result);
            File.WriteAllText("Library/ZENITH_LevelTestResult.json", json);
        }
    }

    int CalculateStars()
    {
        if (!completed) return 0;
        int stars = 1;
        if (piecesUsed <= testLevel.parPiecesUsed) stars++;
        if ((Time.time - startTime) <= testLevel.parSeconds) stars++;
        return Mathf.Min(stars, 3);
    }
}
#endif
```

---

# Part D — M2 Feature Set (Gameplay Evolution)

M1 proved the "Toy" (physics, feel, stacking). M2 proves the "Game" (progression, pacing, competition).

## D.1 Next-Piece Preview

**Concept:** A small UI element showing the piece the player will grab *after* the current one settles. Essential for planning.

**Implementation Strategy:**
1.  **RenderTexture & Camera:** Create a `RenderTexture` asset (e.g., 256x256). Add a second `Camera` in the scene, set its `targetTexture` to the RT, and set its `cullingMask` to a dedicated `Preview` layer.
2.  **Preview Spawner:** Spawn the next piece far away from the main scene (e.g., `x = 100, y = 0, z = 0`) on the `Preview` layer. Make it `isKinematic = true` so it doesn't fall. Add a slow continuous rotation to it so it's visually interesting.
3.  **UI:** Use a UI Toolkit `VisualElement` or uGUI `RawImage` to display the `RenderTexture`.

**Code Skeleton: `NextPiecePreview.cs`**

```csharp
using UnityEngine;

public class NextPiecePreview : MonoBehaviour
{
    public Camera previewCamera;
    public RenderTexture previewTexture;
    public Transform previewAnchor; // Empty GO at x=100, y=0, z=0

    PieceInstance currentPreview;
    int previewLayer;

    void Awake()
    {
        previewLayer = LayerMask.NameToLayer("Preview");
        if (previewCamera != null)
        {
            previewCamera.targetTexture = previewTexture;
            previewCamera.cullingMask = 1 << previewLayer;
        }
    }

    public void UpdatePreview(PieceDefinition def)
    {
        if (currentPreview != null) Destroy(currentPreview.gameObject);

        currentPreview = PieceFactory.Create(def);
        currentPreview.transform.SetParent(previewAnchor);
        currentPreview.transform.localPosition = Vector3.zero;
        currentPreview.transform.localRotation = Quaternion.identity;

        // Move to preview layer recursively
        SetLayerRecursively(currentPreview.gameObject, previewLayer);

        // Make kinematic and auto-rotate
        currentPreview.Body.isKinematic = true;
        var rotator = currentPreview.gameObject.AddComponent<SpinPreview>();
    }

    void SetLayerRecursively(GameObject go, int layer)
    {
        go.layer = layer;
        foreach (Transform t in go.transform) SetLayerRecursively(t.gameObject, layer);
    }
}

// Simple helper for rotating the preview piece
public class SpinPreview : MonoBehaviour
{
    void Update() => transform.Rotate(0f, 30f * Time.deltaTime, 0f);
}
```

## D.2 Difficulty Ramp

**Concept:** As the tower gets taller (or more pieces are placed), the piece pool shifts from safe, blocky shapes to dangerous, unstable shapes (spheres, cylinders, wedges).

**Implementation Strategy:**
1.  **Profile SO:** Create an `ArcadeDifficultyProfile` ScriptableObject. Instead of a flat `weightInPool`, each piece definition references a `DifficultyTier`, and the profile contains an `AnimationCurve` for each tier.
2.  **Evaluation:** When `PickWeighted()` is called, it passes the current `Stacked` count (or `HighestY`) to the profile. The profile evaluates the curves to get the *current* weights for each tier, multiplies by the piece's base weight, and rolls the dice.

**Code Skeleton: `ArcadeDifficultyProfile.cs`**

```csharp
using UnityEngine;

[CreateAssetMenu(menuName = "ZENITH/Arcade Difficulty Profile")]
public class ArcadeDifficultyProfile : ScriptableObject
{
    [System.Serializable]
    public struct TierCurve
    {
        public DifficultyTier tier;
        [Tooltip("X axis = pieces placed. Y axis = weight multiplier.")]
        public AnimationCurve weightOverTime;
    }

    public TierCurve[] tierCurves;

    public float GetWeight(PieceDefinition def, int piecesPlaced)
    {
        foreach (var tc in tierCurves)
        {
            if (tc.tier == def.tier)
            {
                float multiplier = tc.weightOverTime.Evaluate(piecesPlaced);
                return def.weightInPool * Mathf.Max(0f, multiplier);
            }
        }
        return 0f; // Tier not defined
    }
}
```

**Integration in `ArcadeGameController.cs`:**
Replace `PickWeighted()` logic:
```csharp
    public ArcadeDifficultyProfile difficultyProfile; // Assign in inspector

    PieceDefinition PickWeighted()
    {
        float total = 0f;
        var validPieces = new System.Collections.Generic.List<(PieceDefinition def, float weight)>();

        foreach (var d in Catalog)
        {
            float w = difficultyProfile != null
                ? difficultyProfile.GetWeight(d, Stacked)
                : d.weightInPool; // Fallback to flat weight if no profile

            if (w > 0f)
            {
                validPieces.Add((d, w));
                total += w;
            }
        }

        if (total <= 0f) return Catalog[0]; // Fallback

        float r = Random.value * total;
        foreach (var item in validPieces)
        {
            r -= item.weight;
            if (r <= 0f) return item.def;
        }
        return validPieces[validPieces.Count - 1].def;
    }
```

## D.3 Two-Player Alternating Turns (Versus Mode)

**Concept:** Local multiplayer on the same screen. Players alternate placing pieces. Shared tower, individual lives. If the tower collapses, the player who placed the *collapsing piece* loses immediately.

**Implementation Strategy:**
1.  **Turn Manager:** A new component `TurnManager` that wraps `ArcadeGameController`. It tracks `CurrentPlayerIndex` (0 or 1).
2.  **State Ownership:** Every `PieceInstance` needs an `OwnerPlayerIndex`. When a piece is spawned, it is tagged with the current player.
3.  **Visual Feedback:** The held piece and the player's UI elements (score, lives) are tinted with their color (e.g., Blue vs Orange).
4.  **Resolution Logic:**
    *   *Settle:* Pass turn.
    *   *Drop (off pedestal):* Active player loses 1 life, pass turn.
    *   *Collapse:* Find the highest scored piece that moved. If its `OwnerPlayerIndex` is P1, P1 loses. Game over.

**Data Model Tweaks:**
Add to `PieceInstance.cs`:
```csharp
    public int OwnerPlayerIndex { get; set; }
```

Add to `ArcadeGameController.cs`:
```csharp
    public int CurrentPlayerIndex { get; protected set; } = 0;
    public int[] PlayerLives = new int[2] { 3, 3 };
    public Color[] PlayerColors = new Color[2] { Color.blue, Color.orange };
```

**Code Skeleton: `VersusModeController.cs`** (Extends `ArcadeGameController`)

```csharp
public class VersusModeController : ArcadeGameController
{
    public event System.Action<int> OnTurnChanged; // passes new player index

    protected override void BeginRun()
    {
        base.BeginRun();
        CurrentPlayerIndex = 0;
        PlayerLives[0] = startingLives;
        PlayerLives[1] = startingLives;
        OnTurnChanged?.Invoke(CurrentPlayerIndex);
    }

    protected override void SpawnNext()
    {
        base.SpawnNext();
        if (current != null)
        {
            current.OwnerPlayerIndex = CurrentPlayerIndex;
            ApplyPlayerTint(current);
        }
    }

    void ApplyPlayerTint(PieceInstance p)
    {
        // Assuming piece shader has a _Tint or _Emission property
        // Or just change the material color temporarily for the held piece
        // For M2, we'll just log it or use a simple MaterialPropertyBlock
    }

    protected override void OnPieceSettled(PieceInstance p)
    {
        base.OnPieceSettled(p);
        PassTurn();
    }

    protected override void LosePiece()
    {
        // In Versus, dropping a piece costs the ACTIVE player a life
        PlayerLives[CurrentPlayerIndex]--;
        if (PlayerLives[CurrentPlayerIndex] <= 0)
        {
            EndRun($"Player {CurrentPlayerIndex + 1} ran out of lives!");
            return;
        }
        PassTurn();
    }

    protected override void Collapse()
    {
        // Find the piece that caused the collapse (the one that dropped the furthest/most recently)
        // For simplicity, assume the last settled piece or the piece currently falling is the culprit.
        // In a robust system, track the 'trigger' piece.
        EndRun($"Tower collapsed! Player {CurrentPlayerIndex + 1} loses!");
    }

    void PassTurn()
    {
        CurrentPlayerIndex = (CurrentPlayerIndex + 1) % 2;
        OnTurnChanged?.Invoke(CurrentPlayerIndex);
        // QueueNext() is already called by base methods, so the next spawn will pick up the new index.
    }
}
```

**UI Updates for 2P:**
The `SimpleHUD.cs` needs to be updated to show two sets of lives and scores, highlighting the active player.

```csharp
    void OnGUI()
    {
        // ... existing code ...

        // P1 UI (Left side, Blue)
        GUI.color = game.CurrentPlayerIndex == 0 ? Color.white : Color.gray;
        GUI.Label(new Rect(16, 12, 300, 40),
            $"P1 SCORE {game.GetScore(0)}    LIVES {new string('●', Mathf.Max(0, game.PlayerLives[0]))}", big);

        // P2 UI (Right side, Orange)
        GUI.color = game.CurrentPlayerIndex == 1 ? Color.white : Color.gray;
        GUI.Label(new Rect(Screen.width - 316, 12, 300, 40),
            $"P2 SCORE {game.GetScore(1)}    LIVES {new string('●', Mathf.Max(0, game.PlayerLives[1]))}", big);

        GUI.color = Color.white; // Reset
        // ...
    }
```

## D.4 M2 Exit Criteria & Verification

With M2 implemented, the game transitions from a "physics demo" to a "structured game."

**Verification Checklist:**

- [ ] **Next-Piece Preview:** The UI element correctly displays the upcoming piece. It rotates smoothly. It does not cast shadows or collide with the main scene.
- [ ] **Difficulty Ramp:** Placing 20+ pieces reliably triggers the spawn of Advanced/Expert tier pieces (spheres, wedges) according to the AnimationCurve. Early pieces are exclusively Basic tier.
- [ ] **Two-Player Turns:**
  - [ ] After P1 places a piece, the UI highlights P2, and P1's controls are ignored (or the tint changes).
  - [ ] If P1 drops a piece off the pedestal, P1 loses a life, and the turn passes to P2.
  - [ ] If the tower collapses, the game correctly identifies the active player (or the player who placed the collapsing piece) as the loser.
- [ ] **UI Polish:** HUD clearly distinguishes between Player 1 and Player 2 states.

---

*End of Part C & D. The next logical step would be **M3: Presentation & Juice**, focusing on the Theme System (gradient crossfades, palette swapping), the piece shader (rim lighting, instability tinting), and the audio framework (impact sounds mapped to mass/velocity, settle chimes).*

***

# Project ZENITH — Follow-up Deliverable 3
### Part E: M3 Presentation & Juice (Themes, Shaders, Audio)

| | |
|---|---|
| Companion document | `Project_ZENITH_ArtOfBalanceStyle_Unity6_ImplementationPlan.md` |
| Previous companion | `Project_ZENITH_PartC_WorkbenchAndM2Features.md` |
| Focus | Transitioning from "greybox physics toy" to "zen meditation game" via visual and audio feedback loops. |

---

# Part E — M3: Presentation & Juice

Milestone 3 is where the "feel" is locked. The physics (M1) and rules (M2) are solid; now we wrap them in the calm, minimalist, yet highly responsive presentation that defines the genre. 

This part covers the **Theme System**, deep dives into the **Shader Graph setup** (Piece and Background), and details the **Audio Framework** (physics-driven impacts and musicality).

---

## E.1 The Theme System (Director & Data)

The visual identity of the game changes as the tower grows. We avoid harsh cuts; instead, we use smooth 4-second crossfades driven by a `ThemeDirector`.

### E.1.1 Data Model: `ThemeDefinition`
```csharp
using UnityEngine;

[CreateAssetMenu(menuName = "ZENITH/Theme Definition")]
public class ThemeDefinition : ScriptableObject
{
    [Header("Background")]
    public Color skyTopColor = new Color(0.45f, 0.55f, 0.68f);
    public Color skyBottomColor = new Color(0.82f, 0.84f, 0.88f);
    public float hueDriftSpeed = 0.01f;

    [Header("Pieces")]
    public Color[] piecePalette = new Color[6];
    public Color pedestalColor = new Color(0.35f, 0.38f, 0.42f);
    public Color rimLightColor = Color.white;
    
    [Header("Audio")]
    public AudioClip ambientMusicTrack;
    
    [Header("Trigger")]
    [Tooltip("Height in meters at which this theme becomes active.")]
    public float activationHeight = 0f; 
}
```

### E.1.2 The `ThemeDirector`
The Director listens to `ArcadeGameController.HighestY` and manages the transitions.
```csharp
using System.Collections.Generic;
using UnityEngine;

public class ThemeDirector : MonoBehaviour
{
    public ArcadeGameController game;
    public List<ThemeDefinition> themes; // Ordered by activationHeight
    public Material backgroundMaterial;
    public MeshRenderer[] allPieceRenderers; // Updated dynamically by Spawner

    ThemeDefinition currentTheme;
    ThemeDefinition targetTheme;
    float transitionProgress = 1f; // 1 = complete
    const float TRANSITION_DURATION = 4f;

    void Start()
    {
        if (themes.Count > 0) ApplyThemeInstant(themes[0]);
    }

    void Update()
    {
        if (game == null) return;

        // Check for theme change
        float h = game.HighestY;
        ThemeDefinition nextTheme = currentTheme;
        for (int i = themes.Count - 1; i >= 0; i--)
        {
            if (h >= themes[i].activationHeight)
            {
                nextTheme = themes[i];
                break;
            }
        }

        if (nextTheme != targetTheme && transitionProgress >= 1f)
        {
            StartCrossfade(nextTheme);
        }

        if (transitionProgress < 1f)
        {
            transitionProgress += Time.deltaTime / TRANSITION_DURATION;
            ApplyCrossfadeLerp();
        }
    }

    void StartCrossfade(ThemeDefinition target)
    {
        currentTheme = targetTheme ?? target;
        targetTheme = target;
        transitionProgress = 0f;
        // Crossfade music via AudioDirector (see Part G)
        AudioDirector.Instance.CrossfadeMusic(target.ambientMusicTrack, TRANSITION_DURATION);
    }

    void ApplyCrossfadeLerp()
    {
        float t = Mathf.SmoothStep(0f, 1f, transitionProgress);
        
        // Background
        backgroundMaterial.SetColor("_TopColor", Color.Lerp(currentTheme.skyTopColor, targetTheme.skyTopColor, t));
        backgroundMaterial.SetColor("_BottomColor", Color.Lerp(currentTheme.skyBottomColor, targetTheme.skyBottomColor, t));
        
        // Pedestal & Global Palettes
        Color pedCol = Color.Lerp(currentTheme.pedestalColor, targetTheme.pedestalColor, t);
        PieceFactory.UpdatePedestalMaterial(pedCol);
    }

    void ApplyThemeInstant(ThemeDefinition theme)
    {
        targetTheme = currentTheme = theme;
        transitionProgress = 1f;
        backgroundMaterial.SetColor("_TopColor", theme.skyTopColor);
        backgroundMaterial.SetColor("_BottomColor", theme.skyBottomColor);
        PieceFactory.UpdatePedestalMaterial(theme.pedestalColor);
        AudioDirector.Instance.PlayMusic(theme.ambientMusicTrack);
    }
}
```

---

## E.2 Shader Graph Deep Dive (The Visuals)

We use URP Shader Graph for both the pieces and the background. The goal is a "matte clay/rubber" look with soft lighting.

### E.2.1 The "Zenith Piece" Shader
This shader must be **SRP Batcher compatible** so we can use `MaterialPropertyBlock` (MPB) to assign individual colors to pieces without breaking draw calls or creating material instances.

**Graph Breakdown:**
1.  **Base Color:** 
    *   Property: `_PieceColor` (Color, default white).
    *   Property: `_DangerTint` (Float, 0 to 1).
    *   *Math:* `Lerp(_PieceColor, Color(0.8, 0.2, 0.2), _DangerTint * 0.5)`. (Desaturates and shifts to red when unstable).
2.  **Smoothness:** 
    *   Property: `_Smoothness` (Float, default 0.15). Keeps reflections broad and soft, avoiding sharp specular highlights.
3.  **Rim Light (The "Zen" Glow):**
    *   *Node:* `Fresnel Effect` (Power = 3).
    *   Property: `_RimColor` (Color).
    *   Property: `_RimIntensity` (Float).
    *   *Math:* Multiply Fresnel output by `_RimColor * _RimIntensity`. Add this to the **Emission** slot. This makes the edges of the pieces softly glow against the background, ensuring silhouettes are always readable.
4.  **Instability Pulse (Optional):**
    *   *Node:* `Time` -> `Sine` -> `Remap (-1 to 1 -> 0 to 1)`.
    *   Multiply by `_DangerTint` and add to Emission. Creates a subtle breathing effect when the tower is swaying dangerously.

**Applying the MPB in Code (`PieceFactory.cs` update):**
```csharp
static MaterialPropertyBlock mpb;

public static void AssignPieceColor(Renderer rend, Color color)
{
    if (mpb == null) mpb = new MaterialPropertyBlock();
    rend.GetPropertyBlock(mpb);
    mpb.SetColor("_PieceColor", color);
    rend.SetPropertyBlock(mpb);
}

// Called when picking a color from the current Theme's palette:
public static Color GetRandomPaletteColor()
{
    var theme = ThemeDirector.Instance.CurrentTheme;
    return theme.piecePalette[Random.Range(0, theme.piecePalette.Length)];
}
```

### E.2.2 The Background Gradient Shader
Instead of a skybox (which curves and distorts at the edges), we use a camera-aligned quad placed at the far clipping plane.

**Graph Breakdown:**
1.  **UVs:** Use `Screen Position` (normalized) or `Object Space Z` depending on quad setup. Let's use UV.y for a vertical gradient.
2.  **Gradient:** `Lerp(_BottomColor, _TopColor, UV.y)`.
3.  **Hue Drift:** 
    *   Use a Custom Function node to convert RGB to HSV, add `Time * _HueDriftSpeed` to the Hue channel, and convert back to RGB. This creates an imperceptibly slow, calming color shift over a 10-minute run.
4.  **Anti-Banding (Noise):**
    *   Gradients often show ugly color banding. 
    *   *Node:* `Tiling and Offset` -> `Noise` (Simplex/Perlin).
    *   Multiply noise by a tiny amount (0.02) and *add* it to the final color. This dithers the gradient, completely eliminating banding without visible grain.

---

## E.3 Audio Framework Deep Dive (The Soundscape)

Audio in a physics stacker is 50% of the game feel. It must be diegetic, responsive, and never annoying. We implement an `AudioDirector` to manage pools and prevent audio clipping.

### E.3.1 Architecture & Pooling
Instantiating `AudioSource` components at runtime causes GC spikes. We use a pre-warmed pool.
```csharp
public class AudioDirector : MonoBehaviour
{
    public static AudioDirector Instance { get; private set; }
    
    [Header("Pools")]
    public AudioSource[] impactPool;
    public AudioSource[] scrapePool;
    
    [Header("Music")]
    public AudioSource musicSourceA;
    public AudioSource musicSourceB;
    AudioSource activeMusicSource;

    void Awake() { Instance = this; /* Init pools */ }

    public AudioSource GetImpactSource()
    {
        foreach (var src in impactPool)
            if (!src.isPlaying) return src;
        return null; // Pool exhausted, drop sound (better than allocating)
    }
}
```

### E.3.2 Physics-Driven Impacts
When a piece hits the tower, we calculate the **Impulse** (force over time) to determine volume, and use the piece's **Mass** to determine pitch.

**Code: `PieceAudio.cs` (Attached to every `PieceInstance`)**
```csharp
using UnityEngine;

[RequireComponent(typeof(AudioSource))] // Actually handled by pool, but conceptually here
public class PieceAudio : MonoBehaviour
{
    PieceInstance piece;
    float lastImpactTime = -1f;
    const float COOLDOWN = 0.05f; // Prevent audio spam during wobbles

    void Awake() => piece = GetComponent<PieceInstance>();

    void OnCollisionEnter(Collision col)
    {
        if (Time.time - lastImpactTime < COOLDOWN) return;

        // Calculate total impulse magnitude
        float impulse = 0f;
        foreach (var contact in col.contacts)
            impulse += contact.impulse.magnitude;

        // Ignore tiny bumps
        if (impulse < 0.5f) return; 

        lastImpactTime = Time.time;
        PlayImpactSound(impulse, piece.Body.mass);
    }

    void PlayImpactSound(float impulse, float mass)
    {
        AudioSource src = AudioDirector.Instance.GetImpactSource();
        if (src == null) return;

        AudioClip clip = GetClipForMaterial(piece.Definition.materialType);
        
        // Map impulse to volume (logarithmic curve feels better than linear)
        float volume = Mathf.Clamp01(Mathf.Log10(impulse) * 0.5f);
        
        // Map mass to pitch (heavier = lower)
        float basePitch = Mathf.Lerp(1.2f, 0.6f, Mathf.Clamp01(mass / 10f));
        float pitch = basePitch * Random.Range(0.95f, 1.05f); // Slight randomization

        src.transform.position = transform.position;
        src.pitch = pitch;
        src.PlayOneShot(clip, volume);
    }
    
    AudioClip GetClipForMaterial(PieceMaterialType type)
    {
        // Return from a pre-loaded dictionary of clips (Wood thuds, Stone clacks, etc.)
        return AudioDirector.Instance.GetMaterialClip(type);
    }
}
```

### E.3.3 The "Settle Chime" (Musicality)
This is the dopamine hit. When a piece settles, we play a chime. To make it musical, we use a **Pentatonic Scale** (which guarantees no dissonant notes) and step up the scale with every successful placement.

**Code: `SettleChimePlayer.cs`**
```csharp
using UnityEngine;

public class SettleChimePlayer : MonoBehaviour
{
    // C Major Pentatonic frequencies (C4, D4, E4, G4, A4, C5...)
    float[] scaleFrequencies = { 261.63f, 293.66f, 329.63f, 392.00f, 440.00f, 523.25f };
    
    public AudioClip chimeSample; // A soft mallet, kalimba, or bell
    int noteIndex = 0;

    void Start()
    {
        if (ArcadeGameController.Instance != null)
        {
            ArcadeGameController.Instance.OnPieceSettled += PlayChime;
            ArcadeGameController.Instance.OnRunStarted += ResetScale;
        }
    }

    void ResetScale() => noteIndex = 0;

    void PlayChime(PieceInstance p)
    {
        AudioSource src = AudioDirector.Instance.GetImpactSource(); // Reuse pool
        if (src == null) return;

        src.transform.position = p.transform.position;
        src.clip = chimeSample;
        
        // Pitch shift based on scale
        float pitch = scaleFrequencies[noteIndex % scaleFrequencies.Length] / 261.63f; // Relative to C4
        src.pitch = pitch;
        src.PlayOneShot(chimeSample, 0.8f);

        noteIndex++;
    }
}
```

### E.3.4 Instability Drone (Tension)
When the `InstabilityProbe` (from Part A) detects a high center of mass and low contact area, we fade in a low, rumbling drone.

```csharp
public class InstabilityAudio : MonoBehaviour
{
    public AudioSource droneSource;
    public AnimationCurve volumeCurve; // 0 at 0.0, 1 at 1.0 instability
    
    void Update()
    {
        float maxInstability = 0f;
        // Poll all awake pieces in the tower
        foreach (var piece in TowerManager.Instance.AwakePieces)
        {
            maxInstability = Mathf.Max(maxInstability, piece.InstabilityValue);
        }

        float targetVol = volumeCurve.Evaluate(maxInstability);
        droneSource.volume = Mathf.Lerp(droneSource.volume, targetVol, Time.deltaTime * 2f);
        
        // Pitch drops slightly as instability rises (creates a "sinking" dread feeling)
        droneSource.pitch = Mathf.Lerp(1.0f, 0.8f, maxInstability);
    }
}
```

---

## E.4 VFX & Polish (Brief Overview)

VFX must remain subtle. The original game relies on physics, not particle explosions.

1.  **Landing Dust:**
    *   *Trigger:* `PieceAudio.PlayImpactSound` (if impulse > 2.0).
    *   *System:* A small Particle System (Puffy noise texture, no gravity, fast fade).
    *   *Scaling:* `particleSystem.shape.scale = impulse * 0.1f`.
    *   *Color:* Matches the current Theme's `pedestalColor` so it blends into the ground.
2.  **Splash (KillPlane):**
    *   *Trigger:* `KillPlane.BodyCrossed`.
    *   *System:* A flat, expanding ring decal (Projector or VFX Graph URP Decal) placed at the Y-level of the KillPlane.
    *   *Effect:* Creates the illusion that the pieces are falling into a deep void or liquid, rather than just disappearing into the skybox.

---

## E.5 M3 Exit Criteria & Verification

- [ ] **Visuals:** 
  - [ ] Pieces have a distinct matte look with soft rim lighting that separates them from the background.
  - [ ] Background gradient has no visible banding.
  - [ ] Theme crossfades smoothly over 4 seconds at the designated height milestones.
- [ ] **Audio:**
  - [ ] Impacts sound distinct based on mass (heavy cubes thud, light spheres clack).
  - [ ] Audio does not clip or stutter during tower collapses (pooling works).
  - [ ] Settle chimes step up a pentatonic scale correctly.
  - [ ] Instability drone fades in smoothly when the tower sways.
- [ ] **Performance:**
  - [ ] `MaterialPropertyBlock` usage keeps draw calls low (SRP Batcher active).
  - [ ] Audio sources are strictly pooled (no runtime `AddComponent<AudioSource>`).

---

*End of Part E. The game now looks and sounds like a finished product. The next logical step is **M4: Puzzle Framework & Content Pipeline**, where we implement the runtime logic for `LevelDefinition`, `Objective` evaluation (Connect Zones, Deliver Piece), and the `ContactGraph` BFS algorithm required for bridge-building levels.*

***

# Project ZENITH — Follow-up Deliverable 4
### Part F: M4 Puzzle Framework (Runtime + Contact Graph BFS)
### Part G: UI Toolkit Deep Dive (HUD, Menus, Navigation)

| | |
|---|---|
| Companion document | `Project_ZENITH_ArtOfBalanceStyle_Unity6_ImplementationPlan.md` |
| Previous companion | `Project_ZENITH_PartE_M3_Presentation_Audio_Shaders.md` |
| Focus | Turning the arcade toy into a campaign (F), and replacing greybox IMGUI with production UI (G) |

---

# Part F — M4: Puzzle Framework (Runtime)

## F.0 Corrections to previous parts

Two small fixes carried into this part:

1. **`TestResult` visibility** (Part C): the result class used by `LevelTestHarness` must not be nested-private inside `LevelWorkbenchWindow`. Move it to its own file:

```csharp
// _Project/Code/EditorBridge/TestResult.cs
[System.Serializable]
public class TestResult
{
    public string levelId;
    public string outcome;
    public int piecesUsed;
    public float seconds;
    public int stars;
}
```

2. **`ArcadeGameController` must be opened for extension** — see F.2.1.

## F.1 Architecture overview

```
LevelDefinition (asset, authored in Workbench)
        │  PuzzleModeController.LoadLevel(lvl)
        ▼
LevelBoardBuilder ──► pedestal + anchors (static colliders) + zones (ZoneTrigger)
        │
        ▼
PuzzleModeController (extends ArcadeGameController)
   ├─ piece queue (FixedOrder | Bag)         ← overrides PickNextPiece()
   ├─ ObjectiveRuntime[] (factory-created)   ← evaluated on every settle
   ├─ ContactGraph (piece↔piece edges)       ← fed by OnCollisionStay
   └─ LevelProgressStore (stars, unlocks)    ← written on completion
```

Key design decision: **Objective ScriptableObjects are data only.** Runtime state (timers, contact queries, marked pieces) lives in `ObjectiveRuntime` classes created by a factory. This keeps level assets immutable and test-friendly.

**Contact rule C-1 (documented for level designers):** the contact graph contains **piece↔piece edges only**. Static anchors/pedestal never transmit “connection” — otherwise ConnectZones puzzles would be trivially satisfied through the level geometry itself.

## F.2 Base class refactor (minimal patch to Part A)

```diff
- public sealed class ArcadeGameController : MonoBehaviour
+ public class ArcadeGameController : MonoBehaviour

  // New: UI/data notification
+ public event System.Action StatsChanged;

- PieceDefinition PickWeighted()
+ protected virtual PieceDefinition PickNextPiece()   // may return null (queue exhausted)

  // Virtualize the loop hooks:
- void BeginRun()            →  public virtual void BeginRun()
- void SpawnNext()           →  protected virtual void SpawnNext()
- void OnPieceSettled(...)   →  protected virtual void OnPieceSettled(...)
- void OnPieceFailed(...)    →  protected virtual void OnPieceFailed(...)
- void LosePiece()           →  protected virtual void LosePiece()
- void Collapse()            →  protected virtual void Collapse()
- void EndRun(string)        →  protected virtual void EndRun(string)
```

Add to `SpawnNext()`:

```csharp
PieceDefinition def = PickNextPiece();
if (def == null) { OnQueueExhausted(); return; }   // puzzle fail path
```

```csharp
protected virtual void OnQueueExhausted() { /* arcade never hits this */ }
```

Also add a stable identity to pieces (`PieceInstance.cs`):

```csharp
public int PieceId { get; private set; }
static int nextPieceId = 1;
// In Init(): PieceId = nextPieceId++;
```

## F.3 Contact Graph + BFS (deep dive)

### F.3.1 Data structure

- **Nodes:** `PieceInstance.PieceId`.
- **Edges:** unordered pair `(a, b)` stored once (`min << 32 | max`), with the **frame number** of the last observed contact.
- **Freshness:** edges are reported every `OnCollisionStay` (once per fixed frame per pair). On query, edges older than 3 frames are pruned — this correctly handles contacts that vanish because bodies fell asleep without a clean `OnCollisionExit`.
- **Query cost:** O(V + E) BFS, executed **only on settle events**, never per frame. With ≤ 120 pieces this is microseconds.

### F.3.2 ContactGraph.cs (complete)

```csharp
using System.Collections.Generic;
using UnityEngine;

public sealed class ContactGraph : MonoBehaviour
{
    public static ContactGraph Instance { get; private set; }
    const int StaleFrameMargin = 3;

    readonly Dictionary<long, int> lastSeenFrame = new();
    readonly Dictionary<int, HashSet<int>> adjacency = new();

    void Awake() => Instance = this;

    static long Key(int a, int b)
    {
        int min = Mathf.Min(a, b), max = Mathf.Max(a, b);
        return ((long)min << 32) | (uint)max;
    }

    public void ReportContact(int a, int b)
    {
        long k = Key(a, b);
        lastSeenFrame[k] = Time.frameCount;

        if (!adjacency.TryGetValue(a, out var na)) { na = new HashSet<int>(); adjacency[a] = na; }
        if (!adjacency.TryGetValue(b, out var nb)) { nb = new HashSet<int>(); adjacency[b] = nb; }
        na.Add(b); nb.Add(a);
    }

    public void ReportSeparation(int a, int b)
    {
        lastSeenFrame.Remove(Key(a, b));
        if (adjacency.TryGetValue(a, out var na)) na.Remove(b);
        if (adjacency.TryGetValue(b, out var nb)) nb.Remove(a);
    }

    public void ForgetPiece(int id)
    {
        if (adjacency.Remove(id, out var neighbors))
            foreach (int n in neighbors)
            {
                lastSeenFrame.Remove(Key(id, n));
                if (adjacency.TryGetValue(n, out var set)) set.Remove(id);
            }
    }

    public void Clear()
    {
        lastSeenFrame.Clear();
        adjacency.Clear();
    }

    /// BFS from any piece in `startIds` to any piece in `targetIds`.
    public bool PathExists(IEnumerable<int> startIds, HashSet<int> targetIds)
    {
        PruneStale();

        var queue = new Queue<int>();
        var visited = new HashSet<int>();
        foreach (int s in startIds)
        {
            if (targetIds.Contains(s)) return true;   // same piece sits in both zones
            if (visited.Add(s)) queue.Enqueue(s);
        }

        while (queue.Count > 0)
        {
            int id = queue.Dequeue();
            if (!adjacency.TryGetValue(id, out var neighbors)) continue;
            foreach (int n in neighbors)
            {
                if (targetIds.Contains(n)) return true;
                if (visited.Add(n)) queue.Enqueue(n);
            }
        }
        return false;
    }

    void PruneStale()
    {
        int cutoff = Time.frameCount - StaleFrameMargin;
        var deadKeys = new List<long>();
        foreach (var kv in lastSeenFrame)
            if (kv.Value < cutoff) deadKeys.Add(kv.Key);

        foreach (long k in deadKeys)
        {
            lastSeenFrame.Remove(k);
            int a = (int)(k >> 32), b = (int)(k & 0xFFFFFFFF);
            if (adjacency.TryGetValue(a, out var na)) na.Remove(b);
            if (adjacency.TryGetValue(b, out var nb)) nb.Remove(a);
        }
    }
}
```

### F.3.3 Feeding the graph (add to `PieceInstance.cs`)

```csharp
void OnCollisionStay(Collision collision)
{
    // Rule C-1: piece↔piece edges only
    var other = collision.gameObject.GetComponentInParent<PieceInstance>();
    if (other != null)
        ContactGraph.Instance?.ReportContact(PieceId, other.PieceId);
}

void OnCollisionExit(Collision collision)
{
    var other = collision.gameObject.GetComponentInParent<PieceInstance>();
    if (other != null)
        ContactGraph.Instance?.ReportSeparation(PieceId, other.PieceId);
}

void OnDestroy() => ContactGraph.Instance?.ForgetPiece(PieceId);
```

### F.3.4 Zones (`ZoneTrigger`)

```csharp
using System.Collections.Generic;
using UnityEngine;

[RequireComponent(typeof(BoxCollider))]
public sealed class ZoneTrigger : MonoBehaviour
{
    public ZoneDefinition Def;
    public HashSet<int> InsideIds { get; } = new();
    public HashSet<PieceInstance> Inside { get; } = new();

    void Awake()
    {
        var c = GetComponent<BoxCollider>();
        c.isTrigger = true;
        c.size = Def.size;
    }

    void OnTriggerEnter(Collider other)
    {
        var p = other.GetComponentInParent<PieceInstance>();
        if (p != null && Inside.Add(p)) InsideIds.Add(p.PieceId);
    }

    void OnTriggerExit(Collider other)
    {
        var p = other.GetComponentInParent<PieceInstance>();
        if (p != null && Inside.Remove(p)) InsideIds.Remove(p.PieceId);
    }
}
```

## F.4 Board builder (anchors, pedestal, zones)

```csharp
using System.Collections.Generic;
using UnityEngine;

public sealed class LevelBoardBuilder : MonoBehaviour
{
    public Transform root;
    readonly Dictionary<string, ZoneTrigger> zones = new();

    public ZoneTrigger GetZone(string name) =>
        zones.TryGetValue(name, out var z) ? z : null;

    public void Build(LevelDefinition lvl)
    {
        Clear();
        if (lvl.includeDefaultPedestal) CreatePedestal();
        if (lvl.anchors != null)
            foreach (var a in lvl.anchors) CreateAnchor(a);
        if (lvl.zones != null)
            foreach (var z in lvl.zones) CreateZone(z);
    }

    public void Clear()
    {
        zones.Clear();
        for (int i = root.childCount - 1; i >= 0; i--)
            Destroy(root.GetChild(i).gameObject);
        ContactGraph.Instance?.Clear();
    }

    void CreatePedestal()
    {
        var go = new GameObject("Pedestal");
        go.transform.SetParent(root, false);
        go.transform.localPosition = new Vector3(0f, -0.55f, 0f);
        go.AddComponent<BoxCollider>().size = new Vector3(3.6f, 1.1f, 2.4f);
        AddBoxVisual(go, new Vector3(3.6f, 1.1f, 2.4f), PieceFactory.PedestalMaterial);
    }

    void CreateAnchor(AnchorDefinition a)
    {
        var go = new GameObject($"Anchor_{a.name}");
        go.transform.SetParent(root, false);
        go.transform.localPosition = a.position;
        go.transform.localRotation = Quaternion.Euler(a.eulerAngles);
        go.AddComponent<BoxCollider>().size = a.boxSize;
        AddBoxVisual(go, a.boxSize, PieceFactory.PedestalMaterial);
    }

    void CreateZone(ZoneDefinition z)
    {
        var go = new GameObject($"Zone_{z.name}");
        go.transform.SetParent(root, false);
        go.transform.localPosition = z.center;
        go.AddComponent<BoxCollider>(); // sized in ZoneTrigger.Awake from Def
        var trigger = go.AddComponent<ZoneTrigger>();
        trigger.Def = z;
        zones[z.name] = trigger;

        Color c = z.kind switch
        {
            ZoneKind.ConnectA => new Color(0.30f, 0.90f, 0.40f, 0.18f),
            ZoneKind.ConnectB => new Color(0.30f, 0.60f, 0.95f, 0.18f),
            _                 => new Color(0.95f, 0.80f, 0.30f, 0.18f),
        };
        AddBoxVisual(go, z.size, MakeTransparentMaterial(c));
    }

    static void AddBoxVisual(GameObject parent, Vector3 size, Material mat)
    {
        var v = GameObject.CreatePrimitive(PrimitiveType.Box);
        Destroy(v.GetComponent<Collider>());
        v.transform.SetParent(parent.transform, false);
        v.transform.localScale = size;
        v.GetComponent<Renderer>().sharedMaterial = mat;
    }

    static Material MakeTransparentMaterial(Color color)
    {
        var m = new Material(Shader.Find("Universal Render Pipeline/Lit"));
        m.SetFloat("_Surface", 1f);                       // Transparent surface
        m.EnableKeyword("_SURFACE_TYPE_TRANSPARENT");
        m.SetColor("_BaseColor", color);
        m.renderQueue = (int)UnityEngine.Rendering.RenderQueue.Transparent;
        return m;
    }
}
```

## F.5 Objective runtime system

### F.5.1 Base + factory

```csharp
public abstract class ObjectiveRuntime
{
    public Objective def;
    public bool Completed { get; protected set; }

    public virtual void Reset(PuzzleModeController c) { Completed = false; }
    public virtual void Tick(PuzzleModeController c) { }
    public virtual void OnPieceSettled(PieceInstance p, PuzzleModeController c) { }
    public virtual void OnPieceLost(PuzzleModeController c) { }
    public abstract bool IsComplete(PuzzleModeController c);
    public abstract string ProgressLabel(PuzzleModeController c);

    protected void CheckComplete(PuzzleModeController c)
    {
        if (!Completed && IsComplete(c)) Completed = true;
    }
}

public static class ObjectiveRuntimeFactory
{
    public static ObjectiveRuntime Create(Objective def) => def switch
    {
        ReachHeightObjective   => new ReachHeightRuntime   { def = def },
        SurviveTimeObjective   => new SurviveTimeRuntime   { def = def },
        PlaceAllPiecesObjective=> new PlaceAllPiecesRuntime{ def = def },
        ConnectZonesObjective  => new ConnectZonesRuntime  { def = def },
        DeliverPieceObjective  => new DeliverPieceRuntime  { def = def },
        _ => throw new System.ArgumentException($"No runtime for {def.GetType().Name}")
    };
}
```

### F.5.2 Implementations

```csharp
public sealed class ReachHeightRuntime : ObjectiveRuntime
{
    ReachHeightObjective Def => (ReachHeightObjective)def;
    public override bool IsComplete(PuzzleModeController c) => c.HighestY >= Def.targetHeight;
    public override string ProgressLabel(PuzzleModeController c) =>
        $"{c.HighestY:0.0} / {Def.targetHeight:0.0} m";
}

public sealed class SurviveTimeRuntime : ObjectiveRuntime
{
    SurviveTimeObjective Def => (SurviveTimeObjective)def;
    float armedAt = -1f;

    public override void Reset(PuzzleModeController c) { base.Reset(c); armedAt = -1f; }

    public override void OnPieceSettled(PieceInstance p, PuzzleModeController c)
    {
        if (armedAt < 0f && c.AllPiecesDelivered) armedAt = Time.time;
    }

    public override bool IsComplete(PuzzleModeController c) =>
        armedAt >= 0f && Time.time - armedAt >= Def.seconds;

    public override string ProgressLabel(PuzzleModeController c) => armedAt < 0f
        ? "Place all pieces…"
        : $"{Mathf.Min(Time.time - armedAt, Def.seconds):0.0} / {Def.seconds:0.0} s";
}

public sealed class PlaceAllPiecesRuntime : ObjectiveRuntime
{
    public override bool IsComplete(PuzzleModeController c) =>
        c.PiecesSettledCount >= c.TotalPiecesInSequence;

    public override void OnPieceLost(PuzzleModeController c) =>
        c.FailLevel("A piece was lost — Place All is no longer possible.");

    public override string ProgressLabel(PuzzleModeController c) =>
        $"{c.PiecesSettledCount} / {c.TotalPiecesInSequence} placed";
}

public sealed class ConnectZonesRuntime : ObjectiveRuntime
{
    ConnectZonesObjective Def => (ConnectZonesObjective)def;

    public override void OnPieceSettled(PieceInstance p, PuzzleModeController c) =>
        CheckComplete(c);   // BFS only on settle events, never per frame

    public override bool IsComplete(PuzzleModeController c)
    {
        var za = c.Board.GetZone(Def.zoneAName);
        var zb = c.Board.GetZone(Def.zoneBName);
        if (za == null || zb == null || za.InsideIds.Count == 0) return false;
        return ContactGraph.Instance.PathExists(za.InsideIds, zb.InsideIds);
    }

    public override string ProgressLabel(PuzzleModeController c) =>
        Completed ? "Connected!" : "Bridge the zones";
}

public sealed class DeliverPieceRuntime : ObjectiveRuntime
{
    DeliverPieceObjective Def => (DeliverPieceObjective)def;

    public override void OnPieceSettled(PieceInstance p, PuzzleModeController c) =>
        CheckComplete(c);

    public override bool IsComplete(PuzzleModeController c)
    {
        var marked = c.MarkedPiece;
        if (marked == null || !marked.IsScored) return false;
        var zone = c.Board.GetZone(Def.zoneName);
        return zone != null && zone.Inside.Contains(marked);
    }

    public override string ProgressLabel(PuzzleModeController c) =>
        Completed ? "Delivered!" : "Deliver the marked piece";
}
```

`DeliverPieceObjective` data (add to the objective SO family):

```csharp
[CreateAssetMenu(menuName = "ZENITH/Objectives/Deliver Piece")]
public sealed class DeliverPieceObjective : Objective
{
    public string zoneName = "goal";
    public int markedPieceIndex = 0;   // index into FixedOrder sequence
}
```

## F.6 PuzzleModeController (complete)

```csharp
using System.Collections.Generic;
using UnityEngine;

public class PuzzleModeController : ArcadeGameController
{
    public LevelDefinition Level { get; private set; }
    public LevelBoardBuilder Board { get; private set; }
    public PieceInstance MarkedPiece { get; private set; }
    public int PiecesSettledCount { get; private set; }
    public int TotalPiecesInSequence { get; private set; }
    public float LevelTime { get; private set; }
    public bool AllPiecesDelivered => deliveredCount >= TotalPiecesInSequence;

    public event System.Action<PuzzleResult> LevelCompleted;
    public event System.Action<string> LevelFailed;

    readonly List<ObjectiveRuntime> objectives = new();
    readonly Queue<PieceDefinition> sequence = new();
    int deliveredCount;
    int markedIndex = -1;
    bool levelRunning;

    public IReadOnlyList<ObjectiveRuntime> Objectives => objectives;

    public void LoadLevel(LevelDefinition lvl)
    {
        Level = lvl;
        if (Board == null) Board = GetComponent<LevelBoardBuilder>();
        RestartLevel();
    }

    public void RestartLevel()
    {
        // Reset runtime state
        objectives.Clear();
        sequence.Clear();
        deliveredCount = 0;
        PiecesSettledCount = 0;
        LevelTime = 0f;
        markedIndex = -1;
        MarkedPiece = null;
        levelRunning = true;

        Board.Build(Level);
        ContactGraph.Instance?.Clear();

        // Build objective runtimes
        foreach (var o in Level.objectives)
        {
            var rt = ObjectiveRuntimeFactory.Create(o);
            rt.Reset(this);
            objectives.Add(rt);
            if (o is DeliverPieceObjective d) markedIndex = d.markedPieceIndex;
        }

        // Build piece queue
        TotalPiecesInSequence = 0;
        if (Level.sequenceMode == PieceSequenceMode.FixedOrder)
        {
            foreach (var p in Level.pieceSequence) sequence.Enqueue(p);
            TotalPiecesInSequence = Level.pieceSequence.Length;
        }
        else
        {
            for (int i = 0; i < Level.bagDrawCount; i++)
                sequence.Enqueue(Level.bagPool[Random.Range(0, Level.bagPool.Length)]);
            TotalPiecesInSequence = Level.bagDrawCount;
        }

        BeginRun(); // base class: clears tower, resets camera, spawns first piece
    }

    protected override PieceDefinition PickNextPiece()
    {
        if (sequence.Count == 0) return null;
        int index = deliveredCount;
        deliveredCount++;
        return sequence.Dequeue();
    }

    protected override void SpawnNext()
    {
        base.SpawnNext();
        // Mark deliver piece (gold rim via MPB)
        if (current != null && deliveredCount - 1 == markedIndex)
        {
            MarkedPiece = current;
            PieceFactory.MarkAsDeliverTarget(current);
        }
    }

    protected override void OnPieceSettled(PieceInstance p)
    {
        base.OnPieceSettled(p);
        PiecesSettledCount++;
        foreach (var o in objectives) o.OnPieceSettled(p, this);
        EvaluateCompletion();
    }

    protected override void LosePiece()
    {
        // Puzzle rule: drops consume the piece. No lives — finite supply.
        if (current != null) { Destroy(current.gameObject); current = null; }
        foreach (var o in objectives) o.OnPieceLost(this); // PlaceAll fails fast here
        if (!levelRunning) return;

        if (sequence.Count == 0 && !AllObjectivesComplete())
            FailLevel("Out of pieces.");
        else
            QueueNext();
    }

    protected override void OnQueueExhausted()
    {
        // All pieces placed but objectives incomplete (e.g., SurviveTime still running) → keep ticking
        if (!AllObjectivesComplete()) return; // Tick() will finish it or collapse will end it
    }

    protected override void Collapse()
    {
        if (!levelRunning) return;
        levelRunning = false;
        LevelFailed?.Invoke("The tower collapsed.");
    }

    void Update()
    {
        if (levelRunning)
        {
            LevelTime += Time.deltaTime;
            foreach (var o in objectives) o.Tick(this);
            EvaluateCompletion();
        }
    }

    bool AllObjectivesComplete()
    {
        foreach (var o in objectives)
            if (!o.Completed && !o.IsComplete(this)) return false;
        return true;
    }

    void EvaluateCompletion()
    {
        if (!levelRunning || objectives.Count == 0) return;
        foreach (var o in objectives) if (!o.Completed) o.CheckCompletePublic(this);
        if (AllObjectivesComplete()) CompleteLevel();
    }

    void CompleteLevel()
    {
        if (!levelRunning) return;
        levelRunning = false;

        int stars = 1;
        if (PiecesSettledCount <= Level.parPiecesUsed) stars++;
        if (LevelTime <= Level.parSeconds) stars++;

        LevelProgressStore.Instance.RecordResult(Level.levelId, stars, LevelTime, PiecesSettledCount);

        LevelCompleted?.Invoke(new PuzzleResult
        {
            levelId = Level.levelId,
            stars = stars,
            seconds = LevelTime,
            piecesUsed = PiecesSettledCount
        });
    }

    public void FailLevel(string reason)
    {
        if (!levelRunning) return;
        levelRunning = false;
        LevelFailed?.Invoke(reason);
    }
}

public struct PuzzleResult
{
    public string levelId;
    public int stars;
    public float seconds;
    public int piecesUsed;
}
```

> Note: `CheckCompletePublic` is a one-line public wrapper around `CheckComplete` on `ObjectiveRuntime` (protected in F.5.1). Add:
> ```csharp
> public void CheckCompletePublic(PuzzleModeController c) => CheckComplete(c);
> ```

## F.7 Progress & unlocking

```csharp
using System.Collections.Generic;
using System.IO;
using UnityEngine;

public sealed class LevelProgressStore : MonoBehaviour
{
    public static LevelProgressStore Instance { get; private set; }

    [System.Serializable]
    public class LevelRecord
    {
        public int stars;
        public float bestSeconds;
        public int bestPieces;
    }

    [System.Serializable]
    class SaveFile { public List<RecordEntry> records = new(); }

    [System.Serializable]
    class RecordEntry { public string id; public LevelRecord rec; }

    readonly Dictionary<string, LevelRecord> records = new();
    string SavePath => Path.Combine(Application.persistentDataPath, "progress.json");

    void Awake() { Instance = this; Load(); }

    void Load()
    {
        if (!File.Exists(SavePath)) return;
        try
        {
            var save = JsonUtility.FromJson<SaveFile>(File.ReadAllText(SavePath));
            foreach (var e in save.records) records[e.id] = e.rec;
        }
        catch (System.Exception e) { Debug.LogWarning($"Progress load failed: {e.Message}"); }
    }

    void Save()
    {
        var save = new SaveFile();
        foreach (var kv in records)
            save.records.Add(new RecordEntry { id = kv.Key, rec = kv.Value });
        File.WriteAllText(SavePath, JsonUtility.ToJson(save, true));
    }

    public void RecordResult(string levelId, int stars, float seconds, int pieces)
    {
        if (!records.TryGetValue(levelId, out var rec))
        {
            rec = new LevelRecord();
            records[levelId] = rec;
        }
        rec.stars = Mathf.Max(rec.stars, stars);
        rec.bestSeconds = rec.bestSeconds == 0f ? seconds : Mathf.Min(rec.bestSeconds, seconds);
        rec.bestPieces = rec.bestPieces == 0 ? pieces : Mathf.Min(rec.bestPieces, pieces);
        Save();
    }

    public int GetStars(string levelId) =>
        records.TryGetValue(levelId, out var r) ? r.stars : 0;

    public int TotalStarsInWorld(int worldIndex, IReadOnlyList<LevelDefinition> catalog)
    {
        int total = 0;
        foreach (var lvl in catalog)
            if (lvl.worldIndex == worldIndex) total += GetStars(lvl.levelId);
        return total;
    }

    public bool IsWorldUnlocked(int worldIndex, IReadOnlyList<LevelDefinition> catalog,
                                int starsRequired = 6)
    {
        if (worldIndex <= 1) return true;
        return TotalStarsInWorld(worldIndex - 1, catalog) >= starsRequired;
    }
}
```

## F.8 M4 exit criteria

- [ ] All 5 objective types complete correctly in play (manual matrix per objective).
- [ ] ConnectZones BFS: a bridge of 3+ pieces spanning two zones completes; a bridge resting only on an anchor does **not** (rule C-1).
- [ ] Dropping a piece with `PlaceAllPieces` active fails the level immediately with a clear message.
- [ ] Survive timer arms only after the last piece settles; collapse during the timer fails the level.
- [ ] Retry (`R`) restarts a level in < 0.3 s (no scene reload, board rebuilt in place).
- [ ] Stars compute against both pars; progress persists across app restarts.
- [ ] World 2 stays locked until World 1 has ≥ 6 stars.
- [ ] Workbench ▶ Test flow (Part C) runs levels through this exact runtime.

---

# Part G — UI Toolkit Deep Dive (HUD & Menus)

## G.1 Architecture

| Decision | Choice | Rationale |
|---|---|---|
| Framework | UI Toolkit (runtime UXML/USS) | Master plan §10; resolution-safe, localization-friendly, controller-friendly |
| Documents | Two `UIDocument`: **HUD** (sortOrder 10) + **Screens** (sortOrder 20) | HUD must render under pause/results overlays |
| Scaling | `PanelSettings` → Scale With Screen Size, reference 1920×1080 | One layout from handheld to 1080p |
| Data flow | Controllers subscribe to game **events**; continuous values via `schedule.Execute(...).Every(ms)` | No per-frame UI allocations |
| Navigation | EventSystem + `InputSystemUIInputModule`; focusable buttons; gamepad D-pad routed through a small `MenuNavigator` (G.7) | Works on all platforms without SDK specifics |

`UIManager` owns screen swapping:

```csharp
using UnityEngine;
using UnityEngine.UIElements;

public sealed class UIManager : MonoBehaviour
{
    public UIDocument screensDoc;
    VisualElement root;
    VisualElement currentScreen;

    void Awake()
    {
        root = screensDoc.rootVisualElement;
        ApplySafeArea(root);
    }

    public void ShowScreen(VisualElement screen)
    {
        if (currentScreen != null) currentScreen.style.display = DisplayStyle.None;
        currentScreen = screen;
        screen.style.display = DisplayStyle.Flex;
        FocusFirstButton(screen);
    }

    void FocusFirstButton(VisualElement screen)
    {
        var first = screen.Q<Button>();
        first?.Focus();
    }

    static void ApplySafeArea(VisualElement root)
    {
        Rect sa = Screen.safeArea;
        root.style.paddingLeft   = sa.x;
        root.style.paddingRight  = Screen.width - sa.xMax;
        root.style.paddingTop    = Screen.height - sa.yMax;
        root.style.paddingBottom = sa.y;
    }
}
```

## G.2 Design system (USS tokens)

`Assets/_Project/UI/zen-tokens.uss`:

```css
/* ============ ZENITH design tokens ============ */
.zen-root
{
    --zen-bg:        rgba(18, 22, 28, 0.55);
    --zen-bg-solid:  rgba(18, 22, 28, 0.92);
    --zen-text:      rgba(255, 255, 255, 0.82);
    --zen-text-dim:  rgba(255, 255, 255, 0.45);
    --zen-accent:    rgb(127, 178, 200);
    --zen-danger:    rgb(214, 98, 86);
    --zen-gold:      rgb(228, 192, 96);
    --zen-radius:    6px;
    --zen-pad:       16px;
    --zen-gap:       12px;
    --zen-touch:     48px;          /* minimum touch target (console/3DS/WiiU/Switch rule) */
    --zen-font-size-lg: 26px;
    --zen-font-size-md: 18px;
    --zen-font-size-sm: 13px;
}

/* Typography: light geometric sans, uppercase, wide tracking */
.zen-label
{
    color: var(--zen-text);
    font-size: var(--zen-font-size-md);
    -unity-font-style: normal;
    letter-spacing: 3px;
    -unity-text-align: middle-left;
}
.zen-label--lg   { font-size: var(--zen-font-size-lg); letter-spacing: 6px; }
.zen-label--dim  { color: var(--zen-text-dim); font-size: var(--zen-font-size-sm); }

/* Primary button */
.zen-button
{
    min-height: var(--zen-touch);
    padding: 10px 28px;
    margin: 4px 0;
    border-radius: var(--zen-radius);
    background-color: transparent;
    border-width: 1px;
    border-color: rgba(255, 255, 255, 0.18);
    color: var(--zen-text);
    font-size: var(--zen-font-size-md);
    letter-spacing: 4px;
    transition-property: background-color, border-color, color;
    transition-duration: 0.18s;
}
.zen-button:hover      { border-color: var(--zen-accent); }
.zen-button:focus      { border-color: var(--zen-accent); background-color: rgba(127, 178, 200, 0.12); }
.zen-button:active     { background-color: rgba(127, 178, 200, 0.25); }

/* Panel */
.zen-panel
{
    background-color: var(--zen-bg);
    border-radius: var(--zen-radius);
    padding: var(--zen-pad);
}
```

## G.3 HUD (in-game)

### G.3.1 UXML

`Assets/_Project/UI/HUD.uxml`:

```xml
<ui:UXML xmlns:ui="UnityEngine.UIElements" xmlns:uie="UnityEditor.UIElements">
    <ui:VisualElement name="hud-root" class="zen-root" style="flex-grow:1;">
        <!-- Top bar -->
        <ui:VisualElement name="top-bar" style="flex-direction:row; justify-content:space-between; padding:16px;">
            <ui:VisualElement name="p1-panel" class="zen-panel" style="min-width:220px;">
                <ui:Label name="p1-title" text="P1" class="zen-label--dim"/>
                <ui:Label name="p1-lives" text="● ● ●" class="zen-label"/>
            </ui:VisualElement>

            <ui:VisualElement style="align-items:center;">
                <ui:Label name="stacked-label" text="STACKED 0" class="zen-label zen-label--lg"/>
                <ui:Label name="height-label" text="0.0 m" class="zen-label--dim"/>
            </ui:VisualElement>

            <ui:VisualElement name="p2-panel" class="zen-panel" style="min-width:220px; align-items:flex-end;">
                <ui:Label name="p2-title" text="P2" class="zen-label--dim"/>
                <ui:Label name="p2-lives" text="● ● ●" class="zen-label"/>
            </ui:VisualElement>
        </ui:VisualElement>

        <!-- Puzzle-only: objective list (left) + piece sequence (right) -->
        <ui:VisualElement name="objective-panel" class="zen-panel"
                          style="position:absolute; left:16px; top:140px; min-width:260px;">
            <ui:Label text="OBJECTIVES" class="zen-label--dim"/>
            <ui:VisualElement name="objective-list"/>
        </ui:VisualElement>

        <ui:VisualElement name="sequence-bar" class="zen-panel"
                          style="position:absolute; right:16px; top:140px; align-items:flex-end;">
            <ui:Label text="NEXT" class="zen-label--dim"/>
            <ui:VisualElement name="sequence-icons" style="flex-direction:column-reverse;"/>
        </ui:VisualElement>

        <!-- Transient status line -->
        <ui:Label name="status-label" text=""
                  style="position:absolute; top:110px; width:100%; -unity-text-align:upper-center;"
                  class="zen-label"/>
    </ui:VisualElement>
</ui:UXML>
```

### G.3.2 HUDController

```csharp
using UnityEngine;
using UnityEngine.UIElements;

public sealed class HUDController : MonoBehaviour
{
    public UIDocument hudDoc;
    public ArcadeGameController game;
    public PuzzleModeController puzzle;   // null in arcade

    Label stacked, height, status, p1Lives, p2Lives;
    VisualElement p2Panel, objectiveList, sequenceIcons;

    void OnEnable()
    {
        var root = hudDoc.rootVisualElement;
        stacked      = root.Q<Label>("stacked-label");
        height       = root.Q<Label>("height-label");
        status       = root.Q<Label>("status-label");
        p1Lives      = root.Q<Label>("p1-lives");
        p2Lives      = root.Q<Label>("p2-lives");
        p2Panel      = root.Q("p2-panel");
        objectiveList = root.Q("objective-list");
        sequenceIcons = root.Q("sequence-icons");

        game.StatsChanged += RefreshStats;
        p2Panel.style.display = (game is VersusModeController) ? DisplayStyle.Flex : DisplayStyle.None;
        objectiveList.parent.style.display = puzzle != null ? DisplayStyle.Flex : DisplayStyle.None;
        sequenceIcons.parent.style.display = puzzle != null ? DisplayStyle.Flex : DisplayStyle.None;

        if (puzzle != null)
        {
            BuildObjectiveRows();
            puzzle.LevelCompleted += r => ShowResultBanner(r);
        }

        // Continuous values (height, timers) at 10 Hz — never per frame
        root.schedule.Execute(PollContinuous).Every(100);
        RefreshStats();
    }

    void OnDisable()
    {
        if (game != null) game.StatsChanged -= RefreshStats;
    }

    void RefreshStats()
    {
        stacked.text = $"STACKED {game.Stacked}";
        height.text  = $"{game.HighestY:0.0} m";
        status.text  = game.StatusText;

        if (game is VersusModeController versus)
        {
            p1Lives.text = new string('●', Mathf.Max(0, versus.PlayerLives[0]));
            p2Lives.text = new string('●', Mathf.Max(0, versus.PlayerLives[1]));
            p1Lives.style.color = versus.CurrentPlayerIndex == 0
                ? new StyleColor(versus.PlayerColors[0]) : new StyleColor(Color.gray);
            p2Lives.style.color = versus.CurrentPlayerIndex == 1
                ? new StyleColor(versus.PlayerColors[1]) : new StyleColor(Color.gray);
        }
        else
        {
            p1Lives.text = new string('●', Mathf.Max(0, game.Lives));
        }
    }

    void PollContinuous()
    {
        if (puzzle == null) return;
        for (int i = 0; i < objectiveRows.Count; i++)
            objectiveRows[i].Q<Label>("progress").text = puzzle.Objectives[i].ProgressLabel(puzzle);
    }

    readonly System.Collections.Generic.List<VisualElement> objectiveRows = new();

    void BuildObjectiveRows()
    {
        objectiveList.Clear();
        objectiveRows.Clear();
        foreach (var o in puzzle.Objectives)
        {
            var row = new VisualElement();
            row.style.flexDirection = FlexDirection.Row;
            row.Add(new Label("◎") { name = "check", style = { width = 24,
                        color = new StyleColor(new Color(0.9f, 0.8f, 0.4f)) } });
            row.Add(new Label(o.ProgressLabel(puzzle)) { name = "progress",
                        classList = { "zen-label" } });
            objectiveList.Add(row);
            objectiveRows.Add(row);
        }
    }

    void ShowResultBanner(PuzzleResult r)
    {
        string stars = new string('★', r.stars) + new string('☆', 3 - r.stars);
        status.text = $"{stars}  ·  {r.piecesUsed} pieces  ·  {r.seconds:0.0} s  —  R to retry";
    }
}
```

## G.4 Menus (Main Menu + Results)

### G.4.1 Main menu UXML

`Assets/_Project/UI/MainMenu.uxml`:

```xml
<ui:UXML xmlns:ui="UnityEngine.UIElements">
    <ui:VisualElement name="menu-root" class="zen-root"
                      style="flex-grow:1; align-items:center; justify-content:center;">
        <ui:Label name="title" text="P R O J E C T   Z E N I T H"
                  class="zen-label zen-label--lg" style="margin-bottom:48px;"/>
        <ui:VisualElement name="button-stack" style="align-items:center;">
            <ui:Button name="btn-play"    class="zen-button" text="PLAY"/>
            <ui:Button name="btn-modes"   class="zen-button" text="MODES"/>
            <ui:Button name="btn-options" class="zen-button" text="OPTIONS"/>
            <ui:Button name="btn-credits" class="zen-button" text="CREDITS"/>
        </ui:VisualElement>
        <ui:Label name="version" text="v0.4.0" class="zen-label--dim"
                  style="position:absolute; bottom:16px; right:16px;"/>
    </ui:VisualElement>
</ui:UXML>
```

### G.4.2 MainMenuController

```csharp
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UIElements;

public sealed class MainMenuController : MonoBehaviour
{
    public UIDocument doc;

    void OnEnable()
    {
        var root = doc.rootVisualElement;
        root.Q<Button>("btn-play").clicked    += () => LoadGame("Arcade");
        root.Q<Button>("btn-modes").clicked   += () => { /* open modes screen via UIManager */ };
        root.Q<Button>("btn-options").clicked += () => { /* open options screen */ };
        root.Q<Button>("btn-credits").clicked += () => { /* open credits screen */ };
        root.Q<Button>("btn-play").Focus();
    }

    void LoadGame(string mode) => SceneManager.LoadScene("Game");
}
```

### G.4.3 Results screen (post-run overlay)

Built dynamically by `UIManager` when `ArcadeGameController.Current == GameOver`:

```csharp
public VisualElement BuildResultsScreen(ArcadeGameController game, PuzzleResult? puzzleResult)
{
    var panel = new VisualElement { classList = { "zen-root" } };
    panel.style.alignItems = Align.Center;
    panel.style.justifyContent = Justify.Center;

    panel.Add(new Label("RUN OVER") { classList = { "zen-label", "zen-label--lg" } });

    if (puzzleResult is { } pr)
        panel.Add(new Label($"{new string('★', pr.stars)}{new string('☆', 3 - pr.stars)}")
            { style = { fontSize = 42, color = new StyleColor(new Color(0.9f, 0.8f, 0.4f)) } });

    panel.Add(new Label($"SCORE {game.Score}")   { classList = { "zen-label" } });
    panel.Add(new Label($"HEIGHT {game.HighestY:0.0} m") { classList = { "zen-label--dim" } });

    var retry = new Button(() => game.BeginRun()) { text = "RETRY", classList = { "zen-button" } };
    var menu  = new Button(() => SceneManager.LoadScene("Menu")) { text = "MENU", classList = { "zen-button" } };
    panel.Add(retry);
    panel.Add(menu);
    retry.Focus();
    return panel;
}
```

## G.5 Level select screen

```csharp
public sealed class LevelSelectController : MonoBehaviour
{
    public UIDocument doc;
    public List<LevelDefinition> catalog;
    public PuzzleModeController puzzleRunner;

    VisualElement grid;

    void OnEnable()
    {
        grid = doc.rootVisualElement.Q("level-grid");
        Rebuild();
    }

    public void Rebuild()
    {
        grid.Clear();
        int currentWorld = -1;

        foreach (var lvl in catalog)
        {
            if (lvl.worldIndex != currentWorld)
            {
                currentWorld = lvl.worldIndex;
                bool unlocked = LevelProgressStore.Instance.IsWorldUnlocked(currentWorld, catalog);
                grid.Add(new Label(unlocked ? $"WORLD {currentWorld}" : $"WORLD {currentWorld} ������")
                    { classList = { "zen-label", "zen-label--lg" } });
                if (!unlocked) continue;
            }

            int stars = LevelProgressStore.Instance.GetStars(lvl.levelId);
            var btn = new Button(() => StartLevel(lvl)) { classList = { "zen-button" } };
            btn.Add(new Label(lvl.displayName) { classList = { "zen-label" } });
            btn.Add(new Label(new string('★', stars) + new string('☆', 3 - stars))
                { style = { color = new StyleColor(new Color(0.9f, 0.8f, 0.4f)), fontSize = 14 } });
            grid.Add(btn);
        }
    }

    void StartLevel(LevelDefinition lvl)
    {
        SceneManager.LoadScene("Game");
        // PuzzleModeController in Game scene reads a static "levelToLoad" handoff:
        LevelHandoff.NextLevel = lvl;
    }
}

public static class LevelHandoff
{
    public static LevelDefinition NextLevel;
}
```

## G.6 Input & gamepad navigation

UI Toolkit provides Tab/Shift+Tab focus cycling natively. For D-pad/stick navigation on consoles we add a small navigator that translates input actions into focus moves and clicks:

```csharp
using UnityEngine;
using UnityEngine.InputSystem;
using UnityEngine.UIElements;

public sealed class MenuNavigator : MonoBehaviour
{
    public UIDocument doc;
    public InputActionAsset uiActions;   // actions: NavUp/Down/Left/Right, Submit, Cancel

    InputAction submit, cancel, up, down, left, right;

    void OnEnable()
    {
        submit = uiActions.FindAction("Submit");
        cancel = uiActions.FindAction("Cancel");
        up     = uiActions.FindAction("NavUp");
        down   = uiActions.FindAction("NavDown");
        left   = uiActions.FindAction("NavLeft");
        right  = uiActions.FindAction("NavRight");

        submit.performed += _ => ClickFocused();
        cancel.performed += _ => doc.rootVisualElement.panel
                                     .focusController.SwitchFocusOnNavigation(FocusChangeDirection.Backward);
        up.performed     += _ => Move(FocusChangeDirection.Previous);
        down.performed   += _ => Move(FocusChangeDirection.Next);
        left.performed   += _ => Move(FocusChangeDirection.Previous);
        right.performed  += _ => Move(FocusChangeDirection.Next);

        uiActions.Enable();
    }

    void OnDisable() => uiActions.Disable();

    void Move(FocusChangeDirection dir) =>
        doc.rootVisualElement.panel.focusController.SwitchFocusOnNavigation(dir);

    void ClickFocused()
    {
        var focused = doc.rootVisualElement.panel.focusController.focusedElement;
        if (focused is Button b) b.Click();
    }
}
```

Binding table for the `UI` action map (all control schemes):

| Action | Keyboard | Mouse | Gamepad | Touch |
|---|---|---|---|---|
| Submit | Enter / Space | Left click | A / Cross | Tap |
| Cancel | Esc | Right click | B / Circle | Back gesture |
| NavNext / NavPrev | Tab / Shift+Tab | — | D-pad, Left stick | — |

**Rules enforced by design:**
- Every interactive element has `min-height: 48px` (`--zen-touch`).
- Focus is always visible (`:focus` border + tint in tokens) — mandatory for console certification-style UX.
- First button auto-focused on every screen open (controller users never start in a dead state).

## G.7 Localization & accessibility hooks

```csharp
using System.Collections.Generic;
using UnityEngine;

public static class L10N
{
    static readonly Dictionary<string, string> table = new();

    public static void Load(TextAsset csv)
    {
        table.Clear();
        foreach (var line in csv.text.Split('\n'))
        {
            if (string.IsNullOrWhiteSpace(line) || line.StartsWith("#")) continue;
            int i = line.IndexOf(',');
            if (i <= 0) continue;
            table[line[..i].Trim()] = line[(i + 1)..].Trim();
        }
    }

    public static string Tr(string key) => table.TryGetValue(key, out var v) ? v : key;
}
```

Usage in UXML controllers: `btn.text = L10N.Tr("menu.play");`

Accessibility checklist wired into Options:

| Option | Implementation |
|---|---|
| Text size | Swap USS size tokens (`--zen-font-size-*`) on the root element |
| Colorblind-safe zones | Alt zone palette (tokens) + zone kind glyph in zone label (`A`, `B`, `G`) |
| Drop guide | Toggle in `PlacementRig` (master plan §6.4) |
| Rotation style | Step vs continuous (`RotationDriver` setting) |
| Reduced motion | Disables menu transitions + piece bob |

## G.8 Migration from IMGUI

1. Keep `SimpleHUD.cs` under `#if ZENITH_DEBUG` for the dev harness (M1–M3 behaviour).
2. `GameBootstrap` adds `HUDController` + HUD `UIDocument` instead of `SimpleHUD` in shipping builds.
3. Delete the IMGUI path after one milestone of parallel running.

## G.9 UI exit criteria

- [ ] All screens render correctly at 720p, 1080p, 1440p, and 21:9 (no clipping, safe areas respected).
- [ ] Full menu → level select → gameplay → results → retry loop completable with **gamepad only** and with **touch only**.
- [ ] Focus ring visible on every screen; first button focused on open.
- [ ] Zero per-frame UI allocations (Profiler: UI Toolkit render < 0.5 ms with HUD visible).
- [ ] Text swaps cleanly via `L10N.Load` (verify with a pseudo-locale: e.g., all-caps double-length strings).
- [ ] Touch targets ≥ 48 px verified with a debug overlay ruler.

---

*End of Parts F & G. Suggested next step: **M5 — Port Feature Layer** (touch schemes, virtual cursor, ghost towers, rumble/share abstractions, resume system), which completes everything testable on PC before any platform SDK arrives.*

***

# Project ZENITH — Follow-up Deliverable 5
### Part H: M5 Port Feature Layer (Touch, Virtual Cursor, Rumble/Share, Suspend/Resume, Time Attack, Daily)
### Part I: Subsystem Deep Dives (Ghost Replay Recorder · Touch Control Schemes)

| | |
|---|---|
| Companion document | `Project_ZENITH_ArtOfBalanceStyle_Unity6_ImplementationPlan.md` |
| Previous companion | `Project_ZENITH_PartF_M4_PuzzleFramework_and_UIToolkit.md` |
| Focus | Everything the console/handheld ports demand, implemented platform-agnostically so it is fully testable on PC |

---

# Part H — M5: Port Feature Layer

## H.1 Input Mode Manager (scheme switching)

All port-era features funnel through one question: **what is the player holding right now?** The `InputModeManager` answers it by polling device activity and publishes scheme changes. Nothing else in the codebase reads devices directly.

```csharp
using UnityEngine;
using UnityEngine.InputSystem;

public enum InputMode { MouseKeyboard, Touch, Gamepad }

public sealed class InputModeManager : MonoBehaviour
{
    public static InputModeManager Instance { get; private set; }

    public InputMode Current { get; private set; } = InputMode.MouseKeyboard;
    public event System.Action<InputMode> ModeChanged;

    const float ActiveWindow = 0.25f; // seconds since last device use

    void Awake() => Instance = this;

    void Update()
    {
        InputMode detected = Detect();
        if (detected != Current)
        {
            Current = detected;
            ModeChanged?.Invoke(Current);
        }
    }

    InputMode Detect()
    {
        float now = Time.unscaledTime;

        // Touch wins outright if any touch is active
        if (Touchscreen.current != null && Touchscreen.current.active)
            return InputMode.Touch;

        float padTime = Gamepad.current?.lastUpdateTime ?? -1f;
        float mouseTime = Mouse.current?.lastUpdateTime ?? -1f;
        float keyTime = Keyboard.current?.lastUpdateTime ?? -1f;

        if (padTime > now - ActiveWindow && padTime >= mouseTime && padTime >= keyTime)
            return InputMode.Gamepad;
        if (mouseTime > now - ActiveWindow || keyTime > now - ActiveWindow)
            return InputMode.MouseKeyboard;

        return Current; // stick with current when idle
    }
}
```

**Scheme switching effects (all subscribed to `ModeChanged`):**

| Listener | Reaction |
|---|---|
| `ArcadeGameController` | Swaps `IPointerSource` + `IGrabPolicy` (H.3 / I.2) |
| HUD (`HUDController`) | Swaps hint icons (LMB / finger / gamepad glyphs) |
| `MenuNavigator` (Part G) | Enabled only for Gamepad mode |
| Virtual cursor reticle | Visible only in Gamepad mode |

## H.2 Virtual Cursor (gamepad scheme)

The PS4/Switch-docked feel: left stick drives a reticle with an acceleration curve — slow and precise near the tower, fast in open space.

```csharp
using UnityEngine;
using UnityEngine.InputSystem;

public sealed class VirtualCursorPointerSource : IPointerSource
{
    public float baseSpeed = 1100f;      // px/s at multiplier 1.0
    public AnimationCurve accelCurve;    // x = normalized distance from tower center, y = multiplier

    public Vector2 TowerScreenCenter { get; set; } = new Vector2(Screen.width * 0.5f, Screen.height * 0.5f);

    Vector2 cursor = new Vector2(Screen.width * 0.5f, Screen.height * 0.62f);
    Gamepad pad;

    public void Poll()
    {
        pad = Gamepad.current;
        if (pad == null) return;

        Vector2 stick = pad.leftStick.ReadValue();
        if (stick.sqrMagnitude > 0.02f)
        {
            float dist01 = Mathf.Clamp01(
                Vector2.Distance(cursor, TowerScreenCenter) / (Screen.height * 0.45f));
            float mult = accelCurve != null ? accelCurve.Evaluate(dist01) : 1f + dist01 * 2f;

            cursor += stick * (baseSpeed * mult * Time.deltaTime);
            cursor.x = Mathf.Clamp(cursor.x, 8f, Screen.width - 8f);
            cursor.y = Mathf.Clamp(cursor.y, 8f, Screen.height - 8f);
        }
    }

    public Vector2 ScreenPosition => cursor;
    public bool IsPressed => pad != null && pad.buttonSouth.isPressed;
    public bool WasPressedThisFrame => pad != null && pad.buttonSouth.wasPressedThisFrame;
    public bool WasReleasedThisFrame => pad != null && pad.buttonSouth.wasReleasedThisFrame;
    public float ScrollDelta => 0f; // rotation comes from RB/LB via RotationDriver
}
```

**Reticle rendering (HUD):**

```csharp
// In HUDController, on ModeChanged:
VisualElement reticle; // <ui:VisualElement name="cursor-reticle" class="hud__reticle"/>

void UpdateReticle() // called from Update() when mode == Gamepad
{
    Vector2 p = virtualCursor.ScreenPosition;
    reticle.style.display = DisplayStyle.Flex;
    reticle.style.translate = new Translate(
        new Length(p.x, LengthUnit.Pixel),
        new Length(Screen.height - p.y, LengthUnit.Pixel)); // UI Toolkit y is top-down
}
```

```css
.hud__reticle
{
    width: 22px; height: 22px;
    border-radius: 11px;
    border-width: 2px;
    border-color: rgba(255,255,255,0.75);
    position: absolute;
    margin-left: -11px; margin-top: -11px; /* center on point */
}
```

**Button map (gamepad):** A/Cross grab & release · RB/LB rotate · D-pad fine nudge (1 cm steps, wired as tiny stick impulses) · Start pause.

## H.3 Touch scheme (overview)

The 3DS/Wii U/Switch-handheld lineage gets the deepest treatment — full deep dive in **Part I.2**, including grab policies, relative drag math, two-finger twist, and rotate button pads. M5 wiring requirement: `ArcadeGameController` accepts an injected `IGrabPolicy` so the grab rule changes per scheme:

```diff
+ public IGrabPolicy GrabPolicy { get; set; } = new PointerGrabPolicy();
- // UpdateAwaitingGrab raycast block replaced by:
- bool grab = /* raycast + proximity */;
+ bool grab = GrabPolicy.WantsGrab(pointer, current, Rig.Cam);
```

## H.4 Rumble abstraction

One interface; real implementations arrive with SDKs. On PC, DualShock/DualSense controllers actually rumble via the Input System — everything else is a safe no-op.

```csharp
public enum RumbleEvent { GrabTick, RotateStep, Landing, WobbleWarning, Collapse, Milestone }

public interface IRumbleProvider
{
    bool SupportsRumble(int playerIndex);
    /// intensity: 0..1 (impact scaling, wobble severity…)
    void Send(int playerIndex, RumbleEvent evt, float intensity = 1f);
    void Stop(int playerIndex);
}
```

```csharp
using UnityEngine;
using UnityEngine.InputSystem;

public sealed class GamepadRumbleProvider : IRumbleProvider
{
    // (lowFreq, highFreq, durationSeconds) per event
    static (float low, float high, float dur) Profile(RumbleEvent e, float i) => e switch
    {
        RumbleEvent.GrabTick       => (0.0f, 0.25f, 0.02f),
        RumbleEvent.RotateStep     => (0.0f, 0.18f, 0.015f),
        RumbleEvent.Landing        => (Mathf.Lerp(0.15f, 0.8f, i), 0.1f, 0.09f),
        RumbleEvent.WobbleWarning  => (0.45f, 0.0f, 0.35f),   // looping while danger > 0.7
        RumbleEvent.Collapse       => (0.9f, 0.3f, 0.6f),
        RumbleEvent.Milestone      => (0.2f, 0.5f, 0.15f),
        _ => (0f, 0f, 0f)
    };

    public bool SupportsRumble(int playerIndex) => GetPad(playerIndex) is DualShockGamepad;

    public void Send(int playerIndex, RumbleEvent evt, float intensity = 1f)
    {
        if (GetPad(playerIndex) is not DualShockGamepad ds) return;
        var (low, high, _) = Profile(evt, intensity);
        ds.SetMotorSpeeds(low, high);
    }

    public void Stop(int playerIndex)
    {
        if (GetPad(playerIndex) is DualShockGamepad ds) ds.SetMotorSpeeds(0f, 0f);
    }

    static Gamepad GetPad(int i) =>
        Gamepad.all.Count > i ? Gamepad.all[i] : Gamepad.current;
}
```

**`RumbleDirector`** (event router with duration timers):

```csharp
using System.Collections.Generic;
using UnityEngine;

public sealed class RumbleDirector : MonoBehaviour
{
    public IRumbleProvider Provider = new GamepadRumbleProvider();

    readonly float[] stopAt = new float[2];   // per-player motor shutoff time
    readonly bool[] warning = new bool[2];

    public void Trigger(int player, RumbleEvent evt, float intensity = 1f)
    {
        if (!Provider.SupportsRumble(player)) return;
        Provider.Send(player, evt, intensity);
        stopAt[player] = Time.time + DurationOf(evt);
    }

    public void SetWarningLoop(int player, bool active)
    {
        if (warning[player] == active) return;
        warning[player] = active;
        if (active) Provider.Send(player, RumbleEvent.WobbleWarning, 0.8f);
        else Provider.Stop(player);
    }

    void Update()
    {
        for (int p = 0; p < 2; p++)
        {
            if (stopAt[p] > 0f && Time.time >= stopAt[p])
            {
                if (!warning[p]) Provider.Stop(p);
                stopAt[p] = 0f;
            }
            if (warning[p] && Provider.SupportsRumble(p))
                Provider.Send(p, RumbleEvent.WobbleWarning, 0.8f); // refresh loop
        }
    }

    static float DurationOf(RumbleEvent e) => e switch
    {
        RumbleEvent.GrabTick => 0.02f, RumbleEvent.RotateStep => 0.015f,
        RumbleEvent.Landing => 0.09f, RumbleEvent.Collapse => 0.6f,
        RumbleEvent.Milestone => 0.15f, _ => 0.1f
    };
}
```

**Wiring points:** grab/release → `PlacementRig` hooks · landing → `PieceAudio.PlayImpactSound` passes `impulse` · wobble → `InstabilityProbe` threshold crossings · collapse/milestone → `ArcadeGameController`.

## H.5 Share / screenshot abstraction

```csharp
public interface IShareService
{
    System.Collections.IEnumerator CaptureAndSave(string filename, System.Action<string> onDone);
    void Share(string path);   // OS share sheet on real platforms; no-op on desktop
}

public sealed class DesktopShareService : IShareService
{
    public System.Collections.IEnumerator CaptureAndSave(string filename, System.Action<string> onDone)
    {
        yield return new WaitForEndOfFrame();          // after UI + rendering completes
        Texture2D tex = ScreenCapture.CaptureScreenshotAsTexture();

        string dir = System.IO.Path.Combine(Application.persistentDataPath, "shares");
        System.IO.Directory.CreateDirectory(dir);
        string path = System.IO.Path.Combine(dir, filename);

        System.IO.File.WriteAllBytes(path, tex.EncodeToPNG());
        Object.Destroy(tex);
        onDone?.Invoke(path);
    }

    public void Share(string path) { /* platform share sheet via SDK later */ }
}
```

UI hook: “SHARE TOWER” button on the Results screen (Part G) → `StartCoroutine(share.CaptureAndSave($"tower_{System.DateTime.Now:yyyyMMdd_HHmmss}.png", path => status.text = "Saved!"))`. The capture is deliberately framed for Results — console capture buttons hit this screen constantly (master plan §12.4.5).

## H.6 Suspend / resume system

Handheld platforms can sleep mid-run (Switch) and sessions are short (3DS DNA). Resume must be instant and pop-free.

### H.6.1 Snapshot schema

```csharp
using System.Collections.Generic;
using UnityEngine;

[System.Serializable]
public struct PlacementRecord
{
    public string pieceId;
    public Vector3 position;
    public Quaternion rotation;
    public bool isScored;
    public float settledY;
    public int ownerPlayer;
}

[System.Serializable]
public class RunSnapshot
{
    public int schemaVersion = 1;
    public string mode;              // arcade | versus | puzzle | timeattack | daily
    public string levelId;           // puzzle only
    public int score, stacked, livesP0, livesP1, currentPlayer;
    public int sequenceIndex;        // puzzle: next piece in sequence
    public float cameraY, levelTime, timeAttackRemaining;
    public List<PlacementRecord> placements = new();
}
```

**Rule SR-1:** the piece currently held/falling is *discarded* on suspend; resume replays settled pieces and spawns the next piece fresh. This avoids restoring unstable mid-air states.

### H.6.2 ResumeService

```csharp
using System.IO;
using UnityEngine;

public sealed class ResumeService : MonoBehaviour
{
    public static ResumeService Instance { get; private set; }
    string SavePath => Path.Combine(Application.persistentDataPath, "resume.json");

    void Awake() => Instance = this;

    public bool HasPendingResume() => File.Exists(SavePath);

    public void Save(RunSnapshot snap)
    {
        string tmp = SavePath + ".tmp";
        File.WriteAllText(tmp, JsonUtility.ToJson(snap, true));
        if (File.Exists(SavePath)) File.Delete(SavePath);
        File.Move(tmp, SavePath);                       // atomic swap
    }

    public RunSnapshot LoadAndConsume()
    {
        try
        {
            var snap = JsonUtility.FromJson<RunSnapshot>(File.ReadAllText(SavePath));
            File.Delete(SavePath);
            return snap.schemaVersion == 1 ? snap : null;
        }
        catch { return null; }
    }

    public void ClearPending() { if (File.Exists(SavePath)) File.Delete(SavePath); }
}
```

### H.6.3 Snapshot capture (add to `ArcadeGameController`)

```csharp
public RunSnapshot CaptureSnapshot(string modeName)
{
    var snap = new RunSnapshot
    {
        mode = modeName,
        score = Score,
        stacked = Stacked,
        livesP0 = Lives,
        cameraY = Rig.transform.position.y
    };

    foreach (var p in ScoredPiecesReadOnly)   // expose scored list as IReadOnly
    {
        snap.placements.Add(new PlacementRecord
        {
            pieceId = p.Definition.id,
            position = p.transform.position,
            rotation = p.transform.rotation,
            isScored = p.IsScored,
            settledY = p.SettledY,
            ownerPlayer = p.OwnerPlayerIndex
        });
    }
    return snap;
}
```

Suspend triggers:

```csharp
void OnApplicationPause(bool paused) { if (paused) TryAutoSuspend(); }
void OnApplicationFocus(bool focused) { if (!focused) TryAutoSuspend(); }

void TryAutoSuspend()
{
    if (Current == Phase.GameOver) return;
    ResumeService.Instance.Save(CaptureSnapshot("arcade")); // mode name from ModeController
}
```

### H.6.4 Rebuild (pop-free restore)

```csharp
public void RestoreFrom(RunSnapshot snap)
{
    BeginRun(); // clears world state
    Score = snap.score; Stacked = snap.stacked; Lives = snap.livesP0;

    // 1. Place everything kinematic first — no solver involvement
    var restored = new System.Collections.Generic.List<PieceInstance>();
    foreach (var rec in snap.placements)
    {
        var def = PieceCatalog.GetById(rec.pieceId);
        var p = PieceFactory.Create(def);
        p.transform.SetPositionAndRotation(rec.position, rec.rotation);
        p.Body.isKinematic = true;
        p.IsScored = rec.isScored;
        p.SettledY = rec.settledY;
        p.OwnerPlayerIndex = rec.ownerPlayer;
        restored.Add(p);
        scored.Add(p);                       // collapse tracking active immediately
    }

    // 2. Wake all at once; pieces are already at rest → minimal settling
    foreach (var p in restored) p.Body.isKinematic = false;

    HighestY = snap.cameraY;
    Rig.HighestSettledY = HighestY;
    QueueNext();                             // spawn next piece normally
}
```

Boot flow: Game scene `Start` → `if (ResumeService.Instance.HasPendingResume())` → UIManager prompt “Resume run?” → RestoreFrom or ClearPending. Puzzle restore additionally reloads `LevelDefinition` by `levelId`, rebuilds the board, and fast-forwards `sequenceIndex`.

## H.7 Time Attack & Daily Challenge (compact)

```csharp
public sealed class TimeAttackModeController : ArcadeGameController
{
    public float duration = 120f;
    public float TimeRemaining { get; private set; }
    public event System.Action TimeExpired;

    public override void BeginRun()
    {
        base.BeginRun();
        TimeRemaining = duration;
    }

    void Update()
    {
        if (Current == Phase.GameOver) return;
        TimeRemaining -= Time.deltaTime;
        if (TimeRemaining <= 0f)
        {
            TimeRemaining = 0f;
            EndRun("Time up!");
            TimeExpired?.Invoke();
        }
    }
}
```
HUD: one extra `Label` polled at 10 Hz (`HUDController.PollContinuous`), red tint under 10 s.

**Daily Challenge:** seeded piece RNG only — physics outcomes are never compared across machines (master plan §4.5).

```csharp
public static class DailyChallenge
{
    public static int SeedFor(System.DateTime date) =>
        date.Year * 10000 + date.Month * 100 + date.Day;
}

public sealed class DailyModeController : ArcadeGameController
{
    const int TotalPieces = 25;
    System.Random rng;
    int drawn;

    public override void BeginRun()
    {
        rng = new System.Random(DailyChallenge.SeedFor(System.DateTime.Today));
        drawn = 0;
        base.BeginRun();
    }

    protected override PieceDefinition PickNextPiece()
    {
        if (drawn >= TotalPieces) return null;   // run ends after 25 pieces
        drawn++;
        float total = 0f;
        foreach (var d in Catalog) total += d.weightInPool;
        float r = (float)rng.NextDouble() * total;
        foreach (var d in Catalog) { r -= d.weightInPool; if (r <= 0f) return d; }
        return Catalog[Catalog.Count - 1];
    }

    protected override void OnQueueExhausted() => EndRun("Challenge complete!");
}
```

## H.8 M5 exit criteria

- [ ] Connecting/disconnecting devices switches schemes live; HUD hints and reticle follow.
- [ ] Gamepad-only run (menu → arcade → 20 pieces) completable with no mouse/touch.
- [ ] Touch-only run completable on the Editor Simulator (720p handheld profile).
- [ ] DualShock/DualSense rumbles on grab, landing (scaled), wobble loop, collapse; other pads no-op without errors.
- [ ] SHARE TOWER saves a clean PNG (UI included) on every run of Results.
- [ ] Force-suspending (Alt+Tab / editor pause + `OnApplicationPause` simulation) then restarting prompts Resume; restored tower settles with zero visible pop; discarded mid-air piece rule SR-1 respected.
- [ ] Time Attack ends cleanly at 0:00; Daily produces identical piece order for a given date across two machines.

---

# Part I — Subsystem Deep Dives

## I.1 Ghost Replay Recorder

### I.1.1 Design goals & constraints

| Goal | Consequence |
|---|---|
| Replay a rival’s tower alongside your live run | Ghost pieces are **visual-only** (no colliders) → zero physics cost, zero interference |
| Files must be tiny (exchangeable later online) | Binary format, quantized rotation: ~23 bytes per placement |
| PhysX is not deterministic across platforms | Never re-simulate; replay **recorded settle transforms** (master plan §4.5) |
| Ghost must never affect scoring/camera | GhostRunner touches no game services — renderer layer only |

**Fidelity levels:**
- **Level 1 (v1, shipped here):** placement replay — ghost pieces appear at their recorded settle transform at recorded time.
- **Level 2 (stretch):** release replay — additionally sample the falling trajectory (pos/rot at 30 Hz from release to settle; typically < 2 s → ~60 samples ≈ 1.4 KB per piece). Spec included below; not in v1.

### I.1.2 File format (binary, versioned)

```
Offset  Size   Field
0       4      magic "ZGHT"
4       1      format version (currently 1)
5       1      mode (0 arcade, 1 puzzle, 2 timeattack, 3 daily)
6       2      levelId length L (0 for arcade) → then L bytes UTF-8
8       8      timestamp (unix seconds, long)
16      4      final score
20      4      record count N
24      …      N × PlacementRecord:
                 1 byte   piece catalog index (catalog order is frozen & version-checked)
                 4 bytes  t (float, seconds since run start)
                12 bytes  position (3 × float)
                 5 bytes  rotation: yaw u16 + pitch u8 + roll u16 (quantized 0–360°)
```

Rotation quantization (pieces rotate around Z while held, occasional Y at spawn — pitch is rare, so 8 bits suffices):

```csharp
static ushort Q16(float deg) => (ushort)Mathf.RoundToInt(Mathf.Repeat(deg, 360f) / 360f * 65535f);
static byte   Q8 (float deg) => (byte  )Mathf.RoundToInt(Mathf.Repeat(deg, 360f) / 360f * 255f);
static float  D16(ushort v) => v / 65535f * 360f;
static float  D8 (byte   v) => v / 255f   * 360f;
```

### I.1.3 Catalog pinning

Ghost files store **catalog indices**, not string IDs. The catalog order therefore becomes a frozen contract:

```csharp
public static class PieceCatalog
{
    // Frozen order — append-only, never reorder or remove entries.
    public static readonly PieceDefinition[] All = { /* cube, brick, plank, column, cylinder, sphere, … */ };

    public static PieceDefinition GetById(string id)
    {
        foreach (var d in All) if (d.id == id) return d;
        return null;
    }

    public static int IndexOf(string id)
    {
        for (int i = 0; i < All.Length; i++) if (All[i].id == id) return i;
        return -1;
    }
}
```
(Migrate `GameBootstrap.BuildDefaultCatalog` and the factory to this static catalog; Workbench pickers read from it.)

### I.1.4 Recorder

```csharp
using System.Collections.Generic;
using UnityEngine;

public sealed class GhostRecorder : MonoBehaviour
{
    public ArcadeGameController game;

    readonly List<GhostRecord> records = new();
    float runStart;
    bool recording;

    public void BeginRun()
    {
        records.Clear();
        runStart = Time.time;
        recording = true;
    }

    void OnEnable()
    {
        game.OnPieceSettledEvent += OnSettled;      // expose event on controller (one-line add)
        game.OnRunStartedEvent += BeginRun;
    }
    void OnDisable()
    {
        game.OnPieceSettledEvent -= OnSettled;
        game.OnRunStartedEvent -= BeginRun;
    }

    void OnSettled(PieceInstance p)
    {
        if (!recording) return;
        records.Add(new GhostRecord
        {
            catalogIndex = PieceCatalog.IndexOf(p.Definition.id),
            t = Time.time - runStart,
            position = p.transform.position,
            rotation = p.transform.rotation
        });
    }

    public void FinishRun(int finalScore, string mode, string levelId)
    {
        recording = false;
        var file = new GhostFile
        {
            version = 1, mode = mode, levelId = levelId,
            timestamp = System.DateTimeOffset.UtcNow.ToUnixTimeSeconds(),
            finalScore = finalScore,
            records = records.ToArray()
        };
        GhostIO.Write(GhostService.SlotPath(mode, levelId), file);
    }
}

public struct GhostRecord
{
    public int catalogIndex;
    public float t;
    public Vector3 position;
    public Quaternion rotation;
}

[System.Serializable]
public class GhostFile
{
    public int version = 1;
    public string mode;
    public string levelId;
    public long timestamp;
    public int finalScore;
    public GhostRecord[] records;
}
```

### I.1.5 Binary IO

```csharp
using System.IO;
using UnityEngine;

public static class GhostIO
{
    static readonly byte[] Magic = { (byte)'Z', (byte)'G', (byte)'H', (byte)'T' };

    public static void Write(string path, GhostFile f)
    {
        using var ms = new MemoryStream();
        using var w = new BinaryWriter(ms);
        w.Write(Magic);
        w.Write((byte)f.version);
        w.Write((byte)ModeToByte(f.mode));
        byte[] lvl = System.Text.Encoding.UTF8.GetBytes(f.levelId ?? "");
        w.Write((ushort)lvl.Length); w.Write(lvl);
        w.Write(f.timestamp);
        w.Write(f.finalScore);
        w.Write(f.records.Length);

        foreach (var r in f.records)
        {
            w.Write((byte)r.catalogIndex);
            w.Write(r.t);
            w.Write(r.position.x); w.Write(r.position.y); w.Write(r.position.z);
            Vector3 e = r.rotation.eulerAngles;
            w.Write(Q16(e.y)); w.Write(Q8(e.x)); w.Write(Q16(e.z));
        }

        Directory.CreateDirectory(Path.GetDirectoryName(path));
        File.WriteAllBytes(path, ms.ToArray());
    }

    public static GhostFile Read(string path)
    {
        using var r = new BinaryReader(File.OpenRead(path));
        if (r.ReadByte() != Magic[0] || r.ReadByte() != Magic[1] ||
            r.ReadByte() != Magic[2] || r.ReadByte() != Magic[3]) return null;

        var f = new GhostFile();
        f.version = r.ReadByte();
        if (f.version != 1) return null;                    // forward-compat: reject unknown
        f.mode = ByteToMode(r.ReadByte());
        int len = r.ReadUInt16();
        f.levelId = System.Text.Encoding.UTF8.GetString(r.ReadBytes(len));
        f.timestamp = r.ReadInt64();
        f.finalScore = r.ReadInt32();
        int n = r.ReadInt32();
        f.records = new GhostRecord[n];

        for (int i = 0; i < n; i++)
        {
            int idx = r.ReadByte();
            if (idx >= PieceCatalog.All.Length) return null; // catalog mismatch → reject whole file
            f.records[i] = new GhostRecord
            {
                catalogIndex = idx,
                t = r.ReadSingle(),
                position = new Vector3(r.ReadSingle(), r.ReadSingle(), r.ReadSingle()),
                rotation = Quaternion.Euler(D8(r.ReadByte()), D16(r.ReadUInt16()), D16(r.ReadUInt16()))
            };
        }
        return f;
    }

    static byte ModeToByte(string m) => m switch { "arcade" => 0, "puzzle" => 1, "timeattack" => 2, "daily" => 3, _ => 0 };
    static string ByteToMode(byte b) => b switch { 1 => "puzzle", 2 => "timeattack", 3 => "daily", _ => "arcade" };

    static ushort Q16(float deg) => (ushort)Mathf.RoundToInt(Mathf.Repeat(deg, 360f) / 360f * 65535f);
    static byte   Q8 (float deg) => (byte  )Mathf.RoundToInt(Mathf.Repeat(deg, 360f) / 360f * 255f);
    static float  D16(ushort v)  => v / 65535f * 360f;
    static float  D8 (byte v)    => v / 255f   * 360f;
}
```

### I.1.6 Service + runner

```csharp
using System.IO;
using UnityEngine;

public interface IGhostService
{
    GhostFile LoadBest(string mode, string levelId);
    // Future online layer implements the same interface.
}

public sealed class LocalGhostService : IGhostService
{
    public static string SlotPath(string mode, string levelId) =>
        Path.Combine(Application.persistentDataPath, "ghosts",
                     $"{mode}_{(string.IsNullOrEmpty(levelId) ? "global" : levelId)}.ghost");

    public GhostFile LoadBest(string mode, string levelId)
    {
        string p = SlotPath(mode, levelId);
        return File.Exists(p) ? GhostIO.Read(p) : null;
    }
}

public sealed class GhostRunner : MonoBehaviour
{
    public Camera mainCam;              // culling mask includes "Ghost" layer
    GhostFile file;
    int cursor;
    float elapsed;
    Material ghostMat;
    Transform ghostRoot;

    public bool IsPlaying { get; private set; }

    public void Play(GhostFile f)
    {
        Stop();
        file = f; cursor = 0; elapsed = 0f;
        ghostRoot = new GameObject("GhostTower").transform;
        ghostMat = PieceFactory.GhostMaterial;     // URP Lit, transparent, alpha 0.35, theme accent
        IsPlaying = true;
    }

    public void Stop()
    {
        IsPlaying = false;
        if (ghostRoot != null) Destroy(ghostRoot.gameObject);
    }

    void Update()
    {
        if (!IsPlaying || file == null) return;
        elapsed += Time.deltaTime;

        while (cursor < file.records.Length && file.records[cursor].t <= elapsed)
        {
            SpawnGhost(file.records[cursor]);
            cursor++;
        }

        if (cursor >= file.records.Length) IsPlaying = false; // tower stays as backdrop
    }

    void SpawnGhost(GhostRecord r)
    {
        var def = PieceCatalog.All[r.catalogIndex];
        var go = PieceFactory.CreateVisualOnly(def, ghostMat);   // mesh only, NO colliders, NO rigidbody
        go.layer = LayerMask.NameToLayer("Ghost");
        go.transform.SetParent(ghostRoot, false);
        go.transform.SetPositionAndRotation(r.position, r.rotation);
    }
}
```

`PieceFactory` additions:

```csharp
public static Material GhostMaterial { get; private set; }  // built in Prepare(): URP Lit transparent, alpha 0.35

public static GameObject CreateVisualOnly(PieceDefinition def, Material mat)
{
    var go = new GameObject($"Ghost_{def.id}");
    foreach (var c in def.colliders)
        AddVisual(go, c.type, mat, VisualScale(c), c.center);   // reuse existing visual builder
    return go;
}
```

**Gameplay integration:** Arcade `BeginRun` → `ghostRunner.Play(ghostService.LoadBest("arcade", null))`. Puzzle level load → `LoadBest("puzzle", level.levelId)`. Ghost playback continues across restarts (re-Play on each `BeginRun`).

### I.1.7 Budget check

25-piece arcade ghost: header 24 B + 25 × 22 B ≈ **575 bytes**. A season of daily challenges = ~0.5 MB per thousand players. Trivially exchangeable.

---

## I.2 Touch Control Schemes (deep dive)

### I.2.1 Problem statement

| Problem | Consequence |
|---|---|
| Finger occlusion | Absolute “tap the piece” fails on small screens — finger covers what you aim |
| Precision | 1:1 absolute mapping gives no mechanical advantage; stacking needs sub-centimeter control |
| One-handed play | 3DS/Switch-handheld sessions are single-thumb affairs |
| No keys | Rotation needs gesture or button alternatives |

The TOUCH!-era answer, and ours: **relative drag + dedicated rotation inputs**, with absolute mode kept as an option.

### I.2.2 Scheme matrix (defaults per platform lineage)

| Platform context | Grab/move | Rotate | Fallback |
|---|---|---|---|
| 3DS-style (small touch) | Relative drag | ⟲/⟳ buttons | — |
| Wii U GamePad | Relative drag | Buttons + optional gyro | Absolute |
| Switch handheld | Relative drag | Buttons + two-finger twist | Absolute |
| Desktop/tablet | Absolute (M1 behavior) | Wheel / Q-E | Relative toggle |

User override lives in Options (`rotationStyle`, `touchMode`, `touchSensitivity 0.5–1.5`).

### I.2.3 Grab policies

```csharp
using UnityEngine;

public interface IGrabPolicy
{
    bool WantsGrab(IPointerSource pointer, PieceInstance current, Camera cam);
}

/// M1 behavior: raycast the piece, with a 140 px proximity fallback.
public sealed class PointerGrabPolicy : IGrabPolicy
{
    public bool WantsGrab(IPointerSource pointer, PieceInstance current, Camera cam)
    {
        if (!pointer.WasPressedThisFrame || current == null) return false;

        int layer = LayerMask.NameToLayer("Piece");
        int mask = layer >= 0 ? 1 << layer : ~0;
        Ray ray = cam.ScreenPointToRay(pointer.ScreenPosition);
        if (Physics.Raycast(ray, out RaycastHit hit, 200f, mask) &&
            hit.rigidbody != null && hit.rigidbody.gameObject == current.gameObject)
            return true;

        Vector2 sp = cam.WorldToScreenPoint(current.transform.position);
        return Vector2.Distance(pointer.ScreenPosition, sp) < 140f;
    }
}

/// TOUCH! behavior: any touch begins the drag; the piece lifts immediately.
public sealed class TouchRelativeGrabPolicy : IGrabPolicy
{
    public bool WantsGrab(IPointerSource pointer, PieceInstance current, Camera cam)
        => pointer.WasPressedThisFrame && current != null;
}
```

### I.2.4 Relative drag (PlacementRig extension)

```csharp
// Add to PlacementRig:
public bool RelativeMode { get; set; }
Vector3 anchorPiecePos;
Vector2 anchorScreenPos;
float worldPerPixel;

public void BeginRelativeDrag(Vector3 piecePosAtGrab)
{
    anchorPiecePos = piecePosAtGrab;
    anchorScreenPos = Vector2.zero;      // deltas measured from touch start
    worldPerPixel = cam != null
        ? WorldRectAtPlane().height / Screen.height
        : 0.01f;
}

Rect WorldRectAtPlane() => TowerCameraRig.WorldRectAtPlaneZStatic(cam, planeZ); // small static helper

public void DriveHeldPieceRelative(HeldPiece piece, Vector2 touchDeltaFromStart,
                                   float sensitivity, Rect playBounds)
{
    Vector3 offset = new Vector3(touchDeltaFromStart.x, touchDeltaFromStart.y, 0f)
                     * (worldPerPixel * sensitivity);
    Vector3 target = anchorPiecePos + offset;
    DriveHeldPiece(piece, target, playBounds);   // existing absolute path does clamping/smoothing
}
```

Sensitivity 1.0 = 1:1 screen mapping. Lower values give **mechanical advantage** (finger moves farther than the piece) — that is the precision trick; default 0.75 on small screens.

**Lift offset (optional juice):** on grab, raise the piece 0.25 m over 0.1 s so it visibly “picks up” away from the finger shadow.

### I.2.5 Two-finger twist

```csharp
using UnityEngine;
using UnityEngine.InputSystem.EnhancedTouch;
using Touch = UnityEngine.InputSystem.EnhancedTouch.Touch;

public sealed class TwistGesture
{
    public float Sensitivity { get; set; } = 1f;
    public float DeadZoneDeg { get; set; } = 5f;
    public float SnapThresholdDeg { get; set; } = 10f;

    float prevAngle;
    bool active;
    public float PendingDegrees { get; private set; }

    public void Poll()
    {
        PendingDegrees = 0f;
        var touches = Touch.activeTouches;

        if (touches.Count >= 2)
        {
            Vector2 d = touches[0].screenPosition - touches[1].screenPosition;
            float angle = Mathf.Atan2(d.y, d.x) * Mathf.Rad2Deg;

            if (!active) { prevAngle = angle; active = true; return; }

            float delta = Mathf.DeltaAngle(prevAngle, angle) * Sensitivity;
            prevAngle = angle;

            if (Mathf.Abs(delta) > DeadZoneDeg * Time.deltaTime)  // scaled dead zone
                PendingDegrees = delta;
        }
        else
        {
            active = false;
        }
    }

    /// On release of the twist, snap to the nearest 45° if close (juice).
    public float SnapCorrection(float currentZDeg)
    {
        float nearest = Mathf.Round(currentZDeg / 45f) * 45f;
        return Mathf.Abs(Mathf.DeltaAngle(currentZDeg, nearest)) <= SnapThresholdDeg
            ? Mathf.DeltaAngle(currentZDeg, nearest)
            : 0f;
    }
}
```

Arbitration rules (documented as TR-1…TR-4):

| Rule | Behavior |
|---|---|
| TR-1 | The **first** touch is the drag finger; a **second** concurrent touch switches to twist-only. |
| TR-2 | While a piece is held, twist rotates it; drag finger still translates it simultaneously. |
| TR-3 | If the drag finger lifts, the piece is **released** even if the twist finger remains. |
| TR-4 | Twist with no held piece is ignored (never rotates waiting/hovering pieces). |

### I.2.6 Rotate button pad (UI Toolkit)

```csharp
using UnityEngine.UIElements;

public sealed class TouchButtonPad
{
    public float ContinuousSpeed { get; set; } = 160f;   // deg/s while held
    public float StepDegrees { get; set; } = 45f;        // on quick tap
    public System.Action<float> OnRotate;                // degrees requested

    float heldDir;
    float downTime;
    bool tapped;

    public void Attach(VisualElement root)
    {
        Bind(root.Q<Button>("btn-rotate-ccw"), -1f);
        Bind(root.Q<Button>("btn-rotate-cw"),  +1f);
    }

    void Bind(Button btn, float dir)
    {
        btn.RegisterCallback<PointerDownEvent>(e =>
        {
            heldDir = dir;
            downTime = Time.unscaledTime;
            tapped = false;
        });
        btn.RegisterCallback<PointerUpEvent>(e =>
        {
            heldDir = 0f;
            if (!tapped && Time.unscaledTime - downTime < 0.2f)
            {
                OnRotate?.Invoke(dir * StepDegrees);      // tap = 45° step
                tapped = true;
            }
        });
    }

    public void Tick()   // call from Update while a piece is held
    {
        if (heldDir != 0f && Time.unscaledTime - downTime >= 0.2f)
            OnRotate?.Invoke(heldDir * ContinuousSpeed * Time.deltaTime);  // hold = continuous
    }
}
```

UXML (added to HUD when mode == Touch):

```xml
<ui:VisualElement name="touch-pad" style="flex-direction:row; justify-content:space-between;
                                           position:absolute; bottom:24px; width:100%;
                                           padding-left:24px; padding-right:24px;">
    <ui:Button name="btn-rotate-ccw" class="zen-button zen-button--round" text="⟲"/>
    <ui:Button name="btn-rotate-cw"  class="zen-button zen-button--round" text="⟳"/>
</ui:VisualElement>
```

```css
.zen-button--round
{
    width: 72px; height: 72px;      /* comfortably above 48 px minimum */
    border-radius: 36px;
    font-size: 28px;
    -unity-text-align: middle-center;
    padding: 0;
}
```

### I.2.7 Controller integration (what changes in `ArcadeGameController`)

```csharp
// Fields
public IGrabPolicy GrabPolicy { get; set; } = new PointerGrabPolicy();
TouchControlScheme touch;   // created when mode == Touch

// In Start / on ModeChanged:
void ApplyInputMode(InputMode mode)
{
    switch (mode)
    {
        case InputMode.Touch:
            GrabPolicy = Settings.TouchAbsolute
                ? new PointerGrabPolicy()
                : new TouchRelativeGrabPolicy();
            Placement.RelativeMode = !Settings.TouchAbsolute;
            break;
        case InputMode.Gamepad:
            GrabPolicy = new PointerGrabPolicy();     // reticle raycast works as-is
            Placement.RelativeMode = false;
            break;
        default:
            GrabPolicy = new PointerGrabPolicy();
            Placement.RelativeMode = false;
            break;
    }
}
```

Rotation in `UpdateHeld` becomes scheme-aware:

```csharp
float deg = 0f;
if (mode == InputMode.Touch)
{
    twist.Poll();
    deg += twist.PendingDegrees;
    touchPad.Tick();                       // fires OnRotate → adds to deg via delegate
}
else
{
    deg += Mathf.Clamp(pointer.ScrollDelta * 0.2f, -20f, 20f);
    // + Q/E keys as in M1
}
if (Mathf.Abs(deg) > 0.001f) Placement.RotateHeld(current.Held, deg);
```

On release (touch + twist active): apply `twist.SnapCorrection` before `Detach` for the satisfying 45° click.

### I.2.8 Testing without a touchscreen

| Method | What it covers |
|---|---|
| **Editor Simulator** (Game view ▸ Simulator, 3DS/Switch handheld profiles) | Layout, safe areas, touch targets |
| `SimulatedTouchSource` dev flag: LMB = drag finger, **RMB = twist finger** (synthesized second touch) | Twist math, arbitration rules TR-1…TR-4 |
| Remote Device simulator (Input System package) over USB/Wi-Fi | Real device verification before console kits arrive |
| Sensitivity sweep matrix: 0.5 / 0.75 / 1.0 / 1.5 × relative/absolute | Default selection per screen size |

### I.2.9 Touch subsystem exit criteria

- [ ] Relative drag: piece never jumps on grab; 0.75 sensitivity gives visibly finer control than 1:1.
- [ ] Twist: dead zone prevents accidental rotation; snap-to-45° fires within 10°; simultaneous drag+twist works (TR-2).
- [ ] Rotate buttons: tap = exactly 45°; hold = smooth 160°/s; both ≥ 48 px and reachable one-handed.
- [ ] Scheme switch mid-run (touch → gamepad) never drops the held piece or double-releases.
- [ ] Full puzzle level completable one-thumb in the Simulator.

---

*End of Parts H & I. With M5 complete, the game is feature-complete for PC validation of every port behavior. The remaining master-plan milestone is **M6 — Content, Performance & Certification Polish**: ~48 remaining campaign levels via the Workbench, per-platform performance passes (STP, shadow budgets), localization, and the certification checklist.*

***

# Project ZENITH — Follow-up Deliverable 6 (Final Milestone)
### Part J: M6 Content, Performance & Certification Polish
### Part K: Deep Dive — STP / Dynamic Resolution Performance Pipeline
### Part L: Deep Dive — World-by-World Campaign Level Design Guide

| | |
|---|---|
| Companion document | `Project_ZENITH_ArtOfBalanceStyle_Unity6_ImplementationPlan.md` |
| Previous companion | `Project_ZENITH_PartH_M5_PortFeatureLayer_and_DeepDives.md` |
| Focus | Ship-readiness: 72 levels, stable 60 FPS on every target, certification-clean builds |

---

# Part J — M6: Content, Performance & Certification Polish

## J.1 Content production pipeline

All campaign content is authored through the **Level Workbench** (Part B/C). Per-level pipeline:

```
Draft (Workbench +New) → Validate (0 errors) → Playtest (designer)
   → Par Bot suggestion (stretch) → Second-person playtest → Star review → Commit
```

**Velocity:** with the Workbench, one designer clears 6–8 finished levels per week. 48 remaining levels ≈ 6–8 weeks, overlapping M6 performance/cert work (Worlds 1–3 already drafted in M4).

**Definition of “level done”:**

| Gate | Check |
|---|---|
| V | Workbench validator: 0 errors |
| P1 | Author completes it with all 3 stars achievable |
| P2 | A second person completes it without hints |
| P | Pars confirmed (3★ rare but reachable, 1★ generous) |
| C | No known cheese (see L.6 anti-cheese checklist) |
| A | Theme/palette renders correctly; zone labels readable at 720p |

## J.2 Performance targets & budgets

Full pipeline in **Part K**. Budget summary (16.6 ms frame):

| Budget | Target | Owner |
|---|---|---|
| Physics (PhysX) | ≤ 3.5 ms | SleepManager, awake-body cap ≤ 40 |
| Rendering (CPU) | ≤ 4.0 ms | SRP Batcher, no material instancing (MPB only) |
| Rendering (GPU) | ≤ 9.0 ms console / ≤ 11 ms handheld | STP on handheld, shadow budgets (K.5) |
| UI Toolkit | ≤ 0.5 ms | 10 Hz scheduled updates, no per-frame layout churn |
| Audio | ≤ 0.5 ms | Pooled sources, no real-time DSP |
| Headroom | ≥ 3 ms | GC spikes, theme crossfades, spawn bursts |

Per-platform ladder (see K.4 for the governor that enforces it):

| Platform | Output | Internal render | Upscaling | Shadows |
|---|---|---|---|---|
| Desktop high | 1440p+ | 1.0 (native) | Off | 2048, soft |
| PS4-class | 1080p | 0.85–1.0 dynamic | Off (FSR fallback) | 2048 → 1024 |
| Handheld docked | 1080p | 0.8–1.0 dynamic | STP | 1024, soft off |
| Handheld undocked | 720p | 0.65–0.85 dynamic | **STP** | 1024, soft off |

## J.3 Certification & compliance checklist

Platform TRC/Lotcheck specifics require SDK access; this framework covers the categories every cert process audits, so nothing surprises us at submission:

| # | Category | Requirement in our game | Status hook |
|---|---|---|---|
| C-01 | Boot flow | Cold boot → menu in < 10 s; no crash with empty/absent save | `ResumeService` null-safe loads |
| C-02 | Save integrity | Corrupt save → graceful reset with notice, never a crash | JSON try/catch + schema version |
| C-03 | Storage events | Save failure surfaced as non-blocking warning | `ISaveService` result codes |
| C-04 | Suspend/resume | Mid-run suspend restores exactly (SR-1 documented) | M6 soak test |
| C-05 | Pause | Accessible from any gameplay state; simulation frozen; no input leaks | `Phase.Paused` gate in controller |
| C-06 | Input device events | Controller disconnect → pause + prompt; reconnect resumes | `InputModeManager` + pause hook |
| C-07 | User/account scope | Saves/settings scoped per active user | `ISaveService` user-key paths |
| C-08 | Ratings & notices | IARC questionnaire answers; online-interaction notice if leaderboards ship | Legal pass |
| C-09 | IP & third-party audit | No original-game names/assets; font + audio licenses documented | Repo `THIRD_PARTY.md` |
| C-10 | Build hygiene | Version string on menu; no debug keys/overlays in release (`ZENITH_DEBUG` stripped) | Release config define audit |
| C-11 | Long-session stability | 30 min soak: no memory growth > 10 MB, no FPS drift | J.5 soak test |
| C-12 | Accessibility minimums | Pause anytime, no QTE/timed inputs in menus, subtitles n/a (no VO), remappable rotate buttons | Options completeness |

## J.4 Localization pass

| Task | Detail |
|---|---|
| String freeze | All UI text routed through `L10N.Tr`; zero string concatenation — use placeholders `{0}` for word-order safety |
| Languages v1 | EN, DE, FR, ES, IT, JA (original-game lineage makes JP eShop a likely target → CJK font atlas mandatory) |
| Pseudo-locale | `[!!Śŧàçĸèð!!]` style, +30% length — run full game once; audit every overflow/wrap |
| UI Toolkit | `white-space: normal` on all labels; no fixed widths on text containers; test at text-size accessibility setting |
| Formats | Scores/heights via `CultureInfo` (`8.4 m` vs `8,4 m`); dates ISO in save files |
| Fonts | One geometric sans with Latin + CJK coverage; UI Toolkit font atlas prebuilt per script group |

## J.5 Final QA, triage & soak

**Severity classes:**

| Class | Definition | Release rule |
|---|---|---|
| S1 | Crash, save loss, progression block | **0 open** |
| S2 | Feature wrong (rules, scoring, objectives) | **0 open** |
| S3 | Polish (feel, timing, minor visual) | ≤ 10 documented |
| S4 | Cosmetic / “would be nice” | Tracked only |

**Soak test (automated):**

```csharp
// Uses PerfTestRunner from Part K in "endurance" mode:
// 30 minutes of auto-placing, collapsing, restarting in Arcade + one Puzzle loop.
// Profiler snapshots at t=0, 10, 20, 30 min compared for:
//  - managed heap growth (< 10 MB)
//  - AudioSource/pool leaks
//  - FPS P95 drift (< 5%)
```

**Full manual matrix (once per milestone, twice in M6):**

| Axis | Values |
|---|---|
| Input | Mouse+KB · Touch (relative/absolute) · Gamepad cursor · Single-Joy-Con 2P |
| Mode | Arcade · Versus · Time Attack · Daily · Puzzle (all worlds) |
| Display | 720p · 1080p · 1440p · 21:9 · handheld safe areas |
| Events | Suspend mid-hold · disconnect during fall · theme crossfade during collapse |

## J.6 v1.0 Definition of Done

- [ ] 72 campaign levels across 6 worlds, all passing J.1 gates.
- [ ] Every mode playable start-to-finish with every input scheme.
- [ ] Budget table (J.2) met on all four platform rows for 120-piece towers.
- [ ] Cert checklist (J.3) fully green on stub implementations.
- [ ] 6 languages shipped; pseudo-locale pass clean.
- [ ] S1/S2 = 0; soak test green.
- [ ] Leaderboards local-only shipped; online service interface stubbed and tested with mock.
- [ ] `THIRD_PARTY.md`, build metadata, and release-config define audit committed.

---

# Part K — Deep Dive: STP / Dynamic Resolution Pipeline

## K.1 What STP is and when to use it

**STP (Spatial-Temporal Post-processing)** is Unity 6’s URP/HDRP upscaler: the scene renders at an internal resolution below output resolution, and STP reconstructs the full-resolution image using spatial filters plus motion-vector-driven temporal accumulation.

| Technique | When | Trait |
|---|---|---|
| Native (scale 1.0) | Desktop high, strong consoles | Sharpest; no temporal artifacts possible |
| Fixed `renderScale` | Weak GPUs, no URP upscaler | Blurry when scale < 0.8 |
| **STP** | Handheld / anything needing ≥ 25% scale reduction | Near-native sharpness, motion-vector aware |
| FSR | Fallback where STP unsupported | Slightly softer, spatial-only options |

**Requirements & behavior notes:**

1. URP asset → **Upscaling Filter = STP**, with `renderScale < 1.0`. Post-processing must be enabled (we already run bloom/vignette/LUT).
2. Unity 6 URP RenderGraph path (default) — STP inserts its pass automatically.
3. **Motion vectors come free from PhysX rigidbodies.** Our falling pieces reconstruct correctly; particles/VFX may shimmer slightly (acceptable, subtle by design).
4. **UI Toolkit is drawn after the URP pipeline at native resolution** — HUD and menus stay pixel-sharp regardless of internal 3D scale. This is the single biggest reason STP suits this game: the stack is physics + gradient background + small crisp UI.
5. Custom shaders: our `ZENITH/GradientBackground` and piece shaders are standard unlit/lit — fully compatible.
6. Changing `renderScale` reallocates render targets → one small hitch. The governor (K.3) mitigates with cooldowns and small steps.

## K.2 Architecture

```
                    ┌──────────────────────────┐
Platform plugin ──► │  DeviceClass detector     │
(dock state, GPU)   └────────────┬─────────────┘
                                 ▼
                    ┌──────────────────────────┐
                    │   PerformanceGovernor    │  owns: STP on/off, scale bounds,
                    │   (MonoBehaviour)        │  frame-time EMA, adjustment loop
                    └────────────┬─────────────┘
                                 ▼
              UniversalRenderPipelineAsset.renderScale
              UniversalRenderPipelineAsset.upscalingFilter
                                 ▲
        Fallback ladder (K.5) ───┘  shadows → soft shadows → VFX density
```

## K.3 PerformanceGovernor (complete)

```csharp
using UnityEngine;
using UnityEngine.Rendering;
using UnityEngine.Rendering.Universal;

public enum DeviceClass { DesktopHigh, ConsoleBase, Handheld }

[DefaultExecutionOrder(1000)]
public sealed class PerformanceGovernor : MonoBehaviour
{
    public static PerformanceGovernor Instance { get; private set; }

    [Header("Frame-time targets")]
    public float targetFrameMs = 16.7f;
    public float deadZonePct = 0.08f;      // ignore ±8%
    public float stepDownPct = 0.06f;      // scale step when over budget
    public float stepUpPct = 0.03f;        // recover half as fast → no oscillation
    public float cooldownSeconds = 1.0f;
    public int warmupFrames = 120;         // skip level load / shader warm-up

    [Header("Resolution scale bounds (set per device class)")]
    public float minScale = 0.65f;
    public float maxScale = 1.0f;

    public float CurrentScale { get; private set; } = 1f;
    public bool StpActive { get; private set; }
    public float EmaFrameMs => emaMs;      // exposed for debug HUD

    UniversalRenderPipelineAsset urp;
    float emaMs;
    float lastAdjustAt = -10f;
    int frame;

    void Awake()
    {
        Instance = this;
        urp = GraphicsSettings.defaultRenderPipeline as UniversalRenderPipelineAsset;
    }

    public void ConfigureForDevice(DeviceClass cls)
    {
        switch (cls)
        {
            case DeviceClass.DesktopHigh:
                SetStp(false); minScale = 1f;    maxScale = 1f;    break;
            case DeviceClass.ConsoleBase:
                SetStp(false); minScale = 0.85f; maxScale = 1f;    break;
            case DeviceClass.Handheld:
                SetStp(true);  minScale = 0.65f; maxScale = 0.85f; break;
        }
        CurrentScale = maxScale;
        Apply();
    }

    void SetStp(bool on)
    {
        StpActive = on;
        if (urp != null)
            urp.upscalingFilter = on ? UpscalingFilterSelection.STP
                                     : UpscalingFilterSelection.Automatic;
    }

    void LateUpdate()
    {
        frame++;
        float dtMs = Mathf.Min(Time.unscaledDeltaTime * 1000f, 50f); // drop hitch spikes
        emaMs = frame == 1 ? dtMs : Mathf.Lerp(emaMs, dtMs, 0.05f);

        if (frame < warmupFrames) return;
        if (Time.unscaledTime - lastAdjustAt < cooldownSeconds) return;

        float dead = targetFrameMs * deadZonePct;

        if (emaMs > targetFrameMs + dead && CurrentScale > minScale)
        {
            CurrentScale = Mathf.Max(minScale, CurrentScale - stepDownPct);
            Apply();
        }
        else if (emaMs < targetFrameMs - dead && CurrentScale < maxScale)
        {
            CurrentScale = Mathf.Min(maxScale, CurrentScale + stepUpPct);
            Apply();
        }
    }

    void Apply()
    {
        if (urp != null) urp.renderScale = CurrentScale;
        lastAdjustAt = Time.unscaledTime;
    }
}
```

**Tuning notes:**
- EMA coefficient 0.05 ≈ 20-frame window: reacts in ~0.3 s, ignores single spikes.
- Asymmetric steps (down 6%, up 3%) prevent scale “breathing” on borderline scenes.
- The 50 ms clamp keeps a level-load hitch from slamming scale to minimum.
- Governor runs only during gameplay scenes; menus force `maxScale` (they are cheap).

## K.4 Device class detection & dock switching

```csharp
public static class DeviceClassDetector
{
    public static DeviceClass Detect()
    {
        // Platform plugin overrides first (real SDKs report dock state / SKU):
        if (PlatformServices.TryGetDeviceClass(out var forced)) return forced;

        // Generic heuristic for PC/dev builds:
        long ramMB = SystemInfo.systemMemorySize;
        int gpuMB = SystemInfo.graphicsMemorySize;
        if (ramMB >= 16000 && gpuMB >= 8000) return DeviceClass.DesktopHigh;
        if (ramMB >= 8000) return DeviceClass.ConsoleBase;
        return DeviceClass.Handheld;
    }
}
```

Dock-state hot swap (Switch-class): platform plugin fires event → `PerformanceGovernor.ConfigureForDevice(Handheld/ConsoleBase)`. The one-time render-target reallocation hitch lands inside the OS dock-transition animation, so it is invisible.

## K.5 Fallback ladder

When scale is already at `minScale` and the frame budget is still blown (measured by the governor over a 3 s window), degrade in this order — each step is reversible when headroom returns:

| Step | Action | Cost saved | Visual impact |
|---|---|---|---|
| 1 | Shadow atlas 2048 → 1024 | ~0.8 ms GPU | Slightly softer shadows |
| 2 | Soft shadows → hard | ~0.5 ms GPU | Barely visible at our light angle |
| 3 | VFX particle caps halved (dust, splash) | ~0.3 ms | Subtle |
| 4 | Bloom off | ~0.4 ms GPU | Flat highlights (last resort) |
| 5 | Emergency: physics solver iterations 12 → 8 | ~0.7 ms CPU | Micro-jitter risk — log loudly |

Step 5 is the only one touching gameplay feel; it also raises a telemetry flag so we see it in playtest logs.

## K.6 Measurement: the PerfTest harness

`Scenes/PerfTest.unity` auto-stacks a tower and writes a percentile report. Needs one addition to `ArcadeGameController`: `public PieceInstance CurrentPiece => current;`

```csharp
using System.Collections.Generic;
using System.IO;
using UnityEngine;

public sealed class PerfTestRunner : MonoBehaviour
{
    public ArcadeGameController game;
    public int pieces = 60;
    public float jitterX = 0.3f;

    readonly List<float> frameMs = new(40000);
    int placed;
    bool running;

    void Start()
    {
        QualitySettings.vSyncCount = 0;
        Application.targetFrameRate = -1;          // uncapped → measure true frame times
        running = true;
        StartCoroutine(AutoPlace());
    }

    System.Collections.IEnumerator AutoPlace()
    {
        while (placed < pieces)
        {
            if (game.Current == ArcadeGameController.Phase.GameOver)
            {
                game.BeginRun();                    // collapse is fine — worst case is data
                yield return new WaitForSeconds(0.5f);
                continue;
            }
            if (game.Current != ArcadeGameController.Phase.AwaitingGrab || game.CurrentPiece == null)
            {
                yield return null;
                continue;
            }

            var p = game.CurrentPiece;
            p.transform.position += new Vector3(Random.Range(-jitterX, jitterX), 0f, 0f);
            p.Held.Detach(0f);                      // drop from hover, no throw
            p.Settle.Begin();
            placed++;

            while (game.Current == ArcadeGameController.Phase.Falling)
                yield return null;
            yield return new WaitForSeconds(0.3f);
        }
        running = false;
        WriteReport();
    }

    void Update()
    {
        if (running) frameMs.Add(Time.unscaledDeltaTime * 1000f);
    }

    void WriteReport()
    {
        frameMs.Sort();
        var report = new Report
        {
            frames = frameMs.Count,
            p50 = Percentile(0.50f),
            p95 = Percentile(0.95f),
            p99 = Percentile(0.99f),
            scale = PerformanceGovernor.Instance?.CurrentScale ?? 1f,
            stp = PerformanceGovernor.Instance?.StpActive ?? false,
            device = SystemInfo.graphicsDeviceName
        };
        Directory.CreateDirectory("Library");
        File.WriteAllText("Library/PerfReport.json", JsonUtility.ToJson(report, true));
        Debug.Log($"Perf: P50={report.p50:F2}ms P95={report.p95:F2}ms P99={report.p99:F2}ms " +
                  $"(scale={report.scale:F2}, stp={report.stp})");
    }

    float Percentile(float p) =>
        frameMs[Mathf.Min(frameMs.Count - 1, Mathf.FloorToInt(frameMs.Count * p))];

    [System.Serializable]
    class Report
    {
        public int frames;
        public float p50, p95, p99;
        public float scale;
        public bool stp;
        public string device;
    }
}
```

**Methodology rules:**

1. Perf runs always use the same seed sequence (fixed catalog draw) so results diff cleanly across builds.
2. GPU truth comes from platform profilers on hardware; PC proxies with Unity GPU Profiler + RenderDoc.
3. Report gate: **P95 ≤ 16.6 ms** (not P50) — players feel the tail, not the average.
4. Run the harness at 60, 90, and 120 pieces; the 120-piece run validates the SleepManager ceiling.

## K.7 K exit criteria

- [ ] Handheld profile holds 60 FPS (P95) at STP scale 0.65–0.85 with a 90-piece tower.
- [ ] Console profile holds native 1080p, dropping to 0.85 only during collapse cascades.
- [ ] No visible scale “breathing” during 5 minutes of normal play (governor log review).
- [ ] Fallback ladder engages/steps back in correct order (forced-stress scene).
- [ ] HUD remains pixel-sharp at all internal scales.

---

# Part L — Deep Dive: World-by-World Campaign Level Design Guide

## L.1 Campaign shape

| | |
|---|---|
| Structure | 6 worlds × 12 levels = **72 levels** |
| Curve per world | Levels 1–4 **TEACH** · 5–8 **TWIST** · 9–12 **TEST** |
| Unlock gate | World N+1 opens at ≥ 6 stars in World N (Part F gating) |
| Session design | Any level completable in < 90 s; instant retry always |
| Data | Each level = one `LevelDefinition`; each world = one `WorldDefinition` + folder |

```csharp
[CreateAssetMenu(menuName = "ZENITH/World Definition")]
public sealed class WorldDefinition : ScriptableObject
{
    public int worldIndex = 1;
    public string displayName = "First Steps";
    [TextArea] public string introText;      // shown once on first entry
    public ThemeDefinition theme;
    public int starsToUnlock = 6;
    public Color accentColor = Color.white;  // world map + UI accents
}
```

## L.2 Global design principles

1. **One new idea per world.** Never introduce a piece and an objective in the same level.
2. **Show, don’t explain.** The first level of each world demonstrates the mechanic by geometry alone (a gap can only be solved by bridging).
3. **Fail states must read as fair.** If a level is lost, the player should be able to say exactly which placement caused it.
4. **Par is the difficulty dial, not the geometry.** A level is too hard if its 1★ solution requires precision; tighten pars instead.
5. **Every world ends with a capstone** combining that world’s mechanic with one earlier mechanic.

**Par baseline table (tune ±1 per level):**

| Level type | Typical pieces | 3★ pieces | 3★ time |
|---|---|---|---|
| Teach (1–4) | 3–5 | = pieces used | 45 s |
| Twist (5–8) | 5–7 | pieces used − 1 | 60 s |
| Test (9–12) | 6–9 | pieces used − 1…2 | 75 s |

## L.3 World 1 — “First Steps” (Foundations)

**Teaches:** grab/move/release · settle patience · height building.
**Piece pool:** cube, brick, column. **Anchors:** none (pedestal only). **Theme:** dawn pastels.

| # | Name | Challenge | Objective |
|---|---|---|---|
| 1 | Three Blocks | Stack 3 cubes to 2.5 m | ReachHeight 2.5 |
| 2 | Wide Base | Brick foundation, then height | ReachHeight 3.5 |
| 3 | Use Them All | Place all 4 pieces | PlaceAll |
| 4 | The Pillar | Column on cube on brick | ReachHeight 5.0 |
| 5 | Offset | Center of mass taught: overhanging brick | ReachHeight 4.0 |
| 6 | Staircase | Ascending bricks | PlaceAll (6 pcs) |
| 7 | Narrow Footing | Tall build, 3-column stack | ReachHeight 6.0 |
| 8 | Leftovers | Reach height with pieces to spare | ReachHeight 4.5 (par 4) |
| 9 | Minimalist | Exactly 4 pieces, 5 m | ReachHeight 5.0 |
| 10 | The Monument | 8 pieces, tall + stable | PlaceAll + Survive 5 s |
| 11 | Featherweight | Only cubes, 7 m | ReachHeight 7.0 |
| 12 | Capstone: Ziggurat | Symmetric pyramid, survive | PlaceAll (9) + Survive 8 s |

```
L1 “Three Blocks” (teach)          L9 “Minimalist” (test)
    ─ ─ ─ 2.5 m line                    ─ ─ ─ 5.0 m line
   ┌───┐                                 ┌───┐
   │ □ │ ← cube                          │ □ │
   └───┘                                 └───┘
   ┌───┐                                 ┌───┐
   │ □ │                                 │ □ │
   └───┘                                 └───┘
 ══╤═══╤══ pedestal                    ══╤═══╤══
```

## L.4 World 2 — “Mind the Gap” (Bridging)

**Teaches:** ConnectZones · plank spanning · anchors as piers.
**Piece pool:** plank, brick, cube, column. **Anchors:** piers, floating slabs. **Theme:** seaside pale blue.

| # | Name | Challenge | Objective |
|---|---|---|---|
| 1 | First Bridge | Single plank over 2.5 m gap | Connect A⇄B |
| 2 | Two Planks | Gap too wide for one plank | Connect |
| 3 | Stepping Stone | Mid-air anchor as relay | Connect |
| 4 | High Road | Bridge at height 3 | Connect + ReachHeight 3 |
| 5 | Uneven Piers | Left pier 1 m higher than right | Connect |
| 6 | Counterweight | Plank cantilever needs cube ballast | Connect |
| 7 | The Arch Way | Two-stage bridge, angled slab | Connect |
| 8 | Tight Budget | Connect with exactly 3 pieces | Connect (par 3) |
| 9 | Twin Gaps | Two gaps, one piece sequence | Connect ×2 pairs |
| 10 | Skyline | Bridge + build tower on far pier | Connect + ReachHeight 5 |
| 11 | Lean On Me | Rotated anchor forces slanted span | Connect |
| 12 | Capstone: Aqueduct | Long bridge + height + survive | Connect + Survive 6 s |

```
L3 “Stepping Stone” (side view)

   ▣zone_A           ▣zone_B
 ┌────┐   ┌────┐   ┌────┐
 │pier│   │float│   │pier│     plank 1: pedestal→float
 └────┘   │ slab│   └────┘     plank 2: float→pier
          └────┘
 ══════ pedestal
```

## L.5 World 3 — “Rolling Stock” (Round things)

**Teaches:** cylinder/sphere control · cradles · chocking with wedges · patience on settle.
**Piece pool:** cylinder, sphere, wedge, plank, cube. **Theme:** terracotta warm.

| # | Name | Challenge | Objective |
|---|---|---|---|
| 1 | Gently Now | Land a cylinder without it rolling off | Survive 5 s |
| 2 | The Cradle | Two cubes form a slot for a sphere | Survive 6 s |
| 3 | Chock | Wedge stops a cylinder on a slope | Survive 6 s |
| 4 | Round Tower | Cylinder in the stack, height 3 | ReachHeight 3.0 |
| 5 | Sphere Shelf | Sphere on plank on cubes | Survive 8 s |
| 6 | Log Cabin | Alternating cylinder/cube layers | PlaceAll (6) |
| 7 | The Ramp | Wedge ramp + cylinder at rest on flat | Survive 8 s |
| 8 | Don’t Roll | Sphere placed last, tower intact | PlaceAll + Survive 5 s |
| 9 | Ballast | Cylinder counterweight for overhang | ReachHeight 4.5 |
| 10 | Rolling Stone | Sphere to far edge without falling | Survive 10 s |
| 11 | Mixed Drum | 3 cylinders integrated in 6 m tower | ReachHeight 6.0 |
| 12 | Capstone: Round Keep | Cradle + height + survive | ReachHeight 4 + Survive 8 s |

Design note: every round-piece level needs at least one **safe rest spot** visible from spawn (a flat plank-width surface) — frustration audit rule R-3.

## L.6 World 4 — “Weather Front” (Wind)

**Teaches:** `WindModifier` (gusts) · SurviveTime under disturbance · low-center-of-mass planning.
**Piece pool:** brick, column, cube, plank. **Modifier:** wind. **Theme:** storm blue-grey.

`WindModifier` implementation (M4 `LevelModifier` contract):

```csharp
[CreateAssetMenu(menuName = "ZENITH/Modifiers/Wind")]
public sealed class WindModifier : LevelModifier
{
    public float strength = 2.5f;        // impulse magnitude
    public float minInterval = 12f;
    public float maxInterval = 20f;
    public float minY = 1.5f;            // only pieces above this height are affected
    public AudioClip gustCue;            // 2 s warning whistle before each gust

    public override void Apply(GameObject levelRoot)
    {
        levelRoot.AddComponent<WindGustController>().Configure(this);
    }
}

// WindGustController: schedules gusts; applies ForceMode.Impulse horizontally to every
// awake Rigidbody with position.y >= minY; plays cue 2 s ahead; direction alternates.
```

| # | Name | Challenge | Objective |
|---|---|---|---|
| 1 | First Breeze | Light gusts, simple stack | Survive 10 s |
| 2 | Stay Low | Wide base beats tall | Survive 12 s |
| 3 | Between Gusts | Place during calm windows | PlaceAll (5) |
| 4 | Leaning Tower | Offset build survives gusts | ReachHeight 4.0 |
| 5 | Stronger Winds | Strength 3.5 | Survive 15 s |
| 6 | Windbreak | Anchor wall shelters the stack | Survive 15 s |
| 7 | Timed Build | Height before the storm cycle | ReachHeight 5.0 |
| 8 | Paper Tower | Only planks + cubes in wind | Survive 12 s |
| 9 | Gale | Strength 4.5, 10 s interval | Survive 15 s |
| 10 | Build & Brace | Alternate placing and surviving | PlaceAll (7) |
| 11 | The Needle | 6 m tower in wind | ReachHeight 6.0 |
| 12 | Capstone: Eye of the Storm | Bridge + wind | Connect + Survive 10 s |

Fairness rule W-1: first gust never arrives before the player’s 2nd placed piece settles.

## L.7 World 5 — “Special Delivery” (Marked pieces)

**Teaches:** DeliverPiece · protecting a VIP piece · goal zones · routing round VIPs.
**Piece pool:** all core pieces; VIP varies per level. **Theme:** gold amber.

| # | Name | Challenge | VIP | Objective |
|---|---|---|---|---|
| 1 | The Parcel | Deliver a cube to goal | cube | Deliver |
| 2 | Upstairs | Goal zone elevated on anchor | cube | Deliver |
| 3 | Fragile | VIP sphere — don’t drop it | sphere | Deliver |
| 4 | Rolling Delivery | Cylinder VIP across a gap | cylinder | Deliver |
| 5 | Decoy Tower | Build height too, then deliver | brick | Deliver + ReachHeight 3 |
| 6 | Last In | VIP must be placed last | cube | Deliver (sequence end) |
| 7 | High Shelf | Goal at 4 m, requires scaffolding | sphere | Deliver |
| 8 | The Gauntlet | Wind + delivery | cube | Deliver (WindModifier) |
| 9 | Double Drop | Two goals, pick the reachable one | cube | Deliver |
| 10 | Careful Stairs | Elevated path of piers | sphere | Deliver |
| 11 | Heavy Parcel | Column VIP — structure must bear it | column | Deliver + Survive 6 s |
| 12 | Capstone: The Crown | Sphere VIP to summit at 6 m | sphere | Deliver + ReachHeight 6 |

Visual language: VIP piece gets gold rim (`PieceFactory.MarkAsDeliverTarget`, Part F) and goal zone pulses gently.

## L.8 World 6 — “Masterworks” (Expert gauntlet)

**Teaches:** nothing new — combines everything. Expert pieces enter: L/T beams, half-pipe, arch.
**Theme:** dusk purple. All five objective types appear; pars are the tightest in the game.

| # | Name | Challenge | Objective |
|---|---|---|---|
| 1 | L-Shape Logic | First L-beam: hook over pier | Connect |
| 2 | T-Time | T-beam as bridge footing | Connect + ReachHeight 3 |
| 3 | Half Pipe Home | Sphere settles inside half-pipe | Survive 8 s |
| 4 | The Archway | Arch + columns monument | PlaceAll (6) |
| 5 | Rolling VIP II | Sphere delivery over L-beam bridge | Deliver |
| 6 | Storm Keep | Wind + height with expert pieces | ReachHeight 5.5 |
| 7 | Everything, Everywhere | Bridge + height + place all | Connect + ReachHeight 4 |
| 8 | Minimal Master | 5 pieces, three objectives | Connect + Survive 6 s |
| 9 | The Long Way | Two-stage bridge, wind | Connect |
| 10 | Summit Delivery | Deliver to 6 m summit, wind | Deliver + ReachHeight 6 |
| 11 | The Impossible Shelf | Sphere on wedge on plank… | Survive 12 s |
| 12 | **ZENITH** | The signature level: bridge + summit delivery + wind + survive, 12-piece budget | Connect + Deliver + Survive 10 s |

Level 12 is the game’s statement piece — the level players screenshot. Budget extra tuning time; it must be hard but never feel random.

## L.9 Anti-cheese checklist (run per level, and via bot)

| Cheese | Test | Fix |
|---|---|---|
| Single-piece bridge in a “two-plank” level | Par bot with all pieces | Move piers apart / shrink zones |
| Throwing the VIP directly into goal | Playtest with max throw | Lower goal roof anchor or distance |
| Survive levels won with one wide plank on pedestal | Bot | Add wind or piece constraint |
| Zone satisfied by a piece resting on the zone edge | OverlapBox audit | Shrink zone 10% or require settle-inside (Deliver only) |
| Ignoring the marked piece entirely | Sequence review | Make VIP mandatory via PlaceAll combo |

## L.10 Content production schedule (M6 weeks)

| Week | Content | Support work |
|---|---|---|
| 1 | Worlds 4–5 authored (24 levels) | Performance harness running nightly on content scenes |
| 2 | World 6 authored (12 levels) + Worlds 1–3 par retune | Localization string freeze |
| 3 | Full campaign playthrough #1 (fresh eyes); fix S2s | STP pipeline per platform (Part K) |
| 4 | Full campaign playthrough #2; cert checklist; soak tests | Bug burn to zero S1/S2 |

Audio note: each world needs its own ambient loop + settle-chime palette variant (6 total) — final audio contractor pass lands in week 3.

---

*End of Parts J, K, and L. With this document the master plan’s milestones M0–M6 are fully specified end to end. The project is now ready for production: stand up the repo per M0, run the M1 bootable scene, and let the milestone gates drive the schedule.*

***

# Project ZENITH — Production Index
### Single-page map of every file, scene, ScriptableObject, and system (M0–M6)

| | |
|---|---|
| Purpose | Onboarding, repo setup, and cross-reference for the complete implementation |
| Audience | Any engineer/designer joining the project; future-you after a break |
| Status | Complete — supersedes all ad-hoc file lists in earlier deliverables |

---

## 1. Document Map (read in this order)

| # | File | Contents |
|---|---|---|
| 0 | `Project_ZENITH_ArtOfBalanceStyle_Unity6_ImplementationPlan.md` | Master plan: pillars, architecture, physics, M0–M6 milestones, risks |
| 1 | `Project_ZENITH_M1_StarterKit_and_LevelWorkbench.md` | Part A: bootable M1 code · Part B: Workbench design + skeletons |
| 2 | `Project_ZENITH_PartC_WorkbenchAndM2Features.md` | Part C: complete Workbench editor code · Part D: M2 (preview, ramp, 2P) |
| 3 | `Project_ZENITH_PartE_M3_Presentation_Audio_Shaders.md` | Part E: themes, Shader Graph deep dive, audio framework |
| 4 | `Project_ZENITH_PartF_M4_PuzzleFramework_and_UIToolkit.md` | Part F: puzzle runtime + contact-graph BFS · Part G: UI Toolkit |
| 5 | `Project_ZENITH_PartH_M5_PortFeatureLayer_and_DeepDives.md` | Part H: M5 port features · Part I: ghost recorder + touch deep dives |
| 6 | `Project_ZENITH_PartJ_M6_Content_Perf_Cert_and_CampaignGuide.md` | Part J: M6 polish/cert · Part K: STP pipeline · Part L: campaign guide |
| 7 | **This document** | Production index |

---

## 2. Repo Setup

### 2.1 Git

```
.gitignore essentials:
  Library/ Temp/ Obj/ Build/ Builds/ Logs/ UserSettings/
  *.csproj  *.sln  *.pidb  *.booproj  *.suo  *.user
KEEP:  Packages/manifest.json · Packages/packages-lock.json · ProjectSettings/ (all)
```

| Branch | Use |
|---|---|
| `main` | Release candidates only; every commit passes CI |
| `develop` | Integration branch; milestone gates land here |
| `feature/m{n}-{topic}` | Milestone work (e.g. `feature/m4-contactgraph`) |
| `content/world{n}` | Level authoring (designers; validated before merge) |

### 2.2 CI (minimum)

| Job | Trigger | Checks |
|---|---|---|
| Build verify | Every PR | Player build succeeds (PC Development + Release) |
| EditMode tests | Every PR | Unit suite (scoring, validator, catalog integrity) |
| Level validation | Content branches | `LevelValidator.Run` batch across all 72 levels, 0 errors |
| Nightly perf | develop | PerfTestRunner → `PerfReport.json` diff posted |

### 2.3 Packages

| Package | Why |
|---|---|
| `com.unity.render-pipelines.universal` | Rendering + post + **STP** |
| `com.unity.inputsystem` | All input + EnhancedTouch + DualShock rumble |
| `com.unity.ui` (UI Toolkit) | All UI |
| `com.unity.test-framework` | Tests |
| `com.unity.addressables` | Per-world content bundles (console memory) |

### 2.4 Editor settings

| Setting | Value | Reason |
|---|---|---|
| Player → Active Input Handling | Input System Package (New) | Required; restart editor |
| Enter Play Mode Options | **Off** (or on + audit statics) | Statics exist: `PieceCatalog`, `ContactGraph.Instance`, pools |
| Version control | Visible Meta Files | Designer-friendly merges |

---

## 3. Project Settings Checklist (one-time, all in one place)

| Area | Setting | Value | Set by |
|---|---|---|---|
| Physics | Solver Type | **TGS** | Manual (not scriptable) |
| Physics | Fixed timestep / solver iterations / contact offset / sleep / bounce | 0.02 / 12 / 0.005 / 0.005 / 2 | `PhysicsConfigurator` at boot |
| Layers | `Piece`, `Preview`, `Ghost` | Create (suggest 6/7/8) | Manual |
| Collision matrix | Piece↔Piece ✔ · Piece↔Default ✔ · Ghost/Preview ↔ nothing | Configure | Manual |
| Quality | 3 tiers → `URP_Desktop_High`, `URP_Console_Base`, `URP_Handheld` | Configure + per-platform defaults | Manual + `PerformanceGovernor` runtime |
| URP (Handheld asset) | Upscaling Filter = **STP**, renderScale 0.65–0.85 | Configure | Governor adjusts at runtime |
| Audio | Master mixer `ZENITH_Mixer` | Create | Manual |
| Tags | `MainCamera` only | Default | — |

---

## 4. Folder Tree (annotated)

```
Assets/_Project/
├─ Art/
│  ├─ Meshes/                     # Beveled piece meshes (M3 art pass; M1 uses primitives)
│  ├─ Materials/
│  ├─ Shaders/
│  │  ├─ GradientBackground.shader                    [Part A]
│  │  └─ ZenithPiece.shadergraph                     [Part E]  Matte + rim + instability
│  └─ VFX/                        # Dust, splash, sparkles, milestone motes   [Part E]
├─ Audio/
│  ├─ Ambience/                   # 6 world loops                            [Part E / J]
│  ├─ SFX/                        # Material impacts, chime, gust cue, UI    [Part E]
│  └─ Mixers/ZENITH_Mixer.mixer                                              [Part E]
├─ Code/                          # See §5 manifest (asmdefs: Project.Core, Project.Editor, Project.Tests)
├─ Data/
│  ├─ Pieces/                     # Piece_*.asset ×12 (frozen catalog order) [A → M5]
│  ├─ Themes/                     # Theme_01_Dawn … Theme_06_Dusk            [Part E]
│  ├─ Worlds/                     # World_01 … World_06                      [Part L]
│  ├─ Levels/World01…World06/     # Level_w01_l01 … Level_w06_l12  (×72)     [F / M6]
│  ├─ Objectives/                 # Reusable Objective SO instances          [Part F]
│  └─ ModeConfigs/                # ArcadeDifficultyProfile, RuleConfigs     [Part D]
├─ UI/
│  ├─ ZenPanelSettings_HUD.asset  # sortOrder 10, scale-with-screen 1920×1080 [Part G]
│  ├─ ZenPanelSettings_Screens.asset  # sortOrder 20                          [Part G]
│  ├─ zen-tokens.uss              # Design system                            [Part G]
│  ├─ HUD.uxml · MainMenu.uxml · LevelSelect.uxml                            [Part G]
│  └─ Localization/strings_{en,de,fr,es,it,ja}.csv                           [Part J]
├─ Input/
│  └─ ZENITHInputActions.inputactions   # UI map: Submit/Cancel/Nav*         [Part G/H]
├─ Scenes/                        # See §7
└─ Settings/
   ├─ URP_Desktop_High.asset · URP_Console_Base.asset · URP_Handheld.asset   [B / K]
   └─ (PhysicMaterial is runtime-created by PieceFactory — no asset needed)
```

---

## 5. File Manifest

Legend: **Intro** = deliverable part where the complete code appears · **MS** = milestone delivered.

### 5.1 Code/Core

| File | Intro | MS | Role |
|---|---|---|---|
| `GameBootstrap.cs` | A | M1 | Builds the whole greybox scene in code |
| `ArcadeGameController.cs` | A (+F refactor) | M1 | Core loop: spawn→grab→drop→settle→score→collapse |
| `VersusModeController.cs` | D | M2 | 2P alternating turns, per-player lives |
| `TimeAttackModeController.cs` | H | M5 | 120 s countdown mode |
| `DailyModeController.cs` + `DailyChallenge.cs` | H | M5 | Seeded 25-piece daily run |
| `PuzzleModeController.cs` + `PuzzleResult` | F | M4 | Sequence, objectives, stars, instant retry |
| `ResumeService.cs` + `RunSnapshot.cs` + `PlacementRecord` | H | M5 | Suspend/resume (schema v1, atomic writes) |
| `LevelHandoff.cs` | G | M5 | Menu→Game level transfer |
| `PerformanceGovernor.cs` + `DeviceClassDetector.cs` | K | M6 | STP/dynamic-resolution pipeline |
| `TestResult.cs` | C | M4 | Workbench↔harness result contract (top-level, not nested) |

### 5.2 Code/PhysicsTools

| File | Intro | MS | Role |
|---|---|---|---|
| `PhysicsConfigurator.cs` | A | M1 | Runtime physics tuning application |
| `SettleDetector.cs` | A | M1 | Calm-time + timeout settle logic |
| `KillPlane.cs` | A | M1 | Camera-following drop trigger |
| `ContactGraph.cs` | F | M4 | Piece↔piece edges, staleness pruning, BFS |
| `SleepManager.cs` | Master §4.4 | M2 | Force-sleep far-below pieces; awake cap |
| `InstabilityProbe.cs` | Master §4.4 / E | M3 | COM/contact heuristic → danger value |
| `WindGustController.cs` | L | M6 | Wind modifier runtime (impulse gusts + cue) |

### 5.3 Code/Pieces

| File | Intro | MS | Role |
|---|---|---|---|
| `PieceDefinition.cs` (+ `ColliderSetup`) | A | M1 | Piece spec SO (id, tier, density, colliders) |
| `PieceFactory.cs` | A | M1 | Builds pieces/materials; +F deliver-mark, +I ghost visuals |
| `PieceInstance.cs` | A | M1 | Runtime wrapper; +D `OwnerPlayerIndex`, +F `PieceId` & graph feed |
| `PieceCatalog.cs` | I | M5 | **Frozen** catalog order used by ghost indices |

### 5.4 Code/Manipulation

| File | Intro | MS | Role |
|---|---|---|---|
| `HeldPiece.cs` | A | M1 | Kinematic hold, smoothed throw velocity |
| `PlacementRig.cs` | A | M1 | Pointer→plane mapping, rotation; +I relative drag |
| `IGrabPolicy.cs` (Pointer + TouchRelative impls) | I | M5 | Scheme-specific grab rules |
| `TwistGesture.cs` | I | M5 | Two-finger twist, dead zone, 45° snap |
| `TouchButtonPad.cs` | I | M5 | ⟲/⟳ buttons: tap=step, hold=continuous |

### 5.5 Code/Input

| File | Intro | MS | Role |
|---|---|---|---|
| `IPointerSource.cs` | A | M1 | Pointer abstraction |
| `UnifiedPointerSource.cs` | A | M1 | Mouse + touch polling |
| `VirtualCursorPointerSource.cs` | H | M5 | Gamepad reticle w/ acceleration curve |
| `InputModeManager.cs` | H | M5 | Last-active-device detection + `ModeChanged` |

### 5.6 Code/Camera · Code/Objectives

| File | Intro | MS | Role |
|---|---|---|---|
| `TowerCameraRig.cs` | A | M1 | Rising camera, frustum helpers |
| `Objective.cs` (base SO) | Master B.7 | M4 | Objective data contract |
| `ReachHeightObjective.cs` / `SurviveTimeObjective.cs` / `PlaceAllPiecesObjective.cs` / `ConnectZonesObjective.cs` / `DeliverPieceObjective.cs` | F | M4 | The five objective data SOs |
| `ObjectiveRuntime.cs` (base + factory + 5 runtimes) | F | M4 | Stateful evaluation (timers, BFS, marked piece) |

### 5.7 Code/Modes & Content Data

| File | Intro | MS | Role |
|---|---|---|---|
| `LevelDefinition.cs` (+ `AnchorDefinition`, `ZoneDefinition`, enums) | B/F | M4 | Level data contract |
| `WorldDefinition.cs` | L | M6 | World metadata (theme, unlock, intro text) |
| `ThemeDefinition.cs` | E | M3 | Palette, sky colors, music, activation height |
| `ArcadeDifficultyProfile.cs` | D | M2 | Tier weight AnimationCurves over pieces placed |
| `LevelModifier.cs` (base) + `WindModifier.cs` | F / L | M4/M6 | Pluggable level rules |
| `LevelBoardBuilder.cs` | F | M4 | Pedestal/anchors/zones instantiation |
| `ZoneTrigger.cs` | F | M4 | Zone occupancy tracking for BFS/delivery |
| `LevelProgressStore.cs` | F | M4 | Stars/pars JSON + world gating |
| `NextPiecePreview.cs` (+ `SpinPreview`) | D | M2 | RenderTexture preview camera + spawner |

### 5.8 Code/Audio

| File | Intro | MS | Role |
|---|---|---|---|
| `AudioDirector.cs` | E | M3 | Pools, material clips, music crossfade |
| `PieceAudio.cs` | E | M3 | Impulse→volume, mass→pitch, cooldowns |
| `SettleChimePlayer.cs` | E | M3 | Pentatonic progression on settle |
| `InstabilityAudio.cs` | E | M3 | Danger drone |

### 5.9 Code/Platform

| File | Intro | MS | Role |
|---|---|---|---|
| `IRumbleProvider.cs` / `GamepadRumbleProvider.cs` / `RumbleDirector.cs` | H | M5 | Haptics abstraction (DualShock live on PC) |
| `IShareService.cs` / `DesktopShareService.cs` | H | M5 | Screenshot capture + share hook |
| `IGhostService.cs` / `LocalGhostService.cs` | I | M5 | Ghost slot resolution (local → online later) |
| `GhostRecorder.cs` / `GhostFile.cs` / `GhostIO.cs` / `GhostRunner.cs` | I | M5 | Binary ghost format, record + visual-only replay |
| `SettingsStore.cs` / `HighScoreStore.cs` | Master §15 | M2/M5 | settings.json · highscores.json |
| `L10N.cs` | G | M5 | CSV string table |

### 5.10 Code/UI

| File | Intro | MS | Role |
|---|---|---|---|
| `UIManager.cs` | G | M5 | Screen stack, safe area, focus handoff |
| `HUDController.cs` | G | M5 | Event-driven HUD, 10 Hz scheduled polls |
| `MainMenuController.cs` / `LevelSelectController.cs` | G | M5 | Menu + world grid |
| `MenuNavigator.cs` | G | M5 | Gamepad focus navigation |
| `SimpleHUD.cs` | A | M1 | IMGUI debug HUD (`#if ZENITH_DEBUG` after M5) |

### 5.11 Code/Editor (Project.Editor asmdef)

| File | Intro | MS | Role |
|---|---|---|---|
| `LevelWorkbenchWindow.cs` | B/C | M4 | Authoring window: CRUD, validate, test |
| `LevelValidator.cs` | C | M4 | Rules L-01…L-10 with property paths |
| `LevelWorkbenchProxy.cs` / `LevelWorkbenchProxyEditor.cs` | B/C | M4 | Scene handles for anchors/zones |
| `LevelTestHarness.cs` | C | M4 | Playmode test runner + result JSON |
| `PerfTestRunner.cs` | K | M6 | Auto-stacker + percentile report |

### 5.12 Art / UI / Input assets

| Asset | Intro | MS | Notes |
|---|---|---|---|
| `GradientBackground.shader` | A | M1 | Anti-banded vertical gradient + hue drift |
| `ZenithPiece.shadergraph` | E | M3 | Matte + Fresnel rim + `_DangerTint`, SRP Batcher safe |
| `zen-tokens.uss` · `HUD.uxml` · `MainMenu.uxml` · `LevelSelect.uxml` | G | M5 | Design system + screens |
| PanelSettings ×2 | G | M5 | HUD (sort 10) / Screens (sort 20) |
| `ZENITHInputActions.inputactions` | G/H | M5 | UI map only; gameplay polls devices directly |
| VFX prefabs (dust, splash, sparkle, motes) | E | M3 | Pooled, theme-tinted |
| Audio: mixer, 6 ambience loops, impact families, chime | E/J | M3/M6 | All original composition |

---

## 6. ScriptableObject Catalog

| SO type | Instances | Location | Notes |
|---|---|---|---|
| `PieceDefinition` | 12 (cube, brick, plank, column, longplank, cylinder, wedge, lbeam, tbeam, sphere, halfpipe, arch) | `Data/Pieces/` | **Append-only order** (ghost indices) |
| `ThemeDefinition` | 6 (`Theme_01_Dawn` … `Theme_06_Dusk`) | `Data/Themes/` | One per world + arcade milestones |
| `WorldDefinition` | 6 | `Data/Worlds/` | Unlock gates, intro text |
| `LevelDefinition` | 72 | `Data/Levels/WorldNN/` | Author via Workbench only |
| `Objective` (5 subtypes) | Reusable templates + per-level refs | `Data/Objectives/` | Data only; state lives in runtimes |
| `ArcadeDifficultyProfile` | 1 | `Data/ModeConfigs/` | Tier ramp curves |
| `RuleConfig` | Per mode | `Data/ModeConfigs/` | Lives, penalties, score table |
| `LevelModifier` (Wind) | Per-level refs | `Data/ModeConfigs/Modifiers/` | Pluggable |
| `ZenPanelSettings` | 2 | `UI/` | HUD / Screens |

---

## 7. Scene Map

| Scene | Purpose | Key contents | Loaded by |
|---|---|---|---|
| `M1_Greybox` | Dev harness / physics feel gate | `GameBootstrap` only | Manual (never in builds) |
| `MainMenu` | Menus + attract-mode auto-stack demo | `UIManager`, `MainMenuController`, attract `ArcadeGameController` (auto-play), ThemeDirector | Boot |
| `Game` | All gameplay modes | Mode controller (chosen via `LevelHandoff`/mode select), camera rig, board builder, HUD, ghost runner, resume prompt | MainMenu |
| `LevelTest` | Workbench ▶ Test target | `LevelTestHarness` + `PuzzleModeController` | Workbench (editor) |
| `PerfTest` | Performance harness | `PerfTestRunner` + governor + auto-placer | Manual / CI |

Build order in Build Settings: `MainMenu → Game → LevelTest → PerfTest` (last two stripped from release).

---

## 8. System Map

### 8.1 Dependency tree

```
Scene roots
├── PhysicsConfigurator (static boot hook)
├── InputModeManager ─────────────► notifies: controllers, HUD, MenuNavigator
├── TowerCameraRig ── KillPlane ──► ArcadeGameController.HandleBodyCrossed
├── ArcadeGameController  (base)
│    ├── VersusModeController
│    ├── TimeAttackModeController
│    ├── DailyModeController
│    └── PuzzleModeController ── LevelBoardBuilder ── ZoneTrigger[]
│             ├── ObjectiveRuntime[] ── ContactGraph (BFS on settle)
│             └── LevelProgressStore (JSON)
├── PieceFactory ── PieceCatalog (frozen order)
├── PlacementRig ◄── IPointerSource (Unified | VirtualCursor) + IGrabPolicy + TwistGesture/TouchButtonPad
├── ThemeDirector ── ThemeDefinition[]  (height-driven crossfades)
├── AudioDirector ── PieceAudio / SettleChimePlayer / InstabilityAudio
├── UIManager ── HUDController / MainMenu / LevelSelect / Results / MenuNavigator
├── GhostRecorder / GhostRunner ◄── LocalGhostService
├── ResumeService  (RunSnapshot JSON)
├── RumbleDirector ── IRumbleProvider
├── ShareService   (IShareService)
└── PerformanceGovernor ── URP asset (renderScale + STP)
```

### 8.2 Event flow (who signals whom)

| Event | Producer | Consumers |
|---|---|---|
| `StatsChanged` | Controller (score/lives/phase changes) | HUDController |
| `OnPieceSettled(Event)` | Controller / PieceInstance | HUD, SettleChimePlayer, GhostRecorder, RumbleDirector, ObjectiveRuntimes, NextPiecePreview |
| `OnRunStarted` | Controller | SettleChimePlayer, GhostRecorder, ResumeService (clear) |
| `BodyCrossed` | KillPlane | Controller (drop vs collapse routing) |
| `Settled` / `TimedOut` | SettleDetector | PieceInstance → Controller |
| `ModeChanged` | InputModeManager | Controller (scheme), HUD (hints/reticle), MenuNavigator |
| `LevelCompleted` / `LevelFailed` | PuzzleModeController | HUD banner, Results screen, ProgressStore |
| `TimeExpired` | TimeAttackModeController | HUD, Results |
| Dock/device-class events | Platform plugin (stub on PC) | PerformanceGovernor |

---

## 9. Milestone × Contents Matrix (onboarding order)

| MS | Systems delivered | Key files (§5 refs) | Gate (exit criteria ref) |
|---|---|---|---|
| **M0** | Repo, CI, URP, input setup | §2–§3 of this index | Build boots |
| **M1** | Physics feel + grab/drop/settle loop | Core A, PhysicsTools A, Manipulation A | Master §4.6 checklist |
| **M2** | Preview, difficulty ramp, 2P versus, sleep mgmt | D files + `SleepManager` | Part D §D.4 |
| **M3** | Themes, shaders, audio, instability feedback | E files + `ZenithPiece.shadergraph` | Part E §E.5 |
| **M4** | Puzzle runtime, contact graph, Workbench, UI Toolkit, progress | F + C + G files | Part F §F.8 · Part G §G.9 |
| **M5** | Schemes, ghosts, rumble/share, resume, time attack, daily | H + I files | Part H §H.8 · Part I §I.2.9 |
| **M6** | 72 levels, STP pipeline, cert, localization, soak | J/K/L files + all content | Part J §J.6 (Definition of Done) |

---

## 10. Day-One Quickstart

1. Read master plan §1–§4 (pillars + physics) — 30 min.
2. Clone repo → open in Unity 6 (6000.x) → install packages → set **Active Input Handling = Input System Package (New)** → restart.
3. Apply §3 checklist: TGS solver, layers, URP quality tiers.
4. Open `Scenes/M1_Greybox` → Play → run Deliverable 1 §A.6 checklist.
5. Open `ZENITH → Level Workbench`, select `Level_w01_l01`, press **▶ Test Level**.
6. Skim Parts C–L in order; each is self-contained with code.
7. Pick a task from the milestone matrix (§9) matching current sprint.

---

## 11. Naming Conventions

| Element | Convention | Examples |
|---|---|---|
| Runtime classes | PascalCase; behavior owner = `Controller`; singleton coordinator = `Director`; platform abstraction = `Provider`/`Service` | `PuzzleModeController`, `ThemeDirector`, `IRumbleProvider` |
| Editor classes | Live in `Project.Editor` asmdef; window suffix `Window` | `LevelWorkbenchWindow` |
| ScriptableObject types | No `SO` suffix | `PieceDefinition` |
| Piece assets | `Piece_{id}` | `Piece_lbeam` |
| Level assets | `Level_w{NN}_l{MM}`; id must match | `Level_w03_l07` |
| Themes / worlds | `Theme_{NN}_{Name}`, `World_{NN}` | `Theme_04_Storm`, `World_02` |
| Save files | lowercase JSON in `persistentDataPath` | `progress.json`, `resume.json`, `ghosts/*.ghost` |
| L10N keys | `{screen}.{element}` | `menu.play`, `hud.stacked` |

---

## 12. Platform Readiness Matrix

| Target | Unity build path | Available in generic builds today | Arrives with SDK |
|---|---|---|---|
| Windows / macOS / Linux | Standard | **Everything** (all features testable) | — |
| Steam (optional) | Standard | Local leaderboards, stubs | `SteamPlatformServices` |
| Nintendo Switch | NDA SDK required | Touch + single-Joy-Con schemes, resume, all mode logic | HD Rumble, dock events, capture hooks, eShop cert |
| PlayStation 4/5 | NDA SDK required | Gamepad cursor, trophies data model, share flow | Light bar, Share button wiring, TRC fixes |
| Wii U / 3DS lineage | Not buildable | **Feature sets emulated**: touch schemes, puzzle mode, ghost exchange, off-screen layout options | — |

---

## 13. Glossary

| Term | Meaning |
|---|---|
| **Depth slab** | Invisible walls at z = ±0.85 keeping the tower in a 2.5D plane |
| **Settle** | Piece calm (< 0.06 m/s, < 3°/s) for 0.9 s → scored |
| **Par** | Level benchmark values (pieces/time) driving the 3-star rating |
| **VIP piece** | The gold-rimmed marked piece in DeliverPiece levels |
| **Ghost** | Visual-only replay tower of a recorded run (~23 B per placement) |
| **MPB** | MaterialPropertyBlock — per-piece color without material instances |
| **STP** | Unity 6 URP spatial-temporal upscaler (handheld performance) |
| **Governor** | PerformanceGovernor — dynamic renderScale controller |
| **Cheese** | Degenerate solution bypassing intended challenge (see Part L §L.9) |
| **Rule codes** | C-1 contact edges piece-only · SR-1 discard held piece on suspend · TR-1…4 touch arbitration · W-1 first-gust fairness · R-3 round-piece rest spot |

---

*End of production index. All milestones M0–M6 are fully mapped; the repository can be stood up from this document plus the seven companion deliverables alone.*

***