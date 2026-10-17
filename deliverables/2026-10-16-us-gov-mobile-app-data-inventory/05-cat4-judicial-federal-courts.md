### Category 4: Judicial — Federal Courts

#### Narrative: The Judicial Data Landscape & PACER Economics

The federal judicial data ecosystem presents a dramatic contrast between the legal system of record and the modern civic developer's technical needs. By federal statute, the official repository for federal appellate, district, and bankruptcy court dockets is **PACER** (Public Access to Court Electronic Records), administered by the Administrative Office of the U.S. Courts. While PACER provides complete coverage, its pay-per-page fee model ($0.10/page) makes direct integration into a mobile application economically dangerous for a developer and completely unscalable for free public consumption.

To bridge this divide, the civic technology non-profit **Free Law Project** created **CourtListener** and the **RECAP Archive**. CourtListener exposes a comprehensive REST API (Version 4) that aggregates millions of judicial opinions, federal dockets, and Article III judge biographies. Crucially, the RECAP Archive crowdsources millions of PACER documents uploaded by legal professionals and makes them freely accessible via the CourtListener API at **zero cost**. For the Supreme Court of the United States (SCOTUS), official slip opinions and orders are distributed via RSS and web feeds on `supremecourt.gov`, while the **Oyez Project** provides rich multimedia, justice alignment matrices, and time-aligned oral argument audio.

| DATA POINT | DESCRIPTION | PRIMARY SOURCE | SOURCE URL | API AVAILABLE | API TYPE | AUTH REQUIRED | UPDATE FREQUENCY | COST | NOTES |
| :--- | :--- | :--- | :--- | :---: | :--- | :---: | :--- | :--- | :--- |
| SCOTUS Current Term Docket | Filings, cert petitions, granted cases, amicus briefs, and docket timeline for Supreme Court cases. | Supreme Court & CourtListener | https://www.supremecourt.gov/docket/docket.aspx | Yes | REST / JSON (CourtListener) | Free Token | Daily / Continuous updates | Free | CourtListener indexes SCOTUS dockets under jurisdiction 'scotus' with full party details. |
| SCOTUS Opinions (Slip & Final) | Full text of majority, concurring, and dissenting opinions of the Supreme Court. | Supreme Court RSS & CourtListener | https://www.supremecourt.gov/opinions/slipopinion/25 | Yes | RSS (SCOTUS) / REST (CourtListener) | None (RSS) / Token | Immediate upon bench announcement (~10 AM ET) | Free | SCOTUS publishes RSS for Slip Opinions; CourtListener parses text and generates cluster IDs. |
| SCOTUS Oral Argument Schedule & Audio | Calendar of oral arguments, MP3 audio recordings, and verbatim time-aligned transcripts. | Oyez Project & Supreme Court | https://www.oyez.org / https://www.supremecourt.gov/oral_arguments/ | Yes | JSON API (Oyez) / RSS / MP3 | None | Same-day (Friday audio release / expedited) | Free | Oyez provides speaker-attributed time-stamped JSON for synchronized mobile audio playback. |
| Federal Appellate & District Dockets | Case dockets across 13 federal circuits and 94 federal district courts (e.g. EDMI, WDMI). | CourtListener API v4 (Free Law Project) | https://www.courtlistener.com/api/rest/v4/dockets/ | Yes | REST / JSON | Free API Token | Continuous / Hourly sync | Free | Indexes case title, assigned judge, filing date, court ID, and docket entry history. |
| PACER Docket Entries & Documents | Official federal case records, pleadings, motions, and judicial orders in active federal litigation. | PACER (Official) & RECAP (Free) | https://pacer.uscourts.gov / https://www.courtlistener.com/recap/ | Yes | REST / JSON (RECAP) / PCL API | Free Token (RECAP) / PACER Login | Real-Time (PACER) / Daily (RECAP) | $0.10/page (PACER) / Free (RECAP) | RECAP provides 150M+ free documents; PACER waives fees if quarterly usage is under $30. |
| Federal Judge Profiles & Pipeline | Biographical directory of Article III judges, appointing president, confirmation date, and vacancies. | CourtListener People API / FJC | https://www.courtlistener.com/api/rest/v4/people/ | Yes | REST / JSON | Free Token | Weekly / As appointments occur | Free | Includes federal judicial nominations, education, and American Bar Association ratings. |
| Historical Case Law Precedent | Decisions of state supreme courts and federal courts from 1658 to recent history. | Caselaw Access Project (Harvard) & Justia | https://case.law | Yes | Bulk Download / AWS Open Data | None | Archival (Historical) | Free | CAP covers 6.7M cases; transitioned in 2024 to public domain bulk archives. |


