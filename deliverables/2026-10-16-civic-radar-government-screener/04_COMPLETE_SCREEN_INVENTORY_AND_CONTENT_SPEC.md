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
