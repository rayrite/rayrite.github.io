# Cloning "Art of Balance" (WiiWare) in Unity 6.6 — Implementation Plan

**Goal:** Recreate the core experience of Shin'en Multimedia's *Art of Balance* (WiiWare, 2010) — a physics-based block-stacking puzzler — as an original clone built from scratch in Unity 6.6. Focus areas: (1) the main gameplay loop (stack all pieces, tower survives the countdown, nothing touches the water) and (2) the distinctive visual identity (a glass bowl of water in a calm, sunlit, "Frutiger Aero"-style interior, glossy water, soft lighting, zen presentation).

> **Legal note:** Build all assets from scratch (original block designs, music, SFX, UI). Recreate mechanics and *style*, not Shin'en's copyrighted assets, names, or level data.

---

## 1. What the Original Game Actually Is (Reference Breakdown)

### 1.1 Core gameplay loop (WiiWare original)
1. A **glass bowl of water** fills the lower half of the screen. Inside it sits one or more fixed **rock/stone platforms** of varying shape (flat, round, diagonal, small pegs, twin plinths).
2. The player is given a **set of pieces** (always ≥ 3). A tray at the bottom of the screen shows the pieces, but **only 3 are usable at a time** — the rest are whited out and unlock in order as pieces are placed. This forces solve-order thinking.
3. The player grabs a piece, moves it freely in the 2D play plane, and **rotates it in 45° steps** (8 orientations).
4. **Once placed, a piece cannot be moved again.** There is no undo — a mistake means restarting the level.
5. When the **last piece is placed**, a **3-second countdown** starts. If the tower is still standing and **no piece has touched the water** when it ends, the level is cleared.
6. **Any single piece touching the water = instant fail** and restart.

### 1.2 Content structure (WiiWare original)
- **Arcade Mode:** 4 worlds (A, B, C, D), 25 puzzles each = **100 levels**.
- Progression via earned **rings/circles**: 20 unlock World B, 40 unlock C, 60 unlock D. Normal levels award 1, challenge levels 2, world finals 3.
- **World gimmicks:**
  - **World A:** Plain stacking. Introduces shapes, narrow/round/diagonal platforms, multiple plinths.
  - **World B:** **Breakable (glass) blocks** — shatter when a *third* piece is placed on top of them (two is fine regardless of weight). Some puzzles *require* breaking them.
  - **World C:** **Timed breakable blocks** — start a fuse as soon as another block rests on them, then disintegrate. Plan where everything lands afterwards.
  - **World D:** Combines both breakable types plus the trickiest mixed-shape pieces.
- **Challenge levels** (orange, award extra rings):
  - **Time attack:** place all pieces within a time limit (the 3-second settle countdown is excluded).
  - **Height challenge:** the tower must reach a marked height line.
  - **Balance beam:** no rocks; all stacking happens on a pre-placed piece that **sways on a pivot** under load.
- **Versus mode ("Swift Stacker"):** 2 players race to solve the same randomly drawn puzzles from a chosen world; best of 5/7/9 rounds.

### 1.3 Visual identity (the part to nail)
- A **realistic glass bowl/aquarium of water**, rendered in real time: reflections, refraction, ripples when pieces fall in, splash particles.
- Blocks look like **polished wooden toy blocks** (later special blocks look like glass/crystal).
- Setting: a **quiet, sunlit interior** — soft daylight through a window, potted plants, blurred domestic background, warm color grade. Each world re-dresses the background (e.g., pink flowers, bamboo).
- Camera: mostly **static, slightly low three-quarter view** of the bowl, with subtle slow drift and gentle zoom that **pulls back as the tower grows taller**.
- Overall mood: zen, meditative, "spa screensaver" — soothing ambient music, realistic clinks and water sounds.
- Era-appropriate presentation = glossy surfaces, aqua/teal accents, depth of field, bloom ("Frutiger Aero" aesthetic).

### 1.4 Feel details that make it work
- Physics are **deterministic and consistent**: the same placement gives the same result. Players learn the system.
- The tension moment: the last piece placed, the tower wobbles, the countdown ticks.
- Max 3 selectable pieces keeps decision space small; piece *order* is the puzzle.
- Fast restarts, no punishment loops.

---

## 2. Tech Stack & Project Setup (Unity 6.6)

