# 05. Candidate and Elected-Official Public-Record Stack: Identity, Campaign Finance, and Voting Records

**Verified as of:** 2026-10-15  
**Document Purpose:** This guide provides the complete directory of authoritative resources for researching who federal candidates and elected officials are, their campaign money trails, and their formal legislative voting records. It covers the non-disclosure half of Track B, establishing primary government registries, open APIs, derived civic-tech platforms, and practical data retrieval strategies.

---

## 1. Identity, Biographical, and Official Roster Infrastructure

Establishing an unambiguous, unique authority record for a candidate or elected official is the mandatory first step before attempting campaign finance or ethics cross-referencing. Federal officials and candidates are identified across disparate systems using specific identifier keys:
* **Bioguide ID:** The alphanumeric identifier assigned by the Library of Congress and the House/Senate historical offices (e.g., `S000033` for Bernie Sanders; `P000197` for Nancy Pelosi).
* **FEC Candidate ID:** A 9-character code assigned by the Federal Election Commission indicating chamber, state, district, and election cycle (e.g., `S4MI00356`).
* **GovTrack ID / Voteview ID:** Numerical keys used by academic and civic-tech data structures to track longitudinal legislative behavior.

### 1.1 Authoritative Identity and Roster Directory

| Resource Name | Administering Authority | Coverage Scope | Primary URLs | Formats & Access | Official Identifier Keys |
|---|---|---|---|---|---|
| **Biographical Directory of the U.S. Congress** | Historians of the House and Senate / Library of Congress | All 13,000+ individuals who have served in the Continental Congress, U.S. Senate, or House from 1774 to present. | https://bioguide.congress.gov/ | **FREE** (Web search, structured JSON via Congress.gov API) | Bioguide ID |
| **Congress.gov Member Directory** | Library of Congress | Current and historical members of the U.S. House of Representatives and U.S. Senate. | https://www.congress.gov/members | **FREE** (Web search, XML and JSON API via Congress API) | Bioguide ID, LIS ID |
| **House of Representatives Member Directory** | Office of the Clerk of the U.S. House | All 435 voting Representatives and 6 non-voting Delegates/Commissioners currently serving. | https://clerk.house.gov/Members | **FREE** (Interactive web directory, downloadable XML roster) | House Member ID, Bioguide ID |
| **U.S. Senate Member Roster** | Secretary of the Senate | All 100 currently serving U.S. Senators, committee assignments, and class designations. | https://www.senate.gov/senators/ | **FREE** (Web tables, XML feed at `senators.xml`) | Senate Member ID, Bioguide ID |
| **Official Congressional Directory** | Government Publishing Office (GPO) | Comprehensive directory of current members, committee staff, executive agency liaison officers, and press corps. | https://www.govinfo.gov/app/collection/cdir | **FREE** (Searchable PDF volumes, full-book downloads) | GPO Document ID |

---

## 2. Campaign Finance Infrastructure

The Federal Election Commission (FEC) is the exclusive national regulatory authority governing money in federal political campaigns (presidential, U.S. Senate, and U.S. House of Representatives). By federal statute (Federal Election Campaign Act, 52 U.S.C. § 30101 et seq.), every federal candidate, political action committee (PAC), party committee, and Super PAC must disclose all receipts and disbursements exceeding statutory thresholds.

### 2.1 Primary Campaign Finance Resources

| Platform / Tool | Administering Entity | Data Ingested | Primary URLs | Technical Parameters & Access |
|---|---|---|---|---|
| **FEC Candidate & Committee Search** | Federal Election Commission | Raw financial filings, quarterly reports (Form 3/3P/3X), Statement of Candidacy (Form 2), Statement of Organization (Form 1). | https://www.fec.gov/data/ | **FREE** (Universal public web access, PDF image viewers, interactive donor search). |
| **openFEC REST API** | Federal Election Commission / 18F | Structured endpoints for candidate totals, individual contributions, committee filings, schedule A receipts, and schedule B disbursements. | https://api.open.fec.gov/developers/ ; Swagger: https://api.open.fec.gov/swagger | **FREE-KEY** (Free key via `api.data.gov`; 1,000 req/hour standard; `DEMO_KEY` capped at 40 req/hour; 100 records/page max). |
| **FEC Bulk Data Download Service** | Federal Election Commission | Nightly and historical bulk flat files containing master candidate lists, PAC contributions to candidates, and all Schedule A individual transactions. | https://www.fec.gov/data/browse-data/?tab=bulk-data | **FREE** (Direct ZIP file archives, pipe-delimited text tables, data dictionaries provided back to 1980). |
| **OpenSecrets (Center for Responsive Politics)**| Center for Responsive Politics (Nonprofit) | Standardized campaign finance profiles, industry sector donor breakdowns, dark money tracing, revolving-door tracking, and outside spending. | https://www.opensecrets.org/ | **FREEMIUM** (Web search is 100% free; developer API provides free tier with 200 calls/day; bulk academic data requires registration). |
| **FollowTheMoney (OpenSecrets State Data)** | National Institute on Money in Politics | State-level campaign contributions, gubernatorial races, state legislative fundraising, and ballot measure campaign finance. | https://www.followthemoney.org/ | **FREEMIUM** (Open public web lookup; cross-jurisdictional database tools). |

