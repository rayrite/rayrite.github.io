### Category 9: Michigan / Detroit Local

#### Narrative: Michigan State, Wayne County & Detroit Municipal Architecture

Delivering localized civic technology for the State of Michigan and the City of Detroit requires bridging state-level legislative and electoral portals with municipal open data infrastructure. At the state legislative tier (the Michigan Legislature in Lansing), **OpenStates v3** provides an elegant, modern GraphQL and REST API for tracking Michigan Senate and House bills, roll-call floor votes, and representative voting histories. The official Michigan Legislature web portal (`legislature.mi.gov`) offers comprehensive statutory tables and daily bulk data feeds for deeper legal research.

At the municipal tier, the **City of Detroit Open Data Portal** (`data.detroitmi.gov`) is powered by Tyler Technologies' Socrata platform, providing high-performance **SODA REST APIs** (Socrata Open Data API) across crucial civic domains: City Council legislative districts, council voting records, municipal operating budgets, property parcel assessments, and 311 citizen service requests. Wayne County complements this with ArcGIS Hub spatial services for county commission districts. For local news, Detroit's premier investigative outlets—including **BridgeDetroit**, **Detroit Free Press**, **The Detroit News**, and **Michigan Public** (NPR)—publish standardized RSS syndication feeds allowing clean, copyright-compliant headline aggregation.

| DATA POINT | DESCRIPTION | PRIMARY SOURCE | SOURCE URL | API AVAILABLE | API TYPE | AUTH REQUIRED | UPDATE FREQUENCY | COST | NOTES |
| :--- | :--- | :--- | :--- | :---: | :--- | :---: | :--- | :--- | :--- |
| Michigan State Legislative Bills | Bills, joint resolutions, amendments, and enrolled acts introduced in the Michigan House and Senate. | OpenStates v3 / Michigan Legislature | https://v3.openstates.org / https://legislature.mi.gov | Yes | REST / GraphQL (OpenStates) & Bulk | OpenStates API Key | Daily during session | Free | Tracks full status pipeline through House and Senate committee and floor votes. |
| Michigan Roll-Call Floor Votes | Roll-call voting records for all 38 Michigan state senators and 110 state representatives. | OpenStates v3 | https://v3.openstates.org | Yes | REST / GraphQL | OpenStates API Key | Daily post-session | Free | Includes member votes (Yes, No, Excused, Not Voting) on passage and amendments. |
| Michigan Governor Executive Actions | Executive Orders, Executive Directives, and formal proclamations issued by the Governor of Michigan. | State of Michigan Executive Office | https://www.michigan.gov/whitmer/news/executive-orders | Partial | Web Scrape / RSS | None | Immediate upon issuance | Free | Published to michigan.gov newsroom; accessible via RSS feeds and standard HTML. |
| Michigan Supreme Court Dockets & Opinions | Appellate opinions, orders, oral argument calendars, and docket records from Michigan's highest court. | Michigan Courts Portal (MJC) | https://www.courts.michigan.gov/courts/supreme-court/ | Partial | Web / RSS / CourtListener | None | Daily as opinions release | Free | Michigan Court of Appeals and Supreme Court publish opinions online; CourtListener indexes federal cross-walks. |
| Detroit City Council Districts & Members | Spatial polygons for Detroit's 7 City Council districts and directory of current council members. | City of Detroit Open Data (SODA) | https://data.detroitmi.gov/datasets/city-council-districts | Yes | REST / SODA (JSON) & GeoJSON | None | Annual / Redistricting | Free | Endpoint: `/resource/wwhw-k27h.json`. Direct mobile map polygon overlay. |
| Detroit City Council Legislative Actions | City council agendas, formal session minutes, adopted ordinances, and council member votes. | Detroit City Clerk / City Council | https://detroitmi.gov/government/city-council | Partial | Web Portal (Granicus / Legistar) | None | Weekly during council session | Free | City Council meetings and legislative records managed on Legistar portal. |
| Detroit Municipal Budget & Checkbook | City operating budget appropriations by department, vendor payments, and capital projects. | City of Detroit Open Data (SODA) | https://data.detroitmi.gov | Yes | REST / SODA (JSON) | None | Monthly / Fiscal Year | Free | Exposes municipal appropriations across police, fire, public works, and health. |
| Detroit 311 Citizen Service Requests | Geo-located citizen service requests (potholes, blight, streetlights, water leaks, abandoned vehicles). | City of Detroit Open Data (SODA) | https://data.detroitmi.gov/datasets/improve-detroit-issues | Yes | REST / SODA (JSON) & GeoJSON | None | Daily sync | Free | Powered by the 'Improve Detroit' 311 engine; includes status (Open/Acknowledged/Closed). |
| Wayne County Government & Commission | Wayne County Commission districts, county executive budget, and county-wide property maps. | Wayne County Open Data Portal | https://waynecounty.com / ArcGIS Hub | Yes | REST / ArcGIS Feature Service | None | Periodic | Free | County parcel boundary and commission district GeoJSON endpoints. |
| Detroit Local News Feeds | Local civic, investigative, and political news coverage focused on Detroit and Michigan state government. | Detroit Free Press, Detroit News, BridgeDetroit | https://www.bridgedetroit.com / https://www.freep.com | Yes | RSS 2.0 / Atom | None | Real-Time / Continuous | Free | BridgeDetroit provides non-profit civic coverage; Free Press and Detroit News offer daily metro news. |


