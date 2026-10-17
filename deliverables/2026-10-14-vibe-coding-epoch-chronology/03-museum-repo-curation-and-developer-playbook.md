# Developer Playbook & Curatorial Standard: Building the Museum of Pre-Vibe Artificial Intelligence Craftsmanship

*Research Scope: Architectural blueprints, metadata schemas, museum placard templates, Git tagging workflows, Shields.io badge formulas, and comparative engineering retrospectives for cataloging and showcasing mini-apps built between November 2022 and February 2, 2025.*  
*As of: 2026-10-14 (VCS Coordinate: AVC.0618.0622.15 / Epoch Year 1 AVC)*

---

## Executive Summary

The transition of software development from manual syntax composition to autonomous intent orchestration has created an urgent need for digital preservation. Projects developed during the **Pre-Epoch Showcase Window** (November 30, 2022 – February 2, 2025; coordinates `BVC.0795.0517.15` down to `T0.0000.0000.00`) represent a unique, unrepeatable chapter in computing history: **the golden age of artisan human-AI co-creation.**

During this 795-day interregnum, human creators did not merely "vibe." They wrestled with token limits, copy-pasted error traces into browser chat windows, coaxed reasoning out of early LLMs using complex few-shot prompt scaffolds, and manually reviewed every pull request.

This playbook provides the complete technical and curatorial specification for building a museum-grade GitHub repository to showcase these artifacts. It supplies:
1. A museum-style repository folder taxonomy.
2. A machine-readable YAML/JSON-LD frontmatter metadata standard.
3. Gallery placard markdown templates.
4. Git commit and release tagging conventions anchored to VCS coordinates.
5. Dynamic Shields.io badge recipes.
6. An engineering retrospective comparing B.V.C. artisan development with modern A.V.C. agentic workflows.

---

## 1. Museum Repository Architecture & Directory Taxonomy

A museum-style GitHub repository must balance two distinct audiences:
- **Casual Museum Visitors:** Visitors who browse the web view, read interactive placards, inspect screenshots, and run live demos.
- **Compiler / Forensics Engineers:** Developers and researchers who inspect raw code, examine early system prompts, replay commit histories, and analyze architectural lineage.

### 1.1 Recommended Repository Layout

```
museum-pre-vibe-craftsmanship/
├── .github/
│   ├── workflows/
│   │   ├── validate-vcs-tags.yml        # CI test verifying all commits have VCS coordinates
│   │   └── build-gallery-index.yml      # Auto-generates README catalog from metadata
├── exhibits/                            # Individual museum wings / projects
│   ├── 01-bvc-0780-terminal-weather/
│   │   ├── exhibit-metadata.yaml        # Structured project provenance metadata
│   │   ├── PLACARD.md                   # Museum gallery placard for this exhibit
│   │   ├── artifacts/                   # Original prompt logs, screenshots, transcripts
│   │   │   ├── system-prompt-v1.txt
│   │   │   └── terminal-screenshot.png
│   │   └── src/                         # Original, unmodified source code
│   ├── 02-bvc-0520-svg-flowchart-bot/
│   │   ├── exhibit-metadata.yaml
│   │   ├── PLACARD.md
│   │   └── src/
│   └── 03-bvc-0145-react-markdown-canvas/
│       ├── exhibit-metadata.yaml
│       ├── PLACARD.md
│       └── src/
├── curatorial-docs/
│   ├── 00-THE-EPOCH-SPECIFICATION.md    # Copy of the VCS standard specification
│   ├── CHRONOLOGY-TIMELINE.md           # Master chronological simulation table
│   └── ETHICS-OF-PRESERVATION.md        # Curatorial charter on preserving original defects
├── scripts/
│   ├── vcs_calculator.py                # Tooling to generate VCS coordinates for new commits
│   └── generate_museum_placards.py      # Script compiling exhibits into web portals
├── LICENSE                              # Permissive open preservation license (MIT / CC-BY-4.0)
└── README.md                            # Main museum foyer, floor plan, and gallery catalog
```

