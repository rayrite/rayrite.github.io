I couldn't save a file directly here, so the complete markdown deliverable is below. You can copy it into a file named `ArtOfBalance_Clone_ImplementationPlan.md`.

The plan's biggest recommendation is to run the physics in 2D and draw everything in 3D. The original game plays out on a flat side-on plane, and stable stacking is what makes it work. I'd use Unity's Physics Core 2D API (built on Box2D v3, which stacks more stably), wrapped in a small interface so you can switch to regular Rigidbody2D if needed. I wrote the API names from memory, so check them against the 6.6 docs.

---

```markdown
# Art of Balance Clone: Implementation Plan (Unity 6.6)

**Scope:** A from-scratch rebuild of the look and main gameplay loop of Shin'en's *Art of Balance* (WiiWare, 2010), made in Unity 6.6 with the Universal Render Pipeline (URP).
**Not covered here:** Versus mode, online features, platform certification. Co-op gets only a short note under stretch goals.

---

## 1. What We Are Recreating

### 1.1 Main gameplay (from the original)

- A stone basin filled to the brim with water sits at the bottom of the screen. A few fixed rocks stick up out of the water, and those rocks are the only foundation you can build on.
- A tray at the bottom of the screen holds the level's pieces. There are always at least 3. When there are more than 3, only 3 can be used at a time and the others are shown faded out.
- The player grabs a piece, moves it, turns it in **45° steps** (8 possible angles), and lets go. After release, the piece is fully under physics control.
- **Loss:** any piece touches the water.
- **Win:** once every piece has been placed, a **3-second countdown** starts. If the stack is still standing when it ends, the level is solved.
- **Special levels (challenges)** give 1 extra reward point:
  - *Height:* build the stack past a target line.
  - *Swaying:* there are no rocks, and you build on a pre-placed piece that floats and rocks on the water.
  - *Time limit:* all pieces must be placed before a timer runs out. The final 3-second countdown doesn't count toward it.
- **Breakable pieces** (introduced in World B) shatter when a *third* piece rests on top of them. Some levels can only be solved by deliberately breaking them. Breakable pieces still have to be placed, but they don't have to survive.
- **Timed breakable pieces** (introduced in World C) shatter a set time after something is put on top of them. World D uses both kinds together.
- **Progression:** 4 worlds with 25 levels each. Normal levels give 1 reward point, challenges give 2, and each world's last level gives 3. Unlock thresholds are 20, 40, and 60 points.
- **Piece shapes:** rectangles, circles, half-circles, crosses, triangles, L and Z shapes, thin bars with round ends on one or both sides, and mixed shapes with both flat and curved edges.

### 1.2 Visual targets

| Element | Look in the original | How we'll approach it |
|---|---|---|
| Pieces | Shiny, see-through, brightly colored pieces like candy or glass, with rounded edges | Procedurally extruded meshes with beveled edges, drawn with a Shader Graph material that fakes refraction and adds a rim glow and specular highlights |
| Rocks | Smooth, rounded stones rising from the water | Extruded meshes with heavy bevels and a stone texture applied from all sides (triplanar mapping) |
| Water | A full basin with clear reflections and a gentle surface | A planar reflection camera, animated normal maps, a Fresnel blend, foam where objects meet the water, and a ripple simulation |
| Background | Soft, dreamy skies with a different mood in each world | Stacked gradient and cloud layers with slow drift, bloom, and a soft vignette |
| Overall feel | Calm and minimal, often compared to the "Frutiger Aero" style | Clean UI Toolkit screens with frosted panels and soft drop shadows |

> Gather reference first: record 60 fps video of each world, the level-select screen, the tray, a win, and a loss, then take stills for color picking. Treat all palettes in this document as placeholders until they've been checked against that footage.

### 1.3 Legal note
Use original names, art, audio, and level layouts for anything you release publicly. Copying the mechanics is generally fine, but copying the assets or the trademark is not. (I'm not a lawyer, so get proper legal advice if you plan to ship.)

---

## 2. Main Technical Decisions

### 2.1 2D physics with 3D visuals
All the gameplay happens in one vertical plane, so the simulation runs on the XY plane and each piece's 3D mesh sits at z = 0. This choice gives us:
- Stacking that is more stable and predictable than 3D physics limited to a plane.
- Collision shapes that match the visuals exactly, because the mesh is extruded from the same 2D outline.
- Much simpler logic for rotation, overlap checks, and support detection.

### 2.2 Physics backend
Unity 6.6 ships two 2D physics systems:

| Option | Pros | Cons |
|---|---|---|
| **Physics Core 2D API** (`Unity.U2D.Physics`, Box2D v3) | Box2D v3's solver is noticeably more stable for tall stacks. More deterministic. Lets you run separate physics worlds. | Code-only, with no components. The API is newer. Requires compute-shader support. |
| Classic `Rigidbody2D` / `Collider2D` | Familiar, driven by components, lots of documentation | Older solver, so tall stacks are more likely to jitter or creep |

**Recommendation:** use Physics Core 2D, accessed through a thin `IBalancePhysics` interface so you can fall back to `Rigidbody2D` if the new API gets in the way. Stacking stability is what makes or breaks this game, so prototype both in week 1 (see §9).

### 2.3 Unity 6.6 specifics to plan around
- **Fast Enter Play Mode is now the default** for new projects: the scene reloads when you press Play, but scripts (the "domain") don't. That means **static fields keep their values between play sessions.** Avoid mutable statics, or mark them with `[AutoStaticsCleanup]`. Project Auditor has an analyzer that flags risky statics.
- **Dictionaries can be serialized natively**, so level data can use `[SerializeField] Dictionary<...>` without wrapper classes.
- **Cinemachine and Timeline are now built-in (core) packages**, so you get them without extra installs. Use them for camera framing and the world intro sequences.
- **UI Toolkit supports `backdrop-filter` and `drop-shadow`**, which covers frosted-glass panels without writing custom shaders.
- **Dynamic batching has been removed.** Rely on the SRP Batcher and GPU instancing, which is fine for this small number of objects.
- There's a known forum report that some Play Mode tests fail when only the scene reloads. If your automated tests act up, re-enable domain reload for the test runs.

---

## 3. Project Setup

1. Create a project with **Unity 6.6 (6000.6.x)** from the **Universal 3D** template.
2. Install or confirm these packages: Input System, Shader Graph, Cinemachine and Timeline (both built in), Visual Effect Graph (optional; the Particle System is enough), and the Test Framework.
3. URP asset settings: Forward+ rendering, **MSAA 4x** (clean piece silhouettes matter), HDR on, **Opaque Texture on** (needed for fake refraction), and Depth Texture on (needed for water foam).
4. Physics: set a fixed timestep of **1/120 s**, run 4 substeps per step if you're on Box2D v3, and turn on continuous collision detection for pieces.
5. Folder layout:

```
Assets/_Project/
  Art/        Materials, Shaders, Textures, Meshes (rocks, basin)
  Audio/
  Data/       Pieces/, Levels/, Worlds/
  Prefabs/
  Scenes/     Boot, Title, WorldSelect, LevelSelect, Game
  Scripts/
    Core/        GameStateMachine, Services, SaveSystem
    Physics/     IBalancePhysics, PhysicsCore2DBackend, Rigidbody2DBackend
    Pieces/      PieceDefinition, PieceMeshBuilder, PieceController, Breakable*
    Level/       LevelDefinition, LevelLoader, ChallengeRules
    Input/       CursorController, InputActions
    Rendering/   PlanarReflection, WaterRipples, BackgroundParallax
    UI/
  Editor/        LevelEditorWindow, PieceOutlineEditor, SolutionRecorder
  Tests/
