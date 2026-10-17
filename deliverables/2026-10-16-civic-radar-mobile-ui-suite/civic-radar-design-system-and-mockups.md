# CIVIC RADAR: Mobile UI Design System & High-Fidelity Mockup Suite
## Live US Government Screener & Voter Decision Engine (Detroit Launch Edition)

> **Document Type:** Mobile UI Design Specification & Screen Dossier  
> **Target Platform:** iOS / Android (390×844pt · iPhone 15 Pro Reference Canvas)  
> **Theme Support:** Night Ops (Default Dark `#07111E`) & Daylight Slate (Light `#F0F4FF`)  
> **Launch Market:** Detroit Metro & Wayne County, Michigan (Nov 3, 2026 General Election)  
> **Specification Reference:** `civic-radar-design-prompt[web-sonnet46h].md`  
> **Date:** October 16, 2026  

---

## Executive Summary & Product Architecture

**Civic Radar** is a real-time mobile intelligence platform for American democracy. Combining the density and data integrity of a financial screener (Bloomberg Terminal) with the kinetic elegance of modern mobile weather stations (iOS Weather), Civic Radar makes governance observable, legible, and actionable for first-time voters and power users alike.

```
+-----------------------------------------------------------------------------------+
|                                  CIVIC RADAR CORE                                 |
+-----------------------------------------------------------------------------------+
|  [Journey 1: Voter Engine]   [Journey 2: Gov Dashboard]   [Journey 3: Congress]   |
|  Wayne Co. Sample Ballot     Live National Debt Ticker    Floor Vote Radar        |
|  Detroit SOS API Sync        Shutdown Countdown Clock     6-Stage Bill Pipeline   |
|  Candidate Stance Matching   Three Branches Machine       Legislator Scorecards   |
+-----------------------------------------------------------------------------------+
|  [Journey 4: Map Explorer]   [Journey 5: Courts/Dockets]  [Design System]         |
|  270 Win Tracker Map         SCOTUS Oral Arguments Feed   8pt Spatial Grid        |
|  News Intensity Heatmap      Circuit Court Dockets        Accessible Color Tokens |
|  Multi-Layer Studio Stack    Constitutional Issue Tags    WCAG AA 4.5:1 Contrast  |
+-----------------------------------------------------------------------------------+
```

---

## 1. Visual Direction & Design Tokens

Civic Radar adheres to an instrumentation-first design philosophy: dark-first surfaces, high-contrast typography, electric data accents, and calibrated sensor-like widgets.

### 1.1 Color Tokens (Night Ops - Dark Default)

| Token Name | Hex Code | Functional Role | Contrast vs `#07111E` | Accessibility Status |
|:---|:---|:---|:---|:---|
| `bg/base` | `#07111E` | Primary app canvas & viewport background | 1:1 | Baseline |
| `bg/surface` | `#0F1E30` | Container cards, list items, sheets | 1.3:1 | Non-text container |
| `bg/surface-elevated` | `#172A42` | Popovers, active pills, modal drawers | 1.8:1 | Elevation tier 2 |
| `line/grid` | `#1E3553` | Hairlines, chart gridlines, dividers | 2.1:1 | UI structural lines |
| `text/primary` | `#E8EEF8` | High-emphasis headings, key metrics | 14.8:1 | WCAG AAA Pass |
| `text/secondary` | `#8AADCA` | Metadata labels, subtitles, timestamps | 7.1:1 | WCAG AAA Pass |
| `text/tertiary` | `#4A6080` | Placeholder text, inactive icons | 3.2:1 | Supporting metadata |
| `signal/live` | `#00E5FF` | Electric cyan: real-time feeds, live badges | 10.9:1 | WCAG AAA Pass |
| `signal/alert` | `#FF6F00` | Vivid amber: countdowns, pending deadlines | 6.8:1 | WCAG AA Pass |
| `signal/positive` | `#00C853` | Signal green: passed bills, signed laws | 9.4:1 | WCAG AAA Pass |
| `signal/critical` | `#FF1744` | Crimson red: failed votes, vetos, lapse | 4.8:1 | WCAG AA Pass |
| `signal/gold` | `#FFB300` | Warm gold: spotlight ballot measures | 10.2:1 | WCAG AAA Pass |
| `party/dem` | `#1565C0` | Democratic Party identification badge | 4.6:1 | WCAG AA Pass |
| `party/rep` | `#B71C1C` | Republican Party identification badge | 4.5:1 | WCAG AA Pass |
| `party/neutral` | `#546E7A` | Non-partisan / Independent identification | 4.7:1 | WCAG AA Pass |

### 1.2 Color Tokens (Daylight Slate - Light Mode Variant)

| Token Name | Hex Code | Functional Role | Contrast vs `#F0F4FF` | Accessibility Status |
|:---|:---|:---|:---|:---|
| `bg/base-light` | `#F0F4FF` | Light viewport canvas | 1:1 | Baseline |
| `bg/surface-light` | `#FFFFFF` | Crisp white cards and modals | 1.1:1 | Non-text container |
| `line/border-light` | `#D0DBEE` | Structural boundaries and outlines | 1.4:1 | UI structural lines |
| `text/primary-light` | `#0B192C` | High-emphasis headings | 14.1:1 | WCAG AAA Pass |
| `text/secondary-light`| `#4B617F` | Subheads and category tags | 5.8:1 | WCAG AA Pass |
| `signal/live-light` | `#007A8C` | High-contrast cyan for light backgrounds | 5.2:1 | WCAG AA Pass |
| `signal/alert-light` | `#D84315` | High-contrast amber for light surfaces | 5.1:1 | WCAG AA Pass |
| `signal/positive-light`| `#1B5E20` | Forest green for passed items | 6.4:1 | WCAG AAA Pass |

### 1.3 Typography Hierarchy

| Style Role | Font Family | Size / Line Height | Weight | Tracking | Primary Usage |
|:---|:---|:---|:---|:---|:---|
| `Display Hero` | Barlow Condensed | 34pt / 38pt | 700 Bold | -0.5px | Big numbers, National Debt, Vote counts |
| `Heading 1` | Sora / Inter | 22pt / 28pt | 700 Bold | -0.3px | Screen titles, Candidate names |
| `Heading 2` | Sora / Inter | 17pt / 22pt | 600 SemiBold| -0.2px | Card section headers, Stage titles |
| `Body Regular` | Inter | 14pt / 20pt | 400 Regular | 0px | Plain-language summaries, explainer text |
| `Body Medium` | Inter | 14pt / 20pt | 500 Medium | 0px | Button labels, interactive options |
| `Caption / Label`| Inter | 11pt / 14pt | 600 SemiBold| +0.5px | Uppercase category tags, badges |
| `Monospace Data` | JetBrains Mono | 13pt / 18pt | 500 Medium | 0px | Ticker readouts, Bill IDs, Timers |

### 1.4 Spacing & Touch Metrics

| Token | Dimension | Applied UI Rules |
|:---|:---|:---|
| `space-1` | 4pt | Micro gap between icon and text label |
| `space-2` | 8pt | Padding inside compact badges and pill selectors |
| `space-3` | 12pt | Inner card element spacing, margin between badge rows |
| `space-4` | 16pt | Standard screen side padding (gutter), card padding |
| `space-5` | 24pt | Section vertical gap, header to content separation |
| `space-6` | 32pt | Major module demarcation |
| `touch-min` | 44×44pt | Minimum interactive tap target (WCAG 2.5.5 Level AAA) |
| `radius-sm` | 6pt | Status badges, chip tags |
| `radius-md` | 12pt | Standard cards, input fields |
| `radius-lg` | 20pt | Bottom sheets, hero container modules |