---

## 2. Exhibit Metadata Schema Specification (`exhibit-metadata.yaml`)

Each project in the `exhibits/` directory must contain an `exhibit-metadata.yaml` file conforming to the following formal schema:

```yaml
# ==============================================================================
# MUSEUM OF PRE-VIBE CRAFTSMANSHIP: EXHIBIT PROVENANCE RECORD
# Standard: VCS-Exhibit-Schema v1.0
# ==============================================================================
exhibit_id: "EXH-BVC-0780"
title: "Autonomous Terminal Weather Forecaster"
tagline: "A CLI tool built with GPT-3.5 turbo via raw curl terminal scripts"

provenance:
  temporal:
    epoch_relative_coordinate: "BVC.0780.1422.00"
    epoch_calver_coordinate: "BVC.03.315.1422.00"
    human_offset: "780 days, 14 hours, 22 minutes before Vibe Epoch"
    gregorian_utc: "2022-12-15T08:55:15Z"
    local_display: "2022-12-15 03:55:15 EST"
  
  instrumentation:
    primary_model: "gpt-3.5-turbo-0301"
    model_provider: "OpenAI"
    context_window_tokens: 4096
    interface_type: "Browser Chat Ping-Pong" # Choices: Browser Chat, IDE Autocomplete, Early Agent
    human_in_the_loop_ratio: 0.65            # 65% human guidance/glue, 35% model code
    diff_acceptance_method: "Manual Inspection & Line-by-Line Copy-Paste"

technical_profile:
  language: "Python 3.10"
  runtime: "CPython"
  architecture: "Single-file procedural script"
  dependencies:
    - "requests==2.28.1"
    - "rich==12.6.0"
  original_loc: 184
  defect_status: "Preserved with original edge-case bugs intact"

curatorial_notes:
  historical_context: |
    Built exactly 15 days after ChatGPT's global launch. At this time, OpenAI had no
    function-calling API. Output had to be coerced into raw JSON using strict regex prompts.
  preservation_philosophy: |
    The source code in src/ is intentionally kept exactly as generated in December 2022.
    No modern LLM refactoring has been applied.
```

---

## 3. Museum Gallery Placard Template (`PLACARD.md`)

The `PLACARD.md` document serves as the visual display placard beside the digital artifact.

````markdown
# 🏛️ Museum Exhibit: Autonomous Terminal Weather Forecaster
**Exhibit Catalog Number:** `EXH-BVC-0780`  
**Temporal Coordinate:** `BVC.0780.1422.00` *(780d 14h 22m Before Vibe Coding)*  
**Forged Date:** `2022-12-15 08:55:15 UTC` | `03:55:15 EST`

---

## 🧭 Curatorial Overview

```
 +-------------------------------------------------------------------------------+
 |  ERA: BEFORE VIBE CODING (B.V.C.)                 MODEL: GPT-3.5-TURBO        |
 |  VECTOR: -780 DAYS TO THE EPOCH                  INTERFACE: CHAT COPY-PASTE   |
 +-------------------------------------------------------------------------------+
```

> *"At this juncture in history, Large Language Models could not directly edit files, execute shell commands, or run tests. Every line of this application was copied by hand from a browser window and pasted into a local text editor."*

