# U.S. Economic Indicators and Candidate / Elected-Official Public Financial Disclosures: Master Public Resource Directory

**Research Finalization Date:** 2026-10-15  
**Deliverable Package Directory:** `deliverables/2026-10-15-us-economic-indicators-and-disclosures-directory/`  
**Research Cutoff:** Current operating systems verified live as of 2026-10-15  
**Quality Control Status:** **100% PASSED** (Automated Markdown Table Quality Protocol verified across all files)

---

## 1. Executive Summary

This directory establishes a definitive, verified reference manual for tracking and retrieving the economic figures routinely cited on U.S. political talk shows, evening newscasts, and financial programs, paired with an exhaustive research guide to public financial disclosures filed by federal candidates, members of Congress, executive branch officials, and judges.

### Key Empirical Findings:

1. **The Federal Statistical Bedrock is 100% Free and Public Domain:** Every primary federal economic indicator—including Nonfarm Payrolls, the Unemployment Rate (U-3 and U-6), the Consumer Price Index (CPI), Personal Consumption Expenditures (PCE), Gross Domestic Product (GDP), the Trade Deficit, and the National Debt—is published completely **FREE of charge** by federal statistical agencies (BLS, BEA, Census Bureau, EIA, Treasury). Under 17 U.S.C. § 105, these government data releases reside in the public domain and may be ingested, cached, and redistributed without commercial licensing fees.
2. **The "Mixed-Access" Private Survey Trap:** High-profile private surveys frequently cited on political broadcasts—specifically **The Conference Board Consumer Confidence Index**, the **University of Michigan Surveys of Consumers**, and the **Institute for Supply Management (ISM) Manufacturing and Services PMIs**—exhibit a deceptive `MIXED` access structure. While top-line headline diffusion numbers are released freely via monthly newsroom press releases, full historical time-series spreadsheets, sub-indices (e.g., regional cuts, demographic microdata), and automated API endpoints are strictly paywalled behind corporate subscriptions costing thousands of dollars annually.
3. **The 8:30:00 AM Dissemination Protocol:** The simultaneous broadcast of major economic numbers across every news network down to the exact second is managed through sophisticated federal embargo infrastructure. Historically operated via physical, quarantined "press lockup rooms" in Washington, D.C. with electronic kill switches, major agencies have largely transitioned to secure cloud-staged releases governed by synchronized cryptographic release timers and severe federal trade-secret penalties for premature transmission.
4. **Decentralized Congressional Disclosures and Lack of Official REST APIs:** Federal personal financial disclosures mandated under the Ethics in Government Act of 1978 (EIGA) and the STOCK Act of 2012 are administratively fragmented across independent repositories (House Clerk, Senate Office of Public Records, and the Office of Government Ethics). **Neither congressional chamber provides an official developer REST API.** Filings consist largely of static PDFs (including substantial volumes of handwritten, scanned forms) and broad statutory valuation brackets (e.g., $1,001 - $15,000; $50,001 - $100,000), necessitating specialized OCR parsing and civic-tech intermediaries (e.g., Capitol Trades, Unusual Whales, OpenSecrets) for structured portfolio analysis.
5. **Presidential Candidate Dual-Agency Filing:** Candidates running for President or Vice President file OGE Form 278e directly with the **Federal Election Commission (FEC)** within 30 days of candidacy or by May 15. The FEC transmits copies to the **Office of Government Ethics (OGE)** for formal compliance review and certification, with public inspection available through both agencies.

---

## 2. Directory Navigation and Package Structure

This research deliverable is structured into modular, cross-referenced Markdown documents:

