# Task 1: Wall-Clock Time Bottlenecks — Local Test Harness (RTX 5090) vs. Remote Kaggle (4x L4)

**Baseline:** Shipped BCF Brain v2 (`02-bcf-brain-31b-v2` and `03-bcf-brain-e4b-v2`, `BCF_VERSION = "2.0.0"`) under the competition harness (`vLLM 0.19.1`, `swegemma 0.2.11`, `adk-submission 0.2.13`, `google-adk 1.36.1`, `python:3.13-slim` sandbox).

---

## 1. Accounting Model: The Three Wall-Clock Buckets

Optimizing the wrong timer is a major source of wasted engineering effort and 12-hour Kaggle timeouts. Every millisecond in both environments sits inside one of three strict accounting buckets:

| Budget Bucket | What Enforces It | Local RTX 5090 (`swegemma eval`) | Remote Kaggle (`submission.zip` on 4x L4) |
| --- | --- | --- | --- |
| **`OUT`** (External / Infra) | Queue scheduler, operator terminal, post-batch scoring | Setup scripts, manual warm server launch, separate Phase 2 verification runs (`--skip-agent-patch` or CPU replay) | **Queue wait (36–80+ h)**, 1/day + 1-pending gate, compile rejection checks, manual ledger analysis |
| **`G only`** (Global Clock Only) | Overall session wall clock (`12 h = 720 min` on Kaggle); **outside** the agent's per-task `max_time_minutes` | Cold vLLM startup (`4–9 min` if auto-started), per-task Container A/B unpack & editable install, git baseline commit, Phase 2 pytest (`python:3.13-slim`) | **vLLM TP4 startup (`~12.6 min`)**, 120–129× Container A/B bootstrap (`~30–60 s/task`), git baseline, Phase 2 pytest (`~0.5 min/task`, status vs 12 h boundary unconfirmed by staff) |
| **`T+G`** (Task Agent Timer + Global Clock) | Agent `max_time_minutes` (`4.5 m` 31B / `4.0 m` E4B) **AND** global 12 h clock | All LLM turns inside `bcf_plan` + `solver`, ADK compaction calls, `run_command` / `bcf.py` calls, container `pytest` verification (`timeout_seconds: 180` / `150`), nudge restarts | Same inside Kaggle's single-task container, but at **4x L4 TP4 decode (`33–35 tok/s`)** instead of RTX 5090 TP1 (`~50–80 tok/s`) |

> **Critical Insight:** Because `G only` sits outside `max_time_minutes` yet inside Kaggle's **12-hour session cliff** (`[OFFICIAL DOCS]`), shrinking `max_time_minutes` without measuring and bounding container bootstrap leaves **~1.0–2.2 hours** of unguarded fixed overhead untouched (`60 s × 129 tasks = 129 min` + `12.6 min` startup = **2.36 h** before a single token is generated).

---

## 2. End-to-End Chronological Bottleneck Map

The table below traces an evaluation run chronologically from environment preparation through final score, pinpointing **where** each bottleneck occurs, its bucket, its duration on **RTX 5090 (local)** vs. **4x L4 (Kaggle)**, and its physical root cause.