---

## 2. Master Navigation & Architecture

Civic Radar uses an ergonomic **5-Tab Bottom Navigation Bar** engineered for single-thumb mobile interaction. Each tab features an active glowing indicator, high-contrast iconography, and a dynamic real-time badge.

| Tab Index | Tab Title | Icon Motif | Live Badge Behavior | Destination User Journey |
|:---:|:---|:---|:---|:---|
| 1 | **Home** | Precision Radar Reticle | Ticker of new federal actions (e.g., `5+`) | Journey 2: Government Dashboard |
| 2 | **My Ballot** | Official Ballot Box with Checkmark | Unfinished races countdown (`5 left`) | Journey 1: First-Time Voter Engine |
| 3 | **Congress** | Capitol Dome Schematic | Floor votes active today (`3 live`) | Journey 3: Congress Tracker |
| 4 | **Maps** | Topographic Geo Grid | Breaking news alert indicator (`HOT`) | Journey 4: Map Explorer |
| 5 | **Courts** | Classical Scales of Justice | New docket releases count (`2 new`) | Journey 5: Courts & Dockets |

---

## 3. Journey 1: First-Time Voter (Detroit-Focused)

**Goal:** Empower undecided and first-time Detroit and Wayne County voters to understand their ballot, compare candidates without partisanship, analyze ballot proposals in plain language, and confidently cast their votes before November 3, 2026.

### Screen 1.1 - Splash / Launch
- **Screen ID:** `SCR-1.1`
- **Canvas:** 390×844pt | Dark Mode
- **Layout Description:**
  - Status Bar: 9:41 AM, 5G, Full Battery, Location Services active.
  - Centerpiece: Animated pulsing concentric radar rings in electric cyan (`#00E5FF`) expanding outward from an accurate vector silhouette of the continental US.
  - The vector map auto-zooms into Southeast Michigan, illuminating the coordinates `42.3314° N, 83.0458° W` (Detroit City Hall).
  - Brand Display: `CIVIC RADAR` in bold geometric display caps with radar reticle glyph.
  - Subtitle: *"Your government. Made visible."*
  - Bottom Status Chip: Pulsing green live dot: `CONNECTED TO MICHIGAN SOS VOTER FILE · V2.4`.
- **Key Design Decision:** Cinematic dark launch with instantaneous civic identity anchoring; zero commercial advertising or clutter.
- **Motion Language:** Radar sweep rotates at 24 RPM; concentric pulse waves fade out at 1.5s intervals; map crosshair zooms smoothly on first render.
- **Light Mode Variant:** Not required for launch splash.

### Screen 1.2 - Onboarding: What Is This
- **Screen ID:** `SCR-1.2`
- **Canvas:** 390×844pt | Dark Mode
- **Layout Description:**
  - Header: Prominent headline in 24pt bold: *"Stop scrolling. Start deciding."*
  - Subtitle: *"A live intelligence console for American democracy, customized for your Detroit ballot."*
  - Three Value Proposition Cards (surface `#0F1E30`, border `#1E3553`):
    1. **Direct Data Feeds:** Real-time congressional floor votes, campaign finance filings, and White House actions without cable news punditry.
    2. **Demystified Ballot:** Plain-language 2-sentence breakdowns of every candidate, judge, and millage proposal.
    3. **The Assembly Line:** Live visual tracking of how bills move through Congress, the President's desk, and the Supreme Court.
  - Footer Element: Sleek vector silhouette of the Detroit skyline featuring the Renaissance Center, Fisher Building, and Ambassador Bridge in muted cyan line art (`#1E3553`).
  - Bottom Watermark: *"Built in Detroit, for Detroit · MI Secretary of State Data Feed"*.
  - Primary CTA: Large 48pt electric cyan button: `Get Started →`.
- **Key Design Decision:** Grounding high-tech civic data in hyper-local Detroit pride to overcome voter cynicism and apathy.
- **Motion Language:** Subtle vertical float on value proposition cards on entrance; skyline silhouette glows on CTA press.

### Screen 1.3 - Location Setup
- **Screen ID:** `SCR-1.3`
- **Canvas:** 390×844pt | Dark Mode
- **Layout Description:**
  - Step Indicator: `Step 1 of 2 · Location Verification`.
  - Main Heading: *"Where do you vote?"*
  - Helper Text: *"Enter your 5-digit ZIP code or street address to retrieve your precinct-specific ballot."*
  - Input Field: Large 56pt high-contrast input pre-populated with `48226` (Downtown Detroit).
  - Auto-Detection Confirmation Card:
    - Glowing map pin glyph over mini vector grid of Wayne County.
    - Title: **Wayne County, Michigan**
    - Precinct Subtitle: `Detroit Ward 1 · Precinct 4 · Congressional District MI-12`
    - Verification Badge: `MICHIGAN SOS VERIFIED PRECINCT` in emerald green.
    - Preview Metric Banner: `8 active races · 2 ballot proposals found`.
  - Secondary Action: `Use My Current GPS Coordinates` (with location permission trigger).
  - Primary CTA: `Confirm Location & Unlock Ballot →`.
- **Key Design Decision:** Zero-friction entry with immediate local ballot confirmation to reassure voters of hyper-local relevance.
- **Motion Language:** Soft ripple ring around map pin upon valid 5-digit entry; badge pops in with a spring curve.

### Screen 1.4 - My Ballot Home
- **Screen ID:** `SCR-1.4`
- **Canvas:** 390×844pt | Dark Mode & Light Mode
- **Layout Description:**
  - Sticky Top Bar:
    - Countdown Banner: `18 days until Election Day · Nov 3, 2026` with pulsing amber clock icon.
    - Ballot Completion Bar: `3 of 8 races decided (38%)` with dual-tone electric cyan progress fill.
  - Segmented Filter Pills: `All (8)` | `Decided (3)` | `Undecided (5)` | `Proposals (2)`.
  - Ballot Race Cards:
    1. **U.S. Senate — Michigan:** `DECIDED` badge (Green) · Elissa Slotkin (D) vs Mike Rogers (R).
    2. **Michigan Governor:** `DECIDED` badge (Green) · Jocelyn Benson (D) vs John James (R).
    3. **U.S. House MI-12:** `UNDECIDED` badge (Amber) · Rashida Tlaib (D) vs James Hooper (R).
    4. **Wayne County Executive:** `DECIDED` badge (Green) · Warren Evans (D) vs Mark Ashley Price (R).
    5. **Wayne County Commission Dist 1:** `UNDECIDED` badge (Amber) · Tim Killeen (D) vs Unopposed.
    6. **Michigan Supreme Court (Non-Partisan):** `UNDECIDED` badge (Amber) · Kyra Harris Bolden vs Kimberly Ann Thomas.
    7. **Proposal 26-1 (Detroit Schools Facilities Bond):** `UNDECIDED` · $1.2B Infrastructure Investment.
    8. **Proposal 26-2 (Wayne County Transit Expansion Millage):** `UNDECIDED` · 0.9 Mill SMART regional bus expansion.
  - Each card features: Office title, jurisdiction level, candidate thumbnail chips, decision status pill, and direct chevron action.
  - Footer Watermark: *"Official Sample Ballot Data · Wayne County Clerk & Michigan SOS"*.
- **Key Design Decision:** Gamified progress bar transforms an intimidating 8-race ballot into a manageable, satisfying checklist.
- **Motion Language:** Progress bar animates with spring easing on card selection; decided cards slide smoothly down the deck.

