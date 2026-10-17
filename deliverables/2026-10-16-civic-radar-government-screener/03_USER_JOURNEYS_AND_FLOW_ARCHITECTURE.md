# Civic Radar — User Journeys & Flow Architecture

> **Document Metadata**  
> **System**: Civic Radar User Journey Catalog  
> **Methodology**: Mobbin-Style Horizontal Flow Mapping · Labeled Interaction Triggers · State Mutation Traces  
> **Coverage**: 10 Core User Journeys (J1–J10) + 1 Utilities & System States Row (56 Total Screens)  

---

## 1. Journey Architecture Overview

Civic Radar structures user flows as horizontal kinetic paths. Each step corresponds to a verified high-fidelity screen frame, linked by an explicit interactive trigger (such as a tap target, keyboard shortcut `⌘K`, pull-down gesture, or incoming push notification).

## J1 — First Launch
*New user sets up their station*

### Flow Graph
```
[ONB-ONB-01: Station Boot & Welcome]
   │
   ├─── [Tap 'Calibrate Feeds'] ───>
   │
   ▼
[ONB-ONB-02: Pick Your Feeds]
   │
   ├─── [Select 6+ Feeds -> Continue] ───>
   │
   ▼
[ONB-ONB-03: Home District Setup]
   │
   ├─── [Enter Home Address -> Confirm] ───>
   │
   ▼
[ONB-ONB-04: Alert Preferences]
   │
   ├─── [Set Quiet Hours -> Enter Command Deck] ───>
   │
   ▼
[PUL-DSH-01: Pulse — Command Deck]
```

### Step-by-Step Transition Matrix

| Step | Screen ID | Screen Name | User Action / Trigger | Visual Focal Point | State Mutation / Data Flow | Return Route |
|---|---|---|---|---|---|---|
| 1 | `ONB-ONB-01` | **Station Boot & Welcome** | `Launch App / Power-on` | Onboarding · Configure | Station ID: STN-US-0104 | Back to `System Launch` |
| 2 | `ONB-ONB-02` | **Pick Your Feeds** | `Tap 'Calibrate Feeds'` | Onboarding · Configure | 12 tiles toggled active (Congress, White House, Supreme Court, Treasury, Broadband, Clean Energy). | Back to `ONB-ONB-01` |
| 3 | `ONB-ONB-03` | **Home District Setup** | `Select 6+ Feeds -> Continue` | Onboarding · Search | Address: 48201 Detroit MI -> Snapped to MI-13 (Rep. Brenda Chen [D]) + Sen. Elena Vance [D-MI], Sen. Gary Peters [D-MI]. | Back to `ONB-ONB-02` |
| 4 | `ONB-ONB-04` | **Alert Preferences** | `Enter Home Address -> Confirm` | Onboarding · Configure | Threshold: Attention & Critical only; Quiet hours: 23:00 - 06:30 ET; Emergency override: ON. | Back to `ONB-ONB-03` |
| 5 | `PUL-DSH-01` | **Pulse — Command Deck** | `Set Quiet Hours -> Enter Command Deck` | Dashboard · Monitor | Debt: $36,812,491,208,440 (+$98,410/s EST) | Back to `ONB-ONB-04` |

---

## J2 — Morning Briefing
*60-second read on the phone*

### Flow Graph
```
[PUL-DSH-02: Pulse — Mobile Companion]
   │
   ├─── [Tap Debt Card] ───>
   │
   ▼
[FSC-VIZ-01: National Debt Odometer]
   │
   ├─── [Tap 'Balance Sheet Detail'] ───>
   │
   ▼
[FSC-DTL-01: Fiscal Breakdown Detail]
   │
   ├─── [Back -> Tap Shutdown Card] ───>
   │
   ▼
[SHD-VIZ-01: Shutdown Clock — Funded State]
   │
   ├─── [Tap '12 Subcommittees Board'] ───>
   │
   ▼
[SHD-LST-01: Appropriations Board (12 Subcommittees)]
   │
   ├─── [Tap 'SRC · TREASURY' Chip] ───>
   │
   ▼
[SHL-SHT-01: Provenance Inspector]
```

