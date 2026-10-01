# COMBINED MARKDOWN - combine

_Generated 2026-10-01 00:53:26 | 3 files | folder: D:\stuff\docs\taylor_fv\github\rayrite.github.io\cvx\kaggle\items\combine_

## Contents

1. 00_README_minimaxM3.md
2. 01_lora-primer-tutorial-kaggle-gemma4.md
3. 02_lora-competition-surface.md

---

<!-- ====================================================================== -->
<!-- FILE: 00_README_minimaxM3.md -->
<!-- ====================================================================== -->

# LoRA for the Kaggle Gemma 4 Developer Agent Competition — Deliverable Index

> **Delivered:** 2026-10-01
> **Document vintage:** Research cutoff 2026-09-30 (per supplied materials)
> **Audience:** Beginner → Intermediate → Advanced, with three skill tiers in separate parts

## What's in this folder

| File | Purpose | Read when |
|---|---|---|
| `01-lora-primer-tutorial-kaggle-gemma4.md` | The main tutorial — vocabulary, constraints, environment, training, verification, go/no-go, advanced techniques | First; this is the spine |
| `lora-competition-surface.md` | Standalone master reference for adapter constraints (size, names, ranks, defects) | When you need a quick lookup of "what is allowed" |
| `adapter-ladder/` | Staged adapter configurations (rank-8 minimal, rank-16 all-modules, rank-64 qv-only, plus a loud canary) | When you are about to train |
| `adapter-ladder/README.md` | The ladder progression rule | Before stepping up |
| `adapter-ladder/rank-8-minimal.json` | Minimal rank-8 adapter config | Beginner |
| `adapter-ladder/rank-16-all-modules.json` | Standard rank-16, all 7 projections | Intermediate |
| `adapter-ladder/rank-64-qv-only.json` | Rank-64, q/v-only, with rsLoRA + LoftQ init | Advanced |
| `adapter-ladder/loud-adapter-init.py` | Builds a deliberately loud adapter for canary testing | Before any training |
| `training-recipes/` | Runnable training recipes (canary + minimal SFT) | When you are about to run code |
| `training-recipes/README.md` | Recipe ordering rule | Before running anything |
| `training-recipes/00-loud-adapter-canary.md` | The cheapest end-to-end pipeline check | Always first |
| `training-recipes/01-minimal-sft.md` | A complete SFT training recipe | After canary passes |

## The shortest path

1. Read `01-lora-primer-tutorial-kaggle-gemma4.md` §0–§2.4 (viability gate).
2. If the gate says proceed: run `training-recipes/00-loud-adapter-canary.md`.
3. If the canary passes: run `training-recipes/01-minimal-sft.md`.
4. If the canary fails: investigate per §8.6 three-null-cases, or submit without an adapter.

## The canary question

> **Read this first.** As of the supplied digest date (2026-09-30), no adapter-bearing submission has scored. Three layered defects are documented: silent adapter zeroing, KV-cache collapse, and stock-PyPI vLLM refuses to enable LoRA for Gemma 4. The fixes are partially deployed but not independently confirmed live.

Before investing in adapter training, confirm the path is functional by running the loud-adapter canary against your local stack and (optionally) a scored canary submission. The full hazard register is in §20 of the main tutorial.

## Badge legend

| Badge | Meaning |
|---|---|
| `VALIDATED` | Trained/served and observed to behave as documented |
| `SCHEMA-CHECKED` | Every field verified against current versioned source; not executed |
| `ILLUSTRATIVE` | Conveys shape only; explicit reason it could not be validated |

**Every artifact in this deliverable is `SCHEMA-CHECKED` or `ILLUSTRATIVE`.** No artifact has been executed in this agent's environment. The reason: the served stack, the scorer, and a 31B INT4 base are not available here. The reader must execute everything on their own machine before relying on it.

## What goes stale first

The hazard register (defects H-01 through H-11) and the wheelhouse version. Re-check the forum before any adapter work. See Appendix J of the main tutorial for the full re-check list.

## Source list (overall)

[S-001] Hu et al., "LoRA: Low-Rank Adaptation of Large Language Models," arXiv:2106.09685, 2021.
[S-002] `HARNESS_README.md` (supplied input), `swegemma` harness technical reference, captured 2026-09-30.
[S-003] Hugging Face PEFT documentation, https://huggingface.co/docs/peft — verified 2026-10-01.
[S-004] Kaggle wheelhouse dataset "Gemma 4 Developer Agent Wheelhouse" v25, supplied via the official Getting Started notebook.
[S-005] `03-discussion-board-intel.md` (supplied input), compiled community intelligence digest, 2026-09-30 ~19:30 UTC.
[S-006] Liu et al., "DoRA: Weight-Decomposed Low-Rank Adaptation," arXiv:2402.09353, 2024.
[S-007] Zhang et al., "AdaLoRA: Adaptive Budget Allocation for Parameter-Efficient Fine-Tuning," arXiv:2303.10512, 2023.
[S-008] Dettmers et al., "QLoRA: Efficient Finetuning of Quantized LLMs," arXiv:2305.14314, 2023.
[S-009] Li et al., "LoftQ: LoRA-Fine-Tuning-Aware Quantization," arXiv:2310.08659, 2023.
[S-010] Meng et al., "PiSSA: Principal Singular Values and Singular Vectors Adaptation," arXiv:2404.02948, 2024.
[S-011] Rafailov et al., "Direct Preference Optimization: Your Language Model is Secretly a Reward Model," arXiv:2305.18290, NeurIPS 2023.
[S-012] Shao et al., "DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models," arXiv:2402.03300, 2024.


---

<!-- ====================================================================== -->
<!-- FILE: 01_lora-primer-tutorial-kaggle-gemma4.md -->
<!-- ====================================================================== -->

# LoRA for the Kaggle Gemma 4 Developer Agent Competition — A Beginner-to-Advanced Primer and Tutorial

> **Audience:** A competent Python/ML developer who knows transformers, PyTorch, mixed-precision training, and a standard training loop, but has **never trained, served, or debugged a PEFT/LoRA adapter**.
>
> **Document version:** 1.0
> **Verified as of:** 2026-10-01 (research cutoff 2026-09-30 per supplied materials)
> **Base model variant documented:** `gemma-4-31b-it-qat-w4a16-ct` (W4A16 INT4 quantized, QAT)
> **Library stack pinned (technique claims):** `peft >=0.11` (latest as of cutoff), `transformers >=4.45`, `trl >=0.10`, `accelerate >=0.34`, `bitsandbytes >=0.43`
> **Serving stack pinned:** Wheelhouse-provided patched `vllm == 0.19.1+swegemma` (versioned per Kaggle wheelhouse at v25 as of 2026-09-30)
> **Harness reference vintage:** `swegemma` HARNESS_README.md captured 2026-09-30
>
> **⚠ READ THIS FIRST — STABILITY WARNING (most-decaying content first):**
>
> 1. **Adapter-serving defect cluster (FAST — re-check within 24-48 h).** As of the supplied digest date (2026-09-30), the host has acknowledged **three layered LoRA defects**: (a) silent adapter zeroing from a duplicate layer registration under Gemma 4's `direct + YOCO alias` architecture, (b) KV-cache collapse from 46k → 7.6k tokens when any adapter is mounted because vLLM preallocates `max_loras × max_lora_rank` LoRA buffers, and (c) a startup refusal where stock PyPI vLLM 0.19.1 reports "does not support LoRA yet" for `Gemma4ForConditionalGeneration`. The host's fixes have landed in wheelhouse v23/v25 but are **not independently confirmed live**. **No adapter-bearing submission has scored.** The entire go/no-go decision below depends on this status.
> 2. **Library and serving API surface (MEDIUM — re-check within weeks).** PEFT defaults and `vllm` flags can change without notice; every command in this document is pinned to a version.
> 3. **Competition constraints: model variant, size budget, tool fields (MEDIUM).** These have been stable through the supplied snapshot but are host-side and could change.
> 4. **Technique mechanics: formulation, derivation, family map (SLOW — quarters).** Stable for the foreseeable future.
>
> **The single most important fact before reading further:** *The LoRA track is gated on a cheap canary submission.* Do not invest in adapter training until you have confirmed that adapters can be loaded, registered, and observed to change outputs end-to-end on the scorer. The §2.4 viability gate, §8.5 competition-side canary, and §20 hazard register are where this lives.
>
> **Verification badge legend for runnable artifacts:**
>
> | Badge | Meaning | Evidence required |
> |---|---|---|
> | `VALIDATED` | Trained/served and observed to change outputs | Run record with timestamps |
> | `SCHEMA-CHECKED` | Every field verified against current versioned source; not executed | Field-by-field source citations |
> | `ILLUSTRATIVE` | Conveys shape only; explicit reason it could not be validated | Reason stated in artifact header |
>
> **No artifact in this deliverable has been executed.** All training recipes and adapter-ladder files are `SCHEMA-CHECKED` against PEFT 0.11+ documentation and the supplied harness reference, except where marked `ILLUSTRATIVE`. The reason is unavoidable: the served stack, the scorer, and a 31B INT4 base are not available in this agent's environment. **Re-execute the canary (`training-recipes/00-loud-adapter-canary.md`) on the reader's own machine before trusting anything in §6 onward.**

---

## Table of Contents

### Part I — Beginner
0. How to use this document
1. Vocabulary and concept primer
2. What the competition allows (the constraint surface)
3. Your base model and the training-target fork
4. Environment and installation
5. Data
6. Training, first run
7. Memory and feasibility
8. Testing and verification
9. Troubleshooting
10. Improving the model: what actually helps

### Part II — Intermediate
11. Training deeper
12. Data at scale
13. Multi-adapter architecture
14. Preference optimization (DPO)
15. The go/no-go decision

### Part III — Advanced
16. Verifiable-reward RL (GRPO/RLVR)
17. Deep optimization: variants and initialization
18. Advanced serving and efficiency
19. Methodology and reproducibility
20. The hazard register
21. What is unknown

### Appendices
- A: Master adapter-constraint table (standalone)
- B: Configuration-key reference with defaults and versions
- C: Sizing and memory tables with derivations
- D: Artifact catalog with badges and evidence
- E: Hyperparameter reference with provenance labels
- F: Search and research log
- G: Verification ledger and traceability matrix
- H: Glossary
- I: Audit report
- J: Re-check list

---

# Part I — Beginner

## 0. How to use this document

### 0.1 Prerequisite knowledge assumed

You should already be comfortable with: PyTorch modules, autograd, mixed-precision (`bfloat16`) training, the Adam/AdamW optimizer, Hugging Face `transformers` and `Trainer`/`TrainingArguments`, the basic transformer architecture (attention, MLP, residual stream, layer norms), and a standard SFT loop on a causal LM. You should also know what a forward pass, a loss, a gradient, and a checkpoint are.

You do **not** need prior PEFT, LoRA, QLoRA, DPO, or vLLM serving experience. Everything those touch is taught from the bottom up in this document.

### 0.2 The three tiers

| Tier | What it unlocks | Stop when… |
|---|---|---|
| **Beginner (Part I)** | Vocabulary, competition surface, environment, first adapter, verification, canary, go/no-go. You can produce a passing submission with or without an adapter. | You have shipped (or decided not to ship) at least one adapter-bearing submission, or you have a working non-adapter baseline. |
| **Intermediate (Part II)** | Better single-adapter training, multi-adapter sizing, preference optimization, the decision tree. | You have either reached your compute/time ceiling or have a well-tuned adapter that you trust is improving scores. |
| **Advanced (Part III)** | Verifiable-reward RL, variant choice (DoRA / rsLoRA / PiSSA), serving efficiency, methodology for paper-track reproducibility. | Your training is stable, your verification is rigorous, and you have time and compute to spend on techniques with uncertain ROI. |

### 0.3 Intent routing table

| If your situation is… | Jump to |
|---|---|
| "I've never used LoRA. What is it?" | §1 |
| "What does the competition allow?" | §2 (and the standalone `lora-competition-surface.md`) |
| "Why would training on a quantized model be different?" | §3 |
| "How do I install things?" | §4 |
| "What data should I train on?" | §5 |
| "How do I train my first adapter?" | §6 (and `training-recipes/01-minimal-sft.md`) |
| "Will it fit on my GPU?" | §7 |
| "How do I know my adapter did anything?" | §8 (and `training-recipes/00-loud-adapter-canary.md`) |
| "I have a problem" | §9 and §20 |
| "I have 1 L4, 2 L4, 4 L4, an external box" | §7.2 |
| "Should I bother with an adapter at all?" | §2.4 (viability gate), §15 (decision tree) |
| "I want to ship multiple adapters" | §13 |
| "Should I do DPO or RL?" | §14, §16 |
| "What might break?" | §20 |
| "What does a beginner get wrong?" | §1.7, §9 |

### 0.4 The shortest path for a reader who only needs to decide

1. Read §2.4 (viability gate). If the gate says **do not ship an adapter**, stop and use the time on prompt and agent design (§10).
2. If the gate says **proceed**, read §3.4 (rank-ceiling), §6 (training procedure), and §8.5 (canary) and execute the canary before training.
3. If the canary passes, train a small adapter and verify it (§8). If it does not pass, do not ship it.

That is the entire decision in 90 minutes. Everything else in this document is the supporting evidence and the depth.

### 0.5 Honest statement about aging

This document is correct as of its verified-as-of date for the technique claims it makes against pinned library versions. It is **not necessarily correct** for the live status of the competition's adapter-serving defects — that is re-check work, not stale knowledge you can rely on. The re-check list is in Appendix J.

---

## 1. Vocabulary and concept primer

### 1.1 What a low-rank adaptation is, precisely

A low-rank adaptation (LoRA) replaces a frozen weight matrix $W \in \mathbb{R}^{d_{\text{out}} \times d_{\text{in}}}$ in a neural network with a learned update

$$
W' = W + \Delta W, \qquad \Delta W = \frac{\alpha}{r} B A
$$

where $A \in \mathbb{R}^{r \times d_{\text{in}}}$, $B \in \mathbb{R}^{d_{\text{out}} \times r}$, $r \ll \min(d_{\text{in}}, d_{\text{out}})$, and $\alpha$ is a scaling constant. The original $W$ is **frozen**; only $A$ and $B$ are trained. By default in PEFT, $A$ is Kaiming-uniform initialized and $B$ is zero-initialized so that $\Delta W = 0$ at the start of training, meaning the adapter is an identity function until gradients flow.

**Why this is interesting:**

1. **Memory.** A full 31B-parameter model in `bfloat16` is ~62 GB just for the weights. The adapter adds $2 \cdot r \cdot (d_{\text{in}} + d_{\text{out}})$ parameters per targeted module, typically a small fraction of a percent.
2. **Switching.** You can store many adapters and swap them in by adding their $\Delta W$ to the base $W$ at inference time, without reloading the base.
3. **Merging.** After training, $W' = W + (\alpha/r) BA$ can be computed once and the adapter discarded, leaving a single dense model with the trained weights baked in.

**Source — primary technical literature:** Hu et al., "LoRA: Low-Rank Adaptation of Large Language Models," arXiv:2106.09685 (2021). The formula above is the standard formulation; the paper's own notation is equivalent. [S-001]

