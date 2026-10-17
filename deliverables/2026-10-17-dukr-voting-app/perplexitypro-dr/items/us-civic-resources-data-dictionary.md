# U.S. Civic & Legal Data Resources Data Dictionary

## Research metadata

- **Prepared:** October 17, 2026
- **Research cutoff:** October 17, 2026
- **Mode:** Deep-and-wide source mapping
- **Jurisdictional order:** Federal → state/territory → local
- **Topics:** Voter information; elections and ballots; legislation and regulation; candidate and campaign finance; judicial dockets and opinions; U.S. Attorneys and local prosecutors
- **Audience:** Civic-tech developers, data engineers, researchers, journalists, and product teams

## Scope defaults

| Scope question | Applied default |
|---|---|
| Swing states | AZ, CO, FL, GA, IA, ME, MI, MN, NC, NH, NV, OH, PA, WI |
| Time horizon | Current resources plus historical data back to 2000 when available |
| Candidates | Federal, statewide, state legislative, and prioritized swing-metro local candidates |
| Courts | Federal courts plus state supreme and intermediate appellate courts; trial courts flagged |
| Prosecutors | Federal USAOs plus chief prosecutors in prioritized swing-state metros |
| Developer access | Official API, feed, bulk download, or documented export; no unofficial scraping recipes |
| Territories | PR and USVI in state tier; Guam, American Samoa, and CNMI through federal/territorial directories |
| Local selection | Principal counties of major MSAs, state-capital counties, and counties containing cities of at least 100,000 |

## Executive summary

The U.S. civic-data ecosystem is a federation of authoritative publishers rather than one coherent platform. Federal legislative, regulatory, campaign-finance, and nonprofit judicial sources provide the strongest machine interfaces: Congress.gov exposes an API with API-key authentication and a documented 5,000-request-per-hour limit; GovInfo offers an API and structured bulk repositories; the Federal Register publishes an OpenAPI-described REST interface; the FEC offers a REST API and bulk campaign-finance data; and CourtListener provides a legal API and bulk exports.[cite:18][cite:17][cite:25][cite:42][cite:33][cite:39]

Election administration is more decentralized. Vote.gov is an official guidance and routing layer, not a registration system, and directs voters to state election websites. The EAC's Election Administration and Voting Survey provides the national research layer, with reports, codebooks, multiple downloadable formats, and comprehensive 2004–2024 time series; FVAP publishes state-specific guidance for military and overseas voters.[cite:2][cite:4][cite:9][cite:8]

Operational voter registration, polling-place lookup, ballot tracking, sample ballots, results, and voter-file access remain state or county responsibilities. NASS provides a current chief-election-official roster, while CanIVote links to state registration, status, polling-place, identification, early-voting, overseas-voting, and local-official resources.[cite:86][cite:89]

Federal court information is split between authoritative and open-access systems. PACER is the official system for federal appellate, district, and bankruptcy records; the national Case Locator updates daily, while court-specific systems update in real time.[cite:47][cite:54] PACER generally charges $0.10 per page, caps most documents at $3, and waives quarterly charges of $30 or less.[cite:55] CourtListener and RECAP provide search, APIs, and bulk data for archived materials, but retrieving absent PACER documents can still incur PACER charges.[cite:33][cite:39][cite:44]

Prosecutorial information is the least standardized. DOJ provides a federal district directory, consolidated press releases, and district XML news feeds. DOJ materials distinguish 94 federal judicial districts from 93 U.S. Attorneys because Guam and the Northern Mariana Islands share one official.[cite:112][cite:109][cite:121] Local prosecutor titles, boundaries, leadership pages, feeds, and data products vary, so the local section is a verification queue rather than a fabricated endpoint list.

## Key findings

1. Congress.gov, GovInfo, the Federal Register, OpenFEC, and CourtListener form the strongest developer-ready federal/national stack.[cite:18][cite:17][cite:25][cite:42][cite:33]
2. EAVS is the strongest national election-administration dataset, with downloadable files and time series from 2004 onward.[cite:4][cite:9]
3. Vote.gov and CanIVote are discovery and guidance layers; operational voting services remain state and local.[cite:2][cite:89]
4. FVAP is the canonical UOCAVA guidance resource for state rules, deadlines, election-office contacts, FPCA, and FWAB materials.[cite:3][cite:8][cite:13]
5. OpenFEC is the federal campaign-finance source of record and updates nightly.[cite:42]
6. PACER is authoritative but account-based and metered; CourtListener is the principal open legal-data overlay.[cite:55][cite:33]
7. State legislative and judicial coverage is broad but technically inconsistent; state primary publishers remain canonical when an aggregator differs.[cite:75][cite:81][cite:82]
8. DOJ's USAO release and RSS infrastructure is unusually suitable for automated prosecutor-news monitoring.[cite:108][cite:109]
9. Local chief-prosecutor data has no verified national public API; direct office research is required.[cite:98][cite:105]

