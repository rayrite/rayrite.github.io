# OpenMonoAgent.ai — Maintenance, Troubleshooting & Operational Runbook
**Target System:** PowerSpec G914 Gaming PC (AMD Ryzen 9 9950X3D · RTX 5090 32GB GDDR7 · Zorin OS 18.1)  
**System Services:** `llama-server` (Port 7474) · `openmono-agent` (ACP Port 7475) · `caddy` (Port 47480) · `frpc`  
**Document Series:** Deliverable 05 of 05  

---

## 1. Daily Operations Runbook

The following commands provide day-to-day administrative control over your OpenMono installation:

```bash
# Check overall health (Docker containers, GPU utilization, model loaded, active ports)
openmono status

# Start the background inference daemon
openmono start

# Stop the inference daemon and reclaim all 32GB GPU VRAM
openmono stop

# Restart the inference server (required after modifying model parameters or context size)
openmono restart

# Tail live inference server logs (displays prompt processing and token generation metrics)
openmono logs

# Inspect and follow the background relay tunnel logs
openmono tunnel logs

# View help and full command catalog
openmono help
```

---

## 2. Troubleshooting Matrix & Recovery Procedures

```
+---------------------------------------------------------------------------------------------------+
|                                 COMMON ISSUES & RESOLUTION RECIPES                                |
+-----------------------+---------------------------------------+-----------------------------------+
| Symptom / Error Code  | Root Cause                            | Resolution Procedure              |
+-----------------------+---------------------------------------+-----------------------------------+
| `401 Unauthorized`    | `LLAMA_API_KEY` mismatch between      | Re-align API key across docker,   |
| (API / Mobile App)    | inference server and agent / mobile.  | config, and client profiles.      |
+-----------------------+---------------------------------------+-----------------------------------+
| `Docker socket access | User group `docker` not refreshed in  | Execute `newgrp docker` or reload |
| denied (EACCES)`      | active shell session.                 | user session via `exec $SHELL`.   |
+-----------------------+---------------------------------------+-----------------------------------+
| Port conflict         | Orphaned container or process holding | Run `lsof -i :7474` and terminate |
| `7474 / 7475 / 47480` | port 7474, 7475, or 47480.            | the lingering process PID.        |
+-----------------------+---------------------------------------+-----------------------------------+
| GPU VRAM Out-of-Memory| Prompt cache growth + multimodal      | Cap `--cache-ram 2048` and adjust |
| (CUDA OOM / crash)    | vision encoder burst allocation.      | context size to 172,032 tokens.   |
+-----------------------+---------------------------------------+-----------------------------------+
| Relay tunnel offline  | Expired OTP token or stalled `frpc`   | Run `openmono tunnel restart` or  |
| (`Connection refused`)| background daemon.                    | re-authenticate with `setup`.     |
+-----------------------+---------------------------------------+-----------------------------------+
| `Command not found`   | `openmono` executable not on active   | Add `~/openmono.ai` to `PATH` in  |
| after terminal reboot | shell environment `PATH`.             | `~/.bashrc` and source file.      |
+-----------------------+---------------------------------------+-----------------------------------+
```

---

### Recipe 2.1: Resolving `401 Unauthorized` Errors
If your Android phone, remote laptop, or VS Code extension fails with an HTTP 401 error, the client API key does not match the server's bearer token.

1. **Check the server token on the PowerSpec G914:**
   ```bash
   grep '^LLAMA_API_KEY=' ~/openmono.ai/docker/.env
   ```
   *Example Output:* `LLAMA_API_KEY=sk-oma-9f82d1c74a0e4b8593`

2. **Check the client token:**
   ```bash
   openmono config get llm.api_key
   ```

3. **Re-synchronize the token:**
   ```bash
   # Update local agent configuration
   openmono config set llm.api_key sk-oma-9f82d1c74a0e4b8593

   # Update in the Android Mobile App:
   # Settings -> Server -> API Key -> Paste identical token
   ```

---

### Recipe 2.2: Resolving Docker Permission Denied Errors
If executing `openmono status` or running the installer produces:
`Got permission denied while trying to connect to the Docker daemon socket at unix:///var/run/docker.sock`

The Linux kernel has not loaded your updated supplementary group memberships into the current shell:

```bash
# Refresh group membership in the active shell
newgrp docker

# Verify access without sudo
docker ps
```
To permanently ensure your user account is in the group:
```bash
sudo usermod -aG docker $USER
```

---

### Recipe 2.3: Clearing Port Conflicts
If port `7474` (llama-server), `7475` (ACP server), or `47480` (Caddy gateway) is locked by an orphaned process:

```bash
# Locate offending process PID
sudo lsof -i :7474
sudo lsof -i :7475
sudo lsof -i :47480

# Cleanly stop OpenMono Docker containers
cd ~/openmono.ai/docker
docker compose down

# If a stray process remains, terminate it
sudo kill -9 <PID>

# Restart OpenMono
openmono start
```

---

### Recipe 2.4: Managing VRAM Headroom During Heavy Vision Sessions
While the RTX 5090 has a massive 32GB GDDR7 capacity, running long multi-turn sessions with vision image attachments can accumulate KV cache. 

During inference, two memory pools expand:
1. **The KV Cache:** Memory storing token states across the conversation.
2. **The Prompt Cache (`--cache-ram`):** Prefill caching to accelerate subsequent turns (defaults to 8,192 MiB in `llama.cpp`).
3. **Vision Encoder Burst:** Whenever an image is processed, the multimodal projector requires a temporary spike of ~474 MiB to ~1,200 MiB of VRAM.