### Step-by-Step Transition Matrix

| Step | Screen ID | Screen Name | User Action / Trigger | Visual Focal Point | State Mutation / Data Flow | Return Route |
|---|---|---|---|---|---|---|
| 1 | `PUL-DSH-02` | **Pulse — Mobile Companion** | `Open Mobile App` | Dashboard · Monitor | Vertical card stack: [1] National Debt Odometer ($36.8T EST) [2] Shutdown Clock (T-23d) [3] Floor Activity [4] Shockwave Seismograph. | Back to `System Launch` |
| 2 | `FSC-VIZ-01` | **National Debt Odometer** | `Tap Debt Card` | Live Visualization · Monitor | Current Debt: $36,812,491,208,440.18 | Back to `PUL-DSH-02` |
| 3 | `FSC-DTL-01` | **Fiscal Breakdown Detail** | `Tap 'Balance Sheet Detail'` | Detail · Drill down | Public Debt: $29.41T (79.9%) | Back to `FSC-VIZ-01` |
| 4 | `SHD-VIZ-01` | **Shutdown Clock — Funded State** | `Back -> Tap Shutdown Card` | Live Visualization · Monitor | FLAPS: [023] DAYS | Back to `FSC-DTL-01` |
| 5 | `SHD-LST-01` | **Appropriations Board (12 Subcommittees)** | `Tap '12 Subcommittees Board'` | List/Table · Track | 12 regular bills: Ag, Commerce/Justice/Science, Defense, Energy/Water, Financial Services, Homeland Security, Interior, Labor/HHS/Ed, Legislative Branch, MilCon/VA, State/Foreign Ops, Transportation/HUD. | Back to `SHD-VIZ-01` |
| 6 | `SHL-SHT-01` | **Provenance Inspector** | `Tap 'SRC · TREASURY' Chip` | Sheet/Modal · Drill down | Source: U.S. Treasury Bureau of the Fiscal Service API; Endpoint: /v2/accounting/od/debt_to_penny; Interpolation: Linear spline between 00:01 ET and 17:00 ET settlement prints. | Back to `SHD-LST-01` |

---

## J3 — Follow a Bill to the President's Desk
*Tracking H.R. 4821 through the legislative gauntlet*

### Flow Graph
```
[SHL-SRC-01: Command Palette]
   │
   ├─── [Select 'H.R. 4821'] ───>
   │
   ▼
[LEG-DTL-01: Bill Detail Dossier]
   │
   ├─── [Tap 'View in Pipeline'] ───>
   │
   ▼
[LEG-VIZ-01: Bill Pipeline (Subway Map & Sankey)]
   │
   ├─── [Tap 'Track Bill'] ───>
   │
   ▼
[LEG-SHT-01: Track Bill Bottom Sheet]
   │
   ├─── [Receive Push: 'Passed Senate'] ───>
   │
   ▼
[SHL-NTF-02: Push Notifications (Lock Screen)]
   │
   ├─── [Tap Notification -> Open Roll-Call] ───>
   │
   ▼
[LEG-VIZ-02: Live Roll-Call Vote Board]
   │
   ├─── [Tap Sponsor 'Rep. Thorne'] ───>
   │
   ▼
[PPL-DTL-01: Official Profile & Voting Record]
   │
   ├─── [Tap 'Track in Machine'] ───>
   │
   ▼
[MCH-DTL-01: Item Tracer (Full Path & Audit Trail)]
```

### Step-by-Step Transition Matrix

