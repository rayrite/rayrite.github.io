# Deliverable J: Gaps, Access Barriers, and Data Acquisition Queue
## Systematic Register of Omissions, Restricted Repositories, and Public Records Strategy

**Document Identifier:** `CIVIC-DOC-09-GAPS-QUEUE`  
**Research Execution Date:** October 17, 2026  
**Cycle Scope:** 2026 Midterm Cycle and Continuous Data Acquisition Pipeline  

---

## 1. Comprehensive Civic Information Gap Register

In conformance with Section 10 and Section 16.J of the handoff specification, this gap register catalogs verified systemic coverage voids, paywalled barriers, and digital omissions identified during multi-pass research:

| Gap Identifier | Jurisdiction | Topic Domain | Missing Element Description | Operational Impact | Recommended Acquisition Strategy | Priority |
|---|---|---|---|---|---|---|
| `GAP-MUNI-ORD-RURAL` | Nationwide Rural | Legislation (Local) | Municipal codes & council minutes for ~12,000 small towns (<10k pop) exist only in print binders or scanned PDFs. | High: Local ordinances cannot be searched or cross-referenced programmatically. | Partner with state municipal leagues; deploy targeted OCR scrapers on town clerk PDF portals. | `P2_High` |
| `GAP-GA-PEACHCOURT` | Georgia (`GA`) | Courts & Dockets | State trial court dockets locked behind private vendor paywall (PeachCourt / GreenCourt) charging $5+ per search. | Critical: Blocks automated public monitoring of county felony indictments and civil lawsuits. | Form institutional consortium with university law clinics; submit FOIA for bulk court indexes. | `P1_Critical`|
| `GAP-MI-LOCAL-CLERKS`| Michigan (`MI`) | Voting & Elections | Hyper-local polling place and drop box change logs across 1,520 municipal clerks lack a single unified feed. | High: Voters in townships risk missing last-minute drop box relocations. | Scrape Michigan Voter Information Center (MVIC) nightly; establish direct clerk automated email ingestion. | `P1_Critical`|
| `GAP-AZ-RECORDER-FEE`| Arizona (`AZ`) | Courts & Filings | Maricopa County Clerk of Superior Court requires paid subscription ($150+/yr) for full electronic docket text. | Medium: Restricts automated real-time docket verification for Phoenix trials. | License commercial access for Maricopa; ingest free appellate opinions via CourtListener. | `P2_High` |
| `GAP-VOTER-FILE-LAW` | Multi-State | Voting & Elections | State voter registration files (names, addresses, party) are subject to strict statutory commercial bans and steep fees ($500–$10k). | Legal: Direct voter list ingestion creates severe civil/criminal liability under state statutes. | Strict policy prohibition: Do not ingest voter files; ingest only non-PII voter eligibility rules and aggregate counts. | `P1_Critical`|
| `GAP-LOCAL-CAND-BIOS`| Nationwide Sub-Metro| Ballots & Candidates| School board, judicial retention, and small municipal candidates exhibit <35% survey response rates on national civic sites. | Medium: High voter drop-off down-ballot due to lack of candidate information. | Ingest local community newspapers, League of Women Voters printed guides, and candidate social filings. | `P2_High` |
| `GAP-DA-CHARGING-MEMO`| Nationwide Local | Prosecutors & Offices | Internal declination criteria, charging thresholds, and plea bargaining guidelines are withheld as non-public work product. | High: Obscures discretionary prosecutorial policy differences across neighboring judicial circuits. | Target major metropolitan DA offices with formal state open records requests for policy manuals. | `P2_High` |
| `GAP-HIST-PRINT-LOCAL`| Battleground Counties| Print Archives | 19th and early 20th-century local municipal legal notice gazettes exist exclusively on 35mm microfilm reels in county historical societies.| Low: Limits long-term historical research into 100-year municipal precedent. | Microfilm digitization grant proposals; index physical holding locations in master catalog. | `P3_Medium` |

---

## 2. Public Records (FOIA) Acquisition Queue

Where administrative agencies fail to publish machine-readable feeds, the engineering team must deploy targeted public records requests under state freedom of information statutes:

| Request ID | Target Agency | Applicable Statute | Specific Records Requested | Anticipated Agency Obstacle | Mitigation / Legal Strategy |
|---|---|---|---|---|---|
| `FOIA-MI-PRECINCTS` | Michigan Bureau of Elections | Michigan FOIA (MCL 15.231) | Current statewide GIS shapefile of all 1,520 municipal voting precinct boundaries and ward polygons. | Agency may claim it only maintains precinct boundary text descriptions, not GIS files. | Request underlying Qualified Voter File (QVF) GIS boundary layers under MCL 15.233. |
| `FOIA-GA-CURING-LOGS`| Georgia Secretary of State | GA Open Records (O.C.G.A. § 50-18-70) | County-level absentee ballot signature discrepancy notification logs, cure notices, and cured totals for 2024–2026. | Agency may claim voter privacy exemption or cite pending election litigation. | Request anonymized records redacted of voter personal identifiers; cite public election audit precedent. |
| `FOIA-PA-REJECT-COUNT`| PA Department of State | PA Right-to-Know (65 P.S. § 67) | Tabular breakdown of 2024–2026 provisional ballot rejections categorized by specific statutory defect across all 67 counties. | Counties report data in disparate formats; state may claim record non-existence. | File statewide request; appeal denials to Pennsylvania Office of Open Records (OOR). |
| `FOIA-NC-QUALIFYING` | NC State Board of Elections | NC Public Records (N.C.G.S. § 132) | Digital copies of all certified candidate nominating petitions, challenge filings, and qualification affidavits for 2026. | High copy fees or delayed processing times during active election filing season. | Mandate inspection and electronic transmission of existing digital records under § 132-6.2. |
| `FOIA-AZ-PROSECUTOR` | Maricopa County Attorney | AZ Public Records (A.R.S. § 39-121) | Internal written prosecution guidelines, diversion eligibility rules, and election crime referral intake logs. | Commercial use exemption or investigatory records privilege assertion. | File non-commercial civic transparency request; narrow scope to exclude active investigative files. |

---

## 3. Commercial Permission and Licensing Request Pipeline

To bridge gaps that cannot be resolved through free APIs or public records requests, the catalog team has established the following commercial outreach pipeline:

| Provider Name | Target Asset | Intended Application Use | Licensing Hurdle | Engagement Action |
|---|---|---|---|---|
| **Ballotpedia** | Data Client API (Geographic Endpoints) | Powering address-specific local sample ballots and school board candidate bios. | High annual enterprise subscription cost; domain whitelisting restrictions. | Negotiate educational / non-profit application tier; commit to strict anti-scraping safeguards. |
| **LegiScan LLC** | LegiScan Push API (Enterprise Webhooks) | Real-time state legislative tracking and roll-call voting alerts across all 50 states. | Premium subscription tier; attribution requirements on public displays. | Procure standard commercial subscription with Whitebox licensing add-on to remove co-branding. |
| **Free Law Project** | CourtListener Logical Database Replication | Direct PostgreSQL replication of federal dockets and judicial financial disclosures. | Monthly institutional infrastructure sponsorship requirement ($100–$500/mo). | Establish recurring monthly 501(c)(3) sponsorship to receive dedicated database replication slot. |
| **OpenSecrets** | Bulk Data Program (Commercial License) | Displaying federal lobbying networks and campaign funding profiles alongside candidates. | Free bulk data prohibits commercial monetization under CC BY-NC-SA 4.0 license. | Submit formal commercial licensing application to Center for Responsive Politics data team. |

---

## 4. Prioritized Next-Stage Research Roadmap

To advance this catalog toward full nationwide saturation, future research phases will execute across four prioritized milestones:

### Phase 1: High-Density Metropolitan Deepening (Months 1–3)
* Expand sub-state dossiers from the initial 14 battleground metropolitan centers to the top 100 U.S. metropolitan statistical areas (MSAs).
* Systematically crawl and map municipal code portals (CivicPlus/Municode, American Legal Publishing, General Code) across all cities with populations exceeding 100,000.

### Phase 2: State Trial Court Scraping Infrastructure (Months 4–6)
* Develop open-source court scraper modules for state trial court systems that provide unauthenticated public search interfaces (e.g., Wisconsin CCAP, Pennsylvania UJS, Oklahoma OSCN).
* Partner with the Free Law Project to contribute court scrapers to the upstream RECAP repository.

### Phase 3: Rural and Tribal Civic Information Mapping (Months 7–9)
* Map election administration protocols across all 574 federally recognized Native American tribes and Alaska Native villages.
* Document satellite voting offices, tribal ID acceptance statutes, and language assistance availability under Voting Rights Act § 203.

### Phase 4: Archival Depository Catalog Expansion (Months 10–12)
* Complete a comprehensive directory of physical print holdings for all 1,100 Federal Depository Library Program (FDLP) institutions.
* Catalog county courthouse basement ledgers and microfilmed historical newspapers across all 3,143 U.S. counties and county equivalents.
