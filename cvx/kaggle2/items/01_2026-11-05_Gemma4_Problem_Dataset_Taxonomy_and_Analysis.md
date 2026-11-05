# COMBINED MARKDOWN - combine

_Generated 2026-11-05 14:45:51 | 6 files | folder: D:\stuff\docs\taylor_fv\github\rayrite.github.io\cvx\kaggle2\items\combine_

## Contents

1. 00_README-antigrav_gemini4argon-high.md
2. 01_Deep_Wide_Research_and_Executive_Synthesis.md
3. 02_Multi_Dimensional_Problem_Taxonomy_and_Subcategories.md
4. 03_Repository_and_Subcategory_Engineering_Deep_Dives.md
5. 04_Complete_129_Task_Classified_Catalog.md
6. 05_Quality_Check_and_Table_Validation_Report.md

---

<!-- ====================================================================== -->
<!-- FILE: 00_README-antigrav_gemini4argon-high.md -->
<!-- ====================================================================== -->

# Deliverable Package: Kaggle Google Gemma 4 Developer Agent Problem Dataset Taxonomy & Deep-Wide Analysis

*Folder: `deliverables/2026-11-05_Gemma4_Problem_Dataset_Taxonomy_and_Analysis`*
*Source Package Analyzed: `input/kagglecomp/kagglecomp_data_package/` (`tasks.jsonl`, `HARNESS_README.md`, `gemma-4-developer-agent.zip`)*
*Date: 2026-11-05*

---

## 1. Deliverable Manifest & Navigation Guide

