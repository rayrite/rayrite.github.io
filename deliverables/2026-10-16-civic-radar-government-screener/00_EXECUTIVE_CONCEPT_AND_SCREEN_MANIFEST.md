# Civic Radar — Executive Concept & Screen Manifest

> **Document Metadata**  
> **Project**: Civic Radar (Government Screener Module)  
> **Design Language**: Capitol Weather Station (Dense Instrumentation / Dark "Night Ops" Default)  
> **Date**: 2026-10-16  
> **Status**: High-Fidelity UI Specification & Screen Manifest (Production Baseline)  
> **Deliverable Scope**: 56 High-Fidelity Screens · 14 Functional Modules · 10 User Journeys · 14 Mobbin Screen Types  

---

## 1. Executive Concept & Product Philosophy

### 1.1 The Democracy Weather Station
Civic Radar transforms the opaque, fragmented operations of the United States federal government into a real-time, instrument-grade intelligence engine. Designed with the high-density informational rigor of a Bloomberg Terminal, the atmospheric legibility of a NOAA Doppler radar, the operational discipline of a NASA mission-control console, and the tactile nostalgia of an airport split-flap board, Civic Radar rejects partisan sensationalism and cable-news aesthetic clichés.

Democracy is treated not as a soap opera, but as a complex, continuous mechanical apparatus: bills flow through legislative hoppers, appropriations deadlines tick down like pressure vessels, judicial dockets move through procedural gates, executive orders emit regulatory mandates, and public sentiment travels across geographic terrain like atmospheric isobars.

### 1.2 Core Product Promises
1. **Honest Data & Calibration**: Every number is live or honestly labeled. Interpolated figures carry prominent `EST` badges and link directly to mathematical formulas and federal sources. Stale or interrupted feeds dim gracefully with clear diagnostic flags.
2. **Seamless Macro-to-Micro Drilldown**: Users navigate effortlessly from a 30,000-foot national fiscal overview to a specific congressional district, county vote precinct, legislative amendment, or federal court slip opinion in three taps or clicks.
3. **Nonpartisan Neutrality**: Presentation is rigorously objective. System-status colors (such as critical alerts) never reuse political party hues. Sentiment metrics explicitly separate scientific probability polls, prediction market odds, and social sentiment velocity.
4. **Pixel-Credible Fidelity**: Every screen is specified with exact 8px grid alignments, tabular JetBrains Mono typography, corner registration marks, and calibrated data vocabularies.

---

## 2. Signature Hero Features

| Hero Feature | Screen ID | Visual Form Factor | Key Operational Dynamics |
|---|---|---|---|
| **National Debt Odometer** | `FSC-VIZ-01` | Mechanical rolling digit counter | Real-time spline interpolation (+~$98k/sec); per-citizen ($108,412) & per-household readouts; Treasury provenance chip. |
| **Shutdown Countdown Clock** | `SHD-VIZ-01` / `02` | Split-flap mechanical flap display | Dual-state: Funded countdown to midnight deadline vs Lapse in progress elapsed timer with agency impact tallies. |
| **The Machine** | `MCH-VIZ-01` | 2.5D isometric factory assembly | Three branches depicted as a connected kinetic plant: Legislative presses, Executive signing desk, Judicial cert review. |
| **Bill Pipeline** | `LEG-VIZ-01` | Subway-map transit flow & Sankey | Subway-line procedural progression with cosponsor token sizing, policy tinting, and full attrition Sankey diagram. |
| **Map Studio & Shockwave** | `MAP-MAP-01` / `02` | Multi-layer GIS & Heat Isobars | 8-layer stack, keyword query generator, News Shockwave radiating from epicenters, time scrubber (1x-60x), swipe diff. |
| **SCOTUS Docket Kanban** | `CRT-LST-01` | 6-stage procedural Kanban board | Petitions -> Conference -> Granted -> Argued -> Awaiting Opinion -> Decided; emergency shadow docket lane. |
| **Live Roll-Call Vote Board** | `LEG-VIZ-02` | 435-seat chamber arc display | Dynamic seat filling, party discipline tally, voting clock, geographic roll-call choropleth, 3-frame storyboard. |
| **Finviz-Style Screener** | `SCR-BLD-01` | Parametric filter & multi-slider | Multi-entity query engine (bills, officials, cases, races), presets, sparkline results, and IF/THEN rule composer. |

