### Category 6: Voter & Ballot Information

#### Narrative: The Voter-Facing Civic Tech Ecosystem

Voter and ballot information represents the most direct civic touchpoint for citizens. The technical challenge is that election administration in the United States is decentralized across 50 states, 3,143 counties, and thousands of local municipal clerks. For year-round civic utility, the foundational tool is the **Google Civic Information API**, which maps any physical street address to the user's elected officials across federal, state, county, and municipal government tiers.

However, engineers must understand a vital operational constraint regarding **Google Civic's `voterinfo` endpoint**: it is **strictly an election-window feed**. It only surfaces polling places, early voting sites, and candidate contests within 2 to 4 weeks prior to a scheduled election when state election directors ingest data into the **Voting Information Project (VIP)**. For non-election periods and comprehensive ballot measure tracking, **Ballotpedia** maintains the most comprehensive non-partisan encyclopedia. For voter registration workflows (verifying voter registration, registering to vote, and requesting absentee ballots), **Vote.org** provides civic partner APIs and embeddable software components. At the local level, the **Michigan Secretary of State (MVIC)** operates the authoritative statewide voter registry, providing polling location and clerk contact data via web interfaces.

| DATA POINT | DESCRIPTION | PRIMARY SOURCE | SOURCE URL | API AVAILABLE | API TYPE | AUTH REQUIRED | UPDATE FREQUENCY | COST | NOTES |
| :--- | :--- | :--- | :--- | :---: | :--- | :---: | :--- | :--- | :--- |
| Elected Officials by Address | Federal, state, county, and municipal representatives representing a given physical street address. | Google Civic Information API | https://developers.google.com/civic-information | Yes | REST / JSON | Google Cloud API Key | Continuous / Post-Election Sync | Free | Endpoint: `representatives`. Highly reliable; includes office, party, phones, websites, channels. |
| Polling Place & Early Voting Locations | Physical address, hours of operation, and dates for in-person voting and drop boxes. | Google Civic Info (VIP) & Michigan SOS | https://www.googleapis.com/civicinfo/v2/voterinfo | Yes | REST / JSON | Google Cloud API Key | Active 2-4 weeks prior to election | Free | Requires active `electionId`. Powered by state election director VIP data feeds. |
| Sample Ballot & Local Contests | Complete slate of federal, state, judicial, and municipal candidates appearing on a voter's ballot. | Ballotpedia API & Google Civic | https://ballotpedia.org/api | Yes | REST / JSON | Ballotpedia API Key | Cycle-dependent updates | Commercial / Academic Grant | Ballotpedia covers down-ballot municipal and school board races not captured in federal feeds. |
| Ballot Measures & Referendums | Full text, official ballot summary, fiscal impact statements, and sponsor arguments for citizen initiatives. | Ballotpedia | https://ballotpedia.org/Ballot_Measures | Yes | REST / JSON / Web | Ballotpedia API Key | Continuous as measures qualify | Free Web / Metered API | Authoritative coverage of Michigan statewide constitutional amendments and local tax millages. |
| Voter Registration Verification | Tool allowing voters to check whether their registration is currently active in their home state. | Vote.org / Michigan SOS (MVIC) | https://www.vote.org / https://mvic.sos.state.mi.us | Yes | Partner API / Web Portal | Partner Agreement / None (Web) | Real-Time / Daily | Free (Civic Tech) | Vote.org provides embeddable check-registration widget and civic partner webhook APIs. |
| Online Voter Registration Tools | Guides voters through digital or mail-in voter registration compliance pursuant to state laws. | Vote.org Developer Tools | https://www.vote.org/technology/ | Yes | REST API & Embed Widgets | Partner API Token | Continuous | Free (Non-profit/Civic) | Generates pre-filled state registration forms and routes to state online portals. |
| Absentee / Mail-in Ballot Requests | Application workflows and deadlines for requesting mail-in ballots under Michigan's 'no-reason' absentee law. | Michigan SOS (MVIC) & Vote.org | https://mvic.sos.state.mi.us | Partial | Web Form / Portal (SOS) | None | Continuous | Free | Michigan allows registered voters to join the Permanent Absentee Ballot List online. |
| Election Deadlines & Calendars | Statutory deadlines for voter registration, mail ballot requests, early voting windows, and return cutoffs. | U.S. Vote Foundation & Vote.org | https://www.usvotefoundation.org | Yes | REST / JSON / Bulk | API Key / License | Annual / Biennial cycle updates | Free / Non-profit | Provides state-specific statutory election dates and clerk contact directories. |


#### Datasheets: Voter & Ballot Information Sources

