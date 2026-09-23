# COMBINED MARKDOWN - docs

_Generated 2026-09-23 17:08:26 | 4 files | folder: D:\stuff\docs\taylor_fv\github\rayrite.github.io\bsh\docs_

## Contents

1. Frame_Rate_and_Event_Driven_Design_Deep_Dive.md
2. Unity65_From_Scratch_WiiWare_Recreation_Plan.md
3. Unity6_Upgrade_and_Performance_Modernization_Plan.md
4. Weighted_Shapes_SOLID_EDD_Deep_Dive.md

---

<!-- ====================================================================== -->
<!-- FILE: Frame_Rate_and_Event_Driven_Design_Deep_Dive.md -->
<!-- ====================================================================== -->

# Frame-rate and event-driven design deep dive

**Project:** Balance Stack Hero · **Analysis:** 2026-09-23 · **Current:** Unity 2023.1.6f1 · **Target:** Unity 6000.5.0f1.

## 1. Recommendation and evidence

First fix main-thread blocking and reentrant stack processing; then eliminate idle polling and redundant presentation updates. Retain the small amount of continuous work needed for physics and manipulation. Merely changing an `Update()` call into a delegate invoked every frame does not reduce its cost.

Primary evidence is the existing [SpawnManager companion](SpawnManager.cs.md), [ShapeController companion](ShapeController.cs.md), [GameManager companion](GameManager.cs.md), and [LevelManager companion](LevelManager.cs.md). Their method catalogs and critical interpretations were checked against the corresponding source methods. Recommendations below are **Inferred from architecture patterns**, not measured improvements. Migration context and official references are in the [master plan](Unity6_Upgrade_and_Performance_Modernization_Plan.md). Geometry/rules are specified in the [weighted-shape deep dive](Weighted_Shapes_SOLID_EDD_Deep_Dive.md).

**Confirmed from companion docs:** four gameplay scripts contain useful `Update()` work; `ShapeController` also has useful `LateUpdate()`. Ten scripts have empty `Update()` callbacks. `SpawnManager.LateUpdate()` is comment-only. No `FixedUpdate()` is declared in `Assets/Scripts`; this statement does not cover every third-party asset. `CameraController` does not currently implement camera following despite its comments.

**Source/configuration confirmation:** fixed timestep is 0.02 s (50 physics steps/s), maximum allowed timestep 0.33333334 s; legacy input is selected. Built-In rendering is configured globally, and no URP/HDRP package is declared. Current frame time, GPU bottleneck, device tier, active prefab count, and shipping platforms are unknown.

## 2. Priorities: what actually threatens responsiveness

| Priority | Finding and location | Proposed change | Expected effect / risk |
|---|---|---|---|
| P0 | `SpawnManager.LevelClearShapes`, source L1454–1468, starts delayed coroutines then busy-waits for their flags | One cancellable cleanup transaction with a completion notification; no blocking wait | Removes a deterministic deadlock path, rather than a fractional FPS improvement; medium sequencing risk |
| P0 | `GetStackInformation` performs all work before `yield break`; `ShapeDestroyer` can trigger another rebuild | Queue invalidations; one coherent stack transaction per completed simulation step | Prevents reentrancy and duplicate work; high gameplay-order risk |
| P0 | `LevelManager.Update` can call both `LevelWon` and `LevelLost` in one frame | Single terminal-state owner and explicit failure-first precedence | Prevents duplicate rewards/UI and inconsistent results; preserve recorded rules |
| P1 | `GameManager.Update` starts `ProcessCtrlGesture` every moving-drag frame | Restart one deadline on movement; one gesture state owner | Eliminates concurrent waits, penetration calls, and races |
| P1 | `GetShapeData2` compares all played shapes and all root colliders with AABBs | Maintain contact ledger and recompute graph only on meaningful changes | Removes repeated O(N²C²) broad comparisons; changes incorrect contact semantics intentionally |
| P1 | `SetAllShapeFaces` refreshes all objects and starts infinite fades repeatedly | Emit weight/style deltas; one owned tween per view | Reduces tween accumulation, lookups and renderer state changes |
| P1 | Per-frame clock `string.Format` and countdown `ToString` | Clock deadlines; emit only when displayed integer changes | Reduces managed allocation and canvas rebuild work |
| P2 | Debug held-key scanning and repeated logs in `SpawnManager.Update` | Development-only action map and explicit commands | Stops repeated level-maker commands in production |
| P2 | Ten empty Updates plus empty LateUpdate | Remove the empty methods after usage/source check | Small dispatch cleanup; not a substitute for fixing dominant costs |

Do not claim an FPS percentage before capturing a player profile. A frame bounded by water reflections or outlines can remain GPU-bound after every script improvement.

## 3. Complete game-script loop triage

Classification numbers follow the supplied prompt: **1** keep tick; **2** throttle; **3** event; **4** timer/coroutine; **5** animation event; **6** physics callback; **7** input callback; **8** state transition; **9** unknown. Empty methods are removed, not replaced by artificial events.

| Script / method | Current responsibility / why it runs | Classification and replacement | Benefit | Complexity / gameplay risk |
|---|---|---|---|---|
| `GameManager.Update` | Accumulates session and unused ad time | 4/8: session clock captures accumulated elapsed and running start timestamp | No per-frame counters; clear pause semantics | Low / scaled-time differences |
| Same | Held left/right rotation | 7 + 1: callbacks set direction; active manipulator integrates while held | Input parsing decoupled, idle manipulator off | Medium / continuous input must stay continuous |
| Same | Up/down changes speed by 0.1 per frame | 7/4: explicit press/repeat rate, with bounds | Refresh-rate-independent tuning | Low / deliberate behavior correction |
| Same | `dragdelta` polling, gesture coroutine, 45° accumulation | 7/4/8 plus selected-only tick | Eliminates overlapping routines and work without a selected object | Medium / release/cancel order |
| `ShapeController.Update` | Mirrors Lean selection on every instance | 7/8: Lean `OnSelect`, `OnSelectUp`, `OnDeselect` adapter | Removes idle shape polling | Medium / deselection also raises release in this Lean version |
| Same | Reads one collider `bounds.max.y` when touched/resting | 6/2: update aggregate bounds for awake/moved bodies; final sample when settled | Correct compound height, avoids sleeping work | Medium / must refresh on wake and scripted movement |
| Same | Popup follows transform | 1: parent world-space popup when appropriate, or active-only LateUpdate for screen-space projection | Avoids idle popup work | Low / camera and canvas coordinate spaces |
| `ShapeController.LateUpdate` | Dock threshold, selection, release, trigger/kinematic flags, scaling | 7/8: explicit state transitions; selected pose stream evaluates boundary | Set physics flags once on transitions | High / selection and transform order |
| Same | Drop raycast | 8: placement command once; finite fallback on miss | No repeated placement queries; safe score | Medium / scoring changes require baseline |
| `SpawnManager.Update` | Debug keys, deletion/cycling/restart coroutines and logs | 7/3: development input → serialized command processor | No idle debug scanning in player; command coalescing | Medium / held-repeat semantics |
| `SpawnManager.LateUpdate` | Only commented prototypes | Remove | Minor dispatch cleanup | Low |
| `LevelManager.Update` | Gameplay stopwatch and integer clock text | 4/2: one session clock; refresh at displayed-second boundary | Fewer strings and UI invalidations | Low / pause and reset semantics |
| Same | Countdown and win/fall polling | 4/6/8: deadline + hazard events → terminal arbiter | Deterministic outcome and single persistence write | High / simultaneous failure/expiry |
| `CameraController.Update` | Empty | Remove; shake coroutine remains tick-driven while active | Minor | Low |
| `DockColliderController.Update` | Empty | Remove; dock geometry changes get explicit config event | Minor | Low |
| `DurationScale.Update` | Empty | Remove; existing active animation remains frame-stepped | Minor | Low |
| `FloorColliderController.Update` | Empty | Remove; keep collision/hazard callbacks | Minor | Low |
| `Loader.Update` | Empty | Remove; explicit bootstrap replaces assumed initialization | Minor | Low |
| `PlatformController.Update` | Empty | Remove; keep contact adapter | Minor | Low |
| `RdWAnalytics.Update` | Empty | Remove | Minor | Low |
| `ScoreEffect.Update` | Empty | Remove; restartable animation triggered by score event | Minor | Low |
| `ScoreManager.Update` | Empty | Remove; calculations on committed stack/result snapshot | Minor | Low |
| `UIManager.Update` | Empty | Remove; subscribe presenters to state changes | Minor | Low |

Other scoped scripts declare no Update/FixedUpdate. `AnimatedButton` is already pointer-event driven: fix its recursive `onClick` getter and repeated delayed invokes. Use class 5 (animation event) only if command timing truly depends on an authored clip; a button animation should not own level state or prevent keyboard activation.

## 4. Proposed ownership and delegate contracts

```text
Lean / Input System → InputAdapter → PlacementController → ShapeState
                                           ↓                  ↓
Physics callbacks → ContactLedger → StackService → RuleEvaluator
                                           ↓                  ↓
                                     snapshot/deltas     command queue
                                           ↓                  ↓
                             presenters / score       session/removal owner
```

| Owner/event | Emitter → listeners | Payload | Ordering / failure handling |
|---|---|---|---|
| `SelectionChanged` | Input adapter → manipulator, dock presenter | session, shape handle, pointer ID, selected state | One logical release despite Lean up+deselect; cancel on focus loss |
| `PlacementCommitted` | Placement controller → registry, rule coordinator | shape handle, final pose, sequence, validated drop height | Register before publish; rejected pose never decrements tray |
| `ContactsChanged` | Contact ledger → stack service | simulation step, revision, affected shape handles | Coalesce into dirty graph; never solve recursively in callbacks |
| `StackCommitted` | Stack service → score/level evaluator | session, graph revision, counts, aggregate height | Immutable/read-only snapshot valid for documented lifetime |
| `WeightChanged` | Stack service → matching shape presenter | session, shape generation, revision, old/new count, style band | Emit after full solve; stale generations discarded |
| `ClockDisplayChanged` | Clock presenter/service → HUD | clock ID, displayed second | Emit only on integer change; precise deadline remains separate |
| `ShapeRemovalCommitted` | Removal owner → ledger, tray/history, VFX/audio | shape handle, reason, pose | Logical removal and collision disabling before deferred Destroy |
| `SessionOutcomeChanged` | Session state machine → HUD, score persistence, audio | session ID, won/lost, reason, final snapshot | Once only; hazard committed in same step beats success |

Use typed instance `event Action<T>` delegates for code-to-code notifications. Keep commands as explicit method calls to the authoritative owner, rather than events with an unspecified number of command executors. Use UnityEvents only where inspector wiring is intentional. ScriptableObject channels can bridge scenes, but must have session filtering and explicit reset; assets must not retain dead scene listeners.

### Safe subscription pattern (illustrative C#)

```csharp
// Bind is called by the composition root before activating a pooled view.
public void Bind(IWeightReadModel source, ShapeHandle handle)
{
    Unsubscribe();
    this.source = source;
    this.handle = handle;
    if (isActiveAndEnabled) SubscribeAndRefresh();
}
private void OnEnable() => SubscribeAndRefresh();
private void OnDisable() => Unsubscribe();
private void SubscribeAndRefresh()
{
    if (source == null || subscribed) return;
    source.WeightChanged += OnWeightChanged;
    subscribed = true;
    Refresh(source.Read(handle)); // late subscribers receive current state
}
private void Unsubscribe()
{
    if (!subscribed) return;
    source.WeightChanged -= OnWeightChanged;
    subscribed = false;
    StopOwnedVisualTween();
}
```

Contract: main-thread publication; no handler awaits or mutates stack collections during publication. Domain listener failures fail a development test loudly. Optional audio/VFX listeners may be isolated/logged by their adapter so a visual exception cannot invalidate a committed result. Avoid closures in hot callbacks; preallocate queues; unsubscribe the same method instance. Reset per-session service instances on restart. Disable/remove adapters explicitly: Unity can deliver collision messages to disabled MonoBehaviours [P2].

## 5. Shape manipulation state machine

States: `Docked → Selected → Previewing → Released → Active → Removed`; `Selected/Previewing → Returning → Docked`; `Locked` is an eligibility property. Motion/rest is a separate physical status, not an alternative placement state.

1. Selection callback resolves the shape once, caches its collider list and rotation adapter, and reserves pointer ownership.
2. Selected-only pose updates evaluate dock boundary and penetration when pose changes beyond an agreed tolerance. A pose event may occur each frame while dragging; this is necessary active work.
3. Return-to-dock triggers one owned tween sequence. Its completion changes state. Restart/disable cancels it; completion checks session and shape generation.
4. Valid release validates final pose, switches collider/kinematic settings once, and registers the placement once.
5. Physics contacts wake support processing. A bounded active-body sampler observes linear **and angular** motion for settling. Do not zero velocity solely to label an object resting: that changes gameplay.
6. Settled objects leave active sampling after a final bounds sample. Wake/contact, impulses, moving supports, gravity changes, teleports, and collider edits re-enroll them. Sleep is a performance state, not a guarantee of puzzle completion.

The installed `LeanSelectable` exposes `OnSelect`, `OnSelectUpdate`, `OnSelectUp`, `OnDeselect` and static global events. `OnSelectUpdate` itself is per-frame, so use it only for the current selection. Its source says `OnDeselect` can first invoke `OnSelectUp`; deduplicate by placement state and pointer/selection generation.

## 6. Scheduling without polling everything

### Physics boundary

For the initial refactor, a single coordinator `FixedUpdate` processes the **previous completed physics step's** staged contacts before the next simulation. This introduces up to one fixed-step rule latency and must be an explicit acceptance criterion. It is not a post-physics callback. For exact same-step semantics, install a verified PlayerLoop callback after physics or own manual `Physics.Simulate`; those are later, higher-risk options.

Process: removals/config changes → staged contact changes → graph solve → special-rule decisions → outcome arbitration → publish → presentation. Events generated while processing are queued for the next transaction. At restart, increment session epoch before cancelling timers and clearing state. A pending final countdown cannot declare victory while contacts/hazards for the relevant step remain unprocessed.

No normal contact stay should trigger a graph solve unless its directional support classification changes. Sleeping contacts persist; absence of a stay is not an exit. Reconcile after collider enable/disable, teleport, pooling, and scene unload.

### Timers

Use a central scaled gameplay clock (`double` elapsed/start/deadline), and a separate unscaled UI clock. A timer service can tick once per frame with only active timers; for this small game a compact active list is sufficient. A min-heap is justified only with many scheduled timers. Events do not make time advance by themselves.

Gesture debounce: each meaningful drag sets `resumeAt = now + rotationPause`. The active manipulator checks that one deadline. Do not start one coroutine per movement event. Keep rotation integration while held; reset carry and selection generation on switch. If preserving 45° stepping, subtract each applied step from the accumulator rather than discarding excess, with a catch-up cap to avoid burst rotation after a hitch.

Countdown: store exact expiry and display `ceil(max(0, expiry-now))` if that matches approved UX. Current code uses `N0` rounding; switching to ceil is an intentional visual fix. A failure request wins over expiry in the same authoritative transaction. Pausing freezes scaled deadlines; menu animations/audio policy can continue unscaled.

### Nonblocking cleanup