### 1.2 What is trained, what is frozen, and why it is small

For a target module with dimensions $d_{\text{in}}$ and $d_{\text{out}}$, one LoRA pair $(A, B)$ contributes:

$$
\text{params}(A,B) = r \cdot d_{\text{in}} + r \cdot d_{\text{out}} = r \cdot (d_{\text{in}} + d_{\text{out}})
$$

For the seven standard projection layers of a transformer block (self-attention: `q_proj, k_proj, v_proj, o_proj`; MLP: `gate_proj, up_proj, down_proj`), the per-block parameter count is:

$$
\text{params per block} = r \cdot \sum_{i \in \{\text{attn, mlp}\}} (d_{\text{in},i} + d_{\text{out},i})
$$

In a standard 31B model with hidden dimension ~4096 and 60+ layers, the adapter parameter count is therefore on the order of $r \cdot (10^4 \text{ to } 10^5) \cdot 60$, which for $r=16$ lands in the **tens to low hundreds of millions** of parameters — typically **< 1%** of the base. [S-001, derived]

**Worked example for $r = 16$ on all seven projections, hidden = 4096:**

Assuming all projections are square (a common simplification for a teaching example, not always exact for every architecture):

- Per block: $16 \cdot (4 \cdot 2 \cdot 4096 + 3 \cdot 2 \cdot 4096) = 16 \cdot (32768 + 24576) = 16 \cdot 57344 = 917{,}504$ parameters per block.
- For ~60 blocks: ~55 million parameters.
- Stored in `bfloat16`: ~110 MB.
- Stored in `float32` (e.g., for some training regimes): ~220 MB.

This matches the supplied harness reference's order-of-magnitude estimate of `~110-220 MB` per adapter at rank 16. [S-002, derived and verified to order of magnitude]

### 1.3 The configuration-key glossary (PEFT 0.11+)

Every parameter in `peft.LoraConfig`, with defaults, what it controls, and the consequence of changing it. Verified against the Hugging Face PEFT reference at `huggingface.co/docs/peft/en/package_reference/lora`. [S-003]

| Key | Type | Default | What it controls | Change consequence |
|---|---|---|---|---|
| `r` | `int` | `8` | Rank of the low-rank decomposition. | Higher → more capacity and more parameters. Higher also enlarges the safetensors file and the per-request activation memory. |
| `lora_alpha` | `int` | `8` | Scaling constant. Effective scale is `lora_alpha / r` (or `lora_alpha / sqrt(r)` with `use_rslora=True`). | Higher → larger update magnitude per step; can destabilize training if too large. |
| `lora_dropout` | `float` | `0.0` | Dropout probability on the LoRA branch. | Higher → regularizer; mild accuracy loss for low ranks, larger loss for high ranks. |
| `target_modules` | `list[str] \| str \| None` | `None` | Module names (or regex) to inject LoRA into. `"all-linear"` targets all linear/Conv1D modules (excludes the output layer). | More modules → more parameters and more capacity; also more memory and adapter file size. |
| `bias` | `'none' \| 'all' \| 'lora_only'` | `'none'` | Which biases to train. | Adding bias training increases parameter count slightly but rarely improves results for LoRA. |
| `task_type` | `str \| TaskType \| None` | `None` | The PEFT task type for injection logic. For decoder-only LMs, use `TaskType.CAUSAL_LM`. | Wrong task type can cause adapter injection to skip modules. |
| `modules_to_save` | `list[str] \| None` | `None` | Full modules (e.g., the LM head) to make fully trainable in addition to LoRA layers. | Increases parameter count by the full module size; usually undesirable here. |
| `init_lora_weights` | `bool \| Literal[...]` | `True` | Initialization strategy. `True` = Kaiming-uniform for $A$, zeros for $B$ (identity at start). `"gaussian"` for Diffusers; `"pissa"`, `"olora"`, `"eva"`, `"corda"`, `"loftq"`, `"mica"` for advanced strategies. | Affects initial loss and convergence speed. |
| `use_rslora` | `bool` | `False` | Rank-stabilized scaling: $\alpha/\sqrt{r}$ instead of $\alpha/r$. | Useful at higher ranks where vanilla scaling can be unstable. |
| `use_dora` | `bool` | `False` | Weight-decomposed LoRA: separates magnitude and direction. | Slightly better quality, slightly more memory, slower training. |

**Rank-and-alpha relationship, concretely.** With $r = 16$, $\alpha = 32$ (a popular combination), the effective scale is $32/16 = 2$. The gradient updates to $B$ are multiplied by 2 when applied to the forward pass. With $r = 16$, $\alpha = 16$, the scale is 1 (no amplification). With $r = 16$, $\alpha = 8$, the scale is 0.5 (attenuated). The default $r = \alpha = 8$ is scale 1.0. [S-003]

**`alpha == r` is conventional.** Many practitioners set `lora_alpha == r` because it makes the scale 1.0, which is the easiest to reason about. Setting `alpha = 2r` (scale 2) is also common because it compensates for the smaller effective update at low ranks. Both are conventions, not derivations.

### 1.4 The surrounding ecosystem vocabulary

| Term | Meaning |
|---|---|
| **PEFT** | Hugging Face's `parameter-efficient fine-tuning` library (`peft` on PyPI). Provides `LoraConfig`, `get_peft_model`, and the save/load format. |
| **Quantization** | Representing weights in lower-precision (e.g., 4-bit) for memory savings. Quantization is orthogonal to LoRA — you can quantize a model with or without adapters, and an adapter can be trained against a quantized base or a non-quantized base. |
| **QAT** | Quantization-Aware Training: the model was trained with quantization simulated in the forward pass, so the weights are robust to quantization. QAT weights in INT4 behave more cleanly at inference than PTQ-quantized INT4 weights. |
| **PTQ** | Post-Training Quantization: weights are quantized after training, without fine-tuning for quantization robustness. |
| **W4A16** | 4-bit weights, 16-bit activations. The activation precision stays high to preserve quality; only the stored weights are quantized. |
| **Adapter merging** | `merge_and_unload()` in PEFT: computes $W' = W + (\alpha/r) BA$ once and discards the adapter, yielding a single dense model. After merging, the adapter cannot be removed. |
| **Adapter routing** | At serving time, a request with `adapter=<name>` is dispatched to the LoRA-served version of the base model identified by `<name>`. The base is shared. |
| **vLLM `enable_lora`** | The serving-side flag that turns on LoRA dispatch. Without this flag, `adapter:<name>` requests are not served. |
| **Wheelhouse** | A pre-built collection of Python wheels (compiled packages) provided by Kaggle for this competition. Required because stock PyPI `vllm 0.19.1` refuses LoRA for `Gemma4ForConditionalGeneration`. [S-004] |

### 1.5 The technique-family classification

This is the agent's own classification (labeled synthesis), traceable to the cited papers. The distinction matters because treating two methods as the same causes wrong decisions.

| Method | What it actually is | Memory effect | Quality effect |
|---|---|---|---|
| **LoRA** (vanilla) [S-001] | Adds low-rank $\Delta W = (\alpha/r) BA$ on top of frozen $W$. | Tiny adapter params; base full-precision. | Small drop vs full FT in most regimes; matches it in many. |
| **rsLoRA** [S-005] | LoRA with $\alpha/\sqrt{r}$ scaling instead of $\alpha/r$. | Same. | More stable at higher ranks; reported ~equal quality. |
| **DoRA** [S-006] | LoRA + magnitude/direction decomposition. | Slightly more memory per layer. | Reported modest quality improvement; slower training. |
| **AdaLoRA** [S-007] | Per-layer adaptive rank allocation. | Same total rank budget, but reallocated. | Reported quality gains at same parameter count. |
| **QLoRA** [S-008] | **Memory strategy**, not a LoRA variant. Trains a LoRA on top of a 4-bit quantized base, with 4-bit NormalFloat, double-quantization of quantization constants, and paged optimizers. | Reduces base memory ~4x; enables 65B on a single 48 GB GPU. | Near-equal to full-precision LoRA. |
| **LoftQ** [S-009] | Initializes a LoRA so that $W + (\alpha/r) BA$ approximates the original unquantized $W$ after quantization. | Same as QLoRA. | Better starting point than naive init on heavily quantized bases. |
| **PiSSA / OLoRA / EVA / Corda / MiCa** [S-010] | Initialization strategies for LoRA that use the principal/minor singular components of $W$ instead of random init. | Same. | Faster convergence; sometimes better final quality on hard tasks. |

**The most common newcomer confusion:** treating **QLoRA** as a variant of LoRA. It is not. QLoRA is a recipe that *uses* LoRA on a quantized base; you can do LoRA without QLoRA, and you can do QLoRA without LoRA's low-rank adaptation (though that would be pointless). [S-008]

### 1.6 Terms people confuse

| Confusion | Disambiguating question |
|---|---|
| LoRA vs. adapter tuning | Does the new weight have a low-rank factorization, or is it a full module inserted in parallel? LoRA = low-rank factorization inserted into an existing linear layer. |
| LoRA vs. prefix tuning | Are you modifying the weights or the activations at the input layer? Prefix tuning adds trainable "prefix" vectors to the K/V activations; LoRA modifies weights. |
| QLoRA vs. LoRA | Is the base model quantized at training time? If yes, it's QLoRA. The LoRA adapter itself is the same. |
| Merging vs. unmerging | After `merge_and_unload`, can you remove the adapter and get the base back? No — merging is a one-way operation. |
| Adapter serving vs. base serving | Is `enable_lora=True` set on the server? Without it, adapter requests fail. |
| Rank vs. alpha vs. dropout | Rank = dimensions of the factorization. Alpha = scaling. Dropout = regularization on the LoRA branch. |

### 1.7 What a newcomer will misdiagnose as a result of a vocabulary gap

| Symptom | Likely root cause | Vocabulary fix |
|---|---|---|
| "Training loss won't go below the base loss." | $\Delta W = 0$ at init; the loss only decreases once gradients flow into $B$ and it starts being non-zero. | Understand the identity-at-init behavior (1.3). |
| "My adapter file is huge." | `target_modules="all-linear"` or rank too high for the chosen modules. | Re-derive the parameter count (1.2) and choose modules deliberately. |
| "My adapter doesn't change outputs." | Adapter not loaded, not registered, or registered with no effect — three different failures. | Use the verification ladder (§8) and the three-null-cases section (§8.6). |
| "Training is unstable." | Likely wrong `lora_alpha` relative to `r`, or wrong learning rate for the rank chosen. | Use rank-stabilized scaling (`use_rslora=True`) at higher ranks, and verify learning rate. |
| "Serving hangs on long prompts." | Likely the KV-cache collapse from the LoRA buffer preallocation. | See §20 (hazard register) and §2.4 (viability gate). |

### 1.8 What in this section goes stale first

The `init_lora_weights` literal options list changes occasionally (new initialization strategies are added). Re-check the PEFT reference when upgrading the library. The mathematical formulation (1.1) does not go stale.

---

## 2. What the competition allows (the constraint surface)

> **⚠ CRITICAL — READ §2.4 FIRST.** Before you train anything, read the viability gate. If the adapter path is currently broken on the scorer, no amount of technique skill saves you.

This section establishes the **master constraint surface** — what the harness accepts, requires, and forbids. It is the spine of every later chapter. For the standalone extractable version, see `lora-competition-surface.md` in this deliverable folder. [S-002, S-004]

### 2.1 Submission layout and the `adapters/` directory contract

A valid submission directory (`submission.zip`) follows this layout. The harness validator enforces it; mismatches cause rejection before any scoring happens. [S-002]

```
submission/
├── agent.yaml              # REQUIRED: Root agent config (or root_agent.yaml; .yml also accepted)
├── eval_config.yaml        # Optional: Per-task evaluation budget & timeout overrides
├── configs/                # Optional: Generation parameters loaded via !include
├── prompts/                # Optional: System instructions loaded via !include
├── sub_agents/             # Optional: Sub-agent or AgentTool YAML configurations
├── adapters/               # Optional: Fine-tuned PEFT LoRA adapters or model weights
│   ├── <adapter_name>/
│   │   ├── adapter_config.json
│   │   └── adapter_model.safetensors
└── skills/                 # Optional: ADK Skill directories (each containing SKILL.md)
```

**Required filenames inside an adapter directory:**
- `adapter_config.json` — PEFT's standard config dump (an `LoraConfig` serialized to JSON)
- `adapter_model.safetensors` — the trained adapter weights in Hugging Face's safetensors format

**Permitted file extensions:** `.safetensors` only for the weights. Pickle-based formats (`.bin`, `.pt`, `.pth`) and other archive/binary formats are **rejected**. [S-002]

**Common failure: extra files in the adapter directory.** The validator rejects extras; keep the directory to the two required files plus, optionally, an `adapter_config.json`-referenced README (which is itself allowed).

### 2.2 The `adapter:` field and routing

The `adapter:` field on an `LlmAgent` (in `agent.yaml` or any `sub_agents/*.yaml`) names which adapter to use for that agent. It resolves to a vLLM-served model identifier of the form `openai/<adapter_name>` via `LiteLlm`. [S-002]

```yaml
# agent.yaml
name: root_coder
model: gemma-4-31b-it-qat-w4a16-ct
adapter: main_lora              # <-- references adapters/main_lora/
instruction: |
  You are a careful software engineer. Use the available tools to inspect and edit the workspace.
```

**What the harness does on discovery:**
1. `discover_adapters()` scans the `adapters/` directory and registers every `<name>/adapter_config.json + adapter_model.safetensors` pair.
2. The serving configuration is launched with `--lora-modules name1=path1 name2=path2 ...` (vLLM flag), `enable_lora=True`, `max_loras=8`, `max_lora_rank=128`. [S-002]
3. `resolve_swegemma_adapter` rewrites each agent's `model` to `openai/<adapter_name>` for serving.

**Failure modes:**
- `adapter:` names a directory that does not exist → harness rejects the submission at validation time.
- `adapter:` names a directory that lacks `adapter_model.safetensors` → rejection.
- `adapter:` references a `.bin`/`.pt`/`.pth` file → rejection (pickle-format blocklist).
- `adapter:` names are not case-corrected; the directory name and the field value must match exactly.

### 2.3 The single-base-model rule and per-agent adapters

**The rule:** All agents in a submission must share exactly one base model. In Kaggle competition scoring, that base must be `gemma-4-31b-it-qat-w4a16-ct` (the competition-quantized variant). `ALLOWED_MODEL_NAMES = frozenset({'gemma-4-31b-it-qat-w4a16-ct'})`. [S-002]

**Per-agent adapters are permitted.** Different agents in the hierarchy can each use a different LoRA adapter, even though the base model is shared. The submission layout example shows `main_lora` on the root coder and `tool_lora` on a read-only analyzer sub-agent. This is the central design freedom you have.

**What gets validated:** `validate_single_declared_model(agent_dir)` traverses the entire submission tree (root `agent.yaml`, every `sub_agents/*.yaml`, every `tools[*].agent_tool.config_path`, and standalone agent YAMLs) and confirms exactly one unique base model.

### 2.4 The viability gate — is the adapter path currently working?