| Step | Screen ID | Screen Name | User Action / Trigger | Visual Focal Point | State Mutation / Data Flow | Return Route |
|---|---|---|---|---|---|---|
| 1 | `SHL-SRC-01` | **Command Palette** | `Press ⌘K -> Type '4821'` | Search · Search | H.R. 4821 query active, 5 grouped hits, ESC to close, ↵ to jump. | Back to `System Launch` |
| 2 | `LEG-DTL-01` | **Bill Detail Dossier** | `Select 'H.R. 4821'` | Detail · Drill down | H.R. 4821 — Rural Broadband Resilience Act | Back to `SHL-SRC-01` |
| 3 | `LEG-VIZ-01` | **Bill Pipeline (Subway Map & Sankey)** | `Tap 'View in Pipeline'` | Live Visualization · Track | Active Pipeline: 9,412 Introduced -> 1,840 Committee Reported -> 412 Passed One Chamber -> 89 Enacted into Public Law | Back to `LEG-DTL-01` |
| 4 | `LEG-SHT-01` | **Track Bill Bottom Sheet** | `Tap 'Track Bill'` | Sheet/Modal · Alert | Tracking H.R. 4821: Alert on Senate Passage [X], President Signature [X], CBO Estimate revisions [X] | Back to `LEG-VIZ-01` |
| 5 | `SHL-NTF-02` | **Push Notifications (Lock Screen)** | `Receive Push: 'Passed Senate'` | Notification · Alert | 5 lock-screen notification cards with timestamp, severity accent, action buttons, and direct app deep links. | Back to `LEG-SHT-01` |
| 6 | `LEG-VIZ-02` | **Live Roll-Call Vote Board** | `Tap Notification -> Open Roll-Call` | Live Visualization · Monitor | Roll Call #418 (H.R. 4821) | Back to `SHL-NTF-02` |
| 7 | `PPL-DTL-01` | **Official Profile & Voting Record** | `Tap Sponsor 'Rep. Thorne'` | Detail · Drill down | Sen. Elena Vance [D-MI] | Back to `LEG-VIZ-02` |
| 8 | `MCH-DTL-01` | **Item Tracer (Full Path & Audit Trail)** | `Tap 'Track in Machine'` | Detail · Track | Item: H.R. 4821 | Back to `PPL-DTL-01` |

---

## J4 — Breaking News Shockwave
*Geographic reaction spreading after a major story drops*

### Flow Graph
```
[SHL-NTF-02: Push Notifications (Lock Screen)]
   │
   ├─── [Tap Alert -> Shockwave Map] ───>
   │
   ▼
[MAP-MAP-02: News Shockwave Heat Map]
   │
   ├─── [Tap 'Open in Map Studio'] ───>
   │
   ▼
[MAP-MAP-01: Map Studio (Layer Architecture)]
   │
   ├─── [Open Layer Stack -> Add Sentiment] ───>
   │
   ▼
[MAP-SHT-01: Map Studio Layer Stack Drawer]
   │
   ├─── [Tap 'Swipe Compare (T-2h vs T+2h)'] ───>
   │
   ▼
[MAP-CMP-01: Swipe Compare (Dual-Layer Diff)]
   │
   ├─── [Tap MI-13 District Polygon] ───>
   │
   ▼
[MAP-DTL-01: Geography Drilldown Dossier]
   │
   ├─── [Tap 'View Issue Polling Detail'] ───>
   │
   ▼
[SNT-DTL-01: Issue Sentiment Multi-Methodology]
```

### Step-by-Step Transition Matrix

