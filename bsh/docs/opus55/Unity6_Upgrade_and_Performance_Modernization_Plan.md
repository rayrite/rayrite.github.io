# Unity 6 Upgrade and Performance Modernization Plan — Balance Stack Hero

## 1. Title and Scope

| Item | Value |
|---|---|
| Title | Balance Stack Hero: Unity 2023.1 → Unity 6.5 Upgrade and Performance/EDD Modernization Plan |
| Current engine | **Unity 2023.1.6f1** (Confirmed: `ProjectSettings/ProjectVersion.txt`) |
| Target engine | **Unity 6000.5.0f1 (Unity 6.5)** |
| Input basis | 27 companion docs + [Scripts_Master_Index.md](Scripts_Master_Index.md) + [dependency atlas](Scripts_Dependency_Map.md) (primary). Official Unity 6.5 Manual, What's New 2023.2→6.5, and Upgrade Guides 2023.2→6.5, read on 2026-09-23. Project metadata (`Packages/manifest.json`, `ProjectSettings/*`, a plugin API scan) for validation |
| Date | 2026-09-23 |
| What this plan **is** | A staged, risk-aware migration and refactor roadmap: version-by-version gates, a feature applicability screen, a risk register, a per-script `Update()`/`FixedUpdate()` triage, event-driven (EDD) and modularization designs, a backlog, and validation and test strategy |
| What it is **not** | Not a code rewrite. No source changes were made. Not a render-pipeline migration (URP is scoped as a follow-on track) |

**Confidence labels:** **Confirmed from companion docs** · **Confirmed from Unity docs** · **Inferred from architecture patterns** · **Unknown from current inputs**.

> ⚠ **Target-version caveat (Confirmed from Unity docs, 2026-09-23):** the Unity 6.5 manual is now banner-marked *"This version of Unity is unsupported."* The version selector lists **6.3 LTS** and **6.6** as *Supported*, **6.7** as *Beta*, and 6.4/6.5 as *Legacy*. The Built-In Render Pipeline is supported "through the full Unity 6.7 LTS lifecycle". This plan keeps **6000.5** as the requested target and designs every phase to be version-agnostic above 6.3. **Recommendation:** gate on **6.3 LTS** as the stabilization point, then decide between 6.5 (as requested; use the **latest 6000.5.x patch** rather than 6000.5.0f1) and 6.6/6.7 LTS (supported). See §5.

---

## 2. Executive Summary

- **Migration posture:** *Moderate difficulty, low code risk, moderate content/platform risk.* The 27 game scripts use a small, conventional API surface. Only four game-code API changes are forced: `FindObjectOfType` (obsolete, 2 sites), `Rigidbody.angularDrag` → `angularDamping` (1), `Rigidbody.velocity` → `linearVelocity` (2), and the legacy Input Manager (legacy, still functional). **Most migration risk sits outside `Assets/Scripts`**: third-party plugins that call APIs which are **compile errors in 6.5** (`Object.GetInstanceID()` in 6 plugin files), platform minimums (Android API 26, iOS 15, 64-bit), and deprecated packages (Advertisement Legacy, legacy Analytics, the VS Code package, the VR module).
- **Dominant risks:**
  1. Plugin compile breaks: ScoreFlash (NarayanaGames), NiceTouch, EasyColliderEditor, Toony Colors Pro, Exploder, HighlightPlus.
  2. **Project-modified Lean Touch.** Updating the vendor package would erase three custom members that gameplay depends on.
  3. Physics behaviour drift for a physics-stacking game: torque changes in `AddForceAtPosition`/`AddExplosionForce` used by Circular Gravity Force, and solver changes.
  4. Built-In Render Pipeline deprecation, with BiRP-dependent shaders (Toony Colors Pro, EPO outline, HighlightPlus).
  5. Existing latent defects (freeze in `SpawnManager.LevelClearShapes`, non-idempotent win/lose), which must be fixed *before* the upgrade so they aren't mistaken for regressions.
- **Dominant opportunities:**
  1. **Set `Application.targetFrameRate = 60`.** No script sets it, so mobile builds are most likely capped at the platform default of 30 fps (Inferred).
  2. **Remove per-frame polling:** 31 debug `GetKey` polls, a coroutine storm while dragging, docked-shape tween churn every 0.5 s, and per-frame `GetComponents` allocations.
  3. **Make the weighted-stack pipeline event-driven and incremental** (it currently does a full O(n²c²) recompute plus unbounded tween creation per settle).
  4. Enable incremental GC.
  5. Adopt the in-Editor Project Auditor (6.4+), Adaptive Performance thermal handling on iOS/Android (6.3+/6.5), and Android LTO (6.5).
- **Big-bang or staged:** **Staged (hybrid).** Stabilize and fix blockers on 2023.1 → step through 2023.2 → 6.0 LTS → 6.3 LTS (checkpoint) → 6.4 → 6.5, with a per-step compile/regression gate → then do the performance and EDD refactors on the target, measured against the 2023.1 baseline.
- **Performance strategy:** Measure first (a Profiler baseline on device). Then remove avoidable per-frame work in the order of hot-path cost: ShapeController ×N → GameManager drag → SpawnManager settle pass → LevelManager HUD strings → empty `Update`s. Keep legitimately tick-based work (physics, rotation while held, CGF) and make it conditional on state.

---

## 3. Evidence Base

**Companion docs reviewed (27 + index + atlas).** All per-script docs in `Assets/Scripts/Docs/` and `Docs/Game/`, the [Scripts_Master_Index.md](Scripts_Master_Index.md), and the [Scripts_Dependency_Map.md](Scripts_Dependency_Map.md) (29 nodes, 63 internal and 64 external edges). **A master index was present** (Confirmed).

**Unity documentation reviewed (Confirmed from Unity docs, fetched 2026-09-23):**
| Page | URL |
|---|---|
| What's New in Unity (hub, version support banner) | https://docs.unity3d.com/6000.5/Documentation/Manual/WhatsNew.html |
| New in Unity 6.5 | https://docs.unity3d.com/6000.5/Documentation/Manual/WhatsNewUnity65.html |
| Upgrade Unity (hub, sequential-upgrade guidance) | https://docs.unity3d.com/6000.5/Documentation/Manual/UpgradeGuides.html |
| Upgrade your Unity project (best practices) | https://docs.unity3d.com/6000.5/Documentation/Manual/upgrade-project.html |
| API Updater | https://docs.unity3d.com/6000.5/Documentation/Manual/APIUpdater.html |
| Upgrade to 2023.2 / 6.0 LTS / 6.1 / 6.2 / 6.3 LTS / 6.4 / 6.5 | `UpgradeGuide20232.html`, `UpgradeGuideUnity6.html`, `UpgradeGuideUnity61.html` … `UpgradeGuideUnity65.html` (same base path) |
| What's New 2023.2, 6.0, 6.1, 6.2, 6.3, 6.4 (keyword-screened) | `WhatsNew20232.html`, `WhatsNewUnity6.html` … `WhatsNewUnity64.html` |
| System requirements 6.5 | https://docs.unity3d.com/6000.5/Documentation/Manual/system-requirements.html |
| Scripting API: `Rigidbody.angularDamping`, `Rigidbody.linearVelocity` (present); `Rigidbody.angularDrag`, `Rigidbody.velocity` (no 6.5 page); `Object.FindObjectOfType` ("Method group is Obsolete") | `/6000.5/Documentation/ScriptReference/…` |
| Legacy Input Manager ("legacy feature and not recommended for new projects") | https://docs.unity3d.com/6000.5/Documentation/Manual/class-InputManager.html |
| Package pages: Advertisement Legacy (`com.unity.ads`), uGUI (core package), In-App Purchasing; **no 6.5 pages** for `com.unity.analytics`, `com.unity.textmeshpro`, `com.unity.ide.vscode` | `/6000.5/Documentation/Manual/com.unity.*.html` |

**Project metadata used for validation (Confirmed):**
- `Packages/manifest.json`: ads 4.4.2, ai.navigation 1.1.4, analytics 3.8.1, collab-proxy 2.0.5, ide.rider 3.0.24, ide.visualstudio 2.0.18, ide.vscode 1.2.5, purchasing 4.9.3, recorder 4.0.1, test-framework 1.3.7, textmeshpro 3.0.6, timeline 1.8.2, ugui 1.0.0, **modules.vr 1.0.0**, modules.xr 1.0.0; scoped registry `com.google` (Play plugins).
- `ProjectSettings`: activeInputHandler **0** (legacy only); `m_CustomRenderPipeline: 0` (**Built-In RP**); color space **Gamma**; AndroidMinSdkVersion **22**; AndroidTargetArchitectures **1 (ARMv7 only)**; iOS target **13.0**; `gcIncremental: 0`; static batching on, dynamic batching off; Physics default solver iterations **30**; Fixed Timestep **0.02**; QualitySettings vSync 0 on low tiers and 1 on higher tiers.
- Plugin API scan (outside `Assets/Scripts`): `GetInstanceID(` in 6 files (NarayanaGames/ScoreFlash ×3, NiceTouch MMStateMachine, EasyColliderEditor, Toony Colors Pro TCP2_PlanarReflection); `InstanceIDToObject` in EasyColliderEditor; `FindObjectOfType` in 19 files; `.velocity` in CGF, MeshExploder, Exploder, NarayanaGames; `AddForceAtPosition`/`AddExplosionForce` in CGF; `SetDensity` in MeshExploder and EasyColliderEditor; `UnityEngine.XR`/`XRSettings` in EPO Outline and HighlightPlus.

**Confidence caveats / missing inputs:**
- There is no on-device Profiler capture, so all performance estimates are relative (Inferred).
- Plugin versions and vendor Unity 6 support were not verified online (Unknown).
- Scene wiring and UnityEvent targets were resolved by method name only.
- No automated tests exist.
- The root-level duplicate copies of these scripts under `Assets/` need to be verified before the upgrade.

---

## 4. Current Architecture Snapshot from Companion Docs

| Aspect | Snapshot | Confidence |
|---|---|---|
| Major subsystems | Core managers (UI/Game/Level/Score), gameplay/physics (Shape/Spawn/Platform/Floor/Dock), data (LevelData/Info/Status, LevelMakerData, World*), services (`Game/`: Sound, AppInfo, Effect, Utilities) | Confirmed |
| Key hubs | LevelManager (in 6 / out 12), SpawnManager (in 5 / out 10, god object), ShapeController (N instances; per-frame), GameManager (in 5 / out 4) | Confirmed |
| Lifecycle roots | Awake/Start of managers; per-frame `Update` in GameManager, LevelManager, SpawnManager, ShapeController (+`LateUpdate`); physics callbacks in Floor/Platform/ShapeController; UI `PlayButtonPressed` | Confirmed |
| Event usage | Only two live C# events, both **static** and never unsubscribed: `ShapeController.collisionEvent`, `FloorColliderController.levelstatusEvent`. No script implements `OnEnable`/`OnDisable`/`OnDestroy` | Confirmed |
| Hot-path scripts | ShapeController (Update + LateUpdate × N), GameManager.Update (drag → coroutine per frame → penetration scan), SpawnManager.Update (31 `GetKey`), LevelManager.Update (per-frame string formatting) | Confirmed |
| Event-time spikes | `SpawnManager.GetStackInformation` per settle/bump: O(n²c²) AABB graph, `ToArray`/`GetComponents` allocations, `SetFaceProperties` creating infinite DOTween loops each pass, re-entrant explosions | Confirmed |
| Coupling | Bidirectional Inspector references between all managers; public mutable fields and lists as de facto APIs; name-based `GameObject.Find`; tag searches | Confirmed |
| Rendering | Built-In RP, Gamma, Toony Colors Pro shaders, EPO outline, HighlightPlus (unused path), particle VFX, MeshExploder fragments | Confirmed (settings) / Inferred (asset usage) |
| Input | Legacy Input Manager (`GetKey`) + **project-modified Lean Touch** (`dragdelta`, `RotateMe`, `SetOffSetValue`) + NiceTouch MMTouch controls bound through UnityEvents | Confirmed |
| UI | uGUI + TMP; canvases toggled with `SetActive`; HUD text written from LevelManager | Confirmed |
| Physics | 3D Rigidbodies; Circular Gravity Force (radial gravity, `FixedUpdate` with Overlap queries + AddForce); solver iterations 30; kinematic/trigger switching for held shapes; `Physics.ComputePenetration` for drop legality | Confirmed |
| Known unknowns | UnityEvent targets; plugin vendor support for Unity 6; on-device frame times; whether the game is published | Unknown |

