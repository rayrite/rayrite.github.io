# Deliverable C: Federal and Nationwide Resource Catalog
## Official Primary Systems of Record, Academic Repositories, and Specialist Providers

**Document Identifier:** `CIVIC-DOC-02-FED-NATIONWIDE`  
**Research Execution Date:** October 17, 2026  
**Cycle Scope:** 2026 Midterm Cycle and Nationwide System Architecture  

---

## 1. Catalog Architecture and Verification Standard

This catalog establishes a definitive reference for federal and nationwide civic information resources. In compliance with the core operating principles of this project, each entry is disaggregated across four distinct access surfaces:
1. **Public Informational Website:** End-user web interface for browsing and manual search.
2. **Researcher / Subscriber Portal:** Interactive tools, advanced search, or authenticated research accounts.
3. **Developer Programmatic Interface:** Documented APIs, bulk downloadable archives, RSS/Atom feeds, or structured webhooks.
4. **Commercial & Redistribution Rights:** Legal permissions governing data caching, permanent storage, downstream redistribution, display embedding, and commercial application monetizing.

---

## 2. Part 1: Official Federal Agencies & Primary Systems of Record

The table below summarizes the core federal primary systems of record, followed by granular technical specifications for each entity:

| Resource ID | Resource Name | Operating Agency | Primary Category | Access Model | Developer Endpoint |
|---|---|---|---|---|---|
| `FED-VOTE-GOV` | Vote.gov Civic Information Portal | General Services Administration (GSA) | Voting & Registration | Free / Public Domain | REST API (`api.data.gov`) / GitHub |
| `FED-EAC-PORTAL` | Election Administration & Survey Hub | U.S. Election Assistance Commission | Voting Systems & EAVS | Free / Public Domain | Bulk CSV/SPSS (`eac.gov/research-and-data`) |
| `FED-FVAP-UOCAVA` | Military & Overseas Voter Support Hub | Federal Voting Assistance Program (DOD) | Military/Overseas Voting | Free / Public Domain | XML API (`fvap.gov/xml-api/`) |
| `FED-FEC-OPENFEC` | OpenFEC Campaign Finance Platform | Federal Election Commission | Campaign Finance | Free / Public Domain | REST API (`api.open.fec.gov`) |
| `FED-LEG-CONGRESS` | Congress.gov Legislative Database | Library of Congress | Federal Legislation | Free / Public Domain | REST API (`api.congress.gov`) |
| `FED-GPO-GOVINFO` | GovInfo Federal Publishing Repository | Government Publishing Office (GPO) | Statutes & Regulations | Free / Public Domain | REST API (`api.govinfo.gov`) |
| `FED-NARA-FEDREG` | Federal Register & Public Inspection | National Archives (OFR / NARA) | Administrative Rules | Free / Public Domain | REST API (`federalregister.gov/api/v1`) |
| `FED-REG-PORTAL` | Regulations.gov eRulemaking Portal | eRulemaking Program Management (GSA) | Proposed Rules & Comments | Free / Public Domain | REST API (`api.regulations.gov/v4`) |
| `FED-CRT-PACER` | Public Access to Court Electronic Records | Administrative Office of U.S. Courts | Federal Court Dockets | Metered ($0.10/page) | Web / PACER Case Locator Search |
| `FED-DOJ-USAO` | United States Attorneys Directory | U.S. Department of Justice | Federal Prosecutors | Free / Public Domain | Web Directory / Press RSS Feeds |
| `FED-GEO-CENSUS` | Census Geocoder & TIGER Spatial Data | U.S. Census Bureau | Spatial GIS & Boundaries | Free / Public Domain | REST API (`geocoding.geo.census.gov`) |
| `FED-LOC-CHRONIC` | Chronicling America Historic Newspapers | Library of Congress | Historical Newspapers | Free / Public Domain | LoC.gov API (`loc.gov/?fo=json`) |

---

### Granular Technical Profiles: Official Federal Systems

