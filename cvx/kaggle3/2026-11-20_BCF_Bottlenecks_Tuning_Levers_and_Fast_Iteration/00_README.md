# BCF Wall-Clock Bottlenecks, Brain Tuning Levers & Fast Iteration Playbook (2026-11-20)

*Research & engineering deliverable suite for the Kaggle Google Gemma 4 Developer Agent Competition — covering the local RTX 5090 test harness (PowerSpec G914: Ryzen 9 9950X3D, 64 GB RAM, RTX 5090 32 GB, WSL2 Ubuntu 24.04), the Kaggle 4x L4 remote submission pipeline, and the current dual-track **Batonic Coding Framework (BCF)** brain (`deliverables/2026-11-20_BCF_Gemma4_Winning_Design/`).*

*As of: **2026-11-20** (5.5 days to the `2026-11-25 23:59 UTC` notebook-publishing deadline; 12.5 days / ~10–12 remote submission cycles remaining before the `2026-12-02 23:59 UTC` final deadline).*

---

## Deliverable Inventory

| File | Scope & Task Coverage | Key Contents |
| :--- | :--- | :--- |
| `00_README.md` | **Executive Index & Synthesis** | Top-line findings across Tasks 1–3, remaining competition calendar math, and verification commands. |
| `01_Wall_Clock_Bottlenecks_Local_RTX5090_and_Kaggle_Remote.md` | **Task 1 — End-to-End Wall-Clock Bottleneck Audit** | Full process maps (Mermaid), **8 local RTX 5090 harness bottlenecks (`L1–L8`)**, **9 Kaggle remote 4x L4 bottlenecks (`K1–K9`)**, hardware physics (`RTX 5090` vs `4x L4`), quantitative wall-clock tables, and grounded official docs + competition telemetry. |
| `02_BCF_Brain_Tuning_Levers_and_Impact_Effort_Ranking.md` | **Task 2 — BCF Brain Tuning Levers & Impact-Effort Ranking** | Complete map of **24 concrete tuning levers** across all 7 architectural layers of the current BCF brain (exact file paths and line ranges in `submission_31b/` and `submission_e4b/`), quantitative Impact-Effort scoring, ranked priority matrix (`#1–#24`), 31B vs. E4B track splits, and open uncertainties. |
| `03_Fast_Iteration_and_Rapid_Feedback_Loop_Playbook.md` | **Task 3 — Rapid Iteration & High-Signal Feedback Loop Playbook** | Concrete local 5x–12x acceleration blueprint (persistent vLLM, FP8 KV concurrency, decoupled GPU/CPU pipeline, `tmpfs` sandboxes), **5-Tier Multi-Fidelity Testing Pyramid** (2-second 0-GPU tests -> trajectory step-forking -> paired McNemar valid-set runs -> 4x L4 calibration), variance-control math, and the Nov 20 -> Dec 2 remote slot schedule. |

---

## Executive Highlights Across Tasks 1–3

