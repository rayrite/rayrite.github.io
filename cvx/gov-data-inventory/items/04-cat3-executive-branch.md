### Category 3: Executive Branch

#### Narrative: Executive Transparency & The Administrative State

Tracking the executive branch involves two distinct operational tiers: **formal statutory actions** (Executive Orders, Presidential Proclamations, Presidential Memoranda, and federal administrative rulemaking) and **public communications** (White House press briefings, pool reports, official statements, and presidential schedules). The foundational spine for formal executive actions is the **Federal Register API** (`federalregister.gov/api/v1`), maintained by the Office of the Federal Register (National Archives) and the GPO. It provides a world-class, zero-authentication JSON API that indexes every official executive document published since 1994, alongside a real-time 'Public Inspection' endpoint that surfaces breaking regulations and orders hours before official daily publication.

For official transcripts of presidential press conferences, signing ceremonies, and cabinet nomination messages, the GPO's **GovInfo API** exposes the *Compilation of Presidential Documents (CPD)*. Conversely, direct White House communications (`whitehouse.gov`) rely on WordPress-generated RSS feeds and web pages that fluctuate significantly between presidential administrations, requiring defensive architectural design for mobile consumption.

| DATA POINT | DESCRIPTION | PRIMARY SOURCE | SOURCE URL | API AVAILABLE | API TYPE | AUTH REQUIRED | UPDATE FREQUENCY | COST | NOTES |
| :--- | :--- | :--- | :--- | :---: | :--- | :---: | :--- | :--- | :--- |
| Executive Orders (EOs) | Official directives signed by the President managing operations of the federal government. | Federal Register API v1 | https://www.federalregister.gov/api/v1/documents.json | Yes | REST / JSON | None | Daily (Business Days ~8:45 AM ET) | Free | Filter `conditions[presidential_document_type][]=executive_order`. Full text & PDF available. |
| Presidential Proclamations | Official statements of policy, ceremonial designations, trade tariffs, and national emergency declarations. | Federal Register API v1 | https://www.federalregister.gov/api/v1/documents.json | Yes | REST / JSON | None | Daily (Business Days) | Free | Filter `conditions[presidential_document_type][]=proclamation`. |
| Presidential Memoranda | Directives to executive departments carrying legal force but not numbered sequentially like EOs. | Federal Register API & GovInfo (CPD) | https://www.govinfo.gov/app/collection/cpd | Yes | REST / JSON | None / api.data.gov | Daily / Continuous | Free | Often published in Federal Register or Compilation of Presidential Documents. |
| Federal Regulations & Proposed Rules | Notice of Proposed Rulemaking (NPRM) and Final Rules issued by cabinet departments (EPA, SEC, etc.). | Federal Register API & Regulations.gov | https://www.federalregister.gov/api/v1/documents.json | Yes | REST / JSON | None / api.data.gov | Daily (Business Days) | Free | Filter `conditions[type][]=RULE` or `PROPOSED_RULE`. Connects to Regulations.gov for public comments. |
| Public Inspection Documents | Pre-publication drafts of executive orders and regulations filed with OFR for public inspection. | Federal Register API v1 | https://www.federalregister.gov/api/v1/public-inspection-documents.json | Yes | REST / JSON | None | Continuous (Updated throughout business day) | Free | Crucial near-real-time early warning system before documents appear in official daily Federal Register. |
| White House Press Briefings & Transcripts | Verbatim transcripts of daily White House press secretary briefings and presidential press conferences. | White House RSS & GovInfo (CPD) | https://www.whitehouse.gov/briefing-room/feed/ | Yes | RSS 2.0 / REST (GovInfo) | None / api.data.gov | Daily (1-3 hours post-briefing) | Free | White House RSS provides immediate headlines; GovInfo provides authenticated historical transcripts. |
| Presidential Daily Public Schedule | Official daily agenda of presidential meetings, bilateral discussions, bill signings, and travel. | White House Press Office / Factbase | https://www.whitehouse.gov/briefing-room/statements-releases/ | Partial | RSS / Web Scrape | None | Daily (Evening prior to events) | Free | Published as daily press release; requires HTML parsing or RSS title filtering. |
| Cabinet Nominations & Confirmations | Status of presidential nominations submitted to the Senate for cabinet secretaries, ambassadors, and judges. | Congress.gov API v3 (Nominations) | https://api.congress.gov/v3/nomination | Yes | REST / JSON | api.data.gov Key | Continuous during Senate session | Free | Tracks committee hearings, roll-call confirmation votes, and withdrawal of nominees. |
| Executive Agency Press Releases | News announcements and enforcement actions from federal agencies (DOJ, State, DOD, HHS, etc.). | Agency Specific RSS Feeds | https://www.justice.gov/feeds / https://www.defense.gov/News/RSS/ | Yes | RSS 2.0 / Atom | None | Continuous | Free | Standardized RSS feeds available from every major cabinet department. |