### 2.2 Core Federal Campaign Finance Filing Types

* **FEC Form 1 (Statement of Organization):** Filed by a political committee upon formation, designating its treasurer, bank depositories, and affiliated entities.
* **FEC Form 2 (Statement of Candidacy):** Filed within 15 days of an individual raising or spending in excess of $5,000, formally establishing their candidacy, designating their principal campaign committee, and assigning their official FEC Candidate ID.
* **FEC Form 3 (Report of Receipts and Disbursements - House/Senate):** Filed quarterly (and pre-primary/pre-general) by congressional campaign committees detailing itemized contributions from individuals ($200+ threshold), transfers from party committees, PAC contributions, and campaign expenditures.
* **FEC Form 3P (Report of Receipts and Disbursements - Presidential):** The presidential equivalent of Form 3, tracking nationwide contributions, federal matching funds (if accepted), state-by-state spending, and debt obligations.
* **FEC Form 3X (Report of Receipts and Disbursements - PACs and Parties):** Filed by non-candidate political committees (traditional PACs, Super PACs, leadership PACs, party committees) disclosing receipts, independent expenditures, and contributions to candidates.
* **Schedule A (Itemized Receipts):** The granular ledger attached to Forms 3/3X itemizing every contribution over $200 with the donor's full name, mailing address, employer, occupation, transaction date, and dollar amount.
* **Schedule B (Itemized Disbursements):** The expenditure ledger detailing campaign vendor payments, consultant fees, travel, media production, and staff payroll.

---

## 3. Legislative Voting Records and Ideological Scorecards

Tracking an elected official's formal legislative voting record separates rhetorical political claims from binding statutory votes. Official voting records are maintained directly by the House Clerk and Senate Legislative Desk, while academic and civic-tech platforms normalize roll calls into longitudinal ideological indices.

### 3.1 Voting Records and Legislative Tracking Directory

| Platform / Tool | Administering Entity | Coverage & Analytical Focus | Primary URLs | Technical Parameters & Access |
|---|---|---|---|---|
| **House Roll Call Votes** | Office of the Clerk, U.S. House | Official recorded roll call votes for all House legislation, amendments, procedural motions, and veto overrides. | https://clerk.house.gov/Votes | **FREE** (Interactive web search, downloadable XML files per roll call vote back to 1990). |
| **Senate Roll Call Votes** | Secretary of the Senate (LIS) | Official recorded roll call votes for all Senate measures, executive nominations, treaties, and cloture motions. | https://www.senate.gov/legislative/LIS/roll_call_lists/ | **FREE** (Web tables, XML files organized by session and vote number back to 1989). |
| **Congress.gov Legislative Database** | Library of Congress | Comprehensive statutory text, bill amendments, member sponsorship/co-sponsorship, and committee markup reports. | https://www.congress.gov/ | **FREE** (Public search, full text downloads, Congress API integration). |
| **GovTrack.us** | Civic Impulse LLC (Civic Tech) | Legislative tracking, missed-vote statistics, bill enactment prognostication, committee leadership tracking, and voting party-loyalty scores. | https://www.govtrack.us/ | **FREE** (Open web search, open-source data scraping pipelines via GitHub `unitedstates/congress`). |
| **Voteview (UCLA Department of Political Science)**| UCLA / Poole & Rosenthal | Quantitative spatial modeling of roll call voting behavior; calculates **DW-NOMINATE** ideological dimension scores (Liberal vs Conservative). | https://voteview.com/ | **FREE** (Direct CSV downloads of member ideology scores, complete roll call database from 1789 to present). |

---

## 4. End-to-End Worked Example: Tracing a Federal Official Across the Public-Record Stack

