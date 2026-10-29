# Balance Stack Hero 2026 — Dependency Mapping Legend, Relationship Taxonomy & Confidence Protocol

## 1. Purpose and Scope

This document defines the standardized notation, relationship markers, node classifications, subsystem tags, and confidence labels used across the **Balance Stack Hero 2026** dependency analysis suite (`Assets/Scripts/Docs/`):

- [`Scripts_Dependency_Implementation_Plan.md`](file:///d:/Unity%20Projects/Balance%20Stack%20Hero%202026[Gemini4Argon]/Assets/Scripts/Docs/Scripts_Dependency_Implementation_Plan.md)
- [`Scripts_Dependency_Map.md`](file:///d:/Unity%20Projects/Balance%20Stack%20Hero%202026[Gemini4Argon]/Assets/Scripts/Docs/Scripts_Dependency_Map.md)
- [`Scripts_Dependency_Showcase.html`](file:///d:/Unity%20Projects/Balance%20Stack%20Hero%202026[Gemini4Argon]/Assets/Scripts/Docs/Scripts_Dependency_Showcase.html)
- [`Scripts_Dependency_Matrix.csv`](file:///d:/Unity%20Projects/Balance%20Stack%20Hero%202026[Gemini4Argon]/Assets/Scripts/Docs/Scripts_Dependency_Matrix.csv)
- [`Scripts_Dependency_Matrix.json`](file:///d:/Unity%20Projects/Balance%20Stack%20Hero%202026[Gemini4Argon]/Assets/Scripts/Docs/Scripts_Dependency_Matrix.json)

---

## 2. Confidence Label Protocol

Every dependency edge, architectural claim, and ambiguity note in this package carries one of three explicit confidence labels (**Confirmed from companion docs**):

| Confidence Label | Code / Badge | Definition & Evidence Standard |
|---|---|---|
| **Confirmed from companion docs** | `CONFIRMED` | Directly evidenced in the per-script `.cs.md` companion documentation (and cross-verified against tertiary `.cs` source where companion docs conflicted). Includes explicit field declarations, method calls, `GetComponent` queries, constructor calls, and event subscriptions (`+=`). |
| **Inferred from companion docs** | `INFERRED` | Logically deduced from companion doc evidence—such as Unity Inspector `UnityEvent` bindings (`AnimatedButton.m_OnClick` -> `UIManager.PlayButtonPressed()`), scene tag lookups (`GameObject.Find("DockCollider")`), or inter-doc upstream/downstream discrepancies where one companion doc noted an earlier template call that another companion doc showed was commented out or replaced. |
| **Unknown from current scope** | `UNKNOWN` | Cannot be determined from the `Assets/Scripts/Docs/` corpus alone because it resides in binary/YAML `.unity` scene files, `.prefab` assets, Animator Controllers, or external plugin folders outside `Assets/Scripts/`. |

---

## 3. Matrix Relationship Markers

All dependency matrices (`Matrix A — Internal Script-to-Script` and `Matrix B — Script-to-External`) use concise single-letter relationship markers. **Directionality reads from Row (Source / Dependent Script) to Column (Target / Dependency):**

| Marker | Relationship Name | Category | Meaning (Row -> Column) | Example in `Assets/Scripts` |
|---|---|---|---|---|
| **`C`** | **Calls / Invokes** | Direct Code | Row script invokes an instance method, static method, coroutine, or constructor (`new`) on Column target | `GameManager` -> `SpawnManager.CalculateCurShapePenetration()` (`C`) |
| **`R`** | **Reads State** | Data / State | Row script reads a public field, property, or array element from Column target | `ShapeController` -> `SpawnManager.dockloc` (`R`) |
| **`W`** | **Writes / Mutates State** | Data / State | Row script assigns or mutates a public field, list, or property on Column target | `DockColliderController` -> `SpawnManager.dockloc` (`W`) |
| **`E`** | **Emits Event To** | Event / Messaging | Row script declares/publishes a `static event`, delegate, or `UnityEvent` consumed by Column subscriber | `FloorColliderController` -> `LevelManager` via `levelstatusEvent` (`E`) |
| **`S`** | **Subscribes To** | Event / Messaging | Row script registers a handler (`+=`) onto a `static event` or callback declared by Column publisher | `LevelManager` -> `FloorColliderController.levelstatusEvent` (`S`) |
| **`I`** | **Inherits / Implements** | Structural | Row script inherits from base class or implements interface defined in Column target | `AnimatedButton` -> `UIBehaviour`, `IPointerDownHandler` (`I`) |
| **`G`** | **Gets Component / Reference** | Unity-Specific | Row script obtains Column reference via `GetComponent`, `GetComponents`, `FindObjectOfType`, `GameObject.Find`, `FindGameObjectsWithTag`, or `[RequireComponent]` | `ShapeController` -> `SpawnManager` via `FindObjectOfType<SpawnManager>()` (`G`) |
| **`D`** | **Structural / Field / Type Dependency** | Structural / Data | Row script declares a serialized field, parameter, collection (`List<T>`, `T[]`), or co-file type dependency on Column without active runtime calls | `Loader` -> `GameManager`, `UIManager`, `LevelManager` (`D`) |
| **`?`** | **Inferred or Ambiguous Link** | Confidence Modifier | Appended to another marker (e.g., `E?`, `C?`) when the link is **Inferred from companion docs** (such as Inspector `UnityEvent` wiring or inter-doc template discrepancies) | `AnimatedButton` -> `UIManager.PlayButtonPressed()` (`D,E?`) |

> [!TIP]
> **Multi-Marker Cells:** When a script interacts with a target in multiple ways, markers are combined in canonical order (`I`, `D`, `G`, `C`, `R`, `W`, `E`, `S`, `?`), such as `C,R,W` (`LevelManager` -> `SpawnManager`) or `G,C,R,W,E` (`ShapeController` -> `SpawnManager`).

---

## 4. Node Taxonomies & Architectural Subsystems

### 4.1 Internal Script Subsystems (`Assets/Scripts/`)

| Subsystem ID | Subsystem Name | Color Hex (HTML Showcase) | Scripts Assigned (27 Scripts / 29 Types) |
|---|---|---|---|
| **`SUB-CORE`** | **Core Gameplay & Stack Physics** | `#3b82f6` (Blue) | `SpawnManager.cs` (+`ShapeInfo`, `PlatformInfo`), `ShapeController.cs`, `PlatformController.cs`, `DockColliderController.cs`, `FloorColliderController.cs`, `GameManager.cs` |
| **`SUB-PROG`** | **Level Lifecycle, Progression & Scoring** | `#10b981` (Emerald) | `LevelManager.cs`, `ScoreManager.cs`, `LevelData.cs`, `LevelInfo.cs`, `LevelStatus.cs`, `LevelMakerData.cs`, `WorldData.cs`, `WorldInfo.cs` |
| **`SUB-UI`** | **UI, HUD, Camera & Visual Effects** | `#f59e0b` (Amber) | `UIManager.cs`, `AnimatedButton.cs`, `CameraController.cs`, `DamagePopup.cs`, `DurationScale.cs`, `ScoreEffect.cs`, `Loader.cs` |
| **`SUB-SVC`** | **Audio, Platform Services & Analytics (`Game/`)** | `#8b5cf6` (Purple) | `Game/SoundManager.cs`, `Game/Sound.cs`, `Game/RdWUtilities.cs`, `Game/AppInfo.cs`, `Game/EffectManager.cs`, `RdWAnalytics.cs` |

### 4.2 External Target Categories

| External Category Code | Category Name | Examples in Project |
|---|---|---|
| **`EXT-PROJ`** | **External Project / Modified Asset Scripts** | `Lean.Touch.LeanTouchEvents` (`dragdelta`), `Lean.Touch.LeanTwistRotateAxis` (`RotateMe(float)`) |
| **`EXT-PLUGIN`** | **Third-Party Asset Store Plugins** | `DG.Tweening` (`DOTween`), `Lean.Touch` (`LeanTouch`, `LeanSelectable`, `LeanSelectableRendererColor`), `EPOOutline` (`Outlinable`), `Exploder.Utils` (`MeshExploder`), `CircularGravityForce` (`CGF`) |
| **`EXT-UPKG`** | **Unity Packages** | `TMPro` (`TextMeshPro` / `TMP_Text`), `UnityEngine.UI` (`Text`, `Image`), `UnityEngine.EventSystems` (`UIBehaviour`, `IPointerDownHandler`, `PointerEventData`), `UnityEngine.Analytics` (commented stub) |
| **`EXT-UNITY`** | **Unity Built-In Engine & BCL Systems** | `MonoBehaviour`, `Physics` (`Rigidbody`, `Collider`, `Collision`, `Raycast`, `ComputePenetration`), `AudioSource` / `AudioClip`, `ParticleSystem`, `Animator`, `Camera`, `PlayerPrefs`, `SceneManager`, `UnityWebRequest`, `Application` |

---

## 5. Blast-Radius & Change-Risk Tiers

| Risk Tier | Criteria | Scripts in Tier |
|---|---|---|
| **Critical / Hub (`Tier 1`)** | Total degree (Fan-In + Fan-Out) $\ge 10$, or central state machine / physics orchestrator where changes break core gameplay loop | `SpawnManager.cs`, `LevelManager.cs`, `ShapeController.cs`, `GameManager.cs` |
| **High (`Tier 2`)** | Total degree $5..9$, or owns shared data schema / kill-zone event / UI root | `ScoreManager.cs`, `UIManager.cs`, `LevelInfo.cs`, `LevelData.cs`, `FloorColliderController.cs`, `PlatformController.cs` |
| **Medium (`Tier 3`)** | Total degree $2..4$, localized boundary sensor, authoring bridge, or service singleton | `LevelStatus.cs`, `LevelMakerData.cs`, `WorldData.cs`, `WorldInfo.cs`, `DockColliderController.cs`, `CameraController.cs`, `DamagePopup.cs`, `AnimatedButton.cs`, `Loader.cs`, `Game/SoundManager.cs`, `Game/Sound.cs`, `Game/RdWUtilities.cs`, `Game/AppInfo.cs` |
| **Low / Leaf / Orphan (`Tier 4`)** | Total internal degree $\le 1$; standalone UI effect, unreferenced manager, or empty stub | `DurationScale.cs`, `ScoreEffect.cs`, `RdWAnalytics.cs`, `Game/EffectManager.cs` |

