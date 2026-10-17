## 5. Master Data Dictionary Table

The Master Data Dictionary synthesizes every distinct civic data point identified across all nine categories into a unified cross-category reference matrix, highlighting the optimal free source, the best commercial/paid alternative (if applicable), typical update cadence, and primary access methodology.

| DATA POINT | CATEGORY | BEST FREE SOURCE | BEST PAID SOURCE | UPDATE FREQ | ACCESS METHOD | NOTES |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Total Public Debt Outstanding | National Fiscal Data | Bureau of the Fiscal Service | Bloomberg / FactSet | Daily (Business Days ~4 PM ET) | REST / JSON | Authoritative 'Debt to the Penny' API. |
| Daily Treasury Statement (DTS) | National Fiscal Data | Bureau of the Fiscal Service | N/A (Public Domain) | Daily (Business Days ~4 PM ET) | REST / JSON | Operating cash balances & tax deposits. |
| Monthly Treasury Statement (MTS) | National Fiscal Data | Bureau of the Fiscal Service | N/A (Public Domain) | Monthly (8th business day) | REST / JSON | Official monthly budget deficit/surplus. |
| Federal Spending by Agency & Program | National Fiscal Data | USASpending.gov API | Govini / Deltek | Daily / Semi-weekly sync | REST / JSON | DATA Act micro-spending by account & contract. |
| Government Shutdown & CR Deadlines | National Fiscal Data | CBO Reports & Congress.gov | Bloomberg Government | Ad-hoc / Legislative Milestone | Web / PDF / API | Derived from active appropriations measures. |
| Historical Debt & Deficit Time-Series | National Fiscal Data | FRED (St. Louis Fed) | CEIC / Haver Analytics | Quarterly / Annual | REST / JSON | FRED series GFDEBTN & FYFSD. |
| CBO 10-Year Budget Baseline | National Fiscal Data | Congressional Budget Office | N/A (Public Domain) | Semi-Annual | CSV / Excel Bulk | 10-year macroeconomic & revenue forecasts. |
| Modeled Sub-Second Debt Tick | National Fiscal Data | Client Ticker Engine | US Debt Clock (Commercial) | Real-Time (60Hz loop) | Mathematical Model | Algorithmic extrapolation with user disclosure. |
| Active Legislation / Bills | Congressional Activity | Congress.gov API v3 | LegiScan / CQ Roll Call | Continuous during session | REST / JSON / XML | Full metadata for H.R., S., and resolutions. |
| Legislative Pipeline Status & Actions | Congressional Activity | Congress.gov API v3 | GovPredict / FiscalNote | Near-Real-Time (15-60 min poll) | REST / JSON | Step-by-step progress tracking to public law. |
| Bill Full Text | Congressional Activity | Congress.gov API v3 & GovInfo | Fastcase / LexisNexis | Within 24-48 hrs of intro | REST / JSON / XML / PDF | Official authenticated GPO text. |
| House Roll-Call Votes | Congressional Activity | Clerk of the House / Congress.gov | CQ Roll Call | Immediate (10-30 min) | REST / XML / JSON | Member votes (clerk.house.gov/evs). |
| Senate Roll-Call Votes | Congressional Activity | U.S. Senate Official Web Feeds | CQ Roll Call | Immediate (15-30 min) | REST / XML | Official Senate roll-call XML. |
| Committee Hearings & Markups | Congressional Activity | Congress.gov API v3 | Bloomberg Government | Daily / Continuous | REST / JSON | Schedules, witnesses, and transcripts. |
| House & Senate Floor Schedules | Congressional Activity | Majority Leader / Senate.gov | GovPredict | Daily / Weekly during session | Web / RSS / ICS | Floor agendas and suspensions. |
| Member Profiles & Biographies | Congressional Activity | Congress.gov API & unitedstates | KnowWho / Leadership Direct | Continuous / Cycle changes | REST / JSON / YAML | Bioguide IDs, offices, and social handles. |
| Member Voting Records & Ideology | Congressional Activity | GovTrack.us & Congress.gov | Voteview / DW-NOMINATE | Daily sync | REST / JSON | Member left-right ideology scores. |
| Congressional Record (Daily) | Congressional Activity | Congress.gov API v3 / GovInfo | HeinOnline | Daily (morning after) | REST / JSON / PDF | Verbatim daily floor transcripts. |
| Executive Orders (EOs) | Executive Branch | Federal Register API v1 | Westlaw / LexisNexis | Daily (~8:45 AM ET) | REST / JSON | Full text and metadata of presidential EOs. |
| Presidential Proclamations | Executive Branch | Federal Register API v1 | Westlaw / LexisNexis | Daily (~8:45 AM ET) | REST / JSON | Trade tariffs, emergencies, and designations. |
| Presidential Memoranda | Executive Branch | Federal Register API & GovInfo | N/A (Public Domain) | Daily / Continuous | REST / JSON | Compilation of Presidential Documents (CPD). |
| Federal Regulations & Final Rules | Executive Branch | Federal Register API v1 | Bloomberg Law | Daily (Business Days) | REST / JSON | Formal administrative rules by agency. |
| Public Inspection Documents | Executive Branch | Federal Register API v1 | N/A (Public Domain) | Continuous throughout day | REST / JSON | Pre-publication regulatory early warning. |
| White House Briefing Transcripts | Executive Branch | White House RSS & GovInfo | Factbase (Commercial) | Daily (1-3 hrs post-briefing) | RSS / REST | Official transcripts of press conferences. |
| Presidential Daily Public Schedule | Executive Branch | White House Press Office | Factbase | Daily (Evening prior) | RSS / Web Scrape | Official agenda of presidential meetings. |
| Cabinet Nominations & Status | Executive Branch | Congress.gov API v3 | CQ Roll Call | Continuous during session | REST / JSON | Senate confirmation status for nominees. |
| Agency Press Releases | Executive Branch | Agency Specific RSS Feeds | PR Newswire | Continuous | RSS 2.0 / Atom | DOJ, DOD, State, HHS official announcements. |
| SCOTUS Current Term Docket | Judicial — Federal Courts | CourtListener API v4 | SCOTUSblog / Westlaw | Daily / Continuous | REST / JSON | Filings, cert grants, and petition docket. |
| SCOTUS Opinions (Slip & Final) | Judicial — Federal Courts | Supreme Court RSS & CourtListener | LexisNexis / Westlaw | Immediate (~10 AM ET) | RSS / REST / PDF | Full text slip opinions on decision days. |
| SCOTUS Oral Arguments & Audio | Judicial — Federal Courts | Oyez Project / Supreme Court | Westlaw Courtroom Cast | Same-day / Weekly | JSON API / MP3 | Time-aligned word-by-word transcripts. |
| Federal Appellate & District Dockets | Judicial — Federal Courts | CourtListener API v4 | PACER ($0.10/page) | Continuous / Hourly sync | REST / JSON | Dockets across all 94 US District courts. |
| PACER Documents & Filings | Judicial — Federal Courts | RECAP Archive (Free Law Project) | PACER ($0.10/page) | Daily / Continuous | REST / JSON (PDF links) | 150M+ crowdsourced free PACER documents. |
| Federal Judge Profiles & Pipeline | Judicial — Federal Courts | CourtListener People API | Almanac of the Federal Judiciary | Weekly / Continuous | REST / JSON | Article III judge bios, nominators, vacancies. |
| Historical Case Law Precedent | Judicial — Federal Courts | Caselaw Access Project (case.law) | LexisNexis / Westlaw | Archival (1658-2020) | Bulk Parquet / AWS Open Data | Complete 360-year digitized legal corpus. |
| Congressional District Boundaries | Electoral & Political Maps | US Census TIGER/Line | Commercial GIS Providers | Decennial / Redistricting | GeoJSON / Shapefile | Post-2020 119th Congress spatial polygons. |
| Address-to-District Geocoder | Electoral & Political Maps | US Census Geocoder API | Google Geocoding API | Continuous (Quarterly) | REST / JSON | Resolves street address to district & FIPS. |
| County-Level Presidential Results | Electoral & Political Maps | MIT Election Data Lab (MEDSL) | Dave Leip's Atlas (Paid) | Quadrennial post-cert | Bulk CSV Download | Certified county results back to 1976. |
| Historical Congressional Results | Electoral & Political Maps | MIT Election Data Lab (MEDSL) | Dave Leip's Atlas (Paid) | Biennial post-cert | Bulk CSV Download | Certified House & Senate results back to 1976. |
| Precinct-Level Certified Returns | Electoral & Political Maps | OpenElections Project | L2 Political / Catalist | Continuous as parsed | GitHub Bulk CSV | Granular certified precinct returns. |
| Partisan Lean & Race Ratings | Electoral & Political Maps | Sabato's Crystal Ball | Cook Political Report ($350+) | Weekly during election | Web / Academic RSS | PVI scores and competitive race ratings. |
| Live Election-Night Vote Returns | Electoral & Political Maps | State SOS Portals (Post-Gavel) | Decision Desk HQ / AP | Real-Time on Election Night | WebSocket / REST | Sub-minute precinct counts (Commercial). |
| Demographic Census Overlays | Electoral & Political Maps | US Census Bureau ACS API | Esri Demographics | Annual (ACS 1-Yr / 5-Yr) | REST / JSON | Income, race, and education demographics. |
| Elected Officials by Address | Voter & Ballot Information | Google Civic Information API | Cicero (Carrot Creative) | Continuous / Post-Election | REST / JSON | Representatives across federal, state, local. |
| Polling Place & Early Voting | Voter & Ballot Information | Google Civic (VIP) / State SOS | Democracy Works VIP | Active 2-4 wks pre-election | REST / JSON | Physical polling locations and hours. |
| Sample Ballot by Address | Voter & Ballot Information | Ballotpedia API | Ballotpedia Commercial | Cycle-dependent | REST / JSON | Down-ballot contests and candidate slates. |
| Ballot Measures & Initiatives | Voter & Ballot Information | Ballotpedia | Ballotpedia Commercial | Continuous as certified | REST / JSON / Web | Citizen initiatives, tax millages, amendments. |
| Voter Registration Check | Voter & Ballot Information | Vote.org Partner API / SOS | TargetSmart / L2 | Real-Time / Daily | REST / Webview | State voter registry status verification. |
| Online Voter Registration Form | Voter & Ballot Information | Vote.org Developer Tools | Commercial Civic Tech | Continuous | REST API / Embed Widget | Pre-fills compliant state registration forms. |
| Absentee Ballot Application | Voter & Ballot Information | Michigan SOS (MVIC) / Vote.org | Commercial Civic Tech | Continuous | Web Portal / Widget | Absentee ballot requests under state laws. |
| Election Statutory Deadlines | Voter & Ballot Information | U.S. Vote Foundation | Commercial Civic Calendars | Annual / Biennial | REST / JSON / Bulk | Registration cutoffs and mail deadlines. |
| Candidate Financial Summaries | Campaign Finance | FEC Open API v1 | OpenSecrets Commercial | Nightly / Post-Deadline | REST / JSON | Total receipts, outlays, cash-on-hand. |
| PAC & Super PAC Filings | Campaign Finance | FEC Open API v1 | OpenSecrets Commercial | Nightly / Monthly | REST / JSON | Committee profiles and total receipts. |
| Independent Expenditures (Ads) | Campaign Finance | FEC Open API (Schedule E) | OpenSecrets Commercial | Within 24-48 hrs of spending | REST / JSON | Super PAC ad buys supporting/opposing candidates. |
| Itemized Individual Contributions | Campaign Finance | FEC Open API (Schedule A) | Aristotle / TargetSmart | Daily processing | REST / JSON & Bulk ZIP | Donations over $200 with employer info. |
| Industry & Sector Donor Breakdown | Campaign Finance | OpenSecrets API (Free Tier) | OpenSecrets Commercial | Quarterly post-filing | REST / JSON | Donors categorized by economic industry. |
| Federal Lobbying Filings (LD-2) | Campaign Finance | U.S. Senate LDA API | LobbyingData.com | Quarterly deadlines | REST / JSON | Corporate lobbying issues, expenses, bills. |
| Lobbyist Contributions (LD-203) | Campaign Finance | U.S. Senate LDA API | LobbyingData.com | Semi-Annual (Jan / Jul) | REST / JSON | Personal campaign donations by lobbyists. |
| Dark Money / 501(c)(4) Filings | Campaign Finance | ProPublica Nonprofits API | GuideStar / Candid | Annual (post-IRS) | REST / JSON & AWS Open | IRS Form 990 financials for 501(c)(4) groups. |
| State Campaign Finance (Michigan) | Campaign Finance | Michigan SOS MERTS / FollowTheMoney | OpenSecrets State | Quarterly / Tri-annual | Bulk Download / REST | State-level gubernatorial & legislative funds. |
| Global News Volume by Keyword | News & Public Sentiment | GDELT Project 2.0 (DOC API) | Meltwater / Brandwatch | Every 15 Minutes | REST / JSON | Worldwide volume trends on political topics. |
| News Tone & Sentiment Score | News & Public Sentiment | GDELT Project 2.0 (DOC API) | Aylien / Event Registry | Every 15 Minutes | REST / JSON | Emotional valence (-10 to +10 polarity). |
| Political News Headlines & Links | News & Public Sentiment | NewsAPI.org (Dev Tier) | NewsAPI Commercial ($449+) | Continuous (15-min to hr) | REST / JSON | Headlines, snippets, and publisher URLs. |
| Fact-Check Ratings (ClaimReview) | News & Public Sentiment | Google Fact Check Tools API | Full Fact Automated | Continuous | REST / JSON | Schema.org ClaimReview debunks. |
| Public Opinion & Polling Trends | News & Public Sentiment | Pew Research Center | Gallup Analytics (Paid) | Monthly / Survey-dependent | Bulk CSV / SPSS | Nonpartisan scientific survey baselines. |
| Media Attention Frequency Index | News & Public Sentiment | MediaCloud API v4 | Cision / Meltwater | Daily / Weekly sync | REST / JSON | Media attention framing across news sources. |
| Social Media Civic Discussion | News & Public Sentiment | Reddit Public JSON API | X (Twitter) Enterprise API | Real-Time | REST / JSON | Organic citizen discussion threads. |
| Michigan State Legislative Bills | Michigan / Detroit Local | OpenStates v3 | LegiScan Commercial | Daily during session | REST / GraphQL | State Senate & House bills and pipelines. |
| Michigan Roll-Call Floor Votes | Michigan / Detroit Local | OpenStates v3 | LegiScan Commercial | Daily post-session | REST / GraphQL | Individual state senator/representative votes. |
| Michigan Governor Executive Orders | Michigan / Detroit Local | State of Michigan Executive Office | N/A (Public Domain) | Immediate upon issuance | Web Scrape / RSS | Executive Directives and Orders from Whitmer. |
| Michigan Supreme Court Dockets | Michigan / Detroit Local | Michigan Courts Portal | CourtListener / Westlaw | Daily | Web / RSS | State high court opinions and oral arguments. |
| Detroit City Council Districts | Michigan / Detroit Local | City of Detroit Open Data (SODA) | Esri ArcGIS Hub | Annual / Post-Redistricting | REST / SODA (GeoJSON) | Spatial boundaries for 7 council districts. |
| Detroit City Council Legislation | Michigan / Detroit Local | Detroit City Clerk / Legistar | N/A (Public Domain) | Weekly during session | Web Portal (Legistar) | City ordinances, resolutions, voting records. |
| Detroit Municipal Budget & Checkbook | Michigan / Detroit Local | City of Detroit Open Data (SODA) | OpenGov (Municipal) | Monthly / Fiscal Year | REST / SODA (JSON) | Departmental allocations and city checks. |
| Detroit 311 Citizen Service Issues | Michigan / Detroit Local | City of Detroit Open Data (SODA) | CitySourced / SeeClickFix | Daily sync | REST / SODA (JSON) | 'Improve Detroit' pothole and blight tickets. |
| Wayne County Commission Districts | Michigan / Detroit Local | Wayne County Open Data | N/A (Public Domain) | Periodic | REST / ArcGIS Feature | County commission seats and parcel data. |
| Detroit Local News Feeds | Michigan / Detroit Local | BridgeDetroit & Free Press RSS | NewsAPI Local | Real-Time / Hourly | RSS 2.0 / Atom | Local civic journalism feeds. |


