# BCF Deep Research Package: Python 3.13 Traps, Bottlenecks & Tuning, RTX 5090 Parity, Local Evaluation, and Community Submission Audit

> **Date:** `2026-11-20`
> **Target Systems Audited:** Full 129-task Kaggle *Gemma 4 Developer Agent* public problem set (`01_Dataset_Classification_and_Root_Cause_Analysis.md` + `tasks.jsonl`) and both Batonic Coding Framework (BCF) tracks (`deliverables/2026-11-20_BCF_Gemma4_Winning_Design/submission_31b/` and `submission_e4b/`).
> **Hardware & Target Parity:** Local **PowerSpec G914** (`Ryzen 9 9950X3D`, `MSI MAG X870E TOMAHAWK WIFI`, `64 GB DDR5`, `RTX 5090 32 GB sm_120`) vs. Kaggle **4× NVIDIA L4 (`96 GB`, `vLLM 0.19.1`, `Python 3.13` sandbox / `Python 3.12` host, `ADK 1.36.1`)**.

---

> [!CAUTION]
> **PRE-SUBMISSION P0 ALERT (Discovered in Task 5 Audit):** Do **NOT** upload `submission_31b.zip` or `submission_e4b.zip` from `deliverables/2026-11-20_BCF_Gemma4_Winning_Design/` until applying the **P0 fixes in Task 5**. All four prompt/`SKILL.md` files pass **`script_path`** instead of ADK 1.36.1's required **`file_path`** parameter to `run_skill_script` (`100%` `INVALID_ARGUMENTS` failure), while `skills: [skills/bcf-spec]` still leaves `args: list[str]` / `positional_args: list[str]` registered in `bcf_plan`'s JSON tool schema (residual vLLM 0.19.1 `_parse_gemma4_array` OOM freeze exposure across `41/129` `]`-containing prompts + hidden-scorer skill container isolation risk). Exact copy-paste patches and a ready-to-deploy **Zero-Skill Monolithic BCF** blueprint are provided in [05_Task5_Community_Submission_Issues_and_BCF_Graceful_Handling_Audit.md](./05_Task5_Community_Submission_Issues_and_BCF_Graceful_Handling_Audit.md).

---

## Deliverable Index (All 5 Research Tasks Clearly Demarcated)

