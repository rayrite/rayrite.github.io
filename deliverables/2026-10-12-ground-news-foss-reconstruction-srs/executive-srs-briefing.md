# Executive SRS Briefing: Ground News FOSS Decompilation & Multi-Platform Architecture

> **Document Type:** Executive Engineering Briefing & Specifications Summary  
> **Standard:** IEEE Std 830-1998 / ISO/IEC/IEEE 29148:2018  
> **Target Platform:** [Ground News (ground.news)](https://ground.news/) / Snapwise Inc.  
> **Decompiled Mobile Identifiers:** Android: `com.checkitt` | iOS: `id1324203419`  
> **Delivery Date:** 2026-10-12  
> **Accompanying Deliverables:**  
> - Full SRS & AST Reconstruction: [`ground-news-full-srs-and-ast-reconstruction.md`](file:///d:/stuff/ai-misc/_bsh2026/vscode_project01/46-wide_research_test_gemini/deliverables/2026-10-12-ground-news-foss-reconstruction-srs/ground-news-full-srs-and-ast-reconstruction.md)  
> - Portable Interactive HTML UI Showcase: [`ground-news-ui-mockup-showcase.html`](file:///d:/stuff/ai-misc/_bsh2026/vscode_project01/46-wide_research_test_gemini/deliverables/2026-10-12-ground-news-foss-reconstruction-srs/ground-news-ui-mockup-showcase.html)  

---

## 1. Executive Summary & Vision

This Software Requirements Specification (SRS) establishes a complete, platform-agnostic reconstruction blueprint for an open-source media intelligence platform matching the capabilities of **Ground News** (operated by **Snapwise Inc.**).

Ground News reconceptualizes news aggregation from an aerospace multi-sensor data fusion perspective. In this paradigm:
- Tens of thousands of global news outlets act as observational sensors reporting on real-world events.
- Rather than optimizing for engagement, the platform clusters multiple perspectives, evaluates political coverage distribution across a 7-point consensus spectrum, highlights media blindspots, and surfaces corporate media ownership patterns.

```
+--------------------------------------------------------------------------------------------------+
|                               EXECUTIVE SYSTEM ARCHITECTURE AT A GLANCE                          |
+--------------------------------------------------------------------------------------------------+
|                                                                                                  |
|   50,000+ Ingested Sources            Kafka / BullMQ Priority Queues         PostgreSQL 16 Master|
|   (RSS, Wire, WAF Proxy Router) ----> (P1: Wire, P2: RSS, P3: NLP) --------> (pgvector HNSW Hashing|
|                                                                                      |           |
|                                                                                      v           |
|   Triple-Watchdog Consensus           Blindspot Skew Mathematical Model      SvelteKit / Fastify |
|   (AllSides + Ad Fontes + MBFC) <---- (Left vs Right Partisan Ratio) <------ Realtime SSE Gateway|
|                                                                                      |           |
|                                                                                      v           |
|   Multi-Platform Delivery Tiers:                                                                 |
|   - Web (SvelteKit 2) & Desktop (Tauri v2)                                                       |
|   - Mobile (Dart/Flutter & Native Kotlin/Swift)                                                  |
|   - Wearables (watchOS / Wear OS) & Ambient IoT (ESP32 E-Ink & Raspberry Pi)                     |
|   - Immersive Spatial Newsrooms (Apple visionOS, Meta Horizon OS, Android XR, Pico OS)           |
+--------------------------------------------------------------------------------------------------+
```

---

## 2. Reverse-Engineering & FOSS Decompilation Audit

The reconstruction was informed by decompiling production binaries using Free and Open-Source Software (FOSS) tools:
- **JADX & Apktool:** Decompiled Dalvik bytecode from `com.checkitt` into clean Kotlin AST classes, exposing Jetpack Compose views, Room SQLite offline-first repositories, and WorkManager background sync workers.
- **Ghidra & Radare2:** Disassembled native shared libraries, verifying TLS 1.3 certificate pinning configurations, memory protections, and RootBeer anti-tampering guards.
- **Class-Dump-Swift:** Reconstructed Swift 6 actor pipelines, Combine state stores, and StoreKit 2 subscription transaction handlers on iOS.

---

## 3. High-Level Requirements Summary

The full specification defines **20 Functional Requirements (FR-01 to FR-20)** and **10 Non-Functional Requirements (NFR-01 to NFR-10)**:

| Functional Domain | Key Requirements Enforced | Target Performance / Standard |
| :--- | :--- | :--- |
| **Ingestion Grid** | Wire streaming, 70k RSS endpoints, rotating proxy router, paywall detection | Ingestion latency $< 3.0$ seconds from publisher drop |
| **ML & NLP Engine** | Sentence-BERT 384-dim embeddings, HDBSCAN clustering, triple-watchdog consensus | $\ge 98.5\%$ clustering purity; $< 12	ext{ms}$ embedding time |
| **User Experience** | Multi-Spectrum Bias Bar, side-by-side perspectives, ownership graph, My Bias | Sub-second LCP; 60fps micro-animations |
| **Security & Identity** | Anonymous keypair migration, RFC 6238 TOTP, Passkeys, SPKI TLS pinning | OWASP Mobile Top 10 compliance; RASP tamper defense |
| **B2B & Monetization**| SCIM 2.0 provisioning, SAML 2.0 SSO, Stripe, Apple StoreKit 2, Polygon Web3 | Multi-store receipt validation; Merkle tree provenance |

---

## 4. Multi-Platform Architectural Spines

| Computing Tier | Target Technology Spine | Distinctive Platform Capability |
| :--- | :--- | :--- |
| **Web** | SvelteKit 2 + Fastify + Node.js LTS | Sub-second LCP, zero-hydration overhead, SSE live bias meters |
| **Mobile** | Dart / Flutter 3.24 | Unified iOS & Android codebase with native biometric secure storage |
| **Desktop** | Tauri v2 + Rust | Native system-tray client with $< 15	ext{MB}$ RAM idle footprint |
| **Game Engines** | Unity3D (C#) & Phaser 3 (TypeScript) | Volumetric 3D news constellation & gamified newsroom simulator |
| **Wearables** | watchOS (SwiftUI) & Wear OS (Glance) | Complications displaying live blindspot headlines & mini bias meters |
| **Ambient IoT** | ESP32 (E-Ink) & Raspberry Pi 5 | Low-power 4.2" e-paper desk ticker (6-month battery life in deep sleep) |
| **Spatial XR** | Apple visionOS, Horizon OS, Android XR | 180-degree volumetric spatial news canvas across depth planes |

---

## 5. Portable Interactive UI Showcase

A standalone, dependency-free interactive HTML application has been generated:  
[`ground-news-ui-mockup-showcase.html`](file:///d:/stuff/ai-misc/_bsh2026/vscode_project01/46-wide_research_test_gemini/deliverables/2026-10-12-ground-news-foss-reconstruction-srs/ground-news-ui-mockup-showcase.html)

**Showcase Features:**
1. **Desktop Newsroom Dashboard:** Full interactive story comparison card with dynamic 3-color bias bar, side-by-side Left/Center/Right article columns, and Blindspot Radar sidebar.
2. **Mobile Device Frame Simulator:** iPhone 16 Pro simulated viewport with dynamic island, status bar, and bottom navigation tabs (Home, Blindspot, Local, My Bias).
3. **Ambient IoT E-Ink Display:** High-contrast monochrome e-paper display emulation showing low-power desk ticker rendering.
4. **Interactive Controls:** Light/Dark mode switcher, real-time category filtering (Top Stories, Blindspots, Technology), and media ownership modal drawers.