| Dimension | Critical Finding | Immediate Actionable Takeaway |
| :--- | :--- | :--- |
| **Biggest Local Bottleneck (`L1 + L2 + L5`)** | `40_local_eval.py` cold-boots/tears down vLLM on every run (2–5 min), executes tasks strictly serially (`concurrency=1`) while leaving the RTX 5090 idle during Container A setup and CPU-bound Phase 2 `pytest`, and wastes 43–47% of full-129 runs (15% even in `dry_run_tasks_20.txt`) on ungradable missing-wheel/network tasks. | Decouple a **persistent vLLM server** (`VLLM_CACHE_ROOT` + FP8 KV cache + `concurrency=2–3` on 31B / `4–8` on E4B), offload Phase 2 `pytest` onto a parallel Ryzen 9950X3D CPU worker pool using `tmpfs`, and run strictly on valid/gradable stratified task panels (**5x–12x local speedup**). |
| **Biggest Remote Bottleneck (`K1 + K2 + K4 + K9`)** | Kaggle remote turnaround is **20–24 hours** (~8–9h queue + ~9–10h sequential 4x L4 eval + ~2–2.5h scoring) under a **1-pending-submission lock**, a **~17.25 tok/s** PCIe TP=4 decode ceiling, an all-or-zero **12h kill cliff**, and **±5.2-task** single-run LB noise (`sigma ≈ 1.5–2.0` tasks on 58 public tasks). | **Never use Kaggle LB as an iteration loop.** Treat the ~10–12 remaining remote slots strictly as gated promotion checks (`project_12h.py` GREEN <= 11.0h at `k=1.7`), and run a Day-1 **Canary Gate `G-SK`** to verify `skills/bcf-spec` live on the hidden scorer. |
| **Highest-ROI BCF Brain Levers (Top 5)** | Exact code inspection of `bcf.py` and the YAML/prompt stack revealed high-leverage, low-effort wins: **(1)** `SequentialAgent` + `skills/bcf-spec` vs. Monolithic Canary Gate (`T1`), **(2)** `bcf_plan` + `solver` `thinking_budget` & zero-echo optimization (`G1`, `T2`), **(3)** removing `bcf.py`'s `raw[:24000]` BM25 cutoff that blinds **38.8% (50/129)** of patch sites + caching the AST index (`C1`), **(4)** multi-hunk atomic patching (`55.0%` of tasks need >=2 hunks) + retry dedupe (`E1`, `E4`), and **(5)** exact submodule import + before/after delta checks in `bcf.py verify` + visible-text state paraphrasing (`E2`, `P1`). | Execute the **Top 8 Quick Wins (Q1)** locally in 48 hours using the 5-Tier Pyramid before spending remote slots; hold any LoRA adapter behind a strict fixed-wall-clock parity gate because LoRA costs **10–25% TPS** (`-7` tasks even with zero weights in `#760309`). |

---

## Remaining Competition Clock (As of 2026-11-20)

| Milestone | Timestamp (UTC) | Remaining Window | Operational Impact on BCF |
| :--- | :--- | :--- | :--- |
| **Today (Baseline)** | `2026-11-20 10:17 UTC` | `0 days` | Local RTX 5090 harness optimization + Day-1 Canary Gate `G-SK` (`submission_31b.zip`). |
| **Notebook Publishing Lock** | `2026-11-25 23:59 UTC` | `~5.5 days` (`~4–5 remote slots`) | `kernelsPublishingDisabledDeadline` — ensure submission notebooks exist and are validated cleanly before Nov 25 (`#759388`). |
| **Final Submission Deadline** | `2026-12-02 23:59 UTC` | `~12.5 days` (`~10–12 remote slots`) | Select **2 final submissions**: Slot 1 = best **31B** (Main \$65,000), Slot 2 = best **E4B** (Small-Model Bonus \$10,000). Both must clear `<12h` with `>= 45–60 min` worst-case buffer. |

---

## Markdown Table Quality Check Command

All deliverables in this folder were verified programmatically with zero formatting or alignment defects:

```bash
python scratch/validate_md_tables.py \
  deliverables/2026-11-20_BCF_Bottlenecks_Tuning_Levers_and_Fast_Iteration/00_README.md \
  deliverables/2026-11-20_BCF_Bottlenecks_Tuning_Levers_and_Fast_Iteration/01_Wall_Clock_Bottlenecks_Local_RTX5090_and_Kaggle_Remote.md \
  deliverables/2026-11-20_BCF_Bottlenecks_Tuning_Levers_and_Fast_Iteration/02_BCF_Brain_Tuning_Levers_and_Impact_Effort_Ranking.md \
  deliverables/2026-11-20_BCF_Bottlenecks_Tuning_Levers_and_Fast_Iteration/03_Fast_Iteration_and_Rapid_Feedback_Loop_Playbook.md
```
