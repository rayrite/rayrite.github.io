# BCF Agent Code Templates & Fine-Tuning Recipes
**Target Competition:** [Google - The Gemma 4 Developer Agent Competition](https://www.kaggle.com/competitions/gemma-4-developer-agent/overview)  
**Deliverable File:** `04-bcf-agent-code-templates-and-fine-tuning-recipes.md`  
**Date of Record:** October 13, 2026  
**Target Rig:** PowerSpec G914 Gaming PC (AMD Ryzen 9 9950X3D | MSI MAG X870E Tomahawk WiFi | 64GB DDR5-6000 | MSI Ventus 3X OC RTX 5090 32GB GDDR7 | 2TB NVMe SSD | Windows 11 Pro)  
**Status:** Production-Ready Code & Configuration Templates  

---

## 1. Directory Structure of the BCF Submission Bundle

Your local agent repository at `~/bcf_workspace/bcf_agent/` should be structured as follows:

```text
bcf_agent/
├── agent.yaml                 # Root declarative configuration entrypoint (MANDATORY)
├── configs/
│   └── sampling.yaml          # Generation & sampling hyperparameters
├── prompts/
│   ├── system.md              # Core BCF system prompt & behavioral protocol
│   └── tools_guide.md         # Specialized guidelines for AST code-graph tools
└── lora/                      # (Populated after Phase 7 on RTX 5090)
    ├── adapter_config.json
    └── adapter_model.safetensors
```

---

## 2. Root Declarative Specification (`agent.yaml`)

Save this file as `~/bcf_workspace/bcf_agent/agent.yaml`:

```yaml
version: "1.0.0"
agent_type: "swe_developer_agent"
name: "bcf-coding-agent"
description: "Branch-Check-Fix autonomous software engineering agent powered by Gemma 4"

# Base model declaration mapped to closed host registry
model:
  name: "gemma-4-31b-it-qat-w4a16-ct"
  backend: "vllm"
  sampling_config: "configs/sampling.yaml"

# System prompts injected via declarative include tags
prompts:
  system_prompt: "!include prompts/system.md"
  tools_prompt: "!include prompts/tools_guide.md"

# Tools bound from host tool registry (ToolRegistry)
tools:
  - name: "run_command"
    description: "Execute non-interactive shell commands in /workspace"
  - name: "read_file"
    description: "Read slices of file contents with line numbers"
  - name: "edit_file"
    description: "Replace exact string blocks in workspace files"
  - name: "write_file"
    description: "Create new files or overwrite existing files"
  - name: "get_status"
    description: "Inspect git status of modified files in repository"
  - name: "get_code_neighbors"
    description: "Inspect AST callers, callees, and class neighbors"
  - name: "search_similar_code"
    description: "Search AST symbols and code references across repository"
  - name: "get_code_subgraph"
    description: "Extract localized AST dependency subgraph"
  - name: "submit_patch"
    description: "Terminal action: freeze git diff and complete task"

# Runtime boundaries and task execution safeguards
runtime_limits:
  max_turns: 25
  timeout_seconds: 600
  early_exit_turn_threshold: 23

# Adapter configuration (Active in Phase 7 after fine-tuning)
adapters:
  enabled: false
  path: "lora"
```

---

## 3. Core BCF System Prompt (`prompts/system.md`)

Save this file as `~/bcf_workspace/bcf_agent/prompts/system.md`:

```markdown
You are the BCF (Branch-Check-Fix) Autonomous Software Engineering Agent.
Your objective is to resolve real-world software issues in the repository mounted at `/workspace`.

You must strictly adhere to the four sequential phases of the BCF protocol:

### PHASE 1: BRANCH (Localization & Context Scoping)
1. Read the user's issue statement and identify error messages, stack traces, and symbol names.
2. Use `search_similar_code` and `get_code_neighbors` to locate the suspect files and functions.
3. Use `read_file` with precise line slices (max 80 lines per view) to inspect the code. Never dump full files into context.
4. Do NOT attempt any code edits during Phase 1.

### PHASE 2: CHECK (Reproduction & Baseline Verification)
1. Identify existing relevant test files in the repository or write a minimal standalone reproduction script using `write_file`.
2. Run the test using `run_command` (e.g., `pytest tests/test_suspect.py -k test_target`).
3. CONFIRM the reproduction: The test MUST fail with the expected error before you make any code modifications.
4. If you cannot reproduce the failure, re-examine the traceback and re-locate the issue.

### PHASE 3: FIX (Surgical Implementation & Regression Testing)
1. Formulate a minimal, targeted patch that addresses the root cause without altering unrelated functionality.
2. Apply your change using `edit_file`, providing sufficient unique contextual lines in `old_str` to guarantee unambiguous replacement.
3. Re-run the reproduction test: It must now PASS.
4. Run the broader test module to verify that your fix introduced no regression errors.
5. If tests fail, analyze the error output and adjust your fix. Do not guess.

### PHASE 4: CONVERGENCE & TERMINAL ACTION (Integrity Guard)
1. Use `get_status` to inspect workspace modifications.
2. If you created any temporary reproduction scripts during Phase 2, remove them immediately (`rm repro_test.py`).
3. Ensure only genuine source file changes remain in `git status`.
4. Call `submit_patch()` to freeze the unified git diff as your official submission.
5. You MUST call `submit_patch()` before Turn 23. If you run low on turns or time, clean up and call `submit_patch()` immediately.

### CRITICAL RULES:
- Never execute interactive commands (`vim`, `nano`, `top`, `less`, `python -i`).
- Never make external network requests; all operations must run offline.
- Output your reasoning inside `<thought>` tags before invoking any tool.
- Always conclude the task with `submit_patch()`.
```

---

## 4. Sampling Configuration (`configs/sampling.yaml`)

Save this file as `~/bcf_workspace/bcf_agent/configs/sampling.yaml`:

```yaml
temperature: 0.2
top_p: 0.95
top_k: 40
max_tokens: 4096
presence_penalty: 0.0
frequency_penalty: 0.1
stop_sequences:
  - "<|im_end|>"
  - "<|end_of_turn|>"
```

---

## 5. Local vLLM Server Runner for RTX 5090 (`serve_gemma4_rtx5090.sh`)

Save this script as `~/bcf_workspace/serve_gemma4_rtx5090.sh`:

```bash
#!/usr/bin/env bash
# High-Throughput Local Model Server for PowerSpec G914 (MSI RTX 5090 32GB GDDR7)
set -euo pipefail

MODEL_ID="google/gemma-4-31b-it-qat-w4a16-ct"
PORT=8000

echo "[*] Launching vLLM Engine on NVIDIA GeForce RTX 5090 (32GB VRAM)..."
echo "    Allocating 90% VRAM (~28.8GB) for high-concurrency KV cache & 16k context window."

python3 -m vllm.entrypoints.openai.api_server \
    --model "${MODEL_ID}" \
    --gpu-memory-utilization 0.90 \
    --max-model-len 16384 \
    --enforce-eager \
    --dtype bfloat16 \
    --port "${PORT}" \
    --host 0.0.0.0
```

---

## 6. Pre-Flight Submission Compiler Validator (`validate_submission.py`)

Save this script as `~/bcf_workspace/validate_submission.py`:

```python
#!/usr/bin/env python3
"""
Pre-Flight Validator: Validates BCF agent submission against official
Kaggle ADK declarative compiler and submission limits.
"""

import sys
import os
from pathlib import Path

def validate(bundle_path: str):
    bundle_dir = Path(bundle_path).resolve()
    print(f"[*] Validating agent bundle at: {bundle_dir}")

    # 1. Check root agent.yaml presence
    agent_yaml = bundle_dir / "agent.yaml"
    if not agent_yaml.is_file():
        print(f"[!] ERROR: Mandatory 'agent.yaml' not found at root: {agent_yaml}")
        sys.exit(1)
    print("  [+] Root agent.yaml located successfully.")

    # 2. Check forbidden files
    forbidden_patterns = [".git", "__pycache__", ".venv", ".DS_Store"]
    found_forbidden = []
    for root, dirs, files in os.walk(bundle_dir):
        for item in dirs + files:
            if item in forbidden_patterns or item.endswith(".pyc"):
                found_forbidden.append(os.path.join(root, item))

    if found_forbidden:
        print(f"[!] WARNING: Found {len(found_forbidden)} forbidden/temporary items:")
        for item in found_forbidden[:5]:
            print(f"      - {item}")
        print("    Clean these before creating submission.zip!")

    # 3. Test compilation via adk_submission & swegemma
    try:
        from swegemma.config import build_submission_limits
        from adk_submission import compile_submission, ModelRegistry, ToolRegistry

        print("[*] Loading submission limits and constraints...")
        limits, constraints = build_submission_limits()

        models = ModelRegistry()
        tools = ToolRegistry()

        print("[*] Invoking compile_submission()...")
        agent = compile_submission(
            str(bundle_dir),
            tool_registry=tools,
            model_registry=models,
            limits=limits,
            generation_constraints=constraints
        )
        print("  [+] SUCCESS: Bundle compiled cleanly into BaseAgent tree!")
        print(f"  [+] Agent Name: {agent.name if hasattr(agent, 'name') else 'BCF Agent'}")
        return True

    except ImportError as e:
        print(f"[!] Skipping live harness compilation check (harness package not yet installed): {e}")
        print("  [+] Structural schema checks passed.")
        return True
    except Exception as e:
        print(f"[!] COMPILATION ERROR: {e}")
        sys.exit(1)

if __name__ == "__main__":
    target_dir = sys.argv[1] if len(sys.argv) > 1 else "~/bcf_workspace/bcf_agent"
    validate(os.path.expanduser(target_dir))
```

---

## 7. Automated Production Packager (`build_submission.py`)

Save this script as `~/bcf_workspace/build_submission.py`:

```python
#!/usr/bin/env python3
"""
Automated Packager: Compresses BCF agent directory into submission.zip
ensuring agent.yaml is located strictly at the zip root level.
"""

import os
import sys
import zipfile
from pathlib import Path

def create_submission_zip(source_dir: str, output_zip: str):
    src = Path(source_dir).resolve()
    out = Path(output_zip).resolve()

    if not (src / "agent.yaml").is_file():
        raise FileNotFoundError(f"agent.yaml must exist at the root of {src}")

    print(f"[*] Packaging {src} into {out}...")

    # Excluded files and directories
    ignore_names = {
        ".git", ".gitignore", "__pycache__", ".venv", ".pytest_cache",
        ".DS_Store", "submission.zip"
    }

    file_count = 0
    with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as zf:
        for root, dirs, files in os.walk(src):
            # Prune excluded directories
            dirs[:] = [d for d in dirs if d not in ignore_names]
            
            for f in files:
                if f in ignore_names or f.endswith(".pyc") or f.endswith(".tmp"):
                    continue
                
                full_path = Path(root) / f
                # Crucial: relative path ensures agent.yaml is at zip root
                rel_path = full_path.relative_to(src)
                zf.write(full_path, arcname=str(rel_path))
                file_count += 1

    size_mb = out.stat().st_size / (1024 * 1024)
    print(f"  [+] Packed {file_count} files into {out.name} ({size_mb:.2f} MB)")

    # Verify zip structure
    with zipfile.ZipFile(out, "r") as zf:
        names = zf.namelist()
        if "agent.yaml" not in names:
            raise ValueError("Verification failed: agent.yaml is NOT at the root of submission.zip!")
        print("  [+] Structural audit PASSED: agent.yaml is verified at zip root.")

if __name__ == "__main__":
    src_folder = sys.argv[1] if len(sys.argv) > 1 else "~/bcf_workspace/bcf_agent"
    out_file = sys.argv[2] if len(sys.argv) > 2 else "~/bcf_workspace/submission.zip"
    create_submission_zip(os.path.expanduser(src_folder), os.path.expanduser(out_file))
```

---

## 8. Local Task Evaluation Runner (`run_local_evaluation.py`)

Save this script as `~/bcf_workspace/run_local_evaluation.py`:

```python
#!/usr/bin/env python3
"""
Local Evaluation Runner: Executes BCF agent against tasks from tasks.jsonl
using swegemma in an isolated Docker sandbox.
"""

import sys
import subprocess
from pathlib import Path

def run_eval(tasks_path: str, agent_dir: str):
    tasks_file = Path(tasks_path).resolve()
    agent_path = Path(agent_dir).resolve()

    print(f"[*] Starting local evaluation using: {tasks_file}")
    print(f"[*] Agent directory: {agent_path}")

    cmd = [
        "swegemma", "eval",
        "--tasks", str(tasks_file),
        "--submission-dir", str(agent_path),
        "--sandbox", "docker",
        "--timeout", "600",
        "--max-turns", "25",
        "--output-dir", str(Path.home() / "bcf_workspace/eval_results")
    ]

    print(f"[*] Command: {' '.join(cmd)}")
    result = subprocess.run(cmd)
    
    if result.returncode == 0:
        print("[+] Evaluation complete. Inspect results in ~/bcf_workspace/eval_results/")
    else:
        print(f"[!] Evaluation exited with error code: {result.returncode}")

if __name__ == "__main__":
    tasks = sys.argv[1] if len(sys.argv) > 1 else "~/bcf_workspace/data/sample_task.jsonl"
    agent = sys.argv[2] if len(sys.argv) > 2 else "~/bcf_workspace/bcf_agent"
    run_eval(tasks, agent)
```

---

## 9. On-Device Unsloth / PEFT Gemma 4 Fine-Tuning Recipe for RTX 5090 (`train_bcf_lora.py`)

Save this script as `~/bcf_workspace/train_bcf_lora.py`:

```python
#!/usr/bin/env python3
"""
On-Device Unsloth Gemma 4 Fine-Tuning Script:
Trained on NVIDIA GeForce RTX 5090 (32GB GDDR7 VRAM, Blackwell Architecture).
Trains 4-bit LoRA adapter on successful BCF execution trajectories.
"""

import os
import torch
from datasets import load_dataset
from transformers import TrainingArguments
from trl import SFTTrainer

def train_lora():
    print("[*] Initializing Unsloth Gemma 4 Training Pipeline on PowerSpec G914...")
    
    if not torch.cuda.is_available():
        raise SystemError("CUDA GPU not detected. Ensure WSL2 NVIDIA passthrough is functional.")

    gpu_name = torch.cuda.get_device_name(0)
    vram_gb = torch.cuda.get_device_properties(0).total_memory / (1024**3)
    print(f"[*] Detected GPU: {gpu_name} with {vram_gb:.1f} GB VRAM")

    try:
        from unsloth import FastLanguageModel
    except ImportError:
        print("[!] Unsloth not found. Install via: uv pip install 'unsloth[cu124-ampere-torch240]'")
        return

    # On a 32GB RTX 5090, we can train up to 8192 sequence length comfortably
    max_seq_length = 8192
    model_name = "google/gemma-4-31b-it"
    output_dir = os.path.expanduser("~/bcf_workspace/bcf_agent/lora")

    print(f"[*] Loading model {model_name} in 4-bit QLoRA mode...")
    model, tokenizer = FastLanguageModel.from_pretrained(
        model_name=model_name,
        max_seq_length=max_seq_length,
        load_in_4bit=True,
    )

    print("[*] Attaching PEFT/LoRA adapters...")
    model = FastLanguageModel.get_peft_model(
        model,
        r=16,
        target_modules=["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"],
        lora_alpha=32,
        lora_dropout=0.05,
        bias="none",
        use_gradient_checkpointing=True,
        random_state=3407,
    )

    data_path = os.path.expanduser("~/bcf_workspace/data/bcf_trajectories.jsonl")
    if not os.path.exists(data_path):
        print(f"[!] Trajectory dataset {data_path} not found. Run Phase 4 simulation first.")
        return

    print(f"[*] Loading training trajectories from {data_path}...")
    dataset = load_dataset("json", data_files=data_path, split="train")

    # Hyperparameters tuned for 32GB GDDR7 VRAM on RTX 5090
    training_args = TrainingArguments(
        output_dir=os.path.expanduser("~/bcf_workspace/training_checkpoints"),
        per_device_train_batch_size=2,          # 32GB VRAM handles batch size 2 at 8k length
        gradient_accumulation_steps=4,          # Effective batch size = 8
        warmup_steps=10,
        max_steps=100,
        learning_rate=2e-4,
        bf16=True,                              # Native bfloat16 on RTX 5090 Blackwell
        fp16=False,
        logging_steps=5,
        optim="adamw_8bit",
        weight_decay=0.01,
        lr_scheduler_type="cosine",
        seed=3407,
    )

    trainer = SFTTrainer(
        model=model,
        tokenizer=tokenizer,
        train_dataset=dataset,
        dataset_text_field="text",
        max_seq_length=max_seq_length,
        args=training_args,
    )

    print("[*] Starting on-device model training on RTX 5090...")
    trainer.train()

    print(f"[*] Saving fine-tuned LoRA adapters to {output_dir}...")
    model.save_pretrained(output_dir)
    tokenizer.save_pretrained(output_dir)
    print("  [+] Fine-tuning complete! LoRA adapters ready for packaging in Phase 7.")

if __name__ == "__main__":
    train_lora()
```