`RequestRestart` enters `Clearing`, locks new placement, invalidates old session callbacks, cancels timers/tweens, unregisters shapes and contacts, disables gameplay colliders, then destroys or pools visuals. Complete the clear after all logical records are gone and scheduled work is cancelled; if an end-of-frame visual barrier is needed, yield rather than spin. Only then load/spawn the next level. A missing completion is a logged timeout, never a busy wait.

## 7. Work and allocation budget

Let N be active shapes, C average colliders per shape, E actual shape support edges, K changed contact pairs, W weighted/rule roots. Current broad comparisons are approximately O(N²C²), plus recursive traversals, linear `Contains`, array snapshots, and formatting. Proposed contact ingestion is O(K) average map work; simple exact per-root traversal is O(W(N+E)) per dirty transaction. Recomputing all score counts costs O(N(N+E)). **Idle graph solve count should be zero.** Dense or continually moving graphs still cost work; EDD does not change worst-case reachability complexity.

For the current small board, prefer the straightforward tested traversal. At 64–256 shapes, profile and consider SCC condensation with bitsets, or reverse-reachability dirty ancestors. Deletions invalidate both old and new ancestor sets; an optimization that only updates new ancestors leaves stale weights.

Allocation removals:

- Replace per-query `GetComponents` with a registered collider list, including child colliders whose `attachedRigidbody` belongs to the shape.
- Eliminate `ToArray` snapshots by staging mutation outside iteration, not by iterating a collection that listeners mutate.
- Remove unused string construction (`GetStackInfo.m`, `GetShapeInfoAbove.m`) even where the eventual log is commented out.
- Use reusable contact buffers (`Collision.GetContacts`), visit stamps, stacks, command sets, and nonboxing value payloads. Saturated buffers must grow/retry or report an incomplete snapshot; never silently drop a contact.
- Warm pools and dictionaries for expected board size. Growth during level load is acceptable; aim for zero managed bytes in steady-state contact/graph handling after warm-up.
- Cache renderer/outline references and shader property IDs. Do not access `renderer.material` repeatedly just to read/set a value.
- Verify `MaterialPropertyBlock` versus SRP Batcher behavior in the eventual pipeline; property blocks are not universally the fastest choice.

## 8. Rendering, physics, and UI beyond Update

Profile CPU and GPU independently. Inspect EPOOutline, HighlightPlus, Toony Colors Pro and `TCP2_PlanarReflection` in the Frame Debugger; installed assets do not prove their passes are active. If reflections dominate, lower reflection resolution/update frequency or use a baked reflection first. If outlines dominate, draw only selected/special shapes, reduce pass count, and avoid per-instance material clones. Pool short-lived splash/fracture/popup effects only after lifetime is correct.

Use collision layers to exclude tray previews, VFX debris and irrelevant pairs. Keep one Rigidbody per compound shape; avoid hundreds of decorative colliders. Do not change the 50 Hz physics rate during initial behavior-preserving optimization. A future 60 Hz experiment costs 20% more simulation steps than 50 Hz; it does not automatically improve FPS. Compare stability, CCD and per-body solver iterations before increasing global solver work.

Split frequently changing HUD from static menu canvases if profiling shows rebuild cost. Clock text updates once per displayed second; weight labels only when the count changes. Keep animation ticks only while visible/active. Score popups should actually assign text (the current `DamagePopup` only stores it), then expire and return to a pool.

## 9. Implementation sequence and acceptance gates

| Step | Work / existing scripts | Gate |
|---|---|---|
| F0 | Capture baseline player recordings and profiler traces | Comparable target, resolution, quality, fixed timestep and input path recorded |
| F1 | Fix cleanup, outcome arbitration and static subscription ownership | 100 restarts; no deadlock, duplicate listener, stale timer, or double reward |
| F2 | Remove empty messages and dead debug string construction; isolate developer commands | Same gameplay, clean console; serialized event targets checked before deletion |
| F3 | Lean selection adapter + explicit placement state | Select/drag/return/release/cancel works at 30/60/120 render FPS |
| F4 | Clock/debounce service and event-driven HUD | Pause/resume and same-step expiry/failure tests pass |
| F5 | Contact ledger, graph transactions and changed-only presenters | Weighted tests and Unity compound-collider scenes pass |
| F6 | Rendering/physics optimization guided by new profiles | Measured frame-time targets, visual parity and no rule regressions |

## 10. Profiling protocol and proposed targets

Targets below are **engineering budgets**, not measured current results or guarantees. Choose a minimum supported device before signoff.

- 60 FPS budget: 16.67 ms. Propose main-thread p95 ≤12 ms, GPU p95 ≤12 ms, presented-frame p95 ≤16.67 ms and p99 ≤20 ms in the normal board workload. CPU/GPU execute with overlap; do not add the two budgets as frame time.
- New contact/graph/rule pipeline p95 ≤0.5 ms on the baseline 14-shape board, ≤1 ms for an agreed 64-shape stress board. Record actual E and collider/contact counts.
- Zero graph solves and zero recurring domain allocations during a 10-second unchanged sleeping stack. Presentation animations may continue independently.
- At most one authoritative solve per dirty simulation transaction. No repeated WeightChanged for an unchanged value/style.
- No retained growth in listener count, tween count, shape records or material instances after 100 restart cycles and a cleanup/GC measurement boundary.

Record three reproducible 60-second runs after warm-up: idle tower, continuous drag/rotate, multi-shape collapse plus timer/weight destruction. Add 15-minute thermal soak on mobile. Use CPU Timeline/Hierarchy, GC allocation call stacks, Physics Profiler, GPU Profiler where supported, Memory Profiler, Frame Debugger, and Unity 6.4+ Project Auditor [P4]. Instrument `Contacts.Ingest`, `Stack.Solve`, `Rules.Evaluate`, `Views.Apply`, `Session.Clear` with ProfilerMarker. Disable Deep Profile for final timing; use it only for diagnosis. Confirm release-build behavior as well as development-player diagnostics. Report p50/p95/p99, maximum, missed-frame count and allocation bytes; average FPS alone hides spikes.

## 11. Regression cases

Test held keys versus single presses; two opposing inputs; pointer released outside viewport; UI captures pointer; touch cancel; losing focus while dragging; deselect/up duplication; all shapes sleeping; moving platform; same-step contact exit and destruction; restart during delayed action; pool reuse; pause during countdown; failure exactly at countdown expiry; view enabled after its first event; exception in optional VFX; and domain reload disabled. Play Mode collision and profiler gates remain unexecuted in this documentation task.

## 12. Official references

