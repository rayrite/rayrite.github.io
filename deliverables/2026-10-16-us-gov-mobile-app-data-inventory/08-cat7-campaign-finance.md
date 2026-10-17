### Category 7: Campaign Finance

#### Narrative: The Federal Campaign Finance Disclosure Architecture

Federal campaign finance transparency in the United States is governed by the Federal Election Campaign Act (FECA) and administered by the **Federal Election Commission (FEC)**. The official **FEC Open API** (`api.open.fec.gov`), built on `api.data.gov`, is one of the most sophisticated civic technology platforms in the federal government. It delivers granular, itemized transparency into millions of transactions: candidate receipts and disbursements, political action committee (PAC) filings, Super PAC independent expenditures, and real-time electronic filings (e-filings).

While the FEC provides raw regulatory disclosures, non-profit watchdogs provide vital categorization. The **Center for Responsive Politics (OpenSecrets)** categorizes individual and PAC donors into standardized industry sectors (e.g., Defense Aerospace, Pharmaceuticals/Health Products, Securities & Investment) and tracks 'dark money' flowing through 501(c)(4) social welfare entities and 527 organizations. Federal lobbying influence is disclosed separately under the Lobbying Disclosure Act (LDA) via the **U.S. Senate Office of Public Records LDA API** (`lda.senate.gov`), while state-level campaign finance is tracked by the National Institute on Money in State Politics (**FollowTheMoney**).

| DATA POINT | DESCRIPTION | PRIMARY SOURCE | SOURCE URL | API AVAILABLE | API TYPE | AUTH REQUIRED | UPDATE FREQUENCY | COST | NOTES |
| :--- | :--- | :--- | :--- | :---: | :--- | :---: | :--- | :--- | :--- |
| Candidate Financial Summaries | Total contributions raised, total expenditures, cash-on-hand, and debts owed for federal candidates. | FEC Open API v1 | https://api.open.fec.gov/v1/candidates/totals/ | Yes | REST / JSON | api.data.gov Key | Nightly sync / Post-filing deadline | Free | Exposes candidate fundraising totals by election cycle (e.g. 2026 cycle). |
| PAC & Super PAC Filings | Receipts, disbursements, and committee profiles for Leadership PACs, Super PACs, and Hybrid PACs. | FEC Open API v1 | https://api.open.fec.gov/v1/committees/ | Yes | REST / JSON | api.data.gov Key | Nightly / Quarterly / Monthly | Free | Identifies committee designation (`super_pac`, `pac`, `party_pac`, `joint_fundraiser`). |
| Independent Expenditures (Super PAC Ads) | Itemized expenditures advocating for or against federal candidates without candidate coordination. | FEC Open API (Schedule E) | https://api.open.fec.gov/v1/schedules/schedule_e/ | Yes | REST / JSON | api.data.gov Key | Within 24-48 hours of disbursement | Free | Contains exact expenditure amount, candidate supported/opposed, payee, and date. |
| Itemized Individual Contributions | Disclosed individual donations exceeding $200 (contributor name, employer, occupation, zip code). | FEC Open API (Schedule A) | https://api.open.fec.gov/v1/schedules/schedule_a/ | Yes | REST / JSON & Bulk ZIP | api.data.gov Key | Daily processing | Free | Schedule A handles high-volume search; bulk downloads recommended for full-cycle audits. |
| Industry & Sector Donor Breakdowns | Categorization of campaign funds by economic sector (e.g. Oil & Gas, Health, Wall Street, Tech). | OpenSecrets API (CRP) | https://www.opensecrets.org/api/ | Yes | REST / JSON / XML | OpenSecrets API Key | Quarterly post-FEC filing | Free Non-Commercial / Paid | Proprietary industry taxonomy mapping donor employers to specific political sectors. |
| Federal Lobbying Disclosures (LD-2) | Quarterly lobbying reports detailing client names, lobbying firms, specific issues, and bill numbers. | U.S. Senate LDA API | https://lda.senate.gov/api/v1/ | Yes | REST / JSON | Token Auth (Free) | Quarterly deadlines (Jan/Apr/Jul/Oct) | Free | Official Senate Office of Public Records API; indexes lobbying expenses and bill targets. |
| Lobbyist Contributions (LD-203) | Semi-annual disclosures of personal and PAC contributions made by registered federal lobbyists. | U.S. Senate LDA API | https://lda.senate.gov/api/v1/contributions/ | Yes | REST / JSON | Token Auth (Free) | Semi-annual (July / January) | Free | Direct link connecting federal lobbyists to congressional campaign committee receptions. |
| Dark Money / 501(c)(4) Filings | Financial disclosures, gross receipts, and grants made by politically active non-profit 'social welfare' groups. | IRS Form 990 / ProPublica Nonprofits API | https://projects.propublica.org/nonprofits/api | Yes | REST / JSON & AWS Parquet | None | Annual (post-IRS processing) | Free | Tracks non-disclosing 501(c)(4) entities spending tens of millions on political messaging. |
| State Campaign Finance (Michigan) | Direct contributions and expenditures for Michigan state candidates (Governor, State House, Senate). | Michigan SOS Campaign Finance / FollowTheMoney | https://miboecfr.nictusa.com / https://www.followthemoney.org | Yes | Bulk Download / REST API | None (MI SOS) / API Key | Quarterly / Tri-annual | Free | Michigan Bureau of Elections MERTS database and FollowTheMoney state-level API. |