---

## 3. Mobbin-Style Architecture & Navigation

Civic Radar adopts the professional screen-pattern catalog structure popularized by Mobbin.com, enabling founders, product managers, and engineers to explore the system through three complementary lenses:

```
CIVIC RADAR NAVIGATION GRAPH
│
├── 1. BY USER JOURNEY (End-to-End Workflow Rows)
│   ├── J1: First Launch (Station Boot → Feeds → District → Alerts → Pulse Command Deck)
│   ├── J2: Morning Briefing (Mobile Pulse → Debt Odometer → Fiscal Detail → Shutdown → Provenance)
│   ├── J3: Follow a Bill (Command Palette → Bill Dossier → Pipeline → Roll-Call → Item Tracer)
│   ├── J4: News Shockwave (Push Alert → Heat Map → Studio → Layer Stack → Swipe Compare → Detail)
│   ├── J5: Shutdown Watch (Funded Clock → Approps Board → Lapse State → Agency Contingency → Alert)
│   ├── J6: Court Watcher (Courts Deck → SCOTUS Kanban → Case Detail → Opinion Day → Federal Dockets)
│   ├── J7: Election Night (Race Center → Big Board → County Drill → Race Detail → Simulator → Wall)
│   ├── J8: Power Screener (Screener Builder → Results Table → Compare Officials → Rules → Watchlists)
│   ├── J9: Watch the Machine (The Machine → Branch Zoom → Exec Actions → Rulemaking → Item Tracer)
│   ├── J10: Know Your Government (Find Officials → Profile → Roll-Call Vote → Topic → Sentiment)
│   └── UTL: Utilities & System States (Alert Center, Diagnostics Matrix, Settings, Historical Archives)
│
├── 2. BY MODULE (Functional Taxonomy)
│   ├── SHL (Shell & Global · 5 screens)       LEG (Legislation · 6 screens)
│   ├── ONB (Onboarding & Account · 5 screens) CRT (Courts · 5 screens)
│   ├── PUL (Pulse · 3 screens)                EXE (Executive Actions · 3 screens)
│   ├── FSC (Fiscal · 3 screens)               MAP (Maps & Overlays · 5 screens)
│   ├── SHD (Shutdown · 5 screens)             SNT (Sentiment · 2 screens)
│   ├── MCH (The Machine · 3 screens)          ELX (Elections · 4 screens)
│   ├── PPL (People · 3 screens)               SCR (Screener & Alerts · 4 screens)
│
└── 3. BY SCREEN PATTERN TYPE (Mobbin Design Vocabulary)
    ├── DSH (Dashboards · 7)                   BLD (Builders & Simulators · 3)
    ├── VIZ (Live Visualizations · 9)          SRC (Search & Geocoders · 2)
    ├── MAP (Geographic Maps · 3)              SHT (Drawers & Modals · 3)
    ├── LST (Lists, Tables & Kanban · 7)       NTF (Notification Sets · 2)
    ├── DTL (Detailed Dossiers · 10)           ONB (Onboarding Steps · 4)
    ├── CMP (Pairwise Comparisons · 2)         SET / TML / STA (System Controls · 5)
```

---

## 4. Master Screen Manifest (All 56 Screens)

Every screen is indexed below with its canonical Screen ID, Name, Module, Pattern Type, User Functions, Journey Step, Viewport Platform, and Core Content Requirement.