| Area | Choice | Why |
|---|---|---|
| Render pipeline | **Universal Render Pipeline (URP)** | Best perf/features balance; full control via Shader Graph for water/glass; matches Wii-era-to-modern visuals easily |
| Physics | **Built-in 3D PhysX**, simulation constrained to a 2D plane | The game reads as 2.5D; 3D rigidbodies with frozen Z give real stacking/torque behavior without custom physics |
| Input | **Input System package** | Pointer (mouse/touch) + gamepad parity; mirrors the original's Wii Remote pointer feel |
| Audio | Unity Audio + AudioMixer | Snapshots for menu/in-game/fail states |
| Data | **ScriptableObjects** for levels, pieces, worlds | Data-driven level pipeline, fast iteration |
| UI | **UI Toolkit** (or uGUI if preferred) | Level select maps, tray, HUD |
| Version control | Git + Git LFS | Art assets |
| Target platforms | PC first (mouse), then Switch-style handheld/touch optional | — |

**Project settings to lock early:**
- Color space: **Linear**.
- `Project Settings > Physics`: gravity `Y = -9.81` (tune later, possibly exaggerated ~ -14 for snappier falls); **solver iterations 12–16, solver velocity iterations 4–8** (stable stacks need more than default); default contact offset small (0.005–0.01); enable **adaptive force** off; fixed timestep 1/60, consider 1/120 if tall stacks jitter.
- Quality: 60 fps target, vsync on, fixed camera = cheap scene → spend budget on water, DOF, bloom, SSR-like tricks.

---

## 3. Architecture Overview

```
Assets/
  Scripts/
    Core/        GameBootstrap, SceneLoader, ServiceLocator (optional), SaveSystem
    Gameplay/    GameManager (state machine), LevelRunner, PieceController,
                 PieceTray, PlacementController, StabilityChecker,
                 WaterKillZone, BreakableBlock, TimedBlock, BalanceBeam,
                 HeightGoal, TimerChallenge
    Physics/     RigidbodyTuner, PhysicsSettingsAsset, SleepMonitor
    Camera/      CameraRig (framing, zoom-by-tower-height, idle drift)
    FX/          WaterSurface, RippleManager, SplashFX, CausticsProjector,
                 ShatterFX, PostFXController
    UI/          MainMenu, WorldMap, LevelSelect, HUD, TrayUI, ResultsScreen
    Audio/       AudioManager, MusicDirector, SFXLibrary
    Data/        (ScriptableObjects) PieceDef, LevelDef, WorldDef, GameConfig
  Art/
    Materials/   Wood variants, Glass, Stone, Water, Backgrounds
    Shaders/     Water.shadergraph, GlassBowl.shadergraph, Caustics.shadergraph
    Models/      Blocks/, Bowl/, Props/, Backgrounds/
    Textures/
  Audio/         Music/, SFX/
  Scenes/        Boot, MainMenu, Game, (optional) Versus
  Settings/      URP assets, Renderer features, Volume profiles
```

### 3.1 Core state machine (GameManager)
```
Boot → MainMenu → WorldMap/LevelSelect → LevelIntro → Playing
   Playing → (all pieces placed) → Settling(3s countdown) → Win → Results → next
   Playing/Settling → (piece touches water | timer expired) → Fail → quick restart
```
- **Quick restart is sacred:** fail → full level reset in < 1 second, no loading. Snapshot the initial state and re-instantiate rather than reloading the scene.

### 3.2 Data model (ScriptableObjects)
- `PieceDef`: mesh ref, collider ref, material, `BlockType` enum (`Normal`, `BreakableLoad`, `BreakableTimed`), mass, friction, display icon, unlock-order group.
- `LevelDef`: world ref, rock/platform layout (list of prefab + transform), ordered piece list, challenge modifier (`None`, `TimeLimit`, `HeightGoal`, `BalanceBeam`), challenge params, music/background refs, ring reward, tutorial flag (first level of each world).
- `WorldDef`: name, theme (background set, music track, accent color), 25 `LevelDef`s, unlock cost in rings.
- `GameConfig`: global tuning — settle countdown duration, max selectable pieces (3), rotation step (45°), kill-plane offset, physics overrides.

### 3.3 Save system
Simple JSON/binary: cleared levels, rings per world, best times, settings. Autosave on results screen.

---

## 4. Gameplay Implementation