| Step | Screen ID | Screen Name | User Action / Trigger | Visual Focal Point | State Mutation / Data Flow | Return Route |
|---|---|---|---|---|---|---|
| 1 | `SHL-NTF-02` | **Push Notifications (Lock Screen)** | `Receive Breaking Alert Push` | Notification · Alert | 5 lock-screen notification cards with timestamp, severity accent, action buttons, and direct app deep links. | Back to `System Launch` |
| 2 | `MAP-MAP-02` | **News Shockwave Heat Map** | `Tap Alert -> Shockwave Map` | Map · Monitor | Story: 'Bipartisan Broadband Agreement Enacted' | Back to `SHL-NTF-02` |
| 3 | `MAP-MAP-01` | **Map Studio (Layer Architecture)** | `Tap 'Open in Map Studio'` | Map · Explore | Query: 'tariffs' -> Active layers: [1] Breaking News Shockwave [2] Public Sentiment Isobars [3] Congressional District Control. | Back to `MAP-MAP-02` |
| 4 | `MAP-SHT-01` | **Map Studio Layer Stack Drawer** | `Open Layer Stack -> Add Sentiment` | Sheet/Modal · Configure | 8 layers in stack: Event Shockwave (100% opacity), Sentiment Isobars (65% opacity), 2024 Base Margin (40% opacity), FEC Cash Flow (OFF). | Back to `MAP-MAP-01` |
| 5 | `MAP-CMP-01` | **Swipe Compare (Dual-Layer Diff)** | `Tap 'Swipe Compare (T-2h vs T+2h)'` | Comparison · Compare | Left: Pre-Story Sentiment (T-2h) | Back to `MAP-SHT-01` |
| 6 | `MAP-DTL-01` | **Geography Drilldown Dossier** | `Tap MI-13 District Polygon` | Detail · Drill down | Wayne County MI | Back to `MAP-CMP-01` |
| 7 | `SNT-DTL-01` | **Issue Sentiment Multi-Methodology** | `Tap 'View Issue Polling Detail'` | Detail · Drill down | Issue: Rural Broadband Investment | Back to `MAP-DTL-01` |

---

## J5 — Shutdown Watch
*Countdown to funding lapse and contingency tracking*

### Flow Graph
```
[SHD-VIZ-01: Shutdown Clock — Funded State]
   │
   ├─── [Tap '12 Subcommittee Matrix'] ───>
   │
   ▼
[SHD-LST-01: Appropriations Board (12 Subcommittees)]
   │
   ├─── [Toggle State: 'Simulate Funding Lapse'] ───>
   │
   ▼
[SHD-VIZ-02: Shutdown Clock — Lapse in Progress]
   │
   ├─── [Tap 'Agency Contingencies'] ───>
   │
   ▼
[SHD-DTL-01: Agency Impact & Contingency Detail]
   │
   ├─── [Tap 'Historical Lapse Timeline'] ───>
   │
   ▼
[SHD-TML-01: Shutdown History & Resolution Timeline]
   │
   ├─── [Tap 'Create Funding Alert Rule'] ───>
   │
   ▼
[SCR-BLD-02: Alert Rule Builder (IF/THEN)]
```

### Step-by-Step Transition Matrix

| Step | Screen ID | Screen Name | User Action / Trigger | Visual Focal Point | State Mutation / Data Flow | Return Route |
|---|---|---|---|---|---|---|
| 1 | `SHD-VIZ-01` | **Shutdown Clock — Funded State** | `Select Shutdown Clock from Rail` | Live Visualization · Monitor | FLAPS: [023] DAYS | Back to `System Launch` |
| 2 | `SHD-LST-01` | **Appropriations Board (12 Subcommittees)** | `Tap '12 Subcommittee Matrix'` | List/Table · Track | 12 regular bills: Ag, Commerce/Justice/Science, Defense, Energy/Water, Financial Services, Homeland Security, Interior, Labor/HHS/Ed, Legislative Branch, MilCon/VA, State/Foreign Ops, Transportation/HUD. | Back to `SHD-VIZ-01` |
| 3 | `SHD-VIZ-02` | **Shutdown Clock — Lapse in Progress** | `Toggle State: 'Simulate Funding Lapse'` | Live Visualization · Monitor | FLAPS (CRITICAL MAGENTA): +[004] DAYS | Back to `SHD-LST-01` |
| 4 | `SHD-DTL-01` | **Agency Impact & Contingency Detail** | `Tap 'Agency Contingencies'` | Detail · Drill down | Agency: Department of the Interior | Back to `SHD-VIZ-02` |
| 5 | `SHD-TML-01` | **Shutdown History & Resolution Timeline** | `Tap 'Historical Lapse Timeline'` | Timeline · Explore | 21 historical lapses: 2018-19 (35d, CR P.L. 116-5), 2018 Jan (3d), 2013 (16d, Continuing Appropriations Act), 1995-96 (21d). | Back to `SHD-DTL-01` |
| 6 | `SCR-BLD-02` | **Alert Rule Builder (IF/THEN)** | `Tap 'Create Funding Alert Rule'` | Builder/Filter · Configure | Rule: 'Notify me when appropriations funding passes' | Back to `SHD-TML-01` |

