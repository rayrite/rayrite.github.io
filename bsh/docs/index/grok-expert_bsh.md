# Art of Balance (WiiWare) — Unity 6.6 Implementation Plan

**Document type:** Implementation plan  
**Target engine:** Unity 6.6 (6000.6)  
**Focus:** Recreate the original WiiWare visuals and main gameplay loop  
**Scope date:** 2026-09-23  
**Status:** Design / pre-production plan (not a ship-ready GDD)

This plan describes how to rebuild the *feeling* of Shin'en Multimedia's 2010 WiiWare title *art of balance*: a quiet lounge, a stone basin of water, chunky wooden shapes, pointer-driven placement, honest rigid-body physics, and a three-second hold after the last piece drops. It is an original implementation inspired by publicly documented mechanics and presentation. Do not copy Shin'en meshes, textures, audio, level layouts, or branding.

---

## 1. Product definition

### 1.1 What we are cloning

Original WiiWare product (NA 2010-02-15 / EU 2010-03-26):

- Physics puzzle: stack a fixed set of shapes on a pedestal inside a water basin.
- Rotation in **45° snaps**.
- Fail if any piece touches water (or leaves the play volume).
- After the last piece is placed, a **3-second stability countdown** starts. If the stack has not collapsed into the water by the end of the count, the level is cleared — even if the tower is still slowly listing.
- 100 arcade levels across **4 lounge-themed worlds**.
- **14 standard shapes + 2 special shapes** (load-limit / timer glass).
- Challenge variants: Balance (unstable / floating base), Height, Time.
- Drop-in 2P co-op on the same basin; split-screen versus.
- 60 fps, 4:3 and 16:9, pointer-first controls.

Later ports (3DS / Wii U / Switch / PS4) added worlds E–H (scale bases, gravity invert, fire blocks), 200 levels, Endurance, Tower Tumble. Those are **explicitly out of v1 scope** and listed as Phase 6 expansions so the first playable matches the WiiWare loop.

### 1.2 Success criteria for “it feels like Art of Balance”

1. A single piece can be selected, rotated in 45° increments, moved with a pointer, and released into live physics with no tweened “snap to grid.”
2. Wood-on-stone contact is stable enough that a well-centered stack sleeps; a slightly off-center stack creeps, then fails — results are repeatable.
3. Water is the fail plane *and* the visual star: ripples, reflections, and a satisfying splash when a piece dies.
4. The room is warm, slightly imperfect, and meditative. Lighting, props, and music do more emotional work than UI chrome.
5. After the last drop, three sequential lights / chimes tick. Clearing on a dying tower that has not yet hit water is a legal win.
6. Retry is instant. The player is never punished with a long reload.

### 1.3 What this plan will not cover in depth

Online leaderboards, live service, monetization, full accessibility certification, console submission, and legal review of a commercial release. Audio is specified at a systems level only (the original score is copyrighted).

---

## 2. Reference analysis of the original

### 2.1 Spatial layout

The playable scene is a **shallow 3D diorama**, not a 2D side-scroller and not a free-orbit sandbox.

```
[ far lounge wall / window / plants ]
[ table / floor plane                    ]
[ stone/ceramic basin filled with water  ]
[ pedestal / plinth rising from water    ]
[ stack built on the plinth              ]
[ tray of upcoming pieces, screen-right  ]
[ camera: slightly elevated 3/4, locked  ]
```

- Camera is **authored per-level or per-world**, not player-orbited. Original Wii zoomed slightly toward the drop point for precision.
- Pieces live as 3D rigid bodies with real thickness. Placement is free in XZ over the basin and Y is gravity. Rotation is constrained to one axis (the camera-facing axis) in 45° steps, which is why reviewers compared it to Tetris pieces in 3D.
- The basin rim and water surface are kill volumes. Falling *outside* the tub also fails.

### 2.2 The main loop (state machine)

```
IdleTray
  → HoverPiece (pointer over tray piece)
    → Grab (kinematic, follow pointer, 45° rotate)
      → DragOverBasin (ghost / live preview, no collision with tray)
        → Release
          → LivePhysics
            → if piece ∩ water  → Fail → ResetLevel
            → if piecesRemain   → IdleTray
            → else              → HoldCountdown (3.0 s)
                                    → if any piece ∩ water before 0 → Fail
                                    → else → Success → Award + Unlock neighbors
```

Critical original rules:

- You **cannot pick a placed piece back up**. Misplace = restart.
- Only the first N tray slots are selectable (commonly first 3). Remaining pieces show as silhouettes so the player can plan order.
- Placement rate is intentionally unhurried; there is no flick-throw.
- Physics is deterministic enough that “the same placement yields the same result.”

### 2.3 Shape vocabulary (WiiWare)

Public materials list “14 shapes + 2 special.” Reconstruct a *compatible* set rather than tracing official meshes:

| ID | Family | Collision notes |
|----|--------|-----------------|
| `rect_1x2`, `rect_1x3`, `rect_2x2`, `plank_long` | Box | High friction, easy sleep |
| `wedge`, `triangle` | Convex mesh | Point-load, tips easily |
| `disc`, `half_disc` | Cylinder / convex | Rolls unless chocked |
| `cross_x` | Compound boxes | Interlocks, high inertia |
| `arrow`, `tee`, `ell` | Compound boxes | Offset COM |
| `dumbbell`, `bone` | Compound capsules | Rolls on the bar |
| `arch` | Convex | Needs a keystone or sits as a base |
| `glass_load` | Special | Breaks when stacked-on count ≥ threshold (Wii: typically 2–3) |
| `glass_timer` | Special | Timer starts when anything rests on it; at 0 it shatters |