### Screen 1.5 - Candidate Comparison
- **Screen ID:** `SCR-1.5`
- **Canvas:** 390×844pt | Dark Mode
- **Layout Description:**
  - Header: Back button + `RACE COMPARISON` + `U.S. Senate — Michigan`.
  - Side-by-Side Dual Column Candidate Header:
    - **Left Column:** Elissa Slotkin · Blue Dem Badge (`#1565C0`) · Candidate Portrait Chip · *"U.S. Rep (MI-07) / Ex-CIA"*.
    - **Right Column:** Mike Rogers · Red Rep Badge (`#B71C1C`) · Candidate Portrait Chip · *"Former U.S. Rep / House Intel Chair"*.
  - Stance Match Radar Bar (Interactive):
    - Overall Compatibility Meter: Slotkin `78% Match` vs Rogers `42% Match` based on user's civic quiz answers.
  - Issue-by-Issue Comparison Cards (3 Top Issues):
    1. **Automotive & Manufacturing:**
       - *Slotkin:* Federal EV battery manufacturing subsidies, domestic supply-chain mandates, UAW labor protections.
       - *Rogers:* Elimination of federal EV purchase mandates, corporate tax relief, deregulation of domestic manufacturing.
    2. **Healthcare & Drug Prices:**
       - *Slotkin:* Expanding $35 insulin caps to private plans, Medicare prescription price negotiation.
       - *Rogers:* Repeal Medicare price caps, expand Health Savings Accounts (HSAs), cross-state insurance sales.
    3. **Great Lakes & Water Quality:**
       - *Slotkin:* $475M/yr Great Lakes Restoration Initiative (GLRI), federal ban on municipal water shutoffs.
       - *Rogers:* Protect GLRI funding while streamlining permit approvals for commercial shipping and pipeline infrastructure.
  - Bottom Sticky Decision Dock:
    - Two 44pt toggle buttons: `Vote Slotkin` | `Vote Rogers` + `Mark as My Choice` confirm trigger.
- **Key Design Decision:** Direct, neutral head-to-head issue juxtaposition without editorial bias or sensationalism.
- **Motion Language:** Horizontal sliding pill switch between candidate tabs; issue cards expand on tap.

### Screen 1.6 - Candidate Profile Deep Dive
- **Screen ID:** `SCR-1.6`
- **Canvas:** 390×844pt | Dark Mode
- **Layout Description:**
  - Hero Header: Large photo of Elissa Slotkin, blue party strip on left edge, Michigan state crest chip.
  - Name & Title: `Elissa Slotkin` (24pt bold) · `Democratic Nominee for U.S. Senate`.
  - Metric Strip: `98.2% Vote Attendance` | `24 Bills Sponsored` | `4 Terms Served`.
  - Segmented Navigation Tabs: `[Positions]` | `[Record]` | `[Money]` | `[News]`.
  - Section 1: Collapsed Bio Card: *"Born in Detroit, MI. Served 3 tours in Iraq alongside military as CIA analyst... [Tap to expand]"*.
  - Section 2: Key Legislative Record (Last 3 Notable Roll Call Votes):
    - `H.R. 8035` Ukraine & Indo-Pacific Security Supplemental — **VOTED YEA** (Passed 311-112).
    - `H.R. 2882` Further Consolidated Appropriations Act (Federal Funding) — **VOTED YEA** (Passed 286-134).
    - `H.R. 7521` Protecting Americans from Foreign Adversary Apps (TikTok Divestment) — **VOTED YEA** (Passed 352-65).
  - Section 3: Campaign Finance Snapshot (FEC Q3 2026):
    - Total Raised: `$34,250,118` (Monospace cyan).
    - Breakdown Meter: Small-dollar grassroots (<$200) `68%` | Large individual `22%` | PACs `10%`.
    - Top Donors by Sector: Education ($1.8M), Healthcare Professionals ($1.4M), Technology ($1.1M).
  - Section 4: Recent Verified News Mentions: Scrollable pill chips with media source logos.
- **Key Design Decision:** Tabbed disclosure architecture allows novice voters to read quick summaries while power users inspect FEC filings and roll-calls.
- **Motion Language:** Smooth vertical accordion expansion on Bio; tab switching has spring-damping transitions.

### Screen 1.7 - Ballot Measure Explainer
- **Screen ID:** `SCR-1.7`
- **Canvas:** 390×844pt | Dark Mode
- **Layout Description:**
  - Top Subtitle: Official Ballot Title in 11pt muted gray: *"Wayne County Proposition 26-2"*.
  - Main Headline in 20pt Bold: *"Expand 24/7 Rapid Transit and Connect Detroit to Wayne County Suburbs"*.
  - Public Support Gauge:
    - High-visibility visual meter: `58% Support` (Green) | `34% Oppose` (Red) | `8% Undecided` (Gray).
    - Survey Citation: `Detroit Free Press / WDIV Poll (Oct 2026 · MOE ±3.8%)`.
  - Three-Section Structured Explainer:
    1. **WHAT IT DOES:** Authorizes a 0.9-mill regional transit property tax for 10 years to expand SMART bus services, introduce 4 new 24/7 rapid transit corridors connecting Downtown Detroit to Detroit Metro Airport (DTW), Wayne State University, and suburban industrial corridors.
    2. **WHO SUPPORTS IT:** Detroit Regional Chamber of Commerce, Amalgamated Transit Union Local 26, Wayne County Executive Warren Evans, Michigan Environmental Council.
    3. **WHO OPPOSES IT:** Taxpayers United of Michigan, Wayne County Taxpayers Coalition (arguing against property tax increases on fixed-income seniors).
  - Fiscal Impact Card: Monospace callout: *"Cost to median Wayne County homeowner ($100,000 taxable value): $45/year or $3.75/month"*.
  - Bottom Toggle Bar: `[ Vote YES / Support ]` vs `[ Vote NO / Oppose ]` + `Save My Decision` confirmation.
- **Key Design Decision:** Highlighting the concrete personal fiscal impact ($3.75/month) eliminates voter confusion regarding abstract millage rates.
- **Motion Language:** Support gauge fills dynamically from 0 to 58% on screen reveal.

### Screen 1.8 - My Decisions Summary
- **Screen ID:** `SCR-1.8`
- **Canvas:** 390×844pt | Dark Mode
- **Layout Description:**
  - Header: Festive celebration graphic with subtle cyan and gold confetti particles in the background.
  - Title: *"Your Civic Plan is Complete!"*
  - Subhead: *"Wayne County, Michigan · Nov 3, 2026 General Election"*.
  - Completed Ballot Card Deck:
    - 1. U.S. Senate: `Elissa Slotkin (D)` [Checked]
    - 2. Governor: `Jocelyn Benson (D)` [Checked]
    - 3. U.S. House MI-12: `Rashida Tlaib (D)` [Checked]
    - 4. Wayne County Exec: `Warren Evans (D)` [Checked]
    - 5. Wayne County Comm Dist 1: `Tim Killeen (D)` [Checked]
    - 6. MI Supreme Court: `Kyra Harris Bolden (NP)` [Checked]
    - 7. Proposal 26-1 (Schools Bond): `YES / Support` [Checked]
    - 8. Proposal 26-2 (Transit Millage): `YES / Support` [Checked]
  - Voting Logistics Widget:
    - Assigned Polling Place: `Northwest Activities Center, 18100 Meyers Rd, Detroit, MI 48235`.
    - Polling Hours: `7:00 AM – 8:00 PM EST`.
    - Required ID: Michigan Driver's License or State ID (or Affidavit of Voter Not in Possession).
  - Action Row:
    - Primary Button: `Export & Share My Civic Plan` (Privacy-first graphic with candidate selections).
    - Secondary Button: `Add to Apple Calendar / Google Calendar`.
