# 07. Developer and Automation Inventory: APIs, Bulk Data, Rate Limits, and Legal Redistribution Terms

**Verified as of:** 2026-10-15  
**Document Purpose:** This document provides the developer-grade technical inventory for programmatic data ingestion across the economic indicator and public financial disclosure domains. It details base endpoints, authentication requirements, rate limiting algorithms, payload formats, bulk download facilities, and legal redistribution licensing frameworks necessary for engineering automated civic-tech dashboards and financial intelligence pipelines.

---

## 1. Master API Technical Specification Matrix

The following table synthesizes the technical parameters for every primary developer API cataloged across federal statistical agencies, central banking platforms, and legislative registries.

| API Service Name | Base URL / Host | Authentication Method | Rate / Burst Limits | Response Formats | Bulk Download Facility URL | Latency / Update Cadence |
|---|---|---|---|---|---|---|
| **FRED API (St. Louis Fed)** | `https://api.stlouisfed.org/fred/` | Query param: `api_key` (Free key via registration) | 120 req/minute; HTTP 429 on exceed | JSON, XML | Bulk time-series ZIP archives via FRED website | Real-time / Daily sync from primary sources |
| **Fiscal Data Treasury API** | `https://api.fiscaldata.treasury.gov/services/api/fiscal_service/` | **None** (Open access, no key required) | Fair use (No rigid per-key cap; paginate up to 10k rows) | JSON, CSV, XML | Direct bulk exports at `fiscaldata.treasury.gov` | Daily at 4:00 PM ET for prior business day |
| **Bureau of Economic Analysis (BEA)**| `https://apps.bea.gov/api/data` | Query param: `UserID` (36-char free key) | 100 req/minute, 100 MB/min, max 30 errors/min | JSON, XML | Full NIPA table packages in ZIP at `bea.gov` | Monthly / Quarterly release mornings (8:30 AM) |
| **Bureau of Labor Statistics (BLS v2)**| `https://api.bls.gov/publicAPI/v2/` | Payload param or header: `registrationkey` | 500 req/day (v2); 50 series/query; 20-yr span | JSON | Text flat files via `download.bls.gov/pub/time.series/` | Monthly release mornings (8:30 AM ET) |
| **Energy Information Admin (EIA v2)** | `https://api.eia.gov/v2/` | Header: `X-Api-Key` or param: `api_key` | 9,000 req/hour, burst < 5 req/sec; max 5k rows | JSON, XML | Manifest-indexed ZIP archives at `api.eia.gov/bulk` | Weekly releases (Mondays 5 PM, Wed/Thu 10:30 AM) |
| **openFEC API (Federal Elections)** | `https://api.open.fec.gov/v1/` | Param or header: `X-Api-Key` (`api.data.gov`) | 1,000 req/hour (free key); `DEMO_KEY` 40 req/hr | JSON | Daily and historical bulk ZIPs at `fec.gov/data/` | 24-48 hr processing lag post-filing |
| **Congress.gov API** | `https://api.congress.gov/v3/` | Header: `X-Api-Key` or param: `api_key` | 1,000 req/hour standard tier | JSON, XML | Bulk bill data and member XML via GPO GovInfo | Near-real-time legislative session updates |
| **U.S. Census Bureau API** | `https://api.census.gov/data/` | Query param: `key` (Free registration key) | 500 req/day without key; unlimited with key | JSON | FTP flat files at `www2.census.gov/econ/` | Monthly release mornings (8:30 AM ET) |

---

## 2. Granular Developer Integration Guide

### 2.1 Federal Reserve Economic Data (FRED® API)
* **Registration:** Free registration at `https://fred.stlouisfed.org/docs/api/api_key.html`.
* **Canonical Query Pattern:**
  ```text
  GET https://api.stlouisfed.org/fred/series/observations?series_id=MORTGAGE30US&api_key=YOUR_API_KEY&file_type=json
  ```
