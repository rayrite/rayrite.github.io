# Zorin OS 18.1 System Setup & Hardware Driver Configuration
**Target Machine:** PowerSpec G914 Gaming PC  
**CPU:** AMD Ryzen 9 9950X3D (16 Cores / 32 Threads, Zen 5, 4.3–5.7 GHz, 128MB L3 3D V-Cache)  
**Motherboard:** MSI MAG X870E Tomahawk WiFi (AM5, PCIe 5.0, 5GbE LAN, WiFi 7)  
**RAM:** 64GB DDR5-6000 (2x32GB, EXPO Profile 1 Enabled)  
**GPU:** MSI Ventus 3X OC NVIDIA GeForce RTX 5090 (32GB GDDR7, Blackwell SM 12.0, 1,792 GB/s)  
**Storage:** 2TB NVMe PCIe 4.0/5.0 SSD  
**Operating System:** Zorin OS 18.1 64-bit (Ubuntu 24.04 LTS "Noble" base, Kernel 6.8/6.11 HWE)  
**Document Series:** Deliverable 01 of 05  

---

## 1. Operating System Foundation & Ubuntu Derivative Resolution

Zorin OS 18.1 is built upon the **Ubuntu 24.04 LTS (Noble Numbat)** package base. It pairs a refined, modern desktop environment with low-overhead Linux kernel scheduling, making it an outstanding platform for native artificial intelligence workloads, CUDA containers, and C#/.NET development.

### 1.1 The Codename Mapping Gotcha
Because Zorin OS reports its own distribution identity in `/etc/os-release`, standard third-party repository installers (such as Docker CE and NVIDIA CUDA) can fail if they query `VERSION_CODENAME` directly:

```bash
# Inspection of Zorin OS Release Identity
cat /etc/os-release
```
*Output:*
```ini
NAME="Zorin OS"
VERSION="18.1"
ID=zorin
ID_LIKE="ubuntu debian"
VERSION_CODENAME=noble
UBUNTU_CODENAME=noble
```

OpenMono's prerequisite installer (`scripts/install_prereqs.sh`) includes built-in logic to handle this:
```bash
ubuntu_codename() {
    local cn=""
    cn="$(. /etc/os-release 2>/dev/null && echo "${UBUNTU_CODENAME:-}")"
    if [ -z "$cn" ] && [ -f /etc/upstream-release/lsb-release ]; then
        cn="$(. /etc/upstream-release/lsb-release 2>/dev/null && echo "${DISTRIB_CODENAME:-}")"
    fi
    if [ -z "$cn" ]; then
        cn="$(. /etc/os-release 2>/dev/null && echo "${VERSION_CODENAME:-}")"
    fi
    echo "$cn"
}
```
In Zorin OS 18.1, `ubuntu_codename` evaluates to **`noble`**, ensuring that all official Ubuntu 24.04 LTS apt repositories map properly.

---

## 2. NVIDIA GeForce RTX 5090 (Blackwell) Driver & CUDA Stack Setup

The **MSI Ventus 3X OC RTX 5090** is powered by NVIDIA's **Blackwell** microarchitecture (Compute Capability / SM 12.0). It requires a modern driver (NVIDIA 570.xx or 580.xx series) with modern CUDA 12.8+ runtime support. Legacy 535.xx or 550.xx drivers will not detect the Blackwell architecture.

### Step 2.1: System Package Update & Kernel Headers
Ensure the Linux kernel headers and development packages are updated:

```bash
sudo apt update && sudo apt full-upgrade -y
sudo apt install -y build-essential dkms linux-headers-$(uname -r) pkg-config curl git jq ripgrep
```

### Step 2.2: Add the Graphics Drivers PPA & Install Driver 580 Open
The open-source kernel module driver (`580-server-open` or `580-open`) is recommended for modern 50-series GPUs on Linux kernels 6.8 and 6.11+:

```bash
# Add official proprietary GPU driver PPA
sudo add-apt-repository ppa:graphics-drivers/ppa -y
sudo apt update

# Install NVIDIA 580 Open Driver stack
sudo apt install -y nvidia-driver-580-open nvidia-utils-580

# Configure kernel modules to load early
sudo update-initramfs -u
```

### Step 2.3: Reboot Host System
```bash
sudo reboot
```