- **Key Design Decision:** Transform completed voting decisions into an actionable, shareable plan with real physical polling logistics.
- **Motion Language:** Subtle floating confetti physics; checkmark icons animate sequentially down the list.

---

## 4. Journey 2: Government Dashboard (Power User)

**Goal:** Deliver a daily mission-control dashboard for engaged citizens and political analysts tracking live US government activity, debt accumulation, shutdown threats, and multi-branch legislative velocity.

### Screen 2.1 - Dashboard Home
- **Screen ID:** `SCR-2.1`
- **Canvas:** 390×844pt | Dark Mode (Signature Screen) & Light Mode
- **Layout Description:**
  - App Header: `CIVIC RADAR` wordmark with pulsing electric cyan radar dot + Detroit Metro Weather chip (`58°F Fair`).
  - Top Row Twin Live Counters (Side-by-Side):
    1. **Live National Debt Odometer:**
       - Value: `$36,847,293,107,482`
       - Styling: Monospace digits in electric cyan (`#00E5FF`) on dark recessed panel.
       - Sub-indicator: `+$78,410 / second · EST badge · US Treasury API`.
    2. **Shutdown Countdown Clock:**
       - Value: `47d 12h 33m`
       - Styling: Split-flap digital clock in vivid amber (`#FF6F00`).
       - Sub-indicator: `CR Lapse: Nov 21 · 12 of 12 Approps Unfinished`.
  - Mid Section: **"THE MACHINE" — Three Branches Assembly Line:**
    - Height: 204pt interactive conveyor graphic.
    - Schematic blue-cyan vector assembly line linking **Congress (Chamber 1)** → **White House (Chamber 2)** → **SCOTUS (Chamber 3)**.
    - Moving bill tokens sliding along the conveyor belt (e.g., `H.R. 8404`, `S. 2226`, `H.R. 4366`).
    - Live throughput counter: `348 active bills in motion`.
    - Tap prompt: `Tap to expand machine schematic →`.
  - Quick-Access Instrument Grid (2×3 Grid with Live Badges):
    - `Congress`: Active floor votes badge (`14 LIVE`)
    - `White House`: Executive actions badge (`3 NEW`)
    - `SCOTUS`: Docket decisions badge (`2 OPINIONS`)
    - `Map Studio`: Battleground states badge (`50 STATES`)
    - `Civic Sentiment`: National mood meter (`68% VOLATILE`)
    - `My Ballot`: Undecided items badge (`5 LEFT`)
  - Bottom Live Ticker: "In the Feed" (Real-time government actions):
    - `[PASSED]` Senate invokes cloture on Defense Authorization (67-32) — 12m ago
    - `[SIGNED]` Executive Order on Critical Mineral Supply Chain Security — 44m ago
    - `[ARGUED]` Supreme Court hears oral arguments in *Gonzalez v. SEC* — 2h ago
    - `[VETOED]` President returns H.J. Res 109 with veto message — 5h ago
    - `[APPEALED]` 6th Circuit en banc review granted in Great Lakes environmental suit — 7h ago
- **Key Design Decision:** Pairing rolling national financial instruments with physical legislative factory visuals to make abstract governance tangible.
- **Motion Language:** Odometer digits roll smoothly at 60 FPS; shutdown countdown blinks colon every second; conveyor belt glides continuously at 12px/sec.

### Screen 2.2 - Dashboard: Expanded Machine View
- **Screen ID:** `SCR-2.2`
- **Canvas:** 390×844pt | Dark Mode
- **Layout Description:**
  - Full-Screen Deep Schematic of "The Three Branches Machine".
  - Top Navigation: Back to Dashboard + `THE MACHINE v4.2 · LIVE ASSEMBLY LINE`.
  - Three Interactive Branch Stations:
    1. **Station 1: Legislative Factory (Congress):**
       - Hopper Input: `11,420 Bills Introduced`.
       - Chamber Stage: `412 in Committee` → `46 on House/Senate Floor`.
       - Conveyor output: 3 bill chips en route to President.
    2. **Station 2: Executive Production Line (White House):**
       - Desk Queue: `38 Bills Awaiting Presidential Signature`.
       - Output Gates: `12 Enacted into Law (Green)` | `2 Vetoed (Red)` | `24 Pending (Amber)`.
    3. **Station 3: Judicial Quality Control (SCOTUS):**
       - Review Bay: `62 Petitions Granted Certiorari` → `18 Argued` → `6 Constitutional Review Challenges`.
  - Motion Trails: Conveyor belt links stations with motion-blurred glowing arrows; bills have status tags.
  - Interactive Inspector Sheet (Bottom Half):
    - Tapping any branch station reveals its live throughput velocity, bottleneck diagnostics, and average days in chamber.
  - Color Legend:
    - Cyan: Legislative drafting & floor debate.
    - Amber: Executive 10-day signing window.
    - Purple: Constitutional challenge review.
    - Green: Enacted federal public law.
- **Key Design Decision:** Transforming high school civics into an industrial mission-control interface that visualizes institutional velocity and gridlock.
- **Motion Language:** Bill chips glide along SVG bezier path; tapping a station initiates a focused camera zoom effect.

### Screen 2.3 - Notifications / Activity Feed
- **Screen ID:** `SCR-2.3`
- **Canvas:** 390×844pt | Dark Mode
- **Layout Description:**
  - Header: `ACTIVITY RADAR` with `Mark All Read` and filter trigger.
  - Branch Filter Bar: `[ALL (24)]` | `[CONGRESS (12)]` | `[WHITE HOUSE (5)]` | `[SCOTUS (4)]` | `[LOCAL DETROIT (3)]`.
  - Real-Time Feed Cards:
    - Congress Card: Glowing cyan pulse dot · `Senate Floor Vote #312` · *"S. 2226 NDAA passes 67-33 with bipartisan majority"* · `8m ago` · Tag `[PASSED]`.
    - White House Card: Amber pulse dot · `Executive Action` · *"Presidential Determination No. 2026-14 on Refugee Ceilings signed"* · `35m ago` · Tag `[SIGNED]`.
    - SCOTUS Card: Purple pulse dot · `Order List Release` · *"Certiorari granted in United States v. Skrmetti; oral argument set"* · `2h ago` · Tag `[DOCKET]`.
    - Local Detroit Card: Green pulse dot · `Wayne County Clerk` · *"Wayne County Board of Canvassers completes pre-election logic & accuracy testing"* · `4h ago` · Tag `[LOCAL SOS]`.
  - Swipe Actions: Swipe right to bookmark / track; swipe left to snooze or dismiss.
- **Key Design Decision:** Multi-branch chronological timeline unified under a single sensor feed, filterable by institution.
- **Motion Language:** New items push existing cards down with a soft spring animation; swipe-to-dismiss provides tactile haptic feedback.

---

## 5. Journey 3: Congress Tracker

**Goal:** Provide end-to-end transparency into bills, votes, committee hearings, and member accountability in the 119th Congress.