---

## 5. Upgrade Strategy Decision

**Decision: Hybrid — package/plugin-first stabilization + a conceptual sequential migration with a hard LTS checkpoint.**

1. **Package- and plugin-first on 2023.1:** fix or replace the plugins that will not compile on 6.5 (`GetInstanceID`), vendor-lock Lean Touch (move it to an embedded "Lean Touch (BSH fork)" folder with the three customizations documented), remove dead packages, and fix the latent game defects. Rationale: Unity's guidance is to "upgrade the existing packages and assets … to their latest versions … before you open your project in a newer version" (Confirmed from Unity docs, *Upgrade your Unity project*).
2. **Sequential version stepping.** Unity says: "Follow the instructions in each upgrade guide in release order" and "The recommended best practice is to upgrade your project sequentially" (Confirmed from Unity docs). The stops are 2023.2 → **6.0 LTS** → (6.1, 6.2 as check-only passes) → **6.3 LTS (release-quality checkpoint)** → 6.4 → 6.5. The 6.1 and 6.2 steps are low-impact for this project (§6), so they may be *reviewed* without a full release gate, but each version must still compile cleanly and pass smoke tests.
3. **Refactors after reaching the target**, with one exception: the defect fixes and hygiene items (Phase 2) happen before the upgrade so the regression signal stays clean.

Why not a direct jump: physics and platform behavioural changes accumulate (6.0 torque change, 6.4 artifact dependencies and `OnDisable` behaviour, 6.5 InstanceID removal and Android/iOS minimums). With no automated tests, isolating each step is the only practical way to attribute regressions.

**Version-choice recommendation:** because 6.5 is now outside support (Confirmed from Unity docs banner), treat **6.3 LTS** as the shippable fallback. If the team wants current support, retarget the final hop to **6.6** or the upcoming **6.7 LTS** using the same gates. Phases 6–9 of this plan apply unchanged.

---

## 6. Version-by-Version Migration Matrix

| Step | Key Unity changes to inspect (Confirmed from Unity docs) | Likely affected project areas | Affected scripts / subsystems | Risk | Verify before proceeding | Go / no-go |
|---|---|---|---|---|---|---|
| **2023.1 → 2023.2** | Ambient probe/skybox reflection no longer baked by default; Auto Generate lighting removed; `GraphicsFormat.DepthAuto/ShadowAuto/VideoAuto` obsolete (errors); runtime Texture2D mipmap limits opt-in; UI Toolkit event API changes; Assets/Create menu reorganized | Scene lighting (Game.unity), plugins touching graphics formats (Toony Colors planar reflection) | Rendering; none of the 27 game scripts | Low | Scene looks identical (re-bake / Generate Lighting); plugins compile | Clean compile; lighting matches baseline screenshots; smoke test passes |
| **2023.2 → 6.0 LTS** | `FindObjectOfType/FindObjectsOfType` **obsolete** (use `FindFirstObjectByType`/`FindAnyObjectByType`/`FindObjectsByType`); **Rigidbody torque change** for `AddForceAtPosition`/`AddExplosionForce` with `ForceMode.VelocityChange/Acceleration`; Enlighten Baked GI removed; light-probe energy +6 %; Android `UnityPlayer` class rename, Gradle/AGP/JDK 17 defaults; 7-Zip zstd removed; Build Profiles replace Build Settings; GPU Resident Drawer (SRP only) | Physics feel (CGF radial gravity); shape spawning helpers; Android build; lighting | ShapeController (`FindObjectOfType` ×2, `angularDrag`, `velocity`), PlatformController (`FindObjectOfType`); CGF (plugin); Exploder/NarayanaGames/Lean (Find APIs) | **Medium** | API Updater applied; CGF force mode audited; physics "feel" comparison (stack heights, topple rate); Android build installs | Compiles; physics regression suite within tolerance; Android and iOS builds run |
| **6.0 → 6.1** | Window menu reorganized; `_FORWARD_PLUS` → `_CLUSTER_LIGHT_LOOP` (URP); **PVRTC deprecated**; `Rigidbody.SetDensity` deprecated; Android Gradle 8.11 / AGP 8.7.2 / NDK r27c; Windows default DX12 | Texture compression on iOS; MeshExploder (`SetDensity`) | MeshExploder, EasyColliderEditor (plugins) | Low | No PVRTC textures (switch to ASTC); MeshExploder compiles | Compile + smoke |
| **6.1 → 6.2** | Select shader APIs deprecated; URP `AfterRendering` timing; `SetupRenderPasses` deprecated; UITK `VisualElement.transform` deprecated | BiRP project, so mostly N/A | None | Low | Shader warnings reviewed (Toony Colors, EPO) | Compile + smoke |
| **6.2 → 6.3 LTS** | **Advertisement Legacy → migrate to Ads Mediation (LevelPlay)**; `[SerializeField]` only allowed on fields (compile error otherwise); URP Compatibility Mode removed; Legacy ETC compressor removed; Adaptive Performance becomes a core module; Android **App Category** setting (Android 16 large-screen behaviour), icon deprecations, Gradle 9.1 / AGP 9.0; `Scene.handle` and GI instanceID type changes (precompiled DLLs may need a rebuild) | Ads SDK; Android manifest/Gradle; precompiled DLLs (DOTween.dll) | `com.unity.ads` (unused by Scripts), Google Play plugins, DOTween.dll | **Medium** | DOTween/plugin DLLs load (no `MissingFieldException`); App Category = Game; Ads plan decided | **Release-quality checkpoint:** full regression, device perf run, store build |
| **6.3 → 6.4** | **Changed `OnDisable` behaviour on `Destroy`** (now invoked for all descendants); **narrowed import artifact dependencies** (ScriptedImporter/AssetPostprocessor); Project Auditor moved into the Editor; SRP Core soft physics dependency; `LightShadowCasterMode` renames; iOS runtime library path changes; Input System supports `OnMouseDown/Drag/Up` | Plugins with OnDisable workarounds; editor tooling (EasyColliderEditor); iOS post-build scripts | No game script implements `OnDisable` (Confirmed); Lean Touch uses `OnDisable` for unsubscription (safe) | Low | Any AssetPostprocessor in plugins still runs; iOS Xcode post-processing OK | Compile + smoke + Project Auditor report |
| **6.4 → 6.5** | **InstanceID → EntityId; `Object.GetInstanceID`, `Resources.InstanceIDToObject` produce compile errors**; **removed obsolete GameObject/Component accessors** (`.rigidbody`, `.renderer`, `AddComponent(string)` …); **Built-In RP deprecated** (supported through 6.7 LTS); **dynamic batching deprecated**; **Android min API 26, x86-64 removed, Gradle 9.1/AGP 9.0, edge-to-edge insets (`Screen.fullScreen` no effect)**; **VR module removed**; iOS ReplayKit removed; UnityWebRequest encryption-export note; BCL targeting packs (System.Text.Json …); serialization rules analyzer; Unity Mathematics built in; ModelImporter API removals | Plugin compile; Android/iOS player settings; manifest (`com.unity.modules.vr`) | Plugins: NarayanaGames ScoreFlash, NiceTouch, EasyColliderEditor, Toony Colors Pro (`GetInstanceID`); EPO/HighlightPlus (`UnityEngine.XR`); RdWUtilities (`UnityWebRequest.EscapeURL`, low impact) | **High (compile)** | All plugins compile; VR module removed from manifest; min API 26 / iOS 15 / ARM64; full regression vs baseline | Compiles with 0 errors and 0 new warnings in game code; perf ≥ baseline; store builds accepted |

---

## 7. Unity 6.x Feature and Change Applicability Matrix

