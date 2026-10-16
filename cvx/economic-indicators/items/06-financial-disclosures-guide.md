# 06. Federal and State Personal Financial Disclosures: Statutory Regimes, Filing Systems, and Derived Trackers

**Verified as of:** 2026-10-15  
**Document Purpose:** This guide serves as the definitive reference manual for researching, retrieving, and interpreting public personal financial disclosures filed by U.S. elected officials, executive branch leaders, federal judges, and active candidates. It covers the governing statutory authorities, filing repositories, document schemas, retrieval workflows, known technical obstacles, commercial/civic derived trackers, and an analytical overview of the state and local disclosure landscape.

---

## 1. Statutory Foundations and Legal Governance

Public financial disclosures in the United States are governed primarily by two landmark federal statutes:

1. **Ethics in Government Act of 1978 (EIGA, Pub. L. 95-521, 5 U.S.C. §§ 13101-13111):** Passed in the aftermath of the Watergate scandal, EIGA established mandatory, annual public financial disclosure requirements for high-ranking officials across all three branches of the federal government (Executive, Legislative, and Judicial) as well as active federal candidates. EIGA mandates disclosure of outside earned income, honoraria, assets and investment income, liabilities, positions held outside government, agreements/arrangements (such as future employment or pensions), and gifts.
2. **Stop Trading on Congressional Knowledge Act of 2012 (STOCK Act, Pub. L. 112-105):** Enacted to prohibit the use of non-public congressional knowledge for private investment profit and to reaffirm that insider trading laws apply to members of Congress and executive branch officials. Crucially, the STOCK Act established the **Periodic Transaction Report (PTR)** requirement, mandating that covered officials disclose any purchase, sale, or exchange of stocks, bonds, commodity futures, or other securities exceeding $1,000 within **30 days of receiving notice** of the transaction, and no later than **45 days after the transaction date**.

### Statutory Prohibitions on Public Report Use
Under 5 U.S.C. § 13107(a), federal law strictly regulates the use of obtained financial disclosure reports. It is unlawful for any individual or organization to obtain or use a report for:
* Any unlawful purpose;
* Any commercial purpose, **other than by news and communications media for dissemination to the general public**;
* Determining or establishing the credit rating of any individual; or
* Directly or indirectly soliciting money for any political, charitable, or other purpose.

The Attorney General is authorized to bring civil actions against any person who violates these provisions, with statutory penalties up to $10,000 or more per violation.

---

## 2. Federal Personal Financial Disclosure Regimes (The Centerpiece)

Federal disclosure is fundamentally decentralized: while statutory standards originate in EIGA, each constitutional branch and congressional chamber maintains its own administrative filing repository, software interface, and document retrieval protocol.

### 2.1 Regime 1: U.S. House of Representatives

| Field | Content |
|---|---|
| System name | House Financial Disclosure Portal / Office of the Clerk Public Disclosure |
| Authority / legal basis | Committee on Ethics, U.S. House of Representatives; 5 U.S.C. §§ 13101-13111; House Rule 26 |
| Who files | All 435 voting Members of the House, 6 Delegates/Resident Commissioner; non-incumbent candidates for House seats who raise or spend in excess of $5,000; House officers and senior staff earning at or above the senior staff pay threshold (120% of GS-15 step 1). |
| Document types | Annual Financial Disclosure (Form A / Form B); Periodic Transaction Reports (Form PTR); Candidate Reports; New Filer Reports; Termination Reports; Extension Requests; Amendments; Blind Trust Approvals. |
| Schedule | Annual disclosures due on or before **May 15** for the prior calendar year. Periodic Transaction Reports (PTRs) due within **30 days of notice, max 45 days after transaction**. Candidates file within 30 days of qualifying or May 15, whichever is later, but at least 30 days prior to election. |
| Where filed / retrieved | Public Search Portal: https://disclosures-clerk.house.gov/FinancialDisclosure ; Electronic Filing System: https://fd.house.gov/ |
| Formats | Search results return links to PDF documents. System historically mixes born-digital PDF forms (fillable/e-filed) with scanned paper documents (including handwritten forms). |
| API / bulk | **No official REST API.** The Clerk provides annual downloadable index files in XML format containing filer metadata and links to document PDFs (`https://disclosures-clerk.house.gov/public_disc/financial-search/FinancialDisclosureDatabase.zip`). |
| Access model | **FREE** (Universal open public access, no registration, no authentication required). |
| Practical obstacles | Filings are stored as static PDFs; substantial numbers of annual filings and amendments are submitted on scanned paper, requiring Optical Character Recognition (OCR) to extract asset tables. Asset values are reported in broad statutory valuation brackets (e.g., $1,001 - $15,000; $15,001 - $50,000; $50,001 - $100,000) rather than exact dollar amounts. |
| Derived resources | Capitol Trades (capitoltrades.com); Unusual Whales (unusualwhales.com/politics); Quiver Quantitative (quiverquant.com); HouseStockWatcher. |
| Verified | 2026-10-15 via live traversal of disclosures-clerk.house.gov. |