If you encounter CUDA memory exhaustion during vision sessions:
1. Edit `~/openmono.ai/docker/docker-compose.override.yml`:
   ```yaml
   services:
     llama-server:
       command: >
         --cache-ram 2048
         --cache-reuse 256
         --image-max-tokens 1280
   ```
   *Explanation:*
   * `--cache-ram 2048`: Caps the prompt cache buffer at 2GB instead of 8GB, freeing up 6GB of permanent VRAM headroom.
   * `--cache-reuse 256`: Prevents cache thrashing on brief prompts.
   * `--image-max-tokens 1280`: Restricts image token allocations.

2. Restart the server:
   ```bash
   openmono restart
   ```

---

### Recipe 2.5: Restoring the Relay Tunnel
If your Android phone cannot reach the PowerSpec G914 when switching from Wi-Fi to cellular data:

```bash
# Check the tunnel systemd unit
sudo systemctl status frpc

# Tail the tunnel connection logs
openmono tunnel logs

# Restart the tunnel client
openmono tunnel restart
```
If the tunnel credentials have expired or the port mapping was revoked:
```bash
# Re-run tunnel setup and re-authenticate via OTP
openmono tunnel setup
openmono tunnel start
```

---

## 3. High-Performance Tuning for RTX 5090 & Ryzen 9 9950X3D

To maximize performance on your specific hardware configuration:

### 3.1 Inference Server Concurrency & Batch Sizes
The default `docker-compose.yml` is tuned for a balance of speed and stability. On the G914, you can edit `~/openmono.ai/docker/docker-compose.override.yml` to take full advantage of the RTX 5090's 512-bit memory bus:

```yaml
services:
  llama-server:
    command: >
      --batch-size 4096
      --ubatch-size 2048
      --threads 16
      --threads-batch 16
      --flash-attn on
      --cache-type-k q8_0
      --cache-type-v q8_0
```
* **`--batch-size 4096` / `--ubatch-size 2048`:** Enlarges the prompt prefill batch, increasing prompt evaluation speed up to **1,200+ prompt tokens/sec**.
* **`--threads 16`:** Pins compute threads to match the 16 physical Zen 5 cores of the AMD Ryzen 9 9950X3D.
* **`--cache-type-k q8_0` / `--cache-type-v q8_0`:** Maintains 8-bit quantized KV cache, preserving precision for long-horizon coding tasks without the quality degradation of 4-bit KV caches.

---

## 4. Session Persistence, Backup & Disaster Recovery

### 4.1 Session Storage Format
Every conversation turn is recorded to a durable JSONL file:
* **Directory:** `~/.openmono/sessions/`
* **Naming Schema:** `{YYYY-MM-DD}_{sessionId}.jsonl`
* **Checkpoints:** Stored alongside as `{sessionId}.checkpoints.json`

Line 1 contains the session header and metadata, while subsequent lines store individual user turns, assistant responses, thinking traces, and tool execution outputs.

### 4.2 Exporting Transcripts
To generate an offline markdown or HTML transcript of an active or past session:

```bash
# Inside the OpenMono agent prompt:
/export markdown ~/reports/refactor-session.md
/export html ~/reports/refactor-session.html
```

### 4.3 Backing Up OpenMono Configuration
To preserve your custom playbooks, memory files, and configuration before system updates:

```bash
tar -czvf ~/openmono-backup-$(date +%F).tar.gz \
  ~/.openmono/settings.json \
  ~/.openmono/memory/ \
  ~/.openmono/playbooks/ \
  ~/openmono.ai/docker/.env
```

---

## 5. Uninstallation & Clean Reinstallation

### 5.1 Safe Uninstallation
To remove OpenMono without deleting your downloaded model weights (saving you a ~16GB re-download):

```bash
cd ~/openmono.ai
./scripts/uninstall.sh
```
The uninstaller will prompt:
```text
Keep downloaded model weights in ~/openmono.ai/models? (Y/n): Y
```
* Selecting **`Y`** retains the GGUF files in `models/` while cleaning Docker containers, volumes, and shell shortcuts.
* Selecting **`n`** performs a complete scrub of the filesystem.

### 5.2 Clean Re-Installation
To perform a fresh installation using previously downloaded models:

```bash
cd ~/openmono.ai
./scripts/re-install.sh
```

---

## 6. Master Reference Quick-Sheet

### Core Network Ports
* **`7474` (TCP):** Local `llama-server` OpenAI-compatible API.
* **`7475` (TCP):** OpenMono Agent Client Protocol (ACP) SSE server.
* **`47480` (TCP):** Caddy Multi-Service Gateway (SearXNG + Scrapling + llama-server).
* **`8080` (Internal Docker):** SearXNG meta-search engine.
* **`5000` (Internal Docker):** Scrapling / Camoufox stealth browser engine.

### Filesystem Paths
* **CLI Home Directory:** `~/openmono.ai`
* **Model Storage:** `~/openmono.ai/models/`
* **Docker Configurations:** `~/openmono.ai/docker/`
* **Global User State:** `~/.openmono/`
* **Active Transcripts:** `~/.openmono/sessions/`
* **Global Playbooks:** `~/.openmono/playbooks/`
* **Project Rules:** `<project-root>/OPENMONO.md`
* **Project Playbooks:** `<project-root>/.openmono/playbooks/`
