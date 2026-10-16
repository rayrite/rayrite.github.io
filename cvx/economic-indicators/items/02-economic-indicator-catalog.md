# 02. Authoritative U.S. Economic Indicator Source Catalog

**Verified as of:** 2026-10-15  
**Document Purpose:** This catalog serves as the definitive empirical directory for retrieving every category of scheduled economic indicator reported on U.S. political and news broadcasts. Each indicator is documented using the canonical 15-field record schema (Section 8.4), establishing its exact program identity, verified access models across web, API, and bulk channels, release conventions, revision policies, and methodological caveats.

---

## Table of Contents
1. [Domain 1: Labor Market and Employment Indicators](#domain-1-labor-market-and-employment-indicators)
2. [Domain 2: Prices, Inflation, and Purchasing Power](#domain-2-prices-inflation-and-purchasing-power)
3. [Domain 3: Interest Rates, Yields, and Monetary Policy](#domain-3-interest-rates-yields-and-monetary-policy)
4. [Domain 4: Macroeconomic Aggregates, Trade, and Federal Fiscal Operations](#domain-4-macroeconomic-aggregates-trade-and-federal-fiscal-operations)
5. [Domain 5: Consumer Confidence, Business Sentiment, and Economic Expectations](#domain-5-consumer-confidence-business-sentiment-and-economic-expectations)
6. [Domain 6: Energy, Fuels, and Transportation Commodities](#domain-6-energy-fuels-and-transportation-commodities)
7. [Domain 7: Equity Market Closes, Volatility, and Market Breadth](#domain-7-equity-market-closes-volatility-and-market-breadth)

---

## Domain 1: Labor Market and Employment Indicators

The monthly Employment Situation release (colloquially the "Jobs Report") and high-frequency weekly jobless claims represent the most volatile political lightning rods in domestic economic coverage. The Bureau of Labor Statistics (BLS) compiles the jobs report from two separate, independent surveys: the Establishment Survey (Current Employment Statistics) and the Household Survey (Current Population Survey).

### 1.1 Nonfarm Payrolls (Establishment Survey)

| Field | Content |
|---|---|
| Indicator (media name) | Total Nonfarm Payrolls ("Jobs Added / Created", "Monthly Payroll Number") |
| Official name / program | Current Employment Statistics (CES) - National Nonfarm Employment |
| Publisher | U.S. Bureau of Labor Statistics (BLS) (Federal Statistical Agency) |
| Series or report identity | Series ID: `CES0000000001` (Seasonally Adjusted); News Release: *The Employment Situation* |
| Definition (one line) | Monthly estimate of total paid civilian payroll jobs (excluding farm, private household, and unpaid family workers) across nonfarm business establishments. |
| Primary URL(s) | Landing: https://www.bls.gov/ces/ ; News Release: https://www.bls.gov/news.release/empsit.htm ; Data Query: https://data.bls.gov/cgi-bin/srgate ; API Docs: https://www.bls.gov/developers/ |
| Cadence | Monthly; released on the first Friday of each month at 8:30 AM Eastern Time (reference period: pay period including the 12th of the month). |
| Web access model | **FREE** (Open public access, no registration, no paywall, no authentication required). |
| API access model | **FREE-KEY** (BLS API v2 requires free registration key; 500 queries/day, 50 series/query; v1 is unauthenticated but capped at 25 queries/day). |
| Bulk/history | Full historical time series available back to 1939 in flat text/CSV files at https://download.bls.gov/pub/time.series/ce/ |
| Revision policy | Subject to two monthly revisions following initial release (e.g., January initial revised in February and March); annual benchmark revision published each February benchmarking to state unemployment insurance tax records (QCEW). |
| Caveats | Establishment survey counts *jobs*, not employed persons. A worker holding two jobs is counted twice. Does not capture agricultural workers, independent contractors (1099), or unincorporated self-employed individuals. |
| Layer | Primary (Terminal Federal Authority) |
| Alternate free paths | FRED (St. Louis Fed): Series `PAYEMS`; Department of Labor Newsroom; Census Bureau Economic Indicators. |
| Verified | 2026-10-15 via live HTTP query to bls.gov news release and API documentation. |

### 1.2 Unemployment Rate (Headline U-3 and Broad U-6)

| Field | Content |
|---|---|
| Indicator (media name) | The Unemployment Rate (Headline U-3) and Alternative Underemployment (U-6) |
| Official name / program | Current Population Survey (CPS) - Household Data |
| Publisher | U.S. Bureau of Labor Statistics (BLS) / U.S. Census Bureau (Federal Government) |
| Series or report identity | U-3 Series ID: `LNS14000000`; U-6 Series ID: `LNS13327709`; CPS Table A-15 |
| Definition (one line) | Percentage of the civilian noninstitutional labor force who do not have a job, have actively looked for work in the prior 4 weeks, and are currently available for work. |
| Primary URL(s) | Landing: https://www.bls.gov/cps/ ; Table A-15: https://www.bls.gov/news.release/empsit.t15.htm ; Series Viewer: https://data.bls.gov/timeseries/LNS14000000 |
| Cadence | Monthly; released on the first Friday of each month at 8:30 AM Eastern Time. |
| Web access model | **FREE** (Universal public access, no barrier). |
| API access model | **FREE-KEY** (BLS API v2 via `https://api.bls.gov/publicAPI/v2/timeseries/data/` with JSON response payload). |
| Bulk/history | Complete historical CPS microdata and aggregate time series available since 1948 via https://download.bls.gov/pub/time.series/ln/ |
| Revision policy | Seasonally adjusted data subject to annual revision at the beginning of each calendar year covering the preceding five years. Not revised on a monthly basis like CES. |
| Caveats | To be counted as unemployed in U-3, an individual *must* have actively searched for work in the past 4 weeks; individuals who stopped looking drop out of the labor force entirely and lower the headline unemployment rate. U-6 includes discouraged workers and involuntary part-time workers. |
| Layer | Primary (Terminal Federal Authority) |
| Alternate free paths | FRED: Series `UNRATE` (U-3) and `U6RATE` (U-6); National Economic Accounts. |
| Verified | 2026-10-15 via live BLS database verification. |

### 1.3 Labor Force Participation Rate

| Field | Content |
|---|---|
| Indicator (media name) | Labor Force Participation Rate ("Workforce Participation") |
| Official name / program | Current Population Survey (CPS) - Civilian Labor Force Participation Rate |
| Publisher | U.S. Bureau of Labor Statistics (BLS) (Federal Statistical Agency) |
| Series or report identity | Series ID: `LNS11300000` (Seasonally Adjusted); CPS Table A-1 |
| Definition (one line) | The proportion of the civilian noninstitutional population aged 16 and older that is either employed or actively seeking employment. |
| Primary URL(s) | Landing: https://www.bls.gov/cps/ ; Direct Series: https://data.bls.gov/timeseries/LNS11300000 |
| Cadence | Monthly; first Friday at 8:30 AM Eastern Time. |
| Web access model | **FREE** (Universal public access). |
| API access model | **FREE-KEY** (BLS API v2). |
| Bulk/history | Continuous monthly series available from 1948 to present via BLS public flat files. |
| Revision policy | Revised annually in January for seasonal adjustment factors over prior 5 years. |
| Caveats | Highly sensitive to demographic shifts, specifically baby-boomer retirements. Broadcasts often analyze the Prime-Age Participation Rate (Ages 25-54, Series `LNS11300060`) to strip out retirement distortions. |
| Layer | Primary (Terminal Federal Authority) |
| Alternate free paths | FRED: Series `CIVPART` (Total) and `LNS11300060` (Prime-Age). |
| Verified | 2026-10-15 via BLS series query. |

### 1.4 Average Hourly Earnings (Wage Growth)

| Field | Content |
|---|---|
| Indicator (media name) | Wage Growth ("Average Hourly Earnings", "Paycheck Gains") |
| Official name / program | Current Employment Statistics (CES) - Average Hourly Earnings of All Employees, Total Private |
| Publisher | U.S. Bureau of Labor Statistics (BLS) (Federal Statistical Agency) |
| Series or report identity | Series ID: `CES0500000003` (Seasonally Adjusted Dollars); Table B-3 |
| Definition (one line) | Average gross hourly earnings before payroll deductions for all nonfarm private-sector employees. |
| Primary URL(s) | Landing: https://www.bls.gov/ces/ ; Table B-3: https://www.bls.gov/news.release/empsit.t19.htm |
| Cadence | Monthly; first Friday at 8:30 AM Eastern Time. |
| Web access model | **FREE** (Universal public access). |
| API access model | **FREE-KEY** (BLS API v2). |
| Bulk/history | Available from March 2006 for all employees; production worker series (`CES0500000008`) available back to 1964. |
| Revision policy | Subject to two monthly revisions alongside payroll employment revisions. |
| Caveats | Average hourly earnings represent nominal wages, not real inflation-adjusted wages. Composition effects can distort the number: if low-wage service workers are laid off in mass, average hourly earnings artificially spike. |
| Layer | Primary (Terminal Federal Authority) |
| Alternate free paths | FRED: Series `CES0500000003`; Atlanta Fed Wage Growth Tracker (`FRBATLWGT`). |
| Verified | 2026-10-15 via BLS tables. |

### 1.5 Weekly Unemployment Insurance Claims

| Field | Content |
|---|---|
| Indicator (media name) | Weekly Jobless Claims ("Initial Claims", "Continuing Claims") |
| Official name / program | Unemployment Insurance Weekly Claims Report (Form ETA 539) |
| Publisher | U.S. Department of Labor, Employment and Training Administration (ETA) |
| Series or report identity | ETA Weekly News Release; Initial Claims (SA), Continuing Claims (Insured Unemployment) |
| Definition (one line) | Weekly count of initial applications filed by individuals seeking state unemployment benefits, and total count of individuals continuing to receive regular benefits. |
| Primary URL(s) | Landing: https://www.dol.gov/ui/data.pdf ; Program Home: https://oui.doleta.gov/unemploy/claims.asp |
| Cadence | Weekly; every Thursday at 8:30 AM Eastern Time (covers week ending prior Saturday). |
| Web access model | **FREE** (Open web download, direct PDF and HTML release). |
| API access model | **FREE-KEY** (Available via FRED API; ETA publishes direct tabular web files and RSS feeds). |
| Bulk/history | Historical state and national weekly data available back to 1967 at https://oui.doleta.gov/unemploy/claims_arch.asp |
| Revision policy | Initial claims for prior week revised concurrently with the release of the current week's numbers; seasonal adjustments revised annually in spring. |
| Caveats | Initial claims measure layoffs and job separations, not total unemployed. Fraud spikes in state unemployment programs (e.g., identity theft rings) have periodically distorted specific state figures. Media relies heavily on the 4-week moving average to smooth holiday volatility. |
| Layer | Primary (Terminal Federal Authority) |
| Alternate free paths | FRED: Series `ICSA` (Initial Claims Seasonally Adjusted) and `CCSA` (Continued Claims). |
| Verified | 2026-10-15 via Department of Labor ETA publication portal. |

### 1.6 Job Openings and Labor Turnover Survey (JOLTS)

| Field | Content |
|---|---|
| Indicator (media name) | JOLTS Report ("Job Openings", "The Quits Rate") |
| Official name / program | Job Openings and Labor Turnover Survey (JOLTS) |
| Publisher | U.S. Bureau of Labor Statistics (BLS) (Federal Statistical Agency) |
| Series or report identity | Job Openings Series: `JTS000000000000000JOL`; Quits Series: `JTS000000000000000QUR` |
| Definition (one line) | Monthly measures of job vacancies, total hires, and voluntary separations (quits) across U.S. business establishments. |
| Primary URL(s) | Landing: https://www.bls.gov/jlt/ ; News Release: https://www.bls.gov/news.release/jolts.htm ; Database: https://data.bls.gov/timeseries/JTS000000000000000JOL |
| Cadence | Monthly; released during the first or second week of the month at 10:00 AM Eastern Time (operates on a one-month lag relative to the Employment Situation). |
| Web access model | **FREE** (Universal public access). |
| API access model | **FREE-KEY** (BLS API v2). |
| Bulk/history | Historical series available from December 2000 to present via BLS flat files (`pub/time.series/jt/`). |
| Revision policy | Monthly figures revised with the following month's release; annual benchmark revisions in spring. |
| Caveats | Operates on a one-month reporting lag. The "Quits Rate" is monitored as the premier measure of worker confidence (willingness to leave a job for higher pay). The ratio of job openings per unemployed worker is a core Fed benchmark. |
| Layer | Primary (Terminal Federal Authority) |
| Alternate free paths | FRED: Series `JTSJOL` (Total Job Openings) and `JTSQUR` (Quits Rate). |
| Verified | 2026-10-15 via BLS JOLTS portal. |

### 1.7 Private Payroll Alternates and Layoff Trackers

| Field | Content |
|---|---|
| Indicator (media name) | ADP Private Payrolls ("ADP Jobs Report") / Challenger Job Cuts |
| Official name / program | ADP National Employment Report (ADP / Stanford) / Challenger Monthly Layoff Report |
| Publisher | ADP Research Institute / Stanford Digital Economy Lab; Challenger, Gray & Christmas |
| Series or report identity | ADP National Employment Report (Monthly); Challenger Job-Cut Announcement Survey |
| Definition (one line) | Independent high-frequency private-sector payroll estimates derived from corporate payroll processing (ADP) and corporate layoff tracking compiled from public notices (Challenger). |
| Primary URL(s) | ADP: https://adpemploymentreport.com/ ; Challenger: https://www.challengergray.com/press/ |
| Cadence | ADP: Monthly on the Wednesday preceding the first Friday BLS report at 8:15 AM ET. Challenger: Monthly on the first Thursday at 7:30 AM ET. |
| Web access model | **FREE** (Headline report summaries and press releases are freely accessible). |
| API access model | ADP: **FREE** (Direct web download, FRED integration); Challenger: **PAID-SUB** (Underlying industry historical database requires commercial inquiry). |
| Bulk/history | ADP historical series downloadable in CSV/Excel on its website; FRED mirrors ADP series `ADPMNUSNERSA`. |
| Revision policy | ADP recalibrated methodology in 2022 alongside Stanford; revisions published monthly. |
| Caveats | ADP measures only private-sector payrolls (excludes all federal, state, and local government jobs). While media treats ADP as an early preview of the BLS jobs report, month-to-month correlation can diverge significantly. |
| Layer | Commercial / Private Trackers (Secondary Layer) |
| Alternate free paths | FRED: Series `ADPMNUSNERSA`. |
| Verified | 2026-10-15 via ADP and Challenger official web portals. |

---

## Domain 2: Prices, Inflation, and Purchasing Power

Inflation indicators determine monetary policy expectations and dominate kitchen-table economic polling. Media coverage frequently alternates between the Consumer Price Index (CPI) and Personal Consumption Expenditures (PCE).

### 2.1 Consumer Price Index (CPI-U and Core CPI)

| Field | Content |
|---|---|
| Indicator (media name) | The Inflation Rate ("CPI", "Headline Inflation", "Core CPI") |
| Official name / program | Consumer Price Index for All Urban Consumers (CPI-U) |
| Publisher | U.S. Bureau of Labor Statistics (BLS) (Federal Statistical Agency) |
| Series or report identity | Headline CPI: `CUSR0000SA0`; Core CPI (Less Food and Energy): `CUSR0000SA0L1E` |
| Definition (one line) | A measure of the average change over time in the prices paid by urban consumers for a market basket of consumer goods and services. |
| Primary URL(s) | Landing: https://www.bls.gov/cpi/ ; News Release: https://www.bls.gov/news.release/cpi.htm ; Database: https://data.bls.gov/timeseries/CUSR0000SA0 |
| Cadence | Monthly; released around the 10th to 14th of each month at 8:30 AM Eastern Time. |
| Web access model | **FREE** (Universal public access, no registration). |
| API access model | **FREE-KEY** (BLS API v2). |
| Bulk/history | Complete historical data from 1913 to present accessible via BLS text archives (`pub/time.series/cu/`). |
| Revision policy | Unadjusted CPI figures are never revised once published. Seasonally adjusted figures are subject to revision for the prior five years each February. |
| Caveats | CPI uses a modified Laspeyres formula with fixed expenditure weights updated annually from Consumer Expenditure Survey data. Shelter represents over 35% of headline CPI (over 40% of Core CPI), measured largely via Owners' Equivalent Rent (OER), which lags real-time spot rental market conditions by 6 to 12 months. |
| Layer | Primary (Terminal Federal Authority) |
| Alternate free paths | FRED: Series `CPIAUCSL` (Headline SA) and `CPILFESL` (Core SA). |
| Verified | 2026-10-15 via BLS CPI program portal. |

### 2.2 Producer Price Index (PPI - Wholesale Inflation)

| Field | Content |
|---|---|
| Indicator (media name) | Wholesale Inflation ("Producer Price Index", "PPI") |
| Official name / program | Producer Price Indexes (PPI) - Final Demand |
| Publisher | U.S. Bureau of Labor Statistics (BLS) (Federal Statistical Agency) |
| Series or report identity | Final Demand Headline: `WPSFD4`; Final Demand Less Foods and Energy: `WPSFD49104` |
| Definition (one line) | Measures the average change over time in the selling prices received by domestic producers for their output across goods, services, and construction. |
| Primary URL(s) | Landing: https://www.bls.gov/ppi/ ; News Release: https://www.bls.gov/news.release/ppi.htm |
| Cadence | Monthly; typically published on the day following the monthly CPI release at 8:30 AM Eastern Time. |
| Web access model | **FREE** (Universal public access). |
| API access model | **FREE-KEY** (BLS API v2). |
| Bulk/history | Complete historical series back to 1947 in public flat files (`pub/time.series/wp/`). |
| Revision policy | Subject to one revision four months after initial publication to incorporate late survey responses; seasonal adjustments revised annually. |
| Caveats | PPI measures prices received by producers at the factory gate or wholesale counter, excluding retail sales taxes and markups. It serves as an early pipeline indicator for future consumer price inflation. |
| Layer | Primary (Terminal Federal Authority) |
| Alternate free paths | FRED: Series `PPIFID` (Final Demand) and `PPIFES` (Core Final Demand). |
| Verified | 2026-10-15 via BLS PPI program pages. |

### 2.3 Personal Consumption Expenditures Price Index (PCE and Core PCE)

| Field | Content |
|---|---|
| Indicator (media name) | The Fed's Preferred Inflation Gauge ("PCE Inflation", "Core PCE") |
| Official name / program | Personal Consumption Expenditures (PCE) Price Index (NIPA Table 2.8.4) |
| Publisher | Bureau of Economic Analysis (BEA), U.S. Department of Commerce |
| Series or report identity | PCE Price Index (Table 2.8.4, Line 1); Core PCE Index (Table 2.8.4, Line 6) |
| Definition (one line) | Measures price changes in goods and services purchased by, or on behalf of, U.S. households, serving as the official operational target metric for the Federal Reserve. |
| Primary URL(s) | Landing: https://www.bea.gov/data/personal-consumption-expenditures-price-index ; Release: https://www.bea.gov/news/current-releases ; API Docs: https://apps.bea.gov/api/signup/ |
| Cadence | Monthly; published at the end of the month (approximately 25th-30th) at 8:30 AM Eastern Time as part of the *Personal Income and Outlays* release. |
| Web access model | **FREE** (Universal public access, open data tables, interactive data tool). |
| API access model | **FREE-KEY** (BEA API requires 36-character UserID; 100 req/min, 100 MB/min). |
| Bulk/history | Complete National Income and Product Accounts (NIPA) bulk tables downloadable in ZIP/CSV formats back to 1959. |
| Revision policy | Monthly data revised with subsequent monthly releases and during annual comprehensive NIPA updates each September. |
| Caveats | PCE differs from CPI in weighting and scope: PCE uses a Fisher-ideal chain-weighted formula allowing for consumer substitution between goods. It covers expenses paid on behalf of consumers (e.g., Medicare, Medicaid, employer-provided healthcare). Shelter carries only ~15% weight in PCE compared to >35% in CPI. |
| Layer | Primary (Terminal Federal Authority) |
| Alternate free paths | FRED: Series `PCEPI` (Headline) and `PCEPILFE` (Core PCE). |
| Verified | 2026-10-15 via BEA data portal. |

### 2.4 Employment Cost Index (ECI)

| Field | Content |
|---|---|
| Indicator (media name) | Employment Cost Index ("Wage-Price Spiral Indicator", "ECI") |
| Official name / program | Employment Cost Index (ECI) - Compensation, Total Civilian |
| Publisher | U.S. Bureau of Labor Statistics (BLS) (Federal Statistical Agency) |
| Series or report identity | Total Compensation Civilian: `CIU1010000000000A`; Wages and Salaries: `CIU1020000000000A` |
| Definition (one line) | Quarterly measure of the change in the total cost of labor, encompassing wages, salaries, and employer-paid employee benefits. |
| Primary URL(s) | Landing: https://www.bls.gov/ect/ ; News Release: https://www.bls.gov/news.release/eci.htm |
| Cadence | Quarterly; released on the final business day of January, April, July, and October at 8:30 AM ET. |
| Web access model | **FREE** (Universal public access). |
| API access model | **FREE-KEY** (BLS API v2). |
| Bulk/history | Historical quarterly series available back to 1975 via BLS flat files (`pub/time.series/ci/`). |
| Revision policy | Data not subject to routine revisions; seasonal adjustments revised annually. |
| Caveats | Unlike Average Hourly Earnings, the ECI holds employment composition fixed across occupations and industries, eliminating distortions caused by shifts in workforce mix. Considered by economists to be the cleanest measure of pure labor cost pressure. |
| Layer | Primary (Terminal Federal Authority) |
| Alternate free paths | FRED: Series `ECIALLCIV` (Total Compensation Civilian). |
| Verified | 2026-10-15 via BLS ECI portal. |

---

## Domain 3: Interest Rates, Yields, and Monetary Policy

This domain encompasses the Federal Reserve's policy target decisions, benchmark government debt yield curves, consumer borrowing rates, and mortgage costs.

### 3.1 Federal Funds Target Range and Policy Statements

| Field | Content |
|---|---|
| Indicator (media name) | The Fed Rate ("Federal Funds Rate", "FOMC Decision", "Interest Rate Decision") |
| Official name / program | Federal Open Market Committee (FOMC) Policy Target Range |
| Publisher | Federal Open Market Committee (FOMC) / Federal Reserve Board of Governors |
| Series or report identity | FOMC Statement and Implementation Note; Target Range Upper (`DFEDTARU`) and Lower (`DFEDTARL`) |
| Definition (one line) | The target interest rate band set by the Federal Reserve at which commercial banks borrow and lend their excess reserve balances to each other overnight. |
| Primary URL(s) | Policy Portal: https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm ; Implementation Note: https://www.federalreserve.gov/monetarypolicy/policy-implementation-rates.htm |
| Cadence | 8 scheduled two-day meetings per calendar year; decisions released on Wednesday at 2:00 PM Eastern Time, followed by the Fed Chair press conference at 2:30 PM ET. |
| Web access model | **FREE** (Universal public access, open HTML statements, PDFs, video webcasts). |
| API access model | **FREE** (Target range published via FRED API; Board website provides open RSS feeds). |
| Bulk/history | Complete historical transcripts, minutes, statements, and target rate histories back to 1913 hosted on federalreserve.gov. |
| Revision policy | Policy decisions are immediate operational directives; not subject to retrospective revision. |
| Caveats | The Fed sets a 25-basis-point target range (e.g., 5.25% - 5.50%), not a single fixed number. The actual transaction rate is the Effective Federal Funds Rate (EFFR), calculated daily by the New York Fed. |
| Layer | Primary (Terminal Federal Authority) |
| Alternate free paths | Federal Reserve Bank of New York; FRED: Series `FEDFUNDS`, `DFEDTARU`, `DFEDTARL`. |
| Verified | 2026-10-15 via Federal Reserve Board monetary policy calendar. |

### 3.2 U.S. Treasury Yield Curve (10-Year, 2-Year, and Curve Inversion)

| Field | Content |
|---|---|
| Indicator (media name) | Treasury Yields ("10-Year Bond Rate", "2-Year Note", "The Yield Curve Inversion") |
| Official name / program | Daily Treasury Par Yield Curve Rates |
| Publisher | U.S. Department of the Treasury, Office of Debt Management |
| Series or report identity | Constant Maturity Treasury (CMT) Rates (1M, 2M, 3M, 4M, 6M, 1Y, 2Y, 3Y, 5Y, 7Y, 10Y, 20Y, 30Y) |
| Definition (one line) | Daily market yields calculated from closing bid prices of on-the-run U.S. Treasury securities across 13 fixed maturity checkpoints. |
| Primary URL(s) | Daily Rates: https://home.treasury.gov/resource-center/data-chart-center/interest-rates/TextView?type=daily_treasury_yield_curve ; Fiscal Data API: https://fiscaldata.treasury.gov/ |
| Cadence | Daily; published at the end of each business day between 4:30 PM and 5:00 PM Eastern Time. |
| Web access model | **FREE** (Universal public access, direct interactive tables, CSV and XML export). |
| API access model | **FREE** (Fiscal Data Treasury API at `https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v2/accounting/od/avg_interest_rates` requires no key; FRED API mirrored). |
| Bulk/history | Complete daily yield curve history available from 1990 to present on Treasury.gov. |
| Revision policy | Yield curve closing yields are fixed at market close; not revised retrospectively. |
| Caveats | Broadcasts track the 10-Year Treasury yield as the primary benchmark for consumer loans and 30-year mortgages. The spread between the 10-Year and 2-Year yield (`T10Y2Y` on FRED) is tracked for "inversion" (when 2Y exceeds 10Y), historically signaling an impending recession within 12-24 months. |
| Layer | Primary (Terminal Federal Authority) |
| Alternate free paths | FRED: Series `DGS10`, `DGS2`, `T10Y2Y`; Wall Street Journal Market Data Center. |
| Verified | 2026-10-15 via U.S. Department of the Treasury Interest Rates portal. |

### 3.3 Freddie Mac Primary Mortgage Market Survey (PMMS)

| Field | Content |
|---|---|
| Indicator (media name) | Mortgage Rates ("30-Year Fixed Mortgage Rate", "Freddie Mac Survey") |
| Official name / program | Primary Mortgage Market Survey (PMMS) |
| Publisher | Freddie Mac (Federal Home Loan Mortgage Corporation) (GSE / Enterprise) |
| Series or report identity | PMMS 30-Year Fixed Rate (`MORTGAGE30US`); PMMS 15-Year Fixed Rate (`MORTGAGE15US`) |
| Definition (one line) | Weekly average contract interest rate offered by residential mortgage lenders on conventional conforming mortgages with an 80% loan-to-value ratio. |
| Primary URL(s) | Landing: https://www.freddiemac.com/pmms ; Direct Historical Excel: https://www.freddiemac.com/pmms/docs/Historical_PMMS_Data.xlsx |
| Cadence | Weekly; published every Thursday at 10:00 AM Eastern Time. |
| Web access model | **FREE** (Universal public access, direct web page, downloadable Excel archive). |
| API access model | **FREE-KEY** (Available via FRED API; Freddie Mac does not offer a public REST endpoint but provides direct historical Excel/CSV file downloads). |
| Bulk/history | Full continuous weekly time series available from April 1971 to present in a single official spreadsheet (`Historical_PMMS_Data.xlsx`). |
| Revision policy | Weekly survey figures represent a fixed snapshot and are not revised retrospectively. |
| Caveats | PMMS reflects closed applications submitted into Freddie Mac's Loan Product Advisor underwriting system over the prior Monday-Wednesday window. It is a lagging indicator relative to real-time capital market moves. It applies strictly to conventional conforming loans, excluding FHA, VA, and jumbo mortgages. |
| Layer | Primary (Enterprise / Official Housing Benchmark) |
| Alternate free paths | FRED: Series `MORTGAGE30US`; Mortgage News Daily (daily real-time index); Bankrate. |
| Verified | 2026-10-15 via Freddie Mac PMMS portal. |

---

## Domain 4: Macroeconomic Aggregates, Trade, and Federal Fiscal Operations

This domain encompasses comprehensive output measures, consumer spending, manufacturing orders, trade balances, and the national debt.

### 4.1 Gross Domestic Product (GDP) and the Three-Release Revision Ladder

| Field | Content |
|---|---|
| Indicator (media name) | Gross Domestic Product ("GDP", "Economic Growth Rate") |
| Official name / program | National Income and Product Accounts (NIPA) - Gross Domestic Product |
| Publisher | Bureau of Economic Analysis (BEA), U.S. Department of Commerce |
| Series or report identity | NIPA Table 1.1.1 (Percent Change in Real GDP); Table 1.1.5 (Gross Domestic Product in Current Dollars) |
| Definition (one line) | The monetary value of all finished goods and services produced within the United States during a quarterly period, expressed as an annualized percent change. |
| Primary URL(s) | Landing: https://www.bea.gov/data/gdp/gross-domestic-product ; News Release: https://www.bea.gov/news/current-releases ; API: https://apps.bea.gov/api/ |
| Cadence | Quarterly; each quarter is evaluated through three successive monthly releases at 8:30 AM ET: Advance Estimate (Month 1), Second Estimate (Month 2), and Third Estimate (Month 3). |
| Web access model | **FREE** (Universal public access, open data tables, interactive charting). |
| API access model | **FREE-KEY** (BEA API UserID; 100 req/min). |
| Bulk/history | Complete historical quarterly GDP estimates back to 1947 downloadable via BEA NIPA tables and flat files. |
| Revision policy | Follows the mandatory three-release ladder per quarter; comprehensive benchmark revisions conducted every five years (annual updates each September). |
| Caveats | Shows cite the "annualized quarter-over-quarter growth rate," which projects what the annual growth would be if that quarterly pace continued for a full year. This is not the year-over-year comparison commonly cited in European media. |
| Layer | Primary (Terminal Federal Authority) |
| Alternate free paths | FRED: Series `GDPC1` (Real GDP Billions) and `A191RL1Q225SBEA` (Annualized % Change). |
| Verified | 2026-10-15 via BEA GDP program page. |

#### The GDP Release and Revision Ladder

| Release Stage | Release Timing | Source Data Input Completeness | Media Framing |
|---|---|---|---|
| **Advance Estimate** | ~30 days after quarter close (Late Jan, Apr, Jul, Oct) | Incomplete; relies heavily on statistical imputations and estimates for source data not yet available (e.g., inventories, foreign trade). | "First look at GDP"; triggers immediate political reaction and cable market spikes. |
| **Second Estimate** | ~60 days after quarter close (Late Feb, May, Aug, Nov) | Incorporates revised source data and actual trade and inventory reports for the third month of the quarter. | "Second reading"; media highlights revisions upward or downward from Advance. |
| **Third Estimate** | ~90 days after quarter close (Late Mar, Jun, Sep, Dec) | Most complete quarterly snapshot; incorporates final corporate profits and revised state/local fiscal data. | "Final GDP"; viewed as historical reference before attention shifts to next quarter. |

### 4.2 Retail Sales (Advance Monthly Sales for Retail Trade)

| Field | Content |
|---|---|
| Indicator (media name) | Retail Sales ("Consumer Spending Numbers", "Retail Sales Report") |
| Official name / program | Advance Monthly Sales for Retail and Food Services (MARTS) |
| Publisher | U.S. Census Bureau, U.S. Department of Commerce |
| Series or report identity | MARTS Monthly Release; Total Retail and Food Services (`RSAFS`) |
| Definition (one line) | Monthly estimate of total dollar sales made by retail and food service stores across the United States. |
| Primary URL(s) | Landing: https://www.census.gov/retail/marts.html ; Report: https://www.census.gov/retail/marts/www/marts_current.pdf ; API: https://api.census.gov/data.html |
| Cadence | Monthly; released around the 14th to 16th of each month at 8:30 AM Eastern Time. |
| Web access model | **FREE** (Universal public access, open PDF and Excel tables). |
| API access model | **FREE-KEY** (Census Bureau API requires free key; 500 req/day without key, unlimited with key). |
| Bulk/history | Time series data back to 1992 downloadable in Excel format at https://www.census.gov/retail/index.html#marts |
| Revision policy | Prior month's data revised concurrently with the current month's advance estimate; annual benchmark revisions in spring. |
| Caveats | Retail sales figures are nominal dollar amounts and are *not* adjusted for inflation. If retail sales rise 0.5% in a month where inflation rose 0.6%, real retail sales actually contracted. Also excludes direct household services (rent, utilities, travel). |
| Layer | Primary (Terminal Federal Authority) |
| Alternate free paths | FRED: Series `RSAFS` (Total Retail and Food Services SA). |
| Verified | 2026-10-15 via U.S. Census Bureau MARTS portal. |

### 4.3 U.S. International Trade Balance (The Trade Deficit)

| Field | Content |
|---|---|
| Indicator (media name) | The Trade Deficit ("U.S. Trade Balance", "Import/Export Gap") |
| Official name / program | U.S. International Trade in Goods and Services (FT-900) |
| Publisher | U.S. Census Bureau and Bureau of Economic Analysis (Joint Release) |
| Series or report identity | Joint News Release: FT-900; Balance of Payments (BOP) Basis Total Deficit |
| Definition (one line) | The net difference between the total value of goods and services exported by the United States and the total value imported. |
| Primary URL(s) | Landing: https://www.census.gov/foreign-trade/Press-Releases/current_press_release/ ; BEA Joint Portal: https://www.bea.gov/data/intl-trade-investment/international-trade-goods-and-services |
| Cadence | Monthly; released during the first week of the month (approximately 35 days after the reference month) at 8:30 AM Eastern Time. |
| Web access model | **FREE** (Universal public access, open PDF, HTML, and Excel files). |
| API access model | **FREE-KEY** (Census Bureau and BEA APIs). |
| Bulk/history | Detailed historical country-by-country and commodity-by-commodity trade data back to 1960. |
| Revision policy | Data for the prior month revised with the current release; annual revisions published each June. |
| Caveats | Media debates often conflate the *Goods Trade Deficit* (which is large) with the *Goods and Services Balance* (the U.S. runs a massive surplus in services like software, finance, and entertainment, which mitigates the total deficit). |
| Layer | Primary (Terminal Federal Authority) |
| Alternate free paths | FRED: Series `BOPGSTB` (Trade Balance: Goods and Services, Balance of Payments Basis). |
| Verified | 2026-10-15 via Census Foreign Trade FT-900 release. |

### 4.4 The National Debt and Daily Treasury Statement

| Field | Content |
|---|---|
| Indicator (media name) | The National Debt ("Debt to the Penny", "National Debt Clock", "U.S. Debt Ceiling") |
| Official name / program | Debt to the Penny / Daily Treasury Statement (DTS) |
| Publisher | Bureau of the Fiscal Service, U.S. Department of the Treasury |
| Series or report identity | Dataset: `debt_to_penny`; Daily Treasury Statement Table III-A |
| Definition (one line) | The total outstanding face value of debt instruments issued by the United States Treasury, updated every business day down to the exact penny. |
| Primary URL(s) | Fiscal Data Portal: https://fiscaldata.treasury.gov/datasets/debt-to-the-penny/ ; API Endpoint: `https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v2/accounting/od/debt_to_penny` |
| Cadence | Daily; updated every business day at 4:00 PM Eastern Time for the prior business day. |
| Web access model | **FREE** (Universal open access, interactive filtering, CSV and JSON direct exports). |
| API access model | **FREE** (Fiscal Data Treasury API requires **no API key**, no registration, open access with pagination up to 10,000 records per call). |
| Bulk/history | Complete daily historical debt values from 1790 to present downloadable via Fiscal Data bulk downloads. |
| Revision policy | Daily Treasury accounting figures are final audited statements for the recorded date; not subject to routine revisions. |
| Caveats | Media coverage universally cites *Total Public Debt Outstanding* (e.g., $34+ Trillion), which combines **Debt Held by the Public** (Treasuries held by individuals, institutions, and foreign governments) and **Intragovernmental Holdings** (money the Treasury owes to government trust funds like Social Security and Medicare). Debt Held by the Public is the economically relevant figure for market borrowing pressure. |
| Layer | Primary (Terminal Federal Authority) |
| Alternate free paths | FRED: Series `GFDEBTN` (Quarterly Total Public Debt); TreasuryDirect.gov. |
| Verified | 2026-10-15 via Fiscal Data Treasury API live query. |

---

## Domain 5: Consumer Confidence, Business Sentiment, and Economic Expectations

Confidence and sentiment surveys represent the primary **MIXED-access** cluster in macroeconomic tracking. While non-profit research boards, universities, and professional associations release headline numbers freely to news organizations, detailed microdata, historical time series, and demographic breakdowns are gated behind commercial subscriptions.

### 5.1 The Conference Board Consumer Confidence Index

| Field | Content |
|---|---|
| Indicator (media name) | Consumer Confidence ("Conference Board Consumer Confidence") |
| Official name / program | Consumer Confidence Survey® |
| Publisher | The Conference Board (Independent Non-Profit Business Research Organization) |
| Series or report identity | Consumer Confidence Index (CCI); Present Situation Index; Expectations Index |
| Definition (one line) | Monthly survey measuring consumers' attitudes, buying intentions, vacation plans, and expectations regarding current and future business and employment conditions. |
| Primary URL(s) | Landing: https://www.conference-board.org/topics/consumer-confidence ; Newsroom: https://www.conference-board.org/newsroom |
| Cadence | Monthly; released on the last Tuesday of each month at 10:00 AM Eastern Time. |
| Web access model | **MIXED** (Headline press release, top-line index, and summary charts are **FREE** on the public newsroom; full historical dataset, regional cuts, and demographic tables require **PAID-SUB**). |
| API access model | **PAID-SUB** (Enterprise data feed / Bloomberg terminal subscription; no free developer API). |
| Bulk/history | Free historical data limited to charts in press releases; complete time series back to 1967 requires corporate membership. |
| Revision policy | Preliminary index published on release day; benchmarked and finalized with the subsequent month's release. |
| Caveats | Highly sensitive to employment perceptions: questions heavily weight whether jobs are "plentiful" or "hard to get." Can diverge sharply from the University of Michigan sentiment index. |
| Layer | Primary (Survey Owner / Commercial Non-Profit) |
| Alternate free paths | Financial news aggregators (CNBC, Bloomberg, MarketWatch); FRED does *not* mirror the full current series due to strict licensing restrictions. |
| Verified | 2026-10-15 via The Conference Board newsroom portal. |

### 5.2 University of Michigan Surveys of Consumers (Consumer Sentiment)

| Field | Content |
|---|---|
| Indicator (media name) | Consumer Sentiment ("Michigan Sentiment Index", "Inflation Expectations") |
| Official name / program | Surveys of Consumers, University of Michigan |
| Publisher | Survey Research Center, Institute for Social Research, University of Michigan |
| Series or report identity | Index of Consumer Sentiment (ICS); Current Economic Conditions (ICC); Index of Consumer Expectations (ICE); 1-Year and 5-Year Inflation Expectations |
| Definition (one line) | Monthly telephone survey of U.S. households assessing consumer financial conditions, personal economic attitudes, and short- and long-term inflation expectations. |
| Primary URL(s) | Portal: https://sca.isr.umich.edu/ ; Tables: https://data.sca.isr.umich.edu/data-archive/mine.php |
| Cadence | Twice monthly: Preliminary release on the second or third Friday at 10:00 AM ET; Final release on the fourth Friday at 10:00 AM ET. |
| Web access model | **MIXED** (Headline preliminary and final index numbers and 1Y/5Y inflation expectation numbers are **FREE** on public web page; raw microdata requires free academic registration). |
| API access model | **FREE-REG** (Free registered access for academic researchers; FRED API republishes final headline index). |
| Bulk/history | Historical tables available in PDF and Excel format on the official website; FRED hosts final series `UMCSENT` back to 1952. |
| Revision policy | Preliminary reading is revised two weeks later in the final reading; final readings are not revised retrospectively. |
| Caveats | The University of Michigan's **1-Year Inflation Expectations** and **5-Year Inflation Expectations** components are monitored closely by the Federal Reserve to ensure consumer inflation expectations remain anchored. |
| Layer | Primary (Academic Survey Owner) |
| Alternate free paths | FRED: Series `UMCSENT` (Headline Sentiment Index), `MICH` (1-Year Inflation Expectations). |
| Verified | 2026-10-15 via University of Michigan Survey of Consumers portal. |

### 5.3 Institute for Supply Management (ISM) Manufacturing and Services PMIs

| Field | Content |
|---|---|
| Indicator (media name) | The PMI ("ISM Manufacturing Index", "ISM Services Index") |
| Official name / program | ISM Report On Business® (Manufacturing and Services) |
| Publisher | Institute for Supply Management (ISM) (Professional Association) |
| Series or report identity | Manufacturing PMI (Headline); Services PMI (Headline); Sub-indexes: New Orders, Employment, Prices Paid, Supplier Deliveries |
| Definition (one line) | Monthly diffusion indexes derived from purchasing and supply executives reflecting expansion (above 50.0) or contraction (below 50.0) in manufacturing and services sectors. |
| Primary URL(s) | Portal: https://www.ismworld.org/supply-management-news-and-reports/reports/ism-report-on-business/ |
| Cadence | Monthly: Manufacturing PMI released on the 1st business day of each month at 10:00 AM ET; Services PMI released on the 3rd business day at 10:00 AM ET. |
| Web access model | **MIXED** (Headline diffusion indexes and comprehensive narrative press releases are **FREE** on ISM website; full historical database and raw underlying series require ISM membership or **PAID-SUB**). |
| API access model | **PAID-SUB** (Commercial redistributors only; no public REST API). |
| Bulk/history | Full historical time series back to 1948 available only to paid subscribers; press releases archived on website. |
| Revision policy | Annual seasonal adjustment revisions conducted each February covering the prior four years. |
| Caveats | 50.0 is the critical watershed: a reading above 50.0 indicates economic expansion; below 50.0 indicates contraction. A reading above 42.5 generally indicates overall GDP expansion even if manufacturing itself is contracting. Broadcasts often isolate the "Prices Paid" sub-index as an early inflation warning. |
| Layer | Primary (Professional Association / Proprietary Owner) |
| Alternate free paths | Financial media wire summaries (Reuters, AP, Bloomberg); historical diffusion benchmarks mirrored in FRED (subject to licensing lags). |
| Verified | 2026-10-15 via Institute for Supply Management official portal. |

### 5.4 NFIB Small Business Optimism Index

| Field | Content |
|---|---|
| Indicator (media name) | Small Business Optimism ("Main Street Confidence Index", "NFIB Survey") |
| Official name / program | Small Business Economic Trends (SBET) |
| Publisher | National Federation of Independent Business (NFIB) Research Center |
| Series or report identity | NFIB Small Business Optimism Index; Single Most Important Problem Breakdown |
| Definition (one line) | Monthly composite index tracking small business owners' profit expectations, sales outlook, capital expenditure plans, and hiring challenges. |
| Primary URL(s) | Portal: https://www.nfib.com/surveys/small-business-economic-trends/ ; Full Report PDF: https://www.nfib.com/assets/SBET-Current.pdf |
| Cadence | Monthly; released on the second Tuesday of each month at 6:00 AM Eastern Time. |
| Web access model | **FREE** (Complete 20+ page monthly PDF report, executive summary, and sub-indicator charts are **100% FREE** with no registration required). |
| API access model | **FREE-KEY** (Available through FRED API; NFIB provides direct PDF downloads). |
| Bulk/history | Historical time series from 1974 to present available in the appendix tables of each monthly PDF report. |
| Revision policy | Monthly survey figures are final upon publication; not revised retrospectively. |
| Caveats | NFIB's survey represents independent small business owners (Main Street), which frequently exhibits a strong political correlation with regulatory and tax policy debates. The "Single Most Important Problem" table tracks whether owners view inflation, labor quality, or taxes as their top barrier. |
| Layer | Primary (Business Association) |
| Alternate free paths | FRED: Series `NFIB` (Small Business Optimism Index). |
| Verified | 2026-10-15 via NFIB Small Business Economic Trends portal. |

---

## Domain 6: Energy, Fuels, and Transportation Commodities

Pump prices for gasoline and diesel serve as the most visible daily barometer of inflation for the American voting public. Coverage alternates between weekly federal statistical surveys, daily automobile club crowd-sourced trackers, and global wholesale spot crude benchmarks.

### 6.1 EIA Weekly Retail Gasoline and Diesel Prices

| Field | Content |
|---|---|
| Indicator (media name) | Gas Prices / Diesel Prices ("EIA National Gas Average", "Pump Prices") |
| Official name / program | Weekly Retail Gasoline and Diesel Prices (Form EIA-878 / Form EIA-888) |
| Publisher | U.S. Energy Information Administration (EIA), U.S. Department of Energy |
| Series or report identity | Form EIA-878 (Motor Gasoline); Form EIA-888 (On-Highway Diesel); Petroleum Marketing Monthly |
| Definition (one line) | Weekly volume-weighted survey of retail pump prices for regular, midgrade, and premium gasoline and on-highway diesel fuel across U.S. regions and selected states. |
| Primary URL(s) | Portal: https://www.eia.gov/petroleum/gasdiesel/ ; Open Data API v2: https://www.eia.gov/opendata/ ; Bulk: https://api.eia.gov/bulk |
| Cadence | Weekly; released every Monday between 4:30 PM and 5:00 PM Eastern Time (covers Monday morning retail price collection). |
| Web access model | **FREE** (Universal public access, open data tables, interactive charting, CSV downloads). |
| API access model | **FREE-KEY** (EIA API v2 requires free API key; generous rate limit up to 9,000 req/hour, 5,000 rows/call; bulk ZIP downloads require no key). |
| Bulk/history | Complete historical weekly national, regional, state, and city retail prices back to 1990 downloadable via EIA bulk manifest archives. |
| Revision policy | Survey figures are finalized on publication; revisions are rare and occur only if a major reporting entity submits corrected historical volumes. |
| Caveats | The EIA survey is a volume-weighted statistical sample representing prices collected Monday morning. It is published Monday evening. It reflects weekly averages rather than intraday spot price spikes. |
| Layer | Primary (Terminal Federal Authority) |
| Alternate free paths | FRED: Series `GASREGCOVW` (US Regular All Formulations); Department of Energy Open Data. |
| Verified | 2026-10-15 via EIA Petroleum Marketing portal and API documentation. |

### 6.2 AAA Daily Fuel Gauge Report

| Field | Content |
|---|---|
| Indicator (media name) | AAA Gas Average ("Daily National Gas Price Average") |
| Official name / program | AAA Gas Prices (powered by OPIS - Oil Price Information Service) |
| Publisher | American Automobile Association (AAA) in partnership with OPIS |
| Series or report identity | AAA National, State, and Metro Gas Price Averages |
| Definition (one line) | Daily survey tracking credit card swipe transaction prices at over 130,000 retail fueling stations nationwide. |
| Primary URL(s) | Portal: https://gasprices.aaa.com/ |
| Cadence | Daily; updated every morning around 3:00 AM Eastern Time. |
| Web access model | **FREE** (Universal public access on web page, interactive national and state maps). |
| API access model | **PAID-SUB** (Underlying OPIS raw data feed requires commercial licensing; no open public REST API). |
| Bulk/history | Public web portal displays current day, yesterday, week ago, month ago, and year ago averages; deep historical database is proprietary to OPIS. |
| Revision policy | Daily station credit card transactions finalized overnight; historical averages updated continuously. |
| Caveats | AAA reports real-time transactional prices based on fleet and consumer credit card swipes. Because it updates daily, cable television networks routinely cite AAA during rapid oil price shocks when waiting for the weekly Monday EIA report would feel outdated. |
| Layer | Commercial / Association Tracker (Secondary Layer) |
| Alternate free paths | GasBuddy (consumer crowd-sourced app); EIA weekly official reports. |
| Verified | 2026-10-15 via AAA Gas Prices official web portal. |

### 6.3 Benchmark Spot Crude Oil Prices (WTI and Brent)

| Field | Content |
|---|---|
| Indicator (media name) | Oil Prices ("Crude Oil", "WTI Crude", "Brent Crude") |
| Official name / program | Spot Prices for Crude Oil (Cushing, OK WTI and Europe Brent) |
| Publisher | U.S. Energy Information Administration (EIA) / S&P Global Platts |
| Series or report identity | WTI Spot Price FOB Cushing (`DCOILWTICO`); Brent Spot Price FOB Europe (`DCOILBRENTEU`) |
| Definition (one line) | Daily spot transaction price per barrel for West Texas Intermediate light sweet crude delivered at Cushing, Oklahoma, and North Sea Brent crude. |
| Primary URL(s) | Portal: https://www.eia.gov/dnav/pet/pet_pri_spt_s1_d.htm ; FRED WTI: https://fred.stlouisfed.org/series/DCOILWTICO |
| Cadence | Daily; EIA publishes daily spot history weekly on Wednesdays; financial exchanges quote continuous live futures. |
| Web access model | **FREE** (Universal public access on EIA and FRED websites). |
| API access model | **FREE-KEY** (EIA API v2 and FRED API provide free daily spot history). |
| Bulk/history | Continuous daily spot price history back to 1986 for WTI and 1987 for Brent. |
| Revision policy | Spot cash prices are published as recorded by commodity price assessment agencies; not revised retrospectively. |
| Caveats | Political shows cite oil prices because crude oil represents roughly 50-60% of the cost of a gallon of retail gasoline. WTI is the U.S. domestic benchmark; Brent is the global waterborne benchmark. Domestic pump prices track WTI closely in the Midwest and Gulf Coast, but coastal refineries often price off Brent. |
| Layer | Primary (Federal Aggregator / Commodity Assessment Source) |
| Alternate free paths | FRED: Series `DCOILWTICO` and `DCOILBRENTEU`; NYMEX/ICE exchange summaries. |
| Verified | 2026-10-15 via EIA Spot Prices portal. |

---

## Domain 7: Equity Market Closes, Volatility, and Market Breadth

Daily closing stock prices represent the most ubiquitous economic soundbite in television news. However, equity index data is governed by the most restrictive commercial intellectual property and redistribution licensing frameworks of any domain.

### 7.1 Dow Jones Industrial Average (DJIA)

| Field | Content |
|---|---|
| Indicator (media name) | The Dow ("Dow Jones", "The Industrial Average") |
| Official name / program | Dow Jones Industrial Average® (DJIA) |
| Publisher | S&P Dow Jones Indices LLC (S&P Global / CME Group Joint Venture) |
| Series or report identity | Ticker: `DJIA` / `^DJI`; FRED Series: `DJIA` |
| Definition (one line) | Price-weighted equity index tracking 30 prominent, large-cap U.S. corporations listed on the New York Stock Exchange and Nasdaq. |
| Primary URL(s) | Owner Portal: https://www.spglobal.com/spdji/en/indices/equity/dow-jones-industrial-average/ ; FRED Series: https://fred.stlouisfed.org/series/DJIA |
| Cadence | Daily; continuous real-time trading during regular market hours (9:30 AM - 4:00 PM ET); official close established at 4:00 PM Eastern Time. |
| Web access model | **FREE** (Official daily closing values published freely on S&P DJI website and major financial news portals; delayed 15 minutes during trading day). |
| API access model | **DELAYED-FREE / PAID-SUB** (Commercial redistributors like Alpha Vantage, EODHD, and Financial Modeling Prep offer limited free tiers with delayed data; real-time feeds require direct exchange and S&P DJI licensing fees). |
| Bulk/history | Complete daily closing history back to 1896 mirrored for free on FRED (`DJIA`). |
| Revision policy | Historical closing prices are fixed; divisor adjustments occur during corporate stock splits and constituent substitutions. |
| Caveats | The Dow is a *price-weighted* index, meaning higher-priced stocks have a disproportionate impact on the index value regardless of company market capitalization. Professional economists and institutional investors view the S&P 500 as a far more representative gauge of the macroeconomy. |
| Layer | Primary (Commercial Index Owner) |
| Alternate free paths | FRED (`DJIA`); Yahoo Finance (`^DJI`); Google Finance; CNBC; MarketWatch. |
| Verified | 2026-10-15 via S&P Dow Jones Indices official index profile. |

### 7.2 S&P 500 Index

| Field | Content |
|---|---|
| Indicator (media name) | The S&P 500 ("The S&P", "The Broad Market") |
| Official name / program | S&P 500® Index |
| Publisher | S&P Dow Jones Indices LLC |
| Series or report identity | Ticker: `SPX` / `^GSPC`; FRED Series: `SP500` |
| Definition (one line) | Float-adjusted market-capitalization-weighted index tracking 500 leading publicly traded U.S. corporations covering approximately 80% of available market capitalization. |
| Primary URL(s) | Owner Portal: https://www.spglobal.com/spdji/en/indices/equity/sp-500/ ; FRED Series: https://fred.stlouisfed.org/series/SP500 |
| Cadence | Daily; official close calculated at 4:00 PM Eastern Time. |
| Web access model | **FREE** (Universal public access for daily closing prices; 15-minute delayed intraday). |
| API access model | **DELAYED-FREE / PAID-SUB** (Free tiers via commercial financial APIs for delayed/historical closes; commercial licensing required for real-time applications). |
| Bulk/history | Complete daily closing history back to 1957 accessible on FRED (`SP500`) and financial portals. |
| Revision policy | Closing index values are permanent; quarterly constituent rebalancing. |
| Caveats | Highly concentrated: because it is market-cap weighted, the top 10 mega-cap technology corporations represent over 30% of the entire index weighting. Cable news anchors frequently cite the S&P 500 as shorthand for household 401(k) retirement portfolio health. |
| Layer | Primary (Commercial Index Owner) |
| Alternate free paths | FRED: Series `SP500`; Yahoo Finance (`^GSPC`); Cboe. |
| Verified | 2026-10-15 via S&P Dow Jones Indices official portal. |

### 7.3 Nasdaq Composite Index

| Field | Content |
|---|---|
| Indicator (media name) | The Nasdaq ("Tech-Heavy Nasdaq") |
| Official name / program | Nasdaq Composite Index® |
| Publisher | Nasdaq, Inc. (Securities Exchange and Financial Technology Corporation) |
| Series or report identity | Ticker: `COMP` / `^IXIC`; FRED Series: `NASDAQCOM` |
| Definition (one line) | Market-capitalization-weighted index of all common stocks and similar securities listed on the Nasdaq stock market (over 3,000 domestic and international companies). |
| Primary URL(s) | Exchange Portal: https://www.nasdaq.com/market-activity/index/comp ; FRED: https://fred.stlouisfed.org/series/NASDAQCOM |
| Cadence | Daily; official market close at 4:00 PM Eastern Time. |
| Web access model | **FREE** (Universal public access on Nasdaq.com and financial news portals). |
| API access model | **DELAYED-FREE / PAID-SUB** (Nasdaq Data Link provides free and commercial datasets; basic delayed closing feeds available via standard financial APIs). |
| Bulk/history | Historical daily closing series back to 1971 available on FRED (`NASDAQCOM`). |
| Revision policy | Closing levels are fixed; index rebalanced continuously based on listings and corporate actions. |
| Caveats | Heavily weighted toward technology, biotechnology, and communications sectors. Does not include financial institutions (which are excluded from the Nasdaq-100). |
| Layer | Primary (Exchange / Index Owner) |
| Alternate free paths | FRED: Series `NASDAQCOM`; Yahoo Finance (`^IXIC`). |
| Verified | 2026-10-15 via Nasdaq.com market activity portal. |

### 7.4 Cboe Volatility Index (VIX - The Fear Gauge)

| Field | Content |
|---|---|
| Indicator (media name) | The VIX ("Wall Street Fear Gauge", "Volatility Index") |
| Official name / program | Cboe Volatility Index® (VIX®) |
| Publisher | Cboe Global Markets, Inc. (Securities and Derivatives Exchange) |
| Series or report identity | Ticker: `VIX`; FRED Series: `VIXCLS` |
| Definition (one line) | Benchmark index calculating the market's expectation of 30-day forward-looking volatility derived from real-time mid-quote prices of S&P 500 call and put options. |
| Primary URL(s) | Portal: https://www.cboe.com/tradable_products/vix/ ; Historical CSV Archive: https://www.cboe.com/tradable_products/vix/vix_historical_data/ |
| Cadence | Daily; closes at 4:15 PM Eastern Time. |
| Web access model | **FREE** (Cboe hosts direct, open public downloads of complete historical daily closing data in CSV format back to 1990 with no registration). |
| API access model | **FREE-KEY** (FRED API mirrors daily close `VIXCLS`; commercial derivatives API feeds require Cboe exchange licensing). |
| Bulk/history | Free official CSV download (`vixcurrent.csv`) provided directly by Cboe containing daily open, high, low, and close from 1990 to present. |
| Revision policy | Calculated using mathematically derived options settlement formulas; historical closes are fixed. |
| Caveats | The VIX does not measure price direction; it measures anticipated annualized volatility in percentage points. A reading of 20 represents an expected annualized move of 20% over the next 30 days. Readout below 15 indicates market complacency; above 30 indicates elevated market panic. |
| Layer | Primary (Derivatives Exchange / Index Owner) |
| Alternate free paths | FRED: Series `VIXCLS`; Yahoo Finance (`^VIX`). |
| Verified | 2026-10-15 via Cboe VIX Historical Data portal. |
