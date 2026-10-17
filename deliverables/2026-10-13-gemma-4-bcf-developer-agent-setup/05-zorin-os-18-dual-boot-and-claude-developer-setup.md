# Zorin OS 18.1 Dual-Boot & Claude Code Developer Toolchain Guide
**Hardware Profile:** PowerSpec G914 Gaming PC  
* **CPU:** AMD Ryzen 9 9950X3D (16 Cores / 32 Threads, Zen 5, 4.3–5.7 GHz)  
* **Motherboard:** MSI MAG X870E Tomahawk WiFi (AM5, PCIe 5.0)  
* **RAM:** 64GB DDR5-6000 (EXPO Profile 1)  
* **GPU:** MSI Ventus 3X OC NVIDIA GeForce RTX 5090 (32GB GDDR7, Blackwell Architecture)  
* **Storage:** 2TB NVMe PCIe SSD  
* **Host OS:** Windows 11 Pro 64-bit  
**Target Dual-Boot OS:** Zorin OS 18.1 (64-bit, Ubuntu 24.04 LTS Base, Linux Kernel 6.8/6.11 HWE)  
**Deliverable File:** `05-zorin-os-18-dual-boot-and-claude-developer-setup.md`  
**Date of Record:** October 13, 2026  

---

## 1. Executive Summary & Dual-Boot Architecture

**Zorin OS 18.1** is a modern, high-performance Linux distribution built on the **Ubuntu 24.04 LTS** base with long-term support through June 2029. It combines the visual elegance and ease of use of a polished desktop environment with the raw power of the Ubuntu Linux kernel, making it an exceptional native platform for AI agent development, CUDA workloads, and full-stack software engineering.

Dual-booting Zorin OS 18.1 alongside Windows 11 Pro on your **PowerSpec G914** allows you to preserve your complete Windows 11 setup while unlocking bare-metal Linux performance. Unlike virtual machines or WSL2, running Zorin OS natively grants direct access to:
* **The 32GB GDDR7 VRAM of your RTX 5090** without virtualization layers.
* **The full 16 Cores / 32 Threads of the AMD Ryzen 9 9950X3D** using the Linux `amd-pstate-epp` frequency scaling driver.
* **Low-overhead Docker CE and Kubernetes engines** with direct GPU container passthrough.

```
+---------------------------------------------------------------------------------------------------+
|                         POWERSPEC G914 DUAL-BOOT STORAGE & BOOT ARCHITECTURE                      |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|  [PHYSICAL DISK: 2TB NVMe PCIe SSD (`/dev/nvme0n1`)]                                             |
|  +---------------------------------------------------------------------------------------------+  |
|  | Partition 1: EFI System Partition (FAT32, ~100–500MB)                                       |  |
|  |              Shared UEFI Bootloader (GRUB Boot Menu -> boots Zorin OS or Windows Boot Mgr)  |  |
|  +---------------------------------------------------------------------------------------------+  |
|  | Partition 2: Microsoft Reserved Partition (MSR, ~16MB)                                      |  |
|  +---------------------------------------------------------------------------------------------+  |
|  | Partition 3: Windows 11 Pro OS Partition (NTFS, ~1.0–1.4 TB)                                |  |
|  |              Windows C:\ Drive (BitLocker backed up, Fast Startup Disabled)                  |  |
|  +---------------------------------------------------------------------------------------------+  |
|  | Partition 4: Windows Recovery Environment (NTFS, ~800MB)                                    |  |
|  +---------------------------------------------------------------------------------------------+  |
|  | Partition 5: Zorin OS 18.1 Root Filesystem (`/`) (Ext4, ~500GB–800GB)                       |  |
|  |              Bare-Metal Linux OS, NVIDIA 570+ Driver, Claude Code CLI, VS Code              |  |
|  +---------------------------------------------------------------------------------------------+  |
+---------------------------------------------------------------------------------------------------+
```

---

## 2. Phase 1: Pre-Installation Preparations inside Windows 11 Pro

Before modifying partitions or booting the Zorin OS installer, perform these three critical preparatory steps inside Windows 11 Pro:

### Step 1.1: Backup Windows 11 BitLocker Recovery Key (CRITICAL)
Windows 11 Pro on modern prebuilt systems often activates BitLocker drive encryption automatically. Modifying partition boundaries or altering the UEFI boot order will trigger **BitLocker Recovery Mode** on your next Windows boot.

1. Open **Windows PowerShell** as Administrator and check BitLocker status:
   ```powershell
   manage-bde -status C:
   ```
2. If BitLocker is **Protection On**, retrieve and print your 48-digit Recovery Key:
   ```powershell
   manage-bde -protectors -get C:
   ```
   *Write down this 48-digit numerical password or save it to your phone/cloud account (`https://account.microsoft.com/devices/recoverykey`).*
3. **Recommended Temporary Suspension:** Suspend BitLocker protection for 2 reboots to allow seamless dual-boot setup:
   ```powershell
   Suspend-BitLocker -MountPoint "C:" -RebootCount 2
   ```

---

### Step 1.2: Disable Windows "Fast Startup"
Windows Fast Startup leaves NTFS partitions in a hibernated, locked state on shutdown. If Linux attempts to mount or inspect a hibernated NTFS partition, it can lead to boot loops or disk corruption.

1. In Administrator PowerShell, run:
   ```powershell
   powercfg /h off
   ```
   *Impact: Disables Windows hibernation and Fast Startup, guaranteeing clean unmounting of all NVMe partitions.*

---

### Step 1.3: Shrink Windows Volume to Create Unallocated Space
Allocate dedicated disk space on your 2TB NVMe SSD for Zorin OS 18.1:

1. Press **`Win + X`** and select **Disk Management** (`diskmgmt.msc`).
2. Right-click the **`C:`** volume and select **Shrink Volume**.
3. In *"Enter the amount of space to shrink in MB"*, enter your desired Linux allocation:
   * **For 500 GB:** Enter `512000` (500 × 1024)
   * **For 750 GB:** Enter `768000` (750 × 1024)
   * **For 1 TB:** Enter `1024000` (1000 × 1024)
4. Click **Shrink**.
5. *Result:* You will see a black block labeled **Unallocated Space** next to your `C:` partition. **Leave it unallocated** (do not format it as NTFS).

---

