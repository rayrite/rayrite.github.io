# Batonic Coding Framework (`BCF`) — Wall-Clock Bottlenecks, Brain Tuning Levers, Scorer Hardening & Priority ROI Roadmap

> **Competition**: [Kaggle Google Gemma 4 Good — Developer Agent Challenge](https://www.kaggle.com/competitions/gemma-4-developer-agent/data)  
> **Local Workstation**: PowerSpec G914 — AMD Ryzen 9 9950X3D (24 WSL threads), 64 GB DDR5, **NVIDIA GeForce RTX 5090 (32 GB GDDR7, 1,792 GB/s)**, WSL2 Ubuntu 24.04  
> **Remote Scorer**: **4× NVIDIA L4 GPUs (96 GB GDDR6, 300 GB/s/card, PCIe Gen 4 TP=4)** + Docker `swebench-sandbox:latest` (`2 vCPUs / 4 GiB RAM`)  
> **Date Prepared**: `2026-11-26`

---

## Deliverables Manifest

| # | File / Folder | Scope & Competition Requirement Addressed |
| ---: | :--- | :--- |
| 1 | `01_Wall_Clock_Bottlenecks_RTX5090_and_Kaggle_Scorer.md` | **Task 1**: End-to-end wall-clock bottleneck map across WSL2 I/O, RTX 5090 Blackwell `sm_120` vLLM serving, `swegemma` dual-container setup, ADK `LlmEventSummarizer` compaction stalls, and Kaggle 4× L4 queue/PCIe/scorer stages. |
| 2 | `02_BCF_Brain_Tuning_Levers_and_Fast_Iteration_Loop.md` | **Tasks 2 & 3**: Exhaustive catalog of every tunable juncture in BCF (`YAML`, prompts, `bcf.py` AST/spec/patch/verify, vLLM runtime) + a **4-Tier Sub-Minute-to-30-Minute Feedback Loop** (offline replay, persistent vLLM daemon, stratified Canary-12/Dev-30 panels, McNemar/SPRT stopping rules). |
| 3 | `03_Competitor_Submission_Issues_and_BCF_v21_Hardening_Audit.md` | **Task 4**: Audit of all 18 submission/queue/scorer failures reported on the Kaggle forum through Nov 2026 + live **BCF v2.1 hardening upgrades** applied directly to `deliverables/2026-11-25_BCF_Dataset_RCA_and_DualTrack_Brain/`. |
| 4 | `04_Impact_Effort_ROI_Analysis_and_Priority_Roadmap.md` | **Task 5**: Quantified Impact-Effort ROI matrix (`Expected LB Gain / Engineering Hour`), exact parameter values, and prioritized execution roadmap up to the `2026-12-02 23:59 UTC` deadline. |
| 5 | `05_Quality_Assurance_and_Markdown_Table_Audit.md` | **Quality Check**: Regression verification of BCF v2.1 (`11/11` tests), static zip validation (`submission_31b.zip` & `submission_e4b.zip`), and strict GFM Markdown table audit (`0` formatting defects). |
| 6 | `fast_eval_panels/` | Pre-computed, zero-skip stratified task lists (`canary_12_gradable.txt`, `dev_30_gradable.txt`, `full_clean_gradable.txt`) ready for `40_local_eval.py` on the RTX 5090. |
