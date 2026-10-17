# U.S. Civic & Legal Data Resources Data Dictionary

## Research metadata

- **Prepared:** October 17, 2026
- **Research cutoff:** October 17, 2026
- **Mode:** Deep-and-wide source mapping with a verified federal baseline, national state-directory layer, and prioritized swing-state local research queue
- **Jurisdictional order:** Federal → state/territory → local
- **Topical scope:** Voter information; elections and ballot measures; legislation and regulation; candidate and campaign-finance research; judicial dockets and opinions; U.S. Attorney and local prosecutor resources
- **Primary audience:** Civic-tech developers, data engineers, researchers, journalists, and product teams
- **Verification labels:** `Verified live` means the source was fetched during this research; `Directory verified` means a national directory was fetched but each downstream jurisdictional endpoint was not; `Needs recheck` means no live per-resource verification was completed

## Original request

Create a comprehensive data dictionary of voter, election, ballot, legislative, candidate, judicial, U.S. Attorney, and District Attorney information resources across the United States. Research federal sources first, then state sources, then local sources in major metropolitan areas within battleground and swing states. For every resource, capture product URLs, a concise content description, availability, and developer-access methods suitable for application integration.

## Resolved assumptions

| Question | Applied default |
|---|---|
| Swing-state scope | AZ, CO, FL, GA, IA, ME, MI, MN, NC, NH, NV, OH, PA, WI |
| Time horizon | Current resources plus historical data back to 2000 when supported |
| Candidate scope | Federal, statewide, state legislature, and prioritized swing-metro local candidates |
| Court scope | Federal courts, state supreme and intermediate appellate courts; trial-court availability flagged |
| Prosecutor scope | Federal USAO directory and feeds; local chief prosecutors prioritized for swing-state metros |
| Output | One combined Markdown document with tables and a documented JSON export schema |
| Developer access | Official APIs, feeds, bulk downloads, and documented exports; no unofficial scraping recipes |
| Territories | Puerto Rico and U.S. Virgin Islands included in the state-tier matrix; Guam, American Samoa, and CNMI treated through federal/territorial directories |
| Local definition | Principal counties of major MSAs, state-capital counties, and counties containing cities of at least 100,000 people |

## Executive summary

The U.S. civic-data ecosystem is not a single system. It is a federation of authoritative publishers whose technical maturity varies sharply by subject and jurisdiction. Federal legislative, regulatory, campaign-finance, and nonprofit judicial resources offer the strongest machine interfaces: Congress.gov exposes a documented API with API-key authentication and a published 5,000-request-per-hour limit; GovInfo offers an API plus structured XML/JSON bulk repositories; the Federal Register exposes an OpenAPI-described REST interface; the FEC offers a REST API and bulk campaign-finance files; and CourtListener provides a token-authenticated legal API plus bulk exports.[^1][^2][^3][^4][^5][^6]

Election administration is structurally different. Vote.gov is a federal navigation layer, not a voter-registration system, and explicitly directs users to state election websites. The Election Assistance Commission’s EAVS program provides the national analytical layer, including downloadable data and time series spanning 2004–2024, while FVAP publishes state-specific absentee-voting guidance for military and overseas voters. For operational voter registration, polling-place lookup, sample ballots, ballot tracking, local election results, and voter-file access rules, state and county publishers remain canonical.[^7][^8][^9][^10]

State coverage is broad but technically inconsistent. The National Association of Secretaries of State provides a live roster of chief state election officials and CanIVote links directly to state registration, registration-status, polling-place, identification, early-voting, overseas-voting, and local-official resources. NCSL and Open States supply national legislative discovery and normalization layers, while state legislature websites remain the authoritative source when status or text conflicts occur. For state courts, USA.gov provides a national court-discovery route, but docket access and developer interfaces must still be verified state by state.[^11][^12][^13][^14][^15]

Federal court data is split between official and open-access systems. PACER is the official nationwide entry point for federal appellate, district, and bankruptcy records; the PACER Case Locator is updated daily, while specific-court systems update in real time. PACER requires registration and generally charges $0.10 per page, caps most documents at $3, and waives quarterly charges of $30 or less. CourtListener and the RECAP archive provide free search, APIs, and bulk data for material already in the archive, but fetching absent PACER records still requires PACER credentials and can incur PACER fees.[^4][^5][^16][^17][^18][^19]

Prosecutorial information is the least standardized category. DOJ maintains a directory for the federal districts, office pages, consolidated press releases, and XML news feeds. DOJ’s own materials distinguish 94 federal judicial districts from 93 U.S. Attorneys because Guam and the Northern Mariana Islands share one U.S. Attorney. At the local level, office names, jurisdiction boundaries, leadership pages, disclosure practices, RSS support, and data products vary widely; the local appendix therefore treats every metro prosecutor row as an explicit verification task rather than inventing unsupported endpoints.[^20][^21][^22]

The most reliable application architecture is layered: ingest authoritative primary data when a stable API or bulk repository exists; use national directories for discovery; preserve source URLs and verification timestamps; and treat aggregators as normalization and search layers rather than replacements for primary records. This approach is especially important for election results, bill status, court opinions, and office leadership, where recency and source authority are more important than interface convenience.

## Key findings

1. **Federal legislative data is API-rich.** Congress.gov provides machine-readable legislative data with a documented 5,000-request-per-hour limit and page sizes up to 250 records.[^2]
2. **GovInfo is the federal bulk backbone.** Its repository includes bill text, bill status, bill summaries, CFR editions, eCFR XML, Federal Register data, and other collections, with XML and JSON directory views.[^23][^1]
3. **Election operations remain state and local.** Vote.gov directs users to state sites and does not itself register voters.[^7]
4. **EAVS is the strongest national election-administration dataset.** The EAC publishes reports, codebooks, surveys, CSV/Excel/statistical formats, and comprehensive 2004–2024 time series.[^8][^10]
5. **FVAP is the canonical UOCAVA guidance layer.** It publishes state-specific dates, deadlines, instructions, local-office contacts, FPCA guidance, and FWAB materials.[^24][^9][^25]
6. **FEC is the federal campaign-finance source of record.** Its API is updated nightly, permits 1,000 calls per hour with a standard key, and links records back to filing and image identifiers.[^6]
7. **PACER is authoritative but metered.** It covers federal court records, requires an account, and uses per-page pricing with a quarterly waiver threshold.[^17][^26][^19]
8. **CourtListener is the principal open legal-data overlay.** Its API supports legal research endpoints, uses concurrent minute/hour/day throttles by default, and offers bulk CSV datasets for case law, people, and financial disclosures.[^5][^4]
9. **State discovery is feasible nationally, but ingestion is not uniform.** NASS and CanIVote provide national election-office routing, while NCSL/Open States and USA.gov provide legislative and court discovery layers.[^12][^13][^14][^15]
10. **State campaign-finance architecture varies.** For example, Pennsylvania combines campaign-finance and lobbying disclosure functions, California’s Cal-Access covers candidates, donors, lobbyists, ballot measures, and committees, and Kansas divides administration and repository responsibilities across agencies.[^27][^28][^29]
11. **Federal prosecutor news is unusually feed-friendly.** DOJ publishes a consolidated USAO release stream and district-specific XML news feeds.[^30][^20]
12. **Local prosecutor data lacks a single authoritative national API.** National prosecutor associations are useful discovery aids, but office-level leadership and publication practices require direct verification.[^31][^32]

## Scope and definitions

### Topical categories

- **Voter information:** registration guidance, registration-status lookup, polling-place lookup, voter identification, absentee/early voting, accessibility, overseas voting, voter-file rules
- **Elections and ballots:** election calendars, candidate lists, sample ballots, ballot measures, ballot tracking, unofficial results, canvasses, precinct results, historical returns
- **Legislation and regulation:** bills, resolutions, amendments, sponsors, committees, actions, votes, public laws, codes, session laws, regulations, dockets, hearings, lobbying disclosures
- **Candidate research:** candidate identifiers, biographies, office sought, financial disclosures, campaign committees, receipts, expenditures, independent expenditures, lobbying and related disclosures
- **Judicial resources:** dockets, filings, opinions, oral arguments, citations, judges, vacancies, financial disclosures
- **Prosecutorial resources:** U.S. Attorney and local chief-prosecutor directories, leadership, jurisdiction, contact data, releases, annual reports, charging statistics

### Jurisdictional tiers

- **Federal:** Federal agencies, Congress, federal courts, national federal-election and prosecutorial sources
- **State:** 50 states, District of Columbia, Puerto Rico, and U.S. Virgin Islands
- **Local:** Prioritized county/city offices in the 14-state swing-state set

### Exclusions

- Partisan voter-targeting products and commercial voter files
- Personal voter information not lawfully published for public use
- Undocumented scraping workarounds
- Substantive legal advice or political evaluation
- Fabricated URLs, APIs, rate limits, leadership names, or coverage claims

## Methodology

Research followed a source-authority hierarchy: primary government publishers; judicial-branch publishers; official data portals; intergovernmental directories; established nonprofit and academic sources; commercial sources only where necessary. Search results were used for discovery, and claims in this document are limited to fetched pages or are explicitly labeled as scope seeds requiring verification.