#### Datasheets: Campaign Finance Sources

##### 1. Federal Election Commission (FEC Open API)
- **Source Name & URL:** Federal Election Commission | [api.open.fec.gov](https://api.open.fec.gov) | Developer Portal: [api.open.fec.gov/developers/](https://api.open.fec.gov/developers/)
- **Data Provided:** Full authoritative regulatory disclosure: `/candidates/`, `/committees/`, `/schedules/schedule_a/` (receipts), `/schedules/schedule_b/` (disbursements), `/schedules/schedule_e/` (independent expenditures), `/filings/` (raw e-filings), `/totals/`, and bulk export archives.
- **Access Method:** RESTful HTTP GET API with comprehensive query filters (by state, cycle, candidate ID, amount range, zip code).
- **Authentication:** `api.data.gov` API Key passed via query parameter `?api_key=` or header `X-Api-Key`.
- **Update Frequency:** Daily nightly batch processing; e-filings index within hours of transmission.
- **Rate Limits:** 1,000 requests per hour standard.
- **Cost:** Free ($0).
- **Data Format:** JSON.
- **Documentation Quality:** Excellent. Interactive Swagger/OpenAPI console, clean schema definitions, and tutorial walkthroughs.
- **Recommended For:** The primary, indispensable production backbone for all federal candidate fundraising totals, Super PAC ad spending, and donor lookups.
- **Example API Endpoints (RQ-36):**
  - *Candidate Search (Michigan 2026 Senate):* `https://api.open.fec.gov/v1/candidates/?state=MI&office=S&cycle=2026&api_key={KEY}`
  - *Candidate Financial Totals:* `https://api.open.fec.gov/v1/candidate/S4MI00123/totals/?api_key={KEY}`
  - *Super PAC Independent Expenditures:* `https://api.open.fec.gov/v1/schedules/schedule_e/?candidate_id=S4MI00123&sort=-expenditure_date&api_key={KEY}`
- **Verify-Before-Integration:** None. Gold standard federal open-data service.

##### 2. OpenSecrets API (Center for Responsive Politics)
- **Source Name & URL:** Center for Responsive Politics | [opensecrets.org/api/](https://www.opensecrets.org/api/)
- **Data Provided:** Categorized donor information: candidate top 20 contributors (`candContrib`), candidate fundraising by economic industry (`candIndustry`), donor sector breakdown (`candSector`), and member personal financial disclosure assets (`memPFDprofile`).
- **Access Method:** RESTful HTTP GET API.
- **Authentication:** OpenSecrets API Key required.
- **Update Frequency:** Re-computed on a quarterly cadence following FEC filing cycles.
- **Rate Limits & Pricing Tiers (RQ-37):**
  - *Non-Commercial / Free Tier:* 200 calls per day. Free for personal, academic, or non-commercial civic use.
  - *Commercial Developer Tiers:* $500/year (1,000 calls/day) to $3,000+/year for high-throughput mobile app commercial distribution.
- **Data Format:** JSON, XML.
- **Documentation Quality:** Good. Complete list of method parameters.
- **Recommended For:** Displaying intuitive donor pie charts (e.g. 'Top Supporting Industries: 1. Health Care, 2. Real Estate, 3. Securities/Banking') in candidate profiles.
- **Example API Endpoint:** `https://www.opensecrets.org/api/?method=candIndustry&cid=N00007360&cycle=2024&output=json&apikey={KEY}`
- **Verify-Before-Integration:** Commercial license required if the mobile app incorporates advertising or subscription fees.

##### 3. Senate Lobbying Disclosure Act (LDA) API
- **Source Name & URL:** Secretary of the Senate — Office of Public Records | [lda.senate.gov/api/v1/](https://lda.senate.gov/api/v1/)
- **Data Provided:** Full statutory lobbying disclosure reports filed under 2 U.S.C. Section 1601: `/filings/` (LD-2 quarterly lobbying activity, lobbying expenditures, specific issue codes, targeted agencies), `/contributions/` (LD-203 lobbyist campaign contributions), `/lobbyists/`, and `/clients/`.
- **Access Method:** RESTful HTTP GET API.
- **Authentication:** Token Authentication (`Authorization: Token {KEY}`). Instantaneous free web registration.
- **Update Frequency:** Daily; quarterly filings surge in January, April, July, and October.
- **Rate Limits:** 10 requests per second (generous burst capacity).
- **Cost:** Free ($0).
- **Data Format:** JSON.
- **Documentation Quality:** Excellent. OpenAPI interactive schema documentation at `lda.senate.gov/api/v1/swagger/`.
- **Recommended For:** Investigating corporate lobbying influence on specific legislation (e.g. searching which defense contractors lobbied on the NDAA).
- **Example API Endpoint (RQ-39):** `https://lda.senate.gov/api/v1/filings/?filing_year=2025&client_name=Lockheed`
- **Verify-Before-Integration:** None. Official legislative disclosure platform.

##### 4. ProPublica Nonprofit Explorer (Dark Money / 501c Tracking)
- **Source Name & URL:** ProPublica | [projects.propublica.org/nonprofits/api](https://projects.propublica.org/nonprofits/api)
- **Data Provided:** Searchable database of over 1.8 million tax-exempt organizations filing IRS Form 990: gross revenue, expenses, officer compensation, and grant distributions to political front groups.
- **Access Method:** RESTful HTTP GET API.
- **Authentication:** None required for public API.
- **Update Frequency:** Updated continuously as IRS processes electronic 990 filings.
- **Rate Limits:** Polite client rate limits (~60 req/min).
- **Cost:** Free ($0 / Open Access).
- **Data Format:** JSON.
- **Documentation Quality:** Excellent. Clean response objects.
- **Recommended For:** Tracking 'dark money' 501(c)(4) social welfare organizations that spend millions on political advertising without disclosing individual donors.
- **Example API Endpoint (RQ-41):** `https://projects.propublica.org/nonprofits/api/v2/search.json?q=defending+democracy`
- **Verify-Before-Integration:** Note: ProPublica Represent campaign finance endpoints have transitioned toward static exports; use FEC Open API for candidate finance and Nonprofit Explorer for 501(c)(4) 990 data.

##### 5. FollowTheMoney (National Institute on Money in State Politics)
- **Source Name & URL:** OpenSecrets State | [followthemoney.org](https://www.followthemoney.org)
- **Data Provided:** Harmonized campaign finance records across all 50 state election commissions: gubernatorial, state senate, state house, and state judicial candidates (including Michigan Bureau of Elections data).
- **Access Method:** RESTful JSON API and bulk data downloads.
- **Authentication:** API Key required.
- **Update Frequency:** Periodic state-by-state ingestion.
- **Rate Limits:** Standard.
- **Cost:** Free for academic/research; commercial license for commercial mobile apps.
- **Data Format:** JSON, CSV.
- **Documentation Quality:** Good.
- **Recommended For:** Michigan state legislative campaign finance analysis (e.g. State Senate race fundraising).
- **Verify-Before-Integration:** Review terms of service for commercial redistribution.