| Deliverable File | Core Contents | Focus Area |
|---|---|---|
| **`00-README.md`** (This Document) | Executive summary, research metadata, quick-reference tables, maintenance plan, expansion scoping, QC statement, and traceability matrix. | Master Overview |
| **`01-indicator-taxonomy-and-glossary.md`** | 7-domain taxonomy, media-to-official translation glossary, near-duplicate groupings (CPI vs PCE, CES vs CPS, U-3 vs U-6), and T-3 long-tail bounding evidence. | Taxonomy & Glossary |
| **`02-economic-indicator-catalog.md`** | Authoritative core catalog containing canonical 15-field records for every indicator across Labor, Prices, Rates, Macro/Fiscal, Sentiment, Energy, and Markets. | Indicator Catalog |
| **`03-access-matrix.md`** | Consolidated master access matrix mapping every datapoint to its verified web, API, and bulk models, with dedicated sections on pure-free, freemium, and paywalled boundaries. | Access Matrix |
| **`04-release-calendar.md`** | Master release schedule, canonical calendar URLs, reporting lags, and in-depth documentation of press lockup, embargo, and first-publication mechanics. | Release Schedules |
| **`05-candidates-and-officeholders-sources.md`**| Identity infrastructure (Bioguide, Congress.gov), campaign finance (FEC, openFEC API), voting records (Voteview, GovTrack), and full-stack worked example. | Candidates & Officials |
| **`06-financial-disclosures-guide.md`** | Federal personal financial disclosures (House, Senate, OGE, Presidential, Judicial), document matrices, practical obstacles (scanned PDFs), and state/local landscape. | Financial Disclosures |
| **`07-apis-and-automation.md`** | Developer inventory of federal APIs (FRED, Fiscal Data, BEA, BLS, EIA, openFEC, Congress.gov), endpoints, rate limits, bulk downloads, and legal redistribution rules. | APIs & Automation |
| **`08-verification-log.md`** | Claim-to-source verification log, contradiction analysis, research-question completeness matrix, table QC audit, stopping rationale, and master bibliography. | Verification & Audit |
| **`us-economic-indicators-and-disclosures-directory.md`**| Consolidated single-file publication-grade compendium combining the entire research deliverable into a unified reference manual. | Master Document |

---

## 3. Quick-Reference Tables

### 3.1 Top Recommended Retrieval Paths for Broadcast Staples

| Show-Cited Indicator | Recommended Primary Retrieval Path | Access Model | Programmatic Developer Endpoint |
|---|---|---|---|
| **Jobs Report / Payrolls** | BLS Employment Situation News Release | **FREE** | BLS API v2: Series `CES0000000001` or FRED API: `PAYEMS` |
| **Unemployment Rate** | BLS CPS Table A-15 / Series Viewer | **FREE** | BLS API v2: Series `LNS14000000` (U-3) or FRED API: `UNRATE` |
| **Inflation (Headline CPI)** | BLS Consumer Price Index News Release | **FREE** | BLS API v2: Series `CUSR0000SA0` or FRED API: `CPIAUCSL` |
| **Core Inflation** | BLS CPI-U Less Food and Energy Table | **FREE** | BLS API v2: Series `CUSR0000SA0L1E` or FRED API: `CPILFESL` |
| **Fed's Preferred Inflation**| BEA Personal Income and Outlays (PCE) | **FREE** | BEA API: NIPA Table 2.8.4 Line 1 or FRED API: `PCEPI` |
| **The Fed Funds Rate** | Federal Reserve FOMC Statement | **FREE** | FRED API: Series `FEDFUNDS`, `DFEDTARU`, `DFEDTARL` |
| **Treasury Yield Curve** | U.S. Treasury Daily Yield Curve Table | **FREE** | Fiscal Data API: `v2/accounting/od/avg_interest_rates` |
| **30-Year Mortgage Rate** | Freddie Mac PMMS Weekly Excel Archive | **FREE** | FRED API: Series `MORTGAGE30US` |
| **Gross Domestic Product** | BEA National Economic Accounts | **FREE** | BEA API: NIPA Table 1.1.1 Line 1 or FRED API: `GDPC1` |
| **National Debt Total** | Treasury Fiscal Data "Debt to the Penny" | **FREE** | Fiscal Data API: `v2/accounting/od/debt_to_penny` (No Key) |
| **Weekly Gas & Diesel** | EIA Weekly Petroleum Marketing Update | **FREE** | EIA API v2: `petroleum/pri/gnd/data/` or Bulk Manifest |
| **Consumer Confidence** | The Conference Board Newsroom Release | **MIXED** | Web scrape headline release (Microdata requires PAID-SUB) |
| **Consumer Sentiment** | University of Michigan Surveys of Consumers | **MIXED** | Public web release; historical series via FRED API: `UMCSENT`|
| **Factory Activity (PMI)** | Institute for Supply Management (ISM) | **MIXED** | Web scrape headline news release (Database requires PAID-SUB) |
| **Dow Jones / S&P 500** | Major Financial Portals / S&P Dow Jones | **DELAYED-FREE**| Commercial APIs (EODHD, FMP) for delayed; FRED for historical |
| **Congressional Trades** | House Clerk & Senate eFD Portals | **FREE / FREE-REG** | Scrape House XML index / Ingest Capitol Trades / Quiver API |

