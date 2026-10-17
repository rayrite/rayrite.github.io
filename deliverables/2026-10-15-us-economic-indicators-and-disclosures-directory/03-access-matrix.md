# 03. Consolidated Free-vs-Paywall Access Matrix and Data Governance Map

**Verified as of:** 2026-10-15  
**Document Purpose:** This document provides the single, consolidated reference matrix mapping every show-cited economic indicator and financial disclosure dataset to its verified access model across Web, API, and Bulk channels. It standardizes access classifications using the formal taxonomy (Section 8.3), delineates licensing postures, and highlights critical systemic boundaries between open public domain data and proprietary commercial paywalls.

---

## 1. Access Model Classification Taxonomy

Every cataloged resource is classified under the uniform eight-tier access model taxonomy:

* **`FREE`:** Completely open public access; zero monetary cost, no user account registration, no API key, and no interactive barrier.
* **`FREE-REG`:** Free of monetary charge, but mandates creating an end-user account or accepting an online user agreement.
* **`FREE-KEY`:** Free developer access requiring an automated or self-service API key/token (no credit card or subscription fee).
* **`FREEMIUM`:** A functional free tier exists with defined rate/volume limits, with expanded historical or real-time access requiring a paid tier.
* **`DELAYED-FREE`:** Real-time data is paywalled or restricted, but historical closing or delayed figures (typically 15-20 minutes) are published freely.
* **`PAID-SUB`:** Access requires a recurring commercial, institutional, or association subscription.
* **`PAID-ONE`:** Access requires a single one-time transaction fee per report, filing, or dataset.
* **`MIXED`:** Access model diverges significantly across surfaces of the same resource (e.g., headline news release is FREE, but the underlying microdata database is PAID-SUB).

Licensing postures are captured across four standard legal categories:
1. `Public Domain`: U.S. Federal Government work under 17 U.S.C. § 105 (free for commercial and non-commercial reuse without restriction).
2. `Free with Attribution`: Open data licenses (CC-BY, ODbL, or publisher terms requiring citation).
3. `Copyrighted Commercial`: Proprietary intellectual property with commercial reuse and redistribution strictly prohibited without licensing.
4. `Statutory Public Record`: Public disclosure records open for inspection under federal statute, with specific legal prohibitions against commercial or credit-scoring exploitation.

---

## 2. Master Consolidated Economic Indicator Access Matrix

The following table indexes every in-scope economic datapoint, mapping its primary publisher, institutional layer, web access model, API access model, bulk download availability, licensing status, and verification date.

