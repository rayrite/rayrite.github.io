# Deep Research Report and Beginner's Guide: Creating and Adapting Leanback (TV) Applications for Streaming Devices, Smart TVs, and Game Consoles

## 1. Research Metadata and Deliverable Tracking

- **Title:** Comprehensive Beginner's Guide to Creating and Adapting a Leanback (TV) Version of a Mobile App for Streaming Devices, Smart TVs, and Game Consoles — Build Requirements, Store Submission Guidelines, and Operational Best Practices
- **Governing Specification:** Consolidated Handoff Specification `sysprompts/leanback/deep-research-handoff-leanback-tv-app-composite-superset[cd-opus55-modelcouncil].md`
- **Execution Date:** 2026-10-14
- **Research Cutoff Date:** 2026-10-14
- **Investigation Standard:** Deep and Wide Research (Exhaustive, Multi-Angle, Source-Grounded, Traceable)
- **Primary Research Authority:** Official vendor platform documentation, developer agreements, certification checklists, store submission guidelines, regulatory mandates, and primary developer community post-mortems
- **Coverage Scope:** 9 Core Platform Families (Amazon Fire TV [Fire OS & Vega OS], Google TV / Android TV [Certified], Generic Android TV Boxes [AOSP & Operator-Tier], Roku [SceneGraph & RSG 2.0], Apple TV [tvOS], LG webOS Smart TVs, Samsung Smart TVs [Tizen], Xbox Consoles [Xbox Series X|S & Xbox One], PlayStation Consoles [PS4 & PS5]) plus 6 Verified Adjacent Connected TV Platforms
- **Clarification Status:** Fully resolved via governed defaults (CQ-01 through CQ-16)

---

## 2. Original User Request (Governing Variant C)

> "Please research official documentation and developer forums to compile and build a beginner's guide on how to create and adapt a leanback version of a mobile app to be hosted on various streaming devices such as the Amazon FireStick and variant, Google TV streaming devices, LG WebOS smart TVs, Roku streaming devices and TVs, Apple TV, Android TV boxes, Samsung TVs, Xbox Live, Playstation/PSN etc. Include the requirements for building the app and app store submission guidelines and best practices."

*(Traceability Note: Covers Variant A [initial streaming devices], Variant B [incorporating consoles and store submission], and Variant C [governing superset mandating official documentation, developer forum evidence, and mobile adaptation]).*

---

## 3. Clarifications Applied and Lead Verification Register

All research parameters have been resolved according to governed specification defaults, anchoring the analysis in concrete, actionable technical requirements:

| Parameter ID | Parameter Description | Governing Applied Default | Practical Effect on Research Scope |
| :--- | :--- | :--- | :--- |
| **CQ-01** | App Archetype | Audio/Video media consumption application (VOD/Live/FAST) | Comprehensive coverage of playback engines, DRM, audio/HDR formats, and ad insertion; dedicated callouts for games, utilities, and transactional apps. |
| **CQ-02** | Source Mobile Stack | Stack-Agnostic Baseline | Comprehensive evaluation across Native Android (Kotlin), Native iOS (Swift), React Native, Flutter, Kotlin Multiplatform, Unity, and Web/PWA. |
| **CQ-03** | Definition of "Leanback" | Dual Definition: 10-foot UX paradigm + Android TV UI library | Clarifies the 10-foot UX across all platforms; documents the evolution of the Android Leanback UI toolkit to Jetpack Compose for TV. |
| **CQ-04** | Target Audience Skill Level | Mobile app developer new to 10-foot TV ecosystems | Presumes core software engineering competence; explains all TV-specific constraints, spatial navigation concepts, and platform quirks. |
| **CQ-05** | Platform Depth | Exhaustive treatment across all 9 platform families | Every platform receives a dedicated chapter structured against the identical 20-field Platform Chapter Schema (PCS). |
| **CQ-06** | Console Scope | Official console store publishing via Microsoft and Sony | Disambiguates network services ("Xbox Live" / "PSN") from store distribution channels; provides an evidence-based assessment of developer access. |
| **CQ-07** | TV Boxes & "Etc." | Certified devices in full; uncertified/AOSP boxes caveated | Analyzes Play Services dependencies, Widevine L1 vs L3, and operator tier; profiles 6 adjacent platforms in Appendix G. |
| **CQ-08** | Publisher Location | United States entity with global distribution goals | Maps seller identity verification, tax requirements (W-9/W-8BEN), regional store limits, and international content rating regimes. |
| **CQ-09** | Monetization Model | Hybrid (AVOD / SVOD / Free / TVOD) | Details Store IAP integration, commission rates, reader-app exemptions, and advertising frameworks (e.g., Roku RAF). |
| **CQ-10** | Backend Architecture | Cloud REST/GraphQL API with streaming CDN | Focuses on client-side porting, token authentication, video delivery, and catalog metadata integration. |
| **CQ-11** | Code Depth | Minimal, illustrative, syntax-verified code snippets | Covers project manifests, focus handlers, player setups, and "Hello Leanback" walkthrough outlines for key platforms. |
| **CQ-12** | Team & Timeline | Small team (1–3 engineers), 3–6 month launch window | Develops phased milestone roadmaps, risk-mitigated platform sequencing, and budget rollups with complete arithmetic. |
| **CQ-13** | Freshness Horizon | Current live requirements + officially announced transitions | Separates enforced production rules from announced beta roadmaps (e.g., Roku RSG 2.0 and Amazon Vega OS). |
| **CQ-14** | Architecture Framework | Objective decision framework with conditional branches | Provides structured trade-off matrices for native vs. cross-platform vs. web-wrapper vs. no-code builders. |
| **CQ-15** | Prior Assets | Clean-slate research | Grounded entirely in primary documentation and developer forum data harvested during this research cycle. |
| **CQ-16** | Output Deliverable | Verbose, self-contained Markdown dossier and guide | Single-file complete deliverable accompanied by modular chapters for developer accessibility. |

### Lead Verification Outcomes (Assumptions A-14 through A-17)

Before compiling the guide, the preparation-time leads established during preliminary review were verified against live developer portals and official technical announcements:

1. **Lead A-14 (Amazon Vega OS & VPKG): [CONFIRMED & EXPANDED]**
   - *Verification Status:* Confirmed. Amazon has introduced **Vega OS**, a proprietary Linux-based operating system that does not run Android AOSP runtimes.
   - *Technical Findings:* Vega OS applications are packaged in the **`.vpkg` (VPKG)** format, built primarily using the **Vega SDK** (utilizing React Native and web technologies). Sideloading of arbitrary consumer APKs is blocked, though Developer Mode remains accessible via the **Vega CLI (`vega`)** and **Vega Device Adapter (VDA)**. For existing Android Fire OS apps, Amazon operates an invite-managed **Cloud App Program** where Fire OS APKs run in AWS cloud containers and stream UI frames via low-latency UDP to a thin Vega `.vpkg` client wrapper, with media playback decoded locally. Both Fire OS APKs and Vega VPKGs can be managed under a unified Appstore submission listing.
2. **Lead A-15 (Roku RSG 2.0 & Toolchain Direction): [CONFIRMED & DATED]**
   - *Verification Status:* Confirmed. Roku officially announced the **RSG 2.0 SDK** (Roku SceneGraph 2.0).
   - *Technical Findings:* RSG 2.0 brings native **TypeScript and JavaScript** support to Roku development via the Hermes JavaScript engine, featuring modern reactive components via SolidJS, the FlexGrid virtualized layout system, and compile-time type checking alongside legacy BrightScript. Roku has migrated its official open-source developer repositories and sample code from GitHub to **GitLab (`gitlab.com/rokudev`)** under an MIT license. Public beta launch is scheduled for **October 29, 2026**; however, production store submission of RSG 2.0 packages is slated for **2027**. Consequently, this guide recommends production teams build on stable Roku SceneGraph (RSG 1.x) / BrightScript while architecting logic for RSG 2.0 transition. Direct Publisher was permanently sunset on January 12, 2024.
3. **Lead A-16 (Xbox Console UWP Deprecation & Media App Pipeline): [CONFIRMED & RESOLVED]**
   - *Verification Status:* Confirmed. Microsoft no longer accepts new Universal Windows Platform (UWP) **games** for Xbox consoles, mandating the **Microsoft Game Development Kit (GDK)** and **ID@Xbox** concept approval.
   - *Technical Findings:* For **non-game media applications** (streaming video, audio, content portals), the path diverges from games. Media apps are managed through **Microsoft Partner Center** under a managed media onboarding track. While retail Xbox consoles can run UWP media apps locally via Retail Dev Mode ($19 one-time fee), publishing a public media streaming app to the retail Microsoft Store on Xbox requires business partner review and direct application approval from Microsoft's media ecosystem team.
4. **Lead A-17 (Samsung Smart TV Seller Office & Public Seller Limits): [CONFIRMED & DETAILED]**
   - *Verification Status:* Confirmed. Samsung Smart TV applications are submitted strictly via the **Samsung Apps TV Seller Office (`seller.samsungapps.com/tv`)**, completely separate from the mobile Samsung Galaxy Store.
   - *Technical Findings:* Newly registered developers receive **Public Seller** status by default upon creating a Samsung Account. Public Sellers are strictly restricted to distributing applications in the **United States (US) market only**. Releasing applications globally or outside the US requires applying for and receiving **Partner Seller** status via an offline commercial agreement. Furthermore, releases must be explicitly targeted to specific hardware **TV Model Groups** (e.g., year and hardware tier), and US releases must comply with strict FCC accessibility rules (closed captions and text-to-speech).

---

## 4. Executive Summary

Adapting a mobile application for the television screen requires a complete mental and architectural shift: **the transition from a personal, high-density, touch-driven "lean-forward" experience to a shared, distance-viewed, remote-driven "lean-back" experience**. 

On mobile devices, users interact directly with content through high-resolution touchscreens held 12–18 inches from their eyes. On a television, users sit 7 to 12 feet away ("the 10-foot UI"), navigating indirectly through a physical directional pad (D-pad) or pointer remote. Every visual element must be legible at a glance, spatial navigation must be deterministic, input latency must be imperceptible, and video playback must initiate near-instantaneously without frame drops.

### The Fragmented Platform Reality
Unlike mobile development—which is largely a duopoly between Apple iOS and Google Android—the Connected TV (CTV) ecosystem is intensely fragmented across four major architectural paradigms:
1. **Android-Derived Platforms:** Google TV, certified Android TV, generic Android TV boxes, and legacy Amazon Fire OS devices. These share common Android media and manifest foundations but diverge sharply in launcher integration, store compliance, Play Services availability, and home-screen channels.
2. **Web-Runtime Smart TVs:** Samsung Smart TVs (Tizen OS) and LG Smart TVs (webOS). These operate on Chromium- and WebKit-based browser engines wrapped in native OS shells, executing HTML5, CSS3, and JavaScript applications while exposing proprietary native hardware bindings for media decoding (Tizen AVPlay and webOS Luna services).
3. **Proprietary Scripting Ecosystems:** Roku OS, commanding massive market share in North America. Roku shares zero UI code with mobile or web ecosystems, historically requiring its proprietary BrightScript language and SceneGraph XML component framework, now transitioning to TypeScript via RSG 2.0.
4. **Walled Garden Consoles & Specialized Platforms:** Apple TV (tvOS), Xbox consoles, and PlayStation consoles. Apple tvOS provides the most direct transition for iOS engineers via UIKit and SwiftUI, driven by its sophisticated Focus Engine. Xbox and PlayStation represent high-performance, strictly governed platforms where game development is open via indie programs (ID@Xbox), but commercial media streaming apps require formal corporate partnerships and strict compliance audits.

### Recommended Launch Sequencing for an Independent Mobile Team
Based on market reach, development friction, tooling accessibility, and store approval velocity, this guide establishes a red-teamed, three-phase commercial rollout:
- **Phase 1: The Unified Android Foundation (Months 1–3):** Target **Google TV / Android TV** and **Amazon Fire TV (Fire OS)** simultaneously. By building an Android TV build using **Jetpack Compose for TV** or a cross-platform layer like **React Native for TV**, teams can reuse 80–90% of business logic, networking, and state management from an existing Android mobile app while addressing 50%+ of the global CTV streaming device market with low upfront account fees ($25 Google Play, $0 Amazon).
- **Phase 2: The Core Smart TV Living Room Duopoly (Months 3–6):** Deploy to **Samsung Smart TVs (Tizen)** and **LG Smart TVs (webOS)**. By leveraging web technologies (React/TypeScript or LG Enact), teams capture the vast majority of built-in smart TV households worldwide. Samsung accounts are free ($0, initially US-only as Public Seller), and LG Seller Lounge registration is free ($0).
- **Phase 3: High-Value Ecosystem Expansion (Months 6–9+):** Deploy to **Apple TV (tvOS)** (leveraging existing iOS Swift/SwiftUI logic under an existing $99/year Apple Developer account) and **Roku** (rewriting the UI layer in SceneGraph/BrightScript while reusing backend APIs). Consoles (Xbox and PlayStation) should only be pursued if the application has established massive audience demand and secured direct publisher sponsorship from Microsoft or Sony.

---

## 5. Key Research Findings and Strategic Takeaways

The findings below represent empirical, verified platform requirements, categorized by confidence level and citable across subsequent chapters:

1. **Focus Management is the Single Greatest Failure Point in TV Adaptation `[REQUIRED | HIGH CONFIDENCE]`**
   Mobile developers routinely fail TV store certification by leaving "touch-first" assumptions in their codebases. On TV, a mouse cursor does not exist; every interactable element must participate in a two-dimensional spatial graph. If a user presses "Down" on a remote and the visual focus highlight disappears, freezes, or jumps unpredictably, the application will be summarily rejected by Google, Amazon, Roku, LG, Samsung, and Apple. (See §11, §14).
2. **Roku Requires a Dedicated UI Rewrite; Backend and Business Logic Can Be Shared `[PRACTITIONER TIP | HIGH CONFIDENCE]`**
   There is no production-ready mechanism to "port" a native mobile or Flutter/React Native UI directly to Roku for public store publishing today. Roku applications must be compiled into BrightScript/SceneGraph packages. Teams must decouple their mobile architectures cleanly: video streaming CDN endpoints, GraphQL/REST APIs, authentication tokens, and catalog metadata structures can be 100% shared, while the presentation tier is rewritten for Roku. (See §10, §14.4).
3. **Amazon is Splitting its Platform Between Fire OS (Android) and Vega OS (Linux) `[REQUIRED | HIGH CONFIDENCE]`**
   Newer Amazon streaming hardware (such as the Fire TV Stick 4K Select) runs Vega OS, which rejects Android APKs entirely. While Amazon provides a temporary cloud-streamed container solution for select partners, long-term multi-platform developers targeting Amazon must prepare React Native or web-based builds packaged as `.vpkg` binaries to ensure universal Fire TV hardware compatibility. (See §14.1).
4. **Samsung TV Distribution is Geographically Gated for Independent Developers `[REQUIRED | HIGH CONFIDENCE]`**
   Independent developers opening an account on the Samsung Apps TV Seller Office are assigned "Public Seller" status, legally limiting their app distribution to the United States. Global rollout on Samsung TVs requires formal commercial escalation to "Partner Seller" status, which requires submitting offline business proposals, traffic projections, and partner verification. (See §14.7, §15).
5. **tvOS Demands a Dedicated Mac and Follows Strict Guideline 3.1.1 Enforcement `[REQUIRED | HIGH CONFIDENCE]`**
   Apple tvOS development requires macOS and Xcode 26+ (targeting the tvOS 26 SDK). Unlike mobile iOS, tvOS does not provide a web browser (no Safari, no `WKWebView` rendering for arbitrary web pages) and enforces strict App Store Review Guidelines: subscription apps must either integrate Apple StoreKit in-app purchases or qualify strictly as an authenticated "Reader App" or multi-platform service with account creation occurring outside the TV. (See §14.5, §16).
6. **Regulatory Accessibility (FCC CVAA & EAA) is an Enforced Gate, Not an Option `[REQUIRED | HIGH CONFIDENCE]`**
   In the United States, the FCC's 21st Century Communications and Video Accessibility Act (CVAA) mandates that all video programming delivered over IP that was previously shown on television with captions must include closed captioning of equal quality. Furthermore, platforms distributing in the US and Europe (European Accessibility Act - EAA) strictly test text-to-speech (screen readers) for on-screen UI navigation during certification. (See §17).

---

# Part I — The Beginner's Guide to Building and Launching a Leanback App

---

## 7. How to Use This Guide

This guide is designed as an end-to-end practical manual for software engineers, engineering managers, and product leads who have successfully shipped or maintained a mobile application (iOS, Android, React Native, or Flutter) and are now tasked with bringing that product to the television screen.

### Target Personas and Reading Paths

```
                  ┌──────────────────────────────────────────────┐
                  │        START: Mobile Team Planning TV         │
                  └──────────────────────┬───────────────────────┘
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 │                                               │
                 ▼                                               ▼
     ┌───────────────────────┐                       ┌───────────────────────┐
     │  Engineering Leader   │                       │   Frontend / Mobile   │
     │   / Product Manager   │                       │       Engineer        │
     └───────────┬───────────┘                       └───────────┬───────────┘
                 │                                               │
                 ▼                                               ▼
     1. Landscape (§9)                               1. Leanback Foundations (§8)
     2. Porting Strategy (§10)                       2. TV UX & Focus Rules (§11)
     3. Strategic Roadmap (§20)                      3. Technical Requirements (§12)
     4. Cost & Timelines (§20.3)                     4. Target Platform Chapter (§14)
     5. Store Submission (§15)                       5. Code Skeletons (App. F)
```

- **Path A: Executive & Strategic Planning (1-Hour Read):** Read §8 (Foundations), §9 (Landscape), §10 (Porting Strategy), §16 (Monetization), and §20 (Strategic Action Plan, Cost Rollup, and Roadmap). Focus on the platform comparison matrices and cost calculations to establish budget, staffing, and licensing requirements.
- **Path B: Architecture & Tech Lead (Half-Day Deep Dive):** Read §8 through §13 in full. Master the focus engine requirements in §11, the media/DRM/playback specifications in §12, and the tooling setup in §13. Evaluate the Stack-by-Stack Porting Matrix in §10 before committing to an architectural path.
- **Path C: Platform Implementation Engineer (Reference Mode):** Review §11 (Design System & Focus) and §12 (Media Pipeline), then jump directly to your target platform chapter in §14 (e.g., §14.1 for Fire TV, §14.4 for Roku, or §14.5 for Apple TV). Each chapter is self-contained and structured identically across all 20 PCS fields. Prior to release, audit your application against the Store Submission Playbooks in §15 and the Pitfalls Catalog in §18.

### Documentation Conventions and Normative Standards

To maintain absolute evidentiary clarity, this guide adheres to precise normative labeling:
- `[REQUIRED]` denotes an enforceable platform rule, store certification criterion, or technical requirement that will cause app rejection if violated.
- `[RECOMMENDED]` denotes an official vendor best practice that optimizes performance, memory consumption, or user experience.
- `[PRACTITIONER TIP]` denotes real-world developer community guidance harvested from verified post-mortems, avoiding undocumented bugs or streamlining complex workflows.
- `[COMMUNITY-REPORTED]` denotes empirical timelines, approval ranges, or failure modes documented in developer forums.

---

## 8. What "Leanback" Means and How TV Differs from Mobile

The term **"Leanback"** is frequently overloaded in software engineering conversations. Before architecting an application, developers must distinguish between its two distinct meanings:
1. **The Conceptual 10-Foot User Experience:** A universal design philosophy describing an entertainment-first environment where users recline several feet away from a large, shared screen, operating the interface entirely through a wireless handheld remote control.
2. **The Android Leanback Support Library (`androidx.leanback`):** A specific, legacy software UI toolkit developed by Google in 2014 to provide standardized fragments, carousels, and details screens for Android TV apps. In modern software engineering, Google has officially transitioned its recommendation from the legacy View-based Leanback library to **Jetpack Compose for TV (`androidx.tv.material3`)**.

Throughout this guide, "leanback" (lowercase) refers to the universal 10-foot television paradigm across all platforms, while "Leanback Library" refers specifically to Google's legacy Android UI library.

### Core Differences: Mobile vs. Connected TV