#### Datasheets: Executive Branch Sources

##### 1. Federal Register API (Version 1)
- **Source Name & URL:** Office of the Federal Register (NARA) & GPO | [federalregister.gov/reader-aids/developer-resources/rest-api](https://www.federalregister.gov/reader-aids/developer-resources/rest-api)
- **Data Provided:** Full metadata and text of the official daily journal of the US Government: Executive Orders, Presidential Proclamations, Administrative Orders, Proposed Rules, Final Rules, and Agency Notices dating from 1994 to present.
- **Access Method:** RESTful HTTP GET API.
- **Authentication:** None required. Open public API.
- **Update Frequency:** Daily at 8:45 AM ET for official publication; continuously for Public Inspection documents.
- **Rate Limits:** Extremely high (nominally unthrottled; developers should practice polite client caching).
- **Cost:** Free ($0).
- **Data Format:** JSON (default), XML, HTML full text, PDF download.
- **Documentation Quality:** Excellent. Interactive documentation with pre-configured search queries.
- **Recommended For:** The premier production backbone for all Executive Orders, Proclamations, and federal regulatory activity.
- **Example API Endpoints:**
  - *Latest Executive Orders:* `https://www.federalregister.gov/api/v1/documents.json?conditions[type][]=PRESDOCU&conditions[presidential_document_type][]=executive_order&order=newest`
  - *Breaking Pre-Publication Documents:* `https://www.federalregister.gov/api/v1/public-inspection-documents.json`
  - *Document Detail with Full Text:* `https://www.federalregister.gov/api/v1/documents/2026-04182.json`
- **Verify-Before-Integration:** Note: While the API is designated 'v1', it is actively maintained and handles all production traffic. There is no active 'v2' rewrite required for 2026.

##### 2. GovInfo.gov API
- **Source Name & URL:** US Government Publishing Office (GPO) | [api.govinfo.gov](https://api.govinfo.gov)
- **Data Provided:** Authenticated, digitally signed repository of official US Government publications across collections: `CPD` (Compilation of Presidential Documents - speeches, press conferences, messages to Congress), `FR` (Federal Register), `CFR` (Code of Federal Regulations), `BILLS`, and `CREC` (Congressional Record).
- **Access Method:** RESTful HTTP GET API.
- **Authentication:** `api.data.gov` API Key.
- **Update Frequency:** Daily as official documents are released.
- **Rate Limits:** 1,000 requests per hour (standard `api.data.gov`).
- **Cost:** Free ($0).
- **Data Format:** JSON (metadata), XML, PDF (authenticated digital signature).
- **Documentation Quality:** Excellent. Swagger UI documentation at `api.govinfo.gov/docs/`.
- **Recommended For:** Retrieving official transcripts of White House speeches, presidential press conferences, and signing statements.
- **Example API Endpoints:**
  - *List Presidential Documents published in current month:* `https://api.govinfo.gov/collections/CPD/2026-10-01T00:00:00Z?pageSize=20&api_key={KEY}`
  - *Package Summary:* `https://api.govinfo.gov/packages/DCPD-202600120/summary?api_key={KEY}`
- **Verify-Before-Integration:** None. Reliable GPO infrastructure.

##### 3. White House Official Feeds
- **Source Name & URL:** Executive Office of the President | [whitehouse.gov](https://www.whitehouse.gov)
- **Data Provided:** RSS feeds for Briefing Room announcements, press briefing transcripts, presidential actions, and statements.
- **Access Method:** RSS 2.0 XML syndication feeds.
- **Authentication:** None.
- **Update Frequency:** Real-Time / Immediately as White House communications staff post content.
- **Rate Limits:** Standard web traffic.
- **Cost:** Free ($0).
- **Data Format:** RSS (XML).
- **Documentation Quality:** Sparse (standard WordPress RSS feeds).
- **Recommended For:** Push-notification triggers for White House press releases and breaking statements.
- **Example RSS Feed URLs:**
  - *Briefing Room Feed:* `https://www.whitehouse.gov/briefing-room/feed/`
  - *Presidential Actions Feed:* `https://www.whitehouse.gov/briefing-room/presidential-actions/feed/`
  - *Statements & Releases:* `https://www.whitehouse.gov/briefing-room/statements-releases/feed/`
- **Verify-Before-Integration:** `[Verify-Before-Integration]` Administration URL shifts: presidential administrations periodically modify WordPress taxonomy slugs during transitions.

##### 4. Regulations.gov API (Version 4)
- **Source Name & URL:** General Services Administration (GSA) eRulemaking Program | [api.regulations.gov](https://api.regulations.gov)
- **Data Provided:** Public dockets, regulatory impact analyses, proposed agency rules, and millions of public comments submitted by citizens and organizations on federal rulemaking.
- **Access Method:** RESTful HTTP GET API.
- **Authentication:** `api.data.gov` API Key.
- **Update Frequency:** Daily as dockets are processed.
- **Rate Limits:** 1,000 requests per hour.
- **Cost:** Free ($0).
- **Data Format:** JSON.
- **Documentation Quality:** Good. Complete Swagger documentation at `open.gsa.gov/api/regulationsgov/`.
- **Recommended For:** Allowing mobile app users to read proposed rules and track public comments on contentious federal regulations (e.g. EPA, SEC, FTC regulations).
- **Example API Endpoints:**
  - *Search dockets by keyword:* `https://api.regulations.gov/v4/dockets?filter[searchTerm]=environmental&api_key={KEY}`
  - *Search recent public comments:* `https://api.regulations.gov/v4/comments?sort=-postedDate&api_key={KEY}`
- **Verify-Before-Integration:** None. Stable v4 production endpoint.

##### 5. National Archives (archives.gov) Presidential Libraries
- **Source Name & URL:** National Archives and Records Administration | [archives.gov/presidential-libraries](https://www.archives.gov/presidential-libraries)
- **Data Provided:** Historical executive orders (George Washington through Barack Obama), presidential archives, and official executive order number registries.
- **Access Method:** Web tables and archival bulk data.
- **Authentication:** None.
- **Update Frequency:** Historical (post-presidential administration transfers).
- **Rate Limits:** Standard web traffic.
- **Cost:** Free ($0).
- **Data Format:** HTML, CSV.
- **Documentation Quality:** Good archival documentation.
- **Recommended For:** Historical reference and cross-referencing sequential EO numbering.
- **Verify-Before-Integration:** None.

#### Technical Architecture: Tracking Cabinet Confirmations (RQ-14)

While executive nominations originate in the White House, their **status, committee hearings, and confirmation votes occur exclusively within the Senate**. Therefore, an effective mobile architecture should not scrape White House press releases for confirmation status; instead, use the **Congress.gov API v3 Nominations Endpoint**:

- **Endpoint:** `https://api.congress.gov/v3/nomination/{congress}` (e.g. `https://api.congress.gov/v3/nomination/119?api_key={KEY}`)

- **Data Structure:** Exposes nomination number (PN), nominee name, position title (e.g., 'Secretary of State', 'Associate Justice of the Supreme Court'), referring committee (e.g. Senate Judiciary, Foreign Relations), and official status (`Received in Senate`, `Reported by Committee`, `Confirmed by Senate`, `Returned to President`).

- **Real-Time Votes:** When a final confirmation roll-call occurs, fetch the roll-call XML from `senate.gov` to display the exact bipartisan vote tally in the mobile app.