| Indicator / Datapoint | Primary Publisher | Layer | Web Access | API Access | Bulk Data | Licensing Posture | Verified Date |
|---|---|---|---|---|---|---|---|
| Total Nonfarm Payrolls (Jobs Report) | Bureau of Labor Statistics (BLS) | Primary | FREE | FREE-KEY | FREE (Flat Files) | Public Domain | 2026-10-15 |
| Unemployment Rate (U-3 / U-6) | Bureau of Labor Statistics (BLS) | Primary | FREE | FREE-KEY | FREE (Flat Files) | Public Domain | 2026-10-15 |
| Labor Force Participation Rate | Bureau of Labor Statistics (BLS) | Primary | FREE | FREE-KEY | FREE (Flat Files) | Public Domain | 2026-10-15 |
| Average Hourly Earnings (Wage Growth) | Bureau of Labor Statistics (BLS) | Primary | FREE | FREE-KEY | FREE (Flat Files) | Public Domain | 2026-10-15 |
| Weekly Jobless Claims (Initial / Cont) | Employment and Training Admin (ETA) | Primary | FREE | FREE-KEY (via FRED) | FREE (Archive Tables) | Public Domain | 2026-10-15 |
| JOLTS Job Openings and Quits | Bureau of Labor Statistics (BLS) | Primary | FREE | FREE-KEY | FREE (Flat Files) | Public Domain | 2026-10-15 |
| ADP Private Payrolls | ADP Research Institute / Stanford | Secondary | FREE | FREE (via FRED) | FREE (Excel Downloads) | Copyrighted Commercial | 2026-10-15 |
| Challenger Job Cut Report | Challenger, Gray and Christmas | Secondary | FREE (Summary) | PAID-SUB | PAID-SUB | Copyrighted Commercial | 2026-10-15 |
| Consumer Price Index (Headline & Core) | Bureau of Labor Statistics (BLS) | Primary | FREE | FREE-KEY | FREE (Flat Files) | Public Domain | 2026-10-15 |
| Producer Price Index (PPI Final Demand)| Bureau of Labor Statistics (BLS) | Primary | FREE | FREE-KEY | FREE (Flat Files) | Public Domain | 2026-10-15 |
| PCE Price Index (Fed Inflation Gauge) | Bureau of Economic Analysis (BEA) | Primary | FREE | FREE-KEY | FREE (ZIP Archives) | Public Domain | 2026-10-15 |
| Employment Cost Index (ECI) | Bureau of Labor Statistics (BLS) | Primary | FREE | FREE-KEY | FREE (Flat Files) | Public Domain | 2026-10-15 |
| Import and Export Price Indexes | Bureau of Labor Statistics (BLS) | Primary | FREE | FREE-KEY | FREE (Flat Files) | Public Domain | 2026-10-15 |
| Federal Funds Target Range | Federal Reserve Board / FOMC | Primary | FREE | FREE (via FRED) | FREE (Complete History) | Public Domain | 2026-10-15 |
| Effective Federal Funds Rate (EFFR) | Federal Reserve Bank of New York | Primary | FREE | FREE-KEY (via FRED) | FREE (CSV Downloads) | Public Domain | 2026-10-15 |
| Daily Treasury Par Yield Curve | U.S. Department of the Treasury | Primary | FREE | FREE (Fiscal Data API) | FREE (CSV / XML) | Public Domain | 2026-10-15 |
| 10-Year Treasury Constant Maturity | U.S. Department of the Treasury | Primary | FREE | FREE (Fiscal Data API) | FREE (CSV / XML) | Public Domain | 2026-10-15 |
| 30-Year Mortgage Rate (PMMS) | Freddie Mac (FHLMC) | Primary | FREE | FREE-KEY (via FRED) | FREE (Excel Archive) | Free with Attribution | 2026-10-15 |
| Daily Mortgage Rate Survey | Mortgage News Daily (MND) | Secondary | FREE | PAID-SUB | PAID-SUB | Copyrighted Commercial | 2026-10-15 |
| G.19 Consumer Credit (Auto / Card) | Federal Reserve Board of Governors | Primary | FREE | FREE-KEY (via FRED) | FREE (XML / CSV) | Public Domain | 2026-10-15 |
| Gross Domestic Product (Real GDP) | Bureau of Economic Analysis (BEA) | Primary | FREE | FREE-KEY | FREE (NIPA Tables) | Public Domain | 2026-10-15 |
| Advance Retail Sales (MARTS) | U.S. Census Bureau | Primary | FREE | FREE-KEY | FREE (Excel Archives) | Public Domain | 2026-10-15 |
| Manufacturers Orders (Durable Goods) | U.S. Census Bureau | Primary | FREE | FREE-KEY | FREE (Historical Files) | Public Domain | 2026-10-15 |
| Industrial Production and Capacity | Federal Reserve Board of Governors | Primary | FREE | FREE-KEY (via FRED) | FREE (Flat Files) | Public Domain | 2026-10-15 |
| U.S. Trade Deficit (FT-900) | Census Bureau / BEA Joint Release | Primary | FREE | FREE-KEY | FREE (Historical Series)| Public Domain | 2026-10-15 |
| Monthly Treasury Statement (Deficit) | Bureau of the Fiscal Service | Primary | FREE | FREE (Fiscal Data API) | FREE (MTS Tables) | Public Domain | 2026-10-15 |
| Debt to the Penny (National Debt) | Bureau of the Fiscal Service | Primary | FREE | FREE (Fiscal Data API) | FREE (CSV / JSON Bulk) | Public Domain | 2026-10-15 |
| Consumer Confidence Index (CCI) | The Conference Board | Primary | MIXED | PAID-SUB | PAID-SUB | Copyrighted Commercial | 2026-10-15 |
| Consumer Sentiment Index (ICS) | University of Michigan ISR | Primary | MIXED | FREE-REG (Academic) | FREE (PDF / Tables) | Copyrighted Commercial | 2026-10-15 |
| 1-Year / 5-Year Inflation Expectations| University of Michigan ISR | Primary | MIXED | FREE-REG (Academic) | FREE (PDF / Tables) | Copyrighted Commercial | 2026-10-15 |
| Small Business Optimism Index | NFIB Research Center | Primary | FREE | FREE-KEY (via FRED) | FREE (Full PDF Tables) | Free with Attribution | 2026-10-15 |
| ISM Manufacturing PMI | Institute for Supply Management | Primary | MIXED | PAID-SUB | PAID-SUB | Copyrighted Commercial | 2026-10-15 |
| ISM Services PMI | Institute for Supply Management | Primary | MIXED | PAID-SUB | PAID-SUB | Copyrighted Commercial | 2026-10-15 |
| S&P Global US Manufacturing PMI | S&P Global Market Intelligence | Primary | MIXED | PAID-SUB | PAID-SUB | Copyrighted Commercial | 2026-10-15 |
| Leading Economic Index (LEI) | The Conference Board | Primary | MIXED | PAID-SUB | PAID-SUB | Copyrighted Commercial | 2026-10-15 |
| Weekly Retail Gas and Diesel Prices | Energy Information Admin (EIA) | Primary | FREE | FREE-KEY (EIA API v2) | FREE (Bulk Manifest) | Public Domain | 2026-10-15 |
| AAA Daily Fuel Gauge Report | American Auto Association / OPIS | Secondary | FREE | PAID-SUB | PAID-SUB | Copyrighted Commercial | 2026-10-15 |
| Spot Crude Oil Benchmark (WTI Cushing)| Energy Information Admin (EIA) | Primary | FREE | FREE-KEY (EIA API v2) | FREE (Historical Files) | Public Domain | 2026-10-15 |
| Spot Crude Oil Benchmark (Brent Europe)| Energy Information Admin (EIA) | Primary | FREE | FREE-KEY (EIA API v2) | FREE (Historical Files) | Public Domain | 2026-10-15 |
| Weekly Natural Gas Storage Report | Energy Information Admin (EIA) | Primary | FREE | FREE-KEY (EIA API v2) | FREE (Bulk Manifest) | Public Domain | 2026-10-15 |
| Dow Jones Industrial Average (DJIA) | S&P Dow Jones Indices | Primary | DELAYED-FREE | FREEMIUM / PAID-SUB | FREE (via FRED Archive) | Copyrighted Commercial | 2026-10-15 |
| S&P 500 Index (SPX) | S&P Dow Jones Indices | Primary | DELAYED-FREE | FREEMIUM / PAID-SUB | FREE (via FRED Archive) | Copyrighted Commercial | 2026-10-15 |
| Nasdaq Composite Index (COMP) | Nasdaq, Inc. | Primary | DELAYED-FREE | FREEMIUM / PAID-SUB | FREE (via FRED Archive) | Copyrighted Commercial | 2026-10-15 |
| Cboe Volatility Index (VIX) | Cboe Global Markets | Primary | FREE | FREE-KEY (via FRED) | FREE (Direct CSV File) | Free with Attribution | 2026-10-15 |
| NYSE Daily Market Breadth (A/D Line) | New York Stock Exchange (ICE) | Primary | DELAYED-FREE | PAID-SUB | PAID-SUB | Copyrighted Commercial | 2026-10-15 |