This deliverable suite provides an exhaustive, 100%-coverage examination and multi-axis taxonomic classification of all **129 benchmark problems** (and their accompanying 127 AST call graphs, 127 vector embedding archives, 129 repository snapshots, and 124 offline wheels) in the **Kaggle Google — The Gemma 4 Developer Agent Competition** ([https://www.kaggle.com/competitions/gemma-4-developer-agent/data](https://www.kaggle.com/competitions/gemma-4-developer-agent/data)).

| File | Title & Primary Contents | Target Reader / Use Case |
| :--- | :--- | :--- |
| **[`00_README.md`](file:///d:/stuff/ai-misc/_bsh2026/vscode_project01/101e-Kaggle-antigrav/deliverables/2026-11-05_Gemma4_Problem_Dataset_Taxonomy_and_Analysis/00_README.md)** | **Executive Deliverable Index & Quick-Reference Overview** — Package manifest, top-level category/sub-category summary tables, and key architectural findings. | Quick orientation and high-level lookup |
| **[`01_Deep_Wide_Research_and_Executive_Synthesis.md`](file:///d:/stuff/ai-misc/_bsh2026/vscode_project01/101e-Kaggle-antigrav/deliverables/2026-11-05_Gemma4_Problem_Dataset_Taxonomy_and_Analysis/01_Deep_Wide_Research_and_Executive_Synthesis.md)** | **Deep & Wide Research Report (`/rdw-deep-wide-research`)** — Synthesizes empirical findings from the 22.42 GB data package with academic research on SWE-bench failure modes (`arXiv:2509.13941`), `MAST` (`arXiv:2503.13657`), `Agentless`, `LocAgent`, `RepoGraph`, and IBM ODC. | Strategic planning, Paper Track ($35k) framing, and test-set transfer strategy |
| **[`02_Multi_Dimensional_Problem_Taxonomy_and_Subcategories.md`](file:///d:/stuff/ai-misc/_bsh2026/vscode_project01/101e-Kaggle-antigrav/deliverables/2026-11-05_Gemma4_Problem_Dataset_Taxonomy_and_Analysis/02_Multi_Dimensional_Problem_Taxonomy_and_Subcategories.md)** | **Multi-Dimensional Problem Taxonomy (Categories & Sub-Categories)** — Defines and quantifies all **6 Classification Axes** (48 primary categories/classes and 57 sub-categories), cross-tabulation matrices, and the **10 evolutionary multi-PR chains** inside `tasks.jsonl`. | Designing specialized sub-agents, LoRA routing, and prompt checklists |
| **[`03_Repository_and_Subcategory_Engineering_Deep_Dives.md`](file:///d:/stuff/ai-misc/_bsh2026/vscode_project01/101e-Kaggle-antigrav/deliverables/2026-11-05_Gemma4_Problem_Dataset_Taxonomy_and_Analysis/03_Repository_and_Subcategory_Engineering_Deep_Dives.md)** | **Repository & Subsystem Engineering Deep Dives** — Code-level breakdown of all 4 repositories (`fastapi/fastapi`, `Textualize/rich`, `psf/requests`, `encode/httpx`), file-level hotspots, diff idioms, and verification traps. | Domain-specific debugging and local `swegemma eval` analysis |
| **[`04_Complete_129_Task_Classified_Catalog.md`](file:///d:/stuff/ai-misc/_bsh2026/vscode_project01/101e-Kaggle-antigrav/deliverables/2026-11-05_Gemma4_Problem_Dataset_Taxonomy_and_Analysis/04_Complete_129_Task_Classified_Catalog.md)** | **Complete 129-Task Classified Catalog** — Master 129-row reference table (`#001`–`#129`) plus category-grouped breakdowns with exact file lists, diff statistics (`+A/-R`, files, hunks), and prompt summaries. | Per-task lookup, curriculum stratification, and error analysis |
| **[`05_Quality_Check_and_Table_Validation_Report.md`](file:///d:/stuff/ai-misc/_bsh2026/vscode_project01/101e-Kaggle-antigrav/deliverables/2026-11-05_Gemma4_Problem_Dataset_Taxonomy_and_Analysis/05_Quality_Check_and_Table_Validation_Report.md)** | **Quality Check & Markdown Table Validation Report** — Automated structural, alignment, pipe-balance, and arithmetic verification across all markdown tables in the deliverable suite. | Quality assurance and rendering verification |

---

## 2. Executive Snapshot: The 6-Axis Classification at a Glance

### 2.1. Axis 1: Primary Task Intent Categories & Sub-Categories (`129` Tasks)

| Primary Category (`Axis 1`) | Sub-Category (`Axis 1B`) | Tasks | Share (%) | `fastapi` | `rich` | `requests` | `httpx` |
| :--- | :--- | ---: | ---: | ---: | ---: | ---: | ---: |
| **`CAT-1: Functional Bug Fix & Edge-Case Resolution`** *(79 tasks, 61.24%)* | `SUB-1A: Type Annotation, Union & Signature Introspection Bug` | 14 | 10.85% | 9 | 3 | 2 | 0 |
| | `SUB-1B: Parameter Extraction, Aliasing & Form/Header/Query Coercion Bug` | 9 | 6.98% | 9 | 0 | 0 | 0 |
| | `SUB-1C: OpenAPI / JSON Schema Generation & Ref Resolution Bug` | 10 | 7.75% | 10 | 0 | 0 | 0 |
| | `SUB-1D: Terminal Cell Width, Unicode Grapheme & Segment Splitting Bug` | 8 | 6.20% | 0 | 8 | 0 | 0 |
| | `SUB-1E: Terminal Component Rendering, Styling & Markup/ANSI Parsing Bug` | 27 | 20.93% | 0 | 27 | 0 | 0 |
| | `SUB-1F: HTTP Protocol, URL/Header/Netrc Parsing & Lifecycle Bug` | 11 | 8.53% | 3 | 0 | 8 | 0 |
| **`CAT-2: New Feature & API Capability Addition`** *(23 tasks, 17.83%)* | `SUB-2A: Framework Core Feature & Endpoint/Router Capability` | 8 | 6.20% | 7 | 0 | 0 | 1 |
| | `SUB-2B: Type System, Dependency & Return-Type Feature Extension` | 7 | 5.43% | 6 | 0 | 1 | 0 |
| | `SUB-2C: Terminal & CLI Feature Enhancement` | 8 | 6.20% | 0 | 8 | 0 | 0 |
| **`CAT-3: Architectural Refactoring, Performance & Protocol Alignment`** *(13 tasks, 10.08%)* | `SUB-3A: Core Routing, Lifespan & Streaming Lifecycle Refactor` | 4 | 3.10% | 4 | 0 | 0 | 0 |
| | `SUB-3B: Performance Optimization & Fast-Path Execution` | 2 | 1.55% | 1 | 1 | 0 | 0 |
| | `SUB-3C: Standards, Security & Internal API Hygiene Refactor` | 7 | 5.43% | 5 | 1 | 1 | 0 |
| **`CAT-4: Ecosystem Compatibility, Deprecation & Legacy Removal`** *(7 tasks, 5.43%)* | `SUB-4A: Pydantic v1 Deprecation & Removal Lifecycle` | 4 | 3.10% | 4 | 0 | 0 | 0 |
| | `SUB-4B: Upstream Library Compatibility & Feature Deprecation` | 3 | 2.33% | 2 | 0 | 1 | 0 |
| **`CAT-5: Developer Experience (DX), Error Diagnostics & Guardrails`** *(3 tasks, 2.33%)* | `SUB-5A: Actionable Error Messages, Tracebacks & Circular Guards` | 3 | 2.33% | 3 | 0 | 0 | 0 |
| **`CAT-6: Documentation Tutorials & Maintainer Tooling`** *(4 tasks, 3.10%)* | `SUB-6A: Executable Documentation Tutorial (docs_src) Updates` | 3 | 2.33% | 3 | 0 | 0 | 0 |
| | `SUB-6B: Maintainer Release & Automation Scripts` | 1 | 0.78% | 1 | 0 | 0 | 0 |
| **Total Benchmark** | **All 17 Sub-Categories** | **129** | **100.00%** | **67** | **48** | **13** | **1** |

### 2.2. Axis 2: Transferable Root-Cause & Modification Mechanism Categories (`129` Tasks)

| Root-Cause Category (`Axis 2`) | Tasks | Share (%) | `fastapi` | `rich` | `requests` | `httpx` | Primary Sub-Categories Included (`Axis 2B`) |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: | :--- |
| **`RC-1: Type System, Introspection & Callable Unwrapping`** | 22 | 17.05% | 15 | 3 | 4 | 0 | `RC-1A` Generic/Union/Annotated (7), `RC-1B` Callable/Partial/Proxy Check (11), `RC-1C` Stringified/Forward Refs (4) |
| **`RC-2: Input Validation, Sanitization & Boundary Guard`** | 12 | 9.30% | 7 | 4 | 1 | 0 | `RC-2A` Protocol Boundary Validation (3), `RC-2B` Escaping/Control Sanitization (5), `RC-2C` Cycle/Self-Ref Guard (4) |
| **`RC-3: Data Structure, State & Dictionary Key / Alias Mapping`** | 23 | 17.83% | 17 | 5 | 1 | 0 | `RC-3A` Alias vs Name Lookup (4), `RC-3B` MultiDict `.getlist()` (4), `RC-3C` Shallow Copy/Cache Mutation (11), `RC-3D` Option Forwarding (4) |
| **`RC-4: Schema, Protocol & Specification Alignment`** | 18 | 13.95% | 12 | 0 | 6 | 0 | `RC-4A` OpenAPI/JSON Schema `$ref` (8), `RC-4B` HTTP/URL/Auth RFC Compliance (8), `RC-4C` Doc Constant Spec (2) |
| **`RC-5: Terminal Rendering, Cell Geometry & Style Propagation`** | 27 | 20.93% | 0 | 27 | 0 | 0 | `RC-5A` Unicode/Grapheme/Cell Math (7), `RC-5B` Style/Span Inheritance (9), `RC-5C` ANSI/Markup Regex (5), `RC-5D` Box/Padding Geometry (6) |
| **`RC-6: Ecosystem Compatibility, Deprecation & Legacy Cleanup`** | 8 | 6.20% | 7 | 0 | 1 | 0 | `RC-6A` Deprecation Warning Instrumentation (3), `RC-6B` Upstream API Migration (4), `RC-6C` Legacy Code Removal (1) |
| **`RC-7: New Module / Feature Synthesis`** | 13 | 10.08% | 6 | 7 | 0 | 0 | `RC-7A` Multi-Module Subsystem Synthesis (5), `RC-7B` Standalone Script Synthesis (1), `RC-7C` Extensibility/Env Hook (7) |
| **`RC-8: Performance & Resource Lifecycle Optimization`** | 6 | 4.65% | 3 | 2 | 0 | 1 | `RC-8A` Rust JSON / Lazy Import Fast-Path (2), `RC-8B` ExitStack / Stream / BrokenPipe Cleanup (4) |
| **Total Benchmark** | **129** | **100.00%** | **67** | **48** | **13** | **1** | **All 22 Root-Cause Sub-Categories (`RC-1A` – `RC-8B`)** |

---

## 3. Intermediate Scratch Files Reference

All intermediate extraction scripts, raw digests, and JSON classification tables generated during this study are preserved in:
- [`scratch/2026-11-05_dataset_analysis/`](file:///d:/stuff/ai-misc/_bsh2026/vscode_project01/101e-Kaggle-antigrav/scratch/2026-11-05_dataset_analysis)
  - `all_129_tasks_digest.md` — Raw 903-line per-task prompt and diff inspection digest.
  - `classified_129_records.json` — Complete machine-readable JSON classification for all 129 tasks across all 6 axes.
  - `aggregated_axis_stats.json` — Pre-computed statistical aggregations across every category, sub-category, and repository.
  - `classify_all_129.py`, `compute_full_stats.py`, `compute_agg_stats.py`, `generate_taxonomy_and_catalog.py`, `generate_deep_dives_and_catalog.py` — Reproducible analysis and table generation pipeline.


---

<!-- ====================================================================== -->
<!-- FILE: 01_Deep_Wide_Research_and_Executive_Synthesis.md -->
<!-- ====================================================================== -->

# Deep & Wide Research Report: Kaggle Google Gemma 4 Developer Agent Problem Dataset & Taxonomy

*Research scope: Multi-angle empirical analysis and taxonomic classification of the 129 public benchmark problems, AST call graphs, dense vector embeddings, and verification harness in the Kaggle Google — The Gemma 4 Developer Agent Competition (`input/kagglecomp/kagglecomp_data_package`), contextualized with external research on SWE-bench failure modes, graph-guided localization, Orthogonal Defect Classification (ODC), and target Python library architectures.*
*As of: 2026-11-05 — Active Kaggle Featured Competition (Start: September 23, 2026; Paper Track Deadline: November 12, 2026; Final Submission Deadline: December 2, 2026).*

---

## Executive Summary

The public development dataset (`tasks.jsonl` and `gemma-4-developer-agent.zip`) for **Google — The Gemma 4 Developer Agent Competition** contains **129 verified Python software engineering tasks** spanning **127 unique base commits** across four foundational open-source libraries: **`fastapi/fastapi`** (67 tasks, 51.94%), **`Textualize/rich`** (48 tasks, 37.21%), **`psf/requests`** (13 tasks, 10.08%), and **`encode/httpx`** (1 task, 0.78%). Exhaustive inspection of all 129 task prompts, reference patches (`patch`), and verification test patches (`test_patch`) reveals that the dataset is **not** a uniform collection of isolated bug reports: while **61.24% (79/129)** are functional bug fixes, **17.83% (23/129)** are net-new feature additions, **10.08% (13/129)** are architectural/performance/protocol refactorings, **5.43% (7/129)** are ecosystem compatibility and deprecation migrations, **2.33% (3/129)** are developer-experience (DX) diagnostic improvements, and **3.10% (4/129)** are executable documentation tutorials (`docs_src/`) or maintainer release scripts (`scripts/prepare_release.py`).

Furthermore, every single `problem_statement` in `tasks.jsonl` was mined from a **GitHub Pull Request title and body** rather than an original issue thread, with `hints_text` completely empty (`""`) across all 129 instances. This curation choice creates two critical operational hazards in the air-gapped (`network_mode="none"`) evaluation container: **(1) 22.48% (29/129) of tasks have ultra-terse or opaque prompts** (`<180` characters, including 24 `Textualize/rich` PRs such as `"fix fonts | Fixes https://github.com/Textualize/rich/issues/3943"`) where the linked GitHub issue cannot be fetched offline and the agent must infer the bug from code neighborhood inspection; and **(2) 6.98% (9/129) of tasks have hidden `docs_src/` tutorial-file coupling**, where Phase 2 `pytest` verification executes new `tests/test_tutorial/...` files that import newly created tutorial scripts (`docs_src/.../tutorial001_py310.py`) never named in the prompt. Finally, because the hidden competition evaluation split (~120 tasks across public and private leaderboards) is curated from **private repositories** using the same mining pipeline, agents and LoRA adapters must generalize across **universal root-cause mechanisms** (type/callable introspection, mutable state/alias handling, schema/protocol compliance, and graph-guided localization) rather than overfitting to `fastapi` or `rich` file paths.

---

## 1. Competition Architecture, Hardware Envelope & Dataset Fingerprint

Hosted by Google DeepMind with a **\$100,000 prize pool** (\$65,000 main leaderboard track + \$35,000 research paper track), the Gemma 4 Developer Agent Competition challenges participants to post-train and configure an open-weights **Gemma 4 31B** model (`gemma-4-31b-it-qat-w4a16-ct`, W4A16 quantized) into an autonomous coding agent ([Kaggle Overview](https://www.kaggle.com/competitions/gemma-4-developer-agent/overview); [Kaggle Data](https://www.kaggle.com/competitions/gemma-4-developer-agent/data)). Unlike standard SWE-bench evaluations where arbitrary Python scaffolding can call proprietary cloud APIs, submissions are compiled by a sandboxed declarative YAML engine (`adk-submission`) into Google Agent Development Kit (ADK) agent hierarchies (`LlmAgent`, `SequentialAgent`, `ParallelAgent`, `LoopAgent`) with optional multi-LoRA adapters (`adapters/<name>/adapter_model.safetensors`, up to 8 concurrent LoRAs at rank $r \le 128$ within a `< 3 GiB` total unpacked archive limit) ([HARNESS_README.md](file:///d:/stuff/ai-misc/_bsh2026/vscode_project01/101e-Kaggle-antigrav/input/kagglecomp/kagglecomp_data_package/HARNESS_README.md)).

| Package Artifact / Directory | Archive Entry Count | Uncompressed Size | Compressed Size | Primary Role in `swegemma` Evaluation Stack |
| :--- | ---: | ---: | ---: | :--- |
| **`tasks.jsonl`** | 1 | 1.98 MB | 0.29 MB | 129 public benchmark instances (`instance_id`, `repo`, `base_commit`, `problem_statement`, `hints_text`, `patch`, `test_patch`, `created_at`) |
| **`snapshots/*.tgz`** | 129 | 21,496.84 MB | 21,502.58 MB | Full Git repositories frozen at `base_commit` via `git fast-export` (zero future commit history) |
| **`graphs/*.json`** | 127 | 422.05 MB | 36.05 MB | Serialized NetworkX `MultiDiGraph` AST call graphs (`<repo_short>_<base_commit>.json`) backing `get_code_neighbors` and `get_code_subgraph` |
| **`embeddings/*.npz`** | 127 | 467.55 MB | 362.87 MB | 256-dimensional `float32` node embeddings (`<repo_short>_<base_commit>.npz`) backing `search_similar_code` |
| **`wheels/*.whl`** | 124 | 27.81 MB | 27.19 MB | Pre-compiled offline Python wheels mounted at `/wheels` inside air-gapped Docker sandboxes |
| **`docker/*` & `sandbox/setup.py`** | 5 | 0.04 MB | 0.01 MB | Python 3.13 container specification, `imp.py`/`telnetlib.py` shims, and fast-path editable installer |
| **`sample_submission/*`** | 10 | 0.44 MB | 0.17 MB | Reference ADK declarative agent (`agent.yaml`, `sub_agents/code_analyzer.yaml`, `skills/repo_navigation`) |
| **`HARNESS_README.md`** | 1 | 0.05 MB | 0.02 MB | Technical specification of `swegemma`, `adk-submission`, and `adk-eval-core` |
| **Total (`gemma-4-developer-agent.zip`)** | **524** | **22,416.76 MB** | **21,929.29 MB** | Complete offline development package (`input/kagglecomp/kagglecomp_data_package`) |

The hardware and execution constraints described in [HARNESS_README.md](file:///d:/stuff/ai-misc/_bsh2026/vscode_project01/101e-Kaggle-antigrav/input/kagglecomp/kagglecomp_data_package/HARNESS_README.md) directly shape how agents interact with different problem categories:
- **Inference Server Envelope**: vLLM serves `gemma-4-31b-it-qat-w4a16-ct` across **4 × NVIDIA L4 GPUs** (`96 GB` total VRAM, `tensor_parallel_size=4`, `gpu_memory_utilization=0.80`) with a hard context window ceiling of **`max_model_len = 32,768` tokens**, `tool_call_parser = "gemma4"`, and `reasoning_parser = "gemma4"`. To prevent multi-turn trajectories from overflowing 32,768 tokens, the harness enables ADK `EventsCompactionConfig` (`compaction_interval=5`, `token_threshold=14,336`).
- **Two-Phase Hermetic Verification**: In Phase 1 (`Container A`), the agent explores `/workspace` using 9 built-in tools (`run_command`, `read_file`, `edit_file`, `write_file`, `get_code_neighbors`, `search_similar_code`, `get_code_subgraph`, `get_status`, `submit_patch`). In Phase 2 (`Container B`), the harness extracts `git add -N . && git diff --binary`, applies the patch to a fresh baseline via a 4-pass resilient `git apply`/`patch` engine, **forcefully resets any agent edits to `tests/` or test runner configs** (`conftest.py`, `pytest.ini`, `pyproject.toml`, `setup.cfg`, `tox.ini`), applies `task.test_patch`, and validates JUnit XML output (`exit_code == 0`, `passed_tests > 0`, `failures == 0`, `errors == 0`, and zero skipped target tests).

---

## 2. Empirical Anatomy of the 129 Tasks: Repository Skew, Temporal Horizon & Curation Artifacts

A macro-level statistical audit of `tasks.jsonl` demonstrates pronounced structural differences across the four included repositories in both patch granularity and problem prompt construction:

| Repository (`repo`) | Tasks | Share (%) | Unique Commits | Date Range (`created_at`) | Avg Files Changed | Avg Hunks | Mean Line Churn | Median Line Churn | Mean Prompt Length (Chars) | Mean Test Lines Added |
| :--- | ---: | ---: | ---: | :--- | ---: | ---: | ---: | ---: | ---: | ---: |
| **`fastapi/fastapi`** | 67 | 51.94% | 67 | `2025-09-16` to `2026-06-20` | 2.46 | 6.87 | 114.9 | 18 | 1,110 | 144.4 |
| **`Textualize/rich`** | 48 | 37.21% | 47 | `2023-07-29` to `2026-04-12` | 1.90 | 4.10 | 287.2 | 10 | 486 | 31.3 |
| **`psf/requests`** | 13 | 10.08% | 12 | `2023-12-16` to `2026-06-09` | 1.15 | 1.54 | 6.8 | 4 | 434 | 12.5 |
| **`encode/httpx`** | 1 | 0.78% | 1 | `2025-09-19` to `2025-09-19` | 7.00 | 18.00 | 79.0 | 79 | 243 | 5.0 |
| **All Repositories** | **129** | **100.00%** | **127** | **`2023-07-29` to `2026-06-20`** | **2.16** | **5.39** | **167.8** | **12** | **803** | **87.9** |

Four load-bearing empirical observations emerge from inspecting the raw records behind this table:

1. **Median Patch Size Is Small (12 Lines), but Heavy-Tail Architectural Outliers Skew the Mean (167.8 Lines)**: Across all 129 tasks, **59.69% (77/129)** modify a single file in 1–3 hunks with $\le 35$ lines of total churn (`TIER-1` and `TIER-2`). However, the mean churn is inflated by 12 large-scale multi-file tasks (`TIER-5`), led by `rich_3930` (`+12,170 / -544` lines across 26 files replacing `rich/_cell_widths.py` with 23 versioned Unicode grapheme tables), `fastapi_14609` (`+192 / -1,855` lines across 20 files dropping `pydantic.v1`), `fastapi_15745` (`+939 / -291` lines refactoring `APIRouter` route context preservation), `fastapi_15800` (`+649 / -5` lines adding `app.frontend()`), and `fastapi_15030` (`+525 / -35` lines adding `fastapi/sse.py`).
2. **Pull-Request Mining Rather Than Issue Mining**: Every `instance_id` in `tasks.jsonl` corresponds to a **GitHub Pull Request number**, and `problem_statement` is populated directly from the PR title and PR description. In `fastapi/fastapi`, **100% (67/67)** of prompts begin with a Gitmoji commit-type indicator (`🐛` Bug Fix: 36, `✨` Feature: 13, `♻️` Refactor: 7, `📝` Docs: 3, `🚸` DX/UX: 2, `🔊` Warning: 2, `🔒️` Security: 1, `🗑️` Deprecation: 1, `➖` Removal: 1, `⬆️` Upgrade: 1, `👷` CI/Release: 1).
3. **Zero `hints_text` & Air-Gapped Issue Link Blindness**: Although the `tasks.jsonl` schema includes a `hints_text` field, **0 out of 129 tasks have non-empty `hints_text`**. When a maintainer opens a PR with a two-word title and an external GitHub issue URL—most notably in `Textualize/rich`, where **50.00% (24/48)** of prompts are under 180 characters (e.g., `rich_3676`: `"Notes | Add support for Exception.__notes__"`, `rich_3944`: `"fix fonts | Fixes https://github.com/Textualize/rich/issues/3943"`, `rich_3934`: `"empty live | Fixes https://github.com/Textualize/rich/issues/3796"`)—the agent cannot access GitHub inside `Container A` (`network_mode="none"`).
4. **Sequential Commit Chains & Direct Reversals Inside the Benchmark**: Because the curation pipeline mined multiple commits along the same repository development branch between 2023 and June 2026, `tasks.jsonl` contains **10 multi-PR evolutionary chains** where one task directly builds upon, fixes a regression from, or **reverts** another task in the same dataset. Most strikingly, `requests_6644` (Feb 2024) *adds* `if url.startswith("//"): url = f"/{url.lstrip('/')}"` in `src/requests/adapters.py`, whereas `requests_7315` (May 2026) *deletes those exact two lines* because collapsing leading slashes broke AWS S3 presigned URL signatures!

---

## 3. Multi-Angle Synthesis: Academic Defect Taxonomies & Agent Failure Fingerprints

Recent empirical literature on SWE-bench and automated program repair provides a rigorous lens for classifying the 129 `swegemma` tasks and predicting how a 31B open model behaves across them:

- **Three-Phase Failure Taxonomy on SWE-bench (`arXiv:2509.13941`)**: Liu et al. (*An Empirical Study on Failures in Automated Issue Solving*) analyzed 150 failed SWE-bench-Verified trajectories across **3 primary phases (Localization, Repair, Verification), 9 main categories, and 25 subcategories**, demonstrating that while pipeline architectures (`Agentless`, Xia et al., `arXiv:2407.01489`) fail primarily from upstream localization misses, **autonomous tool-using agents fail predominantly from flawed causal reasoning, premature patch generation, and cognitive deadlocks** (repetitive search/edit loops that pollute the context window).
- **Multi-Agent System Failure Taxonomy (`MAST`, Cemri et al., `arXiv:2503.13657`)**: Maps 14 failure modes across specification ambiguity, inter-agent misalignment, and premature termination/verification bypass—directly explaining why `HARNESS_README.md` recommends isolating file/graph exploration inside a read-only `AgentTool` (`skip_summarization: true`) so exploratory tool outputs do not crowd out the root coder agent's 32,768-token context window.
- **Orthogonal Defect Classification (`ODC`) & Python Benchmarks (`BugsInPy`)**: Mapping the 129 `swegemma` reference diffs against IBM's ODC defect types (*Checking*, *Assignment/Initialization*, *Algorithm/Logic*, *Interface/Parameter*, *Function/Class Synthesis*, *Build/Package/Compat*) and Python runtime semantics reveals **8 distinct Root-Cause & Modification Mechanism Categories (`RC-1` through `RC-8`)**. Unlike Java benchmarks (Defects4J), Python framework defects in `fastapi`, `requests`, and `rich` cluster heavily around **runtime type/callable introspection** (`RC-1`: 17.05% — unpacking `Annotated`, `UnionType`, PEP 695 `TypeAliasType`, `inspect.unwrap`, `functools.partial`, `__getattr__` proxy wrappers), **mutable collection/alias mapping** (`RC-3`: 17.83% — `MultiDict.getlist()`, Pydantic `validation_alias` vs `field.name`, shallow-copy dict mutation, hash/cache invalidation), and **terminal cell/style geometry** (`RC-5`: 20.93%).

---

## 4. Code Intelligence Graph (`graphs/*.json`) & Embedding (`embeddings/*.npz`) Analysis

A signature feature of the Gemma 4 Developer Agent Competition (and a primary topic for the \$35,000 Paper Track) is the inclusion of pre-computed AST dependency graphs and 256-dimensional node embeddings ([Kaggle Overview](https://www.kaggle.com/competitions/gemma-4-developer-agent/overview)). Recent research frameworks such as **LocAgent** (ACL 2025, `arXiv:2503.09089`), **RepoGraph** (ICLR 2025, `arXiv:2410.14684`), and **CodexGraph** (NAACL 2025) demonstrate that $k$-hop graph traversal over AST and call relations significantly boosts localization accuracy for 32B-scale open models compared to flat text search.

However, our programmatic inspection of all **127 graph JSON files** (`422.05 MB`) and **127 embedding `.npz` archives** (`467.55 MB`) inside `gemma-4-developer-agent.zip` uncovered four structural realities that every competitor must account for:

| Repository (`repo`) | Unique Graphs | Nodes (Min–Max) | Nodes (Mean) | Edges (Min–Max) | Edges (Mean) | Core Library Nodes (%) | Test Suite Nodes (`tests.*`) (%) | Docs/Scripts/Examples Nodes (%) |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| **`fastapi/fastapi`** | 67 | 3,238–4,597 | 3,967.5 | 1,988–2,780 | 2,457.9 | 8.07% (`fastapi.*`) | **76.35%** (`tests.*`) | 15.58% (`docs_src`, `scripts`) |
| **`Textualize/rich`** | 47 | 1,920–2,021 | 1,970.2 | 5,464–5,786 | 5,625.4 | 52.98% (`rich.*`) | **42.53%** (`tests.*`) | 4.49% (`benchmarks`, `examples`) |
| **`psf/requests`** | 12 | 711–759 | 735.2 | 1,748–1,884 | 1,824.7 | 39.39% (`requests.*`) | **60.47%** (`tests.*`) | 0.14% (`docs.*`) |
| **`encode/httpx`** | 1 | 740–740 | 740.0 | 1,618–1,618 | 1,618.0 | 80.54% (`httpx.*`, `ahttpx.*`) | **19.46%** (`tests.*`) | 0.00% |

1. **Archive File Naming vs. Documentation**: While the Kaggle Data description states there are 256 files per directory (`129 task-named files hard-linked to 127 commit-named files`), `gemma-4-developer-agent.zip` ships strictly the **127 commit-named files** (`graphs/<repo_short>_<base_commit>.json` and `embeddings/<repo_short>_<base_commit>.npz`), because two pairs of tasks share identical base commits (`rich_3882` & `rich_3894` share `rich_4d6d631a3d...`; `requests_6629` & `requests_6589` share `requests_7a13c041db...`).
2. **Single Edge Type (`"calls"` Lowercase Only)**: Across all 127 graphs and **452,588 total edges**, **100% of edges have `"type": "calls"` (lowercase)**. Even though `HARNESS_README.md` Section 6.3 lists uppercase examples (`edge_type="CALLS"`, `"DEFINED_IN"`, `"IMPORTS"`), passing an uppercase or non-`calls` filter to `get_code_neighbors(node, edge_type=...)` will fail to match if filtered literally; agents should omit `edge_type` (`edge_type=None`).
3. **Test-Node Dominance in Embeddings & Neighbors**: In `fastapi/fastapi`, **76.35% of all graph and embedding nodes belong to `tests.*`** and **10.18% belong to `docs_src` tutorials**, leaving only **8.07% (344 nodes)** in core `fastapi.*`! Similarly, `tests.*` accounts for **60.47%** of nodes in `psf/requests` and **42.53%** in `Textualize/rich`. Consequently, `search_similar_code(query)` and `get_code_neighbors(node)` return predominantly test functions and tutorial snippets—which is a double-edged sword: noisy if the agent blindly edits returned nodes, but **extremely valuable for discovering which existing test file covers a target symbol**.
4. **Module-Level Constant & Net-New File Blind Spots (`GRAPH-2`, `GRAPH-3`, `GRAPH-4`)**: Because the AST graph builder indexes only `class` and `def`/`async def` definitions, **module-level dictionaries, regex constants, and templates** (such as `rich/default_styles.py`, `rich/_export_format.py`, `src/requests/status_codes.py`, `fastapi/openapi/utils.py`'s `validation_error_definition`, and `rich/highlighter.py` class attribute regexes) are **not** individual callable nodes in the graph (`6.98%` of tasks fall into `GRAPH-2`, `GRAPH-3`, or `GRAPH-4`).

---

## 5. Strategic Implications for the Hidden Test Set (~120 Private-Repo Tasks)

According to the official dataset documentation ([Kaggle-02-Data.md](file:///d:/stuff/ai-misc/_bsh2026/vscode_project01/101e-Kaggle-antigrav/input/kagglecomp/docs/markdown/Kaggle-02-Data.md)), the hidden evaluation test set comprises **approximately 120 tasks** split evenly between the public and private leaderboards (~60 public, ~60 private), **curated from a set of private repositories** using the exact same commit/PR mining pipeline, AST graph/embedding generator, and two-phase `pytest` verification harness, filtered such that a frontier model passes or comes within one test case of passing.

This carries three decisive architectural implications for agent design and post-training:
1. **Prompt Curation Artifacts Will Persist in the Test Set**: Because the test set uses the same automated commit/PR mining pipeline, competitors must expect the same distribution of **PR-style prompts** (ranging from explicit change summaries to terse `Fixes #...` descriptions without `hints_text`) and potential multi-file feature additions (`~15–20%` of tasks).
2. **Transferable Taxonomic Priors Over Repo Memorization**: Hardcoding `fastapi/dependencies/utils.py` or `rich/cells.py` heuristics into prompts or LoRA weights will yield zero gain on the private test repositories. Instead, agent instructions, skills, and LoRA training trajectories should target the **transferable Root-Cause Categories (`RC-1` through `RC-8`)**:
   - **Python Type & Callable Introspection (`RC-1`, 17.05%)**: Always check `typing.Annotated`, `types.UnionType` (`A | B`), PEP 695 `TypeAliasType`, `inspect.unwrap()`, `functools.partial`, `inspect.isclass()`, and `__getattr__` proxy objects (`hasattr` fallback alongside `isinstance(..., Protocol)`).
   - **Mutable State, Shallow Copy & Alias Key Consistency (`RC-3`, 17.83%)**: Check whether dicts/lists are mutated across iterations (`copy.deepcopy()`, `.copy()`), whether multi-value mappings require `.getlist()`, and whether cached hashes (`_hash = None`) are invalidated on mutation.
   - **Graph-to-Test Localization Workflow**: When a prompt is terse (`PC-5`), use `get_code_neighbors(symbol)` to locate both the implementation callers/callees **and** the existing `tests/test_*.py` functions covering that subsystem, run `pytest` on that targeted test file via `run_command` to establish a fast reproduction baseline, apply minimal surgical edits via `edit_file`, clean up any untracked scratch files in `/workspace` (keeping reproduction scripts in `/tmp/`), and explicitly call `submit_patch()`.

---

## 6. Open Questions / Where the Evidence Runs Out

1. **Exact Domain Composition of the Private Test Repositories**: While `Kaggle-02-Data.md` confirms the ~120 test tasks come from private repositories curated with the same pipeline and Python 3.13 wheel cache, the exact domains of those private repositories (e.g., whether they are web/API services, CLI/data-processing libraries, or internal Google Python packages) are intentionally withheld. However, the 124 pre-compiled wheels in `wheels/` (which include `pydantic`, `starlette`, `urllib3`, `httpcore`, `anyio`, `pytest`, `click`, `typer`, `pygments`, `markdown-it-py`, `httpx`, `requests`, `rich`, `fastapi`) constrain the dependency ecosystem available inside the air-gapped test containers.
2. **Handling of Documentation/Tutorial Files in Private Repos**: In the public `fastapi` split, 9 tasks require creating or updating `docs_src/.../tutorial*.py` files because FastAPI's test suite (`tests/test_tutorial/`) directly imports `docs_src/`. Whether the private test repositories use an analogous `docs_src/`-importing test pattern is unverified; however, inspecting existing `tests/` conventions in `/workspace` during Phase 1 allows an agent to detect such conventions dynamically.

---

## 7. Sources

1. **Markowitz et al. (2026)** — *Google - The Gemma 4 Developer Agent Competition (Overview, Data & Rules)*, Google DeepMind / Kaggle (`https://www.kaggle.com/competitions/gemma-4-developer-agent`, local snapshots in [Kaggle-01-Overview.md](file:///d:/stuff/ai-misc/_bsh2026/vscode_project01/101e-Kaggle-antigrav/input/kagglecomp/docs/markdown/Kaggle-01-Overview.md) and [Kaggle-02-Data.md](file:///d:/stuff/ai-misc/_bsh2026/vscode_project01/101e-Kaggle-antigrav/input/kagglecomp/docs/markdown/Kaggle-02-Data.md), captured September 29, 2026).
2. **`swegemma` Evaluation Harness Technical Reference (2026)** — [HARNESS_README.md](file:///d:/stuff/ai-misc/_bsh2026/vscode_project01/101e-Kaggle-antigrav/input/kagglecomp/kagglecomp_data_package/HARNESS_README.md) (`input/kagglecomp/kagglecomp_data_package/HARNESS_README.md`, September 29, 2026).
3. **Public Benchmark Dataset & Archive (2026)** — [tasks.jsonl](file:///d:/stuff/ai-misc/_bsh2026/vscode_project01/101e-Kaggle-antigrav/input/kagglecomp/kagglecomp_data_package/tasks.jsonl) and `gemma-4-developer-agent.zip` (`input/kagglecomp/kagglecomp_data_package/`, September 25–29, 2026).
4. **Liu et al. (2025)** — *An Empirical Study on Failures in Automated Issue Solving*, arXiv preprint `arXiv:2509.13941` (3-phase, 9-category, 25-subcategory SWE-bench failure taxonomy).
5. **Cemri et al. (2025)** — *Why Do Multi-Agent LLM Systems Fail? (MAST Taxonomy)*, arXiv preprint `arXiv:2503.13657`.
6. **Xia et al. (2024)** — *Agentless: Demystifying LLM-based Software Engineering Agents*, arXiv preprint `arXiv:2407.01489`.
7. **Chen et al. (2025)** — *LocAgent: Graph-Guided LLM Agents for Code Localization*, ACL 2025 / `arXiv:2503.09089`.
8. **Ouyang et al. (2025)** — *RepoGraph: Enhancing AI Software Engineering with Repository-level Code Graph*, ICLR 2025 / `arXiv:2410.14684`.
9. **Chillarege et al. (1992) & Widyasari et al. (2020)** — *Orthogonal Defect Classification (ODC)* (IBM Research) and *BugsInPy: A Database of Existing Bugs in Python Programs to Enable Controlled Testing and Debugging Studies* (ESEC/FSE).


---

<!-- ====================================================================== -->
<!-- FILE: 02_Multi_Dimensional_Problem_Taxonomy_and_Subcategories.md -->
<!-- ====================================================================== -->

# Multi-Dimensional Problem Taxonomy: Categories & Sub-Categories (`tasks.jsonl`)

*Dataset Analyzed: `input/kagglecomp/kagglecomp_data_package/tasks.jsonl` (129 Benchmark Tasks across 127 Unique Commits)*
*Date: 2026-11-05*

---

## 1. Overview of the 6-Axis Classification Framework

Because software engineering agent performance depends simultaneously on **what is being asked** (task intent), **why the code is broken or incomplete** (root-cause mechanism), **where the code lives** (architectural subsystem), **how clearly the prompt specifies the target** (offline prompt solvability), **how large and graph-reachable the edit is** (patch complexity & AST graph reachability), and **how the failure manifests at runtime** (exception/verification phenotype), a single flat label cannot capture the full structure of the dataset.

We therefore classify every single one of the **129 problems** across **six orthogonal taxonomic axes**, comprising **48 primary categories/classes** and **57 fine-grained sub-categories**:

| Taxonomic Axis | Primary Categories / Tiers | Fine-Grained Sub-Categories | Primary Purpose for Agent Engineering & Post-Training |
| :--- | ---: | ---: | :--- |
| **Axis 1: Primary Task Intent & Archetype** | 6 (`CAT-1` to `CAT-6`) | 17 (`SUB-1A` to `SUB-6B`) | Distinguishes reactive bug fixing (61.24%) from net-new feature synthesis (17.83%), architectural refactoring (10.08%), and deprecation/tooling tasks. |
| **Axis 2: Root-Cause & Modification Mechanism** | 8 (`RC-1` to `RC-8`) | 22 (`RC-1A` to `RC-8B`) | Adapts IBM Orthogonal Defect Classification (ODC) to Python AST/runtime semantics; identifies transferable bug patterns for LoRA training and review checklists. |
| **Axis 3: Repository & Architectural Subsystem** | 4 Repositories | 18 Subsystems | Maps exact module boundaries and file hot-spots across `fastapi/fastapi` (7), `Textualize/rich` (6), `psf/requests` (4), and `encode/httpx` (1). |
| **Axis 4: Prompt Clarity & Offline Solvability** | 5 (`PC-1` to `PC-5`) | — | Quantifies information density in air-gapped (`network_mode="none"`) execution, isolating opaque issue-link prompts (22.48%) and `docs_src/` tutorial-coupled tasks (6.98%). |
| **Axis 5: Patch Complexity & Graph Reachability** | 5 Tiers (`TIER-1` to `TIER-5`) | 4 Graph Classes (`GRAPH-1` to `GRAPH-4`) | Stratifies tasks by file/hunk/line dispersion and measures whether `get_code_neighbors` / `search_similar_code` can directly index the target symbol (93.02% vs. 6.98% blind spots). |
| **Axis 6: Runtime Failure & Verification Phenotype** | 8 (`FM-1` to `FM-8`) | — | Classifies the observable test failure symptom (`TypeError`, `ValidationError`, HTTP status mismatch, infinite loop, visual terminal corruption, silent state bug). |

---

## 2. Axis 1: Primary Task Intent & Engineering Archetype Taxonomy (`CAT-1` to `CAT-6`)

### 2.1. Primary Categories (`CAT-1` through `CAT-6`)

| Primary Category (`Axis 1`) | Tasks | Share (%) | `fastapi` | `rich` | `requests` | `httpx` | Avg Files | Avg Hunks | Mean Churn | Med Churn | Technical Scope & Defining Characteristics |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | :--- |
| **CAT-1: Functional Bug Fix & Edge-Case Resolution** | 79 | 61.24% | 31 | 38 | 10 | 0 | 1.13 | 1.95 | 15.1 | 7 | Defects where existing library functionality crashes, raises an unintended exception, misparses input, or renders corrupted output on valid edge-case inputs. |
| **CAT-2: New Feature & API Capability Addition** | 23 | 17.83% | 13 | 8 | 1 | 1 | 3.83 | 8.96 | 647.0 | 34 | Net-new public APIs, decorators, environment flags, protocol support (SSE, SPA frontend, keep-alive), or new type/callable capabilities. |
| **CAT-3: Architectural Refactoring, Performance & Protocol Alignment** | 13 | 10.08% | 10 | 2 | 1 | 0 | 3.69 | 10.54 | 201.7 | 70 | Internal structural reworks (route context preservation, lifespan/exitstack refactoring), fast-path optimizations (Rust JSON, lazy imports), and RFC/security status alignment. |
| **CAT-4: Ecosystem Compatibility, Deprecation & Legacy Removal** | 7 | 5.43% | 6 | 0 | 1 | 0 | 6.43 | 25.71 | 365.6 | 44 | Lifecycle transitions across upstream dependencies (`pydantic.v1` deprecation and removal, Starlette 0.48+ status codes, `urllib3` v1/v2 shims, `ORJSONResponse` deprecation). |
| **CAT-5: Developer Experience (DX), Error Diagnostics & Guardrails** | 3 | 2.33% | 3 | 0 | 0 | 0 | 1.33 | 4.67 | 47.7 | 4 | Enhancements to traceback metadata (`EndpointContext`), clearer startup assertion messages, and circular router self-inclusion guards. |
| **CAT-6: Documentation Tutorials & Maintainer Tooling** | 4 | 3.10% | 4 | 0 | 0 | 0 | 1.00 | 1.00 | 62.8 | 26 | Standalone fixes to executable documentation examples (`docs_src/`) verified by `tests/test_tutorial/` and maintainer release automation scripts (`scripts/prepare_release.py`). |
| **Total / Benchmark Aggregate** | **129** | **100.00%** | **67** | **48** | **13** | **1** | **2.16** | **5.39** | **167.8** | **12** | **100% Complete Benchmark Coverage (129/129 Tasks)** |

### 2.2. Fine-Grained Sub-Categories (`SUB-1A` through `SUB-6B`)

| Primary Sub-Category (`Axis 1B`) | Tasks | Share (%) | `fastapi` | `rich` | `requests` | `httpx` | Avg Files | Avg Hunks | Mean Churn | Med Churn | Representative Instance IDs |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | :--- |
| **SUB-1A: Type Annotation, Union & Signature Introspection Bug** | 14 | 10.85% | 9 | 3 | 2 | 0 | 1.07 | 2.07 | 18.6 | 7 | `requests_7502`, `requests_7433`, `fastapi_12942`, `fastapi_14512` |
| **SUB-1B: Parameter Extraction, Aliasing & Form/Header/Query Coercion Bug** | 9 | 6.98% | 9 | 0 | 0 | 0 | 1.33 | 2.33 | 12.8 | 7 | `fastapi_15589`, `fastapi_14360`, `fastapi_14356`, `fastapi_14301` |
| **SUB-1C: OpenAPI / JSON Schema Generation & Ref Resolution Bug** | 10 | 7.75% | 10 | 0 | 0 | 0 | 1.20 | 2.10 | 16.7 | 13 | `fastapi_14463`, `fastapi_14349`, `fastapi_14459`, `fastapi_14455` |
| **SUB-1D: Terminal Cell Width, Unicode Grapheme & Segment Splitting Bug** | 8 | 6.20% | 0 | 8 | 0 | 0 | 1.25 | 1.88 | 33.0 | 26 | `rich_4006`, `rich_3953`, `rich_3944`, `rich_3180` |
| **SUB-1E: Terminal Component Rendering, Styling & Markup/ANSI Parsing Bug** | 27 | 20.93% | 0 | 27 | 0 | 0 | 1.07 | 2.07 | 11.3 | 6 | `rich_4079`, `rich_4076`, `rich_4075`, `rich_3718` |
| **SUB-1F: HTTP Protocol, URL/Header/Netrc Parsing & Lifecycle Bug** | 11 | 8.53% | 3 | 0 | 8 | 0 | 1.00 | 1.09 | 7.3 | 3 | `requests_7427`, `requests_7315`, `requests_7328`, `requests_7309` |
| **SUB-2A: Framework Core Feature & Endpoint/Router Capability** | 8 | 6.20% | 7 | 0 | 0 | 1 | 5.38 | 14.00 | 228.1 | 82 | `fastapi_15030`, `fastapi_15280`, `fastapi_14978`, `fastapi_14262` |
| **SUB-2B: Type System, Dependency & Return-Type Feature Extension** | 7 | 5.43% | 6 | 0 | 1 | 0 | 1.00 | 1.57 | 6.9 | 5 | `fastapi_13920`, `fastapi_14794`, `fastapi_9753`, `fastapi_5077` |
| **SUB-2C: Terminal & CLI Feature Enhancement** | 8 | 6.20% | 0 | 8 | 0 | 0 | 4.75 | 10.38 | 1625.9 | 41 | `rich_4077`, `rich_3930`, `rich_3486`, `rich_3777` |
| **SUB-3A: Core Routing, Lifespan & Streaming Lifecycle Refactor** | 4 | 3.10% | 4 | 0 | 0 | 0 | 3.00 | 11.50 | 481.5 | 477 | `fastapi_14851`, `fastapi_14099`, `fastapi_14419`, `fastapi_15745` |
| **SUB-3B: Performance Optimization & Fast-Path Execution** | 2 | 1.55% | 1 | 1 | 0 | 0 | 6.00 | 19.50 | 91.5 | 128 | `fastapi_14962`, `rich_4070` |
| **SUB-3C: Standards, Security & Internal API Hygiene Refactor** | 7 | 5.43% | 5 | 1 | 1 | 0 | 3.43 | 7.43 | 73.3 | 34 | `fastapi_15588`, `fastapi_14986`, `requests_7505`, `fastapi_14372` |
| **SUB-4A: Pydantic v1 Deprecation & Removal Lifecycle** | 4 | 3.10% | 4 | 0 | 0 | 0 | 9.75 | 42.25 | 619.8 | 364 | `fastapi_14609`, `fastapi_14186`, `fastapi_14605`, `fastapi_14583` |
| **SUB-4B: Upstream Library Compatibility & Feature Deprecation** | 3 | 2.33% | 2 | 0 | 1 | 0 | 2.00 | 3.67 | 26.7 | 17 | `fastapi_14964`, `fastapi_14077`, `requests_6757` |
| **SUB-5A: Actionable Error Messages, Tracebacks & Circular Guards** | 3 | 2.33% | 3 | 0 | 0 | 0 | 1.33 | 4.67 | 47.7 | 4 | `fastapi_14258`, `fastapi_14479`, `fastapi_14306` |
| **SUB-6A: Executable Documentation Tutorial (docs_src) Updates** | 3 | 2.33% | 3 | 0 | 0 | 0 | 1.00 | 1.00 | 11.7 | 7 | `fastapi_15023`, `fastapi_14492`, `fastapi_14487` |
| **SUB-6B: Maintainer Release & Automation Scripts** | 1 | 0.78% | 1 | 0 | 0 | 0 | 1.00 | 1.00 | 216.0 | 216 | `fastapi_15661` |
| **Total / Benchmark Aggregate** | **129** | **100.00%** | **67** | **48** | **13** | **1** | **2.16** | **5.39** | **167.8** | **12** | **100% Complete Benchmark Coverage (129/129 Tasks)** |

---

## 3. Axis 2: Root-Cause Defect & Modification Mechanism Taxonomy (`RC-1` to `RC-8`)

Adapted from **IBM Orthogonal Defect Classification (ODC)** and empirical Python defect taxonomies (*BugsInPy*, *SWE-bench Verified*), **Axis 2** classifies each problem by the underlying **code-level root cause or structural modification mechanism** required to pass verification—independent of which repository the task comes from. This is the single most important taxonomy for **generalizing to the hidden private-repository test set (~120 tasks)**.

### 3.1. Root-Cause Categories (`RC-1` through `RC-8`)

| Root-Cause Category (`Axis 2`) | Tasks | Share (%) | `fastapi` | `rich` | `requests` | `httpx` | Avg Files | Avg Hunks | Mean Churn | Med Churn | Technical Scope & Defining Characteristics |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | :--- |
| **RC-1: Type System, Introspection & Callable Unwrapping** | 22 | 17.05% | 15 | 3 | 4 | 0 | 1.09 | 2.09 | 15.1 | 7 | Defects or extensions in Python type annotation unpacking (`Annotated`, `UnionType`, PEP 695 `TypeAliasType`), `inspect.signature` (`eval_str=True`, `TYPE_CHECKING`), `inspect.unwrap`/`functools.partial`, class `__call__`, and `__getattr__` proxy protocol checks. |
| **RC-2: Input Validation, Sanitization & Boundary Guard** | 12 | 9.30% | 7 | 4 | 1 | 0 | 1.33 | 3.83 | 28.1 | 4 | Missing boundary checks, newline/control-character sanitization, RFC header whitespace stripping, circular reference assertions, and cyclic exception graph guards. |
| **RC-3: Data Structure, State & Dictionary Key / Alias Mapping** | 23 | 17.83% | 17 | 5 | 1 | 0 | 1.48 | 3.35 | 67.8 | 5 | Key/alias mismatches (`field.alias` vs `field.name`), `MultiDict.getlist()` multi-value aggregation, shallow-copy mutation (`copy.deepcopy`), in-place span list iteration, and stale cache/hash state. |
| **RC-4: Schema, Protocol & Specification Alignment** | 18 | 13.95% | 12 | 0 | 6 | 0 | 1.72 | 2.72 | 28.1 | 12 | OpenAPI 3.1 / JSON Schema `$ref` remapping, `computed_fields`, `contentMediaType`, RFC 9110 `Content-Type` & HTTP status codes (`401` vs `403`, `425 too_early`), S3 `//` URL paths, and `no_proxy` domain boundaries. |
| **RC-5: Terminal Rendering, Cell Geometry & Style Propagation** | 27 | 20.93% | 0 | 27 | 0 | 0 | 1.19 | 2.63 | 23.2 | 12 | Unicode grapheme cluster & CJK double-width cell math (`cells.py`, `segment.py`, `_wrap.py`), style/span inheritance and overrides, ANSI/markup regexes, and `Table`/`Panel`/`Live`/`Progress` box geometry. |
| **RC-6: Ecosystem Compatibility, Deprecation & Legacy Cleanup** | 8 | 6.20% | 7 | 0 | 1 | 0 | 5.75 | 23.12 | 339.5 | 52 | Custom warning classes (`FastAPIDeprecationWarning`), `@deprecated` decorators, upstream Starlette/Pydantic/urllib3 version shims, and full legacy `pydantic.v1` code removal. |
| **RC-7: New Module / Feature Synthesis** | 13 | 10.08% | 6 | 7 | 0 | 0 | 5.31 | 11.23 | 1135.8 | 81 | Creation of brand-new subsystems (`fastapi/sse.py`, `app.frontend()`, `Depends(scope=...)`, `rich/_unicode_data/*`, `scripts/prepare_release.py`) or new extensibility hooks (`TTY_COMPATIBLE`, `Exception.__notes__`, PEP 657 ranges). |
| **RC-8: Performance & Resource Lifecycle Optimization** | 6 | 4.65% | 3 | 2 | 0 | 1 | 4.33 | 12.50 | 134.5 | 79 | Pydantic v2 Rust `serialize_json` fast-path, deferred module imports in `rich`, `AsyncExitStack` teardown after `StreamingResponse`, `BrokenPipeError` stream handling, and HTTP keep-alive stream draining. |
| **Total / Benchmark Aggregate** | **129** | **100.00%** | **67** | **48** | **13** | **1** | **2.16** | **5.39** | **167.8** | **12** | **100% Complete Benchmark Coverage (129/129 Tasks)** |

### 3.2. Root-Cause Sub-Categories (`RC-1A` through `RC-8B`)

| Root-Cause Sub-Category (`Axis 2B`) | Tasks | Share (%) | `fastapi` | `rich` | `requests` | `httpx` | Avg Files | Avg Hunks | Mean Churn | Med Churn | Representative Instance IDs |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | :--- |
| **RC-1A: Generic / Union / Annotated / TypeAliasType Unpacking** | 7 | 5.43% | 7 | 0 | 0 | 0 | 1.00 | 2.29 | 15.3 | 5 | `fastapi_13920`, `fastapi_14794`, `fastapi_12942`, `fastapi_14512` |
| **RC-1B: Callable / Decorator / Partial / Class Unwrapping & Protocol Check** | 11 | 8.53% | 4 | 3 | 4 | 0 | 1.18 | 2.00 | 17.1 | 7 | `requests_7505`, `requests_7502`, `requests_7433`, `fastapi_14458` |
| **RC-1C: Stringified / Forward Reference & Signature Evaluation** | 4 | 3.10% | 4 | 0 | 0 | 0 | 1.00 | 2.00 | 9.5 | 11 | `fastapi_11355`, `fastapi_14485`, `fastapi_5077`, `fastapi_9425` |
| **RC-2A: Missing Protocol / Format Boundary Validation** | 3 | 2.33% | 2 | 0 | 1 | 0 | 1.67 | 5.67 | 35.7 | 23 | `fastapi_15588`, `fastapi_14978`, `requests_7205` |
| **RC-2B: Escaping, Stripping & Control-Code Sanitization** | 5 | 3.88% | 2 | 3 | 0 | 0 | 1.20 | 1.80 | 8.4 | 2 | `fastapi_14986`, `fastapi_14786`, `rich_3471`, `rich_3278` |
| **RC-2C: Self-Reference / Cycle Guard & Diagnostic Assertion** | 4 | 3.10% | 3 | 1 | 0 | 0 | 1.25 | 5.00 | 47.0 | 45 | `fastapi_14258`, `fastapi_14479`, `fastapi_14306`, `rich_3772` |
| **RC-3A: Alias vs Field Name Key Lookup / Set Tracking Defect** | 4 | 3.10% | 4 | 0 | 0 | 0 | 1.75 | 3.75 | 18.0 | 4 | `fastapi_15589`, `fastapi_14360`, `fastapi_14371`, `fastapi_13537` |
| **RC-3B: MultiDict / Sequence / Extra Parameter Aggregation Defect** | 4 | 3.10% | 4 | 0 | 0 | 0 | 1.00 | 1.25 | 9.5 | 11 | `fastapi_14356`, `fastapi_14303`, `fastapi_14616`, `fastapi_11194` |
| **RC-3C: Mutable State Sharing, Shallow Copy & Cache Pollution** | 11 | 8.53% | 7 | 3 | 1 | 0 | 1.64 | 4.45 | 128.1 | 4 | `requests_7328`, `fastapi_14873`, `fastapi_14463`, `fastapi_14372` |
| **RC-3D: Missing Parameter / Option Forwarding Across Call Chain** | 4 | 3.10% | 2 | 2 | 0 | 0 | 1.25 | 2.00 | 10.0 | 5 | `fastapi_14301`, `fastapi_13713`, `rich_3882`, `rich_3518` |
| **RC-4A: OpenAPI / JSON Schema Structure & $ref Remapping** | 8 | 6.20% | 8 | 0 | 0 | 0 | 1.38 | 1.88 | 24.1 | 14 | `fastapi_14349`, `fastapi_14455`, `fastapi_14361`, `fastapi_13207` |
| **RC-4B: HTTP / URL / Header / Status / Auth RFC Compliance** | 8 | 6.20% | 2 | 0 | 6 | 0 | 2.25 | 4.00 | 37.9 | 6 | `requests_7427`, `requests_7315`, `requests_7309`, `fastapi_15763` |
| **RC-4C: Documentation Example / Constant Specification Fix** | 2 | 1.55% | 2 | 0 | 0 | 0 | 1.00 | 1.00 | 4.5 | 7 | `fastapi_14492`, `fastapi_14487` |
| **RC-5A: Unicode Cell Width, Grapheme Cluster & Cut-Offset Math** | 7 | 5.43% | 0 | 7 | 0 | 0 | 1.29 | 1.86 | 37.1 | 26 | `rich_4006`, `rich_3953`, `rich_3944`, `rich_3180` |
| **RC-5B: Style / Span / Markup Inheritance & Override Defect** | 9 | 6.98% | 0 | 9 | 0 | 0 | 1.22 | 3.56 | 26.7 | 7 | `rich_4079`, `rich_3718`, `rich_3942`, `rich_3938` |
| **RC-5C: ANSI / Markup / Regex Tokenization & Line-Break Defect** | 5 | 3.88% | 0 | 5 | 0 | 0 | 1.00 | 1.60 | 5.4 | 2 | `rich_4076`, `rich_4075`, `rich_3454`, `rich_3469` |
| **RC-5D: Interactive Display, Padding & Box Geometry Defect** | 6 | 4.65% | 0 | 6 | 0 | 0 | 1.17 | 3.00 | 16.5 | 17 | `rich_3934`, `rich_3935`, `rich_3905`, `rich_3782` |
| **RC-6A: Deprecation Warning & Decorator Instrumentation** | 3 | 2.33% | 3 | 0 | 0 | 0 | 3.33 | 9.33 | 40.0 | 44 | `fastapi_14964`, `fastapi_14605`, `fastapi_14583` |
| **RC-6B: Upstream Dependency API Migration (Pydantic v2 / Starlette / urllib3)** | 4 | 3.10% | 3 | 0 | 1 | 0 | 4.00 | 16.25 | 137.2 | 157 | `fastapi_14851`, `fastapi_14186`, `fastapi_14077`, `requests_6757` |
| **RC-6C: Legacy Compatibility Layer & Dead-Code Removal** | 1 | 0.78% | 1 | 0 | 0 | 0 | 20.00 | 92.00 | 2047.0 | 2047 | `fastapi_14609` |
| **RC-7A: Multi-Module Core Subsystem & Tutorial Synthesis** | 5 | 3.88% | 4 | 1 | 0 | 0 | 11.00 | 19.60 | 2853.2 | 560 | `fastapi_15030`, `fastapi_15280`, `fastapi_14262`, `rich_3930` |
| **RC-7B: Standalone CLI / Automation Script Synthesis** | 1 | 0.78% | 1 | 0 | 0 | 0 | 1.00 | 1.00 | 216.0 | 216 | `fastapi_15661` |
| **RC-7C: Extensibility API / Environment Hook Addition** | 7 | 5.43% | 1 | 6 | 0 | 0 | 1.86 | 6.71 | 40.4 | 34 | `rich_4077`, `fastapi_15785`, `rich_3486`, `rich_3777` |
| **RC-8A: Serialization Fast-Path & Deferred Import Optimization** | 2 | 1.55% | 1 | 1 | 0 | 0 | 6.00 | 19.50 | 91.5 | 128 | `fastapi_14962`, `rich_4070` |
| **RC-8B: Context Manager / Stream / Pipe Resource Cleanup** | 4 | 3.10% | 2 | 1 | 0 | 1 | 3.50 | 9.00 | 156.0 | 79 | `fastapi_15023`, `fastapi_14099`, `httpx_3672`, `rich_3468` |
| **Total / Benchmark Aggregate** | **129** | **100.00%** | **67** | **48** | **13** | **1** | **2.16** | **5.39** | **167.8** | **12** | **100% Complete Benchmark Coverage (129/129 Tasks)** |

---

## 4. Axis 3: Repository & Architectural Subsystem Taxonomy (18 Subsystems)

| Repository Architectural Subsystem (`Axis 3`) | Tasks | Share (%) | `fastapi` | `rich` | `requests` | `httpx` | Avg Files | Avg Hunks | Mean Churn | Med Churn | Representative Instance IDs |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | :--- |
| **FastAPI-1: Dependency Injection & Parameter Resolution (dependencies/)** | 23 | 17.83% | 23 | 0 | 0 | 0 | 1.65 | 3.61 | 27.9 | 7 | `fastapi_15589`, `fastapi_13920`, `fastapi_14794`, `fastapi_14479` |
| **FastAPI-2: Routing, Lifespan & Request Execution (routing.py, applications.py)** | 11 | 8.53% | 11 | 0 | 0 | 0 | 2.27 | 7.64 | 211.7 | 81 | `fastapi_14962`, `fastapi_15280`, `fastapi_14978`, `fastapi_14258` |
| **FastAPI-3: Pydantic Compatibility & Schema Adaptation (_compat/)** | 14 | 10.85% | 14 | 0 | 0 | 0 | 3.71 | 13.64 | 195.5 | 28 | `fastapi_12942`, `fastapi_14609`, `fastapi_14349`, `fastapi_14512` |
| **FastAPI-4: OpenAPI Schema & Docs Generation (openapi/)** | 6 | 4.65% | 6 | 0 | 0 | 0 | 1.67 | 3.33 | 15.7 | 13 | `fastapi_14986`, `fastapi_14463`, `fastapi_14455`, `fastapi_13713` |
| **FastAPI-5: Responses, Streaming, SSE & Static Frontend (responses.py, sse.py)** | 4 | 3.10% | 4 | 0 | 0 | 0 | 4.75 | 10.25 | 322.2 | 560 | `fastapi_15588`, `fastapi_15030`, `fastapi_14964`, `fastapi_15800` |
| **FastAPI-6: Security, OAuth2 Scopes & Authentication (security/)** | 5 | 3.88% | 5 | 0 | 0 | 0 | 3.40 | 7.40 | 70.8 | 18 | `fastapi_14786`, `fastapi_14459`, `fastapi_5624`, `fastapi_14266` |
| **FastAPI-7: Docs, Tutorials & Release Scripts (docs_src/, scripts/)** | 4 | 3.10% | 4 | 0 | 0 | 0 | 1.00 | 1.00 | 62.8 | 26 | `fastapi_15661`, `fastapi_15023`, `fastapi_14492`, `fastapi_14487` |
| **HTTPX-1: Dual Sync/Async HTTP Parser, Pool & Server (httpx/, ahttpx/)** | 1 | 0.78% | 0 | 0 | 0 | 1 | 7.00 | 18.00 | 79.0 | 79 | `httpx_3672` |
| **Requests-1: Request/Response Models & Body Preparation (models.py, _types.py)** | 3 | 2.33% | 0 | 0 | 3 | 0 | 1.33 | 2.67 | 8.7 | 6 | `requests_7505`, `requests_7502`, `requests_7433` |
| **Requests-2: URL, Proxy, Header, Netrc & Content Utilities (utils.py)** | 4 | 3.10% | 0 | 0 | 4 | 0 | 1.00 | 1.00 | 6.5 | 6 | `requests_7427`, `requests_7309`, `requests_7205`, `requests_6589` |
| **Requests-3: Transport Adapters, Sessions & Redirects (adapters.py, sessions.py)** | 3 | 2.33% | 0 | 0 | 3 | 0 | 1.00 | 1.00 | 2.7 | 3 | `requests_7315`, `requests_7328`, `requests_6644` |
| **Requests-4: Exceptions, Status Codes & Compat Shims (exceptions.py, status_codes.py, compat.py)** | 3 | 2.33% | 0 | 0 | 3 | 0 | 1.33 | 1.67 | 9.7 | 10 | `requests_6757`, `requests_6629`, `requests_6592` |
| **Rich-1: Console Core, Export, FileProxy & Diagnostics (console.py, _export_format.py, file_proxy.py, diagnose.py)** | 9 | 6.98% | 0 | 9 | 0 | 0 | 2.11 | 6.00 | 27.6 | 13 | `rich_4070`, `rich_4077`, `rich_4075`, `rich_3777` |
| **Rich-2: Unicode Cell Widths, Segments & Wrapping (cells.py, segment.py, _wrap.py, _unicode_data/)** | 9 | 6.98% | 0 | 9 | 0 | 0 | 4.11 | 4.89 | 1446.6 | 35 | `rich_4006`, `rich_3953`, `rich_3944`, `rich_3938` |
| **Rich-3: Text, Style, Markup, ANSI & Highlighter (text.py, style.py, markup.py, ansi.py, highlighter.py)** | 9 | 6.98% | 0 | 9 | 0 | 0 | 1.00 | 2.56 | 12.6 | 2 | `rich_4076`, `rich_3480`, `rich_3454`, `rich_3471` |
| **Rich-4: Markdown & Table Layout Engine (markdown.py, table.py, panel.py)** | 9 | 6.98% | 0 | 9 | 0 | 0 | 1.11 | 2.44 | 15.9 | 10 | `rich_4079`, `rich_3718`, `rich_3942`, `rich_3935` |
| **Rich-5: Syntax, Traceback, Pretty, Inspect & Repr (syntax.py, traceback.py, pretty.py, _inspect.py, repr.py)** | 8 | 6.20% | 0 | 8 | 0 | 0 | 1.38 | 4.62 | 24.9 | 13 | `rich_3894`, `rich_3486`, `rich_3782`, `rich_3772` |
| **Rich-6: Live Display, Progress & Interactive Prompts (live.py, progress.py, prompt.py)** | 4 | 3.10% | 0 | 4 | 0 | 0 | 1.25 | 4.25 | 15.8 | 20 | `rich_3934`, `rich_3882`, `rich_3905`, `rich_3052` |
| **Total / Benchmark Aggregate** | **129** | **100.00%** | **67** | **48** | **13** | **1** | **2.16** | **5.39** | **167.8** | **12** | **100% Complete Benchmark Coverage (129/129 Tasks)** |

---

## 5. Axis 4: Prompt Specification Quality, Leakage & Offline Solvability (`PC-1` to `PC-5`)

Because `tasks.jsonl` was constructed by mining **GitHub Pull Request descriptions** with `hints_text == ""` and evaluating agents inside an offline container (`network_mode="none"`), the 129 prompts exhibit a bimodal distribution between **solution-leaking PR descriptions (`PC-1`)** and **ultra-terse issue-link stubs (`PC-5`)**:

| Prompt Specification Class (`Axis 4`) | Tasks | Share (%) | `fastapi` | `rich` | `requests` | `httpx` | Avg Files | Avg Hunks | Mean Churn | Med Churn | Technical Scope & Defining Characteristics |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | :--- |
| **PC-1: High-Clarity / Solution-Guided Prompt (Names exact target symbol/file or fix logic)** | 17 | 13.18% | 12 | 1 | 3 | 1 | 1.88 | 4.41 | 19.4 | 7 | Prompt (>=180 chars) explicitly names the target function, class, method, or even includes the exact code snippet/diff required. |
| **PC-2: Reproducer-Rich Bug Report (Includes MRE code block / traceback, target inferred)** | 5 | 3.88% | 2 | 3 | 0 | 0 | 1.20 | 5.60 | 38.2 | 10 | Prompt includes a minimal reproducible example (MRE) code block or stack trace, requiring the agent to trace from the symptom to the internal module. |
| **PC-3: Behavioral / Conceptual Specification (Prose description of desired behavior/RFC)** | 69 | 53.49% | 40 | 20 | 9 | 0 | 2.41 | 6.04 | 273.8 | 12 | Standard prose PR/issue description explaining the bug or feature requirement without pasting the exact target code diff. |
| **PC-4: Tutorial-Coupled Specification (Requires exact docs_src/ file path for test_tutorial)** | 9 | 6.98% | 9 | 0 | 0 | 0 | 4.11 | 9.67 | 175.4 | 82 | Task whose Phase 2 `test_patch` executes `tests/test_tutorial/...`, requiring the agent to create/edit specific `docs_src/.../tutorial*.py` files alongside library code. |
| **PC-5: Opaque / Ultra-Terse Prompt (<180 chars or unexpanded external issue URL offline)** | 29 | 22.48% | 4 | 24 | 1 | 0 | 1.28 | 3.03 | 22.7 | 15 | Minimalist 2-to-10 word PR title/body (often just `Fixes https://github.com/.../issues/XXXX`) with zero `hints_text` in an air-gapped container. |
| **Total / Benchmark Aggregate** | **129** | **100.00%** | **67** | **48** | **13** | **1** | **2.16** | **5.39** | **167.8** | **12** | **100% Complete Benchmark Coverage (129/129 Tasks)** |

> [!IMPORTANT]
> **Critical Discovery — The `PC-4` (`docs_src/` Tutorial Coupling) & `PC-5` (Offline Issue-Link) Traps**:
> - In **`PC-4` (9 tasks, all in `fastapi/fastapi`)**: `fastapi_15030`, `fastapi_14962`, `fastapi_15280`, `fastapi_15023`, `fastapi_14978`, `fastapi_14099`, `fastapi_14262`, `fastapi_14953`, and `fastapi_13786`, the verification `test_patch` runs tests under `tests/test_tutorial/` that directly import tutorial scripts under `docs_src/`. For example, in `fastapi_15280`, the prompt is only 64 characters (`"✨ Add support for @app.vibe()"`), yet `test_patch` (`tests/test_vibe.py`) executes `from docs_src.vibe.tutorial001_py310 import app`! If an agent only adds `@app.vibe()` to `fastapi/applications.py` without creating `docs_src/vibe/tutorial001_py310.py`, Phase 2 verification fails with `ModuleNotFoundError`.
> - In **`PC-5` (29 tasks, including 24/48 of `Textualize/rich`)**: Prompts such as `rich_3944` (`"fix fonts | Fixes https://github.com/Textualize/rich/issues/3943"`), `rich_3105` (`"Fix #3104"`), `rich_3676` (`"Notes | Add support for Exception.__notes__"`), and `fastapi_5624` (`"🐛 Fix hierarchical security scope propagation | see defect #5623"`) provide `<180` characters of context and link to external GitHub issues that cannot be fetched offline.

---

## 6. Axis 5: Patch Structural Complexity (`TIER-1` to `TIER-5`) & AST Graph Reachability (`GRAPH-1` to `GRAPH-4`)

### 6.1. Patch Structural Complexity & Dispersion Tiers (`TIER-1` through `TIER-5`)

| Patch Complexity Tier (`Axis 5A`) | Tasks | Share (%) | `fastapi` | `rich` | `requests` | `httpx` | Avg Files | Avg Hunks | Mean Churn | Med Churn | Technical Scope & Defining Characteristics |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | :--- |
| **TIER-1: Micro Single-Hunk Surgical Patch (1 file, 1 hunk, <=6 lines)** | 39 | 30.23% | 13 | 17 | 9 | 0 | 1.00 | 1.00 | 2.9 | 2 | Ultra-localized 1-to-6 line edit inside a single hunk of a single existing file; difficulty lies entirely in pinpoint localization and exact root-cause reasoning. |
| **TIER-2: Localized Single-File Patch (1 file, 1-3 hunks, <=35 lines)** | 38 | 29.46% | 24 | 12 | 2 | 0 | 1.00 | 1.58 | 12.5 | 11 | Focused single-file fix spanning 1 to 3 hunks and up to 35 lines of total churn (`+added + -removed`). |
| **TIER-3: Moderate Multi-Hunk / Dual-File Patch (1-2 files, <=120 lines)** | 28 | 21.71% | 11 | 15 | 2 | 0 | 1.57 | 5.00 | 37.4 | 34 | Coordinated modification across multiple hunks in 1–2 files (up to 120 lines of churn), often pairing a helper update with a caller update. |
| **TIER-4: Cross-Module Coordinated Patch (2-5 files or New File, <=300 lines)** | 12 | 9.30% | 10 | 2 | 0 | 0 | 2.58 | 7.33 | 99.3 | 98 | Multi-module change (2–5 files or standalone new module up to 300 lines), requiring cross-file consistency across models, utils, and routers. |
| **TIER-5: Large-Scale Architectural / Multi-File Overhaul (>5 files or >300 lines)** | 12 | 9.30% | 9 | 2 | 0 | 1 | 10.50 | 30.67 | 1568.5 | 477 | High-complexity structural overhaul touching 6–26 files or >300 lines of churn (e.g., `rich_3930` 26 files, `fastapi_14609` 20 files, `fastapi_15745` 1,230 lines). |
| **Total / Benchmark Aggregate** | **129** | **100.00%** | **67** | **48** | **13** | **1** | **2.16** | **5.39** | **167.8** | **12** | **100% Complete Benchmark Coverage (129/129 Tasks)** |

### 6.2. AST Call-Graph & Vector Embedding Reachability (`GRAPH-1` through `GRAPH-4`)

| AST Graph Reachability Class (`Axis 5B`) | Tasks | Share (%) | `fastapi` | `rich` | `requests` | `httpx` | Avg Files | Avg Hunks | Mean Churn | Med Churn | Technical Scope & Defining Characteristics |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | :--- |
| **GRAPH-1: Direct Symbol Node Indexed (Function/Class/Method in AST Graph)** | 120 | 93.02% | 62 | 45 | 12 | 1 | 2.24 | 5.70 | 178.0 | 13 | The modified function, method, or class exists directly as a node in `graphs/<repo>_<commit>.json` and `embeddings/<repo>_<commit>.npz`. |
| **GRAPH-2: Module-Level / Import / Attribute Scope (File Indexed, Top-Level Hunk)** | 4 | 3.10% | 2 | 1 | 1 | 0 | 1.00 | 1.25 | 14.2 | 2 | The target `.py` file has functions/classes in the AST graph, but the gold patch edits only module-level dicts, regexes, or imports outside any `def`/`class` body. |
| **GRAPH-3: Non-Indexed / Module-Level Constant / Template Target** | 4 | 3.10% | 2 | 2 | 0 | 0 | 1.00 | 1.25 | 3.2 | 2 | The gold patch modifies files containing only module-level constants/templates (`_export_format.py`, `default_styles.py`, `tutorial001_1_py39.py`) with 0 nodes in the AST graph. |
| **GRAPH-4: Net-New File Synthesis (0% Pre-Existing Target File Nodes)** | 1 | 0.78% | 1 | 0 | 0 | 0 | 1.00 | 1.00 | 216.0 | 216 | The gold patch creates a brand-new standalone file (`scripts/prepare_release.py` in `fastapi_15661`) that does not exist at `base_commit`. |
| **Total / Benchmark Aggregate** | **129** | **100.00%** | **67** | **48** | **13** | **1** | **2.16** | **5.39** | **167.8** | **12** | **100% Complete Benchmark Coverage (129/129 Tasks)** |

---

## 7. Axis 6: Runtime Failure Symptom & Verification Phenotype (`FM-1` to `FM-8`)

| Failure Mode / Verification Phenotype (`Axis 6`) | Tasks | Share (%) | `fastapi` | `rich` | `requests` | `httpx` | Avg Files | Avg Hunks | Mean Churn | Med Churn | Technical Scope & Defining Characteristics |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | :--- |
| **FM-1: TypeError / AttributeError / NameError on Type Introspection** | 21 | 16.28% | 12 | 5 | 4 | 0 | 1.14 | 2.24 | 14.3 | 7 | Baseline fails with `TypeError` (e.g., `issubclass() arg 1 must be a class`, unhashable `Depends`), `AttributeError`, `NameError` (`TYPE_CHECKING`), or `PickleError`. |
| **FM-2: ValueError / ValidationError on Malformed Input** | 5 | 3.88% | 5 | 0 | 0 | 0 | 1.80 | 4.80 | 119.4 | 32 | Baseline fails to raise or mishandles `ValueError` / `RequestValidationError` on invalid input or closed resources. |
| **FM-3: HTTP Status / Protocol Compliance Mismatch (401/403/422)** | 9 | 6.98% | 9 | 0 | 0 | 0 | 2.67 | 6.67 | 49.1 | 11 | Endpoint returns wrong HTTP status code (e.g., `403` instead of `401`, `422` validation failure on valid form/alias/union payload, or `200` instead of `415`/`422`). |
| **FM-4: Infinite Loop / RecursionError / Unhandled AssertionError** | 7 | 5.43% | 2 | 5 | 0 | 0 | 1.00 | 2.29 | 20.9 | 17 | Process hangs in an infinite loop (`split_graphemes`, `Text.append`, binary search) or crashes with `RecursionError` (cyclic traceback) or `AssertionError`. |
| **FM-5: Visual / Terminal Rendering & Styling Corruption** | 29 | 22.48% | 0 | 29 | 0 | 0 | 2.03 | 3.24 | 456.3 | 7 | Terminal output has misaligned CJK/emoji cell widths, missing ANSI/background styles, broken Markdown tables, or extraneous blank lines. |
| **FM-6: Silent Behavioral / Logic / State Defect** | 35 | 27.13% | 24 | 3 | 8 | 0 | 1.60 | 3.51 | 59.6 | 11 | Function returns subtly wrong data (e.g., drops multi-value params, mutates shared OpenAPI `$ref` dicts, leaks underscore headers, or misroutes `no_proxy`). |
| **FM-7: Missing Feature / New Module Required** | 15 | 11.63% | 7 | 6 | 1 | 1 | 3.53 | 9.40 | 144.2 | 72 | Verification tests import a new module/method/parameter (`fastapi.sse`, `app.frontend`, `iter_route_contexts`, `TTY_COMPATIBLE`, `Exception.__notes__`) absent at baseline. |
| **FM-8: Missing Warning / Diagnostic Metadata** | 8 | 6.20% | 8 | 0 | 0 | 0 | 5.75 | 23.75 | 335.1 | 52 | Verification tests check `pytest.warns(FastAPIDeprecationWarning)` / `DeprecationWarning` or inspect diagnostic error context fields. |
| **Total / Benchmark Aggregate** | **129** | **100.00%** | **67** | **48** | **13** | **1** | **2.16** | **5.39** | **167.8** | **12** | **100% Complete Benchmark Coverage (129/129 Tasks)** |

---

## 8. Multi-Dimensional Cross-Tabulation Matrices

### 8.1. Primary Category (`Axis 1`) × Patch Complexity Tier (`Axis 5A`)

| Primary Category | **TIER-1** | **TIER-2** | **TIER-3** | **TIER-4** | **TIER-5** | **Total** |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: |
| **CAT-1: Functional Bug Fix & Edge-Case Resolution** | 33 | 30 | 13 | 3 | 0 | **79** |
| **CAT-2: New Feature & API Capability Addition** | 3 | 5 | 7 | 3 | 5 | **23** |
| **CAT-3: Architectural Refactoring, Performance & Protocol Alignment** | 0 | 1 | 5 | 3 | 4 | **13** |
| **CAT-4: Ecosystem Compatibility, Deprecation & Legacy Removal** | 0 | 0 | 3 | 1 | 3 | **7** |
| **CAT-5: Developer Experience (DX), Error Diagnostics & Guardrails** | 2 | 0 | 0 | 1 | 0 | **3** |
| **CAT-6: Documentation Tutorials & Maintainer Tooling** | 1 | 2 | 0 | 1 | 0 | **4** |
| **Total** | **39** | **38** | **28** | **12** | **12** | **129** |

### 8.2. Root-Cause Category (`Axis 2`) × Primary Category (`Axis 1`)

| Root-Cause Category | **CAT-1** | **CAT-2** | **CAT-3** | **CAT-4** | **CAT-5** | **CAT-6** | **Total** |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| **RC-1: Type System, Introspection & Callable Unwrapping** | 15 | 6 | 1 | 0 | 0 | 0 | **22** |
| **RC-2: Input Validation, Sanitization & Boundary Guard** | 6 | 1 | 2 | 0 | 3 | 0 | **12** |
| **RC-3: Data Structure, State & Dictionary Key / Alias Mapping** | 19 | 1 | 3 | 0 | 0 | 0 | **23** |
| **RC-4: Schema, Protocol & Specification Alignment** | 13 | 1 | 2 | 0 | 0 | 2 | **18** |
| **RC-5: Terminal Rendering, Cell Geometry & Style Propagation** | 25 | 1 | 1 | 0 | 0 | 0 | **27** |
| **RC-6: Ecosystem Compatibility, Deprecation & Legacy Cleanup** | 0 | 0 | 1 | 7 | 0 | 0 | **8** |
| **RC-7: New Module / Feature Synthesis** | 0 | 12 | 0 | 0 | 0 | 1 | **13** |
| **RC-8: Performance & Resource Lifecycle Optimization** | 1 | 1 | 3 | 0 | 0 | 1 | **6** |
| **Total** | **79** | **23** | **13** | **7** | **3** | **4** | **129** |

### 8.3. Prompt Specification Class (`Axis 4`) × Patch Complexity Tier (`Axis 5A`)

| Prompt Specification Class | **TIER-1** | **TIER-2** | **TIER-3** | **TIER-4** | **TIER-5** | **Total** |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: |
| **PC-1: High-Clarity / Solution-Guided Prompt (Names exact target symbol/file or fix logic)** | 6 | 8 | 1 | 0 | 2 | **17** |
| **PC-2: Reproducer-Rich Bug Report (Includes MRE code block / traceback, target inferred)** | 1 | 2 | 1 | 1 | 0 | **5** |
| **PC-3: Behavioral / Conceptual Specification (Prose description of desired behavior/RFC)** | 21 | 20 | 15 | 6 | 7 | **69** |
| **PC-4: Tutorial-Coupled Specification (Requires exact docs_src/ file path for test_tutorial)** | 1 | 2 | 0 | 3 | 3 | **9** |
| **PC-5: Opaque / Ultra-Terse Prompt (<180 chars or unexpanded external issue URL offline)** | 10 | 6 | 11 | 2 | 0 | **29** |
| **Total** | **39** | **38** | **28** | **12** | **12** | **129** |

---

## 9. Evolutionary & Causal Multi-PR Chains Inside `tasks.jsonl`

Because `tasks.jsonl` mines multiple historical commits from the same repositories between July 2023 and June 2026, **27 of the 129 tasks (20.93%) belong to 10 sequential multi-PR chains** where later benchmark tasks directly modify, extend, fix a regression from, or **completely revert** earlier tasks in the dataset:

| Chain ID | Repository | Chronological Task Sequence (`instance_id` & Date) | Target Module(s) | Causal / Evolutionary Relationship Across Tasks |
| :--- | :--- | :--- | :--- | :--- |
| **CHAIN-01** | `psf/requests` | `requests_6644` (`2024-02-23`) $	o$ `requests_7315` (`2026-05-10`) | `src/requests/adapters.py` (`request_url`) | **Exact Inverse / Revert**: `requests_6644` adds `if url.startswith("//"): url = f"/{url.lstrip('/ ')}"` to prevent `urllib3` host parsing; `requests_7315` deletes those exact 2 lines because collapsing `//` broke AWS S3 presigned URL signatures. |
| **CHAIN-02** | `psf/requests` | `requests_7433` (`2026-05-12`) $	o$ `requests_7502` (`2026-06-08`) $	o$ `requests_7505` (`2026-06-09`) | `src/requests/models.py`, `src/requests/_types.py` | **Progressive Generalization**: `7433` adds `hasattr(data, "__iter__")` for `__getattr__` proxy wrappers in `prepare_body`; `7502` adds `hasattr(fp, "read")` in `_encode_files`; `7505` extracts `has_read()` into `_types.py` and applies it across all 3 functions. |
| **CHAIN-03** | `fastapi/fastapi` | `fastapi_14186` (`2025-10-20`) $	o$ `fastapi_14583` (`2025-12-21`) $	o$ `fastapi_14605` (`2025-12-26`) $	o$ `fastapi_14609` (`2025-12-27`) | `fastapi/_compat/*`, `fastapi/exceptions.py`, `fastapi/routing.py` | **4-Stage `pydantic.v1` Sunset**: `14186` isolates `may_v1.py` for Python 3.14; `14583` adds `DeprecationWarning` on v1 models; `14605` upgrades warnings to `FastAPIDeprecationWarning(UserWarning)`; `14609` deletes `pydantic.v1` support across 20 files (`-1,855` lines). |
| **CHAIN-04** | `fastapi/fastapi` | `fastapi_9555` (`2025-12-02`) $	o$ `fastapi_9753` (`2025-12-02`) $	o$ `fastapi_14448` (`2025-12-04`) $	o$ `fastapi_14458` (`2025-12-05`) | `fastapi/dependencies/models.py`, `fastapi/dependencies/utils.py` | **4-Stage Callable Unwrapping & Regression Fix**: `9555` adds `inspect.unwrap`; `9753` adds `functools.partial` unwrapping; `14448` combines recursive `_impartial` + `unwrap`; `14458` fixes a regression from `14448` where callable classes (`inspect.isclass`) were misclassified as coroutines/generators. |
| **CHAIN-05** | `fastapi/fastapi` | `fastapi_11355` (`2025-12-04`) $	o$ `fastapi_14485` (`2025-12-10`) | `fastapi/dependencies/utils.py` | **Feature $	o$ Regression Fix**: `11355` adds `inspect.signature(call, eval_str=True)` for stringified annotations; `14485` wraps `eval_str=True` in `try ... except NameError:` to prevent crashes when dependencies use `if TYPE_CHECKING:` imports. |
| **CHAIN-06** | `fastapi/fastapi` | `fastapi_14297` (`2025-12-02 07:10`) $	o$ `fastapi_14430` (`2025-12-02 16:59`) | `fastapi/_compat/v2.py` | **Same-Day Follow-Up**: `14297` checks `if origin_type is Union:` for optional file sequences; 9 hours later, `14430` extends that exact check to `if origin_type is Union or origin_type is UnionType:` for Python 3.10 PEP 604 union syntax. |
| **CHAIN-07** | `fastapi/fastapi` | `fastapi_14851` (`2026-02-06`) $	o$ `fastapi_14873` (`2026-02-09`) | `fastapi/routing.py` | **Refactor $	o$ Bug Fix**: `14851` re-implements `on_event` locally in `APIRouter` for Starlette compatibility; `14873` fixes a bug in `14851` where passing `on_startup=[...]` to `FastAPI()` failed to copy the list properly. |
| **CHAIN-08** | `fastapi/fastapi` | `fastapi_15030` (`2026-03-01`) $	o$ `fastapi_15588` (`2026-05-23`) | `fastapi/sse.py` | **New Subsystem $	o$ Hardening**: `15030` introduces `fastapi/sse.py` (`ServerSentEvent`, `EventSourceResponse`); `15588` adds single-line validation (`\r`, `\n`, `\0` checks) to `ServerSentEvent` fields (`event`, `id`, `retry`). |
| **CHAIN-09** | `fastapi/fastapi` | `fastapi_15745` (`2026-06-14`) $	o$ `fastapi_15763` (`2026-06-15`) $	o$ `fastapi_15785` (`2026-06-18`) | `fastapi/routing.py`, `fastapi/openapi/utils.py` | **3-Stage Router Architecture Evolution**: `15745` replaces route cloning with `_EffectiveRouteContext`; `15763` fixes empty-path operations on prefixless routers under the new context model; `15785` exposes public `iter_route_contexts()`. |
| **CHAIN-10** | `Textualize/rich` | `rich_3930` (`2026-01-22`) $	o$ `rich_3944` (`2026-01-24`) $	o$ `rich_3953` (`2026-02-01`) $	o$ `rich_4006` (`2026-02-19`) | `rich/cells.py`, `rich/_unicode_data/*` | **4-Stage Unicode Grapheme Engine Stabilization**: `3930` introduces `split_graphemes` and 23 Unicode width tables; `3944` fixes fallback return width (`0` $	o$ `1`); `3953` fixes ZWJ/control codepoint binary search bounds; `4006` fixes an infinite loop in `split_graphemes`. |


---

<!-- ====================================================================== -->
<!-- FILE: 03_Repository_and_Subcategory_Engineering_Deep_Dives.md -->
<!-- ====================================================================== -->

# Repository & Sub-Category Engineering Deep Dives

*Dataset Analyzed: `input/kagglecomp/kagglecomp_data_package/tasks.jsonl` & `gemma-4-developer-agent.zip` (129 Benchmark Tasks)*
*Date: 2026-11-05*

---

## 1. `fastapi/fastapi` Engineering Deep Dive (67 Tasks — 51.94% of Benchmark)

### 1.1. Architectural Subsystem Breakdown (`FastAPI-1` through `FastAPI-7`)

`fastapi/fastapi` is the largest repository in the public training set (`67` tasks, created between `2025-09-16` and `2026-06-20`). Despite having 3,238–4,597 AST graph nodes per commit, **88.06% (59/67) of all FastAPI tasks concentrate on just four core modules**: `fastapi/dependencies/` (`utils.py` and `models.py`), `fastapi/_compat/` (`v2.py` and `may_v1.py`), `fastapi/routing.py` (+ `applications.py`), and `fastapi/openapi/utils.py`.

| Subsystem (`Axis 3`) | Tasks | Share of Repo (%) | Top Primary Sub-Categories | Top Root-Cause Mechanisms | Avg Files | Mean Churn | Med Churn | All `instance_id`s in Subsystem |
| :--- | ---: | ---: | :--- | :--- | ---: | ---: | ---: | :--- |
| **FastAPI-1: Dependency Injection & Parameter Resolution (dependencies/)** | 23 | 34.3% | SUB-1B(9), SUB-2B(6), SUB-1A(4) | RC-3A(4), RC-1C(4), RC-1B(4) | 1.65 | 27.9 | 7 | `fastapi_15589`, `fastapi_13920`, `fastapi_14794`, `fastapi_14479`, `fastapi_14372`, `fastapi_11355`, `fastapi_14485`, `fastapi_14458`, `fastapi_14448`, `fastapi_9753`, `fastapi_5077`, `fastapi_9555`, `fastapi_14360`, `fastapi_14356`, `fastapi_14419`, `fastapi_14301`, `fastapi_14262`, `fastapi_9425`, `fastapi_14371`, `fastapi_14303`, `fastapi_13537`, `fastapi_14616`, `fastapi_11194` |
| **FastAPI-2: Routing, Lifespan & Request Execution (routing.py, applications.py)** | 11 | 16.4% | SUB-2A(3), SUB-3A(3), SUB-5A(2) | RC-2C(2), RC-3C(2), RC-8A(1) | 2.27 | 211.7 | 81 | `fastapi_14962`, `fastapi_15280`, `fastapi_14978`, `fastapi_14258`, `fastapi_14851`, `fastapi_14873`, `fastapi_14099`, `fastapi_14306`, `fastapi_15785`, `fastapi_15763`, `fastapi_15745` |
| **FastAPI-3: Pydantic Compatibility & Schema Adaptation (_compat/)** | 14 | 20.9% | SUB-1A(5), SUB-4A(4), SUB-1C(4) | RC-1A(5), RC-4A(5), RC-6A(2) | 3.71 | 195.5 | 28 | `fastapi_12942`, `fastapi_14609`, `fastapi_14349`, `fastapi_14512`, `fastapi_14482`, `fastapi_14430`, `fastapi_14361`, `fastapi_13207`, `fastapi_14246`, `fastapi_14186`, `fastapi_14605`, `fastapi_14583`, `fastapi_14297`, `fastapi_14953` |
| **FastAPI-4: OpenAPI Schema & Docs Generation (openapi/)** | 6 | 9.0% | SUB-1C(3), SUB-3C(1), SUB-2A(1) | RC-4A(2), RC-2B(1), RC-3C(1) | 1.67 | 15.7 | 13 | `fastapi_14986`, `fastapi_14463`, `fastapi_14455`, `fastapi_13713`, `fastapi_14077`, `fastapi_14791` |
| **FastAPI-5: Responses, Streaming, SSE & Static Frontend (responses.py, sse.py)** | 4 | 6.0% | SUB-2A(2), SUB-3C(1), SUB-4B(1) | RC-7A(2), RC-2A(1), RC-6A(1) | 4.75 | 322.2 | 560 | `fastapi_15588`, `fastapi_15030`, `fastapi_14964`, `fastapi_15800` |
| **FastAPI-6: Security, OAuth2 Scopes & Authentication (security/)** | 5 | 7.5% | SUB-1C(3), SUB-1F(1), SUB-3C(1) | RC-3C(2), RC-2B(1), RC-4A(1) | 3.40 | 70.8 | 18 | `fastapi_14786`, `fastapi_14459`, `fastapi_5624`, `fastapi_14266`, `fastapi_13786` |
| **FastAPI-7: Docs, Tutorials & Release Scripts (docs_src/, scripts/)** | 4 | 6.0% | SUB-6A(3), SUB-6B(1) | RC-4C(2), RC-7B(1), RC-8B(1) | 1.00 | 62.8 | 26 | `fastapi_15661`, `fastapi_15023`, `fastapi_14492`, `fastapi_14487` |

### 1.2. File-Level Hotspots in `fastapi/fastapi`

| Target File Path (`filepath`) | Tasks Touching File | Share of Repo Tasks (%) | Primary Sub-Categories (`Axis 1B`) | Root-Cause Mechanisms (`Axis 2B`) | Sample `instance_id`s |
| :--- | ---: | ---: | :--- | :--- | :--- |
| `fastapi/dependencies/utils.py` | 27 | 40.3% | SUB-1A, SUB-1B, SUB-1C, SUB-2A, SUB-2B, SUB-3A, SUB-3C, SUB-4A, SUB-5A | RC-1A, RC-1B, RC-1C, RC-2C, RC-3A, RC-3B, RC-3C, RC-3D, RC-4A, RC-6A, RC-6B, RC-6C, RC-7A | `fastapi_15589`, `fastapi_13920`, `fastapi_14794`, `fastapi_14479` (+23) |
| `fastapi/routing.py` | 16 | 23.9% | SUB-1F, SUB-2A, SUB-3A, SUB-3B, SUB-4A, SUB-5A | RC-2A, RC-2C, RC-3C, RC-4B, RC-6A, RC-6B, RC-6C, RC-7A, RC-7C, RC-8A, RC-8B | `fastapi_15030`, `fastapi_14962`, `fastapi_14978`, `fastapi_14258` (+12) |
| `fastapi/_compat/v2.py` | 13 | 19.4% | SUB-1A, SUB-1B, SUB-1C, SUB-3B, SUB-3C, SUB-4A | RC-1A, RC-3A, RC-4A, RC-6B, RC-6C, RC-8A | `fastapi_14962`, `fastapi_14609`, `fastapi_14349`, `fastapi_14512` (+9) |
| `fastapi/openapi/utils.py` | 12 | 17.9% | SUB-1B, SUB-1C, SUB-2A, SUB-3A, SUB-4A, SUB-4B | RC-3A, RC-3C, RC-3D, RC-4A, RC-6A, RC-6B, RC-6C, RC-7A, RC-7C | `fastapi_15030`, `fastapi_14463`, `fastapi_14609`, `fastapi_14459` (+8) |
| `fastapi/applications.py` | 7 | 10.4% | SUB-2A, SUB-3A, SUB-3C | RC-2A, RC-2B, RC-3C, RC-3D, RC-7A, RC-8B | `fastapi_15280`, `fastapi_14986`, `fastapi_14978`, `fastapi_14099` (+3) |
| `fastapi/dependencies/models.py` | 7 | 10.4% | SUB-1A, SUB-1C, SUB-2A, SUB-2B, SUB-3A | RC-1B, RC-3C, RC-7A | `fastapi_14458`, `fastapi_14459`, `fastapi_14448`, `fastapi_9753` (+3) |
| `fastapi/params.py` | 5 | 7.5% | SUB-1B, SUB-2A, SUB-3C, SUB-4A | RC-3A, RC-3C, RC-6A, RC-6C, RC-7A | `fastapi_14609`, `fastapi_14372`, `fastapi_14262`, `fastapi_14371` (+1) |
| `fastapi/exceptions.py` | 4 | 6.0% | SUB-2A, SUB-4A, SUB-5A | RC-2C, RC-6A, RC-6C, RC-7A | `fastapi_14609`, `fastapi_14306`, `fastapi_14262`, `fastapi_14605` |
| `fastapi/temp_pydantic_v1_params.py` | 3 | 4.5% | SUB-4A | RC-6A, RC-6B, RC-6C | `fastapi_14609`, `fastapi_14186`, `fastapi_14605` |
| `fastapi/utils.py` | 3 | 4.5% | SUB-4A | RC-6A, RC-6B, RC-6C | `fastapi_14609`, `fastapi_14186`, `fastapi_14605` |
| `fastapi/_compat/__init__.py` | 2 | 3.0% | SUB-4A | RC-6B, RC-6C | `fastapi_14609`, `fastapi_14186` |
| `fastapi/_compat/main.py` | 2 | 3.0% | SUB-4A | RC-6B, RC-6C | `fastapi_14609`, `fastapi_14186` |
| `fastapi/_compat/may_v1.py` | 2 | 3.0% | SUB-4A | RC-6B, RC-6C | `fastapi_14609`, `fastapi_14186` |
| `fastapi/_compat/shared.py` | 2 | 3.0% | SUB-4A | RC-6B, RC-6C | `fastapi_14609`, `fastapi_14186` |
| `fastapi/_compat/v1.py` | 2 | 3.0% | SUB-4A | RC-6B, RC-6C | `fastapi_14609`, `fastapi_14186` |

### 1.3. Dominant Code-Level Defect & Modification Archetypes in `fastapi/fastapi`

1. **`fastapi/dependencies/utils.py` & `models.py` (34 file touches across 27 tasks)**:
   - **Callable & Type Unwrapping (`RC-1A`, `RC-1B`, `RC-1C`)**: FastAPI's dependency resolver (`get_dependant`, `analyze_param`, `get_typed_signature`, `get_typed_annotation`, `solve_dependencies`) repeatedly encounters edge cases when user functions or classes use modern Python typing or decorators:
     - *Decorators & Partials*: `inspect.unwrap()` must be combined with recursive `functools.partial` unwrapping (`_impartial`) so `is_coroutine_callable`, `is_gen_callable`, and `is_async_gen_callable` inspect the underlying function (`fastapi_9555`, `fastapi_9753`, `fastapi_14448`), while explicitly guarding `if inspect.isclass(_unwrapped_call(self.call)): return False` (`fastapi_14458`). Similarly, `globalns` for forward references must be extracted from `inspect.unwrap(call).__globals__` (`fastapi_5077`).
     - *Stringified Annotations & PEP 695*: `inspect.signature(call, eval_str=True)` evaluates stringified annotations on Python 3.10+ (`fastapi_11355`), but must catch `except NameError:` when annotations reference symbols guarded by `if TYPE_CHECKING:` (`fastapi_14485`). PEP 695 `type MyAlias = ...` (`TypeAliasType`) requires unpacking `annotation = annotation.__value__` via `is_typealiastype(annotation)` (`fastapi_13920`).
   - **MultiDict & Alias Parameter Extraction (`RC-3A`, `RC-3B`)**: In `request_params_to_args` and `_extract_form_body`, iterating `for key, value in received_params.items():` drops duplicate keys on `ImmutableMultiDict` / `Headers`; fixes switch to `for key in received_params.keys():` and call `received_params.getlist(key)` when `len > 1` (`fastapi_14303`, `fastapi_14356`). Conversely, when a `Form()` field uses Pydantic's `Json[list[str]]`, `is_sequence_field(field)` is `True` even though the wire payload is a single JSON string—requiring `not _is_json_field(field)` before calling `getlist()` (`fastapi_14616`). For aliased fields, `params_to_process[field.alias] = value` and `processed_keys.add(get_validation_alias(field))` prevent alias mismatches and underscore-header leaks (`fastapi_14360`, `fastapi_15589`, `fastapi_14371`, `fastapi_13537`).
2. **`fastapi/_compat/v2.py` (15 file touches across 14 tasks)**:
   - Handles the boundary between FastAPI's `ModelField` abstraction and Pydantic v2's `TypeAdapter` / `JsonSchema` generator:
     - Unpacking `Annotated` and Python 3.10 `UnionType` (`A | B`) alongside `typing.Union` (`fastapi_12942`, `fastapi_14297`, `fastapi_14430`, `fastapi_14512`).
     - Preserving `arbitrary_types_allowed=True` in `create_body_model` and `TypeAdapter` (`fastapi_14482`).
     - Schema `$ref` remapping: guarding `if isinstance(value, str):` when a model property is literally named `"$ref"` (`fastapi_14349`) and checking `"$ref" in schema` (`fastapi_14361`).
     - Separating `"validation"` vs `"serialization"` mode schemas for nested models (`fastapi_14246`) and including `computed_fields` even when `separate_input_output_schemas=False` (`fastapi_13207`).
3. **`fastapi/routing.py` & `fastapi/applications.py` (23 file touches across 18 tasks)**:
   - Major structural features and lifecycle refactors:
     - **Server-Sent Events (`fastapi_15030`, `fastapi_15588`)**: New `fastapi/sse.py` module implementing `ServerSentEvent`, `EventSourceResponse`, keepalive ping task, and Rust Pydantic JSON fast-path (`fastapi_14962`).
     - **SPA Static Frontend Mounting (`fastapi_15800`)**: Adds `app.frontend()` and `router.frontend()` with `CachedStaticFiles`, `FileResponse`, and SPA index fallback.
     - **Route Context Preservation (`fastapi_15745`, `fastapi_15763`, `fastapi_15785`)**: Replaces route cloning in `include_router` with `_EffectiveRouteContext` and `RouteContext`.
     - **Resource Teardown & Lifespan (`fastapi_14099`, `fastapi_14262`, `fastapi_14851`, `fastapi_14873`)**: `AsyncExitStack` middleware to keep `yield` dependencies alive until `StreamingResponse` finishes, `Depends(scope="function" | "request")`, and local `on_startup`/`on_shutdown` lifespan wrapping.

---

## 2. `Textualize/rich` Engineering Deep Dive (48 Tasks — 37.21% of Benchmark)

### 2.1. Architectural Subsystem Breakdown (`Rich-1` through `Rich-6`)

`Textualize/rich` (`48` tasks, spanning `2023-07-29` to `2026-04-12`) represents a completely different software engineering domain from `fastapi`: **terminal character cell geometry, Unicode grapheme clusters, ANSI escape decoding, and visual layout state machines**. Moreover, **50.00% (24/48)** of `rich` tasks have ultra-terse prompts (`PC-5`, `<180` characters), making `rich` the primary stress test for code localization under minimal prompt guidance.

| Subsystem (`Axis 3`) | Tasks | Share of Repo (%) | Top Primary Sub-Categories | Top Root-Cause Mechanisms | Avg Files | Mean Churn | Med Churn | All `instance_id`s in Subsystem |
| :--- | ---: | ---: | :--- | :--- | ---: | ---: | ---: | :--- |
| **Rich-1: Console Core, Export, FileProxy & Diagnostics (console.py, _export_format.py, file_proxy.py, diagnose.py)** | 9 | 18.8% | SUB-1E(5), SUB-2C(3), SUB-3B(1) | RC-7C(3), RC-5B(2), RC-8A(1) | 2.11 | 27.6 | 13 | `rich_4070`, `rich_4077`, `rich_4075`, `rich_3777`, `rich_3468`, `rich_3675`, `rich_3470`, `rich_3105`, `rich_3043` |
| **Rich-2: Unicode Cell Widths, Segments & Wrapping (cells.py, segment.py, _wrap.py, _unicode_data/)** | 9 | 18.8% | SUB-1D(7), SUB-1E(1), SUB-2C(1) | RC-5A(7), RC-5B(1), RC-7A(1) | 4.11 | 1446.6 | 35 | `rich_4006`, `rich_3953`, `rich_3944`, `rich_3938`, `rich_3930`, `rich_3180`, `rich_3535`, `rich_3521`, `rich_3506` |
| **Rich-3: Text, Style, Markup, ANSI & Highlighter (text.py, style.py, markup.py, ansi.py, highlighter.py)** | 9 | 18.8% | SUB-1E(7), SUB-1D(1), SUB-2C(1) | RC-5C(3), RC-2B(3), RC-3C(2) | 1.00 | 12.6 | 2 | `rich_4076`, `rich_3480`, `rich_3454`, `rich_3471`, `rich_3278`, `rich_2943`, `rich_3067`, `rich_3063`, `rich_3061` |
| **Rich-4: Markdown & Table Layout Engine (markdown.py, table.py, panel.py)** | 9 | 18.8% | SUB-1E(8), SUB-3C(1) | RC-5B(4), RC-5D(3), RC-3D(1) | 1.11 | 15.9 | 10 | `rich_4079`, `rich_3718`, `rich_3942`, `rich_3935`, `rich_3518`, `rich_3469`, `rich_2725`, `rich_3130`, `rich_3064` |
| **Rich-5: Syntax, Traceback, Pretty, Inspect & Repr (syntax.py, traceback.py, pretty.py, _inspect.py, repr.py)** | 8 | 16.7% | SUB-1A(3), SUB-1E(3), SUB-2C(2) | RC-1B(3), RC-7C(2), RC-5D(1) | 1.38 | 24.9 | 13 | `rich_3894`, `rich_3486`, `rich_3782`, `rich_3772`, `rich_3296`, `rich_3676`, `rich_3472`, `rich_3006` |
| **Rich-6: Live Display, Progress & Interactive Prompts (live.py, progress.py, prompt.py)** | 4 | 8.3% | SUB-1E(3), SUB-2C(1) | RC-5D(2), RC-3D(1), RC-7C(1) | 1.25 | 15.8 | 20 | `rich_3934`, `rich_3882`, `rich_3905`, `rich_3052` |

### 2.2. File-Level Hotspots in `Textualize/rich`

| Target File Path (`filepath`) | Tasks Touching File | Share of Repo Tasks (%) | Primary Sub-Categories (`Axis 1B`) | Root-Cause Mechanisms (`Axis 2B`) | Sample `instance_id`s |
| :--- | ---: | ---: | :--- | :--- | :--- |
| `rich/console.py` | 7 | 14.6% | SUB-1E, SUB-2C, SUB-3B | RC-3C, RC-5B, RC-5C, RC-7C, RC-8A, RC-8B | `rich_4070`, `rich_4075`, `rich_3938`, `rich_3777` (+3) |
| `rich/cells.py` | 6 | 12.5% | SUB-1D, SUB-2C | RC-5A, RC-7A | `rich_4006`, `rich_3953`, `rich_3944`, `rich_3930` (+2) |
| `rich/markdown.py` | 5 | 10.4% | SUB-1E, SUB-3C | RC-5B, RC-5C, RC-5D | `rich_4079`, `rich_3942`, `rich_3469`, `rich_3130` (+1) |
| `rich/segment.py` | 5 | 10.4% | SUB-1D, SUB-1E, SUB-3B | RC-5A, RC-5B, RC-8A | `rich_4070`, `rich_3938`, `rich_3535`, `rich_3521` (+1) |
| `rich/syntax.py` | 4 | 8.3% | SUB-1E, SUB-2C, SUB-3B | RC-5B, RC-5D, RC-7C, RC-8A | `rich_4070`, `rich_3486`, `rich_3782`, `rich_3296` |
| `rich/default_styles.py` | 3 | 6.2% | SUB-2C, SUB-3C | RC-5B, RC-7C | `rich_3942`, `rich_3486`, `rich_3676` |
| `rich/table.py` | 3 | 6.2% | SUB-1E | RC-3D, RC-5D | `rich_3935`, `rich_3518`, `rich_2725` |
| `rich/text.py` | 3 | 6.2% | SUB-1D, SUB-1E, SUB-2C | RC-2B, RC-3C, RC-5B | `rich_3480`, `rich_3471`, `rich_3061` |
| `rich/traceback.py` | 3 | 6.2% | SUB-1E, SUB-2C | RC-2C, RC-7C | `rich_3486`, `rich_3772`, `rich_3676` |
| `rich/_export_format.py` | 2 | 4.2% | SUB-1E | RC-5B | `rich_3105`, `rich_3043` |
| `rich/ansi.py` | 2 | 4.2% | SUB-1E | RC-2B, RC-5C | `rich_4076`, `rich_3278` |
| `rich/diagnose.py` | 2 | 4.2% | SUB-2C | RC-7C | `rich_3777`, `rich_3675` |
| `rich/highlighter.py` | 2 | 4.2% | SUB-1E | RC-5C | `rich_3454`, `rich_3067` |
| `rich/prompt.py` | 2 | 4.2% | SUB-1E, SUB-2C | RC-3D, RC-7C | `rich_3882`, `rich_3052` |
| `rich/repr.py` | 2 | 4.2% | SUB-1A, SUB-3B | RC-1B, RC-8A | `rich_4070`, `rich_3006` |

### 2.3. Dominant Code-Level Defect & Modification Archetypes in `Textualize/rich`

1. **Unicode Cell Widths, Grapheme Clusters & Segment Splitting (`Rich-2`: `cells.py`, `segment.py`, `_wrap.py`)**:
   - Terminal rendering requires converting codepoint indices (`len(text)`) into visual column widths (`cell_len(text)`), where CJK ideographs and multi-codepoint ZWJ emojis occupy 2 terminal cells and control/combining characters occupy 0 cells:
     - **Grapheme & Binary Search Loops (`rich_3930`, `rich_3944`, `rich_3953`, `rich_4006`)**: `rich_3930` replaces `rich/_cell_widths.py` with 23 Unicode version tables (`rich/_unicode_data/unicode4-1-0.py` through `unicode17-0-0.py`) and introduces `split_graphemes()`. Subsequent tasks fix `while lower_bound <= upper_bound:` termination in `get_character_cell_size` (`rich_3953`), fallback width `1` (`rich_3944`), and infinite loops in `split_graphemes` when unmapped control/ZWJ codepoints appear (`rich_4006`).
     - **Double-Width Character Cutting & Word Wrapping (`rich_3180`, `rich_3506`, `rich_3521`, `rich_3535`)**: In `Segment._split_cells(segment, cut)`, estimating string slice index via `pos = int((cut / cell_length) * len(text))` and stepping left/right must handle double-width characters split down the middle (replacing them with spaces) and include box-drawing characters `─-◿` in `_is_single_cell_widths`. In `_wrap.py`, `divide_line` must track cell positions across double-width characters without dropping characters (`rich_3180`).
2. **Style Inheritance, Span Mutation & Markup/ANSI Escaping (`Rich-3` & `Rich-4`)**:
   - **In-Place Mutation & Cache Bugs**: In `Text.append` / `append_text`, iterating `for start, end, style in text._spans:` when `self is text` causes an infinite loop unless `.copy()` is used (`rich_3480`). In `Style.clear_meta_and_links()`, copying `style._hash = self._hash` retains a stale hash after clearing `_meta`; it must reset `style._hash = None` (`rich_2943`).
   - **Markdown & Table Rendering (`rich/markdown.py`, `rich/table.py`, `rich/panel.py`)**: Preserving inline code/link styles inside Markdown table cells (`rich_3130`, `rich_4079`), removing `assert self.header is not None` crashes on headerless Markdown tables (`rich_3064`), avoiding extra spaces after inline elements (`rich_3469`), propagating `highlight=self.highlight` when `Table.add_row` auto-creates columns (`rich_3518`), fixing `Table._box` footer element order (`foot_left`, `foot_right`, `foot_vertical` in `rich_2725`), and applying panel background style to `Panel` titles (`rich_3718`).
3. **Console Lifecycle, Environment Flags & Traceback Introspection (`Rich-1` & `Rich-5`)**:
   - Adding `TTY_COMPATIBLE` (`rich_3675`) and `TTY_INTERACTIVE` (`rich_3777`) environment variable overrides in `Console.is_terminal` / `is_interactive`.
   - Handling `BrokenPipeError` in `Console._check_buffer` by flushing `devnull` (`rich_3468`), guarding `if self.record and not self._buffer_index:` so `Console.capture()` does not leak into the record buffer (`rich_3470`), and preventing `RecursionError` on cyclic exception chains (`__cause__` / `__context__`) in `Traceback.extract` via a `_visited_exceptions` set (`rich_3772`).

---

## 3. `psf/requests` Engineering Deep Dive (13 Tasks — 10.08% of Benchmark)

### 3.1. Architectural Subsystem Breakdown (`Requests-1` through `Requests-4`)

`psf/requests` (`13` tasks, created between `2023-12-16` and `2026-06-09`) has the smallest patch footprint in the benchmark (**mean churn: 6.8 lines; median churn: 4 lines; max files changed: 2**). Every task in `requests` is a surgical protocol, proxy, stream-detection, or exception-serialization fix under `src/requests/`.

| Subsystem (`Axis 3`) | Tasks | Share of Repo (%) | Top Primary Sub-Categories | Top Root-Cause Mechanisms | Avg Files | Mean Churn | Med Churn | All `instance_id`s in Subsystem |
| :--- | ---: | ---: | :--- | :--- | ---: | ---: | ---: | :--- |
| **Requests-1: Request/Response Models & Body Preparation (models.py, _types.py)** | 3 | 23.1% | SUB-1A(2), SUB-3C(1) | RC-1B(3) | 1.33 | 8.7 | 6 | `requests_7505`, `requests_7502`, `requests_7433` |
| **Requests-2: URL, Proxy, Header, Netrc & Content Utilities (utils.py)** | 4 | 30.8% | SUB-1F(4) | RC-4B(3), RC-2A(1) | 1.00 | 6.5 | 6 | `requests_7427`, `requests_7309`, `requests_7205`, `requests_6589` |
| **Requests-3: Transport Adapters, Sessions & Redirects (adapters.py, sessions.py)** | 3 | 23.1% | SUB-1F(3) | RC-4B(2), RC-3C(1) | 1.00 | 2.7 | 3 | `requests_7315`, `requests_7328`, `requests_6644` |
| **Requests-4: Exceptions, Status Codes & Compat Shims (exceptions.py, status_codes.py, compat.py)** | 3 | 23.1% | SUB-4B(1), SUB-1F(1), SUB-2B(1) | RC-6B(1), RC-1B(1), RC-4B(1) | 1.33 | 9.7 | 10 | `requests_6757`, `requests_6629`, `requests_6592` |

### 3.2. File-Level Hotspots in `psf/requests`

| Target File Path (`filepath`) | Tasks Touching File | Share of Repo Tasks (%) | Primary Sub-Categories (`Axis 1B`) | Root-Cause Mechanisms (`Axis 2B`) | Sample `instance_id`s |
| :--- | ---: | ---: | :--- | :--- | :--- |
| `src/requests/utils.py` | 5 | 38.5% | SUB-1F, SUB-4B | RC-2A, RC-4B, RC-6B | `requests_7427`, `requests_7309`, `requests_7205`, `requests_6757` (+1) |
| `src/requests/models.py` | 3 | 23.1% | SUB-1A, SUB-3C | RC-1B | `requests_7505`, `requests_7502`, `requests_7433` |
| `src/requests/adapters.py` | 2 | 15.4% | SUB-1F | RC-4B | `requests_7315`, `requests_6644` |
| `src/requests/_types.py` | 1 | 7.7% | SUB-3C | RC-1B | `requests_7505` |
| `src/requests/compat.py` | 1 | 7.7% | SUB-4B | RC-6B | `requests_6757` |
| `src/requests/exceptions.py` | 1 | 7.7% | SUB-1F | RC-1B | `requests_6629` |
| `src/requests/sessions.py` | 1 | 7.7% | SUB-1F | RC-3C | `requests_7328` |
| `src/requests/status_codes.py` | 1 | 7.7% | SUB-2B | RC-4B | `requests_6592` |

### 3.3. Dominant Code-Level Defect & Modification Archetypes in `psf/requests`

1. **`__getattr__`-Proxied File/Stream Wrapper Detection (`requests_7433`, `requests_7502`, `requests_7505`)**:
   - Python stdlib and third-party wrappers (such as `tempfile._TemporaryFileWrapper`) delegate `.read` or `.__iter__` dynamically via `__getattr__` rather than defining them on the class type. Consequently, runtime `isinstance(obj, SupportsRead)` or `isinstance(data, Iterable)` returns `False`! The fixes add `or hasattr(data, "__iter__")` (`requests_7433`) and `or hasattr(fp, "read")` / `_t.has_read(data)` (`requests_7502`, `requests_7505`).
2. **URL, Proxy, Netrc & Header RFC Edge Cases (`requests_7427`, `requests_7315`, `requests_6644`, `requests_7309`, `requests_7205`, `requests_6589`)**:
   - `proxy_bypass_environment` (`utils.py`): Constraining `no_proxy` suffix matches to strict domain boundaries (`host = host.lstrip(".")` then `host = "." + host`, porting CPython `bpo-39057` in `requests_7427`).
   - `get_netrc_auth` (`utils.py`): Checking `if _netrc and any(_netrc):` because Python 3.11+ `netrc` returns `('', '', '')` for empty machine entries instead of raising `NetrcParseError` (`requests_7205`).
   - `_parse_content_type_header` (`utils.py`): Ignoring malformed `Content-Type` parameters that lack an `=` delimiter per RFC 9110 (`requests_7309`).
   - `super_len` (`utils.py`): Encoding `str` to UTF-8 bytes (`o = o.encode("utf-8")`) before measuring `Content-Length` (`requests_6589`) and handling `urllib3` 1.26.x compatibility (`requests_6757`).
   - `JSONDecodeError.__reduce__` (`exceptions.py`): Overriding `__reduce__` so `pickle.loads(pickle.dumps(err))` uses `CompatJSONDecodeError.__reduce__` instead of `IOError.__reduce__` in `multiprocessing` pools (`requests_6629`).

---

## 4. `encode/httpx` Engineering Deep Dive (1 Task — 0.78% of Benchmark)

### 4.1. Subsystem & File Breakdown (`HTTPX-1`: `httpx_3672`)

| Subsystem (`Axis 3`) | Tasks | Share of Repo (%) | Top Primary Sub-Categories | Top Root-Cause Mechanisms | Avg Files | Mean Churn | Med Churn | All `instance_id`s in Subsystem |
| :--- | ---: | ---: | :--- | :--- | ---: | ---: | ---: | :--- |
| **HTTPX-1: Dual Sync/Async HTTP Parser, Pool & Server (httpx/, ahttpx/)** | 1 | 100.0% | SUB-2A(1) | RC-8B(1) | 7.00 | 79.0 | 79 | `httpx_3672` |

### 4.2. Dual Sync/Async (`src/httpx/` + `src/ahttpx/`) Synchronization Pattern

Although `encode/httpx` accounts for only a single task in the public training set (`httpx_3672`, created `2025-09-19`), it represents a distinct architectural archetype: **synchronized dual-tree maintenance**. At commit `4acf5c2c`, the repository maintains parallel synchronous (`src/httpx/`) and asynchronous (`src/ahttpx/`) implementations of its internal HTTP/1.1 parser, connection pool, and server:
- **Modified Files (7 total, 18 hunks, `+57 / -22` lines)**:
  - Async tree: `src/ahttpx/_parsers.py`, `src/ahttpx/_pool.py`, `src/ahttpx/_server.py`
  - Sync tree: `src/httpx/_network.py`, `src/httpx/_parsers.py`, `src/httpx/_pool.py`, `src/httpx/_server.py`
- **Technical Changes**:
  1. Renames `HTTPParser.complete()` $	o$ `HTTPParser.reset() -> bool` and adds `HTTPParser.is_keepalive() -> bool`.
  2. Updates connection pool (`_pool.py`) and server (`_server.py`) in **both** `src/httpx/` and `src/ahttpx/` to drain unread request bodies (`await stream.recv_body()` / `stream.recv_body()`) before calling `reset()` on keep-alive connections, and suppresses `KeyboardInterrupt` on server closure.
- **Agent Lesson**: Whenever a repository contains mirrored sync/async packages (e.g., `httpx` and `ahttpx`, or `_sync` and `_async`), `get_code_neighbors` and `search_similar_code` will surface symbols in both trees—and the agent must apply symmetric edits to **both** trees.


---

<!-- ====================================================================== -->
<!-- FILE: 04_Complete_129_Task_Classified_Catalog.md -->
<!-- ====================================================================== -->

# Complete 129-Task Classified Catalog (`tasks.jsonl`)

*Dataset Analyzed: `input/kagglecomp/kagglecomp_data_package/tasks.jsonl` (All 129 Public Benchmark Tasks)*
*Date: 2026-11-05*

---

## 1. Legend & Code Key for the 6 Taxonomic Axes

| Axis Code | Taxonomic Dimension | Short Codes Used in Master Table | Full Definitions Reference |
| :--- | :--- | :--- | :--- |
| **`Ax1`** | Primary Task Intent Category | `CAT-1` (Bug Fix), `CAT-2` (New Feature), `CAT-3` (Refactor/Perf/Protocol), `CAT-4` (Compat/Deprecation), `CAT-5` (DX/Diagnostics), `CAT-6` (Docs/Tooling) | See `02_Multi_Dimensional_Problem_Taxonomy_and_Subcategories.md` §2.1 |
| **`Ax1B`** | Primary Task Sub-Category | `SUB-1A` through `SUB-6B` (17 fine-grained sub-categories) | See `02_Multi_Dimensional_Problem_Taxonomy_and_Subcategories.md` §2.2 |
| **`Ax2B`** | Root-Cause & Modification Sub-Category | `RC-1A` through `RC-8B` (22 code-level root-cause mechanisms) | See `02_Multi_Dimensional_Problem_Taxonomy_and_Subcategories.md` §3.2 |
| **`Ax3`** | Repository Architectural Subsystem | `FastAPI-1`..`7`, `Rich-1`..`6`, `Requests-1`..`4`, `HTTPX-1` (18 subsystems) | See `02_Multi_Dimensional_Problem_Taxonomy_and_Subcategories.md` §4 |
| **`Ax4`** | Prompt Specification & Offline Solvability | `PC-1` (Solution-Guided), `PC-2` (MRE/Traceback), `PC-3` (Behavioral Prose), `PC-4` (`docs_src` Tutorial-Coupled), `PC-5` (Opaque `<180c` / Issue URL) | See `02_Multi_Dimensional_Problem_Taxonomy_and_Subcategories.md` §5 |
| **`Ax5A`** | Patch Structural Complexity Tier | `TIER-1` (1f, 1h, $\le 6$L), `TIER-2` (1f, 1–3h, $\le 35$L), `TIER-3` (1–2f, $\le 120$L), `TIER-4` (2–5f or New, $\le 300$L), `TIER-5` ($>5$f or $>300$L) | See `02_Multi_Dimensional_Problem_Taxonomy_and_Subcategories.md` §6.1 |
| **`Ax5B`** | AST Call-Graph & Embedding Reachability | `GRAPH-1` (Direct Symbol Node), `GRAPH-2` (Module-Level Hunk), `GRAPH-3` (Non-Indexed Constant/Template), `GRAPH-4` (Net-New File) | See `02_Multi_Dimensional_Problem_Taxonomy_and_Subcategories.md` §6.2 |
| **`Ax6`** | Runtime Failure & Verification Phenotype | `FM-1` (`TypeError`/`AttributeError`/`NameError`), `FM-2` (`ValueError`/`ValidationError`), `FM-3` (HTTP Status), `FM-4` (Loop/Recursion/Assert), `FM-5` (Visual/ANSI), `FM-6` (Silent Logic/State), `FM-7` (Missing Feature), `FM-8` (Missing Warning/Context) | See `02_Multi_Dimensional_Problem_Taxonomy_and_Subcategories.md` §7 |

---

## 2. Master 129-Task Classification Table (Dataset Order `#001` – `#129`)

| # | `instance_id` | Repo | Created | Cat (`Ax1`) | SubCat (`Ax1B`) | Root Cause (`Ax2B`) | Subsys (`Ax3`) | Prompt (`Ax4`) | Tier (`Ax5A`) | Graph (`Ax5B`) | FailMode (`Ax6`) | Diff (`+A/-R`, Files, Hunks) | Target Files Modified | PR Title / Problem Summary |
| ---: | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 001 | `fastapi_15661` | `fastapi` | `2026-05-31` | **CAT-6** | `SUB-6B` | `RC-7B` | `FastAPI-7` | `PC-3` | `TIER-4` | `GRAPH-4` | `FM-7` | `+216/-0` (1f, 1h) | `scripts/prepare_release.py` | 👷 Automate release preparation |
| 002 | `fastapi_15588` | `fastapi` | `2026-05-23` | **CAT-3** | `SUB-3C` | `RC-2A` | `FastAPI-5` | `PC-3` | `TIER-2` | `GRAPH-1` | `FM-2` | `+18/-5` (1f, 2h) | `fastapi/sse.py` | ♻️ Validate Server Sent Event fields to avoid applications from sending broken data |
| 003 | `fastapi_15589` | `fastapi` | `2026-05-23` | **CAT-1** | `SUB-1B` | `RC-3A` | `FastAPI-1` | `PC-3` | `TIER-1` | `GRAPH-1` | `FM-6` | `+4/-0` (1f, 1h) | `fastapi/dependencies/utils.py` | ♻️ Do not accept underscore headers when using `convert_underscores=True` (the default) |
| 004 | `fastapi_15030` | `fastapi` | `2026-03-01` | **CAT-2** | `SUB-2A` | `RC-7A` | `FastAPI-5` | `PC-4` | `TIER-5` | `GRAPH-1` | `FM-7` | `+525/-35` (9f, 17h) | `docs_src/server_sent_events/tutorial001_py310.py`, `docs_src/server_sent_events/tutorial002_py310.py`, `docs_src/server_sent_events/tutorial003_py310.py` (+6 more) | ✨ Add support for Server Sent Events |
| 005 | `fastapi_14962` | `fastapi` | `2026-02-22` | **CAT-3** | `SUB-3B` | `RC-8A` | `FastAPI-2` | `PC-4` | `TIER-4` | `GRAPH-1` | `FM-6` | `+49/-6` (3f, 6h) | `docs_src/custom_response/tutorial010_py310.py`, `fastapi/_compat/v2.py`, `fastapi/routing.py` | ✨ Serialize JSON response with Pydantic (in Rust), when there's a Pydantic return type or |
| 006 | `fastapi_15280` | `fastapi` | `2026-04-01` | **CAT-2** | `SUB-2A` | `RC-7A` | `FastAPI-2` | `PC-5` | `TIER-4` | `GRAPH-1` | `FM-7` | `+71/-1` (2f, 3h) | `docs_src/vibe/tutorial001_py310.py`, `fastapi/applications.py` | ✨ Add support for `@app.vibe()` |
| 007 | `fastapi_14964` | `fastapi` | `2026-02-22` | **CAT-4** | `SUB-4B` | `RC-6A` | `FastAPI-5` | `PC-3` | `TIER-3` | `GRAPH-2` | `FM-8` | `+44/-8` (1f, 2h) | `fastapi/responses.py` | 🗑️ Deprecate `ORJSONResponse` and `UJSONResponse` |
| 008 | `fastapi_15023` | `fastapi` | `2026-02-27` | **CAT-6** | `SUB-6A` | `RC-8B` | `FastAPI-7` | `PC-4` | `TIER-2` | `GRAPH-1` | `FM-6` | `+18/-8` (1f, 1h) | `docs_src/stream_data/tutorial002_py310.py` | 📝 Update docs for responses and new stream with `yield` |
| 009 | `fastapi_14986` | `fastapi` | `2026-02-24` | **CAT-3** | `SUB-3C` | `RC-2B` | `FastAPI-4` | `PC-3` | `TIER-3` | `GRAPH-1` | `FM-6` | `+25/-9` (2f, 4h) | `fastapi/applications.py`, `fastapi/openapi/docs.py` | ♻️ Refactor logic to handle OpenAPI and Swagger UI escaping data |
| 010 | `fastapi_14978` | `fastapi` | `2026-02-23` | **CAT-2** | `SUB-2A` | `RC-2A` | `FastAPI-2` | `PC-4` | `TIER-4` | `GRAPH-1` | `FM-3` | `+81/-1` (3f, 14h) | `docs_src/strict_content_type/tutorial001_py310.py`, `fastapi/applications.py`, `fastapi/routing.py` | 🔒️ Add `strict_content_type` checking for JSON requests |
| 011 | `requests_7505` | `requests` | `2026-06-09` | **CAT-3** | `SUB-3C` | `RC-1B` | `Requests-1` | `PC-1` | `TIER-3` | `GRAPH-1` | `FM-1` | `+9/-7` (2f, 6h) | `src/requests/_types.py`, `src/requests/models.py` | Add hasattr checks for remaining protocol isinstance checks |
| 012 | `requests_7502` | `requests` | `2026-06-08` | **CAT-1** | `SUB-1A` | `RC-1B` | `Requests-1` | `PC-5` | `TIER-1` | `GRAPH-1` | `FM-1` | `+3/-1` (1f, 1h) | `src/requests/models.py` | Fix `_encode_files` detection for `__getattr__`-based file wrappers |
| 013 | `requests_7433` | `requests` | `2026-05-12` | **CAT-1** | `SUB-1A` | `RC-1B` | `Requests-1` | `PC-1` | `TIER-1` | `GRAPH-1` | `FM-1` | `+3/-3` (1f, 1h) | `src/requests/models.py` | Fix `prepare_body` stream detection for `__getattr__`-based file wrappers |
| 014 | `requests_7427` | `requests` | `2026-05-11` | **CAT-1** | `SUB-1F` | `RC-4B` | `Requests-2` | `PC-3` | `TIER-1` | `GRAPH-1` | `FM-6` | `+4/-2` (1f, 1h) | `src/requests/utils.py` | Port bpo-39057 to Requests |
| 015 | `requests_7315` | `requests` | `2026-05-10` | **CAT-1** | `SUB-1F` | `RC-4B` | `Requests-3` | `PC-1` | `TIER-1` | `GRAPH-1` | `FM-6` | `+0/-2` (1f, 1h) | `src/requests/adapters.py` | Preserve leading slashes in request path_url |
| 016 | `requests_7328` | `requests` | `2026-04-05` | **CAT-1** | `SUB-1F` | `RC-3C` | `Requests-3` | `PC-3` | `TIER-1` | `GRAPH-1` | `FM-6` | `+1/-2` (1f, 1h) | `src/requests/sessions.py` | Prevent Response self-reference in redirect history |
| 017 | `requests_7309` | `requests` | `2026-03-30` | **CAT-1** | `SUB-1F` | `RC-4B` | `Requests-2` | `PC-3` | `TIER-2` | `GRAPH-1` | `FM-6` | `+6/-9` (1f, 1h) | `src/requests/utils.py` | Fix malformed value parsing for Content-Type |
| 018 | `requests_7205` | `requests` | `2026-02-13` | **CAT-1** | `SUB-1F` | `RC-2A` | `Requests-2` | `PC-3` | `TIER-1` | `GRAPH-1` | `FM-6` | `+1/-1` (1f, 1h) | `src/requests/utils.py` | Fix empty netrc entry usage |
| 019 | `rich_4070` | `rich` | `2026-04-11` | **CAT-3** | `SUB-3B` | `RC-8A` | `Rich-1` | `PC-1` | `TIER-5` | `GRAPH-1` | `FM-6` | `+71/-57` (9f, 33h) | `rich/_emoji_replace.py`, `rich/console.py`, `rich/emoji.py` (+6 more) | perf: reduce Console and RichHandler import time by deferring unused imports |
| 020 | `rich_4077` | `rich` | `2026-04-12` | **CAT-2** | `SUB-2C` | `RC-7C` | `Rich-1` | `PC-5` | `TIER-1` | `GRAPH-1` | `FM-7` | `+3/-0` (1f, 1h) | `rich/file_proxy.py` | proxy isatty |
| 021 | `rich_4079` | `rich` | `2026-04-12` | **CAT-1** | `SUB-1E` | `RC-5B` | `Rich-4` | `PC-5` | `TIER-2` | `GRAPH-1` | `FM-5` | `+4/-3` (1f, 1h) | `rich/markdown.py` | Inline table code |
| 022 | `rich_4076` | `rich` | `2026-04-12` | **CAT-1** | `SUB-1E` | `RC-5C` | `Rich-3` | `PC-5` | `TIER-1` | `GRAPH-1` | `FM-5` | `+3/-3` (1f, 1h) | `rich/ansi.py` | preserve newlines |
| 023 | `rich_4075` | `rich` | `2026-04-11` | **CAT-1** | `SUB-1E` | `RC-5C` | `Rich-1` | `PC-5` | `TIER-3` | `GRAPH-1` | `FM-5` | `+12/-3` (1f, 4h) | `rich/console.py` | empty with end |
| 024 | `rich_4006` | `rich` | `2026-02-19` | **CAT-1** | `SUB-1D` | `RC-5A` | `Rich-2` | `PC-5` | `TIER-3` | `GRAPH-1` | `FM-4` | `+33/-12` (1f, 2h) | `rich/cells.py` | fix for infinite loop in split_graphemes |
| 025 | `fastapi_14258` | `fastapi` | `2026-02-10` | **CAT-5** | `SUB-5A` | `RC-2C` | `FastAPI-2` | `PC-3` | `TIER-1` | `GRAPH-1` | `FM-4` | `+4/-0` (1f, 1h) | `fastapi/routing.py` | ✨ Show a clear error on attempt to include router into itself |
| 026 | `fastapi_14851` | `fastapi` | `2026-02-06` | **CAT-3** | `SUB-3A` | `RC-6B` | `FastAPI-2` | `PC-3` | `TIER-4` | `GRAPH-1` | `FM-6` | `+153/-4` (1f, 5h) | `fastapi/routing.py` | ♻️ Re-implement `on_event` in FastAPI for compatibility with the next Starlette, while kee |
| 027 | `fastapi_14873` | `fastapi` | `2026-02-09` | **CAT-1** | `SUB-1F` | `RC-3C` | `FastAPI-2` | `PC-1` | `TIER-2` | `GRAPH-1` | `FM-6` | `+11/-10` (1f, 2h) | `fastapi/routing.py` | 🐛 Fix `on_startup` and `on_shutdown` parameters of `APIRouter` |
| 028 | `fastapi_13920` | `fastapi` | `2026-02-05` | **CAT-2** | `SUB-2B` | `RC-1A` | `FastAPI-1` | `PC-3` | `TIER-2` | `GRAPH-1` | `FM-1` | `+4/-0` (1f, 2h) | `fastapi/dependencies/utils.py` | ✨ Add support for PEP695 `TypeAliasType` |
| 029 | `fastapi_14794` | `fastapi` | `2026-02-05` | **CAT-2** | `SUB-2B` | `RC-1A` | `FastAPI-1` | `PC-1` | `TIER-2` | `GRAPH-1` | `FM-4` | `+3/-2` (1f, 2h) | `fastapi/dependencies/utils.py` | ✨ Allow `Response` type hint as dependency annotation |
| 030 | `fastapi_14786` | `fastapi` | `2026-02-04` | **CAT-1** | `SUB-1F` | `RC-2B` | `FastAPI-6` | `PC-1` | `TIER-1` | `GRAPH-1` | `FM-6` | `+1/-1` (1f, 1h) | `fastapi/security/utils.py` | 🐛 Strip whitespaces from `Authorization` header credentials |
| 031 | `fastapi_14492` | `fastapi` | `2026-02-04` | **CAT-6** | `SUB-6A` | `RC-4C` | `FastAPI-7` | `PC-4` | `TIER-1` | `GRAPH-3` | `FM-6` | `+1/-1` (1f, 1h) | `docs_src/metadata/tutorial001_1_py39.py` | 📝 Fix example of license identifier in documentation |
| 032 | `fastapi_14479` | `fastapi` | `2026-02-04` | **CAT-5** | `SUB-5A` | `RC-2C` | `FastAPI-1` | `PC-1` | `TIER-1` | `GRAPH-1` | `FM-8` | `+1/-1` (1f, 1h) | `fastapi/dependencies/utils.py` | 🚸 Improve error message for invalid query parameter type annotations |
| 033 | `fastapi_14463` | `fastapi` | `2026-02-04` | **CAT-1** | `SUB-1C` | `RC-3C` | `FastAPI-4` | `PC-1` | `TIER-2` | `GRAPH-1` | `FM-6` | `+2/-1` (1f, 2h) | `fastapi/openapi/utils.py` | 🐛 Fix OpenAPI duplication of `anyOf` refs for app-level responses with specified `content` |
| 034 | `fastapi_12942` | `fastapi` | `2025-10-08` | **CAT-1** | `SUB-1A` | `RC-1A` | `FastAPI-3` | `PC-1` | `TIER-1` | `GRAPH-1` | `FM-3` | `+3/-0` (1f, 1h) | `fastapi/_compat.py` | 🐛 Fix tagged discriminated union not recognized as body field |
| 035 | `fastapi_14099` | `fastapi` | `2025-09-29` | **CAT-3** | `SUB-3A` | `RC-8B` | `FastAPI-2` | `PC-4` | `TIER-5` | `GRAPH-1` | `FM-2` | `+346/-131` (5f, 13h) | `docs_src/dependencies/tutorial013_an_py310.py`, `docs_src/dependencies/tutorial014_an_py310.py`, `fastapi/applications.py` (+2 more) | 🐛 Fix support for `StreamingResponse`s with dependencies with `yield` or `UploadFile`s, cl |
| 036 | `fastapi_14609` | `fastapi` | `2025-12-27` | **CAT-4** | `SUB-4A` | `RC-6C` | `FastAPI-3` | `PC-3` | `TIER-5` | `GRAPH-1` | `FM-8` | `+192/-1855` (20f, 92h) | `docs_src/request_form_models/tutorial002_pv1_an_py39.py`, `docs_src/request_form_models/tutorial002_pv1_py39.py`, `fastapi/_compat/__init__.py` (+17 more) | ➖ Drop support for `pydantic.v1` |
| 037 | `fastapi_14372` | `fastapi` | `2025-11-19` | **CAT-3** | `SUB-3C` | `RC-3C` | `FastAPI-1` | `PC-3` | `TIER-3` | `GRAPH-1` | `FM-1` | `+4/-3` (2f, 3h) | `fastapi/dependencies/utils.py`, `fastapi/params.py` | ♻️ Make the result of `Depends()` and `Security()` hashable, as a workaround for other too |
| 038 | `fastapi_14349` | `fastapi` | `2025-11-13` | **CAT-1** | `SUB-1C` | `RC-4A` | `FastAPI-3` | `PC-3` | `TIER-2` | `GRAPH-1` | `FM-1` | `+6/-6` (1f, 1h) | `fastapi/_compat/v2.py` | 🐛 Fix handling of JSON Schema attributes named "$ref" |
| 039 | `fastapi_14512` | `fastapi` | `2025-12-12` | **CAT-1** | `SUB-1A` | `RC-1A` | `FastAPI-3` | `PC-3` | `TIER-3` | `GRAPH-1` | `FM-2` | `+48/-4` (1f, 3h) | `fastapi/_compat/v2.py` | 🐛 Fix support for tagged union with discriminator inside of `Annotated` with `Body()` |
| 040 | `fastapi_14487` | `fastapi` | `2025-12-10` | **CAT-6** | `SUB-6A` | `RC-4C` | `FastAPI-7` | `PC-4` | `TIER-2` | `GRAPH-3` | `FM-6` | `+5/-2` (1f, 1h) | `docs_src/handling_errors/tutorial004.py` | 📝 Update docs about re-raising validation errors, do not include string as is to not leak |
| 041 | `fastapi_11355` | `fastapi` | `2025-12-04` | **CAT-1** | `SUB-1A` | `RC-1C` | `FastAPI-1` | `PC-3` | `TIER-2` | `GRAPH-1` | `FM-3` | `+9/-2` (1f, 3h) | `fastapi/dependencies/utils.py` | 🐛 Fix evaluating stringified annotations in Python 3.10 |
| 042 | `fastapi_14485` | `fastapi` | `2025-12-10` | **CAT-1** | `SUB-1A` | `RC-1C` | `FastAPI-1` | `PC-3` | `TIER-2` | `GRAPH-1` | `FM-1` | `+13/-6` (1f, 2h) | `fastapi/dependencies/utils.py` | 🐛 Fix support for `if TYPE_CHECKING`,  non-evaluated stringified annotations |
| 043 | `fastapi_14482` | `fastapi` | `2025-12-10` | **CAT-1** | `SUB-1A` | `RC-1A` | `FastAPI-3` | `PC-3` | `TIER-3` | `GRAPH-1` | `FM-2` | `+25/-7` (1f, 5h) | `fastapi/_compat/v2.py` | 🐛 Fix handling arbitrary types when using `arbitrary_types_allowed=True` |
| 044 | `fastapi_14306` | `fastapi` | `2025-12-06` | **CAT-5** | `SUB-5A` | `RC-2C` | `FastAPI-2` | `PC-2` | `TIER-4` | `GRAPH-1` | `FM-8` | `+121/-16` (2f, 12h) | `fastapi/exceptions.py`, `fastapi/routing.py` | 🚸  Improve tracebacks by adding endpoint metadata |
| 045 | `fastapi_14458` | `fastapi` | `2025-12-05` | **CAT-1** | `SUB-1A` | `RC-1B` | `FastAPI-1` | `PC-3` | `TIER-3` | `GRAPH-1` | `FM-1` | `+6/-1` (1f, 4h) | `fastapi/dependencies/models.py` | 🐛 Fix using class (not instance) dependency that has `__call__` method |
| 046 | `fastapi_14459` | `fastapi` | `2025-12-04` | **CAT-1** | `SUB-1C` | `RC-3C` | `FastAPI-6` | `PC-3` | `TIER-4` | `GRAPH-1` | `FM-6` | `+49/-22` (3f, 8h) | `fastapi/dependencies/models.py`, `fastapi/dependencies/utils.py`, `fastapi/openapi/utils.py` | 🐛 Fix OAuth2 scopes in OpenAPI in extra corner cases, parent dependency with scopes, sub-d |
| 047 | `fastapi_14448` | `fastapi` | `2025-12-04` | **CAT-1** | `SUB-1A` | `RC-1B` | `FastAPI-1` | `PC-3` | `TIER-3` | `GRAPH-1` | `FM-1` | `+82/-24` (2f, 3h) | `fastapi/dependencies/models.py`, `fastapi/dependencies/utils.py` | 🐛 Fix support for functools wraps and partial combined, for async and regular functions an |
| 048 | `fastapi_14455` | `fastapi` | `2025-12-04` | **CAT-1** | `SUB-1C` | `RC-4A` | `FastAPI-4` | `PC-3` | `TIER-2` | `GRAPH-1` | `FM-6` | `+11/-2` (1f, 2h) | `fastapi/openapi/utils.py` | 🐛 Fix OpenAPI security scheme OAuth2 scopes declaration, deduplicate security schemes with |
| 049 | `fastapi_9753` | `fastapi` | `2025-12-02` | **CAT-2** | `SUB-2B` | `RC-1B` | `FastAPI-1` | `PC-3` | `TIER-2` | `GRAPH-1` | `FM-1` | `+5/-2` (1f, 2h) | `fastapi/dependencies/models.py` | ✨ Allow using dependables with `functools.partial()` |
| 050 | `fastapi_14430` | `fastapi` | `2025-12-02` | **CAT-1** | `SUB-1A` | `RC-1A` | `FastAPI-3` | `PC-3` | `TIER-2` | `GRAPH-1` | `FM-1` | `+2/-2` (1f, 2h) | `fastapi/_compat/v2.py` | 🐛 Fix optional sequence handling with new union syntax from Python 3.10 |
| 051 | `fastapi_5077` | `fastapi` | `2025-12-02` | **CAT-2** | `SUB-2B` | `RC-1C` | `FastAPI-1` | `PC-2` | `TIER-2` | `GRAPH-1` | `FM-1` | `+4/-2` (1f, 2h) | `fastapi/dependencies/utils.py` | ✨ Add support for wrapped functions (e.g. `@functools.wraps()`) used with forward referenc |
| 052 | `fastapi_9555` | `fastapi` | `2025-12-02` | **CAT-2** | `SUB-2B` | `RC-1B` | `FastAPI-1` | `PC-1` | `TIER-2` | `GRAPH-1` | `FM-6` | `+14/-8` (1f, 1h) | `fastapi/dependencies/models.py` | ✨ Handle wrapped dependencies |
| 053 | `fastapi_14361` | `fastapi` | `2025-12-02` | **CAT-1** | `SUB-1C` | `RC-4A` | `FastAPI-3` | `PC-5` | `TIER-1` | `GRAPH-1` | `FM-1` | `+1/-1` (1f, 1h) | `fastapi/_compat/v2.py` | 🐛 Avoid accessing non-existing "$ref" key for Pydantic v2 compat remapping |
| 054 | `fastapi_13207` | `fastapi` | `2025-12-02` | **CAT-1** | `SUB-1C` | `RC-4A` | `FastAPI-3` | `PC-3` | `TIER-2` | `GRAPH-1` | `FM-6` | `+12/-2` (1f, 2h) | `fastapi/_compat/v2.py` | 🐛 Fix OpenAPI schema support for computed fields when using `separate_input_output_schemas |
| 055 | `fastapi_14360` | `fastapi` | `2025-12-02` | **CAT-1** | `SUB-1B` | `RC-3A` | `FastAPI-1` | `PC-3` | `TIER-1` | `GRAPH-1` | `FM-3` | `+1/-2` (1f, 1h) | `fastapi/dependencies/utils.py` | 🐛 Fix Query\Header\Cookie parameter model alias |
| 056 | `fastapi_14356` | `fastapi` | `2025-12-02` | **CAT-1** | `SUB-1B` | `RC-3B` | `FastAPI-1` | `PC-1` | `TIER-2` | `GRAPH-1` | `FM-6` | `+9/-2` (1f, 1h) | `fastapi/dependencies/utils.py` | 🐛 Fix parsing extra non-body parameter list |
| 057 | `fastapi_5624` | `fastapi` | `2025-11-30` | **CAT-1** | `SUB-1C` | `RC-3C` | `FastAPI-6` | `PC-5` | `TIER-1` | `GRAPH-1` | `FM-6` | `+3/-1` (1f, 1h) | `fastapi/dependencies/utils.py` | 🐛 Fix hierarchical security scope propagation |
| 058 | `fastapi_14419` | `fastapi` | `2025-11-30` | **CAT-3** | `SUB-3A` | `RC-3C` | `FastAPI-1` | `PC-3` | `TIER-3` | `GRAPH-1` | `FM-6` | `+42/-20` (2f, 7h) | `fastapi/dependencies/models.py`, `fastapi/dependencies/utils.py` | 🐛 Cache dependencies that don't use scopes and don't have sub-dependencies with scopes |
| 059 | `fastapi_14301` | `fastapi` | `2025-11-08` | **CAT-1** | `SUB-1B` | `RC-3D` | `FastAPI-1` | `PC-3` | `TIER-1` | `GRAPH-1` | `FM-6` | `+4/-1` (1f, 1h) | `fastapi/dependencies/utils.py` | 🐛 Fix `Depends(func, scope='function')` for top level (parameterless) dependencies |
| 060 | `fastapi_14262` | `fastapi` | `2025-11-03` | **CAT-2** | `SUB-2A` | `RC-7A` | `FastAPI-1` | `PC-4` | `TIER-5` | `GRAPH-1` | `FM-7` | `+196/-70` (10f, 29h) | `docs_src/dependencies/tutorial008e.py`, `docs_src/dependencies/tutorial008e_an.py`, `docs_src/dependencies/tutorial008e_an_py39.py` (+7 more) | ✨ Add support for dependencies with scopes, support `scope="request"` for dependencies wit |
| 061 | `fastapi_14266` | `fastapi` | `2025-10-31` | **CAT-1** | `SUB-1C` | `RC-4A` | `FastAPI-6` | `PC-3` | `TIER-2` | `GRAPH-1` | `FM-6` | `+8/-10` (1f, 2h) | `fastapi/dependencies/utils.py` | 🐛 Fix security schemes in OpenAPI when added at the top level app |
| 062 | `fastapi_14246` | `fastapi` | `2025-10-29` | **CAT-1** | `SUB-1C` | `RC-4A` | `FastAPI-3` | `PC-3` | `TIER-2` | `GRAPH-1` | `FM-6` | `+24/-4` (1f, 1h) | `fastapi/_compat/v2.py` | 🐛 Fix separation of schemas with nested models introduced in 0.119.0 |
| 063 | `fastapi_14186` | `fastapi` | `2025-10-20` | **CAT-4** | `SUB-4A` | `RC-6B` | `FastAPI-3` | `PC-3` | `TIER-5` | `GRAPH-1` | `FM-8` | `+266/-98` (10f, 51h) | `fastapi/_compat/__init__.py`, `fastapi/_compat/main.py`, `fastapi/_compat/may_v1.py` (+7 more) | 🐛 Fix internal Pydantic v1 compatibility (warnings) for Python 3.14 and Pydantic 2.12.1 |
| 064 | `fastapi_9425` | `fastapi` | `2025-09-20` | **CAT-2** | `SUB-2B` | `RC-1C` | `FastAPI-1` | `PC-3` | `TIER-1` | `GRAPH-1` | `FM-1` | `+2/-0` (1f, 1h) | `fastapi/dependencies/utils.py` | ✨  Allow `None` as return type for bodiless responses |
| 065 | `fastapi_13713` | `fastapi` | `2025-09-20` | **CAT-2** | `SUB-2A` | `RC-3D` | `FastAPI-4` | `PC-3` | `TIER-3` | `GRAPH-1` | `FM-7` | `+31/-0` (2f, 5h) | `fastapi/applications.py`, `fastapi/openapi/utils.py` | ✨ Add OpenAPI `external_docs` parameter to `FastAPI` |
| 066 | `fastapi_14077` | `fastapi` | `2025-09-16` | **CAT-4** | `SUB-4B` | `RC-6B` | `FastAPI-4` | `PC-3` | `TIER-4` | `GRAPH-1` | `FM-8` | `+5/-6` (3f, 6h) | `docs_src/handling_errors/tutorial005.py`, `fastapi/exception_handlers.py`, `fastapi/openapi/utils.py` | ⬆️ Upgrade Starlette supported version range to >=0.40.0,<0.49.0 |
| 067 | `rich_3718` | `rich` | `2025-06-24` | **CAT-1** | `SUB-1E` | `RC-5B` | `Rich-4` | `PC-3` | `TIER-2` | `GRAPH-1` | `FM-5` | `+3/-4` (1f, 3h) | `rich/panel.py` | fix(panel): fix title missing panel background |
| 068 | `rich_3934` | `rich` | `2026-01-22` | **CAT-1** | `SUB-1E` | `RC-5D` | `Rich-6` | `PC-5` | `TIER-3` | `GRAPH-1` | `FM-5` | `+17/-3` (2f, 3h) | `rich/live.py`, `rich/live_render.py` | empty live |
| 069 | `rich_3953` | `rich` | `2026-02-01` | **CAT-1** | `SUB-1D` | `RC-5A` | `Rich-2` | `PC-5` | `TIER-2` | `GRAPH-1` | `FM-4` | `+16/-10` (1f, 2h) | `rich/cells.py` | Fix ZWJ and edge cases |
| 070 | `rich_3944` | `rich` | `2026-01-24` | **CAT-1** | `SUB-1D` | `RC-5A` | `Rich-2` | `PC-5` | `TIER-1` | `GRAPH-1` | `FM-5` | `+1/-1` (1f, 1h) | `rich/cells.py` | fix fonts |
| 071 | `rich_3942` | `rich` | `2026-01-24` | **CAT-3** | `SUB-3C` | `RC-5B` | `Rich-4` | `PC-5` | `TIER-3` | `GRAPH-1` | `FM-5` | `+43/-27` (2f, 7h) | `rich/default_styles.py`, `rich/markdown.py` | Update to markdown styles |
| 072 | `rich_3938` | `rich` | `2026-01-23` | **CAT-1** | `SUB-1E` | `RC-5B` | `Rich-2` | `PC-5` | `TIER-3` | `GRAPH-1` | `FM-5` | `+40/-5` (2f, 2h) | `rich/console.py`, `rich/segment.py` | fix background style with soft wrap |
| 073 | `rich_3882` | `rich` | `2026-01-23` | **CAT-1** | `SUB-1E` | `RC-3D` | `Rich-6` | `PC-3` | `TIER-1` | `GRAPH-1` | `FM-5` | `+1/-1` (1f, 1h) | `rich/prompt.py` | Fix raw markup printed on prompt errors sometimes |
| 074 | `rich_3894` | `rich` | `2026-01-23` | **CAT-1** | `SUB-1A` | `RC-1B` | `Rich-5` | `PC-2` | `TIER-1` | `GRAPH-1` | `FM-1` | `+4/-0` (1f, 1h) | `rich/_inspect.py` | Handle unusual __qualname__ in inspect |
| 075 | `rich_3935` | `rich` | `2026-01-23` | **CAT-1** | `SUB-1E` | `RC-5D` | `Rich-4` | `PC-5` | `TIER-3` | `GRAPH-1` | `FM-5` | `+13/-3` (1f, 5h) | `rich/table.py` | fix for padding width |
| 076 | `rich_3905` | `rich` | `2026-01-23` | **CAT-1** | `SUB-1E` | `RC-5D` | `Rich-6` | `PC-3` | `TIER-2` | `GRAPH-1` | `FM-5` | `+4/-3` (1f, 1h) | `rich/progress.py` | Update progress.py |
| 077 | `rich_3930` | `rich` | `2026-01-22` | **CAT-2** | `SUB-2C` | `RC-7A` | `Rich-2` | `PC-3` | `TIER-5` | `GRAPH-1` | `FM-5` | `+12170/-544` (26f, 29h) | `rich/__main__.py`, `rich/_cell_widths.py`, `rich/_unicode_data/__init__.py` (+23 more) | Handle graphemes |
| 078 | `httpx_3672` | `httpx` | `2025-09-19` | **CAT-2** | `SUB-2A` | `RC-8B` | `HTTPX-1` | `PC-1` | `TIER-5` | `GRAPH-1` | `FM-7` | `+57/-22` (7f, 18h) | `src/ahttpx/_parsers.py`, `src/ahttpx/_pool.py`, `src/ahttpx/_server.py` (+4 more) | Server connection handling. |
| 079 | `fastapi_14791` | `fastapi` | `2026-02-04` | **CAT-1** | `SUB-1C` | `RC-4A` | `FastAPI-4` | `PC-1` | `TIER-1` | `GRAPH-2` | `FM-6` | `+2/-0` (1f, 1h) | `fastapi/openapi/utils.py` | 🐛 Update `ValidationError` schema to include `input` and `ctx` |
| 080 | `fastapi_15800` | `fastapi` | `2026-06-20` | **CAT-2** | `SUB-2A` | `RC-7A` | `FastAPI-5` | `PC-3` | `TIER-5` | `GRAPH-1` | `FM-7` | `+649/-5` (8f, 20h) | `docs_src/frontend/tutorial001_py310.py`, `docs_src/frontend/tutorial002_py310.py`, `docs_src/frontend/tutorial003_py310.py` (+5 more) | ✨ Add support for `app.frontend("/", directory="dist")` and `router.frontend("/", director |
| 081 | `fastapi_15785` | `fastapi` | `2026-06-18` | **CAT-2** | `SUB-2A` | `RC-7C` | `FastAPI-2` | `PC-3` | `TIER-3` | `GRAPH-1` | `FM-7` | `+66/-15` (2f, 6h) | `fastapi/openapi/utils.py`, `fastapi/routing.py` | ✨ Add `iter_route_contexts()` for advanced use cases that used to use `router.routes` (e.g |
| 082 | `fastapi_14371` | `fastapi` | `2025-12-12` | **CAT-1** | `SUB-1B` | `RC-3A` | `FastAPI-1` | `PC-3` | `TIER-4` | `GRAPH-1` | `FM-3` | `+46/-16` (4f, 12h) | `fastapi/_compat/v2.py`, `fastapi/dependencies/utils.py`, `fastapi/openapi/utils.py` (+1 more) | 🐛 Fix parameter aliases |
| 083 | `fastapi_14605` | `fastapi` | `2025-12-26` | **CAT-4** | `SUB-4A` | `RC-6A` | `FastAPI-3` | `PC-3` | `TIER-5` | `GRAPH-1` | `FM-8` | `+28/-16` (7f, 20h) | `fastapi/dependencies/utils.py`, `fastapi/exceptions.py`, `fastapi/openapi/utils.py` (+4 more) | 🔊 Add a custom `FastAPIDeprecationWarning` |
| 084 | `fastapi_15763` | `fastapi` | `2026-06-15` | **CAT-1** | `SUB-1F` | `RC-4B` | `FastAPI-2` | `PC-3` | `TIER-2` | `GRAPH-1` | `FM-2` | `+10/-3` (1f, 1h) | `fastapi/routing.py` | 🐛 Fix bug, allow empty path in path operation in prefixless router |
| 085 | `fastapi_14583` | `fastapi` | `2025-12-21` | **CAT-4** | `SUB-4A` | `RC-6A` | `FastAPI-3` | `PC-5` | `TIER-3` | `GRAPH-1` | `FM-8` | `+24/-0` (2f, 6h) | `fastapi/dependencies/utils.py`, `fastapi/routing.py` | 🔊 Add deprecation warnings when using `pydantic.v1` |
| 086 | `fastapi_15745` | `fastapi` | `2026-06-14` | **CAT-3** | `SUB-3A` | `RC-3C` | `FastAPI-2` | `PC-3` | `TIER-5` | `GRAPH-1` | `FM-6` | `+939/-291` (4f, 21h) | `docs_src/path_operation_advanced_configuration/tutorial002_py310.py`, `fastapi/applications.py`, `fastapi/openapi/utils.py` (+1 more) | ♻️ Refactor internals to preserve `APIRouter` and `APIRoute` instances |
| 087 | `fastapi_14297` | `fastapi` | `2025-12-02` | **CAT-1** | `SUB-1A` | `RC-1A` | `FastAPI-3` | `PC-1` | `TIER-2` | `GRAPH-1` | `FM-1` | `+7/-0` (1f, 1h) | `fastapi/_compat/v2.py` | 🐛 Fix optional sequence handling in `serialize sequence value` with Pydantic V2 |
| 088 | `fastapi_14303` | `fastapi` | `2025-12-02` | **CAT-1** | `SUB-1B` | `RC-3B` | `FastAPI-1` | `PC-1` | `TIER-2` | `GRAPH-1` | `FM-6` | `+6/-2` (1f, 1h) | `fastapi/dependencies/utils.py` | 🐛 Fix parsing extra `Form` parameter list |
| 089 | `fastapi_13537` | `fastapi` | `2025-12-02` | **CAT-1** | `SUB-1B` | `RC-3A` | `FastAPI-1` | `PC-3` | `TIER-1` | `GRAPH-1` | `FM-3` | `+2/-1` (1f, 1h) | `fastapi/dependencies/utils.py` | 🐛 Fix support for form values with empty strings interpreted as missing (`None` if that's |
| 090 | `fastapi_14953` | `fastapi` | `2026-02-21` | **CAT-3** | `SUB-3C` | `RC-4A` | `FastAPI-3` | `PC-4` | `TIER-4` | `GRAPH-1` | `FM-6` | `+102/-2` (4f, 5h) | `docs_src/json_base64_bytes/tutorial001_py310.py`, `fastapi/_compat/v2.py`, `fastapi/datastructures.py` (+1 more) | ♻️ Fix JSON Schema for bytes, use `"contentMediaType": "application/octet-stream"` instead |
| 091 | `fastapi_13786` | `fastapi` | `2025-11-24` | **CAT-3** | `SUB-3C` | `RC-4B` | `FastAPI-6` | `PC-3` | `TIER-5` | `GRAPH-1` | `FM-3` | `+176/-83` (11f, 25h) | `docs_src/authentication_error_status_code/tutorial001_an.py`, `docs_src/authentication_error_status_code/tutorial001_an_py39.py`, `docs_src/security/tutorial003.py` (+8 more) | 🐛 Use `401` status code in security classes when credentials are missing |
| 092 | `fastapi_14616` | `fastapi` | `2026-02-05` | **CAT-1** | `SUB-1B` | `RC-3B` | `FastAPI-1` | `PC-1` | `TIER-2` | `GRAPH-1` | `FM-3` | `+10/-2` (1f, 2h) | `fastapi/dependencies/utils.py` | 🐛 Fix using `Json[list[str]]` type (issue #10997) |
| 093 | `fastapi_11194` | `fastapi` | `2025-09-20` | **CAT-1** | `SUB-1B` | `RC-3B` | `FastAPI-1` | `PC-3` | `TIER-2` | `GRAPH-1` | `FM-3` | `+3/-4` (1f, 1h) | `fastapi/dependencies/utils.py` | 🐛 Fix validation error when `File` is declared after `Form` parameter |
| 094 | `requests_6757` | `requests` | `2024-07-30` | **CAT-4** | `SUB-4B` | `RC-6B` | `Requests-4` | `PC-3` | `TIER-3` | `GRAPH-1` | `FM-6` | `+16/-1` (2f, 3h) | `src/requests/compat.py`, `src/requests/utils.py` | Test on urllib3 1.26.x |
| 095 | `requests_6629` | `requests` | `2024-02-22` | **CAT-1** | `SUB-1F` | `RC-1B` | `Requests-4` | `PC-3` | `TIER-2` | `GRAPH-1` | `FM-1` | `+10/-0` (1f, 1h) | `src/requests/exceptions.py` | Fix #6628 - JSONDecodeError are not deserializable |
| 096 | `requests_6644` | `requests` | `2024-02-23` | **CAT-1** | `SUB-1F` | `RC-4B` | `Requests-3` | `PC-3` | `TIER-1` | `GRAPH-1` | `FM-6` | `+3/-0` (1f, 1h) | `src/requests/adapters.py` | Trim excess leading path separators |
| 097 | `requests_6589` | `requests` | `2024-02-23` | **CAT-1** | `SUB-1F` | `RC-4B` | `Requests-2` | `PC-3` | `TIER-1` | `GRAPH-1` | `FM-6` | `+3/-0` (1f, 1h) | `src/requests/utils.py` | Enhance `super_len` to count encoded bytes for str |
| 098 | `requests_6592` | `requests` | `2023-12-16` | **CAT-2** | `SUB-2B` | `RC-4B` | `Requests-4` | `PC-3` | `TIER-1` | `GRAPH-2` | `FM-7` | `+1/-1` (1f, 1h) | `src/requests/status_codes.py` | "TOO_EARLY" type definition for status code 425 |
| 099 | `rich_3180` | `rich` | `2023-11-14` | **CAT-1** | `SUB-1D` | `RC-5A` | `Rich-2` | `PC-3` | `TIER-4` | `GRAPH-1` | `FM-5` | `+89/-38` (2f, 4h) | `rich/_wrap.py`, `rich/cells.py` | Fix double-width characters disappearing when wrapping |
| 100 | `rich_3486` | `rich` | `2024-09-11` | **CAT-2** | `SUB-2C` | `RC-7C` | `Rich-5` | `PC-5` | `TIER-4` | `GRAPH-1` | `FM-7` | `+74/-24` (3f, 12h) | `rich/default_styles.py`, `rich/syntax.py`, `rich/traceback.py` | report fine grained error locations |
| 101 | `rich_3777` | `rich` | `2025-06-23` | **CAT-2** | `SUB-2C` | `RC-7C` | `Rich-1` | `PC-3` | `TIER-3` | `GRAPH-1` | `FM-7` | `+12/-1` (2f, 3h) | `rich/console.py`, `rich/diagnose.py` | TTY_INTERACTIVE env var |
| 102 | `rich_3468` | `rich` | `2024-08-26` | **CAT-1** | `SUB-1E` | `RC-8B` | `Rich-1` | `PC-5` | `TIER-3` | `GRAPH-1` | `FM-1` | `+36/-6` (1f, 4h) | `rich/console.py` | handle broken pipe |
| 103 | `rich_3782` | `rich` | `2025-06-23` | **CAT-1** | `SUB-1E` | `RC-5D` | `Rich-5` | `PC-5` | `TIER-3` | `GRAPH-1` | `FM-1` | `+24/-5` (1f, 7h) | `rich/syntax.py` | Syntax padding |
| 104 | `rich_3772` | `rich` | `2025-06-19` | **CAT-1** | `SUB-1E` | `RC-2C` | `Rich-5` | `PC-5` | `TIER-3` | `GRAPH-1` | `FM-4` | `+29/-16` (1f, 6h) | `rich/traceback.py` | Fix traceback recursion |
| 105 | `rich_3296` | `rich` | `2024-07-01` | **CAT-1** | `SUB-1E` | `RC-5B` | `Rich-5` | `PC-3` | `TIER-1` | `GRAPH-1` | `FM-5` | `+1/-3` (1f, 1h) | `rich/syntax.py` | fix(syntax): include padding with background color override |
| 106 | `rich_3675` | `rich` | `2025-03-28` | **CAT-2** | `SUB-2C` | `RC-7C` | `Rich-1` | `PC-3` | `TIER-3` | `GRAPH-1` | `FM-7` | `+28/-13` (2f, 5h) | `rich/console.py`, `rich/diagnose.py` | TTY_COMPATIBLE |
| 107 | `rich_3676` | `rich` | `2025-03-28` | **CAT-2** | `SUB-2C` | `RC-7C` | `Rich-5` | `PC-5` | `TIER-3` | `GRAPH-1` | `FM-7` | `+12/-1` (2f, 8h) | `rich/default_styles.py`, `rich/traceback.py` | Notes |
| 108 | `rich_3518` | `rich` | `2024-10-04` | **CAT-1** | `SUB-1E` | `RC-3D` | `Rich-4` | `PC-3` | `TIER-1` | `GRAPH-1` | `FM-5` | `+1/-1` (1f, 1h) | `rich/table.py` | fix(table): highlight columns added by add_row |
| 109 | `rich_3535` | `rich` | `2024-10-22` | **CAT-1** | `SUB-1D` | `RC-5A` | `Rich-2` | `PC-3` | `TIER-3` | `GRAPH-1` | `FM-5` | `+7/-1` (2f, 2h) | `rich/cells.py`, `rich/segment.py` | Regex error |
| 110 | `rich_3521` | `rich` | `2024-10-04` | **CAT-1** | `SUB-1D` | `RC-5A` | `Rich-2` | `PC-5` | `TIER-2` | `GRAPH-1` | `FM-5` | `+16/-19` (1f, 1h) | `rich/segment.py` | Segment.split_cells fix |
| 111 | `rich_3506` | `rich` | `2024-09-28` | **CAT-1** | `SUB-1D` | `RC-5A` | `Rich-2` | `PC-3` | `TIER-2` | `GRAPH-1` | `FM-5` | `+15/-2` (1f, 1h) | `rich/segment.py` | fix split cells |
| 112 | `rich_3480` | `rich` | `2024-09-06` | **CAT-1** | `SUB-1D` | `RC-3C` | `Rich-3` | `PC-5` | `TIER-2` | `GRAPH-1` | `FM-4` | `+2/-2` (1f, 2h) | `rich/text.py` | fix infinite loop in append |
| 113 | `rich_3472` | `rich` | `2024-08-26` | **CAT-1** | `SUB-1A` | `RC-1B` | `Rich-5` | `PC-5` | `TIER-1` | `GRAPH-1` | `FM-1` | `+3/-1` (1f, 1h) | `rich/pretty.py` | fix for missing field in dataclass |
| 114 | `rich_3454` | `rich` | `2024-08-26` | **CAT-1** | `SUB-1E` | `RC-5C` | `Rich-3` | `PC-3` | `TIER-1` | `GRAPH-1` | `FM-5` | `+1/-1` (1f, 1h) | `rich/highlighter.py` | Fix [BUG] @ breaks highlighting in hyperlink #3327 |
| 115 | `rich_3471` | `rich` | `2024-08-26` | **CAT-1** | `SUB-1E` | `RC-2B` | `Rich-3` | `PC-5` | `TIER-1` | `GRAPH-1` | `FM-5` | `+1/-0` (1f, 1h) | `rich/text.py` | Fixed exception in append_tokens |
| 116 | `rich_3470` | `rich` | `2024-08-26` | **CAT-1** | `SUB-1E` | `RC-3C` | `Rich-1` | `PC-5` | `TIER-1` | `GRAPH-1` | `FM-6` | `+1/-1` (1f, 1h) | `rich/console.py` | Fix record and capture |
| 117 | `rich_3469` | `rich` | `2024-08-26` | **CAT-1** | `SUB-1E` | `RC-5C` | `Rich-4` | `PC-5` | `TIER-1` | `GRAPH-1` | `FM-5` | `+1/-1` (1f, 1h) | `rich/markdown.py` | fix superfluous space |
| 118 | `rich_3052` | `rich` | `2024-07-01` | **CAT-2** | `SUB-2C` | `RC-7C` | `Rich-6` | `PC-2` | `TIER-3` | `GRAPH-1` | `FM-7` | `+29/-5` (1f, 12h) | `rich/prompt.py` | Case insensitive prompt choices |
| 119 | `rich_3278` | `rich` | `2024-07-01` | **CAT-1** | `SUB-1E` | `RC-2B` | `Rich-3` | `PC-3` | `TIER-1` | `GRAPH-2` | `FM-5` | `+1/-0` (1f, 1h) | `rich/ansi.py` | Strip problematic private escape sequences |
| 120 | `rich_2943` | `rich` | `2024-07-01` | **CAT-1** | `SUB-1E` | `RC-3C` | `Rich-3` | `PC-3` | `TIER-1` | `GRAPH-1` | `FM-6` | `+1/-1` (1f, 1h) | `rich/style.py` | Clear hashed cache when clearing meta. |
| 121 | `rich_2725` | `rich` | `2024-07-01` | **CAT-1** | `SUB-1E` | `RC-5D` | `Rich-4` | `PC-2` | `TIER-2` | `GRAPH-1` | `FM-5` | `+5/-5` (1f, 1h) | `rich/table.py` | fix table rendering order of box elements |
| 122 | `rich_3105` | `rich` | `2023-11-07` | **CAT-1** | `SUB-1E` | `RC-5B` | `Rich-1` | `PC-3` | `TIER-1` | `GRAPH-3` | `FM-5` | `+1/-1` (1f, 1h) | `rich/_export_format.py` | Fix #3104 |
| 123 | `rich_3130` | `rich` | `2023-09-17` | **CAT-1** | `SUB-1E` | `RC-5B` | `Rich-4` | `PC-3` | `TIER-2` | `GRAPH-1` | `FM-5` | `+5/-7` (1f, 2h) | `rich/markdown.py` | Fix markdown table rendering issue with inline styles/links |
| 124 | `rich_3043` | `rich` | `2023-07-29` | **CAT-1** | `SUB-1E` | `RC-5B` | `Rich-1` | `PC-3` | `TIER-2` | `GRAPH-3` | `FM-5` | `+1/-1` (1f, 2h) | `rich/_export_format.py` | Fix the HTML export template |
| 125 | `rich_3067` | `rich` | `2023-07-31` | **CAT-1** | `SUB-1E` | `RC-5C` | `Rich-3` | `PC-3` | `TIER-1` | `GRAPH-1` | `FM-5` | `+1/-1` (1f, 1h) | `rich/highlighter.py` | Allow tilde in URL (fixes #3057) |
| 126 | `rich_3006` | `rich` | `2023-07-29` | **CAT-1** | `SUB-1A` | `RC-1B` | `Rich-5` | `PC-3` | `TIER-1` | `GRAPH-1` | `FM-1` | `+1/-1` (1f, 1h) | `rich/repr.py` | Fixed issue with custom classes (fixes #2875) |
| 127 | `rich_3064` | `rich` | `2023-07-29` | **CAT-1** | `SUB-1E` | `RC-5D` | `Rich-4` | `PC-5` | `TIER-2` | `GRAPH-1` | `FM-4` | `+8/-9` (1f, 1h) | `rich/markdown.py` | fix for markdown table |
| 128 | `rich_3063` | `rich` | `2023-07-29` | **CAT-1** | `SUB-1E` | `RC-2B` | `Rich-3` | `PC-5` | `TIER-2` | `GRAPH-1` | `FM-5` | `+3/-1` (1f, 2h) | `rich/markup.py` | Fix escaping trailing backslash |
| 129 | `rich_3061` | `rich` | `2023-07-29` | **CAT-2** | `SUB-2C` | `RC-5B` | `Rich-3` | `PC-3` | `TIER-3` | `GRAPH-1` | `FM-5` | `+67/-24` (1f, 13h) | `rich/text.py` | Extend tabs with styles |

---

## 3. Complete Catalog Grouped by Primary Category (`CAT-1` through `CAT-6`)

### CAT-1: Functional Bug Fix & Edge-Case Resolution (79 Tasks)

| # | `instance_id` | Sub-Category (`Axis 1B`) | Root-Cause Sub-Category (`Axis 2B`) | Subsystem (`Axis 3`) | Prompt (`Ax4`) | Diff Stats | Test Files (`+Lines`) | Problem Statement Title |
| ---: | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 003 | `fastapi_15589` | SUB-1B: Parameter Extraction, Aliasing & Form/Header/Query Coercion Bug | RC-3A: Alias vs Field Name Key Lookup / Set Tracking Defect | FastAPI-1 | `PC-3` | 1f, 1h (`+4/-0`) | 1f (`+35`) | ♻️ Do not accept underscore headers when using `convert_underscores=True` (the defaul |
| 012 | `requests_7502` | SUB-1A: Type Annotation, Union & Signature Introspection Bug | RC-1B: Callable / Decorator / Partial / Class Unwrapping & Protocol Check | Requests-1 | `PC-5` | 1f, 1h (`+3/-1`) | 1f (`+11`) | Fix `_encode_files` detection for `__getattr__`-based file wrappers |
| 013 | `requests_7433` | SUB-1A: Type Annotation, Union & Signature Introspection Bug | RC-1B: Callable / Decorator / Partial / Class Unwrapping & Protocol Check | Requests-1 | `PC-1` | 1f, 1h (`+3/-3`) | 1f (`+15`) | Fix `prepare_body` stream detection for `__getattr__`-based file wrappers |
| 014 | `requests_7427` | SUB-1F: HTTP Protocol, URL/Header/Netrc Parsing & Lifecycle Bug | RC-4B: HTTP / URL / Header / Status / Auth RFC Compliance | Requests-2 | `PC-3` | 1f, 1h (`+4/-2`) | 1f (`+23`) | Port bpo-39057 to Requests |
| 015 | `requests_7315` | SUB-1F: HTTP Protocol, URL/Header/Netrc Parsing & Lifecycle Bug | RC-4B: HTTP / URL / Header / Status / Auth RFC Compliance | Requests-3 | `PC-1` | 1f, 1h (`+0/-2`) | 1f (`+2`) | Preserve leading slashes in request path_url |
| 016 | `requests_7328` | SUB-1F: HTTP Protocol, URL/Header/Netrc Parsing & Lifecycle Bug | RC-3C: Mutable State Sharing, Shallow Copy & Cache Pollution | Requests-3 | `PC-3` | 1f, 1h (`+1/-2`) | 1f (`+8`) | Prevent Response self-reference in redirect history |
| 017 | `requests_7309` | SUB-1F: HTTP Protocol, URL/Header/Netrc Parsing & Lifecycle Bug | RC-4B: HTTP / URL / Header / Status / Auth RFC Compliance | Requests-2 | `PC-3` | 1f, 1h (`+6/-9`) | 1f (`+4`) | Fix malformed value parsing for Content-Type |
| 018 | `requests_7205` | SUB-1F: HTTP Protocol, URL/Header/Netrc Parsing & Lifecycle Bug | RC-2A: Missing Protocol / Format Boundary Validation | Requests-2 | `PC-3` | 1f, 1h (`+1/-1`) | 1f (`+10`) | Fix empty netrc entry usage |
| 021 | `rich_4079` | SUB-1E: Terminal Component Rendering, Styling & Markup/ANSI Parsing Bug | RC-5B: Style / Span / Markup Inheritance & Override Defect | Rich-4 | `PC-5` | 1f, 1h (`+4/-3`) | 1f (`+16`) | Inline table code |
| 022 | `rich_4076` | SUB-1E: Terminal Component Rendering, Styling & Markup/ANSI Parsing Bug | RC-5C: ANSI / Markup / Regex Tokenization & Line-Break Defect | Rich-3 | `PC-5` | 1f, 1h (`+3/-3`) | 1f (`+23`) | preserve newlines |
| 023 | `rich_4075` | SUB-1E: Terminal Component Rendering, Styling & Markup/ANSI Parsing Bug | RC-5C: ANSI / Markup / Regex Tokenization & Line-Break Defect | Rich-1 | `PC-5` | 1f, 4h (`+12/-3`) | 1f (`+6`) | empty with end |
| 024 | `rich_4006` | SUB-1D: Terminal Cell Width, Unicode Grapheme & Segment Splitting Bug | RC-5A: Unicode Cell Width, Grapheme Cluster & Cut-Offset Math | Rich-2 | `PC-5` | 1f, 2h (`+33/-12`) | 1f (`+38`) | fix for infinite loop in split_graphemes |
| 027 | `fastapi_14873` | SUB-1F: HTTP Protocol, URL/Header/Netrc Parsing & Lifecycle Bug | RC-3C: Mutable State Sharing, Shallow Copy & Cache Pollution | FastAPI-2 | `PC-1` | 1f, 2h (`+11/-10`) | 1f (`+60`) | 🐛 Fix `on_startup` and `on_shutdown` parameters of `APIRouter` |
| 030 | `fastapi_14786` | SUB-1F: HTTP Protocol, URL/Header/Netrc Parsing & Lifecycle Bug | RC-2B: Escaping, Stripping & Control-Code Sanitization | FastAPI-6 | `PC-1` | 1f, 1h (`+1/-1`) | 2f (`+12`) | 🐛 Strip whitespaces from `Authorization` header credentials |
| 033 | `fastapi_14463` | SUB-1C: OpenAPI / JSON Schema Generation & Ref Resolution Bug | RC-3C: Mutable State Sharing, Shallow Copy & Cache Pollution | FastAPI-4 | `PC-1` | 1f, 2h (`+2/-1`) | 1f (`+123`) | 🐛 Fix OpenAPI duplication of `anyOf` refs for app-level responses with specified `con |
| 034 | `fastapi_12942` | SUB-1A: Type Annotation, Union & Signature Introspection Bug | RC-1A: Generic / Union / Annotated / TypeAliasType Unpacking | FastAPI-3 | `PC-1` | 1f, 1h (`+3/-0`) | 1f (`+188`) | 🐛 Fix tagged discriminated union not recognized as body field |
| 038 | `fastapi_14349` | SUB-1C: OpenAPI / JSON Schema Generation & Ref Resolution Bug | RC-4A: OpenAPI / JSON Schema Structure & $ref Remapping | FastAPI-3 | `PC-3` | 1f, 1h (`+6/-6`) | 1f (`+72`) | 🐛 Fix handling of JSON Schema attributes named "$ref" |
| 039 | `fastapi_14512` | SUB-1A: Type Annotation, Union & Signature Introspection Bug | RC-1A: Generic / Union / Annotated / TypeAliasType Unpacking | FastAPI-3 | `PC-3` | 1f, 3h (`+48/-4`) | 1f (`+207`) | 🐛 Fix support for tagged union with discriminator inside of `Annotated` with `Body()` |
| 041 | `fastapi_11355` | SUB-1A: Type Annotation, Union & Signature Introspection Bug | RC-1C: Stringified / Forward Reference & Signature Evaluation | FastAPI-1 | `PC-3` | 1f, 3h (`+9/-2`) | 1f (`+26`) | 🐛 Fix evaluating stringified annotations in Python 3.10 |
| 042 | `fastapi_14485` | SUB-1A: Type Annotation, Union & Signature Introspection Bug | RC-1C: Stringified / Forward Reference & Signature Evaluation | FastAPI-1 | `PC-3` | 1f, 2h (`+13/-6`) | 1f (`+80`) | 🐛 Fix support for `if TYPE_CHECKING`,  non-evaluated stringified annotations |
| 043 | `fastapi_14482` | SUB-1A: Type Annotation, Union & Signature Introspection Bug | RC-1A: Generic / Union / Annotated / TypeAliasType Unpacking | FastAPI-3 | `PC-3` | 1f, 5h (`+25/-7`) | 1f (`+141`) | 🐛 Fix handling arbitrary types when using `arbitrary_types_allowed=True` |
| 045 | `fastapi_14458` | SUB-1A: Type Annotation, Union & Signature Introspection Bug | RC-1B: Callable / Decorator / Partial / Class Unwrapping & Protocol Check | FastAPI-1 | `PC-3` | 1f, 4h (`+6/-1`) | 1f (`+32`) | 🐛 Fix using class (not instance) dependency that has `__call__` method |
| 046 | `fastapi_14459` | SUB-1C: OpenAPI / JSON Schema Generation & Ref Resolution Bug | RC-3C: Mutable State Sharing, Shallow Copy & Cache Pollution | FastAPI-6 | `PC-3` | 3f, 8h (`+49/-22`) | 2f (`+149`) | 🐛 Fix OAuth2 scopes in OpenAPI in extra corner cases, parent dependency with scopes, |
| 047 | `fastapi_14448` | SUB-1A: Type Annotation, Union & Signature Introspection Bug | RC-1B: Callable / Decorator / Partial / Class Unwrapping & Protocol Check | FastAPI-1 | `PC-3` | 2f, 3h (`+82/-24`) | 1f (`+376`) | 🐛 Fix support for functools wraps and partial combined, for async and regular functio |
| 048 | `fastapi_14455` | SUB-1C: OpenAPI / JSON Schema Generation & Ref Resolution Bug | RC-4A: OpenAPI / JSON Schema Structure & $ref Remapping | FastAPI-4 | `PC-3` | 1f, 2h (`+11/-2`) | 1f (`+131`) | 🐛 Fix OpenAPI security scheme OAuth2 scopes declaration, deduplicate security schemes |
| 050 | `fastapi_14430` | SUB-1A: Type Annotation, Union & Signature Introspection Bug | RC-1A: Generic / Union / Annotated / TypeAliasType Unpacking | FastAPI-3 | `PC-3` | 1f, 2h (`+2/-2`) | 1f (`+14`) | 🐛 Fix optional sequence handling with new union syntax from Python 3.10 |
| 053 | `fastapi_14361` | SUB-1C: OpenAPI / JSON Schema Generation & Ref Resolution Bug | RC-4A: OpenAPI / JSON Schema Structure & $ref Remapping | FastAPI-3 | `PC-5` | 1f, 1h (`+1/-1`) | 1f (`+92`) | 🐛 Avoid accessing non-existing "$ref" key for Pydantic v2 compat remapping |
| 054 | `fastapi_13207` | SUB-1C: OpenAPI / JSON Schema Generation & Ref Resolution Bug | RC-4A: OpenAPI / JSON Schema Structure & $ref Remapping | FastAPI-3 | `PC-3` | 1f, 2h (`+12/-2`) | 1f (`+5`) | 🐛 Fix OpenAPI schema support for computed fields when using `separate_input_output_sc |
| 055 | `fastapi_14360` | SUB-1B: Parameter Extraction, Aliasing & Form/Header/Query Coercion Bug | RC-3A: Alias vs Field Name Key Lookup / Set Tracking Defect | FastAPI-1 | `PC-3` | 1f, 1h (`+1/-2`) | 1f (`+76`) | 🐛 Fix Query\Header\Cookie parameter model alias |
| 056 | `fastapi_14356` | SUB-1B: Parameter Extraction, Aliasing & Form/Header/Query Coercion Bug | RC-3B: MultiDict / Sequence / Extra Parameter Aggregation Defect | FastAPI-1 | `PC-1` | 1f, 1h (`+9/-2`) | 2f (`+112`) | 🐛 Fix parsing extra non-body parameter list |
| 057 | `fastapi_5624` | SUB-1C: OpenAPI / JSON Schema Generation & Ref Resolution Bug | RC-3C: Mutable State Sharing, Shallow Copy & Cache Pollution | FastAPI-6 | `PC-5` | 1f, 1h (`+3/-1`) | 1f (`+45`) | 🐛 Fix hierarchical security scope propagation |
| 059 | `fastapi_14301` | SUB-1B: Parameter Extraction, Aliasing & Form/Header/Query Coercion Bug | RC-3D: Missing Parameter / Option Forwarding Across Call Chain | FastAPI-1 | `PC-3` | 1f, 1h (`+4/-1`) | 1f (`+63`) | 🐛 Fix `Depends(func, scope='function')` for top level (parameterless) dependencies |
| 061 | `fastapi_14266` | SUB-1C: OpenAPI / JSON Schema Generation & Ref Resolution Bug | RC-4A: OpenAPI / JSON Schema Structure & $ref Remapping | FastAPI-6 | `PC-3` | 1f, 2h (`+8/-10`) | 1f (`+60`) | 🐛 Fix security schemes in OpenAPI when added at the top level app |
| 062 | `fastapi_14246` | SUB-1C: OpenAPI / JSON Schema Generation & Ref Resolution Bug | RC-4A: OpenAPI / JSON Schema Structure & $ref Remapping | FastAPI-3 | `PC-3` | 1f, 1h (`+24/-4`) | 2f (`+205`) | 🐛 Fix separation of schemas with nested models introduced in 0.119.0 |
| 067 | `rich_3718` | SUB-1E: Terminal Component Rendering, Styling & Markup/ANSI Parsing Bug | RC-5B: Style / Span / Markup Inheritance & Override Defect | Rich-4 | `PC-3` | 1f, 3h (`+3/-4`) | 1f (`+48`) | fix(panel): fix title missing panel background |
| 068 | `rich_3934` | SUB-1E: Terminal Component Rendering, Styling & Markup/ANSI Parsing Bug | RC-5D: Interactive Display, Padding & Box Geometry Defect | Rich-6 | `PC-5` | 2f, 3h (`+17/-3`) | 1f (`+18`) | empty live |
| 069 | `rich_3953` | SUB-1D: Terminal Cell Width, Unicode Grapheme & Segment Splitting Bug | RC-5A: Unicode Cell Width, Grapheme Cluster & Cut-Offset Math | Rich-2 | `PC-5` | 1f, 2h (`+16/-10`) | 1f (`+17`) | Fix ZWJ and edge cases |
| 070 | `rich_3944` | SUB-1D: Terminal Cell Width, Unicode Grapheme & Segment Splitting Bug | RC-5A: Unicode Cell Width, Grapheme Cluster & Cut-Offset Math | Rich-2 | `PC-5` | 1f, 1h (`+1/-1`) | 1f (`+6`) | fix fonts |
| 072 | `rich_3938` | SUB-1E: Terminal Component Rendering, Styling & Markup/ANSI Parsing Bug | RC-5B: Style / Span / Markup Inheritance & Override Defect | Rich-2 | `PC-5` | 2f, 2h (`+40/-5`) | 2f (`+32`) | fix background style with soft wrap |
| 073 | `rich_3882` | SUB-1E: Terminal Component Rendering, Styling & Markup/ANSI Parsing Bug | RC-3D: Missing Parameter / Option Forwarding Across Call Chain | Rich-6 | `PC-3` | 1f, 1h (`+1/-1`) | 1f (`+13`) | Fix raw markup printed on prompt errors sometimes |
| 074 | `rich_3894` | SUB-1A: Type Annotation, Union & Signature Introspection Bug | RC-1B: Callable / Decorator / Partial / Class Unwrapping & Protocol Check | Rich-5 | `PC-2` | 1f, 1h (`+4/-0`) | 1f (`+13`) | Handle unusual __qualname__ in inspect |
| 075 | `rich_3935` | SUB-1E: Terminal Component Rendering, Styling & Markup/ANSI Parsing Bug | RC-5D: Interactive Display, Padding & Box Geometry Defect | Rich-4 | `PC-5` | 1f, 5h (`+13/-3`) | 2f (`+30`) | fix for padding width |
| 076 | `rich_3905` | SUB-1E: Terminal Component Rendering, Styling & Markup/ANSI Parsing Bug | RC-5D: Interactive Display, Padding & Box Geometry Defect | Rich-6 | `PC-3` | 1f, 1h (`+4/-3`) | 1f (`+24`) | Update progress.py |
| 079 | `fastapi_14791` | SUB-1C: OpenAPI / JSON Schema Generation & Ref Resolution Bug | RC-4A: OpenAPI / JSON Schema Structure & $ref Remapping | FastAPI-4 | `PC-1` | 1f, 1h (`+2/-0`) | 29f (`+72`) | 🐛 Update `ValidationError` schema to include `input` and `ctx` |
| 082 | `fastapi_14371` | SUB-1B: Parameter Extraction, Aliasing & Form/Header/Query Coercion Bug | RC-3A: Alias vs Field Name Key Lookup / Set Tracking Defect | FastAPI-1 | `PC-3` | 4f, 12h (`+46/-16`) | 23f (`+309`) | 🐛 Fix parameter aliases |
| 084 | `fastapi_15763` | SUB-1F: HTTP Protocol, URL/Header/Netrc Parsing & Lifecycle Bug | RC-4B: HTTP / URL / Header / Status / Auth RFC Compliance | FastAPI-2 | `PC-3` | 1f, 1h (`+10/-3`) | 1f (`+55`) | 🐛 Fix bug, allow empty path in path operation in prefixless router |
| 087 | `fastapi_14297` | SUB-1A: Type Annotation, Union & Signature Introspection Bug | RC-1A: Generic / Union / Annotated / TypeAliasType Unpacking | FastAPI-3 | `PC-1` | 1f, 1h (`+7/-0`) | 2f (`+54`) | 🐛 Fix optional sequence handling in `serialize sequence value` with Pydantic V2 |
| 088 | `fastapi_14303` | SUB-1B: Parameter Extraction, Aliasing & Form/Header/Query Coercion Bug | RC-3B: MultiDict / Sequence / Extra Parameter Aggregation Defect | FastAPI-1 | `PC-1` | 1f, 1h (`+6/-2`) | 1f (`+47`) | 🐛 Fix parsing extra `Form` parameter list |
| 089 | `fastapi_13537` | SUB-1B: Parameter Extraction, Aliasing & Form/Header/Query Coercion Bug | RC-3A: Alias vs Field Name Key Lookup / Set Tracking Defect | FastAPI-1 | `PC-3` | 1f, 1h (`+2/-1`) | 1f (`+35`) | 🐛 Fix support for form values with empty strings interpreted as missing (`None` if th |
| 092 | `fastapi_14616` | SUB-1B: Parameter Extraction, Aliasing & Form/Header/Query Coercion Bug | RC-3B: MultiDict / Sequence / Extra Parameter Aggregation Defect | FastAPI-1 | `PC-1` | 1f, 2h (`+10/-2`) | 1f (`+63`) | 🐛 Fix using `Json[list[str]]` type (issue #10997) |
| 093 | `fastapi_11194` | SUB-1B: Parameter Extraction, Aliasing & Form/Header/Query Coercion Bug | RC-3B: MultiDict / Sequence / Extra Parameter Aggregation Defect | FastAPI-1 | `PC-3` | 1f, 1h (`+3/-4`) | 1f (`+90`) | 🐛 Fix validation error when `File` is declared after `Form` parameter |
| 095 | `requests_6629` | SUB-1F: HTTP Protocol, URL/Header/Netrc Parsing & Lifecycle Bug | RC-1B: Callable / Decorator / Partial / Class Unwrapping & Protocol Check | Requests-4 | `PC-3` | 1f, 1h (`+10/-0`) | 1f (`+10`) | Fix #6628 - JSONDecodeError are not deserializable |
| 096 | `requests_6644` | SUB-1F: HTTP Protocol, URL/Header/Netrc Parsing & Lifecycle Bug | RC-4B: HTTP / URL / Header / Status / Auth RFC Compliance | Requests-3 | `PC-3` | 1f, 1h (`+3/-0`) | 1f (`+8`) | Trim excess leading path separators |
| 097 | `requests_6589` | SUB-1F: HTTP Protocol, URL/Header/Netrc Parsing & Lifecycle Bug | RC-4B: HTTP / URL / Header / Status / Auth RFC Compliance | Requests-2 | `PC-3` | 1f, 1h (`+3/-0`) | 1f (`+17`) | Enhance `super_len` to count encoded bytes for str |
| 099 | `rich_3180` | SUB-1D: Terminal Cell Width, Unicode Grapheme & Segment Splitting Bug | RC-5A: Unicode Cell Width, Grapheme Cluster & Cut-Offset Math | Rich-2 | `PC-3` | 2f, 4h (`+89/-38`) | 2f (`+85`) | Fix double-width characters disappearing when wrapping |
| 102 | `rich_3468` | SUB-1E: Terminal Component Rendering, Styling & Markup/ANSI Parsing Bug | RC-8B: Context Manager / Stream / Pipe Resource Cleanup | Rich-1 | `PC-5` | 1f, 4h (`+36/-6`) | 1f (`+21`) | handle broken pipe |
| 103 | `rich_3782` | SUB-1E: Terminal Component Rendering, Styling & Markup/ANSI Parsing Bug | RC-5D: Interactive Display, Padding & Box Geometry Defect | Rich-5 | `PC-5` | 1f, 7h (`+24/-5`) | 1f (`+41`) | Syntax padding |
| 104 | `rich_3772` | SUB-1E: Terminal Component Rendering, Styling & Markup/ANSI Parsing Bug | RC-2C: Self-Reference / Cycle Guard & Diagnostic Assertion | Rich-5 | `PC-5` | 1f, 6h (`+29/-16`) | 1f (`+24`) | Fix traceback recursion |
| 105 | `rich_3296` | SUB-1E: Terminal Component Rendering, Styling & Markup/ANSI Parsing Bug | RC-5B: Style / Span / Markup Inheritance & Override Defect | Rich-5 | `PC-3` | 1f, 1h (`+1/-3`) | 1f (`+17`) | fix(syntax): include padding with background color override |
| 108 | `rich_3518` | SUB-1E: Terminal Component Rendering, Styling & Markup/ANSI Parsing Bug | RC-3D: Missing Parameter / Option Forwarding Across Call Chain | Rich-4 | `PC-3` | 1f, 1h (`+1/-1`) | 1f (`+19`) | fix(table): highlight columns added by add_row |
| 109 | `rich_3535` | SUB-1D: Terminal Cell Width, Unicode Grapheme & Segment Splitting Bug | RC-5A: Unicode Cell Width, Grapheme Cluster & Cut-Offset Math | Rich-2 | `PC-3` | 2f, 2h (`+7/-1`) | 1f (`+21`) | Regex error |
| 110 | `rich_3521` | SUB-1D: Terminal Cell Width, Unicode Grapheme & Segment Splitting Bug | RC-5A: Unicode Cell Width, Grapheme Cluster & Cut-Offset Math | Rich-2 | `PC-5` | 1f, 1h (`+16/-19`) | 1f (`+21`) | Segment.split_cells fix |
| 111 | `rich_3506` | SUB-1D: Terminal Cell Width, Unicode Grapheme & Segment Splitting Bug | RC-5A: Unicode Cell Width, Grapheme Cluster & Cut-Offset Math | Rich-2 | `PC-3` | 1f, 1h (`+15/-2`) | 1f (`+29`) | fix split cells |
| 112 | `rich_3480` | SUB-1D: Terminal Cell Width, Unicode Grapheme & Segment Splitting Bug | RC-3C: Mutable State Sharing, Shallow Copy & Cache Pollution | Rich-3 | `PC-5` | 1f, 2h (`+2/-2`) | 1f (`+11`) | fix infinite loop in append |
| 113 | `rich_3472` | SUB-1A: Type Annotation, Union & Signature Introspection Bug | RC-1B: Callable / Decorator / Partial / Class Unwrapping & Protocol Check | Rich-5 | `PC-5` | 1f, 1h (`+3/-1`) | 1f (`+20`) | fix for missing field in dataclass |
| 114 | `rich_3454` | SUB-1E: Terminal Component Rendering, Styling & Markup/ANSI Parsing Bug | RC-5C: ANSI / Markup / Regex Tokenization & Line-Break Defect | Rich-3 | `PC-3` | 1f, 1h (`+1/-1`) | 1f (`+1`) | Fix [BUG] @ breaks highlighting in hyperlink #3327 |
| 115 | `rich_3471` | SUB-1E: Terminal Component Rendering, Styling & Markup/ANSI Parsing Bug | RC-2B: Escaping, Stripping & Control-Code Sanitization | Rich-3 | `PC-5` | 1f, 1h (`+1/-0`) | 1f (`+20`) | Fixed exception in append_tokens |
| 116 | `rich_3470` | SUB-1E: Terminal Component Rendering, Styling & Markup/ANSI Parsing Bug | RC-3C: Mutable State Sharing, Shallow Copy & Cache Pollution | Rich-1 | `PC-5` | 1f, 1h (`+1/-1`) | 1f (`+21`) | Fix record and capture |
| 117 | `rich_3469` | SUB-1E: Terminal Component Rendering, Styling & Markup/ANSI Parsing Bug | RC-5C: ANSI / Markup / Regex Tokenization & Line-Break Defect | Rich-4 | `PC-5` | 1f, 1h (`+1/-1`) | 1f (`+28`) | fix superfluous space |
| 119 | `rich_3278` | SUB-1E: Terminal Component Rendering, Styling & Markup/ANSI Parsing Bug | RC-2B: Escaping, Stripping & Control-Code Sanitization | Rich-3 | `PC-3` | 1f, 1h (`+1/-0`) | 1f (`+14`) | Strip problematic private escape sequences |
| 120 | `rich_2943` | SUB-1E: Terminal Component Rendering, Styling & Markup/ANSI Parsing Bug | RC-3C: Mutable State Sharing, Shallow Copy & Cache Pollution | Rich-3 | `PC-3` | 1f, 1h (`+1/-1`) | 1f (`+14`) | Clear hashed cache when clearing meta. |
| 121 | `rich_2725` | SUB-1E: Terminal Component Rendering, Styling & Markup/ANSI Parsing Bug | RC-5D: Interactive Display, Padding & Box Geometry Defect | Rich-4 | `PC-2` | 1f, 1h (`+5/-5`) | 1f (`+129`) | fix table rendering order of box elements |
| 122 | `rich_3105` | SUB-1E: Terminal Component Rendering, Styling & Markup/ANSI Parsing Bug | RC-5B: Style / Span / Markup Inheritance & Override Defect | Rich-1 | `PC-3` | 1f, 1h (`+1/-1`) | 1f (`+3`) | Fix #3104 |
| 123 | `rich_3130` | SUB-1E: Terminal Component Rendering, Styling & Markup/ANSI Parsing Bug | RC-5B: Style / Span / Markup Inheritance & Override Defect | Rich-4 | `PC-3` | 1f, 2h (`+5/-7`) | 1f (`+35`) | Fix markdown table rendering issue with inline styles/links |
| 124 | `rich_3043` | SUB-1E: Terminal Component Rendering, Styling & Markup/ANSI Parsing Bug | RC-5B: Style / Span / Markup Inheritance & Override Defect | Rich-1 | `PC-3` | 1f, 2h (`+1/-1`) | 1f (`+3`) | Fix the HTML export template |
| 125 | `rich_3067` | SUB-1E: Terminal Component Rendering, Styling & Markup/ANSI Parsing Bug | RC-5C: ANSI / Markup / Regex Tokenization & Line-Break Defect | Rich-3 | `PC-3` | 1f, 1h (`+1/-1`) | 1f (`+10`) | Allow tilde in URL (fixes #3057) |
| 126 | `rich_3006` | SUB-1A: Type Annotation, Union & Signature Introspection Bug | RC-1B: Callable / Decorator / Partial / Class Unwrapping & Protocol Check | Rich-5 | `PC-3` | 1f, 1h (`+1/-1`) | 1f (`+40`) | Fixed issue with custom classes (fixes #2875) |
| 127 | `rich_3064` | SUB-1E: Terminal Component Rendering, Styling & Markup/ANSI Parsing Bug | RC-5D: Interactive Display, Padding & Box Geometry Defect | Rich-4 | `PC-5` | 1f, 1h (`+8/-9`) | 1f (`+8`) | fix for markdown table |
| 128 | `rich_3063` | SUB-1E: Terminal Component Rendering, Styling & Markup/ANSI Parsing Bug | RC-2B: Escaping, Stripping & Control-Code Sanitization | Rich-3 | `PC-5` | 1f, 2h (`+3/-1`) | 1f (`+13`) | Fix escaping trailing backslash |

### CAT-2: New Feature & API Capability Addition (23 Tasks)

| # | `instance_id` | Sub-Category (`Axis 1B`) | Root-Cause Sub-Category (`Axis 2B`) | Subsystem (`Axis 3`) | Prompt (`Ax4`) | Diff Stats | Test Files (`+Lines`) | Problem Statement Title |
| ---: | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 004 | `fastapi_15030` | SUB-2A: Framework Core Feature & Endpoint/Router Capability | RC-7A: Multi-Module Core Subsystem & Tutorial Synthesis | FastAPI-5 | `PC-4` | 9f, 17h (`+525/-35`) | 6f (`+970`) | ✨ Add support for Server Sent Events |
| 006 | `fastapi_15280` | SUB-2A: Framework Core Feature & Endpoint/Router Capability | RC-7A: Multi-Module Core Subsystem & Tutorial Synthesis | FastAPI-2 | `PC-5` | 2f, 3h (`+71/-1`) | 1f (`+17`) | ✨ Add support for `@app.vibe()` |
| 010 | `fastapi_14978` | SUB-2A: Framework Core Feature & Endpoint/Router Capability | RC-2A: Missing Protocol / Format Boundary Validation | FastAPI-2 | `PC-4` | 3f, 14h (`+81/-1`) | 5f (`+241`) | 🔒️ Add `strict_content_type` checking for JSON requests |
| 020 | `rich_4077` | SUB-2C: Terminal & CLI Feature Enhancement | RC-7C: Extensibility API / Environment Hook Addition | Rich-1 | `PC-5` | 1f, 1h (`+3/-0`) | 1f (`+17`) | proxy isatty |
| 028 | `fastapi_13920` | SUB-2B: Type System, Dependency & Return-Type Feature Extension | RC-1A: Generic / Union / Annotated / TypeAliasType Unpacking | FastAPI-1 | `PC-3` | 1f, 2h (`+4/-0`) | 1f (`+27`) | ✨ Add support for PEP695 `TypeAliasType` |
| 029 | `fastapi_14794` | SUB-2B: Type System, Dependency & Return-Type Feature Extension | RC-1A: Generic / Union / Annotated / TypeAliasType Unpacking | FastAPI-1 | `PC-1` | 1f, 2h (`+3/-2`) | 1f (`+173`) | ✨ Allow `Response` type hint as dependency annotation |
| 049 | `fastapi_9753` | SUB-2B: Type System, Dependency & Return-Type Feature Extension | RC-1B: Callable / Decorator / Partial / Class Unwrapping & Protocol Check | FastAPI-1 | `PC-3` | 1f, 2h (`+5/-2`) | 1f (`+251`) | ✨ Allow using dependables with `functools.partial()` |
| 051 | `fastapi_5077` | SUB-2B: Type System, Dependency & Return-Type Feature Extension | RC-1C: Stringified / Forward Reference & Signature Evaluation | FastAPI-1 | `PC-2` | 1f, 2h (`+4/-2`) | 2f (`+40`) | ✨ Add support for wrapped functions (e.g. `@functools.wraps()`) used with forward ref |
| 052 | `fastapi_9555` | SUB-2B: Type System, Dependency & Return-Type Feature Extension | RC-1B: Callable / Decorator / Partial / Class Unwrapping & Protocol Check | FastAPI-1 | `PC-1` | 1f, 1h (`+14/-8`) | 1f (`+77`) | ✨ Handle wrapped dependencies |
| 060 | `fastapi_14262` | SUB-2A: Framework Core Feature & Endpoint/Router Capability | RC-7A: Multi-Module Core Subsystem & Tutorial Synthesis | FastAPI-1 | `PC-4` | 10f, 29h (`+196/-70`) | 3f (`+412`) | ✨ Add support for dependencies with scopes, support `scope="request"` for dependencie |
| 064 | `fastapi_9425` | SUB-2B: Type System, Dependency & Return-Type Feature Extension | RC-1C: Stringified / Forward Reference & Signature Evaluation | FastAPI-1 | `PC-3` | 1f, 1h (`+2/-0`) | 1f (`+17`) | ✨  Allow `None` as return type for bodiless responses |
| 065 | `fastapi_13713` | SUB-2A: Framework Core Feature & Endpoint/Router Capability | RC-3D: Missing Parameter / Option Forwarding Across Call Chain | FastAPI-4 | `PC-3` | 2f, 5h (`+31/-0`) | 2f (`+10`) | ✨ Add OpenAPI `external_docs` parameter to `FastAPI` |
| 077 | `rich_3930` | SUB-2C: Terminal & CLI Feature Enhancement | RC-7A: Multi-Module Core Subsystem & Tutorial Synthesis | Rich-2 | `PC-3` | 26f, 29h (`+12170/-544`) | 3f (`+189`) | Handle graphemes |
| 078 | `httpx_3672` | SUB-2A: Framework Core Feature & Endpoint/Router Capability | RC-8B: Context Manager / Stream / Pipe Resource Cleanup | HTTPX-1 | `PC-1` | 7f, 18h (`+57/-22`) | 1f (`+5`) | Server connection handling. |
| 080 | `fastapi_15800` | SUB-2A: Framework Core Feature & Endpoint/Router Capability | RC-7A: Multi-Module Core Subsystem & Tutorial Synthesis | FastAPI-5 | `PC-3` | 8f, 20h (`+649/-5`) | 1f (`+858`) | ✨ Add support for `app.frontend("/", directory="dist")` and `router.frontend("/", dir |
| 081 | `fastapi_15785` | SUB-2A: Framework Core Feature & Endpoint/Router Capability | RC-7C: Extensibility API / Environment Hook Addition | FastAPI-2 | `PC-3` | 2f, 6h (`+66/-15`) | 1f (`+104`) | ✨ Add `iter_route_contexts()` for advanced use cases that used to use `router.routes` |
| 098 | `requests_6592` | SUB-2B: Type System, Dependency & Return-Type Feature Extension | RC-4B: HTTP / URL / Header / Status / Auth RFC Compliance | Requests-4 | `PC-3` | 1f, 1h (`+1/-1`) | 1f (`+15`) | "TOO_EARLY" type definition for status code 425 |
| 100 | `rich_3486` | SUB-2C: Terminal & CLI Feature Enhancement | RC-7C: Extensibility API / Environment Hook Addition | Rich-5 | `PC-5` | 3f, 12h (`+74/-24`) | 1f (`+31`) | report fine grained error locations |
| 101 | `rich_3777` | SUB-2C: Terminal & CLI Feature Enhancement | RC-7C: Extensibility API / Environment Hook Addition | Rich-1 | `PC-3` | 2f, 3h (`+12/-1`) | 1f (`+25`) | TTY_INTERACTIVE env var |
| 106 | `rich_3675` | SUB-2C: Terminal & CLI Feature Enhancement | RC-7C: Extensibility API / Environment Hook Addition | Rich-1 | `PC-3` | 2f, 5h (`+28/-13`) | 1f (`+151`) | TTY_COMPATIBLE |
| 107 | `rich_3676` | SUB-2C: Terminal & CLI Feature Enhancement | RC-7C: Extensibility API / Environment Hook Addition | Rich-5 | `PC-5` | 2f, 8h (`+12/-1`) | 1f (`+15`) | Notes |
| 118 | `rich_3052` | SUB-2C: Terminal & CLI Feature Enhancement | RC-7C: Extensibility API / Environment Hook Addition | Rich-6 | `PC-2` | 1f, 12h (`+29/-5`) | 1f (`+19`) | Case insensitive prompt choices |
| 129 | `rich_3061` | SUB-2C: Terminal & CLI Feature Enhancement | RC-5B: Style / Span / Markup Inheritance & Override Defect | Rich-3 | `PC-3` | 1f, 13h (`+67/-24`) | 2f (`+112`) | Extend tabs with styles |

### CAT-3: Architectural Refactoring, Performance & Protocol Alignment (13 Tasks)

| # | `instance_id` | Sub-Category (`Axis 1B`) | Root-Cause Sub-Category (`Axis 2B`) | Subsystem (`Axis 3`) | Prompt (`Ax4`) | Diff Stats | Test Files (`+Lines`) | Problem Statement Title |
| ---: | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 002 | `fastapi_15588` | SUB-3C: Standards, Security & Internal API Hygiene Refactor | RC-2A: Missing Protocol / Format Boundary Validation | FastAPI-5 | `PC-3` | 1f, 2h (`+18/-5`) | 1f (`+9`) | ♻️ Validate Server Sent Event fields to avoid applications from sending broken data |
| 005 | `fastapi_14962` | SUB-3B: Performance Optimization & Fast-Path Execution | RC-8A: Serialization Fast-Path & Deferred Import Optimization | FastAPI-2 | `PC-4` | 3f, 6h (`+49/-6`) | 3f (`+101`) | ✨ Serialize JSON response with Pydantic (in Rust), when there's a Pydantic return typ |
| 009 | `fastapi_14986` | SUB-3C: Standards, Security & Internal API Hygiene Refactor | RC-2B: Escaping, Stripping & Control-Code Sanitization | FastAPI-4 | `PC-3` | 2f, 4h (`+25/-9`) | 2f (`+112`) | ♻️ Refactor logic to handle OpenAPI and Swagger UI escaping data |
| 011 | `requests_7505` | SUB-3C: Standards, Security & Internal API Hygiene Refactor | RC-1B: Callable / Decorator / Partial / Class Unwrapping & Protocol Check | Requests-1 | `PC-1` | 2f, 6h (`+9/-7`) | 1f (`+15`) | Add hasattr checks for remaining protocol isinstance checks |
| 019 | `rich_4070` | SUB-3B: Performance Optimization & Fast-Path Execution | RC-8A: Serialization Fast-Path & Deferred Import Optimization | Rich-1 | `PC-1` | 9f, 33h (`+71/-57`) | 2f (`+3`) | perf: reduce Console and RichHandler import time by deferring unused imports |
| 026 | `fastapi_14851` | SUB-3A: Core Routing, Lifespan & Streaming Lifecycle Refactor | RC-6B: Upstream Dependency API Migration (Pydantic v2 / Starlette / urllib3) | FastAPI-2 | `PC-3` | 1f, 5h (`+153/-4`) | 1f (`+76`) | ♻️ Re-implement `on_event` in FastAPI for compatibility with the next Starlette, whil |
| 035 | `fastapi_14099` | SUB-3A: Core Routing, Lifespan & Streaming Lifecycle Refactor | RC-8B: Context Manager / Stream / Pipe Resource Cleanup | FastAPI-2 | `PC-4` | 5f, 13h (`+346/-131`) | 6f (`+284`) | 🐛 Fix support for `StreamingResponse`s with dependencies with `yield` or `UploadFile` |
| 037 | `fastapi_14372` | SUB-3C: Standards, Security & Internal API Hygiene Refactor | RC-3C: Mutable State Sharing, Shallow Copy & Cache Pollution | FastAPI-1 | `PC-3` | 2f, 3h (`+4/-3`) | 1f (`+25`) | ♻️ Make the result of `Depends()` and `Security()` hashable, as a workaround for othe |
| 058 | `fastapi_14419` | SUB-3A: Core Routing, Lifespan & Streaming Lifecycle Refactor | RC-3C: Mutable State Sharing, Shallow Copy & Cache Pollution | FastAPI-1 | `PC-3` | 2f, 7h (`+42/-20`) | 2f (`+153`) | 🐛 Cache dependencies that don't use scopes and don't have sub-dependencies with scope |
| 071 | `rich_3942` | SUB-3C: Standards, Security & Internal API Hygiene Refactor | RC-5B: Style / Span / Markup Inheritance & Override Defect | Rich-4 | `PC-5` | 2f, 7h (`+43/-27`) | 3f (`+9`) | Update to markdown styles |
| 086 | `fastapi_15745` | SUB-3A: Core Routing, Lifespan & Streaming Lifecycle Refactor | RC-3C: Mutable State Sharing, Shallow Copy & Cache Pollution | FastAPI-2 | `PC-3` | 4f, 21h (`+939/-291`) | 2f (`+858`) | ♻️ Refactor internals to preserve `APIRouter` and `APIRoute` instances |
| 090 | `fastapi_14953` | SUB-3C: Standards, Security & Internal API Hygiene Refactor | RC-4A: OpenAPI / JSON Schema Structure & $ref Remapping | FastAPI-3 | `PC-4` | 4f, 5h (`+102/-2`) | 11f (`+303`) | ♻️ Fix JSON Schema for bytes, use `"contentMediaType": "application/octet-stream"` in |
| 091 | `fastapi_13786` | SUB-3C: Standards, Security & Internal API Hygiene Refactor | RC-4B: HTTP / URL / Header / Status / Auth RFC Compliance | FastAPI-6 | `PC-3` | 11f, 25h (`+176/-83`) | 17f (`+46`) | 🐛 Use `401` status code in security classes when credentials are missing |

### CAT-4: Ecosystem Compatibility, Deprecation & Legacy Removal (7 Tasks)

| # | `instance_id` | Sub-Category (`Axis 1B`) | Root-Cause Sub-Category (`Axis 2B`) | Subsystem (`Axis 3`) | Prompt (`Ax4`) | Diff Stats | Test Files (`+Lines`) | Problem Statement Title |
| ---: | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 007 | `fastapi_14964` | SUB-4B: Upstream Library Compatibility & Feature Deprecation | RC-6A: Deprecation Warning & Decorator Instrumentation | FastAPI-5 | `PC-3` | 1f, 2h (`+44/-8`) | 4f (`+94`) | 🗑️ Deprecate `ORJSONResponse` and `UJSONResponse` |
| 036 | `fastapi_14609` | SUB-4A: Pydantic v1 Deprecation & Removal Lifecycle | RC-6C: Legacy Compatibility Layer & Dead-Code Removal | FastAPI-3 | `PC-3` | 20f, 92h (`+192/-1855`) | 8f (`+32`) | ➖ Drop support for `pydantic.v1` |
| 063 | `fastapi_14186` | SUB-4A: Pydantic v1 Deprecation & Removal Lifecycle | RC-6B: Upstream Dependency API Migration (Pydantic v2 / Starlette / urllib3) | FastAPI-3 | `PC-3` | 10f, 51h (`+266/-98`) | 3f (`+17`) | 🐛 Fix internal Pydantic v1 compatibility (warnings) for Python 3.14 and Pydantic 2.12 |
| 066 | `fastapi_14077` | SUB-4B: Upstream Library Compatibility & Feature Deprecation | RC-6B: Upstream Dependency API Migration (Pydantic v2 / Starlette / urllib3) | FastAPI-4 | `PC-3` | 3f, 6h (`+5/-6`) | 1f (`+1`) | ⬆️ Upgrade Starlette supported version range to >=0.40.0,<0.49.0 |
| 083 | `fastapi_14605` | SUB-4A: Pydantic v1 Deprecation & Removal Lifecycle | RC-6A: Deprecation Warning & Decorator Instrumentation | FastAPI-3 | `PC-3` | 7f, 20h (`+28/-16`) | 12f (`+38`) | 🔊 Add a custom `FastAPIDeprecationWarning` |
| 085 | `fastapi_14583` | SUB-4A: Pydantic v1 Deprecation & Removal Lifecycle | RC-6A: Deprecation Warning & Decorator Instrumentation | FastAPI-3 | `PC-5` | 2f, 6h (`+24/-0`) | 18f (`+778`) | 🔊 Add deprecation warnings when using `pydantic.v1` |
| 094 | `requests_6757` | SUB-4B: Upstream Library Compatibility & Feature Deprecation | RC-6B: Upstream Dependency API Migration (Pydantic v2 / Starlette / urllib3) | Requests-4 | `PC-3` | 2f, 3h (`+16/-1`) | 1f (`+24`) | Test on urllib3 1.26.x |

### CAT-5: Developer Experience (DX), Error Diagnostics & Guardrails (3 Tasks)

| # | `instance_id` | Sub-Category (`Axis 1B`) | Root-Cause Sub-Category (`Axis 2B`) | Subsystem (`Axis 3`) | Prompt (`Ax4`) | Diff Stats | Test Files (`+Lines`) | Problem Statement Title |
| ---: | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 025 | `fastapi_14258` | SUB-5A: Actionable Error Messages, Tracebacks & Circular Guards | RC-2C: Self-Reference / Cycle Guard & Diagnostic Assertion | FastAPI-2 | `PC-3` | 1f, 1h (`+4/-0`) | 1f (`+12`) | ✨ Show a clear error on attempt to include router into itself |
| 032 | `fastapi_14479` | SUB-5A: Actionable Error Messages, Tracebacks & Circular Guards | RC-2C: Self-Reference / Cycle Guard & Diagnostic Assertion | FastAPI-1 | `PC-1` | 1f, 1h (`+1/-1`) | 1f (`+16`) | 🚸 Improve error message for invalid query parameter type annotations |
| 044 | `fastapi_14306` | SUB-5A: Actionable Error Messages, Tracebacks & Circular Guards | RC-2C: Self-Reference / Cycle Guard & Diagnostic Assertion | FastAPI-2 | `PC-2` | 2f, 12h (`+121/-16`) | 1f (`+168`) | 🚸  Improve tracebacks by adding endpoint metadata |

### CAT-6: Documentation Tutorials & Maintainer Tooling (4 Tasks)

| # | `instance_id` | Sub-Category (`Axis 1B`) | Root-Cause Sub-Category (`Axis 2B`) | Subsystem (`Axis 3`) | Prompt (`Ax4`) | Diff Stats | Test Files (`+Lines`) | Problem Statement Title |
| ---: | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 001 | `fastapi_15661` | SUB-6B: Maintainer Release & Automation Scripts | RC-7B: Standalone CLI / Automation Script Synthesis | FastAPI-7 | `PC-3` | 1f, 1h (`+216/-0`) | 1f (`+307`) | 👷 Automate release preparation |
| 008 | `fastapi_15023` | SUB-6A: Executable Documentation Tutorial (docs_src) Updates | RC-8B: Context Manager / Stream / Pipe Resource Cleanup | FastAPI-7 | `PC-4` | 1f, 1h (`+18/-8`) | 1f (`+15`) | 📝 Update docs for responses and new stream with `yield` |
| 031 | `fastapi_14492` | SUB-6A: Executable Documentation Tutorial (docs_src) Updates | RC-4C: Documentation Example / Constant Specification Fix | FastAPI-7 | `PC-4` | 1f, 1h (`+1/-1`) | 1f (`+1`) | 📝 Fix example of license identifier in documentation |
| 040 | `fastapi_14487` | SUB-6A: Executable Documentation Tutorial (docs_src) Updates | RC-4C: Documentation Example / Constant Specification Fix | FastAPI-7 | `PC-4` | 1f, 1h (`+5/-2`) | 1f (`+2`) | 📝 Update docs about re-raising validation errors, do not include string as is to not |


---

<!-- ====================================================================== -->
<!-- FILE: 05_Quality_Check_and_Table_Validation_Report.md -->
<!-- ====================================================================== -->

# Quality Check & Markdown Table Validation Report

*Deliverable Folder Audited: `deliverables/2026-11-05_Gemma4_Problem_Dataset_Taxonomy_and_Analysis`*
*Date: 2026-11-05*

---

## 1. Executive Quality Assurance Summary

All markdown deliverables in this package underwent automated structural, syntactic, and arithmetic validation using three independent verification harnesses (`scratch/validate_md_tables.py`, `scratch/qc_tables.py`, and `scratch/2026-11-05_dataset_analysis/generate_qc_report.py`):

| Quality Gate Criterion | Verification Method | Target Standard | Measured Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **100% Dataset Task Accounting** | Set-equality check between `tasks.jsonl` (`instance_id`s) and `CLASSIFICATIONS` dictionary | All 129 tasks present; 0 missing, 0 duplicate | `129 / 129` tasks (`Missing: []`, `Extra: []`) | **PASS** |
| **Cross-Axis Sum Reconciliation** | Sum of task counts across every category and sub-category (`Axes 1–6`) | Every axis and sub-axis sums to exactly `129` (`100.00%`) | `129` across all 6 axes and sub-axes | **PASS** |
| **Markdown Table Column Parity** | Strict pipe-delimiter and unescaped-pipe column count check across header, separator, and all body rows | `0` row/header column count mismatches | `0` mismatches across **35 tables** (516 body rows) | **PASS** |
| **GFM Separator & Alignment Syntax** | Regex check on all table separator rows for valid colon-dash alignment markers | Valid `:---` (left) and `---:` (right numeric) alignment markers | `100%` valid across all 35 tables | **PASS** |
| **Block Isolation Padding** | Blank-line verification immediately preceding header row and following final table row | Blank line before and after every table block | `100%` compliant (`0` boundary issues) | **PASS** |

---

## 2. Per-Table Structural & Alignment Audit Log (`00_README.md` – `04_Complete_129_Task_Classified_Catalog.md`)

| Deliverable File | Table ID | Line Range | Columns | Body Rows | Valid Alignment Separator | Blank-Line Padding | Column Mismatches | Validation Status |
| :--- | :--- | :--- | ---: | ---: | :--- | :--- | ---: | :--- |
| `00_README.md` | Table #01 | `L13–L20` | 3 | 6 | Yes | Yes | 0 | **PASS (0 Defects)** |
| `00_README.md` | Table #02 | `L28–L47` | 8 | 18 | Yes | Yes | 0 | **PASS (0 Defects)** |
| `00_README.md` | Table #03 | `L51–L61` | 8 | 9 | Yes | Yes | 0 | **PASS (0 Defects)** |
| `01_Deep_Wide_Research_and_Executive_Synthesis.md` | Table #01 | `L20–L30` | 5 | 9 | Yes | Yes | 0 | **PASS (0 Defects)** |
| `01_Deep_Wide_Research_and_Executive_Synthesis.md` | Table #02 | `L42–L48` | 11 | 5 | Yes | Yes | 0 | **PASS (0 Defects)** |
| `01_Deep_Wide_Research_and_Executive_Synthesis.md` | Table #03 | `L75–L80` | 9 | 4 | Yes | Yes | 0 | **PASS (0 Defects)** |
| `02_Multi_Dimensional_Problem_Taxonomy_and_Subcategories.md` | Table #01 | `L14–L21` | 4 | 6 | Yes | Yes | 0 | **PASS (0 Defects)** |
| `02_Multi_Dimensional_Problem_Taxonomy_and_Subcategories.md` | Table #02 | `L29–L37` | 12 | 7 | Yes | Yes | 0 | **PASS (0 Defects)** |
| `02_Multi_Dimensional_Problem_Taxonomy_and_Subcategories.md` | Table #03 | `L41–L60` | 12 | 18 | Yes | Yes | 0 | **PASS (0 Defects)** |
| `02_Multi_Dimensional_Problem_Taxonomy_and_Subcategories.md` | Table #04 | `L70–L80` | 12 | 9 | Yes | Yes | 0 | **PASS (0 Defects)** |
| `02_Multi_Dimensional_Problem_Taxonomy_and_Subcategories.md` | Table #05 | `L84–L111` | 12 | 26 | Yes | Yes | 0 | **PASS (0 Defects)** |
| `02_Multi_Dimensional_Problem_Taxonomy_and_Subcategories.md` | Table #06 | `L117–L137` | 12 | 19 | Yes | Yes | 0 | **PASS (0 Defects)** |
| `02_Multi_Dimensional_Problem_Taxonomy_and_Subcategories.md` | Table #07 | `L145–L152` | 12 | 6 | Yes | Yes | 0 | **PASS (0 Defects)** |
| `02_Multi_Dimensional_Problem_Taxonomy_and_Subcategories.md` | Table #08 | `L165–L172` | 12 | 6 | Yes | Yes | 0 | **PASS (0 Defects)** |
| `02_Multi_Dimensional_Problem_Taxonomy_and_Subcategories.md` | Table #09 | `L176–L182` | 12 | 5 | Yes | Yes | 0 | **PASS (0 Defects)** |
| `02_Multi_Dimensional_Problem_Taxonomy_and_Subcategories.md` | Table #10 | `L188–L198` | 12 | 9 | Yes | Yes | 0 | **PASS (0 Defects)** |
| `02_Multi_Dimensional_Problem_Taxonomy_and_Subcategories.md` | Table #11 | `L206–L214` | 7 | 7 | Yes | Yes | 0 | **PASS (0 Defects)** |
| `02_Multi_Dimensional_Problem_Taxonomy_and_Subcategories.md` | Table #12 | `L218–L228` | 8 | 9 | Yes | Yes | 0 | **PASS (0 Defects)** |
| `02_Multi_Dimensional_Problem_Taxonomy_and_Subcategories.md` | Table #13 | `L232–L239` | 7 | 6 | Yes | Yes | 0 | **PASS (0 Defects)** |
| `02_Multi_Dimensional_Problem_Taxonomy_and_Subcategories.md` | Table #14 | `L247–L258` | 5 | 10 | Yes | Yes | 0 | **PASS (0 Defects)** |
| `03_Repository_and_Subcategory_Engineering_Deep_Dives.md` | Table #01 | `L14–L22` | 9 | 7 | Yes | Yes | 0 | **PASS (0 Defects)** |
| `03_Repository_and_Subcategory_Engineering_Deep_Dives.md` | Table #02 | `L26–L42` | 6 | 15 | Yes | Yes | 0 | **PASS (0 Defects)** |
| `03_Repository_and_Subcategory_Engineering_Deep_Dives.md` | Table #03 | `L72–L79` | 9 | 6 | Yes | Yes | 0 | **PASS (0 Defects)** |
| `03_Repository_and_Subcategory_Engineering_Deep_Dives.md` | Table #04 | `L83–L99` | 6 | 15 | Yes | Yes | 0 | **PASS (0 Defects)** |
| `03_Repository_and_Subcategory_Engineering_Deep_Dives.md` | Table #05 | `L122–L127` | 9 | 4 | Yes | Yes | 0 | **PASS (0 Defects)** |
| `03_Repository_and_Subcategory_Engineering_Deep_Dives.md` | Table #06 | `L131–L140` | 6 | 8 | Yes | Yes | 0 | **PASS (0 Defects)** |
| `03_Repository_and_Subcategory_Engineering_Deep_Dives.md` | Table #07 | `L159–L161` | 9 | 1 | Yes | Yes | 0 | **PASS (0 Defects)** |
| `04_Complete_129_Task_Classified_Catalog.md` | Table #01 | `L10–L19` | 4 | 8 | Yes | Yes | 0 | **PASS (0 Defects)** |
| `04_Complete_129_Task_Classified_Catalog.md` | Table #02 | `L25–L155` | 15 | 129 | Yes | Yes | 0 | **PASS (0 Defects)** |
| `04_Complete_129_Task_Classified_Catalog.md` | Table #03 | `L163–L243` | 9 | 79 | Yes | Yes | 0 | **PASS (0 Defects)** |
| `04_Complete_129_Task_Classified_Catalog.md` | Table #04 | `L247–L271` | 9 | 23 | Yes | Yes | 0 | **PASS (0 Defects)** |
| `04_Complete_129_Task_Classified_Catalog.md` | Table #05 | `L275–L289` | 9 | 13 | Yes | Yes | 0 | **PASS (0 Defects)** |
| `04_Complete_129_Task_Classified_Catalog.md` | Table #06 | `L293–L301` | 9 | 7 | Yes | Yes | 0 | **PASS (0 Defects)** |
| `04_Complete_129_Task_Classified_Catalog.md` | Table #07 | `L305–L309` | 9 | 3 | Yes | Yes | 0 | **PASS (0 Defects)** |
| `04_Complete_129_Task_Classified_Catalog.md` | Table #08 | `L313–L318` | 9 | 4 | Yes | Yes | 0 | **PASS (0 Defects)** |

---

## 3. Reproducible Validation Commands

To re-verify all markdown tables in this deliverable folder at any time from the workspace root, execute:

```powershell
python scratch/validate_md_tables.py (Get-ChildItem "deliverables/2026-11-05_Gemma4_Problem_Dataset_Taxonomy_and_Analysis/*.md").FullName
python scratch/qc_tables.py "deliverables/2026-11-05_Gemma4_Problem_Dataset_Taxonomy_and_Analysis"
```