```

---

## 4. Data Model

### 4.1 `PieceDefinition` (ScriptableObject)
```csharp
[CreateAssetMenu(menuName = "AoB/Piece")]
public class PieceDefinition : ScriptableObject
{
    public string id;
    public OutlinePath outline;          // 2D path made of line segments and arcs
    public float  density = 1f;
    public float  friction = 0.6f;       // tune: high friction = forgiving
    public float  restitution = 0.0f;    // no bounce
    public Color  tint;
    public PieceKind kind;               // Normal, Breakable, TimedBreakable, Raft
    public float  timedBreakSeconds = 3f;
    public float  bevelRadius = 0.06f;
    public float  extrudeDepth = 0.5f;
}
```
- **`OutlinePath`** stores the shape as line segments and arcs, which keeps curves exact.
- At authoring time, the path is split into **convex pieces**. Circles use native circle shapes, and round-ended bars use native capsules wherever they can, because round contact surfaces are central to the game's difficulty.

### 4.2 `LevelDefinition` (ScriptableObject)
```csharp
public class LevelDefinition : ScriptableObject
{
    public WorldId world;  public int index;          // A..D, 1..25
    public List<RockPlacement> rocks;                 // static shapes + transforms
    public List<PieceDefinition> queue;               // tray order
    public ChallengeType challenge;                   // None, Height, Sway, TimeLimit
    public float heightTarget; public float timeLimit;
    public RaftPlacement raft;                        // for Sway
    public int rewardPoints;                          // 1, 2 or 3
    public CameraFraming framing;
    public LevelSolution referenceSolution;           // recorded, for tests
}
```

### 4.3 `WorldDefinition`
Holds the 25 levels, the unlock threshold, the music track, a `WorldTheme` (sky gradient, cloud texture, water tint, light color, and piece palette), and the tutorial script.

---

## 5. Gameplay Systems

### 5.1 Game state machine (one level)

```
LevelIntro ─► (Tutorial) ─► Playing ─► AllPlaced/Countdown ─► Success
                               │              │
                               └──── Fail ◄───┘   (piece hits water / time out)
