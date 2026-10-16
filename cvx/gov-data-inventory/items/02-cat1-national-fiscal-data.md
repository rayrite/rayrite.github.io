### Category 1: National Fiscal Data

#### Narrative: The National Fiscal Data Landscape

The United States fiscal data landscape is anchored by the Department of the Treasury's **Bureau of the Fiscal Service**, which operates the authoritative `fiscaldata.treasury.gov` API. This platform has completely modernized federal accounting data distribution, offering high-throughput, filterable JSON APIs for the national debt, the Daily Treasury Statement (DTS), and the Monthly Treasury Statement (MTS) without requiring API keys. Federal spending at the micro-level—dissected by agency, budgetary program, award, and contract—is managed by the Treasury's **USASpending.gov** API pursuant to the DATA Act. Long-term macroeconomic baselines, 10-year budget outlooks, and debt-ceiling statutory analyses are supplied in tabular and bulk formats by the nonpartisan **Congressional Budget Office (CBO)** and the **Office of Management and Budget (OMB)**. For historical econometric time-series, the Federal Reserve Bank of St. Louis (**FRED**) provides reliable, developer-friendly endpoints.

A foundational technical distinction that every civic app engineer must understand is that **no official tick-by-tick or sub-second national debt stream exists**. The Treasury calculates and publishes total public debt outstanding on a daily business-day cadence. Any application presenting a continuously ticking debt counter must implement an actuarial or linear interpolation client-side and disclose this methodology to the user.

| DATA POINT | DESCRIPTION | PRIMARY SOURCE | SOURCE URL | API AVAILABLE | API TYPE | AUTH REQUIRED | UPDATE FREQUENCY | COST | NOTES |
| :--- | :--- | :--- | :--- | :---: | :--- | :---: | :--- | :--- | :--- |
| Total Public Debt Outstanding | Total debt of the US government, divided into debt held by the public and intragovernmental holdings. | Bureau of the Fiscal Service | https://fiscaldata.treasury.gov/datasets/debt-to-the-penny/ | Yes | REST / JSON | None | Daily (Business Days ~4 PM ET) | Free | Authoritative 'Debt to the Penny' dataset. Historical daily data back to 1993. |
| Daily Treasury Statement (DTS) | Summary of operating cash balance, tax deposits, net withdrawals, and inter-fund transfers. | Bureau of the Fiscal Service | https://fiscaldata.treasury.gov/datasets/daily-treasury-statement/ | Yes | REST / JSON | None | Daily (Business Days ~4 PM ET) | Free | DTS Table 1 provides operating cash balance essential for tracking debt limit headroom. |
| Monthly Treasury Statement (MTS) | Summary of federal receipts, outlays, and monthly budget surplus or deficit. | Bureau of the Fiscal Service | https://fiscaldata.treasury.gov/datasets/monthly-treasury-statement/ | Yes | REST / JSON | None | Monthly (8th business day) | Free | Primary gauge of monthly federal budget deficit/surplus across executive agencies. |
| Federal Spending by Agency & Program | Disaggregated federal outlays by top-tier agency, sub-tier agency, and federal accounts. | USASpending.gov | https://api.usaspending.gov | Yes | REST / JSON | None | Daily / Semi-weekly sync | Free | Supports agency breakdown, object classes, and recipient contract search. |
| Government Shutdown & CR Deadlines | Statutory expiration dates of discretionary appropriations and continuing resolutions (CRs). | Congressional Budget Office (CBO) & Congress.gov | https://www.cbo.gov/topics/budget | Partial | Web / PDF / CBO Baselines | None | Ad-hoc / legislative milestone | Free | Derived from active appropriations bills on Congress.gov and CBO baseline reports. |
| Historical Debt & Deficit Time-Series | Long-term annualized and quarterly federal debt, debt-to-GDP ratio, and surplus/deficit from 1789. | Federal Reserve Bank of St. Louis (FRED) / OMB | https://fred.stlouisfed.org/series/GFDEBTN | Yes | REST / JSON | Free API Key | Quarterly / Annual | Free | FRED series GFDEBTN (quarterly debt) and FYFSD (annual deficit). Highly reliable caching. |
| CBO 10-Year Budget & Economic Outlook | Baseline projections of federal revenues, outlays, deficit, and debt held by the public over 10 years. | Congressional Budget Office | https://www.cbo.gov/data/budget-economic-data | No | CSV / Excel / PDF Bulk | None | Semi-annual (Winter/Spring) | Free | Standard benchmark used by Congress for scoring fiscal legislation. |
| Modeled Sub-Second Debt Tick | Extrapolated real-time per-second national debt accumulation rate for UI display counters. | Client Calculation Engine / US Debt Clock model | https://www.usdebtclock.org | No | Mathematical Formula / Client Ticker | None | Real-Time (60 Hz UI loop) | Free | Mathematical model interpolating between daily DTS updates using annualized deficit velocity. |