---

## 3. Public Disclosure and Candidate Financial Disclosures Access Matrix

This section inventories the primary public records, filing repositories, and derived transparency systems governing federal candidates, members of Congress, executive officials, and state officeholders.

| Filing System / Record Type | Regulatory Authority | Layer | Web Access | API Access | Bulk Data | Licensing / Legal Terms | Verified Date |
|---|---|---|---|---|---|---|---|
| House Annual Financial Disclosures | Office of the Clerk, U.S. House | Primary | FREE | None (No REST API) | FREE (Yearly Index XML)| Statutory Public Record | 2026-10-15 |
| House Periodic Transaction Reports (PTR) | Office of the Clerk, U.S. House | Primary | FREE | None (No REST API) | None (Individual PDFs) | Statutory Public Record | 2026-10-15 |
| Senate Annual Financial Disclosures | Secretary of the Senate (OPR) | Primary | FREE-REG (Agreement)| None (No REST API) | None (No Native Bulk) | Statutory Public Record | 2026-10-15 |
| Senate Periodic Transaction Reports (PTR) | Secretary of the Senate (OPR) | Primary | FREE-REG (Agreement)| None (No REST API) | None (HTML / Scanned) | Statutory Public Record | 2026-10-15 |
| Executive Branch Form 278e (PAS Level 1-2)| Office of Government Ethics (OGE) | Primary | FREE | None (No REST API) | None (Individual PDFs) | Statutory Public Record | 2026-10-15 |
| Executive Branch Form 201 Inspection Requests| Office of Government Ethics (OGE) | Primary | FREE-REG (Form 201) | None (No REST API) | None (Manual Delivery) | Statutory Public Record | 2026-10-15 |
| Presidential Candidate Form 278e Filings | FEC Public Records / OGE | Primary | FREE | None (No Direct API) | None (PDF Documents) | Statutory Public Record | 2026-10-15 |
| Federal Campaign Finance Filings / Data | Federal Election Commission (FEC) | Primary | FREE | FREE-KEY (openFEC API)| FREE (Nightly Bulk ZIP)| Public Domain | 2026-10-15 |
| Congressional Member Profiles / Bioguide | Congress.gov / Library of Congress | Primary | FREE | FREE-KEY (Congress API)| FREE (Bulk JSON / XML) | Public Domain | 2026-10-15 |
| Congressional Roll Call Votes | House Clerk / Senate Legislative Desk | Primary | FREE | FREE-KEY (Congress API)| FREE (XML Bulk Data) | Public Domain | 2026-10-15 |
| Capitol Trades (Congressional Stock Tracker)| 2iQ Research | Secondary | FREEMIUM | PAID-SUB | PAID-SUB | Copyrighted Commercial | 2026-10-15 |
| Unusual Whales (Political Trading Tracker)| Unusual Whales | Secondary | FREEMIUM | PAID-SUB | PAID-SUB | Copyrighted Commercial | 2026-10-15 |
| Quiver Quantitative (Congress Stock Trades)| Quiver Quantitative | Secondary | FREEMIUM | PAID-SUB (Dev API) | PAID-SUB | Copyrighted Commercial | 2026-10-15 |
| OpenSecrets (Campaign & Personal Wealth) | Center for Responsive Politics | Secondary | FREE | FREE-KEY (OpenSecrets) | FREE-REG (Academic Bulk)| Free with Attribution | 2026-10-15 |
| California Form 700 Statement of Interests | Fair Political Practices Comm (FPPC) | Primary | FREE | None (No Public API) | FREEMIUM (NetFile Bulk)| Statutory Public Record | 2026-10-15 |
| New York Annual Financial Disclosure (FDS) | NY Commission on Ethics (COELIG) | Primary | FREE-REG (Request) | None (No Public API) | None (Redacted PDFs) | Statutory Public Record | 2026-10-15 |
| Texas Personal Financial Statements (PFS) | Texas Ethics Commission (TEC) | Primary | FREE | None (No Public API) | None (Individual PDFs) | Statutory Public Record | 2026-10-15 |
| Florida Form 6 Electronic Disclosures | Florida Commission on Ethics | Primary | FREE | None (No Public API) | None (Search Portal) | Statutory Public Record | 2026-10-15 |