| Stage | Process Location & Mechanism | Bucket | Local RTX 5090 | Remote Kaggle (4x L4 TP4) | Root Cause & Grounding |
| --- | --- | --- | --- | --- | --- |
| **0. Pre-Run Infra** | Windows WSL2 9p mount (`/mnt/d` vs `ext4.vhdx`) & Docker backend choice | `OUT` / `G only` | **10–30 s/task** if `/mnt/d` vs **2–5 s/task** on `ext4` (`[ESTIMATE]`) | Native Linux overlay (N/A) | Plan 9 (`9p`/`drvfs`) adds ~1–5 ms per metadata syscall over ~3k repo files (`[OFFICIAL DOCS]` Microsoft WSL2 docs) |
| **0. Driver / WSL** | Blackwell `sm_120` init: WSL `<2.7.0`, `WSL#40401`, Sysmem Fallback (`WSL#11050`) | `OUT` / fatal slow | **~8x slower decode** (`--enforce-eager`) or **10–30x** PCIe RAM spill | Native Linux datacenter L4 drivers | RTX 5090 needs `nvidia-open` + GSP (`[OFFICIAL DOCS]`); WSL `<2.7.0` breaks CUDA graphs; WDDM sysmem policy ignored inside WSL2 (`[OFFICIAL DOCS]` / `WSL#11050`) |
| **1. Submission Queue** | `kaggle competitions submit` scheduler & hardware pool contention | `OUT` | **0 s** (immediate local) | **36–80+ h wait** + 1/day + 1-pending lock (`[COMPETITION INTEL]`) | L4x4 pool saturation, no cancel button, Rescore paused since Sep 28 (`[COMPETITION INTEL]`, `[OFFICIAL DOCS]`) |
| **2. Compiler Gate** | `compile_submission` zip validation (`agent.yaml` root, allowed exts, `<3 GiB`) | `OUT` / fast fail | `< 5 s` CPU (`C0` canary) | Fails queue run silently or fast error | Nested `submission/` prefix, pickle weights, or missing skill root fails bundle (`[LOCAL MEASURED]`) |
| **3. vLLM Cold Start** | Weight read (`~17 GB` W4A16 ct), KV memory profiler (`profile_run`), CUDA graph capture, LoRA pool alloc | `G only` | **4–9 min** cold (`[ESTIMATE]`); **0 s** if kept warm | **~12.6 min** (`[COMPETITION INTEL]`) | `cudaGraph` capture + `profile_run` (`--max-model-len 32768`) + `--enable-lora --max-loras 8 --max-lora-rank 128` buffers + TP4 all-reduce sync (`[OFFICIAL DOCS]`) |
| **4. Task Bootstrap** | Container A/B setup: `214 MB` median `.tgz` unpack (3k files), `wheels/*` install, `pip --no-deps --no-build-isolation -e .`, `.pth` injection, baseline `git commit` | `G only` | **10–27 s** native/ext4; **20–60 s+** over `/mnt/d` (`[ESTIMATE]`) | **~30–60 s/task** (`[COMPETITION INTEL]`) | Sequential Python imports inside container, 3k-file extraction (`gzip` vs `pigz`), editable build backend load (`setuptools`/`pdm`), `git` initial index |
| **5. Task 1st Turn (`bcf_plan`)** | Step 0–3: cold spec (`0.22–1.06 s`), **shared `thinking_budget: 2048` on 31B**, ~1,500-char `problem.md` echo | `T+G` | **~12–30 s/task** (`[ESTIMATE]`) | **~20–45 s/task** (`[ESTIMATE]`) | `bcf_plan.yaml` uses `!include ../configs/sampling.yaml` (`thinking_budget: 2048`) despite purely mechanical 3-step install+run (`[LOCAL SHIPPED (v2)]`) |
| **6. LLM Decode Loop** | Multi-turn token generation (~76% of active agent wall time): thoughts + tool args + prose | `T+G` | **~50–80 tok/s** (31B TP1, `[ESTIMATE]`); E4B much faster | **33–35 tok/s** (31B TP4, `[COMPETITION INTEL]`) | Memory-bandwidth bound: 1,792 GB/s single-GPU GDDR7 (no PCIe all-reduce) vs 4×300 GB/s PCIe Gen4 L4 TP4 (`[OFFICIAL DOCS]`) |
| **7. Large Prefill Spikes** | Multi-turn accumulated history + initial 6k–14k context evaluation | `T+G` | **209.5 TFLOPS** dense Tensor FP32-acc (`[OFFICIAL DOCS]`) | **484 TFLOPS** aggregate dense Tensor (`[OFFICIAL DOCS]`) | Prefill is compute-bound: 4x L4 has **~2.31x** higher dense Tensor FLOPS, so prefill spikes shrink less locally (`[OFFICIAL DOCS]`) |
| **8. ADK Compaction** | `EventsCompactionConfig` trigger at `14,336` tokens (`LlmEventSummarizer`) | `T+G` | **8–25 s/event** (`[ESTIMATE]`) | **15–40 s/event** (`[COMPETITION INTEL]` 9.2/eval) | Summarizer prefills ~14k tokens + decodes summary (`temp 1.0`) and drops/flattens non-text tool payloads, triggering re-orientation reads |
| **9. Tool Parse & Exec** | `--tool-call-parser gemma4`, Docker `exec` VM hop, `edit_file` vs `bcf.py` runs | `T+G` | `+0.1–0.5 s/call` Desktop VM hop (`2–12 s/task`); rare `10 s` pipe stall | Bare container `exec`; **fatal hang** on list-typed tool args | `read_stdin_bounded(timeout=10.0)` stalls 10 s on idle open pipes; `gemma4_tool_parser` array-arg infinite loop freezes entire vLLM server (`[COMPETITION INTEL]`, `[OFFICIAL DOCS]`) |
| **10. Retry / Truncation** | `finish_reason=MAX_TOKENS` (6,144 tok cap), repeated failed `edit_file` calls, continuation nudges (max 3) | `T+G` | Up to **~90–120 s** wasted | Up to **~186 s** (`6144 / 33 tok/s`) + **10–30 s** restart tax | Model loops emitted patch or hits truncation without calling tool; nudge wakes `bcf_root` -> re-enters `bcf_plan` (`thinking_budget: 2048` repeats) |
| **11. Unguarded `bcf.py` Scans** | `discover_tests`, `detect_rename`, `scan_expected_red`, `_scan_symbol` on large private repos | `T+G` | `< 1.1 s` on selective repo; **unbounded** on 3k+ file repos | **Up to timeout (`180 s`)** on huge monorepos | `cmd_spec` enforces `17 s` in `build_index`, but `discover_tests` and rename helpers walk visible test trees with **no deadline/file cap** (`[LOCAL SHIPPED (v2)]`) |
| **12. Verify `pytest`** | Targeted `timeout 60 python3 -m pytest` + `repro_seed.py` `_smoke` (`timeout 10`) | `T+G` | **3–15 s** typical; `60 s` or `180 s` on hang tests | Same (`timeout_seconds: 180/150` hard cap) | Import-time heavy libs (`fastapi`/`pydantic`) + anyio plugin overhead + infinite-loop bugs (`rich_4006` class) |
| **13. Phase 2 Scoring** | Fresh Container B, patch extraction, 4-pass apply, anti-tamper reset, hermetic `pytest -p no:anyio -o timeout=0` + JUnit XML | `G only` | **~0.3–0.5 min/task** (`[ESTIMATE]`, parallelizable on CPU) | **~0.5 min/task** sequential (`[COMPETITION INTEL]`) | Sequential 129-task Phase 2 adds **~64 min** to end-to-end wall; Kaggle staff confirmation on 12 h Phase 2 exclusion remains unanswered |

