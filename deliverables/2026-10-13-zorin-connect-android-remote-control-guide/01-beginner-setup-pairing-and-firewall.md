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
