# Reverse Engineer Anything Skill Guide

**Classification**: CVX Unified Research Collection  
**Source Deliverable**: `2026-10-12-reverse-engineer-anything-skill-guide`  
**Constituent Files**: 1 documents  
**Generated**: 2026-10-14 03:57:28  

---

## Master Table of Contents

1. [Reverse Engineer Anything (REA) — Comprehensive Agent Skill & Tools User Guide](#doc-1-reverse-engineer-anything-user-guide) (`reverse-engineer-anything-user-guide.md`)


---

<a id="doc-1-reverse-engineer-anything-user-guide"></a>
<!-- ====================================================================== -->
<!-- FILE: reverse-engineer-anything-user-guide.md (Sequence: 01 of 01) -->
<!-- ====================================================================== -->

# Reverse Engineer Anything (REA) — Comprehensive Agent Skill & Tools User Guide

> **Document Version:** 1.0.0  
> **Target Skill:** `reverse-engineer-anything` (v37 / REA 6.4.0)  
> **Scope:** Architecture, CLI Commands, 130+ MCP Tools, and Beginner to Advanced Reverse-Engineering Workflows  
> **Environment:** Multi-Platform (Windows, Linux, macOS) | Primary IDE: Antigravity / Claude Code / Codex / VS Code

---

## Table of Contents

1. [Executive Summary & Skill Architecture](#1-executive-summary--skill-architecture)
   - [Evidence-Based Reverse Engineering Philosophy](#evidence-based-reverse-engineering-philosophy)
   - [Provider Ecosystem & Engine Boundaries](#provider-ecosystem--engine-boundaries)
   - [Supported Client Integrations](#supported-client-integrations)
2. [CLI Commands & Environment Management](#2-cli-commands--environment-management)
   - [Diagnostic & Setup Commands (`rea doctor`, `rea setup`)](#diagnostic--setup-commands)
   - [Headless CLI Operations](#headless-cli-operations)
   - [NPX Fallback & Package Acquisition](#npx-fallback--package-acquisition)
3. [Master Catalog of REA Features & MCP Tools](#3-master-catalog-of-rea-features--mcp-tools)
   - [3.1 Session & Target Management](#31-session--target-management)
   - [3.2 Native Binary Disassembly & Pseudocode (Ghidra / IDA / Hopper)](#32-native-binary-disassembly--pseudocode-ghidra--ida--hopper)
   - [3.3 Navigation, Procedures & Control Flow](#33-navigation-procedures--control-flow)
   - [3.4 Memory, Data Types & Bytes Inspection](#34-memory-data-types--bytes-inspection)
   - [3.5 Function Annotations, Naming & Session Bookmarks](#35-function-annotations-naming--session-bookmarks)
   - [3.6 Windows PE & Binary Diagnostics](#36-windows-pe--binary-diagnostics)
   - [3.7 Linux ELF Layout & Crash Core Dumps](#37-linux-elf-layout--crash-core-dumps)
   - [3.8 Apple / macOS / iOS / Mach-O Analysis](#38-apple--macos--ios--mach-o-analysis)
   - [3.9 JavaScript & Electron Applications (ASAR & AST)](#39-javascript--electron-applications-asar--ast)
   - [3.10 Android APK, JADX & ADB Mobile Diagnostics](#310-android-apk-jadx--adb-mobile-diagnostics)
   - [3.11 Managed .NET & CLI Assemblies](#311-managed-net--cli-assemblies)
   - [3.12 Firmware & Embedded EVM Bytecode](#312-firmware--embedded-evm-bytecode)
   - [3.13 Web & Browser Runtime Observation (CDP)](#313-web--browser-runtime-observation-cdp)
   - [3.14 Dynamic Tracing & Scenario Capture](#314-dynamic-tracing--scenario-capture)
   - [3.15 Comparison, Reconstruction & The Evidence Ledger](#315-comparison-reconstruction--the-evidence-ledger)
4. [Beginner Techniques & Workflows](#4-beginner-techniques--workflows)
   - [Technique 1: Session Discovery & Tool Verification](#technique-1-session-discovery--tool-verification)
   - [Technique 2: Archive & Bundle Inventory (`inspect_artifact`)](#technique-2-archive--bundle-inventory-inspect_artifact)
   - [Technique 3: Windows PE Resource Extraction (`inspect_pe_resources`)](#technique-3-windows-pe-resource-extraction-inspect_pe_resources)
   - [Technique 4: Fast JavaScript / Electron Summary Analysis](#technique-4-fast-javascript--electron-summary-analysis)
   - [Technique 5: String Search & Procedure Listing](#technique-5-string-search--procedure-listing)
5. [Intermediate Techniques & Workflows](#5-intermediate-techniques--workflows)
   - [Technique 6: Decompiling Functions & Reading Pseudocode](#technique-6-decompiling-functions--reading-pseudocode)
   - [Technique 7: Callers, Callees & Call Graph Extraction](#technique-7-callers-callees--call-graph-extraction)
   - [Technique 8: Paged Module Exploration in Massive Electron Apps](#technique-8-paged-module-exploration-in-massive-electron-apps)
   - [Technique 9: Headless Android APK Reversing with JADX](#technique-9-headless-android-apk-reversing-with-jadx)
   - [Technique 10: Dynamic LLDB Function Call Tracing on macOS](#technique-10-dynamic-lldb-function-call-tracing-on-macos)
   - [Technique 11: Ghidra Session Mutation & Function Annotation](#technique-11-ghidra-session-mutation--function-annotation)
6. [Advanced Techniques & Workflows](#6-advanced-techniques--workflows)
   - [Technique 12: Offline Linux ELF Core Crash Analysis](#technique-12-offline-linux-elf-core-crash-analysis)
   - [Technique 13: EVM Smart Contract Bytecode Deobfuscation](#technique-13-evm-smart-contract-bytecode-deobfuscation)
   - [Technique 14: Version Diffing & Export Object Shape Tracking](#technique-14-version-diffing--export-object-shape-tracking)
   - [Technique 15: Static & Runtime AST Reconciliation (CDP)](#technique-15-static--runtime-ast-reconciliation-cdp)
   - [Technique 16: Live Mobile Instrumentation via ADB Subsystem](#technique-16-live-mobile-instrumentation-via-adb-subsystem)
   - [Technique 17: Scientific Verification & The Unknown Registry](#technique-17-scientific-verification--the-unknown-registry)
   - [Technique 18: Managing Large MCP Transport Frames (`resource_constraint`)](#technique-18-managing-large-mcp-transport-frames-resource_constraint)
7. [Troubleshooting & Connection Recovery Matrix](#7-troubleshooting--connection-recovery-matrix)
8. [Summary & Best Practices](#8-summary--best-practices)

---

## 1. Executive Summary & Skill Architecture

The **Reverse Engineer Anything (REA)** agent skill provides an institutional-grade, multi-target reverse engineering framework. It transforms an AI agent into an expert reverse engineering assistant capable of decomposing native executables, managed runtimes, mobile applications, Electron/JavaScript bundles, firmware blobs, and web runtimes.

```
+----------------------------------------------------------------------------------------------------+
|                                      REA Agent Skill Architecture                                  |
+----------------------------------------------------------------------------------------------------+
|                                                                                                    |
|   +-----------------------+     +--------------------------+     +-----------------------------+   |
|   |  Agent IDE / Clients  | <-> |   REA MCP Server / CLI   | <-> |    Underlying Analysis      |   |
|   |  (Antigravity, Codex, |     |   (130+ Tools, Protocol) |     |          Engines            |   |
|   |   Claude Code, Cursor)|     +--------------------------+     +-----------------------------+   |
|   +-----------------------+                   |                                   |                |
|                                               v                                   v                |
|                              +----------------------------------+     +-----------------------+    |
|                              |      REA Evidence Ledger         |     | * Ghidra / IDA Pro    |    |
|                              | - Immutable Evidence IDs (ev_*)  |     | * JADX Headless JAR   |    |
|                              | - Observations vs. Inferences    |     | * Pwntools / LLDB     |    |
|                              | - Residual Unknowns Registry     |     | * CDP Runtime / ADB   |    |
|                              +----------------------------------+     +-----------------------+    |
+----------------------------------------------------------------------------------------------------+
```

### Evidence-Based Reverse Engineering Philosophy

REA enforces strict epistemic discipline:
1. **Separation of Facts:** Every conclusion must explicitly delineate **Observations** (raw bytes, disassembly, static syntax, manifest values), **Inferences** (candidate function prototypes, decompiled pseudocode, IPC channel pairings, reconstructed object shapes), and **Residual Unknowns** (unresolved dynamic calls, unobserved branches, missing symbols).
2. **Deterministic Evidence Tracking:** Operations generate immutable `evidence_id` tokens (e.g. `ev_0123...`). These IDs can be referenced across tools and sessions without re-running expensive decompilation or disassembly passes.
3. **Zero Hallucination of Runtime Execution:** Static analysis tools never claim runtime reachability, execution, or default policy enforcement. Runtime tools are strictly passive or explicitly isolated.

### Provider Ecosystem & Engine Boundaries

REA delegates specific domain tasks to specialized bring-your-own providers:
* **Native Disassembly & Decompilation:** Ghidra (headless), IDA Pro (via `ida-pro-mcp` bridge), Hopper Disassembler.
* **Android Bytecode:** Headless JADX MCP JAR (`REA_JADX_MCP_JAR`) running under Java 17+ JDK.
* **Linux ELF & Crashes:** `pwntools`, GDB / `pwndbg` core-dump analyzers.
* **Electron / JavaScript:** Dedicated AST parser, source-map resolver, and graph engine.
* **Mobile & Dynamic Device Controls:** Native Android Debug Bridge (`adb`), Apktool, JEB decompiler.
* **Web & Browser Runtimes:** Passive Chrome DevTools Protocol (`CDP`) loopback socket.

### Supported Client Integrations

REA integrates natively via Model Context Protocol (`mcp.json`) or stdio configuration across:
* `antigravity` (Google Antigravity IDE)
* `codex` (OpenAI Codex CLI)
* `claude_code` / `claude_desktop` (Anthropic Claude)
* `cursor`, `windsurf`, `vscode`
* `gemini_cli`, `copilot_cli`, `qwen_code`, `devin`, `opencode`

---

## 2. CLI Commands & Environment Management

REA is shipped as a Node.js CLI tool (`rea`) and packaged as an MCP server.

### Diagnostic & Setup Commands

When setting up or debugging client registrations, use the REA management commands:

#### 1. Doctor Inspection
Inspect registration status, connected engines, and environment sanity without modifying configuration:
```bash
# General doctor diagnostics in JSON
rea doctor --json

# Client-specific registration verification (e.g. for codex, antigravity, claude_code)
rea doctor --client antigravity --json
```

#### 2. Scoped Configuration Setup
Configure or repair MCP server registration in the active client:
```bash
# Dry run to preview paths, backups, and proposed mcp.json edits
rea setup --client antigravity --dry-run --json

# Execute registration with non-interactive confirmation
rea setup --client antigravity --yes

# Optional: Enable Hopper integration (requires explicit flag)
rea setup --client antigravity --yes --install-hopper
```

### Headless CLI Operations

REA commands can be executed in headless scripts or terminal pipelines without spinning up an agent:

```bash
# Check version and environment
rea --version
node --version

# Analyze an Electron ASAR or JavaScript bundle directly into JSON
rea analyze-javascript-application /path/to/app.asar --json > app-evidence.json

# Project a summary view from existing evidence without re-running AST analysis
jq -c '{source: {kind: "inline", evidence: .}, view: {kind: "summary"}}' app-evidence.json > app-view.json
rea inspect-analysis-view app-view.json

# Inspect Windows PE resources offline
rea inspect-pe-resources /path/to/target.exe --json > pe-resources.json

# Inspect an exported evidence bundle
rea inspect-evidence-bundle --path session-bundle.json --detail summary
```

### NPX Fallback & Package Acquisition

If the global `rea` binary is not in your system `PATH`, use the pinned npm execution wrapper:
```bash
npx -y rea-agents@6.4.0 doctor --json
npx -y rea-agents@6.4.0 setup --client antigravity --yes
```

---

## 3. Master Catalog of REA Features & MCP Tools

The REA MCP server advertises over **130 distinct tools**. Below is the exhaustive reference organized by subsystem.

### 3.1 Session & Target Management

| Tool Name | Parameters / Purpose | Output / Notes |
| :--- | :--- | :--- |
| `open_binary` | `path`, `provider_id` ("ghidra" / "ida"), `format` | Initializes an active native disassembler session. Returns session digest. |
| `close_binary` | None | Closes active native session and releases disassembler locks and memory. |
| `binary_session` | None (`{}`) | Returns target SHA-256, active provider, tool availability list, and remediation. |
| `export_evidence_bundle` | `output_path` | Serializes complete session Evidence ledger to a portable JSON file. |
| `import_evidence_bundle` | `input_path` | Rehydrates prior analysis session without re-executing decompilation passes. |
| `get_evidence_bundle` | `detail`, `filters` (SHA-256, procedure, profile) | Queries retained evidence records by precise operation or digest. |

### 3.2 Native Binary Disassembly & Pseudocode (Ghidra / IDA / Hopper)

| Tool Name | Description | Key Arguments |
| :--- | :--- | :--- |
| `binary_overview` | High-level metadata: architecture, bitness, endianness, base address, entry point. | Active target |
| `list_procedures` | Enumerates discovered functions with entry addresses and size spans. | `offset`, `limit` |
| `procedure_info` | Metadata for a specific function: calling convention, frame size, parameter count. | `address` |
| `procedure_assembly` | Raw linear or block disassembly of a procedure. | `address`, `max_instructions` |
| `procedure_pseudo_code` | High-level decompiled C-like pseudocode. | `address`, `offset`, `limit` |
| `analyze_function` | Generates a complete comprehensive function dossier (AST, CFG, calls, data flows). | `address` |
| `batch_decompile` | Decompiles multiple functions in one pass for batch scanning. | `addresses` (array) |
| `read_function_instructions` | Structured instruction objects (mnemonics, operands, registers read/written). | `address` |
| `inspect_native_instruction` | Deep instruction decode at a specific virtual address. | `address` |
| `resolve_native_call_targets` | Resolves indirect call sites to known jump tables or procedures. | `address` |
| `inspect_native_load_image` | Validates loaded memory segments, file mappings, and relocations against bytes. | Active target |

### 3.3 Navigation, Procedures & Control Flow

| Tool Name | Description |
| :--- | :--- |
| `get_call_graph` | Constructs directed call graph between procedures (caller -> callee relationships). |
| `procedure_callers` | Returns list of all functions calling the target procedure. |
| `procedure_callees` | Returns list of all functions invoked by the target procedure. |
| `procedure_references` | Lists all code and data cross-references pointing to a procedure. |
| `xrefs` | Bidirectional cross-references for any given virtual address. |
| `resolve_containing_procedure` | Identifies which function encloses an arbitrary interior address. |
| `trace_call_path` | Traces reachability paths from source procedure to destination procedure. |
| `get_navigation_context` | Returns current disassembler cursor position and adjacent basic blocks. |
| `goto_address` | Moves cursor to target address in active GUI/session. |
| `current_address` / `next_address` / `prev_address` | Address step navigation primitives. |

### 3.4 Memory, Data Types & Bytes Inspection

| Tool Name | Description |
| :--- | :--- |
| `read_bytes` | Reads raw hex bytes from initialized memory at virtual address. |
| `address_to_file_offset` | Translates virtual runtime address to raw physical file offset on disk. |
| `inspect_native_data_type` | Decodes struct layouts, unions, enums, or typedefs defined in binary headers. |
| `trace_native_values` | Traces register/stack value flow across basic blocks within a procedure. |
| `list_segments` | Enumerates binary sections/segments (`.text`, `.rdata`, `.data`, `.bss`). |

### 3.5 Function Annotations, Naming & Session Bookmarks

| Tool Name | Description |
| :--- | :--- |
| `annotate_native_function` | Atomic update of function name and entry comments in disassembler database. |
| `set_address_name` | Sets primary label/symbol name at virtual address. |
| `set_addresses_names` | Batch renaming of multiple addresses. |
| `set_comment` / `set_inline_comment` | Adds block or instruction-level comments in disassembly. |
| `set_bookmark` / `unset_bookmark` / `list_bookmarks` | Manages analyst bookmarks across complex binaries. |
| `list_names` / `find_xrefs_to_name` | Searches labeled symbols and their references. |
| `search_strings` / `list_strings` | Scans ASCII/UTF-8/UTF-16 strings with offset and section boundaries. |

### 3.6 Windows PE & Binary Diagnostics

| Tool Name | Description |
| :--- | :--- |
| `inspect_pe_resources` | Target-free PE32/PE32+ resource directory traversal (icons, manifests, dialogs, version strings). |
| `inspect_binary_layout` | Offline ELF/PE file section, relocations, symbol table, and mitigation check without engines. |

### 3.7 Linux ELF Layout & Crash Core Dumps

| Tool Name | Description |
| :--- | :--- |
| `inspect_recorded_crash` | Parses Linux x86-64 ELF core dumps: thread registers, signal info, memory mappings, raw notes. |
| `include_debugger_context` | (Facet of crash tool) Integrates GDB/pwndbg for candidate stack unwinding. |

### 3.8 Apple / macOS / iOS / Mach-O Analysis

| Tool Name | Description |
| :--- | :--- |
| `inspect_macho` | Inspects Mach-O load commands, header flags, UUID, CPU sub-types. |
| `list_architectures` | Lists universal "Fat" binary slice architectures (arm64, x86_64). |
| `inspect_signature` | Parses CodeDirectory, entitlements, CMS signatures, team identifiers. |
| `inspect_plist` | Decodes XML and binary Apple property lists (`Info.plist`). |
| `project_apple_application_graph`| Maps macOS/iOS bundles: frameworks, XPC services, app extensions, plugins. |
| `trace_dylib_resolution` | Traces dynamic library search paths (`@rpath`, `@loader_path`, `@executable_path`). |
| `get_objc_classes` / `get_objc_protocols` | Extracts Objective-C runtime class descriptors, ivars, properties, methods. |
| `inspect_native_dispatch_metadata` | Objective-C / Swift selector dispatch and method table mapping. |
| `analyze_swift_types` / `demangle_swift` | Decodes Swift type metadata, mangled symbols, nominal type descriptors. |
| `decode_interface_builder` | Decodes compiled NIB / XIB / Storyboard UI definitions. |
| `inspect_keyed_archive` | Deserializes `NSKeyedArchiver` property list payloads. |
| `inspect_asset_catalog` | Inspects compiled `Assets.car` asset catalogs. |

### 3.9 JavaScript & Electron Applications (ASAR & AST)

| Tool Name | Description |
| :--- | :--- |
| `analyze_javascript_application` | Static AST and dependency graph engine for ASAR or unpacked Electron trees. |
| `inspect_analysis_view` | Paged navigation for modules, summary facets, and semantic exports. |
| `trace_application_feature` | Graph traversal (incoming, outgoing, both) for specific routes, IPC channels, or nodes. |
| `trace_javascript_semantics` | Traces variable flow, closure scopes, and function returns within a JS module. |
| `compare_application_versions` | Structural and digest-level diffing between two application releases. |
| `compare_javascript_export_shapes`| Compares object/function shapes returned by public module exports across versions. |
| `compare_source_to_bundle` | Validates unpacked source modules against minified bundle files. |
| `list_electron_targets` | Discovers running Electron apps exposing CDP debugging ports. |
| `inspect_electron_page` | Inspects live Electron window DOM, preload context, and contextBridge. |
| `capture_electron_scenario` | Passive capture of Electron window lifecycle and console activity. |
| `reconcile_javascript_runtime` | Maps captured runtime scripts back to static AST module identities. |

### 3.10 Android APK, JADX & ADB Mobile Diagnostics

| Tool Name | Description |
| :--- | :--- |
| `inspect_android_package` | Parses APK manifest declarations, permissions, activities, services, SHA digests. |
| `search_android_classes` | Searches class definitions matching regex or substring. |
| `inspect_android_class` | Enumerates class fields, constructors, methods, and access flags via JADX. |
| `inspect_android_method` | Decompiles target DEX method into clean Java source code. |
| `trace_android_references` | Finds all incoming static references to a specific method or field. |
| `project_android_application_graph`| Visualizes intent filters, component hierarchies, and exported entry points. |
| `decode_android_resources` / `inspect_apktool_client` | Uses Apktool to decode `resources.arsc`, XML layouts, and 9-patch assets. |
| `open_jeb_project` / `decompile_jeb_item` | Integrates with commercial JEB decompiler when configured. |
| `list_adb_devices` / `inspect_adb_device` | Enumerates connected physical devices / emulators via ADB. |
| `list_adb_packages` / `inspect_adb_package` | Inspects installed package properties, version codes, split APKs on device. |
| `pull_adb_package` / `pull_adb_file` / `push_adb_file` | Transfers APKs and internal application storage files via ADB. |
| `read_adb_logcat` | Reads real-time device logcat buffers with tag and PID filters. |
| `capture_adb_screen` | Captures device display screenshot for UI flow verification. |
| `list_adb_processes` / `list_adb_services` / `list_adb_features` | Queries Android OS system services, running processes, device features. |
| `start_adb_app` / `start_adb_activity` / `stop_adb_app` | Launches or stops application activities on device. |

### 3.11 Managed .NET & CLI Assemblies

| Tool Name | Description |
| :--- | :--- |
| `inspect_managed_artifact` | Execution-free inspection of .NET CLI PE assemblies (metadata headers, tables). |
| `inspect_managed_members` | Lists types, methods, fields, events, and CIL tokens. |
| `inspect_managed_native_boundaries` | Identifies P/Invoke declarations, DllImport targets, NativeAOT stubs. |
| `compare_managed_members` | Compares type declarations across assembly versions. |
| `verify_managed_native_boundaries` | Audits native calling conventions and marshaling attributes. |
| `import_managed_reconstruction` | Imports external CIL decompiler artifacts into the session. |
| `project_managed_application_graph`| Maps dependency graph across multiple .NET DLLs. |

### 3.12 Firmware & Embedded EVM Bytecode

| Tool Name | Description |
| :--- | :--- |
| `inspect_firmware_regions` | Detects compressed filesystems, headers, and partitions via Binwalk/Unblob. |
| `extract_firmware` | Extracts filesystem images into an isolated temporary workspace directory. |
| `inspect_evm_interface` | Offline analysis of EVM smart contract bytecode (function selectors, arguments, mutability). |

### 3.13 Web & Browser Runtime Observation (CDP)

| Tool Name | Description |
| :--- | :--- |
| `list_browser_targets` | Discovers open Chrome/Chromium tabs exposing loopback CDP port. |
| `inspect_web_page` | Passive inspection of page DOM structure and metadata. |
| `analyze_web_bundle` | Inspects packaged web bundles, scripts, and stylesheets. |
| `inspect_web_network_capture` | Offline parsing of HAR files or mitmproxy captures (headers, sizes, timings). |
| `capture_web_screenshot` | Captures visual layout of active browser tab without interaction. |
| `inspect_web_event_listeners` | Enumerate JavaScript DOM event listeners attached to page elements. |
| `recover_javascript_sources` | Extracts inline scripts and dynamically evaluated sources from memory. |
| `export_web_scripts` | Saves all loaded scripts from a browser session to disk for static review. |

### 3.14 Dynamic Tracing & Scenario Capture

| Tool Name | Description |
| :--- | :--- |
| `observe_native_calls` | Spawns Mach-O binary under LLDB to trace real function/method executions. |
| `observe_native_ui` / `trace_native_ui_action` | Traces UI automation events and accessibility hierarchy. |
| `capture_process_scenario` | Executes monitored target process and records process tree, signals, exit codes. |
| `compare_process_captures` | Compares execution traces between two test runs. |

### 3.15 Comparison, Reconstruction & The Evidence Ledger

| Tool Name | Description |
| :--- | :--- |
| `compare_artifacts` | Canonical diffing of package contents, checksums, and manifest entries. |
| `compare_functions` | Semantic comparison of two function dossiers. |
| `compare_bundles` | Compares bundle memberships and unknowns between distributions. |
| `find_changed_behavior` | Synthesizes differences from static and dynamic traces into candidate behaviors. |
| `build_call_path` | Generates inter-procedural paths from verified function dossiers. |
| `correlate_static_and_runtime` | Maps dynamic execution traces back to static binary disassembly. |
| `list_unknowns` | Displays the current session's registry of open questions and unverified claims. |
| `record_unknown` | Registers an explicit unresolved item with supporting/contradicting evidence. |
| `update_unknown` | Updates state of an unknown (e.g. from open to resolved with evidence). |
| `verify_unknown_resolution` | Formally validates that an unknown has been proven by qualifying evidence. |
| `verify_reconstruction` | Verifies candidate source code against reconstructed binary specifications. |
| `build_reconstruction_obligation_ledger` | Establishes formal coverage ledger for binary re-implementation. |
| `evaluate_reconstruction_coverage` | Calculates percentage of binary methods/behaviors successfully reconstructed. |

---

## 4. Beginner Techniques & Workflows

### Technique 1: Session Discovery & Tool Verification

Before analyzing any target, establish the state of the REA session. This guarantees you do not assume engines are present when they are missing.

```json
// Step 1: Inspect binary session availability
{
  "ServerName": "rea",
  "ToolName": "binary_session",
  "Arguments": {}
}
```

**Expected Result Analysis:**
* `result.open_target`: `null` if no binary is open.
* `result.provider_id`: Shows whether Ghidra or IDA Pro is active.
* `result.tool_availability`: Complete checklist of every tool with availability status (e.g., `available`, `unsupported_platform`, or `missing_prerequisite`).

---

### Technique 2: Archive & Bundle Inventory (`inspect_artifact`)

When handed an installer, ZIP, APK, DMG, MSIX, or IPA, never decompress blindly. Use `inspect_artifact` to parse the manifest and container structure in memory.

```json
// Step 1: Open the archive container
{
  "ServerName": "rea",
  "ToolName": "open_binary",
  "Arguments": {
    "path": "d:/samples/installer_package.msix"
  }
}

// Step 2: Generate the structural inventory graph
{
  "ServerName": "rea",
  "ToolName": "inspect_artifact",
  "Arguments": {}
}
```

**Outcome:**
Returns the complete container graph, file entries, file sizes, SHA-256 hashes, and embedded executable candidates with their respective `node_id` entries.

---

### Technique 3: Windows PE Resource Extraction (`inspect_pe_resources`)

Windows `.exe` and `.dll` binaries contain icon groups, version tables, strings, and manifest XMLs. `inspect_pe_resources` is target-free and requires no disassembler engine:

```json
{
  "ServerName": "rea",
  "ToolName": "inspect_pe_resources",
  "Arguments": {
    "path": "C:/Program Files/TargetApp/target.exe"
  }
}
```

**Key Information Recovered:**
* `RT_MANIFEST`: UAC execution levels (`asInvoker`, `requireAdministrator`), DPI awareness.
* `RT_VERSION`: CompanyName, FileDescription, ProductVersion, OriginalFilename.
* `RT_GROUP_ICON`: Embedded icon assets with exact byte offsets.

---

### Technique 4: Fast JavaScript / Electron Summary Analysis

Electron applications contain an `app.asar` archive. Reading the whole AST directly can overwhelm context. Always start with `detail: "summary"`:

```json
{
  "ServerName": "rea",
  "ToolName": "analyze_javascript_application",
  "Arguments": {
    "target": "C:/Users/User/AppData/Local/Programs/Slack/resources/app.asar",
    "detail": "summary"
  }
}
```

**Outcome:**
Returns a high-level summary including total module counts, detected BrowserWindow configurations, IPC registrations, and a vital field:
```json
{
  "normalized_result": {
    "parent_evidence_id": "ev_4f89b1c20847...",
    "module_count": 1420,
    "ipc_channels_observed": 84
  }
}
```
The `parent_evidence_id` allows targeted drill-downs without re-running AST parsing.

---

### Technique 5: String Search & Procedure Listing

In a native executable session, string references provide immediate entry points for understanding functionality:

```json
// Step 1: Search for relevant strings
{
  "ServerName": "rea",
  "ToolName": "search_strings",
  "Arguments": {
    "query": "LicenseKey",
    "case_sensitive": false
  }
}

// Step 2: Find cross-references to the discovered string address
{
  "ServerName": "rea",
  "ToolName": "xrefs",
  "Arguments": {
    "address": "0x14008a210"
  }
}
```

This immediately identifies which procedures read the string.

---

## 5. Intermediate Techniques & Workflows

### Technique 6: Decompiling Functions & Reading Pseudocode

Once a target function address is known (e.g. `0x140023a10`), obtain its pseudocode:

```json
{
  "ServerName": "rea",
  "ToolName": "procedure_pseudo_code",
  "Arguments": {
    "address": "0x140023a10"
  }
}
```

**Handling Long Pseudocode:**
If the function is large, use pagination parameters:
```json
{
  "ServerName": "rea",
  "ToolName": "procedure_pseudo_code",
  "Arguments": {
    "address": "0x140023a10",
    "offset": 0,
    "limit": 64
  }
}
```
REA returns `next_offset` to continue fetching subsequent blocks.

---

### Technique 7: Callers, Callees & Call Graph Extraction

To understand how data flows through a subsystem, map its callers and callees:

```json
// Step 1: Who calls this procedure?
{
  "ServerName": "rea",
  "ToolName": "procedure_callers",
  "Arguments": {
    "address": "0x140023a10"
  }
}

// Step 2: What does this procedure invoke?
{
  "ServerName": "rea",
  "ToolName": "procedure_callees",
  "Arguments": {
    "address": "0x140023a10"
  }
}

// Step 3: Extract the full call graph sub-tree
{
  "ServerName": "rea",
  "ToolName": "get_call_graph",
  "Arguments": {
    "root_address": "0x140023a10",
    "depth": 3
  }
}
```

---

### Technique 8: Paged Module Exploration in Massive Electron Apps

Building on Technique 4, when you have `parent_evidence_id`, query modules in pages using `inspect_analysis_view`:

```json
// Step 1: Page module identities (returns paths and node_ids only)
{
  "ServerName": "rea",
  "ToolName": "inspect_analysis_view",
  "Arguments": {
    "source": {
      "kind": "retained-evidence",
      "evidence_id": "ev_4f89b1c20847..."
    },
    "view": {
      "kind": "page",
      "collection": "modules",
      "offset": 0,
      "limit": 20
    }
  }
}

// Step 2: Inspect a specific module node by its exact node_id
{
  "ServerName": "rea",
  "ToolName": "inspect_analysis_view",
  "Arguments": {
    "source": {
      "kind": "retained-evidence",
      "evidence_id": "ev_4f89b1c20847..."
    },
    "view": {
      "kind": "item",
      "collection": "modules",
      "selector": {
        "node_id": "jag_node_00042a"
      }
    }
  }
}
```

This prevents token exhaustion by inspecting only the exact module needed.

---

### Technique 9: Headless Android APK Reversing with JADX

REA interacts with headless JADX via `inspect_android_*` tools. These operate target-free (no disassembler session required):

```json
// Step 1: Parse Android manifest and package declarations
{
  "ServerName": "rea",
  "ToolName": "inspect_android_package",
  "Arguments": {
    "apk_path": "d:/mobile/sample.apk"
  }
}

// Step 2: Search for authentication classes
{
  "ServerName": "rea",
  "ToolName": "search_android_classes",
  "Arguments": {
    "apk_path": "d:/mobile/sample.apk",
    "pattern": ".*AuthManager.*"
  }
}

// Step 3: Decompile a specific method
{
  "ServerName": "rea",
  "ToolName": "inspect_android_method",
  "Arguments": {
    "apk_path": "d:/mobile/sample.apk",
    "class_name": "com.example.app.auth.AuthManager",
    "method_name": "verifyToken"
  }
}
```

---

### Technique 10: Dynamic LLDB Function Call Tracing on macOS

For macOS Mach-O binaries, REA can dynamically verify which functions are actually invoked during execution by attaching LLDB breakpoints:

```json
{
  "ServerName": "rea",
  "ToolName": "observe_native_calls",
  "Arguments": {
    "target_path": "/Applications/ExampleApp.app/Contents/MacOS/ExampleApp",
    "breakpoints": [
      "-[AuthClient authenticateUser:withPassword:]",
      "0x10004f210"
    ],
    "duration_ms": 5000,
    "max_events": 100
  }
}
```

> **Warning:** This launches the real target binary. Only run on authorized targets in a test environment.

---

### Technique 11: Ghidra Session Mutation & Function Annotation

As you discover the purpose of unnamed functions (e.g. `FUN_140023a10`), annotate them directly in the active Ghidra session:

```json
{
  "ServerName": "rea",
  "ToolName": "annotate_native_function",
  "Arguments": {
    "address": "0x140023a10",
    "name": "Crypto_DecryptLicensePayload",
    "entry_comment": "AES-256-GCM license decryption routine. Key derived from machine GUID."
  }
}
```

Subsequent calls to `list_procedures`, `procedure_callers`, or `procedure_pseudo_code` will reflect the new name and comments throughout the session.

---

## 6. Advanced Techniques & Workflows

### Technique 12: Offline Linux ELF Core Crash Analysis

When investigating post-mortem crashes without a running target or disassembler, use `inspect_recorded_crash`:

```json
{
  "ServerName": "rea",
  "ToolName": "inspect_recorded_crash",
  "Arguments": {
    "core_path": "/var/crash/core.target_app.16942",
    "include_debugger_context": true
  }
}
```

**Recovered Evidence:**
* Thread register states (`RIP`, `RSP`, `RAX`, general registers at fault).
* Faulting signal (`SIGSEGV`, `SIGABRT`) and memory address.
* Mapped memory segments and source-bound file ranges.
* Stack frames reconstructed via owned GDB/pwndbg session.

---

### Technique 13: EVM Smart Contract Bytecode Deobfuscation

REA inspects raw EVM bytecode offline without connecting to a blockchain node:

```json
{
  "ServerName": "rea",
  "ToolName": "inspect_evm_interface",
  "Arguments": {
    "bytecode": "608060405234801561001057600080fd5b50600436106100365760003560e01c8063a9059cbb14...",
    "encoding": "hex"
  }
}
```

**Recovered Interface:**
* Inferred function selectors (e.g., `0xa9059cbb` -> `transfer(address,uint256)`).
* Mutability candidates (`pure`, `view`, `payable`, `nonpayable`).
* Extracted ABI signature candidates.

---

### Technique 14: Version Diffing & Export Object Shape Tracking

To determine how an API or library changed between two releases:

```json
// Step 1: Compare overall application versions
{
  "ServerName": "rea",
  "ToolName": "compare_application_versions",
  "Arguments": {
    "left_evidence_id": "ev_version_1_0_0...",
    "right_evidence_id": "ev_version_1_1_0..."
  }
}

// Step 2: Compare exact returned object shape for a specific export
{
  "ServerName": "rea",
  "ToolName": "compare_javascript_export_shapes",
  "Arguments": {
    "left_evidence_id": "ev_version_1_0_0...",
    "right_evidence_id": "ev_version_1_1_0...",
    "module_path": "lib/session-manager.js",
    "export_name": "createSession"
  }
}
```

**Results:**
Reports exact JSON Pointer paths added, deleted, or modified (e.g., `+ /tokenExpiry`, `- /legacyAuth`).

---

### Technique 15: Static & Runtime AST Reconciliation (CDP)

Passive runtime inspection connects to an already-open Electron or Chromium process via DevTools Protocol (`CDP`):

```json
// Step 1: List accessible browser pages or Electron windows
{
  "ServerName": "rea",
  "ToolName": "list_electron_targets",
  "Arguments": {
    "port": 9222
  }
}

// Step 2: Reconcile live memory scripts against static AST analysis
{
  "ServerName": "rea",
  "ToolName": "reconcile_javascript_runtime",
  "Arguments": {
    "static_evidence_id": "ev_static_app_asar...",
    "target_id": "CDP_TARGET_WINDOW_1"
  }
}
```

This verifies whether minified chunks observed at runtime match files in the static package.

---

### Technique 16: Live Mobile Instrumentation via ADB Subsystem

For physical Android devices or emulators, REA exposes an extensive ADB command layer:

```json
// Step 1: Enumerate devices
{
  "ServerName": "rea",
  "ToolName": "list_adb_devices",
  "Arguments": {}
}

// Step 2: Inspect installed target package
{
  "ServerName": "rea",
  "ToolName": "inspect_adb_package",
  "Arguments": {
    "device_serial": "emulator-5554",
    "package_name": "com.target.application"
  }
}

// Step 3: Stream target logcat events
{
  "ServerName": "rea",
  "ToolName": "read_adb_logcat",
  "Arguments": {
    "device_serial": "emulator-5554",
    "filter_tags": ["TargetAppAuth", "SecurityManager"],
    "max_lines": 100
  }
}
```

---

### Technique 17: Scientific Verification & The Unknown Registry

In serious reverse engineering tasks, unverified assumptions lead to broken reconstructions. REA incorporates an explicit **Unknowns Registry**:

```json
// Step 1: Record an open hypothesis / unknown
{
  "ServerName": "rea",
  "ToolName": "record_unknown",
  "Arguments": {
    "question": "Does procedure 0x140023a10 encrypt the token using hardware TPM or software DPAPI?",
    "supporting_evidence_ids": ["ev_call_to_CryptProtectData..."],
    "contradicting_evidence_ids": []
  }
}

// Step 2: Later, resolve the unknown once conclusive proof is found
{
  "ServerName": "rea",
  "ToolName": "update_unknown",
  "Arguments": {
    "unknown_id": "unk_018f23...",
    "status": "resolved",
    "resolution_evidence_id": "ev_decompile_with_dpapi_flags..."
  }
}

// Step 3: Formally verify the reconstruction specification
{
  "ServerName": "rea",
  "ToolName": "verify_reconstruction",
  "Arguments": {
    "specification_path": "d:/specs/license_reconstruction.json"
  }
}
```

---

### Technique 18: Managing Large MCP Transport Frames (`resource_constraint`)

When analyzing massive targets (e.g. 50MB binaries or 20,000-module ASAR packages), the MCP JSON frame may exceed buffer limits, returning:
```json
{
  "error": "resource_constraint",
  "details": {
    "resource": "transport",
    "reported_limits": {
      "evidence_reference": "ev_7a8b9c..."
    }
  }
}
```

**Recovery Strategy:**
1. **Never repeat the identical call.** The data is already retained in the server session.
2. Grab the `evidence_reference` from `details.reported_limits`.
3. Use `inspect_analysis_view` with pagination (`offset`, `limit`) or request a single `facet` (e.g. `kind: "summary"`).
4. If full offline analysis is needed, dump the entire session to disk via `export_evidence_bundle`:
```json
{
  "ServerName": "rea",
  "ToolName": "export_evidence_bundle",
  "Arguments": {
    "output_path": "d:/analysis/complete_session.json"
  }
}
```

---

## 7. Troubleshooting & Connection Recovery Matrix

| Observed Issue | Root Cause | Solution |
| :--- | :--- | :--- |
| **No REA tools appear in client** | Skill is installed in config, but MCP server is not registered in `mcp.json`. | Run `rea doctor --client antigravity --json`. If missing, run `rea setup --client antigravity --yes`. |
| **`provider_unavailable` on `open_binary`** | Headless Ghidra or IDA Pro is not found on system PATH or configured. | Verify `GHIDRA_INSTALL_DIR` environment variable, or check `binary_session.result.tool_availability`. |
| **`MCP tool call requires approval`** | Client approval policy rejected the tool execution before reaching REA. | Configure tool preapproval in client settings (e.g. `approval_mode = "approve"` for `open_binary`). |
| **Android tools fail (`JAVA_HOME` error)** | Java 17+ JDK or headless JADX MCP JAR is missing. | Install JDK 17+, set `JAVA_HOME`, and specify `REA_JADX_MCP_JAR=/path/to/jadx-mcp.jar`. |
| **`resource_constraint: transport`** | Tool response exceeded MCP frame transport limits. | Use `inspect_analysis_view` with pagination on the returned `parent_evidence_id`, or `export_evidence_bundle`. |
| **Mach-O `observe_native_calls` fails** | Target binary has macOS hardened runtime enabled. | Requires `get-task-allow` entitlement or must be run on an ad-hoc resigned test build. |
| **Session data disappeared** | `close_binary` was called or client reconnected. | In-memory evidence is cleared on close; persist results before closing using `export_evidence_bundle`. |

---

## 8. Summary & Best Practices

1. **Always Route the Target First:** Match your target file type to the specialized tool (ASAR -> `analyze_javascript_application`, PE Resources -> `inspect_pe_resources`, APK -> `inspect_android_package`, ELF Core -> `inspect_recorded_crash`, Native Executable -> `open_binary`).
2. **Work Summary-First:** Begin with overviews (`binary_overview`, `detail: "summary"`, `list_procedures`). Do not decompile entire binaries in bulk.
3. **Preserve the Evidence Chain:** Always retain and cite `evidence_id` tokens. Never claim dynamic execution occurred when only static pseudocode was reviewed.
4. **Clean Up Sessions:** When your native investigation concludes, call `close_binary` to release engine memory and file locks.

