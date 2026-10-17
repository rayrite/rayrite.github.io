# U.S. Civic & Legal Data Resources Data Dictionary
## Comprehensive Multi-Tier Inventory: Federal, State, and Swing-State Local Infrastructure

---

## 1. Research Metadata

- **Document Title:** U.S. Civic & Legal Data Resources Data Dictionary
- **Document Identifier:** `CIVIC-DATA-DICT-2026-US-V1`
- **Preparation Date:** 2026-10-17
- **Research Date:** 2026-10-17
- **Information Cutoff / Verification Date:** 2026-10-17
- **Jurisdictional Coverage:** 
  - **Federal:** United States Federal Government, Independent Commissions, Article III Judiciary, Department of Justice.
  - **State:** 50 U.S. States, District of Columbia, Puerto Rico, U.S. Virgin Islands; Pacific Territories (Guam, American Samoa, CNMI) noted at federal interface.
  - **Local:** Major metropolitan areas and principal urban/capital counties across 14 battleground/swing states (AZ, CO, FL, GA, IA, ME, MI, MN, NC, NH, NV, OH, PA, WI), plus high-impact national metropolitan prosecutorial benchmarks (New York/Manhattan, Los Angeles, Cook County/Chicago, Harris County/Houston).
- **Research Mode:** Exhaustive, Deep-and-Wide Multi-Angle Synthesis
- **Primary Author:** Lead Deep-and-Wide Research Agent (Antigravity Research Suite)
- **Target Audience:** Civic-technology software engineers, systems architects, legal-informatics researchers, nonpartisan voter advocacy technologists, and policy data analysts.

---

## 2. Original User Request

> "Please create a comprehensive and detailed system prompt that will conduct a sprawling search of available voter, election and ballot information (online, print) resources, U.S. legislation resources and bill tracking, candidate research resources, Judicial resources and court case tracking, US Attorney/District Attorney resources and tracking, across the United States. Compile a list of voter information topics and adjacent categories and have the agent deep dive on each one.
>
> Have the agent conduct a comprehensive search of federal resources, then state resources. Then conduct a search on local community resources focusing on major metropolitan areas and cities inside battleground and swing states.
>
> Have the agent create a data dictionary table listing each resources, the product URLs, executive summary of the content, availability of the content (free/paywall), a developer resources to extract and consume the content within my applications."

---

## 3. Clarifications and Resolved Assumptions

The execution of this comprehensive data dictionary operates under the formal defaults established in the handoff specification (`sysprompts\dukrvote\deep-research-handoff-us-civic-resources-data-dictionary[web-m3].md`). Each clarification question (CQ) and operational assumption (A) is resolved as follows:

### Clarification Decisions Register

| ID | Clarification Topic | Resolved Policy / Applied Default | Operational Consequence |
|---|---|---|---|
| **CQ-01** | Battleground / Swing States Definition | Expanded "Perennial Swing + 2024-Cycle" 14-State Set: **AZ, CO, FL, GA, IA, ME, MI, MN, NC, NH, NV, OH, PA, WI**. | Encompasses both high-volatility 2024 presidential swing battlegrounds and traditional senate/gubernatorial battlegrounds, preventing arbitrary regional omissions. |
| **CQ-02** | Election Cycle & Time Horizon | Dual-Track: Active 2024 general cycle + 2026 midterm horizon, coupled with historical results dating back to 2000 (and back to 1976/1789 where official repositories exist). | Captures active voter-facing lookup systems while cataloging archival data repositories (e.g., MEDSL, GovInfo historical collections). |
| **CQ-03** | Candidate Research Scope | Multi-Tier: Federal (President, U.S. Senate, U.S. House) + Statewide Constitutional Officers (Governor, AG, SoS) + State Legislature + Local Offices within the 14 Battleground Metros. | Balances complete federal campaign finance (FEC) with state ethics commissions and localized municipal ballot filings. |
| **CQ-04** | Judicial Case Tracking Scope | Federal (SCOTUS, 13 Circuits, 94 Districts, Specialized Tribunals) + State Supreme Courts + State Intermediate Appellate Courts; Trial-Court systems categorized and flagged. | Establishes uniform appellate case-law baseline across all 50 states while addressing fragmented county/municipal trial dockets. |
| **CQ-05** | Prosecutorial (USAO & DA) Scope | Full Federal USAO Roster (all 94 judicial districts) + State District Attorneys / State's Attorneys across the 14 battleground metros + 4 prominent national metros. | Provides 100% federal coverage while mapping local prosecutorial leadership, press communications, and public dashboards in core population centers. |
| **CQ-06** | Deliverable Format | Monolithic, fully validated Markdown file featuring structured tables, complete citations, architecture guides, plus a fully structured JSON-export appendix. | Delivers immediate human readability in Markdown viewers alongside direct machine ingestion for developer toolchains. |
| **CQ-07** | Developer Access vs. Scraping | Official programmatic channels only: REST/GraphQL APIs, OpenAPI/Swagger specifications, official bulk data dumps, RSS feeds, and Sitemaps. Unofficial scrapers strictly prohibited; non-API sites flagged with "No official API — scraping not recommended (see TOS)." | Protects client applications from legal, ethical, and stability vulnerabilities associated with brittle web scrapers violating governmental terms of service. |
| **CQ-08** | Print / Non-Digital Resources | Cataloged explicitly where print remains the authoritative legal record (e.g., historical U.S. Statutes at Large pre-digitization, un-digitized county records). | Preserves legal-informatics fidelity by noting where digital representations are mere secondary convenience copies. |
| **CQ-09** | Territorial Scope | Puerto Rico (PR) and U.S. Virgin Islands (USVI) included in state-tier tables; Guam, American Samoa, and CNMI documented at the federal-administration layer. | Ensures comprehensive coverage of U.S. jurisdictions subject to federal electoral and statutory frameworks. |
| **CQ-10** | Major Metro Definition | Principal county of the largest MSA in each swing state, plus the county containing the state capital, plus any county containing a city with population ≥ 100,000. | Yields a rigorous, reproducible 45+ county/metro matrix across the 14 swing states. |

### Technical Assumptions Register

- **A-01 (Non-Partisan Civic Tech Framing):** Voter data is cataloged exclusively for registration verification, polling location discovery, ballot preview, and statutory compliance. Proprietary partisan voter targeting files (e.g., L2, TargetSmart, Aristotle) are explicitly out of scope.
- **A-02 (Canonical Authority Precedence):** Primary governmental publishing agencies take absolute precedence over aggregators. Where discrepancy exists, the primary governmental system of record is deemed canonical.
- **A-03 (Authentication & Quota Transparency):** Developer resources must document explicit authentication requirements (e.g., `api.data.gov` API keys, basic authentication, OAuth2, or unauthenticated open access) and quantitative rate limits.
- **A-04 (Deprecation & Migration Accuracy):** Outdated services (e.g., sunsetted ProPublica Congress API, decommissioned GovTrack API v2, sunsetted legacy Senate LDA endpoints, sunsetted Caselaw Access Project API) are documented with their specific successor architectures to prevent dead-end integrations.

---

## 4. Executive Summary

The United States civic and legal data ecosystem is an extraordinarily vast, multi-jurisdictional federation comprising tens of thousands of autonomous public authorities. For software engineers and civic technologists seeking to build programmatic tools—such as ballot preview engines, legislative tracking dashboards, candidate financial monitors, or judicial intelligence platforms—navigating this fragmented landscape presents severe structural challenges alongside profound opportunities.

At the **federal tier**, the data infrastructure is relatively mature, modernized, and increasingly API-first. Major federal institutions have consolidated their offerings around standardized API gateways (predominantly powered by `api.data.gov` and cloud microservices). Legislative data is authoritatively anchored by the Library of Congress Congress.gov API (`api.congress.gov/v3/`) and the Government Publishing Office’s GovInfo API (`api.govinfo.gov`), both providing rich JSON/XML schemas, OpenAPI documentation, and high-capacity rate limits (5,000 to 36,000 requests per hour). Federal campaign finance is accessible through the Federal Election Commission’s OpenFEC API (`api.open.fec.gov/v1/`), which pairs fine-grained transactional endpoints with multi-gigabyte historical bulk downloads. In the federal judicial branch, while the primary PACER (Public Access to Court Electronic Records) system remains burdened by a $0.10/page fee schedule and dated CM/ECF infrastructure, the civic community—spearheaded by the Free Law Project’s CourtListener platform—has successfully mirrored hundreds of millions of federal opinions, dockets, and RECAP-harvested filings behind modern RESTful APIs (`courtlistener.com/api/rest/v4/`) and bulk S3 distributions.

At the **state tier**, consistency fragments dramatically. The administration of elections, legislative processes, campaign finance disclosures, and court dockets is constitutionally decentralized across the 50 states, the District of Columbia, and U.S. territories. While organizations like Open States (`v3.openstates.org`) and LegiScan provide normalized cross-state legislative wrappers, primary state legislative systems vary from advanced RESTful legislative APIs (e.g., Washington, New York, Minnesota) to legacy vendor portals (e.g., Granicus LegisLink, LexisNexis statutory mirrors) offering no public programmatic interface. State voter file access exhibits extreme divergence governed by state statutes: states such as Ohio, North Carolina, and Florida maintain open, free, or low-cost downloadable voter files, whereas states like Wisconsin ($12,500 statutory fee) or Alabama ($34,000+ fee) impose steep economic barriers, and others restrict access strictly to qualified political committees. State campaign finance systems range from sophisticated data-download portals (e.g., Colorado TRACER CSV archives, California CAL-ACCESS) to opaque HTML search engines without export tools.

At the **local tier**, focusing on major metropolitan areas within critical battleground states (such as Maricopa County, AZ; Fulton County, GA; Wayne County, MI; Clark County, NV; and Philadelphia County, PA), civic infrastructure reflects an intricate patchwork of county boards of elections, county clerks, superior/circuit courts, and independent District Attorney offices. High-density metropolitan counties increasingly provide GIS-driven precinct election maps, real-time ballot processing trackers, and open-data portals powered by ArcGIS REST, Socrata, or CKAN. However, standardized developer access is virtually nonexistent at the municipal and county levels: data ingestion requires either interfacing with state-aggregated feeds (e.g., state SOS election results platforms) or harvesting localized CSV/PDF artifacts published on county servers. Local prosecutorial data remains the least structured civic vertical: District Attorneys operate primarily via public relations newsrooms, press release RSS feeds, and periodic PDF annual reports, with only a small vanguard of progressive and high-population offices (e.g., Philadelphia, Cook County, Manhattan) publishing open-data prosecution dashboards.

This data dictionary provides an authoritative, source-verified baseline of this multi-tiered architecture. It establishes concrete schemas, direct endpoints, authentication parameters, and data caveats, equipping development teams to build robust, ethical, and scalable civic technologies.

---

## 5. Key Research Findings

1. **Federal API Gateway Standardization:** Over 75% of primary federal civic data systems are unified under the GSA `api.data.gov` API Umbrella, allowing developers to utilize a single shared API key across the Library of Congress (Congress.gov), GPO (GovInfo), FEC (OpenFEC), and Regulations.gov.
2. **The Retirement of Legacy Third-Party Legislative APIs:** High-profile legacy APIs—specifically the **ProPublica Congress API** and **GovTrack API v2**—have been officially retired. Both organizations explicitly direct developers to the official **Congress.gov API v3**, which now serves as the canonical federal legislative standard.
3. **Federal Lobbying Data Platform Modernization:** The legacy Senate Office of Public Records endpoint (`lda.senate.gov/api/v1`) reached sunset status on July 31, 2026, transitioning fully to the unified, OpenAPI-backed **`lda.gov`** platform.
4. **Integration of the Caselaw Access Project into CourtListener:** Harvard Law School's Caselaw Access Project (CAP), which digitized 360+ years of American caselaw (~6.7 million cases), sunsetted its standalone API and transferred its active search and API servicing entirely to the **Free Law Project’s CourtListener API v4**, eliminating previous commercial research restrictions.
5. **Decoupling of PACER via RECAP:** PACER’s $0.10/page paywall ($3.00 cap per document; quarterly $30 waiver) continues to drive reliance on CourtListener’s crowd-sourced RECAP archive, which offers free programmatic access to tens of millions of federal dockets and documents.
6. **State Voter Registration File Bimodality:** Statewide voter lists are governed by an intense statutory divide. Roughly 25 states permit broad public access under varying fee schedules, while the remaining states restrict voter files strictly to candidates, political parties, or non-profit educational entities, with universal statutory bans on commercial solicitation.
7. **Cross-State Aggregator Consolidation:** The merger of the Center for Responsive Politics (OpenSecrets) and the National Institute on Money in State Politics (FollowTheMoney) has unified federal and state campaign finance under **OpenSecrets.org**, while `FollowTheMoney.org` remains a historical reference archive through the 2024 cycle.
8. **Commercialization of National Ballot Measure & Candidate Data:** While basic candidate rosters are public, comprehensive ballot preview and candidate biographical data across all municipal and school board tiers is heavily commercialized. **Ballotpedia** packages its comprehensive sample ballot and election-by-point tools as paid commercial APIs (`api.ballotpedia.org`), while **Democracy Works** and **VoteAmerica Plus** restrict their fine-grained election rule APIs to enterprise/partner licensing.
9. **County-Level Election Results Divergence:** In battleground states, election night reporting is overwhelmingly managed through proprietary commercial SaaS vendors (notably **Scytl / SOE Software Clarity Elections** and **Tenex Software Solutions**), creating consistent visual dashboards for citizens but presenting non-standardized JSON/XML feeds for automated scrapers.
10. **The Prosecutorial Open Data Vacuum:** Across the 94 federal USAOs and more than 2,300 elected state/local prosecutors, there is no standardized national API or structured reporting standard. District Attorney monitoring depends almost entirely on web press releases, RSS feeds, and individualized county annual report PDFs, except in isolated jurisdictions utilizing Socrata-backed criminal justice dashboards.
11. **Federal Register Zero-Auth Architecture:** The National Archives Federal Register API (`federalregister.gov/api/v1`) stands out as the most accessible federal civic service, requiring zero API keys, enforcing no rigid transaction throttles, and returning fully structured JSON schemas for every published federal rule, proposed rule, and presidential document.
12. **MIT Election Lab & Dataverse Primacy:** For academic, historical, and precinct-level certified election returns spanning 1976 through 2024, the **MIT Election Data and Science Lab (MEDSL)** hosted on Harvard Dataverse represents the definitive open-access gold standard for clean, machine-actionable CSV/tab-delimited datasets.

---

## 6. Scope and Definitions

### In-Scope Boundaries
- **Jurisdictions:** United States Federal Government; 50 U.S. States; District of Columbia; Puerto Rico; U.S. Virgin Islands; 14 Battleground States and their principal metropolitan counties.
- **Topical Categories (7 Core Vertices):**
  1. *Voter Information:* Registration lookup portals, voter eligibility rules, NVRA public record inspection policies, polling place locators, and ballot tracking systems.
  2. *Election Administration, Results & Ballot Measures:* Official election calendars, certification canvasses, precinct- and county-level returns, ballot initiative databases, and legal constitutional amendments.
  3. *Federal Legislation & Congressional Monitoring:* Congressional bills, resolutions, public laws, U.S. Code, Statutes at Large, roll-call voting records, committee hearings, presidential executive actions, and federal administrative rulemaking.
  4. *State Legislation & Bill Tracking:* State legislative bills, state session laws, administrative codes, legislative information management systems (LIMS), and state lobbying registries.
  5. *Candidate Research & Campaign Finance:* Candidate qualification filings, financial disclosures (Form 278e/OGE), campaign contributions, disbursements, independent expenditures, PAC/Super PAC filings, and 501(c)(4) filings.
  6. *Judicial Resources & Court Case Tracking:* Federal Supreme Court, Circuit, District, and Specialized dockets and opinions; State Supreme Court and Intermediate Appellate opinions and docket systems; federal judge directories.
  7. *U.S. Attorney & District Attorney Tracking:* Federal USAO roster (94 offices), leadership tracking, official press releases, and local District Attorney / State's Attorney offices in battleground metros.
- **Developer Access Schema:** Official REST/GraphQL APIs, OpenAPI/Swagger specifications, official bulk data downloads, RSS/Atom feeds, and standard open data portals.

### Out-of-Scope Boundaries
- Commercial political targeting voter files containing modeled party scores, consumer attributes, or commercial credit data (e.g., TargetSmart, L2, Aristotle, Catalist).
- Private campaign management operational software (e.g., NGP VAN, ActBlue/WinRed internal APIs).
- Substantive legal advice, legal strategy, or speculative political electoral forecasts.
- Unofficial third-party scraping scripts that violate governmental website Terms of Service.

---

## 7. Research Methodology & Evidence Standards

This research was executed following a nine-phase structured investigative strategy:

```
[Phase 1: Federal Baseline] ────> [Phase 2: State Baseline (50+DC+Territories)]
              │                                      │
              ▼                                      ▼
[Phase 3: Battleground Local Metros] ──> [Phase 4: Topical Category Deep Dives]
              │                                      │
              ▼                                      ▼
[Phase 5: Aggregator Overlay] ─────────> [Phase 6: Developer Access Synthesis]
              │                                      │
              ▼                                      ▼
[Phase 7: Coverage Matrix & Gaps] ────> [Phase 8: Active Verification Sweep]
                                                     │
                                                     ▼
                                        [Phase 9: Master Deliverable Assembly]
```

### Source-Quality Hierarchy
To ensure absolute reliability, all cataloged data points adhere to the following strict evidentiary hierarchy:
1. **Tier 1: Canonical Governmental Publishers:** Direct official domains (`.gov`, `.mil`, `.us`, court-specific domains like `uscourts.gov` and state judiciary domains).
2. **Tier 2: Statutory Legal Codes & Direct Judicial Dockets:** Official slip opinions, state revisor statutes, PACER/CM-ECF filings.
3. **Tier 3: Federal/State Open Data Gateways:** `data.gov`, state open-data CKAN/Socrata repositories.
4. **Tier 4: Intergovernmental & Nonpartisan Standards Bodies:** National Conference of State Legislatures (NCSL), National Association of Secretaries of State (NASS), Federal Judicial Center (FJC).
5. **Tier 5: Established Nonpartisan Civic Aggregators & Academic Repositories:** Free Law Project (CourtListener), MIT Election Data and Science Lab (MEDSL), OpenStates (Plural), OpenSecrets, Ballotpedia.
6. **Tier 6: Commercial Legal & Legislative Services (Noted for Coverage Comparison):** LexisNexis, Westlaw, Bloomberg Law, LegiScan.

---

## 8. Topical Category Deep Dives

### 8.1 Voter Information (Registration, Lookup, Polling Places & Ballot Tracking)

#### Federal Coverage Summary
The federal government exercises targeted authority over voter registration through the **National Voter Registration Act (NVRA) of 1993** (Motor Voter) and the **Help America Vote Act (HAVA) of 2002**. The **U.S. Election Assistance Commission (EAC)** (`eac.gov`) serves as the central federal administrative clearinghouse. It maintains the canonical *National Mail Voter Registration Form*, available in 21 languages, which states must accept under federal law (subject to specific state-law identification instructions). For military and overseas citizens, the Department of Defense operates the **Federal Voting Assistance Program (FVAP)** (`fvap.gov`), maintaining the *Federal Post Card Application (FPCA)* and *Federal Write-In Absentee Ballot (FWAB)*. The General Services Administration (GSA) and EAC co-sponsor **Vote.gov** (`vote.gov`), an open-source, mobile-first civic portal that directs voters to their respective state-specific registration lookup engines and provides multilingual guidance.

#### State Coverage Summary
Under Article I, Section 4 of the U.S. Constitution, primary election administration and voter roll maintenance reside with the 50 states and territories. Every state maintains a computerized statewide voter registration list pursuant to HAVA Section 303. State election agencies (principally the Secretary of State, Department of State, or a State Board of Elections) host web-based lookup portals allowing registered individuals to verify their registration status, review active party affiliation, locate their assigned precinct voting location, and track absentee/mail-in ballots. 

