# 03 — Local Environment Parity Plan: PowerSpec G914 (RTX 5090) vs Kaggle 4x L4 Scorer

**Date:** 2026-11-11 · **Role:** infrastructure engineer (BCF hardening L6) · **Method:** LOCAL ONLY — no web research; every fact below is grounded in the local research notes and competition docs listed in §0.2.
**Hardware target:** PowerSpec G914 desktop, NVIDIA RTX 5090 32 GB (Blackwell GB202, sm_120 / compute capability 12.0, 1,792 GB/s), Windows 11 Pro build 26200.
**Two tracks:** (A) Windows 11 + WSL2, (B) Zorin OS 18.1 native dual-boot. Both run the identical pinned software stack from §2; they differ only in OS/driver/container plumbing (§3 vs §4).
**Safety rules honored by this plan:** nothing under `input/` or `deliverables/2026-11-11-bcf-gemma4-brain/` is modified — all commands copy artifacts into fresh Linux working directories. Downloaded archives are untrusted: each is extracted into its own new empty directory, and no interpreter is ever run from inside an extracted tree (scripts we write live in `~/bcf/bin`, data lives elsewhere).

---

## 0. How to read this plan

### 0.1 Conventions

- `<PLACEHOLDER>` = replace with your value before pasting. `~` = your Linux home (WSL2 Ubuntu or Zorin). All Linux paths are **ext4** (see §2.1 — never `/mnt/c` or `/mnt/d` for hot data).
- **UNVERIFIED** = not confirmed by the local notes; a concrete probe step is attached. Do not treat UNVERIFIED items as facts.
- **ESTIMATE** = arithmetic/inference from cited facts, not a measurement on this machine.
- Parity classes: **exact** (same version/flag/value as scorer), **functional** (same behavior, different mechanism/value), **divergent** (known difference that changes interpretation; must be logged in §8).
- Commands assume bash. Track A commands run *inside WSL2 Ubuntu* unless prefixed "Windows PowerShell (Admin)". Track B commands run on Zorin.

### 0.2 Source key (all local, all read 2026-11-11)

| Key | File |
|---|---|
| `RTX` | `scratch/bcf-hardening-2026-11-11/research/rtx5090-stack.md` (hardware, pins, KV math, WSL2 caveats; snippet-mediated web research, confidence marked inline) |
| `ZOR` | `scratch/bcf-hardening-2026-11-11/research/zorin-docker.md` (Zorin 18 / Ubuntu 24.04, open kernel modules, Docker Engine + NCT) |
| `SRV` | `scratch/bcf-hardening-2026-11-11/research/vllm-serving.md` (parity flags, KV fit, parsers, TP numerics) |
| `HR` | `input/kagglecomp/kagglecomp_data_package/HARNESS_README.md` (harness contract: §3 serving, §4 sandbox, §7 budgets/compaction, §8 verification, §9 CLI) |
| `GS` | `input/kagglecomp/docs/markdown/Kaggle-03-GettingStarted.md` (official notebook: wheelhouse install, env vars, `VllmConfig`, `EvalConfig`) |
| `INTEL` | `input/kagglecomp/intel_20261111/00-intel-brief-2026-11-11.md` (implication 22 runtime pins; §3 harness status; 744354 reasoning-drop repro; 753973 parser freeze) |
| `BOT` | `scratch/bcf-hardening-2026-11-11/02a-bottlenecks.md` (local runtime context: 9p penalty, warm server, KV ceiling estimates, measurement plan M1–M15) |
| `DK` | `scratch/bcf-hardening-2026-11-11/docker/` (`docker_Dockerfile.sandbox`, `docker_Dockerfile.public`, `docker_imp.py`, `docker_telnetlib.py`, `sandbox_setup.py`) |
| `ZIP` | `input/kagglecomp/kagglecomp_data_package/gemma-4-developer-agent.zip` (21,929,289,087 bytes; listing measured in `scratch/bcf-2026-11-11/zip_listing.txt`: 129 `snapshots/*.tgz`, 127 graphs, 127 embeddings, 124 wheels, `docker/` x4, `sandbox/setup.py`, `sample_submission/`, `tasks.jsonl`, `HARNESS_README.md`) |
| `BCF31` / `BCFE4` | `deliverables/2026-11-11-bcf-gemma4-brain/02-bcf-brain-31b/submission/` and `.../03-bcf-brain-e4b/submission/` (read-only; `eval_config.yaml` budgets quoted in §6.4) |