| Unity change / feature | Version | Category | Summary | Applicability | Why it matters here | Affected scripts / subsystems | Priority | Action |
|---|---|---|---|---|---|---|---|---|
| API Updater | all | Programming | Auto-rewrites `UnityUpgradable` obsolete APIs; back up first | **Applicable** | Handles `angularDrag`→`angularDamping`, `velocity`→`linearVelocity`, some Find APIs | ShapeController, PlatformController, plugins | P0 | Run at each step with a clean VCS state; review diffs |
| `FindObjectOfType` obsolete → `FindFirstObjectByType`/`FindAnyObjectByType` | 6.0 | Programming | Old API sorted by InstanceID (slow) | **Applicable** | 2 game sites + 19 plugin files | ShapeController.Start, PlatformController.Awake | P1 | Replace; better still, inject references (removes the scene scans entirely) |
| Rigidbody renames (`linearVelocity`, `angularDamping`) | 6.0 (docs present in 6.5; old pages absent) | Physics | Renamed members | **Applicable** | `rb.velocity`, `rb.angularDrag` in ShapeController; plugins (CGF, MeshExploder, Exploder) | ShapeController, plugins | P1 | API Updater; verify the plugins compile |
| Torque computation change (`AddForceAtPosition`/`AddExplosionForce`, Accel/VelocityChange) | 6.0 | Physics | Now scales by the inertia tensor | **Possibly applicable** | CGF calls `AddForceAtPosition`; the effect depends on its configured `_forceMode` | CGF (all shapes' gravity) | P0 (gameplay feel) | Inspect the CGF force mode; if Acceleration/VelocityChange, compare topple behaviour; apply Unity's documented equivalence (×mass, Force/Impulse) if needed |
| Changed `OnDisable` on `Destroy` (whole hierarchy) | 6.4 | Programming | OnDisable is now called on all descendants | **Not currently indicated** | No game script implements OnDisable; Lean uses it to unsubscribe (becomes more correct) | — | P3 | Verify plugins (NiceTouch, Exploder) for duplicate-call workarounds |
| `[SerializeReference]` ancestor `[Serializable]` validation | 6.4 | Serialization | Warns on missing `[Serializable]` | **Not currently indicated** | No `SerializeReference` in the project scan | — | P3 | None |
| `[SerializeField]` allowed on fields only | 6.3 | Serialization | Compile error on misuse | **Possibly applicable** | Game code uses it correctly on fields (AnimatedButton); plugins unverified | Plugins | P2 | Compile check |
| Serialization rules analyzer (Roslyn) | 6.5 | Serialization | Compile-time serialization diagnostics | **Applicable** | Many `[Serializable]` MonoBehaviours (redundant attribute), public mutable fields | All managers | P2 | Triage warnings; remove redundant `[System.Serializable]` on MonoBehaviours |
| InstanceID → EntityId; `GetInstanceID` errors | 6.3 (types) / 6.5 (errors) | Programming | 64-bit ids | **Applicable (blocker)** | 6 plugin files call `GetInstanceID`; EasyColliderEditor uses `InstanceIDToObject` | ScoreFlash, NiceTouch, EasyColliderEditor, Toony Colors Pro | **P0** | Update the plugins from their vendors, or patch to `GetEntityId()` / `EntityIdToObject`; remove unused plugins (ScoreFlash, NiceTouch demo code) |
| Removed obsolete GameObject/Component accessors | 6.5 | Programming | `.rigidbody`, `.renderer` … removed | **Possibly applicable** | Pattern hits in HighlightPlus, EPO, CGF, Exploder need review (many are fields named `renderer`/`collider`, i.e. false positives) | Plugins | P1 | Compile on 6.5; fix residual errors |
| Legacy Input Manager (legacy) / Input System package | 6.x (6.4: Input System supports OnMouse* events) | Input | Legacy is not recommended for new projects | **Applicable** | `activeInputHandler: 0`; `GetKey` polling in GameManager (4) and SpawnManager (31) | GameManager, SpawnManager; Lean Touch (supports both) | P2 | Set Active Input Handling = **Both** during migration; move debug keys to Input System actions (editor/dev only); keep Lean for touch |
| Built-In Render Pipeline deprecation | 6.5 | Graphics | Deprecated; supported through 6.7 LTS | **Applicable (strategic)** | Project is BiRP + Toony Colors + EPO + HighlightPlus | All rendering | P2 (plan), P4 (execute) | **Not recommended for this migration phase.** Schedule a URP track after the 6.x upgrade (the Render Pipeline Converter and batch converter improved in 6.4/6.5) |
| Dynamic batching deprecation | 6.5 | Graphics | Will be removed | **Not currently indicated** | Already disabled in ProjectSettings (Confirmed) | — | P3 | None |
| GPU Resident Drawer / on-tile post-processing / Tile-Only Mode | 6.0 / 6.5 | Graphics | SRP-only optimizations | **Not recommended for this migration phase** | Requires URP | — | P4 | Reconsider in the URP track (on-tile post-processing is valuable on mobile) |
| Render Graph / URP Compatibility Mode removal | 6.0–6.4 | Graphics | URP-only | **Not currently indicated** | BiRP | — | — | — |
| Project Auditor in Editor + obsolete-API report | 6.4 / 6.5 | Optimization | Static analysis; obsolete API between versions | **Applicable** | Finds per-frame allocations, obsolete APIs, settings issues | Whole project | P1 | Run at the 6.4 step and on the target; archive reports as artifacts. On ≤6.3, use the Project Auditor package |
| Rendering statistics improvements | 6.4 | Optimization | Better draw-call/frame metrics | **Applicable** | Baseline and after comparisons | Rendering | P2 | Use in Phase 9 |
| Profiler "Highlights" module / Ask Assistant | 6.3 / 6.5 | Optimization | Faster hotspot identification | **Possibly applicable** | Useful for the triage | — | P3 | Optional |
| Adaptive Performance as a core module; Apple provider; iOS thermal FPS reduction | 6.3 / 6.5 | Optimization / Platforms | Thermal-aware scaling | **Applicable** | A mobile stacking game with long sessions | Quality settings, frame-rate policy | P2 | Enable after the 60 FPS work; set thermal FPS fallbacks (for example Serious → 45, Critical → 30) |
| mimalloc allocator | 6.5 | Optimization | Multithreaded native allocator | **Possibly applicable** | Low managed-thread contention in this game | — | P4 | Evaluate only if the Profiler shows native allocation contention |
| Android: min API 26; x86-64 removed; Gradle 9.1 / AGP 9.0; edge-to-edge insets; LTO | 6.3–6.5 | Platforms | Mandatory and optional changes | **Applicable (blocker for min API)** | Min SDK 22 (Confirmed); ARMv7 only | Player settings; Google Play plugins (scoped registry) | **P0** | Set min API 26, target the current Play-required API, **ARM64 + IL2CPP** (Play 64-bit requirement, Inferred), App Category = Game, review insets (no `Screen.fullScreen` in Scripts, Confirmed), enable LTO for release |
| iOS: min iOS 15; ReplayKit removed; Swift project type (experimental) | 6.5 | Platforms | Requirements | **Applicable (min iOS)** | iOS target 13.0 (Confirmed) | Player settings | **P0** | Set the iOS target to 15.0; don't adopt the Swift project type yet |
| VR module removed | 6.5 | XR | `com.unity.modules.vr` gone | **Applicable** | Listed in manifest.json (Confirmed) | Package manifest; EPO/HighlightPlus XR code paths | **P0** | Remove the module before opening in 6.5; confirm the EPO/HighlightPlus XR references resolve through the XR module |
| Advertisement Legacy → Ads Mediation (LevelPlay) | 6.3 / Jan 2026 | Packages | Direct Unity Ads SDK integration no longer supported for monetization | **Applicable (if ads ship)** | `com.unity.ads` 4.4.2 in manifest; no Scripts usage; `GameManager.adtimer`/`launchadvert` stubs | Monetization | P1 | Remove the package if ads aren't planned; otherwise integrate LevelPlay |
| Legacy Analytics package | — (no 6.5 package page) | Packages | `com.unity.analytics` absent from the 6.5 docs | **Applicable** | Manifest 3.8.1; `RdWAnalytics` and `UAEventCompileGameStats` are stubs | Analytics | P1 | Remove it; if telemetry is wanted, use UGS Analytics through domain events (§11) |
| TextMeshPro inside uGUI (core package) | 2023.2+ | UI | `com.unity.textmeshpro` has no 6.5 page; uGUI is a core package fixed to the Editor version | **Applicable** | TMP 3.0.6 in manifest; TMP_Text in LevelManager, UIManager, DamagePopup, SpawnManager | UI | P1 | Let Package Manager migrate; re-import TMP Essentials if prompted; verify fonts and materials |
| VS Code package | — | Tooling | `com.unity.ide.vscode` has no 6.5 page | **Applicable** | Listed in the manifest | Tooling | P2 | Remove; use Visual Studio / Rider packages |
| Build Profiles | 6.0+ | Workflow | Per-platform build configurations | **Applicable** | Separate Dev (debug keys, logs) and Release profiles | SpawnManager debug keys, Debug.Log | P2 | Create Android-Dev, Android-Release, iOS-Dev, iOS-Release profiles; strip logs in release |
| Unity Mathematics built in; Burst multithreading on Web; DirectStorage | 6.4 / 6.5 | Programming / Platforms | — | **Not currently indicated** | Tiny data sets; mobile targets | — | — | — |
| UI Toolkit Panel Renderer / ATG text | 6.5 | UI | New UITK runtime path | **Not recommended for this migration phase** | uGUI-based UI; no benefit worth the rewrite now | UIManager | P4 | Revisit when the UI is redesigned |
| New code-lifecycle attributes / AutoStaticsCleanup | 6.5 | Programming | Static-state reset with domain reload disabled | **Applicable** | Static events and singletons (`SoundManager.Instance`, `AppInfo.Instance`, 2 static events) break with *Enter Play Mode Options* (no domain reload) | ShapeController, FloorColliderController, singletons | P2 | Replace the static events (Phase 8); where statics remain, add cleanup attributes to allow faster Play Mode entry |
| Asset import dependency narrowing | 6.4 | Asset pipeline | Fewer reimports | **Possibly applicable** | Editor tooling plugins (EasyColliderEditor) | Editor tools | P3 | Verify the tools still update |
| UnityWebRequest encryption-export note | 6.5 | Platforms | NSURLSession → Mbed TLS | **Possibly applicable** | `RdWUtilities.EscapeURL` uses UnityWebRequest (static helper only; no network I/O) | RdWUtilities | P3 | Replace with `System.Uri.EscapeDataString` to avoid linking the concern |
| Physics solver / Unity Physics (DOTS) Direct Solver | 6.5 | Physics | Package-level (Entities) | **Not recommended for this migration phase** | Project uses PhysX GameObjects | — | — | Re-tune PhysX solver iterations instead (§9) |

---

## 8. Migration Risk Register

| ID | Risk | Evidence | Affected | Severity | Likelihood | Detection | Mitigation | Rollback |
|---|---|---|---|---|---|---|---|---|
| R1 | Plugins fail to compile on 6.5 (`GetInstanceID`, `InstanceIDToObject`) | Confirmed scan: 6 files; Unity 6.5 guide says these produce errors | ScoreFlash, NiceTouch, EasyColliderEditor, Toony Colors Pro | High | Very likely | Compile on 6.5 | Update the vendor versions on 2023.1/6.0 first; delete unused plugins (ScoreFlash, NiceTouch demo code if its UnityEvents are removed); patch to EntityId | Stay on 6.3 LTS |
| R2 | Lean Touch customizations lost on update | Confirmed: `dragdelta`, `RotateMe`, `SetOffSetValue` are custom members used by GameManager and SpawnManager | Input/rotation/drop | High | Likely if Lean is updated | Compile errors in GameManager/SpawnManager | Move the custom members into project-owned extension components (for example `BshDragDelta : MonoBehaviour` subscribing to `LeanTouch.OnGesture`); treat Lean as vendor-pristine | VCS revert |
| R3 | Physics feel changes (stack stability, topple timing) | Unity 6.0 torque change; CGF uses `AddForceAtPosition`; solver iterations 30; gameplay is physics-driven | Core gameplay | High | Possible | Deterministic replay comparison (§16) | Audit the CGF force mode; lock physics settings; A/B test on device | Adjust force scaling per Unity guidance |
| R4 | Android build fails or is rejected | Min SDK 22 < 26; ARMv7 only; Gradle 9.1/AGP 9.0; Google Play plugins | Android release | High | Very likely | Build/Play Console | Set API 26, ARM64 + IL2CPP, App Category Game; update Google Play plugins (scoped registry `com.google`) | 6.3 LTS with the previous AGP |
| R5 | iOS build fails | Target 13.0 < 15 | iOS release | Medium | Certain | Xcode build | Set 15.0; update the EasyMobile/Google plugins | — |
| R6 | Latent freeze mistaken for an upgrade regression | Confirmed: `SpawnManager.LevelClearShapes` busy-waits forever | Retry/Next flows | High | Certain if wired | Hang on Retry | Fix in Phase 2 on 2023.1 | — |
| R7 | Double win/lose outcomes | Confirmed: LevelLost has no re-entry guard | Coins, stats | Medium | Possible | Tests §17 | Phase 2 state guard | — |
| R8 | BiRP shaders (Toony Colors, EPO, HighlightPlus) behave differently or trigger deprecation warnings | 6.5 BiRP deprecation | Visuals | Medium | Possible | Screenshot diff | Keep BiRP through 6.7 LTS; plan a URP track | — |
| R9 | Precompiled DLL field mismatches (`MissingFieldException`) | 6.3 type changes; DOTween.dll | Tweens (everywhere) | Medium | Low–Medium | Runtime exceptions | Update DOTween to its latest Unity 6 release | — |
| R10 | TMP migration breaks fonts/materials | TMP merged into uGUI | HUD | Medium | Possible | Visual check | Re-import TMP Essentials; verify font assets | — |
| R11 | Static events and singletons break with Enter Play Mode Options | 2 static events, 3 singletons, no OnDisable | Editor iteration | Low (editor) | Likely if enabled | Duplicate handler logs | Phase 8 event channels / cleanup attributes | Keep domain reload on |
| R12 | Performance refactor changes gameplay timing | Polling at 0.1 s drives "played" and "rest" timing | Scoring, coins, rules | High | Likely without tests | Replay tests | Ship behind a feature flag; compare the event traces | Flag off |
| R13 | Root-level duplicate script copies cause duplicate-type compile errors | Identical copies under `Assets/` and `Assets/Scripts/` (Confirmed identical content); owner states the project compiles | Whole assembly | High | Unknown | Compile | Verify they are excluded (for example a folder with `~` or outside Assets) or delete them before the upgrade | VCS |
| R14 | Monetization/analytics SDK drift | `com.unity.ads` legacy; `com.unity.analytics` absent | Revenue/telemetry | Medium | Certain if used | Package Manager errors | Remove, or migrate to LevelPlay / UGS | — |
| R15 | Frame-rate policy change exposes thermal throttling | Move from a 30 to a 60 fps target | Device heat/battery | Medium | Likely | Long-session test | Adaptive Performance thermal fallbacks; iOS thermal FPS settings (6.5) | Cap at 30 on low tiers |

---

## 9. Performance and Architecture Hotspot Audit

| Category | Finding (from companion docs) | Script(s) | Confidence |
|---|---|---|---|
| **Frame-rate cap** | No `Application.targetFrameRate` in game code. The only setter is NiceTouch's `MMControlsTestInputManager.Start` (sets 300), and **that component is not attached** to Game.unity or any prefab (GUID scan, Confirmed). On iOS/Android, Unity then renders at the platform default of 30 fps (Unity convention, Inferred). vSync is on for higher quality tiers (mobile ignores vSyncCount). Note: Game.unity still contains UnityEvent bindings named after that class's methods (`LeftJoystickMovement`, `YPressedFirstTime`, …), so they are probably **dangling listeners** (Inferred) | project-wide | Confirmed (absence) / Inferred (effect) |
| Frequent per-frame work | ShapeController `Update` + `LateUpdate` × N (N ≈ 9–14 shapes): Lean selection polling, flag state machine, bounds sampling | ShapeController | Confirmed |
| | Per-frame `SetColliderTriggerStatus(false)` → `GetComponents<Collider>()` **allocation per docked shape per frame** | ShapeController.LateUpdate | Confirmed |
| | Docked shapes re-run `Release` every ~0.5 s: 3 DOTweens + coroutine + `WaitForSeconds`/`WaitForEndOfFrame` allocations | ShapeController.Release | Confirmed |
| | 31 `Input.GetKey` polls + held-key `Debug.Log` every frame (debug tooling in release) | SpawnManager.Update | Confirmed |
| | 4 `GetKey` + drag logic + `GetComponent<LeanTwistRotateAxis>` per frame; `StopAndRotate` accumulates without a held shape | GameManager.Update | Confirmed |
| | `TimeSpan` + `string.Format` every frame for the clock; `ToString("N0")` every countdown frame | LevelManager.Update | Confirmed |
| | 9 empty `Update`/`LateUpdate` methods (CameraController, DockCollider, DurationScale, FloorCollider, Loader, PlatformController ×platforms, RdWAnalytics, ScoreEffect, ScoreManager, UIManager, SpawnManager.LateUpdate) | various | Confirmed |
| | Lean `LeanTwistRotateAxis.Update` / `LeanDragTranslate.Update` on every shape (plugin) | shape prefabs | Inferred (components are on the prefabs; GameManager GetComponents them) |
| Physics-step work | CGF `FixedUpdate`: Overlap query + AddForce per body, 50 Hz; solver iterations 30 (5× the Unity default of 6) raise solver cost for every contact | CGF plugin, DynamicsManager | Confirmed |
| Event-time spikes | Per settle/bump: O(n²c²) AABB touching graph, `ToArray` ×5+, `GetComponents` per pair, O(n) `List.Contains`, string concatenation; **nested** passes on explosions | SpawnManager.GetStackInformation | Confirmed |
| | `SetFaceProperties` starts **new infinite DOTween loops** every pass on loaded weighted/timer shapes, so the tween count grows without bound | ShapeController / SpawnManager.SetAllShapeFaces / LevelManager.CheckPlayThreshold | Confirmed |
| | Coroutine storm: one `ProcessCtrlGesture` per drag frame, each running a full `ComputePenetration` scan | GameManager → SpawnManager | Confirmed |
| Heavy branching / fan-out | LevelManager outcome paths call into 5 managers; `UpdateLevelStatus(int,int)` runs on every shape | LevelManager | Confirmed |
| Repeated lookups | `FindObjectOfType` ×2 per shape spawn, `GameObject.Find` per spawned shape/platform, `FindGameObjectsWithTag` per unlock check | ShapeController, PlatformController, SpawnManager, LevelManager | Confirmed |
| GC churn | `new WaitForSeconds` in polling loops, `ToArray`, `GetComponents`, strings, `Debug.Log` (ScoreManager logs a long concatenated string per stack update); **incremental GC off** | many | Confirmed |
| Over-coupling | Bidirectional manager references; public lists mutated across classes | all hubs | Confirmed |
| Orchestrator bottlenecks | SpawnManager (6 responsibilities), LevelManager (5) | — | Confirmed |
| Timing/order fragility | UIManager.Awake reads GameManager state; static events never unsubscribed; polling latency defines "played" | UIManager, ShapeController, LevelManager | Confirmed |
| Risky event wiring | `collisionEvent` has no payload and triggers global recomputes; its subscriber existence gates replay logic | ShapeController, SpawnManager | Confirmed |
| **Safe to refactor first** | Empty Update removal; frame-rate policy; LevelManager clock text; SpawnManager debug keys (dev-only); GameManager drag cooldown; cached collider arrays; tween kill/reuse in `SetFaceProperties` | — | Inferred (low coupling) |

---

## 10. `Update()` / `FixedUpdate()` Triage Matrix

Buckets: **Keep** (must stay tick-based) · **Throttle** · **Replace** (event/callback) · **Timer/coroutine** · **Physics callback** · **Input callback** · **State transition** · **Unknown**.

| Script | Method | Current responsibility | Why it's there now | Keep / Throttle / Replace | Recommended mechanism | Benefit | Risk | Priority |
|---|---|---|---|---|---|---|---|---|
| ShapeController | `Update` (selection mirror) | Copy `lts.IsSelected` into `isselected`/`ismoving` every frame | Lean exposes a property; polling was easiest | **Replace** (input callback) | Subscribe to LeanSelectable select/deselect events (Lean's `OnSelected`/`OnDeselected`, verify the names for the installed version) → raise `ShapeSelected`/`ShapeReleased` | Removes N polls per frame; clean transitions | Low | P1 |
| ShapeController | `Update` (height sample) | `shapeheight = col.bounds.max.y` each frame while resting/touching | The stack pass needs the current top | **Replace** (state transition) | Compute the top from **all** colliders once on `ShapeSettled` and on each `StackChanged` pass | Removes N_resting per-frame reads; fixes the first-collider bug | Low | P1 |
| ShapeController | `Update` (txtpop follow) | Move the floating text | Feature stub | **Replace** | Parent the popup to the shape, or delete it (dormant) | Minor | None | P3 |
| ShapeController | `LateUpdate` (dock line test, curshape) | Docked/playfield classification each frame while selected | Needs the drag position | **Keep while held, else off** (state transition) | Run only in the *Held* state (enable a small `HeldShapeTracker` component on `ShapeSelected`, disable on release); raise `ShapeCrossedDockLine(inPlayfield)` only on change | Zero cost for docked and resting shapes | Medium | P1 |
| ShapeController | `LateUpdate` (physics mode switching) | Kinematic/trigger toggles, `GetComponents` each frame | Recomputed from flags every frame | **Replace** (state transition) | Set once per transition, with a cached `Collider[]` | Removes per-frame allocations | Low | **P0** |
| ShapeController | `LateUpdate` → `Release` re-arm | Re-tween docked shapes to the dock every 0.5 s | `isreleasing` reset loop | **Replace** (input callback) | Run the return tween only on `ShapeReleased` when not committed | Removes 3 tweens / 0.5 s / docked shape | Low | **P0** |
| ShapeController | `LateUpdate` (scale while moving) | `localScale = origScale` every frame | Crude state enforcement | **Replace** (state transition) | Set on the Held entry (tween) | Minor | Low | P2 |
| ShapeController | `CheckPlayedStatus`/`CheckReplayStatus` (0.1 s polling) | Wait for touch and rest | Simple settle detection | **Throttle + centralize** (physics) | `ShapeLanded` from `OnCollisionEnter` (already event-shaped); settle detection by a single `SettleMonitor` checking only *active* bodies in `FixedUpdate` (velocity + angularVelocity thresholds with a small hold time) or `Rigidbody.IsSleeping()`; optionally `Physics.ContactEvent` batching | Removes per-shape coroutines and allocations; deterministic timing | **Medium** (timing changes scoring) | P1 |
| GameManager | `Update` (playtime/adtimer) | Accumulate dt | Session stats | **Replace** (timestamp) | Store `Time.realtimeSinceStartup` at start and compute on demand | Trivial CPU; simpler | None | P3 |
| GameManager | `Update` (arrow keys) | Rotate / tune speed | Desktop debug | **Replace** (input callback) | Input System actions: `performed` for tuning; rotation as a held action (keep per-frame while held) | Removes polling; frame-rate-independent tuning | Low | P2 |
| GameManager | `Update` (drag detection → coroutine per frame) | Pause auto-rotation while dragging; overlap check | Polls the Lean `dragdelta` field | **Replace** (input callback + timer) | Subscribe to `LeanTouch.OnGesture`/`OnFingerUp` (or `LeanDragTranslate`'s movement); on drag start and each move, restart **one** cooldown timer (`rotationpause`); run the drop-legality check on a *dirty flag* throttled to ≤ 10 Hz or at physics trigger changes | Removes up to 60 coroutines/s and 60 penetration scans/s | Medium | **P0** |
| GameManager | `StopAndRotate` (per frame) | Accumulate degrees and snap 45° | Auto-rotate while the finger is still | **Keep, gated** (must be frame-based while active) | Enable only in the Held state and not dragging; accumulate only while enabled; cache `LeanTwistRotateAxis` | Removes the idle accumulation bug and GetComponent | Low | P1 |
| SpawnManager | `Update` (31 debug keys) | Level Maker/debug shortcuts | Developer tooling | **Replace + strip** | Input System actions in a `LevelMakerDebugInput` component compiled only under `UNITY_EDITOR \|\| DEVELOPMENT_BUILD`; `GetKeyDown` semantics | Removes 31 polls/frame in release; no log spam | Low | **P0** |
| SpawnManager | `LateUpdate` (empty) | — | Leftover | **Delete** | — | Dispatch cost | None | P0 |
| LevelManager | `Update` (level clock) | Count up; format m:ss every frame | Simple timer | **Throttle** (timer) | Keep the float accumulation (or a timestamp), update the label **only when the displayed second changes**, and use `TMP_Text.SetText("{0}:{1:00}", m, s)` (non-allocating) | Removes the per-frame GC string | Low | **P0** |
| LevelManager | `Update` (countdown) | Decrement, display, check expiry/fall | Countdown logic | **Replace** (timer + event) | `CountdownTimer` service raising `CountdownTick(sec)` and `CountdownExpired`; the fall is already event-driven (`ShapeFell`) → `LevelOutcomeService` decides once | Clear ownership; fixes win/lose in the same frame | Medium | P1 |
| CameraController, DockColliderController, DurationScale, FloorColliderController, Loader, PlatformController, RdWAnalytics, ScoreEffect, ScoreManager, UIManager | `Update` (empty) | none | Template leftovers | **Delete** | — | Per-object dispatch (platforms × count) | None | **P0** |
| CameraController | `Shake` coroutine | Per-frame jitter while shaking | Visual effect | **Keep** (frame-based) | Keep; stop the previous shake; use unscaled time | — | None | P3 |
| DurationScale / ScoreEffect | coroutine ticker | Per-frame text | Visual effect | **Keep or delete** | Prefer `DOTween.To` with `SetText` (or delete these orphans) | Minor | None | P3 |
| SoundManager | `CRPlaySound` waits | Concurrency counter | Template | **Replace** (timestamp) | Store end times; no coroutine per play | GC | Low | P3 |
| CGF (plugin) | `FixedUpdate` (Overlap + AddForce) | Radial gravity per body | Physics | **Keep** (physics tick) | Confirm `_memoryProperties` uses the NonAlloc path; restrict the layer mask to shapes; consider disabling CGF effect on resting/frozen bodies | — | Low | P2 |
| Lean LeanTwistRotateAxis / LeanDragTranslate (plugin) | `Update` per shape | Gesture handling | Vendor | **Keep, gated** | Disable these components on docked (not selectable) and resting shapes; enable on select | N×2 fewer Updates | Low | P1 |
| PhysX simulation | FixedUpdate 50 Hz, 30 solver iterations | Stack stability | Designer tuning | **Throttle (tune)** | Profile at 30/15/10 iterations with the regression replays; consider per-body `solverIterations` on shapes only | Physics step time | **High** (stability) | P2 |

---

## 11. Event-Driven Refactor Opportunities

**Proposed event backbone (Inferred design).** A lightweight, allocation-free **typed event bus**, or ScriptableObject **event channels** (designer-visible and scene-decoupled). The recommendation is SO channels for cross-system game events and plain C# events inside a subsystem. Every listener subscribes in `OnEnable` and unsubscribes in `OnDisable` (currently **no script has OnEnable/OnDisable**, Confirmed). Payloads are readonly structs.

**Event catalog**

| Event | Payload | Emitter | Listeners |
|---|---|---|---|
| `LevelLoaded` | `LevelDefinition` | LevelLoader | Spawner, HUD, Analytics |
| `LevelStarted` | level id, rules | LevelFlow | Score, HUD, Timer, Audio |
| `ShapeSpawned` | ShapeId | Spawner | Registry |
| `ShapeSelected` / `ShapeReleased` | ShapeId, position | Shape input (Lean callbacks) | RotationController, DropValidator, Audio |
| `ShapeCrossedDockLine` | ShapeId, inPlayfield | HeldShapeTracker | DropValidator, ShapeView (scale), RotationController |
| `DropPermissionChanged` | ShapeId, bool | DropValidator | Shape (commit vs return), ShapeView (red tint) |
| `ShapeDropped` | ShapeId, dropHeight | Shape state machine | Coins, Audio |
| `ShapeLanded` | ShapeId, other (shape/platform) | physics callbacks | PlayedRegistry, LevelRules |
| `ShapeSettled` | ShapeId | SettleMonitor | StackGraphService |
| `StackChanged` | `StackSnapshot` (height, weights, tallies) | StackGraphService | ShapeRules, Score, HUD |
| `WeightChanged` | ShapeId, old, new | StackGraphService | ShapeView (outline), Audio |
| `ShapeDestroyed` | ShapeId, reason (Fell/Fire/Timer/Overweight) | Rules / Floor | Registry, Score, VFX, Audio, LevelRules |
| `AllShapesPlayed` | — | PlayedRegistry | LevelRules |
| `CountdownStarted` / `CountdownTick` / `CountdownExpired` | seconds | CountdownTimer | HUD, LevelOutcome |
| `LevelWon` / `LevelLost` | `LevelResult` / `LossReason` | LevelOutcomeService (idempotent) | Score persistence, UI popups, Analytics, Audio, VFX |
| `CoinsChanged`, `ScoreComputed` | ints / breakdown | Economy / Score | HUD |

**Strong candidates**

**E1. Drop legality (GameManager + SpawnManager.CalculateCurShapePenetration).**
- **Current:** each drag frame starts a coroutine that runs a full `ComputePenetration` over all colliders. `canplayshape` is a global boolean polled by every shape.
- **Current trigger path:** `GameManager.Update` → `StartCoroutine(ProcessCtrlGesture)` → `CalculateCurShapePenetration`; also each 45° snap.
- **Proposed:** a `DropValidator` owns the held shape and marks itself **dirty** on `ShapeCrossedDockLine`, on the snap `Rotated`, and on drag movement (from the Lean gesture callback). It evaluates at most once per `FixedUpdate` (or ≤ 10 Hz) using **cached collider arrays** and only candidate colliders from a `Physics.OverlapBoxNonAlloc` broad-phase around the held shape's bounds. It raises `DropPermissionChanged` only when the result flips.
  - Optional hybrid: the ghost's colliders are already kinematic triggers, so `OnTriggerEnter`/`OnTriggerExit` counters give an event-driven "overlapping" signal, confirmed by one `ComputePenetration` at the moment of release.
- **Emitter:** DropValidator. **Listeners:** the held shape (release decision) and ShapeView (visual "blocked" feedback, a new UX win).
- **Payload:** `(ShapeId, bool canDrop)`.
- **Ordering/lifecycle:** the validator must evaluate *before* the release is processed. On `ShapeReleased`, force a synchronous final evaluation. Unsubscribe when the shape is destroyed.
- **Benefit:** eliminates up to 60 coroutine allocations and scans per second while dragging (**CPU and GC**). Clarifies ownership (no global flag).
- **Risk:** Medium (feel of the blocked drop). **Phase:** 7.

**E2. Stack analysis → incremental `StackGraphService` (SpawnManager + ShapeController).**
- **Current:** every settle or bump raises a static payload-less `collisionEvent`, which triggers a full recompute (AABB O(n²c²)), a face refresh (tween leak), rules, and a score relay. Explosions re-enter.
- **Proposed:**
  - `ShapeSettled(ShapeId)` → the service marks the graph dirty and **coalesces** all requests in the frame into one pass (`LateUpdate` of the service, or end of `FixedUpdate`).
  - The touching graph is built from **physics contacts** (maintained incrementally from `OnCollisionEnter`/`OnCollisionExit` per shape, or the batched `Physics.ContactEvent`) instead of AABBs.
  - Load (weight) is computed by a support-direction traversal (contact normal · up > threshold), not by "taller top".
  - Emits `StackChanged(snapshot)` plus `WeightChanged` for shapes whose weight changed.
- **Listeners:** ShapeRulesEngine (evaluates on the snapshot and **queues** destructions for after the pass, so there is no re-entrancy), ShapeView (outline, **only on change**, killing and reusing its tween handle), and Score/HUD.
- **Ordering:** rules run after the graph is built; destruction is applied at the end of the frame, then one new pass is requested.
- **Benefit:** a large reduction in settle-time spikes and GC; fixes the tween leak, duplicate explosions and order dependence; weights become physically meaningful (also required for the concave L/T/+ shapes).
- **Risk:** **High** (it changes when weighted shapes explode, which is gameplay tuning). Ship behind a flag with A/B replays. **Phase:** 7–8.

**E3. Shape selection and state (ShapeController Update/LateUpdate).**
- **Current:** per-frame polling of the Lean selection plus a 12-flag state machine.
- **Proposed:** an explicit `ShapeState` enum (`Docked → Held → Dropping → Landed → Settled → Frozen/Locked/Destroyed`) driven by the events `ShapeSelected`, `ShapeReleased`, `ShapeCrossedDockLine`, `DropPermissionChanged`, `ShapeLanded` and `ShapeSettled`. Transitions set physics mode, scale, colliders and Lean component enablement once.
- **Listeners:** the shape's own view/physics components.
- **Benefit:** N × (Update + LateUpdate) of work reduces to near zero for docked and settled shapes; kills the docked tween churn and per-frame `GetComponents`.
- **Risk:** Medium (edge cases: re-grab before settle, release at the dock line). **Phase:** 7.

**E4. Level flow and outcome (LevelManager + FloorColliderController).**
- **Current:** booleans are checked in `Update`; `LevelLost` can run twice; win and lose can both happen in one frame; the static event has no payload and is never unsubscribed.
- **Proposed:** `LevelFlow` has an explicit `LevelPhase` and a `LevelOutcomeService` that accepts the *first* terminal event (`CountdownExpired` → Won, `ShapeDestroyed{Fell}` → Lost(type), rule failure → Lost(type)) and ignores the rest. Floor emits `ShapeDestroyed(Fell)` with a payload.
- **Listeners:** UIManager (popups; no more `LevelManager` toggling UIManager GameObjects), Score persistence, Analytics (RdWAnalytics becomes real), Audio (gameplay cues currently unwired), VFX (EffectManager becomes real).
- **Benefit:** correctness (idempotent), decoupling, and features (audio/VFX/analytics) at low cost.
- **Risk:** Low–Medium. **Phase:** 7–8.

**E5. HUD updates (LevelManager.Update text).**
- **Current:** per-frame strings.
- **Proposed:** a `HudPresenter` subscribes to `CountdownTick`, `ClockSecond`, `CoinsChanged` and `LevelStarted`, and writes the text only on change (`SetText`).
- **Benefit:** GC-free HUD. **Risk:** Low. **Phase:** 7.

**E6. Played-shape registry (UpdateSpawnInfo side effects).**
- **Current:** ShapeController mutates SpawnManager's lists and calls 6 methods across 3 managers; fallen shapes remain in `playedshapes`.
- **Proposed:** a `PlayedShapeRegistry` listens to `ShapeLanded` (register once) and `ShapeDestroyed` (remove), and emits `AllShapesPlayed`.
- **Benefit:** consistent counts (fixes the scoring inaccuracies); ShapeController loses its dependency on managers. **Risk:** Low–Medium. **Phase:** 8.

**Before/after (conceptual):**
```text
BEFORE (polling + global recompute)
  every frame × N:  ShapeController.Update/LateUpdate ─► flags ─► GetComponents ─► (0.5 s) Release tweens
  every drag frame: GameManager ─► StartCoroutine ─► ComputePenetration(all) ─► canplayshape (global)
  every settle:     static collisionEvent ─► SpawnManager full O(n²c²) ─► SetFaceProperties (new infinite tweens) ─► rules (re-entrant)

AFTER (events + incremental)
  Lean select/release ─► ShapeState transition (one-time setup) ─► HeldShapeTracker (only while held)
  drag/rotate ─► DropValidator.dirty ─► ≤1 eval per physics step ─► DropPermissionChanged (on flip)
  OnCollisionEnter/Exit ─► contact graph (incremental) ; SettleMonitor ─► ShapeSettled
  StackGraphService (coalesced 1×/frame) ─► StackChanged + WeightChanged(Δ) ─► ShapeView (reuse tween) / RulesEngine (queued destroy)
```

---

## 12. Decoupling and Modularization Opportunities

### Quick wins
| Recommendation | Current problem | Evidence | Change | Benefit | Scripts | Risk | When |
|---|---|---|---|---|---|---|---|
| Remove the empty `Update`/`LateUpdate`/`Start` methods | Per-object dispatch overhead | 9 empty Updates + SpawnManager.LateUpdate (§10) | Delete them | CPU; clarity | 11 scripts | None | **Before** the upgrade |
| Cache component lookups | `GetComponent`/`GetComponents` in hot paths | ShapeController, GameManager, SpawnManager | Cache in Awake; use `TryGetComponent` | GC/CPU | same | Low | Before |
| Replace `FindObjectOfType`/`GameObject.Find` with injected references | Obsolete API; scene scans; name coupling | ShapeController.Start, PlatformController.Awake, SpawnManager spawn points | The spawner passes references on Instantiate; spawn points become serialized arrays | Upgrade-safe; faster spawns | ShapeController, PlatformController, SpawnManager | Low | Before |
| Kill and reuse outline tweens | Unbounded tween creation | ShapeController.SetFaceProperties | Store the tween handle; `Kill()` before restarting; change only on weight change | Fixes the leak | ShapeController | Low | Before |
| Frame-rate policy + incremental GC | 30 fps default; GC spikes | ProjectSettings | `Application.targetFrameRate = 60` in a bootstrap; enable Incremental GC | Doubles the ceiling | Loader (repurposed) | Low (thermal) | Before |
| Strip debug input and logs from release | 31 key polls; `Debug.Log` in hot paths | SpawnManager, ScoreManager, ShapeController | `#if` guards / `[Conditional]` logger; Build Profiles | CPU/GC | same | Low | Before |
| Fix the known defects (freeze, double outcome, `Array.Initialize`, ClearSpawnPoint) | Correctness | LevelManager, SpawnManager, ScoreManager docs | Targeted fixes | Clean regression baseline | same | Low–Medium | **Before** |

### Medium refactors
| Recommendation | Current problem | Change | Benefit | Scripts | Risk | When |
|---|---|---|---|---|---|---|
| Explicit `ShapeState` machine + event-driven selection (E3) | 12-flag polling | Enum states; Lean callbacks; transition-time setup | Per-frame cost ≈ 0 for idle shapes | ShapeController | Medium | After |
| `DropValidator` (E1) | Coroutine storm; global flag | Dirty-flag validator | CPU/GC; UX | GameManager, SpawnManager | Medium | After |
| `LevelPhase` + idempotent `LevelOutcomeService` (E4) | Double outcomes, UI coupling | Explicit phase; events to the UI | Correctness, decoupling | LevelManager, UIManager, FloorCollider | Low–Medium | After (the phase guard itself is a quick fix before) |
| `HudPresenter` (E5) | Per-frame strings | Change-driven UI | GC | LevelManager | Low | After |
| Split GameManager | Mixed level entry, input, stats | `LevelFlow`, `ShapeRotationController`, `SessionStats` | SRP/testability | GameManager | Low | After |
| Lean customizations → project extensions | Vendor fork | `BshGestureAdapter` subscribing to Lean events; offset through Lean API or wrapper | Safe plugin updates | GameManager, SpawnManager | Low | **Before** (R2) |
| Data to ScriptableObjects | Content as code; parallel arrays | `LevelDefinition`, `WorldDefinition`, `ShapeCatalog`, `PhysicsTuning`, `ScoringRules` SOs | Designer iteration; fixes Level Maker tallies | LevelData, LevelInfo, LevelMakerData, WorldData | Low | After |

### Deep refactors
| Recommendation | Current problem | Change | Benefit | Scripts | Risk | When |
|---|---|---|---|---|---|---|
| Decompose SpawnManager | God object (spawner, analyser, rules, validator, registry, tooling) | `LevelSpawner`, `StackGraphService`, `ShapeRulesEngine` (`IShapeRule` strategies), `DropValidator`, `PlayedShapeRegistry`, editor-only `LevelMakerTool` | SOLID, testable pure C# cores, event-time CPU | SpawnManager (+ ShapeController, LevelManager) | **High** | After, behind flags |
| Contact-based support graph for weights (E2) | Non-physical AABB/top-Y weights; concave shapes | Contact-normal support graph, incremental | Correct weights; perf | SpawnManager, ShapeController | **High** (tuning) | After |
| Composition root / execution order | Inspector cross-wiring; Awake order | `Loader` becomes the bootstrap (`[DefaultExecutionOrder(-1000)]`) that wires services and raises `GameReady` | Deterministic init | all managers | Medium | After |
| URP migration | BiRP deprecated | Render Pipeline Converter; replace Toony Colors / EPO / HighlightPlus shaders | Future-proofing; on-tile post-processing | Rendering | High | **Later** (separate track before the 6.7 LTS end of life) |
| *Do later / not worth it now* | UI Toolkit rewrite, DOTS/Unity Physics, mimalloc, Swift iOS project type | — | — | — | — | Not now |

---

## 13. Phased Implementation Plan

### Phase 0 — Safety, baseline, and observability
- **Objective:** make every later step measurable and reversible.
- **Key tasks:**
  - Put the project under **Git + LFS** (no VCS metadata was found in the project folder; Unknown whether it exists elsewhere) and use one branch per phase and per version step. Tag `baseline-2023.1`. Close the Editor and back up before each API Updater run (Confirmed from Unity docs).
  - Package inventory (the manifest list in §3) and plugin inventory with versions and vendor Unity 6 support status (Assets/Lean, Plugins/Demigiant, Easy performant outline, Mesh Explosion, Exploder, ResurgamStudios CGF, HighlightPlus, NarayanaGames ScoreFlash, NiceTouch, EasyMobile ×2, Energy Bar Toolkit ×2, Toony Colors Pro, CartoonGUI, EasyColliderEditor, ConsolePro, Extended Colliders 3D, QcPrimitives, PowerProgressBars, GooglePlayPlugins, ExternalDependencyManager, AdvancedPlayerPrefsWindow).
  - Build target inventory: Android (ARMv7, min 22), iOS (13.0), and Standalone (batching entries exist).
  - **Profiler baseline on device** (low- and mid-tier Android, and an iPhone): the scenario is "Play → 9 shapes placed → countdown → win", 3 runs. Record frame time (avg, p95, p99), GC alloc/frame, GC count, `PlayerLoop` breakdown (Update/LateUpdate/FixedUpdate/Physics.Simulate/Coroutines/DOTween), memory, and load time. **Note the effective fps cap** (expected 30).
  - Add lightweight instrumentation: `ProfilerMarker`s around `GetStackInformation`, `CalculateCurShapePenetration`, `ProcessShapeStack`, `SetFaceProperties`; a DOTween active-tween counter (`DOTween.TotalActiveTweens()`) in a dev overlay.
  - Regression checklist (§17) and a **physics replay harness**: fixed spawn positions and scripted drop poses, recording stack height, weights, explosion events and outcome.
  - Test coverage inventory: currently none. Add the Unity Test Framework (already in the manifest, 1.3.7).
- **Affected:** all.
- **Dependencies:** none.
- **Risks:** baseline noise, mitigated by multiple runs and fixed device settings.
- **Exit criteria:** baseline report committed; replay harness produces stable results on 2023.1.
- **Artifacts:** `Docs/Baseline_2023.1.md`, Profiler captures, replay data.

### Phase 1 — Companion-doc review and migration inventory
- **Objective:** turn the docs into a tagged work inventory.
- **Key tasks:**
  - Map scripts to subsystems (Master Index §6). Risk-tag using Dependency Map Matrix C (Tier 1: LM, SM, SC; Tier 2: GM, SCM, UI, FC, LI/SI).
  - Tag every Update/FixedUpdate site (§10) and plugin API blockers (§3 scan).
  - Pipeline classification: **BiRP**, Gamma, legacy Input, uGUI + TMP.
  - **Blocker list:** R1 (`GetInstanceID` plugins), R2 (Lean fork), R4 (Android minimums and 64-bit), R5 (iOS 15), VR module, R13 (duplicate script copies), R6/R7 (latent defects).
- **Affected:** docs, backlog.
- **Dependencies:** Phase 0.
- **Risks:** missed plugin usages, mitigated by a compile trial on 6.5 in a throwaway copy ("canary") to enumerate errors early.
- **Exit:** backlog (§14) accepted; canary error list captured.
- **Artifacts:** `Docs/Migration_Inventory.md`, canary compile log.

### Phase 2 — Pre-upgrade cleanup on Unity 2023.1
- **Objective:** a clean, correct, measurable starting point.
- **Key tasks:**
  - **Defect fixes:** replace the `LevelClearShapes` busy-wait with a callback/coroutine; guard `LevelWon`/`LevelLost` with a phase check; fix the `Array.Initialize` resets (`Array.Clear`); fix `ClearSpawnPoint` (compare `.gameObject`); remove the min-height first-shape rule bug; kill and reuse outline tweens in `SetFaceProperties`; reset per-level accumulators (`seqnum`, `totaldropheight`).
  - **Hygiene:** delete empty Updates; cache colliders; strip debug keys and logs behind `#if UNITY_EDITOR || DEVELOPMENT_BUILD`; add `OnDisable`/`OnDestroy` unsubscription for the two static events.
  - **Plugin risk isolation:** extract the Lean customizations into project-owned adapters (R2); update or replace the plugins that use `GetInstanceID`, or remove unused ones (ScoreFlash, NiceTouch demo input, depending on the UnityEvent audit); update DOTween, HighlightPlus, EPO, CGF, Exploder and MeshExploder to their latest versions supporting 2023.1–6.x.
  - **Package pruning:** remove `com.unity.ide.vscode`, `com.unity.analytics`, `com.unity.ads` (unless monetization is planned, in which case plan LevelPlay), `com.unity.collab-proxy` (if unused); keep `com.unity.modules.vr` until the 6.5 step, or remove now if nothing needs it.
  - Resolve R13 (duplicate script copies).
  - **Player settings:** Android ARM64 + IL2CPP, min API 26, iOS 15 (these are valid on 2023.1 as well); enable Incremental GC; add the frame-rate policy (`targetFrameRate = 60`) as an experiment flag so it can be measured separately from the upgrade.
  - Re-baseline after the fixes (Phase 0 scenario).
- **Affected:** LevelManager, SpawnManager, ScoreManager, ShapeController, GameManager, all empty-Update scripts, manifest, ProjectSettings.
- **Dependencies:** Phase 1.
- **Risks:** fixes change gameplay (for example score leakage fixed means lower scores), so document the expected deltas.
- **Exit:** 0 compile warnings in game code; replay harness passes with documented expected changes; new baseline captured.
- **Artifacts:** `baseline-2023.1-clean` tag; changelog.

### Phase 3 — 2023.2 compatibility pass
- **Objective:** first engine hop with minimal change.
- **Key tasks:** open in 2023.2 → API Updater → re-generate lighting for `Game.unity` (ambient/reflection are no longer auto-baked, auto-generate removed) → verify runtime texture mip behaviour (only relevant if any plugin creates runtime Texture2Ds) → verify TMP/uGUI → record regressions.
- **Affected:** scenes/lighting, rendering plugins.
- **Dependencies:** Phase 2.
- **Risks:** lighting differences.
- **Exit:** screenshot diff within tolerance; smoke and replay tests pass.
- **Artifacts:** `step-2023.2` tag, regression notes.

### Phase 4 — Unity 6.0 compatibility pass
- **Objective:** cross the major boundary safely.
- **Key tasks:**
  - Run the API Updater (`angularDrag`→`angularDamping`, `velocity`→`linearVelocity`); replace `FindObjectOfType` (or complete the Phase 2 injection).
  - **Audit the CGF force mode** against the torque change and run the physics replays.
  - Migrate Build Settings to **Build Profiles** (Android-Dev/Release, iOS-Dev/Release).
  - Android: Gradle/AGP/JDK 17 defaults, `UnityPlayer` class rename in any custom activity (EasyMobile/Google plugins).
  - Validate rendering (light-probe brightness +6 %), input (Lean + legacy), UI.
  - Document the remaining debt.
- **Affected:** ShapeController, PlatformController, CGF, Android plugins.
- **Dependencies:** Phase 3.
- **Risks:** R3, R4, R9.
- **Exit:** device builds run; replay deltas within tolerance; perf ≥ Phase 2 baseline.
- **Artifacts:** `step-6.0-LTS` tag.

### Phase 5 — Unity 6.1 → 6.3 stepped stabilization
- **Objective:** reach **6.3 LTS** as the release-quality checkpoint.
- **Key tasks:**
  - 6.1: replace PVRTC textures with ASTC; check `SetDensity` in MeshExploder.
  - 6.2: review shader API deprecation warnings (Toony Colors, EPO).
  - 6.3: `[SerializeField]` misuse compile check; decide the Ads path (LevelPlay or remove); Android App Category = Game, adaptive icons, Gradle 9.1/AGP 9.0; recompile or refresh precompiled DLLs (DOTween) for the `MissingFieldException` class of issues; Adaptive Performance module (no action unless it's used).
  - After each version: compile, smoke, replay, and a quick Profiler check. At 6.3: **full regression + device perf run + store-candidate builds**.
- **Affected:** textures, shaders, Android config, packages.
- **Dependencies:** Phase 4.
- **Risks:** hidden accumulation of regressions, mitigated by per-step tags.
- **Exit:** 6.3 LTS candidate is releasable.
- **Artifacts:** `step-6.1`, `step-6.2`, `step-6.3-LTS` tags; 6.3 release report.

### Phase 6 — Unity 6.5 adoption and modernization
- **Objective:** land on the target and adopt the high-value tooling.
- **Key tasks:**
  - **6.4 fixes:** verify plugins for `OnDisable` duplicate-call workarounds; confirm editor tooling still reimports correctly (artifact dependency narrowing); iOS post-build paths; run the **in-Editor Project Auditor** and archive the report.
  - **6.5 fixes:** remove `com.unity.modules.vr`; resolve all `GetInstanceID`/`InstanceIDToObject` errors (should be none after Phase 2); fix removed GameObject/Component accessors in plugins; Android API 26 / insets / LTO for release builds; iOS 15; triage the serialization rules analyzer warnings; use Project Auditor's **obsolete API report**.
  - **Adopt:** Adaptive Performance thermal fallbacks (Apple provider, iOS thermal FPS settings); Build Profiles for dev/release stripping; Rendering Statistics for draw-call checks.
  - **Keep BiRP**, and record deprecation warnings for the URP track.
- **Affected:** manifest, plugins, player settings.
- **Dependencies:** Phase 5.
- **Risks:** R1, R8, R15.
- **Exit:** clean compile; device builds pass store validation; perf ≥ 6.3 checkpoint.
- **Artifacts:** `step-6.5` tag; Project Auditor reports.

### Phase 7 — Performance refactor pass
- **Objective:** a stable 60 FPS on mid-tier devices, with no avoidable per-frame work.
- **Key tasks:**
  - E3 ShapeState + event-driven selection; E1 DropValidator; the GameManager drag cooldown (a single timer); LevelManager clock/countdown → CountdownTimer + HudPresenter (E5).
  - Centralized SettleMonitor; gate the Lean components by state.
  - Remove polling coroutines and `WaitForSeconds` allocations.
  - `targetFrameRate = 60` adopted (with the thermal policy); tune PhysX solver iterations using the replays.
  - Pool VFX/fragments if the Profiler shows instantiate spikes (MeshExploder).
- **Affected:** ShapeController, GameManager, SpawnManager (validator), LevelManager, UI.
- **Dependencies:** Phase 6.
- **Risks:** R12. Use feature flags per refactor and replay comparisons.
- **Exit:** perf targets (§16) met; replays within tolerance; 0 GC allocations/frame in steady play (excluding intentional spawns).
- **Artifacts:** perf report vs baseline.

### Phase 8 — Modularization and maintainability pass
- **Objective:** SOLID boundaries and a formal event contract.
- **Key tasks:**
  - Decompose SpawnManager (LevelSpawner, StackGraphService with the contact-based support graph (E2), ShapeRulesEngine with `IShapeRule` strategies and queued destruction, PlayedShapeRegistry, editor-only LevelMakerTool).
  - Split GameManager; LevelFlow/LevelOutcomeService (E4); UIManager driven by events.
  - Wire EffectManager, SoundManager gameplay cues and RdWAnalytics as event listeners.
  - Convert data to ScriptableObjects; a composition root in Loader; static events replaced by SO channels; unit tests for the pure C# services (graph, rules, scoring).
- **Affected:** all hubs.
- **Dependencies:** Phase 7.
- **Risks:** scope creep, mitigated by strangler-pattern increments behind flags.
- **Exit:** no manager-to-manager bidirectional references (the dependency atlas regenerated from `Scripts_Dependency_Matrix.json` shows no cycles among the Tier 1 nodes); tests green.
- **Artifacts:** updated companion docs and a regenerated dependency atlas.

### Phase 9 — Validation, hardening, and release readiness
- **Objective:** ship with evidence.
- **Key tasks:** Profiler comparison vs Phase 0 and the Phase 2 baselines; full regression (§17); platform validation (Android low/mid/high, iOS min/current); memory and long-session thermal soak (30 min); store submission dry-runs; sign-off.
- **Affected:** all.
- **Dependencies:** Phase 8 (or Phase 7 for a perf-only release).
- **Risks:** late platform surprises.
- **Exit / sign-off:** §16 targets met; zero P0/P1 bugs; store builds accepted.
- **Artifacts:** release report; final tags.

---

## 14. Prioritized Backlog

| ID | Item | Phase | Affected | Expected benefit | Effort | Risk | Dependencies | Priority |
|---|---|---|---|---|---|---|---|---|
| B01 | VCS + backup + tagging scheme | 0 | project | Rollback | S | Low | — | P0 |
| B02 | Device Profiler baseline + ProfilerMarkers + tween counter | 0 | hubs | Measurability | M | Low | B01 | P0 |
| B03 | Physics replay harness | 0 | SpawnManager/ShapeController | Regression detection | M | Low | B01 | P0 |
| B04 | Canary 6.5 compile to enumerate errors | 1 | plugins | Early blocker list | S | Low | B01 | P0 |
| B05 | Fix the `LevelClearShapes` freeze | 2 | SpawnManager, LevelManager | Retry/Next usable | S | Low | B03 | P0 |
| B06 | Idempotent LevelWon/LevelLost (phase guard) | 2 | LevelManager | Correct coins/stats | S | Low | — | P0 |
| B07 | Kill/reuse outline tweens | 2 | ShapeController | Stops the tween leak | S | Low | — | P0 |
| B08 | Reset score arrays (`Array.Clear`) and per-level accumulators | 2 | ScoreManager, SpawnManager | Correct scores | S | Low (score deltas) | — | P0 |
| B09 | Remove empty Updates / LateUpdate | 2 | 11 scripts | CPU | XS | None | — | P0 |
| B10 | Cache colliders; stop per-frame `SetColliderTriggerStatus` | 2 | ShapeController | GC/CPU | S | Low | — | P0 |
| B11 | Stop the docked `Release` re-arm loop | 2 | ShapeController | CPU/tweens | S | Low | — | P0 |
| B12 | Strip debug keys/logs from release | 2 | SpawnManager, ScoreManager | CPU/GC | S | Low | — | P0 |
| B13 | Lean customizations → project adapters | 2 | GameManager, SpawnManager, Lean | Safe plugin updates | M | Medium | B03 | P0 |
| B14 | Update/replace plugins with `GetInstanceID` | 2 | ScoreFlash, NiceTouch, EasyColliderEditor, Toony Colors | Unblocks 6.5 | M | Medium | B04 | P0 |
| B15 | Android ARM64 + IL2CPP, min API 26; iOS 15 | 2 | Player settings | Store/6.5 compliance | S | Medium | — | P0 |
| B16 | Resolve duplicate script copies under `Assets/` | 2 | project | Avoids duplicate types | XS | Low | B01 | P0 |
| B17 | Remove vscode/analytics/ads packages (or plan LevelPlay) | 2 | manifest | Upgrade friction | S | Low | — | P1 |
| B18 | Incremental GC + `targetFrameRate = 60` (flagged) | 2 | settings, Loader | Up to 2× fps ceiling | XS | Medium (thermal) | B02 | P0 |
| B19 | 2023.2 pass (lighting regen) | 3 | scenes | — | S | Low | Phase 2 | P1 |
| B20 | 6.0 pass: API Updater, Find APIs, **CGF torque audit**, Build Profiles | 4 | ShapeController, PlatformController, CGF | Compliance | M | Medium | B19 | P0 |
| B21 | 6.1–6.3 passes (ASTC, shader warnings, SerializeField, App Category, DLL refresh) | 5 | textures/Android | LTS checkpoint | M | Medium | B20 | P0 |
| B22 | 6.4/6.5 passes (VR module, InstanceID, insets, analyzer, Project Auditor) | 6 | manifest/plugins | Target reached | M | Medium | B21 | P0 |
| B23 | Adaptive Performance thermal policy | 6 | settings | Stable fps on long sessions | S | Low | B18 | P2 |
| B24 | ShapeState machine + Lean select/deselect events (E3) | 7 | ShapeController | Near-zero idle cost | M | Medium | B03 | P1 |
| B25 | DropValidator (E1) + single drag cooldown | 7 | GameManager, SpawnManager | Removes the drag storm | M | Medium | B24 | P1 |
| B26 | CountdownTimer + HudPresenter (E5) | 7 | LevelManager | GC-free HUD | S | Low | — | P1 |
| B27 | SettleMonitor (centralized settle) | 7 | ShapeController | Removes polling coroutines | M | Medium | B03 | P1 |
| B28 | PhysX solver iteration tuning | 7 | DynamicsManager | Physics step time | S | **High** | B03 | P2 |
| B29 | StackGraphService (contact graph, coalesced, Δ events) (E2) | 8 | SpawnManager, ShapeController | Correct weights; spikes removed | L | **High** | B27 | P1 |
| B30 | ShapeRulesEngine (IShapeRule, queued destroy) | 8 | SpawnManager | Order-independent rules | M | Medium | B29 | P1 |
| B31 | LevelFlow/LevelOutcomeService + event-driven UI (E4) | 8 | LevelManager, UIManager, FloorCollider | Decoupling | M | Low–Medium | B06 | P1 |
| B32 | PlayedShapeRegistry (E6) | 8 | ShapeController, SpawnManager | Consistent counts | S | Low | B31 | P2 |
| B33 | ScriptableObject data (levels, tuning, scoring) | 8 | data classes | Designer workflow | M | Low | — | P2 |
| B34 | Audio/VFX/Analytics listeners | 8 | SoundManager, EffectManager, RdWAnalytics | Features at low cost | S | Low | B31 | P2 |
| B35 | Composition root (Loader) + execution order | 8 | managers | Deterministic init | S | Medium | B31 | P2 |
| B36 | Unit tests for graph/rules/scoring | 8 | new services | Safety net | M | Low | B29–B30 | P1 |
| B37 | URP migration track | Later | rendering | BiRP end-of-life readiness | L | High | Phase 9 | P3 |

---

## 15. Script-Level Recommendations

| Script | Why it matters | Migration concerns | Performance concerns | Modularity concerns | Next actions | Phase |
|---|---|---|---|---|---|---|
| **ShapeController** | N instances; the core interaction and state | `FindObjectOfType` ×2; `rb.velocity`, `rb.angularDrag` renames; Lean/EPO/DOTween APIs | Update + LateUpdate × N; per-frame `GetComponents`; 0.5 s tween churn; polling coroutines; tween leak | 12-flag state; mutates SpawnManager lists; static event | B07, B10, B11 now; B24, B27 later; payload events | 2, 7, 8 |
| **SpawnManager** | Spawn, stack graph, weights, rules, drop legality, debug tooling | Legacy Input ×31; `GameObject.Find`; MeshExploder/CGF/HighlightPlus/DOTween plugin APIs | Settle-time O(n²c²) + allocations; per-drag penetration scans; per-frame key polling | God object; re-entrant rules; order-dependent rules | B05, B12 now; B25, B29, B30 later | 2, 7, 8 |
| **LevelManager** | Level lifecycle, outcomes, persistence | TMP package move; static event subscription | Per-frame clock string; tag search per shape | Bidirectional with 5 managers; UI toggling | B06 now; B26, B31 later | 2, 7, 8 |
| **GameManager** | Rotation feel, drop permission, level entry | Custom Lean members (R2); legacy Input | Coroutine per drag frame; GetComponent per frame; idle accumulation | Mixed responsibilities | B13 now; B25 later; split into LevelFlow / RotationController / SessionStats | 2, 7, 8 |
| **ScoreManager** | Score correctness, persistence | None | Heavy `Debug.Log` string per stack update | Magic-index arrays; coupled to LevelManager | B08, B12 now; `IScoreRule` strategies + `ScoreBreakdown` | 2, 8 |
| **FloorColliderController** | Lose condition | None | Empty Update | Static event, no payload | Payload event `ShapeDestroyed(Fell)`; unsubscribe | 2, 8 |
| **PlatformController** | First contact; platform skins | `FindObjectOfType` | Empty Update; `material` instancing | Pokes `istouching` | Injected refs; `sharedMaterial`/property block; `ShapeLanded` event | 2, 8 |
| **UIManager** | Game start; screens | TMP move | Empty Update | Popups toggled by LevelManager | Event-driven screen state machine | 8 |
| **LevelData / LevelInfo / LevelMakerData** | Content | Serialization analyzer warnings | — | Content in code; stale tallies | ScriptableObjects; recount tallies | 8 |
| **SoundManager / AppInfo / RdWUtilities** | Services | `DestroyImmediate` in Awake; `UnityWebRequest.EscapeURL`; static singletons with Enter Play Mode Options | Coroutine per SFX | Singletons | Event listeners for gameplay audio; `Uri.EscapeDataString` | 8 |
| **CameraController, DockColliderController, Loader, RdWAnalytics, DurationScale, ScoreEffect, DamagePopup, EffectManager, WorldData/WorldInfo** | Low | None | Empty Updates | Dead/orphan code | Delete or repurpose (Loader → composition root; RdWAnalytics/EffectManager → listeners) | 2, 8 |

---

## 16. Validation and Profiling Plan

| Metric | Tool | Target (mid-tier Android / recent iPhone) | Baseline source |
|---|---|---|---|
| Frame time | Unity Profiler (device, Development build with Deep Profile **off**), Rendering Statistics (6.4+) | **≤ 16.6 ms p95 (60 FPS)** in steady play; ≤ 20 ms p99 during settle cascades | Phase 0 / Phase 2 |
| Effective FPS | on-screen dev overlay + Profiler | 60 when `targetFrameRate = 60`; thermal fallback per Adaptive Performance | Phase 0 (expected 30 cap) |
| GC allocations | Profiler (GC Alloc column), Memory Profiler | **0 B/frame** in steady play; allocation only on spawn/explode | Phase 0 |
| CPU hot spots | ProfilerMarkers: `Stack.Analyze`, `Drop.Validate`, `Rules.Process`, `Shape.View` | Stack pass ≤ 0.5 ms with 14 shapes; drop validation ≤ 0.2 ms per evaluation | Phase 0 markers |
| Physics | Profiler Physics module | `Physics.Simulate` ≤ 3 ms p95 | Phase 0 |
| Active tweens | `DOTween.TotalActiveTweens()` overlay | Bounded (≤ 3 × shape count) over a 10-minute session | Phase 0 (grows) |
| Load time | Stopwatch from scene load to "Play" interactable | ≤ baseline | Phase 0 |
| Memory | Memory Profiler snapshots at title / mid-level / after 5 levels | No growth across levels | Phase 0 |
| Script execution order regressions | Init-order log in a dev build | Deterministic order (composition root) | — |
| Event duplication / missed unsubscribe | Dev-build event bus assertions (duplicate handler detection); scene reload test ×5 | 0 duplicate handlers | — |
| Build success | CI batch builds with `-accept-apiupdate` (Confirmed from Unity docs) per Build Profile | Android/iOS dev and release green | — |
| Static analysis | Project Auditor (6.4+ in-Editor; package on ≤ 6.3); serialization analyzer (6.5) | 0 critical issues in game code | Phase 1 |

**Workflow:** capture 3 × 60 s runs per scenario; compare with the Profile Analyzer (median and p95); gate each phase on "no metric worse than the previous tag by more than 5 %".

---

## 17. Test Strategy

| Area | Tests |
|---|---|
| Smoke | Launch → title totals shown → Play → shapes spawn (9, 0.3 s cadence) → place all → countdown → win popup |
| Scene load | Load Game.unity 5× in one session (static-event duplication check); ScoreEffect scene isolation |
| Save/load (PlayerPrefs) | CurrentLevel, LevelScore-N/Stars-N, PlayerCoins, TotalGamesPlayed, Music/SoundPreference round-trip; first-run defaults; coin halving on a loss exactly once |
| Input | Drag above/below the dock line; release above the line (return); release overlapping (return); auto 45° snap after `rotationpause`; arrow keys (editor); rotation UI buttons; the Lean offset still applied after the adapter refactor |
| UI | Title → HUD → win/lose popups; HUD clock m:ss updates once per second; countdown display; debug canvas absent in release |
| Animation | AnimatedButton "Pressed" trigger + delayed click; punch-scale spawn animations; outline fades change only on weight change |
| Physics | Replay harness: fixed drop sequences → stack height ± tolerance, topple/no-topple outcome, explosion events; CGF force-mode A/B; solver iteration variants |
| Audio | Button click; mute toggles persist; (after Phase 8) gameplay cues fire once per event |
| Platform | Android min API 26 device, ARM64; edge-to-edge/insets; iOS 15 device; thermal soak 30 min; background/foreground resume |
| Migration-specific | Per-version compile with 0 new game-code warnings; lighting screenshot diffs (2023.2); precompiled DLL load (6.3); VR module removal (6.5); plugins without `GetInstanceID` errors |
| EDD edge cases | Grab and release in the same frame; release exactly at the dock line; re-grab a dropped-but-unsettled shape; two shapes settle in the same frame (coalesced pass); an explosion during the stack pass (queued, no re-entry); a timer shape falls during its fuse (no exception); countdown expiry together with a fall (single outcome); listener disabled/destroyed mid-event; scene reload with Enter Play Mode Options (no domain reload) |
| Weighted shapes | Load 0→1→2→3 then unload; tall neighbour touching but not supporting (must not count after E2); concave L/T/+ multi-collider shapes; `shapemaxweight` boundary |

---

## 18. Open Questions and Unknowns

| Unknown | Why it matters | Missing evidence | How to verify |
|---|---|---|---|
| Is the game shipped, and where? | Store policies (64-bit, target API) and whether monetization/analytics must be preserved | Release info | Ask the owner; check the Play Console / App Store Connect |
| Vendor Unity 6 support for each plugin | R1/R9 blockers | Vendor pages | Asset Store / vendor changelogs; canary compile (B04) |
| Exact extent of the Lean Touch modifications | R2 | Diff vs vendor | Diff `Assets/Lean` against a clean download of the same version |
| UnityEvent targets (rotation buttons, Play, prefab buttons) | Refactor safety (method renames break bindings) | YAML target resolution | Parse `m_Target` in Game.unity and prefabs; or the Editor's "Find References" |
| CGF force mode and settings | Torque change impact (R3) | Scene Inspector values | Inspect the CGF component in Game.unity |
| Shape prefab collider composition | Weighted-shape algorithm redesign, height sampling | Prefab data | Inspect the 24 prefabs (collider count and types) |
| Actual device frame time and fps cap | Validates §9 and the 60 FPS plan | Profiler capture | Phase 0 baseline |
| Dangling NiceTouch UnityEvent listeners in Game.unity (methods of the unattached `MMControlsTestInputManager`) | If NiceTouch is removed or updated (R1), these bindings go stale or error | YAML target resolution | Inspect the MMTouch controls in Game.unity; remove the dead listeners |
| Root-level duplicate scripts under `Assets/` | Possible duplicate-type compile errors | Import state | Open in 2023.1 and check the console; confirm with the owner |
| Whether `Physics.ContactEvent` / `IsSleeping` gives adequate settle semantics for this stack | E2/E3 design | Prototype | Spike in Phase 7 with the replays |
| Target version decision (6.5 unsupported vs 6.6/6.7 LTS) | Support lifecycle | Owner decision | Decide at the 6.3 LTS checkpoint |

---

## 19. Recommended Order of Attack

1. **First:** VCS + baseline + replay harness (B01–B03). Then run the **canary 6.5 compile** (B04) so the blocker list is real, not guessed.
2. **Fix correctness before engine changes:** the freeze, double outcome, score resets, tween leak (B05–B08). Remove empty Updates and per-frame allocations (B09–B12).
3. **De-risk plugins:** the Lean adapters (B13); replace or update the `GetInstanceID` plugins (B14); prune dead packages (B17); resolve the duplicate scripts (B16); set platform minimums (B15).
4. **Measure the quick fps win separately:** `targetFrameRate = 60` + incremental GC (B18).
5. **Step the engine:** 2023.2 → 6.0 (CGF torque audit) → 6.1 → 6.2 → **6.3 LTS checkpoint** → 6.4 → 6.5.
6. **Then refactor for performance** (E3, E1, E5, SettleMonitor), and **then modularize** (E2, rules engine, outcome service, registry, SO data, composition root).
- **Defer:** URP migration; UI Toolkit; DOTS/Unity Physics; mimalloc; Swift iOS project type.
- **Don't touch early:** the weight/support algorithm (gameplay-defining; needs the replay harness and designer sign-off); PhysX solver iteration values; the Lean vendor code itself.
- **Highest leverage:** (a) the frame-rate policy, (b) ShapeController idle cost (N×), (c) the drag storm, (d) the coalesced event-driven stack pass with tween reuse.

---

## 20. Final Summary

- **Biggest upgrade blockers:**
  1. Third-party plugins calling `Object.GetInstanceID` / `InstanceIDToObject`, which are compile errors in 6.5 (ScoreFlash, NiceTouch, EasyColliderEditor, Toony Colors Pro).
  2. The project-modified Lean Touch.
  3. Android minimum API 26, 64-bit and AGP 9, and iOS 15.
  4. Removal of the VR module and deprecation of the legacy Ads/Analytics/VS Code packages.
  5. The Rigidbody torque change affecting the Circular Gravity Force.
- **Highest-value Unity 6.x opportunities:** the in-Editor Project Auditor with its obsolete-API report; Build Profiles for clean dev/release separation; Adaptive Performance and iOS thermal FPS control; the serialization rules analyzer; Android LTO; and, in a later URP track, on-tile post-processing and the GPU Resident Drawer.
- **Most important performance wins:**
  1. Explicit **60 FPS target** (currently most likely capped at 30) + incremental GC.
  2. Zero-cost idle shapes (no per-frame polling, `GetComponents`, or 0.5 s tween churn).
  3. Remove the drag coroutine storm (a dirty-flag DropValidator).
  4. A coalesced, incremental, allocation-free stack analysis with tween reuse.
  5. GC-free HUD text; stripped debug input and logs.
- **Best event-driven refactor targets:**
  1. Shape selection/state (Lean callbacks → `ShapeState`).
  2. Drop legality (`DropPermissionChanged`).
  3. Stack analysis (`ShapeSettled` → `StackChanged`/`WeightChanged`).
  4. Level outcome (`CountdownExpired`/`ShapeDestroyed` → idempotent `LevelWon`/`LevelLost`, consumed by UI, audio, VFX and analytics).
- **Safest path to ship:** baseline and harness → fix latent defects on 2023.1 → isolate plugin risk → step through versions with per-step gates → **release from 6.3 LTS if needed** → finish on 6.5 (latest patch; or 6.6/6.7 LTS for support) → refactor behind feature flags, validated by replays and device profiling against the recorded baseline.

---

*Companion documents:* [Scripts_Master_Index.md](Scripts_Master_Index.md) · [Scripts_Dependency_Implementation_Plan.md](Scripts_Dependency_Implementation_Plan.md) · [Scripts_Dependency_Map.md](Scripts_Dependency_Map.md) · [Scripts_Dependency_Showcase.html](Scripts_Dependency_Showcase.html)