* **Developer Guidelines:** The FRED API represents the single most resilient programmatic aggregator for long-term historical series. However, client applications should cache observations locally, as rapid pagination or hammering endpoints can result in automated IP throttling (HTTP 429). Applications must adhere to the St. Louis Fed terms of use prohibiting direct replication of the core FRED website experience.

### 2.2 U.S. Department of the Treasury (Fiscal Data API)
* **Registration:** None required. The API is entirely open and governed by federal public domain standards.
* **Canonical Query Pattern (Debt to the Penny):**
  ```text
  GET https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v2/accounting/od/debt_to_penny?sort=-record_date&page[size]=100
  ```
* **Developer Guidelines:** Supports field filtering (`fields=record_date,tot_pub_debt_out_amt`) and pagination parameters (`page[number]`, `page[size]`). Up to 10,000 records can be returned in a single query payload, making it exceptionally well-suited for automated financial reporting pipelines.

### 2.3 Bureau of Labor Statistics (BLS API v2)
* **Registration:** Register for a free v2 key at `https://data.bls.gov/registrationEngine/`.
* **Canonical POST Request Pattern:**
  ```json
  POST https://api.bls.gov/publicAPI/v2/timeseries/data/
  Content-Type: application/json

  {
    "seriesid": ["CES0000000001", "LNS14000000"],
    "startyear": "2020",
    "endyear": "2026",
    "registrationkey": "YOUR_API_KEY"
  }
  ```
* **Developer Guidelines:** Always pass requests via HTTP POST with JSON payloads to query multiple series simultaneously. Unauthenticated v1 requests are capped at 25 queries per day and 10 years of history; registering a free key unlocks 500 queries/day and 20 years of continuous history.

### 2.4 U.S. Energy Information Administration (EIA API v2)
* **Registration:** Obtain free API key at `https://www.eia.gov/opendata/register.php`.
* **Canonical Query Pattern (Weekly Retail Gasoline):**
  ```text
  GET https://api.eia.gov/v2/petroleum/pri/gnd/data/?api_key=YOUR_KEY&frequency=weekly&data[0]=value&facets[series][]=EMM_EPM0_PTE_NUS_DPG&sort[0][column]=period&sort[0][direction]=desc
  ```
* **Developer Guidelines:** The EIA v2 API employs faceted navigation. Queries must specify the data frequency and facets. Individual calls return a maximum of 5,000 observations in JSON. For developers requiring the complete 2+ million series database, the unauthenticated bulk manifest system at `https://api.eia.gov/bulk` provides multi-gigabyte ZIP archives without query throttling.

### 2.5 Federal Election Commission (openFEC API)
* **Registration:** Register at `https://api.open.fec.gov/developers/` (utilizes the federal `api.data.gov` API Umbrella key).
* **Canonical Query Pattern (Candidate Totals):**
  ```text
  GET https://api.open.fec.gov/v1/candidate/S4MI00356/totals/?api_key=YOUR_KEY&election_full=true
  ```
* **Developer Guidelines:** The openFEC API exposes interactive Swagger documentation at `https://api.open.fec.gov/swagger`. Standard keys receive 1,000 requests per rolling hour. Heavy endpoints (such as `/schedules/schedule_a/`) must be queried using pagination cursors (`last_index`, `per_page=100`) and date range filters to avoid 504 gateway timeout errors.

---

## 3. Data Licensing, Copyright, and Commercial Redistribution Terms

Developers building civic-tech platforms, media dashboards, or software applications must navigate stark legal distinctions regarding how data may be stored, displayed, and redistributed.

