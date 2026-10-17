# VoterLens: Michigan 2026 — ASCII Wireframes & Component Blueprints
## Text-Based UI Blueprints & Interaction Annotations
**Publication Date:** October 15, 2026  
**Deliverable Subfolder:** `deliverables/2026-10-15-voter-ballot-mobile-app-concept-playground/`  
**Companion Interactive HTML Application:** [`index.html`](file:///d:/stuff/ai-misc/_bsh2026/vscode_project01/46-wide_research_test_gemini/deliverables/2026-10-15-voter-ballot-mobile-app-concept-playground/index.html)  

---

## 1. Overview & Mobile Screen Geometry

All wireframes are engineered for a standard **393pt × 852pt** viewport (iPhone 16 Pro / Pixel 9 Pro), maintaining:
- **Top Safe Zone (54pt):** Dynamic Island / camera notch, carrier status, battery indicators.
- **Header HUD (48pt):** Active precinct indicator and theme toggle.
- **Scrollable Content Body (640pt):** Responsive layout stage.
- **Bottom Navigation Hub (64pt):** 4 primary layout tabs anchored to the physical thumb zone.
- **Bottom Safe Area (34pt):** Home swipe indicator bar.

---

## 2. Screen 1: Precision Precinct Setup & Welcome (`splash-onboarding`)

```text
+-------------------------------------------------------+
|  10:27                   ( • )                 5G 98% |
+-------------------------------------------------------+
|  [VOTERLENS MICHIGAN 2026]              [Theme: Dark] |
+-------------------------------------------------------+
|                                                       |
|   🏛️ VOTERLENS                                         |
|   Verified Michigan Civic Intelligence                |
|                                                       |
|   Enter your Michigan ZIP or City to load your        |
|   certified precinct ballot for November 3, 2026.     |
|                                                       |
|   +-----------------------------------------------+   |  <-- Input Box
|   |  🔍  Enter MI ZIP (e.g. 48386, 48226)...     |   |
|   +-----------------------------------------------+   |
|                                                       |
|   Or tap a major Michigan battleground county:        |
|   +-----------------+  +-----------------+            |  <-- 1-Tap Pills
|   | Oakland (48386) |  | Wayne (48226)   |            |      (48pt target)
|   +-----------------+  +-----------------+            |
|   +-----------------+  +-----------------+            |
|   | Macomb (48092)  |  | Kent (49503)    |            |
|   +-----------------+  +-----------------+            |
|                                                       |
|   +-----------------------------------------------+   |  <-- Detected State
|   |  PRECINCT CONFIRMED:                          |   |
|   |  Oakland County — White Lake Township         |   |
|   |  U.S. Senate Class II: El-Sayed (D) vs Rogers |   |
|   +-----------------------------------------------+   |
|                                                       |
|   +-----------------------------------------------+   |  <-- Primary CTA
|   |         CONTINUE TO VOTERLENS  ->             |   |      (52pt height)
|   +-----------------------------------------------+   |
|                                                       |
+-------------------------------------------------------+
|  [Tap County Pill] -> Auto-populates certified ballot |
|  [Tap Continue]    -> Push transition to Civic Reel   |
+-------------------------------------------------------+
```

---

## 3. Screen 2: Layout 1 — Civic Reel & Pulse Wire (`civic-reel-feed`)

```text
+-------------------------------------------------------+
|  10:27                   ( • )                 5G 98% |
+-------------------------------------------------------+
|  📍 Oakland Co. (White Lake)        [Rules] [Theme]   |
+-------------------------------------------------------+
|  [ (•) All ] [ Auto/EV ] [ Healthcare ] [ Debates ]   |  <-- Horizontal Scroll
+-------------------------------------------------------+
|                                                       |
|  +-------------------------------------------------+  |  <-- Story Card 1
|  | 🔊 VERIFIED DEBATE SOUNDBITE                    |  |
|  | Mike Rogers (R) — Grand Rapids Debate (WOOD-TV) |  |
|  |                                                 |  |
|  | "EPA emission mandates aren't an environmental  |  |
|  |  policy—they're an economic death sentence for  |  |
|  |  Michigan auto workers..."                      |  |
|  |                                                 |  |
|  | [ > PLAY 0:24 ]  | | | | | | | | | | | | | (0:24) |  |  <-- Animated Waveform
|  |                                                 |  |
|  | ℹ️ FACT-CHECK CONTEXT:                            |  |  <-- Verification Box
|  | EPA rules set fleet averages across automakers  |  |
|  | rather than banning internal combustion engines.|  |
|  |                                                 |  |
|  | [ Compare in Decision Matrix -> ]               |  |
|  +-------------------------------------------------+  |
|                                                       |
|  +-------------------------------------------------+  |  <-- Story Card 2
|  | 📣 UPCOMING CAMPAIGN TRAIL EVENT                |  |
|  | Abdul El-Sayed (D) — Oct 19, 2026 (Detroit)     |  |
|  | 'Care for Michigan' Student & Labor Mobilization|  |
|  | Venue: Wayne State University | Co-Host: UAW    |  |
|  | [ View Tour Docket ]  [ Add to My Calendar ]    |  |
|  +-------------------------------------------------+  |
|                                                       |
+-------------------------------------------------------+
|   [📰 REEL]     [⚖️ MATRIX]    [🗳️ BALLOT]    [📡 RADAR]   |  <-- Bottom Thumb Nav
+-------------------------------------------------------+
|  [Swipe Up/Down] -> Kinetic card feed scrolling       |
|  [Tap Waveform]  -> Starts debate audio simulation    |
+-------------------------------------------------------+
```

---

## 4. Screen 3: Layout 2 — Side-by-Side Decision Matrix (`decision-matrix`)

```text
+-------------------------------------------------------+
|  10:27                   ( • )                 5G 98% |
+-------------------------------------------------------+
|  📍 Oakland Co. (White Lake)              [Theme]     |
+-------------------------------------------------------+
|  STICKY CANDIDATE COMPARISON BAR (Always Visible)     |  <-- CSS Sticky Header
|  +-------------------------+------------------------+ |
|  | [D] Abdul El-Sayed (41) | [R] Mike Rogers (63)   | |
|  | MD, Rhodes, Detroit Dir | Army, FBI, 7-Term Rep  | |
|  +-------------------------+------------------------+ |
+-------------------------------------------------------+
|  FILTER: [Auto/EV] [Health] [Line 5] [Taxes] [Abort]  |
+-------------------------------------------------------+
|                                                       |
|  DOMAIN 1: AUTOMOTIVE & ELECTRIC VEHICLE MANDATES     |  <-- Policy Domain
|  +-------------------------+------------------------+ |
|  | STANCE:                 | STANCE:                | |
|  | Federal green industrial| Roll back EPA emission | |
|  | policy; union domestic  | rules; protect gas-    | |
|  | battery manufacturing;  | powered engines;       | |
|  | tariffs on foreign non- | oppose subsidized      | |
|  | union EV imports.       | Chinese battery tech.  | |
|  |                         |                        | |
|  | [Source: UAW Address]   | [Source: WOOD Debate]  | |
|  +-------------------------+------------------------+ |
|  | NEUTRAL CONTRAST SYNTHESIS:                      | |  <-- Objective Baseline
|  | Union-built EV manufacturing leadership vs.      | |
|  | defense of domestic internal combustion engines. | |
|  +--------------------------------------------------+ |
|                                                       |
|  DOMAIN 2: HEALTHCARE & PRESCRIPTION DRUGS            |
|  +-------------------------+------------------------+ |
|  | Universal Medicare for  | Market competition;    | |
|  | All; end deductibles;   | expand HSAs; price     | |
|  | cap prescription costs. | transparency; keep priv| |
|  +-------------------------+------------------------+ |
|                                                       |
+-------------------------------------------------------+
|   [📰 REEL]     [⚖️ MATRIX]    [🗳️ BALLOT]    [📡 RADAR]   |
+-------------------------------------------------------+
|  [Tap Header Avatar] -> Opens full candidate drawer   |
|  [Horizontal Swipe]  -> Filter by policy issue        |
+-------------------------------------------------------+
```

---

## 5. Screen 4: Layout 3 — Precision Ballot Navigator (`ballot-navigator`)

```text
+-------------------------------------------------------+
|  10:27                   ( • )                 5G 98% |
+-------------------------------------------------------+
|  📍 Oakland Co. (White Lake Twp)          [Rules]     |
+-------------------------------------------------------+
|  🗳️ OFFICIAL SAMPLE BALLOT — NOVEMBER 3, 2026        |
|  Progress: [====================       ] 1 of 2 Saved |  <-- Progress Indicator
+-------------------------------------------------------+
|                                                       |
|  UNITED STATES SENATE — CLASS II (Vote for One)       |
|                                                       |
|  +-------------------------------------------------+  |  <-- Candidate Card A
|  | (•) [DEM] DR. ABDUL EL-SAYED                    |  |      (Selected State)
|  |     Physician & Epidemiologist | Ann Arbor      |  |
|  |     Raised: $14.51M | 58% Small-Dollar (<$200)  |  |
|  |     [V] Key Backers: UAW, Bernie Sanders        |  |
|  |     [Inspect Full Dossier >]                    |  |
|  +-------------------------------------------------+  |
|                                                       |
|  +-------------------------------------------------+  |  <-- Candidate Card B
|  | ( ) [REP] MIKE ROGERS                           |  |
|  |     Former U.S. Representative | White Lake Twp |  |
|  |     Raised: $10.90M | Cash on Hand: $4.47M      |  |
|  |     [V] Key Backers: Donald Trump, POAM Police  |  |
|  |     [Inspect Full Dossier >]                    |  |
|  +-------------------------------------------------+  |
|                                                       |
|  +-------------------------------------------------+  |  <-- Minor Candidates
|  | [v] Certified Minor-Party Nominees (3 on Ballot)|  |      (Expandable)
|  |  • Douglas P. Marsh (Green Party) — 1.4% Poll   |  |
|  |  • Lydia Christensen (Libertarian) — 1.2% Poll  |  |
|  |  • Timothy Long (U.S. Taxpayers) — 0.8% Poll    |  |
|  +-------------------------------------------------+  |
|                                                       |
|  +-------------------------------------------------+  |  <-- Action CTA
|  |    📱 EXPORT BOOTH REFERENCE PASS ->            |  |
|  |    (Offline-ready for voting booth compliance)  |  |
|  +-------------------------------------------------+  |
|                                                       |
+-------------------------------------------------------+
|   [📰 REEL]     [⚖️ MATRIX]    [🗳️ BALLOT]    [📡 RADAR]   |
+-------------------------------------------------------+
|  [Tap Radio Target] -> Selects candidate & ticks haptic
|  [Tap Export Pass]  -> Opens compliance booth modal   |
+-------------------------------------------------------+
```

---

## 6. Screen 5: Layout 4 — Civic Radar & District Explorer (`district-radar-explorer`)

```text
+-------------------------------------------------------+
|  10:27                   ( • )                 5G 98% |
+-------------------------------------------------------+
|  📍 Oakland Co. (MI-11)                   [Theme]     |
+-------------------------------------------------------+
|  📡 5-AXIS CIVIC ALIGNMENT RADAR                      |
|                                                       |
|                       Economy                         |
|                          |                            |
|             Civil Rights / \ Healthcare               |
|                     *   /   \  *                      |
|                        /     \                        |
|            Green Tech --------- Nat. Security         |
|                                                       |
|  (Blue: El-Sayed | Red: Rogers | Green: Your Stance) |
+-------------------------------------------------------+
|  MICHIGAN CONGRESSIONAL DISTRICTS (Tap to inspect):  |
|  [MI-12 Wayne] [MI-11 Oakland] [MI-10 Macomb] [MI-03] |  <-- District Carousel
+-------------------------------------------------------+
|  SELECTED: MI-11 (Oakland County Suburbs)             |
|  • Polling: El-Sayed 54% vs. Rogers 43% (+11% Dem)    |
|  • Trump Net Favorability: -15% (39% Fav / 54% Unfav) |
|  • Core Dynamic: Suburban women revolt on Prop 3.     |
+-------------------------------------------------------+
|  🎛️ TRUMP ENDORSEMENT GRAVITY SIMULATOR:             |  <-- Interactive Slider
|  Low Influence <=============O============> Max MAGA  |
|  Simulates turnout elasticity across MI regions.      |
+-------------------------------------------------------+
|   [📰 REEL]     [⚖️ MATRIX]    [🗳️ BALLOT]    [📡 RADAR]   |
+-------------------------------------------------------+
|  [Tap District Pill] -> Loads localized crosstab data  |
|  [Drag Slider]       -> Dynamic range calculation     |
+-------------------------------------------------------+
```

---

## 7. Modal Screen 6: Candidate Comprehensive Dossier Drawer (`candidate-profile-drawer`)

```text
+-------------------------------------------------------+
|                      [ === ]                          |  <-- Drag Handle
|  CANDIDATE DOSSIER: MIKE ROGERS                       |
|  Party: Republican | Age: 63 | Home: White Lake Twp   |
+-------------------------------------------------------+
|  [ Bio & Career ]  [ (•) Finances ]  [ Scrutiny ]     |  <-- Segmented Tabs
+-------------------------------------------------------+
|                                                       |
|  FEC CAMPAIGN FINANCE OVERVIEW (Q3 2026):             |
|  • Gross Raised:       $10,900,000                    |
|  • Gross Spent:        $6,680,000                     |
|  • Cash on Hand:       $4,470,125  (+$1.92M Lead)     |
|  • Small-Dollar Ratio: 28% (<$200 donations)          |
|                                                       |
|  SUPER PAC AIR COVER & OUTSIDE INDEPENDENT SPENDING:  |
|  • Senate Leadership Fund (SLF):  $38,000,000 buy     |
|  • Americans for Prosperity PAC:  $12,500,000 buy     |
|  • Great Lakes Conservative PAC:  $6,200,000 buy      |
|                                                       |
|  CORPORATE & REVOLVING-DOOR SCRUTINY:                 |
|  Democrats target wife Kristi Rogers' $1B State Dept  |
|  security contract with Aegis LLC while Rogers        |
|  chaired House Intelligence Committee.                |
|                                                       |
|  [ Close Dossier ]       [ Select for Ballot Plan ]   |
+-------------------------------------------------------+
|  [Swipe Down / Esc] -> Dismisses sheet to parent view |
+-------------------------------------------------------+
```

---

## 8. Modal Screen 7: Offline Booth Reference Pass (`offline-ballot-pass`)

```text
+-------------------------------------------------------+
|  OFFICIAL VOTING BOOTH REFERENCE PASS                 |
|  VoterLens Michigan • Non-Partisan Elector Card       |
+-------------------------------------------------------+
|                                                       |
|  ELECTION DAY: Tuesday, November 3, 2026              |
|  POLLING HOURS: 7:00 AM – 8:00 PM                     |
|                                                       |
|  PRECINCT: White Lake Township Hall, Precinct 2       |
|  ADDRESS:  7525 Highland Rd, White Lake, MI 48383     |
|                                                       |
|  ---------------------------------------------------  |
|  YOUR SAVED BALLOT CHOICES:                           |
|  [X] U.S. SENATE: DR. ABDUL EL-SAYED (DEMOCRAT)       |
|  ---------------------------------------------------  |
|                                                       |
|  REQUIRED PHOTO ID CHECKLIST (Bring one):             |
|  [V] Michigan Driver's License or State ID            |
|  [ ] U.S. Passport or Military Photo ID               |
|  [ ] Approved College Student Photo ID                |
|  (Note: Voters without ID can vote via sworn affidavit|
|   under Michigan Election Law Act 116).               |
|                                                       |
|  LEGAL NOTICE: Compliant for personal in-booth        |
|  reference in accordance with Michigan Bureau rules.  |
|                                                       |
|  [ Add to Apple Wallet ]      [ Print 3x5 Card ]      |
+-------------------------------------------------------+
|  [Done / Close] -> Returns to Ballot Navigator        |
+-------------------------------------------------------+
```