| Screen ID | Screen Name | Module | Type | Functions | Journey | Platform | Must-Show Core Content |
|---|---|---|---|---|---|---|---|
| `SHL-SRC-01` | **Command Palette** | SHL | SRC | Search, Explore | J3-1 | Desktop | ⌘K overlay; typed query '4821'; grouped results (Bills, Officials, Cases, Places, Screens); keyboard hints. |
| `SHL-SHT-01` | **Provenance Inspector** | SHL | SHT | Drill down, Explore | J2-6 | Desktop | Source name, endpoint/document, retrieved-at, update cadence, method (official vs EST), interpolation formula, link to raw record. |
| `SHL-STA-01` | **System States & Diagnostics** | SHL | STA | Monitor, Configure | UTL-2 | Desktop | Skeleton loading, stale panel, feed outage, offline, empty search, rate-limited — one panel each. |
| `SHL-NTF-01` | **Alert Center Drawer** | SHL | NTF | Alert, Monitor | UTL-1 | Desktop | Grouped alerts by module, severity color, mute/snooze, 'view on map' actions. |
| `SHL-NTF-02` | **Push Notifications (Lock Screen)** | SHL | NTF | Alert | J3-5 | Mobile | Lock-screen set: Breaking story, Bill passed Senate, Funding deadline T-24h, Opinion released, Race called. |
| `ONB-ONB-01` | **Station Boot & Welcome** | ONB | ONB | Configure, Explore | J1-1 | Desktop | Instrument power-on animation storyboard, value prop, Continue. |
| `ONB-ONB-02` | **Pick Your Feeds** | ONB | ONB | Configure | J1-2 | Desktop | Toggle tiles per module and policy area. |
| `ONB-ONB-03` | **Home District Setup** | ONB | ONB | Search, Configure | J1-3 | Desktop | Address field, map snapping to congressional district, your House member + Senators preview. |
| `ONB-ONB-04` | **Alert Preferences** | ONB | ONB | Configure, Alert | J1-4 | Desktop | Severity thresholds, quiet hours, channels. |
| `ONB-SET-01` | **Settings & Data Transparency** | ONB | SET | Configure | UTL-3 | Desktop | Theme (Night/Day Ops), units, Reduced Motion, data-source transparency list, notification controls. |
| `PUL-DSH-01` | **Pulse — Command Deck** | PUL | DSH | Monitor, Drill down, Explore | J1-5 | Desktop | Ticker strip, Debt Odometer, Shutdown Clock, mini Machine, pipeline summary, today's House/Senate floor, SCOTUS today, sentiment barometer, news seismograph, alert feed. |
| `PUL-DSH-02` | **Pulse — Mobile Companion** | PUL | DSH | Monitor, Drill down | J2-1 | Mobile | Stacked instrument cards, swipeable; same readings as desktop. |
| `PUL-DSH-03` | **Pulse — Wall Mode** | PUL | DSH | Monitor | J7-6 | Wall Mode | 1920×1080 big-type rotation of hero instruments. |
| `FSC-VIZ-01` | **National Debt Odometer** | FSC | VIZ | Monitor, Drill down | J2-2 | Desktop | Hero rolling counter (EST), $/sec, per-citizen, per-household, interest cost today, official last reading. |
| `FSC-DTL-01` | **Fiscal Breakdown Detail** | FSC | DTL | Drill down, Explore | J2-3 | Desktop | Debt held by public vs intragovernmental, deficit YTD, receipts vs outlays, interest share, debt-limit status. |
| `FSC-TML-01` | **Debt History & Limits Timeline** | FSC | TML | Explore, Track | UTL-4 | Desktop | Long timeline with debt-limit events and recessions annotated. |
| `SHD-VIZ-01` | **Shutdown Clock — Funded State** | SHD | VIZ | Monitor, Alert | J2-4 | Desktop | Split-flap T-minus, funding vehicle (CR / full-year), deadline date/time ET, scheduled votes. |
| `SHD-VIZ-02` | **Shutdown Clock — Lapse in Progress** | SHD | VIZ | Monitor, Alert, Drill down | J5-3 | Desktop | Elapsed counter in critical, agencies affected, furloughed/excepted estimates (EST), day-count vs historical record. |
| `SHD-LST-01` | **Appropriations Board (12 Subcommittees)** | SHD | LST | Track, Drill down | J2-5 | Desktop | 12 subcommittee bills × stages grid (House/Senate committee, floor, conference, enacted), CR coverage. |
| `SHD-DTL-01` | **Agency Impact & Contingency Detail** | SHD | DTL | Drill down, Explore | J5-4 | Desktop | Per-agency contingency status, services paused, staffing gauge. |
| `SHD-TML-01` | **Shutdown History & Resolution Timeline** | SHD | TML | Explore, Compare | J5-5 | Desktop | Every past lapse as a bar on a timeline, duration, resolution vehicle. |
| `MCH-VIZ-01` | **The Machine (Three Branches Assembly Line)** | MCH | VIZ | Monitor, Explore, Drill down | J9-1 | Desktop | See §6.1: Twin presses, executive signing desk, judicial review chamber, checks-and-balances cables, jam lights, token counts, storyboard strip. |
| `MCH-VIZ-02` | **Branch Zoom — Executive Desk & Rulemaking** | MCH | VIZ | Drill down, Monitor | J9-2 | Desktop | One station enlarged with belt contents listed, gauges, jam list. |
| `MCH-DTL-01` | **Item Tracer (Full Path & Audit Trail)** | MCH | DTL | Track, Drill down | J3-8 | Desktop | One item's full path through the machine as a lit route with timestamps. |
| `LEG-VIZ-01` | **Bill Pipeline (Subway Map & Sankey)** | LEG | VIZ | Track, Filter, Explore | J3-3 | Desktop | Subway-map stages, cosponsor token sizing, policy tint, fading trail, Sankey attrition toggle. |
| `LEG-LST-01` | **Bill Tracker Table** | LEG | LST | Track, Search, Compare | UTL-5 | Desktop | Sortable table with stage, days-in-stage sparkline, cosponsors, bipartisan index. |
| `LEG-DTL-01` | **Bill Detail Dossier** | LEG | DTL | Drill down, Track | J3-2 | Desktop | Title, sponsor, cosponsor seat map, stage progress, actions timeline, text versions, CBO score, related bills, sentiment mini-barometer. |
| `LEG-VIZ-02` | **Live Roll-Call Vote Board** | LEG | VIZ | Monitor, Drill down | J3-6 | Desktop | Chamber seat arc filling in real time, yea/nay/present/not voting tallies, party breakdown, time remaining, district map of votes. |
| `LEG-SHT-01` | **Track Bill Bottom Sheet** | LEG | SHT | Alert, Configure | J3-4 | Desktop | Bottom sheet: which stages to alert on, channel. |
| `LEG-DSH-01` | **Legislation by Topic & Sentiment** | LEG | DSH | Explore, Compare | J10-4 | Desktop | Policy-area tiles each with activity sparkline + sentiment. |
| `CRT-DSH-01` | **Courts Dashboard & Circuit Map** | CRT | DSH | Monitor, Drill down | J6-1 | Desktop | SCOTUS term status, emergency-application lane, circuit map with activity, today's arguments/opinions. |
| `CRT-LST-01` | **SCOTUS Docket Kanban Board** | CRT | LST | Track, Drill down | J6-2 | Desktop | Kanban: Petitions → Distributed for conference → Granted → Argued → Awaiting opinion → Decided. |
| `CRT-DTL-01` | **Case Detail Dossier & Audio Waveform** | CRT | DTL | Drill down, Explore | J6-3 | Desktop | Caption, docket number, question presented, lower-court path, filings timeline, amicus count, argument audio waveform, 9-seat vote split when decided. |
| `CRT-VIZ-01` | **Opinion Day Live Feed** | CRT | VIZ | Monitor, Alert | J6-4 | Desktop | Release slots, live feed of opinions as they post, author, vote split. |
| `CRT-LST-02` | **Federal Docket Search (PACER Explorer)** | CRT | LST | Search, Filter | J6-5 | Desktop | Results across district/circuit courts, filters (court, nature of suit, party type, date), document availability indicators. |
| `EXE-LST-01` | **Executive Actions Feed** | EXE | LST | Track, Search | J9-3 | Desktop | EOs, proclamations, memoranda with Federal Register citation and status. |
| `EXE-DTL-01` | **Executive Order Detail & Legal Tracker** | EXE | DTL | Drill down, Track | J9-4 | Desktop | Text summary, agencies directed, deadlines, litigation tracker linking to cases. |
| `EXE-VIZ-01` | **Federal Rulemaking Pipeline** | EXE | VIZ | Track, Monitor | J9-5 | Desktop | Proposed → comment period (countdown) → final → effective; comment volume chart. |
| `MAP-MAP-01` | **Map Studio (Layer Architecture)** | MAP | MAP | Explore, Drill down, Compare | J4-3 | Desktop | See §6.3: Query bar, layer stack, per-layer opacity/blend, time scrubber with playback speed, vector drilldown. |
| `MAP-SHT-01` | **Map Studio Layer Stack Drawer** | MAP | SHT | Configure, Explore | J4-4 | Desktop | Layer list with controls, add-layer catalog. |
| `MAP-MAP-02` | **News Shockwave Heat Map** | MAP | MAP | Monitor, Explore | J4-2 | Desktop | See §6.3: Story card pinned top-left, heat rings radiating geographically, small multiples at T+0 / T+15m / T+60m / T+6h, seismograph. |
| `MAP-CMP-01` | **Swipe Compare (Dual-Layer Diff)** | MAP | CMP | Compare, Explore | J4-5 | Desktop | Draggable divider, two layers/time points, delta legend. |
| `MAP-DTL-01` | **Geography Drilldown Dossier** | MAP | DTL | Drill down, Explore | J4-6 | Desktop | Breadcrumb (US › MI › MI-13 › Wayne County), representation, past results, demographics, current overlays. |
| `SNT-DSH-01` | **Sentiment Weather Station** | SNT | DSH | Monitor, Explore | J10-5 | Desktop | National 'pressure systems' by issue, barometers, wind-vector shifts, source mix. |
| `SNT-DTL-01` | **Issue Sentiment Multi-Methodology** | SNT | DTL | Drill down, Compare | J4-7 | Desktop | Polls (with n, MoE, method), prediction markets, social volume — shown side by side, never blended without disclosure. |
| `ELX-DSH-01` | **Race Center & Balance of Power** | ELX | DSH | Monitor, Explore | J7-1 | Desktop | House/Senate/Governor balance bars, key races list, ratings changes, fundraising. |
| `ELX-MAP-01` | **Election Night Big Board (Wall & Touch)** | ELX | MAP | Monitor, Drill down | J7-2 | Wall Mode | See §6.4: Touch-drill national->county, balance-of-power bars, % expected vote in, race-call status chips, county comparison, remaining votes panel. |
| `ELX-DTL-01` | **Key Race Detail & Vote Tabulation** | ELX | DTL | Drill down, Explore | J7-4 | Desktop | Candidates (fictional), vote counts, % expected in, county map, call status, vote-type breakdown. |
| `ELX-BLD-01` | **Path to Majority Simulator** | ELX | BLD | Explore, Configure | J7-5 | Desktop | Toggle uncalled races, live seat math, scenarios saved. |
| `PPL-SRC-01` | **Find My Officials (Address Lookup)** | PPL | SRC | Search, Explore | J10-1 | Desktop | Address input, map, federal + state officials list. |
| `PPL-DTL-01` | **Official Profile & Voting Record** | PPL | DTL | Drill down, Explore | J3-7 | Desktop | Party, district map, committee seats, sponsored bills, vote history heatmap, party-unity gauge, fundraising sparkline. |
| `PPL-CMP-01` | **Compare Officials (Vote Agreement Matrix)** | PPL | CMP | Compare, Drill down | J8-3 | Desktop | 2–4 side-by-side with vote agreement matrix. |
| `SCR-BLD-01` | **Finviz-Style Screener Builder** | SCR | BLD | Configure, Search, Explore | J8-1 | Desktop | Entity selector, filter chips, numeric sliders, column picker, presets ('Bipartisan bills moving fast', 'Stalled appropriations', 'Close House races', 'Votes against party'). |
| `SCR-LST-01` | **Screener Results Table** | SCR | LST | Track, Compare, Share/Export | J8-2 | Desktop | Dense table with sparklines, sort, export, 'open on map'. |
| `SCR-LST-02` | **Saved Screens & Watchlists** | SCR | LST | Track, Configure | J8-5 | Desktop | Watchlists with change counts since last visit. |
| `SCR-BLD-02` | **Alert Rule Builder (IF/THEN)** | SCR | BLD | Configure, Alert | J5-6 | Desktop | IF/THEN rule composer, preview of last 30 days of triggers. |