All standard pieces share a **warm stained-wood** material with visible grain, bevelled edges, and slight surface irregularity. Glass pieces are thicker studio-glass, not window panes.

### 2.4 World structure (WiiWare 4 worlds)

| World | Theme (reconstruct, do not copy) | Mechanic focus |
|-------|----------------------------------|----------------|
| I | Sunlit sitting room, plants, linen | Standard wood, stable stone plinth |
| II | Warmer wood-panel lounge | Load-limit glass introduced |
| III | Cooler evening / cloth drapes | Timer glass introduced |
| IV | Mixed “best of” lounge | Combined specials + challenge plinths |

Each world has ~25 puzzles. Progression on Wii was more linear than the later cube-graph, but the Wii U cube shelf is the stronger UX and is specified in §8 as the level-select visual even for a 100-level set.

Challenge types inside a world:

- **Balance:** plinth is a floater, a thin beam, or a seesaw that responds to mass.
- **Height:** after hold, the highest point of the stack must clear a marker.
- **Time:** a level timer runs from first grab (or from level start — pick one and stick to it; original “time challenges” punish dithering).

### 2.5 Visual pillars (what reviewers actually noticed)

From contemporary Wii write-ups and Shin'en's later Wii U tech notes (same art direction, higher budget):

- Water that *receives* sunlight and *reacts* when pieces hit it (height-field ripples + planar reflection).
- Soft sun shafts through a window that are occluded by the piece you are holding.
- “Gemütlich” imperfection: scratches on the table, uneven wood, plants that are not CG-clean.
- Blocks that feel heavy and crafted, not primitive colliders with a wood texture slapped on.
- UI that almost disappears. Three lights at the basin for the hold count. A quiet cursor.

WiiWare ran 480p/576i at 60 fps. Unity 6.6 should target **1080p+ at 60** with the same *composition*, not a photoreal kitchen viz.

---

## 3. Engine and project setup (Unity 6.6)

### 3.1 New project

1. Hub → **Unity 6.6** → template **Universal 3D** (URP).
2. Color space: **Linear**.
3. Backend: **IL2CPP** for players; Editor can stay Mono during iteration. Unity 6.6’s CoreCLR / faster Enter Play Mode path is useful — leave **Domain Reload off** for Play Mode as the 6.6 default encourages.
4. Active input: **Input System** package only (disable the old manager).
5. Packages to add:
   - Universal RP (comes with template)
   - Shader Graph
   - Cinemachine 3
   - Input System
   - UI Toolkit + UITK Default Runtime Theme
   - Splines (optional, for cable / plant stems)
   - Unity Profiling Core / Memory Profiler
6. Do **not** enable HDRP. The HDRP Water System is the wrong scale and cost for a tabletop diorama.
7. Do **not** start from the 2D URP template. Physics Core 2D / Box2D 3 is excellent in 6.6 but this game is a **3D rigid-body toy** rendered as a diorama. Use **PhysX 3D**.

### 3.2 Render pipeline asset

Create `Assets/Settings/URP-ArtOfBalance.asset`:

| Setting | Value | Why |
|---------|-------|-----|
| Rendering Path | Forward+ | Few lights, many small meshes |
| HDR | On | Sun shafts, bloom on water highlights |
| HDR Precision | 32-bit | Cheap at this scene size |
| Opaque Texture | On | Water refraction / scene color |
| Depth Texture | On | Water depth fog, soft intersection foam |
| Shadow Resolution | 2048, 2 cascades | Soft contact of blocks on stone |
| Soft Shadows | On | |
| Additional Lights | Per-pixel, 4–8 | Window + fill + bounce cards |
| MSAA | 4x (quality) / 2x (balanced) | Clean bevels on wood |
| Render Scale | 1.0 at 1080p | |

Renderer features:

- URP Decal renderer (scratches, wet rings on stone).
- Screen-space overlay for the pointer.
- Optional Full-Screen Pass for gentle grain + very mild chromatic aberration (glass pieces also get a per-material CA, see §5.4).

### 3.3 Quality tiers

| Tier | Resolution | Shadows | Water sim | VFX |
|------|------------|---------|-----------|-----|
| High | Native | 2048, PCSS-like soft | 256² height field, planar reflection | Shafts, splash particles |
| Mid | 1080p | 1024 | 128² height field, planar reflection | Shafts cheaper |
| Low | 900p | 512, 1 cascade | Normal-only water, no planar reflection | Splash sprites |

Lock **fixedDeltaTime = 1/60** and **vSync or targetFrameRate = 60**. Physics and render stay in lockstep; the original sold “super-smooth 60.”

### 3.4 Folder map

