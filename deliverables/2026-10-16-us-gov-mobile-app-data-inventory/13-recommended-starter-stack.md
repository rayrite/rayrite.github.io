## 7. Recommended Starter Stack (2-Week Solo MVP)

### Architectural Strategy: Maximum Coverage, Zero Cost, Minimal Auth Friction

For a solo full-stack developer operating on a 2-week build sprint with an operating budget of **$0**, the primary danger is 'authentication sprawl'—spending days registering for API keys, negotiating developer access, reading divergent SDKs, and managing token refreshes. A successful MVP stack must meet three rigorous criteria:

1. **Unified Authentication:** Leverage umbrella keys (specifically `api.data.gov` and `Google Cloud`) that unlock multiple federal and civic APIs simultaneously.

2. **Zero-Key Open Endpoints:** Anchor high-frequency features in endpoints that require zero authentication (Treasury Fiscal Data, Federal Register, Detroit SODA, GDELT).

3. **100% Jurisdictional Coverage:** Ensure every one of the user's nine required categories is served by an authoritative primary source.

We recommend the following **8-source production starter stack**:

| SOURCE | PRIMARY CATEGORY | CORE DATA POINTS DELIVERED | AUTH MODEL | ESTIMATED BUILD TIME |
| :--- | :--- | :--- | :--- | :---: |
| 1. Bureau of the Fiscal Service API | Cat 1: National Fiscal Data | Debt to the Penny, Daily Treasury Statement (cash balance), Monthly deficit. | None (Open REST) | 1 Day |
| 2. Congress.gov API v3 | Cat 2: Congressional Activity | Active bills, legislative actions, member directories, roll-call summaries. | api.data.gov Key | 2 Days |
| 3. Federal Register API v1 | Cat 3: Executive Branch | Executive Orders, Proclamations, Final Rules, Public Inspection pre-releases. | None (Open REST) | 1 Day |
| 4. CourtListener API v4 (Free Law Project) | Cat 4: Judicial — Federal Courts | Supreme Court opinions/dockets, federal appellate dockets, judge biographies. | Free API Token | 2 Days |
| 5. Google Civic Info API + Census Geocoder | Cat 5: Electoral & Cat 6: Voter Info | Address-to-representatives lookup (all tiers), district geocoding, polling places. | Google Cloud Key / None | 2 Days |
| 6. FEC Open API v1 | Cat 7: Campaign Finance | Candidate fundraising totals, Super PAC independent expenditures, donor search. | api.data.gov Key | 2 Days |
| 7. GDELT 2.0 DOC API + Fact Check Tools | Cat 8: News & Public Sentiment | News volume timelines, emotional tone sentiment, ClaimReview fact-checks. | None / Google Cloud Key | 2 Days |
| 8. City of Detroit Open Data SODA API + OpenStates | Cat 9: Michigan / Detroit Local | Detroit council districts, 311 issues, budget checks; Michigan state bills & votes. | None (SODA) / OpenStates Key | 2 Days |


### 2-Week Solo Sprint Implementation Schedule

To ship a fully functioning cross-platform mobile app (React Native / Flutter) within 14 days, the build sequence should follow a modular data-pipeline progression:

- **Day 1: Project Scaffolding & Shared Data Spine:** Initialize repository, configure mobile navigation (Bottom Tab Bar: Fiscal, Congress, Executive, Courts, Local/Voter), and obtain unified `api.data.gov` and Google Cloud keys.

- **Day 2: National Fiscal Dashboard (Cat 1):** Connect `fiscaldata.treasury.gov`. Render Debt to the Penny, cash balance, and implement the client-side 60Hz interpolated debt ticker with transparency badge.

- **Day 3-4: Congressional Activity & Member Directory (Cat 2):** Connect `api.congress.gov/v3`. Render search interface for active 119th Congress bills, legislative action timelines, and bundle `unitedstates/congress-legislators` YAML for instant offline member photos and bios.

- **Day 5: Executive Branch Feed (Cat 3):** Connect `federalregister.gov/api/v1`. Render filtered feed of Executive Orders and Public Inspection pre-releases. Add White House RSS feed parser.

- **Day 6-7: Federal Courts & SCOTUS Tracker (Cat 4):** Connect `courtlistener.com/api/rest/v4/`. Implement Supreme Court docket and slip opinion reader with PDF viewing links.

- **Day 8-9: Voter Information & Geocoding (Cat 5 & Cat 6):** Connect Census Geocoder and Google Civic Information API. Enable single-input address search displaying federal, state, and county elected officials.

- **Day 10-11: Campaign Finance Deep Dive (Cat 7):** Connect `api.open.fec.gov`. Display candidate fundraising totals, cash-on-hand bars, and top Super PAC independent expenditure ad buys.

- **Day 12: News Trends & Fact-Checking (Cat 8):** Connect GDELT DOC API and Google Fact Check Tools. Render news coverage volume charts and searchable politician ClaimReview cards.

- **Day 13: Detroit & Michigan Local Center (Cat 9):** Connect `data.detroitmi.gov` SODA API and OpenStates v3. Render Detroit City Council districts (GeoJSON on native map), 311 service tickets, and Michigan State Senate bills.