## Methodology

Sources were prioritized in this order: primary government publishers; judicial-branch publishers; official data portals; intergovernmental directories; established nonprofit and academic sources; commercial services only where necessary. Every developer claim below is limited to fetched documentation. State and local items not individually fetched are labeled `Directory verified` or `Needs recheck` rather than being presented as confirmed.

## Topical deep dives

### Voter information

Vote.gov provides official multilingual registration and voting guidance while routing users to state systems; it does not register voters or retain public voter data.[cite:2] FVAP focuses on UOCAVA voters and provides the Voting Assistance Guide, deadlines, local-election-office contacts, and federal registration/backup-ballot materials.[cite:3][cite:8][cite:13]

EAVS provides nationwide election-administration evidence rather than individual voter lookup. It covers registration and list maintenance, military and overseas voting, mail voting, polling operations, provisional ballots, participation, and election technology in downloadable research datasets.[cite:4][cite:9]

### Elections and ballots

State agencies generally publish statewide and certified results; county offices may publish election-night, precinct, canvass, statement-of-vote, sample-ballot, and local-measure data. Formats and historical depth require jurisdiction-specific verification.

EAVS adds comparative state and local administration data, while MIT Election Data and Science Lab provides academic historical returns and precinct projects. Academic resources should be treated as analytical overlays, not legal records.[cite:12][cite:63][cite:69]

### Legislation and regulation

Congress.gov is the primary federal legislative API. It requires a key, permits 5,000 requests per hour, and supports pages of up to 250 results.[cite:18] GovInfo complements it with official packages and bulk XML/JSON for bill text, bill status, summaries, CFR, Federal Register, and other publications.[cite:17][cite:29]

The Federal Register API exposes rules, proposed rules, notices, presidential documents, agencies, dates, CFR references, docket identifiers, and document URLs through an OpenAPI-described interface.[cite:25] At the state level, NCSL supplies 50-state policy and bill databases, while Open States normalizes jurisdictions, sessions, people, bills, actions, documents, versions, and source links through GraphQL.[cite:81][cite:75]

### Candidates and money

The OpenFEC API supports full-text and field-specific searches, links records to filings and images, updates nightly, allows 1,000 calls per hour with a standard key, and returns up to 100 records per page.[cite:42] Large historical jobs should use bulk files rather than high-volume API pagination.

Vote Smart provides XML/JSON methods for candidate biographies, candidate discovery, offices, local officials, bills, and votes.[cite:64][cite:67][cite:72][cite:73] State campaign-finance systems vary: Pennsylvania combines campaign-finance and lobbying disclosure, California's Cal-Access covers candidates, donors, lobbyists, committees, and ballot measures, and Kansas divides administration and repository duties across agencies.[cite:96][cite:104][cite:103]

### Judicial resources

PACER is the official federal docket and filing service. Its Case Locator covers appellate, bankruptcy, and district records and updates daily; direct court systems update with new filings.[cite:47][cite:54] Opinions are free to registered PACER users, and many courts' opinions are also available through GovInfo.[cite:57]

CourtListener provides opinions, dockets, RECAP, people, oral arguments, citations, and financial-disclosure interfaces. Default authenticated throttles are 5 requests per minute, 50 per hour, and 125 per day; bulk data is preferred for warehousing.[cite:33][cite:39]

### Prosecutorial resources

DOJ's USAO directory provides district selection, leadership, contacts, and office news. Its consolidated releases and XML feeds are practical ingestion points.[cite:110][cite:108][cite:109] For local prosecutors, NAPC and NDAA are useful discovery aids, but direct office verification remains essential.[cite:98][cite:105][cite:106]

## Master data dictionary

