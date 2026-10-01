# COMBINED MARKDOWN - combine

_Generated 2026-10-01 01:04:53 | 7 files | folder: D:\stuff\docs\taylor_fv\github\rayrite.github.io\cvx\kaggle\items\combine_

## Contents

1. 00_README-glm53.md
2. 01-scope.md
3. 02_lora-primer-tutorial-kaggle-gemma4.md
4. 03-lora-competition-surface.md
5. 100_training-recipes-README.md
6. 101_unsloth-31b-qlora.md
7. 102_sidecars_adapter-ladder-README.md

---

<!-- ====================================================================== -->
<!-- FILE: 00_README-glm53.md -->
<!-- ====================================================================== -->

# 2026-10-01 — LoRA Primer + Tutorial, Kaggle Gemma 4 Developer Agent Competition

Deliverables for the `deep-research-handoff-lora-primer-tutorial-kaggle-gemma4[m3]` commission. Research cutoff **2026-09-30**; live pages re-verified **2026-10-01**. Intermediates (ledgers, fetched pages, verification record) in `../scratch/lora-primer/`.

## Map

| Path | What |
|---|---|
| `lora-primer-tutorial-kaggle-gemma4.md` | **The tutorial** — Part I beginner (Ch. 0–10), Part II intermediate (Ch. 11–15), Part III advanced (Ch. 16–21), Appendices A–J |
| `00-scope.md` | Research scope: CQ-01..CQ-10 decisions + falsifiability predictions P1–P7 (outcomes in Appendix G / `../scratch/lora-primer/verify-results.md`) |
| `sidecars/lora-competition-surface.md` | One-page constraint card + weekly re-check list (keep this open while working) |
| `sidecars/adapter-ladder/` | Per-rung `adapter_config.json` (r8–r128) + no-op/loud canary configs + bundle math |
| `sidecars/training-recipes/` | Version-pinned recipes: QLoRA 1×L4 (reference), bf16 2×L4, Unsloth, DPO-on-SFT |

## The 60-second version

1. **No adapter submission has ever scored on this competition** (official sample failed twice; a real r=64/980 MB adapter errored 2026-09-30). Three defect layers explain it: stock-vLLM LoRA refusal (solved: wheelhouse fork), silent adapter zeroing (fix claimed ≥wheelhouse v23, unconfirmed), KV-cache collapse to ~7,600 tokens with any adapter mounted (fix promised, deployment unconfirmed).
2. **Therefore: prompts/architecture are the bankable track; adapters sit behind a 2–3-slot canary ladder** (tutorial Ch. 12/20) that converts unknowns into facts cheaply.
3. The engineering is fully documented anyway — install (two envs, wheelhouse vs PyPI pins), first adapter, sizing arithmetic (byte-validated: r16 all-seven ≈ 241 MB), dataset building (own-trajectory SFT), training recipes, testing protocol (loud adapter, paired evals), troubleshooting encyclopedia.
4. Every claim is tier-labeled ([V3-source]/[V3-executed]/[V2-doc]/[V1-community]); every artifact badged (SCHEMA-CHECKED / ILLUSTRATIVE — **zero VALIDATED: no GPU in the research session**, stated plainly in Appendix D/I).

## Trust notes

- Community-reported defects are never presented as confirmed fact; status (claimed/promised/unconfirmed) rides along everywhere.
- Where official docs disagree (README adapter-size bands, eval-budget defaults, util 0.80 vs 0.90), the divergence is logged (Appendix G), not harmonized.
- Hard cutoff discipline: nothing published after 2026-09-30 is cited as current; drift after the cutoff appears only as "status at the 2026-10-01 sweep".

---


---

<!-- ====================================================================== -->
<!-- FILE: 01-scope.md -->
<!-- ====================================================================== -->

# 00 — Scope Note (LoRA Primer + Tutorial, Kaggle Gemma 4 Developer Agent)

**Commission date:** 2026-10-01 · **Hard research cutoff:** 2026-09-30 (nothing after may be cited as *current*; live re-verification sweeps of pages that exist today are still mandatory) · **Reader model (CQ-01):** competent Python/ML developer, strong deep-learning fundamentals, zero PEFT/fine-tuning experience, DevSecOps habits (version pinning, reproducibility).

## What this is

An exhaustive, source-verified teaching document (21 chapters, 10 appendices, 3 sidecars) taking the reader from LoRA vocabulary → installation → first adapter → SFT/QLoRA training recipes → multi-adapter serving → DPO/RLVR cost–benefit → a defensible go/no-go decision on shipping a LoRA adapter in this competition. Every default, version, size, and constraint claim carries a verification tier (V3-source / V3-executed / V2-doc / V1-hazard / V0-excluded) and every artifact carries an honest badge (VALIDATED / SCHEMA-CHECKED / ILLUSTRATIVE).

## Scope decisions (CQ-01..CQ-10 defaults, all applied)

1. **CQ-01 reader**: strong-DL-but-no-PEFT; tutorial still teaches from zero. FULL training recipes in scope (not just concept sketches).
2. **CQ-02 RL**: covered (Ch. 18–19) but SFT-first framing; DPO/RLVR treated as marginal-return additions under time budget.
3. **CQ-03 licensing**: first-class chapter (Ch. 13) — Apache-2.0 winner-license obligations, teacher-model ToS, dataset lineage (rules §2.5/2.6/2.8).
4. **CQ-04 compute tiers**: 1×L4 (24 GB) / 2×L4 / 4×L4 (the scoring rig) / external rentals; memory arithmetic per tier in Appendix C.
5. **CQ-05 coupling**: light links to the sibling ADK primer (2026-09-30 deliverable); no duplication.
6. **CQ-06 adapter strategy**: multi-adapter orchestration IS in scope (max_loras=8 makes it native), sized honestly against the 3 GiB budget.
7. **CQ-07 paper track**: short optional section only (Nov 12 deadline, 3k words, graph-leaning judges) — the paper-track intel doc covers it; here only as an outlet for measured LoRA findings.
8. **CQ-08 word budget**: no artificial cap on research output; document is as long as verified content requires.
9. **CQ-09 audience breadth**: beginner→advanced tiers are explicitly labeled; the go/no-go executive summary stands alone.
10. **CQ-10 defect cluster**: featured proportionately — the three serving-defect layers (PyPI vLLM LoRA refusal, YOCO double-registration zeroing, KV-cache collapse 46k→7.6k) get a full hazard register (WS-11) and drive the go/no-go gate, but do not drown the pedagogy.

## Falsifiability predictions (pre-registered before live verification)

The tutorial's central claims are falsifiable by the stated checks. Before running the live sweeps (2026-10-01), the predictions:

| # | Prediction | Falsified if |
|---|---|---|
| P1 | The competition overview still lists `gemma-4-31b-it-qat-w4a16-ct` as the only permitted base model and the 3 GiB budget unchanged | Kaggle page (live) shows a different/expanded model list or budget |
| P2 | The wheelhouse dataset has advanced past v25 and its changelog (or forum) confirms whether the YOCO zeroing fix is independently verified on the scorer | Version ≥v26 with a contradicting note, or forum retraction |
| P3 | The KV-collapse fix ("size LoRA params to submission", promised 9/30 ~16:05 UTC) is deployed or explicitly confirmed on the forum; if silent, the hazard stands as UNRESOLVED | Live forum thread 744331 (or successor) shows deployment |
| P4 | No scored adapter submission exists as of the cutoff (last known: official sample FAILED 9/25; zero public adapter scores) | Live LB/notebook/forum shows an adapter submission with a score |
| P5 | PEFT/TRL/transformers/bitsandbytes current versions (as of 2026-09-30) install cleanly against the wheelhouse's pinned vLLM 0.19.1 fork locally; exact version pins are recorded | PyPI release pages disagree with the recorded pins |
| P6 | Adapter size arithmetic (r=16 ≈ 110–220 MB … r=128 ≈ 0.9–1.8 GB, 7 projections, 31B) recomputes within the harness README's stated bands from actual Gemma 4 layer counts | config.json layer counts × projection dims fall outside every band |
| P7 | The eval-budget contradiction (README: 60 min/100 calls defaults in inference.py; forum staff: "defaults = no limit") resolves as scorer-side defaults differing from the notebook path — logged, tiered, not silently harmonized | Neither source moves; reported as open VERSION-nature contradiction |

## Non-goals

- Not an ADK tutorial (sibling covers it); not a distillation/Ghostwriter manual; not a graph-tool strategy guide.
- No PAYG spend without the mandatory chat announcement (v4 protocol); budget ceiling 100 credits; free allowance tracked at `~/.research-tavily-free.json`.

## Deliverables map

- `lora-primer-tutorial-kaggle-gemma4.md` — main document (the commissioned artifact)
- `sidecars/adapter-ladder/` — copy-paste adapter ladder configs (README + per-rung files, badged)
- `sidecars/training-recipes/` — SFT/QLoRA/DPO recipe files (badged)
- `sidecars/lora-competition-surface.md` — the competition-facing constraint card (re-check list included)
- Appendices A–J live inside the main document.

**Scratch (intermediates):** `independent_research/scratch/lora-primer/` — ledgers, divergence log, search log, arithmetic checks, per-WS notes.


---

<!-- ====================================================================== -->
<!-- FILE: 02_lora-primer-tutorial-kaggle-gemma4.md -->
<!-- ====================================================================== -->

# LoRA on Gemma 4 for the Kaggle Developer Agent Competition — A Primer and Tutorial

**From zero PEFT experience to a defensible ship/no-ship decision.**

| Field | Value |
|---|---|
| Commissioned artifact | LoRA primer + tutorial (handoff `deep-research-handoff-lora-primer-tutorial-kaggle-gemma4[m3].md`) |
| Base model variant (pinned) | `gemma-4-31b-it-qat-w4a16-ct` — Gemma 4 31B dense, instruction-tuned, QAT W4A16 in compressed-tensors format; architecture `Gemma4ForConditionalGeneration` |
| Model facts verified from | `config.json` of `google/gemma-4-31B-it` (HF, ungated) + official Gemma 4 model card (Kaggle) + arXiv:2607.02770 abstract |
| Serving stack (scorer) | patched **vLLM 0.19.1 fork** in *Gemma 4 Developer Agent Wheelhouse* **v28** (dataset `metric/gemma-4-developer-agent-wheelhouse`, updated 2026-09-30 ~20:30 UTC); `adk_submission 0.2.12`, `google_adk 1.36.1`, `google_genai 2.11.0`, `bitsandbytes 0.46.1`, `safetensors 0.8.0` |
| Training stack (recommended pins, current at cutoff) | `transformers 5.18.0` · `peft 0.21.1` · `trl 1.14.1` · `bitsandbytes 0.50.2` · `accelerate 1.15.0` · (stock `vllm 0.30.0` exists but **must not** be used to serve Gemma 4 LoRA locally — see H-01) |
| Harness reference | `HARNESS_README.md` in the competition data package (snapshot 2026-09-29/30) + live re-verification sweep 2026-10-01 04:30–04:42 UTC |
| **Verified as of** | **2026-10-01 (live pages) with a hard research cutoff of 2026-09-30** — nothing published after the cutoff is cited as *current*; live pages were re-fetched on 2026-10-01 to catch drift |
| Companion sidecars | `sidecars/adapter-ladder/` · `sidecars/training-recipes/` · `sidecars/lora-competition-surface.md` |

> **⚠️ Stability warning.** This is a *moving-target* competition. Between 2026-09-25 and 2026-09-30 the wheelhouse went v1→v28, three separate LoRA-serving defects were reported and patched at different cadences, a platform-wide submission-failure wave came and went, and a thinking-mode patch was promised but not confirmed deployed. **Every date-stamped claim below was true at its timestamp. Re-verify anything load-bearing against the live forum before you spend a submission slot on it.** Appendix J is the re-check list; `sidecars/lora-competition-surface.md` is the one-page card to keep open while you work.

---

> ### 🚨 The central finding, up front (read this before anything else)
>
> **As of the 2026-10-01 live sweep, no submission carrying a LoRA adapter has ever produced a score on this competition — not the official sample (failed twice, 2026-09-25 and 09-26), and not a carefully-built real adapter (r=64, 980 MB, all seven projections, submitted 2026-09-30 22:04 UTC by a participant; errored with no score).** Three independent defect layers explain why, and only one of them had a fix *confirmed* working at the sweep:
>
> 1. **Stock vLLM refuses Gemma 4 LoRA entirely** ("does not support LoRA yet") — solved only by the wheelhouse's patched vLLM 0.19.1 fork. *(Fix exists; use the wheelhouse.)*
> 2. **Silent adapter zeroing** — Gemma 4's decoder layers are registered twice (direct path + YOCO alias) and the loader sets-then-wipes the LoRA weights. Host states the fix landed in wheelhouse **v23** (current v28); **no clean independent confirmation exists** — the one public retest was confounded (wrong directory passed to `discover_adapters`, and only `lora_B` was randomized in the test adapter). *(Fix claimed, unconfirmed.)*
> 3. **KV-cache collapse** — mounting *any* adapter makes the scorer's vLLM preallocate LoRA buffers for 8 adapters × rank 128, which shrinks the KV cache from 46,048 tokens to **~7,600 tokens**; ~99% of real agent episodes exceed that, and requests that don't fit **hang silently until the task times out**. The host promised a fix ("size the loras parameters based on the submission", 2026-09-30 ~16:30 UTC) and a wheelhouse update shipped that evening — but that update itself triggered a wave of submission errors (thread 744807), and deployment of the KV fix was **not confirmed** at the sweep. *(Fix promised, deployment unverified.)*
>
> **Consequence for you:** the engineering in Parts I–II is real and worth learning, but the *rational* plan today is a gated one — build and validate locally, verify each defect layer with a cheap canary, and only spend real submissions on adapters once layers 2–3 are confirmed dead on the scorer. Chapter 20 is the full decision tree; the one-paragraph version: **prompts-and-architecture improvements are bankable now; adapters are a research track behind a verification gate.**

---

## Table of contents

