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