---

## 3. Deep Technical Root Causes Behind Hardware & Runtime Bottlenecks

### 3.1 RTX 5090 vs. 4x L4 Compute, Bandwidth & Tensor-Parallelism Asymmetry

| Hardware Metric | Local: 1x NVIDIA GeForce RTX 5090 (`sm_120`, TP=1) | Remote: 4x NVIDIA L4 (`sm_89`, TP=4) | Parity Implication |
| --- | --- | --- | --- |
| **VRAM Total** | **32 GB GDDR7** (512-bit) (`[OFFICIAL DOCS]`) | **96 GB GDDR6** (4 × 24 GB, 192-bit) (`[OFFICIAL DOCS]`) | Local fits ~17 GB QAT 31B weights + leaves only ~10–12 GB for KV + graphs (`[ESTIMATE]`); remote has ~60+ GB free KV (`0.80` util) |
| **Memory Bandwidth** | **1,792 GB/s** (~1.79 TB/s) (`[OFFICIAL DOCS]`) | **1,200 GB/s** aggregate (4 × 300 GB/s) (`[OFFICIAL DOCS]`) | Decode weight streaming ~1.49x faster in raw BW, **plus** zero TP all-reduce overhead |
| **Dense FP16/BF16 Tensor TFLOPS** | **209.5 TFLOPS** (FP32 acc; 419 FP16 acc) (`[OFFICIAL DOCS]`) | **484 TFLOPS** aggregate (4 × 121 TFLOPS) (`[OFFICIAL DOCS]`) | Prefill compute (~80–90% TP efficiency) can be **~1.5–2.0x faster on Kaggle 4x L4** than local 5090 |
| **Inter-GPU Link** | None (`TP=1`) | **PCIe Gen4 x16** (64 GB/s bidirectional, no NVLink) (`[OFFICIAL DOCS]`) | On 4x L4, ~17 GB reads at 1,200 GB/s allow ~70.6 tok/s theoretical vs **33–35 tok/s** measured (`~50%` efficiency due to PCIe TP4 sync) |
| **Estimated 31B Decode Speed** | **~50–80 tok/s** (105.4 tok/s theoretical cap) (`[ESTIMATE]`) | **33–35 tok/s** (`[COMPETITION INTEL]`) | Local decode steps run **~1.5–2.3x faster** — making prefill/tool/compaction share *larger* locally |

