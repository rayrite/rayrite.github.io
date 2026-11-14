# Task 3: Fast Iteration, Feedback Loops & Hypothesis-Testing Strategy

**Core Objective:** Increase validated experimental throughput by **5–10x** before the **Dec 2, 23:59 UTC** deadline while bypassing every wall-clock bottleneck identified in Task 1 (36–80+ h Kaggle queues, 12 h timeout cliffs, 3.5–5.5 h raw local runs, 4–9 min vLLM cold starts, WSL2 I/O/VRAM traps, and 10–13% single-run stochastic noise).

---

## 1. Bottleneck-Avoidance Doctrine (1-to-1 Countermeasures to Task 1)

| # | Operational Rule | Task 1 Bottleneck Neutralized | Wall-Clock / Risk Payoff |
| --- | --- | --- | --- |
| **1** | **Pin data & containers strictly on native Linux / WSL2 `ext4.vhdx`** | WSL2 `9p`/`drvfs` small-file tax; `WSL#40401` & `<2.7.0` eager/OOM failures | Cuts container extract from `10–30 s` to `2–5 s`; avoids `~8x` decode loss (`WSL >= 2.7.0` or Zorin 18.1 fallback) |
| **2** | **One warm vLLM session per work block; batch `--task-ids`** | Local `4–9 min` cold startup (weight read + profiler + CUDA graph capture) | Amortizes startup to **0 s/run** across back-to-back L1/L2 tests |
| **3** | **Offload every non-synthesis question to CPU-only (`L0`)** | Local 1x 5090 GPU saturation (`76%` decode wall; serial `--concurrency 1`) | Tests localization, `bcf.py`, parser fuzzing, edit replay, and Phase 2 pytest in **seconds–1 h** |
| **4** | **Mask & stratify before GPU sweeps (`masked-68` -> `dev-30`)** | `3.5–5.5 h` raw 129-task sweeps polluted by 5 empty-pass + 27 missing-lib tasks | Cuts screening runs from `~4.5 h` -> **`~2.3 h`** while removing dead-weight noise |
| **5** | **Replace single-run belief with Pre-Registration + Win-Both + McNemar** | `sigma ≈ 1.5–3` tasks (`0.24 -> 0.17` unchanged rerun variance) | Blocks false promotions from eating precious `1/day` Kaggle slots |
| **6** | **Pin exact parity & log local deviations (M2 KV & `s/M-tok`)** | `vLLM 0.19.1` uniform KV cap (`~10–12k` bf16) & TP1 vs TP4 latency ratio | Keeps local `max_time_minutes` calibrated to Kaggle's `33–35 tok/s` 12 h envelope |
| **7** | **Separate Mechanism Metrics from Binary Pass/Fail** | Slow lagging score feedback vs fast trace telemetry | Surfaces regressions in `< 15 min` (empty-patch %, edit-fail %, compaction %, first-edit latency) |

---

## 2. The 5-Rung Gated Hypothesis Ladder (`L0 -> L4`)

Every hypothesis must pass **every lower gate** before earning compute at the next rung.

| Rung | Compute | Target Population | Typical Wall Clock | Questions Answered | Gate to Advance |
| --- | --- | --- | --- | --- | --- |
| **L0: CPU-Only Battery** | Host CPU (0 GPU, multithreaded Docker ok) | `C0` bundle, `C1` corpus (`129`), `C3` fuzz (`>=5k`), `verify_patches` audit, `replay_edits`, `locbench` | **Seconds – ~60 min** | Does it compile cleanly? Does `bcf.py` regress accuracy or speed at 3k-file scale? Does the schema freeze `gemma4` parser? What is `masked-68`? | `C0` 0 errors; `C1` green (`3,002`-file `<=2s`); `C3` 0 hangs; both tracks byte-identical (`N2`) |
| **L1: Warm Single-Task GPU** | 1x RTX 5090 (warm server) | Targeted `C2-1..7` drills, `C4b` reasoning A/B, `C5` E4B smoke (`1–4` tasks) | **~2–5 min/task** (`0 min` startup amortized) | Does `bcf_plan -> solver` survive ADK nudges, `include_contents: none`, `MAX_TOKENS`, E4B thinking tokens, and Docker setup telemetry? | Nudge restart tax `<= 15 s`; zero 3rd-identical edits; clean format on E4B |
| **L2: Paired Stratified A/B** | 1x RTX 5090 | Frozen stratified **`dev-30`** (subset of `masked-68`, single pre-registered variable vs champion) | **~2.3 h/repeat** (~4.6 h `2×30` 31B; ~2.4 h E4B) | Does the lever move resolve rate AND leading trace metrics reliably above single-run noise? | **Win-both (`Delta > 0` in r1 & r2)**, `Delta >= 3` tasks on 30, OR exact McNemar `p <= 0.05` + zero veto crashes |
| **L3: Full Confirmation + OOD** | 1x RTX 5090 overnight | Full **`masked-68` × 2 repeats** + self-hosted **`OOD-45` / `FreshSWE-Py`** | **~5.2 h** (31B `68×2`); **~2.7 h** (E4B); ~1.7 h OOD | Does the gain hold across the full valid set, generalize off-distribution, and project `<= 11.0 h` remote? | Win-both on 68; zero OOD regression; `Y4` 129-task Kaggle extrapolation `<= 11.0 h` (`31B`) / `<= 10.5 h` (`E4B`) |
| **L4: Kaggle Submission** | Remote 4x L4 TP4 | Hidden public (`58`) + private (`~62`) evaluation | **36–80+ h queue** + **~9–11 h run** | Real scorer parity, public/private calibration (`s/M-tok`), and 2-slot final tournament pick | Pass full pre-slot checklist; early-day upload; ledger logged |

