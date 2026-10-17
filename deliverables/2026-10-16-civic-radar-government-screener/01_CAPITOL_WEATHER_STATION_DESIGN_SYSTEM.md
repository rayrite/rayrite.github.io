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