To demonstrate how these independent public resources cross-reference to construct a comprehensive profile of an elected official, consider a multi-track investigation of **U.S. Senator Gary Peters (D-MI)**:

### Step 1: Establish Authority Keys in Identity Infrastructure
1. Navigate to the **Biographical Directory of the U.S. Congress** (`bioguide.congress.gov`) and search "Gary Peters".
2. Extract the canonical **Bioguide ID:** `P000595`.
3. Note his historical trajectory: U.S. Representative (MI-09, MI-14) 2009-2015; U.S. Senator 2015-present.
4. Cross-reference with the Senate Roster (`senate.gov`), confirming Class II Senator, Chairman of the Homeland Security and Governmental Affairs Committee.

### Step 2: Extract Campaign Finance Intelligence (FEC)
1. Open the **FEC Candidate Search Portal** (`fec.gov/data/`) and query Bioguide `P000595` or Name "Peters, Gary".
2. Locate official **FEC Candidate IDs:** `S4MI00356` (Senate) and `H8MI09068` (House historical).
3. Identify Principal Campaign Committee: **Peters for Michigan** (`C00543736`).
4. Query the **openFEC API** to pull structured campaign receipts:
   ```text
   GET https://api.open.fec.gov/v1/candidate/S4MI00356/totals/?api_key=YOUR_KEY
   ```
5. Review Schedule A individual filings to identify top geographic donor concentrations, and Schedule B for principal media consulting disbursements.
6. Open **OpenSecrets.org** to inspect donor sector breakdown: view top contributing industries (e.g., Lawyers/Law Firms, Securities & Investment, Health Professionals) and Leadership PAC receipts (**Blue Senate PAC**).

### Step 3: Audit Formal Legislative Voting Record
1. Navigate to **Senate Roll Call Lists** (`senate.gov/legislative/LIS/roll_call_lists/`) or **Congress.gov**.
2. Query votes cast during the 118th Congress: filter for key nominations, fiscal debt ceiling votes, and national defense authorization roll calls.
3. Open **Voteview.com** and search "Gary Peters" or Member ID `20923`.
4. Review his **DW-NOMINATE Score:** Dimension 1 (Economic ideology: -0.245, classifying him as a moderate-mainstream Democrat); review his party-line voting percentage (voting with the Democratic majority ~98% of the time).

### Step 4: Cross-Reference Personal Financial Disclosures (Bridging to WS-11)
1. Take Senator Peters' authority identity into the **U.S. Senate Electronic Financial Disclosure (eFD) Portal** (`efdsearch.senate.gov`).
2. Accept the statutory EIGA public inspection terms.
3. Search "Peters", "Gary", selecting "Senator" filer status.
4. Retrieve his annual **CY 2024 / CY 2025 Financial Disclosure Reports** (disclosing assets, non-federal retirement accounts, real estate holdings) and review any filed **Periodic Transaction Reports (PTRs)** for timely reporting of securities sales.

---

## 5. Practical Access Quirks, Data Hygiene, and Machine Limitations

Researchers and automated civic-tech developers must account for several structural anomalies documented across federal candidate data portals:

### 5.1 Machine Reachability Quirks and API Gateway Timeouts
* **openFEC API Timeouts on Heavy Endpoints:** Querying granular Schedule A individual receipt endpoints without tight date filtering (`two_year_transaction_period`) or page size constraints frequently triggers HTTP 504 Gateway Timeouts from the `api.data.gov` umbrella. Developers should query candidate totals endpoints first before paginating deep contribution ledgers.
* **Congress.gov Rate Limiting:** The Congress.gov API strictly enforces its 1,000 request/hour limit. Recursive scripts pulling full-text bill versions or roll call tallies must incorporate token-bucket throttling and sleep timers.

### 5.2 Aggregator Bot-Detection Walls and Data Cleansing Delays
* **GovTrack / Third-Party Scraper Blocks:** Several civic transparency websites employ Cloudflare bot-management walls that block headless automated scripts (e.g., standard Python `urllib` or unconfigured `requests` calls). Using standard headers with valid `User-Agent` strings or utilizing the underlying open-source data repositories directly from GitHub (`github.com/unitedstates/congress-legislators`) circumvents these blocks.
* **FEC Ingestion Lag:** While electronic filings appear on the FEC website within 15 to 30 minutes of transmission by a campaign, bulk normalized data tables and openFEC API endpoints operate on a 24- to 48-hour data-processing lag. During quarterly filing deadlines (e.g., April 15, July 15, October 15, January 31), heavy site traffic can slow down query response times.
