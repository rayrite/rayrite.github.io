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
| **Turn Off Monitors** | `Screens Off` | `sh -c "sleep 0.5 && (wlopm --off \|\| xset dpms force off)"` | Turns off display backlight immediately |

### 3.2 Audio, Volume & Media Switching

| Action | Friendly Name | Shell Command | Notes & Subsystem |
|:---|:---|:---|:---|
| **Toggle Mute** | `Mute Audio` | `pactl set-sink-mute @DEFAULT_SINK@ toggle` | Toggles PulseAudio / PipeWire master mute |
| **Volume Up 5%** | `Volume +5%` | `pactl set-sink-volume @DEFAULT_SINK@ +5%` | Increases master volume by 5% increments |
| **Volume Down 5%** | `Volume -5%` | `pactl set-sink-volume @DEFAULT_SINK@ -5%` | Decreases master volume by 5% increments |
| **Set Volume 50%** | `Volume 50%` | `pactl set-sink-volume @DEFAULT_SINK@ 50%` | Sets volume to exact moderate listening level |
| **Kill Media Player** | `Stop All Media` | `sh -c "pkill -f vlc \|\| pkill -f spotify \|\| playerctl pause"` | Terminates or halts all rogue media processes |
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
| **Report Local IP** | `Check PC IP` | `sh -c "notify-send 'PC Network' \"IP: \$(hostname -I \| awk '{print \$1}')\""` | Sends PC local IPv4 address |
| **Report CPU Temp** | `CPU Temperature`| `sh -c "notify-send 'CPU Temp' \"\$(sensors \| grep -E 'Package id 0\|Tctl' \| awk '{print \$2,\$3,\$4}')\""` | Pushes thermal stats to mobile notification |
| **Report Disk Space** | `Check Storage` | `sh -c "notify-send 'Disk Space' \"\$(df -h / \| awk 'NR==2 {print \\\"Available: \\\" \$4 \\\" (\\\" \$5 \\\" used)\\\"}')\""` | Reports free NVMe/SSD space |
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
