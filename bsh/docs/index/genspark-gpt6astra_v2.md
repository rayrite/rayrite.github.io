# Art of Balance (WiiWare) — Unity 6.6 Implementation Plan

**Reference target:** the original 2010 WiiWare release.  
**Engine:** Unity 6.6 / `6000.6`, with the exact editor patch and compatible package versions pinned at project creation.  
**Prepared:** September 23, 2026.  
**Deliverable:** a from-scratch implementation and production plan, emphasizing visual resemblance and the main single-player stacking loop.

### Contents

1. [Executive recommendation](#1-executive-recommendation)
2. [Reference study and fidelity specification](#2-reference-study-and-fidelity-specification)
3. [Project setup and architecture](#3-project-setup-and-architecture)
4. [Build order and delivery gates](#4-build-order-and-delivery-gates)
5. [Main gameplay loop and interaction](#5-main-gameplay-loop-and-interaction)
6. [Physics model and tuning workflow](#6-physics-model-and-tuning-workflow)
7. [Visual recreation pipeline](#7-visual-recreation-pipeline)
8. [Water, reflections, and effects](#8-water-reflections-and-effects)
9. [HUD, menus, audio, and game feel](#9-hud-menus-audio-and-game-feel)
10. [Special pieces and content production](#10-special-pieces-and-content-production)
11. [Performance and build strategy](#11-performance-and-build-strategy)
12. [Verification and acceptance criteria](#12-verification-and-acceptance-criteria)
13. [Main risks and mitigation order](#13-main-risks-and-mitigation-order)
14. [Deliverables by discipline](#14-deliverables-by-discipline)
15. [Open questions and reference capture tasks](#15-open-questions-and-reference-capture-tasks)
16. [Reference findings and implementation decisions](#16-reference-findings-and-implementation-decisions)
17. [Sources and technical documentation](#17-sources-and-technical-documentation)

## 1. Executive recommendation

Build this as a **2.5D game: authoritative 2D physics driving genuinely three-dimensional presentation**. Use Unity's Universal Render Pipeline (URP), a 3D renderer, extruded block meshes, an authored tabletop/basin environment, and a carefully calibrated fixed camera. Keep gameplay collision in one XY plane using `Rigidbody2D` and `Collider2D`; render the basin, water, lighting, and background as 3D scenery.

The development priority is a small, highly polished vertical slice: choosing a shape, positioning and rotating it, committing its placement, watching it settle, then either completing the puzzle or immediately retrying after a fall. Prove that loop and the reference composition together before producing a large puzzle collection. A physically convincing stack with mismatched framing will not resemble the original; a beautiful basin with unreliable stacking will not play like it.

Use reference-driven iteration rather than treating modern rendering sophistication as the goal. Match the original's silhouette hierarchy, material readability, composition, soft environmental presentation, and restrained feedback first. Add expensive effects only when comparisons show that they improve the match.

The original's verified baseline is **100 puzzles across four worlds**, with ordinary stacking, load-sensitive/timed breaking pieces, and named Balance/Height/Time Challenges. After the last placement, the stack must survive above water for **three seconds**, presented with **three lights**. Its look is more colorful and graphic than a generic minimalist zen scene: the inspected screenshots show **glossy patterned pieces, conspicuous water reflections, metallic-looking basins/supports, botanical props, and bold patterned backdrops**. [G1][G3][G4][V1–V5]

### Assumptions and evidence labels

- **Production assumption:** first playable targets desktop at 60 FPS, with mouse input and an optional controller-driven pointer. Resolution-independent UI supports a reference-calibrated widescreen composition. Hardware Wii Remote support is a separate input adapter if requested later.
- **Scope priority:** faithful solo puzzle loop and visual presentation first; multiplayer and other secondary modes follow only after the slice passes its fidelity review.
- **Verified:** a behavior supported by identified sources for the original WiiWare edition.
- **Observed:** an appearance or behavior visible in an identified reference, without claiming knowledge of the original engine's implementation.
- **Proposed:** an implementation, parameter, estimate, or quality target for this project. Proposed values are starting points to tune, not recovered original constants.
- **Unresolved:** a reference detail requiring direct play or frame-by-frame inspection before locking parity.

## 2. Reference study and fidelity specification

The reference evidence and source register are consolidated in Sections 16–17. Maintain an internal reference board alongside implementation, with every image tagged by edition and capture provenance. Never silently use a screenshot from a later port as the visual target for the WiiWare scene.

### 2.1 Build a measurable reference board

Capture examples of the following before finalizing camera or assets:

1. A newly loaded early puzzle, showing basin, supports, available shapes, pointer, and UI.
2. A selected piece at three heights and two or more rotations.
3. A piece just before placement, at placement, and after settling.
4. A narrow, tall stack and a wide bridging solution.
5. The final-piece placement and complete success sequence.
6. A falling piece, water contact, failure feedback, and restart.
7. Level selection and progression transitions.
8. Every distinct special-piece mechanic and representative environment variation.

For each reference, record edition, URL or local capture name, timestamp/frame, capture dimensions, aspect ratio, and whether an emulator altered resolution, texture filtering, or post-processing. A high-resolution emulator capture is useful for examining geometry but does not establish the original console's edge sharpness or post-processing.

Measure screen coordinates as fractions of the gameplay viewport: waterline, support centers, basin rim, inventory bounds, principal text positions, largest permitted stack, and typical block width. This creates a durable composition specification independent of output resolution.

Use a capture sheet with these columns:

| Capture field | Example of what to record |
|---|---|
| Edition/provenance | WiiWare, source URL, capture method, known enhancement settings |
| Event | Idle puzzle / selected shape / release / countdown / splash / retry |
| Time marker | Video time and frame number when available |
| Composition | Normalized waterline Y, support centers, block width, inventory rectangle |
| Appearance | Material family, face/side values, shadow direction, reflection extent |
| Timing | Measured event duration and uncertainty from frame rate |
| Confidence | Direct observation / secondary description / proposed approximation |

For timing measurements, state the precision honestly: a 30 FPS video cannot establish an event boundary more finely than its captured frames, and upload edits can invalidate transition timing. Retain at least one uncut interaction sequence for each important mechanic.

### 2.2 Visual comparison procedure

Use three complementary checkpoints:

- **Silhouette:** grayscale screenshots with materials and effects disabled. Compare support positions, block outlines, stacking space, and basin framing.
- **Material and light:** one representative block, one support, and one water section in the final camera. Compare roughness, value separation, edge highlights, and shadow softness.
- **Motion:** short synchronized recordings of pick/place, settling, water contact, success, and restart. Compare cadence and readability, rather than a single attractive still.

Create a debug screenshot overlay with adjustable opacity. Align the gameplay viewport before comparing; do not compensate for incorrect camera scale by independently resizing assets. Review discrepancies in the order **composition → shape → material values → lighting → effects → fine texture**.

### 2.3 Concrete visual targets from inspected screenshots

These observations are based on the still images linked in Section 17. They establish visible appearance, not the original rendering technique or animation timing.

| Element | Observed original-reference appearance | Unity implementation target |
|---|---|---|
| Playfield | Strongly frontal, centered stacks above water; elevated view reveals substantial water surface and piece depth | Fixed camera calibrated to those proportions; planar physics with actual mesh thickness |
| Basin | Both rectangular trays and round bowls appear; bright rims, darker sides, reflective liquid | At least two basin silhouette families, matched per reference environment/puzzle |
| Supports | Gray metallic/stone-like blocks and rods; one image shows opposed slanted supports; another a striped beam on a central post | Author support top profiles accurately; include moving-foundation challenges when verified |
| Piece surfaces | Blue pieces with lighter circular/halftone marks; green/white organic patterns; orange/white diagonal pattern; bright pale bevel highlights | Family-based patterned albedo, glossy nonmetal response, beveled extrusion, coordinated side-face shading |
| Water | Clearly recognizable distorted reflections of blocks, supports, plants, and background colors | Moving-block reflections are a fidelity requirement; cheap probes alone are only the first prototype |
| Backdrops | Saturated blue/orange/green/pink graphics, large circles/curves/halftone fields, bamboo or flowering plants | Authored graphic panels plus simple plant meshes/cards; retain bold color instead of defaulting to muted beige |
| Pointer/held state | Outlined hand cursor; one blue-background image contains a translucent outlined unplaced-looking silhouette | Hand-style software pointer; reference-guided transparent preview material; do not add an arbitrary vertical drop line |
| Inventory/markers | Bottom-row shape choices and small colored square markers are visible in the orange screenshot | Recreate spatial layout and marker appearance after verifying their exact meanings |
| Completion | A rounded, light-edged capsule at bottom center contains three circular lamps; one image has two green and one dark | Dedicated three-lamp countdown widget, not a generic progress bar |
| Menu | An orange/yellow icon-selection screen uses rounded glossy panels/buttons and large blue/white outlined title text | Separate warm menu palette with similar hierarchy and rounded controls |

The Cubed3 screenshot files are currently hosted in a 2024 upload directory despite the review's 2010 date. Use them as qualified supporting visual evidence and cross-check critical proportions against Shin’en's original `/wii/` media. The Nintendo Life images are attached to its explicitly WiiWare review/gallery. Exact world-name mapping and camera projection remain unresolved. [G3][G4][G5][V1–V5]

## 3. Project setup and architecture

### 3.1 Initial project configuration

1. Install Unity 6.6 through Unity Hub and choose a specific supported `6000.6.x` patch. Save the editor version in source control with the project. Unity publishes a [6.6 manual](https://docs.unity3d.com/6000.6/Documentation/Manual/UnityManual.html) and [6000.6.0f1 release notes](https://unity.com/releases/editor/whats-new/6000.6.0f1); verify the selected patch and compatible packages at setup time rather than assuming any `6000.x` editor is equivalent.
2. Create a URP 3D project. Use the Universal/3D renderer, because mesh lighting, basin geometry, and water presentation are central to the design.
3. Install compatible Input System and Unity Test Framework packages through Package Manager. Pin resolved versions; do not copy package numbers from older tutorials.
4. Use linear color space. Establish one shipping quality profile before making extra quality tiers.
5. Set the collision plane to world XY, extrusion along Z, and gravity along negative Y. Choose one world-unit scale and document it in the authoring guide.
6. Define GameObject layers and an explicit Physics 2D collision matrix; configure camera culling and URP rendering-layer masks separately as needed. These are related filtering mechanisms, not interchangeable settings.
7. Make source-controlled tuning assets for physics, input, camera, visual presentation, and feedback. Record the baseline asset revision with fidelity captures.
8. Establish a build profile for the initial desktop target and confirm a development build launches before proceeding with art production.

### 3.2 Recommended scene structure

```text
Bootstrap
  AppRoot
    SaveService
    AudioService
    InputRouter
    SceneFlow

Frontend
  MenuCamera / Canvas
  WorldAndLevelSelection

Gameplay
  PuzzleSession
  GameplayPhysicsRoot
    SupportRoot                  # Static Collider2D geometry
    ReleasedPieceRoot            # Dynamic authoritative bodies
    WaterAndBoundsSensors        # Logical failure geometry
  PresentationRoot
    BasinMesh
    WaterSurface
    BackdropAndProps
    LightsAndReflectionProbes
    FeedbackPool
  PlacementPreviewRoot           # Non-authoritative held-piece preview
  GameplayCamera
  HUDCanvas
  DebugOverlay                   # Development builds only
```

Use one reusable gameplay scene and load puzzle data into it. Do not create a full scene per puzzle. Environment variation belongs in an `EnvironmentDefinition` and associated prefab, unless it genuinely needs different baked-scene data.

### 3.3 Responsibilities and ownership

| Component | Owns | Important constraint |
|---|---|---|
| `PuzzleSession` | Session state, attempt identity, terminal outcome | Sole authority that declares success or failure |
| `PuzzleLoader` | Spawning supports, inventory, and environment bindings | Clears the previous attempt completely |
| `PieceInventory` | Available instances and committed placements | Updates atomically with valid placement |
| `PlacementController` | Selection, pointer projection, desired pose, commit requests | Does not decide puzzle outcome |
| `PlacementValidator` | Rule evaluation and geometry checks | Preview and commit use the same rules |
| `PieceBody` | Released body's identity, physics, and behavior hooks | Knows its attempt ID and shape definition |
| `SettleEvaluator` | Motion/contact observations for tuning and optional rules | Does not replace measured original victory semantics |
| `OutcomeEvaluator` | Completion eligibility, survival timer, failure priority | Works on simulation-time facts |
| `WaterContactSensor` | First meaningful water contact per piece | Publishes facts; visual water is not authoritative |
| `PieceVisual` | Mesh, material parameters, selection cues | Reads pose; never moves a dynamic body's transform |
| `FeedbackDirector` | Sound, ripple, splash, transitions | Reacts to accepted events exactly once |
| `ProgressService` | Completed level IDs and progression | Versioned save data with stable IDs |
| `PuzzleDebugTools` | Restarts, overlays, reference capture, telemetry | Editor/development use only |

Prefer direct references and a small set of typed events over a global event bus for every action. Useful events include `PieceCommitted`, `PieceContactedWater`, `AttemptFailed`, and `AttemptCompleted`. Include an attempt token in deferred callbacks so a splash or animation from a previous attempt cannot alter a new puzzle.

### 3.4 Data assets

**`ShapeDefinition`**

- Stable ID and display/category metadata.
- Canonical 2D outline or outlines, explicit collider decomposition, and visual mesh references.
- Authored pivot, area, mass policy, center-of-mass policy, friction, and restitution profile.
- Allowed orientation policy and rotation step.
- Material/appearance profile and inventory thumbnail.
- Optional special-behavior configuration.

**`PuzzleDefinition`**

- Stable ID, world/group ID, ordering, and unlock dependencies.
- Environment reference and camera/composition preset.
- Support instances with poses and authored collision profiles.
- Piece instances, multiplicities, and inventory ordering.
- Placement bounds, logical waterline/sensors, and any exceptional rules.
- Completion-rule configuration and a developer difficulty note.
- Reference links and manually verified solution notes for development.

**`EnvironmentDefinition`**

- Basin/backdrop prefab, light settings, water parameters, reflection assets, ambience, and UI palette bindings.
- Named anchors linking visual support surfaces and waterline to the gameplay plane.

**`GameTuning` / `PhysicsTuning` / `FeedbackTuning`**

- Central defaults with clearly visible puzzle-specific overrides.
- Human-readable units for distances, angles, seconds, and velocities.
- No unexplained constants scattered through input, physics, and UI scripts.

Store persistent progress as simple serialized data keyed by stable level IDs, not as writes to ScriptableObjects. Keep save schema version and migration behavior explicit.

Extend `PuzzleDefinition` with a `challengeType` and parameters for the original **Balance, Height, and Time Challenges**. Height and time goals require explicit success predicates and HUD presentation. Balance challenges may require a simulated support assembly rather than the default static support root; a rocking foundation can use a dynamic `Rigidbody2D` and an appropriately limited `HingeJoint2D`, with its pivot, limits, mass, and damping calibrated to footage. This joint choice is proposed; the original developer confirms the challenge category, not its implementation. [G1][G3]

### 3.5 Folder and prefab conventions

```text
Assets/ArtOfBalance/
  Scenes/                   # Bootstrap, Frontend, Gameplay
  Scripts/
    Core/                   # Session, state, clocks, IDs, progress
    Gameplay/               # Pieces, inventory, placement, outcomes
    Input/                  # Actions and pointer adapters
    Presentation/           # Piece visuals, feedback, UI
    Authoring/Editor/        # Geometry and puzzle authoring tools
  Data/
    Shapes/ Puzzles/ Environments/ Tuning/
  Prefabs/
    Pieces/ Supports/ Environment/ UI/ Effects/
  Art/
    Meshes/ Materials/ Textures/ Shaders/
  Audio/
  Tests/
    EditMode/ PlayMode/
  ReferenceNotes/            # Capture metadata, composition sheets, rule notes
```

Use a `PieceBody` prefab whose root owns the 2D body and colliders and whose child owns the 3D mesh. Keep root scale at one; bake shape dimensions into authored geometry. Nonuniform runtime scaling makes collider/mesh agreement and inertia difficult to reason about.

Suggested layers are `Support`, `ReleasedPiece`, `PlacementProbe`, `WaterSensor`, `BoundsSensor`, `Environment`, and `UI`. Enable released-piece contacts with supports and other released pieces. Enable relevant sensor detection; make the placement probe non-interacting and use explicit query masks. Render-only scenery must never obstruct a 2D placement query accidentally.

### 3.6 Example puzzle data contract

The following is an illustrative authoring contract, **not a transcription of an original level**. In Unity these fields would normally be serialized in ScriptableObjects and validated by editor tooling.

```yaml
id: prototype_stack_01
worldId: prototype
environmentId: basin_reference_a
cameraPresetId: reference_widescreen
physicsProfileId: baseline_v1
waterHeight: 0.0
placementBounds: { minX: -4.0, maxX: 4.0, minY: 0.1, maxY: 6.0 }
supports:
  - id: support_center
    shapeId: support_flat_wide
    position: { x: 0.0, y: 0.3 }
    rotationDegrees: 0.0
inventory:
  - { instanceId: piece_01, shapeId: rectangle_medium }
  - { instanceId: piece_02, shapeId: rectangle_medium }
  - { instanceId: piece_03, shapeId: triangle_small }
completionProfileId: original_solo
unlockDependencies: []
```

The preset supplies the actual completion and placement rules. Avoid duplicating those constants in every puzzle unless the original genuinely varies them. Stable instance IDs make selection, diagnostics, and special-piece state easier to inspect than array indices that change as inventory items are removed.

## 4. Build order and delivery gates

The schedule below is a **planning estimate**, assuming one experienced Unity developer with part-time art/audio support. It is not a fixed quote. Content volume, asset creation skill, and the number of reference-matching iterations dominate the variance.

The two most important stop/go decisions are: **does placement/stacking feel fair?** and **does the integrated gameplay camera look like the chosen WiiWare reference?** If either answer is no, invest the next iteration there rather than adding more levels.

| Phase | Estimate | Concrete output | Exit gate |
|---|---|---|---|
| 0. Reference and specification | 2–4 working days | Edition-clean reference board, rule matrix, normalized composition sheet | Major unknowns have an observation task and owner |
| 1. Physics and interaction prototype | 4–6 days | Basic shapes, supports, placement, water failure, completion, retry | A small suite of authored stacks behaves predictably; one complete puzzle loop works |
| 2. Visual target scene | 5–8 days | Fixed camera, basin, water, block materials, background, first HUD | Reference side-by-side is convincing in framing, silhouette, and material hierarchy |
| 3. Integrated vertical slice | 5–7 days | 8–12 representative puzzles with complete feedback/progression and initial verified special-piece fixtures | New players understand the loop; repeated failures/retries remain responsive |
| 4. Authoring pipeline and special pieces | 5–8 days | Shape/level validation, puzzle editor workflow, production-ready special mechanics | A new ordinary puzzle can be assembled and tested without programming |
| 5. Content production | 10–20 days | Expanded puzzle collection, world progression, all required variations | Every puzzle is solved and reviewed; difficulty progression has playtest evidence |
| 6. Fidelity and release pass | 5–8 days | Performance pass, aspect/input coverage, audio/visual refinement | Final acceptance checklist passes on the selected target hardware |

**Indicative totals:** a convincing vertical slice in roughly 3–5 working weeks; a much larger original-scale content effort in roughly 8–13 working weeks under the stated staffing assumptions. Solo development including all modeling, UI, audio, and testing may take longer. Re-estimate after the slice using measured time per finished puzzle and environment.

The first-ten-days checklist below is an aggressive daily focus sequence for an experienced developer, with reference collection and art blocking overlapping. It is not a second promise that all phase gates—including the finished 8–12-puzzle slice—will be completed within ten days.

### The first ten working days

| Day | Primary objective | End-of-day evidence |
|---|---|---|
| 1 | Lock reference edition, engine project, and coordinate conventions | Build launches; reference board and unknowns list exist |
| 2 | Implement support and ordinary shape prefabs | Rectangle, circle, and triangular block interact correctly |
| 3 | Implement selection, projection, rotation, and validation | Ghost tracks pointer and commit produces a clean body |
| 4 | Add water failure, final-piece flow, and restart | Complete and fail the same puzzle repeatedly |
| 5 | Tune contact feel and save a physics baseline | Videos of flat stack, tower, bridge, and rolling-shape fixtures |
| 6 | Block out final camera, basin, and background | Silhouette overlay aligns with a chosen reference frame |
| 7 | Finish representative shape geometry and materials | One block is approved at actual gameplay size |
| 8 | Add lighting, water reflection approximation, and soft grounding | Visual target survives both static and moving-piece review |
| 9 | Add HUD, inventory, pointer, and feedback timing | Pick/place/fail/succeed all have coherent presentation |
| 10 | Assemble and playtest several contrasting puzzles | Ranked list of the largest remaining gameplay and visual mismatches |

Do not expand the shape catalog until scale, pivot conventions, and collision-authoring policy are stable. Do not produce dozens of puzzles before changing friction, gravity, placement rules, or special-piece load rules; those changes can invalidate previously approved solutions.

### Dependency map and scope gates

```text
Original-edition reference board
        │
        ├─→ Gameplay rule sheet ─→ Physics + placement prototype ─┐
        │                                                       │
        └─→ Composition sheet ─→ Camera + target art scene ───────┤
                                                                ↓
                                                  Integrated vertical slice
                                                                │
                                       ┌────────────────────────┴─────────────┐
                                       ↓                                      ↓
                              Special-piece modules                   Authoring workflow
                                       └────────────────────────┬─────────────┘
                                                                ↓
                                                   Expanded puzzle catalog
                                                                ↓
                                                Fidelity + performance review
```

**First playable:** one complete ordinary puzzle with real collision, selection/rotation/placement, water failure, completion, and immediate restart. A gray basin and placeholder UI are acceptable at this gate.

**Vertical slice:** 8–12 varied puzzles, at least one finished environment presentation, a representative range of shapes/materials, fully integrated UI/audio/feedback, saved progression, and the key original special mechanics exercised in development fixtures. The main screen should already look substantially like the target.

**Expanded game:** original-scale puzzle coverage and environment variation, polished progression, comprehensive solution review, and secondary-mode work only after the core is approved. Original modes that are outside the first solo slice remain explicit backlog items rather than being confused with later-edition features.

## 5. Main gameplay loop and interaction

### 5.1 Implement the loop as an explicit state machine

```text
Loading → Ready
Ready → PreviewingPiece → PlacementRequested
PlacementRequested → PreviewingPiece       [invalid or stale request]
PlacementRequested → Ready                 [committed; inventory remains]
PlacementRequested → CompletionCheck       [committed; final inventory item]
CompletionCheck → Success                  [reference-matched completion rule met]
Ready / PreviewingPiece / CompletionCheck → Failure [authoritative failure]
Failure → Restarting → Ready
Success → NextPuzzle / LevelSelection
Any active state → Paused → previous active state
```

`PlacementRequested` is a short-lived transaction, not a long animation. Record the requested pose and piece identity; validate against the current simulation state; create the released body; then remove exactly that inventory instance. If validation fails, retain the preview and inventory item. A quick double-click must never consume two pieces accidentally.

Keep the rest of the stack simulating while the player is preparing the next piece unless direct reference testing demonstrates otherwise. The held preview must not physically prop up a falling stack. A failure during preview cancels the pending placement and enters failure once.

### 5.2 Selection and piece inventory

Represent inventory instances separately from shape types: a puzzle can contain multiple identical shapes with different instance IDs. Selecting an instance creates a preview, while committing consumes it. Cancellation restores the ready state without altering the inventory.

Keep inventory availability separate from the total remaining set. A Wii-specific retrospective reports that only **three choices** are available at once, with later pieces whited out; the inspected orange screenshot also shows three bottom-row shapes, but does not prove the full refill rule. Prototype a configurable three-choice window and verify replenishment/selection rules before locking content. Do not silently make every remaining piece freely selectable. Re-grabbing a released piece is also an explicit reference question. [G6][V3]

Initially use simple UI thumbnails generated from the same meshes and material palettes used in gameplay. Later match the reference inventory layout, selection highlight, ordering, and depletion treatment. Keep target hit areas comfortable without allowing inventory interactions to accidentally place a piece behind the UI.

### 5.3 Pointer mapping

Map the mouse or virtual controller pointer using `Camera.ScreenPointToRay` through the **gameplay viewport**, then intersect it with the gameplay plane using `Plane.Raycast`. This is preferable to assuming a fixed screen depth, especially if the camera is elevated or tilted. [U15]

Maintain separate values for screen pointer, desired world pose, validated pose, and visible preview. Respect the viewport rectangle and aspect-ratio handling. Test picking near every screen corner and at the waterline. If visual extrusion makes the block appear offset from its collision plane, solve the camera/pivot relationship deliberately; do not add unexplained pointer offsets.

Proposed input actions:

| Action | Mouse/keyboard default | Controller equivalent |
|---|---|---|
| Pointer position | Mouse position | Stick-driven virtual cursor |
| Select/commit | Primary pointer button | Confirm |
| Rotate left/right | Q/E or wheel steps | Shoulder buttons |
| Cancel preview | Secondary pointer button / Escape in preview | Cancel |
| Retry | R plus visible retry affordance | Explicit retry action |
| Pause | Escape outside preview | Menu |

Treat these as desktop mappings for the original interaction intent. The contemporary Cubed3 Wii review explicitly identifies **Wii pointer positioning, A-button grabbing, and D-pad rotation**, and says rotating the Remote is not used to turn pieces. Exact press/release semantics and D-pad directions still need direct verification. Use one input adapter interface so a future infrared-pointer implementation feeds the same selection and placement system. [G4]

Make selection/commit edge-triggered. Decide whether commit occurs on press or release only after reference inspection; retain that choice in a small input policy rather than entangling it with physics code. A cancel action must have unambiguous precedence over pause.

### 5.4 Rotation and held-piece presentation

Author rotations about a consistent shape pivot. Use **45° steps as a provisional prototype setting**, based on a Wii-specific retrospective describing eight directions; the exact step and repeat behavior still need direct verification. Keep the increment data-driven. Optional short **visual-only** easing must not change validation: collision validation and commit use the exact target angle, never an intermediate animated angle. Angle wraparound must preserve the same silhouette and collider pose. [G6]

Start with no inertial throwing: the piece receives the proposed placement pose and a configured release velocity policy, usually zero linear/angular velocity. Pointer movement should not inject unintentional kinetic energy. Verify whether the reference permits deliberate drops or requires initial contact before fixing release rules.

### 5.5 Placement validation

Separate checks into explicit, tunable rules:

1. Is the request from the active attempt, with an available inventory instance?
2. Is the desired pose within authored placement bounds and outside the UI region?
3. Does the candidate penetrate support or released-piece geometry beyond a small permitted numerical tolerance?
4. Does it satisfy any measured contact/support requirement?
5. Does it violate the waterline or an exceptional level rule?

Use a non-interacting query representation of the actual shape, not an axis-aligned bounding box. Bounding boxes can provide a cheap broad phase, but the final answer must respect circles, triangles, concavities, and arbitrary rotation. Query only relevant physics layers and explicitly control whether triggers participate.

Touching is not the same as penetrating. Use distance/contact information where necessary rather than rejecting every overlap result as illegal. Preview validity and committed collision must use the same geometry and tolerances. A proposed tolerance of **0.5–1% of a typical block width** is only an initial investigation range; tune it at the chosen world scale and avoid visible interpenetration.

At commit, validate again on the authoritative simulation boundary because a supporting stack may have moved since the last rendered frame. Queue requests from input and process them in the simulation coordinator. If transform-backed query shapes were moved immediately before the query, synchronize Physics2D transforms deliberately or avoid dependence on unsynchronized transforms by using appropriate explicit-pose queries. Do not enable expensive global synchronization merely to hide an ordering bug.

### 5.6 Success, failure, and retry

Implement a **three-second survival check after the final placement**, with the original's **three bottom-of-screen lights**. This duration and broad condition are explicitly described in the contemporary WiiWare reviews. Keep the precise starting boundary and any motion-related reset behavior configurable until frame inspection resolves them. Do not replace survival above water with a strict velocity-threshold or physics-sleep test. [G3][G4]

On each simulation tick, collect failure facts and completion eligibility, then resolve the outcome in one place. **Proposed arbitration policy: failure wins over success if both become eligible in the same tick**, pending direct parity verification. Use simulation time for gameplay timers, freeze those timers on pause, and use unscaled time only for pause-menu presentation.

Keep physical bodies active during the completion countdown. If adding a settle metric for development, inspect all relevant released pieces and account for angular motion; do not use a sleeping flag as the sole signal. Preserve the distinction between a diagnostic stability measure and the actual victory rule.

On failure: stop accepting placements, show the relevant splash/fall feedback, present retry promptly, and rebuild the initial attempt from immutable puzzle data. Pooling is optional; first make reset correct. Clear contacts, coroutines, timers, temporary collision exclusions, and special-piece state. Proposed responsiveness target: once retry is accepted, restore an interactive puzzle within **0.5 seconds** on the selected target machine, excluding a deliberate reference-matched transition.

After success, lock the accepted outcome before playing celebratory presentation. Decide from reference whether bodies freeze immediately, continue behind the overlay, or transition away; in every case, a late splash cannot revoke saved completion. During pause or lost application focus, suppress pointer commits and resume from a neutral button state to avoid an accidental placement when returning to the game.

### 5.7 Transaction and outcome pseudocode

This describes ownership/order rather than drop-in Unity code:

```text
TryCommit(request):
    reject if paused, terminal, or request.attemptId != currentAttemptId
    reject if request.instanceId is no longer available
    validate canonical shape at request.pose against current simulation state
    if invalid:
        retain preview and inventory; publish invalid-placement feedback
        return

    create/configure physical piece without exposing a partial transaction
    set exact pose, mass/material, behavior state, and release velocity
    consume that inventory instance and remove its preview
    enable the released body in the simulation
    publish PieceCommitted once
    if inventory is empty:
        arm the reference-defined completion check

ResolveCompletedPhysicsStep(stepFacts):
    ignore facts from stale attempts
    if already terminal: return
    update special-piece consequences that belong to this completed step
    if water contact, invalid escape, or other verified failure occurred:
        enter Failure once
    else:
        update reference-defined countdown/eligibility
        if completion is satisfied:
            enter Success once and persist completion
```

Handle any spawn/configuration failure before consuming inventory, or roll back both operations together. This keeps the data invariant intact even while developing new shape and behavior types.

## 6. Physics model and tuning workflow

### 6.1 Use Physics2D as the sole collision authority

The main stacks should use dynamic `Rigidbody2D` bodies, static support `Collider2D` geometry, and appropriate 2D materials. Three-dimensional meshes are visual children or presentation proxies; they must not introduce `Rigidbody`/`Collider` interactions that compete with the 2D simulation.

This choice gives the player a clean planar problem while retaining real depth and lighting. Avoid a 3D rigidbody stack with frozen axes as the initial architecture: it adds 3D contact and constraint behavior without improving the intended planar puzzle. This is a proposed reproduction strategy, not a claim about the original game's physics library.

### 6.2 Shape construction

Use one canonical silhouette to drive both the visual face and collider authoring:

- **Rectangle:** box collider with visually beveled mesh; keep the collision footprint honest.
- **Circle:** circle collider and sufficiently smooth mesh silhouette. Low-poly collision circles produce artificial stable resting angles.
- **Triangle or convex polygon:** polygon collider using meaningful outline vertices, without texture-driven detail.
- **Concave piece:** a verified polygon decomposition or compound arrangement of simple colliders attached to a single body.
- **Hollow or ring-like piece:** author occupied regions explicitly. Never assume a nested polygon path automatically represents an empty hole in the intended way.

Validate collider decompositions for gaps, internal seams, duplicate geometry, and unexpected generated collision shapes. Avoid overlapping collider parts when auto mass is enabled: overlap can distort mass/inertia calculations. Reuse compound shapes only after tests show that pieces slide and roll over their seams cleanly.

Keep bevels primarily visual. If a bevel changes gameplay contact significantly, include it deliberately in the canonical collision silhouette and retest puzzle solutions. A broad visual bevel with a perfectly sharp collision corner can make support appear magical; the mismatch must be smaller than what is visible at gameplay scale.

### 6.3 Initial parameter exploration

Every number in this table is a **proposed starting range**, to be tuned against reference motion and a chosen world scale.

| Parameter | Initial experiment | Why it matters |
|---|---|---|
| Typical block width | Around 1 world unit | Keeps geometry and tolerances comprehensible |
| Fixed simulation rate | Compare 60 Hz and 100/120 Hz | Higher rates may improve thin contacts but cost more CPU and change feel |
| Gravity | Begin with approximately −9.81 units/s² at the chosen scale | Adjust to match visible fall time over a measured screen distance |
| Friction | Test approximately 0.35–0.8 | Too low feels slippery; too high makes implausible stacks |
| Restitution/bounciness | Approximately 0–0.08 | Preserve small impacts without rubbery rebound |
| Linear/angular damping | Begin near zero; introduce small values only when justified | Large damping can conceal errors and erase precariousness |
| Density/mass | Common density or explicit family-based mass profile | Size/shape should have predictable influence on torque |
| Solver iterations | Begin with editor defaults; test a higher preset on failing fixtures | Increase only when evidence shows unresolved contacts/joints |
| Interpolation | Compare interpolated and non-interpolated render motion | Smoothness must not create objectionable cursor/contact mismatch |
| Collision detection | Discrete baseline; continuous for identified tunneling risks | Confirm narrow pieces and fast falls do not cross supports |

Tune in this order: **scale and timestep → geometry → gravity/fall timing → friction/restitution → mass/inertia → solver quality → damping**. Change one family of parameters at a time and keep short annotated recordings. Never make a level solvable by secretly changing a shape's physics unless that difference is an intentional and communicated rule.

### 6.4 Mass and center of mass

Start with homogeneous pieces: mass proportional to occupied 2D area, with constant extrusion depth. Use explicit mass only when reference evidence indicates different material or weight behavior. Compare asymmetric pieces at multiple rotations to catch incorrect pivots or centers of mass.

Add a debug overlay for center of mass, collider outline, contact normals, and optionally a whole-stack center-of-mass projection. These are authoring tools, not necessarily player-facing assistance. The aggregate center of mass can explain a static balance problem but cannot fully predict sliding, rolling, impact, or frictional stability.

### 6.5 Simulation and visual timing

- Read input in the frame/input layer; commit queued physics actions at controlled simulation boundaries.
- Set the spawn pose before making the released body authoritative. Avoid moving dynamic bodies with `Transform` every frame.
- Let interpolated physics pose drive the mesh. Do not add another smoothing layer that makes geometry visibly lag its collision.
- Use a single owner for simulation sequencing. Default fixed-update simulation is sufficient initially; manual simulation is a deliberate later choice requiring a complete loop audit.
- Do not promise bit-identical solutions across platforms. Save puzzle completion, not serialized contact solver state. Reference placement scripts are diagnostics, not proof of cross-platform determinism.

With default fixed-step simulation, ordinary `FixedUpdate` logic runs before that step's simulation and collision callbacks. Do not declare success early in `FixedUpdate` and only afterward discover a water contact from that same step. One straightforward design resolves the previous completed step's buffered facts at the next coordinator boundary, before accepting new placements or advancing the next completion check. A custom post-physics hook is another deliberate design, but is unnecessary if one-tick result presentation latency is acceptable. Document this ordering explicitly.

Useful implementation invariants are:

```text
committed pieces + remaining inventory = initial inventory
    (accounting explicitly for any special-piece destruction)

at most one held preview per player
at most one terminal outcome per attempt
no terminal outcome accepted from an old attempt
preview pose and commit pose use the same canonical shape
all physics-affecting gameplay timers use the same simulation clock
```

### 6.6 Water contact and bounds

Author a logical water surface/sensor independently of the animated material. Align its projected height with the visible water surface where blocks enter it. A sinusoidal normal map must not continually change whether the player loses.

Use trigger/contact observation plus an appropriate supplementary swept/boundary check where a fast or thin piece might skip the sensor between ticks. The rule should use actual shape contact where practical; a rotated piece can touch water while its center remains above it. Keep a separate out-of-bounds fail-safe so an escaping body cannot leave the puzzle permanently unresolved.

Deduplicate contact feedback per piece per attempt. Once failure is decided, later ripples can play without reopening gameplay logic.

### 6.7 Unity 6.6 API choices and traps

Unity documents Physics2D as **Box2D**, separate from 3D PhysX. Use 2D-specific APIs and materials throughout. [U2]

| Task | Unity 6.6 API / design |
|---|---|
| Released body motion | `Rigidbody2D.linearVelocity`, `angularVelocity`, `linearDamping`, `angularDamping` |
| Angular units | `angularVelocity` is **degrees/second**; rotation APIs use degrees |
| Body lifecycle | `bodyType`, `simulated`, `WakeUp()`; configure one authoritative dynamic body per piece |
| Candidate compound overlap | Documented list overload: `Rigidbody2D.Overlap(position, angle, contactFilter, results)` |
| Collider-specific posed query | `Collider2D.Overlap` pose refers to the attached **rigidbody** pose, preserving collider offsets |
| Mass policy | `useAutoMass` plus collider `density`, or explicit `mass`; inspect `worldCenterOfMass` and `inertia` |
| Material policy | `PhysicsMaterial2D.friction`, `bounciness`, `frictionCombine`, `bounceCombine` |
| Physics configuration | `Physics2D.velocityIterations`, `positionIterations`, `simulationMode`, `SyncTransforms()` |
| Deferred collision facts | Copy required values; if callback reuse is enabled, do not retain reused `Collision2D` instances |

These names are verified in the 6000.6 API documentation. Exact material-combine formulas/precedence and any overload with incomplete documentation should be checked against the installed editor before implementation. [U3–U7]

**A kinematic body is not a harmless preview:** by default it can interact with dynamic bodies. A non-simulated body also loses simulation participation, so do not assume its geometry remains usable by every query method. Use a collision-isolated simulated query proxy with tested filters, or explicit shape queries; test the chosen arrangement in a small fixture. Overlap queries ignore contact-filter normal-angle filtering, so overlap alone cannot establish support from below. [U4][U5][U6]

For controller/input setup, the Unity 6.6 documentation identifies Input System **1.20.0** as released for this editor branch. Pin the compatible version actually resolved in the project. Map pointer position via actions, prevent UI/world double-consumption, and give the mouse/controller pointer explicit ownership. [U8]

## 7. Visual recreation pipeline

### 7.1 Camera before detail

Start with an orthographic camera as a controlled prototype, then compare it against the reference's perspective cues. If orthographic framing cannot match the basin ellipse, front/back size differences, and extrusion visibility simultaneously, use a fixed perspective camera with a longer focal length. **Final projection is a reference-matching decision**, not something established by the word “2.5D.”

Keep camera pose and zoom in a named preset. Match the gameplay waterline and support scale first, then basin framing and block side visibility. Do not introduce gameplay camera shake, dynamic zoom, or cinematic angles unless observed in the target sequence; the puzzle needs a stable visual reference.

A slightly elevated camera can show the basin's horizontal water surface and the pieces' top/side faces while the pieces move in XY. That tilt also makes visual contact alignment more demanding: align the collision slice, visible front faces, and support tops in the final view. Use a collision-overlay capture to validate the result.

Choose and document whether the gameplay plane corresponds to the visible front face or the center of the extrusion. A convenient initial convention is **front silhouette at Z = 0, extrusion away from the camera**, with support collision profiles authored in that same slice. This makes pointer-to-face alignment easier to inspect. A center-slice convention can also work, but the visible-depth offset must be incorporated consistently. Use one convention for ordinary pieces, special pieces, supports, preview queries, and reflection proxies.

### 7.2 Block geometry

Create reusable extrusion tooling or a reliable DCC export workflow:

1. Author the 2D silhouette at the canonical unit scale.
2. Generate or model a front and back face with consistent extrusion depth.
3. Add a restrained bevel/chamfer that catches highlights at gameplay size.
4. Assign face and side materials or vertex colors where the reference needs distinct values.
5. Supply stable normals, tangents, and UVs; avoid corner shading artifacts.
6. Export collider data from the same source silhouette, not from the decorative bevel mesh.
7. Inspect the piece on light and dark backgrounds and at all allowed rotations.

A mesh-generation path must triangulate concave faces correctly and treat holes explicitly. Cache generated meshes in authoring/import, rather than rebuilding every frame. For a modest shape catalog, hand-authored meshes may be faster and easier to approve than building a comprehensive procedural modeling system.

### 7.3 Materials and palette

Sample colors from edition-correct references, compensating for capture color differences where possible. Match **perceived value and roughness**, not just RGB swatches. Establish reference-approved material families for ordinary pieces, supports, basin, water, and special pieces.

Begin with URP Lit materials and shared material instances. A custom Shader Graph is justified for repeatable edge tint, face/side differences, or a distinctive special-piece effect. Match the reference's strong but controlled gloss instead of leaving every material at an identical default smoothness.

The inspected references make **graphic surface patterning and glossy highlights** important, rather than optional fine detail. Create reusable blue/halftone, green/white organic, and orange/white diagonal-stripe material families, with additional special-piece looks from reference. Patterns should rotate with the piece and maintain consistent visual scale. Use nonmetallic glossy response for ordinary colored pieces as an initial art approximation, reserving metallic response for the basin/supports where appropriate. A proposed bevel width exploration is **1–3% of a typical block width**, adjusted by camera distance. Review at gameplay scale. [V1–V5]

### 7.4 Basin, supports, and background

Model the basin as separate visible shell/rim/interior elements when that simplifies depth and water sorting. Build support meshes to match their collision top profiles exactly in the gameplay slice, with additional visible depth behind the slice.

Treat the backdrop as an authored composition. Use a low-detail 3D set, image planes, or a mixed approach depending on the camera; a stationary game view rarely needs a complete room. Preserve the observed saturated graphic patterns and botanical silhouettes while controlling local contrast around the stack; do not blur away the original's distinctive backdrop artwork. [V2–V5]

Prefer intentional background softness in assets or a dedicated background treatment over aggressive full-scene depth of field. Screen-space depth of field can blur foreground pieces and mishandle transparent water edges. If it is used, constrain it to a verified reference need and test all stack heights.

### 7.5 Lighting and grounding

Start with a soft-looking key light, environmental fill, and bright, controlled specular highlights that match the glossy reference pieces and rims. Use baked or otherwise inexpensive lighting for static scenery where suitable, with dynamic shading and carefully budgeted shadows for moving pieces. Match the reference's light direction and color before refining shadow resolution.

The important shadow cues are block-on-block contact, support contact, and the relationship between pieces and water. Real shadows are preferable when they render consistently; subtle contact decals or projected soft marks can supplement missing grounding, but must not look like detached dark stickers.

Limit post-processing to a deliberate color grade, optional mild bloom where reference highlights warrant it, and carefully tested ambient occlusion. Heavy bloom, vignette, film grain, and high-contrast tonemapping are easy ways to drift away from a calm, readable puzzle presentation.

### 7.6 Visual asset priorities

| Priority | Asset/work | Approval condition |
|---|---|---|
| P0 | Camera, basin silhouette, waterline, support placement | Main screenshot composition matches |
| P0 | Representative ordinary piece | Outline, thickness, bevel, color, and shading read correctly |
| P0 | Water and grounding | Pieces feel located above/in the basin rather than pasted over it |
| P1 | Inventory, pointer, completion/failure presentation | Interaction reads clearly without obscuring the stack |
| P1 | Full shape and special-piece families | Visual identity remains consistent across sizes and rotations |
| P1 | Environment variations required by reference | Variation supports the same gameplay framing |
| P2 | Background detail and subtle surface wear | Adds resemblance at actual play size |

### 7.7 Definition of a finished visual target scene

The art milestone is one reusable gameplay view, not a disconnected beauty render. It should contain the actual support colliders, several released physics pieces, an active held preview, the real HUD, live water feedback, and both success and failure presentation. Capture it in a player build at the intended viewport size.

Approve three saved arrangements in that scene: a low broad stack, a tall narrow stack, and a mixed-material/special-piece arrangement. A material that works only at one height or against one background value is not finished. Compare the reflection and shadow behavior with the same arrangements, then repeat while pieces are moving.

### 7.8 Concrete URP starting preset

The following settings are **proposed desktop defaults**, not recovered original values. Unity 6.6's core-package index links URP and Shader Graph documentation branch **17.6**; use the patch versions tied to the selected editor. [U9]

| Setting | Initial value / policy |
|---|---|
| Renderer | Universal Renderer, **Forward** |
| Color and buffer | Linear color, HDR enabled; review Neutral tonemapping against reference colors |
| Camera | Fixed orthographic prototype; test roughly **8–12° elevation** before fitting final reference projection |
| Anti-aliasing | Render Scale 1.0, **4× MSAA**, no temporal AA initially |
| Shadows | One main directional key; initial 2048 shadow map, medium soft filtering, short scene-specific distance |
| Shadow cascades | Begin with one for this compact scene; inspect coverage and bias at final scale |
| Fill | Environment/probe lighting and a small number of unshadowed fill lights if required |
| Depth texture | Enable only for effects that need it; water-reading depth starts with copy **After Opaques** |
| Opaque texture | Enable for scene-color distortion only; begin with modest downsampling |
| Depth priming | Disabled for the proposed MSAA configuration |
| Ambient occlusion | Optional Unity-supplied SSAO Renderer Feature, restrained radius/intensity |
| Motion blur / depth of field | Off initially; preserve block edges and readable movement |

URP supplies ordinary soft shadow maps and integrated Volume post-processing. It does **not** supply built-in planar reflections, screen-space reflections, or dedicated contact shadows. A visually soft key is achieved with art direction and shadow filtering, not by assuming a realtime area-light shadow solution exists. MSAA does not remove water specular aliasing; control normal frequency and highlight sharpness. [U10–U13]

## 8. Water, reflections, and effects

### 8.1 Layered water implementation

Build the water in increasing complexity:

1. **Base appearance:** a correctly shaped water mesh, reference-matched color, believable rim intersection, and stable opacity.
2. **Surface motion:** low-amplitude animated normals or procedural ripples. Calm water must not distract from tiny block movements.
3. **Environmental reflection:** a controlled probe/cubemap or authored reflection contribution. This establishes scene coherence without requiring a second real-time camera.
4. **Piece reflection, required for the fidelity slice:** a low-cost reflected visual representation or a controlled planar-reflection pass. The inspected WiiWare references clearly show moving-object-shaped reflections; a static probe is not the finished solution. [V2–V5]
5. **Events:** localized ripple rings, small splash particles, and optional sinking/fading presentation after authoritative failure.

The logical failure plane remains independent throughout. Make ripple amplitude, speed, lifetime, and event intensity data-driven.

### 8.2 Choose a reflection strategy after a target-scene spike

| Strategy | Appropriate use | Cost or limitation |
|---|---|---|
| Probe/cubemap plus authored highlight | Initial water prototype; static surroundings | Does not provide live stack reflections and is insufficient alone for the fidelity slice |
| Reflected render-only piece proxies | Stylized, camera-fixed stack reflection | Must reflect complete pose correctly and clip/mask to water; no colliders; can look flat |
| Dedicated planar reflection camera | Reference visibly requires accurate moving reflections | Extra render work, culling and clipping complexity, platform/API handling |
| Screen-space reflection implementation | Only if already justified by the project | Do not assume a general-purpose built-in URP solution; edge/disocclusion artifacts can distract |

A reflection is a geometric reflection across the water plane, not simply a negative-Y clone with unchanged rotation. Handle winding/normals and the water mask. For a planar camera, reflect the camera and use a proper clip plane, restrict layers, and prevent recursive reflection rendering. Render to a reduced-resolution texture if visual review permits it.

Prototype the cheapest candidate first. Advance only if moving-stack reference comparisons reveal a meaningful fidelity gap.

### 8.3 Transparency and render order

Explicitly test how water, basin rim, supports, reflected objects, particles, and a falling block sort together. Prefer an opaque or controlled alpha-clipped/transparent approach consistent with the desired look rather than relying on transparent sorting to solve intersecting surfaces.

If using scene color or depth in a water shader, enable and validate the relevant URP camera/pipeline textures. Scene-color refraction does not automatically include every transparent object. Account for depth reconstruction and camera projection in shader math; verify behavior in a player build, not just Scene view.

In URP, `_CameraOpaqueTexture` is captured before transparent meshes, and Scene Color samples it. `_CameraDepthTexture` supports depth-based effects. Copying depth after transparent rendering is too late for an earlier transparent-water draw, and it does not make non-depth-writing transparent materials contribute depth. Start with depth after opaques; use water-local XZ for ripples and reconstructed world positions if calculating actual vertical depth. A custom water material needs no custom renderer feature merely to animate normals, sample scene color, or draw analytic ripples. A separate planar camera needs custom setup, but not inherently a custom `ScriptableRendererFeature`. [U10][U14]

### 8.4 Splash and ripple events

Convert the collision/contact position into water-surface coordinates. Spawn a ripple aligned to the horizontal water plane and a restrained upward splash. Drive intensity from a clamped impact measure so a large falling piece feels heavier without overwhelming the screen. Limit repeated contacts from the same body.

Use pooled effects only after measuring their behavior and expected burst count. The first failure must be immediately readable; particles should complement, not delay, retry.

## 9. HUD, menus, audio, and game feel

### 9.1 HUD composition

Implement the inventory, level identifier, progression feedback, pause/retry controls, and completion indicator in a dedicated screen-space UI layer. Match reference placement and visual weight before adding decorative animation. Keep important interactive shapes and pointer feedback within a calibrated gameplay safe region.

Use a Canvas Scaler or equivalent resolution-aware layout with explicit anchors. For aspect ratios that differ materially from the reference, preserve gameplay geometry with a defined viewport and place secondary UI in the remaining space, or letterbox. Do not stretch the puzzle, change support spacing, or silently reveal a larger placement area.

Create original high-quality icons and typography treatments matching the reference's broad visual character. Document font sizes, spacing, colors, selected/disabled states, and transition times as an internal UI style sheet. A clean default Unity button is useful for the prototype but should not survive the fidelity pass.

### 9.2 Feedback timeline

| Event | Visual response | Audio response | Gameplay rule |
|---|---|---|---|
| Inventory focus/selection | Clear selection cue and held preview | Quiet selection cue | No physics change |
| Rotation | Crisp orientation change; short optional visual ease | Subtle tick if appropriate | Exact discrete candidate orientation |
| Invalid placement | Readable preview state | Restrained denial cue, rate-limited | Keep piece available |
| Valid placement | Preview becomes physical piece without a positional jump | Small placement/contact cue | One atomic inventory commit |
| Block collision | Primarily physical motion | Material-aware tap scaled by impact | Rate-limit resting-contact sounds |
| Final-piece countdown | Reference-matched indicator and pacing | Discreet ticks/anticipation if observed | Simulation remains active |
| Success | Clear, calm completion response | Short success motif | Save progress once |
| Water failure | Localized splash and failure cue | Water impact, restrained failure sound | Terminal outcome wins over success |
| Retry | Short transition back to initial layout | Soft reset cue if useful | New attempt ID and clean state |

Sound is important to apparent weight. Use a small family of clean impacts with modest pitch/volume variation, suppress very low-energy persistent contacts, and avoid making a tall stack chatter continuously. Keep music and ambience low enough to hear delicate movement.

For musical direction, retain the original's **rhythmic, playful-but-calm** character rather than replacing it with generic spa ambience: contemporary reviews describe prominent bass beats, quirky effects, world-specific music, and calm female tutorial guidance. Use those descriptions and the developer's in-game-music footage to brief original audio production. [G3][G4][G5]

### 9.3 Frontend and progression

Build level selection from the same stable puzzle catalog used by gameplay. A completion event updates progress and unlock logic; a UI animation merely presents that update. Show completed and available puzzles distinctly. Ensure retry preserves the current puzzle while next-puzzle selection follows the authored ordering/dependencies.

Save at successful completion and other meaningful progression changes, not every frame. Write progress safely using a temporary/replace approach appropriate to the target platform, and recover gracefully from malformed or older-version save data. Progress should remain valid when a puzzle's display name or menu position changes.

The contemporary Wii review describes a **grid-based level selector with one-, two-, or three-circle difficulty/reward markings**, with accumulated circles unlocking worlds. Implement separate completion status, reward value, total earned rewards, and unlock requirements; avoid assuming a simple “finish every level in order” campaign. Exact graph connections and thresholds need direct reference capture. [G4]

## 10. Special pieces and content production

### 10.1 Extend behavior without duplicating the core loop

The original explicitly includes **load-triggered breaking pieces and timer-triggered breaking pieces**. Implement both as small modules sharing placement, collision, and feedback plumbing. The contemporary review says a timed piece begins counting down when another shape is stacked on it; use that as the baseline trigger. Exact time duration, load threshold, indirect-load treatment, and unload/reset rules remain measurement tasks. [G1][G3]

**Breaking is not automatically failure.** Keep `PieceBroken` separate from `PieceContactedWater` and the terminal outcome. A Wii-specific retrospective reports solutions involving deliberate breakage; verify that behavior, and ensure only actual rule-defined failure events end the attempt. Destruction removes the relevant physics shape/mass at the measured event boundary and can cause the remaining stack to fall. [G6]

Each behavior needs a specification with: trigger, warning presentation, delay if any, terminal action, effect on inventory/completion, and interaction with pause/retry. If a piece disappears or breaks, explicitly decide when its collider and mass leave the simulation and when failure occurs.

For load-sensitive behavior, counting raw collision callbacks is incorrect: one supported body can produce multiple contacts, and touching a side is not necessarily resting weight. Track unique body relationships, classify support direction, and test indirect loading if the reference requires it. Prefer a support graph or explicit rule-based count over pretending noisy solver impulses are an exact weight scale.

If indirect load is part of the verified rule, build directed “A supports B” relationships from filtered contacts, collect unique reachable body IDs above the special piece, and guard against cycles. Do not double-count a bridge touching two supports or a compound shape producing several contact points. Whether the rule counts bodies, accumulates mass, or uses some other threshold remains a reference decision. A tiny contact debounce may help numerical chatter, but it must not become an unobserved grace period that changes solutions.

For timed behavior, start from the reported **another shape being stacked on the piece** trigger, then measure the exact qualifying contact and whether unloading pauses or resets it. All special-piece timers use the same simulation clock and reset atomically on restart. [G3]

#### Original challenge variants

- **Height Challenge:** add an authored height target and reference-matched marker. Evaluate the relevant surviving stack geometry, not the selected preview or an airborne decoration. Measure whether the target must be reached momentarily or sustained through completion.
- **Time Challenge:** add an overall puzzle deadline separate from special-piece timers and the three-second completion interval. Measure whether final placement before the deadline is sufficient or completion itself must precede it. Display time pressure only where the original does.
- **Balance Challenge:** author the appropriate movable support/foundation once its behavior is captured. Include its mass and pivot response in the regression fixtures. A merely decorative tilted platform is not a substitute for a physically rocking base if the reference requires one.

The named categories are verified, while these exact predicates remain implementation-time measurement tasks. Preserve reward/difficulty data separately from challenge type. [G1][G3][G6]

### 10.2 Puzzle-authoring workflow

Create a small custom inspector/editor tool after several hand-authored puzzles establish the requirements:

1. Choose environment and camera preset.
2. Place support anchors in the gameplay plane with optional grid snapping.
3. Add inventory instances from a shape palette.
4. Set bounds and any exceptional completion or behavior configuration.
5. Run validation for IDs, collider geometry, support/water alignment, missing assets, and impossible initial overlap.
6. Enter play mode directly into that puzzle with a quick-retry shortcut.
7. Record a successful human solution, screenshots, estimated difficulty, and reviewer notes.
8. Add the approved puzzle to the catalog and progression graph.

Keep a “reference puzzle” tag for layouts used to compare friction, camera scale, and special mechanics. Every physics change reruns that compact set before broader content review.

Useful editor diagnostics include a collider/mesh alignment toggle, water-plane marker, selectable center-of-mass marker, current placement rejection reason, inventory/committed counts, completion timer, current attempt ID, and active special-piece timers. These tools make failures explainable without requiring a large custom editor framework.

### Shape/puzzle approval record

Keep each production approval short and repeatable:

```text
Asset/puzzle ID:
Reference edition and source:
Physics profile revision:
Camera/environment preset:
Geometry and material review passed:
Known successful solution(s):
Intended concept and estimated difficulty:
Observed failure/retry behavior:
Reviewer and date:
Outstanding discrepancies:
```

The physics-profile revision is important: a puzzle approved against an obsolete profile needs revalidation when a change affects its contacts or special rules. Geometry-only fixes that affect silhouettes or collision footprints receive the same treatment.

### 10.3 Vertical-slice puzzle set

Use approximately 8–12 puzzles that exercise distinct risks rather than a long run of similar easy layouts:

- Wide stable support with ordinary blocks: teaches inventory and placement.
- Tall narrow stack: exposes angular drift and feedback clarity.
- Bridge across separated supports: exposes collision seams and torque.
- Circle or rolling shape: tests friction, curvature, and control precision.
- Asymmetric piece: tests pivot and center of mass.
- Mixed large/small shapes: tests mass relationships and inventory readability.
- Concave or compound shape if present in the intended catalog: tests geometry truthfulness.
- Representative verified special-piece puzzle(s): tests state and timer interactions.
- A failure-prone recovery puzzle: tests whether the user can still act while a stack wobbles.

This set is a development coverage plan, not a claim that those exact introductory layouts occur in the original.

### 10.4 Scale content only after the slice is approved

Separate level-layout recreation from level production tooling. When recreating a specific original puzzle, record measured normalized support positions, piece inventory, and rule differences; then solve it under the current physics profile. An approximate geometry match with different friction can change a puzzle's intended difficulty dramatically.

Review progression for introduced concepts, required precision, meaningful alternate solutions, and retry cost. Do not use an unconstrained automated solver as a prerequisite for shipping: human solution validation is more directly useful for this small, contact-rich puzzle game. Lightweight placement-sequence playback can flag regressions, but it should allow physical tolerance and human review.

## 11. Performance and build strategy

The first target is a stable **60 FPS**, corresponding to about **16.7 ms per displayed frame**, on a named baseline device. This is a proposed target, not a hardware claim about the original Wii. Record CPU and GPU time independently in development builds; editor performance is not the acceptance criterion.

| Area | Initial strategy | Optimize only after measuring |
|---|---|---|
| Physics | One 2D body per released piece; modest collider complexity | Reduce collision seams/vertices, profile query frequency, adjust fixed rate/iterations |
| Rendering | Shared meshes/materials, limited lights, one primary shadow source | Reduce shadow distance/resolution, environment overdraw, expensive shader passes |
| Reflections | Probe/authored contribution first | Restrict planar camera layers and resolution; compare visual tradeoff |
| Water/effects | One main surface, restrained particles and ripple count | Reduce transparency overdraw and effect lifetimes |
| UI | Small canvases with predictable update ownership | Separate frequently changing elements if canvas rebuilds are measurable |
| Loading/retry | Keep current puzzle dependencies resident | Pool bodies/effects only if allocations or load stalls require it |

Avoid allocations in repeated collision and placement-query paths where practical. Pre-size reusable buffers and handle query-buffer overflow explicitly rather than silently accepting incomplete results. Pause expensive validation when the candidate pose and relevant scene state have not changed, but invalidate that cache whenever the supporting stack moves.

Profile worst cases: the most pieces, simultaneous failure splashes, the tallest unstable stack, special-piece cascades, and reflection-heavy scenes. Validate both sustained frame timing and first-use hitches. Include shader warmup/variant handling only if actual builds show a relevant first-use problem.

## 12. Verification and acceptance criteria

Testing should protect the difficult physics/state interactions and visual goals, rather than mirror every implementation method.

Use Unity Test Framework Edit Mode tests for pure catalog/rule validation and Play Mode tests for state transitions, sensor behavior, and a small set of physics fixtures. Use the Unity Profiler, Physics 2D visualization, and Frame Debugger during diagnosis. Development screenshots and short recordings remain the primary fidelity evidence; numerical image differences alone cannot judge whether a material or wobble feels right.

### 12.1 Focused automated checks

| Check | Meaningful failure it catches |
|---|---|
| Puzzle asset validation | Missing IDs/assets, bad inventories, invalid support placement |
| Placement transaction | Invalid or duplicate request consumes a piece; stale attempt can spawn a body |
| Outcome priority | Countdown completes on the same tick as water contact and incorrectly grants success |
| Restart isolation | Prior-attempt callback, special timer, or sensor affects new attempt |
| Pause clock behavior | Completion/special-piece timers advance while paused |
| Collision geometry fixtures | Circle facets, compound seams, tunneling, inconsistent placement tolerance |
| Save/load migration | Completed levels disappear after catalog reorder or save-version change |

For physics fixtures, assert behavioral ranges and invariants—no support penetration, no spurious launch, sensible survival/failure—not exact floating-point positions at frame N. Keep a compact golden set of hand-validated stacks across any physics-quality change.

### 12.2 Manual playtest matrix

- Mouse and controller pointer at low and high frame rates.
- Rapid selection/rotation/commit/cancel and retry during effects.
- Piece rotation close to support edges and other pieces.
- UI clicks overlapping the apparent world region.
- Final piece landing while another block begins to fall.
- A thin fast-falling piece crossing the waterline.
- Pausing during countdown and special-piece activity.
- Window focus loss, resizing, widescreen and 4:3 framing policies.
- Level reload and progression persistence after app restart.
- All approved reference stacks on the chosen hardware/build target.

### 12.3 Visual acceptance checklist

- [ ] A gameplay screenshot is recognizably close to the **WiiWare** reference before relying on labels or logos.
- [ ] Waterline, support centers, piece scale, and basin rim align with the composition sheet; use a proposed screen-space tolerance of roughly 1–2% as an initial review aid.
- [ ] The block face/side ratio, bevel readability, material roughness, and key-light direction are consistent with reference.
- [ ] Supports visually contact the same surfaces that support pieces physically.
- [ ] Water reflection and contact effects remain coherent when pieces rotate, fall, and intersect the surface.
- [ ] Background detail never makes tiny stack movements hard to read.
- [ ] UI/inventory treatment matches the chosen edition's composition and remains usable at supported aspect ratios.
- [ ] Effects are reviewed in motion, with clean edges and no conspicuous transparent sorting errors.

### 12.4 Gameplay acceptance checklist

- [ ] Selection, rotation, preview validity, commit, countdown, failure, and retry follow the measured rule specification.
- [ ] Inventory selection order and any restrictions on manipulating released pieces match the reference.
- [ ] Preview position does not jump on placement; held pieces cannot secretly stabilize the stack.
- [ ] Slightly precarious stacks behave plausibly without excessive stickiness, bouncing, or arbitrary damping.
- [ ] Failure is always detected and takes precedence over simultaneous success.
- [ ] Retry returns to the exact authored starting state consistently.
- [ ] Every shipped puzzle has at least one validated human solution under the shipping physics profile.
- [ ] The named baseline hardware sustains the performance target in the worst approved puzzle.

## 13. Main risks and mitigation order

| Risk | Early warning | Mitigation |
|---|---|---|
| Later-port references contaminate the target | Attractive screenshots show different UI/content than original captures | Tag every reference by edition and keep a WiiWare-only comparison board |
| Physics feels wrong despite stable stacks | Pieces behave like rubber, ice, or glue | Match drop/slide/roll timings; tune geometry and material interaction before damping |
| Camera and colliders disagree | Valid contacts appear to float or overlap | Lock the gameplay slice and projection early; inspect collider overlays in Game view |
| Large puzzle library breaks after tuning | Many previously solved levels become impossible | Lock physics after the slice; rerun the golden set before approving any change |
| Water effects consume disproportionate time | Reflection work delays an integrated playable loop | Ship the target-scene spike with the cheapest convincing approximation first |
| Special-piece rules are assumed from another edition | Behavior lacks original evidence | Keep the mechanic configurable and close the reference question before content production |
| Retry leaks transient state | Random delayed failure/success after restarting | Attempt tokens, centralized outcome authority, and reset-isolation checks |
| Overbuilt architecture delays feel | Many abstractions exist but no satisfying complete puzzle | Keep the first milestone one fully playable level; grow tools from real authoring needs |

## 14. Deliverables by discipline

**Engineering:** reproducible Unity project/build profile, reusable puzzle scene, input adapters, validated placement pipeline, physics profiles, outcome/retry state machine, special-piece modules, save/progression service, focused tests, and development overlays.

**Art/technical art:** reference board, composition presets, canonical shape silhouettes and meshes, material library, basin/support/environment assets, water/reflection implementation, effects library, UI style sheet, and before/after fidelity captures.

**Design/content:** original-edition rule matrix, puzzle schema, approved reference fixtures, vertical-slice levels, progression graph, validated puzzle catalog, and solution/difficulty notes.

**Audio:** rhythmic, calm-but-playful world music, restrained ambience, UI cues, impact families, splash, tutorial guidance, success/failure/retry cues, and a balanced mixer setup.

**Release verification:** named target-hardware results, physics regression findings, visual comparison captures, save/load coverage, known issues, and a pinned editor/package manifest.

## 15. Open questions and reference capture tasks

These are concrete parity checks to close during Phase 0 and the prototype. Secondary-source descriptions can establish the broad rule, but they generally cannot recover sub-frame interaction timing or hidden tolerances.

| Question | How to resolve it | Implementation affected |
|---|---|---|
| Exact selection/commit button edge, D-pad direction/repeat, rotation step, and cancel behavior | Record input alongside an original-edition play session; A grab and D-pad rotation are already reported | Input policy and inventory transaction |
| Exact permitted placement distance from supports/other pieces | Attempt placements at progressively larger gaps and against side/underside contacts | Support/contact validator and preview cues |
| Whether a selected piece's orientation persists when switching inventory items | Switch between differently rotated pieces and cancel/reselect | Selection state ownership |
| Three-choice inventory replenishment and released-piece re-selection | Choose items out of order and attempt to select placed bodies | Inventory availability and selection policy |
| Countdown start event and whether wobble delays/resets it | Compare final placement, first contact, visible countdown, and water contact frame by frame | Completion rule and simulation clock |
| Failure boundary at basin edges and below water | Drop/slide pieces at multiple screen positions | Water/bounds sensors |
| Exact special-piece load semantics and timer start events | Test side contact, direct versus indirect stacking, different-sized pieces, and pauses | Behavior modules and support graph |
| Height/time/balance challenge predicates and rewards | Capture target achievement, deadline boundaries, moving foundations, and rewarded clears | Challenge evaluator and progression |
| Final camera projection and block extrusion depth | Compare reference silhouettes and near/far scale across multiple frames | Camera preset and mesh generation |
| Original water reflection extent and occlusion behavior | Inspect tall stack, rotated pieces, and a water-entry sequence | Reflection strategy and masks |
| Exact appearance of all world/environment variations | Build an edition-tagged capture sheet across the original worlds | Environment catalog and art budget |
| Original transition durations and repeat-failure cadence | Time success, fail, retry, and next-level sequences | Feedback timeline and UI flow |

The plan deliberately keeps these behaviors configurable. Close the gameplay-critical questions before large-scale puzzle authoring, and close camera/material questions before producing the full shape/environment catalog.

### Immediate implementation ticket order

After resolving the essential reference questions, begin work in this order:

1. **Create the project and physics fixture scene.** Acceptance: a rectangle and circle fall onto an accurately aligned flat support in a player build.
2. **Create the canonical shape/piece data path.** Acceptance: inventory preview, visible mesh, collider, and mass originate from one shape definition.
3. **Implement pointer projection and rotation.** Acceptance: the selected piece tracks accurately across the complete gameplay viewport and uses the approved rotation increment.
4. **Implement transactional placement.** Acceptance: valid commits create one body; invalid and duplicate requests preserve inventory correctness.
5. **Implement outcome arbitration and clean retry.** Acceptance: a water failure and simultaneous completion cannot both win; repeated restarts have no stale state.
6. **Lock one camera/basin composition.** Acceptance: a reference overlay aligns the principal silhouettes and waterline.
7. **Approve one block material and water treatment.** Acceptance: they read correctly at actual gameplay scale in both motion and stills.
8. **Integrate the first complete puzzle presentation.** Acceptance: select → rotate → place → settle → succeed/fail → retry is coherent with final-style feedback.
9. **Expand to the vertical-slice coverage set.** Acceptance: varied geometric and special-mechanic risks are exercised before scaling content.
10. **Build the authoring workflow and expand the catalog.** Acceptance: content can be added, validated, solved, and reviewed without changing runtime code.

## 16. Reference findings and implementation decisions

### 16.1 Original-release rule matrix

| Detail | Evidence status | Decision for this plan |
|---|---|---|
| 100 levels / four worlds | Verified developer specification, with contemporary corroboration [G1][G2][G3] | Full original-scale content target; slice remains 8–12 puzzles |
| “14 Shapes + 2 Special Shapes” | Original developer wording [G1] | Audit the catalog; do not assume this proves sixteen different geometric silhouettes |
| Three-second final survival check | Two contemporary reviews [G3][G4] | Implement three seconds and three lamps; measure exact start/reset semantics |
| Wii pointer, A grab, D-pad rotation | Contemporary Wii review [G4] | Pointer-based desktop equivalent; do not use wrist-twist rotation as the reference |
| 45° rotation | Plausible from retrospective “eight directions,” not directly measured [G6] | Provisional configurable default |
| Contact-only placement / overlap restriction | Not established by inspected written sources | Prototype contact gating and non-overlap validation as explicit policies; measure before claiming parity |
| Three-choice inventory | Retrospective report plus a compatible still image [G6][V3] | Configurable availability window; verify refill order |
| Breaking under load; breaking after a timer | Developer and contemporary review [G1][G3] | Required original mechanics; timer starts when loaded according to review |
| Exact fragile threshold / timed duration | Not established by primary/contemporary evidence | Do not bake guessed constants into puzzles |
| Breaking itself is failure | Not established; retrospective mentions deliberate breakage [G6] | Separate destruction and failure |
| Balance, Height, Time Challenges | Developer explicitly names these [G1] | Include challenge data, predicates, HUD, and relevant support behavior |
| Arcade solo plus drop-in two-player cooperation | Developer/Nintendo/reviews [G1–G4] | Solo first; optional second-pointer extension after slice |
| Two-player split-screen Versus | Developer/Nintendo/reviews [G1–G4] | Original-mode backlog; duplicate session/viewport with isolated physics worlds if implemented |

For optional Versus, isolate each puzzle's collisions using separate Physics2D scenes or safely separated world regions and viewport-specific pointer projection. For cooperation, use one shared session with per-player previews and atomic inventory reservations. These are later implementation recommendations; the initial schedule centers on the requested solo loop.

### 16.2 Edition boundaries and source disagreements

Use **100 levels and four worlds**, not the later 200-level campaign. The Wii U review documents later features including Endurance, Tower Tumble, five-player cooperation, online/team play, and GamePad controls. It also calls the original competitive mode “now known as Swift Stacker”; the original developer calls it **Versus**. Those later labels and features are not requirements for the original WiiWare slice. [G1][G7]

Some secondary numbers disagree: Cubed3 says roughly 30 puzzles per world and gives a different Versus match-length description from Nintendo Life. Prefer the original developer's exact 100-level total; leave exact competitive match settings to direct verification. A retrospective gives 25 puzzles per world and specific unlock/load thresholds, but these should remain provisional rather than being promoted to recovered constants. [G1][G3][G4][G6]

### 16.3 Visual evidence limits

Six still images were inspected: four from Nintendo Life's WiiWare review/gallery and two associated with Cubed3's Wii review. They support the concrete visual targets in Section 2.3. The original developer's gallery and downloadable videos were located, but direct developer image retrieval failed during final checking and **video playback was not frame-inspected**. Therefore this plan does not claim measured camera angles, shader algorithms, exact motion timings beyond written review evidence, or frame-accurate control behavior.

That limitation does not prevent implementation: the architecture and proposed defaults are specified above, with a finite list of parity measurements in Section 15. The development loop should replace each provisional setting with measured behavior as soon as a playable reference capture is available.

## 17. Sources and technical documentation

Sources were researched for this plan on **September 23, 2026**. Bracketed IDs in the body refer to the entries below. Unity documentation is versioned to `6000.6` where available; package patch selection remains tied to the installed editor.

### Game rules and original-release context

- **[G1] Shin’en Multimedia — [Art of Balance: About, original Wii site](https://art-of-balance.shinen.com/wii/about.php).** Undated surviving original microsite, associated with 2010 release news. Primary source for 100 levels/four worlds, shapes, original modes, and challenge categories.
- **[G2] Nintendo UK — [Art of Balance, WiiWare](https://www.nintendo.com/en-gb/Games/WiiWare/Art-of-Balance-284413.html).** Publication date unstated; lists European release March 26, 2010. Original platform, control, level-count, and multiplayer description.
- **[G3] Corbie Dillard, Nintendo Life — [Art of Balance Review (WiiWare)](https://www.nintendolife.com/reviews/2010/02/art_of_balance), February 18, 2010.** North American version. Three seconds/three lights, special pieces, challenge variants, modes, presentation, and screenshots.
- **[G4] Shane Jury, Cubed3 — [Art of Balance Review, Wii](https://www.cubed3.com/games/reviews/wii/art-of-balance-3), April 20, 2010.** Pointer/A/D-pad description, completion, grid/circle progression, themes, and audio. Some quantities disagree with stronger sources; current image paths are dated 2024.
- **[G5] Shin’en Multimedia — [Original Wii gallery](https://art-of-balance.shinen.com/wii/gallery.php), [video page](https://art-of-balance.shinen.com/wii/video.php), and [homepage/news](https://art-of-balance.shinen.com/wii/).** Gallery sections dated November 2009 and January 2010; videos dated January–March 2010. Original media discovery sources.
- **[G6] Nicolas Hamel, Planned All Along — [Art of Balance](https://plannedallalong.blogspot.com/2015/11/art-of-balance.html), November 27, 2015.** Wii-specific retrospective; used cautiously for rotation, inventory, special-piece, and progression leads.
- **[G7] Daan Koopman, Nintendo World Report — [Art of Balance Wii U Review](https://www.nintendoworldreport.com/review/38619/art-of-balance-wii-u-review), September 29, 2014.** Used to distinguish later-edition content/features, not as the original visual target.

### Inspected still-image references

- **[V1] Nintendo Life — [Icon Selection screenshot](https://images.nintendolife.com/screenshots/21806/large.jpg).** Warm orange/yellow menu, rounded icon panel, title treatment, A/B prompts, patterned shape icons. Linked in the 2010 WiiWare review.
- **[V2] Nintendo Life — [Blue pieces above striped beam](https://images.nintendolife.com/screenshots/21812/large.jpg).** Blue patterned glossy shapes, hand pointer, bright rims/highlights, pink-gray graphic backdrop, airborne white flecks, reflective basin. Linked in the 2010 WiiWare review.
- **[V3] Nintendo Life — [Orange background / opposed supports](https://images.nintendolife.com/screenshots/21810/large.jpg).** Rectangular reflective tray, bamboo, slanted gray supports, selected piece and bottom-row choices. Linked in the 2010 WiiWare review.
- **[V4] Nintendo Life — [Blue botanical backdrop / green patterned stack](https://images.nintendolife.com/screenshots/21809/large.jpg).** Glossy green/white pieces, ghost-like outlined silhouette, hand pointer, square marker, visible stack/plant reflections. WiiWare gallery image.
- **[V5] Cubed3 — [Solo countdown screenshot](https://www.cubed3.com/wp-content/uploads/2024/05/art-of-balance-retro-screenshot-art-1.jpg) and [split-screen screenshot](https://www.cubed3.com/wp-content/uploads/2024/05/art-of-balance-retro-screenshot-art-2.jpg).** Round basin, botanical/graphic scenes, blue pieces; solo frame shows the three-lamp capsule. Current-hosting provenance qualification is noted in Section 2.3.

### Original developer footage for implementation-time measurements

- [February 2010 gameplay MP4](https://art-of-balance.shinen.com/wii/video/shinen_artofbalance_gameplay_neutral_ws_1500kbit.mp4) — developer page lists 2:25, 60 fps, with in-game music; announced February 17, 2010. Playback not inspected for this plan.
- [March 2010 European trailer MP4](https://art-of-balance.shinen.com/wii/video/shinen_artofbalance_eu_ws_4mbit.mp4) — developer page lists 1:12, 60 fps, with in-game music. Playback not inspected for this plan.
- [January 2010 trailer MP4](https://art-of-balance.shinen.com/wii/video/shinen_artofbalance_neutral_ws_4mbit.mp4) — developer page lists 1:12, 60 fps. Playback not inspected for this plan.

Video encoding frame rate is not proof of original runtime performance. Prerelease gallery images may differ from the shipped build.

### Unity 6.6 engineering documentation

- **[U1] Unity — [6.6 manual](https://docs.unity3d.com/6000.6/Documentation/Manual/UnityManual.html), [6000.6.0f1 release notes](https://unity.com/releases/editor/whats-new/6000.6.0f1), and [6000.6.1f1 release notes](https://unity.com/releases/editor/whats-new/6000.6.1f1).** The latter is dated September 16, 2026; not asserted to be the newest available patch.
- **[U2] Unity — [Physics integrations](https://docs.unity3d.com/6000.6/Documentation/Manual/physics-integrations.html) and [2D physics manual](https://docs.unity3d.com/6000.6/Documentation/Manual/2d-physics/2d-physics.html).** Box2D/PhysX distinction and 2D entry point.
- **[U3] Unity — [Rigidbody2D](https://docs.unity3d.com/6000.6/Documentation/ScriptReference/Rigidbody2D.html) and [Physics2D](https://docs.unity3d.com/6000.6/Documentation/ScriptReference/Physics2D.html).** Current body properties, motion, mass, solver/query controls, and angular units.
- **[U4] Unity — [Rigidbody2D.Overlap](https://docs.unity3d.com/6000.6/Documentation/ScriptReference/Rigidbody2D.Overlap.html) and [Collider2D.Overlap](https://docs.unity3d.com/6000.6/Documentation/ScriptReference/Collider2D.Overlap.html).** Posed geometry queries, filtering, and result storage.
- **[U5] Unity — [Rigidbody2D.simulated](https://docs.unity3d.com/6000.6/Documentation/ScriptReference/Rigidbody2D-simulated.html).** Simulation participation implications.
- **[U6] Unity — [Rigidbody2D.useFullKinematicContacts](https://docs.unity3d.com/6000.6/Documentation/ScriptReference/Rigidbody2D-useFullKinematicContacts.html).** Kinematic contact behavior.
- **[U7] Unity — [PhysicsMaterial2D](https://docs.unity3d.com/6000.6/Documentation/ScriptReference/PhysicsMaterial2D.html).** Friction, restitution, and combine controls.
- **[U8] Unity — [Input System for 6000.6](https://docs.unity3d.com/6000.6/Documentation/Manual/com.unity.inputsystem.html) and [Input System 1.20 manual](https://docs.unity3d.com/Packages/com.unity.inputsystem@1.20/manual/index.html).** Package compatibility and action-based input.
- **[U9] Unity — [Core packages](https://docs.unity3d.com/6000.6/Documentation/Manual/pack-core.html).** URP/Shader Graph documentation branches tied to Unity 6.6.
- **[U10] Unity — [Universal Renderer reference](https://docs.unity3d.com/6000.6/Documentation/Manual/urp/urp-universal-renderer.html) and [URP asset reference](https://docs.unity3d.com/6000.6/Documentation/Manual/urp/universalrp-asset.html).** Rendering paths, texture/depth settings, lighting, and shadows.
- **[U11] Unity — [Render-pipeline feature comparison](https://docs.unity3d.com/6000.6/Documentation/Manual/render-pipelines-feature-comparison.html).** Supported reflection/shadow features and URP omissions.
- **[U12] Unity — [Anti-aliasing in URP](https://docs.unity3d.com/6000.6/Documentation/Manual/urp/anti-aliasing.html).** MSAA/post-AA tradeoffs and incompatible combinations.
- **[U13] Unity — [Post-processing in URP](https://docs.unity3d.com/6000.6/Documentation/Manual/urp/post-processing-in-urp.html) and [pre-built renderer features](https://docs.unity3d.com/6000.6/Documentation/Manual/urp/urp-renderer-feature-landing.html).** Volumes and optional supplied renderer features.
- **[U14] Unity — [Scene Color node](https://docs.unity3d.com/Packages/com.unity.shadergraph@17.6/manual/Scene-Color-Node.html), [Scene Depth node](https://docs.unity3d.com/Packages/com.unity.shadergraph@17.6/manual/Scene-Depth-Node.html), and [custom rendering in URP](https://docs.unity3d.com/6000.6/Documentation/Manual/urp/customizing-urp.html).** Water shader inputs and custom-pass boundaries.
- **[U15] Unity — [Camera.ScreenPointToRay](https://docs.unity3d.com/6000.6/Documentation/ScriptReference/Camera.ScreenPointToRay.html) and [Plane.Raycast](https://docs.unity3d.com/6000.6/Documentation/ScriptReference/Plane.Raycast.html).** Pointer-to-gameplay-plane mapping.

**Recommended first milestone:** a single fully playable puzzle in a reference-aligned basin, with patterned glossy pieces, coherent water reflections, accurate pointer placement, the three-light completion check, and fast clean retry. That milestone proves the visual identity and the main loop together and provides the foundation for every subsequent level.
