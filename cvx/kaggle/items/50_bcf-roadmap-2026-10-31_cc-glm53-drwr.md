# COMBINED MARKDOWN - combine

_Generated 2026-10-31 05:24:04 | 10 files | folder: D:\stuff\docs\taylor_fv\github\rayrite.github.io\cvx\kaggle\items\combine_

## Contents

1. 00-README.md
2. 01-hardware-and-capacity-plan.md
3. 02-windows-11-setup.md
4. 03-zorin-os-18-setup.md
5. 04-local-eval-harness-usage.md
6. 05-trials-metrics-and-analysis.md
7. 06-bcf-improvement-loop.md
8. 07-submission-and-local-scoring.md
9. 08-troubleshooting.md
10. 09-sources.md

---

<!-- ====================================================================== -->
<!-- FILE: 00-README.md -->
<!-- ====================================================================== -->

# RTX 5090 Local Testing Guide — Gemma 4 Developer Agent (BCF)

**2026-10-31 · Commission 3 deliverable · 10 files + portable HTML twins**

A complete operating manual for running the Kaggle **Gemma 4 Developer Agent** competition loop locally on an RTX 5090 workstation — under Windows 11 (WSL2) and Zorin OS 18 — from bare metal to scored submission, with the analysis and fine-tuning loop that turns each run's results into a better BCF brain. Built from the 2026-10-31 intel package (`input/kagglecomp/intel_20261031/`), the official data package and `HARNESS_README.md`, the four 2026-09-29 competition-page captures, and fresh 2026-10-31 fetches (vLLM docs/releases, NVIDIA, Microsoft, Docker, PyTorch indexes, HF checkpoints, Google Gemma docs, community 5090 benchmarks).

## The rig this targets

RTX 5090 (32 GB, sm_120 Blackwell) · ≥250 GB NVMe · dual-boot Windows 11 + Zorin OS 18. The competition scores on 4× L4 with a patched vLLM 0.19.1; every recommendation here is optimized for **parity with that stack** on one card.

## File map (read in this order the first time)

| # | File | What it covers |
|---|---|---|
| 01 | `01-hardware-and-capacity-plan.md` | What fits in 32 GB (serve + LoRA-train matrices), throughput expectations and the #38887 attention trap, KV math, disk budget, time budgeting, hard "won't do" list |
| 02 | `02-windows-11-setup.md` | Windows 11: driver floor, Route A WSL2 (primary, full parity), Route B Docker Desktop, Route C native dev-only; W-1…W-12 pitfalls |
| 03 | `03-zorin-os-18-setup.md` | Zorin 18 (= Ubuntu 24.04 noble): driver, exact-stack install, Docker + container toolkit (hardcode `noble`), NTFS dual-boot sharing; Z-1…Z-8 |
| 04 | `04-local-eval-harness-usage.md` | swegemma operating manual: install dance, layout, full CLI, two-phase lifecycle, model serving, tools/limits, submission contract |
| 05 | `05-trials-metrics-and-analysis.md` | Trial protocol (paired runs, 28-task panel), metric stack, noise anchors, McNemar/Wilson statistics, efficiency metrics, local→LB transfer limits |
| 06 | `06-bcf-improvement-loop.md` | The improvement machine: phase machine P1–P4, per-task ledger, failure taxonomy, A0–A5 ablation ladder, LoRA canary gates, decision rules |
| 07 | `07-submission-and-local-scoring.md` | Competition mechanics, zip contract + packaging asserts, 6-step pre-flight, Kaggle CLI submission flow, what local scoring can/cannot tell you |
| 08 | `08-troubleshooting.md` | Symptom→cause→fix: T-01 agent/serving, T-02 verification, T-03 budget/lifecycle, T-04 rig/host — every entry evidence-anchored |
| 09 | `09-sources.md` | Full source register with confidence tags + the unresolved-claims list |

Each file also ships as a self-contained responsive HTML twin (same name, `.html`) — inline CSS, no external resources, dark/light via `prefers-color-scheme`, works offline from a USB stick.

## The five-minute version

1. **Windows**: install WSL2 + Ubuntu 24.04 (`02` A.1–A.2), Python 3.12.13 via uv, `torch==2.10.0+cu128` **first**, then vLLM 0.19.1 (wheelhouse build preferred) — `02` A.4. **Zorin**: same stack natively, driver 580 first — `03` §1–2.
2. **Smoke**: serve 12B QAT, complete one real request, read `/metrics` — `01` §3.
3. **Accept**: unzip the data package, run the gold control — must hit **≥127/129** with `--skip-agent-patch` before any agent run — `05` §1, `08` T-02.4.
4. **Loop**: 28-task panel runs → ledger → taxonomy → ablation ladder → (format-band LoRA on E4B: 10.88 GB, fits) — `05`+`06`.
5. **Ship**: packaging asserts → 6-step pre-flight → submit once/day, never resubmit on error states — `07`.

## Standing caveats (read once, remember forever)

- The scorer runs a **patched vLLM 0.19.1**; two parser bugs (array-arg hang, backtick drop) are *unfixed on the scorer* — your scaffold must defend (`08` T-01.1/2).
- Local scores **cannot rank candidate finals** (751973); they kill bad bundles and validate mechanisms. The public LB picks finals.
- E-series submission scoring had an unresolved flaky window — board-check before spending a slot (`08` T-04.6).
- Everything dated 2026-10-31 in `09` was fetched then; the competition moves weekly — re-verify staff threads before reuse.


---

<!-- ====================================================================== -->
<!-- FILE: 01-hardware-and-capacity-plan.md -->
<!-- ====================================================================== -->

# 01 · RTX 5090 Hardware and Capacity Plan

*Part of the RTX 5090 Local Testing Guide (2026-10-31). Companion files: `02` Windows 11, `03` Zorin OS 18, `04` harness usage, `05`–`08`, `09` sources.*

The RTX 5090 is a 32 GB Blackwell card (sm_120, 1,792 GB/s GDDR7). This file answers the four capacity questions the rig depends on: **what fits** (serving + training VRAM), **how fast** (throughput and the one Gemma-4-specific trap that swings it 10×), **how much disk**, and **how long** (per-run and per-epoch wall clock). Everything computed here uses verified checkpoint configs (`config.json`) and measured weights; each table names its basis.

## 1. The card, the driver floor, and the one architectural fact

sm_120 requires CUDA **12.8+** binaries end-to-end (driver ≥ 570.65 Windows / ≥ 570.26 Linux; current 621.01 WHQL Windows, 580.196.07 apt on Ubuntu-24.04 repos). All of vLLM 0.19.1 is sm_120-safe **if** you take the cu128-lineage wheels — the torch-first install order in `02`/`03` exists purely to guarantee this.