- **Part I — Beginner (Chapters 0–10)**
  - [Ch. 0 — How to read this document](#ch-0--how-to-read-this-document)
  - [Ch. 1 — What LoRA is](#ch-1--what-lora-is)
  - [Ch. 2 — The working vocabulary](#ch-2--the-working-vocabulary)
  - [Ch. 3 — The competition surface in one page](#ch-3--the-competition-surface-in-one-page)
  - [Ch. 4 — Hardware reality: what you have vs. what the scorer has](#ch-4--hardware-reality-what-you-have-vs-what-the-scorer-has)
  - [Ch. 5 — Installation: two environments, on purpose](#ch-5--installation-two-environments-on-purpose)
  - [Ch. 6 — Your first adapter](#ch-6--your-first-adapter)
  - [Ch. 7 — Budgeting: GPU-hours, queue reality, and the calendar](#ch-7--budgeting-gpu-hours-queue-reality-and-the-calendar)
  - [Ch. 8 — Anatomy of an adapter: the two files you ship](#ch-8--anatomy-of-an-adapter-the-two-files-you-ship)
  - [Ch. 9 — The adapter ladder: rank, targets, and size](#ch-9--the-adapter-ladder-rank-targets-and-size)
  - [Ch. 10 — Testing an adapter locally without fooling yourself](#ch-10--testing-an-adapter-locally-without-fooling-yourself)
- **Part II — Intermediate (Chapters 11–15)**
  - [Ch. 11 — How the scorer actually serves your adapter](#ch-11--how-the-scorer-actually-serves-your-adapter)
  - [Ch. 12 — The verification ladder and canary submissions](#ch-12--the-verification-ladder-and-canary-submissions)
  - [Ch. 13 — Training data and licensing](#ch-13--training-data-and-licensing)
  - [Ch. 14 — SFT mechanics I: building the dataset](#ch-14--sft-mechanics-i-building-the-dataset)
  - [Ch. 15 — SFT mechanics II: the training run](#ch-15--sft-mechanics-ii-the-training-run)
- **Part III — Advanced (Chapters 16–21)**
  - [Ch. 16 — QLoRA, memory arithmetic, and the compute tiers](#ch-16--qlora-memory-arithmetic-and-the-compute-tiers)
  - [Ch. 17 — Multi-adapter orchestration under the 3 GiB budget](#ch-17--multi-adapter-orchestration-under-the-3-gib-budget)
  - [Ch. 18 — Beyond SFT: DPO and RLVR, costed honestly](#ch-18--beyond-sft-dpo-and-rlvr-costed-honestly)
  - [Ch. 19 — Troubleshooting encyclopedia](#ch-19--troubleshooting-encyclopedia)
  - [Ch. 20 — The go/no-go decision framework](#ch-20--the-gono-go-decision-framework)
  - [Ch. 21 — Submission checklist and the final workflow](#ch-21--submission-checklist-and-the-final-workflow)
- **Appendices A–J** — [constraint table](#appendix-a--master-constraint-table) · [config keys](#appendix-b--configuration-key-reference) · [sizing & memory](#appendix-c--adapter-sizing--memory-arithmetic) · [artifact catalog](#appendix-d--artifact-catalog) · [hyperparameter provenance](#appendix-e--hyperparameter-provenance) · [search log](#appendix-f--search-log) · [verification ledger](#appendix-g--verification-ledger-and-traceability) · [glossary](#appendix-h--glossary) · [audit report](#appendix-i--audit-report) · [re-check list](#appendix-j--re-check-list)

---

# Part I — Beginner

## Ch. 0 — How to read this document

**Who this is for.** You write Python comfortably, you know what a transformer is at the level of "attention layers, hidden states, forward pass," and you have trained *nothing* — or at least nothing with PEFT (parameter-efficient fine-tuning). You bring DevSecOps habits: you want pinned versions, reproducible steps, and to know exactly which claims are verified and which are folklore. That is the reader every chapter is calibrated to.

**Tier labels — every nontrivial claim carries one.**

| Label | Meaning | Weight you should give it |
|---|---|---|
| **[V3-source]** | Read from a versioned primary source this run (official config.json, PyPI metadata, wheelhouse file listing, supplied harness README) | Highest — cite-grade |
| **[V3-executed]** | Executed/recomputed locally this run against the primary artifact (byte counts, task counts, formula checks) | Highest — includes receipts |
| **[V2-doc]** | Official documentation (model card, PEFT/TRL/vLLM docs, Google fine-tune guides, staff forum answers) | High — but docs lag code |
| **[V1-community]** | Participant-reported on the forum, with mechanism and ideally repro | **Hazard-to-check.** Never load-bearing alone; always paired with status (confirmed/unconfirmed/contradicted) |
| **[V0]** | Unverifiable or excluded | Not cited as fact anywhere |

**Artifact badges.** Code and config blocks carry one of: **VALIDATED** (executed end-to-end with receipts — *none appear in this document; this research session had no GPU*), **SCHEMA-CHECKED** (structure and every externally-checkable key verified against the versioned sources above), or **ILLUSTRATIVE** (teaching sketch; never presented as working). The audit report (Appendix I) counts and justifies every badge decision.

**Dates.** Hard cutoff **2026-09-30**: nothing published after it is cited as current. Live pages were re-fetched **2026-10-01** to catch drift; where a live page disagreed with the supplied snapshots, the discrepancy is logged (Appendix G) rather than silently harmonized.

**Reading paths.** In a hurry? Read the boxed finding above, Ch. 3, Ch. 11, Ch. 20 — fifteen minutes, and you will know whether to spend your evening on prompts or on `peft`. Otherwise read linearly; Part I assumes nothing, Part III assumes Parts I–II.

---

## Ch. 1 — What LoRA is

**The one-paragraph version.** A fine-tune rewrites a model's weights. LoRA ("Low-Rank Adaptation", Hu et al., 2021) freezes the original weights and *adds* a small pair of trainable matrices to chosen linear layers: instead of modifying the projection `W` (say, the query projection in layer 27), you keep `W` and add `ΔW = B·A`, where `A` is `r×d_in`, `B` is `d_out×r`, and `r` — the **rank** — is tiny (4…128) compared to the layer's real dimensions (thousands). Training updates only `A` and `B`. At inference the adapter is applied on the fly: `y = W·x + (α/r)·B·A·x`. Because `A` is initialized randomly and `B` is initialized to **zeros**, an untrained adapter is an exact no-op — the model behaves identically with or without it [V2-doc, PEFT docs: default init Kaiming-uniform A / zero B]. That single fact is the backbone of every "is my adapter actually doing anything" test in Ch. 10.

**Why this matters for *this* competition specifically:**

1. **The submission format is built around it.** Your `submission.zip` may carry `adapters/<name>/` directories with exactly two files each (`adapter_config.json` + `adapter_model.safetensors`), and any `LlmAgent` in your YAML can point at one via `adapter: <name>` [V3-source, HARNESS_README §2.2/§3.4; live overview re-verified 2026-10-01].
2. **The base model is frozen by rule.** Only `gemma-4-31b-it-qat-w4a16-ct` may be served, for every agent and sub-agent [V2-doc, competition overview, re-verified live]. You cannot ship a merged model — pickle formats (`.bin/.pt/.pth`) are rejected; the only permitted weight file is `adapter_model.safetensors` [V3-source, HARNESS_README §2.4]. LoRA-class methods are not merely the convenient option; they are *structurally the only* way to change model behavior.
3. **The size budget is generous for adapters.** The whole unpacked submission must stay under **3 GiB (3,221,225,472 bytes)** including prompts, configs, skills — and adapters. A rank-16 adapter over all seven projections of the 31B model is ~241 MB (Ch. 9's arithmetic, byte-validated); you could ship a dozen of them and still fit. The *practical* adapter budget is set by serving-side memory, not the zip limit (Ch. 11).
4. **The scorer serves them natively.** The scoring vLLM runs with `enable_lora=True, max_loras=8, max_lora_rank=128` [V3-source, HARNESS_README §3.1] — meaning up to 8 adapters mounted concurrently, each of rank ≤ 128, addressable per-agent. That last number is a hard ceiling: **you cannot serve an adapter with rank > 128**, period.

**What LoRA is *not*.** It is not a smaller model — the full 31B base runs regardless, so inference speed is essentially the base model's. It is not a prompt — it changes weights, so it can encode behaviors prompts struggle to enforce (output formats, tool-call discipline), but it also *freezes in* whatever your training data taught, including its biases. And it is not free at serving time on this stack: mounting adapters changes the scorer's memory layout (Ch. 11, the KV-collapse story) — currently the single most important fact about shipping one.

**DoRA and rsLoRA in one paragraph, as promised.** Two PEFT upgrades you will see discussed: **rsLoRA** (rank-stabilized LoRA) changes the scaling from `α/r` to `α/√r`, empirically helping higher ranks learn [V2-doc, PEFT: `use_rslora=True`]; **DoRA** (weight-decomposed low-rank adaptation) splits each weight into magnitude and direction and adapts them separately, often matching full fine-tuning quality at LoRA cost, at some runtime overhead [V2-doc, PEFT: `use_dora=True`]. The sample adapters in the competition set both to `false` [V3-executed]. Neither changes the rank ceiling or the file format; both increase adapter size modestly (DoRA adds per-layer magnitude vectors) and are legitimate experiments *after* you have a working baseline — not before.

---

## Ch. 2 — The working vocabulary

Everything here also appears in the full glossary (Appendix H); this chapter is the subset you need before Ch. 3 makes sense. Terms are ordered so each only uses terms defined above it.

**Weights and adaptation.** A **base model** is a set of frozen pretrained weights — here, Gemma 4 31B instruction-tuned, quantized. An **adapter** is the small set of trained matrices you add; **PEFT** (parameter-efficient fine-tuning) is the family of such methods (LoRA is the member that matters here; QLoRA is LoRA-on-a-quantized-base, Ch. 16). **Fine-tuning** data flows through the frozen model and updates only adapter matrices; **SFT** (supervised fine-tuning) means the data is demonstrations — input→output pairs — and the loss is ordinary next-token prediction on the outputs. **DPO/RLVR** (Ch. 18) optimize against *preferences* or *verifiable rewards* instead.

**LoRA geometry.** The **rank `r`** is the width of the bottleneck; more rank = more expressive, more parameters, bigger file, and (this stack) more serving memory. **`lora_alpha` (α)** is the scaling numerator — the effective multiplier on `B·A` is `α/r` (or `α/√r` with rsLoRA). **Target modules** are *which* linear layers get adapters — for Gemma 4: the attention projections `q_proj, k_proj, v_proj, o_proj` and the MLP projections `gate_proj, up_proj, down_proj` ("all seven" when all are listed). **`lora_dropout`** is regularization on the adapter path. A **no-op adapter** is one that provably changes nothing (fresh init, or all-zero) — the control condition in every test in Ch. 10.

**The model itself.** Gemma 4 31B is a **dense** (non-MoE) **hybrid-attention** transformer: 60 decoder layers in a 5:1 pattern — five **sliding-window** layers (window 1024 tokens, 16 KV heads × 256 head dim) then one **full-attention** layer (4 KV heads × 512 head dim), final layer always global; global layers use **unified keys-and-values** (`attention_k_eq_v: true` in config) and **p-RoPE** (proportional rotary embeddings, partial rotary factor 0.25 on global layers) [V3-source, config.json + model card]. Hidden size 5376; MLP intermediate 21504; vocabulary 262,144 with tied embeddings. This hybrid/YOCO-adjacent structure is not trivia — it is *why* the silent-zeroing defect exists (Ch. 11, H-02: layers registered twice, once directly and once through a `self_decoder` alias).

**Quantization terms.** **W4A16** = 4-bit *weights*, 16-bit *activations*. **QAT** = quantization-aware training — the model was trained to tolerate its own quantization, so the W4A16 checkpoint ("`-ct`", compressed-tensors format, for native vLLM serving) retains near-bf16 quality [V2-doc, model card]. Google also publishes an **unquantized Q4_0** checkpoint — bf16 weights extracted from the QAT pipeline "for custom downstream compilation and research" [V2-doc] — which is the natural *training-side* sibling if you want to minimize train/serve mismatch (Ch. 16.4). **QLoRA** inverts the direction: you quantize the base to 4-bit *for training* (NF4) and train bf16 adapters on top — it is a training-time trick, unrelated to the QAT serving format even though both say "4-bit".

**Competition plumbing.** The **wheelhouse** is the host-maintained Kaggle dataset of pinned wheels (currently **v28**) whose patched vLLM 0.19.1 fork is the *only* vLLM build that accepts Gemma 4 LoRA [V1-community multi-repro; H-01]. **`swegemma`/`adk-submission`/`adk-eval-core`** are the harness libraries. **Container A** runs your agent; **Container B** verifies your patch with hidden tests — the **Resolution Rate** (resolved/total, binary per task) is the entire score. **KV cache** is the memory holding keys/values for attention over the context; its size in tokens is what the LoRA-buffer preallocation eats (Ch. 11).

---

## Ch. 3 — The competition surface in one page

This chapter is the constraint card, verbatim-verified. The same table ships as `sidecars/lora-competition-surface.md` with the re-check list.

### 3.1 The rules that bind an adapter

| Constraint | Value | Verified |
|---|---|---|
| Permitted base model (every agent + sub-agent) | `gemma-4-31b-it-qat-w4a16-ct` — exactly one unique base model per submission (`validate_single_declared_model`) | [V2-doc live 10-01] + [V3-source] |
| Submission archive | `submission.zip`, root must contain `agent.yaml` (or `root_agent.yaml`/`.yml`); unpacked total **< 3 GiB / 3,221,225,472 bytes** including `adapters/` | [V3-source] |
| Allowed extensions | `.yaml .yml .md .txt .py .json .safetensors` — pickle weights rejected outright | [V3-source] |
| Adapter directory contract | `adapters/<name>/adapter_config.json` + `adapters/<name>/adapter_model.safetensors` (weights `.safetensors` only) | [V3-source] |
| Attaching an adapter | `adapter: <name>` on any `LlmAgent` in `agent.yaml` or `sub_agents/*.yaml` | [V3-source] + [V2-doc live] |
| Serving-side LoRA knobs (scorer) | `enable_lora=True`, `max_loras=8`, `max_lora_rank=128`, TP=4, `max_model_len=32768`, `gpu_memory_utilization=0.80` | [V3-source; KV measurements were at 0.90 — see Ch. 11] |
| Context/output ceilings | `max_output_tokens` 1–32768 (default 16384); `thinking_budget` 0–32768 (default 4096) | [V3-source] |
| Per-task budgets (`eval_config.yaml`) | Scorer reads exactly 4 keys: `timeout_seconds`, `max_tool_calls`, `max_time_minutes`, `max_turns`; **scorer defaults = no limit** (staff answer) | [V2-doc staff, re-fetched verbatim] |
| Global wall clock | 12 h for *all* tasks, incl. sandbox setup, excl. validation; overrun currently **errors the whole submission** (score-0-for-unfinished planned, unconfirmed) | [V2-doc + staff] |
| Submissions | 1/day; 2 final picks; team ≤ 5; entry + merger deadline **2026-11-25**; final deadline **2026-12-02 23:59 UTC** | [V2-doc live 10-01] |
| Data | 129 public dev tasks (fastapi 67 / rich 48 / requests 13 / httpx 1 — recounted from `tasks.jsonl` this run; **hints empty on all 129** [V3-executed]); ~120 hidden tasks from private repos, ~50/50 public/private split | [V3-executed] + [V2-doc] |
| Winner license | Open-source Apache-2.0; winners must deliver **training code, inference code, and environment description** | [V2-doc rules §2.5/§2.8] |

### 3.2 What the scorer does with your zip (30-second version)

1. Validates layout, extensions, size, and the single-model rule; compiles the YAML into an ADK agent tree (no competitor Python runs — compilation is declarative).
2. Starts the patched vLLM on 4×L4 (24 GB each) with the settings above; `discover_adapters()` registers every `adapters/<name>/` via `--lora-modules name=path`; each agent's `adapter: name` becomes the LiteLLM model id `openai/<name>` [V1-community + mechanism; Ch. 11].
3. Runs the ~120 hidden tasks sequentially in Container A sandboxes (air-gapped, 4 GiB RAM / 2 vCPU); your agent navigates the repo with 9 tools and submits a patch.
4. Container B applies your patch to a fresh snapshot, runs hidden pytest; **exit 0 + valid JUnit XML = resolved**. Score = resolved fraction.

Everything else — nudges, compaction, protected test files, the four budget keys — is in Ch. 11 and Appendix B.

### 3.3 Where adapters sit in the strategy space

The score is binary per task; small-model baselines sit at **0.05–0.17** public LB (romanrozen 0.12 prompts-only at the 9/30 snapshot; live top 0.17 on 2026-10-01 [V2-doc LB page]). Community threads and the host's own framing encourage PEFT and RL. But note the *asymmetry*: a prompt improvement costs you an evening; an adapter costs a training pipeline, a verification campaign against three serving defects, and — while those defects stand — a nonzero risk of **scoring strictly below your no-adapter baseline** (an adapter submission that hangs on KV is worse than no adapter, not merely equal). That asymmetry, not any doubt about LoRA-the-technique, is why Ch. 20 gates the adapter track behind canaries.

---

## Ch. 4 — Hardware reality: what you have vs. what the scorer has

### 4.1 The scorer's rig [V3-source]

4 × NVIDIA L4 (24 GB GDDR6 each; 96 GB total), TP=4, `gpu_memory_utilization=0.80` → ~19.2 GB usable per GPU, ~76.8 GB total. The QAT W4A16 31B occupies ~16–18 GB *across* the four GPUs (~4.5 GB/GPU) — leaving the bulk of the budget for KV cache, which is exactly the pool the LoRA buffers raid (Ch. 11). Task sandboxes are CPU containers: 4 GiB RAM, 2 vCPU, no network.

### 4.2 Your training tiers [V2-doc vendor + V1-community]

| Tier | What fits | What it means for Gemma 4 31B |
|---|---|---|
| **1×L4 (24 GB)** — Kaggle free/cheap, or RTX 3090/4090-class | **31B QLoRA in ~22 GB** (Unsloth's measured figure; HF-stack QLoRA fits with gradient checkpointing + short sequences) | Your default *experimentation* tier: full-size-model training is possible, slowly. Not usable for local *serving* at 32k context. |
| **2×L4 (48 GB)** | bf16 LoRA on the unquantized checkpoint with sharding; faster QLoRA iteration | Comfortable QLoRA + moderate batch; still not the scorer's memory layout |
| **4×L4 (96 GB)** — the scoring layout | QLoRA/bf16 LoRA *and* wheelhouse vLLM serving with `enable_lora` at the scorer's settings (use util 0.90 like the Getting Started notebook) | The only tier that faithfully reproduces the scorer's serving behavior — this is where Ch. 10–12 tests run |
| External (rentals ~$1k/mo class, or local rigs) | Anything; community reports RTX Pro 6000 rentals | For serious dataset sweeps near the deadline; not needed for the tutorial path |

**Quota reality (Kaggle).** GPU sessions on L4×4 queue 4–13+ h; GPU quota is deducted at ~≈2× wall-clock (queue + run), nominal ~30 GPU-h/week [V1-community multi-repro]. A full scoring-shaped eval run costs ~12–14.5 h wall-clock. Budget planning in Ch. 7 internalizes this: **a 4×L4 "quick test" is a half-day commitment, not a coffee break.**

### 4.3 The two-environments principle

Training and serving have *different* stacks, on purpose (Ch. 5): the wheelhouse pins a patched vLLM 0.19.1 + serving deps (incl. `bitsandbytes 0.46.1`); your training env pins current PyPI (`transformers 5.18.0`, `peft 0.21.1`, `trl 1.14.1`, `bnb 0.50.2`, `accelerate 1.15.0`). Keep them in separate notebooks/venvs; the one time you install stock vLLM 0.30 into the serving env to "update it," you re-create defect H-01 (stock vLLM refuses Gemma 4 LoRA).

---

## Ch. 5 — Installation: two environments, on purpose

**Badge: SCHEMA-CHECKED** — every path, package name, and version below was verified against the live sources listed in the header; the cells were not executed in this research session (no GPU available). Cross-check against the Getting Started notebook's install cell, which is [V2-doc] and follows the same shape.

### 5.1 Environment S — serving & evaluation (reproduces the scorer)

Install *only* from the wheelhouse, like the Getting Started notebook does:

```python
# Kaggle notebook, GPU L4 x4, Internet OFF (wheelhouse is a Kaggle dataset — no download needed)
import glob, importlib, os, subprocess, sys
from pathlib import Path

os.environ['VLLM_WORKER_MULTIPROC_METHOD'] = 'spawn'
os.environ['VLLM_ENGINE_READY_TIMEOUT_S'] = '1200'
os.environ['VLLM_NO_USAGE_STATS'] = '1'
os.environ['OTEL_SDK_DISABLED'] = 'true'
os.environ['PYTORCH_CUDA_ALLOC_CONF'] = 'expandable_segments:True'
os.environ['TRANSFORMERS_NO_TF'] = '1'
os.environ['LITELLM_LOCAL_MODEL_COST_MAP'] = 'True'

WHEELHOUSE_DIR = Path('/kaggle/input/datasets/metric/gemma-4-developer-agent-wheelhouse')  # v28 at time of writing

# The notebook deletes stray cutlass .pth files and symlinks wheels to a tmp dir with
# normalized +cu128 local versions before installing -- replicate that verbatim.
tmp_whl = Path('/tmp/wheelhouse'); tmp_whl.mkdir(parents=True, exist_ok=True)
for w in WHEELHOUSE_DIR.glob('*.whl'):
    if 'cutlass' in w.name.lower():
        continue
    name = w.name.replace('cu128', '+cu128') if ('cu128' in w.name and '+' not in w.name) else w.name
    tgt = tmp_whl / name
    if not tgt.exists():
        os.symlink(w, tgt)
subprocess.run([sys.executable, '-m', 'pip', 'install', '-q', '--no-deps', '--force-reinstall',
                *sorted(str(p) for p in tmp_whl.glob('*.whl'))], check=True)
importlib.invalidate_caches()
```

Why the ceremony: `--no-deps --force-reinstall` guarantees the *wheelhouse's* pinned versions win over the notebook image's preinstalls — mixing preinstalls with wheelhouse pins is a classic way to end up with a stock-vLLM-by-accident (H-01). Key pins you end up with [V3-source, v28 file listing]: patched `vllm 0.19.1` fork, `adk_submission 0.2.12`, `google_adk 1.36.1`, `google_genai 2.11.0`, `bitsandbytes 0.46.1`, `safetensors 0.8.0`, `flashinfer 0.6.6`.

> **Version discipline note.** The wheelhouse is versioned as a *dataset* (v28 at cutoff+1d) and updates independently of the competition code. The zeroing fix is claimed from v23 on [V1-community host-stated]; when reproducing tests, record the dataset version in your notes — "works on v25" and "works on v28" are different claims. Re-check the current version on the dataset page before each serious local run.

### 5.2 Environment T — training (current PyPI, pinned)

```bash
# separate venv/notebook from Environment S
python -m venv ~/lora-train && source ~/lora-train/bin/activate   # or: uv venv ~/lora-train
pip install "transformers==5.18.0" "peft==0.21.1" "trl==1.14.1" \
            "bitsandbytes==0.50.2" "accelerate==1.15.0" "torch>=2.9" "datasets" "wandb"
```

These exact versions were the newest on PyPI **as of 2026-09-30** [V3-source, PyPI release metadata: peft 0.21.1 (2026-09-29), trl 1.14.1 (2026-09-29), transformers 5.18.0 (2026-09-30), bitsandbytes 0.50.2 (2026-08-27), accelerate 1.15.0 (2026-09-09)]. The Gemma 4 config itself was authored against `transformers 5.5.0.dev0` [V3-source], so anything ≥5.5 understands `model_type: gemma4`; pinning the current release is both safe and reproducible. If you use **Unsloth** (recommended for the 1×L4 tier — their Gemma 4 page reports ~1.5× faster training and ~60% less VRAM vs FA2 setups [V2-doc vendor]), let it pull its own pinned `unsloth_zoo` stack rather than fighting these pins; keep Unsloth in a *third* env if you also need the vanilla stack.

**Do not** install stock `vllm` (0.30.0 at cutoff) into Environment S — see H-01. **Do not** upgrade `transformers` inside Environment S past the wheelhouse pin — the harness's gemma4 support in vLLM 0.19.1-fork is matched to that stack.

### 5.3 Model checkpoints: which file do you actually load?

| Repo | Format | Use |
|---|---|---|
| `google/gemma-4-31B-it` (HF, ungated, Apache-2.0) | bf16 | Training base for bf16 LoRA; closest simple choice |
| `google/gemma-4-31B-it-qat-q4_0-unquantized` | bf16 weights from the QAT pipeline | Training base that minimizes train/serve mismatch (Ch. 16.4) [V2-doc] |
| `gemma-4-31b-it-qat-w4a16-ct` (Kaggle Models v2; HF compressed-tensors) | W4A16 compressed-tensors | **Serving only** — the scorer's model; Kaggle flags the variation FINE-TUNABLE: No [V2-doc] |
| GGUF / wNa8o8 variants | llama.cpp / mobile | Out of scope for this competition |

On Kaggle, the model arrives as an input at `/kaggle/input/models/google/gemma-4/other/gemma-4-31b-it-qat-w4a16-ct/2` (the Getting Started notebook's path). For training on Kaggle you attach the HF-style variant as a second input, or pull from HF (`gated: false`, license Apache-2.0 — but the Gemma terms of use still apply, Ch. 13).

---

## Ch. 6 — Your first adapter

Goal of this chapter: touch every moving piece once, cheaply, in Environment T — train a real (if tiny) adapter on a real Gemma 4, save it in the competition format, and prove to yourself it changes outputs. **Badge: SCHEMA-CHECKED** (APIs verified against the pinned docs; not executed this session).

### 6.1 Scale down first: train on E2B/E4B or 12B, serve-test on 31B

Gemma 4 E2B trains LoRA in 8–10 GB, E4B in 17 GB [V2-doc vendor]; 31B QLoRA needs ~22 GB. The adapter you produce on a *small* sibling is not shippable (adapters are base-specific — dimensions must match), but the *workflow* is identical, and your first two or three attempts will fail for workflow reasons, not quality reasons. Burn those failures on a model that trains in minutes.

> ⚠️ **Gemma 4-specific training hazard on the small models** [V2-doc vendor]: E2B/E4B share KV state across layers (`num_kv_shared_layers` 20/18). With `use_cache=False` — which QLoRA tutorials and gradient checkpointing set by default — those layers recompute K/V locally and **training loss diverges to garbage**. The 31B has `num_kv_shared_layers: 0` [V3-source config] and is unaffected. If you prototype on E2B/E4B, follow Unsloth's current guidance for the cache setting rather than a generic tutorial.

### 6.2 The minimal training script (TRL SFT + PEFT, pinned versions)

```python
# train_first_adapter.py — Environment T (peft 0.21.1, trl 1.14.1, transformers 5.18.0)
import torch
from datasets import Dataset
from peft import LoraConfig
from transformers import AutoProcessor, Gemma4ForConditionalGeneration
from trl import SFTConfig, SFTTrainer

MODEL = "google/gemma-4-12B-it"          # practice scale; use 31B-it (or qat-q4_0-unquantized) for real runs
rank, alpha = 16, 16                      # ladder rung 2 (Ch. 9); alpha >= r is a sane default [V2-doc vendor]

# The checkpoint is multimodal — config.json "architectures" names Gemma4ForConditionalGeneration
# [V3-source]. Load that class (not a text-only auto class); if your transformers build exports
# it under an auto-class instead, substitute that — verify with one forward pass before training.
processor = AutoProcessor.from_pretrained(MODEL)
model = Gemma4ForConditionalGeneration.from_pretrained(
    MODEL, dtype=torch.bfloat16, device_map="auto")

peft_cfg = LoraConfig(
    task_type="CAUSAL_LM",
    r=rank, lora_alpha=alpha, lora_dropout=0.0, bias="none",
    target_modules=["q_proj","k_proj","v_proj","o_proj",
                    "gate_proj","up_proj","down_proj"],   # the seven projections
)

# one demonstration: system+user -> assistant. Real datasets: Ch. 14.
rows = [{"messages": [
    {"role": "system", "content": "You are a precise coding agent."},
    {"role": "user",   "content": "Name the file that defines HTTPParser.reset in this repo."},
    {"role": "assistant", "content": "src/httpx/_parsers.py defines HTTPParser.reset; the async mirror is src/ahttpx/_parsers.py."},
]}]
ds = Dataset.from_list(rows)

cfg = SFTConfig(
    output_dir="out/first",
    per_device_train_batch_size=1, gradient_accumulation_steps=8,
    learning_rate=2e-4, num_train_epochs=3, lr_scheduler_type="cosine", warmup_ratio=0.03,
    bf16=True, logging_steps=1, max_length=4096, report_to="none",
)
trainer = SFTTrainer(model=model, args=cfg, train_dataset=ds, peft_config=peft_cfg,
                     processing_class=processor.tokenizer)
trainer.train()
trainer.save_model("out/first/adapter")   # writes adapter_config.json + adapter_model.safetensors
```

What TRL does for you (verified against the pinned TRL SFT docs [V2-doc]): applies the model's chat template to `messages`, computes loss on **completions only** by default for conversational data, and — because you passed `peft_config` — wraps the model in PEFT before training and saves *only the adapter* at the end. `2e-4` is the standard LoRA learning-rate neighborhood (Appendix E has provenance); with one demo row nothing is being *learned* — this run is about the plumbing.

### 6.3 Inspect what you built

```python
import json, safetensors.torch as st
cfg = json.load(open("out/first/adapter/adapter_config.json"))
tensors = st.load_file("out/first/adapter/adapter_model.safetensors")
print(cfg["r"], cfg["lora_alpha"], cfg["target_modules"], cfg["peft_type"])
ks = sorted(tensors)                      # expect ...q_proj.lora_A.weight etc.
print(len(ks), "tensors;", sum(t.numel() for t in tensors.values()), "params")
print("B is zero:", all(float(t.abs().sum()) == 0.0 for k, t in tensors.items() if "lora_B" in k))
```

Two invariants you should see, and should re-check for the rest of your life with adapters: the config names the seven projections with the rank/alpha you set; every `lora_B` tensor is **all zeros before training, nonzero after**. (Pre-training it's zeros by init; after even one useful gradient step it moves. A "trained" adapter with B still all-zero is the classic silent no-op — exactly the failure mode the loud-adapter test in Ch. 10 exists to catch.)

### 6.4 Convert to the competition layout and smoke it

```
my_submission/
├── agent.yaml                  # any valid config; add  adapter: first_lora  on the root LlmAgent
├── eval_config.yaml
└── adapters/
    └── first_lora/
        ├── adapter_config.json     # from out/first/adapter/ — check the next paragraph
        └── adapter_model.safetensors
```

One field matters more than the rest: **`base_model_name_or_path`**. The competition's own sample adapters ship it as the string `"google/gemma-4-31b-it-qat-w4a16-ct"` [V3-executed from the data package] — i.e., the *served* model id, not your training repo id. TRL/PEFT will have written your training repo name there; **edit it to match the sample's convention** before submitting, because the host has never publicly answered whether the scorer validates this field (open question from thread 743213 — Violet Notes asked exactly this on 2026-09-25; no staff reply as of 2026-10-01). Matching the official sample is the only evidence-backed choice.

Then serve-test in Environment S (wheelhouse vLLM, 4×L4) exactly as Ch. 10.2 shows — including `/v1/models` listing your adapter and a same-prompt base-vs-adapter logprob comparison.

---

## Ch. 7 — Budgeting: GPU-hours, queue reality, and the calendar

**The resource you actually ration is submission slots × calendar days, not FLOPs.** As of 2026-10-01 the deadline is 2026-12-02; that's ~62 days × 1 submission/day. Sounds ample; it evaporates:

- Each scoring run: **12–14.5 h wall-clock** on L4×4, *plus* queue time (4–13+ h reported; worse in bursts) [V1-community multi-repro].
- GPU quota: deducted at ~≈2× wall-clock; ~30 GPU-h/week nominal [V1-community]. A week of "one submission a day" can exhaust quota on its own.
- Infra failures *consume slots* (the 9/26 wave did; reruns were promised but a rescore backlog existed), and the 12 h-overrun error kills a whole run today.
- **Adapter-specific**: while H-03 stands, an adapter submission isn't just a wasted slot — it can error the run (observed: 30-min error, no score).

A sane allocation for a solo competitor treating adapters as a real track:

| Phase | Days | Slots | GPU time |
|---|---|---|---|
| Baseline + prompts (no adapters) | 10 | 6–8 | mostly CPU + a few L4 smoke runs |
| Local adapter pipeline + loud-adapter tests (Ch. 10) | 7 | 0–1 | 4×L4 sessions for serving tests |
| Canary ladder (Ch. 12) | 5 | 3–4 | one 4×L4 run each |
| Real adapter iterations | 20 | 8–12 | training (1–2×L4) + scoring runs |
| Final selection + buffer | 20 | 4–6 | reruns, A/B finals |

**Failsafe that pays for itself immediately:** set explicit budgets in `eval_config.yaml` (all four keys — scorer default is *no limit*, and the 12 h overrun errors everything [V2-doc staff]): `max_time_minutes: 25`–`35`, `max_tool_calls: 60`–`100`, `max_turns: 60`–`120`, `timeout_seconds: 300`. With ~120 sequential tasks, 25–35 min/task ≈ 50–70 h — *over* the 12 h global budget, which is the point of thinking it through: the per-task cap is a tail-risk fence (one hung task cannot eat the run), while your real protection is noticing hangs in local runs first. (The harness's own dashboards show per-task time; sample_submission ships 1 min/10 calls as a toy default [V3-source].)

---

## Ch. 8 — Anatomy of an adapter: the two files you ship

### 8.1 `adapter_config.json` — field by field, from the competition's own sample [V3-executed]

```json
{
  "alpha_pattern": {},                 // per-module alpha overrides (regex keys) — leave {}
  "auto_mapping": null,
  "base_model_name_or_path": "google/gemma-4-31b-it-qat-w4a16-ct",
  "bias": "none",                      // "none" — do not train biases (format expectation)
  "fan_in_fan_out": false,
  "inference_mode": true,              // PEFT sets this on save-for-inference; harmless either way
  "init_lora_weights": true,
  "layer_replication": null,
  "layers_pattern": null,
  "layers_to_transform": [0],          // ⚠️ SAMPLE ONLY trains layer 0 — a toy placeholder. Real adapters: null/omit.
  "loftq_config": {},
  "lora_alpha": 8,                     // sample uses 8 with r=4 (alpha = 2r)
  "lora_dropout": 0.0,
  "megatron_config": null, "megatron_core": "megatron.core",
  "modules_to_save": null,             // ⚠️ if set (e.g. embed_tokens/norm), weights bloat — see 8.3
  "peft_type": "LORA",
  "r": 4,                              // sample rank — toy; ladder starts at 8–16 for real work
  "rank_pattern": {},
  "revision": null,
  "target_modules": ["q_proj", "o_proj"],   // sample targets; real: all seven (Ch. 9)
  "task_type": "CAUSAL_LM",
  "use_dora": false,
  "use_rslora": false
}
```

Read that again with the right emphasis: **the sample adapters are deliberately tiny** — rank 4, two projections, *layer 0 only*, ~218 KB. They demonstrate the *format*, not the *method*; a submission whose adapters look like this will behave ≈ identically to the base model even when everything works. (This is also why the one public "still zeroed on v25" retest was inconclusive — its test adapter was built from the sample, whose `lora_A` may itself have been zeros [V1-community, 743508].)

### 8.2 `adapter_model.safetensors`

One flat file of named tensors: for each targeted module, `...lora_A.weight` (`r × d_in`) and `...lora_B.weight` (`d_out × r`). Storage dtype follows the training dtype (bf16 here ⇒ 2 bytes/param). No optimizer state, no base weights — that's the entire point. The name pattern inside vLLM/PEFT is how loaders match modules to weights; a mismatch between config `target_modules` and tensor names is a silent-skip risk (Ch. 19).

### 8.3 What is *not* in a normal adapter (and when that bites)

- **Embeddings / LM head.** Gemma 4 ties embeddings (`tie_word_embeddings: true`, vocab 262,144 × 5376 ≈ 1.4 *billion* params). PEFT's `save_embedding_layers` / `modules_to_save: ["embed_tokens"]` would add ~2.8 GB *per adapter* in bf16 — instantly blowing the 3 GiB budget. **Never ship embedding layers.** Vocabulary-shifting tricks are off the table at this size; work within the tokenizer you have.
- **Norms.** `modules_to_save` entries like RMSNorm weights are small but multiply across 60 layers; leave them out unless you have a measured reason.
- **The base model.** Obviously absent — which is why `base_model_name_or_path` is your only provenance link, and why train/serve base mismatch (bf16-trained → QAT-served) is a real, open quality question (Ch. 16.4), not a file-format question: the *shapes* match across bf16 and QAT variants of the same model, so the adapter loads either way.

---

## Ch. 9 — The adapter ladder: rank, targets, and size

### 9.1 The arithmetic (byte-validated this run)

Per decoder layer, with Gemma 4 31B dims [V3-source config: hidden 5376, q out 8192 (32 heads × 256), k/v out 4096 (16 KV heads × 256), o in 8192, MLP 21504]:

| Target set | Params per unit rank per layer | Formula |
|---|---|---|
| `q_proj` only | 13,568 | r×(5376+8192) |
| `q,k,v,o` (attention) | 46,080 | r×(13568+9472+9472+13568) |
| all seven projections | **125,720** | attention + r×3×(5376+21504) MLP |

× 60 layers × 2 bytes (bf16) ⇒ **all-seven adapter ≈ r × 15.086 MB** (decimal). Cross-checks [V3-executed + V1-community]: the formula reproduces the sample adapter's byte size *exactly* (r=4, q+o, layer 0: 217,088 B payload + 584 B safetensors header = the 217,672 B on disk), and predicts a real participant's r=64 all-seven adapter as 966 MB vs. their reported 980 MB (+1.5%).

| Rank r | All seven (derived) | Attention-only (q,k,v,o) | Notes |
|---|---|---|---|
| 8 | ~121 MB | ~44 MB | micro-experiments |
| 16 | ~241 MB | ~88 MB | default starting rung |
| 32 | ~483 MB | ~177 MB | |
| 64 | ~966 MB | ~353 MB | the one empirically observed real submission's rank |
| 128 | ~1.93 GB | ~707 MB | hard ceiling (`max_lora_rank`) [V3-source] |

> **Discrepancy, logged not hidden:** HARNESS_README §3.4 quotes wider, *lower* bands (r=16 "110–220 MB" … r=128 "0.9–1.8 GB"). Those bands do not match sizes derived from the model's config, nor the one observed real adapter. The derived numbers are the ones to budget by (they're *larger* — planning with them is strictly safer). Appendix G carries the full reconciliation.

### 9.2 The ladder (full configs in `sidecars/adapter-ladder/`)

| Rung | r / α | Targets | Size | When |
|---|---|---|---|---|
| R1 smoke | 8 / 16 | q,v | ~22 MB | plumbing tests; loud-adapter canaries (Ch. 10) |
| R2 baseline | 16 / 16 | all seven | ~241 MB | **your default**; strong LoRA results historically live r 8–32 |
| R3 capacity | 32 / 32 | all seven | ~483 MB | if R2 plateaus and data is plentiful |
| R4 heavy | 64 / 64 | all seven | ~966 MB | only with a measured delta over R3 |
| R5 max | 128 / 128 | all seven | ~1.93 GB | one per submission max, and only with evidence |
| M-multi | 2–8 × R2-class | per-agent | ≤ ~2.9 GB total | Ch. 17 orchestration |

**Choosing α:** `α = r` or `α = 2r` both common; Unsloth recommends α ≥ r [V2-doc vendor]; the sample uses α = 2r. What matters is the *scaling* `α/r`: α=r gives multiplier 1; α=2r doubles the effective step size — slightly hotter learning, sometimes faster convergence, occasionally instability at high rank. Appendix E tabulates provenance. **Dropout 0** is the ecosystem default for QLoRA-scale runs; 0.05–0.1 is the fallback if you see overfitting (train loss ↓, eval quality ↓).

### 9.3 What rank actually buys you

Rank is capacity to *represent* a weight change, not a quality dial. Empirical folklore [V1-community ecosystem-level, treat as prior not fact]: format/discipline behaviors (tool-call syntax, output shape) typically land at r 8–16; stylistic/domain shifts r 16–32; genuinely new knowledge needs data, not rank — more rank on thin data mostly buys you overfitting. In *this* competition the behaviors worth training (Ch. 14) are all in the first two buckets. Start at R2; escalate only with evidence from your paired eval (Ch. 10.4).

---

## Ch. 10 — Testing an adapter locally without fooling yourself

The theme of this chapter: **adapters fail silently by design** — a no-op adapter is a *correct* configuration that changes nothing. Every test below exists because someone was fooled by its absence.

### 10.1 The loud adapter (tests the serving path, not your training)

**Badge: SCHEMA-CHECKED** — `init_lora_weights` semantics verified against the pinned PEFT docs; block not executed this session.

Build an adapter whose effect is unmissable, then demand to see it:

```python
# loud.py — Environment T. Deliberately destructive adapter for path verification ONLY.
from peft import LoraConfig, get_peft_model
import torch
cfg = LoraConfig(task_type="CAUSAL_LM", r=8, lora_alpha=32,
                 target_modules=["q_proj","v_proj"],
                 init_lora_weights=False)     # random A AND random B — NOT a no-op [V2-doc PEFT]
# save with any tiny script; then serve in Environment S:
```

`init_lora_weights=False` gives random A *and* random B (PEFT documents this as the debug setting) [V2-doc]. With α=32 > r, the output of `openai/<name>` should be visibly deranged versus the base model at temperature 0 — different tokens, different logprobs. **If base and adapter outputs are identical, the serving path is broken** (H-02's signature) — do not interpret anything else until this passes. Randomize *both* matrices: the historical false negative came from randomizing only `lora_B` against a possibly-zero `lora_A` [V1-community, 744331/743508].

### 10.2 The serving smoke test (Environment S, 4×L4, wheelhouse vLLM)

```python
from adk_submission import VllmConfig, VllmServer, discover_adapters
from swegemma.config import ALLOWED_ADAPTER_EXTENSIONS

adapters = discover_adapters(str(AGENT_DIR), adapter_extensions=ALLOWED_ADAPTER_EXTENSIONS)
# ⚠️ pass the SUBMISSION ROOT (the dir containing agent.yaml), NOT the adapters/ subdir —
# passing the wrong directory silently yields an empty manifest [V2-doc staff, 743508].

cfg = VllmConfig(model=str(MODEL_PATH), port=8000, host="127.0.0.1",
                 tool_call_parser="gemma4", reasoning_parser="gemma4",
                 max_model_len=32768, gpu_memory_utilization=0.90,   # notebook value; scorer uses 0.80
                 enable_auto_tool_choice=True, enable_lora=True,
                 max_loras=8, max_lora_rank=128, tensor_parallel_size=4, startup_timeout=1200)
server = VllmServer(cfg, adapter_manifest=adapters); server.start()
```

Then, in order: **(1)** `GET /v1/models` must list the base *and* every adapter name (the staff-confirmed contract [V2-doc staff]). **(2)** Same prompt, temperature 0, `logprobs=3`, once as the base model and once as `openai/<adapter>`: top logprobs must differ for a loud adapter. **(3)** A ~14,000-token prompt must *complete or error quickly* — if it sits in the queue silently, you have just reproduced H-03 locally (KV collapse; the queue never drains) [V1-community, 744331]. **(4)** Watch startup logs for the KV-cache token count vLLM prints — with default LoRA settings on the notebook's 0.90 util it reads ~7,600 tokens; that number *is* your effective context while any adapter is mounted.

### 10.3 Parity and regression on real tasks

Run the local harness (`swegemma eval`, Getting Started notebook §5 shape) on a fixed task slice with three arms: base-only, adapter, and no-`--enable-lora` base. Two comparisons matter: **adapter vs base** (did training do anything?) and **base vs no-lora-flag base** (did *mounting* adapters alone degrade the base — the KV effect will show up here as timeouts, not quality loss). Use a task slice with known gold behavior, and expect local CV noise: the community has documented CV/LB anti-correlation from *environment* differences (missing wheels, SSL-dead tasks) — calibrate on deltas between arms run in the *same* environment, never on absolute local resolution rates [V1-community multi-analysis + host-confirmed env divergence].

### 10.4 The paired protocol (how to spend evaluation compute honestly)

Every claim "the adapter helps X%" comes from *paired* runs — same tasks, same seeds, same budgets, one variable. Concretely: freeze a 20–30-task slice (mix repos; drop the known-dead requests/SSL tasks from *interpretation* if not from the run), fix `eval_config.yaml`, run base and adapter arms back-to-back on the same wheelhouse version the same day, and diff per-task outcomes (patch-identical? resolved-flip?). A 2–4 task swing on 30 tasks is noise; you are looking for consistent direction across slices before spending a submission slot. This mirrors how the only scored adapter-adjacent evidence in the wild was built (the 0.06 baseline vs. its +-adapter twin [V1-community, 744331]).

---
# Part II — Intermediate

## Ch. 11 — How the scorer actually serves your adapter

You cannot debug a pipeline you can't picture. This chapter is the picture, and then the four ways it currently breaks.

### 11.1 The serving path, end to end

1. Your zip unpacks; `discover_adapters(submission_root, adapter_extensions=ALLOWED_ADAPTER_EXTENSIONS)` walks `adapters/*` and builds a manifest of name→path pairs [V3-source, harness code contract; the exact module lives in `adk_submission` 0.2.12 in wheelhouse v28].
2. The harness launches its patched vLLM with `--enable-lora --max-loras 8 --max-lora-rank 128` and passes `--lora-modules name1=path1 name2=path2 ...` for every manifest entry [V1-community mechanism, multi-corroborated; 743213].
3. vLLM exposes each adapter as a *served model name*: the ADK `LlmAgent(adapter: "name")` is translated by LiteLLM into model id `openai/<name>` [V1-community; staff-confirmed that `/v1/models` listing adapters is the contract].
4. At request time, vLLM activates the requested LoRA on the fly; with `max_loras=8` it keeps up to 8 adapters resident, evicting least-recently-used beyond that.

Two consequences fall out of this design. First, **adapter names are model ids** — they must be valid as such (no spaces; stick to `[a-z0-9_-]`), and a typo'd `adapter:` field fails at request time, not at validation. Second, **all agents share one engine**: the root agent's adapter and every sub-agent's adapter are hot simultaneously, which is what makes the Ch. 17 multi-adapter design possible and what makes the per-adapter serving cost (next section) multiply.

### 11.2 The KV-cache arithmetic (why adapters shrink your context)

The scorer's 4×L4 rig, measured by a participant with the scoring vLLM config at `gpu_memory_utilization=0.90` (the notebook value; HARNESS_README says the scorer uses 0.80, which if anything makes these numbers *optimistic*) [V1-community, arithmetic-consistent]:

| Quantity | Value | Arithmetic |
|---|---|---|
| KV bytes per token per GPU (TP4) | **245,760 B (240 KiB)** | 60 layers × 4,096 B/layer/GPU (4 KV heads/GPU × 256 dim × 2 (K,V) × 2 B bf16, sliding-layer shape) |
| Free KV without adapters | ~10.5 GiB/GPU → **46,048 tokens** | 46,048 × 245,760 B = 10.55 GiB |
| Free KV with adapters mounted | ~1.74 GiB/GPU → **7,600 tokens** | 7,600 × 245,760 B = 1.74 GiB |
| What mounting costs | **~8.8 GiB KV/GPU** | (46,048 − 7,600) tokens |

The ~8.8 GiB/GPU goes to vLLM's *preallocated* LoRA workspace, sized for the worst case the engine was promised: `max_loras=8` slots × `max_lora_rank=128`, across every layer — regardless of what your adapters actually are. vLLM's own documentation says to set `max_lora_rank` to the maximum rank *among your adapters* because "too high wastes memory and can cause performance issues" [V2-doc, docs.vllm.ai]. The competition's fixed 8×128 setting is exactly that documented anti-pattern, and you cannot change it — it is baked into the scoring launch. (This is also why the host's promised fix was phrased "size the loras parameters based on the submission": right-sizing 8×128 down to your actual 1×16 is worth ~25× the KV headroom.)

**What 7,600 tokens means in practice.** The agent's first prompt (system + instructions + repo map + task) typically runs 4–14k tokens; tool results append more. Requests that fit are served (measured: ~4k-token prompts work); requests that don't fit **never start** — with `scheduler_reserve_full_isl` semantics they wait in queue for KV space that will never free, until a read timeout (measured: 900 s) or the task budget kills them [V1-community, 744331: "~14k-token prompts never start"]. A participant's corpus analysis put ~99% of real episodes above the 7.6k line. An adapter submission under this defect doesn't produce "slightly worse" results — it produces **timeout-zeros on most tasks**, i.e., potentially *below* your no-adapter baseline.

### 11.3 The defect register, with status at the 2026-10-01 sweep

| ID | Defect | Mechanism | Status at sweep |
|---|---|---|---|
| **H-01** | Stock vLLM refuses Gemma 4 LoRA | `Gemma4ForConditionalGeneration` lacks `SupportsLoRA` in stock vLLM 0.19.1-era code; error "does not support LoRA yet" | **Solved in wheelhouse fork** (adds the mixin) — multi-repro incl. 2×H100 [V1c]. Use wheelhouse; never stock vLLM for serving |
| **H-02** | Silent adapter zeroing | Decoder layers double-registered (`layers.N` + YOCO alias `self_decoder.decoder_layers.N`); `activate_adapter` sets LoRA weights via one path, `reset_lora` wipes via the other; logs show 240× loaded / 240× skipped | **Fix claimed v23** (host, 2026-09-29); current wheelhouse v28. **Independent confirmation ABSENT** — sole public retest confounded (wrong dir to `discover_adapters` + only `lora_B` randomized) |
| **H-03** | KV-cache collapse (above) | 8×128 preallocation eats ~8.8 GiB/GPU | **Fix promised** ("size the loras parameters based on the submission", host 2026-09-30); the same-evening wheelhouse update itself triggered submission errors (744807). **Deployment unconfirmed** |
| **H-04** | Zero adapter submissions ever scored | Sample-with-adapters failed 9/25 + 9/26; real r=64/980 MB adapter submission 56719837 errored ~30 min on 9/30 22:04 UTC | **Standing fact** — consistent with H-02 and/or H-03 remaining live |
| **H-05** | Thinking thoughts dropped between tool calls | vLLM 0.19.1 `chat_utils.py` reads `reasoning` but ADK sends `reasoning_content`; upstream vllm#38488 / fix PR #42664; repro: 86 vs 114 tokens | **Host: patch "incoming"** (2026-09-30), no rescore of existing submissions. Affects base *and* adapter submissions with thinking on |

Two more environment hazards that interact with any long-context strategy (adapter or not): **H-06** double-JSON-escaping of tool results (community experiment: 22%/62%/0% bloat across tools — cause not fully isolated), and **H-14** compaction/overflow: at `token_threshold=32,768` compaction can *never fire* before the hard 32,768 request ceiling rejects the prompt, and the resulting `ContextWindowExceededError` bypasses the patch-fallback path — 44/44 overflowed sessions shipped an **empty patch**, 14 of them *after successful edits* [V1-community, 744692; staff "I will look into it" 2026-09-30]. The scorer's actual threshold (14,336 vs 32,768) was still unconfirmed at the sweep. If you train an adapter for long-episode stamina, verify what context the *scorer* actually gives you first.

### 11.4 What this means for adapter design *today*

- **Rank is not just a quality knob; it's a (claimed-fixed) hazard variable.** If H-03's fix lands as promised (sizing to the submission), a single r=16 adapter becomes nearly free; if it doesn't, *no* rank is safe while 8×128 is preallocated. Design for the fix, verify against the defect (Ch. 12).
- **One adapter beats many while H-03 stands**: every mounted adapter's presence is what triggers preallocation, not its size — but more adapters also means more slots claimed if sizing becomes per-submission. Prefer one strong adapter over a committee until the fix is confirmed.
- **Your adapter must not assume >7.6k context** until proven otherwise: if an episode's prompt exceeds the live KV pool, everything after is timeouts. An adapter trained on 14k-token trajectories will still be served in a 7.6k world — its long-context behaviors simply never engage. (Conversely: if you get H-05's thinking fix confirmed and H-03 fixed, the whole calculus changes — hence the re-check list.)

---

## Ch. 12 — The verification ladder and canary submissions

The cheapest test that could fail comes first. Each level below either passes (proceed) or fails (fix *this* before anything later). Costs are in Kaggle GPU-hours / submission slots.

### L0 — Static checks (CPU, minutes)

- Zip unpacks to a tree with `agent.yaml` at root; every file's extension is in the whitelist; total unpacked < 3 GiB; adapters under `adapters/<name>/` have exactly the two files; `adapter:` names match directory names exactly; `base_model_name_or_path` set to `google/gemma-4-31b-it-qat-w4a16-ct` (sample convention) [V3-source contract].
- Load each adapter with `safetensors.torch.load_file`: tensor shapes match config (`r × d_in` / `d_out × r`), names cover exactly the `target_modules`×60 layers, dtype is bf16/fp16 (float32 doubles your size for nothing — Ch. 19), `lora_B` tensors are *not* all zero.

### L1 — Loud-adapter serving proof (4×L4, ~1 h)

Exactly the Ch. 10.2 protocol with the loud adapter from Ch. 10.1. Passing means: adapters listed in `/v1/models`; outputs/logprobs differ base-vs-adapter at temperature 0; a 14k-token prompt either completes or fails fast. **This is the only test that cleanly separates H-02 (zeroing) from everything else** — a loud adapter that produces identical outputs proves the serving path zeroes you, no matter what your real adapter would have done.

### L2 — Real-adapter parity (4×L4, 2–4 h)

Your trained adapter, same serving session, paired task slice (Ch. 10.4). Watch specifically for: resolution *drops* on tasks the base solves (adapter hurting), timeouts on long prompts (H-03 in your local copy — note your local util/LoRA settings match the scorer's to make this meaningful), and wall-clock inflation per task.

### L3 — Canary submission ladder (the real thing, slots)

The scorer is the only oracle for scorer-side behavior (your local 0.90-util notebook is *more* permissive than the scorer's 0.80). Spend slots in this order, one per day:

| Step | Submission | What a score proves | What an error proves |
|---|---|---|---|
| C0 | Your current no-adapter best | Baseline sanity + infra healthy (compare to your previous score) | Infra/incident — check the board before concluding anything about yourself |
| C1 | Identical + `adapters/` carrying a **no-op** adapter (fresh init, r=8, attached to one agent) | Mounting adapters no longer breaks serving (H-03/H-04 dead on scorer) and ≈ C0 score expected — if it *scores below* C0, mounting still costs you | Defect cluster still live; adapters remain gated |
| C2 | Identical + **loud** adapter | If the score cratered vs C1: adapter weights genuinely flow (H-02 dead). If ≈ C1: still zeroed | (n/a — errors here re-check H-01-family issues) |
| C3 | Real trained adapter, r=16 | First interpretable adapter datapoint vs C0 | Re-check H-03 variants (sizing) |

**Reading results honestly.** A canary that *errors* is a clean negative (defect live) — cheap information. A canary that *scores* is only meaningful against the C0 twin run in the same environment era (the thinking patch, wheelhouse updates, and infra waves all shift baselines between days — never compare across eras). And per the staff's stated no-rescore policy for environment patches [V2-doc staff], **assume every submission is judged by the environment it ran in, permanently.**

Slot economics: C0 you'd spend anyway; C1–C2 are two slots for the single most valuable binary facts available; C3 begins the real track. If C1 errors, you have saved every adapter slot you would have burned — that is the ladder working, not failing.

---

## Ch. 13 — Training data and licensing

### 13.1 What you're allowed to train on (and ship)

- **The base model's license.** Gemma weights are Apache-2.0 *with the Gemma Terms of Use overlaid* [V2-doc HF/model card]. Adapters are derivative artifacts; the competition's winner license (open-source Apache-2.0 + mandatory training/inference code delivery) is compatible with LoRA adapters *and* with disclosing the base repo [V2-doc rules §2.5, §2.8]. Nothing in the terms forbids fine-tuning — it's the intended use.
- **Code corpora.** The hidden tasks come from ~120 open-source Python repos (50/50 popular/obscure split) [V2-doc]. Training on open-source code is license-dependent per repo (MIT/BSD/Apache permissive; GPL-family viral for *distribution* of derivatives — a LoRA trained on GPL code and released Apache-2.0 as a winning entry is a legal gray zone worth avoiding). If you sweep GitHub-scale data, filter to permissive licenses or keep provenance records; the winner's code-delivery obligation makes "we can't say what it trained on" a non-starter.
- **The public 129 tasks.** Their repos, hints (empty [V3-executed]), and *provided* test files are public data. Training on them risks overfitting to the public slice — the hidden slice is disjoint, so public-task gains don't transfer automatically. Use them for *evaluation*, not as your training corpus.

### 13.2 The highest-value data source: your own trajectories

The best-matched data for "make *this* agent better at *this* harness" is *this agent's own runs*. Concretely, three families, in ascending effort:

1. **Format-discipline data (start here).** Manually/scriptedly construct 500–3,000 spotless trajectories in the exact serving format: system prompt → user task → tool calls in Gemma 4's function-calling syntax → tool results → … → final patch. The model already knows Python; what it needs practice on is *your* output contract. This is also the family where LoRA most plausibly beats prompting (the thing Ch. 1 promised: encoding behaviors prompts can't reliably enforce).
2. **Rejection-sampled successes.** Run your agent (or base) on the public tasks N times; keep only trajectories that resolved; optionally keep best-of-k. This is self-distillation on the true distribution — no licensing question beyond the repos' (permissive-filter the tasks if you'll open-source everything).
3. **Counterfactual/repair data.** Take failed trajectories where the *right move* is knowable (a nudge existed, the fix was a one-line edit the model missed) and author the corrected continuation. Small counts of this are disproportionately effective for agent behavior, in community experience [V1-community ecosystem-level, prior not fact].

### 13.3 Data hygiene rules specific to this harness

- **No reliance on cross-turn thought persistence.** While H-05 stands (and the model card itself says prior-turn thoughts are dropped in multi-turn), your training trajectories must be *self-contained per turn* — never let the assistant's correct behavior depend on remembering a thought it emitted last turn. If the thinking patch lands, re-check this.
- **Match the serving chat template exactly.** Train through the same template the scorer serves (the HF chat template of 2026-07-09 vintage, with its fixed tool-calling loops and turn closures [V3-source HF]). TRL applies the model's template automatically; Unsloth ships its own Gemma 4 templates — verify token-level equivalence on one example before trusting either.
- **Dedup and cap.** Near-duplicate trajectories (same repo, same failure) teach "always emit this patch." Cap per-repo contribution; global shuffle before split.
- **Hold out tasks, not rows.** Split by *task/repo*, never by trajectory — otherwise val loss is contaminated by memorized task prefixes and lies to you.

---

## Ch. 14 — SFT mechanics I: building the dataset

### 14.1 The schema TRL wants [V2-doc, TRL 1.14.1 SFT docs]

Conversational rows, `messages` format, exactly as Ch. 6.2 showed:

```json
{"messages": [
  {"role": "system", "content": "<your agent system prompt, verbatim>"},
  {"role": "user", "content": "<task + initial repo context as the harness delivers it>"},
  {"role": "assistant", "content": "", "tool_calls": [{"id": "call_1", "type": "function",
     "function": {"name": "read_file", "arguments": "{\"path\": \"src/x.py\"}"}}]},
  {"role": "tool", "tool_call_id": "call_1", "content": "<tool output>"},
  {"role": "assistant", "content": "<final answer / patch submission>"}
]}
```

Rules that matter: `content` as *string* (not list-of-parts) for text-only turns; `arguments` as a **JSON-encoded string** (double-encoding here trains the H-06-adjacent pathology); one `tool_calls` array per assistant turn; tool results as `role: "tool"` with matching `tool_call_id`. If your trajectories came from harness logs, the logs' internal format is *not* this — write a converter and eyeball five samples through the tokenizer (`processor.apply_chat_template(...)`) before batch-converting 10k rows.

### 14.2 Volume, length, and mix

| Family | Rows (starting point) | Median length | Notes |
|---|---|---|---|
| Format-discipline | 500–3,000 | 1–4k tokens | synthetic/curated; biggest bang per GPU-hour |
| Rejection-sampled successes | 2,000–20,000 | 4–16k tokens | from public-task runs; cap 16k (max_length) |
| Repair/counterfactual | 200–1,000 | 2–8k tokens | hand-touched; quality over quantity |

Total 3k–20k rows is the realistic band for this competition's compute tier; LoRA on 31B saturates its useful adaptation well before "internet-scale." Sequence budget: `max_length=16384` matches the harness's realistic episode ceiling (32,768 never fits KV under H-03 anyway; and per TRL, rows are truncated `keep_start` past `max_length` — set it *deliberately*, because the default is a lossy 1024 [V2-doc TRL]).

### 14.3 The split and the poison filter

By task/repo (Ch. 13.3): ~90/10 train/val. Before either: drop trajectories containing (a) task IDs or repo URLs you promised yourself you wouldn't memorize, (b) leaked hidden-test content (you don't have any — keep it that way), (c) assistant turns that are empty *without* tool calls (format noise), (d) any turn pair where the "correct" behavior contradicts your target contract (mixed signals train mush). Keep the filter scripts — the winner's code-delivery obligation includes your data pipeline, and reproducibility is a judged virtue.

---

## Ch. 15 — SFT mechanics II: the training run

**Badge: SCHEMA-CHECKED** — APIs and defaults verified against TRL 1.14.1 / PEFT 0.21.1 docs and the PyPI pins; not executed this session.

### 15.1 The reference QLoRA script (1×L4 or 2×L4)

```python
# train_sft_qlora.py — Environment T. Full recipe: sidecars/training-recipes/sft-qlora-1xL4.md
import torch
from datasets import load_from_disk
from peft import LoraConfig, prepare_model_for_kbit_training
from transformers import AutoProcessor, Gemma4ForConditionalGeneration, BitsAndBytesConfig
from trl import SFTConfig, SFTTrainer

MODEL = "google/gemma-4-31B-it"                     # or ...-qat-q4_0-unquantized (see 16.4)

bnb = BitsAndBytesConfig(load_in_4bit=True, bnb_4bit_quant_type="nf4",
                         bnb_4bit_compute_dtype=torch.bfloat16,
                         bnb_4bit_use_double_quant=True)

processor = AutoProcessor.from_pretrained(MODEL)
model = Gemma4ForConditionalGeneration.from_pretrained(   # class per config.json "architectures"
    MODEL, quantization_config=bnb, device_map="auto")
model.config.use_cache = False                       # required with gradient checkpointing
model = prepare_model_for_kbit_training(model, use_gradient_checkpointing=True)

peft_cfg = LoraConfig(
    task_type="CAUSAL_LM", r=16, lora_alpha=16, lora_dropout=0.0, bias="none",
    target_modules=["q_proj","k_proj","v_proj","o_proj","gate_proj","up_proj","down_proj"])

ds = load_from_disk("data/agent_traj")               # Ch. 14 schema, task-level split

cfg = SFTConfig(
    output_dir="out/sft-r16",
    per_device_train_batch_size=1, gradient_accumulation_steps=16,   # eff. batch 16
    learning_rate=1e-4, num_train_epochs=2,           # TRL docs: adapters ≈1e-4 [V2-doc]
    lr_scheduler_type="cosine", warmup_ratio=0.03, max_grad_norm=1.0,
    bf16=True, gradient_checkpointing=True,
    max_length=16384,                                 # deliberate (TRL default is 1024!)
    packing=False, padding_free=False,                # agent trajectories: keep boundaries
    completion_only_loss=None,                        # auto: True for conversational data
    eval_strategy="steps", eval_steps=50, save_strategy="steps", save_steps=100,
    save_total_limit=3, logging_steps=10, report_to="none",
    dataset_num_proc=8,
)
trainer = SFTTrainer(model=model, args=cfg, train_dataset=ds["train"],
                     eval_dataset=ds["val"], peft_config=peft_cfg,
                     processing_class=processor.tokenizer)
trainer.train(); trainer.save_model("out/sft-r16/adapter")
```

Reading the important lines:

- **`quantization_config` + `peft_config` together = QLoRA.** TRL documents exactly this combination [V2-doc]; the base loads NF4-quantized (via `bitsandbytes 0.50.2`), the adapter trains in bf16.
- **`learning_rate=1e-4`** is TRL's documented adapter guidance [V2-doc]; `2e-4` is the other common convention (Unsloth's notebooks) — either is fine for a first run, Appendix E tabulates who says what. Below 5e-5 an r=16 adapter barely moves in 2 epochs; above 5e-4 it destabilizes.
- **`max_length=16384`** must be explicit — TRL's default is 1024 and it truncates `keep_start`, silently beheading every agent trajectory you curated [V2-doc]. This is the single most common "my adapter learned nothing" cause after no-op serving.
- **`packing=False`** for v1: packing (TRL's `bfd` strategy) fuses short samples for throughput — fine for generic instruction data, risky when turn-boundary semantics matter. Revisit only for throughput, after a clean v1.
- **`completion_only_loss=None`** (auto) computes loss on assistant tokens only for conversational data — you do not want to spend gradient teaching the model to *predict tool outputs* [V2-doc TRL]. `assistant_only_loss=True` is the stricter variant; it requires `{% generation %}` markers in the chat template — Gemma 4's HF template handles turn closure, but verify the markers exist before relying on the stricter mode.
- **Effective batch 16** (1 × 16 accumulation): agent trajectories are long; per-device batch stays 1 and accumulation does the work. Raise per-device only on 2×L4+ with `padding_free=True`.

### 15.2 What a healthy run looks like (and what sickness sounds like)

- **Healthy:** train loss falls from ~2.0 to ~0.6–0.9 over 1–2 epochs on this data scale; val loss tracks within ~0.2 and *rises* only near the end of epoch 2+ (that rise is your early-stopping signal). Logprobs on held-out completions sharpen visibly by mid-training.
- **NaN/inf loss, or loss stuck at ~10:** LR too high (drop 10×), or bf16 instability (try `adamw_torch_fused` default optimizer already in use; avoid fp16 entirely on L4).
- **Val loss great, harness behavior unchanged:** suspect the serving path, not the training (Ch. 12 L1) — this exact signature was the community's H-02 experience.
- **Val loss great, behavior *worse* (rigid, repetitive):** overfit format data / too many epochs; drop to 1 epoch, add the 10% val split's best checkpoint via `load_best_model_at_end=True, metric_for_best_model="eval_loss"`.
- **Loss ~0 by step 50:** you are memorizing (dedup failed, or a leakage column survived); check `remove_unused_columns` interplay and your poison filters.

### 15.3 Checkpointing, evaluation, and the save

`save_steps=100, save_total_limit=3` keeps disk sane on Kaggle (adapters are ~241 MB each at r=16 — 3 checkpoints ≈ 723 MB, fine). After training: `trainer.save_model()` writes the PEFT adapter; then run the Ch. 6.3 inspection (config fields, tensor census, **B-nonzero**), fix `base_model_name_or_path` to the served model id, and drop it into the competition layout. The eval that *matters* is not val loss — it is the Ch. 10.4 paired slice. Budget GPU time accordingly: on 1×L4, expect roughly 6–12 h for ~10k trajectories × 1–2 epochs at 16k `max_length` (estimate from measured throughput of the first 50 steps; Unsloth's stack cuts this materially [V2-doc vendor]).

### 15.4 The Unsloth alternative (when to switch)

Same job, ~1.5× faster, ~60% less VRAM per the vendor [V2-doc]: worth it on 1×L4 at 31B (their measured 22 GB QLoRA envelope), on longer `max_length`, or when iterating datasets. Costs: another stack to pin (keep it in its own env), its own template handling (verify against HF's token-for-token), and Gemma 4-specific gotchas currently documented on their Gemma 4 page: `num_kv_shared_layers=0` triggers a `layer_types[:-0]` cache crash on 31B/26B *inference*; E2B/E4B's KV-shared layers diverge under `use_cache=False` (the 31B is unaffected — its count is 0) [V2-doc vendor]. The recipe files in `sidecars/training-recipes/` show both stacks side by side.

---
# Part III — Advanced

## Ch. 16 — QLoRA, memory arithmetic, and the compute tiers

### 16.1 Where the gigabytes go during QLoRA training

Back-of-envelope for the reference run (31B, r=16, all seven, bf16 compute, NF4 base, `max_length` 16384, gradient checkpointing on). Every line is derivable from config dims [V3-source] except activations, which are workload-dependent:

| Component | Size | Arithmetic |
|---|---|---|
| Base weights, NF4 (+double-quant overhead) | ~16.5 GB | 30.7B params × ~0.537 B/effective (4-bit + scales) |
| Adapter weights (trainable, bf16) | ~0.24 GB | r=16 × 125,720 × 60 × 2 B = 241 MB (Ch. 9) |
| Adapter gradients (bf16) | ~0.24 GB | 1× trainable params |
| Optimizer state (AdamW, fp32 m+v on trainable) | ~0.48 GB | 2 × 241 MB × 2 B (fp32) |
| Activations (checkpointed) | ~2–5 GB | scales with batch × seq² / checkpoint frequency |
| CUDA context + fragmentation reserve | ~1–2 GB | empirical floor on L4-class |
| **Total** | **~21–24 GB** | lands on Unsloth's measured "31B QLoRA in 22 GB" [V2-doc vendor] |

One subtlety the table hides: adapter *rank* is cheap in weights but not free overall — r=16→128 adds ~1.7 GB of adapter weights, another ~1.7 GB of bf16 gradients, and ~6.8 GB of AdamW fp32 states (m+v), ~10 GB all-in. That is why r≤32 is the comfortable 1×L4 envelope, r64 wants an 8-bit optimizer (`optim="adamw_8bit"` halves the optimizer share), and r128 training wants 2×L4. Your other levers, in order of pain: reduce `max_length` → raise gradient accumulation instead of batch → `padding_free=True` (flash-attention-style, no pad waste) → shorter trajectories in the dataset itself.

bf16 (non-QLoRA) LoRA on the unquantized 31B needs ~61 GB weights alone → 2×L4 sharded is *tight* (accelerate device_map), 4×L4 comfortable. Quality difference QLoRA-vs-bf16-LoRA at these scales is consistently small in the literature; do not pay 2× hardware for it before you have a measured reason.

### 16.2 Tier × method matrix

| Tier | QLoRA r≤32 | QLoRA r128 / DoRA | bf16 LoRA | Wheelhouse serving w/ LoRA | Local full eval |
|---|---|---|---|---|---|
| 1×L4 24 GB | ✅ (the design point) | ⚠️ tight | ❌ | ❌ | ❌ |
| 2×L4 48 GB | ✅ fast | ✅ | ⚠️ sharded, tight | ⚠️ TP2 ≠ scorer (TP4) | ⚠️ |
| 4×L4 96 GB | ✅ | ✅ | ✅ | ✅ **scorer-faithful** (util 0.90) | ✅ (~12–14.5 h) |
| External ≥96 GB | ✅ | ✅ | ✅ | ✅ if L4-shaped | ✅ |

The one thing money can't shortcut: **serving-faithful testing wants the L4×4 shape specifically**, because the KV-collapse arithmetic (245.76 kB/token/GPU) and the 0.80-util margin are memory-layout facts, not FLOPs facts. A rented A100 reproduces *training* perfectly and *serving* misleadingly.

### 16.3 Throughput notes for the impatient

- **Packing** (`packing=True`, `packing_strategy="bfd"` [V2-doc TRL]): fuses short samples into full-length rows — big win on heterogeneous instruction data, but it blurs trajectory boundaries; use only for the format-discipline family, never the rejection-sampled family.
- **`padding_free=True`** with a compatible stack eliminates pad-token waste inside batches of uneven lengths; free throughput on agent data.
- **`dataset_num_proc=8`** parallelizes tokenization (minutes → seconds on 10k rows).
- **Liger kernels** (`use_liger_kernel=True`) cut memory via fused ops — verify Gemma 4 support in your exact versions before relying on it; unsupported-fusion falls back or crashes.
- **Unsloth's ~1.5×/~60%** [V2-doc vendor] effectively converts a 1×L4 tier into a 1.5×L4 tier; the decision rule is simply "if jobs queue behind each other on the free tier, switch."

### 16.4 The train/serve precision question (open, flagged honestly)

You train on a bf16 checkpoint (`gemma-4-31B-it` or `-qat-q4_0-unquantized`); the scorer serves W4A16 QAT (`-ct`). The adapter's shapes match — it loads — but the *function* it learned was calibrated against bf16 weight outputs. Three stances, none confirmed by evidence in-corpus:

| Option | Rationale | Risk |
|---|---|---|
| Train on `-qat-q4_0-unquantized` (bf16) | Same QAT-trained weight *values* Google distilled; closest function to what `-ct` approximates | None known; modestly larger download than plain `-it` |
| Train on plain `gemma-4-31B-it` (bf16) | The conventional choice; simplest | Small distribution shift at serve time |
| QLoRA on the `-ct` checkpoint itself | Perfect serve-match in principle | `bitsandbytes` NF4-on-compressed-tensors is **not a supported path** (Kaggle flags `-ct` FINE-TUNABLE: No [V2-doc]); treat as unavailable |

Default recommendation: `-qat-q4_0-unquantized` for training, and treat "adapter transfers across the bf16→W4A16 gap without measurable loss" as **an unverified assumption your paired eval (Ch. 10.4) must cover** — it is one more reason the canary ladder precedes any adapter commitment. (This is precisely the K1/K2-style pairing check discipline: prove the transfer on a small slice before betting slots on it.)

---

## Ch. 17 — Multi-adapter orchestration under the 3 GiB budget

### 17.1 What the serving contract enables

Every `LlmAgent` in your YAML may declare its own `adapter:` [V3-source]; vLLM holds up to `max_loras=8` resident [V3-source]. So the *architecture* available to you is: one shared base, up to 8 behaviorally-specialized agent heads, zero extra inference servers. Sketches, in ascending ambition:

| Pattern | Adapters | Shape | Claim to value |
|---|---|---|---|
| **Single-head** | 1 | root agent only | simplest; the only pattern with any (indirect) scored evidence |
| **Role split** | 2–3 | root (orchestration) + patch-writer + verifier sub-agents | specialize the *output contract* per role; each adapter sees cleaner data |
| **Tool-band split** | 2–4 | per tool family (e.g. a search-heavy head, an edit-heavy head) | targets observed failure modes per tool |
| **Cascade** | 2 | cheap head first, escalate to strong head on self-reported doubt | spends long-generation time only when needed |

The honest expected-value ordering: single-head ≫ role-split > the rest, *for this competition's data scale*. Multi-adapter shines when each head gets enough clean role-matched data; with 3–20k total trajectories, splitting them thins every head below the useful floor. Do single-head first; split only when one role's failures dominate your error analysis and you have ≥2k role-matched rows for the specialist.

### 17.2 Sizing the bundle

- **Zip constraint:** Σ adapter sizes < ~2.9 GB (3 GiB minus your prompts/configs/skills). At r=16 all-seven that is *eleven* adapters; at r=64, two. Arithmetic in Ch. 9; per-adapter configs in the sidecar ladder.
- **Serving constraint (post-fix world):** if the promised right-sizing lands, the preallocation should track your submission's actual `max(rank) × count` — then total bundle rank, not the 8×128 worst case, prices your KV. Design bundles with small total Σr; prefer several r=8–16 heads over a few r=64s unless measurement says otherwise.
- **While H-03 stands:** any adapter mounted ⇒ 7.6k-token world regardless of count or size — which simply means the whole chapter is downstream of the Ch. 12 canaries. (Also: all adapters in the zip are registered via `--lora-modules` at launch [V1-community]; under the current defect the mount-triggered cost is paid even by adapters no agent references. Ship only adapters you attach.)

### 17.3 Failure modes unique to multi-adapter

**Name collisions** with the base model id or LiteLLM prefixes (avoid `gemma`, `openai`, `base` as adapter names). **Silent fallback**: a typo'd `adapter:` on a sub-agent may fall back to base behavior rather than erroring — audit each sub-agent's actual model in the local run's request logs (LiteLLM logs the resolved id). **Cross-adapter interference at eval time**: with per-role adapters, your paired protocol must compare *systems* (whole bundle vs. no bundle), not adapters one at a time, or you'll attribute ensemble effects to single heads.

---

## Ch. 18 — Beyond SFT: DPO and RLVR, costed honestly

### 18.1 What each method buys

- **DPO** (direct preference optimization): pairs of (better, worse) completions for the same prompt; the model's *relative* preferences shift without a separate reward model or RL sampling loop. TRL's `DPOTrainer` consumes PEFT models directly. Good for: sharpening tool-call discipline when you can enumerate "the right way vs. the tempting wrong way" (e.g., well-formed patch submission vs. rambling; correct file picked vs. near-miss). Data need: 1–5k *pairs* — you can synthesize these from your rejection-sampling logs for free (resolved vs. best failed run per task).
- **RLVR** (RL with verifiable rewards): the agent acts, the environment scores (hidden tests pass/fail — *resolvable* is your reward), policy gradients follow. This is the endgame the competition's framing explicitly encourages, and the only method that optimizes the actual metric. Cost: every gradient step needs *generation* (full agent episodes) plus scoring — orders of magnitude beyond SFT per unit of learning. On free-tier quota it is a multi-week program by itself. vLLM's dynamic-LoRA-swap and `load_inplace` features exist exactly for this loop [V2-doc docs.vllm.ai] — but on the *stock* vLLM versions that document them; the wheelhouse fork's vintage makes this a verify-first, not assume-first, integration.

### 18.2 The realistic sequencing

1. **SFT first, always.** DPO/RLVR on top of a base that lacks the format basics spends samples teaching syntax. Your SFT adapter is also the warm-start that makes RLVR's credit assignment tractable.
2. **DPO second**, on synthetic pairs from logs you already have — the cheapest marginal quality on *discipline* failures (your error analysis will show these: truncated patches, wrong tool order, quitting early).
3. **RLVR last, if at all**, scoped to the highest-frequency failure family, on rented compute, in the final month — and only after the Ch. 12 canaries prove the serving path, or you'll be optimizing rewards for a scorer that zeroes adapters anyway.
4. **Paper-track note.** The companion paper track ($35K, 2026-11-12, 3k words, two writeups) rewards *methods* contributions; a careful negative-or-narrow result (e.g., a rigorous accounting of the adapter-serving defect cluster and its fixes) is legitimate material there even if the adapter track itself stays gated [V2-doc paper-track page]. If your RLVR ambitions outrun your leaderboard budget, the paper is where they cash out.

### 18.3 Cost table (rough, L4-equivalent GPU-hours for ~5k-pair/5k-episode scale)

| Method | Data prep | Training | Serving verification | Total for one iteration |
|---|---|---|---|---|
| SFT r=16 | 4–8 h (CPU) | 6–12 h | 2–4 h | ~1 day on 1×L4 |
| DPO on SFT ckpt | +4 h (pair mining) | 8–16 h | 2–4 h | ~1.5 days on 1×L4 |
| RLVR (GRPO-class) | env setup 1–2 d | 40–100+ h generation-dominated | 2–4 h | ~1 week on 4×L4 |

The RLVR line is why "RL is encouraged" and "RL is *possible* on your budget" are different sentences.

---

## Ch. 19 — Troubleshooting encyclopedia

Symptom → likely cause → fix. `H-*` cross-references are the Ch. 11 register.

| Symptom | Likely cause | Fix |
|---|---|---|
| Serving error "…does not support LoRA yet" | **H-01**: stock vLLM in the serving env | Install *only* wheelhouse wheels in Environment S; verify `pip show vllm` shows the fork (no clean PyPI version string) |
| Adapter mounted, outputs byte-identical to base at temp 0 | **H-02** zeroing (if loud adapter also identical), or trained adapter genuinely no-op (B=0), or wrong model id requested | Run loud-adapter test (Ch. 10.1); inspect `lora_B` nonzeros; check the LiteLLM id is `openai/<name>` |
| `discover_adapters` returns empty manifest | Wrong directory passed (adapters/ instead of submission root), or non-whitelisted extension | Pass the root containing `agent.yaml`; files must be `.json`/`.safetensors` [V2-doc staff] |
| Long prompts sit in queue forever, no error | **H-03** KV collapse (scheduler waiting for space that never frees) | Locally: raise util / lower max_loras·rank; on scorer: gated until host fix confirmed — canary C1 |
| Adapter file unexpectedly ~2× the Ch. 9 prediction | Tensors saved in fp32 | Save in bf16: `model = model.float()`-inverse / pass dtype at save, or re-cast the safetensors |
| Submission rejected at validation: extension / size / layout | Non-whitelisted file (e.g. `.bin`), >3 GiB unpacked, missing root `agent.yaml` | L0 static checks (Ch. 12); build zip from a clean staging dir |
| Trained model "learned nothing" (val loss barely moved) | TRL `max_length` default 1024 truncated all trajectories `keep_start` | Set `max_length` explicitly (Ch. 15.1) — the #1 silent trainer misconfig |
| Training loss NaN / spikes | LR too high for rank/α; fp16 instability | 10× lower LR; bf16 only on L4; reduce α toward r |
| Val loss ↓ but agent *worse* (rigid, repetitive) | Overfit small format dataset; too many epochs | 1 epoch; more diverse data; early stop on eval_loss |
| Gemma 4 E2B/E4B training loss diverges wildly | KV-shared layers + `use_cache=False` divergence [V2-doc vendor] | Follow Unsloth's current guidance for small-model cache; or prototype on 12B/31B |
| Crash `layer_types[:-0]` index error at inference | `num_kv_shared_layers=0` path bug in some stacks [V2-doc vendor] | Patch/upgrade per Unsloth's Gemma 4 notes; 31B-specific |
| Tool-call arguments arrive double-encoded (`\"{\\\"...` ) | **H-06** escaping pathology in the serving path, possibly *trained in* if your data had it | Ensure dataset `arguments` are single-encoded strings; report/track H-06; keep adapters away from tool-result echo |
| Session ends `ContextWindowExceededError`, patch empty despite edits | **H-14** compaction can't fire; exception skips patch fallback [V1-community 744692] | Keep episodes under the live ceiling; monitor the threshold confirmation thread; this is harness-side, not yours |
| Model "forgets" its plan between tool calls | **H-05** thoughts dropped (`reasoning_content` vs `reasoning`) [V1-community 744354] | Harness-side; design prompts/self-contained turns meanwhile; watch for the host patch |
| Whole submission errors ~20–30 min in, prior runs scored | Infra wave or wheelhouse-update instability (744807-class) | Check the board before self-blaming; resubmit after wave clears; keep canary baseline current |
| Score far below local CV | CV/LB anti-correlation via environment differences (missing wheels, SSL-dead tasks) [V1-community multi] | Trust only paired same-environment deltas (Ch. 10.4) |
| 12 h global limit hit, submission errors | Overrun currently errors the whole run [V2-doc staff] | Set all four `eval_config.yaml` budgets explicitly; trim per-task ceilings |
| Adapter works locally, errors on scorer | Any scorer-side divergence (util 0.80 vs your 0.90; different wheelhouse v) | Reproduce at scorer-exact settings; canary ladder before real slots |

---

## Ch. 20 — The go/no-go decision framework

### 20.1 The decision, as of 2026-10-01

*(decision sketch — **ILLUSTRATIVE**, per the Ch. 0 badge policy)*

```
IS A REAL ADAPTER SHIP RATIONAL TODAY?                    [sweep date 2026-10-01]

Evidence:  zero adapter submissions have EVER scored (H-04). Zeroing fix claimed
          but unconfirmed (H-02). KV fix promised but deployment unverified (H-03),
          and the update meant to carry it triggered its own error wave (744807).
          Every meanwhile-prompted baseline improvement is bankable now.

          ┌── NO-GO on adapter submissions. Run the Ch.12 canary ladder (C1/C2,
          │   2 slots over 2 days) to buy the facts; keep prompts/architecture as
          │   your scoring track. Build the training pipeline (it transfers).
          ▼
C1 (no-op adapter) ──errors──► defect cluster live ──► stay NO-GO; re-check weekly
          │
          └──scores ≈ C0──► mount cost paid ──► C2 (loud adapter)
                                    │
                     ┌───scores cratered──► H-02 dead: weights flow. GO on the
                     │                     adapter track (C3 real adapter next).
                     └───scores ≈ C0──► H-02 still live ──► NO-GO; wait for
                                           confirmation, re-run ladder after any
                                           wheelhouse update.
```

GO means: proceed to C3 (real r=16), then the Part II pipeline with paired evals gating every escalation. NO-GO means: your score comes from prompts/architecture/budgets; adapters remain a *local* research track whose artifacts are ready the day the gates open. **The framework's job is to make the flip cheap** — the entire ladder is 2–3 slots, and every branch ends in a fact you did not have before.

### 20.2 The monitoring triggers (what flips the decision without canaries)

Any *one* of these, verified on the live board, upgrades the prior toward GO; their absence on a weekly check keeps the NO-GO:

1. **Any adapter submission scores anything** (watch the LB and the adapter threads; one scored datapoint kills H-04's prior).
2. **Host confirms KV sizing fix deployed** (the "size the loras parameters" thread resolving with a "deployed" + date).
3. **A clean independent zeroing confirmation** (loud-adapter retest done right — right directory, both matrices randomized — on current wheelhouse).
4. **744807-class instability clears** (post-update submissions scoring again restores the evidentiary value of your own canaries).

Red-team both directions before acting: **confirmation bias** — wanting the adapter track to be viable because you built the pipeline; the zero-scored-record is data, not spite. **And the opposite** — writing adapters off entirely because of a defect cluster that the host is visibly fixing at weekly cadence (v1→v28 in five days *is* a fix pipeline, whatever its stumbles). The gate structure is the hedge against both.

### 20.3 Expected-value sketch (order-of-magnitude, honest about error bars)

| Track | Cost to first signal | Ceiling this cycle | Kill risk |
|---|---|---|---|
| Prompts/architecture | hours/slot | 0.10–0.20 LB (community evidence: 0.12 prompts-only) | low |
| + Adapter (gated GO) | 2 canary slots + ~1 day | unknown; plausibly +0.02–0.08 over your baseline if transfer holds | serving defects, transfer gap |
| + DPO on top | +1.5 days | sharpens discipline failures | data quality |
| + RLVR | +1 week | the actual metric; highest variance | compute quota, integration risk |

The adapter line's honest pitch is not "biggest ceiling" — it's *orthogonality*: everything on the prompt track saturates; weight-level behavior is the only other dial the rules give you.

---

## Ch. 21 — Submission checklist and the final workflow

### 21.1 The build (scripted, repeatable, ~minutes)

**Badge: SCHEMA-CHECKED** — validator constants (3 GiB bytes, extension/`base_model_name_or_path` expectations, B-nonzero check) verified against HARNESS_README and the sample adapter; script not executed this session.

```bash
# build.sh — stage, check, zip. Run from your repo of submission assets.
set -euo pipefail
STAGE=build/submission
rm -rf "$STAGE" && mkdir -p "$STAGE/adapters"
cp agent.yaml "$STAGE/"
cp eval_config.yaml "$STAGE/"
cp -r skills/ "$STAGE/skills/" 2>/dev/null || true
cp -r out/sft-r16/adapter "$STAGE/adapters/main_lora"
python - <<'EOF'                       # L0 static checks (fail loudly, early)
import json, pathlib, safetensors.torch as st
root = pathlib.Path("build/submission")
total = sum(f.stat().st_size for f in root.rglob("*") if f.is_file())
assert total < 3_221_225_472, f"unpacked {total} B exceeds 3 GiB"
for d in (root/"adapters").iterdir():
    cfg = json.load(open(d/"adapter_config.json"))
    t = st.load_file(str(d/"adapter_model.safetensors"))
    assert cfg["r"] <= 128, "rank exceeds max_lora_rank"
    assert cfg["base_model_name_or_path"] == "google/gemma-4-31b-it-qat-w4a16-ct"
    assert any(float(v.abs().sum()) > 0 for k, v in t.items() if "lora_B" in k), "B all zero"
    print(d.name, cfg["r"], len(t), "tensors OK")
print(f"total {total:,} B")
EOF
cd build && zip -r -X ../submission.zip submission && cd ..
```

`zip -X` strips extra file attributes — belt and suspenders for validator strictness. Then the Ch. 10.2 serving smoke on the *staged tree* (not your training output dir), then the paired slice if anything material changed.

### 21.2 The pre-flight card (every submission, 5 minutes)

- [ ] Wheelhouse version noted (dataset page) and different from your last run? → re-run L1 smoke before trusting local results.
- [ ] Board scanned for active incident waves (Notebook Threw Exception / zip-submit error threads)?
- [ ] `eval_config.yaml`: all four budget keys set; totals leave margin under 12 h?
- [ ] Adapter track only: C-ladder state current (no new host fix announcements since your last canary)?
- [ ] Recording ready: submission id, date, wheelhouse v, adapter hash (`sha256sum adapter_model.safetensors`), one-line hypothesis ("tests X"), expected outcome.
- [ ] **Save Version completed successfully *before* Submit** — submitting before a successful notebook Save Version fails instantly and still consumes the slot [V1c host-stated, 743683].
- [ ] Final picks (2) reserved — never spend the last week's slots before deciding them.

### 21.3 The loop that ties the document together

1. **Weekly**: re-check the sidecar's re-check list (wheelhouse v, adapter-scored-yet, KV/zeroing/thinking threads, incident waves). ~10 min.
2. **Per improvement**: build → L0 → L1 (if serving-relevant) → paired slice → slot. One variable per submission; the hypothesis line in your log is what makes a week of slots an experiment instead of a slot furnace.
3. **Per gate-flip** (any §20.2 trigger): re-run the canary ladder before spending real-adapter slots.
4. **At the end**: your two final picks want your two *highest-evidence* submissions — usually the boring repeatable ones, which is the point of having kept evidence.

---
# Appendices

## Appendix A — Master constraint table

Status legend: SNAP = verified in the supplied 2026-09-29/30 snapshots only; LIVE-OK = re-verified on the live page 2026-10-01. Tiers as Ch. 0.

| # | Constraint | Value | Source | Tier | Status |
|---|---|---|---|---|---|
| C-01 | Permitted base model | `gemma-4-31b-it-qat-w4a16-ct` only | HARNESS_README §3.2; Overview | V3s | LIVE-OK |
| C-02 | One unique base model per submission | `validate_single_declared_model` | HARNESS_README §3.2 | V3s | SNAP |
| C-03 | Unpacked submission size | < 3 GiB = 3,221,225,472 B incl. `adapters/` | HARNESS_README §2.4 | V3s | SNAP |
| C-04 | Allowed extensions | `.yaml .yml .md .txt .py .json .safetensors` | HARNESS_README §2.4 | V3s | SNAP |
| C-05 | Adapter weight format | `.safetensors` only; pickles rejected | HARNESS_README §2.4 | V3s | SNAP |
| C-06 | Adapter dir contract | `adapters/<name>/{adapter_config.json, adapter_model.safetensors}` | HARNESS_README §2.2/§3.4 | V3s | SNAP |
| C-07 | Adapter attach | `adapter: <name>` on any `LlmAgent` | HARNESS_README §3.4; Overview | V3s | LIVE-OK |
| C-08 | vLLM LoRA knobs | `enable_lora=True, max_loras=8, max_lora_rank=128` | HARNESS_README §3.1 | V3s | SNAP |
| C-09 | Context ceilings | `max_model_len=32768`; `max_output_tokens` 1–32768 (dflt 16384); `thinking_budget` 0–32768 (dflt 4096) | HARNESS_README §2.4 | V3s | SNAP |
| C-10 | Serving rig | TP=4, 4×L4 24 GB, `gpu_memory_utilization=0.80` (~19.2 GB/GPU usable) | HARNESS_README §3.1 | V3s | SNAP (D-01: notebook uses 0.90) |
| C-11 | thinking_level hazard | omit `thinking_level` via vLLM OpenAI endpoint (esp. with LoRA); use `include_thoughts` + `thinking_budget` | HARNESS_README §2.4 note | V3s | SNAP |
| C-12 | `eval_config.yaml` scorer-read keys | exactly 4: `timeout_seconds`, `max_tool_calls`, `max_time_minutes`, `max_turns`; scorer default = no limit | staff 743063 | V2d staff | LIVE-OK (D-04 resolved: layer confusion) |
| C-13 | 12 h global limit | all tasks incl. sandbox setup, excl. validation; overrun errors whole run (score-0-for-unfinished planned, unconfirmed) | Overview; staff | V2d+V1c | SNAP |
| C-14 | Cadence | 1 submission/day; 2 final picks; team ≤ 5 | Rules §2 | V2d | LIVE-OK |
| C-15 | Winner license | OSS Apache-2.0; deliver training + inference code + env description | Rules §2.5/§2.8 | V2d | SNAP |
| C-16 | Open-source-only code | OSI-approved, no commercial limits | Rules §2.6.c | V2d | SNAP |
| C-17 | External data/teachers | allowed if license-compliant + reasonably accessible; distillation OK per staff | Rules §2.6; 742807 | V2d+V1c | SNAP |
| C-18 | Timeline | start 2026-09-23; paper 2026-11-12; entry+merger 2026-11-25; final 2026-12-02 23:59 UTC | Overview Timeline | V2d | LIVE-OK |
| C-19 | Public tasks | 129: fastapi 67 / rich 48 / requests 13 / httpx 1; hints empty on all | Data page; recounted from `tasks.jsonl` | V3-exec | EXECUTED |
| C-20 | Hidden tasks | ~120, private repos, ~even public/private split | Data page | V2d | SNAP |
| C-21 | Hidden-set gold-clean | all hidden tasks pass with gold patch (host-stated) | 744370 | V1c host | SNAP |
| C-22 | Rank ceiling | 128 (`max_lora_rank`) | HARNESS_README §3.1 | V3s | SNAP |
| C-23 | Concurrent adapters | up to 8 mounted | HARNESS_README §3.1 | V3s | SNAP |
| C-24 | Scoring wall-clock | ~12–14.5 h on L4×4; queues 4–13+ h; quota ≈ 2× wall (~30 GPU-h/wk) | forum digest §8 | V1c multi | SNAP |
| C-25 | README adapter size bands | r=16 "110–220 MB" … r=128 "0.9–1.8 GB" | HARNESS_README §3.4 | V3s-claimed | **RECOMPUTED — bands run ~8–10% low; use Ch. 9 values** (D-05 resolved) |
| C-26 | Notebook divergences | local util 0.90 / tp auto / subprocess sandbox / compaction_interval 15 vs scoring 0.80 / TP4 / docker / 5 | Getting Started vs README | V3s both | SNAP (D-01..D-03) |
| C-27 | Protected files | `pytest.ini`, `conftest.py`, test files reset in Container B — never patch tests | HARNESS_README §8.2.3 | V3s | SNAP |
| C-28 | Tool caps | read_file ≤ 150 lines AND 10,000 chars; run_command output 5,000 chars | HARNESS_README §6.1/§6.2 | V3s | SNAP |
| C-29 | Thinking mode | `enable_thinking: true` default; thoughts-drop bug H-05 patch incoming at cutoff, no rescore | HARNESS_README §3.3; 744354 | V3s+V1c | LIVE (patch still "incoming" 9/30) |
| C-30 | KV collapse with adapters | 46,048 → 7,600 tokens; >7.6k prompts hang; no-adapter submissions unaffected | 744331 | V1c multi | LIVE — fix promised, deployment unconfirmed (P3 open) |

Derived implications: **I-1** 3 GiB minus prompts/configs/skills ⇒ realistically ≤ ~3.0 GiB adapter bytes (≈11×r16 / 6–8×r32 / 3×r64 / 1×r128 bundles). **I-2** rank ≤ 128 hard; rsLoRA scaling note applies within it. **I-3** bf16-train → QAT-serve cross-precision transfer is an *open risk*, covered by paired eval, not by assumption.

---

## Appendix B — Configuration-key reference

### B.1 `agent.yaml` — `LlmAgent` fields that matter to this tutorial [V3-source, HARNESS_README §2.2/§3.4]

| Key | Type / range | Default | Notes |
|---|---|---|---|
| `model` | string | — | Must be the one permitted base id (C-01/C-02); every agent and sub-agent |
| `adapter` | string | none | Name of `adapters/<name>/` to mount for this agent; becomes LiteLLM id `openai/<name>` |
| `description` | string | — | Sub-agent discovery metadata |
| `sub_agents` | list | — | Recursive agent tree; each entry may carry its own `adapter:` |
| `tools` | list | — | From the 9 harness tools (Appendix H) |
| `instruction` | string | — | System prompt |
| `include_thoughts` | bool | false | Thinking visibility; per C-11 use this, not `thinking_level`, under vLLM |
| `thinking_budget` | int 0–32768 | 4096 | 0 disables thinking (E2B/E4B caveat: still emits empty block; 31B clean) |
| `max_output_tokens` | int 1–32768 | 16384 | Generation cap; interacts with C-09 ceiling arithmetic |
| `temperature` / `top_p` / `top_k` | float | model card rec: 1.0 / 0.95 / 64 | Sampling; model-card recommendations |

### B.2 `eval_config.yaml` — the four keys the scorer reads [V2d staff, 743063]

| Key | Unit | Scorer default | Recommended explicit value |
|---|---|---|---|
| `timeout_seconds` | s per task | **no limit** | 300 |
| `max_tool_calls` | count per task | **no limit** | 60–100 |
| `max_time_minutes` | min per task | **no limit** | 25–35 |
| `max_turns` | agent turns per task | **no limit** | 60–120 |

Anything else in the file (60-min/100-call style defaults you may see in README or `inference.py`) belongs to the *local* runner, not the scorer (D-04, resolved). The 12 h global limit (C-13) applies regardless and currently errors the whole run on overrun.

### B.3 `adapter_config.json` — full field walkthrough at Ch. 8.1; competition-relevant subset

| Field | Ship value | Why |
|---|---|---|
| `peft_type` / `task_type` | `"LORA"` / `"CAUSAL_LM"` | matches sample + loader expectations |
| `r` / `lora_alpha` / `lora_dropout` | ladder rung / = r or 2r / 0.0 | Ch. 9 |
| `target_modules` | all seven projections | Ch. 9 ladder |
| `layers_to_transform` | **null/omit** | sample's `[0]` is toy placeholder |
| `base_model_name_or_path` | `"google/gemma-4-31b-it-qat-w4a16-ct"` | sample convention; field validation unanswered by host |
| `use_rslora` / `use_dora` | false initially | post-baseline experiments |
| `modules_to_save` | **null** | embeddings would blow 3 GiB (Ch. 8.3) |

---

## Appendix C — Adapter sizing & memory arithmetic

### C.1 Adapter bytes [V3-executed formula; empirically cross-checked twice]

`bytes ≈ 2 (bf16) × r × Σ(in+out dims of targets) × 60 layers (+ ~0.6 kB safetensors header)`

Per-layer per-rank sums (Gemma 4 31B dims from config.json): q 13,568 · k 9,472 · v 9,472 · o 13,568 · gate 26,880 · up 26,880 · down 26,880; attention-only 46,080; all-seven 125,720.

| r | q,v only | attention | all seven | ×2 adapters | ×4 adapters |
|---|---|---|---|---|---|
| 8 | 22 MB | 44 MB | 121 MB | 242 MB | 483 MB |
| 16 | 44 MB | 88 MB | 241 MB | 483 MB | 966 MB |
| 32 | 88 MB | 177 MB | 483 MB | 966 MB | 1.93 GB |
| 64 | 177 MB | 353 MB | 966 MB | 1.93 GB | ❌ >3 GiB with anything else |
| 128 | 354 MB | 707 MB | 1.93 GB | ❌ | ❌ |

Checks: sample adapter 217,672 B exact (r=4, q+o, layer 0); community r=64 all-seven = 980 MB reported vs 966 derived (+1.5%). README bands (C-25) undershoot ~8–10% — budget by this table.

### C.2 Serving-side KV arithmetic (TP4, per GPU) [V1c multi-repro, arithmetic-consistent]

| Quantity | No adapters | With adapters (8×128 prealloc) |
|---|---|---|
| KV bytes/token/GPU | 245,760 B | 245,760 B |
| Free KV pool @ util 0.90 (measured) | ~10.5 GiB → 46,048 tokens | ~1.74 GiB → **7,600 tokens** |
| @ util 0.80 (scorer, derived) | smaller pool, fewer tokens | **strictly worse than 7,600** |
| Cost of mounting | — | ~8.8 GiB KV/GPU |

Tokens, not bytes, are the user-visible unit: >pool ⇒ request waits forever (`scheduler_reserve_full_isl`), reads time out (~900 s measured), task scores 0. ~99% of real episodes exceed 7.6k prompt tokens (community corpus, 636 runs).

### C.3 Training-side VRAM (1×L4, QLoRA r16, 16k seq, ckpt on) [derived; lands on vendor's measured 22 GB]

NF4 base ~16.5 GB + adapter/grads/optimizer ~0.96 GB + activations ~2–5 GB + context ~1–2 GB ≈ **21–24 GB**. Rank is cheap in weights, costly in optimizer states — r16→128 adds ~10 GB all-in (1.7 weights + 1.7 grads + 6.8 AdamW fp32); an 8-bit optimizer halves the optimizer share. Sequence length and batch are the other levers (Ch. 16.1).

---

## Appendix D — Artifact catalog

Deliverables in `independent_research/2026-10-01-lora-primer-gemma4/`:

| Artifact | Badge | Contents |
|---|---|---|
| `lora-primer-tutorial-kaggle-gemma4.md` | — (document; code blocks individually badged) | this tutorial, Parts I–III + Appendices A–J |
| `README.md` | — | folder map + how to use |
| `sidecars/lora-competition-surface.md` | SCHEMA-CHECKED | one-page constraint card + re-check list (mirror of Ch. 3 + Appendix J) |
| `sidecars/adapter-ladder/README.md` + `rung-*.json` (6) | SCHEMA-CHECKED | per-rung adapter_config.json + loud/no-op canary configs + multi-adapter bundle math |
| `sidecars/training-recipes/README.md` + 4 recipes | SCHEMA-CHECKED | QLoRA 1×L4 / bf16 2×L4 / Unsloth variant / DPO-on-SFT; version-pinned envs |

Badge policy restated plainly: **no VALIDATED artifacts exist in this deliverable** — this research session had no GPU, so nothing was executed end-to-end. Every code/config block is SCHEMA-CHECKED (names, keys, versions, paths verified against the pinned sources) or ILLUSTRATIVE (teaching sketches, e.g. the ASCII decision tree). Scratch scripts that *were* executed (task recount, zip inspection, size arithmetic) live in `independent_research/scratch/lora-primer/` with their outputs in `verify-results.md`; they validate *facts*, not runnable artifacts.

---

## Appendix E — Hyperparameter provenance

| Parameter | Value used | Provenance | Tier |
|---|---|---|---|
| LoRA LR | 1e-4 | TRL SFT docs: "when training adapters, you typically use a higher learning rate (≈1e-4)" | V2d |
| LoRA LR (alt) | 2e-4 | Unsloth Gemma 4 notebook convention | V2d vendor |
| TRL base LR default (for contrast) | 2e-5 | SFTConfig signature | V2d |
| α vs r | α = r (or 2r; sample uses 2r) | Unsloth: α ≥ r; sample adapter α=2r | V2d + V3-exec |
| r default | 16 | ecosystem convention; ladder R2; validated as sane by size arithmetic | V1c prior |
| lora_dropout | 0.0 | sample adapter; QLoRA-era convention | V3-exec |
| Targets | all 7 projections | sample shows 2 (toy); QLoRA guidance favors all-linear | V2d + V3-exec contrast |
| Batch (eff.) | 16 (1×16 accum) | convention for long-seq QLoRA | V1c prior |
| Epochs | 1–2 | overfit risk at small data scale; Ch. 15.2 signatures | V1c prior |
| Scheduler / warmup | cosine / 0.03 | convention | V1c prior |
| max_length | 16384 explicit | TRL default is 1024 `keep_start` — must override | V2d |
| QLoRA quant | NF4 + double-quant, bf16 compute | QLoRA paper convention; bnb standard | V2d |
| KV/size arithmetic | see App. C | derived from config.json; cross-checked 2× | V3-exec |
| Sampling recs | temp 1.0, top_p 0.95, top_k 64 | Gemma 4 model card | V2d official |

Every "convention/prior" row is a starting point to beat with your own paired evals, not a tuned constant.

---

## Appendix F — Search log

Protocol: research-toolkit only (`fetch.mjs` / `search.mjs` via blessed browser port 29501; no MCP quota, no built-in WebSearch/WebFetch). Engine used: direct fetches (browser); one discovery search (Tavily free tier, allowance 1500/1500 remaining after). PAYG: **$0.00 spent**. 29 fetches, all 2026-10-01 04:30–04:43 UTC, raw copies in `scratch/lora-primer/pages/`:

| Time (UTC) | File | URL |
|---|---|---|
| 04:30:20 | live-overview.md | kaggle.com/competitions/gemma-4-developer-agent/overview |
| 04:30:34 | live-discussion-recent.md | …/discussion?sort=recently-created |
| 04:31:08 | t-744807.md | …/discussion/744807 |
| 04:31:24 | t-744331.md | …/discussion/744331 |
| 04:31:40 | t-743508.md | …/discussion/743508 |
| 04:32:48 | t-744354.md | …/discussion/744354 |
| 04:33:04 | t-744692.md | …/discussion/744692 |
| 04:33:19 | live-wheelhouse.md | kaggle.com/datasets/metric/gemma-4-developer-agent-wheelhouse |
| 04:34:17 | wh-api-files.json | kaggle.com/api/v1/datasets/list/files/metric/gemma-4-developer-agent-wheelhouse (404 auth-gated) |
| 04:34:53 | t-743063.md | …/discussion/743063 |
| 04:35:09 | t-743213.md | …/discussion/743213 |
| 04:35:25 | live-leaderboard.md | …/leaderboard |
| 04:35:37 | live-modelcard.md | kaggle.com/models/google/gemma-4/other/gemma-4-31b-it-qat-w4a16-ct |
| 04:37:02 | hf-config-31b-it.json | huggingface.co/google/gemma-4-31b-it/raw/main/config.json |
| 04:37:12 | hf-api-31b-it.json | huggingface.co/api/models/google/gemma-4-31b-it |
| 04:38:25–04:39:09 | pypi-{peft,trl,transformers,bitsandbytes,accelerate,vllm}.json | pypi.org/pypi/<pkg>/json |
| 04:39:56 | arxiv-gemma4.md | arxiv.org/abs/2607.02770 |
| 04:40:07 | docs-trl-sft.md | huggingface.co/docs/trl/v1.14.1/sft_trainer |
| 04:40:27 / 04:40:38 | docs-peft-lora{,2}.md | huggingface.co/docs/peft/{en,main}/package_reference/lora (v0.21.1 URL 404s) |
| 04:41:19 | docs-unsloth-gemma4-train.md | unsloth.ai/docs/models/gemma-4/train |
| 04:41:33 | docs-google-tune.md | ai.google.dev/gemma/docs/tune |
| 04:42:45 | docs-vllm-lora.md | docs.vllm.ai/en/latest/features/lora.html (docs.vllm.io DNS-dead) |

Local executions (no network): `count_tasks.py` (129/67/48/13/1 + hints-empty), `inspect_zip.py` (524 files; sample adapter configs + byte sizes), adapter-size arithmetic (App. C).

---

## Appendix G — Verification ledger and traceability

### G.1 Falsifiable predictions vs outcomes (from the scope document)

| # | Prediction | Outcome (2026-10-01 sweep) |
|---|---|---|
| P1 | Competition surface unchanged vs 9/29 snapshot | **CONFIRMED** (rules, timeline, adapter placement, 12 h rule; counters drifted — logged, non-load-bearing) |
| P2 | Zeroing fix claimed ≥v23, current wheelhouse ≥v25 | **CONFIRMED-ADVANCED**: v28 live; independent confirmation still absent; confounds identified (wrong dir; single-matrix randomization) |
| P3 | KV fix deployed by cutoff? | **NOT RESOLVED** — promised; evening wheelhouse update instead correlates with *new* submission errors (744807); adapter submission 56719837 errored |
| P4 | Zero adapter submissions scored to date | **CONFIRMED** (sample ×2; real r=64 980 MB errored 9/30 22:04 UTC) |
| P5 | Version pins resolvable at cutoff | **CONFIRMED**: peft 0.21.1 / trl 1.14.1 / transformers 5.18.0 / bnb 0.50.2 / accelerate 1.15.0 / stock vllm 0.30.0; wheelhouse fork 0.19.1 |
| P6 | Adapter size formula verifiable | **CONFIRMED** — byte-exact on sample; +1.5% on community r=64; README bands ~8–10% low |
| P7 | eval-budget contradiction resolvable | **RESOLVED** — layer confusion: scorer reads 4 keys, no-limit default; 60-min/100-call figures are local-runner defaults |

### G.2 Claim ledger closure (CL-01..CL-15 from scoping)

| # | Claim | Final status |
|---|---|---|
| CL-01 | Single permitted model; bf16 siblings local-only | VERIFIED live (P1) |
| CL-02 | Adapter submissions unproven; 3 defect layers | VERIFIED live (P4) |
| CL-03 | KV fix status | **OPEN**: promised, deployment unconfirmed — carried as H-03 live status |
| CL-04 | Zeroing fix v23+/current v28 | HALF-VERIFIED: version live-confirmed; fix efficacy unconfirmed (H-02) |
| CL-05 | PEFT 0.21.1 trains Gemma4 LoRA | INFERRED (docs-level: task_type + module targeting are generic; no Gemma-4-specific PEFT issue reported in corpus); not executed here — no GPU |
| CL-06 | bf16→QAT transfer | **OPEN by design** — flagged as assumption for paired eval (Ch. 16.4) |
| CL-07 | Thinking patch | "Incoming" at cutoff; no rescore; re-check item |
| CL-08 | Cadence/finals/license | VERIFIED live (P1) |
| CL-09 | Own-trajectory data license-clean | VERIFIED rules §2.6 + staff 742807 (cited with tiers) |
| CL-10 | Unsloth Gemma 4 support | VERIFIED (vendor docs live: day-one, 22 GB 31B QLoRA, gotchas A/B) |
| CL-11 | Architecture dims | VERIFIED from config.json (V3s) |
| CL-12 | TRL SFT defaults | VERIFIED from v1.14.1 docs (assistant_only_loss/completion_only_loss/max_length 1024/LR guidance) |
| CL-13 | vLLM LoRA semantics | VERIFIED from current docs (max_lora_rank sizing warning) + README knobs |
| CL-14 | DoRA/rsLoRA coverage current | VERIFIED from PEFT docs |
| CL-15 | 129-task distribution | EXECUTED recount (67/48/13/1; hints all empty) |

### G.3 Divergence log status

D-01 util 0.80-vs-0.90 (documented, scorer binding) · D-02 compaction interval 5-vs-15 (scorer 5) · D-03 sandbox docker-vs-subprocess (scorer docker) · **D-04 RESOLVED** (layer confusion, P7) · **D-05 RESOLVED** (README bands low, P6) · D-06 wheelhouse-version-vs-vLLM-version ambiguity (resolved by naming: dataset v28 carries vLLM 0.19.1-fork) · D-07 3 GiB identity (exact) · D-08 KV-tokens vs context-length scope (explained, App. C.2) · D-09 58-vs-60 resolvable-count granularity (note) · D-10 counter drift (non-load-bearing) · D-11 sample-with-adapters failure history (folded into H-04) · D-12 thinking_level guidance vs H-05 parser bug (two layers, kept distinct).

### G.4 Known residual uncertainties (the honest list)

1. **H-02 fix efficacy** — claimed, unconfirmed; canary C2 is the test.
2. **H-03 fix deployment** — promised, unconfirmed; canary C1 is the test; 744807 instability clouds the update that might carry it.
3. **CL-06 cross-precision transfer** — assumption until paired-eval'd.
4. **`base_model_name_or_path` validation** — host has never answered; sample-convention is the mitigation.
5. **Scorer's `token_threshold`** (14,336 vs 32,768) — unconfirmed at cutoff (H-14 thread).
6. **Wheelhouse v/t-surnamed wheels** — file listing cut alphabetically at 's'; vLLM-fork pin rests on three corroborating community references (V1c) + the 0.19.1-era behavior evidence, not a read wheel filename.

---

## Appendix H — Glossary

**Adapter** — trained LoRA weights shipped as `adapter_model.safetensors` + config; the only mutable model artifact the rules permit. **ADK** — Google Agent Development Kit; the agent-tree framework the YAML compiles into (`google_adk 1.36.1` in wheelhouse v28). **all seven** — q/k/v/o/gate/up/down projections, the standard full LoRA target set. **α (`lora_alpha`)** — scaling numerator; effective multiplier α/r (α/√r with rsLoRA). **BF16** — brain float 16; the compute/storage dtype of training and adapter tensors here. **BitsAndBytes (`bnb`)** — quantization library behind QLoRA's NF4 base. **Canary submission** — a cheap slot spent to prove/disprove a serving behavior (Ch. 12). **Compaction** — harness's context-summarization mechanism (`token_threshold`, interval 5 scoring); see H-14. **Compressed-tensors (`-ct`)** — the W4A16 packaging format of the competition base model, native to vLLM. **Container A/B** — agent-execution / patch-verification sandboxes. **CV/LB anti-correlation** — local cross-validation disagreeing with the leaderboard via environment differences (H-10); why only paired deltas count. **Dense (vs MoE)** — single active weight path; Gemma 4 31B is dense 30.7B. **discover_adapters()** — harness function building the adapter manifest; feed it the submission root. **DoRA** — weight-decomposed LoRA variant (`use_dora`). **Dropout (`lora_dropout`)** — regularization on the adapter path. **E2B/E4B** — small Gemma 4 siblings; KV-shared layers diverge under `use_cache=False` in training. **Gradient checkpointing** — recompute-don't-store activations; required for 31B QLoRA on 24 GB. **H-01…H-14** — the defect register (Ch. 11.3 / Appendix A C-30). **Hybrid attention / 5:1** — 50 sliding-window layers (1024 window) then-global pattern; 10 full layers; final always global. **KV cache** — per-token key/value memory; 245,760 B/token/GPU under TP4. **KV-shared layers** — E2B/E4B feature (`num_kv_shared_layers` 20/18; 31B has 0). **LiteLLM** — routing layer mapping agent model ids (`openai/<name>`) to the vLLM server. **Loud adapter** — random-A-random-B adapter (`init_lora_weights=False`) whose visible effect proves the serving path (Ch. 10.1). **max_loras / max_lora_rank** — vLLM serving caps: 8 resident adapters, rank ≤ 128. **NF4** — 4-bit NormalFloat, QLoRA's training-time base quantization. **No-op adapter** — provably zero-effect adapter (fresh init or zero-B); the control condition. **p-RoPE** — proportional rotary embeddings (partial rotary 0.25 on global layers, θ=1e6). **PEFT** — parameter-efficient fine-tuning family (`peft 0.21.1`). **QAT** — quantization-aware training; why the W4A16 `-ct` model keeps near-bf16 quality. **QLoRA** — LoRA trained over an NF4-quantized base. **r (rank)** — adapter bottleneck width; ceiling 128 here. **Rank/alpha patterns** — per-module regex overrides in PEFT config. **Rejection sampling** — keep-only-successes trajectory mining. **Resolution Rate** — resolved/hidden-tasks; the score. **rsLoRA** — rank-stabilized scaling variant (`use_rslora`). **SFT / DPO / RLVR** — supervised / preference / verifiable-reward training (Ch. 15/18). **Sliding window** — attention restricted to last 1024 tokens (the 50 non-global layers). **SWE-style** — SWE-bench-shaped repo-repair tasks; this competition's hidden set. **Tied embeddings** — input/output embedding sharing (vocab 262,144 × 5376); why adapters must not ship embedding layers. **TP4** — tensor parallelism across the 4 L4s. **TRL** — HF's training library (`trl 1.14.1`); SFTTrainer/DPOTrainer. **Unified K=V (`attention_k_eq_v`)** — global layers share one tensor for keys and values. **Wheelhouse** — host-maintained pinned-wheel dataset (v28 at sweep) carrying the patched vLLM fork. **YOCO alias** — the `self_decoder.decoder_layers.N` double-registration implicated in H-02.

---

## Appendix I — Audit report

**Auditor's summary: the document was audited after assembly; five corrections were found and applied before release. None changed a conclusion; two changed numbers a reader would budget by.**

### I.1 Passes performed

| Pass | Method | Result |
|---|---|---|
| Version discipline | every version string in the doc grep-checked against the pinned sources (PyPI release metadata, wheelhouse v28 listing, config.json, saved docs pages) | 17 distinct pins verified; no mismatches |
| Arithmetic | every derived number recomputed from config.json dims (adapter sizes, KV bytes/token, GiB identities, calendar math) | **2 defect clusters found** (I.2 #1–2), fixed |
| Badge honesty | census of every code/config block vs. Ch. 0 policy | 0 VALIDATED (no GPU this session — stated in Ch. 0/D/I); 8 SCHEMA-CHECKED sites; 1 ILLUSTRATIVE; 2 missing badges added |
| Table QC (user requirement) | `md_table_qc.py` over all 9 deliverable markdown files | 39 tables, 0 defects, 0 warnings, exit 0 — re-run clean after corrections |
| Seam/structure | TOC anchors, chapter/appendix cross-refs, sidecar paths, internal numbering | consistent; A–J complete with I in place |
| Dates & cutoff discipline | every dated claim traced to a fetched page or snapshot; nothing post-2026-09-30 cited as current | clean; post-cutoff state appears only as "status at the 2026-10-01 sweep" |
| Newcomer red-team | read as the Ch. 0 persona: "can I run this end-to-end without prior PEFT knowledge?" | 1 issue found (I.2 #3), fixed |

### I.2 Corrections applied (the honest list)

1. **Adapter-size table, "q,v only" column was neither q,v nor right** — values (12/25/49/98/197 MB) were q-projection-only and off by one rounding; correct q,v-only values are 22/44/88/177/354 MB (2 × 23,040 × 60 × r bytes). Fixed in Appendix C.1, the Ch. 9.2 ladder (R1 34→22 MB), and the adapter-ladder sidecar README. (The all-seven and attention-only columns were correct throughout; the byte-level validations were against those.)
2. **Training-memory delta for rank understated ~6×** — "r=16→128 adds ~1.7 GB" counted adapter weights only and omitted gradients (~1.7 GB) and AdamW fp32 states (~6.8 GB); all-in ≈ 10 GB, which is why r≤32 is the 1×L4 envelope and r128 training wants 2×L4 or an 8-bit optimizer. Fixed in Ch. 16.1 and Appendix C.3.
3. **Unverified auto-class** — `AutoModelForMultimodalLM` was used in five code blocks without a source behind it; replaced with the class config.json itself declares in `architectures` (`Gemma4ForConditionalGeneration`) [V3-source], with a verify-first comment. (This is the red-team catch: a newcomer would have hit an ImportError or, worse, a silently wrong head.)
4. **Missing badges** — Ch. 10.1 (loud adapter) and Ch. 21.1 (build script) carried code without badges; both now SCHEMA-CHECKED with justification. Ch. 20's decision tree explicitly tagged ILLUSTRATIVE.
5. **Checklist omission** — Ch. 21.2 pre-flight lacked the Save-Version-before-Submit rule (submitting before a successful notebook Save Version fails instantly and burns the slot — host-stated); added.

### I.3 What was *not* fixed, and why

- **README's adapter-size bands (C-25)** stay in Appendix A as a logged divergence rather than being "corrected away" — the README is the host's document; our recomputation is flagged as the budget-by numbers.
- **Community-reported mechanisms (H-02's double-registration, the 245.76 kB/token KV derivation)** are presented with their V1c tier intact even where arithmetic-consistent; consistency is corroboration, not confirmation.
- **`Gemma4ForConditionalGeneration` importability in transformers 5.18.0** is config-declared [V3-source] but not execution-verified (no GPU); the code comments say so.

### I.4 Residual risk statement

The document's load-bearing uncertainties are enumerated, not hidden: H-02/H-03 fix status, cross-precision transfer (CL-06), `base_model_name_or_path` validation, scorer `token_threshold`, and the wheelhouse manifest's alphabetical truncation (Appendix G.4). Everything else traces to a versioned source or a live-fetched page listed in Appendix F. No artifact in this deliverable was executed end-to-end; treat every code block as a verified-by-construction starting point, and run the Ch. 12 ladder before spending slots on any of it.

---

## Appendix J — Re-check list

Weekly, ~10 minutes, in this order — any YES flips the corresponding decision (Ch. 20.2):

| # | Check | Where | Flips what |
|---|---|---|---|
| 1 | Wheelhouse dataset version changed? | kaggle.com/datasets/metric/gemma-4-developer-agent-wheelhouse | Re-run local L1 smoke before trusting local results; version into your run log |
| 2 | Any adapter submission scored *anything* (LB or thread)? | leaderboard + discussion search "adapter" | Kills H-04 prior; upgrade toward GO |
| 3 | KV fix ("size the loras parameters") confirmed deployed? | thread 744331 tail | H-03 gate: run canary C1 |
| 4 | Clean zeroing confirmation (right dir + both matrices randomized)? | threads 743508/743213 | H-02 gate: run canary C2 |
| 5 | Thinking patch deployed / any rescore policy change? | thread 744354 | Thinking-mode tuning decisions; data self-containment rule |
| 6 | 744807-class instability cleared? Post-update submissions scoring? | board recent | Evidentiary value of your own submissions |
| 7 | Compaction `token_threshold` confirmed (14,336 vs 32,768)? | thread 744692 | Long-episode strategy; H-14 exposure |
| 8 | 12 h overrun behavior (error vs score-0)? | 743063 follow-ups | Budget tuning margins |
| 9 | search_similar_code cap + escaping fix landed? | 744577 / 744272 | Tool-policy prompts; data hygiene |
| 10 | Stock vLLM Gemma-4-LoRA status (upstream) | vllm release notes | Whether "wheelhouse-only" still binds local serving |
| 11 | Library pins still current for *training* env? | PyPI | Reproducibility of your own recipes |
| 12 | Countdown math: slots left vs days left vs 2 finals | your log | Panic threshold |

---


---

<!-- ====================================================================== -->
<!-- FILE: 03-lora-competition-surface.md -->
<!-- ====================================================================== -->

# LoRA on Gemma 4 — Competition Surface Card

**Badge: SCHEMA-CHECKED** · verified-as-of **2026-10-01** (live sweep; hard research cutoff 2026-09-30) · companion to `../lora-primer-tutorial-kaggle-gemma4.md` (Ch. 3 = same content; Appendix A = full table)

Keep this open while you work. Anything marked ⚠ changes without notice — the weekly re-check list at the bottom is how you catch it.

## The rules that bind an adapter

| Constraint | Value | Tier |
|---|---|---|
| Base model (all agents) | `gemma-4-31b-it-qat-w4a16-ct` — exactly one per submission | V3s |
| Submission | `submission.zip`, root `agent.yaml`, unpacked **< 3 GiB / 3,221,225,472 B** | V3s |
| Extensions | `.yaml .yml .md .txt .py .json .safetensors` — pickles rejected | V3s |
| Adapter dir | `adapters/<name>/adapter_config.json` + `adapters/<name>/adapter_model.safetensors` | V3s |
| Attach | `adapter: <name>` on any `LlmAgent` (root or sub_agents) → served as `openai/<name>` | V3s+V1c |
| Serving knobs | vLLM `enable_lora=True, max_loras=8, max_lora_rank=128`, TP4, `max_model_len=32768`, util 0.80 (notebook uses 0.90) | V3s |
| Ceilings | `max_output_tokens` ≤32768 (dflt 16384) · `thinking_budget` ≤32768 (dflt 4096) · rank ≤128 · 8 adapters resident | V3s |
| eval_config.yaml | scorer reads exactly 4 keys (`timeout_seconds`, `max_tool_calls`, `max_time_minutes`, `max_turns`) — **default = no limit; set all four** | V2d staff |
| Clock | 12 h all tasks incl. setup; overrun **errors whole run** today; 1 submission/day; 2 finals; deadline **2026-12-02 23:59 UTC** | V2d |
| Data | 129 public (fastapi 67 / rich 48 / requests 13 / httpx 1; hints all empty); ~120 hidden, ~50/50 split | V3-exec + V2d |
| Winner | Apache-2.0 OSS + training code + inference code + env description | V2d |

## Adapter sizing (bf16, all-seven = 125,720 params × r × 60 layers)

r=8 → 121 MB · r=16 → 241 MB · r=32 → 483 MB · r=64 → 966 MB · r=128 → 1.93 GB. Attention-only ≈ 0.35×. (README's bands run ~8–10% low; budget by these. Formula byte-validated twice.)

## ⚠ The defect cluster (status at 2026-10-01 — all four re-check weekly)

| ID | One-liner | Status |
|---|---|---|
| H-01 | Stock vLLM refuses Gemma 4 LoRA → wheelhouse fork required (local serving too) | Solved in wheelhouse (v28) |
| H-02 | Silent zeroing (YOCO double-registration) | Fix claimed v23; **unconfirmed** — loud-adapter canary is the test |
| H-03 | KV collapse 46,048→7,600 tokens with any adapter mounted; >7.6k prompts hang | Fix promised; **deployment unconfirmed** |
| H-04 | **No adapter submission has ever scored** (sample ×2; real r=64/980 MB errored 9/30) | Standing |
| H-05 | Thinking thoughts dropped between tool calls | Patch "incoming"; no rescore |

**Decision rule:** prompts/architecture are bankable now; adapters sit behind the canary ladder (tutorial Ch. 12): C1 no-op adapter → C2 loud adapter → C3 real r=16. Two slots buy the facts.

## Weekly re-check (~10 min)

1. Wheelhouse version (dataset page) — re-run local serving smoke if bumped
2. Any adapter submission scored (LB + "adapter" search)
3. KV-fix confirmation (thread 744331)
4. Zeroing confirmation (743508/743213 — right dir + both matrices randomized)
5. Thinking patch (744354) · 6. Post-update stability (744807) · 7. Compaction threshold (744692) · 8. 12 h-overrun behavior (743063) · 9. Tool-result escaping / search cap (744272/744577) · 10. Slots-left vs days-left math

---


---

<!-- ====================================================================== -->
<!-- FILE: 100_training-recipes-README.md -->
<!-- ====================================================================== -->

# Training Recipes

**Badge: SCHEMA-CHECKED** — APIs/defaults verified against the pinned docs below; **not executed this session** (no GPU). Before running anything, re-check the pinned versions are still current (tutorial Appendix J, item 11).

| Recipe | File | Hardware | Stack | Product |
|---|---|---|---|---|
| R-T1 QLoRA SFT (reference) | `sft-qlora-1xL4.md` | 1×L4 (24 GB) | transformers 5.18.0 / peft 0.21.1 / trl 1.14.1 / bitsandbytes 0.50.2 / accelerate 1.15.0 | rung-r16 adapter (~241 MB) |
| R-T2 bf16 SFT | `sft-bf16-2xL4.md` | 2×L4 (48 GB) sharded | same | same, no quantization |
| R-T3 Unsloth QLoRA | `unsloth-31b-qlora.md` | 1×L4 | Unsloth (own pins) | same, ~1.5× faster / ~60% less VRAM (vendor-measured) |
| R-T4 DPO on SFT | `dpo-on-sft.md` | 1–2×L4 | trl 1.14.1 `DPOTrainer` | sharpened discipline on top of an SFT checkpoint |

**Environment discipline (applies to all):** train in a dedicated env (never the wheelhouse serving env). Serving verification always happens in the *wheelhouse* env on 4×L4 (tutorial Ch. 10.2). Data schema: Ch. 14 of the tutorial; budgets and wall-clock realism: Ch. 7.

Common conversion step after any recipe: edit `base_model_name_or_path` → `google/gemma-4-31b-it-qat-w4a16-ct`, set `layers_to_transform` → null, verify `lora_B` nonzero, run L0 static checks, then the local serving smoke before any submission.

---


---

<!-- ====================================================================== -->
<!-- FILE: 101_unsloth-31b-qlora.md -->
<!-- ====================================================================== -->

# R-T3 — Unsloth QLoRA, Gemma 4 31B, 1×L4

**Badge: SCHEMA-CHECKED** against Unsloth's live Gemma 4 page (fetched 2026-10-01; vendor-reported ~1.5× faster / ~60% less VRAM vs FA2; **31B QLoRA in 22 GB**). Keep Unsloth in its own env — it pins its own `unsloth_zoo` stack.

```python
from unsloth import FastModel
from unsloth.chat_templates import train_on_responses_only   # optional, see below
from trl import SFTConfig, SFTTrainer
from peft import LoraConfig

model, tokenizer = FastModel.from_pretrained(
    "google/gemma-4-31B-it",
    max_seq_length=16384,
    load_in_4bit=True,           # QLoRA
    load_in_8bit=False,
    full_finetuning=False,
)

model = FastModel.get_peft_model(
    model,
    r=16,
    target_modules=["q_proj","k_proj","v_proj","o_proj","gate_proj","up_proj","down_proj"],
    lora_alpha=16,                # Unsloth guidance: alpha >= r
    lora_dropout=0.0,
    bias="none",
    use_gradient_checkpointing="unsloth",   # Unsloth's memory-lean variant
    random_state=3407,
)

cfg = SFTConfig(
    output_dir="out/sft-r16-unsloth",
    per_device_train_batch_size=2, gradient_accumulation_steps=8,
    learning_rate=2e-4, num_train_epochs=2,          # Unsloth convention
    lr_scheduler_type="cosine", warmup_ratio=0.03, max_grad_norm=1.0,
    bf16=True, logging_steps=10, max_length=16384,
    report_to="none", seed=3407,
)
trainer = SFTTrainer(model=model, args=cfg, train_dataset=ds["train"],
                     processing_class=tokenizer)
trainer.train(); model.save_pretrained("out/sft-r16-unsloth")
```

Gemma-4-specific notes from the vendor page (verify on their page before relying — it moves):

- **31B is fine for the `use_cache=False` training path** (`num_kv_shared_layers=0`). E2B/E4B (20/18 shared layers) are the models that diverge under QLoRA defaults there.
- **Inference gotcha:** `num_kv_shared_layers=0` triggers a `layer_types[:-0]` cache crash in some stacks on 31B/26B — relevant if you serve from the Unsloth env; the wheelhouse serving path is unaffected.
- **Template:** Unsloth ships Gemma 4 chat templates; before trusting them, diff one rendered example token-for-token against HF's template (the one dated 2026-07-09 with fixed tool-calling loops).
- Do **not** use MoE-family guidance for this model — 31B is dense; their "MoE QLoRA not recommended" caveat doesn't apply.
- Output is the same PEFT adapter format; identical post-training conversion as R-T1.


---

<!-- ====================================================================== -->
<!-- FILE: 102_sidecars_adapter-ladder-README.md -->
<!-- ====================================================================== -->

# Adapter Ladder — rungs, canaries, bundles

**Badge: SCHEMA-CHECKED** (fields/versions verified; nothing executed this session). Each `rung-*.json` is a complete `adapter_config.json` for `adapters/<name>/`. The `canary-*.json` files are *deliberately special* — read their warnings before using.

## The ladder

| File | r / α | Targets | Size | Use |
|---|---|---|---|---|
| `rung-r8-smoke.json` | 8 / 16 | q,v | ~22 MB | plumbing tests, fastest iterate |
| `rung-r16-baseline.json` | 16 / 16 | all 7 | ~241 MB | **default** — start here, escalate only on measured plateau |
| `rung-r32-capacity.json` | 32 / 32 | all 7 | ~483 MB | data-plentiful capacity bump |
| `rung-r64-heavy.json` | 64 / 64 | all 7 | ~966 MB | only with measured delta over r32 |
| `rung-r128-max.json` | 128 / 128 | all 7 | ~1.93 GB | ceiling; one per submission max |

Sizes: bf16 bytes ≈ 2 × r × 125,720 × 60 (+ ~0.6 kB header); attention-only ≈ 0.35× these. Byte-validated against the sample adapter (exact) and a community r=64 (−1.5%).

## Canaries (test artifacts — NOT for scoring submissions)

| File | What it is | What it proves |
|---|---|---|
| `canary-noop.json` | fresh-init r=8 (B=0 ⇒ mathematically no-op) | Mounting adapters doesn't break serving (H-03/H-04); score should ≈ your no-adapter baseline (canary C1) |
| `canary-loud.json` | `init_lora_weights: false`, α=32 > r=8 (random A **and** B) | Weights genuinely flow through the serving path (H-02); outputs must differ wildly from base at temp 0 — identical outputs = zeroed (canary C2 / local L1) |

⚠️ The loud canary makes the model garbage on purpose. Use it for one local serving session or one sacrificed submission slot, then delete it from the tree. The noop canary is safe to leave mounted.

## Multi-adapter bundles (under 3 GiB)

| Bundle | Contents | Total | Notes |
|---|---|---|---|
| B1 solo | 1 × r16 | 241 MB | the only pattern with any (indirect) scored evidence |
| B2 roles | r16 root + r16 patch-writer + r16 verifier | 723 MB | needs ≥2k role-matched rows per specialist |
| B3 tool-bands | 4 × r8 | 483 MB | cheap; thinnest data per head |
| B4 max | 1 × r128 | 1.93 GB | leaves ~1 GB for everything else |

All adapters in the zip are registered at launch (even unreferenced ones — under the current KV defect, mounting any of them triggers the 7.6k collapse; under the promised fix, bundle Σr is what prices your KV). Ship only adapters you actually attach. Names: `[a-z0-9_-]` only; never `gemma`/`openai`/`base`.

## Version note

Authored against peft 0.21.1 / TRL 1.14.1 conventions and the competition's own sample adapter field set (2026-10-01). PEFT adds fields over time; extra null fields are harmless, *missing* fields fall back to library defaults — regenerate from your training run rather than hand-editing when possible, then apply the two submission edits: `base_model_name_or_path` → `google/gemma-4-31b-it-qat-w4a16-ct`, `layers_to_transform` → null.

---