| Resource | Publisher | Category | Tier | Product URL | Availability | Developer access | Cadence | Authority | Verification |
|---|---|---|---|---|---|---|---|---|---|
| Vote.gov | GSA TTS | Voter guidance | Federal | https://vote.gov/ | Free | Web/state links; no voter-data API documented | Ongoing | Primary government | Verified live [cite:2] |
| EAVS Studies and Reports | U.S. EAC | Election administration | Federal | https://www.eac.gov/research-and-data/studies-and-reports | Free | CSV, Excel, SPSS, Stata, SAS, Power BI | Biennial/revisions | Primary government | Verified live [cite:9] |
| EAVS Time Series | U.S. EAC | Election administration | Federal | https://www.eac.gov/research-and-data/eavs-retrospective | Free | Download and replication files | Periodic | Primary government | Verified live [cite:4] |
| FVAP | U.S. DOD | UOCAVA voting | Federal | https://www.fvap.gov/ | Free | Web, PDF, downloadable forms/materials | Continuous | Primary government | Verified live [cite:13] |
| Voting Assistance Guide | FVAP | UOCAVA voting | Federal | https://www.fvap.gov/guide | Free | Web/PDF | Biennial plus updates | Primary government | Verified live [cite:8] |
| CanIVote | NASS | State voter discovery | National | https://www.nass.org/can-I-vote | Free | Link directory | Ongoing | Intergovernmental | Verified live [cite:89] |
| NASS CEO Roster | NASS | Election officials | National | https://www.nass.org/memberships/secretaries-statelieutenant-governors | Free | Web table | Ongoing | Intergovernmental | Verified live [cite:86] |
| Congress.gov API | Library of Congress | Legislation | Federal | https://api.congress.gov/v3 | Free with key | REST, JSON/XML, 5,000/hour, 250/page | Near daily | Primary government | Verified live [cite:18] |
| GovInfo Developer Hub | U.S. GPO | Official publications | Federal | https://www.govinfo.gov/developers | Free/API key | API, XML/JSON bulk, schemas | Collection-specific | Primary government | Verified live [cite:17] |
| GovInfo Bulk | U.S. GPO | Legislation/regulation | Federal | https://www.govinfo.gov/bulkdata/ | Free | XML; directory XML/JSON | Collection-specific | Primary government | Verified live [cite:29] |
| Federal Register API | NARA/GPO | Regulation | Federal | https://www.federalregister.gov/api/v1/documentation.json | Free | REST/OpenAPI/JSON | Business days | Primary government | Verified live [cite:25] |
| eCFR API | GPO/OFR | Regulation | Federal | https://www.ecfr.gov/developers/documentation/api/v1 | Free | HTTP API; current XML also via GovInfo | Continuous | Primary government | Verified live [cite:30] |
| OpenFEC API | FEC | Campaign finance | Federal | https://api.open.fec.gov/developers/ | Free with key | REST/JSON, 1,000/hour, 100/page | Nightly | Primary government | Verified live [cite:42] |
| PACER | U.S. Courts AO | Federal dockets | Federal | https://pacer.uscourts.gov/ | Registration/metered | Court web systems, PDF/HTML | Real time by court | Primary judiciary | Verified live [cite:55] |
| PACER Case Locator | U.S. Courts AO | Case index | Federal | https://pacer.uscourts.gov/find-case/search-national-index | Registration/metered | Web search | Daily | Primary judiciary | Verified live [cite:48] |
| CM/ECF Lookup | U.S. Courts AO | Court endpoints | Federal | https://pacer.uscourts.gov/file-case/court-cmecf-lookup | Free directory | Court links, RSS where available | Ongoing | Primary judiciary | Verified live [cite:56] |
| Court Opinions | PACER/GovInfo | Opinions | Federal | https://pacer.uscourts.gov/find-case/court-opinions | Free/registration | Search and collection access | Ongoing | Primary judiciary | Verified live [cite:57] |
| CourtListener API | Free Law Project | Case law/dockets | National | https://www.courtlistener.com/api/rest/v4/ | Free account/hybrid | REST/JSON/token; 5/min, 50/hour, 125/day | Continuous | Nonprofit | Verified live [cite:33] |
| CourtListener Bulk | Free Law Project | Legal bulk data | National | https://www.courtlistener.com/help/api/ | Hybrid | CSV bulk files | Periodic | Nonprofit | Verified live [cite:39] |
| RECAP Fetch | Free Law Project | PACER acquisition | Federal | https://www.courtlistener.com/help/api/rest/recap/ | PACER fees may apply | REST; PACER credentials; 30 queues/min | On demand | Nonprofit overlay | Verified live [cite:44] |
| USA.gov Courts | GSA | Court discovery | National | https://www.usa.gov/courts | Free | Web directory | Ongoing | Primary government | Verified live [cite:82] |
| USAO Directory | DOJ | Prosecutors | Federal | https://www.justice.gov/usao/find-your-united-states-attorney | Free | Web directory | Ongoing | Primary government | Verified live [cite:110] |
| USAO Releases | DOJ | Prosecutor news | Federal | https://www.justice.gov/usao/pressreleases | Free | Web plus RSS directory | Daily | Primary government | Verified live [cite:108] |
| USAO News Feeds | DOJ | Prosecutor news | Federal | https://www.justice.gov/usao/rss | Free | RSS/XML | As published | Primary government | Verified live [cite:109] |
| Open States API | Open States/Plural | State legislation | National overlay | https://docs.openstates.org/api-v2/examples/ | Terms vary | GraphQL/JSON | Ongoing | Aggregator | Verified live [cite:75] |
| NCSL Research | NCSL | State legislation | National | https://www.ncsl.org/research | Free/hybrid | Web databases | Topic/session | Intergovernmental | Verified live [cite:81] |
| Vote Smart API | Project Vote Smart | Candidates/votes | National | https://api.votesmart.org/docs/ | Key/terms | XML/JSON API | Ongoing | Nonprofit | Verified snapshot [cite:64] |
| MIT Election Lab | MIT MEDSL | Election research | National | https://electionlab.mit.edu/ | Free/repository terms | Downloads, GitHub, Dataverse | Project-specific | Academic | Verified snapshot [cite:63][cite:69] |
| NAPC Coordinators | NAPC | Prosecutor discovery | State | https://www.napc.us/about-napc/prosecutor-coordinators/ | Free | Web directory | Ongoing | Association | Verified live [cite:98] |
| NDAA | NDAA | Prosecutor research | National | https://www.ndaa.org/ | Free/hybrid | Web; no public national DA API verified | Ongoing | Association | Verified live [cite:105] |