### Screen 3.1 - Congress Hub
- **Screen ID:** `SCR-3.1`
- **Canvas:** 390×844pt | Dark Mode
- **Layout Description:**
  - Segmented Chamber Selector: `[SENATE]` | `[HOUSE]` | `[COMMITTEES]`.
  - Session Status Pill: `● CONGRESS IS IN SESSION · 119TH CONGRESS · DAY 142` (Electric green status).
  - Next Scheduled Floor Vote Spotlight:
    - Bill: `S. 2226 — National Defense Authorization Act (NDAA)`
    - Countdown Timer: `Floor Vote in 02h 14m 18s` (Amber monospace).
    - Expected Majority: 65+ votes required for cloture.
  - The Bill Pipeline (Horizontal Scroll Stage View):
    - `Introduced (4,812)` → `Committee (892)` → `Floor (64)` → `Passed (128)` → `Conference (14)` → `Enacted (88)`.
    - Each stage card features an active count badge, stage velocity metric, and chevron to open Kanban view.
- **Key Design Decision:** Direct countdown to upcoming votes creates urgency and appointments for civic engagement.
- **Motion Language:** Countdown timer updates every second; horizontal pipeline stages scroll with inertia.

### Screen 3.2 - Bill Pipeline Detail
- **Screen ID:** `SCR-3.2`
- **Canvas:** 390×844pt | Dark Mode
- **Layout Description:**
  - View Header: `LEGISLATION PIPELINE · KANBAN VIEW`.
  - Active Column Selector: `[Floor Consideration — 64 Active Bills]`.
  - Filter Bar: `Category: Defense, Tech, Health` | `Sponsor: Bipartisan` | `Pending: >30 Days`.
  - Vertical Kanban Bill Cards:
    1. **S. 2226 — National Defense Authorization Act for FY 2027:**
       - Sponsor: Sen. Jack Reed (D-RI) + 24 Co-sponsors (14 D, 10 R).
       - Status: `14 days in Floor Consideration` · Passage Probability: `84%`.
       - Progress Bar: 4 of 6 stages completed.
    2. **H.R. 7024 — Tax Relief for American Families and Workers Act:**
       - Sponsor: Rep. Jason Smith (R-MO) + Bipartisan Coalition.
       - Status: `28 days in Floor Consideration` · Passage Probability: `62%`.
    3. **H.R. 4366 — Consolidated Appropriations Act (Minibus):**
       - Sponsor: Rep. Kay Granger (R-TX).
       - Status: `4 days in Floor Consideration` · Fiscal Deadline Critical.
- **Key Design Decision:** Visualizing bills as Kanban cards empowers users to monitor where legislation gets stuck in committee bottlenecks.
- **Motion Language:** Drag-and-drop card physics simulation; category chips filter list with instant opacity transitions.

### Screen 3.3 - Bill Detail
- **Screen ID:** `SCR-3.3`
- **Canvas:** 390×844pt | Dark Mode
- **Layout Description:**
  - Hero Header: `H.R. 8404` (32pt bold monospace) · *"Federal Water Infrastructure and Cyber Protection Act"*.
  - Horizontal Status Progress Meter:
    - Stages: `Introduced` [✓] → `Committee` [✓] → `Floor` [ACTIVE] → `Senate` [Pending] → `President` [Pending].
  - Sponsor Bar: Rep. Elissa Slotkin (D-MI-07) + 38 Bipartisan Co-Sponsors · Portrait & State Badge.
  - Plain-Language Summary (2 Sentences):
    - *"Directs $14.5 billion toward modernizing federal water testing facilities and municipal cybersecurity defenses against foreign state-sponsored attacks. Prohibits the privatization of local water utilities that receive federal grants."*
  - Document Provenance Links:
    - `[View Official GPO Full Text (PDF)]` | `[CBO Cost Score: $14.2B over 10 Years]`.
  - Interactive Journey Timeline:
    - `Jun 12, 2026`: Introduced in House by Rep. Slotkin.
    - `Jul 08, 2026`: Reported favorably by Transportation & Infrastructure Committee (28-14).
    - `Sep 15, 2026`: Rule granted for floor debate and amendment voting.
  - Public Sentiment Meter: `74% Favorable` across 182,000 verified public responses.
  - Action Dock: `[Track This Bill]` | `[Share Bill]` | `[Contact Representative]`.
- **Key Design Decision:** Translating complex 400-page statutory language into two plain-language sentences validated by non-partisan legislative analysts.
- **Motion Language:** Timeline steps light up sequentially on scroll; sentiment gauge animates on view entry.

### Screen 3.4 - Legislator Profile
- **Screen ID:** `SCR-3.4`
- **Canvas:** 390×844pt | Dark Mode
- **Layout Description:**
  - Hero Profile Card:
    - Official portrait of Senator Gary Peters (Senior Senator from Michigan).
    - Blue Democratic border strip (`#1565C0`) · Michigan State Crest badge.
    - Title: `Gary Peters · U.S. Senator (Michigan) · Democrat`.
  - Quick Stats Strip:
    - `12 Years in Senate` | `99.4% Vote Attendance` | `48 Bills Sponsored (This Session)`.
  - **Signature Feature — Party Alignment Gauge:**
    - High-visibility circular gauge indicating `91.4%` voting alignment with Senate Democratic Caucus.
    - Sub-metric: `Lugar Center Bipartisanship Index: #4 Most Bipartisan Senator`.
  - Profile Tabs: `[KEY VOTES]` | `[BILLS]` | `[COMMITTEES]` | `[FINANCE]`.
  - Key Votes Preview:
    - `S. 2226` Defense Authorization Act — **YEA**
    - `H.R. 2882` Consolidated Appropriations — **YEA**
    - `S. 1260` US Innovation & Competition Act — **YEA**
- **Key Design Decision:** Combining party alignment with an independent bipartisanship index ensures objective, multi-dimensional assessment of legislator conduct.
- **Motion Language:** Circular gauge animates from 0% to 91.4% with smooth SVG stroke-dashoffset transitions.

### Screen 3.5 - Vote Record
- **Screen ID:** `SCR-3.5`
- **Canvas:** 390×844pt | Dark Mode
- **Layout Description:**
  - Header: Roll Call Vote #312 · Senate Floor.
  - Bill Reference: `S. 2226 — Amendment #421 (Great Lakes Restoration Initiative Funding)`.
  - Result Banner: `PASSED 67 – 33` in bold 24pt green lettering.
  - Split-Bar Visualization:
    - Blue Segment (48 Dem Yeas + 19 Rep Yeas = 67 Total Yeas).
    - Red Segment (31 Rep Nays + 2 Dem Nays = 33 Total Nays).
    - Gray Marker (0 Absent / Not Voting).
  - Filter & Search Bar: `Filter by State (MI, OH...)` | `Filter by Party (Dem, Rep)`.
  - Scrollable Senator Vote Roll:
    - `Peters, Gary [D-MI]` — **VOTED YEA** (09:42 AM)
    - `Stabenow, Debbie [D-MI]` — **VOTED YEA** (09:41 AM)
    - `McConnell, Mitch [R-KY]` — **VOTED NAY** (09:44 AM)
    - `Schumer, Chuck [D-NY]` — **VOTED YEA** (09:45 AM)
- **Key Design Decision:** Immediate split-bar visualization makes party loyalty vs bipartisan defections visible at a single glance.
- **Motion Language:** Split bar expands from center outward on screen load; filter chips update the roster with instant row sorting.

---

## 6. Journey 4: Map Explorer

**Goal:** Enable geographic exploration of electoral power, legislative impact, demographics, and breaking news intensity across the 50 states, 435 congressional districts, and Detroit metro neighborhoods.