#### 1. `FED-VOTE-GOV`: Vote.gov (General Services Administration)
* **Canonical URL:** `https://vote.gov/`
* **Executive Summary:** The official federal voter guidance portal providing authoritative state-by-state voter registration rules, deadlines, acceptable identification, and multilingual voting guides in over 15 languages.
* **Developer Interface:** Open-source repository hosted on GitHub (`github.com/usagov/vote-gov`). Programmatic lookup data is distributed via static JSON feeds on `api.data.gov`.
* **Authentication:** No authentication required for public web; standard `api.data.gov` API key for structured data endpoints.
* **Rate Limits:** 1,000 requests per hour via standard `api.data.gov` key.
* **Licensing & Reuse:** U.S. Government Work; Public Domain (17 U.S.C. § 105). Unrestricted redistribution and commercial use.
* **Recommended Integration:** Consume state-level voter registration rules and deadline metadata from the official Vote.gov GitHub repository schema as a static synchronization pipeline.

#### 2. `FED-EAC-PORTAL`: U.S. Election Assistance Commission (EAC)
* **Canonical URL:** `https://www.eac.gov/`
* **Data Portal:** `https://www.eac.gov/research-and-data/election-administration-and-voting-survey-eavs-data`
* **Executive Summary:** The premier federal clearinghouse for voting system testing and certification, post-election audits, recount guidance, and the biennial Election Administration and Voting Survey (EAVS).
* **Developer Interface:** Bulk dataset downloads available in CSV, Excel, SPSS, and Stata formats. Complete survey instruments and codebooks provided for each federal election cycle (2004–2024).
* **Authentication:** None required. Public direct downloads.
* **Rate Limits:** No formal rate limits; standard web traffic throttling.
* **Licensing & Reuse:** Public domain. Unrestricted academic, civic, and commercial application use.
* **Recommended Integration:** Ingest historical EAVS CSV datasets for baseline election administration metrics, turnout by voting mode (in-person vs. mail vs. provisional), and voting equipment certification tracking.

#### 3. `FED-FVAP-UOCAVA`: Federal Voting Assistance Program (FVAP)
* **Canonical URL:** `https://www.fvap.gov/`
* **Developer Portal:** `https://www.fvap.gov/xml-api/`
* **Executive Summary:** Administers federal voting assistance for active-duty military personnel, their eligible family members, and overseas U.S. citizens covered under UOCAVA.
* **Developer Interface:** Standalone XML data feeds providing contact details and physical mailing addresses for all Local Election Officials (LEOs) across all 50 states and territories (`https://www.fvap.gov/xml-api/{state}/election-offices.xml`).
* **Authentication:** None required for public XML endpoints.
* **Rate Limits:** Unthrottled under normal developer polling cadences.
* **Licensing & Reuse:** Public domain.
* **Recommended Integration:** Automated weekly synchronization of the `election-offices.xml` endpoints to maintain an authoritative directory of local election clerk mailing addresses and ballot transmission methods.

#### 4. `FED-FEC-OPENFEC`: OpenFEC Campaign Finance Platform (Federal Election Commission)
* **Canonical URL:** `https://www.fec.gov/`
* **Developer Portal:** `https://api.open.fec.gov/developers/`
* **Interactive Documentation:** `https://api.open.fec.gov/swagger/`
* **Executive Summary:** Comprehensive authoritative database of all federal campaign finance activity, including presidential, Senate, and House candidate receipts, committee disbursements, PAC independent expenditures, and lobbyist bundle filings.
* **Developer Interface:** High-performance REST JSON API (`https://api.open.fec.gov/v1/`). Endpoints cover `/candidates/`, `/committees/`, `/schedules/schedule_a/` (receipts), `/schedules/schedule_b/` (disbursements), and `/elections/`.
* **Authentication:** Standard 40-character `api.data.gov` API key passed via query parameter (`?api_key=...`) or `X-Api-Key` header.
* **Rate Limits:** Standard self-signed key: 1,000 calls per hour. High-volume research tier: 7,200 calls per hour (120 calls per minute) available upon application to `APIinfo@fec.gov`.
* **Licensing & Reuse Restriction:** Public domain, **SUBJECT TO STATUTORY RESTRICTION**: Under **52 U.S.C. § 30111(a)(4)**, contributor names and addresses copied from FEC reports may NOT be sold, rented, or used for commercial solicitation or political fundraising.
* **Recommended Integration:** Ingest candidate summary financials, PAC independent expenditures, and committee registrations programmatically via REST API; process individual donor micro-records via FEC nightly bulk CSV files.