## State-by-state discovery matrix

This matrix provides canonical discovery routes rather than claiming that every downstream product endpoint has been individually verified. Use NASS/CanIVote for elections, NCSL/Open States for legislation, USA.gov for courts, and the FEC combined federal/state disclosure directory for campaign-finance discovery.[cite:89][cite:81][cite:75][cite:82][cite:93]

| Jurisdictions | Election discovery | Legislation | Courts | Campaign finance | Status |
|---|---|---|---|---|---|
| AL, AK, AR, CO, CT, DE, DC, FL, GA, HI, ID, IL, IN, IA, KY, ME, MD, MA, MI, MN, MS, MO, MT, NE, NV, NH, NJ, NM, NC, ND, OH, OK, OR, RI, SC, SD, TN, TX, UT, VT, VA, WV, WI, WY | CanIVote/NASS | NCSL/Open States | USA.gov courts | FEC federal/state directory → state agency | Directory verified |
| Arizona | CanIVote/NASS | NCSL/Open States | USA.gov courts | State agency follow-through | Directory verified |
| California | CanIVote/NASS | NCSL/Open States | USA.gov courts | Cal-Access | Campaign-finance endpoint verified [cite:104] |
| Kansas | CanIVote/NASS | NCSL/Open States | USA.gov courts | KPDC/SOS | Campaign-finance endpoint verified [cite:103] |
| Louisiana | CanIVote/NASS | NCSL/Open States | USA.gov courts | Louisiana Ethics/LEADERS | Agency verified [cite:102] |
| New York | CanIVote/NASS | NCSL/Open States | USA.gov courts | NYSBOE Public Reporting | Endpoint verified [cite:101] |
| Pennsylvania | CanIVote/NASS | NCSL/Open States | USA.gov courts | PA Campaign Finance | Endpoint verified [cite:96][cite:97] |
| Washington | CanIVote/NASS | NCSL/Open States | Washington court directory | State agency follow-through | Court directory verified [cite:90] |
| Puerto Rico, U.S. Virgin Islands | NASS/territorial commission | NCSL/Open States where covered | USA.gov courts | FEC directory/state follow-through | Directory verified |

## Swing-state local research queue

Every local row must capture: election office; registration/polling/sample-ballot/result endpoints; candidate filing; campaign finance; court docket; chief prosecutor; releases/RSS; open-data portal; downloadable/API formats.