Verification was performed at the resource-family level for federal products and national directories. The state matrix intentionally uses verified national discovery endpoints when per-state product pages were not fetched. Local metro rows are presented as a verification queue, not as completed live-resource records. This distinction prevents an attractive but unreliable table of guessed URLs.

Each developer-access entry records the strongest documented method available: API, bulk download, RSS/XML feed, downloadable dataset, or web-only. Authentication, rate limits, and formats are stated only when present in fetched documentation.

## Topical deep dives

### Voter information

The federal layer is primarily guidance, coordination, and national research. Vote.gov provides official multilingual voting guidance and routes people to state systems; it does not collect or store voter-registration data and does not register voters. FVAP focuses on UOCAVA voters and publishes the Voting Assistance Guide, election dates and deadlines, local-election-office contacts, and FPCA/FWAB materials.[^9][^25][^24][^7]

EAC’s EAVS is the national analytical dataset rather than an operational voter lookup. Its data covers registration and list maintenance, UOCAVA, mail voting, in-person polling, provisional ballots, participation, and election technology, with downloadable codebooks and multiple machine-readable formats. State and local election officials remain canonical for operational registration status, polling places, local ballots, and voter-file access.[^10][^8]

NASS’s CanIVote is the strongest national discovery layer for operational state resources. It links users to registration, registration-status, polling-place, voter-ID, early/absentee-voting, overseas-voter, and local-official resources without capturing user information.[^15]

### Elections and ballots

Election-result publication is decentralized. State election agencies usually publish statewide and certified results, while county election offices may publish unofficial election-night, precinct-level, statement-of-votes, canvass, sample-ballot, and ballot-tracking resources. The resolution, format, and archival depth therefore require jurisdiction-specific verification.

EAVS complements result data by describing election administration and provides state/local comparison through downloadable datasets and a Power BI interactive. MIT Election Data and Science Lab supplies academic datasets and repositories, including historical returns and precinct projects, but its data should be treated as an analytical overlay rather than the legal record.[^33][^34][^35][^10]

### Legislation and regulation

Congress.gov is the primary federal legislative tracking interface. Its API supports reuse of Congress.gov collections, requires an API key, publishes a 5,000-request-per-hour limit, and supports result windows up to 250 items. GovInfo complements Congress.gov with official packages and bulk XML/JSON for bill text, status, summaries, the CFR, Federal Register, and other government publications.[^1][^2]

The Federal Register API exposes documents published since 1994 through an OpenAPI-described interface, including document search, metadata fields, agency filters, CFR references, docket identifiers, dates, and document URLs. The eCFR also exposes developer documentation under `ecfr.gov`, while GovInfo offers bulk current eCFR XML.[^3][^36][^1]

At the state level, the authoritative source is each legislature’s own bill system. NCSL offers 50-state bill-tracking databases, while Open States provides normalized GraphQL access to jurisdictions, sessions, organizations, people, bills, actions, documents, versions, and source links. When an aggregator and state legislature disagree, downstream systems should preserve both records but treat the state source as canonical.[^11][^12]

### Candidate research

FEC data should anchor federal candidate and committee research. The OpenFEC API provides full-text and field-specific search, links records to filings and images, updates nightly, permits 1,000 calls per hour with a normal key, and limits pages to 100 results. For large historical jobs, the FEC’s bulk files are preferable to high-volume API pagination.[^6]

Vote Smart exposes XML or JSON methods for candidate biographies, candidate lookup, offices, local officials, bills, and votes. It is a useful enrichment source, but filing agencies remain authoritative for ballot status, committees, and financial disclosures.[^37][^38][^39][^40]

State campaign-finance systems vary by agency and schema. Pennsylvania publishes searchable reports for candidates and committees and combines campaign-finance and lobbying disclosure functions; California Cal-Access covers campaign-finance and lobbying activity; Kansas separates statutory administration from the state repository.[^41][^28][^29][^27]

### Judicial resources

PACER is the official federal docket and filing system. The national Case Locator covers appellate, bankruptcy, and district records and updates daily; direct court systems update as filings occur. PACER registration is free, but record access is generally metered, with opinions available without document charges to registered users and a separate GovInfo opinions collection covering many courts.[^26][^18][^19][^42][^17]

CourtListener provides search, docket, opinion, person, oral-argument, citation, financial-disclosure, and RECAP interfaces. Its default authenticated API throttles are 5 requests per minute, 50 per hour, and 125 per day, with membership and commercial paths for higher access. Bulk data is the preferred route for large datasets.[^4][^5]

State judicial systems are less uniform. USA.gov provides a directory path to state and territorial courts and advises users to locate county or municipal courts through the relevant state judiciary. Each state therefore requires direct verification of appellate dockets, opinion archives, oral-argument media, judge rosters, and trial-court coverage.[^13]

### Prosecutorial resources

DOJ’s USAO directory provides district selection, office contacts, leadership, and news. DOJ distinguishes 94 judicial districts from 93 U.S. Attorneys because Guam and the Northern Mariana Islands share one official. Consolidated releases and district XML feeds offer a practical ingest path for news monitoring.[^43][^21][^22][^30][^20]

Local prosecutors use varying titles, including District Attorney, State’s Attorney, Commonwealth’s Attorney, County Attorney, and Prosecuting Attorney. The National Association of Prosecutor Coordinators lists state-level coordination bodies, and the National District Attorneys Association provides research and professional resources, but neither substitutes for direct office verification.[^32][^44][^31]

## Master data dictionary

### Federal and national resources