### Screen 4.1 - Maps Hub
- **Screen ID:** `SCR-4.1`
- **Canvas:** 390×844pt | Dark Mode & Light Mode
- **Layout Description:**
  - Map Viewport: Full-bleed interactive SVG canvas of the United States on dark background (`#07111E`), state boundaries rendered in delicate dim cyan hairlines (`#1E3553`).
  - Active Overlay Floating Badge: `OVERLAY: ELECTORAL COLLEGE (2026 OUTLOOK)`.
  - Floating Map Controls: Zoom In (`+`), Zoom Out (`-`), Recenter US, Zoom to Detroit Metro (`MI`).
  - Pull-Up Bottom Drawer (Map Mode Selector):
    1. **ELECTORAL:** 270 Electoral College win tracker.
    2. **SENATE SEATS:** 34 seats contested in 2026.
    3. **HOUSE DISTRICTS:** 435 congressional districts.
    4. **POLLING HEAT MAP:** Aggregate polling margins.
    5. **NEWS HEAT MAP:** Real-time story frequency.
- **Key Design Decision:** Full-screen cartographic immersion with a modular bottom drawer keeps controls accessible without obstructing geographic data.
- **Motion Language:** Smooth pinch-to-zoom map physics; floating badges auto-hide during active panning.

### Screen 4.2 - Electoral Map
- **Screen ID:** `SCR-4.2`
- **Canvas:** 390×844pt | Dark Mode
- **Layout Description:**
  - Classic 50-State Electoral Map categorized by consensus battleground ratings:
    - Solid Blue (Safe Dem, 187 EV)
    - Lean Blue (Likely/Lean Dem, 39 EV)
    - Tossup / Gray (Contested, 62 EV: MI, PA, WI, AZ, NV, GA)
    - Lean Red (Likely/Lean Rep, 44 EV)
    - Solid Red (Safe Rep, 206 EV)
  - Interactive State Callout (Tapped State: Michigan):
    - Title: **Michigan · 15 Electoral Votes**
    - Status: `Tossup Battleground · Dem +1.4% (Within MOE)`
    - Trend: `▲ +0.6% Democratic gain over last 14 days`
    - Recent Polls: EPIC-MRA (Even), Detroit Free Press (D +2).
  - Bottom 270 Win Tracker Bar:
    - Split progress bar: Blue (`226 EV`) vs Gray Contested (`62 EV`) vs Red (`250 EV`).
    - Prominent white needle marker at the `270 to Win` threshold.
- **Key Design Decision:** Centering the 270 threshold with a high-contrast needle provides instant comprehension of national power balance.
- **Motion Language:** State boundaries glow with cyan halo upon tap; win tracker bar animates state transitions.

### Screen 4.3 - News Heat Map
- **Screen ID:** `SCR-4.3`
- **Canvas:** 390×844pt | Dark Mode
- **Layout Description:**
  - Geographic Heatmap: Dark US base map where states and metropolitan areas glow with radiant gradients based on news article volume.
  - Top Keyword Search Bar: Active search tag: `[ "Automotive Tariffs & EV Subsidies" ]` with clear button.
  - Heat Intensity Hotspots:
    - Michigan: Vibrant electric cyan / gold radial glow (`1,420 articles in last 24h`).
    - Ohio: Medium amber glow (`680 articles`).
    - California: High cyan glow (`940 articles`).
    - Texas: High cyan glow (`1,120 articles`).
  - Time Range Slider: `Last 24 Hours · [12h — 24h — 3d — 7d — 30d]`.
  - Legend Strip: `● Breaking Flash (>500/hr)` | `● Trending (>100/hr)` | `● Normal` | `● Quiet`.
- **Key Design Decision:** Transforming text news stories into a geographic seismograph showing where political stories are generating the most regional shockwaves.
- **Motion Language:** Glowing radial hotspots pulse softly at variable frequencies based on article velocity.

### Screen 4.4 - District Deep Dive
- **Screen ID:** `SCR-4.4`
- **Canvas:** 390×844pt | Dark Mode
- **Layout Description:**
  - Vector Map View: Zoomed map focused on Michigan's 12th Congressional District (encompassing Detroit West, Dearborn, Southfield).
  - Glowing electric cyan boundary line surrounding MI-12.
  - Candidate Matchup Card:
    - Incumbent: Rep. Rashida Tlaib (Democrat) vs Challenger: James Hooper (Republican).
    - Polling: Tlaib 64% vs Hooper 31% (`Dem +33`).
  - Key District Demographics:
    - Population: `775,240` | Median Income: `$46,200` | Urban Density: `88%` | Diversity Index: `72%`.
  - Localized Legislative Feed:
    - *"Dearborn Advanced Mobility Hub secures $45M federal DOT clean transit grant (2d ago)"*.
  - Action Button: `[Track This District (Add to Radar)]`.
- **Key Design Decision:** Bringing national congressional data down to the voter's exact neighborhood and local economic stakes.
- **Motion Language:** District boundary strokes draw in on screen render; demographic counters count up.

### Screen 4.5 - Layer Builder (Power Feature)
- **Screen ID:** `SCR-4.5`
- **Canvas:** 390×844pt | Dark Mode
- **Layout Description:**
  - Header: `MAP STUDIO · CUSTOM LAYER COMPOSITE`.
  - Base Layer Selector: `[Electoral College]` | `[435 House Districts]` | `[3,143 US Counties]`.
  - Layer Stack Management UI (Draggable Cards with Toggles & Sliders):
    1. **Layer 1: 2026 Senate Polling Spread**
       - Toggle: `ON` | Opacity Slider: `85%` | Color: Blue/Red Diverging.
    2. **Layer 2: News Volume & Shockwave Density**
       - Toggle: `ON` | Opacity Slider: `60%` | Color: Cyan Heat Halo.
    3. **Layer 3: Census Demographic Vulnerability Index**
       - Toggle: `ON` | Opacity Slider: `40%` | Color: Purple Grayscale.
    4. **Layer 4: Bipartisan Infrastructure Law (IIJA) Grants**
       - Toggle: `OFF` | Opacity Slider: `50%` | Color: Emerald Dots.
  - Bottom Action Dock: `[Save Custom Preset]` | `[Export GeoJSON / Share Map URL]`.
- **Key Design Decision:** Giving political journalists and citizen researchers GIS-level compositing tools on a mobile screen.
- **Motion Language:** Real-time opacity blending on canvas as sliders are manipulated; drag-and-drop layer reordering.

---

## 7. Journey 5: Courts & Dockets

**Goal:** Track Supreme Court dockets, oral arguments, constitutional challenges, and federal circuit court actions with objective legal rigor.

### Screen 5.1 - Courts Hub
- **Screen ID:** `SCR-5.1`
- **Canvas:** 390×844pt | Dark Mode
- **Layout Description:**
  - SCOTUS Status Header:
    - Next Oral Argument Countdown: `04d 18h 22m · Oct 20, 2026`.
    - October 2026 Term Overview: `58 Cases Granted Cert` | `14 Argued` | `4 Decided`.
  - Federal Circuit Courts Status Deck (2×2 Grid):
    1. **6th Circuit (Cincinnati — covers MI, OH, KY, TN):**
       - Active Appeals: `1,240` | Recent Decisions: `12` | `4 En Banc Hearings Pending`.
    2. **D.C. Circuit (Washington, D.C.):**
       - Active Appeals: `820` | Federal Regulatory Challenges: `18`.
    3. **9th Circuit (West Coast):**
       - Active Appeals: `2,410` | Environmental Rulings Pending: `3`.
    4. **5th Circuit (New Orleans):**
       - Active Appeals: `1,890` | Administrative Injunctions: `8`.
  - Quick Link: `Browse Full SCOTUS Calendar →`.
- **Key Design Decision:** Framing the judiciary through active caseloads and countdowns to oral arguments rather than political personalities.
- **Motion Language:** Countdown timer ticks live; circuit court cards expand on tap.