- **P1:** [Compound colliders](https://docs.unity3d.com/6000.5/Documentation/Manual/compound-colliders-introduction.html): child colliders, one Rigidbody, per-collider collision reporting.
- **P2:** [OnCollisionStay](https://docs.unity3d.com/6000.5/Documentation/ScriptReference/MonoBehaviour.OnCollisionStay.html): no stay for sleeping bodies; collision delivery to disabled behaviours; dynamic-body requirement.
- **P3:** [ComputePenetration](https://docs.unity3d.com/6000.5/Documentation/ScriptReference/Physics.ComputePenetration.html): overlap/translation query, not a general resting-support solver.
- **P4:** [Unity 6.4 changes](https://docs.unity3d.com/6000.5/Documentation/Manual/WhatsNewUnity64.html): Project Auditor, rendering statistics, input callback support.
- **P5:** [Unity 6.5 changes](https://docs.unity3d.com/6000.5/Documentation/Manual/WhatsNewUnity65.html): profiling, PSO tracing, mobile/on-tile rendering; evaluate applicability rather than enabling all features.


---

<!-- ====================================================================== -->
<!-- FILE: Unity65_From_Scratch_WiiWare_Recreation_Plan.md -->
<!-- ====================================================================== -->

# Build Balance Stack Hero from scratch in Unity 6.5

## 1. Goal, reference and boundaries

**Date:** 2026-09-23 · **Requested engine:** Unity **6000.5.0f1** · **Deliverable:** implementation-ready reconstruction plan focused on visuals and the main gameplay loop.

**Working reference identification:** the user's “original WiiWare game” is interpreted as **Art of Balance (2010), by Shin'en Multimedia**. The existing project's shape stacking, weight/timer rules, and finish sequence strongly match it; the user did not explicitly name the title. Confirm this identity before locking an art bible. Research below uses the original **Wii** page and a contemporaneous WiiWare review, rather than assuming the later Wii U/Switch editions are identical.

| Reference | Confirmed facts / use |
|---|---|
| [Official Wii page](https://art-of-balance.shinen.com/wii/) | 100 levels, Wii Remote controls, drop-in two-player co-op, split-screen versus; original product information |
| [Nintendo Life WiiWare review, 2010-02-18](https://www.nintendolife.com/reviews/2010/02/art_of_balance) | Stack supplied shapes above water; timer and count-limited shapes; three-second finish shown by three lights; time/height challenges; smooth blocks and 3D backgrounds |
| [Official Wii gallery](https://art-of-balance.shinen.com/wii/gallery.php) | Reference collection endpoint for the art team's frame-board task; individual imagery still needs measured comparison |
| [Official original trailer MP4](https://art-of-balance.shinen.com/wii/video/shinen_artofbalance_eu_ws_4mbit.mp4) | Official page labels it 1:12, 60 fps, in-game music; capture source for future timing/visual study, not measured in this task |

The publisher's parent landing page now advertises 200 levels for later versions; the original Wii-specific page establishes **100**. The original review describes bass-heavy music and quirky effects; a generic later-version “quiet zen spa” assumption should not replace original audio reference work. No original friction, mass, camera FOV, palette values, exact rotation increment, or rendering implementation is known from these sources.

Use the source project as a behavior/feature reference through its companions, not a requirement to reproduce its known bugs. Current coin/fire/maker extensions have their own backlog; original Wii fidelity must be tracked independently.

## 2. Definition of the playable vertical slice

Deliver one polished environment and 12 original test/puzzle arrangements using a small reusable shape set. Required interactions: select a tray piece, position it, rotate it, see placement validity, release it into gravity, observe collision/settling, keep all pieces above the water, survive the final three seconds, and retry or advance quickly. Include a regular-only level, a concave ledge level, a weight-limit level, a timer level, a height challenge and a timed challenge.

Acceptance: new players understand selection and release without reading technical instructions; pieces align with their visible silhouettes; no clipping through a concave notch; no input lag caused by graph processing; success/failure is consistent; restart completes cleanly; the water/platform/material composition reads like the WiiWare reference in side-by-side captures. Stable 60 FPS is measured on the chosen baseline device.

Do not require a physics “all bodies sleeping” condition for reference-style success: the contemporaneous review says the structure must remain above water for three seconds after the final placement. Settling can drive effects and optimization, but an extra stillness requirement would change the rules.

## 3. Initial technical decisions

| Decision | Recommendation and reason | Validation gate |
|---|---|---|
| Engine | Pin 6000.5.0f1 plus exact modules; verify installer/release notes | Clean empty player build before features |
| Render pipeline | URP, minimal forward renderer as starting point | Correct shape lighting/water/outline on target; no unsupported compatibility-mode passes |
| Physics | Built-in 3D Rigidbody/PhysX, planar constrained gameplay with extruded 3D visuals | Stable stack/rotation tests; compare to reference feel |
| Simulation plane | XY, depth Z; freeze Z position and X/Y body rotations | Shapes fall/rotate in-plane; visual camera can show thickness |
| Input | Input System action maps, mouse/touch/gamepad adapters | Pointer parity and correct UI capture |
| UI | uGUI + TMP initially for simple HUD and existing familiarity | Safe area/aspect ratio, changed-only text |
| Content | ScriptableObject shape/level/world/theme definitions; runtime copies for state | Asset validator prevents invalid thresholds/geometry/data |
| Composition | Scene bootstrap creates session-scoped services and injects adapters | No Awake ordering dependency or global scene searches |
| Save | Versioned progress DTO + repository; PlayerPrefs only for simple settings if suitable | Write/read/recover test, no double rewards |
| Tests | Pure domain Edit Mode plus PhysicsScene/Play Mode and device captures | CI tests and reproducible fixture scenes |

A Physics2D backend is a possible separate prototype, but switching between 2D and 3D is not a free optimization: contact callbacks, constraints, materials and feel differ. Start with one backend. Unity 6.5's Unity Physics package Direct Solver is also distinct from existing PhysX; do not budget it as an automatic stability switch.

## 4. Project and assembly layout

Suggested new-project structure (proposed, not created by this task):

```text
Assets/Game/
  Domain/           handles, states, support graph, rules, outcome logic
  Application/      session orchestration, commands, timers, use cases
  Infrastructure/   Unity physics/input/save/audio adapters
  Presentation/     shape views, HUD, menus, camera and VFX
  Content/          Shapes, Levels, Worlds, Themes, RuleDefinitions
  Art/              Meshes, Materials, Textures, Shaders, Environments
  Audio/            Music, SFX, Mixers
  Scenes/           Bootstrap, Frontend, Gameplay, PhysicsLab, VisualLab
  Editor/           validators and level authoring tools
  Tests/            EditMode, PlayMode, Performance
```

Domain has no renderer, input package or scene dependency. Application uses Domain and narrow interfaces. Unity infrastructure implements those interfaces; Presentation reads models/events. Editor and test assemblies cannot be dependencies of the player. Introduce assembly definitions when boundaries are useful; avoid a separate assembly for every tiny class.

## 5. Main gameplay loop and state ownership

```text
Boot → Frontend → Loading → Playing → FinalCountdown → Won
                       ↑       └──────────┬──────────→ Lost
                       └──── Clearing ← Retry/Next ───┘
```

SessionController owns this state machine. Only it may accept a terminal outcome. Input, timer, hazard and rule services submit commands; they do not directly open result screens or save progress.

### 5.1 Load and present the board

Validate the level asset, allocate a new session epoch, instantiate/pool the environment and platform, place tray visuals, register shapes, and publish `LevelReady`. Spawning uses explicit references and IDs; it does not discover `SpawnPoint0` by name. Tutorial prompts derive from level features. Visual spawn animation affects the visual child, not the live collider scale while gameplay is active.

### 5.2 Pick up and move

Input action `Point` resolves screen position through the camera onto the gameplay plane. `Select` reserves the chosen tray shape for one pointer. Store the local grab offset so the shape does not jump under the pointer. Selected shape is kinematic/preview state; its collision role is separate from active stack pieces. Use action callbacks to enter/exit manipulation, with a selected-only pose update for continuous dragging.

Input contract includes `Select`, `Release`, `Cancel`, `RotateLeft`, `RotateRight`, `Pause`, and navigation actions. Gamepad cursor speed is time-based, not pixels per frame. Touch offset is configurable for visibility. Pressing UI never picks a shape behind it. A lost pointer/focus sends Cancel and returns to tray or another agreed valid state.

### 5.3 Rotate and validate placement

Allow controlled rotation about the plane normal. Existing game code uses 45° stepping in one mode; original Wii increment remains a reference-capture question. Implement configurable discrete steps and continuous input behind one rotation command without asserting either as original fidelity.

On a changed preview pose, run broad-phase candidate query against gameplay layers and narrow-phase overlap tests across all cached compound child colliders. Evaluate each child's proposed world pose, not only the root pose. `Physics.ComputePenetration` can evaluate alternate poses for supported collider types, but does not provide a whole-compound sweep or prove contact support. Reject illegal interpenetration above tolerance; prevent tunneling through other pieces between widely separated pointer poses using an agreed swept/capped-movement preview policy. Buffer saturation must retry/grow; never treat a truncated query as “clear.”

Show a subtle outline/ghost indication. Validate once more at release against current physics state. A valid release commits placement exactly once; a failed release stays selected or returns according to the tutorial rule. Avoid silently teleporting the released block through the tower.

### 5.4 Release and simulate

Commit final pose at the physics command boundary, enable gameplay solid colliders, switch body to dynamic, and apply the agreed release-velocity policy (initially zero imposed velocity, let gravity act). Decrement tray remaining once; retain a placement-history record independently of live physical shape membership. Contacts drive sound/VFX and support graph updates. Rest classification observes both linear and angular motion but never forcibly zeros velocity simply to mark settled.

### 5.5 Evaluate special pieces

Use the [weighted-shape architecture](Weighted_Shapes_SOLID_EDD_Deep_Dive.md): real contact pairs → directional graph → unique supported counts → rules. Weighted shapes break at the configured first forbidden count. Timer shapes arm once when first carrying a shape; unloading reset behavior must be confirmed from original footage before final rules freeze. The initial documented policy is a one-shot fuse. Display count/capacity, cracks and a timer signal through changed-only presenters.

### 5.6 Success, failure and restart

When every required piece has been committed and level-specific conditions allow it, start a three-second gameplay-clock deadline. Present three bottom-screen lights as supported by the original review. Continue physics during this period. Contact with water/out-of-bounds creates a hazard command; loss takes priority over expiry in the same authoritative step. On success, latch outcome, stop further manipulation, finalize progress once and display completion feedback. Whether to freeze all surviving pieces visually at success should be verified from footage; it is present in the current project code.

Retry increments session epoch, cancels timers, unregisters and disables colliders, releases pooled visuals, resets graph and score, then reloads the same asset. No spin waits. Aim for a <0.5-second warm retry transition as an initial UX target; actual load and VFX duration are measured separately.

## 6. Physics feel and robustness specification

Begin with one reasonable world scale: a common block dimension near one Unity unit. Use positive, modest mass ratios and shared low-bounce physics materials. Numerical friction/damping values are calibration variables, not recovered originals. Build a PhysicsLab with towers, bridges, sloped supports, thin edges, concave cavities, and weighted/timer combinations.

Start a new-build experiment at 60 physics Hz and compare to the existing project's 50 Hz baseline for CPU cost and feel. Pick and freeze one after measurement; 60 simulation steps are not equivalent to 60 render frames. Enable interpolation for rendered dynamic pieces if it improves visible motion, and test preview release synchronization. Apply continuous collision detection only where drop speed/thickness demands it. Increase per-body solver iterations for demonstrated unstable cases before globally increasing all physics work.

One Rigidbody owns each compound. Collision layers distinguish Platform, ActiveShape, Preview, WaterHazard, DecorativeDebris and UI. Decorative mesh bevels do not require tiny collider bevels. Collider authoring must preserve notches while avoiding sliver pieces. Dynamic scale changes alter mass properties, so spawn flair should scale a render child rather than collision geometry.

Replay stores the seed and input commands for debugging, but cross-platform PhysX is not assumed bitwise deterministic. Compare outcome tolerances and sequences rather than exact float hashes. Hold reference fixtures stable across upgrades.

## 7. Visual reconstruction: art bible and camera

### 7.1 Capture a reference board before detailed art

For the original Wii build, collect matched frames showing: title/menu; regular level; selected shape; stable pile; weight warning; timer warning; water contact; countdown at each light; win; failure; and each original environment. Annotate source, version, level, timestamp, aspect ratio and visible features. This task located original sources but did not perform frame-by-frame video measurement. Treat all proposed numerical art settings below as starting values.

Measure screen-space ratios: platform width/frame width, waterline Y/frame height, gameplay vertical span, tray cell spacing, shape apparent thickness and HUD safe margins. Compare in a neutral exposure and fixed output resolution. Build a gray-box camera composition before materials; otherwise lighting work can conceal wrong proportions.

### 7.2 Camera and composition

Use a stable near-frontal camera revealing modest block thickness and environmental depth. Prototype orthographic versus long-lens perspective; choose whichever matches reference silhouette and parallel lines. Avoid asserting the original used either projection. A starting perspective FOV of roughly 25–35° is only a tuning seed. Keep the playable XY plane distinct from scenic depth.

Keep the platform centered in the lower gameplay region and leave clear space above for the full stack. Place the shape tray and three countdown indicators in consistent screen-space positions after reference measurement. Implement a camera-framing solver triggered by level/aspect change, not per-frame scene searches. On narrow screens preserve minimum piece readability and interaction space; do not crop required tray pieces.

Shake should be short and subtle, used for failure/impact if reference captures justify it. It must not interfere with pointer-to-plane mapping; use a stable input camera transform or compensate consistently. One owned shake channel restores the exact resting pose.

## 8. Shape meshes and materials

### Mesh pipeline

Create each silhouette from an authored 2D polygon profile; triangulate including holes where present, extrude to a fixed thickness, add modest bevels for edge highlights, generate consistent normals and UVs. Use readable broad front faces and slightly darker side faces. Visual bevels should preserve perceived contact surfaces. Do not use one convex hull for concave collision. Bake collider decompositions and validation reports alongside the mesh.

Initial library: square, rectangle, triangle, wedge, round/semicircular piece, L, T, +, ^, U and asymmetric variants. Author shape pivots and center of mass intentionally; do not let arbitrary imported origins dictate drag offset or torque. Convex/compound equivalents are mandatory test assets.

### Material families

| Family | Proposed visual construction | Runtime data and cost control |
|---|---|---|
| Regular | Warm wood-like texture, smooth bevel highlights, restrained gloss | Shared material/atlas; authored texture scale consistent across shapes |
| Weight-limited | Distinct surface/tint plus crack or capacity indicators | Changed-only state; one pulse maximum; no repeated material instantiation |
| Timed | Clearly visible countdown accent/emission | Shader time or active timer presenter; no shader keyword change every frame |
| Locked/project extension | Muted value and explicit lock symbol | Eligibility presentation independent of physics mass |
| Platform | Contrasting stable base material, readable top edge | Shared material, conservative collider count |

Use reference samples to tune texture frequency, warm/cool balance, roughness, bevel scale and silhouette. Do not assume modern transparent glass is faithful without checking original weight-limited material. If transparency is used, test sorting and stacked overdraw; an opaque tinted/cracked treatment can be a cheaper design choice. Add count/shape cues in addition to red/yellow/green so the warning is readable without color alone.

For 6.5 URP, compare shared material variants, instancing and property blocks in an actual capture. MaterialPropertyBlock can affect SRP Batcher compatibility; do not prescribe it universally as a performance win. A small set of shared visual bands may be sufficient.

## 9. Environment, water, lighting and effects

### Environment construction

Build a coherent 3D backdrop with a water basin/surface below the platform, contextual room/scenic geometry behind the playfield, and decorative objects placed away from silhouette-critical regions. The contemporary review establishes polished smooth blocks against occasionally jagged 3D scenery and eccentric artwork; precise environment assets must be identified in the frame board. Avoid importing the later Wii U presentation wholesale.

Bake static environment lighting where useful and light dynamic shapes with a restrained real-time key plus suitable ambient/probe contribution. Use one main shadow-casting light as the initial budget; shadows should ground stacks without obscuring notch geometry. In URP, test MSAA quality against thin shape edges and transparent water. Start without expensive screen-space effects; add only when comparison shows a need.

### Water implementation tiers

1. **Baseline:** plane mesh, scrolling normal maps, Fresnel tint/specular, baked cubemap/probe reflection; localized pooled ripple meshes on contact. Separate water hazard volume from the render surface.
2. **Mid-tier:** sample scene color/depth for restrained refraction/edge fade if the URP pass cost fits. Verify depth texture/opaque texture bandwidth and transparent sorting.
3. **High-tier:** reduced-resolution planar reflection with deliberate update rate/culling only if measured reference value justifies an extra camera pass. No automatic “reflection every camera every frame” implementation.

Water animation may be continuous on the GPU; contact splash/ripple spawning is event-driven. The hazard uses collision/trigger routing or authoritative plane crossing at physics rate, not a GPU water displacement query. If visual waves and hazard height differ, keep the discrepancy small and documented so failure feels fair.

### Effects and animation

Contact event → impact sound/light squash only where appropriate; placement committed → gentle highlight fade; water failure → splash/ripple; break command → pooled visual fragments with capped lifetime; win → restrained celebration. Keep fragments out of the gameplay support graph. Trigger effects from committed domain events, deduplicated by event/shape generation. Animation ticks exist only while effects are active.

## 10. UI and audio recreation

HUD priorities: available shapes, level identification, pause/retry, three finish lights, and level-specific time/height goal. A warning label belongs near its shape without occluding the next placement. Split dynamic labels from static menus where canvas profiling supports it. Text refreshes only when its displayed value changes; pointer/hover animation can remain active only for the relevant UI.

Menus need a functional level/world selector and progress feedback. Do not reproduce the current project's placeholder level-select methods or hard-coded maker-mode Play. Tutorial prompts should introduce one mechanic at a time and be dismissible on repeated attempts.

Audio plan: study original music tempo/instrumentation, impact timbre, water splash and success/failure cues from the official in-game-music trailer and original play capture. Create distinct material response sounds with small controlled pitch variations and a concurrency cap. Route music/SFX/UI through mixer groups, persist mute/volume settings, and use audio/DSP or unscaled timing for voices that continue during pause. A source owns its playback and cancellation; avoid the current SoundManager pattern of decrementing counters through unrelated scaled waits.

## 11. Data model and authoring workflow

```text
ShapeDefinition
  stable content ID, visual prefab, collider prefab/profile, mass config,
  kind/rule definition, grab anchor, visual warning palette
LevelDefinition
  stable ID, world ID, ordered/available shape instances, platform instances,
  initial poses, gravity, finish duration, optional height/time constraints,
  theme, tutorial IDs, next-level links
ThemeDefinition
  environment prefab, lighting setup, material palette, audio set, water tier
ProgressRecord
  schema version, completed level IDs, best result, settings
```

Validate no duplicate IDs, missing shapes/materials, invalid thresholds/timers, unassigned collider owners, mismatched arrays, forbidden child Rigidbodies, or unsolvable authored slot references. Provide preview gizmos for physics profiles, compound bounds, contact normals, directed support edges and count values. Bake shapes/content once; no runtime polygon decomposition in Update.

Store solved reference arrangements for author QA, but do not require a single solution. Use difficulty tags: support width, number of pieces, asymmetric torque, concavity, rounded contact, rule interactions and placement order dependence. Validate derived totals whenever content changes rather than relying on stale cached fields.

## 12. Event-driven runtime and performance budgets

Keep one session update coordinator, one physics transaction coordinator, active manipulators and active presentation animations. Sleeping pieces have no polling Update. Contacts update pair records; graph solves occur only on meaningful graph/rule changes. Presenters consume deltas. Timers are cancellable and session-scoped. Physics still simulates continuously; replacing necessary simulation with events would be incorrect.

Initial design target: 14-shape normal board plus 64-shape stress scenario. Main-thread and GPU p95 targets each ≤12 ms, presentation target 16.67 ms, p99 ≤20 ms in normal play; graph/rules p95 ≤0.5 ms for normal board, zero steady-state managed allocation after warm-up. These are provisional budgets, not measured results. Define draw/pass/texture budgets from the actual baseline GPU before final art production.

Measure water reflections, outline passes, transparency, shadow cascades, UI rebuilds, physics contact counts and graph solve frequency separately. Texture memory and load-time budgets require target devices; set them at milestone M0. Avoid a full DOTS/Burst rewrite unless graph/physics profiles justify it. Shader warm-up and pool warm-up belong in controlled load transitions.

## 13. Milestone implementation plan

Indicative duration assumes one experienced Unity engineer with part-time art/audio support; estimates are not commitments and exclude complete 100-level content production. Art work can overlap after gray-box camera and silhouette approval.

| Milestone | Tasks and outputs | Dependencies / risks | Exit criteria | Indicative effort |
|---|---|---|---|---|
| M0 Reference and platform lock | Confirm original title/version; frame board; input/timer rule experiments; minimum device; editor/package lock; clean build | Missing original footage/device access | Signed reference/assumption ledger and baseline executable | 2–4 days |
| M1 Gray-box core | Bootstrap, plane camera, platform/water hazard, tray, Input System actions, pick/move/rotate/release | Input/physics pose boundary | One regular puzzle playable, failure and warm retry reliable | 4–7 days |
| M2 Physics/geometry foundation | L/T/+/^/U and convex profiles, ownership registry, contact adapter, fixtures, collider validator | Contact normals, compound routing, thin geometry | All compound/contact gates pass on target editor | 4–7 days |
| M3 Domain rules | Support graph, counts, threshold/timer rules, command buffer, session outcome, 3 lights | Policy semantics, same-step events | No duplicate outcomes; weighted/timer puzzle playable | 4–7 days |
| M4 Visual vertical slice | Final camera composition, bevel meshes, material palette, one environment, baseline water, lighting | Reference mismatch, GPU passes | Matched captures approved and normal-board budget met | 8–15 art/engineering days |
| M5 Presentation/audio polish | Event presenters, count/cracks/timer, menu/HUD, impacts/splash/music, bounded VFX | UI clutter, sound concurrency | Clear feedback, no tween/listener growth, pause works | 4–7 days |
| M6 Content tools and 12-level slice | ScriptableObject catalog, authoring/validation, progression/save, tutorial flow | Sparse/invalid content, solve quality | All 12 levels solvable by independent playtesters; save round-trip | 5–10 days |
| M7 Optimization and device hardening | CPU/GPU profiles, allocations, 100 retries, 15-minute thermal soak, target builds | Native/platform differences | Correctness and performance gates passed | 4–8 days |
| M8 Expanded original-style content | More environments/puzzles, reference co-op/versus if chosen | Content volume and two-player UX | Separate content/multiplayer acceptance suite | Estimate after vertical slice |

### Concrete implementation order within the core

1. Plain `ShapeHandle`, `SessionState`, `LevelDefinition` and command records.
2. Bootstrap and dependency composition, a test level, registry and safe clear.
3. Input adapter and selected-only placement manipulator.
4. Collider profile builder/validator and placement overlap checks.
5. Contact source/ledger and pure support graph/count tests.
6. Rule evaluator, timer service, removal commands and terminal arbiter.
7. Read models, weight/clock/HUD/shape presenters.
8. Art and audio adapters; save repository and progression.
9. Stress/thermal instrumentation and profile-guided optimization.

## 14. Original co-op and versus as later milestones

The original official page confirms both features. They need explicit work rather than assuming a single-player architecture automatically supports them.

- Co-op: two independent input identities/manipulators, shared board, exclusive per-shape ownership, visible cursor identity, deterministic command ordering, simultaneous-release tests.
- Versus: two independent sessions/graphs/timers and board views; split-screen cameras and UI; round arbitration; per-board input routing. The original review describes five/seven/nine-round choices. No cross-board collision or global singleton state.
- Measure doubled scene/rendering workload and target 60 FPS in split-screen. Share immutable assets, not mutable session state. Start local; networking is a separate requirement.

## 15. Validation and visual-fidelity scorecard

| Gate | Method | Pass condition |
|---|---|---|
| Composition | Matched original/new captures at same aspect | Platform, tray, waterline and HUD proportions match approved reference tolerances |
| Silhouettes | Overlay wireframe/collider debug and render | Notches/holes preserved; no apparent contact gaps or invisible blocking hulls |
| Material/lighting | Neutral matched views, then gameplay captures | Readable bevels, consistent texture density, no warning-state ambiguity |
| Water | Static/impact captures + Frame Debugger | Reflection/ripple style approved without exceeding pass budget |
| Input feel | Recorded pick/drag/rotate/release on devices | No jumps, stuck selection, accidental UI passthrough, or duplicate release |
| Core loop | Full regular/weighted/timer/time/height playthrough | Three-second finish and loss priority follow documented rules |
| Geometry/graph | Pure tests plus actual PhysX fixtures | L/T/+/^ and convex compound behavior correct under supported authoring contract |
| Presentation lifecycle | 100 retries and pooling cycles | No accumulating materials, tweens, subscriptions, audio counters or stale labels |
| Performance | Player captures and thermal soak | Agreed frame-time, allocation and memory budgets pass |
| Progress | Fresh/old/malformed save tests | Valid content navigation and no duplicate rewards or lost completion |

The executed Python suite described in the weighted deep dive is useful for the domain specification. It does not fulfill this plan's Unity contact/rendering/input/device gates. Create those tests before calling the new build complete.

## 16. Risk register and decisions to resolve

| Risk / unknown | Impact | Response |
|---|---|---|
| Wrong reference edition/title | Entire art/feature target drifts | Confirm Art of Balance WiiWare 2010 before M0 signoff |
| Weight semantics for bridge/interlock | Different puzzle solutions | Record reference experiments; keep count policy configurable and documented |
| Timer unloading/reset and exact countdown start | Difficulty/finish mismatch | Capture original cases, then lock rule tests |
| Art guesses become “facts” | Costly rework | Label all numeric settings as proposed until frame-board measurement |
| Physics solver feel differs | Stacks behave unexpectedly | Small physics lab first; tune scale/friction/damping/solver with repeatable tests |
| Water/outline GPU cost | CPU EDD improvements do not restore FPS | Low-cost baseline tier; compare passes on device |
| Runtime event leaks or reentrancy | Duplicate actions across retries | Instance services, epochs, buffered commands, restart soak |
| Content scope balloons to 100 levels immediately | Core quality slips | Prove 12-level polished slice, then estimate production throughput |
| Unity 6.5/plugin support | Startup/build delays | Minimize new-project dependencies; pin verified target package versions |

## 17. Definition of done and handoff

A completed vertical slice includes a clean Unity 6.5 project and player build, 12 validated levels, one polished theme, core regular/weighted/timer gameplay, functional menu/progress/save, compound geometry tests, stable retry flow, matched reference captures, and target-device profiler results. Engineering handoff includes state/event contracts, collider authoring instructions, timing policy, performance budgets and a list of remaining reference uncertainties.

This route should reproduce the **readable shaped blocks, water/platform composition, deliberate stacking interaction, three-second tension and fast retry loop** first. More levels, themes and local multiplayer extend a proven foundation. For an incremental upgrade of the existing game instead, use the [master migration plan](Unity6_Upgrade_and_Performance_Modernization_Plan.md).

### Unity references for this build

- [Unity 6.5 manual](https://docs.unity3d.com/6000.5/Documentation/Manual/UnityManual.html), [new features](https://docs.unity3d.com/6000.5/Documentation/Manual/WhatsNewUnity65.html), [upgrade implications](https://docs.unity3d.com/6000.5/Documentation/Manual/UpgradeGuideUnity65.html).
- [Compound colliders](https://docs.unity3d.com/6000.5/Documentation/Manual/compound-colliders-introduction.html), [collision stay/sleep rules](https://docs.unity3d.com/6000.5/Documentation/ScriptReference/MonoBehaviour.OnCollisionStay.html), [penetration queries](https://docs.unity3d.com/6000.5/Documentation/ScriptReference/Physics.ComputePenetration.html).
- [Unity 6.4 upgrade](https://docs.unity3d.com/6000.5/Documentation/Manual/UpgradeGuideUnity64.html): Render Graph requirements and lifecycle behavior relevant to any reused assets.


---

<!-- ====================================================================== -->
<!-- FILE: Unity6_Upgrade_and_Performance_Modernization_Plan.md -->
<!-- ====================================================================== -->

# 1. Title and Scope

# Balance Stack Hero — Unity 6.5 upgrade and performance modernization plan

**Analysis date:** 2026-09-23. **Current engine:** Unity **2023.1.6f1**, confirmed by `ProjectSettings/ProjectVersion.txt`. **Target:** Unity **6000.5.0f1 (6.5)**, as requested. Verify the exact editor installer, platform modules and patch-specific release notes before executing the migration; consulting the 6000.5 manual does not establish that the requested binary is installed locally.

**Input basis:** existing companion Markdown in `Assets/Scripts/Docs/`, targeted source/configuration verification, and official Unity documentation. This is a staged implementation plan. Production C# and Unity assets were not rewritten during this task. An executable Python specification accompanies the weighted-shape analysis.

The supplied prompt's twenty-section structure is retained here. The user's requested separate deep dives are linked below. The conceptual migration sequence is extended through **6.4 → 6.5**, which the prompt's earlier example matrices omit despite its stated 6.5 target.

- [Frame rate and EDD deep dive](Frame_Rate_and_Event_Driven_Design_Deep_Dive.md)
- [Weighted shapes: SOLID, EDD, algorithms and test results](Weighted_Shapes_SOLID_EDD_Deep_Dive.md)
- [From-scratch Unity 6.5 WiiWare-style rebuild](Unity65_From_Scratch_WiiWare_Recreation_Plan.md)
- [Executable reference tests](weighted_shape_reference_tests.py)

## 2. Executive Summary

Use a **hybrid, checkpointed migration**: stabilize the current project, audit packages/plugins, apply release-order compatibility checks, then modernize one subsystem at a time. Expected difficulty is medium-to-high because legacy asset plugins and coupled gameplay/lifecycle rules add more risk than simple API renames.

Dominant correctness risks are a blocking cleanup loop, overlapping coroutines, leaked static subscriptions, duplicate terminal outcomes, inaccurate weighted-shape geometry, and asynchronous destruction changing shared lists. Dominant upgrade risks are plugin API compatibility (including Unity 6.5 identity changes), legacy mobile dependencies, renderer/outline/shader parity and Android minimum/toolchain changes.

Highest-value performance work: contact-driven stack invalidation, once-per-transaction rule processing, changed-only visual updates, single gesture debounce, integer-change clock UI, and removal of unnecessary allocations. Physics/manipulation continue ticking where appropriate. A 60 FPS target must be verified on an agreed minimum device; no current FPS or improvement has been measured.

Keep Built-In rendering for the initial compatibility checkpoint: Unity 6.5 deprecates it but explicitly maintains support through the Unity 6.7 LTS lifecycle [U10]. Schedule URP conversion separately after visual baselines. For the **new from-scratch project**, choose URP from the outset. This separates two distinct delivery paths.

## 3. Evidence Base

### Companion documents reviewed

Overview, lifecycle and critical-interpretation sections were reviewed across all 27 companions; key hubs received method/loop/event/source cross-checks. The links below enumerate the evidence rather than implying every generated ledger line was semantically compiled.

| Area | Companions |
|---|---|
| Gameplay and contacts | [GameManager](GameManager.cs.md), [SpawnManager](SpawnManager.cs.md), [ShapeController](ShapeController.cs.md), [PlatformController](PlatformController.cs.md), [FloorColliderController](FloorColliderController.cs.md), [DockColliderController](DockColliderController.cs.md) |
| Session, score and UI | [LevelManager](LevelManager.cs.md), [ScoreManager](ScoreManager.cs.md), [UIManager](UIManager.cs.md), [AnimatedButton](AnimatedButton.cs.md), [Loader](Loader.cs.md) |
| Presentation | [CameraController](CameraController.cs.md), [DamagePopup](DamagePopup.cs.md), [DurationScale](DurationScale.cs.md), [ScoreEffect](ScoreEffect.cs.md), [EffectManager](Game/EffectManager.cs.md) |
| Content/data | [LevelData](LevelData.cs.md), [LevelInfo](LevelInfo.cs.md), [LevelMakerData](LevelMakerData.cs.md), [LevelStatus](LevelStatus.cs.md), [WorldData](WorldData.cs.md), [WorldInfo](WorldInfo.cs.md) |
| Services | [SoundManager](Game/SoundManager.cs.md), [Sound](Game/Sound.cs.md), [AppInfo](Game/AppInfo.cs.md), [RdWUtilities](Game/RdWUtilities.cs.md), [RdWAnalytics](RdWAnalytics.cs.md) |

No `Scripts_Master_Index.md` was found under Assets even though existing companions link to it. This plan provides an architecture summary without treating that missing index as evidence. The original companion files were preserved.

### Evidence/confidence labels

- **Confirmed from companion docs:** documented active syntax and dependency findings; not runtime reachability or measured performance.
- **Confirmed from source/configuration:** targeted direct verification of hot paths and settings.
- **Confirmed from Unity docs:** version-specific behavior in the official pages listed below.
- **Inferred from architecture patterns:** recommendations and projected benefit, requiring tests/profile evidence.
- **Unknown from current inputs:** actual scene wiring, all vendor versions, shipping platform commitments, minimum device and captured gameplay/performance baseline.

Source checks covered key SpawnManager graph/cleanup/rule methods, ShapeController behavior as documented, LevelManager Update/result arbitration, installed LeanSelectable event API, and an outline model postprocessor. Companions contain generated generic statements and lexical caller candidates; those are not proof of active runtime calls. For example, an `AnimatedButton.Start` caller candidate for unrelated Start methods is not a real cross-object invocation established by this plan.

### Official documentation consulted (accessed 2026-09-23)

| ID | Source / scope |
|---|---|
| U1 | [Unity 6.5 Manual](https://docs.unity3d.com/6000.5/Documentation/Manual/UnityManual.html) |
| U2 | [What's New hub](https://docs.unity3d.com/6000.5/Documentation/Manual/WhatsNew.html) |
| U3 | [Upgrade hub](https://docs.unity3d.com/6000.5/Documentation/Manual/UpgradeGuides.html): read guides in release order |
| U4 | [2023.2 upgrade](https://docs.unity3d.com/6000.5/Documentation/Manual/UpgradeGuide20232.html) |
| U5 | [Unity 6.0 upgrade](https://docs.unity3d.com/6000.5/Documentation/Manual/UpgradeGuideUnity6.html) |
| U6 | [Unity 6.1 upgrade](https://docs.unity3d.com/6000.5/Documentation/Manual/UpgradeGuideUnity61.html) |
| U7 | [Unity 6.2 upgrade](https://docs.unity3d.com/6000.5/Documentation/Manual/UpgradeGuideUnity62.html) |
| U8 | [Unity 6.3 upgrade](https://docs.unity3d.com/6000.5/Documentation/Manual/UpgradeGuideUnity63.html) |
| U9 | [Unity 6.4 upgrade](https://docs.unity3d.com/6000.5/Documentation/Manual/UpgradeGuideUnity64.html) |
| U10 | [Unity 6.5 upgrade](https://docs.unity3d.com/6000.5/Documentation/Manual/UpgradeGuideUnity65.html) |
| U11 | [New in 6.4](https://docs.unity3d.com/6000.5/Documentation/Manual/WhatsNewUnity64.html) |
| U12 | [New in 6.5](https://docs.unity3d.com/6000.5/Documentation/Manual/WhatsNewUnity65.html) |
| U13 | [API Updater](https://docs.unity3d.com/6000.5/Documentation/Manual/APIUpdater.html) |
| U14 | [Compound colliders](https://docs.unity3d.com/6000.5/Documentation/Manual/compound-colliders-introduction.html) |
| U15 | [OnCollisionStay](https://docs.unity3d.com/6000.5/Documentation/ScriptReference/MonoBehaviour.OnCollisionStay.html) |
| U16 | [ComputePenetration](https://docs.unity3d.com/6000.5/Documentation/ScriptReference/Physics.ComputePenetration.html) |

Package-specific resolved versions and installer release notes remain an execution gate. Official manuals can be updated/backported: U5 currently contains multiple Android toolchain tables, so do not treat one table as applying to every 6.0 patch. Resolve tools from the actual editor patch and generated build project.

## 4. Current Architecture Snapshot from Companion Docs

```text
UI / keyboard / LeanTouch
     ↓
GameManager ↔ LevelManager ↔ UIManager / ScoreManager / PlayerPrefs
     ↓             ↕
SpawnManager ↔ ShapeController → materials / outlines / DOTween
     ↑             ↑
     └ static collision notifications / timed rest polling
FloorColliderController → static failure event → LevelManager
```

- `SpawnManager` is the main concentration point: inventory, spawning, active/history collections, adjacency/weights, destruction, score relay, penetration checks and developer controls.
- `ShapeController` combines placement state, physics, selection, scoring and visual presentation. Public booleans can describe contradictory states; managers mutate them directly.
- `LevelManager` owns content loading, flags/clocks, outcome, scoring calls, persistence and HUD. `GameManager` overlaps with session and input ownership.
- Unity Awake/Start/Update/LateUpdate, physics collisions, UI pointer calls and coroutines are execution roots. Empty `Loader` does not establish initialization order.
- Existing events are coarse and static; `SpawnManager.touchingEvent` has a self-subscription but active invocations are not established (visible invocations are commented).
- 3D Rigidbody/Collider and Lean Touch are active dependencies. uGUI Text, TMP, DOTween, EPOOutline and HighlightPlus occur in the scripts. ScoreFlash/MeshExploder and Toony Colors Pro are additional asset-level risks.
- Current content catalog has capacity 60, but regular authored data is established only for slot 1; slot 0 is level maker. UI Play currently starts maker mode. Do not estimate porting 60 complete levels from array capacity.

### Package and settings snapshot

Manifest: Ads 4.4.2; Analytics 3.8.1; Purchasing 4.9.3; AI Navigation 1.1.4; Collab Proxy 2.0.5; Recorder 4.0.1; Test Framework 1.3.7; TMP 3.0.6; Timeline 1.8.2; uGUI 1.0.0; IDE integrations Rider 3.0.24, Visual Studio 2.0.18, VS Code 1.2.5. Built-in physics/physics2d/VR/XR modules are listed. A Google scoped registry is configured. These are declared dependencies, not evidence all their features are used or compatible with 6.5.

GraphicsSettings has no custom render pipeline; manifest has no SRP. Color space setting is Gamma (`m_ActiveColorSpace: 0`); legacy input is selected (`activeInputHandler: 0`). Android minimum SDK is 22 and target architectures setting is 1; revalidate supported architectures and store targets before a release. Android/iOS Easy Mobile defines and `EPO_DOTWEEN` on iOS exist. Mobile configuration indicates relevance, not proof both platforms are shipping.

## 5. Upgrade Strategy Decision

Choose **package-first stabilization + conceptual sequential migration + subsystem-first performance modernization**. Read every release guide, use separate editor copies/checkpoints for high-risk transitions, and keep recoverable source/assets/package locks. Unity's instruction to follow guides in order is not a mandate to install every intermediate patch; the team can use fewer actual editor hops only when equivalent checks are documented and vendors support the selected path.

Suggested executable checkpoints: baseline 2023.1 → 2023.2 → 6.0 → checked 6.1/6.2/6.3 → 6.4 → 6.5. A direct editor jump on an expendable discovery copy can reveal blockers, but should not become the unreviewed shipping migration. Rollback means reopening the **saved previous project copy**, not downgrading already-upgraded serialized assets in place.

No Git repository is currently reported by the environment. Establish version control or a verified immutable archive before changing the editor; this documentation task did not create commits or migrate the project.

## 6. Version-by-Version Migration Matrix

| Step / docs | Key changes and affected project areas | Risk | Verification and go/no-go |
|---|---|---|---|
| 2023.1 → 2023.2 [U4] | Lighting no longer auto-generated; environment probes, runtime texture mipmap defaults; obsolete graphics formats. Materials, background, outlines, runtime texture plugins | Medium | Generate required lighting explicitly; compare reference screenshots and memory; no missing shader or importer errors |
| 2023.2 → 6.0 [U5] | Updater/find API changes; Android Java integration/toolchains; light/probe differences; physics torque changes where applicable | High | Compile all scripts/vendor assemblies; desktop+selected mobile build; shape stacks and manipulation match baseline; test obsolete Rigidbody usages after updater |
| 6.0 → 6.1 [U6] | `SetDensity` deprecated; URP keyword rename if applicable; PVRTC deprecation; Android tools; new-project Windows DX12 default | Medium | Explicit Rigidbody mass; retain tested graphics API; inspect mobile texture formats; do not infer a forced DX12 switch for upgraded projects |
| 6.1 → 6.2 [U7] | Shader API deprecations; URP AfterRendering timing and SetupRenderPasses deprecation; UI Toolkit transform deprecation | Medium conditional | Existing Built-In path still renders; if testing URP, validate outline injection timing/render targets and graph implementation |
| 6.2 → 6.3 [U8] | URP compatibility mode removed by default; legacy Ads guidance; DLL Scene.handle/GI field changes; SerializeField field-only validation | High for vendors | Vendor updates/recompilation; purchase/ad sandbox only if used; no missing fields; scan attributes; Render Graph for any URP branch |
| 6.3 → 6.4 [U9,U11] | Deep descendant OnDisable; narrowed import dependencies; full URP compatibility removal; EntityId transition; Project Auditor integrated; SerializeReference ancestor checks; PVRTC removal | High | Nested destruction/pooling subscriptions exactly once; fresh and incremental model import same; identity-key audit; supported texture replacement |
| 6.4 → 6.5 [U10,U12] | 64-bit EntityId, obsolete ID APIs errors; Built-In deprecation, dynamic batching deprecation; VR module removal; Android API26/toolchains/insets; BCL additions; importer API errors; project-local logs | High | EasyColliderEditor/ScoreFlash/TCP2 identity paths compile; module resolution; SDK26+ plan; native plugin/device tests; no 32-bit ID truncation; explicit log artifacts |

## 7. Unity 6.x Feature and Change Applicability Matrix

Priorities: P0 gate/blocker; P1 near-term; P2 optional measured improvement. Confidence **U** = confirmed Unity change; **C** = companion/config/source match; **I** = inferred relevance; **?** = usage unknown.

| Change / source | Version/category | Applicability | Project impact and recommended action | Priority / confidence |
|---|---|---|---|---|
| Release-order guides [U3] | All / workflow | Applicable | Archive/checkpoint each migration stage; upgrade packages against actual editor | P0 U+C |
| API Updater [U13] | All / programming | Applicable | Review UnityUpgradable edits and DLL logs; manually repair semantic and unhandled changes | P0 U+C |
| Object find APIs [U5] | 6.0 / programming | Applicable | Shape/Platform setup searches become injected references; any retained search chooses ordering explicitly | P1 U+C |
| Rigidbody API/compiler changes | 6.x / physics | Applicable | Inspect velocity/angularDrag usages after updater; test motion rather than assuming compile means equivalence | P0 C; exact patch behavior verify |
| Lighting generation [U4,U5] | 2023.2/6.0 / graphics | Applicable | Scene/environment baseline and explicit lighting generation | P1 U+I |
| Built-In deprecation [U10] | 6.5 / graphics | Applicable | Retain compatibility checkpoint; create separate URP conversion backlog | P1 U+C |
| URP Render Graph [U7–U9] | 6.2–6.4 / graphics | Possibly applicable | No current SRP declared; mandatory if porting custom outline/reflection passes to URP | P0 on URP branch U+? |
| Dynamic batching deprecation [U12] | 6.5 / graphics | Applicable screening | Do not build optimization plan around it; profile shared materials, instancing, SRP Batcher in URP | P2 U+? |
| Input System action callbacks | Migration / input | Applicable | Introduce adapter; retain installed Lean initially; avoid duplicate old/new input delivery | P1 C+I |
| Input System OnMouse callbacks [U11] | 6.4 / input | Possibly applicable | Useful compatibility feature, not replacement for multi-touch placement actions | P2 U+? |
| Deep OnDisable on Destroy [U9] | 6.4 / lifecycle | Applicable | Test nested colliders/views and idempotent teardown; do not manually propagate duplicate callbacks | P0 U+C |
| SerializeReference ancestor validation [U11] | 6.4 / serialization | Not currently indicated | No matching use found in searched Assets C#; rescan packages and any new polymorphic rule data | P1 if introduced U+C |
| SerializeField restriction [U8] / serialization analyzer [U12] | 6.3/6.5 | Applicable screening | Validate content/UnityEvent serialization and plugin attributes; prefer simple serializable rule records | P1 U+I |
| EntityId / 64-bit identity [U10,U11] | 6.4/6.5 / API | Applicable | EasyColliderEditor lists and ScoreFlash APIs assume int IDs; TCP2 naming usage also compile-audit. Preserve full IDs or replace with owned handles | P0 U+C |
| Asset dependency narrowing [U9] | 6.4 / import | Possibly applicable | EPOOutline ModelPostprocessor exists; existence alone does not prove indirect dependency bug. Test model/prefab updates and declare actual dependencies | P1 U+C |
| ModelImporter obsolete APIs [U10] | 6.5 / import | Applicable screening | Audit all vendor editor code, resolve updater/manual errors; ensure clean reimport | P0 U+? |
| Project Auditor [U9,U12] | 6.4/6.5 / profiling | Applicable | Run integrated Auditor; use obsolete API reports, allocations and repeated work findings | P1 U+C |
| Rendering statistics [U11] | 6.4 / profiling | Applicable | Inspect actual batching and frame metrics; corroborate with player capture | P1 U+I |
| On-tile rendering / PSO improvements [U12] | 6.5 / graphics | Possibly applicable | New URP/mobile branch: compare visual/pass compatibility and shader warm-up hitches | P2 U+I |
| Android minimum API26, AGP/insets [U10] | 6.5 / platform | Applicable if Android ships | Existing API22 setting incompatible with target requirements; update plugins/templates and safe-area layout | P0 U+C |
| iOS runtime framework paths [U9] | 6.4 / platform | Possibly applicable | Audit native build postprocessors; export/build on Mac if iOS ships | P0 conditional U+? |
| ReplayKit removal [U10] | 6.5 / iOS | Possibly applicable | Search Easy Mobile/native integration; Recorder package alone does not establish ReplayKit usage | P1 U+? |
| PVRTC removal [U11] | 6.4 / textures | Possibly applicable | Texture overrides need inventory; compare ASTC/ETC quality and supported devices | P1 U+? |
| Legacy Ads migration [U8] | 6.3 / packages | Applicable screening | Old Ads package installed, telemetry gameplay stub inactive; decide usage then upgrade/remove with vendor evidence | P0 U+C |
| BCL-provided Json/Immutable/etc. [U10] | 6.5 / packages | Possibly applicable | Audit duplicate dependency assemblies, test save serialization; do not assume all bundled DLLs safe | P0 conditional U+? |
| VR module removed [U10] | 6.5 / modules | Applicable | Manifest declares legacy VR module; resolve obsolete dependency during upgrade | P0 U+C |
| Mathematics / Unity Physics core changes [U12] | 6.5 / packages | Possibly applicable | Check asmdefs/package resolution; built-in Rigidbody/PhysX remains distinct from Unity Physics package Direct Solver | P1 U+C |
| Unity Physics Direct Solver [U12] | 6.5 / physics | Not recommended for this migration phase | Not a drop-in global fix for current MonoBehaviour/PhysX architecture; evaluate only in isolated future prototype | P2 U+I |
| Physics Core 2D rename [U10] | 6.5 / physics | Not currently indicated | Current game uses 3D colliders; do not mix 2D and 3D collision systems during migration | P2 U+C |
| Animator entry / nonalloc animation info [U11,U12] | 6.4/6.5 / animation | Possibly applicable | AnimatedButton uses Animator; verify transitions; optimize event allocation only if measured | P2 U+C |
| UI Toolkit changes [U4,U7,U8,U12] | 2023.2–6.5 / UI | Not recommended for this migration phase | Current uGUI/TMP works as target boundary; new authoring UI can use Toolkit later | P2 U+C |
| DirectStorage [U11,U12] | 6.4/6.5 / I/O | Not currently indicated | No demonstrated asset streaming bottleneck; not a stack-CPU optimization | P2 U+? |
| Burst multithreading Web [U11] | 6.4 / platform | Not currently indicated | No demonstrated Web target or Burst workload; avoid jobification of tiny graph prematurely | P2 U+C |
| Adaptive Performance/thermal scaling [U8,U12] | 6.3–6.5 / mobile | Possibly applicable | Evaluate during mobile soak; establish stable base before adaptive quality changes | P2 U+I |
| Project-local logs [U10] | 6.5 / workflow | Applicable | Use `Application.consoleLogPath` or explicit `-logFile` in build automation | P1 U+I |

## 8. Migration Risk Register

Likelihood is a planning estimate, not measured failure probability.

| ID | Risk / evidence | Affected area | Severity / likelihood | Detection | Mitigation / rollback |
|---|---|---|---|---|---|
| R01 | Non-yielding cleanup loop confirmed | SpawnManager/restart | Critical / certain when path executes | Restart trace/hang | Completion transaction; keep baseline copy |
| R02 | 32-bit engine identity assumptions + U10 | EasyColliderEditor, ScoreFlash, TCP2 | High / high | Full compile + ID round-trip tests | Vendor-compatible update or owned handle adapter; revert vendor checkpoint |
| R03 | Legacy packages/native plugins | Mobile/services | High / high | Clean target builds, sandbox service test | Version inventory, upgrade one plugin at a time; previous lockfiles/archive |
| R04 | AABB/height rule changed by proper geometry | Weighted levels | High / certain discrepancy cases | Old/new shadow-mode counts | Approve known bug corrections; switch rule source per level for rollback |
| R05 | Leaked static listeners and nested teardown changes | Spawn/Level/Shape | High / high | 100 reloads, callback counters | Instance services, paired subscription; revert subsystem switch |
| R06 | Win/fail and scoring reentrancy | LevelManager/ScoreManager | High / high | Same-step expiry/hazard test | Terminal-state arbiter; old save copy for comparison |
| R07 | Outline/material/import visual drift | EPO/Highlight/TCP2 | High / medium | Frame captures, clean vs incremental imports | Keep pipeline stable first; revert render branch/assets |
| R08 | Lost prefab/UnityEvent references after extraction | UI/serialized scripts | High / medium | Scene validation and missing-script scan | Facade methods and preserved GUIDs; archive scenes/prefabs |
| R09 | Contact sleep/exit/compound routing wrong | New graph adapter | High / medium | Compound fixture matrix | Persistent pair ledger + explicit invalidation; gate rollout |
| R10 | Timers survive restart/pool reuse | Shape/Level/tweens/audio | High / high | Generation mismatch tests | Tokens/session epochs; cancel on ownership end |
| R11 | API26/device support change | Android | High / confirmed setting gap | Min-device build/run | Update platform commitment and plugins before release; retain old release branch |
| R12 | Frame rate claim hides GPU/thermal limit | Whole game | Medium / unknown | Device profiler/soak | Target budgets and rendering pass analysis; feature quality fallback |

## 9. Performance and Architecture Hotspot Audit

**Confirmed from companions/source:** SpawnManager adjacency is O(N²C²) before recursive traversal, allocations and list searches. `GetStackInformation` is a coroutine in syntax only: its body executes synchronously. `GetStackInfo` and above-list construction build unused debug strings. Per-event all-shape visual refresh may start unbounded infinite tweens. GameManager launches gesture coroutines repeatedly during drag. LevelManager formats clock/countdown every frame. ShapeController polls every instance and repeatedly writes state in LateUpdate.

**Timing hazards:** Awake dependencies between UI/Game/Level; Spawn configuration versus Shape.Start; rest detection ignoring angular velocity; collision-to-score fan-out; timer shape removed from lists before physical removal; delayed cleanup overlapping a new spawn.

**Safe first changes:** remove empty callbacks, remove dead string formatting, fix recursive AnimatedButton getter, pair subscriptions, instrument work counts. **Medium refactors:** single gesture deadline, state-owned clocks, registry caches, development command adapter. **Deep refactors:** contact graph, shape state machine, outcome/persistence transaction, renderer conversion. Initialization-only GetComponent/Find calls are lower priority than repeated graph work.

## 10. `Update()` / `FixedUpdate()` Triage Matrix

The [FPS deep dive section 3](Frame_Rate_and_Event_Driven_Design_Deep_Dive.md#3-complete-game-script-loop-triage) contains responsibility-level classification, mechanisms, benefits and risks for every scoped occurrence.

| Script | Method | Responsibility | Keep / throttle / replace | Mechanism / benefit | Risk / priority |
|---|---|---|---|---|---|
| GameManager | Update | Time, keys, drag/rotation | Split | Input callbacks + deadline; selected continuous rotation tick | Medium / P1 |
| ShapeController | Update | Selection, height, popup | Replace polling; keep active presentation | Lean events, dirty bounds, active projection | Medium / P1 |
| ShapeController | LateUpdate | Dock/release/physics flags | Replace decisions | Placement state transition hooks | High / P1 |
| SpawnManager | Update | Developer controls | Replace | Development-only action/command dispatch | Medium / P2 |
| SpawnManager | LateUpdate | Empty | Remove | No replacement | Low / P2 |
| LevelManager | Update | Clock, countdown, outcomes | Split | Display timer + terminal arbiter + hazard callbacks | High / P0 |
| CameraController | Update | Empty | Remove | Retain active shake coroutine | Low / P2 |
| DockColliderController | Update | Empty | Remove | Dock config on change | Low / P2 |
| DurationScale | Update | Empty | Remove | Active animation coroutine remains | Low / P2 |
| FloorColliderController | Update | Empty | Remove | Physics callback remains | Low / P2 |
| Loader | Update | Empty | Remove | Explicit bootstrap | Low / P2 |
| PlatformController | Update | Empty | Remove | Contact adapter | Low / P2 |
| RdWAnalytics | Update | Empty | Remove | No active analytics behavior proven | Low / P2 |
| ScoreEffect | Update | Empty | Remove | Score-triggered active animation | Low / P2 |
| ScoreManager | Update | Empty | Remove | Committed score snapshot | Low / P2 |
| UIManager | Update | Empty | Remove | State observers | Low / P2 |
| All scoped scripts | FixedUpdate | None declared | No existing method to remove | A future single physics coordinator is legitimate | Verify vendor loops separately |

## 11. Event-Driven Refactor Opportunities

| Candidate / current trigger | Proposed emitter → listeners and payload | Lifecycle / ordering | Benefit / risk / phase |
|---|---|---|---|
| Selection polled on every Shape | InputAdapter → PlacementController; shape handle, pointer, selected state | Up+deselect deduplicated, unsubscribe on disable, cancel on focus loss | Less idle work; changed release ordering risk / 7 |
| Static collision → full synchronous rebuild | ContactLedger → StackService; pair deltas, simulation step, revision | Stage until completed physics step; coalesce; no reentrancy | Fewer rebuilds and geometry correctness / high / 7 |
| All-shape faces | StackService → matching presenter; old/new count, band, revision | Commit first; late subscriber reads snapshot; one tween | Less renderer/tween churn / medium / 7 |
| Every-frame clock text | Clock service → HUD; displayed second | Exact deadline separate; pause clock specified | Lower GC/UI cost / low / 7 |
| Floor event + countdown polling | HazardAdapter/timer → SessionController; cause, step, epoch | Failure-first same-step arbitration, one result event | Deterministic outcomes/rewards / high / 2,7 |
| Delayed clear with busy wait | CleanupService → session loader; completion token | Invalidate old epoch; unregister/disable then teardown; only load after complete | Removes hang/overlap / high / 2 |

Typed C# delegates handle domain notifications; UnityEvents are for deliberate inspector integration. Commands have one owner. Events are main-thread and post-commit; handlers must not mutate collections being published. Pending listener work is queued. New instance services avoid static lifetime leaks; remaining static channels need explicit reset and subscription accounting with domain reload disabled.

## 12. Decoupling and Modularization Opportunities

| Class | Current problem / evidence | Proposed boundary | Benefit / affected scripts | Timing / risk |
|---|---|---|---|---|
| Quick win | Static subscriptions without teardown | Paired OnEnable/OnDisable or explicit Bind/Dispose | Prevent duplicate calls; Spawn/Level | Before upgrade / low |
| Quick win | Repeated material/outline lookup and fade | Cached view adapter with owned tween | Predictable lifetime; Shape | Before or phase 7 / low-medium |
| Quick win | Public debugging/input in SpawnManager | Development command adapter | Clear production path | Phase 2 / low |
| Medium | Session time/outcomes spread across managers | `SessionStateMachine`, `IClock` | Single authority; Game/Level/UI | After baseline, before broad EDD / medium |
| Medium | Unvalidated content arrays/capacity | Validated level assets and catalog API | No null/out-of-range levels; LevelData/Maker/WorldData | Phase 8 / medium |
| Medium | Spawning finds scene objects by name | Bootstrap-owned references and registry | Testable lifetime; Spawn/Shape/Platform | Phase 7–8 / medium |
| Deep | Graph, rules and effects in one hub | Contact/graph/rule/removal services | Pure tests and no recursive effects | Phase 7 / high |
| Deep | UI writes/persistence mixed with outcome | Outcome snapshot → persistence and presenters | Single score/save transaction | Phase 8 / high |
| Do later | Whole project DOTS/jobification/UI Toolkit rewrite | Only measured isolated adoption | Current small board does not justify broad rewrite | After release checkpoint / high |

Keep serialized public facade methods until prefab/scene UnityEvent targets are migrated. Preserve script `.meta` GUIDs when moving existing scripts in Unity. New ScriptableObject definitions hold immutable configuration; mutable per-session state belongs in runtime objects.

## 13. Phased Implementation Plan

Each phase exits only after its checks pass. Estimates below in section 14 are planning ranges, not commitments.

### Phase 0 — Safety, baseline, and observability

**Objective:** create a reproducible recovery point and measurable baseline. **Tasks:** verified archive/version control; retain meta files, Packages and ProjectSettings; inventory vendor DLLs/source/native SDKs and all target scenes; capture player builds/screenshots/input recordings; CPU/GPU/GC/memory/load-time baselines; list existing test coverage. **Affected:** entire project, build workflow. **Dependencies:** access to editor/license and target devices. **Risks:** assuming current game is already correct or runnable. **Exit:** a recoverable copy, reproducible baseline scenario and documented known failures. **Artifacts:** baseline manifest, package inventory, profiler captures, screenshot board, regression checklist.

### Phase 1 — Companion-doc review and migration inventory

**Objective:** translate evidence into owned work. **Tasks:** verify missing master index, classify all loop/coroutine/event roots, inspect scene/prefab references, confirm pipeline quality overrides, target platform commitments and vendor support. **Affected:** hubs plus plugins. **Dependencies:** phase 0. **Risks:** generated caller candidates mistaken for runtime facts. **Exit:** P0 blocker owners and exact package/editor matrix. **Artifacts:** this plan augmented with verified scene wiring, vendor upgrade sheet and ticket backlog.

### Phase 2 — Pre-upgrade cleanup on Unity 2023.1

**Objective:** remove existing correctness traps that obscure migration failures. **Tasks:** nonblocking cleanup, idempotent outcomes, event unsubscription, AnimatedButton getter, timer cancellation, remove empty messages/dead formatting, isolate debug commands; fix warnings without deleting externally wired APIs. **Affected:** Spawn/Level/Game/Shape/UI. **Dependencies:** baselines; tests for changed behavior. **Risks:** altering gameplay before evidence capture. **Exit:** restart and terminal-outcome tests pass; no new warning noise; baseline physics/rendering retained. **Artifacts:** cleanup checkpoint and before/after profiles.

### Phase 3 — 2023.2 compatibility pass

**Objective:** verify first engine transition. **Tasks:** install/use separate copy; resolve package compile issues; lighting bake/probe checks; inspect runtime texture/mipmap and graphics format usage; smoke input/UI/shape placement. **Affected:** rendering/import/plugins. **Dependencies:** phase 2. **Risks:** automatic lighting changes. **Exit:** clean build and approved screenshots on tested target. **Artifacts:** 2023.2 checkpoint and regression log.

### Phase 4 — Unity 6.0 compatibility pass

**Objective:** stable Unity 6 baseline. **Tasks:** API Updater review, vendor/native updates, obsolete physics/find APIs, serialization/save round-trips, rendering/input and mobile build tests. **Affected:** all assemblies and native integrations. **Dependencies:** phase 3, vendor versions. **Risks:** updater cannot repair behavior or unsupported APIs. **Exit:** editor and player compile, shape contacts/results match accepted baseline, no missing serialized references. **Artifacts:** updater diff/log and Unity 6 checkpoint.

### Phase 5 — Unity 6.1 to 6.3 stepped stabilization

**Objective:** prevent accumulated regressions. **Tasks:** execute each matrix row independently; validate Android tools per actual patch, texture overrides, Windows graphics API, optional URP passes, legacy Ads and DLL binary compatibility. **Affected:** plugin/graphics/platform subsystems. **Dependencies:** phase 4. **Risks:** changed vendor binaries silently losing scene compatibility. **Exit:** per-step build/test/capture records, resolved package lock. **Artifacts:** step-specific compatibility evidence.

### Phase 6 — Unity 6.4 and 6.5 adoption

**Objective:** reach requested target while preserving verified gameplay. **Tasks:** 6.4 nested teardown/import/serialization/EntityId pass; 6.5 full-width IDs, removed VR module, importer errors, package/BCL audit, Android API26 and insets, project-local log workflow; run integrated Project Auditor. **Affected:** EasyColliderEditor, ScoreFlash, TCP2, EPO, mobile plugins and all scene lifecycles. **Dependencies:** phase 5 and available target editor/modules. **Risks:** assuming 6.4 compilation guarantees 6.5 compatibility. **Exit:** no P0 compiler/import/runtime errors, clean target builds, all regression cases pass. **Artifacts:** 6000.5.0f1 compatibility checkpoint and approved residual-debt list.

### Phase 7 — Performance refactor pass

**Objective:** reduce unnecessary hot-loop work measurably. **Tasks:** input adapter/placement state, clock/debounce, cached collider registry, shadow-mode contact graph and count algorithm, transactional rules, changed-only visuals, allocations removal. **Affected:** Game/Shape/Spawn/Level/Score presenters. **Dependencies:** stable engine checkpoint and weighted Play Mode fixtures. **Risks:** incorrect contact routing/sleep invalidation and rule semantics. **Exit:** correctness suite, zero idle graph solves, reduced measured CPU/GC without GPU/visual regressions. **Artifacts:** graph/service implementation, tests, before/after profiler report, rollout flag retirement plan.

### Phase 8 — Modularization and maintainability pass

**Objective:** make new ownership explicit and content authorable. **Tasks:** split facades from domain services, content ScriptableObjects/validation, bootstrap wiring, save schema, narrow interfaces, migrate UnityEvent references. Optional separate URP visual spike begins only with its own baseline. **Affected:** all hubs/content/UI. **Dependencies:** phase 7 stable behavior. **Risks:** GUID/reference breakage, overengineering. **Exit:** registry/state owners documented; no duplicate writers; assets/save data round-trip; scene audit clean. **Artifacts:** assembly boundaries, authoring tools, architecture decisions and updated companions.

### Phase 9 — Validation, hardening, and release readiness

**Objective:** prove a shippable target build. **Tasks:** target-device profiles, restart soak, memory snapshots, contact stress, thermal soak, platform service tests, audio/UI/accessibility/visual checks, scene load/save migration, player builds. **Affected:** all release targets. **Dependencies:** phases 6–8. **Risks:** Editor-only success or average-FPS-only signoff. **Exit:** section 16 budgets and section 17 gates pass; remaining issues have accepted owners; restore rehearsal succeeds. **Artifacts:** release candidate, benchmark report, test XML, known-issues list and rollback package.

## 14. Prioritized Backlog

Effort is engineer-days excluding external vendor waits; geometry/rendering estimates need revision after fixtures and visual inventory.

| ID | Item | Phase / affected | Benefit | Effort | Risk / dependency | Priority |
|---|---|---|---|---:|---|---|
| B01 | Baseline/archive/device matrix | 0 / all | Recovery and honest measurement | 1–3 | Device/editor access | P0 |
| B02 | Nonblocking restart transaction | 2 / Spawn+Level | Remove hang and old/new scene overlap | 1–3 | Outcome/clear tests | P0 |
| B03 | Terminal arbiter and save-once | 2 / Level+Score | No double rewards/failure | 2–4 | B01 | P0 |
| B04 | Vendor identity/native package audit | 1,4–6 / plugins | 6.5 compilation/build | 3–10 | Vendor availability | P0 |
| B05 | Lifecycle unsubscribe/timer ownership | 2 / Shape+Spawn+Level | No restart leaks | 1–3 | Pool/session model | P0 |
| B06 | Stepped engine compatibility | 3–6 / all | Target version | 5–15 | B04, backups | P0 |
| B07 | Collider registry/contact fixtures | 7 / physics | Compound correctness | 3–6 | Stable target | P1 |
| B08 | Graph/count/rule services | 7 / Spawn+Shape | Correct weights, fewer rebuilds | 4–8 | B07 and policy decision | P1 |
| B09 | Input/placement adapter | 7 / Game+Shape | No idle selection polling | 3–6 | Lean callback tests | P1 |
| B10 | Clock and presenter deltas | 7 / Level+UI+Shape | Lower GC/tween/canvas work | 2–4 | B03,B08 | P1 |
| B11 | Validated level assets/bootstrap | 8 / data/managers | Content safety and maintainability | 3–6 | GUID/save audit | P1 |
| B12 | Profiler-led render optimization | 9 / outline/water/materials | GPU frame time | 2–8 | Captures on target | P1 |
| B13 | URP parity branch | Separate / shaders+assets | Long-term render modernization | 5–15 | Baseline and vendor support | P2 |
| B14 | DOTS/Burst/2D engine experiments | Later | Only if measured need | Re-estimate | No current requirement | P2 |

## 15. Script-Level Recommendations

| Script/subsystem | Why important / migration concern | Performance/modularity action | Phase |
|---|---|---|---|
| SpawnManager | Most gameplay fan-out; source API/vendor dependencies | Split registry, spawn, graph, rules and removal; fix clear before optimizing | 2,7,8 |
| ShapeController | Every piece; Rigidbody/Lean/material/outline lifecycle | State machine, compound collider cache, stable IDs, separate presenter | 6,7 |
| GameManager | Legacy input and session counters | Callback adapter + active rotation; one debounce; explicit clock | 7 |
| LevelManager | Outcomes/persistence/HUD and catalog | Terminal arbiter, deadlines, coherent score snapshot | 2,7,8 |
| ScoreManager | Award calculations/save logic; divide-by-zero and stale bonuses documented | Pure recomputation resets all slots; zero-height validation; save once on outcome | 2,8 |
| UIManager | Awake-order coupling, maker-only Play, placeholder level select | Bootstrap state read, event presenters, implement real catalog navigation in rebuild | 8 |
| Platform/Floor/Dock | Physics routing and named boundary | Cached owner lookup, one hazard command, explicit dock config; purge contacts on removal | 7 |
| AnimatedButton | Recursive getter and delayed invocation | Fix getter; one command per activation; Animator timing test after upgrade | 2,6 |
| CameraController | Concurrent shakes share mutable fields | One owned shake channel with restore/cancel; no invented camera-follow port | 7 |
| DamagePopup/ScoreEffect/DurationScale | Incomplete/hard-coded display flows | Actual data-driven values, bounded active animation, pool lifecycle | 7–8 |
| LevelData/Maker/Info/Status | Partial catalogs and parallel-array validation | Authoring assets, derived counts on validation, explicit IDs, compatible serialized migration | 8 |
| WorldData/WorldInfo | Sparse arrays and mutable lock/cost | Validated catalog/progress boundary; no assumed purchase implementation | 8 |
| SoundManager/Sound | Wrong source stopped, pause-sensitive counter cleanup | Audio voice ownership, unscaled/DSP timing, reset on cancellation | 8 |
| AppInfo/RdWUtilities | Singleton initialization and persistent date parsing | Explicit initialization, validate URLs, tolerant save parsing | 8 |
| EffectManager | Instantiate API with unproven caller/lifetime | Audit actual use; pool only needed active effects | 7–8 |
| Loader/RdWAnalytics | Empty scaffolding | Remove empty callbacks; do not assume bootstrap/analytics functionality exists | 2 |
| EPO/Highlight/TCP2/MeshExploder/ScoreFlash | Rendering and vendor contracts | Version inventory, ID/API compile, pass profiling, importer tests | 1,4–6,9 |

## 16. Validation and Profiling Plan

Use the [FPS document](Frame_Rate_and_Event_Driven_Design_Deep_Dive.md) protocol. Proposed acceptance budgets: 60 FPS / 16.67 ms presentation target, p95 CPU main thread and GPU each ≤12 ms, presented p99 ≤20 ms in the agreed normal workload; graph pipeline p95 ≤0.5 ms for 14-shape baseline; no steady-state graph allocations after warm-up; zero graph solves on an unchanged sleeping stack. These targets are provisional until minimum hardware, resolution and quality are selected.

Capture idle, drag/rotate, collapse, special-shape chain, result UI, restart and load scenarios. Record p50/p95/p99/max, allocation bytes, active bodies/colliders/contacts, solve/tween/event counts, draw calls and render passes. Measure cold/warm level load separately. Compare memory after 100 restart cycles at the same lifecycle/GC boundary; require no retained shape/material/listener growth. Mobile: 15-minute thermal soak. Use player builds and final release validation; Editor overhead and Deep Profile are not final performance evidence.

Tooling: Profiler Timeline/Hierarchy, allocation call stacks, Physics/GPU modules, Frame Debugger, Memory Profiler, integrated Project Auditor. Add markers around contact ingestion, solve, rules, views and cleanup. Use explicit per-build log/test output paths; 6.5 logs are project-local by default. API Updater accepts `-accept-apiupdate` in batch mode but its edits must still be reviewed [U13].

## 17. Test Strategy

| Layer | Required tests | Acceptance evidence |
|---|---|---|
| Smoke | Boot, open menu, load actual authored level/maker, place all pieces, fail/retry/win | Clean player log and correct state transitions |
| Scene lifecycle | Repeated load/unload, nested disable/destroy, reload disabled, pool reuse | No stale callbacks/references; listener and registry counts return to baseline |
| Save/load | Existing PlayerPrefs keys, zero/missing values, malformed dates, repeat outcomes, stars/coins | Approved migration mapping and one award/write per result |
| Input | Mouse/touch/keyboard, UI capture, release outside view, cancel/focus loss, multi-pointer exclusion | One placement per release and refresh-rate-independent response |
| UI/animation | Countdown digits, weights, button transitions, result screens, delayed subscription | Text changes once per value; one owned animation/tween |
| Physics | L/T/+/^/U/ring, convex single/compound, child exits, sleep/wake, moving supports | Play Mode contact/weight oracle and no false notch contacts |
| Rules | Threshold boundaries, bridge/diamond/cycles, timer arming/unload/expiry, fire pair dedup | Deterministic declared semantics and removal-once |
| Audio | Correct source stop, mute persistence, pause, repeated effects, scene teardown | No stranded counters or unintended sounds |
| Migration | Clean import, shader/pass screenshots, inspector references, ID widths, updater diffs | No missing script/field/import error on target |
| Platforms | Desktop and agreed mobile builds, native services if used, safe areas, thermal | Actual device run, not only successful compile |
| Performance | Standard capture suite and stress matrix | Section 16 budgets and before/after report |

**Executed in this task:** 27 Python reference test methods, including 2,000 independent geometry comparisons, 1,000 random graph comparisons, transformations, compound-pair lifecycle and idle publication tests. **Not executed:** Unity Edit/Play Mode, PhysX integration, package migration, target build, screenshot parity or device FPS. Full details and reproducible test command are in the weighted deep dive. A Unity Hub installation was observed, but a usable target Editor was not established from the checked default location; no Editor launch was attempted.

## 18. Open Questions and Unknowns

| Question | Why it matters | Missing evidence / verification |
|---|---|---|
| Minimum device and shipping targets? | Frame budget, API26 and plugin commitments | Product/platform matrix and actual device runs |
| Exact 6000.5.0f1 binary/toolchain available? | Reproducible builds | Unity Hub/archive installer, modules and patch release notes |
| Which vendor versions have 6.5 support? | Identity/native/render compatibility | Asset receipts/changelogs/current vendor packages |
| Which scenes and persistent UnityEvents are active? | Safe extraction/removal | Editor scene/prefab validation report |
| Actual quality-level render overrides? | Rendering assumptions | QualitySettings + runtime GraphicsSettings inspection |
| Exact original-game bridge, timer-unload and collision rules? | Count policy fidelity | WiiWare play capture and adversarial reference experiments |
| Maximum board size/collider count? | Algorithm and buffer budgets | Prefab/content inventory and intended new levels |
| Is force-based “weight” wanted? | Entirely different solver | User/game-design decision; current evidence supports counts |
| Existing save compatibility obligations? | Reward/schema changes | Real sample saves and version policy |
| Which existing graphics match the reference? | Rebuild reuse and asset estimates | Screenshot comparisons and shader/render pass inventory |
| Where is the referenced master index? | Companion navigation/evidence gap | Recover original generation artifact or create a separate new index later |

## 19. Recommended Order of Attack

1. Archive and capture the current build; select minimum target hardware.
2. Fix cleanup hang, double outcomes and listener/timer ownership.
3. Inventory vendors and resolve 6.5 EntityId/native plugin blockers.
4. Execute release-order compatibility checks through 6.5, retaining recoverable checkpoints.
5. Introduce stable registry and contact adapter in shadow mode.
6. Validate concave/compound fixtures; switch weight/rule source transactionally.
7. Replace selection/clock/debug polling, all-shape face updates and repeated allocations.
8. Profile CPU/GPU and optimize the measured limiting subsystem.
9. Finish content/persistence boundaries; validate devices and thermal/restart soak.
10. Schedule separate URP visual modernization or the from-scratch rebuild after choosing that delivery path; defer DOTS/force-solver experiments until justified.

## 20. Final Summary

The practical migration is driven by **plugin compatibility, lifecycle correctness and physical/game-rule parity**. Unity 6.5 introduces concrete concerns beyond the original prompt examples: 64-bit EntityId, obsolete ID APIs, VR module removal, Android API26, and Built-In rendering deprecation. Integrated Project Auditor, improved profiling/render statistics and callback-based input are immediately useful; other new features need project-specific evidence.

The highest-value runtime redesign is a **persistent collider contact ledger → dirty support graph → pure count/rule evaluation → changed-only presentation** pipeline with one state owner and explicit session lifetime. Combine it with nonblocking cleanup, idempotent outcomes and active-only manipulation. The reference algorithms pass their executed engine-independent tests; shipping confidence requires the listed Unity contact, visual, build and device-performance gates.


---

<!-- ====================================================================== -->
<!-- FILE: Weighted_Shapes_SOLID_EDD_Deep_Dive.md -->
<!-- ====================================================================== -->

# Weighted shapes: SOLID, event-driven calculation and display

**Date:** 2026-09-23 · **Target:** Unity 6000.5.0f1 · **Status:** proposed architecture plus executed engine-independent reference tests.

## 1. Define “weight” before choosing an algorithm

**Confirmed from companion docs and source:** this project uses the number of shapes above a shape, not kilograms or reaction force. `ShapeController.shapeweight` is an integer; `SpawnManager.GetShapeInfoAbove` assigns `aboveshapes.Count`. `ProcessShapeStack` destroys a weighted shape when `count >= LevelManager.shapemaxweight`. The default catalog threshold is 3, meaning two counted shapes are allowed and the third triggers breakage. The reference WiiWare review also describes limits in numbers of shapes [R1]. Its exact bridge/cycle counting semantics are not documented.

Recommended initial policy: **UniqueSupportedShapeCount**. An edge `A → B` means A provides an upward-facing physical contact to B under the configured gravity direction. Weight(A) is the number of distinct gameplay shapes reachable through these directed edges, excluding A. This is a discrete arcade rule. It deliberately counts a bridge once for each of its supporters; it is not a conservation-of-mass calculation. Preserve the existing aggregate score metric only under a clear name such as `SumOfSupportCounts`, because summing these weights double-counts shapes across ancestors and is not total stack mass.

Keep these quantities distinct:

| Quantity | Meaning | Owner |
|---|---|---|
| Rigidbody mass | Physics solver mass, in kg | Physics authoring/configuration |
| Supported shape count | Unique reachable shapes, excluding self | `IWeightPolicy` |
| Break threshold | First forbidden supported count | `WeightedRuleDefinition` |
| Actual support force | Contact reaction force/impulse over time | Separate future force policy, if requested |
| Stack height | Geometric extent above a defined platform datum | Bounds service |

**Scope of correctness:** graph counting works for arbitrary finite directed graphs and is independent of silhouette. Contact extraction must correctly represent the authored collision geometry. No finite test suite proves correct physical behavior for every imaginable concave mesh, self-intersection, scale, frictional interlock, or PhysX solver configuration. This design supports arbitrary valid compounds of supported convex/primitive colliders, and defines deterministic arcade semantics for cycles. Actual 3D contact integration and high frame rate require the Unity validation gates below.

## 2. Current implementation and failures

Primary evidence: [SpawnManager](SpawnManager.cs.md) sections 5, 7–10; [ShapeController](ShapeController.cs.md) sections 5, 9–10, 22–24; [PlatformController](PlatformController.cs.md); [LevelManager](LevelManager.cs.md).

| Current behavior | Problem | Replacement |
|---|---|---|
| `GetShapeData2`, source L835–883, calls `GetComponents<Collider>()` on each root | Child colliders absent; allocating discovery during rebuild | Register root+child colliders once, filtered by owning `attachedRigidbody` |
| Uses `f.bounds.Intersects(g.bounds)` | World AABB overlap is only a broad-phase candidate; rotated pieces and empty concave regions create false positives | Actual contact manifold from physics callbacks |
| `GetShapeDataAbove`, L886–933, compares `d.shapeheight > top.shapeheight` to the original root | A tall L wall can be higher than the object genuinely resting on its low ledge; side contacts can count falsely | Direction from contact normal, never top-height/center-height ordering |
| Recursion + shared `shcv` + `ToArray` | Difficult ownership, allocations and stack depth | Iterative traversal with reusable visited stamps |
| `ShapeController.Update` samples a single collider maximum | Incorrect compound height; stale sleeping/moved state | Aggregate enabled gameplay collider bounds when dirty |
| `SetAllShapeFaces` after each rebuild | Unchanged objects refreshed repeatedly | Changed-only visual model publication |
| `SetFaceProperties` has overlapping `>=2` and `>=3` branches | Multiple infinite outline fades can be launched in one call | Exclusive visual states, one owned tween |
| Rules are nested in neighbor traversal with shared checked list | Evaluation depends on neighbor ordering; duplicate destruction/timers | Evaluate each shape rule once against a committed snapshot |
| Timer objects removed from `playedshapes` before visual/physical destruction | Geometry and scoring disappear before the physical support does | Separate armed state from actual logical removal |
| `ShapeDestroyer` can request another stack update synchronously | Reentrant mutation and deferred-Destroy confusion | Command buffer; logical removal before disabling colliders and deferred visual teardown |

## 3. SOLID architecture and data contracts

| Component / interface | Single responsibility and dependency direction |
|---|---|
| `ShapeRegistry` / `IShapeReadModel` | Own live handles, collider ownership, placement eligibility and generation; no rendering |
| `UnityContactSource` / `IContactSource` | Convert Unity collision messages into normalized per-pair snapshots; no scoring |
| `ContactLedger` | Persist active collider-pair contacts and classify directional relations |
| `ISupportPolicy` | Decide whether normalized contacts qualify; gravity/angle/hysteresis policy |
| `SupportGraph` | Maintain shape-level adjacency/reverse adjacency and multiplicity |
| `IWeightPolicy` | Compute counts from read-only graph; pure logic |
| `ShapeRuleEvaluator` | Threshold, timed and fire rules → commands; no `Destroy` or renderer calls |
| `RemovalService` | Deduplicate removal commands, unregister state, disable physics, schedule teardown |
| `IWeightReadModel` / `WeightPresenter` | Publish and consume count/style changes; no physics ownership |
| `IClock` / timer service | Cancellable scaled gameplay deadlines keyed by session and shape generation |

**S:** these responsibilities change for different reasons. **O:** new count/force rules are new strategies, not additional branches in SpawnManager. **L:** each weight strategy declares its unit and result type; a force-valued policy must not silently masquerade as an integer count. **I:** presenters read values/events; they cannot mutate colliders or registry. **D:** domain logic depends on plain records/interfaces, while Unity adapters depend on domain contracts. Avoid an interface for every trivial field; use boundaries for replaceable I/O and rules.

Suggested records:

```text
ShapeHandle = (SessionEpoch, MonotonicShapeId, PoolGeneration)
ColliderHandle = (ShapeHandle, AuthoringColliderIndex, ColliderGeneration)
PairKey = ordered(ColliderHandleA, ColliderHandleB)
ContactSnapshot = (PairKey, SimulationStep, Revision, NormalizedContacts, Active)
SupportEdge = (SupporterShapeHandle, SupportedShapeHandle)
WeightDelta = (ShapeHandle, GraphRevision, PreviousCount, Count, VisualBand)
RemovalCommand = (ShapeHandle, Reason, TransactionRevision)
```

Use your own monotonic handles instead of the current random 1..2999 IDs. Unity 6.5 changes engine identity to 64-bit `EntityId`; if adapters retain engine IDs use that type without downcasting [R5]. An explicit authoring child index plus generation is also portable across engine upgrades. Never use `GetHashCode()` as identity.

## 4. Collider authoring for concave and convex shapes

Use one Rigidbody on the shape root. Under it, use primitive colliders or convex MeshCollider pieces that approximate the visible solid. Do not add a Rigidbody to each limb; that produces separate bodies. A single convex hull around L/T/+/^ fills the notches and changes gameplay. A non-convex dynamic MeshCollider is not the default solution; use convex decomposition [R2].

| Type | Example compound | Critical test |
|---|---|---|
| L | Vertical bar plus disjoint horizontal foot | Object on low foot counts despite lower top than vertical limb; object in open notch does not collide |
| T | Stem and top cap | Both cap contacts with one object count once; side of stem is not upward support |
| + | Vertical bar plus two horizontal wings | Re-entrant corners remain open; rotations do not fill corners |
| ^ | Two sloped convex limbs | Actual inclined contact can support; limb AABB overlap alone cannot |
| U / ring | Bars around a cavity/hole | Empty cavity stays empty; object on inner floor creates real support |
| Convex single | Box/sphere/capsule/convex mesh | Same logical count with one or several contact points |
| Convex compound | Adjacent pieces forming the same convex silhouette | Same shape-level rule result as equivalent single solid |

Prefer non-overlapping decomposition for predictable mass distribution and fewer redundant contacts. Overlapping pieces can still be deduplicated for counting, but may change center-of-mass/inertia and solver response. Validate thin limbs, cracks at seams, convex cooking limits, collision layers, trigger flags, and mesh scale. Bake nonuniform/negative transforms into collision assets where practical; avoid sheared collider hierarchies. Geometry-test mirror invariance does not certify Unity negative-scale cooking behavior.

Initial registry discovery can use `GetComponentsInChildren<Collider>(true)` once. Include only colliders whose `attachedRigidbody` is the registered body's Rigidbody and which are enabled gameplay solids when building contact eligibility. Decorative trigger volumes have a separate role. Maintain explicit registration for runtime topology changes.

## 5. Contact ingestion: compound-safe and lifecycle-safe

### 5.1 Collect authoritative contact data

On collision enter/stay, read contacts into a reused buffer using `Collision.GetContacts`; group by the contacts' `thisCollider`/`otherCollider`, not merely by `collision.gameObject`. Resolve both to cached owners. Normalize each contact to a canonical pair order and normal orientation once. For candidate `A supports B`, `n_B` means the contact normal pushing on B, away from A. Verify this orientation with a box-on-platform Play Mode test; a sign error reverses every edge.

Do not persist a Unity `Collision` object; callback reuse is possible. Copy the minimal values/qualifications needed. One adapter side should own each pair's update, or accumulate both mirrored reports and canonicalize/deduplicate before committing. Never increment a counter for every stay callback. A same-step manifold is a replacement snapshot, not a stream of independent “+1” events. If Unity batches multiple collider pairs in one body callback, partition all contacts before replacing pair state; do not erase a sibling pair because only one relay was observed.

### 5.2 Classify support

For nonzero uniform gravity `g`, define `up = -normalize(g)`. A contact supports B from A when:

```text
dot(normalize(n_B), up) >= enterCosine     // proposed start 0.55
contact.separation <= supportSkin         // proposed start 0.02 world units
both owners eligible, distinct, registered and physically present
```

Retain a previously qualifying contact while dot ≥ `exitCosine` (proposed 0.45) to avoid angle flicker. These are tunable values tied to world scale and physics contact offset, not recovered WiiWare constants. Separate “geometric contact exists” from “upward support qualifies.” At normal separation skin, slight positive separation may be accepted as the solver's contact; visibly distant shapes are rejected. Root center or maximum Y is never part of this predicate.

Evaluate normals in both directions for all manifold points; unusual interlocks may produce both shape-level directions at different contacts. Zero gravity disables this directional policy with an explicit status. Spatially varying/radial gravity requires a contact-local gravity provider and separate design tests; the existing `useCircGravForce` field does not prove a complete supported radial-gravity game mode.

This is an **arcade support approximation**. A vertical side contact can carry frictional load but is excluded; an upward contact need not be carrying substantial force. If frictional force or torque sharing must determine breakage, use the alternative in section 10. Do not market contact-normal reachability as an exact mechanics solver.

### 5.3 Aggregate collider pairs into shape edges

For each collider pair store the set of qualifying directed shape relations. Define an edge refcount as the number of **active collider-pair records** supplying that relation, not number of contact points or callbacks. An edge exists while that count >0. Replace a pair record by diffing old/new relation sets. Exiting one T cap collider must not erase support still supplied by another collider.

On collision exit, remove only the affected pair records, using verified collider identity/routing. On shape removal, collider disable, trigger-role change, scene unload, or pool return, explicitly purge all incident records; do not depend exclusively on `OnCollisionExit`. Keep tombstone revisions or generation changes so a delayed stay cannot resurrect a removed pair. Reject old session and pool-generation messages.

**Sleeping:** Unity does not send collision stays for sleeping Rigidbodies [R3]. Preserve their last valid records; a last-seen TTL would incorrectly erase a sleeping tower. Reconcile on known transforms/topology changes, waking bodies and moving supports. Use an active-body sampler for externally moved objects and a low-frequency development integrity check; never claim that enter/exit alone captures sliding normals. Timely contact stay processing remains necessary for awake bodies.

### 5.4 Snapshot ordering

Stage callbacks, then commit at a known physics boundary. The recommended initial coordinator processes the previous completed step at the next `FixedUpdate`, explicitly accepting one step of latency. Do not call this “after physics” within the same step. A later PlayerLoop post-physics hook can remove that latency after dedicated verification. Evaluate gameplay deadlines through this coordinator so a render-frame timer cannot overtake pending hazard contacts.

Transaction: apply removals → ingest pair snapshots → diff support edges → calculate weights → evaluate rules once per shape → enqueue unique commands → commit removal eligibility → publish coherent deltas. New work produced by listeners goes to the next transaction, never recursion.

## 6. Count algorithm, proof obligations and complexity

For each requested shape root:

```text
visited = { root }; work = [ root ]
while work not empty:
    current = pop(work)
    for child in outgoingSupportEdges[current]:
        if child not visited:
            add child to visited
            push child to work
weight[root] = visited.Count - 1
```

In C#, reuse an integer stack and a visit-stamp array keyed by dense registry slot. Stamp wrap must clear stamps safely. Count only live gameplay shapes; platforms are support endpoints but contribute zero units and should not create cross-platform traversal shortcuts. Keep counts for regular/timer shapes too if scoring/timer rules consume them.

Correctness argument: the root is marked before traversal, so cycles cannot count it. Each reachable node is marked at most once, so multiple colliders and diamond paths cannot duplicate it. Every outgoing edge of a visited node is considered, so every reachable node is eventually marked. The graph is finite; each node enters the work list at most once; termination follows. No height sorting or DAG assumption is required.

**Cycle policy:** mutually supporting interlocked shapes count one another once and inherit reachable shapes beyond the cycle. This is deterministic, conservative arcade semantics, not proof of load distribution. Detect strongly connected components in authoring/debug views to explain unexpected counts. An SCC can be collapsed for faster bitset reachability while preserving this semantics, but do not silently discard all cycle edges.

Complexity is O(V+E) per root, O(W(V+E)) for W monitored roots and O(V(V+E)) if every shape is evaluated. Space O(V+E) plus O(V) scratch. For ~14 shapes, exact full recompute on graph change is simpler and safer. For larger boards, benchmark bitsets or recompute old/new reverse ancestors of changed edges. Weight recomputation is needed after an edge deletion even when no new contacts occur.

### Worked examples

| Graph | Expected counts |
|---|---|
| A → B → C | A=2, B=1, C=0 |
| A → B, A → C, B → D, C → D | A=3, B=1, C=1, D=0 (D once for A) |
| A → C, B → C (bridge) | A=1, B=1, C=0 (no force split) |
| A → B → C → A, C → D | A=B=C=3, D=0; no self-count or infinite recursion |
| Side-only contact A—B | No support edges; both counts zero |
| One object contacting two child colliders of L | One logical supported shape |

## 7. Rule evaluation and removal semantics

Weighted rule: `count >= breakAtCount` queues removal once. Authoring should use `BreakAtCount` or `MaxSupportedCount` with an explicit conversion (`BreakAtCount = MaxSupportedCount + 1`) to eliminate off-by-one ambiguity. Validate threshold ≥1. Evaluate every weighted shape once per committed graph, irrespective of the order neighbors were encountered.

Timer rule: transition unarmed → armed when supported count becomes positive. Recommended compatibility policy is one-shot fuse, remaining armed even after unloading, unless gameplay capture establishes otherwise. Store `expiry` and a unique timer token; do not remove a still-physical timed block from the graph before its expiry. Pause uses scaled time. Restart/removal cancels the token. A second weight event must not create another timer.

Fire rule: use an **undirected real-contact relation**, not the upward-support relation, because side contacts may be relevant. Deduplicate unordered fire/fire shape pairs. Queue both removals once. Keep fire behavior a current-project extension unless original WiiWare evidence confirms it.

Removal: mark `PendingRemoval` once, unregister gameplay relations, disable colliders, cancel owned timers/tweens, then invoke Destroy or visual pooling. A fracture effect may outlive the removed gameplay shape, but debris must not remain on gameplay collision layers. Apply all removals selected from one snapshot as a batch. A collapse creates new contacts in subsequent steps; it is not solved by recursively calling stack calculation while Destroy is deferred.

## 8. Display algorithm: no all-shape refresh

Represent presentation with `(shapeHandle, revision, count, threshold, locked, kind, timerState)`. Calculate a mutually exclusive style band from configuration. For the current threshold 3, preserve baseline colors: 0 green; 1 yellow slow pulse; 2 red fast pulse; 3+ breaking. Timer visuals are a separate style resolver. If arbitrary thresholds are introduced, author warning bands explicitly instead of assuming that every threshold uses the old hard-coded values.

Presenter steps:

1. Subscribe to the instance service; immediately read current state so a missed initial event is harmless.
2. Filter by session/shape generation and monotonic graph revision.
3. If count changed, update cached numeric text only. If style changed, stop the previous owned tween, assign color/material variant, and start at most one new pulse.
4. A constant style continues its existing pulse without restart. On removal/disable/pool return, kill that tween and clear label/style state.
5. Use one cached outline adapter for all renderers of the visual shape; a count is per shape, never per collider. Put a label at an authored local anchor or aggregate visual bounds anchor, not the first collider center.

Do not rebuild an outline mesh from collider vertices on each contact. An extruded render mesh already represents the concave silhouette. If a custom contour is required, bake it at authoring time, including holes; a convex hull would incorrectly bridge a notch. An outline fragment shader/pulse can animate on the GPU, but its draw cost remains and should be profiled. Pair color with numeric count/crack indicators for readable warning states.

SOLID presentation boundary: `IWeightView.Apply(WeightVisualState)` has no access to `SpawnManager` or Rigidbody. A fake view can assert “one application for a changed style,” while the actual Unity view owns material and tween lifecycle.

## 9. Executed tests and reproducibility

Executable specification: [weighted_shape_reference_tests.py](weighted_shape_reference_tests.py). Standard-library Python, no installs. Run from project root:

```bash
python "Assets/Scripts/Docs/weighted_shape_reference_tests.py"
```

**Executed 2026-09-23 on Windows, Python 3.14.7: 27 tests passed in 0.454 s.** Test methods include many parameterized assertions; this is not merely 27 single input values.

| Test area | Executed coverage | Result |
|---|---|---|
| Concave geometry | L, T, +, ^, U, ring voids; actual solid intersections | Pass |
| Per-collider AABB counterexample | Chevron limb AABB overlaps probe but convex polygon does not | Pass; demonstrates current broad-phase false positive |
| Convex decomposition | Single box vs two-piece equivalent across 300 random probes | Pass |
| Transforms | 8 shape types × 4 rotations × 3 scales (including mirror) × 3 probes | Pass: 288 invariance checks |
| Independent geometry oracle | 2,000 seeded rotated rectangle/triangle cases: SAT versus segment-intersection/containment | Pass |
| Contacts | Exact boundary, clear gap, degenerate edge rejection | Pass |
| Support policy | Up/side/ceiling, slopes, reversed gravity, hysteresis, zero gravity, separation | Pass |
| Graphs | Chain, bridge, diamond, cycles, disconnected/invalid nodes | Pass |
| Independent graph oracle | 1,000 random directed graphs versus Floyd–Warshall closure | Pass |
| Depth | 1,100-node chain, iterative traversal | Pass; no recursion limit |
| Event model | Duplicate/stale updates, partial child exit, removal, sleeping retention, changed-only publication, 600 clean flushes | Pass |
| Threshold | Break-at-three boolean boundary and exclusive integer bands | Pass; not a test of real DOTween |

Reference benchmark, 100 solves of a chain per size:

| N | Median ms | p95 ms |
|---|---:|---:|
| 14 | 0.0300 | 0.0332 |
| 64 | 0.4839 | 0.8893 |
| 256 | 7.6859 | 13.1034 |

These are Python host CPU timings, not Unity C# performance, zero-allocation measurements, device FPS, or evidence that 256 shapes meet the frame budget. They expose scaling and support starting simple for small boards. Re-running can produce different timings.

The SAT helper tests 2D cross-sections of extruded convex pieces. Production will use PhysX contacts, not this all-pairs SAT loop. The ledger test uses synthetic canonical pair snapshots; it does not validate Unity child callback routing, buffer saturation, contact normal orientation, sleep/wake detection, collision skin, CCD, pooling adapters, rendering or rigidbody force behavior.

## 10. If real mechanical load is required

Do not substitute “sum child mass” for count: a bridge and closed contact loop make it wrong. A quasi-static force policy must solve force and torque balance at contacts under unilateral normal force and friction constraints:

```text
for each rigid body:
  sum(contact forces) + mass * gravity = 0
  sum((contactPoint - centerOfMass) × force) = 0
  normalForce >= 0; |tangentialForce| <= friction * normalForce
```

Such systems can be underdetermined, unstable, dynamically accelerating, or have no static solution. A deterministic optimization/compliance rule is required to choose among valid load splits. PhysX contact impulses can inform a filtered dynamic stress approximation, but aggregate pair impulse is not an exact per-contact force split and varies with timestep/solver iterations. This is a separate feature with a different output unit, test oracle, and CPU budget. It is **not recommended for this migration phase** because the existing and reference-game rule is count-based.

Likewise, volume-weighted center of mass is a separate concern. Summing volume of overlapping child boxes counts overlap twice; use non-overlapping authored decomposition or mesh volume integration offline, not a per-frame heuristic. Do not infer mass from collider count.

## 11. Required Unity tests before integration signoff

Create Edit Mode tests for the C# graph/policy port and Play Mode fixtures in a separate test assembly. Use generated primitive/convex shapes with analytically known contacts, then the actual game prefabs. These gates are **not yet executed**:

1. Each L/T/+/^ shape under 0°, 45°, 90°, 180°; shape supports small box, then reverse the roles. Verify visible gaps produce no contact and a low L ledge counts correctly.
2. Root colliders and nested-child compounds, one/two/four simultaneous contact pairs. Exit one pair; edge remains until last supporting pair exits.
3. Convex single collider versus equivalent compound: count equivalence, while acknowledging possible solver/mass differences.
4. Triangle/wedge slopes, sphere/capsule rounded contacts, edge/point contacts, narrow seam crossing, shallow penetrations and skin distances. Check thresholds against world scale.
5. Stack sleeping for 30 seconds; waking via impact; platform moved/removed; collider disabled; object destroyed; pooled object reused; nested parent destroyed under 6.4+ OnDisable behavior.
6. Same-step multiple callbacks in shuffled order; actual Unity normal orientation; mirrored delivery; buffer saturation. No dropped support or duplicate events.
7. Tall L ledge regression: supported object's maximum Y is below supporter's maximum Y; count remains 1. This is specifically absent from the old height algorithm.
8. Chain/diamond/bridge/cycle fixtures, timed/falling/fire interactions, threshold K−1/K/K+1, empty board, all shapes removed, threshold changed at runtime.
9. Rapid restart, disable/re-enable views, domain reload disabled, pause/unpause, timer expiry simultaneous with failure. Assert one terminal outcome and one removal per shape.
10. 14/64/256-shape stress boards and 1/2/4/8 colliders per shape, including dense contact events. Record physics + domain + views separately; proposed 14-shape domain p95 ≤0.5 ms and zero steady-state managed allocation after warm-up.

For a clean simulation test harness, use an isolated PhysicsScene and fixed stepping, or the project's normal step with deterministic fixture setup. Never simulate the live gameplay PhysicsScene twice. Test outcome tolerances rather than assuming bit-identical PhysX results across platforms or engine upgrades.

## 12. Incremental implementation plan

1. Add registry and stable handles behind existing spawn APIs; cache all child colliders. Verify same active count and prefab lifecycle.
2. Add contact logging adapter in shadow mode; compare AABB candidates with real contacts without changing gameplay. Classify intentional discrepancy cases.
3. Port pure count policy and reference tests to C#. Evaluate new graph in shadow mode; record old/new count differences and explain them.
4. Move rule decisions into a once-per-transaction evaluator; fix pending timer/removal ownership.
5. Switch the count source behind a per-level rollout flag. Keep baseline logs and level captures; rollback switches rule source, not mixed simultaneous writers.
6. Switch presenters to deltas, verify one tween, then retire `SetAllShapeFaces` hot fan-out.
7. Profile, then optimize only measured graph bottlenecks. Retire old AABB adjacency and recursive traversal after all Unity gates pass.

## 13. Sources

- **R1:** [Nintendo Life, WiiWare review, 2010-02-18](https://www.nintendolife.com/reviews/2010/02/art_of_balance): timer/weight limits, three-second above-water finish, original gameplay.
- **R2:** [Unity 6.5 compound colliders](https://docs.unity3d.com/6000.5/Documentation/Manual/compound-colliders-introduction.html).
- **R3:** [Unity 6.5 OnCollisionStay](https://docs.unity3d.com/6000.5/Documentation/ScriptReference/MonoBehaviour.OnCollisionStay.html).
- **R4:** [Unity 6.5 ComputePenetration](https://docs.unity3d.com/6000.5/Documentation/ScriptReference/Physics.ComputePenetration.html): supported collider types, arbitrary poses, overlap-only semantics. Useful for placement validation; insufficient by itself for resting-support classification.
- **R5:** [Upgrade to Unity 6.5](https://docs.unity3d.com/6000.5/Documentation/Manual/UpgradeGuideUnity65.html): EntityId, engine/API changes.
- Related: [FPS/EDD](Frame_Rate_and_Event_Driven_Design_Deep_Dive.md), [master migration plan](Unity6_Upgrade_and_Performance_Modernization_Plan.md), [from-scratch rebuild](Unity65_From_Scratch_WiiWare_Recreation_Plan.md).