#### 5. `FED-LEG-CONGRESS`: Congress.gov API (Library of Congress)
* **Canonical URL:** `https://www.congress.gov/`
* **Developer Portal:** `https://api.congress.gov/`
* **GitHub Repository:** `https://github.com/LibraryOfCongress/api.congress.gov`
* **Executive Summary:** The definitive, authoritative legislative information service for the United States Congress, providing real-time bill text, cosponsors, committee reports, amendments, nominations, and floor votes.
* **Developer Interface:** RESTful JSON/XML API (`https://api.congress.gov/v3/`). Endpoints include `/bill/`, `/amendment/`, `/member/`, `/committee/`, `/committee-report/`, `/hearing/`, `/nomination/`, `/treaty/`, and `/congressional-record/`.
* **Authentication:** `api.data.gov` API key passed via `X-Api-Key` header or `?api_key=` parameter.
* **Rate Limits:** 5,000 requests per hour per API key. Rate limit tracking headers: `X-RateLimit-Limit` and `X-RateLimit-Remaining`.
* **Licensing & Reuse:** Public domain. No copyright restrictions.
* **Recommended Integration:** Primary ingestion pipeline for all federal legislative monitoring, bill status changes, roll-call voting records, and congressional member directory data.

#### 6. `FED-GPO-GOVINFO`: GovInfo API (U.S. Government Publishing Office)
* **Canonical URL:** `https://www.govinfo.gov/`
* **Developer Portal:** `https://api.govinfo.gov/docs`
* **Executive Summary:** GPO's automated digital repository providing verified, digitally signed electronic publications of federal government documents, including the United States Code, Statutes at Large, Code of Federal Regulations, and Congressional Hearings.
* **Developer Interface:** High-capacity REST API (`https://api.govinfo.gov/`). Endpoints cover `/collections/`, `/packages/{packageId}/summary`, `/published/{date}`, and complex `/search` queries.
* **Authentication:** `api.data.gov` key.
* **Rate Limits:** 36,000 requests per hour (1,200 req/min, 40 req/sec).
* **Licensing & Reuse:** Public domain.
* **Recommended Integration:** Primary pipeline for retrieving raw XML/PDF statutory text, historical session laws, and official committee report documents.

#### 7. `FED-NARA-FEDREG`: Federal Register API (National Archives / OFR)
* **Canonical URL:** `https://www.federalregister.gov/`
* **Developer Portal:** `https://www.federalregister.gov/reader-aids/developer-resources/rest-api`
* **Executive Summary:** Daily journal of federal government administrative actions, executive orders, presidential proclamations, proposed agency rules, and public meeting notices.
* **Developer Interface:** RESTful JSON API (`https://www.federalregister.gov/api/v1/documents.json`).
* **Authentication:** Completely open. No API key required.
* **Rate Limits:** No formal rate cap; standard concurrency throttles apply. Search pagination capped at 2,000 results per query.
* **Licensing & Reuse:** Public domain.
* **Recommended Integration:** Automated polling (cadence: daily at 09:00 ET) for executive orders, administrative regulatory notices, and agency leadership appointments.

#### 8. `FED-CRT-PACER`: PACER (Administrative Office of the U.S. Courts)
* **Canonical URL:** `https://pacer.uscourts.gov/`
* **Search Portal:** PACER Case Locator (`pcl.uscourts.gov`)
* **Executive Summary:** The electronic public access service for federal appellate, district, and bankruptcy court records.
* **Developer Interface:** PACER Case Locator web search; XML/HTML interfaces. No unified modern public REST API; direct integration requires custom web automation or partnership with authorized court service providers.
* **Authentication:** PACER billing login credentials required.
* **Pricing & Constraints:** $0.10 per page viewed or printed; capped at $3.00 per document. Quarterly charges under $30.00 are waived. Automated scraping is subject to strict court access terms and potential account suspension.
* **Licensing & Reuse:** Federal judicial documents are public domain, but PACER access systems impose strict technical usage constraints.
* **Recommended Integration:** Rely on secondary non-profit syndication (CourtListener / RECAP) for bulk judicial data; query PACER directly only for high-value targeted filings when RECAP coverage is missing.

