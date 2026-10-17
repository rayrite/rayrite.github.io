# OpenMonoAgent.ai — Mobile App & Android Remote Control Guide
**Target System:** PowerSpec G914 Gaming PC (AMD Ryzen 9 9950X3D · RTX 5090 32GB GDDR7 · Zorin OS 18.1)  
**Mobile Client:** OpenMono Official Android App (`ai.openmonoagent.app` on Google Play Store)  
**Connectivity Modes:** Outbound Relay Tunnel (Global WAN) · Direct Wi-Fi LAN · Encrypted Mesh VPN  
**Document Series:** Deliverable 04 of 05  

---

## 1. The "Dual-Box" Mobile Architecture

The official **OpenMono Mobile App** (`ai.openmonoagent.app`) transforms your Android cell phone into a secure, portable control center for your PowerSpec G914 gaming PC. 

Rather than running an underpowered, quantized model on mobile hardware, OpenMono implements a distributed **Dual-Box Architecture**:
* **The Compute Engine (Home):** Your PowerSpec G914 running Zorin OS 18.1 executes the high-throughput `llama.cpp` inference server (75–80 tok/s on the RTX 5090), the full .NET 10 Roslyn compiler, Docker sandboxing, and web search gateways.
* **The Command Surface (Mobile):** Your Android phone connects to the host over encrypted channels, streaming real-time tokens, inspecting code diffs, attaching camera screenshots for vision reasoning, and gating tool permissions.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        OPENMONO MOBILE DUAL-BOX ARCHITECTURE                           │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                        │
│  [ ANDROID SMARTPHONE ]                                                                │
│  Package: `ai.openmonoagent.app`                                                       │
│  Features: Streaming SSE Chat · Diff Viewer · Permission Gating · Camera / Vision      │
│        │                                                    │                          │
│        │ (Option 1: Global Cellular WAN)                    │ (Option 2: Home Wi-Fi)   │
│        │ Outbound HTTPS / WSS                               │ Direct Subnet HTTP       │
│        ▼                                                    ▼                          │
│  ┌────────────────────────────────────┐             ┌───────────────────────────────┐  │
│  │ OpenMono Relay Service             │             │ Qualcomm Wi-Fi 7 / 5GbE LAN   │  │
│  │ `relay.openmonoagent.ai:<port>`    │             │ `http://192.168.1.xxx:7474`   │  │
│  │ (Bypasses Home NAT & CGNAT)        │             │ (Sub-millisecond LAN Latency) │  │
│  └─────────────────┬──────────────────┘             └───────────────┬───────────────┘  │
│                    │                                                │                  │
│                    │ Reverse Tunnel Connection (frpc)               │ Direct Port      │
│                    ▼                                                ▼                  │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │                     POWERSPEC G914 INFERENCE & AGENT RIG                         │  │
│  │                                                                                  │  │
│  │  • Caddy Multi-Service Gateway (:47480) [Bearer Token Protected]                 │  │
│  │  • llama-server (:7474) [RTX 5090 32GB GDDR7 · Qwen3.8-27B · mmproj Vision]     │  │
│  │  • ACP Background Server (:7475) [Session Store & Tool Pipeline]                 │  │
│  │  • Docker Workspace Sandbox [Bind-mounted project filesystem]                    │  │
│  └──────────────────────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Choosing Your Remote Connection Method

You can connect your Android smartphone to your PowerSpec G914 using any of three connection methods:

### Method A: Outbound Relay Tunnel (Recommended for Global Anywhere Access)
* **Best For:** Controlling your agent when away from home over 5G/LTE cellular or external Wi-Fi.
* **Mechanism:** The PowerSpec G914 opens an **outbound-only** reverse tunnel using `frpc` to the OpenMono relay cluster (`relay.openmonoagent.ai`).
* **Security & Network Traversal:** Because the connection is outbound from your PC, **no router ports need to be opened**, no dynamic DNS is required, and it functions seamlessly behind Carrier-Grade NAT (CGNAT) and strict firewalls. Traffic is protected by your secret `LLAMA_API_KEY`.

### Method B: Direct Local Wi-Fi LAN (Ultra-Low Latency Home Mode)
* **Best For:** Controlling the agent from your couch, backyard, or local network.
* **Mechanism:** The phone connects directly to your PC's local IP address (e.g. `http://192.168.1.150:7474` or Caddy gateway `:47480`).
* **Performance:** Completely circumvents the internet. Zero external data usage, maximum throughput, and sub-millisecond network latency over the G914's WiFi 7 / 5GbE connection.

