# Balance Stack Hero 2026 — Scripts Dependency Map & Architectural Atlas

**Document ID:** `BSH2026-DEP-MAP-001`  
**Target Directory:** `Assets/Scripts/Docs/`  
**Companion Master Index:** [`Scripts_Master_Index.md`](./Scripts_Master_Index.md)  
**Companion Legend:** [`Scripts_Dependency_Legend.md`](./Scripts_Dependency_Legend.md)  
**Companion Implementation Plan:** [`Scripts_Dependency_Implementation_Plan.md`](./Scripts_Dependency_Implementation_Plan.md)  
**Machine-Readable Exports:** [`Scripts_Dependency_Matrix.csv`](./Scripts_Dependency_Matrix.csv) | [`Scripts_Dependency_Matrix.json`](./Scripts_Dependency_Matrix.json)  
**Visual Interactive Showcase:** [`Scripts_Dependency_Showcase.html`](./Scripts_Dependency_Showcase.html)  

---

## Section A: Executive Summary & Phase 0 Corpus Inventory

### A.1 Executive Architectural Synthesis
**Balance Stack Hero 2026** contains **27 first-party C# script files** (`22` root scripts in `Assets/Scripts/` and `5` service scripts in `Assets/Scripts/Game/`) declaring **29 distinct classes** (**Confirmed from companion docs**; `ShapeInfo` and `PlatformInfo` are co-declared inside [`SpawnManager.cs.md`](./SpawnManager.cs.md)). Every script resides in the `<global>` namespace without custom assembly definitions (`Assembly-CSharp.dll`).

The dependency topology exhibits a classic **Hub-and-Spoke "God Object" Triad** (**Confirmed from companion docs**):
1. **[`LevelManager.cs`](./LevelManager.cs.md) (`Total Degree = 18`, `Fan-Out = 12`, `Fan-In = 6`)** acts as the central progression, persistence, and game-over referee hub.
2. **[`SpawnManager.cs`](./SpawnManager.cs.md) (`Total Degree = 17`, `Fan-Out = 8`, `Fan-In = 9`)** acts as the physics spawner, active stack validator, and host of co-declared data types (`ShapeInfo`, `PlatformInfo`), inflating its inbound coupling across data and progression classes.
3. **[`GameManager.cs`](./GameManager.cs.md) (`Total Degree = 9`, `Fan-Out = 4`, `Fan-In = 5`)** acts as the top-level state coordinator (`GAMEMODE`, `CONTROLSCHEME`) and per-frame touch/rotation proxy into [`SpawnManager.cs`](./SpawnManager.cs.md) and [`ShapeController.cs`](./ShapeController.cs.md).

| Metric | Value | Confidence Label | Architectural Interpretation |
| :--- | :---: | :--- | :--- |
| **Total First-Party Script Files** | `27` | **Confirmed from companion docs** | `22` root scripts + `5` `Game/` subfolder scripts |
| **Total First-Party Classes** | `29` | **Confirmed from companion docs** | Includes `ShapeInfo` & `PlatformInfo` inside `SpawnManager.cs` |
| **Confirmed Internal Script Edges** | `59` | **Confirmed from companion docs** | Directed `Row -> Column` relationships ($\sum \text{Fan-Out} = \sum \text{Fan-In} = 59$) |
| **Inferred / Template-Discrepancy Edges** | `7` | **Inferred from companion docs** | Marked with `?` (4 `SoundManager` edges + 3 `UIManager` edges) |
| **External / Plugin / Engine Edges** | `48` | **Confirmed from companion docs** | Across `16` distinct external plugin, package, and Unity engine targets |
| **Cyclic Dependency Clusters** | `3` | **Confirmed from companion docs** | Core Gameplay Triad, Spawner-Shape Loop, and LevelManager-ScoreManager Loop |
| **Tier 1 Critical Hub Scripts** | `4` | **Confirmed from companion docs** | `LevelManager`, `SpawnManager`, `GameManager`, `ShapeController` |
| **Tier 4 Isolated / Orphan Scripts** | `4` | **Confirmed from companion docs** | `DurationScale`, `ScoreEffect`, `RdWAnalytics`, `Game/EffectManager` |

---

### A.2 Phase 0 Corpus Inventory & Classification Ledger

All 27 companion documentation files in `Assets/Scripts/Docs/` are accounted for below (**Confirmed from companion docs**):

| # | Script File | Companion Doc | Declared Class(es) | Base Class / Interfaces | Subsystem | Confirmed Fan-Out | Confirmed Fan-In | Total Degree | Risk Tier |
| :-: | :--- | :--- | :--- | :--- | :---: | :-: | :-: | :-: | :---: |
| 1 | `AnimatedButton.cs` | [`AnimatedButton.cs.md`](./AnimatedButton.cs.md) | `AnimatedButton` | `UIBehaviour`, `IPointerDownHandler` | `SUB-UI` | 1 | 0 | 1 | `Tier 3` |
| 2 | `CameraController.cs` | [`CameraController.cs.md`](./CameraController.cs.md) | `CameraController` | `MonoBehaviour` | `SUB-UI` | 0 | 3 | 3 | `Tier 3` |
| 3 | `DamagePopup.cs` | [`DamagePopup.cs.md`](./DamagePopup.cs.md) | `DamagePopup` | `MonoBehaviour` | `SUB-UI` | 0 | 1 | 1 | `Tier 3` |
| 4 | `DockColliderController.cs` | [`DockColliderController.cs.md`](./DockColliderController.cs.md) | `DockColliderController` | `MonoBehaviour` | `SUB-CORE` | 1 | 1 | 2 | `Tier 3` |
| 5 | `DurationScale.cs` | [`DurationScale.cs.md`](./DurationScale.cs.md) | `DurationScale` | `MonoBehaviour` | `SUB-UI` | 0 | 0 | 0 | `Tier 4` |
| 6 | `FloorColliderController.cs` | [`FloorColliderController.cs.md`](./FloorColliderController.cs.md) | `FloorColliderController` | `MonoBehaviour` | `SUB-CORE` | 4 | 1 | 5 | `Tier 2` |
| 7 | `GameManager.cs` | [`GameManager.cs.md`](./GameManager.cs.md) | `GameManager` | `MonoBehaviour` | `SUB-CORE` | 4 | 5 | 9 | `Tier 1` |
| 8 | `LevelData.cs` | [`LevelData.cs.md`](./LevelData.cs.md) | `LevelData` | `System.Object` | `SUB-PROG` | 3 | 4 | 7 | `Tier 2` |
| 9 | `LevelInfo.cs` | [`LevelInfo.cs.md`](./LevelInfo.cs.md) | `LevelInfo` | `System.Object` | `SUB-PROG` | 2 | 5 | 7 | `Tier 2` |
| 10 | `LevelMakerData.cs` | [`LevelMakerData.cs.md`](./LevelMakerData.cs.md) | `LevelMakerData` | `System.Object` | `SUB-PROG` | 4 | 1 | 5 | `Tier 3` |
| 11 | `LevelManager.cs` | [`LevelManager.cs.md`](./LevelManager.cs.md) | `LevelManager` | `MonoBehaviour` | `SUB-PROG` | 12 | 6 | 18 | `Tier 1` |
| 12 | `LevelStatus.cs` | [`LevelStatus.cs.md`](./LevelStatus.cs.md) | `LevelStatus` | `System.Object` | `SUB-PROG` | 0 | 4 | 4 | `Tier 3` |
| 13 | `Loader.cs` | [`Loader.cs.md`](./Loader.cs.md) | `Loader` | `MonoBehaviour` | `SUB-UI` | 3 | 0 | 3 | `Tier 3` |
| 14 | `PlatformController.cs` | [`PlatformController.cs.md`](./PlatformController.cs.md) | `PlatformController` | `MonoBehaviour` | `SUB-CORE` | 2 | 1 | 3 | `Tier 2` |
| 15 | `RdWAnalytics.cs` | [`RdWAnalytics.cs.md`](./RdWAnalytics.cs.md) | `RdWAnalytics` | `MonoBehaviour` | `SUB-SVC` | 0 | 0 | 0 | `Tier 4` |
| 16 | `ScoreEffect.cs` | [`ScoreEffect.cs.md`](./ScoreEffect.cs.md) | `ScoreEffect` | `MonoBehaviour` | `SUB-UI` | 0 | 0 | 0 | `Tier 4` |
| 17 | `ScoreManager.cs` | [`ScoreManager.cs.md`](./ScoreManager.cs.md) | `ScoreManager` | `MonoBehaviour` | `SUB-PROG` | 3 | 2 | 5 | `Tier 2` |
| 18 | `ShapeController.cs` | [`ShapeController.cs.md`](./ShapeController.cs.md) | `ShapeController` | `MonoBehaviour` | `SUB-CORE` | 2 | 5 | 7 | `Tier 1` |
| 19 | `SpawnManager.cs` | [`SpawnManager.cs.md`](./SpawnManager.cs.md) | `SpawnManager`, `ShapeInfo`, `PlatformInfo` | `MonoBehaviour` / `Object` | `SUB-CORE` | 8 | 9 | 17 | `Tier 1` |
| 20 | `UIManager.cs` | [`UIManager.cs.md`](./UIManager.cs.md) | `UIManager` | `MonoBehaviour` | `SUB-UI` | 4 | 3 | 7 | `Tier 2` |
| 21 | `WorldData.cs` | [`WorldData.cs.md`](./WorldData.cs.md) | `WorldData` | `System.Object` | `SUB-PROG` | 1 | 2 | 3 | `Tier 3` |
| 22 | `WorldInfo.cs` | [`WorldInfo.cs.md`](./WorldInfo.cs.md) | `WorldInfo` | `System.Object` | `SUB-PROG` | 0 | 2 | 2 | `Tier 3` |
| 23 | `Game/AppInfo.cs` | [`Game/AppInfo.cs.md`](./Game/AppInfo.cs.md) | `AppInfo` | `MonoBehaviour` | `SUB-SVC` | 0 | 1 | 1 | `Tier 3` |
| 24 | `Game/EffectManager.cs` | [`Game/EffectManager.cs.md`](./Game/EffectManager.cs.md) | `EffectManager` | `MonoBehaviour` | `SUB-SVC` | 1 | 0 | 1 | `Tier 4` |
| 25 | `Game/RdWUtilities.cs` | [`Game/RdWUtilities.cs.md`](./Game/RdWUtilities.cs.md) | `RdWUtilities` | `MonoBehaviour` | `SUB-SVC` | 3 | 0 | 3 | `Tier 3` |
| 26 | `Game/Sound.cs` | [`Game/Sound.cs.md`](./Game/Sound.cs.md) | `Sound` | `System.Object` | `SUB-SVC` | 0 | 2 | 2 | `Tier 3` |
| 27 | `Game/SoundManager.cs` | [`Game/SoundManager.cs.md`](./Game/SoundManager.cs.md) | `SoundManager` | `MonoBehaviour` | `SUB-SVC` | 1 | 1 | 2 | `Tier 3` |
| **Σ** | **27 Scripts** | **27 Docs + 1 Index** | **29 Classes** | — | **4 Subsystems** | **59** | **59** | **118** | — |