### 4.1 The play field
- Everything lives on the **X/Y plane at Z = 0**. Bowl is a 3D shell around it (front glass at Z>0 is a separate, collider-free visual layer so it never interferes).
- **Rocks/platforms:** static colliders (`Rigidbody` kinematic or none). Provide a library of ~12 platform prefabs: peg, wide slab, sphere-top, diagonal wedge, twin pillars, V-notch, etc.
- **Water kill zone:** a trigger plane at the water surface Y. Any gameplay `Piece` entering it → splash FX + `Fail`. (Edge case from the original: judge "touching water" generously — a piece fully below the surface line, not a corner graze, to avoid cheap fails. Tune with a small negative offset.)
- Invisible side walls far outside the bowl are unnecessary — falling in water already ends the level.

### 4.2 Pieces: shapes, colliders, rotation
- Author **~20–25 piece meshes** as original designs in the spirit of the original's set: bars (1×2 … 1×5), squares, L/Z/T/S shapes, triangles, discs/cylinders, half-discs, crosses, barbells (thin bar + round ends), U-shapes, wedges. Model in Blender as low-poly with beveled edges (bevels matter for both highlights and stable resting).
- **Colliders:** prefer **compound primitive colliders** (boxes/capsules) over MeshColliders — dramatically more stable stacking in PhysX. Concave shapes (U, L) = 2–4 box colliders on child transforms.
- **PhysicsMaterial per type:** wood-on-wood high-ish friction (static ~0.7, dynamic ~0.6), round pieces lower friction so they roll menacingly, glass slightly slicker.
- **Rotation:** snap to **45° increments**, player-driven (Q/E, shoulder buttons, or scroll). Rotate around Z. Rotate the *ghost/preview* instantly; physics only starts on placement.
- Mass: scale roughly with volume; deliberately make round/tip-heavy pieces awkward via center-of-mass tweaks (`Rigidbody.centerOfMass`) where a shape needs extra personality.

### 4.3 Pickup, drag, place (the core interaction)
1. **Tray:** bottom of screen, shows remaining pieces as icons/3D ghosts; only the first 3 are lit and selectable; placed piece unlocks the next in queue.
2. **Grab:** click/tap a lit tray piece → spawns a **ghost preview** attached to the cursor in the play plane (semi-transparent, non-colliding, snapped to current rotation).
3. **Aim:** ghost follows pointer X/Y, clamped to the play bounds. Optional faint **drop guide** (vertical line / silhouette) showing where it would fall.
4. **Rotate:** 45° steps, with a tiny ease animation for juice.
5. **Place:** click again (or release, depending on scheme — see controls) → spawn the real `Rigidbody` piece at the ghost pose with zero velocity → it settles physically.
6. **No re-pickup.** The piece is live physics from that frame. This is the game's central tension — do not add undo.

