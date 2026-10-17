# Deliverable B: Topic Taxonomy and Deep-Dive Findings
## Systematic Evaluation Across Civic, Electoral, Legislative, and Justice Domains

**Document Identifier:** `CIVIC-DOC-01-TAXONOMY-DEEPDIVE`  
**Research Execution Date:** October 17, 2026  
**Cycle Scope:** 2026 Midterm Cycle and Multilevel Governance Ingestion  

---

## 1. Overview of Taxonomy and Methodology

This document provides a exhaustive deep-dive evaluation of the 6 core functional categories and 66 discrete subtopics defined in the system prompt. For each functional category, this report evaluates:
1. **Best Authoritative & Specialist Sources:** Verified systems of record, data vendors, and specialist repositories.
2. **Geographic Coverage & Distribution:** Nationwide, 50-state, territorial, and local jurisdictional reach.
3. **Programmatic Access & Developer Methods:** APIs, bulk downloads, schemas, and authentication protocols.
4. **Print, Physical, & Offline Holdings:** Paper ledgers, legal notice gazettes, microfilm, and special library collections.
5. **Technical Integration Pathways:** Preferred ingestion architecture, normalization pipelines, and entity mapping.
6. **Operational Limitations & Unresolved Questions:** Structural deficits, legal restrictions, and transparency gaps.

---

## 2. Category A: Voting and Election Administration (Topics 1–18)

### Granular Subtopics Covered
* **A.1:** Voter eligibility, citizenship, residency, age, and registration rules.
* **A.2:** Registration deadlines, registration methods, and registration-status lookup.
* **A.3:** Election calendars, candidate filing deadlines, and special elections.
* **A.4:** Polling-place, vote-center, and ballot drop-box lookup.
* **A.5:** Early voting and in-person absentee voting windows and locations.
* **A.6:** Mail/absentee ballots: request rules, deadlines, tracking systems, signature curing, and return options.
* **A.7:** Voter identification requirements, photo ID laws, and acceptable documentation.
* **A.8:** Provisional ballots, verification windows, and eligibility challenge procedures.
* **A.9:** Accessibility, disability accommodations, language assistance (Voting Rights Act § 203), and accessible ballot formats.
* **A.10:** Military and overseas voting under UOCAVA, FVAP resources, and electronic ballot delivery.
* **A.11:** Voting rights restoration frameworks and rules governing justice-impacted/formerly incarcerated citizens.
* **A.12:** Student, tribal, unhoused, displaced, and situation-specific voter registration guidance.
* **A.13:** Election administrators, local election boards, meeting notices, and official directory crosswalks.
* **A.14:** Poll worker recruitment, observer regulations, administrative manuals, and poll worker training.
* **A.15:** Voting system certification, logic and accuracy (L&A) testing, risk-limiting audits (RLAs), recounts, and canvassing.
* **A.16:** Election security protocols, incident reporting hubs, voter assistance hotlines, and rumor mitigation.
* **A.17:** Turnout statistics, registration tallies, EAVS biennial survey data, and historical election returns.
* **A.18:** Precincts, wards, voting districts, GIS shapefiles, redistricting maps, and address-to-district spatial resolution.

### Comparative Assessment of Category A

| Evaluation Dimension | Deep-Dive Findings & Technical Grounding |
|---|---|
| **Authoritative Sources** | U.S. Election Assistance Commission (EAC); Federal Voting Assistance Program (FVAP); Vote.gov (GSA); State Secretaries of State / Boards of Elections; County Clerks / Election Boards. |
| **Specialist Sources** | Voting Information Project (VIP / Democracy Works); Google Civic Information API; National Conference of State Legislatures (NCSL); MIT Election Data and Science Lab (MEDSL); Campaign Legal Center. |
| **Geographic Coverage** | 50 states, DC, and 5 territories have official rules, but local polling/precinct data coverage depends on county/municipal digital readiness and VIP feed submission. |
| **Developer Access** | VIP XML Feed Spec v5.2/v6.0 (`github.com/votinginfoproject/vip-specification`); Google Civic Information API (`voterinfo` endpoint); FVAP XML Election Offices API (`fvap.gov/xml-api/`); Census Geocoder. |
| **Print & Offline Collections** | County election board minute books; printed municipal voter registration poll books (pre-electronic); physical sample ballots posted at municipal halls; printed state election procedure manuals. |
| **Recommended Integration** | Hybrid pipeline: Query Google Civic Information API during active election windows; fall back to state-specific voter registration lookup scrapers and official county election board directories. |
| **Operational Limitations** | The Google Civic `voterinfo` endpoint is active *only* during designated election windows where state VIP data is live. Real-time absentee ballot curing and tracking require authenticated voter portals. |