---

## Section B: Internal Dependency Overview (ASCII-Art Diagrams)

### B.1 High-Level Internal Architecture Map
The diagram below illustrates the macro-level dependency flow across the four subsystems (**Confirmed from companion docs**; `?` denotes **Inferred from companion docs**):

```text
+===================================================================================================+
|                        SUB-UI: PRESENTATION, CAMERA & SCENE ENTRY LAYER                           |
|                                                                                                   |
|  [AnimatedButton.cs] ---(D;E?)---> [UIManager.cs] <---(D)--- [Loader.cs (Dormant Skeleton)]       |
|                                       |     ^                     |              |                |
|            +--------------------------+     | (D;R;W: wingameui,  | (D)          | (D)            |
|            | (D;C: StartLevel,              |         losegameui) |              |                |
|            |       GetCurrentLevel)         |                     v              |                |
+============|================================|=====================|==============|================+
             v                                |                     v              |
+=============================================|====================================|================+
|  SUB-CORE: CORE GAMEPLAY TRIAD              |         SUB-PROG: PROGRESSION HUB  |                |
|                                             |                                    v                |
|      +-----------------------------> [LevelManager.cs] <-------------------------+                |
|      |                                (Fan-Out:12, Fan-In:6)                                      |
|      |                                  |       ^       |                                         |
|      | (D;C: LoadLevelInfo,             |       |       +---(D;C;R;W)---> [LevelData.cs]          |
|      |       LoadLevelMakerInfo)        |       |       +---(D;C)-------> [LevelMakerData.cs]     |
|      |                                  |       |       +---(D;C;R)-----> [WorldData.cs]          |
|      |                                  |       |       +---(D;R)-------> [LevelInfo.cs]          |
|  [GameManager.cs] <-----(D;C)-----------+       |       +---(R;W)-------> [LevelStatus.cs]        |
|  (Fan-Out:4, Fan-In:5)                          |       +---(D;R)-------> [WorldInfo.cs]          |
|      |         ^                                |                                                 |
|      |         | (D;C)                     (D;C;R) / (D;C;W)                                      |
|      |         v                                |                                                 |
|      |   [SpawnManager.cs] <--------------------+                                                 |
|      |   (Fan-Out:8, Fan-In:9; hosts ShapeInfo & PlatformInfo)                                    |
|      |      |        ^  ^                                                                         |
|      |      |        |  +---(D;W: dockloc)--- [DockColliderController.cs] <--(G)--+               |
|      |      |        +------(D;G;R: platmats)- [PlatformController.cs]            |               |
|      |      v        |                             | (G;W: istouching=true)       |               |
|      +-> [ShapeController.cs] <--------------------+------------------------------+               |
|          (Fan-Out:2, Fan-In:5; emits static collisionEvent)                                       |
|                  ^                                                                                |
|                  | (G: GetComponent<ShapeController>)                                             |
|          [FloorColliderController.cs] ---(E: static levelstatusEvent)---> [LevelManager.cs]       |
|                  |                                                                                |
|                  +---(C: gamemgr.camctlr.ShakeStaticCamera)-------------> [CameraController.cs]   |
+===================================================================================================+
```

---

### B.2 Core Gameplay Triad & Per-Frame Execution Loop
During active gameplay, three managers (`GameManager`, `LevelManager`, `SpawnManager`) form a tightly coupled bidirectional triangle (**Confirmed from companion docs**):

```text
+---------------------------------------------------------------------------------------------------+
|                                   CORE GAMEPLAY TRIAD (CYCLE 1)                                   |
|                                                                                                   |
|   [GameManager.cs]                                                                                |
|     |-- Start() ---------> lvlmgr.GetLastPlayedLevel()                                            |
|     |-- StartLevel(lvl) -> spawnmgr.curlevel = lvl                                                |
|     |                      lvlmgr.LoadLevelInfo(lvl)  OR  lvlmgr.LoadLevelMakerInfo()             |
|     |-- Update() --------> reads spawnmgr.curshape -> ShapeController (isselected, isinplayfield) |
|     |                      calls LeanTwistRotateAxis.RotateMe(lte.dragdelta)                      |
|     |                      calls spawnmgr.CalculateCurShapePenetration()                          |
|     v                                                                                             |
|   [LevelManager.cs] <======(Bidirectional Inspector & Call Coupling)======> [SpawnManager.cs]     |
|     |-- LoadLevelInfo() -> spawnmgr.numshapes = ...                           |-- SpawnPlatform() |
|     |                      spawnmgr.SpawnPlatform()                           |-- SpawnShapes()   |
|     |                      spawnmgr.SpawnShapes()                             |-- UpdateStackInfo |
|     |-- Update() --------> spawnmgr.UpdateUIText()                            |     |             |
|     |                      scoremgr.CalculatePlayerScore()                    |     +-> lvlmgr.   |
|     |-- CheckPlayThreshold() -> GameObject.FindGameObjectsWithTag("Shape")    |         SetLevel  |
|     |                           sc.CancelInvoke() / sc.PlayParticles()        |         PlayState |
+---------------------------------------------------------------------------------------------------+
```

---

### B.3 Spawner, Physics Colliders & Static Event Architecture
Two static C# events (`ShapeController.collisionEvent` and `FloorColliderController.levelstatusEvent`) drive the stack validation and lose-state transitions (**Confirmed from companion docs**):