Controls mapping (parity with the original's pointer-first design):
- **Mouse/touch:** point to move, click to grab/place, right-click or wheel to rotate. Touch: drag to move, on-screen rotate buttons or two-finger twist (snap to 45°).
- **Gamepad:** stick moves cursor, A grab/place, LB/RB rotate, Y quick-restart.

### 4.4 Win/fail detection — StabilityChecker
- Track all live pieces. **Fail** if any piece's collider enters the water trigger, or leaves a generous world-bounds box.
- **Win check** begins when the tray is empty: start a **3.0 s countdown** (configurable; later versions of the real game shortened it — expose in `GameConfig`). During countdown:
  - Any water contact → Fail immediately.
  - Optional "genuinely settled" assist: require all rigidbody velocities < epsilon for the final 0.5 s so a tower that is *obviously* mid-collapse fails honestly rather than squeaking a win on a technicality. (Playtest this — the original simply required "still standing," and honest physics is part of its charm.)
- Win → chime, rings fly to counter, results screen (time, rings, next/retry/menu).

### 4.5 Special block types
- **Breakable (World B):** component counts pieces resting on it (contact tracking with normal checks — only count contacts *above* it). Third supported piece → shatter: disable collider/render, spawn pre-fractured debris + glass SFX, debris is non-gameplay (fades or is ignored by StabilityChecker).
- **Timed breakable (World C):** first supporting contact starts a visible fuse (shader glow/pulse + ticking SFX, ~2–4 s), then disintegrates. Distinct read: hourglass motif, warm pulse.
- **Stretch goal (post-WiiWare flavor, optional):** gravity-flip blocks from later versions. Only after the base game is solid — it inverts fail logic and camera framing, so treat as a v2 feature.
- Visual language: special blocks are **transparent/crystal** with distinct outline colors; the player must read block type at a glance from tray icon *and* placed piece.

### 4.6 Challenge level variants
- **TimeLimit:** HUD countdown from level start (placing time only); expiry → fail. Pause the clock during the 3 s settle.
- **HeightGoal:** a faint horizontal marker line + flag; win requires tower apex ≥ line at end of settle.
- **BalanceBeam:** replaces rocks with a pivoting platform — implement as a `Rigidbody` on a `HingeJoint` (or custom constraint) with limited angular range and spring return, tuned to sway heavily under eccentric load. This is the most physics-sensitive level type — budget extra tuning time.

### 4.7 Physics stability strategy (critical — do early, tune constantly)
This genre lives or dies on trustworthy stacking. Plan for:
- Constrain all pieces: `Rigidbody.constraints = FreezePositionZ | FreezeRotationX | FreezeRotationY` — true 2.5D behavior, zero out-of-plane wobble.
- Increased solver iterations (see §2), `collisionDetectionMode = ContinuousSpeculative` on small/thin pieces to prevent tunneling, `sleepThreshold` raised slightly so towers actually rest.
- **Never** let the ghost overlap-check falsely reject legal placements — the original allows tight fits; validate placement loosely or not at all (physics resolves it).
- Determinism: fixed timestep, no `Time.deltaTime` in physics-adjacent logic, same-spawn-state restarts. Players must be able to reproduce a solution.
- Anti-jitter for tall stacks: small `Physics.defaultContactOffset`, beveled collider edges, optional "micro-sleep" — force `Sleep()` on pieces whose velocity stays < epsilon for N frames *before* the countdown (invisible to the player, kills phantom energy).

---

## 5. Visual Recreation (Primary Focus)

Target: a modern, higher-fidelity take on the Wii original's look — **sunlit room, glass bowl, living water, wooden toy blocks, soft depth of field, teal-and-aqua grade.** All URP + Shader Graph, no custom SRP needed.

### 5.1 Scene composition
- **Foreground:** glass bowl (modeled as a rounded aquarium tub, open top). Front wall of the bowl rendered as a **separate transparent layer** (refraction + fresnel, no collider).
- **Midground:** the play plane — water surface, rocks, pieces.
- **Background:** a dressed interior set per world — window with soft daylight, potted plants, shelf props, fabric; heavily blurred by DOF so it reads as mood, not detail. One master background set + re-dressing (color/prop swaps) per world keeps art cost sane: World A pink flowers / World B bamboo / etc.
- **Lighting rig:** one warm key directional ("sun through window") + soft fill + 1–2 rim/practical lights; baked ambient via a simple skybox/probe; light cookies for window-frame shadows on the table for that "slice of pleasant reality" feel.
- **Camera:** ~35–50 mm equivalent, slight low angle looking at the bowl, subtle idle drift (Perlin-noise position noise, amplitude ~1–2 cm) so the scene feels alive; **dynamic zoom** tied to tower height (smoothly pull back/raise to keep apex + margin in frame — the original's zoom behavior is a known UX trap; make it slow, eased, and *never* zoom during active cursor placement of a piece).

### 5.2 Water (the hero visual — budget the most shader time here)
Layered approach, all in Shader Graph:
1. **Surface plane** with:
   - Two scrolling normal maps (different scales/directions) for ambient motion.
   - **Gerstner-lite vertex ripple** (2–3 waves, tiny amplitude) so the silhouette moves.
   - **Fresnel blend** between deep-water color (teal) and sky/room reflection color.
   - **Reflections:** URP-friendly planar reflection probe (a `ReflectionProbe` won't map a plane; use a simple planar-reflection camera script rendering the background set + pieces to a `RenderTexture` once per frame at half res, or fake it with a mirrored-scene duplicate since the set is small and the camera fixed). Given the fixed camera, the **mirrored-duplicate trick** is cheap, stable, and looks great.
   - **Screen-space refraction** via URP's `_CameraOpaqueTexture` distortion (scene color UV offset by normal) — sold as "real water" by distortion + fresnel more than by reflections.
2. **Interactive ripples:** a `RenderTexture` ripple/height buffer (classic "water ripple" propagation pass or particle-injected normal splats). Block placement wobble, drips, and especially **fail splashes** write into it → rings radiate across the surface. This is the single most satisfying FX in the game.
3. **Splash on fail:** burst particle (droplets), a ring decal expanding on the surface, a dunk bubble trail for the sinking piece, muffle audio momentarily. Sinking pieces: keep simulating below surface with strong drag + buoyant-ish slow sink (they visibly drift down through the bowl glass — the original's "tumble into your own failure" moment).
4. **Volume below surface:** fog-colored glass + slight refraction on the bowl's front panel; submerged pieces tinted by a cheap "underwater" overlay (depth-based color lerp).

### 5.3 Caustics & glass
- **Caustics:** animated caustic texture(s) projected onto rocks, submerged piece parts, and the bowl floor via a URP **Decal Projector** or light-function-style shader overlay, synced loosely to water motion. Sells "sun through water" instantly.
- **Glass bowl:** transparent PBR — smoothness 1, low alpha, fresnel edge highlights, refraction via opaque-texture distortion, plus a subtle **condensation/specular streak** texture for tactility. Render order: bowl back → water → pieces → bowl front.
- **Glass/crystal special blocks:** same language as the bowl (transmission + fresnel + colored outline) so breakables read as fragile.

### 5.4 Materials & look-dev for blocks
- Wood: 2–3 tilable wood PBR sets (light beech, warm teak, painted accent) with beveled-edge normal detail; slight roughness variation so highlights roll across bevels.
- Keep silhouettes clean — in this game **readability of shape IS gameplay**. No noisy albedo on small pieces.
- Consistent texel density across pieces so a tower looks like one toy set.

### 5.5 Post-processing (URP Volume)
- **Bloom** (low threshold, soft) for window light and water sparkle.
- **Depth of Field** (bokeh): focus locked on the play plane; background always creamy-blurred. This one effect delivers ~50% of the original's mood.
- **Color grading:** slight teal-shadows/warm-highlights split tone, lifted blacks a touch; per-world LUT variants.
- Gentle **vignette**, subtle film grain (very low), SSAO (small radius) for contact grounding under pieces.
- **TAA or SMAA** — clean edges matter with thin pieces.

### 5.6 World theming
Per `WorldDef`: background set variant, music track, accent/UI color, water tint, grade LUT. Four themes for the four worlds; challenge levels can reuse the world set with an orange UI accent (mirrors the original's orange challenge nodes).

### 5.7 Menu look
The original's menus are as soothing as the game: soft-focus world dioramas behind clean white/aqua UI, gentle camera drift, ambient music throughout. Build the world-select as **nodes on a soft world backdrop** (the 3DS/Wii U versions use node maps; the WiiWare original is a simpler grid — either is fine, nodes are nicer) with ring counts gating worlds.

---

## 6. UI / UX
- **HUD (minimal, the original keeps the screen clean):** tray of pieces (bottom), remaining-pieces count, level ID, rings, challenge timer/height indicator when relevant, restart & pause buttons.
- **Settle countdown:** a calm but legible 3-2-1 treatment — ring timer around the tower apex or centered numeral; tension without panic.
- **Fail:** instant soft sting + "Piece fell!" → big **Restart** (and make R / one click do it — no menu diving).
- **Results:** rings earned animation, time, next-level button.
- **Tutorials:** first level of each world introduces its gimmick. Unlike the original (unskippable voiced tutorials — its most-criticized flaw), make yours **skippable and re-readable**.
- **Tray clarity:** whited-out locked pieces, clear "next up" affordance — the 3-piece limit must be visually obvious, never feel like a bug.

---

## 7. Audio Plan
- **Music:** one ambient/zen loop per world (piano/pads/light percussion, 90–120 s, seamless loop); menu theme. Crossfade on transitions. (Original-style: relaxing but faintly upbeat, "groovy but not distracting.")
- **SFX:** wood-on-wood clinks (3–5 variations, pitch-randomized by impact velocity), glass stress creaks (pre-break warning!), shatter, fuse tick, water drips, big splash + underwater muffle for fails, UI ticks, win chime, countdown ticks.
- Use AudioMixer snapshots: dry in-game; low-pass "underwater" on fail splash; ducked music under countdown.

---

## 8. Game Modes & Progression
- **Arcade:** 4 worlds × 25 levels, ring-gated (20/40/60), challenge levels interleaved, world-final 3-ring levels. Ship target for a clone: all 100 original-structure levels *or* a strong 40–60 with a level editor pipeline that makes reaching 100 cheap.
- **Endurance (unlock after World B):** random cleared levels back-to-back, 3 lives, score = levels × speed; local leaderboard.
- **Versus (Swift Stacker):** local split-screen or shared-screen turn race — two players, same random level from a chosen world, first to clear scores; best of 5/7/9. (Implement after core loop; it reuses everything.)

---

## 9. Level Design Pipeline
1. **Authoring:** a Unity **editor window / custom inspector** for `LevelDef`: drag platform prefabs into a layout list, order the piece queue, set challenge params, one-click "Play this level" from the editor.
2. **Validation tooling:** an editor "sanity check" that auto-drops pieces from a rest pose to detect impossible starts (overlapping spawns, platforms with no support), plus a **headless playtest bot** later (scripted placements from known solutions to regression-test physics changes — *essential* once you tune physics, since a solver-iteration change can silently break designed solutions).
3. **Difficulty curve blueprint:** World A teaches shapes & platforms (flat → round → diagonal → multi-plinth); B = breakables; C = timed; D = everything + nasty shapes. ~5 levels per new idea: introduce → use → combine → twist → master.

---

## 10. Production Milestones

| # | Milestone | Scope | Exit criteria |
|---|---|---|---|
| 1 | **Physics sandbox** (1–2 wks) | Greybox bowl, 8 block shapes, grab/rotate(45°)/place, water kill, 3 s settle win/fail, quick restart | 10-minute play sessions feel *fair*; towers behave predictably |
| 2 | **Core loop vertical slice** (2 wks) | Tray (3-piece rule), 10 World-A-style levels, win/fail/results flow, save, HUD | Full loop playable start→finish |
| 3 | **Visual slice** (3–4 wks) | URP water (surface+refraction+ripples), glass bowl, caustics, one dressed background, DOF/bloom/grade, wood materials | Still screenshots are near-indistinguishable in *mood* from the reference |
| 4 | **Splash & FX pass** (1 wk) | Fail splash, sinking pieces, shatter FX, countdown polish | Fail feels dramatic, win feels earned |
| 5 | **World systems** (3 wks) | Breakables, timed blocks, challenge variants (time/height/beam), world map + rings gating | One full world of each type playable |
| 6 | **Content production** (4–6 wks) | ~60–100 levels via editor tooling, 4 world themes, all block shapes | Arcade complete |
| 7 | **Audio pass** (1–2 wks) | Music, full SFX set, mixer snapshots | — |
| 8 | **Modes** (2 wks) | Endurance, local Versus | — |
| 9 | **Polish & perf** (2 wks) | 60 fps lock, input feel, tutorials, playtest bot regression run | Ship candidate |

*(Part-time solo dev ≈ 5–7 months; a focused prototype of milestones 1–3 alone is a great 4–6 week project.)*

---

## 11. Risk Register

| Risk | Mitigation |
|---|---|
| PhysX stacking jitter/unfair collapses | Milestone 1 exists solely for this; high solver iterations, primitive colliders, micro-sleep, fixed timestep; playtest bot |
| Water shader eats perf/complexity | Fixed camera → planar reflections via mirrored scene; half-res ripple RT; everything else is stock URP |
| Scope (100 levels) | Data-driven editor tooling from day 1; ship 4 worlds × fewer levels rather than cutting worlds |
| "Feels off" vs. original | Keep a reference footage folder; weekly side-by-side comparison of splash, zoom, countdown, tray behavior |
| Camera zoom disrupting placement (known flaw in later versions) | Never move the camera while a ghost piece is being aimed |
| Tutorial friction (the original's worst-reviewed flaw) | Skippable, text-light, in-world tutorials |

---

## 12. Definition of Done (v1.0)
- Arcade: 4 worlds, ≥ 60 levels, all WiiWare-era mechanics (3-piece tray, 45° rotation, no-repick, 3 s settle, breakables, timed blocks, time/height/beam challenges, ring gating).
- Visual bar: interactive water (ripples + splashes + refraction), glass bowl, caustics, per-world sunlit backgrounds, DOF/bloom/grade at 60 fps on a mid-range PC.
- Feel bar: deterministic physics, < 1 s restart, skippable tutorials.
- Modes: Arcade + Endurance; local Versus if schedule holds.
- All art/audio original or properly licensed.
