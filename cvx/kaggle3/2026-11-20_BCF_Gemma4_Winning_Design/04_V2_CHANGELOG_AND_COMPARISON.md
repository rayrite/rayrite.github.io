# BCF v2 Changelog & Side-by-Side Comparison vs. Preserved v1

> **Date:** `2026-11-20`
> **Preservation Guarantee:** All original v1 folders and ZIPs in the parent directory (`../submission_31b/`, `../submission_e4b/`, `../submission_31b.zip`, `../submission_e4b.zip`, `../tools/validate_and_package_bcf.py`) are **100% untouched** for direct A/B benchmarking and diff comparison.

---

## v2 Artifact Inventory (4 Preflight-Verified Builds)

| Build Directory | Packaged ZIP | Architecture | Model | Primary Use Case |
| :--- | :--- | :--- | :--- | :--- |
| `submission_31b_monolith/` | `submission_31b_monolith_v2.zip` | **Zero-Skill Monolithic `LlmAgent`** | `gemma-4-31b-it-qat-w4a16-ct` | **Recommended Primary Safe Champion (31B \$65K Track)** — mathematically immune to `#753973`/`#759580` array-arg freezes, `#758547`/`#758854` skill container isolation, and `#760126` `SequentialAgent` overhead |
| `submission_e4b_monolith/` | `submission_e4b_monolith_v2.zip` | **Zero-Skill Monolithic `LlmAgent`** | `gemma-4-e4b-it-qat-w4a16-ct` | **Recommended Primary Safe Champion (E4B \$10K Track)** — eliminates 2-stage handoff fragility on 4B while keeping calibrated `thinking_budget: 768` |
| `submission_31b/` | `submission_31b_v2.zip` | **Patched BCF-Skill `SequentialAgent`** | `gemma-4-31b-it-qat-w4a16-ct` | **High-Capability Challenger (31B)** — full `bcf.py` v2 (200 KB BM25, `patch-multi`, `symtable` scope guard, Container-B parity `verify`); canary-test skill mount on 4× L4 before risking a full slot |
| `submission_e4b/` | `submission_e4b_v2.zip` | **Patched BCF-Skill `SequentialAgent`** | `gemma-4-e4b-it-qat-w4a16-ct` | **High-Capability Challenger (E4B)** — compact `bcf.py` v2 workflow for head-to-head A/B comparison against `submission_e4b_monolith` |

---

## Exact v1 -> v2 Patch Delta Matrix

| Patch ID | Severity | v1 Defect (Preserved in `../`) | v2 Fix Applied in `v2/` |
| :---: | :---: | :--- | :--- |
| **P0-1** | **P0 Blocker** | `prompts/bcf_plan.md` & `SKILL.md` passed `script_path` instead of ADK 1.36.1's `file_path` (`100%` `INVALID_ARGUMENTS` failure) | Fixed to `file_path: "scripts/install.py"` in all 4 Skill-track files + explicitly skip redundant `load_skill` turn |
| **P0-2** | **P0 Blocker** | Only `SequentialAgent` + `skills:` existed, leaving residual vLLM 0.19.1 `_parse_gemma4_array` (`list[str]`) & hidden-scorer skill isolation exposure (`#753973`, `#758547`, `#760126`) | Added **Zero-Skill Monolithic** `submission_31b_monolith` & `submission_e4b_monolith` with **zero** array-arg tool schemas and zero `skills:` |
| **P1-3** | **P1 Leak** | 31B `solver.yaml` set `max_output_tokens: 8192` (vLLM HTTP 400 empty-patch wipe); E4B `bcf_plan.yaml` set `1536 < 2048`; `bcf_plan` risked copying 10 KB raw prompts into heredoc | 31B `solver` lowered to `4096` (`+4,096` prompt headroom); `bcf_plan` raised to `3072` (31B) / `2048` (E4B); `<<'BCF_PROB'` capped at `<= 15` (31B) / `<= 10` (E4B) concise digest lines |
| **P1-4** | **P1 Leak** | Fenced `bash` blocks in prompts (`31%` vs. `5%` malformed tool calls in `gemma4-swe-kit`); `write_file` exposed in `solver.yaml` (`/workspace/tmp/` pollution `#760595`) | Removed **all** fenced shell blocks across every prompt & `SKILL.md` (prose-bound to `run_command`); removed `write_file` from all 4 v2 tool lists |
| **P2-5** | **P2 Upgrade** | `bcf.py` truncated BM25 at `24,000` chars (`50/129` tasks > line 600), test scan at `16,000`, leaked `"stream_image"`, single-hunk `patch` only (`71/129` multi-hunk), top-level-only smoke import without `PYTHONSAFEPATH=1` / AST scope check, non-worktree `.git` check | Raised BM25 to `200,000` & test scan to `120,000`, removed `"stream_image"`, added atomic bottom-to-top `patch-multi`, added `symtable`+AST `SCOPE_WARN` check, exact dotted submodule import & `PYTHONSAFEPATH=1 PYTHONNOUSERSITE=1 python3 -s --maxfail=3` in `verify`, and `git rev-parse --git-dir` worktree guard |
| **P2-6** | **P2 Validator** | v1 validator missed `script_path`, token bounds, fenced bash, `write_file`, and training leaks | Created `v2/tools/validate_and_package_bcf_v2.py` enforcing every P0/P1/P2 invariant + new functional tests (`>24KB` locate, `patch-multi`, submodule import, `SCOPE_WARN`) across all 4 v2 builds |

---

## Recommended Local A/B Benchmark Order (RTX 5090)

1. **Sanity Check (`smoke_12`, 10–18 min):** Run `submission_31b_monolith` vs. `submission_31b` (v2) vs. `../submission_31b` (v1) to observe malformed tool-call drop and `file_path` install fix immediately.
2. **Main A/B (`dev_tune_30` -> locked `holdout_rich`):** Compare `R_holdout_win(k = 1.7)` and `H_120(1.7)` (`project_12h.py`) across `submission_31b_monolith` vs. `submission_31b` (and likewise for E4B).
3. **Promotion Rule:** Promote `submission_*_monolith_v2.zip` as your immediate safe submission unless `submission_*_v2.zip` beats it by `>= +2` tasks on `holdout_rich` **AND** passes a 5-task Kaggle 4× L4 skill-mount canary.
