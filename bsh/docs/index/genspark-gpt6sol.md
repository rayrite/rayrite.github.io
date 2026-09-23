I can’t write files directly from this chat, so I’ve prepared four **separate, ready-to-save Markdown deliverables** below. The plan targets the **original 2010 WiiWare release**, not the later Wii U, Switch, or *TOUCH!* versions.

### `01-gameplay-and-reference-spec.md`

```markdown
# Art of Balance–inspired game: gameplay and reference specification

## 1. Target and scope

Build a single-player, physics-based stacking puzzle game in Unity 6.6 that recreates the **visual composition and main gameplay loop of the original WiiWare Art of Balance**. Treat it as a reference-driven implementation, not a source of reusable artwork, music, levels, or branding.

The original WiiWare game has **100 levels across four worlds**, a main Arcade mode, optional two-player cooperative play, and split-screen Versus. Its shapes include ordinary pieces and two special types that break under load or after a timer expires. Later releases advertise different level counts and modes; do not use those as the WiiWare specification. [Original WiiWare listing](https://www.nintendolife.com/games/wiiware/art_of_balance)

### Priority order

1. A satisfying **select → rotate → position → drop → observe → retry/succeed** loop.
2. A recognizable composition: chunky shapes above a narrow stone support, water beneath, serene decorative environment, unobtrusive challenge HUD.
3. Reliable, readable physics and fair win/loss judgments.
4. Level variety and progression.
5. Optional co-op and Versus, after the single-player game feels finished.

## 2. Reference facts versus design decisions

| Area | Observed in the WiiWare release | Implementation decision |
|---|---|---|
| Objective | Place the supplied shapes in a balanced stack without any falling into the water. | Every required shape must be placed; any required shape crossing the water-loss boundary fails the attempt. |
| Controls | Point at a shape, select it, rotate with the D-pad, move it into place, press again to drop. The camera can zoom toward the action. | Mouse/gamepad first; provide a virtual pointer or direct-selection alternative. Preserve the **deliberate click-to-drop** feel. |
| Completion | After the final placement, survive **three seconds**, shown with three lights. | Run a three-second stabilization check; light one indicator per elapsed second. |
| Challenges | Normal levels plus challenges involving time and height; a contemporary preview also mentions medal-gated worlds. | Define challenge objectives as data, and verify exact “Balance Challenge” scoring before claiming a faithful reproduction. |
| Special pieces | Pieces that break under excessive load or after another piece is placed on top and a timer expires. | Implement both as configurable, visually telegraphed piece behaviors. |
| Modes | Arcade, drop-in two-player co-op, and two-player split-screen Versus. | Ship Arcade first; consider local multiplayer a separate milestone. |

Sources: [2010 review](https://www.nintendolife.com/reviews/2010/02/art_of_balance), [2010 hands-on preview](https://www.nintendolife.com/news/2010/01/first_impressions_art_of_balance), [original WiiWare listing](https://www.nintendolife.com/games/wiiware/art_of_balance).

## 3. Player-facing loop

### Level flow

1. **Level intro:** Show world, level number, objective, and any special-piece icons. Frame the support and water immediately.
2. **Choose a shape:** Select one from a visible reserve. The selected shape becomes a movable preview above the stack; its reserve slot remains marked.
3. **Aim and rotate:** Move horizontally and vertically within a legal staging area. Rotate in predictable increments. Display a crisp silhouette and a landing guide, but do **not** promise a stable landing.
4. **Drop:** Commit the shape. Remove player control, enable simulation, and let the stack react.
5. **Observe:** The player can select the next piece while previously placed pieces settle. Give conspicuous feedback for impending slips and special-piece activation.
6. **Resolve:**
   - If a required shape touches the loss region or a challenge deadline expires, freeze the result, play a brief splash/collapse beat, then offer instant retry.
   - Once every required piece has been dropped and all objective conditions are met, start the three-second survival indicator.
   - If any failure occurs during those three seconds, fail. Otherwise, award completion, update progression, and offer Next Level.
7. **Retry:** Reset the entire level deterministically to its initial authored state. A retry must be faster than returning to the world map.

### State machine

`Loading → Intro → Aiming → DropCommitted → Playing → Validating → Success`

From `DropCommitted`, `Playing`, or `Validating`, a failure transitions to `Failed → Resetting → Aiming`.

Pause is an overlay state. During pause, simulation and challenge clocks stop together. An already-earned success is final: late splash effects must not overturn it.

### Core rules

- **No placement required on the support itself:** Stacking on earlier shapes is valid.
- **No forced placement order by default:** The player can choose any remaining piece unless a particular level explicitly says otherwise.
- **Water is a failure boundary, not a swimming simulation.**
- **No “win while falling”:** During validation, require all required pieces to remain above the water boundary, with no pending break event. Optionally require the stack’s movement to fall below a generously tuned threshold so clearly toppling towers cannot pass merely because they fall slowly.
- **No hidden support:** A decorative pedestal must correspond to the visible physical support surface.
- **Instant reset:** Do not make players wait for every piece to finish falling before retry becomes available.

## 4. Piece and challenge catalog

### Ordinary pieces

Start with a small family of useful silhouettes: rectangle, narrow plank, square, circle, rounded capsule, L, T, cross, wedge, and an asymmetric irregular piece. Expand toward the original’s variety only after the physics prototype is convincing. The WiiWare listing describes **14 shapes plus two special shape types**; this is a content target, not a requirement to author all 16 before the first playable. [Original listing](https://www.nintendolife.com/games/wiiware/art_of_balance)

Each piece definition specifies:
- silhouette and visual variant;
- collision outline;
- scale, mass, center of mass, and contact material;
- starting orientation and allowed rotation increments;
- preview icon and sound family;
- optional special behavior.

### Special pieces

**Load-sensitive piece:** Begins intact. Calculate the load it directly or indirectly supports from the settled contact graph, with hysteresis to prevent rapid threshold flicker. Warn as load approaches the authored limit; break only after the threshold is exceeded for a short, documented tolerance period.

**Timed piece:** Begins its countdown when another committed piece is supported by it. Show the countdown on the piece itself and in the HUD if obscured. At zero, remove its physical support and play a break effect. Document whether the countdown continues during the final three-second validation; the recommended answer is **yes**, to avoid inconsistent rules.

Initial thresholds and delays are **tuning parameters**, not assertions about the original’s internal physics.

### Objectives

Implement objectives as composable level data:

- **Standard:** Place every piece and survive validation.
- **Time:** Complete placements before a displayed deadline, then survive validation. Decide explicitly whether validation counts against the deadline; recommended: placement deadline stops on the last drop.
- **Height:** Reach a marked height with the committed structure, place all required pieces, then survive validation. Measure the highest point of committed physical colliders, not a visual effect or held preview.
- **Balance challenge:** Reserve as a configurable challenge slot until reference capture establishes its precise rule. Do not silently invent “original” scoring.

## 5. Progression and content targets

**Prototype:** 6 diagnostic levels covering flat support, narrow support, rounded piece, asymmetry, timed break, and load break.

**Vertical slice:** 12 polished levels in one world, including standard, time, and height objectives; menus, retry, save data, and finished visual/audio feedback.

**Full WiiWare-inspired content target:** 100 authored levels across four visually distinct worlds. Use medals or completion counts to unlock worlds only after the progression is playtested. Challenge levels can be optional if the resulting unlock curve remains understandable.

Create a difficulty matrix before authoring all levels:

| Band | Support | Pieces | New idea |
|---|---|---:|---|
| Introduction | Broad, flat | 2–3 | Placement and rotation |
| Early | Narrow or offset | 3–4 | Center of mass |
| Middle | Narrow/irregular | 4–5 | Curves and interlocking |
| Advanced | Small/offset | 5–7 | Special-piece planning |
| Expert | Constrained | 5–8 | Combined objective pressure |

Favor puzzles with multiple plausible solutions. Reject levels that depend on pixel-perfect drops or a lucky physics tremor.

## 6. Reference-capture checklist

Before polishing art or authoring the full campaign, capture or catalog original-WiiWare reference for:

- gameplay at 4:3 and 16:9;
- camera framing at level start and during zoom;
- shape-tray placement, typography, world map, and three-light indicator;
- examples of each special piece and challenge;
- the four worlds’ palettes, surface treatments, and backdrop motifs;
- failure, splash, success, and retry timing;
- pointer sensitivity and rotation increments.

Tag every observation by **WiiWare**, **later release**, or **uncertain**. The contemporary review and preview above are good starting points; screenshots on the [WiiWare listing](https://www.nintendolife.com/games/wiiware/art_of_balance) supply a reference gallery.
```