#### Datasheets: National Fiscal Data Sources

##### 1. Bureau of the Fiscal Service (Fiscal Data API)
- **Source Name & URL:** US Department of the Treasury — Bureau of the Fiscal Service | [fiscaldata.treasury.gov](https://fiscaldata.treasury.gov)
- **Data Provided:** Debt to the Penny (total public debt, public holdings, intragovernmental), Daily Treasury Statement (cash balances, deposits, withdrawals), Monthly Treasury Statement (receipts, outlays, deficit), Treasury Reporting Rates of Exchange, Historical Debt Outstanding (1790 to present).
- **Access Method:** RESTful HTTP GET API with URL query parameters for filtering, sorting, pagination, and field selection.
- **Authentication:** None required. Completely open public API.
- **Update Frequency:** Daily on business days by 4:00 PM Eastern Time for DTS and Debt to the Penny; monthly for MTS.
- **Rate Limits:** Generous unauthenticated limit (nominally ~1,000 requests per minute per IP; burst friendly).
- **Cost:** Free ($0).
- **Data Format:** JSON (default), CSV, XML.
- **Documentation Quality:** Excellent. Comprehensive interactive endpoint explorer, OpenAPI specification, and detailed field dictionaries.
- **Recommended For:** The primary, authoritative backbone for all national debt and federal cash position features.
- **Example API Endpoints:**
  - *Latest Debt to the Penny:* `https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v2/accounting/od/debt_to_penny?sort=-record_date&page[size]=1`
  - *Daily Treasury Statement Cash Balance (DTS Table 1):* `https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v1/accounting/dts/dts_table_1?sort=-record_date&page[size]=1`
  - *Monthly Deficit (MTS Table 1):* `https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v1/accounting/mts/mts_table_1?sort=-record_date&page[size]=1`
- **Verify-Before-Integration:** None. Highly stable production API operated directly by federal statute.

##### 2. USASpending.gov API
- **Source Name & URL:** USASpending.gov (US Department of the Treasury) | [api.usaspending.gov](https://api.usaspending.gov)
- **Data Provided:** Disaggregated federal spending data: top-tier and sub-tier agency budget authority and outlays, federal budgetary accounts, program activity codes, prime award contracts, grants, loans, and direct payments.
- **Access Method:** RESTful HTTP POST/GET API accepting JSON request bodies for advanced faceted searches.
- **Authentication:** None required. Public API.
- **Update Frequency:** Daily for federal financial transactions; semi-weekly and monthly for agency accounting reconciliations.
- **Rate Limits:** Documented limit of 10 requests per second per IP; bursts handled gracefully.
- **Cost:** Free ($0).
- **Data Format:** JSON.
- **Documentation Quality:** Excellent. Full Swagger/OpenAPI interactive docs at `api.usaspending.gov/docs/`.
- **Recommended For:** 'Where do your tax dollars go?' interactive breakdown screens by agency (DOD, HHS, Education, etc.) and contract/grant recipient lookups.
- **Example API Endpoints:**
  - *Top-tier agency spending overview:* `https://api.usaspending.gov/api/v2/references/toptier_agencies/`
  - *Spending by category (Agency breakdown):* `POST https://api.usaspending.gov/api/v2/search/spending_by_category/` with payload `{"category": "awarding_agency", "filters": {"time_period": [{"start_date": "2025-10-01", "end_date": "2026-09-30"}]}}`
- **Verify-Before-Integration:** None. Robust production infrastructure.

##### 3. Federal Reserve Bank of St. Louis (FRED API)
- **Source Name & URL:** Federal Reserve Bank of St. Louis Economic Data | [fred.stlouisfed.org](https://fred.stlouisfed.org)
- **Data Provided:** Over 800,000 macroeconomic time-series: Federal Debt: Total Public Debt (GFDEBTN), Federal Debt Held by the Public as Percent of GDP (FYGFGDQ188S), Federal Surplus or Deficit (FYFSD), CPI inflation indices, and Treasury yields.
- **Access Method:** RESTful HTTP GET API.
- **Authentication:** Free API key required (instantaneous generation via web sign-up).
- **Update Frequency:** Series-dependent; quarterly for GDP and public debt; monthly for inflation and employment.
- **Rate Limits:** 120 requests per minute.
- **Cost:** Free ($0).
- **Data Format:** JSON, XML.
- **Documentation Quality:** Excellent. Standard in financial and economic software development.
- **Recommended For:** Historical multi-year chart visualizations (e.g. 10-year, 30-year, 50-year charts of federal debt vs. GDP).
- **Example API Endpoints:**
  - *Federal Debt Quarterly Observations:* `https://api.stlouisfed.org/fred/series/observations?series_id=GFDEBTN&api_key={YOUR_API_KEY}&file_type=json`
  - *Annual Federal Deficit/Surplus:* `https://api.stlouisfed.org/fred/series/observations?series_id=FYFSD&api_key={YOUR_API_KEY}&file_type=json`
- **Verify-Before-Integration:** None. Industry standard service.

##### 4. Congressional Budget Office (CBO)
- **Source Name & URL:** Congressional Budget Office | [cbo.gov](https://www.cbo.gov)
- **Data Provided:** 10-Year Budget and Economic Outlook, Federal Debt Projections, Cost Estimates for legislative bills, Monthly Budget Reviews, analysis of statutory debt limit and continuing resolution deadlines.
- **Access Method:** Web download of structured data files (CSV, Excel) and programmatic RSS feeds.
- **Authentication:** None.
- **Update Frequency:** Major baseline reports published 2-3 times per year; bill cost estimates published continuously as bills are marked up.
- **Rate Limits:** Standard web traffic.
- **Cost:** Free ($0).
- **Data Format:** XLSX, CSV, PDF, RSS.
- **Documentation Quality:** Good for economists; sparse programmatic API documentation (files must be consumed as static datasets).
- **Recommended For:** Curated static baselines in the mobile app, providing nonpartisan projections of debt trajectory over the coming decade.
- **Example Data URL:** `https://www.cbo.gov/data/budget-economic-data` (Downloadable Excel tables for 10-Year Budget Projections).
- **Verify-Before-Integration:** Periodic verification of annual baseline publication URLs.

##### 5. Office of Management and Budget (OMB) Historical Tables
- **Source Name & URL:** Executive Office of the President — OMB | [whitehouse.gov/omb/budget/historical-tables/](https://www.whitehouse.gov/omb/budget/historical-tables/)
- **Data Provided:** Comprehensive historical tables dating back to 1789: Table 1.1 (Summary of Receipts, Outlays, and Surpluses or Deficits 1789-2029), Table 7.1 (Federal Debt at the End of Year), Table 8.1 (Outlays by Budget Enforcement Act Category).
- **Access Method:** Bulk file download (XLSX, CSV).
- **Authentication:** None.
- **Update Frequency:** Annually when the President's Budget is submitted to Congress (typically February/March).
- **Rate Limits:** Standard static file serving.
- **Cost:** Free ($0).
- **Data Format:** XLSX, CSV.
- **Documentation Quality:** Good tabular notes; no developer API.
- **Recommended For:** Pre-packaging a compact historical JSON file (1789-present) into the mobile app bundle for instantaneous offline chart rendering.
- **Example Download URL:** `https://www.whitehouse.gov/wp-content/uploads/historical-tables/hist01z1.xlsx`
- **Verify-Before-Integration:** `[Verify-Before-Integration]` Administration website redesigns can shift static file paths.

#### Engineering Deep Dive: The 'To-The-Dollar' Real-Time Debt Counter

##### Feasibility & Reality Check (RQ-01, RQ-01.1)
Many popular web applications and physical exhibits display a rapidly incrementing digital counter showing the US National Debt ticking up by tens of thousands of dollars each second. **There is no government API that streams this data in real time.** The Department of the Treasury settles government accounts at the close of each business day and publishes the Debt to the Penny figure between 3:30 PM and 4:00 PM Eastern Time on the following business day.

##### Recommended Mathematical Modeling Architecture
To deliver a high-engagement, responsive live debt counter in a mobile app, engineers should use a **hybrid baseline-and-interpolation model**:

1. **Daily Anchor Baseline:** On app launch and via background refresh (once per day), fetch the latest official record from `fiscaldata.treasury.gov/services/api/fiscal_service/v2/accounting/od/debt_to_penny?sort=-record_date&page[size]=2`.

2. **Velocity Calculation:** Extract the two most recent records (`D_0` at timestamp `T_0`, and `D_1` at timestamp `T_1`). Compute the daily net growth rate: `Delta_D = D_0 - D_1`, and the elapsed seconds `Delta_T = T_0 - T_1`. The base velocity is `V_sec = Delta_D / Delta_T`. To avoid single-day volatility (e.g. large quarterly tax payment days), average the daily change over the trailing 30 published business days.

3. **Client-Side Animation Loop:** In React Native / Flutter, initialize the counter with `D_current = D_0 + (T_now - T_0) * V_sec`. Run an animation timer (e.g. 60 FPS using `requestAnimationFrame` or `flutter_ticker`) updating the displayed value: `D_display(t) = D_current + (t - t_init) * V_sec`.

4. **Mandatory Consumer Disclosure Badge:** To maintain journalistic integrity and prevent misleading users, display an inline info tooltip/badge:

   > *'Display reflects an algorithmic real-time interpolation (+~$58,400/sec) based on the latest official US Treasury Debt to the Penny release ($XX.XX Trillion as of [Date]).'*

#### Government Shutdown Risk & Budget Status Architecture (RQ-02)
Government shutdowns occur when statutory discretionary appropriations expire without the enactment of new regular appropriations bills or a Continuing Resolution (CR). Because there is no single automated 'shutdown threat indicator' API, a civic app should synthesize three programmatic data streams:

1. **DTS Operating Cash Balance:** Query `fiscaldata.treasury.gov` DTS Table 1 daily. When the federal debt ceiling is reached and the Treasury invokes 'extraordinary measures,' the closing cash balance of the Treasury General Account (TGA) indicates the runway before potential technical default.

2. **Appropriations Bill Tracking on Congress.gov API:** Query `/v3/bill/119` filtering for appropriations measures (`billType=hr` or `billType=s` with policy area 'Economics and Public Finance'). Inspect bill actions for enactment of continuing resolutions and track expiration dates in legislative titles (e.g., 'Continuing Appropriations and Extensions Act, 2026').

3. **CBO Scorekeeping Bulletins:** Parse CBO's monthly budget reviews for discretionary spending caps compliance.
