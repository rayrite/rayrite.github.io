# BCF Brain v2: Wall-Clock Bottlenecks, Tuning Levers & Fast Iteration Playbook

**Date:** 2026-11-14  
**Scope:** Current shipped BCF (Batonic Coding Framework) v2 brains ([02-bcf-brain-31b-v2](../../cvx/kaggle3/2026-11-11-bcf-gemma4-brain/02-bcf-brain-31b-v2/submission) and [03-bcf-brain-e4b-v2](../../cvx/kaggle3/2026-11-11-bcf-gemma4-brain/03-bcf-brain-e4b-v2/submission), `BCF_VERSION = "2.0.0"`), evaluated across the **local RTX 5090 test harness** and **remote Kaggle 4x L4 evaluation pipeline**.

---

## Executive Synthesis

1. **Task 1 — Where Wall-Clock Time Goes (Local RTX 5090 vs. Remote Kaggle 4x L4):**
   - **Remote Kaggle throughput is queue- and cliff-bound.** Live competition state (captured 2026-11-14) shows **36–80+ h queue stalls**, a **1 submission/day** and **1-pending-at-a-time** cap, **paused rescores** (since Sep 28), and a hard **12 h runtime ceiling** across ~120–129 sequential tasks where exceeding 12 h risks an all-or-zero score. At shipped 31B caps (`max_time_minutes: 4.5`) plus `~12.6 min` TP4 vLLM startup and `~30–60 s/task` container bootstrap (`G only` outside the agent timer, inside 12 h), a worst-case 129-task tail pushes to **12.04–13.11 h**, making budget-cap headroom (`Y4`) and pre-submit runtime extrapolation load-bearing.
   - **Local RTX 5090 iteration is startup-, I/O-, decode-, and KV-shape-bound.** On one 32 GB RTX 5090 (`sm_120`, 1,792 GB/s GDDR7), raw memory-bandwidth decode should run ~1.5–2.3x faster than 4x L4 TP4 (`300 GB/s × 4 = 1,200 GB/s` aggregate over PCIe Gen4), **unless** two local failure modes intervene: (a) WSL2 `/mnt/*` 9p small-file amplification (`3–10x` snapshot extract slowdown), WSL2 `< 2.7.0` CUDA-graph failures (`--enforce-eager` at ~8x throughput cost), or WDDM Sysmem Fallback across PCIe; and (b) vLLM `0.19.1` uniform KV allocation (`vllm#39133` pattern) turning Gemma 4 31B's theoretical `~2.0–3.3 GiB` hybrid SWA-1024 + GQA-4 cache at 32k context into `~30.0 GiB` bf16 uniform allocation (`~10.9k` max tokens locally). Meanwhile, **prefill compute is slower locally** (`209.5` Tensor TFLOPS dense FP32-acc on RTX 5090 vs. `484` TFLOPS aggregate dense on 4x L4), so compaction and full-context prefill spikes shrink less locally than decode does.

2. **Task 2 — Shipped BCF Brain v2 Status & Highest-ROI Tuning Levers:**
   - **Crucial baseline delta:** Shipped v2 (`bcf.py v2.0.0`) already implemented several A1–A10 upgrades (`expected-red`, `closure`, `rename`, `_import_audit`, `_smoke`, `no-signal`, `-rf` pytest tail, and producer grep), while **diverging sharply from an unshipped conceptual 2026-11-14 blueprint** (`90s/24/5.5m` + `sampling_plan.yaml` + `bcf.py read/patch` are **not** in the shipped ZIPs; shipped `eval_config.yaml` sets `180s/50/4.5m/50` for 31B and `150s/40/4.0m/40` for E4B).
   - **Immediate v2 bugfixes & Rank #1–#5 levers:** Shipped v2 introduced a **disk-corruption rollback bug in `cmd_rename`** (`atomic_write` at line 2176 executes before `compile()` at line 2178 and before `originals[rel]` backup at line 2185), keeps a shared `thinking_budget: 2048` on `bcf_plan` (`!include ../configs/sampling.yaml` -> 10–30s planning waste), covers only **5 of 10 families** in `_family_lines`, omits inner edit line numbers in `render_spec` `Target`, checks strikes by single target line rather than `MAX_WINDOW = 7` span in `gen_anchors`, runs unguarded directory walks in `discover_tests` / `_scan_symbol` / `detect_rename`, and pairs `temperature: 0.0` + `thinking_budget: 0` + `include_thoughts: true` on E4B despite zero empirical resolve measurement on this scaffold.

