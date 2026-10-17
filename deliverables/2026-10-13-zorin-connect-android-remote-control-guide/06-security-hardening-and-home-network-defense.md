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