```
Assets/
  Art/
    Blocks/          meshes, materials, collision prefabs
    Rooms/           four lounge sets
    Water/
    Props/           plants, frames, cloth, table
    Lighting/        sky, IBL, light cookies
  Audio/             placeholder SFX + original-style stems you compose
  Data/
    Shapes/          ShapeDefinition SOs
    Levels/          LevelDefinition SOs
    Worlds/
  Prefabs/
    Gameplay/        Piece, Pedestal, Basin, TraySlot, Cursor
    Systems/         GameDirector, PhysicsTuner
  Scripts/
    Core/            state machine, services
    Pieces/
    Levels/
    Input/
    Water/
    UI/
    Editor/          level authoring windows
  Settings/          URP, Input Actions, Physics
  Scenes/
    Boot.unity
    Lounge_World01.unity … World04.unity
    LevelSelect.unity
```

Use **Addressables or Unity 6.6 Content Directories** for world art so Boot stays tiny. For a 100-level student/clone project, Addressables is enough.

---

## 4. Software architecture

### 4.1 Principles

- **Data-driven levels.** Designers never write C# to make a puzzle.
- **One source of truth for “is this a legal piece.”** Shape assets own mass, friction, special rules, and mesh.
- **Gameplay director is a pure state machine.** Rendering and audio subscribe to events.
- **Physics is not faked** except for the grabbed piece (kinematic follow) and the 3-second hold rule (which is a *timer*, not a freeze).

### 4.2 Core types

```csharp
// ShapeDefinition.cs  — ScriptableObject
public enum ShapeSpecial { None, LoadLimit, TimerGlass }
public sealed class ShapeDefinition : ScriptableObject
{
    public string Id;
    public Mesh VisualMesh;
    public Mesh CollisionMesh;          // convex or compound roots
    public float Mass = 1.2f;
    public float StaticFriction = 0.65f;
    public float DynamicFriction = 0.55f;
    public float Bounciness = 0.02f;
    public Vector3 CenterOfMassOffset;
    public ShapeSpecial Special;
    public int LoadLimit = 3;           // pieces resting on this
    public float ShatterDelay = 4f;     // timer glass
}

// LevelDefinition.cs
public sealed class LevelDefinition : ScriptableObject
{
    public string Id;
    public WorldId World;
    public PedestalPrefab Pedestal;
    public ChallengeKind Challenge;
    public float TimeLimit;             // 0 = none
    public float HeightTarget;          // 0 = none
    public float CameraFov = 32f;
    public ShapeId[] TrayOrder;         // full queue
    public int InitiallyAvailable = 3;
}

// PieceView — MonoBehaviour on the spawned prefab
// Holds Rigidbody, colliders, ShapeDefinition ref, visual state.
```

### 4.3 Services (plain C# or thin MonoBehaviours)

| Service | Responsibility |
|---------|----------------|
| `GameDirector` | State machine in §2.2, owns win/fail |
| `LevelLoader` | Spawns pedestal, basin water, tray, pieces |
| `TrayController` | Availability window, silhouette slots |
| `PointerController` | Ray from camera through cursor → grab plane |
| `GrabController` | Kinematic follow, 45° rotate, release impulse = 0 |
| `StabilityWatchdog` | Water overlap, out-of-bounds, hold timer, height probe |
| `SpecialRulesSystem` | Load-limit counts, timer glass, shatter VFX |
| `WaterSim` | Height field + splash impulses |
| `Progression` | Save file, unlocked levels, rings |
| `AudioCue` | Event-driven one-shots and stems |

Use a lightweight event bus (`event Action<Piece> OnPieceReleased`) rather than a full messaging framework. The scene is small.

### 4.4 Scene composition

- **Boot:** loads save, input, audio mixer, then Level Select.
- **Level Select:** one persistent lounge with a shelf of cubes (see §8).
- **Play scenes:** one additive scene per world environment + a reusable `Gameplay.unity` (basin, systems, camera rig) streamed on top. Pedestal and tray contents swap per level without unloading the lounge.

This matches the original’s “same room, new puzzle” cadence and keeps lighting baked per world.

---

## 5. Recreating the visuals

This is half the product. Budget art time here before you author 100 levels.

### 5.1 Camera and composition

Cinemachine 3 **CinemachineCamera** with:

- Fixed world anchor authored on the `LevelDefinition` (position + look-at a point 0.15 m above the plinth).
- Vertical FOV **28–36°** (telephoto-ish). Wide FOV makes the basin look like a toy; long lens makes it feel like a table you are sitting at.
- Dutch angle: 0.
- **Aim zoom** while grabbing: blend FOV −4° and dolly-in 0.25 m toward the piece. Original Wii did this to help pointer precision.
- No free look. A single “reset view” button is enough.
- Physical camera optional; if used, focal length ~50–70 mm equivalent, modest DoF (aperture f/5.6) so the far wall goes slightly soft. DoF is a Wii U luxury; keep it subtle on the play scene so it does not hide the waterline.

Letterbox 16:9. Offer a 4:3 safe framing guide in the editor because the original supported both.

### 5.2 The lounge (world art)

Build **one modular kit**, re-skin four times.

Kit pieces:

- Window wall with thin curtains (cloth sim *or* a baked vertex-animated mesh — runtime cloth is overkill).
- Sideboard / table the basin sits on. Albedo + roughness variation, micro-scratches as a detail map, a few decal scratches.
- 3–5 potted plants. Leaves use a two-sided foliage shader with cheap SSS (URP Lit: thickness map, or a Shader Graph translucent leaf).
- Picture frames, books, a lamp. Keep silhouettes readable; never crowd the basin.
- Floor: wood or stone with a large-scale worn albedo.

