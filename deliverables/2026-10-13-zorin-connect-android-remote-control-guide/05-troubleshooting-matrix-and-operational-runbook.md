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
