# Scripts Dependency Map — ASCII Atlas & Matrices

> Balance Stack Hero · Unity 2023.1.6f1 · `Assets/Scripts` · 2026-09-23
> Totals: **29 nodes · 63 internal edges · 64 external edges**
> Plan: [Scripts_Dependency_Implementation_Plan.md](Scripts_Dependency_Implementation_Plan.md) · Interactive: [Scripts_Dependency_Showcase.html](Scripts_Dependency_Showcase.html) · Data: [CSV](Scripts_Dependency_Matrix.csv) / [JSON](Scripts_Dependency_Matrix.json) · Corpus: [Scripts_Master_Index.md](Scripts_Master_Index.md)

**Legend.** Row → column means "row depends on column". `C` calls · `R` reads · `W` writes · `E` emits event to · `S` subscribes to · `I` inherits/implements · `G` gets component / obtains reference · `D` structural (field type, construction, parameter) · `?` inferred / declared-only / ambiguous · `·` none.
**Confidence.** Every edge is **Confirmed from companion docs** (each doc's §12–§13 traces, verified against the code) unless it carries `?`, which means **Inferred from companion docs** or declared-but-unused. Anything outside `Assets/Scripts` that isn't evidenced is **Unknown from current scope**.

---

## A. Executive Summary

| Metric | Value |
|---|---|
| Scripts mapped | 27 files → **29 type nodes** (`ShapeInfo`, `PlatformInfo` split out of `SpawnManager.cs`) |
| Internal edges | **63** distinct directed script→script dependencies |
| External edges | **64** script→external-category dependencies (21 categories: 7 plugins, 2 Unity packages, 12 Unity built-ins) |
| Major hubs | **LevelManager** (in 6 / out 12), **SpawnManager** (in 5 / out 10), **GameManager** (in 5 / out 4), **ShapeController** (in 5 / out 2 + 8 external), **ScoreManager** (in 2 / out 3) |
| Most-depended-on data types | ShapeInfo (in 6), LevelInfo (in 5), LevelData / LevelStatus / PlatformInfo (in 4) |
| Isolated nodes (0 in / 0 out) | DurationScale, ScoreEffect, RdWAnalytics |
| Pure leaves (in > 0, out 0) | CameraController, DamagePopup, LevelStatus, ShapeInfo, PlatformInfo, WorldInfo, AppInfo, Sound |
| Bidirectional pairs (cycle candidates) | LM↔SM, LM↔SCM, LM↔GM, LM↔UI, LM↔FC (via event), GM↔SM, SM↔SC |
| Major subsystems | Core managers · Gameplay/physics · Data · Services (`Game/`) |
| Main risks | Tight manager cycles through Inspector fields; the SpawnManager god object; static events with no unsubscribe; project-modified Lean Touch; obsolete APIs for Unity 6 (`FindObjectOfType`, `Rigidbody.angularDrag`, legacy Input) |
| Confidence caveats | UnityEvent targets matched by method name only; external listeners of static events unknown |

---

## B. Internal Dependency Overview

### B.1 Code key
| Code | Script | Code | Script | Code | Script |
|---|---|---|---|---|---|
| `AB` | AnimatedButton | `LM` | LevelManager | `PI` | PlatformInfo |
| `CC` | CameraController | `LS` | LevelStatus | `UI` | UIManager |
| `DP` | DamagePopup | `LO` | Loader | `WD` | WorldData |
| `DC` | DockColliderController | `PC` | PlatformController | `WI` | WorldInfo |
| `DS` | DurationScale | `RA` | RdWAnalytics | `AI` | AppInfo |
| `FC` | FloorColliderController | `SE` | ScoreEffect | `EM` | EffectManager |
| `GM` | GameManager | `SCM` | ScoreManager | `RU` | RdWUtilities |
| `LD` | LevelData | `SC` | ShapeController | `SO` | Sound |
| `LI` | LevelInfo | `SM` | SpawnManager | `SDM` | SoundManager |
| `LMD` | LevelMakerData | `SI` | ShapeInfo |  |  |

### B.2 High-level internal graph (managers + key controllers)
```text
                          ┌──────────────┐
            Play (UI) ───►│  UIManager   │◄─────────── W (win/lose popups) ─────────────┐
                          └──────┬───────┘                                              │
                                 │ C StartLevel/GetCurrentLevel                         │
                                 ▼                                                      │
 [FloorColliderController]──R──►┌──────────────┐──C LoadLevel*/GetLastPlayedLevel──►┌───┴──────────┐
     │  C ShakeStaticCamera     │ GameManager  │◄──C StartLevel/Stats/SetCurrent───│ LevelManager │
     ▼                          └──┬────────┬──┘                                   └┬──┬───┬───┬──┘
 [CameraController]      R/W/C     │        │ R/G (isselected, LeanTwistRotateAxis) │  │   │   │
                        (curshape, │        ▼                                       │  │   │   │ S (levelstatusEvent)
                    penetration)   │   ┌──────────────┐                             │  │   │   └───────► [FloorColliderController]
                                   │   │ShapeController│◄──G/W/C (CheckPlayThreshold)┘  │   │
                                   ▼   └──────┬───▲───┘                                │   │ C/R (score, coins, finals)
                          ┌──────────────┐    │   │ S,G,C,W,R                          │   ▼
                          │ SpawnManager │◄───┘   │ (collisionEvent, weights, faces)   │ ┌──────────────┐
                          │ (god object) │────────┘                                    │ │ ScoreManager │
                          └──┬────┬───▲──┘◄──────── C/W (SpawnLevel, Freeze/Lock, ...)─┘ └──────┬───────┘
                             │    │   │  C/R/W (UpdateLevelStatus, UpdateLevelScore, coins) ─────►│ (via LM)
          G/C SetPlatformMat │    │   └── W dockloc ── [DockColliderController]
                             ▼    └── C AddPlayedShapeToSeq ──► ScoreManager
                    ┌──────────────────┐
                    │PlatformController│── G/W istouching ──► ShapeController
                    └──────────────────┘
```

### B.3 Data-model dependencies
```text
[LevelManager] ──D/C/R/W──► [LevelData] ──D/W──► [LevelInfo] ──D──► [ShapeInfo]
      │                         │                    ├──D──► [PlatformInfo]
      │                         ├──W──► [LevelStatus]◄┘ D
      │                         ├──D──► [ShapeInfo], [PlatformInfo]
      ├──C──► [LevelMakerData] ──W──► LevelData / LevelInfo / LevelStatus ; D──► ShapeInfo / PlatformInfo
      ├──D/R──► [WorldData] ──D/W──► [WorldInfo]
      └──D──► [WorldInfo]
[SpawnManager] ──R/W──► LevelInfo ; W──► LevelData (li[0] inserts) ; D──► ShapeInfo, PlatformInfo
[ScoreManager] ──D──► ShapeInfo ; R──► LevelInfo
[ShapeController] ──D──► ShapeInfo
[UIManager] ──R──► LevelData, WorldData
```

### B.4 Services (`Game/`) and isolated nodes
```text
[RdWUtilities] ──C/R──► [SoundManager] ──R/W──► [Sound]
       └──R──► [AppInfo]
[EffectManager] ──D?──► [CameraController]        (unused private field)
[AnimatedButton] ──D?──► [UIManager]              (unused public field)
[Loader] ──D?──► GameManager, UIManager, LevelManager   (unused public fields)
[DurationScale]  [ScoreEffect]  [RdWAnalytics]    (isolated: no edges)
```

### B.5 Event-driven edges (the only runtime pub/sub in the codebase)
```text
ShapeController ──E(collisionEvent, static)──► SpawnManager.UpdateStackInformation   [S by SpawnManager.Start]
FloorColliderController ──E(levelstatusEvent, static)──► LevelManager.UpdateLevelStatus()   [S by LevelManager.Start]
SpawnManager.touchingEvent ──(never raised)──► SpawnManager.ProcessShapeStack          [dead]
SoundManager.MusicStatusChanged / SoundStatusChanged ──► (no listeners in Assets/Scripts) [Unknown external]
```

### B.6 Cycle candidates
```text
LevelManager ⇄ SpawnManager     (SpawnLevel/Freeze/Lock  vs  UpdateLevelStatus/UpdateLevelScore/AddLevelCoins/shapemaxweight)
LevelManager ⇄ ScoreManager     (Compute/Store/Load/coins vs curlevelinfo/numlevelshapes/GetCurLevelCoinsValue)
LevelManager ⇄ GameManager      (IncrementGamesPlayed/StartLevel vs LoadLevel*/GetLastPlayedLevel)
LevelManager ⇄ UIManager        (popup SetActive vs Get* totals)
LevelManager ⇄ FloorCollider    (subscribes event vs emits event)  — event-mediated
GameManager  ⇄ SpawnManager     (curshape/penetration vs StartLevel debug restarts)
SpawnManager ⇄ ShapeController  (weights/faces/lock vs collisionEvent/lists/curshape)
Longer loop: SpawnManager → LevelManager → ScoreManager → LevelManager → SpawnManager (within a single stack update)
```

---

## C. External Dependency Overview

### C.1 External code key
| Code | External target | Class |
|---|---|---|
| `LT` | Lean Touch* | Plugin (project-modified) |
| `DT` | DOTween | Plugin |
| `EPO` | EPO Outline | Plugin |
| `MX` | MeshExploder | Plugin |
| `CGF` | CircularGravityForce | Plugin |
| `HP` | HighlightPlus | Plugin |
| `EXP` | Exploder (ns) | Plugin |
| `TMP` | TextMeshPro | Unity package |
| `UGUI` | uGUI/EventSystems | Unity package |
| `INP` | Legacy Input | Unity built-in |
| `PHY` | Physics | Unity built-in |
| `ANI` | Animator | Unity built-in |
| `AUD` | Audio | Unity built-in |
| `PP` | PlayerPrefs | Unity built-in |
| `SCN` | SceneManagement | Unity built-in |
| `APP` | Application/Networking | Unity built-in |
| `FND` | Find APIs | Unity built-in |
| `LIFE` | Instantiate/Destroy/DDOL | Unity built-in |
| `CO` | Coroutines/Invoke | Unity built-in |
| `REN` | Rendering/Camera/Material | Unity built-in |
| `PS` | ParticleSystem | Unity built-in |

`*` Lean Touch has **project-specific modifications** used by Scripts (Confirmed in plugin source): `LeanTouchEvents.dragdelta` (new field), `LeanTwistRotateAxis.RotateMe(float)` (new method), `LeanSelectable.SetOffSetValue(float)` (new method).

### C.2 Per-script external map
```text
[ShapeController]
    ├──> [Plugin*: Lean Touch]   LeanSelectable (IsSelected, enabled), LeanSelectableRendererColor, LeanTouch (Find)
    ├──> [Plugin: DOTween]       DORotateQuaternion, DOMove, DOScale, DOFade loops (EPO extension)
    ├──> [Plugin: EPO Outline]   Outlinable.enabled / OutlineParameters.Color
    ├──> [Unity: Physics]        Rigidbody, Collider.isTrigger/bounds, Physics.Raycast, OnCollisionEnter
    ├──> [Unity: Find APIs]      FindObjectOfType ×2, GameObject.Find("DockCollider")
    ├──> [Unity: Rendering]      MeshRenderer.material
    └──> [Unity: Coroutines]     Release, CheckPlayedStatus, CheckReplayStatus

[SpawnManager]
    ├──> [Plugin*: Lean Touch]   LeanSelectable.SetOffSetValue
    ├──> [Plugin: DOTween]       DOPunchScale, DOKill
    ├──> [Plugin: MeshExploder]  Explode(), minSpeed/maxSpeed/colliderThickness
    ├──> [Plugin: CGF]           CircularGravityForce.CGF.ForcePower
    ├──> [Plugin: HighlightPlus] HighlightEffect.HitFX/TargetFX (dead path)
    ├──> [Plugin: Exploder]      `using Exploder.Utils` (no symbol used) ?
    ├──> [Pkg: TextMeshPro]      TMP_Text (floating text, dead path)
    ├──> [Pkg: uGUI]             Text (level maker labels)
    ├──> [Unity: Legacy Input]   Input.GetKey ×31
    ├──> [Unity: Physics]        Physics.ComputePenetration, Bounds.Intersects
    ├──> [Unity: Find APIs]      GameObject.Find("SpawnPoint"+i / "PSpawnPoint"+i), FindGameObjectsWithTag
    ├──> [Unity: Lifecycle]      Instantiate, Destroy
    └──> [Unity: Coroutines]     CreateShapeDelay, TimedDestroy, debug coroutines

[GameManager]
    ├──> [Plugin*: Lean Touch]   LeanTouchEvents.dragdelta, LeanTwistRotateAxis.RotateMe
    ├──> [Unity: Legacy Input]   Input.GetKey(arrows)
    ├──> [Pkg: uGUI]             Text
    ├──> [Unity: PlayerPrefs]    TotalGamesPlayed
    └──> [Unity: Coroutines]     ProcessCtrlGesture

[LevelManager]  ──> TMP_Text, uGUI Text, PlayerPrefs, FindGameObjectsWithTag, Coroutines, (DOTween imported, unused ?)
[ScoreManager]  ──> PlayerPrefs
[UIManager]     ──> TMP_Text, Camera.backgroundColor, GameObject.SetActive
[FloorColliderController] ──> DOTween (DOKill), Physics (OnCollisionEnter), Destroy
[PlatformController]      ──> Physics (OnCollisionEnter), FindObjectOfType, Renderer.material
[AnimatedButton] ──> uGUI (UIBehaviour, IPointerDownHandler, UnityEvent), Animator, Invoke
[SoundManager]   ──> AudioSource, PlayerPrefs, Coroutines, DontDestroyOnLoad/DestroyImmediate
[RdWUtilities]   ──> SceneManager, Application.OpenURL, UnityWebRequest.EscapeURL, PlayerPrefs
[CameraController]/[DurationScale]/[ScoreEffect] ──> Coroutines (+ uGUI Text for the latter two)
[AppInfo]/[EffectManager] ──> DontDestroyOnLoad / Instantiate ; [DamagePopup] ──> TMP (RequireComponent)
[LevelInfo] ──> AudioSource, Material (unused fields) ; [Sound] ──> AudioClip
```

### C.3 Link-class separation
| Class | Count | Notes |
|---|---|---|
| 1. Internal script → script | 63 | Matrix A |
| 2. Script → external **project** script (outside `Assets/Scripts`, non-plugin) | **0** | none found (Confirmed) |
| 3. Script → plugin / package | 22 cells | Lean Touch 3, DOTween 4, EPO 1, MeshExploder 1, CGF 1, HighlightPlus 1, Exploder 1, TMP 4, uGUI 6 (Matrix B column totals) |
| 4. Script → Unity framework | 42 cells | Legacy Input 2, Physics 4, Animator 1, Audio 3, PlayerPrefs 5, SceneManagement 1, Application 1, Find APIs 4, Lifecycle 5, Coroutines 10, Rendering 4, ParticleSystem 2 |

---

## D. Subsystem Maps

### D.1 Core managers
```text
UIManager ──C──► GameManager ──C──► LevelManager ──C──► ScoreManager
    ▲                 ▲  │               │  ▲
    └──────W──────────┼──┼───────────────┘  │ R/C
                      └──┼──C (stats)───────┘
                         └──R/W/C──► SpawnManager (gameplay subsystem)
Loader ──D?──► GameManager / UIManager / LevelManager (unused)
```

### D.2 Gameplay / physics
```text
DockColliderController ──W dockloc──► SpawnManager
PlatformController ──G/R──► SpawnManager ; ──G/W istouching──► ShapeController
ShapeController ──G/R/W/C/E──► SpawnManager
SpawnManager ──S/G/C/W/R──► ShapeController ; ──G/C──► PlatformController
FloorColliderController ──G──► ShapeController ; ──C──► CameraController ; ──E──► LevelManager
```

### D.3 Data
```text
LevelData ─► LevelInfo ─► {ShapeInfo, PlatformInfo, LevelStatus}
LevelMakerData ─► {LevelData, LevelInfo, LevelStatus, ShapeInfo, PlatformInfo}
WorldData ─► WorldInfo
```

### D.4 Services
```text
RdWUtilities ─► SoundManager ─► Sound
RdWUtilities ─► AppInfo
EffectManager (isolated except an unused CameraController field)
```

### D.5 Per-subsystem reduced matrices
#### Core (managers)

| ↓ depends on → | **GM** | **LM** | **LO** | **SCM** | **UI** | out |
|---|---|---|---|---|---|---|
| **GM** | · | C | · | · | · | 1 |
| **LM** | C | · | · | CR | W | 3 |
| **LO** | D? | D? | · | · | D? | 3 |
| **SCM** | · | RC | · | · | · | 1 |
| **UI** | C | CR | · | · | · | 2 |
| **in** | 3 | 4 | 0 | 1 | 2 | |

#### Gameplay / physics

| ↓ depends on → | **CC** | **DC** | **FC** | **PC** | **SC** | **SM** | out |
|---|---|---|---|---|---|---|---|
| **CC** | · | · | · | · | · | · | 0 |
| **DC** | · | · | · | · | · | W | 1 |
| **FC** | C | · | · | · | G | · | 2 |
| **PC** | · | · | · | · | GW | GR | 2 |
| **SC** | · | · | · | · | · | GRWCE | 1 |
| **SM** | · | · | · | GC | SGCWR | · | 2 |
| **in** | 1 | 0 | 0 | 1 | 3 | 3 | |

#### Data

| ↓ depends on → | **LD** | **LI** | **LMD** | **LS** | **SI** | **PI** | **WD** | **WI** | out |
|---|---|---|---|---|---|---|---|---|---|
| **LD** | · | DW | · | W | D | D | · | · | 4 |
| **LI** | · | · | · | D | D | D | · | · | 3 |
| **LMD** | W | W | · | W | D | D | · | · | 5 |
| **LS** | · | · | · | · | · | · | · | · | 0 |
| **SI** | · | · | · | · | · | · | · | · | 0 |
| **PI** | · | · | · | · | · | · | · | · | 0 |
| **WD** | · | · | · | · | · | · | · | DW | 1 |
| **WI** | · | · | · | · | · | · | · | · | 0 |
| **in** | 1 | 2 | 0 | 3 | 3 | 3 | 0 | 1 | |

#### Services (Game/)

| ↓ depends on → | **AI** | **EM** | **RU** | **SO** | **SDM** | out |
|---|---|---|---|---|---|---|
| **AI** | · | · | · | · | · | 0 |
| **EM** | · | · | · | · | · | 0 |
| **RU** | R | · | · | · | CR | 2 |
| **SO** | · | · | · | · | · | 0 |
| **SDM** | · | · | · | RW | · | 1 |
| **in** | 1 | 0 | 0 | 1 | 1 | |

---

## Matrix A — Internal Script-to-Script (29 × 29)

| ↓ depends on → | **AB** | **CC** | **DP** | **DC** | **DS** | **FC** | **GM** | **LD** | **LI** | **LMD** | **LM** | **LS** | **LO** | **PC** | **RA** | **SE** | **SCM** | **SC** | **SM** | **SI** | **PI** | **UI** | **WD** | **WI** | **AI** | **EM** | **RU** | **SO** | **SDM** | out |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **AB** | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | D? | · | · | · | · | · | · | · | 1 |
| **CC** | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | 0 |
| **DP** | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | 0 |
| **DC** | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | W | · | · | · | · | · | · | · | · | · | · | 1 |
| **DS** | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | 0 |
| **FC** | · | C | · | · | · | · | R | · | · | · | E | · | · | · | · | · | · | G | · | · | · | · | · | · | · | · | · | · | · | 4 |
| **GM** | · | D | · | · | · | · | · | · | · | · | C | · | · | · | · | · | · | RG | RWC | · | · | · | · | · | · | · | · | · | · | 4 |
| **LD** | · | · | · | · | · | · | · | · | DW | · | · | W | · | · | · | · | · | · | · | D | D | · | · | · | · | · | · | · | · | 4 |
| **LI** | · | · | · | · | · | · | · | · | · | · | · | D | · | · | · | · | · | · | · | D | D | · | · | · | · | · | · | · | · | 3 |
| **LMD** | · | · | · | · | · | · | · | W | W | · | · | W | · | · | · | · | · | · | · | D | D | · | · | · | · | · | · | · | · | 5 |
| **LM** | · | · | · | · | · | S | C | DCRW | R | C | · | RW | · | · | · | · | CR | GWC | CW | · | · | W | DR | D | · | · | · | · | · | 12 |
| **LS** | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | 0 |
| **LO** | · | · | · | · | · | · | D? | · | · | · | D? | · | · | · | · | · | · | · | · | · | · | D? | · | · | · | · | · | · | · | 3 |
| **PC** | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | GW | GR | · | · | · | · | · | · | · | · | · | · | 2 |
| **RA** | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | 0 |
| **SE** | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | 0 |
| **SCM** | · | · | · | · | · | · | · | · | R | · | RC | · | · | · | · | · | · | · | · | D | · | · | · | · | · | · | · | · | · | 3 |
| **SC** | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | GRWCE | D | · | · | · | · | · | · | · | · | · | 2 |
| **SM** | · | · | GW? | · | · | · | C | W | RW | · | CRW | · | · | GC | · | · | C | SGCWR | · | D | D | · | · | · | · | · | · | · | · | 10 |
| **SI** | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | 0 |
| **PI** | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | 0 |
| **UI** | · | · | · | · | · | · | C | R | · | · | CR | · | · | · | · | · | · | · | · | · | · | · | R | · | · | · | · | · | · | 4 |
| **WD** | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | DW | · | · | · | · | · | 1 |
| **WI** | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | 0 |
| **AI** | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | 0 |
| **EM** | · | D? | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | 1 |
| **RU** | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | R | · | · | · | CR | 2 |
| **SO** | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | 0 |
| **SDM** | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | RW | · | 1 |
| **in** | 0 | 3 | 1 | 0 | 0 | 1 | 5 | 4 | 5 | 1 | 6 | 4 | 0 | 1 | 0 | 0 | 2 | 5 | 5 | 6 | 4 | 3 | 2 | 2 | 1 | 0 | 0 | 1 | 1 | |

## Matrix B — Script-to-External

| Script | **LT** | **DT** | **EPO** | **MX** | **CGF** | **HP** | **EXP** | **TMP** | **UGUI** | **INP** | **PHY** | **ANI** | **AUD** | **PP** | **SCN** | **APP** | **FND** | **LIFE** | **CO** | **REN** | **PS** | n |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **AB** | · | · | · | · | · | · | · | · | IS | · | · | GC | · | · | · | · | · | · | C | · | · | 3 |
| **CC** | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | C | · | · | 1 |
| **DP** | · | · | · | · | · | · | · | D | · | · | · | · | · | · | · | · | · | · | · | · | · | 1 |
| **DC** | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | 0 |
| **DS** | · | · | · | · | · | · | · | · | W | · | · | · | · | · | · | · | · | · | C | · | · | 2 |
| **FC** | · | C | · | · | · | · | · | · | · | · | S | · | · | · | · | · | · | C | · | · | · | 3 |
| **GM** | RCG | · | · | · | · | · | · | · | W | R | · | · | · | RW | · | · | · | · | C | · | · | 5 |
| **LD** | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | 0 |
| **LI** | · | · | · | · | · | · | · | · | · | · | · | · | D | · | · | · | · | · | · | D | · | 2 |
| **LMD** | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | 0 |
| **LM** | · | ? | · | · | · | · | · | W | W | · | · | · | · | RW | · | · | G | · | C | · | · | 6 |
| **LS** | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | 0 |
| **LO** | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | 0 |
| **PC** | · | · | · | · | · | · | · | · | · | · | S | · | · | · | · | · | G | · | · | W | · | 3 |
| **RA** | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | 0 |
| **SE** | · | · | · | · | · | · | · | · | W | · | · | · | · | · | · | · | · | · | C | · | · | 2 |
| **SCM** | · | · | · | · | · | · | · | · | · | · | · | · | · | RW | · | · | · | · | · | · | · | 1 |
| **SC** | GRW | C | GW | · | · | · | · | · | · | · | GWCS | · | · | · | · | · | G | · | C | GW | D | 8 |
| **SM** | C | C | · | GC | W | GC? | ? | GW | W | R | C | · | · | · | · | · | G | C | C | · | · | 13 |
| **SI** | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | 0 |
| **PI** | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | 0 |
| **UI** | · | · | · | · | · | · | · | W | · | · | · | · | · | · | · | · | · | · | · | W | · | 2 |
| **WD** | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | 0 |
| **WI** | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | 0 |
| **AI** | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | C | · | · | · | 1 |
| **EM** | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | C | · | · | D | 2 |
| **RU** | · | · | · | · | · | · | · | · | · | · | · | · | · | RW | C | C | · | · | D | · | · | 4 |
| **SO** | · | · | · | · | · | · | · | · | · | · | · | · | D | · | · | · | · | · | · | · | · | 1 |
| **SDM** | · | · | · | · | · | · | · | · | · | · | · | · | CW | RW | · | · | · | C | C | · | · | 4 |
| **scripts** | 3 | 4 | 1 | 1 | 1 | 1 | 1 | 4 | 6 | 2 | 4 | 1 | 3 | 5 | 1 | 1 | 4 | 5 | 10 | 4 | 2 | 64 |

## Matrix C — Hub Summary (sorted by total degree)

| Script | Code | Fan-in | Fan-out | Total | Ext. deps | Role | Subsystem | Blast radius | Risk |
|---|---|---|---|---|---|---|---|---|---|
| LevelManager | LM | 6 | 12 | 18 | 6 | Orchestrator / level state owner | Core | All outcomes, progress, HUD | Very High |
| SpawnManager | SM | 5 | 10 | 15 | 13 | God object: spawn, stack graph, rules, relays | Gameplay | Whole play loop | Very High |
| GameManager | GM | 5 | 4 | 9 | 5 | Input + level entry + stats | Core | Rotation/drop permission, level start | High |
| LevelData | LD | 4 | 4 | 8 | 0 | Level catalog | Data | Level content | Medium |
| LevelInfo | LI | 5 | 3 | 8 | 2 | Level definition | Data | Rules/score inputs | Medium |
| ShapeController | SC | 5 | 2 | 7 | 8 | Per-shape state machine (xN, per-frame) | Gameplay | Interaction, scoring, perf | Very High |
| UIManager | UI | 3 | 4 | 7 | 2 | Screen flow | Core | Game start, popups | Medium-High |
| LevelMakerData | LMD | 1 | 5 | 6 | 0 | Level authoring adapter | Data | Played level content | Medium-High |
| ShapeInfo | SI | 6 | 0 | 6 | 0 | Shape record | Data | Level/score records | Low |
| FloorColliderController | FC | 1 | 4 | 5 | 3 | Lose sensor / event emitter | Gameplay | Lose condition | Medium-High |
| ScoreManager | SCM | 2 | 3 | 5 | 1 | Scoring + persistence | Core | Scores, stars, coins | High |
| LevelStatus | LS | 4 | 0 | 4 | 0 | Level meta/progress | Data | Rule selection | Low |
| PlatformInfo | PI | 4 | 0 | 4 | 0 | Platform record | Data | Platform layout | Low |
| CameraController | CC | 3 | 0 | 3 | 1 | Camera FX leaf | UI/FX | Local | Low |
| Loader | LO | 0 | 3 | 3 | 0 | Stub | Core | Local | Low |
| PlatformController | PC | 1 | 2 | 3 | 3 | Platform behaviour | Gameplay | First-shape scoring | Medium |
| WorldData | WD | 2 | 1 | 3 | 0 | World catalog (dormant) | Data | Local | Low |
| RdWUtilities | RU | 0 | 2 | 2 | 4 | Static helpers | Services | Local | Low |
| SoundManager | SDM | 1 | 1 | 2 | 4 | Audio service | Services | Local | Low |
| WorldInfo | WI | 2 | 0 | 2 | 0 | World record (dormant) | Data | Local | Low |
| AnimatedButton | AB | 0 | 1 | 1 | 3 | UI button | UI/FX | Local | Low |
| AppInfo | AI | 1 | 0 | 1 | 1 | Config singleton | Services | Local | Low |
| DockColliderController | DC | 0 | 1 | 1 | 0 | Config relay | Gameplay | Dock/playfield boundary | Medium |
| DamagePopup | DP | 1 | 0 | 1 | 1 | Stub | UI/FX | Local | Low |
| EffectManager | EM | 0 | 1 | 1 | 2 | VFX singleton (dormant) | Services | Local | Low |
| Sound | SO | 1 | 0 | 1 | 1 | Audio cue record | Services | Local | Low |
| DurationScale | DS | 0 | 0 | 0 | 2 | Orphan | UI/FX | Local | Low |
| RdWAnalytics | RA | 0 | 0 | 0 | 0 | Stub | Services | Local | Low |
| ScoreEffect | SE | 0 | 0 | 0 | 2 | Prototype | UI/FX | Local | Low |

---

## E. Hub / High-Risk Script Section

| Rank | Script | Evidence (edges) | Why central | Change-risk tier |
|---|---|---|---|---|
| 1 | **LevelManager** | in 6 / out 12 (the highest total, 18) | Owns the level state machine; calls into 5 managers and 6 data types; subscribes to the floor event | Tier 1: any change touches outcomes, persistence and HUD |
| 2 | **SpawnManager** | in 5 / out 10 + 13 external categories (the most external coupling) | Spawner, stack graph, rules, drop validator; relays to LM/SCM/GM | Tier 1: the whole play loop, and performance at settle time |
| 3 | **ShapeController** | in 5 / out 2, but 8 external categories and N instances per frame | Per-shape state machine; emits the stack event | Tier 1: interaction feel and per-frame cost |
| 4 | **GameManager** | in 5 / out 4 | Input/rotation, drop permission, level entry, stats | Tier 2 |
| 5 | **LevelInfo / ShapeInfo** | in 5 / in 6 | Shared data contracts across 5–6 scripts | Tier 2: schema changes ripple (serialized fields) |
| 6 | **ScoreManager** | in 2 / out 3 | Score correctness and PlayerPrefs | Tier 2 |
| 7 | **FloorColliderController** | in 1 / out 4 | The lose condition; static event | Tier 2 |
| 8 | **UIManager** | in 3 / out 4 | Game start; popups manipulated by LevelManager | Tier 2 |

**Dependency heat (fan-in × fan-out):** LM 72 · SM 50 · GM 20 · SC 10 · SCM 6 · LI 15 · UI 12 · LMD 5 · FC 4 · LD 16.
**Likely initialization chain:** `LevelManager.Awake` (catalogs, prefs) → `GameManager.Awake` → `UIManager.Awake` (order not guaranteed) → `Start`s (LevelManager and SpawnManager subscribe to events) → Play → `GameManager.StartLevel` → `LevelManager.LoadLevelMakerInfo` → `SpawnManager.SpawnLevel`.

---

## F. Ambiguities / Unknowns

| Item | Status | Detail |
|---|---|---|
| UnityEvent targets | Inferred | Method names `PlayButtonPressed`, `RotateRight/Left`, `StopAndRotate`, `Inc/DecreaseRotSpeed`, `ChangeControlScheme`, `ButtonAdvance/Retreat/RestartLevel` are bound in `Game.unity`, so they are attributed to UIManager/GameManager/SpawnManager by unique name match. Emitter components are not resolved |
| `ButtonClickSound`, `ToggleSound/Music`, `RateApp`, `OpenTwitterPage` in prefabs | Unknown | `RdWUtilities` is static and cannot be a persistent target, so the targets are some other component |
| `SoundManager` static events | Unknown | No listeners in Scripts |
| `EffectManager.ShowVFX`, `RdWUtilities.*` external callers | Unknown | No callers in Scripts |
| `AnimatedButton.uimgr`, `Loader.*`, `EffectManager.camController`, `GameManager.camctlr` | Declared-only (`D?`), except `camctlr`, which FloorColliderController reads | Kept as structural edges |
| `LevelManager` → DOTween, `SpawnManager` → Exploder | `?` | Namespaces imported, no symbols used |
| Scene-level execution order | Unknown | Affects `UIManager.Awake → GameManager.GetCurrentLevel` |
| Lean Touch customizations vs vendor | Unknown extent | Only the 3 members used by Scripts were verified |
| Root-level duplicate script files under `Assets/` | Unknown | Excluded from the graph; verify before upgrade |