- **Day 14: Polish, Local Storage Caching & Table QC:** Implement SQLite/AsyncStorage offline caching, error boundaries, rate-limit defenses, and execute final end-to-end quality control.

### Sources Intentionally Excluded from MVP (And Rationale)

| EXCLUDED SOURCE | PRIMARY REASON FOR EXCLUSION | RECOMMENDED POST-MVP ROADMAP |
| :--- | :--- | :--- |
| Associated Press (AP Elections API) | Prohibitive B2B enterprise pricing ($15k-$100k+); requires corporate procurement. | Adopt in v2 when institutional election-night media sponsorship is secured. |
| Decision Desk HQ (DDHQ) | Commercial license required ($5k-$25k); unnecessary for off-cycle MVP development. | Integrate prior to major general election cycles for real-time WebSocket feeds. |
| PACER Direct Mobile Integration | Per-page paywall ($0.10/page) risks catastrophic runaway charges for mobile users. | Never connect public mobile clients directly; use CourtListener/RECAP. |
| X (Twitter) API v2 | Restricted access; basic tier costs $100/mo for only 10k tweets; free tier write-only. | Replace permanently with open Reddit Public JSON API and GDELT 2.0. |
| Cook Political Report API | Commercial paywall ($350+/year subscription); proprietary redistribution restrictions. | Substitute with Sabato's Crystal Ball academic nonpartisan race ratings. |
| ProPublica Congress API v1 | Deprecated in favor of official Congress.gov API v3; scraping engine experiences lag. | Standardize permanently on official Library of Congress API v3. |


## 8. Flagged Changes Appendix (Re-Verification Audit as of 2026-10)

This appendix documents breaking changes, API version migrations, vendor rebrandings, and structural policy shifts that have occurred across the civic data ecosystem, alerting software engineers to historical traps:

1. **Congress.gov API v3 Definitive Consolidation:** Legacy civic documentation frequently references Sunlight Congress API or ProPublica Congress API v1. Developers must note that `api.congress.gov/v3/` is now the official, federally funded standard. Old ProPublica endpoints should be considered legacy and deprecated.

2. **Google Civic Information API Endpoint Deprecations:** Google formally deprecated the stand-alone `/divisions` endpoint and removed legacy civic contest fields. The primary operational endpoint is `/representatives`, which embeds OCD-IDs inside each office record. Furthermore, developers must remember that the `/voterinfo` endpoint returns HTTP 400/404 during off-election periods when no `electionId` is active.

3. **FiveThirtyEight Reorganization & Archive Migration:** Following ABC News's restructuring of FiveThirtyEight and Nate Silver's departure to *Silver Bulletin* (Substack), historical 538 polling data and model code were transitioned to static maintenance on GitHub (`github.com/fivethirtyeight/data`). Commercial applications should not rely on five-thirty-eight.com for live API feeds.

4. **Caselaw Access Project (case.law) Transition to Public Domain:** Harvard Law School's Caselaw Access Project completed its digitization mandate and commercial embargo. In 2024, the entire 360-year corpus (6.7 million cases) was transitioned to public domain bulk downloads on AWS Open Data, while the live search API was retired in favor of open bulk downloads.

5. **X (Twitter) API Commercial Lockout:** Third-party developer access to X (Twitter) was completely overhauled into high-cost commercial tiers ($100/mo Basic, $5,000/mo Pro). Free academic and civic research tiers were largely eliminated, making Reddit's public JSON interface the primary zero-cost civic social stream.

6. **Federal Register API Stability:** While the Federal Register API documentation resides under `/api/v1/`, the Office of the Federal Register actively updates this endpoint, and it handles 100% of production traffic. Developers should not await a 'v2' release before integrating.

7. **City of Detroit Open Data SODA Migration:** Detroit's Open Data portal continues to run on Tyler Technologies' Socrata platform, supporting SODA 2.0 endpoints. Developers must ensure they query endpoints using the new 4x4 dataset identifiers (e.g. `wwhw-k27h` for council districts).

## 9. Risks, Limitations, and Evidence Gaps

### Known Technical Risks & Engineering Mitigations

1. **Mobile Rate-Limiting Throttling:** Direct client calls from thousands of mobile devices sharing cellular IP ranges (e.g. carrier NAT) can trigger IP-based rate limiting on government servers. *Mitigation:* Cache all public datasets in a centralized application Redis / edge cache; mobile clients should query the edge cache rather than hitting government origins directly.

2. **Election-Window Data Gaps:** During off-election months, polling place locators and sample ballot APIs return empty datasets. *Mitigation:* Implement defensive UI states in the mobile app: when no election is scheduled, display permanent clerk contact directories, voter registration verification tools, and redistricting maps rather than blank screens.

3. **Scraped Endpoint Fragility:** State portals (such as Michigan MVIC and legislative session tables) lack formal JSON REST APIs and rely on HTML web forms. *Mitigation:* Encapsulate state-level lookups in clean in-app mobile WebViews or link out to official government domains rather than attempting brittle backend web scrapers that fail upon DOM redesigns.
