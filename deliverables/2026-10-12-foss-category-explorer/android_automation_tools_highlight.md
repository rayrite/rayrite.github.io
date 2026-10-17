# Android Automation & Device Control — FOSS Tools Intelligence Dossier

> **Catalog Date**: 2026-10-12  
> **Primary Source**: `inputs/foss_toolcatalogs/ytgithurepos_20261012.html`  
> **Interactive App**: [`index.html`](file:///d:/stuff/ai-misc/_bsh2026/vscode_project01/46-wide_research_test_gemini/deliverables/2026-10-12-foss-category-explorer/index.html)  
> **Category Alignment**: Taxonomy Category 12 (*Browser Control / Browser Automation / Android Emulator Control*) & Mobile Agent Ecosystem

## Executive Summary

Within the October 12, 2026 FOSS catalog snapshot, mobile and Android automation represents one of the fastest evolving frontiers. The tooling has evolved significantly beyond conventional headless scrapers and static Appium test suites, branching into **six distinct technical paradigms**:
1. **Autonomous Phone Agents (Vision & GUI-Action Models)**: Multimodal models (Qwen-VL, AutoGLM) that observe raw mobile screens, plan multi-step workflows, and execute autonomous taps, swipes, and text input.
2. **High-Performance Screen Mirroring & Low-Latency Controllers**: Desktop and web applications utilizing `scrcpy` and custom ADB video streams to enable real-time device interaction.
3. **Multi-Device Parallel ADB Automation**: Orchestration layers that broadcast scripted interactions across farm deployments of physical Android devices via ADB.
4. **Model Context Protocol (MCP) Mobile Drivers**: Dedicated MCP servers exposing native Android UI trees, input injection, and screenshot feeds directly to coding agents like Claude Code, Codex, and Cursor.
5. **Virtual Phone & Research Emulator Workstations**: CLI and GUI utilities orchestrating virtualized mobile environments for sandboxed testing and automated security verification.
6. **Rootless System Bridges & APK Reverse Engineering**: Automation tools leveraging Shizuku and agent skill packs to decompile, inspect, and automate apps without requiring root privileges.

## Master Android Automation Tools Matrix

| Tool Name | Repository | Category Cluster | Language | Stars | License | Attached Keywords | Provenance / Channel |
|:---|:---|:---|:---|:---:|:---:|:---|:---|
| **Open-AutoGLM** | [zai-org/Open-AutoGLM](https://github.com/zai-org/Open-AutoGLM) | Autonomous Phone Agents & Vision... | Python | 25.0k | Apache-2.0 | mobile-development, automation, ai-ag... | ManuAGI - AutoGPT Tuto... |
| **escrcpy** | [viarotel-org/escrcpy](https://github.com/viarotel-org/escrcpy) | Device Mirroring & Screen Contro... | JavaScript | 9.3k | Apache-2.0 | mobile-development, automation, netwo... | ManuAGI - AutoGPT Tuto... |
| **gelab-zero** | [stepfun-ai/gelab-zero](https://github.com/stepfun-ai/gelab-zero?tab=readme-ov-file#-application-demonstrations) | Autonomous Phone Agents & Vision... | Python | 2.3k | MIT | automation, benchmark, python, agent,... | Cooly |
| **DroidDesk** | [orailnoor/DroidDesk](https://github.com/orailnoor/DroidDesk) | Virtual Environments & Termux Au... | Shell | 2.2k | FOSS | — | Github Awesome |
| **agent-device** | [callstackincubator/agent-device](https://github.com/callstackincubator/agent-device) | Cross-Platform Mobile CLI & Test... | TypeScript | 1.8k | MIT | automation, ai-agents, cli, testing, ... | Github Awesome |
| **PhoneDriver** | [OminousIndustries/PhoneDriver](https://github.com/OminousIndustries/PhoneDriver) | Autonomous Phone Agents & Vision... | Python | 1.5k | Apache-2.0 | mobile-development, automation, progr... | Github Awesome |
| **droidclaw** | [unitedbyai/droidclaw](https://github.com/unitedbyai/droidclaw) | Autonomous Phone Agents & Vision... | TypeScript | 1.4k | FOSS | mobile-development, automation, ai-ag... | Github Awesome |
| **shuo** | [NickTikhonov/shuo](https://github.com/NickTikhonov/shuo) | Autonomous Phone Agents & Vision... | Python | 636 | FOSS | python-ecosystem, 2d-graphics, educat... | ManuAGI - AutoGPT Tuto... |
| **another** | [Zfinix/another](https://github.com/Zfinix/another) | Device Mirroring & Screen Contro... | Rust | 552 | MIT | automation, rust, mcp, android, alter... | Github Awesome |
| **android-testing-skills** | [skydoves/android-testing-skills](https://github.com/skydoves/android-testing-skills) | Android Testing & ADB Skills | Shell | 276 | Apache-2.0 | — | Github Awesome |
| **Social-Media-Automation** | [bravocw/Social-Media-Automation](https://github.com/bravocw/Social-Media-Automation) | Multi-Device ADB Batch Automation | — | 0 | FOSS | electron, automation, nodejs, android | ig_scraper |
| **mobile-mcp** | [mobile-next/mobile-mcp](https://github.com/mobile-next/mobile-mcp) | Model Context Protocol (MCP) Mob... | — | 0 | FOSS | automation, ai-agents, mcp, testing, ... | ManuAGI - AutoGPT Tuto... |
| **qapilot-mcp-for-android** | [qapilot.io/qapilot-mcp-for-android](https://qapilot.io/mcp/guide?ref=manuagi) | Model Context Protocol (MCP) Mob... | — | 0 | FOSS | automation, mcp, testing, android, mo... | ManuAGI - AutoGPT Tuto... |
| **mobile-jev** | [droidrun/mobile-jev](https://github.com/droidrun/mobile-jev) | Autonomous Phone Agents & Vision... | — | 0 | FOSS | automation, ai-agents, android, nodej... | Github Awesome |
| **artemis** | [google/artemis](https://github.com/google/artemis) | Cross-Platform Mobile CLI & Test... | — | 0 | FOSS | automation, ai-agents, python, model,... | Github Awesome |
| **e2e** | [tester-army/e2e](https://github.com/tester-army/e2e) | Android Testing & ADB Skills | — | 0 | FOSS | automation, ai-agents, testing, devto... | Full Stack |
| **goldie** | [kacperkapusciak/goldie](https://github.com/kacperkapusciak/goldie) | Cross-Platform Mobile CLI & Test... | — | 0 | FOSS | automation, cli, android, tools, video | Github Awesome |
| **phone-harness** | [ShawnPana/phone-harness](https://github.com/ShawnPana/phone-harness) | Autonomous Phone Agents & Vision... | — | 0 | FOSS | automation, ai-agents, python, agent,... | Github Awesome |
| **tapflow** | [jo-duchan/tapflow](https://github.com/jo-duchan/tapflow) | Device Mirroring & Screen Contro... | — | 0 | FOSS | mcp, android, streaming, self-hosted,... | Github Awesome |
| **apk-reverse** | [newliver666/apk-reverse](https://github.com/newliver666/apk-reverse) | Security & APK Inspection Automa... | — | 0 | FOSS | agent, developer-tools, android | ig_scraper |
| **shizzi** | [carlelieser/shizzi](https://github.com/carlelieser/shizzi) | Rootless System & Bridge Automation | — | 0 | FOSS | proxy, go, android, mobile, apple-sil... | ig_scraper |
| **Teardroid-v4** | [Adi1717/Teardroid-v4](https://github.com/Adi1717/Teardroid-v4) | Security & APK Inspection Automa... | — | 0 | FOSS | security, learning, python, android, ... | ig_scraper |
| **vphone-cli** | [Lakr233/vphone-cli](https://github.com/Lakr233/vphone-cli) | Virtual Phone & Emulator Worksta... | — | 0 | FOSS | security, devops, ios, swift, apple-s... | ManuAGI - AutoGPT Tuto... |
| **vphone-ws** | [zqxwce/vphone-ws](https://github.com/zqxwce/vphone-ws) | Virtual Phone & Emulator Worksta... | — | 0 | FOSS | devops, swiftui, tools, ios, macos | ManuAGI - AutoGPT Tuto... |

---

## Detailed Tool Profiles by Architectural Cluster

### Autonomous Phone Agents & Vision Controllers

#### 1. [Open-AutoGLM](https://github.com/zai-org/Open-AutoGLM) (`zai-org/Open-AutoGLM`)
- **Repository URL**: [https://github.com/zai-org/Open-AutoGLM](https://github.com/zai-org/Open-AutoGLM)
- **Project Homepage**: [https://autoglm.z.ai/blog](https://autoglm.z.ai/blog)
- **Primary Language**: `Python` | **Stars**: `★ 24,979` | **License**: `Apache-2.0`
- **Video Provenance**: Channel: *ManuAGI - AutoGPT Tutorials* | Video: *Top New Open-Source GitHub Projects This Week: AI, Mobile Agents & Dev Workflows #216* | Date: *2025-12-14*
- **Keywords**: `mobile-development, automation, ai-agents, programming-languages, computer-vision, education`

**Product Description Text**:
> An Open Phone Agent Model & Framework. Unlocking the AI Phone for Everyone

**Detailed Synopsis / Architectural Context**:
> Open-AutoGLM is an open-source framework and model designed to create an intelligent Phone Agent capable of automating mobile tasks. It leverages the AutoGLM model and vision-language capabilities to understand the content of a phone screen and execute complex actions. The system utilizes ADB (Android Debug Bridge) for device control, allowing it to interact with the operating system and perform operations. Users can issue natural language commands, which the agent translates into a sequence of visual perceptions, planning, and physical actions. Key features include built-in sensitive operation confirmation and remote ADB debugging for flexible control. This project aims to unlock the potential of AI for hands-free mobile interaction.


#### 2. [gelab-zero](https://github.com/stepfun-ai/gelab-zero?tab=readme-ov-file#-application-demonstrations) (`stepfun-ai/gelab-zero`)
- **Repository URL**: [https://github.com/stepfun-ai/gelab-zero?tab=readme-ov-file#-application-demonstrations](https://github.com/stepfun-ai/gelab-zero?tab=readme-ov-file#-application-demonstrations)
- **Project Homepage**: [https://opengelab.github.io/](https://opengelab.github.io/)
- **Primary Language**: `Python` | **Stars**: `★ 2,254` | **License**: `MIT`
- **Video Provenance**: Channel: *Cooly* | Video: *Cooly's Chrome Links* | Date: *2026-09-02*
- **Keywords**: `automation, benchmark, python, agent, mcp, android, framework`
- **Topics**: `agent, gui-agents, phone-use-agent, pua`

**Product Description Text**:
> GELab: GUI Exploration Lab. One of the best GUI agent solutions in the galaxy, built by the StepFun-GELab team and powered by Step’s research capabilities.

**Detailed Synopsis / Architectural Context**:
> GELab-Zero addresses the fragmented engineering challenges of deploying GUI-based mobile agents by providing a fully open-source, plug-and-play solution with both model and infrastructure. It combines a lightweight 4B GUI agent model—capable of running locally on consumer hardware for low latency and privacy—with a complete inference engineering pipeline that handles multi-device ADB management, dependency setup, task distribution, and interaction recording. The system supports three agent working modes (ReAct loops, multi-agent collaboration, and scheduled tasks), offers MCP server integration for multi-device coordination, and ships with the AndroidDaily benchmark for evaluating real-world mobile tasks. Developed by the StepFun-GELab team, it targets Agent developers seeking rapid testing of new strategies and enterprise users looking to integrate MCP capabilities without rebuilding infrastructure from scratch. Practical demonstrations span recommendations, metro queries, welfare claims, and complex multi-item grocery shopping across diverse apps and device brands.


#### 3. [PhoneDriver](https://github.com/OminousIndustries/PhoneDriver) (`OminousIndustries/PhoneDriver`)
- **Repository URL**: [https://github.com/OminousIndustries/PhoneDriver](https://github.com/OminousIndustries/PhoneDriver)
- **Primary Language**: `Python` | **Stars**: `★ 1,482` | **License**: `Apache-2.0`
- **Video Provenance**: Channel: *Github Awesome* | Video: *GitHub Trending Weekly #6: 20 New Open Source Projects on GitHub* | Date: *2025-10-19*
- **Keywords**: `mobile-development, automation, programming-languages, computer-vision, education`

**Product Description Text**:
> Android Phone Control With Qwen3-VL

**Detailed Synopsis / Architectural Context**:
> The Phone Driver is a Python-based mobile automation agent designed for controlling Android devices through visual and natural language interaction. It leverages the Qwen3-VL vision-language model to visually analyze phone screens and understand user intent. The agent integrates these visual insights with ADB commands to plan and execute complex mobile tasks. Key features include real-time feedback, a Gradio web interface for control, and the ability to process commands in plain English. By combining visual analysis with ADB integration, the system automates actions such as opening apps or changing settings on the device. This repository provides a framework for advanced, vision-powered mobile automation.


#### 4. [droidclaw](https://github.com/unitedbyai/droidclaw) (`unitedbyai/droidclaw`)
- **Repository URL**: [https://github.com/unitedbyai/droidclaw](https://github.com/unitedbyai/droidclaw)
- **Project Homepage**: [https://droidclaw.ai](https://droidclaw.ai)
- **Primary Language**: `TypeScript` | **Stars**: `★ 1,387` | **License**: `Unspecified / FOSS`
- **Video Provenance**: Channel: *Github Awesome* | Video: *GitHub Trending Weekly #25: droidclaw, micasa, Surge, BarraCUDA, NullClaw, AssppWeb, Po...* | Date: *2026-02-26*
- **Keywords**: `mobile-development, automation, ai-agents, programming-languages, education`

**Product Description Text**:
> turn old phones into ai agents - give it a goal in plain english. it reads the screen, thinks about what to do, taps and types via adb, and repeats until the job is done.

**Detailed Synopsis / Architectural Context**:
> Droidclaw is an AI agent designed to transform Android phones into functional agents capable of executing complex tasks. It operates by implementing a perception-reasoning-action loop, allowing the agent to read the screen, understand the context, and decide the next physical action. The system uses ADB commands to interact with the device, performing taps, typing, and navigation based on a plain English goal provided by the user. At its core, it leverages a Large Language Model (LLM) to process visual input and generate logical plans for execution. This approach eliminates the need for complex API integrations, enabling the agent to delegate actions using native applications like Google Search or WhatsApp. Droidclaw effectively bridges the gap between natural language instructions and physical device control.


#### 5. [shuo](https://github.com/NickTikhonov/shuo) (`NickTikhonov/shuo`)
- **Repository URL**: [https://github.com/NickTikhonov/shuo](https://github.com/NickTikhonov/shuo)
- **Primary Language**: `Python` | **Stars**: `★ 636` | **License**: `Unspecified / FOSS`
- **Video Provenance**: Channel: *ManuAGI - AutoGPT Tutorials* | Video: *Trending Open-Source Github Projects, agency-agents, ruflo, Lysium, Heretic, RuView #237* | Date: *2026-03-07*
- **Keywords**: `python-ecosystem, 2d-graphics, education, programming-languages`

**Product Description Text**:
> sub-500ms latency phone agent orchestration

**Detailed Synopsis / Architectural Context**:
> Shuo is a Python-based voice agent framework designed for sub-500ms latency phone agent orchestration. It provides a complete pipeline for real-time voice interaction, integrating Speech-to-Text (Deepgram Flux), Large Language Models (LLM), and Text-to-Speech (TTS). The system uses two core abstractions—Deepgram Flux for turn detection and a self-contained Agent pipeline—to manage complex conversations. It features a highly efficient state machine that handles streaming data flow, ensuring LLM tokens immediately feed TTS audio. Furthermore, the architecture supports dynamic interruption handling, allowing the agent to instantly cancel and clear audio buffers. This framework connects modern AI services with telephony platforms like Twilio to create highly responsive voice agents.


#### 6. [mobile-jev](https://github.com/droidrun/mobile-jev) (`droidrun/mobile-jev`)
- **Repository URL**: [https://github.com/droidrun/mobile-jev](https://github.com/droidrun/mobile-jev)
- **Primary Language**: `Not specified` | **Stars**: `★ 0` | **License**: `Unspecified / FOSS`
- **Video Provenance**: Channel: *Github Awesome* | Video: *GitHub Trending Today #50: fast-jev-compaction, SemIf, jev-trader, jev-search, pg-jev, ...* | Date: *2026-09-19*
- **Keywords**: `automation, ai-agents, android, nodejs, llm, mobile, typescript, react`

**Product Description Text**:
> *(No brief description provided)*

**Detailed Synopsis / Architectural Context**:
> Mobile Jev is a standalone Android mobile agent that drives a real device through the Mobilerun API, powered by TypeSafe's Jev decision-making model. It enables developers and researchers to give a high-level goal in natural language, after which Jev observes the screen, selects the next operation and target coordinates, and executes taps, text entry, scrolling, and navigation through Mobilerun—no ADB connection required. The repository includes a React-based live studio at localhost:3040 for streaming the device and tracking actions in real time, a CLI for headless runs with execution traces and API profiling, and a reproducible dark-theme demo that verifies the actual switch state rather than trusting a model DONE response. It is built with Node.js 24, pnpm 10, and the `@mobilerun/react` component, and is intended for anyone experimenting with on-device AI agents, benchmarking mobile automation, or studying latency and reliability in production-style request loops.


#### 7. [phone-harness](https://github.com/ShawnPana/phone-harness) (`ShawnPana/phone-harness`)
- **Repository URL**: [https://github.com/ShawnPana/phone-harness](https://github.com/ShawnPana/phone-harness)
- **Primary Language**: `Not specified` | **Stars**: `★ 0` | **License**: `Unspecified / FOSS`
- **Video Provenance**: Channel: *Github Awesome* | Video: *GitHub Trending Monthly #102026.08* | Date: *2026-09-01*
- **Keywords**: `automation, ai-agents, python, agent, android, ocr, ios`

**Product Description Text**:
> *(No brief description provided)*

**Detailed Synopsis / Architectural Context**:
> Phone-harness lets AI agents like Claude Code or Codex control a real phone directly, with no jailbreak, app install, or WebDriverAgent required. For iPhone, it leverages macOS iPhone Mirroring combined with `screencapture` and Apple Vision OCR for perception, and HID-level `CGEvents` for taps, drags, typing, and gestures; for Android, it uses adb over USB or Wi‑Fi with `screencap` plus the device's own accessibility tree and `input` commands. The tool exposes a uniform Python helper interface (`ocr()`, `tap()`, `tap_text()`, `type_text()`, `open_app()`, etc.) so agents can write platform-agnostic scripts, while an editable `agent_helpers.py` lets them add custom helpers on the fly. A guided onboarding flow handles permissions, pairing, and a `--doctor` health check, and both platforms can coexist with a configurable default. Built in Python on macOS, it's aimed at developers and agent authors who want a thin, transparent bridge between an LLM and a real iOS or Android device without simulators or cloud dependencies.


---

### Device Mirroring & Screen Controllers

#### 1. [escrcpy](https://github.com/viarotel-org/escrcpy) (`viarotel-org/escrcpy`)
- **Repository URL**: [https://github.com/viarotel-org/escrcpy](https://github.com/viarotel-org/escrcpy)
- **Project Homepage**: [https://viarotel.eu.org/](https://viarotel.eu.org/)
- **Primary Language**: `JavaScript` | **Stars**: `★ 9,295` | **License**: `Apache-2.0`
- **Video Provenance**: Channel: *ManuAGI - AutoGPT Tutorials* | Video: *Trending Open-Source GitHub Projects : Shannon, Trivy, ChatDev 2.0, Gitbutler & Likec4 ...* | Date: *2026-02-08*
- **Keywords**: `mobile-development, automation, networking, operating-systems, desktop-apps, programming-languages`

**Product Description Text**:
> 📱 Display and control your Android device graphically with scrcpy.

**Detailed Synopsis / Architectural Context**:
> Escrcpy is a JavaScript-based project designed to provide graphical display and control of Android devices using the underlying scrcpy technology. It serves as a stable integration foundation for advanced mirroring and control functionalities. Key features include an Inset Mirror, multi-device control, and an integrated control bar for managing device settings. The system supports intelligent control via natural language commands powered by AutoGLM and enables automated execution workflows across multiple devices. Furthermore, it supports wireless ADB connections and reverse tethering capabilities. Escrcpy centralizes the management of connected devices, offering a comprehensive and intuitive interface for Android interaction.


#### 2. [another](https://github.com/Zfinix/another) (`Zfinix/another`)
- **Repository URL**: [https://github.com/Zfinix/another](https://github.com/Zfinix/another)
- **Primary Language**: `Rust` | **Stars**: `★ 552` | **License**: `MIT`
- **Video Provenance**: Channel: *Github Awesome* | Video: *GitHub Trending Today #29: Coasts, Agent, hermes-agent, Another, heerich.js, Notchy, hu...* | Date: *2026-03-31*
- **Keywords**: `automation, rust, mcp, android, alternatives, video, tauri, react`

**Product Description Text**:
> A desktop app for mirroring and controlling Android devices over USB. Built with Tauri, React, and Rust.

**Detailed Synopsis / Architectural Context**:
> Another is a cross-platform desktop application that mirrors and controls Android devices from a computer, offering a streamlined alternative to command-line tools like scrcpy. Built with Tauri, React, and Rust, it delivers real-time H.264/H.265 screen mirroring with adaptive bitrate, audio forwarding on Android 11+, screen recording, and screenshot capture. Users can forward touch, keyboard, scroll, and navigation inputs over USB or WiFi, record and replay interaction macros, and customize device nicknames and video quality settings. A built-in MCP (Model Context Protocol) server on port 7070 enables AI agents to programmatically interact with connected devices, exposing tools for launching apps, running shell commands, taking screenshots, and executing macros. The app is aimed at Android developers, testers, automation engineers, and power users who need efficient device interaction, with downloads available for macOS, Linux, and Windows.


#### 3. [tapflow](https://github.com/jo-duchan/tapflow) (`jo-duchan/tapflow`)
- **Repository URL**: [https://github.com/jo-duchan/tapflow](https://github.com/jo-duchan/tapflow)
- **Primary Language**: `Not specified` | **Stars**: `★ 0` | **License**: `Unspecified / FOSS`
- **Video Provenance**: Channel: *Github Awesome* | Video: *35 Self-Hosted Projects on GitHub: aurelio-finance, openpost, SurfSense, Reminal, Haven...* | Date: *2026-10-11*
- **Keywords**: `mcp, android, streaming, self-hosted, ios, mobile, ci-cd, browser`

**Product Description Text**:
> *(No brief description provided)*

**Detailed Synopsis / Architectural Context**:
> Tapflow is a self-hosted, open-source platform that lets mobile QA teams run iOS simulators and Android emulators directly in any browser, eliminating the need for shared physical devices, local toolchain installations, or third-party cloud services like Appetize and BrowserStack. It uses a three-part architecture consisting of a Node.js-based relay server (Linux/macOS), a macOS-only agent that drives simulators/emulators and connects outbound through WebSockets, and a browser dashboard where teammates can interact with devices in real time. The system streams video via H.264 with a zero-buffer WebCodecs/WASM decoder, supports touch, swipe, pinch, clipboard sync, and deeplinks, and injects iOS input directly without WebDriverAgent. Setup is minimal, requiring only `npm install -g tapflow` and a single `tapflow setup` command, with a 2-line onboarding flow. It also offers an API-first design with REST endpoints, Personal Access Tokens, a deterministic flow runner, and an MCP server for LLM-driven automation, making it suitable for mobile developers, QA engineers, backend developers, designers, and CI/CD pipelines.


---

### Multi-Device ADB Batch Automation

#### 1. [Social-Media-Automation](https://github.com/bravocw/Social-Media-Automation) (`bravocw/Social-Media-Automation`)
- **Repository URL**: [https://github.com/bravocw/Social-Media-Automation](https://github.com/bravocw/Social-Media-Automation)
- **Primary Language**: `Not specified` | **Stars**: `★ 0` | **License**: `Unspecified / FOSS`
- **Video Provenance**: Channel: *ig_scraper* | Video: *IG Scraper Links* | Date: *2026-09-23*
- **Keywords**: `electron, automation, nodejs, android`

**Product Description Text**:
> Aplikasi desktop berbasis Electron untuk melakukan otomatisasi Instagram menggunakan ADB (Android Debug Bridge) dengan banyak device Android secara paralel.

**Detailed Synopsis / Architectural Context**:
> Social-Media-Automation is a desktop application built with Electron that automates Instagram interactions across many Android devices simultaneously using ADB (Android Debug Bridge). It solves the challenge of managing large-scale social media engagement by enabling parallel execution of likes, comments, and follows on multiple physical devices from one interface. The application is targeted at social media managers, marketing teams, and agencies who need to coordinate engagement activities across device farms while maintaining realistic behavior through configurable delays and random timing. Key features include automatic device detection, real-time UI state recognition via UIAutomator XML parsing, batch scanning, hardware-locked license activation, auto-update functionality, comprehensive activity logging, and Excel export for reporting. The tech stack combines Electron and Node.js for the desktop framework, ADB for device communication, Bootstrap 5 for the dashboard UI, ExcelJS for spreadsheet generation, and Axios for license server communication. Note that the tool interacts with the Instagram app through UI automation rather than official APIs and requires Windows, Node.js 22+, and Android devices with USB debugging enabled.


---

### Model Context Protocol (MCP) Mobile Drivers

#### 1. [mobile-mcp](https://github.com/mobile-next/mobile-mcp) (`mobile-next/mobile-mcp`)
- **Repository URL**: [https://github.com/mobile-next/mobile-mcp](https://github.com/mobile-next/mobile-mcp)
- **Primary Language**: `Not specified` | **Stars**: `★ 0` | **License**: `Unspecified / FOSS`
- **Video Provenance**: Channel: *ManuAGI - AutoGPT Tutorials* | Video: *Top Open-Source GitHub Projects : OpenBao, Magnitude, herdr, Compositor, WeKnora & Bong...* | Date: *2026-09-28*
- **Keywords**: `automation, ai-agents, mcp, testing, android, cross-platform, nodejs, ios`

**Product Description Text**:
> *(No brief description provided)*

**Detailed Synopsis / Architectural Context**:
> Mobile Next is a Model Context Protocol (MCP) server that enables scalable mobile automation across iOS and Android platforms without requiring platform-specific expertise like XCUITest or Espresso. It provides a unified, platform-agnostic interface for agents and LLMs to interact with native applications running on simulators, emulators, or real devices through structured accessibility snapshots, falling back to coordinate-based taps via screenshots only when necessary. The server is compatible with Claude Code, Codex, Gemini, GitHub Copilot, and other MCP-compatible clients, and also offers remote access to physical cloud devices. Key features include full device control (taps, swipes, gestures, hardware buttons, orientation, deep links, GPS overrides), app lifecycle management (install, launch, terminate), screen recording, live log collection, and crash report retrieval. The toolset covers use cases such as automated UI testing, scripted multi-step user journeys, form interactions, and agent-to-agent data extraction workflows. Built on Node.js v20+ and leveraging platform tooling like Xcode's `xcrun simctl` and Android's `adb`, it targets mobile QA engineers, automation developers, and AI agent builders seeking a single API to drive both iOS and Android devices.


#### 2. [qapilot-mcp-for-android](https://qapilot.io/mcp/guide?ref=manuagi) (`qapilot.io/qapilot-mcp-for-android`)
- **Repository URL**: [https://qapilot.io/mcp/guide?ref=manuagi](https://qapilot.io/mcp/guide?ref=manuagi)
- **Primary Language**: `Not specified` | **Stars**: `★ 0` | **License**: `Unspecified / FOSS`
- **Video Provenance**: Channel: *ManuAGI - AutoGPT Tutorials* | Video: *Top AI Agent Projects : Nimble, Slashy, Aside, Juggler & Loqua* | Date: *2026-09-16*
- **Keywords**: `automation, mcp, testing, android, mobile`

**Product Description Text**:
> *(No brief description provided)*

**Detailed Synopsis / Architectural Context**:
> QApilot MCP for Android is an AI-native mobile automation platform that lets testers drive real Android devices and emulators by describing test flows in plain English to MCP-compatible assistants like Claude, Cursor, or Codex, eliminating the need to write Appium code. It requires a local stack including Node.js 18+, Java JDK 11+, Android SDK, a connected device or emulator, and a pinned Appium 2.19.0 server plus UiAutomator2 driver, after which the qapilot-mcp CLI is installed via npm. Users can launch apps by package ID, record structured test plans through natural-language prompts, watch execution via a live browser preview, accept happy-path steps as saved test cases, and replay them individually, in batch, or from an Excel sheet. Reports with screenshots and Gherkin feature files are generated automatically at the end of each session, and the tool exposes roughly two dozen MCP tools covering signup, device selection, session control, plan execution, and usage tracking. It targets QE leaders, release managers, QA engineers, product managers, and SREs seeking autonomous, agentic Android testing, and is built around the Model Context Protocol, Node.js, Appium, and the Android UIAutomator2 driver.


---

### Cross-Platform Mobile CLI & Test Drivers

#### 1. [agent-device](https://github.com/callstackincubator/agent-device) (`callstackincubator/agent-device`)
- **Repository URL**: [https://github.com/callstackincubator/agent-device](https://github.com/callstackincubator/agent-device)
- **Project Homepage**: [https://agent-device.dev](https://agent-device.dev)
- **Primary Language**: `TypeScript` | **Stars**: `★ 1,797` | **License**: `MIT`
- **Video Provenance**: Channel: *Github Awesome* | Video: *GitHub Trending Weekly #22: Edit Banana, agent-device, claudes-c-compiler, prek, paqet,...* | Date: *2026-02-06*
- **Keywords**: `automation, ai-agents, cli, testing, android, ios`

**Product Description Text**:
> CLI to control iOS and Android devices for AI agents

**Detailed Synopsis / Architectural Context**:
> `agent-device` is a command-line interface (CLI) built in TypeScript designed to facilitate UI automation on iOS, Android, macOS, and tvOS for AI agents. It enables agents to perform agent-driven workflows by inspecting mobile and desktop user interfaces and acting upon them deterministically. The system focuses on maintaining session-aware, replayable automation flows rather than simple one-off scripts. Core features include capturing structured snapshots of the UI state and utilizing references for discovery and selectors for durable assertions. This approach allows agents to manage complex interactions efficiently, ensuring reliability and reproducibility in mobile automation tasks.


#### 2. [artemis](https://github.com/google/artemis) (`google/artemis`)
- **Repository URL**: [https://github.com/google/artemis](https://github.com/google/artemis)
- **Primary Language**: `Not specified` | **Stars**: `★ 0` | **License**: `Unspecified / FOSS`
- **Video Provenance**: Channel: *Github Awesome* | Video: *GitHub Trending Today #49: SoL-Pi, viserys-agent, Edge0, Mac-Duo, artemis, rune, YOINK,...* | Date: *2026-09-14*
- **Keywords**: `automation, ai-agents, python, model, android, llm, mobile`

**Product Description Text**:
> *(No brief description provided)*

**Detailed Synopsis / Architectural Context**:
> Artemis is an open-source framework that enables AI assistants and automated test suites to interact with real Android devices through natural language commands. It bridges the gap between large language models and physical mobile hardware by providing a reactive observe-and-act execution loop, multimodal element targeting (using indices, coordinates, and visual fallback), and support for cross-app workflows. A native Model Context Protocol (MCP) server allows IDEs like Antigravity, Claude Code, Cursor, and Windsurf to directly drive connected devices, collect Logcat output, capture screenshots, and run diagnostic test plans end-to-end. The project ships with a one-click setup script that auto-installs toolchains such as ADB, scrcpy, and FFmpeg, plus a web UI for device mirroring, prompt sandboxing, and execution replays. It achieves 99%+ task completion on Google Research's AndroidWorld benchmark across 100+ multi-step tasks and is built on Python 3.12+. Target users include mobile QA engineers, AI agent developers, and researchers who need a reliable, human-like interface for Android automation.


#### 3. [goldie](https://github.com/kacperkapusciak/goldie) (`kacperkapusciak/goldie`)
- **Repository URL**: [https://github.com/kacperkapusciak/goldie](https://github.com/kacperkapusciak/goldie)
- **Primary Language**: `Not specified` | **Stars**: `★ 0` | **License**: `Unspecified / FOSS`
- **Video Provenance**: Channel: *Github Awesome* | Video: *GitHub Trending Today #47: 4DAnyone, microduck, boop, PRAXIST, acryl, pgterm, sepia, Op...* | Date: *2026-08-30*
- **Keywords**: `automation, cli, android, tools, video, npm, ios, mobile`

**Product Description Text**:
> Goldie gives coding agents a repeatable pipeline for app store screenshots and preview videos. Argent replays flows against an iOS simulator

**Detailed Synopsis / Architectural Context**:
> Goldie is a CLI tool that generates App Store and Google Play screenshots, plus App Store preview videos, for mobile apps. It addresses the tedious, error-prone process of producing store-compliant visual assets by replaying user flows on iOS simulators or Android emulators (via the companion Argent tool), capturing the screens, and framing them with device bezels, backgrounds, and headlines. Key features include automated flow capture, device bezel framing, multiple layout templates (editorial, showcase, magazine, etc.), a browser-based studio for visual tweaks, and validation against store upload rules—including the iPhone's 1320x2868 resolution and the 15–30 second preview duration requirement. It is framework agnostic, supporting SwiftUI, UIKit, Jetpack Compose, Flutter, React Native, and Kotlin Multiplatform apps. Goldie is built on Node.js 20+ with ffmpeg for video assembly, ships as an npm package, and integrates with coding agents like Cursor, Codex, and Claude Code through a dedicated skill. The tool targets mobile developers and teams who want to automate screenshot production as part of their release workflow.


---

### Android Testing & ADB Skills

#### 1. [android-testing-skills](https://github.com/skydoves/android-testing-skills) (`skydoves/android-testing-skills`)
- **Repository URL**: [https://github.com/skydoves/android-testing-skills](https://github.com/skydoves/android-testing-skills)
- **Primary Language**: `Shell` | **Stars**: `★ 276` | **License**: `Apache-2.0`
- **Video Provenance**: Channel: *Github Awesome* | Video: *35 Claude Code skills on GitHub: 9arm-skills, PaperSpine, book-to-skill, native-feel-sk...* | Date: *2026-05-27*

**Product Description Text**:
> ⚡️ A set of skills for Android testing: Compose UI, AndroidX Test, JVM unit tests, and ADB.


#### 2. [e2e](https://github.com/tester-army/e2e) (`tester-army/e2e`)
- **Repository URL**: [https://github.com/tester-army/e2e](https://github.com/tester-army/e2e)
- **Primary Language**: `Not specified` | **Stars**: `★ 0` | **License**: `Unspecified / FOSS`
- **Video Provenance**: Channel: *Full Stack* | Video: *Top 10 GitHub Repos This Week &#124; Oct 4 � Oct 10 &#124; Agents Learn New Trades* | Date: *2026-10-12*
- **Keywords**: `automation, ai-agents, testing, devtools, playwright, framework, mobile`

**Product Description Text**:
> Next generation e2e testing framework for web and mobile apps.

**Detailed Synopsis / Architectural Context**:
> e2e is an open-source end-to-end testing framework for web and mobile apps that lets developers describe test goals in natural language while an AI agent drives the application to fulfill them. It combines agent-driven actions with traditional locators and assertions, enabling tests like "upgrade the workspace to the Pro plan" alongside conventional expectations. Agent steps record their actions and replay them on subsequent runs without requiring model calls, while tests without agent steps need no AI usage at all. The framework is delivered as a modular monorepo with packages for the core SDK, browser engines via Playwright (Chromium, Firefox, WebKit), iOS and Android engines via agent-device, GitHub reporting, and hosted browsers/simulators. Users can bring their own model subscription, API key, or local model, and get started quickly with `npx e2e init`. Ideal for QA engineers, developers, and teams seeking to blend AI-driven flexibility with the reliability of recorded-replay testing.


---

### Virtual Phone & Emulator Workstations

#### 1. [vphone-cli](https://github.com/Lakr233/vphone-cli) (`Lakr233/vphone-cli`)
- **Repository URL**: [https://github.com/Lakr233/vphone-cli](https://github.com/Lakr233/vphone-cli)
- **Primary Language**: `Not specified` | **Stars**: `★ 0` | **License**: `Unspecified / FOSS`
- **Video Provenance**: Channel: *ManuAGI - AutoGPT Tutorials* | Video: *Top Open-Source GitHub Projects : OpenBao, Magnitude, herdr, Compositor, WeKnora & Bong...* | Date: *2026-09-28*
- **Keywords**: `security, devops, ios, swift, apple-silicon, macos`

**Product Description Text**:
> *(No brief description provided)*

**Detailed Synopsis / Architectural Context**:
> vphone-cli is a command-line tool that boots a virtual iPhone on Apple Silicon Macs by leveraging Apple's Virtualization.framework alongside the public PCC (PCC research) VM infrastructure. It solves the long-standing lack of an official, scriptable way to run an iOS device under emulation on macOS, giving researchers an isolated, reproducible environment for testing, reverse engineering, and jailbreak development.

The tool automates the entire end-to-end pipeline — downloading and merging IPSW firmware, applying boot-chain and CFW patches, performing a DFU restore, installing a customized firmware, and booting the VM — with a single `vphone-cli vm create myphone -V <variant>` command. It supports five firmware patch variants (`less`, `regular`, `dev`, `jb`, `exp`) ranging from a 4-patch "patchless" mode to a 141-patch research build with anti-VM-detection bypasses and auto-installed Sileo/TrollStore. Individual subcommands (`fw prepare`, `fw patch`, `restore`, `cfw install`, `vm launch`, etc.) expose every stage for manual or scripted workflows, and built-in access via SSH (port 22222) and VNC (port 5901) provides direct interaction with the guest.

The primary users are iOS security researchers, jailbreak developers, and application testers who need an emulated iPhone that behaves like real hardware. The technology stack is built around a Swift/C++ command-line host application on macOS 15+ with Xcode and the iOS SDK for cross-compiling the `vphoned` guest daemon, packaged


#### 2. [vphone-ws](https://github.com/zqxwce/vphone-ws) (`zqxwce/vphone-ws`)
- **Repository URL**: [https://github.com/zqxwce/vphone-ws](https://github.com/zqxwce/vphone-ws)
- **Primary Language**: `Not specified` | **Stars**: `★ 0` | **License**: `Unspecified / FOSS`
- **Video Provenance**: Channel: *ManuAGI - AutoGPT Tutorials* | Video: *Top Open-Source GitHub Projects : AutoGPT, Capptivo, anydoc, Swiftlet, waku-agent & mor...* | Date: *2026-08-09*
- **Keywords**: `devops, swiftui, tools, ios, macos`

**Product Description Text**:
> vPhone Workstation is a native macOS app that provides a graphical front-end for **vphone-cli**, simplifying the management of Apple's research virtual iPhones built on Virtualization.framework and PCC VMs. It solves the pain of running iOS research VMs from the command line by exposing every step through a clean SwiftUI interface. Users can browse a searchable library of VMs with live state, inspect detailed device information, and manage lifecycle operations like start, stop, clone, rename, export, and delete. A guided create wizard walks through variant selection (Less, Regular, Developer, Jailbreak, Experimental), firmware pairing, and resource allocation, streaming real-time progress and an exportable log from the CLI. Host readiness checks verify Apple Silicon, macOS 15+, vphone-cli availability, and required security bypasses before any VM can boot. It targets iOS security researchers and developers who need a reliable, visual way to work with virtual iPhones, and ships as a SwiftUI app installable via Homebrew or built locally from source.


---

### Virtual Environments & Termux Automation

#### 1. [DroidDesk](https://github.com/orailnoor/DroidDesk) (`orailnoor/DroidDesk`)
- **Repository URL**: [https://github.com/orailnoor/DroidDesk](https://github.com/orailnoor/DroidDesk)
- **Primary Language**: `Shell` | **Stars**: `★ 2,169` | **License**: `Unspecified / FOSS`
- **Video Provenance**: Channel: *Github Awesome* | Video: *GitHub Trending Today #34: aipointer, rmux, Photo-agents, zerostack, opensquilla, files...* | Date: *2026-05-26*

**Product Description Text**:
> DroidDesk turns your Android phone into a real Linux desktop using Termux, Termux X11, TUR, and Proot. Run VS Code, Firefox, LibreOffice, Blender, and more with X11 or VNC support for monitor setup.


---

### Security & APK Inspection Automation

#### 1. [apk-reverse](https://github.com/newliver666/apk-reverse) (`newliver666/apk-reverse`)
- **Repository URL**: [https://github.com/newliver666/apk-reverse](https://github.com/newliver666/apk-reverse)
- **Primary Language**: `Not specified` | **Stars**: `★ 0` | **License**: `Unspecified / FOSS`
- **Video Provenance**: Channel: *ig_scraper* | Video: *IG Scraper Links* | Date: *2026-09-23*
- **Keywords**: `agent, developer-tools, android`

**Product Description Text**:
> Suitable for Android APK reverse engineering analysis

**Detailed Synopsis / Architectural Context**:
> apk-reverse is an Agent Skill (for Claude Code, Codex, and compatible harnesses) that performs Android APK reverse engineering, debloating, ad removal, dex-level patching, and runtime/server protocol analysis. It targets the recurring failure mode where AI models read instructions, agree with them, and then revert to first-principles reasoning, replacing open-ended advice with a procedural framework of four override rules (R1–R4), four verification gates (G1–G4), a symptom-index-driven stop-signal catalog, and a two-strike rule to prevent repeated identical mistakes. The skill distinguishes client-side feasibility from server-enforced paywalls, selects the safest patch layer for a given change, and catches silent failures such as repacked APKs whose signed requests are rejected because the signing key is derived from the original certificate. It is packaged for progressive disclosure, with a short decision-oriented `SKILL.md`, on-demand reference files (e.g. `advanced-unpacking.md`), parameterized Python scripts such as `doctor.py` for environment diagnosis, and Markdown coverage, with a Python Markdown Markdown Android toolchain spanning MT Manager, LSPosed, Frida (including Stalker and RPC service-ification), and OLLVM-flattened native analysis, aimed at security researchers, reverse engineers, and developers debugging or hardening Android applications.


#### 2. [Teardroid-v4](https://github.com/Adi1717/Teardroid-v4) (`Adi1717/Teardroid-v4`)
- **Repository URL**: [https://github.com/Adi1717/Teardroid-v4](https://github.com/Adi1717/Teardroid-v4)
- **Primary Language**: `Not specified` | **Stars**: `★ 0` | **License**: `Unspecified / FOSS`
- **Video Provenance**: Channel: *ig_scraper* | Video: *IG Scraper Links* | Date: *2026-09-23*
- **Keywords**: `security, learning, python, android, tools`

**Product Description Text**:
> *(No brief description provided)*

**Detailed Synopsis / Architectural Context**:
> Teardroid v4 is an educational Android botnet toolkit that simplifies building a remote access trojan (RAT) without requiring port forwarding, a VPS, or Android Studio. It provides a Python-based builder that generates a customized APK payload, paired with a web-based control panel deployable on Deta.sh for remote command execution. The tool enables operators to extract contacts, SMS, call logs, device location, and installed apps, as well as run shell commands, change wallpapers, send SMS, make calls, read notifications, and download files from compromised devices. Security researchers, penetration testers, and students studying Android malware use it to understand mobile threat vectors in controlled, authorized environments. The stack combines Python 3 for the builder and API, Java (JDK 11) for APK construction, and Deta Cloud microservices for hosting the admin dashboard, supporting Linux and Windows hosts. A disclaimer explicitly states the tool is for educational purposes only, with the author disclaiming responsibility for any malicious use.


---

### Rootless System & Bridge Automation

#### 1. [shizzi](https://github.com/carlelieser/shizzi) (`carlelieser/shizzi`)
- **Repository URL**: [https://github.com/carlelieser/shizzi](https://github.com/carlelieser/shizzi)
- **Primary Language**: `Not specified` | **Stars**: `★ 0` | **License**: `Unspecified / FOSS`
- **Video Provenance**: Channel: *ig_scraper* | Video: *IG Scraper Links* | Date: *2026-09-23*
- **Keywords**: `proxy, go, android, mobile, apple-silicon`

**Product Description Text**:
> Rootless wifi-tethering bypass for Android with Shizuku.

**Detailed Synopsis / Architectural Context**:
> Shizzi enables unlimited Wi-Fi tethering on Android devices by routing hotspot traffic through a test TUN interface using Shizuku's elevated privileges, bypassing carrier hotspot data caps. It creates a test network, configures it as the preferred tethering upstream, and forwards traffic via a Go-based datapath with support for both IPv4 and IPv6. The app requires Android 11 or higher on arm64 devices with Shizuku 13.6.0+, and on Android 11/12 it may prompt users to install a compatibility module for the device's tethering stack. Key features include VPN compatibility for per-device privacy, integration with the existing Android hotspot (no extra setup), a quick settings tile for one-tap control, and automation support via Tasker or MacroDroid. Built with Go (compiled to native bindings via gomobile) and Android SDK/NDK, it delivers this functionality without requiring root access, making it ideal for mobile users seeking to share their regular mobile data allowance over Wi-Fi tethering.


---

## Strategic Analysis: The Future of Android Automation

### 1. The Transition from Selector-Based Testing to Visual Phone Agents
Traditional Android automation relied on fragile accessibility node trees (XPath, resource IDs) that broke across OEM skins (OneUI, MIUI, Pixel UI). The emergence of **Open-AutoGLM**, **PhoneDriver**, and **gelab-zero** marks a transition toward multimodal vision-language models that process direct framebuffer screenshots and emit standardized coordinate touch gestures (`click(x, y)`, `scroll(dir)`).

### 2. Standardizing Agent Access via Model Context Protocol (MCP)
With projects like **mobile-mcp** and **qapilot-mcp-for-android**, developers can now expose mobile devices as first-class tools in IDEs (Claude Code, Cursor). An agent can autonomously run an Android app, observe visual layout glitches, inspect logcat streams via ADB, and commit bug fixes in a closed feedback loop.

### 3. Lightweight Hardware Farming
Tools like **droidclaw** and **Social-Media-Automation** highlight a growing trend: repurposing inexpensive or decommissioned Android devices into dedicated, always-on AI automation nodes connected over Wi-Fi or USB.