##### 1. Google Civic Information API
- **Source Name & URL:** Google Developers | [developers.google.com/civic-information](https://developers.google.com/civic-information)
- **Data Provided:**
  - `representatives`: Returns all elected officials serving a given street address across federal (President, US Senate, US House), state (Governor, State Senator, State Representative), county (Commissioners, Sheriff), and city (Mayor, City Council) levels.
  - `voterinfo`: Returns polling locations, drop box sites, early voting sites, and ballot contests for an upcoming election.
- **Access Method:** RESTful HTTP GET API.
- **Authentication:** Google Cloud API Key passed via `key=` query parameter. Free quota enables up to 25,000 queries per day.
- **Update Frequency:** `representatives` is updated continuously post-election; `voterinfo` is populated 2-4 weeks before certified elections.
- **Rate Limits:** 25,000 requests per day free default quota (sufficient for MVP).
- **Cost:** Free ($0).
- **Data Format:** JSON.
- **Documentation Quality:** Excellent. Interactive APIs Explorer and client libraries for JavaScript, Python, Dart/Flutter.
- **Recommended For:** The foundational address-to-representatives lookup engine for the mobile app.
- **Example API Endpoints:**
  - *Representatives by Address:* `https://www.googleapis.com/civicinfo/v2/representatives?address=100+Woodward+Ave+Detroit+MI+48226&key={YOUR_GOOGLE_KEY}`
  - *Upcoming Voter Info:* `https://www.googleapis.com/civicinfo/v2/voterinfo?address={ADDRESS}&electionId={ELECTION_ID}&key={YOUR_KEY}`
- **Verify-Before-Integration (RQ-29):** Note field deprecations: Google previously deprecated direct division search (`/divisions`); use the `representatives` endpoint directly which returns Open Civic Data Division Identifiers (OCD-IDs) inside the office records.

##### 2. Ballotpedia API
- **Source Name & URL:** Ballotpedia (Lucy Burns Institute) | [ballotpedia.org/api](https://ballotpedia.org/api)
- **Data Provided:** Candidate biographies, policy stances, campaign links, full ballot measure texts, state constitutional amendments, local ballot questions, school board races, and judicial elections across all 50 states.
- **Access Method:** RESTful JSON API.
- **Authentication:** API Key required.
- **Update Frequency:** Continuous during election seasons.
- **Rate Limits:** Tier-dependent.
- **Cost:** Commercial / Enterprise. Free trial and academic/research grants available upon application; commercial redistribution licenses start at ~$500/month.
- **Data Format:** JSON.
- **Documentation Quality:** Good. Complete entity relationship models.
- **Recommended For:** Post-MVP expansion to capture down-ballot municipal races and detailed candidate survey responses.
- **Verify-Before-Integration:** `[Verify-Before-Integration]` Key provisioning requires commercial approval.

##### 3. Vote.org Developer Tools & Embed Widgets
- **Source Name & URL:** Vote.org | [vote.org/technology](https://www.vote.org/technology/)
- **Data Provided:** Embeddable software tools and API endpoints for: (1) Check Voter Registration Status, (2) Register to Vote, (3) Request Absentee Ballot, and (4) Election Reminders.
- **Access Method:** Embeddable responsive HTML5/JS iframes and Partner REST API.
- **Authentication:** Partner API Token for programmatic data transmission; zero authentication for embed widgets.
- **Update Frequency:** Real-Time synchronization with state election portals.
- **Rate Limits:** High capacity for civic partner apps.
- **Cost:** Free for 501(c)(3) non-profits and civic applications; partnership terms apply for commercial redistributors.
- **Data Format:** JSON (API), Responsive Webview (Widget).
- **Documentation Quality:** Excellent. Clean mobile-optimized components.
- **Recommended For:** Instantaneously embedding compliant voter registration and absentee request workflows in mobile WebView containers.
- **Example Embed URL:** `https://embed.vote.org/register` (clean mobile iframe).
- **Verify-Before-Integration:** Partner agreement required for headless API access.

##### 4. Voting Information Project (VIP 5.2 / 6.0)
- **Source Name & URL:** Democracy Works & Pew Charitable Trusts | [votinginfoproject.org](https://votinginfoproject.org)
- **Data Provided:** Open standard data feeds from state election officials detailing polling places, early voting locations, drop box hours, and precinct ballot contents.
- **Access Method:** VIP XML 5.2 and JSON feeds hosted on Google Cloud Storage and consumed directly by the Google Civic Information API.
- **Authentication:** Public data feeds.
- **Update Frequency:** Seasonal (pre-election).
- **Rate Limits:** Cloud storage downloads.
- **Cost:** Free ($0 / Public Domain).
- **Data Format:** VIP XML / JSON.
- **Documentation Quality:** Excellent technical specification.
- **Recommended For:** Backend engineers ingesting raw state election feeds directly without Google Civic mediation.
- **Verify-Before-Integration:** VIP feeds are generally consumed most easily via Google Civic Information API rather than raw XML parsing.

##### 5. Michigan Secretary of State — Michigan Voter Information Center (MVIC)
- **Source Name & URL:** Michigan Department of State | [mvic.sos.state.mi.us](https://mvic.sos.state.mi.us)
- **Data Provided:** Authoritative Michigan voter verification: registered voter status, precinct number, polling location address, local clerk contact info, drop box locations, tracking of requested absentee ballots, and downloadable sample ballots (PDF).
- **Access Method:** Web portal forms (HTTPS POST) and backend JSON endpoints powering the MVIC single-page application.
- **Authentication:** Web user inputs voter First Name, Last Name, Birth Month/Year, and Zip Code.
- **Update Frequency:** Daily sync with the Qualified Voter File (QVF).
- **Rate Limits:** Standard web form defense.
- **Cost:** Free ($0).
- **Data Format:** HTML, JSON, PDF (sample ballots).
- **Documentation Quality:** Sparse (governmental consumer portal; no published developer API).
- **Recommended For:** Guiding Michigan users to official state registration verification via in-app deep links or WebView.
- **Direct URL Patterns (RQ-35):**
  - *Voter Registration Search:* `https://mvic.sos.state.mi.us/Voter/Index`
  - *Clerk Directory Lookup:* `https://mvic.sos.state.mi.us/ClerkSearch/Index`
- **Verify-Before-Integration:** Direct automated POST scraping of MVIC forms is subject to anti-bot protections; recommend opening in external browser or mobile WebView.