---

## J6 — Court Watcher
*Supreme Court term and federal docket tracking*

### Flow Graph
```
[CRT-DSH-01: Courts Dashboard & Circuit Map]
   │
   ├─── [Tap 'SCOTUS Docket Kanban'] ───>
   │
   ▼
[CRT-LST-01: SCOTUS Docket Kanban Board]
   │
   ├─── [Tap Case 'No. 25-1147 Halvorsen'] ───>
   │
   ▼
[CRT-DTL-01: Case Detail Dossier & Audio Waveform]
   │
   ├─── [Tap 'Opinion Day Live Terminal'] ───>
   │
   ▼
[CRT-VIZ-01: Opinion Day Live Feed]
   │
   ├─── [Search PACER Federal Dockets] ───>
   │
   ▼
[CRT-LST-02: Federal Docket Search (PACER Explorer)]
```

### Step-by-Step Transition Matrix

| Step | Screen ID | Screen Name | User Action / Trigger | Visual Focal Point | State Mutation / Data Flow | Return Route |
|---|---|---|---|---|---|---|
| 1 | `CRT-DSH-01` | **Courts Dashboard & Circuit Map** | `Select Courts from Module Rail` | Dashboard · Monitor | SCOTUS Term: 58 granted, 14 argued, 2 opinions released | Back to `System Launch` |
| 2 | `CRT-LST-01` | **SCOTUS Docket Kanban Board** | `Tap 'SCOTUS Docket Kanban'` | List/Table · Track | 6 Kanban columns: No. 25-1147 Halvorsen v. DOL in 'Awaiting Opinion' lane (argued Oct 14); No. 25-892 Apex Energy in 'Granted' lane. | Back to `CRT-DSH-01` |
| 3 | `CRT-DTL-01` | **Case Detail Dossier & Audio Waveform** | `Tap Case 'No. 25-1147 Halvorsen'` | Detail · Drill down | No. 25-1147, Halvorsen v. Department of Labor | Back to `CRT-LST-01` |
| 4 | `CRT-VIZ-01` | **Opinion Day Live Feed** | `Tap 'Opinion Day Live Terminal'` | Live Visualization · Monitor | Slot 1 (10:00 ET): No. 25-812 Released | Back to `CRT-DTL-01` |
| 5 | `CRT-LST-02` | **Federal Docket Search (PACER Explorer)** | `Search PACER Federal Dockets` | List/Table · Search | Query: 'Broadband Infrastructure' | Back to `CRT-VIZ-01` |

---

## J7 — Election Night
*Real-time results, big board, and path to majority*

### Flow Graph
```
[ELX-DSH-01: Race Center & Balance of Power]
   │
   ├─── [Tap 'Launch Wall Big Board'] ───>
   │
   ▼
[ELX-MAP-01: Election Night Big Board (Wall & Touch)]
   │
   ├─── [Touch Drill: National -> MI -> Wayne County] ───>
   │
   ▼
[MAP-DTL-01: Geography Drilldown Dossier]
   │
   ├─── [Tap 'MI Senate Race Detail'] ───>
   │
   ▼
[ELX-DTL-01: Key Race Detail & Vote Tabulation]
   │
   ├─── [Tap 'Simulate Path to Majority'] ───>
   │
   ▼
[ELX-BLD-01: Path to Majority Simulator]
   │
   ├─── [Switch Display to Wall Mode 1080p] ───>
   │
   ▼
[PUL-DSH-03: Pulse — Wall Mode]
```

### Step-by-Step Transition Matrix

