# Executive Briefing & Roadmap: BCF Developer Agent Deployment
**Target Competition:** [Google - The Gemma 4 Developer Agent Competition (Kaggle)](https://www.kaggle.com/competitions/gemma-4-developer-agent/overview)  
**Deliverable Version:** 2.0.0 (Tailored Hardware Edition)  
**Date of Record:** October 13, 2026  
**Target Rig:** PowerSpec G914 Gaming PC (AMD Ryzen 9 9950X3D | MSI MAG X870E Tomahawk WiFi | 64GB DDR5-6000 | MSI Ventus 3X OC RTX 5090 32GB GDDR7 | 2TB NVMe SSD | Windows 11 Pro)  
**Agent Architecture:** BCF (Branch-Check-Fix / Behavior-Context-Feedback) Coding Agent on Google Agent Development Kit (ADK)

---

## 1. Executive Summary

This briefing provides the strategic foundation, hardware-tailored configuration, and end-to-end execution roadmap for deploying, evaluating, submitting, and fine-tuning your new **BCF (Branch-Check-Fix / Behavior-Context-Feedback) Coding Agent** in **Google's Gemma 4 Developer Agent Competition** hosted on Kaggle.

Your specific machine—the **PowerSpec G914**—is an elite workstation tailored for large-scale AI agent simulation and local post-training. With an **AMD Ryzen 9 9950X3D** (16 cores / 32 threads with 3D V-Cache), **64GB DDR5-6000 RAM**, and an **MSI Ventus 3X OC NVIDIA GeForce RTX 5090 with 32GB of high-speed GDDR7 VRAM** on an **MSI MAG X870E Tomahawk WiFi** motherboard, your local system surpasses typical cloud developer instances.

Specifically, the competition's primary target model—**`gemma-4-31b-it-qat-w4a16-ct`**—occupies approximately 18–20 GB of VRAM. On your 32GB RTX 5090, this model fits **100% into VRAM with over 12 GB of unconstrained headroom** for large KV-cache context expansion (up to 32k/64k tokens) and local multi-turn agent simulation. Furthermore, your 32GB VRAM allows you to execute **on-device 4-bit QLoRA fine-tuning** using Unsloth directly on your PC without relying on expensive cloud GPUs.

```
+---------------------------------------------------------------------------------------------------+
|                        POWERSPEC G914 WORKSTATION -> BCF COMPETITION ROADMAP                      |
+---------------------------------------------------------------------------------------------------+
|  [Hardware Tuning] MSI Click BIOS X (SVM Mode, AMD IOMMU, EXPO DDR5-6000, Re-Size BAR)            |
|      |                                                                                            |
|      v                                                                                            |
|  [Phase 1] Machine & Subsystem Provisioning (Win 11 Pro + WSL2 Ubuntu 24.04 + RTX 5090 Blackwell) |
|      * .wslconfig tuned for 64GB RAM (memory=48GB, processors=28 vCPUs, swap=32GB NVMe)          |
|      |                                                                                            |
|      v                                                                                            |
|  [Phase 2] Python & Harness Toolchain (`uv` + PyTorch Blackwell + vLLM + `google-adk` + `swegemma`)|
|      * Direct Blackwell CUDA passthrough + 129 `tasks.jsonl` development benchmarks cached         |
|      |                                                                                            |
|      v                                                                                            |
|  [Phase 3] BCF Declarative Agent Wiring (`agent.yaml` + System Prompts + AST Graph Tools)         |
|      * Strict ADK schema compilation validated via `validate_submission.py`                       |
|      |                                                                                            |
|      v                                                                                            |
|  [Phase 4] Local Dry-Run Simulation (Multi-turn Docker SWE Sandboxing + `submit_patch` checks)     |
|      * Zero-OOM local execution utilizing 32GB GDDR7 VRAM for ultra-fast local inference          |
|      |                                                                                            |
|      v                                                                                            |
|  [Phase 5] Package Pre-Flight & Kaggle Submission (`submission.zip` via Kaggle CLI)               |
|      * Validated zip bundle pushed directly to Kaggle API gateway                                 |
|      |                                                                                            |
|      v                                                                                            |
|  [Phase 6] Score Retrieval & Diagnostic Trajectory Auditing (Leaderboard Baseline Score Locked)   |
|      * Public test set evaluation result logged; failure modes cataloged for fine-tuning          |
|      |                                                                                            |
|      v                                                                                            |
|  [Phase 7] On-Device BCF Fine-Tuning Loop (Unsloth QLoRA on RTX 5090 -> Gen-2 Model Submission)   |
|      * Train 31B LoRA adapter locally on harvested trajectories; bundle into `submission_v2.zip`  |
+---------------------------------------------------------------------------------------------------+
```

---

## 2. Hardware Allocation Matrix: PowerSpec G914 Optimization

The table below outlines how each hardware component of your PowerSpec G914 is allocated between the Windows 11 host and the WSL2 AI development environment:

| Hardware Component | Hardware Specification | Host Windows 11 Allocation | WSL2 Ubuntu 24.04 Allocation | Role in BCF Coding Agent Workflow |
| :--- | :--- | :--- | :--- | :--- |
| **Processor (CPU)** | AMD Ryzen 9 9950X3D (16 Cores / 32 Threads, Zen 5, 4.3–5.7 GHz) | 4 logical threads reserved for Windows OS responsiveness | **28 vCPUs** assigned via `.wslconfig` | Parallel code search, AST graph building, and multi-worker Docker evaluation sandboxes. |
| **System Memory** | 64GB DDR5-6000 (Dual Channel) | 16GB RAM for host OS, IDE, and browser | **48GB RAM** dedicated to WSL2 Linux | Loading full Python AST graphs, running test suites, and caching dataset embeddings. |
| **Graphics Card** | MSI Ventus 3X OC RTX 5090 (32GB GDDR7 VRAM, Blackwell Architecture) | Display output & Windows desktop rendering | **Full Direct GPU Passthrough** via host display driver (570.x+) | 100% VRAM residency for `gemma-4-31b-it-qat-w4a16-ct` (~19GB) + 13GB KV-cache/LoRA buffer. |
| **Motherboard** | MSI MAG X870E Tomahawk WiFi (AM5, PCIe 5.0) | Motherboard chipset drivers & audio | Hardware virtualization (SVM, IOMMU) enabled in BIOS | Re-Size BAR & EXPO DDR5-6000 maximize PCIe throughput between CPU and RTX 5090. |
| **Storage (SSD)** | 2TB NVMe PCIe 4.0/5.0 SSD | Host OS `C:\` partition & Docker desktop files | High-speed Linux root filesystem (`ext4.vhdx`) + 32GB swapfile | Near-instant model weights loading, rapid container spins, and fast git diffing. |
| **Networking** | Realtek 5GbE LAN & WiFi 7 (802.11be) | High-speed fiber/gigabit Internet connection | Mirrored / bridged network connection | Rapid downloading of competition models, datasets, and Kaggle API submissions. |
| **Operating System** | Windows 11 Pro 64-bit | Virtual Machine Platform & Hyper-V Hypervisor | Ubuntu 24.04 LTS (Kernel >= 6.6) | Native POSIX environment for Python `pytest`, git patches, and Docker isolation. |

---

## 3. Core Competition Parameters at a Glance

| Parameter | Official Competition Specification | BCF Implementation on PowerSpec G914 |
| :--- | :--- | :--- |
| **Competition Name** | Google - The Gemma 4 Developer Agent Competition | Kaggle Competition Slug: `gemma-4-developer-agent` |
| **Submission Deadline** | November 25, 2026 | Initial baseline score achieved in Phase 5–6; fine-tuning iterations through November |
| **Official Tracks** | 1. Main Prediction Track (Ranked by bugs fixed)<br>2. Paper Track (Kaggle Writeup / arXiv PDF) | Track 1 active leaderboard submission; Track 2 writeup prepared from BCF ablations |
| **Submission Package** | Single compressed `submission.zip` | Root `agent.yaml` + system prompts + configs + optional LoRA weights |
| **Execution Entrypoint** | Declarative YAML compilation via `compile_submission` | Strictly NO `agent.py` script; declared against closed host registries |
| **Primary Base Model** | `gemma-4-31b-it-qat-w4a16-ct` (Quantization-Aware Trained, W4A16, compressed-tensors) | Hosted locally via vLLM on RTX 5090 (32GB VRAM); pre-registered alias used in evaluation |
| **Evaluation Sandbox** | Offline Linux container in `/workspace` with Git repository at base commit | WSL2 Ubuntu 24.04 + Docker Desktop sandbox locally to mirror Kaggle environment |
| **Compute Constraints** | ~12-Hour Global Timeout; per-task timeout and turn limits | BCF token budgeting & turn counters configured in `eval_config.yaml` / `agent.yaml` |
| **Leaderboard Metric** | Total count & percentage of resolved software bug benchmarks | Automated pass/fail verification against hidden unit test patches (`test_patch`) |

---

## 4. Deliverable Suite Directory Structure

All detailed operational guides have been compiled and tailored specifically for your PowerSpec G914 in the deliverables repository:

```text
deliverables/2026-10-13-gemma-4-bcf-developer-agent-setup/
├── 00-executive-overview-and-roadmap.md             <-- [This Document] Strategic overview & G914 allocation
├── 01-competition-brief-and-agent-architecture.md   <-- In-depth competition rules, harness & BCF design
├── 02-windows-11-toolchain-and-installation-guide.md <-- G914 MSI BIOS & step-by-step installation instructions
├── 03-end-to-end-deployment-plan-and-milestone-checklists.md <-- 7-phase deployment plan & acceptance checklists
├── 04-bcf-agent-code-templates-and-fine-tuning-recipes.md    <-- RTX 5090 vLLM config, agent YAML & Unsloth training
├── 05-zorin-os-18-dual-boot-and-claude-developer-setup.md    <-- Zorin OS 18.1 dual boot, Claude Code CLI & VS Code
└── 06-zorin-os-kaggle-competition-toolchain-and-delta-analysis.md <-- Native Linux competition toolchain & delta analysis
```
