Below is the complete implementation plan as a markdown deliverable. Since I can't write files in this environment, the document is delivered inline — you can copy it directly into a `.md` file (e.g., `IMPLEMENTATION_PLAN.md`) in your project.

---

# Art of Balance Clone — Unity 6.6 Implementation Plan

**Version:** 1.0
**Target Engine:** Unity 6000.6 (Unity 6.6)
**Genre:** Physics-based stacking puzzle
**Reference Title:** *Art of Balance* (Shin'en Multimedia, WiiWare, 2010)
**Deliverable Type:** Implementation & Production Plan

---

**1. Executive Summary**

This plan describes how to rebuild the core experience of *Art of Balance* from scratch in Unity 6.6. The original is a deceptively simple game: the player is handed a queue of rigid shapes (planks, spheres, triangles, cylinders, glass panes, gravity-inverting blocks) and must place all of them onto a small stone base floating in a bowl of water. After the last block is placed, the entire construction must remain stable for a countdown of a few seconds without anything toppling into the water. The appeal comes from three pillars: **tight, intuitive controls** (pointer-driven pick/rotate/place with 45° rotation steps), **readable and predictable physics**, and a **serene, polished "zen" presentation** — glossy wood and stone materials, a softly lit water vessel, caustics, bloom, depth of field, and gentle camera work.

The clone will replicate: the main gameplay loop (level intro → block placement → balance countdown → result), the full block taxonomy including breakable glass and anti-gravity blocks, the world/level structure (the original ships with ~100 levels across 8 themed worlds; later ports expanded this to 200), the Endurance mode (play levels back-to-back with only three retries), and the signature visual style (3D-rendered objects with gameplay constrained to a 2D plane).

The plan deliberately targets **Unity 6.6 features** where they add value: the Universal Render Pipeline (URP) with Shader Graph for the water and glass materials, the new **Unity Compute Light Baker** for high-quality baked lighting, **Adaptive Probe Volumes** for ambient lighting on dynamic blocks, core-packaged **Cinemachine** for camera choreography, the **Input System** package (including gamepad haptics/rumble) for pointer, gamepad, and touch control schemes, **UI Toolkit** for menus and HUD, and **Addressables 4.0 with the new Content Directory build system** for level/asset streaming.

---

**2. Source Material Analysis — What We Are Recreating**

**2.1 Core Rules of the Original Game**

Before building anything, the rules of the WiiWare original must be pinned down precisely, because the entire codebase will be parameterized around them:

* Each level presents a fixed **stone base platform** sitting above (or floating in) a vessel of water, plus a **queue of 4–7 blocks** shown along the top/side of the screen.
* The player **picks up one block at a time** with a pointer, drags it into position, **rotates it in 45° increments**, and releases it. Once released, a block cannot be picked up again (in the WiiWare original; a small "grab again" grace window is a recommended quality-of-life addition, configurable per level).
* **All blocks from the queue must be used.** Blocks may hang over edges as long as the physics keeps them from falling.
* If **any block touches the water** (or falls out of the play area), the level fails immediately and restarts.
* After the final block is released, a **stability countdown (~3 seconds)** begins. If nothing falls during the countdown, the level is won. If the structure shifts and drops a block during the countdown, the level fails.
* Later worlds introduce special blocks: **glass blocks** that crack and shatter if too much weight rests on them, and **anti-gravity blocks** that reverse gravity for the whole structure the moment they are released (the final world is built around this mechanic).

**2.2 Content Structure of the Original**

* **Arcade mode:** ~100 levels in the WiiWare version, organized into 8 worlds labeled A–H (each with its own visual theme and a progressive introduction of mechanics — plain shapes first, then glass, then gravity inversion in the final world). Later ports grew this to 200 levels; the clone's architecture should be **data-driven** so level count is content, not code.
* **Endurance mode:** levels played back-to-back without interruption, with only **three retries** for the entire run. Score accumulates; the run ends when retries are exhausted.
* **Multiplayer (ports):** split-screen and online competitive modes exist in the Switch/Wii U versions. These are listed as **stretch goals** only — out of scope for the first release, but the architecture must not preclude them.

**2.3 Visual Signature**

The look is a "3D diorama in a glass": a shallow, water-filled vessel (bowl/tank) rendered in close-up, with a stone pedestal rising out of it. Materials are glossy and tactile — varnished wood, marble, granite, frosted glass. Lighting is warm and directional with soft shadows, visible **caustics** on the base and vessel floor, gentle **bloom**, subtle **depth of field** toward the vessel edges, and slow ambient camera drift. Water ripples react to impacts; splash particles and droplets appear when a block hits the surface (the failure moment). Blocks rest on a flat plane — gameplay is **2.5D**: full 3D rendering, but all physics motion is confined to the X/Y plane with rotation around the view axis only.

---

**3. Project Setup and Technology Decisions (Unity 6.6)**

**3.1 Project Configuration**

* **Template:** Start from the Unity 6 **Universal 3D** template (URP). URP is the right choice over HDRP: the target hardware profile is modest (the reference is a WiiWare title), and URP gives us Shader Graph, Adaptive Probe Volumes, and a render-graph-based custom post pipeline with far less performance overhead.
* **Unity version:** Pin the project to a Unity 6000.6 LTS patch release. Relevant 6.6 capabilities we will use:
  * **Unity Compute Light Baker** (new in 6.6) as the default light baker for the vessel/environment scenes — more accurate baked GI and APV data than the deprecated Progressive CPU baker.
  * **Shader Graph particle support for URP** (new in 6.6) for splash, droplet, and glass-shatter effects — particles can now use fully custom shader graphs without Custom Function workarounds.
  * **Core-packaged Cinemachine** for the camera system (no separate package install needed in 6.6).
  * **Content Directory builds via Addressables 4.0** for packaging level assets — this replaces AssetBundles in 6.6, with automatic asset de-duplication and lower memory overhead.
  * **UI Toolkit** as the single UI framework (menus, HUD, results screens).
  * **Input System package** with its **Gamepad Haptics API** (`Gamepad.SetMotorSpeeds`) for placement feedback rumble.
* **Physics:** Use **Unity's built-in 2D physics (Box2D via Rigidbody2D/Collider2D)** driving invisible 2D colliders, with 3D meshes parented to the physics bodies purely as visuals. Rationale: gameplay is planar; 2D physics is dramatically more stable and tunable for stacking than full 3D rigidbodies (no unwanted Z-axis escape, no torsional noise), and Box2D's solver can be tuned (velocity/position iterations, sleep thresholds, contact slop) specifically for tall-stack stability. Configure **Physics2D project settings**: higher solver iteration counts (e.g., 8–16 velocity, 4–8 position), generous sleep thresholds, and `Continuous` collision detection on the held block only.
* **Fixed timestep:** 120 Hz physics (`Time.fixedDeltaTime = 1/120`) for stacking fidelity — cheap for this scene complexity and noticeably improves tall-tower stability. Keep rendering at display refresh.

**3.2 Project Folder Layout**

```text
Assets/
  Art/
    Materials/        # URP Shader Graph materials (wood, stone, glass, water)
    Models/           # Block meshes, vessel, pedestal, backdrops
    Textures/         # PBR maps, caustics cookies, UI art
    VFX/              # Splash, droplets, shatter, ambient particles
  Audio/
    Music/            # Ambient loops per world
    SFX/              # Pickup, rotate tick, place, thud, crack, shatter, splash
  Settings/
    URP/              # Pipeline assets per quality tier, renderers
    Input/            # Input Actions asset
  Scripts/
    Core/             # Game state machine, scene flow, save system
    Gameplay/         # Blocks, stacking, stability detection, water kills
    Blocks/           # Block definitions and special behaviors
    Level/            # Level data, loader, world definitions
    Camera/           # Cinemachine rig controllers
    UI/               # UI Toolkit controllers
    VFX/              # Effect spawners
    Audio/            # Audio manager
  Data/
    Blocks/           # BlockDefinition ScriptableObjects
    Levels/           # LevelData ScriptableObjects (addressed)
    Worlds/           # WorldDefinition ScriptableObjects
  Scenes/
    Bootstrap, MainMenu, Level (single shared gameplay scene), Endurance
```

---

**4. Architecture Overview**

The game is built around a small, explicit state machine and a fully data-driven content model.

**4.1 Runtime State Machine**

```text
Bootstrap → MainMenu → LevelIntro → Placing ⇄ (Paused)
                                   → Balancing → LevelComplete
                                   → Failed (splash) → Retry
              MainMenu → Endurance (loops Placing/Balancing with retry budget)
```

* `Placing`: the player manipulates the current block from the queue.
* `Balancing`: triggered when the queue is empty; runs the stability countdown.
* `Failed`: triggered by a water-contact event at any time.
* `Endurance`: wraps the normal level flow, injecting a shared retry counter and score accumulator.

Implement as a plain C# state machine (no visual tooling needed) with events (`OnStateEnter/Exit`) consumed by UI, audio, and camera systems.

**4.2 Data-Driven Content Model**

* `BlockDefinition` (ScriptableObject): mesh, material variant, collider shape(s), mass, friction, **breakable properties** (load threshold, crack stages), **gravity-inversion flag**, grab/rotation rules.
* `LevelData` (ScriptableObject): pedestal variant, ordered list of `BlockDefinition`s for the queue, water level height, optional world overrides (gravity scale, countdown duration), par time (for score), background/environment variant.
* `WorldDefinition`: themed environment, material set, music, ordered `LevelData` references, unlock requirements.
* Levels are addressed through **Addressables with the 6.6 Content Directory schema**, so adding worlds never requires code changes.

**4.3 Key Runtime Components**

* `BlockController` — owns the 2D rigidbody state, special behavior hooks, visual crack-stage switching, and water-contact reporting.
* `PlacementController` — the "hand": picks the next queued block, follows the pointer, applies 45° rotation steps, ghost-preview, validity feedback, and release.
* `StackStabilityMonitor` — the win-condition brain (see §6).
* `WaterVolume` — trigger-based kill surface plus ripple/splash spawner.
* `LevelManager` — spawns pedestal/queue, sequences the state machine, handles retry/restart.
* `EnduranceManager` — retry budget, score, level sequencing.

---

**5. Controls and the Placement Interaction**

The feel of the original comes from its directness — the block is glued to the pointer until released. This must be recreated faithfully across input devices.

**5.1 Input System Setup**

Define one `Input Actions` asset with three control schemes:

* **Pointer scheme (mouse / touch):** pointer position → world-space plane projection; primary button = grab/release; secondary (right-click / two-finger tap or on-screen button) = rotate 45°; modifier or second button = rotate the other direction.
* **Gamepad scheme:** left stick moves the held block on the gameplay plane with analog speed, right stick or shoulder buttons rotate in 45° steps, face button releases. Use the 6.6-supported **gamepad haptics** (`Gamepad.SetMotorSpeeds`) for subtle rumble ticks on rotation and a soft pulse on valid placement.

**5.2 Placement Behavior**

* The held block's **Rigidbody2D is kinematic** while held and follows the pointer with critically damped smoothing (never 1:1 snapping — a tiny lag sells weight and prevents solver pops).
* **Rotation snaps to 45° increments** with a short eased tween (~80 ms) and an audible/physical "tick" per step.
* A **ghost silhouette** shows where the block will land, tinted green when the release is valid (not intersecting the pedestal/water/no-go volumes) and red when invalid. Invalid releases are refused (block stays in hand) rather than punished.
* **Contact pre-warming:** before release, run a short `Physics2D.Simulate` probe on an isolated scene copy, or simpler — cast overlap checks — to predict immediate interpenetration and refuse releases that would cause explosive solver responses.
* On release: body becomes dynamic, gets zero initial velocity, and the game enters a short "settle watch" before enabling the next queue item (~0.4 s).

**5.3 The 2.5D Constraint**

All gameplay happens on the X/Y plane at a fixed Z. 2D physics enforces this naturally; additionally: the camera looks at the plane at a slight low angle (see §8), and the 3D block meshes are authored with flat depth so silhouettes read perfectly. Because blocks are 3D meshes with 2D colliders, author each block with a matching collider set (box, circle, polygon for triangles/L-shapes) and keep the collider shapes conservative (2–4% shrink) to avoid interpenetration jitter at rest.

---

**6. Physics: Stacking, Stability Detection, and Special Blocks**

**6.1 Stable Stacking with Box2D**

The win condition of the genre lives and dies by whether resting stacks feel solid. Concrete tuning steps:

* High solver iterations (8–16 velocity / 4–8 position) and 120 Hz fixed step.
* `Physics2D.bounceThreshold` lowered so micro-bounces don't accumulate.
* Enable **sleeping aggressively** — sleeping bodies in a stack don't jitter. Tune `Rigidbody2D.sleepThreshold` via the Physics2D settings; consider a custom "sleep assist" that forces `Sleep()` on blocks whose linear and angular velocity stay below epsilon for N frames.
* Friction: wood-on-stone around 0.6–0.8, spheres lower (0.3) so balls roll believably, glass slightly slick (0.4).
* Contact slop and the collider shrink described above work together to eliminate the "stack slowly creeps apart" artifact.
* Mass scale: give later/special blocks distinct masses — heavy stone blocks genuinely stabilize bases, light glass genuinely perches.

**6.2 Stability Countdown (the win check)**

The "remain stable for 3 seconds" rule needs an explicit definition, not just "nothing fell":

* When the last block is released, enter `Balancing` state with countdown $$T = 3\text{ s}$$.
* During the countdown, monitor every placed block: if any block's displacement from its post-settle position exceeds a threshold, or any block's velocity exceeds an epsilon for more than a few frames, that's fine **as long as nothing touches water** — the original only fails on water contact. So the countdown condition reduces to: **survive T seconds with zero water-contact events and all blocks still above the water line.** Implement `WaterVolume` as the single source of truth for failure; the countdown is purely a timer over that invariant.
* Show the countdown as the subtle "balance bar"/timer UI the original uses (a thin ring or bar draining over 3 s), with a soft ticking sound accelerating toward success.

**6.3 Breakable Glass Blocks**

* Each glass block tracks accumulated load: sum of contact impulse magnitudes over a rolling window, approximating $$L(t) = \sum_{c} \frac{|J_c|}{\Delta t}$$ over recent collisions. When the sustained load exceeds the block's threshold for a dwell time (~0.5 s), advance a **crack stage** (material swap / decal overlay: pristine → hairline → fractured) and raise the failure counter; at the final stage the block shatters: disable its collider, spawn a **Shader-Graph-driven glass-shard particle burst** (URP particle shader graphs are natively supported in 6.6), play the shatter SFX, and let the now-unsupported structure fall — almost certainly into the water, ending the level. The drama is the point.
* Visuals: frosted/transparent glass material via URP's transparent Lit path or a custom Shader Graph (fresnel rim + depth-based opacity + subtle refraction distortion via the scene color texture).

**6.4 Anti-Gravity Blocks (final world mechanic)**

* On release of a gravity-inversion block, flip `Physics2D.gravity.y` sign **globally for the level** with a tweened transition over ~0.6 s so the player reads the change, paired with a camera-roll micro-animation (Cinemachine impulse) and an audio whoosh. Blocks then "fall upward" and must be stacked against the inverted pull; the pedestal in these levels is on the ceiling side or the base is sticky. Water contact logic inverts accordingly (the water plane is still the kill surface — in gravity-flip levels, design the vessel so failure is clearly readable).
* Represent gravity state in a `GravityDirector` component so multiple inversions per level (possible in late levels) are handled cleanly and VFX/UI can subscribe to flip events.

**6.5 Water Kill Volume**

* A 2D trigger collider at the water surface reports any block collider crossing it. On trigger: spawn splash particles + droplets at the contact point (particle shader graph), apply a ripple impulse to the water shader (see §7), muffle audio momentarily (low-pass filter dip), play the fail sting, and transition to `Failed`.
* One subtlety from the original: blocks that merely **graze** the surface while still supported shouldn't always fail — make the trigger a few centimeters *below* the visual surface so only genuinely lost blocks count.

---

**7. Recreating the Visuals**

This is where the clone earns the comparison. Target the original's "polished diorama" look, not photorealism.

**7.1 Scene Composition**

* **The vessel:** a glass bowl / shallow tank model with a water surface plane inside it, sitting on a subtle reflective surface or soft gradient void (world-dependent). The stone pedestal rises from the vessel floor through the waterline.
* **Camera:** fixed gameplay camera with slight low-angle perspective (FOV ~30–35° for a compressed, diorama feel), Cinemachine-driven with: slow ambient drift (Perlin-noise position noise at tiny amplitude), a subtle push-in during `Balancing`, a shake impulse on failures, and intro/outro framing per level. Cinemachine being a core package in 6.6 keeps the setup dependency-free.
* **Aspect safety:** the original runs 16:9; frame compositions so the pedestal + tallest legal stack fits within the 4:3-safe center for potential portrait/handheld ports.

**7.2 Materials (URP Shader Graph)**

* **Wood planks:** varnished wood — albedo/normal/roughness maps, warm tint, low roughness (0.25–0.4) for that glossy toy-like sheen, subtle clear-coat look approximated with a specular highlight band. Author ~4 grain variants to break repetition.
* **Stone/marble blocks & pedestal:** higher roughness variation, veining textures, slightly cool tint to contrast the wood.
* **Glass:** as in §6.3 — transparent with fresnel rim, tinted edges, crack-stage overlays driven by a material property (`_CrackStage` float) blended in the graph.
* **Anti-gravity blocks:** visually loud in the original — glowing core, emissive pulse. Use HDR emissive color into URP bloom so they pop, plus a subtle animated shader pattern (scrolling energy) to communicate "this one is special" before the player releases it.
* All dynamic objects receive ambient lighting from an **Adaptive Probe Volume** baked per environment with the new Unity Compute Light Baker, so blocks picked up into empty air stay correctly lit.

**7.3 The Water**

The water is the emotional centerpiece (it's the fail state), so invest here:

* **Surface shader (Shader Graph):** depth-based color gradient (transparent teal at edges, deeper blue at center using the scene depth texture), animated dual normal maps for gentle idle motion, fresnel specular from the key light, and screen-space reflection approximation via a low-res planar reflection or simply faked with a cubemap (URP-friendly choice for the target hardware).
* **Ripples:** a small ripple simulation — a render texture accumulating height impulses (classic "rain drop" ripple normal shader). `WaterVolume` writes impulse stamps where blocks splash and where the held block hovers low (pre-tension cue!). This is cheap and enormously characterful.
* **Caustics:** animated caustics texture projected onto the pedestal and vessel floor via a light cookie or a decal projector, scrolling two overlapping caustic patterns at different speeds — instantly reads as "underwater-adjacent" and matches the original's soft play of light.
* **Splashes:** particle systems using the new 6.6 URP-compatible particle shader graphs: a ring splash billboard, droplet sprites with stretch, and a brief foam patch decal that fades.

**7.4 Lighting and Post-Processing**

* One warm key directional light (soft shadows), one cool fill, baked environment GI via the Compute Light Baker + APV. Per-world lighting variations (dawn, dusk, night with accent spots) differentiate the 8 worlds cheaply.
* URP Volume stack: **Bloom** (threshold tuned so only glass rims and emissive gravity blocks bloom), **Depth of Field** (bokeh, focused on the pedestal mid-height — vessel edges softly blur), **Color Adjustments/tonemapping** (ACES) with per-world LUTs, subtle **Vignette**, **Film Grain** at very low intensity. Motion blur off (it muddies physics readability).
* Target 60 fps on modest hardware: single forward+ URP asset, shadow distance short, 2 cascades, soft shadows on key light only.

**7.5 World Theming**

Recreate the original's structure of themed worlds (A–H). Each world = same gameplay vessel geometry with swapped material sets, backdrop art, lighting scenario, music loop, and (from mid-game) new block types. Data-drive this via `WorldDefinition` so theming is pure content.

---

**8. UI/UX (UI Toolkit)**

* **Main menu:** Play (Arcade), Endurance, Settings, Extras — minimal, zen, slow water animation behind it (render the actual vessel scene as the menu backdrop).
* **Level select:** world tabs A–H, level grid with completion marks, unlocked progressively.
* **In-game HUD (diegetic-leaning, like the original):** the block queue shown as small previews along the top, the current block indicator, the balance countdown ring during `Balancing`, retry count in Endurance. No heavy chrome.
* **Pause/results:** time taken, blocks placed, score, retry/continue. Implement screens as UXML documents with USS themes; use one shared stylesheet to keep the zen typography consistent.

---

**9. Audio Direction**

* **Music:** sparse ambient loops per world (piano/mallet textures, long pads) — quiet enough that block sounds carry the rhythm.
* **SFX:** wood-on-wood clacks with pitch variation by impact impulse (map contact impulse → volume/pitch), rotate "tick" per 45° step, soft placement thud, glass creaks escalating with crack stage, shatter, splash (layered: plunge + droplets + ripple tail), gravity-flip whoosh, success chime, countdown ticks.
* **Mixing:** Unity AudioMixer snapshots per state (`Placing` dry, `Balancing` slightly ducked music, `Failed` low-pass dip on splash). Short SFX randomization containers (round-robin clips + pitch jitter) are essential — the same clack 200 times would destroy the zen.

---

**10. Game Modes Implementation**

* **Arcade:** sequential level progression, per-level completion + best time saved (JSON save file, cloud-agnostic).
* **Endurance:** randomized-but-seeded level sequence, three retries total, cumulative score (formula suggestion: base per block + time bonus, e.g. $$S = 100 \cdot n_{\text{blocks}} + \max(0,\ 50 \cdot (t_{\text{par}} - t))$$), escalating difficulty. Run summary screen at the end.
* **Stretch goals (post-1.0, architecture must allow):** local split-screen versus (two physics scenes side-by-side — feasible because each level is a self-contained prefab root) and online play via Unity Gaming Services. Keep all gameplay logic free of static singletons that assume one active level, specifically to keep this door open.

---

**11. Milestones and Roadmap**

**M0 — Greybox core loop (Weeks 1–2).** Empty URP project, single vessel blockout, pedestal, pointer placement with 45° rotation, Box2D stacking, water kill trigger, 3-second balance countdown, retry. No art. **Exit criteria:** 10 handmade test levels feel good to stack and the win/fail logic is bulletproof.

**M1 — Special blocks & tuning (Weeks 3–4).** Glass load/break system with crack stages, anti-gravity flip, sphere/triangle/cylinder collider tuning, physics iteration tuning, sleep-assist, invalid-release refusal, gamepad scheme + haptics. **Exit criteria:** mechanics complete; all block types shippable.

**M2 — Visual target (Weeks 5–7).** One world fully arted: block materials, water shader + ripples + splashes, caustics, lighting + Compute Light Baker + APV bake, post stack, Cinemachine rig with drift/shake/push-in, splash + shatter VFX with 6.6 particle shader graphs. **Exit criteria:** one level is screenshot-comparable to the reference game.

**M3 — Content production (Weeks 8–11).** `BlockDefinition`/`LevelData` pipeline, level editor tooling (simple in-Editor placement tool that serializes queue + pedestal config into `LevelData`), ~100 arcade levels across 8 themed worlds, difficulty curve review, audio production pass.

**M4 — Modes, UI, polish (Weeks 12–13).** Full UI Toolkit front end, Endurance mode, save system, settings (audio, quality tiers, control rebinds).

**M5 — Optimization & release prep (Week 14).** Profile with the 6.6 Profiler (GPU Resident Drawer reporting, frame screenshots), URP Settings Analyzer in Project Auditor to catch pipeline misconfigurations, Addressables **Content Directory** build, per-platform builds, playtest sweep. **Exit criteria:** 60 fps at target resolution on min-spec hardware, zero progression blockers.

---

**12. Testing and Quality Strategy**

* **Determinism harness:** because failure is physics-driven, build an automated replay tool that records placement inputs (position/rotation/time) per level and replays them headless to verify each shipped level is beatable — rerun after any physics-setting change. (Note: Box2D replays on the same platform/build are deterministic enough for this purpose.)
* **Soak tests:** scripted bots that place blocks at randomized valid positions to hunt for solver explosions, sleep deadlocks, and glass false-positives.
* **Difficulty verification:** telemetry hooks (even in dev) measuring retries per level to catch curve spikes before release.
* **Performance budget checks:** GPU Resident Drawer/Profiler review per world; splash + shatter VFX under worst-case (simultaneous events) load.

---

**13. Risk Register**

* **Physics feel mismatch** (biggest risk): Box2D stacking differs subtly from the original's custom feel. Mitigate via M0's extended tuning window and the replay harness so tuning changes are regression-safe.
* **Water shader cost** on low-end targets: keep the planar reflection optional per quality tier and the ripple sim resolution conservative (256²).
* **Glass-block frustration:** false shatters would feel unfair — mitigate with the dwell time, generous thresholds, and crack-stage audio/visual telegraphing so failure always feels earned.
* **Scope creep from multiplayer:** explicitly deferred; the content pipeline and scene isolation decisions protect it without building it.

---

**14. Summary**

The clone's DNA is: **Box2D-driven 2.5D physics at a 120 Hz fixed step for trustworthy stacking; a data-driven level system (ScriptableObjects + Addressables Content Directories) holding 100+ levels across 8 themed worlds; faithful recreation of the special-block roster (glass load-breaking, gravity inversion); the pointer/gamepad placement interaction with 45° rotation snapping; the water-contact fail rule plus 3-second stability countdown as the complete win/lose model; and a URP visual package — glossy materials, reactive water with ripples/caustics/splashes, Compute-Light-Baked lighting with APV, bloom/DOF/graded post — that reproduces the original's calm, polished diorama look.** Followed in milestone order, this plan delivers a playable greybox in two weeks, a visual target by week seven, and a content-complete clone by week fourteen.