### Method C: Encrypted Mesh VPN (Tailscale / WireGuard)
* **Best For:** Developers who want peer-to-peer encrypted remote networking without utilizing any shared relay infrastructure.
* **Mechanism:** Both Zorin OS 18.1 and your Android phone join a private Tailscale tailnet. The phone reaches the G914 via its private 100.x.y.z IP address.

---

## 3. Step-by-Step Android Setup & Pairing Walkthrough

### Step 3.1: Install the Android Application
1. Open the **Google Play Store** on your Android phone.
2. Search for **`OpenMono: AI Coding Agent`** (or access package identifier: `ai.openmonoagent.app`).
3. Tap **Install** and open the application.

### Step 3.2: Configure the PowerSpec G914 for Remote Tunneling
On your PowerSpec G914 running Zorin OS 18.1, initialize the tunnel subsystem:

```bash
openmono tunnel setup
```

The terminal will prompt you for your email address and generate a 6-digit One-Time Passcode (OTP):
```text
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  OpenMono.ai — Relay Tunnel Setup
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Enter your email address: developer@example.com
  Requesting verification code...
  Verification code sent.

  Enter the 6-digit verification code: 849201
  ✓ Authenticated as developer@example.com
  ✓ Assigned relay port: 38472
  ✓ Tunnel configured and frpc service generated.
```

Start the background tunnel daemon:
```bash
openmono tunnel start
```

Retrieve your connection credentials:
```bash
# Print active connection parameters
openmono tunnel status
```
*Output:*
```text
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Inference Box Connection Details
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Target Endpoint:  http://relay.openmonoagent.ai:38472
  LLAMA API Key:    sk-oma-9f82d1c74a0e4b8593
  Local Target:     127.0.0.1:47480 (Caddy Gateway)
  Status:           Online (Active Tunnel)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

*(Note: For Local Wi-Fi Mode, run `hostname -I` on Zorin OS to find your local IP, e.g. `192.168.1.150`, and use `http://192.168.1.150:47480`).*

### Step 3.3: Pair the Android Phone
1. Open the OpenMono app on Android.
2. On the **Server Configuration** screen, enter:
   * **Server Endpoint:** `http://relay.openmonoagent.ai:38472` (or your local IP for LAN mode).
   * **API Key:** `sk-oma-9f82d1c74a0e4b8593` (copied from the host terminal or welcome email).
   * **Friendly Rig Name:** `G914-RTX5090`.
3. Tap **Test Connection & Connect**.
4. The status indicator will turn green:  
   `✓ Connected to Qwen3.8-27B on RTX 5090 (196k context)`.

---

## 4. Mobile Application Interface Tour

The Android interface is specifically engineered for software engineering workflows on touchscreens:

```
┌────────────────────────────────────────────────────────┐
│ ≡  G914-RTX5090  [Online • 78.2 tok/s]           ⚙   │
├────────────────────────────────────────────────────────┤
│ Session: mobile-triage-4491                            │
│ Workspace: /home/cooly/projects/ecommerce-core         │
│ Context Window: [■■□□□□□□□□] 18.2k / 196k              │
├────────────────────────────────────────────────────────┤
│ ◈ Thinking (248 tokens) [Tap to expand]                │
│                                                        │
│ OpenMono:                                              │
│ I analyzed `PaymentService.cs` using Roslyn. Three     │
│ methods are missing cancellation tokens. Proposing     │
│ the following fix:                                     │
│                                                        │
│ ┌─ Unified Diff: PaymentService.cs ──────────────────┐ │
│ │ @@ -42,7 +42,7 @@                                 │ │
│ │ - public async Task Charge(CreditCard card)        │ │
│ │ + public async Task Charge(CreditCard card,        │ │
│ │ +                          CancellationToken ct)   │ │
│ └────────────────────────────────────────────────────┘ │
│                                                        │
│ ⚠️ PERMISSION REQUEST                                   │
│ Tool: FileEdit on 'src/Services/PaymentService.cs'     │
│                                                        │
│ [ ALLOW ONCE ]   [ ALLOW SESSION ]   [ DENY ]          │
├────────────────────────────────────────────────────────┤
│ [📷 Camera] [📎 File] [/ Commands]                    │
│ Type a message or task...                            ▲ │
└────────────────────────────────────────────────────────┘
```

* **Streaming Token Feed:** Tokens render in real time with low latency.
* **Syntax-Highlighted Diff Cards:** Code diffs are rendered with green additions and red deletions, optimized for mobile viewing.
* **Touch Permission Approvals:** When OpenMono invokes a gated tool (`FileEdit`, `FileWrite`, `Bash`), action buttons allow you to inspect the payload and approve or deny execution.
* **Camera & Attachment Integration:** Tap the camera icon to capture photos of whiteboard diagrams or UI bugs and upload them directly to the multimodal vision encoder.