```text
+---------------------------------------------------------------------------------------------------+
|                         STATIC EVENT & PHYSICS COLLIDER INTERACTION FLOW                          |
|                                                                                                   |
|  1. DOCK INITIALIZATION & LOOKUP                                                                  |
|     [DockColliderController.Start()] ---(W: spawnmgr.dockloc = transform.position.y)-----------+  |
|     [ShapeController.Start()] ---------(G: GameObject.Find("DockCollider").GetComponent)-------+  |
|                                                                                                |  |
|  2. PLATFORM SPAWN & LANDING                                                                   v  |
|     [SpawnManager.SpawnPlatform()] ----(C;W: instantiates & configures)---> [PlatformController]  |
|     [PlatformController.Start()] ------(G;R: FindObjectOfType<SpawnManager>().platmats[idx])      |
|     [PlatformController.OnCollisionEnter()] ---(G;W: sc.istouching = true)-> [ShapeController]    |
|                                                                                                   |
|  3. SHAPE COLLISION STATIC EVENT (Stack Validation)                                               |
|     [ShapeController.OnCollisionEnter()]                                                          |
|        |-- (C: spawnmgr.UpdateSpawnInfo(this.gameObject, other.gameObject))                       |
|        +-- (E: emits static ShapeController.collisionEvent)                                       |
|                   |                                                                               |
|                   v (S: subscribed in SpawnManager.OnEnable / -= OnDisable)                       |
|            [SpawnManager.UpdateStackInformation()]                                                |
|                   |-- (G;W: instantiates DamagePopup via DoFloatingText)                          |
|                   +-- (C: calls lvlmgr.SetLevelPlayState(LEVELPLAYSTATE.STACKED))                 |
|                                                                                                   |
|  4. FLOOR COLLISION STATIC EVENT (Lose Condition)                                                 |
|     [FloorColliderController.OnCollisionEnter()]                                                  |
|        |-- (G: checks other.gameObject.GetComponent<ShapeController>())                           |
|        |-- (C: other.transform.DOKill())                                                          |
|        |-- (C: gamemgr.camctlr.ShakeStaticCamera(0.5f, 2f, 2f))                                   |
|        +-- (E: emits static FloorColliderController.levelstatusEvent(1))                          |
|                   |                                                                               |
|                   v (S: subscribed in LevelManager.OnEnable / -= OnDisable)                       |
|            [LevelManager.UpdateLevelStatus(int status)]                                           |
|                   +-- (W: sets uimgr.losegameui.SetActive(true) & curlevelplaystate = LOST)       |
+---------------------------------------------------------------------------------------------------+
```


---

## Section C: External, Plugin & Unity Dependency Overview (ASCII-Art Diagrams)

### C.1 External Plugin, Package & Engine Dependency Tree
All 27 internal scripts connect to **16 external targets** across 4 external categories (`EXT-PROJ`, `EXT-PLUGIN`, `EXT-UPKG`, `EXT-UNITY`) via **48 confirmed external edges** (**Confirmed from companion docs**):

```text
+===================================================================================================+
|                      EXTERNAL, THIRD-PARTY PLUGIN & UNITY ENGINE BOUNDARY MAP                     |
+===================================================================================================+
|                                                                                                   |
|  [EXT-PROJ: Non-Folder Project Extensions]                                                        |
|    +-- Lean.Touch.LeanTouchEvents        <--- (D;R: dragdelta) ------------ [GameManager.cs]      |
|    +-- Lean.Touch.LeanTwistRotateAxis    <--- (G;C: RotateMe) ------------- [GameManager.cs]      |
|                                          <--- (G;W: enabled toggle) ------- [ShapeController.cs]  |
|                                                                                                   |
|  [EXT-PLUGIN: Third-Party Asset Store Plugins]                                                    |
|    +-- DG.Tweening (DOTween)             <--- (C: DOKill) ----------------- [FloorCollider...]    |
|                                          <--- (D: using directive) -------- [LevelManager.cs]     |
|                                          <--- (C: DOMove/Scale/Rotate/Fade) [ShapeController.cs]  |
|                                          <--- (C: DOPunchScale/DOKill) ---- [SpawnManager.cs]     |
|    +-- Lean.Touch (Core & Selectable)    <--- (D;G;C;R;W: OnFingerUp/Down)- [ShapeController.cs]  |
|                                          <--- (G;W: Deselect) ------------- [SpawnManager.cs]     |
|    +-- EPOOutline (Outlinable)           <--- (G;W: OutlineParameters) ---- [ShapeController.cs]  |
|    +-- Exploder.Utils (MeshExploder)     <--- (C: ExplodeCracked) --------- [SpawnManager.cs]     |
|    +-- CircularGravityForce (CGF)        <--- (G;W: Enable, Size) --------- [SpawnManager.cs]     |
|                                                                                                   |
|  [EXT-UPKG: Unity Official Packages]                                                              |
|    +-- TMPro (TMP_Text)                  <--- (G: RequireComponent) ------- [DamagePopup.cs]      |
|                                          <--- (D;W: UI counters) ---------- [LevelManager.cs]     |
|                                          <--- (D;W: shapesleft/penetration) [SpawnManager.cs]     |
|                                          <--- (D;W: coins/score/stars) ---- [UIManager.cs]        |
|    +-- UnityEngine.UI & EventSystems     <--- (I: UIBehaviour/PointerDown)- [AnimatedButton.cs]   |
|                                          <--- (D;W: legacy Text) ---------- [DurationScale.cs]    |
|                                          <--- (D;W: debug Text) ----------- [GameManager.cs]      |
|                                          <--- (D;W: legacy Text) ---------- [LevelManager.cs]     |
|                                          <--- (D;W: legacy Text) ---------- [ScoreEffect.cs]      |
|                                          <--- (D;W: legacy Text) ---------- [SpawnManager.cs]     |
|    +-- UnityEngine.Analytics             <--- (C?: commented-out stub) ---- [RdWAnalytics.cs]     |
|                                                                                                   |
|  [EXT-UNITY: Unity Engine Core Subsystems]                                                        |
|    +-- Physics (Rigidbody/Collider/Ray)  <--- [FloorCollider], [PlatformController],              |
|                                               [ShapeController], [SpawnManager]                   |
|    +-- PlayerPrefs (10 Unencrypted Keys) <--- [GameManager], [LevelManager], [ScoreManager],      |
|                                               [Game/RdWUtilities], [Game/SoundManager]            |
|    +-- AudioSource / AudioClip           <--- [LevelInfo (unused)], [Game/Sound], [SoundManager]  |
|    +-- ParticleSystem / Renderer / Mat   <--- [LevelInfo], [PlatformController],                  |
|                                               [ShapeController], [Game/EffectManager]             |
|    +-- Animator / Camera                 <--- [AnimatedButton], [CameraController], [UIManager]   |
|    +-- SceneManager / UnityWebRequest    <--- [Game/RdWUtilities]                                 |
+===================================================================================================+
```

---

### C.2 `PlayerPrefs` Persistence Ownership & Collision Matrix
Five scripts read and write **10 distinct `PlayerPrefs` keys** directly without a centralized persistence abstraction (**Confirmed from companion docs**). Two keys (`LevelScore-N` and `LevelStars-N`) experience **split-brain write hazards** between [`LevelManager.cs`](./LevelManager.cs.md) and [`ScoreManager.cs`](./ScoreManager.cs.md):