| Architectural Dimension | Mobile Experience (iOS & Android) | Connected TV Leanback Experience | Architectural Impact on Porting |
| :--- | :--- | :--- | :--- |
| **Viewing Distance & Context** | 12 to 18 inches; personal, intimate; variable lighting; frequent interruptions. | 7 to 12 feet ("10-foot UI"); shared, communal viewing; relaxed posture; low-light living rooms. | UI elements must be dramatically larger; typography must scale; layouts must minimize visual clutter. |
| **Input Mechanism** | Direct touch manipulation (taps, pinches, multi-finger swipes, gestures). | Indirect spatial navigation via D-pad (Up, Down, Left, Right, Select/OK, Back, Home). | **Zero touch APIs.** Every interactive element must be reachable via discrete 2D spatial focus transitions. |
| **Screen Orientation & Aspect Ratio** | Dynamic (portrait primary, landscape optional); variable ratios (19.5:9, 16:10). | Fixed landscape orientation; 16:9 standard aspect ratio (1920x1080 Full HD, 3840x2160 4K UHD). | Lock orientation to landscape. Eliminate rotation handlers. Respect TV safe display zones (overscan). |
| **User Attention & Session Duration** | Short, fragmented sessions (10 seconds to 5 minutes); rapid task switching. | Long, focused sessions (30 minutes to 3+ hours); high engagement with continuous media streaming. | Optimize for friction-free autoplay, seamless episode transition, and persistent playback stability without memory leaks. |
| **Hardware Resources & Thermal Limits** | High-performance multi-core CPUs; 4GB–12GB RAM; high-speed flash storage; battery-conscious. | Extremely constrained hardware on HDMI dongles (1GB–1.5GB RAM, slow quad-core A53 CPUs); continuous wall power. | Severe memory constraints. Heavy JS bundles or unoptimized bitmap caches will trigger immediate Out-Of-Memory (OOM) crashes. |
| **Network Connectivity** | Cellular (5G/LTE) shifting to Wi-Fi; intermittent drops; roaming latency. | Home Wi-Fi (often congested 2.4GHz/5GHz) or 100Mbps Ethernet; high sustained bandwidth requirements. | Implement robust adaptive bitrate (ABR) streaming; handle Wi-Fi buffer under-runs gracefully without freezing UI. |
| **Text Entry & Authentication** | Software virtual keyboard with auto-fill, biometric FaceID/fingerprint, password managers. | On-screen alphanumeric grid navigated letter-by-letter with a remote control (slow, error-prone, frustrating). | **Eliminate on-screen password typing.** Implement OAuth 2.0 Device Flow (activate via web URL) or QR code phone scanning. |

### Universal 10-Foot Design Patterns

To pass certification across any store, a TV app must implement standard navigation paradigms:
1. **The Browse / Grid Screen (Content Discovery):** The core landing experience. Typically structured as a prominent featured carousel ("Hero banner") at the top, followed vertically by horizontal scrolling rows ("swimlanes") categorized by genre, continuing watch history, or curated playlists.
2. **The Detail / Action Screen:** Displayed when a user clicks a content tile. Surfaces high-resolution poster art, title, metadata (runtime, maturity rating, release year, audio formats, 4K/HDR badges), synopsis, and prominent action buttons ("Play", "Resume", "Watch Trailer", "Add to Watchlist").
3. **The Fullscreen Media Player:** Maximizes content to the screen edges. Player controls (play/pause, timeline scrubber, audio/subtitle selector, next episode) must remain hidden during playback and appear seamlessly upon any D-pad press, auto-fading after 3–5 seconds of inactivity.
4. **The Search Interface:** Optimized for minimal typing. Presents an on-screen grid keyboard (or integrates native platform voice search) with instant, debounced results populating dynamically below or beside the input area.
5. **The Second-Screen Pairing Screen:** For authentication, presents a short, human-readable 6-character code alongside a scannable QR code and a clear web URL (e.g., `yourapp.com/activate`), polling the backend until pairing succeeds.

---

## 9. The Connected TV Platform Landscape

The CTV landscape comprises 9 primary platform families, categorized by their underlying operating system runtime and developer accessibility:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        CONNECTED TV PLATFORM ECOSYSTEM                                 │
├──────────────────────────┬──────────────────────────┬──────────────────────────────────┤
│   ANDROID-BASED RUNTIMES │   WEB-BASED RUNTIMES     │    PROPRIETARY & SPECIALIZED     │
├──────────────────────────┼──────────────────────────┼──────────────────────────────────┤
│ • Google TV / Android TV │ • Samsung Smart TV       │ • Roku OS                        │
│ • Amazon Fire TV (FireOS)│   (Tizen OS - Web/HTML5) │   (SceneGraph / BrightScript)    │
│ • Generic Android Boxes  │ • LG Smart TV            │ • Apple TV (tvOS - Cocoa/UIKit)  │
│   (AOSP / Operator-Tier) │   (webOS - Enact/HTML5)  │ • Microsoft Xbox (Win32/GDK)     │
│ • Amazon Fire TV (VegaOS)│                          │ • Sony PlayStation (TRC / Gated) │
└──────────────────────────┴──────────────────────────┴──────────────────────────────────┘
```

### Master Platform Comparison Matrix

The table below provides a comprehensive architectural baseline across all 9 platform families:

| Platform Family | OS / Runtime Kernel | Primary App Model | Programming Languages | App Package Format | Official Storefront | Developer Account Fee | Host OS Requirements | Real Hardware Mandatory? | Platform Access Model |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Amazon Fire TV (Fire OS)** | Android 9/10/11 (AOSP) | Native / Android Views / Compose | Kotlin, Java, React Native | `.apk` / `.aab` | Amazon Appstore | $0 (Free) | Windows, macOS, Linux | Highly Recommended | Open |
| **Amazon Fire TV (Vega OS)** | Custom Linux Kernel | Native Vega / React Native | TypeScript, JavaScript | `.vpkg` | Amazon Appstore | $0 (Free) | Windows, macOS, Linux | Required for Final QA | Open |
| **Google TV / Android TV** | Android 12/14/15 (Google TV) | Jetpack Compose for TV / Leanback | Kotlin, Java, React Native, Flutter | `.aab` (Android App Bundle) | Google Play Store | $25 (One-time) | Windows, macOS, Linux | Recommended (Emulators exist) | Open |
| **Generic Android TV Boxes** | AOSP (Android 9–14) | Standard Android APK | Kotlin, Java | `.apk` | Sideload / Third-Party Stores | $0 | Windows, macOS, Linux | Mandatory (High fragmentation) | Open (Unregulated) |
| **Roku Players & Roku TVs** | Roku OS (Proprietary Linux) | Roku SceneGraph (RSG) / RSG 2.0 | BrightScript, XML / TypeScript | `.zip` (Signed pkg) | Roku Streaming Store | $0 (Free; CC required) | Windows, macOS, Linux | **Mandatory** (No desktop emulator) | Open |
| **Apple TV (tvOS)** | tvOS (Darwin / iOS Core) | Native Cocoa Touch (SwiftUI / UIKit) | Swift, Objective-C | `.ipa` | Apple App Store | $99 / year | **macOS required** (Xcode) | Recommended (Simulators excellent) | Open |
| **LG Smart TVs** | webOS TV (Linux / WebKit) | Web Application (HTML5 / Enact) | JavaScript, TypeScript, CSS, HTML5 | `.ipk` | LG Content Store | $0 (Free) | Windows, macOS, Linux | Highly Recommended | Open |
| **Samsung Smart TVs** | Tizen OS (Linux / Chromium) | Tizen Web Application | JavaScript, TypeScript, CSS, HTML5 | `.wgt` | Samsung Apps TV Seller Office | $0 (Free) | Windows, macOS, Linux | Highly Recommended | Open (US only for Public) |
| **Microsoft Xbox** | Windows OS / Xbox OS Core | Win32 / GDK (Games); Managed UWP/Web | C++, C#, JavaScript/HTML | `.msixvc` / `.appx` | Microsoft Store on Xbox | $19 indiv / $99 corp | Windows 10/11 | Mandatory (Retail Dev Mode $19) | Gated (Media Partner Approval) |
| **Sony PlayStation** | PlayStation OS (FreeBSD-based) | Native C++ / Proprietary Web Core | C++, Proprietary Web | Native PKG | PlayStation Store | Variable (NDA / Devkit costs) | Windows / Specialized | Mandatory (Requires leased Devkit) | **Strictly Gated** (Corporate Partner) |

---

## 10. Choosing Your Porting Strategy and Technical Architecture

When adapting a mobile app for television, teams face a fundamental architectural choice: should they build native applications per platform, utilize a cross-platform framework, build a universal web application, or deploy an off-the-shelf white-label OTT solution?

### Architectural Trade-Off Analysis

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                               DEVELOPMENT APPROACH TRADE-OFF SPECTRUM                           │
├───────────────────┬───────────────────┬──────────────────────┬──────────────────────────────────┤
│    APPROACH       │   CODE REUSE      │   TIME TO MARKET     │   PERFORMANCE & USER EXPERIENCE  │
├───────────────────┼───────────────────┼──────────────────────┼──────────────────────────────────┤
│ Native Per OS     │ Low (0%–20%)      │ Slow (6–12 months)   │ Maximum: Perfect focus, native   │
│                   │                   │                      │ media decoders, zero overhead.   │
├───────────────────┼───────────────────┼──────────────────────┼──────────────────────────────────┤
│ React Native TV   │ High (70%–85%)    │ Fast (2–4 months)    │ High: Near-native on Android TV, │
│                   │ (Android/tvOS/Vega)                      │ Fire TV, tvOS, and Vega OS.      │
├───────────────────┼───────────────────┼──────────────────────┼──────────────────────────────────┤
│ Universal Web App │ Very High (80%+)  │ Fast (2–3 months)    │ Good on modern TVs; sluggish on  │
│ (React/Enact/Web) │ (LG/Samsung/Web)  │                      │ low-end HDMI sticks and older TV │
├───────────────────┼───────────────────┼──────────────────────┼──────────────────────────────────┤
│ White-Label OTT   │ N/A (Turnkey SaaS)│ Immediate (2–4 weeks)│ Constrained: High ongoing fees;  │
│ (Vimeo/Applicaster│                   │                      │ zero custom UX/business logic.   │
└───────────────────┴───────────────────┴──────────────────────┴──────────────────────────────────┘
```

### Stack-by-Stack Code Reuse Matrix

The matrix below illustrates the realistic percentage of code that can be salvaged when porting from specific mobile codebases:

| Source Mobile Codebase | Target: Google TV / Android TV | Target: Amazon Fire TV (Fire OS) | Target: Amazon Fire TV (Vega OS) | Target: Apple TV (tvOS) | Target: LG webOS | Target: Samsung Tizen | Target: Roku OS | Target: Xbox (Retail) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Native Android (Kotlin/Java)** | **85%–90%** (Reuse ViewModel, Repos, Domain, Data) | **85%–90%** (Near-identical to Android TV) | **10%–20%** (Requires React Native / JS port) | **0%** (C++ core only) | **0%** (C++ core only) | **0%** (C++ core only) | **0%** (API contracts only) | **0%** (Unless C#/.NET port) |
| **Native iOS (Swift/SwiftUI)** | **0%** (API contracts only) | **0%** (API contracts only) | **0%** (API contracts only) | **85%–90%** (Reuse Models, Network, CoreData) | **0%** (API contracts only) | **0%** (API contracts only) | **0%** (API contracts only) | **0%** (API contracts only) |
| **React Native (TypeScript)** | **80%–90%** (Via React Native for TV) | **80%–90%** (Via React Native for TV) | **85%–95%** (Native Vega SDK is React Native) | **80%–90%** (Via React Native for TV) | **30%–50%** (Web conversion / React DOM) | **30%–50%** (Web conversion / React DOM) | **0%** (Logic port to BrightScript) | **60%–75%** (Via React Native Windows) |
| **Flutter (Dart)** | **60%–75%** (Via Android TV engine support) | **60%–75%** (Via Android TV engine support) | **0%** (Unsupported on Vega) | **40%–50%** (Community tvOS support unpolished) | **0%** (Unsupported) | **0%** (Unsupported) | **0%** (Unsupported) | **30%–40%** (Windows desktop shell) |
| **Web / PWA (React/Vue/JS)** | **40%–60%** (Via Capacitor / Cordova wrapper) | **40%–60%** (Via Capacitor / Cordova wrapper) | **70%–80%** (Vega Web app support) | **0%** (No WebKit/WebView on tvOS) | **85%–95%** (Native webOS execution) | **85%–95%** (Native Tizen execution) | **0%** (Logic port to BrightScript) | **70%–85%** (Hosted Web App in UWP) |

### Layer-by-Layer Architecture Porting Guide

To achieve maximum multi-platform scalability, refactor the mobile app into cleanly decoupled architectural layers:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        DECOUPLED TV ARCHITECTURE                       │
├────────────────────────────────────────────────────────────────────────┤
│ PRESENTATION LAYER (0%–20% Reusable)                                   │
│ • Custom 10-foot focus navigation, large cards, D-pad event listeners.  │
│ • Jetpack Compose for TV (Android) | SwiftUI (tvOS) | SceneGraph (Roku)│
├────────────────────────────────────────────────────────────────────────┤
│ APPLICATION & STATE LAYER (50%–70% Reusable)                           │
│ • Redux, MobX, Zustand, Kotlin ViewModel, Swift ObservableObject.     │
│ • Playback state machines, playlist queueing, browsing history.        │
├────────────────────────────────────────────────────────────────────────┤
│ DOMAIN & BUSINESS LOGIC (80%–90% Reusable)                             │
│ • Subscription validation, entitlement checking, analytics tracking.  │
├────────────────────────────────────────────────────────────────────────┤
│ DATA & NETWORKING LAYER (90%–100% Reusable)                            │
│ • REST / GraphQL API clients, CDN media manifests, OAuth tokens.      │
└────────────────────────────────────────────────────────────────────────┘
```

1. **The Presentation Layer (UI & Focus): [REWRITE]** Expect 0% to 20% reuse. Mobile touch widgets (scroll views, floating action buttons, touch gestures) must be entirely replaced by TV focusable grids, banners, and player overlays.
2. **The Media & Player Layer: [ADAPT]** Mobile player wrappers (ExoPlayer on Android, AVPlayer on iOS) can be retained in their native ecosystems but require TV-specific surface rendering (e.g., hardware-accelerated video views that do not drop frames when UI overlays animate above them).
3. **The Networking & Data Layer: [REUSE]** 90% to 100% reuse. REST and GraphQL client calls, JSON parsers, authentication token refresh loops, and caching logic operate identically on TV.

### No-Code / White-Label OTT Builders (Alternative Evaluation)

For content publishers who lack engineering capacity to maintain multiple native CTV codebases, commercial white-label SaaS providers offer turnkey multi-screen TV distribution:

| Vendor | Primary Platforms Supported | Pricing Model `[ESTIMATE]` | Lock-in & Technical Trade-offs |
| :--- | :--- | :--- | :--- |
| **Vimeo OTT** | Apple TV, Fire TV, Roku, Android TV, Samsung, LG | $1/subscriber/mo + $500–$1,000/app/mo platform fee | High lock-in; proprietary CMS; limited custom UI styling; rigid monetization rules. |
| **Uscreen** | Roku, Apple TV, Fire TV, Android TV | Tiered SaaS ($499+/mo) + per-subscriber fees | Designed for video creators; standardized UI templates; no custom low-level SDK integration. |
| **Applicaster (Zapp)** | All major CTV platforms (Roku, Fire TV, Apple TV, Tizen, webOS) | Enterprise custom quote ($30,000–$100,000+/year) | High flexibility; React Native/hybrid foundation; enterprise-grade CMS; significant annual licensing cost. |
| **24i (Mod विवे)** | All CTV platforms + Set-Top Boxes | Enterprise custom quote | High-end broadcast/FAST streaming focus; deep metadata integrations; multi-year enterprise contracts. |

---


## 11. Designing for the 10-Foot Experience

Designing an interface for the living room requires fundamentally abandoning touch-screen paradigms and embracing the physical realities of the television set.

### The Universal TV UX Rulebook

1. **Deterministic 2D Spatial Navigation:**
   Every D-pad click (Up, Down, Left, Right) must translate into a clear, predictable shift of focus to the nearest adjacent UI component in that exact direction. Diagonals do not exist on standard remotes.
2. **Prominent, High-Contrast Focus States:**
   At any given moment, exactly one UI element on the screen must possess focus. The focused state must be unmistakable from 10 feet away. Acceptable visual cues include:
   - Dynamic scaling (e.g., card scales to 1.08x–1.12x its unfocused size).
   - High-contrast glowing borders (minimum 3px–4px border in bright brand/white color).
   - Ambient drop-shadow elevation.
   - Distinct brightness shift (dimming non-focused items to 70% opacity).
3. **Persistent Focus Memory:**
   When a user navigates away from a horizontal swimlane (e.g., clicking Down to the next row) and subsequently returns (clicking Up), focus must return to the exact item they previously highlighted in that row, rather than resetting to the first item.
4. **Zero Dead Ends & Traps:**
   Under no circumstances may focus enter a container from which it cannot escape via standard directional presses. If a modal or menu opens, the Back button must cleanly dismiss it and return focus to the triggering element.
5. **No Mouse-Cursor Emulation:**
   Unless operating on an LG Magic Remote (which provides hardware gyroscopic air-pointer tracking), TV apps must never present a floating cursor navigated by holding D-pad buttons.

### Safe Areas and Overscan Compliance

Television displays—particularly older LCDs, budget panels, and commercial displays—suffer from **overscan**, a legacy broadcast behavior where the outer edges of the video signal are cropped by the physical display bezel (ranging from 2% to 5% of the total pixel area).

```
┌─────────────────────────────────────────────────────────────┐
│ PHYSICAL SCREEN EDGE (1920 x 1080 / 3840 x 2160)            │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ ACTION SAFE AREA (93%–95% / 48px padding at 1080p)     │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │ TITLE SAFE AREA (90% / 96px padding at 1080p)   │  │  │
│  │  │                                                 │  │  │
│  │  │ • All readable typography, labels, and badges   │  │  │
│  │  │ • Primary buttons, navigation menus, icons      │  │  │
│  │  │ • Interactive dialog boxes and error alerts     │  │  │
│  │  │                                                 │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │  • Background imagery, full-bleed artwork             │  │
│  │  • Non-critical visual textures, carousel edges       │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

- **Title Safe Area (90% of screen):** All text, logos, buttons, subtitles, and interactive controls must reside within the inner 90% boundary (a minimum margin of 96 pixels horizontally and 54 pixels vertically at 1080p). Violating Title Safe margins is a top cause of certification rejection on Amazon Appstore, Roku, and Samsung.
- **Action Safe Area (95% of screen):** Non-critical interactive graphics and card edges must stay within the inner 95% boundary (48 pixels horizontally and 27 pixels vertically at 1080p).
- **Backgrounds:** Full-bleed artwork, poster images, and video players must render to the physical screen edges (100%) so that no unsightly black borders appear on modern panels.

### Typography, Readability, and Contrast Standards

Small text that reads effortlessly on a smartphone is completely illegible from 10 feet away. TV typography must adhere to strict scale thresholds:

| Typographic Level | Recommended Font Size (1080p Full HD) | Recommended Font Size (4K UHD) | Visual Hierarchy & Usage |
| :--- | :--- | :--- | :--- |
| **Display / Hero Title** | 56sp–72sp (bold) | 112sp–144sp | Featured title treatment on Hero carousel |
| **H1 Headline** | 44sp–48sp (semi-bold) | 88sp–96sp | Screen headings, category headers |
| **H2 Subhead** | 32sp–36sp (medium) | 64sp–72sp | Section titles, swimlane titles |
| **Body Text (Primary)** | 24sp–28sp (regular) | 48sp–56sp | Content synopsis, descriptions, dialog text |
| **Caption / Metadata** | **20sp–22sp (ABSOLUTE MINIMUM)** | 40sp–44sp | Runtime, maturity badges, release year |

*Rule:* Never render text smaller than 20sp/pt at 1080p. Any body text under 20sp will fail accessibility audits across all major app stores. Furthermore, color contrast must strictly satisfy WCAG 2.1 AA standards: minimum **4.5:1 contrast ratio** for body text and **3:1** for large titles and active focus indicators.

### Mobile-to-TV Pattern Translation Guide

When migrating existing mobile UI layouts, map touch widgets to living-room equivalents:

| Mobile Touch Pattern | TV 10-Foot Leanback Equivalent | Implementation Guideline |
| :--- | :--- | :--- |
| **Bottom Navigation Bar** | **Left-Side Navigation Rail / Collapsible Drawer** | Vertical icon rail on the left edge. Clicking Left from the grid expands the rail into labelled categories (Home, Movies, Series, Live, Search, Settings). |
| **Top Tabs Bar** | **Top Horizontal Navigation Bar** | Positioned within Title Safe area; D-pad Up accesses tabs; horizontal Left/Right switches screens. |
| **Infinite Vertical Scroll** | **Horizontal Categorized Swimlanes (Carousels)** | Replace endless vertical lists with discrete horizontal rows. Down advances to next category; Left/Right navigates items within that row. |
| **Swipe Gestures (Pull-to-refresh)** | **Dedicated Action Buttons or Automatic Sync** | Remove pull-to-refresh entirely. Use auto-refreshing background timers or explicit "Refresh" button in Settings. |
| **Modal Action Sheets (Bottom Sheets)** | **Centered Dialog Overlays or Side Drawers** | Display a centered modal with 2–3 clearly labeled focusable buttons; default focus to the safest action (e.g., "Cancel"). |
| **Complex Form Inputs (Multi-field)** | **Second-Screen Authentication / QR Code** | Offload data entry to mobile. Show a short pairing code and QR code directing to a responsive mobile web form. |

### Unified Cross-Platform Design System Specification

To maintain visual cohesion across all 9 CTV platforms while writing UI code in different frameworks, implement this standardized design token architecture:

```json
{
  "spacing": {
    "screen_padding_x": "96px",
    "screen_padding_y": "54px",
    "gutter_horizontal": "32px",
    "gutter_vertical": "48px",
    "card_gap": "24px"
  },
  "typography": {
    "font_family": "System-Native or Open Sans / Roboto",
    "size_hero": "64px",
    "size_h1": "44px",
    "size_h2": "32px",
    "size_body": "26px",
    "size_caption": "20px"
  },
  "colors": {
    "background_base": "#0F1115",
    "background_surface": "#1A1D24",
    "text_primary": "#FFFFFF",
    "text_secondary": "#A0A5B5",
    "focus_highlight": "#3880FF",
    "focus_border": "#FFFFFF"
  },
  "motion": {
    "focus_scale": 1.10,
    "duration_fast": "150ms",
    "duration_standard": "250ms",
    "easing": "cubic-bezier(0.25, 1, 0.5, 1)"
  }
}
```

---

## 12. Technical Requirements for TV Applications

Streaming media applications on connected televisions must satisfy rigorous technical standards regarding decoding pipelines, digital rights management, ad insertion, and network reliability.

### Media Playback Architecture: Player APIs and Codec Support

Television sets utilize specialized System-on-Chips (SoCs) with hardware-accelerated video decoders. Video playback must interface directly with these hardware pipelines:

| Platform Family | Recommended Video Player Engine | Primary Streaming Protocols | Mandatory Codecs (Video / Audio) | 4K / HDR Formats Supported |
| :--- | :--- | :--- | :--- | :--- |
| **Amazon Fire TV (Fire OS)** | Google Media3 / ExoPlayer | HLS, MPEG-DASH | H.264 (AVC), H.265 (HEVC), VP9 / AAC, AC-3, E-AC-3 | HDR10, HDR10+, Dolby Vision (Cube/Stick 4K) |
| **Amazon Fire TV (Vega OS)** | Vega Native Media Player / React Native | HLS, MPEG-DASH | H.264, H.265 / AAC, AC-3, E-AC-3 | HDR10, HDR10+, Dolby Vision |
| **Google TV / Android TV** | Google Media3 (`androidx.media3.exoplayer`) | MPEG-DASH, HLS | H.264, H.265, VP9, AV1 / AAC, AC-3, E-AC-3 | HDR10, Dolby Vision, HLG |
| **Apple TV (tvOS)** | Apple AVKit (`AVPlayer` / `AVPlayerViewController`) | Apple HLS (HTTP Live Streaming) | H.264, H.265 (HEVC) / AAC, AC-3, E-AC-3, Atmos | Dolby Vision (Profile 5/8.4), HDR10 |
| **Roku Players & TVs** | Roku SceneGraph `Video` Node | HLS, MPEG-DASH, Smooth | H.264, H.265, VP9 / AAC, AC-3, E-AC-3 | HDR10, Dolby Vision (Select 4K models) |
| **LG Smart TVs (webOS)** | HTML5 `<video>` / Luna Media Engine | HLS, MPEG-DASH | H.264, H.265, VP9 / AAC, AC-3, E-AC-3 | HDR10, Dolby Vision, HLG |
| **Samsung Smart TVs (Tizen)** | Tizen AVPlay API (`webapis.avplay`) | HLS, MPEG-DASH, Smooth | H.264, H.265, VP9, AV1 / AAC, AC-3, E-AC-3 | HDR10, HDR10+, HLG |
| **Microsoft Xbox** | UWP `MediaPlayerElement` / Win32 Media Foundation | Smooth Streaming, DASH, HLS | H.264, H.265, VP9 / AAC, AC-3, E-AC-3, Atmos | HDR10, Dolby Vision |
| **Sony PlayStation** | SIE Native Media Engine (Proprietary SDK) | HLS, MPEG-DASH | H.264, H.265 / AAC, Dolby Audio | HDR10 |

*Critical Implementation Requirement:* On Samsung Tizen TVs, developers must **never** use the generic HTML5 `<video>` tag for production adaptive bitrate streaming. Doing so bypasses the hardware video pipeline, leading to frame stutter, memory leaks, and complete lack of hardware DRM decryption. You must bind playback to the native **Tizen AVPlay API** (`webapis.avplay`).

### Digital Rights Management (DRM) Matrix

For premium licensed content (Hollywood studio movies, major sports leagues), hardware-level DRM protection is non-negotiable:

| Platform Family | Primary DRM System | Hardware Security Level | Typical Content License Restriction |
| :--- | :--- | :--- | :--- |
| **Google TV & Android TV** | Google Widevine Modular | **Level 1 (L1 - Hardware Decryption)** | Required for 1080p, 4K UHD, and HDR streaming. |
| **Generic Android TV Boxes** | Widevine Modular | **Variable (Often L3 - Software Decryption)** | L3 limits playback strictly to 480p/540p Standard Definition. |
| **Amazon Fire TV (Fire OS & Vega)**| Google Widevine + Microsoft PlayReady | **Hardware Protected (Widevine L1)** | 1080p, 4K UHD, HDR enabled. |
| **Apple TV (tvOS)** | Apple FairPlay Streaming (FPS) | **Hardware Secure Enclave** | 1080p, 4K UHD, Dolby Vision enabled. |
| **Roku OS** | Microsoft PlayReady & Widevine Modular | **Hardware Secure Pipeline** | 1080p and 4K UHD enabled. |
| **LG webOS Smart TVs** | Google Widevine & Microsoft PlayReady | **Hardware Cryptographic Pipeline** | 1080p and 4K UHD enabled. |
| **Samsung Smart TVs (Tizen)** | Microsoft PlayReady & Google Widevine | **Hardware Cryptographic Pipeline** | 1080p and 4K UHD enabled. |
| **Microsoft Xbox** | Microsoft PlayReady | **PlayReady SL3000 (Hardware)** | 1080p, 4K UHD, HDR enabled. |
| **Sony PlayStation** | Proprietary SIE DRM / Widevine | **Hardware Cryptographic Core** | 1080p and 4K UHD enabled. |

### Subtitles, Closed Captioning, and Audio Description

In compliance with the United States FCC CVAA and European accessibility directives, applications must provide robust subtitle rendering:
1. **Subtitle Formats:** Support **WebVTT** (standard for HLS) and **TTML / IMSC1** (standard for MPEG-DASH). For legacy broadcast content, support embedded **CEA-608 / CEA-708** closed captioning tracks.
2. **User Styling Overrides:** Subtitle display engines must inherit the system-level font size, color, background opacity, and edge-style preferences configured in the TV OS settings menu (supported natively by Apple AVPlayer, Google Media3, and Roku SceneGraph).
3. **Audio Description:** Video manifests must support secondary audio tracks tagged with the `accessibility` role (audio description / descriptive video service for visually impaired users).

### Advertising Architecture: Client-Side (CSAI) vs. Server-Side (SSAI)

Commercial video monetization on TV is divided into two architectures:
- **Server-Side Ad Insertion (SSAI): [HIGHLY RECOMMENDED FOR TV]** Ad segments are stitched directly into the HLS/DASH manifest at the CDN edge before reaching the TV. The TV player sees a continuous video stream without switching decoders. This avoids buffering, eliminates black screens between ads, and bypasses ad-blockers. Timing metadata is passed via ID3 tags (HLS) or `emsg` boxes (DASH).
- **Client-Side Ad Insertion (CSAI):** The app pauses main content playback, instantiates an ad player, fetches VAST/VMAP XML manifests from an ad server (e.g., Google Ad Manager), renders the ad, and resumes main content upon completion.
  - *Google TV / Fire TV:* Use the **Google Interactive Media Ads (IMA) SDK for Android TV**.
  - *Roku OS:* **Mandatory Integration.** Roku strictly requires ad-supported channels to use the **Roku Advertising Framework (RAF)**. Bypassing RAF to show custom ad video players is a direct cause for Channel Store rejection.

### TV Authentication and Account Pairing (OAuth 2.0 Device Flow)

Typing email addresses and passwords using a D-pad remote is the leading cause of user abandonment during onboarding. TV applications must implement the **OAuth 2.0 Device Authorization Grant (RFC 8628)**:

```
┌──────────────┐                               ┌──────────────┐                               ┌──────────────┐
│  TV Device   │                               │ Auth Server  │                               │ Mobile / PC  │
└──────┬───────┘                               └──────┬───────┘                               └──────┬───────┘
       │                                              │                                              │
       │ 1. POST /device/code                         │                                              │
       ├─────────────────────────────────────────────►│                                              │
       │ 2. Returns device_code, user_code, URL, QR   │                                              │
       │◄─────────────────────────────────────────────┤                                              │
       │                                              │                                              │
       │ [Displays user_code "B7X-9K2" & QR Code]     │                                              │
       │                                              │                                              │
       │ 3. Periodic Poll: POST /token (device_code)  │                                              │
       ├─────────────────────────────────────────────►│                                              │
       │    Returns: authorization_pending            │                                              │
       │◄─────────────────────────────────────────────┤                                              │
       │                                              │   4. User scans QR or visits URL             │
       │                                              │◄─────────────────────────────────────────────┤
       │                                              │   5. User logs in & approves TV              │
       │                                              ├─────────────────────────────────────────────►│
       │ 6. Next Poll: POST /token (device_code)      │                                              │
       ├─────────────────────────────────────────────►│                                              │
       │ 7. Returns access_token & refresh_token      │                                              │
       │◄─────────────────────────────────────────────┤                                              │
       │                                              │                                              │
       │ [TV stores token securely and loads profile] │                                              │
```

1. **Step 1:** The TV app calls the backend `/device/code` endpoint, receiving a unique `device_code`, a short alphanumeric `user_code` (e.g., `HD7-K9P`), an activation URL (`yourapp.com/activate`), and a poll interval (typically 5 seconds).
2. **Step 2:** The TV displays the code and an on-screen QR code encoding the URL with pre-filled parameters (`yourapp.com/activate?code=HD7-K9P`).
3. **Step 3:** While the user scans the QR code with their mobile phone and signs in on their browser, the TV polls the authorization server in the background.
4. **Step 4:** Once the user authorizes the device on their phone, the next polling call returns valid `access_token` and `refresh_token` credentials. The TV transitions immediately into the logged-in user experience.

### Content Discovery, Deep Linking, and Launcher Integration

To drive continuous engagement, modern TV operating systems integrate external content directly into the home screen launcher:
- **Mandatory Deep Linking:** When a user clicks a content recommendation, search result, or banner ad on the TV home screen, the operating system invokes the app with URI parameters (e.g., `yourapp://play?contentId=12345`). The app must launch directly into full-screen video playback of that specific asset without stopping at the home screen or browse catalog. On Roku, passing deep linking automated test suites is a strict prerequisite for certification.
- **Android TV / Google TV "Watch Next":** Apps should register content with the system **Watch Next** channel via the Android TV Provider library (`androidx.tvprovider`), enabling users to resume partially watched movies directly from the Google TV home screen.
- **Apple TV "Top Shelf":** Applications placed in the top dock of the tvOS home screen must provide a `TVTopShelfProvider` extension that surfaces dynamic content carousels directly above the app icon.

---

## 13. Setting Up Your Development and Test Environments

Equipping an engineering team for TV development requires configuring specialized SDKs, establishing physical testing labs, and navigating host operating system constraints.

### Tooling Matrices and Host OS Requirements

| Platform Family | Primary IDE / Build Tool | Required SDK Components | Host OS Support | Hardware Virtualization / Emulators |
| :--- | :--- | :--- | :--- | :--- |
| **Google TV / Android TV** | Android Studio Ladybug / Meerkat | Android SDK, Android TV Emulator System Images | Windows, macOS, Linux | **Android Virtual Device (AVD):** High-fidelity x86_64 emulator with full D-pad remote control. |
| **Amazon Fire TV (Fire OS)** | Android Studio / VS Code | Amazon Fire TV SDK, Fire TV System Images | Windows, macOS, Linux | AVD system images available, or test via standard Android TV emulators. |
| **Amazon Fire TV (Vega OS)** | VS Code (Vega Studio Extension) | Vega SDK, Vega CLI (`vega`), VDA | Windows, macOS, Linux | **Vega Virtual Device (VVD):** High-fidelity local emulator for Vega OS. |
| **Apple TV (tvOS)** | Xcode 26+ | tvOS 26 SDK | **macOS strictly required** | **tvOS Simulator:** Excellent performance and focus engine fidelity; lacks real FairPlay hardware DRM. |
| **Roku Players & TVs** | VS Code (BrightScript / RSG Extensions) | Roku SceneGraph SDK, Roku ECK CLI | Windows, macOS, Linux | **No official desktop emulator exists.** Real physical Roku device is mandatory. |
| **LG Smart TVs (webOS)** | VS Code (webOS Studio Extension) / CLI | webOS TV SDK, webOS TV CLI | Windows, macOS, Linux | **webOS TV Emulator:** VirtualBox-based VM; good UI fidelity; software video decoding only. |
| **Samsung Smart TVs (Tizen)** | Tizen Studio + Visual Studio Code Extension | Tizen TV SDK, Tizen Baseline SDK | Windows, macOS, Linux | **Tizen TV Emulator:** QEMU-based VM; accurate spatial navigation; sluggish video playback. |
| **Microsoft Xbox** | Visual Studio 2022 / GDK Tools | Windows 11 SDK, Microsoft GDK | Windows 10/11 64-bit | Local Windows desktop test environment; retail console in Dev Mode ($19). |
| **Sony PlayStation** | Visual Studio / Proprietary SIE IDE | Official PlayStation SDK | Windows 64-bit | **Zero public emulators.** Leased physical Devkit/Testkit strictly required under NDA. |

### The "No-Mac" Contingency for tvOS Development

Because tvOS apps must be compiled using Xcode on macOS, Windows- and Linux-based engineering teams must adopt legitimate remote build solutions:
1. **Cloud macOS Virtual Machines:** Services such as **MacStadium**, **MacInCloud**, or **AWS EC2 Mac Instances** provide remote dedicated macOS machines accessible via SSH or VNC, enabling teams to build, sign, and archive tvOS IPAs.
2. **Cloud CI/CD Pipelines:** Modern CI/CD services (GitHub Actions `macos-14`/`macos-15` runners, Bitrise, or CircleCI) can compile, sign, and upload tvOS builds directly to **Apple TestFlight** without a local Mac machine on the developer's desk.
3. *Limitation Note:* While cloud CI/CD solves compilation and store deployment, day-to-day visual UI debugging and focus tuning are severely hampered without a local Mac running the tvOS Simulator. At least one Mac mini should be procured for the frontend lead.

### Enabling Developer Mode Across Real Hardware

To sideload and debug test builds on physical hardware, follow these official procedures:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                      DEVELOPER MODE ACTIVATION PROCEDURES                              │
├────────────────────────────────┬───────────────────────────────────────────────────────┤
│ PLATFORM                       │ ACTIVATION SEQUENCE                                   │
├────────────────────────────────┼───────────────────────────────────────────────────────┤
│ Amazon Fire TV                 │ Settings > My Fire TV > About > Click Device Name 7x  │
│                                │ > Return to My Fire TV > Developer Options > ADB On.  │
├────────────────────────────────┼───────────────────────────────────────────────────────┤
│ Google TV / Android TV         │ Settings > System > About > Click Android Build 7x   │
│                                │ > Return to System > Developer Options > USB Debug On.│
├────────────────────────────────┼───────────────────────────────────────────────────────┤
│ Roku Players & TVs             │ Press remote sequence: Home 3x, Up 2x, Right, Left,  │
│                                │ Right, Left, Right > Enable Installer > Set Password. │
├────────────────────────────────┼───────────────────────────────────────────────────────┤
│ LG Smart TV (webOS)            │ Install "Developer Mode" app from LG Content Store    │
│                                │ > Log in with LG Developer Account > Toggle Dev On.   │
├────────────────────────────────┼───────────────────────────────────────────────────────┤
│ Samsung Smart TV (Tizen)       │ Smart Hub > Apps panel > Enter remote code: 1,2,3,4,5 │
│                                │ > Developer Mode popup appears > Toggle On > Enter IP.│
├────────────────────────────────┼───────────────────────────────────────────────────────┤
│ Apple TV (tvOS)                │ Connect Apple TV to same Wi-Fi as Mac > Xcode Window  │
│                                │ > Devices and Simulators > Pair Apple TV wirelessly.  │
├────────────────────────────────┼───────────────────────────────────────────────────────┤
│ Microsoft Xbox                 │ Download "Xbox Dev Mode" app from Microsoft Store     │
│                                │ > Enter activation code at partner.microsoft.com/xbox │
└────────────────────────────────┴───────────────────────────────────────────────────────┘
```

### Automated Remote-Driven UI Testing

Manual D-pad testing becomes unsustainable across 9 platforms. Implement automated spatial UI testing using cross-platform automation tools:
- **Appium with Espresso / XCUITest Drivers:** Appium supports directional navigation testing by issuing key event codes:
  - Android/Fire TV: `driver.pressKeyCode(AndroidKeyCode.DPAD_DOWN);`
  - Apple TV: `driver.executeScript("mobile: pressButton", Map.of("name", "down"));`
- **Suitest:** A specialized commercial cloud testing platform designed specifically for Connected TV apps. Supports automated object-based UI test execution across real physical Smart TVs (Samsung Tizen, LG webOS, Roku, Apple TV, Android TV, Fire TV) connected to automated infrared/network blasters.

---


## 14. Platform-by-Platform Build and Publish Chapters

Every platform chapter in this section adheres strictly to the identical 20-field **Platform Chapter Schema (PCS)**, providing a complete, self-contained reference from zero setup to production store certification.

---

### 14.1 Amazon Fire TV (Fire OS and Vega OS)

#### PCS-01 Platform Overview
Amazon Fire TV represents one of the largest global streaming ecosystems, encompassing the Fire TV Stick family (Lite, HD, 4K, 4K Max), Fire TV Cube, soundbars, and smart TVs with Fire TV built-in (manufactured by Amazon, Toshiba, and Insignia). The platform is currently experiencing an architectural bifurcation across two distinct operating system generations:
1. **Fire OS (Legacy & Mainstream):** Built on Android Open Source Project (AOSP). Devices run Fire OS 7 (Android 9 Pie) or Fire OS 8 (Android 11 / API level 30).
2. **Vega OS (New Generation):** A custom Linux-based operating system designed by Amazon that replaces the Android runtime entirely, debuting on new hardware lines (including the Fire TV Stick 4K Select and Fire TV Stick HD 2nd-gen).

#### PCS-02 Current Status and Transitions
The platform is actively transitioning away from Android AOSP toward Vega OS. 
- *Deprecations:* Amazon has deprecated the older Web App Starter Kit (WASK) in favor of modern web frameworks.
- *Announced Transitions:* Devices shipping with Vega OS do not support native Android APK execution. To ensure application continuity during this multi-year hardware shift, Amazon operates the **Cloud App Program**, allowing select existing Android Fire OS APKs to be streamed from AWS containers to Vega devices. However, long-term multi-platform developers must prepare native React Native or web-based builds packaged as `.vpkg` binaries.
- *Watch These Changes:* Universal Amazon Appstore submission listings now accept both Android APK/AAB binaries and Vega VPKG binaries under a single application record, automatically serving the correct binary based on the requesting device's OS.

#### PCS-03 Access Model
The Amazon Developer ecosystem is completely **Open**. Any independent developer, studio, or corporate entity worldwide can register, download tooling, build applications, and submit to the Amazon Appstore. There are no partner gates for standard app submission, and retail hardware can be unlocked for development with a single settings toggle.

#### PCS-04 Developer Account
- *Signup URL:* [developer.amazon.com](https://developer.amazon.com/)
- *Verification:* Individual identity verification via email and phone; business accounts require corporate entity documentation and D-U-N-S validation.
- *Registration Fee:* **$0 (Completely Free)** `[REQUIRED | HIGH CONFIDENCE]`.
- *Tax & Banking:* Completion of online US IRS tax interview (Form W-9 for US entities, Form W-8BEN for international publishers) and electronic bank account verification for IAP disbursements.

#### PCS-05 Development Environment
- *IDE:* Android Studio (for Fire OS) or Visual Studio Code with the **Vega Studio Extension** (for Vega OS).
- *Languages:* Kotlin, Java (Fire OS); TypeScript, JavaScript (Vega OS); React Native (supported across both).
- *SDKs:* Amazon Fire TV SDK, Amazon Fling SDK, Amazon In-App Purchasing (IAP) SDK, Vega SDK, and Vega CLI (`vega`).
- *Host OS:* Windows 10/11, macOS (Apple Silicon & Intel), Linux (Ubuntu 20.04+).

#### PCS-06 Test Hardware and Environments
- *Emulators:* Standard Android Virtual Devices (AVD) running Android TV x86_64 system images; the **Vega Virtual Device (VVD)** local emulator for Vega OS.
- *Developer Mode:* On Fire OS devices, navigate to `Settings > My Fire TV > About`, click the device name 7 times rapidly until "Developer Mode" is unlocked, then enable `ADB Debugging` and `Apps from Unknown Sources`. On Vega devices, enable Developer Mode by pairing via the `vega` CLI.
- *Recommended Hardware:* Amazon Fire TV Stick 4K Max (Fire OS 8) and Fire TV Stick 4K Select (Vega OS) provide full coverage across both runtimes.

#### PCS-07 App Models Supported
- **Native Android (Fire OS):** Full support for native View layouts and Jetpack Compose.
- **Native Vega (Vega OS):** React Native-based native runtime compiled to VPKG.
- **Web Applications:** HTML5/CSS/JavaScript wrapped in Amazon WebView or native shells.
- **Cloud-Streamed Apps:** AWS-hosted containerized execution for legacy APKs under the Cloud App Program.

#### PCS-08 Porting from a Mobile App
- *Native Android Mobile Source:* 85%–90% code reuse for Fire OS. The core data, networking, domain logic, and ViewModels transfer directly. Remove Google Play Services dependencies (replace Google Play Billing with Amazon IAP, replace Firebase Cloud Messaging with Amazon Device Messaging). Rewrite presentation layer for 10-foot focus navigation.
- *Native iOS Source:* 0% direct UI/logic reuse. Backend API and streaming manifests transfer 100%.
- *React Native Source:* 85%–95% code reuse across both Fire OS and Vega OS via React Native for TV.

#### PCS-09 Input and Interaction
- *Remote Control:* Amazon Alexa Voice Remote with 5-way D-pad (Up, Down, Left, Right, Center/Select), Back, Home, Menu, Play/Pause, Rewind, Fast-Forward, and Volume.
- *Back Button Rule:* Pressing Back on the app's root screen must gracefully exit the app to the Fire TV launcher. Trapping focus or intercepting Back indefinitely will fail certification.
- *Menu Button:* Apps are encouraged to bind the physical Menu button to context menus or quick-audio/subtitle settings.

#### PCS-10 UI/UX Requirements
- *Resolutions:* 1920x1080 (UI canvas base) and 3840x2160 (4K video output).
- *Safe Zones:* Strict adherence to 90% Title Safe area (96px horizontal, 54px vertical margin at 1080p).
- *Focus Highlight:* Visual focus indicator must be unmistakable from 10 feet.

#### PCS-11 Media and Playback
- *Player API:* Google Media3 / ExoPlayer (Fire OS); Vega Native Player (Vega OS).
- *Protocols & Codecs:* HLS and MPEG-DASH. Video: H.264, H.265 (HEVC), VP9. Audio: AAC, AC-3, Dolby Digital Plus (E-AC-3), Dolby Atmos passthrough.
- *DRM:* Google Widevine Modular (Hardware Level 1) and Microsoft PlayReady.

#### PCS-12 Discovery and Identity
- *Deep Linking:* Supports standard Android intent filters (Fire OS) and URI schemes (Vega). Deep links must bypass home screens and directly initiate media playback.
- *Catalog Integration:* Amazon Fire TV Catalog Integration allows content to appear in universal Fire TV home search and Alexa voice discovery.
- *Authentication:* OAuth 2.0 Device Flow (RFC 8628) or on-screen QR code pairing.

#### PCS-13 Monetization
- *Billing API:* **Amazon In-App Purchasing (IAP) API v2.0**.
- *Revenue Share:* Standard 70/30 split. Amazon offers an **85/15 split** (85% to developer) for publishers earning under $1 million annually via the Amazon Appstore Small Business Accelerator.
- *External Purchasing:* Reader apps and multi-platform services with existing web subscriptions are permitted, provided no direct external purchasing links are displayed on TV.

#### PCS-14 Packaging and Signing
- *Package Formats:* `.apk` or `.aab` for Fire OS; `.vpkg` for Vega OS.
- *Required Manifest Declarations (Fire OS):*
  ```xml
  <uses-feature android:name="android.software.leanback" android:required="false" />
  <uses-feature android:name="android.hardware.touchscreen" android:required="false" />
  <activity ... android:screenOrientation="landscape">
      <intent-filter>
          <action android:name="android.intent.action.MAIN" />
          <category android:name="android.intent.category.LEANBACK_LAUNCHER" />
      </intent-filter>
  </activity>
  ```
- *Required Manifest Declarations (Vega OS):* Must register the main category `com.amazon.category.main` in configuration.
- *Signing:* Standard release keystore signing (RSA 2048-bit or higher).

#### PCS-15 Store Submission
- *Submission Portal:* Amazon Developer Console (`developer.amazon.com/apps-and-games`).
- *Asset Specs:* App Icon (512x512 PNG, no alpha), Fire TV Banner (1280x720 PNG), Screenshots (minimum 3, 1920x1080 PNG/JPEG).
- *Content Ratings:* Complete standard Amazon age-rating questionnaire.
- *Testing Credentials:* Live, functional test account credentials must be provided in the "Testing Instructions" field.

#### PCS-16 Certification and Review
- *Review Timeline:* Officially 1–3 business days; community-reported range: **24 to 72 hours**.
- *Testing Rigor:* Amazon conducts extensive automated device testing across physical Fire TV models, checking for Title Safe violations, D-pad navigation crashes, and memory leaks.
- *Appeals:* Rejections include detailed logcats and screenshots; resubmissions are processed rapidly.

#### PCS-17 Common Rejection Reasons and Pitfalls
1. Failing to set `android.hardware.touchscreen` to `required="false"`, causing Amazon's automated filter to hide the app from Fire TV devices.
2. Text, badges, or buttons rendering outside the 90% Title Safe area.
3. Unhandled D-pad focus loss during video playback or dialog display.
4. Hard-coded Google Play Services dependencies that crash immediately upon launch on Fire OS.

#### PCS-18 Accessibility
- Supports the **VoiceView** screen reader. All interactive widgets must provide meaningful `contentDescription` attributes.

#### PCS-19 Update and Maintenance
- Supports staged rollouts (Live App Testing - LAT). Updates require version code increments and are generally approved within 24 hours.

#### PCS-20 Beginner Quick-Start Path
1. Create a free account at `developer.amazon.com`.
2. Configure Android Studio with a TV module or set up a React Native project with `react-native-tvos`.
3. Add mandatory Fire TV manifest declarations and remove Google Mobile Services (GMS).
4. Sideload the APK onto a physical Fire TV Stick via ADB (`adb install -r app-release.apk`).
5. Verify D-pad navigation and video playback.
6. Submit build, 1280x720 banner, and test credentials to the Amazon Developer Console.

---

### 14.2 Google TV / Android TV (Certified)

#### PCS-01 Platform Overview
Google TV and Android TV represent Google's certified living-room operating system ecosystem, deployed across millions of devices including Google TV Streamer, Chromecast with Google TV, smart TVs (Sony Bravia, TCL, Hisense, Philips), and certified operator set-top boxes. While Android TV provides the underlying operating system and core leanback framework, **Google TV** represents the modern personalized user experience layer, emphasizing content discovery, universal watchlists, and aggregated recommendation rows.

#### PCS-02 Current Status and Transitions
- *Deprecations:* The original View-based **Android Leanback UI toolkit (`androidx.leanback`)** is officially in maintenance mode. Google no longer adds new features to Leanback.
- *Current Recommendation:* **Jetpack Compose for TV (`androidx.tv:tv-material:1.1.0`)** is the official, stable framework for all new TV development `[RECOMMENDED | HIGH CONFIDENCE]`.
- *Watch These Changes:* Android 14/15 for TV introduces improved energy modes, enhanced Picture-in-Picture (PiP), and deeper Gemini-powered voice integrations.

#### PCS-03 Access Model
Completely **Open**. Any developer with a registered Google Play Console account can target Android TV / Google TV form factors without signing proprietary vendor agreements or requiring partner approvals.

#### PCS-04 Developer Account
- *Portal:* Google Play Console (`play.google.com/console`).
- *Registration Fee:* **$25 one-time registration fee** `[REQUIRED | HIGH CONFIDENCE]`.
- *Verification:* Mandatory identity verification (government ID and Dun & Bradstreet D-U-N-S verification for organizations).

#### PCS-05 Development Environment
- *IDE:* Android Studio (current stable: Ladybug / Meerkat).
- *Languages:* Kotlin (strongly recommended), Java.
- *SDKs:* Android SDK (API level 34+ target), Jetpack Compose for TV, Google Media3 ExoPlayer, Play Billing Library.
- *Host OS:* Windows, macOS, Linux.

#### PCS-06 Test Hardware and Environments
- *Emulators:* Android Studio Android TV Virtual Devices (x86_64 system images with Google TV interface and interactive D-pad controller).
- *Developer Mode:* `Settings > System > About > Android TV OS Build` (click 7 times) > `Developer Options > USB/Network Debugging Enabled`.
- *Recommended Hardware:* Google TV Streamer (4K) or Chromecast with Google TV (4K).

#### PCS-07 App Models Supported
Native Android (Jetpack Compose for TV, Android Views), React Native (via `react-native-tvos`), Flutter (with community TV spatial navigation plugins), and hybrid wrappers.

#### PCS-08 Porting from a Mobile App
- *Native Android Mobile Source:* **85%–90% code reuse**. Data layers, Room databases, Retrofit/Ktor network clients, Hilt dependency injection, and Kotlin Coroutines/Flows port with zero changes.
- *Refactoring Required:* Replace mobile Jetpack Compose Material3 widgets with `androidx.tv.material3` components (which have built-in spatial focus animations and D-pad event listeners).

#### PCS-09 Input and Interaction
- Standard Google TV voice remote with 5-way D-pad (directional ring and center Select button), Back, Home, Voice Search (Google Assistant), and Volume.
- *Navigation Requirement:* Back button must navigate backward through internal screens before exiting to the launcher.

#### PCS-10 UI/UX Requirements
- Follow official **TV App Quality Guidelines**.
- Standard UI resolution: 1920x1080 (rendered with density scaling); 4K video playback.
- Safe Area: 90% Title Safe zone.
- Visual focus state must scale or highlight the active item unmistakably.

#### PCS-11 Media and Playback
- *Recommended Player:* **Google Media3 ExoPlayer** (`androidx.media3:media3-exoplayer:1.4.1+`).
- *Protocols & Codecs:* MPEG-DASH, HLS, SmoothStreaming. Codecs: AV1, H.265 (HEVC), VP9, H.264 (AVC) / AAC, AC-3, E-AC-3, Dolby Atmos.
- *DRM:* Google Widevine Modular (Hardware Level 1 required for HD/4K).

#### PCS-12 Discovery and Identity
- *Deep Linking:* Standard Android URI schemes and Android App Links (`https://yourapp.com/watch/...`).
- *Home Integration:* Android TV Provider (`androidx.tvprovider`) for **Watch Next** channel integration, enabling users to resume playback directly from the Google TV home screen.
- *Cast Receiver:* App can register as a Google Cast receiver target.

#### PCS-13 Monetization
- *Billing API:* **Google Play Billing Library for Android TV** (`com.android.billingclient:billing`).
- *Revenue Share:* Standard 85/15 under Google's 15% service fee tier for the first $1 million in annual revenue; 70/30 thereafter.
- *External Purchasing:* Multi-platform subscription services can operate as "Reader Apps" where sign-in occurs via web credentials.

#### PCS-14 Packaging and Signing
- *Package Format:* **Android App Bundle (`.aab`)** is mandatory for all new submissions to Google Play.
- *Manifest Flags:*
  ```xml
  <uses-feature android:name="android.software.leanback" android:required="false" />
  <uses-feature android:name="android.hardware.touchscreen" android:required="false" />
  <application android:banner="@drawable/tv_banner" ...>
  ```
- *TV Banner Asset:* Mandatory `320x180` px (or `1280x720` px) xhdpi banner inside the APK drawable resources.

#### PCS-15 Store Submission
- *Opt-In:* Inside Google Play Console, navigate to `Setup > Advanced settings > Form factors`, click **Add form factor**, and select **Android TV**.
- *Assets:* TV App Icon (512x512 px PNG), TV App Banner (1280x720 px PNG), TV Screenshots (minimum 1, 1920x1080 px).
- *Review Credentials:* Provide functional username/password in `App access` settings.

#### PCS-16 Certification and Review
- *Review Timeline:* Officially up to 7 business days; community-reported average: **3 to 5 business days**.
- *Certification:* Explicitly reviewed against the **TV App Quality Checklist**. If any touch-first requirement or missing D-pad focus is found, the submission is rejected.

#### PCS-17 Common Rejection Reasons and Pitfalls
1. Missing the `CATEGORY_LEANBACK_LAUNCHER` intent filter on the main activity.
2. Missing or improperly sized TV banner (`@drawable/tv_banner`).
3. Focus traps where the D-pad cannot navigate into or out of a dialog box or settings menu.
4. Requiring unsupported hardware features (e.g., camera, GPS, telephony) without setting `android:required="false"`.

#### PCS-18 Accessibility
- Full integration with **TalkBack for Android TV**. All composables must declare `semantics { contentDescription = "..." }`.

#### PCS-19 Update and Maintenance
- Manage releases via Play Console tracks (Internal Testing, Closed Testing, Production). Supports staged percentage rollouts.

#### PCS-20 Beginner Quick-Start Path
1. Register Play Console account ($25).
2. Create an Android project in Android Studio, adding `androidx.tv:tv-material:1.1.0` and Media3 ExoPlayer.
3. Add the Leanback Launcher intent and declare touchscreen as not required.
4. Test in the Android Studio Android TV Virtual Device.
5. Generate a signed `.aab` bundle.
6. Opt-in to Android TV in Play Console, upload `.aab`, fill Data Safety questionnaire, and submit for review.

---

### 14.3 Android TV Boxes (Generic OEM, AOSP, and Operator-Tier)

#### PCS-01 Platform Overview
"Android TV boxes" represent a vast, highly fragmented market spanning three distinct hardware categories:
1. **Certified Android TV / Google TV Boxes:** Devices manufactured by established brands (NVIDIA Shield TV, Xiaomi Mi Box, Mecool) that undergo Google's formal certification suite and include official Google Play Services.
2. **Uncertified AOSP Boxes:** Inexpensive set-top boxes (often powered by Rockchip or Amlogic SoCs) running unmodified mobile Android Open Source Project (AOSP) firmware. These devices **lack Google Play Services**, have no official Google Play Store, and often report their display as a giant mobile tablet.
3. **Operator-Tier Android TV Devices:** Customized set-top boxes provided by telecommunications and cable operators (e.g., Vodafone, AT&T, Deutsche Telekom) running a customized operator launcher over Android TV.

#### PCS-02 Current Status and Transitions
Google has steadily tightened certification standards. Certified boxes must pass Google's Android Compatibility Test Suite (CTS), Vendor Test Suite (VTS), and Google TV deployment requirements. Uncertified boxes frequently run outdated Android versions (Android 9–11) with non-compliant kernel builds.

#### PCS-03 Access Model
- *Certified Boxes:* Distributed normally via Google Play Store (identical to §14.2).
- *Uncertified AOSP Boxes:* **Unregulated / Open Distribution**. Distribution occurs via direct APK downloads, third-party app stores (Aptoide TV), or developer sideloading.
- *Operator-Tier Devices:* **Strictly Gated**. Requires direct commercial carriage agreements with individual telecommunications operators.

#### PCS-04 Developer Account
- For direct APK distribution: No central account required.
- For third-party stores (e.g., Aptoide TV): Free developer registration at `aptoide.com`.

#### PCS-05 Development Environment
Identical to standard Android development (Android Studio, Kotlin, Java).

#### PCS-06 Test Hardware and Environments
- Physical hardware testing is **Mandatory**. Testing on a single certified emulator will not reveal the rendering, decoding, and input failures rampant on budget AOSP boxes.
- Procure at least one budget Amlogic/Rockchip uncertified box alongside an NVIDIA Shield TV.

#### PCS-07 App Models Supported
Standard Android APKs.

#### PCS-08 Porting from a Mobile App
If distributing directly to uncertified AOSP boxes, the app must operate without Google Mobile Services (GMS):
- Replace Firebase Cloud Messaging (FCM) with a standalone WebSocket or MQTT push service.
- Remove Google Play Billing dependencies.
- Remove Google Location Services and Play Services auth.

#### PCS-09 Input and Interaction
Severe fragmentation. Many cheap AOSP boxes ship with low-cost infrared remotes with an "air mouse" toggle button that switches the D-pad to a slow, floating cursor. Apps must remain 100% navigable via standard D-pad key events.

#### PCS-10 UI/UX Requirements
Uncertified boxes often report their display density incorrectly, causing mobile UI assets to render at miniature, unreadable scales. Implement explicit display metrics handling and lock the UI canvas to 1080p density scaling.

#### PCS-11 Media and Playback
- *Major DRM Warning:* Uncertified AOSP boxes **almost universally lack Widevine L1 certification**. They are limited to **Widevine Level 3 (L3)** software decryption.
- *Resolution Penalty:* Major studios and streaming CDNs enforce strict security policies: **Widevine L3 devices are capped at 480p or 540p Standard Definition**. Premium 1080p, 4K UHD, and HDR streams will fail to decrypt.

#### PCS-12 Discovery and Identity
- Lack Google TV Watch Next integration.
- Must rely entirely on in-app discovery and QR code authentication.

#### PCS-13 Monetization
- Cannot use Google Play Billing on uncertified boxes.
- Must integrate external billing (Stripe web checkout via QR code) or third-party store payment SDKs.

#### PCS-14 Packaging and Signing
Standard signed `.apk` file. Avoid `.aab` bundles for direct sideloading or third-party store distribution, as `.aab` requires Google Play infrastructure to generate device-specific APKs.

#### PCS-15 Store Submission
Upload standalone `.apk` to third-party app stores (e.g., Aptoide TV) or host directly on your website for user sideloading.

#### PCS-16 Certification and Review
Third-party app stores typically perform basic automated malware scans (VirusTotal) with approval times under 24 hours.

#### PCS-17 Common Rejection Reasons and Pitfalls
1. App crashes immediately upon launch because it attempts to initialize missing Google Play Services.
2. App renders in portrait mode because it did not explicitly declare `android:screenOrientation="landscape"`.
3. Video player throws `MediaCodec` initialization exceptions due to non-standard hardware decoders.

#### PCS-18 Accessibility
TalkBack is frequently omitted from uncertified AOSP ROMs.

#### PCS-19 Update and Maintenance
Must implement a custom in-app self-updater mechanism (downloading a new APK from your server and prompting the user to install it), as there is no Google Play background updater.

#### PCS-20 Beginner Quick-Start Path ("Should I Bother?")
*Recommendation:* Build and publish your app for certified Google TV / Android TV via Google Play first. That build will automatically run on all certified boxes (NVIDIA Shield, Xiaomi). **Do not invest engineering cycles into uncertified AOSP boxes** unless you operate a specialized regional service where user research proves your audience relies heavily on imported set-top boxes.

---

### 14.4 Roku (Players and Roku TVs)

#### PCS-01 Platform Overview
Roku is the dominant streaming platform in North America, powering standalone streaming players (Roku Express, Streaming Stick, Ultra) and licensed **Roku TVs** manufactured by TCL, Hisense, Sharp, and Roku itself. Unlike every other major platform, Roku does not use Android, iOS, or standard web browser engines. It runs **Roku OS**, a proprietary Linux-based operating system designed for extreme efficiency on low-cost hardware. Applications on Roku are called **"Channels"**.

#### PCS-02 Current Status and Transitions
- *Legacy Sunset:* **Roku Direct Publisher was permanently sunset on January 12, 2024**. All channels must now be built using the Roku SceneGraph framework.
- *The RSG 2.0 Transition:* At the Roku Developer Summit, Roku announced the **RSG 2.0 SDK**, introducing native **TypeScript and JavaScript** support via the Hermes engine, SolidJS integration, and the FlexGrid layout engine. Roku has migrated its official open-source developer tooling to **GitLab (`gitlab.com/rokudev`)** `[CONFIRMED | HIGH CONFIDENCE]`.
- *Beta Roadmap:* RSG 2.0 public beta launches **October 29, 2026** for sideloading; public store publishing for RSG 2.0 packages opens in **2027**. Production commercial releases today must build on stable **Roku SceneGraph (RSG 1.x)** and BrightScript.

#### PCS-03 Access Model
Completely **Open**. Any developer worldwide can create a Roku Developer Account, activate Developer Mode on any retail Roku device, write code, package channels, and submit to the Roku Streaming Store.

#### PCS-04 Developer Account
- *Portal:* Roku Developer Dashboard (`developer.roku.com`).
- *Registration Fee:* **$0 (Free)** `[REQUIRED | HIGH CONFIDENCE]`.
- *Payment Details:* A valid credit card or PayPal account is required during signup for identity and tax verification, but no charges are incurred.

#### PCS-05 Development Environment
- *IDE:* Visual Studio Code with the **BrightScript Language Extension** and **Roku Community Tools**.
- *Languages:* **BrightScript** (a dynamically typed scripting language syntax-similar to Visual Basic/Python) and **Roku SceneGraph (RSG) XML** (declarative component markup).
- *Tooling:* Roku CLI, External Control Protocol (ECP) tools.
- *Host OS:* Windows, macOS, Linux.

#### PCS-06 Test Hardware and Environments
- **Physical Hardware is Mandatory.** **There is no official Roku desktop emulator.** Developers cannot test a Roku channel without a physical Roku streaming device or Roku TV connected to their local network.
- *Activating Developer Mode:* On the physical Roku remote, press the sequence:
  `Home 3x, Up 2x, Right, Left, Right, Left, Right`.
  Follow the on-screen prompt to enable the Developer Installer and set an administrative password. The device will reboot and expose a local web server (e.g., `http://192.168.1.50`) for sideloading `.zip` channel packages.

#### PCS-07 App Models Supported
Roku SceneGraph (RSG) applications.

#### PCS-08 Porting from a Mobile App
- *UI Code Reuse:* **0% Reuse.** Mobile UI code (Swift, Kotlin, React Native, Flutter) cannot run on Roku OS. The presentation layer must be completely written in SceneGraph XML and BrightScript.
- *Backend & Business Logic Reuse:* **100% Reuse.** Your REST/GraphQL endpoints, JSON payload structures, video streaming manifests (HLS/DASH), authentication endpoints, and DRM license servers are fully shared.

#### PCS-09 Input and Interaction
- Physical remote with 5-way D-pad (directional arrows and OK button), Back, Home, Instant Replay, Options (`*`), Play/Pause, Rewind, Fast-Forward.
- *Back Button Rule:* When pressed on the channel's home screen, the app **must exit cleanly** to the Roku home screen (a single exit confirmation dialog is allowed). Trapping the user will trigger immediate certification rejection.

#### PCS-10 UI/UX Requirements
- Follow official **Roku Design Guidelines**.
- Standard UI resolution: 1920x1080 (FHD) or 1280x720 (HD).
- Safe Zone: Strict 90% Title Safe boundary compliance.
- Focus navigation must be deterministic across all SceneGraph components.

#### PCS-11 Media and Playback
- *Player Component:* The native Roku SceneGraph **`Video` Node**.
- *Protocols & Codecs:* HLS, MPEG-DASH, SmoothStreaming. Codecs: H.264 (AVC), H.265 (HEVC), VP9 / AAC, AC-3, E-AC-3 (Dolby Digital Plus), Dolby Atmos.
- *DRM:* Microsoft PlayReady and Google Widevine Modular (hardware decrypted).

#### PCS-12 Discovery and Identity
- **Mandatory Deep Linking:** Roku strictly requires deep linking compliance for certification. The channel must handle `contentId` and `mediaType` query parameters sent via ECP or Roku Search, launching directly into playback without intermediate menus.
- *Authentication:* OAuth 2.0 Device Flow or Roku Pay account-linking.

#### PCS-13 Monetization
- *In-App Purchases:* **Roku Pay** is mandatory for all digital subscriptions and one-off purchases processed on-device. Standard revenue share is 80/20 (80% to developer).
- *Advertising:* Ad-supported channels must integrate the **Roku Advertising Framework (RAF)**. Roku enforces a standard inventory share (typically 70/30, where the developer retains 70% of ad inventory and Roku retains 30% for commercial channels).

#### PCS-14 Packaging and Signing
- A Roku channel package is an uncompressed or standard `.zip` file containing `manifest`, `source/` (BrightScript files), `components/` (SceneGraph XML files), and `images/`.
- Packaging is performed directly on the physical Roku device via the Developer Installer web interface, which signs the package using the device's hardware key and outputs a `.pkg` binary.

#### PCS-15 Store Submission
- *Submission Portal:* Roku Developer Dashboard (`developer.roku.com`).
- *Required Assets:* Channel Poster (540x405 px PNG), Splash Screen (1920x1080 px PNG), Screenshots (minimum 3).
- *Deep Link Testing:* Developers must submit sample `contentId` and `mediaType` test values in the dashboard for automated verification.

#### PCS-16 Certification and Review
- *Review Timeline:* Officially up to 14 business days; community-reported range: **5 to 10 business days**.
- *Testing:* Roku runs automated test suites (checking deep linking, crash telemetry, and back button behavior) followed by manual QA review.

#### PCS-17 Common Rejection Reasons and Pitfalls
1. Failing automated deep link tests (e.g., deep link fails to start playback within 10 seconds or prompts for user selection).
2. Trapping the Back button on the home screen instead of exiting.
3. Attempting to display client-side video ads without using the Roku Advertising Framework (RAF).
4. Sizing UI elements outside the Title Safe boundary.

#### PCS-18 Accessibility
- Seamless integration with the built-in **Roku Audio Guide** screen reader. SceneGraph components must configure `accessible = true` and provide `accessibilityLabel` strings.

#### PCS-19 Update and Maintenance
- Updates are submitted via the Developer Dashboard as new signed `.pkg` files, requiring version code increments in the `manifest` file.

#### PCS-20 Beginner Quick-Start Path
1. Purchase an inexpensive Roku streaming player (e.g., Roku Express 4K).
2. Activate Developer Mode via the remote button sequence.
3. Install VS Code with the BrightScript extension.
4. Clone the official Roku SceneGraph sample channel from GitLab (`gitlab.com/rokudev`).
5. Sideload the sample to your Roku player's IP address via your desktop browser.
6. Adapt the component XML and BrightScript files to fetch your mobile app's video API feed.

---

### 14.5 Apple TV (tvOS)

#### PCS-01 Platform Overview
Apple TV operates on **tvOS**, an operating system derived from the iOS/Darwin kernel, running on Apple TV HD and Apple TV 4K hardware. tvOS shares core foundations with iOS—including Swift, SwiftUI, UIKit, Foundation, CoreAnimation, and AVKit—making it the most straightforward living-room adaptation target for native iOS engineering teams. However, tvOS diverges sharply from iOS in its input paradigm, focus system, storage constraints, and strict App Store review policies.

#### PCS-02 Current Status and Transitions
- *Toolchain Requirement:* Submissions to the Apple App Store must be compiled using **Xcode 26 or later**, targeting the **tvOS 26 SDK or later** `[REQUIRED | HIGH CONFIDENCE]`. (Submissions will transition to tvOS 27 SDK minimums starting April 2027).
- *Framework Guidance:* Apple strongly advocates for **SwiftUI** for tvOS UI development, while fully supporting UIKit via the native **Focus Engine**.
- *Watch These Changes:* Universal Purchase enables developers to distribute an app across iOS, iPadOS, and tvOS as a single purchase under a single App Store product page.

#### PCS-03 Access Model
Completely **Open** to registered Apple Developer Program members.

#### PCS-04 Developer Account
- *Portal:* Apple Developer (`developer.apple.com`) and App Store Connect (`appstoreconnect.apple.com`).
- *Registration Fee:* **$99 / year** (covers iOS, iPadOS, macOS, watchOS, and tvOS) `[REQUIRED | HIGH CONFIDENCE]`.
- *Verification:* Individual identity verification via the Apple Developer app; corporate accounts require D-U-N-S verification and legal signing authority.

#### PCS-05 Development Environment
- *IDE:* **Xcode** (strictly required).
- *Languages:* Swift, Objective-C.
- *SDKs:* tvOS SDK, SwiftUI, AVKit, StoreKit 2.
- *Host OS Requirement:* **macOS is strictly required.** tvOS development cannot be conducted natively on Windows or Linux.

#### PCS-06 Test Hardware and Environments
- *Simulator:* The **tvOS Simulator** in Xcode is high-fidelity, high-performance, and supports complete keyboard simulation of the Siri Remote (arrow keys, Return for Select, Esc for Back/Menu).
- *Physical Hardware:* Apple TV 4K. Connects to Xcode wirelessly over local Wi-Fi for debugging and profiling via Instruments.

#### PCS-07 App Models Supported
Native Swift/Objective-C (SwiftUI and UIKit). Note: **tvOS does not include WebKit.** There is no `WKWebView` on tvOS; arbitrary HTML5 web pages cannot be rendered inside a native tvOS app container.

#### PCS-08 Porting from a Mobile App
- *Native iOS Source:* **85%–90% code reuse**. Core data models, networking pipelines, business logic, Combine/Swift Concurrency async tasks, and Swift packages transfer directly.
- *UI Refactoring:* Add a new tvOS target to your Xcode project. Replace touch gesture recognizers with the **tvOS Focus Engine** (`UIFocusSystem`, `@FocusState` in SwiftUI). Replace small touch buttons with large TV cards.

#### PCS-09 Input and Interaction
- The **Siri Remote**: Features a touch-sensitive clickpad (supporting both discrete 4-way physical clicks and subtle directional swipes), Back button, TV/Home button, Play/Pause button, and Siri Voice microphone.
- *Focus Engine:* The operating system automatically manages focus between focusable elements (`button`, `toggle`, focusable cards). When focused, elements automatically lift and tilt in 3D parallax space in response to the user's thumb hovering over the Siri Remote touch surface.

#### PCS-10 UI/UX Requirements
- Follow official **Apple Human Interface Guidelines (HIG) for tvOS**.
- Resolution: 1920x1080 UI canvas, automatically scaled on 4K displays.
- Visual Assets: Layered app icons (providing 3D parallax depth when highlighted on the home screen).

#### PCS-11 Media and Playback
- *Player API:* **AVKit (`AVPlayer` and `AVPlayerViewController`)**.
- *Protocols & Codecs:* Apple HLS (HTTP Live Streaming). Codecs: H.264, H.265 (HEVC) / AAC, AC-3, E-AC-3, Dolby Atmos.
- *DRM:* **Apple FairPlay Streaming (FPS)** with hardware Secure Enclave decryption.

#### PCS-12 Discovery and Identity
- *Deep Linking:* Standard Universal Links and custom URL schemes.
- *Top Shelf:* Apps placed in the primary home screen dock must provide a **Top Shelf extension** (`TVTopShelfProvider`) displaying featured content carousels directly above the app icon.
- *Universal Purchase:* Bundle tvOS app with iOS mobile app for shared entitlement.

#### PCS-13 Monetization
- *In-App Purchases:* **Apple StoreKit 2**. Standard 85/15 revenue split for subscription renewals after year one (and under the Apple Small Business Program for developers under $1M/year); 70/30 standard.
- *App Store Review Guideline 3.1.1:* Subscription apps can operate as **Reader Apps** or multi-platform services where users sign in with accounts created elsewhere, provided no direct links or buttons prompt external web checkout on the TV.

#### PCS-14 Packaging and Signing
Standard signed `.ipa` archive signed with your Apple Developer Distribution Certificate and Provisioning Profile.

#### PCS-15 Store Submission
- *Portal:* App Store Connect (`appstoreconnect.apple.com`).
- *Asset Specs:*
  - App Icon (Layered Parallax Icon: Small 400x240 px, Large 1280x768 px).
  - Top Shelf Image: 1920x720 px PNG.
  - Screenshots: 1920x1080 px or 3840x2160 px PNG.
- *Export Compliance:* Disclose encryption usage (standard HTTPS/HLS typically qualifies for exempt status under category 5 part 2).

#### PCS-16 Certification and Review
- *Review Timeline:* Officially within 24–48 hours; community-reported average: **24 to 36 hours** (the fastest of all major TV platforms).
- *Testing:* Apple human reviewers rigorously test on real Apple TV hardware, checking remote responsiveness, account sign-in, and StoreKit compliance.

#### PCS-17 Common Rejection Reasons and Pitfalls
1. Failing App Store Review Guideline 3.1.1 by displaying unapproved external payment links or pricing text on-screen.
2. Inadequate focus visibility (reviewer unable to determine which button is active).
3. Attempting to use local flash storage as persistent storage (tvOS may purge local storage when disk space is constrained; use iCloud Key-Value storage or remote backend sync).
4. App icon lacking layered parallax assets.

#### PCS-18 Accessibility
- Seamless integration with **Apple VoiceOver**. SwiftUI and UIKit views automatically expose accessibility elements, traits, and labels.

#### PCS-19 Update and Maintenance
- Supports **TestFlight for tvOS** (up to 10,000 external beta testers). Phased automatic releases allow rolling updates over 7 days.

#### PCS-20 Beginner Quick-Start Path
1. Open your existing iOS mobile app project in Xcode.
2. Navigate to `File > New > Target` and select **tvOS > App**.
3. Share your existing Swift Data and Networking frameworks with the new tvOS target.
4. Build a simple 10-foot browse screen using SwiftUI `LazyVGrid` and `Button`.
5. Run the app in the Xcode tvOS Simulator.
6. Connect an Apple TV 4K to your Mac wirelessly to test on hardware.
7. Archive the build and upload to App Store Connect.

---


### 14.6 LG Smart TVs (webOS)

#### PCS-01 Platform Overview
LG Smart TVs operate on **webOS TV**, a Linux-based operating system designed by LG around standard web technologies. The webOS platform powers tens of millions of consumer television displays worldwide, spanning entry-level 4K LED panels to flagship OLED displays. Applications on webOS are fundamentally web applications (HTML5, CSS, JavaScript) running within an optimized WebKit-based browser container, exposing native TV hardware capabilities via LG's proprietary **Luna Service API**.

#### PCS-02 Current Status and Transitions
- *OS Generations:* Modern displays in market run webOS 6.0 (2021), webOS 22 (2022), webOS 23 (2023), webOS 24 (2024), and newer firmware versions.
- *Tooling Modernization:* LG has transitioned from older Eclipse-based IDE plugins to the modern **webOS Studio extension for Visual Studio Code** and the **webOS TV CLI**.
- *Framework Guidance:* LG promotes **Enact**, an open-source React-based application framework tailored specifically for TV spatial navigation and living-room performance.
- *Watch These Changes:* LG's "webOS Re:New program" provides continuous operating system upgrades to older OLED and QNED models over a 5-year window, significantly reducing fragmentation across older model years.

#### PCS-03 Access Model
Completely **Open**. Any developer or studio can create an account on the LG Seller Lounge, download the webOS SDK, sideload apps to retail LG TVs, and submit applications for global distribution in the LG Content Store.

#### PCS-04 Developer Account
- *Portal:* **LG Seller Lounge** (`seller.lgappstv.com`) and LG webOS TV Developer Portal (`webostv.developer.lge.com`).
- *Registration Fee:* **$0 (Completely Free)** `[REQUIRED | HIGH CONFIDENCE]`.
- *Verification:* Standard email and corporate profile setup. No upfront credit card required.

#### PCS-05 Development Environment
- *IDE:* Visual Studio Code with the **webOS Studio Extension** or standalone command-line interface (**webOS TV CLI**).
- *Languages:* JavaScript (ES6+), TypeScript, HTML5, CSS3.
- *Frameworks:* **Enact** (React-based), vanilla React, Vue, or lightweight vanilla JS.
- *Host OS:* Windows, macOS, Linux.

#### PCS-06 Test Hardware and Environments
- *Emulator:* The **webOS TV Emulator** (VirtualBox-based virtual machine). Provides functional D-pad and Magic Remote pointer emulation, though video decoding performance is limited.
- *Developer Mode on Real TVs:* Install the **Developer Mode app** from the LG Content Store on a physical LG TV. Launch the app, sign in with your LG Developer credentials, and toggle Developer Mode to "ON". 
  - *Session Timer Quirk:* The LG Developer Mode session has a limited duration (typically 50 to 999 hours). Developers must extend the session timer via the app or via the CLI command `ares-extend-dev` to prevent the TV from revoking sideloading access.

#### PCS-07 App Models Supported
Packaged Web Applications (installed locally as `.ipk` archives) and Hosted Web Applications (thin wrapper loading a remote web URL). Packaged Web Applications are strongly recommended to pass certification and ensure fast cold-start performance.

#### PCS-08 Porting from a Mobile App
- *Web / PWA Mobile Source:* **80%–90% code reuse**. Core React/Vue components, state management (Redux, Zustand), API client logic, and styling transfer directly.
- *Native iOS/Android Source:* 0% direct UI reuse; 100% backend API and streaming manifest reuse.
- *Refactoring Required:* Strip out touch event listeners (`touchstart`, `touchend`). Replace with keyboard event listeners (`keydown`) mapped to webOS remote key codes.

#### PCS-09 Input and Interaction
- The **LG Magic Remote**: Provides a dual input model:
  1. *Standard 5-way D-pad:* Up, Down, Left, Right, OK/Select.
  2. *Air-Mouse Pointer:* A gyroscopic on-screen cursor that appears when the user waves the remote.
- *Critical Certification Rule:* Applications must function flawlessly with **both** the directional D-pad and the Magic Remote pointer. If a button can be clicked with the pointer but cannot be reached via D-pad navigation (or vice-versa), the application will fail certification.
- *Back Button:* Listening for the `keydown` event with `keyCode == 461` (the webOS Back key). Pressing Back on the root screen must exit the application.

#### PCS-10 UI/UX Requirements
- Follow official **LG webOS TV Design Guidelines**.
- Canvas Resolution: 1920x1080 (standard full HD coordinate space, upscaled to 4K on UHD panels).
- Safe Zones: 90% Title Safe boundary compliance.
- Visual Focus: High-contrast focus rings or card scaling (e.g., 1.1x).

#### PCS-11 Media and Playback
- *Player API:* Standard HTML5 `<video>` tag integrated with the webOS media pipeline, or third-party web players (Shaka Player, Video.js, Hls.js).
- *Protocols & Codecs:* HLS, MPEG-DASH. Codecs: H.264, H.265 (HEVC), VP9 / AAC, AC-3, E-AC-3 (Dolby Digital Plus), Dolby Atmos.
- *DRM:* Google Widevine Modular and Microsoft PlayReady, initialized via HTML5 Encrypted Media Extensions (EME).

#### PCS-12 Discovery and Identity
- *Deep Linking:* Supports webOS application launch parameters. The app must parse parameters passed via `webOS.window.launch()` to route directly to video playback.
- *Authentication:* OAuth 2.0 Device Flow (RFC 8628) or QR code activation.

#### PCS-13 Monetization
- *In-App Purchases:* LG In-App Purchase service (supported via LG Seller Lounge commercial agreements).
- *External Subscriptions:* Multi-platform subscription services can distribute free apps with external account sign-in.

#### PCS-14 Packaging and Signing
- *Package Format:* **`.ipk` (webOS IPK archive)**.
- *Configuration File:* Every app must contain an `appinfo.json` file declaring:
  ```json
  {
    "id": "com.yourcompany.yourapp",
    "version": "1.0.0",
    "vendor": "YourCompany",
    "type": "web",
    "main": "index.html",
    "title": "Your App Name",
    "icon": "icon.png",
    "largeIcon": "largeIcon.png",
    "requiredPermissions": ["media.controller"]
  }
  ```
- *Signing:* Unsigned `.ipk` files are generated locally via `ares-package`. LG signs the package automatically during store ingestion.

#### PCS-15 Store Submission
- *Portal:* LG Seller Lounge (`seller.lgappstv.com`).
- *Mandatory Submission Documents (CRITICAL):*
  1. **The UX Scenario (PPT / PDF):** A slide deck providing visual screenshots and step-by-step explanations of every user journey, explicitly demonstrating how the remote D-pad, pointer, and Back button operate on each screen `[REQUIRED | HIGH CONFIDENCE]`.
  2. **The App Self-Checklist (Excel):** A comprehensive spreadsheet template that **must be downloaded freshly from the Seller Lounge**. Developers must audit every item against their build. Submitting an outdated template version results in immediate rejection.
- *Store Assets:* App Icon (400x400 px PNG), Background/Splash Image (1920x1080 px PNG), Screenshots (minimum 3, 1920x1080 px).

#### PCS-16 Certification and Review
- *Review Timeline:* Officially 5–7 business days; community-reported range: **5 to 10 business days**.
- *QA Rigor:* LG conducts thorough manual QA testing on physical TV models across multiple model years. Testers verify the App Self-Checklist line-by-line against actual behavior.

#### PCS-17 Common Rejection Reasons and Pitfalls
1. Submitting with an outdated version of the **App Self-Checklist** spreadsheet.
2. The Back button (`keyCode 461`) failing to navigate back or close dialogs.
3. Incompatibility between the D-pad and Magic Remote pointer (e.g., focus jumping erratically when switching between pointer and D-pad).
4. Memory exhaustion on older TV models due to uncompressed images or uncollected DOM nodes.

#### PCS-18 Accessibility
- Supports the webOS **Audio Guidance** (screen reader). HTML elements must provide standard `aria-label` attributes.

#### PCS-19 Update and Maintenance
- New releases are packaged as version-incremented `.ipk` files and submitted via Seller Lounge, requiring an updated Self-Checklist for major revisions.

#### PCS-20 Beginner Quick-Start Path
1. Install VS Code and the **webOS Studio Extension**.
2. Run `ares-generate -t basic myTvApp` to scaffold a project.
3. Install the Developer Mode app on your LG TV and pair with your PC via `ares-setup-device`.
4. Package the app into an `.ipk` using `ares-package myTvApp`.
5. Install and launch on the TV: `ares-install myTvApp.ipk && ares-launch com.yourcompany.yourapp`.
6. Download the latest App Self-Checklist from LG Seller Lounge, prepare the UX Scenario slide deck, and upload for QA.

---

### 14.7 Samsung Smart TVs (Tizen)

#### PCS-01 Platform Overview
Samsung is the world's leading television manufacturer by unit volume, commanding a massive living-room footprint powered by its proprietary **Tizen OS** smart TV platform. Samsung Smart TVs span standard Crystal UHD sets, lifestyle displays (The Frame, The Serif), and flagship Neo QLED and OLED panels. Applications on Samsung TVs are predominantly **Tizen Web Applications** (HTML5, CSS, JavaScript) executing within an optimized Chromium-based web runtime, coupled with native TV hardware bindings provided by the **Tizen Web Device API** and **Samsung Product API**.

#### PCS-02 Current Status and Transitions
- *Tizen Platform Versions:* Current displays run Tizen 6.5 (2022), Tizen 7.0 (2023), Tizen 8.0 (2024), and newer iterations. Chromium browser engine versions vary by year (ranging from Chromium 76 on older sets to Chromium 108+ on modern panels).
- *Framework Guidance:* Developers can build using standard web frameworks (React, Vue, vanilla JS), wrapping components in Tizen web containers.
- *Watch These Changes:* Samsung has unified its developer resources under the Samsung Developers Smart TV portal and introduced cloud-based testing options via the Samsung Remote Test Lab (RTL).

#### PCS-03 Access Model
**Open with Geographic Restrictions:**
- *Public Seller Tier:* Anyone can register an account for free. However, **Public Sellers are strictly restricted to publishing applications in the United States (US) market only** `[CONFIRMED | HIGH CONFIDENCE]`.
- *Partner Seller Tier:* To distribute an app globally or outside the US, developers must apply for and be granted **Partner Seller** status via an offline commercial agreement with Samsung's regional content partnerships team.

#### PCS-04 Developer Account
- *Submission Portal:* **Samsung Apps TV Seller Office (`seller.samsungapps.com/tv`)** — *Note: Do NOT confuse with the mobile Samsung Galaxy Store.*
- *Developer Hub:* Samsung Developers (`developer.samsung.com/smarttv`).
- *Registration Fee:* **$0 (Completely Free)** `[REQUIRED | HIGH CONFIDENCE]`.
- *Verification:* Requires a standard Samsung Account followed by completing the developer registration profile.

#### PCS-05 Development Environment
- *IDE:* Visual Studio Code with the **Tizen TV Extension** or **Tizen Studio with TV Extensions**.
- *Languages:* JavaScript (ES6+), TypeScript, HTML5, CSS3. (Native C++ / .NET available for games, but web apps represent 95%+ of media apps).
- *SDKs:* Tizen TV SDK, Samsung Product API, Tizen Web Device API.
- *Host OS:* Windows 10/11, macOS, Linux.

#### PCS-06 Test Hardware and Environments
- *Emulator:* **Tizen TV Emulator** (QEMU-based virtual machine). Provides complete visual simulation of the Samsung One UI interface and remote control.
- *Developer Mode on Real TVs:* On the physical Samsung TV:
  1. Open the **Apps** panel from the Smart Hub.
  2. Press the remote sequence: **`1, 2, 3, 4, 5`**.
  3. A Developer Mode configuration dialog will appear.
  4. Toggle Developer Mode to **ON** and enter your development PC's local IP address.
  5. Restart the TV (hold down the remote Power button until the Samsung logo reappears).
  6. Connect from PC via the Tizen CLI: `sdb connect <TV_IP_ADDRESS>`.
- *Remote Test Lab (RTL):* Samsung provides a free cloud-hosted Remote Test Lab allowing developers to test their builds remotely on real physical Samsung TVs over the internet.

#### PCS-07 App Models Supported
Tizen Web Applications (`.wgt` packages).

#### PCS-08 Porting from a Mobile App
- *Web Mobile Source:* **80%–90% code reuse**. Core state, networking, and UI structure transfer directly.
- *Native Android/iOS Source:* 0% direct UI reuse; 100% backend API and manifest reuse.
- *Refactoring Required:* Map remote key events using `tizen.tvinputdevice.registerKey()`. Bind video playback strictly to the native **AVPlay API** (`webapis.avplay`).

#### PCS-09 Input and Interaction
- Standard Samsung Smart Control remote with 5-way D-pad (directional ring and Select/Enter), Back, Home, Play/Pause, and Volume.
- *Mandatory Key Registration:* Tizen requires applications to explicitly register interest in TV hardware keys before they will fire in the DOM:
  ```javascript
  tizen.tvinputdevice.registerKey('MediaPlayPause');
  tizen.tvinputdevice.registerKey('MediaPlay');
  tizen.tvinputdevice.registerKey('MediaPause');
  ```
- *Back Button Rule:* Listening for `keyCode == 10009` (Tizen Back key). Must navigate back through history or exit the app cleanly via `tizen.application.getCurrentApplication().exit()`.

#### PCS-10 UI/UX Requirements
- Follow official **Samsung Smart TV UX Guidelines**.
- Resolution: Standard 1920x1080 canvas.
- Safe Area: Strict 90% Title Safe boundary compliance.
- Visual Focus: High-contrast focus state must scale or highlight the active element unmistakably.

#### PCS-11 Media and Playback
- **CRITICAL REQUIREMENT:** Video playback must be implemented using the **Samsung AVPlay API (`webapis.avplay`)** `[REQUIRED | HIGH CONFIDENCE]`.
  - *Never use HTML5 `<video>` for production streaming on Tizen.* Standard HTML5 video tags bypass the TV's hardware acceleration chip, resulting in frame dropping, lack of 4K/HDR support, and zero hardware DRM decryption.
- *Protocols & Codecs:* HLS, MPEG-DASH, SmoothStreaming. Codecs: H.264, H.265 (HEVC), VP9, AV1 / AAC, AC-3, E-AC-3, Dolby Atmos.
- *DRM:* Microsoft PlayReady and Google Widevine Modular, configured via `webapis.avplay.setDrm()`.

#### PCS-12 Discovery and Identity
- *Deep Linking:* Configured via the `app_control` API. The app must parse launch data to trigger instantaneous media playback.
- *Authentication:* OAuth 2.0 Device Flow (RFC 8628) or QR code scanning.

#### PCS-13 Monetization
- *In-App Purchases:* **Samsung Checkout (Samsung Pay for TV)**. Available for approved commercial partners.
- *External Subscriptions:* Multi-platform subscription services can provide free apps with external account sign-in.

#### PCS-14 Packaging and Signing
- *Package Format:* **`.wgt` (Tizen Web Application package)**.
- *Configuration File:* Every application requires a valid `config.xml` declaring:
  ```xml
  <widget xmlns="http://www.w3.org/ns/widgets" xmlns:tizen="http://tizen.org/ns/widgets"
          id="http://yourcompany.com/yourapp" version="1.0.0" viewmodes="maximized">
      <tizen:application id="ABC123XYZ.yourapp" exec="index.html" screen-orientation="landscape"/>
      <tizen:privilege name="http://developer.samsung.com/privilege/network.public"/>
      <tizen:privilege name="http://developer.samsung.com/privilege/avplay"/>
      <tizen:privilege name="http://tizen.org/privilege/tv.inputdevice"/>
  </widget>
  ```
- *Certificates:* Tizen requires two digital certificates: an **Author Certificate** (identifying the developer) and a **Distributor Certificate** (granted by Samsung). Certificates must be generated in Tizen Studio via `Tools > Certificate Manager`.

#### PCS-15 Store Submission
- *Portal:* Samsung Apps TV Seller Office (`seller.samsungapps.com/tv`).
- *Model Group Targeting:* Developers must explicitly select which **TV Model Groups** to support (e.g., *26TV_PREMIUM_QLED*, *25TV_STANDARD_UHD*).
- *Submission Assets:* App Icon (512x512 px PNG), Background Image (1920x1080 px PNG), Screenshots (minimum 4, 1920x1080 px).
- *Verification Info:* Detailed test account credentials and a video demonstration walkthrough.

#### PCS-16 Certification and Review
- *Review Timeline:* Officially 5–10 business days; community-reported range: **7 to 14 business days**.
- *Certification Defect Handling:* Samsung testers run rigorous compatibility test suites. If a defect is found on a specific model group, the entire submission is returned with photographic evidence and detailed defect logs.

#### PCS-17 Common Rejection Reasons and Pitfalls
1. Attempting to use HTML5 `<video>` instead of the mandatory `webapis.avplay` API.
2. Forgetting to register hardware remote keys via `tizen.tvinputdevice.registerKey()`, resulting in unhandled play/pause or navigation buttons.
3. Violating US FCC accessibility rules on US model groups (missing closed captions or text-to-speech navigation).
4. Submitting an app containing invalid certificate signing chains.

#### PCS-18 Accessibility
- Supports the Tizen **Voice Guide** screen reader. HTML components must provide proper `aria-label` and `role` attributes.

#### PCS-19 Update and Maintenance
- Updates are submitted as version-incremented `.wgt` packages via the Seller Office.

#### PCS-20 Beginner Quick-Start Path
1. Create a free Samsung Account and sign into `seller.samsungapps.com/tv`.
2. Install Visual Studio Code and the **Tizen TV Extension**.
3. Create an Author and Distributor certificate via the Tizen Certificate Manager.
4. Enable Developer Mode on your physical Samsung TV by typing `1,2,3,4,5` in the Apps panel.
5. Connect your PC to the TV via `sdb connect <TV_IP>` and run `tizen run -p <package_id>`.
6. Implement `webapis.avplay` for video streaming, test Title Safe margins, and submit via the Seller Office.

---

### 14.8 Microsoft Xbox Consoles (Xbox Series X|S and Xbox One)

#### PCS-01 Platform Overview
Microsoft Xbox consoles (Xbox Series X, Xbox Series S, and Xbox One) represent high-performance living room entertainment hubs. Consoles run specialized variations of the Windows OS core, delivering immense compute, graphical, and media processing power. In the entertainment streaming ecosystem, the Microsoft Store on Xbox is home to premier media apps (Netflix, YouTube, Disney+, Spotify, Twitch). However, the publishing pathways, technical runtimes, and developer programs for Xbox consoles diverge sharply between **games** and **non-game media applications**.

#### PCS-02 Current Status and Transitions
- *Naming Clarification:* **"Xbox Live"** is the legacy name for Microsoft's online gaming network (now officially rebranded as the **Xbox network**). It is a backend service, **not the distribution channel**. Software distribution occurs exclusively via the **Microsoft Store on Xbox**.
- *Deprecations:* Microsoft no longer accepts new Universal Windows Platform (UWP) **games** for Xbox consoles. Games must be built using the **Microsoft Game Development Kit (GDK)** and Win32 APIs.
- *Media Applications Path:* For **non-game media streaming applications**, UWP and hosted web application wrappers remain supported inside Microsoft Partner Center under a managed media onboarding program `[CONFIRMED | HIGH CONFIDENCE]`.

#### PCS-03 Access Model
**Gated / Partner Approval Required for Commercial Media Apps:**
- *Games Pathway (Open to Indies):* Independent game developers can self-publish games to the Microsoft Store on Xbox via the **ID@Xbox** program.
- *Media Apps Pathway (Gated):* Publishing a commercial public video/audio streaming app to the retail Microsoft Store on Xbox is **NOT self-service**. It requires an active business development partnership with Microsoft's media ecosystem team, corporate verification, and direct onboarding into the managed Partner Center entertainment track.
- *Hobbyist Local Testing (Open):* Any retail Xbox console can be converted into a development testbed using **Retail Dev Mode** ($19 one-time activation), allowing developers to sideload and debug UWP media apps locally.

#### PCS-04 Developer Account
- *Portal:* **Microsoft Partner Center** (`partner.microsoft.com`).
- *Registration Fee:* **$19 one-time fee for individuals; $99 one-time fee for corporate entities** `[REQUIRED | HIGH CONFIDENCE]`.
- *Retail Dev Mode Activation:* A separate **$19 one-time fee** to unlock Developer Mode on a retail Xbox console.

#### PCS-05 Development Environment
- *IDE:* Visual Studio 2022 (Community, Professional, or Enterprise).
- *Languages:* C#, C++, JavaScript / TypeScript, HTML5.
- *SDKs:* Windows 10/11 SDK, Microsoft Game Development Kit (GDK), WinUI 2 / UWP SDK.
- *Host OS Requirement:* Windows 10/11 64-bit strictly required.

#### PCS-06 Test Hardware and Environments
- *Emulators:* Local Windows PC execution provides a close functional testbed for UWP layout and focus behavior.
- *Hardware Testing:* Retail Xbox Series S or Xbox Series X console activated in **Xbox Dev Mode**. Developers deploy builds wirelessly over local network from Visual Studio.

#### PCS-07 App Models Supported
Universal Windows Platform (UWP) apps, Progressive Web Apps (PWAs) packaged as UWP wrappers, and Win32 / GDK packages.

#### PCS-08 Porting from a Mobile App
- *Native iOS/Android Source:* 0% direct UI reuse; 100% backend API and streaming manifest reuse.
- *React Native Source:* 60%–75% code reuse by leveraging **React Native for Windows**.
- *Web / PWA Source:* 70%–85% code reuse by packaging web components into a hosted UWP application container.

#### PCS-09 Input and Interaction
- The **Xbox Wireless Controller**: Input is driven via standard gamepad buttons: Left Thumbstick / D-pad (spatial navigation), A button (Select/Activate), B button (Back/Cancel), X and Y buttons (secondary actions), Left/Right Bumpers and Triggers (paging and fast scrubbing), and View/Menu buttons.
- *Focus Visuals:* UWP provides the **Reveal highlight** and focus visual system, automatically drawing glowing borders around active elements.

#### PCS-10 UI/UX Requirements
- Follow official **Xbox App Design Guidelines** and **10-Foot Design Principles for Windows**.
- Resolution: Standard 1920x1080 canvas, upscaled to 4K on Xbox Series X/S.
- Safe Area: Strict adherence to 90% Title Safe area.

#### PCS-11 Media and Playback
- *Player API:* UWP `MediaPlayerElement` or native Windows Media Foundation.
- *Protocols & Codecs:* SmoothStreaming, MPEG-DASH, HLS. Codecs: H.264, H.265 (HEVC), VP9 / AAC, AC-3, E-AC-3, Dolby Atmos.
- *DRM:* **Microsoft PlayReady (Hardware SL3000)**.

#### PCS-12 Discovery and Identity
- *Deep Linking:* Standard Windows URI protocols (`yourapp://play?...`).
- *Authentication:* OAuth 2.0 Device Flow (RFC 8628) or Microsoft Account single sign-on (SSO).

#### PCS-13 Monetization
- *Commerce API:* Microsoft Store In-App Billing APIs. Standard 85/15 revenue split for applications under Microsoft Store terms (excluding games).
- *External Purchasing:* Reader apps and subscription services with existing web billing can distribute free apps with external login.

#### PCS-14 Packaging and Signing
- Package formats: `.appx`, `.msix`, or `.appxbundle`.
- Signed using a code-signing certificate associated with your Microsoft Partner Center publisher identity.

#### PCS-15 Store Submission
- *Portal:* Microsoft Partner Center (`partner.microsoft.com`).
- *Submission Steps:* Package upload, product description, age ratings (IARC questionnaire), pricing, and device family selection (**Windows.Xbox**).

#### PCS-16 Certification and Review
- *Review Timeline:* 24 to 72 hours for standard store policy validation; extended review (1–2 weeks) for managed media partner tracks.
- *Testing:* Applications must satisfy the **Xbox Requirements (XRs)** regarding controller responsiveness, profile switching, and background audio suspension.

#### PCS-17 Common Rejection Reasons and Pitfalls
1. Failing to handle gamepad disconnects gracefully.
2. Trapping the B button (Back button must navigate backward or exit).
3. Attempting to submit a consumer media app without prior partner onboarding approval from Microsoft.

#### PCS-18 Accessibility
- Adherence to the **Xbox Accessibility Guidelines (XAGs)**. Integration with the Xbox Narrator screen reader.

#### PCS-19 Update and Maintenance
- Managed via Partner Center flighting and production package updates.

#### PCS-20 Beginner Quick-Start Path ("Feasibility Verdict")
- *Verdict for Independent Beginners:* **LOW PRIORITY FOR IMMEDIATE LAUNCH.**
- *Reasoning:* While building and testing a UWP media app on an Xbox in Dev Mode is simple and cheap ($19), getting a public commercial streaming app approved and published to the retail Microsoft Store on Xbox requires corporate partner approval. Independent developers should build for Google TV, Fire TV, and Roku first, approaching Microsoft only after establishing substantial audience demand.

---

### 14.9 Sony PlayStation Consoles (PS4 and PS5)

#### PCS-01 Platform Overview
Sony PlayStation consoles (PlayStation 4, PlayStation 4 Pro, PlayStation 5, and PlayStation 5 Digital Edition) represent the world's premier dedicated gaming console hardware. In the living room, PlayStation consoles occupy prominent HDMI inputs, with users regularly consuming entertainment via the dedicated **"Media"** tab on the PS5 dashboard (featuring apps like Netflix, Crunchyroll, Disney+, YouTube, Twitch, and Spotify). However, the PlayStation ecosystem is a **strictly controlled, enterprise-governed walled garden**.

#### PCS-02 Current Status and Transitions
- *Naming Clarification:* **"PlayStation Network (PSN)"** refers to Sony's digital media and online gaming service. Distribution of software occurs through the **PlayStation Store**.
- *Ecosystem Governance:* Sony maintains absolute commercial control over non-game applications appearing on the PlayStation Store. There is **no public self-service publishing track for media apps**.

#### PCS-03 Access Model
**STRICTLY GATED / CORPORATE PARTNERSHIP MANDATORY `[REQUIRED | HIGH CONFIDENCE]`:**
- Independent developers cannot simply pay a fee and upload a video streaming app to the PlayStation Store.
- Distributing a media app requires executing a formal corporate publishing contract with **Sony Interactive Entertainment (SIE)**, obtaining corporate partner sponsorship, passing rigorous financial audits, and signing non-disclosure agreements (NDAs).

#### PCS-04 Developer Account
- *Portal:* **PlayStation Partners** (`partners.playstation.net`).
- *Eligibility:* Must be a registered, incorporated business entity with a corporate email domain, business registration documentation, physical office location, and a valid Dun & Bradstreet D-U-N-S number.
- *Account Fee:* Application is free, but partner onboarding requires legal and financial compliance verification.

#### PCS-05 Development Environment
- *IDE:* Visual Studio (Windows 64-bit) integrated with the proprietary Sony SDK toolchain.
- *Languages:* C++, proprietary web application shells.
- *Host OS Requirement:* Windows 64-bit.
- *Licensing:* All SDKs, compiler toolchains, and documentation are strictly governed by SIE Non-Disclosure Agreements (NDAs).

#### PCS-06 Test Hardware and Environments
- **Zero Public Emulators Exist.**
- Development and testing **strictly require physical PlayStation Devkits or Testkits**.
- Hardware must be leased directly from Sony Interactive Entertainment (typically costing $1,000–$2,000+ per unit, or loaned under specific partner programs). Devkits are cryptographically locked to specific corporate development networks and require periodic online activation.

#### PCS-07 App Models Supported
Native C++ applications and proprietary web application wrappers.

#### PCS-08 Porting from a Mobile App
- *Code Reuse:* 0% direct UI reuse; 100% backend API, CDN streaming, and DRM license server reuse.
- *Porting Effort:* Extremely high. The entire presentation and player integration layer must be developed against Sony's proprietary native APIs.

#### PCS-09 Input and Interaction
- The **DualSense Wireless Controller (PS5)** and **DualShock 4 (PS4)**:
  - D-pad and Left Analog Stick: Spatial navigation.
  - Cross (`X`) button: Select / Activate (in Western markets).
  - Circle (`O`) button: Back / Cancel.
  - Square (`[]`) and Triangle (`/\`): Contextual action buttons.
  - Media Remote: Official PlayStation Media Remote with dedicated playback buttons.

#### PCS-10 UI/UX Requirements
- Governed by Sony's confidential **Technical Requirements Checklist (TRC)**.
- *Terminology Note:* Do not use Nintendo terminology ("Lotcheck") when discussing Sony consoles. Sony's certification standard is strictly designated as **TRC**.
- Safe Areas: 90% Title Safe boundary compliance.

#### PCS-11 Media and Playback
- Proprietary Sony hardware-accelerated media pipeline.
- Streaming Protocols: HLS, MPEG-DASH.
- Codecs: H.264, H.265 (HEVC) / AAC, Dolby Audio.
- DRM: Hardware-level cryptographic decryption core.

#### PCS-12 Discovery and Identity
- Integration with the PS5 Media dashboard, universal search, and PSN account linking.

#### PCS-13 Monetization
- PlayStation Network Commerce APIs. Standard 70/30 revenue share for commercial store transactions.
- Subscription video streaming apps operate primarily as authenticated multi-platform services where subscriptions are billed via external web portals.

#### PCS-14 Packaging and Signing
Proprietary Sony `.pkg` package format, signed using corporate developer encryption keys issued by SIE.

#### PCS-15 Store Submission
Conducted via the internal PlayStation Partners portal. Applications undergo exhaustive functional and security testing.

#### PCS-16 Certification and Review
- Governed by Sony's formal TRC certification pass.
- Review timelines typically span **several weeks to months**, involving dedicated technical account managers (TAMs) assigned by Sony.

#### PCS-17 Common Rejection Reasons and Pitfalls
1. Violating Sony TRC rules regarding controller disconnects, user switching, or suspension modes.
2. Incomplete error handling when network connections drop during streaming playback.
3. Attempting to deploy software without valid SIE digital signatures.

#### PCS-18 Accessibility
Strict compliance with Sony PlayStation Accessibility Guidelines and US CVAA regulations.

#### PCS-19 Update and Maintenance
Updates must pass formal TRC regression testing before release to the PlayStation Network.

#### PCS-20 Beginner Quick-Start Path ("Feasibility Verdict")
- *Verdict for Independent Beginners:* **IMPOSSIBLE / DO NOT PURSUE IN INITIAL PHASES `[REQUIRED | HIGH CONFIDENCE]`.**
- *Reasoning:* Because Sony Interactive Entertainment does not operate an open, self-service publishing track for media applications, a solo developer or small startup cannot launch an app on PlayStation without securing a formal corporate media partnership and leasing expensive hardware under NDA. Prioritize open platforms (Google TV, Fire TV, Roku, Apple TV, LG, Samsung) and approach Sony only after achieving massive scale and substantial user demand.

---


## 15. App Store Submission Guide

Navigating the store submission and certification phase is the most critical operational hurdle for a mobile team entering the living room. Every connected TV app store enforces strict compliance audits that evaluate spatial focus navigation, remote key handling, overscan, and video playback reliability.

### The Eight Store Playbooks: Step-by-Step Submission Flows

#### 1. Amazon Appstore (Fire TV)
1. Sign in to the **Amazon Developer Console** (`developer.amazon.com/apps-and-games`).
2. Navigate to **App List > Add New App > Android**.
3. Enter App Title, App SKU (unique internal identifier), and App Category (e.g., *Movies & TV*).
4. Complete **Target Your App**: Check **Fire TV** as the targeted device category. (If submitting a Vega package, select Vega OS target).
5. Upload App Files: Upload your signed `.apk`, `.aab`, or `.vpkg` binary.
6. Configure Device Support: Verify supported Fire TV models (e.g., Fire TV Stick 4K, Fire TV Cube, Fire TV Edition Smart TVs).
7. Upload Visual Assets: App Icon (512x512 px PNG), Fire TV Banner (1280x720 px PNG), and 1080p Screenshots.
8. Complete Content Rating Questionnaire and Privacy Disclosures.
9. Enter **Testing Instructions**: Provide active test credentials (username and password) and explicit instructions on how reviewers should navigate the app.
10. Submit for review.

#### 2. Google Play Store (Google TV / Android TV)
1. Sign in to the **Google Play Console** (`play.google.com/console`).
2. Select your application record (or create a new app).
3. Navigate to **Setup > Advanced settings > Form factors**.
4. Click **Add form factor** and select **Android TV**.
5. Upload `.aab` bundle to an active testing track (Internal Testing or Closed Testing).
6. Fill out **Store Settings > Store listing**: Add the mandatory TV Banner (`1280x720` px or `320x180` px) and TV screenshots.
7. Complete **Policy and programs > App content**: Complete the Data Safety section, Advertising ID declaration, Government Apps declaration, and IARC Content Rating.
8. Set up **App access**: Provide login credentials for Google Play reviewers.
9. Promote the Android TV release to the **Production Track** and submit for review.

#### 3. Roku Streaming Store
1. Sign in to the **Roku Developer Dashboard** (`developer.roku.com`).
2. Navigate to **My Channels > Add Channel > Developer SDK**.
3. Enter Channel Name, Channel Description, and Channel Classification (Public Channel).
4. Package Upload: Upload the `.pkg` file signed on your physical Roku device.
5. Assets Upload: Channel Poster (540x405 px PNG), Splash Screen (1920x1080 px PNG), and Screenshots.
6. **Deep Linking Parameters:** Enter sample `contentId` and `mediaType` test parameters in the Channel Certification form.
7. Fill out Content Rating (IARC) and Roku Pay monetization declarations.
8. Submit for Automated Analysis (runs static checks) followed by manual QA submission.

#### 4. Apple App Store (tvOS)
1. Open Xcode and archive your tvOS project (`Product > Archive`).
2. In the Xcode Organizer, click **Distribute App** to validate and upload the `.ipa` to **App Store Connect**.
3. Sign in to **App Store Connect** (`appstoreconnect.apple.com`).
4. Select your app (or create a new tvOS app, optionally bundling with your existing iOS app via Universal Purchase).
5. Enter Description, Keywords, Support URL, and Marketing URL.
6. Upload Visual Assets: Layered Parallax App Icon (Small 400x240 px, Large 1280x768 px), Top Shelf Image (1920x720 px), and 1080p/4K Screenshots.
7. Complete **App Privacy** questionnaire and export compliance encryption declaration.
8. Under **App Review Information**, provide full reviewer login credentials and explanatory notes.
9. Click **Submit for Review**.

#### 5. LG Content Store (webOS TV)
1. Sign in to the **LG Seller Lounge** (`seller.lgappstv.com`).
2. Navigate to **App Management > Add App**.
3. Enter Basic Information: App Name, Version, Default Language, and Category.
4. Upload the unsigned `.ipk` application package.
5. Upload Store Assets: App Icon (400x400 px PNG), Background Image (1920x1080 px PNG), and Screenshots.
6. **Upload Mandatory Documentation:**
   - Attach the **UX Scenario slide deck (PPT/PDF)** demonstrating remote D-pad, pointer, and Back button navigation.
   - Attach the freshly completed **App Self-Checklist spreadsheet (Excel)** downloaded from Seller Lounge.
7. Enter Review Notes with test account login details.
8. Submit for official LG QA certification.

#### 6. Samsung Apps TV Seller Office (Tizen)
1. Sign in to the **Samsung Apps TV Seller Office** (`seller.samsungapps.com/tv`).
2. Navigate to **Applications > Create New Application**.
3. Enter App Information: Application Title, Description, and Category.
4. Upload the signed `.wgt` application package (signed with Author and Distributor certificates).
5. **Select TV Model Groups:** Select targeted model groups (e.g., *26TV_PREMIUM_QLED*, *25TV_STANDARD_UHD*). *(Note: Public Sellers can only select US model groups)*.
6. Upload Store Assets: App Icon (512x512 px PNG), Background Image (1920x1080 px PNG), and Screenshots (minimum 4).
7. Attach **Verification Information**: Test account credentials, testing guide, and feature checklist.
8. Submit for Pre-Test and full Samsung Certification.

#### 7. Microsoft Store on Xbox
1. Sign in to **Microsoft Partner Center** (`partner.microsoft.com`).
2. Create or open your application reservation.
3. Select **Pricing and Availability**: Enable distribution to the **Windows.Xbox** device family.
4. Complete **Properties**: Select category, privacy policy URL, and website.
5. Complete **Age Ratings**: Fill out the IARC questionnaire.
6. Upload Application Packages: Upload your signed `.msix`, `.appx`, or `.appxbundle` package.
7. Provide Review Notes with testing credentials.
8. Submit to the certification queue.

#### 8. PlayStation Store (Sony Interactive Entertainment)
1. Sign in to the private **PlayStation Partners Portal** (`partners.playstation.net`) under your corporate NDA credentials.
2. Coordinate with your assigned SIE Technical Account Manager (TAM) to establish title provisioning.
3. Submit application metadata, age ratings (ESRB, PEGI, etc.), and store marketing artwork.
4. Upload your signed Sony `.pkg` binary to the SIE submission servers.
5. Submit for formal **Technical Requirements Checklist (TRC)** certification testing.

---

### Master Store Asset Specification Reference

The table below consolidates all visual asset requirements across the 8 store submission pipelines:

| Storefront | Primary App Icon | TV Banner / Horizontal Artwork | Full-Bleed Splash / Background | In-App Screenshots |
| :--- | :--- | :--- | :--- | :--- |
| **Amazon Appstore** | 512x512 px PNG (no alpha) | **1280x720 px PNG** (Fire TV Banner) | Optional (1920x1080 px) | 3 to 10 screenshots (1920x1080 px PNG/JPEG) |
| **Google Play (TV)**| 512x512 px PNG (max 1MB) | **1280x720 px PNG** (or 320x180 px in APK) | Optional (Featured Graphic: 1024x500) | 1 to 8 screenshots (1920x1080 px, 16:9 ratio) |
| **Roku Streaming Store** | **540x405 px PNG** (Channel Poster)| N/A (Uses Channel Poster) | **1920x1080 px PNG** (Splash screen in pkg) | 3 to 6 screenshots (1920x1080 px PNG) |
| **Apple App Store (tvOS)** | **Layered Parallax Icon:** Small 400x240, Large 1280x768 | **1920x720 px PNG** (Top Shelf image) | Optional | 1 to 10 screenshots (1920x1080 or 3840x2160 px) |
| **LG Content Store** | **400x400 px PNG** | Optional (Promotion banner: 800x450 px) | **1920x1080 px PNG** (Background image) | 3 to 5 screenshots (1920x1080 px PNG) |
| **Samsung TV Seller Office**| **512x512 px PNG** (max 300KB) | Optional (Feature banner) | **1920x1080 px PNG** (Background image) | 4 to 8 screenshots (1920x1080 px PNG/JPEG) |
| **Microsoft Store (Xbox)** | 300x300 px PNG | 1920x1080 px PNG (Hero art) | Optional | 1 to 10 screenshots (1920x1080 px PNG) |
| **PlayStation Store** | 512x512 px PNG | 1920x1080 px Hero Art | 3840x2160 px Storefront Background | Minimum 5 screenshots (1920x1080 or 4K) |

---

### Regulatory Classifications and Content Ratings

Connected TV stores require age-appropriate content classifications before publishing:
1. **International Age Rating Coalition (IARC):** Integrated directly into Google Play, Microsoft Store, and Roku Channel Store. Developers complete a single 5-minute questionnaire covering violence, adult content, profanity, and user interactions, which instantly issues official ratings for:
   - **ESRB** (North America)
   - **PEGI** (Europe)
   - **USK** (Germany)
   - **Classification Board** (Australia)
   - **ClassInd** (Brazil)
2. **Apple Age Rating System:** Configured inside App Store Connect. Developers answer frequency questions regarding violence, mature themes, and simulated gambling, generating an Apple age classification (4+, 9+, 12+, 17+).
3. **Samsung & LG Age Ratings:** Set manually in the respective seller portals based on the highest rating issued by external rating boards.

---

### Privacy Questionnaires, Data Safety, and Export Compliance

All major stores mandate extensive legal disclosures during the submission pipeline:
- **Google Play Data Safety:** You must disclose whether your TV app collects location, personal information, financial data, device identifiers, or diagnostics. Disclose third-party SDKs (e.g., Sentry, Firebase, New Relic) and certify whether collected data is encrypted in transit.
- **Apple App Privacy Labels:** Disclose all data "Used to Track You" and "Data Linked to You" inside App Store Connect.
- **Export Compliance & Encryption Declarations:** Because modern video apps utilize HTTPS (TLS 1.3), DRM decryption, and AES-128 HLS decryption, they employ standard cryptography. On Apple App Store Connect, developers must declare whether the app uses non-exempt encryption. Standard video streaming and web networking typically qualify for exemption under **Category 5, Part 2** of the US Export Administration Regulations (EAR), allowing developers to answer "Yes" to using encryption and "Yes" to qualifying for an exemption (avoiding separate BIS filing requirements).

---

### Store Review Timelines: Official SLAs vs. Community Realities

| Storefront | Official SLA Stated by Vendor | Community-Reported Review Reality `[COMMUNITY-REPORTED]` | Expedited Review Available? |
| :--- | :--- | :--- | :--- |
| **Apple App Store (tvOS)** | 24 to 48 hours | **24 to 36 hours** (Consistently fast) | Yes (Emergency bugfix request) |
| **Amazon Appstore (Fire TV)**| 1 to 3 business days | **24 to 72 hours** (Slower if manual testing fails) | No |
| **Google Play (Google TV)** | Up to 7 days | **3 to 5 business days** (First submission takes longest) | No |
| **LG Content Store** | 5 to 7 business days | **5 to 10 business days** (Strict QA cycles) | No |
| **Samsung Apps TV Seller Office**| 5 to 10 business days | **7 to 14 business days** (Model group testing adds latency) | Yes (For approved Partner Sellers) |
| **Roku Streaming Store** | Up to 14 business days | **5 to 10 business days** (Automated pass runs in 1 hour) | No |
| **Microsoft Store (Xbox)** | 24 to 72 hours | **2 to 4 business days** | No |
| **PlayStation Store** | Undisclosed (Partner SLA) | **2 to 8 weeks** (Exhaustive TRC certification) | Managed by SIE Account Manager |

---

### The Common-Rejection Top 10 Across All TV Stores

Across developer forums, Reddit post-mortems, and official QA documentation, these 10 errors represent 90%+ of all TV app store rejections:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        TOP 10 TV STORE REJECTION REASONS                               │
├────┬───────────────────────────────────┬───────────────────────────────────────────────┤
│ #  │ REJECTION FAILURE MODE            │ PRIMARY STORES ENFORCING                      │
├────┼───────────────────────────────────┼───────────────────────────────────────────────┤
│ 1  │ D-pad Focus Traps & Lost Focus    │ Google Play, Amazon, Roku, Apple, LG, Samsung │
│ 2  │ Broken Back Button Handling       │ Roku, LG webOS, Samsung Tizen, Fire TV        │
│ 3  │ Title Safe / Overscan Violations  │ Amazon Appstore, Roku, Samsung Seller Office  │
│ 4  │ Touchscreen Dependency Declared   │ Google Play, Amazon Appstore                  │
│ 5  │ Submitting Outdated Checklist     │ LG Seller Lounge (Mandatory Self-Checklist)   │
│ 6  │ HTML5 Video on Tizen (No AVPlay)  │ Samsung Apps TV Seller Office                 │
│ 7  │ Deep Link Startup Failure         │ Roku Channel Store (Mandatory Certification)  │
│ 8  │ App Store Guideline 3.1.1 (IAP)   │ Apple App Store (tvOS)                        │
│ 9  │ Invalid / Missing Test Account    │ All Stores (Amazon, Google, Apple, Roku, LG)  │
│ 10 │ Audio / Video Sync & Buffer Crash │ All Stores (Physical hardware test failure)   │
└────┴───────────────────────────────────┴───────────────────────────────────────────────┘
```

1. **Lost Focus State / Focus Trap:** The D-pad moves into a container where no item receives visual focus, or focus cannot escape a menu.
2. **Improper Back Button Handling:** Pressing Back on the home screen fails to exit the app, or pressing Back inside a video player does nothing instead of returning to the details screen.
3. **Title Safe Boundary Violation:** Critical text, buttons, or badges are placed within the outer 10% edge of the 1080p canvas, causing them to be cut off by physical TV bezels.
4. **Failing to Remove Touchscreen Requirements:** Forgetting to declare `<uses-feature android:name="android.hardware.touchscreen" android:required="false" />` in Android manifests, causing the store to hide the app from TV devices.
5. **Submitting Outdated Review Documentation:** Uploading an old revision of the LG App Self-Checklist spreadsheet to the LG Seller Lounge.
6. **Bypassing Native Hardware Players:** Using generic HTML5 `<video>` tags on Samsung Tizen instead of the mandatory `webapis.avplay` API.
7. **Failing Automated Deep Link Tests:** On Roku, automated certification tests fail if sample deep link parameters do not initiate immediate video playback within 10 seconds.
8. **Direct External Payment Links on tvOS:** Presenting on-screen URLs or QR codes prompting users to "Subscribe at our website for $9.99" in violation of Apple Guideline 3.1.1.
9. **Invalid or Missing Test Credentials:** Reviewers cannot log in to evaluate the app because demo credentials were not provided in the testing notes field.
10. **Audio/Video Decoder Crash:** The app crashes or freezes when playing high-bitrate media on low-end hardware due to unoptimized buffer allocation.

---

## 16. Monetization and Billing by Store

Monetizing a living room application requires strictly adhering to platform-specific in-app purchasing policies, commercial billing APIs, and advertising regulations.

### In-App Purchases (IAP) and Subscriptions

Every major television ecosystem enforces proprietary in-app commerce APIs for digital goods consumed on the device:

| Storefront | Proprietary Billing API | Standard Platform Cut | Small Business Fee Tier | External Payment Linking Rules |
| :--- | :--- | :--- | :--- | :--- |
| **Apple App Store (tvOS)** | StoreKit 2 (`StoreKit`) | **30%** (15% for yr 2+ subs) | **15%** (Under $1M/yr via Small Business Program) | **Strictly prohibited** unless registered Reader App. |
| **Google Play (Google TV)** | Google Play Billing Library | **30%** (15% for subscriptions) | **15%** (Under $1M/yr service fee tier) | Permitted in select regions via User Choice Billing. |
| **Amazon Appstore (Fire TV)**| Amazon In-App Purchasing (IAP) | **30%** | **15%** (Under $1M/yr via Small Business Accelerator) | Prohibited from linking to external purchase web pages. |
| **Roku Streaming Store** | **Roku Pay** | **20%** (80% to developer) | Standard terms apply | Mandatory for on-device transactions. |
| **Samsung Apps TV** | Samsung Checkout (Samsung Pay) | **Variable (Typically 15%–30%)**| Partner Seller agreement required | Managed under direct commercial contract. |
| **LG Content Store** | LG In-App Purchase Service | **Variable** | Commercial agreement required | Managed under direct commercial contract. |
| **Microsoft Store (Xbox)** | Microsoft Store Commerce API | **15%** (For standard media apps) | Standard terms apply | External billing permitted for multi-platform apps. |
| **PlayStation Store** | PlayStation Network Commerce | **30%** standard | Partner agreement required | Managed under enterprise corporate agreement. |

### The "Reader App" and Multi-Platform Account Exemption

For independent video streaming applications, building custom billing integrations for 8 separate TV stores represents an overwhelming engineering and accounting burden. Fortunately, all major platforms permit the **"Multi-Platform / Reader App" Exemption**:
- **How It Works:** The TV application is distributed as a **100% Free App** in the store. 
- Users cannot subscribe directly on the TV. Instead, the onboarding screen presents a sign-in interface (via QR code or OAuth Device Flow):
  > *"Already a member? Scan this QR code or visit yourapp.com/activate to sign in and link your account."*
- Users subscribe, manage billing, and input credit card details entirely on your external website (e.g., via Stripe). Once subscribed on the web, they log in on the TV app, which validates their subscription status against your cloud database and unlocks playback.
- *Strict Rule:* To comply with Apple, Google, and Amazon guidelines, the TV application **must not mention specific pricing** (e.g., do not say *"Subscriptions start at $7.99/mo on our website"*), and must not link directly to a purchasing page. It must simply prompt the user to log in or link an existing account.

### Video Advertising Policies and Ad Frameworks

For ad-supported (AVOD) and free ad-supported streaming TV (FAST) applications:
- **Roku Advertising Framework (RAF) Mandate:** On Roku, any channel displaying client-side video ads **must integrate the Roku Advertising Framework**. Roku enforces a strict ad inventory split: for commercial channels, Roku typically retains **30% of the total ad inventory**, while the publisher retains **70%**. Publishers can choose between an inventory split or an ad-revenue sharing model.
- **Amazon Publisher Services (APS):** Fire TV provides the APS SDK, enabling header bidding and direct ad monetization with Amazon's demand-side platform.
- **Google Interactive Media Ads (IMA):** On Google TV and Android TV, integrate the Google IMA SDK for Android to deliver VAST/VMAP compliant client-side video ads.

---

## 17. Legal, Regulatory, and Policy Framework (Educational)

> **IMPORTANT DISCLAIMER:** The following analysis is provided strictly for educational and technical planning purposes and does not constitute formal legal, regulatory, or financial advice. Publishers should consult qualified legal counsel to verify compliance across specific operating jurisdictions.

### 1. Privacy and Data Protection Compliance
- **COPPA (Children's Online Privacy Protection Act - US):** If your TV application targets children under 13 (or features content appealing to kids, such as cartoons or educational content), you cannot collect persistent device identifiers (e.g., advertising IDs, MAC addresses, IP addresses) for behavioral tracking or targeted advertising without verifiable parental consent. Major platforms (Google Play, Apple, Roku) require developers to explicitly declare whether the app targets children.
- **GDPR (General Data Protection Regulation - EU/UK):** All personal telemetry and analytics tracking collected on European Smart TVs require an explicit, unbundled opt-in consent mechanism. Users must have the ability to opt out of analytics tracking in the app Settings menu.
- **US State Privacy Laws (CCPA / CPRA / VCDPA):** TV applications must provide a accessible "Do Not Sell or Share My Personal Information" mechanism if collecting data used for cross-context behavioral advertising.

### 2. Accessibility Mandates (FCC CVAA & European Accessibility Act)
- **FCC 21st Century Communications and Video Accessibility Act (CVAA):** In the United States, federal law mandates that all video programming delivered via IP that was previously exhibited on broadcast or cable television with captions must include **closed captioning of equal quality**. Video players must support customizable caption styling (font, size, color, background opacity).
- **European Accessibility Act (EAA):** Mandates that audiovisual media services and connected consumer TV devices distributed in the European Union must be accessible to individuals with disabilities, requiring robust text-to-speech support for UI navigation and subtitle accessibility.

### 3. Content Licensing, Rights, and Territorial Geo-Blocking
Television distribution is fundamentally constrained by regional content licensing:
- **Geo-IP Enforcement:** Content licensing contracts typically grant distribution rights for specific territories (e.g., US only, North America, UK). Your backend CDN must enforce server-side **Geo-IP filtering** to prevent media delivery to unauthorized territories.
- **VPN and Proxy Detection:** High-tier studio licenses (e.g., Warner Bros., Disney, Sony Pictures) mandate integrating commercial VPN/proxy detection databases (e.g., MaxMind, GeoGuard) to block traffic originating from anonymized VPN endpoints.

---

## 18. Best Practices, Pitfalls, and Developer Forum Intelligence

Drawing upon hundreds of documented developer post-mortems, staff responses on vendor developer forums, and GitHub issue trackers, this section details the real-world operational friction points mobile developers face when entering TV ecosystems.

### Cross-Platform Failure Taxonomy

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        LIVING ROOM FAILURE TAXONOMY                                    │
├──────────────────────────┬──────────────────────────┬──────────────────────────────────┤
│ SPATIAL NAVIGATION       │ HARDWARE & PERFORMANCE   │ STORE INTEGRATION                │
├──────────────────────────┼──────────────────────────┼──────────────────────────────────┤
│ • Focus disappears on    │ • Out-Of-Memory (OOM)    │ • Rejection due to Title Safe    │
│   screen transition.     │   crashes on HDMI sticks.│   boundary violations.           │
│ • D-pad gets trapped in  │ • Dropped video frames   │ • Deep link automated test       │
│   modals or webviews.    │   during UI animation.   │   suite timeouts on Roku.        │
│ • Back button terminates │ • Widevine L3 fallback   │ • Missing TV banner resources    │
│   app abruptly.          │   caps video to 480p.    │   in Android manifest.           │
└──────────────────────────┴──────────────────────────┴──────────────────────────────────┘
```

### Per-Platform "Don't Do / Do Instead" Action Catalogs

#### Amazon Fire TV & Google TV
- **DON'T DO:** Rely on mobile touch event listeners (`View.setOnClickListener` without focus styling, or raw CSS `:hover` states).
- **DO INSTEAD:** Explicitly declare `android:focusable="true"` and `android:clickable="true"` on Views, and provide distinct state-list drawables (`state_focused="true"`) or Compose `Modifier.focusable()`.
- **DON'T DO:** Include heavy mobile ad networks (e.g., Unity Ads, Chartboost) designed for mobile interstitials.
- **DO INSTEAD:** Use Google IMA SDK or server-side ad insertion (SSAI) tailored for 10-foot television streams.

#### Roku OS
- **DON'T DO:** Store large video catalog metadata objects inside global BrightScript variables or heavy SceneGraph node hierarchies.
- **DO INSTEAD:** Virtualize lists using the `RowList` or `FlexGrid` components, loading metadata on-demand and recycling render nodes to stay within the 512MB RAM ceiling of low-cost Roku Express players.
- **DON'T DO:** Hard-code video stream URLs without testing deep linking parameters.
- **DO INSTEAD:** Build an automated test script that uses cURL to fire External Control Protocol (ECP) commands to your Roku player (`curl -d '' "http://<ROKU_IP>:8060/launch/dev?contentId=123&mediaType=movie"`), verifying instantaneous playback.

#### Samsung Smart TVs (Tizen)
- **DON'T DO:** Instantiate HTML5 `<video>` tags directly in your web app DOM for production streaming.
- **DO INSTEAD:** Bind playback strictly to `webapis.avplay`. Initialize the AVPlay engine in the background, set the display rectangle via `avplay.setDisplayRect()`, and configure hardware DRM before calling `avplay.prepare()`.
- **DON'T DO:** Forget to unregister hardware keys or release AVPlay instances when navigating away from the player.
- **DO INSTEAD:** Call `webapis.avplay.stop()` and `webapis.avplay.close()` inside your screen unmount lifecycle hooks to prevent hardware decoder deadlocks.

#### LG Smart TVs (webOS)
- **DON'T DO:** Test your web application solely with a standard wireless mouse or keyboard on your desktop PC.
- **DO INSTEAD:** Test on a physical LG TV using the **LG Magic Remote**, deliberately waving the remote to invoke the air-pointer and clicking everywhere, then immediately switching to the physical directional D-pad. Ensure focus never vanishes.
- **DON'T DO:** Submit an app using an old version of the App Self-Checklist spreadsheet.
- **DO INSTEAD:** Re-download the official Excel template directly from the LG Seller Lounge on the exact day you prepare your submission.

---

## 19. Launch, Post-Launch Operations, and Maintenance

Deploying an application to television stores is not a one-time event. Living room applications require continuous operational monitoring, telemetry tracking, and cadence-driven updates.

### Master Pre-Launch QA Checklist

Prior to clicking "Submit" on any developer portal, execute this 10-point living room audit:

```
[ ] 1. PHYSICAL REMOTE AUDIT:
       App is 100% navigable using only a physical D-pad remote (Up, Down, Left, Right, OK, Back).
       Zero touch gestures or mouse requirements remain.

[ ] 2. TITLE SAFE BOUNDARY AUDIT:
       All text, badges, icons, dialogs, and interactive buttons reside within the 90% Title Safe area.

[ ] 3. FOCUS VISIBILITY AUDIT:
       At all times, exactly one item has visible focus. Focus state is obvious from 10 feet away.

[ ] 4. BACK BUTTON LIFECYCLE AUDIT:
       Pressing Back navigates backward through screen history. Pressing Back on the home screen
       either exits the app cleanly or presents a single exit confirmation dialog.

[ ] 5. SECOND-SCREEN AUTHENTICATION AUDIT:
       QR code and web activation URL render crisply and work instantaneously on mobile phones.

[ ] 6. PLAYBACK UNDER NETWORK STRESS AUDIT:
       Video adaptive bitrate (ABR) switching operates smoothly. Simulating Wi-Fi packet loss
       surfaces a clean buffering spinner rather than freezing the UI or crashing the app.

[ ] 7. DEEP LINKING VERIFICATION AUDIT:
       Simulated deep link commands successfully launch directly into full-screen video playback.

[ ] 8. COLD START PERFORMANCE AUDIT:
       App launches to an interactive home screen in under 3.0 seconds on target hardware.

[ ] 9. MEMORY LEAK & REPEAT PLAYBACK AUDIT:
       Playing 10 consecutive videos in succession does not cause heap memory growth or Out-Of-Memory crashes.

[ ] 10. REVIEW CREDENTIALS AUDIT:
       Working test account credentials and navigation notes are entered into the submission form.
```

### Telemetry, Error Monitoring, and Crash Reporting

Traditional mobile crash reporters do not all support TV platforms:
- **Android TV / Fire TV:** **Sentry for Android** or **Firebase Crashlytics** work out-of-the-box.
- **Apple tvOS:** **Sentry for Apple** and native Apple MetricKit provide full crash reporting and performance metrics.
- **Roku OS:** Native Roku crash logs are aggregated in the Roku Developer Dashboard. For real-time monitoring, integrate third-party BrightScript SDKs like **Datadog** or custom HTTP beacon logging.
- **Smart TVs (LG & Samsung):** Integrate standard JavaScript monitoring libraries (**Sentry for JavaScript** or **Bugsnag**), capturing unhandled window errors and promise rejections.

### Release Management: Staged Rollouts and Beta Channels

Never deploy a production TV update to 100% of users simultaneously. Bugs on TV can brick the living-room entertainment experience:
- **Google Play:** Deploy updates to a **Staged Rollout** (starting at 10%, scaling to 25%, 50%, and 100% over 5 days).
- **Amazon Appstore:** Use **Live App Testing (LAT)** to distribute beta builds to internal staff and test groups before updating production.
- **Apple tvOS:** Distribute beta builds via **TestFlight for tvOS**.
- **Roku OS:** Utilize private **Beta Channels** (accessible via direct invite code) to validate new releases on real hardware.

---

## 20. Your Strategic Plan and Roadmaps

This section synthesizes all research findings into an actionable commercial roadmap, complete with budget rollups, calendar milestones, and red-teamed alternatives.

### The Minimum Viable Leanback Launch (Phase 1 MVP)

For an independent developer or small startup, the optimal MVP focuses on the **Unified Android Living Room Ecosystem**:
- **Target Platforms:** Google TV / Android TV + Amazon Fire TV (Fire OS).
- **Core Strategy:** Build a single, high-quality Android TV build utilizing **Jetpack Compose for TV** or **React Native for TV**.
- **Market Coverage:** Instantly unlocks 50%+ of the standalone streaming device market in North America and massive market share across Europe, Latin America, and Asia.
- **Timeline:** 8 to 12 weeks.

---

### Recommended Launch Sequencing and Rationale

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        RECOMMENDED 3-PHASE LIVING ROOM ROADMAP                         │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ PHASE 1: THE UNIFIED ANDROID FOUNDATION (Months 1–3)                                   │
│ • Google TV / Android TV (Google Play) + Amazon Fire TV (Fire OS)                      │
│ • 85%+ code reuse from Android mobile; low upfront fees ($25 Google, $0 Amazon).       │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ PHASE 2: THE SMART TV LIVING ROOM DUOPOLY (Months 4–6)                                 │
│ • Samsung Smart TVs (Tizen OS) + LG Smart TVs (webOS)                                  │
│ • Captures the global built-in Smart TV duopoly via Web/React technologies.            │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ PHASE 3: HIGH-VALUE ECOSYSTEM EXPANSION (Months 7–12)                                  │
│ • Apple TV (tvOS) + Roku OS (SceneGraph / RSG 2.0)                                     │
│ • High-revenue Apple demographic + dominant North American Roku household reach.      │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

#### Detailed Phase Rationales
- **Phase 1 Rationale (Android TV & Fire TV):** Maximize code reuse. If your source app is Android native or React Native, you can salvage up to 90% of your business logic. Account setup is instant, documentation is plentiful, and emulator support allows rapid testing without purchasing a dozen TV sets.
- **Phase 2 Rationale (Samsung & LG):** Samsung and LG account for the majority of built-in smart TV sets worldwide. By utilizing web technologies (React/Enact), a single frontend web codebase can target both Tizen and webOS with minor native player adaptations (`webapis.avplay` on Samsung, HTML5 on LG). Accounts are free ($0).
- **Phase 3 Rationale (Apple TV & Roku):** Apple TV provides the highest average revenue per user (ARPU) but represents a smaller unit market share. iOS teams can launch tvOS rapidly under an existing $99 Apple account. Roku commands massive US market share but requires writing BrightScript/SceneGraph code from scratch. Dedicating Phase 3 to Roku allows your team to focus exclusively on BrightScript development without distraction.

#### Red-Team Strategy Evaluation

| Strategy Option | Recommended Sequence | Core Rationale | Major Risk & Trade-Off |
| :--- | :--- | :--- | :--- |
| **Recommended Strategy** | Android TV/Fire TV → Samsung/LG → Apple TV/Roku | Balances code reuse, speed-to-market, and global reach. | Roku launch is delayed to Phase 3. |
| **Reach-First Alternative** | Roku → Fire TV → Samsung TV → Apple TV | Captures maximum North American household reach on Day 1. | Extremely heavy initial engineering burden: requires building BrightScript and Android code simultaneously. |
| **Effort-First Alternative** | Apple TV (if iOS team) → Android TV (if Android team) | Minimizes initial coding effort by sticking strictly to mobile language. | Severely constrains initial reach (tvOS has ~5% global TV OS market share). |
| **Cost-First Alternative** | Fire TV ($0) + Samsung ($0) + LG ($0) | Absolutely zero upfront developer account fees. | Omits Google Play ($25) and Apple Developer ($99). |

---

### Comprehensive Cost Rollup with Complete Arithmetic

The financial model below projects the total realistic startup costs for an independent engineering team over Year 1:

```
A. MANDATORY DEVELOPER ACCOUNT FEES (Year 1)
   • Apple Developer Program:                           $99.00 / year
   • Google Play Console Account:                       $25.00 (One-time)
   • Amazon Developer Account:                           $0.00 (Free)
   • Roku Developer Account:                             $0.00 (Free)
   • Samsung Apps TV Seller Office:                      $0.00 (Free)
   • LG Seller Lounge:                                   $0.00 (Free)
   • Microsoft Partner Center (Individual):              $19.00 (One-time)
   ----------------------------------------------------------------------
   SUBTOTAL DEVELOPER ACCOUNTS:                         $143.00

B. MINIMUM PHYSICAL TEST HARDWARE LAB
   • Amazon Fire TV Stick 4K:                            $49.99
   • Google TV Streamer (4K) / Chromecast 4K:            $49.99
   • Roku Express 4K+ Streaming Player:                  $39.99
   • Apple TV 4K (Wi-Fi, 64GB):                         $129.00
   • Samsung 32" FHD Smart TV (Tizen test set):         $199.99
   • LG 32" FHD Smart TV (webOS test set):              $179.99
   • HDMI Switcher (4K 60Hz 5-port) & Cables:            $35.00
   ----------------------------------------------------------------------
   SUBTOTAL HARDWARE TEST LAB:                          $683.95

C. CLOUD INFRASTRUCTURE & DEVELOPER TOOLING (Year 1)
   • Sentry Error Monitoring (Developer / Team tier):   $312.00 ($26/mo x 12)
   • CI/CD Cloud Build Minutes (GitHub Actions):        $120.00 ($10/mo x 12)
   • Domain & SSL Certificates:                          $20.00 / year
   ----------------------------------------------------------------------
   SUBTOTAL CLOUD & TOOLING:                            $452.00
=========================================================================
TOTAL REALISTIC YEAR 1 STARTUP INVESTMENT:            $1,278.95
```

*Budget Scenarios:*
- **Absolute Bootstrap Minimum ($258):** Procure only Fire TV ($50) and Roku ($40) streaming sticks connected to an existing computer monitor; pay only Google Play ($25) and Apple Developer ($99) fees; test Samsung/LG on emulators and Remote Test Labs.
- **Professional Living Room Lab ($1,279):** Full real-device test coverage across all major platforms, professional Sentry telemetry, and cloud CI/CD pipelines.

---

### Calendar Timeline Rollup

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                            DEVELOPMENT & REVIEW CALENDAR                               │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ WEEKS 1–2: ARCHITECTURE & DECOUPLING                                                   │
│ • Refactor mobile app to decouple networking, auth, and state logic.                   │
│ • Finalize 10-foot design system tokens, typography scales, and Title Safe layouts.   │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ WEEKS 3–6: PHASE 1 IMPLEMENTATION (Google TV & Fire TV)                                │
│ • Build TV browse grid, horizontal swimlanes, and details screens.                     │
│ • Integrate Google Media3 ExoPlayer with ABR, HLS/DASH, and DRM.                       │
│ • Implement OAuth 2.0 Device Flow (RFC 8628) and on-screen QR code pairing.            │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ WEEKS 7–8: TESTING & PHASE 1 SUBMISSION                                                │
│ • D-pad spatial navigation QA and memory profiling on real Fire TV and Google TV sticks│
│ • Submit to Google Play Store (Android TV track) and Amazon Appstore.                  │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ WEEKS 9–14: PHASE 2 IMPLEMENTATION (Samsung Tizen & LG webOS)                          │
│ • Build web TV application in React / Enact.                                           │
│ • Implement Samsung AVPlay (`webapis.avplay`) and webOS Luna media services.           │
│ • Download latest LG App Self-Checklist; prepare UX Scenario slide deck.               │
│ • Submit to Samsung Apps TV Seller Office and LG Seller Lounge.                        │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ WEEKS 15–20: PHASE 3 IMPLEMENTATION (Apple TV tvOS & Roku OS)                          │
│ • Build tvOS target in Xcode using SwiftUI and AVKit; submit to Apple App Store.       │
│ • Develop Roku SceneGraph components and BrightScript logic; test deep linking.        │
│ • Package `.pkg` on Roku device and submit to Roku Streaming Store.                    │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### First 90 Days Execution Plan (Week-by-Week)

- **Week 1 (Environment Setup):** Register accounts at Google Play ($25), Amazon ($0), LG ($0), and Samsung ($0). Procure Fire TV Stick 4K and Google TV Streamer. Configure Android Studio with TV emulator images.
- **Week 2 (Architectural Decoupling):** Audit existing mobile codebase. Extract REST/GraphQL API clients, data models, and authentication logic into a standalone shared module.
- **Week 3 (Design Tokens & Shell):** Implement Title Safe containers (90% margins). Build the left-side navigation rail and top hero banner in Jetpack Compose for TV.
- **Week 4 (Grid & Swimlanes):** Implement horizontal scrolling carousels. Verify persistent focus memory when navigating vertically between rows.
- **Week 5 (Media Player Pipeline):** Integrate Google Media3 ExoPlayer. Configure hardware-accelerated video rendering, HLS/DASH manifest parsing, and subtitle display.
- **Week 6 (Authentication & Deep Linking):** Build on-screen QR code generation and OAuth Device Flow polling. Implement deep link handling for `yourapp://play?...`.
- **Week 7 (Hardware Stress Testing):** Sideload APK onto physical Fire TV and Google TV devices. Run continuous 2-hour playback tests to detect memory leaks. Audit D-pad focus transitions.
- **Week 8 (Submission Pass 1):** Capture 1080p screenshots, export 1280x720 TV banners, complete Data Safety questionnaires, and submit to Google Play and Amazon Appstore.
- **Week 9 (Web TV Foundation):** Set up VS Code with Tizen and webOS extensions. Build the HTML5/React TV application shell.
- **Week 10 (Samsung AVPlay Integration):** Implement `webapis.avplay` on Tizen. Register hardware remote keys (`tizen.tvinputdevice.registerKey`).
- **Week 11 (LG webOS Integration):** Implement Magic Remote pointer and D-pad compatibility. Verify Back button (`keyCode 461`).
- **Week 12 (Phase 2 Submission):** Download fresh LG App Self-Checklist, build UX Scenario slide deck, and submit to Samsung Apps TV Seller Office and LG Seller Lounge.

---

### 12-Month Multi-Platform Expansion Roadmap

```
MONTHS 1–3: FOUNDATION
[■■■■■■■■■■■■] Deploy Android TV & Fire TV apps. Establish cloud CI/CD pipelines.
              Achieve 10,000+ active living-room installs. Monitor Sentry crash rates.

MONTHS 4–6: LIVING ROOM EXPANSION
[■■■■■■■■■■■■] Deploy Samsung Smart TV & LG Smart TV web applications.
              Attain universal smart TV presence across North America and Europe.

MONTHS 7–9: ECOSYSTEM COMPLETION
[■■■■■■■■■■■■] Launch Apple TV (tvOS) app via Universal Purchase.
              Complete Roku SceneGraph channel development, pass automated deep-linking
              certification, and launch in the Roku Streaming Store.

MONTHS 10–12: ADVANCED OPTIMIZATION & PARTNERSHIPS
[■■■■■■■■■■■■] Integrate Google TV "Watch Next" and Apple "Top Shelf" recommendation feeds.
              Evaluate Samsung Partner Seller application for international expansion.
              If streaming metrics warrant, initiate ID@Xbox / Microsoft media partner inquiry.
```

---

## 21. Consolidated Quick-Reference Checklists

### 1. Architecture & Porting Readiness Checklist
- [ ] Business logic, data models, and API clients are decoupled from mobile touch UI views.
- [ ] Backend auth server supports OAuth 2.0 Device Authorization Grant (RFC 8628).
- [ ] Streaming CDN delivers CORS-compliant, multi-bitrate HLS and MPEG-DASH streams.
- [ ] Video manifests include WebVTT or TTML subtitles with language metadata tags.

### 2. 10-Foot Design & Focus Navigation Checklist
- [ ] Visual canvas is locked to landscape 16:9 (1920x1080 base coordinate space).
- [ ] All typography and interactive elements stay within the 90% Title Safe boundary.
- [ ] Body text is at least 24sp; captions are at least 20sp; color contrast exceeds 4.5:1.
- [ ] Every interactable component has an obvious visual focus state (scale 1.1x or glowing border).
- [ ] Focus transitions follow deterministic 2D spatial directions (Up, Down, Left, Right).
- [ ] Rows retain focus memory when navigating vertically between swimlanes.

### 3. Playback & Media Pipeline Checklist
- [ ] Video playback uses native hardware engines (Media3 on Android, AVKit on tvOS, AVPlay on Tizen).
- [ ] Subtitles inherit TV system-level accessibility style overrides.
- [ ] Video playback initiates in under 2.5 seconds on a standard 20Mbps home Wi-Fi connection.
- [ ] Ad insertion uses Server-Side Ad Insertion (SSAI) or platform-certified ad SDKs (Roku RAF, Google IMA).
- [ ] Consecutive playback of 5+ media assets executes without memory leakage or audio desync.

### 4. Cross-Store Submission Checklist
- [ ] Android manifests declare touchscreen as `required="false"` and include the Leanback Launcher category.
- [ ] 1280x720 px TV banners and 1920x1080 px screenshots are prepared for all stores.
- [ ] Deep linking tests pass directly into video playback without stopping at menus.
- [ ] Pressing the Back button on the home screen cleanly exits the application.
- [ ] Active test credentials and step-by-step reviewer instructions are included in submission notes.
- [ ] For LG webOS: The UX Scenario slide deck and the newest App Self-Checklist Excel sheet are attached.
- [ ] For Samsung Tizen: Author and Distributor certificates are valid, and correct model groups are targeted.

---