| State | Priority metros/counties | Prosecutor title pattern | Status |
|---|---|---|---|
| Arizona | Maricopa/Phoenix; Pima/Tucson | County Attorney | Needs direct verification |
| Colorado | Denver; El Paso; Arapahoe; Jefferson; Adams | District Attorney | Needs direct verification |
| Florida | Miami-Dade; Broward; Hillsborough; Orange; Duval; Leon | State Attorney | Needs direct verification |
| Georgia | Fulton; DeKalb; Cobb; Chatham; Richmond | District Attorney | Needs direct verification |
| Iowa | Polk; Linn; Scott | County Attorney | Needs direct verification |
| Maine | Cumberland; Kennebec | District Attorney | Needs direct verification |
| Michigan | Wayne; Oakland; Macomb; Kent; Ingham | Prosecuting Attorney | Needs direct verification |
| Minnesota | Hennepin; Ramsey; Olmsted | County Attorney | Needs direct verification |
| Nevada | Clark; Washoe; Carson City | District Attorney | Needs direct verification |
| New Hampshire | Hillsborough; Merrimack | County Attorney | Needs direct verification |
| North Carolina | Mecklenburg; Wake; Guilford; Forsyth; Durham | District Attorney | Needs direct verification |
| Ohio | Franklin; Cuyahoga; Hamilton; Montgomery; Lucas | Prosecuting Attorney | Needs direct verification |
| Pennsylvania | Philadelphia; Allegheny; Dauphin; Lehigh; Erie | District Attorney | Needs direct verification |
| Wisconsin | Milwaukee; Dane; Brown; Waukesha | District Attorney | Needs direct verification |

## Developer appendix

| Resource | Auth | Formats | Published limits | Recommended pattern |
|---|---|---|---|---|
| Congress.gov API | api.data.gov key | JSON/XML | 5,000/hour; 250/page [cite:18] | Incremental sync by update date and Congress |
| GovInfo API | api.data.gov key | JSON/packages | Search page max 1,000 [cite:19][cite:28] | API deltas plus bulk full loads |
| GovInfo Bulk | None | XML; XML/JSON listings | Not stated | Mirror selected collections and retain package IDs |
| Federal Register | None documented in official spec result | JSON/OpenAPI | Endpoint-specific | Poll by publication date/document number |
| OpenFEC | API key | JSON | 1,000/hour; 100/page [cite:42] | API for deltas; bulk for history |
| EAVS | None | CSV, Excel, Stata, SPSS, SAS | Download-based | Versioned batch ingestion with codebooks/errata |
| CourtListener | Token/account | JSON | 5/min, 50/hour, 125/day [cite:33] | API deltas; bulk CSV for warehouse |
| RECAP Fetch | CourtListener token + PACER credentials | JSON/PDF jobs | 30 queued requests/min [cite:44] | Missing records only; budget PACER fees |
| PACER/CM-ECF | PACER account | HTML/PDF/RSS varies | Fee schedule | Use permitted account workflows; do not assume bulk API |
| Open States | Current account terms | GraphQL/JSON | Recheck | Normalize while retaining primary source URLs |
| Vote Smart | API key/terms | XML/JSON | Recheck | Candidate enrichment with provenance |
| USAO feeds | None | RSS/XML | Not stated | ETag/Last-Modified polling and URL deduplication |

## Normalized JSON schema

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "CivicResource",
  "type": "object",
  "required": ["resource_id", "resource_name", "publisher", "topic", "tier", "jurisdiction", "product_url", "availability", "source_authority", "verification_status", "verified_at"],
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
        "terms_url": {"type": ["string", "null"]}
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

## Coverage matrix

| Topic | Federal | State | Local swing metros | Overall |
|---|---|---|---|---|
| Voter registration/guidance | Strong guidance, no federal registry | Canonical operations | County/municipal variation | Partial pending endpoint verification |
| Election results/ballots | EAVS research layer | Canonical statewide results | Often highest-resolution data | Partial |
| Federal legislation/regulation | Strong API/bulk coverage | N/A | N/A | Covered |
| State legislation | N/A | State systems canonical | Local ordinances out of core scope | Directory covered; endpoints incomplete |
| Candidate/campaign finance | Strong FEC API/bulk | Variable | Fragmented | Partial |
| Federal courts | PACER/GovInfo | N/A | N/A | Covered with fee caveat |
| State courts | N/A | Appellate portals canonical | Trial coverage varies | Directory covered; endpoints incomplete |
| U.S. Attorneys | DOJ directory, releases, RSS | N/A | Federal districts overlap metros | Covered |
| Local prosecutors | No canonical national roster | Coordinator directories partial | Office-by-office | Material gap |

## Gap analysis