---

## 4. Key Thematic Access Boundaries

### 4.1 Pure Free Public Domain Resources (Zero Cost, No Key, No Registration)
The cornerstone of U.S. macroeconomic intelligence is provided by the federal statistical infrastructure at zero cost to the public. The following sources can be queried, automated, and downloaded without creating accounts, requesting API tokens, or paying fees:
* **U.S. Department of the Treasury Fiscal Data:** Daily Treasury Statement, Debt to the Penny, Monthly Treasury Statement, and Historical Interest Rates via `api.fiscaldata.treasury.gov`.
* **Freddie Mac PMMS Bulk Archives:** The entire 50+ year weekly history of 30-year and 15-year mortgage rates in a direct Excel spreadsheet at `freddiemac.com`.
* **EIA Bulk Data Archives:** Complete national and regional energy price histories packaged as compressed JSON manifest files via `api.eia.gov/bulk`.
* **BLS Public FTP / HTTP Flat Files:** Complete time series for CPI, PPI, CES Payrolls, CPS Unemployment, and JOLTS stored as tab-delimited text files at `download.bls.gov`.
* **Cboe VIX Historical Archive:** Complete daily open, high, low, and close volatility history back to 1990 in direct CSV format at `cboe.com`.

### 4.2 Free with Self-Service Developer Registration (Free-Key)
These systems require developers to register for an automated API key, which is issued instantly without commercial vetting:
* **Federal Reserve Bank of St. Louis (FRED API):** Requires free account registration; allows up to 120 requests/minute covering over 800,000 national and international series.
* **Bureau of Labor Statistics (BLS API v2):** Requires free registration; increases query ceiling from 25 queries/day to 500 queries/day with multi-series capabilities.
* **Bureau of Economic Analysis (BEA API):** Instant 36-character UserID providing access to GDP and PCE NIPA accounts (100 req/min).
* **U.S. Energy Information Administration (EIA API v2):** Self-service key providing 9,000 requests/hour for petroleum and fuel time series.
* **Federal Election Commission (openFEC API):** Free key via `api.data.gov` granting 1,000 requests/hour across federal campaign finance filings.
* **Congress.gov API:** Free key via `api.data.gov` providing structured access to member rosters, bill summaries, and roll call votes.