### `02-visuals-and-audio.md`

```markdown
# Visual and audio implementation plan

## 1. Visual target

Aim for a polished, serene **2010 console puzzle-game aesthetic**, rather than photorealism: smooth, substantial shapes in the foreground; a small stone support emerging over animated water; layered room or garden scenery; restrained shine; and clear, playful UI.

Contemporary coverage specifically describes smooth/chunky blocks, animated water, wooden and cloth textures, and eccentric three-dimensional scenery. It also notes that some background geometry looked jagged beside the polished pieces. Preserve the composition and mood while improving that rough edge. [Preview](https://www.nintendolife.com/news/2010/01/first_impressions_art_of_balance) · [Review](https://www.nintendolife.com/reviews/2010/02/art_of_balance)

## 2. Rendering approach: 2D physics, 2.5D presentation

Use a **URP project with the Universal Renderer**. The puzzle simulation lives on the XY plane; visuals use shallow extruded meshes, bevels, lighting, and layered 3D scenery. A mostly front-facing orthographic camera keeps the physics legible. A subtle camera offset or mesh-side treatment reveals thickness without disguising where contacts occur.

Keep separate objects for each shape’s:
- **physics root:** its Rigidbody2D and Collider2D outline;
- **visual child:** mesh/material/shadow/detail;
- **feedback child:** selection highlight, crack overlay, countdown, and particles.

Never infer collision from the visible bevel. The projected visible contact edge must agree with the physical outline.

Choose the Universal Renderer deliberately: Unity also offers a dedicated **2D Renderer** with different mesh-lighting requirements. Do not start on the 2D Renderer and assume ordinary lit 3D meshes will behave the same way. [Unity 6.6 Universal Renderer](https://docs.unity3d.com/6000.6/Documentation/Manual/urp/urp-universal-renderer.html) · [3D meshes in 2D URP scenes](https://docs.unity3d.com/6000.6/Documentation/Manual/urp/2d-renderer-urp-shader-compatibility.html)

## 3. Scene composition

Design around a reference canvas, then adapt it to aspect ratio:

1. **Rear environment:** calm gradient and world-specific architecture or natural motifs.
2. **Midground:** decorative stones, screens, bamboo, cloth, or wood details. Keep contrast lower than the playable shapes.
3. **Water:** a clearly visible horizontal loss surface below the support, extending beyond the fall zone.
4. **Support:** one prominent stone or platform whose visible top matches its collider.
5. **Puzzle pieces:** strongest silhouette and local contrast in the image.
6. **Reserve and HUD:** clearly separated from the drop space; no UI obscuring the support or a tall completed tower.
7. **Foreground accents:** occasional rim detail or soft vignette, never enough to hide falling pieces.

Support both 16:9 and 4:3 through tested camera bounds and anchored HUD layouts. The initial camera shows the full support, typical available stacking height, waterline, and reserve. For tall levels, smoothly zoom out when the committed stack approaches the framing limit. Do not change the cursor-to-world mapping unnoticed during a drop.

## 4. Asset production

### Shapes

- Author clean 2D silhouettes first; derive collision outlines from simplified, explicitly reviewed polygons.
- Extrude or assemble matching shallow meshes. Add small bevels so pieces catch highlights without becoming visually rounder than their colliders.
- Use a restrained material library: polished painted wood/ceramic/stone-like surfaces, subtle grain or stippling, and distinct colors for special pieces.
- Ensure every color-coded rule also has a pattern, icon, animation, or shape cue.
- Produce silhouette thumbnails at the actual reserve-icon size; discard any shape that cannot be distinguished quickly.

### Support and environment

Build the support top from a physical profile; dress its front and sides independently. Produce four environment kits with different palette, background motifs, and water/support dressing, while keeping gameplay contrast consistent.

Avoid copying individual source textures or exact decorative illustrations. Make new materials and scenery inspired by the reference’s composition.

### Water

First implement a cheap, readable effect:
- layered scrolling normal/color patterns or a simple stylized shader;
- subtle ripples around the support;
- masked, softened reflections of pieces near the waterline if affordable;
- impact rings and a brief splash when a piece fails.

A full fluid simulation is unnecessary. Make water effects **visual-only**; the authoritative failure boundary is a trigger or geometric test in gameplay code. Offer a lower-cost quality setting without losing the visible waterline.

### Lighting and post-processing

Use a broad key light, soft fill, localized highlights, and restrained ambient occlusion or contact shading. Keep the pieces brighter and clearer than the backdrop. Use only mild bloom and color grading; small UI indicators and piece outlines must remain sharp.

## 5. UI and animation

Use **UI Toolkit** for menus, world/level selection, settings, and the gameplay HUD; keep world-space guides and piece effects in the scene. Unity 6.6 supports runtime UI Toolkit, while uGUI remains an acceptable alternative if a particular world-space interaction proves awkward. [Unity 6.6 UI systems](https://docs.unity3d.com/6000.6/Documentation/Manual/UIToolkits.html)

Gameplay HUD:
- reserve-piece slots with selection and remaining-count states;
- level objective and time/height readout when applicable;
- three unambiguous survival lights;
- pause/retry affordances;
- warnings for timed or overloaded pieces.

Animation beats:
- selection: short lift/glow and audible confirmation;
- rotation: quick, exact increments, with no ambiguous in-between collision pose;
- drop: tiny release cue, then unassisted physical motion;
- danger: controlled crack, wobble, or countdown feedback;
- failure: splash/collapse, then a short path to Retry;
- success: third light locks, soft celebratory effect, progress award, Next.

UI motion must never change the physics root.

## 6. Audio

Commission or compose an original, low-intensity lounge/electronic score with four world variations. Add restrained selection, rotation, wood/stone contact, ticking, cracking, splash, and success sounds. Mix repeated collision sounds by impact strength and rate-limit them so a settling stack does not create a noisy barrage. Duck music slightly for failure and success.

Do not reuse the original game’s soundtrack, samples, artwork, or logo without permission.

## 7. Visual acceptance gates

- A first-time tester can identify the support, water hazard, remaining pieces, and current objective within five seconds.
- At gameplay size, a piece’s visible lower edge agrees with its collision/contact behavior.
- All objectives and warnings remain readable at 4:3 and 16:9.
- A screenshot from each world has the same recognizable playfield composition but a distinct backdrop.
- Water and decorative scenery never cause players to misread the physical support surface.
```

