# Art of Balance Clone — Unity 6.6 Implementation Plan

> Goal: recreate the visuals and core gameplay loop of Shin'en Multimedia's *Art of Balance* (WiiWare, 2010) from scratch in Unity 6.6. This document is a build plan, not a design bible: it describes what to build, in what order, and how each system should work.

---

## 1. Reference Breakdown of the Original

Before building, pin down what actually makes Art of Balance feel like Art of Balance.

### 1.1 Core loop (per level)
1. A **floating platform** (or several) sits in a pool of calm water inside a serene, zen-like room.
2. A **tray of pieces** (wooden, stone, glass, etc.) appears at the side. Every piece must be placed.
3. The player **grabs** a piece with the pointer, **rotates** it in fixed steps (the original used the Wii Remote's pointer + buttons), moves it over the stack, and **releases** it. Gravity does the rest.
4. Placed pieces settle under physics. The stack sways; the platform may tilt or bob.
5. When **all pieces are placed** and the stack has been **stable for ~3 seconds**, a countdown ring fills and the level is solved.
6. If **any piece touches the water**, the level fails immediately (short splash, the stack sinks, instant retry).

### 1.2 Piece families (what to recreate)
| Family | Behaviour | Notes |
|---|---|---|
| Standard (wood/stone) | Rigid, medium friction | Cubes, slabs, L-shapes, T-shapes, wedges, arches, cylinders |
| Glass | Shatters if **two or more** other pieces rest on it | Transparent, high-visibility failure state |
| Round / cylinder / sphere | Rolls; requires cradling | Introduces "lock it in" puzzles |
| Heavy (stone/metal) | Higher mass, shifts balance dramatically | Used to counterweight |
| Light / floaty (later worlds) | Low mass, easily pushed off | Optional in first release |

### 1.3 Visual identity
- Calm indoor "zen spa" environments: stone floors, bamboo, paper lanterns, wooden decks, soft volumetric daylight or lantern light.
- **Water** is the hero: mirror-like reflections, gentle ripples, refraction, subtle caustics, and a soft foam ring around the platform.
- Materials are clean, slightly stylised PBR — polished wood grain, matte stone, tinted glass.
- Heavy **bloom / soft light**, shallow depth of field on the stack, warm colour grading.
- Camera: fixed, slightly elevated three-quarter view; mild parallax as the pointer moves; slow drift when idle.
- UI is minimal: a piece tray, a level number, a circular stability timer, and near-silent fail/success feedback.

### 1.4 Modes (scope order)
1. **Arcade / Level mode** — ~100 levels in 5–8 themed zones. *Required.*
2. **Endurance** — endless stacking with a piece counter. *Nice-to-have, cheap once core is done.*
3. **Local 2-player** — alternating placement or split-screen. *Post-MVP.*

---

## 2. Technology Stack (Unity 6.6)

| Concern | Choice | Reason |
|---|---|---|
| Render pipeline | **URP** (Universal Render Pipeline) with Forward+ | Good-looking water/bloom at low cost; easy to scale to PC, console, Switch-class hardware |
| Physics | Built-in PhysX 3D | Deterministic enough for a puzzle stacker; solver iterations tuned per level |
| Input | **Input System** package | Mouse, touch, gamepad, and gyro-pointer through one action map |
| Shaders | **Shader Graph** + a few HLSL includes | Water, glass, foam ring, dissolve/shatter |
| UI | **UI Toolkit** (runtime) | Clean, vector-based HUD; USS theming per zone |
| Level data | ScriptableObjects + JSON export | Designer-friendly in editor, diffable in git |
| Content loading | Addressables | Zone-based environment streaming |
| Audio | Unity Audio + AudioMixer (or FMOD later) | Ambient loops, contact sounds by material |
| Save | JSON in `Application.persistentDataPath` | Progress, best times, settings |
| Testing | Unity Test Framework | Physics regression tests for hand-authored levels |

Project settings to set on day one:
- **Fixed Timestep: 0.01 (100 Hz)** — thin pieces on tilting stacks need small steps to avoid tunnelling and jitter.
- **Default Solver Iterations: 12 / Velocity Iterations: 4** (raise per-piece for tall stacks).
- **Contact offset 0.005**, **Default Max Depenetration Velocity 2**.
- Enable **Enhanced Determinism** and **Auto Sync Transforms off**.
- Colour space Linear, HDR on, MSAA 4x (URP) or TAA.

---

## 3. Architecture

```
Assets/
  _Project/
    Scripts/
      Core/          GameBootstrap, GameStateMachine, ServiceLocator, EventBus
      Gameplay/      PieceController, PieceDefinition, PlatformController, StabilityJudge, WaterKillVolume
      Input/         PointerInput (mouse/touch/gyro), InputActions.inputactions
      Levels/        LevelDefinition (SO), LevelLoader, LevelProgress
      Camera/        CinematicCamera, ParallaxRig
      Visual/        GlassShatter, SplashFX, FoamRing, MaterialContactAudio
      UI/            HUDController, PieceTray, StabilityRing, ZoneSelect
      Audio/         AudioDirector
    Art/             Models, Materials, Shaders, Textures, VFX
    Levels/          Zone01/, Zone02/ ... (LevelDefinition assets)
    Prefabs/         Pieces/, Platforms/, Environments/
    Scenes/          Boot, MainMenu, Game (persistent), Env_Zone01 ... (additive)
```

### 3.1 Game state machine
```
Boot → MainMenu → ZoneSelect → LevelIntro → Playing → (Failing | Judging) → Success → NextLevel
```
- `Playing`: player may grab/place pieces.
- `Judging`: all pieces placed; `StabilityJudge` runs the 3 s timer.
- `Failing`: a piece hit water; play splash, sink stack, fade, reload level.

### 3.2 Key runtime objects
- **`PieceController`** (per piece) — Rigidbody + compound colliders, state (`InTray`, `Held`, `Falling`, `Resting`), material type, glass load counter.
- **`PlatformController`** — the floating base. Kinematic or dynamic with a buoyancy model (see §5.4).
- **`StabilityJudge`** — watches all pieces' linear/angular velocity and position drift; drives the ring UI.
- **`WaterKillVolume`** — trigger under the water plane; any piece entering → fail.
- **`LevelLoader`** — instantiates platform + pieces from a `LevelDefinition`, sets camera framing, loads zone environment additively.

---

## 4. Milestone Plan

| # | Milestone | Duration (1 dev) | Exit criteria |
|---|---|---|---|
| 0 | Project setup, URP, input, physics settings | 2 days | Grey-box scene, cube can be dragged and dropped |
| 1 | **Core gameplay loop** | 2 weeks | Grab / rotate / drop / stability check / water fail / retry with placeholder art |
| 2 | Level data pipeline + 10 test levels | 1 week | Levels authored in editor, loaded from SOs, progress saved |
| 3 | **Water & environment visuals (Zone 1)** | 2 weeks | Water shader, one full environment, lighting, post-processing |
| 4 | Piece art & materials, glass, audio | 1.5 weeks | All piece families modelled; glass shatter; contact audio |
| 5 | UI/HUD, menus, zone select | 1 week | UI Toolkit HUD, tray, stability ring, level select |
| 6 | Content: 5 zones × 20 levels | 3–4 weeks | 100 levels, difficulty curve tested |
| 7 | Polish, performance, platform builds | 2 weeks | 60 fps on target, no physics regressions |
| 8 | Endurance & 2P (optional) | 1–2 weeks | — |

Total for a solid single-player clone: **~13–15 weeks** solo, roughly half with an artist.

---

## 5. Gameplay Systems — Detailed

### 5.1 Pointer input (replacing the Wii Remote)
- Abstract everything behind a `PointerInput` service that exposes: `ScreenPosition`, `GrabPressed/Released`, `RotateCW/CCW`, `RotateAxisToggle`, `Cancel`.
- Bindings:
  - **Mouse/touch**: cursor = pointer; LMB/tap = grab; wheel or Q/E = rotate; RMB = flip axis.
  - **Gamepad**: right stick moves a virtual cursor with acceleration; A grab; bumpers rotate.
  - **Gyro (Switch/DualSense/mobile)**: map orientation to a screen-space cursor, exactly like the Wii pointer.
- Cursor is a soft glowing dot (like the original) with a hand icon when hovering a piece.

### 5.2 Grab, carry, rotate, release
1. **Raycast** from the pointer through the camera against the `Piece` layer.
2. On grab: set `isKinematic = false`, disable gravity, store grab offset, and drive the piece toward the target with a **spring**:
   ```csharp
   // in FixedUpdate while Held
   Vector3 target = pointerPlanePoint + holdOffset;   // point on a fixed depth plane
   Vector3 toTarget = target - rb.position;
   rb.linearVelocity = toTarget * carryStiffness;      // ~25
   rb.angularVelocity = Vector3.zero;
   rb.MoveRotation(Quaternion.RotateTowards(rb.rotation, targetRot, rotateSpeedDegPerStep));
   ```
   A velocity-driven carry (not `MovePosition`) keeps collisions correct so a held piece can nudge the stack but never tunnel through it.
3. **Carry plane**: pieces move on a plane parallel to the camera at the platform's depth; the vertical position is clamped to a minimum height above the current highest contact so you cannot drag through the stack.
4. **Rotation**: 90° steps around the camera-forward axis by default; a modifier switches to the vertical axis. Steps are tweened over ~0.12 s. Snap rotation is *exact* (quantised to 90°) so faces line up.
5. **Release**: enable gravity, zero linear velocity (optionally keep a small fraction of carry velocity for a "toss" feel — the original did not allow throwing, so default 0), set state `Falling`.
6. **Hover ghost**: while held, draw a translucent silhouette on the projected landing spot (raycast down from the piece's lowest point). This is a modern readability aid; make it optional to stay faithful.

### 5.3 Piece physics
- Each piece prefab: `Rigidbody` + **compound primitive colliders** (boxes, capsules, cylinders via convex mesh). Avoid a single non-convex MeshCollider; convex hulls of L/T shapes make stacks slide.
- Per-material `PhysicsMaterial`:
  | Material | Dynamic friction | Static friction | Bounciness | Density |
  |---|---|---|---|---|
  | Wood | 0.6 | 0.7 | 0.05 | 0.6 |
  | Stone | 0.7 | 0.8 | 0.02 | 2.2 |
  | Glass | 0.4 | 0.45 | 0.1 | 1.0 |
  | Rubber/light | 0.9 | 0.95 | 0.2 | 0.3 |
- Mass computed from volume × density (`SetDensity`) so shape sizes feel right.
- **Interpolation: Interpolate**, **Collision Detection: Continuous Dynamic** for held/falling pieces, switch to **Discrete** once resting (perf).
- Set `maxAngularVelocity = 20` and `sleepThreshold` slightly higher than default so towers settle instead of micro-jittering.

### 5.4 Platform & water behaviour
Two options, pick per level:
- **Anchored platform** (most levels): kinematic Rigidbody; the *visual* bob is faked with a gentle sine on a child transform. Stability is entirely about the stack's own centre of mass.
- **Floating platform** (harder levels): dynamic Rigidbody with a simple buoyancy model — 4–6 sample points, each applying `F = ρ g V_submerged` upward plus linear/angular drag. The stack's off-centre mass tilts the platform, which is what makes the original's later levels tense.

`WaterKillVolume` is a thin box trigger ~5 cm below the water surface; `OnTriggerEnter` with a piece → `GameEvents.PieceDrowned(piece)`.

### 5.5 Stability judging (the 3-second rule)
```
Every FixedUpdate in Judging state:
  stable = all pieces:
      linearVelocity.magnitude  < 0.02 m/s
   && angularVelocity.magnitude < 0.05 rad/s
   && |position - positionAtJudgeStart| < 0.01 m
  if (stable) timer += dt else timer = 0
  if (timer >= 3.0) → Success
```
- Start judging as soon as the tray is empty and the last piece has entered `Resting`.
- Any grab during judging cancels the timer (original allowed re-adjusting pieces while the ring filled — keep this).
- The **stability ring** UI fills with the timer; on completion, play the chime and freeze physics (set all pieces kinematic) so the "solved" pose is preserved for the camera flourish.

### 5.6 Glass rule
- `GlassPiece` keeps a set of pieces currently in contact **from above** (contact normal · up > 0.7).
- If `set.Count >= 2` for more than 0.15 s (debounce), trigger **shatter**: disable the glass collider, spawn a pre-fractured mesh prefab with small outward impulses, play glass SFX. Pieces that were resting on it now fall → almost always leads to a water fail, but not necessarily.
- Visual pre-warning: at count 1 the glass gets a faint stress tint; a subtle hairline crack decal appears.

### 5.7 Fail & retry
- On `PieceDrowned`: switch to `Failing`, spawn splash particles + ripple at impact point, apply buoyancy to *nothing* (pieces just sink with increased drag), fade to the zone colour, reload `LevelDefinition` in ~1.2 s. No penalty, no lives — mirror the original's forgiving pacing.

### 5.8 Level data
```csharp
[CreateAssetMenu] public class LevelDefinition : ScriptableObject {
    public string id;                 // "Z1-07"
    public ZoneId zone;
    public PlatformSetup platform;    // prefab, position, anchored/floating, buoyancy params
    public List<PieceSpawn> pieces;   // PieceDefinition, tray order, optional pre-placed pose
    public CameraFraming camera;      // pivot, distance, pitch
    public float parTimeSeconds;      // for medals (optional)
    public LevelRules rules;          // glass rule on/off, gravity scale, wind (later zones)
}
```
- An editor tool (`LevelAuthoringWindow`) lets a designer drop pieces into a scene, press *Solve & Record* to store a known-good solution pose, and *Bake* to export the `LevelDefinition`.
- **Regression test**: a playmode test loads every level, spawns pieces at their recorded solution pose, runs physics 5 s, and asserts stability. This catches physics-setting changes that silently break levels.

---

## 6. Visuals — Detailed

### 6.1 Water (the centrepiece)
Shader Graph, URP Lit master, Transparent queue:
- **Normals**: two scrolling tileable normal maps at different scales/speeds + a low-frequency vertex displacement (very small amplitude, ~1 cm) for the "still pond" look.
- **Reflection**: Planar reflection camera (render at 0.5× resolution to a RenderTexture) for a true mirror look — this is what sells the original's water. Fall back to Reflection Probe + SSR on low tiers.
- **Refraction**: sample `_CameraOpaqueTexture` with normal-based UV offset; depth-based tint (shallow: clear cyan, deep: teal).
- **Fresnel** blend between refraction and reflection.
- **Caustics**: animated caustic texture projected onto the pool floor via a decal projector, modulated by the same normal field.
- **Foam/contact ring**: `SceneDepth − PixelDepth` → thin white line where the platform and pieces meet the water; also used for the splash ring.
- **Ripples**: a small RenderTexture "ripple buffer" (256²) driven by a compute/blit that receives impacts (piece splashes, platform bob); sampled as an extra normal perturbation. Simple ping-pong height-field simulation is enough.

### 6.2 Environments (one per zone)
Themes to mirror the original's progression, each a separate additive scene streamed via Addressables:
1. **Bamboo Garden** — daylight, paper screens, soft sun shafts.
2. **Stone Bathhouse** — warm lanterns, steam, dark slate.
3. **Night Pavilion** — moonlight, fireflies, cool palette.
4. **Cavern Spring** — turquoise water glow, stalactites.
5. **Rooftop Pool** — golden hour, distant skyline blurred.

Per environment: baked GI (Lightmapper: GPU Progressive) + a few realtime lights for lanterns; **Volume** profile with Bloom (threshold ~0.9, intensity 0.6), Depth of Field (focus on platform), Vignette, Color Adjustments/LUT, subtle Film Grain, and Fog for depth.

### 6.3 Pieces & materials
- Modelled with **bevelled edges** (0.5–1 cm) — critical; sharp CG edges look wrong under the soft lighting.
- Wood: tileable grain albedo/normal, smoothness ~0.55, slight anisotropic-looking highlight via normal detail.
- Stone: matte, smoothness 0.25, AO baked into vertex colour.
- Glass: URP Lit Transparent, smoothness 0.95, low alpha, refraction via opaque texture sampling, edge-highlight via Fresnel; a `_Stress` float drives the pre-shatter tint.
- Pieces get a soft **contact shadow** from URP screen-space shadows; add a cheap blob shadow projector for extra grounding.

### 6.4 Camera
- Cinemachine 3: a fixed `CinemachineCamera` per level framing, with a **parallax rig** that offsets the camera ±10 cm based on pointer position (the original's Wii-pointer parallax feel).
- Idle drift: very slow noise on position when no input for >4 s.
- Success flourish: dolly-out + slow orbit of ~30° over 2.5 s while the stack is frozen.

### 6.5 Feedback VFX
- **Placement**: tiny dust puff at contact points (from `OnCollisionEnter` impulse magnitude).
- **Splash**: particle burst + ripple injection + water decal darkening.
- **Glass shatter**: pre-fractured mesh + sparkle particles.
- **Success**: soft light bloom pulse, petals/fireflies drift (zone-dependent).

---

## 7. UI / HUD
- **UI Toolkit** document with USS theme swap per zone.
- **Piece tray** (right side): vertical list of piece icons rendered via a `RenderTexture` thumbnail camera at load time; the next piece is highlighted; grabbing from the tray spawns it at the pointer.
- **Stability ring**: radial fill element bound to `StabilityJudge.Progress`.
- **Level label** top-left, **pause** top-right. Nothing else on screen during play.
- Menus: Main → Zone select (5 cards, locked state) → Level grid (20 tiles with completion tick).

---

## 8. Audio
- Ambient loop per zone (water, wind, birds/insects).
- Contact SFX chosen by **material pair** and scaled by impulse (`collision.impulse.magnitude`); 3–4 variations each with random pitch ±5 %.
- Grab/rotate/release UI ticks; soft chime on success; low "bloop" + splash on fail.
- AudioMixer snapshots: Playing, Judging (slightly ducked), Success.

---

## 9. Performance Targets & Tactics
- Target **60 fps @ 1080p** on a mid-range laptop GPU; 30 fps floor on Switch-class.
- Planar reflection at half-res, only renders the environment layer (pieces reflected via SSR or excluded).
- Pieces sleep aggressively once resting; only Held/Falling use CCD.
- Static batching for environments; SRP Batcher on; Addressable unload of previous zone.
- Profile with the Physics Profiler for solver time; cap at ~30 dynamic bodies per level.

---

## 10. Risks & Mitigations
| Risk | Mitigation |
|---|---|
| Stack jitter / "vibrating" towers | 100 Hz fixed step, higher solver iterations, tuned sleep threshold, avoid overlapping compound colliders |
| Level breaks after physics tweak | Automated stability regression test on every level's recorded solution |
| Water looks cheap | Prioritise planar reflection + fresnel + contact foam; these three carry the look |
| Pointer feels floaty with mouse | Spring-carry stiffness 20–30, no smoothing on cursor itself |
| Glass rule feels unfair | Pre-shatter visual warning and 0.15 s debounce |
| Scope creep into modes | Ship Arcade first; Endurance/2P behind a feature flag |

---

## 11. First Two Weeks — Concrete Task List
1. Create URP project, set physics/time settings (§2), import Input System, Cinemachine, Addressables, UI Toolkit.
2. Grey-box scene: water plane (flat blue), platform box, 6 primitive pieces.
3. `PointerInput` with mouse; `PieceController` grab/carry/rotate/release.
4. `WaterKillVolume` + fail/reload.
5. `StabilityJudge` + debug ring (IMGUI is fine for now).
6. `LevelDefinition` SO + `LevelLoader`; author 3 levels by hand.
7. First pass water Shader Graph (normals + fresnel + opaque-texture refraction).
8. Playtest: does stacking feel like the original? Tune friction/stiffness before adding any art.

---

## 12. Definition of "Done" for the Clone
- 100 levels across 5 zones, each verified by the regression test.
- Water with reflection, refraction, ripples, and contact foam.
- All piece families including glass with shatter rule.
- 3-second stability judging with ring UI and retry-on-drown.
- Zone-themed environments, post-processing, ambient and contact audio.
- Save/load progress; mouse, touch, and gamepad support.
