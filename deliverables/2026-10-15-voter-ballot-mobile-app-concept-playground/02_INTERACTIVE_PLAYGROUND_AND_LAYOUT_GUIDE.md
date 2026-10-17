# VoterLens: Michigan 2026 — Interactive Playground & Layout Guide
## Exploration of 4 Mobile UX Paradigms for Civic Intelligence
**Publication Date:** October 15, 2026  
**Deliverable Subfolder:** `deliverables/2026-10-15-voter-ballot-mobile-app-concept-playground/`  
**Companion Interactive HTML Application:** [`index.html`](file:///d:/stuff/ai-misc/_bsh2026/vscode_project01/46-wide_research_test_gemini/deliverables/2026-10-15-voter-ballot-mobile-app-concept-playground/index.html)  

---

## 1. Overview of the Interactive Playground

To enable immediate tactile evaluation of different voter experience concepts, the VoterLens package includes a fully functional, self-contained interactive playground ([`index.html`](file:///d:/stuff/ai-misc/_bsh2026/vscode_project01/46-wide_research_test_gemini/deliverables/2026-10-15-voter-ballot-mobile-app-concept-playground/index.html)). Built using modern web standards (vanilla HTML5, CSS custom properties, and modular JavaScript), it runs entirely within any modern browser with zero server setup or build tooling required.

The playground embeds a realistic **Mobile Device Simulator Frame** (modeling an iPhone 16 Pro / Google Pixel 9 Pro form factor) with:
- **Interactive Bezel Frame:** Realistic Dynamic Island / Camera Punch-Hole, live status bar (time `10:27`, battery 98%, 5G cellular indicators), and swipeable home indicator.
- **Top Playground Control Deck:**
  - **Layout Mode Switcher:** Instant toggling between the 4 layout archetypes (`Civic Reel`, `Decision Matrix`, `Ballot Navigator`, `Civic Radar`).
  - **Theme Engine:** Instant switching between **Dark Obsidian** (default high-elegance dark mode), **Civic Light** (crisp editorial white), and **High Contrast** (yellow/cyan on black for outdoor booth legibility).
  - **Device Bezel Toggle:** Switch between a framed mobile device simulator and full-width responsive preview.
  - **Precinct Quick-Switcher:** Switch between Wayne County (Detroit), Oakland County (White Lake / Troy), Macomb County (Warren), Kent County (Grand Rapids), and Ingham County (Lansing).

---

## 2. The 4 Layout Archetypes in Depth

### 2.1 Layout Archetype 1: "Civic Reel / Pulse Wire" (Kinetic Card Stream)
- **Design Philosophy:** Modern citizens consume information in vertical, card-based bursts. The Civic Reel combines breaking campaign appearances (such as the upcoming Oct 16–Nov 3 tour stops) with verbatim audio soundbites from the Grand Rapids televised debate.
- **Key UI Elements:**
  - **Audio Waveform Cards:** Interactive play/pause buttons with animated CSS sound waves displaying authentic quotes from candidates on EV mandates, healthcare, and residency.
  - **Fact-Check Badges:** Collapsible context boxes providing objective data (e.g., verifying insulin manufacturing costs or clarifying EPA tailpipe emission rules).
  - **Upcoming Campaign Trail Alerts:** Badges highlighting events occurring in the voter's local media market (e.g., Rogers' Warren rally or El-Sayed's Wayne State kickoff).
- **Ideal For:** Rapid morning briefings, young voters, and commuters seeking 30-second factual updates without political spin.

### 2.2 Layout Archetype 2: "Decision Matrix / Split Horizon" (Deep Analytical Comparison)
- **Design Philosophy:** Serious voters need to compare candidates point-by-point without having to flip back and forth between two separate websites or PDF brochures.
- **Key UI Elements:**
  - **Sticky Candidate Header Bar:** Locks candidate avatars (Dr. Abdul El-Sayed - Dem vs. Mike Rogers - Rep), party colors, and key stats at the top of the viewport during vertical scrolling.
  - **18-Point Issue Carousel:** Horizontally scrollable category pills allowing voters to filter directly to `Auto & EV Mandates`, `Healthcare`, `Abortion & Prop 3`, `Energy & Line 5`, `Taxes`, `China & Tech`, and `Campaign Finance`.
  - **Neutral Contrast Summary:** Beneath each candidate's stance, a neutral editorial takeaway highlights the fundamental philosophical choice.
  - **Campaign Finance Ledger:** Real-time visualization of FEC disclosures ($14.51M raised with 58% small-dollar vs. $10.90M raised with 28% small-dollar and high corporate PAC backing).
- **Ideal For:** Analytical independents, undecided voters, and policy researchers conducting comprehensive due diligence.

### 2.3 Layout Archetype 3: "Precision Ballot Navigator" (Task-Oriented Digital Ballot & Action Plan)
- **Design Philosophy:** The ultimate objective of civic intelligence is casting an informed vote. The Ballot Navigator replicates the certified Michigan General Election ballot.
- **Key UI Elements:**
  - **Interactive Candidate Radio Cards:** Clear candidate selection cards for Class II United States Senate, displaying full name, ballot designation, and career background.
  - **Certified Minor-Party Inclusion:** Accurately presents Green Party candidate Douglas P. Marsh, Libertarian candidate Lydia Christensen, and U.S. Taxpayers candidate Timothy Long.
  - **Interactive Selection Progress Tracker:** Progress bar updates dynamically as the voter reviews races.
  - **Export Offline Booth Reference Pass:** Generates a clean, high-contrast digital card detailing the voter's chosen candidates, polling location address, voting hours (7 AM - 8 PM), and acceptable photo IDs.
- **Ideal For:** Voters preparing their choices 1 to 3 days before Election Day to carry into the polling precinct.

### 2.4 Layout Archetype 4: "Civic Radar & District Explorer" (Geospatial & Polling Intelligence)
- **Design Philosophy:** Politics is shaped by regional culture and geography. The Civic Radar provides an interactive window into Michigan's polarized landscape.
- **Key UI Elements:**
  - **5-Axis Policy Radar Chart:** Dynamic SVG polygon comparing candidate alignment across Economy, Healthcare, Green Mobility, National Security, and Civil Rights.
  - **Michigan District Selector (MI-01 to MI-13):** Interactive pills allowing users to inspect polling crosstabs and local issues across all congressional districts (e.g., Detroit urban core El-Sayed +46% vs. Macomb auto belt Rogers +11% vs. Oakland suburban revolt El-Sayed +11%).
  - **The Trump Gravity Slider:** An interactive slider that models how Donald Trump's endorsement affects turnout and margins in rural outstate counties compared to suburban centers.
- **Ideal For:** Political observers, educators, and voters interested in understanding the broader electoral dynamics of Michigan.

---

## 3. Playground Control Deck & Interactions Matrix

| Control Element | Location | User Action | System Feedback & State Change |
| :--- | :--- | :--- | :--- |
| **Layout Switcher** | Top Playground HUD | Tap `Reel`, `Matrix`, `Ballot`, or `Radar` | Smoothly morphs mobile simulator view container without page reload. |
| **Theme Selector** | Top Playground HUD | Tap `Obsidian`, `Civic Light`, or `High Contrast` | Swaps CSS design tokens instantly across all screens and components. |
| **Bezel Toggle** | Top Playground HUD | Click `Bezel: ON / OFF` | Toggles realistic mobile phone frame on desktop screens. |
| **Precinct Switcher** | Top Bar in Mobile Frame | Select County Dropdown | Re-keys local ballot candidates, polling hours, and district polling focus. |
| **Audio Soundbite Play** | Story Cards in Civic Reel | Click/Tap Play Icon | Starts simulated audio playback with animated sound wave bars and time counter. |
| **Policy Matrix Filter** | Decision Matrix Header | Tap Topic Pill (e.g. `Auto & EV`) | Filters matrix to show only the selected issue domain with source citations. |
| **Ballot Radio Check** | Ballot Navigator Cards | Tap Candidate Card | Animates radio checkmark, plays haptic tick, and updates ballot progress counter. |
| **Export Booth Pass** | Bottom of Ballot Navigator | Tap `Export Booth Reference Pass` | Opens high-contrast modal summary formatted for phone screen or printing. |
| **Trump Gravity Slider** | Civic Radar View | Drag range thumb left/right | Dynamically recalculates district margins and Trump net favorability meters. |

---

## 4. Theme System & Color Palette Specifications

The playground implements three curated design themes engineered for maximum aesthetic appeal and accessibility:

### 4.1 Theme 1: Dark Obsidian (Default)
- **Background Primary:** `#090D16` (Deep slate obsidian)
- **Card Surface:** `#111827` (Rich dark charcoal)
- **Border Subtle:** `#1F2937`
- **Text Main:** `#F3F4F6` (High-legibility soft white)
- **Text Muted:** `#9CA3AF`
- **Accent Primary:** `#38BDF8` (Electric sky blue)
- **Democratic Accent:** `#2563EB` (Vibrant royal blue)
- **Republican Accent:** `#DC2626` (Vibrant crimson red)
- **Aesthetic Feel:** Premium, modern, futuristic, battery-efficient OLED dark mode.

### 4.2 Theme 2: Civic Light (Editorial White)
- **Background Primary:** `#F8FAFC` (Clean off-white)
- **Card Surface:** `#FFFFFF` (Pure white card with soft drop shadow)
- **Border Subtle:** `#E2E8F0`
- **Text Main:** `#0F172A` (Deep slate black)
- **Text Muted:** `#475569`
- **Accent Primary:** `#0284C7` (Classic civic cobalt)
- **Aesthetic Feel:** Trustworthy, crisp, journalistic, high readability under direct daylight.

### 4.3 Theme 3: High Contrast (Civic Accessibility)
- **Background Primary:** `#000000` (Pure pitch black)
- **Card Surface:** `#0B0B0B` (Outlined with `#FACC15` gold borders)
- **Text Main:** `#FFFFFF` (Pure white)
- **Accent Primary:** `#FACC15` (High-visibility yellow)
- **Democratic Accent:** `#60A5FA` (Light cyan blue)
- **Republican Accent:** `#F87171` (Light salmon red)
- **Aesthetic Feel:** Engineered specifically for low-vision electors or glare conditions in voting booths. Meets WCAG AAA 7:1+ contrast thresholds.

---

## 5. Technical Architecture & File Organization

The playground is architected as a lightweight, zero-dependency client application:
- **`index.html`**: Contains semantic HTML markup, embedded CSS styling with design tokens, and modular JavaScript classes.
- **Local State Store:** Uses a lightweight reactive state object (`AppState`) that tracks active layout, selected theme, precinct ZIP code, ballot selections, and audio playback status.
- **Zero Framework Dependency:** Operates cleanly in all modern browsers (Chrome, Safari, Firefox, Edge) without requiring Node.js, Webpack, or external CDN connections.
- **Portability:** Can be distributed as a single HTML file or hosted on any static web server / GitHub Pages repository.