The architectural fact that matters more than any other number on this page: **Gemma 4 has heterogeneous attention head dimensions** (`head_dim=256` for local sliding-window heads, `global_head_dim=512` for the interleaved full-attention heads). On vLLM 0.19.x this disables FlashAttention and FlashInfer ("head_size not supported") and forces the **TRITON_ATTN** backend — measured at **9.2 tok/s for an unpatched E4B on an RTX 4090** (vs 100+ for comparable models), while a patched `gemma4-cu130` build on a 5090 hit **~130 tok/s single-stream** (vLLM issue #38887, open since 2026-04-03; workarounds: PR #38891 per-layer attention backend, PR #38879 prefill fix, `vllm/vllm-openai:gemma4` docker). The competition's **patched 0.19.1 wheelhouse build** is the closest artifact to whatever the scorer runs — one more reason to prefer it over PyPI 0.19.1 (`04` §1). **Benchmark one task locally and compare against a Kaggle run before trusting any local timing.**

## 2. Serving VRAM fit matrix (competition context = 32,768 tokens)

Computed budgets = verified QAT checkpoint sizes + computed KV-cache (bf16, vLLM hybrid allocator, sliding-window KV bounded by the window) + 1.5–2 GB CUDA-graph/activation overhead. The competition serves at tp=4 across 4× L4 (96 GB total); you have one 32 GB card — the fit matrix is what makes local parity possible at all.

| Variant (QAT w4a16-ct) | Weights | KV @ 32k ctx | Overhead | Total @ 32k | Verdict on one 5090 |
|---|---|---|---|---|---|
| **31B** (competition main) | 23.3 GB | ~3.3 GB (10 FA × 80 KiB/tok + 50 SW window-bounded ~0.8 GB) | ~1.7 GB | **~28.3 GB** | **Fits, tight** *(computed — no public single-5090 boot of this exact config exists yet; make the one-task smoke test your first gate, §1)* — `--gpu-memory-utilization 0.92–0.93`; max ctx ~55–65k; **128k OOMs** (~35 GB needed) |
| **12B** | 10.3 GB | ~1.3 GB | ~1.7 GB | **~13.5 GB** | **Comfortable** — even 262k ctx (~19 GB) fits |
| **E4B** (bonus track) | 11.5 GB | ~0.9 GB | ~1.7 GB | **~13.7 GB** | **Comfortable** — headroom for a LoRA adapter |
| **E2B** (bonus track) | 8.32 GB | ~0.45 GB | ~1.7 GB | **~10 GB** | **Trivial** — half the card free |

Serving command for the tight case (31B): `vllm serve google/gemma-4-31B-it-qat-w4a16-ct --max-model-len 32768 --gpu-memory-utilization 0.93 --max-num-seqs 8`. If OOM: drop to `--max-model-len 16384`, or `--kv-cache-dtype fp8_e4m3` — **never `nvfp4`** (§8). First boot on Blackwell stalls minutes on kernel compilation; validate with a *completed request*, not boot-log lines. (The `vllm download-kernels` pre-fetch step in current docs belongs to newer vLLM lines — don't cargo-cult it into the 0.19.1 parity env; see `02` W-9.)

Google's official memory table (includes ~20% load overhead; BF16 / SFP8 / Q4_0 formats — the competition's w4a16-ct sits between the SFP8 and Q4_0 columns) for the same four variants: **31B** 69.9 / 34.9 / 17.5 GB · **12B** 26.7 / 13.4 / 6.7 · **E4B** 17.9 / 8.9 / 4.5 · **E2B** 11.4 / 5.7 / 2.9. The 32 GB card clears the Q4_0 column for every variant and BF16 only for E2B — which is exactly why the local LoRA pipeline (`06` §5) trains against **unquantized** bases on E4B/E2B but needs rented hardware for anything 12B-and-up in bf16 (§5).

**KV-cache arithmetic** (so you can re-derive at other context lengths — bytes/token = FA layers × global-KV-heads × 512 × 2 (K+V) × 2 (bf16), plus SW layers bounded by the 1024/512-token window):

| Variant | Layers (SW + FA) | KV heads (local / global) | Sliding window | FA bytes/token | max_position |
|---|---|---|---|---|---|
| 31B | 60 (50 + 10) | 16 / 4 | 1024 | 80 KiB | 262,144 |
| 12B | 48 (40 + 8) | 8 / 1 | 1024 | 32 KiB | 262,144 |
| E4B | 42 (35 + 7) | 2 / (assumed 2) | 512 | ~28 KiB | 131,072 |
| E2B | 35 (28 + 7) | 1 / (assumed 1) | 512 | 14 KiB | 131,072 |

E-series global-KV-head counts were absent from the config extraction (assumed = local count; `num_kv_shared_layers` 18/20 may shrink FA KV further) — treat E-series KV as upper bounds. The 31B sliding-window figure (~0.8 GB steady) assumes vLLM's hybrid allocator bounds SW KV at the 1,024-token window as it does for Gemma 3 — confirm against the server's KV-cache-usage gauge on first boot. The harness's own serving recipe pins `max_model_len 32768`; matching it locally keeps context-dependent agent behavior (compaction at 14,336 tokens, `05`) comparable.

## 3. Throughput expectations

Decode ceilings from bandwidth (1,792 GB/s ÷ bytes/token), with community datapoints for calibration:

| Variant (QAT) | Bandwidth ceiling | Realistic single-stream | Datapoints |
|---|---|---|---|
| 31B | ~77 tok/s | **~40–60 tok/s** | club-3090 `@apnar` rows 159.67/215.10 TPS (metric semantics undefined — likely spec-decode or aggregate; treat as upper bounds); 27B-class proxies ~80–150 tok/s on 5090 |
| 12B | ~174 tok/s | **~90–130 tok/s** | best local dev/benchmark target — low-risk before attempting 31B |
| E4B | ~156 tok/s | **~80–130 tok/s** | *only with the attention fix* — 9.2 tok/s unpatched on a 4090 (#38887); patched 5090 build ~130 tok/s single-stream. **No direct E4B-on-5090 measurement exists** — measure yours before porting any time-budget thresholds (`06` Effort Governor) |
| E2B | ~216 tok/s | ~120–180 tok/s | no direct datapoint; scaled from E4B |

Measure it yourself the same way the datapoints were taken — serve, then read the gauges (and confirm with a real completed request):

```bash
curl -s http://localhost:8000/metrics | grep -E 'avg_generation_throughput|avg_prompt_throughput'
```

Why throughput is a *scoring* concern, not a convenience: the 12 h Kaggle budget covers ~120 hidden tasks × per-task wall clock. At 40 tok/s vs 80 tok/s, the same bundle can clear or blow the clock (752017's lesson — a +5% local median became a hidden-set overrun). This is the basis of the timing gate in §7.

## 4. LoRA training capacity on one card

Measured on this exact hardware class (unsloth-proven 5090 stack: torch 2.11.0+cu128, transformers 5.5.0, TRL 1.0.0, peft 0.19.1 — **a separate venv from the harness/serve env**, which pins torch 2.10.0 + vllm 0.19.1; never mix the two):

| Training load | Peak VRAM | Fits 32 GB? | Notes |
|---|---|---|---|
| **E4B QLoRA** (4-bit quantize-on-load of the **unquantized** checkpoint, r=16–128) | **10.88 GB measured** | **Yes, comfortably** | the bonus-track workhorse; leaves room for long sequences (max_length 16384 verified) |
| **E4B bf16 LoRA** (no quantization — pure staff-literal path) | ~22–26 GB *(computed: 17.9 GB bf16 base + adapter + optimizer + activations; no public measurement)* | **Yes, tight** | only if QLoRA quality is suspect; grad checkpointing mandatory |
| **E2B QLoRA** | <10 GB | Yes | fastest iteration loop |
| **12B QLoRA** | ~14–16 GB | Yes | 12B bf16 (~25 GB) is borderline-to-no; QLoRA it instead |
| **31B QLoRA** | **25.47 GB measured** | **Barely** (≤ r=64, short seqs, batch 1) | workable for smoke tests only — production epochs go to rented 2×A100 ($18–77/run band) |
| 31B bf16 / full fine-tune anything | 69.9 GB+ | **No** | not a 5090 workload under any configuration |
| **31B serve + LoRA** (adapter live at inference) | ~28.3 GB base + LoRA paging | **No reliable headroom** | local adapter *serving* is effectively **E-series/12B-only** on this card; test 31B+adapter serving on rented hardware |

**The base-checkpoint rule that kills the naive setup:** PEFT cannot attach to the packaged `-ct` (w4a16) checkpoints at all — firsthand confirmation in thread 750713 (the author had to train on a dequantized bf16 copy). So "QLoRA" here always means: **pull the unquantized variant** (`google/gemma-4-E4B-it`, ~17.9 GB bf16) and let the training stack quantize-on-load (NF4); the resulting bf16 adapter is then served *over* the QAT base (staff guidance — the serve-time dtype mix is asserted legal, never publicly demonstrated; canary it, `06` §5).

Supporting mechanics (full detail in `06` §5): adapter size ≈ **r × 15.086 MB** bf16 for the all-seven-projection configuration (r=128 → ~1.9 GB, r=32 → ~0.5 GB — both clear the 3 GiB submission cap with room for prompts/configs, but pack-test every time, `07` §2; the shipped sample adapter's 217 KB is a **layer-0 stub**, not a size reference — `08` T-04.8); `UNSLOTH_RETURN_LOGITS=0` plugs the training-loop VRAM leak; FlashAttention-2 is unavailable (head_dim 512 > 256 kernel limit) — the stack falls back correctly, don't fight it; `Gemma4ClippableLinear` exists only in the audio/vision towers, so the text-path LoRA targets are plain `nn.Linear` projections and stock PEFT targeting works; E-series `num_kv_shared_layers` means the training path runs cache-off — if you roll your own trainer (not unsloth/TRL), validate the `use_cache=False` forward against the cached one before trusting gradients.

## 5. Disk budget

| Item | Size | Notes |
|---|---|---|
| Data package zip | 21.9 GB | `gemma-4-developer-agent.zip` |
| Data package extracted | ~60 GB | snapshots/ + graphs/ + embeddings/ keyed per `(repo, base_commit)`; keep the zip, delete nothing |
| QAT checkpoints (all 4) | ~53 GB | 23.3 + 10.3 + 11.5 + 8.32 GB, single-file safetensors each |
| Unquantized E4B (LoRA training base) | ~17.9 GB | bf16; E2B ~11.4 GB if you train both |
| Wheelhouse venvs (serve + train) | ~25–30 GB | two venvs; wheels cache included |
| Results, traces, trajectories | grows ~1–3 GB/trial | keep every run's `results/` (the ledger, `06` §2, feeds on it) |
| **Total to provision** | **≥ 250 GB NVMe free** | ext4/WSL-ext4 side, not /mnt (9P) — `02` A.5 |

Dual-boot note (Zorin `03` §5): weights can sit on a shared ntfs3-mounted partition, but extract snapshots and keep HF caches on ext4 — safetensors mmap through the page cache is drastically slower over FUSE and measurably slower over 9P.

## 6. Two venvs, one card — the environment split

| | **Serve/eval venv** (parity) | **Train venv** (unsloth) |
|---|---|---|
| torch | 2.10.0+cu128 (vLLM pin) | 2.11.0+cu128 |
| vLLM | **0.19.1** (wheelhouse patched build preferred) | — (serve-only check after training) |
| transformers | 5.5.3 (vLLM bundle) | 5.5.0 |
| peft / TRL / bitsandbytes | harness pins (peft 0.21.1, trl 1.14.1, bnb 0.50.2) if you serve adapters | peft 0.19.1, TRL 1.0.0 (unsloth stack) |
| Purpose | `swegemma eval` + `vllm serve` — the numbers you trust | produces `.safetensors` adapters; loud-canary gate before any serve (`06` §5) |

The 5090 division of labor that falls out of all of the above (and matches the 2026-10-27 handoff decisions): **E4B/E2B everything local** (serve, eval, QLoRA train — both bonus-track work fits with headroom); **12B local as the cheap dev loop**; **31B serve-only locally** (fits at 32k) with **training epochs rented** on 2×A100 ($18–77/run); RTX PRO 6000 (96 GB) as the single-GPU upgrade path if 31B QLoRA becomes a steady workload.

## 7. Time budgeting

| Activity | Planning number | Basis |
|---|---|---|
| vLLM cold start (first boot) | 5–25 min | Blackwell kernel compile + weight load; official environment itself shows L4 starts of 514–1,677 s; warm the server once per session |
| Single eval task (E4B/12B panel) | p50 × (120 hidden + 15% margin) must clear **12 h** | 752017: +5% local median → hidden-set Notebook Timeout; the gate: **p50 × 125 ≤ 9.5 h** → tighten eval_config budgets if breached |
| Full 129-task local run | ~6–12 h at 8–12 min/task on E4B | one GPU serves one model, so shards (`--shard-index/--num-shards`, `04` §3) buy you resumability across sequential sessions, not parallel speedup |
| Gold control run (`--skip-agent-patch`) | ~30–60 min subprocess / ~90 min docker | run before every trial day (`05` §1) |
| E4B QLoRA epoch (1,000 trajectories) | **~5–8 h** on the 5090 | *derived* (scaled from the 31B/A100 anchor ÷~7.75, not measured on a 5090); seq len dominates — the two-band finding (`06` §5) says format band (~100–500 trajs) is where cheap wins live |
| 31B QLoRA epoch | not local — 9 A100-h/epoch (2×A100 × ~4.5 h) | rent, don't squeeze |

## 8. What this card will not do (do not spend an evening discovering these)

| Blocked | Why | Workaround |
|---|---|---|
| 31B at 128k context | KV alone ~10.7 GB → ~35 GB total | stay at 32k (the competition context anyway); fp8_e4m3 KV if squeezed |
| `--kv-cache-dtype nvfp4` | trtllm-gen FP4 FMHA has **no sm_120 build** — crashes stock vLLM (#43562) | fp8_e4m3 (storage-only; ~equal decode speed) |
| INT8 / W8A8 experiments | "does not build for sm ≥ 10.0" (#27337); Gemma-4 int8-PTH additionally needs overlay #40391 | stay w4a16 (Marlin kernel path on sm_120 — Machete is Hopper-only) |
| NVFP4 weight variants | not competition-faithful; Marlin+NVFP4 incompatibility reports (exit 137 / aten::empty in compiled graph) | QAT w4a16-ct checkpoints only |
| Speculative decoding locally | open 5090 crash class MTP × hybrid-GDN (#50021); FULL_AND_PIECEWISE CUDAGraph incompatibility; QAT drafter pairing rules | **SPEC off** on the local rig unless replicating the competition's exact spec stack |
| Full fine-tuning any variant | 69.9 GB+ bf16 for 31B; E4B full-FT ~136 GB | QLoRA; rent for scale |
| Mixing NVFP4 into the QAT rig | kernel-path conflicts above | one quantization regime per rig |

---

*Sources: HF `google/gemma-4-{31B,12B,E4B,E2B}-it-qat-w4a16-ct` trees + config.json (fetched 2026-10-31); ai.google.dev/gemma/docs/core memory table; vLLM docs installation/gpu (v0.19.1 + stable, 2026-10-31) + issue #38887 + #43562 + #27337; club-3090 FAQ.md + DTYPE_MATRIX.md; unsloth #4985 (5090 stack, VRAM measurements); intel 748287, 752017, 753277; 2026-10-27 bonus-plan handoff. Full list in `09-sources.md`.*


---

<!-- ====================================================================== -->
<!-- FILE: 02-windows-11-setup.md -->
<!-- ====================================================================== -->

# 02 · Windows 11 Setup — RTX 5090 Local Rig

*Part of the RTX 5090 Local Testing Guide (2026-10-31). Companion files: `01` hardware & capacity, `03` Zorin OS 18 (the alternative/same-rig Linux side), `04` harness usage, `05`–`08`, `09` sources.*

The one fact that shapes everything: **vLLM does not support Windows natively** (official docs, verbatim) — the pinned competition engine `vllm==0.19.1` publishes only manylinux wheels (`vllm-0.19.1-cp38-abi3-manylinux_2_31_x86_64.whl`, 433 MB; no Windows wheel exists in any form). So the Windows 11 rig has three routes:

| Route | What | Use for |
|---|---|---|
| **A — WSL2 (primary)** | Ubuntu 24.04 under WSL2, GPU paravirtualization, venv inside ext4 | **Full parity rig**: vLLM 0.19.1 + swegemma + subprocess sandbox |
| **B — Docker Desktop** | WSL2-backend Docker, GPU passthrough built in | docker-backend sandbox (Phase-2 parity), container workflows |
| **C — Native Windows (dev-only)** | torch cu128 + transformers (dequantize-on-load), or llama.cpp GGUF | prompt/scaffold iteration, tokenizer checks — **never scoring-parity** |

## 0. Driver floor (do this first, on Windows)

RTX 5090 is Blackwell **sm_120**, which requires CUDA **12.8+** binaries end-to-end (CUDA 12.8 release notes: “adds compiler support for … SM_120”; cuBLAS 12.8 adds Blackwell). Driver floors: **Windows ≥ 570.65** for CUDA 12.8; current Game Ready **621.01 WHQL (2026-10-21)** comfortably clears it. The classic 5090 failure (“RuntimeError: CUDA error: no kernel image is available for execution on the device”) means a pre-Blackwell binary — historically pre-#19794 vLLM builds or stale cu124/cu126 torch; anything from mid-2025 onward, including all of 0.19.1, is sm_120-safe *if you take the cu128-lineage wheels* (Route A step 4 pins this).

```powershell
# PowerShell (admin)
nvidia-smi --query-gpu=name,driver_version,compute_cap --format=csv
# expect: NVIDIA GeForce RTX 5090 | 621.01 (or newer) | 12.0
```

## Route A · WSL2 — the parity rig

### A.1 Install WSL2 + Ubuntu 24.04, update the kernel

```powershell
wsl --install -d Ubuntu-24.04
wsl --update          # the known cure for "nvidia-smi works but CUDA unavailable" on 50-series
wsl --version
wsl --shutdown        # after driver installs and any .wslconfig edit (8-second rule)
```

### A.2 `.wslconfig` — give the VM room for weight staging

WSL2 defaults to **50% of system RAM** — too small for vLLM’s host-side weight staging on load (OOM during model load even with free VRAM). Write `C:\Users\<you>\.wslconfig`:

```ini
[wsl2]
memory=32GB          # ~50-60% of physical RAM; raise on 64 GB+ machines
swap=16GB
processors=16
localhostForwarding=true
[experimental]
autoMemoryReclaim=dropCache
sparseVhd=true
```

then `wsl --shutdown` and re-enter. Defaults you are overriding: memory 50% of RAM, swap 25%, processors = all logical, `gpuSupport=true` (leave on).

### A.3 Inside WSL: CUDA userland — toolkit only, NEVER a driver

The NVIDIA WSL guide is explicit: the **Windows driver is the only driver** (“Do not install any Linux display driver in WSL” — it is stubbed inside WSL2 as `libcuda.so`). Install **only** `cuda-toolkit-12-x`-style metapackages — never `cuda`, `cuda-12-x`, or `cuda-drivers` (pulling driver packages breaks GPU-PV):

```bash
wget https://developer.download.nvidia.com/compute/cuda/repos/wsl-ubuntu/ubuntu2404/x86_64/cuda-keyring_1.1-1_all.deb
sudo dpkg -i cuda-keyring_1.1-1_all.deb && sudo apt-get update
sudo apt-get -y install cuda-toolkit-12-9        # optional: vLLM wheels bundle their own CUDA runtime
/usr/lib/wsl/lib/nvidia-smi                       # WSL nvidia-smi lives HERE (limited feature set)
```

The toolkit step is optional for the pip rig (wheels ship their own runtime) — include it only if you will compile anything.

### A.4 Python 3.12.13 exact pin + the competition engine

The verified competition combo is **Wheelhouse V31 + Python 3.12.13** (748287). Ubuntu 24.04’s system python is 3.12 but not the exact patch — pin with uv:

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh && source $HOME/.local/bin/env
uv python install 3.12.13
uv venv --python 3.12.13 $HOME/.venvs/bcf && source $HOME/.venvs/bcf/bin/activate
# torch FIRST from the cu128 index (sm_120 guarantee), then vLLM:
uv pip install torch==2.10.0+cu128 --index-url https://download.pytorch.org/whl/cu128
uv pip install "vllm==0.19.1"
python -c "import torch; print(torch.__version__, torch.cuda.is_available(), torch.cuda.get_device_capability())"
# expect: 2.10.0+cu128 True (12, 0)
```

Order matters: vLLM 0.19.1 pins `torch==2.10.0` — if you let it resolve torch from PyPI, you may get a variant without sm_120 kernels. Pre-installing from the cu128 index guarantees Blackwell. vLLM also pulls `torchaudio==2.10.0`, `torchvision==0.25.0`, `flashinfer-python==0.6.6` + `flashinfer-cubin==0.6.6` — let it.

**Kaggle-parity variant:** if you have the wheelhouse downloaded (`kaggle datasets download -d metric/gemma-4-developer-agent-wheelhouse`), install the 41 wheels **from it** (with the cutlass-skip + `cu128→+cu128` rename dance, `04` §1) instead of PyPI 0.19.1 — the wheelhouse vLLM is the *patched* build the scorer runs (parser line-level differences matter, `08` T-01.1). The delivery format of Kaggle’s patch (wheel vs git ref) is unpublished — the wheelhouse wheel is the closest artifact.

### A.5 Weights and caches — ext4, never /mnt

Microsoft’s own guidance: keep files in the WSL filesystem for Linux-command-line work; `/mnt/c`… is 9P/DrvFs and slow. Practically:

```bash
export HF_HOME=$HOME/hf        # weights + cache on ext4 inside the vhdx
vllm serve google/gemma-4-12B-it-qat-w4a16-ct --max-model-len 8192   # smoke test
# second terminal:
curl http://localhost:8000/v1/chat/completions -H 'Content-Type: application/json' \
  -d '{"model":"google/gemma-4-12B-it-qat-w4a16-ct","messages":[{"role":"user","content":"say ok"}]}'
```

The QAT checkpoints are on HF exactly as the competition names them (`google/gemma-4-E4B-it-qat-w4a16-ct` etc., Apache-2.0, **ungated** — verified on the repo trees 2026-10-31; a token is optional, only for rate limits). Note the case: the harness alias is lowercase (`gemma-4-31b-it-…`) while the HF repo is `31B` — vLLM/HF resolution is case-tolerant, but keep the alias exactly as the registry spells it in `agent.yaml` (`07` §3.6). **Do not pass `--quantization`** — it auto-detects from `config.json`. Data package + snapshots can live on `/mnt/d` (read-once, streamed extraction) but extract **into** ext4 before runs.

### A.6 swegemma + the data package

```bash
# inside WSL, in the venv, from the wheelhouse (see 04 §1) or PyPI when published:
uv pip install <wheelhouse wheels>            # includes swegemma/adk-* + patched vllm
# data package (21.9 GB zip) — extract once to ext4:
mkdir -p ~/rig && cd ~/rig
unzip /mnt/d/.../gemma-4-developer-agent.zip   # tasks.jsonl + snapshots/ + graphs/ + embeddings/ + wheels/ + docker/ + sandbox/
# acceptance test — gold patches must PASS ~127/129 in your sandbox (05 §1):
swegemma eval --tasks tasks.jsonl --snapshots-dir snapshots \
  --submission-dir sample_submission --results-dir results/gold_control \
  --sandbox subprocess --skip-agent-patch --max-time-minutes 10
```

The **subprocess sandbox runs fine under WSL2** (POSIX path rewriting works there) — Docker is optional on Windows (Route B only if you want the docker backend).

## Route B · Docker Desktop (docker-backend sandbox)

GPU passthrough for Linux containers works **only** with the WSL2 backend. Install, enable “Use the WSL 2 based engine”, then verify with Docker’s own documented command:

```powershell
winget install Docker.DockerDesktop
# Docker Desktop → Settings → General → 'Use the WSL 2 based engine' ON; then:
docker run --rm -it --gpus=all nvcr.io/nvidia/k8s/cuda-sample:nbody nbody -gpu -benchmark
docker run --rm --gpus all ubuntu nvidia-smi
```

Do **not** manually install nvidia-container-toolkit when using Docker Desktop (built in). Alternative: docker-ce inside the WSL distro + NVIDIA Container Toolkit (1.20.1-1 current; `nvidia-ctk runtime configure --runtime=docker`) — mutually exclusive with Docker Desktop; pick one. Needs `[boot] systemd=true` in `/etc/wsl.conf` (Ubuntu 24.04 default) else `sudo service docker start`.

Then build the harness images (`04` §7): `docker build -f docker/Dockerfile.sandbox -t swebench-sandbox:latest .` (context must contain `docker/` + `wheels/` for Dockerfile.public).

## Route C · Native Windows (dev-only, never for scoring)

For prompt/scaffold iteration without leaving PowerShell — **not** scoring-parity (no vLLM; dequantize-on-load is slow; tokenizer/stop behavior differs):

```powershell
py -3.12 -m venv $env:USERPROFILE\.venvs\bcf-win
. $env:USERPROFILE\.venvs\bcf-win\Scripts\Activate.ps1
pip install torch --index-url https://download.pytorch.org/whl/cu128    # 2.11.0+cu128 win_amd64 cp312 verified on index
pip install transformers accelerate compressed-tensors
python -c "import torch; print(torch.__version__, torch.cuda.is_available(), torch.cuda.get_device_name(0))"
```

Transformers’ integrated compressed-tensors quantizer loads the `-ct` checkpoints and **dequantizes on load** when no int4 kernel is available — correct, slow. Verify one forward pass before building on it. Fast alternative for loop-logic dev: `llama-server -hf unsloth/gemma-4-12B-it-qat-GGUF:Q4_K_M -ngl 99` (current llama.cpp build required — Gemma 4 GGUF format churned through mid-2026). Re-validate anything you tuned here under Route-A vLLM before trusting it.

## Windows-specific pitfalls (each one has bitten someone)

| # | Pitfall | Rule |
|---|---|---|
| W-1 | “Native Windows vLLM” guides | Do not exist legitimately — 0.19.1 has zero Windows wheels; budget WSL2 from day one |
| W-2 | Installing an NVIDIA driver inside WSL | Never — Windows driver is stubbed in as `libcuda.so` |
| W-3 | `apt install cuda` / `cuda-drivers` in WSL | Only `cuda-toolkit-12-x` — driver metapackages break GPU-PV |
| W-4 | 50-series “CUDA unavailable” though nvidia-smi works | Stale WSL kernel → `wsl --update` then `wsl --shutdown` |
| W-5 | nvidia-smi missing in WSL | Lives at `/usr/lib/wsl/lib/nvidia-smi`; limited feature set is normal |
| W-6 | `.wslconfig` edits “not taking” | `wsl --shutdown` (full VM stop, ~8 s) required |
| W-7 | OOM during weight load with free VRAM | `.wslconfig` `memory=` too small — raise and restart |
| W-8 | Slow loads | Caches/checkpoints on `/mnt/*` (9P) — move to ext4 `~/hf` |
| W-9 | `vllm download-kernels` in docs | Current-vLLM step (0.23+ era) — do **not** cargo-cult into the 0.19.1 parity env |
| W-10 | Speculative decoding with QAT targets | Draft model must be a **same-precision QAT** checkpoint (E4B card note) — an E2B bf16 draft won’t pair |
| W-11 | Python drift | Distro python ≠ 3.12.13 — pin exactly with `uv python install 3.12.13` |
| W-12 | Kaggle L4 (sm_89) vs your sm_120 | A stack that runs on Kaggle can still hit kernel-selection surprises on Blackwell — smoke-test the pinned engine on the 5090 **before** building on it |

**Minimal cost path:** Route A alone covers the whole loop — vLLM serve (parity engine) + `swegemma eval --sandbox subprocess` + wheelhouse wheels. Add Route B only when you want docker-backend Phase-2 parity; Route C is a convenience.

---

*Sources: docs.vllm.ai installation page (2026-10-08); pypi.org/project/vllm/0.19.1 + release tag v0.19.1 (2026-04-18); vLLM issue #18995 / PR #19794 (2025-06); NVIDIA CUDA-on-WSL user guide (fetched 2026-10-31); CUDA 12.8 release notes; Microsoft Learn `.wslconfig` (2026-10-16) + WSL filesystems (2026-06-02); docs.docker.com/desktop/features/gpu; pytorch cu128/cu130 wheel indexes (fetched 2026-10-31); HF google/gemma-4-E4B-it-qat-w4a16-ct card; intel 748287. Full list in `09-sources.md`.*


---

<!-- ====================================================================== -->
<!-- FILE: 03-zorin-os-18-setup.md -->
<!-- ====================================================================== -->

# 03 · Zorin OS 18 Setup — RTX 5090 Native-Linux Rig

*Part of the RTX 5090 Local Testing Guide (2026-10-31). Companion files: `01` hardware & capacity, `02` Windows 11 (the same rig’s other boot), `04` harness usage, `05`–`08`, `09` sources.*

Zorin OS 18 is an **Ubuntu 24.04 LTS** base (glibc 2.39) — everything Ubuntu-noble applies, with two Zorin-specific divergences called out below (Docker repo dist string; kernel-headers lag on the 6.17 kernel). Native Linux is the cleanest path for this rig: the subprocess sandbox, the docker backend, and vLLM all run first-class.

## 0. What makes this easy

- `vllm-0.19.1-cp38-abi3-manylinux_2_31_x86_64.whl` (433,132,101 B, sha256 `c8dde3c9af20f00a644e64a50ebe43948f2921bab3ffd5407d634c15836cb181`) installs on any CPython ≥3.8 with glibc ≥2.31 — Zorin 18’s glibc 2.39 qualifies.
- Ubuntu 24.04’s **system python3 is 3.12** — no deadsnakes needed; pin the exact competition patch (3.12.13) with uv.
- vLLM 0.19.1 dependency set (pinned): `torch==2.10.0`, `torchaudio==2.10.0`, `torchvision==0.25.0`, `flashinfer-python==0.6.6`, `flashinfer-cubin==0.6.6`; `requires_python <3.14,>=3.10`.

## 1. Driver (do this first)

sm_120 needs the Blackwell-capable driver line: **570+** minimum (570.26 Linux floor for CUDA 12.8), branch **580 recommended** — the newest branch apt-installable from NVIDIA’s own ubuntu2404 repo (`nvidia-driver-580` = 580.196.07 as of 2026-10-31; the 595.99.02 “latest production” and 615.x new-feature branches exist only as `.run` installers, which bypass apt/dkms management — avoid). Build prerequisites first:

```bash
sudo apt-get update && sudo apt-get install -y linux-headers-$(uname -r) build-essential dkms pciutils
```

Path A — Ubuntu-signed driver (secure-boot friendly, no MOK enrollment):

```bash
sudo ubuntu-drivers update && ubuntu-drivers devices
sudo ubuntu-drivers install --gpgpu nvidia:580
```

Path B — NVIDIA’s own CUDA repo (guarantees the version regardless of archive mirrors):

```bash
wget https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2404/x86_64/cuda-keyring_1.1-1_all.deb
sudo dpkg -i cuda-keyring_1.1-1_all.deb && sudo apt-get update
sudo apt-get install -y nvidia-driver-580
```

Reboot, then verify: `nvidia-smi` → RTX 5090, driver 580.x, CUDA 12.8+.

**CUDA toolkit: not needed** for the pip rig — the vLLM wheel ships precompiled kernels and torch cu128 wheels bundle their own CUDA runtime; `cuda-toolkit-13-4` (repo max 13.4.3) only if you compile from source.

## 2. Python env + the exact competition stack

```bash
sudo apt-get install -y python3.12 python3.12-venv python3.12-dev
python3.12 -m venv ~/rig-venv && source ~/rig-venv/bin/activate && pip install --upgrade pip
curl -LsSf https://astral.sh/uv/install.sh | sh
# exact competition pin (748287: verified combo = Wheelhouse V31 + Python 3.12.13):
uv python install 3.12.13 && uv venv --python 3.12.13 ~/rig-venv && source ~/rig-venv/bin/activate
# ORDER MATTERS: torch from the cu128 index FIRST (sm_120 guarantee), then vLLM:
pip install torch==2.10.0+cu128 --index-url https://download.pytorch.org/whl/cu128
pip install vllm==0.19.1
python -c "import torch, vllm; print(torch.__version__, vllm.__version__, torch.cuda.get_device_capability())"
# expect: 2.10.0+cu128 0.19.1 (12, 0)
```

Why the order: vLLM pins `torch==2.10.0` but resolving it from PyPI may fetch a variant without sm_120 kernels; pre-installing `2.10.0+cu128` from the cu128 index guarantees Blackwell. **Kaggle parity:** prefer the wheelhouse’s 41 wheels (incl. the *patched* vLLM 0.19.1) over PyPI when you have them — `04` §1 for the cutlass-skip + `cu128→+cu128` install dance.

Weights: `export HF_HOME=$HOME/hf`, HF token, then the smoke test:

```bash
vllm serve google/gemma-4-12B-it-qat-w4a16-ct --max-model-len 8192 &
curl http://localhost:8000/v1/chat/completions -H 'Content-Type: application/json' \
  -d '{"model":"google/gemma-4-12B-it-qat-w4a16-ct","messages":[{"role":"user","content":"say ok"}]}'
```

(No `--quantization` flag — compressed-tensors auto-detects.)

## 3. Docker (for the docker-backend sandbox)

**Zorin divergence #1:** docker.com’s documented command interpolates `$(. /etc/os-release && echo $VERSION_ID)` — Zorin’s `VERSION_ID` is **18**, and `dists/18/` does not exist. **Hardcode `noble`**:

```bash
sudo apt-get update && sudo apt-get install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=amd64 signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu noble stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update && sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker $USER   # log out/in
```

NVIDIA Container Toolkit (dist-agnostic repo — no Zorin substitution):

```bash
curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey | sudo gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg
curl -s -L https://nvidia.github.io/libnvidia-container/stable/deb/nvidia-container-toolkit.list | \
  sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' | \
  sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list
sudo apt-get update && sudo apt-get install -y nvidia-container-toolkit
sudo nvidia-ctk runtime configure --runtime=docker && sudo systemctl restart docker
docker run --rm --runtime=nvidia --gpus all ubuntu nvidia-smi   # expect the 5090
```

Then build the harness images (`04` §7) and run `swegemma eval --sandbox docker` for full Phase-2 parity, or stay on `--sandbox subprocess` (no Docker at all) — both are first-class on this OS.

## 4. swegemma + data package + acceptance test

```bash
source ~/rig-venv/bin/activate
# swegemma/adk-* from the wheelhouse (04 §1) or PyPI when published:
pip install --no-deps --force-reinstall /path/to/wheelhouse/*.whl   # (cutlass-skip + rename dance per 04 §1)
mkdir -p ~/rig && cd ~/rig && unzip /path/to/gemma-4-developer-agent.zip
# acceptance: gold patches pass ~127/129 in YOUR sandbox before any agent run (05 §1)
swegemma eval --tasks tasks.jsonl --snapshots-dir snapshots \
  --submission-dir sample_submission --results-dir results/gold_control \
  --sandbox subprocess --skip-agent-patch --max-time-minutes 10
```

Note the sandbox Python divergence is by design: subprocess path = your 3.12.13; docker image = 3.13 — the scorer’s side is unknown, so parity-seekers run both (`08` T-04.4).

## 5. Dual-boot data sharing with Windows (NTFS)

If the 21.9 GB data package / weights live on an NTFS partition shared with the Windows boot:

- **Disable Windows fast startup** (`powercfg /h off`) or Linux mounts the volume read-only after each Windows shutdown (dirty bit); `chkdsk /f` if already dirty.
- Mount with the **in-kernel `ntfs3`** driver — never ntfs-3g/FUSE — safetensors `mmap` and sequential loads work through the normal page-cache path on in-kernel filesystems, and are drastically slower over FUSE:

```bash
lsblk -f   # get the UUID
echo 'UUID=YOUR-NTFS-UUID /mnt/models ntfs3 defaults,big_writes,uid=1000,gid=1000,umask=022,nofail 0 0' | sudo tee -a /etc/fstab
sudo mount -a
```

Best performance remains **ext4 model dirs** + a smaller ntfs3 exchange partition; extract snapshots to ext4 before eval runs.

## 6. Zorin/Linux pitfalls

| # | Pitfall | Rule |
|---|---|---|
| Z-1 | torch resolved from PyPI | Pre-install `torch==2.10.0+cu128` from the cu128 index **before** `vllm==0.19.1` |
| Z-2 | “Fixing” install errors by changing Python minor | Wheel is cp38-abi3, `>=3.10,<3.14` — 3.12 **and** 3.13 both work; 3.14 doesn’t |
| Z-3 | docker repo with interpolated VERSION_ID | Hardcode `noble` (Zorin VERSION_ID=18 404s) |
| Z-4 | `.run` NVIDIA installer | Secure boot breaks module load without MOK enrollment; apt paths ship signed modules; never mix `.run` + apt/dkms |
| Z-5 | Kernel update → nvidia-smi fails at next boot | DKMS rebuild needs `linux-headers-$(uname -r)` for the exact new kernel — install headers with every kernel update (Zorin 18.1 runs 6.17; **Zorin divergence #2**: header availability for each 6.17 revision should be checked on-metal) |
| Z-6 | vLLM version drift | Pin `vllm==0.19.1` exactly (or the wheelhouse build) — scheduling behavior differs across versions vs the competition image |
| Z-7 | Flatpak NVIDIA runtime noise | `org.freedesktop.Platform.GL.nvidia` is Flatpak-managed, auto-matches the driver, irrelevant to headless vLLM — don’t apt-remove it |
| Z-8 | Wayland/X11 worries | Irrelevant for headless serving — only kernel driver + CUDA userland matter |

**Minimal cost path:** driver → venv (3.12.13 + torch cu128 + vllm 0.19.1) → wheelhouse wheels → unzip data → subprocess-mode `swegemma eval`. Docker only if you want container parity.

---

*Sources: pypi.org/pypi/vllm/0.19.1/json (wheel sha256 + pins, fetched 2026-10-31); download.pytorch.org/whl/cu128/torch/ (torch-2.10.0+cu128 cp312 manylinux verified); download.nvidia.com XFree86 latest.txt (595.99.02, 2026-10-21) + CUDA ubuntu2404 Packages.gz (driver 580.196.07, toolkit ≤13.4.3); docs.docker.com/engine/install/ubuntu; NVIDIA container-toolkit install guide; docs.kernel.org/filesystems/ntfs3.html; Zorin blog (18.0 2025-10-14, 18.1 2026-04-15 kernel 6.17); intel 748287. Full list in `09-sources.md`.*


---

<!-- ====================================================================== -->
<!-- FILE: 04-local-eval-harness-usage.md -->
<!-- ====================================================================== -->

# 04 · Local Evaluation Harness Usage — swegemma on Your Own Machine

*Part of the RTX 5090 Local Testing Guide (2026-10-31). Companion files: `01` hardware plan, `02` Windows 11 setup, `03` Zorin OS 18 setup, `05` trials & metrics, `06` BCF improvement loop, `07` submission & local scoring, `08` troubleshooting, `09` sources.*

This file is the operating manual for the local evaluation rig: what the harness expects on disk, every CLI flag and budget knob, the two-phase verification lifecycle, the model-serving stack, and the artifacts each run leaves behind. Everything here is verified against `HARNESS_README.md` (data package, 2026-09-25 revision), the shipped `sample_submission/`, the zip's central directory, and the official Getting Started notebook — except where explicitly marked **INFERRED** or **OPEN**.

---

## 1. The three libraries and where they come from

| Library | Role | What you actually touch |
|---|---|---|
| `adk-submission` | Declarative submission compiler: turns your `agent.yaml` tree into live Google ADK `BaseAgent` objects without ever executing your Python (`importlib` is never used). Also manages the `VllmServer` / `TransformersServer` processes. | You never import it directly; the harness does. |
| `adk-eval-core` | Sandboxes (docker / subprocess), budgets, tracing (ATIF v1.7 session traces). | Budget env vars, sandbox choice. |
| `swegemma` | The SWE task lifecycle, the 9 agent tools, scoring, and the `swegemma eval` CLI. | This is the CLI you run. |

**Installation source (OPEN item, resolved pragmatically):** no PyPI name, git URL, or version pin is documented anywhere for these three libraries. The only authoritative source is the Kaggle dataset **“Gemma 4 Developer Agent Wheelhouse”** (`metric/gemma-4-developer-agent-wheelhouse`) — 41 wheels including the pinned, patched **vLLM 0.19.1** (`vllm-0.19.1-cp38-abi3-manylinux_2_31_x86_64.whl`). Download it once via the Kaggle CLI (see `02`/`03` for per-OS commands) and install from there. The competition data package’s own `wheels/` directory (124 wheels) is a **different set** — those are task *test* dependencies (pytest plugins, pydantic, starlette, build backends), not the serving stack.

Wheelhouse install order that the official notebook uses (reproduce it exactly; see §7 below for why the rename dance matters):

```bash
export LITELLM_LOCAL_MODEL_COST_MAP=True TRANSFORMERS_NO_TF=1 \
       VLLM_WORKER_MULTIPROC_METHOD=spawn VLLM_MEMORY_PROFILER_ESTIMATE_CUDAGRAPHS=1 \
       VLLM_ENGINE_READY_TIMEOUT_S=1200 VLLM_NO_USAGE_STATS=1 \
       OTEL_SDK_DISABLED=true PYTORCH_CUDA_ALLOC_CONF=expandable_segments:True
# delete stale cutlass .pth loaders (they point at wheelhouse-internal paths)
rm -f /usr/local/lib/python*/{dist,site}-packages/*cutlass*.pth
# link wheels in, skipping cutlass and renaming cu128 -> +cu128 (local index names)
mkdir -p /tmp/wheelhouse
for w in /path/to/wheelhouse/*.whl; do
  case "$w" in *cutlass*) continue;; esac
  ln -sf "$w" "/tmp/wheelhouse/$(basename "${w//cu128/+cu128}")"
done
pip install -q --no-deps --force-reinstall /tmp/wheelhouse/*.whl
python -c "import importlib; importlib.invalidate_caches()"
```

**Python version:** the Kaggle notebook host runs **3.12** and the community-verified combo is **Wheelhouse V31 + Python 3.12.13**; the Docker sandbox image is `python:3.13-slim`; the wheelhouse ships both cp312 and cp313 wheels. The 3.13.15 wheelhouse pin (2026-10-03) broke preflight on nine cp312 wheels — **pin 3.12.13 for the host harness** (see `08` troubleshooting T-07).

## 2. Required on-disk layout

A local run needs `tasks.jsonl` plus four directories **side by side**:

```text
workdir/
├── tasks.jsonl          # 129 lines, ~2 MB — the task definitions
├── snapshots/           # 129 .tgz files, <repo-short>_<PR#>.tgz (211–255 MB each, ~28 GB total)
├── graphs/              # 127 files, <repo-short>_<40-hex-base_commit>.json (3.7–5.2 MB each)
├── embeddings/          # 127 matching .npz files (0.9–5.9 MB each)
├── wheels/              # 124 .whl — task TEST dependencies (pytest-deps, pydantic, starlette, …)
├── docker/              # Dockerfile.sandbox, Dockerfile.public, imp.py, telnetlib.py
├── sandbox/             # setup.py (the in-sandbox bootstrap)
└── sample_submission/   # your agent directory (any name; this one ships with the package)
```

Key structural facts (verified from the zip central directory and a full parse of `tasks.jsonl`):

- **graphs and embeddings are keyed per `(repo, base_commit)`, not per repo**: 127 pairs serve 129 tasks (two tasks share a commit). If you subset or regenerate `tasks.jsonl`, every task must keep its matching `<repo-short>_<sha40>.json` + `.npz` pair — otherwise the 3 code-intelligence tools are **silently dropped** from the agent’s prompt (the section just doesn’t render).
- The 129 public tasks span exactly **4 repos**: fastapi/fastapi 67, Textualize/rich 48, psf/requests 13, encode/httpx 1. `hints_text` is **empty on all 129 records** (so the `{hints}` template var never renders publicly).
- Each `tasks.jsonl` record has exactly 8 keys: `instance_id`, `repo`, `base_commit` (40-hex), `patch` (gold unified diff), `test_patch` (unified diff under `tests/`), `problem_statement`, `hints_text`, `created_at`.

**Disk budget:** the zip is 21.9 GB compressed; a full extracted working tree is **~60+ GB**. You can stream individual members out of the zip without extracting (works in git-bash and Linux identically):

```bash
unzip -p gemma-4-developer-agent.zip sample_submission/agent.yaml   # any member, byte-faithful
unzip -p gemma-4-developer-agent.zip tasks.jsonl | head -c 3000     # stream-inspect
```

## 3. The `swegemma eval` CLI — every flag

Canonical invocation (README §9.1):

```bash
swegemma eval --tasks tasks.jsonl --snapshots-dir snapshots \
  --submission-dir sample_submission --results-dir results/run_01 \
  --sandbox docker --max-tool-calls 50 --max-time-minutes 30 \
  --concurrency 2 --display auto
```

| Flag | Values / default | Meaning |
|---|---|---|
| `--tasks` | path | The tasks.jsonl to run |
| `--snapshots-dir` | path | Snapshot .tgz directory |
| `--submission-dir` | path | Your agent directory (the thing that becomes submission.zip) |
| `--results-dir` | path | Where run artifacts land (§6) |
| `--sandbox` | `docker` (default) \| `subprocess` | docker = containerized, network-none; subprocess = no Docker daemon needed, **POSIX-only** (it rewrites `/workspace`, `/tmp`, `/wheels`, `/usr/local/bin` and uses process groups — native Windows cannot run it; use WSL2/Zorin/Docker Desktop) |
| `--max-tool-calls` | int | Per-task Stage-1 tool-call budget |
| `--max-time-minutes` | float | Per-task session wall-clock |
| `--concurrency` | int | Parallel tasks; `>= 2` auto-activates the multi-slot dashboard UI |
| `--task-id` / `--task-ids` | instance_id(s) | Run specific tasks (fast debug loop) |
| `--shard-index k --num-shards M` | ints | Deterministic shard: selects tasks where `task_idx % M == k` — the intended parallelization across machines/runs |
| `--models-yaml` | path | Custom model alias → endpoint/pricing map (**OPEN:** schema undocumented; see §5) |
| `--skip-agent-patch` | flag | Skip Phase 1 entirely (`agent_patch = ""`) — verifies that FAIL_TO_PASS tests genuinely fail pre-patch. **Run this once after setup** as your rig’s acceptance test |
| `--display` | `auto` | Dashboard rendering mode |

**Budget env overrides** (checked before eval_config.yaml): `SWE_MAX_TIME_MINUTES`, `SWE_MAX_TOOL_CALLS`, `SWE_MAX_TURNS` (alias `SWE_MAX_LOOP_ITERATIONS`), `SWE_TIMEOUT_SECONDS`.

### eval_config.yaml → EvalConfig → defaults (README §7.1)

Your submission’s `eval_config.yaml` (all keys under `evaluation:`) customizes per-task Stage-1 budgets **on the scorer too** — the scorer reads exactly these four fields (staff, 743964/743063):

| eval_config.yaml key | EvalConfig path | Default | Env override |
|---|---|---|---|
| `max_time_minutes` | `config.budget.time_minutes` | 60.0 | `SWE_MAX_TIME_MINUTES` |
| `max_tool_calls` | `config.budget.tool_calls` | 100 (inference.py) / None (CLI) | `SWE_MAX_TOOL_CALLS` |
| `max_turns` | `config.budget.turns` | 500 | `SWE_MAX_TURNS` |
| `timeout_seconds` | `config.harness.command_timeout_seconds` | 300 | `SWE_TIMEOUT_SECONDS` |

Non-configurable harness caps: `max_stdout_chars` 5,000 · `max_file_lines` 150 · `max_file_chars` 10,000. `cost_usd` / `total_tokens` budgets exist in EvalConfig but have no YAML key and no env override.

> **Trap:** the shipped `sample_submission/eval_config.yaml` is deliberately tiny — `timeout_seconds: 60, max_tool_calls: 10, max_time_minutes: 1, max_turns: 50`. In the official notebook the starter agent times out at 1m00s with 4 tool calls and produces an empty patch. Raise all of them for any meaningful local run. Those sample values are *not* competition budgets either — the competition constraint is the **12 h whole-submission clock** (see `07`).

### Single-task debug loop (the workflow you’ll actually use daily)

```bash
# one task, watched live
swegemma eval --tasks tasks.jsonl --snapshots-dir snapshots \
  --submission-dir my_agent --results-dir results/debug_fastapi_15661 \
  --sandbox subprocess --task-id fastapi_15661 \
  --max-tool-calls 50 --max-time-minutes 30 --display auto

# shard across two terminals (or two machines)
swegemma eval ... --shard-index 0 --num-shards 2 --results-dir results/shard0
swegemma eval ... --shard-index 1 --num-shards 2 --results-dir results/shard1
```

## 4. The two-phase lifecycle (what a “run” actually is)

**Phase 1 — agent container (Container A).** Snapshot extracted at `base_commit` with future history stripped (`git fast-export | git fast-import` onto `main`); harness appends `.git/info/exclude` entries (`__pycache__/`, `*.pyc`, `.pytest_cache/`, `*.egg-info/`, `build/`, `dist/`, `.coverage`); installs the repo editable from local wheels (`pip install --no-index --find-links=/wheels --no-build-isolation --no-deps -e /workspace || true`); streams cached test site-packages; runs `sandbox/setup.py --fast-path <repo>`; writes `pytest.ini` + `conftest.py` hooks; then commits the baseline: `git add -A && git commit -m "baseline"`. **The agent’s timer starts only after all of this** — container setup is excluded from the task budget. The agent works under: network **none** (docker backend), 4 GiB RAM (OOM = exit 137), 2 vCPU, `/workspace` cwd. On completion (`submit_patch()` or timeout), the patch is extracted as `git add -N . && git diff --binary _swegemma_baseline` (falling back to `git diff --binary HEAD`). If the agent never calls `submit_patch`, the harness auto-extracts the same diff — an empty patch only happens when the tree is genuinely clean.

**Phase 2 — verification container (Container B).** Fresh snapshot, `eval_baseline` commit, then: 4-pass agent-patch application (`git apply --unsafe-paths -p1` → `-3` → `--ignore-space-change --ignore-whitespace` → `--recount`; then symlink-normalized apply; then `-p0`; then GNU `patch -p1/-p0 --batch --forward -l` behind a `--dry-run` gate) — all four fail ⇒ `resolved=False`. Anti-tamper: every path in `test_patch` **plus** any `test_*.py`/`*_test.py`/`.py` under `tests|test|testing` **plus** `conftest.py`, `pytest.ini`, `pyproject.toml`, `tox.ini`, `setup.cfg`, `.pytest.ini`, `sitecustomize.py`, `usercustomize.py`, `_swegemma_stubs.py`, `*.pth` touched by the agent patch is force-reset (`git checkout HEAD --` + `git clean -f --`) before the task’s `test_patch` applies. Then hermetic pytest:

```bash
cd /workspace && PYTHONSAFEPATH=1 PYTHONNOUSERSITE=1 python3 -s -m pytest <targets> \
  --junitxml=/tmp/_swegemma_junit_<id>.xml -p no:anyio -o timeout=0 \
  -o python_classes="Test* *Test" -q
```

`resolved=True` iff exit code 0 **and** JUnit XML exists with `passed>0`, `failures=0`, `errors=0`, and every required node (FAIL_TO_PASS / PASS_TO_PASS / extracted) passing **without skipping**. **Resolution Rate = resolved / total** — that single number is the metric everything else serves.

Consequences you must design around:

- Agent edits to anything in the protected list are **discarded** — and the visible suite can contradict the graded one (verified live on httpx_3672: the hidden `test_patch` renames 5 `p.complete()` call sites). Never “fix” a test; never trust a locally-visible test name as the grading target.
- Anything the agent writes inside `/workspace` (a `repro.py`, say) is swept into the patch by `git add -N .` — **scratch goes in `/tmp`**, always.
- `pytest.ini` / `conftest.py` are harness-written and committed into the baseline *before* the agent starts. The agent sees them as repo files; deleting them pollutes the patch and gets reset anyway.

## 5. Model serving for a local run

Two mechanisms, both undocumented end-to-end — this section is the assembled recipe.

**(a) The notebook path (proven).** The official notebook starts the server itself, then hands the registry to `Evaluator`:

```python
from adk_submission… import VllmConfig, VllmServer   # (names per Getting Started §4)
vllm_cfg = VllmConfig(
    model="/path/to/gemma-4-31b-it-qat-w4a16-ct",   # Kaggle: /kaggle/input/models/google/gemma-4/other/gemma-4-31b-it-qat-w4a16-ct/2
    port=8000, host="127.0.0.1",
    tool_call_parser="gemma4", reasoning_parser="gemma4",
    max_model_len=32768, dtype="bfloat16",
    gpu_memory_utilization=0.90,          # notebook local value; competition value is 0.80
    enable_auto_tool_choice=True,
    enable_lora=True, max_loras=8, max_lora_rank=128,
    tensor_parallel_size=1,               # 5090 = 1 GPU (4 if >=4 GPUs, 2 if >=2)
    startup_timeout=60*20,
)
server = VllmServer(vllm_cfg, adapter_manifest=adapters).start()
```

then `EvalConfig(models=server_instance.create_model_registry(aliases=[declared_model, TARGET_MODEL_NAME], model_prefix="openai/", api_key="EMPTY"), …)` and `run_sync(evaluator.evaluate_task, task=…)` per task. Full field list for the programmatic `EvalConfig` (from the notebook, verified): `tasks_path, snapshots_dir, results_dir, submission_dir, models, sandbox, timeout_seconds, max_time_minutes, max_tool_calls, max_turns, limits (build_submission_limits()), generation_constraints, adapter_manifest (discover_adapters(AGENT_DIR)), context_cache_config=ContextCacheConfig(min_tokens=2048, ttl_seconds=1800, cache_intervals=10), events_compaction_config=EventsCompactionConfig(compaction_interval=15, overlap_size=2, token_threshold=14336, event_retention_size=5), graph_dir, embeddings_dir, wheels_dir, verbose`.

**(b) The CLI path (INFERRED, verify on first run).** The README never says how `swegemma eval` obtains its server. Most likely design (consistent with `--models-yaml` existing): point `--models-yaml` at an already-running endpoint. Until verified, start vLLM yourself with stock flags equivalent to the above, e.g. on the 5090:

```bash
vllm serve /path/to/gemma-4-31b-it-qat-w4a16-ct \
  --host 127.0.0.1 --port 8000 --tensor-parallel-size 1 \
  --max-model-len 32768 --dtype bfloat16 --gpu-memory-utilization 0.90 \
  --enable-auto-tool-choice --tool-call-parser gemma4 --reasoning-parser gemma4 \
  --enable-lora --max-loras 8 --max-lora-rank 128 \
  --lora-modules main_lora=my_agent/adapters/main_lora tool_lora=my_agent/adapters/tool_lora
```

(Flag names are stock-vLLM; check `vllm serve --help` on 0.19.1 — see `08` T-09. The harness’s `default_chat_template_kwargs={"enable_thinking": True}` is set by `VllmServer` in code, not a CLI flag — if you serve manually, verify your chat template defaults to thinking-enabled.)

**Model registry (README §3.3).** `setup_gemma_model_registry()` registers: `gemma-4-31b-it-qat-w4a16-ct` (competition + starter default), and the local-only unquantized set — `gemma-4-31b-it/-31b`, `-27b-it`, `-26b-a4b-it`, `diffusiongemma-26b-a4b-it`, `-12b-it`, `-9b-it`, `-e4b-it`, `-e2b-it` (with short aliases). The bf16 variants are explicitly “registered … for local CLI evaluation only” — that is your legal, free iteration loop. Weights ≈ 16–18 GB for 31B QAT (~4.5 GB/GPU at tp=4); see `01` for the full VRAM fit table on a 32 GB 5090.

**12B special case (staff, 748287):** serving 12B requires the `--hf-overrides` snippet — `architectures: Gemma4ForCausalLM`, `model_type: gemma4` — wired into `VllmConfig extra_args`. The scorer is already patched; your local rig must add it too. E4B/E2B/31B don’t need it.

**Sampling config (`configs/sampling.yaml`).** Starter values: `temperature 0.2 / top_p 0.95 / max_output_tokens 16384 / thinking_config {thinking_budget 4096, include_thoughts true}`. Bounds: `max_output_tokens` 1..32,768 (default 16,384), `thinking_budget` 0..32,768 (default 4,096). **Do not set `thinking_level`** — under vLLM’s OpenAI-compatible `/v1` it maps to `reasoning_effort` and breaks with LoRA; the harness runs `litellm.drop_params = True` to survive exactly this. Execution-altering ADK fields (`tools`, `system_instruction`, `http_options`, `safety_settings`, `response_schema`) inside `generate_content_config` raise a validation error.

**Context management (set by the harness, not you):** `EventsCompactionConfig` — README: `compaction_interval=5`, notebook: `15`; both `overlap_size=2`, `token_threshold=14336`, `event_retention_size=5`. `ContextCacheConfig(min_tokens=2048, ttl_seconds=1800, cache_intervals=10)`. Retry plugin: 5 retries, exponential backoff 2.0 s → ×2.0 → max 60 s, ±20% jitter, on 429/500/502/503/504/RateLimit/APIConnection/APITimeout. Known wrinkle (753225, unmeasured): compaction summary LLM requests carry **no** sampling fields, so summaries sample at the model card defaults (temp 1.0 / top_p 0.95 / top_k 64) regardless of your config — true in google-adk 1.36.1 and 1.39.1.

## 6. Run artifacts — what each run leaves you

```
results/run_01/
├── summary.json          # resolution_rate, resolved count, per-repo breakdown, errors
├── task_results.jsonl    # append-only; one line per finished task
├── patches/<id>.patch    # the agent patch Phase 1 produced
├── test_outputs/<id>.log # Phase 2 pytest stdout/stderr
├── traces/trace_<id>.json # ATIF v1.7 SessionTrace — full agent telemetry
└── logs/<id>.log         # Phase 1 agent transcript
```

The ATIF trace is the BCF loop’s raw material (see `06`): every tool call, its arguments and status, budget levels, and the turn structure live there — which is what makes scaffold compliance mechanically checkable after the fact.

## 7. Sandboxes: docker vs subprocess, and the wheelhouse parity problem

| | docker (default) | subprocess |
|---|---|---|
| Isolation | real container, `network_mode=none`, 4 GiB, 2 vCPU, image `swebench-sandbox:latest` | temp dirs `swegemma_sandbox_<id>_` (workspace/ tmp/ wheels/ venv/), path-rewritten, process-group killed (`os.killpg` SIGKILL) on timeout |
| Host requirement | Docker daemon (Zorin native, or Docker Desktop/WSL2 on Windows) | POSIX only — **cannot run on native Windows** |
| Python | 3.13 (image `python:3.13-slim`) | host interpreter — pin **3.12.13** |
| Parity with scorer | closest (unknown which the scorer uses; community scorer-like rebuilds are Docker) | what the official notebook itself uses (`ensurepip unavailable … venv without pip` warnings are normal) |

Docker image build (**INFERRED** — the README names `swebench-sandbox:latest` but ships no build command; confirm the expected tag from the first run’s error):

```bash
mkdir sandbox_ctx && unzip -o gemma-4-developer-agent.zip 'docker/*' 'wheels/*' -d sandbox_ctx
cd sandbox_ctx && docker build -f docker/Dockerfile.sandbox -t swebench-sandbox:latest .
# Dockerfile.public is identical + COPY wheels/ /wheels/ — build context must contain BOTH docker/ and wheels/
```

Image internals that matter for reproducibility: `python:3.13-slim` + `git patch protobuf-compiler pigz` + `pytest pytest-timeout==2.1.0 typer pdm-backend setuptools wheel poetry-core hatchling flit-core editables`, plus `imp.py` (a 3.12-compat shim whose `find_module` returns the legacy tuple “specifically for flasgger”) and `telnetlib.py` (23,336 B) copied into site-packages, git identity `agent@eval`/`Agent`/`init.defaultBranch main`, `TEST_TMPDIR=/tmp`.

**The parity problem in one paragraph (full story in `05`/`08`):** the public `wheels/` set is missing `inline_snapshot`, `dirty_equals`, `annotated_doc`, `typing_inspection`, `pytest-httpbin` — so *gold patches* pass only 52/129 in a plain notebook. The wheelhouse also dedupes to the highest version per package, forcing `starlette 1.6.0` onto all fastapi commits (48 tasks fail `Router.__init__() got an unexpected keyword argument 'on_startup'`). Community fix (751487, scorer-like rebuild): install the five missing test packages + period-correct pins (Pygments for 7 rich tasks; see his `gold_patch_check.csv`) → **127/129** gold-pass, which is the practical ceiling (the last 2 tasks have internally contradictory skip conditions). **Adopt 127/129 as your rig’s acceptance bar before trusting any agent measurement.**

## 8. The 9 agent tools — exact limits (what your prompts must design around)

| Tool | Budgeted | Limits |
|---|---|---|
| `run_command` | yes | timeout `min(300, max(5, remaining_time))`; stdout+stderr each truncated to 5,000 chars; TimeoutExceeded doesn’t end the session |
| `read_file` | yes | 1-indexed inclusive slices; dual cap 150 lines **and** 10,000 chars; sets `is_truncated` |
| `edit_file` | yes | 3-tier match: exact → flexible (line-strip + re-indent) → regex (delimiter-tokenized around `( ) : [ ] { } > = <` with `\s*` joins); non-unique match with `allow_multiple=False` → `FileEditError`; diff truncated at 5,000 chars |
| `write_file` | yes | `mkdir -p` parents |
| `submit_patch` | **free** | doesn’t count against tool_calls; works at 0 remaining; loop ends at the end of that turn |
| `get_status` | **free** | `tool_calls_used/remaining`, `max_tool_calls`, `time_seconds_remaining`, `max_turns`, `command_timeout_seconds` — no `failing_tests` field |
| `get_code_neighbors` | yes | `node, edge_type?, max_neighbors=50`; 4-tier resolution: exact → `.`/`/` suffix → case-insensitive → substring |
| `search_similar_code` | yes | `query, k=10` — **offline**: resolves the query against node keys/suffixes in the `.npz`; query **symbol names** (`HTTPConnection`, `parse_header`), never prose (“Server Sent Events” returns 0; “SSE” hits) |
| `get_code_subgraph` | yes | subgraph by node list |

All budgeted tools return `{status: ok\|error, error_type, error_message, details}`; when `tool_calls_used >= 20` and `remaining <= 10`, every response gains `budget_warning`. Three nudge types (max 3 consecutive, then terminate): unclosed `<|tool_call>` tag; `MAX_TOKENS`/`LENGTH` finish (“keep reasoning under a few sentences and emit your next tool call immediately”); normal stop (“Please continue … or call submit_patch”). A turn with ≥1 tool call resets the nudge counter.

**Two parser-side rules that kill runs** (full treatment in `08`): never end a tool-call string argument with a backtick (the parser drops the following argument — 60/234 `edit_file` + 20/255 `write_file` rejections in the wild); never emit **array-typed** tool arguments containing `]` inside unquoted/quoted-but-unwrapped elements (infinite loop in vLLM 0.19.1’s `gemma4_tool_parser` — freezes the single shared scoring server for **all later tasks**; fix #41991 ships in v0.21.0, scorer stays on 0.19.1).

## 9. Submission-side contract reference (details in `07`)

`agent.yaml` (or `root_agent.yaml`; `.yml` ok; zero roots → `MissingRootConfigError`, >1 → `MultipleRootConfigsError`) with `!include` support (`.md`/`.txt` raw string; `.yaml` recursive to depth 10, cycle-detected; traversal/symlink-escape → `PathTraversalError`). Four agent classes: `LlmAgent` (default; `name/model/adapter/description≤1M chars/instruction≤1M chars/tools/skills/sub_agents/output_key/include_contents/transfer policies/generate_content_config`), `SequentialAgent`, `ParallelAgent`, `LoopAgent` (`max_iterations` 1..500). Adapters: `adapters/<name>/{adapter_config.json, adapter_model.safetensors}`, referenced by `adapter: <name>`; auto-registered to vLLM (`--lora-modules name=path`) and routed as `openai/<adapter_name>`. Hard limits: unpacked size < 3 GiB = 3,221,225,472 B including adapters · `max_file_count` 10,000 · `max_yaml_files` 1,000 · `max_yaml_size_bytes` 50 MiB · `max_skill_size_bytes` 50 MiB · `max_skills` 1,000 · `max_agents` 500 · `max_sub_agent_depth` 50 · `max_loop_iterations` 500 · instruction ≤ 1M chars/agent, 10M total · extensions **only** `.yaml .yml .md .txt .py .json .safetensors` (pickle weights rejected outright). One declared base model per submission — the validator walks root + sub_agents + agent_tool configs, strips provider prefixes, and enforces `len(models)==1` (`ParticipantVisibleError` otherwise).

The starter `system.md` prompt encodes the budget discipline your own prompts should keep: target **8–10 turns**, never bare `pytest` or full-repo sweeps, only targeted tests, never touch test files, end with a non-empty patch. The starter sub-agent (`code_analyzer.yaml`) exists to return exact file paths + line numbers + root cause + minimal change — the same shape as BCF’s P1/P2 artifacts (see `06`).

---

*Verified-against sources for every claim in this file: `HARNESS_README.md` (§2–§9, 2026-09-25), zip central directory + member reads (2026-10-31), `Kaggle-03-GettingStarted.md` (2026-09-29 snapshot), intel brief 2026-10-31 (threads 748287, 751487, 747519, 743973, 744370, 753973/745138/746336, 753521, 753225, 752017). Full list in `09-sources.md`.*


---

<!-- ====================================================================== -->
<!-- FILE: 05-trials-metrics-and-analysis.md -->
<!-- ====================================================================== -->

# 05 · Testing Trials, Metrics, and Result Analysis

*Part of the RTX 5090 Local Testing Guide (2026-10-31). Companion files: `01` hardware, `02` Windows, `03` Zorin, `04` harness usage, `06` BCF improvement loop, `07` submission & local scoring, `08` troubleshooting, `09` sources.*

This file answers: how do I structure local runs (“trials”), which numbers do I read, what is noise and what is signal, and how do the local numbers relate to the Kaggle leaderboard? Everything quantified here traces to the 2026-10-31 intel register (threads 753524, 743506, 751487, 751707, 751973, 750974, 751596, 753793, 744319, 750573) — each load-bearing number carries its thread ID.

---

## 1. The metric stack

| Level | Metric | Definition | Where it comes from |
|---|---|---|---|
| Task | `resolved` | Phase-2 verdict: patch applies (4-pass), anti-tamper clean, hermetic pytest exits 0 with passed>0, failures=0, errors=0, no skipped required tests | `task_results.jsonl` |
| Run | **Resolution Rate** | `resolved / total` in [0,1] — the competition metric | `summary.json` |
| Run (secondary) | patch-submission rate, mean tool calls/task, mean turns/task, median per-call latency, output tokens/call | efficiency diagnostics; they explain *why* a run resolved what it did | ATIF traces + `logs/` |
| Public LB | displayed score | `floor(tasks/58 × 100)/100` — **truncation, never rounding** | Kaggle |
| Rig health | gold-patch pass rate | % of the 129 tasks whose *gold* patch resolves in your sandbox | your `--skip-agent-patch` runs |

Three rules that follow directly:

1. **Never round.** 1 task = 0.0172 displayed (1/58 = 0.017241 pre-floor); the LB’s six structurally unreachable “hole” scores (0.16/0.19/0.21/0.23/0.26/0.28) exist precisely because of truncation. A local metric that rounds disagrees with the LB by up to half a task, systematically. Copy the exact function: `score = math.floor(k/58*100)/100` for k in 0..58.
2. **Rig health gates everything.** Until gold patches pass **127/129** in your sandbox (§4 of `04`; the 2 holdouts have internally contradictory skip conditions — don’t chase them), you are measuring your environment, not your agent.
3. **Public-LB deltas under ~2 tasks are noise.** Measured σ ≈ 1.0 task per 7-task repetition ≈ 2 per 58-task draw (753524, 200+ runs); of 39 well-sampled task×config cells, ~67% are “flippy” (sometimes pass, sometimes not), ~23% never-solve, ~10% always-solve.

## 2. Noise: the numbers to internalize

| Anchor | Value | Source |
|---|---|---|
| Same-config repeat pairs | landed 0 apart twice in direct measurement | 753524 |
| σ per 7-task rep / per 58-task draw | ~1.0 task / ~2 tasks | 753524 |
| Coin-flip upper bound, same run | ~2–3 tasks | 753524 |
| Identical agent files, public LB | 0.12–0.22 spread | 750974 |
| Identical files, task counts | 7–13 of 58 | 751596 |
| One package resubmitted 4× | 0.17 / 0.15 / 0.13 / 0.15 | 748051 |
| 133-vs-77-run experiment (+9 pts) | only p = 0.22 | 753524 |
| 154-run replay of a budget-cap change | null (net −1); community “budget lever” claim retracted by OP | 753524 |
| 35 of 38 multi-file golds | never solved by anyone — a quarter of the practice pool is structurally dead | 753524 |
| Frontier rate | ~30% task pass matches the frontier when run Kaggle-side on all ~129 | 752848 |

**Trial-sizing rule (inferred from the above):** treat 1–4-task single-run gaps as noise; never trust a public delta < 0.02; repeat a promising config before believing it; and **prefer paired, token-budget-matched runs on a fixed task set** (751596’s 98-paired-task pattern, 753793’s matched repeats) over raw run count — even 210 unpaired runs gave p = 0.22.

## 3. Trial protocol

### 3.1 The standard trial (what one “experiment” is)

A trial = **one config change** × **one fixed task panel** × **N paired runs**, with the pair-mate being the parent config. Concretely:

```text
panel/
  PANEL_A.txt     # 28 fixed instance_ids, stratified: 12 fastapi, 10 rich, 4 requests, 1 httpx, 1 known-flippy
runs/
  parent_r1/      # identical seeds/budgets as child
  child_r1/       # the ONE mechanism you changed
  parent_r2/ child_r2/ ...   # N=2 minimum, 3 when a cell is flippy
```

Why paired: identical files swing 7–13/58 (7515596) — unpaired A/B at these effect sizes measures the draw, not the change. Why stratified: the pool is only 4 repos (fastapi 67 / rich 48 / requests 13 / httpx 1), so a random 20-task panel is usually 12+ fastapi and over-weights starlette-shaped failures.

Panel selection rules:

- Include **≥1 known-flippy cell** (a task your agent solves ~50% of runs) — it’s your live noise gauge.
- Exclude the **8 SSL-dead requests tasks** (6589, 6592, 6629, 6757, 7328, 7433, 7502, 7505 — `VERIFY_X509_STRICT` vs `pytest-httpbin` cert on Python 3.13), the **3 version-gated** tasks (`fastapi_14186`, `fastapi_15745`, `rich_3486` — `@needs_py_lt_314` skips on any 3.13.x), and `rich_3472` (error-string drift) from *CV panels* — they distort public-set numbers only; the hidden set is clean (staff 744370: gold scores 100% on hidden tasks).
- For generalization reads, add the community suites: **OOD-45** (45 post-Gemma-4-release fixes from 17 projects; dataset `rodrigospalma/ood45-bugfix-split`, notebook `rodrigospalma/ood45-evaluate-your-agent`) and **FreshSWE-Py** (663 validated post-release tasks from 33 repos in this competition’s exact layout; dataset `moshegolderson/freshswe-py`, with a score-your-own-patches notebook). Both are free pre-scoring surfaces — use them before spending submission slots.

### 3.2 Statistics (the whitepaper protocol, executable locally)

- **Paired exact McNemar** on PASS/FAIL per task between parent and child — the only test with real power at these panel sizes.
- **Holm correction** across the ladder when you test several mechanisms at once (as the A0–A5 ablation does; see `06`).
- **Wilson intervals** on every proportion you report (resolution rates, per-repo rates). Never bare percentages.
- **Three seeds** on any cell whose variance exceeds its mean effect — temperature 0.2 is not 0; identical configs flip.
- Pre-register the refutation condition *before* the run (the BCF ladder does this per mechanism; copy the pattern).

One-line McNemar in Python (exact binomial on discordant pairs):

```python
from math import comb
def mcnemar_exact(b, c):   # b = parent-pass/child-fail, c = parent-fail/child-pass
    n = b + c
    p = sum(comb(n, k) for k in range(0, min(b, c) + 1)) / 2**n * 2
    return min(p, 1.0)
```

### 3.3 Efficiency metrics to capture per run (from ATIF traces)

| Metric | Why it matters | Known-good anchors (31B, 4×L4) |
|---|---|---|
| decode throughput | server health check | 33–35 tok/s (12B: 62–64 — decode only, see below) |
| output tokens per call | dominates per-call latency | median 127 (12B: 233) |
| median per-call latency | the real speed number | 10.3 s (12B: 11.5 — **slower**) |
| patch-submission rate | are edits landing at all? | 81–84% (E4B: 97% but wrong-file 13/31) |
| tool calls / task, turns / task | budget-burn shape | starter targets 8–10 turns |
| resubmit loops (identical rejected calls) | parser-trap symptom | 64 exact blind resends in the wild (747519) |

**The 12B lesson, quantified (750974 + Zhukov 24-task benchmark):** decode ~1.9× faster is cancelled by ~1.8× more output tokens per call (median 233 vs 127) and ~1.5× more per task (~12,400 vs ~8,100); net per-call latency 11.5 vs 10.3 s; 12B solved 4/31 vs 31B’s 9–11/31 at every tested budget; and a 12B LB submission at the 8-min limit did **not** finish inside the 12 h clock (slot burned, zero score). Never adopt a “faster small model” for end-to-end work on decode numbers alone.

### 3.4 Time budgeting a trial

Per-task Stage-1 wall clock is bounded by your eval_config (use 5–8 min/task for 31B-class panels); Phase 2 adds verification time **excluded** from the task budget but not from your evening. Practical planning numbers on a single 5090 (tp=1, QAT 31B, 32k ctx): expect **sub-linear pain** vs the 4×L4 rig — throughput roughly halves per streaming sequence at equal batch, and vLLM batches concurrent tasks only if you raise `--concurrency`; measure your own `tok/s` on day 1 and size panels from it, not from L4 numbers. A 28-task panel at ~6 min/task mean ≈ **2.8 h serial**; two shards on one GPU do not stack (one server), so parallelize by *shard across time*, not concurrently, unless you run separate model instances on smaller variants.

## 4. Analysis workflow per run (the 30-minute post-run checklist)

1. **Read `summary.json` first**: resolution_rate, per-repo breakdown, errors count. Per-repo divergence (e.g. fastapi 0 / rich 0.4) is almost always an environment signature (starlette wheel pin!) or a prompt bias, not a model property.
2. **`--skip-agent-patch` control if anything moved**: if gold-pass changed since your last control run, the environment drifted — quarantine all agent conclusions from that day.
3. **Diff the panels pairwise** (parent vs child) at task granularity; feed the discordant set to step 4.
4. **Read 3 traces from each side of every discordant task**: did the child fail at P1 (spec), P2 (localization), P3 (edit mechanics), or P4 (validation)? The failure *layer* — not the pass/fail — is what generalizes. (This taxonomy is the BCF ledger’s core; see `06` §2.)
5. **Check the parser traps**: any task ending with 0 LLM calls at high wall-clock = probable array-arg hang (753973); any run of rejected `edit_file`/`write_file` with identical retries = backtick trap (747519). Both are *harness-level* losses — remove them from the agent-quality numbers and fix the prompt/scaffold instead.
6. **JUnit size guard**: any `junit*.xml` > 10 MiB means the task could never pass regardless of patch correctness (sandbox output cap truncates the report — 8 python-multipart cases in the wild, 751707).
7. **Write the ledger row** before starting the next run (see `06`). Unrecorded runs are noise you paid for.

## 5. Local → leaderboard: what transfers and what doesn’t

| Local finding | Transfers to LB? | Evidence |
|---|---|---|
| Environment-level failures (wheels, sandbox, parser) | **Yes** — fix locally, score benefits immediately | 743973/744370/751487 chain: CV/LB anti-correlation (CV 0.18→LB 0.05) resolved entirely by environment repair |
| Scaffold mechanisms (spec-first, gates, budget policy) | Partially — directionally, not rank-preserving | 751973 open-sourced full pipeline: “our local screen never ranked our hidden scores”; two configs tied 28/74 locally scored 0.17 vs 0.10 hidden; a 9–0 local winner scored *lower* hidden |
| Per-task solve/no-solve | Weakly | ~67% of well-sampled cells flippy (753524) |
| Timing safety margins | **Yes, conservatively** | 752017: +5% median local time = 12 h overrun on hidden repos; budget per task via eval_config.yaml |

The operating posture this implies: **use local runs to eliminate failure modes and validate mechanisms, not to pick winners**; pick finals by public-LB evidence at ≥2-task margins; and hold the 12 h global clock as the binding constraint when a config adds any per-task cost (staff’s only sanctioned lever is eval_config.yaml budgeting — defaults are “no limit,” which is how 752017 died).

## 6. Bonus-track (E2B/E4B) trial targets

The $10,000 small-model bonus requires the E-series run to be one of your **two final submissions** (staff 751104; private = better of the two, 752220). Field evidence as of 2026-10-31: **zero publicly identifiable E-series teams on the main board**; the only E4B activity is bug reports (rank 48, eligibility unconfirmed). Working targets from the intel brief: **~0.10 (6 tasks) = comfortable win; 0.06 (4) = real shot; 0.12–0.13 (7–8) = safely ahead of any foreseeable E-field**.

Known E4B-specific failure layers to design trials around (each is a separate experiment, don’t conflate):

1. **Capability floor**: 0/31 at 5-min limit, 97% patch rate but **wrong file in 13/31**, sometimes whole-file overwrites (750974, same agent files as a 31B solving 9–11/31).
2. **Copy fidelity (QAT-specific)**: trailing-`s` drops (“directs”→“direct”) breaking exact-match edits; unmodified QAT failed 15/18 copy probes, SVD rank-128 LoRA 1/18 (753277; repro repos `michi883/gemma-copying-tensor-fix`, dataset `michi883/ple-proj-svd-r128`; rules-permissiveness of weight modification unadjudicated — check before relying on it in a submission).
3. **Serving path**: intermittent scorer “incorrect format” on validator-passing E4B bundles around 2026-10-22/23 (752128), incl. one bundle that scored one day and failed unchanged the next; unresolved, staff unanswered.
4. **LoRA-on-E scorer compatibility**: vLLM 0.19.x Gemma-4 LoRA errors (issue #40693, candidate fix PR #39291 — inclusion in the scorer build unknown, 752239 unanswered) **and** a report that scorer-side PEFT cannot load adapters on `Gemma4ClippableLinear` at all (753388, unverified, 0 comments). Local LoRA success proves nothing about the scorer.

**Consequence for trials:** the E-series trial loop should first establish the *edit-targeting* fix (wrong-file rate), then the copy-fidelity fix, then attempt LoRA *canaries* (C1 in `06`), and only then consider slots — holding a non-LoRA E-series run as the safe final-slot fallback until staff answers 752239/753388.

---

*Sources: intel brief 2026-10-31 register (753524 L69, 743506, 751487 L71, 751707 L103, 751973 L102, 750974 L105, 751596 L104, 748051 L106, 753793, 744319, 750573 L109, 752017 L101/115, 752128 L100, 753277 L72, 753388 L96, 752239 L98, 751104 L64, 752220 L99, 748287 L65); leaderboard analysis 2026-10-31; `03-bcf-simulation-httpx-3672` (2026-09-30). Full list in `09-sources.md`.*


---

<!-- ====================================================================== -->
<!-- FILE: 06-bcf-improvement-loop.md -->
<!-- ====================================================================== -->

# 06 · Improving the BCF Brain from Each Run — The Ledger → Config Loop

*Part of the RTX 5090 Local Testing Guide (2026-10-31). Companion files: `01` hardware, `02` Windows, `03` Zorin, `04` harness usage, `05` trials & metrics, `07` submission & scoring, `08` troubleshooting, `09` sources.*

This file operationalizes the BCF (Bug-Cause-First) scaffold on the local rig: what each run must record, how the records become failure taxonomy, and how the taxonomy becomes the next run’s configuration. It is the executable version of the formal spec (`deliverables/2026-10-31-bcf-gemma4-whitepaper-bonus/01-bcf-formal-specification.md`) and the whitepaper §5 ablation protocol (`02-kaggle-whitepaper-draft.md`) — every mechanism below carries its anchor in those files.

The one-sentence theory being tested: **a scaffold that writes down *why* each task failed, in a shared vocabulary, can start task #90 warmer than task #1** — expressed as the turn-budget model `E[T_bcf] = c_spec + c_graph + (1 − q)·m·r` (whitepaper §3), where `q` is the probability the P1 spec orders the fix correctly on the first attempt, `m` the edits-per-fix constant, and `r` the per-edit retry rate. Every loop iteration below exists to raise `q` or lower `r`.

---

## 1. The phase machine (what “compliance” means, checkable from traces)

Each phase has a defined entry condition and exit artifact — which makes scaffold compliance **mechanically checkable from the run’s ATIF trace** after the fact (whitepaper §2). Your local checker asserts, per task:

| Phase | Entry | Exit artifact (what the trace must show) | Check |
|---|---|---|---|
| P1 Specification | task issued | per-bug record: **Hypothesis** (falsifiable statement of what is wrong) + **Target** (candidate file:symbol) + **Fix-shape** (minimal change description), plus causal fix order for multi-bug tasks | spec-before-read: the decomposition exists **before the first `read_file`** |
| P2 Localization | spec written | dual symbol search over the indexed call graph — definers and callers of the specced symbol — before any workspace grep | graph-first: ≥1 `search_similar_code`/`get_code_neighbors` call precedes the first `edit_file` |
| P3 Edit | target confirmed | every mutation passes a deterministic **gate** pricing scope (files ∪ symbols ∪ tests affected) and verification coverage (tests exercising scope / tests touched) | gate-use: no `edit_file`/`write_file` without a preceding gate decision in the same turn |
| P4 Validation | patch built | targeted tests = failing tests + their graph-neighborhood passing tests; on failure, **one** bounded retry then rollback | targeted-only: no bare `pytest`, no full-repo sweeps; retry count ≤ 1 |

Phase-2 subtlety the rig must respect: `search_similar_code` is **symbol-name** lookup offline (cosine over the `.npz` dictionary keys — “SSE” hits, “Server Sent Events” returns 0), so the scaffold’s graph queries emit class/function/module names, never prose. The community’s independent finding (745731) — plain `grep` beats the shipped graph tools on wall-clock — is *compatible* with graph-first: P2 uses the graph for **definer/caller semantics** (what grep cannot give) and the prompt may authorize grep as a secondary; the check is that the *first* localization action is a graph query, not that grep is banned.

Anti-tamper note (verified live, httpx_3672): Phase 2 resets **all** test files to baseline and applies the harness’s own `test_patch` — agent edits to tests are discarded, and the visible suite can contradict the graded one. P4’s “targeted tests” are therefore a *decision aid*, never a grading oracle; the scaffold must treat “the suite I can see” as adversarial input.

## 2. The per-task ledger (what every terminal task appends)

Verbatim field list (whitepaper §2 “Post-mortem accumulation”; formal spec §6.1–6.2). One row per task, appended regardless of outcome — failures are the payload:

| Field | Content |
|---|---|
| `failure_signature` | normalized shape of the failure (see taxonomy §3) — not the raw text |
| `phase_reached` | P1/P2/P3/P4/terminal-verified |
| `localization_path` | graph-first vs grep-first vs spec-blind; symbols queried |
| `turn_counts` | turns to spec, to first edit, to submit; total |
| `gate_decisions` | each gate’s scope price and coverage ratio |
| `budget_consumption` | tool calls, wall clock, output tokens |
| `patch_shape` | files touched, hunks, added/deleted lines; multi-file yes/no |
| `outcome` | resolved / patch-rejected / test-failed / timeout / budget-exhausted / parser-trap |
| `retry_chain` | edit retries with rejection reasons (exact/flexible/regex tier that matched) |
| `notes` | one line: the falsifiable “next time” hypothesis |

**Fidelity ladder** — how much of this you reconstruct, at what cost (formal spec §6.1):

| Rung | What the run emits | Cost |
|---|---|---|
| **L0 decision ledger** | one row per gate decision / phase transition / submission | ~100 B/row, **always on** — “reconstructs the run” |
| **L1 tool-level ledger** | + every tool call with args-shape, tier matched, latency | from ATIF traces automatically |
| **L2 semantic ledger** | + spec content, hypothesis tests, RCA rows | requires the scaffold’s own emission (prompt discipline) |

Design rule: **L0 is mandatory from run #1**; L1 is free (the traces exist anyway — `04` §6); L2 arrives with prompt maturity. The improvement loop only works if L0/L1 are never skipped on “quick” runs — that is where the recurrence statistics come from.

## 3. Failure taxonomy → codebook → config delta (the loop itself)

Formal spec §6.3 (and C7 in the articles table) defines the loop; on the rig it is a weekly batch job:

```text
run → ledger rows (L0–L1, +L2 when present)
    → failure_signature clustering (exact-normalized strings, not embeddings)
    → RCA rows (one per cluster: phase, mechanism, evidence links)
    → taxonomy/codebook delta (candidate new classes; merges; retirements)
    → config delta (prompt instruction, gate parameter, budget policy, model/adapter)
    → next paired trial (05 §3.1) → accept/reject by McNemar → merge codebook
```

Grounded starter taxonomy (seed classes from the intel register — each with its known fix lever):

| Signature class | Observable shape | Lever |
|---|---|---|
| `parser:backtick-arg` | rejected edit_file/write_file with identical blind resends | prompt rule: never end string args with a backtick; cap resends at 1 (747519) |
| `parser:array-hang` | task ends with 0 LLM calls at high wall-clock; server CPU-pinned | no array-typed tool args anywhere; smoke-test call strings (753973/745138/746336) |
| `budget:stage-starvation` | multi-agent bundle: 7/8 timeouts originate in stage 1 | one shared EvaluationBudget per task — sequence stages, budget inside the envelope (747519) |
| `budget:12h-overrun` | LB run ends Notebook Timeout ~12 h | any +per-task cost needs headroom vs the global clock (752017) |
| `scorer:anyio-fixture` | tests requesting `anyio_backend` fixtures fail under `-p no:anyio` | prompt: reproduce without anyio plugin fixtures (751707, 79 cases) |
| `scorer:skip-counted-fail` | “20 passed, 1 skipped” marked unresolved | avoid platform-skips; exact-name test targeting (751707; `node_matches_requirement` prefix bug — swegemma 0.2.11) |
| `scorer:junit-oversize` | report > 10 MiB truncated ⇒ unresolved despite all-pass | suppress verbose output in touched suites (751707, 8 cases) |
| `env:wheel-pin` | per-repo gold-pass collapse (fastapi starlette signature errors) | rig-side: five missing test packages + period-correct pins (751487) |
| `edit:wrong-file` | patch lands in a non-causal file (E4B: 13/31) | P2 gate: no edit without definer/caller confirmation (750974) |
| `edit:copy-fidelity` | trailing-char drops breaking exact match (E4B QAT) | prefer regex-tier edits / smaller anchors; copy-test before panels (753277) |
| `spec:unfalsifiable` | P1 hypothesis not testable as written | prompt rule: hypothesis must name observable symptom + would-be-falsifier |

**Recurrence-rate metric** (whitepaper §4, falsifiable): the frequency of a previously-seen failure signature should **fall** as runs K grow, because the scaffold consults the codebook. Track `P(signature class c recurs at run k) / P(c at first appearance)` per class — this is the scaffold-learning signal, independent of resolution rate, and it moves at panel scale (n≈28) where resolution rate doesn’t.

## 4. The A0–A5 ablation ladder as a *runnable local recipe*

The whitepaper §5 ladder is pre-registered with one added mechanism per rung and a refutation condition per mechanism. On the rig it becomes six configs over the fixed panel:

| Rung | Config delta vs parent | Mechanism under test | Pre-registered refutation |
|---|---|---|---|
| **A0** | minimal ADK agent, no BCF (the starter, budgets raised) | baseline | — |
| **A1** | + P1 spec gate (C3/C4) | spec-before-read | if spec-writing cost (turns) ≥ solve-rate gain on spec-orderable tasks → refute |
| **A2** | + P2 graph-first localization | definer/caller before grep | if graph queries add turns without reducing wrong-file edits → refute |
| **A3** | + P3 gates (C5) | scope/coverage pricing before edits | if gate overhead exceeds retry savings → refute |
| **A4** | + P4 targeted validation + bounded retry | test-neighborhood targeting | if full-suite runs resolve ≥ targeted at equal budget → refute |
| **A5** | + ledger/codebook consultation (in-run accumulation) | warm-start from signatures | if recurrence rate does not fall with K → refute |

Running it: 6 rungs × 2 paired runs × 28-task panel ≈ 12 runs ≈ 34 h wall on a 5090 at ~6 min/task — one week of evenings. Statistics per `05` §3.2: exact McNemar per rung vs parent, Holm across the ladder, Wilson intervals everywhere, three seeds on flippy cells. **All ladder numbers are protocol-declared, not yet measured** (whitepaper §7 limitation — this rig is where they get measured first).

**BCF-E variant (E4B deltas from the bonus plan §3):** spec fields compress (shorter Hypothesis/Target/Fix-shape); graph queries go **eager** (“always run the definer/caller search immediately after spec” — small models skip optional steps); gates simplify to file-scope-only (symbol pricing costs turns E4B needs elsewhere); P4 retry budget drops to 1. Test these as rung-A′2/A′3 on the E-track, not as assumptions.

## 5. LoRA experiments: canary gates before slots

Standing evidence: LoRA nulls on **both** E4B and 31B with infra fixed (753793 three-arm E4B null — full-trajectory SFT, filtered, targeted-format — none beat no-adapter; 750713/750961 31B nulls), and the historical nulls were confounded by the sample adapter being a **layer-0 stub** (r=4, alpha=8, `layers_to_transform [0]`, q_proj+o_proj only — staff 749528 note). The shipped starter adapter is exactly that stub: **do not treat it as a baseline**, treat it as a placeholder shape.

Canary protocol (bonus plan §4) — run locally, in order, before any adapter touches a submission slot:

| Gate | Setup | Pass condition | Fail action |
|---|---|---|---|
| **C1 no-op canary** | rank-1, near-zero-init adapter on the target variant | score within noise of bare baseline (±3 tasks ≈ ±0.05) | adapter loading itself perturbs serving — fix integration before training anything |
| C2 signal canary | rank-r adapter trained on ~100 copy-fidelity cases (the 753277 repro set) | copy-test failures drop vs C1 baseline | capability not reachable via LoRA at this rank/scope — escalate rank or abandon |
| C3 task canary | best C2 adapter on the E-panel | paired McNemar vs bare E4B on 28 tasks | keep the bare run as the final-slot candidate |

Scorer-compatibility gates (unresolved as of 2026-10-31, both staff-unanswered): vLLM 0.19.x Gemma-4 LoRA errors — issue #40693, candidate fix PR #39291, scorer inclusion unknown (752239); scorer PEFT reportedly cannot load adapters on `Gemma4ClippableLinear` (753388, unverified). **Until answered: hold a raw-base non-LoRA E-series run as one of the two final submissions** (751104 requires the bonus entry to occupy a final slot; private = better of two, 752220, so the hedge is free).

Training-side notes for the 5090 (details in `01`/`02`/`03`): adapters for QAT bases must be trained **against the unquantized variant** (staff guidance, 748287) then served over the QAT base; keep `max_lora_rank ≤ 128` and total adapter bytes inside the 3 GiB envelope (r=16 ≈ 110–220 MB … r=128 ≈ 0.9–1.8 GB per adapter, 8 concurrently served max).

## 6. The improvement loop’s decision rules (when to change what)

| Evidence from the loop | Config change |
|---|---|
| Signature class recurs across ≥3 runs, fix lever known | patch the prompt/scaffold rule; add a codebook entry; re-run the class’s discordant tasks as the next panel |
| Wrong-file edits dominate (P2 failure) | tighten the P2 gate: require definer+caller confirmation before first edit; if E-track, go eager-graph |
| Turn counts rise, resolution flat | budget policy: raise `max_output_tokens` headroom (truncated `<\|tool_call\|>` tags waste whole turns) or drop spec verbosity (BCF-E compress) |
| Recurrence rate flat across K | the codebook isn’t being consulted — check L2 emission (prompt discipline) before blaming the model |
| A rung’s refutation condition fires | drop the mechanism, log it in the ladder table, keep the parent — the ladder is a search, not a ratchet |
| Public LB contradicts a confident local result at ≥2-task margin | trust the LB; re-audit the environment first (05 §4 step 2), the scaffold second |

**Effort Governor** (formal spec §7) — the thinking-budget policy table to encode in `generate_content_config` per phase: P1 spec/task start = high (≥4,096); P2 localization queries = low; P3 first edit = medium; P4 validation reads = low; retries/rollback = high. (On the vLLM path this is `thinking_budget` shaping, not `thinking_level` — `04` §5.)

**Finals decision rule** (bonus plan §1/§6/§7 R-7): pick E4B as final #2 iff its best public score ≥ 0.03 (≈2 tasks) **and** the main-track #2 candidate is not within noise of #1’s robustness — otherwise spend both slots on main-track hedges.

---

*Anchors: `01-bcf-formal-specification.md` §3–§7, §9–§10; `02-kaggle-whitepaper-draft.md` §2–§5, §7; `04-bonus-prize-submission-plan.md` §1, §3–§4, §6–§7; `05-main-idea-beginners-guide.md` §2.2–§2.3; intel register 745731, 747519, 748287, 749528, 750974, 751707, 752017, 752128, 752220, 752239, 753277, 753388, 753524, 753793, 751104. Full list in `09-sources.md`.*


---

<!-- ====================================================================== -->
<!-- FILE: 07-submission-and-local-scoring.md -->
<!-- ====================================================================== -->

# 07 · Submission Generation and Local Scoring

*Part of the RTX 5090 Local Testing Guide (2026-10-31). Companion files: `01` hardware, `02` Windows, `03` Zorin, `04` harness usage, `05` trials & metrics, `06` BCF loop, `08` troubleshooting, `09` sources.*

This file covers the last mile: turning your agent directory into `submission.zip`, getting it onto Kaggle, what the scorer does to it, and how to reproduce the scoring decision locally so a submission slot is never spent on an untested bundle. Sources: the four official page captures (Overview / Data / Getting Started / Official Rules, 2026-09-29, in `input/kagglecomp/docs/markdown/`), `HARNESS_README.md`, and the 2026-10-31 intel register.

---

## 1. Competition mechanics (verified from the Rules capture + staff threads)

| Item | Value |
|---|---|
| Competition | Kaggle “Gemma 4 Developer Agent” (google/gemma-4-developer-agent, comp 149921), Google DeepMind, Featured |
| Timeline | Start 2026-09-23 · **entry + team-merger deadline 2026-11-25 11:59 PM UTC** (accept rules before) · **final submissions 2026-12-02 11:59 PM UTC** · Paper track (separate competition) closes 2026-11-12 |
| Cadence | **max 1 submission/day** (Rules §2.2.a) **plus a pending limit**: the next submit is blocked while one is still scoring (staff 747519) — never plan final-day batch submissions |
| Final selection | **two** Final Submissions; private score = **better of the two** (staff 752220: “no downside to selecting a second”) — if you don’t select, Kaggle auto-selects |
| Budgets | **12 h wall clock per scoring run, inclusive of sandbox setup for all tasks, exclusive of patch validation**; overrun = Notebook Timeout, **no partial score, slot burned** (752017) |
| Models | 4 allowed QAT variants — `gemma-4-31b/12b/e4b/e2b-it-qat-w4a16-ct` (staff 748287, dropped 2026-10-11; the Sept-29 Overview’s “only 31B at present” is stale). **One base model per submission** — no mixing across agents/sub-agents; different LoRA adapters over the one base are allowed |
| 12B extra requirement | staff `--hf-overrides` snippet (`architectures: Gemma4ForCausalLM`, `model_type: gemma4`) in `VllmConfig extra_args`; scorer already patched |
| Scoring hardware | 4× L4 (24 GB each) · vLLM tp=4 · the pinned wheelhouse stack (patched **vLLM 0.19.1**) |
| Bonus track | $10,000 small-model (E2B/E4B) — highest private-set submission on an E variant; **must occupy one of the two final slots** (staff 751104); LoRA allowed; cross-eligible with main + paper |
| Prizes | $100,000 total: main $65,000 (37/18/10) + paper $25,000 + small-model $10,000 |
| Licensing | winner license Apache-2.0; shared code must be OSI-approved non-commercial-limiting; no private code sharing (DQ risk) — the local rig inherits these constraints if you publish anything |

**Score math:** public LB = `floor(tasks/58 × 100)/100` — truncation, 1 task = 0.0172; ~120 hidden tasks split ~evenly public/private; the public 58 are a floor-truncated half-view. Six display scores (0.16/0.19/0.21/0.23/0.26/0.28) are structurally unreachable; 0.25 and 0.27 are achievable but unoccupied as of 2026-10-31.

## 2. What goes in the zip (and what the validator enforces)

Archive root = your agent directory. `agent.yaml` **required** at root (or `root_agent.yaml`; `.yml` accepted; zero roots → `MissingRootConfigError`, more than one → `MultipleRootConfigsError`). Full contract and limits: `04` §9. The 10-file starter (0.17 MiB) is the shape reference:

```text
submission.zip
├── agent.yaml                      # root agent; !include refs allowed
├── eval_config.yaml                # optional per-task budgets (scorer reads exactly 4 fields)
├── configs/sampling.yaml           # generation config
├── prompts/system.md, analyzer.md  # instruction text
├── sub_agents/code_analyzer.yaml   # additional agents
└── adapters/{main_lora,tool_lora}/ # adapter_config.json + adapter_model.safetensors
```

Hard limits, enforced by `build_submission_limits()` (`swegemma/config.py`): **unpacked** total < 3 GiB (3,221,225,472 B) **including adapters** — compression buys nothing; file count ≤ 10,000; YAML files ≤ 1,000 and ≤ 50 MiB each (incl. `!include` expansion); instructions ≤ 1M chars/agent, 10M total; skills ≤ 1,000 (50 MiB each); extensions **only** `.yaml .yml .md .txt .py .json .safetensors`; adapter weights `.safetensors` only (`.bin/.pt/.pth` rejected). One declared base model across the whole tree (validator walks root + sub_agents + agent_tool configs, strips provider prefixes, `len(models)==1`).

**Packaging exactly as the official notebook does it** (Getting Started §6):

```python
import shutil, zipfile
from pathlib import Path
from swegemma.config import MAX_SUBMISSION_SIZE_BYTES, ALLOWED_SUBMISSION_EXTENSIONS

AGENT_DIR = Path("my_agent")
z = Path(shutil.make_archive("submission", "zip", root_dir=AGENT_DIR))
zf = zipfile.ZipFile(z)
total = sum(i.file_size for i in zf.infolist())
assert total <= MAX_SUBMISSION_SIZE_BYTES, f"Archive exceeds 3 GiB limit ({total} B)"
for i in zf.infolist():
    assert Path(i.filename).suffix in ALLOWED_SUBMISSION_EXTENSIONS, i.filename
print(z, total, "bytes — OK")
```

The scorer extracts to `/kaggle/working/submission` and compiles it with the sandboxed YAML compiler — **you submit no Python entrypoints; `importlib` is never used on your code**. Anything clever you want to run at agent time must be expressible as ADK skill scripts (`.py` under `skills/`, run via `run_skill_script` inside the persistent sandbox, debiting your central time budget).

## 3. Local pre-flight (run ALL of these before every submission)

Ordered by what each failure mode costs you (a burned slot vs an evening):

1. **Validator pass** — the packaging asserts above, run with the *current* wheelhouse’s swegemma (it is the same validator the scorer uses; refresh the wheelhouse before relying on it — 751487/752128 both note validator version drift).
2. **Gold control** — `--skip-agent-patch` gold-run ≥ 127/129 in your sandbox (the two holdouts are environment-impossible; see `05` §1). A dip here means the wheelhouse or wheels moved.
3. **Full local replica run** — the same bundle, served on the same variant you declare, on your 28-task panel, with the eval_config you ship. The bundle must score end-to-end *locally* before it earns a slot (752128’s lesson: even validator-passing, locally-scoring 31B-identical E4B bundles failed intermittently on the scorer — the E-path needs this check most).
4. **Parser-hang smoke test** — feed your agent’s emitted tool-call strings through `_parse_gemma4_args` in a subprocess with a timeout (script in `08` T-05). One array-arg hang freezes the single shared scoring server for **all later tasks** in the run (753973: three tasks at 480 s with zero LLM calls each).
5. **12 h sanity projection** — sum per-task wall clock across ~120 hidden tasks from your local timings, add sandbox setup and a +10–15% hidden-repo margin (752017: +5% local median became a 12 h overrun), and check you clear it with headroom. If not, tighten eval_config.yaml budgets — that file is the **only** staff-sanctioned per-task lever (743964/743063; its defaults are “no limit,” which is precisely how 752017 died).
6. **Alias check** — your `model:` line must resolve on the scorer. The harness registry’s four official QAT checkpoints are authoritative; HARNESS_README §3.1–3.3 stale entries (31B-only `ALLOWED_MODEL_NAMES`; possibly-stale 27b aliases) have burned people — verify the alias against the current wheelhouse, not the README (751104 comment).

## 4. Submitting on Kaggle

The mechanics, from the captures: this is a **code-competition-shaped** flow — the bundle is attached to a notebook (Save Version → Submit to Competition), the inference script runs your uploaded `submission.zip` inside the 4×L4 environment (the getting-started notebook header shows “GPU L4 x4”), produces `submission.parquet` at `/kaggle/working` (`[id, prediction]` schema) automatically during evaluation, and the server-side grader runs Phase 2 on the hidden set. Exact submit-dialog specifics are not in the captures; the Kaggle CLI covers the prep side from either OS:

```bash
kaggle competitions download -c gemma-4-developer-agent -p ./kaggle-comp-data   # data package
kaggle datasets download -d metric/gemma-4-developer-agent-wheelhouse -p ./wheelhouse
kaggle models download google/gemma-4/other/gemma-4-31b-it-qat-w4a16-ct          # base weights
kaggle competitions submissions -c gemma-4-developer-agent                       # quota/status check
```

Operationally, from the ops threads: queue delays were ~33 h at the 2026-10-10 peak, ~14 h by 10-13, and scoring waits of 6–24+ h were still observed late October (one >24 h run finished fine) — the **pending limit** blocks your next submit meanwhile, so the 1/day cadence is effectively 1/in-flight. Do not panic-resubmit on “Kaggle Error”: the 2026-10-09 incident (extreme L4 volume) auto-marked >15 h queued runs as errored even when they ran; staff batch-reprocessed them (participant-confirmed) without tickets or resubmits (747519). Re-read that pinned thread before every submission window.

**Submission-day checklist:** validator ✓ → gold control ✓ → local replica ✓ → parser smoke ✓ → 12 h projection ✓ → alias ✓ → eval_config budgets set ✓ → (E-track) serving-path confirmation in the board ✓ → submit → do NOT resubmit on error states → record refs.

## 5. Reproducing the score locally (what “local scoring” can and cannot be)

You can fully reproduce the *mechanism* — Phase 1 + Phase 2 on the 129 public tasks — with `swegemma eval` (`04` §3). You cannot see the hidden ~120 tasks (private repos, frontier-filtered). What local scoring is *for*:

1. **Regression gate**: same bundle, same panel, same seeds — a drop means your change broke something; a rise needs McNemar before it means anything (`05`).
2. **Failure-mode harvest**: traces → ledger → taxonomy (`06`).
3. **Free pre-scoring surfaces**: **FreshSWE-Py** (663 tasks, competition layout, `moshegolderson/freshswe-py`) and **OOD-45** (`rodrigospalma/ood45-bugfix-split`) both ship score-your-own-patch notebooks — closest available proxy for hidden-set generalization before you spend a slot.
4. **What it cannot do**: rank candidate finals. 751973 (fully open-sourced pipeline, every config + every hidden score published): “our local screen never ranked our hidden scores” — two configs tied 28/74 locally split 0.17 vs 0.10 hidden; a 9–0 local winner scored worse hidden. Use local runs to *kill* bad bundles and *validate mechanisms*; use the public LB (≥2-task margins) to pick finals.

The one number your local rig should publish every evening: **panel resolution rate (Wilson CI) + gold-pass control + per-signature-class recurrence** — the first is the headline, the second is the environment watchdog, the third is the learning curve of the scaffold itself (`06` §3).

---

*Sources: `Kaggle-01-Overview.md`, `Kaggle-02-Data.md`, `Kaggle-03-GettingStarted.md`, `Kaggle-04-OfficialRules.md` (captures 2026-09-29); `HARNESS_README.md` §2–§3, §8–§9; intel register 747519, 748287, 751104, 751487, 752017, 752128, 752220, 752239, 751973, 743964, 743063, 753973. Full list in `09-sources.md`.*


---

<!-- ====================================================================== -->
<!-- FILE: 08-troubleshooting.md -->
<!-- ====================================================================== -->

# 08 · Troubleshooting — Symptom → Cause → Fix

*Part of the RTX 5090 Local Testing Guide (2026-10-31). Organized by where the symptom appears. Each entry carries its evidence source (thread IDs / doc anchors) — full list in `09-sources.md`. OS-specific install problems are in `02` (Windows) and `03` (Zorin); this file covers the harness, serving, agent-behavior, and scoring layers.*

---

## T-01 · Agent/serving symptoms

### T-01.1 · Task hangs with zero LLM calls; server CPU-pinned at 100% of one core; later tasks all time out

**Cause:** vLLM 0.19.1 `gemma4_tool_parser._parse_gemma4_args` infinite-loops on malformed **array-typed** tool arguments (a `]` inside an element not wrapped in Gemma’s string delimiter; nested-array scanner counts brackets inside string delimiters). The loop runs on the API-server event loop; SIGTERM is ignored; the 600 s client read timeout never fires; every later task on that single shared server hangs until `max_time_minutes` (753973 / 745138 / 746336; fuzz: 74/60,000 strings hang; fix #41991 ships in v0.21.0 — the scorer runs 0.19.1).

**Fix:** (a) never emit array-typed tool args (keep argv flat strings); (b) never put source code in array args; (c) smoke-test your agent’s exact emitted call strings through `_parse_gemma4_args` in a **subprocess with a timeout** — the repro hangs whatever process runs it:

```bash
timeout 5 python -c 'from vllm.tool_parsers.gemma4_tool_parser import _parse_gemma4_array as f; print(f("a]"))'
echo "exit=$? (124 = HUNG, as expected on 0.19.1)"
```

Cross-platform guarded version (multiprocessing + join timeout) is in `05`/scratch; on Windows git-bash, Write the script to a file rather than heredoc (quoting).

### T-01.2 · edit_file / write_file calls rejected; model blindly resends the identical call

**Cause:** the gemma4 parser drops the argument after a **backtick-terminated** string (60/234 edit_file + 20/255 write_file rejections across 104 runs; 64 exact blind resends — 747519).

**Fix:** prompt rule — never end a tool-call string argument with a backtick; cap resend loops at 1 and require a *different* strategy on retry. Track `retry_chain` in the ledger (`06` §2).

### T-01.3 · Tool call silently never runs; trace shows it as reasoning; ~1% of runs

**Cause:** thought-channel drop — with `--reasoning-parser gemma4 --tool-call-parser gemma4` **non-streaming**, a tool call emitted while the thought channel is still open is returned entirely as reasoning; fixed upstream in v0.24.0 (PR #45588), scorer stays 0.19.1 (753521; uncorroborated single report, −3 votes — treat as plausible).

**Fix:** scaffold output-formatting rule — force channel open/close correctly around tool calls. Local repro: non-streaming serve + both gemma4 parsers; CPU-only MRE notebook `smartmanoj/gemma-4-toolcall-in-thought-mre` (~3 min).

### T-01.4 · Server start takes >10 min / dies at startup (locally)

**Cause:** cold-start reality — the official environment itself shows vLLM L4 starts of 514–1,677 s against a 1,200 s readiness limit (747519). Locally, first-load of 16–18 GB QAT weights + CUDA graph capture on a cold page cache is the same order.

**Fix:** `VLLM_ENGINE_READY_TIMEOUT_S=1200` (harness default), `PYTORCH_CUDA_ALLOC_CONF=expandable_segments:True`, warm the weights once (`cat` the safetensors / run one dummy completion) before timing anything; keep the server up across a whole trial session. Related sm_120 wrinkle: vLLM 0.19.1 hard-pins `flashinfer-python==0.6.6` — whether those cubins cover sm_120 was never verified, but it is non-fatal by construction: Gemma 4's heterogeneous head dims make FlashInfer reject the model anyway ("head_size not supported", #38887) and the engine falls back to TRITON_ATTN, so a FlashInfer load failure on the 5090 degrades, it doesn't block.

### T-01.5 · 12B won’t load — config/architecture errors

**Cause:** 12B’s config needs the staff override (748287).

**Fix:** `--hf-overrides '{"architectures":["Gemma4ForCausalLM"],"model_type":"gemma4"}'` (or the `VllmConfig extra_args` equivalent). Scorer already patched — local rigs must add it.

### T-01.6 · E4B edits the wrong file / overwrites whole files / drops trailing characters

**Cause:** capability floor + QAT copy-fidelity bug — E4B at 5-min: 0/31 solved, 97% patch rate but wrong file in 13/31 (750974); unmodified QAT E4B dropped trailing “s” on 15/18 copy probes (753277; claimed root cause per_layer_model_proj at ~1/65 scale uncompensated by RMSNorm).

**Fix:** run the copy-fidelity probe before any E4B panel (`michi883/copy-test-lora` notebook); prefer smaller-anchor/regex-tier edits; if pursuing the SVD rank-128 LoRA or tensor-scaling fix, note rules-permissiveness of weight modification is **unadjudicated** — ask before spending a slot on it.

## T-02 · Verification (Phase 2) symptoms

### T-02.1 · “N passed, 1 skipped” marked unresolved

**Cause:** swegemma 0.2.11 counts a skipped required test as a failure; and `node_matches_requirement` prefix-matches, so a *sibling* whose name starts with the required test’s base name (e.g. `test_traceback_finely_grained_missing` for `test_traceback_finely_grained`) counts against it (751707; rich_3486).

**Fix:** nothing agent-side fixes a graded-test skip — avoid *creating* test names that prefix-collide, and never rely on a visible passing suite (Phase 2 resets all test files and applies its own `test_patch`; the visible suite can contradict the graded one — verified on httpx_3672).

### T-02.2 · Tests requesting `anyio_backend` fixtures fail while passing in your dev shell

**Cause:** hermetic pytest runs `-p no:anyio` — 79 scorer-convention failures in the wild (all 54 starlette + 25/43 uvicorn fixes; 751707).

**Fix:** that’s the convention — reproduce locally with the same flag; scaffold validation uses inline `python3 -c` assertions or pytest with the plugin disabled, never anyio fixtures.

### T-02.3 · Every test passes but the task is unresolved

**Cause:** JUnit report > 10 MiB — the sandbox output cap truncates the XML and the task fails validation (8 python-multipart cases; 751707).

**Fix:** guard after each local episode: `find . -name "*.xml" -size +10M`; suppress verbose output in suites you touch.

### T-02.4 · Gold patches fail en masse (fastapi worst)

**Cause:** environment, not agent — public `wheels/` missing `inline_snapshot`, `dirty_equals`, `annotated_doc`, `typing_inspection`, `pytest_httpbin` (52/129 plain-notebook floor); wheelhouse dedup forces `starlette 1.6.0` onto all fastapi commits (48 tasks: `Router.__init__() got an unexpected keyword argument 'on_startup'`); pydantic 2.13.4 shipped without `typing_inspection`; 7 rich tasks need period-correct Pygments; 8 requests tasks SSL-dead on Python 3.13 (`VERIFY_X509_STRICT` × pytest-httpbin cert — IDs 6589/6592/6629/6757/7328/7433/7502/7505); 3 tasks version-gated (`fastapi_14186`, `fastapi_15745`, `rich_3486`); `rich_3472` error-string drift (743973/744370/751487/747519).

**Fix:** rebuild scorer-like sandbox from `Dockerfile.sandbox`: clean venv + pytest + competition wheels + **the five missing test packages** + period-correct pins from `gold_patch_check.csv` (751487’s artifacts: notebook “Gemma 4 Agent: Do Gold Patches Pass Locally?”, wheels + python-build-standalone 20261013 datasets, Apache-2.0). **Acceptance bar: 127/129** (the last 2 have opposite skip conditions — impossible, don’t chase). Keep those datasets out of your submission.

### T-02.5 · Your CV says 0.2, the LB says 0.05

**Cause:** the CV/LB anti-correlation is *environmental* — hidden tasks validate 100% on gold (staff 744370), so local-only grading breakage reads as “model got worse” when the bundle is fine (744319: CV 0.18/0.19/0.23/0.24 → LB 0.05/0.06/0.12/0.10).

**Fix:** run the T-02.4 control; if gold-pass < 127, fix the environment and ignore every agent conclusion from that day.

## T-03 · Budget/lifecycle symptoms

### T-03.1 · LB run ends “Notebook Timeout” at ~12 h; no score; slot burned

**Cause:** the 12 h clock covers sandbox setup + all Phase-1 work; a +5%-median per-task step locally became a hidden-set overrun (752017).

**Fix:** project 12 h from local timings × ~120 tasks + 10–15% margin; tighten the four eval_config.yaml fields (the only sanctioned per-task lever; defaults are unlimited — 743964/743063).

### T-03.2 · Multi-agent bundle: 7/8 timeouts originate in stage 1

**Cause:** one shared `EvaluationBudget` per task (swegemma `budget.py`) — later stages starve; no per-agent limits; `exit_loop` is not in the tool registry (747519).

**Fix:** sequence stages inside the single envelope; budget stage 1 conservatively in the prompt; don’t rely on loop-exit tools.

### T-03.3 · Agent runs out of turns with truncated `<|tool_call|>` tags

**Cause:** oversized tool-call payloads hitting `max_output_tokens` truncate the tag and waste the turn (why the starter pairs 16384/4096).

**Fix:** keep edit/write payloads small (multiple smaller edits); keep `thinking_budget` ≤ 4096 while `max_output_tokens` = 16384; expect a nudge (“emit your next tool call immediately…”) — a turn with any tool call resets the nudge counter.

### T-03.4 · Compaction summaries look sampled at temperature 1.0

**Cause:** they are — summary LLM requests carry no sampling fields, so vLLM falls back to Gemma 4 `generation_config.json` defaults (1.0/0.95/64); measured 4,248/4,248 summary calls across 463 local evals; same in google-adk 1.36.1 and 1.39.1 (753225).

**Fix:** none available — account for it in trace analysis (summaries are lossy/noisy by construction).

## T-04 · Rig/host symptoms

### T-04.1 · Subprocess sandbox errors immediately on Windows

**Cause:** `--sandbox subprocess` rewrites POSIX paths (`/workspace`, `/tmp`, `/wheels`, `/usr/local/bin`) and uses process groups — **POSIX-only**. Native Windows cannot run it (README §4.1).

**Fix:** WSL2 (see `02`) or Zorin (`03`) or the docker backend via Docker Desktop.

### T-04.2 · `ensurepip unavailable … creating venv without pip` warnings in subprocess mode

**Cause:** expected — the official Kaggle notebook logs the same.

**Fix:** none needed; wheels install from the local `wheels/` dir, not PyPI.

### T-04.3 · Docker image tag not found

**Cause:** README names `swebench-sandbox:latest` but ships no build command and no Dockerfile declares that tag (**OPEN** — confirmed empirically on first run).

**Fix:** build both images yourself (`04` §7); read the first-run error for the exact expected tag; `Dockerfile.public` needs `wheels/` in the build context alongside `docker/`.

### T-04.4 · Wheelhouse install breaks on nine cp312 wheels / preflight errors

**Cause:** Python/wheelhouse pin mismatch — the verified combo is **Wheelhouse V31 + Python 3.12.13** (2026-07-01 pin); the 3.13.15 pin (2026-10-03) breaks preflight (748287).

**Fix:** host harness on 3.12.13; remember the *sandbox image* is 3.13 (that divergence is by design — subprocess path = 3.12, Docker path = 3.13).

### T-04.5 · graph tools silently absent for some tasks

**Cause:** graphs/embeddings keyed by `(repo, base_commit)` — 127 pairs for 129 tasks; a subset/regenerated tasks.jsonl without matching `<repo-short>_<sha40>.json` + `.npz` drops the whole Code-Intelligence prompt section silently.

**Fix:** validate the pairing when subsetting; expect `search_similar_code` to answer only for **symbol-name** queries offline (“SSE” yes, “Server Sent Events” zero).

### T-04.6 · E4B/E2B submission returns “Submission Scoring Error: incorrect format” though the validator passed

**Cause:** unresolved scorer-side E-path flakiness around 2026-10-22/23 — bundles that scored one day failed unchanged the next; identical 31B packages scored fine (752128; staff unanswered).

**Fix:** confirm on the board that E-path submissions are scoring end-to-end *that day* before spending a slot; hold the non-LoRA E-series fallback; report refs rather than debugging a validator-passing bundle.

### T-04.7 · LoRA adapter fine locally, feared on scorer

**Cause:** unresolved compatibility — vLLM 0.19.x Gemma-4 LoRA errors (issue #40693; fix PR #39291, scorer inclusion unknown — 752239) and scorer-PEFT-vs-`Gemma4ClippableLinear` report (753388, unverified).

**Fix:** canary gates C1–C3 locally (`06` §5); hold a bare-base E-series final slot until staff answers; train adapters against the **unquantized** variant and serve over QAT (staff guidance; PEFT cannot attach to the `-ct` checkpoint at all — 750713 trained on a dequantized bf16 copy). **Silent-adapter-detach check (firsthand, 750713):** an `agent.yaml` that fails to reference the adapter (or names a missing `adapters/<name>/` directory) makes the whole run measure the **base model** — and vLLM `/metrics` labels every request with the *base* model name, so only the **traces** prove attachment. Grep `traces/trace_*.json` for the adapter name before believing any adapter A/B.

### T-04.8 · Historical nulls you should not replicate

Wipe bug → fixed v23+; KV-cache hang → fixed v28 (residual 0.76×); the shipped sample adapter is a **layer-0 stub** (r=4, q_proj+o_proj, layer 0 only) that confounds adapter A/Bs (staff 749528) — never use it as a LoRA baseline; ParallelAgent + tool calls broken on pinned ADK v1.36 (upstream 7324; workaround = tool-free sub-agents; ADK v2 migration refused as too risky).

---

*Evidence anchors: intel register 743973, 744370, 744319, 745138, 746336, 747519, 748287, 749528, 750974, 751487, 751707, 752017, 752128, 752239, 753225, 753277, 753388, 753521, 753973; `HARNESS_README.md` §4–§8; `03-bcf-simulation-httpx-3672`. Full list in `09-sources.md`.*


---

<!-- ====================================================================== -->
<!-- FILE: 09-sources.md -->
<!-- ====================================================================== -->

# 09 · Sources and Confidence Register

*Part of the RTX 5090 Local Testing Guide (2026-10-31). Every factual claim in files `01`–`08` traces to something in this list. Confidence tags: **[V]** verified firsthand this run (page fetched, file read, wheel inspected) · **[R]** reported by a primary-ish source, not independently re-derived · **[I]** inferred/computed by us from verified inputs · **[U]** unresolved (contradictory or single-source; flagged where it's load-bearing).*

## A. Local firsthand artifacts (highest confidence)

| Artifact | What it grounds | Tag |
|---|---|---|
| `input/kagglecomp/intel_20261031/` (6 files) | competition intel brief + discussion-thread register (thread IDs cited throughout as `74xxxx`/`75xxxx`) | [V] |
| Data package `gemma-4-developer-agent.zip` (21.9 GB) — `tasks.jsonl`, `snapshots/`, `graphs/`, `embeddings/`, `wheels/`, `docker/`, `sandbox/`, sample submission | on-disk layout (`04` §2), 129 tasks, 127 graph pairs, wheelhouse contents, Dockerfiles | [V] |
| `HARNESS_README.md` (in package) §2–§9 | CLI contract, model registry, submission contract, limits, lifecycle, tool limits | [V] — with known stale spots flagged (`07` §3.6) |
| swegemma source (`config.py` incl. `MAX_SUBMISSION_SIZE_BYTES`/`ALLOWED_SUBMISSION_EXTENSIONS`/`build_submission_limits()`, `budget.py`, tool registry, parsers) | §9 limits, budget semantics | [V] |
| Kaggle page captures 2026-09-29 — `Kaggle-01-Overview.md` … `Kaggle-04-OfficialRules.md` (`input/kagglecomp/docs/markdown/`) | timeline, cadence (Rules §2.2.a), prizes, licensing, data description, getting-started notebook flow | [V] (captured; freshness caveats noted in `07` §1) |
| Wheelhouse v31 (41 wheels incl. patched vLLM 0.19.1) | install dance (`04` §1), Python 3.12.13 pin | [V] |

## B. Discussion-thread register (competition forum; via intel package)

Cited by thread ID throughout `04`–`08`. Dates = thread/decision dates where known: 743063, 743964 (eval_config fields), 744319, 744370 (hidden-set gold validation), 745138, 746336, 747519 (ops: queue delays, 2026-10-09 incident, pending limit, backtick drop, cold starts), 748287 (4 QAT variants 2026-10-11; wheelhouse V31 + 3.12.13 combo; 12B `--hf-overrides`), 749528 (sample adapter is a layer-0 stub), 750974 (E4B 5-min probe), 751104 (bonus = final slot; alias warning), 751487 (gold-patch repair chain + datasets), 751707 (scorer conventions: skip-counted-fail, anyio, JUnit 10 MiB), 751973 (open-sourced pipeline; local-screen-vs-hidden divergence), 752017 (12 h overrun), 752128 (E-path format errors), 752220 (private = better of two finals), 752239 (LoRA scorer compatibility), 753225 (compaction sampled at 1.0), 753277 (E4B copy-fidelity probe), 753388 (PEFT/ClippableLinear report, unverified), 753521 (thought-channel drop), 753524, 753973 (array-arg hang; three frozen tasks). All [R] as stated by participants/staff; staff posts marked in the intel brief are treated as authoritative for rules.

## C. Software documentation (fetched 2026-10-31 unless dated)

| Source | Grounds | Tag |
|---|---|---|
| docs.vllm.ai installation/gpu (v0.19.1 + stable) | no-native-Windows, cu12.8 floor for Blackwell, R580 for cu13, wheel shape `cp38-abi3-manylinux`, Python 3.11–3.14, `download-kernels`, GCC≥13 | [V] |
| pypi.org/pypi/vllm/0.19.1/json + release tag v0.19.1 (2026-04-18) | wheel sha256 `c8dde3c9…`, size 433,132,101 B, pins (torch 2.10.0 / torchaudio 2.10.0 / torchvision 0.25.0 / flashinfer 0.6.6 ×2 / numba 0.61.2 / compressed-tensors 0.15.0.1 / transformers ≥4.56,≠5.0–5.4,≠5.5.0→5.5.3), `requires_python <3.14,≥3.10` | [V] |
| vLLM issues/PRs: #18995, PR #19794 (sm_120 support history); #38887 (heterogeneous head dims → TRITON_ATTN, 9.2 tok/s 4090, ~130 tok/s patched 5090, PRs #38891/#38879); #40693 + PR #39291 (Gemma-4 LoRA); #43562 (nvfp4 KV crash sm_120); #27337 (int8 sm≥10.0); #41991 (array-arg parser fix → v0.21.0); PR #45588 (thought-channel fix → v0.24.0) | `01` §1/§8, `08` T-01 | [V]/[R] per issue |
| NVIDIA: CUDA 12.8 release notes (SM_120 compiler); CUDA-on-WSL user guide (driver-only rule); driver listings 621.01 WHQL Win (2026-10-21) / 580.196.07 apt / 595.99.02 `.run` | driver floors, WSL rules | [V] |
| Microsoft Learn: `.wslconfig` (2026-10-16), WSL filesystems performance (2026-06-02) | WSL VM sizing, 9P-vs-ext4 | [V] |
| docs.docker.com: Desktop GPU, engine/install/ubuntu; NVIDIA container-toolkit guide | `02` Route B, `03` §3 | [V] |
| download.pytorch.org/whl/cu128 (+cu130) indexes | torch 2.10.0/2.11.0+cu128 manylinux **and** win_amd64 cp312 wheels exist | [V] |
| docs.kernel.org ntfs3; Zorin blog (18.0 2025-10-14, 18.1 2026-04-15, kernel 6.17) | `03` §5, Zorin-18 = noble base | [V]/[R] |
| Hugging Face: `google/gemma-4-{31B,12B,E4B,E2B}-it-qat-w4a16-ct` trees + `config.json` (sizes 23.3/10.3/11.5/8.32 GB; layer/head/window/mpe configs; 12B config.json bug + fix); transformers gemma4 docs (PLE mechanics, `use_clipped_linears` scope, transformers 5.22.1 classes, E-series `transformers_version 5.8.0.dev0`) | `01` §2 tables, `06` §5 | [V] |
| ai.google.dev/gemma/docs/core | official memory table (BF16/SFP8/Q4_0 + 20%), QAT ecosystem (server/GGUF/spec-decode/mobile + same-precision drafter rule), E-series effective params, 128K/256K windows, audio-native list | [V] |

## D. Community benchmarks and tools

| Source | Grounds | Tag |
|---|---|---|
| club-3090 (noonghunna) `docs/FAQ.md` + `docs/DTYPE_MATRIX.md` | @apnar 31B 5090 rows (159.67/215.10 TPS — semantics undefined, upper bounds), sm_120 dtype matrix (Marlin ok / Machete Hopper / NVFP4-KV crash / int8 broken / DeepGEMM caveat / SymmMem→PYNCCL), spec-decode crash class #50021 | [R] |
| unsloth #4985 (5090 stack) + measured VRAM: E4B QLoRA 10.88 GB, 31B QLoRA 25.47 GB; `UNSLOTH_RETURN_LOGITS=0` leak fix; FA2 blocked (head_dim 512>256) | `01` §4, `06` §5 | [R] (multiple concordant reports) |
| scottweeden Kaggle dataset "Gemma 4 Developer Agent Tool-Use LoRA Kit" (~2026-10-25) | independent confirmation of vLLM 0.19.1 / 4×L4 runtime; kit baseline | [R] |
| Kaggle notebooks: `michi883/copy-test-lora` (E4B copy-fidelity probe), gold-patch-check notebook + `gold_patch_check.csv` (751487 artifacts: wheels + python-build-standalone 20261013 datasets, Apache-2.0) | `08` T-01.6, T-02.4; acceptance bar 127/129 | [R] |
| Datasets: `moshegolderson/freshswe-py` (663 tasks), `rodrigospalma/ood45-bugfix-split`, SWE-Zero 318k / SWE-Gym 2,438 / SWE-smith 26k trajectories | `05` §4, `06` §5 training data | [R] |
| xbill9/gemma-4-31B-it-qat-q4_0-w4a16-ct repack (19.04 GiB, "not yet served or evaluated") | noted, not recommended | [R] |

## E. Unresolved / flagged (do not build on these without re-checking)

1. **Whether the scorer's patched vLLM includes PR #38891** (per-layer attention backend) — swings local tok/s by >10× on affected cards and determines local-vs-Kaggle timing parity (`01` §1). Mitigation used in this guide: prefer wheelhouse wheel; benchmark 1 task vs a Kaggle run.
2. **Exact CUDA variant of the competition 0.19.1 wheel (cu128 vs cu129)** — both statements exist in v0.19.1-era docs. The wheel filename suffix in the wheelhouse answers this on inspection (`04` §1 rename step).
3. **E4B/E2B `num_global_key_value_heads`** absent from config extraction → E-series KV figures are upper bounds (`01` §2).
4. **E-path scorer flakiness** (752128): validator-passing E-series bundles intermittently failing "incorrect format" — check the board same-day before spending a slot (`07` §4, `08` T-04.6).
5. **LoRA-on-scorer compatibility** (752239/753388, PEFT-vs-ClippableLinear unverified; PR #39291 inclusion unknown) — hence canary gates C1–C3 and the bare-base fallback final (`06` §5).
6. **Thought-channel drop** (753521) — single report, −3 votes; treated as plausible, cheap to defend against.
7. **club-3090 TPS metric semantics** — undefined on page; all such numbers marked upper bounds.
8. **Kaggle submit-dialog specifics** not present in the 2026-09-29 captures — CLI covers prep; the exact dialog flow is from the getting-started notebook shape (`07` §4).
9. **Wheel-vs-git delivery of Kaggle's vLLM patch** is unpublished; the wheelhouse wheel is the closest artifact.
10. **Rules-capture staleness**: the Sept-29 Overview says "only 31B at present" — superseded by staff 748287 (4 QAT variants, 2026-10-11). Where captures and newer staff posts conflict, this guide follows the staff post and says so.
11. **Marlin W4A16-g32 on sm_120** is validated for AutoRound/AWQ/GPTQ (club-3090) but no source names compressed-tensors + gemma4 explicitly — if the first 31B serve fails in a Marlin kernel, this is the suspect.
12. **flashinfer-python 0.6.6 sm_120 cubin coverage** unverified — non-fatal by construction (Gemma 4 falls back to TRITON_ATTN regardless), noted in `08` T-01.4.
13. **bf16-LoRA-on-E4B VRAM (~22–26 GB)** and **31B+adapter serving headroom** are computed, not measured (`01` §4). The QLoRA numbers (10.88 / 25.47 GB) are measured.
14. **Critic cross-check note**: threads 750713 and 751596 were flagged "not locatable" by an independent verification pass without intel-package access; both are in fact FULL-text digested in the intel brief (lines 118 and 104 of `00-intel-brief-2026-10-31.md`) — the citations in `05`/`06` are intel-anchored and stand.

## F. Provenance method

Eight parallel research angles (hardware/Blackwell, LoRA, harness internals, scoring mechanics, competition site, Windows, Zorin, BCF-improvement) ran as schema-bound subagents on 2026-10-31 with web access; each claim carried source URL + date + verified/reported/inferred tag. Claims were then cross-checked against the local intel package and data package before entering these files; corrections found during verification (submission cadence, variant list) are recorded in the intel-brief terms above. Angle dumps preserved in `scratch/2026-10-31-local-testing/` (FACTS-local.md, angles-*.md).