---

## 5. Five Detailed Real-World Remote Control Examples

The following scenarios demonstrate real-world usage of OpenMono from an Android phone, connecting to the PowerSpec G914 at home.

---

### Example 1: On-the-Go Code Review & Architecture Blast-Radius Triage
* **Scenario:** You are away from your desk and need to assess the risk of modifying a shared utility method in your C# backend.

#### Action on Android Phone:
In the chat bar, enter:
```
Analyze the symbol 'TokenService.ValidateSignature' in src/Security/TokenService.cs. Use Roslyn to tell me every caller in the solution and calculate the blast radius before we touch it.
```

#### What Happens on the PowerSpec G914:
1. The request streams to the G914.
2. The agent executes the built-in `Roslyn` tool with the action `blast-radius`.
3. The AdhocWorkspace scans all project assemblies in RAM.

#### Output Streamed to Android Screen:
```text
→ Tracing symbol: TokenService.ValidateSignature(string token)
→ Roslyn Semantic Analysis Complete:

Direct Call Sites (4):
  1. src/Middleware/JwtAuthMiddleware.cs (Line 38)
  2. src/Controllers/WebhookController.cs (Line 92)
  3. src/Services/SessionManager.cs (Line 114)
  4. tests/SecurityTests/TokenTests.cs (Line 55)

Transitive Dependency Radius:
  • 12 downstream controllers depend on JwtAuthMiddleware.
  • WebhookController feeds payment ingestion.

Risk Verdict: HIGH
Any signature change requires updating 4 call sites and will affect authentication across all 12 API controllers.
```
*Developer Benefit:* You evaluate architectural risk from your phone before agreeing to a refactoring request.

---

### Example 2: Multimodal Camera / Screenshot UI Bug Diagnosis
* **Scenario:** You are reviewing a mobile web page on your Android phone and spot a broken layout. You take a screenshot and ask OpenMono to locate and fix the CSS bug in the repository.

#### Action on Android Phone:
1. Take a screenshot on your Android device (`Power + Volume Down`).
2. Tap the **📎 Attachment** icon in the OpenMono app and select the screenshot.
3. The app uploads the image as `@screenshot.png` to the G914's vision staging directory.
4. Enter the prompt:
   ```
   @screenshot.png Look at this screenshot of the navbar on mobile view. The hamburger menu is overlapping the logo and the cart icon is pushed off-screen. Find the stylesheet responsible in wwwroot/css and fix the responsive flexbox rules.
   ```

#### What Happens on the PowerSpec G914:
1. The G914 CLI compresses the image using SkiaSharp to fit the vision token budget (~1,100 tokens).
2. The multimodal projector (`mmproj-qwen3.8-27B-F16.gguf`) processes the image on the RTX 5090.
3. The model identifies the layout defect: `navbar-nav` has `flex-wrap: nowrap` and an explicit `min-width: 600px` that fails on mobile viewports under 480px.
4. The agent uses `Grep` to find `.navbar-nav` in `wwwroot/css/site.css` and generates a patch.

#### Output Streamed to Android Screen:
```text
→ Vision Analysis: Detected navbar overflow at <480px width.
→ Located style definition in wwwroot/css/site.css: Line 114.
→ Proposed Patch:

--- wwwroot/css/site.css
+++ wwwroot/css/site.css
@@ -114,3 +114,7 @@
-.navbar-nav { display: flex; flex-wrap: nowrap; min-width: 600px; }
+.navbar-nav { display: flex; flex-wrap: wrap; justify-content: space-between; }
+@media (max-width: 480px) {
+  .navbar-nav { flex-direction: column; width: 100%; }
+}

[PERMISSION REQUIRED] Allow FileEdit on 'wwwroot/css/site.css'?
```
5. You tap **[ALLOW ONCE]** on your phone screen. The file updates on the G914 NVMe SSD instantly.

---

### Example 3: Running & Gating an Automated Release Playbook
* **Scenario:** You are attending a meeting and need to trigger a staging release, verify the unit test suite, and approve the git release tag from your phone.

#### Action on Android Phone:
In the chat bar, enter:
```
/playbook release --version-type patch
```

#### What Happens on the PowerSpec G914:
1. OpenMono loads `.openmono/playbooks/release/PLAYBOOK.md`.
2. Step 1: Runs `git status` to ensure working tree is clean.
3. Step 2: Executes `dotnet test --configuration Release` inside the Docker sandbox.
4. The 32 threads of the Ryzen 9 9950X3D compile and execute 420 unit tests in 4.2 seconds.
5. All tests pass. The playbook hits Step 3: `gate: confirm`.