### 🏷️ Exhibit Badges
![VCS Era](https://img.shields.io/badge/VCS_Era-BVC.0780.1422-blue?style=for-the-badge)
![Model](https://img.shields.io/badge/Model-GPT--3.5--Turbo-orange?style=for-the-badge)
![Human In Loop](https://img.shields.io/badge/Human_Craft_Ratio-65%25-green?style=for-the-badge)
![Status](https://img.shields.io/badge/Preservation-Authentic_Unmodified-purple?style=for-the-badge)

---

## 🛠️ The Artisan Workflow: How It Was Built

In December 2022, software development with AI was an intimate, tactile human craft:
1. **The Few-Shot Prompt Dance:** To extract structured JSON without modern JSON-mode APIs, three hardcoded examples were manually typed into the prompt.
2. **The Terminal Execution Loop:** The developer ran the script, hit a `KeyError: 'weather'`, copied the traceback, and pasted it back to the web browser.
3. **Manual Import Verification:** The model hallucinated non-existent methods on `requests`; the developer had to manually consult the Python docs to fix the call signature.

```
       ARTISAN HUMAN-AI FEEDBACK LOOP (B.V.C. ERA 2)
       
   [ Human Architect ] -------- Natural Language Prompt -------> [ ChatGPT Web ]
          ^                                                            |
          |                                                            v
   Manual Integration <------- Markdown Code Block Copy <------+ Raw Completion
          |
          v
   [ Local IDE / CLI ] -------> Run Terminal Error Trace --------+
```

---

## 💾 Exhibit Code Snapshot

```python
# Exhibit Snippet: Handcrafted Error Catching from December 2022
def parse_model_response(raw_text: str) -> dict:
    # In BVC 0780, models often wrapped JSON in informal chat pleasantries:
    # "Sure! Here is the JSON you requested: {...}"
    # This regex was handcrafted by the human developer to rescue the payload:
    match = re.search(r"\{.*\}", raw_text, re.DOTALL)
    if not match:
        raise ValueError("Model failed to adhere to JSON format. Please re-prompt.")
    return json.loads(match.group(0))
```

---

## 🔍 Curatorial Assessment for 2026 Developers
This artifact demonstrates the patience and algorithmic scaffolding required before models developed agentic autonomy. While a modern 2026 vibe coder can generate this entire project via a 4-second voice command, this exhibit preserves the foundational ingenuity of early human-AI collaboration.
````

---

## 4. Git Tagging and Commit Standard

To ensure that the repository's Git history mathematically mirrors the chronology of the AI revolution, developers must format Git commits and tags using the following standards:

### 4.1 Commit Message Convention

Format:
```
[<VCS_COORDINATE>] <Action>: <Subject> (<Gregorian_Date>)
```

Examples:
```bash
# Adding an early prototype from late 2022:
git commit -m "[BVC.0780.1422] Exhibit: Ingest Terminal Weather CLI (2022-12-15)"

# Adding an exhibit built right before the Epoch:
git commit -m "[BVC.0013.1100] Exhibit: Add DeepSeek-R1 Distill Demo (2025-01-20)"

# Committing modern museum curation tooling:
git commit -m "[AVC.0618.0622] Chore: Release Museum Gallery Webpack Portal (2026-10-14)"
```

### 4.2 Git Release Tagging Convention

All historical release tags must be namespaced under `vcs/`:
```bash
# Day-level release tag:
git tag -a vcs/bvc-d0780 -m "Museum Milestone: Exhibit 01 (BVC.0780)"

# Minute-precision release tag:
git tag -a vcs/bvc-0780.1422 -m "Curated Release EXH-BVC-0780 at BVC.0780.1422"

# Tagging the Epoch boundary itself:
git tag -a vcs/t0-watershed -m "THE EPOCH: Andrej Karpathy Vibe Coding Tweet (2025-02-02 23:17:15 UTC)"

# Modern present-day tag:
git tag -a vcs/avc-d0618 -m "Present Day Museum Opening (AVC.0618)"
```

---

## 5. Dynamic Shields.io Badge Generator Formulas

Embed these badge formulas in repository READMEs and exhibit placards:

| Badge Type | Markdown Code | Visual Preview / Color Code |
| :--- | :--- | :--- |
| **BVC Epoch Delta** | `![BVC Badge](https://img.shields.io/badge/Era-BVC.0795.0517-blue?style=flat-square&logo=git)` | Blue (`#007ec6`) |
| **T0 Epoch Watershed** | `![T0 Badge](https://img.shields.io/badge/Epoch-T0.0000.0000-red?style=flat-square&logo=x)` | Red / Singularity (`#e05d44`) |
| **AVC Modern Era** | `![AVC Badge](https://img.shields.io/badge/Era-AVC.0618.0622-success?style=flat-square&logo=sparkles)`| Green (`#44cc11`) |
| **Craftsmanship Ratio** | `![Artisan Craft](https://img.shields.io/badge/Craft_Ratio-70%25_Human_Glue-informational)` | Cyan (`#00aaff`) |
| **Vibe Era Status** | `![Word of the Year](https://img.shields.io/badge/Collins_Word_of_the_Year_2025-Vibe_Coding-purple)` | Purple (`#9900ff`) |

---

## 6. Engineering Retrospective: B.V.C. Artisan vs. A.V.C. Vibe Paradigms

For engineering teams reviewing this museum repository in 2026, the contrast between the pre-vibe and post-vibe paradigms offers vital lessons in system resilience, technical debt, and software architecture:

| Architectural Vector | Pre-Epoch Artisan Paradigm (B.V.C.) | Post-Epoch Vibe Paradigm (A.V.C.) | Engineering Team Implication |
| :--- | :--- | :--- | :--- |
| **Mental Model** | Code is an artisan asset to be owned, understood, and maintained line-by-line. | Code is an ephemeral compilation intermediate generated from intent. | BVC code is deeply understood by its creator; AVC code requires automated behavioral test harnesses to maintain safely. |
| **Primary Interface** | Mechanical keyboard, IDE split screen, browser chat, manual copy-paste. | Voice dictation (Superwhisper), agentic prompts, multi-agent swarms. | Interface velocity increased by ~100x, but human cognitive bandwidth for syntax verification collapsed. |
| **Diff Review** | Rigorous manual line-by-line code review of every proposed hunk. | Blind "Accept All"; diff inspection is discarded in favor of runtime smoke testing. | AVC shifts validation from *static code inspection* to *runtime behavior assertion*. |
| **Error Remediation** | Manual root-cause debugging using stack traces, logs, and breakpoints. | Blind copy-paste of terminal stack traces back to agent context. | Automated feedback loops resolve 90% of superficial syntax errors, but can introduce circular architectural regressions if unconstrained. |
| **Context Window** | Constrained (4k–32k tokens); required aggressive file chunking. | Massive (1M–10M tokens); entire repos and histories fit in single context. | BVC apps were modular out of necessity; AVC apps risk monolithic state bloat unless guided by architectural rules. |
| **Failure Modes** | Token exhaustion, manual syntax errors, integration friction. | "Ghost dependencies," latent hallucinations, security drift, unmaintainable bloat. | In the AVC era, **Formal Verification, Sandbox Fuzzing, and Property-Based Testing** become the primary engineering disciplines. |

---

## 7. Curatorial Checklist for Museum Launch

Before publishing the repository, complete this verification checklist:

- [ ] **Epoch Anchoring Verified:** Ensure every exhibit has its `VCS-Core` coordinate calculated using `vcs_calculator.py`.
- [ ] **Provenance Metadata Present:** Confirm `exhibit-metadata.yaml` exists in all exhibit subdirectories.
- [ ] **Original Defect Preservation:** Verify that historical bugs, missing error handlers, and vintage model quirks have not been modern-vibe-fixed.
- [ ] **Placard Generated:** Ensure each exhibit has a formatted `PLACARD.md` with appropriate Shields.io badges.
- [ ] **Git Commits Backdated / Annotated:** Confirm commits contain `[BVC.xxxx.xxxx]` tags in their message logs.
- [ ] **README Gallery Foyer Rendered:** Compile all exhibits into a single master showcase table in the root `README.md`.