#### Datasheets: Judicial — Federal Courts Sources

##### 1. CourtListener API (Version 4 — Free Law Project)
- **Source Name & URL:** Free Law Project | [courtlistener.com/api/rest/v4/](https://www.courtlistener.com/api/rest/v4/)
- **Data Provided:** Over 4 million judicial opinions, 150+ million PACER documents, federal dockets across all US District and Circuit courts, oral argument audio recordings, and judicial biographical directories.
- **Access Method:** RESTful HTTP GET API with extensive filtering and full-text search parameters.
- **Authentication:** API Token required in HTTP Authorization header (`Authorization: Token {YOUR_TOKEN}`). Sign-up is instant and free.
- **Update Frequency:** Continuous; dockets and opinions indexed within minutes of public availability.
- **Rate Limits:** 5,000 requests per hour for authenticated users (can be increased upon request for non-profit/civic projects).
- **Cost:** Free ($0). Free Law Project is a 501(c)(3) non-profit funded by grants and donations.
- **Data Format:** JSON.
- **Documentation Quality:** Excellent. OpenAPI documentation, detailed field descriptions, and active GitHub issue tracker.
- **Recommended For:** The primary, indispensable production spine for all federal court dockets, judicial opinions, and judge biographies.
- **Example API Endpoints:**
  - *Search Supreme Court opinions:* `https://www.courtlistener.com/api/rest/v4/search/?q=election&type=o&court=scotus`
  - *List recent federal dockets in Michigan Eastern District:* `https://www.courtlistener.com/api/rest/v4/dockets/?court=mied&order_by=-date_modified`
  - *Judge biography and appointments:* `https://www.courtlistener.com/api/rest/v4/people/?name_last=Roberts&name_first=John`
- **Verify-Before-Integration:** None. Highly reliable production infrastructure.

##### 2. Supreme Court of the United States Official Feeds
- **Source Name & URL:** Supreme Court of the United States | [supremecourt.gov](https://www.supremecourt.gov)
- **Data Provided:** Official slip opinions, orders lists (certiorari grants/denials), oral argument calendars, hearing audio files, and docket search.
- **Access Method:** RSS 2.0 XML feeds, direct PDF downloads, and web docket lookup.
- **Authentication:** None.
- **Update Frequency:** Real-Time / Immediate. Opinions released on designated decision days at 10:00 AM ET.
- **Rate Limits:** Standard web traffic.
- **Cost:** Free ($0).
- **Data Format:** RSS (XML), PDF, MP3 (oral arguments).
- **Documentation Quality:** Fair. Predictable RSS structures and PDF URLs.
- **Recommended For:** High-priority push notifications when a major SCOTUS decision is handed down.
- **Example RSS Feed URLs:**
  - *Slip Opinions RSS:* `https://www.supremecourt.gov/rss/opinions.xml`
  - *Orders of the Court RSS:* `https://www.supremecourt.gov/rss/orders.xml`
- **Verify-Before-Integration:** Opinion URL prefixes increment with each annual October term (e.g., `/opinions/slipopinion/25`).

##### 3. PACER (Administrative Office of the U.S. Courts)
- **Source Name & URL:** Administrative Office of the U.S. Courts | [pacer.uscourts.gov](https://pacer.uscourts.gov)
- **Data Provided:** Complete official docket sheets and case filings for all US District Courts, US Bankruptcy Courts, and US Courts of Appeals.
- **Access Method:** PACER Case Locator (PCL) web interface and automated REST search API.
- **Authentication:** Mandatory PACER user account with credit card on file.
- **Update Frequency:** Immediate / Real-Time as court clerks and attorneys file electronically.
- **Rate Limits:** Governed by account credit limits.
- **Cost Model (Crucial for Mobile Developers):**
  - **$0.10 per page** for docket sheets and filed PDF documents.
  - **$3.00 document cap:** Search results and individual documents are capped at $3.00 (30 pages).
  - **$30.00 Quarterly Fee Waiver:** If an account incurs **$30.00 or less** in fees across any calendar quarter, **all PACER fees are completely waived ($0)**. If usage exceeds $30.01, the user is billed the full amount.
- **Data Format:** HTML, PDF, JSON (via PCL API).
- **Documentation Quality:** Good administrative documentation; bureaucratic account creation.
- **Recommended For:** Strictly back-office administrative verification or manual investigation. **Do not connect a public mobile client directly to PACER**.
- **Verify-Before-Integration:** `[Verify-Before-Integration]` Review statutory fee waiver threshold.

##### 4. RECAP Archive
- **Source Name & URL:** Free Law Project | [courtlistener.com/recap/](https://www.courtlistener.com/recap/)
- **Data Provided:** Over 150 million federal court documents and docket entries originally purchased on PACER and donated to the public domain.
- **Access Method:** Integrated directly into CourtListener REST API v4.
- **Authentication:** Free CourtListener API Token.
- **Update Frequency:** Real-Time / Hourly as thousands of attorneys nationwide browse PACER using the RECAP extension.
- **Rate Limits:** Same as CourtListener (5,000 requests/hour).
- **Cost:** 100% Free ($0).
- **Data Format:** JSON metadata with direct PDF document download links.
- **Documentation Quality:** Excellent.
- **Recommended For:** Providing free document downloads for high-profile federal cases (e.g. civil rights, election law, antitrust) without paying PACER fees.
- **Example API Endpoint:** `https://www.courtlistener.com/api/rest/v4/recap/?docket__court=mied&description__icontains=order`
- **Verify-Before-Integration:** None.

##### 5. Oyez Project (Chicago-Kent & Cornell)
- **Source Name & URL:** Oyez / Justia | [oyez.org](https://www.oyez.org)
- **Data Provided:** Rich multimedia archive of every Supreme Court case: case summaries, question presented, legal background, justice voting alignments (e.g. 6-3 decision), written opinions, and digital audio of oral arguments with synchronized, word-by-word speaker transcripts.
- **Access Method:** Unofficial RESTful JSON API (`api.oyez.org`).
- **Authentication:** None required.
- **Update Frequency:** Updated continuously throughout the Supreme Court term.
- **Rate Limits:** Polite client rate limits (~60 req/min).
- **Cost:** Free ($0).
- **Data Format:** JSON, MP3, HTML.
- **Documentation Quality:** Community documented; highly intuitive JSON structures.
- **Recommended For:** Building rich Supreme Court mobile detail cards showing justice vote breakdowns (e.g. Justice Thomas, Sotomayor, etc.) and playing oral arguments with scrolling transcripts.
- **Example API Endpoint:** `https://api.oyez.org/cases/2024/23-719` (Returns case summary, timeline, votes, and transcript audio URLs).
- **Verify-Before-Integration:** `[Verify-Before-Integration]` Unofficial API endpoints should be cached behind an app backend.

##### 6. Caselaw Access Project (case.law)
- **Source Name & URL:** Harvard Law School Library Innovation Lab | [case.law](https://case.law)
- **Data Provided:** Complete digitization of 360 years of US legal precedent (over 6.7 million official state and federal court decisions from 1658 to ~2020).
- **Access Method:** Bulk parquet/JSON downloads hosted on AWS Open Data.
- **Authentication:** None.
- **Update Frequency:** Static archival dataset.
- **Rate Limits:** Governed by AWS Open Data.
- **Cost:** Free ($0).
- **Data Format:** Parquet, JSON, XML.
- **Documentation Quality:** Excellent.
- **Recommended For:** Historical precedent lookups and offline legal corpus analysis. Not suitable for live 2026 court dockets.
- **Verify-Before-Integration:** Note: case.law commercial API access restrictions ended in 2024 when the entire dataset entered the public domain.

#### Tracking Federal Judicial Appointments & Vacancies (RQ-20)

Tracking the judicial pipeline (vacancies, presidential nominations, and confirmations to District and Circuit courts) can be implemented cleanly via two free endpoints:

1. **CourtListener People API:** Query `https://www.courtlistener.com/api/rest/v4/people/?has_appointment=true` to retrieve federal judges, their appointing president, commission date, senior status date, and termination date.

2. **Congress.gov Nominations:** Query `https://api.congress.gov/v3/nomination/119` filtering for judicial appointments to track current nominees pending before the Senate Judiciary Committee.