#### Notification on Android Screen:
Your phone vibrates with an interactive modal:
```text
╔════════════════════════════════════════════════════════╗
║  PLAYBOOK GATE: release v1.4.3                        ║
╠════════════════════════════════════════════════════════╣
║  • 420 Unit Tests Passed in 4.2s                       ║
║  • Version bumped: 1.4.2 → 1.4.3                      ║
║  • Target Tag: release/v1.4.3                          ║
║                                                        ║
║  Proceed with Git Tag and Push to Origin?              ║
║                                                        ║
║         [ APPROVE RELEASE ]      [ ABORT ]             ║
╚════════════════════════════════════════════════════════╝
```
6. Tap **[APPROVE RELEASE]**.
7. The agent completes the final steps: tags the commit, pushes to remote origin, and streams the confirmation message back to your phone.

---

### Example 4: Test-Driven Refactoring with Mobile Interactive Permission Prompts
* **Scenario:** You want OpenMono to refactor a blocking database repository into an asynchronous implementation and prove correctness by executing the test suite.

#### Action on Android Phone:
Enter the prompt:
```
Refactor UserRepository.cs to replace synchronous DbContext calls with async/await equivalents (e.g. ToListAsync, FirstOrDefaultAsync). Then run the test suite to make sure nothing broke.
```

#### Interaction Flow:
1. **Agent Turn 1:** OpenMono calls `FileRead` on `src/Data/UserRepository.cs`. (Auto-allowed).
2. **Agent Turn 2:** OpenMono inspects Entity Framework imports and rewrites the repository methods using `FileEdit`.
3. **Mobile Screen Alert:**
   ```text
   Permission Gate: FileEdit
   File: src/Data/UserRepository.cs
   Replaced 6 synchronous calls with Task/Async equivalents.
   ```
   Tap **[ALLOW ONCE]**.
4. **Agent Turn 3:** OpenMono prepares to execute the unit tests via `Bash`:
   ```bash
   dotnet test --filter Category=RepositoryTests
   ```
5. **Mobile Screen Alert:**
   ```text
   Permission Gate: Bash Command
   Command: dotnet test --filter Category=RepositoryTests
   ```
   Tap **[ALLOW ONCE]**.
6. The test execution streams live on your Android screen:
   ```text
   Starting test execution, please wait...
   Passed! - Failed: 0, Passed: 28, Skipped: 0, Total: 28, Duration: 820 ms.
   ✓ Refactor complete. 28 repository tests passing.
   ```

---

### Example 5: Background Long-Running Build Monitoring & Emergency Kill Switch
* **Scenario:** You start a large container rebuild or comprehensive benchmark suite on the G914 before heading out, and monitor progress while in transit.

#### Action on Android Phone:
From your phone:
```
Run 'docker compose build --no-cache' and keep me updated on progress.
```

#### Monitoring on Phone:
* As Docker builds layers on Zorin OS, the build logs stream to your mobile screen.
* You can check system load at any time by typing `/status`:
  ```text
  Turn: 4 • Tokens: 12,410 • Speed: 78.5 tok/s • Context: 16k/196k
  Host: CPU 38% • RTX 5090 VRAM: 18.2GB / 32GB • Temps: 42°C
  ```

#### Emergency Kill Switch:
If you notice an unexpected recursive script or failing build loop:
* Tap the red **[STOP TURN]** button in the top navigation bar (equivalent to double-tapping `Ctrl+C`).
* The agent halts container execution immediately.
* Type `/undo 1` to revert any tentative file changes back to the pre-build checkpoint.

---

## 6. Android Power Management & Security Best Practices

To ensure reliable remote operation from your smartphone:

### 6.1 Disable Android Battery Optimization for OpenMono
Modern Android operating systems (Android 14, 15, 16) aggressively sleep background apps, which can drop active Server-Sent Events (SSE) connections:
1. Open Android **Settings** → **Apps** → **OpenMono**.
2. Tap **App Battery Usage** (or Battery).
3. Select **Unrestricted**. This ensures background tasks continue streaming even when your phone screen turns off.

### 6.2 Lock Screen Security & Biometrics
Because OpenMono has write and shell execution capabilities within your workspace container:
1. In the OpenMono app, tap **Settings (⚙)**.
2. Enable **Require Biometric Authentication**.
3. The app will require your fingerprint or face scan whenever returning from the background before accepting permission approval taps.

### 6.3 Emergency Remote Tunnel Shutdown
If you lose your phone or suspect unauthorized access:
On the PowerSpec G914 terminal, run:
```bash
# Terminate the tunnel instantly
openmono tunnel stop

# Rotate your API key
openmono config set llm.api_key $(openssl rand -hex 24)
```
This drops all active relay tunnels immediately, cutting external access until you re-authenticate.