### 2.2 Regime 2: U.S. Senate

| Field | Content |
|---|---|
| System name | Senate Electronic Financial Disclosure (eFD) System |
| Authority / legal basis | Select Committee on Ethics, U.S. Senate; Secretary of the Senate (Office of Public Records); 5 U.S.C. §§ 13101-13111; Senate Rule 34 |
| Who files | All 100 U.S. Senators; active candidates for the U.S. Senate; Senate officers and covered senior committee and personal staff. |
| Document types | Annual Reports; Periodic Transaction Reports (PTRs); Candidate Reports; New Filer Reports; Termination Reports; Extension Requests; Letters of Due Diligence. |
| Schedule | Annual reports due **May 15**. PTRs due within **30 days of notification, max 45 days after transaction**. Up to 90 days of extensions may be granted for good cause upon formal written request. |
| Where filed / retrieved | Public Search Portal: https://efdsearch.senate.gov/search/ ; Filer Gateway: https://efd.senate.gov/ |
| Formats | Electronic filings render as structured interactive HTML pages (`/search/view/ptr/{UUID}/`) printable to PDF. Non-electronic legacy filings and handwritten amendments render as scanned multi-page TIFF/PDF images. |
| API / bulk | **No official developer API.** No official bulk download facility for raw filings. |
| Access model | **FREE-REG (Agreement Required)**: Free of charge, but users must pass a mandatory interactive checkbox acknowledging statutory EIGA use restrictions and agreeing not to use the data for commercial or credit-scoring purposes before search queries execute. |
| Practical obstacles | The eFD portal uses dynamic session cookies and CSRF tokens, preventing simple `curl` scraping. Filings submitted on paper require manual transcription or advanced OCR. Valuation ranges prevent precise portfolio net worth calculations. |
| Derived resources | SenateStockWatcher; Quiver Quantitative; Capitol Trades; OpenSecrets. |
| Verified | 2026-10-15 via live query to efdsearch.senate.gov. |

### 2.3 Regime 3: Executive Branch Filers and Nominees

| Field | Content |
|---|---|
| System name | OGE Form 278e / Form 201 Public Disclosure System |
| Authority / legal basis | U.S. Office of Government Ethics (OGE); 5 U.S.C. §§ 13101-13111; 5 C.F.R. Part 2634 |
| Who files | The President, Vice President; all Senate-confirmed Presidential Appointees (PAS); non-career Senior Executive Service (SES); Schedule C political appointees; senior White House staff; agency ethics officials. |
| Document types | OGE Form 278e (Executive Branch Personnel Public Financial Disclosure Report); OGE Form 278-T (Periodic Transaction Report); Ethics Agreements; Certificates of Divestiture (CD); Waiver Certifications. |
| Schedule | Annual reports due **May 15**. Periodic Transaction Reports (OGE Form 278-T) due within **30 days of notice, max 45 days after transaction**. Nominee reports must be transmitted to OGE and the Senate committee within 5 days of nomination. |
| Where filed / retrieved | OGE Public Portal: https://www.oge.gov/ ; Level 1 & 2 Direct Portal: https://extapps2.oge.gov/ ; Form 201 Request Gateway: https://extapps2.oge.gov/201/Presiden.nsf |
| Formats | Standardized PDF generated from OGE's electronic filing system (*Integrity*). |
| API / bulk | **No official REST API.** |
| Access model | **MIXED**: Level 1 and Level 2 Cabinet officers, President, and VP disclosures are posted for direct **FREE** download on the OGE website. Disclosures for other covered executive officials require submitting an **OGE Form 201** online inspection request (**FREE-REG**), which logs the requester's name, organization, and address before generating download links. |
| Practical obstacles | Filings for lower-level covered executive officials are not indexed in a single searchable database; they must be requested on an official-by-official basis via Form 201. Filings are reviewed and certified by agency ethics officials prior to OGE posting, which can introduce administrative publication lags. |
| Derived resources | ProPublica Trump Administration / Biden Administration Appointee Trackers; OpenSecrets Executive Branch Tracker. |
| Verified | 2026-10-15 via OGE official systems portal. |