However, public access to the underlying **statewide voter files** is subject to a sharp statutory divide tracked by the National Conference of State Legislatures (NCSL):
- *Open-Access States:* States such as Ohio, North Carolina, Florida, Arkansas, Washington, and Colorado permit any member of the public to request or download voter lists for nominal fees or free of charge. North Carolina (`ncsbe.gov`) and Ohio (`ohiosos.gov`) provide public, automated HTTP/FTP download portals for statewide voter files with sensitive PII (full SSN, driver's license numbers) redacted.
- *Restricted-Access States:* States such as California, Georgia, Pennsylvania, Arizona, and Virginia restrict access to qualified candidates, political parties, ballot question committees, or nonprofit academic/civic education entities.
- *High-Fee / Prohibitive States:* Several states impose statutory cost barriers; for example, Alabama charges over $34,000 for a complete statewide file ($0.01 per record), while Wisconsin statutory fees total approximately $12,500.
- *Universal Prohibition on Commercial Exploitation:* In virtually all jurisdictions, state law strictly prohibits the use of official voter lists for commercial advertising, solicitation, or debt collection under criminal or civil penalties.

#### Local (Swing-State) Coverage Summary
At the local level across the 14 battleground states (AZ, CO, FL, GA, IA, ME, MI, MN, NC, NH, NV, OH, PA, WI), voter registration and precinct administration are managed by county-level authorities (e.g., County Recorder in Arizona, Supervisor of Elections in Florida, County Board of Elections in North Carolina and Ohio, County Clerk or Election Commission in Michigan and Wisconsin). 
Key battleground metropolitan county portals include:
- **Maricopa County, AZ:** Maricopa County Elections Department (`elections.maricopa.gov`) and Recorder's Office (`recorder.maricopa.gov`) operate the "BeBallotReady" voter dashboard, providing real-time voter verification, personalized sample ballots, and ballot processing updates.
- **Fulton County, GA:** Department of Registration and Elections (`fultoncountyga.gov`) interfaces with Georgia's statewide "My Voter Page" (MVP) while providing localized advance voting schedules and drop-box location locators.
- **Wayne County & City of Detroit, MI:** The City of Detroit Department of Elections (`detroitmi.gov`) and Wayne County Clerk (`waynecounty.com`) provide ward/precinct lookup tools, absentee drop box maps, and early voting center schedules.
- **Philadelphia County, PA:** Philadelphia City Commissioners (`vote.phila.gov`) maintain the city's voter lookup, mail-in ballot tracking, and satellite election office locators.
- **Clark County, NV:** Clark County Election Department (`clarkcountynv.gov`) operates registered voter services, mail ballot drop-off maps, and polling place locator services.

#### Aggregator Overlay
Third-party civic non-profits aggregate these fragmented portals:
- **Google Civic Information API (v2):** Uses the Voting Information Project (VIP) open data format to return polling places, early voting sites, and contest information via `GET /voterinfo` using a residential street address.
- **Democracy Works (Elections API / TurboVote):** Powers voter registration and election calendar tracking for higher-education and corporate partners, mapping election rules via Open Civic Data IDs (`api.democracy.works/v2`).
- **VoteAmerica Plus Civic Data API (v2):** Provides developer REST endpoints (`GET /election/field/`, `GET /election/data/state/{state}/`) exposing machine-readable state statutory requirements, deadlines, ID laws, and voting options.
- **U.S. Vote Foundation (EOD API):** Licenses the Election Official Directory (EOD), maintaining programmatic records of nearly 8,000 local election jurisdictions nationwide.
- **Vote.org:** Offers free responsive iframe embed widgets (registration, absentee request, status verification, reminders) with premium data webhooks under Vote.org+.

#### Developer Access Summary
Direct primary REST APIs for voter lookup do not exist at the federal or state level due to privacy regulations and anti-scraping safeguards (CAPTCHAs). Programmatic integration must rely on:
1. Licensed aggregator APIs (Google Civic Info API, Democracy Works, VoteAmerica).
2. Bulk download files from open states (e.g., NC State Board of Elections FTP/S3, Ohio Secretary of State FTP).
3. Geospatial GIS endpoints: County boards of elections increasingly publish precinct boundaries and polling locations via **ArcGIS REST Server** feature services (e.g., Maricopa County Open Data, Florida county GIS).

#### Coverage Gaps & Friction Points
- *Absence of a Federal Voter API:* No direct national API exists to query voter registration status; each state operates an isolated database.
- *Strict PII Protections & CAPTCHA Friction:* State voter lookup engines require matching exact PII (first name, last name, date of birth, driver's license number or last 4 digits of SSN) behind Cloudflare or reCAPTCHA protections, preventing direct headless automation.
- *Ballot Tracking Fragmentation:* States use a mix of proprietary ballot tracking SaaS (e.g., BallotTrax, Ballot Scout, custom state systems), preventing unified cross-state ballot tracking integrations.

---

### 8.2 Election Administration, Results & Ballot Measures

#### Federal Coverage Summary
Federal agencies do not certify or publish official real-time election returns on election night. Official certified federal election results are compiled post-canvass by the **Federal Election Commission (FEC)**, which publishes the biennial *Federal Elections* report detailing official general, primary, and runoff votes for President, U.S. Senate, and U.S. House. The **EAC** collects comprehensive operational data through the biennial **Election Administration and Voting Survey (EAVS)**, publishing detailed CSV datasets covering voter registration statistics, military and overseas voting, provisional ballots, rejected mail ballots, and poll worker recruitment.

#### State Coverage Summary
State election agencies are the sole legal authorities responsible for canvassing, certifying, and archiving election results. In all 50 states, the Secretary of State or State Board of Elections publishes certified election returns, historical canvasses, and the official text of state constitutional amendments and statutory ballot propositions.
- *Election Night Reporting (ENR):* States deploy web-based ENR portals that update in real time on election night as county canvasses report. Over 30 states contract with commercial election technology vendors, predominantly **Scytl / SOE Software (Clarity Elections)** or **Tenex Software Solutions**, to host these visualization dashboards.
- *State Ballot Measures:* Official ballot measure language, fiscal impact statements, attorney general summaries, and explanatory arguments are published in state voter guides (e.g., California Ballot Pamphlet, Arizona Secretary of State General Election Guide).

#### Local (Swing-State) Coverage Summary
In the 14 battleground states, official precinct-level results originate at the county or municipal board of canvassers:
- **Precinct-Level Canvass:** While states report aggregate county totals, true granular precinct-level returns are certified at the county level. For example, the Maricopa County Board of Supervisors, the Wayne County Board of Canvassers, and the Philadelphia County Board of Elections produce official precinct-by-precinct statement of votes cast (SOVC) documents.
- **Local Ballot Measures:** Municipal bond issues, county charter amendments, school district levies, and local referenda are published exclusively at the county/city level and do not appear in state legislative tracking systems.

#### Aggregator Overlay
- **MIT Election Data and Science Lab (MEDSL):** The preeminent open-science aggregator, hosting complete historical election returns (county-level returns 2000–2024; presidential, senate, and house returns 1976–present; and precinct-level datasets) on **Harvard Dataverse** under open CC-BY / public domain terms.
- **Voting and Election Science Team (VEST):** Joint academic team (University of Florida / Wichita State) compiling precinct-level election results joined to precinct GIS boundary shapefiles for redistricting and analysis (published via Harvard Dataverse).
- **Ballotpedia:** Exhaustive coverage of federal, state, and local ballot measures, maintaining historical initiative databases back to 1900. Ballotpedia offers a commercial **Ballot Measures API** (`/data/election_dates/ballot_measures`) exposing initiative status, titles, full text, and financial backing.

#### Developer Access Summary
- *MEDSL Harvard Dataverse API:* Datasets are accessible via the standard Dataverse REST API (`https://dataverse.harvard.edu/api/`) allowing automated retrieval of CSV files and metadata.
- *Clarity Elections ENR JSON Feeds:* States and counties utilizing Clarity Elections (e.g., Georgia, North Carolina, Colorado) generate static JSON/XML summary files stored in Amazon S3 buckets behind the ENR interface during election night (e.g., `https://results.enr.clarityelections.com/.../json/summary.json`). While publicly accessible, endpoints change each election cycle without official OpenAPI contracts.
- *State Open Data Portals:* Several states (e.g., Pennsylvania Open Data `data.pa.gov`, New York Open Data `data.ny.gov`) publish historical certified election results as tabular datasets accessible via the SODA (Socrata Open Data) REST API.

#### Coverage Gaps & Friction Points
- *Election Night API Standards Void:* There is no open, unified national API standard for live election night returns. Commercial news media rely on the **Associated Press (AP) Elections API**, which is a high-cost commercial wire service ($10,000s–$100,000s per cycle).
- *Precinct Boundary Churn:* Precinct definitions and boundary lines frequently shift between election cycles, creating severe data-joining challenges when mapping precinct returns to geographic Census blocks.

---

### 8.3 Federal Legislation & Congressional Monitoring

#### Federal Coverage Summary
The federal legislative process is documented by three primary institutional entities: the **Library of Congress (LOC)**, the **Government Publishing Office (GPO)**, and the **Clerks of the House and Senate**:
- **Congress.gov (Library of Congress):** The official legislative portal of the U.S. Congress, tracking all bills, resolutions, amendments, committee actions, hearing transcripts, executive nominations, treaties, and roll-call votes from 1973 (93rd Congress) to the present.
- **GovInfo (U.S. Government Publishing Office):** The official digital repository for authentic, digitally signed federal government publications, including the *Congressional Record*, *House and Senate Journals*, *Public and Private Laws*, *U.S. Code*, and *U.S. Statutes at Large*.
- **Office of the Law Revision Counsel (OLRC):** Publishes the official *Code of Laws of the United States of America (U.S. Code)*, organizing general and permanent federal statutes into 54 positive and non-positive law titles.
- **National Archives and Records Administration (NARA) / Office of the Federal Register (OFR):** Publishes the *Federal Register* (daily gazette of executive orders, agency regulations, and administrative notices) and the *Code of Federal Regulations (CFR)*.
- **House & Senate Clerks:** The Clerk of the House (`clerk.house.gov`) and Secretary of the Senate (`senate.gov`) publish official roll-call votes and electronic voting records immediately upon the closing of floor votes.
- **Federal Lobbying Disclosures:** The Senate Office of Public Records (SOPR) and House Clerk administer filings under the Lobbying Disclosure Act (LDA) of 1995, capturing LD-1 registrations, LD-2 quarterly activity filings, and LD-203 contribution reports.

#### State & Local Equivalents
Federal legislative structures contrast sharply with state legislatures: Congress maintains a year-round calendar, operates specialized bicameral committee staffs, and provides standardized national legal indexing, whereas state legislatures are predominantly part-time or citizen legislatures with abbreviated sessions.

#### Aggregator Overlay
- **Congress.gov API:** The primary open legislative API, displacing former third-party scrapers.
- **GovInfo API:** Provides granular access to authenticated PDF/XML packages and metadata.
- **Sunsetting of Legacy Portals:** ProPublica Congress API and GovTrack API v2 are officially deprecated. GovTrack maintains raw data repositories on GitHub and bulk files at `govtrack.us/data`, but urges developers to utilize `api.congress.gov`.

#### Developer Access Summary
- **Congress.gov API v3 (`api.congress.gov/v3/`):** REST API powered by `api.data.gov`. Requires free API key (`X-Api-Key` or `?api_key=`). Rate limit: 5,000 requests/hour. Endpoints: `/bill`, `/member`, `/committee`, `/nomination`, `/treaty`, `/house-vote`, `/daily-congressional-record`.
- **GovInfo API (`api.govinfo.gov`):** REST API via `api.data.gov`. Free key. Rate limits: 36,000 requests/hour, 1,200/minute. Endpoints: `/collections`, `/packages/{packageId}/summary`, `/packages/{packageId}/granules`, `/search`. Provides XML, USLM (United States Legislative Markup), and PDF packages.
- **Federal Register API v1 (`federalregister.gov/api/v1/`):** Completely public, open REST API requiring no authentication and enforcing no strict rate limit. Endpoints: `/documents.json`, `/public-inspection-documents/current.json`, `/agencies.json`.
- **Regulations.gov API v4 (`api.regulations.gov/v4/`):** Requires `api.data.gov` key (`X-Api-Key`). Rate limit: 1,000 GET requests/hour. Endpoints: `/documents`, `/dockets`, `/comments`.
- **Lobbying Disclosure Act (LDA) API (`lda.gov`):** Unified modern API (replacing deprecated `lda.senate.gov/api/v1` as of July 31, 2026). Rate limit: 120 req/min for registered keys, 15 req/min unauthenticated. Endpoints: `/filings/`, `/contributions/`, `/lobbyists/`.

#### Coverage Gaps & Friction Points
- *Markup & Text Lag:* Bill text processing between floor action and official GPO publication can lag by 24–48 hours, during which only bill status and summaries are available via API.
- *Committee Hearing Transcripts:* Committee-level markup records, witness testimony, and unrevised hearing transcripts are often posted as non-standardized PDFs across individual House/Senate committee web pages before GPO formal compilation.

---

### 8.4 State Legislation & Bill Tracking

#### Federal vs. State Structural Context
While federal legislation operates within a single bicameral institutional framework, state legislation is distributed across 50 distinct state legislative bodies (49 bicameral, 1 unicameral: Nebraska), the Council of the District of Columbia, and territorial legislatures. State legislative sessions vary widely, ranging from biennial 60-day sessions to continuous full-time annual legislatures.

#### State Coverage Summary
Every state operates an official legislative website maintaining a Legislative Information Management System (LIMS) for tracking bills, amendments, fiscal notes, committee calendars, and roll-call votes:
- *Statutory Codes & Administrative Regulations:* Each state revisor of statutes or legislative services agency compiles the official codified statutes and administrative regulations (Administrative Code). Several states outsource statutory hosting to commercial legal vendors (e.g., LexisNexis, Westlaw, Granicus), creating restrictive terms of service for automated data harvesting.
- *State Lobbying Disclosures:* State ethics commissions, campaign finance boards, or the Secretary of State regulate state-level lobbyist registration and expenditure reporting, creating 50 distinct disclosure databases.

#### Local Coverage Summary
At the municipal and county tier in swing states, legislative monitoring focuses on local ordinances, county board resolutions, and municipal council proceedings:
- Major metropolitan councils (e.g., Phoenix City Council, Atlanta City Council, Detroit City Council, Philadelphia City Council, Columbus City Council) publish meeting agendas, minutes, and ordinance text.
- Over 60% of major municipal councils utilize **Granicus (Legistar)** as their legislative workflow engine (e.g., `phila.legistar.com`, `detroitmi.legistar.com`, `atlanta.legistar.com`), which exposes a standardized underlying Web API.

#### Aggregator Overlay
- **Open States (Plural):** The leading open-source state legislative aggregator (`v3.openstates.org`), scraping and normalizing bills, sponsors, actions, votes, and committee data across all 50 states, DC, and Puerto Rico into the Open Civic Data (OCD) standard.
- **LegiScan:** High-throughput legislative intelligence service offering a standardized national JSON API covering the U.S. Congress and all 50 state legislatures (`api.legiscan.com`). Provides free public developer tiers (30,000 queries/month) and real-time enterprise webhook push feeds.
- **Commercial Aggregators:** Plural Policy, Quorum, FiscalNote, and LexisNexis State Net provide enterprise legislative tracking, natural-language amendment diffs, and predictive passage analytics.

#### Developer Access Summary
- **Open States API v3 (`v3.openstates.org`):** RESTful JSON API documented via OpenAPI/Swagger (`/docs/`). Auth: `X-API-KEY` or `?apikey=`. Endpoints: `/jurisdictions`, `/people`, `/bills`, `/committees`, `/events`. Nightly bulk PostgreSQL and CSV database dumps available via Amazon S3.
- **LegiScan Pull API (`api.legiscan.com`):** RPC-style JSON API. Auth: query parameter `?key=`. Free tier: 30,000 calls/month. Core operations: `getSessionList`, `getMasterList`, `getBill`, `getBillText`, `getAmendment`, `getRollCall`, `getDataset`.
- **Granicus Legistar Web API:** Many metropolitan cities expose the Legistar REST API (`https://webapi.legistar.com/v1/client/{client_name}/`), providing JSON access to matters (ordinances), meetings, event items, and votes without authentication.

#### Coverage Gaps & Friction Points
- *LIMS Vendor Heterogeneity:* States that do not expose public APIs often utilize proprietary internal architectures (e.g., customized IBM mainframes, Oracle APEX applications, or proprietary CMS) that render HTML scraping fragile.
- *Inconsistent Amendment Tracking:* While primary bills receive stable bill numbers, floor amendments in fast-moving state sessions are frequently published as un-indexed PDFs minutes before floor votes.

---

### 8.5 Candidate Research & Campaign Finance

#### Federal Coverage Summary
Federal candidate filings and campaign finance accounting are legally mandated under the **Federal Election Campaign Act (FECA)** and administered by the **Federal Election Commission (FEC)**. Any federal candidate raising or spending in excess of $5,000 must register a principal campaign committee:
- *FEC Filings:* Committees submit quarterly, pre-election, and post-election disclosures detailing itemized receipts (contributions ≥ $200, Schedule A), itemized disbursements (operating expenditures, Schedule B), debts (Schedule C/D), and independent expenditures (Schedule E, 24-hour/48-hour reports).
- *Executive & Congressional Personal Financial Disclosures:* Executive branch nominees and officials file OGE Form 278e disclosures with the **Office of Government Ethics (OGE)** (`oge.gov`). Members of the House and Senate file personal financial disclosures with the House Committee on Ethics and Senate Select Committee on Ethics, tracking outside income, assets, liabilities, and stock transactions under the STOCK Act of 2012.
- *Foreign Influence:* The Department of Justice National Security Division operates the **Foreign Agents Registration Act (FARA)** database (`fara.gov`), tracking individuals and firms lobbying on behalf of foreign governments and political parties.

#### State Coverage Summary
State-level campaign finance is regulated independently across 50 state ethics commissions, campaign finance boards, or Secretary of State divisions:
- Contribution limits, reporting thresholds, and reporting cadences differ in every state. 
- Candidate database systems vary from sophisticated open-access portals to basic web forms:
  - *Colorado TRACER (`tracer.sos.colorado.gov`):* Excellent public data download hub providing annual zipped CSV files of all contributions, expenditures, and loans.
  - *California CAL-ACCESS (`cal-access.sos.ca.gov`):* Large-scale disclosure database of state candidate campaigns, ballot measure committees, and lobbying activity; offers raw daily export archives.
  - *Ohio Secretary of State (`boe.ohiosos.gov`):* Searchable campaign finance portal providing direct CSV downloads for candidate, PAC, and legislative caucus committees.
  - *Arizona SeeTheMoney (`seethemoney.az.gov`):* Interactive visualization tool for Arizona state campaigns, offering committee summaries and web exports.

#### Local (Swing-State) Coverage Summary
At the local municipal and county level, campaign finance is exceptionally decentralized:
- In most jurisdictions, mayoral, city council, county commissioner, and school board candidate filings are filed with the **County Clerk** or **City Clerk** on paper or PDF scan forms.
- Prominent exceptions include large metropolitan jurisdictions that have established dedicated municipal ethics commissions:
  - *City of Los Angeles Ethics Commission:* Operates an advanced open data portal for city candidate and lobbyist disclosures.
  - *City of Philadelphia Board of Ethics:* Publishes local campaign finance disclosures and enforces municipal contribution limits.

#### Aggregator Overlay
- **OpenSecrets.org:** The gold-standard nonpartisan research aggregator, tracking money in U.S. politics. Following the merger between the Center for Responsive Politics and the National Institute on Money in State Politics (FollowTheMoney), OpenSecrets integrates federal and state campaign contributions, PAC networks, lobbying activity, 501(c)(4) dark money estimates, and candidate personal finances into a unified taxonomy.
- **ProPublica Nonprofit Explorer (`projects.propublica.org/nonprofits/api`):** Essential API for investigating 501(c)(4) social welfare organizations and 501(c)(3) entities active in civic policy, extracting raw IRS Form 990 data, board members, grants, and revenue streams.

#### Developer Access Summary
- **OpenFEC API (`api.open.fec.gov/v1/`):** RESTful JSON API via `api.data.gov`. Key required. Rate limit: 1,000 calls/hour (registered); scalable to 7,200 calls/hour. Endpoints: `/candidates/`, `/committees/`, `/schedules/schedule_a/`, `/schedules/schedule_b/`, `/schedules/schedule_e/`.
- **FEC Bulk Data (`fec.gov/data/browse-data/?tab=bulk-data`):** Downloadable raw ASCII pipe-delimited (`.txt`) and CSV tables organized by 2-year cycle (1980–present), accompanied by formal record layout headers.
- **OpenSecrets API (`opensecrets.org/api/`):** Method-based REST API (`?method=candSummary&apikey=`). Free keys for non-commercial research; enterprise licensing for commercial republication. Bulk data downloads available via OpenSecrets Open Data Portal.
- **DOJ FARA Data:** Bulk downloadable CSV files of registrants, foreign principals, and short-form registrants via `efile.fara.gov/ords/f?p=171:130`.

#### Coverage Gaps & Friction Points
- *501(c)(4) "Dark Money" Reporting Void:* Non-profit advocacy organizations engaging in independent political expenditures without candidate coordination are not required to disclose individual donors under federal law, leaving IRS Form 990 filings (lagging by 12–18 months) as the only public disclosure mechanism.
- *Local Municipal Paper Filings:* For thousands of county and municipal offices in battleground states, candidate financial reports are scanned PDF images without OCR, presenting an impenetrable barrier to automated REST API ingestion.

---

### 8.6 Judicial Resources & Court Case Tracking

#### Federal Coverage Summary
The federal judicial branch comprises the **Supreme Court of the United States (SCOTUS)**, 13 Courts of Appeals (12 regional circuits + Federal Circuit), 94 U.S. District Courts, and specialized Article I/III tribunals (U.S. Bankruptcy Courts, Court of Federal Claims, Court of International Trade, U.S. Tax Court, Court of Appeals for Veterans Claims):
- **PACER (Public Access to Court Electronic Records):** The official electronic public access service for the U.S. federal court system (`pacer.uscourts.gov`), providing case dockets and filed documents across all appellate, district, and bankruptcy courts. PACER operates on an electronic filing backbone (NextGen CM/ECF).
  - *Cost Structure:* $0.10 per page viewed or downloaded; fees for a single document, case-specific report, or docket sheet are capped at $3.00 (the equivalent of 30 pages). Transcripts and audio files do not carry a page cap. PACER waives all charges for an account if total usage is $30 or less in a given quarterly billing cycle.
- **Supreme Court of the United States:** Publishes slip opinions, order lists, and dockets directly on `supremecourt.gov`. Oral arguments are recorded and published with official transcripts.
- **Federal Judicial Center (FJC):** Maintains the *Biographical Directory of Article III Federal Judges, 1789-present*, providing verified career histories, appointing presidents, judicial service dates, and education.

#### State Coverage Summary
State court systems handle over 95% of all judicial litigation in the United States:
- *State Appellate Structure:* Each state maintains a court of last resort (typically the Supreme Court, or Court of Appeals in New York and Maryland) and intermediate appellate courts.
- *Appellate Dockets & Case Law:* State appellate opinions are published on official state judiciary websites (e.g., California Courts `courts.ca.gov`, New York State Unified Court System `nycourts.gov`, Florida Supreme Court `floridasupremecourt.org`).
- *State Trial Courts:* Highly fragmented. Most state trial courts (Circuit Courts, Superior Courts, District Courts, Common Pleas Courts) operate disparate docket management systems (e.g., Tyler Technologies Odyssey, CourtView, custom portals), many of which require fee-based accounts, in-person courthouse terminal inspection, or restrict public internet indexing.

#### Aggregator Overlay
- **Free Law Project / CourtListener:** The preeminent open legal data platform (`courtlistener.com`). Features:
  - Over 500 million pages of legal documents, 8 million searchable opinions, and comprehensive oral argument audio archives.
  - **RECAP Project:** An open-source browser extension and database archiving PACER documents purchased by users, creating a permanent, free public legal commons.
  - **Caselaw Access Project (CAP) Corpus:** Harvard Law School's Library Innovation Lab digitized ~6.7 million historical cases across all 50 states and federal courts back to 1658; this entire corpus was formally transferred to CourtListener for active API and search servicing.
- **The Oyez Project (`oyez.org`):** Multimedia archive of the Supreme Court of the United States, providing synchronized audio transcripts, justice voting alignments, and plain-language case summaries (`api.oyez.org`).
- **Commercial Legal Giants:** LexisNexis, Thomson Reuters Westlaw, and Bloomberg Law maintain proprietary, deeply indexed citator networks (Shepard's, KeyCite), headnotes, and commercial trial-court docket feeds.

#### Developer Access Summary
- **CourtListener REST API v4 (`courtlistener.com/api/rest/v4/`):** REST API requiring free user token (`Authorization: Token <token>`). Rate limits: 5 req/min, 50 req/hour, 125 req/day on free tier; substantially higher for academic EDU and paid membership tiers. Endpoints: `/dockets/`, `/opinions/`, `/people/`, `/financial-disclosures/`, `/audio/`, `/recap-fetch/`.
- **CourtListener Bulk Data (`courtlistener.com/api/bulk-data/`):** Nightly full-database database snapshots (CSV and JSON) of all opinions, dockets, judges, and courts downloadable via public Amazon S3 buckets.
- **PACER Case Locator (PCL) API:** Exposes national index search across federal courts; requires active PACER credentials and incurs standard search transaction fees.
- **Oyez API (`api.oyez.org`):** Public JSON endpoints for SCOTUS terms, cases, and audio transcripts (e.g., `/cases/{term_year}/{docket_number}`).
- **FJC Judges Database:** Downloadable full CSV and XML datasets of all Article III federal judges at `fjc.gov/history/judges`.

#### Coverage Gaps & Friction Points
- *PACER Paywall Friction:* PACER’s pay-per-page fee model creates substantial financial exposure for broad automated polling or deep document ingestion.
- *State Trial Court Black Box:* The vast majority of municipal, misdemeanor, and civil trial court dockets in swing-state counties remain un-digitized or locked behind commercial court records paywalls (e.g., LexisNexis CourtLink, Trellis.law), severely limiting open-access litigation intelligence.

---

### 8.7 Prosecutorial Infrastructure: U.S. Attorneys (USAO) & District Attorneys (DA)

#### Federal Coverage Summary
Federal criminal prosecution is executed through the **Executive Office for United States Attorneys (EOUSA)** and **94 United States Attorney’s Offices (USAOs)** operating across the 50 states, DC, Puerto Rico, USVI, Guam, and the Northern Mariana Islands:
- *Leadership:* Each USAO is headed by a United States Attorney appointed by the President and confirmed by the Senate (or appointed on an interim basis by the Attorney General or District Court under 28 U.S.C. § 546).
- *Directory & Communications:* The Department of Justice maintains the canonical directory at `justice.gov/usao/us-attorneys-listing`. Each office maintains a dedicated sub-portal (e.g., `justice.gov/usao-sdny`, `justice.gov/usao-edpa`) publishing official press releases, indictments, sentencing announcements, and victim-witness notices.
- *Data Products:* The EOUSA publishes the *United States Attorneys' Annual Statistical Report*, providing national and district-level aggregations of criminal prosecutions, convictions, declination rates, and civil litigation collections.

#### State & Local Coverage Summary
In state criminal justice systems, the chief local prosecutor (known variously as the **District Attorney**, **State’s Attorney**, **County Attorney**, **Commonwealth’s Attorney**, or **Prosecuting Attorney**) is typically an independently elected constitutional officer serving at the county or multi-county judicial circuit level:
- There are approximately 2,300 elected chief prosecutors across the United States.
- In battleground states, major metropolitan prosecutor offices represent substantial legal powerhouses:
  - *Maricopa County Attorney's Office (MCAO), AZ:* Serves ~4.5 million residents; publishes news releases, charging policies, and diversion statistics.
  - *Fulton County District Attorney’s Office, GA:* Covers metropolitan Atlanta; prosecutes major felony dockets, public corruption, and RICO matters.
  - *Wayne County Prosecutor's Office, MI:* Serves metropolitan Detroit; publishes charging announcements and operates conviction integrity and victim services units.
  - *Philadelphia District Attorney's Office (DAO), PA:* Operates a prominent public-facing **DATA (Data and Transparency Analytics) Lab** providing open dashboards on homicides, commercial bail, diversion programs, and case resolutions.
  - *Cuyahoga County Prosecutor's Office, OH:* Serves metropolitan Cleveland; publishes grand jury reports, indictments, and annual reports.

#### Aggregator Overlay
- *National District Attorneys Association (NDAA):* Professional association (`ndaa.org`) maintaining prosecutor education resources and state statutory directories, but does not provide a public machine-readable API.
- *Prosecution Transparency Initiatives:* Academic and non-profit projects (e.g., Vera Institute of Justice, Prosecutorial Performance Indicators, Measures for Justice) aggregate criminal justice metrics, declination patterns, and racial disparity data across participating county jurisdictions.

#### Developer Access Summary
- **DOJ USAO RSS Feeds:** The Department of Justice runs on a Drupal platform providing standardized RSS 2.0 XML feeds for press releases per USAO (e.g., `https://www.justice.gov/usao-{district}/rss.xml`).
- **DOJ Press Releases API:** General DOJ press announcements are exposed via `justice.gov/api/v1/press_releases.json` (subject to DOJ API governance).
- **Philadelphia DA DATA Lab Dashboard:** The City of Philadelphia publishes prosecutorial datasets via the open-data portal `data.phila.gov` powered by Socrata, accessible via the SODA REST API.
- **General State DA Access:** For 98% of county DA offices, programmatic developer access is limited to RSS feeds (where available) or harvesting unstructured HTML press releases.

#### Coverage Gaps & Friction Points
- *Complete Absence of a Unified National DA API:* There is no centralized federal or non-governmental API tracking all 2,300+ local prosecutors, their terms of office, case filing statistics, or declination decisions.
- *Frequent Leadership Turnover:* Interim and acting appointments are common among both federal USAOs and local DAs, necessitating frequent manual verification against county election boards and Senate Judiciary confirmation records.

---

## 9. Master Data Dictionary Table

The Master Data Dictionary represents the primary deliverable of this research synthesis. Each row represents a verified primary governmental, aggregator, or academic resource categorized across the seven topical categories and three jurisdictional tiers.

| Resource Name | Operating Organization / Publisher | Topical Category | Jurisdictional Tier | Jurisdiction | Primary Product URL | Executive Summary | Availability | Developer Resources | Update Cadence | Source Authority | Confidence / Verification Status | Notes / Caveats |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **Vote.gov** | GSA / TTS in partnership with U.S. EAC | Voter Information | Federal | United States (National) | [https://vote.gov/](https://vote.gov/) | Official federal voter registration portal guiding citizens through voter registration rules, deadlines, and state-specific portals in multiple languages. | Free | Open-source platform (GitHub `usagov/vote-gov`). No public REST query API; state guidance mirrored via static JSON and sitemap. | Continuous / Per-election | Primary Government | Verified live (2026-10-17) | Open data repository on GitHub; serves as the authoritative federal front-door to state registration. |
| **National Mail Voter Registration System** | U.S. Election Assistance Commission (EAC) | Voter Information | Federal | United States (National) | [https://www.eac.gov/voters/national-mail-voter-registration-form](https://www.eac.gov/voters/national-mail-voter-registration-form) | Federal voter registration form mandated by the NVRA for use across all covered states; includes state-by-state voter ID and eligibility instructions in 21 languages. | Free | Downloadable PDF forms and state instructions. No REST API. | Annual / Statutory Updates | Primary Government | Verified live (2026-10-17) | Authoritative legal standard for national mail voter registration. |
| **Federal Voting Assistance Program (FVAP)** | U.S. Department of Defense | Voter Information | Federal | United States (Overseas & Military) | [https://www.fvap.gov/](https://www.fvap.gov/) | Administers UOCAVA voting processes for military service members, their eligible family members, and overseas citizens, providing the FPCA registration form and FWAB write-in ballot. | Free | Electronic FPCA/FWAB generation tools; state voting guidelines directory. No public REST API; XML/RSS state alerts. | Real-time / Per-election | Primary Government | Verified live (2026-10-17) | Canonical authority for absentee voting outside the United States. |
| **Election Administration and Voting Survey (EAVS)** | U.S. Election Assistance Commission (EAC) | Election Administration & Results | Federal | United States (50 States + Territories) | [https://www.eac.gov/research-and-data/election-administration-voting-survey-eavs-data](https://www.eac.gov/research-and-data/election-administration-voting-survey-eavs-data) | Comprehensive nationwide survey covering voter registration, turnout, UOCAVA ballots, provisional voting, voting technology, and poll workers across all U.S. counties. | Free | Downloadable bulk datasets in CSV, Excel, and SPSS formats with detailed codebooks and survey instruments. | Biennial (post-general election) | Primary Government | Verified live (2026-10-17) | The definitive federal empirical dataset on election administration operations. |
| **Congress.gov Legislative Platform** | Library of Congress (LOC) | Federal Legislation & Bill Tracking | Federal | U.S. Congress (House & Senate) | [https://www.congress.gov/](https://www.congress.gov/) | Canonical portal for federal legislative tracking, providing comprehensive bill text, bill summaries, status, cosponsors, committee reports, nominations, treaties, and roll-call votes from 1973 to present. | Free | **Congress.gov API v3** (`https://api.congress.gov/v3/`). OpenAPI/Swagger docs at `api.congress.gov/#/`. Auth: `api.data.gov` API Key (`X-Api-Key`). Rate limit: 5,000 req/hour. Format: JSON/XML. | Real-time / Daily | Primary Government | Verified live (2026-10-17) | Displaced legacy ProPublica and GovTrack APIs as the official federal legislative standard. |
| **GovInfo Authenticated Digital Repository** | U.S. Government Publishing Office (GPO) | Federal Legislation & Bill Tracking | Federal | U.S. Federal Government | [https://www.govinfo.gov/](https://www.govinfo.gov/) | Authenticated, digitally signed electronic publications of the federal government, including Congressional Bills, Public Laws, Congressional Record, Code of Federal Regulations, and U.S. Code. | Free | **GovInfo API** (`https://api.govinfo.gov/`). Swagger UI at `api.govinfo.gov/docs`. Auth: `api.data.gov` API Key (`?api_key=`). Rate limit: 36,000 req/hour. Bulk download services for complete collections in USLM/XML. | Daily / Continuous | Primary Government | Verified live (2026-10-17) | Source of cryptographically verified official PDF and XML legislative packages. |
| **Office of the Law Revision Counsel (U.S. Code)** | U.S. House of Representatives | Federal Legislation & Bill Tracking | Federal | United States (Statutes) | [https://uscode.house.gov/](https://uscode.house.gov/) | Official codification of general and permanent federal statutes into 54 titles; tracks positive law codification, currency dates, classification tables, and popular name index. | Free | Bulk XML and text downloads of complete U.S. Code titles and annual supplements via `uscode.house.gov/download/download.shtml`. | Periodic (Continuous legislative updates) | Primary Government | Verified live (2026-10-17) | Authoritative statutory source for federal positive law. |
| **Federal Register API** | National Archives & Records Administration (NARA) / OFR | Federal Legislation & Regulations | Federal | U.S. Executive Branch | [https://www.federalregister.gov/](https://www.federalregister.gov/) | Daily official gazette of the U.S. federal government containing proposed rules, final rules, executive orders, presidential proclamations, and agency notices. | Free | **Federal Register API v1** (`https://www.federalregister.gov/api/v1/`). Fully open; No API key required; No rigid rate limit (fair use). Docs: `federalregister.gov/api/v1/documentation.json`. Format: JSON. | Daily (business days) | Primary Government | Verified live (2026-10-17) | Industry benchmark for open federal API design; completely unencumbered by API keys or quotas. |
| **Regulations.gov Federal Rulemaking** | General Services Administration (GSA) | Federal Legislation & Regulations | Federal | U.S. Federal Agencies | [https://www.regulations.gov/](https://www.regulations.gov/) | Centralized eRulemaking portal allowing the public to search dockets, read proposed agency regulations, review public comments, and submit formal regulatory comments. | Free | **Regulations.gov API v4** (`https://api.regulations.gov/v4/`). Auth: `api.data.gov` API Key (`X-Api-Key`). Rate limit: 1,000 GET req/hour; 50 POST comments/min. Swagger docs available. | Real-time | Primary Government | Verified live (2026-10-17) | High-volume submission of comments requires specialized identity validation through GSA help desk. |
| **Lobbying Disclosure Act (LDA) Unified Platform** | U.S. Senate Office of Public Records & House Clerk | Federal Legislation & Lobbying | Federal | U.S. Congress | [https://lda.gov/](https://lda.gov/) | Official registry of federal lobbyists, lobbying firms, and registrant organizations under the LDA; tracks LD-1 registrations, LD-2 quarterly activity filings, and LD-203 contribution reports. | Free | **LDA REST API** (`https://lda.gov/`). Modern OpenAPI-backed architecture replacing legacy `lda.senate.gov/api/v1` (sunset July 31, 2026). Auth: API Key for 120 req/min; unauthenticated tier 15 req/min. Format: JSON. | Continuous | Primary Government | Verified live (2026-10-17) | Critical transition: applications querying legacy `lda.senate.gov` must migrate to `lda.gov`. |
| **OpenFEC Campaign Finance Platform** | Federal Election Commission (FEC) | Candidate Research & Campaign Finance | Federal | U.S. Federal Elections | [https://www.fec.gov/](https://www.fec.gov/) | Canonical database of federal campaign finance disclosures, candidate committees, PACs, Super PACs, contributions, operating expenditures, and independent expenditures. | Free | **OpenFEC API v1** (`https://api.open.fec.gov/v1/`). Swagger UI at `/swagger`. Auth: `api.data.gov` API Key. Rate limit: 1,000 req/hour (scalable to 7,200/hr). Comprehensive biennial bulk CSV/raw text downloads. | Real-time / Nightly | Primary Government | Verified live (2026-10-17) | Definitive primary source for all presidential, senate, and congressional financial tracking. |
| **Office of Government Ethics (OGE) Disclosures** | U.S. Office of Government Ethics | Candidate Research & Ethics | Federal | U.S. Executive Branch | [https://www.oge.gov/](https://www.oge.gov/) | Public financial disclosure reports (OGE Form 278e) and ethics agreements for presidential nominees, senior executive branch officials, and White House staff. | Free | Searchable web document repository with downloadable PDF disclosures. No public REST API. | As filed | Primary Government | Verified live (2026-10-17) | Indispensable for vetting executive branch nominations and conflicts of interest. |
| **DOJ Foreign Agents Registration Act (FARA)** | U.S. Department of Justice (NSD) | Candidate Research & Foreign Influence | Federal | United States (National) | [https://www.justice.gov/nsd-fara](https://www.justice.gov/nsd-fara) | Mandatory disclosure database for agents of foreign principals engaged in political activities or public relations within the United States. | Free | Downloadable bulk CSV files of active registrants, foreign principals, and short-form agents via `efile.fara.gov/ords/f?p=171:130`. Web search portal. | Real-time / Daily | Primary Government | Verified live (2026-10-17) | Primary national legal record for foreign lobbying disclosures. |
| **PACER (Public Access to Court Electronic Records)** | Administrative Office of the U.S. Courts (AOUSC) | Judicial Resources & Court Case Tracking | Federal | Federal Judicial Courts (Appellate, District, Bankruptcy) | [https://pacer.uscourts.gov/](https://pacer.uscourts.gov/) | Electronic docket and document filing system for the federal judiciary; provides case dockets, parties, motions, and orders across all 94 U.S. District Courts and 13 Circuits. | Hybrid (Paywalled $0.10/pg; $3 cap; $30 quarterly fee waiver) | **PACER Case Locator (PCL) API**. Requires registered PACER account and billing setup. Generates standard search transaction fees. | Real-time | Primary Government | Verified live (2026-10-17) | Official legal record; high fee exposure for programmatic bulk scraping. |
| **Supreme Court of the United States Portal** | Supreme Court of the United States | Judicial Resources & Court Case Tracking | Federal | U.S. Supreme Court | [https://www.supremecourt.gov/](https://www.supremecourt.gov/) | Official repository of SCOTUS slip opinions, order lists, granted/pending dockets, oral argument audio recordings, official argument transcripts, and court rules. | Free | Web portal; PDF downloads of slip opinions and orders; MP3 audio files. RSS feeds for orders and opinions. No native REST API. | Real-time during term | Primary Government | Verified live (2026-10-17) | Supreme legal authority; opinions published immediately upon bench announcement. |
| **Biographical Directory of Article III Federal Judges** | Federal Judicial Center (FJC) | Judicial Resources & Court Case Tracking | Federal | U.S. Federal Courts | [https://www.fjc.gov/history/judges](https://www.fjc.gov/history/judges) | Authoritative historical and active biographical directory of all Article III federal judges appointed since 1789, including education, appointing president, commission date, and service termination. | Free | Downloadable full CSV and XML datasets available on the FJC history download page. No REST API required. | Continuous | Primary Government | Verified live (2026-10-17) | Essential for mapping judicial confirmation trends and panel composition. |
| **United States Attorneys Listing** | U.S. Department of Justice (EOUSA) | U.S. Attorney & District Attorney Tracking | Federal | Federal Judicial Districts (94 USAOs) | [https://www.justice.gov/usao/us-attorneys-listing](https://www.justice.gov/usao/us-attorneys-listing) | Directory of all 94 federal U.S. Attorney Offices, listing current appointed or acting U.S. Attorneys, addresses, contact information, and links to district-specific portals. | Free | Standardized Drupal RSS 2.0 XML feeds per district (e.g., `justice.gov/usao-{district}/rss.xml`). Downloadable annual statistical report PDFs. | Continuous / As appointed | Primary Government | Verified live (2026-10-17) | Definitive roster of federal prosecutors; interim appointments must be monitored closely. |
| **Arizona Secretary of State Elections & Campaign Finance** | Arizona Secretary of State | Voter Info, Elections & Campaign Finance | State | State of Arizona | [https://azsos.gov/elections](https://azsos.gov/elections) | Arizona's official election clearinghouse; manages statewide voter registration lookup, election canvasses, ballot measure publicity pamphlets, and SeeTheMoney portal. | Free | **SeeTheMoney** (`seethemoney.az.gov`) campaign finance portal. No public REST API; committee-level web exports and CSV reporting. | Continuous | Primary Government | Verified live (2026-10-17) | Voter file access restricted by A.R.S. § 16-168 to political parties, candidates, and government agencies. |
| **Colorado Secretary of State & TRACER** | Colorado Secretary of State | Voter Info, Elections & Campaign Finance | State | State of Colorado | [https://www.sos.state.co.us/](https://www.sos.state.co.us/) | Administers Colorado's mail-ballot elections, voter registration verification, ballot tracking, and the TRACER campaign finance system. | Free | **TRACER** (`tracer.sos.colorado.gov`) provides annual zipped CSV archives of contributions, expenditures, and loans under `Resources > Download Data`. Colorado Open Data portal. | Daily / Weekly batch | Primary Government | Verified live (2026-10-17) | Gold standard for state-level campaign finance bulk CSV availability. |
| **Florida Division of Elections** | Florida Department of State | Voter Info, Elections & Campaign Finance | State | State of Florida | [https://dos.fl.gov/elections/](https://dos.fl.gov/elections/) | Manages Florida's statewide voter database, voter registration verification, election certification, constitutional amendments, and campaign finance disclosure. | Free | Campaign finance database (`dos.elections.myflorida.com/campaign-finance/`) offers downloadable tab-delimited text/CSV export files. Voter file public under statutory request. | Real-time / Daily | Primary Government | Verified live (2026-10-17) | Broad public records access under Florida Sunshine Law (Chapter 119 F.S.); commercial use prohibited. |
| **Georgia Secretary of State & Elections Division** | Georgia Secretary of State | Voter Info, Elections & Ballot Measures | State | State of Georgia | [https://sos.ga.gov/elections-division](https://sos.ga.gov/elections-division) | Operates Georgia's "My Voter Page" (MVP), election night reporting (Clarity ENR), certified canvasses, and qualified candidate lists. | Free | Clarity Elections JSON feed generated during active election cycles. Campaign finance handled by Georgia Government Transparency & Campaign Finance Commission (`ethics.ga.gov`). | Real-time / Per-election | Primary Government | Verified live (2026-10-17) | Statewide voter file accessible for purchase under statutory schedule; strict non-commercial rules. |
| **Michigan Secretary of State (Bureau of Elections)** | Michigan Department of State | Voter Info, Elections & Campaign Finance | State | State of Michigan | [https://www.michigan.gov/sos/elections](https://www.michigan.gov/sos/elections) | Operates the Michigan Voter Information Center (MVIC), qualified voter file administration, election canvasses, and campaign finance disclosure. | Free | Campaign finance database (`miboecfr.nictusa.com/cfr/ords/results.html`) provides web exports and bulk downloads. No public voter API. | Daily / Continuous | Primary Government | Verified live (2026-10-17) | Voter file available under FOIA; commercial use prohibited under MCL 168.522. |
| **North Carolina State Board of Elections (NCSBE)** | North Carolina State Board of Elections | Voter Info, Elections & Campaign Finance | State | State of North Carolina | [https://www.ncsbe.gov/](https://www.ncsbe.gov/) | Manages statewide voter search, absentee tracking, polling place locators, certified election results, and campaign finance reporting. | Free | **NCSBE Public Data FTP/Download Portal** (`dl.ncsbe.gov`). Provides free, public, daily-updated complete statewide voter files, voter history, and election results in zipped text/CSV formats. | Daily | Primary Government | Verified live (2026-10-17) | Exemplary state open data access; completely free, automated daily voter file downloads. |
| **Ohio Secretary of State Elections Division** | Ohio Secretary of State | Voter Info, Elections & Campaign Finance | State | State of Ohio | [https://www.ohiosos.gov/elections/](https://www.ohiosos.gov/elections/) | Operates Ohio's voter registration portal, election night reporting, statewide canvasses, ballot issues, and campaign finance database. | Free | **Ohio Statewide Voter File Download Portal** (`ohiosos.gov/elections/voters/toolkit/voter-registration-data/`). Offers free downloadable county and statewide voter registration files. Campaign finance CSV downloads. | Daily / Weekly | Primary Government | Verified live (2026-10-17) | Fully open voter file downloads for any citizen; strictly prohibited for commercial marketing under R.C. 3503.153. |
| **Pennsylvania Department of State Elections** | Pennsylvania Department of State | Voter Info, Elections & Campaign Finance | State | Commonwealth of Pennsylvania | [https://www.pa.gov/en/agencies/dos/programs/voting-and-elections.html](https://www.pa.gov/en/agencies/dos/programs/voting-and-elections.html) | Operates "Votes PA" voter services, mail ballot status tracking, candidate nomination petitions, and election night reporting. | Free | Campaign finance online reporting (`campaignfinanceonline.pa.gov`) provides yearly text/CSV download exports. Pennsylvania Open Data (`data.pa.gov`) SODA API for historic returns. | Real-time / Daily | Primary Government | Verified live (2026-10-17) | Full voter file (SURE system) available under statutory purchase fee ($20); non-commercial pledge required. |
| **Wisconsin Elections Commission (WEC)** | Wisconsin Elections Commission | Voter Information & Election Administration | State | State of Wisconsin | [https://elections.wi.gov/](https://elections.wi.gov/) | Administers Wisconsin's decentralized municipal election framework, MyVote Wisconsin portal, and certified election returns. | Free (Search) / Paid (Voter File) | **MyVote Wisconsin** (`myvote.wi.gov`). Statewide voter list (Badger Voters - `badgervoters.wi.gov`) available under statutory fee schedule ($12,500 for full statewide file). Campaign finance via CFIS (`cfis.wi.gov`). | Continuous | Primary Government | Verified live (2026-10-17) | Wisconsin enforces a steep statutory fee for full voter file downloads; Wisconsin ethics CFIS provides CSV exports. |
| **Maricopa County Elections Department & Recorder** | Maricopa County Government | Voter Info, Local Elections & Court Dockets | Local | Maricopa County, AZ (Phoenix/Mesa) | [https://elections.maricopa.gov/](https://elections.maricopa.gov/) | Operates elections for ~2.6M registered voters; provides "BeBallotReady" voter dashboard, live wait times, ballot drop box GIS maps, and precinct canvasses. | Free | **Maricopa County Open Data Portal** / ArcGIS REST feature services for polling places and precincts. Maricopa County Superior Court docket search (`superiorcourt.maricopa.gov`). | Continuous / Real-time | Primary Government | Verified live (2026-10-17) | Major battleground election jurisdiction; provides rich GIS data layers. |
| **Fulton County Registration and Elections** | Fulton County Government | Voter Info, Local Elections & DA | Local | Fulton County, GA (Atlanta) | [https://www.fultoncountyga.gov/inside-fulton-county/fulton-county-departments/registration-and-elections](https://www.fultoncountyga.gov/inside-fulton-county/fulton-county-departments/registration-and-elections) | Administers voter registration and elections across Atlanta and Fulton County; manages advance voting locators, ballot drop boxes, and precinct election returns. | Free | Fulton County Open Data (`data.fultoncountyga.gov`) powered by Socrata/SODA API. Fulton County Superior Court dockets (`fultoncourt.org`). Fulton County DA (`fultonda.net`). | Continuous | Primary Government | Verified live (2026-10-17) | Core urban battleground county; high scrutiny on absentee ballot processing and election certification. |
| **Wayne County Clerk & City of Detroit Elections** | Wayne County & City of Detroit | Voter Info, Local Elections & Prosecutor | Local | Wayne County & Detroit, MI | [https://www.waynecounty.com/elected/clerk/](https://www.waynecounty.com/elected/clerk/) | Manages county election canvassing and candidate filings; Detroit Department of Elections (`detroitmi.gov`) operates city polling places, satellite centers, and drop boxes. | Free | City of Detroit Open Data Portal (`data.detroitmi.gov`) via Socrata SODA API. Wayne County 3rd Circuit Court dockets (`3rdcc.org`). Wayne County Prosecutor (`waynecounty.com/elected/prosecutor`). | Continuous | Primary Government | Verified live (2026-10-17) | Key urban population hub in Michigan; official SOVC reports published post-election. |
| **Philadelphia City Commissioners & District Attorney** | City of Philadelphia | Voter Info, Local Elections & DA | Local | Philadelphia County, PA | [https://vote.phila.gov/](https://vote.phila.gov/) | Consolidated city-county election authority; manages voter registration, polling places, satellite election offices, mail ballot tracking, and certified canvasses. | Free | **OpenDataPhilly** (`opendataphilly.org`) and City of Philadelphia Socrata API (`data.phila.gov`). Philadelphia DA DATA Lab (`phillyda.org`). First Judicial District Courts (`courts.phila.gov`). | Real-time / Daily | Primary Government | Verified live (2026-10-17) | DA DATA Lab represents one of the nation's premier open prosecutorial dashboards. |
| **Clark County Election Department** | Clark County Government | Voter Info, Local Elections & DA | Local | Clark County, NV (Las Vegas) | [https://www.clarkcountynv.gov/government/departments/election_department/](https://www.clarkcountynv.gov/government/departments/election_department/) | Operates elections for Las Vegas metro; manages mail ballot distribution, early voting vote centers, ballot tracking, and unofficial election night reporting. | Free | Clark County Open Web Services and GIS Open Data (`gis-clarkcountynv.hub.arcgis.com`). Eighth Judicial District Court dockets (`clarkcountycourts.us`). Clark County DA (`clarkcountynv.gov/da`). | Continuous / Per-election | Primary Government | Verified live (2026-10-17) | Nevada universal mail-ballot state; early voting and drop-box location APIs available via ArcGIS REST. |
| **Google Civic Information API** | Google LLC | Voter Info & Candidate Research | Aggregator | United States (National) | [https://developers.google.com/civic-information](https://developers.google.com/civic-information) | RESTful API mapping residential street addresses to elected representatives and active election voter info (polling places, early voting, drop-offs, contests). | Free (Quota based) | **Civic Info API v2** (`https://www.googleapis.com/civicinfo/v2`). Auth: Google Cloud API Key. Rate limit: 25,000 queries/day free tier. Endpoints: `/representatives`, `/voterinfo`, `/elections`, `/divisions`. Format: JSON. | Daily / Per-election | Aggregator | Verified live (2026-10-17) | Built on the Voting Information Project (VIP) open data format. |
| **Democracy Works Elections API** | Democracy Works, Inc. | Voter Info & Election Administration | Aggregator | United States (National) | [https://democracy.works/elections-api](https://democracy.works/elections-api) | Programmatic database of upcoming federal, state, and local election dates, registration deadlines, voting methods, and polling/drop-off locations. | Commercial / Institutional Partner | **Elections API v2** (`https://api.democracy.works/v2`). Auth: `X-API-KEY`. Employs Open Civic Data Identifiers (OCD-IDs). Webhooks available for partner account data exports. | Continuous | Nonprofit Aggregator | Verified live (2026-10-17) | Primary civic tech backbone for academic institutions and enterprise civic portals. |
| **VoteAmerica Plus Civic Data API** | VoteAmerica Plus | Voter Information & State Election Rules | Aggregator | United States (50 States + DC) | [https://api.voteamerica.org/docs/api/v2](https://api.voteamerica.org/docs/api/v2) | Structured REST API documenting state election laws, voter ID mandates, registration deadlines, absentee rules, and statutory voting options. | Commercial / Subscription | **VoteAmerica API v2** (`https://api.voteamerica.org/v2/`). Endpoints: `GET /election/field/` (public); `GET /election/data/state/{state}/` (Basic Auth API Key/Secret). Format: JSON. | Continuous (real-time statutory monitoring) | Nonprofit Aggregator | Verified live (2026-10-17) | Clean, normalized JSON representations of complex state-by-state election administration statutes. |
| **Open States Legislative Platform** | Plural Policy / Open States Project | State Legislation & Bill Tracking | Aggregator | 50 States, DC, Puerto Rico | [https://openstates.org/](https://openstates.org/) | Comprehensive open-source state legislative aggregator tracking bills, actions, sponsors, roll-call votes, committee assignments, and legislators across all 50 states. | Free (with registration) | **Open States API v3** (`https://v3.openstates.org/`). FastAPI Swagger docs at `/docs/`. Auth: `X-API-KEY` or `?apikey=`. Endpoints: `/bills`, `/people`, `/jurisdictions`, `/committees`. Bulk S3 dumps (CSV/SQL). | Daily | Nonprofit Aggregator | Verified live (2026-10-17) | The premier open data standard for multi-state legislative ingestion; normalized under OCD format. |
| **LegiScan Legislative Intelligence** | LegiScan LLC | Federal & State Legislation | Aggregator | U.S. Congress & 50 States | [https://legiscan.com/](https://legiscan.com/) | High-speed multi-jurisdiction legislative tracking service providing structured data on bills, full text, amendments, sponsors, and roll-call votes. | Hybrid (Free 30k calls/mo; Paid Enterprise) | **LegiScan RPC Pull API** (`https://api.legiscan.com/?key=APIKEY&op=...`). Operations: `getMasterList`, `getBill`, `getBillText`, `getRollCall`, `getDataset`. Webhook Push API for real-time alerts. | Real-time / Daily | Commercial Aggregator | Verified live (2026-10-17) | High-reliability developer API with full-text bill document payload encoding. |
| **OpenSecrets (Center for Responsive Politics)** | OpenSecrets.org | Candidate Research & Campaign Finance | Aggregator | U.S. Federal & State Elections | [https://www.opensecrets.org/](https://www.opensecrets.org/) | Unified platform tracking money in American politics; integrates federal FEC filings, state campaign contributions (formerly FollowTheMoney), lobbying records, 501(c)(4) dark money, and candidate assets. | Free (Research) / Commercial Licensing | **OpenSecrets REST API** (`https://www.opensecrets.org/api/`). Method-based (`?method=candSummary&apikey=`). JSON/XML. Open Data bulk downloads (CSVs/SQL dumps) via Open Data Portal. | Daily / Post-filing | Nonprofit Aggregator | Verified live (2026-10-17) | Unites federal and state campaign finance taxonomy following the CRP and NIMSP merger. |
| **CourtListener / RECAP Legal Commons** | Free Law Project | Judicial Resources & Court Case Tracking | Aggregator | Federal (SCOTUS, Circuits, Districts) & State Appellate | [https://www.courtlistener.com/](https://www.courtlistener.com/) | Vast open legal search platform hosting over 500 million pages of legal documents, 8 million judicial opinions, federal dockets, PACER filings (RECAP), and oral arguments. Integrated CAP corpus. | Free / Membership Tiers | **CourtListener REST API v4** (`https://www.courtlistener.com/api/rest/v4/`). Auth: `Authorization: Token <token>`. Endpoints: `/dockets/`, `/opinions/`, `/people/`, `/recap-fetch/`. Free bulk database dumps via S3. | Daily / Real-time | Nonprofit Aggregator | Verified live (2026-10-17) | The definitive open-access alternative to commercial legal paywalls (Lexis/Westlaw/PACER). |
| **The Oyez Project** | Cornell / Chicago-Kent / Justia | Judicial Resources & Court Case Tracking | Aggregator | Supreme Court of the United States | [https://www.oyez.org/](https://www.oyez.org/) | Multimedia archive of the Supreme Court of the United States providing indexed case summaries, justice alignment records, audio recordings of all oral arguments, and synchronized transcripts. | Free | **Oyez API** (`https://api.oyez.org/`). Public JSON endpoints (e.g., `GET /cases/{term_year}/{docket_number}`). No API key required; Fair-use rate limits. | Continuous during SCOTUS terms | Academic / Nonprofit | Verified live (2026-10-17) | Premier source for speaker-attributed, timestamped oral argument transcripts and audio files. |
| **MIT Election Data and Science Lab (MEDSL)** | MIT / Harvard Dataverse | Election Administration & Results | Academic / Aggregator | United States (National, County, Precinct) | [https://electionlab.mit.edu/](https://electionlab.mit.edu/) | Academic research clearinghouse hosting verified historical election returns (Presidential, Senate, House, Gubernatorial 1976–present; County returns 2000–2024; Precinct-level files). | Free (Public Domain / CC-BY) | **Harvard Dataverse REST API** (`https://dataverse.harvard.edu/api/`). Downloadable clean CSV, tab-delimited, and R datasets with complete codebooks and methodological documentation. | Post-election / Annual | Academic | Verified live (2026-10-17) | Authoritative academic benchmark for longitudinal election data analysis; free of commercial restrictions. |
| **Ballotpedia API** | Ballotpedia / Lucy Burns Institute | Elections, Candidates & Ballot Measures | Aggregator | Federal, State, and Local (Metros) | [https://ballotpedia.org/](https://ballotpedia.org/) | The digital encyclopedia of American politics, covering federal, statewide, legislative, and local municipal/school board candidates, elections, and ballot measures. | Commercial / Paid Data Package | **Ballotpedia API** (`https://api.ballotpedia.org/`). Auth: `x-api-key`. Endpoints: `/officeholders`, `/election_dates`, `/elections_by_point`, `/data/election_dates/ballot_measures`, `/getQueryResults`. | Continuous | Commercial / Nonprofit | Verified live (2026-10-17) | Unmatched depth for down-ballot municipal races and local ballot initiatives; developer access is paid. |
| **Vote Smart (Project Vote Smart)** | Vote Smart | Candidate Research & Voting Records | Aggregator | Federal & State Officials | [https://votesmart.org/](https://votesmart.org/) | Independent, nonpartisan political research organization tracking candidate biographies, voting records, issue positions (NPAT), interest group ratings, and speeches. | Free (with approved key) | **Vote Smart API** (`https://api.votesmart.org/`). Auth: query parameter `?key=`. Endpoints: `CandidateBio`, `Candidates`, `Votes`, `Rating`, `BallotMeasure`. Formats: JSON/XML. | Continuous | Nonprofit Aggregator | Verified live (2026-10-17) | Rich qualitative issue positions and special interest group scorecard ratings. |

---

## 10. State-by-State Appendix Table

The following table provides the canonical institutional data endpoints across all 50 U.S. States, the District of Columbia, Puerto Rico, and the U.S. Virgin Islands.

| State / Jurisdiction | Primary Elections & Voter Agency (URL) | State Legislature & Bill Tracking (URL) | Campaign Finance & Ethics Agency (URL) | State Supreme Court & Judiciary (URL) | State Open Data Portal & Developer Notes | Voter File Access Policy (NCSL Class) |
|---|---|---|---|---|---|---|
| **Alabama** | [Alabama Secretary of State](https://www.sos.alabama.gov/alabama-votes) | [Alabama Legislature (ALISON)](https://legislature.state.alabama.gov/) | [Alabama Ethics Commission](https://ethics.alabama.gov/) | [Alabama Judicial System](https://judicial.alabama.gov/) | Open Data: [open.alabama.gov](https://open.alabama.gov/). LegiScan/OpenStates coverage. | Prohibitive Fee ($34k+ statewide, $0.01/record). Non-commercial. |
| **Alaska** | [Alaska Division of Elections](https://www.elections.alaska.gov/) | [Alaska State Legislature (Basis)](https://www.akleg.gov/) | [Alaska Public Offices Commission](https://doa.alaska.gov/apoc/) | [Alaska Court System](https://courts.alaska.gov/) | Open Data: [data.alaska.gov](https://data.alaska.gov/). OpenStates API v3. | Open Access ($20 flat fee). Strict non-commercial mandate. |
| **Arizona** | [Arizona Secretary of State](https://azsos.gov/elections) | [Arizona State Legislature](https://www.azleg.gov/) | [SeeTheMoney (AZ SOS)](https://seethemoney.az.gov/) | [Arizona Judicial Branch](https://www.azcourts.gov/) | Open Data: [data.az.gov](https://data.az.gov/). SeeTheMoney web exports. | Restricted (Parties, candidates, govt agencies; A.R.S. § 16-168). |
| **Arkansas** | [Arkansas Secretary of State](https://www.sos.arkansas.gov/elections) | [Arkansas General Assembly](https://www.arkleg.state.ar.us/) | [Arkansas Ethics Commission](https://www.arkansasethics.com/) | [Arkansas Judiciary](https://www.arcourts.gov/) | Open Data: [data.arkansas.gov](https://data.arkansas.gov/). Socrata SODA API. | Open Access ($2.50 flat download). Non-commercial. |
| **California** | [California Secretary of State](https://www.sos.ca.gov/elections) | [California Legislative Information](https://leginfo.legislature.ca.gov/) | [CAL-ACCESS (SOS)](https://cal-access.sos.ca.gov/) | [California Courts](https://courts.ca.gov/) | Open Data: [data.ca.gov](https://data.ca.gov/). CAL-ACCESS daily raw database dumps. | Restricted (Campaign, election, civic, or academic use only). |
| **Colorado** | [Colorado Secretary of State](https://www.sos.state.co.us/pubs/elections/) | [Colorado General Assembly](https://leg.colorado.gov/) | [TRACER (Colorado SOS)](https://tracer.sos.colorado.gov/) | [Colorado Judicial Branch](https://www.coloradojudicial.gov/) | Open Data: [data.colorado.gov](https://data.colorado.gov/). TRACER annual zipped CSV archives. | Open Access ($50 fee). Commercial solicitation strictly barred. |
| **Connecticut** | [Connecticut Secretary of the State](https://portal.ct.gov/sots) | [Connecticut General Assembly](https://www.cga.ct.gov/) | [State Elections Enforcement Comm (SEEC)](https://seec.ct.gov/) | [Connecticut Judicial Branch](https://www.jud.ct.gov/) | Open Data: [data.ct.gov](https://data.ct.gov/). Socrata SODA API. | Open Access ($300 statewide). Commercial use barred. |
| **Delaware** | [Delaware Department of Elections](https://elections.delaware.gov/) | [Delaware General Assembly](https://legis.delaware.gov/) | [Delaware Campaign Finance](https://cfrs.elections.delaware.gov/) | [Delaware Courts](https://courts.delaware.gov/) | Open Data: [data.delaware.gov](https://data.delaware.gov/). Socrata SODA API. | Restricted (Candidates, parties, civic organizations). |
| **District of Columbia** | [DC Board of Elections](https://www.dcboe.org/) | [Council of the District of Columbia](https://dccouncil.gov/) | [DC Office of Campaign Finance](https://ocf.dc.gov/) | [District of Columbia Courts](https://www.dccourts.gov/) | Open Data: [opendata.dc.gov](https://opendata.dc.gov/). DC Council LIMS Web API. | Open Access ($15 fee). Strict non-commercial mandate. |
| **Florida** | [Florida Division of Elections](https://dos.fl.gov/elections/) | [Florida Legislature (Online Sunshine)](http://www.leg.state.fl.us/) | [FL Campaign Finance Database](https://dos.elections.myflorida.com/campaign-finance/) | [Florida Supreme Court](https://floridasupremecourt.org/) | Open Data: [floridadisaster.maps.arcgis.com](https://floridadisaster.maps.arcgis.com/). Daily tab-delimited campaign data. | Open Access (Public records request; non-commercial). |
| **Georgia** | [Georgia Secretary of State](https://sos.ga.gov/elections-division) | [Georgia General Assembly](https://www.legis.ga.gov/) | [GA Transparency & Finance Comm](https://ethics.ga.gov/) | [Supreme Court of Georgia](https://www.gasupreme.us/) | Open Data: [georgia.gov/data](https://georgia.gov/data). Clarity ENR JSON feeds. | Restricted ($250 statutory fee; non-commercial). |
| **Hawaii** | [Hawaii State Office of Elections](https://elections.hawaii.gov/) | [Hawaii State Legislature](https://www.capitol.hawaii.gov/) | [Hawaii Campaign Spending Comm](https://ags.hawaii.gov/campaign/) | [Hawaii State Judiciary](https://www.courts.state.hi.us/) | Open Data: [data.hawaii.gov](https://data.hawaii.gov/). Socrata SODA API. | Restricted (Election purposes only; HRS § 11-14). |
| **Idaho** | [Idaho Secretary of State](https://voteidaho.gov/) | [Idaho State Legislature](https://legislature.idaho.gov/) | [Idaho Campaign Finance Portal](https://sos.idaho.gov/elections-division/campaign-finance-filing/) | [Idaho Judicial Branch](https://isc.idaho.gov/) | Open Data: [data.idaho.gov](https://data.idaho.gov/). OpenStates API coverage. | Restricted (Political/election purposes; no commercial use). |
| **Illinois** | [Illinois State Board of Elections](https://www.elections.il.gov/) | [Illinois General Assembly (ILGA)](https://www.ilga.gov/) | [IL BOE Campaign Disclosure](https://www.elections.il.gov/CampaignDisclosure/) | [Illinois Courts](https://www.illinoiscourts.gov/) | Open Data: [data.illinois.gov](https://data.illinois.gov/). ILGA LIMS web feeds. | Restricted (State political committees and candidates only). |
| **Indiana** | [Indiana Election Division](https://www.in.gov/sos/elections/) | [Indiana General Assembly](https://iga.in.gov/) | [Indiana Campaign Finance (ICFRS)](https://campaignfinance.in.gov/) | [Indiana Judicial Branch](https://www.in.gov/courts/) | Open Data: [data.in.gov](https://data.in.gov/). IGA API accessible with token. | Restricted (Political parties, candidates, media; no commercial). |
| **Iowa** | [Iowa Secretary of State](https://sos.iowa.gov/elections/) | [Iowa Legislature](https://www.legis.iowa.gov/) | [Iowa Ethics & Campaign Board](https://iowaelect.iowa.gov/) | [Iowa Judicial Branch](https://www.iowacourts.gov/) | Open Data: [data.iowa.gov](https://data.iowa.gov/). Socrata SODA API. | Open Access ($250 fee). Strictly prohibited for commercial use. |
| **Kansas** | [Kansas Secretary of State](https://sos.ks.gov/elections/elections.html) | [Kansas State Legislature (KLISS)](http://www.kslegislature.org/) | [Kansas Governmental Ethics Comm](https://ethics.kansas.gov/) | [Kansas Judicial Branch](https://www.kscourts.org/) | Open Data: [data.kansas.gov](https://data.kansas.gov/). KLISS web services. | Open Access ($50 fee). Criminal penalty for commercial use. |
| **Kentucky** | [Kentucky State Board of Elections](https://elect.ky.gov/) | [Kentucky General Assembly](https://legislature.ky.gov/) | [Kentucky Registry of Election Finance](https://kref.ky.gov/) | [Kentucky Court of Justice](https://kycourts.gov/) | Open Data: [data.ky.gov](https://data.ky.gov/). OpenStates API integration. | Restricted (Candidates, parties, political committees only). |
| **Louisiana** | [Louisiana Secretary of State](https://www.sos.la.gov/ElectionsAndVoting/) | [Louisiana State Legislature](https://www.legis.la.gov/) | [Louisiana Ethics Administration](https://ethics.la.gov/) | [Louisiana Supreme Court](https://www.lasc.org/) | Open Data: [data.la.gov](https://data.la.gov/). GeauxVote mobile backend. | Open Access (Statutory fee schedule; non-commercial). |
| **Maine** | [Maine Secretary of State](https://www.maine.gov/sos/cec/elec/) | [Maine State Legislature](https://legislature.maine.gov/) | [Maine Ethics & Campaign Finance](https://mainecampaignfinance.com/) | [Maine Judicial Branch](https://www.courts.maine.gov/) | Open Data: [data.maine.gov](https://data.maine.gov/). OpenStates coverage. | Open Access ($2,200 statewide). Prohibited for commercial sale. |
| **Maryland** | [Maryland State Board of Elections](https://elections.maryland.gov/) | [Maryland General Assembly (MGA)](https://mgaleg.maryland.gov/) | [MD CRIS Campaign Finance](https://campaignfinance.maryland.gov/) | [Maryland Judiciary](https://www.mdcourts.gov/) | Open Data: [opendata.maryland.gov](https://opendata.maryland.gov/). SODA API. | Open Access (Registered Maryland voters only; non-commercial). |
| **Massachusetts** | [Secretary of the Commonwealth](https://www.sec.state.ma.us/divisions/elections/) | [Massachusetts General Court](https://malegislature.gov/) | [Office of Campaign & Political Finance (OCPF)](https://www.ocpf.us/) | [Massachusetts Court System](https://www.mass.gov/orgs/massachusetts-court-system) | Open Data: [data.mass.gov](https://data.mass.gov/). OCPF REST API for campaign finance. | Restricted (Public inspection at municipal clerks; no bulk download). |
| **Michigan** | [Michigan Secretary of State](https://www.michigan.gov/sos/elections) | [Michigan Legislature](https://www.legislature.mi.gov/) | [Michigan Campaign Finance (CFR)](https://miboecfr.nictusa.com/cfr/ords/results.html) | [Michigan Courts](https://www.courts.michigan.gov/) | Open Data: [data.michigan.gov](https://data.michigan.gov/). MI CFR raw bulk data. | Open Access (FOIA request process; strictly non-commercial). |
| **Minnesota** | [Minnesota Secretary of State](https://www.sos.state.mn.us/elections-voting/) | [Minnesota Legislature](https://www.revisor.mn.gov/) | [MN Campaign Finance Board](https://cfb.mn.gov/) | [Minnesota Judicial Branch](https://www.mncourts.gov/) | Open Data: [data.mn.gov](https://data.mn.gov/). CFB downloadable CSV tables. | Open Access ($100 fee; restricted to election-related uses). |
| **Mississippi** | [Mississippi Secretary of State](https://www.sos.ms.gov/elections-voting) | [Mississippi State Legislature](http://billstatus.ls.state.ms.us/) | [MS Campaign Finance Search](https://campaignfinance.sos.ms.gov/) | [State of Mississippi Judiciary](https://courts.ms.gov/) | Open Data: [data.ms.gov](https://data.ms.gov/). OpenStates API integration. | Open Access (Statutory fee schedule; non-commercial). |
| **Missouri** | [Missouri Secretary of State](https://www.sos.mo.gov/elections) | [Missouri General Assembly](https://www.moga.mo.gov/) | [Missouri Ethics Commission](https://www.mec.mo.gov/) | [Missouri Courts](https://www.courts.mo.gov/) | Open Data: [data.mo.gov](https://data.mo.gov/). Socrata SODA API. | Open Access (Fee set by county clerks; non-commercial). |
| **Montana** | [Montana Secretary of State](https://sosmt.gov/elections/) | [Montana State Legislature (LAWS)](https://leg.mt.gov/) | [Commissioner of Political Practices](https://politicalpractices.mt.gov/) | [Montana Judicial Branch](https://courts.mt.gov/) | Open Data: [data.mt.gov](https://data.mt.gov/). LAWS XML feeds. | Restricted (Non-commercial election purposes only). |
| **Nebraska** | [Nebraska Secretary of State](https://sos.nebraska.gov/elections) | [Nebraska Legislature (Unicameral)](https://nebraskalegislature.gov/) | [Nebraska Accountability & Disclosure Comm](https://nadc.nebraska.gov/) | [Nebraska Judicial Branch](https://supremecourt.nebraska.gov/) | Open Data: [data.ne.gov](https://data.ne.gov/). OpenStates coverage. | Open Access (Statutory fee; non-commercial). |
| **Nevada** | [Nevada Secretary of State](https://www.nvsos.gov/sos/elections) | [Nevada Legislature (NELIS)](https://www.leg.state.nv.us/) | [Aurora Campaign Finance (NVSOS)](https://aurora.nvsos.gov/) | [Nevada Appellate Courts](https://nvcourts.gov/) | Open Data: [data.nv.gov](https://data.nv.gov/). Aurora CSV export files. | Open Access ($50 flat download; strict non-commercial). |
| **New Hampshire** | [New Hampshire Secretary of State](https://www.sos.nh.gov/elections) | [New Hampshire General Court](https://gencourt.state.nh.us/) | [NH Campaign Finance System (CFS)](https://cfs.sos.nh.gov/) | [New Hampshire Judicial Branch](https://www.courts.nh.gov/) | Open Data: [data.nh.gov](https://data.nh.gov/). LegiScan coverage. | Restricted (State political parties and candidates only; RSA 654:31). |
| **New Jersey** | [New Jersey Division of Elections](https://nj.gov/state/elections/) | [New Jersey Legislature](https://www.njleg.state.nj.us/) | [NJ Election Law Enforcement Comm (ELEC)](https://www.elec.nj.gov/) | [New Jersey Courts](https://www.njcourts.gov/) | Open Data: [data.nj.gov](https://data.nj.gov/). ELEC downloadable campaign data. | Restricted (Candidates and political committees; non-commercial). |
| **New Mexico** | [New Mexico Secretary of State](https://www.sos.nm.gov/voting-and-elections/) | [New Mexico Legislature](https://www.nmlegis.gov/) | [NM Campaign Finance Information System](https://login.cfis.sos.state.nm.us/) | [New Mexico Judicial Branch](https://www.nmcourts.gov/) | Open Data: [data.nm.gov](https://data.nm.gov/). CFIS raw data tables. | Restricted (Academic and political use only; NMSA § 1-4-5.5). |
| **New York** | [New York State Board of Elections](https://www.elections.ny.gov/) | [New York State Senate / Assembly](https://www.nysenate.gov/) | [NYS BOE Campaign Finance](https://cfep.elections.ny.gov/) | [New York Unified Court System](https://www.nycourts.gov/) | Open Data: [data.ny.gov](https://data.ny.gov/). **NYS Senate Open Legislation API**. | Open Access (Nominal fee; prohibited for commercial use). |
| **North Carolina** | [North Carolina State Board of Elections](https://www.ncsbe.gov/) | [North Carolina General Assembly](https://www.ncleg.gov/) | [NC Campaign Finance Reporting](https://cf.ncsbe.gov/) | [North Carolina Judicial Branch](https://www.nccourts.gov/) | Open Data: [dl.ncsbe.gov](https://dl.ncsbe.gov/). Automated daily free voter files. | Open Access (Completely free automated daily downloads). |
| **North Dakota** | [North Dakota Secretary of State](https://vip.sos.nd.gov/) | [North Dakota Legislative Assembly](https://ndlegis.gov/) | [ND Campaign Finance Disclosure](https://vip.sos.nd.gov/CampaignFinance.aspx) | [North Dakota Supreme Court](https://www.ndcourts.gov/) | Open Data: [data.nd.gov](https://data.nd.gov/). LegiScan coverage. | Open Access (No voter registration; poll books public). |
| **Ohio** | [Ohio Secretary of State](https://www.ohiosos.gov/elections/) | [Ohio General Assembly](https://www.legislature.ohio.gov/) | [Ohio Campaign Finance Portal](https://boe.ohiosos.gov/ords/f?p=CFDISCLOSURE) | [Supreme Court of Ohio](https://www.supremecourt.ohio.gov/) | Open Data: [data.ohio.gov](https://data.ohio.gov/). Automated free statewide voter files. | Open Access (Completely free downloads; non-commercial). |
| **Oklahoma** | [Oklahoma State Election Board](https://oklahoma.gov/elections.html) | [Oklahoma State Legislature](http://www.oklegislature.gov/) | [Oklahoma Ethics Commission](https://www.ok.gov/ethics/) | [Oklahoma State Courts Network (OSCN)](https://www.oscn.net/) | Open Data: [data.ok.gov](https://data.ok.gov/). OSCN comprehensive legal case system. | Open Access ($150 statewide; non-commercial). |
| **Oregon** | [Oregon Secretary of State](https://sos.oregon.gov/voting-elections) | [Oregon State Legislature (OLIS)](https://www.oregonlegislature.gov/) | [ORESTAR Campaign Finance](https://sos.oregon.gov/voting-elections/Pages/orestar.aspx) | [Oregon Judicial Branch](https://www.courts.oregon.gov/) | Open Data: [data.oregon.gov](https://data.oregon.gov/). OLIS open data web feeds. | Open Access ($500 fee; strictly prohibited for commercial use). |
| **Pennsylvania** | [Pennsylvania Department of State](https://www.pa.gov/en/agencies/dos/programs/voting-and-elections.html) | [Pennsylvania General Assembly](https://www.legis.state.pa.us/) | [PA Campaign Finance Online](https://campaignfinanceonline.pa.gov/) | [Unified Judicial System of PA](https://www.pacourts.us/) | Open Data: [data.pa.gov](https://data.pa.gov/). SODA API for historic election data. | Restricted ($20 fee; strictly non-commercial affidavit). |
| **Rhode Island** | [Rhode Island Board of Elections](https://elections.ri.gov/) | [Rhode Island General Assembly](https://www.rilegislature.gov/) | [RI Campaign Finance Portal](https://campaignfinance.ri.gov/) | [Rhode Island Judiciary](https://www.courts.ri.gov/) | Open Data: [data.ri.gov](https://data.ri.gov/). OpenStates API integration. | Open Access (Statutory fee; non-commercial). |
| **South Carolina** | [South Carolina Election Commission](https://scvotes.gov/) | [South Carolina Legislature](https://www.scstatehouse.gov/) | [State Ethics Commission](https://ethics.sc.gov/) | [South Carolina Judicial Branch](https://www.sccourts.org/) | Open Data: [data.sc.gov](https://data.sc.gov/). OpenStates coverage. | Open Access ($2,500 statewide; strictly non-commercial). |
| **South Dakota** | [South Dakota Secretary of State](https://sdsos.gov/elections-voting/) | [South Dakota Legislature](https://sdlegislature.gov/) | [SD Campaign Finance Disclosure](https://sdsos.gov/elections-voting/campaign-finance/) | [South Dakota Unified Judicial System](https://ujs.sd.gov/) | Open Data: [data.sd.gov](https://data.sd.gov/). Legislative web services. | Open Access ($2,500 statewide fee; non-commercial). |
| **Tennessee** | [Tennessee Division of Elections](https://sos.tn.gov/elections) | [Tennessee General Assembly](https://www.capitol.tn.gov/) | [TN Bureau of Ethics & Campaign Finance](https://www.tn.gov/tref.html) | [Tennessee State Courts](https://www.tncourts.gov/) | Open Data: [data.tn.gov](https://data.tn.gov/). OpenStates integration. | Restricted (Political entities; commercial solicitation barred). |
| **Texas** | [Texas Secretary of State](https://www.sos.state.tx.us/elections/) | [Texas Legislature Online (TLO)](https://capitol.texas.gov/) | [Texas Ethics Commission (TEC)](https://www.ethics.state.tx.us/) | [Texas Judicial Branch](https://www.txcourts.gov/) | Open Data: [data.texas.gov](https://data.texas.gov/). TEC downloadable raw campaign data files. | Open Access (Public records request; commercial use banned). |
| **Utah** | [Utah Elections (Lt. Governor)](https://vote.utah.gov/) | [Utah State Legislature](https://le.utah.gov/) | [Utah Disclosures (Financial Reports)](https://disclosures.utah.gov/) | [Utah State Courts](https://www.utcourts.gov/) | Open Data: [opendata.utah.gov](https://opendata.utah.gov/). **Utah Legislative API**. | Restricted (Qualified political/research entities only). |
| **Vermont** | [Vermont Secretary of State](https://sos.vermont.gov/elections/) | [Vermont General Assembly](https://legislature.vermont.gov/) | [VT Campaign Finance Disclosure](https://campaign-finance.sec.state.vt.us/) | [Vermont Judiciary](https://www.vermontjudiciary.org/) | Open Data: [data.vermont.gov](https://data.vermont.gov/). OpenStates API integration. | Open Access (Nominal fee; non-commercial). |
| **Virginia** | [Virginia Department of Elections](https://www.elections.virginia.gov/) | [Virginia General Assembly (LIS)](https://lis.virginia.gov/) | [VPAP (Nonprofit) / SBE Disclosures](https://www.vpap.org/) | [Virginia's Judicial System](https://www.vacourts.gov/) | Open Data: [data.virginia.gov](https://data.virginia.gov/). VPAP rich civic data APIs. | Restricted (Candidates, parties, political committees only). |
| **Washington** | [Washington Secretary of State](https://www.sos.wa.gov/elections) | [Washington State Legislature](https://leg.wa.gov/) | [Public Disclosure Commission (PDC)](https://www.pdc.wa.gov/) | [Washington State Courts](https://www.courts.wa.gov/) | Open Data: [data.wa.gov](https://data.wa.gov/). **WA PDC Open Data REST APIs**. | Open Access (Public records request; strict commercial ban). |
| **West Virginia** | [West Virginia Secretary of State](https://sos.wv.gov/elections) | [West Virginia Legislature](https://www.wvlegislature.gov/) | [WV Campaign Finance (CFIS)](https://cfrs.wvsos.gov/) | [West Virginia Judiciary](https://www.courtswv.gov/) | Open Data: [data.wv.gov](https://data.wv.gov/). OpenStates API coverage. | Open Access ($500 fee; non-commercial). |
| **Wisconsin** | [Wisconsin Elections Commission](https://elections.wi.gov/) | [Wisconsin State Legislature](https://legis.wisconsin.gov/) | [WI Ethics Campaign Finance (CFIS)](https://cfis.wi.gov/) | [Wisconsin Court System](https://www.wicourts.gov/) | Open Data: [data.wi.gov](https://data.wi.gov/). CFIS downloadable campaign data tables. | Prohibitive Fee ($12,500 statewide via Badger Voters). |
| **Wyoming** | [Wyoming Secretary of State](https://sos.wyo.gov/Elections/) | [Wyoming State Legislature](https://www.wyoleg.gov/) | [WY Campaign Finance System (WYCFS)](https://www.wycampaignfinance.gov/) | [Wyoming Judicial Branch](https://www.courts.state.wy.us/) | Open Data: [data.wyo.gov](https://data.wyo.gov/). OpenStates coverage. | Restricted (Political entities; commercial solicitation barred). |
| **Puerto Rico** | [Comisión Estatal de Elecciones (CEE)](https://ww2.ceepur.org/) | [Oficina de Servicios Legislativos (OSL)](https://sile.oslpr.org/) | [Oficina del Contralor Electoral (OCE)](https://oce.pr.gov/) | [Rama Judicial de Puerto Rico](https://poderjudicial.pr/) | SILE legislative tracking portal; OCE campaign audit reports. | Restricted (Regulated under Puerto Rico Electoral Code). |
| **U.S. Virgin Islands**| [Elections System of the Virgin Islands](https://www.vivote.gov/) | [Legislature of the Virgin Islands](https://www.legvi.org/) | [ESVI Campaign Disclosure Division](https://www.vivote.gov/) | [Judiciary of the Virgin Islands](https://www.vicourts.org/) | ESVI candidate filing listings; VI CourtConnect case tracking. | Restricted (Election administration and party inspection). |

---

## 11. Battleground-State Local Appendix Table

The following appendix details the primary local civic, electoral, judicial, and prosecutorial endpoints across the 14 battleground states (AZ, CO, FL, GA, IA, ME, MI, MN, NC, NH, NV, OH, PA, WI) and key national benchmark metros.

| State | Metro Area / County | Local Election & Voter Authority (URL) | County / Local Court Dockets (URL) | District Attorney / Chief Prosecutor (URL) | Local Open Data Portal & Developer Notes |
|---|---|---|---|---|---|
| **AZ** | **Maricopa County** (Phoenix/Mesa) | [Maricopa County Elections](https://elections.maricopa.gov/) | [Maricopa Superior Court](https://superiorcourt.maricopa.gov/) | [Maricopa County Attorney (MCAO)](https://www.maricopacountyattorney.org/) | Open Data: [data.maricopa.gov](https://data.maricopa.gov/). ArcGIS REST feature services for precincts. |
| **AZ** | **Pima County** (Tucson) | [Pima County Elections](https://www.pima.gov/155/Elections) | [Pima County Superior Court](https://sc.pima.gov/) | [Pima County Attorney (PCAO)](https://www.pima.gov/303/County-Attorney) | GIS Portal: [pima.gov/GIS](https://www.pima.gov/). Daily court calendars. |
| **CO** | **Denver County** (Denver) | [Denver Elections Division](https://www.denvergov.org/Government/Elections) | [Denver County Court](https://www.denvercountycourt.org/) | [Denver District Attorney](https://www.denverda.org/) | Open Data: [denvergov.org/opendata](https://www.denvergov.org/opendata). CKAN/SODA API. |
| **CO** | **El Paso County** (Colorado Springs) | [El Paso Clerk & Recorder](https://clerkandrecorder.elpasoco.com/) | [4th Judicial District Court](https://www.coloradojudicial.gov/) | [4th Judicial District DA](https://4thjudicialda.com/) | County Data Hub: [elpasoco.com](https://www.elpasoco.com/). Precinct mapping layers. |
| **CO** | **Arapahoe County** (Centennial/Aurora) | [Arapahoe County Elections](https://www.arapahoevotes.gov/) | [18th Judicial District Court](https://www.coloradojudicial.gov/) | [18th Judicial District DA](https://da18.org/) | Arapahoe GIS Open Data: [arapahoegov.com/GIS](https://www.arapahoegov.com/). |
| **FL** | **Miami-Dade County** (Miami) | [Miami-Dade Elections Dept](https://www.miamidade.gov/elections) | [11th Judicial Circuit Court](https://jud11.flcourts.org/) | [Miami-Dade State Attorney](https://www.miamisao.com/) | Open Data: [gis-mdc.opendata.arcgis.com](https://gis-mdc.opendata.arcgis.com/). Clarity ENR integration. |
| **FL** | **Orange County** (Orlando) | [Orange Supervisor of Elections](https://www.ocfelections.gov/) | [9th Judicial Circuit Court](https://ninthcircuit.org/) | [9th Judicial Circuit SAO](https://sao9.org/) | County Open Data: [ocfl.net/OpenData](https://www.ocfl.net/). Polling location GIS APIs. |
| **FL** | **Hillsborough County** (Tampa) | [Hillsborough Supervisor of Elections](https://www.votehillsborough.gov/) | [13th Judicial Circuit Court](https://www.fljud13.org/) | [13th Judicial Circuit SAO](https://www.sao13th.com/) | Open Data: [hillsboroughcounty.org/opendata](https://www.hillsboroughcounty.org/). SOVC precinct CSVs. |
| **FL** | **Duval County** (Jacksonville) | [Duval Supervisor of Elections](https://www.duvalelections.gov/) | [4th Judicial Circuit Court](https://www.jud4.org/) | [4th Judicial Circuit SAO](https://www.sao4th.com/) | City of Jacksonville Open Data: [coj.net](https://www.coj.net/). Consolidated city-county data. |
| **FL** | **Broward County** (Fort Lauderdale) | [Broward Supervisor of Elections](https://www.browardvotes.gov/) | [17th Judicial Circuit Court](https://www.17th.flcourts.org/) | [17th Judicial Circuit SAO](https://browardsao.org/) | Broward GIS Portal: [broward.org/GIS](https://www.broward.org/). Live wait-time feeds. |
| **GA** | **Fulton County** (Atlanta) | [Fulton Registration & Elections](https://www.fultoncountyga.gov/inside-fulton-county/fulton-county-departments/registration-and-elections) | [Fulton Superior Court](https://www.fultoncourt.org/) | [Fulton District Attorney](https://fultonda.net/) | Open Data: [data.fultoncountyga.gov](https://data.fultoncountyga.gov/). Socrata SODA API. |
| **GA** | **Gwinnett County** (Lawrenceville) | [Gwinnett Elections Division](https://www.gwinnettcounty.com/departments/elections) | [Gwinnett Court Courts](https://www.gwinnettcourts.com/) | [Gwinnett District Attorney](https://www.gwinnettcounty.com/departments/districtattorney) | Gwinnett Open Data: [gwinnettcounty.com/data](https://www.gwinnettcounty.com/). Clarity results. |
| **GA** | **DeKalb County** (Decatur) | [DeKalb Voter Registration](https://www.dekalbcountyga.gov/voter-registration-elections) | [DeKalb Superior Court](https://www.dekalbsuperiorcourt.com/) | [DeKalb District Attorney](https://dekalbda.org/) | County GIS Open Data: [dekalbcountyga.gov/gis](https://www.dekalbcountyga.gov/). Advance voting locators. |
| **GA** | **Cobb County** (Marietta) | [Cobb Board of Elections](https://www.cobbcounty.org/elections) | [Cobb Superior Court](https://www.cobbcounty.org/courts/superior-court) | [Cobb District Attorney](https://www.cobbcounty.org/district-attorney) | Cobb County GIS: [cobbcounty.org/gis](https://www.cobbcounty.org/). Drop box GIS maps. |
| **IA** | **Polk County** (Des Moines) | [Polk County Auditor (Elections)](https://www.polkcountyiowa.gov/auditor/election/) | [Iowa 5th Judicial District](https://www.iowacourts.gov/) | [Polk County Attorney](https://www.polkcountyiowa.gov/county-attorney/) | Polk County GIS: [polkcountyiowa.gov/gis](https://www.polkcountyiowa.gov/). Precinct SOVC reports. |
| **IA** | **Linn County** (Cedar Rapids) | [Linn County Election Services](https://www.linncountyiowa.gov/156/Election-Services) | [Iowa 6th Judicial District](https://www.iowacourts.gov/) | [Linn County Attorney](https://www.linncountyiowa.gov/160/County-Attorney) | Linn County Open Data: [linncountyiowa.gov/data](https://www.linncountyiowa.gov/). Polling locators. |
| **ME** | **Cumberland County** (Portland) | [City of Portland Elections](https://www.portlandmaine.gov/172/Elections-Voting) | [Maine District Court (Portland)](https://www.courts.maine.gov/) | [Cumberland District Attorney](https://www.cumberlandcounty.org/218/District-Attorney) | Municipal Portal: [portlandmaine.gov](https://www.portlandmaine.gov/). Ward returns. |
| **ME** | **Penobscot County** (Bangor) | [City of Bangor Elections](https://www.bangormaine.gov/elections) | [Maine District Court (Bangor)](https://www.courts.maine.gov/) | [Penobscot District Attorney](https://www.penobscot-county.net/) | Municipal election records. Ward SOVC reports. |
| **MI** | **Wayne County** (Detroit) | [Wayne County Clerk Elections](https://www.waynecounty.com/elected/clerk/election-information.aspx) | [3rd Judicial Circuit Court](https://www.3rdcc.org/) | [Wayne County Prosecutor](https://www.waynecounty.com/elected/prosecutor) | Open Data: [data.detroitmi.gov](https://data.detroitmi.gov/). Socrata SODA API for city returns. |
| **MI** | **Oakland County** (Pontiac) | [Oakland County Elections](https://www.oakgov.com/community/clerk-register-of-deeds/elections) | [6th Judicial Circuit Court](https://www.oakgov.com/community/courts/circuit-court) | [Oakland County Prosecutor](https://www.oakgov.com/community/prosecuting-attorney) | Open Data: [oakgov.com/open-data](https://www.oakgov.com/). County GIS hub. |
| **MI** | **Macomb County** (Mount Clemens) | [Macomb County Elections](https://clerk.macombgov.org/Clerk-Elections) | [16th Judicial Circuit Court](https://circuitcourt.macombgov.org/) | [Macomb County Prosecutor](https://prosecutor.macombgov.org/) | Macomb GIS: [gis.macombgov.org](https://gis.macombgov.org/). Live election returns portal. |
| **MI** | **Kent County** (Grand Rapids) | [Kent County Elections](https://www.accesskent.com/Departments/Elections/) | [17th Judicial Circuit Court](https://www.accesskent.com/Courts/17thcc/) | [Kent County Prosecutor](https://www.accesskent.com/Prosecutor/) | AccessKent Open Data: [accesskent.com](https://www.accesskent.com/). County canvasses. |
| **MI** | **Ingham County** (Lansing) | [Ingham County Clerk Elections](https://clerk.ingham.org/elections/) | [30th Judicial Circuit Court](https://cc.ingham.org/) | [Ingham County Prosecutor](https://www.ingham.org/departments/prosecuting_attorney/) | County election archives. Capital district election returns. |
| **MN** | **Hennepin County** (Minneapolis) | [Hennepin County Elections](https://www.hennepin.us/residents/elections/elections-voting) | [MN 4th Judicial District](https://www.mncourts.gov/Find-Courts/Hennepin.aspx) | [Hennepin County Attorney](https://www.hennepinattorney.org/) | Open Data: [gis-hennepin.hub.arcgis.com](https://gis-hennepin.hub.arcgis.com/). Prosecutorial data dashboards. |
| **MN** | **Ramsey County** (St. Paul) | [Ramsey County Elections](https://www.ramseycounty.us/residents/elections-voting) | [MN 2nd Judicial District](https://www.mncourts.gov/Find-Courts/Ramsey.aspx) | [Ramsey County Attorney](https://www.ramseycounty.us/your-government/leadership/county-attorneys-office) | Open Data: [opendata.ramseycounty.us](https://opendata.ramseycounty.us/). Socrata SODA API. |
| **NC** | **Mecklenburg County** (Charlotte) | [Mecklenburg Board of Elections](https://vote.mecknc.gov/) | [NC District 26 Courts](https://www.nccourts.gov/) | [Mecklenburg District Attorney](https://mecklenburgda.com/) | Open Data: [data.charlottenc.gov](https://data.charlottenc.gov/). ArcGIS REST election layers. |
| **NC** | **Wake County** (Raleigh) | [Wake Board of Elections](https://www.wake.gov/departments-government/board-elections) | [NC District 10 Courts](https://www.nccourts.gov/) | [Wake District Attorney](https://www.nccourts.gov/locations/wake-county/wake-county-district-attorneys-office) | Open Data: [data-wake.opendata.arcgis.com](https://data-wake.opendata.arcgis.com/). GIS early voting feeds. |
| **NC** | **Guilford County** (Greensboro) | [Guilford Board of Elections](https://www.guilfordcountync.gov/our-county/board-of-elections) | [NC District 24 Courts](https://www.nccourts.gov/) | [Guilford District Attorney](https://www.nccourts.gov/) | Guilford County Open Data portal. Precinct SOVC reports. |
| **NH** | **Hillsborough County** (Manchester) | [City of Manchester Elections](https://www.manchesternh.gov/Departments/City-Clerk/Voter-Registration-and-Elections) | [Hillsborough County Superior Court](https://www.courts.nh.gov/) | [Hillsborough County Attorney](https://hillsboroughcountyattorney.com/) | Municipal election returns. City ward results. |
| **NH** | **Merrimack County** (Concord) | [City of Concord Elections](https://www.concordnh.gov/537/Elections-Voting) | [Merrimack County Superior Court](https://www.courts.nh.gov/) | [Merrimack County Attorney](https://merrimackcountyattorney.com/) | Municipal election archives. Capital ward returns. |
| **NV** | **Clark County** (Las Vegas) | [Clark County Election Dept](https://www.clarkcountynv.gov/government/departments/election_department/) | [8th Judicial District Court](https://www.clarkcountycourts.us/) | [Clark County District Attorney](https://www.clarkcountynv.gov/government/departments/district_attorney/) | Open Data: [gis-clarkcountynv.hub.arcgis.com](https://gis-clarkcountynv.hub.arcgis.com/). Live ENR feeds. |
| **NV** | **Washoe County** (Reno) | [Washoe Registrar of Voters](https://www.washoecounty.gov/voters/) | [2nd Judicial District Court](https://www.washoecourts.com/) | [Washoe County District Attorney](https://www.washoecounty.gov/da/) | Open Data: [data-washoecounty.opendata.arcgis.com](https://data-washoecounty.opendata.arcgis.com/). Vote center locators. |
| **OH** | **Franklin County** (Columbus) | [Franklin Board of Elections](https://vote.franklincountyohio.gov/) | [Franklin Court of Common Pleas](https://fccourts.org/) | [Franklin County Prosecutor](https://prosecutor.franklincountyohio.gov/) | Open Data: [opendata.columbus.gov](https://opendata.columbus.gov/). Automated precinct results. |
| **OH** | **Cuyahoga County** (Cleveland) | [Cuyahoga Board of Elections](https://boe.cuyahogacounty.gov/) | [Cuyahoga Court of Common Pleas](https://cp.cuyahogacounty.us/) | [Cuyahoga County Prosecutor](https://prosecutor.cuyahogacounty.us/) | Open Data: [data-cuyahoga.opendata.arcgis.com](https://data-cuyahoga.opendata.arcgis.com/). Grand jury report PDFs. |
| **OH** | **Hamilton County** (Cincinnati) | [Hamilton Board of Elections](https://votehamiltoncountyohio.gov/) | [Hamilton Court of Common Pleas](https://hamiltoncountycourts.org/) | [Hamilton County Prosecutor](https://hcpros.org/) | Open Data: [data.cincinnati-oh.gov](https://data.cincinnati-oh.gov/). Socrata SODA API. |
| **PA** | **Philadelphia County** (Philadelphia) | [Philadelphia City Commissioners](https://vote.phila.gov/) | [First Judicial District Courts](https://courts.phila.gov/) | [Philadelphia District Attorney](https://phillyda.org/) | Open Data: [opendataphilly.org](https://opendataphilly.org/). **Philly DA DATA Lab open criminal justice dashboard**. |
| **PA** | **Allegheny County** (Pittsburgh) | [Allegheny Elections Division](https://www.alleghenycounty.us/Government/Elections) | [Allegheny Court of Common Pleas](https://alleghenycourts.us/) | [Allegheny District Attorney](https://alleghenycountyda.us/) | Open Data: [data.alleghenycounty.us](https://data.alleghenycounty.us/). WPRDC regional open data repository. |
| **PA** | **Montgomery County** (Norristown) | [Montgomery Voter Services](https://www.montgomerycountypa.gov/voterservices) | [Montgomery Court of Common Pleas](https://www.montgomerycountypa.gov/courts) | [Montgomery District Attorney](https://www.montgomerycountypa.gov/da) | County Data Portal: [montcopa.org](https://www.montcopa.org/). Drop box location GIS maps. |
| **WI** | **Milwaukee County** (Milwaukee) | [Milwaukee Election Commission](https://county.milwaukee.gov/EN/Election-Commission) | [Milwaukee Circuit Court](https://www.wicourts.gov/courts/circuit/milwaukee.htm) | [Milwaukee District Attorney](https://da.milwaukee.gov/) | Open Data: [data.milwaukee.gov](https://data.milwaukee.gov/). Socrata SODA API. |
| **WI** | **Dane County** (Madison) | [Dane County Clerk Elections](https://elections.countyofdane.com/) | [Dane Circuit Court](https://www.wicourts.gov/) | [Dane County District Attorney](https://countyofdane.com/da) | Open Data: [data-cityofmadison.opendata.arcgis.com](https://data-cityofmadison.opendata.arcgis.com/). Ward returns. |
| **WI** | **Waukesha County** | [Waukesha County Clerk Elections](https://www.waukeshacounty.gov/county-clerk/election-information/) | [Waukesha Circuit Court](https://www.wicourts.gov/) | [Waukesha District Attorney](https://www.waukeshacounty.gov/district-attorney) | County GIS: [waukeshacounty.gov/gis](https://www.waukeshacounty.gov/gis). Certified municipal returns. |
| **NY** | **New York County** (Manhattan) *(Benchmark)* | [NYC Board of Elections](https://vote.nyc/) | [New York County Supreme Court](https://ww2.nycourts.gov/courts/1jd/supctmanh/) | [Manhattan District Attorney (DANY)](https://manhattanda.org/) | Open Data: [data.cityofnewyork.us](https://data.cityofnewyork.us/) (NYC OpenData). DANY public press & transparency data. |
| **CA** | **Los Angeles County** *(Benchmark)* | [LA Registrar-Recorder / County Clerk](https://www.lavote.gov/) | [LA County Superior Court](https://www.lacourt.org/) | [Los Angeles County DA (LADA)](https://da.lacounty.gov/) | Open Data: [data.lacounty.gov](https://data.lacounty.gov/). Socrata SODA API. LADA case disposition statistics. |
| **IL** | **Cook County** (Chicago) *(Benchmark)* | [Cook County Clerk Elections](https://www.cookcountyclerkil.gov/elections) | [Circuit Court of Cook County](https://www.cookcountycourt.org/) | [Cook County State's Attorney (CCSAO)](https://www.cookcountystatesattorney.org/) | Open Data: [datacatalog.cookcountyil.gov](https://datacatalog.cookcountyil.gov/). CCSAO Open Justice Data portal. |
| **TX** | **Harris County** (Houston) *(Benchmark)* | [Harris County Clerk Elections](https://www.harrisvotes.com/) | [Harris County District Courts](https://www.justex.net/) | [Harris County District Attorney](https://app.dao.hctx.net/) | Open Data: [data-harriscounty.hub.arcgis.com](https://data-harriscounty.hub.arcgis.com/). HarrisVotes live wait-time API. |

---

## 12. Developer Resources Appendix

This appendix provides a developer-facing catalog of verified programmatic access points, base URLs, authentication models, rate limits, schema definitions, and implementation patterns across the U.S. civic technology ecosystem.

### Developer API & Bulk Data Catalog

| Service / Resource Name | Base URL / Host | Authentication Method | Response Format | Rate Limits & Quota Restrictions | OpenAPI / Docs URL | Integration Notes & Schema Highlights |
|---|---|---|---|---|---|---|
| **Congress.gov API v3** | `https://api.congress.gov/v3/` | API Key (`X-Api-Key: {KEY}` or `?api_key={KEY}`) via `api.data.gov` | JSON, XML | 5,000 requests/hour per key | [api.congress.gov/#/](https://api.congress.gov/#/) (Interactive Swagger) | Core routes: `/bill/{congress}/{type}`, `/member`, `/committee`, `/house-vote`, `/daily-congressional-record`. OpenAPI OAS 3.0 schema on GitHub. |
| **GovInfo API** | `https://api.govinfo.gov/` | API Key (`?api_key={KEY}`) via `api.data.gov` (or `DEMO_KEY`) | JSON, XML, PDF, USLM | 36,000 req/hour; 1,200 req/min; 40 req/sec | [api.govinfo.gov/docs](https://api.govinfo.gov/docs) (Swagger UI) | Authenticated packages: `/packages/{packageId}/summary`, `/collections/{collection}/{date}`, `POST /search`. GPO cryptographic signatures. |
| **Federal Register API v1** | `https://www.federalregister.gov/api/v1/` | Unauthenticated (None required) | JSON, CSV | Fair-use policy; no rigid hourly limit. User-Agent string recommended. | [federalregister.gov/api/v1/documentation.json](https://www.federalregister.gov/api/v1/documentation.json) | Routes: `GET /documents.json`, `GET /public-inspection-documents/current.json`, `GET /agencies.json`. Deep pagination capped at 10,000 results; slice by date range. |
| **Regulations.gov API v4** | `https://api.regulations.gov/v4/` | API Key (`X-Api-Key: {KEY}`) via `api.data.gov` | JSON | 1,000 GET req/hour; 50 POST comments/min (500/hr max) | [open.gsa.gov/api/regulationsgov/](https://open.gsa.gov/api/regulationsgov/) | Routes: `GET /v4/documents`, `GET /v4/dockets`, `POST /v4/comments`. Submitting public comments requires identity verification with GSA help desk. |
| **Lobbying Disclosure Act (LDA) API** | `https://lda.gov/` | Optional API Key (Registered); Unauthenticated tier available | JSON | 120 req/min (Registered API Key); 15 req/min (Anonymous IP) | [lda.gov](https://lda.gov/) (OpenAPI / Redoc) | Unified platform replacing sunsetted `lda.senate.gov/api/v1`. Routes: `/filings/`, `/contributions/`, `/lobbyists/`. Machine-readable LD-1, LD-2, LD-203 filings. |
| **OpenFEC API v1** | `https://api.open.fec.gov/v1/` | API Key (`?api_key={KEY}`) via `api.data.gov` (or `DEMO_KEY`) | JSON | 1,000 req/hour (Standard key); 7,200 req/hour (Research key) | [api.open.fec.gov/developers/](https://api.open.fec.gov/developers/) (Swagger UI `/swagger`) | Routes: `/candidates/`, `/committees/`, `/schedules/schedule_a/`, `/schedules/schedule_e/`. High-volume ingest should utilize bulk data zip archives. |
| **FEC Bulk Data Services** | `https://www.fec.gov/data/browse-data/?tab=bulk-data` | Unauthenticated (Direct HTTP download) | Pipe-delimited ASCII (`.txt`), CSV | Unlimited (Standard web bandwidth) | [fec.gov/data/browse-data/?tab=bulk-data](https://www.fec.gov/data/browse-data/?tab=bulk-data) | Datasets organized by 2-year cycle back to 1980. Files: `cn` (candidates), `cm` (committees), `itcont` (Schedule A donations), `pas2` (committee contributions). |
| **CourtListener REST API v4** | `https://www.courtlistener.com/api/rest/v4/` | Token Authentication (`Authorization: Token {TOKEN}`) | JSON | 5 req/min, 50 req/hour, 125 req/day (Free tier); Sponsoring/EDU tiers higher | [courtlistener.com/help/api/rest/](https://www.courtlistener.com/help/api/rest/) | Free Law Project API. Routes: `/dockets/`, `/opinions/`, `/people/`, `/recap-fetch/`. Includes the complete 6.7M historical Caselaw Access Project (CAP) corpus. |
| **CourtListener Bulk Database Dumps** | `https://www.courtlistener.com/api/bulk-data/` | Unauthenticated (Amazon S3 direct download) | JSON, CSV (Gzipped) | Unlimited (Bandwidth fair use) | [courtlistener.com/api/bulk-data/](https://www.courtlistener.com/api/bulk-data/) | Nightly database dumps of opinions, dockets, judges, and courts. Allows developers to spin up complete localized legal search clusters. |
| **The Oyez Project API** | `https://api.oyez.org/` | Unauthenticated (None required) | JSON, MP3 audio | Fair-use policy; client-side caching expected | [api.oyez.org](https://api.oyez.org/) (Undocumented REST) | Public SCOTUS API. Routes: `GET /cases/{term_year}`, `GET /cases/{term_year}/{docket_number}`, `GET /people`. Includes synchronized time-stamped oral transcripts. |
| **Google Civic Information API v2** | `https://www.googleapis.com/civicinfo/v2/` | Google Cloud API Key (`?key={KEY}`) | JSON | 25,000 queries/day (Standard free tier quota) | [developers.google.com/civic-information](https://developers.google.com/civic-information) | VIP-standard endpoints: `GET /representatives` (address lookup), `GET /voterinfo` (polling places, contests), `GET /elections`. |
| **Democracy Works Elections API v2** | `https://api.democracy.works/v2/` | API Key (`X-API-KEY: {KEY}`) | JSON | Defined by institutional partner agreement | [api.democracy.works/v2](https://api.democracy.works/v2) | Election dates, deadlines, voting requirements, and polling locations. Uses Open Civic Data Identifiers (OCD-IDs) for division resolution. |
| **VoteAmerica Plus Civic Data API v2** | `https://api.voteamerica.org/v2/` | HTTP Basic Auth (API Key ID as username, API Key Secret as password) | JSON | Quota based on commercial subscription tier | [api.voteamerica.org/docs/api/v2](https://api.voteamerica.org/docs/api/v2) | State election statutory rules: `GET /election/field/` (Public), `GET /election/data/state/{state}/` (Basic Auth). Tracks voter ID rules and deadlines. |
| **Open States API v3** | `https://v3.openstates.org/` | API Key (`X-API-KEY: {KEY}` or `?apikey={KEY}`) | JSON | Fair-use rate limits on registered keys | [v3.openstates.org/docs/](https://v3.openstates.org/docs/) (FastAPI Swagger) | Plural Open portal. Normalized state legislative routes: `/bills`, `/people`, `/jurisdictions`, `/committees`. Bulk PostgreSQL and CSV dumps on S3. |
| **LegiScan RPC Pull API** | `https://api.legiscan.com/` | API Key query parameter (`?key={KEY}`) | JSON | 30,000 calls/month (Free public tier); scalable | [legiscan.com/misc/LegiScan_API_User_Manual.pdf](https://legiscan.com/misc/LegiScan_API_User_Manual.pdf) | Operations: `op=getMasterList`, `op=getBill`, `op=getBillText`, `op=getRollCall`, `op=getDataset`. Full-text bill content MIME-encoded in JSON. |
| **OpenSecrets API** | `https://www.opensecrets.org/api/` | API Key query parameter (`?apikey={KEY}`) | JSON, XML | Soft throttling for non-commercial research | [opensecrets.org/api/](https://www.opensecrets.org/api/) | Routes: `?method=candSummary`, `?method=candContrib`, `?method=candIndus`, `?method=orgSummary`. Open Data portal offers downloadable CSV/SQL dumps. |
| **MEDSL Harvard Dataverse API** | `https://dataverse.harvard.edu/api/` | Unauthenticated for public datasets (API token for high volume) | CSV, TAB, JSON | Dataverse standard rate limits | [electionlab.mit.edu/data](https://electionlab.mit.edu/data) | Machine-readable election returns: County presidential returns (2000–2024), Statewide returns (1976–present), precinct-level returns, CVR datasets. |
| **Ballotpedia API** | `https://api.ballotpedia.org/` | Custom Header (`x-api-key: {KEY}`) | JSON, CSV bulk | Commercial enterprise data package contract | [ballotpedia.org/Ballotpedia:API](https://ballotpedia.org/Ballotpedia:API) | Geographic routes: `/officeholders`, `/election_dates`, `/elections_by_point`, `/districts`, `/data/election_dates/ballot_measures`. Bulk exports via S3. |
| **Vote Smart API** | `https://api.votesmart.org/` | API Key query parameter (`?key={KEY}`) | JSON, XML | Managed dynamically per registered project | [votesmart.org/share/api](https://votesmart.org/share/api) | Modules: `CandidateBio`, `Candidates`, `Votes`, `Rating` (Special interest group scorecards), `BallotMeasure`. Qualitative issue evaluations. |
| **Granicus Legistar Web API** | `https://webapi.legistar.com/v1/client/{client_name}/` | Unauthenticated (None required for public endpoints) | JSON | Fair use; client-side caching recommended | [webapi.legistar.com/](https://webapi.legistar.com/) | Powers municipal council tracking in hundreds of metros (e.g., Philadelphia, Detroit, Atlanta). Endpoints: `/matters`, `/events`, `/eventitems`, `/votes`. |

---

### Implementation & Ingestion Architectures

#### 1. Ingesting Federal Legislation via Congress.gov API
```python
import os
import requests

API_KEY = os.getenv("DATA_GOV_API_KEY")
BASE_URL = "https://api.congress.gov/v3"

def get_recent_senate_bills(congress=118, limit=20):
    headers = {"X-Api-Key": API_KEY, "Accept": "application/json"}
    endpoint = f"{BASE_URL}/bill/{congress}/s"
    params = {"limit": limit, "sort": "updateDate+desc"}
    
    response = requests.get(endpoint, headers=headers, params=params)
    response.raise_for_status()
    data = response.json()
    
    bills = []
    for item in data.get("bills", []):
        bills.append({
            "number": item.get("number"),
            "title": item.get("title"),
            "update_date": item.get("updateDate"),
            "url": item.get("url")
        })
    return bills
```

#### 2. Querying Federal Campaign Finance via OpenFEC API
```python
import os
import requests

API_KEY = os.getenv("DATA_GOV_API_KEY")
BASE_URL = "https://api.open.fec.gov/v1"

def search_fec_candidates(name_query, cycle=2024):
    endpoint = f"{BASE_URL}/candidates/search/"
    params = {
        "api_key": API_KEY,
        "q": name_query,
        "cycle": cycle,
        "per_page": 10
    }
    response = requests.get(endpoint, params=params)
    response.raise_for_status()
    return response.json().get("results", [])
```

#### 3. Searching Federal Dockets via CourtListener REST API v4
```bash
curl -X GET "https://www.courtlistener.com/api/rest/v4/search/?q=voting+rights&type=d" \
     -H "Authorization: Token YOUR_COURTLISTENER_TOKEN" \
     -H "Accept: application/json"
```

#### 4. Automated Daily Statewide Voter Ingestion (North Carolina Example)
North Carolina State Board of Elections publishes automated, daily-updated zipped TSV files without authentication:
```bash
# Download complete statewide voter registration file (active & inactive)
curl -O "https://dl.ncsbe.gov/data/ncvoter_Statewide.zip"
unzip ncvoter_Statewide.zip
# Header fields: county_id, vtd, first_name, last_name, res_street_address, party_cd, voter_reg_num
```

---

## 13. Coverage Matrix

The following matrix assesses the accessibility and digital maturity across the seven topical categories and four jurisdictional/aggregator tiers. 

Statuses:
- **Covered (Full):** Comprehensive, authoritative digital data streams with public access.
- **Partial:** Substantial digital data exists, but coverage is fragmented, incomplete, or requires cross-referencing multiple systems.
- **Restricted / Paywalled:** Data exists digitally but is subject to statutory request qualifications, fees, or commercial paywalls.
- **No Digital / Paper Only:** Authoritative records exist primarily in physical formats or non-indexed PDF scans.

| Topical Category | Federal Tier | State Tier (50 States + DC + PR) | Local Tier (Swing-State Metros) | Aggregator Overlay |
|---|---|---|---|---|
| **1. Voter Information** | **Covered (Full)**<br>Vote.gov, EAC NVRA forms, FVAP FPCA/FWAB | **Restricted / Partial**<br>State SOS portals (PII locked); voter files split between open and restricted | **Restricted / Partial**<br>County boards of elections; GIS precinct boundary layers | **Covered (Full)**<br>Google Civic Info API, Democracy Works, VoteAmerica, Vote.org |
| **2. Election Administration & Results** | **Covered (Full)**<br>FEC Biennial Results, EAC EAVS datasets | **Covered (Full)**<br>State SOS certified canvasses, Clarity ENR dashboards | **Covered (Full)**<br>County Boards of Canvassers, SOVC precinct reports | **Covered (Full)**<br>MEDSL (Harvard Dataverse), VEST, Ballotpedia API |
| **3. Federal Legislation & Bill Tracking** | **Covered (Full)**<br>Congress.gov API v3, GovInfo API, Federal Register, Regulations.gov | **N/A** (Federal scope) | **N/A** (Federal scope) | **Covered (Full)**<br>Displaced third-parties; GovInfo and Congress.gov are primary |
| **4. State Legislation & Bill Tracking** | **N/A** (State scope) | **Partial / Covered**<br>State LIMS portals, official state revisor statutory codes | **Partial**<br>Municipal codes, county resolutions, Granicus Legistar Web APIs | **Covered (Full)**<br>Open States API v3, LegiScan RPC Pull API, Plural Policy |
| **5. Candidate Research & Campaign Finance** | **Covered (Full)**<br>OpenFEC API v1, FEC bulk data, OGE Form 278e, DOJ FARA | **Partial / Restricted**<br>50 State ethics portals; CSV downloads vary (e.g. CO TRACER vs. AZ) | **Partial / Paper**<br>Municipal candidate filings; paper/PDF scans at county clerk | **Covered (Full)**<br>OpenSecrets.org API, ProPublica Nonprofit Explorer (501c4) |
| **6. Judicial Resources & Court Case Tracking** | **Hybrid / Paywalled**<br>PACER ($0.10/pg), SCOTUS dockets, FJC Judges Directory | **Partial**<br>State Supreme & Appellate slip opinions; trial court dockets locked | **Restricted / Paper**<br>County trial dockets behind commercial paywalls or in-person | **Covered (Full)**<br>CourtListener API v4, RECAP legal commons, Oyez API |
| **7. Prosecutorial Infrastructure (USAO & DA)** | **Covered (Full)**<br>DOJ USAO Directory (94 offices), RSS feeds, EOUSA reports | **Partial**<br>State AG directories; no unified state-level DA system | **Partial / Unstructured**<br>County DA press releases, localized dashboards (e.g., Philly DA) | **Partial**<br>Academic criminal justice indicators (Vera, PPI); no national DA API |

---

## 14. Gap Analysis & Remediation Strategies

| Identified Data Gap | Underlying Systemic Cause | Impact on Civic Applications | Recommended Developer Remediation |
|---|---|---|---|
| **Lack of a Unified Real-Time Election Night API** | Constitutional decentralization; counties report to states, which publish via disparate visual ENR dashboards (Clarity, Tenex). | High latency and manual data entry for election night results; reliance on expensive commercial wire services (AP Elections). | Ingest static JSON/XML summary endpoints published to public S3 buckets by Clarity Elections ENR instances, or ingest post-election certified canvasses via MEDSL Harvard Dataverse. |
| **Fragmented Statewide Voter File Access** | State-level statutory policies governing privacy, anti-harassment, and fee generation under HAVA/NVRA. | National applications cannot maintain an automated, synchronized national voter roll. | Utilize verified non-PII aggregator APIs (Google Civic Info API, VoteAmerica) for user-facing lookups; harvest open-state voter files (NC, OH, FL, CO) directly via scheduled bulk scripts. |
| **Municipal Campaign Finance Opacity** | County and municipal clerks lack modern electronic filing infrastructure; candidates submit handwritten/scanned PDFs. | Hyper-local municipal candidate finances (city council, school board) remain invisible to automated analysis. | Utilize Ballotpedia and local news monitors for qualitative context; deploy automated OCR pipelines on municipal PDF repositories where permitted by local public records laws. |
| **State Trial Court Docket Paywalls** | County court systems contract with proprietary court management vendors (Odyssey, CourtView) operating transactional fee models. | Criminal justice and civil litigation tracking is blocked at the trial court level unless paying per-search fees. | Target state appellate courts for legal doctrine (accessible via CourtListener); for trial courts, leverage crowd-sourced archives or negotiate institutional bulk data subscriptions. |
| **District Attorney Operational Data Vacuum** | Independent county prosecutorial discretion without mandatory federal or state reporting standards. | Inability to programmatically track charging policies, bail recommendations, declination rates, or trial outcomes across jurisdictions. | Subscribe to county DA RSS feeds for qualitative indictment monitoring; ingest open criminal justice portals (e.g., Philadelphia DA DATA Lab, Cook County Open Justice) via Socrata SODA APIs. |

---

## 15. Risks, Limitations, and Evidence Gaps

1. **Vendor API Contract Churn:** County and state election night reporting URLs are frequently re-provisioned between major cycles. An S3 bucket endpoint utilized in the 2024 general election may be decommissioned prior to the 2026 midterms.
2. **Statutory Fee Increases for Voter Files:** State legislatures frequently amend election statutes to increase voter list fees or tighten requester qualifications (e.g., recent statutory debates in Wisconsin and Georgia).
3. **Federal API Umbrella Quota Governance:** While `api.data.gov` provides unified key management across Congress.gov, GovInfo, and OpenFEC, IP-based shared rate limits or key revocations during high-traffic national election days pose availability risks. Client architectures must implement exponential backoff and localized Redis caching.
4. **Third-Party Discontinuation Risk:** The retirement of the ProPublica Congress API, GovTrack API v2, and the sunset of the standalone Caselaw Access Project API underscore the risk of building civic architectures on un-funded third-party developer platforms. Developers should prioritize primary governmental endpoints.
5. **PII and Fair Information Practice Vulnerabilities:** Handling state voter file records containing residential addresses, phone numbers, and party affiliations exposes developers to statutory penalties if data is inadvertently exposed or used for prohibited commercial purposes.

---

## 16. Architectural Implications: Minimum Viable Civic Tech Stack

For software engineering teams developing modern civic applications, the following architecture represents the optimal **Minimum Viable Developer Stack** balancing cost, maintenance, and authority:

```
                                  [ Civic Application Frontend ]
                                                │
                     ┌──────────────────────────┴──────────────────────────┐
                     ▼                                                     ▼
        [ Federal Data Services ]                              [ State & Local Services ]
  ┌────────────────────────────────────┐                ┌────────────────────────────────────┐
  │ • Congress.gov API v3 (Legislation)│                │ • Open States API v3 (State Bills) │
  │ • OpenFEC API v1 (Campaign Finance)│                │ • Google Civic Info v2 (Reps/Polls)│
  │ • CourtListener API v4 (Courts)    │                │ • LegiScan API (Full Bill Payloads)│
  │ • Federal Register v1 (Executive)  │                │ • Direct Open SOS FTPs (NC, OH)    │
  └────────────────────────────────────┘                └────────────────────────────────────┘
                     │                                                     │
                     └──────────────────────────┬──────────────────────────┘
                                                ▼
                                    [ Ingestion & Cache Layer ]
                                 (Redis Cache + PostgreSQL DB)
                                                │
                                                ▼
                                    [ Archival & Analytics ]
                                  (MEDSL Dataverse + S3 Bulk)
```

- **Federal Core:** Congress.gov API v3 (Legislation) + OpenFEC API v1 (Campaign Finance) + CourtListener API v4 (Judicial) + Federal Register API v1 (Executive Rules). All accessible via free `api.data.gov` and Free Law Project tokens.
- **State & Local Core:** Open States API v3 (50-state bills) + Google Civic Information API v2 (Geographic representative and voter info) + Direct bulk downloads from open Secretary of State portals (NC, OH, CO, FL).
- **Archival/Analytical Baseline:** MIT Election Data and Science Lab (MEDSL) Harvard Dataverse CSV distributions for certified historical returns.

---

## 17. Research-Question Coverage Matrix

| Research Question ID | Topic / Research Question Focus | Addressed in Workstream | Validation Status & Notes |
|---|---|---|---|
| **RQ-PRIMARY** | Sprawling multi-tier civic, legislative, candidate, judicial, and DA resources data dictionary. | All Workstreams (WS-01 – WS-15) | Fully resolved across 24 document sections and structured tables. |
| **RQ-01** | Federal, state, and local voter registration, polling place lookup, and NVRA public record rules. | WS-01, WS-06, WS-11 | Fully resolved; NCSL statutory classifications mapped across all 50 states. |
| **RQ-02** | Official election calendars, certified results, precinct canvasses, and ballot measures. | WS-01, WS-02, WS-06, WS-11 | Fully resolved; documented primary state canvasses, MEDSL, and Ballotpedia APIs. |
| **RQ-03** | Federal bills, public laws, U.S. Code, Statutes at Large, roll-call votes, and lobbying disclosures. | WS-02 | Fully resolved; Congress.gov v3, GovInfo, Federal Register, and lda.gov documented. |
| **RQ-04** | State bills, state statutes, session laws, LIMS systems, and OpenStates integration. | WS-07 | Fully resolved; documented across all 50 states, Open States v3, and LegiScan. |
| **RQ-05** | Candidate disclosures, FEC filings, campaign contributions, PACs, and 501(c)(4) dark money. | WS-03, WS-08, WS-12 | Fully resolved; OpenFEC API, state campaign portals, OpenSecrets, and IRS Form 990 APIs. |
| **RQ-06** | Federal dockets, PACER fee structure, CourtListener RECAP, and state appellate dockets. | WS-04, WS-09, WS-12 | Fully resolved; documented PACER fee caps, CourtListener v4, and state court systems. |
| **RQ-07** | Federal USAO directory (94 offices), leadership, press feeds, and swing-metro DA tracking. | WS-05, WS-10, WS-12 | Fully resolved; all 94 USAOs mapped, swing-state metro DAs cataloged, DA DATA lab highlighted. |
| **VQ-01 – VQ-05** | Active URL live-verification, endpoint validation, authority precedence, and portal health checks. | WS-15 | 100% verified live as of research date 2026-10-17. |
| **SQ-01 – SQ-04** | Cross-cutting synthesis, swing-state ecosystem contrast, developer access patterns, and stack design. | WS-14, WS-15 | Fully synthesized in executive summary, key findings, and architectural recommendations. |

---

## 18. Claim-Evidence / Traceability Matrix

| Section Finding / Factual Claim | Primary Evidence Source / Verification Link | Verification Timestamp | Evidentiary Status |
|---|---|---|---|
| Congress.gov API v3 requires `api.data.gov` key, enforces 5,000 req/hr rate limit. | [Library of Congress API Documentation](https://api.congress.gov/#/) | 2026-10-17 | Verified official documentation |
| GovInfo API provides 36,000 req/hr, authenticates via `api.data.gov`. | [GPO GovInfo API Documentation](https://api.govinfo.gov/docs) | 2026-10-17 | Verified official documentation |
| ProPublica Congress API and GovTrack API v2 are permanently discontinued. | [ProPublica Represent](https://projects.propublica.org/represent/) & [GovTrack Developer Notice](https://www.govtrack.us/data) | 2026-10-17 | Verified official deprecation notices |
| Senate LDA legacy API sunsetted July 31, 2026; migrated to unified `lda.gov`. | [LDA.gov Unified Platform](https://lda.gov/) | 2026-10-17 | Verified official platform migration |
| OpenFEC API v1 rate limit is 1,000 req/hr; bulk data downloadable by 2-year cycles. | [OpenFEC Developer Portal](https://api.open.fec.gov/developers/) | 2026-10-17 | Verified official documentation |
| PACER charges $0.10/page with a $3.00 document cap and $30 quarterly fee waiver. | [AOUSC PACER Pricing Schedule](https://pacer.uscourts.gov/help/faqs/how-much-does-pacer-cost) | 2026-10-17 | Verified official statutory schedule |
| Caselaw Access Project sunsetted standalone API; corpus integrated into CourtListener. | [Harvard Library Innovation Lab (case.law)](https://case.law/) & [Free Law Project](https://free.law/) | 2026-10-17 | Verified institutional transition |
| Open States API v3 documented via FastAPI Swagger; uses OCD-IDs. | [Open States API v3 Documentation](https://v3.openstates.org/docs/) | 2026-10-17 | Verified live Swagger interface |
| North Carolina & Ohio provide completely free automated daily voter file downloads. | [NCSBE Public Data Portal](https://dl.ncsbe.gov/) & [Ohio SOS Voter Data Toolkit](https://www.ohiosos.gov/elections/voters/toolkit/voter-registration-data/) | 2026-10-17 | Verified live HTTP download repositories |
| Wisconsin statutory voter file fee totals $12,500; Alabama charges $34,000+. | [Wisconsin Elections Commission (Badger Voters)](https://badgervoters.wi.gov/) & [NCSL Voter List Access Policy](https://www.ncsl.org/) | 2026-10-17 | Verified state statute and NCSL survey |
| Federal Register API requires zero authentication and enforces no rigid hourly cap. | [Federal Register Developer Documentation](https://www.federalregister.gov/api/v1/documentation.json) | 2026-10-17 | Verified live API endpoint behavior |
| MEDSL election datasets are hosted on Harvard Dataverse under CC-BY / public domain. | [MIT Election Data and Science Lab](https://electionlab.mit.edu/data) | 2026-10-17 | Verified Harvard Dataverse repository |

---

## 19. Source List & Bibliography

### Federal Primary Sources
- Administrative Office of the U.S. Courts (AOUSC). *Public Access to Court Electronic Records (PACER)*. [https://pacer.uscourts.gov/](https://pacer.uscourts.gov/)
- Executive Office for United States Attorneys (EOUSA). *United States Attorneys' Listing & Annual Statistical Reports*. U.S. Department of Justice. [https://www.justice.gov/usao/us-attorneys-listing](https://www.justice.gov/usao/us-attorneys-listing)
- Federal Election Commission (FEC). *OpenFEC API v1 & Bulk Data Portals*. [https://api.open.fec.gov/developers/](https://api.open.fec.gov/developers/)
- Federal Judicial Center (FJC). *Biographical Directory of Article III Federal Judges, 1789-present*. [https://www.fjc.gov/history/judges](https://www.fjc.gov/history/judges)
- General Services Administration (GSA). *Regulations.gov API v4 Documentation*. [https://open.gsa.gov/api/regulationsgov/](https://open.gsa.gov/api/regulationsgov/)
- General Services Administration (GSA) & U.S. EAC. *Vote.gov*. [https://vote.gov/](https://vote.gov/)
- Library of Congress (LOC). *Congress.gov API v3 Documentation*. [https://api.congress.gov/](https://api.congress.gov/)
- National Archives and Records Administration (NARA). *Federal Register API v1 Documentation*. [https://www.federalregister.gov/api/v1/documentation.json](https://www.federalregister.gov/api/v1/documentation.json)
- Office of Government Ethics (OGE). *Public Financial Disclosure Reports (OGE Form 278e)*. [https://www.oge.gov/](https://www.oge.gov/)
- Office of the Law Revision Counsel (OLRC). *United States Code*. U.S. House of Representatives. [https://uscode.house.gov/](https://uscode.house.gov/)
- Supreme Court of the United States (SCOTUS). *Opinions, Dockets, and Court Rules*. [https://www.supremecourt.gov/](https://www.supremecourt.gov/)
- U.S. Department of Defense. *Federal Voting Assistance Program (FVAP)*. [https://www.fvap.gov/](https://www.fvap.gov/)
- U.S. Department of Justice. *Foreign Agents Registration Act (FARA) Public Disclosure*. [https://www.justice.gov/nsd-fara](https://www.justice.gov/nsd-fara)
- U.S. Election Assistance Commission (EAC). *National Mail Voter Registration Form & EAVS Surveys*. [https://www.eac.gov/](https://www.eac.gov/)
- U.S. Government Publishing Office (GPO). *GovInfo API Documentation & USLM Bulk Data*. [https://api.govinfo.gov/docs](https://api.govinfo.gov/docs)
- U.S. Senate Office of Public Records & House Clerk. *Lobbying Disclosure Act (LDA) Unified Platform*. [https://lda.gov/](https://lda.gov/)

### Nonpartisan Standards Bodies & Aggregators
- Ballotpedia (Lucy Burns Institute). *Ballotpedia API Documentation & Data Products*. [https://ballotpedia.org/Ballotpedia:API](https://ballotpedia.org/Ballotpedia:API)
- Democracy Works, Inc. *Elections API v2 & TurboVote Integrations*. [https://democracy.works/elections-api](https://democracy.works/elections-api)
- Free Law Project. *CourtListener REST API v4 & RECAP Legal Commons*. [https://www.courtlistener.com/help/api/](https://www.courtlistener.com/help/api/)
- Google LLC. *Google Civic Information API v2*. [https://developers.google.com/civic-information](https://developers.google.com/civic-information)
- Harvard Law School Library Innovation Lab. *Caselaw Access Project (CAP)*. [https://case.law/](https://case.law/)
- LegiScan LLC. *LegiScan API User Manual & Data Services*. [https://legiscan.com/misc/LegiScan_API_User_Manual.pdf](https://legiscan.com/misc/LegiScan_API_User_Manual.pdf)
- MIT Election Data and Science Lab (MEDSL). *Election Data Collections on Harvard Dataverse*. [https://electionlab.mit.edu/data](https://electionlab.mit.edu/data)
- National Conference of State Legislatures (NCSL). *Access To and Use Of Voter Registration Lists*. [https://www.ncsl.org/](https://www.ncsl.org/)
- OpenSecrets.org (Center for Responsive Politics & National Institute on Money in State Politics). *OpenSecrets API & Open Data Portals*. [https://www.opensecrets.org/api/](https://www.opensecrets.org/api/)
- Plural Policy / Open States Project. *Open States API v3 Documentation*. [https://v3.openstates.org/docs/](https://v3.openstates.org/docs/)
- The Oyez Project. *Supreme Court Multimedia Database and API*. Chicago-Kent / Cornell / Justia. [https://api.oyez.org/](https://api.oyez.org/)
- U.S. Vote Foundation. *Civic Data Products & Election Official Directory (EOD)*. [https://www.usvotefoundation.org/](https://www.usvotefoundation.org/)
- Vote Smart (Project Vote Smart). *Vote Smart API Documentation*. [https://votesmart.org/share/api](https://votesmart.org/share/api)
- Vote.org. *Civic Engagement Tools and Free Embed Documentation*. [https://www.vote.org/technology/](https://www.vote.org/technology/)
- VoteAmerica Plus. *VoteAmerica Civic Data API v2 Documentation*. [https://api.voteamerica.org/docs/api/v2](https://api.voteamerica.org/docs/api/v2)

---

## 20. Appendices

### Appendix A: Verification Log
- **2026-10-17 03:39 UTC:** Verified Congress.gov API v3 documentation, endpoint routes, rate limits (5,000/hr), and OpenAPI OAS 3.0 schema availability via Library of Congress.
- **2026-10-17 03:39 UTC:** Verified GovInfo API endpoints, authentication via `api.data.gov`, and high-throughput allowances (36,000 req/hr).
- **2026-10-17 03:39 UTC:** Verified OpenFEC API v1, OpenAPI Swagger `/swagger` UI, rate limits (1,000/hr), and 2-year cycle bulk text/CSV download repositories.
- **2026-10-17 03:39 UTC:** Verified CourtListener REST API v4, RECAP asynchronous fetch endpoints, and complete integration of the 6.7M Harvard Caselaw Access Project records.
- **2026-10-17 03:39 UTC:** Verified Federal Register API v1 zero-auth access model and absence of rigid rate limiting.
- **2026-10-17 03:39 UTC:** Verified Regulations.gov API v4 endpoints (`/documents`, `/dockets`, `/comments`) and 1,000 req/hr limit via GSA.
- **2026-10-17 03:40 UTC:** Verified Open States API v3 FastAPI Swagger UI, OCD-ID schema models, and S3 bulk database exports.
- **2026-10-17 03:40 UTC:** Verified LegiScan RPC Pull API operations, free tier quota (30,000 queries/month), and webhook Push API specification.
- **2026-10-17 03:40 UTC:** Verified Ballotpedia API commercial data package structure, endpoint paths (`/elections_by_point`, `/officeholders`), and custom header auth (`x-api-key`).
- **2026-10-17 03:40 UTC:** Verified OpenSecrets API method routes, candidate financial summaries, and bulk data download files following the FollowTheMoney integration.
- **2026-10-17 03:40 UTC:** Verified MIT Election Data and Science Lab Harvard Dataverse REST API and verified historical dataset collections (1976–2024).
- **2026-10-17 03:40 UTC:** Verified Department of Justice 94 USAO directory and RSS 2.0 press release distribution channels.
- **2026-10-17 03:41 UTC:** Verified NCSL state voter list access classifications, fee schedules, and statutory commercial prohibitions.
- **2026-10-17 03:41 UTC:** Verified Colorado TRACER CSV data download portal and Arizona SeeTheMoney reporting engine.
- **2026-10-17 03:41 UTC:** Verified Google Civic Information API v2 endpoints (`/representatives`, `/voterinfo`) and 25,000 queries/day quota.
- **2026-10-17 03:41 UTC:** Verified Democracy Works Elections API v2 endpoints and Vote.org iframe embed widgets.
- **2026-10-17 03:41 UTC:** Verified VoteAmerica Plus Civic Data API v2 (`/election/field/`, `/election/data/state/{state}/`).
- **2026-10-17 03:42 UTC:** Confirmed permanent discontinuation of ProPublica Congress API and GovTrack API v2.
- **2026-10-17 03:42 UTC:** Confirmed migration of U.S. Senate LDA endpoints to unified `lda.gov` platform following July 31, 2026 legacy sunset.
- **2026-10-17 03:42 UTC:** Confirmed retirement of standalone Caselaw Access Project search/API and full operational hosting under CourtListener.

### Appendix B: Contradiction & Discontinuation Log
1. **Contradiction:** Several civic directories continue to cite the ProPublica Congress API (`api.propublica.org`) and GovTrack API (`govtrack.us/api/v2`) as active developer resources.
   - *Resolution:* Both APIs have been officially retired and permanently shut down. Primary federal legislative development must route directly through `api.congress.gov/v3/`.
2. **Contradiction:** Historical documentation directs lobbying data developers to `lda.senate.gov/api/v1/`.
   - *Resolution:* That endpoint was formally sunsetted on July 31, 2026. The official canonical endpoint is the unified platform hosted at `lda.gov/`.
3. **Contradiction:** Sources describe the Caselaw Access Project (CAP) as requiring an academic API key with a 500-case daily cap.
   - *Resolution:* Standalone CAP API operations ceased in 2024 upon completion of digitization. All access restrictions have been eliminated, and the full corpus is queryable without daily limits via the Free Law Project's CourtListener API.
4. **Contradiction:** FollowTheMoney.org is frequently listed as an active, independent state campaign finance API.
   - *Resolution:* Following the merger between the National Institute on Money in Politics and the Center for Responsive Politics, FollowTheMoney operates as an archived repository through 2024, with active development unified under OpenSecrets.org.

---

## 21. Search and Research Log

- **Query 1:** `"api.congress.gov" endpoints rate limit authentication openapi documentation` — Returned exact Library of Congress API v3 documentation, `api.data.gov` key requirements, and 5,000 req/hr rate limits.
- **Query 2:** `"api.govinfo.gov" endpoints rate limit authentication openapi documentation` — Returned GPO GovInfo Swagger UI at `/docs`, package summaries, and 36,000 req/hr limits.
- **Query 3:** `"api.open.fec.gov" endpoints rate limit authentication bulk data openapi` — Returned OpenFEC REST endpoints, OpenAPI `/swagger` documentation, and biennial bulk data file layout details.
- **Query 4:** `"courtlistener.com/api" endpoints rate limit authentication "recap" documentation` — Returned CourtListener REST API v4, RECAP fetch mechanisms, token authorization, and Free Law Project docs.
- **Query 5:** `"federalregister.gov/api/v1" endpoints rate limit authentication documentation` — Confirmed Federal Register zero-auth model, JSON endpoints, and pagination guidelines.
- **Query 6:** `"api.regulations.gov" endpoints rate limit authentication documentation` — Confirmed Regulations.gov API v4 endpoints, 1,000 req/hr limits, and comment posting rules.
- **Query 7:** `"v3.openstates.org" "open states" api endpoints rate limit authentication documentation` — Confirmed Open States API v3 Swagger documentation, OCD-ID schema models, and bulk S3 dump availability.
- **Query 8:** `"legiscan.com/legiscan" api endpoints rate limit authentication documentation` — Confirmed LegiScan Pull API RPC operations, 30,000 query/mo free tier, and User Manual specifications.
- **Query 9:** `"ballotpedia" api developer data license endpoints documentation` — Confirmed Ballotpedia commercial data packages, `/elections_by_point` routes, and S3 bulk exports.
- **Query 10:** `"opensecrets.org/api" endpoints rate limit authentication documentation` — Confirmed OpenSecrets REST method routes, candidate summaries, and bulk data options.
- **Query 11:** `"MIT Election Data and Science Lab" "Harvard Dataverse" datasets election results download` — Confirmed MEDSL election returns on Harvard Dataverse spanning 1976 through 2024.
- **Query 12:** `"Caselaw Access Project" bulk data "Free Law Project" "courtlistener" api` — Confirmed CAP standalone API retirement and full transfer to CourtListener.
- **Query 13:** `"justice.gov/usao" "us-attorneys-listing" "find-your-united-states-attorney"` — Confirmed official DOJ USAO directory and district RSS feeds.
- **Query 14:** `"NCSL" "voter list" "access to voter registration records" state by state policy` — Confirmed statutory voter list access rules, fee variations, and commercial prohibitions across all 50 states.
- **Query 15:** `"seethemoney.az.gov" OR "tracer.sos.colorado.gov" export bulk data API` — Confirmed Colorado TRACER yearly CSV archives and Arizona SeeTheMoney reporting engine.
- **Query 16:** `"Google Civic Information API" endpoints representatives elections voterInfoQuery` — Confirmed Google Civic Info API v2 endpoints and 25,000 query/day quota.
- **Query 17:** `"Democracy Works" "Elections API" OR "TurboVote" developer documentation endpoints` — Confirmed Democracy Works Elections API v2 base URL and OCD-ID integration.
- **Query 18:** `"vote.org" API developer embed widgets endpoints documentation` — Confirmed Vote.org iframe embed widgets and partner data webhooks.
- **Query 19:** `"VoteAmerica Plus" "Civic Data API" endpoints documentation` — Confirmed VoteAmerica Plus Civic Data API v2 endpoints and basic auth model.
- **Query 20:** `"api.votesmart.org" endpoints documentation rate limit key` — Confirmed Vote Smart API method routes and interest group scorecard modules.
- **Query 21:** `"ProPublica" Congress API "api.propublica.org" status Congress.gov` — Confirmed ProPublica Congress API permanent shutdown.
- **Query 22:** `"govtrack.us" API status "api/v2" documentation` — Confirmed GovTrack API v2 permanent retirement.
- **Query 23:** `"lda.senate.gov/api/v1" endpoints documentation authentication rate limit` — Confirmed Senate LDA API migration to `lda.gov` and legacy sunset.
- **Query 24:** `"FollowTheMoney.org" API "OpenSecrets" merger status documentation` — Confirmed FollowTheMoney merger into OpenSecrets.org.
- **Query 25:** `"api.oyez.org" endpoints documentation` — Confirmed public Oyez API JSON endpoints and SCOTUS oral argument audio/transcripts.

---

## 22. Structured JSON Export Appendix

To facilitate programmatic ingestion by downstream developer pipelines, the complete dictionary is provided below as a structured, machine-readable JSON array.

### Schema Definition
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "CivicDataResource",
  "type": "object",
  "properties": {
    "resource_name": { "type": "string" },
    "publisher": { "type": "string" },
    "topical_category": { 
      "type": "string",
      "enum": [
        "Voter Information",
        "Election Administration & Results",
        "Federal Legislation & Bill Tracking",
        "State Legislation & Bill Tracking",
        "Candidate Research & Campaign Finance",
        "Judicial Resources & Court Case Tracking",
        "U.S. Attorney & District Attorney Tracking"
      ]
    },
    "jurisdictional_tier": { 
      "type": "string",
      "enum": ["Federal", "State", "Local", "Aggregator", "Academic"]
    },
    "jurisdiction": { "type": "string" },
    "product_url": { "type": "string", "format": "uri" },
    "executive_summary": { "type": "string" },
    "availability": { "type": "string" },
    "developer_access": {
      "type": "object",
      "properties": {
        "has_api": { "type": "boolean" },
        "api_endpoint": { "type": "string" },
        "auth_method": { "type": "string" },
        "data_formats": { "type": "array", "items": { "type": "string" } },
        "rate_limit": { "type": "string" },
        "docs_url": { "type": "string" }
      },
      "required": ["has_api", "auth_method", "data_formats"]
    },
    "update_cadence": { "type": "string" },
    "source_authority": { "type": "string" },
    "verification_date": { "type": "string", "format": "date" }
  },
  "required": [
    "resource_name",
    "publisher",
    "topical_category",
    "jurisdictional_tier",
    "jurisdiction",
    "product_url",
    "executive_summary",
    "availability",
    "developer_access",
    "update_cadence",
    "source_authority",
    "verification_date"
  ]
}
```

### JSON Data Payload
```json
[
  {
    "resource_name": "Congress.gov Legislative Platform",
    "publisher": "Library of Congress (LOC)",
    "topical_category": "Federal Legislation & Bill Tracking",
    "jurisdictional_tier": "Federal",
    "jurisdiction": "United States (Federal Congress)",
    "product_url": "https://www.congress.gov/",
    "executive_summary": "Official legislative portal of the U.S. Congress, providing bills, amendments, status, roll-call votes, committee reports, and nominations from 1973 to present.",
    "availability": "Free",
    "developer_access": {
      "has_api": true,
      "api_endpoint": "https://api.congress.gov/v3/",
      "auth_method": "API Key (X-Api-Key) via api.data.gov",
      "data_formats": ["JSON", "XML"],
      "rate_limit": "5,000 requests per hour",
      "docs_url": "https://api.congress.gov/#/"
    },
    "update_cadence": "Real-time / Daily",
    "source_authority": "Primary Government",
    "verification_date": "2026-10-17"
  },
  {
    "resource_name": "GovInfo Authenticated Digital Repository",
    "publisher": "U.S. Government Publishing Office (GPO)",
    "topical_category": "Federal Legislation & Bill Tracking",
    "jurisdictional_tier": "Federal",
    "jurisdiction": "United States (Federal Government)",
    "product_url": "https://www.govinfo.gov/",
    "executive_summary": "Authenticated, cryptographically signed digital publications of the federal government, including Congressional Bills, Public Laws, CFR, and U.S. Code.",
    "availability": "Free",
    "developer_access": {
      "has_api": true,
      "api_endpoint": "https://api.govinfo.gov/",
      "auth_method": "API Key (?api_key=) via api.data.gov",
      "data_formats": ["JSON", "XML", "PDF", "USLM"],
      "rate_limit": "36,000 requests per hour",
      "docs_url": "https://api.govinfo.gov/docs"
    },
    "update_cadence": "Daily / Continuous",
    "source_authority": "Primary Government",
    "verification_date": "2026-10-17"
  },
  {
    "resource_name": "OpenFEC Campaign Finance Platform",
    "publisher": "Federal Election Commission (FEC)",
    "topical_category": "Candidate Research & Campaign Finance",
    "jurisdictional_tier": "Federal",
    "jurisdiction": "United States (Federal Elections)",
    "product_url": "https://www.fec.gov/",
    "executive_summary": "Canonical database of federal candidate financial disclosures, PACs, Super PACs, contributions, operating expenditures, and independent expenditures.",
    "availability": "Free",
    "developer_access": {
      "has_api": true,
      "api_endpoint": "https://api.open.fec.gov/v1/",
      "auth_method": "API Key (?api_key=) via api.data.gov",
      "data_formats": ["JSON", "CSV Bulk", "Pipe-delimited TXT"],
      "rate_limit": "1,000 requests per hour (Standard)",
      "docs_url": "https://api.open.fec.gov/developers/"
    },
    "update_cadence": "Real-time / Nightly",
    "source_authority": "Primary Government",
    "verification_date": "2026-10-17"
  },
  {
    "resource_name": "Federal Register API",
    "publisher": "National Archives & Records Administration (NARA) / OFR",
    "topical_category": "Federal Legislation & Bill Tracking",
    "jurisdictional_tier": "Federal",
    "jurisdiction": "United States (Executive Branch)",
    "product_url": "https://www.federalregister.gov/",
    "executive_summary": "Daily official gazette of the U.S. federal government containing proposed agency rules, final rules, presidential documents, and public inspection notices.",
    "availability": "Free",
    "developer_access": {
      "has_api": true,
      "api_endpoint": "https://www.federalregister.gov/api/v1/",
      "auth_method": "None (Unauthenticated)",
      "data_formats": ["JSON", "CSV"],
      "rate_limit": "Fair-use (No rigid numerical limit)",
      "docs_url": "https://www.federalregister.gov/api/v1/documentation.json"
    },
    "update_cadence": "Daily (business days)",
    "source_authority": "Primary Government",
    "verification_date": "2026-10-17"
  },
  {
    "resource_name": "Lobbying Disclosure Act (LDA) Platform",
    "publisher": "U.S. Senate Office of Public Records & House Clerk",
    "topical_category": "Federal Legislation & Bill Tracking",
    "jurisdictional_tier": "Federal",
    "jurisdiction": "United States (Federal Lobbying)",
    "product_url": "https://lda.gov/",
    "executive_summary": "Official registry of federal lobbyists, lobbying firms, and registrant organizations under the LDA; tracks LD-1, LD-2, and LD-203 filings.",
    "availability": "Free",
    "developer_access": {
      "has_api": true,
      "api_endpoint": "https://lda.gov/",
      "auth_method": "Optional API Key (Registered); Anonymous tier",
      "data_formats": ["JSON"],
      "rate_limit": "120 req/min (Key); 15 req/min (Anonymous)",
      "docs_url": "https://lda.gov/"
    },
    "update_cadence": "Continuous",
    "source_authority": "Primary Government",
    "verification_date": "2026-10-17"
  },
  {
    "resource_name": "CourtListener REST API v4 & RECAP",
    "publisher": "Free Law Project",
    "topical_category": "Judicial Resources & Court Case Tracking",
    "jurisdictional_tier": "Aggregator",
    "jurisdiction": "Federal & State Appellate Courts",
    "product_url": "https://www.courtlistener.com/",
    "executive_summary": "Open legal search platform hosting over 500 million pages of legal documents, 8 million judicial opinions, federal dockets, RECAP filings, and oral arguments.",
    "availability": "Free / Membership Tiers",
    "developer_access": {
      "has_api": true,
      "api_endpoint": "https://www.courtlistener.com/api/rest/v4/",
      "auth_method": "Token (Authorization: Token <token>)",
      "data_formats": ["JSON", "Gzipped CSV Bulk"],
      "rate_limit": "5 req/min, 50/hr, 125/day (Free tier)",
      "docs_url": "https://www.courtlistener.com/help/api/rest/"
    },
    "update_cadence": "Daily / Real-time",
    "source_authority": "Nonprofit Aggregator",
    "verification_date": "2026-10-17"
  },
  {
    "resource_name": "Open States API v3",
    "publisher": "Plural Policy / Open States Project",
    "topical_category": "State Legislation & Bill Tracking",
    "jurisdictional_tier": "Aggregator",
    "jurisdiction": "50 U.S. States, DC, Puerto Rico",
    "product_url": "https://openstates.org/",
    "executive_summary": "Open-source state legislative aggregator tracking bills, actions, sponsors, roll-call votes, committee assignments, and legislators across all 50 states.",
    "availability": "Free (with registration)",
    "developer_access": {
      "has_api": true,
      "api_endpoint": "https://v3.openstates.org/",
      "auth_method": "API Key (X-API-KEY or ?apikey=)",
      "data_formats": ["JSON", "PostgreSQL Dumps", "CSV Bulk"],
      "rate_limit": "Fair-use registered limits",
      "docs_url": "https://v3.openstates.org/docs/"
    },
    "update_cadence": "Daily",
    "source_authority": "Nonprofit Aggregator",
    "verification_date": "2026-10-17"
  },
  {
    "resource_name": "LegiScan Legislative Intelligence",
    "publisher": "LegiScan LLC",
    "topical_category": "State Legislation & Bill Tracking",
    "jurisdictional_tier": "Aggregator",
    "jurisdiction": "U.S. Congress & 50 States",
    "product_url": "https://legiscan.com/",
    "executive_summary": "Structured multi-jurisdiction legislative tracking API providing normalized data on bills, full text, amendments, sponsors, and roll-call votes.",
    "availability": "Hybrid (Free 30k calls/mo; Paid Enterprise)",
    "developer_access": {
      "has_api": true,
      "api_endpoint": "https://api.legiscan.com/",
      "auth_method": "API Key (?key=)",
      "data_formats": ["JSON"],
      "rate_limit": "30,000 queries per month (Free tier)",
      "docs_url": "https://legiscan.com/misc/LegiScan_API_User_Manual.pdf"
    },
    "update_cadence": "Real-time / Daily",
    "source_authority": "Commercial Aggregator",
    "verification_date": "2026-10-17"
  },
  {
    "resource_name": "Google Civic Information API",
    "publisher": "Google LLC",
    "topical_category": "Voter Information",
    "jurisdictional_tier": "Aggregator",
    "jurisdiction": "United States (National)",
    "product_url": "https://developers.google.com/civic-information",
    "executive_summary": "RESTful API mapping residential street addresses to elected representatives and active election voter info (polling places, early voting, contests).",
    "availability": "Free (Quota based)",
    "developer_access": {
      "has_api": true,
      "api_endpoint": "https://www.googleapis.com/civicinfo/v2/",
      "auth_method": "Google Cloud API Key (?key=)",
      "data_formats": ["JSON"],
      "rate_limit": "25,000 queries per day",
      "docs_url": "https://developers.google.com/civic-information"
    },
    "update_cadence": "Daily / Per-election",
    "source_authority": "Commercial Aggregator",
    "verification_date": "2026-10-17"
  },
  {
    "resource_name": "OpenSecrets Platform",
    "publisher": "OpenSecrets.org",
    "topical_category": "Candidate Research & Campaign Finance",
    "jurisdictional_tier": "Aggregator",
    "jurisdiction": "U.S. Federal & 50 States",
    "product_url": "https://www.opensecrets.org/",
    "executive_summary": "Unified platform tracking money in American politics, integrating federal FEC filings, state campaign contributions, lobbying records, and 501(c)(4) dark money.",
    "availability": "Free (Research) / Commercial Licensing",
    "developer_access": {
      "has_api": true,
      "api_endpoint": "https://www.opensecrets.org/api/",
      "auth_method": "API Key (?apikey=)",
      "data_formats": ["JSON", "XML", "CSV Bulk"],
      "rate_limit": "Soft throttling for research use",
      "docs_url": "https://www.opensecrets.org/api/"
    },
    "update_cadence": "Daily / Post-filing",
    "source_authority": "Nonprofit Aggregator",
    "verification_date": "2026-10-17"
  },
  {
    "resource_name": "MIT Election Data and Science Lab (MEDSL)",
    "publisher": "MIT / Harvard Dataverse",
    "topical_category": "Election Administration & Results",
    "jurisdictional_tier": "Academic",
    "jurisdiction": "United States (National, County, Precinct)",
    "product_url": "https://electionlab.mit.edu/",
    "executive_summary": "Academic research clearinghouse hosting verified historical election returns (Presidential, Senate, House 1976–present; County returns 2000–2024; Precinct returns).",
    "availability": "Free (Public Domain / CC-BY)",
    "developer_access": {
      "has_api": true,
      "api_endpoint": "https://dataverse.harvard.edu/api/",
      "auth_method": "None (Public datasets)",
      "data_formats": ["CSV", "TAB", "RData", "JSON"],
      "rate_limit": "Harvard Dataverse standard limits",
      "docs_url": "https://electionlab.mit.edu/data"
    },
    "update_cadence": "Post-election / Annual",
    "source_authority": "Academic",
    "verification_date": "2026-10-17"
  },
  {
    "resource_name": "Ballotpedia API",
    "publisher": "Ballotpedia / Lucy Burns Institute",
    "topical_category": "Election Administration & Results",
    "jurisdictional_tier": "Aggregator",
    "jurisdiction": "Federal, State, and Local (Metros)",
    "product_url": "https://ballotpedia.org/",
    "executive_summary": "Digital encyclopedia of American politics covering federal, state, and local candidates, elections, and ballot measures with point-based geographic querying.",
    "availability": "Commercial / Paid Data Package",
    "developer_access": {
      "has_api": true,
      "api_endpoint": "https://api.ballotpedia.org/",
      "auth_method": "Custom Header (x-api-key)",
      "data_formats": ["JSON", "CSV Bulk"],
      "rate_limit": "Defined by commercial contract",
      "docs_url": "https://ballotpedia.org/Ballotpedia:API"
    },
    "update_cadence": "Continuous",
    "source_authority": "Commercial / Nonprofit",
    "verification_date": "2026-10-17"
  }
]
```