### 3.2 Gemma 4 31B / E4B Hybrid KV Cache Physics & the `vLLM 0.19.1` Allocation Cliff

Official Hugging Face `config.json` specs and DeepMind architecture docs reveal why KV cache capacity differs by **an order of magnitude** depending on whether `vLLM 0.19.1` enables Gemma 4's Hybrid KV Cache Manager or falls back to uniform allocation (`vllm#39133` pattern):

1. **Gemma 4 31B (`60` layers, `[OFFICIAL DOCS]`):** Alternates **50 local SWA-1024 layers** (`num_key_value_heads=16`, `head_dim=256`) with **10 global full-attention layers** (`num_global_key_value_heads=4`, `global_head_dim=512`, `attention_k_eq_v=true` unifying keys and values).
   - **If SWA Hybrid Manager works properly:** The 50 local layers cap strictly at `1,024` tokens per sequence (**0.78 GiB/seq fixed**), while the 10 global layers grow at only **40.0 KiB/tok** (shared K=V) or **80.0 KiB/tok** (separate K+V). At `--max-model-len 32768`, 1 sequence consumes only **2.03–3.28 GiB** of KV — fitting comfortably inside the 32 GB RTX 5090 alongside ~17 GB weights.
   - **If `vLLM 0.19.1` allocates uniform full-length KV (`vllm#39133` regression pattern):** All 60 layers allocate across the full context (`60 × 16 × 256 × 2(KV) × 2B = 983,040 B/tok` = **960 KiB/tok**). At 32,768 tokens that demands **30.00 GiB KV alone** (**47+ GiB total** -> OOM). Inside a realistic ~10 GiB post-weight/post-graph KV budget on RTX 5090, bf16 fits only **~10,922 tokens**, while `--kv-cache-dtype fp8` (`480 KiB/tok`) pushes capacity to **~21,845 tokens** (still tight for 32k, workable for `16,384` if FP8 KV kernels execute cleanly without WDDM emulation penalties).
   - **Gemma 4 E4B (`42` layers, `[OFFICIAL DOCS]`):** Uses `sliding_window=512`, `head_dim=256`, `global_head_dim=512`, and cross-layer KV sharing (`num_kv_shared_layers=18`), plus ~4–5 GB QAT weights -> massive KV headroom locally, enabling 2–3 concurrent local processes only after verifying isolated container budgets.