---

## 3. High-Leverage Fast Feedback Techniques (Avoiding GPU Wait)

### 3.1 Four Zero-GPU Accelerators (`L0`)

1. **`verify_patches.py` (CPU-Only Phase 2 Baseline & Flip Detector):**
   - Run Container B with `--skip-agent-patch` (empty baseline) and with `task.patch` (gold baseline) at CPU `--concurrency 4` (`~25–45 min` once) to mathematically freeze **`valid_tasks.txt` (`gold == PASS && empty == FAIL`, ~68 tasks)** and strip out the `5` empty-pass and `~27` missing-library tasks.
   - Re-verify borderline agent patches `--repeat 3` on CPU alone to catch flaky async/timing tests without spending a single GPU token.

2. **`replay_edits.py` (Counterfactual Edit-Call Funnel):**
   - Extract real historical `edit_file` / `apply` / `write_file` sequences from `traces/trace_<iid>.json` and replay them on CPU (~milliseconds per call + 2–5 s extract) against both the baseline harness 3-tier matcher and `bcf.py anchors`+`apply`.
   - Measures **edit failure rate**, **identical-retry share** (target: `0%` 3rd-identical streaks), and **`cmd_rename` rollback safety** across hundreds of recorded trajectories in **under 5 minutes**, proving prompt/engine edit fixes (like `E0a`, `E3a`, `E4`) *before* booting vLLM.

3. **`locbench.py` (Full-Snapshot Localization Probe at 3,000-File Scale):**
   - Measure `bcf.py spec` / `anchors` / `locate` gold-file hit@k, **gold-line hit@k** (specifically validating `E1` 5-family patterns and `E2` candidate lines), and cold wall-clock runtime (`<= 2 s` target / `<= 8 s` soft ceiling) against full `~3,000`-file extracted snapshots rather than biased `<= 18`-file source subsets.

4. **`parser_fuzz.py` (`C3` Scalar Schema Stress):**
   - Continuously fuzz injected tool schemas with `>= 5,000` adversarial bracket-, quote-, and delimiter-heavy (`<|"|>`, `{`, `}`, `[...]`) strings inside timeout-guarded subprocesses (`2 s` max). Prevents investing an 80 h Kaggle queue slot into a bundle susceptible to the `gemma4_tool_parser` freeze or `#44715` sentinel leak.

### 3.2 Warm-Server GPU Disciplines (`L1` / `L2`)