### `03-unity-architecture-and-physics.md`

```markdown
# Unity 6.6 architecture and physics plan

## 1. Project setup

- Create a **Unity 6.6** URP project using the Universal Renderer.
- Install and configure the **Input System**; the Unity 6.6 manual lists Input System package **1.20.0** for this editor version. [Unity 6.6 Input System](https://docs.unity3d.com/6000.6/Documentation/Manual/com.unity.inputsystem.html)
- Use built-in **Rigidbody2D/Collider2D physics**, not 3D rigidbodies. Unity 6.6 also documents a separate Physics Core 2D API; it does **not** interact with the built-in Rigidbody2D/Collider2D components, so do not mix the systems. [Unity 6.6 2D physics](https://docs.unity3d.com/6000.6/Documentation/Manual/2d-physics/2d-physics.html)
- Set source control, text serialization, asset naming rules, and a reproducible project-settings baseline before content production.

Suggested folders:

`Assets/Game/{Art,Audio,Data,Input,Materials,Prefabs,Scenes,Scripts,Shaders,UI,Tests}`

Suggested scenes:

`Boot`, `MainMenu`, `WorldSelect`, `Puzzle`, and a standalone `PhysicsLab`.

## 2. Data model

### `ShapeDefinition` — ScriptableObject

Stores a stable shape ID, collision-outline asset, visual mesh/material references, physical defaults, reserve thumbnail, rotation-step rule, sound set, and optional special-behavior profile.

### `LevelDefinition` — ScriptableObject

Stores stable level/world IDs; support geometry and pose; water-loss height; camera framing; available pieces and their initial orientations; objective modules; deadlines or target heights; special-piece overrides; difficulty tags; and an authoring note describing at least one intended solution.

### `WorldDefinition` — ScriptableObject

Stores environment kit, palette, music, level ordering, unlock requirement, and visual transition settings.

### `SaveData`

Stores schema version, completed level IDs, medals if used, unlocked worlds, settings, and a compact record of best results. Use stable IDs rather than asset-array indexes so authored level reordering does not corrupt saves.

## 3. Runtime responsibilities

| System | Responsibility |
|---|---|
| `GameFlowController` | Owns level states, pause, restart, success/failure precedence. |
| `LevelLoader` | Builds support, reserve, objectives, and camera from a level definition. |
| `PlacementController` | Selects, aims, rotates, validates placement preview, commits drops. |
| `PieceController` | Holds runtime state and coordinates physics with special behavior. |
| `ContactGraphService` | Tracks support relationships for load and timed-piece activation. |
| `ObjectiveEvaluator` | Evaluates standard, time, height, and future challenge modules. |
| `FailureDetector` | Detects water crossing and out-of-bounds pieces. |
| `ValidationTimer` | Runs the three-second post-placement survival test. |
| `PresentationController` | Updates HUD, camera, audio, particles, and transitions. |
| `ProgressService` | Saves completions and unlocks, independently of scene objects. |

Systems publish discrete events such as `PieceSelected`, `PieceCommitted`, `WaterEntered`, `SpecialPieceBroken`, `ValidationStarted`, and `LevelResolved`. Only `GameFlowController` makes the final result decision.

## 4. Physics setup and tuning

### Objects

- **Support:** static Collider2D with an authored top profile.
- **Unplaced selection:** a visual preview with physics interaction disabled.
- **Committed pieces:** dynamic Rigidbody2D with simplified PolygonCollider2D or a small, reviewed compound of primitive 2D colliders.
- **Water-loss sensor:** trigger region below the visible water surface, supplemented by a world-bounds test.
- **Decoration:** no gameplay colliders unless visibly part of the support.

Keep shape visuals attached to, not independently simulated from, their physics roots.

### Tuning order

1. Establish a scale convention: for example, a normal block approximately one Unity unit wide.
2. Tune gravity and mass ranges on a flat support.
3. Tune friction and bounce through Physics Material 2D; begin with low bounce and moderate friction.
4. Tune rotation behavior, release clearance, solver settings, and collision detection in the `PhysicsLab`.
5. Only then author precision-dependent levels.

Use a fixed physics timestep of **1/60 second as an initial test value**, not a guaranteed optimum. Unity’s documented default is **0.02 seconds (50 Hz)**; a smaller timestep improves fidelity at additional CPU cost. Measure stability and profiler cost before locking it. Keep placement and rule resolution aligned with physics steps. [Unity 6.6 fixed-timestep guidance](https://docs.unity3d.com/6000.6/Documentation/Manual/physics-optimization-cpu-frequency.html)

Test continuous collision detection on small or fast-falling pieces, interpolation for visual smoothness, and solver settings only where the lab demonstrates a problem. Do not compensate for poor collider geometry solely by increasing simulation cost.

### Drop correctness

At commit:
1. Confirm the preview is within the level’s allowed placement region.
2. Check that its collider does not start embedded in a committed collider or the support.
3. Snapshot its exact world position and allowed orientation.
4. Enable the dynamic body and collision at a physics-step boundary.
5. Release it without a hidden horizontal correction or stabilizing force.

A rejected preview stays controllable and receives a clear invalid-placement cue. An accepted preview is never silently shifted to make the puzzle easier.

### Fairness and numerical stability

- Simplify collision outlines while preserving important contact surfaces.
- Keep broad, near-flat contacts genuinely flat; avoid microscopic vertices that create jitter.
- Apply sensible angular/linear speed limits only if testing shows extreme impulses.
- Do not auto-freeze unstable stacks to force a win.
- Evaluate failure and success centrally, once per physics step, in a documented order: **water/fatal failure → objective validity → validation progress → success**.
- Log level ID, piece poses, last collision, and result reason in development builds to investigate seemingly unfair failures.

## 5. Contact graph and special rules

The graph answers **“which piece is supported by which?”**; it is separate from ordinary collision response.

On each physics step, inspect contacts with sufficiently upward-facing normals and a short persistence window. Record directed support edges from supporting body to supported body. If a piece rests across two supports, distribute or conservatively estimate load according to the design rule selected during prototyping. Filter transient side bumps so they do not start timers.

- **Timed piece:** starts its one-shot countdown after a qualifying supported contact. The countdown is displayed and pauses with the game.
- **Load-sensitive piece:** assesses supported descendant weight or authored “piece count,” depending on the rule chosen and clearly signaled in UI. Apply hysteresis. On break, remove its collider and show fragments; the supported structure then falls naturally.

Prototype both special types in isolation, then in a combined diagnostic level. Never use visual overlap alone to determine support.

## 6. Inputs and camera

Define Input System actions for:
- pointer position and select/drop;
- rotate left/right;
- choose previous/next reserve piece;
- retry and pause;
- UI navigation and confirm/cancel.

For mouse, raycast from the screen pointer onto the puzzle’s XY plane. For gamepad, drive a visible virtual cursor or focused-piece position with acceleration and fine-adjust mode. Transform pointer coordinates through the **current** camera each frame; camera zoom must not create a sudden placement jump. If touch is added later, provide explicit rotate controls and prevent UI touches from also dropping pieces.

Use a camera target based on support, committed stack bounds, and held-piece bounds. Smooth camera movement only outside the final moments of a precision drop, or preserve the held piece’s screen location during movement.

## 7. Testing architecture

### Edit-mode tests

- Level data validation: stable IDs, nonempty piece lists, legal support and water geometry.
- Objective combinations: deadlines, heights, and completion conditions.
- Save/load migration and unlock calculation.
- Contact-graph rules on authored support relationships.

### Play-mode tests

- Place two pieces, survive three seconds, receive one completion.
- Piece crosses water during validation: fail, not success.
- Special piece breaks during validation: no premature success.
- Pause freezes physics-related clocks and resumes correctly.
- Retry clears every old collider, timer, particle-owned result, and input selection.
- Invalid overlapping placement is rejected without changing the stack.
- Switching between 4:3 and 16:9 retains playable framing.

### Physics regression set

Maintain known initial poses and committed-drop sequences for at least 20 representative levels. Compare outcome classes—stable, unstable, special break—not exact floating-point trajectories. Run them after engine, physics, collider, or timestep changes.

## 8. Performance targets

Target a smooth 60 fps on the chosen desktop baseline, with physics comfortably inside its fixed-step budget. Profile the worst case: many contacting pieces, falling fragments, water effects, HUD animation, and camera zoom at once.

Prioritize reducing collider complexity, contact churn, overdraw, reflection cost, and unnecessary allocations before lowering physics accuracy. Record the tested hardware and resolution beside every performance target.
```