### 4.3 The Mixed-Access Cluster (Headline Free vs Microdata Paywalled)
The most deceptive category for public-record researchers is the **MIXED** survey cluster owned by non-profit organizations, universities, and trade associations:
* **The Conference Board (Consumer Confidence & LEI):** Top-line headline indexes and high-level charts are published for free in monthly news releases at 10:00 AM ET. However, querying the complete time series, underlying survey questions, or demographic microdata requires an institutional enterprise subscription costing thousands of dollars annually.
* **Institute for Supply Management (Manufacturing & Services PMIs):** Headline diffusion numbers and detailed narrative summaries are free on the website. Complete historical spreadsheets dating back to the 1940s are strictly gated behind paid ISM corporate memberships.
* **University of Michigan (Surveys of Consumers):** Monthly preliminary and final headline sentiment figures and 1Y/5Y inflation expectations are freely published on its website and mirrored on FRED. However, downloading the underlying household microdata files requires an academic verification process.
* **S&P Global US PMIs:** Monthly "Flash" and final press releases provide free headline numbers; full economic sub-indexes are sold through S&P Market Intelligence terminals.

### 4.4 The Commercial Paywalled Boundary
Where public data meets commercial capital markets, free access abruptly terminates:
* **Real-Time Intraday Equity Feeds:** The Dow Jones Industrial Average, S&P 500, and Nasdaq Composite are proprietary benchmarks. While end-of-day closing prices are free across news portals, real-time tick-by-tick feeds require costly exchange and index licensing agreements.
* **Daily Retail Fuel Station Data (OPIS / AAA):** While AAA publishes daily national and state averages freely on its website, the underlying station-level database (130,000+ daily station credit-card transaction feeds) is the commercial property of OPIS.
* **Aggregated Corporate Layoff Data (Challenger, Gray & Christmas):** The monthly press release is free, but the historical sector-by-sector database is proprietary.
* **Commercial Congressional Trading APIs:** Because official congressional disclosure portals do not provide native REST APIs, third-party platforms (Unusual Whales, Quiver Quantitative, Capitol Trades, EODHD) charge subscription fees ranging from $20/month to thousands of dollars annually for normalized, OCR-parsed, structured JSON feeds of congressional stock trades.