#### Datasheets: Michigan / Detroit Local Sources

##### 1. OpenStates (Michigan State Legislature)
- **Source Name & URL:** OpenStates | [openstates.org/mi/](https://openstates.org/mi/) | API Portal: [v3.openstates.org](https://v3.openstates.org)
- **Data Provided:** Complete structured coverage of the Michigan State Legislature: bills introduced in the Michigan Senate and Michigan House of Representatives, full bill actions pipeline, legislative sponsors, committee assignments, roll-call floor votes, and legislator profile biographies.
- **Access Method:** RESTful HTTP GET API and GraphQL API.
- **Authentication:** OpenStates API Key required via `X-API-KEY` header.
- **Update Frequency:** Daily nightly synchronization during active Michigan legislative sessions.
- **Rate Limits:** 500 requests per day for free community tier; higher limits available for civic developers.
- **Cost:** Free ($0).
- **Data Format:** JSON.
- **Documentation Quality:** Excellent. Modern interactive GraphQL explorer and OpenAPI REST documentation.
- **Recommended For:** The primary production spine for tracking Michigan state legislative bills, state representatives, and Lansing roll-call votes.
- **Example API Endpoints (RQ-49):**
  - *List Recent Michigan Bills:* `https://v3.openstates.org/bills?jurisdiction=Michigan&sort=updated_desc`
  - *Michigan State Legislators:* `https://v3.openstates.org/people?jurisdiction=Michigan`
- **Verify-Before-Integration:** Monitor monthly call volume against the 500 req/day free limit; implement local SQLite client-side caching for mobile users.

##### 2. Michigan Legislature Official Portal & Bulk Data
- **Source Name & URL:** Michigan Legislative Council | [legislature.mi.gov](https://legislature.mi.gov)
- **Data Provided:** Official statutory records: Michigan Compiled Laws (MCL), legislative bill status tables, daily House and Senate journals, daily session calendars, and committee meeting notices.
- **Access Method:** Direct HTTP web access and daily bulk FTP/data tables.
- **Authentication:** None.
- **Update Frequency:** Daily during legislative sessions.
- **Rate Limits:** Standard government web server limits.
- **Cost:** Free ($0 / Public Domain).
- **Data Format:** HTML, PDF, Delimited Text / XML bulk files.
- **Documentation Quality:** Good statutory tables; lack of a modern JSON REST API makes direct mobile integration harder than OpenStates.
- **Recommended For:** Retrieving official GPO-equivalent enrolled bill text PDFs and verified statutory MCL cross-references.
- **Bulk Data URL (RQ-50):** `https://www.legislature.mi.gov/documents/publications/MCLtables/`
- **Verify-Before-Integration:** Web URLs use ASP.NET session tokens; rely on static link formats.

##### 3. City of Detroit Open Data Portal (SODA API)
- **Source Name & URL:** City of Detroit Department of Innovation and Technology (DoIT) | [data.detroitmi.gov](https://data.detroitmi.gov)
- **Data Provided:** Extensive civic open datasets powered by Socrata: City Council Districts, improve-detroit 311 issues, municipal operating budgets, building permits, commercial blighted property tickets, historic districts, recreation centers, DPW trash pickup zones, and property parcels.
- **Access Method:** Socrata Open Data API (SODA) RESTful HTTP GET endpoints.
- **Authentication:** None required for public reading. Optional Socrata App Token increases rate limits.
- **Update Frequency:** Real-Time / Daily automated pipeline syncs.
- **Rate Limits:** 1,000 requests per rolling hour unauthenticated; 50,000 requests per day with free App Token.
- **Cost:** Free ($0).
- **Data Format:** JSON, GeoJSON, CSV.
- **Documentation Quality:** Outstanding. Full SODA documentation with SoQL (Socrata Query Language) parameter support (`$where`, `$select`, `$limit`).
- **Recommended For:** The definitive municipal backbone for all Detroit local data features in the mobile app.
- **Example SODA Endpoints (RQ-52):**
  - *City Council Districts (GeoJSON):* `https://data.detroitmi.gov/resource/wwhw-k27h.geojson`
  - *Improve Detroit 311 Issues (Recent):* `https://data.detroitmi.gov/resource/fwz3-w3yn.json?$limit=20&$order=created_at%20DESC`
  - *Blight Violations:* `https://data.detroitmi.gov/resource/s7hj-n87v.json?$limit=25`
- **Verify-Before-Integration:** None. Gold standard municipal open data portal.

##### 4. State of Michigan Open Data (data.michigan.gov)
- **Source Name & URL:** State of Michigan Department of Technology, Management & Budget (DTMB) | [data.michigan.gov](https://data.michigan.gov)
- **Data Provided:** Statewide datasets across health, transportation, licensing, environment, and state workforce demographics.
- **Access Method:** Socrata SODA REST API.
- **Authentication:** None required (App Token optional).
- **Update Frequency:** Monthly / Quarterly depending on state agency.
- **Rate Limits:** Standard Socrata limits.
- **Cost:** Free ($0).
- **Data Format:** JSON, GeoJSON, CSV.
- **Documentation Quality:** Good.
- **Recommended For:** Statewide contextual datasets (e.g., MDOT highway infrastructure, state licensing directories).
- **Verify-Before-Integration:** None.

##### 5. Wayne County Open Data (ArcGIS Hub)
- **Source Name & URL:** Wayne County Department of Technology | [waynecounty.com](https://www.waynecounty.com) | [data-waynecounty.opendata.arcgis.com](https://data-waynecounty.opendata.arcgis.com)
- **Data Provided:** County Commission districts (15 commission seats), county boundaries, county parks, parcel assessment maps, and county financial statements.
- **Access Method:** Esri ArcGIS REST Services Directory and GeoJSON downloads.
- **Authentication:** None.
- **Update Frequency:** Periodic annual updates.
- **Rate Limits:** Standard Esri ArcGIS Hub serving.
- **Cost:** Free ($0).
- **Data Format:** GeoJSON, Shapefile, Feature Service REST.
- **Documentation Quality:** Good spatial service docs.
- **Recommended For:** Rendering Wayne County Commissioner district boundaries and county park locations.
- **Verify-Before-Integration:** None.

##### 6. Detroit Local Journalism Feeds (BridgeDetroit, Free Press, News)
- **Source Name & URL:** BridgeDetroit | [bridgedetroit.com](https://www.bridgedetroit.com), Detroit Free Press | [freep.com](https://www.freep.com), The Detroit News | [detroitnews.com](https://www.detroitnews.com), Michigan Public (NPR) | [michiganpublic.org](https://www.michiganpublic.org)
- **Data Provided:** Local news headlines, investigative reports, City Hall coverage, neighborhood developments, and school board updates.
- **Access Method:** RSS 2.0 XML syndication feeds.
- **Authentication:** None.
- **Update Frequency:** Real-Time / Hourly.
- **Rate Limits:** Standard web traffic.
- **Cost:** Free ($0 / Public RSS).
- **Data Format:** RSS (XML).
- **Documentation Quality:** Fair (Standard RSS feeds).
- **Recommended For:** Populating a dedicated 'Detroit Local News' headline feed in the mobile app.
- **Example Feed URLs (RQ-56):**
  - *BridgeDetroit Civic Feed:* `https://www.bridgedetroit.com/feed/`
  - *Detroit Free Press News:* `https://rssfeeds.freep.com/freep/news`
  - *Michigan Public News:* `https://www.michiganpublic.org/rss.xml`
- **Verify-Before-Integration:** Use only title, date, thumbnail, and outbound link to maintain compliance with publisher terms.