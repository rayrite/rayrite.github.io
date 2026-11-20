# Batonic Coding Framework (BCF) — Kaggle Gemma 4 Developer Agent Deliverables (2026-11-20)

This folder contains the complete, verified deliverables for **Task 1** (exhaustive 129-task classification and code-grounded Root Cause Analysis) and **Task 2** (the dual-track **Batonic Coding Framework [BCF]** brain, ready-to-submit ZIP packages for both **Gemma 4 31B** and **Gemma 4 E4B**, automated preflight/functional verification suite, and winning strategy report).

## Deliverable Inventory

| Artifact / Folder | Purpose | Status & Verification |
| :--- | :--- | :--- |
| `01_Dataset_Classification_and_Root_Cause_Analysis.md` | **Task 1 Single-File Report**: Complete 6-category / 21-subcategory classification of all 129 `tasks.jsonl` problems, code-level Root Cause Analysis of all 103 bug/error tasks, profile of 26 non-bug tasks, and 6 meta-root-cause archetypes. | **Verified** (1,231 lines, 9 Markdown tables, 0 table errors) |
| `02_BCF_Brain_Design_Winning_Strategy_and_Pitfalls.md` | **Task 2 Design & Winning Strategy Report**: BCF architecture, 21-subcategory brain coverage matrix, 31B vs. E4B calibration, **Breaking the `0.24` Deadlock**, and **14-Pitfall Guaranteed-`<12h`-Score Proof**. | **Verified** (0 Markdown table errors) |
| `submission_31b/` & `submission_31b.zip` | **Main Track (`\$65,000`) Submission Bundle** (`gemma-4-31b-it-qat-w4a16-ct`): Exact BCF hierarchy (`agent.yaml`, `eval_config.yaml`, `sub_agents/`, `prompts/`, `skills/bcf-spec/`). | **PASS** static preflight + end-to-end sandbox tests (9 files, ~29 KB ZIP) |
| `submission_e4b/` & `submission_e4b.zip` | **Small-Model Bonus Track (`\$10,000`) Submission Bundle** (`gemma-4-e4b-it-qat-w4a16-ct`): Exact BCF hierarchy tailored to E4B's Pareto-optimal thinking/output/patching profile. | **PASS** static preflight + end-to-end sandbox tests (9 files, ~27 KB ZIP) |
| `tools/validate_and_package_bcf.py` | **Automated Preflight, Functional Sandbox Test Suite, 129-Task Classifier Benchmark & ZIP Packager**: Re-syncs E4B scripts, enforces UTF-8 LF / zero BOM / zero `__pycache__`, simulates ADK `os.chdir(td)` installation, and rebuilds both ZIPs. | **PASS** (`-W error::SyntaxWarning`, exit 0) |

## Quick Re-Verification & Packaging Command

```bash
python -W error::SyntaxWarning deliverables/2026-11-20_BCF_Gemma4_Winning_Design/tools/validate_and_package_bcf.py
```

## Quick Markdown Table Quality Check Command

```bash
python scratch/2026-11-20_bcf_analysis/check_md_tables.py \
  deliverables/2026-11-20_BCF_Gemma4_Winning_Design/00_README.md \
  deliverables/2026-11-20_BCF_Gemma4_Winning_Design/01_Dataset_Classification_and_Root_Cause_Analysis.md \
  deliverables/2026-11-20_BCF_Gemma4_Winning_Design/02_BCF_Brain_Design_Winning_Strategy_and_Pitfalls.md
```
