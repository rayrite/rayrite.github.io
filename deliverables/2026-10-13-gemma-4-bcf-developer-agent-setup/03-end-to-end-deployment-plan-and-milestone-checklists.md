# End-to-End Deployment Plan & Milestone Checklists
**Target Competition:** [Google - The Gemma 4 Developer Agent Competition](https://www.kaggle.com/competitions/gemma-4-developer-agent/overview)  
**Deliverable File:** `03-end-to-end-deployment-plan-and-milestone-checklists.md`  
**Date of Record:** October 13, 2026  
**Target Rig:** PowerSpec G914 Gaming PC (AMD Ryzen 9 9950X3D | MSI MAG X870E Tomahawk WiFi | 64GB DDR5-6000 | MSI Ventus 3X OC RTX 5090 32GB GDDR7 | 2TB NVMe SSD | Windows 11 Pro)  
**Status:** Operational Execution Roadmap & Quality Gate Manual  

---

## 1. Lifecycle Roadmap Overview

This deployment plan outlines the step-by-step path from unboxing your **PowerSpec G914 Gaming PC** to submitting the first test run of your **BCF Coding Agent**, obtaining your initial public leaderboard evaluation score, and initiating the on-device fine-tuning loop on your 32GB RTX 5090.

```
+---------------------------------------------------------------------------------------------------+
|                        POWERSPEC G914: BCF AGENT DEPLOYMENT LIFECYCLE ROADMAP                     |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|  [PHASE 1] Hardware & Subsystem Foundation   ======>   [MILESTONE 1: OS & GPU Gate Passed]       |
|      * MSI Click BIOS X (SVM, EXPO, Re-Size BAR),       * `nvidia-smi` reports RTX 5090 (32GB)    |
|        WSL2 Ubuntu 24.04 (48GB RAM, 28 vCPUs)           * Docker daemon running with WSL bridge   |
|                                                                                                   |
|  [PHASE 2] Python & Competition Harness Ingestion ==> [MILESTONE 2: Tooling & Data Gate Passed]   |
|      * `uv` Python 3.11, PyTorch Blackwell CUDA 12.6,   * `google-adk` & `swegemma` functional    |
|        `google-adk`, `swegemma`, `tasks.jsonl`          * 129 development tasks cached on NVMe    |
|                                                                                                   |
|  [PHASE 3] BCF Declarative Configuration     ======>   [MILESTONE 3: Declarative Compiler Gate]   |
|      * `agent.yaml`, modular system prompts,            * `compile_submission()` returns valid    |
|        tool bindings, sampling configs                    `BaseAgent` tree without errors         |
|                                                                                                   |
|  [PHASE 4] Local Dry-Run Simulation on RTX 5090 ====> [MILESTONE 4: Simulation Gate Passed]      |
|      * Run sample task in Docker sandbox,               * Clean reproduction -> surgical patch -> |
|        verify BCF loop & `submit_patch` call              unified diff verified via `pytest`      |
|                                                                                                   |
|  [PHASE 5] Submission Packaging & Kaggle Upload ===>   [MILESTONE 5: Kaggle Pipeline Gate]        |
|      * Bundle `submission.zip` (root `agent.yaml`),     * CLI submission accepted with message    |
|        validate file limits, push via Kaggle CLI          "Successfully submitted"                |
|                                                                                                   |
|  [PHASE 6] Score Retrieval & Log Diagnostics ======>   [MILESTONE 6: First Score Gate Passed]     |
|      * Monitor Kaggle scoring container,                * Official public score posted on         |
|        extract execution logs, audit error traces         leaderboard; initial baseline locked    |
|                                                                                                   |
|  [PHASE 7] On-Device Fine-Tuning Loop on RTX 5090 ==>  [MILESTONE 7: Fine-Tuning Gate Passed]     |
|      * Harvest failure trajectories, train Gemma 4      * 31B LoRA adapter packaged into zip      |
|        with Unsloth QLoRA on 32GB GDDR7 VRAM              yielding higher bug-fix rate            |
|                                                                                                   |
+---------------------------------------------------------------------------------------------------+
```

---

## 2. Phase 1: Hardware & Subsystem Foundation (PowerSpec G914)

### Objective
Configure the MSI MAG X870E Tomahawk motherboard BIOS, provision Windows 11 Pro virtualization features, allocate high-performance resources (48GB RAM, 28 vCPUs) to WSL2 Ubuntu 24.04 LTS, and establish direct NVIDIA RTX 5090 Blackwell GPU passthrough.

### Task Breakdown
1. **Task 1.1 (MSI Click BIOS X Configuration):**
   * Boot PowerSpec G914 and tap `DEL` to enter BIOS. Press `F7` for Advanced Mode.
   * Go to **OC** -> **DRAM Setting** -> set **EXPO** to `[Profile 1]` (enables full 6000 MHz speed for 64GB DDR5).
   * Go to **OC** -> **CPU Features** -> set **SVM Mode** to `[Enabled]`.
   * Go to **Settings** -> **Advanced** -> **PCIe/PCI Sub-system Settings** -> set **Above 4G Decoding** to `[Enabled]`, **Re-Size BAR Support** to `[Enabled]`, and **AMD IOMMU** to `[Enabled]`.
   * Press `F10` to save and reboot.
2. **Task 1.2:** In Windows 11 Pro Administrator PowerShell, enable `VirtualMachinePlatform` and `Microsoft-Windows-Subsystem-Linux`, and run `wsl --update`.
3. **Task 1.3:** Download and install the latest NVIDIA Blackwell display driver (Version 572.x+ or 570.x+) for RTX 5090.
4. **Task 1.4:** Install Ubuntu 24.04 LTS via `wsl --install -d Ubuntu-24.04` and configure Linux user credentials.
5. **Task 1.5:** Create `%USERPROFILE%\.wslconfig` configured specifically for the G914:
   ```ini
   [wsl2]
   memory=48GB
   processors=28
   swap=32GB
   swapFile=C:\\temp\\wsl-swap.vhdx
   localhostForwarding=true
   [experimental]
   autoMemoryReclaim=gradual
   sparseVhd=true
   ```
6. **Task 1.6:** Install Windows Terminal, Git for Windows (configured with `core.autocrlf input`), and Docker Desktop with WSL2 Ubuntu-24.04 integration enabled.

### Milestone 1 Acceptance Checklist
- [ ] Running `wsl -l -v` in PowerShell shows `Ubuntu-24.04` running as **Version 2**.
- [ ] Running `nvidia-smi` inside WSL2 bash prints:
  `NVIDIA GeForce RTX 5090 | 32768 MiB VRAM | Driver: 57x.xx | CUDA: 12.6+`.
- [ ] Running `lscpu | grep "CPU(s):"` inside WSL2 reports `28` vCPUs.
- [ ] Running `free -h` inside WSL2 reports approximately `47G` or `48G` available memory.
- [ ] Running `docker run --rm hello-world` inside WSL2 bash prints `"Hello from Docker!"`.
- [ ] Running `git config --global core.autocrlf` prints `input`.

---

## 3. Phase 2: Python Tooling, ADK & Harness Ingestion

### Objective
Install high-speed Python tooling (`uv`), provision a clean Python 3.11 virtual environment, install PyTorch with CUDA 12.6+ (Blackwell acceleration), install Google ADK (`google-adk`), `swegemma`, and download the 129 competition tasks (`tasks.jsonl`).

### Task Breakdown
1. **Task 2.1:** Inside WSL2 Ubuntu, install system build tools (`build-essential`, `cmake`, `git-lfs`, `jq`, `ripgrep`, `zip`).
2. **Task 2.2:** Install Astral's `uv` package manager (`curl -LsSf https://astral.sh/uv/install.sh | sh`).
3. **Task 2.3:** Provision hermetic Python 3.11 virtual environment at `~/bcf_workspace/.venv` and activate it.
4. **Task 2.4:** Install PyTorch 2.4+ / CUDA 12.6+ for RTX 5090:
   ```bash
   uv pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu126
   ```
5. **Task 2.5:** Install Google Agent Development Kit (`uv pip install google-adk`).
6. **Task 2.6:** Install `adk-submission`, `swegemma`, and `adk-eval-core`.
7. **Task 2.7:** Set up Kaggle API token (`~/.kaggle/kaggle.json` with `chmod 600`) and download the competition development dataset (`kaggle competitions download -c gemma-4-developer-agent`).
8. **Task 2.8:** Extract dataset into `~/bcf_workspace/data/` on the fast 2TB NVMe SSD and verify `tasks.jsonl`.

### Milestone 2 Acceptance Checklist
- [ ] Running `python3 -c "import torch; assert torch.cuda.is_available(); print(torch.cuda.get_device_name(0))"` prints `NVIDIA GeForce RTX 5090`.
- [ ] Running `adk --help` displays Google ADK command-line interface.
- [ ] Running `python3 -c "import swegemma, adk_submission; print('Harness OK')"` executes cleanly.
- [ ] Running `wc -l ~/bcf_workspace/data/tasks.jsonl` reports exactly 129 development tasks.

---

## 4. Phase 3: BCF Agent Declarative Wiring & Local Assembly

### Objective
Construct the declarative architecture of your BCF coding agent conforming strictly to the `agent.yaml` schema required by `compile_submission`.

### Task Breakdown
1. **Task 3.1:** Create local agent project directory at `~/bcf_workspace/bcf_agent/`.
2. **Task 3.2:** Author modular prompt files:
   * `prompts/system.md`: Injects the Branch-Check-Fix discipline, tool constraints, context slice rules, and patch submission protocol.
   * `prompts/tools_guide.md`: Guidance on using AST tools (`get_code_neighbors`, `search_similar_code`).
3. **Task 3.3:** Author `configs/sampling.yaml` with temperature (0.2), top_p (0.95), and max_tokens (4096).
4. **Task 3.4:** Create root `agent.yaml` referencing `gemma-4-31b-it-qat-w4a16-ct`, system prompt paths via `!include`, generation parameters, and tool bindings (`run_command`, `read_file`, `edit_file`, `write_file`, `get_status`, `submit_patch`, and AST graph tools).
5. **Task 3.5:** Author `validate_submission.py` to compile the local bundle against `build_submission_limits()`.

### Milestone 3 Acceptance Checklist
- [ ] `agent.yaml` exists strictly at the root of `~/bcf_workspace/bcf_agent/agent.yaml`.
- [ ] Running `python3 validate_submission.py ~/bcf_workspace/bcf_agent` executes `compile_submission` and returns `"Bundle compiled successfully into BaseAgent"`.
- [ ] No undeclared tools or unauthorized dynamic imports exist.

---

## 5. Phase 4: Local Simulation on RTX 5090 & Benchmark Dry-Run

### Objective
Execute a dry-run evaluation on 1–2 sample tasks from `tasks.jsonl` in an isolated Docker sandbox using `swegemma eval`. Your RTX 5090 with 32GB GDDR7 VRAM runs the 31B model locally with full KV-cache headroom, verifying that the BCF loop functions end-to-end and cleanly produces a non-empty patch via `submit_patch()`.

### Task Breakdown
1. **Task 4.1:** Launch local model backend via vLLM utilizing the 32GB VRAM of your RTX 5090:
   ```bash
   vllm serve google/gemma-4-31b-it-qat-w4a16-ct \
       --gpu-memory-utilization 0.90 \
       --max-model-len 16384 \
       --port 8000
   ```
2. **Task 4.2:** Filter 1 known task from `tasks.jsonl` into `~/bcf_workspace/data/sample_task.jsonl`.
3. **Task 4.3:** Execute local evaluation harness:
   ```bash
   swegemma eval \
       --tasks ~/bcf_workspace/data/sample_task.jsonl \
       --submission-dir ~/bcf_workspace/bcf_agent \
       --sandbox docker \
       --timeout 600
   ```
4. **Task 4.4:** Inspect agent execution log:
   * Did BCF search and locate the target file?
   * Did BCF create a reproduction check?
   * Did BCF edit the code?
   * Did BCF call `submit_patch()` before hitting turn limits?
5. **Task 4.5:** Verify that the resulting git diff was captured and evaluated by the test runner.

### Milestone 4 Acceptance Checklist
- [ ] vLLM reports successful model initialization on RTX 5090 with ~19GB weight residency and ~10GB KV-cache allocation.
- [ ] The Docker container mounts `/workspace` cleanly without permission errors.
- [ ] The agent executes multiple tool calls (`search_similar_code` -> `read_file` -> `edit_file` -> `run_command`).
- [ ] The agent calls `submit_patch()` terminating the loop gracefully.
- [ ] The evaluation harness generates a non-empty `prediction.patch` file.

---

## 6. Phase 5: Submission Packaging, Pre-flight Verification & Upload

### Objective
Automate the production packaging of `submission.zip`, execute pre-flight integrity audits (zip structure, file sizes, root presence of `agent.yaml`), and dispatch your first submission via the Kaggle API CLI.

### Task Breakdown
1. **Task 5.1:** Author `build_submission.py` to package `~/bcf_workspace/bcf_agent/` into `submission.zip`. Ensure files are compressed with `agent.yaml` located at the root level (no enclosing folder).
2. **Task 5.2:** Audit archive structure with `unzip -l submission.zip`.
3. **Task 5.3:** Validate that no forbidden temporary files (`.git`, `.venv`, `__pycache__`, `.DS_Store`) are included.
4. **Task 5.4:** Submit to Kaggle via command line:
   ```bash
   kaggle competitions submit \
       -c gemma-4-developer-agent \
       -f submission.zip \
       -m "BCF Agent v1.0 Baseline - PowerSpec G914 Test Run"
   ```
5. **Task 5.5:** Check submission status via Kaggle CLI:
   ```bash
   kaggle competitions submissions -c gemma-4-developer-agent
   ```

### Milestone 5 Acceptance Checklist
- [ ] Running `unzip -l submission.zip | grep agent.yaml` shows `agent.yaml` with no leading path.
- [ ] Archive size is within competition upload boundaries (< 50MB without weights).
- [ ] Kaggle CLI returns `"Successfully submitted to Google - The Gemma 4 Developer Agent Competition"`.
- [ ] Submission status shows `pending` or `running` on the Kaggle submissions dashboard.

---

## 7. Phase 6: First Score Retrieval, Log Diagnostics & Error Auditing

### Objective
Track the execution of your test run on Kaggle's scoring backend, confirm completion, obtain your first leaderboard score, and perform diagnostic log audits.

### Task Breakdown
1. **Task 6.1:** Monitor submission state using `kaggle competitions submissions -c gemma-4-developer-agent`.
2. **Task 6.2:** Once status transitions from `running` to `complete`, record your initial public leaderboard score (number and percentage of bugs fixed).
3. **Task 6.3:** Download submission evaluation logs / diagnostic output if accessible via Kaggle UI.
4. **Task 6.4:** Audit error classes:
   * **Timeout Failures:** Did tasks terminate due to 10-minute per-task limits? (Remedy: Reduce `max_turns` or speed up code search).
   * **Empty Patch Failures:** Did the agent run out of turns before calling `submit_patch()`? (Remedy: Tighten BCF early exit safeguard).
   * **Syntax / Regression Failures:** Did the patch break other tests? (Remedy: Enhance Phase 3 regression testing prompt).

### Milestone 6 Acceptance Checklist
- [ ] Submission status transitions to `complete` without throwing `Compilation Error` or `Compute Exceeded`.
- [ ] Official public leaderboard displays a numerical score for your submission.
- [ ] Baseline performance documented in your experiment tracker.

---

## 8. Phase 7: On-Device Trajectory Harvesting & Fine-Tuning Loop (RTX 5090)

### Objective
Leverage the massive 32GB GDDR7 VRAM of your RTX 5090 and 28 vCPUs of the Ryzen 9 9950X3D to run local batch evaluations, harvest multi-turn trajectories, fine-tune Gemma 4 using Unsloth QLoRA directly on your PC, package custom LoRA adapters into Gen-2 submissions, and boost your bug-fix score.

### Task Breakdown
1. **Task 7.1:** Execute the BCF agent locally across all 129 tasks in `tasks.jsonl` with trajectory logging enabled (completed in parallel using your 28 vCPUs and RTX 5090).
2. **Task 7.2:** Filter trajectories into two datasets:
   * **Successful Trajectories (Positive Pairs):** Ideal reasoning steps and tool-call sequences that resolved the issue.
   * **Failed Trajectories (Negative Pairs):** Tool calls that hallucinated commands, failed to edit files, or generated broken patches.
3. **Task 7.3:** Format trajectory data into standard ChatML / Gemma instruction format with explicit `<tool_call>` and `<thought>` blocks.
4. **Task 7.4:** Run `train_bcf_lora.py` with Unsloth on RTX 5090:
   * Train 4-bit LoRA adapter on target layers (`q_proj`, `k_proj`, `v_proj`, `o_proj`, `gate_proj`, `up_proj`, `down_proj`).
   * Hyperparameters on RTX 5090: Batch size `2`, sequence length `8192` (enabled by 32GB VRAM), learning rate `2e-4`, rank `r=16`, `lora_alpha=32`, `bf16=True`.
5. **Task 7.5:** Export trained LoRA weights into `~/bcf_workspace/bcf_agent/lora/`.
6. **Task 7.6:** Update `agent.yaml` to register the adapter directory.
7. **Task 7.7:** Package and submit `submission_v2.zip` to Kaggle, obtaining your fine-tuned leaderboard score!

### Milestone 7 Acceptance Checklist
- [ ] Unsloth training script executes completely on RTX 5090 without VRAM memory errors.
- [ ] Exported `lora/` folder contains valid `adapter_config.json` and `adapter_model.safetensors`.
- [ ] `validate_submission.py` confirms that the compiled agent loads both the base model and the LoRA adapter cleanly.
- [ ] Gen-2 submission achieves a higher bug-resolution score on the leaderboard.
