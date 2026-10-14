# Zorin Connect Android Remote Control Guide

**Classification**: CVX Unified Research Collection  
**Source Deliverable**: `2026-10-13-zorin-connect-android-remote-control-guide`  
**Constituent Files**: 8 documents  
**Generated**: 2026-10-14 03:18:39  

---

## Master Table of Contents

1. [Zorin Connect & Android Remote Control Guide: Executive Overview & System Architecture](#doc-1-00-executive-overview-and-architecture) (`00-executive-overview-and-architecture.md`)
2. [Zorin Connect: Beginner Setup, Device Pairing & Firewall Configuration](#doc-2-01-beginner-setup-pairing-and-firewall) (`01-beginner-setup-pairing-and-firewall.md`)
3. [Zorin Connect: Core Remote Control Features & Interactive Operation](#doc-3-02-core-remote-control-features) (`02-core-remote-control-features.md`)
4. [Zorin Connect: Intermediate Custom Commands & Desktop Automation](#doc-4-03-intermediate-custom-commands-and-desktop-automation) (`03-intermediate-custom-commands-and-desktop-automation.md`)
5. [Zorin Connect: Advanced Wayland Architecture, D-Bus Automation & Global WAN Control](#doc-5-04-advanced-wayland-dbus-and-global-remote-control) (`04-advanced-wayland-dbus-and-global-remote-control.md`)
6. [Zorin Connect: Troubleshooting Matrix & Operational Runbook](#doc-6-05-troubleshooting-matrix-and-operational-runbook) (`05-troubleshooting-matrix-and-operational-runbook.md`)
7. [Zorin Connect: Security Hardening & Home Network Defense Guide](#doc-7-06-security-hardening-and-home-network-defense) (`06-security-hardening-and-home-network-defense.md`)
8. [Zorin Connect: Complete User Guide & Remote Control Manual for Zorin OS 18.1](#doc-8-zorin-connect-complete-user-guide) (`zorin-connect-complete-user-guide.md`)


---

<a id="doc-1-00-executive-overview-and-architecture"></a>
<!-- ====================================================================== -->
<!-- FILE: 00-executive-overview-and-architecture.md (Sequence: 01 of 08) -->
<!-- ====================================================================== -->

# Zorin Connect & Android Remote Control Guide: Executive Overview & System Architecture
**Target Environment:** Zorin OS 18.1 (GNOME 46+ / Wayland & X11) · Zorin OS Lite (XFCE / X11)  
**Mobile Client:** Zorin Connect Android App (`com.zorin.connect`) / KDE Connect (`org.kde.kdeconnect_tp`)  
**Core Technologies:** KDE Connect Protocol · GSConnect (GJS/D-Bus) · TLS 1.3 / RSA Encryption · UFW / Gufw  
**Document Series:** Deliverable 00 of 05  
**Current Date:** 2026-10-13  

---

## 1. Executive Summary

**Zorin Connect** is the native device integration and remote-control bridge built into Zorin OS. It establishes an encrypted, low-latency communication channel between your Linux desktop and your Android smartphone or tablet over local networks (or encrypted mesh VPNs).

Rather than requiring proprietary cloud relays, subscription services, or external servers, Zorin Connect is **100% open-source, peer-to-peer, and local-first**. Once paired, your mobile device transforms into an interactive peripheral and command console capable of:
* **Interactive Desktop Navigation:** Emulating a multi-touch trackpad, physical mouse clicks, drag-and-drop actions, and hardware keyboard text input.
* **Hardware Presentation Remote:** Controlling slide presentations in LibreOffice Impress, Google Slides, or PDF viewers, complete with a gyroscopic "air laser pointer" that tracks physical hand motion in real time.
* **Unified Multimedia Hub:** Remotely controlling audio and video playback across media engines (Spotify, VLC, MPV, YouTube in web browsers) using the Linux MPRIS2 D-Bus specification, with automated media pausing during incoming phone calls.
* **Remote Shell Execution:** Triggering custom Linux terminal commands, session state transitions (lock, suspend, reboot, power off), and automation scripts with single-tap quick buttons on Android.
* **Bidirectional File & Clipboard Fabric:** Transferring gigabyte-sized files at raw LAN speeds, mounting Android storage directly into the GNOME Nautilus file manager via SFTP, and sharing clipboard data seamlessly.
* **Unified Communications:** Mirroring mobile notifications to the desktop, synchronizing contacts, and allowing users to read and reply to SMS text messages without touching their handset.

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                ZORIN CONNECT SYSTEM ARCHITECTURE                                │
├─────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                 │
│   [ ANDROID MOBILE DEVICE ]                                                                     │
│   App: Zorin Connect (`com.zorin.connect`) / KDE Connect (`org.kde.kdeconnect_tp`)              │
│   Components: Touch Input · Gyroscope Sensor · MPRIS Controller · Notification Listener         │
│         │                                                                                       │
│         │ UDP Port 1714:1764 (Identity Beacons & UDP Discovery Packets)                        │
│         │ TCP Port 1714:1764 (TLS 1.3 Handshake, RSA Signed Framing, Payloads)                 │
│         ▼                                                                                       │
│   ┌─────────────────────────────────────────────────────────────────────────────────────────┐   │
│   │ NETWORK BOUNDARY: Local Wi-Fi Subnet / USB Tethering / Tailscale Mesh VPN               │   │
│   │ UFW Firewall: `allow 1714:1764/udp` and `allow 1714:1764/tcp`                           │   │
│   └─────────────────────────────────────────────────────────────────────────────────────────┘   │
│         │                                                                                       │
│         ▼                                                                                       │
│   [ ZORIN OS 18.1 DESKTOP SUBSYSTEM ]                                                           │
│   ┌─────────────────────────────────────────────────────────────────────────────────────────┐   │
│   │ Zorin OS Core / Pro (GNOME Shell Integration)                                           │   │
│   │ • Daemon: GSConnect GJS Subprocess (`org.gnome.Shell.Extensions.GSConnect`)             │   │
│   │ • Compositor Event Injection: Mutter / Clutter Event Pipeline & `libei` (Wayland)       │   │
│   │ • Media Gateway: D-Bus MPRIS2 (`org.mpris.MediaPlayer2.*`)                              │   │
│   │ • Shell Execution: Native GSubprocess / `loginctl` / `systemctl` / `pactl`              │   │
│   │ • Storage Engine: GVFS SFTP Backend (`sftp://<android-ip>:1739`)                       │   │
│   └─────────────────────────────────────────────────────────────────────────────────────────┘   │
│   ┌─────────────────────────────────────────────────────────────────────────────────────────┐   │
│   │ Zorin OS Lite (XFCE Integration)                                                        │   │
│   │ • Daemon: Native KDE Connect Daemon (`kdeconnectd`) + Indicator-KDEConnect              │   │
│   │ • Compositor Event Injection: X11 / XTest Extension (`xdotool` Compatible)              │   │
│   └─────────────────────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. The Underlying Protocol & Subsystems

To understand how Zorin Connect reliably executes commands, moves mouse pointers, and passes notifications without lag, it is essential to inspect the three underlying layers that compose the stack:

### 2.1 The KDE Connect Wire Protocol
At the protocol level, Zorin Connect is built upon the **KDE Connect wire protocol**. All communication adheres to lightweight JSON payloads framed over TLS-encrypted sockets:
1. **Discovery Phase (UDP):** Devices periodically broadcast or listen for UDP packets on ports `1714` through `1764`. An identity packet contains the device UUID, human-readable name, incoming TCP port, and protocol version.
2. **Connection & Handshake Phase (TCP):** Upon discovering an identity beacon, the devices initiate a TCP socket connection across the matching port in the `1714:1764` range.
3. **Cryptographic Identity Verification:** Each device maintains a local RSA private key and self-signed X.509 certificate. The connection is upgraded to TLS 1.3. During the initial pairing handshake, each endpoint presents its certificate fingerprint; pairing is only established when the user confirms the mutual pairing request on both screens.
4. **Packet Multiplexing:** All remote commands, keystrokes, mouse pointer movements, and clipboard transfers are multiplexed as structured JSON packets (`kdeconnect.mousepad.request`, `kdeconnect.runcommand.request`, `kdeconnect.mpris.request`, `kdeconnect.telephony.request`).

### 2.2 Desktop Implementation: GSConnect vs KDE Connect
Zorin OS is distributed in distinct desktop editions, which utilize optimized implementations of the KDE Connect protocol:

| Architectural Metric | Zorin OS Core / Pro (GNOME Shell) | Zorin OS Lite (XFCE Desktop) |
|:---|:---|:---|
| **Underlying Subsystem** | GSConnect (`gnome-shell-extension-zorin-connect`) | Native KDE Connect (`kdeconnect`) |
| **Language & Runtime** | JavaScript / GObject Introspection (GJS) | C++ / Qt 6 / KDE Frameworks |
| **Desktop Integration** | Native GNOME Shell top panel menu & Settings | System tray indicator (`indicator-kdeconnect`) |
| **Display Server** | Wayland (Default) or X11 | X11 (Default) |
| **Input Injection Layer** | GNOME Mutter / Clutter Event Synth & `libei` | X11 XTest extension |
| **D-Bus Bus Name** | `org.gnome.Shell.Extensions.GSConnect` | `org.kde.kdeconnect` |
| **Config Directory** | `~/.config/gsconnect/` | `~/.config/kdeconnect/` |

---

## 3. Network Architecture & Port Taxonomy

Zorin Connect operates primarily across the local network boundary. Because modern Linux distributions strictly guard ports via Uncomplicated Firewall (UFW), network routing and port access are the primary operational boundaries.

### 3.1 Network Port Mapping

| Port Range | Protocol | Direction | Subsystem | Functional Purpose |
|:---|:---:|:---:|:---|:---|
| **1714–1764** | UDP | Bidirectional | Device Discovery | Broadcast and reception of identity discovery beacons (`kdeconnect.identity`) |
| **1714–1764** | TCP | Bidirectional | Core Payload & TLS | Encrypted connection, certificate exchange, remote control, and commands |
| **1739–1740** | TCP | Inbound to Android | SFTP Storage Engine | GVFS / SSHFS file browsing engine for remote storage traversal |

> [!IMPORTANT]
> Both UDP and TCP traffic must be unrestricted across the **entire port range 1714 to 1764**. If only port 1714 or 1716 is opened, initial discovery may succeed while file transfers or secondary command channels fail because the protocol dynamically negotiates ports within the 50-port bracket.

### 3.2 Connectivity Topologies

Zorin Connect supports four distinct network topologies depending on physical location and security requirements:

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   CONNECTIVITY TOPOLOGY MATRIX                                  │
├─────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                 │
│  [ TOPOLOGY 1: HOME WI-FI LAN ]                                                                 │
│  Android Phone ──(Wi-Fi 2.4/5/6 GHz)──► Router / Access Point ◄──(Wi-Fi / Ethernet)── Zorin PC  │
│  • Latency: < 2 ms · Bandwidth: Full LAN (300–1000 Mbps) · Setup: Automatic Discovery           │
│                                                                                                 │
│  [ TOPOLOGY 2: FIELD AD-HOC MOBILE HOTSPOT ]                                                   │
│  Android Phone (AP Hotspot Enabled) ◄──Direct Wi-Fi Link (No Router)──► Zorin OS Laptop         │
│  • Latency: < 1 ms · Bandwidth: Direct 802.11 Link · Setup: Direct local subnet                │
│                                                                                                 │
│  [ TOPOLOGY 3: GLOBAL MESH VPN (TAILSCALE / WIREGUARD) ]                                       │
│  Android Phone (5G / Hotel Wi-Fi) ──► Tailscale Mesh (100.x.y.z) ──► Zorin PC (Home Fiber)     │
│  • Latency: 20–60 ms · Bandwidth: WAN Limited · Setup: Pair by IP (Global Remote Control)       │
│                                                                                                 │
│  [ TOPOLOGY 4: USB REVERSE TETHERING ]                                                         │
│  Android Phone ◄──Direct USB-C Cable (Tethering / RNDIS Mode)──► Zorin PC                      │
│  • Latency: < 0.2 ms · Zero RF Interference · Secure air-gapped operations                      │
│                                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Hardware & Operating System Compatibility Matrix

Zorin Connect is engineered to function across diverse hardware architectures and OS revisions.

| Layer | Component | Minimum Version | Recommended / Tested Standard | Notes |
|:---|:---|:---|:---|:---|
| **Host OS** | Zorin OS | Zorin OS 16.x Core/Pro | **Zorin OS 18.1 / 17.2 Core & Pro** | GNOME 46+ shell integration; full Wayland input synthesis |
| **Host Display** | Display Server | X11 | **Wayland (Mutter)** | Supported natively; Wayland security sandbox handled via Mutter GJS |
| **Mobile OS** | Android OS | Android 5.0 (Lollipop) | **Android 11, 12, 13, 14, 15, 16** | Android 10+ requires manual clipboard send; Android 13+ requires notification permissions |
| **Mobile App** | Client APK | Zorin Connect v1.0+ | **Zorin Connect v1.2+ / KDE Connect v1.32+** | Available on Google Play Store, F-Droid, and GitHub |
| **Networking** | Wi-Fi / Ethernet | 802.11n (2.4 GHz) | **Wi-Fi 6 / 6E / 7 or Gigabit Ethernet** | Subnet isolation (AP Isolation) on guest networks must be disabled |
| **Host Firewall** | Netfilter Daemon | UFW 0.36+ | **UFW / Gufw configured for 1714:1764** | Default profile allows outgoing; incoming blocked until rule added |

---

## 5. Security & Cryptographic Guarantees

Security is a primary design pillar of the Zorin Connect protocol. Unlike commercial remote desktop tools that tunnel keystrokes and clipboard data through proprietary external servers, Zorin Connect enforces strict local security policies:

1. **Zero Cloud Infrastructure:** No credentials, keystrokes, remote commands, photos, or notifications are ever routed through Zorin, KDE, Google, or third-party servers.
2. **Mutual RSA Certificate Authentication:**
   * During first-time pairing, both devices generate 2048-bit (or 4096-bit) RSA key pairs and self-signed X.509 certificates.
   * Device identities are bound to the certificate public keys.
   * Even on an open or public Wi-Fi network, attackers cannot forge commands or eavesdrop on packet streams without possessing the private key matching the paired certificate.
3. **Explicit User Consent Gating:** A pairing request received by Zorin OS cannot auto-pair. It triggers an interactive modal dialog displaying the device's name and cryptographic fingerprint. Both endpoints must acknowledge the pair request before any control packets are accepted.
4. **Granular Permission Plugins:** Every subsystem operates as an independent plugin:
   * If you wish to use remote trackpad control and presentation clicks, but do *not* want clipboard synchronization or notification mirroring, individual plugins can be toggled off directly inside the settings UI.
5. **Execution Sandboxing of Remote Commands:**
   * Remote commands triggered from your Android phone execute strictly under the permissions of your logged-in desktop user account.
   * Commands do not execute with `sudo` or root privileges unless explicitly configured in `/etc/sudoers` (which is neither required nor recommended for standard remote control).


---

<a id="doc-2-01-beginner-setup-pairing-and-firewall"></a>
<!-- ====================================================================== -->
<!-- FILE: 01-beginner-setup-pairing-and-firewall.md (Sequence: 02 of 08) -->
<!-- ====================================================================== -->

# Zorin Connect: Beginner Setup, Device Pairing & Firewall Configuration
**Target Environment:** Zorin OS 18.1 (Core / Pro / Lite) & Android (10 through 16+)  
**Document Series:** Deliverable 01 of 05  
**Primary References:** Zorin Help (`help.zorin.com`) · Zorin Forum Tutorial (`forum.zorin.com/t/zorin-connect-the-easy-method/23902`) · GitHub (`github.com/ZorinOS/zorin-connect-android`)  
**Current Date:** 2026-10-13  

---

## 1. Prerequisites & Application Acquisition

Before pairing your Android device with Zorin OS 18.1, ensure you have acquired the correct software components for both host and mobile devices.

### 1.1 Desktop Installation Check

* **Zorin OS Core & Zorin OS Pro:**  
  Zorin Connect is **pre-installed by default**. No manual package installation is required. You can confirm its presence by opening **Settings → Zorin Connect** or checking the system tray indicator in the top-right panel.
  
  ```bash
  # Verification command in Zorin OS Core / Pro:
  gnome-extensions list | grep -E "zorin-connect|gsconnect"
  # Output should return: zorin-connect@zorinos.com (or gsconnect@andyholmes.github.io)
  ```

* **Zorin OS Lite (XFCE Desktop):**  
  Because Zorin OS Lite utilizes the lightweight XFCE desktop environment rather than GNOME Shell, it runs the native KDE Connect Qt engine and system tray applet:
  
  ```bash
  # Install KDE Connect and its indicator on Zorin OS Lite:
  sudo apt update
  sudo apt install kdeconnect indicator-kdeconnect -y
  ```

### 1.2 Android Application Installation Sources

The mobile client is available across multiple trusted repositories:

| Distribution Channel | Package Identifier | Recommended For | Link / Source |
|:---|:---|:---|:---|
| **Google Play Store** | `com.zorin.connect` | Standard Android smartphones & tablets | [Zorin Connect on Google Play](https://play.google.com/store/apps/details?id=com.zorin.connect) |
| **GitHub Releases** | `com.zorin.connect` | Direct APK sideloading & offline installations | [ZorinOS/zorin-connect-android](https://github.com/ZorinOS/zorin-connect-android/releases) |
| **F-Droid Repository** | `org.kde.kdeconnect_tp` | De-Googled devices, GrapheneOS, CalyxOS, Fairphone | [KDE Connect on F-Droid](https://f-droid.org/en/packages/org.kde.kdeconnect_tp/) |

> [!NOTE]
> As verified in community testing, the **KDE Connect** Android app (`org.kde.kdeconnect_tp`) from F-Droid and the official **Zorin Connect** Android app (`com.zorin.connect`) from Google Play share the identical underlying wire protocol. If you utilize an un-Googled device (such as a Fairphone or custom ROM), the F-Droid KDE Connect app connects and controls Zorin OS 18.1 with 100% feature parity.

---

## 2. Network Prerequisites & Pre-Flight Checks

Zorin Connect requires that both your PC and your smartphone establish direct peer-to-peer network visibility. Complete these pre-flight checks before attempting discovery:

### 2.1 Same Local Subnet Verification
Ensure your computer and Android phone are connected to the same local Wi-Fi router.

To find your Zorin OS IP address, run in terminal:
```bash
ip -br addr show
# Look for your active Wi-Fi interface (wlan0 / wlp3s0) or Ethernet (eth0 / enp4s0)
# Example IP: 192.168.1.145/24
```

On your Android phone:
1. Open **Settings → Network & internet → Wi-Fi / Internet**.
2. Tap your connected Wi-Fi network and scroll down to inspect the **IP address** (e.g., `192.168.1.82`).
3. Confirm that both devices share the identical network prefix (e.g., `192.168.1.xxx`).

### 2.2 Common Router Pitfalls

* **AP Isolation / Client Isolation:** In router administrative settings, ensure that "AP Isolation" (also called "Client Isolation" or "Station Isolation") is **Disabled**. When enabled, the router prevents Wi-Fi devices from communicating with one another.
* **Dual-Band Band Steering (2.4 GHz vs 5 GHz):** Some home routers isolate the 2.4 GHz radio from the 5 GHz radio. If your PC is on 5 GHz and your phone is on 2.4 GHz and discovery fails, connect both devices to the same frequency band.
* **Guest Networks:** Do not connect either device to a "Guest Wi-Fi" network, as guest networks automatically isolate all connected clients from local intranet traffic.
* **Third-Party VPN Interference:** If either your Zorin PC or your phone has an active commercial VPN client (e.g., NordVPN, ExpressVPN, ProtonVPN), disable it during pairing or enable **"Allow Local Network Sharing / LAN Bypass"** in the VPN settings.

---

## 3. Firewall Configuration: The "Easy Method" & UFW Setup

The single most frequent reason devices fail to discover each other is the **Uncomplicated Firewall (UFW)** on Linux blocking incoming UDP discovery beacons and TCP connection attempts.

As documented in the authoritative Zorin community guide (*"Zorin Connect the easy method"* by `swarfendor437` on the Zorin Forum), you must open the required communication ports. You can perform this either graphically using `gufw` or instantly via the terminal.

### 3.1 Method A: Graphical Firewall Configuration (`gufw`)

If you prefer a graphical interface, install and launch the firewall GUI:

1. Open the terminal and launch the graphical firewall tool:
   ```bash
   gufw
   ```
2. Enter your administrative password when prompted to obtain root privileges.
3. If the firewall **Status** toggle is switch to "Off", toggle it to **"On"**. When turned on, the default profile blocks all incoming unsolicited traffic.
4. Click on the **Rules** tab at the top, then click the **`+`** (Add Rule) icon at the bottom-left corner.
5. In the rule creation window, you have three alternative approaches:

#### Approach 1: Pre-Configured Application Rule (Simplest)
* Click the **Preconfigured** tab.
* In the **Application** dropdown, scroll down or type **Zorin Connect** (or **KDE Connect**).
* Set Policy to **Allow**, Direction to **In**, and click **Add**.

#### Approach 2: Simple Port Rule
* Click the **Simple** tab.
* **Name:** `Zorin Connect`
* **Policy:** `Allow`
* **Direction:** `In`
* **Protocol:** `Both` (TCP and UDP)
* **Port:** `1714:1764`
* Click **Add**.

#### Approach 3: Advanced IP-Restricted Rule (Highest Security)
* Click the **Advanced** tab if you wish to restrict access exclusively to your phone's local IP address:
* **Name:** `Zorin Connect Phone`
* **Policy:** `Allow`
* **Direction:** `In`
* **Interface:** All Interfaces
* **Protocol:** `Both`
* **From:** `<Your Android Phone's Local IP>` (e.g., `192.168.1.82`) · Port: `1714:1764`
* **To:** `<Your Zorin PC's Local IP>` (e.g., `192.168.1.145`) · Port: `1714:1764`
* Click **Add**.

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                               GUFW FIREWALL CONFIGURATION MODAL                                 │
├─────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                 │
│   Status: [ ON ]    Incoming: [ Reject / Deny ]    Outgoing: [ Allow ]                          │
│                                                                                                 │
│   ┌─────────────────────────────────────────────────────────────────────────────────────────┐   │
│   │ Rules Tab: [+] Add Rule                                                                 │   │
│   ├─────────────────────────────────────────────────────────────────────────────────────────┤   │
│   │ Tab: [ Preconfigured ] | [ Simple ] | [ Advanced ]                                      │   │
│   │                                                                                         │   │
│   │ Name:        Zorin Connect                                                              │   │
│   │ Policy:      ALLOW                                                                      │   │
│   │ Direction:   IN                                                                         │   │
│   │ Protocol:    BOTH (TCP/UDP)                                                             │   │
│   │ Port Range:  1714:1764                                                                  │   │
│   │                                                                                         │   │
│   │ [ Cancel ]                                                            [ Add Rule ]      │   │
│   └─────────────────────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Method B: Rapid Terminal Command Configuration (Recommended)

If you prefer the command line, you can execute these commands in under 10 seconds:

```bash
# 1. Allow the full KDE Connect / Zorin Connect port range for UDP (Discovery)
sudo ufw allow 1714:1764/udp comment 'Zorin Connect Discovery'

# 2. Allow the full port range for TCP (TLS Payloads & Commands)
sudo ufw allow 1714:1764/tcp comment 'Zorin Connect Control'

# 3. Reload UFW to apply the new active rules immediately
sudo ufw reload

# 4. Verify that the rules are active and properly formatted
sudo ufw status verbose
```

Expected terminal verification output:
```text
Status: active
Logging: on (low)
Default: deny (incoming), allow (outgoing), disabled (routed)
New profiles: skip

To                         Action      From
--                         ------      ----
1714:1764/udp              ALLOW IN    Anywhere                   # Zorin Connect Discovery
1714:1764/tcp              ALLOW IN    Anywhere                   # Zorin Connect Control
1714:1764/udp (v6)         ALLOW IN    Anywhere (v6)              # Zorin Connect Discovery
1714:1764/tcp (v6)         ALLOW IN    Anywhere (v6)              # Zorin Connect Control
```

---

## 4. Step-by-Step Device Pairing Walkthrough

Once the network and firewall rules are prepared, pairing takes less than one minute.

### Step 4.1: Launch Both Clients
1. **On Zorin OS 18.1:**  
   Click the **Zorin Start Menu → Settings → Zorin Connect** (or click the quick menu in the top panel and select **Zorin Connect Settings**). Ensure the toggle is switched to **On**.
2. **On your Android Phone:**  
   Launch the **Zorin Connect** (or KDE Connect) application. Pull down on the screen to trigger a fresh broadcast scan.

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   STEP-BY-STEP PAIRING FLOW                                     │
├─────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                 │
│   [ ANDROID SCREEN ]                                        [ ZORIN OS 18.1 DESKTOP ]           │
│   Discovered Devices:                                       Zorin Connect Settings:             │
│   ┌───────────────────────────────┐                         ┌─────────────────────────────────┐ │
│   │ 💻 zorin-workstation          │                         │ Discovered Devices:             │ │
│   │   Status: Not paired          │                         │ • Pixel 9 Pro (Available)       │ │
│   └───────────────────────────────┘                         └─────────────────────────────────┘ │
│                 │                                                             │                 │
│                 ▼                                                             │                 │
│   Tap "Request Pairing" ──────────────────────────────────────────────────────┘                 │
│                 │                                                                               │
│                 ▼                                                                               │
│   ┌─────────────────────────────────────────────────────────────────────────────────────────┐   │
│   │ MUTUAL CRYPTOGRAPHIC FINGERPRINT VERIFICATION                                           │   │
│   │ Certificate Fingerprint: 4A:9F:E2:B1:88:03:CC:41:90:1D:6B:7E:55:01:FA:3C               │   │
│   └─────────────────────────────────────────────────────────────────────────────────────────┘   │
│                 │                                                             │                 │
│                 ▼                                                             ▼                 │
│         [ Accept on Phone ]                                          [ Accept on Desktop ]      │
│                 │                                                             │                 │
│                 └──────────────────────────────┬──────────────────────────────┘                 │
│                                                ▼                                                │
│                                 [ STATUS: PAIRED & ENCRYPTED ]                                  │
│                                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Step 4.2: Request Pairing
1. On your phone screen under **Discovered Devices**, tap your computer's name (e.g., `zorin-desktop`).
2. Tap the blue **Request Pairing** button.
3. Simultaneously, a desktop notification dialog will appear in the top center of your Zorin OS desktop:
   > *"Pairing request from [Phone Name]. Do you want to accept?"*
4. Click **Accept** on Zorin OS, and tap **Accept** on your Android phone.

### Step 4.3: Verify Connection State
Once paired, the device card on your Android phone turns vibrant blue with a connected badge, and the desktop Zorin Connect menu shows your phone’s name along with its current battery level and signal status.

---

## 5. Critical Android Permissions Checklist

For remote control, trackpad navigation, presentation clicking, and multimedia handling to work without system interruptions, specific Android runtime permissions must be granted:

| Permission Name | Operational Purpose | How to Enable on Android | Mandatory / Optional |
|:---|:---|:---|:---:|
| **Accessibility Service** | Enables intercepting hardware volume keys for presentation slide advancement | Android Settings → Accessibility → Installed Apps → Zorin Connect → Enable | **Mandatory for Slide Remote** |
| **Ignore Battery Optimization** | Prevents Android Doze mode from killing the background daemon when screen sleeps | App Info → Battery → Set to **Unrestricted** | **Mandatory for Persistent Link** |
| **Notification Listener** | Allows mirroring mobile notifications and inline text messaging | Android Settings → Apps → Special app access → Notification access → Allow | Recommended |
| **Contacts & SMS Access** | Resolves sender phone numbers to address book contacts; allows sending SMS | App Info → Permissions → Contacts & SMS → Allow | Optional (Messaging only) |
| **Storage / Media Access** | Enables bidirectional file transfers and camera roll sync | App Info → Permissions → Photos & Videos / Files → Allow All | Recommended |
| **Location Access** | Required by Android 10+ to read local Wi-Fi SSID for network discovery | App Info → Permissions → Location → Allow while using app | Mandatory for Wi-Fi Discovery |

> [!CAUTION]
> **The Android "Doze Mode" Trap:** By default, Android aggressive battery managers put background network apps into deep sleep within 5 to 10 minutes after the screen locks. If your remote trackpad or media controls suddenly stop responding when your phone sits idle, navigate to **Settings → Apps → Zorin Connect → Battery** and change the setting from *Optimized* to **Unrestricted**.


---

<a id="doc-3-02-core-remote-control-features"></a>
<!-- ====================================================================== -->
<!-- FILE: 02-core-remote-control-features.md (Sequence: 03 of 08) -->
<!-- ====================================================================== -->

# Zorin Connect: Core Remote Control Features & Interactive Operation
**Target Environment:** Zorin OS 18.1 & Android Smartphone / Tablet  
**Document Series:** Deliverable 02 of 05  
**Primary Features:** Remote Trackpad · Virtual Keyboard · MPRIS Media Hub · Presentation Air Pointer · SFTP File Sharing · Shared Clipboard  
**Current Date:** 2026-10-13  

---

## 1. Remote Input: Touchpad, Gestures & Pointer Control

The **Remote Input** subsystem transforms your Android smartphone screen into a responsive, high-precision wireless trackpad and mouse peripheral for Zorin OS 18.1.

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 REMOTE TRACKPAD GESTURE MAPPING                                 │
├─────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                 │
│   ┌─────────────────────────────────────────────────────────────────────────────────────────┐   │
│   │                                                                                         │   │
│   │   [ SINGLE-FINGER DRAG ]         [ SINGLE TAP ]             [ TWO-FINGER TAP ]          │   │
│   │   Smooth Cursor Translation      Left Click (Primary)       Right Click (Context Menu)  │   │
│   │                                                                                         │   │
│   │   [ TWO-FINGER DRAG ]            [ THREE-FINGER TAP ]       [ TAP-HOLD-DRAG ]           │   │
│   │   Vertical/Horizontal Scroll     Middle Click / Close Tab   Window Drag & Select        │   │
│   │                                                                                         │   │
│   │   [ TOP TOOLBAR: KEYBOARD ]      [ TOP TOOLBAR: MODIFIERS ] [ SENSITIVITY SLIDER ]      │   │
│   │   Open Virtual Soft Keyboard     Ctrl · Alt · Super · Shift Pointer Speed Tuning        │   │
│   │                                                                                         │   │
│   └─────────────────────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 1.1 Touch Gesture Reference Matrix

| Gesture | Physical Action | Desktop Action Triggered | Typical Use Case |
|:---|:---|:---|:---|
| **Cursor Move** | Slide single finger across phone glass | Translates mouse pointer across desktop displays | Precise cursor repositioning |
| **Left Click** | Quick single tap with one finger | Primary mouse click (`BTN_LEFT`) | Selecting files, clicking UI links, focusing windows |
| **Right Click** | Quick tap with two fingers simultaneously | Secondary context menu click (`BTN_RIGHT`) | Spawning desktop context menus and file options |
| **Middle Click** | Quick tap with three fingers simultaneously | Middle mouse click (`BTN_MIDDLE`) | Opening links in new browser tabs; closing tabs |
| **Two-Finger Scroll** | Drag two fingers vertically or horizontally | Emulates mouse scroll wheel (`REL_WHEEL`) | Scrolling web pages, PDF documents, terminal history |
| **Drag and Drop** | Double-tap and hold on the second tap, then drag | Click-hold mouse drag | Dragging desktop windows, moving files between folders |

### 1.2 Sensitivity & Acceleration Calibration
If the cursor moves too fast or feels sluggish on high-resolution displays (e.g., 4K monitors):
1. In the Zorin Connect Android app, tap the **Remote Input** card.
2. Tap the **Settings (Gear icon)** in the top-right corner.
3. Adjust the **Pointer Sensitivity** slider (scales the linear velocity multiplier).
4. Toggle **Pointer Acceleration** (enables non-linear velocity scaling for rapid flick movements across multiple monitors).

---

## 2. Remote Keyboard & Shortcut Navigation

Tapping the keyboard icon at the top of the Remote Input screen surfaces a dual-tiered input interface: your phone's native virtual keyboard combined with a Linux-specific hardware modifier drawer.

### 2.1 Modifier & Special Key Bar
Above the standard alphanumeric keyboard, Zorin Connect displays persistent modifier keys:

| Key Token | Visual Icon | Desktop Signal | Common Remote Shortcut Combinations |
|:---|:---:|:---|:---|
| **Super / Meta** | `❖` or `Super` | `KEY_LEFTMETA` (Windows Key) | `Super` (Open App Grid) · `Super + D` (Show Desktop) |
| **Control** | `Ctrl` | `KEY_LEFTCTRL` | `Ctrl + Alt + T` (Spawn Terminal) · `Ctrl + C` / `Ctrl + V` |
| **Alternate** | `Alt` | `KEY_LEFTALT` | `Alt + Tab` (Window Switcher) · `Alt + F4` (Close Active Window) |
| **Shift** | `Shift` | `KEY_LEFTSHIFT` | Used with modifiers for extended desktop shortcuts |
| **Escape** | `Esc` | `KEY_ESC` | Exits full-screen video, cancels modals, exits Vim command mode |
| **Tab** | `Tab` | `KEY_TAB` | Form field navigation and terminal tab-completion |
| **Arrow Pad** | `▲ ▼ ◄ ►` | `KEY_UP/DOWN/LEFT/RIGHT` | Document navigation, terminal command history replay |

### 2.2 Text Typing Protocol
When you type full sentences or dictate text using voice input on Android (e.g., Google Voice Typing), Zorin Connect streams the Unicode keystrokes in real time into whichever application currently holds desktop focus on Zorin OS (e.g., LibreOffice Writer, Visual Studio Code, or a terminal prompt).

---

## 3. Multimedia Remote Control (MPRIS2 Architecture)

Zorin Connect integrates directly with the **Media Player Remote Interfacing Specification (MPRIS2)** over the Linux D-Bus session bus. This provides universal control over any compliant desktop media player without requiring per-app configuration.

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   MPRIS2 MEDIA CONTROL ARCHITECTURE                             │
├─────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                 │
│   [ ANDROID MOBILE APP ]                                                                        │
│   • Play/Pause · Prev/Next · Seek Bar · Volume Slider · Album Cover Display                     │
│         │                                                                                       │
│         │ JSON Payload: `kdeconnect.mpris.request`                                              │
│         ▼                                                                                       │
│   [ ZORIN CONNECT DAEMON ]                                                                      │
│         │                                                                                       │
│         │ Session D-Bus Call: `org.mpris.MediaPlayer2.*`                                        │
│         ▼                                                                                       │
│   ┌─────────────────────────────────────────────────────────────────────────────────────────┐   │
│   │ ACTIVE LINUX MEDIA PLAYERS                                                              │   │
│   │ • Spotify Desktop Client (`org.mpris.MediaPlayer2.spotify`)                             │   │
│   │ • VLC Media Player (`org.mpris.MediaPlayer2.vlc`)                                       │   │
│   │ • Firefox / Chrome YouTube Tabs (`org.mpris.MediaPlayer2.firefox.instance*`)            │   │
│   │ • Celluloid / MPV Player (`org.mpris.MediaPlayer2.celluloid`)                           │   │
│   │ • Rhythmbox / Amberol (`org.mpris.MediaPlayer2.rhythmbox`)                              │   │
│   └─────────────────────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 3.1 Media Control Capabilities
When media is playing on Zorin OS, the **Multimedia Control** tab on Android surfaces:
* **Track Metadata:** Song title, artist name, and album title displayed in real time.
* **Album Artwork:** Embedded album art fetched and rendered directly on your phone screen.
* **Timeline Scrubbing:** Interactive seek slider to scrub forward or backward through tracks or video streams.
* **Playback Controls:** Play, Pause, Previous Track, and Next Track buttons.
* **Master Volume Slider:** Adjusts system audio output level on Zorin OS directly from the phone.
* **Multi-Player Selector:** If both Spotify and a YouTube video in Firefox are open, a dropdown switcher lets you select which player to command.

### 3.2 Automated Telephony Muting & Pausing
Under **Zorin Connect Settings → Telephony / Calls**, you can configure automatic behaviors for incoming cellular phone calls:
* **Mute System Audio:** Automatically mutes all PC audio the moment an incoming call rings on your phone.
* **Pause Playback:** Sends an MPRIS pause command to active media players during a call, and automatically resumes playback when the call disconnects.

---

## 4. Presentation Remote & Gyroscopic "Air Laser Pointer"

The **Presentation Remote** feature turns your Android smartphone into an executive slide clicker and wireless pointer for LibreOffice Impress, Google Slides, WPS Office, or PDF presentations.

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 PRESENTATION REMOTE INTERFACE                                   │
├─────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                 │
│   ┌─────────────────────────────────────────────────────────────────────────────────────────┐   │
│   │                                                                                         │   │
│   │   ┌───────────────────────────┐         ┌───────────────────────────┐                   │   │
│   │   │                           │         │                           │                   │   │
│   │   │     ◄ PREVIOUS SLIDE      │         │       NEXT SLIDE ►        │                   │   │
│   │   │     (Hardware Vol Down)   │         │     (Hardware Vol Up)     │                   │   │
│   │   │                           │         │                           │                   │   │
│   │   └───────────────────────────┘         └───────────────────────────┘                   │   │
│   │                                                                                         │   │
│   │   ┌─────────────────────────────────────────────────────────────────┐                   │   │
│   │   │                                                                 │                   │   │
│   │   │               🔴 HOLD FOR GYROSCOPIC LASER POINTER               │                   │   │
│   │   │               (Wave phone in 3D air to track pointer)            │                   │   │
│   │   │                                                                 │                   │   │
│   │   └─────────────────────────────────────────────────────────────────┘                   │   │
│   │                                                                                         │   │
│   └─────────────────────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 4.1 Slide Navigation & Hardware Buttons
* **On-Screen Touch Buttons:** Two massive touch targets labeled **Previous** and **Next** allow advancing slides without looking closely at the screen.
* **Physical Hardware Volume Buttons:** When the Presentation Remote is active and the Accessibility Service permission is granted on Android, pressing your phone's physical **Volume Up** button advances to the next slide, while **Volume Down** returns to the previous slide. This allows presenting from anywhere in the auditorium with your phone resting in your hand or pocket.

### 4.2 The Gyroscopic "Laser Pointer" Mode
Unlike standard touchpads, Zorin Connect includes a built-in virtual laser pointer powered by your smartphone's internal 6-axis Inertial Measurement Unit (IMU):
1. On the Presentation Remote screen, locate the **Pointer** button.
2. **Press and hold** your thumb down on the Pointer button.
3. While holding the button, wave or aim your phone in the air toward the presentation screen.
4. The smartphone’s internal gyroscopes detect angular velocity (pitch and yaw), translating your physical wrist gestures into relative on-screen cursor movements in real time.
5. In LibreOffice Impress or GNOME presentation tools, this moves the pointer or lights up a high-visibility cursor dot.
6. **Releasing your thumb** immediately locks the pointer position, preventing calibration drift when you lower your arm.

---

## 5. Bidirectional File Sharing & SFTP Filesystem Browsing

Zorin Connect provides high-speed, local LAN file transfers without requiring USB cables or cloud storage uploads.

### 5.1 Sending Files from Android to Zorin OS
1. In any Android app (Google Photos, Gallery, Files, YouTube, Chrome):
2. Select one or more photos, documents, or videos and tap the system **Share** button.
3. Select **Zorin Connect** from the share sheet.
4. Tap your computer’s name (e.g., `zorin-desktop`).
5. The files are transferred over encrypted local TCP at maximum Wi-Fi bandwidth and saved instantly to your computer's `~/Downloads` folder. A desktop notification notifies you upon completion with an **Open Folder** button.

### 5.2 Sending Files from Zorin OS to Android
1. Open the **Files (Nautilus)** file manager on Zorin OS 18.1.
2. Right-click any file or folder.
3. Select **"Send to [Phone Name] via Zorin Connect"**.
4. The file is streamed to your phone's internal storage (typically stored in `/sdcard/Download/`).

### 5.3 Browsing Android Storage via Desktop SFTP
Zorin Connect includes an integrated SFTP storage server:
1. Click the Zorin Connect indicator in your desktop top bar.
2. Click your phone's name and select **"Browse Device"**.
3. Zorin OS mounts your smartphone's storage directly into Nautilus as a native network drive (`sftp://<phone-ip>:1739/`).
4. You can drag, drop, rename, delete, and copy files directly between Linux and Android just as if the phone were a plugged-in USB thumb drive.

---

## 6. Shared Clipboard Fabric

Zorin Connect maintains an automated, bidirectional clipboard synchronization channel between desktop and mobile.

### 6.1 Desktop to Mobile Flow
* Highlight text on Zorin OS and press `Ctrl + C`.
* The text string is encrypted and sent to your phone.
* On Android, open any messaging app or document, tap and hold an input field, and select **Paste**. The text copied from Linux pastes immediately.

### 6.2 Mobile to Desktop Flow & Android 10+ Restrictions
* In older Android versions, copying text on your phone automatically mirrored to your desktop clipboard.
* **Android 10, 11, 12, 13, 14, 15, and 16 Security Restrictions:** Google introduced security policies preventing background applications from passively reading the Android system clipboard without direct user interaction.
* **How to Send Clipboard on Modern Android:**
  * **Option A (Notification Quick Action):** Swipe down your Android notification shade. The persistent Zorin Connect notification features a dedicated button labeled **"Send Clipboard"**. Tap it to push your current mobile clipboard to Zorin OS.
  * **Option B (Quick Settings Tile):** Edit your Android Quick Settings panel (swipe down twice from top of screen → pencil edit icon) and drag the **"Send Clipboard"** tile into your active tiles. Tapping it pushes copied text to Linux instantly.

---

## 7. Notification Mirroring, SMS Hub & Device Finder

| Feature | Operational Description | User Action Required |
|:---|:---|:---|
| **Notification Mirroring** | Push notifications from Android apps (WhatsApp, Signal, Slack, Gmail) appear as native desktop notifications | Desktop dismiss button syncs back to phone; notifications clear on both devices |
| **Inline SMS Reply** | Reply directly to SMS and messaging apps from desktop notification popups | Click "Reply" in the desktop notification banner, type text, and press Enter |
| **Zorin SMS Messaging App** | Full desktop messaging window listing SMS conversation history | Open "Zorin Connect SMS" from application menu to view and compose text threads |
| **Find My Phone (Ringer)** | Rings your phone at maximum alarm volume even if set to Silent or Do Not Disturb | Select "Ring Phone" from top panel menu; tap "Dismiss" on phone screen to silence |
| **Battery Level Gauge** | Displays phone battery percentage and charging state in desktop menu | Automated; triggers low-battery warning dialog on PC when phone drops below 15% |


---

<a id="doc-4-03-intermediate-custom-commands-and-desktop-automation"></a>
<!-- ====================================================================== -->
<!-- FILE: 03-intermediate-custom-commands-and-desktop-automation.md (Sequence: 04 of 08) -->
<!-- ====================================================================== -->

# Zorin Connect: Intermediate Custom Commands & Desktop Automation
**Target Environment:** Zorin OS 18.1 & Android Smartphone  
**Document Series:** Deliverable 03 of 05  
**Core Subsystems:** Run Command Plugin · GSettings / DConf Registry · Bash Script Automation · Audio / Display / Power APIs  
**Current Date:** 2026-10-13  

---

## 1. The "Run Commands" Subsystem Architecture

The **Run Command** plugin is one of Zorin Connect's most powerful capabilities. It enables users to trigger arbitrary shell commands and automation scripts on their Zorin OS 18.1 desktop by tapping custom buttons on their Android phone.

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   RUN COMMAND EXECUTION FLOW                                    │
├─────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                 │
│   [ ANDROID CLIENT ]                                                                            │
│   User taps custom action button: e.g. [ 🔒 Lock Desktop ] or [ 🌙 Suspend PC ]                 │
│         │                                                                                       │
│         │ JSON Wire Packet:                                                                     │
│         │ { "id": 1042, "type": "kdeconnect.runcommand.request", "body": { "key": "cmd-01" } }  │
│         ▼                                                                                       │
│   [ ZORIN CONNECT DAEMON (GSCONNECT / GJS) ]                                                    │
│         │                                                                                       │
│         │ Look up key in DConf: `/org/gnome/shell/extensions/gsconnect/device/.../commands/`    │
│         │ Matches command string: `loginctl lock-session`                                       │
│         ▼                                                                                       │
│   [ GSubprocess SESSION RUNTIME ]                                                               │
│   Executes command asynchronously under user UID (Non-blocking, unprivileged)                   │
│         │                                                                                       │
│         ├─► Desktop locks instantly                                                             │
│         └─► Notification pushed to desktop & mirrored back to phone                             │
│                                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 1.1 How Remote Commands Execute
* **Execution Context:** Commands run strictly inside the active graphical desktop session under your standard user account (`$USER`). They inherit your environment variables, including `$DISPLAY`, `$WAYLAND_DISPLAY`, and `$DBUS_SESSION_BUS_ADDRESS`.
* **Non-Blocking Daemon:** Commands are executed asynchronously. Long-running scripts will not freeze the Zorin Connect app or block subsequent remote actions.
* **Security Model:** Android clients cannot send arbitrary unvetted shell strings on the fly. The desktop maintains an authoritative, pre-registered command dictionary. The phone only transmits a hash key or identifier matching an approved command configured on the desktop.

---

## 2. Setting Up Commands via the Graphical Interface

1. On your Zorin OS desktop, open **Settings → Zorin Connect** (or select your phone in the top panel menu and click **Device Settings**).
2. Click on the paired Android device card.
3. Under the **Plugins** list, locate and click **Run Commands** (ensure the toggle is **On**).
4. Click the **Edit / Gear icon** next to Run Commands.
5. In the configuration dialog, click the **`+` (Add Command)** button.
6. Provide two values:
   * **Name:** A friendly label that appears on your phone screen (e.g., `Lock Screen`).
   * **Command:** The exact shell command or script path (e.g., `loginctl lock-session`).
7. Click **Save**. The new command immediately synchronizes over TLS to your phone.
8. On Android, open the Zorin Connect app, tap **Run Command**, and your new button will be ready for execution.

---

## 3. Comprehensive Command Recipes Library

Below is a verified catalog of production-tested commands for Zorin OS 18.1, categorized by operational domain.

### 3.1 Power & Session Management

| Action | Friendly Name | Shell Command | Notes & Subsystem |
|:---|:---|:---|:---|
| **Lock Screen** | `Lock PC` | `loginctl lock-session` | Standard systemd session lock (Core/Pro/Lite) |
| **Unlock Screen** | `Unlock PC` | `loginctl unlock-session` | Re-authorizes unlocked session state |
| **Suspend / Sleep** | `Suspend PC` | `systemctl suspend` | Low-power RAM sleep; wakes via keyboard or WoL |
| **Shutdown PC** | `Power Off PC` | `systemctl poweroff` | Clean system shutdown without root prompt |
| **Reboot PC** | `Restart PC` | `systemctl reboot` | Clean system reboot |
| **Turn Off Monitors** | `Screens Off` | `sh -c "sleep 0.5 && (wlopm --off &#124;&#124; xset dpms force off)"` | Turns off display backlight immediately |

### 3.2 Audio, Volume & Media Switching

| Action | Friendly Name | Shell Command | Notes & Subsystem |
|:---|:---|:---|:---|
| **Toggle Mute** | `Mute Audio` | `pactl set-sink-mute @DEFAULT_SINK@ toggle` | Toggles PulseAudio / PipeWire master mute |
| **Volume Up 5%** | `Volume +5%` | `pactl set-sink-volume @DEFAULT_SINK@ +5%` | Increases master volume by 5% increments |
| **Volume Down 5%** | `Volume -5%` | `pactl set-sink-volume @DEFAULT_SINK@ -5%` | Decreases master volume by 5% increments |
| **Set Volume 50%** | `Volume 50%` | `pactl set-sink-volume @DEFAULT_SINK@ 50%` | Sets volume to exact moderate listening level |
| **Kill Media Player** | `Stop All Media` | `sh -c "pkill -f vlc &#124;&#124; pkill -f spotify &#124;&#124; playerctl pause"` | Terminates or halts all rogue media processes |
| **Switch Audio Sink** | `Toggle Speakers` | `sh -c "$HOME/.local/bin/toggle-audio-sink.sh"` | Flips default output between speakers & headphones |

### 3.3 Desktop Utilities & Productivity

| Action | Friendly Name | Shell Command | Notes & Subsystem |
|:---|:---|:---|:---|
| **Open Terminal** | `Spawn Terminal` | `gnome-terminal` | Opens terminal window (use `xfce4-terminal` on Lite) |
| **Open File Manager** | `Open Files` | `nautilus ~` | Opens Home folder in Nautilus |
| **Take Screenshot** | `Screenshot Screen` | `sh -c "gnome-screenshot -f $HOME/Pictures/Shot-\$(date +%s).png"` | Captures full desktop and saves to Pictures |
| **Empty Trash** | `Empty Trash` | `rm -rf ~/.local/share/Trash/files/*` | Instantly clears desktop trash bin |
| **Launch Web Browser**| `Open Browser` | `xdg-open https://google.com` | Spawns default browser to target URL |

### 3.4 Push Diagnostics (Desktop to Phone Alerts)

You can trigger terminal commands on Zorin OS that send push notifications containing vital diagnostic data directly to your phone:

| Action | Friendly Name | Shell Command | Output Triggered |
|:---|:---|:---|:---|
| **Report Local IP** | `Check PC IP` | `sh -c "notify-send 'PC Network' \"IP: \$(hostname -I &#124; awk '{print \$1}')\""` | Sends PC local IPv4 address |
| **Report CPU Temp** | `CPU Temperature`| `sh -c "notify-send 'CPU Temp' \"\$(sensors &#124; grep -E 'Package id 0&#124;Tctl' &#124; awk '{print \$2,\$3,\$4}')\""` | Pushes thermal stats to mobile notification |
| **Report Disk Space** | `Check Storage` | `sh -c "notify-send 'Disk Space' \"\$(df -h / &#124; awk 'NR==2 {print \\\"Available: \\\" \$4 \\\" (\\\" \$5 \\\" used)\\\"}')\""` | Reports free NVMe/SSD space |
| **Laptop Battery** | `PC Battery` | `sh -c "notify-send 'Laptop Battery' \"\$(cat /sys/class/power_supply/BAT*/capacity)% - \$(cat /sys/class/power_supply/BAT*/status)\""` | Pushes laptop battery state |

---

## 4. Multi-Step Shell Script Automation Hub

For complex operations involving conditional logic, multiple commands, or hardware adjustments, write custom shell scripts and point your Zorin Connect Run Command to the script file.

### Step 4.1: Create the User Script Directory
Open terminal on Zorin OS and establish a dedicated directory for remote scripts:

```bash
mkdir -p ~/.local/bin/zorin-remote-scripts
chmod 700 ~/.local/bin/zorin-remote-scripts
```

### Step 4.2: Recipe 1 — Presentation Conference Mode (`presentation-mode.sh`)
This script disables desktop notifications, sets master volume to 75%, launches your slide deck in LibreOffice, and turns off monitor sleep timers:

```bash
cat << 'EOF' > ~/.local/bin/zorin-remote-scripts/presentation-mode.sh
#!/usr/bin/env bash
# Presentation Setup Script triggered from Android

# 1. Enable Do Not Disturb in GNOME to silence desktop popups
gsettings set org.gnome.desktop.notifications show-banners false

# 2. Set master audio volume to 75%
pactl set-sink-volume @DEFAULT_SINK@ 75%

# 3. Inhibit display sleep during presentation
gnome-session-inhibit --inhibit idle --reason "Presenting from Android" &

# 4. Push confirmation notification
notify-send "Presentation Mode" "Do Not Disturb enabled. Volume set to 75%."

EOF
chmod +x ~/.local/bin/zorin-remote-scripts/presentation-mode.sh
```

### Step 4.3: Recipe 2 — Audio Sink Toggler (`toggle-audio-sink.sh`)
Quickly switch default audio output between your desktop speakers and wireless headphones with a single tap on your phone:

```bash
cat << 'EOF' > ~/.local/bin/zorin-remote-scripts/toggle-audio-sink.sh
#!/usr/bin/env bash
# Toggles between primary speaker sink and headphone sink

CURRENT_SINK=$(pactl get-default-sink)
SINKS=($(pactl list short sinks | awk '{print $2}'))

if [ "${CURRENT_SINK}" == "${SINKS[0]}" ] && [ ${#SINKS[@]} -gt 1 ]; then
    pactl set-default-sink "${SINKS[1]}"
    notify-send "Audio Switched" "Active Output: ${SINKS[1]}"
else
    pactl set-default-sink "${SINKS[0]}"
    notify-send "Audio Switched" "Active Output: ${SINKS[0]}"
fi
EOF
chmod +x ~/.local/bin/zorin-remote-scripts/toggle-audio-sink.sh
```

### Step 4.4: Recipe 3 — Night Mode & Sleep Automation (`night-routine.sh`)
This script closes non-essential browser windows, activates GNOME Night Light (blue-light filter), mutes the system, and suspends the PC after a 30-second warning countdown:

```bash
cat << 'EOF' > ~/.local/bin/zorin-remote-scripts/night-routine.sh
#!/usr/bin/env bash
# Night Shutdown / Sleep Automation

# 1. Activate GNOME Night Light
gsettings set org.gnome.settings-daemon.plugins.color night-light-enabled true

# 2. Mute system volume
pactl set-sink-mute @DEFAULT_SINK@ 1

# 3. Notify user with countdown
notify-send "Night Routine" "System will suspend in 15 seconds."
sleep 15

# 4. Suspend computer
systemctl suspend
EOF
chmod +x ~/.local/bin/zorin-remote-scripts/night-routine.sh
```

---

## 5. Inspecting & Backing Up Commands via GSettings / DConf

Because Zorin Connect stores your configured commands inside the GSettings/DConf registry, you can inspect, export, or programmatically insert commands from the Linux terminal:

```bash
# Dump all currently configured GSConnect / Zorin Connect settings
dconf dump /org/gnome/shell/extensions/gsconnect/

# Find your connected device ID
DEVICE_ID=$(dconf list /org/gnome/shell/extensions/gsconnect/ | grep -E '^device/' | cut -d'/' -f2)
echo "Paired Device ID: ${DEVICE_ID}"

# View configured commands for this device
dconf read /org/gnome/shell/extensions/gsconnect/device/${DEVICE_ID}/plugin/runcommand/command-list
```

This configuration data can be saved and restored across clean installations of Zorin OS 18.1 by backing up `~/.config/gsconnect/` and your DConf path.


---

<a id="doc-5-04-advanced-wayland-dbus-and-global-remote-control"></a>
<!-- ====================================================================== -->
<!-- FILE: 04-advanced-wayland-dbus-and-global-remote-control.md (Sequence: 05 of 08) -->
<!-- ====================================================================== -->

# Zorin Connect: Advanced Wayland Architecture, D-Bus Automation & Global WAN Control
**Target Environment:** Zorin OS 18.1 (GNOME 46+ Wayland) & Android (Cellular WAN / Mesh VPN)  
**Document Series:** Deliverable 04 of 05  
**Advanced Topics:** Wayland vs X11 Input Injection · `libei` & `ydotool` · D-Bus Session Control (`gdbus`) · Global Remote Control via Tailscale Mesh VPN · Off-Grid Hotspots · Cryptographic Certificate Rotation  
**Current Date:** 2026-10-13  

---

## 1. Wayland vs X11 Display Architecture & Input Injection

Zorin OS 18.1 defaults to the modern **Wayland** display server architecture powered by GNOME's Mutter compositor. Wayland introduces strict application sandboxing that fundamentally differs from legacy X11.

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                WAYLAND VS X11 INPUT INJECTION COMPARISON                        │
├─────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                 │
│  [ TRADITIONAL X11 ARCHITECTURE ]                                                               │
│  Android Input ──► GSConnect / KDEConnect ──► XTest Extension ──► X11 Server ──► Any Window     │
│  • Security Flaw: Any process can sniff global keystrokes or inject unvetted input events.      │
│  • Automation: Tools like `xdotool` work easily because X11 has zero window boundaries.         │
│                                                                                                 │
│  [ MODERN WAYLAND ARCHITECTURE (ZORIN OS 18.1) ]                                                │
│  Android Input ──► Zorin Connect (GSConnect) ──► Mutter / Clutter Compositor ──► Focused Client │
│                                             └──► libei (Emulated Input Protocol)                │
│  • Security Guarantee: Windows are isolated. External apps cannot record or fake keystrokes.   │
│  • Why Zorin Connect Works: GSConnect runs inside the GNOME Shell process as an extension,      │
│    granting it privileged access to Mutter's internal input synthesis pipeline.                 │
│  • Command Limitation: Legacy tools like `xdotool` fail under Wayland for custom scripts.       │
│                                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 1.1 Why Legacy `xdotool` Fails on Wayland & The `ydotool` Alternative
When writing custom commands to simulate keystrokes (e.g., minimizing windows, pressing shortcut keys), commands that rely on `xdotool` will output errors such as:
```text
Error: Can't open display: (null)
# or silently fail because XTest is disabled under Wayland
```

To execute simulated keystrokes and mouse clicks from custom shell scripts under Wayland, deploy **`ydotool`**, which communicates directly with the Linux kernel `/dev/uinput` subsystem:

```bash
# 1. Install ydotool from the Zorin OS repository
sudo apt install ydotool -y

# 2. Enable and start the background ydotoold daemon
sudo systemctl enable --now ydotool.service 2>/dev/null || ydotoold &

# 3. Add current user to input group for non-root uinput access
sudo usermod -aG input $USER
```

#### Wayland-Compatible Keystroke Recipes with `ydotool`:

| Action | Wayland-Compatible Command | Keycodes Simulated |
|:---|:---|:---|
| **Show Desktop (Super+D)** | `ydotool key 125:1 32:1 32:0 125:0` | Super Down, D Down, D Up, Super Up |
| **Open Terminal (Ctrl+Alt+T)** | `ydotool key 29:1 56:1 20:1 20:0 56:0 29:0` | Ctrl Down, Alt Down, T Down, release all |
| **Toggle Fullscreen (F11)** | `ydotool key 87:1 87:0` | F11 Press and Release |
| **Switch Workspace (Super+PageDown)**| `ydotool key 125:1 109:1 109:0 125:0` | Super Down, PageDown, release |

---

## 2. Programmatic D-Bus Automation (`gdbus` / `qdbus`)

Because Zorin Connect registers a comprehensive D-Bus interface (`org.gnome.Shell.Extensions.GSConnect`), you can interact with, query, and command your connected phone programmatically using terminal commands and shell scripts.

### 2.1 Discovering Connected Devices via D-Bus
Run this command to inspect all devices paired to your Zorin OS session:

```bash
# Query the GSConnect D-Bus object tree
gdbus call --session \
  --dest org.gnome.Shell.Extensions.GSConnect \
  --object-path /org/gnome/Shell/Extensions/GSConnect \
  --method org.gnome.Shell.Extensions.GSConnect.ListDevices
```

The output returns an array of device object paths (e.g., `['/org/gnome/Shell/Extensions/GSConnect/Device/0a1b2c3d4e5f']`).

### 2.2 Triggering Mobile Actions from Linux Terminal

Save your device ID to a variable:
```bash
DEVICE_PATH=$(gdbus call --session \
  --dest org.gnome.Shell.Extensions.GSConnect \
  --object-path /org/gnome/Shell/Extensions/GSConnect \
  --method org.gnome.Shell.Extensions.GSConnect.ListDevices | grep -o "'[^']*'" | head -n1 | tr -d "'")

echo "Targeting Device: ${DEVICE_PATH}"
```

#### Practical D-Bus Terminal Commands:

* **Ring the Phone (Find Device):**
  ```bash
  gdbus call --session \
    --dest org.gnome.Shell.Extensions.GSConnect \
    --object-path "${DEVICE_PATH}" \
    --method org.gnome.Shell.Extensions.GSConnect.Device.FindMyPhone
  ```

* **Send a Ping to Phone Screen:**
  ```bash
  gdbus call --session \
    --dest org.gnome.Shell.Extensions.GSConnect \
    --object-path "${DEVICE_PATH}" \
    --method org.gnome.Shell.Extensions.GSConnect.Device.Ping
  ```

* **Push a Custom Notification from Linux to Android:**
  ```bash
  gdbus call --session \
    --dest org.gnome.Shell.Extensions.GSConnect \
    --object-path "${DEVICE_PATH}" \
    --method org.gnome.Shell.Extensions.GSConnect.Device.ShareText \
    "Server backup completed successfully on Zorin OS."
  ```

* **Query Phone Battery State via D-Bus:**
  ```bash
  gdbus introspect --session \
    --dest org.gnome.Shell.Extensions.GSConnect \
    --object-path "${DEVICE_PATH}" | grep -i battery
  ```

---

## 3. Global Remote Control Beyond the Local LAN (Tailscale Mesh VPN)

By default, Zorin Connect relies on UDP broadcast discovery packets on ports 1714:1764. Broadcast packets cannot traverse internet routers, restricting standard pairing to your local home Wi-Fi.

However, you can achieve **worldwide, encrypted remote control from anywhere on Earth** (5G cellular, hotel Wi-Fi, coffee shops) by connecting your Zorin OS 18.1 desktop and your Android phone through a **Tailscale WireGuard Mesh Network**.

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   GLOBAL MESH VPN ARCHITECTURE                                  │
├─────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                 │
│   [ ANDROID PHONE ON 5G CELLULAR ]                                                              │
│   • Tailscale Virtual IP: `100.84.19.42`                                                        │
│   • Zorin Connect App configured with "Add Device by IP": `100.115.30.88`                       │
│         │                                                                                       │
│         │ Encrypted WireGuard P2P Tunnel (End-to-End ChaCha20-Poly1305)                         │
│         ▼                                                                                       │
│   [ GLOBAL INTERNET / CARRIER-GRADE NAT (CGNAT) BYPASS ]                                       │
│         │                                                                                       │
│         │ Direct Encrypted Ingress over `tailscale0` Virtual Interface                          │
│         ▼                                                                                       │
│   [ ZORIN OS 18.1 DESKTOP AT HOME ]                                                             │
│   • Tailscale Virtual IP: `100.115.30.88`                                                       │
│   • UFW Rule: `allow in on tailscale0 to any port 1714:1764 proto tcp`                          │
│   • Full Remote Control: Trackpad, Presentation, Run Commands, File Traversal                   │
│                                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 3.1 Step-by-Step Global Remote Setup

#### Step 1: Install and Initialize Tailscale on Zorin OS 18.1
```bash
# 1. Install the official Tailscale package
curl -fsSL https://tailscale.com/install.sh | sh

# 2. Authenticate and bring up the Tailscale WireGuard daemon
sudo tailscale up

# 3. Retrieve your desktop's permanent Tailscale 100.x.y.z IP address
tailscale ip -4
# Example output: 100.115.30.88
```

#### Step 2: Configure UFW for the Tailscale Interface
Allow Zorin Connect traffic through your desktop firewall exclusively over the secure Tailscale interface:
```bash
# Permit Zorin Connect ports on the virtual WireGuard interface
sudo ufw allow in on tailscale0 to any port 1714:1764 proto tcp comment 'Zorin Connect via Tailscale TCP'
sudo ufw allow in on tailscale0 to any port 1714:1764 proto udp comment 'Zorin Connect via Tailscale UDP'
sudo ufw reload
```

#### Step 3: Install Tailscale on Android
1. Install **Tailscale** from the Google Play Store (or F-Droid).
2. Log in using the identical identity provider (Google, Microsoft, GitHub).
3. Toggle the VPN switch to **Connected**.
4. Note your phone's Tailscale IP (e.g., `100.84.19.42`).

#### Step 4: Pair by IP in the Zorin Connect Android App
1. Open the **Zorin Connect** (or KDE Connect) app on Android.
2. Tap the **Three Dots Menu (⋮)** in the top-right corner.
3. Select **"Add devices by IP"** (or **"Pair by IP"**).
4. Tap **"Add IP Address"** and enter your Zorin OS machine's Tailscale IP:
   ```text
   100.115.30.88
   ```
5. Tap **OK**. Within two seconds, your Zorin OS desktop appears in the device list.
6. Tap **Request Pairing**. Accept the prompt on your desktop.

> [!TIP]
> **Complete Remote Autonomy:** Once configured via Tailscale, you can remotely control your desktop, browse files via SFTP, lock your screen, or execute scripts from anywhere in the world over cellular LTE/5G with zero router port-forwarding and complete WireGuard cryptographic encryption.

---

## 4. Off-Grid Field Travel Topology (Direct Mobile Hotspot)

If you are traveling in a location without Wi-Fi access (e.g., on a flight, at a conference, or in a park with a laptop running Zorin OS), you can control your laptop without an external router:

1. On your Android phone, enable **Personal Hotspot (Wi-Fi Hotspot)**.
2. Connect your Zorin OS laptop to your phone's Hotspot Wi-Fi network.
3. Because both devices are now peers on the phone's internal DHCP subnet (typically `192.168.43.0/24`), discovery works seamlessly.
4. **Zero Mobile Data Consumed:** Remote trackpad input, slide presentations, and local file transfers operate purely across the direct local radio link. No cellular data or internet connection is consumed.

---

## 5. Security Architecture, Key Storage & Certificate Rotation

All Zorin Connect communication is authenticated and encrypted via mutual TLS 1.3.

### 5.1 Where Keys & Certificates Live

| Desktop Edition | Directory Path | Key Artifacts |
|:---|:---|:---|
| **Zorin OS Core / Pro** | `~/.config/gsconnect/` | `certificate.pem` (Self-signed X.509 cert) · `private.pem` (RSA private key) |
| **Zorin OS Lite** | `~/.config/kdeconnect/` | `certificate.pem` · `private.key` · `config` |

### 5.2 Emergency Certificate Regeneration (Resetting Cryptographic Trust)
If you suspect your network key has been exposed or if a device pairing becomes corrupted with handshake errors, execute this clean reset script:

```bash
#!/usr/bin/env bash
# Reset and regenerate Zorin Connect TLS Keys

echo "Terminating running Zorin Connect services..."
pkill -f gsconnect 2>/dev/null
pkill -f kdeconnectd 2>/dev/null

echo "Backing up old cryptographic materials..."
mkdir -p ~/.config/gsconnect_backup
mv ~/.config/gsconnect/*.pem ~/.config/gsconnect_backup/ 2>/dev/null

echo "Generating fresh 2048-bit RSA private key and self-signed certificate..."
openssl req -new -x509 -sha256 -newkey rsa:2048 -nodes \
  -keyout ~/.config/gsconnect/private.pem \
  -days 3650 \
  -out ~/.config/gsconnect/certificate.pem \
  -subj "/CN=ZorinOS-Workstation/O=ZorinConnect/OU=Security"

chmod 600 ~/.config/gsconnect/private.pem
chmod 644 ~/.config/gsconnect/certificate.pem

echo "Restarting GNOME Shell extension..."
gnome-extensions disable zorin-connect@zorinos.com 2>/dev/null || gnome-extensions disable gsconnect@andyholmes.github.io 2>/dev/null
sleep 1
gnome-extensions enable zorin-connect@zorinos.com 2>/dev/null || gnome-extensions enable gsconnect@andyholmes.github.io 2>/dev/null

echo "Cryptographic keys successfully regenerated. Re-pair your Android handset."
```


---

<a id="doc-6-05-troubleshooting-matrix-and-operational-runbook"></a>
<!-- ====================================================================== -->
<!-- FILE: 05-troubleshooting-matrix-and-operational-runbook.md (Sequence: 06 of 08) -->
<!-- ====================================================================== -->

# Zorin Connect: Troubleshooting Matrix & Operational Runbook
**Target Environment:** Zorin OS 18.1 & Android Mobile Devices  
**Document Series:** Deliverable 05 of 05  
**Core Deliverables:** Diagnostic Flowchart · Exhaustive Failure Matrix · VM Bridged Networking · `zorin-connect-doctor.sh` Script  
**Current Date:** 2026-10-13  

---

## 1. Visual Diagnostic Flowchart & Decision Tree

When experiencing connectivity or remote control failures between Zorin OS 18.1 and Android, follow this systematic diagnostic path:

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

---

## 2. Comprehensive Troubleshooting Matrix

| Issue / Symptom | Probable Root Cause | Verification Command / Check | Resolution & Remediation |
|:---|:---|:---|:---|
| **Infinite "Searching for devices" on both screens** | Host firewall (UFW) blocking incoming UDP/TCP discovery packets | `sudo ufw status &#124; grep 1714` | Run `sudo ufw allow 1714:1764/udp && sudo ufw allow 1714:1764/tcp && sudo ufw reload` |
| **Devices on same Wi-Fi cannot see each other** | Router has "AP Isolation" or "Guest Network" isolation enabled | Try pinging phone IP from Linux: `ping -c 3 <phone-ip>` | Log into router admin portal; disable "AP Isolation" or "Client Isolation"; move off Guest Wi-Fi |
| **Zorin OS inside Virtual Machine (VM) won't discover phone** | VM is using NAT networking instead of Bridged mode | Check VM IP: `ip -br a` (starts with `10.0.2.x` instead of `192.168.1.x`) | Change VM network adapter in VirtualBox/VMware/KVM from **NAT** to **Bridged Adapter** |
| **"Pairing rejected" or cryptographic handshake failure** | Corrupted X.509 certificate or system clock skew | `timedatectl status` (check NTP sync) | Verify time synchronization (`sudo timedatectl set-ntp on`); delete old certs in `~/.config/gsconnect/` and re-pair |
| **Trackpad pointer stutters or lags noticeably** | 2.4 GHz RF congestion or Wi-Fi power saving on Linux NIC | `iwconfig &#124; grep "Power Management"` | Turn off Wi-Fi power saving: `sudo iwconfig wlan0 power off`; switch devices to 5 GHz or 6 GHz Wi-Fi band |
| **Gyroscopic presentation pointer drifts off target** | Phone IMU gyroscope accumulation drift | Pointer drifts when holding button without moving hand | Release the Pointer button on screen to reset position; perform a "figure-8" motion in air to calibrate phone compass/gyro |
| **Connection disconnects 5 minutes after phone screen locks** | Android Doze mode suspends background socket daemon | Check phone battery settings | Open Android Settings → Apps → Zorin Connect → Battery → Change from "Optimized" to **"Unrestricted"** |
| **Custom "Run Command" does not trigger or fails silently** | Command relies on `xdotool` under Wayland or lacks execution permissions | Test command directly in desktop terminal | Replace `xdotool` with `ydotool` or native D-Bus; verify script has `chmod +x` permissions |
| **Clipboard copied on phone does not paste on Zorin OS** | Android 10+ background clipboard security restrictions | Check Android version in Settings | Android prohibits background clipboard reading; use the **"Send Clipboard"** notification button or Quick Settings tile |
| **"Browse Device" (SFTP) times out or shows empty folder** | Android file permission missing or port 1739 blocked | Check App Permissions in Android | Grant "All Files Access" / "Photos and Videos" permission; ensure port 1739 is not blocked |

---

## 3. Resolving the Virtual Machine (VM) Connectivity Trap

As highlighted by community moderator `swarfendor437` on the Zorin Forum (*"Zorin Connect the easy method"*), many users testing Zorin OS in a virtual machine (VirtualBox, VMware, KVM/QEMU) find that Zorin Connect fails to detect their physical smartphone.

### The Problem
By default, hypervisors configure virtual network adapters using **NAT (Network Address Translation)**. Under NAT:
* The host OS assigns the VM a private internal subnet (typically `10.0.2.15`).
* While the VM can access the internet, it is completely isolated from your physical home Wi-Fi network (`192.168.1.xxx`).
* UDP discovery broadcasts from your phone on the home Wi-Fi never reach the virtual machine.

### The Solution: Switch to Bridged Adapter Mode

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                VM BRIDGED NETWORKING TOPOLOGY                                   │
├─────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                 │
│  [ PHYSICAL WI-FI ROUTER SUBNET: 192.168.1.0/24 ]                                               │
│         │                                                                                       │
│         ├─► [ Physical Android Smartphone ] ── Assigned IP: 192.168.1.82                        │
│         │                                                                                       │
│         └─► [ Host PC Physical Wi-Fi NIC ]                                                      │
│                   │                                                                             │
│                   ▼ (Hypervisor Bridged Driver)                                                 │
│             [ Zorin OS 18.1 Virtual Machine ] ── Assigned IP: 192.168.1.145                     │
│                                                                                                 │
│  ✓ Result: VM is now an equal peer on the physical subnet. Discovery succeeds immediately!     │
│                                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
```

1. **VirtualBox:**
   * Power off the Zorin OS virtual machine.
   * Open VM **Settings → Network → Adapter 1**.
   * Change **Attached to:** from *NAT* to **Bridged Adapter**.
   * Under **Name**, select your host PC's active physical Wi-Fi or Ethernet card.
   * Start the VM. Run `ip -br a` and confirm the VM receives an IP in the same `192.168.1.xxx` range as your phone.
2. **VMware Workstation / Player:**
   * Open VM **Settings → Network Adapter**.
   * Select **Bridged: Connected directly to the physical network**.
   * Check **Replicate physical network connection state**.

---

## 4. Automated Diagnostic Tool: `zorin-connect-doctor.sh`

To eliminate guesswork, deploy this automated diagnostic script. It validates firewall ports, D-Bus session bindings, daemon processes, and local listening sockets, providing color-coded feedback and automated fix suggestions.

### Step 4.1: Create and Run the Script

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
NC='\033[0m' # No Color

echo -e "${BLUE}==============================================================================${NC}"
echo -e "${BLUE}                   ZORIN CONNECT SYSTEM HEALTH VERIFICATION                   ${NC}"
echo -e "${BLUE}==============================================================================${NC}"

# 1. Detect Desktop Session & Display Server
SESSION_TYPE=$(echo "$XDG_SESSION_TYPE")
DESKTOP=$(echo "$XDG_CURRENT_DESKTOP")
echo -e "\n[*] Desktop Environment: ${YELLOW}${DESKTOP}${NC}"
echo -e "[*] Display Server:      ${YELLOW}${SESSION_TYPE}${NC}"

# 2. Check Zorin Connect / GSConnect Extension State
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
    # Check for KDE Connect daemon (Lite / XFCE)
    if pgrep -x "kdeconnectd" > /dev/null; then
        echo -e "    ${GREEN}[PASS]${NC} kdeconnectd daemon is active and running."
    else
        echo -e "    ${RED}[FAIL]${NC} kdeconnectd daemon is not running."
    fi
fi

# 3. Check Session D-Bus Interface
echo -e "\n[*] Checking D-Bus Session Communication..."
if gdbus introspect --session --dest org.gnome.Shell.Extensions.GSConnect --object-path /org/gnome/Shell/Extensions/GSConnect &>/dev/null; then
    echo -e "    ${GREEN}[PASS]${NC} GSConnect D-Bus service is responsive on session bus."
elif qdbus org.kde.kdeconnect &>/dev/null; then
    echo -e "    ${GREEN}[PASS]${NC} KDE Connect D-Bus service is responsive on session bus."
else
    echo -e "    ${YELLOW}[WARN]${NC} D-Bus service not responding directly (may activate on connection)."
fi

# 4. Check Uncomplicated Firewall (UFW)
echo -e "\n[*] Inspecting Firewall (UFW) Port Configuration..."
if command -v ufw &>/dev/null; then
    UFW_STATUS=$(sudo ufw status | grep "Status: active")
    if [ -n "$UFW_STATUS" ]; then
        echo -e "    [*] UFW Status: Active"
        UFW_UDP=$(sudo ufw status | grep -E "1714:1764.*ALLOW.*UDP")
        UFW_TCP=$(sudo ufw status | grep -E "1714:1764.*ALLOW.*TCP")
        
        if [ -n "$UFW_UDP" ] && [ -n "$UFW_TCP" ]; then
            echo -e "    ${GREEN}[PASS]${NC} Ports 1714:1764 UDP and TCP are properly allowed."
        else
            echo -e "    ${RED}[FAIL]${NC} Firewall rules for Zorin Connect are MISSING!"
            echo -e "    ${YELLOW}[FIX]${NC}  Execute:"
            echo -e "           sudo ufw allow 1714:1764/udp"
            echo -e "           sudo ufw allow 1714:1764/tcp"
            echo -e "           sudo ufw reload"
        fi
    else
        echo -e "    ${YELLOW}[INFO]${NC} UFW is inactive (ports are not blocked by local firewall)."
    fi
else
    echo -e "    ${YELLOW}[INFO]${NC} UFW is not installed."
fi

# 5. Check Listening Sockets on Ports 1714:1764
echo -e "\n[*] Inspecting Local Network Listening Ports..."
LISTEN_PORTS=$(ss -tuln | grep -E ":171[4-9]|:172[0-9]|:173[0-9]|:174[0-9]|:175[0-9]|:176[0-4]")
if [ -n "$LISTEN_PORTS" ]; then
    echo -e "    ${GREEN}[PASS]${NC} Subsystem is listening on KDE Connect port brackets:"
    echo "$LISTEN_PORTS" | awk '{print "           " $1, $5}'
else
    echo -e "    ${YELLOW}[WARN]${NC} No active listening sockets detected on 1714:1764 yet."
    echo -e "           (Ensure Zorin Connect Settings window is currently open)."
fi

# 6. Check Cryptographic Certificates
echo -e "\n[*] Verifying Cryptographic Materials..."
if [ -f "$HOME/.config/gsconnect/certificate.pem" ] && [ -f "$HOME/.config/gsconnect/private.pem" ]; then
    echo -e "    ${GREEN}[PASS]${NC} GSConnect TLS keys and certificate are present."
elif [ -f "$HOME/.config/kdeconnect/certificate.pem" ]; then
    echo -e "    ${GREEN}[PASS]${NC} KDE Connect TLS certificate is present."
else
    echo -e "    ${YELLOW}[WARN]${NC} Certificates not found in standard config path (will generate on first run)."
fi

# 7. Print Active IP Interfaces for Phone Pairing
echo -e "\n[*] Host Network IP Addresses for Manual Pairing:"
ip -br addr show | awk '{print "    • " $1 ": " $3}'

echo -e "\n${BLUE}==============================================================================${NC}"
echo -e "${BLUE}                        DIAGNOSTIC RUN COMPLETED                              ${NC}"
echo -e "${BLUE}==============================================================================${NC}"
EOF

chmod +x ~/zorin-connect-doctor.sh
~/zorin-connect-doctor.sh
```

### Expected Output
The diagnostic tool performs an instant, 7-point check across your entire system, providing immediate visibility into whether your firewall, D-Bus session, daemon, sockets, and certificates are fully operational.


---

<a id="doc-7-06-security-hardening-and-home-network-defense"></a>
<!-- ====================================================================== -->
<!-- FILE: 06-security-hardening-and-home-network-defense.md (Sequence: 07 of 08) -->
<!-- ====================================================================== -->

# Zorin Connect: Security Hardening & Home Network Defense Guide
**Target Environment:** Zorin OS 18.1 (Host) · Android (Client) · Home Wi-Fi Router & Network Perimeter  
**Document Series:** Deliverable 06 of 06  
**Primary Focus:** Attack Surface Mitigation · UFW Micro-Segmentation · Router Hardening · IoT Isolation · Encrypted DNS · NetworkManager Dispatcher Automation  
**Current Date:** 2026-10-13  

---

## 1. Threat Modeling & Attack Surface Analysis

Connecting your smartphone to your Linux desktop creates an intimate bridge between personal devices. While Zorin Connect is open-source and uses mutual TLS encryption, running listening network services and remote command execution daemons introduces specific attack surfaces that must be understood and hardened.

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

### 1.1 Attack Surface Breakdown

| Component | Default Listening Ports | Potential Vulnerability / Attack Vector | Hardening Mitigation |
|:---|:---:|:---|:---|
| **UDP Discovery Engine** | `1714–1764/udp` | Packet sniffing, local network presence disclosure, broadcast replay attacks | Bind rules strictly to trusted interfaces; restrict IP ranges in UFW |
| **TCP Control & TLS** | `1714–1764/tcp` | TLS cipher downgrade, rogue pairing spam, protocol parsing flaws | Restrict incoming connections to paired device IP; enforce TLS 1.3 |
| **SFTP Storage Server** | `1739–1740/tcp` | Path traversal attacks, unauthorized directory browsing | Sandbox storage folder to dedicated isolated landing directory |
| **Run Command Plugin** | Internal D-Bus | Command injection, arbitrary code execution, privilege escalation | Never grant `sudo` rights; sanitize scripts; use absolute paths |
| **Shared Clipboard** | Protocol Channel | Sensitive data leakage (passwords, 2FA tokens, crypto addresses) | Clear clipboard after copying secrets; disable auto-sync when in public |

---

## 2. Zorin Connect Application Hardening

### 2.1 Cryptographic Key & Certificate Hardening
Zorin Connect authenticates devices using RSA public/private key pairs and self-signed X.509 certificates stored in your user profile. Protect these files from unauthorized local access:

```bash
# 1. Enforce strict filesystem permissions on cryptographic materials
chmod 700 ~/.config/gsconnect 2>/dev/null || chmod 700 ~/.config/kdeconnect 2>/dev/null
chmod 600 ~/.config/gsconnect/*.pem 2>/dev/null || chmod 600 ~/.config/kdeconnect/* 2>/dev/null

# 2. Verify that private keys are unreadable by other local user accounts
ls -ld ~/.config/gsconnect
# Output should show: drwx------ (700 owned strictly by your user)
```

#### Out-of-Band Fingerprint Verification
When pairing a new device, **never casually click Accept**. Attackers sharing the same Wi-Fi network could initiate a spoofed pairing request.
1. Before accepting, compare the cryptographic SHA-256 fingerprint displayed on your desktop screen with the fingerprint shown on your Android handset.
2. Verify that every hexadecimal character matches exactly.
3. If a pairing request appears unexpectedly when you did not initiate it, click **Reject** immediately.

### 2.2 Hardening the "Run Commands" Subsystem
The Run Command plugin executes shell commands directly within your desktop session. Apply strict security policies:

* **The Sudo Proscription:** **NEVER** configure a command that includes `sudo` or add your user account to `/etc/sudoers` with `NOPASSWD`. If your smartphone were lost or physically accessed by an unauthorized individual, they would have immediate, unrestricted root access to your entire computer.
* **Use Absolute Executable Paths:** Always specify full binary paths in custom commands to prevent `$PATH` hijacking:
  * Good: `/usr/bin/loginctl lock-session`
  * Bad: `loginctl lock-session`
* **Avoid Complex Inline Piping:** Instead of chaining commands with pipes inside the GUI (`cmd1 | cmd2 && cmd3`), write a dedicated, reviewed bash script in `~/.local/bin/zorin-remote-scripts/`, verify it with `shellcheck`, make it executable with `chmod 700`, and point Zorin Connect to that script.

### 2.3 Sandboxing File Transfers & SFTP Storage
By default, files received from your phone are placed into `~/Downloads`. If your phone downloads a malicious attachment or APK, it could sit in your primary downloads folder:

1. Create a dedicated quarantine directory:
   ```bash
   mkdir -p ~/Downloads/ZorinConnect_Quarantine
   chmod 700 ~/Downloads/ZorinConnect_Quarantine
   ```
2. In Zorin Connect desktop settings, select your phone → **File Sharing / Receive Files** → change the destination directory to `~/Downloads/ZorinConnect_Quarantine`.
3. Periodically inspect and clear this folder.

### 2.4 Automatic Wi-Fi Trust Gating (NetworkManager Dispatcher)
When you take your laptop outside the home and connect to public Wi-Fi (e.g., Starbucks, hotel networks, conferences), Zorin Connect should **not** broadcast discovery beacons or listen on open ports.

Deploy this automated NetworkManager dispatcher script to automatically disable Zorin Connect on public Wi-Fi and re-enable it only when connected to your secure home Wi-Fi SSID:

```bash
sudo cat << 'EOF' > /etc/NetworkManager/dispatcher.d/99-zorin-connect-trust-gate.sh
#!/usr/bin/env bash
# ==============================================================================
# NetworkManager Dispatcher: Auto-Toggle Zorin Connect Based on Wi-Fi SSID
# ==============================================================================

INTERFACE="$1"
ACTION="$2"

# REPLACE "MySecureHomeWiFi" WITH YOUR EXACT HOME WI-FI SSID
TRUSTED_HOME_SSID="MySecureHomeWiFi"

if [ "$INTERFACE" != "lo" ] && [ "$ACTION" == "up" ]; then
    CURRENT_SSID=$(nmcli -t -f active,ssid dev wifi | grep '^yes:' | cut -d':' -f2)
    ACTIVE_USER=$(who | awk '{print $1}' | head -n1)
    USER_UID=$(id -u "$ACTIVE_USER" 2>/dev/null)

    if [ "$CURRENT_SSID" == "$TRUSTED_HOME_SSID" ]; then
        # On trusted home network: Enable Zorin Connect
        logger -t zorin-connect-gate "Connected to trusted SSID: $CURRENT_SSID. Enabling Zorin Connect."
        sudo -u "$ACTIVE_USER" DBUS_SESSION_BUS_ADDRESS="unix:path=/run/user/${USER_UID}/bus" \
          gnome-extensions enable zorin-connect@zorinos.com 2>/dev/null
    else
        # On untrusted / public network: Disable Zorin Connect for defense
        logger -t zorin-connect-gate "Connected to untrusted SSID: $CURRENT_SSID. Disabling Zorin Connect."
        sudo -u "$ACTIVE_USER" DBUS_SESSION_BUS_ADDRESS="unix:path=/run/user/${USER_UID}/bus" \
          gnome-extensions disable zorin-connect@zorinos.com 2>/dev/null
    fi
fi
EOF

sudo chmod 755 /etc/NetworkManager/dispatcher.d/99-zorin-connect-trust-gate.sh
```

---

## 3. Host-Level Linux Security Hardening (Zorin OS 18.1)

### 3.1 Strict UFW Micro-Segmentation
Instead of opening ports `1714:1764` to all IP addresses, restrict incoming traffic strictly to your Android smartphone's specific local IP address:

```bash
# 1. Reset any open, global Zorin Connect rules
sudo ufw delete allow 1714:1764/udp 2>/dev/null
sudo ufw delete allow 1714:1764/tcp 2>/dev/null

# 2. Assign static DHCP reservation for your phone in router (e.g. 192.168.1.82)
# 3. Allow incoming traffic ONLY from your phone's specific IP address:
sudo ufw allow from 192.168.1.82 to any port 1714:1764 proto udp comment 'Zorin Connect Phone UDP'
sudo ufw allow from 192.168.1.82 to any port 1714:1764 proto tcp comment 'Zorin Connect Phone TCP'

# 4. Enforce strict default inbound denial
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw reload
sudo ufw status numbered
```

### 3.2 Linux Kernel Network Stack Hardening (`sysctl`)
Harden your Linux kernel against network-level spoofing, broadcast floods, and port scanning by applying these sysctl rules:

```bash
sudo cat << 'EOF' > /etc/sysctl.d/99-network-security-hardening.conf
# Enable TCP SYN Cookie protection against SYN flood DoS attacks
net.ipv4.tcp_syncookies = 1

# Disable IP Source Routing (prevents malicious packet redirection)
net.ipv4.conf.all.accept_source_route = 0
net.ipv4.conf.default.accept_source_route = 0

# Enable Strict Reverse Path Filtering (prevents IP spoofing)
net.ipv4.conf.all.rp_filter = 1
net.ipv4.conf.default.rp_filter = 1

# Ignore ICMP Broadcast Echo requests (smurf attack protection)
net.ipv4.icmp_echo_ignore_broadcasts = 1

# Ignore bogus ICMP error responses
net.ipv4.icmp_ignore_bogus_error_responses = 1

# Disable ICMP redirect acceptance (prevents route poisoning)
net.ipv4.conf.all.accept_redirects = 0
net.ipv4.conf.default.accept_redirects = 0
net.ipv4.conf.all.secure_redirects = 0
net.ipv4.conf.default.secure_redirects = 0
EOF

# Apply kernel settings immediately
sudo sysctl --system
```

### 3.3 Encrypted DNS Configuration (DNS over TLS)
Prevent DNS hijacking, local eavesdropping, and ISP snooping by enabling **DNS over TLS (DoT)** via `systemd-resolved` on Zorin OS:

```bash
# Configure systemd-resolved for DNS-over-TLS with Quad9 (Privacy + Threat Blocking)
sudo cat << 'EOF' > /etc/systemd/resolved.conf.d/dns_over_tls.conf
[Resolve]
DNS=9.9.9.9#dns.quad9.net 149.112.112.112#dns.quad9.net
FallbackDNS=1.1.1.1#cloudflare-dns.com
DNSOverTLS=yes
DNSSEC=yes
EOF

# Restart systemd-resolved and verify
sudo systemctl restart systemd-resolved
resolvectl status | grep -E "DNS Servers|DNSOverTLS|DNSSEC"
```

---

## 4. Home Network & Wi-Fi Router Perimeter Defense

The security of Zorin Connect relies directly on the security of the Wi-Fi network carrying its packets. Harden your home perimeter against intrusion:

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                               SECURE HOME NETWORK SEGMENTATION                                  │
├─────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                 │
│  [ WAN / INTERNET FIBER / CABLE MODEM ]                                                         │
│         │                                                                                       │
│         ▼                                                                                       │
│  [ SECURE WI-FI 6 / 7 ROUTER ]                                                                  │
│  • WPA3-Personal (SAE) · UPnP: OFF · WPS: OFF · Remote WAN Admin: OFF                           │
│  • Primary Admin Password: 25+ Character Random Alpha-Numeric                                   │
│         │                                                                                       │
│         ├─────────────────────────────────────────┐                                             │
│         ▼                                         ▼                                             │
│  [ TRUSTED LAN / VLAN 10 ]                 [ ISOLATED IOT / GUEST VLAN 20 ]                     │
│  • Zorin OS 18.1 Desktop                   • Smart TVs, IP Cameras, Smart Bulbs                 │
│  • Personal Android Smartphone             • Robotic Vacuums, Game Consoles, Smart Plugs        │
│  • Zorin Connect: ACTIVE                   • Zero access to Trusted LAN (Client Isolation: ON)  │
│  • Subnet: 192.168.1.0/24                  • Subnet: 192.168.20.0/24                            │
│                                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 4.1 Router Hardening Checklist

1. **Change Default Administrative Credentials:**
   * Never leave router logins as `admin`/`admin` or `admin`/`password`.
   * Configure a unique 20+ character administrative passphrase stored in a password manager.
2. **Disable Wi-Fi Protected Setup (WPS):**
   * **Critical Action:** Turn off WPS immediately in your router settings.
   * WPS utilizes an 8-digit PIN that can be cracked in under 4 hours using automated brute-force tools (such as *Reaver* or *Pixie Dust*), granting attackers your Wi-Fi password regardless of how complex it is.
3. **Disable Universal Plug and Play (UPnP):**
   * UPnP allows any device on your network (such as a compromised smart light bulb or malware on a computer) to silently open inbound ports through your router's firewall without administrative permission.
   * Turn **UPnP OFF** in router settings.
4. **Disable Remote Management from WAN:**
   * Ensure that "Remote Management", "Web Access over WAN", and "WAN Ping Response" are all **Disabled**.
   * Your router's administrative portal should only be accessible from physically connected LAN devices.
5. **Enforce WPA3-Personal or WPA2-AES:**
   * Upgrade your Wi-Fi security protocol to **WPA3-Personal (SAE)**. WPA3 provides robust protection against offline dictionary attacks even if your Wi-Fi password is simple.
   * If legacy devices require WPA2, enforce **WPA2-AES (CCMP)** only. Never select WEP, WPA, or TKIP.

### 4.2 Network Segmentation: The IoT Isolation Sandbox
Smart TVs, IP security cameras, connected refrigerators, and cheap smart plugs frequently run outdated, unpatched Linux firmware and are prime targets for automated botnets (e.g., Mirai).

* **The Vulnerability:** If a smart light bulb on your Wi-Fi network is compromised, the attacker has unrestricted Layer-2 Ethernet access to your home network. They can execute ARP spoofing, sniff unencrypted LAN packets, and probe open ports on your Zorin OS machine.
* **The Solution:** Most modern Wi-Fi routers support a **Guest Wi-Fi Network** or **VLAN Segmentation**.
  1. Move all smart appliances, smart speakers, streaming boxes, and IoT gadgets to your router's **Guest Network**.
  2. Enable **"Guest Network Isolation"** (blocks guest devices from communicating with local network computers).
  3. Keep only your trusted personal devices (Zorin OS PC, Android smartphone, home NAS) on your primary, encrypted Wi-Fi network.

### 4.3 The Golden Rule of Remote Access: Never Port-Forward Zorin Connect
> [!CAUTION]
> **CRITICAL SECURITY PROSCRIPTION:**  
> **NEVER configure port forwarding for ports 1714:1764 or 1739 on your home router!**  
> Forwarding these ports directly to the public internet exposes your desktop's KDE Connect daemon to global internet crawlers (Shodan, Censys) and automated exploitation bots.  
> 
> If you require remote control outside your home, **ONLY utilize an encrypted WireGuard mesh VPN (Tailscale)** as detailed in Deliverable 04. Tailscale maintains an outbound-only, authenticated, end-to-end encrypted cryptographic tunnel that leaves zero open ports visible to the public internet.

---

## 5. Android Mobile Client Hardening

The smartphone in your pocket is the physical key to your Zorin OS desktop. Apply these security measures to harden your Android handset:

1. **Enforce Strong Screen Locks & Biometrics:**
   * Avoid simple 4-digit PINs or pattern swipes.
   * Enforce a complex 6+ digit alphanumeric passphrase combined with biometric fingerprint or facial authentication.
2. **Disable USB Debugging When Not in Use:**
   * Navigate to **Settings → Developer options**.
   * Toggle **USB Debugging** to **Off**.
   * Leaving USB debugging active makes your device vulnerable to physical extraction, juice-jacking attacks at public USB charging kiosks, and unauthorized ADB shell injection.
3. **Audit App Permissions Periodically:**
   * Review which apps have access to **Accessibility Services**, **Notification Access**, and **Special App Access**.
   * Ensure that only trusted system tools (like Zorin Connect) hold notification listening privileges.
4. **Enable Android Private DNS (DNS-over-TLS):**
   * On your phone, open **Settings → Network & internet → Private DNS**.
   * Select **Private DNS provider hostname**.
   * Enter: `dns.quad9.net` (for automatic malware and phishing domain blocking) or `one.one.one.one`.
5. **App Sourcing Integrity:**
   * Install applications exclusively from the Google Play Store or verified [F-Droid](https://f-droid.org) repositories.
   * Never install modified, pirated, or "cracked" APK files from random internet forums, as they frequently carry remote access trojans (RATs).

---

## 6. Comprehensive Security Audit Checklist

Use this actionable checklist to audit and verify your entire security posture:

| Domain | Security Control | Verification Command / Check | Recommended State | Status |
|:---|:---|:---|:---|:---:|
| **Firewall** | UFW Inbound Default | `sudo ufw status verbose` | Default: `deny (incoming)` | [PASS] |
| **Firewall** | Restricted IP Binding | `sudo ufw status &#124; grep 1714` | Allowed only from phone IP (`192.168.1.82`) | [PASS] |
| **Permissions** | Private Key Permissions | `ls -l ~/.config/gsconnect/private.pem` | `-rw-------` (Permissions: `600`) | [PASS] |
| **Commands** | No Root / Sudo Escalation | `grep -i "NOPASSWD" /etc/sudoers /etc/sudoers.d/*` | Zero entries granting sudo to Zorin Connect | [PASS] |
| **Files** | File Transfer Quarantine | Zorin Connect Settings → Receive Files | Set to `~/Downloads/ZorinConnect_Quarantine` | [PASS] |
| **Travel** | NetworkManager Trust Gate | `ls -l /etc/NetworkManager/dispatcher.d/` | Auto-disable script enabled for public Wi-Fi | [PASS] |
| **Kernel** | Sysctl Spoofing Protection | `sysctl net.ipv4.conf.all.rp_filter` | Value: `1` (Strict Reverse Path Filtering) | [PASS] |
| **DNS** | DNS over TLS (DoT) | `resolvectl status &#124; grep "DNSOverTLS"` | Value: `yes` (Quad9 / Cloudflare encrypted) | [PASS] |
| **Router** | Wi-Fi Protocol Security | Check Router Wi-Fi Settings | `WPA3-Personal (SAE)` or `WPA2-AES` | [PASS] |
| **Router** | Wi-Fi Protected Setup | Check Router Wireless Settings | `WPS: Disabled` | [PASS] |
| **Router** | UPnP Port Punching | Check Router Firewall / NAT Settings | `UPnP: Disabled` | [PASS] |
| **Router** | WAN Remote Management | Check Router Administration Settings | `Remote WAN Access: Disabled` | [PASS] |
| **Network** | IoT Device Segmentation | Check Router Client List / Subnets | Smart devices on isolated Guest Network / VLAN | [PASS] |
| **Mobile** | USB Debugging Status | Android Settings → Developer Options | `USB Debugging: Disabled` | [PASS] |
| **Mobile** | Private DNS Protection | Android Settings → Network → Private DNS | Set to `dns.quad9.net` | [PASS] |
| **WAN Access** | Zero Port Forwarding | Check Router Port Forwarding Rules | Ports `1714:1764` NOT forwarded to WAN | [PASS] |


---

<a id="doc-8-zorin-connect-complete-user-guide"></a>
<!-- ====================================================================== -->
<!-- FILE: zorin-connect-complete-user-guide.md (Sequence: 08 of 08) -->
<!-- ====================================================================== -->

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
| **Display** | Blank Monitors | `Screens Off` | `sh -c "sleep 0.5 && (wlopm --off &#124;&#124; xset dpms force off)"` |
| **Audio** | Toggle Mute | `Mute Audio` | `pactl set-sink-mute @DEFAULT_SINK@ toggle` |
| **Audio** | Volume +5% | `Volume +5%` | `pactl set-sink-volume @DEFAULT_SINK@ +5%` |
| **Audio** | Volume -5% | `Volume -5%` | `pactl set-sink-volume @DEFAULT_SINK@ -5%` |
| **Audio** | Kill Media | `Stop Media` | `sh -c "pkill -f vlc &#124;&#124; pkill -f spotify &#124;&#124; playerctl pause"` |
| **Apps** | Open Terminal | `Terminal` | `gnome-terminal` (or `xfce4-terminal`) |
| **Apps** | Open Files | `File Manager` | `nautilus ~` |
| **Apps** | Empty Trash | `Empty Trash` | `rm -rf ~/.local/share/Trash/files/*` |
| **Alerts** | Push PC IP | `Check PC IP` | `sh -c "notify-send 'PC IP' \"\$(hostname -I &#124; awk '{print \$1}')\""` |
| **Alerts** | Check CPU Temp | `CPU Temp` | `sh -c "notify-send 'CPU Temp' \"\$(sensors &#124; grep -E 'Package id 0&#124;Tctl' &#124; awk '{print \$2,\$3,\$4}')\""` |
| **Alerts** | Check Storage | `Disk Space` | `sh -c "notify-send 'Disk' \"\$(df -h / &#124; awk 'NR==2 {print \$4 \\\" free\\\"}')\""` |

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
| **Infinite "Searching for devices" on both screens** | Host firewall (UFW) blocking incoming UDP/TCP discovery packets | `sudo ufw status &#124; grep 1714` | Run `sudo ufw allow 1714:1764/udp && sudo ufw allow 1714:1764/tcp && sudo ufw reload` |
| **Devices on same Wi-Fi cannot see each other** | Router has "AP Isolation" or "Guest Network" isolation enabled | Try pinging phone IP from Linux: `ping -c 3 <phone-ip>` | Log into router admin portal; disable "AP Isolation" or "Client Isolation"; move off Guest Wi-Fi |
| **Zorin OS inside Virtual Machine (VM) won't discover phone** | VM is using NAT networking instead of Bridged mode | Check VM IP: `ip -br a` (starts with `10.0.2.x` instead of `192.168.1.x`) | Change VM network adapter in VirtualBox/VMware/KVM from **NAT** to **Bridged Adapter** |
| **"Pairing rejected" or cryptographic handshake failure** | Corrupted X.509 certificate or system clock skew | `timedatectl status` (check NTP sync) | Verify time synchronization (`sudo timedatectl set-ntp on`); delete old certs in `~/.config/gsconnect/` and re-pair |
| **Trackpad pointer stutters or lags noticeably** | 2.4 GHz RF congestion or Wi-Fi power saving on Linux NIC | `iwconfig &#124; grep "Power Management"` | Turn off Wi-Fi power saving: `sudo iwconfig wlan0 power off`; switch devices to 5 GHz or 6 GHz Wi-Fi band |
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
| **Firewall** | Restricted IP Binding | `sudo ufw status &#124; grep 1714` | Allowed only from phone IP (`192.168.1.82`) | [PASS] |
| **Permissions** | Private Key Permissions | `ls -l ~/.config/gsconnect/private.pem` | `-rw-------` (Permissions: `600`) | [PASS] |
| **Commands** | No Root / Sudo Escalation | `grep -i "NOPASSWD" /etc/sudoers /etc/sudoers.d/*` | Zero entries granting sudo to Zorin Connect | [PASS] |
| **Files** | File Transfer Quarantine | Zorin Connect Settings → Receive Files | Set to `~/Downloads/ZorinConnect_Quarantine` | [PASS] |
| **Travel** | NetworkManager Trust Gate | `ls -l /etc/NetworkManager/dispatcher.d/` | Auto-disable script enabled for public Wi-Fi | [PASS] |
| **Kernel** | Sysctl Spoofing Protection | `sysctl net.ipv4.conf.all.rp_filter` | Value: `1` (Strict Reverse Path Filtering) | [PASS] |
| **DNS** | DNS over TLS (DoT) | `resolvectl status &#124; grep "DNSOverTLS"` | Value: `yes` (Quad9 / Cloudflare encrypted) | [PASS] |
| **Router** | Wi-Fi Protocol Security | Check Router Wi-Fi Settings | `WPA3-Personal (SAE)` or `WPA2-AES` | [PASS] |
| **Router** | Wi-Fi Protected Setup | Check Router Wireless Settings | `WPS: Disabled` | [PASS] |
| **Router** | UPnP Port Punching | Check Router Firewall / NAT Settings | `UPnP: Disabled` | [PASS] |
| **Router** | WAN Remote Management | Check Router Administration Settings | `Remote WAN Access: Disabled` | [PASS] |
| **Network** | IoT Device Segmentation | Check Router Client List / Subnets | Smart devices on isolated Guest Network / VLAN | [PASS] |
| **Mobile** | USB Debugging Status | Android Settings → Developer Options | `USB Debugging: Disabled` | [PASS] |
| **Mobile** | Private DNS Protection | Android Settings → Network → Private DNS | Set to `dns.quad9.net` | [PASS] |
| **WAN Access** | Zero Port Forwarding | Check Router Port Forwarding Rules | Ports `1714:1764` NOT forwarded to WAN | [PASS] |

