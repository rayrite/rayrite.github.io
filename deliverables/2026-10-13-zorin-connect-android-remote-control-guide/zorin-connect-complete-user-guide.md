# Zorin Connect: Complete User Guide & Remote Control Manual for Zorin OS 18.1
**Target Systems:** Zorin OS 18.1 (GNOME 46+ Wayland & X11) · Zorin OS Lite (XFCE)  
**Mobile Client:** Android Smartphones & Tablets (Android 10 through 16+)  
**Underlying Architecture:** KDE Connect Protocol · GSConnect GJS Subsystem · Mutual TLS 1.3 Encryption · UFW / Gufw Firewall  
**Deliverable Type:** Master Comprehensive Guide (Consolidated Edition)  
**Current Date:** 2026-10-13  

---

## Table of Contents
1. [Executive Overview & System Architecture](#1-executive-overview--system-architecture)
   - [1.1 Subsystem Topology & Protocol Wire Format](#11-subsystem-topology--protocol-wire-format)
   - [1.2 Desktop Flavor Comparison: Core/Pro vs Lite](#12-desktop-flavor-comparison-corepro-vs-lite)
   - [1.3 Network Architecture & Port Taxonomy](#13-network-architecture--port-taxonomy)
   - [1.4 Security Architecture & Cryptographic Guarantees](#14-security-architecture--cryptographic-guarantees)
2. [Prerequisites, Installation & Pre-Flight Checks](#2-prerequisites-installation--pre-flight-checks)
   - [2.1 Desktop Verification & Installation](#21-desktop-verification--installation)
   - [2.2 Mobile Client Acquisition Channels](#22-mobile-client-acquisition-channels)
   - [2.3 Network Pre-Flight & Router Best Practices](#23-network-pre-flight--router-best-practices)
3. [Firewall Configuration: The "Easy Method" & UFW Setup](#3-firewall-configuration-the-easy-method--ufw-setup)
   - [3.1 Graphical Setup via Gufw](#31-graphical-setup-via-gufw)
   - [3.2 Terminal Command Configuration (UFW)](#32-terminal-command-configuration-ufw)
4. [Step-by-Step Device Pairing & Mobile Permissions](#4-step-by-step-device-pairing--mobile-permissions)
   - [4.1 Pairing Walkthrough & Fingerprint Verification](#41-pairing-walkthrough--fingerprint-verification)
   - [4.2 Android Permissions & Doze Mode Exemption](#42-android-permissions--doze-mode-exemption)
5. [Core Remote Control Features: Interactive Operation](#5-core-remote-control-features-interactive-operation)
   - [5.1 Remote Touchpad, Gestures & Pointer Control](#51-remote-touchpad-gestures--pointer-control)
   - [5.2 Virtual Keyboard, Modifiers & Shortcut Combinations](#52-virtual-keyboard-modifiers--shortcut-combinations)
   - [5.3 Multimedia Hub (MPRIS2 Engine & Call Muting)](#53-multimedia-hub-mpris2-engine--call-muting)
   - [5.4 Presentation Remote & Gyroscopic Air Pointer](#54-presentation-remote--gyroscopic-air-pointer)
   - [5.5 High-Speed File Transfers & SFTP Storage Mounting](#55-high-speed-file-transfers--sftp-storage-mounting)
   - [5.6 Shared Clipboard & Android 10+ Workarounds](#56-shared-clipboard--android-10-workarounds)
   - [5.7 Notification Hub, SMS Messaging & Device Ringing](#57-notification-hub-sms-messaging--device-ringing)
6. [Intermediate Automation: Custom "Run Commands"](#6-intermediate-automation-custom-run-commands)
   - [6.1 Run Commands Execution Model & Security](#61-run-commands-execution-model--security)
   - [6.2 Production Command Recipe Catalog](#62-production-command-recipe-catalog)
   - [6.3 Multi-Step Automation Shell Scripts](#63-multi-step-automation-shell-scripts)
7. [Advanced Architecture: Wayland, D-Bus & Global Control](#7-advanced-architecture-wayland-dbus--global-control)
   - [7.1 Wayland Input Injection & `ydotool` Automation](#71-wayland-input-injection--ydotool-automation)
   - [7.2 Programmatic D-Bus Control via `gdbus`](#72-programmatic-d-bus-control-via-gdbus)
   - [7.3 Global Remote Control Beyond LAN (Tailscale Mesh VPN)](#73-global-remote-control-beyond-lan-tailscale-mesh-vpn)
   - [7.4 Off-Grid Mobile Travel Topology](#74-off-grid-mobile-travel-topology)
   - [7.5 Cryptographic Key Rotation & Certificate Hardening](#75-cryptographic-key-rotation--certificate-hardening)
8. [Troubleshooting Matrix & Operational Runbook](#8-troubleshooting-matrix--operational-runbook)
   - [8.1 Diagnostic Flowchart](#81-diagnostic-flowchart)
   - [8.2 Exhaustive Failure Resolution Table](#82-exhaustive-failure-resolution-table)
   - [8.3 Resolving Virtual Machine (VM) Isolation](#83-resolving-virtual-machine-vm-isolation)
   - [8.4 Automated Diagnostic Tool: `zorin-connect-doctor.sh`](#84-automated-diagnostic-tool-zorin-connect-doctorsh)
9. [Security Hardening & Home Network Defense](#9-security-hardening--home-network-defense)
   - [9.1 Threat Modeling & Attack Surface Analysis](#91-threat-modeling--attack-surface-analysis)
   - [9.2 Zorin Connect Application Hardening & Sandboxing](#92-zorin-connect-application-hardening--sandboxing)
   - [9.3 Host-Level Linux Security Hardening (UFW & Sysctl)](#93-host-level-linux-security-hardening-ufw--sysctl)
   - [9.4 Home Network & Wi-Fi Router Perimeter Defense](#94-home-network--wi-fi-router-perimeter-defense)
   - [9.5 Android Mobile Client Hardening](#95-android-mobile-client-hardening)
   - [9.6 Comprehensive Security Audit Checklist](#96-comprehensive-security-audit-checklist)

---

## 1. Executive Overview & System Architecture

**Zorin Connect** is the integrated remote-control and device continuity framework engineered for Zorin OS. It establishes an encrypted, bidirectional, zero-cloud peer-to-peer data bridge between your Linux desktop and your Android smartphone or tablet over local Wi-Fi, mobile hotspots, or secure mesh VPNs.

### 1.1 Subsystem Topology & Protocol Wire Format

Under the hood, Zorin Connect implements the **KDE Connect wire protocol** wrapped in an optimized GNOME Shell architecture (GSConnect) on Zorin OS Core and Pro, or native Qt/KDE Connect on Zorin OS Lite:

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                ZORIN CONNECT FULL ARCHITECTURE                                  │
├─────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                 │
│   [ ANDROID SMARTPHONE / TABLET ]                                                               │
│   • Apps: Zorin Connect (`com.zorin.connect`) / KDE Connect (`org.kde.kdeconnect_tp`)           │
│   • Sensors: 6-Axis IMU Gyroscope (Presentation Pointer) · Multi-Touch Digitizer · Virtual Keys │
│   • Subsystems: MPRIS Controller · Notification Listener · SFTP Storage Server                  │
│         │                                                                                       │
│         │ UDP Ports 1714:1764 (Identity Beacons & UDP Discovery Broadcasts)                     │
│         │ TCP Ports 1714:1764 (Mutual TLS 1.3 Handshake, Encrypted JSON Payloads)               │
│         ▼                                                                                       │
│   ┌─────────────────────────────────────────────────────────────────────────────────────────┐   │
│   │ NETWORK BOUNDARY: Local Wi-Fi / Hotspot / Tailscale WireGuard Mesh Tunnel               │   │
│   │ Firewall Gatekeeper: UFW Rule `1714:1764/udp` and `1714:1764/tcp`                       │   │
│   └─────────────────────────────────────────────────────────────────────────────────────────┘   │
│         │                                                                                       │
│         ▼                                                                                       │
│   [ ZORIN OS 18.1 DESKTOP SUBSYSTEM ]                                                           │
│   ┌─────────────────────────────────────────────────────────────────────────────────────────┐   │
│   │ Zorin OS Core & Pro (GNOME 46+ Shell Extension)                                         │   │
│   │ • GJS Service Daemon: `org.gnome.Shell.Extensions.GSConnect`                            │   │
│   │ • Wayland Compositor Hook: Mutter / Clutter Event Synth & `libei` Protocol              │   │
│   │ • Audio/Media: D-Bus MPRIS2 (`org.mpris.MediaPlayer2.*`) & PipeWire/PulseAudio          │   │
│   │ • Shell Execution: Native GSubprocess / `loginctl` / `systemctl` / `pactl`              │   │
│   │ • Storage Engine: GVFS SFTP Backend (`sftp://<phone-ip>:1739`)                          │   │
│   └─────────────────────────────────────────────────────────────────────────────────────────┘   │
│   ┌─────────────────────────────────────────────────────────────────────────────────────────┐   │
│   │ Zorin OS Lite (XFCE Desktop)                                                            │   │
│   │ • Qt Daemon: `kdeconnectd` + `indicator-kdeconnect`                                      │   │
│   │ • Input Hook: X11 XTest Extension (`xdotool` Compatible)                                │   │
│   └─────────────────────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Desktop Flavor Comparison: Core/Pro vs Lite

| Feature / Metric | Zorin OS Core / Pro (GNOME Shell) | Zorin OS Lite (XFCE Desktop) |
|:---|:---|:---|
| **Underlying Subsystem** | GSConnect (`gnome-shell-extension-zorin-connect`) | Native KDE Connect (`kdeconnect`) |
| **Language & Runtime** | JavaScript / GObject Introspection (GJS) | C++ / Qt 6 / KDE Frameworks |
| **Desktop Integration** | Top bar system tray menu & native GNOME Settings | System tray indicator (`indicator-kdeconnect`) |
| **Default Display Server** | Wayland (Mutter Compositor) | X11 (Xfwm4) |
| **Input Injection Layer** | Mutter / Clutter Event Pipeline & `libei` | X11 XTest extension |
| **Session D-Bus Name** | `org.gnome.Shell.Extensions.GSConnect` | `org.kde.kdeconnect` |
| **Config Directory** | `~/.config/gsconnect/` | `~/.config/kdeconnect/` |

### 1.3 Network Architecture & Port Taxonomy

Zorin Connect requires open communication across a contiguous bracket of 51 ports:

| Port Range | Protocol | Direction | Subsystem | Functional Purpose |
|:---|:---:|:---:|:---|:---|
| **1714–1764** | UDP | Bidirectional | Device Discovery | Broadcast and reception of identity discovery beacons (`kdeconnect.identity`) |
| **1714–1764** | TCP | Bidirectional | Core Payload & TLS | Encrypted connection, certificate exchange, remote control, and commands |
| **1739–1740** | TCP | Inbound to Android | SFTP Storage Engine | GVFS / SSHFS file browsing engine for remote storage traversal |

### 1.4 Security Architecture & Cryptographic Guarantees

1. **Zero Cloud Infrastructure:** All network packets remain strictly peer-to-peer. No account creation, cloud relays, or external servers are involved.
2. **Mutual RSA Certificate Verification:** Both devices generate 2048-bit (or 4096-bit) RSA key pairs and self-signed X.509 certificates. The link is upgraded to TLS 1.3. Unpaired devices or rogue actors on the same Wi-Fi cannot inject packets.
3. **Explicit Interactive Pairing:** A pairing attempt requires physical confirmation on both the mobile handset and the desktop screen simultaneously.
4. **Execution Permissions:** Commands execute strictly with the unprivileged permissions of the currently logged-in desktop user.

---

## 2. Prerequisites, Installation & Pre-Flight Checks

### 2.1 Desktop Verification & Installation

* **Zorin OS Core & Pro:** Pre-installed out of the box. Verify its operational state via terminal:
  ```bash
  gnome-extensions list | grep -E "zorin-connect|gsconnect"
  ```
* **Zorin OS Lite:** Install the KDE Connect engine and indicator applet:
  ```bash
  sudo apt update
  sudo apt install kdeconnect indicator-kdeconnect -y
  ```

### 2.2 Mobile Client Acquisition Channels

| Distribution Channel | Package Identifier | Recommended For | Link / Source |
|:---|:---|:---|:---|
| **Google Play Store** | `com.zorin.connect` | Standard Android smartphones & tablets | [Zorin Connect on Google Play](https://play.google.com/store/apps/details?id=com.zorin.connect) |
| **GitHub Releases** | `com.zorin.connect` | Direct APK sideloading & offline installations | [ZorinOS/zorin-connect-android](https://github.com/ZorinOS/zorin-connect-android/releases) |
| **F-Droid Repository** | `org.kde.kdeconnect_tp` | De-Googled devices, GrapheneOS, CalyxOS, Fairphone | [KDE Connect on F-Droid](https://f-droid.org/en/packages/org.kde.kdeconnect_tp/) |

### 2.3 Network Pre-Flight & Router Best Practices

1. **Subnet Verification:** Confirm that both your PC and phone share the identical IP subnet prefix:
   * On Zorin OS: Run `ip -br a` (e.g., `192.168.1.145/24`).
   * On Android: Navigate to **Settings → About Phone → Status → IP Address** (e.g., `192.168.1.82`).
2. **Router AP Isolation:** Ensure that "AP Isolation" / "Client Isolation" is **Disabled** in your router's wireless settings.
3. **Guest Networks:** Do not use guest Wi-Fi networks, as routers isolate guest clients from local devices.
4. **VPN Bypass:** If running a commercial VPN on your desktop or phone, toggle on "Allow Local LAN Traffic" or disable the VPN during pairing.

---

## 3. Firewall Configuration: The "Easy Method" & UFW Setup

As documented in the Zorin Forum tutorial (*"Zorin Connect the easy method"* by `swarfendor437`), the system firewall (UFW) blocks incoming discovery packets by default. You must configure an allow rule for Zorin Connect.

### 3.1 Graphical Setup via Gufw

1. Open the terminal and launch the firewall GUI:
   ```bash
   gufw
   ```
2. Enter your password to obtain administrative root privileges.
3. Switch the firewall **Status** toggle to **On**.
4. Click the **Rules** tab, then click the **`+` (Add)** icon at the bottom-left corner.
5. In the rule creation window:
   * **Preconfigured Approach:** Select the **Preconfigured** tab → Application → choose **Zorin Connect** (or **KDE Connect**) → Policy: **Allow** → Direction: **In** → Click **Add**.
   * **Simple Port Approach:** Select the **Simple** tab → Name: `Zorin Connect` → Policy: **Allow** → Direction: **In** → Protocol: **Both** → Port: `1714:1764` → Click **Add**.

### 3.2 Terminal Command Configuration (UFW)

Alternatively, execute these commands in your terminal for an instant setup:

```bash
# Allow UDP for discovery broadcasts
sudo ufw allow 1714:1764/udp comment 'Zorin Connect Discovery'

# Allow TCP for control payloads and TLS connections
sudo ufw allow 1714:1764/tcp comment 'Zorin Connect Control'

# Reload firewall to apply rules immediately
sudo ufw reload

# Verify active status
sudo ufw status verbose
```

---

## 4. Step-by-Step Device Pairing & Mobile Permissions

### 4.1 Pairing Walkthrough & Fingerprint Verification

1. On Zorin OS, open **Settings → Zorin Connect** (or click the top-bar indicator).
2. On Android, launch the **Zorin Connect** (or KDE Connect) app. Pull down on the screen to scan.
3. Tap your computer's name (e.g., `zorin-desktop`) under **Discovered Devices**.
4. Tap **Request Pairing**.
5. When the pairing prompt appears on your desktop, verify that the cryptographic fingerprint matches the string displayed on your phone.
6. Click **Accept** on both devices.

### 4.2 Android Permissions & Doze Mode Exemption

| Permission Name | Operational Purpose | How to Enable on Android | Mandatory / Optional |
|:---|:---|:---|:---:|
| **Accessibility Service** | Enables intercepting hardware volume keys for presentation slide advancement | Android Settings → Accessibility → Installed Apps → Zorin Connect → Enable | **Mandatory for Slide Remote** |
| **Ignore Battery Optimization** | Prevents Android Doze mode from killing the background daemon when screen sleeps | App Info → Battery → Set to **Unrestricted** | **Mandatory for Persistent Link** |
| **Notification Listener** | Allows mirroring mobile notifications and inline text messaging | Android Settings → Apps → Special app access → Notification access → Allow | Recommended |
| **Contacts & SMS Access** | Resolves sender phone numbers to address book contacts; allows sending SMS | App Info → Permissions → Contacts & SMS → Allow | Optional (Messaging only) |
| **Storage / Media Access** | Enables bidirectional file transfers and camera roll sync | App Info → Permissions → Photos & Videos / Files → Allow All | Recommended |
| **Location Access** | Required by Android 10+ to read local Wi-Fi SSID for network discovery | App Info → Permissions → Location → Allow while using app | Mandatory for Wi-Fi Discovery |

---

## 5. Core Remote Control Features: Interactive Operation

### 5.1 Remote Touchpad, Gestures & Pointer Control

| Gesture | Physical Action | Desktop Action Triggered | Typical Use Case |
|:---|:---|:---|:---|
| **Cursor Move** | Slide single finger across phone glass | Translates mouse pointer across desktop displays | Precise cursor repositioning |
| **Left Click** | Quick single tap with one finger | Primary mouse click (`BTN_LEFT`) | Selecting files, clicking UI links, focusing windows |
| **Right Click** | Quick tap with two fingers simultaneously | Secondary context menu click (`BTN_RIGHT`) | Spawning desktop context menus and file options |
| **Middle Click** | Quick tap with three fingers simultaneously | Middle mouse click (`BTN_MIDDLE`) | Opening links in new browser tabs; closing tabs |
| **Two-Finger Scroll** | Drag two fingers vertically or horizontally | Emulates mouse scroll wheel (`REL_WHEEL`) | Scrolling web pages, PDF documents, terminal history |
| **Drag and Drop** | Double-tap and hold on the second tap, then drag | Click-hold mouse drag | Dragging desktop windows, moving files between folders |

### 5.2 Virtual Keyboard, Modifiers & Shortcut Combinations

Tapping the keyboard icon atop the Remote Input view provides access to full text typing and hardware modifier keys:

| Key Token | Visual Icon | Desktop Signal | Common Remote Shortcut Combinations |
|:---|:---:|:---|:---|
| **Super / Meta** | `❖` or `Super` | `KEY_LEFTMETA` (Windows Key) | `Super` (Open App Grid) · `Super + D` (Show Desktop) |
| **Control** | `Ctrl` | `KEY_LEFTCTRL` | `Ctrl + Alt + T` (Spawn Terminal) · `Ctrl + C` / `Ctrl + V` |
| **Alternate** | `Alt` | `KEY_LEFTALT` | `Alt + Tab` (Window Switcher) · `Alt + F4` (Close Active Window) |
| **Shift** | `Shift` | `KEY_LEFTSHIFT` | Used with modifiers for extended desktop shortcuts |
| **Escape** | `Esc` | `KEY_ESC` | Exits full-screen video, cancels modals, exits Vim command mode |
| **Tab** | `Tab` | `KEY_TAB` | Form field navigation and terminal tab-completion |
| **Arrow Pad** | `▲ ▼ ◄ ►` | `KEY_UP/DOWN/LEFT/RIGHT` | Document navigation, terminal command history replay |

### 5.3 Multimedia Hub (MPRIS2 Engine & Call Muting)
* **Full Transport Controls:** Play, pause, skip forward, skip backward, and timeline scrub bar.
* **Volume Control:** Master slider on phone adjusts desktop system audio.
* **Multi-App Compatibility:** Controls Spotify, VLC, MPV, Rhythmbox, and web browser tabs (YouTube in Firefox/Chrome).
* **Telephony Auto-Mute:** Automatically mutes desktop audio and pauses video playback when an incoming phone call rings.

### 5.4 Presentation Remote & Gyroscopic Air Pointer
* **Slide Navigation:** Large Previous and Next buttons advance slides in LibreOffice Impress, Google Slides, and PDF viewers.
* **Physical Volume Keys:** Advance slides using your phone's physical **Volume Up** (Next) and **Volume Down** (Prev) buttons.
* **Gyroscopic Laser Pointer:** Press and hold the **Pointer** button on screen and wave your phone in the air. The internal 6-axis gyroscope translates wrist orientation into relative on-screen cursor movements in real time. Releasing your thumb instantly freezes the pointer to prevent drift.

### 5.5 High-Speed File Transfers & SFTP Storage Mounting
* **Phone to PC:** Tap Share in Android Gallery/Files → Zorin Connect → Files stream directly to `~/Downloads`.
* **PC to Phone:** Right-click any file in Nautilus → "Send to [Phone Name] via Zorin Connect".
* **Browse Device (SFTP):** Click the top panel indicator → "Browse Device". Zorin OS mounts your smartphone storage as a native GVFS folder (`sftp://<phone-ip>:1739/`).

### 5.6 Shared Clipboard & Android 10+ Workarounds
* **Desktop to Phone:** Copy on Linux (`Ctrl + C`) → Paste on Android (`Paste`).
* **Phone to Desktop:** Because Android 10+ restricts background apps from reading clipboard data, swipe down your notification shade and tap **"Send Clipboard"** (or use the dedicated Quick Settings Tile).

### 5.7 Notification Hub, SMS Messaging & Device Ringing
* **Notification Sync:** Mirror incoming push alerts to desktop notifications with inline reply support.
* **Zorin SMS App:** Launch the native desktop SMS app to view conversation threads and compose text messages.
* **Ring Phone:** Click "Ring Phone" from the top panel menu to sound a loud alarm on a misplaced phone, even if set to Silent or Do Not Disturb.

---

## 6. Intermediate Automation: Custom "Run Commands"

### 6.1 Run Commands Execution Model & Security
Commands are pre-registered on the desktop and triggered via cryptographic token requests from Android. They execute asynchronously within your logged-in user desktop session without requiring root privileges.

### 6.2 Production Command Recipe Catalog

| Domain | Action | Friendly Name | Shell Command |
|:---|:---|:---|:---|
| **Power** | Lock Screen | `Lock PC` | `loginctl lock-session` |
| **Power** | Unlock Session | `Unlock PC` | `loginctl unlock-session` |
| **Power** | Suspend System | `Sleep PC` | `systemctl suspend` |
| **Power** | Power Off | `Shutdown PC` | `systemctl poweroff` |
| **Power** | Reboot System | `Reboot PC` | `systemctl reboot` |
| **Display** | Blank Monitors | `Screens Off` | `sh -c "sleep 0.5 && (wlopm --off \|\| xset dpms force off)"` |
| **Audio** | Toggle Mute | `Mute Audio` | `pactl set-sink-mute @DEFAULT_SINK@ toggle` |
| **Audio** | Volume +5% | `Volume +5%` | `pactl set-sink-volume @DEFAULT_SINK@ +5%` |
| **Audio** | Volume -5% | `Volume -5%` | `pactl set-sink-volume @DEFAULT_SINK@ -5%` |
| **Audio** | Kill Media | `Stop Media` | `sh -c "pkill -f vlc \|\| pkill -f spotify \|\| playerctl pause"` |
| **Apps** | Open Terminal | `Terminal` | `gnome-terminal` (or `xfce4-terminal`) |
| **Apps** | Open Files | `File Manager` | `nautilus ~` |
| **Apps** | Empty Trash | `Empty Trash` | `rm -rf ~/.local/share/Trash/files/*` |
| **Alerts** | Push PC IP | `Check PC IP` | `sh -c "notify-send 'PC IP' \"\$(hostname -I \| awk '{print \$1}')\""` |
| **Alerts** | Check CPU Temp | `CPU Temp` | `sh -c "notify-send 'CPU Temp' \"\$(sensors \| grep -E 'Package id 0\|Tctl' \| awk '{print \$2,\$3,\$4}')\""` |
| **Alerts** | Check Storage | `Disk Space` | `sh -c "notify-send 'Disk' \"\$(df -h / \| awk 'NR==2 {print \$4 \\\" free\\\"}')\""` |

### 6.3 Multi-Step Automation Shell Scripts

Create reusable multi-action scripts in `~/.local/bin/zorin-remote-scripts/`:

```bash
# Setup script directory
mkdir -p ~/.local/bin/zorin-remote-scripts
chmod 700 ~/.local/bin/zorin-remote-scripts

# Create Conference Presentation Mode script
cat << 'EOF' > ~/.local/bin/zorin-remote-scripts/presentation-mode.sh
#!/usr/bin/env bash
gsettings set org.gnome.desktop.notifications show-banners false
pactl set-sink-volume @DEFAULT_SINK@ 75%
gnome-session-inhibit --inhibit idle --reason "Presenting from Android" &
notify-send "Presentation Mode" "Do Not Disturb enabled. Volume set to 75%."
EOF
chmod +x ~/.local/bin/zorin-remote-scripts/presentation-mode.sh
```

---

## 7. Advanced Architecture: Wayland, D-Bus & Global Control

### 7.1 Wayland Input Injection & `ydotool` Automation

In Zorin OS 18.1 Wayland, traditional tools like `xdotool` cannot simulate keystrokes across windows. Deploy **`ydotool`** to automate system keyboard inputs via `/dev/uinput`:

```bash
# Install and initialize ydotool
sudo apt install ydotool -y
sudo usermod -aG input $USER
ydotoold &
```

* **Simulate Show Desktop (Super+D):** `ydotool key 125:1 32:1 32:0 125:0`
* **Simulate Terminal Spawn (Ctrl+Alt+T):** `ydotool key 29:1 56:1 20:1 20:0 56:0 29:0`

### 7.2 Programmatic D-Bus Control via `gdbus`

Interact with your connected phone directly from the Linux CLI:

```bash
# Find device D-Bus object path
DEVICE_PATH=$(gdbus call --session \
  --dest org.gnome.Shell.Extensions.GSConnect \
  --object-path /org/gnome/Shell/Extensions/GSConnect \
  --method org.gnome.Shell.Extensions.GSConnect.ListDevices | grep -o "'[^']*'" | head -n1 | tr -d "'")

# Ring the phone from terminal
gdbus call --session --dest org.gnome.Shell.Extensions.GSConnect \
  --object-path "${DEVICE_PATH}" --method org.gnome.Shell.Extensions.GSConnect.Device.FindMyPhone

# Push a custom notification to Android screen
gdbus call --session --dest org.gnome.Shell.Extensions.GSConnect \
  --object-path "${DEVICE_PATH}" --method org.gnome.Shell.Extensions.GSConnect.Device.ShareText \
  "Remote server maintenance complete."
```

### 7.3 Global Remote Control Beyond LAN (Tailscale Mesh VPN)

To remotely control your Zorin OS desktop over 5G cellular or external Wi-Fi networks worldwide:

1. **Install Tailscale on Zorin OS 18.1:**
   ```bash
   curl -fsSL https://tailscale.com/install.sh | sh
   sudo tailscale up
   tailscale ip -4  # e.g., 100.115.30.88
   ```
2. **Open Tailscale Interface in UFW:**
   ```bash
   sudo ufw allow in on tailscale0 to any port 1714:1764 proto tcp
   sudo ufw allow in on tailscale0 to any port 1714:1764 proto udp
   sudo ufw reload
   ```
3. **Install Tailscale on Android:** Connect to the same Tailscale account.
4. **Pair by IP in Android App:** In Zorin Connect Android app, tap **⋮ → Add devices by IP** → Enter desktop's `100.x.y.z` Tailscale IP → Request Pairing.

### 7.4 Off-Grid Mobile Travel Topology
When traveling without an external router:
1. Enable **Personal Hotspot** on your Android phone.
2. Connect your Zorin OS laptop to your phone's hotspot Wi-Fi.
3. Both devices will share the phone's local DHCP network (e.g., `192.168.43.0/24`).
4. Full remote trackpad, presentation clicker, and file transfer functionality operate across the direct Wi-Fi link with **zero cellular data consumption**.

### 7.5 Cryptographic Key Rotation & Certificate Hardening
Keys and certificates are stored in `~/.config/gsconnect/` (`certificate.pem` and `private.pem`). If certificates become corrupted, execute an emergency regeneration:

```bash
pkill -f gsconnect
mkdir -p ~/.config/gsconnect_backup
mv ~/.config/gsconnect/*.pem ~/.config/gsconnect_backup/ 2>/dev/null
openssl req -new -x509 -sha256 -newkey rsa:2048 -nodes \
  -keyout ~/.config/gsconnect/private.pem -days 3650 \
  -out ~/.config/gsconnect/certificate.pem \
  -subj "/CN=ZorinOS-Workstation/O=ZorinConnect"
chmod 600 ~/.config/gsconnect/private.pem
gnome-extensions disable zorin-connect@zorinos.com
gnome-extensions enable zorin-connect@zorinos.com
```

---

## 8. Troubleshooting Matrix & Operational Runbook

### 8.1 Diagnostic Flowchart

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                ZORIN CONNECT DIAGNOSTIC FLOWCHART                               │
├─────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                 │
│                        [ START: Device Cannot Connect or Control PC ]                           │
│                                       │                                                         │
│                                       ▼                                                         │
│                      Are both devices on the SAME local IP subnet?                              │
│                      (e.g., both 192.168.1.xxx or both on Tailscale)                            │
│                                  /         \                                                    │
│                           [NO]  /           \  [YES]                                            │
│                                ▼             ▼                                                  │
│        Connect both to same Wi-Fi        Are UFW ports 1714:1764 opened                         │
│        (or configure Tailscale VPN)      on Zorin OS desktop?                                   │
│                                              /         \                                        │
│                                       [NO]  /           \  [YES]                                │
│                                            ▼             ▼                                      │
│                                Run `sudo ufw allow`   Is Router AP Isolation /                  │
│                                for 1714:1764 UDP/TCP  Client Isolation enabled?                 │
│                                                           /         \                           │
│                                                    [YES] /           \ [NO]                     │
│                                                         ▼             ▼                         │
│                                                 Disable Isolation   Does connection drop when   │
│                                                 in router settings  phone screen turns off?     │
│                                                                        /         \              │
│                                                                 [YES] /           \ [NO]        │
│                                                                      ▼             ▼            │
│                                                             Set Android Battery   Run Doctor    │
│                                                             to "Unrestricted"     Diagnostic    │
│                                                             (Bypass Doze Mode)    Script Below  │
│                                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 8.2 Exhaustive Failure Resolution Table

| Issue / Symptom | Probable Root Cause | Verification Command / Check | Resolution & Remediation |
|:---|:---|:---|:---|
| **Infinite "Searching for devices" on both screens** | Host firewall (UFW) blocking incoming UDP/TCP discovery packets | `sudo ufw status \| grep 1714` | Run `sudo ufw allow 1714:1764/udp && sudo ufw allow 1714:1764/tcp && sudo ufw reload` |
| **Devices on same Wi-Fi cannot see each other** | Router has "AP Isolation" or "Guest Network" isolation enabled | Try pinging phone IP from Linux: `ping -c 3 <phone-ip>` | Log into router admin portal; disable "AP Isolation" or "Client Isolation"; move off Guest Wi-Fi |
| **Zorin OS inside Virtual Machine (VM) won't discover phone** | VM is using NAT networking instead of Bridged mode | Check VM IP: `ip -br a` (starts with `10.0.2.x` instead of `192.168.1.x`) | Change VM network adapter in VirtualBox/VMware/KVM from **NAT** to **Bridged Adapter** |
| **"Pairing rejected" or cryptographic handshake failure** | Corrupted X.509 certificate or system clock skew | `timedatectl status` (check NTP sync) | Verify time synchronization (`sudo timedatectl set-ntp on`); delete old certs in `~/.config/gsconnect/` and re-pair |
| **Trackpad pointer stutters or lags noticeably** | 2.4 GHz RF congestion or Wi-Fi power saving on Linux NIC | `iwconfig \| grep "Power Management"` | Turn off Wi-Fi power saving: `sudo iwconfig wlan0 power off`; switch devices to 5 GHz or 6 GHz Wi-Fi band |
| **Gyroscopic presentation pointer drifts off target** | Phone IMU gyroscope accumulation drift | Pointer drifts when holding button without moving hand | Release the Pointer button on screen to reset position; perform a "figure-8" motion in air to calibrate phone compass/gyro |
| **Connection disconnects 5 minutes after phone screen locks** | Android Doze mode suspends background socket daemon | Check phone battery settings | Open Android Settings → Apps → Zorin Connect → Battery → Change from "Optimized" to **"Unrestricted"** |
| **Custom "Run Command" does not trigger or fails silently** | Command relies on `xdotool` under Wayland or lacks execution permissions | Test command directly in desktop terminal | Replace `xdotool` with `ydotool` or native D-Bus; verify script has `chmod +x` permissions |
| **Clipboard copied on phone does not paste on Zorin OS** | Android 10+ background clipboard security restrictions | Check Android version in Settings | Android prohibits background clipboard reading; use the **"Send Clipboard"** notification button or Quick Settings tile |
| **"Browse Device" (SFTP) times out or shows empty folder** | Android file permission missing or port 1739 blocked | Check App Permissions in Android | Grant "All Files Access" / "Photos and Videos" permission; ensure port 1739 is not blocked |

### 8.3 Resolving Virtual Machine (VM) Isolation

When testing Zorin OS 18.1 inside VirtualBox or VMware:
* **The Root Cause:** Hypervisors default to NAT mode, which places the VM on an isolated internal subnet (`10.0.2.15`). UDP broadcast packets from physical Wi-Fi devices cannot reach the VM.
* **The Fix:** Power off the virtual machine, open its **Network Settings**, and switch the adapter from **NAT** to **Bridged Adapter**. Select your host computer's physical network adapter. When powered on, the VM will receive an IP address on your physical home subnet (`192.168.1.xxx`) and pairing will succeed immediately.

### 8.4 Automated Diagnostic Tool: `zorin-connect-doctor.sh`

Deploy this automated 7-point health verification script to inspect your system:

```bash
cat << 'EOF' > ~/zorin-connect-doctor.sh
#!/usr/bin/env bash
# ==============================================================================
# Zorin Connect Doctor: Automated Diagnostic & Health Verification Script
# Target: Zorin OS 18.1 / GNOME 46+ (GSConnect) & XFCE (KDE Connect)
# ==============================================================================

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}==============================================================================${NC}"
echo -e "${BLUE}                   ZORIN CONNECT SYSTEM HEALTH VERIFICATION                   ${NC}"
echo -e "${BLUE}==============================================================================${NC}"

# 1. Desktop & Display Server Check
echo -e "\n[*] Desktop Environment: ${YELLOW}${XDG_CURRENT_DESKTOP}${NC}"
echo -e "[*] Display Server:      ${YELLOW}${XDG_SESSION_TYPE}${NC}"

# 2. GNOME Extension / Daemon Check
echo -e "\n[*] Checking Extension & Daemon Status..."
if command -v gnome-extensions &>/dev/null; then
    EXT_STATUS=$(gnome-extensions list --enabled | grep -E "zorin-connect|gsconnect")
    if [ -n "$EXT_STATUS" ]; then
        echo -e "    ${GREEN}[PASS]${NC} GNOME Extension is ENABLED (${EXT_STATUS})"
    else
        echo -e "    ${RED}[FAIL]${NC} Zorin Connect extension is NOT enabled in GNOME Shell!"
        echo -e "    ${YELLOW}[FIX]${NC}  Run: gnome-extensions enable zorin-connect@zorinos.com"
    fi
else
    if pgrep -x "kdeconnectd" > /dev/null; then
        echo -e "    ${GREEN}[PASS]${NC} kdeconnectd daemon is active and running."
    else
        echo -e "    ${RED}[FAIL]${NC} kdeconnectd daemon is not running."
    fi
fi

# 3. D-Bus Session Verification
echo -e "\n[*] Checking D-Bus Session Communication..."
if gdbus introspect --session --dest org.gnome.Shell.Extensions.GSConnect --object-path /org/gnome/Shell/Extensions/GSConnect &>/dev/null; then
    echo -e "    ${GREEN}[PASS]${NC} GSConnect D-Bus service is responsive."
elif qdbus org.kde.kdeconnect &>/dev/null; then
    echo -e "    ${GREEN}[PASS]${NC} KDE Connect D-Bus service is responsive."
else
    echo -e "    ${YELLOW}[WARN]${NC} D-Bus service not responding directly (may start on connection)."
fi

# 4. Firewall Inspection
echo -e "\n[*] Inspecting Firewall (UFW) Port Configuration..."
if command -v ufw &>/dev/null; then
    UFW_STATUS=$(sudo ufw status | grep "Status: active")
    if [ -n "$UFW_STATUS" ]; then
        UFW_UDP=$(sudo ufw status | grep -E "1714:1764.*ALLOW.*UDP")
        UFW_TCP=$(sudo ufw status | grep -E "1714:1764.*ALLOW.*TCP")
        if [ -n "$UFW_UDP" ] && [ -n "$UFW_TCP" ]; then
            echo -e "    ${GREEN}[PASS]${NC} Ports 1714:1764 UDP and TCP are allowed."
        else
            echo -e "    ${RED}[FAIL]${NC} Firewall rules for Zorin Connect are MISSING!"
            echo -e "    ${YELLOW}[FIX]${NC}  Execute: sudo ufw allow 1714:1764/udp && sudo ufw allow 1714:1764/tcp && sudo ufw reload"
        fi
    else
        echo -e "    ${YELLOW}[INFO]${NC} UFW is inactive."
    fi
fi

# 5. Socket Inspection
echo -e "\n[*] Inspecting Local Network Listening Ports..."
LISTEN_PORTS=$(ss -tuln | grep -E ":171[4-9]|:172[0-9]|:173[0-9]|:174[0-9]|:175[0-9]|:176[0-4]")
if [ -n "$LISTEN_PORTS" ]; then
    echo -e "    ${GREEN}[PASS]${NC} Subsystem is listening on KDE Connect port brackets:"
    echo "$LISTEN_PORTS" | awk '{print "           " $1, $5}'
else
    echo -e "    ${YELLOW}[WARN]${NC} No active listening sockets detected on 1714:1764."
fi

# 6. Cryptographic Certificate Inspection
echo -e "\n[*] Verifying Cryptographic Materials..."
if [ -f "$HOME/.config/gsconnect/certificate.pem" ] && [ -f "$HOME/.config/gsconnect/private.pem" ]; then
    echo -e "    ${GREEN}[PASS]${NC} GSConnect TLS keys and certificate are present."
elif [ -f "$HOME/.config/kdeconnect/certificate.pem" ]; then
    echo -e "    ${GREEN}[PASS]${NC} KDE Connect TLS certificate is present."
else
    echo -e "    ${YELLOW}[WARN]${NC} Certificates not found (will generate on first run)."
fi

# 7. Print Local IP Interfaces
echo -e "\n[*] Host Network IP Addresses for Manual Pairing:"
ip -br addr show | awk '{print "    • " $1 ": " $3}'

echo -e "\n${BLUE}==============================================================================${NC}"
echo -e "${BLUE}                        DIAGNOSTIC RUN COMPLETED                              ${NC}"
echo -e "${BLUE}==============================================================================${NC}"
EOF
chmod +x ~/zorin-connect-doctor.sh
```

---

## 9. Security Hardening & Home Network Defense

Connecting your smartphone to your Linux desktop creates an intimate bridge between personal devices. While Zorin Connect is open-source and uses mutual TLS encryption, running listening network services and remote command execution daemons introduces specific attack surfaces that must be understood and hardened against hackers.

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   THREAT MODEL & ATTACK VECTORS                                 │
├─────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                 │
│  [ EXTERNAL THREAT: GLOBAL INTERNET ]                                                           │
│  Port Scanners (Shodan / Censys) ──► Attempted WAN Exploits ──► [ ROUTER PERIMETER ]            │
│  • THREAT: User carelessly forwards ports 1714:1764 on home router to public internet.          │
│  • DEFENSE: NEVER forward ports! Enforce Tailscale WireGuard mesh for remote access.            │
│                                                                                                 │
│  [ INTERNAL THREAT: COMPROMISED LOCAL LAN / IOT DEVICES ]                                       │
│  Malicious Smart TV / IP Camera ──► ARP Spoofing / Packet Sniffing ──► [ LOCAL WI-FI SUBNET ]   │
│  • THREAT: Compromised IoT device pivots onto trusted LAN, attempting to exploit open ports.    │
│  • DEFENSE: Network segmentation (VLANs / Guest Network); IP-restricted UFW firewall rules.    │
│                                                                                                 │
│  [ WIRELESS THREAT: UNTRUSTED / PUBLIC WI-FI (AIRPORTS, COFFEE SHOPS) ]                         │
│  Rogue Actor / Evil Twin AP ──► Unauthorized Pairing Spam / Replay ──► [ LAPTOP ON TRAVEL ]     │
│  • THREAT: Attacker on public Wi-Fi triggers fake pairing modals or exploits unpatched bugs.    │
│  • DEFENSE: NetworkManager dispatcher script auto-disables Zorin Connect on untrusted SSIDs.   │
│                                                                                                 │
│  [ APPLICATION THREAT: REMOTE COMMAND INJECTION & PRIVILEGE ESCALATION ]                        │
│  Compromised Handset ──► Injected Terminal Commands ──► [ ZORIN OS DESKTOP SESSION ]            │
│  • THREAT: Malicious shell payload executed with elevated root or sudo privileges.              │
│  • DEFENSE: Principle of Least Privilege: Zero sudoers access; strict path parameterization.    │
│                                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 9.1 Threat Modeling & Attack Surface Analysis

| Component | Default Listening Ports | Potential Vulnerability / Attack Vector | Hardening Mitigation |
|:---|:---:|:---|:---|
| **UDP Discovery Engine** | `1714–1764/udp` | Packet sniffing, local network presence disclosure, broadcast replay attacks | Bind rules strictly to trusted interfaces; restrict IP ranges in UFW |
| **TCP Control & TLS** | `1714–1764/tcp` | TLS cipher downgrade, rogue pairing spam, protocol parsing flaws | Restrict incoming connections to paired device IP; enforce TLS 1.3 |
| **SFTP Storage Server** | `1739–1740/tcp` | Path traversal attacks, unauthorized directory browsing | Sandbox storage folder to dedicated isolated landing directory |
| **Run Command Plugin** | Internal D-Bus | Command injection, arbitrary code execution, privilege escalation | Never grant `sudo` rights; sanitize scripts; use absolute paths |
| **Shared Clipboard** | Protocol Channel | Sensitive data leakage (passwords, 2FA tokens, crypto addresses) | Clear clipboard after copying secrets; disable auto-sync when in public |

### 9.2 Zorin Connect Application Hardening & Sandboxing

1. **Cryptographic Key Permissions:**
   Ensure private keys and certificates are restricted to your user account only:
   ```bash
   chmod 700 ~/.config/gsconnect 2>/dev/null || chmod 700 ~/.config/kdeconnect 2>/dev/null
   chmod 600 ~/.config/gsconnect/*.pem 2>/dev/null || chmod 600 ~/.config/kdeconnect/* 2>/dev/null
   ```
2. **Out-of-Band Fingerprint Verification:**
   Before accepting any pairing prompt, visually verify that the SHA-256 fingerprint on Zorin OS matches the phone screen. If an unexpected pairing modal appears, reject it immediately.
3. **Hardening the Run Command Subsystem:**
   * **Never grant sudo privileges:** Do not add `sudo` to any Zorin Connect command.
   * **Use Absolute Executable Paths:** Always write `/usr/bin/loginctl` or `/usr/bin/systemctl` rather than bare commands to protect against `$PATH` spoofing.
4. **File Transfer Sandboxing:**
   Create an isolated quarantine folder (`~/Downloads/ZorinConnect_Quarantine`) and designate it as the receive folder in Zorin Connect settings.
5. **NetworkManager Trust Gating for Laptops:**
   Deploy a dispatcher script in `/etc/NetworkManager/dispatcher.d/99-zorin-connect-trust-gate.sh` that automatically enables Zorin Connect only when connected to your home Wi-Fi SSID, and disables the extension on untrusted public networks.

### 9.3 Host-Level Linux Security Hardening (UFW & Sysctl)

1. **UFW Micro-Segmentation:**
   Restrict incoming ports 1714:1764 strictly to your smartphone's static IP address:
   ```bash
   sudo ufw delete allow 1714:1764/udp 2>/dev/null
   sudo ufw delete allow 1714:1764/tcp 2>/dev/null
   sudo ufw allow from 192.168.1.82 to any port 1714:1764 proto udp comment 'Zorin Connect Phone UDP'
   sudo ufw allow from 192.168.1.82 to any port 1714:1764 proto tcp comment 'Zorin Connect Phone TCP'
   sudo ufw default deny incoming
   sudo ufw default allow outgoing
   sudo ufw reload
   ```
2. **Linux Kernel Network Hardening (`sysctl`):**
   Enable SYN cookie protection, strict reverse path filtering, and disable ICMP broadcast echo in `/etc/sysctl.d/99-network-security-hardening.conf`:
   ```bash
   sudo sysctl -w net.ipv4.tcp_syncookies=1
   sudo sysctl -w net.ipv4.conf.all.rp_filter=1
   sudo sysctl -w net.ipv4.icmp_echo_ignore_broadcasts=1
   ```
3. **Encrypted DNS over TLS (DoT):**
   Configure `systemd-resolved` with Quad9 (`9.9.9.9#dns.quad9.net`) to encrypt DNS lookups and automatically block malware and phishing domains.

### 9.4 Home Network & Wi-Fi Router Perimeter Defense

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                               SECURE HOME NETWORK SEGMENTATION                                  │
├─────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                 │
│  [ WAN / INTERNET MODEM ]                                                                       │
│         │                                                                                       │
│         ▼                                                                                       │
│  [ SECURE ROUTER ] ── WPA3-Personal (SAE) · UPnP: OFF · WPS: OFF · WAN Remote Admin: OFF        │
│         │                                                                                       │
│         ├─────────────────────────────────────────┐                                             │
│         ▼                                         ▼                                             │
│  [ TRUSTED LAN / VLAN 10 ]                 [ ISOLATED IOT / GUEST VLAN 20 ]                     │
│  • Zorin OS 18.1 Desktop                   • Smart TVs, IP Cameras, Smart Bulbs                 │
│  • Personal Android Smartphone             • Robotic Vacuums, Game Consoles, Smart Plugs        │
│  • Zorin Connect: ACTIVE                   • Zero access to Trusted LAN (Client Isolation: ON)  │
│                                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
```

1. **Disable WPS (Wi-Fi Protected Setup):** Turn off WPS in router settings. WPS PINs can be brute-forced in hours using Reaver or Pixie Dust.
2. **Disable UPnP (Universal Plug and Play):** Prevent rogue IoT devices or malware from punching inbound holes through your router's firewall.
3. **Isolate IoT Devices on a Guest Network / VLAN:** Place smart TVs, IP cameras, and smart plugs on a dedicated Guest Wi-Fi network with Client Isolation turned on, keeping them physically segregated from your Zorin PC and smartphone.
4. **Never Port-Forward Zorin Connect to the WAN:** Do not forward ports 1714:1764 to the internet. For remote access outside home Wi-Fi, use an encrypted WireGuard mesh VPN (Tailscale) with zero public listening ports.

### 9.5 Android Mobile Client Hardening

1. **Enforce Strong Screen Locks & Biometrics:** Set a 6+ character alphanumeric passphrase and biometric unlock.
2. **Disable USB Debugging:** Keep USB debugging disabled in Developer Options to protect against physical extraction and juice-jacking attacks at public USB stations.
3. **Enable Android Private DNS (DoT):** Configure **Private DNS** in Android Network settings to `dns.quad9.net` for malware blocking.
4. **App Integrity:** Install applications strictly from the Google Play Store or F-Droid; never install unverified APKs.

### 9.6 Comprehensive Security Audit Checklist

| Domain | Security Control | Verification Command / Check | Recommended State | Status |
|:---|:---|:---|:---|:---:|
| **Firewall** | UFW Inbound Default | `sudo ufw status verbose` | Default: `deny (incoming)` | [PASS] |
| **Firewall** | Restricted IP Binding | `sudo ufw status \| grep 1714` | Allowed only from phone IP (`192.168.1.82`) | [PASS] |
| **Permissions** | Private Key Permissions | `ls -l ~/.config/gsconnect/private.pem` | `-rw-------` (Permissions: `600`) | [PASS] |
| **Commands** | No Root / Sudo Escalation | `grep -i "NOPASSWD" /etc/sudoers /etc/sudoers.d/*` | Zero entries granting sudo to Zorin Connect | [PASS] |
| **Files** | File Transfer Quarantine | Zorin Connect Settings → Receive Files | Set to `~/Downloads/ZorinConnect_Quarantine` | [PASS] |
| **Travel** | NetworkManager Trust Gate | `ls -l /etc/NetworkManager/dispatcher.d/` | Auto-disable script enabled for public Wi-Fi | [PASS] |
| **Kernel** | Sysctl Spoofing Protection | `sysctl net.ipv4.conf.all.rp_filter` | Value: `1` (Strict Reverse Path Filtering) | [PASS] |
| **DNS** | DNS over TLS (DoT) | `resolvectl status \| grep "DNSOverTLS"` | Value: `yes` (Quad9 / Cloudflare encrypted) | [PASS] |
| **Router** | Wi-Fi Protocol Security | Check Router Wi-Fi Settings | `WPA3-Personal (SAE)` or `WPA2-AES` | [PASS] |
| **Router** | Wi-Fi Protected Setup | Check Router Wireless Settings | `WPS: Disabled` | [PASS] |
| **Router** | UPnP Port Punching | Check Router Firewall / NAT Settings | `UPnP: Disabled` | [PASS] |
| **Router** | WAN Remote Management | Check Router Administration Settings | `Remote WAN Access: Disabled` | [PASS] |
| **Network** | IoT Device Segmentation | Check Router Client List / Subnets | Smart devices on isolated Guest Network / VLAN | [PASS] |
| **Mobile** | USB Debugging Status | Android Settings → Developer Options | `USB Debugging: Disabled` | [PASS] |
| **Mobile** | Private DNS Protection | Android Settings → Network → Private DNS | Set to `dns.quad9.net` | [PASS] |
| **WAN Access** | Zero Port Forwarding | Check Router Port Forwarding Rules | Ports `1714:1764` NOT forwarded to WAN | [PASS] |