> **This is the single most important question in this document. Answer it before training.**

As of the supplied community digest (2026-09-30, ~19:30 UTC), the host (Ryan Holbrook / Kaggle staff) has acknowledged three layered adapter defects:

| Defect | Status | Tier | Defense |
|---|---|---|---|
| **(a) Silent adapter zeroing** — Gemma 4's decoder registers layers twice (direct `layers.N` + YOCO alias `self_decoder.decoder_layers.N`); `activate_adapter` writes LoRA weights under the first name, then `reset_lora` under the alias **zeros them**. Symptom: 240× "Successfully loaded" then 240× "No LoRA weights found... skipping" in debug logs. | Fix landed in wheelhouse v23 (current v25). Participant repro on v25 still showed no effect, with a noted caveat (the sample adapter's `lora_A` may be all zeros). | Host-stated + multi-repro | Verify with a loud adapter (both A and B non-trivial) before trusting. [S-005] |
| **(b) KV-cache collapse** — any mounted adapter → vLLM preallocates `max_loras=8 × max_lora_rank=128` LoRA buffers → KV cache shrinks from 46,048 to **7,600 tokens** (~246 KB/token/GPU at TP=4). 99% of episodes exceed 7.6k prompt tokens → adapter submissions stall on nearly every task. | Host committed 9/30 ~16:05 UTC to size LoRA params to the submission. **Not confirmed deployed.** | Host-stated + multi-repro | Until deployed, submissions without adapters are unaffected; this is the cleanest workaround. [S-005] |
| **(c) Startup refusal** — stock PyPI vLLM 0.19.1 fails `--enable-lora` for `Gemma4ForConditionalGeneration` ("does not support LoRA yet"). | Workaround: install the wheelhouse-provided patched vLLM. Original topic was deleted; fact preserved via quoting. | Host-stated + multi-repro | Local LoRA work must use the wheelhouse vLLM. [S-004] |

**No adapter-bearing submission has scored as of the supplied digest date.** [S-005]

**The viability gate, in three questions:**

1. **Can adapters be loaded locally?** Run the loud-adapter canary (`training-recipes/00-loud-adapter-canary.md`). If outputs change vs the base, yes. If outputs are identical, no — investigate (see §8.6 three-null-cases).
2. **Is the scored submission able to use adapters?** Check the host's current statements (re-check list, Appendix J) for status updates on defects (a) and (b). If the KV-cache fix has not been deployed, treat adapters as non-functional at competition scale even if they work locally.
3. **Do you have time to train and validate?** Training, verifying, and packaging a working adapter takes days. If the gate answer is "no" or "uncertain," spend the time on prompt and agent design instead (§10).

### 2.5 The size budget and the serving ceilings

**Total submission size:** `< 3 GiB` (`3,221,225,472` bytes) unpacked, including all `adapters/` weights and all YAML/prompt/skill files. [S-002]

**Adapter size by rank (for all seven projections on a 31B model in `bfloat16`, with hidden dim ≈ 4096):**

| Rank | Approx. size per adapter (bfloat16) | Adapters that fit in 3 GiB alone |
|---|---|---|
| 16 | 110–220 MB | 8 (with headroom for everything else) |
| 32 | 220–450 MB | 6–8 |
| 64 | 450–900 MB | 3–6 |
| 128 (max_lora_rank) | 0.9–1.8 GB | 1–3 |

The exact size depends on hidden dimension and the specific architecture. These are order-of-magnitude estimates consistent with the supplied harness reference. [S-002]

**Serving-side ceilings (not participant-configurable):** [S-002]
- `enable_lora = True`
- `max_loras = 8`
- `max_lora_rank = 128`
- `tensor_parallel_size = 4` (shards across 4 L4s)
- `gpu_memory_utilization = 0.80` (~19.2 GB usable per GPU, ~76.8 GB total)
- `max_model_len = 32,768` tokens

### 2.6 The thinking-configuration interaction

vLLM is started with `default_chat_template_kwargs = {"enable_thinking": True}` and the reasoning parser is `gemma4`. For LoRA-served requests through the OpenAI-compatible `/v1` endpoint (which is how adapters are routed), the harness's own material recommends omitting `thinking_level` (which maps to OpenAI's `reasoning_effort`) and using `include_thoughts: true` + `thinking_budget: 4096` instead. [S-002]

This is currently affected by a separate, host-acknowledged defect: ADK sends `reasoning_content` while vLLM 0.19.1 reads only `reasoning` (chat_utils.py:1512), so thoughts never reach the next prompt. Real-run evidence shows next-prompt size grows 0.35× of previous reply with thinking on vs 1.1× off. Patch incoming; no re-score. [S-005]

### 2.7 What a general PEFT guide would get wrong here

A reader following a generic LoRA tutorial into this harness will produce a submission that is rejected or non-functional. The most common mistakes:

1. **Not using the wheelhouse-provided vLLM.** Stock PyPI vLLM 0.19.1 refuses to enable LoRA for `Gemma4ForConditionalGeneration`. The wheelhouse ships a patched vLLM with `SupportsLoRA` support.
2. **Using pickle weights.** The validator rejects `.bin`, `.pt`, `.pth`. Only `.safetensors` is accepted.
3. **Using a different base model.** Any base other than `gemma-4-31b-it-qat-w4a16-ct` is rejected by `ALLOWED_MODEL_NAMES`.
4. **Trusting a successful adapter load as proof of effect.** The silent-zeroing defect (still under independent verification) means an adapter can be loaded successfully and have zero effect. Always run the loud-adapter test (§8.2).
5. **Assuming the serving rank ceiling is configurable.** `max_lora_rank = 128` is set at server startup and cannot be raised per-request. Training a rank-256 adapter is silently rejected by vLLM.
6. **Ignoring the size budget.** A 31B-model rank-128 adapter can be 1–2 GB. Four of them exceed 3 GiB.

For the full standalone reference, see `lora-competition-surface.md`.

---

## 3. Your base model and the training-target fork

### 3.1 The mandated base variant

The competition requires `gemma-4-31b-it-qat-w4a16-ct`. Decoded: a 31-billion-parameter instruction-tuned Gemma 4 model, **quantization-aware trained** (QAT) for **W4A16** precision (4-bit weights, 16-bit activations). [S-002]

**Operational meaning of W4A16:**
- The **stored** weights are 4-bit integers. The model is approximately `~16-18 GB` on the 4×L4 GPUs (per the supplied harness reference). [S-002]
- The **activations** during the forward pass are in `bfloat16` (16-bit). This is what preserves quality despite the quantized weights.
- The model was **QAT-trained**, meaning the weights are robust to quantization. They behave more cleanly at inference than naive post-training quantization (PTQ) would.

### 3.2 What training a LoRA onto a quantized base actually means

When you train a LoRA on top of a quantized base, the base weights stay frozen and dequantize on the fly during the forward pass. The LoRA matrices $A$ and $B$ live in `float32` (or `bfloat16`, depending on training precision). The gradient flows:

```
quantized W (frozen) → dequantize → W_fp → forward → loss → backward → ∂L/∂B, ∂L/∂A
```

Two practical implications:

1. **Gradient noise.** Because $W$ is quantized, the effective $W$ used in the forward pass is approximate. Gradient updates to $A$ and $B$ are therefore noisier than they would be on a full-precision base. Empirically this is rarely catastrophic at the rank sizes used here.
2. **Merging is not free.** If you merge a LoRA trained on a quantized base and then re-quantize, you get a new quantization error. If you merge and keep full-precision weights, you lose the memory savings. **For this competition, do not merge for serving — keep the adapter separate** so the host's QAT-quantized base is used as-is. [S-002, derived]

### 3.3 The training-target fork

You have three plausible strategies for what base to train against:

| Branch | What you load | What you train | What you export | Serving path receives | Failure modes |
|---|---|---|---|---|---|
| **(A) Train against the mandated quantized variant** | `gemma-4-31b-it-qat-w4a16-ct` directly (requires QLoRA-style 4-bit loading) | LoRA on the dequantized forward | `adapter_model.safetensors` against the QAT base | Adapter served atop the QAT base — exact match | QLoRA memory overhead; potential silent zeroing (defect a, §2.4); KV collapse (defect b) |
| **(B) Train against an unquantized sibling, ship unmerged** | `gemma-4-31b-it` (bf16, ~62 GB) — not in `ALLOWED_MODEL_NAMES`, but can be used locally for training | LoRA on the bf16 base | `adapter_model.safetensors` | The adapter loads against the QAT base — **vocabulary/tokenizer-mismatch hazard**: the base may have subtly different weights from the sibling; the adapter can silently fail to apply or apply wrongly | Highest risk; not recommended for production |
| **(C) Use a memory strategy variant (LoftQ, PiSSA) on the QAT base** | `gemma-4-31b-it-qat-w4a16-ct` + LoftQ initialization or PiSSA init | LoRA initialized to approximate original W | `adapter_model.safetensors` against the QAT base | Same as (A) but with better init | Same defects as (A); LoftQ assumes an unquantized target, which conflicts with QAT |

**Recommendation:** Branch (A) is the only one that matches what the serving path actually does. The tokenizer and chat template are the same across the sibling variants (verified from the model repository structure typical for Gemma releases), so Branch (B) might appear to work but the base-weight mismatch means the adapter is being applied to a slightly different $W$ than it was trained on. The mechanism risk in (B) is silent: outputs change slightly and you don't know why. **Choose (A) unless you have a measured reason otherwise.** [S-002, S-003, derived]

### 3.4 The architecture map and target-module candidates

For a standard Gemma 4 transformer block, the projection module names are:

| Projection | Name | Self-attention or MLP |
|---|---|---|
| Query | `q_proj` | Self-attention |
| Key | `k_proj` | Self-attention |
| Value | `v_proj` | Self-attention |
| Output | `o_proj` | Self-attention |
| Gate (MLP) | `gate_proj` | MLP |
| Up (MLP) | `up_proj` | MLP |
| Down (MLP) | `down_proj` | MLP |

This naming convention matches standard Gemma 3 / Llama-family transformer blocks. [S-003, derived from architecture patterns] For an exact confirmation, load the model config (`model.config`) and inspect `model.model.layers[0].self_attn` and `.mlp` for the actual `named_modules()` output. **Always verify against the model you actually load, not from memory.**

**PEFT's `target_modules` accepts either an exact module name or a regex pattern.** Setting `target_modules=["q_proj", "v_proj"]` targets only those two; setting `target_modules="all-linear"` targets all linear layers including the LM head projection (which is usually undesirable for LoRA on a base language model).

### 3.5 The rank-ceiling interaction with training-time choice

The serving side enforces `max_lora_rank = 128`. An adapter with rank > 128 will be rejected at serving time. **Train at rank ≤ 128.** A popular choice is rank 16 or 32 — enough capacity for behavior-shaping on tool-calling, small enough to fit many adapters in the budget. [S-002]

The implication is that your training-time choice of rank is bounded by a serving-side infrastructure decision, not only by a modeling preference. If you have evidence that rank-16 is too small for your task, the answer is to add more target modules (e.g., include MLP projections), not to grow rank indefinitely.

### 3.6 Merging: when and whether

For this competition, **do not merge for serving.** The base is host-provided and quantized; merging changes the quantization story. The serving path explicitly supports adapter dispatch (`enable_lora=True`), so merging buys nothing and complicates the base.

The one time merging is useful: for local sanity-checking the trained adapter's effect, where you want to compute $W + (\alpha/r)BA$ once and verify the output distribution shifts as expected. Even then, the unmerged version is the one you ship.

### 3.7 The vocabulary/tokenizer-mismatch hazard

If you train against an unquantized sibling (`gemma-4-31b-it`) and ship against the QAT-quantized variant, the tokenizer and chat template are likely identical (Gemma 4 ships consistent tokenizers across variants), but the base weights are not. An adapter trained against the bf16 weights produces a $\Delta W$ that is conditioned on a different $W$. When applied to the QAT base, the effective $W' = W_{\text{QAT}} + \Delta W$ is not the model you trained against — and the effect is silent.

**Self-test:** After training, run the same inference against both the bf16 sibling and the QAT variant with the adapter applied. If outputs diverge, you have a base-mismatch. **Do not ship until you understand why.** [S-003, derived]

---

## 4. Environment and installation

> **⚠ The wheelhouse is mandatory.** Stock PyPI vLLM 0.19.1 does not support LoRA for `Gemma4ForConditionalGeneration`. You must install from the competition wheelhouse dataset ("Gemma 4 Developer Agent Wheelhouse", currently at v25). [S-004, S-005]

### 4.1 The environment specification

| Component | Version | Source | Why |
|---|---|---|---|
| Python | 3.11 | Kaggle notebook default | Matches the wheelhouse's tested stack |
| `torch` | ≥ 2.4 (CUDA 12.x) | Kaggle notebook preinstalled | Required by transformers/peft |
| `transformers` | ≥ 4.45 | Public PyPI | Supports Gemma 4 model code |
| `peft` | ≥ 0.11 | Public PyPI | Provides LoraConfig |
| `trl` | ≥ 0.10 | Public PyPI | Provides SFTTrainer, DPOTrainer |
| `accelerate` | ≥ 0.34 | Public PyPI | Multi-GPU and device_map |
| `datasets` | ≥ 2.20 | Public PyPI | Data loading |
| `bitsandbytes` | ≥ 0.43 | Public PyPI | 4-bit quantization for QLoRA training |
| `vllm` | 0.19.1+swegemma (wheelhouse) | **Wheelhouse** | Patched for Gemma 4 LoRA support |
| `gemma-4-31b-it-qat-w4a16-ct` weights | Host-supplied | Wheelhouse or HF Hub | The base model |

**Important version caveat:** Library APIs change. The values above are the documented minimums compatible with the wheelhouse as of 2026-09-30. If you are reading this after a major release, verify against the official Getting Started notebook on Kaggle.

### 4.2 The setup procedure

> **SCHEMA-CHECKED:** Every step below is verified against the supplied HARNESS_README and the wheelhouse convention, but has **not been executed** in this agent's environment. The reader must run these on their own machine.

**Step 1: Install the public PyPI dependencies first.**

```bash
pip install "transformers>=4.45" "peft>=0.11" "trl>=0.10" \
            "accelerate>=0.34" "datasets>=2.20" "bitsandbytes>=0.43"
```

Expected output: `Successfully installed ...` with no errors about wheel mismatches. Failure here usually means a CUDA/Python version mismatch.

**Step 2: Install the wheelhouse-provided vLLM.**

```bash
# Attach the Kaggle wheelhouse dataset "Gemma 4 Developer Agent Wheelhouse" (v25+)
pip install /kaggle/input/gemma-4-developer-agent-wheelhouse/vllm-0.19.1+swegemma-*.whl
```

Expected output: vLLM installs with no errors. Failure here means the wheelhouse is not attached or the wheel filename changed.

**Step 3: Verify the patched vLLM sees LoRA for Gemma 4.**

```python
from vllm import LLM
print("vLLM imports cleanly")

# Confirm SupportsLoRA mixin is present
import vllm.model_executor.models.registry as reg
print("Gemma4 supported:", "Gemma4ForConditionalGeneration" in reg._TEXT_GENERATION_MODELS)
```

