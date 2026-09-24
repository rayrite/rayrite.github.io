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