**Global caveat (RTX/ZOR/SRV method sections):** the three web-research notes were produced while WebFetch was broken; all their quotes are search-snippet-mediated. Load-bearing values (torch pin, WSL#40401, KV behavior, exact repo command text) are re-verified **on the box** by the probes in this plan, not taken on faith.

---

## 1. Target environment specification

The remote column is the Kaggle scored-submission stack (`scripts/inference.py` path per HR §3.1, plus the official notebook GS where it differs). Where HR and GS disagree, both values are shown and the divergence is registered in §8.

| Component | Remote value (Kaggle) | Local target (both tracks) | Parity class | Source |
|---|---|---|---|---|
| GPU | 4x NVIDIA L4 24 GB GDDR6 (sm_89, 300 GB/s each, 96 GB total, PCIe, no NVLink) | 1x RTX 5090 32 GB GDDR7 (sm_120, 1,792 GB/s) | divergent (hardware) | HR §3.1; RTX RQ1/RQ6 |
| Tensor parallel size | 4 | 1 | divergent (numerics — see §5.6) | HR §3.1; GS §4 (`tp_size` auto); SRV Q8 |
| Inference engine | vLLM **0.19.1** (pins `torch==2.10.0`, `transformers` 5.5.x; Ray removed from reqs) | vLLM **0.19.1** from wheelhouse v31 (same wheel) | exact | INTEL implication 22 / §3 (757782); RTX RQ2–RQ3 |
| gemma4 tool parser file | SHA-256 `682b2152b76c031df9c58c3ffbb5b243945be5d8957ebdce00faef1b9de6b889` | identical SHA on installed `vllm/tool_parsers/gemma4_tool_parser.py` | exact (verify, §7 item 3) | INTEL §3 (757782) |
| PyTorch | 2.10.0 (cu128/cu129-class wheel; GS §1 renames `cu128`→`+cu128`) | 2.10.0+cu128 (or +cu129 if that is what the wheelhouse carries) with sm_120 kernels | exact | RTX RQ2 (vllm-ascend#9225); GS §1 |
| Host Python | 3.12.13 | 3.12.13 (uv or conda, §2.4) | exact | INTEL implication 22 |
| Harness libs | swegemma **0.2.11**, adk-submission **0.2.13**, google-adk **1.36.1** | same, from wheelhouse v31 | exact | INTEL implication 22; §3 (744272, 757782) |
| Wheelhouse | dataset `metric/gemma-4-developer-agent-wheelhouse`, **v31** (last updated Oct 12), dataset-version **19987205**, 41 wheels installed `--no-deps --force-reinstall` | same dataset version; same install procedure (§2.5) | exact (verify SHA + versions) | GS §1; INTEL §3 (757782), S4 |
| Model (main) | `gemma-4-31b-it-qat-w4a16-ct`, W4A16 compressed-tensors QAT, ~16–18 GB; Kaggle path `/kaggle/input/models/google/gemma-4/other/gemma-4-31b-it-qat-w4a16-ct/2` | same checkpoint, local dir `<MODELS_DIR>/gemma-4-31b-it-qat-w4a16-ct` | exact | HR §3.1; GS §4; RTX RQ5 |
| Model (bonus) | `gemma-4-e4b-it-qat-w4a16-ct` (sanctioned alias; HF `google/gemma-4-E4B-it-qat-w4a16-ct`) | same checkpoint | exact | INTEL §2a (748287); SRV scope |
| dtype | bfloat16 | bfloat16 | exact (numerics) | HR §3.1; GS §4; SRV Q3 |
| quantization flag | not set — compressed-tensors auto-detect from `config.json` (Marlin W4A16 kernels) | omit `--quantization` | exact (numerics) | SRV Q2 |
| kv-cache-dtype | auto (= bf16; not set in GS `VllmConfig`) | auto first; `fp8` only if KV probe forces it (§5.4) | exact → divergent if fp8 | SRV Q3/Q6 |
| max_model_len | 32768 | 32768 target; reduce only per §5.4 decision tree | exact → divergent if reduced | HR §3.1; GS §4 |
| gpu_memory_utilization | **0.80** in `setup_vllm_server` (HR §3.1); **0.90** in notebook `VllmConfig` (GS §4) | 0.90 locally (memory-only lever); raise to 0.95 only if KV probe needs it | functional (memory-only; register 0.80-vs-0.90) | HR §3.1; GS §4; SRV Q3 |
| Tool calling | `enable_auto_tool_choice=True`, `tool_call_parser='gemma4'` | same flags | exact | HR §3.1/§3.3; GS §4 |
| Reasoning | `reasoning_parser='gemma4'`, `default_chat_template_kwargs={'enable_thinking': True}` (VllmServer default per HR §3.3; not explicit in GS literal) | same; pass `--default-chat-template-kwargs '{"enable_thinking": true}'` explicitly on raw `vllm serve` | exact | HR §3.3; SRV Q3/Q4 |
| LoRA serving | `enable_lora=True`, `max_loras=8`, `max_lora_rank=128` | same; `max_loras` reducible (memory-only) if KV-tight | exact (rank) / functional (count) | HR §3.1/§3.4; GS §4; SRV Q7 |
| Server endpoint | `127.0.0.1:8000`, OpenAI `/v1`, key `EMPTY`, LiteLLM `openai/<served_model>` alias, `num_retries=5`, `litellm.drop_params=True` | identical | exact | HR §3.3; GS §4 |
| Env vars | `LITELLM_LOCAL_MODEL_COST_MAP=True`, `TRANSFORMERS_NO_TF=1`, `VLLM_WORKER_MULTIPROC_METHOD=spawn`, `VLLM_MEMORY_PROFILER_ESTIMATE_CUDAGRAPHS=1`, `VLLM_ENGINE_READY_TIMEOUT_S=1200`, `VLLM_NO_USAGE_STATS=1`, `OTEL_SDK_DISABLED=true`, `PYTORCH_CUDA_ALLOC_CONF=expandable_segments:True` | identical (§2.5) | exact | GS §1 |
| Startup timeout | 1200 s (`startup_timeout=60*20`; health timeout 1200 s corroborated by 749191) | same | exact | GS §4; BOT §2 |
| Sandbox image | `swebench-sandbox:latest` — `python:3.13-slim` + git/patch/protobuf-compiler/pigz + pytest/pytest-timeout==2.1.0/typer/build backends + `imp.py`/`telnetlib.py` shims, `TEST_TMPDIR=/tmp`, `WORKDIR /workspace` | build from the zip's own `docker/Dockerfile.sandbox` (§2.3) | exact | HR §4.1; DK; ZIP |
| Sandbox isolation | `network_mode="none"`, memory `4g`, 2 vCPU (`cpu_period=100000`, `cpu_quota=200000`), warm-pool wipe | docker backend applies these automatically; verify with `docker inspect` (§7 item 13) | exact | HR §4.1 |
| Sandbox bootstrap | 7 steps incl. `pip install --no-index --find-links=/wheels --no-build-isolation --no-deps -e /workspace`, `setup.py --fast-path`, baseline commit | harness-driven; supply `wheels/` (124 wheels from ZIP) + `sandbox/setup.py` | exact | HR §4.2; DK `sandbox_setup.py` |
| Budgets (per submission) | from `eval_config.yaml` (`evaluation:` key) | BCF31: 180 s / 50 calls / 4.5 min / 50 turns; BCFE4: 150 s / 40 calls / 4.0 min / 40 turns | exact | HR §7.1; BCF31/BCFE4 `eval_config.yaml` |
| Compaction | HR §7.2 (`scripts/inference.py`): interval **5**, overlap 2, threshold **14,336**, retention 5. GS §5 notebook passes interval **15** | interval 5 for scorer parity (UNVERIFIED which the managed scorer runs — probe §6.5); echo config every run | exact-target / UNVERIFIED | HR §7.2; GS §5; INTEL C12 |
| Context cache | `min_tokens=2048`, `ttl_seconds=1800`, `cache_intervals=10` | identical | exact | HR §7.2; GS §5 |
| Retries | ModelRetryPlugin: 5 retries, 2.0 s initial, 2.0x, max 60 s, ±20% jitter | identical (library default) | exact | HR §7.2 |
| Code-intelligence prompt section | graphs + embeddings present → prompt section 6 appended | extract `graphs/` + `embeddings/` too, so the prompt matches | exact | HR §5.2; ZIP |
| OS / kernel | Kaggle managed image (exact digest never published — 757782 unanswered) | Track A: Ubuntu 24.04 on WSL2 (>= 2.7.0); Track B: Zorin 18.1 = Ubuntu 24.04.4 noble, kernel 6.17 HWE | functional | INTEL §3 (757782); ZOR RQ1; RTX RQ4 |
| NVIDIA driver | Kaggle-managed (L4, datacenter branch) | Track A: Windows GeForce R580+ **only on Windows**; Track B: `nvidia-driver-580-open` (min 570; Blackwell = open modules only) | functional | RTX RQ1/RQ4; ZOR RQ2 |
| CUDA userspace | wheel-bundled (cu128/cu129 era) | same wheels; optional `cuda-toolkit-12-8` from `wsl-ubuntu` repo for nvcc only | functional | RTX RQ2/RQ4; ZOR goal-context |
| Container runtime | native Docker on Kaggle host | Track A: Docker Desktop >= 4.31.1 WSL2 backend **or** Engine + NCT `no-cgroups`; Track B: Docker Engine + NCT (rootful) | functional | RTX RQ4; ZOR RQ3/RQ4 |
| Queue / global clock | 36–52 h queue stalls; 12 h all-or-zero kill; 1 submission/day | none — self-enforce budgets; extrapolate with BOT M12/M14 | divergent (process) | INTEL S2/C13/C18; BOT §1 |

---

## 2. Shared prerequisites (both tracks)

Do these after the track-specific OS plumbing (§3 or §4) is verified, or in parallel on a second machine. Everything lands under `~/bcf` on ext4.

### 2.1 Disk layout and the ext4 rule

Measured sizes (BOT §3, ZIP listing): competition zip **21.9 GB**; 129 snapshot tgz **21.5 GB** (median 214 MB, max 334.9 MB); models ~17 GB (31B) + ~4–5 GB (E4B) ≈ **~21 GB**; wheelhouse (41 wheels incl. torch/vLLM) **ESTIMATE 3–5 GB**; docker images: sandbox ~0.6–1 GB, optional vLLM CUDA image 10–20 GB (ZOR RQ5); graphs+embeddings ~1.2 GB (127 files x ~5 MB, ZIP listing); extracted working copies + results/traces **ESTIMATE 5–10 GB**.

**Plan for ≥ 100 GB free, recommend 150 GB** on the Linux filesystem (BOT E16: 60–100 GB working set, plus headroom for two model variants, docker build cache, and a second results run).

| Path | Contents | Notes |
|---|---|---|
| `~/bcf/downloads/` | competition zip, wheelhouse zip, model tarballs (as downloaded) | keep originals for re-extraction |
| `~/bcf/data/` | extracted competition data: `tasks.jsonl`, `snapshots/`, `wheels/`, `graphs/`, `embeddings/`, `docker/`, `sandbox/`, `sample_submission/`, `HARNESS_README.md` | fresh empty dir before extraction (untrusted-archive rule) |
| `~/bcf/models/gemma-4-31b-it-qat-w4a16-ct/`, `~/bcf/models/gemma-4-e4b-it-qat-w4a16-ct/` | HF/Kaggle checkpoint dirs (`config.json`, safetensors, tokenizer, chat template) | read-only after download; never on `/mnt/*` |
| `~/bcf/wheelhouse/` | extracted 41-wheel dataset (v31) | |
| `~/bcf/venv/` | Python 3.12.13 host env | |
| `~/bcf/sandbox-build/` | Docker build context (Dockerfiles + shims + wheels) | separate from data dir |
| `~/bcf/submissions/bcf-31b/`, `~/bcf/submissions/bcf-e4b/` | **copies** of BCF31/BCFE4 submission trees | originals under `deliverables/` stay untouched |
| `~/bcf/bin/` | scripts we write (install helper, probes) | never put scripts inside extracted data dirs |
| `~/bcf/results/<run>/`, `~/bcf/logs/` | eval artifacts, server logs, pin manifests | |

**The ext4 rule (RTX RQ4 item 9; BOT §3/E7/E8, M4):** model weights, HF cache, snapshots, docker data-root, and workspaces must live on the Linux filesystem (WSL2 ext4-in-VHDX or native ext4). **Never** bind-mount hot data from `/mnt/c` or `/mnt/d`: the 9p/drvfs cross costs ~1–5 ms per file op → snapshot extraction degrades from ESTIMATE 2–5 s to 10–30 s per container (3–10x), and `git add -A` over ~3k files degrades similarly. One-time *copy* from `/mnt/d` is fine; working there is not.

```bash
mkdir -p ~/bcf/{downloads,data,models,wheelhouse,sandbox-build,submissions,bin,results,logs}
df -h ~        # confirm >= 100 GB free on the ext4 filesystem
```

Optional quantification (BOT M4): time `tar -xzf` of one 214 MB snapshot into `~/bcf/data` vs a `/mnt/d` directory; expect a 3–10x gap. This is the number that justifies Track B if you are on the fence.

### 2.2 Kaggle API setup and downloads

Prereq: a Kaggle account that has **accepted the competition rules** on the website (API downloads of competition data fail otherwise — standard Kaggle behavior; UNVERIFIED for this specific competition, probe = the download command itself).

```bash
# inside the Linux env (Track A WSL or Track B), with the host venv OR any python:
python3 -m pip install --user kaggle
mkdir -p ~/.kaggle
# place the token file you downloaded from kaggle.com -> Settings -> API -> Create New Token
cp <PATH_TO>/kaggle.json ~/.kaggle/kaggle.json
chmod 600 ~/.kaggle/kaggle.json
kaggle competitions list -s gemma   # sanity: API auth works
```

```bash
# 1) Competition data (21.9 GB). If you already have the repo copy, skip the download and copy it:
cp "/mnt/d/stuff/ai-misc/_bsh2026/vscode_project01/46-wide_research_test_alibaba/input/kagglecomp/kagglecomp_data_package/gemma-4-developer-agent.zip" ~/bcf/downloads/   # Track A
# Track B: copy from wherever the repo lives on your network/USB; same file, 21,929,289,087 bytes.
# Fresh download alternative:
kaggle competitions download -c gemma-4-developer-agent -p ~/bcf/downloads

# 2) Wheelhouse dataset — PIN version 19987205 (v31).
kaggle datasets download -d metric/gemma-4-developer-agent-wheelhouse -p ~/bcf/downloads --unzip
# UNVERIFIED: whether your kaggle CLI supports pinning a dataset version (e.g. --dataset-version 19987205).
# Probe: kaggle datasets download --help | grep -i version
# If no pin flag: download current, then VERIFY it is v31 via the parser SHA + package versions (§2.5, §7 item 3).
# If the SHA mismatches, do NOT use it — fetch version 19987205 manually from the dataset's Version history
# on kaggle.com and re-verify. (INTEL §3 757782: no official manifest exists; the SHA is the anchor.)

# 3) Models. Kaggle Models CLI form (UNVERIFIED exact syntax — probe: kaggle models --help):
kaggle models instances versions download google/gemma-4/other/gemma-4-31b-it-qat-w4a16-ct/2 -p ~/bcf/models
kaggle models instances versions download google/gemma-4/other/gemma-4-e4b-it-qat-w4a16-ct/<VERSION> -p ~/bcf/models
# <VERSION>: list with `kaggle models instances versions list google/gemma-4/other/gemma-4-e4b-it-qat-w4a16-ct`
# (E4B variation slug UNVERIFIED — the sanctioned alias is gemma-4-e4b-it-qat-w4a16-ct per INTEL §2a/748287).
# Hugging Face fallback (gated: accept the license on the model page first):
#   pip install -U "huggingface_hub[cli]"
#   hf download google/gemma-4-31B-it-qat-w4a16-ct --local-dir ~/bcf/models/gemma-4-31b-it-qat-w4a16-ct
#   hf download google/gemma-4-E4B-it-qat-w4a16-ct --local-dir ~/bcf/models/gemma-4-e4b-it-qat-w4a16-ct
# (HF repo names per SRV scope + RTX RQ5; Kaggle path per GS §4.)
```

Extract the competition zip into its **own fresh empty directory** (untrusted data):

```bash
test -z "$(ls -A ~/bcf/data)" || { echo "data dir not empty — use a fresh dir"; exit 1; }
unzip -q ~/bcf/downloads/gemma-4-developer-agent.zip -d ~/bcf/data
ls ~/bcf/data   # expect: HARNESS_README.md docker embeddings graphs sample_submission sandbox snapshots tasks.jsonl wheels
# wheelhouse (if downloaded as zip without --unzip):
mkdir -p ~/bcf/wheelhouse && unzip -q ~/bcf/downloads/gemma-4-developer-agent-wheelhouse.zip -d ~/bcf/wheelhouse
ls ~/bcf/wheelhouse/*.whl | wc -l   # expect 41 (GS §1 output). If nested, adjust to the dir containing the .whl files.
```

Verify the model config on the box (resolves SRV open gap 1 — kv_heads 16 vs 8 conflict):

```bash
python3 -I -c "
import json
c = json.load(open('$HOME/bcf/models/gemma-4-31b-it-qat-w4a16-ct/config.json'))
tc = c.get('text_config', c)
for k in ('num_hidden_layers','num_key_value_heads','head_dim','sliding_window','layer_types','quantization_config'):
    v = tc.get(k, c.get(k))
    print(k, ':', (str(v)[:120] if v is not None else None))
"
# Expect per SRV Q6 / RTX RQ5: 60 layers (50 sliding + 10 global), sliding_window 1024,
# kv heads 16 (sliding) / 4 global, head_dim 256 / global 512, compressed-tensors W4A16.
# If values differ, redo the §5.4 KV math with the real numbers before trusting the fit verdict.
```

### 2.3 Sandbox image build (exact commands)

The harness's docker backend expects image **`swebench-sandbox:latest`** (HR §4.1). Build it from the competition's own Dockerfiles — do not improvise. The zip contains `docker/Dockerfile.sandbox`, `docker/Dockerfile.public`, `docker/imp.py`, `docker/telnetlib.py` (ZIP listing; identical to DK copies). The public variant additionally needs the `wheels/` cache (124 wheels from the zip) in the build context.

```bash
# Fresh, empty build context (untrusted-archive rule: extraction target is its own new dir):
test -z "$(ls -A ~/bcf/sandbox-build)" || { echo "not empty"; exit 1; }
unzip -j -q ~/bcf/downloads/gemma-4-developer-agent.zip \
  "docker/Dockerfile.sandbox" "docker/Dockerfile.public" "docker/imp.py" "docker/telnetlib.py" \
  -d ~/bcf/sandbox-build/
# wheels for the public variant (and for the harness wheels_dir):
unzip -q ~/bcf/downloads/gemma-4-developer-agent.zip "wheels/*" -d ~/bcf/sandbox-build/

cd ~/bcf/sandbox-build
docker build -f Dockerfile.sandbox -t swebench-sandbox:latest .
# Optional offline-public variant (harness stages /wheels itself per HR §4.2 step 1, so this is a convenience):
docker build -f Dockerfile.public -t swebench-sandbox-public:latest .
```

What the image contains (DK `docker_Dockerfile.sandbox`, verbatim contract): `python:3.13-slim`; apt `git patch protobuf-compiler pigz`; pip `pytest pytest-timeout==2.1.0 typer pdm-backend setuptools wheel poetry-core hatchling flit-core editables`; `imp.py` + `telnetlib.py` copied into `/usr/local/lib/python3.13/site-packages/` (Python 3.13 removed both modules; eval deps such as flasgger still import them); git identity `Agent <agent@eval>`, default branch `main`; `ENV TEST_TMPDIR=/tmp`; `WORKDIR /workspace`.

**Where wheels come from:** the sandbox is `network_mode=none` (HR §4.1) — everything installable at eval time must already be in the image or in `/wheels`. The harness stages `/wheels` from the competition `wheels/` dir (HR §4.2 step 1; `EvalConfig.wheels_dir`, GS §5) and runs `sandbox/setup.py --fast-path <repo>` (HR §4.2 step 5; DK `sandbox_setup.py`: dedups wheels by PEP 503 name, installs resolved deps `--no-index --find-links=/wheels --no-build-isolation`, editable-installs the workspace, writes `pytest.ini`/`conftest.py`). Known gap you must NOT fix by hand: `inline_snapshot`/`dirty_equals` are absent from the wheelhouse → 27+ fastapi tasks fail collection locally exactly as on the public scorer (INTEL C7/§4a). That is parity, not a bug in your build (§7 item 12).

Smoke-test the image:

```bash
docker run --rm swebench-sandbox:latest bash -lc \
  'python3 -V; python3 -c "import imp, telnetlib, pytest; print(\"shims+pytest ok\")"; git --version; protoc --version; pigz --version; echo $TEST_TMPDIR; pwd'
# Expect: Python 3.13.x, "shims+pytest ok", git/protoc/pigz versions, /tmp, /workspace
```

### 2.4 Python 3.12.13 host environment

The host harness env must be Python **3.12.13** (INTEL implication 22). The sandbox is 3.13 by design — do not "align" them.

```bash
# Option 1: uv (fast, exact patch installs via python-build-standalone)
curl -LsSf https://astral.sh/uv/install.sh | sh     # or: pip install --user uv
uv python install 3.12.13
# UNVERIFIED: that 3.12.13 is in uv's available list on this date. Probe: uv python list | grep 3.12.13
uv venv ~/bcf/venv --python 3.12.13
source ~/bcf/venv/bin/activate
python -V    # expect: Python 3.12.13

# Option 2: conda-forge (fallback if uv lacks the exact patch)
# conda create -y -n bcf -c conda-forge python=3.12.13
# conda activate bcf
```

### 2.5 Wheelhouse install (notebook procedure, exact order) + env vars

Replicate GS §1 precisely: skip cutlass wheels, rename `cu128`→`+cu128` in filenames, install all 41 wheels in one `pip install --no-deps --force-reinstall` (no dependency resolution — this is how the scorer installs them too, INTEL §4d/744370 mechanism note). The wheelhouse is Linux x86_64 — it installs into the WSL/Zorin venv, never into Windows Python.

```bash
source ~/bcf/venv/bin/activate

# --- env vars: add to ~/bcf/bin/env.sh and source it in EVERY shell that runs vllm/swegemma ---
cat > ~/bcf/bin/env.sh <<'EOF'
export LITELLM_LOCAL_MODEL_COST_MAP=True
export TRANSFORMERS_NO_TF=1
export VLLM_WORKER_MULTIPROC_METHOD=spawn
export VLLM_MEMORY_PROFILER_ESTIMATE_CUDAGRAPHS=1
export VLLM_ENGINE_READY_TIMEOUT_S=1200
export VLLM_NO_USAGE_STATS=1
export OTEL_SDK_DISABLED=true
export PYTORCH_CUDA_ALLOC_CONF=expandable_segments:True
EOF
source ~/bcf/bin/env.sh
# (all eight verbatim from GS §1; VLLM_MEMORY_PROFILER_ESTIMATE_CUDAGRAPHS=1 is the staff-confirmed
#  fix for the LoRA CUDA-graph OOM edge, INTEL/BOT 749191 — keep it even without LoRA.)

# --- remove cutlass .pth hooks (GS §1 does this before install) ---
find ~/bcf/venv/lib -name "*cutlass*.pth" -print -delete

# --- stage symlinks with the cu128 rename, skipping cutlass wheels (GS §1) ---
WHEELHOUSE_DIR=~/bcf/wheelhouse        # adjust if the .whl files sit one level deeper
mkdir -p /tmp/wheelhouse
for w in "$WHEELHOUSE_DIR"/*.whl; do
  b=$(basename "$w")
  case "$b" in *[Cc][Uu][Tt][Ll][Aa][Ss][Ss]*) continue;; esac
  case "$b" in *cu128*) [ "${b/+cu128/}" = "$b" ] && b="${b/cu128/+cu128}";; esac
  ln -sf "$w" "/tmp/wheelhouse/$b"
done
ls /tmp/wheelhouse/*.whl | wc -l    # expect 41 minus any cutlass wheels (GS prints "Installing 41 wheels")

# --- single force-reinstall, no deps (GS §1) ---
python -m pip install -q --no-deps --force-reinstall /tmp/wheelhouse/*.whl
```

Post-install pin verification (this is the parity gate — record output into `~/bcf/results/PINS.txt`):

```bash
python -c "import vllm, torch, transformers; print('vllm', vllm.__version__, '| torch', torch.__version__, '| transformers', transformers.__version__)"
# expect: vllm 0.19.1 | torch 2.10.0+cu128 (or +cu129) | transformers 5.5.x   (RTX RQ2/RQ3; INTEL impl 22)
python -m pip show swegemma adk-submission google-adk | grep -E '^(Name|Version)'
# expect: swegemma 0.2.11, adk-submission 0.2.13, google-adk 1.36.1            (INTEL impl 22)
sha256sum ~/bcf/venv/lib/python3.12/site-packages/vllm/tool_parsers/gemma4_tool_parser.py
# expect: 682b2152b76c031df9c58c3ffbb5b243945be5d8957ebdce00faef1b9de6b889     (INTEL §3 757782)
python -c "import torch; print(torch.cuda.get_device_capability(), torch.cuda.get_device_name(0))"
# expect: (12, 0) NVIDIA GeForce RTX 5090                                      (RTX RQ2; probe §3.5/§4.3)
```

If the SHA or any version mismatches: the wheelhouse drifted (v31 was "last updated October 12"; INTEL S4). Stop and re-pin before any A/B — a different parser changes tool-call behavior and invalidates comparisons (BOT §3 "serving-path drift"; 0.24 rewrote the gemma4 parser per 753521). **Never `pip install -U vllm`** — current PyPI vLLM is 0.33.0 / torch 2.14 / cu130-only (RTX RQ3), which is a different serving stack.

If `torch.cuda.get_device_capability()` errors with "no kernel image" / sm_120 incompatibility: the wheelhouse torch wheel lacks sm_120 (UNVERIFIED risk, BOT §3 "Blackwell kernel support"). Fallback ladder: (1) confirm driver R580+ and WSL >= 2.7.0; (2) install the vLLM 0.19.1 cu128 variant wheel from wheels.vllm.ai + torch 2.10.0 cu128 from `https://download.pytorch.org/whl/cu128` (RTX RQ2/RQ3) — document as a wheel-provenance divergence; (3) last resort source build with `TORCH_CUDA_ARCH_LIST="12.0"` (RTX RQ2 item 6) — hours of work, only if (2) fails.

---

## 3. TRACK A — Windows 11 + WSL2

**Gate:** this track is viable **only if** the VRAM-overhead probe (§3.6) passes and CUDA-graph capture works (§3.7). microsoft/WSL#40401 reports ~16 GiB of invisible CUDA driver overhead on Blackwell under WSL2; if it reproduces on the 5090, **nothing fits in 32 GB and Track A is disqualified** (RTX RQ4 item 1, RQ5 fit table). Run the probe before investing in the rest.

### 3.1 Windows NVIDIA driver (Windows ONLY)

1. Install the latest GeForce Game Ready or Studio driver, **R580+ generation** (minimum ever for the 5090: 572.16 WHQL 2025-01-30; R570+ required for Blackwell CUDA; R580+ satisfies cu128/cu129/cu130 wheels). (RTX RQ1 driver note, RQ4 rule 1.)
2. Reboot. Verify in Windows PowerShell: `nvidia-smi` → driver 580.x, RTX 5090, ~32 GB.
3. **HARD RULE: do NOT install any Linux display driver inside WSL.** Quote (NVIDIA CUDA on WSL guide, Step 2): "Do not install any Linux display driver in WSL". The Windows driver provides the Linux user-mode stubs (`libcuda`, `nvidia-smi`) at `/usr/lib/wsl/lib/` via `/dev/dxg` GPU paravirtualization. Installing a Linux driver overwrites the stubs and breaks passthrough. (RTX RQ4 rules 1–2.)

### 3.2 WSL update to >= 2.7.0 + Ubuntu 24.04

Windows PowerShell (Admin):

```powershell
wsl --update
wsl --version          # MUST show WSL version >= 2.7.0
wsl --set-default-version 2
wsl --install -d Ubuntu-24.04    # if not already installed; set UNIX user/password on first launch
wsl -l -v                        # Ubuntu-24.04 must be VERSION 2
```

Why 2.7.0: before it, CUDA-graph capture on the 5090 failed with `cudaErrorUnknown` (dxgkrnl); the `--enforce-eager` workaround cost ~8x throughput; WSL 2.7.0 fixed capture (vllm#37242 "RTX 5090 + WSL2 2.7.0: vLLM CUDA Graphs Work", microsoft/WSL#14452; one report: 102/102 graphs, startup ~90 s → ~25 s). It also fixed a WSL VM crash when loading ~20 GB models (dbirks/home-k8s#48). (RTX RQ3 "WSL2 + 5090", RQ4 item 3.)

Inside Ubuntu:

```bash
lsb_release -a                 # Ubuntu 24.04.x LTS (noble) — matches Kaggle-era userspace and Zorin 18 base
ls -l /dev/dxg                 # must exist (GPU paravirtualization device)
/usr/lib/wsl/lib/nvidia-smi    # must show the 5090; note memory.total and memory.used (Windows host share)
```

NVML caveat (official guide quote, RTX RQ4 rule 3): "NVML (nvidia-smi) does not support all the queries yet. GPU utilization, active compute process are some queries that are not supported." Expect ~0.5–1.5 GiB of the VRAM consumed by the Windows desktop/DWM side (ESTIMATE, RTX RQ4 item 5) — budget for it in §5.

### 3.3 `.wslconfig` memory/swap sizing

The G914's system RAM is not recorded in the notes — **UNVERIFIED**; check with `systeminfo | findstr /C:"Total Physical Memory"` (Windows). Sizing rationale: vLLM host-side needs weight-load buffers + spawn workers + page cache; each sandbox container is capped at 4 GiB (HR §4.1); leave Windows ≥ 6–8 GB. A hard WSL memory cap also contains the GPU-OOM → Hyper-V VM panic failure mode (microsoft/WSL#40732, RTX RQ4 item 2) by preventing host-wide memory exhaustion. ESTIMATE values, validate with `free -h` during the first vLLM startup.

Create `C:\Users\<YOU>\.wslconfig`:

```ini
[wsl2]
# If host RAM = 32 GB:
memory=24GB
swap=8GB
# If host RAM = 64 GB, use instead: memory=48GB / swap=16GB
localhostForwarding=true
```

Then `wsl --shutdown` (PowerShell) and relaunch Ubuntu. Verify: `free -h` inside WSL shows the capped total. Keep the swap file on NVMe (default location is fine). Do not set memory so low that vLLM's CPU-side load OOMs — if the kernel OOM-killer fires during model load, raise memory by 4–8 GB and retry.

### 3.4 CUDA toolkit inside WSL (optional, nvcc only)

vLLM/torch wheels bundle their own CUDA runtime — the toolkit is needed only if you compile anything (e.g., a source-build fallback). Use the **`wsl-ubuntu` meta-package repo**, which excludes the driver; a standard runfile/desktop installer would overwrite the host stubs (RTX RQ4 rule 4).

```bash
# documented wsl-ubuntu pattern (RTX RQ4 rule 4); exact keyring filename UNVERIFIED — probe the repo index if 404:
wget https://developer.download.nvidia.com/compute/cuda/repos/wsl-ubuntu/x86_64/cuda-keyring_1.1-1_all.deb
sudo dpkg -i cuda-keyring_1.1-1_all.deb
sudo apt-get update
sudo apt-get install -y cuda-toolkit-12-8     # CUDA 12.8 = first toolkit with sm_120 (RTX RQ1)
nvcc --version                                 # 12.8; PATH may need /usr/local/cuda-12.8/bin
```

### 3.5 Docker: two options (pick ONE)

**Option A1 — Docker Desktop, WSL2 backend (simplest):**
1. Install Docker Desktop for Windows **>= 4.31.1** (older versions fail GPU entirely — NVIDIA forum PSA 299421, RTX RQ4 rule 5). Free for personal use (ZOR RQ3 licensing).
2. Settings → General: "Use the WSL 2 based engine". Settings → Resources → WSL Integration: enable for `Ubuntu-24.04`.
3. Docker Desktop **bundles its own Container Toolkit — do NOT install NCT manually inside WSL** in this option. It ships **no CDI spec**, so `--device nvidia.com/gpu=all` fails; use `--gpus all` (legacy hook). (ZOR RQ4 "WSL2 vs native".)
4. Verify from Ubuntu: `docker run --rm --gpus all nvidia/cuda:12.4.1-base-ubuntu22.04 nvidia-smi` → standard nvidia-smi table inside the container (ZOR RQ4 validation pattern).

**Option A2 — Docker Engine inside WSL + NCT with no-cgroups (no Desktop):**
1. Install Docker Engine exactly as in §4.4 (same Ubuntu 24.04 apt path works inside WSL).
2. Install NCT exactly as in §4.5, then additionally set the WSL2 cgroup workaround (WSL2 lacks the cgroup device controller path):

```bash
sudo nvidia-ctk config --set nvidia-container-cli.no-cgroups=true --in-place
sudo systemctl restart docker    # or: sudo service docker restart (WSL without systemd)
```

(UNVERIFIED: exact flag text — the research snippet was truncated before `=true` (RTX RQ4 rule 6). Probe: `nvidia-ctk config --help` and `sudo nvidia-ctk config get nvidia-container-cli.no-cgroups` if supported; the validation run below is the real test.)
3. Verify: `docker run --rm --gpus all nvidia/cuda:12.4.1-base-ubuntu22.04 nvidia-smi`.

Trade-off: A1 adds a VM hop per `docker exec` (ESTIMATE 0.1–0.5 s vs 0.05–0.2 s native → +2–12 s/task at ~25 calls, BOT E14) and Desktop licensing considerations; A2 is leaner but the no-cgroups flag is snippet-level UNVERIFIED. Both are functional parity, not exact (BOT §3).

### 3.6 VRAM-overhead PROBE — microsoft/WSL#40401 (do this FIRST, before vLLM)

The bug: ~16 GiB "invisible" driver-context overhead (DXGI shim + Hyper-V GPU-PV) on Blackwell under WSL2, reported on RTX PRO 6000; 3–18 GiB contiguous allocations fail despite 50+ GiB free (pytorch#182286, sglang#24364, vllm#41619). Whether it hits the 5090 + current WSL + R580 is **UNVERIFIED — LOW confidence either way** (RTX RQ4 item 1). This probe decides Track A's fate.

**Safety:** never deliberately oversubscribe VRAM under WSL — GPU OOM can panic the whole VM (WSL#40732). The allocations below stay well under physical VRAM. Close GPU-heavy Windows apps (games, browsers with hardware acceleration) first.

```bash
source ~/bcf/venv/bin/activate    # torch 2.10.0 from the wheelhouse (§2.5)
# Step 1 — baseline (Windows host usage):
/usr/lib/wsl/lib/nvidia-smi --query-gpu=memory.total,memory.used --format=csv,noheader
# record USED_BASELINE (MiB). Expect ~500-1500 MiB with a quiet desktop (ESTIMATE, RTX RQ4 item 5).

# Step 2 — init CUDA context + allocate 4 GiB, then compare:
python - <<'EOF'
import torch, subprocess
torch.cuda.init()
a = torch.empty(4 * 1024**3 // 2, dtype=torch.float16, device='cuda')  # 4 GiB
torch.cuda.synchronize()
out = subprocess.check_output(['/usr/lib/wsl/lib/nvidia-smi',
      '--query-gpu=memory.used', '--format=csv,noheader,nounits']).decode().strip()
used = int(out.split('\n')[0])
reserved = torch.cuda.memory_reserved() / 2**20
print(f"nvidia-smi used: {used} MiB | torch reserved: {reserved:.0f} MiB")
print(f"overhead_vs_baseline = used - USED_BASELINE - reserved  (compute with your baseline)")
# Step 3 — contiguous 12 GiB allocation (the #40401/#182286 failure class):
b = torch.empty(12 * 1024**3 // 2, dtype=torch.float16, device='cuda')
torch.cuda.synchronize()
print("12 GiB contiguous alloc: OK")
del a, b; torch.cuda.empty_cache()
EOF
```

**Decision thresholds (plan policy, derived from RTX RQ4/RQ5):**

| Result | Verdict | Action |
|---|---|---|
| Invisible overhead ≤ 2 GiB AND 12 GiB contiguous alloc OK | **PASS** | Continue Track A; use util ≤ 0.90 in §5 |
| Overhead 2–6 GiB, allocs OK | **MARGINAL** | Track A usable only with reduced KV budget; re-run §5.4 probe; prefer Track B for final validation runs |
| Overhead > 6 GiB, OR any multi-GiB contiguous alloc fails, OR `used` jumps ~16 GiB at context init | **FAIL** | **Stop. Track A is disqualified for this workload → go to Track B (§4).** Log the numbers in §8 |

Also record `memory.total` — the fit math in §5.4 uses the actual reported total, not "32 GB".

### 3.7 CUDA-graph capture check + enforce-eager fallback

After the first vLLM startup (§5), inspect the log for graph-capture lines (e.g., "Capturing CUDA graphs", counts like PIECEWISE/FULL per BOT 749191). If capture fails with `cudaErrorUnknown`:

1. Re-verify `wsl --version` ≥ 2.7.0 (the fix, §3.2) and the Windows driver is current.
2. Fallback: add `--enforce-eager` to the serve command. Cost: slower decode (pre-2.7.0 reports ~8x throughput loss; with graphs otherwise working expect a smaller but real penalty), faster startup, less graph VRAM (SRV Q3/Q5; RTX RQ3). Register the deviation (§8).
3. Separate failure class: vLLM V1 engine hangs at startup on WSL2+5090 (EngineCore spawns, ZMQ never connects) — vllm#44732, reported on v0.21–0.22; **0.19.1 status UNVERIFIED**. If it happens: confirm `VLLM_WORKER_MULTIPROC_METHOD=spawn` is set (GS §1); as a diagnostic only, try `VLLM_ENABLE_V1_MULTIPROCESSING=0` (SRV Q8 — changes scheduling determinism; do not keep it for parity runs without registering it). If still hung → Track B.

### 3.8 Sysmem-fallback policy (Windows setting; WSL does not honor it)

Windows NVIDIA Control Panel → Manage 3D Settings → (Global or Program Settings) → **"CUDA - Sysmem Fallback Policy" → "Prefer No Sysmem Fallback"** (setting exists since driver 536.40). Intent: stop VRAM oversubscription from silently paging to system RAM at 10–30x slowdown.

**Caveat (microsoft/WSL#11050, RTX RQ4 item 4):** this policy is reportedly **NOT honored inside WSL2**. Treat the Control Panel change as best-effort for Windows-side processes only. **Registry equivalent: UNVERIFIED** — the research notes capture no registry value name/path for this policy; do not apply undocumented registry edits. Probe instead: during vLLM startup and the first eval, watch `/usr/lib/wsl/lib/nvidia-smi` — if `memory.used` exceeds physical VRAM or decode throughput collapses without a config change, sysmem fallback is active. **The real mitigation is sizing the workload to physical VRAM** (§5.4) and never raising `gpu-memory-utilization` past the probe-verified ceiling. Track B has no such ambiguity (native Linux driver honors the setting; still size to fit).

### 3.9 OOM / VM-panic mitigations (Track A)

- Keep `.wslconfig` memory cap (§3.3) so a runaway process cannot exhaust Windows RAM.
- Never probe by deliberately allocating past VRAM (WSL#40732 panic risk). Use the startup-log KV numbers (§5.4), not trial-and-error OOM.
- If the VM panics/hangs: `wsl --shutdown` from PowerShell, relaunch; if GPU behaves degraded after multi-day uptime (dxgkrnl degradation, forum 384279: ~1.7x slowdown + `dxgvmb_send_sync_msg_wait_for_completion failed` in dmesg), reboot Windows (RTX RQ4 item 6).
- Run evals at `--concurrency 1` for 31B (KV-limited; BOT §3) — this also halves sandbox RAM pressure.
- Keep the vLLM server warm across iterations (BOT §5.2 rank 1): cold startup is ESTIMATE 4–9 min each time.

**Track A finish line:** §2 shared prerequisites done, §7 checklist items 1–9 green. Then §6.

---

## 4. TRACK B — Zorin OS 18.1 native (recommended primary, §9)

Zorin 18.1 (released 2026-04-15) = **Ubuntu 24.04.4 LTS noble**, kernel **6.17 HWE**, GNOME 46 base, **Wayland default** (Xorg session available). All Ubuntu 24.04 NVIDIA/Docker guidance applies verbatim. Support until 2029-06-01. (ZOR RQ1.)

### 4.1 Install / dual-boot

1. Back up Windows data. Shrink the Windows partition from Windows Disk Management to free **≥ 150 GB** (§2.1; ESTIMATE comfortable size). Leave Windows intact for gaming/other work and as the Track A fallback.
2. Download Zorin OS 18.1 Core ISO from zorin.com (UNVERIFIED whether an 18.2 exists by Nov 2026 — ZOR open items; use the current 18.x point release, it is still Ubuntu 24.04 base). Write to USB (e.g., balenaEtcher/Rufus from Windows).
3. **Secure Boot decision (pick one before installing):**
   - **Simplest for a competition dev box: disable Secure Boot in UEFI** (ZOR RQ2 — sidesteps MOK entirely; acceptable on a personal machine).
   - Or keep Secure Boot ON and be ready to enroll MOK (§4.2 step 3). Both open and proprietary modules need signing when Secure Boot is on.
4. Boot the USB. The boot menu offers **"Try or install Zorin OS (modern NVIDIA drivers)"** — prefer it; also tick "Install third-party software for graphics and Wi-Fi" (ZOR RQ2). Choose "Install alongside Windows Boot Manager" (dual-boot) or manual partitioning; install to the freed space. Wayland default is fine: driver 570/580 is far past the 555 explicit-sync baseline, and the eval stack is headless anyway (ZOR RQ1/RQ2).
5. Post-install: `sudo apt update && sudo apt upgrade -y`, reboot. Verify: `lsb_release -a` → Ubuntu 24.04.x, `uname -r` → 6.17.x.

### 4.2 NVIDIA driver: `nvidia-driver-580-open` (the single most important step)

**Blackwell is supported ONLY by the open kernel modules.** Verbatim (NVIDIA driver README 580.82.09, ZOR RQ2): "Blackwell and later are only supported by the open kernel modules." The proprietary `nvidia-driver-580` will fail to bring up a 5090. Minimum branch 570 (first stable 570.124.04, 2025-02-27); recommended today **580+** from noble `restricted`. (ZOR RQ2.)

```bash
# 1. See what's recommended:
ubuntu-drivers devices
# 2. Install the OPEN flavor (apt package name is the safe form; the `nvidia:580-open`
#    ubuntu-drivers selector syntax is UNVERIFIED per ZOR open items):
sudo apt install -y nvidia-driver-580-open
#    (or: sudo ubuntu-drivers install   — auto-selects recommended; confirm it picks an -open package)
# 3. Reboot:
sudo reboot
```

**MOK enrollment (only if Secure Boot stayed ON):** the install prompts for a MOK password. On reboot, the blue **MokManager** screen appears: "Enroll MOK" → Continue → Yes → enter the password. **If you skip/miss this screen, the modules stay unsigned and blocked** → symptom: `nvidia-smi` fails, desktop falls back to llvmpipe software rendering. Recovery if missed: `sudo apt-get install mokutil openssl`, generate/import a signing key (`mokutil --import`), reboot to enroll, sign modules (re-sign on every kernel/driver build) — or just disable Secure Boot and reinstall the driver (ZOR RQ2).

**Do NOT:** use the graphics-drivers PPA for the 5090 (documented 580 boot failure on 5090, fixed by `ppa-purge` + noble restricted driver); use NVIDIA's `.run` installer (bypasses apt/DKMS, breaks on kernel updates, complicates Secure Boot). (ZOR RQ2 items 2–3, failure catalogue.)

### 4.3 Driver verification

```bash
nvidia-smi
# Expect: Driver Version 580.x, CUDA Version 12.8+/13.x, "NVIDIA GeForce RTX 5090", ~32510 MiB total
# (exact total UNVERIFIED — record it for §5.4), near-zero used on a quiet desktop.
lsmod | grep nvidia          # nvidia + nvidia_modeset + nvidia_drm loaded (open flavor)
# If nvidia-smi fails: check `mokutil --sb-state` (Secure Boot), `dmesg | grep -i nvidia`
# (module signature rejection), and that the installed package is the -open variant:
dpkg -l | grep nvidia-driver
```

Then the torch probe (after §2.4–2.5): `python -c "import torch; print(torch.cuda.get_device_capability())"` → `(12, 0)`. On native Linux there is **no WSL#40401 overhead probe to pass** — but still run a 12 GiB contiguous alloc once (same python snippet as §3.6, using plain `nvidia-smi`) to confirm healthy large-alloc behavior before vLLM.

### 4.4 Docker Engine — official apt repo (NOT Docker Desktop)

**Docker Desktop for Linux does NOT support NVIDIA GPU containers** (runs containers in a VM without passthrough; verbatim docker/roadmap#497: "currently due to the virtualization in Linux, docker desktop does not support GPU accelerated containers but it is supported in WSL2"). Use **rootful Docker Engine** — Apache-2.0, free. **Rootless is broken on Ubuntu 24.04** (AppArmor restricts unprivileged user namespaces) and GPU+rootless is problematic — do not use it here. (ZOR RQ3.)

```bash
# Official docs.docker.com/engine/install/ubuntu/ procedure (ZOR RQ3; verify flags live if a step errors):
sudo apt-get update
sudo apt-get install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo docker run --rm hello-world
# Post-install (docs.docker.com/engine/install/linux-postinstall/):
sudo groupadd docker 2>/dev/null || true
sudo usermod -aG docker $USER
newgrp docker    # or log out/in
sudo systemctl enable docker.service containerd.service
docker run --rm hello-world    # now without sudo
```

`VERSION_CODENAME` resolves to `noble` on Zorin 18 (Ubuntu 24.04 base). If you see `NO_PUBKEY ... noble InRelease is not signed`, the keyring placement/permissions are wrong — redo the key steps (ZOR RQ3). Security note: the `docker` group is root-equivalent; acceptable on a dedicated eval box (ZOR RQ3).

### 4.5 NVIDIA Container Toolkit (NCT) + validation

Prereq: host `nvidia-smi` works (§4.3). Official install-guide procedure (ZOR RQ4; snippet-reconstructed — validate live if a step errors):

```bash
curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey | sudo gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg
curl -s -L https://nvidia.github.io/libnvidia-container/stable/deb/nvidia-container-toolkit.list | \
  sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' | \
  sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list
sudo apt-get update
sudo apt-get install -y nvidia-container-toolkit
sudo nvidia-ctk runtime configure --runtime=docker     # writes /etc/docker/daemon.json
sudo systemctl restart docker
# Validation (official sample-workload pattern):
docker run --rm --runtime=nvidia --gpus all ubuntu nvidia-smi
# Classic CUDA-image form (any valid full tag):
docker run --rm --gpus all nvidia/cuda:12.4.1-base-ubuntu22.04 nvidia-smi
# Expect: the standard nvidia-smi table INSIDE the container (driver 580.x, RTX 5090).
```

Use **legacy `--gpus all`** (what the harness/vLLM examples use). CDI (`nvidia-ctk cdi generate --output=/etc/cdi/nvidia.yaml`, `--device nvidia.com/gpu=all`) works on native Linux but is optional — skip it for simplicity (ZOR RQ4). No `no-cgroups` workaround needed here (that is WSL-only).

### 4.6 vLLM env + firewall/disk pitfalls

- Python env + wheelhouse: §2.4–2.5 identical (native Linux, same wheels).
- **Disk:** `/var/lib/docker` (overlay2) holds images/build cache. The vLLM CUDA image (if you use one) is 10–20+ GB; keep models on the big partition. If root is small, set `data-root` in `/etc/docker/daemon.json` (merge with the NCT-written config — do not clobber the `runtimes` block), e.g. `{"data-root": "/home/<YOU>/bcf/docker-data"}`, then `sudo systemctl restart docker`. Prune between runs: `docker system prune`, `docker builder prune`. (ZOR RQ5.)
- **Firewall:** Docker's published ports **bypass UFW** (Docker inserts iptables rules ahead of UFW; Ubuntu 24.04 uses iptables-nft). Mitigation: bind vLLM to `127.0.0.1` only (§5 commands do), never publish sandbox ports (the sandbox is `network_mode=none` anyway). (ZOR RQ5.)
- cgroup v2 is default on 24.04; modern Docker handles it; the eval sandbox runs no systemd inside, so no cgroupns issues (ZOR RQ5).
- Wayland desktop glitches (unlikely on 580): log out → gear icon → "Zorin on Xorg" session (ZOR RQ1/RQ2). Irrelevant to headless eval.

**Track B finish line:** §2 done, §7 items 1–9 green. Then §6.

---

## 5. Serving parity configuration (both tracks)

### 5.1 Flag doctrine (SRV Q3)

- **Numerics-affecting — must match the scorer:** `dtype`, `quantization` (auto), `kv-cache-dtype`, TP size (unavoidable divergence, §5.6), `enable_thinking` via chat-template kwargs, and subtly batch composition (`max_num_seqs`/`max_num_batched_tokens`/chunked prefill) — keep defaults, run concurrency 1.
- **Speed/memory-only — safe to tune locally:** `gpu-memory-utilization`, `enforce-eager`, `swap-space`, prefix caching (default-on V1), `max_loras` count, logging. `max-model-len` is memory-side but **functionally caps context** — reducing it is a registered divergence.
- Keep the known 0.19.1 gemma4 parser bugs (**do not "fix" locally by upgrading**): literal quote chars in tool args (vllm#51284, reproduces on 0.19.1), raw-token leaks (#44522), structured-output silently disabled when `enable_thinking=false` (#39130 — avoided by the competition's thinking=True default), reasoning/tool-parser interaction (#39468), `<pad>` under concurrent tool calls (#39392), `reasoning_content` dropped on incoming assistant messages (#38488 — the 744354 family), and the array-argument server freeze (753973; compound of model repetition + parser bugs; upstream no-progress guard vllm#41991 not deployed). Identical on Kaggle at 0.19.1 → fidelity preserved. (RTX RQ3; SRV Q4; INTEL §3.)
- Gemma-4 engine quirk: heterogeneous head dims (256 sliding / 512 global) force the **TRITON_ATTN** backend (vllm#38918; FlashAttention lacks head_dim=512 GQA support). Expect it in the log; it is not an error. (RTX RQ3.)
- W4A16 on sm_120 runs via **Marlin** weight-only kernels (CC > 8.0 required; 5090 = 12.0 qualifies). **Avoid NVFP4 checkpoints** — CUTLASS FP4 GEMM is broken on consumer Blackwell (sm_120 lacks tcgen05 paths), falls back to Marlin anyway (#31085/#47749). The official `-ct` W4A16 is the safe, parity-correct path. (SRV Q2.)

### 5.2 Exact serve command — 31B (main track)

```bash
source ~/bcf/bin/env.sh && source ~/bcf/venv/bin/activate
vllm serve ~/bcf/models/gemma-4-31b-it-qat-w4a16-ct \
  --served-model-name gemma-4-31b-it-qat-w4a16-ct \
  --host 127.0.0.1 --port 8000 \
  --tensor-parallel-size 1 \
  --dtype bfloat16 \
  --max-model-len 32768 \
  --gpu-memory-utilization 0.90 \
  --enable-auto-tool-choice \
  --tool-call-parser gemma4 \
  --reasoning-parser gemma4 \
  --default-chat-template-kwargs '{"enable_thinking": true}' \
  --enable-lora --max-loras 8 --max-lora-rank 128 \
  2>&1 | tee ~/bcf/logs/vllm-31b-$(date +%Y%m%d-%H%M%S).log
# OMIT --quantization: compressed-tensors auto-detect (SRV Q2).
# --kv-cache-dtype: omitted = auto (bf16) = scorer parity; add fp8 ONLY per §5.4.
# --enforce-eager: omitted = CUDA graphs on = scorer parity; add ONLY per §3.7/§5.4.
```

Flag provenance: HR §3.1/§3.3 + GS §4 (`VllmConfig` literal: port 8000, host 127.0.0.1, parsers gemma4, max_model_len 32768, dtype bfloat16, util 0.90, enable_auto_tool_choice, enable_lora/8/128, startup_timeout 1200) + SRV recommended config. `--served-model-name` makes `/v1/models` report the registry alias the harness expects (HR §3.3 binds `openai/<served_model>`). TP1 is forced by hardware (one GPU). If you use LoRA adapters later, add `--lora-modules name1=<path1> ...` exactly as `discover_adapters` does (HR §3.4).

**Memory note:** LoRA buffers are preallocated for `max_loras x max_lora_rank` even with no adapter loaded (SRV Q7). If the KV probe is tight and you run **without** adapters, reduce `--max-loras 1` (memory-only, no numerics effect) and register it; keep `--max-lora-rank 128` for capability parity. BCF ships no adapters today (BOT §5 rank 9: "No LoRA (BCF)").

### 5.3 Exact serve command — E4B (bonus track)

```bash
vllm serve ~/bcf/models/gemma-4-e4b-it-qat-w4a16-ct \
  --served-model-name gemma-4-e4b-it-qat-w4a16-ct \
  --host 127.0.0.1 --port 8000 \
  --tensor-parallel-size 1 \
  --dtype bfloat16 \
  --max-model-len 32768 \
  --gpu-memory-utilization 0.90 \
  --enable-auto-tool-choice \
  --tool-call-parser gemma4 \
  --reasoning-parser gemma4 \
  --default-chat-template-kwargs '{"enable_thinking": true}' \
  --enable-lora --max-loras 8 --max-lora-rank 128 \
  2>&1 | tee ~/bcf/logs/vllm-e4b-$(date +%Y%m%d-%H%M%S).log
```

E4B (~4–5 GB weights, BOT §3) fits 32k context with large headroom — run the §5.4 probe anyway to record the number. E4B's sliding window is 512 (vs 1024 for 31B) per SRV Q6 source (newsletter.maartengrootendorst.com); its exact layer/head config is **UNVERIFIED** — read the startup KV log rather than extrapolating 31B math. The E4B recipe additionally mentions `--chat-template examples/tool_chat_template_gemma4.jinja` (RTX RQ3, MEDIUM confidence): **UNVERIFIED whether the `-ct` checkpoint needs it** — probe = tool-call smoke (§7 item 7) without it first; add only if tool calls fail to parse, and register the template provenance. E4B is the variant where the array-parser freeze was first hit (753973) — keep array-typed tool parameters out of all schemas (INTEL implication 8) and run the freeze canary before any bonus run.

### 5.4 KV-fit PROBE and max-model-len decision tree (the load-bearing procedure)

**Why this is uncertain:** Gemma-4-31B has 50 sliding-window layers (window 1024, 16 KV heads, head_dim 256) + 10 global layers (4 KV heads, head_dim 512). Per-token KV (SRV Q6, RTX RQ5 arithmetic):

| Allocation scheme | bf16 bytes/token | One 32,768-token sequence |
|---|---|---|
| **Uniform** (sliding layers pay full length — vllm#39133 behavior) | 901,120 B ≈ 880 KiB | ≈ **27.5 GiB** (fp8: 13.75 GiB) |
| **Sliding-aware hybrid** (SWA capped at 1024) | 81,920 B/token global + fixed 800 MiB/seq SWA | ≈ **3.28 GiB** (fp8: 1.64 GiB) |

Evidence leans **uniform** for the 0.19 era: vllm#39133 log "Available KV cache memory: 4.32 GiB, GPU KV cache size: 9,424 tokens" reconciles with uniform TP2 math; tt-xla#5727 "sliding-window layers pay full KV". Counter-evidence: bf16 page sizes ARE divisible (16,384 B vs 8,192 B per layer-token), so the hybrid manager *could* work on CUDA. **Unresolved — decide empirically.** (RTX RQ5; SRV Q6.) BOT E4/E5 independently estimates ~0.94 MiB/token and ~10–12k tokens bf16 / ~20–24k fp8 on the 5090 — same uniform-world conclusion.

**Budget arithmetic (ESTIMATE, RTX RQ5):** 5090 reports ~31.8 GiB total (record actual); Track A subtracts Windows host ~0.5–1.5 GiB; weights ~17 GB ≈ 15.8 GiB; non-KV overhead (activations, CUDA graphs, LoRA buffers) ~1.5–3 GiB. At util 0.90 → ~28.6 GiB vLLM budget → **~9–11 GiB for KV**. Kaggle's 4xL4 TP4 fits 32k under EITHER scheme (~12.9 GiB/GPU < 20.4 GiB budget) — the single-5090 port is the risky case because TP1 concentrates all KV heads on one card.

**Procedure:**

1. Start the §5.2 command as written (bf16 KV, util 0.90, max-model-len 32768). Read the startup log:
   - `GPU KV cache size: N tokens` ← **the number that decides everything**
   - `Available KV cache memory: X GiB`
   - any `Hybrid KV cache layout` / `num_kv_cache_groups` line (>1 group = sliding-aware). (RTX recommended-stack item 6; SRV Q6 action; BOT M2.)
2. **Branch:**

```text
Startup succeeds AND N >= 32768?
├─ YES (hybrid world): KEEP max-model-len 32768, bf16 KV. Full parity.
│    Concurrency ceiling = floor(N / 32768) full-context sequences; still run --concurrency 1.
└─ NO — ValueError "The model's max seq len (32768) is larger than the maximum ... KV cache"
   or N < 32768 (uniform world):
   ├─ Step 1: add --kv-cache-dtype fp8  (per-tensor fp8_e4m3; halves KV).
   │    Restart, re-read N_fp8.
   │    ├─ N_fp8 >= 32768: KEEP 32768 + fp8 KV. REGISTER numerics divergence (§8):
   │    │    small quant error; vLLM Apr-2026 blog reports <=0.7pt impact / ~99% recovery (SRV Q3).
   │    │    Do NOT use int8_per_token_head — it corrupts Gemma-4 output (vllm#49716, #40388 family).
   │    │    If fp8 startup hits a #40388-family page-size error → revert to bf16, go to Step 2.
   │    └─ N_fp8 < 32768: go to Step 2 with fp8 kept.
   ├─ Step 2: reduce --max-model-len to the largest power-of-two <= N (round down):
   │    bf16 uniform → expect ~8192–10240 (BOT E5: ~10–12k; RTX RQ5: ~9–11k at 0.85–0.90)
   │    fp8 uniform  → expect ~16384–20480 (RTX RQ5: 16384 fits at ~25.2 GiB total)
   │    REGISTER functional divergence (§8): context cap < 32768. BCF's steady-state context
   │    is < 12k by design (BOT §7 note 6), so 16384 is tolerable; ~10k is marginal —
   │    any A/B relying on long-context behavior is non-predictive.
   ├─ Step 3 (optional, before accepting a reduced len): --enforce-eager frees CUDA-graph VRAM
   │    (~2.19 GiB on the remote rig per BOT 749191; forum caveat: may NOT yield more KV blocks,
   │    SRV Q5). Re-read N. Keep only if it buys a meaningfully larger len; register speed divergence.
   └─ Step 4 (optional): raise --gpu-memory-utilization to 0.95 (memory-only lever; recipe range
        0.90–0.95, RTX RQ3). Track A: re-check §3.8 sysmem-fallback behavior first; never exceed
        the probe-verified physical ceiling. Re-read N.
3. Record in ~/bcf/results/PINS.txt: actual VRAM total, util, KV dtype, N tokens, max_model_len,
   eager/graphs, and the branch taken. This record travels with every eval run (§6.6).
```

**Expected verdict (ESTIMATE, pre-registered):** uniform-world → **fp8 KV + max_model_len 16384** is the most likely landing zone that preserves BCF's <12k design context; bf16-only fallback lands ~10k. If the hybrid world materializes, full 32768 bf16 parity is achieved. Either way the probe takes <15 min and replaces the biggest open question in the research (RTX open question 1; SRV open gap 2).

### 5.5 fp8 KV tradeoff summary

`--kv-cache-dtype fp8` halves KV bytes (fp8_e4m3, scales default 1.0 — "may cause accuracy issues" unless calibrated; measured ≤0.7pt impact / ~99% recovery on AIME25 per vLLM Apr-2026 blog, SRV Q3 MEDIUM-HIGH). It is the pragmatic 5090 lever, **not** scorer parity (scorer = auto/bf16). Per-tensor fp8 is reported working for Gemma-4 in DGX Spark threads; whether 0.19.1+CUDA+gemma4-31B accepts it is an **open question** (RTX RQ5 caveat) — the probe in §5.4 Step 1 answers it. Never use the per-token-head/int8 paths (#40388, #49716).

### 5.6 Why TP1 ≠ TP4 means comparing task metrics, not tokens

Changing TP size changes the floating-point **all-reduce reduction order** → different logits → different tokens even at temperature 0, independent of every other flag. vLLM's batch-invariant kernels stabilize batch-size/order effects but **do not** make TP sizes interchangeable (cross-TP determinism needs newer Tree-Based Invariant Kernels, arXiv 2511.17826 — not in 0.19.1). (SRV Q8, HIGH.) Consequences for this project:

- Do not diff raw generations local-vs-Kaggle and conclude "broken" — bitwise equality is impossible.
- Compare **task-level metrics**: resolution rate on the frozen valid-task set, tool-call correctness, edit-failure rates, per-task token/time budgets — with replication (2 runs on a fixed ~30-task set + held-out remainder; a change counts only if it wins on both; ignore single-run deltas <4 tasks; ~10–13% per-task flip rate is normal). (INTEL C14/C11, implication 16; SRV Q8.)
- Optionally enable batch-invariance locally to remove batch-size noise (does not fix the TP gap) — register if used.

---

## 6. Harness wiring (both tracks)

### 6.1 Stage the submission copies and data

```bash
# Copy (never move/edit) the BCF submission trees out of deliverables/:
cp -r "<PROJ>/deliverables/2026-11-11-bcf-gemma4-brain/02-bcf-brain-31b/submission" ~/bcf/submissions/bcf-31b
cp -r "<PROJ>/deliverables/2026-11-11-bcf-gemma4-brain/03-bcf-brain-e4b/submission" ~/bcf/submissions/bcf-e4b
# <PROJ> = d:/stuff/ai-misc/_bsh2026/vscode_project01/46-wide_research_test_alibaba
# Track A: prefix with /mnt/d/... for this ONE-TIME copy only (ext4 rule §2.1).

# Snapshots: full extraction already done in §2.2 (21.5 GB). Selective alternative for fast iteration:
unzip -j ~/bcf/downloads/gemma-4-developer-agent.zip \
  "snapshots/rich_3454.tgz" "snapshots/fastapi_14361.tgz" "snapshots/requests_7502.tgz" \
  -d ~/bcf/data/snapshots/
# (snapshot names are <instance_id>.tgz — verified in zip_listing.txt)

# Graphs + embeddings: keep them extracted. build_agent_prompt appends the Code Intelligence
# section ONLY when graph .json + embedding .npz exist (HR §5.2 section 6) — the scorer has them,
# so removing them locally changes the prompt and breaks parity even though BCF doesn't use the tools.
```

### 6.2 Start the server

Use §5.2 (31B) or §5.3 (E4B). Wait for `/health` 200 and record startup wall time (BOT M1). Keep it warm across iterations. The notebook alternative — `adk_submission.VllmServer(VllmConfig(...))` with the GS §4 literal — manages the same process for you; either is fine as long as the flags match §5. `startup_timeout=1200` matches `VLLM_ENGINE_READY_TIMEOUT_S=1200`.

### 6.3 Path 1 (recommended for full parity): Python driver replicating GS §5

The notebook flow wires `EvalConfig` explicitly — every budget and compaction knob is visible and echo-able. Save as `~/bcf/bin/run_eval.py` (our script dir; data elsewhere):

```python
#!/usr/bin/env python3
"""Local parity eval driver — adapts GettingStarted §4-5 (GS) to local paths.
Run: python ~/bcf/bin/run_eval.py <submission_dir> <results_dir> [task_id ...]
"""
import sys, asyncio, pathlib, yaml
import litellm
from adk_submission import VllmServer  # only if you want the harness to manage the server;
                                        # with an external `vllm serve`, skip VllmServer and
                                        # build the registry as shown below.
from google.adk.agents.context_cache_config import ContextCacheConfig
from google.adk.apps._configs import EventsCompactionConfig
from swegemma.config import EvalConfig, build_submission_limits
from swegemma.evaluate import Evaluator
from swegemma.models import load_tasks

litellm.drop_params = True                      # GS §4
DATA = pathlib.Path.home() / "bcf/data"
submission_dir = pathlib.Path(sys.argv[1])
results_dir = pathlib.Path(sys.argv[2])
task_ids = sys.argv[3:]

# --- budgets: read the submission's eval_config.yaml exactly like scripts/inference.py (HR §7.1) ---
raw = yaml.safe_load((submission_dir / "eval_config.yaml").read_text())
ev = raw.get("evaluation", raw)
timeout_seconds = int(ev.get("timeout_seconds", 300))
max_tool_calls = int(ev.get("max_tool_calls", 100))
max_time_minutes = float(ev.get("max_time_minutes", 60.0))
turns_raw = ev.get("max_turns", ev.get("max_llm_calls"))
max_turns = int(turns_raw) if turns_raw is not None else None

tasks = load_tasks(DATA / "tasks.jsonl")
if task_ids:
    tasks = [t for t in tasks if t.instance_id in task_ids]
limits, gen_constraints = build_submission_limits()

# --- model registry: bind alias -> local server (HR §3.3 pattern) ---
from adk_submission import create_model_registry  # UNVERIFIED import location: GS §4 uses
# server_instance.create_model_registry(...). If you run an external vllm serve, construct the
# registry the same way VllmServer does — probe: python -c "import adk_submission, inspect;
# print([n for n in dir(adk_submission) if 'registr' in n.lower()])" and inspect VllmServer.
# Fallback that is fully grounded: instantiate VllmServer with the GS §4 VllmConfig (it will
# start/attach the server) and call .create_model_registry(aliases=[...], model_prefix='openai/',
# api_key='EMPTY').
models = ...  # registry from the probe above; alias gemma-4-31b-it-qat-w4a16-ct (or e4b)

eval_config = EvalConfig(
    tasks_path=DATA / "tasks.jsonl",
    snapshots_dir=DATA / "snapshots",
    results_dir=results_dir,
    submission_dir=submission_dir,
    models=models,
    sandbox="docker",                      # LOCAL: docker (HR §4.1 default; notebook used subprocess)
    timeout_seconds=timeout_seconds,
    max_time_minutes=max_time_minutes,
    max_tool_calls=max_tool_calls,
    max_turns=max_turns,
    limits=limits,
    generation_constraints=gen_constraints,
    context_cache_config=ContextCacheConfig(min_tokens=2048, ttl_seconds=1800, cache_intervals=10),
    events_compaction_config=EventsCompactionConfig(
        compaction_interval=5,             # HR §7.2 (scripts/inference.py). GS §5 notebook uses 15.
        overlap_size=2,                    # See §6.5 — resolve via source probe; echo whichever you use.
        token_threshold=14336,
        event_retention_size=5,
    ),
    graph_dir=str(DATA / "graphs"),
    embeddings_dir=str(DATA / "embeddings"),
    wheels_dir=DATA / "wheels",
    verbose=False,
)
# --- PARITY ECHO (mandatory, §7 item 14) ---
print("EVAL_CONFIG:", eval_config)
print("COMPACTION:", eval_config.events_compaction_config)
print("CONTEXT_CACHE:", eval_config.context_cache_config)

evaluator = Evaluator(eval_config)
async def main():
    for i, t in enumerate(tasks, 1):
        r = await evaluator.evaluate_task(task=t, task_index=i, total_tasks=len(tasks))
        print(t.instance_id, "resolved=", r.resolved, "exit=", r.test_exit_code,
              "patch_chars=", len(r.agent_patch or ""), "calls=", r.tool_calls,
              "dur=", round(r.duration_seconds, 1))
asyncio.run(main())
```

(UNVERIFIED items are flagged inline with probes; the structure — `EvalConfig` fields, `Evaluator.evaluate_task`, `load_tasks`, `build_submission_limits`, compaction/cache configs — is verbatim from GS §5 and HR §7. The `models` registry construction is the only piece GS does via `server_instance.create_model_registry`; using `VllmServer` itself removes the uncertainty.)

### 6.4 Path 2 (convenience): `swegemma eval` CLI (HR §9.1)

```bash
source ~/bcf/bin/env.sh && source ~/bcf/venv/bin/activate
swegemma eval \
  --tasks ~/bcf/data/tasks.jsonl \
  --snapshots-dir ~/bcf/data/snapshots \
  --submission-dir ~/bcf/submissions/bcf-31b \
  --results-dir ~/bcf/results/run_01 \
  --sandbox docker \
  --max-tool-calls 50 \
  --max-time-minutes 4.5 \
  --concurrency 1 \
  --display auto \
  --task-ids rich_3454 fastapi_14361 requests_7502
```

- Budgets: BCF31 = **180 s command timeout / 50 tool calls / 4.5 min / 50 turns**; BCFE4 = **150 s / 40 / 4.0 min / 40 turns** (BCF31/BCFE4 `eval_config.yaml`, read-only verified). The CLI flags above set calls/time; **UNVERIFIED whether the CLI also reads the submission's `eval_config.yaml`** (HR §7.1 documents that load for `scripts/inference.py`) or exposes `timeout_seconds`/`max_turns` flags — probe: `swegemma eval --help`, then confirm via the task prompt's "Task Budget" section and `get_status` output in `~/bcf/results/run_01/logs/` (§7 item 14). If the CLI cannot set them, use Path 1.
- `--models-yaml <path>`: "Custom models.yaml file mapping model aliases and token pricing" (HR §9.1). The file format is **UNVERIFIED** (not shown in any local doc). Probe: `swegemma eval --help`, then inspect the installed source (`python -c "import swegemma, pathlib; print(pathlib.Path(swegemma.__file__).parent)"`, grep for `models_yaml`). Template to try (UNVERIFIED):

```yaml
# ~/bcf/bin/models.yaml — UNVERIFIED format; validate against swegemma source before trusting
models:
  gemma-4-31b-it-qat-w4a16-ct:
    model: openai/gemma-4-31b-it-qat-w4a16-ct
    api_base: http://127.0.0.1:8000/v1
    api_key: EMPTY
    input_cost_per_token: 0.0
    output_cost_per_token: 0.0
```

  If the CLI insists on starting its own server, point it at the same checkpoint with §5 flags; if it can attach to an existing `127.0.0.1:8000`, prefer that (warm server). When in doubt, Path 1 has zero format uncertainty.
- Useful flags (HR §9.1): `--task-id`/`--task-ids` for rapid debugging; `--shard-index k --num-shards M` for deterministic shards; `--skip-agent-patch` to verify baseline-failure behavior in Phase 2; `--concurrency N` (keep 1 for 31B KV; E4B may tolerate 2 — re-check the KV probe).
- Results artifacts (HR §9.2): `summary.json`, `task_results.jsonl`, `patches/<id>.patch`, `test_outputs/<id>.log`, `traces/trace_<id>.json`, `logs/<id>.log` — these feed BOT M3–M15 measurements.

### 6.5 Compaction discrepancy (resolve once, then freeze)

HR §7.2 says `scripts/inference.py` uses `compaction_interval=5`; the GS §5 notebook passes `15`; INTEL C12 corroborates the 14,336 trigger and last-5 retention. Which the **managed scorer** runs is **UNVERIFIED**. Probe: grep the installed wheelhouse source —

```bash
grep -rn "compaction_interval" ~/bcf/venv/lib/python3.12/site-packages/swegemma/ | head
# and, if scripts/inference.py ships in the wheel or data package, grep it too.
```

Use what `scripts/inference.py`/swegemma defaults say (scorer path), echo it in every run (§7 item 14), and register the choice. The threshold (14,336), overlap (2), retention (5) agree across all sources — those are exact.

### 6.6 Pin manifest per run

Write `~/bcf/results/<run>/PINS.txt` before each run: wheelhouse version + parser SHA, vllm/torch/transformers/swegemma/adk-submission/google-adk versions, Python version, serve command line, KV probe verdict (N tokens, dtype, max_model_len, util, eager), track (A/B), driver version, WSL version (Track A), compaction interval. (BOT §6 instrumentation discipline: "Record the pin in each results dir.") Without this, A/B results are uninterpretable.

### 6.7 Subprocess-backend alternative and network-none equivalence

- `--sandbox subprocess` (what the GS notebook itself uses on Kaggle): creates `swegemma_sandbox_<id>_` with `workspace/ tmp/ wheels/ venv/`, rewrites `/workspace`, `/tmp`, `/wheels`, `/usr/local/bin` references, new process group + `killpg` on timeout (HR §4.1). Expect the `ensurepip unavailable ... creating venv without pip` warning (visible in GS §5 output — benign). **Divergences:** no 4 GiB/2 vCPU quota and **no documented network isolation** (HR describes filesystem/process isolation only — UNVERIFIED whether network is blocked; assume NOT air-gapped). An agent that `pip install`s could succeed locally and fail on the scorer. Use subprocess only for quick debugging or when Docker is unavailable; **all parity runs use `--sandbox docker`**.
- Docker backend equivalence checks (during a run): `docker ps` → grab the sandbox container id, then `docker inspect <id> --format '{{.HostConfig.NetworkMode}} {{.HostConfig.Memory}} {{.HostConfig.CpuQuota}}/{{.HostConfig.CpuPeriod}}'` → expect `none 4294967296 200000/100000` (HR §4.1). The agent cannot reach PyPI — or the vLLM server — from inside; LLM calls flow harness→`127.0.0.1:8000` outside the sandbox, exactly as on Kaggle.
- Keep the 2-vCPU/4 GiB quota even though the desktop is faster: without it, local bootstrap/pytest times **underestimate** the scorer's `G only` costs and your 12 h extrapolation (BOT M12/M14) becomes optimistic (BOT §3 bootstrap rows).

---

## 7. Parity verification checklist

Run in order. Items 1–9 gate serving; 10–14 gate eval interpretation. Record every output under `~/bcf/results/verify/`.

| # | Check | Command | Expected output |
|---|---|---|---|
| 1 | GPU visible, driver correct | Track A: `/usr/lib/wsl/lib/nvidia-smi` · Track B: `nvidia-smi` | RTX 5090, driver 580.x, ~32 GB total (record exact MiB); Track A used ≈ 0.5–1.5 GiB idle (ESTIMATE) |
| 2 | torch sm_120 + pins | `python -c "import torch,vllm,transformers; print(torch.__version__, vllm.__version__, transformers.__version__, torch.cuda.get_device_capability())"` | `2.10.0+cu128 0.19.1 5.5.x (12, 0)` (§2.5) |
| 3 | Parser SHA + lib pins | `sha256sum ~/bcf/venv/lib/python3.12/site-packages/vllm/tool_parsers/gemma4_tool_parser.py` + `pip show swegemma adk-submission google-adk` | SHA `682b2152b76c031df9c58c3ffbb5b243945be5d8957ebdce00faef1b9de6b889`; 0.2.11 / 0.2.13 / 1.36.1 (INTEL impl 22) |
| 4 | Track A only: WSL#40401 probe | §3.6 procedure | overhead ≤ 2 GiB, 12 GiB contiguous alloc OK → PASS; else §3.6 table |
| 5 | Docker GPU passthrough | `docker run --rm --gpus all nvidia/cuda:12.4.1-base-ubuntu22.04 nvidia-smi` | nvidia-smi table inside container (ZOR RQ4) |
| 6 | Sandbox image contract | `docker run --rm swebench-sandbox:latest bash -lc 'python3 -V; python3 -c "import imp,telnetlib,pytest"; echo $TEST_TMPDIR; pwd; git config user.name'` | Python 3.13.x; no ImportError; `/tmp`; `/workspace`; `Agent` (§2.3; DK) |
| 7 | vLLM up + model alias | `curl -s http://127.0.0.1:8000/v1/models` | JSON `data[0].id == "gemma-4-31b-it-qat-w4a16-ct"` (or e4b); server log shows TRITON_ATTN + Marlin/compressed-tensors load, no sm_120 error (§5.1) |
| 8 | KV-fit probe | read startup log per §5.4 | `GPU KV cache size: N tokens` recorded; branch decision logged in PINS.txt |
| 9 | Tool-call smoke (gemma4 parser, thinking on) | `curl -s http://127.0.0.1:8000/v1/chat/completions -H 'Content-Type: application/json' -d '{"model":"gemma-4-31b-it-qat-w4a16-ct","messages":[{"role":"user","content":"What is the weather in Boston? Use the get_weather tool."}],"tools":[{"type":"function","function":{"name":"get_weather","description":"Get current weather","parameters":{"type":"object","properties":{"city":{"type":"string"}},"required":["city"]}}}],"tool_choice":"auto","temperature":0,"max_tokens":1024}'` | `message.tool_calls[0].function.name == "get_weather"`, arguments parse as JSON with `city` (expect possible literal-quote quirk #51284 — that is parity, not failure); `reasoning_content` non-empty |
| 10 | Reasoning smoke (enable_thinking) | same curl without `tools`, prompt "Solve 17*23 step by step." | `reasoning_content` populated, `content` has the answer. Then one request with `"chat_template_kwargs":{"enable_thinking":false}` → no reasoning (and remember #39130: structured output is silently disabled in that mode — never use it for eval) |
| 11 | Reasoning-drop parity (744354 repro) | (a) code check: `grep -n "reasoning" $(python -c "import google.adk,pathlib;print(pathlib.Path(google.adk.__file__).parent)")/flows/llm_flows/chat_utils.py` around line 1512 (path UNVERIFIED — locate via `grep -rn "reasoning_content" .../google/adk/`); (b) behavior: two-turn tool conversation via `/v1/chat/completions`, pass turn-1 assistant message (with `reasoning_content`) back verbatim in turn 2; inspect what ADK sends (vLLM request log / trace) | (a) installed google-adk 1.36.1 reads only `reasoning`, not `reasoning_content` (INTEL §3: chat_utils.py:1512); (b) thoughts omitted between tool calls — matches the Nov-11 public-v31 repro (reasoning=76 tokens vs reasoning_content=61=omitted, identical sequences). **If local RETAINS thoughts → wheelhouse drift; stop and re-pin.** This is the hedge check for INTEL implication 9 |
| 12 | Gold-patch sandbox runs (3 tasks) | Run Phase-2 verification with each task's gold `patch` field from `tasks.jsonl` (fields verified: `patch`, `test_patch`, `base_commit`). Grounded entry points: `swegemma eval --skip-agent-patch ...` verifies the EMPTY-patch baseline; for gold, feed `task.patch` as the prediction through the verify path (HR §8.2 `verify_task`) — exact CLI/invocation UNVERIFIED, probe `swegemma --help` / `swegemma.evaluate` source; the Python driver can call the same verifier the Evaluator uses. Tasks: `rich_3454`, `fastapi_14361`, `requests_7502` (snapshots staged §6.1) | **Expected per INTEL audits — this is a parity check, not a pass gate:** rich_3454 → gold resolves (rich: 39/48 gold-pass; 3454 not in the blocked list). fastapi_14361 → pytest **collection error** (inline_snapshot/dirty_equals absent — it is in the 27-list, INTEL §4a). requests_7502 → **httpbin fixture errors** (12/13 requests tasks fail this way, INTEL C10). Local must reproduce these failure signatures; a local PASS on 14361/7502 means your sandbox drifted from the public wheelhouse |
| 13 | Sandbox isolation + full-loop smoke with BCF | `swegemma eval ... --submission-dir ~/bcf/submissions/bcf-31b --task-ids rich_3454 --sandbox docker --concurrency 1` (§6.4), then `docker inspect <sandbox-id> --format '{{.HostConfig.NetworkMode}} {{.HostConfig.Memory}} {{.HostConfig.CpuQuota}}/{{.HostConfig.CpuPeriod}}'` during the run | Agent session runs the full protocol (prompt 7 sections, nudges, budgets, submit_patch); inspect = `none 4294967296 200000/100000`; results dir has summary.json / task_results.jsonl / patches / traces / logs (HR §9.2). Then repeat on the frozen valid set (INTEL implication 15) — never A/B on raw 129 |
| 14 | Budget/compaction config echo | Path 1 prints EVAL_CONFIG/COMPACTION/CONTEXT_CACHE (§6.3); Path 2: read the "Task Budget" section in `~/bcf/results/<run>/logs/rich_3454.log` + a `get_status` tool result in the trace | 31B: time 4.5 min, 50 calls, 50 turns, command timeout 180 s; compaction threshold 14,336 / retention 5 / interval per §6.5 probe; cache 2048/1800/10 (HR §7; BCF31 eval_config) |

Optional extras (BOT measurement plan): M4 filesystem-cross benchmark; M5 decode tok/s regression (expect ESTIMATE 50–80 tok/s 31B, >100 E4B — replace with measurement); M13 parser-freeze fuzz canary (≥5,000 bracket-heavy scalar payloads against attached schemas, subprocess + hard timeout; zero hangs before any submission — INTEL implication 8).

---

## 8. Divergence register

Every known local-vs-remote difference. "Register" = write the actual value into `PINS.txt` (§6.6) before interpreting any eval.

| # | Divergence | Impact on interpretation | Mitigation | Source |
|---|---|---|---|---|
| D1 | **TP1 vs TP4** (all-reduce reduction order) | Token-level outputs differ even at temp 0; bitwise comparison meaningless | Compare task metrics with replication (win-both, ≥4-task deltas); optional batch-invariance locally | SRV Q8; §5.6 |
| D2 | **KV ceiling / max_model_len** (likely 16384 fp8 or ~10k bf16 vs 32768) | Long-context behavior (late-task compaction dynamics, overflow at 32k) not reproducible; overflow failures may appear earlier locally | §5.4 probe; keep BCF context <12k; exclude long-context-dependent conclusions; register N tokens | RTX RQ5; SRV Q6; BOT E5 |
| D3 | **fp8 KV vs bf16** (if §5.4 Step 1 taken) | Small quant error (≤0.7pt reported); borderline tasks may flip | Prefer bf16 if it fits; replicate borderline tasks; never per-token-head/int8 | SRV Q3/Q6; vllm#49716 |
| D4 | **enforce-eager vs CUDA graphs** (if used) | Decode slower; startup faster; generally numerics-neutral but register | Only as WSL fallback or KV lever; re-run §7 item 9 after enabling | SRV Q3/Q5; RTX RQ3 |
| D5 | **Decode speed ~1.5–2.3x faster** (50–80 vs 33–35 tok/s ESTIMATE) | Local per-task wall times under-predict Kaggle; a locally-fitting budget can blow the remote 12 h | Calibrate with BOT M12 (s/M-tokens factor) before setting caps; design to remote 33–35 tok/s | BOT E1/E2; 750974 |
| D6 | **Prefill possibly slower** (4xL4 aggregate TFLOPS > 5090) | Compaction/prefill-spike steps may NOT shrink locally; mixed speedup | Measure M5 decomposition; don't assume uniform speedup | BOT E3 |
| D7 | **No queue, no 12 h kill, no daily slots** | Local iteration is unbounded; remote burns slots on failures; local can't rehearse queue pathology | Self-enforce budgets; extrapolate total with M14 (≤11.0 h target); submit early, fallback bundle | INTEL S2/C13/C18; BOT §1 |
| D8 | **WSL2 overhead (Track A only):** ~2–5% compute, ~0.5–1.5 GiB VRAM host share, exec VM hop +2–12 s/task, WSL#40401/#40732/#11050 tail risks | Slightly pessimistic times; KV budget smaller; fatal if #40401 reproduces | §3.6 probe gate; ext4 rule; util ceiling; Track B for final validation | RTX RQ4; BOT E14/E20 |
| D9 | **gpu_memory_utilization 0.90 local vs 0.80 scorer** (notebook also 0.90) | Memory-only: changes KV capacity/preemption, not numerics | Register; never compare preemption-sensitive metrics without noting it | HR §3.1; GS §4; SRV Q3 |
| D10 | **Wheelhouse version drift** (v31 vs whatever downloads today; managed-scorer reasoning-fix state UNKNOWN) | Parser/ADK behavior changes invalidate A/B; local reasoning-retention could differ from scorer | SHA gate (§7 item 3); reasoning-drop repro (§7 item 11); retention-agnostic agent design (restate state in visible text) | INTEL S4, impl 9/22 |
| D11 | **Compaction interval 5 (HR) vs 15 (GS notebook)** — scorer value UNVERIFIED | Compaction frequency differs → context-loss dynamics differ | §6.5 source probe; echo; register | HR §7.2; GS §5 |
| D12 | **Sandbox CPU faster than 2-vCPU quota if quota removed** | Bootstrap/pytest under-predict remote `G only` costs | Keep docker backend's 4g/2-vCPU (automatic); verify §7 item 13 | HR §4.1; BOT §3 |
| D13 | **Subprocess backend: no air-gap, no quota** (if used) | Agent may pip-install locally; times non-predictive | Docker for all parity runs; subprocess debug-only | HR §4.1; GS §5; §6.7 |
| D14 | **Docker Desktop exec hop (Track A option A1)** | +2–12 s/task ESTIMATE | Option A2 or Track B; measure M3 | BOT E14 |
| D15 | **max_loras reduced (if KV-tight)** | Memory-only; adapter-serving capacity differs (BCF uses none) | Keep rank 128; register count | SRV Q7 |
| D16 | **OS/kernel/driver differ from Kaggle's unpublished image** | Unknown unknowns; Kaggle never published a digest (757782 unanswered) | Pin what is knowable (wheelhouse SHA); treat residual as noise; replicate runs | INTEL §3 757782 |
| D17 | **Local "resolved" is an upper bound** (scorer conventions: rich_3486/fastapi_14186 never resolve; 27 fastapi collection failures; 12 requests httpbin; 5 empty-pass) | Raw-129 local rates are incomparable to LB and noisy | Frozen valid set (68 per 756400, reconciled by your own gold+empty audit); exclude blocked tasks from denominators | INTEL C6/C7/C8/C10, impl 15 |
| D18 | **LoRA startup OOM edge not fully reproducible at TP1** (remote: cudagraph_specialize_lora doubling, 749191) | If you add adapters later, local memory behavior differs | Keep `VLLM_MEMORY_PROFILER_ESTIMATE_CUDAGRAPHS=1`; canary adapter startup before any scored LoRA run | BOT §2; GS §1 |

---

## 9. Decision tree, recommendation, time estimates, maintenance

### 9.1 Decision tree

```text
START (today)
│
├─ Already have WSL2 + Docker Desktop? ──yes──► TRACK A fast path (§3.1–3.5, ~1 h)
│        │                                        │
│        no                                       ▼
│        │                              §3.6 VRAM-overhead probe
│        │                                │
│        │                    ┌───────────┼──────────────────────┐
│        │                  PASS        MARGINAL               FAIL (>6 GiB / alloc fails)
│        │                    │           │                      │
│        │                    ▼           ▼                      ▼
│        │         §3.7 graph-capture   Track A for iteration   TRACK B (§4)
│        │           check              only; Track B for       — no probe gate,
│        │           │                  final validation        full 32 GB budget
│        │     ┌─────┴─────┐
│        │   graphs OK   cudaErrorUnknown / ZMQ hang
│        │     │           │
│        │     │      wsl --update ≥2.7.0 → retry → still bad? ──► TRACK B
│        │     ▼           (enforce-eager = temporary degraded mode, D4)
│        │  TRACK A viable
│        │
└────────┴──► Either track: §2 shared prereqs → §5.4 KV probe → §7 checklist → §6 evals

FINAL-RUN POLICY (both tracks): every pre-submission validation run happens on the track
that passed ALL of §7 items 1–14. If Track A was MARGINAL anywhere, final validation = Track B.
```

### 9.2 Recommendation

**Primary: Track B (Zorin OS 18.1 native).** Rationale: (1) it eliminates the three WSL2 tail risks outright — WSL#40401 (potentially fatal 16 GiB overhead), WSL#40732 (OOM VM panic), WSL#11050 (uncontrollable sysmem fallback) — plus ~1 GiB of host VRAM share and the Docker Desktop quirks (bundled toolkit, no CDI, version floor); (2) the ZOR RQ6 synthesis independently concludes native Linux is the cleaner track for a Docker-sandbox eval harness; (3) with the Dec 2 final deadline and 36–52 h remote queue stalls, you cannot afford a mid-competition platform surprise. The G914 is a desktop — dual-boot is cheap and Windows remains untouched.

**Secondary: Track A as the fast start**, gated by §3.6. If the probe PASSes cleanly, WSL2 is a perfectly good iteration environment (near-native compute for long kernels, RTX RQ4 item 6) and saves the OS-install hours. Do not skip the probe because "it worked for someone on Reddit" — the bug's 5090 status is explicitly UNVERIFIED (RTX open question 2).

**KV-fit verdict procedure (both tracks, summarized):** launch §5.2 → read `GPU KV cache size: N tokens` → N ≥ 32768: keep full parity; else fp8 KV and re-read; else reduce max_model_len to the largest power-of-two ≤ N (expect 16384 fp8 / ~10k bf16) and register D2/D3. The whole decision is empirical, takes <15 min, and is recorded in PINS.txt. Pre-registered expectation: uniform-world (vllm#39133) → fp8 + 16384.

### 9.3 Time-to-first-eval (ESTIMATE; assumes ≥ 100 Mbps download and the repo zip already local)

| Phase | Track A | Track B |
|---|---|---|
| OS/driver/container plumbing | 0.5–1.5 h (WSL update, Ubuntu, Docker Desktop; driver usually already present) | 1.5–3 h (USB, dual-boot install, driver, MOK, Docker+NCT) |
| Downloads (wheelhouse ~3–5 GB + models ~21 GB; zip already local) | 0.5–1.5 h | 0.5–1.5 h |
| Env + wheelhouse + sandbox build | 0.5 h | 0.5 h |
| Probes + §7 checklist 1–11 | 0.5–1 h (incl. #40401 probe) | 0.5 h |
| First 3-task eval (§7 items 12–13) | 0.5 h | 0.5 h |
| **Total** | **~2–4 h** | **~3–6 h** |

If the §3.6 probe FAILs after you invested in Track A, add Track B's plumbing time — that is the bet the decision tree sizes. A full 129-task local run is ESTIMATE 3.5–5.5 h at concurrency 1 (BOT E15); iterate on `--task-ids` + the frozen valid set instead, full runs only at gates.

### 9.4 Maintenance rules (competition freeze)

1. **Never upgrade vLLM, torch, transformers, swegemma, adk-submission, or google-adk mid-competition.** The scorer is frozen at wheelhouse v31 / 0.19.1 / 0.2.11 / 0.2.13 / 1.36.1 (INTEL impl 22); newer vLLM rewrote the gemma4 parser (0.24, per 753521) and fixes bugs the scorer still has — upgrading locally destroys A/B validity (BOT §3 drift row). Current PyPI vLLM 0.33.0 is explicitly forbidden (RTX RQ3).
2. Freeze the env: `uv pip freeze > ~/bcf/results/PINS-freeze.txt` (or `pip freeze`); keep the original wheelhouse zip + a `docker image save swebench-sandbox:latest -o ~/bcf/downloads/sandbox-image.tar` backup. Track A: `wsl --export Ubuntu-24.04 <backup>.tar` after green checklist (Windows PowerShell). Track B: optional Timeshift snapshot of the root partition.
3. Windows driver updates (Track A): postpone non-essential GeForce updates during the competition; a driver change can move the WSL#40401 behavior — re-run §3.6 after any update. Track B: hold the driver package (`sudo apt-mark hold nvidia-driver-580-open`) and postpone kernel HWE updates until after Dec 2 (DKMS re-sign friction).
4. Re-verify the parser SHA after ANY pip operation that touches the venv (§7 item 3). One stray `pip install <pkg>` with deps can silently upgrade torch/transformers — always `--no-deps` for anything added post-freeze, and re-run item 2.
5. Watch the wheelhouse dataset for a v32 (staff claimed a reasoning fix Oct 1; public v31 still drops as of Nov 11 — INTEL S4). If a new version appears: download to a SEPARATE dir, SHA-compare, re-run §7 items 11–13 before adopting; do not spend a submission slot on an unchanged ZIP until staff confirms a scorer-side change (INTEL impl 9).
6. Keep `~/bcf/results/PINS.txt` per run; single-run deltas <4 tasks are noise (INTEL C11/C14).

---

## 10. Troubleshooting table

| Symptom | Cause | Fix |
|---|---|---|
| `NVIDIA GeForce RTX 5090 with CUDA capability sm_120 is not compatible...` / `no kernel image is available for execution on the device` | torch/vLLM wheel built without sm_120 (cu126 or older), or CUDA < 12.8 | Install torch 2.10.0 cu128/cu129 + vLLM 0.19.1 cu128+ wheel (§2.5 fallback ladder); verify driver R570+/R580+; source build last resort with `TORCH_CUDA_ARCH_LIST="12.0"`. (RTX RQ2; vllm#13306/#16901; ZOR pitfalls) |
| Track B: desktop on llvmpipe, `nvidia-smi` fails after driver install | Secure Boot blocked unsigned module (MOK not enrolled), OR proprietary (non-open) module installed on Blackwell | Complete MokManager enrollment (or disable Secure Boot); ensure `nvidia-driver-580-open` (NOT `nvidia-driver-580`); `dpkg -l \| grep nvidia-driver`, `mokutil --sb-state`, `dmesg \| grep -i nvidia`. (ZOR RQ2) |
| Track B: boot hang / no GPU after adding graphics-drivers PPA | PPA 580 driver boot failure on 5090 (documented Reddit case) | `sudo ppa-purge ppa:graphics-drivers/ppa`, install noble restricted `nvidia-driver-580-open` via ubuntu-drivers. (ZOR RQ2) |
| Track A: vLLM startup `cudaErrorUnknown` during CUDA-graph capture; ~8x slow with `--enforce-eager` | WSL < 2.7.0 dxgkrnl graph-capture bug | `wsl --update`, verify `wsl --version` ≥ 2.7.0, `wsl --shutdown`, retry without enforce-eager. (vllm#37242; WSL#14452; RTX RQ4) |
| Track A: EngineCore spawns but ZMQ never connects; startup hangs | vllm#44732-class V1 WSL2 hang (0.19.1 status UNVERIFIED) | Confirm `VLLM_WORKER_MULTIPROC_METHOD=spawn`; diagnostic `VLLM_ENABLE_V1_MULTIPROCESSING=0` (register if kept); persistent → Track B. (RTX RQ3) |
| Track A: multi-GiB allocs fail despite "free" VRAM; nvidia-smi used ≫ torch reserved | microsoft/WSL#40401 Blackwell invisible overhead | §3.6 probe; FAIL → Track B. No WSL-side workaround known. (RTX RQ4 item 1) |
| Track A: whole WSL VM crashes/panics during GPU OOM | microsoft/WSL#40732 Hyper-V panic on GPU OOM | Never oversubscribe VRAM; size via §5.4 log numbers; `.wslconfig` memory cap; `wsl --shutdown` + relaunch; reboot Windows if dxgkrnl degraded. (RTX RQ4) |
| `ValueError: The model's max seq len (32768) is larger than the maximum number of tokens that can be stored in KV cache` | Uniform KV allocation world (§5.4): ~27.5 GiB needed, ~9–11 GiB available | §5.4 decision tree: fp8 KV → reduce max_model_len → enforce-eager → util 0.95; register D2/D3. (SRV Q6; vllm#39133) |
| Decode throughput collapses 10–30x with no config change; nvidia-smi used > physical VRAM | Sysmem fallback paging to system RAM (Track A: policy not honored, WSL#11050) | Lower util/max_model_len to fit physical VRAM; Control Panel "Prefer No Sysmem Fallback" (best-effort on WSL); Track B honors it. (RTX RQ4 item 4) |
| Snapshot extraction / git commit / docker exec 3–10x slower than expected | Hot data on `/mnt/c` or `/mnt/d` (9p/drvfs per-file latency) | Move everything to ext4 (§2.1); quantify with BOT M4; one-time copies only from Windows drives. (RTX RQ4 item 9; BOT E7/E8) |
| Track B: rootless Docker fails (`AppArmor` / userns errors) | Ubuntu 24.04 restricts unprivileged user namespaces | Use rootful Engine (§4.4); rootless unsupported for this GPU track. (ZOR RQ3) |
| `docker run --gpus all` fails: could not select device driver | Track A: Docker Desktop < 4.31.1, or NCT installed manually over Desktop's bundled toolkit; Track B: NCT not configured | A1: update Desktop ≥ 4.31.1, remove manual NCT; A2: `nvidia-ctk config --set nvidia-container-cli.no-cgroups=true --in-place` (UNVERIFIED flag — probe); B: `sudo nvidia-ctk runtime configure --runtime=docker && sudo systemctl restart docker`. (RTX RQ4; ZOR RQ4) |
| `--device nvidia.com/gpu=all` fails under Docker Desktop WSL | Desktop ships no CDI spec | Use `--gpus all` (legacy hook). (ZOR RQ4) |
| apt: `NO_PUBKEY ... noble InRelease is not signed` | Docker keyring placement/permissions wrong | Redo §4.4 key steps exactly (`/etc/apt/keyrings/docker.asc`, `chmod a+r`). (ZOR RQ3) |
| Tool args contain literal quote characters; occasional raw-token leaks; `<pad>` under concurrency | Known gemma4 parser bugs on 0.19.1 (#51284, #44522, #39392) — SAME on Kaggle | Do not upgrade (parity!). Design tolerance: robust arg unescaping, scalar-only schemas, concurrency 1. (RTX RQ3; SRV Q4) |
| Inference server freezes mid-run; every later task scores 0; SIGTERM ignored | gemma4 array-argument parser infinite loop (753973; `_parse_gemma4_array` no-progress on `]` in unquoted element) | `kill -9` the vLLM process, restart server, re-run remaining tasks; PREVENT: zero array-typed tool/skill parameters anywhere; run the M13 fuzz canary before any submission. (INTEL C2/impl 8; BOT §2) |
| Structured output ignored when a request sets `enable_thinking=false` | vllm#39130: reasoning parser silently disables xgrammar in that mode | Keep thinking=True everywhere (competition default); never send enable_thinking=false for graded work. (SRV Q4) |
| `reasoning_content` missing between tool calls | 744354 / vllm#38488 family — public wheelhouse v31 behavior (UNFIXED) | Parity, not a local bug (§7 item 11 must REPRODUCE it); agent design restates critical state in visible text. (INTEL S4/impl 9) |
| `NotImplementedError: The page size of the layer is not divisible by the maximum page size` at kv_cache_utils.py; prefill hang | Gemma-4 heterogeneous KV page-size bug family (vllm#39914/#40388), often with KV quant | Revert to bf16 KV (`--kv-cache-dtype auto`); avoid int8_per_token_head; if persistent at bf16, register and try enforce-eager; keep 0.19.1 pin. (RTX RQ3) |
| fastapi tasks fail pytest collection with `ModuleNotFoundError: inline_snapshot / dirty_equals`; requests tasks error on httpbin fixtures | Missing sandbox deps in the public wheelhouse — SAME on Kaggle public env (27+ fastapi, ~12 requests) | Do NOT patch-install into the sandbox (legality unanswered, INTEL impl 15); exclude from A/B denominators; frozen valid set. (§7 item 12; INTEL C7/C10) |
| Subprocess sandbox: `ensurepip unavailable ... creating venv without pip` | Known benign warning (visible in GS §5 output) | Ignore, or switch to docker backend. (GS §5; HR §4.1) |
| `/var/lib/docker` fills root partition (Track B) | vLLM image 10–20 GB + build cache + sandbox images | `data-root` on big partition (§4.6); `docker system prune` / `builder prune` between runs. (ZOR RQ5) |
| vLLM reachable from LAN despite UFW (Track B) | Docker published ports bypass UFW | Bind `--host 127.0.0.1` (all §5 commands do); never publish sandbox ports. (ZOR RQ5) |
| WSL GUI lag / DPC latency with Docker Desktop idle | Known cosmetic 5090/WSL report (forum 369079) | Cosmetic; ignore or Track B. (RTX RQ4 item 10) |

---

*End of 03 — local environment parity plan. All version pins, flags, and failure modes above are cited to the local notes in §0.2; UNVERIFIED items carry probe steps; nothing in `input/` or the BCF submission trees was modified.*