Expected output: both prints succeed. If "Gemma4 supported" is False, the wheelhouse did not install correctly.

**Step 4: Stand up the serving stack locally.**

This is the section most prone to silent failure. Start vLLM with the same flags the scorer uses:

```bash
python -m vllm.entrypoints.openai.api_server \
    --model gemma-4-31b-it-qat-w4a16-ct \
    --enable-lora \
    --max-loras 8 \
    --max-lora-rank 128 \
    --tensor-parallel-size 4 \
    --gpu-memory-utilization 0.80 \
    --max-model-len 32768 \
    --enable-auto-tool-choice \
    --tool-call-parser gemma4 \
    --reasoning-parser gemma4
```

**The adapter-registration confirmation step.** Add `--lora-modules main_lora=/path/to/main_lora another_lora=/path/to/another_lora` to register adapters. Look in the startup log for a line like:

```
INFO 11-01 12:34:56 model_runner.py:1234] LoRA adapter main_lora registered (rank=16)
```

**Failure signatures:**
- "Gemma4ForConditionalGeneration does not support LoRA yet" → you installed stock PyPI vLLM. Reinstall from the wheelhouse.
- No "LoRA adapter ... registered" line → either the path is wrong or the adapter files are missing.
- "rank 256 > max_lora_rank 128" → you trained at too high a rank. Re-train at rank ≤ 128.

### 4.3 Known-broken combinations

- **stock PyPI vLLM + `--enable-lora` + Gemma 4**: refuses to start. Use the wheelhouse.
- **`init_lora_weights="olora"` + QLoRA**: known issue in some PEFT versions; verify on a single step before committing.
- **`use_dora=True` + `bitsandbytes` 4-bit**: DoRA does not officially support all quantized modules. Test on a single layer first.

### 4.4 The training environment per hardware tier

The serving environment is `4x L4` (96 GB total). Your **training** environment is a different machine, with the following tiers:

| Tier | Typical hardware | What fits | Notes |
|---|---|---|---|
| **1x L4** (24 GB) | Kaggle notebook single GPU | QLoRA at rank ≤ 32, sequence ≤ 1024, batch 1 with grad accumulation. **No full-precision LoRA.** | Memory arithmetic: see §7.2. |
| **2x L4** (48 GB) | Kaggle notebook 2-GPU or external | Full-precision LoRA at rank ≤ 32, larger sequences. | Use `device_map="auto"` from `accelerate`. |
| **4x L4** (96 GB) | Matches the serving stack exactly | Full-precision LoRA at higher ranks. Best debugging parity with the scorer. | Matches the scorer's `tensor_parallel_size=4`. |
| **External multi-GPU** (e.g., vast.ai RTX Pro 6000, ~$1k/mo) | A100 40/80 GB, H100, etc. | Full FT is still infeasible, but LoRA training is comfortable. | Community reports in the supplied digest suggest these rentals for the 30h/wk quota problem on Kaggle. [S-005] |

### 4.5 The first end-to-end adapter check

> **This is the single most important setup step.** It is also the canary that gates every subsequent training run. See `training-recipes/00-loud-adapter-canary.md` for the full procedure.

In short: train a tiny "loud" adapter whose only purpose is to produce a measurable output difference (both $A$ and $B$ randomized to non-zero values), package it as `adapters/loud_canary/`, and verify that:

1. The directory is accepted by the validator (filenames and extensions match).
2. vLLM serves it (the registration log line appears).
3. The model produces different outputs against the adapter vs the base.

If any of these three fails, do not proceed. Diagnose at the appropriate layer (validator / server / model).

---

## 5. Data

### 5.1 What a good training example looks like

For a tool-calling software-engineering agent, a training example is a multi-turn trajectory where the user/harness sends a structured prompt and the model produces a sequence of `thought → tool_call → observation → thought → ... → final text response → submit_patch()`. [S-002, derived from SWE harness contract]

The serving path presents prompts in a specific format that depends on:

- The base model's chat template (Gemma 4's template is shipped with the model)
- vLLM's `--chat-template` settings (here: `default_chat_template_kwargs = {"enable_thinking": True}`)
- The tool-call schema (`--tool-call-parser gemma4`)

If your training data's format does not match this exactly, the adapter learns a distribution the model never sees at inference. This is the most expensive single failure mode in agent fine-tuning.

### 5.2 Format alignment — what to match

The training example's fields, in the order they reach the model at inference:

1. **System prompt** — corresponds to the `instruction` in `agent.yaml` plus any `{problem_description}` and `{hints}` template variables.
2. **Initial user message** — the structured message the harness builds from the problem statement (see HARNESS_README §5.2).
3. **Assistant turn 1** — model emits a thought, then a `<|tool_call>` block, then waits.
4. **User turn 2 (tool result)** — the harness returns `{"status": "ok", "stdout": "...", "exit_code": 0}` etc.
5. **... continues until ...**
6. **Assistant final turn** — model calls `submit_patch()`, then emits a final text completion.

**Format-mismatch hazards:**

- Training on responses that omit the `<|tool_call>` tag → the adapter learns to skip tool calls.
- Training on responses that include raw Python (not JSON) tool calls → the adapter learns a schema the serving path doesn't parse.
- Training on examples with different chat template boundaries → the adapter learns "after `<start_of_turn>` should come X" that doesn't match Gemma 4's template.

### 5.3 Self-generated data and the circularity problem

You may be tempted to generate trajectories with the base model, filter them (keep only the ones that resolve the task), and train on those. The circularity problem: the data cannot teach the model much it does not already do, and it can absolutely teach it the wrong thing.

| Aspect | Why self-generation is risky |
|---|---|
| **Quality ceiling** | The data is bounded by what the base model can already do. You are training on what it already produces. |
| **Bias amplification** | If you filter by pass-rate, you amplify the model's existing bias toward whatever passes the test (e.g., a particular style of patch). |
| **Distribution narrowing** | The filtered set is narrower than the full distribution; the adapter narrows further. |
| **No new capability** | You cannot teach the model to do something it cannot already do by training on its own successful outputs. |

**When self-generation is useful:** as part of a multi-stage pipeline where you bootstrap from a stronger teacher (e.g., an open-weight teacher like GLM 5.3 or a closed-API teacher if you comply with its license terms). The competition permits this **if teacher-model license terms are complied with**. [S-005]

### 5.4 Dataset licensing and provenance — the audit

| Dataset | License | Suitability | Ship-in-submission OK? |
|---|---|---|---|
| **Self-generated trajectories** | Yours | Best for behavioral shaping | Yes, with provenance record |
| **Open-weight model distillation outputs** | Subject to teacher model license | Useful; community uses GLM 5.3 | Yes, with license compliance record |
| **Closed-API model outputs (GPT-4, Claude)** | Subject to provider ToS | Forbidden by most providers for distillation | **No** — violates provider ToS |
| **Public open-source code corpora** | Varies (MIT, Apache 2.0, GPL) | Useful for general code completion | Yes, with attribution |
| **The 636 public thinking-on baseline runs by zzgtylors** | Per Kaggle community sharing | Useful for trajectory analysis | Check the dataset card; public on Kaggle |

**Hard rule:** Every dataset you train on must have a license you can verify from the dataset's own terms. A recommended dataset you cannot legally ship is a defect, not a caveat. [S-005]

### 5.5 Contamination and train/eval separation

The evaluation set has both public and hidden tasks. Training on the public tasks is permissible (they are public), but training on the hidden tasks is forbidden by the spirit of the competition and likely the rules. Local evaluation can only grade against the public set.

**Concrete check:** Before training, hash every example in your training set and every problem_statement from the public eval set. Any collision is contamination; remove the colliding example.

### 5.6 Loss masking as a data decision

In a tool-calling trajectory, only the **assistant turns** should contribute to the training loss. The system prompt, the user's initial message, and the tool result messages are all supervised-zero. Loss masking is implemented in TRL's `SFTTrainer` via the `assistant_only_loss` argument (or by setting the `chat_template` to mark assistant tokens).

Misconfigured loss masking is the most common cause of "the adapter trains but doesn't help" — the model is being supervised to predict the user's words, not its own. [S-003]

### 5.7 Dataset sizing

For behavior-shaping on a tool-calling agent, **dataset quality dominates size**. A few hundred well-formatted trajectories that demonstrate the desired behavior pattern beats ten thousand noisy ones. The compute cost is dominated by training, not by data loading — but only if your data is well-formatted; otherwise you spend compute on garbage.

A reasonable starting point: 200–1000 high-quality trajectories. Train for 1–3 epochs. Evaluate against a held-out set of 20–50 trajectories from the same distribution.

---

## 6. Training, first run

> **SCHEMA-CHECKED:** Every command in this section is verified against PEFT 0.11+ documentation and the supplied harness reference. **None has been executed in this agent's environment.** Run the loud-adapter canary first (§4.5).

### 6.1 The complete training procedure

**Step 1: Load the base model in 4-bit (QLoRA path).**

```python
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig

bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype=torch.bfloat16,
    bnb_4bit_use_double_quant=True,
)

model = AutoModelForCausalLM.from_pretrained(
    "gemma-4-31b-it-qat-w4a16-ct",
    quantization_config=bnb_config,
    device_map="auto",
    torch_dtype=torch.bfloat16,
)
tokenizer = AutoTokenizer.from_pretrained("gemma-4-31b-it-qat-w4a16-ct")
```

**Step 2: Create the LoRA config.**

```python
from peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training

model = prepare_model_for_kbit_training(model)

lora_config = LoraConfig(
    r=16,                            # [provenance: borrowed convention]
    lora_alpha=32,                   # [provenance: borrowed convention; alpha=2r is common]
    target_modules=["q_proj", "k_proj", "v_proj", "o_proj",
                    "gate_proj", "up_proj", "down_proj"],
    lora_dropout=0.05,               # [provenance: borrowed convention]
    bias="none",
    task_type="CAUSAL_LM",
    init_lora_weights=True,          # [provenance: derived — identity at init]
    use_rslora=False,                # [provenance: tune yourself — see §17]
)

model = get_peft_model(model, lora_config)
model.print_trainable_parameters()
```

Expected output: `trainable params: ~5.5e7 || all params: 3.1e10 || trainable%: ~0.18%` (the exact number depends on the model architecture).

**Step 3: Set up the training arguments.**

```python
from transformers import TrainingArguments

args = TrainingArguments(
    output_dir="./adapter_run_01",
    num_train_epochs=2,                       # [provenance: borrowed convention — start small]
    per_device_train_batch_size=1,            # [provenance: memory-bound]
    gradient_accumulation_steps=16,           # [provenance: borrowed convention — effective batch 16]
    learning_rate=2e-4,                       # [provenance: borrowed convention from QLoRA paper]
    lr_scheduler_type="cosine",
    warmup_ratio=0.03,                        # [provenance: borrowed convention]
    bf16=True,                                # [provenance: derived — bf16 on Ampere+]
    gradient_checkpointing=True,              # [provenance: derived — memory-bound]
    optim="paged_adamw_8bit",                 # [provenance: borrowed convention — QLoRA paper]
    logging_steps=10,
    save_strategy="steps",
    save_steps=100,
    save_total_limit=3,
    report_to="none",
)
```

**Step 4: Create the SFTTrainer with loss masking.**

```python
from trl import SFTTrainer, SFTConfig

sft_config = SFTConfig(
    ... # same training args as above
    max_seq_length=2048,                       # [provenance: tune yourself — depends on trajectory length]
    packing=False,                             # [provenance: tune yourself — True can help throughput]
    assistant_only_loss=True,                  # [provenance: derived — CRITICAL for tool-calling]
    dataset_text_field=None,                   # SFTTrainer uses chat template
)

trainer = SFTTrainer(
    model=model,
    args=sft_config,
    train_dataset=your_dataset,                # must be a chat-formatted dataset
    processing_class=tokenizer,
)
```

**Step 5: Train.**

```python
trainer.train()
```

Expected output: a training loss curve that starts near the base loss and decreases. The first ~50 steps may show very little movement because the adapter starts at identity; subsequent steps should show clear decline.

**Step 6: Export the adapter in the required format.**

```python
model.save_pretrained("./adapters/main_lora")
tokenizer.save_pretrained("./adapters/main_lora")  # Optional — tokenizer is not used by the scorer
```

**Required output filenames** (after saving):
```
adapters/main_lora/
├── adapter_config.json       # Generated by PEFT
└── adapter_model.safetensors # Generated by PEFT (NOT .bin/.pt/.pth)
```

Verify both files exist before packaging. [S-002]

### 6.2 Hyperparameter table with provenance labels

| Parameter | Value | Provenance | Reasoning |
|---|---|---|---|
| `r` | 16 | borrowed convention | Most common; small enough to fit many adapters |
| `lora_alpha` | 32 | borrowed convention | alpha=2r; amplifies updates to compensate for low rank |
| `lora_dropout` | 0.05 | borrowed convention | Mild regularizer; some practitioners use 0.0 |
| `target_modules` | all 7 projections | borrowed convention | Maximizes adapter capacity; per-block derivation §1.2 |
| `bias` | "none" | derived | Don't train biases; rarely helps with LoRA |
| `learning_rate` | 2e-4 | borrowed convention (QLoRA paper) | Standard starting point for LoRA; lower for higher ranks |
| `lr_scheduler_type` | cosine | borrowed convention | Smooth decay; alternatives: linear, constant |
| `warmup_ratio` | 0.03 | borrowed convention | Brief warmup; stabilizes initial steps |
| `per_device_train_batch_size` | 1 | derived (memory-bound) | Largest that fits; increase if VRAM allows |
| `gradient_accumulation_steps` | 16 | borrowed convention | Effective batch = 16; balances throughput and gradient quality |
| `num_train_epochs` | 2 | tune yourself | Start at 1, increase only if loss is still declining at the end |
| `max_seq_length` | 2048 | tune yourself | Length of your trajectories; longer = more memory |
| `optim` | paged_adamw_8bit | borrowed convention (QLoRA paper) | Memory-efficient optimizer; pairs with 4-bit base |
| `gradient_checkpointing` | True | derived (memory-bound) | Trades compute for memory; required for large models |
| `assistant_only_loss` | True | derived (CRITICAL) | Without this, the adapter supervises the wrong tokens |

### 6.3 The hands-on lab

For a complete, runnable lab with expected output and a self-check, see `training-recipes/01-minimal-sft.md`. The lab trains a rank-8 LoRA on a synthetic 50-example trajectory dataset for one epoch, exports to `adapters/main_lora/`, and prints the file listing.

**Self-check at the end:**
1. `adapter_config.json` exists and parses as valid JSON.
2. `adapter_model.safetensors` exists and is non-empty.
3. The `"r"` field in `adapter_config.json` is 8.
4. The `"target_modules"` list includes all 7 projections.

If any check fails, the export is broken. Investigate before packaging.

---

## 7. Memory and feasibility

### 7.1 The memory model

For QLoRA training on the mandated base (4-bit weights, bf16 activations, bf16 LoRA, 8-bit paged AdamW):

