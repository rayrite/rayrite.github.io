# Balance Stack Hero 2026 — Multi-Phase Dependency Mapping & Architectural Implementation Plan

## 1. Document Metadata & Scope

| Attribute | Value |
|---|---|
| **Document Title** | Multi-Phase Dependency Mapping & Architectural Implementation Roadmap |
| **Target Project** | **Balance Stack Hero 2026** (`Unity 2023.1.6f1`) — **Confirmed from companion docs** |
| **Analyzed Script Root** | `Assets/Scripts/` (`22` root C# scripts + `5` `Assets/Scripts/Game/` C# scripts = `27` scripts, `29` declared C# types) — **Confirmed from companion docs** |
| **Primary Knowledge Corpus** | `Assets/Scripts/Docs/*.cs.md` (`22` root companion files) + `Assets/Scripts/Docs/Game/*.cs.md` (`5` subfolder companion files) — **Confirmed from companion docs** |
| **Secondary Knowledge Corpus** | `Assets/Scripts/Docs/Scripts_Master_Index.md` — **Confirmed from companion docs** |
| **Tertiary Validation Source** | `Assets/Scripts/*.cs` and `Assets/Scripts/Game/*.cs` (used strictly to resolve inter-doc discrepancies between individual `.cs.md` files and `Scripts_Master_Index.md`) |
| **Output Directory** | `Assets/Scripts/Docs/` |

---

## 2. Executive Architecture & Roadmap Overview

This implementation plan defines a deterministic, **7-phase reverse-engineering and dependency-mapping workflow** (`Phase 0` through `Phase 6`) that transforms the 27 per-script companion Markdown specifications in `Assets/Scripts/Docs/` into a complete, verified dependency analysis package:

1. **Phase 0 — Corpus Discovery, Inventory & Cross-Doc Reconciliation**
2. **Phase 1 — Schema Extraction & Entity/Edge Normalization**
3. **Phase 2 — Internal `Assets/Scripts` Dependency Graph & Topology Analysis**
4. **Phase 3 — External Project, Plugin, Package & Unity Framework Dependency Graph**
5. **Phase 4 — Multi-Dimensional Dependency Matrix Construction (`CSV`, `JSON`, `Markdown`)**
6. **Phase 5 — ASCII-Art Markdown Dependency Atlas (`Scripts_Dependency_Map.md`)**
7. **Phase 6 — Interactive HTML/CSS/JS Mermaid Dependency Showcase (`Scripts_Dependency_Showcase.html`)**

```text
+-----------------------------------------------------------------------------------+
| Phase 0: Corpus Discovery & Cross-Doc Validation (27 .cs.md + Master Index)       |
+-----------------------------------------+-----------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
| Phase 1: Schema Extraction & Normalization (27 Script Nodes, 2 Co-File DTOs)      |
+--------------------+-----------------------------------------+--------------------+
                     |                                         |
                     v                                         v
+----------------------------------------+ +----------------------------------------+
| Phase 2: Internal Dependency Graph     | | Phase 3: External/Plugin/Unity Graph   |
| (59 Confirmed + 7 Inferred Edges)      | | (48 External Edges across 4 Tiers)     |
+--------------------+-------------------+ +-------------------+--------------------+
                     |                                         |
                     +--------------------+--------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
| Phase 4: Dependency Matrix Construction (Matrix A, Matrix B, Matrix C + CSV/JSON) |
+--------------------+-----------------------------------------+--------------------+
                     |                                         |
                     v                                         v
+----------------------------------------+ +----------------------------------------+
| Phase 5: ASCII-Art Markdown Atlas      | | Phase 6: Interactive HTML/JS Mermaid   |
| (Scripts_Dependency_Map.md)            | | Showcase (Scripts_Dependency_Showcase) |
+----------------------------------------+ +----------------------------------------+
```

---

## 3. Phase-by-Phase Implementation Plan

---

### Phase 0 — Corpus Discovery, Inventory & Cross-Doc Validation

#### 3.0.1 Objective
Discover and inventory every companion Markdown file under `Assets/Scripts/Docs/`, verify 1:1 coverage against the C# scripts in `Assets/Scripts/` and `Assets/Scripts/Game/`, audit structural completeness across all 26 sections of each `.cs.md` file, and reconcile any discrepancies between individual companion docs and `Scripts_Master_Index.md`.

#### 3.0.2 Source Inputs Used
- **Primary:** All 22 root `.cs.md` files in `Assets/Scripts/Docs/` and all 5 subfolder `.cs.md` files in `Assets/Scripts/Docs/Game/` (**Confirmed from companion docs**).
- **Secondary:** `Assets/Scripts/Docs/Scripts_Master_Index.md` (**Confirmed from companion docs**).
- **Tertiary:** `Assets/Scripts/*.cs` and `Assets/Scripts/Game/*.cs` (used only to arbitrate inter-doc conflicts).

#### 3.0.3 Extraction Tasks
1. Enumerate all `.cs.md` files in `Assets/Scripts/Docs/` and `Assets/Scripts/Docs/Game/`.
2. Extract each companion document's header metadata: Script Name, File Path, Namespace, Base Class, Implemented Interfaces, Nested Types, and Co-Declared Classes (`ShapeInfo` and `PlatformInfo` inside `SpawnManager.cs`).
3. Extract reported line counts (LOC) and method catalogs from both individual `.cs.md` files and `Scripts_Master_Index.md`.

#### 3.0.4 Normalization Tasks
1. Map every companion `.cs.md` file to a canonical relative script path (`AnimatedButton.cs` .. `WorldInfo.cs`, `Game/AppInfo.cs` .. `Game/SoundManager.cs`).
2. Flag co-declared types (`ShapeInfo` and `PlatformInfo` declared at lines 14–42 of `SpawnManager.cs`) so references to `ShapeInfo` or `PlatformInfo` in `LevelData`, `LevelInfo`, `LevelMakerData`, `ScoreManager`, and `ShapeController` roll up to `SpawnManager.cs` in script-level matrices while retaining explicit DTO attribution in edge annotations.

#### 3.0.5 Analysis Tasks
1. Compare the **Upstream Dependency Trace** (Section 12) and **Downstream Dependency Trace** (Section 13) of every `.cs.md` file against its peers to verify symmetry (i.e., if Script $A$'s Downstream Trace lists Script $B$, does Script $B$'s Upstream Trace list Script $A$?).
2. Isolate and document **Inter-Document Template Discrepancies** where `Scripts_Master_Index.md` or `Game/SoundManager.cs.md` / `Game/RdWUtilities.cs.md` mention 2D/template methods (e.g., `UIManager.SelectMenu`, `SpawnManager.DoPointerDown`, `FloorColliderController.TriggerFloorFallExplosion`, `ShapeController.OnCollisionEnter2D`, `LevelData` 40-level constructor) whereas the actual per-script companion docs (`UIManager.cs.md`, `SpawnManager.cs.md`, `FloorColliderController.cs.md`, `ShapeController.cs.md`, `LevelData.cs.md`) and tertiary `.cs` files confirm those methods do not exist in the active C# source.

#### 3.0.6 Output Artifacts
- Phase 0 Corpus Inventory Table & Discrepancy Reconciliation Ledger (embedded in `Scripts_Dependency_Map.md` Section 2 and `Scripts_Dependency_Showcase.html`).

#### 3.0.7 Validation Checks
- Total C# scripts in `Assets/Scripts` = **27** (`22` root + `5` `Game/`) — **Confirmed from companion docs**.
- Total companion `.cs.md` files = **27** (`100%` script coverage, `0` missing companion files) — **Confirmed from companion docs**.
- Total declared types = **29** primary/co-declared classes (`27` script classes + `ShapeInfo` + `PlatformInfo`) plus `6` nested delegate/event/enum types — **Confirmed from companion docs**.

#### 3.0.8 Risks / Ambiguities
- **Inter-Corpus Drift Risk:** `Scripts_Master_Index.md` and `SoundManager.cs.md` describe several upstream calls from an earlier 2D prototype (`SelectMenu`, `DoPointerDown`, `DoPointerUp`, `OnCollisionEnter2D`) that are absent from `UIManager.cs.md`, `SpawnManager.cs.md`, `FloorColliderController.cs.md`, and `ShapeController.cs.md`. Treating those unverified upstream notes as confirmed edges would pollute the active dependency graph.
- **Mitigation:** Strictly separate **Confirmed from companion docs** edges (59 internal edges verified in the caller's own `.cs.md` Downstream Trace and C# source) from **Inferred from companion docs** template-trace edges (7 edges marked with `?`).

#### 3.0.9 Acceptance Criteria
- 100% of scripts under `Assets/Scripts` accounted for; all inter-doc discrepancies explicitly logged with confidence labels.

#### 3.0.10 Next-Phase Prerequisites
- Validated 27-script inventory and canonical naming map ready for Phase 1 schema extraction.

---

### Phase 1 — Schema Extraction & Entity/Edge Normalization

#### 3.1.1 Objective
Extract a formal, normalized entity-relationship schema from Sections 1, 3, 4, 5, 9, 11, 12, 13, 14, and 15 of all 27 companion `.cs.md` files, classifying every node and every directed edge by relationship marker (`C`, `R`, `W`, `E`, `S`, `I`, `G`, `D`, `?`) and confidence level.

#### 3.1.2 Source Inputs Used
- All 27 `.cs.md` files (`Sections 1–17`), `Scripts_Master_Index.md`, and `Scripts_Dependency_Legend.md`.

#### 3.1.3 Extraction Tasks
For each of the 27 companion `.cs.md` files, extract:
1. **Structural Metadata:** Script name, relative path, `<global>` namespace, base class (`MonoBehaviour`, `UIBehaviour`, `System.Object`, `static class`), implemented interfaces (`IPointerDownHandler`), and attributes (`[System.Serializable]`, `[RequireComponent(typeof(TMP_Text))]`).
2. **Lifecycle Entry Points:** `Awake()`, `Start()`, `Update()`, `LateUpdate()`, `OnCollisionEnter(Collision)`, `OnPointerDown(PointerEventData)`, and constructors (`LevelData()`, `WorldData()`, `ShapeInfo()`).
3. **Field & Property Dependencies:** All public/serialized and private fields referencing other project scripts, Unity components, or third-party plugin types.
4. **Direct Call & State Mutation Edges:** Every method call (`C`), field/property read (`R`), and field/collection write (`W`) across scripts.
5. **Unity Component & Scene Lookup Edges:** Every `GetComponent<T>()`, `GetComponents<T>()`, `FindObjectOfType<T>()`, `GameObject.Find("...")`, and ` GameObject.FindGameObjectsWithTag("Shape")` call (`G`).
6. **Event & Messaging Edges:** Every static delegate/event declaration (`E`) and `+=` subscription (`S`), plus `UnityEvent` serialization (`m_OnClick`).

#### 3.1.4 Normalization Tasks
1. **Canonicalize Node IDs:** Assign each of the 27 scripts a unique node ID (`AnimatedButton` .. `SoundManager`), grouping `ShapeInfo` and `PlatformInfo` under `SpawnManager.cs` (`SpawnManager [+ShapeInfo, PlatformInfo]`) while also documenting them as distinct logical data sub-nodes.
2. **Partition Target Nodes into 5 Disjoint Domains:**
   - `INT-SCRIPT`: The 27 scripts inside `Assets/Scripts/`.
   - `EXT-PROJ`: External custom/modified scripts outside `Assets/Scripts/` (`Lean.Touch.LeanTouchEvents`, `Lean.Touch.LeanTwistRotateAxis`).
   - `EXT-PLUGIN`: Third-party Asset Store plugins (`DG.Tweening`, `Lean.Touch`, `EPOOutline`, `Exploder.Utils`, `CircularGravityForce`, commented `HighlightPlus`).
   - `EXT-UPKG`: Unity packages (`TMPro`, `UnityEngine.UI`, `UnityEngine.EventSystems`, commented `UnityEngine.Analytics`).
   - `EXT-UNITY`: Built-in `UnityEngine` / `.NET BCL` runtime systems (`Physics`, `AudioSource`/`AudioClip`, `ParticleSystem`, `Animator`, `Camera`, `PlayerPrefs`, `SceneManager`, `UnityWebRequest`, `Application`).
3. **Deduplicate & Combine Parallel Edges:** Aggregate multiple interactions between the same `(Source, Target)` pair into a composite marker set in canonical order (`I`, `D`, `G`, `C`, `R`, `W`, `E`, `S`, `?`).

#### 3.1.5 Analysis Tasks
1. Annotate every extracted edge with its exact source method/field evidence and confidence label (`Confirmed from companion docs`, `Inferred from companion docs`, or `Unknown from current scope`).
2. Classify each script into one of the four primary architectural subsystems (`SUB-CORE`, `SUB-PROG`, `SUB-UI`, `SUB-SVC`).

#### 3.1.6 Output Artifacts
- Normalized Entity Catalog (`27` script nodes + `2` co-declared DTOs + `18` external system nodes) and Normalized Edge List in `Scripts_Dependency_Matrix.json` and `Scripts_Dependency_Map.md`.

#### 3.1.7 Validation Checks
- Every script node has `<global>` namespace (**Confirmed from companion docs**).
- Zero duplicate nodes exist for aliases (e.g., `TMP_Text` and `TextMeshPro` normalized to `TMPro / TMP_Text`; `DOTween` and `ShortcutExtensions` normalized to `DG.Tweening (DOTween)`).
- Every edge has at least one relationship marker and a confidence annotation.

#### 3.1.8 Risks / Ambiguities
- **Co-Declared Classes in `SpawnManager.cs`:** `ShapeInfo` and `PlatformInfo` are plain data classes declared at the top of `SpawnManager.cs`. In a purely file-based graph, `LevelData -> ShapeInfo` appears as `LevelData -> SpawnManager.cs`.
- **Mitigation:** Explicitly annotate all `ShapeInfo`/`PlatformInfo` edges in the matrices and provide a dedicated **Data Model & DTO Sub-Graph** distinguishing `ShapeInfo` and `PlatformInfo` from the `SpawnManager` `MonoBehaviour`.

#### 3.1.9 Acceptance Criteria
- Complete JSON and Markdown entity/edge tables with 100% traceability to companion docs.

#### 3.1.10 Next-Phase Prerequisites
- Normalized entity and edge lists ready for Phase 2 internal graph construction and Phase 3 external graph construction.

---

### Phase 2 — Internal `Assets/Scripts` Dependency Graph & Topology Analysis

#### 3.2.1 Objective
Construct the complete directed internal dependency graph across all 27 scripts under `Assets/Scripts`, compute exact `Fan-In`, `Fan-Out`, and `Total Degree` centrality metrics, identify architectural hubs, leaf/orphan scripts, and cyclic dependency clusters, and decompose the internal graph into readable views.

#### 3.2.2 Source Inputs Used
- Normalized `INT-SCRIPT` entity and edge lists from Phase 1 (`59` confirmed internal edges + `7` inferred template-trace edges).

#### 3.2.3 Extraction Tasks
1. Extract all script-to-script edges where both `Source` and `Target` reside under `Assets/Scripts/` (including `Assets/Scripts/Game/`).
2. Separate **Active Runtime / Structural Edges** (`59` confirmed) from **Inferred / Historical Template Edges** (`7` inferred).

#### 3.2.4 Normalization Tasks
1. Compute per-script `Confirmed Fan-Out` (number of distinct internal scripts a script depends on), `Confirmed Fan-In` (number of distinct internal scripts that depend on it), and `Total Degree = Fan-Out + Fan-In`.
2. Group scripts into 4 functional subsystems (`SUB-CORE`, `SUB-PROG`, `SUB-UI`, `SUB-SVC`) and rank by blast-radius risk tier (`Tier 1` through `Tier 4`).

#### 3.2.5 Analysis Tasks
1. **Hub Identification:**
   - **`LevelManager.cs` (`Total Degree = 18`: `Fan-Out = 12`, `Fan-In = 6`):** Highest overall connectivity; bridges data models (`LevelData`, `LevelInfo`, `LevelStatus`, `WorldData`, `WorldInfo`, `LevelMakerData`), gameplay managers (`SpawnManager`, `ScoreManager`, `GameManager`), UI (`UIManager`), and physics sensors (`FloorColliderController`, `ShapeController`).
   - **`SpawnManager.cs` (`Total Degree = 17`: `Fan-Out = 8`, `Fan-In = 9`):** Core gameplay & stack-analysis god-class (and host of `ShapeInfo` / `PlatformInfo`).
   - **`GameManager.cs` (`Total Degree = 9`: `Fan-Out = 4`, `Fan-In = 5`):** Input-rotation and level-start coordinator.
   - **`ShapeController.cs` (`Total Degree = 7`: `Fan-Out = 2`, `Fan-In = 5`):** Per-entity physics and state controller.
   - **`UIManager.cs` (`Total Degree = 7`: `Fan-Out = 4`, `Fan-In = 3`):** Top-level UI canvas controller.
2. **Cyclic Dependency Cluster Analysis:**
   - **Cycle 1 — Core Manager Triad (`GameManager` ↔ `LevelManager` ↔ `SpawnManager`):** All three managers hold serialized Inspector references to the other two and invoke methods bidirectionally (**Confirmed from companion docs**).
   - **Cycle 2 — Spawner & Entity Loop (`SpawnManager` ↔ `ShapeController` & `PlatformController`):** `SpawnManager` instantiates, configures, queries, and subscribes to `ShapeController.collisionEvent`, while `ShapeController` and `PlatformController` look up `FindObjectOfType<SpawnManager>()` and call/mutate `SpawnManager` state (**Confirmed from companion docs**).
   - **Cycle 3 — Progression & Scoring Loop (`LevelManager` ↔ `ScoreManager`, `LevelManager` ↔ `UIManager`, `LevelData` ↔ `LevelInfo` ↔ `SpawnManager`):** Bidirectional references between `LevelManager` and `ScoreManager` (`lvlmgr` / `scrmgr`) and between `LevelManager` and `UIManager` (`uimgr` / `lvlmgr`) (**Confirmed from companion docs**).
3. **Leaf & Orphan Script Identification:**
   - **Pure Data Leaves (`Fan-Out = 0`):** `LevelStatus.cs` (`Fan-In = 4`), `WorldInfo.cs` (`Fan-In = 2`), `Game/Sound.cs` (`Fan-In = 2`).
   - **Service / View Leaves (`Fan-Out = 0`):** `CameraController.cs` (`Fan-In = 3`), `DamagePopup.cs` (`Fan-In = 1`), `Game/AppInfo.cs` (`Fan-In = 1`).
   - **Standalone / Orphan Scripts (`Fan-In = 0`):** `DurationScale.cs` (`0/0`), `ScoreEffect.cs` (`0/0`), `RdWAnalytics.cs` (`0/0`), `Game/EffectManager.cs` (`Fan-Out = 1`, `Fan-In = 0`), `Loader.cs` (`Fan-Out = 3`, `Fan-In = 0`), `AnimatedButton.cs` (`Fan-Out = 1`, `Fan-In = 0`).

#### 3.2.6 Output Artifacts
- Internal Dependency Graphviews (High-Level Overview, Core Manager Triad, Entity Physics & Stack Graph, Data & Progression Graph, UI & Audio Service Graph) in `Scripts_Dependency_Map.md` and `Scripts_Dependency_Showcase.html`.

#### 3.2.7 Validation Checks
- Verify $\sum \text{Confirmed Fan-Out} = \sum \text{Confirmed Fan-In} = 59$ across all 27 scripts.
- Verify every cyclic dependency is explicitly documented with the exact participating fields and methods.

#### 3.2.8 Risks / Ambiguities
- **Static Event Dangling Reference Risk:** Both `FloorColliderController.levelstatusEvent` (`-> LevelManager.UpdateLevelStatus`) and `ShapeController.collisionEvent` (`-> SpawnManager.UpdateStackInformation`) are `public static event` delegates subscribed in `Start()` with zero `-=` unsubscriptions in `OnDestroy()` (**Confirmed from companion docs**).

#### 3.2.9 Acceptance Criteria
- Complete internal adjacency list, centrality rankings, cycle catalog, and decomposed subsystem graphs verified.

#### 3.2.10 Next-Phase Prerequisites
- Internal topology complete; ready to map external/plugin/Unity boundaries in Phase 3.

---

### Phase 3 — External Project, Plugin, Package & Unity Framework Dependency Graph

#### 3.3.1 Objective
Map every outbound dependency from the 27 scripts under `Assets/Scripts` to external project scripts, third-party Asset Store plugins, Unity packages, and built-in Unity framework systems, strictly separating internal script nodes from external targets.

#### 3.3.2 Source Inputs Used
- Sections 1, 4, 5, 13, and 14 of all 27 companion `.cs.md` files.

#### 3.3.3 Extraction Tasks
1. Identify all references to classes/namespaces outside `Assets/Scripts/`:
   - **External Project / Modified Plugin Scripts (`EXT-PROJ`):**
     - `Lean.Touch.LeanTouchEvents` (`GameManager.lte.dragdelta`)
     - `Lean.Touch.LeanTwistRotateAxis` (`GameManager` & `ShapeController` `ltraa.RotateMe(float)`)
   - **Third-Party Asset Store Plugins (`EXT-PLUGIN`):**
     - `DG.Tweening` (`DOTween`: `DOMove`, `DOScale`, `DORotateQuaternion`, `DOPunchScale`, `DOFade`, `DOKill`)
     - `Lean.Touch` (`LeanTouch`, `LeanSelectable`, `LeanSelectableRendererColor`)
     - `EPOOutline` (`Outlinable`, `OutlineParameters`)
     - `Exploder.Utils` (`MeshExploder.Explode()`)
     - `CircularGravityForce` (`CGF.ForcePower`)
     - `HighlightPlus` (`HighlightEffect` — legacy/unused in `SpawnManager.UpdateShapeStatus()`)
   - **Unity Packages (`EXT-UPKG`):**
     - `TMPro` (`TMP_Text`)
     - `UnityEngine.UI` (`Text`)
     - `UnityEngine.EventSystems` (`UIBehaviour`, `IPointerDownHandler`, `PointerEventData`)
     - `UnityEngine.Analytics` (commented out in `RdWAnalytics.cs` & `ScoreManager.cs`)
   - **Unity Built-In Framework (`EXT-UNITY`):**
     - `UnityEngine.Physics` (`Rigidbody`, `Collider`, `Collision`, `Physics.Raycast`, `Physics.ComputePenetration`, `RigidbodyConstraints`)
     - `UnityEngine.Audio` (`AudioSource`, `AudioClip`)
     - `UnityEngine.ParticleSystem`
     - `UnityEngine.Animator`
     - `UnityEngine.Camera`
     - `UnityEngine.PlayerPrefs`
     - `UnityEngine.SceneManagement.SceneManager`
     - `UnityEngine.Networking.UnityWebRequest` & `Application.OpenURL`

#### 3.3.4 Normalization Tasks
1. Classify each external target into one of the four external tiers (`EXT-PROJ`, `EXT-PLUGIN`, `EXT-UPKG`, `EXT-UNITY`).
2. Record the exact relationship markers (`I`, `D`, `G`, `C`, `R`, `W`) and confidence level for each `(Internal Script -> External System)` pair.

#### 3.3.5 Analysis Tasks
1. Evaluate third-party plugin concentration: `ShapeController.cs` and `SpawnManager.cs` concentrate 5 third-party plugins (`LeanTouch`, `DOTween`, `EPOOutline`, `MeshExploder`, `CircularGravityForce`).
2. Audit `PlayerPrefs` persistence coupling across 5 scripts (`LevelManager`, `ScoreManager`, `GameManager`, `SoundManager`, `RdWUtilities`) and catalog all 10 `PlayerPrefs` keys.

#### 3.3.6 Output Artifacts
- External Dependency Catalog, `PlayerPrefs` Key Ownership Table, and External Mermaid / ASCII Diagrams in `Scripts_Dependency_Map.md` and `Scripts_Dependency_Showcase.html`.

#### 3.3.7 Validation Checks
- Confirm zero external plugin/Unity nodes are mixed into the internal script-to-script adjacency matrix (`Matrix A`).
- Confirm all 4 external tiers are represented in `Matrix B — Script-to-External`.

#### 3.3.8 Risks / Ambiguities
- **Custom Modifications Inside `Lean.Touch` (`EXT-PROJ`):** `LeanTouchEvents.dragdelta` and `LeanTwistRotateAxis.RotateMe(float)` are custom developer extensions added directly to the `LeanTouch` scripts outside `Assets/Scripts` (**Confirmed from companion docs** `GameManager.cs.md` Section 25). Upgrading the `LeanTouch` package from the Asset Store would overwrite these custom members!

#### 3.3.9 Acceptance Criteria
- Every external dependency evidenced in the 27 companion docs is classified, confidence-labeled, and mapped to its source script(s).

#### 3.3.10 Next-Phase Prerequisites
- Complete internal (Phase 2) and external (Phase 3) edge sets ready for Phase 4 matrix compilation.

---

### Phase 4 — Multi-Dimensional Dependency Matrix Construction

#### 3.4.1 Objective
Compile machine-readable (`CSV`, `JSON`) and human-readable (`Markdown`, `HTML`) dependency matrices covering `Matrix A — Internal Script-to-Script (27 × 27)`, `Matrix B — Script-to-External (27 × 16)`, `Matrix C — Hub & Blast-Radius Summary`, and per-subsystem reduced matrices.

#### 3.4.2 Source Inputs Used
- Phase 2 Internal Graph (`59` confirmed + `7` inferred edges) and Phase 3 External Graph (`48` external edges).

#### 3.4.3 Extraction & Normalization Tasks
1. Construct the full $27 \times 27$ grid for `Matrix A` using standardized markers (`C`, `R`, `W`, `E`, `S`, `I`, `G`, `D`, `?`).
2. Construct `Matrix B` mapping all 27 scripts against the 16 external plugin/package/Unity targets.
3. Construct `Matrix C` summarizing `Confirmed Fan-In`, `Confirmed Fan-Out`, `Total Degree`, `Inferred Edges`, `Subsystem`, `Architectural Role`, `Likely Blast Radius`, and `Risk Level` for all 27 scripts.
4. Construct reduced per-subsystem matrices for rapid inspection in raw text editors.

#### 3.4.4 Validation Checks
- Cross-check every cell in `Matrix A` against `Scripts_Dependency_Matrix.csv` and `Scripts_Dependency_Matrix.json`.
- Verify row sums equal `Confirmed Fan-Out` and column sums equal `Confirmed Fan-In`.

#### 3.4.5 Output Artifacts
- `Scripts_Dependency_Matrix.csv`, `Scripts_Dependency_Matrix.json`, `Scripts_Dependency_Legend.md`, and Section 5 of `Scripts_Dependency_Map.md`.

#### 3.4.6 Acceptance Criteria & Next-Phase Prerequisites
- All matrices validated and ready for embedding in the Phase 5 Markdown Atlas and Phase 6 HTML Showcase.

---

### Phase 5 — ASCII-Art Markdown Dependency Atlas (`Scripts_Dependency_Map.md`)

#### 3.5.1 Objective
Author a comprehensive, raw-text-friendly Markdown Dependency Atlas (`Assets/Scripts/Docs/Scripts_Dependency_Map.md`) containing executive metrics, ASCII-art architectural diagrams, subsystem maps, lifecycle/event traces, full dependency matrices (`Matrix A`, `Matrix B`, `Matrix C`), hub/blast-radius profiles, and an explicit ambiguity/discrepancy register.

#### 3.5.2 Source Inputs Used
- Outputs of Phases 0–4 (`Scripts_Dependency_Matrix.csv`, `Scripts_Dependency_Matrix.json`, `Scripts_Dependency_Legend.md`, and the 27 `.cs.md` files).

#### 3.5.3 Key Sections & Diagrams Produced
1. **Section A — Executive Summary & Corpus Reconciliation**
2. **Section B — Internal Dependency Overview (ASCII-Art Architecture Maps)**
3. **Section C — External, Plugin & Unity Framework Dependency Overview (ASCII-Art Maps)**
4. **Section D — Subsystem Dependency Maps (4 Decomposed ASCII Views + Initialization & Event Chains)**
5. **Section E — Complete Dependency Matrices (`Matrix A`, `Matrix B`, `Matrix C`, and Per-Subsystem Reduced Matrices)**
6. **Section F — Hub Scripts, Cyclic Dependencies & High-Risk Change Points**
7. **Section G — Ambiguities, Inter-Doc Discrepancies & Unresolved Links**

#### 3.5.4 Validation Checks & Acceptance Criteria
- All ASCII-art diagrams render cleanly in any fixed-width text editor without horizontal clipping; every dependency claim includes a required confidence label.

---

### Phase 6 — Interactive HTML/CSS/JavaScript Mermaid Dependency Showcase (`Scripts_Dependency_Showcase.html`)

#### 3.6.1 Objective
Build a self-contained, responsive static HTML5/CSS3/ES6 architectural showcase (`Assets/Scripts/Docs/Scripts_Dependency_Showcase.html`) with embedded Mermaid.js diagrams, interactive pan/zoom/reset viewports on every diagram card, interactive matrix filtering, subsystem tabs, hub heat-scoring cards, and full methodology/ambiguity documentation.

#### 3.6.2 Source Inputs Used
- All Phase 0–5 deliverables (`Scripts_Dependency_Map.md`, `Scripts_Dependency_Matrix.json`, `Scripts_Dependency_Legend.md`).

#### 3.6.3 Technical & Interactive Architecture
1. **Decomposed Mermaid Diagram Suite (8 Focused Views Instead of One Unreadable Blob):**
   - **Diagram 1:** High-Level Subsystem & Core Architecture Overview (`flowchart TB`)
   - **Diagram 2:** Core Gameplay Triad & Per-Frame Control Loop (`GameManager` ↔ `LevelManager` ↔ `SpawnManager` ↔ `ShapeController`) (`flowchart LR`)
   - **Diagram 3:** Entity Spawning, Physics Collisions & Stack Adjacency Graph (`SpawnManager`, `ShapeController`, `PlatformController`, `DockColliderController`, `FloorColliderController`, `DamagePopup`) (`flowchart TB`)
   - **Diagram 4:** Level Progression, Data Models & Scoring Pipeline (`LevelManager`, `ScoreManager`, `LevelData`, `LevelInfo`, `LevelStatus`, `LevelMakerData`, `WorldData`, `WorldInfo`) (`flowchart LR`)
   - **Diagram 5:** UI Canvas Navigation, Camera Feedback & Audio/Platform Services (`UIManager`, `AnimatedButton`, `CameraController`, `Loader`, `SoundManager`, `Sound`, `RdWUtilities`, `AppInfo`, `EffectManager`) (`flowchart LR`)
   - **Diagram 6:** External Plugins, Packages & Unity Engine Dependencies (`flowchart LR`)
   - **Diagram 7:** Static Event, `UnityEvent` & `PlayerPrefs` Persistence Topology (`flowchart TB`)
   - **Diagram 8:** End-to-End Runtime Execution Sequence (`sequenceDiagram`)
2. **Interactive Pan & Zoom Engine (Vanilla JS + Pointer/Wheel Events):**
   - Every `.diagram-card` includes `+ Zoom In`, `- Zoom Out`, `100% Reset`, and `Fit` buttons, mouse-wheel zoom (`Ctrl`/wheel), click-and-drag panning (`pointerdown` / `pointermove` / `pointerup`), and live zoom percentage badge.
3. **Interactive Matrix Explorer & Search Filter:**
   - Filterable HTML tables for `Matrix A (27 × 27)`, `Matrix B (27 × 16)`, and `Matrix C (Hub & Risk Summary)` with subsystem filter pills and live text search.

#### 3.6.4 Validation Checks & Acceptance Criteria
- Single self-contained `.html` file requiring zero build steps; dark/slate architectural theme with high-contrast badges; all 8 Mermaid diagrams render and support independent pan/zoom/reset.

---

## 4. Prioritized Post-Analysis Engineering Remediation Roadmap

Based on the high-risk structural findings confirmed in the companion docs, engineering teams modifying `Assets/Scripts` should execute the following targeted fixes before adding new features:

| Priority | Target Script(s) | Confirmed Issue (Confirmed from companion docs) | Recommended Fix | Blast Radius |
|---|---|---|---|---|
| **P0 — Critical** | `SpawnManager.cs` (`LevelClearShapes`, lines 1454–1468) | Synchronous `while ((isdeletingshape) && (isdeletingplats)) { }` on the main thread permanently freezes Unity when called from `LevelManager.RestartSequence` / `NextLevelSequence` | Convert `LevelClearShapes()` into an `IEnumerator` coroutine using `yield return StartCoroutine(DestroyAllShapes())` and `yield return StartCoroutine(DestroyAllPlatforms())` | `SpawnManager.cs`, `LevelManager.cs` |
| **P0 — Critical** | `AnimatedButton.cs` (`onClick` getter, line 41) | `Debug.Log("1 onlick value=" + onClick)` inside `onClick.get` causes immediate `StackOverflowException` if read from C# | Log `m_OnClick` or remove the `Debug.Log` statement | `AnimatedButton.cs` |
| **P0 — Critical** | `LevelManager.cs` (`Start`) & `SpawnManager.cs` (`Start`) | Static events `FloorColliderController.levelstatusEvent` and `ShapeController.collisionEvent` are subscribed with `+=` in `Start()` and never unsubscribed (`-=`) in `OnDestroy()` | Add `OnDestroy()` in `LevelManager` and `SpawnManager` to unsubscribe static delegates | `LevelManager.cs`, `SpawnManager.cs` |
| **P1 — High** | `ShapeController.cs` (`LateUpdate` & `Release`) | `LateUpdate()` starts `Release()` every `0.5f`s on every idle docked shape, allocating 3 DOTween tweens repeatedly; `SetFaceProperties()` stacks infinite `DOFade` loops without killing prior tweens | Trigger `Release()` only once on drag-release transition; call `DOKill()` before starting `DOFade` loops | `ShapeController.cs` |
| **P1 — High** | `GameManager.cs` (`Update` & `ProcessCtrlGesture`) | Starts a new `ProcessCtrlGesture()` coroutine on every single drag frame (`lte.dragdelta.magnitude > 0`), causing premature `gestureprocessing = false` | Replace `ProcessCtrlGesture()` coroutine with a float cooldown timer (`lastDragTime`) in `Update()` | `GameManager.cs` |
| **P1 — High** | `LevelMakerData.cs` (`SetLevelMakerShapes`) & `LevelData.cs` | `SetLevelMakerShapes()` omits `l.li[0].CalculateNumSpecialShapes()`, leaving special shape counts at `0` in Level `0`; `LevelData.li[2..59]` are `null` | Call `l.li[0].CalculateNumSpecialShapes()` at the end of `SetLevelMakerShapes()`; guard `GetLevelData(levelnum)` against null entries | `LevelMakerData.cs`, `LevelData.cs`, `ScoreManager.cs` |
| **P2 — Medium** | `SoundManager.cs` (`StopSound`, line 102) & `DamagePopup.cs` (`Start`) | `StopSound(true)` selects `src = specialSfxSource` but calls `sfxSource.Stop()`; `DamagePopup.Start()` is empty and never sets `GetComponent<TMP_Text>().text = displayText` | Change line 102 of `SoundManager.cs` to `src.Stop()`; assign `GetComponent<TMP_Text>().text = displayText` in `DamagePopup.Start()` | `Game/SoundManager.cs`, `DamagePopup.cs` |
