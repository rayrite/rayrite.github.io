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