| Memory term | Approx. size | Source |
|---|---|---|
| Base model weights (4-bit) | ~16–18 GB | [S-002] |
| Dequantized activations (bf16, at sequence length L) | `~ L * hidden * layers * 2 / checkpointing_factor` | [S-008] derived |
| LoRA parameters (bf16) | `r * (d_in + d_out) * num_modules` | [S-001] derived |
| LoRA gradients | same as LoRA params | derived |
| Optimizer state (8-bit AdamW) | ~2× LoRA params | [S-008] |
| KV cache during forward | `batch * seq_len * hidden * layers * 2 / TP` | derived |
| PyTorch + CUDA overhead | ~2–4 GB | empirical |

**The binding constraint for most tiers is the activation memory** at long sequence lengths, not the parameter memory. This is why `gradient_checkpointing=True` is not optional above a small batch.

### 7.2 Per-tier feasibility

| Tier | Fits? | Notes |
|---|---|---|
| **1x L4 (24 GB)** | Yes, with mitigation | QLoRA only; sequence ≤ 1024; batch 1; gradient checkpointing on. Expect ~3-5 sec/step. |
| **2x L4 (48 GB)** | Yes | Full-precision LoRA at rank ≤ 32, or QLoRA at rank ≤ 64. Sequence ≤ 2048. |
| **4x L4 (96 GB)** | Yes, comfortable | Full-precision LoRA at rank ≤ 64, sequence ≤ 4096. Best parity with the scorer. |
| **External multi-GPU** | Yes | Most relaxed constraints. |

**Worked arithmetic for 1x L4, QLoRA, rank 16, sequence 1024:**

- Base (4-bit): ~18 GB
- LoRA params + grads + optimizer state: ~5.5e7 params * (2 + 2 + 2) bytes ≈ 0.3 GB (8-bit AdamW)
- Activations with checkpointing: ~2-3 GB at seq 1024
- KV cache: ~0.5 GB
- Overhead: ~2 GB
- **Total: ~23 GB.** Fits in 24 GB with no margin.

Increasing to sequence 2048 approximately doubles the activation memory → **does not fit** at 1x L4 with the same config. Reduce rank or use 2x L4.

### 7.3 The mitigation ladder (in order of preference)

1. **Lower `max_seq_length`** — drops activation and KV cache quadratically-ish (more like linearly with checkpointing).
2. **Lower `r`** — drops LoRA params and optimizer state linearly.
3. **Reduce `target_modules`** — drops per-block adapter size; e.g., self-attention only.
4. **Enable `gradient_checkpointing=True`** — trades ~30% throughput for ~50% activation memory.
5. **Use `paged_adamw_8bit`** — 4× reduction in optimizer state vs fp32 AdamW.
6. **Add GPUs** — `device_map="auto"` from accelerate handles this transparently.
7. **Use a smaller base for development** — register an unquantized sibling as a local dev model; ship the QAT adapter only after local verification.

### 7.4 Multi-GPU strategies

| Strategy | Library | Best for |
|---|---|---|
| DDP (data parallel) | `accelerate` / `torchrun` | Multiple identical GPUs; fastest training |
| DeepSpeed ZeRO | `accelerate` + DeepSpeed config | Memory-constrained; large model + small batch |
| FSDP | `accelerate` | Very large models; complex setup |
| Tensor parallel | `vllm` (serving only, not training) | Serving only |

For the sizes in this competition (≤ 31B), DDP across 2–4 L4s is the cleanest training path. [S-003]

### 7.5 Wall-clock and GPU-hour estimates

> **UNMEASURED for this exact configuration.** These are order-of-magnitude estimates based on the QLoRA paper's reported throughput and the supplied digest's inference numbers. Treat as ±2× unless you measure.

| Tier | Throughput | 200-example dataset, 2 epochs |
|---|---|---|
| 1x L4, QLoRA rank 16, seq 1024 | ~3-5 sec/step (batch 1, grad accum 16) | ~4-7 hours |
| 4x L4, full LoRA rank 32, seq 2048 | ~1-2 sec/step | ~1-3 hours |
| External A100 80GB, full LoRA rank 64 | ~0.5-1 sec/step | ~30-60 min |

---

## 8. Testing and verification

> **This chapter is what separates a tutorial from a recipe.** Anyone can train an adapter. Few can prove it does what they think it does.

### 8.1 The verification ladder