- **Day-1 `M1/M2` Measurement Gate:** On first `vllm serve` bring-up (`0.19.1`), record `GPU KV cache size: N tokens` from startup logs and execute the `WSL#40401` memory allocation probe (`4 GiB` + `12 GiB` contiguous) before running any multi-hour eval:
  - *If WSL2 invisible overhead `> 6 GiB` or graph capture fails (`< 2.7.0`):* Switch cleanly to native Ubuntu 24.04 (`Zorin 18.1` dual-boot with `nvidia-driver-580-open`) rather than burning days fighting `--enforce-eager` or sysmem spills.
  - *If `vLLM 0.19.1` reports ~10–11k bf16 KV tokens (uniform fallback):* Drop `--enable-lora` locally (BCF uses 0 adapters -> recovers buffer headroom), then use `--kv-cache-dtype fp8` at `--max-model-len 16384` (verifying prefill/decode tokens/s to ensure WDDM doesn't emulate FP8 slowly; otherwise hold bf16 at ~10k, since BCF context targets `< 12k`).
- **Mechanism Leading Indicators (Early Abort in `L1`/`L2`):** Log per-run trace telemetry immediately after the first 10 tasks (`~23 min`):

| Leading Metric | Healthy BCF v2 Target | Immediate Action if Degraded |
| --- | --- | --- |
| **Compaction count (`>14,336` tok cross)** | **`0` / task typical** | Trim `prompts/solver.md` (`P_E4B`), `SKILL.md` (`S1`), or reduce `read_file` line windows |
| **First-edit latency (`get_status` delta)** | **31B `<= 90–100 s`; E4B `<= 90 s`** | Diagnose `bcf_plan` thinking bleed (`Y1`) or slow full-repo `discover_tests` (`E6`) |
| **Edit failure & retry rate** | **`< 15%` single fail; `0%` 3rd retry** | Inspect `anchors` uniqueness, `E4` window strike overlap, and `E3a` dedup guard |
| **`MAX_TOKENS` / continuation nudges** | **`<= 1` nudge; `0` truncations** | Check `Y3` (`6144 -> 8192`) or E4B `temp: 0.0` repetition loop (`Y14`) |
| **Empty-patch rate on valid tasks** | **`< 10%` of timeouts** | Check `Y4` budget ratio and early commit guidance |

---

## 4. Statistical Discipline & Local-to-Kaggle Calibration

Because `masked-68` runs show `sigma ≈ 1.5–3` tasks and a `10–13%` per-task flip rate (`[COMPETITION INTEL]`), fast iteration fails if noise drives branching decisions:

1. **Frozen Pre-Registration Ledger (`H-NNN`):** Before launching any `L2` GPU sweep, write an immutable `prereg.md` containing: single variable changed (e.g., `H-002: Y1 planner thinking_budget 2048 -> 256`), target subset (`dev-30` SHA), exact decision threshold (`win-both && Delta >= 3`), and SHA of `arm.diff`. Never change two independent levers (e.g., `Y1` + `E1`) in one `L2` arm.
2. **Noise-Floor & Exact McNemar Gate (`compare_paired.py`):**
   - Scaled noise floor: `2*sigma` is **`~3` tasks on `dev-30`** and **`~4` tasks on `masked-68`**.
   - **Rule:** Reject or hold any arm failing **win-both** across `(r1, r2)` under identical `seed: 7` unless pooled discordant exact McNemar `p <= 0.05` AND `0` protocol vetoes (server hang, compiler rejection, empty-patch surge).
3. **`Seconds-per-Million-Model-Tokens` (`s/M-tok`) Extrapolation (`Y4` Trigger):**
   - Measure total prompt + completion tokens (`M_tok`) and agent active wall seconds (`W_local`) across clean sequential local runs (`W_local / M_tok`).
   - Calibrate the local RTX 5090 -> Kaggle 4x L4 scaling factor `k_cal` against your first scored Kaggle submission (accounting for 4x L4's slower decode `33–35 tok/s` vs faster compute prefill). Convert every local `L3` run into predicted `129-task` Kaggle runtime **before** submitting (`target <= 11.0 h` for 31B, `<= 10.5 h` for E4B).

---

## 5. Kaggle Slot Economics & Queue-Defensive Workflow (`L4`)

With `~18` days remaining to Dec 2 (`2026-11-14 -> 2026-12-02`) and live queue waits at **36–80+ hours** under a **1-pending-at-a-time** lock, you have realistically **~5–8 total remote Kaggle scoring slots left**. Protect them ruthlessly:

1. **Hard Pre-Slot Checklist:** Never execute `kaggle competitions submit` unless:
   - `validate_submission.py` reports 0 errors / 0 warnings on clean ZIP (`agent.yaml` at archive root, `< 3 GiB`).
   - `C0` official `compile_submission` passes.
   - `C3` (`>= 5,000` scalar payloads) finishes with `0` hangs.
   - `L3` extrapolated `N=129` wall clock stays **`<= 11.0 h`**.
   - For E4B bonus track: `C5` serving canary + replicated non-zero solve rate (`> 0`) on `L2`/`L3` is demonstrated first.
2. **Queue-Resilient Cadence:**
   - **Submit early in your morning UTC window** so queue transit runs across multiple calendar days; never chain cosmetic tweaks onto Kaggle.
   - Keep a **validated emergency fallback ZIP** (31B `max_time_minutes: 4.0`, verified `< 10.5 h` extrapolated) ready alongside Monolithic Variant B (`V6`) so no deadline crunch forces an untested upload.
   - **Triage every Kaggle return objectively** (`0.00` complete -> `12 h` timeout cliff / `Y4` cut needed or adapter load failure -> rebuild ZIP; stagnant vs local delta -> check private-repo `OOD-45` & `E6` unguarded walk limits; never re-upload an unchanged ZIP hoping for a scorer rescore).
3. **Final Two-Slot Selection (Before Dec 2, 23:59 UTC):**
   - Allocate **Slot 1** to your highest **L3 replicated + OOD-validated 31B bundle** (conservative `Y4` headroom).
   - Allocate **Slot 2** to **E4B-v2** *only* if `C5 + L3` prove repeatable non-zero private-viable performance (double-eligible for `$10k` bonus + main prizes); otherwise lock a **second structurally distinct, tighter-budget 31B variant** (e.g., `4.0 m` fallback) to hedge 12 h hidden-tail risk.

---

## 6. Hypothesis Pre-Registration Template & Fast-Cycle Cadence

To keep experiments trace-backed and prevent overlapping unattributed edits across fast daily cycles, use a minimal append-only CSV/Markdown ledger and split each day into **Daytime CPU/Warm-Smoke** + **Overnight Paired GPU** lanes:

### 6.1 Append-Only Pre-Registration Record

| Field | Example Entry (`H-001`: Bugfix + Planner Budget Split) | Purpose |
| --- | --- | --- |
| `hyp_id` / `arm` | `H-001` / `y1-plan256` | Unique immutable experiment key |
| `single_delta` | `Split sampling_plan.yaml -> bcf_plan thinking_budget: 256 (keep solver 2048)` | Enforces 1-variable isolation |
| `baseline_sha` | `<git-sha-of-v2>` + `env.json` (`16k fp8` or `32k bf16`) | Locks exact reference & KV mode |
| `target_subset` | `dev-30` (`sha256` locked) | Prevents post-hoc slice shopping |
| `promotion_gate` | `win-both (r1,r2) && (Delta >= 3 or McNemar p <= 0.05) && restart_tax <= 15 s` | Objective promote/reject rule |
| `status` | `REGISTERED -> L0_PASS -> L1_PASS -> L2_WIN_BOTH -> L3_QUEUED` | Blocks skipping validation rungs |

### 6.2 Recommended Fast-Cycle Execution Schedule (2026-11-14 Baseline)

| Cycle Window | GPU Lane (`1x RTX 5090`, Warm) | CPU Lane (`0 GPU`, Parallel Containers Ok) | Exit Deliverable |
| --- | --- | --- | --- |
| **Day 1 (Bring-up)** | `WSL#40401` probe -> `serve_pin` (`M1/M2` KV size) -> Zorin 18.1 fallback if marginal/fail; run **C2-1..7** & **C5 E4B** warm smoke | Implement `E0a` (`cmd_rename` rollback fix) + `E6` deadlines + `E22` (`install.py`); run `C0` + `C1` + `C3` fuzz; run `verify_patches.py` gold+empty (`masked-68`) | `PINS.txt` frozen; `valid_tasks.txt` + `dev-30` frozen; clean baseline ready |
| **Night 1** | **L3 Baseline:** `v2-31b` (patched `E0a/E6`) on `dev-30 × 2` (~4.6 h unattended) | — | Anchored champion traces + `s/M-tok` baseline |
| **Day 2 (Quick Wins)** | `L1` verify **Y1** (`bcf_plan thinking_budget: 256`) & inspect leading telemetry (`M6–M9`) | Build `replay_edits.py` + `locbench.py` on full ~3k snapshots; code `E1` (5 families) + `E2` (inner edit lines) in scratch arm | **First Kaggle calibration ZIP** queued early-day (post `C0/C3/Y4` check) |
| **Night 2** | **L2 Screen:** `H-001 (Y1)` vs baseline on `dev-30 × 2`; if early exit clean, run `H-002 (P1 3,000 chars)` | — | Statistical verdict (`compare_paired.py`) |
| **Days 3–6 (Engine Loop)** | **L2/L3** paired repeats for **`E1 + E2`**, **`E4`**, **`E3a`**, **`Y2`** (`temp 0.0`), and **`Y14`** (`E4B C5+L2`) | Self-host `OOD-45` proxy; triage Kaggle return #1 -> calibrate `k_cal` & finalize **`Y4`** (`4.5` vs `4.0 m`) | Promoted v2.1 champion + E4B go/no-go evidence before next Kaggle slot |

