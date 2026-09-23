# Scripts Dependency — Multi-Phase Implementation Plan

> Balance Stack Hero · Unity 2023.1.6f1 · Scope `Assets/Scripts` · Generated 2026-09-23
> Companion artifacts: [Scripts_Dependency_Map.md](Scripts_Dependency_Map.md) · [Scripts_Dependency_Showcase.html](Scripts_Dependency_Showcase.html) · [Scripts_Dependency_Matrix.csv](Scripts_Dependency_Matrix.csv) · [Scripts_Dependency_Matrix.json](Scripts_Dependency_Matrix.json) · Source corpus: [Scripts_Master_Index.md](Scripts_Master_Index.md)

---

## 1. Assumptions and Scope Notes

**Inputs available**
| Priority | Input | Status |
|---|---|---|
| Primary | 27 companion docs `*.cs.md` (one per C# file under `Assets/Scripts`, including `Game/`) | ✅ complete, 26 sections each |
| Secondary | `Scripts_Master_Index.md` | ✅ present |
| Tertiary | Source code (`Assets/Scripts/**/*.cs`), `Packages/manifest.json`, `ProjectSettings`, scene/prefab GUID scan, plugin sources under `Assets/Lean`, `Assets/Plugins`, `Assets/Mesh Explosion`, `Assets/ResurgamStudios` | ✅ used only to validate or clarify |

**What was missing / limits**
- Scene hierarchy wiring (which GameObject holds which Inspector reference) is not parsed. Inspector references are treated as *declared* dependencies, and runtime use is confirmed from the method bodies.
- UnityEvent **targets** were matched by method name only; the target component was not resolved from YAML.
- `Assets/Scripts[Orig]` is excluded (reference copy, per the project owner).

**Confidence boundaries**
- **Confirmed from companion docs**: a relationship stated in a companion doc and verified against the code (a call, field access, `GetComponent`, event `+=`).
- **Inferred from companion docs**: relationships implied by naming or usage (for example which UI component calls `PlayButtonPressed`).
- **Unknown from current scope**: external listeners of static events, UnityEvent targets inside prefabs, and callers outside `Assets/Scripts`.

**Node model decisions**
- **29 internal nodes:** the 27 files plus `ShapeInfo` and `PlatformInfo`, which are declared inside `SpawnManager.cs`. They are split out because five other scripts depend on them *as data types*, not on `SpawnManager`. Merging them would inflate SpawnManager's fan-in.
- External targets are grouped into **21 categories** (plugins, packages and Unity subsystems) to keep Matrix B readable. The JSON artifact keeps per-symbol detail.

---

## 2. Multi-Phase Implementation Plan

### Phase 0 — Corpus Discovery and Validation
| Field | Detail |
|---|---|
| **Objective** | Prove that the companion corpus covers every script, and that each doc is structurally complete. |
| **Source inputs** | `Assets/Scripts/**/*.cs` file list; `Docs/**/*.cs.md`; `Scripts_Master_Index.md` |
| **Extraction tasks** | Enumerate `.cs` files; enumerate `.cs.md` files; map 1:1 by relative path (`X.cs` → `Docs/X.cs.md`, `Game/X.cs` → `Docs/Game/X.cs.md`). |
| **Normalization tasks** | Canonical script id = the file stem; note multi-type files (`SpawnManager.cs` declares 3 types). |
| **Analysis tasks** | Count the `## N.` headings per doc (expect 26); resolve all relative links. |
| **Output artifacts** | Inventory table (§5 of the Map); coverage summary below. |
| **Validation checks** | `#cs == #cs.md`; every doc has 26 sections; 0 broken links. |
| **Risks / ambiguities** | Multi-type files; orphan scripts (no scene/prefab use). |
| **Acceptance criteria** | 100 % coverage, 0 malformed docs. |
| **Next-phase prerequisites** | Inventory frozen; node id list agreed. |

**Phase 0 results (executed):**
| Metric | Value |
|---|---|
| C# scripts found | 27 (22 root + 5 `Game/`; `UI/` empty) |
| Companion docs found | 27 (1:1 match) |
| Docs with the full 26-section structure | 27 / 27 |
| Master index | present |
| Broken relative links | 0 |
| Suspected mismatches | none. Multi-type file: `SpawnManager.cs` (+`ShapeInfo`, `PlatformInfo`) |

### Phase 1 — Schema Extraction From Companion Docs
| Field | Detail |
|---|---|
| **Objective** | Build a normalized entity list and edge list with relationship types and confidence. |
| **Source inputs** | Sections 1 (overview), 3 (entry points), 5 (method catalog), 9 (events), 12–14 (upstream/downstream/graph), 15 (data flow) of each doc |
| **Extraction tasks** | For each script: name, path, namespace (all global), base type, category, subsystem, entry points, public API, upstream, downstream, events, external systems. Harvest the relationship verbs "calls / reads / writes / subscribes / emits / GetComponent / FindObjectOfType / constructs". |
| **Normalization tasks** | Canonical short codes (for example `SM` = SpawnManager); script nodes are separated from external category nodes; aliases (`spwnmgr`, `spawnmgr`, `lvlmgr`, `scrmgr`, `scoremgr`, `gamemgr`, `gmgr`, `umgr`, `uimgr`, `camctlr`) collapse to the type. |
| **Analysis tasks** | Assign each edge one or more markers (C, R, W, E, S, I, G, D, ?), a class (structural / runtime / event / data / inferred) and a confidence. |
| **Output artifacts** | `Scripts_Dependency_Matrix.json` (nodes + edges), `Scripts_Dependency_Matrix.csv` (Matrix A) |
| **Validation checks** | Every edge cites a method or field; no self-edges; alias collapse verified. |
| **Risks** | Declared-but-unused fields (for example `AnimatedButton.uimgr`, `Loader.*`) are kept as `D` edges and flagged "declared only". |
| **Acceptance** | 63 internal edges and 64 external category edges, each with a confidence label. |
| **Next prerequisites** | Frozen edge list. |

### Phase 2 — Internal `Assets/Scripts` Dependency Graph
| Field | Detail |
|---|---|
| **Objective** | Directional script-to-script graph with hubs, clusters, leaves and cycles. |
| **Inputs** | Phase 1 edge list |
| **Extraction** | Filter edges to internal→internal. |
| **Normalization** | Remove external targets; keep ShapeInfo/PlatformInfo as nodes. |
| **Analysis** | Fan-in and fan-out per node; bidirectional pairs (cycle candidates); leaf nodes (fan-out 0); isolated nodes; subsystem clustering by shared edges and responsibility (Master Index §6). |
| **Artifacts** | Matrix A; ASCII overview; Mermaid internal graph (split into overview + 4 subsystem views + 2 hub-centred views) |
| **Validation** | Σ fan-in = Σ fan-out = 63. |
| **Risks** | Graph density around the SpawnManager/LevelManager pair means one graph is unreadable, so it is decomposed. |
| **Acceptance** | Hubs and cycles listed with counts. |
| **Next prerequisites** | Subsystem assignment. |

### Phase 3 — External Project / Plugin / Package Dependency Graph
| Field | Detail |
|---|---|
| **Objective** | Separate internal links from plugin, package and Unity-framework links. |
| **Inputs** | Companion doc §13–14, `using` directives, `Packages/manifest.json`, plugin folder locations |
| **Extraction** | For each script, the external symbols used (for example `Lean.Touch.LeanSelectable`, `DG.Tweening`, `EPOOutline.Outlinable`, `MeshExploder`, `CircularGravityForce.CGF`, `HighlightPlus.HighlightEffect`, `TMPro.TMP_Text`, `UnityEngine.UI.Text`, `Input`, `Physics`, `PlayerPrefs` …). |
| **Normalization** | Classify each target: **Third-party plugin** (Assets/Lean, Plugins/Demigiant, Plugins/Easy performant outline, Mesh Explosion, ResurgamStudios, HighlightPlus, Exploder); **Third-party plugin (project-modified)** (Lean Touch: `LeanTouchEvents.dragdelta`, `LeanTwistRotateAxis.RotateMe`, `LeanSelectable.SetOffSetValue`); **Unity package** (TextMeshPro 3.0.6, uGUI 1.0.0); **Unity built-in** (Physics, Input, Audio, Animator, PlayerPrefs, SceneManagement, Rendering …); **Unknown external symbol**. |
| **Analysis** | Count per category; flag Unity 6 migration-relevant APIs. |
| **Artifacts** | Matrix B; external ASCII map; Mermaid plugin view + Unity systems view |
| **Validation** | Every `using` that is actually used appears; imported-but-unused namespaces are marked `?`. |
| **Risks** | Project-modified plugin source: upgrading Lean Touch would overwrite the customizations. |
| **Acceptance** | Four link classes separated (internal / external-project / plugin-package / Unity). |
| **Next prerequisites** | Category list frozen. |

**Script → external project script (outside `Assets/Scripts`, not a plugin):** none found (Confirmed). All external code references resolve to third-party plugin folders or Unity.

### Phase 4 — Dependency Matrix Construction
| Field | Detail |
|---|---|
| **Objective** | Matrices A (internal), B (external), C (hub summary), and per-subsystem reduced matrices. |
| **Inputs** | Phase 2–3 graphs |
| **Tasks** | Render a 29×29 matrix with short codes; a 29×21 external matrix; compute fan-in/out, role, subsystem, blast radius, risk; reduced matrices for the Core, Gameplay, Data and Services subsystems. |
| **Artifacts** | Map §B-matrix, §C-matrix, §Hub; CSV/JSON |
| **Validation** | Markers consistent with the legend; counts match Phase 2. |
| **Risks** | Width in raw markdown; mitigated by short codes and subsystem sub-matrices. |
| **Acceptance** | All 3 required matrices present. |

### Phase 5 — ASCII-Art Markdown Dependency Atlas
| Field | Detail |
|---|---|
| **Objective** | A text-editor-friendly atlas. |
| **Tasks** | Sections A–F as required: executive summary, internal overview, external overview, subsystem maps, hubs, ambiguities. |
| **Artifact** | [Scripts_Dependency_Map.md](Scripts_Dependency_Map.md) |
| **Validation** | Renders legibly in a monospace editor; every claim carries a confidence label. |
| **Acceptance** | Sections A–F complete. |

### Phase 6 — HTML/CSS/JavaScript Mermaid Showcase
| Field | Detail |
|---|---|
| **Objective** | A responsive, self-contained, explorable atlas. |
| **Tasks** | Nine required sections; one card per diagram with a title, a caption and zoom/pan/reset controls; tables for the matrices; a legend; a sticky nav; a mobile layout. |
| **Tech** | Vanilla HTML/CSS/JS; **Mermaid 10.x from the jsDelivr CDN** (the only external dependency, documented in the page footer); custom SVG transform pan/zoom (mouse drag, wheel, touch drag, and buttons). |
| **Artifact** | [Scripts_Dependency_Showcase.html](Scripts_Dependency_Showcase.html) |
| **Validation** | Every Mermaid block renders; each card has +/−/reset; drag pans; the layout reflows at < 800 px. |
| **Risks** | Offline viewing means no Mermaid, so each card shows its Mermaid source as a fallback in a `<details>` block. |
| **Acceptance** | See the §7 checklist. |

---

## 3. Dependency Extraction Methodology

1. **Edge sources (in order of trust):** a companion doc §5 method catalog "Downstream" column, then §12/§13 traces, then §9 event wiring, then §4 field "Readers/Writers" columns. Each edge was spot-checked against the source line cited in the doc.
2. **Relationship markers:**

| Marker | Meaning | Typical evidence |
|---|---|---|
| `C` | calls a method | `lvlmgr.LevelLost()` |
| `R` | reads field/property | `spawnmgr.dockloc` read |
| `W` | writes field / mutates state | `spawnmgr.curshape = this` |
| `E` | emits an event consumed by the target | `levelstatusEvent()` → LevelManager |
| `S` | subscribes to the target's event | `ShapeController.collisionEvent += …` |
| `I` | inherits/implements | `: UIBehaviour, IPointerDownHandler` |
| `G` | obtains a reference (`GetComponent`, `Find*`) | `FindObjectOfType<SpawnManager>()` |
| `D` | structural/type dependency (field type, construction, parameter) | `new ShapeInfo()` |
| `?` | inferred / ambiguous / declared but unused | `AnimatedButton.uimgr` |

3. **Edge classes:** *structural* (D, I), *runtime* (C, R, W, G), *event-driven* (E, S), *data-driven* (the W/R of data models), *inferred* (?).
4. **Direction:** row → column means "row depends on column".
5. **Hub scoring:** fan-in (the number of distinct scripts depending on it) + fan-out (the number of distinct dependencies), with qualitative weighting by per-frame execution and state ownership.
6. **Confidence:** every edge in the JSON carries `confidence ∈ {confirmed, inferred, unknown}`.

---

## 4. Artifact Plan

| File | Contents | Why |
|---|---|---|
| `Scripts_Dependency_Implementation_Plan.md` | This roadmap, methodology, checklist, gaps | Required |
| `Scripts_Dependency_Map.md` | ASCII atlas, Matrices A/B/C, subsystem matrices, hubs, ambiguities | Required |
| `Scripts_Dependency_Showcase.html` | Responsive Mermaid atlas with pan/zoom | Required |
| `Scripts_Dependency_Matrix.csv` | Matrix A as CSV (29×29, markers) | **Optional.** Spreadsheet sorting and filtering, and diffing after refactors |
| `Scripts_Dependency_Matrix.json` | Nodes (id, name, path, type, subsystem, fan-in/out) + internal edges (markers, class, confidence, evidence) + external edges | **Optional.** Machine-readable input for future tooling (CI architecture checks, regenerating diagrams after refactors) |

---

## 5. Markdown Dependency Atlas Content
Generated as [Scripts_Dependency_Map.md](Scripts_Dependency_Map.md).

## 6. HTML Showcase Content
Generated as [Scripts_Dependency_Showcase.html](Scripts_Dependency_Showcase.html). Open it in any modern browser; an internet connection is required for the Mermaid CDN.

---

## 7. Validation Checklist

| # | Check | Result |
|---|---|---|
| 1 | Every script under `Assets/Scripts` is represented as a node | ✅ 27 files → 29 type nodes |
| 2 | All direct internal dependencies visible in the docs are captured | ✅ 63 edges; cross-checked against the §13 downstream traces of all 27 docs |
| 3 | External/plugin/Unity dependencies are separated from internal nodes | ✅ Matrix B and separate diagrams |
| 4 | All matrices use consistent markers | ✅ legend §3 |
| 5 | Hub scripts are identified from actual edge counts | ✅ Map §E (fan-in/out table) |
| 6 | No dependency is claimed without a confidence label | ✅ JSON `confidence`; Map tables flag `?` |
| 7 | The markdown atlas is readable in raw text | ✅ ASCII diagrams, short codes |
| 8 | The HTML is responsive and structured | ✅ CSS grid + breakpoint; semantic sections |
| 9 | Every major Mermaid diagram has pan/zoom/reset | ✅ generic card controller applied to every `.diagram` |
| 10 | Giant graphs are decomposed | ✅ overview + 4 subsystem views + 2 hub views + event view + external split in two |
| 11 | Ambiguities are explicitly called out | ✅ Map §F, HTML §8 |

---

## 8. Ambiguities / Gaps and Recommended Next Inspection Targets

| Gap | Why it matters | Next inspection |
|---|---|---|
| UnityEvent targets (rotation buttons, Play, SpawnManager.Button*, `ButtonClickSound`, `ToggleSound/Music`, `RateApp`, `OpenTwitterPage`) | Determines real UI fan-in | Parse `m_Target` fileIDs in `Game.unity` and the prefabs |
| Static event listeners outside Scripts (`SoundManager.*StatusChanged`) | Hidden fan-in | Search `Assets/**` (non-Scripts) |
| `EffectManager.instance` / `RdWUtilities` callers outside Scripts | Orphan vs dormant | Search template UI code (EasyMobile, CartoonGUI) |
| Lean Touch customizations | Plugin upgrade risk | Diff `Assets/Lean` against the vendor version |
| Root-level copies of the scripts under `Assets/` | Duplicate-type risk on reimport | Confirm they are excluded or delete them before the Unity 6 upgrade |
| Execution order settings | UIManager ↔ GameManager Awake order | `ProjectSettings/EditorBuildSettings` / Script Execution Order |
| Prefab collider composition | Validates the weighted-shape analysis | Inspect the 24 shape prefabs |