Fail ─► instant Restart (≤0.5 s)      Success ─► Reward ─► Next / Level Select
```

```csharp
public enum LevelState { Intro, Tutorial, Playing, Countdown, Success, Fail }

void Tick(float dt)
{
    switch (state)
    {
        case LevelState.Playing:
            if (waterSensor.AnyPieceInWater) { Fail(); break; }
            if (rules.TimeLimitExpired(dt))  { Fail(); break; }
            if (tray.IsEmpty && !cursor.IsHolding) Enter(LevelState.Countdown);
            break;
        case LevelState.Countdown:
            if (waterSensor.AnyPieceInWater) { Fail(); break; }
            countdown -= dt;
            if (countdown <= 0 && rules.ChallengeSatisfied()) Succeed();
            else if (countdown <= 0) Fail();   // e.g. height not reached
            break;
    }
}
```
Improvements over the original: make tutorials **skippable after the first viewing**, and make restarting instant with a single button press.

### 5.2 Piece tray
- Pieces come from `LevelDefinition.queue` and are displayed as small 3D models rendered into slots at the bottom of the screen.
- **At most 3 pieces are usable at once.** The rest use a faded, grey material. When a piece is used, the next faded one fades in over 0.25 seconds.
- Clicking a slot creates the piece at the cursor, and it is now held.

### 5.3 Holding, turning, and placing
- **While held,** the piece is a kinematic "ghost" that doesn't collide. It follows the cursor with light smoothing (about 25 ms). Snapping it straight to the cursor feels harsh with a mouse, while the Wii remote's jitter was part of the original's challenge.
- **Turning** jumps in 45° steps (mouse wheel, Q/E, or the gamepad shoulder buttons) with a quick 80 ms tween for the visuals. The physics angle updates immediately.
- **Checking where it can go:** each frame, test whether the ghost overlaps static or placed shapes, using a 0.01 m skin. Also block placement if the ghost is below the water line or outside the play area. Show a red tint and disable release when placement is invalid.
- **Releasing** creates a dynamic body at the exact same position and angle with **zero velocity**, so the piece drops only as far as the gap below it.
- Once placed, a piece can't be picked up again, matching the original. You could add an "easy" option that allows undoing the last placement.
- **Controls:** point-and-click with a mouse is the main scheme. A gamepad can move a virtual cursor with adjustable speed and a precision-mode trigger. Build all of it on the Input System, with one `CursorController` per player so co-op is easy to add later.

### 5.4 Water check (loss)
Use a sensor shape (a long box whose top edge sits exactly at the water surface) covering the whole basin. Touching it with any placed piece ends the level. Held ghosts are ignored. When it triggers:
- play a splash (particles, a sound, and a ripple impulse, see §6.4),
- hold time at slow motion (0.3×) for about 0.6 seconds,
- show the restart prompt.

### 5.5 Stability countdown (win)
- Show a large, soft "3 · 2 · 1" in the middle of the screen, with a gentle tick sound each second.
- Keep running breakables and the water check during the countdown.
- Optional: extend the countdown if any piece is still moving faster than a threshold. The original simply ran for 3 seconds, so leave this off by default to match.

### 5.6 Breakable pieces (count-based)
Rule: a breakable piece shatters when **more than 2 other pieces** are stacked on top of it.

**Support graph**, rebuilt every physics step:
1. Loop over contacts between pieces. For contact A–B with a normal pointing from A to B, if the normal's upward component is above 0.5 (so B is resting on A), add the edge `A ─supports→ B`.
2. For each breakable piece, count everything reachable along "supports" edges (a breadth-first search, so pieces stacked indirectly also count).
3. If the count is 3 or more, and has been for 2 steps in a row (to filter out contact flicker), break the piece.

```csharp
int CountLoadAbove(PieceId root)
{
    visited.Clear(); queue.Enqueue(root); int n = -1;
    while (queue.TryDequeue(out var p))
    {
        if (!visited.Add(p)) continue; n++;
        foreach (var q in supports[p]) queue.Enqueue(q);
    }
    return n;
}
```
> Check the rules against footage: does the original count indirect load, or only pieces touching it directly? Make this a per-world setting (`BreakRule.Direct / Transitive`) until you've confirmed.

**Breaking:** destroy the body, create 6–12 short-lived shard pieces that don't interact with gameplay (on a separate collision layer), play a glass-crack sound, and wake up everything the piece was holding up.

### 5.7 Timed breakable pieces
- The timer starts the **first time** a supports edge appears from this piece to another. It keeps running even if that load is later removed; check this against footage.
- The visuals show a glowing ring filling around the piece, a faster pulse in the last second, then the same break as in §5.6.

### 5.8 Challenges
| Type | Setup | Win condition |
|---|---|---|
| Height | A dashed glowing line at `heightTarget` | The highest point of any placed piece's shape is above the line when the countdown ends |
| Sway | No rocks. A **raft** piece floats on the water. | Normal rules. Pieces touching the raft are safe, and anything touching the water still fails. |
| Time limit | A timer bar at the top of the screen | All pieces placed before it runs out, then the normal countdown |

**Floating raft:** make it a dynamic body that the water sensor ignores. Every step, apply a buoyancy force proportional to how deep it's submerged (clipped polygon area times fluid density times gravity) at the center of the submerged area, plus linear and angular damping. Also connect it to an invisible anchor with a weak horizontal spring so it can't drift away. This makes the platform tip naturally as weight is added to one side.

### 5.9 Progress and saving
- Save per level: `completed`, `bestTime`, and `rewardClaimed`. The total reward-point count unlocks worlds at 20, 40, and 60.
- Store saves as JSON under `Application.persistentDataPath`, with a version number for future changes.

---

## 6. Visual Implementation

### 6.1 Camera and composition
- Use a perspective camera with a narrow field of view (around 25–30°) so the 2D plane looks almost flat but still has depth. Tilt it down about 8° so the water surface is visible and shows reflections.
- A Cinemachine camera frames each level from `LevelDefinition.framing`. Optionally, zoom out slowly as the stack grows taller than the frame, which helps Height levels.
- Layout: the basin takes up the bottom 35% of the screen, the building area is in the middle, and the tray covers the bottom 12% over the basin's edge.

### 6.2 Pieces (the signature look)
**Building the mesh** (`PieceMeshBuilder`, run in the editor and cached as assets):
1. Sample the `OutlinePath` into points spaced by arc length (about 64 samples per full circle).
2. Build front and back faces by triangulating the outline, which works for concave shapes too.
3. Round off the edges: offset the outline inward by `bevelRadius` and add 4–6 rings along a quarter-circle profile.
4. Write edge curvature into vertex color R and a front/back/side mask into vertex color G for the shader to use.

**Material** (a transparent URP Lit Shader Graph):
- Base: the piece color (tint) at about 0.75 alpha.
- **Fake refraction:** sample the Opaque Texture (URP's `_CameraOpaqueTexture`) with screen UVs, offset by the view-space normal × 0.03, then multiply by the tint. This gives the glassy look without sorting problems.
- **Fresnel rim:** add `pow(1 - N·V, 3)` × a bright version of the tint.
- **Specular:** high smoothness (about 0.92), plus a reflection probe that reflects the world's sky.
- **Edge glint:** vertex color R (edge curvature) × 0.4 added to the output color, which catches bloom on the beveled edges.
- **Inner glow:** a subtle radial gradient from the piece's center for a subsurface-like look.
- **States** controlled by material properties: `_Ghost` (desaturated, 0.4 alpha), `_Invalid` (red wash), `_Inactive` (grey, for the tray), `_Crack` (0–1, blends in a crack-line texture on breakable pieces), `_TimerPulse`.

Because the physics keeps pieces from overlapping in 2D, transparent pieces seldom overlap on screen, so sorting problems stay small. Draw them after the water with depth write on.

### 6.3 Rocks and basin
- **Rocks** use the same extrusion pipeline with a large bevel (0.2–0.3) and a stone material (triplanar texture, slight moss or wetness darkening below y = water + 0.05). Their collision shape is the same outline without the bevel.
- **Basin:** a separately modeled round stone bowl (built in Blender or ProBuilder) with the water plane inset just below the rim. Bake ambient occlusion with the Unity Compute Light Baker, since the scene is static apart from the pieces.

### 6.4 Water
1. **Planar reflection:** a script mirrors the main camera across the water plane and renders the pieces, rocks, and sky layers into a half-resolution render texture before the main camera renders. Use an oblique near-clip plane so nothing underwater shows up in the reflection. Update it every frame; reflecting the moving pieces is the whole point.
2. **Surface shader:** two scrolling normal maps, low strength so the surface stays calm, distort the reflection UVs. Blend `lerp(depthTint, reflection, fresnel)`. Draw a soft foam line where the scene depth is close to the water surface, which is where rocks and pieces cross it.
3. **Ripples:** a 256² height-field simulation in a compute or blit shader. Splashes and pieces touching the rim inject impulses, and the resulting normals feed into the distortion.
4. **Splash:** a burst of droplet particles, a short-lived ring decal, and a sound effect.

### 6.5 Background and atmosphere
- Layers from back to front: a vertical sky gradient (from the `WorldTheme`), a blurred cloud or bokeh texture with slow parallax drift, far soft shapes (for example, distant hills or light shafts, depending on the theme), then the basin.
- **Post-processing Volume:** Bloom (threshold about 1.0, intensity 0.6, slight scatter), Tonemapping (Neutral, to keep colors pastel), a soft Vignette (0.2), and slight Color Adjustments per world.
- **Lighting:** one soft directional light (with soft shadows, since pieces cast shadows on the rocks), ambient light from the sky gradient, and one reflection probe per world, baked from the background.
- **Placeholder themes** until checked against footage: A = clear daytime blue and white, B = warm golden hour, C = purple dusk, D = deep blue night with glowing accents.

### 6.6 UI (UI Toolkit)
- Screens: Title → World Select (4 large frosted tiles showing the lock threshold) → Level Select (a 5×5 grid of stone tiles showing the level number, reward markers, and a challenge icon) → in-game HUD → pause menu.
- Use `backdrop-filter: blur()` on panels and `drop-shadow` on buttons. Use a rounded, friendly font. Reward points are small glowing circles.
- HUD: the tray, a timer or height meter when a challenge needs it, and the countdown digits. Keep everything else off the screen.

### 6.7 Audio
- A slow ambient track for each world, looped with crossfades.
- Impact sounds scaled by collision impulse (a soft glass clink with random pitch), with a limit of about 12 voices.
- Sounds for crack and shatter, splash, countdown ticks, the success chime, and menu movement.

---

## 7. Level Authoring Tools
- **`LevelEditorWindow`** (a custom editor window): place rocks from a palette, set the piece queue by drag and drop, and choose the challenge type. There's a **"Test Play"** button that runs the level in the Scene view.
- **Piece outline editor:** edit line segments and arcs with Scene-view handles, preview the convex split live, and rebuild the mesh with one click.
- **Solution recorder:** saves every placement (piece, position, angle, frame number) during a playthrough into `referenceSolution`.
- Draw the physics shapes in the Game view using the built-in debug drawing, which you can toggle with F1.

---

## 8. Testing and Tuning
- **Automated solvability:** replay every level's `referenceSolution` in a headless Play Mode test and assert it succeeds. Box2D v3's determinism makes this dependable for regression testing after physics tuning.
- **Tuning knobs** to expose in one `PhysicsTuning` asset: gravity, friction per material pair, linear and angular sleep thresholds, substeps, and piece density. Round pieces are the hardest part, so add some rolling resistance (angular damping about 0.2) so they don't roll forever.
- **Game-feel tests:** release-to-rest time, drift in tall stacks after 30 seconds (should be 0 mm once pieces sleep), and how forgiving input is when you turn a piece right at the edge of a rock.
- **Performance target:** 60 fps on integrated graphics at 1080p. The main costs are the reflection pass and MSAA, and both can be scaled.

---

## 9. Milestones

| # | Milestone | Content | Est. |
|---|---|---|---|
| 1 | **Physics spike** | Compare both backends: 12-piece stacks, circles on slopes, drift measurements. Choose the backend and set up `IBalancePhysics`. | 1 wk |
| 2 | **Main loop, grey boxes** | Tray, holding/turning/placing, overlap check, water loss, 3-second countdown win, restart | 1.5 wk |
| 3 | **Data and tools** | Piece and level ScriptableObjects, mesh builder, level editor, solution recorder | 1.5 wk |
| 4 | **Piece and rock visuals** | Piece shader with every state, bevels, rock material, basin | 1.5 wk |
| 5 | **Water and atmosphere** | Planar reflection, ripples, splash, sky layers, post-processing, per-world themes | 2 wk |
| 6 | **Advanced mechanics** | Support graph, breakable and timed breakable pieces, Height, Time limit, and Sway with buoyancy | 1.5 wk |
| 7 | **Menus and progress** | UI Toolkit screens, reward points, unlocks, save system, tutorials | 1.5 wk |
| 8 | **Content** | 100 levels (25 per world), difficulty curve, reference solutions | 3–4 wk |
| 9 | **Polish** | Audio, game feel, performance, accessibility (remapping, colorblind-friendly piece markings) | 1.5 wk |

**Vertical slice goal (end of milestone 5):** World A levels 1–5 fully playable at final visual quality.

---

## 10. Stretch Goals
- Two-player co-op with two cursors. Pieces are shared, and each player can hold one at a time.
- Versus mode: split screen with the same random levels from one world, and the first to solve wins the round (best of 5, 7, or 9).
- Replays you can share, using deterministic solution playback.

---

## 11. Main Risks
| Risk | Mitigation |
|---|---|
| Stacks jitter or creep | Box2D v3, 120 Hz steps with substeps, sleep tuning, the week-1 physics spike |
| Physics Core 2D API changes or gaps | Keep the backend interface; `Rigidbody2D` is a working fallback |
| Planar reflection cost | Half-resolution render texture, reflect only certain layers, lower resolution on low-end hardware |
| Transparent sorting glitches | Refraction through the opaque texture, depth write on pieces, pieces don't overlap in 2D |
| Hidden state from Fast Enter Play Mode | No mutable statics, `[AutoStaticsCleanup]`, Project Auditor checks |
| Breakable rules differ from the original | Rule settings you can switch per world, checked against footage |
```