Lighting recipe (matches Shin'en's published Wii U notes, scaled to URP):

1. **HDRI sky** of a bright interior / garden (use a CC0 indoor probe, not a generic outdoor noon).
2. **Key:** directional light as sun through the window. Cookie = tree/muntin mask. Intensity high enough to blow the window slightly.
3. **Sun shafts:** URP full-screen radial smear *or* a textured cone card in the window volume. The original trick — shafts that **occlude when a held piece crosses them** — is done by placing the shaft after opaque geometry (or a ray-marched dust pass that samples depth). Prioritize this; reviewers mentioned it.
4. **Fill:** low-intensity warm area light from the ceiling.
5. **Bounce card:** off-camera cool fill from the window wall so the shadow side of wood is not black.
6. **Baked GI:** use Unity 6.6’s compute light baker / Adaptive Probe Volumes for the static lounge. Dynamic pieces use APV + a single blob shadow projector or mesh shadows.
7. **Reflection probes:** one box probe for the room, one small probe at the basin for the water/table.

Imperfection pass (non-negotiable):

- No perfectly planar table. 2–3 mm vertex noise.
- Wear on the basin rim.
- Slight albedo variation per block instance (hue ±2°, lightness ±4%) so a stack does not look instanced.

### 5.3 The basin and water

Water is the fail plane and the beauty shot. Implement it as two layers.

**Collision / gameplay layer**

- A trigger box (or convex mesh) whose top face is the visual water plane.
- `OnTriggerEnter` on layer `Water` → `StabilityWatchdog.Fail(Piece)`.
- A second trigger around the basin exterior for “fell on the table.”

**Visual layer**

Minimum viable (shippable, Wii-like):

1. A tessellated plane (129×129 verts) with a Shader Graph:
   - Transparent surface, `Scene Color` refraction (URP Opaque Texture).
   - Depth-based absorption (shallow = clear amber/teal, deep = darker).
   - Two scrolling normal maps, slow.
   - Specular from the sun, tight roughness (~0.04–0.08).
   - Intersection foam via depth difference at the stone rim and at submerged pieces.
2. **Planar reflection:** a second camera under the plane, rendering only the room + pieces, sampled in the water shader and perturbed by the normals. Shin'en did exactly this on Wii U. In URP, a planar reflection renderer feature or a custom RT camera is standard.
3. **Ripples:** a 128² or 256² R16 height-field RenderTexture updated by a compute shader (two-pass wave equation). Piece impacts write a Gaussian impulse at the XZ hit. The water shader samples the height for normals *and* vertex offset.

Splash when a piece dies:

- Burst of droplets (URP particle, 40–80 quads).
- One larger crown mesh that lives 0.4 s.
- Audio whoosh + ceramic tick.
- Height-field impulse scaled by piece mass.

Do not use HDRP Water. Do not simulate the whole basin as a fluid for gameplay — ripples are cosmetic.

### 5.4 Blocks

**Modeling**

- Author in real-world cm. A “unit plank” ≈ 12 × 4 × 4 cm. Keep a shared module so pieces interlock predictably.
- Bevel every exposed edge 1–1.5 mm. Un-bevelled boxes look like programmer art and catch light badly.
- One material slot for wood, one optional for end-grain.
- Collision: prefer **Box / Capsule / Sphere compounds** over MeshCollider. Crosses = two boxes. Dumbbell = two spheres + a box. MeshCollider convex is acceptable for the wedge and arch only.

**Shading**