2. **Extra Hidden VRAM Sink (`--enable-lora`):** Competition servers launch with `--enable-lora --max-loras 8 --max-lora-rank 128`. Per official vLLM docs, `--max-loras` and `--max-lora-rank` preallocate GPU workspace buffers (`VLLM_MEMORY_PROFILER_ESTIMATE_CUDAGRAPHS=1` also reserves CUDA graph memory during `profile_run`). Because BCF ships **zero LoRA adapters**, dropping `--enable-lora` locally preserves multi-GiB KV headroom for iteration while documenting the parity flag cleanly.

### 3.3 Windows WSL2 vs. Native Linux Traps (RTX 5090 `sm_120`)

Official NVIDIA, Microsoft, and upstream GitHub issue trackers document four distinct RTX 5090 local traps:
- **`nvidia-open` Kernel Modules + GSP:** Blackwell (`sm_120`) strictly requires NVIDIA Open GPU Kernel Modules natively on Linux (`nvidia-driver-580-open`), and PyTorch `>= 2.7` / `2.10.0+cu128` (`CUDA 12.8+` kernels) (`[OFFICIAL DOCS]`).
- **WSL `< 2.7.0` CUDA-Graph Crash:** Earlier WSL releases raise `cudaErrorUnknown` during vLLM CUDA graph capture on RTX 5090; falling back to `--enforce-eager` bypasses capture at **~8x throughput degradation** (`[OFFICIAL DOCS]` / community bug trace).
- **WDDM `dxgkrnl` Paravirtualization Overheads (`WSL#40401`, `WSL#40732`, `WSL#11050`):** GPU-PV through `/dev/dxg` can exhibit contiguous multi-GiB allocation failures or ~16 GiB invisible driver-context overhead (`WSL#40401`), panics upon deliberate VRAM oversubscription (`WSL#40732`), **ignores** NVIDIA Control Panel `"Prefer No Sysmem Fallback"` (`WSL#11050`), and silently falls back W8A8 FP8 routines to emulated FP16 via `dxgkrnl` (`[OFFICIAL DOCS]` / upstream issue reports). Native Ubuntu 24.04 (`Zorin 18.1`) avoids WDDM virtualization and Docker Desktop's `+0.1–0.5 s` VM hop per `docker exec`.
- **`9p` Cross-OS Filesystem Penalty:** Storing snapshots (`21.50 GB`, median `214 MB`, ~3k files/repo), HF weights (`17 GB`), or workspaces under `/mnt/c` or `/mnt/d` incurs **3–10x slowdown** (`10–30 s/container` vs `2–5 s` in `ext4.vhdx`) (`[OFFICIAL DOCS]` / `[ESTIMATE]`).

---

## 4. Kaggle 12-Hour Cliff Sensitivity Model (`4x L4`)

Kaggle terminates (and historically zeroes) submissions exceeding the **12.0-hour (720.0-minute)** notebook limit (`[OFFICIAL DOCS]`, `[COMPETITION INTEL]`). Using `12.6 min` measured vLLM TP4 startup (`[COMPETITION INTEL]`) and our verified calculations across `N=120` and `N=129` tasks:

| `max_time_minutes` | Setup (`G only`) | Phase 2 (`pytest`) | `N = 120` Worst-Case (Margin vs 12 h) | `N = 129` Worst-Case (Margin vs 12 h) | Mean-Task Realistic (`mean = 3.0 m`) |
| --- | --- | --- | --- | --- | --- |
| `3.5 min` | `60 s` | `0 s` / `30 s` | `9.21 h (+167 m)` / `10.21 h (+107 m)` | `9.88 h (+127 m)` / `10.96 h (+62 m)` | `8.21 h` (`N=120`) / `8.81 h` (`N=129`) |
| `4.0 min` *(E4B shipped)* | `30 s` / `60 s` | `30 s` | `10.21 h (+107 m)` / `11.21 h (+47 m)` | `10.96 h (+62 m)` / **`12.04 h (-2.1 m BREACH)`** | `8.71–9.88 h` |
| `4.5 min` *(31B shipped)* | `30 s` / `60 s` | `0 s` | `10.21 h (+107 m)` / `11.21 h (+47 m)` | `10.96 h (+62 m)` / **`12.04 h (-2.1 m BREACH)`** | `7.71–9.21 h` (p2=0s) |
| `4.5 min` *(31B shipped)* | `60 s` | `30 s` | **`12.21 h (-12.6 m BREACH)`** | **`13.11 h (-66.6 m BREACH)`** | `9.21 h` (`N=120`) / `9.88 h` (`N=129`) |
| `5.0 min` *(DO NOT SHIP)* | `60 s` | `0 s` / `30 s` | **`12.21 h` / `13.21 h BREACH`** | **`13.11 h` / `14.19 h BREACH`** | Exhausts safety margin on tail clusters |