---

## 5. Scope & Coverage Audit

### 5.1 Platform Distribution
- **Desktop 'Command Deck' (1440×900)**: 52 screens (92.8% of portfolio). Primary interface optimized for information density, multi-column instrumentation, and 12-column layout grids.
- **Mobile Companion (390×844)**: 2 screens (`PUL-DSH-02`, `SHL-NTF-02`). Optimized for one-thumb 60-second briefings, vertical card stacking, 44px touch targets, and lock-screen push alerts.
- **Wall Mode 'Big Board' (1920×1080)**: 2 screens (`PUL-DSH-03`, `ELX-MAP-01`). Broadcast-grade, high-contrast, large-typography presentations tailored for television studio backdrops and command room displays.

### 5.2 Module Distribution
- **SHL (Shell & Global)**: 5 screens
- **ONB (Onboarding & Account)**: 5 screens
- **PUL (Pulse)**: 3 screens
- **FSC (Fiscal)**: 3 screens
- **SHD (Shutdown & Appropriations)**: 5 screens
- **MCH (The Machine)**: 3 screens
- **LEG (Legislation)**: 6 screens
- **CRT (Courts)**: 5 screens
- **EXE (Executive Actions)**: 3 screens
- **MAP (Maps & Overlays)**: 5 screens
- **SNT (Sentiment)**: 2 screens
- **ELX (Elections)**: 4 screens
- **PPL (People)**: 3 screens
- **SCR (Screener & Alerts)**: 4 screens

### 5.3 Quality & Neutrality Assurance
All sample data across all 56 screens strictly follows Section 5 neutrality rules:
1. **Plausible Fictional Entities**: Official legislation uses authentic formatting (`H.R. 4821 — Rural Broadband Resilience Act`, `S. 2104 — Clean Water Infrastructure Reauthorization Act`). Court captions mirror Federal Reporter style (`No. 25-1147, Halvorsen v. Department of Labor`).
2. **Separation of System and Party Encodings**: Critical system failures or lapses use magenta (`#FF3DA5`), never party red (`#EF4444`). Party affiliations are always explicitly marked with accessible letter glyphs `[D]`, `[R]`, and `[I]` alongside color hues.
3. **Provenance & Liveness Transparency**: Every data widget exposes an explicit update timestamp (`06:00:14 ET`), an authority chip (`SRC · TREASURY`, `SRC · CONGRESS.GOV`), and an `EST` indicator whenever mathematical modeling or spline interpolation is utilized.