#### 9. `FED-GEO-CENSUS`: Census Geocoder & TIGERweb (U.S. Census Bureau)
* **Canonical URL:** `https://geocoding.geo.census.gov/`
* **API Endpoint:** `https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress`
* **TIGERweb Spatial Portal:** `https://tigerweb.geo.census.gov/`
* **Executive Summary:** Provides geocoding, address-to-coordinate translation, and spatial resolution to Census blocks, tracts, congressional districts, and county boundaries using authoritative TIGER spatial databases.
* **Developer Interface:** RESTful JSON API supporting single-address lookups and batch POST requests up to 10,000 records per upload. TIGERweb provides OGC-compliant WMS and REST map services.
* **Authentication:** None required. Completely open public utility.
* **Rate Limits:** Unthrottled under normal usage; batch file limit 10,000 rows (under 5MB).
* **Licensing & Reuse:** Public domain.
* **Recommended Integration:** Core address resolution engine for translating user street addresses into Federal Information Processing Standards (FIPS) codes, Census tracts, and Congressional District boundaries.

#### 10. `FED-LOC-CHRONIC`: Chronicling America Historic Newspapers (Library of Congress)
* **Canonical URL:** `https://chroniclingamerica.loc.gov/` (redirects into `loc.gov/collections/chronicling-america/`)
* **API Documentation:** `https://www.loc.gov/apis/json-and-yaml/`
* **Executive Summary:** Historic American newspapers published from 1770 to 1963, digitized by the National Digital Newspaper Program (NDNP) partnership between the NEH and Library of Congress.
* **Developer Interface:** Integrated into the core LoC.gov JSON/YAML API architecture. Appending `?fo=json` to search and collection URLs returns structured JSON metadata and OCR text links.
* **Authentication:** None required for public endpoints.
* **Rate Limits:** Standard LoC.gov throttling (approx. 20 req/sec).
* **Licensing & Reuse:** Public domain / Open access for digitized pre-1928 materials.
* **Recommended Integration:** Historical research baseline for long-term electoral trends, archived legal notices, and historical civic analysis.

---

## 3. Part 2: Specialist, Academic, Nonprofit, and Commercial Providers

The table below summarizes leading non-governmental, academic, and specialist civic data providers:

| Resource ID | Resource Name | Operating Organization | Core Specialty | Access Model | Developer Interface |
|---|---|---|---|---|---|
| `NAT-ELE-VIP` | Voting Information Project | Democracy Works | Standardized Polling Feeds | Open Source Spec | XML Schema v5.2 / v6.0 |
| `NAT-ELE-GOOGLE` | Google Civic Information API | Google Cloud Platform | Voter Info & Reps by Address | Freemium (25k/day) | REST JSON API (`civicinfo/v2`) |
| `NAT-ACA-MEDSL` | MIT Election Data & Science Lab | MIT / Harvard Dataverse | Precinct & County Returns | Free / Open Science | Harvard Dataverse API / CSV |
| `NAT-ELE-BALLOT` | Ballotpedia Data Client API | Ballotpedia (Lucy Burns Inst.) | Ballots, Candidates, Measures | Commercial Subscription | REST JSON API (`api4.ballotpedia.org`) |
| `NAT-VOT-VOTE411` | Vote411 Digital Voter Guide | League of Women Voters | Nonpartisan Candidate Surveys | Free Web Search | Web Portal / Custom Feeds |
| `NAT-VOT-VOTESMART` | Vote Smart National Database | Project Vote Smart | Candidate Bios & Voting Records | Free / API Key | REST API (`api.votesmart.org`) |
| `NAT-LEG-OPENSTATES` | Open States / Plural Open Data | Plural Policy | 50-State Legislative Tracking | Freemium / Open Data | REST API v3 (`v3.openstates.org`) |
| `NAT-LEG-LEGISCAN` | LegiScan Multi-State API | LegiScan LLC | 50-State Bills, Votes, Text | Free (30k/mo) to Push API | RPC JSON API (`legiscan.com/api`) |
| `NAT-CRT-COURTLIST` | CourtListener & RECAP Archive | Free Law Project | Dockets, Opinions, Audio | Freemium ($10+/mo pro) | REST API v4 / PostgreSQL Replication |
| `NAT-CRT-OYEZ` | Oyez Supreme Court Multimedia | LII (Cornell) / Justia / Chicago-Kent | SCOTUS Audio & Transcripts | Free / Open Access | Web / JSON API endpoints |
| `NAT-CAM-OPENSEC` | OpenSecrets Bulk Data Program | Center for Responsive Politics | Money in Politics & Lobbying | Free Non-Commercial / CC | Bulk CSV Archives (API Discontinued) |
| `NAT-CRT-NCSC` | Court Statistics Project (CSP) | National Center for State Courts | State Court Caseload Metrics | Free Public Research | CSP STAT Dashboards / CSV Reports |
| `NAT-POL-NCSL` | NCSL State Policy Research Hub | National Conf. of State Legislatures | State Statutes & Election Laws | Free Public Research | Web Research Databases / Reports |
| `NAT-JRN-INN` | Institute for Nonprofit News | INN Network | Nonprofit Civic Newsrooms | Free Directory | Member Directory / RSS Feeds |