| `PlayerPrefs` Key Pattern | Data Type | Reader Script(s) | Writer Script(s) | Architectural Hazard / Note |
| :--- | :---: | :--- | :--- | :--- |
| `"TotalGamesPlayed"` | `int` | [`GameManager.cs`](./GameManager.cs.md) | [`GameManager.cs`](./GameManager.cs.md) | Incremented in `GameManager.Start()` (**Confirmed from companion docs**) |
| `"CurrentLevel"` | `int` | [`LevelManager.cs`](./LevelManager.cs.md) | [`LevelManager.cs`](./LevelManager.cs.md) | Read in `GetLastPlayedLevel()`, written in `SetCurrentLevel()` (**Confirmed from companion docs**) |
| `"LevelLocked-" + i` | `int` | [`LevelManager.cs`](./LevelManager.cs.md) | [`LevelManager.cs`](./LevelManager.cs.md) | Initialized/read in `InitGameData()` (**Confirmed from companion docs**) |
| `"LevelScore-" + i` | `int` | [`LevelManager.cs`](./LevelManager.cs.md) | [`LevelManager.cs`](./LevelManager.cs.md), [`ScoreManager.cs`](./ScoreManager.cs.md) | **SPLIT-BRAIN WRITE**: Initialized in `LevelManager.InitGameData()`, overwritten in `ScoreManager.UpdateScoreAndStars()` (**Confirmed from companion docs**) |
| `"LevelStars-" + i` | `int` | [`LevelManager.cs`](./LevelManager.cs.md) | [`LevelManager.cs`](./LevelManager.cs.md), [`ScoreManager.cs`](./ScoreManager.cs.md) | **SPLIT-BRAIN WRITE**: Initialized in `LevelManager.InitGameData()`, overwritten in `ScoreManager.UpdateScoreAndStars()` (**Confirmed from companion docs**) |
| `"PlayerCoins"` | `int` | [`ScoreManager.cs`](./ScoreManager.cs.md) | [`ScoreManager.cs`](./ScoreManager.cs.md) | Read via `GetTotalPlayerCoins()`, written in `UpdatePlayerCoins()` (**Confirmed from companion docs**) |
| `"MusicPreference"` | `int` | [`Game/SoundManager.cs`](./Game/SoundManager.cs.md) | [`Game/SoundManager.cs`](./Game/SoundManager.cs.md) | Controls mute state (`1` = on, `0` = muted) (**Confirmed from companion docs**) |
| `"SoundPreference"` | `int` | [`Game/SoundManager.cs`](./Game/SoundManager.cs.md) | [`Game/SoundManager.cs`](./Game/SoundManager.cs.md) | Controls SFX mute state (`1` = on, `0` = muted) (**Confirmed from companion docs**) |
| `"FirstLaunch"` | `int` | [`Game/RdWUtilities.cs`](./Game/RdWUtilities.cs.md) | [`Game/RdWUtilities.cs`](./Game/RdWUtilities.cs.md) | Checked/set (`0`) in `MarkFirstLaunch()` (**Confirmed from companion docs**) |
| `"NextRewardTime"` | `string` | [`Game/RdWUtilities.cs`](./Game/RdWUtilities.cs.md) | [`Game/RdWUtilities.cs`](./Game/RdWUtilities.cs.md) | Stores `DateTime.ToBinary()` for daily reward cooldown (**Confirmed from companion docs**) |

---

## Section D: Subsystem Dependency Maps

### D.1 `SUB-CORE` — Core Gameplay, Physics & Spawner Subsystem (6 Scripts)
**Member Scripts:** [`GameManager.cs`](./GameManager.cs.md), [`SpawnManager.cs`](./SpawnManager.cs.md), [`ShapeController.cs`](./ShapeController.cs.md), [`PlatformController.cs`](./PlatformController.cs.md), [`DockColliderController.cs`](./DockColliderController.cs.md), [`FloorColliderController.cs`](./FloorColliderController.cs.md).

```text
+---------------------------------------------------------------------------------------------------+
|                         SUB-CORE INTERNAL & CROSS-SUBSYSTEM BOUNDARY MAP                          |
|                                                                                                   |
|   [DockColliderController] ---(D;W: dockloc)---> [SpawnManager] <---(D;G;R)--- [PlatformController]
|             ^                                       |      ^                          |           |
|             | (G: Find("DockCollider"))             |      | (D;G;C;R;W;E/S)          | (G;W)     |
|             +---------------------------------------+      v                          |           |
|                                              [ShapeController] <----------------------+           |
|                                                 ^         ^                                       |
|                         (R: curshape fields)    |         | (G: GetComponent<ShapeController>)    |
|                                                 |         |                                       |
|   [GameManager] -------------------------------+         +--- [FloorColliderController]          |
|     |       ^                                                     |              |                |
|     |       +---------------------(D;R: gamemgr.camctlr)----------+              |                |
|     +---(D;C;R;W)---> [SpawnManager]                                             |                |
|                                                                                  |                |
|   CROSS-SUBSYSTEM OUTBOUND EDGES FROM SUB-CORE:                                  |                |
|     * GameManager ------------(D;C)-----------> [SUB-PROG: LevelManager]         |                |
|     * GameManager ------------(D)-------------> [SUB-UI: CameraController]       |                |
|     * SpawnManager -----------(D;C;R)---------> [SUB-PROG: LevelManager]         |                |
|     * SpawnManager -----------(D;C)-----------> [SUB-PROG: ScoreManager]         |                |
|     * SpawnManager -----------(R;W / D;R;W)---> [SUB-PROG: LevelData, LevelInfo] |                |
|     * SpawnManager -----------(G;W)-----------> [SUB-UI: DamagePopup]            |                |
|     * FloorColliderController -(E: event)-----> [SUB-PROG: LevelManager] <-------+                |
|     * FloorColliderController -(C: Shake)-----> [SUB-UI: CameraController] <-----+                |
+---------------------------------------------------------------------------------------------------+
```

**Subsystem Analysis (**Confirmed from companion docs**):**
- **Internal Cohesion:** `13` internal edges stay completely inside `SUB-CORE`.
- **Outbound Coupling:** `9` confirmed edges cross from `SUB-CORE` into `SUB-PROG` (`6` edges) and `SUB-UI` (`3` edges).
- **Primary Architectural Bottleneck:** [`SpawnManager.cs`](./SpawnManager.cs.md) mixes scene prefab instantiation, `Physics.ComputePenetration` validation, UI text updates (`shapesleft`, `penetration`), floating text spawning (`DamagePopup`), and data model declarations (`ShapeInfo`, `PlatformInfo`).

---

### D.2 `SUB-PROG` — Level Progression, Data Model & Scoring Subsystem (8 Scripts)
**Member Scripts:** [`LevelManager.cs`](./LevelManager.cs.md), [`ScoreManager.cs`](./ScoreManager.cs.md), [`LevelData.cs`](./LevelData.cs.md), [`LevelInfo.cs`](./LevelInfo.cs.md), [`LevelMakerData.cs`](./LevelMakerData.cs.md), [`LevelStatus.cs`](./LevelStatus.cs.md), [`WorldData.cs`](./WorldData.cs.md), [`WorldInfo.cs`](./WorldInfo.cs.md).

```text
+---------------------------------------------------------------------------------------------------+
|                         SUB-PROG INTERNAL & CROSS-SUBSYSTEM BOUNDARY MAP                          |
|                                                                                                   |
|                       +-----------------> [LevelManager.cs] <-----------------+                   |
|                       |                    /   |   |   \   \                  |                   |
|           (D;C;R)     |        +----------+    |   |    \   +---------+       | (D;C;R)           |
|                       |        |               |   |     \            |       |                   |
|                       v        v               |   |      v           v       |                   |
|   [ScoreManager.cs] --+--> [LevelData.cs] <----+   |  [WorldData]  [LevelMakerData.cs]            |
|          |                    |     |              |      |          /    |    \                  |
|          | (R)        (D;C;R;W)     | (W)          |      | (D;C;W) /     |     \ (W)             |
|          +------------+       |     |   +----------+      v        /      |      +-----+          |
|                       v       v     |   v          |  [WorldInfo] /       |            |          |
|                     [LevelInfo.cs]  |   |          |      ^      /        | (R;W)      |          |
|                        |      ^     |   |          +------+     /         |            |          |
|                  (D;C) |      +-----+---|----------------------+          |            |          |
|                        v                v                                 v            v          |
|                     [LevelStatus.cs] <--+---------------------------------+------------+          |
|                                                                                                   |
|   CROSS-SUBSYSTEM OUTBOUND EDGES FROM SUB-PROG:                                                   |
|     * LevelManager ----(S)---------> [SUB-CORE: FloorColliderController]                          |
|     * LevelManager ----(D;C)-------> [SUB-CORE: GameManager]                                      |
|     * LevelManager ----(G;C;W)-----> [SUB-CORE: ShapeController]                                  |
|     * LevelManager ----(D;C;W)-----> [SUB-CORE: SpawnManager]                                     |
|     * LevelManager ----(D;R;W)-----> [SUB-UI: UIManager]                                          |
|     * ScoreManager ----(D;R;W)-----> [SUB-CORE: SpawnManager (ShapeInfo)]                         |
|     * LevelData -------(C;W)-------> [SUB-CORE: SpawnManager (ShapeInfo, PlatformInfo)]           |
|     * LevelInfo -------(D;R)-------> [SUB-CORE: SpawnManager (ShapeInfo, PlatformInfo)]           |
|     * LevelMakerData --(C;W)-------> [SUB-CORE: SpawnManager (ShapeInfo, PlatformInfo)]           |
+---------------------------------------------------------------------------------------------------+
```

**Subsystem Analysis (**Confirmed from companion docs**):**
- **Internal Cohesion:** `18` confirmed edges link the 8 progression scripts internally.
- **Co-Declaration Coupling Tax:** Because `ShapeInfo` and `PlatformInfo` are declared inside [`SpawnManager.cs`](./SpawnManager.cs.md), four pure progression/data classes (`LevelData`, `LevelInfo`, `LevelMakerData`, `ScoreManager`) are forced to depend on `SpawnManager.cs` (`SUB-CORE`). Extracting `ShapeInfo` and `PlatformInfo` into standalone files eliminates `4` cross-subsystem edges immediately.