### 2.4 Regime 4: Presidential and Vice-Presidential Candidates

| Field | Content |
|---|---|
| System name | Presidential and Vice-Presidential Candidate Disclosure System |
| Authority / legal basis | 5 U.S.C. § 13103(c); 5 C.F.R. § 2634.201; Federal Election Commission / OGE Coordination |
| Who files | Any individual who qualifies as an official candidate for President or Vice President of the United States under the Federal Election Campaign Act (raising or spending > $5,000). |
| Document types | OGE Form 278e (Candidate Report); Extension Notifications; Ethics Commitments; Amendments. |
| Schedule | Due within **30 days of becoming a candidate** or on or before **May 15** of the applicable calendar year, whichever is later, but no later than **30 days prior to the general election**. If candidacy continues across multiple calendar years, annual reports are due on **May 15** each year. |
| Where filed / retrieved | **Dual-Agency Administrative Path:** Candidates submit completed Form 278e to the **Federal Election Commission (FEC)**. The FEC retains public copies and forwards copies to the **Office of Government Ethics (OGE)** for formal compliance review and certification. Public access available via OGE Candidate Portal (https://www.oge.gov) and FEC Public Records Office. |
| Formats | Multi-page PDF reports (typically comprehensive schedules covering hundreds of asset holdings, book royalties, and speaking honoraria). |
| API / bulk | **No direct API.** Downloadable via web pages. |
| Access model | **FREE** (Universal open public download on OGE website under "Presidential and Vice Presidential Candidate Disclosures"). |
| Practical obstacles | Candidates routinely file for 45-day statutory extensions (granted by the FEC), meaning initial financial disclosures often do not become public until late summer of an election year. Private business holdings, LLCs, and real estate partnerships are reported at book value or fair market range without detailed income statements. |
| Derived resources | Major investigative newsrooms (Washington Post, NYT, Wall Street Journal); OpenSecrets Presidential Profiles. |
| Verified | 2026-10-15 via OGE and FEC official presidential candidate guides. |

### 2.5 Regime 5: Judicial Branch Disclosures

| Field | Content |
|---|---|
| System name | Judicial Financial Disclosure Portal |
| Authority / legal basis | Courthouse Ethics and Transparency Act of 2022 (Pub. L. 117-125); 5 U.S.C. §§ 13101-13111; Judicial Conference of the United States |
| Who files | Justices of the Supreme Court of the United States; Judges of the U.S. Courts of Appeals, District Courts, and Court of International Trade; Bankruptcy and Magistrate Judges; Senior Judges. |
| Document types | Annual Financial Disclosures; Periodic Transaction Reports (PTRs); Redaction Requests. |
| Schedule | Annual disclosures due **May 15**. Under the Courthouse Ethics and Transparency Act, judicial PTRs must be filed within 45 days of a stock transaction and published online within **90 days** of filing. |
| Where filed / retrieved | Federal Judicial Center / Administrative Office of the U.S. Courts Portal: https://judicialdisclosures.uscourts.gov/ |
| Formats | Searchable PDF documents. |
| API / bulk | **No REST API.** Web-based search portal. |
| Access model | **FREE** (Universal public search launched pursuant to 2022 Act; prior to 2022, required written paper Form AO-10A requests). |
| Practical obstacles | Personal security redactions (home addresses, sensitive family affiliations) are routinely applied by the Judicial Conference Committee on Financial Disclosure. High-volume scraping is subject to web portal rate limits. |
| Derived resources | Free Law Project / CourtListener Financial Disclosures Database (https://www.courtlistener.com/financial-disclosures/); Fix the Court. |
| Verified | 2026-10-15 via judicialdisclosures.uscourts.gov. |

---

## 3. Cross-Regime Document-Type and Filing Deadline Matrix

| Document Category | House of Representatives | U.S. Senate | Executive Branch (OGE) | Presidential Candidates | Federal Judiciary |
|---|---|---|---|---|---|
| **Annual Financial Report** | Form B (May 15) | Annual eFD (May 15) | Form 278e (May 15) | Form 278e (May 15) | Annual JFD (May 15) |
| **Periodic Stock Trade (PTR)** | Form PTR (30/45 Days) | eFD PTR (30/45 Days) | Form 278-T (30/45 Days)| N/A (Candidate Exempt) | Judicial PTR (45 Days) |
| **Candidate Disclosure** | Candidate Form (30d / May 15) | Candidate eFD (30d / May 15)| N/A (Nominee Form 278e)| Form 278e to FEC (30d) | N/A (Judicial Nominee) |
| **Extension Request** | Up to 90 Days total | Up to 90 Days total | Up to 45 Days (Max 90) | Up to 45 Days via FEC | Up to 90 Days total |
| **Termination Report** | Within 30 Days of leaving | Within 30 Days of leaving| Within 30 Days of leaving| N/A | Within 30 Days of leaving|
| **Public Inspection Portal** | `disclosures-clerk.house.gov`| `efdsearch.senate.gov` | `extapps2.oge.gov` | `oge.gov` / `fec.gov` | `judicialdisclosures.uscourts.gov` |

---

## 4. The Derived-Resource Ecosystem: Third-Party Trackers and Commercial APIs

Because raw federal disclosure portals fail to provide developer-friendly REST APIs or structured bulk JSON feeds, an entire ecosystem of civic-tech nonprofits and commercial platforms has emerged to ingest, OCR-parse, normalize, and distribute congressional stock trades and financial disclosures.

| Platform | Primary URL | Core Ingested Source | Added Value & Enhancements | Access Model & Pricing | Provenance to Raw Filings |
|---|---|---|---|---|---|
| **Capitol Trades** | https://www.capitoltrades.com/ | House Clerk & Senate eFD PTRs | Ingests PTRs within hours; normalizes stock tickers, issuers, and transaction sizes; political party breakdown; committee tracking. | **FREEMIUM** (Free web dashboard; enterprise data feeds require institutional subscription via 2iQ Research). | Direct links to official House/Senate source PDFs on every transaction card. |
| **Unusual Whales** | https://unusualwhales.com/politics | House & Senate PTRs | Connects congressional stock trades to option flow activity, SPY benchmark performance comparisons, and member portfolio return tracking. | **FREEMIUM** (Free public political trade summaries; deep portfolio and options alert tools require $20-$50/month subscription). | Provides direct hyperlinks to original House Clerk and Senate eFD filing pages. |
| **Quiver Quantitative** | https://www.quiverquant.com/ | House, Senate, and Lobbying | Tracks congressional trading, government contracts awarded to publicly traded companies, corporate lobbying expenditures, and insider trading. | **FREEMIUM** (Free web charts and basic trade tables; developer REST API and institutional hedge fund data require $35-$100+/mo). | Direct citations and source document links provided. |
| **OpenSecrets** | https://www.opensecrets.org/ | House, Senate, OGE, FEC | Combines personal financial disclosures with FEC campaign donors, 527 organizations, foreign lobbying, and estimated net worth calculations. | **FREE** (Universal free public web search; developer API with 200 free calls/day; bulk data for academic research). | Full cross-jurisdictional provenance back to raw government agency archives. |
| **HouseStockWatcher / SenateStockWatcher** | https://housestockwatcher.com/ | House Clerk XML / Senate eFD | Open-source community scrapers providing clean, automated CSV/JSON dumps of congressional stock transactions. | **FREE** (Open web tables, open-source GitHub data feeds). | Direct URLs to underlying PDF documents. |

---

## 5. Practical Obstacles and In-Terms Developer Extraction Strategies

Automated research and data engineering workflows targeting federal financial disclosures face systemic, structural friction:

### 5.1 Scanned Image PDFs and Handwritten Filings
* **The Obstacle:** Despite the availability of electronic filing systems (*Integrity* in the Executive Branch; House and Senate e-filing portals), members of Congress and candidates retain the legal option to submit paper forms. Hundreds of filings are submitted as handwritten documents, stamped by the Clerk, and scanned as low-resolution 200 DPI PDF or TIFF images.
* **In-Terms Workaround:** Standard PDF text extractors (e.g., `pypdf`, `pdfplumber`) fail on these documents. Production pipelines must route scanned pages through modern OCR libraries (e.g., Tesseract 5, AWS Textract, or Google Cloud Document AI) trained specifically on tabular financial forms.

### 5.2 Broad Statutory Valuation Brackets
* **The Obstacle:** EIGA does not require filers to report exact dollar amounts for assets, income, or stock transactions. Instead, filers select broad statutory valuation categories:
  * Category 1: $1,001 - $15,000
  * Category 2: $15,001 - $50,000
  * Category 3: $50,001 - $100,000
  * Category 4: $100,001 - $250,000
  * Category 5: $250,001 - $500,000
  * Category 6: $500,001 - $1,000,000
  * Category 7: $1,000,001 - $5,000,000
  * Category 8: Over $5,000,000
* **Analytical Implication:** Calculating exact portfolio net worth or capital gains is mathematically impossible from public filings alone. Civic-tech platforms universally calculate **Minimum Net Worth** (summing the floor of each asset range) and **Maximum Net Worth** (summing the ceiling), reporting the midpoint as an estimate.

### 5.3 Redaction and Spousal Asset Ambiguities
* **The Obstacle:** Under EIGA, filers report spousal assets and dependent child holdings, but earned income of spouses is reported only by source (employer name), not dollar amount. Assets held in qualified blind trusts or certain diversified mutual funds are exempt from granular holding disclosure.

---

## 6. State and Local Financial Disclosure Landscape Overview

State and local financial disclosure systems across the 50 states exhibit extreme structural variability, ranging from highly transparent, fully searchable digital portals to opaque regimes requiring physical in-person record inspection.

### 6.1 Structural Governance Archetypes
State disclosure frameworks generally fall into one of three administrative models:
1. **Independent Ethics Commissions:** Autonomous quasi-judicial regulatory bodies with dedicated electronic filing systems and enforcement subpoena powers (e.g., California Fair Political Practices Commission, New York Commission on Ethics and Lobbying in Government, Texas Ethics Commission, Florida Commission on Ethics).
2. **Elections / Secretary of State Divisions:** Ethics and financial disclosures are administered as a minor administrative sub-unit within the state's election agency (e.g., Michigan Department of State, Georgia Government Transparency and Campaign Finance Commission).
3. **Chamber Legislative Ethics Committees:** Self-policing legislative committees with minimal administrative public reporting and heavy reliance on paper records.

### 6.2 Stratified Sample of Representative State Disclosure Portals

The following table analyzes a representative sample across large, mid-sized, and regional state jurisdictions:

| State | Administering Agency | Governing Portal URL | Required Filing Forms | Search & Download Features | Access Model |
|---|---|---|---|---|---|
| **California** | Fair Political Practices Commission (FPPC) | https://www.fppc.ca.gov/ ; NetFile Portal | **Form 700** (Statement of Economic Interests) | Fully searchable digital database; public access to state constitutional officers, legislators, judges, and municipal council members. | **FREE** (Universal public search; open document viewing). |
| **New York** | Commission on Ethics and Lobbying in Government (COELIG) | https://ethics.ny.gov/ | **Annual Statement of Financial Disclosure (FDS)** | Searchable database of filed statements for statewide elected officials, state legislators, and policy-making state employees. | **FREE-REG** (Online public search; certain historic filings require digital inspection request). |
| **Texas** | Texas Ethics Commission (TEC) | https://www.ethics.state.tx.us/ | **Personal Financial Statement (PFS)** | Searchable web directory; downloadable PDF scans of candidate and officeholder statements. | **FREE** (Open web lookup and direct PDF access). |
| **Florida** | Florida Commission on Ethics | https://ethics.state.fl.us/ | **Form 6** (Full and Public Disclosure of Financial Interests) | Electronic Financial Disclosure Management System (EFDMS); mandated digital filing since 2023 for all municipal and state officials. | **FREE** (Direct public search portal). |
| **Michigan** | Michigan Department of State / Bureau of Elections | https://www.michigan.gov/sos/elections/disclosure | **Personal Financial Disclosure Report** (Passed via 2022 Proposal 1, enacted 2023) | Initial implementation portal; requires governor, lieutenant governor, secretary of state, attorney general, and state legislators to file. | **FREE** (Public search system). |
| **Illinois** | Illinois State Board of Elections / Secretary of State | https://www.ilsos.gov/departments/index/home.html | **Statement of Economic Interests (SEI)** | Web lookup system maintained by Index Department of the Secretary of State; searchable by official name. | **FREE** (Open web search). |

### 6.3 National Aggregator Portals and Systemic State-Level Gaps
* **National Conference of State Legislatures (NCSL):** Maintains the authoritative nationwide survey and comparative legal table of state disclosure laws: [NCSL 50-State Table on Financial Disclosure Requirements](https://www.ncsl.org/ethics/50-state-table-on-financial-disclosure-requirements).
* **Systemic State Gaps:** Unlike the federal STOCK Act, **very few states require real-time Periodic Transaction Reports (PTRs)** for stock trades. In the vast majority of U.S. states, legislators and executive officials report their assets and corporate board seats only once per year on annual statements. Furthermore, municipal and county officials in rural jurisdictions are frequently exempt from electronic filing, filing paper statements accessible only via formal state Freedom of Information Act (FOIA) requests.