| Task | Deliverable File | Core Research Scope | Headline Findings |
| :---: | :--- | :--- | :--- |
| **Task 1** | [01_Task1_Python313_Exception_Traps_and_PostMortem_Guide.md](./01_Task1_Python313_Exception_Traps_and_PostMortem_Guide.md) | Official Python 3.13 exception semantics, traps, gotchas, and post-mortem debugging playbooks across all error families in the 129-task problem set | Audits all 10 major error families (`TypeError`, `AttributeError`, `NameError`, `ValueError`, `BrokenPipeError`/`SystemExit`, `StopIteration`, `FrozenInstanceError`, `ExceptionGroup`/`CancelledError`, `DeprecationWarning`/Pydantic/FastAPI, `NetrcParseError`/`JSONDecodeError`), Python 3.13 specifics (PEP 667 `locals()`, `ssl.VERIFY_X509_STRICT`, PEP 594 removals, colorized tracebacks), and stdlib post-mortem tools (`faulthandler`, `traceback`, `sys.excepthook`) |
| **Task 2** | [02_Task2_WallClock_Bottlenecks_Tuning_Levers_and_Fast_Iteration.md](./02_Task2_WallClock_Bottlenecks_Tuning_Levers_and_Fast_Iteration.md) | **(2a)** Local RTX 5090 & remote Kaggle 4× L4 wall-clock bottlenecks; **(2b)** Ranked Impact-Effort BCF tuning lever analysis; **(2c)** Fast hypothesis-testing & feedback-loop architecture | Maps every bottleneck across host/vLLM/Container A/Container B/Kaggle queue; ranks **16 BCF tuning levers** (Tier 1 Quick Wins led by P0 `file_path`/Monolithic de-risk, `8192 -> 4096` HTTP 400 fix, prose-bound `run_command`, `write_file` ban, full-file BM25, multi-hunk patcher); defines a 4-tier fast feedback loop (`<30s` static/fake-LLM -> `10m` `smoke_12` -> `30m` `dev_tune_30` -> `holdout_rich`) |
| **Task 3** | [03_Task3_PowerSpec_G914_RTX5090_Feature_Parity_WSL2_and_Zorin18.md](./03_Task3_PowerSpec_G914_RTX5090_Feature_Parity_WSL2_and_Zorin18.md) | Feature-parity engineering plans for **PowerSpec G914 (RTX 5090)** across **Track A (Windows 11 + WSL2)** and **Track B (Zorin OS 18 Linux)** | Pinpoints exact G914 Blackwell/X870E hardware requirements (`nvidia-open` R570+, `cu128`, `TORCH_CUDA_ARCH_LIST="12.0"`, WSL `>= 2.7.0` CUDA graph fix, Zorin 18 Kernel 6.14/6.17 + RTL8126/QCNCM865 notes), exact Kaggle Container A/B parity (`network_mode="none"`, `4g` RAM, `2 vCPUs`, `PYTHONSAFEPATH=1`, `compaction_interval=15`, C2–C4 Docker repairs lifting gradable tasks from `52 -> 115+`), and side-by-side Track A vs. Track B decision matrix |
| **Task 4** | [04_Task4_Local_Evaluation_LB_Correlation_and_BCF_Tuning_Guide.md](./04_Task4_Local_Evaluation_LB_Correlation_and_BCF_Tuning_Guide.md) | Local scoring user guide, Local-to-Kaggle LB correlation (`N = 58`), statistical noise analysis, and closed-loop BCF tuning SOP | Provides Gold+Empty calibration gate (`valid_tasks_local.txt`), `R_win(k = 1.7)` time-windowed scoring, 10-metric mechanistic diagnostic scorecard, mathematically exact `N = 58` truncation lookup table & true unreachable score holes (correcting an older Nov 5 digest error), quantitative `holdout_rich -> LB` translator, 15-minute post-run triage SOP, and 12-row Failure-Signature-to-BCF-Edit matrix |
| **Task 5** | [05_Task5_Community_Submission_Issues_and_BCF_Graceful_Handling_Audit.md](./05_Task5_Community_Submission_Issues_and_BCF_Graceful_Handling_Audit.md) | Census of all 22 Kaggle community submission/scoring issues (`#743063`–`#760595` + `input/kagglecomp/`) & line-by-line audit of current BCF implementations | Audits all 22 issues (`14 HANDLED`, `5 PARTIAL/RISK`, `3 UNHANDLED/BROKEN`); uncovers P0 `script_path -> file_path` bug, residual `skills:` array-arg/isolation risk, 31B `8192` HTTP 400 overflow, fenced bash blocks (31% malformed tool calls), exposed `write_file`, and `bcf.py` truncation/multi-hunk gaps; delivers exact copy-paste remediation diffs and Zero-Skill Monolithic blueprint |

---

## Cross-Task Strategic Priorities (Action Plan Before `2026-11-25` / `2026-12-02`)

1. **Patch P0/P1 Blockers First (Task 5 + Task 2b):** Apply `script_path -> file_path`, cut 31B `solver.yaml` `max_output_tokens` `8192 -> 4096`, raise E4B/31B `bcf_plan` `max_output_tokens` to `2048`/`3072`, strip fenced `bash` blocks, remove `write_file`, and build the **Zero-Skill Monolithic BCF** track alongside hardened BCF-Skill.
2. **Stand Up Calibrated Local Parity (Task 3 + Task 4):** Lock in `compaction_interval=15`, `max_model_len=32768`, Docker C2–C4 repairs, and `valid_tasks_local.txt` (`E ≈ 115–118`) on PowerSpec G914 (Track A WSL2 `>= 2.7.0` for fastest zero-reboot start; Track B Zorin OS 18 for maximum sustained Docker/vLLM throughput).
3. **Run Fast Single-Lever Iterations on `dev_tune_30`, Gate Strictly on `holdout_rich` (Task 2c + Task 4):** Target `R_holdout_win(1.7) >= 32%` (31B) and `>= 19%` (E4B) with `H_120(1.7) <= 11.0 h` (`GREEN`) across 3-run local averages to break cleanly past the current `0.24` (31B) and `0.12` (E4B) tie walls before the final deadline.

---

## Quality Assurance Record

- All 6 Markdown deliverables in this folder were programmatically audited with `validate_md_tables.py` for: uniform column counts across headers/separators/rows, valid GFM alignment separators, mandatory blank lines before and after every table, fenced code block closure parity, and zero unescaped currency `$` triggers in prose.
- Intermediate dataset audit script and JSON artifacts are preserved in the session scratch directory (`scratch/2026-11-20_deep_audit/`).