| Step | Screen ID | Screen Name | User Action / Trigger | Visual Focal Point | State Mutation / Data Flow | Return Route |
|---|---|---|---|---|---|---|
| 1 | `ELX-DSH-01` | **Race Center & Balance of Power** | `Select Race Center from Rail` | Dashboard · Monitor | Senate: 49 Dem / 49 Rep / 2 Tossup | Back to `System Launch` |
| 2 | `ELX-MAP-01` | **Election Night Big Board (Wall & Touch)** | `Tap 'Launch Wall Big Board'` | Map · Monitor | National Big Board: MI Called (D+2.4%), PA Leading R (+12,410 votes, 84% in), WI Too Close to Call | Back to `ELX-DSH-01` |
| 3 | `MAP-DTL-01` | **Geography Drilldown Dossier** | `Touch Drill: National -> MI -> Wayne County` | Detail · Drill down | Wayne County MI | Back to `ELX-MAP-01` |
| 4 | `ELX-DTL-01` | **Key Race Detail & Vote Tabulation** | `Tap 'MI Senate Race Detail'` | Detail · Drill down | MI Senate 2026: Elena Vance [D] 2,412,890 (50.8%) vs Tyler Brooks [R] 2,334,102 (49.2%) | Back to `MAP-DTL-01` |
| 5 | `ELX-BLD-01` | **Path to Majority Simulator** | `Tap 'Simulate Path to Majority'` | Builder/Filter · Explore | Senate Simulator: Baseline 49 D / 49 R | Back to `ELX-DTL-01` |
| 6 | `PUL-DSH-03` | **Pulse — Wall Mode** | `Switch Display to Wall Mode 1080p` | Dashboard · Monitor | Hero display cycling every 30s: 96px mechanical debt odometer with real-time rate ticker, election balance-of-power arc, and live floor roll-call. | Back to `ELX-BLD-01` |

---

## J8 — Power Screener
*Finviz-style parametric screening and rule building*

### Flow Graph
```
[SCR-BLD-01: Finviz-Style Screener Builder]
   │
   ├─── [Apply Preset: 'Bipartisan Bills Moving Fast'] ───>
   │
   ▼
[SCR-LST-01: Screener Results Table]
   │
   ├─── [Select 2 Officials -> Tap 'Compare'] ───>
   │
   ▼
[PPL-CMP-01: Compare Officials (Vote Agreement Matrix)]
   │
   ├─── [Tap 'Set Alert for these criteria'] ───>
   │
   ▼
[SCR-BLD-02: Alert Rule Builder (IF/THEN)]
   │
   ├─── [Save Screen to Watchlist] ───>
   │
   ▼
[SCR-LST-02: Saved Screens & Watchlists]
```

### Step-by-Step Transition Matrix

