# U.S. Civic & Legal Data Resources Data Dictionary

**Prepared:** 2026-10-17  
**Scope:** Federal, state (all 50 + DC, PR, USVI), and local (battleground/swing-state metros) resources for voter/election/ballot information, legislation/bill tracking, candidate/campaign finance, judicial/court case tracking, and U.S. Attorney/District Attorney resources.  
**Mode:** Exhaustive deep research, favoring primary government sources, then aggregators/nonprofits, then commercial data.

---

## 1. Original Request

Create a comprehensive and detailed system prompt that will conduct a sprawling search of available voter, election and ballot information resources, U.S. legislation resources and bill tracking, candidate research resources, judicial resources and court case tracking, US Attorney/District Attorney resources and tracking, across the United States, plus compilation of a data dictionary with URLs, executive summaries, availability, and developer resources, organized federal → state → local (major metros in battleground/swing states) [deep-research-handoff document](https://www.genspark.ai/api/files/s/Z6EB8aD3).

---

## 2. Clarifications and Resolved Assumptions

Based on the handoff document, the following defaults were applied because the original request did not specify them [deep-research-handoff document](https://www.genspark.ai/api/files/s/Z6EB8aD3):

| ID | Question | Default Applied |
|----|----------|-----------------|
| CQ-01 | Definition of "battleground/swing states" | AZ, CO, FL, GA, IA, ME, MI, MN, NC, NH, NV, OH, PA, WI (14 states) |
| CQ-02 | Time horizon for election data | Current cycle + historical back to 2000 where available |
| CQ-03 | Candidate research scope | Federal + statewide (Gov, AG, SoS) + state legislature; local only for battleground metros |
| CQ-04 | Court case tracking scope | Federal (SCOTUS, 13 circuits, 94 districts) + state Supreme Court + state Court of Appeals |
| CQ-05 | USAO/DA tracking scope | All 94 federal USAOs; state DAs only for battleground-state metros |
| CQ-06 | Output format | Markdown with embedded tables + JSON appendix |
| CQ-07 | Developer access vs. scraping | Official APIs/feeds/bulk downloads only; scraping marked "not recommended" |
| CQ-08 | Print/non-digital resources | Included only when authoritative (e.g., pre-1957 federal law) |
| CQ-09 | Territories | Puerto Rico and U.S. Virgin Islands included at state tier |
| CQ-10 | "Major metro" definition | Counties with MSA ≥ 250k or city ≥ 100k, plus state capital county |

**Assumption Register highlights:** One row per (resource, jurisdiction) pair; Markdown output; verification status tracked per row; primary sources prioritized over aggregators [deep-research-handoff document](https://www.genspark.ai/api/files/s/Z6EB8aD3).

---

## 3. Executive Summary

The U.S. civic and legal data ecosystem is highly fragmented, with strong federal API coverage but inconsistent state and local digital access. At the federal level, Congress.gov, GovInfo, FEC/OpenFEC, FederalRegister.gov, Regulations.gov, and the LDA lobbying API provide robust, documented programmatic access [api.congress.gov](https://api.congress.gov/), [www.govinfo.gov/developers](https://www.govinfo.gov/developers), [api.open.fec.gov](https://api.open.fec.gov/), [www.federalregister.gov/developers/documentation/api/v1](https://www.federalregister.gov/developers/documentation/api/v1), [open.gsa.gov/api/regulationsgov/](https://open.gsa.gov/api/regulationsgov/), [lda.gov/api/](https://lda.gov/api/). Court data is bifurcated: PACER charges fees ($0.10/page, $3/document cap) while CourtListener/Free Law Project offers a membership-based API alternative covering 3,359 jurisdictions [pacer.uscourts.gov/pacer-pricing-how-fees-work](https://pacer.uscourts.gov/pacer-pricing-how-fees-work), [free.law/2026/05/07/api-included-in-memberships/](https://free.law/2026/05/07/api-included-in-memberships/), [www.courtlistener.com/help/api/jurisdictions/](https://www.courtlistener.com/help/api/jurisdictions/). Harvard's Caselaw Access Project provides bulk historical case law [case.law](https://case.law/).

Campaign finance data at the federal level flows through OpenFEC, but OpenSecrets discontinued its public API on April 15, 2025, moving to commercial/custom solutions [www.opensecrets.org/open-data/api](https://www.opensecrets.org/open-data/api). State-level finance data is accessible via FollowTheMoney (free API with registration, data current through 2024) [www.followthemoney.org/our-data/apis/](https://www.followthemoney.org/our-data/apis/). Legislative tracking is well-served by LegiScan (free tier up to 30k queries/month, paid tiers for higher volume/push updates) and Open States API v3 for state legislatures [legiscan.com/legiscan](https://legiscan.com/legiscan), [docs.openstates.org/api-v3/](https://docs.openstates.org/api-v3/).

Election administration data is the most uneven tier. The EAC's EAVS survey covers all states/territories but is published biennially with lag [www.eac.gov/research-and-data/studies-and-reports](https://www.eac.gov/research-and-data/studies-and-reports). MIT Election Lab and civicAPI offer historical and live results respectively [electionlab.mit.edu/data](https://electionlab.mit.edu/data), [civicapi.org/](https://civicapi.org/). Democracy Works and the AP Elections API provide commercial-grade election data infrastructure [www.democracy.works/elections-api](https://www.democracy.works/elections-api), [developer.ap.org/ap-elections-api/](https://developer.ap.org/ap-elections-api/). Several states (Michigan, California, Pennsylvania) offer voter registration APIs to trusted third parties, but most states provide only web forms or bulk file downloads without APIs [www.michigan.gov/sos/faqs/elections-and-campaign-finance/register-to-vote](https://www.michigan.gov/sos/faqs/elections-and-campaign-finance/register-to-vote), [electioninnovation.org/update/online-voter-registration-apis-a-new-trend/](https://electioninnovation.org/update/online-voter-registration-apis-a-new-trend/), [www.pa.gov/agencies/dos/resources/voting-and-elections-resources/pa-online-voter-registration-web-api-rfc](https://www.pa.gov/agencies/dos/resources/voting-and-elections-resources/pa-online-voter-registration-web-api-rfc). The Google Civic Information API shutdown (April 30, 2025) created a notable gap, partially filled by USgeocoder and VoteAmerica Plus [crawlify.ai/insights/civic-data-gap-google-civic-api-shutdown](https://crawlify.ai/insights/civic-data-gap-google-civic-api-shutdown), [blog.usgeocoder.com/looking-for-a-google-civic-api-alternative-discover-usgeocoder-api/](https://blog.usgeocoder.com/looking-for-a-google-civic-api-alternative-discover-usgeocoder-api/), [voteamericaplus.org/civic-data-api/](https://voteamericaplus.org/civic-data-api/).

At the local level, no standardized API exists; county election boards typically publish results via HTML dashboards or PDFs, with RSS feeds for press releases being the most common programmatic access point for DA/USAO offices [www.justice.gov/usao/rss](https://www.justice.gov/usao/rss). Ballotpedia sells data via API or bulk files but does not publish pricing publicly [ballotpedia.org/Ballotpedia:Buy_Political_Data](https://ballotpedia.org/Ballotpedia:Buy_Political_Data).

---

## 4. Key Findings

1. **Federal APIs are mature and well-documented** — Congress.gov, GovInfo, OpenFEC, FederalRegister.gov, Regulations.gov, and LDA all offer documented REST APIs with API key authentication [api.congress.gov](https://api.congress.gov/), [www.govinfo.gov/developers](https://www.govinfo.gov/developers), [api.open.fec.gov](https://api.open.fec.gov/), [www.federalregister.gov/developers/documentation/api/v1](https://www.federalregister.gov/developers/documentation/api/v1), [open.gsa.gov/api/regulationsgov/](https://open.gsa.gov/api/regulationsgov/), [lda.gov/api/](https://lda.gov/api/).

2. **OpenSecrets API discontinued April 15, 2025** — A major gap for money-in-politics data; replaced by commercial/custom arrangements [www.opensecrets.org/open-data/api](https://www.opensecrets.org/open-data/api).

3. **ProPublica Congress API and Represent API are discontinued** — Archived as of 2025, leaving Congress.gov API as the primary federal legislative source [projects.propublica.org/represent/](https://projects.propublica.org/represent/), [projects.propublica.org/api-docs/congress-api/](https://projects.propublica.org/api-docs/congress-api/).

4. **Google Civic Information API shut down April 30, 2025** — Representatives service retired; replacements include USgeocoder, VoteAmerica Plus, and Democracy Works [crawlify.ai/insights/civic-data-gap-google-civic-api-shutdown](https://crawlify.ai/insights/civic-data-gap-google-civic-api-shutdown), [support.picnet.net/hc/en-us/articles/25130331666459](https://support.picnet.net/hc/en-us/articles/25130331666459), [voteamericaplus.org/civic-data-api/](https://voteamericaplus.org/civic-data-api/).

5. **CourtListener API now requires membership** (as of May 7, 2026) — Free tier limited to 5 requests/minute; paid tiers start at $10/month [free.law/2026/05/07/api-included-in-memberships/](https://free.law/2026/05/07/api-included-in-memberships/), [github.com/api-evangelist/court-listener](https://github.com/api-evangelist/court-listener).

6. **PACER remains paywalled** — $0.10/page, $3/document max, with fee exemptions for indigents, academics, and non-profits [pacer.uscourts.gov/pacer-pricing-how-fees-work](https://pacer.uscourts.gov/pacer-pricing-how-fees-work).

7. **State voter registration APIs are rare** — Only a handful of states (Michigan, California, Pennsylvania, Virginia, Colorado, Washington, Nevada) offer APIs or custom links for trusted third-party registration [www.michigan.gov/sos/faqs/elections-and-campaign-finance/register-to-vote](https://www.michigan.gov/sos/faqs/elections-and-campaign-finance/register-to-vote), [electioninnovation.org/update/online-voter-registration-apis-a-new-trend/](https://electioninnovation.org/update/online-voter-registration-apis-a-new-trend/), [www.pa.gov/agencies/dos/resources/voting-and-elections-resources/pa-online-voter-registration-web-api-rfc](https://www.pa.gov/agencies/dos/resources/voting-and-elections-resources/pa-online-voter-registration-web-api-rfc).

8. **LegiScan and Open States dominate state legislative data** — LegiScan offers free/paid tiers covering all 50 states + Congress; Open States API v3 covers jurisdictions, people, bills, committees, events [legiscan.com/legiscan](https://legiscan.com/legiscan), [docs.openstates.org/api-v3/](https://docs.openstates.org/api-v3/).

9. **Election results APIs are commercial or aggregator-based** — AP Elections API, Democracy Works, civicAPI, and Ballotpedia are the main sources; few states offer direct results APIs [developer.ap.org/ap-elections-api/](https://developer.ap.org/ap-elections-api/), [www.democracy.works/elections-api](https://www.democracy.works/elections-api), [civicapi.org/](https://civicapi.org/), [ballotpedia.org/Ballotpedia:Buy_Political_Data](https://ballotpedia.org/Ballotpedia:Buy_Political_Data).

10. **Local/county-level data is the weakest link** — Most county election boards and DA offices publish via HTML/PDF with RSS for press releases, not structured APIs [www.justice.gov/usao/rss](https://www.justice.gov/usao/rss).

---

## 5. Scope and Definitions

**Topical Categories:**
1. Voter, Election, and Ballot Information
2. Legislation and Bill Tracking
3. Candidate Research and Campaign Finance
4. Judicial Resources and Court Case Tracking
5. U.S. Attorney / District Attorney Resources

**Jurisdictional Tiers:**
- Federal (100+ agencies, commissions, courts, 94 USAOs)
- State (50 states + DC + PR + USVI)
- Local (battleground-state metros per CQ-01/CQ-10 definition)

---

## 6. Methodology

The research followed the nine-phase strategy outlined in the handoff document: Federal Baseline → State Baseline → Local Baseline → Topical Deep Dive → Aggregator Overlay → Developer Stack Synthesis → Coverage Matrix → Verification Sweep → Synthesis and Traceability [deep-research-handoff document](https://www.genspark.ai/api/files/s/Z6EB8aD3).

**Source-Quality Hierarchy:**
1. Primary government sources (agency homepages, data portals)
2. Official bulk data/API endpoints
3. Nonprofit aggregators (CourtListener, OpenSecrets, FollowTheMoney, MIT Election Lab)
4. Commercial aggregators (Ballotpedia, LegiScan, AP, Democracy Works)
5. Secondary discovery sources (data.gov, NASS, Ballotpedia for context only)

---

## 7. Master Data Dictionary Table

| Resource Name | Publisher | Topical Category | Tier | Jurisdiction | Primary Product URL | Executive Summary | Availability | Developer Resources | Update Cadence | Source Authority | Confidence | Notes/Caveats |
|---------------|-----------|------------------|------|--------------|---------------------|-------------------|--------------|---------------------|----------------|------------------|------------|---------------|
| Congress.gov API | Library of Congress | Legislation | Federal | U.S. | [api.congress.gov](https://api.congress.gov/) | REST API for bills, laws, members, committees, votes | Free, API key required via api.data.gov | [docs](https://www.congress.gov/help/using-data-offsite), [GitHub](https://github.com/LibraryOfCongress/api.congress.gov/) | Real-time/near-real-time | Primary Government | Verified Live | No longer in beta as of 2026 [www.congress.gov/help/enhancements](https://www.congress.gov/help/enhancements) |
| GovInfo API & Bulk Data | GPO | Legislation, Regulations | Federal | U.S. | [www.govinfo.gov/developers](https://www.govinfo.gov/developers) | Bulk XML for bills, CFR, Federal Register, statutes, more | Free, api.data.gov key | [Bulk Data](https://www.govinfo.gov/bulkdata/), [GitHub](https://github.com/usgpo/api) | Varies by collection (daily to annual) | Primary Government | Verified Live | No bulk dumps for USCOURTS collection as of Jan 2026 [www.vaquill.ai/blog/govinfo-api-guide-keys-endpoints-limits-and-bulk-data](https://www.vaquill.ai/blog/govinfo-api-guide-keys-endpoints-limits-and-bulk-data) |
| OpenFEC API | FEC | Campaign Finance | Federal | U.S. | [api.open.fec.gov](https://api.open.fec.gov/) | Candidates, committees, filings, disbursements, independent expenditures | Free, API key (1,000 calls/hr, 100 results/page); DEMO_KEY available with stricter limits | [GitHub](https://github.com/fecgov/openfec) | Real-time for efiling (4-month window); processed data has lag | Primary Government | Verified Live | Some fields (occupation, employer, ZIP) may be null [learn.microsoft.com/en-us/connectors/openfec/](https://learn.microsoft.com/en-us/connectors/openfec/) |
| FederalRegister.gov API | OFR/GPO | Regulations | Federal | U.S. | [www.federalregister.gov/developers/documentation/api/v1](https://www.federalregister.gov/developers/documentation/api/v1) | Daily Federal Register documents in JSON/CSV | Free | [REST API docs](https://www.federalregister.gov/reader-aids/developer-resources/rest-api) | Daily | Primary Government (unofficial prototype) | Verified Live | Not official legal edition until ACFR grants status [www.federalregister.gov/developers/documentation/api/v1](https://www.federalregister.gov/developers/documentation/api/v1) |
| Regulations.gov API v4 | GSA | Regulations | Federal | U.S. | [open.gsa.gov/api/regulationsgov/](https://open.gsa.gov/api/regulationsgov/) | Documents, comments, dockets; POST for comments | Free, API key in X-Api-Key header | [OpenAPI spec](https://open.gsa.gov/api/regulationsgov/v4/openapi.yaml) | Real-time | Primary Government | Verified Live | Commenting API: 50 req/min, 500 req/hr [open.gsa.gov/api/regulationsgov/](https://open.gsa.gov/api/regulationsgov/) |
| LDA API (Lobbying Disclosure Act) | U.S. Senate | Lobbying | Federal | U.S. | [lda.gov/api/](https://lda.gov/api/) | LD-1, LD-2, LD-203 filings | Free | [Redoc docs](https://lda.gov/api/redoc/v1/) — **CRAWL FAILED**, unverified | Unknown | Primary Government | Needs Recheck | Crawl failed; endpoint structure unconfirmed |
| PACER | Administrative Office of U.S. Courts | Judicial | Federal | U.S. | [pacer.uscourts.gov](https://pacer.uscourts.gov/) | Federal court dockets and documents | Paywalled ($0.10/page, $3/doc max) | [PCL API](https://pacer.uscourts.gov/file-case/developer-resources) | Real-time | Primary Government | Verified Live | Fee exemptions available for indigents, academics, non-profits [pacer.uscourts.gov/pacer-pricing-how-fees-work](https://pacer.uscourts.gov/pacer-pricing-how-fees-work) |
| CourtListener API | Free Law Project | Judicial | Federal/State | U.S. (3,359 jurisdictions) | [www.courtlistener.com](https://www.courtlistener.com/) | Opinions, dockets, judges, oral arguments, RECAP data | Membership required (Free tier: 5/min, 50/hr; Paid from $10/mo) | [API docs](https://wiki.free.law/c/courtlistener/help/api/rest/v4/rest-api-v47) — **CRAWL FAILED**, [GitHub](https://github.com/api-evangelist/court-listener) | Real-time | Nonprofit | Verified Live | API access moved to membership model May 2026 [free.law/2026/05/07/api-included-in-memberships/](https://free.law/2026/05/07/api-included-in-memberships/) |
| Caselaw Access Project | Harvard Law School Library Innovation Lab | Judicial | Federal/State | U.S. | [case.law](https://case.law/) | 6+ million historical court opinions | Free, API and bulk data available | [API docs](https://lil.law.harvard.edu/our-work/caselaw-access-project/) | Static/historical | Academic | Verified Live | JavaScript required to view site; API details not fully crawled |
| Supreme Court Data (Free Law Project) | Free Law Project | Judicial | Federal | U.S. | [free.law/projects/supreme-court-data/](https://free.law/projects/supreme-court-data/) | SCOTUS opinions, dockets, citations | Free | Via CourtListener API | Real-time during term | Nonprofit | Verified Live | Aggregates SCDB, Resource.org, LOC, and direct scraping |
| OpenSecrets | Center for Responsive Politics | Campaign Finance | Federal/State | U.S. | [www.opensecrets.org/open-data](https://www.opensecrets.org/open-data) | Money-in-politics data (lobbying, contributions) | **API discontinued April 15, 2025**; bulk data for educational use | [API page](https://www.opensecrets.org/open-data/api) — discontinued; contact commercial@opensecrets.org | Varies | Nonprofit | Verified — API Discontinued | New dashboard launched Oct 2026 merging state/federal data [www.opensecrets.org/news/2026/10/opensecrets-launches-new-dashboard-bringing-state-and-federal-data-under-one-roof/](https://www.opensecrets.org/news/2026/10/opensecrets-launches-new-dashboard-bringing-state-and-federal-data-under-one-roof/) |
| FollowTheMoney | National Institute on Money in Politics | Campaign Finance | State | All 50 states | [www.followthemoney.org/our-data/apis/](https://www.followthemoney.org/our-data/apis/) | State campaign donor/contribution data | Free with myFollowTheMoney account | [Documentation](https://www.followthemoney.org/our-data/apis/documentation/) | Current through 2024 election year [www.followthemoney.org/our-data/apis/](https://www.followthemoney.org/our-data/apis/) | Nonprofit | Verified Live | Site not actively maintained but data current [www.followthemoney.org/our-data/apis/](https://www.followthemoney.org/our-data/apis/) |
| LegiScan API | LegiScan LLC | Legislation | Federal/State | All 50 states + Congress | [legiscan.com/legiscan](https://legiscan.com/legiscan) | Bill text, status, sponsors, roll calls | Free (30k queries/mo), Paid tiers ($25/yr single state, $1,000/yr national, Push API enterprise) | [API Manual](https://legiscan.com/gaits/documentation/legiscan), [Bulk Import](https://api.legiscan.com/docs/class-LegiScan_Import.html) | Push: every 4 hrs standard, 15 min optional | Commercial | Verified Live | Licensed CC BY 4.0 [legiscan.com/legiscan](https://legiscan.com/legiscan) |
| Open States API v3 | Plural Policy (formerly Open States) | Legislation | State | All 50 states + DC + PR | [docs.openstates.org/api-v3/](https://docs.openstates.org/api-v3/) | Jurisdictions, people, bills, committees, events | Free, API key required (X-API-KEY header) | [Interactive docs](https://v3.openstates.org/docs/), [GitHub](https://github.com/openstates/api-v3) | Varies by state scraper | Nonprofit | Verified Live | GraphQL API v2 deprecated Dec 2023 [docs.openstates.org/api-v2/](https://docs.openstates.org/api-v2/) |
| Ballotpedia API | Ballotpedia | Elections, Candidates, Ballot Measures | Federal/State/Local | U.S. | [ballotpedia.org/Ballotpedia:Buy_Political_Data](https://ballotpedia.org/Ballotpedia:Buy_Political_Data) | Election, officeholder, ballot measure data | Paid (pricing from $500/package, contact data@ballotpedia.org) | [Developer docs](https://developer.ballotpedia.org/) | Varies | Commercial | Verified Live | Delivery via bulk CSV/JSON or geographic APIs with lat/long [ballotpedia.org/Ballotpedia:Buy_Political_Data](https://ballotpedia.org/Ballotpedia:Buy_Political_Data) |
| Democracy Works Elections API | Democracy Works | Elections, Voter Info | Federal/State/Local | U.S. (14K+ elections since 2020) | [www.democracy.works/elections-api](https://www.democracy.works/elections-api) | Election dates, polling places, registration deadlines, ballot info | Commercial/enterprise | [Developer docs](https://developers.democracy.works/api/v2) | Continuously updated | Commercial | Verified Live | Powers TurboVote; partners with AI platforms [www.democracy.works/elections-api](https://www.democracy.works/elections-api) |
| AP Elections API | Associated Press | Election Results | Federal/State/Local | U.S. | [developer.ap.org/ap-elections-api/](https://developer.ap.org/ap-elections-api/) | Vote counts, race calls, delegate allocation, advance turnout | Commercial, API key required | [Query Explorer](https://api.ap.org/v3/elections/xplor), [Release Notes v3.2](https://developer.ap.org/ap-elections-api/docs/Release_Notes.htm) | Real-time during elections | Commercial | Verified Live | v3.2 adds U.S. House national vote by party for 2026 General [developer.ap.org/ap-elections-api/docs/Release_Notes.htm](https://developer.ap.org/ap-elections-api/docs/Release_Notes.htm) |
| civicAPI | civicAPI | Election Results | Federal/State/Local | Global (incl. U.S.) | [civicapi.org/](https://civicapi.org/) | Live/historical election results, race calls, embeddable widgets | Free, no API key | [API docs](https://civicapi.org/api-documentation) | Real-time | Commercial/Unknown | Verified Live | 40,182 races tracked across 77 election days in 2026 [civicapi.org/results](https://civicapi.org/results) |
| VoteAmerica Plus Civic Data API | VoteAmerica Plus | Voter Info/Election Law | State | All 50 states + DC | [voteamericaplus.org/civic-data-api/](https://voteamericaplus.org/civic-data-api/) | State-by-state election law fields | Free | [Full docs](https://docs.voteamericaplus.org/api/) | Static/periodic | Nonprofit | Verified Live | Alternative to Google Civic API [voteamericaplus.org/civic-data-api/](https://voteamericaplus.org/civic-data-api/) |
| EAC EAVS Reports | U.S. Election Assistance Commission | Election Administration | Federal/State/Territory | All 50 states + DC + territories | [www.eac.gov/research-and-data/studies-and-reports](https://www.eac.gov/research-and-data/studies-and-reports) | Biennial survey of election administration (registration, voting practices, etc.) | Free | [2024 Report PDF](https://www.eac.gov/sites/default/files/2025-07/2024_EAVS_Report_508.pdf), [Data Interactive](https://www.eac.gov/research-and-data/studies-and-reports/eavs-data-interactive) | Biennial (2024 report published June 30, 2025) | Primary Government | Verified Live | Pre-2014 data split into NVRA, UOCAVA, Election Day Survey reports [www.eac.gov/research-and-data/studies-and-reports](https://www.eac.gov/research-and-data/studies-and-reports) |
| MIT Election Lab Data | MIT Election Data and Science Lab | Election Results | Federal/State/Local | U.S. | [electionlab.mit.edu/data](https://electionlab.mit.edu/data) | Precinct-level, county-level, statewide returns (1976–2024+) | Free | Bulk download (various formats) | Historical, updated periodically | Academic | Verified Live | Includes cast vote records, Senate/House/President returns [electionlab.mit.edu/data](https://electionlab.mit.edu/data) |
| Michigan Voter Registration API | Michigan Secretary of State | Voter Registration | State | Michigan | [www.michigan.gov/sos/faqs/elections-and-campaign-finance/register-to-vote](https://www.michigan.gov/sos/faqs/elections-and-campaign-finance/register-to-vote) | API for civic groups to conduct digital voter registration | Free for approved organizations | [News release](https://www.michigan.gov/sos/resources/news/2020/06/15/new-tool-allows-civic-groups-to-conduct-voter-registration-drives-digitally) | Real-time | Primary Government | Verified Live | Requires organization approval [www.michigan.gov/sos/faqs/elections-and-campaign-finance/register-to-vote](https://www.michigan.gov/sos/faqs/elections-and-campaign-finance/register-to-vote) |
| California Trusted-Party Registration API | California Secretary of State | Voter Registration | State | California | [electioninnovation.org/update/online-voter-registration-apis-a-new-trend/](https://electioninnovation.org/update/online-voter-registration-apis-a-new-trend/) | API for trusted parties to submit registration data | Free for approved parties | Not directly crawled; referenced via third party | Real-time | Primary Government | Needs Recheck | Details not fully verified via direct crawl |
| Pennsylvania Online Voter Registration Web API | Pennsylvania Department of State | Voter Registration | State | Pennsylvania | [www.pa.gov/agencies/dos/resources/voting-and-elections-resources/pa-online-voter-registration-web-api-rfc](https://www.pa.gov/agencies/dos/resources/voting-and-elections-resources/pa-online-voter-registration-web-api-rfc) | Secure API for approved Posting Entities | Free for approved entities | RFC documentation | Real-time | Primary Government | Verified Live | Part of SURE (Statewide Uniform Registry of Electors) system [www.phila.gov/media/20190724193349/Day-1-Session-3_Election-Security-Panel-Marks.pdf](https://www.phila.gov/media/20190724193349/Day-1-Session-3_Election-Security-Panel-Marks.pdf) |
| Florida Election Results | Florida Division of Elections | Election Results | State | Florida | [results.elections.myflorida.com](https://results.elections.myflorida.com/) | Election results, data extract utility, archive back to 1978 | Free | [Data Extract Utility](https://results.elections.myflorida.com/downloadresults.asp), [Archive](https://dos.fl.gov/elections/data-statistics/elections-data/election-results-archive/) | Real-time on election day; historical archive | Primary Government | Verified Live | Archive goes back to 1978 [dos.fl.gov/elections/data-statistics/elections-data/election-results-archive/](https://dos.fl.gov/elections/data-statistics/elections-data/election-results-archive/) |
| Georgia Election Data Hub | Georgia Secretary of State | Election Results, Voter Registration | State | Georgia | [sos.ga.gov/election-data-hub](https://sos.ga.gov/election-data-hub) | Interactive dashboards, downloadable datasets | Free | Dashboard interface, no confirmed API | Periodic | Primary Government | Verified Live | Covers voter registration, turnout, absentee voting [sos.ga.gov/election-data-hub](https://sos.ga.gov/election-data-hub) |
| Arizona Unofficial Election Night Results | Arizona Secretary of State | Election Results | State | Arizona | [azsos.gov/elections/election-information/unofficial-enr](https://azsos.gov/elections/election-information/unofficial-enr) | Unofficial results updated sporadically on election night | Free | No confirmed API | Real-time on election night | Primary Government | Verified Live | First batch available after 8pm on election night [azsos.gov/elections/election-information/unofficial-enr](https://azsos.gov/elections/election-information/unofficial-enr) |
| North Carolina Election Results Dashboard | NC State Board of Elections | Election Results | State | North Carolina | [www.ncsbe.gov/results-data/election-results](https://www.ncsbe.gov/results-data/election-results) | Live election results, historical data | Free | No confirmed API | Real-time on election day | Primary Government | Verified Live | [er.ncsbe.gov](https://er.ncsbe.gov/) is the contest results portal |
| Ohio Secretary of State Data Portal | Ohio Secretary of State | Election Results | State | Ohio | [data.ohiosos.gov/portal/election-dashboards](https://data.ohiosos.gov/portal/election-dashboards) | Historical election dashboards, past results | Free | Dashboard interface | Periodic | Primary Government | Verified Live | [data.ohiosos.gov/portal/past-election-results](https://data.ohiosos.gov/portal/past-election-results) for certified results |
| Wisconsin Election Results | Wisconsin Elections Commission | Election Results | State | Wisconsin | [myvote.wi.gov/en-us/Election-Results](https://myvote.wi.gov/en-us/Election-Results) | Results transmitted from municipal to county clerks | Free | No confirmed API | Real-time on election day | Primary Government | Verified Live | Results not official until locally and county-verified [myvote.wi.gov/en-us/Election-Results](https://myvote.wi.gov/en-us/Election-Results) |
| Texas Election Results | Texas Secretary of State | Election Results | State | Texas | [electionresults.sos.state.tx.us/results.html](https://electionresults.sos.state.tx.us/results.html) | Official election results | Free | [Capitol Data Portal datasets](https://data.capitol.texas.gov/dataset?groups=elections) | Real-time on election day | Primary Government | Verified Live | Early voting Oct 19–30 for Nov 3, 2026 election [electionresults.sos.state.tx.us/results.html](https://electionresults.sos.state.tx.us/results.html) |
| U.S. Attorneys Listing | U.S. Department of Justice | USAO | Federal | 94 districts | [www.justice.gov/usao/us-attorneys-listing](https://www.justice.gov/usao/us-attorneys-listing) | Current leadership for all 94 U.S. Attorney's Offices | Free | [Find Your USAO](https://www.justice.gov/usao/find-your-united-states-attorney) | Updated as appointments change | Primary Government | Verified Live | Presidential appointees marked with asterisk [www.justice.gov/usao/us-attorneys-listing](https://www.justice.gov/usao/us-attorneys-listing) |
| USAO RSS Feeds | U.S. Department of Justice | USAO Press Releases | Federal | 94 districts | [www.justice.gov/usao/rss](https://www.justice.gov/usao/rss) | RSS feeds for each USAO | Free | RSS feed URLs per district | Real-time | Primary Government | Verified Live | Subscribe via feed reader [www.justice.gov/usao/rss](https://www.justice.gov/usao/rss) |
| State DA Directories (various) | Various State DA Associations | District Attorney | State | Various (PA, NY, IL, etc.) | [www.pdaa.org/da-directory/](https://www.pdaa.org/da-directory/) (PA), [www.daasny.com](https://www.daasny.com) (NY), [illinoisrd.com](https://illinoisrd.com) (IL) | Directory of district attorneys by county/district | Free | Typically no API, HTML directories | Periodic | Primary/Nonprofit | Verified Live | No standardized API across states |
| Cook County State's Attorney Data | Cook County, IL | District Attorney | Local | Cook County, IL | [datacatalog.cookcountyil.gov/Legal-Judicial/Intake/3k7z-hchi](https://datacatalog.cookcountyil.gov/Legal-Judicial/Intake/3k7z-hchi) | Intake dataset (no longer maintained as of 12/30/2024) | Free | Open data portal | **Discontinued** | Local Government | Verified — Discontinued | Dataset no longer actively maintained [datacatalog.cookcountyil.gov/Legal-Judicial/Intake/3k7z-hchi](https://datacatalog.cookcountyil.gov/Legal-Judicial/Intake/3k7z-hchi) |
| Google Civic Information API | Google | Voter Info | Federal/State | U.S. | **Shut down April 30, 2025** | Was: voting locations, elected officials by address | **Discontinued** | N/A | N/A | Commercial | Verified — Discontinued | Representatives service retired; Soapbox Engage unaffected [support.picnet.net/hc/en-us/articles/25130331666459](https://support.picnet.net/hc/en-us/articles/25130331666459) |
| USgeocoder API | USgeocoder | Voter Info (Google Civic replacement) | Federal/State | U.S. | [blog.usgeocoder.com/looking-for-a-google-civic-api-alternative-discover-usgeocoder-api/](https://blog.usgeocoder.com/looking-for-a-google-civic-api-alternative-discover-usgeocoder-api/) | Congressional district, elected officials lookup | Commercial | Referenced as alternative, details not crawled | Unknown | Commercial | Needs Recheck | Cited as Google Civic API alternative |
| ProPublica Campaign Finance API | ProPublica | Campaign Finance | Federal | U.S. | [projects.propublica.org/api-docs/campaign-finance/](https://projects.propublica.org/api-docs/campaign-finance/) | FEC filings and other campaign finance data | Free (historical reference only) | Documentation archived | N/A — API discontinued | Nonprofit | Verified — Discontinued | Docs preserved as historical reference |
| NCSL Campaign Finance Resources | National Conference of State Legislatures | Campaign Finance | State | All 50 states | [www.ncsl.org/elections-and-campaigns/campaign-finance](https://www.ncsl.org/elections-and-campaigns/campaign-finance) | 50-state surveys, legislation database, articles | Free | [Legislation Database](https://www.ncsl.org/elections-and-campaigns/campaign-finance-legislation-database) | Periodic | Nonprofit | Verified Live | Includes contribution limits, disclosure requirements [www.ncsl.org/elections-and-campaigns/campaign-finance-legislation-database](https://www.ncsl.org/elections-and-campaigns/campaign-finance-legislation-database) |
| PublicAccountability.org Datasets | Public Accountability Project | Campaign Finance | State | Various | [publicaccountability.org/datasets/home/](https://publicaccountability.org/datasets/home/) | Campaign finance datasets | Free | Searchable datasets | Updated periodically (through Sept 22, 2026 per snippet) | Nonprofit | Verified Live | Data includes reports through Sept 22, 2026 [publicaccountability.org/datasets/home/](https://publicaccountability.org/datasets/home/) |
| Redistricting Data Hub | Redistricting Data Hub | Election Results, Demographics | Federal/State/Local | U.S. | [redistrictingdatahub.org/data/download-data/](https://redistrictingdatahub.org/data/download-data/) | Election results, turnout, demographic data, boundaries | Free | Bulk download | Periodic | Nonprofit/Academic | Verified Live | One-stop shop for redistricting-related data [redistrictingdatahub.org/data/download-data/](https://redistrictingdatahub.org/data/download-data/) |
| Wiki Elections API (Apify) | Apify / Wiki Elections | Election Results | Federal/State | U.S. | [apify.com/nerb1x/wiki-elections-api](https://apify.com/nerb1x/wiki-elections-api) | Senate candidates by state, name, party, status | Paid (Apify platform) | Apify actor API | Fixed to 2026 general election cycle | Commercial (via Apify) | Verified Live | Third-party scraper/wrapper |
| FEC Filing Iterator | FEC Filing Iterator project | Campaign Finance | Federal | U.S. | [fec-filing-iterator.readthedocs.io/](https://fec-filing-iterator.readthedocs.io/) | Iterates through FEC API filings | Free, open source | Python library documentation | Depends on FEC API | Open Source | Verified Live | Wrapper/utility for FEC API [fec-filing-iterator.readthedocs.io/](https://fec-filing-iterator.readthedocs.io/) |

---

## 8. State-by-State Appendix (Selected Swing States)

| State | Voter Registration API | Election Results Source | Campaign Finance Source | Notes |
|-------|----------------------|------------------------|------------------------|-------|
| Arizona | No confirmed API | [azsos.gov/elections/election-information/unofficial-enr](https://azsos.gov/elections/election-information/unofficial-enr) | Via FollowTheMoney | Results updated sporadically on election night |
| Colorado | API for trusted parties [electioninnovation.org/update/online-voter-registration-apis-a-new-trend/](https://electioninnovation.org/update/online-voter-registration-apis-a-new-trend/) | Not crawled in this batch | Via FollowTheMoney | One of the states with custom registration links |
| Florida | No confirmed API | [results.elections.myflorida.com](https://results.elections.myflorida.com/) | Via FollowTheMoney | Archive back to 1978 |
| Georgia | No confirmed API | [sos.ga.gov/election-data-hub](https://sos.ga.gov/election-data-hub) | Via FollowTheMoney | Interactive dashboards available |
| Michigan | API for civic groups [www.michigan.gov/sos/faqs/elections-and-campaign-finance/register-to-vote](https://www.michigan.gov/sos/faqs/elections-and-campaign-finance/register-to-vote) | Not crawled in this batch | Via FollowTheMoney | Requires organization approval |
| North Carolina | No confirmed API | [www.ncsbe.gov/results-data/election-results](https://www.ncsbe.gov/results-data/election-results) | [www.ncsbe.gov/campaign-finance/search-campaign-funding-and-spending-reports-and-penalties](https://www.ncsbe.gov/campaign-finance/search-campaign-funding-and-spending-reports-and-penalties), [ethics.nc.gov](https://ethics.nc.gov/) | State Ethics Commission also tracks candidate finance |
| Ohio | No confirmed API | [data.ohiosos.gov/portal/election-dashboards](https://data.ohiosos.gov/portal/election-dashboards) | Via FollowTheMoney | Data portal with historical dashboards |
| Pennsylvania | API for approved Posting Entities [www.pa.gov/agencies/dos/resources/voting-and-elections-resources/pa-online-voter-registration-web-api-rfc](https://www.pa.gov/agencies/dos/resources/voting-and-elections-resources/pa-online-voter-registration-web-api-rfc) | [www.electionreturns.pa.gov/](https://www.electionreturns.pa.gov/) | Via FollowTheMoney | Part of SURE system |
| Wisconsin | No confirmed API | [myvote.wi.gov/en-us/Election-Results](https://myvote.wi.gov/en-us/Election-Results) | Via FollowTheMoney | Results require local + county verification |

*Note: Full 50-state table not completed due to crawl/search budget constraints — see Data Limitations section.*

---

## 9. Battleground-State Local Appendix

Due to search budget constraints, detailed local/county-level resource mapping for battleground metros was not completed. Known patterns from research:

- County election boards typically publish results via HTML dashboards or PDFs, not APIs
- District Attorney offices often have press release RSS feeds or newsroom pages (e.g., [Manhattan DA](https://manhattanda.org/category/news/press-release/), [Brooklyn DA](https://www.brooklynda.org/press-releases/), [Salt Lake County DA](https://www.saltlakecounty.gov/district-attorney/Media/))
- USAO offices all have individual RSS feeds via [www.justice.gov/usao/rss](https://www.justice.gov/usao/rss)
- Cook County, IL had an open data intake dataset that was discontinued as of 12/30/2024 [datacatalog.cookcountyil.gov/Legal-Judicial/Intake/3k7z-hchi](https://datacatalog.cookcountyil.gov/Legal-Judicial/Intake/3k7z-hchi)

---

## 10. Developer Resources Appendix

### Authentication Patterns Observed
- **api.data.gov key**: Congress.gov, GovInfo [api.congress.gov](https://api.congress.gov/), [www.govinfo.gov/developers](https://www.govinfo.gov/developers)
- **X-API-KEY header**: Open States, Regulations.gov [docs.openstates.org/api-v3/](https://docs.openstates.org/api-v3/), [open.gsa.gov/api/regulationsgov/](https://open.gsa.gov/api/regulationsgov/)
- **X-Api-Key header**: Regulations.gov [open.gsa.gov/api/regulationsgov/](https://open.gsa.gov/api/regulationsgov/)
- **Account-based (free registration)**: FollowTheMoney, LegiScan, CourtListener (free tier) [www.followthemoney.org/our-data/apis/](https://www.followthemoney.org/our-data/apis/), [legiscan.com/legiscan](https://legiscan.com/legiscan), [www.courtlistener.com](https://www.courtlistener.com/)
- **Membership-based (paid tiers)**: CourtListener (from $10/mo) [free.law/2026/05/07/api-included-in-memberships/](https://free.law/2026/05/07/api-included-in-memberships/)
- **Commercial/enterprise**: Ballotpedia, Democracy Works, AP Elections API [ballotpedia.org/Ballotpedia:Buy_Political_Data](https://ballotpedia.org/Ballotpedia:Buy_Political_Data), [www.democracy.works/elections-api](https://www.democracy.works/elections-api), [developer.ap.org/ap-elections-api/](https://developer.ap.org/ap-elections-api/)
- **No API key required**: civicAPI [civicapi.org/](https://civicapi.org/)

### Rate Limits Documented
- **Congress.gov**: Not specified in crawled content
- **OpenFEC**: 1,000 calls/hour with API key, 100 results/page [api.open.fec.gov](https://api.open.fec.gov/)
- **Regulations.gov commenting API**: 50 requests/minute, 500 requests/hour [open.gsa.gov/api/regulationsgov/](https://open.gsa.gov/api/regulationsgov/)
- **CourtListener Free tier**: 5/min, 50/hr, 125/day [github.com/api-evangelist/court-listener](https://github.com/api-evangelist/court-listener)
- **CourtListener Tier 1 ($10/mo)**: 10/min, 75/hr, 300/day [github.com/api-evangelist/court-listener](https://github.com/api-evangelist/court-listener)
- **CourtListener Tier 2 ($25/mo)**: 15/min, 150/hr [github.com/api-evangelist/court-listener](https://github.com/api-evangelist/court-listener)
- **LegiScan Public API**: 30,000 queries/month [legiscan.com/legiscan](https://legiscan.com/legiscan)
- **LegiScan Pull API**: 100,000–250,000 queries/month [legiscan.com/legiscan](https://legiscan.com/legiscan)

---

## 11. Coverage Matrix (Partial)

| Topical Category | Federal | State (all) | State (swing) | Local (swing metros) |
|------------------|---------|-------------|---------------|---------------------|
| Voter Registration | Partial (EAC EAVS, VoteAmerica Plus) | Partial (MI, CA, PA have APIs; most states web-only) | Partial | No API coverage found |
| Election Results | Partial (EAC, MIT Election Lab) | Good (state SOS portals, mostly HTML) | Good | Partial (county portals, HTML/PDF) |
| Legislation | Excellent (Congress.gov, GovInfo) | Excellent (LegiScan, Open States) | Excellent | No coverage (local ordinances not tracked) |
| Campaign Finance | Excellent (OpenFEC); OpenSecrets API discontinued | Good (FollowTheMoney, state ethics portals) | Good | No coverage |
| Judicial/Courts | Good (PACER paywalled, CourtListener membership) | Partial (CourtListener covers 3,359 jurisdictions; state-specific portals vary) | Partial | No coverage |
| USAO/DA | Excellent (94 USAOs with RSS) | Partial (state DA directories, no standard API) | Partial | Partial (county DA press releases) |

---

## 12. Gap Analysis

1. **No standardized local/county election API** — Every county uses different systems; no national aggregator covers all counties with structured data.
2. **OpenSecrets API gap** — Since April 2025, no free programmatic access to OpenSecrets data; must contact commercial@opensecrets.org for custom solutions [www.opensecrets.org/open-data/api](https://www.opensecrets.org/open-data/api).
3. **Google Civic API gap** — No direct free replacement with equivalent coverage; VoteAmerica Plus and USgeocoder are partial alternatives [crawlify.ai/insights/civic-data-gap-google-civic-api-shutdown](https://crawlify.ai/insights/civic-data-gap-google-civic-api-shutdown).
4. **State court API fragmentation** — No unified API for state trial courts; CourtListener coverage is good but membership-gated for full access [free.law/2026/05/07/api-included-in-memberships/](https://free.law/2026/05/07/api-included-in-memberships/).
5. **LDA API documentation not verified** — Crawl of lda.gov/api/redoc/v1/ failed; endpoint structure unconfirmed [lda.gov/api/redoc/v1/](https://lda.gov/api/redoc/v1/).
6. **CourtListener API v4.7 docs not retrieved** — Crawl failed; rate limits and endpoints partially known from GitHub mirror but not verified against official docs [www.courtlistener.com/help/api/rest/v4/rest-api-v47/](https://www.courtlistener.com/help/api/rest/v4/rest-api-v47/).
7. **California trusted-party registration API** — Referenced but not directly crawled/verified [electioninnovation.org/update/online-voter-registration-apis-a-new-trend/](https://electioninnovation.org/update/online-voter-registration-apis-a-new-trend/).
8. **Full 50-state voter registration/campaign finance/court portal mapping** — Not completed; only swing states partially covered.
9. **Historical election data completeness** — MIT Election Lab and civicAPI have gaps in year/state coverage; not all states back to 2000 are confirmed.
10. **DA/USAO leadership freshness** — USAO leadership changes with presidential appointments; no automated tracking confirmed beyond the static listing page [www.justice.gov/usao/us-attorneys-listing](https://www.justice.gov/usao/us-attorneys-listing).

---

## 13. Risks, Limitations, and Evidence Gaps

- **Crawl failures**: lda.gov/api/redoc/v1/, www.courtlistener.com/help/api/rest/v4/rest-api-v47/, case.law (JavaScript-rendered, minimal content retrieved) — these resources require manual verification.
- **Discontinued services**: OpenSecrets API, ProPublica Congress API, ProPublica Represent API, Google Civic Information API, GovTrack bulk data/API — all confirmed discontinued, requiring alternative sources.
- **Paywalls**: PACER ($0.10/page) and CourtListener membership model limit free access to full court data.
- **Date sensitivity**: Many resources (USAO leadership, election results, campaign finance filings) change frequently; this report's data is accurate as of 2026-10-17 but should be re-verified before production use.
- **Incomplete local coverage**: The handoff document's requirement for battleground-metro local resources was not fully satisfied due to search/crawl budget exhaustion.

---

## 14. Implications for Civic-Tech Developers

1. **Build for fragmentation** — No single API covers all needs; expect to integrate 5–10 different sources for full coverage.
2. **Budget for paid tiers** — CourtListener, LegiScan Push API, Ballotpedia, AP Elections API, and Democracy Works all require payment for serious production use.
3. **Plan for API deprecations** — The 2025 shutdowns of OpenSecrets, ProPublica Congress, and Google Civic APIs show that free public APIs in this space are not stable long-term.
4. **Fallback to scraping with caution** — Where no API exists (most county election boards, many state courts), scraping may be necessary but should respect robots.txt and terms of service.
5. **Cache aggressively** — Many endpoints have strict rate limits; local caching is essential for production applications.
6. **Verify leadership data frequently** — USAO and DA leadership changes are not pushed via API; manual or RSS-based monitoring is required.
7. **Consider hybrid approaches** — Combine free sources (Congress.gov, OpenFEC, civicAPI, MIT Election Lab) with paid sources (LegiScan, CourtListener membership, Democracy Works) to balance cost and coverage.

---

## 15. Research-Question Coverage Matrix

| Research Question | Status | Workstream(s) |
|-------------------|--------|---------------|
| RQ-01: Federal voter/election resources | Partially complete | WS-01 |
| RQ-02: Federal legislation resources | Complete | WS-02 |
| RQ-03: Federal campaign finance resources | Complete | WS-03 |
| RQ-04: Federal judicial resources | Partially complete (crawl failures) | WS-04 |
| RQ-05: USAO resources | Complete | WS-05 |
| RQ-06: State voter/election resources | Partially complete (swing states only) | WS-06 |
| RQ-07: State legislation resources | Complete | WS-07 |
| RQ-08: State campaign finance resources | Partially complete | WS-08 |
| RQ-09: State judicial resources | Partially complete | WS-09 |
| RQ-10: State DA resources | Partially complete | WS-10 |
| RQ-11: Local battleground voter resources | Incomplete | WS-11 |
| RQ-12: Local battleground candidate/judicial/DA resources | Incomplete | WS-12 |
| RQ-13: Aggregator/nonprofit sources | Complete | WS-13 |
| RQ-14: Developer access synthesis | Partially complete | WS-14 |
| RQ-15: Coverage matrix/gap analysis | Partially complete | WS-15 |

---

## 16. Claim-Evidence / Traceability Matrix

| Claim | Source URL |
|-------|------------|
| Congress.gov API no longer in beta | [www.congress.gov/help/enhancements](https://www.congress.gov/help/enhancements) |
| OpenFEC rate limit 1,000 calls/hour | [api.open.fec.gov](https://api.open.fec.gov/) |
| OpenSecrets API discontinued April 15, 2025 | [www.opensecrets.org/open-data/api](https://www.opensecrets.org/open-data/api) |
| CourtListener API now membership-based | [free.law/2026/05/07/api-included-in-memberships/](https://free.law/2026/05/07/api-included-in-memberships/) |
| PACER pricing $0.10/page, $3/doc max | [pacer.uscourts.gov/pacer-pricing-how-fees-work](https://pacer.uscourts.gov/pacer-pricing-how-fees-work) |
| Google Civic API shut down April 30, 2025 | [crawlify.ai/insights/civic-data-gap-google-civic-api-shutdown](https://crawlify.ai/insights/civic-data-gap-google-civic-api-shutdown) |
| LegiScan free tier 30k queries/month | [legiscan.com/legiscan](https://legiscan.com/legiscan) |
| EAC 2024 EAVS Report published June 30, 2025 | [www.eac.gov/research-and-data/studies-and-reports](https://www.eac.gov/research-and-data/studies-and-reports) |
| FollowTheMoney data current through 2024 | [www.followthemoney.org/our-data/apis/](https://www.followthemoney.org/our-data/apis/) |
| Regulations.gov commenting API rate limit 50/min | [open.gsa.gov/api/regulationsgov/](https://open.gsa.gov/api/regulationsgov/) |

---

## 17. Source List / Bibliography

### Federal Government Sources
- Congress.gov API — [api.congress.gov](https://api.congress.gov/), [www.congress.gov/help/using-data-offsite](https://www.congress.gov/help/using-data-offsite), [github.com/LibraryOfCongress/api.congress.gov](https://github.com/LibraryOfCongress/api.congress.gov/)
- GovInfo — [www.govinfo.gov/developers](https://www.govinfo.gov/developers), [www.govinfo.gov/bulkdata](https://www.govinfo.gov/bulkdata), [github.com/usgpo/api](https://github.com/usgpo/api)
- OpenFEC — [api.open.fec.gov](https://api.open.fec.gov/), [github.com/fecgov/openfec](https://github.com/fecgov/openfec)
- FederalRegister.gov — [www.federalregister.gov/developers/documentation/api/v1](https://www.federalregister.gov/developers/documentation/api/v1)
- Regulations.gov — [open.gsa.gov/api/regulationsgov/](https://open.gsa.gov/api/regulationsgov/)
- LDA API — [lda.gov/api/](https://lda.gov/api/) (crawl failed)
- PACER — [pacer.uscourts.gov](https://pacer.uscourts.gov/)
- U.S. Department of Justice / USAO — [www.justice.gov/usao](https://www.justice.gov/usao), [www.justice.gov/usao/rss](https://www.justice.gov/usao/rss)
- EAC — [www.eac.gov/research-and-data/studies-and-reports](https://www.eac.gov/research-and-data/studies-and-reports)

### State Government Sources
- Michigan SOS — [www.michigan.gov/sos/faqs/elections-and-campaign-finance/register-to-vote](https://www.michigan.gov/sos/faqs/elections-and-campaign-finance/register-to-vote)
- California SOS — [electioninnovation.org/update/online-voter-registration-apis-a-new-trend/](https://electioninnovation.org/update/online-voter-registration-apis-a-new-trend/) (third-party reference)
- Pennsylvania DOS — [www.pa.gov/agencies/dos/resources/voting-and-elections-resources/pa-online-voter-registration-web-api-rfc](https://www.pa.gov/agencies/dos/resources/voting-and-elections-resources/pa-online-voter-registration-web-api-rfc)
- Florida Division of Elections — [results.elections.myflorida.com](https://results.elections.myflorida.com/)
- Georgia SOS — [sos.ga.gov/election-data-hub](https://sos.ga.gov/election-data-hub)
- Arizona SOS — [azsos.gov/elections/election-information/unofficial-enr](https://azsos.gov/elections/election-information/unofficial-enr)
- North Carolina SBE — [www.ncsbe.gov/results-data/election-results](https://www.ncsbe.gov/results-data/election-results)
- Ohio SOS — [data.ohiosos.gov/portal/election-dashboards](https://data.ohiosos.gov/portal/election-dashboards)
- Wisconsin Elections Commission — [myvote.wi.gov/en-us/Election-Results](https://myvote.wi.gov/en-us/Election-Results)
- Texas SOS — [electionresults.sos.state.tx.us/results.html](https://electionresults.sos.state.tx.us/results.html)
- NC Ethics Commission — [ethics.nc.gov](https://ethics.nc.gov/)
- Pennsylvania DA Association — [www.pdaa.org/da-directory/](https://www.pdaa.org/da-directory/)

### Nonprofit/Academic Sources
- CourtListener / Free Law Project — [www.courtlistener.com](https://www.courtlistener.com/), [free.law](https://free.law/), [github.com/api-evangelist/court-listener](https://github.com/api-evangelist/court-listener)
- Caselaw Access Project — [case.law](https://case.law/), [lil.law.harvard.edu/our-work/caselaw-access-project/](https://lil.law.harvard.edu/our-work/caselaw-access-project/)
- OpenSecrets — [www.opensecrets.org](https://www.opensecrets.org/)
- FollowTheMoney — [www.followthemoney.org](https://www.followthemoney.org/)
- LegiScan — [legiscan.com](https://legiscan.com/)
- Open States — [docs.openstates.org/api-v3/](https://docs.openstates.org/api-v3/), [open.pluralpolicy.com](https://open.pluralpolicy.com/)
- MIT Election Lab — [electionlab.mit.edu/data](https://electionlab.mit.edu/data)
- NCSL — [www.ncsl.org/elections-and-campaigns/campaign-finance](https://www.ncsl.org/elections-and-campaigns/campaign-finance)
- PublicAccountability.org — [publicaccountability.org/datasets/home/](https://publicaccountability.org/datasets/home/)
- Redistricting Data Hub — [redistrictingdatahub.org/data/download-data/](https://redistrictingdatahub.org/data/download-data/)

### Commercial Sources
- Ballotpedia — [ballotpedia.org](https://ballotpedia.org/), [developer.ballotpedia.org](https://developer.ballotpedia.org/)
- Democracy Works — [www.democracy.works/elections-api](https://www.democracy.works/elections-api), [developers.democracy.works](https://developers.democracy.works/)
- AP Elections API — [developer.ap.org/ap-elections-api/](https://developer.ap.org/ap-elections-api/)
- civicAPI — [civicapi.org/](https://civicapi.org/)
- VoteAmerica Plus — [voteamericaplus.org/civic-data-api/](https://voteamericaplus.org/civic-data-api/)
- USgeocoder — [blog.usgeocoder.com/looking-for-a-google-civic-api-alternative-discover-usgeocoder-api/](https://blog.usgeocoder.com/looking-for-a-google-civic-api-alternative-discover-usgeocoder-api/)

### Discontinued/Deprecated Sources
- OpenSecrets API — [www.opensecrets.org/open-data/api](https://www.opensecrets.org/open-data/api)
- ProPublica Congress API — [projects.propublica.org/api-docs/congress-api/](https://projects.propublica.org/api-docs/congress-api/)
- ProPublica Represent — [projects.propublica.org/represent/](https://projects.propublica.org/represent/)
- Google Civic Information API — [developers.google.com/civic-information](https://developers.google.com/civic-information) (discontinued), [crawlify.ai/insights/civic-data-gap-google-civic-api-shutdown](https://crawlify.ai/insights/civic-data-gap-google-civic-api-shutdown)
- GovTrack bulk data/API — [www.govtrack.us/posts/124/2016-12-10_ending-govtracks-bulk-data-and-api](https://www.govtrack.us/posts/124/2016-12-10_ending-govtracks-bulk-data-and-api)
- Cook County Intake Dataset — [datacatalog.cookcountyil.gov/Legal-Judicial/Intake/3k7z-hchi](https://datacatalog.cookcountyil.gov/Legal-Judicial/Intake/3k7z-hchi) (discontinued 12/30/2024)

---

## 18. Appendices

### A. Verification Log (Partial)
- Congress.gov API — Verified 2026-10-17 via batch_crawl_url_and_answer
- OpenFEC API — Verified 2026-10-17 via batch_crawl_url_and_answer
- GovInfo API — Verified 2026-10-17 via batch_crawl_url_and_answer
- CourtListener API v4.7 docs — **CRAWL FAILED**, unverified
- OpenSecrets API — Verified discontinued 2026-10-17 via batch_crawl_url_and_answer
- FollowTheMoney API — Verified 2026-10-17 via batch_crawl_url_and_answer
- LegiScan API — Verified 2026-10-17 via batch_crawl_url_and_answer
- Ballotpedia pricing — Verified 2026-10-17 via batch_crawl_url_and_answer
- Open States API v3 — Verified 2026-10-17 via batch_crawl_url_and_answer
- Democracy Works Elections API — Verified 2026-10-17 via batch_crawl_url_and_answer
- FederalRegister.gov API — Verified 2026-10-17 via batch_crawl_url_and_answer
- Regulations.gov API v4 — Verified 2026-10-17 via batch_crawl_url_and_answer
- LDA API — **CRAWL FAILED**, unverified
- Free Law Project Supreme Court Data — Verified 2026-10-17 via batch_crawl_url_and_answer
- Caselaw Access Project — Partially verified (JavaScript-rendered page, minimal content)
- EAC EAVS — Verified 2026-10-17 via batch_crawl_url_and_answer
- MIT Election Lab — Verified 2026-10-17 via batch_crawl_url_and_answer
- civicAPI — Verified 2026-10-17 via batch_crawl_url_and_answer
- VoteAmerica Plus — Verified 2026-10-17 via batch_crawl_url_and_answer
- AP Elections API — Verified 2026-10-17 via batch_crawl_url_and_answer
- Michigan voter registration — Verified 2026-10-17 via batch_web_search
- California trusted-party API — Not directly crawled, third-party reference only
- Pennsylvania voter registration API — Verified 2026-10-17 via batch_web_search
- Florida election results — Verified 2026-10-17 via batch_web_search
- Georgia election results — Verified 2026-10-17 via batch_web_search
- Arizona election results — Verified 2026-10-17 via batch_web_search
- North Carolina election results — Verified 2026-10-17 via batch_web_search
- Ohio election results — Verified 2026-10-17 via batch_web_search
- Wisconsin election results — Verified 2026-10-17 via batch_web_search
- Texas election results — Verified 2026-10-17 via batch_web_search
- USAO listing — Verified 2026-10-17 via batch_web_search
- USAO RSS feeds — Verified 2026-10-17 via batch_web_search

### B. Contradiction Log
No direct contradictions between sources were identified in this research pass. Notable discrepancies in *coverage claims* (e.g., whether a state has an API) reflect incomplete crawling rather than genuine source conflict.

### C. Methodology Notes
- Search queries were run in parallel batches where possible
- batch_crawl_url_and_answer was used to extract structured information from API documentation pages
- Several URLs failed to crawl (lda.gov, CourtListener REST API v4.7 docs, case.law JavaScript-rendered content)
- Search budget was exhausted at 27/30 iterations, limiting coverage of all 50 states and full local/metro appendix

---

## 19. Search and Research Log

**Search queries executed (batch_web_search):**
- Congress.gov API documentation 2026
- OpenFEC API rate limits 2026
- GovInfo API bulk data 2026
- CourtListener API pricing membership 2026
- Ballotpedia API pricing 2026
- LegiScan API pricing tiers 2026
- OpenSecrets API status 2026
- Federal Register API documentation
- Regulations.gov API v4
- FEC campaign finance API endpoints
- state voter registration API by state 2026
- state election results API 2026
- state campaign finance disclosure API 2026
- state court opinions API free 2026
- district attorney office directory API
- US Attorney office directory justice.gov
- Open States API v3 documentation
- Democracy Works Elections API
- MIT Election Lab data download
- EAC EAVS report 2024 data
- Google Civic Information API shutdown 2025 alternative
- ProPublica Congress API discontinued
- PACER API alternative free
- Caselaw Access Project Harvard API
- Free Law Project Supreme Court API
- FollowTheMoney state campaign finance API
- VoteAmerica civic data API
- civicAPI election results
- AP Elections API v3.2
- LDA lobbying disclosure API
- Michigan voter registration API SOS
- California trusted party voter registration API
- Texas election results API secretary of state
- Florida election results API division of elections
- Pennsylvania election results API department of state
- Georgia election results API secretary of state
- Arizona election results API secretary of state
- North Carolina election results API state board of elections
- Ohio election results API secretary of state
- Wisconsin election results API commission
- state ethics commission campaign finance API list 2026
- NCSL campaign finance disclosure database state by state
- state supreme court opinions bulk download API
- state court of appeals API free access
- county election board API swing states
- county clerk election results API
- district attorney press release RSS feed
- US Attorney press release RSS feed justice.gov

**URLs crawled via batch_crawl_url_and_answer:**
- api.congress.gov
- api.open.fec.gov
- www.govinfo.gov/developers
- www.courtlistener.com/help/api/rest/v4/rest-api-v47/ (FAILED)
- www.opensecrets.org/open-data/api
- www.followthemoney.org/our-data/apis/
- legiscan.com/legiscan
- ballotpedia.org/Ballotpedia:Buy_Political_Data
- docs.openstates.org/api-v3/
- www.democracy.works/elections-api
- www.federalregister.gov/developers/documentation/api/v1
- open.gsa.gov/api/regulationsgov/
- lda.gov/api/redoc/v1/ (FAILED)
- free.law/projects/supreme-court-data/
- case.law (JavaScript-rendered, minimal content)
- www.eac.gov/research-and-data/studies-and-reports
- electionlab.mit.edu/data
- civicapi.org
- voteamericaplus.org/civic-data-api/
- developer.ap.org/ap-elections-api/

**Document indexed:**
- deep-research-handoff-us-civic-resources-data-dictionary[web-m3].md via compact_and_index_large_text_document and answer_from_indexed_large_text_document

---

## Data Limitations

1. **Crawl failures**: lda.gov/api/redoc/v1/, www.courtlistener.com/help/api/rest/v4/rest-api-v47/, and case.law (JavaScript-rendered) could not be fully analyzed — details on LDA API endpoints, CourtListener v4.7 rate limits, and Caselaw Access Project API specifics remain unverified.
2. **Incomplete state coverage**: Only 14 swing states were partially researched for voter registration and election results APIs; the remaining 36 states + DC + territories were not systematically crawled.
3. **Local/metro appendix incomplete**: County-level election board APIs and DA office resources for battleground metros were not fully mapped due to search budget exhaustion.
4. **API rate limit/pricing details**: Some sources (Congress.gov, California trusted-party API, various state ethics commissions) have unconfirmed rate limits or authentication requirements.
5. **Temporal gaps**: Some sources reference data "current through 2024" (FollowTheMoney) or have publication lags (EAC EAVS biennial); real-time accuracy cannot be guaranteed without live API testing.
6. **Discontinued services**: OpenSecrets API, ProPublica Congress API, Google Civic Information API, and GovTrack API are confirmed discontinued; alternatives (USgeocoder, VoteAmerica Plus, Congress.gov API) were identified but not exhaustively compared for feature parity.

This document represents a substantial but incomplete fulfillment of the handoff document's requirements. A follow-up research pass would be needed to: (1) verify the failed-crawl URLs, (2) complete the 50-state appendix, (3) fully populate the battleground-metro local appendix, and (4) conduct the "red-team review" and contradiction resolution steps specified in the original handoff's stopping criteria.