### `04-production-roadmap-and-acceptance.md`

```markdown
# Production roadmap, deliverables, and acceptance criteria

## 1. Work sequence

These are **milestones**, not promises of calendar duration. Assign dates after measuring prototype and asset-production throughput.

| Milestone | Build | Exit criterion |
|---|---|---|
| M0 — Reference and rights | WiiWare-only reference board, observation log, original-art policy, initial level matrix | Every gameplay claim is tagged observed, inferred, or chosen. |
| M1 — Physics lab | Support, 6–10 shapes, pointer placement, rotation, drop, water failure, restart | Multiple testers can deliberately build and fail stacks; repeated trials do not exhibit unexplained jitter. |
| M2 — Complete loop | Reserve selection, objectives, three-second validation, results, 6 diagnostic levels | Start-to-next-level and failure-to-retry loops work without editor intervention. |
| M3 — Visual slice | One finished environment, shape material set, water, HUD, camera, effects, sound | Gameplay remains readable at 4:3 and 16:9; a captured run conveys the intended WiiWare-era composition. |
| M4 — Vertical slice | 12 tuned levels, progression, settings, save/load, time/height challenges, both special types | New testers understand mechanics from play and can explain why failures occurred. |
| M5 — Content scale | Additional worlds and authored levels toward 100 | Each level passes solvability, fairness, and visual-framing review. |
| M6 — Optional modes | Drop-in local co-op, then split-screen Versus | Modes preserve the single-player rules and meet their own readability/performance targets. |
| M7 — Release QA | Regression, accessibility, optimization, licensing review | All acceptance tests pass on target hardware. |

## 2. Team task breakdown

**Design:** reference log, rule decisions, tutorial sequence, level matrix, level authoring, playtest analysis.

**Engineering:** physics lab, data model, placement/input, contact graph, state machine, objectives, saves, UI integration, automated tests, profiling.

**Art/technical art:** silhouette set, collider-review sheets, mesh/material pipeline, four world kits, support variants, water, VFX, UI art, aspect-ratio checks.

**Audio:** original world tracks, collision families, special-piece warnings, failure/success cues, mix pass.

A small solo team should finish M3 before producing a large shape or level library.

## 3. Level-authoring workflow

1. Select **one teaching or testing purpose** for the level.
2. Choose its support profile and 2–8 supplied pieces.
3. Record the objective and special-piece parameters.
4. Find at least one reproducible solution using normal controls.
5. Test several alternative arrangements; keep them if they are understandable.
6. Run repeated attempts on the intended solution. Adjust geometry or physics if it requires near-pixel-perfect positioning.
7. Check the tall-stack camera framing, objective readout, water failure, and three-light finish.
8. Have a tester play without an explanation. Capture confusion and failures.
9. Lock the level’s definition, screenshot, design note, and regression-test sequence together.

Avoid scaling content by randomly assembling shapes. The pleasure comes from readable geometry and considered solutions.

## 4. Playtest measurements

Collect, per level:
- attempts to first completion;
- time spent aiming versus watching;
- placement order and rotation use;
- loss cause and piece responsible;
- retry delay;
- rate of “I don’t understand why I failed” reports;
- number of successful, distinct solution families.

Flag levels with repeated unexplained collapses, successful stacks that look as though they should fail, or high completion rates caused by waiting out a visibly falling tower. Rework these before increasing difficulty.

## 5. Definition of done

### Main-loop acceptance

- Every required piece can be selected, rotated, placed, and physically released.
- A piece entering the water-loss region causes exactly one failure.
- The final committed placement starts a visibly indicated three-second survival phase only when the level’s objective conditions are met.
- A collapse or break during that phase prevents success.
- Retry restores an identical starting level without stale contacts or timers.
- Progress is saved only after success and survives a fresh application launch.

### Visual acceptance

- The support, pieces, water hazard, reserve, objective, and survival indicator read immediately.
- Meshes and colliders agree at contact points.
- Each world is distinct but uses the same understandable composition.
- Both 4:3 and 16:9 retain essential gameplay and HUD elements.
- Background detail, water effects, and post-processing never hide contact behavior.

### Quality acceptance

- Tutorial levels introduce mechanics one at a time.
- Special-piece triggers and break reasons are apparent.
- A player can reach Retry quickly.
- Keyboard/mouse and gamepad are fully operable; UI focus never traps the player.
- All art, sound, fonts, and code dependencies have documented usage rights.

## 6. Principal risks and mitigations

| Risk | Mitigation |
|---|---|
| Physics feels lucky or inconsistent | Finish the physics lab first; simplify colliders; regression-test representative drops; reject precision-only levels. |
| Decorative 3D misrepresents 2D collisions | Review visual/contact overlays for every shape and support variant. |
| A slow collapse passes the survival timer | Add an explicit, forgiving motion/stability check alongside the water rule; playtest its thresholds. |
| Special-piece load rules are confusing | Choose one documented load definition, show warnings, and test mixed-support cases. |
| Water rendering consumes too much budget | Keep failure logic independent; implement a scalable, stylized effect before expensive reflections. |
| “WiiWare” scope drifts into later releases | Maintain version-tagged references and treat later-release features as optional additions. |
| Clone infringes protected expression | Obtain permission for any direct reuse; otherwise create original branding, art, audio, and levels, and seek legal review before distribution. |

## 7. Final handoff package

The completed project should contain:
1. Unity 6.6 project and locked package manifest.
2. Playable single-player build.
3. `ShapeDefinition`, `LevelDefinition`, and `WorldDefinition` assets.
4. Art-source files and documented asset licenses.
5. Reference/decision log separating observed behavior from implementation choices.
6. Physics tuning sheet and regression scenes.
7. Automated test suite and latest target-hardware profile.
8. Designer-facing level-authoring guide.
9. Known-deviations list: where the finished game deliberately differs from the WiiWare original.
```

**Important scope distinction:** The 100-level, four-world target comes from the [original WiiWare listing](https://www.nintendolife.com/games/wiiware/art_of_balance). Some later *Art of Balance* releases advertise **200 levels**; using that figure here would mis-scope the project.
