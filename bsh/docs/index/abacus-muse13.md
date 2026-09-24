# Art of Balance (WiiWare, 2010) Clone — Implementation Plan in Unity 6.6

**Target:** Faithful gameplay + visual recreation of Shin'en Multimedia's `Art of Balance` WiiWare original using Unity 6.6\
**Focus:** Visuals and Main Gameplay Loop\
**Engine:** Unity 6.6 LTS + Universal Render Pipeline (URP) + PhysX + Input System\
**Platform Target:** PC (mouse) first, scalable to Switch / mobile touch — mirroring original Wii Remote pointer controls

> This is a clean-room clone plan. Do not copy original code, art, music, or level data. Recreate mechanics and look-alikes with original assets.

---

## 1\. Reference Analysis: What We Are Cloning

### 1.1 Original Game Summary

`Art of Balance` is a 2010 physics puzzle game developed and published by Shin'en Multimedia for WiiWare [Art of Balance - Wikipedia](https://en.wikipedia.org/wiki/Art_of_Balance).

Core premise:

> Stack several blocks on top of one another on a platform floating in water without the blocks falling into the water. [Art of Balance - Wikipedia](https://en.wikipedia.org/wiki/Art_of_Balance)

Key facts for scope:

* 100 levels on WiiWare original, 200 puzzles in later Arcade mode versions [Art of Balance | WiiWare | Games | Nintendo UK](https://www.nintendo.com/en-gb/Games/WiiWare/Art-of-Balance-284413.html)

* Single-player + drop-in co-op with second Wii Remote + split-screen versus race mode [Art of Balance | WiiWare | Games | Nintendo UK](https://www.nintendo.com/en-gb/Games/WiiWare/Art-of-Balance-284413.html)

* Blocks can be rotated at 45° angles and take various shapes [Art of Balance - Wikipedia](https://en.wikipedia.org/wiki/Art_of_Balance)

* Special blocks: break-if-overloaded, timed-break blocks, weight-limit blocks [Art of Balance | WiiWare Wiki | Fandom](https://wiiwaredatabase.fandom.com/wiki/Art_of_Balance)

* Win condition: Once all blocks have been used, a countdown must reach zero to pass a level [Art of Balance - Wikipedia](https://en.wikipedia.org/wiki/Art_of_Balance)

* In Arcade Mode: stack until no blocks left, then tower must stand still for 3 more seconds without falling, indicated by three lights at bottom of screen [Art of Balance Review (WiiWare) | Nintendo Life](https://www.nintendolife.com/reviews/2010/02/art_of_balance)

* Additional challenge variants: time limit, height limit, swaying platform on water [Art of Balance - Wikipedia](https://en.wikipedia.org/wiki/Art_of_Balance) and [Art of Balance Review (WiiWare) | Nintendo Life](https://www.nintendolife.com/reviews/2010/02/art_of_balance)

* Setting: puzzles take place in a living room environment, structures built over water [Art of Balance - WiiWare](https://www.mariowii.nl/en/wii-game-information.php?Nintendo=Art_of_Balance)

### 1.2 Main Gameplay Loop (WiiWare)

```
1. Level Intro (show world/theme, platform + water, block queue tray)
2. Spawn current block floating at top, controlled by pointer
3. Player moves (X/Y) + rotates (45° steps) + drops/releases
4. Physics settles block on tower/platform
5. If block falls in water -> fail / retry (lose life in Endurance)
6. Next block spawns until queue empty
7. STABILITY PHASE: 3-second countdown (3 lights) - tower must stay out of water
8. Pass -> score, unlock next level -> Fail -> reset level
```

Controls praised as `accurate controls` and `intuitive controls` using Wii Remote motion/pointer [Art of Balance Review (WiiWare) | Nintendo Life](https://www.nintendolife.com/reviews/2010/02/art_of_balance). Clone with mouse + keyboard first: mouse = Wii pointer, A/D or wheel = rotate, click/release = grab/drop.

### 1.3 Visual Identity to Recreate

Original Wii version described as polished blocks but mixed backdrops with some jagged edges; later Wii U version praised for `beautifully rendered` blocks, drinkable water, sunlight blocking/shadows, satisfying wooden `clunk`, jazzy relaxing music [Art of Balance Review (Wii U eShop) | Nintendo Life](https://www.nintendolife.com/reviews/wiiu-eshop/art_of_balance).

WiiWare visual pillars to clone:

1. **Diorama living-room:** warm interior, wooden table/shelf, window light, blurred background, eccentric artwork in scenery [Art of Balance Review (WiiWare) | Nintendo Life](https://www.nintendolife.com/reviews/2010/02/art_of_balance)

2. **Floating platform + water basin:** small wooden/metal pedestal floating in a tub / infinity water plane. Water is hero shader.

3. **Toy-like wooden blocks:** smooth, glossy lacquered wood, bright colors (red, orange, yellow, green, blue, natural), beveled edges, clear shape language: squares, rectangles, long planks, triangles, circles/wheels, L-shapes, U-shapes.

4. **Clean UI:** minimal, rounded, bottom block queue, top level/world indicator, 3 stability lights, soft shadows.

5. **Feel:** serene, zen, tactile. `simple yet clever mechanics` and `serene soundtrack` [Art of Balance - Wikipedia](https://en.wikipedia.org/wiki/Art_of_Balance).

---

## 2\. Technical Foundation - Unity 6.6 Setup

### 2.1 Project Template

* Unity 6.6 LTS, URP 3D template (not HDRP - need Wii-like 60fps on low spec + stylized look).

* Color Space: Linear, Forward+ rendering, MSAA 4x, single directional light + baked GI for room.

* Physics: NVIDIA PhysX 3D, **but gameplay constrained to 2.5D plane** (see 3.1).

* Packages: Input System 1.8+, Cinemachine 3.x, DOTween (or PrimeTween), FMOD or Unity Audio + Resonance, URP Decals, Shader Graph.

* Target 1920x1080, 60fps, side orthographic-ish camera (actually perspective 35mm with narrow FOV for diorama tilt-shift feel).

### 2.2 Folder & Architecture

```
Assets/
  _Game/
    Art/ Materials, Models, Textures, Shaders
    Audio/ SFX, Music
    Code/ Core, Physics, Input, Levels, UI, Visuals
    Data/ Levels (ScriptableObjects), Worlds
    Prefabs/ Blocks, Platform, Water, VFX
    Scenes/ Boot, MainMenu, Game, WorldThemes
```

Architecture pattern:

* `GameManager` (state machine: Intro, Spawning, Aiming, Falling, Settling, StabilityCheck, Win, Lose)

* `LevelManager` (loads LevelData SO, spawns platform + queue)

* `BlockController` (held vs. placed states, rotation, break logic)

* `StabilityManager` (3-sec timer, water detection, velocity check)

* `WaterManager` (splash detection, buoyancy kill)

* `InputController` (pointer abstraction: Mouse / Touch / Gamepad)

* `AudioManager`, `UIManager`, `SaveManager` (PlayerPrefs + JSON)

### 2.3 Camera & Scale

* 1 Unity unit = 1m. Typical block 0.5m - 1.5m. Platform \~3m wide.

* Main camera: Position (0, 1.5, -7), look at tower center. FOV 30 for low perspective distortion (mimics Wii orthographic feel but keeps 3D depth).

* Cinemachine: subtle idle sway + zoom-out as tower grows (dynamic framing). Confine Y follow.

* Background room is 8-12m behind play plane, heavily DOF-blurred to hide low detail and create miniature feel.

---

## 3\. Gameplay Implementation - Core Loop

### 3.1 Critical Decision: 2.5D Physics

Original feels 2D but blocks are `3D in nature` [Art of Balance | WiiWare Wiki | Fandom](https://wiiwaredatabase.fandom.com/wiki/Art_of_Balance). Do NOT use full 3D stacking - too chaotic.

**Solution:**

* All gameplay Rigidbodies: `constraints = FreezePositionZ, FreezeRotationX, FreezeRotationY` - only X/Y move + Z rotation allowed.

* Play plane at Z=0. Visual depth remains (beveled 3D meshes, thickness 0.6m) but physics is effectively 2D.

* Use **3D BoxCollider, SphereCollider, MeshCollider (convex) + Compound Colliders** for L/U shapes, not 2D colliders. This preserves realistic tipping/rolling and allows later true-3D modes.

* Physics timestep: `Fixed Timestep 1/120` (120Hz) minimum, max 240Hz on PC for stable stacking. Wii U version ran physics `several hundred times per second` for less exploitability - replicate with high solver iterations: `Default Solver Iterations = 12, Velocity Iterations = 8`.

* Physics Materials: Wood-Wood friction 0.6-0.9, bounciness 0.05. Tune per block type. High friction is essential for fun.

Alternative considered and rejected: Unity 2D Physics (Box2D) with 3D visuals - mismatch in rotation/collision causes visual clipping. Stick to constrained 3D.

### 3.2 Block Types (MVP Set)

Recreate 10 archetypes:

1. `Square` 0.6x0.6 - starter

2. `Rect` 1.2x0.6

3. `Long Plank` 2.0x0.4 - bridge builder

4. `Triangle` - wedge

5. `Ball / Wheel` - round, rolls - high difficulty

6. `L-Shape` (compound of 2 boxes)

7. `U-Shape / Bridge`

8. `Fragile Glass` - breaks if load > X kg or impact velocity > threshold

9. `Timed Cracked` - timer starts when another block touches it, breaks after N sec [Art of Balance Review (WiiWare) | Nintendo Life](https://www.nintendolife.com/reviews/2010/02/art_of_balance)

10. `Heavy Metal` - 3x mass, stabilizer but crushes fragile

Each `BlockData : ScriptableObject`:

```csharp
shapeId, prefab, mass, friction, bounciness,
isFragile, maxSupportedMass, isTimed, timeToBreak,
allowedRotations = 45° steps, colorVariants
```

Meshes: model in Blender with 0.04m bevel. UVs for wood grain. One material with color tint property to reduce draw calls.

### 3.3 Input & Manipulation (Wii Remote Clone)

Wii pointer -> Mouse:

* **Hover/Move:** Raycast pointer ray onto gameplay plane Z=0. Held block follows with critically-damped spring (not direct transform set - preserves physics feel). Use `Rigidbody.MovePosition` in FixedUpdate with lerp speed 12.

* **Rotate:** Q/E or mouse wheel: snap 45° increments with tween + click sound. Show ghost rotation preview. Rotation only allowed while held.

* **Drop/Release:** Left-click release or Space: switch from Kinematic (held) to Dynamic (placed). Add tiny downward velocity 0.5 m/s for tactile drop.

* **Grab placed block?** Original: No re-grab after release (except co-op nudge). Keep no re-grab for purity. Allow level restart (R).

* **Touch:** Single finger drag = move, two-finger twist or buttons = rotate. Reuse same plane raycast.

* **Gamepad:** Left stick moves, RB/LB rotates.

Polish: held block has soft drop shadow blob + slight scale 1.05 + outline glow. Trajectory dotted line down.

### 3.4 Platform & Water Fail Logic

* Platform: Static Rigidbody (or Kinematic if swaying level). Variants: flat, narrow pillar, seesaw, linked pistons `as one rises, the other falls` [Art of Balance Review (Wii U eShop) | Nintendo Life](https://www.nintendolife.com/reviews/wiiu-eshop/art_of_balance), moving barge.

* Water: Plane Y = -2.0. Trigger volume. Any `Block` or `Platform debris` entering -> splash VFX + fail after 0.5s delay (allow dramatic teeter).

* Distinguish: If held block touches water while aiming -> instant fail. If tower block touches after stability phase started -> fail.

### 3.5 Stability / Win Logic

Reproduce 3-second rule:

```csharp
if (queueEmpty && !anyBlockInWater) {
  stabilityTimer += deltaTime if (maxBlockVelocity < 0.25m/s && maxAngularVel < 15°/s)
  else stabilityTimer decays
  Update 3 UI lights (1 light per second)
  if stabilityTimer >= 3.0f -> Win
}
```

Later versions shortened countdown - keep 3.0s for WiiWare authenticity, expose as LevelData parameter (2-5s).

Extra win variants:

* Height levels: tower top must exceed Y-target line (laser visual).

* Time-attack / Super puzzles: global timer + swaying water [Art of Balance - Wikipedia](https://en.wikipedia.org/wiki/Art_of_Balance).

### 3.6 Level Data System

`LevelData (ScriptableObject)`:

* worldId (1-8), levelIndex, theme, platformPrefab, waterLevel, stabilityTime, timeLimit, heightGoal

* blockQueue: List<BlockSpawnEntry> { blockId, colorOverride }

* camera framing, hints

* par / difficulty 1-5

Start with 24 levels (3 worlds x 8) for vertical slice, data-driven to scale to 100 to match original `100 levels` [Art of Balance | WiiWare | Games | Nintendo UK](https://www.nintendo.com/en-gb/Games/WiiWare/Art-of-Balance-284413.html). Level select grid with stars.

Save: unlocked levels, best time, stars in JSON.

### 3.7 Game Modes (Phase 2 after core loop solid)

1. Arcade Solo (MVP)

2. Co-op (second pointer, same screen - easy with Input System multiplayer)

3. Versus split-screen race: duplicate tower side-by-side, first to stabilize wins [Art of Balance Review (WiiWare) | Nintendo Life](https://www.nintendolife.com/reviews/2010/02/art_of_balance)

4. Endurance + Tower Tumble ideas can be stretch goals.

---

## 4\. Visual Recreation in Unity 6.6

### 4.1 Art Direction Bible

Palette: warm cream walls (#F5E9D3), walnut wood (#8B5A2B), pastel blocks (high saturation, V=0.9), aqua water (#3EC6D3). Lighting: warm key (sun through window, 5500K) + cool fill.

Reference mood: miniature toy room, tilt-shift, cozy. Not photoreal - stylized PBR with soft roughness 0.4-0.6.

### 4.2 Room / Diorama (Background)

Build 4 world themes reusing one room prefab:

* World 1 Living Room, World 2 Kids Room, World 3 Kitchen, World 4 Garden Shed, etc.

Components (low-poly, URP Lit):

* Back wall + wooden floor (tiling PBR, roughness map)

* Window frame left with fake god-ray (transparent plane + volumetric fake shader) + light cookie

* Shelf with books / vases (simple boxes/cylinders, blurred by DOF)

* Table on which water tub sits - tub is foreground hero mesh

* Depth of Field + Bloom (URP Volume) to mimic miniature. Focus on Z=0 plane.

Performance: bake lighting, use Light Probes for blocks, occlusion culling. Room < 80k tris.

### 4.3 Water Shader (Hero Asset)

Original Wii U water `looks real enough to drink` [Art of Balance Review (Wii U eShop) | Nintendo Life](https://www.nintendolife.com/reviews/wiiu-eshop/art_of_balance). In URP Shader Graph:

* Transparent PBR, normal ripple (2 scrolling normals), fresnel, depth fade at tub edges, specular sun glint

* Interactive ripples: script passes splash positions to shader (up to 8 ripples array) + vertex sine sway for floating platform levels

* Splash: particle system (URP particle lit) + expanding ring mesh + `plop` sound. Foam sprite.

* Caustics fake: animated caustic texture projected on platform base.

Keep water plane 6x4m, 64x64 segments for vertex waves.

### 4.4 Blocks & Platform Materials

* Single URP Lit shader with: Albedo tint, wood grain detail map (multiply), clearcoat approximation via high smoothness + env reflection probe, edge wear via AO baked in vertex colors.

* Bevel + soft shadow: enable Contact Shadows, SSAO (URP), 2048 shadowmap from directional light. `objects block out the sunlight as you move them` - ensure held block casts real-time shadow [Art of Balance Review (Wii U eShop) | Nintendo Life](https://www.nintendolife.com/reviews/wiiu-eshop/art_of_balance).

* Fragile glass: transparent physical material, crack decal stages (0%, 50%, 90% stress) + creak sound pitch rising with load.

* Timed block: emissive pulsing + countdown ring UI above block.

### 4.5 Lighting & Post in Unity 6.6

* 1 Directional (sun through window, shadows), 1 Spot (warm room lamp), ambient via Gradient + Reflection Probe.

* URP Global Volume: Bloom (0.3), Vignette (0.25), DOF (focus 7m, aperture 5.6), Color Adjustments (saturation +10, contrast +5), Tonemapping ACES.

* Light cookies for window frame shadows - cheap and very effective for coziness.

### 4.6 UI Recreation

WiiWare UI: playful rounded font (use Nunito Rounded - free similar), bottom tray showing remaining blocks as mini icons, top-left World-Level, top-right restart/menu, bottom-center 3 stability bulbs.

Implement with UI Toolkit or Canvas + DOTween pops. Add ghost preview of next block.

### 4.7 Audio-Visual Feel

* Drop `clunk` - wooden knock (synthesize: short sine burst + noise). Pitch by mass [Art of Balance Review (Wii U eShop) | Nintendo Life](https://www.nintendolife.com/reviews/wiiu-eshop/art_of_balance).

* Creak when tower stressed (loop volume by torque).

* Splash, success chime, ambient jazzy loop (original: `jazzy, relaxing` [Art of Balance Review (Wii U eShop) | Nintendo Life](https://www.nintendolife.com/reviews/wiiu-eshop/art_of_balance)) - compose original lo-fi jazz loop 90 BPM, Rhodes + brushed drums. Do not copy original tracks.

---

## 5\. Implementation Roadmap (8 Weeks Vertical Slice)

**Week 1 - Prototype:** URP scene, constrained physics sandbox, grab/move/rotate/drop, 1 platform + 3 block types. Validate fun.

**Week 2 - Core Loop:** queue system, water fail, 3-sec stability, win/lose, restart, 5 test levels.

**Week 3 - Blocks:** all 10 types, fragile/timed logic, compound colliders, physics tuning spreadsheet (mass, friction matrix).

**Week 4 - Visuals Pass 1:** room diorama, water shader v1, wood materials, lighting, post.

**Week 5 - Levels & UI:** LevelData system, 24 levels, level select, HUD, stability lights, height/time variants, save system.

**Week 6 - Juice:** particles, splashes, shadows, camera follow/zoom, sounds, music, haptics.

**Week 7 - Modes:** co-op pointer, versus split-screen prototype, difficulty curve balancing (`smooth and gradual increase in difficulty` [Art of Balance Review (WiiWare) | Nintendo Life](https://www.nintendolife.com/reviews/2010/02/art_of_balance)).

**Week 8 - Polish & Test:** 60fps profiling, physics determinism test (100 drops), playtest, tutorial tooltips, build.

---

## 6\. Testing & Tuning Checklist

* Stability: tower of 8 blocks must sleep (velocity <0.05) within 2s, no jitter.

* No tunneling: small fast balls vs thin planks at 120Hz - enable Continuous Speculative.

* Exploit check: rotating through other blocks while held - use kinematic overlap prevention (if overlap, tint red, block drop).

* Water edge cases: half-submerged block counts as fail if >30% below waterline for >0.4s.

* Difficulty: World 1 pass rate >90% in 2 tries, World 3 <60% first try.

---

## 7\. Risks & Mitigations

* PhysX stacking jitter -> increase solver iterations, use sleep thresholds, limit mass ratio <10:1.

* Scope creep to 100 levels -> data-driven + procedural validator (auto-solve check via brute-force stability test in editor).

* Legal: label as `inspired by` puzzle-stacker, all original art/names. No `Art of Balance` trademark, no ripped assets.

---

## 8\. Definition of Done (Clone Success)

* Player can complete 24-level loop with Wii-like pointer feel, 45° rotation, fragile/timed blocks, water fail, 3-light stability win.

* Scene looks like cozy living-room diorama over drinkable water with toy wood blocks and soft shadows at 60fps.

* Playtesters describe as `addictive`, `easy to pick up and hard to put away` like original pitch [Art of Balance | WiiWare | Games | Nintendo UK](https://www.nintendo.com/en-gb/Games/WiiWare/Art-of-Balance-284413.html).

---

_Generated plan for Unity 6.6 recreation focusing on visuals + main loop. Next step: prototype Week 1 scene._