| Step | Screen ID | Screen Name | User Action / Trigger | Visual Focal Point | State Mutation / Data Flow | Return Route |
|---|---|---|---|---|---|---|
| 1 | `SCR-BLD-01` | **Finviz-Style Screener Builder** | `Select Screener from Module Rail` | Builder/Filter · Configure | Entity: Bills | Back to `System Launch` |
| 2 | `SCR-LST-01` | **Screener Results Table** | `Apply Preset: 'Bipartisan Bills Moving Fast'` | List/Table · Track | 18 bills matched query: H.R. 4821 (#1 rank, 48 cosponsors, BPI 0.88), S. 2104 (#2 rank), H.R. 3110 (#3 rank) | Back to `SCR-BLD-01` |
| 3 | `PPL-CMP-01` | **Compare Officials (Vote Agreement Matrix)** | `Select 2 Officials -> Tap 'Compare'` | Comparison · Compare | Sen. Elena Vance [D-MI] vs Sen. Robert Sterling [R-OH]: 64% Overall Agreement, 88% Agreement on Infrastructure, Diverged on Tax Reconciliation. | Back to `SCR-LST-01` |
| 4 | `SCR-BLD-02` | **Alert Rule Builder (IF/THEN)** | `Tap 'Set Alert for these criteria'` | Builder/Filter · Configure | Rule: 'Notify me when appropriations funding passes' | Back to `PPL-CMP-01` |
| 5 | `SCR-LST-02` | **Saved Screens & Watchlists** | `Save Screen to Watchlist` | List/Table · Track | 4 Saved Screens: 'Bipartisan Fast-Track' (+3 new items), 'Approps Watch' (+1 item), 'Key 2026 Senate Races' (no changes), 'SCOTUS IP Cases'. | Back to `SCR-BLD-02` |

---

## J9 — Watch the Machine
*Three branches assembly line and executive actions*

### Flow Graph
```
[MCH-VIZ-01: The Machine (Three Branches Assembly Line)]
   │
   ├─── [Click Executive Desk Station] ───>
   │
   ▼
[MCH-VIZ-02: Branch Zoom — Executive Desk & Rulemaking]
   │
   ├─── [Tap 'View Executive Actions Feed'] ───>
   │
   ▼
[EXE-LST-01: Executive Actions Feed]
   │
   ├─── [Select 'E.O. 14389 Permitting'] ───>
   │
   ▼
[EXE-DTL-01: Executive Order Detail & Legal Tracker]
   │
   ├─── [Tap 'View Rulemaking Pipeline'] ───>
   │
   ▼
[EXE-VIZ-01: Federal Rulemaking Pipeline]
   │
   ├─── [Tap 'Trace Token Journey'] ───>
   │
   ▼
[MCH-DTL-01: Item Tracer (Full Path & Audit Trail)]
```

### Step-by-Step Transition Matrix

| Step | Screen ID | Screen Name | User Action / Trigger | Visual Focal Point | State Mutation / Data Flow | Return Route |
|---|---|---|---|---|---|---|
| 1 | `MCH-VIZ-01` | **The Machine (Three Branches Assembly Line)** | `Select The Machine from Rail` | Live Visualization · Monitor | Active tokens: 184 bills on belts, 4 EOs emitted today, 12 rules in comment, 8 cases argued | Back to `System Launch` |
| 2 | `MCH-VIZ-02` | **Branch Zoom — Executive Desk & Rulemaking** | `Click Executive Desk Station` | Live Visualization · Drill down | Executive Desk: H.R. 4821 arrived T+2d 14h ago (7d 10h remaining on signing clock) | Back to `MCH-VIZ-01` |
| 3 | `EXE-LST-01` | **Executive Actions Feed** | `Tap 'View Executive Actions Feed'` | List/Table · Track | E.O. 14389 (Critical Grid Permitting, 91 FR 19842) | Back to `MCH-VIZ-02` |
| 4 | `EXE-DTL-01` | **Executive Order Detail & Legal Tracker** | `Select 'E.O. 14389 Permitting'` | Detail · Drill down | E.O. 14389 | Back to `EXE-LST-01` |
| 5 | `EXE-VIZ-01` | **Federal Rulemaking Pipeline** | `Tap 'View Rulemaking Pipeline'` | Live Visualization · Track | EPA Ozone Standard (NPRM 2026-0812) | Back to `EXE-DTL-01` |
| 6 | `MCH-DTL-01` | **Item Tracer (Full Path & Audit Trail)** | `Tap 'Trace Token Journey'` | Detail · Track | Item: H.R. 4821 | Back to `EXE-VIZ-01` |

---

## J10 — Know Your Government
*Connecting citizens to reps, votes, policy, and public sentiment*

### Flow Graph
```
[PPL-SRC-01: Find My Officials (Address Lookup)]
   │
   ├─── [Select Rep Profile 'Elena Vance'] ───>
   │
   ▼
[PPL-DTL-01: Official Profile & Voting Record]
   │
   ├─── [Tap 'Latest Floor Vote (H.R. 4821)'] ───>
   │
   ▼
[LEG-VIZ-02: Live Roll-Call Vote Board]
   │
   ├─── [Tap 'Explore Policy: Broadband & Tech'] ───>
   │
   ▼
[LEG-DSH-01: Legislation by Topic & Sentiment]
   │
   ├─── [Tap 'View National Sentiment Weather'] ───>
   │
   ▼
[SNT-DSH-01: Sentiment Weather Station]
```

### Step-by-Step Transition Matrix

| Step | Screen ID | Screen Name | User Action / Trigger | Visual Focal Point | State Mutation / Data Flow | Return Route |
|---|---|---|---|---|---|---|
| 1 | `PPL-SRC-01` | **Find My Officials (Address Lookup)** | `Select People from Module Rail` | Search · Search | Address: '48226 Detroit MI' -> Rep. Brenda Chen [D-MI-13], Sen. Elena Vance [D-MI], Sen. Gary Peters [D-MI], Gov. Gretchen Whitmer [D]. | Back to `System Launch` |
| 2 | `PPL-DTL-01` | **Official Profile & Voting Record** | `Select Rep Profile 'Elena Vance'` | Detail · Drill down | Sen. Elena Vance [D-MI] | Back to `PPL-SRC-01` |
| 3 | `LEG-VIZ-02` | **Live Roll-Call Vote Board** | `Tap 'Latest Floor Vote (H.R. 4821)'` | Live Visualization · Monitor | Roll Call #418 (H.R. 4821) | Back to `PPL-DTL-01` |
| 4 | `LEG-DSH-01` | **Legislation by Topic & Sentiment** | `Tap 'Explore Policy: Broadband & Tech'` | Dashboard · Explore | 8 domain cards: Technology & Telecom (84 bills, 68% pos sentiment), Clean Energy (112 bills, 59% pos sentiment), Health (142 bills, 51% sentiment). | Back to `LEG-VIZ-02` |
| 5 | `SNT-DSH-01` | **Sentiment Weather Station** | `Tap 'View National Sentiment Weather'` | Dashboard · Monitor | Economy: 1012 hPa (High Pressure / Optimistic) | Back to `LEG-DSH-01` |

---

## Utilities & States
*System drawers, diagnostics, settings, archives, and tables*

### Flow Graph
```
[SHL-NTF-01: Alert Center Drawer]
   │
   ├─── [Trigger Feed Outage Diagnostic] ───>
   │
   ▼
[SHL-STA-01: System States & Diagnostics]
   │
   ├─── [Click Gear Icon (Settings)] ───>
   │
   ▼
[ONB-SET-01: Settings & Data Transparency]
   │
   ├─── [Open Historical Debt Timeline] ───>
   │
   ▼
[FSC-TML-01: Debt History & Limits Timeline]
   │
   ├─── [Open Monitored Bills Table] ───>
   │
   ▼
[LEG-LST-01: Bill Tracker Table]
```

### Step-by-Step Transition Matrix

| Step | Screen ID | Screen Name | User Action / Trigger | Visual Focal Point | State Mutation / Data Flow | Return Route |
|---|---|---|---|---|---|---|
| 1 | `SHL-NTF-01` | **Alert Center Drawer** | `Click Alert Bell Icon` | Notification · Alert | 14 unread alerts: appropriations CR deadline T-24h, H.R. 4821 enrolled, SCOTUS opinion release in 35m. | Back to `System Launch` |
| 2 | `SHL-STA-01` | **System States & Diagnostics** | `Trigger Feed Outage Diagnostic` | System State · Monitor | Six diagnostic tiles showing simulated failure and degraded modes across legislative, fiscal, and court feeds. | Back to `SHL-NTF-01` |
| 3 | `ONB-SET-01` | **Settings & Data Transparency** | `Click Gear Icon (Settings)` | Settings · Configure | Night Ops active, Reduced Motion OFF, 18 federal APIs verified with latency and SSL fingerprint checks. | Back to `SHL-STA-01` |
| 4 | `FSC-TML-01` | **Debt History & Limits Timeline** | `Open Historical Debt Timeline` | Timeline · Explore | 1990-2026 debt curve: 1995 standoff, 2011 Budget Control Act, 2020 CARES Act, 2023 Fiscal Responsibility Act, 2025 extension. | Back to `ONB-SET-01` |
| 5 | `LEG-LST-01` | **Bill Tracker Table** | `Open Monitored Bills Table` | List/Table · Track | 25 tracked bills: H.R. 4821 (Enrolled, 48 cosponsors, BPI 0.88), S. 2104 (Senate Floor, 34 cosponsors, BPI 0.72), H.R. 1902 (Reported, 19 cosponsors). | Back to `FSC-TML-01` |

---
