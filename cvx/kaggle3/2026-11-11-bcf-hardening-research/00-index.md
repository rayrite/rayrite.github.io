# BCF Hardening Research — Index & Executive Summary

**Date:** 2026-11-11 · **Companion to:** `deliverables/2026-11-11-bcf-gemma4-brain/` (the shipped two-track BCF brain)
**Method:** rdw deep-and-wide research (4 external angles, keyless/free engines, **$0 spend**) + 7 local analysis/synthesis agents over the dataset, the shipped implementation, and the discussion-board intel (`input/kagglecomp/intel_20261105`, `intel_20261111`). All markdown table-QC'd: **0 defects**.

> External-research caveat: the WebFetch backend was unavailable this session ("Model not exist" on every call); external evidence is WebSearch-snippet-level, confidence-tagged in each deliverable, with probe steps for anything load-bearing and unverified. Local evidence (harness docs, intel captures, implementation, CPU measurements) is primary.

## Deliverables (one per user task, clearly demarcated)

| File | Task | What it contains |
|---|---|---|
| [01-python-traps-by-error-family.md](01-python-traps-by-error-family.md) | 1 | Official-Python-docs traps/gotchas + post-mortem playbooks for all 10 root-cause families, grounded in 32 real problem-set RCAs (1,119 lines, 16 tables); the 3.12-host/3.13-sandbox/3.8-3.14-task version skew; exception-handling reference card; pytest/harness gotchas; 15-row corrections register; all probes smoke-tested on 3.12 (3 mechanism errors caught & fixed) |
| [02-time-bottlenecks-and-tuning.md](02-time-bottlenecks-and-tuning.md) | 2a/b/c | Part A: full wall-clock bottleneck inventory (remote 4xL4 + local RTX 5090), top-10 ranking, measurement plan. Part B: 66 tuning levers with ranked impact-effort analysis + quick wins + 22 do-NOT-tune items. Part C: L0-L4 iteration loop ladder, hypothesis ledger, script sketches, first-week schedule |
| [03-local-env-parity-plan.md](03-local-env-parity-plan.md) | 3a/b | Step-by-step parity plans: Track A Windows 11 + WSL2, Track B Zorin OS 18.1 native (recommended primary); exact stack pins, sandbox image build, vLLM serving flags, KV-fit probe, WSL#40401 VRAM probe, verification checklist, divergence register, troubleshooting |
| [04-local-scoring-and-feedback-guide.md](04-local-scoring-and-feedback-guide.md) | 4 | Running local evals; artifact-by-artifact interpretation; resolved=False diagnostic decision tree; failure clustering by taxonomy; local↔Kaggle correlation (what transfers, what doesn't, documented anti-correlation cases); calibration protocol; results→tuning-action mapping with worked example |
| [05-robustness-audit-vs-field-issues.md](05-robustness-audit-vs-field-issues.md) | 5 | 70-row issue-by-issue audit of the shipped BCF against every field-reported problem: 36 HANDLED / 20 PARTIAL / 1 corpus-GAP / 13 N-A-by-design; 2 real bcf.py bugs found & fixed; **canary concept + C0–C7 ladder explained (§6.0)** with detailed checklist; residual-risk register |

## Executive summary of findings

**Task 1 — Python traps.** The sandbox is Python 3.13 (`python:3.13-slim`, verified from the dataset Dockerfile) while the host notebook is 3.12.13 and task code spans 3.8-3.14 — the version skew itself is a trap class (removed modules `imp`/`telnetlib`/`distutils`/`cgi`, with shims shipped for the first two). Each family has signature language-level traps: `Annotated`/`UnionType` introspection semantics, `get_type_hints(include_extras)`, `DeprecationWarning` `__main__`-only visibility, `TaskGroup`→`ExceptionGroup`, warning-registry dedup, codepoints-vs-graphemes, 0-based columns vs 1-based lines, `__wrapped__` cycles. Every claim carries an official-doc citation + version + confidence; common folklore corrections are registered.

**Task 2 — Time & tuning.** Remote: queue (36-52h) dominates iteration; decode eats ~7-9h of the 12h budget; reclaimable waste = thinking overrun, nudge restarts, edit loops, compaction calls, late edit commitment. Local 5090: ~1.5-2.3x decode (estimate), KV cache is the binding constraint, WSL2 filesystem crosses cost 3-10x on bootstrap. 66 levers inventoried; top ranked: eval_config cap decision rule, C0 compiler canary, planner-only thinking reduction, temp-0 arm, 3,000-char statement copy, E4B edit-line priors. Iteration: CPU-only L0 loop for everything GPU-free (including parser fuzz), warm-server drills, stratified dev30 paired A/B with win-both + McNemar, overnight masked-68, ~8-11 usable Kaggle slots with pre-slot canaries.

**Task 3 — Environment parity.** Zorin 18.1 (Ubuntu 24.04 base) native is the recommended primary track; RTX 5090 requires NVIDIA **open** kernel modules (580-open); Docker Engine + NVIDIA Container Toolkit (Docker Desktop on Linux has no GPU). WSL2 is viable but probe-first: WSL ≥2.7.0 for CUDA-graph capture, and a reported ~16 GiB invisible CUDA overhead on Blackwell (WSL#40401) could kill the plan — exact probe + decision tree included. Stack pins: vLLM 0.19.1 (torch 2.10.0), swegemma 0.2.11, adk-submission 0.2.13, google-adk 1.36.1, wheelhouse v31 (SHA-anchored). KV-fit probe decides max_model_len; TP1≠TP4 numerics → compare task metrics, not tokens.

**Task 4 — Scoring & feedback.** Full guide from `swegemma eval` commands through every result artifact, a diagnostic decision tree for resolved=False, failure clustering by the Task-1 taxonomy, and the correlation reality: local screens mis-rank hidden scores (documented 28/74 local tie → 0.17 vs 0.10 hidden; identical-zip 0.24→0.17 reruns), so calibrate with gold/empty baselines, masked denominators (68 valid), paired repeats, and a noise floor (~0.03/4 tasks) before believing any delta. Results→action mapping ties each failure class to specific BCF levers.

**Task 5 — Robustness.** The shipped BCF handles 36/64 unique field issues structurally or via prompt, partially handles 20 (canary-gated), and is N-A-by-design for 13 (e.g., LoRA — no adapters shipped). The audit **found and fixed 2 real bugs**: a critical strike→anchors crash (the edit-loop recovery path) and an anchors-truncation defect that could cut inside verbatim edit windows. Both tracks re-mirrored byte-identical (bcf.py sha256 `33629118…`), validators 0/0, 32/32 probes pass, independently re-verified. Dominant residual: E4B's fix-authoring ceiling (syntax gates ≠ semantics) — hold the bonus slot for the C5 serving canary + replicated eval.

## Cross-references

- Shipped brain + justification: `deliverables/2026-11-11-bcf-gemma4-brain/` (README updated with the audited build hash)
- Task-1 dataset analysis: `deliverables/2026-11-11-bcf-gemma4-brain/01-task1-dataset-classification-rootcause.md`
- Fresh board intel: `input/kagglecomp/intel_20261111/` (38 threads captured 2026-11-11; zero staff posts since Nov 5)
- Research notes + drafts + probes: `scratch/bcf-hardening-2026-11-11/`; logs: `_progress/hardening-*.log`; board: [STATUS.md](STATUS.md)

## Immediate next actions (from the deliverables)

1. Run the C0 compiler canary + C1 engine battery (CPU, today) — 02 Part C / 05 canary checklist.
2. Bring up the rig per 03 (WSL#40401 probe → Zorin fallback); run the KV-fit probe before trusting 32k context.
3. Freeze the masked-68 valid set + dev30 subset (04 calibration protocol); start the hypothesis ledger.
4. Apply the quick-win levers (02 Part B): planner thinking config, temp-0 arm pre-registration, 3,000-char statement arm, SKILL.md description trim.
5. Hold the E4B bonus slot until C5 + replicated C6 show a non-zero resolve rate (05 residual risks).