---

### D.3 `SUB-UI` — UI Presentation, Camera & Scene Entry Subsystem (7 Scripts)
**Member Scripts:** [`UIManager.cs`](./UIManager.cs.md), [`AnimatedButton.cs`](./AnimatedButton.cs.md), [`CameraController.cs`](./CameraController.cs.md), [`DamagePopup.cs`](./DamagePopup.cs.md), [`DurationScale.cs`](./DurationScale.cs.md), [`ScoreEffect.cs`](./ScoreEffect.cs.md), [`Loader.cs`](./Loader.cs.md).

```text
+---------------------------------------------------------------------------------------------------+
|                          SUB-UI INTERNAL & CROSS-SUBSYSTEM BOUNDARY MAP                           |
|                                                                                                   |
|   [AnimatedButton.cs] ---(D;E?: PlayButtonPressed)---> [UIManager.cs] <---(D)--- [Loader.cs]      |
|                                                         /    |    \               /       \       |
|                                               (D;C)    /     |     \ (R)     (D) /         \ (D)  |
|                                                       v      v      v           v           v     |
|                                              [GameManager] [LevelManager] [LevelData / WorldData] |
|                                                                                                   |
|   PASSIVE / LEAF UI TARGETS:                                                                      |
|     * [CameraController.cs] <--- Inbound from GameManager (D), FloorCollider (C), EffectMgr (D)   |
|     * [DamagePopup.cs]      <--- Inbound from SpawnManager (G;W)                                  |
|     * [DurationScale.cs]    --- Standalone UI Lerp Counter (Fan-Out: 0, Fan-In: 0)                |
|     * [ScoreEffect.cs]      --- Standalone UI Lerp Counter (Fan-Out: 0, Fan-In: 0)                |
+---------------------------------------------------------------------------------------------------+
```

---

### D.4 `SUB-SVC` — Audio, App Lifecycle, Utilities & Analytics Subsystem (6 Scripts)
**Member Scripts:** [`Game/AppInfo.cs`](./Game/AppInfo.cs.md), [`Game/EffectManager.cs`](./Game/EffectManager.cs.md), [`Game/RdWUtilities.cs`](./Game/RdWUtilities.cs.md), [`Game/Sound.cs`](./Game/Sound.cs.md), [`Game/SoundManager.cs`](./Game/SoundManager.cs.md), [`RdWAnalytics.cs`](./RdWAnalytics.cs.md).

```text
+---------------------------------------------------------------------------------------------------+
|                          SUB-SVC INTERNAL & CROSS-SUBSYSTEM BOUNDARY MAP                          |
|                                                                                                   |
|   [Game/RdWUtilities.cs] ---(R: AppInfo.Instance)-----------> [Game/AppInfo.cs]                   |
|            |                                                                                      |
|            +----------------(C;R: PlaySound(buttonClick))---> [Game/SoundManager.cs]              |
|            |                                                           |                          |
|            +----------------(R: Sound field)----------------> [Game/Sound.cs] <---+ (D;R;W)       |
|                                                                                                   |
|   INFERRED CROSS-SUBSYSTEM CALLERS INTO [Game/SoundManager.cs] (?):                               |
|     * [LevelManager.cs] -----------(C?)---> SoundManager.Instance.PlaySound(...)                  |
|     * [SpawnManager.cs] -----------(C?)---> SoundManager.Instance.PlaySound(...)                  |
|     * [ShapeController.cs] --------(C?)---> SoundManager.Instance.PlaySound(...)                  |
|     * [FloorColliderController.cs] -(C?)--> SoundManager.Instance.PlaySound(...)                  |
|                                                                                                   |
|   ORPHAN / STUB SCRIPTS IN SUB-SVC:                                                               |
|     * [Game/EffectManager.cs] ---(D: unused camController)---> [SUB-UI: CameraController.cs]      |
|     * [RdWAnalytics.cs]       ---(0 internal edges; commented-out UnityEngine.Analytics stub)     |
+---------------------------------------------------------------------------------------------------+
```


---

## Section E: Complete Dependency Matrices

> [!NOTE]
> **Matrix Reading Convention:** Across all matrices below, **Row (`Source Script`) depends on Column (`Target Script / External System`)**. Legend codes follow [`Scripts_Dependency_Legend.md`](./Scripts_Dependency_Legend.md): `C` = Call/Instantiate, `R` = Read, `W` = Write, `E` = Emit Event, `S` = Subscribe Event, `I` = Inherit/Implement, `G` = `GetComponent`/`Find`, `D` = Field/Property Reference, `?` = **Inferred from companion docs**. Full machine-readable exports are available in [`Scripts_Dependency_Matrix.csv`](./Scripts_Dependency_Matrix.csv) and [`Scripts_Dependency_Matrix.json`](./Scripts_Dependency_Matrix.json).

### E.1 Matrix A — Complete 27 × 27 Internal Script-to-Script Adjacency Matrix

Column headers use compact numeric indices (`01`–`27`) mapped directly to the numbered rows:

| # | Source Script (Row -> Col) | `01` | `02` | `03` | `04` | `05` | `06` | `07` | `08` | `09` | `10` | `11` | `12` | `13` | `14` | `15` | `16` | `17` | `18` | `19` | `20` | `21` | `22` | `23` | `24` | `25` | `26` | `27` | Fan-Out | Fan-In | Deg |
| :-: | :--- | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| `01` | `AnimatedButton.cs` | — | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | `D;E?` | · | · | · | · | · | · | · | **1** | **0** | **1** |
| `02` | `CameraController.cs` | · | — | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | **0** | **3** | **3** |
| `03` | `DamagePopup.cs` | · | · | — | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | **0** | **1** | **1** |
| `04` | `DockColliderController.cs` | · | · | · | — | · | · | · | · | · | · | · | · | · | · | · | · | · | · | `D;W` | · | · | · | · | · | · | · | · | **1** | **1** | **2** |
| `05` | `DurationScale.cs` | · | · | · | · | — | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | **0** | **0** | **0** |
| `06` | `FloorColliderController.cs` | · | `C` | · | · | · | — | `D;R` | · | · | · | `E` | · | · | · | · | · | · | `G` | · | · | · | · | · | · | · | · | `C?` | **4** | **1** | **5** |
| `07` | `GameManager.cs` | · | `D` | · | · | · | · | — | · | · | · | `D;C` | · | · | · | · | · | · | `R` | `D;C;R;W` | · | · | · | · | · | · | · | · | **4** | **5** | **9** |
| `08` | `LevelData.cs` | · | · | · | · | · | · | · | — | `D;C;R;W` | · | · | `W` | · | · | · | · | · | · | `C;W` | · | · | · | · | · | · | · | · | **3** | **4** | **7** |
| `09` | `LevelInfo.cs` | · | · | · | · | · | · | · | · | — | · | · | `D;C` | · | · | · | · | · | · | `D;R` | · | · | · | · | · | · | · | · | **2** | **5** | **7** |
| `10` | `LevelMakerData.cs` | · | · | · | · | · | · | · | `D;R;W` | `R;W` | — | · | `W` | · | · | · | · | · | · | `C;W` | · | · | · | · | · | · | · | · | **4** | **1** | **5** |
| `11` | `LevelManager.cs` | · | · | · | · | · | `S` | `D;C` | `D;C;R;W` | `D;R` | `D;C` | — | `R;W` | · | · | · | · | `D;C;R` | `G;C;W` | `D;C;W` | `D;R;W` | `D;C;R` | `D;R` | · | · | · | · | `C?` | **12** | **6** | **18** |
| `12` | `LevelStatus.cs` | · | · | · | · | · | · | · | · | · | · | · | — | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | **0** | **4** | **4** |
| `13` | `Loader.cs` | · | · | · | · | · | · | `D` | · | · | · | `D` | · | — | · | · | · | · | · | · | `D` | · | · | · | · | · | · | · | **3** | **0** | **3** |
| `14` | `PlatformController.cs` | · | · | · | · | · | · | · | · | · | · | · | · | · | — | · | · | · | `G;W` | `D;G;R` | · | · | · | · | · | · | · | · | **2** | **1** | **3** |
| `15` | `RdWAnalytics.cs` | · | · | · | · | · | · | · | · | · | · | · | · | · | · | — | · | · | · | · | · | · | · | · | · | · | · | · | **0** | **0** | **0** |
| `16` | `ScoreEffect.cs` | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | — | · | · | · | · | · | · | · | · | · | · | · | **0** | **0** | **0** |
| `17` | `ScoreManager.cs` | · | · | · | · | · | · | · | · | `R` | · | `D;C;R` | · | · | · | · | · | — | · | `D;R;W` | · | · | · | · | · | · | · | · | **3** | **2** | **5** |
| `18` | `ShapeController.cs` | · | · | · | `G` | · | · | · | · | · | · | · | · | · | · | · | · | · | — | `D;G;C;R;W;E` | · | · | · | · | · | · | · | `C?` | **2** | **5** | **7** |
| `19` | `SpawnManager.cs` | · | · | `G;W` | · | · | · | `D;C` | `R;W` | `D;R;W` | · | `D;C;R` | · | · | `D;G;C;R;W` | · | · | `D;C` | `D;G;C;R;W;S` | — | · | · | · | · | · | · | · | `C?` | **8** | **9** | **17** |
| `20` | `UIManager.cs` | · | · | · | · | · | · | `D;C` | `R` | · | · | `D;C;R` | `R?` | · | · | · | · | `R?` | · | · | — | `R` | · | · | · | `C?` | · | · | **4** | **3** | **7** |
| `21` | `WorldData.cs` | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | — | `D;C;W` | · | · | · | · | · | **1** | **2** | **3** |
| `22` | `WorldInfo.cs` | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | — | · | · | · | · | · | **0** | **2** | **2** |
| `23` | `Game/AppInfo.cs` | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | — | · | · | · | · | **0** | **1** | **1** |
| `24` | `Game/EffectManager.cs` | · | `D` | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | — | · | · | · | **1** | **0** | **1** |
| `25` | `Game/RdWUtilities.cs` | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | `R` | · | — | `R` | `C;R` | **3** | **0** | **3** |
| `26` | `Game/Sound.cs` | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | — | · | **0** | **2** | **2** |
| `27` | `Game/SoundManager.cs` | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | `D;R;W` | — | **1** | **1** | **2** |