- URP Lit, baked-ready albedo (2K atlas per family, not 2K per piece).
- Normal + roughness + AO packed.
- Subtle clearcoat is optional; raw oil-finished wood reads better without it.
- Vertex color or a material property block tints each instance.
- Glass specials: Transparent Lit, IOR-ish refraction via scene color, **per-object chromatic aberration** in the shader (split RGB UVs by a few pixels — Shin'en called this out as a favorite). Cracks are a dissolve + cap mesh spawned on shatter.

**Feel**

- Sleeping pieces stop micro-vibrating. If a stack buzzes, friction and solver iterations are wrong, not the texture.
- A faint contact decal (compressed wood fiber) can stamp on the plinth after 0.5 s of sleep. Purely cosmetic.

### 5.5 Cursor and held-piece presentation

- 2D hardware-style cursor in screen space (UI Toolkit or a world quad that always faces camera). Wii used a pointing hand / simple reticule.
- Held piece: **kinematic**, casts a **blob + sharp shadow** on the basin so the drop point is obvious.
- Optional translucent “ghost” at the projected drop cell is *not* original and should stay off by default. The original made you read the live pose.
- While dragging, the piece ignores collision with tray UI and with the cursor volume; it *does* collide with already-placed pieces if you want “bump and ruin,” but original feel is: held piece is a ghost until release, then becomes dynamic at the current pose with zero extra velocity. **Recommend ghost-until-release** — it matches “place, don’t throw.”

### 5.6 Post-process

URP Volume on the play camera:

- Bloom: low threshold, small dirt, to catch the sun on water.
- Color Adjustments: slight warm filter for Worlds I–II, cooler for III.
- Vignette: 0.15, never heavy.
- Film grain: 0.08.
- No motion blur on the camera. Optional object MB on falling pieces only.
- Mild split-tone if you need the “afternoon lounge” look.

### 5.7 Level-select visual

Rebuild the later (better) presentation even for a 100-level Wii set:

- A 3D shelf of wooden cubes in the same lounge.
- Completed cubes show a tiny diorama or a burned-in glyph.
- Locked cubes are wrapped or dark.
- Challenge cubes are a second wood stain (original later used orange).
- Cursor DoF: Cinemachine volume + focus on the hovered cube (Wii U did this).
- Marble or polished wood shelf with roughness-driven reflections (Shin'en used IBL + roughness).

This screen is the palate cleanser between attempts. Spend art time on it.

---

## 6. Physics and the gameplay loop

### 6.1 Why PhysX 3D, not Physics Core 2D

Unity 6.6 ships a modern multi-threaded **Physics Core 2D (Box2D 3)** stack. It is the wrong abstraction here:

- Pieces have thickness and are viewed in 3/4.
- Pedestals, dual plinths, and later scale bases live in 3D.
- Planar reflections and sun-shaft occlusion need real 3D transforms.

Use **3D Rigidbody + PhysX**. If you ever ship a pure side-on mobile cut-down, *then* consider a 2D sim.

### 6.2 Project Settings → Physics

Start here, then tune with a calibration scene of 20 known stacks:

| Property | Starting value | Notes |
|--------------------------|----------|
| Gravity | (0, −9.81, 0) | Do not cartoon it |
| Default Solver Iterations | 12 | Stacking needs more than 6 |
| Default Solver Velocity Iterations | 8 | |
| Solver Type | Temporal Gauss-Seidel | Better high-mass-ratio stacks |
| Default Contact Offset | 0.01 | Too small → jitter |
| Sleep Threshold | 0.005 | Low enough that a *settled* stack sleeps; not so low it never sleeps |
| Auto Sync Transforms | Off | |
| Adaptive Force | Off | |
| Layer Collision Matrix | see §6.3 | |

Per-piece Rigidbody:

- Mass from `ShapeDefinition` (scale with volume; wood density ≈ 0.6–0.8 relative to a 1.0 reference cube).
- Drag 0.05, Angular Drag 0.15 (kills endless rolling on discs without feeling syrupy).
- Interpolation: **Interpolate** on pieces the camera watches; pedestals kinematic.
- Collision Detection: **Continuous Speculative** on pieces, Discrete on statics.
- Constraints: **Freeze position Z** and **Freeze rotation X/Y** *only if* you decide to lock play to a plane. Recommendation: **do not freeze by default**. Author the camera and pointer plane so players *naturally* stack in a slab ~8–12 cm deep. Freezing Z makes dumbbells and crosses feel fake.

### 6.3 Layers

```
Default
StaticWorld     — lounge, table
BasinStone      — pedestal, rim
Water           — trigger only
Piece           — all dynamic shapes
HeldPiece       — grabbed piece (no collide with Piece or Tray)
Tray            — tray colliders / pick volumes
Kill            — floor outside basin
IgnoreRaycast
```

Matrix: HeldPiece vs Piece = **off**. HeldPiece vs BasinStone = **off** (so you can lower into a tight gap). On release, swap layer Piece and enable contacts.

### 6.4 Grab and release (the feel of the Wii Remote)

Pointer pipeline:

1. Input System `Point` action (mouse position / touch / gamepad-driven virtual cursor / future Wiimote-style IR).
2. Camera.ScreenPointToRay → intersect an invisible **grab plane** that passes through the current piece origin and faces the camera, *or* a horizontal plane at piece-center height when over the basin.
3. While held, `Rigidbody.isKinematic = true`; each FixedUpdate sets `position = planeHit + hoverOffset`. Hover offset ≈ 2–4 cm so the piece does not z-fight the stack.
4. Rotate action (Q/E, shoulder buttons, scroll wheel) adds ±45° around camera-forward *projected onto world-up as the spin axis*. Snap with a short rotational ease (0.08 s) so it is not a pop, but the rest pose is exact 45° quantize.
5. On release: `isKinematic = false`, `linearVelocity = 0`, `angularVelocity = 0`. Any leftover pointer velocity is discarded. This is the original “place, don’t bowl.”

Do not use ConfigurableJoint for the grab in v1. Kinematic is simpler and matches “the piece is in your hand.”

### 6.5 Stability watchdog and the 3-second rule

```csharp
// Pseudocode inside GameDirector
void OnLastPieceReleased()
{
    _hold = 3.0f;
    _state = State.HoldCountdown;
    Lights.Set(0);
}

void TickHold(float dt)
{
    if (AnyPieceInWaterOrKill()) { Fail(); return; }
    _hold -= dt;
    Lights.Set(3 - Mathf.CeilToInt(_hold));   // 1, 2, 3
    if (_hold <= 0f) Success();
}
```

Nuances to implement exactly:

- The hold starts on release of the **last remaining tray piece**, not when the stack “looks still.”
- A stack that is mid-collapse can still win if water contact happens after t=0. That is the infamous “3… 2… 1… YES” beat. Do not add a “must be sleeping” check.
- Height challenges measure `max(piece.bounds.max.y)` at the moment of Success, not during the hold (document this; either is fine if consistent).
- Time challenges fail the level when the clock hits 0, even mid-hold — pick this rule in writing and stick to it.

### 6.6 Special pieces (WiiWare pair)

**Load-limit glass**

- Each physics tick (or OnCollisionStay, throttled to 10 Hz), count unique pieces whose contact points have `normal · up > 0.5` and whose body is above this one.
- If count ≥ `LoadLimit` for `ShatterGrace` seconds (0.15 s, to ignore slaps), shatter.
- Shatter: disable collider, play fracture mesh (pre-authored 4–6 shards with their own rigidbodies), apply small outward impulse, then those shards *are* pieces that can fail the level if they hit water.

**Timer glass**

- Arm when any other piece has a stable contact from above for 0.1 s.
- UI: a dark wedge around the piece, original-style.
- At 0: same shatter path.

Do not implement fire or gravity-invert until Phase 6.

### 6.7 Pedestals and challenge bases

Prefab variants, all kinematic unless noted:

| Prefab | Behavior |
|--------|----------|
| `Plinth_Stone` | Static convex, high friction |
| `Plinth_Narrow` | Same, 30–40% width |
| `Plinth_Float` | Dynamic rigidbody, low mass, buoyancy force from water plane, angular drag high so it bobs instead of flipping instantly |
| `Plinth_Beam` | Long thin box, may be hinged at center |
| `Plinth_Dual` | Two static posts (later worlds use linked scale — Phase 6) |

Buoyancy for floaters: apply `F = ρ V_submerged g` at the submerged centroid each FixedUpdate. Do not use a full hydrostatic solver.

### 6.8 Fail / reset

- The instant any **live** piece overlaps Water or Kill: freeze scoring, play splash, wait 0.35 s, fade, despawn pieces, respawn tray from `LevelDefinition.TrayOrder`. Do **not** reload the scene.
- Keep the lounge and GI intact. Reset time target: **< 0.5 s** perceived.
- A “retry” button is identical to fail-reset.

### 6.9 Calibration harness

Build `Scenes/PhysicsLab.unity` before content production:

- Drop a 1×2×1 plank onto the stone from 5 cm, 10 times. Measure rest pose variance. If yaw drifts > 1°, raise friction or solver iterations.
- Build a 6-plank Jenga tower. It must stand 10 s unattended.
- Release a disc on a flat plank. It may roll off; that is correct.
- Glass load-limit of 2 with three unit cubes. Must shatter only when the third seats.

Record these as EditMode / PlayMode tests where practical (`UnityEngine.TestTools`).

---

## 7. Input mapping

Input Actions asset `ArtOfBalance.inputactions`.

| Action | Mouse / keyboard | Gamepad | Touch |
|--------|------------------|---------|-------|
| Point | Mouse position | Right stick moves a virtual cursor | Primary touch |
| Grab | LMB | South button / LT | Touch down on piece |
| RotateCW / CCW | Wheel, E / Q | RB / LB | Two-button or rotate gesture |
| CancelGrab | RMB | East | Two-finger tap |
| Retry | R | Select | UI button |
| Pause | Esc | Start | UI |

Pointer speed on stick must be tunable; reviews of later ports complained a stick cursor was sluggish. Provide a slider.

Co-op drop-in (v1 local): Player 2’s device, once a Grab is detected, spawns a second cursor and may pick any *available tray piece* the other player is not holding. Both release into the same PhysX world. This is the original “second Wii Remote can join at any time.”

Versus (Phase 5): two stacked play scenes or a split camera, two `GameDirector` instances, first Success wins the round.

---

## 8. Level pipeline and progression

### 8.1 Authoring

Custom Editor window `LevelEditor`:

1. Pick world lounge.
2. Pick pedestal prefab.
3. Drag `ShapeDefinition` assets into an ordered tray list.
4. Set `InitiallyAvailable`, challenge flags, camera shot.
5. **Play From Here** enters Play Mode with that SO injected.
6. Save writes the SO; a validation pass warns if total mass cannot rest on the plinth’s bounds (heuristic, not a solver).

Do not store levels as open scenes. One lounge scene × many SOs is how you reach 100 puzzles without a scene explosion.

### 8.2 Suggested content ramp (100 levels)

| Block of 25 | Contents |
|-------------|----------|
| World I (1–25) | Rectangles and planks only for 1–8; introduce disc, wedge, cross by 15; first narrow plinth at 18; first Height challenge at 22 |
| World II (26–50) | Load-limit glass from 26; force the player to use glass as a *base* and as a *cap* in separate levels |
| World III (51–75) | Timer glass; levels that require parking a timer under a light piece, not a tower |
| World IV (76–100) | Mix; 6–8 challenge stages (float, beam, timed, height); last five are “exam” puzzles using every standard shape |

Unlock rule (Wii-like, slightly modernized):

- World N+1 unlocks at 15 clears in World N *or* 60 total clears.
- Inside a world, use the cube neighbor graph so the player is never gated on a single brick-wall puzzle.

Save: `Application.persistentDataPath/save.json` with cleared IDs, best time, hold-margin (how much of the 3 s was left — useful later for medals).

### 8.3 Medals / rings

Original used rings to open worlds. Implement a lightweight analog:

- Clear = 1 ring.
- Clear with no retry this session = gold stamp on the cube (cosmetic).
- Do not hide extra content behind grinding; the Wii game was about flow.

---

## 9. UI / HUD

UI Toolkit runtime panels, not Canvas-heavy prefabs.

Play HUD (almost empty):

- Top-left: pause.
- Bottom-center: three hold lights (off / dim / on). These should feel like hardware LEDs on the basin, not a mobile banner. Prefer **world-space meshes** parented to the basin over screen widgets.
- Top-right: optional time / height marker when the challenge needs it.
- Tray is **in-world** on the table (Wii U insight: pieces sitting on the table feel better than a 2D ribbon). Silhouettes for locked slots: unlit, 30% alpha, same mesh.

Pause: world-dim + a small card (Retry, Select Level, Options, Quit).

Level select: 3D cubes as in §5.7; UITK only for the title, world name, and “rings to next world.”

Typography: a quiet humanist sans. The original logo is stylized lowercase; design an original wordmark. Do not recreate Shin'en’s logotype.

---

## 10. Audio (systems only)

You cannot ship the original soundtrack. Specify a brief and a cue list.

Brief: mid-tempo lounge, warm keys, nylon guitar or soft marimba, no percussion that competes with wood-clack SFX. One 90–120 s loop per world plus a thinner “hold” layer that enters at countdown.

Cue list:

| Event | Sound |
|-------|-------|
| Hover piece | Soft wood tick |
| Grab | Lift, short |
| Rotate snap | Dry click |
| Place / first contact | Layered wood + stone, velocity-scaled |
| Sleep (stack settles) | Almost silence; maybe a distant room tone swell |
| Hold tick 1/2/3 | Pitched chimes, rising |
| Success | Small major cadence, no choir |
| Shatter | Glass, short, not cartoon |
| Splash | Water + ceramic bowl |
| Fail sting | Downward wood block, polite |
| UI move | Cloth / wood, never plastic |

Implement via a mixer with `Music`, `Foley`, `UI` groups and a snapshot that ducks music 2 dB during the hold.

---

## 11. Implementation phases

Estimates assume one technical designer-engineer + one generalist artist, or a solo dev who can model simple props. Calendar time, not man-hours.

### Phase 0 — Vertical slice (1.5–2 weeks)

- URP project, input, one lounge corner, one stone plinth, three wood shapes (plank, disc, cross).
- Grab / 45° rotate / release / water fail / 3 s hold / instant retry.
- Placeholder water plane with refraction + one planar reflection.
- PhysicsLab scene passing the Jenga-6 test.

Exit criterion: a stranger can clear a 4-piece puzzle and smile at the splash.

### Phase 1 — Piece library and specials (2 weeks)

- All 14 standard collision-accurate meshes and wood trimsheet.
- Load-limit + timer glass with shatter shards.
- Tray availability window + silhouettes.
- Sun shafts that occlude behind the held piece.

### Phase 2 — World I content + level tools (2 weeks)

- LevelEditor window.
- 25 World I puzzles.
- Progression save.
- In-world hold lights.

### Phase 3 — Visual lock for one world (2 weeks)

- Final table, plants, window, IBL, APV bake.
- Height-field ripples + splash VFX.
- Post-process volume.
- Camera zoom-on-grab.

### Phase 4 — Worlds II–IV (3–4 weeks)

- Three more lounge kits (material + lighting swaps plus a few unique props).
- Remaining ~75 puzzles, including challenges.
- Float / beam pedestals.
- Cube level-select scene.

### Phase 5 — Modes that existed on WiiWare (1.5 weeks)

- Local drop-in co-op.
- Split-screen versus (same level, first 3-second win).
- Options: pointer speed, camera zoom, vibration, subtitles off (there is almost no text).

### Phase 6 — Optional later-port extras (only after the Wii loop is good)

- Scale-linked dual plinths.
- Gravity invert (multiply `Physics.gravity` *and* flip camera ease; kill-volume becomes a ceiling plane).
- Fire blocks that destroy on mutual contact.
- Endurance (3 lives).
- Worlds V–VIII.

Do not start Phase 6 to “make it complete.” The WiiWare game is complete at Phase 5.

---

## 12. Technical risks and mitigations

| Risk | Why it hurts | Mitigation |
|------|--------------|------------|
| Stack micro-jitter, never sleeps | Destroys the 3 s hold fantasy | TGS solver, higher iterations, friction ≥ 0.55, sleep threshold tune, compound colliders instead of messy meshes |
| Held piece tunnels into the stack on release | Instant unfair fail | Hover offset, speculative CCD, release at kinematic pose with zero velocity |
| Water reflections cost 2–4 ms | Miss 60 fps | Reflect only the basin-facing layer mask; half-res RT; disable on Low |
| 100 unique meshes explode batch count | Frame spikes on Low | One wood material, GPU instancing, atlased albedo |
| Timer glass + load glass interact poorly | Unreadable fails | Specials never stack their rules on the same piece in v1 |
| Co-op grab fights | Friendship damage | A piece has one owner; second cursor cannot steal a held piece |
| “Clone looks like a physics demo” | Missing the product | Art pillars in §5 are gated into Phase 0/3, not postponed |

---

## 13. Testing protocol

### 13.1 Gameplay

- Every level cleared twice by someone who did not author it.
- Fail-retry 20 times on a late World IV level; reset must stay under 0.5 s and never leak rigidbodies (`FindObjectsByType<PieceView>` count == tray size).
- Hold-rule acceptance: build a tower that is *visibly falling* but whose lowest piece is still 2 cm above water at t=0. Must award Success.
- Specials: automated tests that drop N unit cubes onto a load-limit piece.

### 13.2 Feel

- Record 60 fps captures of release → contact → sleep. If contact “pops” the stack upward, mass ratios or default contact offset are wrong.
- Disc pieces must be allowed to betray the player. Do not add invisible stops.

### 13.3 Visual regression

- Four golden screenshots per world (empty basin, mid-stack, splash, level select).
- Compare sun-shaft occlusion with a piece held in front of the window.

### 13.4 Performance budget (1080p High, mid-range desktop / current-gen handheld)

| Pass | Budget |
|------|--------|
| CPU Gameplay + PhysX | < 3.0 ms |
| Water compute + planar reflection | < 1.5 ms |
| GPU opaque + shadows | < 6 ms |
| GPU transparent + post | < 2.5 ms |
| Headroom | rest of 16.6 ms |

Unity 6.6 2D profilers will not help; use the standard Profiler, Frame Debugger, and Memory Profiler. Physics visualization: show contacts and sleeping bodies while tuning.

---

## 14. Suggested class / prefab inventory (v1)

Scripts:

- `GameDirector`, `LevelLoader`, `TrayController`, `PointerController`, `GrabController`
- `PieceView`, `PieceSpecialLoadLimit`, `PieceSpecialTimer`
- `StabilityWatchdog`, `WaterKillVolume`, `HeightProbe`
- `WaterHeightField`, `WaterSplashEmitter`, `PlanarReflectionTracker`
- `PedestalFloat`, `SunShaftOcclusion` (optional)
- `ProgressionService`, `SaveStore`
- `LevelEditorWindow`

Prefabs:

- `Piece_Generic` (skinned by SO at spawn)
- `Basin_01`, `Plinth_Stone`, `Plinth_Narrow`, `Plinth_Float`, `Plinth_Beam`
- `Tray_Table`, `TraySlot`
- `Cursor_P1`, `Cursor_P2`
- `VFX_Splash`, `VFX_ShatterGlass`
- `Lights_HoldTriplet`

Data:

- 16 `ShapeDefinition` assets
- 100 `LevelDefinition` assets
- 4 `WorldDefinition` assets (lounge scene ref, music stem, cube tint)

---

## 15. Legal and ethical notes

- Rebuild mechanics and atmosphere. Do not rip WiiWare meshes, textures, audio, or official level sequences.
- Do not use the name *Art of Balance*, Shin'en’s logotype, or box art on a distributed build. Working title examples: *Basin*, *Quiet Stack*, *Plinth*.
- If this is a portfolio piece, label it “inspired by Shin'en Multimedia’s 2010 WiiWare physics puzzle.”
- A commercial release would need a lawyer and an original content pass on every puzzle.

---

## 16. Recommended first week checklist

1. Create the URP 3D project on Unity 6.6; lock 60 Hz and Linear color.
2. Import Input System; build the pointer + 45° rotate actions.
3. Model one bevelled plank and one stone plinth to real-world cm.
4. Implement kinematic grab → zero-velocity release → water trigger fail.
5. Implement the 3-second hold lights.
6. Drop a 6-plank tower and refuse to author more shapes until it sleeps cleanly.
7. Add a refractive water plane and a planar reflection camera.
8. Play that one puzzle for an hour. If it is not already pleasant, do not open the LevelEditor.

The original game is a small set of honest rules inside a kind room. Unity 6.6 will happily overbuild it. The implementation plan above is complete when the plank, the basin, and the three lights are enough to make someone hold their breath.

---

## Appendix A — Original feature matrix vs v1

| Feature | WiiWare 2010 | This v1 plan |
|---------|--------------|--------------|
| Levels | 100 | 100 |
| Worlds | 4 lounges | 4 lounges |
| Shapes | 14 + 2 special | 14 + 2 special |
| Rotation | 45° | 45° |
| Hold to win | 3 s | 3 s |
| Fail | Water / out of tub | Water / out of tub |
| Challenges | Balance, Height, Time | All three |
| Co-op drop-in | Yes | Phase 5 |
| Versus split | Yes | Phase 5 |
| Fire / gravity / scales | No (later ports) | Phase 6 only |
| Resolution / fps | 480p60 | 1080p+60 |
| Pointer | Wii Remote | Mouse / touch / stick cursor |

## Appendix B — Primary public references used

- Nintendo Life WiiWare review (2010-02-18) and first impressions (2010-01-18): loop, specials, challenges, 60 fps presentation.
- Official WiiWare feature list (100 levels, 4 worlds, 14+2 shapes, co-op / versus).
- Wikipedia summary of stacking, 45° rotation, 3-second hold, later-port countdown change.
- The Game Hoard Wii U write-up: lounge atmosphere, glass / fire / gravity as *later* world foci, 3-second “tipping is allowed” rule, cube level graph.
- Serenes Forest feature breakdown: world-by-world mechanic list, tray-of-three availability, challenge types.
- Shin'en / NintendObserver Wii U weekly screenshot notes (Manfred Linzner): height-field water, planar reflections, IBL marble, window shafts with 512-sample radial blur, chromatic aberration on glass, “gemütlich” surface imperfection, in-world tray on the table, cube level select with cursor DoF.
- Unity 6.6 manuals: URP, PhysX project settings (TGS solver, sleep threshold), Physics Core 2D scope (intentionally unused here).

These sources describe publicly observed behavior and published tech commentary. They are not a substitute for playing the original when blocking animation timings and camera cuts.