## 6. Integration Complexity Ranking

To assist solo developers and engineering leads in prioritizing implementation order during a 2-week sprint, every inventoried data source has been evaluated and ranked by **Integration Complexity**: **Easy**, **Medium**, or **Hard**.

- **Easy:** Modern REST/JSON APIs with no API key or instant key provisioning, clear documentation, predictable schemas, and generous rate limits.

- **Medium:** Requires structured query formatting (e.g. faceted POST bodies, GraphQL, or complex query parameters), multi-step authentication, strict rate limits requiring client caching, or parsing predictable XML/RSS.

- **Hard:** Requires custom HTML web scraping, heavy GIS polygon processing, large bulk file ingestion, unannounced schema shifts, or enterprise sales agreements.

| SOURCE | CATEGORY | COMPLEXITY | RATIONALE | KEY RISK & MITIGATION |
| :--- | :--- | :---: | :--- | :--- |
| Bureau of the Fiscal Service (API) | National Fiscal Data | Easy | Zero-auth, highly standardized REST/JSON, simple URL parameters. | Risk: Daily batch lag. Mitigation: Inform users of ~4 PM ET update. |
| USASpending.gov API | National Fiscal Data | Medium | Requires faceted JSON POST requests for nested spending queries. | Risk: Complex schema. Mitigation: Use simplified top-tier agency endpoint. |
| FRED API (St. Louis Fed) | National Fiscal Data | Easy | Instant free API key, standard REST time-series observations. | Risk: Series ID changes. Mitigation: Hardcode stable series (GFDEBTN). |
| CBO Budget Baselines | National Fiscal Data | Hard | No REST API; published as semi-annual Excel workbooks and PDFs. | Risk: Manual parsing. Mitigation: Extract static JSON baselines once. |
| OMB Historical Tables | National Fiscal Data | Hard | Static Excel spreadsheet download; no automated REST API. | Risk: File path shifts. Mitigation: Bundle static JSON in app bundle. |
| Congress.gov API v3 | Congressional Activity | Easy | Unified api.data.gov key, clean REST endpoints, Swagger UI. | Risk: 1,000 req/hr cap. Mitigation: Implement local SQLite caching. |
| unitedstates/congress (GitHub) | Congressional Activity | Easy | Clean YAML/JSON files, zero auth, stable schemas. | Risk: GitHub raw rate limits. Mitigation: Bundle YAML directly into app. |
| GovTrack.us API | Congressional Activity | Easy | Open REST/JSON API, intuitive models, zero auth. | Risk: Primary focus is bulk rsync. Mitigation: Use for ideology scores only. |
| Clerk of the House (Live XML) | Congressional Activity | Medium | Requires parsing live XML files during active floor sessions. | Risk: XML schema variations. Mitigation: Use standard xml2js parser. |
| U.S. Senate Roll-Call Feeds | Congressional Activity | Medium | Raw XML files structured by Congress and session number. | Risk: Session path increments. Mitigation: Compute session formula dynamically. |
| LegiScan API | Congressional Activity | Medium | Clean API, but 30k monthly call limit and paid commercial terms. | Risk: Exceeding free quota. Mitigation: Defer to post-MVP for multi-state. |
| Federal Register API v1 | Executive Branch | Easy | Zero auth, highly reliable REST/JSON, simple document filters. | Risk: Large response payloads. Mitigation: Use `fields[]` param. |
| GovInfo.gov API | Executive Branch | Easy | Unified api.data.gov key, standardized GPO document package IDs. | Risk: Deep package hierarchy. Mitigation: Query summary endpoints. |
| White House Official RSS | Executive Branch | Easy | Standard RSS 2.0 XML syndication; zero auth. | Risk: Administration taxonomy shifts. Mitigation: Test slug endpoints periodically. |
| Regulations.gov API v4 | Executive Branch | Medium | api.data.gov key; complex query filters for public comments. | Risk: High comment volumes. Mitigation: Limit search to top-level dockets. |
| CourtListener API v4 | Judicial — Federal Courts | Medium | Free token auth, extensive REST models, webhook push capability. | Risk: 5,000 req/hr limit. Mitigation: Cache dockets; use webhooks. |
| Supreme Court RSS Feeds | Judicial — Federal Courts | Easy | Standard RSS 2.0 feeds for opinions and orders; zero auth. | Risk: Opinion path terms increment. Mitigation: Scrape RSS feed directly. |
| PACER Case Locator API | Judicial — Federal Courts | Hard | $0.10/page fee, credit card requirement, bureaucratic setup. | Risk: Runaway user fees. Mitigation: DO NOT connect mobile app to PACER. |
| RECAP Archive (Free Law Project) | Judicial — Federal Courts | Medium | Integrated into CourtListener API; free document PDF links. | Risk: Document coverage gaps. Mitigation: Display 'document pending' status. |
| Oyez Project API | Judicial — Federal Courts | Medium | Unofficial JSON API; rich multimedia and time-aligned audio. | Risk: API schema drift. Mitigation: Cache responses behind an app proxy. |
| Caselaw Access Project (case.law) | Judicial — Federal Courts | Hard | No longer offers active REST search; bulk Parquet on AWS Open Data. | Risk: Massive file sizes. Mitigation: Use only for offline historical analysis. |
| US Census Geocoder API | Electoral & Political Maps | Easy | Zero auth, REST GET, fast address to district conversion. | Risk: Address formatting errors. Mitigation: Standardize address string first. |
| US Census TIGER/Line Boundaries | Electoral & Political Maps | Medium | Requires converting heavy Shapefiles into mobile TopoJSON/GeoJSON. | Risk: Mobile rendering lag. Mitigation: Simplify geometry using Mapshaper. |
| MIT Election Data Lab (MEDSL) | Electoral & Political Maps | Medium | Large bulk CSV downloads from Harvard Dataverse; no REST API. | Risk: File processing overhead. Mitigation: Pre-process into SQLite database. |
| OpenElections GitHub | Electoral & Political Maps | Medium | Clean CSV files on GitHub; coverage varies by state. | Risk: Incomplete precinct data. Mitigation: Focus on certified general elections. |
| Dave Leip's Atlas | Electoral & Political Maps | Hard | Commercial paid licenses required for raw data; web visualizer. | Risk: Expensive licensing. Mitigation: Use MEDSL and OpenElections. |
| Associated Press (AP Elections) | Electoral & Political Maps | Hard | Enterprise contract ($15k-$100k+), complex B2B streaming socket. | Risk: Extreme cost. Mitigation: Exclude from 2-week bootstrapped MVP. |
| Decision Desk HQ (DDHQ) | Electoral & Political Maps | Medium | Modern REST & WebSocket API, clear docs, but commercial pricing. | Risk: Cost ($5k+). Mitigation: Target for v2 post-funding. |
| Sabato's Crystal Ball | Electoral & Political Maps | Easy | Standard web tables and RSS for nonpartisan race ratings. | Risk: Manual extraction. Mitigation: Scrape ratings weekly during cycle. |
| Google Civic Information API | Voter & Ballot Information | Easy | Google Cloud key, 25k free calls/day, clean address lookup. | Risk: `voterinfo` election window. Mitigation: Use `representatives` year-round. |
| Ballotpedia API | Voter & Ballot Information | Medium | Requires application and commercial API key; extensive models. | Risk: Approval delay. Mitigation: Apply early; use web tools in interim. |
| Vote.org Developer Embeds | Voter & Ballot Information | Easy | Zero-auth iframe widgets for registration check and forms. | Risk: Webview styling. Mitigation: Use Vote.org responsive embed URLs. |
| Voting Information Project (VIP) | Voter & Ballot Information | Hard | Raw state XML feeds; highly nested relational schema. | Risk: Parsing complexity. Mitigation: Consume VIP through Google Civic API. |
| Michigan SOS MVIC Portal | Voter & Ballot Information | Hard | Consumer web forms with anti-bot protection; no public REST API. | Risk: Scraper blocks. Mitigation: Link users directly via mobile WebView. |
| FEC Open API v1 | Campaign Finance | Easy | api.data.gov key, comprehensive endpoints, Swagger explorer. | Risk: High transaction volume. Mitigation: Query candidate `/totals/` first. |
| OpenSecrets API | Campaign Finance | Medium | Free tier limited to 200 req/day; proprietary method parameters. | Risk: Daily call cap. Mitigation: Cache industry donor profiles locally. |
| Senate LDA API | Campaign Finance | Easy | Free instant token, clean REST models, Swagger documentation. | Risk: Massive quarterly filings. Mitigation: Filter by specific client or year. |
| ProPublica Nonprofits API | Campaign Finance | Easy | Zero auth, fast JSON search for 501(c)(4) dark money filings. | Risk: IRS processing lag. Mitigation: Display filing tax year clearly. |
| FollowTheMoney API | Campaign Finance | Medium | API key required; state-by-state data harmonization nuances. | Risk: Commercial terms. Mitigation: Use for state legislative analysis. |
| GDELT Project 2.0 (DOC API) | News & Public Sentiment | Easy | Zero auth, REST GET, fast 15-minute updates, JSON output. | Risk: Complex Boolean syntax. Mitigation: Sanitize query parameters. |
| NewsAPI.org | News & Public Sentiment | Easy | Instant API key, standard REST headlines; but dev tier is delayed. | Risk: Commercial cost ($449/mo). Mitigation: Use for MVP dev; GDELT in prod. |
| Google Fact Check Tools API | News & Public Sentiment | Easy | Google Cloud key, 10k free calls/day, Schema.org ClaimReview. | Risk: Query specificity. Mitigation: Query by politician name or topic. |
| PolitiFact RSS Feeds | News & Public Sentiment | Easy | Public RSS 2.0; immediate access to latest Truth-O-Meter checks. | Risk: RSS format limits. Mitigation: Parse ClaimReview tags on articles. |
| MediaCloud API v4 | News & Public Sentiment | Medium | Requires academic registration; query syntax requires training. | Risk: Academic quota. Mitigation: Use for macro trend analysis. |
| Reddit Public JSON API | News & Public Sentiment | Easy | Append `.json` to URLs; zero auth (requires custom User-Agent). | Risk: HTTP 429 if User-Agent missing. Mitigation: Set strict User-Agent string. |
| OpenStates v3 (Michigan) | Michigan / Detroit Local | Easy | Modern REST/GraphQL, free API key, covers Michigan Legislature. | Risk: 500 req/day cap. Mitigation: Cache member and bill records locally. |
| Michigan Legislature (Portal) | Michigan / Detroit Local | Hard | ASP.NET session portal, no public REST API, bulk text tables. | Risk: Scraper maintenance. Mitigation: Rely on OpenStates for bills. |
| City of Detroit Open Data (SODA) | Michigan / Detroit Local | Easy | Zero auth SODA REST API, GeoJSON support, high uptime. | Risk: Dataset ID shifts. Mitigation: Store SODA 4x4 tokens in config. |
| State of Michigan Open Data | Michigan / Detroit Local | Easy | Standard Socrata SODA platform; zero auth for public datasets. | Risk: Dataset curation. Mitigation: Target verified state agency feeds. |
| Wayne County Open Data Hub | Michigan / Detroit Local | Medium | ArcGIS REST Feature Services; requires handling Esri JSON. | Risk: Layer ID changes. Mitigation: Query via standard GeoJSON endpoints. |