**Takeaway:** Shipped 31B (`4.5 min`) is safe **only** when mean per-task duration sits around `2.5–3.2 min` (`~8.2–10.3 h` total) with low timeout rate, OR if measured `setup <= 45 s`. If hidden private repos run heavy tail timeouts, lowering 31B to `4.0 min` (`Y4`) buys **~60–65 minutes** of cliff insurance at `N=120–129`.

---

## 5. Pareto Summary: Top Bottlenecks Ranked by Severity

| Rank | Bottleneck | Environment Impacted | Typical Time / Loss Cost | Dominant Leverage Point |
| --- | --- | --- | --- | --- |
| **1** | **Kaggle queue wait + 1-pending gate + paused rescores** | Remote Kaggle | **36–80+ h per feedback cycle**; drops usable slots to ~1 per 2–3 days | Move all tuning/validation off Kaggle (L0–L3); treat slots as sacred |
| **2** | **12-hour session cliff vs. hidden tail + unbudgeted `G only` setup** | Remote Kaggle | **Total run zeroed (`-100%` score)** if sum exceeds `720 min` | `Y4` budget cap rule (`<=11.0 h` extrapolated), bound `discover_tests`/renames |
| **3** | **Full-corpus sequential eval loop (`129` tasks)** | Local RTX 5090 | **3.5–5.5 h** per unmasked GPU run (`5 empty + 27 missing-lib` noise) | Freeze `masked-68` & stratified `dev-30` (`L2`); GPU-free `L0` gates |
| **4** | **LLM Decode & unnecessary thinking tokens (`bcf_plan` + bloat)** | Both (`76%` agent wall) | **10–30 s/task** in `bcf_plan` alone + **~3 min** `MAX_TOKENS` tails | Split `sampling_plan.yaml` (`thinking_budget: 0/256`); trim prompt/spec waste |
| **5** | **vLLM cold startup + `Profile` / Graph Capture** | Local RTX 5090 (per restart) | **4–9 min** locally (`12.6 min` remote TP4) | Warm single-server sessions; batch `--task-ids` invocations |
| **6** | **WSL2 9p `/mnt/d` I/O, CUDA-graph fallback, or WDDM KV/Sysmem spills** | Local RTX 5090 (WSL2) | **3–10x** container setup lag; **~8x** eager decode drop; **3x** KV shrink | Stage exclusively in `ext4`; WSL `>= 2.7.0`; `WSL#40401` probe; Native Linux fallback |
| **7** | **ADK context compaction (`14,336` tok) & non-text loss** | Both | **15–40 s** summarizer + **10–30 s** re-orientation cascade | Prevent crossing `14,336` tok (`include_contents: none`, bounded reads, spec caching) |
| **8** | **Wrong-edit retry / truncation / `gemma4_tool_parser` freeze** | Both | **3+ min** / task or **entire server deadlock** (`list[str]` arg) | Hard scalar-only schema fuzz (`C3`); `_family_lines` + line anchors (`E1`/`E2`); `apply` dedup |
| **9** | **Unguarded full-repo walks in `bcf.py v2` & `pytest` cold/hangs** | Both (hidden large repos) | **Up to `180 s` cap** on large repos (`2,600+` files) | Hard deadlines/file caps in `discover_tests`, `detect_rename`, `_scan_symbol` |