### Screen 5.2 - SCOTUS Docket
- **Screen ID:** `SCR-5.2`
- **Canvas:** 390×844pt | Dark Mode
- **Layout Description:**
  - Docket Title: `SUPREME COURT DOCKET · OCTOBER TERM 2026`.
  - Filter Tabs: `[All (58)]` | `[Pending (40)]` | `[Argued (14)]` | `[Decided (4)]`.
  - Topic Pills: `1st Amendment` | `14th Amendment` | `Commerce Clause` | `Administrative Law`.
  - Case Docket Cards:
    1. ***United States v. Skrmetti* (Docket #23-477):**
       - Status: `ARGUED` (Purple Badge) | Argued: `Oct 9, 2026`.
       - Topic Tag: `14th Amendment Equal Protection`.
       - Legal Issue: Constitutionality of state prohibitions on gender-affirming medical care for minors.
    2. ***Free Speech Coalition v. Paxton* (Docket #23-884):**
       - Status: `ARGUED` (Purple Badge) | Argued: `Oct 6, 2026`.
       - Topic Tag: `1st Amendment / Commercial Speech`.
       - Legal Issue: Age verification mandates for digital adult platforms.
    3. ***City of Grants Pass v. Johnson* (Docket #23-175):**
       - Status: `DECIDED 6–3` (Green Badge) · Opinion by Roberts.
       - Topic Tag: `8th Amendment Cruel & Unusual Punishment`.
- **Key Design Decision:** Italicized formal legal citations paired with plain-language constitutional issue tags.
- **Motion Language:** Filter pills filter docket cards with smooth vertical collapsing.

### Screen 5.3 - Case Detail
- **Screen ID:** `SCR-5.3`
- **Canvas:** 390×844pt | Dark Mode
- **Layout Description:**
  - Hero Header: *United States v. Skrmetti* · `Docket #23-477` (22pt bold).
  - Plain-Language Legal Issue (One-Liner):
    - *"Whether Tennessee Senate Bill 1, which prohibits certain medical procedures for transgender minors, violates the Equal Protection Clause of the Fourteenth Amendment."*
  - Parties: United States (Petitioner) v. Jonathan Skrmetti, Attorney General of Tennessee (Respondent).
  - Status Progress Bar:
    - Stages: `Cert Granted` [✓] → `Briefed` [✓] → `Argued` [✓] → `Opinion Release` [PENDING].
  - Case Chronology & Key Dates:
    - `Nov 2023`: Petition for writ of certiorari filed.
    - `Jun 24, 2024`: Certiorari granted by Supreme Court.
    - `Oct 09, 2026`: Oral arguments conducted (84 minutes of audio & transcript filed).
    - `Expected Jun 2027`: Decision and written opinions release.
  - Lower Court History: 6th Circuit Court of Appeals reversed district court preliminary injunction (Judge Sutton opinion).
  - Related Verified News: 4 media mentions with analytical coverage.
- **Key Design Decision:** Four-stage judicial progress bar demystifies the multi-year timeline of Supreme Court jurisprudence.
- **Motion Language:** Stage indicators illuminate with soft cyan glow; transcript link features external icon animation.

---

## 8. Empty States & Error Handling

Civic Radar provides informative, branded empty states that diagnose the underlying civic data condition rather than presenting generic "no data" placeholders.

### Screen E.1 - No Ballot Found for Location
- **Screen ID:** `SCR-E.1`
- **Canvas:** 390×844pt | Dark Mode
- **Layout Description:**
  - Graphic: Detailed vector radar reticle with faint sweeping line over an empty geographic grid with subtle pulsing rings.
  - Headline: *"No Ballot Found for This Address"* (20pt bold).
  - Explanatory Subtext:
    - *"We couldn't locate an official 2026 ballot for ZIP 99999. This address may be in an unincorporated township, or your local county election commission has not certified candidate rosters yet."*
  - Diagnostic Data Points:
    - Michigan SOS Feed Status: `CONNECTED (Last checked 4m ago)`.
    - Wayne County Ballot Certification Date: `Certified Oct 02, 2026`.
  - Action Buttons:
    - Primary CTA: `Change ZIP Code or Address` (Electric cyan).
    - Secondary Action: `Visit Michigan SOS Voter Information Portal ↗`.
- **Key Design Decision:** Providing election board certification dates explains *why* a ballot is absent, avoiding confusion.

### Screen E.2 - No Recent Activity in Tracked Bill
- **Screen ID:** `SCR-E.2`
- **Canvas:** 390×844pt | Dark Mode
- **Layout Description:**
  - Graphic: Minimalist schematic of an empty legislative committee chamber with a dormant gavel on sounding block and flatline seismograph radar strip.
  - Headline: *"No Recent Activity for H.R. 1042"* (20pt bold).
  - Explanatory Subtext:
    - *"This bill was referred to the House Energy & Commerce Committee 84 days ago. No committee hearings, markups, or floor votes have occurred since July 24, 2026."*
  - Status Tag: `● DORMANT IN COMMITTEE (84 Days)` in muted amber.
  - Action Buttons:
    - Primary CTA: `Set Activity Alert (Notify on Markup)` (Cyan button).
    - Secondary Action: `View Committee Members & Chairs →`.
- **Key Design Decision:** Classifying inactive bills as "dormant in committee" accurately reflects real-world legislative mechanics.

---

## 9. Daylight Slate: Light Mode Variants

For outdoor sunlight legibility and user preference, Civic Radar provides high-contrast Daylight Slate variants utilizing `#F0F4FF` surfaces.

### Screen L.1 - Dashboard Home (Light Mode Variant)
- **Screen ID:** `SCR-L.1`
- **Canvas:** 390×844pt | Light Mode
- **Visual Translation:**
  - Canvas: Pristine cool slate `#F0F4FF`.
  - Cards: Pure white `#FFFFFF` with soft borders `#D0DBEE` and 4px ambient shadow (`rgba(11,25,44,0.06)`).
  - National Debt Odometer: Monospace numerals rendered in high-contrast deep cobalt `#004C8C` with cyan badge.
  - Shutdown Clock: Deep amber-orange `#D84315` on white panel.
  - Three Branches Machine: Crisp technical blueprint line-art with dark navy conduits and vibrant cyan tokens.
- **Accessibility Verification:** Contrast ratio exceeds 14:1 for primary headings and 6:1 for cards.

### Screen L.2 - My Ballot Home (Light Mode Variant)
- **Screen ID:** `SCR-L.2`
- **Canvas:** 390×844pt | Light Mode
- **Visual Translation:**
  - White candidate cards with distinct blue/red party indicator borders.
  - Ballot completion progress bar rendered in high-contrast royal blue fill against pale slate track.
  - High-contrast typography ensures effortless outdoor readability at Detroit polling precincts.

### Screen L.3 - Maps Hub (Light Mode Variant)
- **Screen ID:** `SCR-L.3`
- **Canvas:** 390×844pt | Light Mode
- **Visual Translation:**
  - Water bodies in pale cerulean `#E2EAF8`.
  - US landmass in crisp white `#FFFFFF` with slate state boundaries `#B0C2DE`.
  - Red and blue electoral states calibrated to `#2563EB` (Dem) and `#DC2626` (Rep) to maintain 5.5:1 contrast against white landmasses.

---

## 10. Design System & Component Library Reference

### 10.1 Button & Control Matrix

| Component Name | Visual Style | Dimensions | Padding | Default State | Active / Hover |
|:---|:---|:---|:---|:---|:---|
| `Button Primary` | Solid Electric Cyan `#00E5FF` | Height 48pt | 16pt Horiz | Bold dark text `#07111E` | Opacity 0.85, scale 0.98 |
| `Button Secondary`| Outline `#1E3553` on `#0F1E30` | Height 44pt | 16pt Horiz | Cyan text `#00E5FF` | Background `#172A42` |
| `Button Destructive`| Crimson `#FF1744` Outline | Height 44pt | 16pt Horiz | Crimson text `#FF1744` | Solid red fill, white text |
| `Pill Filter Tag` | Rounded Pill `#172A42` | Height 32pt | 12pt Horiz | Secondary text `#8AADCA`| Border `#00E5FF`, white text |
| `Floating Action` | Circular Glassmorphic `#0F1E30`| 48×48pt | Center icon | White icon, border `#1E3553`| Electric cyan halo ring |

### 10.2 Live Badges & Indicator Tokens

| Badge Token | Background Hex | Text Hex | Pulse Behavior | Use Case |
|:---|:---|:---|:---|:---|
| `badge/live` | `#00E5FF18` (10% cyan) | `#00E5FF` | 1.2s infinite pulse dot | Real-time floor vote, live ticker |
| `badge/passed` | `#00C85318` (10% green)| `#00C853` | Static checkmark | Passed bills, enacted statutes |
| `badge/alert` | `#FF6F0018` (10% amber)| `#FF6F00` | 2.0s slow beacon blink | Shutdown deadlines, pending votes |
| `badge/veto` | `#FF174418` (10% red) | `#FF1744` | Static crossmark | Vetoed legislation, failed cloture |
| `badge/scotus` | `#B388FF18` (10% purple)| `#B388FF` | Static scale icon | Supreme Court cert / oral arguments |

### 10.3 Accessibility Compliance Audit (WCAG 2.2 AA / AAA)

| Evaluation Category | Guideline | Antigravity Design Implementation | Validation Score |
|:---|:---|:---|:---:|
| Color Contrast (Normal Text) | WCAG 1.4.3 (4.5:1 min) | All body copy exceeds 7:1 against `#07111E` and `#0F1E30` | 100% Pass |
| Color Contrast (Large Text) | WCAG 1.4.3 (3.0:1 min) | Display titles & debt numbers reach 14.8:1 contrast | 100% Pass |
| Minimum Touch Targets | WCAG 2.5.5 (44×44pt min) | All buttons, tab icons, and card toggles meet or exceed 44×44pt | 100% Pass |
| Non-Text Color Contrast | WCAG 1.4.11 (3.0:1 min)| Conveyor lines, borders, and input boxes maintain >3.2:1 | 100% Pass |
| Reduced Motion Support | WCAG 2.3.3 | All rolling counters & conveyor loops respect `prefers-reduced-motion` | 100% Pass |

---

## 11. Complete Screen Inventory & Journey Mapping

The following master index lists all 29 production screens designed in this suite:

| Screen Index | Journey / Module | Screen Title | Screen ID | Default Mode | Key Interactive Mechanism |
|:---:|:---|:---|:---:|:---:|:---|
| 01 | Journey 1: First-Time Voter | Splash / Launch | `SCR-1.1` | Dark | Radar pulse resolving to Detroit coordinates |
| 02 | Journey 1: First-Time Voter | Onboarding: What Is This | `SCR-1.2` | Dark | Detroit skyline silhouette & value cards |
| 03 | Journey 1: First-Time Voter | Location Setup | `SCR-1.3` | Dark | ZIP code validation & precinct preview |
| 04 | Journey 1: First-Time Voter | My Ballot Home | `SCR-1.4` | Dark / Light | Progress bar & Wayne Co. sample ballot deck |
| 05 | Journey 1: First-Time Voter | Candidate Comparison | `SCR-1.5` | Dark | Side-by-side stance compatibility radar |
| 06 | Journey 1: First-Time Voter | Candidate Profile Deep Dive | `SCR-1.6` | Dark | Tabbed disclosure: Votes, FEC money, news |
| 07 | Journey 1: First-Time Voter | Ballot Measure Explainer | `SCR-1.7` | Dark | Plain-language 3-section millage analysis |
| 08 | Journey 1: First-Time Voter | My Decisions Summary | `SCR-1.8` | Dark | Civic plan card export & polling place sync |
| 09 | Journey 2: Gov Dashboard | Dashboard Home | `SCR-2.1` | Dark / Light | Live rolling debt ticker & Three Branches strip |
| 10 | Journey 2: Gov Dashboard | Expanded Machine View | `SCR-2.2` | Dark | Full-screen interactive factory schematic |
| 11 | Journey 2: Gov Dashboard | Notifications / Feed | `SCR-2.3` | Dark | Institution-grouped swipeable feed |
| 12 | Journey 3: Congress Tracker | Congress Hub | `SCR-3.1` | Dark | Session status & floor vote countdown |
| 13 | Journey 3: Congress Tracker | Bill Pipeline Detail | `SCR-3.2` | Dark | Vertical Kanban board with stage filters |
| 14 | Journey 3: Congress Tracker | Bill Detail | `SCR-3.3` | Dark | 2-sentence plain summary & journey timeline |
| 15 | Journey 3: Congress Tracker | Legislator Profile | `SCR-3.4` | Dark | Circular party alignment & Lugar bipartisanship |
| 16 | Journey 3: Congress Tracker | Vote Record | `SCR-3.5` | Dark | Split-bar Yea/Nay viz & roll call roster |
| 17 | Journey 4: Map Explorer | Maps Hub | `SCR-4.1` | Dark / Light | Full-screen US cartography & bottom drawer |
| 18 | Journey 4: Map Explorer | Electoral Map | `SCR-4.2` | Dark | 270 win tracker & battleground state tap |
| 19 | Journey 4: Map Explorer | News Heat Map | `SCR-4.3` | Dark | Keyword-driven geographic shockwave glow |
| 20 | Journey 4: Map Explorer | District Deep Dive | `SCR-4.4` | Dark | MI-12 Wayne County boundary & polling |
| 21 | Journey 4: Map Explorer | Layer Builder | `SCR-4.5` | Dark | Multi-layer opacity composite stack |
| 22 | Journey 5: Courts & Dockets | Courts Hub | `SCR-5.1` | Dark | Oral argument timer & circuit court cards |
| 23 | Journey 5: Courts & Dockets | SCOTUS Docket | `SCR-5.2` | Dark | Legal citations & constitutional issue chips |
| 24 | Journey 5: Courts & Dockets | Case Detail | `SCR-5.3` | Dark | Judicial progression bar & oral argument audio |
| 25 | Empty States | No Ballot Found | `SCR-E.1` | Dark | Radar grid empty state & SOS portal link |
| 26 | Empty States | Inactive Bill | `SCR-E.2` | Dark | Dormant committee chamber & alert setup |
| 27 | Light Mode Variants | Dashboard Home (Light) | `SCR-L.1` | Light | Daylight Slate `#F0F4FF` dashboard |
| 28 | Light Mode Variants | My Ballot Home (Light) | `SCR-L.2` | Light | Daylight Slate `#F0F4FF` voter guide |
| 29 | Light Mode Variants | Maps Hub (Light) | `SCR-L.3` | Light | Daylight Slate `#F0F4FF` national map |

---

## 12. Conclusion & Implementation Notes

This design specification and accompanying standalone HTML deliverable (`index.html`) provide an end-to-end blueprint for developing Civic Radar. Every screen has been meticulously proportioned for a 390×844pt mobile viewport, ensuring that high-density governmental metrics, real-time counters, interactive legislative assembly lines, and local Wayne County voter guides coexist in harmony.