---

### Granular Technical Profiles: Specialist & Commercial Providers

#### 1. `NAT-ELE-VIP`: Voting Information Project (VIP Specification)
* **Provider:** Democracy Works
* **Specification URL:** `https://votinginfoproject.org/`
* **GitHub Repository:** `https://github.com/votinginfoproject/vip-specification`
* **Executive Summary:** Established the gold standard open schema for election administration data feeds, standardizing polling places, ballot drop-boxes, early voting sites, and contest metadata across state election systems.
* **Developer Interface:** XML schemas (`vip_spec.xsd`) spanning versions 5.0, 5.1, 5.2, and 6.0. Supports multi-language ballot text, GIS polygon drop-off boundaries, and ESRI shapefile integration.
* **Licensing & Reuse:** Creative Commons / Open source specification.
* **Recommended Integration:** Target data format for parsing state-level election feeds and publishing normalized precinct data.

#### 2. `NAT-ELE-GOOGLE`: Google Civic Information API
* **Provider:** Google Cloud Platform
* **Documentation URL:** `https://developers.google.com/civic-information`
* **Executive Summary:** Highly scalable RESTful API connecting user residential addresses with current elected officials and active election ballots.
* **Key Endpoints:**
  * `GET https://www.googleapis.com/civicinfo/v2/representatives`: Returns current elected officials (federal, state, county, municipal) mapped to Open Civic Data Identifiers (OCD-IDs).
  * `GET https://www.googleapis.com/civicinfo/v2/voterinfo`: Address-specific ballot contests, candidates, and polling locations during active elections.
* **Authentication:** Google Cloud API key (`?key=...`).
* **Rate Limits:** 25,000 queries per day on the standard free tier; quota increases available via Google Cloud Console.
* **Licensing & Constraints:** Free for commercial and non-commercial application integration under Google Cloud Terms of Service. Note: `voterinfo` data is dependent on VIP feed availability and is inactive outside scheduled election windows.

#### 3. `NAT-LEG-OPENSTATES`: Open States / Plural Open Data
* **Provider:** Plural Policy
* **API Documentation:** `https://docs.openstates.org/api-v3/`
* **Interactive Docs:** `https://v3.openstates.org/docs/`
* **Executive Summary:** Open civic technology project providing standardized, multi-state legislative data across all 50 states, DC, and Puerto Rico.
* **Key Endpoints:** `GET /jurisdictions`, `GET /people`, `GET /people.geo` (legislator lookup by lat/long coordinate), `GET /bills`, `GET /committees`, and `GET /events`.
* **Authentication:** API key passed via `X-API-KEY` header or `?apikey=` parameter.
* **Pricing & License:** Free community tier for civic tech and non-profits; commercial intelligence subscriptions offered under Plural Pro.
* **Recommended Integration:** Core platform for address-to-state-legislator coordinate mapping (`/people.geo`) and multi-state bill tracking.