### Step 1.4: Download Zorin OS 18.1 & Flash Bootable USB
1. Download **Zorin OS 18.1 Core** (or Pro) 64-bit ISO from the official portal: [zorin.com/os/download](https://zorin.com/os/download).
2. Download **Rufus** (portable executable) from [rufus.ie](https://rufus.ie).
3. Insert a USB flash drive (minimum 8GB).
4. Launch Rufus and configure the settings:
   * **Device:** Select your USB Flash Drive.
   * **Boot selection:** Click *SELECT* and choose `Zorin-OS-18.1-Core-64-bit.iso`.
   * **Partition scheme:** **`GPT`** *(Do NOT select MBR)*.
   * **Target system:** **`UEFI (non CSM)`**.
   * **File system:** **`FAT32`** (or Large FAT32).
5. Click **START**. When prompted, choose **"Write in ISO Image mode (Recommended)"** and click **OK**.

---

## 3. Phase 2: MSI MAG X870E Tomahawk WiFi BIOS Settings

Reboot your PowerSpec G914 and tap **`DEL`** repeatedly during startup to enter **MSI Click BIOS X**:

1. Press **`F7`** to enter **Advanced Mode**.
2. **UEFI Mode Verification:**
   * Go to **Settings** -> **Boot**.
   * Ensure **Boot Mode Select** is set to **`[UEFI]`** (Legacy/CSM is disabled).
3. **MSI Fast Boot:**
   * Set **MSI Fast Boot** to **`[Disabled]`** (ensures USB devices are initialized on startup for boot menu selection).
4. **Secure Boot Configuration:**
   * Go to **Settings** -> **Security** -> **Secure Boot**.
   * Zorin OS 18.1 natively supports UEFI Secure Boot via Canonical's signed Shim loader.
   * *NVIDIA Driver Consideration:* If you keep Secure Boot `[Enabled]`, the installer will ask you to set a **Machine Owner Key (MOK) password** to sign the RTX 5090 proprietary driver. You must enroll this key on your first reboot. If you prefer zero driver-signing prompts, you may toggle Secure Boot to **`[Disabled]`**.
5. **Re-Size BAR & SVM Mode:**
   * Verify **Above 4G Decoding** = `[Enabled]`
   * Verify **Re-Size BAR Support** = `[Enabled]`
   * Verify **SVM Mode** = `[Enabled]`
6. Press **`F10`** to save and reboot.

---

## 4. Phase 3: Installing Zorin OS 18.1 Alongside Windows 11

### Step 3.1: Boot into Zorin OS Installer
1. While the system restarts, tap the **`F11`** key repeatedly to open the **MSI Boot Device Selection Menu**.
2. Select your UEFI flash drive (e.g., `UEFI: USB Flash Disk, Partition 1`).
3. In the Zorin OS GRUB menu, highlight:
   **`Try or Install Zorin OS (modern NVIDIA graphics)`**
   and press **Enter**.
   > [!IMPORTANT]
   > Selecting the *"modern NVIDIA graphics"* mode loads the proprietary NVIDIA driver during the live installer session, preventing display freezes on your RTX 5090 Blackwell card.

---

### Step 3.2: Installer Configuration
1. When the desktop loads, click **Install Zorin OS**.
2. **Language & Keyboard:** Select your language and layout.
3. **Network Connection:** Connect to your WiFi 7 network or ensure your 5GbE Ethernet cable is plugged in.
4. **Updates & Third-Party Drivers:**
   * Check **"Install third-party software for graphics and Wi-Fi hardware and additional media formats"**.
   * Check **"Download updates while installing Zorin OS"**.
   * *If Secure Boot is enabled:* You will be prompted to set a temporary MOK password (e.g., `developer123`). Remember this password for the first reboot.

---

### Step 3.3: Disk Partitioning (Installation Type)
The installer will display the **Installation type** window:

* **Automatic Option (Easiest):**  
  Select **"Install Zorin OS alongside Windows Boot Manager"**.  
  The installer will automatically detect the unallocated partition created in Windows and format it as Linux Ext4.
* **Manual Option ("Something else" - Recommended for Precise Control):**
  1. Highlight the `free space` entry corresponding to your unallocated NVMe space.
  2. Click the **`+`** (Add) button:
     * **Size:** Use all remaining free space (e.g., 500,000 MB).
     * **Type for the new partition:** Primary.
     * **Location for the new partition:** Beginning of this space.
     * **Use as:** `Ext4 journaling file system`.
     * **Mount point:** Select **`/`** (root).
  3. **Bootloader Device:** Ensure *"Device for boot loader installation"* is set to the NVMe SSD (`/dev/nvme0n1`). Zorin OS will automatically place the GRUB entry into the existing EFI System Partition alongside Windows Boot Manager without overwriting it.

5. Click **Install Now**, review the partition change summary, and click **Continue**.
6. Select your Timezone, create your username (e.g., `developer`), computer name (`powerspec-g914`), and password.
7. Wait for installation to complete. When prompted, click **Restart Now**, unplug the USB flash drive, and press **Enter**.

---

### Step 3.4: Enroll MOK Key (If Secure Boot was Enabled)
If Secure Boot was kept active, the system will restart into a blue screen labeled **Perform MOK management**:
1. Select **Enroll MOK** and press Enter.
2. Select **Continue** -> **Yes**.
3. Type the password you created during the installer step.
4. Select **Reboot**.

*Result:* Your PC will now present the **GRUB Boot Menu** on every power-on:
* **Zorin OS** (default)
* **Windows Boot Manager** (boots your Windows 11 Pro installation)

---

## 5. Phase 4: Zorin OS 18.1 Developer Toolchain Overview

Zorin OS 18.1 on your PowerSpec G914 gives you a bare-metal Linux environment with zero hypervisor overhead. Here is the architecture of your developer stack:

```
+---------------------------------------------------------------------------------------------------+
|                        ZORIN OS 18.1 NATIVE DEVELOPER TOOLCHAIN (G914)                            |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|  [APPLICATION / IDE LAYER]                                                                        |
|  * Visual Studio Code (Native .deb official build with Microsoft APT repository)                  |
|  * Official Claude Code VS Code Extension (`anthropic.claude-code`)                               |
|  * Anthropic Claude Code CLI (`@anthropic-ai/claude-code` via Node.js 22 LTS)                      |
|                                                                                                   |
|  [RUNTIME & AI ACCELERATION LAYER]                                                                |
|  * Node.js v22.x LTS (Managed via `nvm`)                                                          |
|  * Python 3.11 / 3.12 (High-speed virtual environments managed via `uv`)                          |
|  * NVIDIA Proprietary Driver 570.x+ / 572.x+ (Direct Blackwell RTX 5090 access)                   |
|  * NVIDIA CUDA Toolkit 12.6+ / cuDNN (Native bare-metal PyTorch 2.5+)                             |
|  * Docker Community Edition (CE) + NVIDIA Container Toolkit (`nvidia-ctk`)                        |
|                                                                                                   |
|  [KERNEL & HARDWARE ABSTRACTION LAYER]                                                            |
|  * Linux Kernel 6.8 / 6.11 HWE with AMD Zen 5 `amd-pstate-epp` CPU Governor                      |
|  * Realtek 5GbE LAN Driver (`r8125`) & Linux WiFi 7 / Bluetooth 5.4 Subsystem                     |
|  * Re-Size BAR enabled across 32GB GDDR7 frame buffer via PCIe 5.0                                |
+---------------------------------------------------------------------------------------------------+
```

---

## 6. Phase 5: Setting Up the RTX 5090 GPU & System Runtimes

Open the **Terminal** in Zorin OS (`Ctrl + Alt + T`) and execute:

### Step 5.1: System Updates & Build Essentials
```bash
sudo apt update && sudo apt upgrade -y

sudo apt install -y \
    build-essential \
    cmake \
    ninja-build \
    pkg-config \
    git \
    git-lfs \
    curl \
    wget \
    jq \
    unzip \
    zip \
    ripgrep \
    htop \
    ca-certificates \
    apt-transport-https \
    software-properties-common

git lfs install
```

### Step 5.2: Verify NVIDIA RTX 5090 Blackwell Driver
Verify that the proprietary driver was configured by the installer:
```bash
nvidia-smi
```
*Expected Output:* You should see your **NVIDIA GeForce RTX 5090**, 32768 MiB (32 GB) VRAM, and Driver version 570.x / 572.x+.

If the driver shows an older version or nouveau fallback, install the latest driver from the official graphics PPA:
```bash
sudo add-apt-repository ppa:graphics-drivers/ppa -y
sudo apt update
sudo apt install -y nvidia-driver-570
sudo reboot
```

---

## 7. Phase 6: Installing Visual Studio Code (Native `.deb`)

> [!CAUTION]
> **Avoid Software Store Flatpak/Snap for VS Code:** The version in the Zorin Software Store is often sandboxed via Flatpak, which isolates VS Code from global CLI tools like `claude`, `node`, `git`, and virtual environments. Installing the official Microsoft `.deb` repository ensures seamless access to system paths.

### Step 6.1: Add Microsoft GPG Key & Repository
In Terminal, run:
```bash
# Download and install Microsoft GPG signing key
curl -fsSL https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor | sudo tee /usr/share/keyrings/packages.microsoft.gpg > /dev/null

# Add official Microsoft VS Code repository
echo "deb [arch=amd64,arm64,armhf signed-by=/usr/share/keyrings/packages.microsoft.gpg] https://packages.microsoft.com/repos/code stable main" | sudo tee /etc/apt/sources.list.d/vscode.list > /dev/null

# Update package cache and install code
sudo apt update
sudo apt install -y code
```

Verify VS Code installation:
```bash
code --version
```

---

## 8. Phase 7: Installing Claude Code CLI & Node.js Runtime

The **Claude Code CLI** (`@anthropic-ai/claude-code`) requires a modern Node.js runtime (Node.js 18.0 or newer; Node.js 22 LTS recommended).

### Step 7.1: Install Node.js 22 LTS via NVM (Node Version Manager)
Avoid outdated system node packages by installing `nvm`:
```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

# Activate nvm in current session
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Install and activate Node.js 22 LTS
nvm install 22
nvm use 22
nvm alias default 22
```

Verify:
```bash
node -v   # Should output v22.x.x
npm -v    # Should output 10.x.x
```

### Step 7.2: Install Anthropic Claude Code CLI Globally
Install the official Claude Code CLI package:
```bash
npm install -g @anthropic-ai/claude-code
```
*(Alternative standalone installer: `curl -fsSL https://claude.ai/install.sh | bash`)*

Verify installation:
```bash
claude --version
```

### Step 7.3: Authenticate Claude Code CLI
1. Run the login command:
   ```bash
   claude login
   ```
2. A browser tab will open to Anthropic (`claude.ai`). Log into your Anthropic account (Claude Pro, Max, Team, or Console).
3. Authorize the CLI token.
4. *(Optional API Key Method):* If using an Anthropic API Key directly, export it in your shell:
   ```bash
   echo 'export ANTHROPIC_API_KEY="your-api-key-here"' >> ~/.bashrc
   source ~/.bashrc
   ```

---

## 9. Phase 8: Installing the Official Claude Code VS Code Extension

Anthropic publishes the official **Claude Code** extension (`anthropic.claude-code`) for Visual Studio Code, which integrates chat, agentic file modifications, and inline diff viewing.

### Step 8.1: Install the Extension via Command Line
In Terminal, execute:
```bash
code --install-extension anthropic.claude-code
```

*(Alternatively, inside VS Code: press `Ctrl + Shift + X`, search for **"Claude Code"** by publisher **Anthropic**, and click **Install**).*

### Step 8.2: Also Install Key Developer Extensions
```bash
code --install-extension ms-python.python
code --install-extension ms-python.vscode-pylance
code --install-extension redhat.vscode-yaml
code --install-extension ms-azuretools.vscode-docker
code --install-extension eamodio.gitlens
```

---

## 10. Phase 9: End-to-End Workflow & Verification

Let's verify that your native Zorin OS 18.1 AI agent stack is fully functional:

### Step 10.1: Test Claude Code in a Project Directory
```bash
mkdir -p ~/bcf_zorin_test && cd ~/bcf_zorin_test
git init
```

Launch Claude Code CLI:
```bash
claude
```
Ask Claude Code:
> *"Inspect this repository, create a Python script to verify the NVIDIA RTX 5090 using PyTorch, and commit it."*

Claude Code will autonomously inspect your environment, write the script, run test commands, and offer git actions.

### Step 10.2: Launch VS Code with Claude Code Extension
In the same directory, run:
```bash
code .
```
1. Click the **Claude** icon in the primary sidebar (or press `Ctrl + Alt + C` / open the Command Palette `Ctrl + Shift + P` -> *Claude: Open Chat*).
2. The interactive chat and diff panel will open inside VS Code.
3. You can now use `@` to reference files, prompt Claude for refactors, review inline unified diffs, and approve changes directly from the GUI.

---

## 11. Summary of Dual-Boot Maintenance & Tips

| Scenario | Recommended Action |
| :--- | :--- |
| **Switching back to Windows 11** | Reboot the PC. At the GRUB menu, select **Windows Boot Manager**. Windows 11 Pro will boot immediately. |
| **Default Boot OS Preference** | To make Windows the default boot choice instead of Zorin, edit `/etc/default/grub`, set `GRUB_DEFAULT="Windows Boot Manager"`, and run `sudo update-grub`. |
| **Kernel Updates** | When Zorin OS installs kernel updates via `apt upgrade`, DKMS will automatically re-build the NVIDIA Blackwell module in the background. |
| **Accessing Windows Files from Zorin OS** | Your Windows `C:` drive will appear in the Zorin Files manager under *Other Locations*. You can read and write files to your Windows partition safely (because Fast Startup was disabled). |
| **Accessing Linux Files from Windows 11** | In Windows 11, install the open-source **ExtFS for Windows** or use WSL2 to mount Linux ext4 partitions (`wsl --mount \\.\PHYSICALDRIVE0 --partition 5`). |