- Verify each state's registration, polling place, results, ballot measures, voter-file policy, campaign-finance database, appellate docket, and opinions endpoints.
- Verify every prioritized county's result format, precinct resolution, historical range, sample ballots, and ballot-tracking integration.
- Build a local prosecutor registry directly from office and county sources; do not rely on a single national roster.
- Document state trial-court registration, paywall, CAPTCHA, case-type, export, and reuse constraints.
- Perform a terms and licensing review; free access does not necessarily permit unrestricted commercial reuse.
- Conduct a dedicated 50-state voter-file legal-policy review covering eligibility, permitted uses, fields, fees, security, and redistribution.

## Implementation architecture

1. **Registry:** One record per publisher/product/jurisdiction with canonical URL, authority, terms, verification timestamp, and health status.
2. **Raw zone:** Preserve original JSON, XML, CSV, PDFs, feeds, retrieval metadata, and hashes.
3. **Normalized model:** People, organizations, jurisdictions, contests, bills, actions, filings, cases, dockets, documents, offices, and provenance.
4. **Identity:** Preserve FEC IDs, Congress/member/bill IDs, court/docket identifiers, and jurisdiction codes.
5. **Change processing:** Poll APIs and feeds incrementally; batch-load bulk archives; retain revisions and errata.
6. **Authority rules:** Primary publisher controls legal status; overlays enrich search, text, normalization, and entity resolution.
7. **Observability:** Monitor HTTP status, redirect target, content type, schema drift, counts, latency, quotas, and staleness.
8. **Compliance:** Maintain per-source terms, privacy, retention, and redistribution controls.

## Risks and limitations

- The federal baseline and national discovery layer are verified, but most direct state and local endpoints still require individual checks.
- Leadership data can change rapidly, especially for election officials, acting U.S. Attorneys, and local prosecutors.
- Public search does not imply bulk export or automated-access permission.
- Vendor-hosted portals can change URLs without durable redirects.
- Court indexes may omit sealed, restricted, redacted, or unavailable documents.
- Election-night results are unofficial until canvass and certification; applications must model status and revision history.

## Verification log

| Date | Resource family | Outcome |
|---|---|---|
| 2026-10-17 | Vote.gov, EAC, FVAP | Live pages and current data/guidance retrieved |
| 2026-10-17 | Congress.gov/GovInfo/Federal Register/eCFR | Official developer and bulk documentation retrieved |
| 2026-10-17 | OpenFEC | Official API documentation retrieved |
| 2026-10-17 | PACER | Search, locator, registration, fee, court lookup, and opinions pages retrieved |
| 2026-10-17 | CourtListener | API, throttling, bulk, and RECAP documentation retrieved |
| 2026-10-17 | NASS/NCSL/Open States/USA.gov | National state discovery sources retrieved |
| 2026-10-17 | DOJ USAO | Directory, count explanation, releases, and RSS retrieved |
| 2026-10-17 | Selected state examples | CA, PA, KS, NY, WA examples retrieved |
| 2026-10-17 | Swing-state local layer | Scope seeds compiled; individual office endpoints remain unverified |

## Contradiction log

- **93 U.S. Attorneys versus 94 districts:** DOJ confirms 94 districts and 93 U.S. Attorneys because Guam and CNMI share one official.[cite:112][cite:117][cite:121]
- **PACER cadence:** The national Case Locator updates daily; direct court systems update in real time.[cite:48][cite:54]
- **CourtListener limits:** Current v4 documentation controls over older API or third-party descriptions; default limits are 5/minute, 50/hour, and 125/day.[cite:33][cite:38]
- **Primary versus overlay:** State legislatures, courts, election agencies, and FEC remain canonical even when an aggregator offers a better interface.

## Completion status

| Workstream | Status |
|---|---|
| Federal voter/election/ballot | Core resources verified |
| Federal legislation/regulation | Core APIs and bulk verified |
| Federal candidates/campaign finance | OpenFEC verified |
| Federal judiciary | PACER, opinions, CourtListener, RECAP verified |
| Federal USAO | Directory, releases, RSS verified |
| State elections | National discovery complete; direct endpoints pending |
| State legislation | National discovery/API overlay complete; direct endpoints pending |
| State campaign finance | Selected examples verified; full pass pending |
| State judiciary | National discovery complete; direct endpoints pending |
| Swing-state local elections/prosecutors | Research queue complete; direct endpoints pending |
| Developer synthesis | Complete for verified core resources |
| Coverage and gaps | Complete at resource-family level |