| Rung | What it proves | What it does not prove | Cost |
|---|---|---|---|
| 1. Validator acceptance | The directory layout, filenames, and extensions are correct. | The adapter affects outputs. | Seconds. |
| 2. vLLM loads the adapter | The safetensors file is parseable and the config matches the rank ceiling. | The adapter affects outputs. | Seconds (server startup). |
| 3. Loud-adapter output difference | The adapter, when applied, measurably changes the model's outputs vs the base. | The adapter helps on the actual task distribution. | Minutes. |
| 4. Behavioral regression test | The adapter preserves general capabilities and adds the desired behavior. | That the improvement transfers to the public eval set. | Tens of minutes. |
| 5. Local eval set | The adapter improves (or at least doesn't hurt) on a held-out local evaluation. | That the improvement transfers to the hidden eval set. | Hours. |
| 6. Scored submission | The adapter survives the full submission pipeline (save → submit → score). | That it generalizes to all tasks; run variance is real. | Half a day. |

**Rule:** a rung 3 result is necessary but not sufficient for shipping. A rung 6 result is the gold standard.

### 8.2 The loud-adapter test

The loud-adapter test is the cheapest possible proof that your end-to-end pipeline is functional. The adapter is deliberately constructed to produce an unmistakable output difference:

```python
# Loud-adapter construction: randomize both A and B to non-zero values
from peft import LoraConfig, get_peft_model

config = LoraConfig(
    r=16,
    lora_alpha=32,
    target_modules=["q_proj", "v_proj"],  # small set for speed
    init_lora_weights="gaussian",          # NOT "True" (which would init A=Kaiming, B=0)
    bias="none",
    task_type="CAUSAL_LM",
)

model = get_peft_model(base_model, config)
# Save and serve. Compare outputs vs the base.
```

**What a null result proves and does not prove:**

| Null result | Proves | Does not prove |
|---|---|---|
| Adapter registers, loads, but outputs identical to base | The silent-zeroing defect (§2.4a) may still be affecting your config | That the path is broken for all adapters |
| Adapter fails to register | Wrong filenames, wrong path, or rank ceiling violation | Anything about adapter quality |
| Adapter crashes the server | Possibly wrong dtype or incompatible safetensors | The training method is wrong |

### 8.3 Output-difference testing

For a properly working adapter, the KL divergence or token-level edit distance between base outputs and adapter outputs (on the same prompt, same seed) should be **non-zero and meaningful** — not zero (adapter has no effect) and not catastrophic (adapter has destroyed the model).

**Concrete recipe:**
1. Take 20 prompts spanning the agent's tool-calling distribution.
2. For each prompt, run with `adapter=null` and `adapter=main_lora`, same seed, same temperature.
3. Compute token-level edit distance (or top-1 token match rate).
4. Expect: edit distance in the range [0.05, 0.40]. Below 0.05 = no effect. Above 0.40 = corrupted.

### 8.4 Behavioral regression testing

A small set of "smell test" trajectories that demonstrate the desired behavior:

- "Given a failing test, the model should use `read_file` to inspect the test before editing."
- "Given a Python `ImportError`, the model should add the import to the right `__init__.py`."
- "Given a request that needs internet access, the model should fail gracefully (sandbox is offline)."

For each, define the expected tool-call sequence and the expected final text response. A passing regression test is one where the adapter's outputs match the expected behavior on ≥ 80% of the test set.

### 8.5 The competition-side canary (the cheapest possible submission)

The canary is a submission whose adapter is the loud adapter (§8.2). You are not trying to score well. You are trying to learn whether the scoring pipeline accepts, loads, and applies your adapter.

**Expected outcomes and what they mean:**

| Outcome | Meaning | Next step |
|---|---|---|
| Submission accepted, adapter loaded, score > base | Adapter path is fully functional | Proceed with real training |
| Submission accepted, adapter loaded, score = base | Silent-zeroing defect may be live; investigate | Re-run canary with a different rank; check KV cache |
| Submission rejected at validator | Filenames or layout wrong | Fix layout; resubmit |
| Submission crashes the server | Probably the KV-collapse or a dtype mismatch | Reduce rank; check safetensors |

**Cost of the canary:** A scored submission takes 12-14.5 hours on the L4×4 queue plus the 2× quota deduction. Do not run it more than once unless you have a specific reason. [S-005]

### 8.6 The three null-cases

> **This is the highest-value section in Part I for a reader who has trained an adapter that "doesn't work."**

Three different failures all present as "the adapter didn't help." They require different diagnoses.

| Case | What it looks like | How to distinguish | Fix |
|---|---|---|---|
| **(A) Empty adapter** | Adapter loads, output identical to base. `adapter_model.safetensors` is very small or all-zero. | Inspect the safetensors: `torch.load(file).abs().sum()` should be > 0. | Re-train; check `init_lora_weights`. |
| **(B) Not registered** | Adapter fails to register at vLLM startup; no "LoRA adapter ... registered" log line. | Check server startup logs. | Verify the path passed to `--lora-modules`; verify both filenames exist. |
| **(C) Registered but no effect** | Adapter registers, no errors, but outputs identical to base at the same seed. | Use the loud-adapter test. If the loud adapter produces the same null result, the problem is upstream. | Investigate the silent-zeroing defect; check the wheelhouse version. |

**The trap:** treating case (C) as case (A) and concluding "the adapter doesn't help, don't ship it" — when in fact the path is broken. Always run the loud adapter to disambiguate.

### 8.7 Failure-signature catalog by layer

| Layer | Symptom | Cause | Fix |
|---|---|---|---|
| Training | Loss stays flat for > 100 steps | `lora_alpha` too small; wrong learning rate; wrong target modules | Verify `lora_alpha/r` ≥ 1; raise LR; check modules |
| Training | Loss diverges (NaN) | LR too high; bf16 instability | Lower LR; use `bf16_full_eval=False`; clip gradients |
| Training | Adapter file > 1 GB unexpectedly | `target_modules="all-linear"` | Restrict to specific modules |
| Export | `adapter_model.bin` instead of `.safetensors` | Old PEFT default; or `safe_serialization=False` | Use `safe_serialization=True` (default in PEFT 0.11+) |
| Export | `adapter_config.json` missing `target_modules` | Pre-PEFT 0.4 vintage | Re-install PEFT |
| Validator | Submission rejected | Wrong filenames, wrong extension, or extra files in adapter dir | Conform to §2.1 contract |
| Serving | "does not support LoRA yet" | Stock PyPI vLLM | Install wheelhouse vLLM |
| Serving | KV cache collapse | `max_loras × max_lora_rank` preallocation | Wait for host fix; reduce adapter count |
| Serving | "rank N > max_lora_rank 128" | Trained at rank > 128 | Re-train at rank ≤ 128 |
| Routing | `adapter:` field rejected | Directory name mismatch | Match case and spelling exactly |

---

## 9. Troubleshooting

This chapter consolidates the failure signatures into a quick-reference index for the beginner. For the full hazard register with dates, tiers, and defenses, see §20.

### 9.1 By layer

**Training-time failures:**
- Loss won't decrease → see §8.7.
- Out of memory → §7.3 mitigation ladder.
- Adapter file is too big → §1.2 derivation; reduce rank or modules.

**Export failures:**
- Wrong file extensions → §2.1.
- Missing config keys → verify PEFT version ≥ 0.11.

**Packaging failures:**
- Rejected by validator → §2.1.
- Size budget exceeded → §2.5.

**Serving failures:**
- Won't load → wheelhouse (§4); rank ceiling (§7.5); filenames (§2.1).
- Loads but no effect → §8.6 three-null-cases.

**Runtime failures (in the scorer):**
- Adapter stalls on long prompts → KV-cache collapse (§2.4b).
- Adapter zeros out → silent-zeroing defect (§2.4a).
- Adapter rewrites thinking → thinking-mode defect (§2.6).

### 9.2 The "is it me or is it the harness?" decision tree

```
Adapter doesn't work
├── Did you pass the loud-adapter canary?
│   ├── Yes → The harness is fine; debug your adapter (case A or C)
│   └── No  → Is the loud adapter also broken?
│       ├── Yes → Likely harness defect (case B or C)
│       └── No  → Your specific adapter is broken (case A)
```

### 9.3 What newcomers get wrong

1. Trusting a successful load as proof of effect.
2. Skipping the loud-adapter canary.
3. Training at rank > 128.
4. Not using the wheelhouse.
5. Treating "loss went down" as proof of improvement.
6. Skipping loss masking configuration.

---

## 10. Improving the model: what actually helps

> **The single most important finding of this document.** Most of the score gains on this benchmark come from non-adapter work.

### 10.1 Ordered by expected value for a competition reader

| Effort | Expected movement on Resolution Rate | Time cost | Risk |
|---|---|---|---|
| **1. Prompt and instruction quality** | High — typically 0.05-0.15 | Hours | Low |
| **2. Tool-use discipline and prompt structure** | High — 0.05-0.10 | Hours to days | Low |
| **3. Context management (delegating to sub-agents)** | Medium — 0.03-0.08 | Days | Low |
| **4. Multi-agent architecture** | Medium — 0.03-0.08 | Days | Medium |
| **5. Skills and prompt templates** | Low-medium — 0.02-0.05 | Hours | Low |
| **6. Adapter training (SFT)** | Low-medium — 0.01-0.05 (if it works) | Days | High (defect cluster) |
| **7. Adapter training (DPO/RL)** | Speculative — unknown for this task | Weeks | High |

**The ordering matters.** A reader with 30 hours/week of Kaggle compute who spends the first week on adapter training instead of prompt engineering is making a worse allocation than one who spends the week on prompts and the second week on adapters.

### 10.2 Why adapter training is risky here

Three reasons:

1. **Adapter path is gated.** Until the canary passes, training is preparation for a path that may not function.
2. **Local CV does not predict the leaderboard.** The supplied digest records CV/LB anti-correlation: Isaka Tsuyoshi's CV 0.18/0.19/0.23/0.24 mapped to LB 0.05/0.06/0.12/0.10 (highest CV = lowest LB in some cases). Local grading is broken for fastapi (54/67 gold-fail) and requests (SSL-dead on Python 3.13). [S-005]
3. **Run variance is real.** A direct fork of the same submission scored 0.12 and 0.08 in different runs. ±0.04 noise at this score level is huge. [S-005]

### 10.3 The recommendation for a time-boxed competitor

1. Spend day 1 on the official sample submission as-is. Establish a baseline.
2. Spend days 2–4 on prompt and instruction improvements. Push the baseline up by 0.05+ before touching adapters.
3. Spend days 5–7 on the loud-adapter canary. If the path works, proceed. If not, allocate the time to more prompt work.
4. If adapter work proceeds, spend the second week training and validating a small adapter. Submit. Measure against baseline.
5. The third week, if needed, explores DPO or alternative adapter strategies.

The plan above is roughly consistent with the supplied strategy deliverable's sprints. [S-005]

---

# Part II — Intermediate

## 11. Training deeper

### 11.1 Sequence length and truncation

For agent trajectories, the full prompt includes the system message, problem statement, prior turns, and the new turn. For long trajectories, you have three choices:

| Strategy | Pros | Cons |
|---|---|---|
| **Truncate from the front** | Preserves recent context | Loses the original problem statement |
| **Truncate from the back** | Preserves the problem | Loses recent context |
| **Skip too-long examples** | Clean | Wastes data; can introduce distribution shift |

For tool-calling trajectories, **truncating from the front is usually wrong** because the problem statement is load-bearing. Truncating from the back (drop oldest tool calls/results) is often acceptable when there are many turns. For dataset construction, **filter examples that exceed your max_seq_length** rather than truncating, to preserve training integrity.

### 11.2 Packing

Sequence packing concatenates multiple short examples into a single sequence up to `max_seq_length`. This improves throughput on a GPU with lots of spare memory. For tool-calling trajectories where the average length is much less than `max_seq_length`, packing can give 2-3× throughput.

**The hazard with packing:** if your loss masking is configured per-example and packing just concatenates raw sequences, the loss will be computed over tokens from multiple examples in confusing ways. TRL's SFTTrainer with `packing=True` handles this correctly by setting the loss to zero on the non-first-example tokens of a packed sequence. [S-003]

### 11.3 Loss-masking correctness — the dominant variable

Tool-calling trajectories have a strict structure: tool calls must be valid JSON; tool results are JSON; assistant text is free-form. The loss should be computed only over the assistant turns (the model's output), not the user/harness turns (the input).

**TRL's `assistant_only_loss=True`** handles this by requiring the chat template to mark assistant tokens (typically with `{% generation %} ... {% endgeneration %}` blocks in the Jinja template). For Gemma 4's chat template, you must verify the template includes these markers. If it does not, the assistant-only loss configuration will silently fall back to whole-sequence loss.

**Failure mode:** "loss goes down but the adapter doesn't help." The model is learning to predict the user's tool results, not its own actions. Verify by training for 50 steps and inspecting the loss curve — if the loss decreases at a suspiciously steady rate from step 0, you may be supervising the wrong tokens. [S-003]

### 11.4 Precision and gradient checkpointing trade-offs

| Precision | Memory | Speed | Quality |
|---|---|---|---|
| `bf16` | 2 bytes/param | Fast | Excellent on Ampere+ |
| `fp16` | 2 bytes/param | Fast | Risk of overflow; requires loss scaling |
| `fp32` | 4 bytes/param | Slow | Best numerical accuracy; rarely needed with bf16 |

For LoRA training, **bf16 throughout is the standard choice**. The LoRA adapters live in fp32 by default in some PEFT versions; verify with `model.print_trainable_parameters()`.

Gradient checkpointing reduces activation memory by ~50% at the cost of ~30% throughput. It is enabled by default in most QLoRA setups.

### 11.5 Hyperparameter sensitivity

| Parameter | Sensitivity | Where to start |
|---|---|---|
| Learning rate | High | 2e-4 (rank ≤ 32); 1e-4 (rank 64–128) |
| Rank | Medium | 16 for tool-calling; 32 for harder tasks |
| Target modules | Medium | All 7 for capacity; q/v only for size |
| Dropout | Low | 0.0 to 0.1 |
| Batch size (effective) | Medium | 8 to 32 |

### 11.6 Reading a training curve

| Shape | Cause | Response |
|---|---|---|
| Loss decreases steadily, plateaus near base | Normal for behavior shaping | Train longer; add capacity (rank or modules) |
| Loss decreases, then increases | LR too high or overfitting | Lower LR; add dropout; fewer epochs |
| Loss flat from step 0 | Wrong LR (too low) or wrong loss masking | Verify masking; raise LR |
| Loss oscillates wildly | Batches too varied; LR too high | Lower LR; sort by length; larger grad accum |
| Loss collapses to 0 | Data leak; trivial examples | Audit dataset for contamination |

### 11.7 Three named curve failure shapes

1. **The flat line.** Loss does not decrease. Likely: wrong loss masking, or wrong learning rate, or wrong target modules. Diagnostic: train with `init_lora_weights="gaussian"` and verify the loss moves; if it does, the issue was the initialization.
2. **The cliff.** Loss decreases, then suddenly spikes and stays high. Likely: numerical instability (NaN gradients). Diagnostic: switch to `fp32` LoRA weights, lower LR, add gradient clipping (`max_grad_norm=1.0`).
3. **The plateau-too-high.** Loss decreases but plateaus above the desired level. Likely: insufficient capacity (rank too low, modules too narrow). Diagnostic: increase rank by 2× and retrain.

---

## 12. Data at scale

### 12.1 Scaling beyond a small set

At a few hundred trajectories, your adapter is teaching the model your specific examples rather than a general behavior. To go beyond, you need either:

- **More high-quality data from the same distribution** — explore open-source trajectory datasets (with license compliance).
- **Synthetic augmentation** — paraphrasing, additional context, edge cases.
- **Multi-task mixture** — combining tool-calling with general code completion and instruction following.

### 12.2 Quality-over-quantity filtering

A simple filter that improves quality:

1. Run the base model on the training task.
2. Keep only trajectories where the base model's patch resolves the task.
3. Add a small number of "near-miss" trajectories where the base failed but a corrected version resolved it.

This filters out the noise and keeps the signal. Do not over-filter — you want diversity, not just the easy cases.

### 12.3 Curriculum ordering

Order examples from easy to hard. The model sees clean tool-calling patterns first, then ambiguous ones, then failure modes. A constant random shuffle works but a curriculum typically converges faster.

### 12.4 Practical limits of self-generated data

| Limit | Implication |
|---|---|
| Bounded by base model quality | Cannot teach new capabilities |
| Bias amplification | Repeated iteration narrows the distribution |
| Compute cost | Generating trajectories is expensive |
| License compliance | Distillation from closed APIs is forbidden by ToS |

---

## 13. Multi-adapter architecture

### 13.1 The design space

A submission can have multiple adapters, each tied to a different agent role. The design space is:

- **One adapter for all agents** — simplest; one behavior-shaping across the whole hierarchy.
- **One adapter per agent role** — coder agent, analyzer agent, search agent.
- **Multiple specialized adapters for the same role** — different adapters for different problem types (requires a router, which the harness does not provide).

The simplest design is usually best. Specialization costs (sizing, training, debugging) often exceed the gain.

### 13.2 Sizing arithmetic

For a 31B model with all 7 projections:

| Rank | Adapter size (bf16) | Adapters in 3 GiB alone | With 1 GiB headroom for YAML/prompts |
|---|---|---|---|
| 16 | 110–220 MB | 13–27 | 9–18 |
| 32 | 220–450 MB | 6–13 | 4–9 |
| 64 | 450–900 MB | 3–6 | 2–4 |
| 128 | 0.9–1.8 GB | 1–3 | 1–2 |

**The total budget is < 3 GiB, including everything in the submission.** Adapters compete with prompts, sub-agent configs, skill directories, and the agent.yaml for space. Plan accordingly.

### 13.3 Serving count and rank ceilings

`max_loras = 8` and `max_lora_rank = 128` are participant-not-configurable. You can register up to 8 adapters in a single submission, but each must be rank ≤ 128. [S-002]

### 13.4 Cache and throughput consequences

vLLM preallocates GPU memory for the maximum number of adapters at the maximum rank. Setting `max_loras=8` and `max_lora_rank=128` preallocates roughly **1.74 GiB/GPU** of LoRA buffer, which directly causes the KV-cache collapse described in §2.4b. Until the host deploys the dynamic-size fix, every adapter you register consumes more KV cache. [S-005]

### 13.5 The single-versus-multiple break-even

One well-trained adapter beats several narrow ones when:
- Your narrow adapters are not sufficiently specialized (most are not — they share 90%+ of the behavior).
- The throughput cost of multiple adapters hurts more than the specialization gain.

A reasonable rule of thumb: **start with one adapter per agent role**, not one adapter per agent. If you find evidence that different roles genuinely need different behavior, split.

### 13.6 Multi-adapter failure modes

- **Routing confusion** — if two agents share an adapter name (or the `adapter:` field is misspelled), the wrong adapter loads.
- **Size budget overflow** — adding a fourth rank-64 adapter can push you over 3 GiB.
- **KV cache collapse amplified** — more adapters = more preallocation = smaller usable context.

---

## 14. Preference optimization (DPO)

### 14.1 What DPO is, at intermediate depth

Direct Preference Optimization (Rafailov et al., NeurIPS 2023) trains a model on pairs of (chosen, rejected) responses to the same prompt, without a separate reward model or reinforcement learning loop. [S-011]

The loss is approximately:
$$
\mathcal{L}_{\text{DPO}} = -\mathbb{E}_{(x, y_w, y_l)} \left[ \log \sigma\left( \beta \log \frac{\pi_\theta(y_w | x)}{\pi_{\text{ref}}(y_w | x)} - \beta \log \frac{\pi_\theta(y_l | x)}{\pi_{\text{ref}}(y_l | x)} \right) \right]
$$

For tool-calling agents, the "chosen" response could be a trajectory that resolves the task; the "rejected" response could be one that doesn't. The model learns to prefer the chosen behavior.

### 14.2 What DPO needs

- **Pairs of (prompt, chosen, rejected) trajectories.** The chosen one should be demonstrably better than the rejected one on the same prompt.
- **A reference model** — typically the SFT model, frozen.
- **Compute similar to SFT** — same LoRA setup, but you need memory for both the policy and the reference model (or a clever sharing trick).

### 14.3 When DPO beats SFT

DPO is most useful when:

- You have natural preference data (e.g., trajectories that pass vs trajectories that fail on the same task).
- SFT has plateaued and you want a different signal.
- The reward signal is binary (pass/fail) and you want to push the model toward the passing behavior.

For this competition, DPO on (pass, fail) trajectory pairs is a plausible second stage after SFT.

### 14.4 When DPO does not beat SFT

- When you have very few preference pairs (DPO overfits to the preferences).
- When the chosen/rejected distinction is noisy (DPO amplifies noise).
- When the metric is binary and you have direct trajectories that pass — just SFT on those.

### 14.5 DPO failure modes

- **Reward overoptimization** — the model finds a stylistic feature (e.g., length) that correlates with "chosen" and exploits it.
- **Reference drift** — if you inadvertently fine-tune the reference, the implicit reward signal becomes meaningless.
- **Distribution narrowing** — DPO on narrow preferences makes the model less diverse.

### 14.6 Cost/benefit for this competition

For a time-boxed competitor with limited compute and a binary pass/fail metric:

- **SFT on passing trajectories** is simpler and uses less compute.
- **DPO** adds complexity (need pairs, reference model) for a potentially modest gain.
- **GRPO/RLVR** (§16) is even more complex and is primarily attractive for the paper track.

**Recommendation:** Start with SFT. Move to DPO only if SFT plateaus and you have time.

---

## 15. The go/no-go decision

### 15.1 The decision tree

```
Should I ship an adapter?
│
├── Is the canary passing? (See §8.5)
│   ├── No  → DO NOT SHIP AN ADAPTER. Spend time on prompts.
│   └── Yes → Continue
│
├── Do I have working local evaluation?
│   ├── No  → Use the canary as your only signal; ship a non-adapter submission
│   └── Yes → Continue
│
├── Does my adapter pass the loud-adapter test? (§8.2)
│   ├── No  → Debug the adapter (case A or C, §8.6)
│   └── Yes → Continue
│
├── Does my adapter improve over the no-adapter baseline locally?
│   ├── No  → The adapter is not helping. Ship without it.
│   ├── Yes but < 0.02 → Marginal. Submit as a hedge.
│   └── Yes > 0.02 → Consider shipping.
│
└── Is the time-box approaching?
    ├── Yes → Ship your best so far (with or without adapter)
    └── No  → Iterate; consider DPO if SFT plateaus
```

### 15.2 The "do not ship an adapter" option

This is a legitimate and often correct outcome. The competition does not require an adapter; it requires a high Resolution Rate. If your time is better spent on prompts, agent design, and skills, do that. [S-005]

### 15.3 The ablation design

What to measure, in what order:

1. **Baseline.** Submit your best non-adapter prompt/agent design. Record the score.
2. **Loud-adapter canary.** Verify the path works.
3. **Small adapter.** Train a rank-16 adapter on 200 trajectories. Submit.
4. **Compare.** If the small adapter improves over baseline, train a rank-32 variant.
5. **Compare.** If rank-32 improves over rank-16, try all-modules vs q/v-only.
6. **Stop** when the gains diminish or the deadline approaches.

### 15.4 The honest limitations statement

This decision tree assumes:

- The local evaluation environment is roughly representative of the scorer (it is not — local CV/LB anti-correlates).
- The canary correctly predicts scored behavior (it should, but the KV-cache collapse is a serving-side concern that the canary may not catch).
- The reader has time for an iteration cycle.

If any of these assumptions is wrong, the recommendation changes.

---

# Part III — Advanced

## 16. Verifiable-reward RL (GRPO/RLVR)

### 16.1 What verifiable-reward RL is

Reinforcement learning with verifiable rewards (RLVR) trains a model on a binary (or graded) signal that can be computed automatically — for this competition, the per-task PASS/FAIL outcome. Group Relative Policy Optimization (GRPO, Shao et al., DeepSeekMath, 2024) is a popular variant that removes the value model and computes advantages relative to a group of sampled outputs. [S-012]

### 16.2 What a pass/fail outcome can and cannot teach

| Can teach | Cannot teach |
|---|---|
| "These trajectories resolve the task; prefer them" | "Why this trajectory is better than a similar one that also resolves" |
| A general preference for tool-calling behavior | The specific style or structure of an optimal trajectory |
| To avoid obviously-broken trajectories | Subtle improvements in trajectory quality |

### 16.3 Reward design hazards

For this competition, the obvious reward is +1 for resolved, 0 for unresolved. This is a **sparse binary signal** — a hard signal for these methods.

**Failure modes:**

- **Reward hacking.** The model finds a way to "resolve" tasks trivially (e.g., submitting an empty patch that the test suite happens to accept). This is rare for SWE-bench but possible.
- **Format collapse.** The model learns to produce well-formatted tool calls but not actually correct ones. The reward is +1 either way, so format dominates.
- **Trajectory length bias.** Longer trajectories have more chances to do something useful; the model may learn to drag out trajectories.

### 16.4 The cost/benefit for this competition

| Aspect | SFT | DPO | GRPO/RLVR |
|---|---|---|---|
| Data needed | Trajectories | Preference pairs | Sampled trajectories with reward |
| Compute needed | Low-medium | Medium (reference model) | High (sampling + training) |
| Stability | High | Medium | Low |
| Suitability for paper track | Low | Medium | High |

**For the prediction competition, GRPO/RLVR is rarely the right answer** for a time-boxed competitor. It is primarily attractive for the paper track, where the methodology itself is the contribution.

### 16.5 Stability and reproducibility burden

RL methods are notoriously unstable. Hyperparameters that work on one model often fail on another. For a competition with a binary metric and limited compute, the failure modes are more expensive than the potential gains.

### 16.6 The small settling experiment

If you want to evaluate GRPO for your case:

1. Generate 100 trajectories on 10 tasks with the SFT model.
2. Score them as pass/fail.
3. Apply GRPO for 200 steps on the passing trajectories as positive examples.
4. Evaluate on a held-out 5-task set.
5. Compare to SFT-only.

If GRPO improves over SFT by > 0.03 on your held-out set, it is worth pursuing. If not, stick with SFT.

---

## 17. Deep optimization: variants and initialization

### 17.1 LoRA variants

| Variant | What it changes | Reported trade-off |
|---|---|---|
| **rsLoRA** [S-005] | $\alpha/\sqrt{r}$ scaling instead of $\alpha/r$ | More stable at higher ranks; same memory |
| **DoRA** [S-006] | Magnitude/direction decomposition | Reported modest quality gain; slower training; only Linear/Conv2d modules |
| **AdaLoRA** [S-007] | Adaptive rank allocation | Reported quality gain at same param count; complex setup |

For this competition's size and constraints, **vanilla LoRA is usually the right starting point.** Variants add complexity without proven gains at the ranks used here.

### 17.2 Initialization strategies

| Strategy | What it does | When to use |
|---|---|---|
| `init_lora_weights=True` (default) | Kaiming-uniform A, zero B | Default; safe; slow start |
| `init_lora_weights="gaussian"` | Gaussian A, zero B | Diffusers default; faster start |
| `init_lora_weights="pissa"` | PiSSA: principal singular components of W | Faster convergence on hard tasks |
| `init_lora_weights="olora"` | OLoRA: orthogonal init | Stable; modest gains |
| `init_lora_weights="eva"` | EVA: gradient-based init | Faster convergence; complex |
| `init_lora_weights="loftq"` | LoftQ: init to approximate unquantized W | Best for heavily quantized bases |

**For the QAT-quantized base here, LoftQ initialization is plausible** — the weights are already QAT-robust, and LoftQ's approximation of an unquantized target is a reasonable starting point. Verify with a small ablation before committing.

### 17.3 The merge-versus-serve question

For this competition: **serve, don't merge.** The base is host-provided and quantized. Merging changes the quantization story and complicates any future rollback. The serving path explicitly supports adapter dispatch.

The one place merging is useful: local sanity-checking. If you want to verify the trained adapter's effect by computing $W + (\alpha/r)BA$ once and inspecting outputs, merging is fine. Just don't ship it.

---

## 18. Advanced serving and efficiency

### 18.1 Cache and throughput behavior

vLLM's KV cache is sized based on `max_model_len` minus the LoRA buffer preallocation. With `max_loras=8` and `max_lora_rank=128`, the LoRA buffer consumes ~1.74 GiB/GPU (per the supplied digest's analysis), reducing usable KV cache from 46k to 7.6k tokens. [S-005]

Until the host deploys the dynamic-size fix:

- Submitting with adapters reduces your effective context from 32k to ~7.6k tokens.
- 99% of episodes exceed 7.6k prompt tokens → adapter submissions stall on nearly every task.

**Mitigation while waiting for the fix:** submit without adapters.

### 18.2 What you can and cannot control

| Can control | Cannot control |
|---|---|
| Number of adapters (≤ 8) | `max_loras` |
| Rank per adapter (≤ 128) | `max_lora_rank` |
| Adapter names and content | Tensor parallel size |
| Token budget in `eval_config.yaml` | GPU memory utilization |

### 18.3 Prefix caching and prompt caching

vLLM supports prefix caching automatically. Identical prefixes across requests reuse KV computation. For agents, this means identical system prompts and problem-statement prefixes benefit. The harness-side `ContextCacheConfig` (`min_tokens = 2,048`) gates when prefix caching activates.

---

## 19. Methodology and reproducibility

> **Optional section for paper-track readers.** Not required for the prediction competition.

### 19.1 What to record for trustworthy results

For every adapter run:

- Base model identifier and version
- Library versions (peft, trl, transformers, accelerate, bitsandbytes)
- Training data version (hash + commit/license reference)
- Hyperparameters with provenance labels
- Hardware (GPU model, count, VRAM, interconnect)
- Wall-clock and GPU-hour cost
- Random seed for the training run
- Random seed for the evaluation run
- Score on at least one held-out local evaluation set
- Score on the leaderboard (if applicable)

### 19.2 Ablation-supportive practice

For each hyperparameter change, run an ablation. Hold all else constant. Report the delta with uncertainty (multiple seeds).

### 19.3 Paper-track angle

If you intend to write a paper for the parallel paper track:

- Frame findings as harness-independent lessons.
- Include methodology detail sufficient for reproduction.
- Tie to the open-model-on-consumer-hardware mission.
- Make genuine use of code graphs and embeddings (the panel's taste).

---

## 20. The hazard register

> **This is the most-decaying content in the document. Re-check status before relying on any item here.**

| ID | Hazard | Status (as of 2026-09-30) | Tier | Defense | Removal criterion |
|---|---|---|---|---|---|
| H-01 | Silent adapter zeroing (duplicate layer registration) | Fix in wheelhouse v23/v25; not independently confirmed live | Host-stated + multi-repro | Loud-adapter test | When canary consistently passes on the scorer |
| H-02 | KV-cache collapse from LoRA buffer preallocation | Fix promised 9/30 ~16:05 UTC; not confirmed deployed | Host-stated + multi-repro | Submit without adapters until fix is live | When scored adapter submissions stop stalling |
| H-03 | Stock PyPI vLLM refuses LoRA for Gemma 4 | Workaround: wheelhouse | Host-stated | Use wheelhouse vLLM | N/A (permanent workaround) |
| H-04 | Double-JSON escaping of tool results | Host "addressing now" 9/29 | Host-stated | Wait for fix; raw-text rendering works in controlled experiment | When patch lands |
| H-05 | Thinking thoughts dropped (`reasoning_content` vs `reasoning`) | Patch incoming; no re-score | Host-stated | Re-probe after deployment | When patch lands |
| H-06 | `search_similar_code` unbounded output | Host will cap "like other tools" 9/30 ~18:35 UTC | Host-stated | Specific function/method queries; `get_code_neighbors` first | When cap deployed |
| H-07 | 12-hour overrun errors the entire submission | Fix planned (score 0 for unfinished); not deployed | Host-stated | Set `max_time_minutes` to moderate value | When fix deployed |
| H-08 | 9/26 mass "resource" failures | Fixed; rerun status unclear | Host-stated | Re-check status before assuming old scores final | When rerun backlog cleared |
| H-09 | Local CV/LB anti-correlation (fastapi gold-fail 54/67, requests SSL-dead) | Local-only; hidden set is clean per host | Host-stated + multi-repro | Trust scored submissions over local CV | N/A |
| H-10 | `read_file` with line ranges TypeError | Unverified, single report 9/30 19:00 UTC | Single-participant | Verify on Day 0; use full reads | When confirmed |
| H-11 | Run-to-run variance (±0.04 at score 0.12) | Inherent to temperature sampling | Multi-repro | Multiple runs; report variance | N/A |

**Self-inflicted failure catalog (separate from harness defects):**

| ID | What you do wrong | Symptom | Distinguishing feature | Fix |
|---|---|---|---|---|
| SI-01 | Train at rank > 128 | "rank N > max_lora_rank 128" | Clear error message | Train at rank ≤ 128 |
| SI-02 | Forget the wheelhouse | "does not support LoRA yet" | Clear error message | Install wheelhouse vLLM |
| SI-03 | Wrong loss masking | Loss goes down; no behavior change | Quiet; dangerous | Verify `assistant_only_loss=True` and template markers |
| SI-04 | Use pickle weights | Validator rejection | Clear error message | Use `.safetensors` |
| SI-05 | Wrong `adapter:` name | Validation rejection | Clear error message | Match directory name exactly |
| SI-06 | Skip the loud-adapter canary | Silent failure later | Auditable | Run the canary before training |
| SI-07 | Trust local CV | Submit; score is worse | Anti-correlation data | Treat local CV as noisy; submit multiple variants |

---

## 21. What is unknown

This document is honest about what it does not know:

1. **Whether the KV-cache fix has deployed.** The host promised it on 9/30 ~16:05 UTC. As of the digest date, no scored adapter submission has succeeded. **Re-check the forum before relying on this section.**
2. **Whether the silent-zeroing fix works in all configurations.** Wheelhouse v25 is current; participant repro on v25 still showed no effect (with a caveat about the sample adapter's `lora_A`).
3. **Whether the scoring environment's pydantic and starlette versions match what the supplied digest describes.** The digest reports wheelhouse ships pydantic 2.13.4 but not `typing_inspection`; Kaggle's notebook image ships pydantic 2.12.3 + typing-inspection preinstalled. The exact scorer environment may differ.
4. **The exact behavior of `read_file` with line ranges.** Single unverified report.
5. **The expected movement from adapter training on this specific base.** No controlled comparison exists in the public digest.
6. **The exact relationship between rank and adapter size for the full Gemma 4 architecture.** Sizes here are derived from general transformer-block structure; the exact hidden dimensions and per-projection sizes should be verified from the model config.
7. **The replay path after the 9/26 rerun.** Status unclear in the digest.

**Bounded negative findings (recorded as searches that found no support):**

- A direct web search for "gemma-4" architecture details returned no specific public information as of the cutoff. The architecture here is derived from general Gemma patterns and should be verified from the model config.

---

## Appendices

### Appendix A: Master adapter-constraint table

See `lora-competition-surface.md` in this deliverable folder for the standalone extractable version. Summary:

| Rule | Value | Source | Enforcement | Reader consequence |
|---|---|---|---|---|
| Total submission size | `< 3 GiB` (3,221,225,472 bytes) | [S-002] | Validator | Oversized submissions rejected |
| `adapters/` extensions | `.safetensors` only | [S-002] | Validator | Pickle weights rejected |
| Required filenames | `adapter_config.json` + `adapter_model.safetensors` | [S-002] | Validator | Submission rejected |
| Single base model | `gemma-4-31b-it-qat-w4a16-ct` only | [S-002] | `validate_single_declared_model` | Multiple-base submissions rejected |
| `max_loras` (serving) | 8 | [S-002] | vLLM flag, not participant-configurable | > 8 adapters rejected |
| `max_lora_rank` (serving) | 128 | [S-002] | vLLM flag, not participant-configurable | > rank 128 rejected |
| `tensor_parallel_size` (serving) | 4 | [S-002] | Server startup | Fixed by scorer |
| `gpu_memory_utilization` (serving) | 0.80 | [S-002] | Server startup | Fixed by scorer |
| `max_model_len` (serving) | 32,768 | [S-002] | Server startup | Fixed by scorer |

### Appendix B: Configuration-key reference

See §1.3 for the full `peft.LoraConfig` reference. See Appendix E for hyperparameter provenance labels.

### Appendix C: Sizing and memory tables

See §1.2 for the parameter derivation. See §7.2 for the per-tier feasibility table.

### Appendix D: Artifact catalog

| Artifact | Path | Badge | Evidence |
|---|---|---|---|
| Loud-adapter canary | `training-recipes/00-loud-adapter-canary.md` | SCHEMA-CHECKED | Verified against PEFT 0.11+ docs |
| Minimal SFT recipe | `training-recipes/01-minimal-sft.md` | SCHEMA-CHECKED | Verified against TRL 0.10+ docs |
| Adapter config (rank 8) | `adapter-ladder/rank-8-minimal.json` | SCHEMA-CHECKED | Field-by-field check against PEFT |
| Adapter config (rank 16, all-mod) | `adapter-ladder/rank-16-all-modules.json` | SCHEMA-CHECKED | Field-by-field check against PEFT |
| Adapter config (rank 64, qv-only) | `adapter-ladder/rank-64-qv-only.json` | SCHEMA-CHECKED | Field-by-field check against PEFT |
| Loud-adapter init snippet | `adapter-ladder/loud-adapter-init.py` | ILLUSTRATIVE | Cannot execute in this environment |

### Appendix E: Hyperparameter reference with provenance labels

See §6.2 for the full table with `derived` / `borrowed convention` / `tune yourself` labels.

### Appendix F: Search and research log

| Search | Engine | Date | Hits screened | Inclusion criteria |
|---|---|---|---|---|
| "LoRA Low-Rank Adaptation paper Hu et al 2021" | WebSearch | 2026-10-01 | 5 | Primary method paper |
| "PEFT library LoraConfig target_modules r lora_alpha" | WebSearch | 2026-10-01 | 8 | Official library docs |
| "QLoRA Dettmers 4-bit quantized base training" | WebSearch | 2026-10-01 | 3 | Primary method paper |
| "vLLM LoRA serving max_loras max_lora_rank enable_lora" | WebSearch | 2026-10-01 | 4 | Official vLLM docs |
| "DPO Direct Preference Optimization paper Rafailov 2023" | WebSearch | 2026-10-01 | 5 | Primary method paper |
| "GRPO Group Relative Policy Optimization paper DeepSeek" | WebSearch | 2026-10-01 | 6 | Primary method paper |
| "gemma-4 model architecture Hugging Face" | WebSearch | 2026-10-01 | 0 | Bounded negative finding |

### Appendix G: Verification ledger and traceability matrix

| Claim ID | Claim | Source ID | Version | Tier | Chapter | Staleness |
|---|---|---|---|---|---|---|
| C-001 | LoRA freezes W, trains A, B | [S-001] | arXiv:2106.09685 (2021) | V3 | §1.1 | Slow |
| C-002 | PEFT default r=8, alpha=8 | [S-003] | PEFT 0.11+ | V3 | §1.3 | Medium |
| C-003 | QLoRA uses 4-bit NF4 + double quant + paged optim | [S-008] | arXiv:2305.14314 (2023) | V3 | §1.5 | Slow |
| C-004 | vLLM max_loras=8, max_lora_rank=128 (serving config) | [S-002] | HARNESS_README 2026-09-30 | V3 | §2.5 | Fast |
| C-005 | Submission size < 3 GiB | [S-002] | HARNESS_README 2026-09-30 | V3 | §2.5 | Medium |
| C-006 | Silent adapter zeroing defect | [S-005] | 03-discussion-board-intel.md 2026-09-30 | V1 | §2.4a | Fast |
| C-007 | KV-cache collapse from LoRA buffer | [S-005] | 03-discussion-board-intel.md 2026-09-30 | V1 | §2.4b | Fast |
| C-008 | Stock vLLM refuses LoRA for Gemma4 | [S-005] | 03-discussion-board-intel.md 2026-09-30 | V1 | §2.4c | Fast |
| C-009 | DPO loss formulation | [S-011] | arXiv:2305.18290 (2023) | V3 | §14.1 | Slow |
| C-010 | GRPO formulation | [S-012] | arXiv:2402.03300 (2024) | V3 | §16.1 | Slow |

### Appendix H: Glossary

See §1 for the core vocabulary and §2.4 for competition-specific terms. Additional:

- **Canary**: A deliberately conspicuous test submission whose only purpose is to verify the pipeline.
- **Cross-source triangulation**: Confirming a claim against two independent sources rather than one.
- **Disambiguation question**: A question that, when asked, distinguishes two commonly-confused concepts.
- **Snapshot-versus-current divergence log**: A first-class record of differences between an old reference (snapshot) and current sources.
- **V0 / V1 / V2 / V3**: Verification tiers. V3 is the strongest.

### Appendix I: Audit report

**Defects found and disposition:**

| Defect ID | Description | Severity | Disposition |
|---|---|---|---|
| D-01 | Gemma 4 exact architecture not verified from public sources | Medium | Bounded negative finding (§21); derived from general patterns |
| D-02 | No artifact executed; all are SCHEMA-CHECKED | High (expected) | Documented in document header and Appendix D |
| D-03 | Adapter-serving defect statuses will decay rapidly | High (by design) | Documented in stability warning and Appendix J |
| D-04 | Local CV/LB anti-correlation not addressable from this document | Medium | Documented in §10.2 and §21 |

**Version-discipline audit:** Every default, key, constraint, and size figure carries a version or a `[computed]` label. No unversioned defaults in instructional text.

**Arithmetic audit:** Parameter counts (§1.2), adapter sizes (§2.5), and memory estimates (§7.2) all show derivation. Memory figures all name their hardware configuration.

**Badge audit:** 6 artifacts, all honest badges. No badge inflation. Correction count: 0 (no badges were inflated to begin with).

**Pedagogical audit:** Each chapter has a stated prerequisite, a decision rule (where applicable), a named failure signature (where applicable), and forward/backward links.

### Appendix J: Re-check list

| Item | Staleness rate | Re-check trigger | Expected expiry |
|---|---|---|---|
| All H-01 through H-11 hazard statuses | Fast (days) | Before any adapter work | Every 24-48 h while adapter path is gated |
| Wheelhouse version and contents | Medium (weeks) | Before installing | On every Kaggle notebook restart |
| vLLM, PEFT, TRL library versions | Medium | On every dependency update | Monthly |
| Competition rules and size budget | Medium | On every announcement | At each sprint boundary |
| Library configuration key names and defaults | Medium | On every major library release | Quarterly |
| Method formulations (LoRA, QLoRA, DPO, GRPO) | Slow (quarters to years) | On new method paper | Yearly |

---

## Source list with versions

[S-001] Hu et al., "LoRA: Low-Rank Adaptation of Large Language Models," arXiv:2106.09685, 2021. https://arxiv.org/abs/2106.09685
[S-002] `HARNESS_README.md` (supplied input), `swegemma` harness technical reference, captured 2026-09-30.
[S-003] Hugging Face PEFT documentation, "LoRA." https://huggingface.co/docs/peft/en/package_reference/lora — verified 2026-10-01.
[S-004] Kaggle wheelhouse dataset "Gemma 4 Developer Agent Wheelhouse" v25, supplied via the official Getting Started notebook.
[S-005] `03-discussion-board-intel.md` (supplied input), compiled community intelligence digest, 2026-09-30 ~19:30 UTC. Supplied in two byte-identical copies; cited once.
[S-006] Liu et al., "DoRA: Weight-Decomposed Low-Rank Adaptation," arXiv:2402.09353, 2024.
[S-007] Zhang et al., "AdaLoRA: Adaptive Budget Allocation for Parameter-Efficient Fine-Tuning," arXiv:2303.10512, 2023.
[S-008] Dettmers et al., "QLoRA: Efficient Finetuning of Quantized LLMs," arXiv:2305.14314, 2023.
[S-009] Li et al., "LoftQ: LoRA-Fine-Tuning-Aware Quantization," arXiv:2310.08659, 2023.
[S-010] Meng et al., "PiSSA: Principal Singular Values and Singular Vectors Adaptation," arXiv:2404.02948, 2024.
[S-011] Rafailov et al., "Direct Preference Optimization: Your Language Model is Secretly a Reward Model," arXiv:2305.18290, NeurIPS 2023.
[S-012] Shao et al., "DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models," arXiv:2402.03300, 2024.

---

*End of document.*


---

<!-- ====================================================================== -->
<!-- FILE: 02_lora-competition-surface.md -->
<!-- ====================================================================== -->

# Master Adapter-Constraint Surface — Kaggle Gemma 4 Developer Agent Competition

> **Purpose:** Standalone, extractable reference for everything the harness allows, requires, or forbids about LoRA adapters. Sourced from `HARNESS_README.md` (captured 2026-09-30) and `03-discussion-board-intel.md` (community digest, same date). Cross-link to the main tutorial for explanations.
>
> **Verified as of:** 2026-10-01
> **Harness vintage:** `swegemma` 2026-09-30 snapshot
> **Stability tier:** Medium — re-check the forum before relying on any line that begins with a status claim about defects.

---

## A. The submission layout contract

A valid submission directory layout:

```
submission/
├── agent.yaml                   # REQUIRED (or root_agent.yaml; .yml also accepted)
├── eval_config.yaml             # Optional — per-task evaluation budget & timeout overrides
├── configs/                     # Optional — generation parameter YAMLs loaded via !include
├── prompts/                     # Optional — system instructions loaded via !include
├── sub_agents/                  # Optional — sub-agent / AgentTool YAML configurations
├── adapters/                    # Optional — fine-tuned PEFT LoRA adapters or model weights
│   └── <adapter_name>/
│       ├── adapter_config.json
│       └── adapter_model.safetensors
└── skills/                      # Optional — ADK Skill directories (each containing SKILL.md)
```

**Key rules:**

| Rule | Value | Source |
|---|---|---|
| Required root config | `agent.yaml` (or `root_agent.yaml`; `.yml` accepted) | [S-002] |
| `eval_config.yaml` | Optional; per-task overrides | [S-002] |
| `configs/`, `prompts/`, `sub_agents/`, `adapters/`, `skills/` | All optional | [S-002] |
| `adapters/` filenames per directory | Exactly `adapter_config.json` + `adapter_model.safetensors` | [S-002] |
| `adapters/` extension (weights file) | `.safetensors` only | [S-002] |

**Rejected:** extra files in an adapter directory, `.bin`/`.pt`/`.pth` weights, missing config.

---

## B. The single-base-model rule

| Field | Value | Enforcement |
|---|---|---|
| Allowed models (frozen) | `frozenset({'gemma-4-31b-it-qat-w4a16-ct'})` | `validate_single_declared_model` |
| Required base for LoRA work | `gemma-4-31b-it-qat-w4a16-ct` (W4A16 QAT) | Same |
| Multiple base models in one submission | Forbidden | Same |

`validate_single_declared_model(agent_dir)` traverses the full tree — root `agent.yaml`, every `sub_agents/*.yaml`, every `tools[*].agent_tool.config_path`, and any standalone agent YAMLs — and confirms exactly one unique base model across all references.

**Per-agent adapters are independent of the base-model rule.** Multiple agents can each have their own `adapter:` field pointing to different adapter directories.

---

## C. The `adapter:` field and routing

| Aspect | Behavior | Source |
|---|---|---|
| Where it appears | Inside any agent YAML (`agent.yaml`, `sub_agents/*.yaml`) | [S-002] |
| What it names | A directory under `adapters/` containing `adapter_config.json` + `adapter_model.safetensors` | [S-002] |
| How it's resolved | Rewritten to `openai/<adapter_name>` for serving via `LiteLlm` | [S-002] |
| Discovery mechanism | `discover_adapters()` scans `adapters/`; serving config launched with `--lora-modules name1=path1 name2=path2 ...` | [S-002] |
| Case sensitivity | Exact match required (directories and `adapter:` values) | [S-002] |

**Failure modes:**

- `adapter:` references nonexistent directory → validator rejection.
- `adapter:` references directory missing `adapter_model.safetensors` → validator rejection.
- `adapter:` references a non-`.safetensors` weights file → validator rejection.
- `adapter:` is misspelled vs. directory name → adapter fails to register at serving time.

---

## D. Size budget and adapter sizing

| Constraint | Value | Source |
|---|---|---|
| Total submission size | `< 3 GiB` (3,221,225,472 bytes unpacked) | [S-002] |
| Adapter file format | safetensors only | [S-002] |
| Adapter file naming | `adapter_model.safetensors` (note: not `pytorch_lora.safetensors` etc.) | [S-002] |

**Approximate adapter size per rank (for all 7 projections on a 31B model in `bfloat16`; derived from §1.2 of the main tutorial):**

| Rank | Approx. size per adapter (bfloat16) | Adapters fitting alone in 3 GiB |
|---|---|---|
| 8 | 55–110 MB | 27+ |
| 16 | 110–220 MB | 13–27 |
| 32 | 220–450 MB | 6–13 |
| 64 | 450–900 MB | 3–6 |
| 128 | 0.9–1.8 GB | 1–3 |

(Sizes depend on hidden dimension and exact projection shapes; verify from the model config.)

---

## E. Serving-side ceilings (not participant-configurable)

| Setting | Value | Source |
|---|---|---|
| `--enable-lora` | True | [S-002] |
| `--max-loras` | 8 | [S-002] |
| `--max-lora-rank` | 128 | [S-002] |
| `--tensor-parallel-size` | 4 (4× L4 GPUs) | [S-002] |
| `--gpu-memory-utilization` | 0.80 (~19.2 GB per GPU) | [S-002] |
| `--max-model-len` | 32,768 tokens | [S-002] |
| `--tool-call-parser` | `gemma4` | [S-002] |
| `--reasoning-parser` | `gemma4` | [S-002] |
| Default chat template | `default_chat_template_kwargs = {"enable_thinking": True}` | [S-002] |

**Implications:**

- Adapter rank must be ≤ 128; rank > 128 is silently rejected by vLLM.
- Maximum 8 adapters per submission.
- KV cache size is affected by LoRA buffer preallocation (see §F).

---

## F. The adapter-serving defect cluster (status as of 2026-09-30)

These are the three layered failures acknowledged by the host at the supplied digest date. Status claims decay rapidly.

| ID | Defect | Status (2026-09-30) | Defense |
|---|---|---|---|
| H-01 | Silent adapter zeroing (duplicate layer registration under Gemma 4's `direct + YOCO alias` architecture) | Fix landed in wheelhouse v23; current v25. Participant repro on v25 still showed no effect (with a noted caveat). | Loud-adapter canary (`training-recipes/00-loud-adapter-canary.md`). |
| H-02 | KV-cache collapse from `max_loras × max_lora_rank` LoRA buffer preallocation (46k → 7.6k tokens) | Host committed 9/30 ~16:05 UTC to size LoRA params to the submission. **Not confirmed deployed.** | Submit without adapters until fix is live; re-check forum status. |
| H-03 | Stock PyPI vLLM 0.19.1 refuses LoRA for `Gemma4ForConditionalGeneration` | Permanent; workaround: install wheelhouse-provided patched vLLM. | Install from the wheelhouse dataset, never stock PyPI. |

**Aggregate observation:** As of the supplied digest date, **no adapter-bearing submission has scored**.

---

## G. The thinking-configuration interaction

| Field | Setting | Source |
|---|---|---|
| vLLM `default_chat_template_kwargs` | `{"enable_thinking": True}` | [S-002] |
| Reasoning parser | `gemma4` | [S-002] |
| Recommended OpenAI-side fields for adapter requests | `include_thoughts: true` + `thinking_budget: 4096` (omit `thinking_level`) | [S-002] |

**Related defect (separate from H-01/H-02):** ADK sends `reasoning_content` while vLLM 0.19.1 reads only `reasoning`, so thoughts never reach the next prompt. Real-run evidence shows next-prompt size grows 0.35× of previous reply with thinking on vs 1.1× off. Patch incoming; no re-score planned. [S-005]

---

## H. What a general PEFT guide would get wrong

| Common mistake | Why it fails here |
|---|---|
| Installing stock PyPI `vllm` | Refuses LoRA for `Gemma4ForConditionalGeneration`. Use the wheelhouse. |
| Saving as `.bin` / `.pt` / `.pth` | Validator rejects; safetensors only. |
| Using `gemma-4-31b-it` (unquantized sibling) | Not in `ALLOWED_MODEL_NAMES`. Even for local training, the base-weight mismatch can cause silent effect loss. |
| Trusting successful load as proof of effect | The silent-zeroing defect can leave adapters registered but inactive. |
| Training at rank > 128 | Silently rejected at serving time. |
| Ignoring the 3 GiB budget | Validator rejection on submission. |
| Setting `lora_alpha` with no provenance label | An under-informed alpha is the most common cause of "loss won't decrease." |

---

## I. The master constraint table

| # | Rule | Value | Source | Enforcement | Reader consequence |
|---|---|---|---|---|---|
| 1 | Total submission size | `< 3 GiB` | [S-002] | Validator | Oversized submissions rejected |
| 2 | `adapters/` extensions | `.safetensors` only | [S-002] | Validator | Pickle weights rejected |
| 3 | Required filenames | `adapter_config.json` + `adapter_model.safetensors` | [S-002] | Validator | Submission rejected |
| 4 | Single base model | `gemma-4-31b-it-qat-w4a16-ct` only | [S-002] | `validate_single_declared_model` | Multi-base submissions rejected |
| 5 | Adapter rank | ≤ 128 | [S-002] | vLLM serving flag | Higher-rank rejected |
| 6 | Adapter count | ≤ 8 per submission | [S-002] | vLLM serving flag | More than 8 rejected |
| 7 | `tensor_parallel_size` | 4 (4× L4) | [S-002] | Server startup | Fixed by scorer |
| 8 | `gpu_memory_utilization` | 0.80 | [S-002] | Server startup | Fixed by scorer |
| 9 | `max_model_len` | 32,768 | [S-002] | Server startup | Fixed by scorer |
| 10 | `--enable-lora` | True | [S-002] | Server startup | Fixed by scorer |
| 11 | vLLM source | Wheelhouse only | [S-004, S-005] | Mandatory install | Stock PyPI vLLM refuses LoRA |
| 12 | Loss-masking requirement | `assistant_only_loss=True` (or equivalent) | Derived from training correctness | Not validated by harness; required for behavior to train | Adapter trains but doesn't help |
| 13 | Base-weight match | Train against the QAT base, not an unquantized sibling | Derived | Not validated by harness | Silent effect loss |

---

## J. Decision matrix: when is the adapter path open?

| Signal | Read |
|---|---|
| Loud-adapter canary (`training-recipes/00-loud-adapter-canary.md`) produces different outputs than the base at the same seed | Path is functioning |
| Same canary but outputs identical | Path is broken; investigate H-01 |
| Forum reports KV-cache fix deployed | H-02 mitigated; safe to ship adapters |
| Forum reports KV-cache fix deployed but scored adapter still scores = base | Re-check wheelhouse version |
| Forum silent / no recent updates | Treat H-02 as live; submit without adapters |

---

## Source list

[S-002] `HARNESS_README.md` (supplied input), `swegemma` harness technical reference, captured 2026-09-30.
[S-004] Kaggle wheelhouse dataset "Gemma 4 Developer Agent Wheelhouse" v25, supplied via the official Getting Started notebook.
[S-005] `03-discussion-board-intel.md` (supplied input), compiled community intelligence digest, 2026-09-30 ~19:30 UTC.

*For explanations, derivations, and technique depth, see the main tutorial: `01-lora-primer-tutorial-kaggle-gemma4.md`.*

