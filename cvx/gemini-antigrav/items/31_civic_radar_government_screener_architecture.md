# Civic Radar: Capitol Weather Station & Government Screener Technical Specification

**Classification**: CVX Unified Research Collection  
**Source Deliverable**: `2026-10-16-civic-radar-government-screener`  
**Constituent Files**: 5 documents  
**Generated**: 2026-10-16 08:23:23  

---

## Master Table of Contents

1. [00 Executive Concept And Screen Manifest](#doc-1-00_executive_concept_and_screen_manifest) (`00_EXECUTIVE_CONCEPT_AND_SCREEN_MANIFEST.md`)
2. [01 Capitol Weather Station Design System](#doc-2-01_capitol_weather_station_design_system) (`01_CAPITOL_WEATHER_STATION_DESIGN_SYSTEM.md`)
3. [02 Hero Instruments Technical Specification](#doc-3-02_hero_instruments_technical_specification) (`02_HERO_INSTRUMENTS_TECHNICAL_SPECIFICATION.md`)
4. [03 User Journeys And Flow Architecture](#doc-4-03_user_journeys_and_flow_architecture) (`03_USER_JOURNEYS_AND_FLOW_ARCHITECTURE.md`)
5. [04 Complete Screen Inventory And Content Spec](#doc-5-04_complete_screen_inventory_and_content_spec) (`04_COMPLETE_SCREEN_INVENTORY_AND_CONTENT_SPEC.md`)


---

<a id="doc-1-00_executive_concept_and_screen_manifest"></a>
<!-- ====================================================================== -->
<!-- FILE: 00_EXECUTIVE_CONCEPT_AND_SCREEN_MANIFEST.md (Sequence: 01 of 05) -->
<!-- ====================================================================== -->

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


---

<a id="doc-2-01_capitol_weather_station_design_system"></a>
<!-- ====================================================================== -->
<!-- FILE: 01_CAPITOL_WEATHER_STATION_DESIGN_SYSTEM.md (Sequence: 02 of 05) -->
<!-- ====================================================================== -->

# Civic Radar — 'Capitol Weather Station' Design System Specification

> **Document Metadata**  
> **System**: Capitol Weather Station Design Language  
> **Visual Paradigm**: Mission-Control Instrumentation / Tabular Monospace / Physical Dial & Flap Metaphors  
> **Color Space**: sRGB Dark 'Night Ops' Default + High-Contrast 'Day Ops' Operational Variant  
> **Grid & Scale**: 8px Base Grid · 12-Column Desktop Grid · 44px Minimum Mobile Touch Targets  
> **Accessibility**: WCAG 2.1 Level AA Compliance · Glyph & Pattern Redundancy · Reduced Motion Spec  

---

## 1. Aesthetic Foundations & Mood

### 1.1 Philosophy: Instrumentation Over Decoration
Civic Radar approaches civic data as an atmospheric observation science. Rather than decorative cards, marketing illustrations, or flag-waving patriotism, every UI element is constructed as a **calibrated scientific instrument**.

- **Quiet Dark Substrates**: Deep, light-absorbing obsidian foundations (`#0B0E12`) allow vibrant signal beacons to communicate status without visual fatigue.
- **Mechanical Tactility**: Hero numbers live inside physical digit-cells, split-flap counters rotate on mechanical drums, and conveyor belts transport legislative tokens like discrete physical workpieces.
- **Calibrated Station Identity**: Every panel features an upper-left station header tag (e.g. `STN FSC-01 · DEBT HELD BY PUBLIC`) in condensed uppercase with precision tracking.
- **No Editorial Adjectives**: Neutral, factual, and strictly mathematical. No 'disastrous deficit' or 'landslide victory' — only exact deltas, margins of error, and confidence intervals.

---

## 2. Color Token Architecture

### 2.1 'Night Ops' Theme (Default Dark Substrate)
Engineered for 24/7 mission control desks, dark command centers, and wall displays:

| Token Name | Hex Code | Swatch | Intended Role & Semantic Purpose |
|---|---|---|---|
| `bg/base` | `#0B0E12` | `[████]` | Deep background foundation of the application canvas. |
| `bg/panel` | `#12161C` | `[████]` | Primary instrument panel and widget container surface. |
| `bg/raised` | `#1A1F27` | `[████]` | Elevated card, dropdown menu, modal overlay, and hover state. |
| `line/grid` | `#232A34` | `[████]` | Hairline borders, chart gridlines, and corner registration ticks. |
| `text/primary` | `#E6EAF0` | `[████]` | High-contrast readings, critical values, section headers. |
| `text/secondary` | `#8A94A6` | `[████]` | Instrument labels, column headers, descriptive secondary text. |
| `text/tertiary` | `#566074` | `[████]` | Measurement units, timestamps, subtle metadata, station IDs. |
| `signal/data` | `#3DD6F5` | `[████]` | Interactive links, active selections, focus rings, data flows. |
| `signal/live` | `#3BE38B` | `[████]` | Operational health, active sessions, passed votes, live pulses. |
| `signal/attention` | `#FFB020` | `[████]` | Approaching deadlines, modeled estimates, pending votes, jams. |
| `signal/critical` | `#FF3DA5` | `[████]` | Funding lapses, vetoes, feed failures, breaking emergencies. |
| `signal/stale` | `#5B6472` | `[████]` | Interrupted telemetry, offline feeds, cached data indicators. |
| `party/dem` | `#3B82F6` | `[████]` | Democratic Party representation (paired with `[D]` glyph). |
| `party/rep` | `#EF4444` | `[████]` | Republican Party representation (paired with `[R]` glyph). |
| `party/ind` | `#A78BFA` | `[████]` | Independent / non-caucus members (paired with `[I]` glyph). |
| `party/other` | `#9CA3AF` | `[████]` | Third-party / nonpartisan entities (paired with `[O]` glyph). |

> [!IMPORTANT]
> **The Non-Partisan Color Invariant**: Critical system alerts (`signal/critical`) intentionally use vibrant magenta (`#FF3DA5`) rather than red, ensuring that alert states are never visually confused with Republican Party affiliation (`party/rep` `#EF4444`).

### 2.2 'Day Ops' Theme (Light Operational Variant)
Calibrated for high-ambient daylight environments and paper report exports:

| Token Name | Hex Code | Swatch | Intended Role & Semantic Purpose |
|---|---|---|---|
| `bg/base` | `#F4F6F9` | `[████]` | Clean, cool-gray canvas foundation. |
| `bg/panel` | `#FFFFFF` | `[████]` | Crisp white instrument panel surfaces. |
| `bg/raised` | `#E9EDF2` | `[████]` | Elevated dropdowns, popovers, and hovered table rows. |
| `line/grid` | `#D2D8E2` | `[████]` | Crisp structural dividing lines and tabular borders. |
| `text/primary` | `#0E1318` | `[████]` | Deep charcoal readings and primary titles. |
| `text/secondary` | `#4B5565` | `[████]` | Slate instrument tags and descriptive labels. |
| `text/tertiary` | `#7A8699` | `[████]` | Muted timestamps, units, and secondary codes. |
| `signal/data` | `#0284C7` | `[████]` | Deep cyan interactive focus and selected data points. |
| `signal/live` | `#15803D` | `[████]` | Forest green operational status and passed milestones. |
| `signal/attention` | `#D97706` | `[████]` | Amber warning, pending stage, and modeled estimation badge. |
| `signal/critical` | `#C026D3` | `[████]` | Deep magenta critical failures, lapses, and vetoes. |
| `signal/stale` | `#94A3B8` | `[████]` | Muted slate stale feed indicators. |
| `party/dem` | `#2563EB` | `[████]` | Democratic Party representation (paired with `[D]` glyph). |
| `party/rep` | `#DC2626` | `[████]` | Republican Party representation (paired with `[R]` glyph). |
| `party/ind` | `#7C3AED` | `[████]` | Independent representation (paired with `[I]` glyph). |
| `party/other` | `#64748B` | `[████]` | Nonpartisan representation (paired with `[O]` glyph). |

---

## 3. Typography & Numerical Formatting

### 3.1 Typeface Roles
- **Numerals & Telemetry Readings**: `JetBrains Mono` or `IBM Plex Mono`. Must always enforce tabular figures (`font-variant-numeric: tabular-nums`) to prevent horizontal jitter during live mechanical ticks.
- **General User Interface & Body Text**: `Inter` or `IBM Plex Sans`. High x-height, neutral tone, optimized for dense screen readability.
- **Instrument Station Labels**: `IBM Plex Sans Condensed`, uppercase, 10–11px with `letter-spacing: +0.08em` (e.g. `STN FSC-01 · DEBT HELD BY PUBLIC`).

### 3.2 Type Hierarchy Scale

| Scale Token | Font Family | Size / Line-Height | Tracking | Weight | Semantic Application |
|---|---|---|---|---|---|
| `type/hero-num` | Mono Tabular | 56px–96px / 1.0 | -0.02em | Bold (700) | National Debt Odometer, Split-Flap Clock countdowns. |
| `type/display-num` | Mono Tabular | 32px–44px / 1.1 | -0.01em | SemiBold (600) | Secondary totals, live roll-call vote tallies. |
| `type/heading-lg` | Sans | 20px–24px / 1.25 | -0.01em | SemiBold (600) | Dashboard titles, modal headers, major screen sections. |
| `type/heading-sm` | Sans | 14px–16px / 1.3 | 0.0em | Medium (500) | Panel card titles, entity names, bill titles. |
| `type/body` | Sans | 13px–14px / 1.45 | 0.0em | Regular (400) | Explanatory text, legal summaries, provenance notes. |
| `type/tabular-sm` | Mono Tabular | 12px–13px / 1.2 | 0.0em | Regular (400) | Table cell data, sparkline values, vote counts. |
| `type/instrument-tag`| Sans Condensed| 10px–11px / 1.0 | +0.08em | SemiBold (600) | Station IDs, timestamps, feed provenance chips. |

---

## 4. Instrument Vocabulary & UI Components

Civic Radar avoids generic bar charts, opting for specialized visual metaphors drawn from physical instrumentation:

```
┌────────────────────────────────────────────────────────────────────────┐
│                     CIVIC RADAR INSTRUMENT TAXONOMY                    │
├────────────────────────┬────────────────────────┬──────────────────────┤
│ 1. Mechanical Odometer │ 2. Split-Flap Counter  │ 3. Dial Barometer    │
│ [ $ 3 6 , 8 1 2 . 4 ]  │ [ 0 2 3 ]d [ 0 5 ]h    │     /───\  1012 hPa  │
│ ↻ ticks +$98k/sec EST  │ T-MINUS TO LAPSE       │    (  •  ) RISING    │
├────────────────────────┼────────────────────────┼──────────────────────┤
│ 4. Chamber Seat Arc    │ 5. Subway-Line Pipe    │ 6. Seismograph Strip │
│      ╭────────╮        │ [Intro]─[Cmte]─[Floor] │  _/\_/\__/\____/\_   │
│     ( D: 214 R: 216 )  │   ●───○───○───● Law    │  MENTION SHOCKWAVE   │
├────────────────────────┼────────────────────────┼──────────────────────┤
│ 7. News Shockwave Iso  │ 8. Docket Kanban Lanes │ 9. Sankey Attrition  │
│      ◎ ((( • )))       │ [Grant] [Arg] [Decide] │ 9412 Intro ──╮       │
│   EPICENTER: WASH DC   │   █       █      █     │   89 Enacted ────    │
└────────────────────────┴────────────────────────┴──────────────────────┘
```

1. **Rolling Mechanical Odometer**: Physical digit rollers in discrete bordered cells with vertical inertia blur on active digits. Displays real-time dollar amounts.
2. **Split-Flap Countdown Flapboard**: Airport terminal split-flap display with horizontal separation lines. Transitions flip downward from top half to bottom half.
3. **Analog Dial Gauge & Barometer**: Circular arc meter displaying public sentiment atmospheric pressure in hectopascals (hPa) with directional wind-shift vectors.
4. **Chamber Seat Arc**: Semicircular amphitheater displaying House (435 seats) or Senate (100 seats) configurations with discrete colored dots.
5. **Subway-Line Pipeline**: High-contrast transit line with circular station nodes, transferring bill tokens through legislative milestones.
6. **Seismograph Strip**: Continuous horizontal scrolling ribbon plotting intensity tremors following breaking news drops or roll-call votes.
7. **News Shockwave Heat Map**: Concentric circular heat rings radiating across U.S. county geography from legislative or legal epicenters.
8. **Docket Kanban Lanes**: Six procedural columns organizing Supreme Court cases from petition filing to published slip opinions.
9. **Sankey Attrition Funnel**: Fluid branch diagram illustrating steep bill attrition from introduction (9,000+) to public law (<100).

---

## 5. Liveness Grammar & Telemetry Badges

Every live widget in Civic Radar strictly adheres to a six-part liveness protocol:

```
LIVENESS HEADER SPECIFICATION:
[• LIVE]  STN FSC-01 · DEBT HELD BY PUBLIC   UPD 06:00:14 ET   [SRC · TREASURY]   [EST]
  (1)                      (2)                     (3)                (4)           (5)
```

1. **Live Pulse Beacon (`[• LIVE]`)**: A 6px green beacon pulsing with a subtle 2-second radar breathing animation (`signal/live` `#3BE38B`). Replaced by a circular **freshness ring** that drains if telemetry intervals exceed expected polling cycles.
2. **Station Identifier (`STN FSC-01`)**: Calibrated hardware-inspired station index identifying the telemetry channel.
3. **Eastern Time Timestamp (`UPD 06:00:14 ET`)**: Strict Eastern Time notation documenting the exact second of data receipt.
4. **Interactive Provenance Chip (`[SRC · TREASURY]`)**: Clickable badge that launches the Provenance Inspector (`SHL-SHT-01`), revealing endpoint URLs, API latency, and raw data.
5. **Modeled Estimate Badge (`[EST]`)**: Displayed in amber (`signal/attention` `#FFB020`) whenever figures represent an interpolation, statistical model, or CBO projection.
6. **Degraded & Stale Fallbacks**:
   - **Stale State**: When an endpoint fails to update within 2× its expected interval, the panel drops to 60% opacity and displays a `STALE 14m` badge in slate (`signal/stale` `#5B6472`).
   - **Feed Outage**: Complete API disruption renders a diagonal 45° hatched overlay across the chart while preserving the last verified reading in memory.

---

## 6. Grid, Registration Marks & Spatial Architecture

### 6.1 Layout Grid Structure
- **Base Unit**: 8px modular scale (8px, 16px, 24px, 32px, 48px).
- **Desktop Command Deck (1440×900)**: 12-column fluid grid, 24px column gutters, 24px outer margin. Background features a faint 24px square coordinate grid (`#12161C` on `#0B0E12`).
- **Panel Geometry**: 6px border radius, 1px solid `line/grid` (`#232A34`) border, 0px box shadows (dark elevation relies purely on surface tone `#12161C` vs `#1A1F27`).

### 6.2 Corner Registration Marks
Hero instruments feature technical optical registration marks (crosshair ticks `+` or right-angle brackets `┌ ┐ └ ┘`) in the four corners of the container, reinforcing the precision instrumentation metaphor.

---

## 7. Motion Grammar & Accessibility

### 7.1 Motion Conventions in Static & Interactive Frames
- **Motion Blur Trails**: Fast-moving items (e.g. rolling odometer digits, conveyor tokens) feature directional motion-blur styling.
- **Ghost Frames**: Past positions of moving elements are displayed at 30% opacity to communicate trajectory vectors.
- **Technical Annotations**: Static wireframes include speed callouts (e.g. `↻ ticks 1×/sec`, `belt velocity = 24 tokens/min`).
- **3-Frame Storyboard Strips**: Hero instruments (The Machine, Debt Odometer, News Shockwave, Roll-Call Board) include a 3-frame progressive storyboard illustrating initial, transition, and settled states.

### 7.2 Accessibility & Reduced Motion Specification
- **WCAG 2.1 AA Contrast**: All body text and primary numerical readings maintain a minimum contrast ratio of 7:1 against dark panel substrates; secondary text maintains >4.5:1.
- **Non-Color Encoding Redundancy**: Party affiliation is never communicated by color alone; every item includes an accessible bracketed text glyph (`[D]`, `[R]`, `[I]`). On choropleth maps, an optional diagonal crosshatch pattern is provided for color-blind accessibility.
- **Reduced Motion Mode (`ONB-SET-01`)**: When `prefers-reduced-motion` is enabled or toggled in Settings:
  - Mechanical conveyor belts in The Machine freeze into static pipeline diagrams.
  - Rolling odometers update instantly via discrete numeric stepping rather than continuous rolling motion.
  - Radar sweeps and split-flap flipping animations are disabled.


---

<a id="doc-3-02_hero_instruments_technical_specification"></a>
<!-- ====================================================================== -->
<!-- FILE: 02_HERO_INSTRUMENTS_TECHNICAL_SPECIFICATION.md (Sequence: 03 of 05) -->
<!-- ====================================================================== -->

# Civic Radar — Hero Instruments Technical Specification

> **Document Metadata**  
> **System**: Civic Radar Hero Instruments & Kinetic Engines  
> **Status**: Engineering-Ready Blueprint & Interaction Architecture  
> **Coverage**: 8 Primary Interactive Instruments · State Machines · Mathematical Models · Storyboards  

---

## 1. National Debt Odometer (`FSC-VIZ-01`)

### 1.1 Visual & Mechanical Architecture
The National Debt Odometer represents the total public debt outstanding as a continuous mechanical digit-drum apparatus. Each numerical character is housed in a distinct digit-cell with subtle top and bottom cylindrical gradients, simulating the curvature of an analog mechanical roller.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ [• LIVE]  STN FSC-01 · U.S. TOTAL PUBLIC DEBT OUTSTANDING       UPD 06:00:14 ET [EST]  │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                        │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐   │
│  │ $ │ │ 3 │ │ 6 │ │ , │ │ 8 │ │ 1 │ │ 2 │ │ , │ │ 4 │ │ 9 │ │ 1 │ │ , │ │ 2 │ │ 0 │   │
│  └───┘ └───┘ └───┘ └───┘ └───┘ └───┘ └───┘ └───┘ └───┘ └───┘ └───┘ └───┘ └───┘ └───┘   │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐                                                         │
│  │ 8 │ │ , │ │ 4 │ │ 4 │ │ 0 │ . 18  [ ↻ ticks 1×/sec · velocity = +$98,412/sec ]      │
│  └───┘ └───┘ └───┘ └───┘ └───┘                                                         │
│                                                                                        │
├───────────────────────────────┬───────────────────────────────┬────────────────────────┤
│ CITIZEN SHARE                 │ HOUSEHOLD SHARE               │ DAILY INTEREST COST    │
│ $108,412 / citizen            │ $284,105 / household          │ $2,941,200,000 / day   │
│ (Census pop: 339,520,000)     │ (Census hh: 129,580,000)      │ (Net effective rate 3.4%)│
├───────────────────────────────┴───────────────────────────────┴────────────────────────┤
│ [SRC · U.S. TREASURY (Fiscal Data)]   Official Settlement: $36,804,118,041,219.00     │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Mathematical Interpolation Model
The U.S. Treasury updates its official *Debt to the Penny* dataset once per business day at approximately 16:00 ET. To provide real-time mechanical feedback, Civic Radar computes a linear spline between consecutive published points:

$$D(t) = D_{official}(t_0) + \Delta_{daily} \cdot \frac{t - t_0}{86400}$$

- **$\\Delta_{daily}$ Velocity**: Projected daily borrowing rate based on the CBO monthly deficit trajectory (currently calibrated at $+\$98,412$ per second or $+\$8.502$ billion per day).
- **Provenance Constraint**: The widget must display the prominent amber `[EST]` chip. Clicking `[SRC · TREASURY]` launches the Provenance Inspector (`SHL-SHT-01`), showing the base print and formula.

### 1.3 Three-Frame Motion Storyboard

| Frame 1: Stable State (T+0s) | Frame 2: Mechanical Roller Blur (T+0.5s) | Frame 3: Settled Increment (T+1.0s) |
|---|---|---|
| `...208,440.18` | `...208,[440/538 blur]..` | `...208,538.59` |
| Digits stationary in cells. Cent rollers idle. | Cents and dollar drums rotate downward with 2px motion blur. | Drum locks into alignment detent with subtle tick animation. |

---

## 2. Shutdown Countdown Clock (`SHD-VIZ-01` & `SHD-VIZ-02`)

### 2.1 Dual-State Mechanical Flapboard
The Shutdown Clock employs an analog split-flap display with two distinct operational states:

#### State A: Funded State (`SHD-VIZ-01`)
Counting down to the nearest statutory appropriations deadline in dark cyan (`signal/data`):

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ [• LIVE]  STN SHD-01 · APPROPRIATIONS EXPIRATION T-MINUS           UPD 06:00:14 ET     │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                        │
│   ╔═══════╗   ╔═══════╗   ╔═══════╗   ╔═══════╗                                        │
│   ║  023  ║ : ║  05   ║ : ║  14   ║ : ║  22   ║                                        │
│   ╚═══════╝   ╚═══════╝   ╚═══════╝   ╚═══════╝                                        │
│     DAYS        HOURS       MINS        SECS                                           │
│                                                                                        │
│   FUNDING VEHICLE: Continuing Resolution (P.L. 119-14)                                 │
│   DEADLINE: November 15, 2026 at 23:59:59 ET · 12 of 12 Subcommittees Unenacted        │
│   NEXT SCHEDULED VOTE: House Floor CR Extension — Tuesday 14:00 ET                     │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

#### State B: Lapse in Progress (`SHD-VIZ-02`)
Triggered immediately upon lapse. Surface shifts to critical magenta (`signal/critical` `#FF3DA5`), counting upward from T+00:00:00:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ [• CRITICAL]  STN SHD-02 · GOVERNMENT FUNDING LAPSE IN PROGRESS    UPD 06:00:14 ET     │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                        │
│   ╔═══════╗   ╔═══════╗   ╔═══════╗   ╔═══════╗                                        │
│   ║ +004  ║ : ║  11   ║ : ║  48   ║ : ║  09   ║  ELAPSED SHUTDOWN TIME                 │
│   ╚═══════╝   ╚═══════╝   ╚═══════╝   ╚═══════╝                                        │
│     DAYS        HOURS       MINS        SECS                                           │
│                                                                                        │
│   AFFECTED CABINET AGENCIES: 9 of 12 Major Departments Lapsed                         │
│   ESTIMATED FURLOUGHED WORKERS: 840,000 personnel [EST] · Excepted Working: 620,000   │
│   HISTORICAL RECORD COMPARISON: 35 Days (2018-2019 Lapse) · Day 4 of Record Target    │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. The Machine (`MCH-VIZ-01`, `MCH-VIZ-02`, `MCH-DTL-01`)

### 3.1 2.5D Isometric Factory Floor Architecture
The Machine visualizes the constitutional separation of powers as an interconnected kinetic processing plant:

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                           THE MACHINE — THREE-BRANCH ASSEMBLY FLOOR                     │
├───────────────────────────────┬─────────────────────────┬───────────────────────────────┤
│ 1. LEGISLATIVE WORKS          │ 2. EXECUTIVE DESK       │ 3. JUDICIAL REVIEW CHAMBER    │
│                               │                         │                               │
│ ┌──────────┐   ┌──────────┐   │ ┌─────────────────────┐ │ ┌───────────────────────────┐ │
│ │  HOUSE   │   │  SENATE  │   │ │ PRESIDENT'S DESK    │ │ │ CERTIORARI DOCKET FILTER  │ │
│ │  PRESS   │   │  PRESS   │   │ │ 10-DAY SIGNING CLOCK│ │ │ 8,000 Petitions -> 65 Cert│ │
│ └────┬─────┘   └────┬─────┘   │ └──────────┬──────────┘ │ └─────────────┬─────────────┘ │
│      │              │         │            │            │               │               │
│      ▼              ▼         │     ┌──────┴──────┐     │               ▼               │
│ ┌───────────────────────────┐ │     ▼             ▼     │ ┌───────────────────────────┐ │
│ │ CONFERENCE MERGE JUNCTION │ │  [ LAW ]      [ VETO ]  │ │ ORAL ARGUMENT COURTROOM   │ │
│ └────────────┬──────────────┘ │  (Green)      (Critical)│ │ 9 Justices Bench Split    │ │
│              ▼                │     ▲             │     │ └─────────────┬─────────────┘ │
│       [ENROLLED CHUTE] ───────┼─────┘             ▼     │               ▼               │
│       Bills (Card Tokens)     │         [OVERRIDE LOOP]─┼───> [SLIP OPINIONS EMITTER]   │
│                               │                         │     Precedent / Injunctions   │
│  EO EMITTER: Gold Coins ●●●● │ RULEMAKING: Hex Nuts ⬡⬡ │ NOMINEE BELT: Pins 📍📍📍    │
└───────────────────────────────┴─────────────────────────┴───────────────────────────────┘
```

### 3.2 Token Morphology & Channel Capacity

| Token Type | Physical Representation | Velocity / Flow Rate | Jam Warning Threshold |
|---|---|---|---|
| **Legislation (Bills)** | Micro cards with chamber seals (`H.R.` / `S.`) | 12–24 tokens / hour | Stalled in committee >90 days (amber glow). |
| **Executive Orders** | Embossed gold coins with Presidential seal | 1–4 tokens / month | Injunction issued by District Court. |
| **Federal Rules** | Hexagonal nuts (NPRM -> Final Rule) | 8–16 tokens / week | Public comment surge (>10,000/day). |
| **Judicial Cases** | Monolithic dark cubes with docket numbers | 60–80 cases / term | Awaiting opinion >120 days post-argument. |
| **Nominees** | Precision brass pins | 4–12 tokens / month | Cloture petition filibuster. |

---

## 4. Bill Pipeline (`LEG-VIZ-01`)

### 4.1 Subway-Map Station Progression
```
[INTRODUCED] ──> [COMMITTEE] ──> [REPORTED] ──> [HOUSE FLOOR] ──> [PASSED HOUSE]
                                                                       │
  [PUBLIC LAW] <── [PRESIDENT DESK] <── [ENROLLED] <── [PASSED SENATE] <──┘
       ▲                 │
       │                 ├──> [VETO] ──> [OVERRIDE VOTE (2/3)] ──> [PUBLIC LAW]
       │                 └──> [POCKET VETO]
```

### 4.2 Secondary Attrition Mode: The Legislative Sankey
Toggling to the Sankey Attrition view reveals the steep survival funnel of the active 119th Congress:
- **9,412 Bills Introduced** (100.0%)
- **1,840 Reported by Committee** (19.5%)
- **412 Passed at Least One Chamber** (4.3%)
- **138 Enrolled and Presented to President** (1.4%)
- **89 Enacted into Public Law** (0.94%)

---

## 5. Map Studio & News Shockwave (`MAP-MAP-01` & `MAP-MAP-02`)

### 5.1 Layer Stack Hierarchy (`MAP-SHT-01`)
The Map Studio features an 8-tier GIS layer architecture. Layers are rendered in top-to-bottom blending order:
1. **Event Overlays (News Shockwave)**: Dynamic heat rings radiating from breaking news events.
2. **Sentiment Isobars**: Continuous meteorological pressure lines depicting net issue favorability.
3. **Live Returns Layer**: Precinct-level election tally updates on election night.
4. **Historical Margin Layer**: 2022/2024 general election baseline margins.
5. **Federal Outlays & Campaign Cash**: Vector choropleth of federal grant receipts and FEC donors.
6. **Representation**: Partisan control of House congressional districts.
7. **Demographics**: Census ACS rural/urban/education population distributions.
8. **Base Topography**: State, congressional district, and county boundary lines.

### 5.2 News Shockwave Dispersion Model (`MAP-MAP-02`)
```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ [• LIVE SHOCKWAVE]  STN MAP-02 · GEOGRAPHIC STORY DISPERSION         UPD 06:00:14 ET   │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ ┌───────────────────────────┐                                                          │
│ │ STORY: Bipartisan Rural   │          . - ~ ~ ~ - .                                   │
│ │ Broadband Bill Enacted    │      . '   /=======\   ' .                               │
│ │ Epicenter: Lansing / D.C. │    /     /  WASH DC  \     \                             │
│ │ Mentions: 4.8M / 45 mins  │   :     (     ●       )     :                            │
│ └───────────────────────────┘    \     \  HEAT RING/     /                             │
│                                    . '   \=======/   ' .                               │
│                                        ' - ~ ~ ~ - '                                   │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ DISPERSION SMALL MULTIPLES:                                                            │
│ [ T+0m: Epicenter ] ──> [ T+15m: State Spread ] ──> [ T+60m: Midwest ] ──> [ T+6h: Nat]│
├────────────────────────────────────────────────────────────────────────────────────────┤
│ MENTION INTENSITY SEISMOGRAPH:                                                         │
│ _/\_/\__/\/\/\________________/\/\/\/\________________/\________/\___ (12.4k req/sec) │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Live Roll-Call Chamber Seat Arc (`LEG-VIZ-02`)

### 6.1 Mechanical Semicircular Layout
435 House seats arranged in 8 concentric semicircular rows. Each seat is a 6px circular dot:
- Blue (`#3B82F6`): Democratic Yea
- Red (`#EF4444`): Republican Yea
- Critical Magenta (`#FF3DA5`): Nay (any party)
- Amber (`#FFB020`): Present / Not Voting
- Faint Grid (`#232A34`): Uncast vote awaiting tally

```
                     ╭─────────────────────────────────╮
                 ╭───╯    U.S. HOUSE OF REPRESENTATIVES ╰───╮
             ╭───╯           ROLL CALL VOTE #418            ╰───╮
           ╭─╯            H.R. 4821 — FINAL PASSAGE             ╰─╮
          │      ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ●      │
          │    ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ●    │
          │   ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ● ●   │
          │  ● ● ● ● ● ● ● ● [ CLOCK: 00:00 ] ● ● ● ● ● ● ● ● ●   │
          │   ● ● ● ● ● ● ●   VOTE CONCLUDED   ● ● ● ● ● ● ● ●    │
           ╰─╮                                                 ╭─╯
             ╰───╮  YEA: 274  ───  NAY: 156  ───  NOT VOTING: 5 ╭───╯
                 ╰─────────────────────────────────────────────╯
```

---

## 7. Courts & Docket Kanban (`CRT-LST-01`)

### 7.1 Six-Stage Procedural Board

| Column 1: Petitions Filed | Column 2: Distributed | Column 3: Cert Granted | Column 4: Argued | Column 5: Awaiting Opinion | Column 6: Decided |
|---|---|---|---|---|---|
| ~7,200 pending | 140 on weekly list | 58 cases in OT26 | 14 argued to date | 12 opinions drafted | 2 slip opinions published |
| `No. 26-104` Trade Assn | `No. 25-992` Tax Appeal | `No. 25-892` Apex Energy | `No. 25-1147` Halvorsen | `No. 25-1147` (Halvorsen) | `No. 25-812` (Affirmed 7-2) |

---

## 8. Finviz-Style Screener Builder (`SCR-BLD-01`)

### 8.1 Parametric Query Engine
Allows researchers and analysts to compose multi-clause relational filters across federal entities:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ [• READY]  STN SCR-01 · CIVIC RADAR PARAMETRIC SCREENER BUILDER      UPD 06:00:14 ET   │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ ENTITY: [• Bills] [ Officials] [ Cases] [ Districts] [ Rules]                          │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ PRESETS: [Bipartisan Fast-Track] [Stalled Approps] [Close House Races] [Party Rebels]  │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ CHAMBER: [All ▼]   STAGE: [Reported, Floor ▼]   POLICY: [Broadband, Tech, Energy ▼]   │
│                                                                                        │
│ COSPONSORS: [===●===========] >= 30 cosponsors (26 R, 22 D)                            │
│ BIPARTISAN INDEX: [=========●===] >= 0.75 score (Lugar / Georgetown Index)             │
│ DAYS IN CURRENT STAGE: [=====●=======] <= 45 days (Active velocity)                    │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ [APPLY SCREEN]  -->  18 Entities Match Query Parameters  ·  [SAVE ALERT RULE]          │
└────────────────────────────────────────────────────────────────────────────────────────┘
```


---

<a id="doc-4-03_user_journeys_and_flow_architecture"></a>
<!-- ====================================================================== -->
<!-- FILE: 03_USER_JOURNEYS_AND_FLOW_ARCHITECTURE.md (Sequence: 04 of 05) -->
<!-- ====================================================================== -->

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


---

<a id="doc-5-04_complete_screen_inventory_and_content_spec"></a>
<!-- ====================================================================== -->
<!-- FILE: 04_COMPLETE_SCREEN_INVENTORY_AND_CONTENT_SPEC.md (Sequence: 05 of 05) -->
<!-- ====================================================================== -->

# Civic Radar — Complete Screen Inventory & Content Specification

> **Document Metadata**  
> **System**: Civic Radar Screen Inventory & Specification Engine  
> **Standard**: High-Fidelity UI Specification (Mobbin-Style Screen Profiles)  
> **Coverage**: All 56 Screens · 14 Modules · Detailed Data Schemas · Wireframe Layouts  

---

## 1. `SHL-SRC-01` — Command Palette

**Tag Header**: `SHL-SRC-01 · Command Palette · Search · Search, Explore · J3-1 · Desktop`

| Specification Attribute | Detail / Configuration |
|---|---|
| **Screen ID** | `SHL-SRC-01` |
| **Module** | **SHL** (Shell & Global) |
| **Screen Pattern Type** | **SRC** (Search) |
| **User Functions** | Search, Explore |
| **Journey & Step** | `J3-1` (J3 — Follow a Bill to the President's Desk) |
| **Platform & Viewport** | **Desktop** (1440×900 px, 8px Base Grid) |
| **Liveness Protocol** | `STATIC_MODAL` |
| **Data Provenance** | `INTERNAL_INDEX · Civic Search Engine v2.4` |
| **Quality Badge** | `SAMPLE DATA` (Neutral / Non-Partisan) |

### Functional Purpose & Description
⌘K global query overlay; typed query '4821'; grouped results (Bills, Officials, Cases, Places, Screens); keyboard navigation hints.

### Mandatory Content Requirements (Must Show)
> ⌘K overlay; typed query '4821'; grouped results (Bills, Officials, Cases, Places, Screens); keyboard hints.

### Sample Realistic Data Payload
```json
{
  "screen_id": "SHL-SRC-01",
  "status": "VERIFIED_ACTIVE",
  "telemetry": "STATIC_MODAL",
  "provenance": "INTERNAL_INDEX · Civic Search Engine v2.4",
  "active_payload": "H.R. 4821 query active, 5 grouped hits, ESC to close, ↵ to jump."
}
```

### Layout & Interaction Blueprints
- **Top Header**: Persistent station identifier (`STN SHL-01`), Eastern Time stamp, live beacon dot, and `INTERNAL_INDEX · Civic Search Engine v2.4` chip.
- **Primary Visual Area**: High-density instrument rendering utilizing the `Search` pattern.
- **Interactive Hotspots**: Direct drill-down targets to companion detail sheets and return breadcrumb.

---

## 2. `SHL-SHT-01` — Provenance Inspector

**Tag Header**: `SHL-SHT-01 · Provenance Inspector · Sheet/Modal · Drill down, Explore · J2-6 · Desktop`

| Specification Attribute | Detail / Configuration |
|---|---|
| **Screen ID** | `SHL-SHT-01` |
| **Module** | **SHL** (Shell & Global) |
| **Screen Pattern Type** | **SHT** (Sheet/Modal) |
| **User Functions** | Drill down, Explore |
| **Journey & Step** | `J2-6` (J2 — Morning Briefing) |
| **Platform & Viewport** | **Desktop** (1440×900 px, 8px Base Grid) |
| **Liveness Protocol** | `LIVE · 06:00:14 ET` |
| **Data Provenance** | `SRC · U.S. TREASURY (Fiscal Data)` |
| **Quality Badge** | `SAMPLE DATA` (Neutral / Non-Partisan) |

### Functional Purpose & Description
Drawer revealing complete source lineage, endpoint URL, retrieved-at timestamp, update cadence, method (official vs EST), interpolation formula, and raw JSON payload link.

### Mandatory Content Requirements (Must Show)
> Source name, endpoint/document, retrieved-at, update cadence, method (official vs EST), interpolation formula, link to raw record.

### Sample Realistic Data Payload
```json
{
  "screen_id": "SHL-SHT-01",
  "status": "VERIFIED_ACTIVE",
  "telemetry": "LIVE · 06:00:14 ET",
  "provenance": "SRC · U.S. TREASURY (Fiscal Data)",
  "active_payload": "Source: U.S. Treasury Bureau of the Fiscal Service API; Endpoint: /v2/accounting/od/debt_to_penny; Interpolation: Linear spline between 00:01 ET and 17:00 ET settlement prints."
}
```

### Layout & Interaction Blueprints
- **Top Header**: Persistent station identifier (`STN SHL-02`), Eastern Time stamp, live beacon dot, and `SRC · U.S. TREASURY (Fiscal Data)` chip.
- **Primary Visual Area**: High-density instrument rendering utilizing the `Sheet/Modal` pattern.
- **Interactive Hotspots**: Direct drill-down targets to companion detail sheets and return breadcrumb.

---

## 3. `SHL-STA-01` — System States & Diagnostics

**Tag Header**: `SHL-STA-01 · System States & Diagnostics · System State · Monitor, Configure · UTL-2 · Desktop`

| Specification Attribute | Detail / Configuration |
|---|---|
| **Screen ID** | `SHL-STA-01` |
| **Module** | **SHL** (Shell & Global) |
| **Screen Pattern Type** | **STA** (System State) |
| **User Functions** | Monitor, Configure |
| **Journey & Step** | `UTL-2` (Utilities & States) |
| **Platform & Viewport** | **Desktop** (1440×900 px, 8px Base Grid) |
| **Liveness Protocol** | `DIAGNOSTIC` |
| **Data Provenance** | `SRC · SYSTEM MONITOR` |
| **Quality Badge** | `SAMPLE DATA` (Neutral / Non-Partisan) |

### Functional Purpose & Description
Comprehensive matrix of degraded and edge states: skeleton loading, stale panel (60% opacity with STALE 14m), feed outage hatched overlay, offline cache, empty search, and rate-limited queue.

### Mandatory Content Requirements (Must Show)
> Skeleton loading, stale panel, feed outage, offline, empty search, rate-limited — one panel each.

### Sample Realistic Data Payload
```json
{
  "screen_id": "SHL-STA-01",
  "status": "VERIFIED_ACTIVE",
  "telemetry": "DIAGNOSTIC",
  "provenance": "SRC · SYSTEM MONITOR",
  "active_payload": "Six diagnostic tiles showing simulated failure and degraded modes across legislative, fiscal, and court feeds."
}
```

### Layout & Interaction Blueprints
- **Top Header**: Persistent station identifier (`STN SHL-03`), Eastern Time stamp, live beacon dot, and `SRC · SYSTEM MONITOR` chip.
- **Primary Visual Area**: High-density instrument rendering utilizing the `System State` pattern.
- **Interactive Hotspots**: Direct drill-down targets to companion detail sheets and return breadcrumb.

---

## 4. `SHL-NTF-01` — Alert Center Drawer

**Tag Header**: `SHL-NTF-01 · Alert Center Drawer · Notification · Alert, Monitor · UTL-1 · Desktop`

| Specification Attribute | Detail / Configuration |
|---|---|
| **Screen ID** | `SHL-NTF-01` |
| **Module** | **SHL** (Shell & Global) |
| **Screen Pattern Type** | **NTF** (Notification) |
| **User Functions** | Alert, Monitor |
| **Journey & Step** | `UTL-1` (Utilities & States) |
| **Platform & Viewport** | **Desktop** (1440×900 px, 8px Base Grid) |
| **Liveness Protocol** | `LIVE · 06:00:14 ET` |
| **Data Provenance** | `SRC · ALERT DISPATCHER` |
| **Quality Badge** | `SAMPLE DATA` (Neutral / Non-Partisan) |

### Functional Purpose & Description
Right-side collapsible slide-out tray aggregating active alerts grouped by module, severity colors (critical magenta, attention amber, live green), mute/snooze actions, and 'View on Map' deep links.

### Mandatory Content Requirements (Must Show)
> Grouped alerts by module, severity color, mute/snooze, 'view on map' actions.

### Sample Realistic Data Payload
```json
{
  "screen_id": "SHL-NTF-01",
  "status": "VERIFIED_ACTIVE",
  "telemetry": "LIVE · 06:00:14 ET",
  "provenance": "SRC · ALERT DISPATCHER",
  "active_payload": "14 unread alerts: appropriations CR deadline T-24h, H.R. 4821 enrolled, SCOTUS opinion release in 35m."
}
```

### Layout & Interaction Blueprints
- **Top Header**: Persistent station identifier (`STN SHL-04`), Eastern Time stamp, live beacon dot, and `SRC · ALERT DISPATCHER` chip.
- **Primary Visual Area**: High-density instrument rendering utilizing the `Notification` pattern.
- **Interactive Hotspots**: Direct drill-down targets to companion detail sheets and return breadcrumb.

---

## 5. `SHL-NTF-02` — Push Notifications (Lock Screen)

**Tag Header**: `SHL-NTF-02 · Push Notifications (Lock Screen) · Notification · Alert · J3-5 · Mobile`

| Specification Attribute | Detail / Configuration |
|---|---|
| **Screen ID** | `SHL-NTF-02` |
| **Module** | **SHL** (Shell & Global) |
| **Screen Pattern Type** | **NTF** (Notification) |
| **User Functions** | Alert |
| **Journey & Step** | `J3-5` (J3 — Follow a Bill to the President's Desk) |
| **Platform & Viewport** | **Mobile** (390×844 px, 8px Base Grid) |
| **Liveness Protocol** | `TICKER DISPATCH` |
| **Data Provenance** | `SRC · APNS / FCM GATEWAY` |
| **Quality Badge** | `SAMPLE DATA` (Neutral / Non-Partisan) |

### Functional Purpose & Description
Mobile OS lock-screen push notifications suite: breaking news shockwave, bill passed Senate, funding deadline T-24h, Supreme Court opinion released, key race called.

### Mandatory Content Requirements (Must Show)
> Lock-screen set: Breaking story, Bill passed Senate, Funding deadline T-24h, Opinion released, Race called.

### Sample Realistic Data Payload
```json
{
  "screen_id": "SHL-NTF-02",
  "status": "VERIFIED_ACTIVE",
  "telemetry": "TICKER DISPATCH",
  "provenance": "SRC · APNS / FCM GATEWAY",
  "active_payload": "5 lock-screen notification cards with timestamp, severity accent, action buttons, and direct app deep links."
}
```

### Layout & Interaction Blueprints
- **Top Header**: Persistent station identifier (`STN SHL-05`), Eastern Time stamp, live beacon dot, and `SRC · APNS / FCM GATEWAY` chip.
- **Primary Visual Area**: High-density instrument rendering utilizing the `Notification` pattern.
- **Interactive Hotspots**: Direct drill-down targets to companion detail sheets and return breadcrumb.

---

## 6. `ONB-ONB-01` — Station Boot & Welcome

**Tag Header**: `ONB-ONB-01 · Station Boot & Welcome · Onboarding · Configure, Explore · J1-1 · Desktop`

| Specification Attribute | Detail / Configuration |
|---|---|
| **Screen ID** | `ONB-ONB-01` |
| **Module** | **ONB** (Onboarding & Account) |
| **Screen Pattern Type** | **ONB** (Onboarding) |
| **User Functions** | Configure, Explore |
| **Journey & Step** | `J1-1` (J1 — First Launch) |
| **Platform & Viewport** | **Desktop** (1440×900 px, 8px Base Grid) |
| **Liveness Protocol** | `BOOT SEQUENCE` |
| **Data Provenance** | `INTERNAL · SYSTEM BOOTLOADER` |
| **Quality Badge** | `SAMPLE DATA` (Neutral / Non-Partisan) |

### Functional Purpose & Description
First-launch experience featuring the instrument power-on animation storyboard, democracy weather station value proposition, telemetry check, and calibration button.

### Mandatory Content Requirements (Must Show)
> Instrument power-on animation storyboard, value prop, Continue.

### Sample Realistic Data Payload
```json
{
  "screen_id": "ONB-ONB-01",
  "status": "VERIFIED_ACTIVE",
  "telemetry": "BOOT SEQUENCE",
  "provenance": "INTERNAL · SYSTEM BOOTLOADER",
  "active_payload": "Station ID: STN-US-0104 · Telemetry: 14 feeds online · Calibration: nominal · 'Continue to Feeds'."
}
```

### Layout & Interaction Blueprints
- **Top Header**: Persistent station identifier (`STN ONB-06`), Eastern Time stamp, live beacon dot, and `INTERNAL · SYSTEM BOOTLOADER` chip.
- **Primary Visual Area**: High-density instrument rendering utilizing the `Onboarding` pattern.
- **Interactive Hotspots**: Direct drill-down targets to companion detail sheets and return breadcrumb.

---

## 7. `ONB-ONB-02` — Pick Your Feeds

**Tag Header**: `ONB-ONB-02 · Pick Your Feeds · Onboarding · Configure · J1-2 · Desktop`

| Specification Attribute | Detail / Configuration |
|---|---|
| **Screen ID** | `ONB-ONB-02` |
| **Module** | **ONB** (Onboarding & Account) |
| **Screen Pattern Type** | **ONB** (Onboarding) |
| **User Functions** | Configure |
| **Journey & Step** | `J1-2` (J1 — First Launch) |
| **Platform & Viewport** | **Desktop** (1440×900 px, 8px Base Grid) |
| **Liveness Protocol** | `SETUP` |
| **Data Provenance** | `SRC · USER PREFERENCES` |
| **Quality Badge** | `SAMPLE DATA` (Neutral / Non-Partisan) |

### Functional Purpose & Description
Multi-select toggle matrix of government modules and policy domains (Fiscal, Floor, SCOTUS, Elections, Defense, Energy, Tech, Agriculture) with real-time payload estimates.

### Mandatory Content Requirements (Must Show)
> Toggle tiles per module and policy area.

### Sample Realistic Data Payload
```json
{
  "screen_id": "ONB-ONB-02",
  "status": "VERIFIED_ACTIVE",
  "telemetry": "SETUP",
  "provenance": "SRC · USER PREFERENCES",
  "active_payload": "12 tiles toggled active (Congress, White House, Supreme Court, Treasury, Broadband, Clean Energy)."
}
```

### Layout & Interaction Blueprints
- **Top Header**: Persistent station identifier (`STN ONB-07`), Eastern Time stamp, live beacon dot, and `SRC · USER PREFERENCES` chip.
- **Primary Visual Area**: High-density instrument rendering utilizing the `Onboarding` pattern.
- **Interactive Hotspots**: Direct drill-down targets to companion detail sheets and return breadcrumb.

---

## 8. `ONB-ONB-03` — Home District Setup

**Tag Header**: `ONB-ONB-03 · Home District Setup · Onboarding · Search, Configure · J1-3 · Desktop`

| Specification Attribute | Detail / Configuration |
|---|---|
| **Screen ID** | `ONB-ONB-03` |
| **Module** | **ONB** (Onboarding & Account) |
| **Screen Pattern Type** | **ONB** (Onboarding) |
| **User Functions** | Search, Configure |
| **Journey & Step** | `J1-3` (J1 — First Launch) |
| **Platform & Viewport** | **Desktop** (1440×900 px, 8px Base Grid) |
| **Liveness Protocol** | `STATIC LOOKUP` |
| **Data Provenance** | `SRC · CENSUS GEOCODER API` |
| **Quality Badge** | `SAMPLE DATA` (Neutral / Non-Partisan) |

### Functional Purpose & Description
Address and ZIP geocoder snapping to congressional district boundaries on an interactive vector map, previewing your Representative and two Senators.

### Mandatory Content Requirements (Must Show)
> Address field, map snapping to congressional district, your House member + Senators preview.

### Sample Realistic Data Payload
```json
{
  "screen_id": "ONB-ONB-03",
  "status": "VERIFIED_ACTIVE",
  "telemetry": "STATIC LOOKUP",
  "provenance": "SRC · CENSUS GEOCODER API",
  "active_payload": "Address: 48201 Detroit MI -> Snapped to MI-13 (Rep. Brenda Chen [D]) + Sen. Elena Vance [D-MI], Sen. Gary Peters [D-MI]."
}
```

### Layout & Interaction Blueprints
- **Top Header**: Persistent station identifier (`STN ONB-08`), Eastern Time stamp, live beacon dot, and `SRC · CENSUS GEOCODER API` chip.
- **Primary Visual Area**: High-density instrument rendering utilizing the `Onboarding` pattern.
- **Interactive Hotspots**: Direct drill-down targets to companion detail sheets and return breadcrumb.

---

## 9. `ONB-ONB-04` — Alert Preferences

**Tag Header**: `ONB-ONB-04 · Alert Preferences · Onboarding · Configure, Alert · J1-4 · Desktop`

| Specification Attribute | Detail / Configuration |
|---|---|
| **Screen ID** | `ONB-ONB-04` |
| **Module** | **ONB** (Onboarding & Account) |
| **Screen Pattern Type** | **ONB** (Onboarding) |
| **User Functions** | Configure, Alert |
| **Journey & Step** | `J1-4` (J1 — First Launch) |
| **Platform & Viewport** | **Desktop** (1440×900 px, 8px Base Grid) |
| **Liveness Protocol** | `PREFERENCE STATE` |
| **Data Provenance** | `SRC · ALERT ENGINE` |
| **Quality Badge** | `SAMPLE DATA` (Neutral / Non-Partisan) |

### Functional Purpose & Description
Threshold configurer for breaking news, roll-call outcomes, appropriations lapse proximity, quiet hours schedule, and channel toggles (Push, Desktop, In-app).

### Mandatory Content Requirements (Must Show)
> Severity thresholds, quiet hours, channels.

### Sample Realistic Data Payload
```json
{
  "screen_id": "ONB-ONB-04",
  "status": "VERIFIED_ACTIVE",
  "telemetry": "PREFERENCE STATE",
  "provenance": "SRC · ALERT ENGINE",
  "active_payload": "Threshold: Attention & Critical only; Quiet hours: 23:00 - 06:30 ET; Emergency override: ON."
}
```

### Layout & Interaction Blueprints
- **Top Header**: Persistent station identifier (`STN ONB-09`), Eastern Time stamp, live beacon dot, and `SRC · ALERT ENGINE` chip.
- **Primary Visual Area**: High-density instrument rendering utilizing the `Onboarding` pattern.
- **Interactive Hotspots**: Direct drill-down targets to companion detail sheets and return breadcrumb.

---

## 10. `ONB-SET-01` — Settings & Data Transparency

**Tag Header**: `ONB-SET-01 · Settings & Data Transparency · Settings · Configure · UTL-3 · Desktop`

| Specification Attribute | Detail / Configuration |
|---|---|
| **Screen ID** | `ONB-SET-01` |
| **Module** | **ONB** (Onboarding & Account) |
| **Screen Pattern Type** | **SET** (Settings) |
| **User Functions** | Configure |
| **Journey & Step** | `UTL-3` (Utilities & States) |
| **Platform & Viewport** | **Desktop** (1440×900 px, 8px Base Grid) |
| **Liveness Protocol** | `SYSTEM CONTROLS` |
| **Data Provenance** | `SRC · PREFERENCES & TELEMETRY` |
| **Quality Badge** | `SAMPLE DATA` (Neutral / Non-Partisan) |

### Functional Purpose & Description
System control sheet: Theme toggle (Night Ops default vs Day Ops), Reduced Motion switch, data refresh rates, cache purge, and exhaustive data source transparency audit.

### Mandatory Content Requirements (Must Show)
> Theme (Night/Day Ops), units, Reduced Motion, data-source transparency list, notification controls.

### Sample Realistic Data Payload
```json
{
  "screen_id": "ONB-SET-01",
  "status": "VERIFIED_ACTIVE",
  "telemetry": "SYSTEM CONTROLS",
  "provenance": "SRC · PREFERENCES & TELEMETRY",
  "active_payload": "Night Ops active, Reduced Motion OFF, 18 federal APIs verified with latency and SSL fingerprint checks."
}
```

### Layout & Interaction Blueprints
- **Top Header**: Persistent station identifier (`STN ONB-10`), Eastern Time stamp, live beacon dot, and `SRC · PREFERENCES & TELEMETRY` chip.
- **Primary Visual Area**: High-density instrument rendering utilizing the `Settings` pattern.
- **Interactive Hotspots**: Direct drill-down targets to companion detail sheets and return breadcrumb.

---

## 11. `PUL-DSH-01` — Pulse — Command Deck

**Tag Header**: `PUL-DSH-01 · Pulse — Command Deck · Dashboard · Monitor, Drill down, Explore · J1-5 · Desktop`

| Specification Attribute | Detail / Configuration |
|---|---|
| **Screen ID** | `PUL-DSH-01` |
| **Module** | **PUL** (Pulse) |
| **Screen Pattern Type** | **DSH** (Dashboard) |
| **User Functions** | Monitor, Drill down, Explore |
| **Journey & Step** | `J1-5` (J1 — First Launch) |
| **Platform & Viewport** | **Desktop** (1440×900 px, 8px Base Grid) |
| **Liveness Protocol** | `LIVE · 06:00:14 ET` |
| **Data Provenance** | `SRC · MULTI-AGENCY AGGREGATOR` |
| **Quality Badge** | `SAMPLE DATA` (Neutral / Non-Partisan) |

### Functional Purpose & Description
Flagship desktop overview: persistent global ticker strip, live Debt Odometer, split-flap Shutdown Clock, mini Machine overview, active pipeline summary, House/Senate floor feeds, SCOTUS argument status, sentiment barometer, news seismograph, and live alert feed.

### Mandatory Content Requirements (Must Show)
> Ticker strip, Debt Odometer, Shutdown Clock, mini Machine, pipeline summary, today's House/Senate floor, SCOTUS today, sentiment barometer, news seismograph, alert feed.

### Sample Realistic Data Payload
```json
{
  "screen_id": "PUL-DSH-01",
  "status": "VERIFIED_ACTIVE",
  "telemetry": "LIVE · 06:00:14 ET",
  "provenance": "SRC · MULTI-AGENCY AGGREGATOR",
  "active_payload": "Debt: $36,812,491,208,440 (+$98,410/s EST) · Shutdown: T-23d 05h 14m 22s · Floor: House debating H.R. 4821, Senate in executive session · SCOTUS: No. 25-1147 argued."
}
```

### Layout & Interaction Blueprints
- **Top Header**: Persistent station identifier (`STN PUL-11`), Eastern Time stamp, live beacon dot, and `SRC · MULTI-AGENCY AGGREGATOR` chip.
- **Primary Visual Area**: High-density instrument rendering utilizing the `Dashboard` pattern.
- **Interactive Hotspots**: Direct drill-down targets to companion detail sheets and return breadcrumb.

---

## 12. `PUL-DSH-02` — Pulse — Mobile Companion

**Tag Header**: `PUL-DSH-02 · Pulse — Mobile Companion · Dashboard · Monitor, Drill down · J2-1 · Mobile`

| Specification Attribute | Detail / Configuration |
|---|---|
| **Screen ID** | `PUL-DSH-02` |
| **Module** | **PUL** (Pulse) |
| **Screen Pattern Type** | **DSH** (Dashboard) |
| **User Functions** | Monitor, Drill down |
| **Journey & Step** | `J2-1` (J2 — Morning Briefing) |
| **Platform & Viewport** | **Mobile** (390×844 px, 8px Base Grid) |
| **Liveness Protocol** | `LIVE · 06:00:14 ET` |
| **Data Provenance** | `SRC · MOBILE SYNC STREAM` |
| **Quality Badge** | `SAMPLE DATA` (Neutral / Non-Partisan) |

### Functional Purpose & Description
Mobile companion dashboard: stacked swipeable instrument cards presenting the same high-density readings as desktop (Debt, Shutdown, Floor status, Supreme Court, Seismograph) with 44px touch targets.

### Mandatory Content Requirements (Must Show)
> Stacked instrument cards, swipeable; same readings as desktop.

### Sample Realistic Data Payload
```json
{
  "screen_id": "PUL-DSH-02",
  "status": "VERIFIED_ACTIVE",
  "telemetry": "LIVE · 06:00:14 ET",
  "provenance": "SRC · MOBILE SYNC STREAM",
  "active_payload": "Vertical card stack: [1] National Debt Odometer ($36.8T EST) [2] Shutdown Clock (T-23d) [3] Floor Activity [4] Shockwave Seismograph."
}
```

### Layout & Interaction Blueprints
- **Top Header**: Persistent station identifier (`STN PUL-12`), Eastern Time stamp, live beacon dot, and `SRC · MOBILE SYNC STREAM` chip.
- **Primary Visual Area**: High-density instrument rendering utilizing the `Dashboard` pattern.
- **Interactive Hotspots**: Direct drill-down targets to companion detail sheets and return breadcrumb.

---

## 13. `PUL-DSH-03` — Pulse — Wall Mode

**Tag Header**: `PUL-DSH-03 · Pulse — Wall Mode · Dashboard · Monitor · J7-6 · Wall Mode`

| Specification Attribute | Detail / Configuration |
|---|---|
| **Screen ID** | `PUL-DSH-03` |
| **Module** | **PUL** (Pulse) |
| **Screen Pattern Type** | **DSH** (Dashboard) |
| **User Functions** | Monitor |
| **Journey & Step** | `J7-6` (J7 — Election Night) |
| **Platform & Viewport** | **Wall Mode** (1920×1080 px, 8px Base Grid) |
| **Liveness Protocol** | `LIVE · 06:00:14 ET` |
| **Data Provenance** | `SRC · WALL CONTROLLER V4` |
| **Quality Badge** | `SAMPLE DATA` (Neutral / Non-Partisan) |

### Functional Purpose & Description
1080p broadcast/command-center wall mode: ultra-large typography, high-contrast dark surfaces, rotating hero instruments (National Debt mechanical counter, Shutdown split-flap, Election Big Board, The Machine), visible from 20 feet.

### Mandatory Content Requirements (Must Show)
> 1920×1080 big-type rotation of hero instruments.

### Sample Realistic Data Payload
```json
{
  "screen_id": "PUL-DSH-03",
  "status": "VERIFIED_ACTIVE",
  "telemetry": "LIVE · 06:00:14 ET",
  "provenance": "SRC · WALL CONTROLLER V4",
  "active_payload": "Hero display cycling every 30s: 96px mechanical debt odometer with real-time rate ticker, election balance-of-power arc, and live floor roll-call."
}
```

### Layout & Interaction Blueprints
- **Top Header**: Persistent station identifier (`STN PUL-13`), Eastern Time stamp, live beacon dot, and `SRC · WALL CONTROLLER V4` chip.
- **Primary Visual Area**: High-density instrument rendering utilizing the `Dashboard` pattern.
- **Interactive Hotspots**: Direct drill-down targets to companion detail sheets and return breadcrumb.

---

## 14. `FSC-VIZ-01` — National Debt Odometer

**Tag Header**: `FSC-VIZ-01 · National Debt Odometer · Live Visualization · Monitor, Drill down · J2-2 · Desktop`

| Specification Attribute | Detail / Configuration |
|---|---|
| **Screen ID** | `FSC-VIZ-01` |
| **Module** | **FSC** (Fiscal) |
| **Screen Pattern Type** | **VIZ** (Live Visualization) |
| **User Functions** | Monitor, Drill down |
| **Journey & Step** | `J2-2` (J2 — Morning Briefing) |
| **Platform & Viewport** | **Desktop** (1440×900 px, 8px Base Grid) |
| **Liveness Protocol** | `EST · 06:00:14 ET (Interpolated)` |
| **Data Provenance** | `SRC · TREASURY (Fiscal Data / Debt to Penny)` |
| **Quality Badge** | `SAMPLE DATA` (Neutral / Non-Partisan) |

### Functional Purpose & Description
Hero rolling mechanical counter ticking continuously with per-second rate, debt per citizen ($108,412), debt per household ($284,105), daily interest cost readout ($2.94B/day), EST badge, and Treasury provenance link.

### Mandatory Content Requirements (Must Show)
> Hero rolling counter (EST), $/sec, per-citizen, per-household, interest cost today, official last reading.

### Sample Realistic Data Payload
```json
{
  "screen_id": "FSC-VIZ-01",
  "status": "VERIFIED_ACTIVE",
  "telemetry": "EST · 06:00:14 ET (Interpolated)",
  "provenance": "SRC · TREASURY (Fiscal Data / Debt to Penny)",
  "active_payload": "Current Debt: $36,812,491,208,440.18 · Rate: +$98,412/sec · Citizen: $108,412 · Interest: $2.94B today · Official print: $36.804T (yesterday 17:00 ET)."
}
```

### Layout & Interaction Blueprints
- **Top Header**: Persistent station identifier (`STN FSC-14`), Eastern Time stamp, live beacon dot, and `SRC · TREASURY (Fiscal Data / Debt to Penny)` chip.
- **Primary Visual Area**: High-density instrument rendering utilizing the `Live Visualization` pattern.
- **Interactive Hotspots**: Direct drill-down targets to companion detail sheets and return breadcrumb.

---

## 15. `FSC-DTL-01` — Fiscal Breakdown Detail

**Tag Header**: `FSC-DTL-01 · Fiscal Breakdown Detail · Detail · Drill down, Explore · J2-3 · Desktop`

| Specification Attribute | Detail / Configuration |
|---|---|
| **Screen ID** | `FSC-DTL-01` |
| **Module** | **FSC** (Fiscal) |
| **Screen Pattern Type** | **DTL** (Detail) |
| **User Functions** | Drill down, Explore |
| **Journey & Step** | `J2-3` (J2 — Morning Briefing) |
| **Platform & Viewport** | **Desktop** (1440×900 px, 8px Base Grid) |
| **Liveness Protocol** | `UPD · 2026-10-15 17:00 ET` |
| **Data Provenance** | `SRC · CBO & TREASURY MONTHLY STATEMENT` |
| **Quality Badge** | `SAMPLE DATA` (Neutral / Non-Partisan) |

### Functional Purpose & Description
In-depth balance sheet: debt held by public ($29.4T) vs intragovernmental holdings ($7.4T), deficit YTD ($1.62T), receipts ($4.92T) vs outlays ($6.54T), net interest share of budget (14.2%), and statutory debt-limit headroom status.

### Mandatory Content Requirements (Must Show)
> Debt held by public vs intragovernmental, deficit YTD, receipts vs outlays, interest share, debt-limit status.

### Sample Realistic Data Payload
```json
{
  "screen_id": "FSC-DTL-01",
  "status": "VERIFIED_ACTIVE",
  "telemetry": "UPD · 2026-10-15 17:00 ET",
  "provenance": "SRC · CBO & TREASURY MONTHLY STATEMENT",
  "active_payload": "Public Debt: $29.41T (79.9%) · Intragovernmental: $7.40T (20.1%) · Outlays: $6.54T · Receipts: $4.92T · Net Interest: $928B (14.2% of outlays)."
}
```

### Layout & Interaction Blueprints
- **Top Header**: Persistent station identifier (`STN FSC-15`), Eastern Time stamp, live beacon dot, and `SRC · CBO & TREASURY MONTHLY STATEMENT` chip.
- **Primary Visual Area**: High-density instrument rendering utilizing the `Detail` pattern.
- **Interactive Hotspots**: Direct drill-down targets to companion detail sheets and return breadcrumb.

---

## 16. `FSC-TML-01` — Debt History & Limits Timeline

**Tag Header**: `FSC-TML-01 · Debt History & Limits Timeline · Timeline · Explore, Track · UTL-4 · Desktop`

| Specification Attribute | Detail / Configuration |
|---|---|
| **Screen ID** | `FSC-TML-01` |
| **Module** | **FSC** (Fiscal) |
| **Screen Pattern Type** | **TML** (Timeline) |
| **User Functions** | Explore, Track |
| **Journey & Step** | `UTL-4` (Utilities & States) |
| **Platform & Viewport** | **Desktop** (1440×900 px, 8px Base Grid) |
| **Liveness Protocol** | `HISTORICAL ARCHIVE` |
| **Data Provenance** | `SRC · ST. LOUIS FED (FRED) & HISTORICAL TREASURY` |
| **Quality Badge** | `SAMPLE DATA` (Neutral / Non-Partisan) |

### Functional Purpose & Description
Multi-decade chronological timeline showing national debt trajectories, debt-to-GDP ratios, historical debt-limit crises/suspensions, recession shading, and major legislative cost events.

### Mandatory Content Requirements (Must Show)
> Long timeline with debt-limit events and recessions annotated.

### Sample Realistic Data Payload
```json
{
  "screen_id": "FSC-TML-01",
  "status": "VERIFIED_ACTIVE",
  "telemetry": "HISTORICAL ARCHIVE",
  "provenance": "SRC · ST. LOUIS FED (FRED) & HISTORICAL TREASURY",
  "active_payload": "1990-2026 debt curve: 1995 standoff, 2011 Budget Control Act, 2020 CARES Act, 2023 Fiscal Responsibility Act, 2025 extension."
}
```

### Layout & Interaction Blueprints
- **Top Header**: Persistent station identifier (`STN FSC-16`), Eastern Time stamp, live beacon dot, and `SRC · ST. LOUIS FED (FRED) & HISTORICAL TREASURY` chip.
- **Primary Visual Area**: High-density instrument rendering utilizing the `Timeline` pattern.
- **Interactive Hotspots**: Direct drill-down targets to companion detail sheets and return breadcrumb.

---

## 17. `SHD-VIZ-01` — Shutdown Clock — Funded State

**Tag Header**: `SHD-VIZ-01 · Shutdown Clock — Funded State · Live Visualization · Monitor, Alert · J2-4 · Desktop`

| Specification Attribute | Detail / Configuration |
|---|---|
| **Screen ID** | `SHD-VIZ-01` |
| **Module** | **SHD** (Shutdown & Appropriations) |
| **Screen Pattern Type** | **VIZ** (Live Visualization) |
| **User Functions** | Monitor, Alert |
| **Journey & Step** | `J2-4` (J2 — Morning Briefing) |
| **Platform & Viewport** | **Desktop** (1440×900 px, 8px Base Grid) |
| **Liveness Protocol** | `LIVE COUNTDOWN · 06:00:14 ET` |
| **Data Provenance** | `SRC · HOUSE APPROPRIATIONS COMMITTEE CALENDAR` |
| **Quality Badge** | `SAMPLE DATA` (Neutral / Non-Partisan) |

### Functional Purpose & Description
Split-flap mechanical style countdown clock displaying exact T-minus to midnight appropriations deadline, active funding vehicle (CR through Nov 15), scheduled floor votes, and expiration risk level.

### Mandatory Content Requirements (Must Show)
> Split-flap T-minus, funding vehicle (CR / full-year), deadline date/time ET, scheduled votes.

### Sample Realistic Data Payload
```json
{
  "screen_id": "SHD-VIZ-01",
  "status": "VERIFIED_ACTIVE",
  "telemetry": "LIVE COUNTDOWN · 06:00:14 ET",
  "provenance": "SRC · HOUSE APPROPRIATIONS COMMITTEE CALENDAR",
  "active_payload": "FLAPS: [023] DAYS · [05] HOURS · [14] MINS · [22] SECS · Vehicle: Continuing Resolution P.L. 119-14 · Expiration: Nov 15 23:59 ET."
}
```

### Layout & Interaction Blueprints
- **Top Header**: Persistent station identifier (`STN SHD-17`), Eastern Time stamp, live beacon dot, and `SRC · HOUSE APPROPRIATIONS COMMITTEE CALENDAR` chip.
- **Primary Visual Area**: High-density instrument rendering utilizing the `Live Visualization` pattern.
- **Interactive Hotspots**: Direct drill-down targets to companion detail sheets and return breadcrumb.

---

## 18. `SHD-VIZ-02` — Shutdown Clock — Lapse in Progress

**Tag Header**: `SHD-VIZ-02 · Shutdown Clock — Lapse in Progress · Live Visualization · Monitor, Alert, Drill down · J5-3 · Desktop`

| Specification Attribute | Detail / Configuration |
|---|---|
| **Screen ID** | `SHD-VIZ-02` |
| **Module** | **SHD** (Shutdown & Appropriations) |
| **Screen Pattern Type** | **VIZ** (Live Visualization) |
| **User Functions** | Monitor, Alert, Drill down |
| **Journey & Step** | `J5-3` (J5 — Shutdown Watch) |
| **Platform & Viewport** | **Desktop** (1440×900 px, 8px Base Grid) |
| **Liveness Protocol** | `LIVE CRITICAL · 06:00:14 ET` |
| **Data Provenance** | `SRC · OMB CONTINGENCY PLANS / OPM` |
| **Quality Badge** | `SAMPLE DATA` (Neutral / Non-Partisan) |

### Functional Purpose & Description
Alternate split-flap clock state in critical magenta counting up elapsed time since funding lapse, number of affected cabinet agencies, estimated furloughed vs excepted federal workforce, and comparison vs historical records.

### Mandatory Content Requirements (Must Show)
> Elapsed counter in critical, agencies affected, furloughed/excepted estimates (EST), day-count vs historical record.

### Sample Realistic Data Payload
```json
{
  "screen_id": "SHD-VIZ-02",
  "status": "VERIFIED_ACTIVE",
  "telemetry": "LIVE CRITICAL · 06:00:14 ET",
  "provenance": "SRC · OMB CONTINGENCY PLANS / OPM",
  "active_payload": "FLAPS (CRITICAL MAGENTA): +[004] DAYS · [11] HOURS · [48] MINS · 9 of 12 bills lapsed · 840,000 furloughed (EST) · Record: 35 days (2018-19)."
}
```

### Layout & Interaction Blueprints
- **Top Header**: Persistent station identifier (`STN SHD-18`), Eastern Time stamp, live beacon dot, and `SRC · OMB CONTINGENCY PLANS / OPM` chip.
- **Primary Visual Area**: High-density instrument rendering utilizing the `Live Visualization` pattern.
- **Interactive Hotspots**: Direct drill-down targets to companion detail sheets and return breadcrumb.

---

## 19. `SHD-LST-01` — Appropriations Board (12 Subcommittees)

**Tag Header**: `SHD-LST-01 · Appropriations Board (12 Subcommittees) · List/Table · Track, Drill down · J2-5 · Desktop`

| Specification Attribute | Detail / Configuration |
|---|---|
| **Screen ID** | `SHD-LST-01` |
| **Module** | **SHD** (Shutdown & Appropriations) |
| **Screen Pattern Type** | **LST** (List/Table) |
| **User Functions** | Track, Drill down |
| **Journey & Step** | `J2-5` (J2 — Morning Briefing) |
| **Platform & Viewport** | **Desktop** (1440×900 px, 8px Base Grid) |
| **Liveness Protocol** | `UPD · 06:00:14 ET` |
| **Data Provenance** | `SRC · CONGRESS.GOV APPROPRIATIONS TABLE` |
| **Quality Badge** | `SAMPLE DATA` (Neutral / Non-Partisan) |

### Functional Purpose & Description
12 regular appropriations subcommittee bills tracking progress through 6 stages: House Subcomm, House Full, House Floor, Senate Floor, Conference, Enacted, with CR coverage indicator tags.

### Mandatory Content Requirements (Must Show)
> 12 subcommittee bills × stages grid (House/Senate committee, floor, conference, enacted), CR coverage.

### Sample Realistic Data Payload
```json
{
  "screen_id": "SHD-LST-01",
  "status": "VERIFIED_ACTIVE",
  "telemetry": "UPD · 06:00:14 ET",
  "provenance": "SRC · CONGRESS.GOV APPROPRIATIONS TABLE",
  "active_payload": "12 regular bills: Ag, Commerce/Justice/Science, Defense, Energy/Water, Financial Services, Homeland Security, Interior, Labor/HHS/Ed, Legislative Branch, MilCon/VA, State/Foreign Ops, Transportation/HUD."
}
```

### Layout & Interaction Blueprints
- **Top Header**: Persistent station identifier (`STN SHD-19`), Eastern Time stamp, live beacon dot, and `SRC · CONGRESS.GOV APPROPRIATIONS TABLE` chip.
- **Primary Visual Area**: High-density instrument rendering utilizing the `List/Table` pattern.
- **Interactive Hotspots**: Direct drill-down targets to companion detail sheets and return breadcrumb.

---

## 20. `SHD-DTL-01` — Agency Impact & Contingency Detail

**Tag Header**: `SHD-DTL-01 · Agency Impact & Contingency Detail · Detail · Drill down, Explore · J5-4 · Desktop`

| Specification Attribute | Detail / Configuration |
|---|---|
| **Screen ID** | `SHD-DTL-01` |
| **Module** | **SHD** (Shutdown & Appropriations) |
| **Screen Pattern Type** | **DTL** (Detail) |
| **User Functions** | Drill down, Explore |
| **Journey & Step** | `J5-4` (J5 — Shutdown Watch) |
| **Platform & Viewport** | **Desktop** (1440×900 px, 8px Base Grid) |
| **Liveness Protocol** | `UPD · 2026-10-15 18:30 ET` |
| **Data Provenance** | `SRC · OMB AGENCY CONTINGENCY PLANS` |
| **Quality Badge** | `SAMPLE DATA` (Neutral / Non-Partisan) |

### Functional Purpose & Description
Per-agency contingency breakdown: staffing gauges (excepted vs furloughed personnel), paused public services, passport processing latency, national park access status, and contractor impact.

### Mandatory Content Requirements (Must Show)
> Per-agency contingency status, services paused, staffing gauge.

### Sample Realistic Data Payload
```json
{
  "screen_id": "SHD-DTL-01",
  "status": "VERIFIED_ACTIVE",
  "telemetry": "UPD · 2026-10-15 18:30 ET",
  "provenance": "SRC · OMB AGENCY CONTINGENCY PLANS",
  "active_payload": "Agency: Department of the Interior · Total Staff: 68,000 · Excepted: 14,200 (20.8%) · Furloughed: 53,800 · Parks: Open gate without visitor centers."
}
```

### Layout & Interaction Blueprints
- **Top Header**: Persistent station identifier (`STN SHD-20`), Eastern Time stamp, live beacon dot, and `SRC · OMB AGENCY CONTINGENCY PLANS` chip.
- **Primary Visual Area**: High-density instrument rendering utilizing the `Detail` pattern.
- **Interactive Hotspots**: Direct drill-down targets to companion detail sheets and return breadcrumb.

---

## 21. `SHD-TML-01` — Shutdown History & Resolution Timeline

**Tag Header**: `SHD-TML-01 · Shutdown History & Resolution Timeline · Timeline · Explore, Compare · J5-5 · Desktop`

| Specification Attribute | Detail / Configuration |
|---|---|
| **Screen ID** | `SHD-TML-01` |
| **Module** | **SHD** (Shutdown & Appropriations) |
| **Screen Pattern Type** | **TML** (Timeline) |
| **User Functions** | Explore, Compare |
| **Journey & Step** | `J5-5` (J5 — Shutdown Watch) |
| **Platform & Viewport** | **Desktop** (1440×900 px, 8px Base Grid) |
| **Liveness Protocol** | `HISTORICAL ARCHIVE` |
| **Data Provenance** | `SRC · CONGRESSIONAL RESEARCH SERVICE (CRS REPORT RL32614)` |
| **Quality Badge** | `SAMPLE DATA` (Neutral / Non-Partisan) |

### Functional Purpose & Description
Historical timeline of all U.S. government funding gaps and shutdowns since 1976: duration in calendar days, economic cost estimates, and legislative resolution vehicle.

### Mandatory Content Requirements (Must Show)
> Every past lapse as a bar on a timeline, duration, resolution vehicle.

### Sample Realistic Data Payload
```json
{
  "screen_id": "SHD-TML-01",
  "status": "VERIFIED_ACTIVE",
  "telemetry": "HISTORICAL ARCHIVE",
  "provenance": "SRC · CONGRESSIONAL RESEARCH SERVICE (CRS REPORT RL32614)",
  "active_payload": "21 historical lapses: 2018-19 (35d, CR P.L. 116-5), 2018 Jan (3d), 2013 (16d, Continuing Appropriations Act), 1995-96 (21d)."
}
```

### Layout & Interaction Blueprints
- **Top Header**: Persistent station identifier (`STN SHD-21`), Eastern Time stamp, live beacon dot, and `SRC · CONGRESSIONAL RESEARCH SERVICE (CRS REPORT RL32614)` chip.
- **Primary Visual Area**: High-density instrument rendering utilizing the `Timeline` pattern.
- **Interactive Hotspots**: Direct drill-down targets to companion detail sheets and return breadcrumb.

---

## 22. `MCH-VIZ-01` — The Machine (Three Branches Assembly Line)

**Tag Header**: `MCH-VIZ-01 · The Machine (Three Branches Assembly Line) · Live Visualization · Monitor, Explore, Drill down · J9-1 · Desktop`

| Specification Attribute | Detail / Configuration |
|---|---|
| **Screen ID** | `MCH-VIZ-01` |
| **Module** | **MCH** (The Machine) |
| **Screen Pattern Type** | **VIZ** (Live Visualization) |
| **User Functions** | Monitor, Explore, Drill down |
| **Journey & Step** | `J9-1` (J9 — Watch the Machine) |
| **Platform & Viewport** | **Desktop** (1440×900 px, 8px Base Grid) |
| **Liveness Protocol** | `LIVE ENGINE · 06:00:14 ET` |
| **Data Provenance** | `SRC · MULTI-BRANCH SIMULATOR & TELEMETRY` |
| **Quality Badge** | `SAMPLE DATA` (Neutral / Non-Partisan) |

### Functional Purpose & Description
2.5D isometric factory floor integrating the three branches: Legislative Works (House & Senate twin presses, conference junction, enrolled chute), Executive Desk (10-day signing clock, Law/Veto outputs, EO emitter, rulemaking belt), Judicial Review Chamber (cert filter, argument stage, opinion chute), checks-and-balances feedback cables, jam warning lights, token counters, Reduced Motion toggle, and 3-frame storyboard strip.

### Mandatory Content Requirements (Must Show)
> See §6.1: Twin presses, executive signing desk, judicial review chamber, checks-and-balances cables, jam lights, token counts, storyboard strip.

### Sample Realistic Data Payload
```json
{
  "screen_id": "MCH-VIZ-01",
  "status": "VERIFIED_ACTIVE",
  "telemetry": "LIVE ENGINE · 06:00:14 ET",
  "provenance": "SRC · MULTI-BRANCH SIMULATOR & TELEMETRY",
  "active_payload": "Active tokens: 184 bills on belts, 4 EOs emitted today, 12 rules in comment, 8 cases argued · Jam: S. 1420 stalled in committee 94 days (amber glow)."
}
```

### Layout & Interaction Blueprints
- **Top Header**: Persistent station identifier (`STN MCH-22`), Eastern Time stamp, live beacon dot, and `SRC · MULTI-BRANCH SIMULATOR & TELEMETRY` chip.
- **Primary Visual Area**: High-density instrument rendering utilizing the `Live Visualization` pattern.
- **Interactive Hotspots**: Direct drill-down targets to companion detail sheets and return breadcrumb.

---

## 23. `MCH-VIZ-02` — Branch Zoom — Executive Desk & Rulemaking

**Tag Header**: `MCH-VIZ-02 · Branch Zoom — Executive Desk & Rulemaking · Live Visualization · Drill down, Monitor · J9-2 · Desktop`

| Specification Attribute | Detail / Configuration |
|---|---|
| **Screen ID** | `MCH-VIZ-02` |
| **Module** | **MCH** (The Machine) |
| **Screen Pattern Type** | **VIZ** (Live Visualization) |
| **User Functions** | Drill down, Monitor |
| **Journey & Step** | `J9-2` (J9 — Watch the Machine) |
| **Platform & Viewport** | **Desktop** (1440×900 px, 8px Base Grid) |
| **Liveness Protocol** | `LIVE BRANCH TELEMETRY` |
| **Data Provenance** | `SRC · WHITE HOUSE EXECUTIVE CLERK & FEDERAL REGISTER` |
| **Quality Badge** | `SAMPLE DATA` (Neutral / Non-Partisan) |

### Functional Purpose & Description
Enlarged branch inspection view of the Executive Station: detailed 10-day countdown clock per enrolled bill, EO emitter tray, agency rulemaking conveyor (NPRM -> comments -> final rule), backlog counters, and jam alerts.

### Mandatory Content Requirements (Must Show)
> One station enlarged with belt contents listed, gauges, jam list.

### Sample Realistic Data Payload
```json
{
  "screen_id": "MCH-VIZ-02",
  "status": "VERIFIED_ACTIVE",
  "telemetry": "LIVE BRANCH TELEMETRY",
  "provenance": "SRC · WHITE HOUSE EXECUTIVE CLERK & FEDERAL REGISTER",
  "active_payload": "Executive Desk: H.R. 4821 arrived T+2d 14h ago (7d 10h remaining on signing clock) · EO Emitter: 1 draft queued · Rulemaking: 14 active dockets."
}
```

### Layout & Interaction Blueprints
- **Top Header**: Persistent station identifier (`STN MCH-23`), Eastern Time stamp, live beacon dot, and `SRC · WHITE HOUSE EXECUTIVE CLERK & FEDERAL REGISTER` chip.
- **Primary Visual Area**: High-density instrument rendering utilizing the `Live Visualization` pattern.
- **Interactive Hotspots**: Direct drill-down targets to companion detail sheets and return breadcrumb.

---

## 24. `MCH-DTL-01` — Item Tracer (Full Path & Audit Trail)

**Tag Header**: `MCH-DTL-01 · Item Tracer (Full Path & Audit Trail) · Detail · Track, Drill down · J3-8 · Desktop`

| Specification Attribute | Detail / Configuration |
|---|---|
| **Screen ID** | `MCH-DTL-01` |
| **Module** | **MCH** (The Machine) |
| **Screen Pattern Type** | **DTL** (Detail) |
| **User Functions** | Track, Drill down |
| **Journey & Step** | `J3-8` (J3 — Follow a Bill to the President's Desk) |
| **Platform & Viewport** | **Desktop** (1440×900 px, 8px Base Grid) |
| **Liveness Protocol** | `LIVE AUDIT TRACK` |
| **Data Provenance** | `SRC · CONGRESS.GOV & WHITE HOUSE CLERK` |
| **Quality Badge** | `SAMPLE DATA` (Neutral / Non-Partisan) |

### Functional Purpose & Description
Full end-to-end trace of a single token through The Machine: lit trajectory path showing timestamps, committee referrals, floor roll-call results, enrollment, and current position on the President's desk with 10-day clock.

### Mandatory Content Requirements (Must Show)
> One item's full path through the machine as a lit route with timestamps.

### Sample Realistic Data Payload
```json
{
  "screen_id": "MCH-DTL-01",
  "status": "VERIFIED_ACTIVE",
  "telemetry": "LIVE AUDIT TRACK",
  "provenance": "SRC · CONGRESS.GOV & WHITE HOUSE CLERK",
  "active_payload": "Item: H.R. 4821 · Path: Intro (Jan 12) -> Energy & Commerce (Feb 4) -> House Floor Pass (May 18) -> Senate Commerce (Jun 2) -> Senate Pass (Oct 14) -> Enrolled (Oct 15) -> President's Desk."
}
```

### Layout & Interaction Blueprints
- **Top Header**: Persistent station identifier (`STN MCH-24`), Eastern Time stamp, live beacon dot, and `SRC · CONGRESS.GOV & WHITE HOUSE CLERK` chip.
- **Primary Visual Area**: High-density instrument rendering utilizing the `Detail` pattern.
- **Interactive Hotspots**: Direct drill-down targets to companion detail sheets and return breadcrumb.

---

## 25. `LEG-VIZ-01` — Bill Pipeline (Subway Map & Sankey)

**Tag Header**: `LEG-VIZ-01 · Bill Pipeline (Subway Map & Sankey) · Live Visualization · Track, Filter, Explore · J3-3 · Desktop`

| Specification Attribute | Detail / Configuration |
|---|---|
| **Screen ID** | `LEG-VIZ-01` |
| **Module** | **LEG** (Legislation) |
| **Screen Pattern Type** | **VIZ** (Live Visualization) |
| **User Functions** | Track, Filter, Explore |
| **Journey & Step** | `J3-3` (J3 — Follow a Bill to the President's Desk) |
| **Platform & Viewport** | **Desktop** (1440×900 px, 8px Base Grid) |
| **Liveness Protocol** | `LIVE · 06:00:14 ET` |
| **Data Provenance** | `SRC · CONGRESS.GOV & GOVINFO API` |
| **Quality Badge** | `SAMPLE DATA` (Neutral / Non-Partisan) |

### Functional Purpose & Description
Subway-line visualization of legislative flow from Introduction to Public Law: tokens sized by cosponsors, tinted by policy domain, with days-in-stage motion trails. Top filter bar and secondary toggle to Sankey attrition diagram.

### Mandatory Content Requirements (Must Show)
> Subway-map stages, cosponsor token sizing, policy tint, fading trail, Sankey attrition toggle.

### Sample Realistic Data Payload
```json
{
  "screen_id": "LEG-VIZ-01",
  "status": "VERIFIED_ACTIVE",
  "telemetry": "LIVE · 06:00:14 ET",
  "provenance": "SRC · CONGRESS.GOV & GOVINFO API",
  "active_payload": "Active Pipeline: 9,412 Introduced -> 1,840 Committee Reported -> 412 Passed One Chamber -> 89 Enacted into Public Law · H.R. 4821 glowing in Enrolled station."
}
```

### Layout & Interaction Blueprints
- **Top Header**: Persistent station identifier (`STN LEG-25`), Eastern Time stamp, live beacon dot, and `SRC · CONGRESS.GOV & GOVINFO API` chip.
- **Primary Visual Area**: High-density instrument rendering utilizing the `Live Visualization` pattern.
- **Interactive Hotspots**: Direct drill-down targets to companion detail sheets and return breadcrumb.

---

## 26. `LEG-LST-01` — Bill Tracker Table

**Tag Header**: `LEG-LST-01 · Bill Tracker Table · List/Table · Track, Search, Compare · UTL-5 · Desktop`

| Specification Attribute | Detail / Configuration |
|---|---|
| **Screen ID** | `LEG-LST-01` |
| **Module** | **LEG** (Legislation) |
| **Screen Pattern Type** | **LST** (List/Table) |
| **User Functions** | Track, Search, Compare |
| **Journey & Step** | `UTL-5` (Utilities & States) |
| **Platform & Viewport** | **Desktop** (1440×900 px, 8px Base Grid) |
| **Liveness Protocol** | `UPD · 06:00:14 ET` |
| **Data Provenance** | `SRC · CONGRESS.GOV DATA FEED` |
| **Quality Badge** | `SAMPLE DATA` (Neutral / Non-Partisan) |

### Functional Purpose & Description
High-density Finviz-style table of monitored bills: stage badges, days-in-stage sparklines with min/max bounds, cosponsor counts, bipartisan index ratings, last action timestamps, and quick-track stars.

### Mandatory Content Requirements (Must Show)
> Sortable table with stage, days-in-stage sparkline, cosponsors, bipartisan index.

### Sample Realistic Data Payload
```json
{
  "screen_id": "LEG-LST-01",
  "status": "VERIFIED_ACTIVE",
  "telemetry": "UPD · 06:00:14 ET",
  "provenance": "SRC · CONGRESS.GOV DATA FEED",
  "active_payload": "25 tracked bills: H.R. 4821 (Enrolled, 48 cosponsors, BPI 0.88), S. 2104 (Senate Floor, 34 cosponsors, BPI 0.72), H.R. 1902 (Reported, 19 cosponsors)."
}
```

### Layout & Interaction Blueprints
- **Top Header**: Persistent station identifier (`STN LEG-26`), Eastern Time stamp, live beacon dot, and `SRC · CONGRESS.GOV DATA FEED` chip.
- **Primary Visual Area**: High-density instrument rendering utilizing the `List/Table` pattern.
- **Interactive Hotspots**: Direct drill-down targets to companion detail sheets and return breadcrumb.

---

## 27. `LEG-DTL-01` — Bill Detail Dossier

**Tag Header**: `LEG-DTL-01 · Bill Detail Dossier · Detail · Drill down, Track · J3-2 · Desktop`

| Specification Attribute | Detail / Configuration |
|---|---|
| **Screen ID** | `LEG-DTL-01` |
| **Module** | **LEG** (Legislation) |
| **Screen Pattern Type** | **DTL** (Detail) |
| **User Functions** | Drill down, Track |
| **Journey & Step** | `J3-2` (J3 — Follow a Bill to the President's Desk) |
| **Platform & Viewport** | **Desktop** (1440×900 px, 8px Base Grid) |
| **Liveness Protocol** | `LIVE DOSSIER · 06:00:14 ET` |
| **Data Provenance** | `SRC · CONGRESS.GOV & CBO.GOV` |
| **Quality Badge** | `SAMPLE DATA` (Neutral / Non-Partisan) |

### Functional Purpose & Description
Comprehensive legislative dossier: official title, primary sponsor card, cosponsor chamber seat map, step-by-step actions timeline, version diffs, CBO 10-year score, related companion bills, and public sentiment mini-barometer.

### Mandatory Content Requirements (Must Show)
> Title, sponsor, cosponsor seat map, stage progress, actions timeline, text versions, CBO score, related bills, sentiment mini-barometer.

### Sample Realistic Data Payload
```json
{
  "screen_id": "LEG-DTL-01",
  "status": "VERIFIED_ACTIVE",
  "telemetry": "LIVE DOSSIER · 06:00:14 ET",
  "provenance": "SRC · CONGRESS.GOV & CBO.GOV",
  "active_payload": "H.R. 4821 — Rural Broadband Resilience Act · Sponsor: Rep. Marcus Thorne [R-MI-02] · CBO Score: +$3.2B / 10yr · Sentiment: 68% favorable (n=2,400)."
}
```

### Layout & Interaction Blueprints
- **Top Header**: Persistent station identifier (`STN LEG-27`), Eastern Time stamp, live beacon dot, and `SRC · CONGRESS.GOV & CBO.GOV` chip.
- **Primary Visual Area**: High-density instrument rendering utilizing the `Detail` pattern.
- **Interactive Hotspots**: Direct drill-down targets to companion detail sheets and return breadcrumb.

---

## 28. `LEG-VIZ-02` — Live Roll-Call Vote Board

**Tag Header**: `LEG-VIZ-02 · Live Roll-Call Vote Board · Live Visualization · Monitor, Drill down · J3-6 · Desktop`

| Specification Attribute | Detail / Configuration |
|---|---|
| **Screen ID** | `LEG-VIZ-02` |
| **Module** | **LEG** (Legislation) |
| **Screen Pattern Type** | **VIZ** (Live Visualization) |
| **User Functions** | Monitor, Drill down |
| **Journey & Step** | `J3-6` (J3 — Follow a Bill to the President's Desk) |
| **Platform & Viewport** | **Desktop** (1440×900 px, 8px Base Grid) |
| **Liveness Protocol** | `LIVE VOTE TALLY` |
| **Data Provenance** | `SRC · HOUSE CLERK ELECTRONIC VOTING SYSTEM` |
| **Quality Badge** | `SAMPLE DATA` (Neutral / Non-Partisan) |

### Functional Purpose & Description
Real-time chamber seat arc filling seat-by-seat as votes are recorded, Yea/Nay/Present/Not Voting tallies, party discipline breakdown bar, voting time remaining clock, geographic choropleth map of cast votes, and 3-frame storyboard strip.

### Mandatory Content Requirements (Must Show)
> Chamber seat arc filling in real time, yea/nay/present/not voting tallies, party breakdown, time remaining, district map of votes.

### Sample Realistic Data Payload
```json
{
  "screen_id": "LEG-VIZ-02",
  "status": "VERIFIED_ACTIVE",
  "telemetry": "LIVE VOTE TALLY",
  "provenance": "SRC · HOUSE CLERK ELECTRONIC VOTING SYSTEM",
  "active_payload": "Roll Call #418 (H.R. 4821) · Result: PASSED 274 - 156 · Dem: 132 Yea, 78 Nay · Rep: 142 Yea, 78 Nay · Time remaining: 00:00 (Vote Finalized)."
}
```

### Layout & Interaction Blueprints
- **Top Header**: Persistent station identifier (`STN LEG-28`), Eastern Time stamp, live beacon dot, and `SRC · HOUSE CLERK ELECTRONIC VOTING SYSTEM` chip.
- **Primary Visual Area**: High-density instrument rendering utilizing the `Live Visualization` pattern.
- **Interactive Hotspots**: Direct drill-down targets to companion detail sheets and return breadcrumb.

---

## 29. `LEG-SHT-01` — Track Bill Bottom Sheet

**Tag Header**: `LEG-SHT-01 · Track Bill Bottom Sheet · Sheet/Modal · Alert, Configure · J3-4 · Desktop`

| Specification Attribute | Detail / Configuration |
|---|---|
| **Screen ID** | `LEG-SHT-01` |
| **Module** | **LEG** (Legislation) |
| **Screen Pattern Type** | **SHT** (Sheet/Modal) |
| **User Functions** | Alert, Configure |
| **Journey & Step** | `J3-4` (J3 — Follow a Bill to the President's Desk) |
| **Platform & Viewport** | **Desktop** (1440×900 px, 8px Base Grid) |
| **Liveness Protocol** | `CONFIG SHEET` |
| **Data Provenance** | `SRC · NOTIFICATION ENGINE` |
| **Quality Badge** | `SAMPLE DATA` (Neutral / Non-Partisan) |

### Functional Purpose & Description
Configuration drawer for setting granular bill tracking triggers: notify on committee markup, floor scheduling, roll-call start, presidential signature/veto, and delivery channels.

### Mandatory Content Requirements (Must Show)
> Bottom sheet: which stages to alert on, channel.

### Sample Realistic Data Payload
```json
{
  "screen_id": "LEG-SHT-01",
  "status": "VERIFIED_ACTIVE",
  "telemetry": "CONFIG SHEET",
  "provenance": "SRC · NOTIFICATION ENGINE",
  "active_payload": "Tracking H.R. 4821: Alert on Senate Passage [X], President Signature [X], CBO Estimate revisions [X] · Destination: Push & Desktop."
}
```

### Layout & Interaction Blueprints
- **Top Header**: Persistent station identifier (`STN LEG-29`), Eastern Time stamp, live beacon dot, and `SRC · NOTIFICATION ENGINE` chip.
- **Primary Visual Area**: High-density instrument rendering utilizing the `Sheet/Modal` pattern.
- **Interactive Hotspots**: Direct drill-down targets to companion detail sheets and return breadcrumb.

---

## 30. `LEG-DSH-01` — Legislation by Topic & Sentiment

**Tag Header**: `LEG-DSH-01 · Legislation by Topic & Sentiment · Dashboard · Explore, Compare · J10-4 · Desktop`

| Specification Attribute | Detail / Configuration |
|---|---|
| **Screen ID** | `LEG-DSH-01` |
| **Module** | **LEG** (Legislation) |
| **Screen Pattern Type** | **DSH** (Dashboard) |
| **User Functions** | Explore, Compare |
| **Journey & Step** | `J10-4` (J10 — Know Your Government) |
| **Platform & Viewport** | **Desktop** (1440×900 px, 8px Base Grid) |
| **Liveness Protocol** | `UPD · 06:00:14 ET` |
| **Data Provenance** | `SRC · CONGRESS POLICY CLASSIFIER & AGGREGATED POLLS` |
| **Quality Badge** | `SAMPLE DATA` (Neutral / Non-Partisan) |

### Functional Purpose & Description
Domain explorer displaying cards for 8 policy areas (Broadband/Tech, Clean Energy, Healthcare, Agriculture, National Defense, Transportation, Finance, Education) each with activity sparklines and public sentiment gauges.

### Mandatory Content Requirements (Must Show)
> Policy-area tiles each with activity sparkline + sentiment.

### Sample Realistic Data Payload
```json
{
  "screen_id": "LEG-DSH-01",
  "status": "VERIFIED_ACTIVE",
  "telemetry": "UPD · 06:00:14 ET",
  "provenance": "SRC · CONGRESS POLICY CLASSIFIER & AGGREGATED POLLS",
  "active_payload": "8 domain cards: Technology & Telecom (84 bills, 68% pos sentiment), Clean Energy (112 bills, 59% pos sentiment), Health (142 bills, 51% sentiment)."
}
```

### Layout & Interaction Blueprints
- **Top Header**: Persistent station identifier (`STN LEG-30`), Eastern Time stamp, live beacon dot, and `SRC · CONGRESS POLICY CLASSIFIER & AGGREGATED POLLS` chip.
- **Primary Visual Area**: High-density instrument rendering utilizing the `Dashboard` pattern.
- **Interactive Hotspots**: Direct drill-down targets to companion detail sheets and return breadcrumb.

---

## 31. `CRT-DSH-01` — Courts Dashboard & Circuit Map

**Tag Header**: `CRT-DSH-01 · Courts Dashboard & Circuit Map · Dashboard · Monitor, Drill down · J6-1 · Desktop`

| Specification Attribute | Detail / Configuration |
|---|---|
| **Screen ID** | `CRT-DSH-01` |
| **Module** | **CRT** (Courts) |
| **Screen Pattern Type** | **DSH** (Dashboard) |
| **User Functions** | Monitor, Drill down |
| **Journey & Step** | `J6-1` (J6 — Court Watcher) |
| **Platform & Viewport** | **Desktop** (1440×900 px, 8px Base Grid) |
| **Liveness Protocol** | `LIVE · 06:00:14 ET` |
| **Data Provenance** | `SRC · SUPREME COURT OF THE U.S. & PACER` |
| **Quality Badge** | `SAMPLE DATA` (Neutral / Non-Partisan) |

### Functional Purpose & Description
Federal judiciary overview: SCOTUS October Term 2026 status gauge, shadow docket / emergency applications lane, interactive 13-circuit geographic map with case activity heat levels, and today's oral argument calendar.

### Mandatory Content Requirements (Must Show)
> SCOTUS term status, emergency-application lane, circuit map with activity, today's arguments/opinions.

### Sample Realistic Data Payload
```json
{
  "screen_id": "CRT-DSH-01",
  "status": "VERIFIED_ACTIVE",
  "telemetry": "LIVE · 06:00:14 ET",
  "provenance": "SRC · SUPREME COURT OF THE U.S. & PACER",
  "active_payload": "SCOTUS Term: 58 granted, 14 argued, 2 opinions released · Emergency docket: 4 pending stay requests · 6th Circuit active in Cincinnati."
}
```

### Layout & Interaction Blueprints
- **Top Header**: Persistent station identifier (`STN CRT-31`), Eastern Time stamp, live beacon dot, and `SRC · SUPREME COURT OF THE U.S. & PACER` chip.
- **Primary Visual Area**: High-density instrument rendering utilizing the `Dashboard` pattern.
- **Interactive Hotspots**: Direct drill-down targets to companion detail sheets and return breadcrumb.

---

## 32. `CRT-LST-01` — SCOTUS Docket Kanban Board

**Tag Header**: `CRT-LST-01 · SCOTUS Docket Kanban Board · List/Table · Track, Drill down · J6-2 · Desktop`

| Specification Attribute | Detail / Configuration |
|---|---|
| **Screen ID** | `CRT-LST-01` |
| **Module** | **CRT** (Courts) |
| **Screen Pattern Type** | **LST** (List/Table) |
| **User Functions** | Track, Drill down |
| **Journey & Step** | `J6-2` (J6 — Court Watcher) |
| **Platform & Viewport** | **Desktop** (1440×900 px, 8px Base Grid) |
| **Liveness Protocol** | `LIVE KANBAN · 06:00:14 ET` |
| **Data Provenance** | `SRC · SUPREME COURT DOCKET SYSTEM` |
| **Quality Badge** | `SAMPLE DATA` (Neutral / Non-Partisan) |

### Functional Purpose & Description
Six-column Kanban board organizing all current-term cases: Petitions Filed -> Distributed for Conference -> Cert Granted -> Argued -> Awaiting Opinion -> Decided, with emergency shadow applications lane.

### Mandatory Content Requirements (Must Show)
> Kanban: Petitions → Distributed for conference → Granted → Argued → Awaiting opinion → Decided.

### Sample Realistic Data Payload
```json
{
  "screen_id": "CRT-LST-01",
  "status": "VERIFIED_ACTIVE",
  "telemetry": "LIVE KANBAN · 06:00:14 ET",
  "provenance": "SRC · SUPREME COURT DOCKET SYSTEM",
  "active_payload": "6 Kanban columns: No. 25-1147 Halvorsen v. DOL in 'Awaiting Opinion' lane (argued Oct 14); No. 25-892 Apex Energy in 'Granted' lane."
}
```

### Layout & Interaction Blueprints
- **Top Header**: Persistent station identifier (`STN CRT-32`), Eastern Time stamp, live beacon dot, and `SRC · SUPREME COURT DOCKET SYSTEM` chip.
- **Primary Visual Area**: High-density instrument rendering utilizing the `List/Table` pattern.
- **Interactive Hotspots**: Direct drill-down targets to companion detail sheets and return breadcrumb.

---

## 33. `CRT-DTL-01` — Case Detail Dossier & Audio Waveform

**Tag Header**: `CRT-DTL-01 · Case Detail Dossier & Audio Waveform · Detail · Drill down, Explore · J6-3 · Desktop`

| Specification Attribute | Detail / Configuration |
|---|---|
| **Screen ID** | `CRT-DTL-01` |
| **Module** | **CRT** (Courts) |
| **Screen Pattern Type** | **DTL** (Detail) |
| **User Functions** | Drill down, Explore |
| **Journey & Step** | `J6-3` (J6 — Court Watcher) |
| **Platform & Viewport** | **Desktop** (1440×900 px, 8px Base Grid) |
| **Liveness Protocol** | `RECORD VERIFIED · 06:00:14 ET` |
| **Data Provenance** | `SRC · SUPREME COURT & OYEZ / COURT RECORD` |
| **Quality Badge** | `SAMPLE DATA` (Neutral / Non-Partisan) |

### Functional Purpose & Description
Deep case dossier: formal caption, docket number, question presented, lower-court circuit journey, filings timeline, amicus curiae tally, oral argument audio waveform player, and 9-seat justice split.

### Mandatory Content Requirements (Must Show)
> Caption, docket number, question presented, lower-court path, filings timeline, amicus count, argument audio waveform, 9-seat vote split when decided.

### Sample Realistic Data Payload
```json
{
  "screen_id": "CRT-DTL-01",
  "status": "VERIFIED_ACTIVE",
  "telemetry": "RECORD VERIFIED · 06:00:14 ET",
  "provenance": "SRC · SUPREME COURT & OYEZ / COURT RECORD",
  "active_payload": "No. 25-1147, Halvorsen v. Department of Labor · Lower court: 6th Circuit · Amicus briefs: 24 · Oral argument: 58 min waveform playable."
}
```

### Layout & Interaction Blueprints
- **Top Header**: Persistent station identifier (`STN CRT-33`), Eastern Time stamp, live beacon dot, and `SRC · SUPREME COURT & OYEZ / COURT RECORD` chip.
- **Primary Visual Area**: High-density instrument rendering utilizing the `Detail` pattern.
- **Interactive Hotspots**: Direct drill-down targets to companion detail sheets and return breadcrumb.

---

## 34. `CRT-VIZ-01` — Opinion Day Live Feed

**Tag Header**: `CRT-VIZ-01 · Opinion Day Live Feed · Live Visualization · Monitor, Alert · J6-4 · Desktop`

| Specification Attribute | Detail / Configuration |
|---|---|
| **Screen ID** | `CRT-VIZ-01` |
| **Module** | **CRT** (Courts) |
| **Screen Pattern Type** | **VIZ** (Live Visualization) |
| **User Functions** | Monitor, Alert |
| **Journey & Step** | `J6-4` (J6 — Court Watcher) |
| **Platform & Viewport** | **Desktop** (1440×900 px, 8px Base Grid) |
| **Liveness Protocol** | `LIVE STREAM · 10:00 ET` |
| **Data Provenance** | `SRC · SUPREME COURT PUBLIC INFORMATION OFFICE` |
| **Quality Badge** | `SAMPLE DATA` (Neutral / Non-Partisan) |

### Functional Purpose & Description
Live broadcast board for Supreme Court opinion release mornings: release countdown slots, live terminal feed posting slip opinions in real time, author attribution, and seat vote breakdown (e.g. 6-3, 9-0).

### Mandatory Content Requirements (Must Show)
> Release slots, live feed of opinions as they post, author, vote split.

### Sample Realistic Data Payload
```json
{
  "screen_id": "CRT-VIZ-01",
  "status": "VERIFIED_ACTIVE",
  "telemetry": "LIVE STREAM · 10:00 ET",
  "provenance": "SRC · SUPREME COURT PUBLIC INFORMATION OFFICE",
  "active_payload": "Slot 1 (10:00 ET): No. 25-812 Released · Author: Barrett, J. · Vote: 7-2 · Holding: Affirmed lower court judgment · Full PDF available."
}
```

### Layout & Interaction Blueprints
- **Top Header**: Persistent station identifier (`STN CRT-34`), Eastern Time stamp, live beacon dot, and `SRC · SUPREME COURT PUBLIC INFORMATION OFFICE` chip.
- **Primary Visual Area**: High-density instrument rendering utilizing the `Live Visualization` pattern.
- **Interactive Hotspots**: Direct drill-down targets to companion detail sheets and return breadcrumb.

---

## 35. `CRT-LST-02` — Federal Docket Search (PACER Explorer)

**Tag Header**: `CRT-LST-02 · Federal Docket Search (PACER Explorer) · List/Table · Search, Filter · J6-5 · Desktop`

| Specification Attribute | Detail / Configuration |
|---|---|
| **Screen ID** | `CRT-LST-02` |
| **Module** | **CRT** (Courts) |
| **Screen Pattern Type** | **LST** (List/Table) |
| **User Functions** | Search, Filter |
| **Journey & Step** | `J6-5` (J6 — Court Watcher) |
| **Platform & Viewport** | **Desktop** (1440×900 px, 8px Base Grid) |
| **Liveness Protocol** | `LIVE QUERY` |
| **Data Provenance** | `SRC · COURTLISTENER / RECAP & PACER` |
| **Quality Badge** | `SAMPLE DATA` (Neutral / Non-Partisan) |

### Functional Purpose & Description
Unified query tool across federal district and circuit courts: nature-of-suit filtering, party lookup, judge tags, document availability indicators, and RECAP free-archive integration badges.

### Mandatory Content Requirements (Must Show)
> Results across district/circuit courts, filters (court, nature of suit, party type, date), document availability indicators.

### Sample Realistic Data Payload
```json
{
  "screen_id": "CRT-LST-02",
  "status": "VERIFIED_ACTIVE",
  "telemetry": "LIVE QUERY",
  "provenance": "SRC · COURTLISTENER / RECAP & PACER",
  "active_payload": "Query: 'Broadband Infrastructure' · 42 dockets found across E.D. Mich., 6th Cir., D.D.C. · 18 free RECAP PDFs accessible."
}
```

### Layout & Interaction Blueprints
- **Top Header**: Persistent station identifier (`STN CRT-35`), Eastern Time stamp, live beacon dot, and `SRC · COURTLISTENER / RECAP & PACER` chip.
- **Primary Visual Area**: High-density instrument rendering utilizing the `List/Table` pattern.
- **Interactive Hotspots**: Direct drill-down targets to companion detail sheets and return breadcrumb.

---

## 36. `EXE-LST-01` — Executive Actions Feed

**Tag Header**: `EXE-LST-01 · Executive Actions Feed · List/Table · Track, Search · J9-3 · Desktop`

| Specification Attribute | Detail / Configuration |
|---|---|
| **Screen ID** | `EXE-LST-01` |
| **Module** | **EXE** (Executive Actions) |
| **Screen Pattern Type** | **LST** (List/Table) |
| **User Functions** | Track, Search |
| **Journey & Step** | `J9-3` (J9 — Watch the Machine) |
| **Platform & Viewport** | **Desktop** (1440×900 px, 8px Base Grid) |
| **Liveness Protocol** | `UPD · 06:00:14 ET` |
| **Data Provenance** | `SRC · FEDERAL REGISTER & WHITE HOUSE PRESS OFFICE` |
| **Quality Badge** | `SAMPLE DATA` (Neutral / Non-Partisan) |

### Functional Purpose & Description
Chronological stream of Executive Orders, Presidential Proclamations, and Memoranda: Federal Register citations, issuing dates, affected cabinet departments, and judicial challenge status.

### Mandatory Content Requirements (Must Show)
> EOs, proclamations, memoranda with Federal Register citation and status.

### Sample Realistic Data Payload
```json
{
  "screen_id": "EXE-LST-01",
  "status": "VERIFIED_ACTIVE",
  "telemetry": "UPD · 06:00:14 ET",
  "provenance": "SRC · FEDERAL REGISTER & WHITE HOUSE PRESS OFFICE",
  "active_payload": "E.O. 14389 (Critical Grid Permitting, 91 FR 19842) · Proclamation 10842 (National Energy Week) · Memo on Federal AI Procurement."
}
```

### Layout & Interaction Blueprints
- **Top Header**: Persistent station identifier (`STN EXE-36`), Eastern Time stamp, live beacon dot, and `SRC · FEDERAL REGISTER & WHITE HOUSE PRESS OFFICE` chip.
- **Primary Visual Area**: High-density instrument rendering utilizing the `List/Table` pattern.
- **Interactive Hotspots**: Direct drill-down targets to companion detail sheets and return breadcrumb.

---

## 37. `EXE-DTL-01` — Executive Order Detail & Legal Tracker

**Tag Header**: `EXE-DTL-01 · Executive Order Detail & Legal Tracker · Detail · Drill down, Track · J9-4 · Desktop`

| Specification Attribute | Detail / Configuration |
|---|---|
| **Screen ID** | `EXE-DTL-01` |
| **Module** | **EXE** (Executive Actions) |
| **Screen Pattern Type** | **DTL** (Detail) |
| **User Functions** | Drill down, Track |
| **Journey & Step** | `J9-4` (J9 — Watch the Machine) |
| **Platform & Viewport** | **Desktop** (1440×900 px, 8px Base Grid) |
| **Liveness Protocol** | `VERIFIED ARCHIVE` |
| **Data Provenance** | `SRC · FEDERAL REGISTER & COURT REPOSITORIES` |
| **Quality Badge** | `SAMPLE DATA` (Neutral / Non-Partisan) |

### Functional Purpose & Description
Executive Order dissection: plain-language summary, directed federal agencies, regulatory deadlines countdown, compliance milestones, and legal challenge tracker cross-referencing federal court cases.

### Mandatory Content Requirements (Must Show)
> Text summary, agencies directed, deadlines, litigation tracker linking to cases.

### Sample Realistic Data Payload
```json
{
  "screen_id": "EXE-DTL-01",
  "status": "VERIFIED_ACTIVE",
  "telemetry": "VERIFIED ARCHIVE",
  "provenance": "SRC · FEDERAL REGISTER & COURT REPOSITORIES",
  "active_payload": "E.O. 14389 · Directs DOE, DOI, CEQ · 90-day progress report deadline · Litigation: No. 26-cv-0142 (D.D.C.) preliminary injunction denied."
}
```

### Layout & Interaction Blueprints
- **Top Header**: Persistent station identifier (`STN EXE-37`), Eastern Time stamp, live beacon dot, and `SRC · FEDERAL REGISTER & COURT REPOSITORIES` chip.
- **Primary Visual Area**: High-density instrument rendering utilizing the `Detail` pattern.
- **Interactive Hotspots**: Direct drill-down targets to companion detail sheets and return breadcrumb.

---

## 38. `EXE-VIZ-01` — Federal Rulemaking Pipeline

**Tag Header**: `EXE-VIZ-01 · Federal Rulemaking Pipeline · Live Visualization · Track, Monitor · J9-5 · Desktop`

| Specification Attribute | Detail / Configuration |
|---|---|
| **Screen ID** | `EXE-VIZ-01` |
| **Module** | **EXE** (Executive Actions) |
| **Screen Pattern Type** | **VIZ** (Live Visualization) |
| **User Functions** | Track, Monitor |
| **Journey & Step** | `J9-5` (J9 — Watch the Machine) |
| **Platform & Viewport** | **Desktop** (1440×900 px, 8px Base Grid) |
| **Liveness Protocol** | `LIVE FEED · 06:00:14 ET` |
| **Data Provenance** | `SRC · REGULATIONS.GOV API` |
| **Quality Badge** | `SAMPLE DATA` (Neutral / Non-Partisan) |

### Functional Purpose & Description
Interactive Administrative Procedure Act pipeline: Proposed Rule (NPRM) -> Public Comment Period (countdown clock) -> Final Rule -> Effective Date, with live public comment submission volume charts.

### Mandatory Content Requirements (Must Show)
> Proposed → comment period (countdown) → final → effective; comment volume chart.

### Sample Realistic Data Payload
```json
{
  "screen_id": "EXE-VIZ-01",
  "status": "VERIFIED_ACTIVE",
  "telemetry": "LIVE FEED · 06:00:14 ET",
  "provenance": "SRC · REGULATIONS.GOV API",
  "active_payload": "EPA Ozone Standard (NPRM 2026-0812) · Comment closes in 18d 04h · Total comments: 142,410 · Velocity: 840 comments/day."
}
```

### Layout & Interaction Blueprints
- **Top Header**: Persistent station identifier (`STN EXE-38`), Eastern Time stamp, live beacon dot, and `SRC · REGULATIONS.GOV API` chip.
- **Primary Visual Area**: High-density instrument rendering utilizing the `Live Visualization` pattern.
- **Interactive Hotspots**: Direct drill-down targets to companion detail sheets and return breadcrumb.

---

## 39. `MAP-MAP-01` — Map Studio (Layer Architecture)

**Tag Header**: `MAP-MAP-01 · Map Studio (Layer Architecture) · Map · Explore, Drill down, Compare · J4-3 · Desktop`

| Specification Attribute | Detail / Configuration |
|---|---|
| **Screen ID** | `MAP-MAP-01` |
| **Module** | **MAP** (Maps & Overlays) |
| **Screen Pattern Type** | **MAP** (Map) |
| **User Functions** | Explore, Drill down, Compare |
| **Journey & Step** | `J4-3` (J4 — Breaking News Shockwave) |
| **Platform & Viewport** | **Desktop** (1440×900 px, 8px Base Grid) |
| **Liveness Protocol** | `LIVE GIS CANVAS · 06:00:14 ET` |
| **Data Provenance** | `SRC · MULTI-SOURCE GIS & CENSUS TIGER` |
| **Quality Badge** | `SAMPLE DATA` (Neutral / Non-Partisan) |

### Functional Purpose & Description
Full-deck GIS platform with keyword query bar, multi-layer stack controls (events, sentiment isobars, live election results, campaign contributions, representation), time scrubber with 1x/10x/60x playback, and vector zoom.

### Mandatory Content Requirements (Must Show)
> See §6.3: Query bar, layer stack, per-layer opacity/blend, time scrubber with playback speed, vector drilldown.

### Sample Realistic Data Payload
```json
{
  "screen_id": "MAP-MAP-01",
  "status": "VERIFIED_ACTIVE",
  "telemetry": "LIVE GIS CANVAS · 06:00:14 ET",
  "provenance": "SRC · MULTI-SOURCE GIS & CENSUS TIGER",
  "active_payload": "Query: 'tariffs' -> Active layers: [1] Breaking News Shockwave [2] Public Sentiment Isobars [3] Congressional District Control."
}
```

### Layout & Interaction Blueprints
- **Top Header**: Persistent station identifier (`STN MAP-39`), Eastern Time stamp, live beacon dot, and `SRC · MULTI-SOURCE GIS & CENSUS TIGER` chip.
- **Primary Visual Area**: High-density instrument rendering utilizing the `Map` pattern.
- **Interactive Hotspots**: Direct drill-down targets to companion detail sheets and return breadcrumb.

---

## 40. `MAP-SHT-01` — Map Studio Layer Stack Drawer

**Tag Header**: `MAP-SHT-01 · Map Studio Layer Stack Drawer · Sheet/Modal · Configure, Explore · J4-4 · Desktop`

| Specification Attribute | Detail / Configuration |
|---|---|
| **Screen ID** | `MAP-SHT-01` |
| **Module** | **MAP** (Maps & Overlays) |
| **Screen Pattern Type** | **SHT** (Sheet/Modal) |
| **User Functions** | Configure, Explore |
| **Journey & Step** | `J4-4` (J4 — Breaking News Shockwave) |
| **Platform & Viewport** | **Desktop** (1440×900 px, 8px Base Grid) |
| **Liveness Protocol** | `LAYER MANAGER` |
| **Data Provenance** | `SRC · MAP STUDIO ENGINE` |
| **Quality Badge** | `SAMPLE DATA` (Neutral / Non-Partisan) |

### Functional Purpose & Description
Flyout catalog and layer manager: re-order layer hierarchy, toggle visibility, adjust opacity sliders, change blend modes (multiply, screen), view legends, and audit data source chips.

### Mandatory Content Requirements (Must Show)
> Layer list with controls, add-layer catalog.

### Sample Realistic Data Payload
```json
{
  "screen_id": "MAP-SHT-01",
  "status": "VERIFIED_ACTIVE",
  "telemetry": "LAYER MANAGER",
  "provenance": "SRC · MAP STUDIO ENGINE",
  "active_payload": "8 layers in stack: Event Shockwave (100% opacity), Sentiment Isobars (65% opacity), 2024 Base Margin (40% opacity), FEC Cash Flow (OFF)."
}
```

### Layout & Interaction Blueprints
- **Top Header**: Persistent station identifier (`STN MAP-40`), Eastern Time stamp, live beacon dot, and `SRC · MAP STUDIO ENGINE` chip.
- **Primary Visual Area**: High-density instrument rendering utilizing the `Sheet/Modal` pattern.
- **Interactive Hotspots**: Direct drill-down targets to companion detail sheets and return breadcrumb.

---

## 41. `MAP-MAP-02` — News Shockwave Heat Map

**Tag Header**: `MAP-MAP-02 · News Shockwave Heat Map · Map · Monitor, Explore · J4-2 · Desktop`

| Specification Attribute | Detail / Configuration |
|---|---|
| **Screen ID** | `MAP-MAP-02` |
| **Module** | **MAP** (Maps & Overlays) |
| **Screen Pattern Type** | **MAP** (Map) |
| **User Functions** | Monitor, Explore |
| **Journey & Step** | `J4-2` (J4 — Breaking News Shockwave) |
| **Platform & Viewport** | **Desktop** (1440×900 px, 8px Base Grid) |
| **Liveness Protocol** | `LIVE SHOCKWAVE · T+45m` |
| **Data Provenance** | `SRC · MEDIA CLOUD & REAL-TIME WIRE SERVICES` |
| **Quality Badge** | `SAMPLE DATA` (Neutral / Non-Partisan) |

### Functional Purpose & Description
Geographic story propagation tracker: pinned breaking story card, concentric heat rings radiating from epicenter, small multiples showing dispersion at T+0, T+15m, T+60m, T+6h, and seismograph strip along bottom.

### Mandatory Content Requirements (Must Show)
> See §6.3: Story card pinned top-left, heat rings radiating geographically, small multiples at T+0 / T+15m / T+60m / T+6h, seismograph.

### Sample Realistic Data Payload
```json
{
  "screen_id": "MAP-MAP-02",
  "status": "VERIFIED_ACTIVE",
  "telemetry": "LIVE SHOCKWAVE · T+45m",
  "provenance": "SRC · MEDIA CLOUD & REAL-TIME WIRE SERVICES",
  "active_payload": "Story: 'Bipartisan Broadband Agreement Enacted' · Epicenter: Washington D.C. + Lansing MI · Reach: 4.8M mentions across Midwest in 45m."
}
```

### Layout & Interaction Blueprints
- **Top Header**: Persistent station identifier (`STN MAP-41`), Eastern Time stamp, live beacon dot, and `SRC · MEDIA CLOUD & REAL-TIME WIRE SERVICES` chip.
- **Primary Visual Area**: High-density instrument rendering utilizing the `Map` pattern.
- **Interactive Hotspots**: Direct drill-down targets to companion detail sheets and return breadcrumb.

---

## 42. `MAP-CMP-01` — Swipe Compare (Dual-Layer Diff)

**Tag Header**: `MAP-CMP-01 · Swipe Compare (Dual-Layer Diff) · Comparison · Compare, Explore · J4-5 · Desktop`

| Specification Attribute | Detail / Configuration |
|---|---|
| **Screen ID** | `MAP-CMP-01` |
| **Module** | **MAP** (Maps & Overlays) |
| **Screen Pattern Type** | **CMP** (Comparison) |
| **User Functions** | Compare, Explore |
| **Journey & Step** | `J4-5` (J4 — Breaking News Shockwave) |
| **Platform & Viewport** | **Desktop** (1440×900 px, 8px Base Grid) |
| **Liveness Protocol** | `COMPARISON MODE` |
| **Data Provenance** | `SRC · TIME-SERIES SPATIAL INDEX` |
| **Quality Badge** | `SAMPLE DATA` (Neutral / Non-Partisan) |

### Functional Purpose & Description
Interactive split-screen map with draggable divider bar: compare two distinct layers or two points in time (e.g. sentiment before vs after breaking story, 2022 vs 2024 vote share, shift vectors).

### Mandatory Content Requirements (Must Show)
> Draggable divider, two layers/time points, delta legend.

### Sample Realistic Data Payload
```json
{
  "screen_id": "MAP-CMP-01",
  "status": "VERIFIED_ACTIVE",
  "telemetry": "COMPARISON MODE",
  "provenance": "SRC · TIME-SERIES SPATIAL INDEX",
  "active_payload": "Left: Pre-Story Sentiment (T-2h) · Right: Post-Story Sentiment (T+2h) · Delta: +14% favorability swing in Upper Midwest rural districts."
}
```

### Layout & Interaction Blueprints
- **Top Header**: Persistent station identifier (`STN MAP-42`), Eastern Time stamp, live beacon dot, and `SRC · TIME-SERIES SPATIAL INDEX` chip.
- **Primary Visual Area**: High-density instrument rendering utilizing the `Comparison` pattern.
- **Interactive Hotspots**: Direct drill-down targets to companion detail sheets and return breadcrumb.

---

## 43. `MAP-DTL-01` — Geography Drilldown Dossier

**Tag Header**: `MAP-DTL-01 · Geography Drilldown Dossier · Detail · Drill down, Explore · J4-6 · Desktop`

| Specification Attribute | Detail / Configuration |
|---|---|
| **Screen ID** | `MAP-DTL-01` |
| **Module** | **MAP** (Maps & Overlays) |
| **Screen Pattern Type** | **DTL** (Detail) |
| **User Functions** | Drill down, Explore |
| **Journey & Step** | `J4-6` (J4 — Breaking News Shockwave) |
| **Platform & Viewport** | **Desktop** (1440×900 px, 8px Base Grid) |
| **Liveness Protocol** | `RECORD VERIFIED · 06:00:14 ET` |
| **Data Provenance** | `SRC · CENSUS BUREAU & STATE ELECTION COMMISSIONS` |
| **Quality Badge** | `SAMPLE DATA` (Neutral / Non-Partisan) |

### Functional Purpose & Description
Hierarchical spatial profile with breadcrumb navigation (US › MI › MI-13 › Wayne County): political representation, historical election margins, demographic makeup, federal grant allocations, and active local alerts.

### Mandatory Content Requirements (Must Show)
> Breadcrumb (US › MI › MI-13 › Wayne County), representation, past results, demographics, current overlays.

### Sample Realistic Data Payload
```json
{
  "screen_id": "MAP-DTL-01",
  "status": "VERIFIED_ACTIVE",
  "telemetry": "RECORD VERIFIED · 06:00:14 ET",
  "provenance": "SRC · CENSUS BUREAU & STATE ELECTION COMMISSIONS",
  "active_payload": "Wayne County MI · Pop: 1.78M · 2024 Margin: D+28.4% · Representation: Rep. Brenda Chen [D-MI-13] · Broadband grants: $42.8M received."
}
```

### Layout & Interaction Blueprints
- **Top Header**: Persistent station identifier (`STN MAP-43`), Eastern Time stamp, live beacon dot, and `SRC · CENSUS BUREAU & STATE ELECTION COMMISSIONS` chip.
- **Primary Visual Area**: High-density instrument rendering utilizing the `Detail` pattern.
- **Interactive Hotspots**: Direct drill-down targets to companion detail sheets and return breadcrumb.

---

## 44. `SNT-DSH-01` — Sentiment Weather Station

**Tag Header**: `SNT-DSH-01 · Sentiment Weather Station · Dashboard · Monitor, Explore · J10-5 · Desktop`

| Specification Attribute | Detail / Configuration |
|---|---|
| **Screen ID** | `SNT-DSH-01` |
| **Module** | **SNT** (Sentiment) |
| **Screen Pattern Type** | **DSH** (Dashboard) |
| **User Functions** | Monitor, Explore |
| **Journey & Step** | `J10-5` (J10 — Know Your Government) |
| **Platform & Viewport** | **Desktop** (1440×900 px, 8px Base Grid) |
| **Liveness Protocol** | `UPD · 06:00:14 ET` |
| **Data Provenance** | `SRC · AGGREGATED POLLSTERS & PREDICTION MARKETS` |
| **Quality Badge** | `SAMPLE DATA` (Neutral / Non-Partisan) |

### Functional Purpose & Description
National public opinion meteorology: issue atmospheric pressure systems, analog dial barometers, wind-vector momentum indicators, and transparent methodology source mix gauges.

### Mandatory Content Requirements (Must Show)
> National 'pressure systems' by issue, barometers, wind-vector shifts, source mix.

### Sample Realistic Data Payload
```json
{
  "screen_id": "SNT-DSH-01",
  "status": "VERIFIED_ACTIVE",
  "telemetry": "UPD · 06:00:14 ET",
  "provenance": "SRC · AGGREGATED POLLSTERS & PREDICTION MARKETS",
  "active_payload": "Economy: 1012 hPa (High Pressure / Optimistic) · Infrastructure: Rising 4 hPa · Healthcare: Low Pressure 994 hPa (Volatile shift)."
}
```

### Layout & Interaction Blueprints
- **Top Header**: Persistent station identifier (`STN SNT-44`), Eastern Time stamp, live beacon dot, and `SRC · AGGREGATED POLLSTERS & PREDICTION MARKETS` chip.
- **Primary Visual Area**: High-density instrument rendering utilizing the `Dashboard` pattern.
- **Interactive Hotspots**: Direct drill-down targets to companion detail sheets and return breadcrumb.

---

## 45. `SNT-DTL-01` — Issue Sentiment Multi-Methodology

**Tag Header**: `SNT-DTL-01 · Issue Sentiment Multi-Methodology · Detail · Drill down, Compare · J4-7 · Desktop`

| Specification Attribute | Detail / Configuration |
|---|---|
| **Screen ID** | `SNT-DTL-01` |
| **Module** | **SNT** (Sentiment) |
| **Screen Pattern Type** | **DTL** (Detail) |
| **User Functions** | Drill down, Compare |
| **Journey & Step** | `J4-7` (J4 — Breaking News Shockwave) |
| **Platform & Viewport** | **Desktop** (1440×900 px, 8px Base Grid) |
| **Liveness Protocol** | `MULTI-SOURCE · 06:00:14 ET` |
| **Data Provenance** | `SRC · INDEPENDENT POLLING INDEX & KALSHI / POLYMARKET` |
| **Quality Badge** | `SAMPLE DATA` (Neutral / Non-Partisan) |

### Functional Purpose & Description
Transparent side-by-side evidence comparison: scientific probability sample polls (sample size n, margin of error ±3.1%, methodology), prediction market trading odds, and social sentiment velocity.

### Mandatory Content Requirements (Must Show)
> Polls (with n, MoE, method), prediction markets, social volume — shown side by side, never blended without disclosure.

### Sample Realistic Data Payload
```json
{
  "screen_id": "SNT-DTL-01",
  "status": "VERIFIED_ACTIVE",
  "telemetry": "MULTI-SOURCE · 06:00:14 ET",
  "provenance": "SRC · INDEPENDENT POLLING INDEX & KALSHI / POLYMARKET",
  "active_payload": "Issue: Rural Broadband Investment · Polls: 64% Favor (n=1,850, MoE ±2.8%) · Prediction: 88% enactment probability · Social: 412k posts (71% positive)."
}
```

### Layout & Interaction Blueprints
- **Top Header**: Persistent station identifier (`STN SNT-45`), Eastern Time stamp, live beacon dot, and `SRC · INDEPENDENT POLLING INDEX & KALSHI / POLYMARKET` chip.
- **Primary Visual Area**: High-density instrument rendering utilizing the `Detail` pattern.
- **Interactive Hotspots**: Direct drill-down targets to companion detail sheets and return breadcrumb.

---

## 46. `ELX-DSH-01` — Race Center & Balance of Power

**Tag Header**: `ELX-DSH-01 · Race Center & Balance of Power · Dashboard · Monitor, Explore · J7-1 · Desktop`

| Specification Attribute | Detail / Configuration |
|---|---|
| **Screen ID** | `ELX-DSH-01` |
| **Module** | **ELX** (Elections) |
| **Screen Pattern Type** | **DSH** (Dashboard) |
| **User Functions** | Monitor, Explore |
| **Journey & Step** | `J7-1` (J7 — Election Night) |
| **Platform & Viewport** | **Desktop** (1440×900 px, 8px Base Grid) |
| **Liveness Protocol** | `UPD · 06:00:14 ET` |
| **Data Provenance** | `SRC · COOK POLITICAL REPORT & AP CAMPAIGN REPOSITORY` |
| **Quality Badge** | `SAMPLE DATA` (Neutral / Non-Partisan) |

### Functional Purpose & Description
Election command deck: House, Senate, and Gubernatorial balance-of-power segmented bars with 218/51 majority markers, key battleground races table, rating change alerts, and campaign fundraising meters.

### Mandatory Content Requirements (Must Show)
> House/Senate/Governor balance bars, key races list, ratings changes, fundraising.

### Sample Realistic Data Payload
```json
{
  "screen_id": "ELX-DSH-01",
  "status": "VERIFIED_ACTIVE",
  "telemetry": "UPD · 06:00:14 ET",
  "provenance": "SRC · COOK POLITICAL REPORT & AP CAMPAIGN REPOSITORY",
  "active_payload": "Senate: 49 Dem / 49 Rep / 2 Tossup · House: 214 Dem / 216 Rep / 5 Tossup · 12 Key Races highlighted · Rating: MI-Sen shifted Tossup -> Lean D."
}
```

### Layout & Interaction Blueprints
- **Top Header**: Persistent station identifier (`STN ELX-46`), Eastern Time stamp, live beacon dot, and `SRC · COOK POLITICAL REPORT & AP CAMPAIGN REPOSITORY` chip.
- **Primary Visual Area**: High-density instrument rendering utilizing the `Dashboard` pattern.
- **Interactive Hotspots**: Direct drill-down targets to companion detail sheets and return breadcrumb.

---

## 47. `ELX-MAP-01` — Election Night Big Board (Wall & Touch)

**Tag Header**: `ELX-MAP-01 · Election Night Big Board (Wall & Touch) · Map · Monitor, Drill down · J7-2 · Wall Mode`

| Specification Attribute | Detail / Configuration |
|---|---|
| **Screen ID** | `ELX-MAP-01` |
| **Module** | **ELX** (Elections) |
| **Screen Pattern Type** | **MAP** (Map) |
| **User Functions** | Monitor, Drill down |
| **Journey & Step** | `J7-2` (J7 — Election Night) |
| **Platform & Viewport** | **Wall Mode** (1920×1080 px, 8px Base Grid) |
| **Liveness Protocol** | `LIVE ELECTION NIGHT · 22:42:15 ET` |
| **Data Provenance** | `SRC · ASSOCIATED PRESS ELECTION WIRE & EDISON RESEARCH` |
| **Quality Badge** | `SAMPLE DATA` (Neutral / Non-Partisan) |

### Functional Purpose & Description
Wall-mode big board map with touch-drill from national to state to county: balance-of-power bars, '% expected vote in' gauge, race-call status chips (CALLED, TOO EARLY, TOO CLOSE, LEADING), county delta vs prior cycle, and 'where remaining votes are' drawer.

### Mandatory Content Requirements (Must Show)
> See §6.4: Touch-drill national->county, balance-of-power bars, % expected vote in, race-call status chips, county comparison, remaining votes panel.

### Sample Realistic Data Payload
```json
{
  "screen_id": "ELX-MAP-01",
  "status": "VERIFIED_ACTIVE",
  "telemetry": "LIVE ELECTION NIGHT · 22:42:15 ET",
  "provenance": "SRC · ASSOCIATED PRESS ELECTION WIRE & EDISON RESEARCH",
  "active_payload": "National Big Board: MI Called (D+2.4%), PA Leading R (+12,410 votes, 84% in), WI Too Close to Call · Outstanding votes: Wayne Co mail ballots."
}
```

### Layout & Interaction Blueprints
- **Top Header**: Persistent station identifier (`STN ELX-47`), Eastern Time stamp, live beacon dot, and `SRC · ASSOCIATED PRESS ELECTION WIRE & EDISON RESEARCH` chip.
- **Primary Visual Area**: High-density instrument rendering utilizing the `Map` pattern.
- **Interactive Hotspots**: Direct drill-down targets to companion detail sheets and return breadcrumb.

---

## 48. `ELX-DTL-01` — Key Race Detail & Vote Tabulation

**Tag Header**: `ELX-DTL-01 · Key Race Detail & Vote Tabulation · Detail · Drill down, Explore · J7-4 · Desktop`

| Specification Attribute | Detail / Configuration |
|---|---|
| **Screen ID** | `ELX-DTL-01` |
| **Module** | **ELX** (Elections) |
| **Screen Pattern Type** | **DTL** (Detail) |
| **User Functions** | Drill down, Explore |
| **Journey & Step** | `J7-4` (J7 — Election Night) |
| **Platform & Viewport** | **Desktop** (1440×900 px, 8px Base Grid) |
| **Liveness Protocol** | `LIVE TABULATION · 22:42:15 ET` |
| **Data Provenance** | `SRC · MICHIGAN SECRETARY OF STATE ELECTION DIVISION` |
| **Quality Badge** | `SAMPLE DATA` (Neutral / Non-Partisan) |

### Functional Purpose & Description
Individual contest dissection: candidate head-to-head cards, raw vote counts and percentages, % expected vote reported gauge, county-by-county returns choropleth, race-call status, and vote-type breakdown (Election Day, Mail/Absentee, Early In-Person).

### Mandatory Content Requirements (Must Show)
> Candidates (fictional), vote counts, % expected in, county map, call status, vote-type breakdown.

### Sample Realistic Data Payload
```json
{
  "screen_id": "ELX-DTL-01",
  "status": "VERIFIED_ACTIVE",
  "telemetry": "LIVE TABULATION · 22:42:15 ET",
  "provenance": "SRC · MICHIGAN SECRETARY OF STATE ELECTION DIVISION",
  "active_payload": "MI Senate 2026: Elena Vance [D] 2,412,890 (50.8%) vs Tyler Brooks [R] 2,334,102 (49.2%) · 94% Expected Vote In · Call: LEADING D."
}
```

### Layout & Interaction Blueprints
- **Top Header**: Persistent station identifier (`STN ELX-48`), Eastern Time stamp, live beacon dot, and `SRC · MICHIGAN SECRETARY OF STATE ELECTION DIVISION` chip.
- **Primary Visual Area**: High-density instrument rendering utilizing the `Detail` pattern.
- **Interactive Hotspots**: Direct drill-down targets to companion detail sheets and return breadcrumb.

---

## 49. `ELX-BLD-01` — Path to Majority Simulator

**Tag Header**: `ELX-BLD-01 · Path to Majority Simulator · Builder/Filter · Explore, Configure · J7-5 · Desktop`

| Specification Attribute | Detail / Configuration |
|---|---|
| **Screen ID** | `ELX-BLD-01` |
| **Module** | **ELX** (Elections) |
| **Screen Pattern Type** | **BLD** (Builder/Filter) |
| **User Functions** | Explore, Configure |
| **Journey & Step** | `J7-5` (J7 — Election Night) |
| **Platform & Viewport** | **Desktop** (1440×900 px, 8px Base Grid) |
| **Liveness Protocol** | `INTERACTIVE SIMULATOR` |
| **Data Provenance** | `SRC · CIVIC RADAR SCENARIO ENGINE` |
| **Quality Badge** | `SAMPLE DATA` (Neutral / Non-Partisan) |

### Functional Purpose & Description
Interactive chamber math scenario planner: toggle uncalled tossup seats to Dem or Rep, recalculate seats needed for majority in real time, lock confirmed calls, and save customized scenario outcomes.

### Mandatory Content Requirements (Must Show)
> Toggle uncalled races, live seat math, scenarios saved.

### Sample Realistic Data Payload
```json
{
  "screen_id": "ELX-BLD-01",
  "status": "VERIFIED_ACTIVE",
  "telemetry": "INTERACTIVE SIMULATOR",
  "provenance": "SRC · CIVIC RADAR SCENARIO ENGINE",
  "active_payload": "Senate Simulator: Baseline 49 D / 49 R · User scenario: Vance wins MI (+1 D), Brooks wins OH (+1 R) -> 50-50 tiebreaker to VP."
}
```

### Layout & Interaction Blueprints
- **Top Header**: Persistent station identifier (`STN ELX-49`), Eastern Time stamp, live beacon dot, and `SRC · CIVIC RADAR SCENARIO ENGINE` chip.
- **Primary Visual Area**: High-density instrument rendering utilizing the `Builder/Filter` pattern.
- **Interactive Hotspots**: Direct drill-down targets to companion detail sheets and return breadcrumb.

---

## 50. `PPL-SRC-01` — Find My Officials (Address Lookup)

**Tag Header**: `PPL-SRC-01 · Find My Officials (Address Lookup) · Search · Search, Explore · J10-1 · Desktop`

| Specification Attribute | Detail / Configuration |
|---|---|
| **Screen ID** | `PPL-SRC-01` |
| **Module** | **PPL** (People) |
| **Screen Pattern Type** | **SRC** (Search) |
| **User Functions** | Search, Explore |
| **Journey & Step** | `J10-1` (J10 — Know Your Government) |
| **Platform & Viewport** | **Desktop** (1440×900 px, 8px Base Grid) |
| **Liveness Protocol** | `RECORD VERIFIED` |
| **Data Provenance** | `SRC · GOOGLE CIVIC API & CENSUS GEOCODER` |
| **Quality Badge** | `SAMPLE DATA` (Neutral / Non-Partisan) |

### Functional Purpose & Description
Address search input geocoding to federal, state, and local representative cards: House representative, two Senators, Governor, and state legislative delegates with interactive district boundaries.

### Mandatory Content Requirements (Must Show)
> Address input, map, federal + state officials list.

### Sample Realistic Data Payload
```json
{
  "screen_id": "PPL-SRC-01",
  "status": "VERIFIED_ACTIVE",
  "telemetry": "RECORD VERIFIED",
  "provenance": "SRC · GOOGLE CIVIC API & CENSUS GEOCODER",
  "active_payload": "Address: '48226 Detroit MI' -> Rep. Brenda Chen [D-MI-13], Sen. Elena Vance [D-MI], Sen. Gary Peters [D-MI], Gov. Gretchen Whitmer [D]."
}
```

### Layout & Interaction Blueprints
- **Top Header**: Persistent station identifier (`STN PPL-50`), Eastern Time stamp, live beacon dot, and `SRC · GOOGLE CIVIC API & CENSUS GEOCODER` chip.
- **Primary Visual Area**: High-density instrument rendering utilizing the `Search` pattern.
- **Interactive Hotspots**: Direct drill-down targets to companion detail sheets and return breadcrumb.

---

## 51. `PPL-DTL-01` — Official Profile & Voting Record

**Tag Header**: `PPL-DTL-01 · Official Profile & Voting Record · Detail · Drill down, Explore · J3-7 · Desktop`

| Specification Attribute | Detail / Configuration |
|---|---|
| **Screen ID** | `PPL-DTL-01` |
| **Module** | **PPL** (People) |
| **Screen Pattern Type** | **DTL** (Detail) |
| **User Functions** | Drill down, Explore |
| **Journey & Step** | `J3-7` (J3 — Follow a Bill to the President's Desk) |
| **Platform & Viewport** | **Desktop** (1440×900 px, 8px Base Grid) |
| **Liveness Protocol** | `PROFILE ACTIVE · 06:00:14 ET` |
| **Data Provenance** | `SRC · CONGRESS.GOV & FEC DISCLOSURES` |
| **Quality Badge** | `SAMPLE DATA` (Neutral / Non-Partisan) |

### Functional Purpose & Description
Comprehensive elected official dossier: party affiliation glyph, district vector map, committee chairmanships/assignments, sponsored legislation portfolio, 100-vote history heatmap, party-unity dial gauge, and campaign fundraising sparkline.

### Mandatory Content Requirements (Must Show)
> Party, district map, committee seats, sponsored bills, vote history heatmap, party-unity gauge, fundraising sparkline.

### Sample Realistic Data Payload
```json
{
  "screen_id": "PPL-DTL-01",
  "status": "VERIFIED_ACTIVE",
  "telemetry": "PROFILE ACTIVE · 06:00:14 ET",
  "provenance": "SRC · CONGRESS.GOV & FEC DISCLOSURES",
  "active_payload": "Sen. Elena Vance [D-MI] · Party Unity: 92% · Committees: Commerce, Science & Transportation · Sponsored: 14 bills (3 enacted) · Raised: $14.2M."
}
```

### Layout & Interaction Blueprints
- **Top Header**: Persistent station identifier (`STN PPL-51`), Eastern Time stamp, live beacon dot, and `SRC · CONGRESS.GOV & FEC DISCLOSURES` chip.
- **Primary Visual Area**: High-density instrument rendering utilizing the `Detail` pattern.
- **Interactive Hotspots**: Direct drill-down targets to companion detail sheets and return breadcrumb.

---

## 52. `PPL-CMP-01` — Compare Officials (Vote Agreement Matrix)

**Tag Header**: `PPL-CMP-01 · Compare Officials (Vote Agreement Matrix) · Comparison · Compare, Drill down · J8-3 · Desktop`

| Specification Attribute | Detail / Configuration |
|---|---|
| **Screen ID** | `PPL-CMP-01` |
| **Module** | **PPL** (People) |
| **Screen Pattern Type** | **CMP** (Comparison) |
| **User Functions** | Compare, Drill down |
| **Journey & Step** | `J8-3` (J8 — Power Screener) |
| **Platform & Viewport** | **Desktop** (1440×900 px, 8px Base Grid) |
| **Liveness Protocol** | `CALCULATED INDEX` |
| **Data Provenance** | `SRC · CONGRESSIONAL VOTE MATRIX ANALYZER` |
| **Quality Badge** | `SAMPLE DATA` (Neutral / Non-Partisan) |

### Functional Purpose & Description
Multi-official head-to-head comparison: 2 to 4 legislators side by side, pairwise vote agreement percentage matrix, key divergent roll-calls, committee overlaps, and campaign donor industry breakdown.

### Mandatory Content Requirements (Must Show)
> 2–4 side-by-side with vote agreement matrix.

### Sample Realistic Data Payload
```json
{
  "screen_id": "PPL-CMP-01",
  "status": "VERIFIED_ACTIVE",
  "telemetry": "CALCULATED INDEX",
  "provenance": "SRC · CONGRESSIONAL VOTE MATRIX ANALYZER",
  "active_payload": "Sen. Elena Vance [D-MI] vs Sen. Robert Sterling [R-OH]: 64% Overall Agreement, 88% Agreement on Infrastructure, Diverged on Tax Reconciliation."
}
```

### Layout & Interaction Blueprints
- **Top Header**: Persistent station identifier (`STN PPL-52`), Eastern Time stamp, live beacon dot, and `SRC · CONGRESSIONAL VOTE MATRIX ANALYZER` chip.
- **Primary Visual Area**: High-density instrument rendering utilizing the `Comparison` pattern.
- **Interactive Hotspots**: Direct drill-down targets to companion detail sheets and return breadcrumb.

---

## 53. `SCR-BLD-01` — Finviz-Style Screener Builder

**Tag Header**: `SCR-BLD-01 · Finviz-Style Screener Builder · Builder/Filter · Configure, Search, Explore · J8-1 · Desktop`

| Specification Attribute | Detail / Configuration |
|---|---|
| **Screen ID** | `SCR-BLD-01` |
| **Module** | **SCR** (Screener & Alerts) |
| **Screen Pattern Type** | **BLD** (Builder/Filter) |
| **User Functions** | Configure, Search, Explore |
| **Journey & Step** | `J8-1` (J8 — Power Screener) |
| **Platform & Viewport** | **Desktop** (1440×900 px, 8px Base Grid) |
| **Liveness Protocol** | `PARAMETRIC ENGINE` |
| **Data Provenance** | `SRC · QUERY COMPOSER ENGINE` |
| **Quality Badge** | `SAMPLE DATA` (Neutral / Non-Partisan) |

### Functional Purpose & Description
Multi-entity Finviz-style parametric query builder: entity selector (Bills, Officials, Cases, Districts, Races, Rules), filter chips, numeric range sliders (cosponsors >25, bipartisan index >0.70, days stalled >60), column picker, and 4 quick presets.

### Mandatory Content Requirements (Must Show)
> Entity selector, filter chips, numeric sliders, column picker, presets ('Bipartisan bills moving fast', 'Stalled appropriations', 'Close House races', 'Votes against party').

### Sample Realistic Data Payload
```json
{
  "screen_id": "SCR-BLD-01",
  "status": "VERIFIED_ACTIVE",
  "telemetry": "PARAMETRIC ENGINE",
  "provenance": "SRC · QUERY COMPOSER ENGINE",
  "active_payload": "Entity: Bills · Preset: 'Bipartisan bills moving fast' · Filters: Cosponsors >= 30, BPI >= 0.75, Stage: Reported or Floor."
}
```

### Layout & Interaction Blueprints
- **Top Header**: Persistent station identifier (`STN SCR-53`), Eastern Time stamp, live beacon dot, and `SRC · QUERY COMPOSER ENGINE` chip.
- **Primary Visual Area**: High-density instrument rendering utilizing the `Builder/Filter` pattern.
- **Interactive Hotspots**: Direct drill-down targets to companion detail sheets and return breadcrumb.

---

## 54. `SCR-LST-01` — Screener Results Table

**Tag Header**: `SCR-LST-01 · Screener Results Table · List/Table · Track, Compare, Share/Export · J8-2 · Desktop`

| Specification Attribute | Detail / Configuration |
|---|---|
| **Screen ID** | `SCR-LST-01` |
| **Module** | **SCR** (Screener & Alerts) |
| **Screen Pattern Type** | **LST** (List/Table) |
| **User Functions** | Track, Compare, Share/Export |
| **Journey & Step** | `J8-2` (J8 — Power Screener) |
| **Platform & Viewport** | **Desktop** (1440×900 px, 8px Base Grid) |
| **Liveness Protocol** | `LIVE TABLE · 06:00:14 ET` |
| **Data Provenance** | `SRC · SCREENER RESULTS CACHE` |
| **Quality Badge** | `SAMPLE DATA` (Neutral / Non-Partisan) |

### Functional Purpose & Description
Dense tabular output of active query: sortable columns, inline progress sparklines, multi-row selection, CSV/JSON export trigger, and 'Open on Map' action.

### Mandatory Content Requirements (Must Show)
> Dense table with sparklines, sort, export, 'open on map'.

### Sample Realistic Data Payload
```json
{
  "screen_id": "SCR-LST-01",
  "status": "VERIFIED_ACTIVE",
  "telemetry": "LIVE TABLE · 06:00:14 ET",
  "provenance": "SRC · SCREENER RESULTS CACHE",
  "active_payload": "18 bills matched query: H.R. 4821 (#1 rank, 48 cosponsors, BPI 0.88), S. 2104 (#2 rank), H.R. 3110 (#3 rank) · Export button ready."
}
```

### Layout & Interaction Blueprints
- **Top Header**: Persistent station identifier (`STN SCR-54`), Eastern Time stamp, live beacon dot, and `SRC · SCREENER RESULTS CACHE` chip.
- **Primary Visual Area**: High-density instrument rendering utilizing the `List/Table` pattern.
- **Interactive Hotspots**: Direct drill-down targets to companion detail sheets and return breadcrumb.

---

## 55. `SCR-LST-02` — Saved Screens & Watchlists

**Tag Header**: `SCR-LST-02 · Saved Screens & Watchlists · List/Table · Track, Configure · J8-5 · Desktop`

| Specification Attribute | Detail / Configuration |
|---|---|
| **Screen ID** | `SCR-LST-02` |
| **Module** | **SCR** (Screener & Alerts) |
| **Screen Pattern Type** | **LST** (List/Table) |
| **User Functions** | Track, Configure |
| **Journey & Step** | `J8-5` (J8 — Power Screener) |
| **Platform & Viewport** | **Desktop** (1440×900 px, 8px Base Grid) |
| **Liveness Protocol** | `SAVED WATCHLISTS` |
| **Data Provenance** | `SRC · USER REPOSITORY` |
| **Quality Badge** | `SAMPLE DATA` (Neutral / Non-Partisan) |

### Functional Purpose & Description
User dashboard of saved queries and entity watchlists: change counters since last session, trigger frequency, active alert toggles, and shared screen links.

### Mandatory Content Requirements (Must Show)
> Watchlists with change counts since last visit.

### Sample Realistic Data Payload
```json
{
  "screen_id": "SCR-LST-02",
  "status": "VERIFIED_ACTIVE",
  "telemetry": "SAVED WATCHLISTS",
  "provenance": "SRC · USER REPOSITORY",
  "active_payload": "4 Saved Screens: 'Bipartisan Fast-Track' (+3 new items), 'Approps Watch' (+1 item), 'Key 2026 Senate Races' (no changes), 'SCOTUS IP Cases'."
}
```

### Layout & Interaction Blueprints
- **Top Header**: Persistent station identifier (`STN SCR-55`), Eastern Time stamp, live beacon dot, and `SRC · USER REPOSITORY` chip.
- **Primary Visual Area**: High-density instrument rendering utilizing the `List/Table` pattern.
- **Interactive Hotspots**: Direct drill-down targets to companion detail sheets and return breadcrumb.

---

## 56. `SCR-BLD-02` — Alert Rule Builder (IF/THEN)

**Tag Header**: `SCR-BLD-02 · Alert Rule Builder (IF/THEN) · Builder/Filter · Configure, Alert · J5-6 · Desktop`

| Specification Attribute | Detail / Configuration |
|---|---|
| **Screen ID** | `SCR-BLD-02` |
| **Module** | **SCR** (Screener & Alerts) |
| **Screen Pattern Type** | **BLD** (Builder/Filter) |
| **User Functions** | Configure, Alert |
| **Journey & Step** | `J5-6` (J5 — Shutdown Watch) |
| **Platform & Viewport** | **Desktop** (1440×900 px, 8px Base Grid) |
| **Liveness Protocol** | `RULE COMPOSER` |
| **Data Provenance** | `SRC · RULE EVALUATION ENGINE` |
| **Quality Badge** | `SAMPLE DATA` (Neutral / Non-Partisan) |

### Functional Purpose & Description
Rule composer for automated alerting: IF [Entity = Appropriations] AND [Days to Lapse <= 1] AND [CR Status = None] THEN [Dispatch Critical Push Notification], with historical 30-day simulated trigger backtest.

### Mandatory Content Requirements (Must Show)
> IF/THEN rule composer, preview of last 30 days of triggers.

### Sample Realistic Data Payload
```json
{
  "screen_id": "SCR-BLD-02",
  "status": "VERIFIED_ACTIVE",
  "telemetry": "RULE COMPOSER",
  "provenance": "SRC · RULE EVALUATION ENGINE",
  "active_payload": "Rule: 'Notify me when appropriations funding passes' · IF [Bill Type = Appropriations] AND [Action = Signed by President] THEN [Push Alert] · Backtest: 2 triggers in 30d."
}
```

### Layout & Interaction Blueprints
- **Top Header**: Persistent station identifier (`STN SCR-56`), Eastern Time stamp, live beacon dot, and `SRC · RULE EVALUATION ENGINE` chip.
- **Primary Visual Area**: High-density instrument rendering utilizing the `Builder/Filter` pattern.
- **Interactive Hotspots**: Direct drill-down targets to companion detail sheets and return breadcrumb.

---

