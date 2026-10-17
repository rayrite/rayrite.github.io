# Deliverable F: Master Resource Catalog
## Unified Technical Inventory Across Federal, Nationwide, and Sub-State Systems

**Document Identifier:** `CIVIC-DOC-05-MASTER-CATALOG`  
**Research Execution Date:** October 17, 2026  
**Specification Standard:** 36-Field Canonical Resource Schema  

---

## 1. Compact High-Scannability Display Table

In compliance with Section 16.F of the handoff specification, the table below provides a scannable executive overview across verified civic systems:

| Resource ID | Topic Category | Geographic Scope | Product URL | Executive Summary | Public Access | Developer Interface | Reuse Limitations | Verified Date |
|---|---|---|---|---|---|---|---|---|
| `FED-LEG-CONGRESS-API` | Legislation and gove | United States nationwi | [Congress.gov REST ](https://www.congress.gov/) | Authoritative federal legislative API pr... | Free | API | Public domain (17 U.S.C. ... | 2026-10-17 |
| `FED-CAM-OPENFEC` | Ballots, candidates, | United States nationwi | [OpenFEC REST API](https://www.fec.gov/) | Official REST API and bulk data service ... | Free | API | Public domain, BUT STRICT... | 2026-10-17 |
| `FED-PUB-GOVINFO` | Legislation and gove | United States nationwi | [GovInfo API](https://www.govinfo.gov/) | Automated repository providing digitally... | Free | API | Public domain (17 U.S.C. ... | 2026-10-17 |
| `FED-GEO-CENSUS-API` | Voting and election  | United States nationwi | [U.S. Census Geocod](https://geocoding.geo.census.gov/) | Authoritative federal geocoding service ... | Free | API | Public domain. Unrestrict... | 2026-10-17 |
| `NAT-ELE-VIP-SPEC` | Voting and election  | United States nationwi | [Voting Information](https://votinginfoproject.org/) | Standardized data format and XML schema ... | Free | Feed | Creative Commons Attribut... | 2026-10-17 |
| `NAT-ELE-GOOGLE-CIVIC` | Voting and election  | United States nationwi | [Google Civic Infor](https://developers.google.com/civic-information) | Hosted REST API providing elected repres... | Freemium | API | Commercial permissive und... | 2026-10-17 |
| `NAT-LEG-OPENSTATES-V3` | Legislation and gove | All 50 U.S. states, Di | [Open States REST A](https://openstates.org/) | Open civic technology data platform aggr... | Freemium | API | Open data license for com... | 2026-10-17 |
| `NAT-LEG-LEGISCAN-API` | Legislation and gove | United States Congress | [LegiScan API](https://legiscan.com/) | Commercial-grade legislative data engine... | Freemium | API | Standard license requires... | 2026-10-17 |
| `NAT-CRT-COURTLISTENER` | Courts, judges, and  | United States Federal  | [CourtListener REST](https://www.courtlistener.com/) | Nonprofit legal database providing progr... | Freemium | API | Public domain primary cou... | 2026-10-17 |
| `NAT-ELE-BALLOTPEDIA-API` | Ballots, candidates, | United States nationwi | [Ballotpedia Data C](https://ballotpedia.org/) | Comprehensive commercial API delivering ... | Subscription | API | Proprietary copyright. Re... | 2026-10-17 |
| `NAT-LOC-CHRONICLING` | Journalism, communit | United States nationwi | [Chronicling Americ](https://www.loc.gov/collections/chronicling-america/) | Historic American newspapers from 1770 t... | Free | API | Public domain for pre-192... | 2026-10-17 |
| `NAT-CAM-OPENSECRETS-BULK` | Ballots, candidates, | United States federal  | [OpenSecrets Bulk D](https://www.opensecrets.org/) | Comprehensive bulk data files harmonizin... | Registration required | Bulk download | Creative Commons Attribut... | 2026-10-17 |

---

## 2. Granular 36-Field Master Resource Profiles

Every catalog entry below includes all 36 mandatory fields defined in Section 10 of the handoff specification:

### Resource Profile: `FED-LEG-CONGRESS-API` — Congress.gov REST API

* **1. `resource_id`:** `FED-LEG-CONGRESS-API`
* **2. `resource_name`:** Congress.gov REST API
* **3. `provider_name`:** Library of Congress
* **4. `provider_type`:** `Government`
* **5. `primary_category`:** Legislation and government action
* **6. `secondary_categories`:** Federal bills, Roll-call votes, Committee activity, Nominations
* **7. `government_level`:** `Federal`
* **8. `jurisdiction_ids`:** `US`
* **9. `geographic_coverage`:** United States nationwide (Federal Congress)
* **10. `product_url`:** [https://www.congress.gov/](https://www.congress.gov/)
* **11. `search_or_portal_url`:** [https://api.congress.gov/](https://api.congress.gov/)
* **12. `executive_summary`:** Authoritative federal legislative API providing structured JSON/XML endpoints for bills, amendments, member profiles, committee reports, roll-call floor votes, and nominations.
* **13. `content_types`:** Bills, Resolutions, Amendments, Committee Reports, Floor Votes, Nominations
* **14. `entity_types`:** Bills, People (Members), Committees, Votes, Nominations
* **15. `historical_coverage`:** 1973 (93rd Congress) to present; selected historical backfill
* **16. `update_frequency`:** Continuous during legislative session; hourly synchronization
* **17. `content_formats`:** JSON, XML, HTML
* **18. `languages`:** English
* **19. `content_access`:** `Free`
* **20. `pricing_summary`:** Free public service; no fees
* **21. `developer_access`:** API, Bulk download
* **22. `developer_docs_url`:** [https://github.com/LibraryOfCongress/api.congress.gov](https://github.com/LibraryOfCongress/api.congress.gov)
* **23. `api_or_feed_urls`:** [https://api.congress.gov/v3/bill](https://api.congress.gov/v3/bill), [https://api.congress.gov/v3/member](https://api.congress.gov/v3/member)
* **24. `authentication`:** API key passed via X-Api-Key header or query parameter
* **25. `developer_constraints`:** Standard 5,000 requests per hour; rate limit tracked in X-RateLimit headers
* **26. `license_and_reuse`:** Public domain (17 U.S.C. § 105). Unrestricted redistribution, storage, and commercial use.
* **27. `terms_and_license_urls`:** [https://www.congress.gov/help/using-data-offsite](https://www.congress.gov/help/using-data-offsite)
* **28. `recommended_integration`:** Poll /v3/bill endpoint using updateDate parameters; cache responses in relational store
* **29. `monitoring_support`:** HTTP ETag, update timestamps on records, GitHub issue changelog
* **30. `coverage_limitations`:** Committee hearing transcripts occasionally lag live testimony by several weeks
* **31. `accessibility_and_offline`:** Digital API; bound Congressional Record volumes held in Federal Depository Libraries
* **32. `verification_status`:** `Verified live`
* **33. `last_verified_at`:** `2026-10-17T03:58:24Z`
* **34. `evidence_urls`:** [https://api.congress.gov/](https://api.congress.gov/), [https://github.com/LibraryOfCongress/api.congress.gov](https://github.com/LibraryOfCongress/api.congress.gov)
* **35. `confidence`:** `High`
* **36. `notes`:** Primary system of record for all federal legislative applications.

---

### Resource Profile: `FED-CAM-OPENFEC` — OpenFEC REST API

* **1. `resource_id`:** `FED-CAM-OPENFEC`
* **2. `resource_name`:** OpenFEC REST API
* **3. `provider_name`:** Federal Election Commission
* **4. `provider_type`:** `Government`
* **5. `primary_category`:** Ballots, candidates, and officeholders
* **6. `secondary_categories`:** Campaign finance, Independent expenditures, PAC filings
* **7. `government_level`:** `Federal`
* **8. `jurisdiction_ids`:** `US`
* **9. `geographic_coverage`:** United States nationwide (Federal elections)
* **10. `product_url`:** [https://www.fec.gov/](https://www.fec.gov/)
* **11. `search_or_portal_url`:** [https://api.open.fec.gov/developers/](https://api.open.fec.gov/developers/)
* **12. `executive_summary`:** Official REST API and bulk data service providing candidate receipts, disbursements, committee registrations, PAC independent expenditures, and donor disclosures.
* **13. `content_types`:** Campaign Finance Filings, Contributions, Disbursements, Candidate Registrations
* **14. `entity_types`:** Candidates, Committees, Donors, PACs, Filings
* **15. `historical_coverage`:** 1979–1980 election cycle to present
* **16. `update_frequency`:** Nightly bulk processing; daily transaction updates
* **17. `content_formats`:** JSON, CSV
* **18. `languages`:** English
* **19. `content_access`:** `Free`
* **20. `pricing_summary`:** Free public access; no fees
* **21. `developer_access`:** API, Bulk download
* **22. `developer_docs_url`:** [https://api.open.fec.gov/swagger/](https://api.open.fec.gov/swagger/)
* **23. `api_or_feed_urls`:** [https://api.open.fec.gov/v1/candidates/](https://api.open.fec.gov/v1/candidates/), [https://api.open.fec.gov/v1/schedules/schedule_a/](https://api.open.fec.gov/v1/schedules/schedule_a/)
* **24. `authentication`:** api.data.gov API key passed via query parameter or header
* **25. `developer_constraints`:** 1,000 req/hr default; 7,200 req/hr upon email application; 100 results per page
* **26. `license_and_reuse`:** Public domain, BUT STRICTLY RESTRICTED by 52 U.S.C. § 30111(a)(4): donor names/addresses CANNOT be used for commercial solicitation or fundraising.
* **27. `terms_and_license_urls`:** [https://www.fec.gov/legal-resources/regulations/](https://www.fec.gov/legal-resources/regulations/)
* **28. `recommended_integration`:** Use REST API for candidate and committee summaries; use nightly bulk CSVs for transaction-level analysis
* **29. `monitoring_support`:** Daily updated timestamps; RSS feeds for new committee registrations
* **30. `coverage_limitations`:** Does not cover state or local campaign finance
* **31. `accessibility_and_offline`:** Digital database; historical microfilm reports available at FEC Public Records Office
* **32. `verification_status`:** `Verified live`
* **33. `last_verified_at`:** `2026-10-17T03:58:29Z`
* **34. `evidence_urls`:** [https://api.open.fec.gov/developers/](https://api.open.fec.gov/developers/), [https://github.com/fecgov/openFEC](https://github.com/fecgov/openFEC)
* **35. `confidence`:** `High`
* **36. `notes`:** Strict statutory ban on commercial solicitation using donor data must be architecturally enforced.

---

### Resource Profile: `FED-PUB-GOVINFO` — GovInfo API

* **1. `resource_id`:** `FED-PUB-GOVINFO`
* **2. `resource_name`:** GovInfo API
* **3. `provider_name`:** U.S. Government Publishing Office
* **4. `provider_type`:** `Government`
* **5. `primary_category`:** Legislation and government action
* **6. `secondary_categories`:** Codified statutes, Code of Federal Regulations, Congressional Record
* **7. `government_level`:** `Federal`
* **8. `jurisdiction_ids`:** `US`
* **9. `geographic_coverage`:** United States nationwide
* **10. `product_url`:** [https://www.govinfo.gov/](https://www.govinfo.gov/)
* **11. `search_or_portal_url`:** [https://api.govinfo.gov/docs](https://api.govinfo.gov/docs)
* **12. `executive_summary`:** Automated repository providing digitally signed, authenticated electronic publications of official federal documents including the United States Code and Federal Register.
* **13. `content_types`:** Statutes, Regulations, Court Opinions, Hearing Transcripts, Presidential Docs
* **14. `entity_types`:** Documents, Packages, Granules, Committees
* **15. `historical_coverage`:** 1994 to present; historical retro-digitization back to 1789 for select collections
* **16. `update_frequency`:** Continuous / Multiple releases daily
* **17. `content_formats`:** JSON, XML, PDF, MODS
* **18. `languages`:** English
* **19. `content_access`:** `Free`
* **20. `pricing_summary`:** Free public access
* **21. `developer_access`:** API, Bulk download
* **22. `developer_docs_url`:** [https://api.govinfo.gov/docs](https://api.govinfo.gov/docs)
* **23. `api_or_feed_urls`:** [https://api.govinfo.gov/collections](https://api.govinfo.gov/collections), [https://api.govinfo.gov/packages](https://api.govinfo.gov/packages)
* **24. `authentication`:** api.data.gov API key
* **25. `developer_constraints`:** 36,000 requests per hour (1,200 req/min, 40 req/sec)
* **26. `license_and_reuse`:** Public domain (17 U.S.C. § 105). Free commercial and educational reuse.
* **27. `terms_and_license_urls`:** [https://www.govinfo.gov/about](https://www.govinfo.gov/about)
* **28. `recommended_integration`:** Direct REST API ingestion for full text statutory XML packages and PDF archives
* **29. `monitoring_support`:** Collection publish date index; sitemaps; automated notifications
* **30. `coverage_limitations`:** Scanned legacy volumes prior to 1994 rely on OCR with minor character errors
* **31. `accessibility_and_offline`:** Digital repository; physical depository items accessible at 1,100+ FDLP partner libraries
* **32. `verification_status`:** `Verified live`
* **33. `last_verified_at`:** `2026-10-17T03:59:04Z`
* **34. `evidence_urls`:** [https://api.govinfo.gov/docs](https://api.govinfo.gov/docs)
* **35. `confidence`:** `High`
* **36. `notes`:** Gold standard for digitally signed, tamper-evident federal legal texts.

---

### Resource Profile: `FED-GEO-CENSUS-API` — U.S. Census Geocoder API

* **1. `resource_id`:** `FED-GEO-CENSUS-API`
* **2. `resource_name`:** U.S. Census Geocoder API
* **3. `provider_name`:** U.S. Census Bureau
* **4. `provider_type`:** `Government`
* **5. `primary_category`:** Voting and election administration
* **6. `secondary_categories`:** Precincts and boundaries, Address resolution, TIGER GIS
* **7. `government_level`:** `Federal`
* **8. `jurisdiction_ids`:** `US`
* **9. `geographic_coverage`:** United States nationwide and all territories
* **10. `product_url`:** [https://geocoding.geo.census.gov/](https://geocoding.geo.census.gov/)
* **11. `search_or_portal_url`:** [https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress](https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress)
* **12. `executive_summary`:** Authoritative federal geocoding service translating residential street addresses into latitude/longitude coordinates, Census blocks, tracts, and Congressional District boundaries.
* **13. `content_types`:** Geographic Coordinates, Census Blocks, Census Tracts, Congressional Districts
* **14. `entity_types`:** Addresses, Geographic Entities, Districts
* **15. `historical_coverage`:** Decennial Census 2010, 2020, and Current Benchmark releases
* **16. `update_frequency`:** Bi-annually tied to TIGER database benchmark releases
* **17. `content_formats`:** JSON, XML, CSV
* **18. `languages`:** English
* **19. `content_access`:** `Free`
* **20. `pricing_summary`:** Completely free public utility
* **21. `developer_access`:** API, Bulk export
* **22. `developer_docs_url`:** [https://geocoding.geo.census.gov/geocoder/](https://geocoding.geo.census.gov/geocoder/)
* **23. `api_or_feed_urls`:** [https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress](https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress), [https://geocoding.geo.census.gov/geocoder/geographies/addressbatch](https://geocoding.geo.census.gov/geocoder/geographies/addressbatch)
* **24. `authentication`:** None required (Open public API)
* **25. `developer_constraints`:** Unthrottled under ordinary usage; batch file limit 10,000 records per POST
* **26. `license_and_reuse`:** Public domain. Unrestricted redistribution and commercial utilization.
* **27. `terms_and_license_urls`:** [https://www.census.gov/about/policies.html](https://www.census.gov/about/policies.html)
* **28. `recommended_integration`:** Primary address-to-district resolution component in registration and voter guide pipelines
* **29. `monitoring_support`:** Benchmark release versioning (`Public_AR_Current`)
* **30. `coverage_limitations`:** Does not map local municipal voting precincts or ward-level boundaries directly
* **31. `accessibility_and_offline`:** Web service; raw TIGER/Line shapefiles available for offline GIS server deployment
* **32. `verification_status`:** `Verified live`
* **33. `last_verified_at`:** `2026-10-17T03:59:20Z`
* **34. `evidence_urls`:** [https://geocoding.geo.census.gov/](https://geocoding.geo.census.gov/)
* **35. `confidence`:** `High`
* **36. `notes`:** Foundational spatial resolution infrastructure for civic tech platforms.

---

### Resource Profile: `NAT-ELE-VIP-SPEC` — Voting Information Project (VIP) Specification

* **1. `resource_id`:** `NAT-ELE-VIP-SPEC`
* **2. `resource_name`:** Voting Information Project (VIP) Specification
* **3. `provider_name`:** Democracy Works
* **4. `provider_type`:** `Nonprofit`
* **5. `primary_category`:** Voting and election administration
* **6. `secondary_categories`:** Polling locations, Ballot drop boxes, Contest feeds
* **7. `government_level`:** `Multilevel`
* **8. `jurisdiction_ids`:** `US`
* **9. `geographic_coverage`:** United States nationwide (participating states and counties)
* **10. `product_url`:** [https://votinginfoproject.org/](https://votinginfoproject.org/)
* **11. `search_or_portal_url`:** [https://github.com/votinginfoproject/vip-specification](https://github.com/votinginfoproject/vip-specification)
* **12. `executive_summary`:** Standardized data format and XML schema used by state election officials and commercial platforms to publish official polling places, drop boxes, and candidate contest data.
* **13. `content_types`:** Polling Locations, Drop Boxes, Early Vote Sites, Ballot Contests, Candidates
* **14. `entity_types`:** Elections, Precincts, Polling Places, Contests, Candidates
* **15. `historical_coverage`:** 2008 to present (Versions 3.0 through 6.0)
* **16. `update_frequency`:** Continuous updates during active election cycles
* **17. `content_formats`:** XML, JSON, Shapefile
* **18. `languages`:** English, Spanish, Multilingual support in v6.0
* **19. `content_access`:** `Free`
* **20. `pricing_summary`:** Open-source specification; free implementation
* **21. `developer_access`:** Feed, Bulk download
* **22. `developer_docs_url`:** [https://github.com/votinginfoproject/vip-specification](https://github.com/votinginfoproject/vip-specification)
* **23. `api_or_feed_urls`:** [https://github.com/votinginfoproject/vip-specification/tree/master/vip_spec.xsd](https://github.com/votinginfoproject/vip-specification/tree/master/vip_spec.xsd)
* **24. `authentication`:** None required for schema; state feed authentication varies
* **25. `developer_constraints`:** Feeds generated by state election management vendors during election windows
* **26. `license_and_reuse`:** Creative Commons Attribution 4.0 International (CC BY 4.0)
* **27. `terms_and_license_urls`:** [https://votinginfoproject.org/](https://votinginfoproject.org/)
* **28. `recommended_integration`:** Parse official state VIP XML feeds directly or ingest via Google Civic Information API
* **29. `monitoring_support`:** GitHub commit log; state election calendar coordination
* **30. `coverage_limitations`:** Only available in states that actively publish VIP feeds; inactive between major election cycles
* **31. `accessibility_and_offline`:** Digital feed specification; feeds translate into physical voting site directories
* **32. `verification_status`:** `Verified live`
* **33. `last_verified_at`:** `2026-10-17T03:59:36Z`
* **34. `evidence_urls`:** [https://github.com/votinginfoproject/vip-specification](https://github.com/votinginfoproject/vip-specification)
* **35. `confidence`:** `High`
* **36. `notes`:** Industry standard schema powering major national voter information tools.

---

### Resource Profile: `NAT-ELE-GOOGLE-CIVIC` — Google Civic Information API

* **1. `resource_id`:** `NAT-ELE-GOOGLE-CIVIC`
* **2. `resource_name`:** Google Civic Information API
* **3. `provider_name`:** Google LLC
* **4. `provider_type`:** `Commercial`
* **5. `primary_category`:** Voting and election administration
* **6. `secondary_categories`:** Elected officials, Polling locations, OCD-ID mapping
* **7. `government_level`:** `Multilevel`
* **8. `jurisdiction_ids`:** `US`
* **9. `geographic_coverage`:** United States nationwide
* **10. `product_url`:** [https://developers.google.com/civic-information](https://developers.google.com/civic-information)
* **11. `search_or_portal_url`:** [https://developers.google.com/civic-information/docs/v2](https://developers.google.com/civic-information/docs/v2)
* **12. `executive_summary`:** Hosted REST API providing elected representative lookup by street address and address-specific ballot contest and polling place queries during supported elections.
* **13. `content_types`:** Elected Officials, Polling Places, Drop Boxes, Ballot Contests, OCD-IDs
* **14. `entity_types`:** People (Officials), Offices, Divisions, Polling Places, Contests
* **15. `historical_coverage`:** Current officeholders; active election cycles only
* **16. `update_frequency`:** Continuous for representatives; election-driven for voterinfo
* **17. `content_formats`:** JSON
* **18. `languages`:** English
* **19. `content_access`:** `Freemium`
* **20. `pricing_summary`:** Free tier up to 25,000 queries per day; enterprise billing available
* **21. `developer_access`:** API
* **22. `developer_docs_url`:** [https://developers.google.com/civic-information/docs/v2](https://developers.google.com/civic-information/docs/v2)
* **23. `api_or_feed_urls`:** [https://www.googleapis.com/civicinfo/v2/representatives](https://www.googleapis.com/civicinfo/v2/representatives), [https://www.googleapis.com/civicinfo/v2/voterinfo](https://www.googleapis.com/civicinfo/v2/voterinfo)
* **24. `authentication`:** Google Cloud API key
* **25. `developer_constraints`:** 25,000 requests per day default quota; address-specific rate limits
* **26. `license_and_reuse`:** Commercial permissive under Google Cloud Platform Terms of Service
* **27. `terms_and_license_urls`:** [https://developers.google.com/terms](https://developers.google.com/terms)
* **28. `recommended_integration`:** Core endpoint for user address to elected representative mapping; dynamic ballot lookup
* **29. `monitoring_support`:** Google Cloud Monitoring and quota metrics
* **30. `coverage_limitations`:** voterinfo endpoint returns 404/empty when no active election is registered for an address
* **31. `accessibility_and_offline`:** Cloud web API exclusively
* **32. `verification_status`:** `Verified live`
* **33. `last_verified_at`:** `2026-10-17T03:58:41Z`
* **34. `evidence_urls`:** [https://developers.google.com/civic-information](https://developers.google.com/civic-information)
* **35. `confidence`:** `High`
* **36. `notes`:** Essential utility for rapid prototype and production representative resolution.

---

### Resource Profile: `NAT-LEG-OPENSTATES-V3` — Open States REST API v3

* **1. `resource_id`:** `NAT-LEG-OPENSTATES-V3`
* **2. `resource_name`:** Open States REST API v3
* **3. `provider_name`:** Plural Policy
* **4. `provider_type`:** `Commercial`
* **5. `primary_category`:** Legislation and government action
* **6. `secondary_categories`:** 50-state bills, Legislative votes, Legislators by coordinate
* **7. `government_level`:** `State`
* **8. `jurisdiction_ids`:** `US-ALL`
* **9. `geographic_coverage`:** All 50 U.S. states, District of Columbia, and Puerto Rico
* **10. `product_url`:** [https://openstates.org/](https://openstates.org/)
* **11. `search_or_portal_url`:** [https://v3.openstates.org/](https://v3.openstates.org/)
* **12. `executive_summary`:** Open civic technology data platform aggregating bills, votes, committee memberships, and legislator geographic boundaries across all state legislatures.
* **13. `content_types`:** State Bills, Roll Call Votes, Legislators, Committees, Events
* **14. `entity_types`:** Bills, People (Legislators), Committees, Jurisdictions, Votes
* **15. `historical_coverage`:** 2010 to present across most states; selected states back to 2000
* **16. `update_frequency`:** Multiple scrapers run daily during active legislative sessions
* **17. `content_formats`:** JSON, CSV bulk
* **18. `languages`:** English, Spanish (Puerto Rico)
* **19. `content_access`:** `Freemium`
* **20. `pricing_summary`:** Free community tier with API key; commercial subscriptions for Plural Pro
* **21. `developer_access`:** API, Bulk download
* **22. `developer_docs_url`:** [https://docs.openstates.org/api-v3/](https://docs.openstates.org/api-v3/)
* **23. `api_or_feed_urls`:** [https://v3.openstates.org/bills](https://v3.openstates.org/bills), [https://v3.openstates.org/people.geo](https://v3.openstates.org/people.geo)
* **24. `authentication`:** API key passed via X-API-KEY header or apikey query parameter
* **25. `developer_constraints`:** Rate limits enforced per rolling minute/day on free tier
* **26. `license_and_reuse`:** Open data license for community tier; commercial redistribution requires agreement
* **27. `terms_and_license_urls`:** [https://pluralpolicy.com/terms/](https://pluralpolicy.com/terms/)
* **28. `recommended_integration`:** Query /people.geo for state legislative district lookups; batch bill status sync
* **29. `monitoring_support`:** Open States GitHub scraper repositories; status alerts
* **30. `coverage_limitations`:** Scraper breakages can cause 24-48 hour lags during state website updates
* **31. `accessibility_and_offline`:** Web API; bulk data exports available for local indexing
* **32. `verification_status`:** `Verified live`
* **33. `last_verified_at`:** `2026-10-17T03:59:00Z`
* **34. `evidence_urls`:** [https://docs.openstates.org/api-v3/](https://docs.openstates.org/api-v3/), [https://v3.openstates.org/docs/](https://v3.openstates.org/docs/)
* **35. `confidence`:** `High`
* **36. `notes`:** Premier open-source community platform for multi-state legislative ingestion.

---

### Resource Profile: `NAT-LEG-LEGISCAN-API` — LegiScan API

* **1. `resource_id`:** `NAT-LEG-LEGISCAN-API`
* **2. `resource_name`:** LegiScan API
* **3. `provider_name`:** LegiScan LLC
* **4. `provider_type`:** `Commercial`
* **5. `primary_category`:** Legislation and government action
* **6. `secondary_categories`:** State legislation, Roll call votes, Bill text search
* **7. `government_level`:** `Multilevel`
* **8. `jurisdiction_ids`:** `US, US-ALL`
* **9. `geographic_coverage`:** United States Congress and all 50 State Legislatures
* **10. `product_url`:** [https://legiscan.com/](https://legiscan.com/)
* **11. `search_or_portal_url`:** [https://legiscan.com/legiscan-api](https://legiscan.com/legiscan-api)
* **12. `executive_summary`:** Commercial-grade legislative data engine providing normalized JSON data covering state and federal bills, full text documents, amendments, sponsors, and roll call votes.
* **13. `content_types`:** Bills, Bill Texts, Amendments, Roll Calls, Sponsors
* **14. `entity_types`:** Bills, Legislators, Votes, Sessions, Amendments
* **15. `historical_coverage`:** 2009 to present across all 50 states and Congress
* **16. `update_frequency`:** Real-time to hourly polling; Push API delivers within 15 minutes
* **17. `content_formats`:** JSON, MIME/PDF/HTML text
* **18. `languages`:** English
* **19. `content_access`:** `Freemium`
* **20. `pricing_summary`:** Free tier: 10,000-30,000 queries/mo; Paid Pull & Push tiers scale by state count
* **21. `developer_access`:** API, Feed, Webhook
* **22. `developer_docs_url`:** [https://legiscan.com/legiscan-api](https://legiscan.com/legiscan-api)
* **23. `api_or_feed_urls`:** [https://api.legiscan.com/?key=...&op=getMasterList](https://api.legiscan.com/?key=...&op=getMasterList)
* **24. `authentication`:** API key passed as URL parameter
* **25. `developer_constraints`:** Free tier capped monthly; enterprise Push streaming avoids polling limits
* **26. `license_and_reuse`:** Standard license requires attribution; Whitebox license permits unbranded commercial redistribution
* **27. `terms_and_license_urls`:** [https://legiscan.com/legiscan-api](https://legiscan.com/legiscan-api)
* **28. `recommended_integration`:** Enterprise push webhooks for mission-critical legislative alerting
* **29. `monitoring_support`:** Change hashes for bill updates; Push API automated webhooks
* **30. `coverage_limitations`:** Does not cover municipal or county-level ordinances
* **31. `accessibility_and_offline`:** Cloud RPC API; national weekly bulk archives available
* **32. `verification_status`:** `Verified live`
* **33. `last_verified_at`:** `2026-10-17T03:58:51Z`
* **34. `evidence_urls`:** [https://legiscan.com/legiscan-api](https://legiscan.com/legiscan-api)
* **35. `confidence`:** `High`
* **36. `notes`:** Highly reliable commercial backbone for multi-state legislative intelligence.

---

### Resource Profile: `NAT-CRT-COURTLISTENER` — CourtListener REST API v4

* **1. `resource_id`:** `NAT-CRT-COURTLISTENER`
* **2. `resource_name`:** CourtListener REST API v4
* **3. `provider_name`:** Free Law Project
* **4. `provider_type`:** `Nonprofit`
* **5. `primary_category`:** Courts, judges, and legal proceedings
* **6. `secondary_categories`:** PACER RECAP dockets, Legal opinions, Judicial disclosures, Oral audio
* **7. `government_level`:** `Multilevel`
* **8. `jurisdiction_ids`:** `US, US-ALL`
* **9. `geographic_coverage`:** United States Federal Courts and all 50 State Appellate Courts
* **10. `product_url`:** [https://www.courtlistener.com/](https://www.courtlistener.com/)
* **11. `search_or_portal_url`:** [https://www.courtlistener.com/api/rest/v4/](https://www.courtlistener.com/api/rest/v4/)
* **12. `executive_summary`:** Nonprofit legal database providing programmatic access to federal and state court opinions, RECAP PACER dockets, judicial biographical data, and oral argument audio recordings.
* **13. `content_types`:** Court Opinions, Dockets, Filings, Judges, Financial Disclosures, Oral Arguments
* **14. `entity_types`:** Cases, Dockets, Judges, Courts, Audio Files
* **15. `historical_coverage`:** 1754 to present; comprehensive federal coverage and major state appellate backfill
* **16. `update_frequency`:** Continuous / Real-time ingestion via RECAP extensions and court scrapers
* **17. `content_formats`:** JSON, PDF, MP3, PostgreSQL dump
* **18. `languages`:** English
* **19. `content_access`:** `Freemium`
* **20. `pricing_summary`:** Free tier: 125 req/day; Paid memberships start at $10/mo; institutional tiers available
* **21. `developer_access`:** API, Bulk download, Database replication, Webhooks
* **22. `developer_docs_url`:** [https://free.law/wiki/api-v4/](https://free.law/wiki/api-v4/)
* **23. `api_or_feed_urls`:** [https://www.courtlistener.com/api/rest/v4/opinions/](https://www.courtlistener.com/api/rest/v4/opinions/), [https://www.courtlistener.com/api/rest/v4/dockets/](https://www.courtlistener.com/api/rest/v4/dockets/)
* **24. `authentication`:** Authorization header (`Authorization: Token <key>`)
* **25. `developer_constraints`:** Free tier: 5 req/min, 50 req/hr, 125 req/day on rolling window basis
* **26. `license_and_reuse`:** Public domain primary court documents; API access governed by Free Law Project terms
* **27. `terms_and_license_urls`:** [https://free.law/about/](https://free.law/about/)
* **28. `recommended_integration`:** Direct REST API for case search; PostgreSQL logical replication for enterprise backends
* **29. `monitoring_support`:** Case alerts API; search alerts; real-time webhooks
* **30. `coverage_limitations`:** State trial court coverage is limited to crowdsourced or specific partner scrapers
* **31. `accessibility_and_offline`:** Web API; bulk CSV files; on-site archival court references
* **32. `verification_status`:** `Verified live`
* **33. `last_verified_at`:** `2026-10-17T03:58:33Z`
* **34. `evidence_urls`:** [https://free.law/](https://free.law/), [https://www.courtlistener.com/api/rest/v4/](https://www.courtlistener.com/api/rest/v4/)
* **35. `confidence`:** `High`
* **36. `notes`:** Indispensable non-profit resource for liberating paywalled PACER court records.

---

### Resource Profile: `NAT-ELE-BALLOTPEDIA-API` — Ballotpedia Data Client API

* **1. `resource_id`:** `NAT-ELE-BALLOTPEDIA-API`
* **2. `resource_name`:** Ballotpedia Data Client API
* **3. `provider_name`:** Ballotpedia (Lucy Burns Institute)
* **4. `provider_type`:** `Commercial`
* **5. `primary_category`:** Ballots, candidates, and officeholders
* **6. `secondary_categories`:** Candidate profiles, Ballot measures, School boards, Judicial retention
* **7. `government_level`:** `Multilevel`
* **8. `jurisdiction_ids`:** `US, US-ALL`
* **9. `geographic_coverage`:** United States nationwide across federal, state, and top 100 metropolitan areas
* **10. `product_url`:** [https://ballotpedia.org/](https://ballotpedia.org/)
* **11. `search_or_portal_url`:** [https://developer.ballotpedia.org/](https://developer.ballotpedia.org/)
* **12. `executive_summary`:** Comprehensive commercial API delivering structured data on candidates, ballot measures, elected officials, election dates, and voting districts based on geographic coordinates.
* **13. `content_types`:** Candidates, Elections, Ballot Measures, Officeholders, Districts
* **14. `entity_types`:** People (Candidates), Offices, Ballot Measures, Districts, Elections
* **15. `historical_coverage`:** 2012 to present comprehensive; historical coverage for major federal/state races
* **16. `update_frequency`:** Continuous updates by professional editorial staff during election filing cycles
* **17. `content_formats`:** JSON, CSV bulk
* **18. `languages`:** English
* **19. `content_access`:** `Subscription`
* **20. `pricing_summary`:** Commercial annual subscription packages; sales quote required (`data@ballotpedia.org`)
* **21. `developer_access`:** API, Bulk export
* **22. `developer_docs_url`:** [https://developer.ballotpedia.org/](https://developer.ballotpedia.org/)
* **23. `api_or_feed_urls`:** [https://api4.ballotpedia.org/elections_by_point](https://api4.ballotpedia.org/elections_by_point), [https://api4.ballotpedia.org/officeholders](https://api4.ballotpedia.org/officeholders)
* **24. `authentication`:** API token and origin domain whitelisting (CORS protection)
* **25. `developer_constraints`:** Geographic API: 5 RPS, 100 burst, 200,000 queries per 24 hours; Bulk API: 50 requests/day
* **26. `license_and_reuse`:** Proprietary copyright. Redistribution of raw dataset strictly prohibited; external app embedding allowed with anti-scraping safeguards.
* **27. `terms_and_license_urls`:** [https://developer.ballotpedia.org/dictionaries-and-terms/terms-of-use](https://developer.ballotpedia.org/dictionaries-and-terms/terms-of-use)
* **28. `recommended_integration`:** Query /elections_by_point to populate sample ballots and local candidate dossiers
* **29. `monitoring_support`:** API usage endpoint (/usage); account executive status briefings
* **30. `coverage_limitations`:** Local coverage outside top 100 cities is selective; candidate survey response varies
* **31. `accessibility_and_offline`:** Web API; digital encyclopedia
* **32. `verification_status`:** `Verified live`
* **33. `last_verified_at`:** `2026-10-17T03:58:46Z`
* **34. `evidence_urls`:** [https://developer.ballotpedia.org/](https://developer.ballotpedia.org/)
* **35. `confidence`:** `High`
* **36. `notes`:** Premier commercial data source for nonpartisan candidate and ballot measure intelligence.

---

### Resource Profile: `NAT-LOC-CHRONICLING` — Chronicling America Historic Newspapers API

* **1. `resource_id`:** `NAT-LOC-CHRONICLING`
* **2. `resource_name`:** Chronicling America Historic Newspapers API
* **3. `provider_name`:** Library of Congress
* **4. `provider_type`:** `Government`
* **5. `primary_category`:** Journalism, community, print, and archives
* **6. `secondary_categories`:** Historical newspapers, Public notices, Civil archives
* **7. `government_level`:** `Multilevel`
* **8. `jurisdiction_ids`:** `US, US-ALL`
* **9. `geographic_coverage`:** United States nationwide (all 50 states, DC, Puerto Rico)
* **10. `product_url`:** [https://www.loc.gov/collections/chronicling-america/](https://www.loc.gov/collections/chronicling-america/)
* **11. `search_or_portal_url`:** [https://www.loc.gov/apis/json-and-yaml/](https://www.loc.gov/apis/json-and-yaml/)
* **12. `executive_summary`:** Historic American newspapers from 1770 to 1963, searchable via the unified Library of Congress JSON API for historical election notices, candidate profiles, and legal advertisements.
* **13. `content_types`:** Newspaper Pages, Articles, Advertisements, Legal Notices, OCR Text
* **14. `entity_types`:** Newspapers, Issues, Pages, Holdings
* **15. `historical_coverage`:** 1770 to 1963 (strongest coverage 1836–1922)
* **16. `update_frequency`:** Bi-monthly batch additions by state partner libraries
* **17. `content_formats`:** JSON, TIFF, PDF, METS/ALTO XML
* **18. `languages`:** English, Spanish, German, French, Multilingual
* **19. `content_access`:** `Free`
* **20. `pricing_summary`:** Completely free public service
* **21. `developer_access`:** API, Bulk download
* **22. `developer_docs_url`:** [https://www.loc.gov/apis/json-and-yaml/](https://www.loc.gov/apis/json-and-yaml/)
* **23. `api_or_feed_urls`:** [https://www.loc.gov/collections/chronicling-america/?fo=json](https://www.loc.gov/collections/chronicling-america/?fo=json)
* **24. `authentication`:** None required
* **25. `developer_constraints`:** Standard LoC API rate limits (approx. 20 requests per second)
* **26. `license_and_reuse`:** Public domain for pre-1928 content; open access for digitized newspapers
* **27. `terms_and_license_urls`:** [https://www.loc.gov/legal/](https://www.loc.gov/legal/)
* **28. `recommended_integration`:** Query LoC JSON API using newspaper directory parameters and keyword filters for historical context
* **29. `monitoring_support`:** LoC collections RSS feeds and API changelog
* **30. `coverage_limitations`:** Standalone API deprecated; all access migrated into core LoC JSON API architecture
* **31. `accessibility_and_offline`:** Digital portal; master 35mm microfilm negative reels preserved at state historical societies
* **32. `verification_status`:** `Verified live`
* **33. `last_verified_at`:** `2026-10-17T03:59:07Z`
* **34. `evidence_urls`:** [https://www.loc.gov/apis/json-and-yaml/](https://www.loc.gov/apis/json-and-yaml/)
* **35. `confidence`:** `High`
* **36. `notes`:** Verified migration: legacy chroniclingamerica.loc.gov API retired in favor of loc.gov JSON.

---

### Resource Profile: `NAT-CAM-OPENSECRETS-BULK` — OpenSecrets Bulk Data Program

* **1. `resource_id`:** `NAT-CAM-OPENSECRETS-BULK`
* **2. `resource_name`:** OpenSecrets Bulk Data Program
* **3. `provider_name`:** Center for Responsive Politics
* **4. `provider_type`:** `Nonprofit`
* **5. `primary_category`:** Ballots, candidates, and officeholders
* **6. `secondary_categories`:** Campaign finance, Lobbying disclosures, 527 committees, Personal finances
* **7. `government_level`:** `Multilevel`
* **8. `jurisdiction_ids`:** `US, US-ALL`
* **9. `geographic_coverage`:** United States federal and state campaign finance
* **10. `product_url`:** [https://www.opensecrets.org/](https://www.opensecrets.org/)
* **11. `search_or_portal_url`:** [https://www.opensecrets.org/bulk-data](https://www.opensecrets.org/bulk-data)
* **12. `executive_summary`:** Comprehensive bulk data files harmonizing federal and state campaign contributions, federal lobbying registrations, 527 groups, and personal financial disclosures.
* **13. `content_types`:** Campaign Contributions, PAC Data, Lobbying Filings, Personal Finances
* **14. `entity_types`:** Donors, Candidates, Committees, Lobbyists, Clients
* **15. `historical_coverage`:** 1989 to present (Federal); 2000 to present (State)
* **16. `update_frequency`:** Periodic cycle updates; historical backfill archives
* **17. `content_formats`:** CSV (compressed zip)
* **18. `languages`:** English
* **19. `content_access`:** `Registration required`
* **20. `pricing_summary`:** Free for non-commercial research; paid commercial licensing agreements required
* **21. `developer_access`:** Bulk download
* **22. `developer_docs_url`:** [https://www.opensecrets.org/bulk-data](https://www.opensecrets.org/bulk-data)
* **23. `api_or_feed_urls`:** [https://www.opensecrets.org/bulk-data](https://www.opensecrets.org/bulk-data)
* **24. `authentication`:** User registration and authenticated web download token
* **25. `developer_constraints`:** CRITICAL DISCOVERY: REST API is DISCONTINUED; bulk file downloads only
* **26. `license_and_reuse`:** Creative Commons Attribution-NonCommercial-ShareAlike 4.0 (CC BY-NC-SA 4.0)
* **27. `terms_and_license_urls`:** [https://www.opensecrets.org/about/terms.php](https://www.opensecrets.org/about/terms.php)
* **28. `recommended_integration`:** Download annual compressed CSV datasets, load into PostgreSQL data warehouse, apply standardization scripts
* **29. `monitoring_support`:** Email notices for new cycle data releases
* **30. `coverage_limitations`:** No real-time API; data reflects cleaned, standardized post-election reconciliations
* **31. `accessibility_and_offline`:** Digital bulk files; web research portal
* **32. `verification_status`:** `Verified live (Bulk only)`
* **33. `last_verified_at`:** `2026-10-17T03:59:44Z`
* **34. `evidence_urls`:** [https://www.opensecrets.org/bulk-data](https://www.opensecrets.org/bulk-data)
* **35. `confidence`:** `High`
* **36. `notes`:** Vital correction: API is retired; bulk data program is active and robust.

---