### 3.2 The Pure Free-Only Shortlist (Zero Cost, No Registration, No Key)
The following resources require zero authentication, no accounts, and no payment:
1. **U.S. Treasury Fiscal Data:** Debt to the Penny, Daily Treasury Statement, Monthly Treasury Statement (`api.fiscaldata.treasury.gov`).
2. **Freddie Mac Historical PMMS Excel Archive:** 50+ years of weekly mortgage rate history (`freddiemac.com/pmms`).
3. **EIA Bulk Energy Manifest Archives:** Complete national fuel price and storage histories (`api.eia.gov/bulk`).
4. **BLS Public Flat Files:** Complete time-series archives for CPI, PPI, CES, and CPS (`download.bls.gov`).
5. **Cboe VIX Historical Archive:** Continuous daily volatility history back to 1990 in CSV format (`cboe.com`).
6. **House Financial Disclosure Search:** Public PDF search for all House member filings (`disclosures-clerk.house.gov`).
7. **Judicial Financial Disclosures:** Direct search for Supreme Court and federal judge reports (`judicialdisclosures.uscourts.gov`).

### 3.3 The Paywalled and Mixed Alert List
Researchers must account for payment barriers or registration walls on the following resources:
* **The Conference Board (CCI & LEI):** Complete microdata and historical series require institutional subscription.
* **Institute for Supply Management (PMIs):** Complete historical diffusion database requires paid membership.
* **University of Michigan Microdata:** Underlying household survey files require academic verification.
* **AAA / OPIS Daily Station Gas Prices:** Raw station-level transactional feed is strictly proprietary to OPIS.
* **Real-Time Intraday Equity Feeds:** Real-time DJIA, S&P 500, and Nasdaq feeds require exchange licenses.
* **Normalized Congressional Trading APIs:** Structured, OCR-parsed REST feeds of member stock trades (Capitol Trades, Unusual Whales, Quiver Quantitative) require monthly subscriptions ($20 - $100+/mo).

---

## 4. Systemic Access Patterns by Publisher Sector

Analyzing the 45 cataloged indicators across publishing sectors reveals consistent empirical patterns:

```
[ Primary Federal Statistical Agencies ] ───► 100% FREE, Public Domain, Free-Key APIs, Bulk FTP/ZIP
[ Central Bank (Federal Reserve / FRED) ] ───► 100% FREE, Public Domain, Free-Key FRED API Aggregator
[ Housing Enterprise (Freddie Mac) ] ───────► 100% FREE Web / Bulk Excel, Free with Attribution
[ Non-Profit / University Surveys ] ────────► MIXED: Free Monthly Press Release; Paid Full Database
[ Professional Associations (ISM / NFIB) ] ──► MIXED: Free Narrative Summary; Paid Historical Archive
[ Securities Exchanges / Index Owners ] ────► DELAYED-FREE: Free 15-Min Delay; Expensive Real-Time IP
[ Commercial Data Aggregators ] ────────────► FREEMIUM / PAID-SUB: Free Basic Web; Paywalled REST APIs
```

---

## 5. Maintenance Plan and Re-Verification Schedule

Because web endpoints, portal designs, and API gateways periodically evolve, this directory requires structured recurring maintenance:

1. **Annual Federal Release Calendar Re-Baseline (Every October):** Federal statistical agencies (BLS, BEA, Census Bureau) publish their complete release calendars for the upcoming calendar year in September/October. The master calendar in File 04 should be re-baselined annually on **October 15**.
2. **API Endpoint and Rate-Limit Review (Bi-Annual):** API gateway policies (specifically `api.data.gov`, openFEC, and BLS API v2) should be checked every 6 months to record updated pagination parameters, endpoint deprecations, and token-bucket rate limits.
3. **Congressional Portal Reorganization Watch (Every New Congress / Biennial January):** When a new Congress convenes in January of odd-numbered years, the Clerk of the House and Secretary of the Senate frequently reorganize web search URLs and server directories. File 06 links must be validated during each congressional transition.
4. **State Ethics Commission Audit (Annual Spring):** State disclosure systems are highly volatile due to legislative reforms (e.g., Michigan's 2023 financial disclosure legislation). State portals should be audited annually following state legislative session adjournments.

---

## 6. Follow-Up Expansion Scoping (SQ-05)

Should future research require deeper specialized investigation, the following expansion tracks are pre-scoped:

* **Track A: Deep 50-State Financial Disclosure Dossier:** Comprehensive profiling of all 50 state ethics commissions, statutory gift limits, outside employment rules, candidate filing portals, and local municipal disclosure thresholds. (Estimated effort: 4x expansion of File 06).
* **Track B: Historical Vintage and Real-Time Data Archaeology (ALFRED):** Detailed tracking of statistical revision vintages (initial vs second vs final revisions) across GDP and Nonfarm Payrolls using the St. Louis Fed's **ALFRED (ArchivaL Federal Reserve Economic Data)** database to analyze how broadcast economic numbers were revised months after elections.
* **Track C: Commercial Machine-Readable Congressional Stock Feeds:** Technical benchmarking and schema extraction of paid enterprise APIs (EODHD Congressional Trading API, Financial Modeling Prep Senate/House Feeds, Quiver Quantitative API) for automated algorithmic trading applications.

---

## 7. Markdown Table Quality Control Statement

Pursuant to the explicit instructions of the user request and Section 12.4 of the handoff protocol, an automated quality assurance audit was conducted across every deliverable file using `validate_tables_qc.py`.

* **Audit Date:** 2026-10-15
* **Target Directory:** `deliverables/2026-10-15-us-economic-indicators-and-disclosures-directory/`
* **Total Deliverable Markdown Files Validated:** 9 files
* **Audit Result:** **100% PASSED (0 Defects Found)**
* **Standards Enforced:** Strict header-to-delimiter row pairing; identical column counts across all rows; zero unescaped pipe characters in cells; zero raw HTML tags; proper wide-table formatting.

---

## 8. Master Traceability Matrix

The following matrix connects the primary research objectives, handoff research questions (Section 7), workstreams, deliverable sections, supporting sources, and confidence ratings.

| Research Question | Objective Description | Workstream | Deliverable Section | Primary Supporting Sources | Confidence | Remaining Gaps |
|---|---|---|---|---|---|---|
| **RQ-PRIMARY** | Comprehensive indicator directory & disclosure guide | WS-01 to 14 | All Deliverable Files | BLS, BEA, Fed, Treasury, House, Senate, OGE, FEC | **HIGH** | None (Fully Answered) |
| **RQ-01** | Taxonomy & indicator universe bounding | WS-01 | File 01, Sec 1-4 | Agency release schedules, economic calendars, style guides | **HIGH** | None |
| **RQ-02** | Labor market indicators & APIs | WS-02 | File 02, Sec 1 | BLS Employment Situation, ETA Claims, JOLTS, ADP | **HIGH** | None |
| **RQ-03** | Inflation & price index sources | WS-03 | File 02, Sec 2 | BLS CPI/PPI, BEA PCE, ECI programs | **HIGH** | None |
| **RQ-04** | Interest rates, yields, mortgage benchmarks | WS-04 | File 02, Sec 3 | Federal Reserve FOMC, Treasury, Freddie Mac PMMS | **HIGH** | None |
| **RQ-05** | Macro aggregates, GDP ladder, debt framings | WS-05 | File 02, Sec 4 | BEA NIPA, Census MARTS, Fiscal Data Treasury | **HIGH** | None |
| **RQ-06** | Confidence & sentiment free/paywall split | WS-06 | File 02, Sec 5 | Conference Board, UMich, ISM, NFIB | **HIGH** | None |
| **RQ-07** | Energy price sources & layering | WS-07 | File 02, Sec 6 | EIA Weekly Gasoline, AAA Daily, Spot Crude | **HIGH** | None |
| **RQ-08** | Equity markets, volatility, index licensing | WS-08 | File 02, Sec 7 | S&P DJI, Nasdaq, Cboe VIX, NYSE | **HIGH** | None |
| **RQ-09** | Release calendars, lockup/embargo mechanics | WS-09 | File 04, Sec 1-3 | Agency newsrooms, lockup rules, 8:30 AM protocols | **HIGH** | None |
| **RQ-10** | Candidate identity, FEC campaign finance, votes | WS-10 | File 05, Sec 1-5 | Bioguide, openFEC API, Congress.gov, Voteview | **HIGH** | None |
| **RQ-11** | Federal personal financial disclosures in depth | WS-11 | File 06, Sec 1-5 | House Clerk, Senate eFD, OGE, FEC, Judicial Portal | **HIGH** | None |
| **RQ-12** | State/local disclosure overview & sample | WS-12 | File 06, Sec 6 | NCSL, CA FPPC, NY COELIG, TX TEC, FL Ethics | **MEDIUM** | Scoped as overview (CQ-02) |
| **RQ-13** | Consolidated access matrix & legal terms | WS-13 | File 03, File 07 | 17 U.S.C. § 105, 5 U.S.C. § 13107, terms of use | **HIGH** | None |
| **RQ-14** | Coverage gaps, dead ends, retired tools | WS-14 | File 08, Sec 5 | Fed DDP retirement, lack of House/Senate REST APIs | **HIGH** | None |
