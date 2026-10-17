### Category 2: Congressional Activity

#### Narrative: The Congressional Data Ecosystem

The technological backbone of legislative data has undergone a historic transition over the past several years. Historically, civic developers relied heavily on the Sunlight Foundation's Congress API and later the **ProPublica Congress API** (which inherited Sunlight's codebase). While ProPublica was instrumental in civic technology, its reliance on custom web scrapers led to sporadic maintenance issues and lag during high-intensity floor sessions. Today, the **official Congress.gov API (Version 3)**, developed and maintained directly by the Library of Congress in partnership with the Clerk of the House, the Secretary of the Senate, and the Government Publishing Office (GPO), is the definitive, authoritative production standard. Powered by `api.data.gov`, it delivers canonical structured JSON feeds for bills, resolutions, committee hearings, roll-call votes, floor actions, member biographies, and the daily Congressional Record.

For static and quasi-static metadata—such as member social media accounts, cross-platform biographical identifiers (Bioguide ID, GovTrack ID, OpenSecrets ID, VoteSmart ID), and district office locations—the open-source **`unitedstates/congress`** community repository on GitHub remains the gold standard utilized across civic tech, media organizations, and academic researchers.

| DATA POINT | DESCRIPTION | PRIMARY SOURCE | SOURCE URL | API AVAILABLE | API TYPE | AUTH REQUIRED | UPDATE FREQUENCY | COST | NOTES |
| :--- | :--- | :--- | :--- | :---: | :--- | :---: | :--- | :--- | :--- |
| Active Legislation / Bills | Metadata for all bills and resolutions introduced in the House and Senate (H.R., S., H.J.Res., etc.). | Congress.gov API v3 | https://api.congress.gov/v3/bill | Yes | REST / JSON / XML | api.data.gov Key | Continuous during legislative session | Free | Includes title, sponsor, committees, CRS policy area, and latest major action. |
| Legislative Pipeline & Status | Chronological log of legislative actions, committee referrals, floor debates, and presidential signature. | Congress.gov API v3 | https://api.congress.gov/v3/bill/{congress}/{type}/{number}/actions | Yes | REST / JSON / XML | api.data.gov Key | Near-Real-Time (15-60 min poll) | Free | Tracks step-by-step progress from introduction to public law enactment. |
| Bill Full Text | Complete statutory text of introduced, reported, engrossed, and enrolled bill versions. | Congress.gov API v3 & GovInfo | https://api.congress.gov/v3/bill/{congress}/{type}/{number}/text | Yes | REST / JSON / XML / PDF | api.data.gov Key | Within 24-48 hrs of introduction | Free | Delivers formatted HTML, plain text, and official GPO authenticated PDF. |
| House Roll-Call Votes | Individual member voting records (Yea, Nay, Present, Not Voting) on all recorded House floor votes. | Clerk of the House / Congress.gov API | https://clerk.house.gov/Votes | Yes | REST / XML / JSON | None (House Clerk) / api.data.gov | Immediate upon vote gavel (10-30 min) | Free | House Clerk publishes raw XML immediately at clerk.house.gov/evs; Congress.gov aggregates. |
| Senate Roll-Call Votes | Individual senator voting records on nominations, treaty ratifications, amendments, and final passage. | US Senate Official Web Feeds | https://www.senate.gov/legislative/votes_new.htm | Yes | REST / XML | None | Immediate upon vote gavel (15-30 min) | Free | Official XML feeds published per vote: senate.gov/legislative/LIS/roll_call_votes/vote{congress}{session}/vote_{congress}_{session}_{vote_no}.xml |
| Committee Hearings & Markups | Scheduled and past hearings, witness lists, committee reports, and hearing transcripts. | Congress.gov API v3 | https://api.congress.gov/v3/hearing | Yes | REST / JSON / XML | api.data.gov Key | Daily / Continuous updates | Free | Essential for tracking policy deliberations prior to floor scheduling. |
| House & Senate Floor Schedules | Daily and weekly legislative calendar of bills scheduled for consideration under suspension or rule. | House Majority Leader & Senate Floor | https://www.majorityleader.gov / https://www.democrats.senate.gov | Partial | Web / RSS / ICS Calendar | None | Daily / Weekly during session | Free | House publishes weekly schedule PDFs and RSS; Senate publishes Executive and Legislative Calendars. |
| Member Profiles & Biographies | Roster of current and historical senators and representatives, terms, state, district, party, leadership. | Congress.gov API & unitedstates/congress | https://api.congress.gov/v3/member | Yes | REST / JSON / YAML | api.data.gov / None (GitHub) | Continuous / Cycle changes | Free | unitedstates/congress YAML provides social handles, photo URLs, and district office addresses. |
| Member Voting Records & Co-Sponsorship | Aggregated voting history, sponsored bills, co-sponsored bills, and party loyalty statistics. | Congress.gov API & GovTrack | https://www.govtrack.us/api/v2/person | Yes | REST / JSON | None | Daily sync | Free | GovTrack calculates member ideology scores (left-to-right spectrum) and leadership metrics. |
| Congressional Record (Daily Edition) | Official daily verbatim transcript of floor proceedings in the House, Senate, and Extensions of Remarks. | Congress.gov API v3 / GovInfo | https://api.congress.gov/v3/daily-congressional-record | Yes | REST / JSON / PDF | api.data.gov Key | Daily (morning after proceedings) | Free | Text searchable issues indexed by volume, issue number, and date. |