---

## 3. Category B: Ballots, Candidates, and Officeholders (Topics 19–28)

### Granular Subtopics Covered
* **B.19:** Official sample ballots, ballot styles, split precincts, and address-specific ballot visualization.
* **B.20:** Candidate filings, ballot qualification, challenges, withdrawals, substitutions, and write-in rules.
* **B.21:** Candidate biographies, professional experience, policy statements, candidate questionnaires, and debate archives.
* **B.22:** Incumbents, officeholder directories, terms of office, vacancies, appointments, and succession orders.
* **B.23:** Party affiliation, official party endorsements, union/PAC endorsements, and civic organizational support.
* **B.24:** Judicial elections, retention elections, merit selection commissions, and judicial performance evaluations.
* **B.25:** Ballot measures, citizen initiatives, referenda, constitutional amendments, and recall petition thresholds.
* **B.26:** Official ballot language, legislative fiscal notes, explanatory statements, and opposing argument pamphlets.
* **B.27:** Candidate and ballot-measure campaign finance filings, donor disclosures, independent expenditures, and PAC registries.
* **B.28:** Public financial disclosures, personal conflicts of interest, statement of economic interests (SEI), and ethics disciplinary records.

### Comparative Assessment of Category B

| Evaluation Dimension | Deep-Dive Findings & Technical Grounding |
|---|---|
| **Authoritative Sources** | Federal Election Commission (FEC); State Campaign Finance Commissions / Ethics Boards; State Secretaries of State; County Election Boards; Office of Government Ethics (OGE). |
| **Specialist Sources** | Ballotpedia (Candidate, Ballot Measure, and Officeholder databases); Vote411 (League of Women Voters Education Fund); Vote Smart; OpenSecrets (Bulk Data Program); FollowTheMoney (OpenSecrets State Data). |
| **Geographic Coverage** | Federal candidates 100%; statewide candidates 100%; legislative candidates 98%; county/local municipal candidates coverage drops below 60% outside top 100 metropolitan areas. |
| **Developer Access** | OpenFEC REST API (`api.open.fec.gov`); Ballotpedia Data Client API (`api4.ballotpedia.org` - commercial subscription); OpenSecrets Bulk Data (CSV downloads via registration); State campaign finance APIs. |
| **Print & Offline Collections** | State-published printed Voter Information Pamphlets (e.g., California Ballot Pamphlet, Oregon Voters' Pamphlet); county courthouse physical candidate petition binders; local ethics disclosure ledgers. |
| **Recommended Integration** | Ingest federal campaign finance directly via OpenFEC API; ingest state legislation/candidate filings via Ballotpedia API (or licensed vendor feeds); harvest local candidate filings directly from county PDF lists. |
| **Operational Limitations** | **52 U.S.C. § 30111(a)(4)** strictly prohibits using FEC contributor names and addresses for commercial solicitation or fundraising. Local candidate bios and issue questionnaires suffer from severe non-response rates. |

---

## 4. Category C: Legislation and Government Action (Topics 29–39)

### Granular Subtopics Covered
* **C.29:** Federal bills, resolutions, joint resolutions, amendments, cosponsorships, and legislative status tracking.
* **C.30:** Committee activity, hearings, witness testimony, committee reports, markups, and executive business calendars.
* **C.31:** Roll-call votes, floor proceedings, Congressional Record journals, and legislative floor video streams (C-SPAN/House/Senate).
* **C.32:** Enacted public and private laws, codified statutes (United States Code), session laws (Statutes at Large), and effective dates.
* **C.33:** State legislation, legislative tracking, chamber floor votes, and committee substitutes across all 50 state legislatures.
* **C.34:** Local municipal ordinances, city council resolutions, municipal codes, council meeting agendas, packet attachments, and minutes.
* **C.35:** Administrative rules, proposed rulemakings, public notice-and-comment submissions, and administrative registers (Federal Register / State Registers).
* **C.36:** Executive orders, presidential proclamations, gubernatorial executive directives, emergency declarations, and veto messages.
* **C.37:** Budgets, enacted appropriations, legislative fiscal notes, state auditor reports, and public expenditure dashboards (USASpending.gov).
* **C.38:** Lobbying registrations, periodic lobbying activity reports, foreign agent registrations (FARA), and lobbyist expenditure filings.
* **C.39:** Automated legislative text comparison (redline diffs), version tracking, cross-references, and policy topic taxonomy classification.

### Comparative Assessment of Category C

| Evaluation Dimension | Deep-Dive Findings & Technical Grounding |
|---|---|
| **Authoritative Sources** | Library of Congress (Congress.gov); U.S. Government Publishing Office (GovInfo); National Archives and Records Administration (Federal Register / eCFR); State Legislative Information Systems (LIS). |
| **Specialist Sources** | LegiScan; Plural Policy (Open States); CivicPulse; Municode / CivicPlus; American Legal Publishing; General Code; USASpending.gov. |
| **Geographic Coverage** | 100% federal coverage; 100% 50-state legislative coverage; local municipal ordinance coverage exceeds 80% for cities >50,000 population, but drops significantly for unincorporated townships and rural counties. |
| **Developer Access** | Congress.gov API (`api.congress.gov` - 5,000 req/hr); GovInfo API (`api.govinfo.gov` - 36,000 req/hr); Federal Register API (`federalregister.gov/api/v1`); LegiScan API; Open States REST API v3. |
| **Print & Offline Collections** | Bound volumes of the Congressional Record; official State Session Laws; municipal ordinance slip laws in city clerk safes; microfiche holdings of legislative committee transcripts and hearing exhibits. |
| **Recommended Integration** | Use Congress.gov API and GovInfo API for federal legislative ingest; use LegiScan or Open States v3 for multi-state legislative tracking; use CivicPlus/Municode portal monitors for top-tier municipal ordinances. |
| **Operational Limitations** | State legislative fiscal notes are frequently issued as scanned, unsearchable PDFs hours before committee votes. Local municipal agendas are often published less than 48 hours before council voting sessions. |

---

## 5. Category D: Courts, Judges, and Legal Proceedings (Topics 40–50)

### Granular Subtopics Covered
* **D.40:** Federal and state court structural hierarchies, subject-matter jurisdiction, courthouse directories, and oral argument calendars.
* **D.41:** Case dockets, filings, briefs, judicial orders, slip opinions, published judgments, and case procedural histories.
* **D.42:** Trial courts of general jurisdiction, appellate courts, state courts of last resort, bankruptcy courts, and specialty courts (probate, family, drug).
* **D.43:** Judicial biographies, gubernatorial appointments, presidential nominations, Senate confirmations, and merit selection commission panels.
* **D.44:** Judicial financial disclosures, recusal tracking, judicial conduct commission disciplinary records, and ethics complaints.
* **D.45:** Election litigation, voting rights challenges, redistricting jurisprudence, ballot access disputes, and emergency election injunctions.
* **D.46:** Constitutional litigation, administrative procedure challenges, public corruption trials, and state agency enforcement proceedings.
* **D.47:** Courtroom audio recordings, oral argument transcripts, evidentiary exhibits, and courthouse camera/broadcasting access policies.
* **D.48:** Automated case docket alerts, citator tools, subsequent judicial treatment (affirmance/reversal), and legal citation networks.
* **D.49:** Court caseload statistics, clearance rates, median disposition times, backlog metrics, and National Center for State Courts (NCSC) datasets.
* **D.50:** Sealed dockets, expunged criminal records, juvenile proceedings, and statutory availability limitations.

### Comparative Assessment of Category D

| Evaluation Dimension | Deep-Dive Findings & Technical Grounding |
|---|---|
| **Authoritative Sources** | Administrative Office of the U.S. Courts (PACER); Supreme Court of the United States; State Judicial Branches (e.g., AOPC in PA, SCAO in MI, Judicial Council of CA); County Court Clerks. |
| **Specialist Sources** | CourtListener / Free Law Project; RECAP Archive; Oyez Project (Supreme Court audio/transcripts); National Center for State Courts (NCSC Court Statistics Project); Justia; Harvard Caselaw Access Project. |
| **Geographic Coverage** | 100% federal court coverage (PACER/CourtListener); state appellate courts ~90% digital coverage; state trial court dockets vary wildly (commercial paywalls in GA/TX vs. open portals in WI/PA). |
| **Developer Access** | CourtListener REST API v4 (`courtlistener.com/api/rest/v4/` - opinions, dockets, judges, audio, disclosures); PACER Case Locator API; Harvard CAP bulk data; commercial legal APIs (vLex, LexisNexis). |
| **Print & Offline Collections** | National Reporter System bound volumes (Westlaw / Thomson Reuters); physical docket books in county clerk offices; microfilmed historical trial transcripts; county law library local trial archives. |
| **Recommended Integration** | Ingest federal dockets and appellate opinions via CourtListener REST v4 and PostgreSQL database replication; query state court portals via official web lookup scripts where authorized; license commercial feeds for broad trial court coverage. |
| **Operational Limitations** | Federal PACER charges $0.10/page ($3.00 cap per document). State trial courts are heavily fragmented across private portal vendors (Tyler Technologies Odyssey, PeachCourt) that impose strict CAPTCHA and anti-scraping walls. |

---

## 6. Category E: Prosecutors and Public Legal Offices (Topics 51–58)

### Granular Subtopics Covered
* **E.51:** U.S. Attorney Offices, 94 federal judicial districts, presidential appointments, Senate confirmations, and acting U.S. Attorney leadership.
* **E.52:** District Attorneys, State's Attorneys, Commonwealth's Attorneys, County Prosecutors, and Circuit Solicitors across local jurisdictions.
* **E.53:** Prosecutor election cycles, appointment terms, candidate filings, debate appearances, and prosecutorial campaign contributions.
* **E.54:** Prosecutorial office policies, declination criteria, charging guidance, diversion program rules, annual reports, and public performance dashboards.
* **E.55:** Public corruption investigations, election crime prosecutions, civil rights enforcement actions, and official press releases.
* **E.56:** Conviction integrity units (CIUs), exoneration reviews, open-file discovery guidelines, and Brady/Giglio disclosure compliance manuals.
* **E.57:** State Attorneys General, solicitor general offices, consumer protection bureaus, and statewide antitrust/environmental enforcement.
* **E.58:** Public defender agencies, legal aid societies, inspectors general, and civilian police oversight boards as structural counterweights.

### Comparative Assessment of Category E

| Evaluation Dimension | Deep-Dive Findings & Technical Grounding |
|---|---|
| **Authoritative Sources** | U.S. Department of Justice (DOJ U.S. Attorneys Directory); National Association of Attorneys General (NAAG); National District Attorneys Association (NDAA); State Prosecuting Attorneys Associations. |
| **Specialist Sources** | Prosecutorial Performance Indicators (PPI Project); Vera Institute of Justice; National Registry of Exonerations; Fair and Just Prosecution; Local Legal Intelligencers. |
| **Geographic Coverage** | Federal U.S. Attorneys: 100% across all 94 districts; State AGs: 100% across all 50 states + DC/territories; Local District Attorneys: ~2,300 prosecutorial districts mapped through state association directories. |
| **Developer Access** | DOJ Web API / Press Release RSS Feeds (`justice.gov/usao/news`); State AG website RSS feeds; PPI Project open datasets; No unified national REST API exists for local prosecutor charging decisions. |
| **Print & Offline Collections** | Annual printed prosecutor caseload reports; county board annual budget appropriation hearings; physical felony indictment dockets maintained in county criminal clerk offices; local grand jury presentment archives. |
| **Recommended Integration** | Map prosecutorial boundaries to county FIPS and state judicial circuits; monitor DOJ USAO news feeds via automated RSS ingestion; ingest State AG press portals and annual report PDF repositories. |
| **Operational Limitations** | Local prosecutor charging policies and internal declination standards are rarely published as structured data. Prosecutor press releases must be rigorously categorized as allegations, not proven facts, to prevent defamation liability. |

---

## 7. Category F: Journalism, Community, Print, and Archives (Topics 59–66)

### Granular Subtopics Covered
* **F.59:** Local daily newspapers, nonprofit digital newsrooms, public radio (NPR member stations), public television (PBS), and civic watchdog reporters.
* **F.60:** Nonpartisan voter guides published by community foundations, public libraries, university policy institutes, and civic leagues.
* **F.61:** Ethnic media, Spanish-language publications, Black press, Indigenous/tribal newspapers, neighborhood gazettes, and community newsletters.
* **F.62:** Official newspapers of record, municipal legal notices, election notices, public hearing announcements, and county sheriff sale notices.
* **F.63:** Printed voter information pamphlets, state legislative journals, county administrative manuals, and official paper sample ballots.
* **F.64:** State libraries, supreme court law libraries, municipal public libraries, state archives, and Federal Depository Library Program (FDLP) hubs.
* **F.65:** Historical newspaper archives, subscription databases (Newspapers.com, NewsBank), university digitization portals, and microfilm master collections.
* **F.66:** Civic fact-checking organizations, newsroom ownership tracking, masthead correction logs, and source transparency frameworks.

### Comparative Assessment of Category F

| Evaluation Dimension | Deep-Dive Findings & Technical Grounding |
|---|---|
| **Authoritative Sources** | Library of Congress (Chronicling America via LoC.gov API); State Historical Societies; State Library Depository Networks; Official County Legal Notice Gazettes. |
| **Specialist Sources** | Institute for Nonprofit News (INN Directory); Local Independent Online News (LION Publishers); NewsBank; Newspapers.com; ProQuest; Internet Archive; PolitiFact; FactCheck.org. |
| **Geographic Coverage** | Extensive historical depth (18th century to present); current local news coverage exhibits severe "news deserts" in over 200 rural U.S. counties lacking a dedicated local newspaper. |
| **Developer Access** | Library of Congress JSON/YAML API (`loc.gov/collections/chronicling-america/?fo=json`); INN Member Directory Feed; Media Cloud API; NewsAPI; RSS/Atom feeds of local independent outlets. |
| **Print & Offline Collections** | 35mm microfilm reels of county newspapers; bound volumes of historic legal gazettes; county courthouse basement historical deed/voter ledgers; university special collection candidate debate tapes. |
| **Recommended Integration** | Use LoC.gov JSON API for historical context and newspaper title directory resolution; ingest RSS feeds from INN/LION non-profit newsrooms; catalog physical holding institutions for un-digitized county records. |
| **Operational Limitations** | Commercial historic newspaper platforms (Newspapers.com, NewsBank) prohibit bulk automated text mining under terms of service. Optical Character Recognition (OCR) error rates in 19th-century scanned newsprint range from 5% to 20%. |

---

## 8. Cross-Category Data Synthesis Matrix

The table below summarizes the technical, structural, and legal posture of each taxonomy category:

| Taxonomy Category | Primary Data Format | Primary Access Mechanism | Update Cadence | Key Legal & Operational Constraint |
|---|---|---|---|---|
| **A. Voting & Elections** | JSON, XML, PDF, HTML | REST API, VIP Feeds, Scrapers | Highly volatile during elections | VIP feeds available only during active cycles; PII in voter rolls restricted. |
| **B. Ballots & Candidates** | JSON, CSV, PDF | Commercial API, Bulk, Web | Daily during filing windows | 52 U.S.C. § 30111(a)(4) bans commercial use of FEC donor information. |
| **C. Legislation & Actions** | XML, JSON, PDF | REST APIs (Congress, GovInfo, State) | Real-time to Daily | Local municipal ordinances lack unified national schema or centralized repository. |
| **D. Courts & Proceedings** | PDF, Text, HTML | REST API (CourtListener), PACER | Continuous / Docket-driven | PACER search fees; state trial court paywalls; FCRA restrictions on use. |
| **E. Prosecutors & Legal Offices** | HTML, PDF, RSS | Web Portals, RSS Feeds, Reports | Event-driven / Weekly | Statements reflect state allegations; must safeguard presumption of innocence. |
| **F. Journalism & Archives** | Text, TIFF, PDF, Print | LoC API, RSS, On-site Microfilm | Daily (News) to Static (Archives) | Copyright on post-1928 news; physical visits required for un-scanned county rolls. |