---

### E.2 Matrix B — Script-to-External Dependency Matrix (27 Scripts × 16 External Targets)

External target columns (**Confirmed from companion docs**):
- **`E01`–`E02` (`EXT-PROJ`):** `E01` = `LeanTouchEvents`, `E02` = `LeanTwistRotateAxis`
- **`E03`–`E07` (`EXT-PLUGIN`):** `E03` = `DG.Tweening (DOTween)`, `E04` = `Lean.Touch (Core/Selectable)`, `E05` = `EPOOutline`, `E06` = `Exploder.MeshExploder`, `E07` = `CircularGravityForce (CGF)`
- **`E08`–`E10` (`EXT-UPKG`):** `E08` = `TMPro (TMP_Text)`, `E09` = `UnityEngine.UI / EventSystems`, `E10` = `UnityEngine.Analytics`
- **`E11`–`E16` (`EXT-UNITY`):** `E11` = `3D Physics (Rigidbody/Collider/Ray)`, `E12` = `PlayerPrefs`, `E13` = `AudioSource / AudioClip`, `E14` = `ParticleSystem / Renderer / Material`, `E15` = `Animator / Camera`, `E16` = `SceneManager / UnityWebRequest / Application`

| # | Source Script | `E01` | `E02` | `E03` | `E04` | `E05` | `E06` | `E07` | `E08` | `E09` | `E10` | `E11` | `E12` | `E13` | `E14` | `E15` | `E16` | Ext Edges |
| :-: | :--- | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| `01` | `AnimatedButton.cs` | · | · | · | · | · | · | · | · | `I;D;C` | · | · | · | · | · | `G;C` | · | **2** |
| `02` | `CameraController.cs` | · | · | · | · | · | · | · | · | · | · | · | · | · | · | `R;W` | · | **1** |
| `03` | `DamagePopup.cs` | · | · | · | · | · | · | · | `G` | · | · | · | · | · | · | · | · | **1** |
| `04` | `DockColliderController.cs` | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | **0** |
| `05` | `DurationScale.cs` | · | · | · | · | · | · | · | · | `D;W` | · | · | · | · | · | · | · | **1** |
| `06` | `FloorColliderController.cs` | · | · | `C` | · | · | · | · | · | · | · | `C` | · | · | · | · | · | **2** |
| `07` | `GameManager.cs` | `D;R` | `G;C` | · | · | · | · | · | · | `D;W` | · | · | `C;R;W` | · | · | · | · | **4** |
| `08` | `LevelData.cs` | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | **0** |
| `09` | `LevelInfo.cs` | · | · | · | · | · | · | · | · | · | · | · | · | `D` | `D` | · | · | **2** |
| `10` | `LevelMakerData.cs` | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | **0** |
| `11` | `LevelManager.cs` | · | · | `D` | · | · | · | · | `D;W` | `D;W` | · | · | `C;R;W` | · | · | · | · | **4** |
| `12` | `LevelStatus.cs` | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | **0** |
| `13` | `Loader.cs` | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | **0** |
| `14` | `PlatformController.cs` | · | · | · | · | · | · | · | · | · | · | `C` | · | · | `G;W` | · | · | **2** |
| `15` | `RdWAnalytics.cs` | · | · | · | · | · | · | · | · | · | `C?` | · | · | · | · | · | · | **1** |
| `16` | `ScoreEffect.cs` | · | · | · | · | · | · | · | · | `D;W` | · | · | · | · | · | · | · | **1** |
| `17` | `ScoreManager.cs` | · | · | · | · | · | · | · | · | · | · | · | `C;R;W` | · | · | · | · | **1** |
| `18` | `ShapeController.cs` | · | `G;W` | `C` | `D;G;C;R;W;S` | `G;W` | · | · | · | · | · | `G;C;R;W` | · | · | `D;G;C;W` | · | · | **6** |
| `19` | `SpawnManager.cs` | · | · | `C` | `G;W` | · | `G;C;W` | `G;W` | `D;W` | `D;W` | · | `G;C;R;W` | · | · | `D;G;W` | · | · | **8** |
| `20` | `UIManager.cs` | · | · | · | · | · | · | · | `D;W` | · | · | · | · | · | · | `D` | · | **2** |
| `21` | `WorldData.cs` | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | **0** |
| `22` | `WorldInfo.cs` | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | **0** |
| `23` | `Game/AppInfo.cs` | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | `C` | **1** |
| `24` | `Game/EffectManager.cs` | · | · | · | · | · | · | · | · | · | · | · | · | · | `D;C` | · | · | **1** |
| `25` | `Game/RdWUtilities.cs` | · | · | · | · | · | · | · | · | · | · | · | `C;R;W` | · | · | · | `C` | **2** |
| `26` | `Game/Sound.cs` | · | · | · | · | · | · | · | · | · | · | · | · | `D` | · | · | · | **1** |
| `27` | `Game/SoundManager.cs` | · | · | · | · | · | · | · | · | · | · | · | `C;R;W` | `D;G;C;R;W` | · | · | `C` | **3** |
| **Σ** | **External Target Totals** | **1** | **2** | **4** | **2** | **1** | **1** | **1** | **4** | **6** | **1** | **4** | **5** | **3** | **5** | **3** | **3** | **46 (+2 `MonoBehaviour`)** |

---

### E.3 Matrix C — Hub & Blast-Radius Risk Summary (Ranked by Total Degree)