#### Datasheets: Congressional Activity Sources

##### 1. Congress.gov API (Version 3)
- **Source Name & URL:** Library of Congress — Congress.gov API v3 | [api.congress.gov](https://api.congress.gov)
- **Data Provided:** Complete coverage of federal legislative activity: bills, amendments, summaries (CRS), actions, full text, cosponsors, committee reports, nominations, treaties, committee hearings, member profiles, and the Congressional Record.
- **Access Method:** RESTful HTTP GET API.
- **Authentication:** `api.data.gov` API key passed via query parameter `?api_key=` or HTTP header `X-Api-Key`.
- **Update Frequency:** Continuous during active legislative sessions (actions indexed within minutes to hours; text within 24-48 hours).
- **Rate Limits:** 1,000 requests per hour per API key default. Developers can request rate limit increases for production mobile apps from `api.data.gov` support.
- **Cost:** Free ($0).
- **Data Format:** JSON (default), XML.
- **Documentation Quality:** Excellent. Comprehensive OpenAPI/Swagger UI, complete endpoint schemas, and active changelog.
- **Recommended For:** The premier production backbone for all federal legislative tracking, bill details, and member directories.
- **Example API Endpoints:**
  - *List bills in 119th Congress:* `https://api.congress.gov/v3/bill/119?api_key={KEY}&format=json`
  - *Bill actions & status:* `https://api.congress.gov/v3/bill/119/hr/1/actions?api_key={KEY}&format=json`
  - *Member profile by Bioguide ID:* `https://api.congress.gov/v3/member/S001150?api_key={KEY}&format=json`
- **Verify-Before-Integration:** None. Official government platform.

##### 2. unitedstates/congress (Civic Tech Open Source)
- **Source Name & URL:** `@unitedstates` Civic Project | [github.com/unitedstates/congress](https://github.com/unitedstates/congress) and [github.com/unitedstates/congress-legislators](https://github.com/unitedstates/congress-legislators)
- **Data Provided:** YAML, JSON, and CSV datasets containing comprehensive metadata for every member of Congress since 1789: bioguide ID, official names, nicknames, birthday, gender, party history, terms, committee assignments, leadership roles, official social media handles (Twitter/X, Facebook, YouTube, Instagram), district offices (phone, address, coordinates), and cross-walk IDs (GovTrack, OpenSecrets, VoteSmart, ICPSR).
- **Access Method:** Git clone, GitHub raw content HTTP GET, or pre-packaged local JSON.
- **Authentication:** None. Public GitHub repository.
- **Update Frequency:** Updated continuously via automated GitHub Actions and community PRs (within hours of member appointments or seat vacancies).
- **Rate Limits:** GitHub raw content limits (5,000 requests/hour unauthenticated; easily cached locally).
- **Cost:** Free ($0 / Public Domain / CC0).
- **Data Format:** YAML, JSON, CSV.
- **Documentation Quality:** Excellent. Clear schema definitions and data validation scripts.
- **Recommended For:** Bundling static member biographical datasets and cross-identifier mapping into the mobile app bundle, reducing runtime API calls.
- **Example Download URL:** `https://raw.githubusercontent.com/unitedstates/congress-legislators/main/legislators-current.yaml`
- **Verify-Before-Integration:** None. Standard civic-tech dependency.

##### 3. GovTrack.us API & Data Feeds
- **Source Name & URL:** Civic Impulse LLC (Josh Tauberer) | [govtrack.us/developers](https://www.govtrack.us/developers)
- **Data Provided:** REST endpoints for bills, roll-call votes, members of Congress, committee memberships, legislative subject terms, and proprietary ideological analysis (left-right political ideology scores, leadership ranks).
- **Access Method:** RESTful HTTP GET API and bulk rsync server (`rsync://govtrack.us::govtrackdata`).
- **Authentication:** None required for public API.
- **Update Frequency:** Daily to hourly sync.
- **Rate Limits:** Soft limit of ~60 requests per minute; heavy consumers encouraged to rsync bulk files.
- **Cost:** Free ($0 / Open Data).
- **Data Format:** JSON.
- **Documentation Quality:** Good. Complete list of models and field definitions.
- **Recommended For:** Member ideological scorecards (e.g. 'Ideology: Progressive / Moderate / Conservative rank') and legacy vote visualizations.
- **Example API Endpoints:**
  - *Recent Roll-Call Votes:* `https://www.govtrack.us/api/v2/vote/?order_by=-created&limit=10`
  - *Member ideological score:* `https://www.govtrack.us/api/v2/person/400326`
- **Verify-Before-Integration:** Note that GovTrack primary bulk data is hosted on rsync; for mobile REST apps, use Congress.gov for primary pipelines and GovTrack for analytics.

##### 4. Clerk of the U.S. House of Representatives (Live Electronic Voting)
- **Source Name & URL:** Office of the Clerk, US House of Representatives | [clerk.house.gov/Votes](https://clerk.house.gov/Votes)
- **Data Provided:** Authoritative XML data for every recorded electronic vote (roll-call vote) on the House floor: question, result, vote total, and individual member votes.
- **Access Method:** Direct HTTP GET of structured XML files.
- **Authentication:** None. Open web server.
- **Update Frequency:** Real-Time / Immediate. Published within 5-10 minutes of the House voting machine closing.
- **Rate Limits:** Standard web traffic.
- **Cost:** Free ($0).
- **Data Format:** XML.
- **Documentation Quality:** Fair. Documented via XML DTD.
- **Recommended For:** Ultra-fresh House roll-call vote results during active session days before third-party aggregators index them.
- **Example Data URL:** `https://clerk.house.gov/evs/{YEAR}/roll{VOTE_NUMBER}.xml` (e.g., `https://clerk.house.gov/evs/2026/roll045.xml`)
- **Verify-Before-Integration:** URL directory pattern increments by calendar year.

##### 5. U.S. Senate Roll-Call Vote Feeds
- **Source Name & URL:** Secretary of the Senate | [senate.gov/legislative/votes_new.htm](https://www.senate.gov/legislative/votes_new.htm)
- **Data Provided:** Structured XML files for all Senate roll-call votes in the current Congress: bill number, nomination ID, question, result, tie-breaker (Vice President vote), and individual senator roll calls.
- **Access Method:** Direct HTTP GET.
- **Authentication:** None.
- **Update Frequency:** Real-Time / Immediate (published within 15-30 minutes of vote conclusion).
- **Rate Limits:** Standard web server.
- **Cost:** Free ($0).
- **Data Format:** XML.
- **Documentation Quality:** Good. Predictable URL schema and standard XML structure.
- **Recommended For:** Authoritative raw Senate roll-call vote tracking, especially for presidential executive nominations and judicial confirmations.
- **Example Data URL:** `https://www.senate.gov/legislative/LIS/roll_call_votes/vote1191/vote_119_1_00085.xml`
- **Verify-Before-Integration:** URL paths use Congress number and session number (`vote1191` = 119th Congress, 1st Session).

##### 6. LegiScan API (Commercial Multi-Jurisdictional)
- **Source Name & URL:** LegiScan LLC | [legiscan.com/legiscan](https://legiscan.com/legiscan)
- **Data Provided:** Unified API covering the US Congress and all 50 state legislatures (including Michigan): bill tracking, full bill text, roll-call votes, sponsor lists, and bill change alerts.
- **Access Method:** RESTful HTTP GET / POST API.
- **Authentication:** API Key required.
- **Update Frequency:** Daily for free tier; near-real-time push for paid tiers.
- **Rate Limits & Cost:**
  - *Registered Free Tier:* 30,000 query operations per month, 1 query per second. Non-commercial use.
  - *Government/Commercial Tiers:* $15/month (standard single-state) to $500+/month (national commercial redistributor license).
- **Data Format:** JSON, Base64-encoded PDF/DOCX for bill texts.
- **Documentation Quality:** Excellent. Clean documentation with language SDKs (Python, PHP, Node.js).
- **Recommended For:** Future scale if the app expands to cross-state legislative comparison (e.g. comparing Michigan bills with federal bills). For 2-week MVP, Congress.gov API is superior and free.
- **Verify-Before-Integration:** Check commercial license terms if monetizing the mobile app.

#### ProPublica Congress API Maintenance Status Audit (RQ-06)

A critical issue for civic app developers is the current viability of the **ProPublica Congress API**. Over the 2016-2022 era, ProPublica was the de-facto developer standard. However, an audit of the service indicates that:
1. **Transition to Congress.gov API v3:** In September 2022, the Library of Congress released its official Congress.gov API v3. As official primary-source endpoints became available, ProPublica shifted developer resources away from active maintenance of its scraping infrastructure.
2. **Current Operational Status:** The ProPublica endpoints at `api.propublica.org/congress/v1/` remain nominally online for legacy applications, but have suffered from unannounced schema drifts, delayed bill action ingestion, and intermittent 502/504 errors during major congressional votes.
3. **Authoritative Recommendation:** **Do not build a new 2026 mobile app on ProPublica Congress API.** Build directly on **Congress.gov API v3**. Congress.gov is officially funded by federal appropriations, backed by GPO servers, guaranteed to be maintained indefinitely, and uses identical `api.data.gov` credentials as the FEC and GovInfo APIs.