| Data Source Family | Legal Copyright Status | Permissible Uses | Prohibited Uses & Restrictions |
|---|---|---|---|
| **Federal Statistical Agencies (BLS, BEA, Census, EIA, Treasury, Fed)** | **Public Domain** (17 U.S.C. § 105) | Unlimited commercial and non-commercial reuse, modification, redistribution, and software embedding. Zero royalty obligations. | You may not falsely claim government endorsement or modify data while presenting it as an official government statement. |
| **Federal Election Commission (FEC) Filings** | **Public Record** (52 U.S.C. § 30112(a)) | Full political, civic, academic, and journalistic analysis, publishing, and public display. | **Strict Statutory Prohibition:** Contributor names and addresses obtained from FEC reports **cannot be sold or used for commercial solicitation or fundraising**. |
| **Ethics in Government Act (EIGA) Disclosures (House, Senate, OGE)** | **Public Record** (5 U.S.C. § 13107) | News reporting, public dissemination, non-profit civic monitoring, academic research. | **Statutory Prohibition:** Cannot be used for commercial purposes (other than news media), establishing credit ratings, or soliciting funds. |
| **Freddie Mac PMMS Mortgage Survey** | **Proprietary / Free with Attribution** | Public display, charting, and commercial redistribution provided Freddie Mac is explicitly cited as the source. | Scraping live consumer rate application portals; misrepresenting survey methodology. |
| **University of Michigan Surveys of Consumers** | **Copyrighted Academic Survey** | Free public display of headline sentiment indices and 1Y/5Y inflation numbers with attribution. | Commercial redistribution or resale of underlying raw household survey microdata without academic license. |
| **The Conference Board (Consumer Confidence & LEI)** | **Copyrighted Commercial Benchmark** | Quoting headline numbers from public monthly press releases with full attribution. | Re-licensing, redistributing historical time series, or incorporating raw series into commercial software without corporate license. |
| **Institute for Supply Management (ISM PMIs)** | **Copyrighted Commercial Benchmark** | Citing headline diffusion indexes from monthly news releases in media coverage. | Automated scraping, bulk historical redistribution, or embedding historical data in enterprise data products. |
| **Major Equity Indexes (S&P 500, Dow Jones, Nasdaq, Cboe VIX)** | **Proprietary Benchmark IP** | Free display of 15-minute delayed prices and end-of-day historical closes across media websites. | **Strictly Prohibited:** Distributing real-time tick-by-tick feeds, creating derivative financial instruments, or calculating synthetic indexes without exchange licenses. |

---

## 4. Recommended Default Programmatic Retrieval Architecture

For software engineers designing automated economic intelligence dashboards or congressional tracking applications, the following architecture represents the optimal balance of data latency, operational cost, and regulatory compliance:

```
[ Automated Ingestion Pipeline ]
         │
         ├── Tier 1: High-Frequency Scheduled Economic Data
         │     ├── Primary Pathway: Direct Federal Statistical APIs (Fiscal Data, BLS, BEA, EIA)
         │     │     └── Benefit: Zero cost, public domain, immediate 8:30:00 AM availability.
         │     └── Historical / Aggregated Fallback: FRED API (St. Louis Fed)
         │           └── Benefit: Single normalized schema across 800,000+ macroeconomic series.
         │
         ├── Tier 2: Survey Sentiment & Private Benchmarks
         │     ├── Primary Pathway: Scrape Official Newsroom Press Releases (ISM, Conference Board, UMich)
         │     │     └── Benefit: Obtains free headline diffusion metrics on release morning.
         │     └── Secondary Historical: FRED mirrored series (accepting licensing lags).
         │
         ├── Tier 3: Congressional & Candidate Financial Intelligence
         │     ├── Identity Layer: Congress.gov API + Bioguide ID Authority Master Table.
         │     ├── Campaign Finance Layer: openFEC REST API + Nightly Bulk Data Files.
         │     ├── Voting Record Layer: Congress.gov API + Voteview DW-NOMINATE CSV Archives.
         │     └── Personal Disclosures & Trading:
         │           ├── Option A (Direct / Zero-Cost): Scrape House Clerk Annual XML + Senate eFD HTML.
         │           └── Option B (Normalized / Turnkey): Ingest Capitol Trades / Quiver Quantitative APIs.
```