| Rank | Script | Subsystem | Confirmed Fan-Out | Confirmed Fan-In | Total Degree | Inferred Edges (`?`) | External Edges | Risk Tier | Blast-Radius & Refactoring Sensitivity Summary |
| :-: | :--- | :---: | :-: | :-: | :-: | :-: | :-: | :---: | :--- |
| 1 | [`LevelManager.cs`](./LevelManager.cs.md) | `SUB-PROG` | 12 | 6 | **18** | +1 (`SoundManager?`) | 4 | **Tier 1** | **Supreme God-Class Hub.** Orchestrates `LevelData`, `WorldData`, `LevelMakerData`, `SpawnManager`, `ScoreManager`, `UIManager`, `ShapeController`, and `PlayerPrefs`. |
| 2 | [`SpawnManager.cs`](./SpawnManager.cs.md) | `SUB-CORE` | 8 | 9 | **17** | +1 (`SoundManager?`) | 8 | **Tier 1** | **Physics & Co-Declared Type Hub.** Hosts `ShapeInfo` & `PlatformInfo`, inflating Fan-In from 4 progression scripts (`LevelData`, `LevelInfo`, `LevelMakerData`, `ScoreManager`). |
| 3 | [`GameManager.cs`](./GameManager.cs.md) | `SUB-CORE` | 4 | 5 | **9** | 0 | 4 | **Tier 1** | **Top-Level Coordinator.** Mutates `SpawnManager` fields directly (`curlevel`, `ctrlscheme`) and polls `curshape` every frame in `Update()`. |
| 4 | [`ShapeController.cs`](./ShapeController.cs.md) | `SUB-CORE` | 2 | 5 | **7** | +1 (`SoundManager?`) | 6 | **Tier 1** | **Core Physics Actor.** Emits static `collisionEvent`, uses `FindObjectOfType<SpawnManager>()` and `GameObject.Find("DockCollider")`, and binds 5 external plugins/subsystems. |
| 5 | [`LevelData.cs`](./LevelData.cs.md) | `SUB-PROG` | 3 | 4 | **7** | 0 | 0 | **Tier 2** | **Hardcoded Level Repository.** Allocates 60 `LevelInfo` slots (`li[0..1]` populated) and constructs `ShapeInfo` / `PlatformInfo` instances. |
| 6 | [`LevelInfo.cs`](./LevelInfo.cs.md) | `SUB-PROG` | 2 | 5 | **7** | 0 | 2 | **Tier 2** | **Core Level Data Node.** Read/written by `LevelData`, `LevelMakerData`, `LevelManager`, `ScoreManager`, and `SpawnManager`. |
| 7 | [`UIManager.cs`](./UIManager.cs.md) | `SUB-UI` | 4 | 3 | **7** | +3 (`LevelStatus?`, `ScoreMgr?`, `RdWUtil?`) | 2 | **Tier 2** | **UI Presentation Hub.** Reaches across `LevelManager.ld` and `LevelManager.wd` to display completed levels/worlds; mutated directly by `LevelManager` (`wingameui`, `losegameui`). |
| 8 | [`FloorColliderController.cs`](./FloorColliderController.cs.md) | `SUB-CORE` | 4 | 1 | **5** | +1 (`SoundManager?`) | 2 | **Tier 2** | **Lose-State Trigger.** Emits static `levelstatusEvent` and chains `gamemgr.camctlr.ShakeStaticCamera()`. |
| 9 | [`ScoreManager.cs`](./ScoreManager.cs.md) | `SUB-PROG` | 3 | 2 | **5** | +1 (`UIManager?`) | 1 | **Tier 2** | **Scoring & Persistence Service.** Bidirectional loop with `LevelManager`; shares `PlayerPrefs` write ownership of `LevelScore-N` and `LevelStars-N`. |
| 10 | [`LevelMakerData.cs`](./LevelMakerData.cs.md) | `SUB-PROG` | 4 | 1 | **5** | 0 | 0 | **Tier 3** | **Sandbox Level Builder.** Mutates `LevelData.li[0]` via `ref LevelData` parameter. |
| 11 | [`LevelStatus.cs`](./LevelStatus.cs.md) | `SUB-PROG` | 0 | 4 | **4** | +1 (`UIManager?`) | 0 | **Tier 3** | **Pure Data Model.** Passive state container (`islocked`, `stars`, `score`). |
| 12 | [`CameraController.cs`](./CameraController.cs.md) | `SUB-UI` | 0 | 3 | **3** | 0 | 1 | **Tier 3** | **Passive Camera Utility.** Referenced by `GameManager`, `FloorColliderController`, and `Game/EffectManager`. |
| 13 | [`PlatformController.cs`](./PlatformController.cs.md) | `SUB-CORE` | 2 | 1 | **3** | 0 | 2 | **Tier 2** | **Physics Base Platform.** Uses `FindObjectOfType<SpawnManager>()` in `Start()` and mutates `ShapeController.istouching` on collision. |
| 14 | [`WorldData.cs`](./WorldData.cs.md) | `SUB-PROG` | 1 | 2 | **3** | 0 | 0 | **Tier 3** | **World Container.** Allocates `WorldInfo[4]`. |
| 15 | [`Loader.cs`](./Loader.cs.md) | `SUB-UI` | 3 | 0 | **3** | 0 | 0 | **Tier 3** | **Dormant Skeleton.** Declares `gm`, `lm`, `um` fields with empty `Awake()`/`Start()`. |
| 16 | [`Game/RdWUtilities.cs`](./Game/RdWUtilities.cs.md) | `SUB-SVC` | 3 | 0 | **3** | +1 (`UIManager?`) | 2 | **Tier 3** | **Service Utility Facade.** Calls `AppInfo.Instance` and `SoundManager.Instance`. |
| 17 | [`DockColliderController.cs`](./DockColliderController.cs.md) | `SUB-CORE` | 1 | 1 | **2** | 0 | 0 | **Tier 3** | **Dock Marker.** Writes `spawnmgr.dockloc` in `Start()`; looked up by name `"DockCollider"` in `ShapeController`. |
| 18 | [`WorldInfo.cs`](./WorldInfo.cs.md) | `SUB-PROG` | 0 | 2 | **2** | 0 | 0 | **Tier 3** | **Pure Data Model.** Passive world metadata container. |
| 19 | [`Game/Sound.cs`](./Game/Sound.cs.md) | `SUB-SVC` | 0 | 2 | **2** | 0 | 1 | **Tier 3** | **Audio Data Wrapper.** Serializable `AudioClip` + concurrency counter. |
| 20 | [`Game/SoundManager.cs`](./Game/SoundManager.cs.md) | `SUB-SVC` | 1 | 1 | **2** | +4 (`LevelMgr?`, `SpawnMgr?`, `Shape?`, `Floor?`) | 3 | **Tier 3** | **Persistent Audio Singleton.** 1 confirmed caller (`RdWUtilities`) + 4 inferred gameplay callers. |
| 21 | [`AnimatedButton.cs`](./AnimatedButton.cs.md) | `SUB-UI` | 1 | 0 | **1** | 0 | 2 | **Tier 3** | **Custom UI Button.** Holds `public UIManager uimgr` and dispatches `m_OnClick`. |
| 22 | [`DamagePopup.cs`](./DamagePopup.cs.md) | `SUB-UI` | 0 | 1 | **1** | 0 | 1 | **Tier 3** | **Floating Text Component.** Instantiated and configured by `SpawnManager.DoFloatingText()`. |
| 23 | [`Game/AppInfo.cs`](./Game/AppInfo.cs.md) | `SUB-SVC` | 0 | 1 | **1** | 0 | 1 | **Tier 3** | **App Metadata Singleton.** Read by `Game/RdWUtilities`. |
| 24 | [`Game/EffectManager.cs`](./Game/EffectManager.cs.md) | `SUB-SVC` | 1 | 0 | **1** | 0 | 1 | **Tier 4** | **Dormant Particle Manager.** Holds unused `camController` reference; 0 callers in corpus. |
| 25 | [`DurationScale.cs`](./DurationScale.cs.md) | `SUB-UI` | 0 | 0 | **0** | 0 | 1 | **Tier 4** | **Isolated Leaf.** Standalone `UnityEngine.UI.Text` Lerp counter. |
| 26 | [`ScoreEffect.cs`](./ScoreEffect.cs.md) | `SUB-UI` | 0 | 0 | **0** | 0 | 1 | **Tier 4** | **Isolated Leaf.** Standalone `UnityEngine.UI.Text` Lerp counter. |
| 27 | [`RdWAnalytics.cs`](./RdWAnalytics.cs.md) | `SUB-SVC` | 0 | 0 | **0** | 0 | 1 | **Tier 4** | **Orphaned Stub.** All `Analytics.CustomEvent` bodies are commented out. |

---

## Section F: Hub / High-Risk Script Profiles & Cyclic Dependency Analysis

### F.1 Cyclic Dependency Clusters (**Confirmed from companion docs**)
1. **Cycle Cluster 1 — Core Gameplay Manager Triad (`GameManager` <-> `LevelManager` <-> `SpawnManager`):**
   - `GameManager` <-> `LevelManager`: `GameManager` calls `lvlmgr.GetLastPlayedLevel()`, `LoadLevelInfo()`, and `LoadLevelMakerInfo()`; `LevelManager` holds `public GameManager gamemgr` and calls `gamemgr.SetGameState()`.
   - `GameManager` <-> `SpawnManager`: `GameManager` mutates `spawnmgr.curlevel`, `spawnmgr.ctrlscheme`, and calls `CalculateCurShapePenetration()`; `SpawnManager` holds `public GameManager gamemgr` and calls `gamemgr.GetGameState()`.
   - `LevelManager` <-> `SpawnManager`: `LevelManager` mutates `spawnmgr.numshapes`, `spawnmgr.curlevel`, and calls `SpawnPlatform()`, `SpawnShapes()`, `UpdateUIText()`; `SpawnManager` calls `lvlmgr.GetCurrentLevelInfo()` and `lvlmgr.SetLevelPlayState()`.
