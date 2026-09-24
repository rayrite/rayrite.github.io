# Art of Balance Clone — Unity 6.6 Implementation Plan

> **Scope:** Recreate the visuals and the core gameplay loop of Shin'en Multimedia's *Art of Balance* (WiiWare, 2010) from scratch in Unity 6.6, targeting iOS and Android first, with PC as a secondary desktop target.
> **Out of scope for this plan:** monetization, ads/playable-ad build, online multiplayer, analytics, store submission. Those are covered in separate roadmaps.
> **Legal note:** *Art of Balance* is a Shin'en trademark. Recreate the *mechanics and feel*; do not reuse Shin'en's name, logo, level data, models, textures, audio, or UI art. Mechanics are not copyrightable, but expression is.

---

## Table of Contents

1. [Reference Breakdown of the Original](#1-reference-breakdown-of-the-original)
2. [Target Spec & Constraints](#2-target-spec--constraints)
3. [Project Setup (Unity 6.6)](#3-project-setup-unity-66)
4. [Architecture Overview](#4-architecture-overview)
5. [Core Gameplay Loop — Detailed Design](#5-core-gameplay-loop--detailed-design)
6. [Physics Design](#6-physics-design)
7. [Block System](#7-block-system)
8. [Level System & Data Format](#8-level-system--data-format)
9. [Input & Camera](#9-input--camera)
10. [Visuals — Recreating the Look](#10-visuals--recreating-the-look)
11. [Audio](#11-audio)
12. [UI / UX Flow](#12-ui--ux-flow)
13. [Performance Budget & Optimization Strategy](#13-performance-budget--optimization-strategy)
14. [Testing Strategy (Red-Green-Refactor)](#14-testing-strategy-red-green-refactor)
15. [Milestone Roadmap](#15-milestone-roadmap)
16. [Folder Structure](#16-folder-structure)
17. [Risk Register](#17-risk-register)
18. [Appendix A — Key Script Skeletons](#appendix-a--key-script-skeletons)
19. [Appendix B — Tuning Constants Cheat-Sheet](#appendix-b--tuning-constants-cheat-sheet)

---

## 1. Reference Breakdown of the Original

Before writing code, pin down exactly *what* is being recreated. Everything below is from observation of the WiiWare original (and its Wii U / 3DS / Switch successors, which kept the same core).

### 1.1 Core Fantasy

"Zen stacking." Calm, meditative, tactile. The player is never rushed by a timer; tension comes purely from physics. Every failure is the player's fault, and the game never punishes harshly — restart is instant.

### 1.2 The Loop (one level)

| Phase | What happens | Duration |
|---|---|---|
| **Intro** | Camera eases onto the platform; the level's block queue slides in on the side (one block at a time on WiiWare, whole queue visible on later versions). | ~1 s |
| **Pick-up** | Player points at the current block; it lifts and follows the cursor. Ghost-shadow projected onto the stack below shows landing spot. | player-driven |
| **Rotate** | Block can be rotated in 90° steps (buttons) and freely (Wii remote tilt). Rotation is around camera-facing axis. | player-driven |
| **Drop** | Release → block becomes a dynamic rigidbody and falls. | physics |
| **Settle** | Stack wobbles. If any block touches the water → **fail**, level restarts (blocks splash and sink, camera shake). | 0–3 s |
| **Next** | Once the dropped block is at rest, the next block in the queue becomes available. Player is *allowed* to pick up the next block before the stack fully settles, which is a key skill element. | — |
| **Stability check** | When the **last** block is dropped, a stability timer starts (≈3 s). A visible ring/progress indicator fills. If the stack stays intact for the full duration → **level clear**. | 3 s |
| **Clear** | Blocks glow / sparkle, gentle chime, camera does a slow orbit, "Level Complete" panel, score/stars. | ~3 s |

### 1.3 Block Roster (original set)

| Block | Geometry | Behaviour |
|---|---|---|
| Cube | 1×1×1 box | Standard |
| Long plank | 4×0.5×1 box | Standard, main bridging piece |
| Short plank | 2×0.5×1 box | Standard |
| Cylinder (lying) | Capsule/cylinder | Rolls unless cradled |
| Sphere | Sphere | Rolls freely — must be cradled |
| L-shape | Compound box | Off-center COM |
| T-shape | Compound box | Off-center COM |
| Wedge / ramp | Triangular prism | Sloped surfaces make things slide |
| Half-pipe / cradle | Concave arc | Used to hold spheres and cylinders |
| Pyramid | 4-sided | Only stable point-down if wedged |
| **Glass block** | Any of the above, translucent | Cracks and **shatters** when the load on it exceeds a threshold (roughly ≥ 2 blocks' worth of weight resting on it) |
| **Shift block** | Cube/plank, striped | After being placed it is "unstable": its centre of mass slides slowly, or it must have exactly N blocks on top before it locks |
| **Shape-shifter** | Cube with symbol | Changes shape/weight after a delay once placed |
| **Anchor / fixed** | Dark stone | Cannot be moved; starts pre-placed on platform |

### 1.4 Visual Identity

| Element | Description |
|---|---|
| Setting | Floating stone/wood platform in a shallow pool, zen-garden / spa vibe. Bamboo, lanterns, smooth pebbles, water lilies in later worlds. |
| Lighting | Soft, warm key light; strong ambient/sky contribution; long soft shadows. No harsh speculars except on glass and water. |
| Water | The hero visual. Planar reflection of blocks and scenery, gentle ripples, caustics on the pool floor, subtle refraction. Blocks that fall in create splash + expanding ring ripples and sink with bubbles. |
| Materials | Clean, slightly toy-like: satin-finish painted wood, brushed stone, frosted glass. Colour per block family (warm red/orange wood, cool grey stone, pale blue glass). |
| Post FX | Bloom (low), colour grading (warm), vignette (light), depth of field on level-clear orbit only. |
| Camera | Fixed 3/4 perspective, slightly above the stack; slowly *dollies back / cranes up* as the stack grows taller. Very slow idle sway. |
| Motion language | Everything eases (quad/cubic out). No snappy UI. Blocks have a "lifted" bob when carried. |
| UI | Minimal: current block preview + queue, level number, restart, tiny stability ring. Rounded, paper/stone textured panels, serif or humanist sans font. |

---

## 2. Target Spec & Constraints

| Item | Decision |
|---|---|
| Unity version | **Unity 6.6** (6000.6.x LTS-track). If a listed package version differs in your Package Manager, take the latest verified for 6.6. |
| Render pipeline | **URP** (Universal Render Pipeline), Forward+ renderer, mobile quality tier + desktop quality tier |
| Physics | PhysX 3D (`Rigidbody`) — *not* DOTS/Unity Physics for v1 (see §6.6 on why) |
| Scripting | C# 12, `.NET Standard 2.1` profile, IL2CPP on all platforms, **Burst** for hot loops where needed |
| Input | **Input System** package (touch, mouse, gamepad, keyboard) |
| Camera | **Cinemachine 3.x** |
| UI | **UI Toolkit** for menus/HUD, plus a small uGUI world-space canvas if needed for the stability ring (or a shader-driven mesh — preferred) |
| Target frame rate | 60 fps on iPhone 11 / Pixel 5 class; 30 fps floor on 2019 mid-range Android |
| Resolution | Dynamic resolution scaling 0.75–1.0 on mobile |
| Aspect ratios | 16:9 → 21:9 landscape (primary), portrait supported for mobile with a re-framed camera rig |
| Level count (v1) | 40 hand-authored levels across 4 worlds (scale to 100+ later) |
| Save | Local JSON via `Application.persistentDataPath`, cloud save later |

---

## 3. Project Setup (Unity 6.6)

### 3.1 Create project

1. **Unity Hub → New project → 3D (URP) template**, name `ArtOfBalance_Unity6`.
2. Edit → Project Settings → Player:
   - Company / Product name, bundle ID `com.<yourco>.artofbalance`.
   - **Scripting Backend: IL2CPP**, **API Compatibility: .NET Standard 2.1**, **Target Architectures: ARM64** only.
   - **Active Input Handling: Input System Package (New)**.
   - Color Space: **Linear**.
3. Project Settings → Quality: create tiers `Mobile-Low`, `Mobile-High`, `Desktop`. Assign a separate URP Asset to each.
4. Project Settings → Time: `Fixed Timestep = 0.01666667` (60 Hz), `Maximum Allowed Timestep = 0.05`.
5. Project Settings → Physics:
   - `Default Solver Iterations = 12`, `Default Solver Velocity Iterations = 4` (stacking needs it).
   - `Sleep Threshold = 0.002`.
   - `Contact Offset = 0.005`.
   - Enable **Enhanced Determinism** (helps replay/tests).
   - Broadphase: **Multibox Pruning** (few objects; fine).
6. Layer setup: `Block`, `HeldBlock` (no collision with Block), `Platform`, `Water`, `Environment`, `Pickable`.
7. Collision matrix: `HeldBlock` collides with nothing except a raycast query layer.

### 3.2 Packages (Window → Package Manager)

| Package | Purpose |
|---|---|
| `com.unity.render-pipelines.universal` | URP |
| `com.unity.shadergraph` | Water, glass, block shaders |
| `com.unity.inputsystem` | Input |
| `com.unity.cinemachine` (3.x) | Camera rig |
| `com.unity.ui` / UI Toolkit (built-in) | UI |
| `com.unity.addressables` | Level and environment streaming |
| `com.unity.burst` + `com.unity.collections` + `com.unity.mathematics` | Hot paths (ripple sim, stability eval) |
| `com.unity.test-framework` | Edit/Play mode tests |
| `com.unity.timeline` | Level-clear and intro cinematics |
| `com.unity.postprocessing` — **NOT** needed; URP Volume system covers it |
| `com.unity.probuilder` (optional) | Block-out geometry for the platform and prototype shapes |
| `com.unity.splines` (optional) | Bamboo / decoration placement |

### 3.3 Version control

- `git init`, `.gitignore` from Unity template, **Git LFS** for `*.psd *.fbx *.wav *.png *.blend`.
- Enable **Asset Serialization: Force Text**, **Visible Meta Files**.
- Branches: `main` (release), `develop`, `feature/*`. Tag each milestone.

### 3.4 Editor & CI conventions

- `Assets/_Project` as the single root (keeps third-party assets separate).
- Assembly Definitions per module (compile times + enforced decoupling).
- Roslyn analyzers: enable `UNT` Unity analyzers via `Microsoft.Unity.Analyzers`.
- Pre-commit: `dotnet format` style check on `*.cs`.

---

## 4. Architecture Overview

### 4.1 Guiding principles

1. **Event-driven, not polled.** Nothing runs `Update()` unless it animates something every frame. Gameplay state changes flow through a typed event bus.
2. **Physics is the referee, not the simulation of record.** Game logic reads *facts* from PhysX (is this block asleep? did it touch water?) and decides state. It never fights PhysX with manual position corrections.
3. **Data-driven levels and blocks.** A level is a JSON/ScriptableObject describing a platform, pre-placed anchors, and an ordered block queue. Designers never touch prefabs to make levels.
4. **Composition over inheritance.** A block is a prefab with pluggable *behaviour components* (`GlassBehaviour`, `ShiftBehaviour`), not a class hierarchy.
5. **Strict module boundaries** enforced by asmdefs: `Core` ← `Gameplay` ← `Presentation` ← `UI`. Lower layers never reference higher ones.

### 4.2 Module map

```
AoB.Core            (no Unity deps beyond Mathematics)   – state machine, events, level data models, scoring rules
AoB.Gameplay        (Unity, Physics)                     – BlockController, StackManager, StabilityMonitor, LevelRunner
AoB.Presentation    (Unity, URP)                         – BlockVisuals, WaterSystem, CameraRig, VFX, AudioDirector
AoB.UI              (UI Toolkit)                         – HUD, menus, level select
AoB.Data            (ScriptableObjects + JSON)           – BlockDefinition, LevelDefinition, WorldDefinition
AoB.Tests.EditMode / AoB.Tests.PlayMode
```

### 4.3 Runtime object graph (one level)

```
[GameBootstrap]  ── loads → [LevelRunner]
                                  │
       ┌──────────────┬───────────┼─────────────┬──────────────┐
 [BlockQueue]  [StackManager] [StabilityMonitor] [WaterHazard] [CameraRig]
       │              │              │               │
   spawns        tracks live     watches sleep    OnTriggerEnter
   BlockController  blocks       & velocities     → LevelFailed
```

### 4.4 Event bus (Core)

```csharp
public static class GameEvents
{
    public static event Action<LevelDefinition>  LevelLoaded;
    public static event Action<BlockController>  BlockPicked;
    public static event Action<BlockController>  BlockDropped;
    public static event Action<BlockController>  BlockSettled;
    public static event Action<BlockController>  BlockShattered;
    public static event Action<BlockController>  BlockFellInWater;
    public static event Action                   StabilityCountdownStarted;
    public static event Action<float>            StabilityProgress;   // 0..1
    public static event Action<LevelResult>      LevelCleared;
    public static event Action<FailReason>       LevelFailed;
}
```

Presentation, UI and Audio subscribe; Gameplay publishes. No presentation code is referenced from gameplay.

---

## 5. Core Gameplay Loop — Detailed Design

### 5.1 Level state machine

```
        ┌──────────┐
        │  Intro   │  camera fly-in, queue slides in
        └────┬─────┘
             ▼
        ┌──────────┐   pick   ┌──────────┐  release  ┌──────────┐
   ┌───►│  Idle    ├─────────►│ Carrying ├──────────►│ Settling │
   │    └──────────┘          └──────────┘           └────┬─────┘
   │         ▲   ▲                                        │
   │         │   └──────── block at rest & queue > 0 ─────┤
   │         │                                            │
   │         │            queue == 0 & at rest            ▼
   │         │                                    ┌──────────────┐
   │         │                                    │ FinalCheck   │ 3 s ring
   │         │                                    └────┬────┬────┘
   │         │                                 stable  │    │ collapse
   │         │                                         ▼    ▼
   │         │                                  ┌────────┐ ┌────────┐
   │         └──────── restart ─────────────────┤ Failed │ │Cleared │
   │                                            └────────┘ └────────┘
   └──────────── any block touches water ──────────────────────┘
```

Implemented as a plain C# state machine in `AoB.Core` (`LevelStateMachine` with `IState { Enter, Exit, Tick(dt) }`). Only `Carrying`, `Settling`, and `FinalCheck` need ticking; `Idle` is fully event-driven.

### 5.2 Pick-up

- Input raycast on `Pickable` layer. Only the **current** queue block (sitting on the side tray) *and* — as a designer option — the top-most already-placed block within N seconds of placement may be picked (the original allows re-grabbing a just-dropped block for a moment; make this a per-world flag `allowRegrab`).
- On pick: `Rigidbody.isKinematic = true`, layer → `HeldBlock`, lift to *carry height* (`stackTopY + 1.5`), spawn ghost projection.
- Carry follow: `MoveTowards` with critically-damped spring (`SmoothDamp`) to a target computed by projecting the pointer ray onto a horizontal plane at carry height. Clamp XZ to the platform bounds + margin.
- **Carry height adaptation:** carry plane = `max(stackTopUnderCursor, platformY) + carryOffset`. Sample the stack height under the cursor with a downward `BoxCast` of the block's footprint so the block glides *over* the stack, never through it.

### 5.3 Rotation

- Discrete: 90° around camera-forward (Z) and around world-up (Y). Two inputs (`RotateCW`, `RotateCCW`, `RotateYaw`).
- Continuous (optional, gyro/right stick): small ±15° fine rotation around Z, applied on top of the discrete quaternion.
- Rotation is applied to a target quaternion; visuals `Slerp` at `rotationSpeed = 720°/s`. On drop, the physical body gets the *target* rotation, not the interpolated one (so the player's intent is honored).

### 5.4 Ghost projection

- A translucent copy of the block mesh (same rotation) placed at the resting height where a `BoxCast`/`Physics.ComputePenetration` sweep says it would first contact. This is the WiiWare "shadow." Colour: soft white 30 % alpha, no shadows, renders after opaque.
- Also draw a **contact footprint decal** on the surface below (URP Decal Projector) — cheap and hugely helpful on mobile.

### 5.5 Drop

- Layer → `Block`, `isKinematic = false`, inherit *no* velocity (WiiWare drop is a clean release) except an optional tiny downward `0.5 m/s` to avoid the "floating" frame.
- Publish `BlockDropped`. Enter `Settling`.

### 5.6 Settling & "at rest"

Do **not** rely solely on `Rigidbody.IsSleeping()` (sleep is slow and platform-dependent). Use a `StabilityMonitor`:

```
restVelocity   = 0.05 m/s
restAngVel     = 0.10 rad/s
restDuration   = 0.35 s   (consecutive fixed steps under both thresholds)
```

A block is *settled* when it satisfies thresholds for `restDuration`. The *stack* is settled when **all** live blocks are settled. Runs in `FixedUpdate` over a small array — trivial cost.

Meanwhile:
- If queue is non-empty, `Idle` is re-entered as soon as **the dropped block** is settled (not the whole stack) → next block becomes pickable. This matches the original's rhythm.
- If `allowEarlyPickup` (world flag), the next block becomes pickable *immediately* after drop — this is how the original lets skilled players play fast.

### 5.7 Final stability check

When queue is empty **and** the last block has been dropped:

1. Wait until the whole stack is settled (up to `maxSettleWait = 4 s`; if not settled by then, the stack is wobbling — fail with `FailReason.Unstable`).
2. Start **3.0 s countdown**. Publish `StabilityProgress` every frame for the ring.
3. During countdown, any block leaving rest thresholds **pauses** the ring (original behaviour: ring holds, doesn't reset) — resume when quiet again. If total countdown wall time exceeds `8 s`, fail.
4. Countdown completes → `LevelCleared` with `LevelResult { timeTaken, blocksUsed, restarts, stars }`.

### 5.8 Failure

`WaterHazard` trigger (a box volume just below water surface) → `BlockFellInWater(block)` → state `Failed`:
- Freeze input, let physics run 1.2 s so the collapse plays out (this is *satisfying* and is part of the original feel).
- Blocks in water: switch to `WaterSubmerged` behaviour — buoyancy off, drag `3`, angular drag `2`, sink; spawn splash VFX + ring ripple at entry point; camera micro-shake 0.15 s.
- Fade to grey vignette, "Try again" button and auto-restart after 2 s if `autoRestart` is on.

### 5.9 Restart

Instant: despawn all dynamic blocks to pool, re-place anchors from the level definition, rebuild queue, re-enter `Intro` with the *short* intro variant (0.4 s). No scene reload.

### 5.10 Scoring (light-touch, like the original)

- Clear = 1 star. Clear with 0 restarts = 2 stars. Clear under par time = 3 stars (par authored per level).
- World unlock: N stars in previous world.

---

## 6. Physics Design

This is where the game lives or dies. The original *feels* forgiving but honest.

### 6.1 Units & scale

- 1 Unity unit = 1 m. Base cube = **0.5 m** edge. Platform ≈ 3 m × 3 m. This keeps PhysX in its comfort zone (avoid tiny colliders < 0.05 m).
- Gravity: `-9.81`, but tune `Physics.gravity` per world if a "moon" world is desired later.

### 6.2 Rigidbody settings per block

| Property | Value | Why |
|---|---|---|
| Mass | density × volume; base density `1.0` (wood), `2.2` (stone), `0.8` (glass) | consistent stacking behaviour |
| Drag | `0.05` | almost none in air |
| Angular drag | `0.5` | damps wobble slightly — the original is slightly "sticky" |
| Interpolation | `Interpolate` | smooth visuals at 60 Hz fixed step |
| Collision detection | `Continuous Dynamic` for spheres/cylinders, `Discrete` for boxes | prevents tunnelling of round bodies |
| Max angular velocity | `20` | |
| Solver iterations override | `16 / 6` on tall stacks (auto-raised by `StackManager` when live count > 8) | stability for tall towers |

### 6.3 Colliders

- Boxes: single `BoxCollider`, **shrunk by 0.5 %** relative to the visual mesh to hide contact-offset gaps.
- L/T shapes: compound of 2–3 `BoxCollider`s (never mesh colliders).
- Sphere/cylinder: primitive `SphereCollider`/`CapsuleCollider` (capsule with box end caps if you need a true flat cylinder: use 1 capsule + 2 thin boxes, or approximate with a convex `MeshCollider` at 24 segments — measure both).
- Wedge/half-pipe: **convex `MeshCollider`**, ≤ 64 verts, `Cooking Options: Everything`.
- Physic materials: `Wood (friction 0.6/0.6, bounce 0.05, Friction Combine = Average)`, `Stone (0.7, bounce 0.0)`, `Glass (0.35, bounce 0.1)`, `Platform (0.8)`.

### 6.4 The "forgiveness" tuning

The original feels slightly more forgiving than raw PhysX. Achieve that with **additive stabilisation**, not by overriding physics:

1. **Contact-settle damping:** when a block's speed drops below `0.3 m/s` *and* it has ≥ 1 contact, apply extra angular drag (`2.0`) for that fixed step. Blocks "want" to come to rest.
2. **Micro-snap on drop (optional, per world):** if at drop time the block's yaw is within ±6° of a 90° multiple, snap the yaw. This removes tiny accidental tilt from analogue input and mirrors the original's "it just sits" feel.
3. **Sleep hint:** after `restDuration`, call `rb.Sleep()` explicitly so fully settled towers cost nothing.

Never: teleport positions, zero velocities while in contact, or freeze rotation. Those produce visible pops.

### 6.5 Glass shatter detection

Each `GlassBehaviour` accumulates *normal impulse* from `OnCollisionStay` contacts that come from **above** (`contact.normal.y < -0.5` in the glass block's frame) over a 0.25 s window. Convert to an equivalent static load: `load = Σ impulse / (window × g)`. Threshold `shatterLoadKg = 2.2 × baseCubeMass`. Add a *crack stage* at 60 % (swap material to cracked variant, play tick sound) and shatter at 100 %: disable colliders, spawn 8–12 pooled shard rigidbodies with the parent's velocity + small radial impulse, fade after 1.5 s, publish `BlockShattered`. Blocks that were resting on it will now fall — that's the intended punishment.

### 6.6 Why not DOTS / Unity Physics in v1

Unity Physics is stateless and deterministic but its stacking stability with ≤ 20 bodies is no better than PhysX, and it costs a full ECS presentation layer. The whole scene has < 30 rigidbodies; PhysX on one thread is < 0.3 ms. Revisit DOTS only if a "100-block sandbox mode" is added.

---

## 7. Block System

### 7.1 `BlockDefinition` (ScriptableObject)

```csharp
[CreateAssetMenu(menuName = "AoB/Block Definition")]
public sealed class BlockDefinition : ScriptableObject
{
    public string   id;                 // "plank_long"
    public Mesh     mesh;
    public Material material;           // base; family tint applied via MaterialPropertyBlock
    public ColliderRecipe colliders;    // list of primitive definitions or convex mesh ref
    public MaterialFamily family;       // Wood, Stone, Glass
    public float    density = 1f;
    public Vector3  comOffset;          // for authored off-center COM (shift blocks)
    public BlockBehaviourDefinition[] behaviours;   // Glass, Shift, ShapeShift, Anchor
    public Vector3  trayScale = Vector3.one * 0.6f; // preview size in queue
}
```

### 7.2 `BlockController` (MonoBehaviour, pooled)

Owns: `Rigidbody`, colliders, `BlockVisuals` reference, `BlockState { InTray, Held, Falling, Resting, Submerged, Shattered }`, list of `IBlockBehaviour`.

`IBlockBehaviour { void OnAttached(BlockController); void OnDropped(); void OnRestChanged(bool); void OnContact(Collision); void OnDetached(); }`

Behaviours are plain C# classes instantiated from their definitions — no extra MonoBehaviours per block.

### 7.3 Pooling

`BlockPool` keyed by `BlockDefinition.id`. Pre-warm per level from the queue. Shards, splash particles, and ripple decals are pooled too. Zero runtime `Instantiate` after level start.

### 7.4 Block families (visual)

| Family | Albedo | Smoothness | Extra |
|---|---|---|---|
| Wood | warm tints (terracotta, ochre, cream) with subtle grain normal map | 0.35 | edge-wear mask |
| Stone | cool greys, faint speckle | 0.25 | darker AO in crevices |
| Glass | pale cyan, alpha 0.35 | 0.95 | refraction + fresnel rim, crack overlay stage |

All block families use **one Shader Graph** (`BlockLit`) with a `_Tint`, `_Family` keyword, and `_CrackAmount` — driven per instance via `MaterialPropertyBlock` / SRP Batcher-compatible properties.

---

## 8. Level System & Data Format

### 8.1 `LevelDefinition` (JSON, imported to ScriptableObject at build time)

```json
{
  "id": "w1_l07",
  "world": 1,
  "index": 7,
  "parTimeSec": 40,
  "platform": { "prefab": "platform_stone_square", "size": [3, 3], "yawDeg": 0 },
  "anchors": [
    { "block": "cube", "pos": [0, 0.25, 0], "rotEuler": [0, 0, 0] }
  ],
  "queue": [ "plank_long", "cube", "cube", "sphere", "halfpipe", "glass_cube" ],
  "flags": { "allowEarlyPickup": true, "allowRegrab": false, "microSnap": true },
  "camera": { "preset": "default", "startHeight": 1.5 }
}
```

### 8.2 Level authoring tooling (Editor)

- **Level Editor window** (UI Toolkit, `EditorWindow`): drag blocks from a palette into the queue, place anchors in Scene view with handles, hit **Play-test** to run the level in the editor without changing scenes.
- **Solvability check** button: runs the level in a headless physics scene (`Physics.Simulate` on a separate `PhysicsScene`) with an authored "intended solution" placement list to verify it still stands after 3 s. Guards against physics tuning regressions breaking old levels.
- **Batch validation** menu item: every level JSON → schema validate → solvability check → report. Also wired into CI.

### 8.3 Progression data

`WorldDefinition { id, name, environmentAddress, levels[], starsToUnlock, musicTrack }`. Worlds are Addressables groups so the environment art for world 4 isn't in memory during world 1.

---

## 9. Input & Camera

### 9.1 Input actions (Input System asset `AoB.inputactions`)

| Action | Touch | Mouse/KB | Gamepad |
|---|---|---|---|
| `Point` | primary touch position | mouse position | virtual cursor (left stick, 900 px/s) |
| `Grab` | touch press | LMB | South button |
| `RotateCW / CCW` | two-finger twist ≥ 25° **or** on-screen buttons | Q / E, scroll | RB / LB |
| `RotateYaw` | double-tap on held block | R | RT |
| `FineRotate` | two-finger twist (continuous) | — | right stick X |
| `Restart` | HUD button | R (hold) | Select |
| `Pause` | HUD button | Esc | Start |

Touch UX detail: on mobile, the held block is offset **above** the finger by ~1.2 block heights so the thumb doesn't occlude the landing spot. This is the single most important mobile adaptation.

### 9.2 Camera rig (Cinemachine 3)

- `CinemachineCamera` **Gameplay**: `Position Composer` framing a virtual **`StackFocus`** target. `StackFocus` = lerp of (platform centre, stack bounding-box centre) with `stackHeight`-driven dolly: `distance = baseDist + stackHeight × 0.6`, `pitch = 28° → 20°` as height grows. Damping 1.5 s. This reproduces the original's slow crane-out.
- **Idle sway**: `CinemachineBasicMultiChannelPerlin`, amplitude 0.02, frequency 0.1.
- **Fail shake**: impulse source, 0.15 s.
- **Clear orbit**: `CinemachineCamera` **Victory** with `Orbital Follow`, blended in over 1.2 s; slow 360° over 6 s with shallow DOF.
- Portrait rig: same target, FOV 45 → 60, higher pitch; chosen at runtime by `Screen.orientation`.

---

## 10. Visuals — Recreating the Look

### 10.1 Rendering setup

- URP Asset (mobile): HDR **on** (needed for bloom on glass/water), MSAA 4× on iOS/high-end Android, 2× fallback, **Render Scale** dynamic. Depth texture **on**, Opaque texture **on** (water refraction), shadows: 1 cascade, 25 m distance, soft.
- Forward+ renderer with **Decal** renderer feature (footprint, ripple rings), **SSAO** off on mobile (bake AO), on for desktop.
- Lighting: one directional key (warm, 5600 K-ish, intensity 1.4, shadow strength 0.8), skybox-driven ambient from an authored gradient/HDR, **baked GI** for the static environment (Adaptive Probe Volumes for the blocks so they pick up bounce from the platform/water — APV is a big Unity 6 win here).
- Reflection: one **baked reflection probe** per environment + the water's own planar reflection.

### 10.2 Water — the hero

Two options; ship A, keep B for desktop:

**A. Mobile-friendly (default):**
- Shader Graph `WaterZen` on a subdivided plane (32×32).
- Colour: depth-based gradient (shallow turquoise → deeper teal) using scene depth difference.
- **Reflection**: sample the baked reflection probe + **screen-space reflection approximation** (sample opaque texture with a vertically flipped, normal-perturbed UV). It fakes block reflections convincingly at 3/4 view angles.
- Refraction: opaque texture offset by normal × `0.02`.
- Normals: two scrolling normal maps at different scales, very slow (`0.01`, `0.017` uv/s).
- Foam/edge: soft white where depth difference < 0.05 m (shoreline against platform pillars).
- Caustics: a scrolling caustic texture projected onto the pool floor via a Decal Projector, modulated by the water normal.
- Specular: high smoothness, but clamp the sun highlight so it's a soft glint not a hot spot.

**B. Desktop:** a real **planar reflection** camera (renders to a half-res RT, layer-masked to Blocks + Environment, no post) blended in. Toggle by quality tier.

**Dynamic ripples (both tiers):**
- A 256×256 `RenderTexture` height-field ripple sim (`ping-pong` two RTs, Burst-free — it's a tiny fullscreen blit with a 5-tap Laplacian), sampled by the water shader as an additive normal. Injection points: block splashes (big), block resting on platform (none — platform is above water), ambient rain-drops in certain worlds (tiny, random).
- On fail, spawn a ring decal (`RippleRing` Shader Graph, expanding radius + fading alpha) at each entry point as a cheap fallback if the RT sim is disabled.

**Splash VFX:** small Particle System (Shuriken is fine): 20–30 droplets, gravity, soft sprite; plus a vertical "crown" mesh that scales up and fades (0.4 s). Sink: block gets `Submerged` behaviour, a bubble emitter, and after 2 s is despawned with a shrink.

### 10.3 Block shading

`BlockLit` Shader Graph (URP Lit-based):
- Inputs: `_BaseMap`, `_NormalMap`, `_Tint`, `_Smoothness`, `_EdgeWearMask`, `_CrackMap`, `_CrackAmount`, `_HeldGlow`.
- Glass variant (keyword): transparent, `Surface Type = Transparent`, `Render Face = Both`, fresnel rim, refraction via opaque texture, `_CrackAmount` drives a crack normal + darken.
- **Held highlight**: a subtle emissive rim (`_HeldGlow = 0.35`) while held, lerped over 0.15 s — replaces the original's outline and reads well on mobile.
- **Ghost variant**: separate simple unlit transparent material, render queue 3000, ZTest LEqual, no shadows.

### 10.4 Environment art plan (per world)

| World | Theme | Key dressing |
|---|---|---|
| 1 | Morning Garden | Stone platform, bamboo, pebbles, koi (2 animated meshes on splines), soft fog |
| 2 | Twilight Spa | Wooden deck platform, paper lanterns (emissive + bloom), warm orange sky gradient |
| 3 | Night Pond | Dark blue water, floating lily pads, fireflies (particle), moon reflection |
| 4 | Misty Temple | Stone pillars, incense smoke, cooler palette, light rain (ambient ripples on) |

Each environment is one prefab + one light bake + one reflection probe, loaded via Addressables. Poly budget ≤ 60 k tris static, ≤ 12 draw calls after SRP batching.

### 10.5 Post-processing (URP Volume)

| Effect | Gameplay | Victory |
|---|---|---|
| Bloom | intensity 0.35, threshold 1.1 | 0.6 |
| Color Adjustments | +0.05 saturation, warm tint (LUT authored) | same |
| Vignette | 0.18 | 0.25 |
| Depth of Field | off | Bokeh, focus on stack centre |
| Tonemapping | ACES | ACES |
| Film grain | off (mobile) | off |

### 10.6 Animation & feel checklist

- Tray → hand: block scales from 0.6 → 1.0 over 0.2 s (ease-out back).
- Carry bob: `y += sin(t × 2.5) × 0.02`.
- Drop: no anticipation; the release *is* the beat.
- Rest: tiny "contact dust" puff (3 particles) when a block first rests on another.
- Ring: thin torus mesh with radial-fill shader, world-space above the stack, colour shifts pale → gold as it completes.
- Clear: blocks receive a wave of `_HeldGlow` from bottom to top (0.6 s), gold sparkle particles, chime, then orbit.
- Fail: 0.15 s time-scale dip to 0.7 (subtle slow-mo) during the collapse, then normal.

---

## 11. Audio

- **Music:** loopable ambient per world (koto/piano pads), 2 layers: base + "tension" layer whose volume = `1 − stackStability` (computed from summed angular velocity, smoothed). Crossfade on world change.
- **SFX (all pooled `AudioSource`s, `AudioMixer` groups: Music / SFX / UI):**
  - pick-up (soft whoosh), rotate (wooden click), place (material-dependent thud: wood/stone/glass, pitch randomised ±5 %), wobble creak (looping, volume tied to block angular velocity above threshold), glass crack tick, glass shatter, splash + bubbles, ring tick per second, clear chime, fail low tone.
- **Spatialisation:** 2D except splash/thud which are 3D with small spread — cheap positional cue for where the stack is failing.

---

## 12. UI / UX Flow

```
Splash → Title (Play / Worlds / Settings)
          └→ World Select (cards, stars) → Level Grid → Level
                                                 ├→ Pause (Resume / Restart / Quit)
                                                 ├→ Cleared (Stars / Next / Replay / Levels)
                                                 └→ Failed (Retry auto / Levels)
```

- UI Toolkit, one `UIDocument` per screen, shared USS theme (`paper` panels, stone-coloured buttons, warm accent `#D98C4A`).
- HUD: top-left level id, top-right pause; bottom-left **queue tray** (rendered as live 3D objects on a side pedestal, not UI — the original shows real blocks); block-count `n / N` under it; rotate buttons bottom-right on touch only.
- Safe-area aware (`Screen.safeArea`).
- Accessibility: colour-blind-safe family tints (verified with a deuteranopia sim), optional high-contrast ghost, haptics toggle, left-handed layout mirror.

---

## 13. Performance Budget & Optimization Strategy

### 13.1 Frame budget (mobile @ 60 fps = 16.6 ms)

| Slice | Budget |
|---|---|
| Physics (FixedUpdate, ≤ 30 bodies) | 0.5 ms |
| Game logic + events | 0.2 ms |
| Water ripple sim blit | 0.3 ms GPU |
| Opaque + shadows | 5 ms GPU |
| Water + transparents (glass, ghost) | 2.5 ms GPU |
| Post (bloom, grading, vignette) | 1.5 ms GPU |
| UI | 0.3 ms |
| **Headroom** | ~6 ms |

### 13.2 Rules baked into the codebase

1. No `Update()` in gameplay classes except `CarryController` (while carrying) and `StabilityRing` (while counting). Enforce with a unit test that reflects over `AoB.Gameplay` and asserts `Update` is only declared on an allow-list.
2. No `Find`, `GetComponent` in hot paths; cache in `Awake`.
3. No allocations per frame (verify with Profiler `GC.Alloc` = 0 in Play mode test).
4. SRP Batcher compatible materials only; `MaterialPropertyBlock` → replaced by per-material properties + shared materials where instancing is needed.
5. All spawned objects pooled.
6. Physics: sleeping towers cost nothing; `StackManager` calls `Sleep()` on settled blocks and raises solver iterations only for tall stacks.
7. Textures: ASTC 6×6 (iOS/Android), 1024 max for blocks, 2048 for environment atlas, mipmaps on.
8. Meshes: read/write off, optimise on import, static batching for environment.
9. Shadows: only blocks + platform cast; environment receives only.
10. Profile on device every milestone with the Profiler + Frame Debugger + **Memory Profiler**; record baseline JSON in `Docs/perf/`.

---

## 14. Testing Strategy (Red-Green-Refactor)

### 14.1 Edit-mode tests (`AoB.Core`, pure C#)

- `LevelStateMachineTests`: every transition in §5.1 table; illegal transitions throw.
- `StabilityEvaluatorTests`: given synthetic velocity streams, asserts settled/unsettled timing to the fixed step.
- `LevelDefinitionSchemaTests`: all JSON in `Levels/` validate; queue ids resolve to `BlockDefinition`s.
- `ScoringTests`: stars logic.

### 14.2 Play-mode tests (`AoB.Gameplay`)

- Load `TestLevel_Cube3`, script drops via `IInputSource` fake → expect `LevelCleared` within 6 s simulated (`Time.timeScale = 10`, `Physics.Simulate` loop for determinism).
- Drop a block off-platform → expect `LevelFailed(FellInWater)` and pool return.
- Glass: drop 3 cubes on a glass cube → expect `BlockShattered`.
- Zero-alloc test: run one full level, assert `Profiler.GetTotalAllocatedMemoryLong` delta < 64 KB after warm-up.
- Level regression: for every shipped level, replay the authored solution; assert clear. Run in CI (batch mode, `-runTests -testPlatform PlayMode`).

### 14.3 Manual QA checklist (per milestone)

Device matrix (iPhone SE 2, iPhone 14, Pixel 5, Galaxy A34), orientation both, safe-area, thermal soak 20 min, background/foreground resume mid-carry, low-battery mode frame pacing.

---

## 15. Milestone Roadmap

Estimates are for one experienced solo developer; art is "programmer-art-plus" using purchased/CC0 textures and hand-modelled blocks in Blender.

| # | Milestone | Deliverable | Est. |
|---|---|---|---|
| **M0** | Project & pipeline | §3 done, asmdefs, CI running empty tests, Git LFS | 2 days |
| **M1** | Grey-box loop | Cube/plank only, platform, water trigger, pick/rotate/drop, settle, 3 s check, fail/restart, keyboard+mouse. **Playable.** | 1 week |
| **M2** | Block roster & physics tuning | All §1.3 standard shapes, physic materials, forgiveness tuning, ghost projection, footprint decal, pooling. 10 test levels. | 1.5 weeks |
| **M3** | Level system | JSON format, importer, Level Editor window, solvability checker, progression/save, 20 levels | 1.5 weeks |
| **M4** | Touch & camera | Input System bindings, mobile finger offset, Cinemachine rig (gameplay/victory/portrait), first on-device build | 1 week |
| **M5** | Visual pass 1 | URP tiers, `BlockLit` shader, water A, splash/ripples, lighting + APV bake, World 1 environment, post volume | 2 weeks |
| **M6** | Special blocks | Glass (crack/shatter), Shift, Shape-shifter, Anchor; 10 levels using them | 1 week |
| **M7** | UI & audio | UI Toolkit screens, HUD, tray pedestal, full SFX set, 2-layer music | 1.5 weeks |
| **M8** | Content | Worlds 2–4 environments, 40 levels total, par times, stars | 2 weeks |
| **M9** | Polish & perf | Feel checklist §10.6, perf budget §13 met on target devices, accessibility, save robustness | 1.5 weeks |
| **M10** | Release candidate | Store assets pipeline hook-in (separate roadmap), crash-free soak, tag `v1.0.0` | 1 week |
| | **Total** | | **~15 weeks** |

Suggested order of *firsts*: get M1 into your own hands within the first week and play it daily. If the grey-box isn't fun with cubes and planks, no amount of water shader fixes it.

---

## 16. Folder Structure

```
Assets/
└── _Project/
    ├── Art/
    │   ├── Blocks/        (FBX + textures per block, 1 prefab per BlockDefinition)
    │   ├── Environments/  (World1..4 prefabs, light bakes, probes)
    │   ├── Shaders/       (BlockLit.shadergraph, WaterZen.shadergraph, RippleRing, Ghost)
    │   ├── VFX/           (Splash, Dust, Shards, Sparkle)
    │   └── UI/            (USS, sprites, fonts)
    ├── Audio/             (Music/, SFX/, Mixer.mixer)
    ├── Data/
    │   ├── Blocks/        (BlockDefinition .asset)
    │   ├── Levels/        (JSON source of truth, generated .asset in Levels/Generated)
    │   └── Worlds/
    ├── Input/             (AoB.inputactions)
    ├── Scenes/            (Boot, Menu, Game, Test_*)
    ├── Scripts/
    │   ├── Core/          (AoB.Core.asmdef)
    │   ├── Gameplay/      (AoB.Gameplay.asmdef)
    │   ├── Presentation/  (AoB.Presentation.asmdef)
    │   ├── UI/            (AoB.UI.asmdef)
    │   ├── Data/          (AoB.Data.asmdef)
    │   └── Editor/        (AoB.Editor.asmdef — Level Editor, validators)
    ├── Settings/          (URP assets ×3, Volume profiles, Quality)
    └── Tests/             (EditMode/, PlayMode/)
Docs/
    ├── perf/              (baseline profiler captures)
    └── design/            (this plan, level design notes)
```

---

## 17. Risk Register

| Risk | Impact | Mitigation |
|---|---|---|
| PhysX jitter on tall stacks | Core feel | Solver iteration escalation, shrunken colliders, 60 Hz fixed step, explicit sleep; validate with M2 stress level (15 cubes) |
| Physics non-determinism breaks level regression tests | CI noise | Enhanced Determinism on, `Physics.Simulate` with fixed dt, tolerance windows on assertions |
| Water shader too heavy on low-end Android | 30 fps floor | Quality tier drops ripple RT to 128², disables refraction, keeps depth gradient + probe reflection |
| Touch occlusion makes precise placement hard | Retention | Finger offset, footprint decal, ghost; test with real users at M4 |
| Glass shatter threshold feels arbitrary | Fairness | Visible crack stage at 60 %, consistent load metric, level design introduces glass gently |
| Unity 6.6 package churn (Cinemachine 3 API, UI Toolkit runtime) | Rework | Lock package versions in `manifest.json`; upgrade only at milestone boundaries |
| Scope creep into multiplayer/endless before v1 ships | Ship date | Hard v1 scope = this document; backlog everything else |

---

## Appendix A — Key Script Skeletons

### A.1 `StabilityMonitor` (Gameplay)

```csharp
public sealed class StabilityMonitor : MonoBehaviour
{
    [SerializeField] float restVelocity = 0.05f, restAngVel = 0.10f, restDuration = 0.35f;
    readonly List<BlockController> _live = new(32);
    readonly Dictionary<BlockController, float> _quietTime = new(32);

    public bool AllSettled { get; private set; }

    public void Track(BlockController b)   { _live.Add(b); _quietTime[b] = 0f; }
    public void Untrack(BlockController b) { _live.Remove(b); _quietTime.Remove(b); }

    void FixedUpdate()
    {
        if (_live.Count == 0) { AllSettled = true; return; }
        bool all = true;
        float dt = Time.fixedDeltaTime;
        for (int i = 0; i < _live.Count; i++)
        {
            var b  = _live[i];
            var rb = b.Body;
            bool quiet = rb.linearVelocity.sqrMagnitude  < restVelocity * restVelocity
                      && rb.angularVelocity.sqrMagnitude < restAngVel   * restAngVel;
            float t = quiet ? _quietTime[b] + dt : 0f;
            _quietTime[b] = t;
            bool settled = t >= restDuration;
            if (settled != b.IsSettled) b.SetSettled(settled);   // publishes BlockSettled
            all &= settled;
        }
        AllSettled = all;
    }
}
```

### A.2 `LevelRunner` state hooks (Gameplay)

```csharp
public sealed class LevelRunner : MonoBehaviour
{
    [SerializeField] BlockQueue queue;
    [SerializeField] StabilityMonitor stability;
    [SerializeField] float finalCheckSeconds = 3f, maxSettleWait = 4f, maxCheckWall = 8f;

    LevelStateMachine _fsm;

    void OnEnable()
    {
        GameEvents.BlockDropped     += OnBlockDropped;
        GameEvents.BlockSettled     += OnBlockSettled;
        GameEvents.BlockFellInWater += _ => _fsm.Fail(FailReason.FellInWater);
    }

    void OnBlockDropped(BlockController b)
    {
        stability.Track(b);
        if (queue.IsEmpty) _fsm.To<FinalCheckState>();
        else if (Level.Flags.allowEarlyPickup) queue.ExposeNext();
        else _fsm.To<SettlingState>();
    }

    void OnBlockSettled(BlockController b)
    {
        if (_fsm.Is<SettlingState>() && b == queue.LastDropped) { queue.ExposeNext(); _fsm.To<IdleState>(); }
    }
}
```

### A.3 `FinalCheckState` (Core, ticked by runner)

```csharp
public sealed class FinalCheckState : IState
{
    float _progress, _wall;
    public void Enter() { _progress = 0; _wall = 0; GameEvents.RaiseCountdownStarted(); }
    public void Tick(float dt, bool allSettled, float finalSeconds, float maxWall)
    {
        _wall += dt;
        if (allSettled) _progress += dt / finalSeconds;      // pauses (does not reset) while wobbling
        GameEvents.RaiseStabilityProgress(Mathf.Clamp01(_progress));
        if (_progress >= 1f)      Machine.Clear();
        else if (_wall > maxWall) Machine.Fail(FailReason.Unstable);
    }
    public void Exit() {}
}
```

### A.4 `GlassBehaviour` (Gameplay, plain class)

```csharp
public sealed class GlassBehaviour : IBlockBehaviour
{
    readonly float _shatterLoadKg, _window = 0.25f;
    float _impulseAccum, _windowT; BlockController _b;

    public void OnContact(Collision c)
    {
        var up = _b.transform.up;
        for (int i = 0; i < c.contactCount; i++)
            if (Vector3.Dot(c.GetContact(i).normal, up) < -0.5f) { _impulseAccum += c.impulse.magnitude; break; }
    }
    public void FixedTick(float dt)
    {
        _windowT += dt;
        if (_windowT < _window) return;
        float loadKg = _impulseAccum / (_window * 9.81f);
        _impulseAccum = 0; _windowT = 0;
        float f = loadKg / _shatterLoadKg;
        _b.Visuals.SetCrack(Mathf.Clamp01((f - 0.6f) / 0.4f));
        if (f >= 1f) _b.Shatter();
    }
}
```

---

## Appendix B — Tuning Constants Cheat-Sheet

| Constant | Start value | Notes |
|---|---|---|
| Base cube edge | 0.5 m | |
| Fixed timestep | 1/60 s | |
| Solver iterations (pos / vel) | 12 / 4 → 16 / 6 when > 8 live blocks | |
| Rest velocity / angular | 0.05 m/s / 0.10 rad/s | |
| Rest duration | 0.35 s | |
| Final check | 3.0 s | pause-not-reset on wobble |
| Max settle wait / max check wall | 4 s / 8 s | |
| Carry height offset | 0.75 m above stack top under cursor | |
| Carry smoothing | `SmoothDamp` time 0.08 s | |
| Rotation slerp speed | 720°/s | |
| Micro-snap yaw tolerance | ±6° | per-world flag |
| Contact-settle extra angular drag | 2.0 below 0.3 m/s | |
| Glass shatter load | 2.2 × base cube mass | crack visible at 60 % |
| Wood / Stone / Glass friction | 0.6 / 0.7 / 0.35 | |
| Water drag / angular drag | 3.0 / 2.0 | |
| Fail collapse time before UI | 1.2 s | time-scale dip 0.7 for 0.15 s |
| Camera dolly | `baseDist + stackHeight × 0.6` | pitch 28° → 20° |
| Ripple RT | 256² (128² low tier) | |
| Bloom intensity / threshold | 0.35 / 1.1 | |

---

*End of plan. Suggested next artefacts: (1) M1 grey-box task checklist with acceptance tests, (2) Level Editor window spec, (3) water shader graph node-by-node build guide.*