### Step 2.4: Validate GPU State via `nvidia-smi`
After rebooting into Zorin OS 18.1, verify that the RTX 5090 is initialized:

```bash
nvidia-smi
```

*Expected Verification Output:*
```text
+-----------------------------------------------------------------------------------------+
| NVIDIA-SMI 580.45                 Driver Version: 580.45         CUDA Version: 12.8     |
|-----------------------------------------+------------------------+----------------------+
| GPU  Name                 Persistence-M | Bus-Id          Disp.A | Volatile Uncorr. ECC |
| Fan  Temp   Perf          Pwr:Usage/Cap |           Memory-Usage | GPU-Util  Compute M. |
|=========================================+========================+======================|
|   0  NVIDIA GeForce RTX 5090        Off |   00000000:01:00.0  On |                  N/A |
|  0%   34C    P8             28W / 600W  |     1124MiB / 32768MiB |      0%      Default |
+-----------------------------------------+------------------------+----------------------+
```
Notice the crucial parameters:
* **Memory-Usage:** `32768MiB` (32GB GDDR7 visible and ready).
* **CUDA Version:** `12.8` (or newer).
* **Bus-Id:** `01:00.0` running over PCIe 5.0 x16 via the MSI MAG X870E Tomahawk motherboard.

---

## 3. Docker CE & NVIDIA Container Toolkit Setup

OpenMono runs all agentic and inference workloads in isolated Docker containers. The NVIDIA Container Toolkit allows Docker containers to directly access the Blackwell GPU.

### Step 3.1: Install Official Docker Community Edition (CE)
Do not use the snap or standard Ubuntu universe Docker packages. Install the official Docker CE engine:

```bash
# 1. Install Docker apt repository keys
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# 2. Add Docker repository configured for 'noble'
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  noble stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 3. Install Docker Engine and Compose Plugin
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 4. Add your user account to the docker group
sudo usermod -aG docker $USER
```

> [!IMPORTANT]
> The current shell session will not recognize the new `docker` group until you refresh your group token or log out. Run:
> ```bash
> newgrp docker
> ```

### Step 3.2: Install NVIDIA Container Toolkit
```bash
# 1. Add NVIDIA Container Toolkit GPG repository
curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey | sudo gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg
curl -s -L https://nvidia.github.io/libnvidia-container/stable/deb/nvidia-container-toolkit.list | \
  sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' | \
  sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list

# 2. Update and install toolkit
sudo apt update
sudo apt install -y nvidia-container-toolkit

# 3. Configure Docker runtime for NVIDIA passthrough
sudo nvidia-ctk runtime configure --runtime=docker

# 4. Restart Docker daemon
sudo systemctl restart docker
```

### Step 3.3: Verify GPU Passthrough Inside a Container
Execute a one-line test container to guarantee that Docker can allocate the RTX 5090:

```bash
docker run --rm --gpus all nvidia/cuda:12.8.0-base-ubuntu24.04 nvidia-smi
```
If this prints the RTX 5090 status block from inside the container, your host-to-container GPU passthrough is functioning with zero virtualization penalty.

---

## 4. AMD Ryzen 9 9950X3D Processor Tuning on Linux

The **AMD Ryzen 9 9950X3D** is a dual-CCD processor:
* **CCD 0:** 8 Zen 5 cores equipped with 64MB 3D V-Cache (96MB total L3 cache) — optimal for single-threaded compilation, Roslyn parsing, and cache-intensive search.
* **CCD 1:** 8 Zen 5 high-frequency cores (up to 5.7 GHz) — optimal for parallel background processes, SearXNG indexing, and Scrapling headless browser engines.

### Step 4.1: Enable `amd-pstate-epp` Driver
In modern Linux kernels, the `amd-pstate-epp` driver provides hardware-guided frequency scaling. Confirm the driver status:

```bash
cat /sys/devices/system/cpu/cpu0/cpufreq/scaling_driver
```
*Expected:* `amd-pstate-epp`.

### Step 4.2: Set Governor to Performance or Balanced-Performance
For compiling large solutions and running real-time agent loops, switch the Energy Performance Preference (EPP) to `balance_performance`:

```bash
# Apply to all 32 threads
echo "balance_performance" | sudo tee /sys/devices/system/cpu/cpu*/cpufreq/energy_performance_preference > /dev/null
```

To make this persistent across reboots, create a systemd service:

```bash
sudo tee /etc/systemd/system/amd-perf.service > /dev/null << 'EOF'
[Unit]
Description=Set AMD P-State EPP to Balance Performance
After=multi-user.target

[Service]
Type=oneshot
ExecStart=/bin/sh -c 'echo balance_performance | tee /sys/devices/system/cpu/cpu*/cpufreq/energy_performance_preference'

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable --now amd-perf.service
```

---

## 5. Storage (2TB NVMe) & Memory (64GB DDR5) Tuning

### Step 5.1: Swappiness Optimization
With 64GB of DDR5-6000 RAM, aggressive swapping to disk degrades system responsiveness. Lower the Linux swappiness threshold so the kernel keeps memory cached in RAM:

```bash
# Lower swappiness to 10 (swaps only under severe memory pressure)
sudo sysctl vm.swappiness=10
sudo sysctl vm.vfs_cache_pressure=50

# Persist to /etc/sysctl.d/99-openmono.conf
sudo tee /etc/sysctl.d/99-openmono.conf > /dev/null << 'EOF'
vm.swappiness = 10
vm.vfs_cache_pressure = 50
fs.file-max = 2097152
fs.inotify.max_user_watches = 524288
fs.inotify.max_user_instances = 1024
EOF

sudo sysctl --system
```

### Step 5.2: NVMe SSD Periodic TRIM
Ensure the 2TB NVMe SSD remains performant under repeated Docker layer builds and model weight caches:

```bash
sudo systemctl enable --now fstrim.timer
```

---

## 6. Networking Configuration (5GbE LAN & WiFi 7)

The MSI MAG X870E Tomahawk motherboard includes a **Realtek 5GbE LAN** controller and a **WiFi 7 (802.11be)** interface.

```bash
# Check physical network interfaces
ip link show
```

| Interface | Interface Name | Recommended Usage |
|---|---|---|
| **5GbE Wired LAN** | `enp*` / `eth0` | Primary connection for the PC. Connects directly to high-speed home router/switch for low-latency Android app control over Wi-Fi. |
| **WiFi 7 (802.11be)** | `wlp*` / `wlan0` | High-bandwidth wireless backup or dedicated hotspot network for remote devices. |

### Firewall (UFW) Configuration
If Zorin OS's firewall (`ufw`) is enabled, open the ports necessary for OpenMono's internal and LAN services:

```bash
# Check UFW status
sudo ufw status

# If enabled, allow local network access to OpenMono ports
sudo ufw allow from 192.168.0.0/16 to any port 7474 proto tcp comment 'OpenMono llama-server'
sudo ufw allow from 192.168.0.0/16 to any port 7475 proto tcp comment 'OpenMono ACP server'
sudo ufw allow from 192.168.0.0/16 to any port 47480 proto tcp comment 'OpenMono Caddy Gateway'
sudo ufw reload
```

---

## 7. Hardware & Driver Readiness Verification Matrix

Run through this checklist before executing the OpenMono installer:

| Verification Item | Command | Expected Healthy Result |
|---|---|---|
| **Linux Kernel** | `uname -r` | `6.8.0-*` or `6.11.0-*` (64-bit) |
| **Zorin OS Base** | `cat /etc/os-release \| grep UBUNTU_CODENAME` | `UBUNTU_CODENAME=noble` |
| **NVIDIA Driver** | `nvidia-smi --query-gpu=driver_version --format=csv,noheader` | `580.*` or `570.*` |
| **RTX 5090 VRAM** | `nvidia-smi --query-gpu=memory.total --format=csv,noheader` | `32768 MiB` |
| **Docker Engine** | `docker version --format '{{.Server.Version}}'` | `27.*` or `28.*` |
| **Docker GPU Support** | `docker run --rm --gpus all nvidia/cuda:12.8.0-base-ubuntu24.04 echo "CUDA OK"` | `CUDA OK` |
| **Docker Non-Root** | `docker ps` | Lists containers without `sudo` |
| **CPU Frequency Scaling** | `cat /sys/devices/system/cpu/cpu0/cpufreq/scaling_driver` | `amd-pstate-epp` |
| **RAM Total** | `free -h \| grep Mem:` | Total $\approx 62\text{--}64\text{ GiB}$ |
| **NVMe Free Storage** | `df -h / \| tail -n1` | Free $\ge 100\text{ GB}$ (Model requires ~22GB) |