| Resource | Organization | Category | Tier | Product URL | Content summary | Availability | Developer access | Cadence | Authority | Verification | Caveats |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Vote.gov | GSA TTS | Voter information | Federal | [https://vote.gov/](https://vote.gov/) | Official registration and voting guidance with state handoff | Free | Web; state links; no voter-data API documented | Ongoing | Primary government | Verified live 2026-10-17 [^7] | Does not register voters |
| EAVS Studies and Reports | U.S. EAC | Voter/election data | Federal | [https://www.eac.gov/research-and-data/studies-and-reports](https://www.eac.gov/research-and-data/studies-and-reports) | Reports, codebooks, survey instruments, and datasets from 2004 onward | Free | CSV, Excel, SPSS, Stata, SAS; downloadable Power BI | Biennial with revisions | Primary government | Verified live 2026-10-17 [^10] | Analytical, not live election operations |
| EAVS Time Series | U.S. EAC | Election administration | Federal | [https://www.eac.gov/research-and-data/eavs-retrospective](https://www.eac.gov/research-and-data/eavs-retrospective) | Comprehensive 2004–2024 time series, including county-collapsed files | Free | Downloadable datasets and replication files | Periodic | Primary government | Verified live 2026-10-17 [^8] | Check errata and version |
| EAVS Interactive | U.S. EAC | Election administration | Federal | [https://www.eac.gov/research-and-data/studies-and-reports/eavs-data-interactive](https://www.eac.gov/research-and-data/studies-and-reports/eavs-data-interactive) | State, territory, and county comparative visual exploration | Free | Public Power BI; downloadable prior Power BI packages | Election cycle | Primary government | Verified live 2026-10-17 [^33] | Prefer raw files for ingestion |
| FVAP | U.S. Department of Defense | Overseas/military voting | Federal | [https://www.fvap.gov/](https://www.fvap.gov/) | UOCAVA registration, ballot requests, deadlines, office lookup, FWAB | Free | Web, PDFs, downloadable materials | Continuous/per cycle | Primary government | Verified live 2026-10-17 [^25] | Operational rules remain state-specific |
| Voting Assistance Guide | FVAP | Overseas/military voting | Federal | [https://www.fvap.gov/guide](https://www.fvap.gov/guide) | State-specific absentee-voting rules and forms | Free | Web and PDF | 2-year guide plus updates | Primary government | Verified live 2026-10-17 [^9] | Use errata/current online rules |
| CanIVote | NASS | State voter discovery | National | [https://www.nass.org/can-I-vote](https://www.nass.org/can-I-vote) | Links to state registration, status, polling, ID, absentee, and officials | Free | Link directory; no API documented | Ongoing | Intergovernmental | Verified live 2026-10-17 [^15] | Discovery layer, not source of record |
| NASS CEO Roster | NASS | Election officials | National | [https://www.nass.org/memberships/secretaries-statelieutenant-governors](https://www.nass.org/memberships/secretaries-statelieutenant-governors) | Chief state election officials and contact data | Free | Web table | Ongoing | Intergovernmental | Verified live 2026-10-17 [^14] | Leadership changes require recheck |
| Congress.gov API | Library of Congress | Legislation | Federal | [https://github.com/LibraryOfCongress/api.congress.gov/](https://github.com/LibraryOfCongress/api.congress.gov/) | Machine-readable Congress.gov collections | Free with key | REST; JSON/XML; api.data.gov key; 5,000/hour; max 250/page | Near daily/session | Primary government | Verified live 2026-10-17 [^2] | Preserve Congress/session identifiers |
| GovInfo Developer Hub | U.S. GPO | Legislation/publications | Federal | [https://www.govinfo.gov/developers](https://www.govinfo.gov/developers) | API, bulk data, sitemaps, link service | Free with key for API | API key; XML/JSON bulk; schemas and guides | Daily/collection-specific | Primary government | Verified live 2026-10-17 [^1] | Collection coverage varies |
| GovInfo Bulk Repository | U.S. GPO | Legislation/regulation | Federal | [https://www.govinfo.gov/bulkdata/](https://www.govinfo.gov/bulkdata/) | Bill, CFR, Federal Register, and other structured collections | Free | XML; directory-level XML/JSON listings | Collection-specific | Primary government | Verified live 2026-10-17 [^23] | Prefer bulk for full synchronization |
| Federal Register API | NARA/GPO | Regulation | Federal | [https://www.federalregister.gov/api/v1/documentation.json](https://www.federalregister.gov/api/v1/documentation.json) | Rules, proposed rules, notices, presidential documents, agencies, metadata | Free | REST/OpenAPI; JSON; official spec | Federal business days | Primary government | Verified live 2026-10-17 [^3] | API is not the CFR itself |
| eCFR API docs | GPO/OFR | Regulation | Federal | [https://www.ecfr.gov/developers/documentation/api/v1](https://www.ecfr.gov/developers/documentation/api/v1) | Current eCFR developer interface | Free | HTTP API documentation | Current/continuous | Primary government | Verified live 2026-10-17 [^36] | eCFR is editorial compilation, not annual CFR edition |
| OpenFEC API | Federal Election Commission | Campaign finance | Federal | [https://api.open.fec.gov/developers/](https://api.open.fec.gov/developers/) | Candidates, committees, filings, schedules, totals, reports | Free with key | REST/JSON; 1,000 calls/hour; 100 results/page; higher tier by request | Nightly | Primary government | Verified live 2026-10-17 [^6] | Contributor-list use restrictions apply |
| PACER | Administrative Office of U.S. Courts | Dockets/filings | Federal | [https://pacer.uscourts.gov/](https://pacer.uscourts.gov/) | Official federal appellate, district, and bankruptcy records | Registration; metered | Court web systems; no general public bulk API documented | Real time by court | Primary judiciary | Verified live 2026-10-17 [^19] | $0.10/page; most docs capped at $3; quarterly waiver ≤$30 |
| PACER Case Locator | Administrative Office of U.S. Courts | Case index | Federal | [https://pacer.uscourts.gov/find-case/search-national-index](https://pacer.uscourts.gov/find-case/search-national-index) | Nationwide index of federal cases | Registration; metered | Web search | Daily | Primary judiciary | Verified live 2026-10-17 [^45] | Direct-court search is more current |
| Court CM/ECF Lookup | Administrative Office of U.S. Courts | Court endpoints | Federal | [https://pacer.uscourts.gov/file-case/court-cmecf-lookup](https://pacer.uscourts.gov/file-case/court-cmecf-lookup) | Court-specific CM/ECF, contact, RSS, code, and flag links | Free directory | Web directory; court-specific RSS where present | Ongoing | Primary judiciary | Verified live 2026-10-17 [^46] | Each court differs |
| Federal Court Opinions | PACER/GovInfo | Opinions | Federal | [https://pacer.uscourts.gov/find-case/court-opinions](https://pacer.uscourts.gov/find-case/court-opinions) | Free opinions through PACER and GovInfo partnership | Free/registration | Search and collection downloads | Ongoing | Primary judiciary | Verified live 2026-10-17 [^42] | Coverage begins April 2004 for listed GovInfo collection |
| CourtListener REST API | Free Law Project | Case law/dockets | National | [https://www.courtlistener.com/help/api/rest/](https://www.courtlistener.com/help/api/rest/) | Opinions, dockets, RECAP, people, oral arguments, citations | Free account; membership/commercial tiers | REST v4; token auth; default 5/min, 50/hour, 125/day | Continuous | Nonprofit aggregator | Verified live 2026-10-17 [^4] | Not authoritative when court source differs |
| CourtListener Bulk Data | Free Law Project | Legal bulk data | National | [https://www.courtlistener.com/help/api/](https://www.courtlistener.com/help/api/) | CSV exports for case law, people, financial disclosures | Membership/commercial terms may apply | Bulk CSV | Periodic | Nonprofit aggregator | Verified live 2026-10-17 [^5] | Check licensing and membership terms |
| RECAP Fetch API | Free Law Project | PACER acquisition | Federal | [https://www.courtlistener.com/help/api/rest/recap/](https://www.courtlistener.com/help/api/rest/recap/) | Requests missing PACER dockets/documents using user credentials | API free; PACER charges may apply | REST; PACER credentials; 30 queue requests/minute | On demand | Nonprofit overlay | Verified live 2026-10-17 [^16] | Not a way to avoid PACER billing |
| Federal Court Finder | U.S. Courts | Court directory | Federal | [https://www.uscourts.gov/federal-court-finder/find](https://www.uscourts.gov/federal-court-finder/find) | Court lookup by name or location | Free | Web | Ongoing | Primary judiciary | Verified live 2026-10-17 [^47] | Directory only |
| USA.gov Courts | GSA | Court discovery | National | [https://www.usa.gov/courts](https://www.usa.gov/courts) | Federal, state, territorial, county, and municipal court discovery | Free | Web directory | Ongoing | Primary government | Verified live 2026-10-17 [^13] | Follow through to judiciary source |
| DOJ USAO Directory | U.S. DOJ | Prosecutors | Federal | [https://www.justice.gov/usao/find-your-united-states-attorney](https://www.justice.gov/usao/find-your-united-states-attorney) | District, leadership, contacts, and office news | Free | Web directory | Ongoing | Primary government | Verified live 2026-10-17 [^43] | Leadership is time-sensitive |
| USAO Consolidated Releases | U.S. DOJ | Prosecutor news | Federal | [https://www.justice.gov/usao/pressreleases](https://www.justice.gov/usao/pressreleases) | Releases across U.S. Attorney offices | Free | Web; pair with RSS page | Daily | Primary government | Verified live 2026-10-17 [^30] | Releases are allegations/announcements, not case dockets |
| USAO News Feeds | U.S. DOJ | Prosecutor news | Federal | [https://www.justice.gov/usao/rss](https://www.justice.gov/usao/rss) | District-specific XML feeds | Free | RSS/XML | Daily/as published | Primary government | Verified live 2026-10-17 [^20] | Feed list page shows an older update date; test each feed |
| Open States API | Plural/Open States | State legislation | State/national | [https://docs.openstates.org/api-v2/examples/](https://docs.openstates.org/api-v2/examples/) | Normalized jurisdictions, sessions, organizations, people, bills, actions, documents | Access terms vary | GraphQL | Ongoing | Aggregator | Verified live 2026-10-17 [^11] | State source remains canonical |
| NCSL Research Databases | NCSL | State legislation | State/national | [https://www.ncsl.org/research](https://www.ncsl.org/research) | 50-state policy and bill-tracking databases | Free/hybrid | Web databases; no universal public API documented | Session/topic specific | Intergovernmental | Verified live 2026-10-17 [^12] | Database coverage varies by topic |
| Vote Smart API | Project Vote Smart | Candidates/votes | National | [https://api.votesmart.org/docs/](https://api.votesmart.org/docs/) | Candidate bios, offices, elections, local officials, bills, and votes | Key/terms require review | XML or JSON API | Ongoing | Nonprofit aggregator | Verified snapshot 2026-10-17 [^37] | Some historical vote summaries have documented caveats |
| MIT Election Lab | MIT MEDSL | Election research | National | [https://electionlab.mit.edu/](https://electionlab.mit.edu/) | Historical returns, precinct projects, election-administration research | Free/repository terms | Downloads, GitHub, Dataverse | Project-specific | Academic | Verified snapshot 2026-10-17 [^34][^35] | Analytical overlay, not legal record |
| NAPC Prosecutor Coordinators | National Association of Prosecutor Coordinators | Prosecutor discovery | State | [https://www.napc.us/about-napc/prosecutor-coordinators/](https://www.napc.us/about-napc/prosecutor-coordinators/) | State prosecutor-coordination organizations and contacts | Free | Web directory | Ongoing | Association | Verified live 2026-10-17 [^31] | Not a complete local prosecutor roster |
| NDAA | National District Attorneys Association | Prosecutor research | National | [https://www.ndaa.org/](https://www.ndaa.org/) | Prosecutor research, technical assistance, training, resources | Free/hybrid membership | Web; no public national DA API verified | Ongoing | Association | Verified live 2026-10-17 [^32][^44] | Not source of record for office leadership |

### Selected state examples

| Resource | Jurisdiction | Category | Product URL | Availability | Developer access | Verification | Notes |
|---|---|---|---|---|---|---|---|
| Cal-Access | California | Campaign finance/lobbying | [https://cal-access.sos.ca.gov/](https://cal-access.sos.ca.gov/) | Free | Web search/download options require endpoint review | Verified live 2026-10-17 [^29] | Candidate, donor, lobbyist, committee, ballot-measure data |
| PA Campaign Finance & Lobbying Disclosure | Pennsylvania | Campaign finance/lobbying | [https://www.pa.gov/agencies/dos/department-and-offices/bcfld](https://www.pa.gov/agencies/dos/department-and-offices/bcfld) | Free | Web database; bulk/API not verified | Verified live 2026-10-17 [^27][^41] | Covers statewide, legislative, judicial, and committee filings |
| Kansas Public Disclosure Commission | Kansas | Campaign finance | [https://kpdc.kansas.gov/campaign-finance/](https://kpdc.kansas.gov/campaign-finance/) | Free | Web/forms; API not verified | Verified live 2026-10-17 [^28] | SOS is repository for state-level forms |
| New York Campaign Finance | New York | Campaign finance/ballot access | [https://elections.ny.gov/campaign-finance](https://elections.ny.gov/campaign-finance) | Free | Public Reporting web system; API not verified | Verified live 2026-10-17 [^48] | Includes disclosure and ballot-access documents |
| Washington Court Directory | Washington | Judicial directory | [https://www.courts.wa.gov/court_dir/](https://www.courts.wa.gov/court_dir/) | Free | Web and downloadable PDF | Verified live 2026-10-17 [^49] | Covers appellate and local court types |

## State-by-state canonical discovery matrix

The following matrix is a complete jurisdictional index, not a claim that every downstream endpoint has been individually verified. Election discovery uses NASS/CanIVote; legislation uses NCSL/Open States; courts use USA.gov’s state/territory routing; campaign-finance discovery uses the FEC combined federal/state directory and direct state follow-through.[^50][^12][^13][^15][^11]

| Jurisdiction | Elections/voter discovery | Legislation discovery | Courts discovery | Campaign-finance discovery | Verification |
|---|---|---|---|---|---|
| Alabama | CanIVote / NASS CEO roster | NCSL / Open States | USA.gov courts | FEC federal/state directory | Directory verified |
| Alaska | CanIVote / NASS CEO roster | NCSL / Open States | USA.gov courts | FEC federal/state directory | Directory verified |
| Arizona | CanIVote / NASS CEO roster | NCSL / Open States | USA.gov courts | FEC federal/state directory | Directory verified |
| Arkansas | CanIVote / NASS CEO roster | NCSL / Open States | USA.gov courts | FEC federal/state directory | Directory verified |
| California | CanIVote / NASS CEO roster | NCSL / Open States | USA.gov courts | Cal-Access | Campaign-finance endpoint verified |
| Colorado | CanIVote / NASS CEO roster | NCSL / Open States | USA.gov courts | FEC federal/state directory | Directory verified |
| Connecticut | CanIVote / NASS CEO roster | NCSL / Open States | USA.gov courts | FEC federal/state directory | Directory verified |
| Delaware | CanIVote / NASS CEO roster | NCSL / Open States | USA.gov courts | FEC federal/state directory | Directory verified |
| District of Columbia | CanIVote / NASS CEO roster | NCSL / Open States | USA.gov courts | FEC federal/state directory | Directory verified |
| Florida | CanIVote / NASS CEO roster | NCSL / Open States | USA.gov courts | FEC federal/state directory | Directory verified |
| Georgia | CanIVote / NASS CEO roster | NCSL / Open States | USA.gov courts | FEC federal/state directory | Directory verified |
| Hawaii | CanIVote / NASS CEO roster | NCSL / Open States | USA.gov courts | FEC federal/state directory | Directory verified |
| Idaho | CanIVote / NASS CEO roster | NCSL / Open States | USA.gov courts | FEC federal/state directory | Directory verified |
| Illinois | CanIVote / NASS CEO roster | NCSL / Open States | USA.gov courts | FEC federal/state directory | Directory verified |
| Indiana | CanIVote / NASS CEO roster | NCSL / Open States | USA.gov courts | FEC federal/state directory | Directory verified |
| Iowa | CanIVote / NASS CEO roster | NCSL / Open States | USA.gov courts | FEC federal/state directory | Directory verified |
| Kansas | CanIVote / NASS CEO roster | NCSL / Open States | USA.gov courts | KPDC / SOS | Campaign-finance endpoint verified |
| Kentucky | CanIVote / NASS CEO roster | NCSL / Open States | USA.gov courts | FEC federal/state directory | Directory verified |
| Louisiana | CanIVote / NASS CEO roster | NCSL / Open States | USA.gov courts | Louisiana Ethics/LEADERS | Agency verified [^51] |
| Maine | CanIVote / NASS CEO roster | NCSL / Open States | USA.gov courts | FEC federal/state directory | Directory verified |
| Maryland | CanIVote / NASS CEO roster | NCSL / Open States | USA.gov courts | FEC federal/state directory | Directory verified |
| Massachusetts | CanIVote / NASS CEO roster | NCSL / Open States | USA.gov courts | FEC federal/state directory | Directory verified |
| Michigan | CanIVote / NASS CEO roster | NCSL / Open States | USA.gov courts | FEC federal/state directory | Directory verified |
| Minnesota | CanIVote / NASS CEO roster | NCSL / Open States | USA.gov courts | FEC federal/state directory | Directory verified |
| Mississippi | CanIVote / NASS CEO roster | NCSL / Open States | USA.gov courts | FEC federal/state directory | Directory verified |
| Missouri | CanIVote / NASS CEO roster | NCSL / Open States | USA.gov courts | FEC federal/state directory | Directory verified |
| Montana | CanIVote / NASS CEO roster | NCSL / Open States | USA.gov courts | FEC federal/state directory | Directory verified |
| Nebraska | CanIVote / NASS CEO roster | NCSL / Open States | USA.gov courts | FEC federal/state directory | Directory verified |
| Nevada | CanIVote / NASS CEO roster | NCSL / Open States | USA.gov courts | FEC federal/state directory | Directory verified |
| New Hampshire | CanIVote / NASS CEO roster | NCSL / Open States | USA.gov courts | FEC federal/state directory | Directory verified |
| New Jersey | CanIVote / NASS CEO roster | NCSL / Open States | USA.gov courts | FEC federal/state directory | Directory verified |
| New Mexico | CanIVote / NASS CEO roster | NCSL / Open States | USA.gov courts | FEC federal/state directory | Directory verified |
| New York | CanIVote / NASS CEO roster | NCSL / Open States | USA.gov courts | NYSBOE Public Reporting | Campaign-finance endpoint verified |
| North Carolina | CanIVote / NASS CEO roster | NCSL / Open States | USA.gov courts | FEC federal/state directory | Directory verified |
| North Dakota | CanIVote / NASS CEO roster | NCSL / Open States | USA.gov courts | FEC federal/state directory | Directory verified |
| Ohio | CanIVote / NASS CEO roster | NCSL / Open States | USA.gov courts | FEC federal/state directory | Directory verified |
| Oklahoma | CanIVote / NASS CEO roster | NCSL / Open States | USA.gov courts | FEC federal/state directory | Directory verified |
| Oregon | CanIVote / NASS CEO roster | NCSL / Open States | USA.gov courts | FEC federal/state directory | Directory verified |
| Pennsylvania | CanIVote / NASS CEO roster | NCSL / Open States | USA.gov courts | PA Campaign Finance | Endpoint verified |
| Rhode Island | CanIVote / NASS CEO roster | NCSL / Open States | USA.gov courts | FEC federal/state directory | Directory verified |
| South Carolina | CanIVote / NASS CEO roster | NCSL / Open States | USA.gov courts | FEC federal/state directory | Directory verified |
| South Dakota | CanIVote / NASS CEO roster | NCSL / Open States | USA.gov courts | FEC federal/state directory | Directory verified |
| Tennessee | CanIVote / NASS CEO roster | NCSL / Open States | USA.gov courts | FEC federal/state directory | Directory verified |
| Texas | CanIVote / NASS CEO roster | NCSL / Open States | USA.gov courts | FEC federal/state directory | Directory verified |
| Utah | CanIVote / NASS CEO roster | NCSL / Open States | USA.gov courts | FEC federal/state directory | Directory verified |
| Vermont | CanIVote / NASS CEO roster | NCSL / Open States | USA.gov courts | FEC federal/state directory | Directory verified |
| Virginia | CanIVote / NASS CEO roster | NCSL / Open States | USA.gov courts | FEC federal/state directory | Directory verified |
| Washington | CanIVote / NASS CEO roster | NCSL / Open States | WA court directory | FEC federal/state directory | Court endpoint verified |
| West Virginia | CanIVote / NASS CEO roster | NCSL / Open States | USA.gov courts | FEC federal/state directory | Directory verified |
| Wisconsin | CanIVote / NASS CEO roster | NCSL / Open States | USA.gov courts | FEC federal/state directory | Directory verified |
| Wyoming | CanIVote / NASS CEO roster | NCSL / Open States | USA.gov courts | FEC federal/state directory | Directory verified |
| Puerto Rico | NASS roster / territorial election commission follow-through | NCSL/Open States where covered | USA.gov courts | FEC federal/state directory | Directory verified |
| U.S. Virgin Islands | NASS roster / territorial election system follow-through | NCSL/Open States where covered | USA.gov courts | FEC federal/state directory | Directory verified |

### Directory URLs

- Election officials: [https://www.nass.org/memberships/secretaries-statelieutenant-governors](https://www.nass.org/memberships/secretaries-statelieutenant-governors)
- State voter services: [https://www.nass.org/can-I-vote](https://www.nass.org/can-I-vote)
- State legislation research: [https://www.ncsl.org/research](https://www.ncsl.org/research)
- Open States API examples: [https://docs.openstates.org/api-v2/examples/](https://docs.openstates.org/api-v2/examples/)
- State and territorial courts: [https://www.usa.gov/courts](https://www.usa.gov/courts)
- Federal/state disclosure directory: [https://www.fec.gov/resources/cms-content/documents/cfsded.pdf](https://www.fec.gov/resources/cms-content/documents/cfsded.pdf)

## Battleground-state local appendix

This is the prioritized local research queue produced by the default metro rule. No office URL or leadership name is asserted unless fetched. For every row, the implementation task is to verify: election office; results and ballot endpoints; candidate filing; local campaign finance; trial-court docket; chief prosecutor; press/RSS; open-data portal; downloadable or API formats.

| State | Priority metro/county seed | Election office | Candidate filing | Court/docket | Chief prosecutor | Status |
|---|---|---|---|---|---|---|
| Arizona | Maricopa County / Phoenix | Verify county recorder/elections | Verify | Verify state/local court portal | County Attorney | Needs recheck |
| Arizona | Pima County / Tucson | Verify | Verify | Verify | County Attorney | Needs recheck |
| Colorado | Denver | Verify consolidated election division | Verify | Verify | District Attorney | Needs recheck |
| Colorado | El Paso County / Colorado Springs | Verify | Verify | Verify | District Attorney | Needs recheck |
| Colorado | Arapahoe–Jefferson–Adams / Denver metro | Verify each county | Verify | Verify | District Attorney by district | Needs recheck |
| Florida | Miami-Dade | Verify supervisor of elections | Verify | Verify clerk/courts | State Attorney | Needs recheck |
| Florida | Broward / Fort Lauderdale | Verify | Verify | Verify | State Attorney | Needs recheck |
| Florida | Hillsborough / Tampa | Verify | Verify | Verify | State Attorney | Needs recheck |
| Florida | Orange / Orlando | Verify | Verify | Verify | State Attorney | Needs recheck |
| Florida | Duval / Jacksonville | Verify | Verify | Verify | State Attorney | Needs recheck |
| Florida | Leon / Tallahassee | Verify | Verify | Verify | State Attorney | Needs recheck |
| Georgia | Fulton / Atlanta | Verify county elections | Verify | Verify | District Attorney | Needs recheck |
| Georgia | DeKalb / Atlanta | Verify | Verify | Verify | District Attorney | Needs recheck |
| Georgia | Cobb / Atlanta | Verify | Verify | Verify | District Attorney | Needs recheck |
| Georgia | Chatham / Savannah | Verify | Verify | Verify | District Attorney | Needs recheck |
| Georgia | Richmond / Augusta | Verify | Verify | Verify | District Attorney | Needs recheck |
| Iowa | Polk / Des Moines | Verify county auditor | Verify | Verify | County Attorney | Needs recheck |
| Iowa | Linn / Cedar Rapids | Verify | Verify | Verify | County Attorney | Needs recheck |
| Iowa | Scott / Davenport | Verify | Verify | Verify | County Attorney | Needs recheck |
| Maine | Cumberland / Portland | Verify municipal/state election split | Verify | Verify | District Attorney | Needs recheck |
| Maine | Kennebec / Augusta | Verify | Verify | Verify | District Attorney | Needs recheck |
| Michigan | Wayne / Detroit | Verify county clerk/elections | Verify | Verify | Prosecuting Attorney | Needs recheck |
| Michigan | Oakland / Detroit metro | Verify | Verify | Verify | Prosecuting Attorney | Needs recheck |
| Michigan | Macomb / Detroit metro | Verify | Verify | Verify | Prosecuting Attorney | Needs recheck |
| Michigan | Kent / Grand Rapids | Verify | Verify | Verify | Prosecuting Attorney | Needs recheck |
| Michigan | Ingham / Lansing | Verify | Verify | Verify | Prosecuting Attorney | Needs recheck |
| Minnesota | Hennepin / Minneapolis | Verify county elections | Verify | Verify | County Attorney | Needs recheck |
| Minnesota | Ramsey / St. Paul | Verify | Verify | Verify | County Attorney | Needs recheck |
| Minnesota | Olmsted / Rochester | Verify | Verify | Verify | County Attorney | Needs recheck |
| Nevada | Clark / Las Vegas | Verify county elections | Verify | Verify | District Attorney | Needs recheck |
| Nevada | Washoe / Reno | Verify | Verify | Verify | District Attorney | Needs recheck |
| Nevada | Carson City | Verify consolidated office | Verify | Verify | District Attorney | Needs recheck |
| New Hampshire | Hillsborough / Manchester–Nashua | Verify municipal/state split | Verify | Verify | County Attorney | Needs recheck |
| New Hampshire | Merrimack / Concord | Verify | Verify | Verify | County Attorney | Needs recheck |
| North Carolina | Mecklenburg / Charlotte | Verify county board of elections | Verify | Verify | District Attorney | Needs recheck |
| North Carolina | Wake / Raleigh | Verify | Verify | Verify | District Attorney | Needs recheck |
| North Carolina | Guilford / Greensboro | Verify | Verify | Verify | District Attorney | Needs recheck |
| North Carolina | Forsyth / Winston-Salem | Verify | Verify | Verify | District Attorney | Needs recheck |
| North Carolina | Durham | Verify | Verify | Verify | District Attorney | Needs recheck |
| Ohio | Franklin / Columbus | Verify county board of elections | Verify | Verify | Prosecuting Attorney | Needs recheck |
| Ohio | Cuyahoga / Cleveland | Verify | Verify | Verify | Prosecuting Attorney | Needs recheck |
| Ohio | Hamilton / Cincinnati | Verify | Verify | Verify | Prosecuting Attorney | Needs recheck |
| Ohio | Montgomery / Dayton | Verify | Verify | Verify | Prosecuting Attorney | Needs recheck |
| Ohio | Lucas / Toledo | Verify | Verify | Verify | Prosecuting Attorney | Needs recheck |
| Pennsylvania | Philadelphia | Verify city commissioners | Verify | Verify | District Attorney | Needs recheck |
| Pennsylvania | Allegheny / Pittsburgh | Verify county elections | Verify | Verify | District Attorney | Needs recheck |
| Pennsylvania | Dauphin / Harrisburg | Verify | Verify | Verify | District Attorney | Needs recheck |
| Pennsylvania | Lehigh / Allentown | Verify | Verify | Verify | District Attorney | Needs recheck |
| Pennsylvania | Erie | Verify | Verify | Verify | District Attorney | Needs recheck |
| Wisconsin | Milwaukee | Verify county election commission | Verify | Verify | District Attorney | Needs recheck |
| Wisconsin | Dane / Madison | Verify | Verify | Verify | District Attorney | Needs recheck |
| Wisconsin | Brown / Green Bay | Verify | Verify | Verify | District Attorney | Needs recheck |
| Wisconsin | Waukesha | Verify | Verify | Verify | District Attorney | Needs recheck |

## Developer resources appendix

| Resource | Base/docs URL | Auth | Formats | Published limits | Recommended ingest pattern |
|---|---|---|---|---|---|
| Congress.gov API | [https://api.congress.gov/v3](https://api.congress.gov/v3) / GitHub docs | api.data.gov key | JSON, XML | 5,000 requests/hour; 250 records/page [^2] | Incremental API sync keyed by update date and Congress |
| GovInfo API | [https://api.govinfo.gov/docs/](https://api.govinfo.gov/docs/) | api.data.gov key | JSON metadata/packages | Endpoint-specific; search page max 1,000 [^52][^53] | API for deltas; bulk repository for full loads |
| GovInfo Bulk | [https://www.govinfo.gov/bulkdata/](https://www.govinfo.gov/bulkdata/) | None | XML; XML/JSON directory views | Not stated | Mirror selected collections; retain package identifiers |
| Federal Register API | [https://www.federalregister.gov/api/v1/documentation.json](https://www.federalregister.gov/api/v1/documentation.json) | None documented in official spec result | JSON/OpenAPI | Endpoint-specific | Poll by publication date/document number |
| eCFR | [https://www.ecfr.gov/developers/documentation/api/v1](https://www.ecfr.gov/developers/documentation/api/v1) | None documented in fetched page | API responses; current XML also via GovInfo | Not stated | Snapshot titles and track amendment dates |
| OpenFEC | [https://api.open.fec.gov/developers/](https://api.open.fec.gov/developers/) | API key; demo key available | JSON | 1,000/hour standard; 100/page [^6] | API for recent deltas; bulk files for historical/full-cycle loads |
| EAVS | [https://www.eac.gov/research-and-data/studies-and-reports](https://www.eac.gov/research-and-data/studies-and-reports) | None | CSV, Excel, Stata, SPSS, SAS, Power BI | Download-based | Versioned batch ingestion with codebook/errata retention |
| CourtListener | [https://www.courtlistener.com/api/rest/v4/](https://www.courtlistener.com/api/rest/v4/) | Token/authenticated account | JSON | Default 5/min, 50/hour, 125/day [^4] | API for search/deltas; bulk CSV for warehousing |
| RECAP Fetch | [https://www.courtlistener.com/help/api/rest/recap/](https://www.courtlistener.com/help/api/rest/recap/) | CourtListener token + PACER credentials | JSON jobs/PDF acquisition | 30 queued requests/minute [^16] | Use only for missing records; budget PACER charges |
| PACER/CM-ECF | [https://pacer.uscourts.gov/file-case/court-cmecf-lookup](https://pacer.uscourts.gov/file-case/court-cmecf-lookup) | PACER account | HTML/PDF; court-specific RSS | Fee schedule rather than API quota | Avoid crawler assumptions; use permitted account workflows |
| Open States | [https://docs.openstates.org/api-v2/examples/](https://docs.openstates.org/api-v2/examples/) | Account/key terms require current review | GraphQL/JSON | Not captured | Normalize state bills while retaining source URLs |
| Vote Smart | [https://api.votesmart.org/docs/](https://api.votesmart.org/docs/) | API key/terms require current review | XML, JSON | Not captured | Candidate enrichment with source provenance |
| USAO feeds | [https://www.justice.gov/usao/rss](https://www.justice.gov/usao/rss) | None | RSS/XML | Not stated | Poll with ETag/Last-Modified; deduplicate by canonical URL |

## Suggested normalized schema

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "CivicResource",
  "type": "object",
  "required": [
    "resource_id",
    "resource_name",
    "publisher",
    "topic",
    "tier",
    "jurisdiction",
    "product_url",
    "availability",
    "source_authority",
    "verification_status",
    "verified_at"
  ],
  "properties": {
    "resource_id": {"type": "string"},
    "resource_name": {"type": "string"},
    "publisher": {"type": "string"},
    "topic": {"type": "array", "items": {"type": "string"}},
    "tier": {"enum": ["federal", "state", "local", "national-overlay"]},
    "jurisdiction": {"type": "string"},
    "product_url": {"type": "string", "format": "uri"},
    "summary": {"type": "string"},
    "availability": {"enum": ["free", "free-registration", "metered", "paywalled", "hybrid", "print-only", "public-records-request"]},
    "developer": {
      "type": "object",
      "properties": {
        "method": {"enum": ["api", "bulk", "rss", "download", "web-only", "none-verified"]},
        "base_url": {"type": ["string", "null"]},
        "docs_url": {"type": ["string", "null"]},
        "auth": {"type": ["string", "null"]},
        "formats": {"type": "array", "items": {"type": "string"}},
        "rate_limit": {"type": ["string", "null"]},
        "license_or_terms_url": {"type": ["string", "null"]}
      }
    },
    "update_cadence": {"type": ["string", "null"]},
    "historical_coverage": {"type": ["string", "null"]},
    "source_authority": {"enum": ["primary-government", "primary-judiciary", "intergovernmental", "nonprofit", "academic", "commercial", "association"]},
    "verification_status": {"enum": ["verified-live", "verified-snapshot", "directory-verified", "needs-recheck"]},
    "verified_at": {"type": "string", "format": "date"},
    "notes": {"type": "array", "items": {"type": "string"}}
  }
}
```

### JSON row examples

```json
[
  {
    "resource_id": "federal-congress-gov-api",
    "resource_name": "Congress.gov API",
    "publisher": "Library of Congress",
    "topic": ["legislation", "members", "committees", "votes"],
    "tier": "federal",
    "jurisdiction": "United States",
    "product_url": "https://api.congress.gov/v3",
    "summary": "Machine-readable access to Congress.gov collections.",
    "availability": "free-registration",
    "developer": {
      "method": "api",
      "base_url": "https://api.congress.gov/v3",
      "docs_url": "https://github.com/LibraryOfCongress/api.congress.gov/",
      "auth": "api.data.gov API key",
      "formats": ["JSON", "XML"],
      "rate_limit": "5000 requests/hour",
      "license_or_terms_url": null
    },
    "update_cadence": "ongoing during congressional activity",
    "historical_coverage": null,
    "source_authority": "primary-government",
    "verification_status": "verified-live",
    "verified_at": "2026-10-17",
    "notes": ["Maximum 250 records per page"]
  },
  {
    "resource_id": "federal-eac-eavs",
    "resource_name": "Election Administration and Voting Survey",
    "publisher": "U.S. Election Assistance Commission",
    "topic": ["voter-registration", "election-administration", "UOCAVA", "mail-voting"],
    "tier": "federal",
    "jurisdiction": "United States, states, territories, counties",
    "product_url": "https://www.eac.gov/research-and-data/studies-and-reports",
    "summary": "National election-administration reports, datasets, codebooks, and survey instruments.",
    "availability": "free",
    "developer": {
      "method": "download",
      "base_url": null,
      "docs_url": "https://www.eac.gov/research-and-data/studies-and-reports",
      "auth": "none",
      "formats": ["CSV", "Excel", "Stata", "SPSS", "SAS"],
      "rate_limit": null,
      "license_or_terms_url": null
    },
    "update_cadence": "biennial with revisions",
    "historical_coverage": "2004-present",
    "source_authority": "primary-government",
    "verification_status": "verified-live",
    "verified_at": "2026-10-17",
    "notes": ["Retain codebooks and errata with every imported version"]
  },
  {
    "resource_id": "national-courtlistener-v4",
    "resource_name": "CourtListener REST API",
    "publisher": "Free Law Project",
    "topic": ["case-law", "dockets", "judges", "oral-arguments", "citations"],
    "tier": "national-overlay",
    "jurisdiction": "United States",
    "product_url": "https://www.courtlistener.com/api/rest/v4/",
    "summary": "Search and retrieval API for legal opinions, dockets, RECAP records, people, and related data.",
    "availability": "hybrid",
    "developer": {
      "method": "api",
      "base_url": "https://www.courtlistener.com/api/rest/v4/",
      "docs_url": "https://www.courtlistener.com/help/api/rest/",
      "auth": "API token/account",
      "formats": ["JSON"],
      "rate_limit": "default 5/minute, 50/hour, 125/day",
      "license_or_terms_url": "https://www.courtlistener.com/terms/"
    },
    "update_cadence": "continuous",
    "historical_coverage": "collection-dependent",
    "source_authority": "nonprofit",
    "verification_status": "verified-live",
    "verified_at": "2026-10-17",
    "notes": ["Court-issued source controls when records conflict"]
  }
]
```

## Coverage matrix

| Topic | Federal | State | Local swing metros | National overlay | Overall status |
|---|---|---|---|---|---|
| Voter registration/guidance | Strong guidance; no federal operational registry | Canonical operations; directory verified | County/municipal variation | CanIVote, Vote.gov | Partial pending per-state and local endpoint verification |
| Election administration/results | Strong EAVS research; limited operational results | Canonical statewide results | Often highest-resolution results | MIT MEDSL and other academic overlays | Partial |
| Ballot measures/sample ballots | Limited federal role | Usually state canonical | County sample ballots/local measures | Aggregator coverage varies | Partial |
| Federal legislation/regulation | Strong APIs and bulk | Not applicable | Not applicable | GovInfo/Federal Register overlays | Covered |
| State legislation | Not authoritative | State legislatures canonical | Local ordinances out of core scope | Open States/NCSL | Directory covered; endpoints incomplete |
| Candidate/campaign finance | Strong FEC API/bulk | Highly variable agency systems | Often fragmented | Vote Smart and nonprofit overlays | Partial |
| Federal courts | PACER/GovInfo/individual courts | Not applicable | Not applicable | CourtListener/RECAP | Covered with access-cost caveat |
| State appellate courts | Not authoritative | Judiciary portals canonical | Trial courts vary | USA.gov directory/CourtListener | Directory covered; endpoints incomplete |
| U.S. Attorneys | DOJ directory, releases, RSS | Not applicable | Federal districts overlap local metros | DOJ consolidated stream | Covered |
| Local chief prosecutors | No canonical federal roster | State coordinator directories partial | Office-by-office verification required | NAPC/NDAA discovery | Material gap |

## Gap analysis

### Highest-priority gaps

- **Per-state operational endpoints:** Registration lookup, polling place, election results, ballot measures, voter-file policy, campaign-finance database, appellate docket, and opinions URLs still need direct verification for most states.
- **Local election data:** County results formats range from HTML and PDF to CSV, XML, vendor portals, and downloadable precinct files. Every swing-metro row needs a live endpoint and historical-depth check.
- **Local prosecutor rosters:** No verified nationwide public API was identified. Names, boundaries, leadership, release feeds, and annual-report data require direct office research.
- **State trial-court dockets:** Coverage, registration requirements, paywalls, CAPTCHA, and case-type exclusions vary by state and county.
- **Licensing:** API availability does not imply unrestricted commercial reuse. Terms, contributor-data restrictions, bulk redistribution rights, and privacy limitations need a legal/terms review before production use.
- **Voter-file access:** Public-record rules differ significantly and can restrict eligible requestors, permitted uses, fields, redistribution, security, or fees. This category requires a dedicated 50-state legal-policy pass.

### Remediation order

1. Resolve state election agencies from the NASS roster and CanIVote, then verify each operational endpoint.
2. Resolve each state legislature and validate bill, vote, code, session-law, and regulation interfaces.
3. Resolve each state campaign-finance agency and determine API, bulk, export, and filing-image availability.
4. Resolve each judiciary’s appellate docket, opinions, oral arguments, and judge directory.
5. Complete the local swing-metro election and prosecutor verification queue.
6. Run automated link checks, followed by manual content checks for redirects, soft-404s, authentication, and bot defenses.

## Implementation implications

### Minimum viable federal stack

- **Election administration:** EAC EAVS downloads plus Vote.gov/FVAP guidance
- **Legislation:** Congress.gov API for structured tracking; GovInfo bulk for official text/packages; Federal Register/eCFR for regulatory data
- **Campaign finance:** OpenFEC API for recent queries plus bulk files for complete historical loads
- **Courts:** PACER for official records; CourtListener/RECAP for search, enrichment, free documents, and bulk analysis
- **Prosecutors:** DOJ USAO directory plus district RSS feeds

### Recommended ingestion architecture

1. **Registry layer:** Store one record per publisher/product/jurisdiction with canonical URL, authority class, terms URL, verification timestamp, and health status.
2. **Raw landing zone:** Preserve untouched JSON, XML, CSV, PDFs, and feed entries with retrieval metadata and hashes.
3. **Normalized civic model:** Normalize people, organizations, jurisdictions, contests, bills, actions, filings, cases, dockets, documents, offices, and source provenance.
4. **Identity layer:** Preserve official identifiers such as FEC candidate/committee IDs, Congress/member/bill IDs, court/docket identifiers, and jurisdiction codes.
5. **Change-data pipeline:** Poll APIs and feeds incrementally; batch-load bulk archives; retain revisions and errata.
6. **Authority rules:** Primary publisher wins for legal status; overlays may enrich search, text, entity resolution, and cross-jurisdiction comparison.
7. **Observability:** Monitor HTTP status, redirect target, content type, schema drift, record count, latency, quota consumption, and stale-update thresholds.
8. **Compliance:** Maintain per-source terms, license, privacy, retention, and redistribution controls.

## Risks and limitations

- This combined document completes the federal baseline and national discovery layer but does not claim live verification of every state and local endpoint.
- Dynamic leadership data can change between verification and use; this is especially material for election officials, U.S. Attorneys, acting officials, and local prosecutors.
- Search pages may be public while bulk export or automated access is restricted.
- Vendor-hosted state and county portals can change URLs without redirect continuity.
- “Free” describes access price, not necessarily reuse rights.
- Court dockets can contain sealed, restricted, redacted, or unavailable documents even when the case index is public.
- Election-night results are unofficial until canvass/certification; ingestion systems must model result status and revision history.

## Research-question coverage

| Research question | Status | Evidence/output |
|---|---|---|
| Primary resource map across topics and tiers | Partially complete | Federal master dictionary; state discovery matrix; local queue |
| Voter information resources | Federal covered; state/local discovery mapped | Vote.gov, EAC, FVAP, NASS/CanIVote |
| Elections and ballot resources | Federal analytical layer covered; operational endpoints incomplete | EAVS, MIT overlay, state/local queue |
| Federal legislation and bill tracking | Covered | Congress.gov, GovInfo, Federal Register, eCFR |
| State legislation | National discovery and normalized overlay covered; direct endpoints incomplete | NCSL, Open States |
| Candidate research | Federal covered; selected state examples; full state pass incomplete | FEC, Vote Smart, state examples |
| Judicial resources | Federal covered; state directory covered; direct state endpoints incomplete | PACER, GovInfo opinions, CourtListener, USA.gov |
| U.S. Attorneys/local prosecutors | USAO covered; local roster incomplete | DOJ directory/RSS; NAPC/NDAA; local queue |
| Developer access | Covered for core federal/national resources | Developer appendix |
| Coverage gaps | Covered | Coverage matrix and gap analysis |

## Claim-evidence traceability

| Claim family | Supporting source IDs |
|---|---|
| Vote.gov role and state handoff | [^7] |
| EAVS scope, formats, and time series | [^8][^10][^33] |
| FVAP guidance and UOCAVA resources | [^24][^9][^25] |
| Congress.gov API limits and behavior | [^2] |
| GovInfo API and bulk capabilities | [^1][^52][^53][^23] |
| Federal Register/eCFR developer access | [^3][^36] |
| FEC API update and rate-limit details | [^6] |
| PACER coverage, updates, registration, and cost | [^17][^45][^26][^18][^19] |
| CourtListener API, bulk, and RECAP | [^4][^5][^16] |
| State election directories | [^14][^15] |
| State legislative overlays | [^11][^12] |
| Court discovery | [^13][^47] |
| USAO counts, directory, releases, and feeds | [^30][^20][^43][^21][^22] |
| State campaign-finance examples | [^27][^41][^48][^28][^29] |
| Prosecutor discovery associations | [^31][^32][^44] |

## Verification log

| Date | Resource family | Outcome |
|---|---|---|
| 2026-10-17 | Vote.gov, EAC, FVAP | Live pages and current data/guidance descriptions retrieved |
| 2026-10-17 | Congress.gov API | Official repository documentation retrieved; key and rate-limit details confirmed |
| 2026-10-17 | GovInfo | Developer hub, API-key guidance, search endpoint, and bulk repository retrieved |
| 2026-10-17 | Federal Register/eCFR | Official API specification/docs retrieved |
| 2026-10-17 | OpenFEC | Official API documentation retrieved |
| 2026-10-17 | PACER | Official search, locator, registration, cost, court lookup, and opinions pages retrieved |
| 2026-10-17 | CourtListener | Current API, throttling, bulk-data, and RECAP documentation retrieved |
| 2026-10-17 | NASS/CanIVote | CEO roster and state voter-service directory retrieved |
| 2026-10-17 | NCSL/Open States | State research and GraphQL examples retrieved |
| 2026-10-17 | DOJ USAO | Directory, mission/count explanation, consolidated releases, and RSS directory retrieved |
| 2026-10-17 | State examples | California, Pennsylvania, Kansas, New York, and Washington examples retrieved |
| 2026-10-17 | Local swing metros | Scope seeds compiled; individual office URLs not yet verified |

## Contradiction log

- **93 U.S. Attorneys vs. 94 districts/offices:** DOJ pages use both counts. The resolved interpretation is 94 judicial districts, 93 U.S. Attorneys, because Guam and the Northern Mariana Islands share one U.S. Attorney.[^21][^54][^22]
- **PACER update frequency:** The national Case Locator updates daily, while court-specific PACER/CM-ECF records update in real time. Both statements are correct for different access paths.[^45][^18]
- **CourtListener rate limits:** Older API documentation and third-party packages report different limits. This report uses current v4 documentation showing default concurrent limits of 5/minute, 50/hour, and 125/day.[^55][^4]
- **Official versus overlay data:** State legislatures, courts, election agencies, and the FEC remain canonical even when an aggregator provides a more convenient interface.

## Research log

Primary search themes included:

- Federal voter guidance, EAVS downloads, and UOCAVA resources
- Congress.gov API documentation and limits
- GovInfo API, search, and bulk-data collections
- Federal Register and eCFR APIs
- FEC API and bulk campaign-finance access
- PACER coverage, fees, Case Locator, CM/ECF lookup, and opinions
- CourtListener v4, bulk data, and RECAP fetch
- NASS election-official and voter-service directories
- NCSL and Open States state-legislation coverage
- USA.gov and U.S. Courts court directories
- DOJ U.S. Attorney directory, press releases, and XML feeds
- State campaign-finance examples and prosecutor association directories

The next research pass should execute the state and local verification queues in batches, recording redirects, content types, authentication, formats, dates, historical coverage, terms, and source authority for each final endpoint.

---

## References

1. [Developer Hub - GovInfo](https://www.govinfo.gov/developers) - GPO provides the capability to download XML in bulk for select collections from our Bulk Data Reposi...

2. [github.com › LibraryOfCongress › apiapi.congress.gov/README.md at main · LibraryOfCongress/api ...](https://github.com/LibraryOfCongress/api.congress.gov/blob/main/README.md) - The rate limit is set to 5,000 requests per hour.

3. [Federal Register](https://www.federalregister.gov/api/v1/documentation.json) - ,"schema":{"type":"string"}},{"name":"conditions[regulation_id_number]","description":"Regulation ID...

4. [REST API, v4.7 - Courtlistener - FLP Wiki](https://www.courtlistener.com/help/api/rest/) - By default, authenticated users may make up to **5 requests per minute**, **50 requests per hour**, ...

5. [Legal APIs and Data - Courtlistener - FLP Wiki](https://www.courtlistener.com/help/api/) - These provide CSV files of our case law, people, and financial disclosures databases.

6. [OpenFEC API Documentation](https://api.open.fec.gov/developers/) - Signing up for an API key will enable you to place up to 1,000 calls an hour.

7. [About vote.gov | Our mission and history | Vote.gov](https://vote.gov/about-us) - Vote.gov does not register people to vote.
You must register directly with your state.

8. [Report: The History, Evolution, and Future Directions of the Election ...](https://www.eac.gov/research-and-data/eavs-retrospective) - - EAVS Section A: Voter Registration Time Series
...
- EAVS Section D: In-Person Polling Operations ...

9. [Voting Assistance Guide](https://www.fvap.gov/guide) - In this guide you can find information on how to register to vote absentee in the State you vote in,...

10. [Studies and Reports | U.S. Election Assistance Commission](https://www.eac.gov/research-and-data/studies-and-reports) - On this page, you will find links to all EAVS Comprehensive Reports, datasets, codebooks, and survey...

11. [Examples - Open States](https://docs.openstates.org/api-v2/examples/) - ## Search for bills that match a given condition ¶
...
search_1: bills(first: 5, jurisdiction: "New ...

12. [Policy Research - National Conference of State Legislatures](https://www.ncsl.org/research) - Find the most comprehensive and complete 50-state information in NCSL's searchable bill tracking dat...

13. [Federal, State, Territory, County, and Municipal Courts](https://www.usa.gov/courts) - Find the federal, state, and territory courts that serve your area
...
You may be able to find a cou...

14. [Roster of Secretaries of State/Lieutenant Governors - NASS.org](https://www.nass.org/memberships/secretaries-statelieutenant-governors) - |**Chief State Election Official (CEO)** = 40|**Appointed Members** = 10 includes DC (+1 w/ PR)|**Re...

15. [Can I Vote](https://www.nass.org/can-I-vote) - This nonpartisan website was created by state election officials to help eligible voters figure out ...

16. [RECAP APIs for PACER Data - FLP Wiki](https://www.courtlistener.com/help/api/rest/recap/) - This API can be used to queue up to **30 requests per minute**.

17. [What is the PACER Case Locator?](https://pacer.uscourts.gov/help/faqs/what-pacer-case-locator) - The PACER Case Locator is a national case locator index for all federal court records in district, b...

18. [Search by Specific Court](https://pacer.uscourts.gov/find-case/search-specific-court) - Any registered user can log in to PACER to look up federal case records if they know the specific co...

19. [Public Access to Court Electronic Records | PACER: Federal ...](https://pacer.uscourts.gov/) - Access to case information costs $0.10 per page.
...
NOTE: If you accrue $30 or less of charges in a...

20. [USAO News Feeds - Department of Justice](https://www.justice.gov/usao/rss) - Choose the news feed you're interested in from the list below.
...
Washington, DC 20530-0001

21. [U.S. Attorneys | Offices of the United States Attorneys](https://www.justice.gov/usao) - Select a district to find the United States Attorney, contact information, and news from each of the...

22. [Executive Office for United States Attorneys](https://www.justice.gov/doj/organization-mission-and-functions-manual-executive-office-united-states-attorneys) - The mission of EOUSA is to provide general executive assistance and supervision to the 94 Offices of...

23. [Bulk Data](https://www.govinfo.gov/bulkdata/) - GPO makes select collections available in bulk in a machine-readable format (i.e. XML) via our Bulk ...

24. [2026 27 Voting Assistance Guide](https://www.fvap.gov/uploads/FVAP/Chapter-1/PreChapter1Web.pdf) - Uniformed Service members and their families, both stateside and overseas, and U.S. citizens residin...

25. [FVAP.gov](https://www.fvap.gov/) - See your state's guidelines · See election dates and deadlines · Find your election office · Check t...

26. [Register for an account](https://pacer.uscourts.gov/register-account/pacer-case-search-only) - There is no fee to register.
However, there is a fee to access court records once logged into PACER.

27. [Office of Campaign Finance & Lobbying Disclosure](https://www.pa.gov/agencies/dos/department-and-offices/bcfld) - Campaign Finance Division receives and posts campaign finance reports filed by candidates for statew...

28. [Campaign Finance - Kansas Public Disclosure Commission](https://kpdc.kansas.gov/campaign-finance/) - The Kansas Public Disclosure Commission is the state agency charged with administering, interpreting...

29. [California Secretary of State](https://cal-access.sos.ca.gov/) - Cal-Access provides financial information supplied by state candidates, donors, lobbyists, and other...

30. [U.S. Attorneys | All USAO Press Releases - Department of Justice](https://www.justice.gov/usao/pressreleases) - U.S. Department of Justice
950 Pennsylvania Avenue NW
Room 2242

31. [Prosecutor Coordinators - NAPC](https://www.napc.us/about-napc/prosecutor-coordinators/) - **NATIONAL DISTRICT ATTORNEYS’ ASSOCIATION**
www.ndaajustice.org

32. [National District Attorneys Association | NDAA](https://www.ndaa.org/) - Join the nation's leading association for prosecutors. Gain access to expert resources, research sup...

33. [EAVS Data Interactive](https://www.eac.gov/research-and-data/studies-and-reports/eavs-data-interactive) - The Election Administration and Voting Survey interactive allows users to examine and compare data a...

34. [Elections 2018](https://electionlab.mit.edu/data/election-2018) - Here at the MIT Election Data & Science Lab, we're dedicated to collecting, analyzing, and sharing c...

35. [MIT Election Data and Science Lab - GitHub](https://github.com/MEDSL) - District-level House returns and state-level Senate and presidential returns from 1976-2018

36. [API Documentation - eCFR](https://www.ecfr.gov/developers/documentation/api/v1) - The base URL for all API endpoints is https://www.ecfr.gov.

37. [General Information - Project Vote Smart API](https://api.votesmart.org/docs/) - The Project Vote Smart API allows people outside our organization to integrate our data into their a...

38. [Votes Class - Project Vote Smart API](https://api.votesmart.org/docs/Votes.html) - This method dumps categories that contain released bills according to year and state.

39. [Local Class - Project Vote Smart API](https://api.votesmart.org/docs/Local.html) - Fetches counties in a state
...
Fetches cities in a state
...
Fetches officials for a locality

40. [Candidates Class - Project Vote Smart API](https://api.votesmart.org/docs/Candidates.html) - This method grabs a list of candidates according to office and state representation.

41. [Search Political Campaign Finance Reports](https://www.pa.gov/services/dos/search-political-campaign-finance-reports) - These reports, which are required to be submitted at certain intervals throughout the election cycle...

42. [Court Opinions | PACER: Federal Court Records](https://pacer.uscourts.gov/find-case/court-opinions) - Additionally, access to court opinions from many appellate, district, and bankruptcy courts are avai...

43. [Find Your United States Attorney](https://www.justice.gov/usao/find-your-united-states-attorney) - U.S. Department of Justice
950 Pennsylvania Avenue NW
Room 2242

44. [Resource Library](https://www.ndaa.org/news) - Welcome to NDAA's Resource Library, your hub for trusted tools, research, and guidance tailored to t...

45. [Search by National Index](https://pacer.uscourts.gov/find-case/search-national-index) - The PACER Case Locator allows any registered user to search a nationwide index of federal court case...

46. [Court CM/ECF Lookup](https://pacer.uscourts.gov/file-case/court-cmecf-lookup) - The purpose of this site is to provide information about locating and filing cases in the federal co...

47. [Find a Federal Court](https://www.uscourts.gov/federal-court-finder/find) - ## Find a Federal Court
Find a federal court by location or court name.

48. [Campaign Finance](https://elections.ny.gov/campaign-finance) - 40 North Pearl Street, Suite 5
Albany, NY 12207-2729

49. [Washington State Courts - Court Directory](https://www.courts.wa.gov/court_dir/) - Washington State Courts · Supreme Court · Court of Appeals · Tribal Courts · Superior, Juvenile, Dis...

50. [Combined Federal/State Disclosure and Election Directory](https://www.fec.gov/resources/cms-content/documents/cfsded.pdf) - State Disclosure Offices 
...
STATE ETHICS COMMISSION 
...
COUNCIL ON GOVERNMENTAL ETHICS LAWS

51. [Agency Directory - The official website of Louisiana](https://www.louisiana.gov/government/agency-directory/) - The Ethics Administration and its Louisiana Board of Ethics polices public servants, lobbyists and p...

52. [API Search Service - GovInfo](https://www.govinfo.gov/features/search-service-overview) - - **pageSize:** The number of records to return per page.
Maximum is 1000

53. [New govinfo API](https://www.govinfo.gov/features/api) - An api.data.gov ** key is required to use the **govinfo** API.
Use an existing key or request one fo...

54. [U.S. Attorneys | Mission - Department of Justice](https://www.justice.gov/usao/mission) - U.S. Department of Justice
950 Pennsylvania Avenue NW
Room 2242

55. [REST API, v1 - FLP Wiki](https://wiki.free.law/c/courtlistener/help/api/rest/v1/overview) - At present, this API is throttled to 1,000 queries per endpoint per user per hour, while we learn wh...