2. **Cycle Cluster 2 — Spawner-Actor Runtime Loop (`SpawnManager` <-> `ShapeController` & `PlatformController`):**
   - `SpawnManager` instantiates and configures `ShapeController` and `PlatformController`, and subscribes to `ShapeController.collisionEvent`.
   - `ShapeController` and `PlatformController` both call `FindObjectOfType<SpawnManager>()` at runtime (`G`), read `SpawnManager` arrays (`platmats`), and call `spawnmgr.UpdateSpawnInfo()`.
3. **Cycle Cluster 3 — Progression-Scoring Loop (`LevelManager` <-> `ScoreManager`):**
   - `LevelManager` calls `scoremgr.CalculatePlayerScore()` every frame in `Update()`, plus `UpdateScoreAndStars()` and `GetTotalPlayerCoins()`.
   - `ScoreManager` holds `public LevelManager lvlmgr` and calls `lvlmgr.GetCurrentLevel()` and reads `lvlmgr.curlevelinfo`.

---

### F.2 Top 4 Tier-1 Hub Profiles (**Confirmed from companion docs**)
- **[`LevelManager.cs`](./LevelManager.cs.md) (`Degree = 18`):** Combines 5 distinct responsibilities: (1) level/world repository initialization (`InitGameData`), (2) `PlayerPrefs` save/load (`LevelScore-i`, `LevelStars-i`, `LevelLocked-i`, `CurrentLevel`), (3) per-frame score and timer polling (`Update`), (4) scene-wide tag searches (`GameObject.FindGameObjectsWithTag("Shape")` in `CheckPlayThreshold`), and (5) direct UI panel activation (`uimgr.wingameui`, `uimgr.losegameui`).
- **[`SpawnManager.cs`](./SpawnManager.cs.md) (`Degree = 17`):** Combines co-declared data classes (`ShapeInfo`, `PlatformInfo`), prefab instantiation (`SpawnPlatform`, `SpawnShapes`), physics overlap resolution (`Physics.ComputePenetration`), special shape abilities (`CircularGravityForce`, `MeshExploder`), and floating combat text (`DamagePopup`).
- **[`GameManager.cs`](./GameManager.cs.md) (`Degree = 9`):** Acts as both scene state machine and per-frame touch-rotation router (`LeanTouchEvents.dragdelta` -> `LeanTwistRotateAxis.RotateMe`).
- **[`ShapeController.cs`](./ShapeController.cs.md) (`Degree = 7`):** Couples touch input (`LeanSelectable`), outline rendering (`EPOOutline.Outlinable`), tweening (`DOTween`), physics raycasting, particle systems, and static event broadcasting (`collisionEvent`).

---

## Section G: Ambiguities, Inter-Doc Discrepancies & Unresolved Links

### G.1 Inter-Doc Reconciliation Ledger (`Confirmed` vs. `Inferred`)
During Phase 0 and Phase 4 cross-verification, **7 inter-document discrepancies** were identified between `Scripts_Master_Index.md`, individual `.cs.md` prose sections, and embedded C# code blocks:

| # | Source -> Target | Discrepancy Description | Assigned Label | Resolution & Ground Truth Note |
| :-: | :--- | :--- | :---: | :--- |
| 1 | `UIManager.cs` -> `LevelStatus.cs`, `ScoreManager.cs`, `Game/RdWUtilities.cs` | [`Scripts_Master_Index.md`](./Scripts_Master_Index.md) (lines 483–489) and [`UIManager.cs.md`](./UIManager.cs.md) narrative describe `SelectMenu(GameObject)` and direct reads of `LevelStatus`, `ScoreManager`, and `RdWUtilities`. However, the embedded C# code in `UIManager.cs.md` only calls `gamemgr` and `lvlmgr` (`ld.completedlevels`, `wd.completedworlds`). | **Inferred from companion docs** (`?`) | Recorded as `R?` / `C?` in Matrix A (`UIManager` row) so both the architectural narrative and exact code implementation are preserved transparently. |
| 2 | `SpawnManager.cs` (`DoPointerDown` / `DoPointerUp`) | [`Scripts_Master_Index.md`](./Scripts_Master_Index.md) (lines 464–469) attributes `DoPointerDown()` and `DoPointerUp()` to `SpawnManager`. In [`SpawnManager.cs.md`](./SpawnManager.cs.md) and [`ShapeController.cs.md`](./ShapeController.cs.md), touch selection (`SelectShape`, `DeSelectShape`, `HandleFingerUp`) lives in `ShapeController.cs`. | **Inferred from companion docs** (`?`) | Attributed confirmed `Lean.Touch` event handling to `ShapeController.cs`; noted `DoPointerDown/Up` as a Master Index template artifact. |
| 3 | `LevelManager`, `SpawnManager`, `ShapeController`, `FloorCollider` -> `Game/SoundManager.cs` | [`Game/SoundManager.cs.md`](./Game/SoundManager.cs.md) ("Known Callers" section) lists `LevelManager`, `SpawnManager`, `ShapeController`, and `FloorColliderController` as callers of `SoundManager.Instance.PlaySound()`, whereas their respective `.cs.md` code blocks do not contain `SoundManager` calls (only `Game/RdWUtilities.cs.md` has a confirmed call). | **Inferred from companion docs** (`?`) | Marked all 4 gameplay-to-`SoundManager` edges as `C?` in Matrix A (`Col 27`) and excluded them from strict `Confirmed_Fan_Out` totals (`59` confirmed + `7` inferred = `66` total). |
| 4 | `Loader.cs` -> `SceneManager` / Coroutines | [`Loader.cs.md`](./Loader.cs.md) architectural prose describes asynchronous scene loading (`LoadSceneAsync`) and manager initialization, whereas its embedded code block shows only 3 field declarations (`gm`, `lm`, `um`) and empty `Awake()`/`Start()`. | **Confirmed from companion docs** (fields `D`) / **Inferred** (async loader) | Counted the 3 field declarations (`gm`, `lm`, `um`) as confirmed `D` edges; flagged async scene loading as an unimplemented design intention. |
| 5 | `LevelData.cs` (`li[1]` vs. `li[1..40]`) | [`LevelData.cs.md`](./LevelData.cs.md) prose mentions populating 40 levels across 4 worlds, while the embedded code block populates only `li[0]` (sandbox) and `li[1]` (Level 1) inside an `li[60]` array. | **Confirmed from companion docs** | Does not alter the dependency graph (`LevelData` -> `LevelInfo`, `LevelStatus`, `SpawnManager`), but documented in the profile notes. |

---

### G.2 Unresolved Scene, Prefab & Inspector Links (`Unknown from current scope`)
Because the companion docs cover `Assets/Scripts/` only and do not include `.unity` scene YAML or `.prefab` files, the following runtime bindings carry the **`Unknown from current scope`** label:
1. **Unity Scene Inspector Wiring (`Unknown from current scope`):** Exact scene GameObjects holding `GameManager`, `LevelManager`, `SpawnManager`, `ScoreManager`, `UIManager`, and `Loader`, and whether `Loader.cs` is attached to any active scene object.
2. **`UnityEvent` Persistent Listeners (`Unknown from current scope`):** Which scene methods are wired to `AnimatedButton.m_OnClick` in the Inspector (inferred to target `UIManager.PlayButtonPressed()`, `SelectPlayMode()`, `SetControlScheme()`).
3. **External `LeanTouchEvents` Source File (`Unknown from current scope`):** `LeanTouchEvents` and `LeanTwistRotateAxis` are referenced by `GameManager.cs` and `ShapeController.cs` under namespace `Lean.Touch`, residing outside `Assets/Scripts/` (classified as `EXT-PROJ`).
4. **Static Event Scene Reload Safety (`Confirmed hazard / Unknown scene lifecycle`):** `ShapeController.collisionEvent` and `FloorColliderController.levelstatusEvent` are `public static` delegates. While `SpawnManager` and `LevelManager` unsubscribe in `OnDisable()`, any custom subscriber that fails to unsubscribe across `RdWUtilities.ReloadScene()` will leak stale object references.