#### 4. `NAT-LEG-LEGISCAN`: LegiScan Multi-State Legislative API
* **Provider:** LegiScan LLC
* **Developer Portal:** `https://legiscan.com/legiscan-api`
* **Executive Summary:** Commercial legislative tracking service providing normalized JSON data covering Congress and all 50 state legislatures.
* **Developer Interface:** RPC-style JSON API. Key operations: `getMasterList`, `getBill`, `getBillText` (base64-encoded PDF/HTML text payloads), `getVote` (roll call tallies), and `getSponsor`.
* **Service Tiers & Rate Limits:**
  * Free Public API: 10,000 to 30,000 queries per month.
  * Flex API: 30,000 to 70,000 queries per month.
  * Pull API: 100,000+ queries per month.
  * Push API: Enterprise automated streaming webhook service delivering updates every 15 minutes to 4 hours.
* **Licensing & Attribution:** Standard license requires LegiScan attribution; Whitebox license available for commercial redistribution without attribution.

#### 5. `NAT-CRT-COURTLIST`: CourtListener & RECAP Archive
* **Provider:** Free Law Project (501(c)(3) Nonprofit)
* **API Portal:** `https://www.courtlistener.com/api/rest/v4/`
* **Documentation:** `https://free.law/`
* **Executive Summary:** The largest open legal database in the United States, providing access to over 500 million pages of legal opinions, PACER federal dockets via RECAP, judicial biographies, financial disclosures, and oral argument audio recordings.
* **Developer Interface:** REST API v4 (`https://www.courtlistener.com/api/rest/v4/`). Key endpoints: `/opinions/`, `/dockets/`, `/people/` (judges), `/audio/` (oral arguments), and `/financial-disclosures/`.
* **Alternative Ingestion:** Direct PostgreSQL database replication; daily bulk CSV downloads; webhooks; Model Context Protocol (MCP) server for AI integration.
* **Authentication:** Token-based header authentication (`Authorization: Token <key>`).
* **Rate Limits:** Free standard tier: 5 req/min, 50 req/hr, 125 req/day. Paid membership tiers starting at $10/month provide higher commercial volume.
* **Licensing & Reuse:** Case law and federal dockets are public domain; platform API is licensed under permissive open terms.

#### 6. `NAT-ELE-BALLOT`: Ballotpedia Data Client API
* **Provider:** Ballotpedia (Lucy Burns Institute)
* **Developer Portal:** `https://developer.ballotpedia.org/`
* **Executive Summary:** The definitive nonpartisan digital encyclopedia of American politics, maintaining comprehensive databases of federal, state, and local candidates, ballot measures, judicial retention, and school board races.
* **Developer Interface:** REST API v4 (`https://api4.ballotpedia.org/`). Key endpoints: `/districts`, `/officeholders`, `/elections_by_point`, `/elections_by_state`, and `/data/election_dates/ballot_measures`.
* **Rate Limits:** Geographic endpoints: 5 RPS, 100 burst, 200,000 calls per 24 hours. Bulk endpoints: 5 RPS, 10 burst, 50 calls per 24 hours.
* **Pricing & Licensing:** Commercial subscription required via Ballotpedia Sales (`data@ballotpedia.org`). Data is copyrighted and proprietary; redistribution of raw datasets is prohibited. Client applications must enforce anti-scraping protections and implement domain whitelisting.

#### 7. `NAT-CAM-OPENSEC`: OpenSecrets Bulk Data Program
* **Provider:** Center for Responsive Politics
* **Data Portal:** `https://www.opensecrets.org/bulk-data`
* **CRITICAL DISCOVERY:** Legacy REST API is **DISCONTINUED**.
* **Developer Interface:** Direct download of compressed CSV archives covering federal campaign contributions, PAC expenditures, federal lobbying registrations, 527 committees, and personal financial disclosures of Members of Congress.
* **Authentication:** User registration and download token via bulk data portal.
* **Licensing & Reuse:** Creative Commons Attribution-NonCommercial-ShareAlike (CC BY-NC-SA 4.0). Commercial use requires express written agreement and commercial licensing fees.

---

## 4. Comprehensive Evaluation Matrix: Federal & Nationwide Resources

The following matrix provides a direct comparative evaluation across all 26 cataloged federal and nationwide platforms:

| Resource ID | Authority Level | Structured Quality | API Availability | Free Tier Allowance | License Clarity | Operational Maintenance |
|---|---|---|---|---|---|---|
| `FED-VOTE-GOV` | Official Federal | High (JSON) | Yes (Static/GH) | 1,000 req/hr | Public Domain | Low |
| `FED-EAC-PORTAL` | Official Federal | High (CSV) | Bulk Only | Unlimited | Public Domain | Low |
| `FED-FVAP-UOCAVA` | Official Federal | Medium (XML) | Yes (XML Feeds) | Unlimited | Public Domain | Low |
| `FED-FEC-OPENFEC` | Official Federal | Excellent (JSON) | Yes (REST) | 1,000-7,200 req/hr | Public Domain (Sol. Ban) | Medium |
| `FED-LEG-CONGRESS`| Official Federal | Excellent (JSON) | Yes (REST) | 5,000 req/hr | Public Domain | Low |
| `FED-GPO-GOVINFO` | Official Federal | Excellent (JSON/XML) | Yes (REST) | 36,000 req/hr | Public Domain | Low |
| `FED-NARA-FEDREG` | Official Federal | High (JSON) | Yes (REST) | Open / Uncapped | Public Domain | Low |
| `FED-REG-PORTAL` | Official Federal | High (JSON) | Yes (REST) | Standard api.data.gov | Public Domain | Medium |
| `FED-CRT-PACER` | Official Federal | High (PDF/HTML) | No Public REST | Metered ($0.10/page) | Public Domain (Access Fee)| High |
| `FED-DOJ-USAO` | Official Federal | Low (HTML/RSS) | RSS / Feeds | Open | Public Domain | Medium |
| `FED-GEO-CENSUS` | Official Federal | High (JSON) | Yes (REST/Batch) | 10k rows/batch | Public Domain | Low |
| `FED-LOC-CHRONIC` | Official Federal | High (JSON/Text) | Yes (LoC JSON) | Standard LoC limit | Public Domain (pre-1928) | Medium |
| `NAT-ELE-VIP` | Specialist / Standard| High (XML) | Open Spec | Unlimited | Open Spec (CC) | Low |
| `NAT-ELE-GOOGLE` | Commercial Platform | Excellent (JSON) | Yes (REST) | 25,000 queries/day | Commercial Permissive | Medium |
| `NAT-ACA-MEDSL` | Academic Gold Standard| High (CSV) | Dataverse API | Unlimited | CC0 / Open Science | Low |
| `NAT-ELE-BALLOT` | Commercial Vendor | Excellent (JSON) | Yes (REST) | Paid Subscription | Proprietary Restricted | Low |
| `NAT-VOT-VOTE411` | Nonpartisan Civic | Medium (HTML) | Web / Syndication| Free Web Search | Proprietary Non-Profit | Medium |
| `NAT-VOT-VOTESMART`| Nonpartisan Civic | High (JSON/XML) | Yes (REST) | API Key Required | Proprietary Non-Profit | Medium |
| `NAT-LEG-OPENSTATES`| Open Civic Tech | High (JSON) | Yes (REST v3) | Freemium Tier | Open Data / Commercial | Medium |
| `NAT-LEG-LEGISCAN` | Commercial Vendor | Excellent (JSON) | Yes (RPC JSON) | 10k-30k queries/mo | Freemium / Paid Push | Low |
| `NAT-CRT-COURTLIST`| Non-Profit Project | Excellent (JSON) | Yes (REST v4) | 125 req/day free | Permissive / Open Source| Low |
| `NAT-CRT-OYEZ` | Academic Multimedia | High (JSON/Audio) | Web / Endpoints | Open | Open Educational | Low |
| `NAT-CAM-OPENSEC` | Research Non-Profit| High (CSV) | Bulk Only (API Ret)| Free Non-Commercial | CC BY-NC-SA 4.0 | Medium |
| `NAT-CRT-NCSC` | Academic / Clearing | High (CSV/Dash) | Dashboards Only | Free Public Research | Educational / Research | Low |
| `NAT-POL-NCSL` | Policy Clearinghouse | Medium (Reports) | Reports Only | Free Public Research | Research / Educational | Low |
| `NAT-JRN-INN` | Journalism Network | Medium (RSS) | Directory / RSS | Open | Non-Profit Network | Medium |