3. **Task 3 — Fast Feedback Loops Around Every Bottleneck:**
   - Replace brute-force 3.5–5.5 h GPU sweeps with a gated **5-rung ladder (`L0 → L1 → L2 → L3 → L4`)**: **L0 CPU-only** (~seconds–1 h: `C0` official `compile_submission` check, `C1` AST/regex accuracy + 3,000-file latency guard, `C3` >=5,000-payload parser-freeze fuzzer, edit-call replay funnel, `locbench` full-snapshot context probe, gold/empty masked-68 audit); **L1 single-warm-server C2/C5 drills** (~2–3 min/task, amortizing vLLM's 4–9 min cold start once per session); **L2 paired 30-task dev sweeps** (~2.3 h/repeat, win-both + exact McNemar `p <= 0.05` + noise floor `>= 3`); **L3 overnight sharded 68×2 + OOD-45 confirmation** (`<= 11.0 h` remote extrapolation gate); and **L4 slot-defensive Kaggle submission** (pre-registration ledger, early-day submit, `SECONDS/M-tokens` calibration).

---

## Deliverable Suite Map

| Document | Task | Primary Focus | Target Audience Decision |
| --- | --- | --- | --- |
| [README.md](README.md) | Index | Executive synthesis, shipped v2 vs. doc delta, evidence standards | Overall prioritization & navigation |
| [01-wall-clock-bottlenecks-local-vs-kaggle.md](01-wall-clock-bottlenecks-local-vs-kaggle.md) | Task 1 | Chronological process map (RTX 5090 vs. 4x L4), KV/hardware physics, Pareto ranking | Eliminate hardware, I/O, startup, and 12 h timeout risk |
| [02-bcf-v2-tuning-levers-and-impact-effort.md](02-bcf-v2-tuning-levers-and-impact-effort.md) | Task 2 | Complete v2 juncture map, newly audited v2 bugs, 32-lever Impact-Effort rank, Do-NOT-Tune | Choose the next commit cleanly without breaking invariants |
| [03-fast-iteration-and-feedback-strategy.md](03-fast-iteration-and-feedback-strategy.md) | Task 3 | L0–L4 ladder, CPU proxies, warm-batch protocol, statistical gating, Kaggle slot ops | Run 5–10x more validated experiments before Dec 2 |

---

## Baseline Reconciliation: Shipped v2 vs. Project Documents

Several markdown files across `cvx/kaggle3/` describe slightly different snapshots (`v1` from Nov 11, an unshipped `v6`/conceptual Nov 14 architecture, and shipped `v2`). All tuning and bottleneck recommendations in this suite target **strictly the shipped `v2` submission artifacts**:

| Artifact / Parameter | Nov 14 Conceptual Blueprint (`2026-11-14_BCF...`) | Shipped `02-bcf-brain-31b-v2` | Shipped `03-bcf-brain-e4b-v2` |
| --- | --- | --- | --- |
| `eval_config.yaml` caps | `90s` / `24` calls / `5.5m` (31B); `90s` / `20` / `4.5m` (E4B) | `180s` / `50` calls / `4.5m` / `50` turns | `150s` / `40` calls / `4.0m` / `40` turns |
| `bcf_plan` sampling config | Separate `sampling_plan.yaml` (`thinking_budget: 0/256`) | Shares `../configs/sampling.yaml` (`budget: 2048`, `temp: 0.2`) | Shares `../configs/sampling.yaml` (`budget: 0`, `temp: 0.0`) |
| `configs/sampling.yaml` `max_output_tokens` | Track-tuned split | `6144` (`include_thoughts: true`, `seed: 7`) | `4096` (`include_thoughts: true`, `seed: 7`) |
| `bcf.py` subcommands | Adds `read`, `patch` | 10 cmds (`spec`, `anchors`, `apply`, `locate`, `strike`, `expected-red`, `closure`, `rename`, `check`, `state`) | Identical bytes (`BCF_VERSION = "2.0.0"`) |
| `prompts/solver.md` size & editor | Consolidated draft | 59 lines; `edit_file` primary (`apply` after 2 fails) | 110 lines; `apply` primary (`<<'BCF_EOF'`), `"Plan: ..."` prefix |
| `prompts/bcf_plan.md` size & format | Plan-only | 36 lines; zero-arg `run_skill_script` -> `problem.md` (~1,500 chars) -> `spec` | 50 lines; adds `"Plan: ..."` prefix bound to first tool call |

---

## Evidence Classification & Official Sources Ledger

Every claim across these deliverables uses explicit provenance tags so hardware physics, official vendor behavior, shipped code inspection, and modeling estimates remain cleanly separated:

| Tag | Meaning | Examples in This Suite |
| --- | --- | --- |
| `[OFFICIAL DOCS]` | Verified directly via official vendor documentation, Hugging Face `config.json`, or upstream issue trackers during 2026-11-14 research | RTX 5090 `1,792 GB/s` & `209.5` dense Tensor TFLOPS (Blackwell whitepaper); L4 `300 GB/s` & `121` TFLOPS; WSL2 `9p` vs `ext4`; `vllm#39133`/`#44715`; ADK `ContextCacheConfig` Gemini-only |
| `[LOCAL SHIPPED (v2)]` | Observed directly in `02-bcf-brain-31b-v2`, `03-bcf-brain-e4b-v2`, `bcf.py v2.0.0`, and `install.py` | `eval_config.yaml`, `sampling.yaml`, `cmd_rename` lines 2176–2185 rollback ordering, `_family_lines` 5/10 coverage, `STDOUT_CAP = 4800` |
| `[LOCAL MEASURED]` | Empirically measured on CPU or competition telemetry recorded in prior session artifacts | Spec p50 `0.219 s`, p95 `0.266 s`, 3,002-file repo `1.063 s` cold / `0.172 s` warm; hit@3 `96.9%`; 129 snapshots `21.50 GB` (`214 MB` median) |
| `[COMPETITION INTEL]` | Captured Kaggle forum/leaderboard telemetry from `00-bcf-scoring-parity-explainer.md` (live-checked 2026-11-14) & hardening audits | 80+ h queue stalls; 12.6 min 4x L4 startup; 33–35 tok/s 31B decode; 5 empty-pass + ~27 missing-lib tasks -> ~68 masked valid; public `58` tasks (`1 task = 0.017`) |
| `[ESTIMATE]` | Engineering derivation or planning range requiring local Probe M1–M15 confirmation | RTX 5090 decode `50–80 tok/s`; WSL2 Desktop VM `docker exec` hop `+0.1–0.5 s`; local cold vLLM `4–9 min`; `ext4` snapshot unpack `2–5 s` |

### Primary Official & Upstream References

| Domain | Resource / Topic | Key Grounded Fact Used |
| --- | --- | --- |
| NVIDIA (`nvidia.com`) | GeForce RTX 5090 Specs & RTX Blackwell Whitepaper (`GB202`, `sm_120`) | 32 GB GDDR7, 512-bit bus, `1,792 GB/s`, `209.5` TFLOPS FP16/BF16 Tensor dense (FP32 acc) |
| NVIDIA (`nvidia.com`) | NVIDIA L4 Tensor Core Datasheet | 24 GB GDDR6, `300 GB/s`, `121` TFLOPS dense / `242` sparse, PCIe Gen4 x16 (`64 GB/s`), 72W |
| NVIDIA (`docs.nvidia.com`) | Open Linux GPU Kernel Modules & CUDA on WSL User Guide | Blackwell requires `nvidia-open` + GSP; WSL uses `/dev/dxg`; never install Linux driver inside WSL; Sysmem Fallback policy (`Driver 536.40+`) |
| Microsoft (`learn.microsoft.com` / `github.com/microsoft/WSL`) | WSL2 Filesystem Performance & Blackwell WSL2 Issues (`WSL#40401`, `WSL#40732`, `WSL#11050`) | `ext4.vhdx` native Linux vs `/mnt/*` `9p`/`drvfs`; WSL `>= 2.7.0` unblocks RTX 5090 CUDA graphs (`~8x` vs `--enforce-eager`); `WSL#11050` sysmem policy not honored inside WSL2 |
| Docker (`docs.docker.com`) & NCT | Docker Desktop WSL2 GPU & NVIDIA Container Toolkit `config.toml` | Docker Desktop `>= 4.31.1` for WSL2 GPU; `--gpus all` (no CDI spec in Desktop); Engine inside WSL requires `no-cgroups = true` |
| vLLM (`docs.vllm.ai` / `github.com/vllm-project/vllm`) | Gemma 4 Parsers, SWA Hybrid KV (`#39133`), Tool Parser (`#44715`), LoRA & Prefix Caching | `--tool-call-parser gemma4`, `--reasoning-parser gemma4`, `--kv-cache-dtype fp8`, `--quantization compressed-tensors`, `--enable-prefix-caching`; `VLLM_MEMORY_PROFILER_ESTIMATE_CUDAGRAPHS`; LoRA slot preallocation; SWA uniform-allocation bug & `_parse_gemma4_args` sentinel bug |
| Google / Hugging Face (`ai.google.dev` / `huggingface.co/google`) | Gemma 4 Architecture (`31B` & `E4B`) & Model Cards | 31B: 60 layers (50 local `sliding_window=1024` w/ 16 KV heads `head_dim=256`; 10 global w/ `num_global_key_value_heads=4`, `global_head_dim=512`, `attention_k_eq_v=true`). E4B: 42 layers, `sliding_window=512`, `num_kv_shared_layers=18`, Per-Layer Embeddings |
| PyTorch (`pytorch.org`) | PyTorch 2.7–2.10 Release Notes | CUDA `12.8+` (`cu128`) required for Blackwell `sm_120` kernels |
| Google ADK (`google.github.io/adk-docs` / `github.com/google/adk-python`) | `SequentialAgent`, `include_contents`, `EventsCompactionConfig`, `ContextCacheConfig`, `SkillToolset` | `include_contents="none"` drops upstream history; `EventsCompactionConfig` (`token_threshold`, `event_retention_size`, `LlmEventSummarizer`); `ContextCacheConfig` is Gemini API-only; `run_skill_script` |
| Kaggle (`kaggle.com/docs`) | Kaggle Notebooks & Code Competitions Docs | 12 h max GPU/CPU session limit, offline competition environment, pending-submission queue locks |
| Python 3.13 & pytest (`docs.python.org/3.13`, `docs.pytest.org`) | Sandbox Runtime & Test Runner Flags | Python 3.13 removes `telnetlib`/`imp` (3.12); `PYTHONSAFEPATH` / `PYTHONNOUSERSITE` isolate imports; `pytest -p no:anyio -x --tb=line --junitxml` |
